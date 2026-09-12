#!/usr/bin/env python3
"""610 JOURNAL アクセス数の自動集計（GA4 Data API / 2026-09-12設置・2026-09-13 journal_auto/ へ移設）

広告・スポンサー営業に出す媒体データ（月間PV・UU・記事別ランキング・流入元・読者層）を
毎月自動で取ってきて CSV に積み上げる。何度実行しても同じ月は上書きされる（冪等）。

置き場所について（2026-09-13）:
    当初は 615_JOURNAL/analytics/ に置いたが、.gitignore の `61*/`（本社フォルダはpushしない）に
    入るため git が追跡できず、GitHub Actions が集計結果を commit できなかった。
    サイト運用の自動化はすべて journal_auto/ に集まっているので、ここへ移した。

使い方:
    python3 fetch_ga4.py                 … 前月分を取得して追記（GitHub Actions が毎月これを叩く）
    python3 fetch_ga4.py --month 2026-09 … 指定した月を取得
    python3 fetch_ga4.py --since 2026-09 … その月から先月までまとめて取得（初回のバックフィル用）
    python3 fetch_ga4.py --summary       … 保存済みCSVから直近12ヶ月のサマリを表示（API不要）
    python3 fetch_ga4.py --selftest      … ダミーデータで保存処理だけ検証（API不要・データは消す）

事前に必要なもの（README.md に手順あり）:
    1. journal_auto/analytics_config.json の ga4_property_id（数字のプロパティID。測定IDとは別物）
    2. サービスアカウントの鍵JSON
       - ローカル: 環境変数 GOOGLE_APPLICATION_CREDENTIALS にパスを入れる
       - GitHub Actions: Secrets の GA4_SA_KEY に鍵JSONの中身を貼る（ワークフローが一時ファイルに書き出す）

出力（すべて data/ 配下）:
    monthly.csv            … 月次サマリ（1行=1ヶ月）。媒体資料の「月間PV」はここ
    articles/YYYY-MM.csv   … 記事別ランキング（どのネタが強いか＝営業トークの武器）
    channels/YYYY-MM.csv   … 流入元（検索/SNS/直接）
    devices/YYYY-MM.csv    … 端末
    audience/YYYY-MM.csv   … 年齢・性別（Googleシグナルが有効な場合のみ。少人数だと空になる）
    latest.json            … 最新月の要約（媒体資料ページの生成元）
"""
from __future__ import annotations

import argparse
import calendar
import csv
import datetime as dt
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
CONFIG = HERE.parent / "analytics_config.json"  # journal_auto/analytics_config.json

MONTHLY_COLS = [
    "month",
    "pageviews",
    "users",
    "new_users",
    "sessions",
    "avg_engagement_sec",
    "engagement_rate",
    "fetched_at",
]


# ------------------------------------------------------------------ 共通
def die(msg: str) -> None:
    print(f"エラー: {msg}", file=sys.stderr)
    sys.exit(1)


def load_config() -> dict:
    if not CONFIG.exists():
        die(f"設定ファイルが無い: {CONFIG}")
    return json.loads(CONFIG.read_text(encoding="utf-8"))


def month_range(month: str) -> tuple[str, str]:
    """'2026-09' → ('2026-09-01', '2026-09-30')"""
    y, m = (int(x) for x in month.split("-"))
    last = calendar.monthrange(y, m)[1]
    return f"{month}-01", f"{month}-{last:02d}"


def prev_month(today: dt.date | None = None) -> str:
    d = today or dt.date.today()
    first = d.replace(day=1)
    last_month = first - dt.timedelta(days=1)
    return last_month.strftime("%Y-%m")


def months_between(start: str, end: str) -> list[str]:
    out, cur = [], start
    while cur <= end:
        out.append(cur)
        y, m = (int(x) for x in cur.split("-"))
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)
        cur = f"{y}-{m:02d}"
    return out


def write_csv(path: Path, header: list[str], rows: list[list]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"  書き込み: {path.relative_to(HERE)}（{len(rows)}行）")


def upsert_monthly(row: dict) -> None:
    """monthly.csv に1ヶ月分を追記。同じ月が既にあれば置き換える（再実行しても行が増えない）"""
    path = DATA / "monthly.csv"
    rows: dict[str, dict] = {}
    if path.exists():
        with path.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                rows[r["month"]] = r
    rows[row["month"]] = row
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=MONTHLY_COLS)
        w.writeheader()
        for m in sorted(rows):
            w.writerow({c: rows[m].get(c, "") for c in MONTHLY_COLS})
    print(f"  書き込み: data/monthly.csv（{len(rows)}ヶ月分）")


# ------------------------------------------------------------------ GA4 取得
def get_client():
    try:
        from google.analytics.data_v1beta import BetaAnalyticsDataClient
    except ImportError:
        die(
            "google-analytics-data が入っていません。\n"
            "　　　　  python3 -m venv .venv && source .venv/bin/activate\n"
            "　　　　  pip install -r requirements.txt"
        )
    if not os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
        die(
            "サービスアカウントの鍵が指定されていません。\n"
            "　　　　  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json\n"
            "　　　　  （取り方は README.md の「2. サービスアカウント」）"
        )
    return BetaAnalyticsDataClient()


