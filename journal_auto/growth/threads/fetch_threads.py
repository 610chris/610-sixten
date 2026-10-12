#!/usr/bin/env python3
"""Threads 速報（@muwe.c）の反応を毎日取って journal_auto/growth/threads/data/ に時系列で残す

2026-10-12 クリス指示（週次レポートを記事・リール・Threads の3軸にする／Threads は毎日データを取って常に把握する）で設置。
GitHub Actions（.github/workflows/threads-insights.yml）が毎朝 JST 8:40 に叩く。週次資料は growth/weekly_deck.py が読む。

対象の投稿は journal_auto/threads_state.json の "posted"（threads_post.py が投稿した速報）だけ。
@muwe.c はクリス個人のアカウントでもあるので、アカウント全体の数字は「速報以外の投稿も含む参考値」として扱う。

保存するもの（全部 data/ の下・外部ライブラリ不要）
    posts/YYYY-MM-DD.json   取得日（JST）ごとの全速報の累計値 {"fetched_at", "items": {post_id: {views, likes, replies,
                            reposts, quotes, shares}}}。投稿からの経過時間で値を揃える（48時間時点の値）ためのスナップショット。
                            投稿60日以内は毎日、それより古い投稿は月曜だけ記録する（ファイルを太らせない）
    posts_index.json        投稿ID → 投稿時刻・パーマリンク・本文の冒頭（120字）・元ネタのキー
    account_daily.json      日別（太平洋時間の1日＝Threads の集計単位）: 見られた回数・いいね・返信・再投稿・引用（アカウント全体）
    followers.json          取得日（JST）→ フォロワー数（アカウント全体）

失敗しても workflow 全体は壊さない: 取れなかった項目は飛ばして警告を出し、取れたぶんだけ保存して exit 0。
トークン（環境変数 THREADS_TOKEN、無ければ Mac の Keychain）が無い時も何もせず exit 0。
⚠️ トークンは画面・ファイル・ログに出さない（API のページ送り URL にもトークンが入るので保存しない）。

    python3 journal_auto/growth/threads/fetch_threads.py
"""

import json, os, subprocess, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
AUTO = HERE.parents[1]                     # journal_auto/
DATA = HERE / "data"
STATE = AUTO / "threads_state.json"
API = "https://graph.threads.net/v1.0"
JST = timezone(timedelta(hours=9))
PT = ZoneInfo("America/Los_Angeles")       # Threads のアカウント日別インサイトは太平洋時間で区切られる
POST_METRICS = ["views", "likes", "replies", "reposts", "quotes", "shares"]
DAILY_KEEP_DAYS = 60
ACCOUNT_DAYS = 30                          # 毎回この日数ぶん遡って日別を取り直す（後から数字が確定するため）

WARN = []


