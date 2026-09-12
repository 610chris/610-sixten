#!/usr/bin/env python3
"""610 JOURNAL → Instagram へ実際に投稿する（承認済みだけ）

`ig_queue.py approve` で state=approved になった記事だけを対象にする。承認していないものは
何があっても投げない（クリスの指定＝「生成まで自動＋承認して投稿」）。

    1. 画像3枚が公開URLで取れるか確認（push→デプロイ前だと404なのでここで止める）
    2. 3枚を is_carousel_item=true で子コンテナにする
    3. 親コンテナ（media_type=CAROUSEL）を作る
    4. status_code が FINISHED になるまで待つ
    5. /me/media_publish で公開 → state=posted と ig_media_id をキューに書く

トークンは `~/.claude/state/ig_token.txt`、無ければ環境変数 IG_ACCESS_TOKEN。
@sixten は Instagram Login アプリなので graph.instagram.com を叩く（graph.facebook.com ではない）。

使い方:
    python3 journal_auto/ig_post.py --dry-run     # 何を投げるかだけ見る
    python3 journal_auto/ig_post.py               # approved を全部投稿
    python3 journal_auto/ig_post.py 134           # 記事番号を指定して1本だけ
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ig_queue as Q  # noqa: E402

API = "https://graph.instagram.com/v23.0"
TOKEN_FILE = os.path.expanduser("~/.claude/state/ig_token.txt")

POLL_INTERVAL = 3       # 秒
POLL_LIMIT = 40         # 最大2分待つ
BETWEEN_POSTS = 20      # 連投の間隔（まとめて承認した日にレート制限で弾かれないように）


def token():
    if os.path.exists(TOKEN_FILE):
        t = open(TOKEN_FILE, encoding="utf-8").read().strip()
        if t:
            return t
    t = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    if not t:
        raise SystemExit(f"アクセストークンが無い（{TOKEN_FILE} か環境変数 IG_ACCESS_TOKEN）")
    return t


# ---------------------------------------------------------------- API

def call(path, params, method="GET", tok=None):
    params = dict(params, access_token=tok)
    body = urllib.parse.urlencode(params).encode()
    if method == "GET":
        req = urllib.request.Request(f"{API}/{path}?{body.decode()}")
    else:
        req = urllib.request.Request(f"{API}/{path}", data=body, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        detail = e.read().decode(errors="replace")
        raise RuntimeError(f"IG API {e.code}: {detail}") from None


def public_ok(url):
    """デプロイ前の404に投稿を食わせない。IGは自分でこのURLを取りに来る仕様。"""
    req = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status == 200 and r.headers.get("Content-Type", "").startswith("image/")
    except Exception:
        return False


def wait_finished(container_id, tok):
    """親コンテナは画像のDLと合成が終わるまで publish できない"""
    for _ in range(POLL_LIMIT):
        r = call(container_id, {"fields": "status_code,status"}, tok=tok)
        code = r.get("status_code")
        if code == "FINISHED":
            return
        if code in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"コンテナが {code}: {r.get('status')}")
        time.sleep(POLL_INTERVAL)
    raise RuntimeError(f"FINISHED にならないままタイムアウト（{POLL_LIMIT * POLL_INTERVAL}秒）")


# ---------------------------------------------------------------- 投稿

def post_one(item, tok):
    urls = item.get("images") or []
    if len(urls) < 2:
        raise RuntimeError(f"カルーセルには画像が2枚以上要る（今 {len(urls)}枚・先に ig_card.py）")

    missing = [u for u in urls if not public_ok(u)]
    if missing:
        raise RuntimeError("画像が公開URLで取れない（commit→push→デプロイがまだ）: "
                           + ", ".join(missing))

    children = []
    for u in urls:
        r = call("me/media", {"image_url": u, "is_carousel_item": "true"}, "POST", tok)
        children.append(r["id"])
        print(f"    child {r['id']}  {u}")

    parent = call("me/media", {
        "media_type": "CAROUSEL",
        "children": ",".join(children),
        "caption": item["caption"],
    }, "POST", tok)["id"]
    print(f"    parent {parent} → FINISHED 待ち")
    wait_finished(parent, tok)

    media_id = call("me/media_publish", {"creation_id": parent}, "POST", tok)["id"]
    return media_id


def main():
    ap = argparse.ArgumentParser(description="610 JOURNAL → Instagram 投稿（承認済みのみ）")
    ap.add_argument("ids", nargs="*", help="記事番号（省略時は approved を全部）")
    ap.add_argument("--dry-run", action="store_true", help="投げずに対象と本文だけ出す")
    args = ap.parse_args()

    data = Q.load()
    if args.ids:
        targets = []
        for i in args.ids:
            it = Q.find(data, i)
            if not it:
                print(f"[!] キューに {i} が無い")
            elif it["state"] != "approved":
                print(f"[!] {it['id']} は state={it['state']}（approved 以外は投稿しない）")
            else:
                targets.append(it)
    else:
        targets = [i for i in data["items"] if i["state"] == "approved"]

    if not targets:
        print("（投稿対象なし。ig_queue.py approve で承認する）")
        return

    if args.dry_run:
        for it in targets:
            print(f"--- {it['id']} {it['headline']}")
            for u in it["images"]:
                print(f"    {u}  {'OK' if public_ok(u) else '★公開されていない'}")
            print(it["caption"])
        return

    tok = token()
    for n, it in enumerate(targets):
        if n:
            time.sleep(BETWEEN_POSTS)
        print(f"[post] {it['id']} {it['headline']}")
        try:
            media_id = post_one(it, tok)
        except Exception as e:
            it["state"] = "failed"
            it["error"] = str(e)
            Q.save(data)
            print(f"  ✗ 失敗: {e}")
            continue
        it["state"] = "posted"
        it["ig_media_id"] = media_id
        it["posted_at"] = Q.datetime.now(Q.JST).isoformat(timespec="seconds")
        it["error"] = None
        Q.save(data)
        print(f"  ✓ 投稿した ig_media_id={media_id}")


if __name__ == "__main__":
    sys.exit(main())
