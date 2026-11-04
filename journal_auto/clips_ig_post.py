#!/usr/bin/env python3
"""クリスのバスケ日記 切り抜きショート(IG版) → @sixten にリールで時刻投稿＋@muwe.c 共同投稿。

2026-11-05 クリス指示: 「インスタグラムの610の方に上げてほしい。1日2本ずつ同じように予約投稿を
してほしくて、全部をクリスのバスケ日記を共同投稿で入れてほしい」。
Instagram API には予約投稿の機能が無いので、clips-ig.yml(Actions)が 12:05 / 19:05 JST に起動し、
このスクリプトが「時刻を過ぎた・未投稿・投稿文あり」の先頭1本だけを投稿する。

キュー: journal_auto/clips_ig_queue.json
  {"collaborators": ["muwe.c"], "items": [{"id","at"(JST ISO),"video_url","caption","state","media_id",...}]}
  state: pending → posted / failed(3回失敗) / skip(手で止める)
  caption が空の行は投稿しない(投稿文はクリスと相談して入れる)。

使い方:
  python3 clips_ig_post.py            # 時刻を過ぎた先頭1本を投稿(Actions が呼ぶ)
  python3 clips_ig_post.py --dry      # 何を投稿するかだけ表示
  python3 clips_ig_post.py --check R01  # 投稿せずにコンテナだけ作り FINISHED まで確認(共同投稿の検証用)
  python3 clips_ig_post.py --list     # 一覧
トークン: 環境変数 IG_TOKEN → なければ ~/.claude/state/ig_token.txt
"""
import json, os, sys, time, urllib.parse, urllib.request
from datetime import datetime, timezone, timedelta

API = "https://graph.instagram.com/v23.0"
JST = timezone(timedelta(hours=9))
Q = os.path.join(os.path.dirname(os.path.abspath(__file__)), "clips_ig_queue.json")


def token():
    t = os.environ.get("IG_TOKEN")
    if not t:   # ローカルは KEY=値 形式(IG_ACCESS_TOKEN の行)
        for line in open(os.path.expanduser("~/.claude/state/ig_token.txt")):
            if line.startswith("IG_ACCESS_TOKEN="):
                t = line.split("=", 1)[1]
    return t.strip()


def call(path, params, method="GET", tok=None):
    params = dict(params, access_token=tok)
    data = urllib.parse.urlencode(params).encode()
    url = f"{API}/{path}"
    req = urllib.request.Request(url + ("?" + data.decode() if method == "GET" else ""),
                                 data=None if method == "GET" else data, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{path}: HTTP {e.code} {e.read().decode()[:400]}")


def container(it, collabs, tok):
    p = {"media_type": "REELS", "video_url": it["video_url"], "caption": it.get("caption", ""),
         "share_to_feed": "true"}
    if collabs:
        p["collaborators"] = json.dumps(collabs)
    cid = call("me/media", p, "POST", tok)["id"]
    for _ in range(60):                       # 最大10分待つ
        st = call(cid, {"fields": "status_code,status"}, tok=tok)
        if st.get("status_code") == "FINISHED":
            return cid
        if st.get("status_code") in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"container {st}")
        time.sleep(10)
    raise RuntimeError("container timeout")


def main():
    q = json.load(open(Q, encoding="utf-8"))
    args = sys.argv[1:]
    if "--list" in args:
        for it in q["items"]:
            print(it["at"], it["id"], it["state"], "投稿文あり" if it.get("caption") else "投稿文なし",
                  it.get("media_id", ""))
        return
    tok = token()
    if "--check" in args:
        it = next(i for i in q["items"] if i["id"] == args[args.index("--check") + 1])
        cid = container(it, q.get("collaborators"), tok)
        print(f"[{it['id']}] コンテナ FINISHED id={cid}(公開はしていない・24時間で自動失効)")
        return
    now = datetime.now(JST)
    due = [i for i in q["items"] if i["state"] == "pending" and i.get("caption")
           and datetime.fromisoformat(i["at"]) <= now]
    if not due:
        print("投稿する分なし"); return
    last = max((datetime.fromisoformat(i["posted_at"]) for i in q["items"] if i.get("posted_at")), default=None)
    if last and now - last < timedelta(hours=3) and "--force" not in args:
        print(f"直前の投稿({last:%m/%d %H:%M})から3時間たっていないので見送り(1日2本を守る)"); return
    it = sorted(due, key=lambda i: i["at"])[0]
    if "--dry" in args:
        print("投稿予定:", it["id"], it["at"]); return
    try:
        cid = container(it, q.get("collaborators"), tok)
        mid = call("me/media_publish", {"creation_id": cid}, "POST", tok)["id"]
        it.update(state="posted", media_id=mid, posted_at=datetime.now(JST).isoformat(timespec="seconds"))
        try:
            it["permalink"] = call(mid, {"fields": "permalink"}, tok=tok).get("permalink")
        except Exception:
            pass
        print(f"[{it['id']}] 投稿OK media_id={mid}")
    except Exception as e:
        it["attempts"] = it.get("attempts", 0) + 1
        it["error"] = str(e)[:500]
        if it["attempts"] >= 3:
            it["state"] = "failed"
        print(f"[{it['id']}] 失敗({it['attempts']}回目): {e}")
    json.dump(q, open(Q, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