def warn(msg):
    WARN.append(msg)
    print(f"::warning::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"WARN: {msg}", file=sys.stderr)


def token():
    t = os.environ.get("THREADS_TOKEN", "").strip()
    if t:
        return t
    try:  # Mac で手動実行する時だけ
        r = subprocess.run(["security", "find-generic-password", "-s", "sixten-threads-token", "-a", "muwe.c", "-w"],
                           capture_output=True, text=True, timeout=10)
        return r.stdout.strip() if r.returncode == 0 else ""
    except Exception:
        return ""


def call(path, params, tok, retries=2):
    q = urllib.parse.urlencode(dict(params, access_token=tok))
    for i in range(retries + 1):
        try:
            with urllib.request.urlopen(f"{API}/{path}?{q}", timeout=60) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")[:300].replace(tok, "***")
            if e.code >= 500 and i < retries:
                time.sleep(5 * (i + 1))
                continue
            raise RuntimeError(f"Threads API {e.code}: {body}") from None
        except (urllib.error.URLError, TimeoutError) as e:
            if i < retries:
                time.sleep(5 * (i + 1))
                continue
            raise RuntimeError(f"Threads API 通信失敗: {str(e).replace(tok, '***')}") from None


def dump(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1, sort_keys=True)
        f.write("\n")


def load(path, default):
    try:
        return json.load(open(path, encoding="utf-8"))
    except (OSError, ValueError):
        return default


def value_of(d):
    v = (d.get("values") or [{}])[0].get("value")
    if v is None and d.get("total_value"):
        v = d["total_value"].get("value")
    return v


# ---------------------------------------------------------------- 投稿ごと

def fetch_posts(tok, now):
    posted = load(STATE, {}).get("posted", {})
    index = load(DATA / "posts_index.json", {})
    items = {}
    for key, p in posted.items():
        pid = p.get("post_id")
        if not pid:
            continue
        try:
            t = datetime.fromisoformat(p["posted_utc"].replace("Z", "+00:00"))
        except (KeyError, ValueError):
            t = None
        if t and (now - t).days > DAILY_KEEP_DAYS and now.weekday() != 0:
            continue
        if pid not in index or not index[pid].get("text"):
            rec = {"key": key, "permalink": p.get("permalink", ""), "posted_utc": p.get("posted_utc", "")}
            try:
                m = call(pid, {"fields": "id,text,timestamp,permalink"}, tok)
                rec["text"] = (m.get("text") or "")[:120]
                rec["permalink"] = m.get("permalink") or rec["permalink"]
            except Exception as e:
                warn(f"{pid} の本文を取れない: {str(e)[:120]}")
            index[pid] = rec
        try:
            r = call(f"{pid}/insights", {"metric": ",".join(POST_METRICS)}, tok)
            items[pid] = {d["name"]: value_of(d) for d in r.get("data", [])}
        except Exception as e:
            warn(f"{pid} の反応を取れない: {str(e)[:120]}")
    dump(DATA / "posts_index.json", index)
    if items:
        dump(DATA / "posts" / f"{now.astimezone(JST):%Y-%m-%d}.json",
             {"fetched_at": now.astimezone(JST).isoformat(timespec="seconds"), "items": items})
    print(f"速報 {len(items)}/{len(posted)} 件の反応を保存")


# ---------------------------------------------------------------- アカウント全体（参考値）

def pt_day_bounds(day):
    start = datetime(day.year, day.month, day.day, tzinfo=PT)
    return int(start.timestamp()), int((start + timedelta(days=1)).timestamp())


def fetch_account(tok, now):
    path = DATA / "account_daily.json"
    daily = load(path, {})
    today_pt = now.astimezone(PT).date()
    since, _ = pt_day_bounds(today_pt - timedelta(days=ACCOUNT_DAYS))
    _, until = pt_day_bounds(today_pt - timedelta(days=1))
    # views は日別の時系列で返る（end_time = その日の終わり＝翌日0時 PT）
    try:
        r = call("me/threads_insights", {"metric": "views", "since": since, "until": until}, tok)
        for v in r["data"][0].get("values", []):
            end = datetime.fromisoformat(v["end_time"].replace("+0000", "+00:00")).astimezone(PT)
            day = (end - timedelta(hours=12)).date()
            if day < today_pt:
                daily.setdefault(day.isoformat(), {})["views"] = v["value"]
    except Exception as e:
        warn(f"日別 views: {str(e)[:160]}")
    # いいね等は期間合計で返るので、直近7日を1日ずつ取る
    for back in range(7, 0, -1):
        day = today_pt - timedelta(days=back)
        s, u = pt_day_bounds(day)
        try:
            r = call("me/threads_insights", {"metric": "likes,replies,reposts,quotes", "since": s, "until": u}, tok)
            rec = daily.setdefault(day.isoformat(), {})
            for d in r.get("data", []):
                rec[d["name"]] = value_of(d)
        except Exception as e:
            warn(f"日別 反応 {day}: {str(e)[:160]}")
    dump(path, daily)
    try:
        r = call("me/threads_insights", {"metric": "followers_count"}, tok)
        n = value_of(r["data"][0])
        fol = load(DATA / "followers.json", {})
        fol[f"{now.astimezone(JST):%Y-%m-%d}"] = n
        dump(DATA / "followers.json", fol)
        print(f"フォロワー {n}（アカウント全体）")
    except Exception as e:
        warn(f"フォロワー数: {str(e)[:160]}")
    print(f"日別インサイト {len(daily)} 日分")


def main():
    tok = token()
    if not tok:
        print("THREADS_TOKEN が無いので何もしない")
        return 0
    now = datetime.now(timezone.utc)
    for step in (fetch_posts, fetch_account):
        try:
            step(tok, now)
        except Exception as e:
            warn(f"{step.__name__} 失敗: {str(e)[:200]}")
    if WARN:
        print(f"警告 {len(WARN)} 件（取れたぶんは保存済み）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
