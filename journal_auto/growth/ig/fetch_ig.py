#!/usr/bin/env python3
"""@sixten（610 の Instagram）のエンゲージを毎日取って journal_auto/growth/ig/data/ に時系列で残す

2026-10-06 クリス指示「常にエンゲージは見て欲しいし、その上でプロのマーケターとして目線でいろいろ試して、
データを集めて、ニュースがより広まり、インスタのフォロワーが伸びるようにして欲しい」で設置。
GitHub Actions（.github/workflows/ig-insights.yml）が毎朝叩き、続けて report.py が REPORT.md を作り直す。

保存するもの（全部 data/ の下・外部ライブラリ不要）
    account_snapshots.jsonl   取得のたびに1行: フォロワー数・フォロー数・投稿数（フォロワーの純増はこの差分で見る）
    account_daily.json        日別（太平洋時間の1日＝IGの集計単位）: リーチ・再生・プロフィール訪問・
                              エンゲージしたアカウント・反応数・シェア・保存・リンクタップ・新規フォロー/フォロー解除
    media/YYYY-MM-DD.json     その日の全リールの累計指標（views/reach/likes/comments/shares/saved/
                              avg_watch_ms/total_watch_ms/skip_rate）。投稿日からの経過で伸び方を追うためのスナップショット。
                              投稿60日以内は毎日、それより古いものは月曜だけ記録する（ファイルを太らせない）
    media_index.json          メディアID → 投稿時刻・パーマリンク・キャプション長・記事番号・テンプレ・背景経路・実験アーム
    demographics/YYYY-MM.json フォロワー属性（年齢・性別・都道府県/市・国）。月ごとに上書き

失敗しても workflow 全体は壊さない: 取れなかった項目は飛ばして警告を出し、取れたぶんだけ保存して exit 0。
トークンが無い時も何もせず exit 0。

    python3 journal_auto/growth/ig/fetch_ig.py            # 通常（直近7日の日別＋全リール）
    python3 journal_auto/growth/ig/fetch_ig.py --backfill # 日別を取れるだけ（28日）遡って埋める
"""

import argparse, json, os, subprocess, sys, tempfile, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
AUTO = HERE.parents[1]                     # journal_auto/
DATA = HERE / "data"
API = "https://graph.instagram.com/v23.0"
TOKEN_FILE = os.path.expanduser("~/.claude/state/ig_token.txt")
JST = timezone(timedelta(hours=9))
PT = ZoneInfo("America/Los_Angeles")       # IG のアカウント日別インサイトは太平洋時間で区切られる

REEL_METRICS = ["views", "reach", "likes", "comments", "shares", "saved", "total_interactions",
                "ig_reels_avg_watch_time", "ig_reels_video_view_total_time", "reels_skip_rate"]
SHORT = {"ig_reels_avg_watch_time": "avg_watch_ms", "ig_reels_video_view_total_time": "total_watch_ms",
         "reels_skip_rate": "skip_rate", "total_interactions": "interactions"}
# reach は total_value を1日窓で取ると 9/27 以前が 0〜2 になる（2026-10-06 実測）ので、下の時系列（period=day）で取る
ACCOUNT_TOTAL = ["views", "profile_views", "accounts_engaged", "total_interactions",
                 "likes", "comments", "shares", "saves", "website_clicks"]
DAILY_KEEP_DAYS = 60                       # これより古いリールは月曜だけスナップショットに入れる

WARN = []


def warn(msg):
    WARN.append(msg)
    print(f"::warning::{msg}" if os.environ.get("GITHUB_ACTIONS") else f"WARN: {msg}", file=sys.stderr)


def token():
    t = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    if t:
        return t
    if os.path.exists(TOKEN_FILE):
        for line in open(TOKEN_FILE, encoding="utf-8"):
            if line.startswith("IG_ACCESS_TOKEN="):
                return line.split("=", 1)[1].strip()
    return ""


