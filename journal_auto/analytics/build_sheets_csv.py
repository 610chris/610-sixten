#!/usr/bin/env python3
"""スプレッドシート用の「全月まとめCSV」を作る（2026-09-13設置）

なぜ要るか:
    fetch_ga4.py / fetch_gsc.py は月ごとにファイルを分けて保存している
    （articles/2026-09.csv, search/queries/2026-09.csv …）。
    人が積み上げて見るぶんにはこれでいいが、**スプレッドシートから読むと月が変わるたび
    URLが変わってしまう**。そこで「全月を縦に積んだ1枚」を固定ファイル名で吐いておく。

    スプシ側は data/sheets/ の raw URL を IMPORTDATA() で読むだけ。
    GitHub Actions が毎月 CSV を commit → スプシが勝手に最新になる（クリスの操作ゼロ）。

使い方:
    python3 build_sheets_csv.py          … data/sheets/ を作り直す
    python3 build_sheets_csv.py --check  … 中身の件数だけ表示（書き込まない）

出力（すべて data/sheets/ 配下・ヘッダーは日本語）:
    summary.csv              … 月次。GA4(PV/UU) と Search Console(表示回数/クリック) を横並び
    articles_all.csv         … 記事別PV（全月）
    channels_all.csv         … 流入元（全月）
    devices_all.csv          … 端末（全月）
    audience_all.csv         … 読者層（全月）
    search_queries_all.csv   … 検索キーワード（全月）
    search_pages_all.csv     … 検索でのページ別（全月）

注意:
    - このスクリプトは**集計しない**。既存CSVを読んで並べ替えるだけなので、いつ何度走らせても同じ結果。
    - GA4 と Search Console は別物（PV と 表示回数）。summary.csv でも列を分けてある。足さないこと。
"""
from __future__ import annotations

import argparse
import csv
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
OUT = DATA / "sheets"


