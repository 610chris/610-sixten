#!/usr/bin/env python3
"""610 JOURNAL 検索データの自動集計（Search Console API / 2026-09-13設置）

GA4（fetch_ga4.py）は計測タグを入れた 2026-09-13 以降しか数字が無い。
Search Console は所有権確認さえ済んでいれば **過去16ヶ月分** さかのぼれるので、
GA4 が無かった期間の「どれだけ検索から見られていたか」をここで補う。

GA4 との違い（媒体資料に載せるとき混ぜないこと）:
    GA4  … 実際にページが開かれた回数（PV/UU）。全流入が対象
    GSC  … Google 検索の結果に「表示された回数（impressions）」と「クリックされた回数（clicks）」。検索だけが対象
    → clicks は GA4 の「Organic Search の PV」に近いが一致はしない（別物として並べる）

使い方:
    python3 fetch_gsc.py                 … 前月分を取得して追記（GitHub Actions が毎月これを叩く）
    python3 fetch_gsc.py --month 2026-09 … 指定した月を取得
    python3 fetch_gsc.py --since 2026-04 … その月から先月までまとめて取得
    python3 fetch_gsc.py --backfill      … さかのぼれる分（約16ヶ月）を全部取得。初回の穴埋め用
    python3 fetch_gsc.py --summary       … 保存済みCSVから直近12ヶ月のサマリを表示（API不要）
    python3 fetch_gsc.py --selftest      … ダミーデータで保存処理だけ検証（API不要・データは消す）

事前に必要なもの:
    1. journal_auto/analytics_config.json の gsc_site_url（例 "https://sixten.jp/"。末尾スラッシュ込み）
    2. サービスアカウントが Search Console のプロパティに「制限付き」以上で追加されていること
    3. Google Cloud で Search Console API が有効化されていること
    4. 鍵JSON
       - ローカル: 環境変数 GOOGLE_APPLICATION_CREDENTIALS にパスを入れる
       - GitHub Actions: Secrets の GA4_SA_KEY（GA4 と同じ鍵を使い回す）

出力（すべて data/search/ 配下）:
    monthly.csv           … 月次サマリ（1行=1ヶ月）。表示回数・クリック・CTR・平均掲載順位
    queries/YYYY-MM.csv   … 検索キーワード別（何で見つけられているか）
    pages/YYYY-MM.csv     … ページ別（どの記事が検索で拾われているか）
    latest.json           … 最新月の要約

注意:
    - Search Console のデータは反映に2〜3日かかる。当月ぶんを取りにいっても末尾が欠ける
    - 保持期間は16ヶ月。それより前は Google 側にも残っていないので永久に取れない
    - 数字が0の月も「0として記録」する（取得漏れと区別するため row_count を持たせている）
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
DATA = HERE / "data" / "search"
CONFIG = HERE.parent / "analytics_config.json"

API = "https://searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]

TOP_N = 50  # キーワード・ページを何件まで残すか


# ---------------------------------------------------------------- 月の計算

def month_range(month: str) -> tuple[str, str]:
    """'2026-09' → ('2026-09-01', '2026-09-30')"""
    y, m = (int(x) for x in month.split("-"))
    last = calendar.monthrange(y, m)[1]
    return f"{y:04d}-{m:02d}-01", f"{y:04d}-{m:02d}-{last:02d}"


def prev_month(today: dt.date | None = None) -> str:
    d = today or dt.date.today()
    first = d.replace(day=1)
    last_month = first - dt.timedelta(days=1)
    return f"{last_month.year:04d}-{last_month.month:02d}"


def months_between(since: str, until: str) -> list[str]:
    y, m = (int(x) for x in since.split("-"))
    ey, em = (int(x) for x in until.split("-"))
    out = []
    while (y, m) <= (ey, em):
        out.append(f"{y:04d}-{m:02d}")
        m += 1
        if m == 13:
            y, m = y + 1, 1
    return out


def oldest_available() -> str:
    """Search Console が保持している一番古い月（16ヶ月前）。"""
    d = dt.date.today().replace(day=1)
    for _ in range(16):
        d = (d - dt.timedelta(days=1)).replace(day=1)
    return f"{d.year:04d}-{d.month:02d}"


# ---------------------------------------------------------------- API

def load_config() -> dict:
    return json.loads(CONFIG.read_text(encoding="utf-8")) if CONFIG.exists() else {}


def session():
    from google.auth.transport.requests import AuthorizedSession
    from google.oauth2 import service_account

    key = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not key:
        sys.exit("GOOGLE_APPLICATION_CREDENTIALS が未設定です（鍵JSONのパスを入れてください）")
    creds = service_account.Credentials.from_service_account_file(key, scopes=SCOPES)
    return AuthorizedSession(creds)


def query(sess, site_url: str, start: str, end: str, dimensions: list[str], limit: int) -> list[dict]:
    import urllib.parse

    url = API.format(site=urllib.parse.quote(site_url, safe=""))
    body = {"startDate": start, "endDate": end, "dimensions": dimensions,
            "rowLimit": limit, "dataState": "final"}
    r = sess.post(url, json=body)
    if r.status_code != 200:
        sys.exit(f"Search Console API エラー {r.status_code}: {r.text[:400]}")
    return r.json().get("rows", [])


# ---------------------------------------------------------------- 保存

def write_csv(path: Path, header: list[str], rows: list[list]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


def upsert_monthly(row: dict) -> None:
    """monthly.csv の同じ月を上書きして月順に並べ直す（何度実行しても同じ結果）。"""
    path = DATA / "monthly.csv"
    header = ["month", "clicks", "impressions", "ctr", "position", "query_count", "page_count"]
    rows = {}
    if path.exists():
        with path.open(encoding="utf-8") as f:
            for r in csv.DictReader(f):
                rows[r["month"]] = r
    rows[row["month"]] = {k: row[k] for k in header}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=header)
        w.writeheader()
        for m in sorted(rows):
            w.writerow(rows[m])


def fetch_month(sess, site_url: str, month: str) -> dict:
    start, end = month_range(month)

    totals = query(sess, site_url, start, end, [], 1)
    t = totals[0] if totals else {"clicks": 0, "impressions": 0, "ctr": 0, "position": 0}

    queries = query(sess, site_url, start, end, ["query"], TOP_N)
    pages = query(sess, site_url, start, end, ["page"], TOP_N)

    write_csv(DATA / "queries" / f"{month}.csv",
              ["query", "clicks", "impressions", "ctr", "position"],
              [[r["keys"][0], r["clicks"], r["impressions"], round(r["ctr"], 4),
                round(r["position"], 1)] for r in queries])
    write_csv(DATA / "pages" / f"{month}.csv",
              ["page", "clicks", "impressions", "ctr", "position"],
              [[r["keys"][0], r["clicks"], r["impressions"], round(r["ctr"], 4),
                round(r["position"], 1)] for r in pages])

    row = {
        "month": month,
        "clicks": int(t.get("clicks", 0)),
        "impressions": int(t.get("impressions", 0)),
        "ctr": round(t.get("ctr", 0), 4),
        "position": round(t.get("position", 0), 1),
        "query_count": len(queries),
        "page_count": len(pages),
    }
    upsert_monthly(row)
    return row


def write_latest(month: str) -> None:
    path = DATA / "monthly.csv"
    if not path.exists():
        return
    with path.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        return
    latest = rows[-1]
    top = []
    qp = DATA / "queries" / f"{latest['month']}.csv"
    if qp.exists():
        with qp.open(encoding="utf-8") as f:
            top = [r["query"] for r in csv.DictReader(f)][:10]
    (DATA / "latest.json").write_text(json.dumps({
        "month": latest["month"],
        "clicks": int(latest["clicks"]),
        "impressions": int(latest["impressions"]),
        "ctr": float(latest["ctr"]),
        "position": float(latest["position"]),
        "top_queries": top,
        "source": "Google Search Console",
        "note": "検索結果での表示回数とクリック数。GA4のPVとは別物",
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- サマリ

def summary() -> None:
    path = DATA / "monthly.csv"
    if not path.exists():
        print("まだデータがありません（data/search/monthly.csv が無い）")
        return
    with path.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))[-12:]
    print(f"{'月':<9}{'表示回数':>10}{'クリック':>10}{'CTR':>8}{'平均順位':>9}")
    for r in rows:
        print(f"{r['month']:<9}{int(r['impressions']):>10,}{int(r['clicks']):>10,}"
              f"{float(r['ctr'])*100:>7.1f}%{float(r['position']):>9.1f}")


def selftest() -> None:
    """API を叩かずに保存処理だけ検証して、書いたものを消す。"""
    month = "1999-01"
    write_csv(DATA / "queries" / f"{month}.csv", ["query", "clicks", "impressions", "ctr", "position"],
              [["テスト", 1, 10, 0.1, 5.0]])
    write_csv(DATA / "pages" / f"{month}.csv", ["page", "clicks", "impressions", "ctr", "position"],
              [["https://sixten.jp/", 1, 10, 0.1, 5.0]])
    upsert_monthly({"month": month, "clicks": 1, "impressions": 10, "ctr": 0.1,
                    "position": 5.0, "query_count": 1, "page_count": 1})
    ok = (DATA / "monthly.csv").exists()
    # 後始末
    for p in [DATA / "queries" / f"{month}.csv", DATA / "pages" / f"{month}.csv"]:
        p.unlink(missing_ok=True)
    path = DATA / "monthly.csv"
    with path.open(encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f) if r["month"] != month]
    if rows:
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
    else:
        path.unlink(missing_ok=True)
    print("selftest:", "OK" if ok else "NG")


# ---------------------------------------------------------------- main

def main() -> None:
    ap = argparse.ArgumentParser(description="610 JOURNAL の検索データを Search Console から取得する")
    ap.add_argument("--month", help="取得する月（例 2026-09）")
    ap.add_argument("--since", help="この月から前月までまとめて取得（例 2026-04）")
    ap.add_argument("--backfill", action="store_true", help="さかのぼれる分（約16ヶ月）を全部取得")
    ap.add_argument("--summary", action="store_true", help="保存済みCSVからサマリ表示（API不要）")
    ap.add_argument("--selftest", action="store_true", help="保存処理だけ検証（API不要）")
    args = ap.parse_args()

    if args.summary:
        return summary()
    if args.selftest:
        return selftest()

    cfg = load_config()
    site = cfg.get("gsc_site_url")
    if not site:
        sys.exit("analytics_config.json の gsc_site_url が未設定です")

    last = prev_month()
    if args.backfill:
        months = months_between(oldest_available(), last)
    elif args.since:
        months = months_between(args.since, last)
    else:
        months = [args.month or last]

    sess = session()
    for m in months:
        row = fetch_month(sess, site, m)
        print(f"{m}: 表示 {row['impressions']:,} / クリック {row['clicks']:,} "
              f"/ CTR {row['ctr']*100:.1f}% / 平均順位 {row['position']}")
    write_latest(months[-1])


if __name__ == "__main__":
    main()