def call(path, params, tok, retries=2):
    q = urllib.parse.urlencode(dict(params, access_token=tok))
    for i in range(retries + 1):
        try:
            with urllib.request.urlopen(f"{API}/{path}?{q}", timeout=60) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")[:400]
            if e.code >= 500 and i < retries:
                time.sleep(5 * (i + 1))
                continue
            raise RuntimeError(f"IG API {e.code}: {body}") from None
        except (urllib.error.URLError, TimeoutError) as e:
            if i < retries:
                time.sleep(5 * (i + 1))
                continue
            raise RuntimeError(f"IG API 通信失敗: {e}") from None


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


# ---------------------------------------------------------------- アカウント

def fetch_profile(tok, now):
    me = call("me", {"fields": "id,username,followers_count,follows_count,media_count"}, tok)
    row = {"at": now.isoformat(timespec="seconds"), "followers": me.get("followers_count"),
           "follows": me.get("follows_count"), "media": me.get("media_count")}
    with open(DATA / "account_snapshots.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    print(f"フォロワー {row['followers']} / 投稿 {row['media']}")
    return row


def pt_day_bounds(day):
    start = datetime(day.year, day.month, day.day, tzinfo=PT)
    return int(start.timestamp()), int((start + timedelta(days=1)).timestamp())


def fetch_account_daily(tok, days):
    path = DATA / "account_daily.json"
    daily = load(path, {})
    today_pt = datetime.now(PT).date()
    for back in range(days, 0, -1):         # 今日（途中経過）は取らない
        day = today_pt - timedelta(days=back)
        since, until = pt_day_bounds(day)
        rec = daily.get(day.isoformat(), {})
        for met in ACCOUNT_TOTAL:
            try:
                r = call("me/insights", {"metric": met, "period": "day", "metric_type": "total_value",
                                         "since": since, "until": until}, tok)
                rec[met] = r["data"][0]["total_value"]["value"]
            except Exception as e:
                warn(f"日別 {met} {day}: {str(e)[:160]}")
        try:
            r = call("me/insights", {"metric": "follows_and_unfollows", "period": "day", "metric_type": "total_value",
                                     "breakdown": "follow_type", "since": since, "until": until}, tok)
            res = (r["data"][0]["total_value"].get("breakdowns") or [{}])[0].get("results") or []
            got = {x["dimension_values"][0]: x["value"] for x in res}
            rec["follows"] = got.get("FOLLOWER", 0)       # フォローした人
            rec["unfollows"] = got.get("NON_FOLLOWER", 0)  # フォロー解除・退会
        except Exception as e:
            warn(f"日別 follows_and_unfollows {day}: {str(e)[:160]}")
        if rec:
            daily[day.isoformat()] = rec
    # 時系列で返る指標（30日ぶんが1回で返る）: follower_count＝その日の新規フォロワー数、reach＝その日のリーチ
    since, _ = pt_day_bounds(today_pt - timedelta(days=min(days, 29)))
    _, until = pt_day_bounds(today_pt - timedelta(days=1))
    for met, key in (("follower_count", "new_followers"), ("reach", "reach")):
        try:
            r = call("me/insights", {"metric": met, "period": "day", "since": since, "until": until}, tok)
            for v in r["data"][0]["values"]:
                end = datetime.fromisoformat(v["end_time"].replace("+0000", "+00:00")).astimezone(PT)
                day = (end - timedelta(hours=12)).date().isoformat()
                daily.setdefault(day, {})[key] = v["value"]
        except Exception as e:
            warn(f"日別 {met}: {str(e)[:160]}")
    dump(path, daily)
    print(f"日別インサイト {len(daily)} 日分")


def fetch_demographics(tok, now):
    out = {"fetched_at": now.isoformat(timespec="seconds"), "timeframe": "this_month"}
    for b in ("age", "gender", "city", "country"):
        try:
            r = call("me/insights", {"metric": "follower_demographics", "period": "lifetime",
                                     "metric_type": "total_value", "timeframe": "this_month", "breakdown": b}, tok)
            res = r["data"][0]["total_value"]["breakdowns"][0].get("results") or []
            out[b] = dict(sorted(((x["dimension_values"][0], x["value"]) for x in res), key=lambda kv: -kv[1]))
        except Exception as e:
            warn(f"フォロワー属性 {b}: {str(e)[:160]}")
    if len(out) > 2:
        dump(DATA / "demographics" / f"{now:%Y-%m}.json", out)


# ---------------------------------------------------------------- リール

def list_media(tok, skip=()):
    """全メディアと指標。insights を fields に入れ子にして1ページ1回で取る（100本で1コール）

    事業アカウント化より前の投稿が1本でも混じるとページごと 400 になる。そのページだけ
    1本ずつに切り替え、指標を取れない投稿（skip）は次回から問い合わせない。
    """
    base = "id,media_type,media_product_type,timestamp,permalink,caption,like_count,comments_count"
    fields = f"{base},insights.metric({','.join(REEL_METRICS)})"
    out, after = [], None
    while True:
        p = {"limit": 100}
        if after:
            p["after"] = after
        try:
            r = call("me/media", dict(p, fields=fields), tok)
        except Exception:
            r = call("me/media", dict(p, fields=base), tok)
            for m in r.get("data", []):
                if m["id"] in skip:
                    continue
                mets = REEL_METRICS if m.get("media_product_type") == "REELS" else \
                    ["views", "reach", "likes", "comments", "shares", "saved", "total_interactions"]
                try:
                    m["insights"] = call(f"{m['id']}/insights", {"metric": ",".join(mets)}, tok)
                except Exception as e:
                    m["no_insights"] = True
                    warn(f"{m['id']} の指標を取れない: {str(e)[:120]}")
        out += r.get("data", [])
        after = r.get("paging", {}).get("cursors", {}).get("after")
        if not r.get("paging", {}).get("next"):
            return out


def metrics_of(m):
    got = {}
    for d in (m.get("insights") or {}).get("data", []):
        v = (d.get("values") or [{}])[0].get("value")
        if v is None and d.get("total_value"):
            v = d["total_value"].get("value")
        got[SHORT.get(d["name"], d["name"])] = v
    if "likes" not in got and m.get("like_count") is not None:
        got["likes"] = m["like_count"]
    if "comments" not in got and m.get("comments_count") is not None:
        got["comments"] = m["comments_count"]
    return got


def video_status():
    """Release「videos」の video_status.json（記事番号 → reel_media_id・背景経路・テンプレ）。取れなければ空"""
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "vs.json")
        try:
            r = subprocess.run(["gh", "release", "download", "videos", "-p", "video_status.json", "-O", p],
                               capture_output=True, text=True, timeout=120, cwd=AUTO)
            if r.returncode == 0:
                return json.load(open(p, encoding="utf-8"))
            warn(f"video_status.json を取れない: {r.stderr.strip()[:160]}")
        except Exception as e:
            warn(f"video_status.json を取れない: {e}")
    return {}