def read_rows(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write(path: Path, header: list[str], rows: list[list]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


def stack(src_dir: Path, cols: list[str], header: list[str]) -> list[list]:
    """月別CSVを古い順に縦に積んで、先頭に月の列を足す。"""
    out = []
    for p in sorted(src_dir.glob("*.csv")):
        month = p.stem
        for r in read_rows(p):
            out.append([month] + [r.get(c, "") for c in cols])
    return out


def num(v, cast=float, default=0):
    try:
        return cast(v)
    except (TypeError, ValueError):
        return default


def build_summary() -> list[list]:
    """GA4 と Search Console を月キーで突き合わせて1枚にする。"""
    ga4 = {r["month"]: r for r in read_rows(DATA / "monthly.csv")}
    gsc = {r["month"]: r for r in read_rows(DATA / "search" / "monthly.csv")}

    rows = []
    for m in sorted(set(ga4) | set(gsc)):
        g = ga4.get(m, {})
        s = gsc.get(m, {})
        pv = num(g.get("pageviews"), int)

        # PV が 0 の理由を取り違えないための注記。
        # 「計測していなかったから0」と「計測していて0だった」は営業資料で意味が真逆になる。
        if m not in ga4:
            note = "GA4未取得（検索データのみ）"
        elif pv == 0:
            note = "GA4計測タグ設置前（PVは実在しても取得不可）"
        else:
            note = ""

        rows.append([
            m,
            pv,
            num(g.get("users"), int),
            num(g.get("new_users"), int),
            num(g.get("sessions"), int),
            round(num(g.get("avg_engagement_sec")), 1),
            round(num(g.get("engagement_rate")) * 100, 1),
            num(s.get("impressions"), int),
            num(s.get("clicks"), int),
            round(num(s.get("ctr")) * 100, 1),
            num(s.get("position")),
            note,
        ])
    return rows


SUMMARY_HEADER = [
    "月",
    "PV（GA4）", "ユーザー数（GA4）", "新規ユーザー（GA4）", "セッション（GA4）",
    "平均滞在秒（GA4）", "エンゲージメント率%（GA4）",
    "検索表示回数（GSC）", "検索クリック（GSC）", "検索CTR%（GSC）", "平均掲載順位（GSC）",
    "備考",
]


def build_daily() -> list[list]:
    """日別。GA4 は計測前の日を空欄にする（0 だと「計測して0だった」に見えるため）。"""
    import datetime as dt
    ga4 = {r["date"]: r for r in read_rows(DATA / "daily" / "ga4.csv")}
    gsc = {r["date"]: r for r in read_rows(DATA / "daily" / "gsc.csv")}
    dates = sorted(set(ga4) | set(gsc))
    if not dates:
        return []
    d, last, out, hist = dt.date.fromisoformat(dates[0]), dt.date.fromisoformat(dates[-1]), [], []
    while d <= last:
        k = d.isoformat()
        g, s = ga4.get(k), gsc.get(k, {})
        pv = num(g["pageviews"], int) if g else ""
        imp, clk = num(s.get("impressions"), int), num(s.get("clicks"), int)
        hist.append((pv, imp, clk))
        w = hist[-7:]
        pvs = [x[0] for x in w if x[0] != ""]
        note = "検索は暫定（2〜3日で確定）" if (last - d).days < 3 else ""
        out.append([k, pv, num(g["users"], int) if g else "", num(g["sessions"], int) if g else "",
                    imp, clk, round(num(s.get("ctr")) * 100, 1), num(s.get("position")) if s else "",
                    round(sum(pvs) / len(pvs), 1) if pvs else "",
                    round(sum(x[1] for x in w) / len(w), 1), round(sum(x[2] for x in w) / len(w), 1), note])
        d += dt.timedelta(days=1)
    return out


DAILY_HEADER = ["日付", "PV（GA4）", "ユーザー（GA4）", "セッション（GA4）", "検索表示回数（GSC）",
                "検索クリック（GSC）", "検索CTR%", "平均掲載順位", "PV 7日平均", "表示回数 7日平均",
                "クリック 7日平均", "備考"]


def build_goals() -> list[list]:
    """直近30日（データの最終日まで）を目標の段階と比べる。"""
    import json
    cfg = json.loads((HERE.parent / "analytics_config.json").read_text(encoding="utf-8"))
    out = []
    for gl in cfg.get("goals", []):
        rows = read_rows(DATA / "daily" / f"{gl['source']}.csv")[-30:]
        days = len(rows)
        if gl["metric"] == "position":
            def wavg(rs):
                imps = sum(num(r["impressions"]) for r in rs)
                return round(sum(num(r["position"]) * num(r["impressions"]) for r in rs) / imps, 1) if imps else ""
            cur, pace = wavg(rows), wavg(rows[-7:])
        else:
            cur = sum(num(r[gl["metric"]], int) for r in rows) if rows else ""
            last7 = rows[-7:]
            pace = round(sum(num(r[gl["metric"]]) for r in last7) / len(last7) * 30) if last7 else ""
        low = gl.get("lower_is_better")
        steps = gl["steps"]
        nxt = next((s for s in steps if cur == "" or (cur > s if low else cur < s)), None)
        final = steps[-1]

        def rate(t):
            if cur == "" or not t:
                return ""
            r = (t / cur if low else cur / t) * 100 if cur else 0
            return round(min(r, 100), 1)
        out.append([gl["label"], cur, f"{days}日分" + ("（30日に満たない）" if days < 30 else ""),
                    pace, nxt if nxt is not None else "全段階クリア", rate(nxt) if nxt else 100,
                    final, rate(final), " → ".join(f"{s:,}" for s in steps), gl.get("why", "")])
    return out


GOALS_HEADER = ["指標", "現在（直近30日）", "集計日数", "月換算ペース（直近7日×30）", "次の目標",
                "次の目標 達成率%", "最終目標", "最終目標 達成率%", "段階", "目標の根拠"]


def build_all() -> dict[str, int]:
    counts = {}

    for name, header, rows in (("daily.csv", DAILY_HEADER, build_daily()),
                               ("goals.csv", GOALS_HEADER, build_goals())):
        write(OUT / name, header, rows)
        counts[name] = len(rows)
    for name, header in (("ga4_articles_28d.csv", ["パス", "タイトル", "PV", "ユーザー数"]),
                         ("ga4_channels_28d.csv", ["流入元", "セッション", "ユーザー数"]),
                         ("gsc_queries_28d.csv", ["検索キーワード", "クリック", "表示回数", "CTR", "掲載順位"]),
                         ("gsc_pages_28d.csv", ["ページ", "クリック", "表示回数", "CTR", "掲載順位"])):
        src = read_rows(DATA / "daily" / name)
        rows = [list(r.values()) for r in src]
        write(OUT / name, header, rows)
        counts[name] = len(rows)

    rows = build_summary()
    write(OUT / "summary.csv", SUMMARY_HEADER, rows)
    counts["summary.csv"] = len(rows)

    jobs = [
        ("articles_all.csv", DATA / "articles",
         ["path", "title", "pageviews", "users", "engagement_sec"],
         ["月", "パス", "タイトル", "PV", "ユーザー数", "滞在秒"]),
        ("channels_all.csv", DATA / "channels",
         ["channel", "sessions", "users"],
         ["月", "流入元", "セッション", "ユーザー数"]),
        ("devices_all.csv", DATA / "devices",
         ["device", "sessions", "users"],
         ["月", "端末", "セッション", "ユーザー数"]),
        ("audience_all.csv", DATA / "audience",
         ["age", "gender", "users"],
         ["月", "年齢", "性別", "ユーザー数"]),
        ("search_queries_all.csv", DATA / "search" / "queries",
         ["query", "clicks", "impressions", "ctr", "position"],
         ["月", "検索キーワード", "クリック", "表示回数", "CTR", "掲載順位"]),
        ("search_pages_all.csv", DATA / "search" / "pages",
         ["page", "clicks", "impressions", "ctr", "position"],
         ["月", "ページ", "クリック", "表示回数", "CTR", "掲載順位"]),
    ]
    for name, src, cols, header in jobs:
        rows = stack(src, cols, header) if src.exists() else []
        write(OUT / name, header, rows)
        counts[name] = len(rows)

    return counts


def main() -> None:
    ap = argparse.ArgumentParser(description="スプレッドシート用の全月まとめCSVを作る")
    ap.add_argument("--check", action="store_true", help="件数を表示するだけ（書き込まない）")
    args = ap.parse_args()

    if args.check:
        for p in sorted(OUT.glob("*.csv")):
            n = max(0, sum(1 for _ in p.open(encoding="utf-8")) - 1)
            print(f"{p.name:<26}{n:>6} 行")
        return

    for name, n in build_all().items():
        print(f"{name:<26}{n:>6} 行")


if __name__ == "__main__":
    main()
