#!/usr/bin/env python3
"""610 JOURNAL の日別データ取得（GA4 + Search Console / 2026-09-13設置）

fetch_ga4.py / fetch_gsc.py は「月ごと」の集計。これは **1日ごと** の推移と、
直近28日のランキング（記事・流入元・検索キーワード）を取る。スプレッドシートのグラフと目標進捗の元データ。

毎回「取れる範囲を全部取り直して上書き」する（冪等）。GitHub Actions が毎朝これを叩く。
  - GSC: 16ヶ月前〜昨日（Google 側から消えた古い日は、手元のCSVに残っている分をそのまま保持）
  - GA4: 計測タグ設置日（GA4_START）〜昨日
  - 今日は途中経過なので取らない（半日分の数字がグラフで「急落」に見えるため）

使い方:
    python3 fetch_daily.py            … 取得して data/daily/ に保存
    python3 fetch_daily.py --gsc-only … Search Console だけ（GA4 の設定が無い時用）

鍵: 環境変数 GOOGLE_APPLICATION_CREDENTIALS（fetch_ga4.py と同じサービスアカウント）

出力（data/daily/）:
    ga4.csv                … date, pageviews, users, sessions, engaged_sessions, avg_engagement_sec
    gsc.csv                … date, impressions, clicks, ctr, position
    ga4_articles_28d.csv   … 直近28日の記事別PV
    ga4_channels_28d.csv   … 直近28日の流入元
    gsc_queries_28d.csv    … 直近28日の検索キーワード
    gsc_pages_28d.csv      … 直近28日の検索ページ

注意:
    - Search Console は確定まで2〜3日かかる。直近3日は後から数字が増える（毎朝取り直すので自然に埋まる）
    - GA4 と GSC は別物。PV（開かれた回数）と 表示回数（検索結果に出た回数）は足さない
"""
from __future__ import annotations

import argparse
import csv
import datetime as dt
import json
import os
import sys
import urllib.parse
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "data" / "daily"
CONFIG = HERE.parent / "analytics_config.json"

# GA4 の計測タグを全ページに入れた日。これより前は GA4 に何も無い（0 ではなく「未計測」）
GA4_START = "2026-09-13"

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
]
GSC_API = "https://searchconsole.googleapis.com/webmasters/v3/sites/{site}/searchAnalytics/query"
GA4_API = "https://analyticsdata.googleapis.com/v1beta/properties/{prop}:runReport"


def session():
    from google.auth.transport.requests import AuthorizedSession
    from google.oauth2 import service_account

    key = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not key:
        sys.exit("GOOGLE_APPLICATION_CREDENTIALS が未設定です（鍵JSONのパスを入れてください）")
    return AuthorizedSession(service_account.Credentials.from_service_account_file(key, scopes=SCOPES))


def write_csv(path: Path, header: list[str], rows: list[list]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)
    print(f"  書き込み: {path.relative_to(HERE)}（{len(rows)}行）")


def upsert_by_date(path: Path, header: list[str], fresh: dict[str, list]) -> None:
    """既存CSVに今回取れた日を上書きマージ。API から消えた古い日は残す。"""
    rows: dict[str, list] = {}
    if path.exists():
        with path.open(encoding="utf-8") as f:
            for r in csv.DictReader(f):
                rows[r["date"]] = [r.get(c, "") for c in header]
    rows.update(fresh)
    write_csv(path, header, [rows[d] for d in sorted(rows)])


# ---------------------------------------------------------------- Search Console

def gsc_query(sess, site: str, start: str, end: str, dims: list[str], limit: int,
              paginate: bool = False) -> list[dict]:
    url = GSC_API.format(site=urllib.parse.quote(site, safe=""))
    out: list[dict] = []
    while True:
        body = {"startDate": start, "endDate": end, "dimensions": dims, "rowLimit": limit,
                "startRow": len(out),
                "dataState": "all"}  # final だと直近2〜3日が丸ごと欠けるので all（暫定値込み）
        r = sess.post(url, json=body)
        if r.status_code != 200:
            sys.exit(f"Search Console API エラー {r.status_code}: {r.text[:400]}")
        rows = r.json().get("rows", [])
        out.extend(rows)
        if not paginate or len(rows) < limit:
            return out


def upsert_by_date_key(path: Path, header: list[str], fresh: list[list], start: str) -> None:
    """(date, key) 単位の日別CSV。今回取り直した期間(start以降)は丸ごと差し替え、それより前は残す。"""
    keep: list[list] = []
    if path.exists():
        with path.open(encoding="utf-8") as f:
            keep = [[r.get(c, "") for c in header] for r in csv.DictReader(f) if r["date"] < start]
    write_csv(path, header, sorted(keep + fresh, key=lambda r: (r[0], r[1])))