def route_kind(route):
    head = (route or "").split(" ", 1)[0]
    return head or "unknown"


def build_index(media, now):
    """メディアごとの属性。記事・動画側の属性は一度入れたら残す（Release が一時的に取れなくても消さない）"""
    path = DATA / "media_index.json"
    idx = load(path, {})
    vs = video_status()
    queue = load(AUTO / "ig_queue.json", {}).get("items", [])
    q_by_id = {it["id"]: it for it in queue}
    by_media = {}
    for aid, st in vs.items():
        if st.get("reel_media_id"):
            by_media[st["reel_media_id"]] = (aid, st)
    for it in queue:                                  # 旧カルーセル（ig_post.py）時代の投稿
        if it.get("ig_media_id") and it["ig_media_id"] not in by_media:
            by_media[it["ig_media_id"]] = (it["id"], {})

    for m in media:
        mid = m["id"]
        cap = m.get("caption") or ""
        rec = idx.get(mid, {})
        rec.update({
            "timestamp": m.get("timestamp"),
            "permalink": m.get("permalink"),
            "product": m.get("media_product_type"),
            "caption_len": len(cap),
            "caption_lines": cap.count("\n") + 1 if cap else 0,
            "hashtags": cap.count("#"),
            "headline": cap.split("\n", 1)[0][:80],
            "has_question": "💬" in cap,
        })
        if mid in by_media:
            aid, st = by_media[mid]
            it = q_by_id.get(aid, {})
            rec.update({
                "article": aid,
                "auto": bool(st),
                "template": st.get("template") or ("news" if st else rec.get("template")),
                "route": route_kind(st.get("route")) if st else rec.get("route"),
                "category": it.get("category"),
                "source": it.get("source"),
                "subject": it.get("subject") or [],
                "n_points": len(it.get("points") or []),
                "no_question": bool(it.get("no_question")),
            })
            if st.get("exp_arms"):                    # 実験アーム（reel_post.py が投稿時に記録）
                rec["arms"] = st["exp_arms"]
        elif "auto" not in rec:
            rec["auto"] = False
        # キャプション本文からも実験の文面が入っているかを残す（記録が欠けても判定できるように）
        rec["cta_share"] = "📤 " in cap
        rec["cta_follow_b"] = "🔔 @sixten" in cap
        if m.get("no_insights"):
            rec["no_insights"] = True
        idx[mid] = rec
    dump(path, idx)
    linked = sum(1 for r in idx.values() if r.get("auto"))
    print(f"メディア {len(idx)} 本（自動投稿リールと突合できたもの {linked} 本）")