def run_report(client, prop: str, start: str, end: str, dims: list[str], mets: list[str], limit: int = 500):
    from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest

    req = RunReportRequest(
        property=f"properties/{prop}",
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name=d) for d in dims],
        metrics=[Metric(name=m) for m in mets],
        limit=limit,
    )
    res = client.run_report(req)
    return [[*(d.value for d in r.dimension_values), *(m.value for m in r.metric_values)] for r in res.rows]


def fetch_month(client, prop: str, month: str) -> dict:
    start, end = month_range(month)
    print(f"\n{month}（{start} 〜 {end}）を取得中…")

    # --- 月次サマリ
    summary = run_report(
        client, prop, start, end,
        dims=[],
        mets=["screenPageViews", "totalUsers", "newUsers", "sessions", "userEngagementDuration", "engagementRate"],
    )
    if not summary:
        print("  データなし（この月はまだ計測されていない可能性）")
        vals = ["0", "0", "0", "0", "0", "0"]
    else:
        vals = summary[0]
    pv, users, new_users, sessions, engage_sec, engage_rate = vals
    avg_engage = round(float(engage_sec) / float(users), 1) if float(users) else 0.0
    row = {
        "month": month,
        "pageviews": int(float(pv)),
        "users": int(float(users)),
        "new_users": int(float(new_users)),
        "sessions": int(float(sessions)),
        "avg_engagement_sec": avg_engage,
        "engagement_rate": round(float(engage_rate) * 100, 1),
        "fetched_at": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    print(f"  PV {row['pageviews']:,} / UU {row['users']:,} / セッション {row['sessions']:,}")
    upsert_monthly(row)

    # --- 記事別ランキング
    arts = run_report(
        client, prop, start, end,
        dims=["pagePath", "pageTitle"],
        mets=["screenPageViews", "totalUsers", "userEngagementDuration"],
    )
    arts.sort(key=lambda r: -float(r[2]))
    write_csv(
        DATA / "articles" / f"{month}.csv",
        ["path", "title", "pageviews", "users", "engagement_sec"],
        [[r[0], r[1], int(float(r[2])), int(float(r[3])), int(float(r[4]))] for r in arts],
    )

    # --- 流入元
    ch = run_report(
        client, prop, start, end,
        dims=["sessionDefaultChannelGroup"],
        mets=["sessions", "totalUsers"],
    )
    ch.sort(key=lambda r: -float(r[1]))
    write_csv(
        DATA / "channels" / f"{month}.csv",
        ["channel", "sessions", "users"],
        [[r[0], int(float(r[1])), int(float(r[2]))] for r in ch],
    )

    # --- 端末
    dv = run_report(client, prop, start, end, dims=["deviceCategory"], mets=["sessions", "totalUsers"])
    write_csv(
        DATA / "devices" / f"{month}.csv",
        ["device", "sessions", "users"],
        [[r[0], int(float(r[1])), int(float(r[2]))] for r in dv],
    )

    # --- 読者層（Googleシグナル有効時のみ。人数が少ないとGoogle側がしきい値で伏せるので空になり得る）
    try:
        au = run_report(client, prop, start, end, dims=["userAgeBracket", "userGender"], mets=["totalUsers"])
        write_csv(
            DATA / "audience" / f"{month}.csv",
            ["age", "gender", "users"],
            [[r[0], r[1], int(float(r[2]))] for r in au],
        )
    except Exception as e:  # noqa: BLE001 — 属性データは無くても月次集計は続ける
        print(f"  読者層はスキップ: {e}")

    save_latest(row, arts[:10], ch)
    return row


def save_latest(row: dict, top_articles: list[list], channels: list[list]) -> None:
    """媒体資料ページの生成元。最新月だけを持つ"""
    payload = {
        "month": row["month"],
        "pageviews": row["pageviews"],
        "users": row["users"],
        "sessions": row["sessions"],
        "avg_engagement_sec": row["avg_engagement_sec"],
        "engagement_rate": row["engagement_rate"],
        "top_articles": [
            {"path": a[0], "title": a[1], "pageviews": int(float(a[2]))} for a in top_articles
        ],
        "channels": [{"channel": c[0], "sessions": int(float(c[1]))} for c in channels],
        "updated_at": dt.datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    (DATA / "latest.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("  書き込み: data/latest.json")


# ------------------------------------------------------------------ サマリ表示
def show_summary() -> None:
    path = DATA / "monthly.csv"
    if not path.exists():
        print("まだデータがありません（monthly.csv 未作成）。")
        print("計測タグを入れて1ヶ月経ってから、このスクリプトを走らせてください。")
        return
    with path.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    rows = rows[-12:]
    print(f"\n{'月':<9}{'PV':>10}{'UU':>10}{'セッション':>12}{'平均滞在':>10}")
    print("-" * 51)
    for r in rows:
        print(
            f"{r['month']:<9}{int(r['pageviews']):>10,}{int(r['users']):>10,}"
            f"{int(r['sessions']):>12,}{float(r['avg_engagement_sec']):>9.0f}秒"
        )
    if len(rows) >= 2:
        a, b = int(rows[-2]["pageviews"]), int(rows[-1]["pageviews"])
        if a:
            print(f"\n前月比 PV: {(b - a) / a * 100:+.1f}%")


# ------------------------------------------------------------------ セルフテスト
def selftest() -> None:
    """APIを叩かずに、保存処理（重複置換・CSV整形・latest.json）だけを検証する"""
    print("セルフテスト: ダミーデータで保存処理を検証します（API接続なし）\n")
    backup = {}
    for p in [DATA / "monthly.csv", DATA / "latest.json"]:
        if p.exists():
            backup[p] = p.read_text(encoding="utf-8")

    ok = True
    try:
        r1 = {c: v for c, v in zip(MONTHLY_COLS, ["2026-08", 1000, 700, 500, 800, 45.0, 61.2, "test"])}
        r2 = {c: v for c, v in zip(MONTHLY_COLS, ["2026-09", 2000, 1400, 900, 1600, 52.0, 64.0, "test"])}
        r2b = {c: v for c, v in zip(MONTHLY_COLS, ["2026-09", 2500, 1500, 950, 1700, 53.0, 65.0, "test2"])}
        upsert_monthly(r1)
        upsert_monthly(r2)
        upsert_monthly(r2b)  # 同じ月を再投入 → 行は増えず上書きされるはず

        with (DATA / "monthly.csv").open(encoding="utf-8", newline="") as f:
            rows = list(csv.DictReader(f))
        assert len(rows) == 2, f"行数が2でない: {len(rows)}"
        assert rows[1]["pageviews"] == "2500", f"上書きされていない: {rows[1]['pageviews']}"
        assert rows[0]["month"] == "2026-08" and rows[1]["month"] == "2026-09", "月順に並んでいない"
        print("  OK: 同じ月の再取得で行が重複せず上書きされる")

        save_latest(r2b, [["/journal/001.html", "テスト記事", "800"]], [["Organic Search", "500", "400"]])
        latest = json.loads((DATA / "latest.json").read_text(encoding="utf-8"))
        assert latest["pageviews"] == 2500 and latest["top_articles"][0]["pageviews"] == 800
        print("  OK: latest.json が媒体資料の形で書ける")

        assert month_range("2026-02") == ("2026-02-01", "2026-02-28"), "平年2月の月末がおかしい"
        assert month_range("2024-02") == ("2024-02-01", "2024-02-29"), "うるう年2月の月末がおかしい"
        assert month_range("2026-12") == ("2026-12-01", "2026-12-31"), "12月の月末がおかしい"
        assert prev_month(dt.date(2026, 1, 5)) == "2025-12", "年またぎの前月がおかしい"
        assert months_between("2025-11", "2026-02") == ["2025-11", "2025-12", "2026-01", "2026-02"]
        print("  OK: 月の計算（月末・年またぎ・範囲展開）")
    except AssertionError as e:
        ok = False
        print(f"  NG: {e}")
    finally:
        for p in [DATA / "monthly.csv", DATA / "latest.json"]:
            if p in backup:
                p.write_text(backup[p], encoding="utf-8")
            elif p.exists():
                p.unlink()
        print("\nテスト用データは片付けました（元の状態に復元）")

    print("\nセルフテスト: " + ("全項目パス" if ok else "失敗あり（上記NGを修正）"))
    sys.exit(0 if ok else 1)


# ------------------------------------------------------------------ main
def main() -> int:
    ap = argparse.ArgumentParser(description="610 JOURNAL のアクセス数をGA4から取得してCSVに積む")
    ap.add_argument("--month", help="取得する月（例: 2026-09）")
    ap.add_argument("--since", help="この月から先月までまとめて取得（例: 2026-09）")
    ap.add_argument("--summary", action="store_true", help="保存済みデータのサマリを表示（API不要）")
    ap.add_argument("--selftest", action="store_true", help="保存処理だけを検証（API不要）")
    args = ap.parse_args()

    if args.selftest:
        selftest()
    if args.summary:
        show_summary()
        return 0

    cfg = load_config()
    prop = str(cfg.get("ga4_property_id") or "").strip()
    if not prop:
        die(
            "ga4_property_id が未設定です。\n"
            f"　　　　  {CONFIG} に GA4のプロパティID（数字）を入れてください。\n"
            "　　　　  GA4管理画面 → 管理 → プロパティの設定 の右上に出ている数字です（測定IDとは別物）。"
        )

    if args.since:
        targets = months_between(args.since, prev_month())
    elif args.month:
        targets = [args.month]
    else:
        targets = [prev_month()]

    client = get_client()
    for m in targets:
        fetch_month(client, prop, m)

    print("\n完了。サマリは `python3 fetch_ga4.py --summary` で見られます。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