def fetch_gsc(sess, site: str, yesterday: dt.date) -> None:
    print("\nSearch Console（日別）")
    start = (yesterday - dt.timedelta(days=16 * 31)).isoformat()
    end = yesterday.isoformat()
    rows = gsc_query(sess, site, start, end, ["date"], 25000)
    header = ["date", "impressions", "clicks", "ctr", "position"]
    fresh = {r["keys"][0]: [r["keys"][0], int(r["impressions"]), int(r["clicks"]),
                            round(r["ctr"], 4), round(r["position"], 1)] for r in rows}
    upsert_by_date(OUT / "gsc.csv", header, fresh)

    s28 = (yesterday - dt.timedelta(days=27)).isoformat()
    for dim, name in (("query", "gsc_queries_28d.csv"), ("page", "gsc_pages_28d.csv")):
        rs = gsc_query(sess, site, s28, end, [dim], 100)
        write_csv(OUT / name, [dim, "clicks", "impressions", "ctr", "position"],
                  [[r["keys"][0], int(r["clicks"]), int(r["impressions"]), round(r["ctr"], 4),
                    round(r["position"], 1)] for r in rs])

    # 施策の前後比較（growth/weekly_report.py）用: 記事×日 / 検索語×日
    for dims, name in ((["date", "page"], "gsc_pages_daily.csv"), (["date", "query"], "gsc_queries_daily.csv")):
        rs = gsc_query(sess, site, start, end, dims, 25000, paginate=True)
        upsert_by_date_key(OUT / name, [*dims, "clicks", "impressions", "position"],
                           [[*r["keys"], int(r["clicks"]), int(r["impressions"]), round(r["position"], 1)]
                            for r in rs], start)


# ---------------------------------------------------------------- GA4

def ga4_report(sess, prop: str, start: str, end: str, dims: list[str], mets: list[str],
               limit: int = 1000) -> list[list[str]]:
    body = {"dateRanges": [{"startDate": start, "endDate": end}],
            "dimensions": [{"name": d} for d in dims],
            "metrics": [{"name": m} for m in mets], "limit": limit}
    r = sess.post(GA4_API.format(prop=prop), json=body)
    if r.status_code != 200:
        sys.exit(f"GA4 Data API エラー {r.status_code}: {r.text[:400]}")
    return [[*(d["value"] for d in row.get("dimensionValues", [])),
             *(m["value"] for m in row.get("metricValues", []))] for row in r.json().get("rows", [])]


def fetch_ga4(sess, prop: str, yesterday: dt.date) -> None:
    print("\nGA4（日別）")
    end = yesterday.isoformat()
    header = ["date", "pageviews", "users", "sessions", "engaged_sessions", "avg_engagement_sec"]
    if end < GA4_START:
        print(f"  計測開始日 {GA4_START} の翌日以降に取れるようになります（まだ丸1日分が無い）")
        upsert_by_date(OUT / "ga4.csv", header, {})
        for name, h in (("ga4_articles_28d.csv", ["path", "title", "pageviews", "users"]),
                        ("ga4_channels_28d.csv", ["channel", "sessions", "users"])):
            if not (OUT / name).exists():
                write_csv(OUT / name, h, [])
        return

    rows = ga4_report(sess, prop, GA4_START, end, ["date"],
                      ["screenPageViews", "totalUsers", "sessions", "engagedSessions",
                       "userEngagementDuration"])
    fresh = {}
    for d, pv, users, ses, eng, dur in rows:
        date = f"{d[:4]}-{d[4:6]}-{d[6:]}"
        u = float(users)
        fresh[date] = [date, int(float(pv)), int(u), int(float(ses)), int(float(eng)),
                       round(float(dur) / u, 1) if u else 0]
    upsert_by_date(OUT / "ga4.csv", header, fresh)

    s28 = max(GA4_START, (yesterday - dt.timedelta(days=27)).isoformat())
    arts = ga4_report(sess, prop, s28, end, ["pagePath", "pageTitle"], ["screenPageViews", "totalUsers"], 200)
    arts.sort(key=lambda r: -float(r[2]))
    write_csv(OUT / "ga4_articles_28d.csv", ["path", "title", "pageviews", "users"],
              [[r[0], r[1], int(float(r[2])), int(float(r[3]))] for r in arts])
    # 記事×日のPV（施策の前後比較用）
    pages = ga4_report(sess, prop, GA4_START, end, ["date", "pagePath"], ["screenPageViews"], 100000)
    write_csv(OUT / "ga4_pages_daily.csv", ["date", "path", "pageviews"],
              sorted([[f"{d[:4]}-{d[4:6]}-{d[6:]}", p, int(float(pv))] for d, p, pv in pages]))
    # 流入元×日（SNS施策の効果測定用）
    chd = ga4_report(sess, prop, GA4_START, end, ["date", "sessionDefaultChannelGroup"], ["sessions"], 100000)
    write_csv(OUT / "ga4_channels_daily.csv", ["date", "channel", "sessions"],
              sorted([[f"{d[:4]}-{d[4:6]}-{d[6:]}", c, int(float(s))] for d, c, s in chd]))

    ch = ga4_report(sess, prop, s28, end, ["sessionDefaultChannelGroup"], ["sessions", "totalUsers"])
    ch.sort(key=lambda r: -float(r[1]))
    write_csv(OUT / "ga4_channels_28d.csv", ["channel", "sessions", "users"],
              [[r[0], int(float(r[1])), int(float(r[2]))] for r in ch])


def main() -> None:
    ap = argparse.ArgumentParser(description="610 JOURNAL の日別データを取得する")
    ap.add_argument("--gsc-only", action="store_true", help="Search Console だけ取る")
    args = ap.parse_args()

    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    # 日付の境目は日本時間（GA4 プロパティも日本時間で集計している）
    yesterday = (dt.datetime.now(dt.timezone(dt.timedelta(hours=9))) - dt.timedelta(days=1)).date()
    sess = session()

    if cfg.get("gsc_site_url"):
        fetch_gsc(sess, cfg["gsc_site_url"], yesterday)
    if not args.gsc_only and cfg.get("ga4_property_id"):
        fetch_ga4(sess, str(cfg["ga4_property_id"]), yesterday)
    print("\n完了")


if __name__ == "__main__":
    main()