def save_snapshot(media, now):
    monday = now.weekday() == 0
    path = DATA / "media" / f"{now:%Y-%m-%d}.json"
    first = not any(p for p in (DATA / "media").glob("*.json") if p != path)
    items = load(path, {}).get("items", {})        # 同じ日に2回走っても先に取ったぶんを消さない
    for m in media:
        ts = m.get("timestamp")
        try:
            age = (now - datetime.fromisoformat(ts.replace("+0000", "+00:00"))).days
        except Exception:
            age = 0
        if age > DAILY_KEEP_DAYS and not (monday or first):
            continue
        got = metrics_of(m)
        if m.get("insights"):
            items[m["id"]] = got
    dump(path, {"fetched_at": now.isoformat(timespec="seconds"), "items": items})
    print(f"スナップショット {len(items)} 本 → media/{now:%Y-%m-%d}.json")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--backfill", action="store_true", help="日別インサイトを28日遡って埋める")
    args = ap.parse_args()
    tok = token()
    if not tok:
        print("IG トークンが無いので計測は飛ばす（Secret IG_TOKEN を確認）")
        return
    DATA.mkdir(parents=True, exist_ok=True)
    now = datetime.now(JST)
    steps = [
        ("プロフィール", lambda: fetch_profile(tok, now)),
        ("日別インサイト", lambda: fetch_account_daily(tok, 28 if args.backfill or not (DATA / "account_daily.json").exists() else 7)),
        ("フォロワー属性", lambda: fetch_demographics(tok, now)),
    ]
    for name, fn in steps:
        try:
            fn()
        except Exception as e:
            warn(f"{name} を取れなかった: {str(e)[:200]}")
            if name == "プロフィール":   # 一番軽い呼び出しが通らない＝トークン切れ等。残りも通らないので打ち切る
                print("プロフィールすら取れないので今日の計測は打ち切る（取れたデータは無いので何も書かない）")
                return
    try:
        skip = {k for k, v in load(DATA / "media_index.json", {}).items() if v.get("no_insights")}
        media = list_media(tok, skip)
        save_snapshot(media, now)
        build_index(media, now)
    except Exception as e:
        warn(f"リールの指標を取れなかった: {str(e)[:200]}")
    if WARN:
        print(f"警告 {len(WARN)} 件（取れたぶんは保存済み）")


if __name__ == "__main__":
    main()
