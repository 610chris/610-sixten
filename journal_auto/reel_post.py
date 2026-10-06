#!/usr/bin/env python3
"""縦型ニュース動画（video_build.py が作った mp4）→ @sixten に IG リールとして自動投稿

GitHub Actions（.github/workflows/video-build.yml）が動画を書き出した直後に同じジョブで叩く。
承認なしの全自動・リールだけ（2026-09-29 クリス指定。カルーセル＋承認制の ig_post.py から切り替え）。

    1. Release の動画URLを video_url で渡す（IG が取りに来る）
       302＋octet-stream でも FINISHED まで通ることを 2026-09-29 に実測。
       ⚠️Instagram Login の API は upload_type=resumable（直接アップロード）を受け付けない（400 video_url is required）
    2. コンテナの status_code が FINISHED になるまで待つ
    3. /me/media_publish で公開 → video_status.json（Release 添付）に reel_media_id を書く

投稿しないもの:
    - JST 3:00〜6:59 に走ったぶん（深夜のニュースは朝7時にまとめて投稿する。--ignore-quiet で解除）
    - POST_FROM より前に書き出された動画（切り替え前の過去動画を一斉に流さない）
    - キューで state=skipped の記事（ig_queue.py skip 134 で止められる）
    - 投稿済み（reel_media_id あり）・3回失敗したもの

    python3 journal_auto/reel_post.py              # 未投稿を最大 MAX_PER_RUN 本
    python3 journal_auto/reel_post.py 309          # 記事番号を指定（POST_FROM の判定は外す）
    python3 journal_auto/reel_post.py 309 --test   # アップロードして FINISHED まで確かめるだけ（公開しない）
    python3 journal_auto/reel_post.py --ignore-quiet  # 静音時間(3:00〜7:00)でも投稿する

トークンは環境変数 IG_ACCESS_TOKEN（Actions は Secret IG_TOKEN）。無ければ
~/.claude/state/ig_token.txt の IG_ACCESS_TOKEN= 行。Secret は Mac の
~/.claude/scripts/ig_token_secret_sync.py が毎日入れ直す（延長自体は reels_sync.py が毎朝やっている）。
"""

import argparse, json, os, subprocess, sys, time, urllib.error, urllib.parse, urllib.request
from collections import Counter
from datetime import datetime, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import ig_queue as Q  # noqa: E402
import video_build as VB  # noqa: E402
try:  # キャプションの A/B 実験（growth/ig/experiments.json）。読めなくても投稿は続ける
    import ig_experiments  # noqa: E402
except Exception:
    ig_experiments = None

API = "https://graph.instagram.com/v23.0"
TOKEN_FILE = os.path.expanduser("~/.claude/state/ig_token.txt")

POST_FROM = "2026-09-29T12:50:00+09:00"   # リール自動投稿の稼働開始。これより前の動画は投稿しない
# 投稿しない時間帯（JST）。2026-10-02 クリス指示「夜中にニュースが起きる場合、朝一に投稿をしてほしくて、
# 夜中の3時から朝7時までに起きたやつは全部朝7時に投稿っていうような形をとってほしい」。
# この時間に動画ができても投稿せず（失敗にもしない）、7:00 の schedule 実行でまとめて流す。
QUIET_FROM, QUIET_TO = 3, 7
MAX_PER_RUN = 6
MAX_ATTEMPTS = 3
BETWEEN_POSTS = 60      # 秒。まとめて書き出された日に連投にならないように
POLL_INTERVAL = 10
POLL_LIMIT = 60         # 最大10分待つ
THUMB_BEFORE_END = 0.6  # 秒。サムネにするコマ（終わりのこれだけ前）
# カテゴリ別の本数配分（24時間あたりの上限）。growth/ig/report.py が観察実験の判定後に自動で書く。
# 2026-10-06 クリス指示「KICKS・PR系の投稿本数の配分を見直す（エンゲージの観察実験の結果が出てから）」
# →「これから自分で続けて言いたくないから…言わずとも成立するようにして」。ファイルが無い・上限 null なら今まで通り全部出す。
MIX_FILE = os.path.join(HERE, "growth", "ig", "mix.json")
MIX_DROP_H = 48         # 上限で待たされたまま、書き出しからこれだけ過ぎたニュースは出さない（古いニュースを後から流さない）


def mix_caps():
    try:
        m = json.load(open(MIX_FILE, encoding="utf-8"))
        return m.get("daily_cap") or {}, m.get("no_person_cap")
    except Exception:
        return {}, None


def apply_mix(todo, items, status, limit):
    """上限を超える分は今回は出さない（次の実行に回す）。MIX_DROP_H を過ぎたら mix_dropped にして以後出さない"""
    caps, np_cap = mix_caps()
    if not caps and np_cap is None:
        return todo[:limit], False
    now = datetime.now(VB.JST)
    recent = [a for a, st in status.items() if a in items and st.get("reel_posted_at")
              and datetime.fromisoformat(st["reel_posted_at"]) >= now - timedelta(hours=24)]
    cnt = Counter(items[a].get("category") for a in recent)
    npc = sum(1 for a in recent if not items[a].get("subject"))
    keep, dropped = [], False
    for aid in todo:
        if len(keep) >= limit:
            break
        it = items[aid]
        cat, noperson = it.get("category"), not it.get("subject")
        cap = caps.get(cat)
        if (cap is not None and cnt[cat] >= cap) or (np_cap is not None and noperson and npc >= np_cap):
            if now - datetime.fromisoformat(status[aid]["built_at"]) > timedelta(hours=MIX_DROP_H):
                status[aid]["mix_dropped"] = f"{now:%Y-%m-%d %H:%M} 配分の上限（mix.json）で{MIX_DROP_H}時間出せず見送り"
                dropped = True
                print(f"[mix] {aid} 見送り（{cat}・{MIX_DROP_H}時間たっても上限のまま）")
            else:
                print(f"[mix] {aid} 保留（{cat}・24時間の上限に到達）")
            continue
        keep.append(aid)
        cnt[cat] += 1
        npc += noperson
    return keep, dropped


def token():
    t = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    if t:
        return t
    if os.path.exists(TOKEN_FILE):
        for line in open(TOKEN_FILE, encoding="utf-8"):
            if line.startswith("IG_ACCESS_TOKEN="):
                return line.split("=", 1)[1].strip()
    return ""


def call(path, params, method="GET", tok=None):
    body = urllib.parse.urlencode(dict(params, access_token=tok)).encode()
    if method == "GET":
        req = urllib.request.Request(f"{API}/{path}?{body.decode()}")
    else:
        req = urllib.request.Request(f"{API}/{path}", data=body, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"IG API {e.code}: {e.read().decode(errors='replace')[:500]}") from None


def wait_finished(container_id, tok):
    for _ in range(POLL_LIMIT):
        r = call(container_id, {"fields": "status_code,status"}, tok=tok)
        code = r.get("status_code")
        if code == "FINISHED":
            return
        if code in ("ERROR", "EXPIRED"):
            raise RuntimeError(f"コンテナが {code}: {r.get('status')}")
        time.sleep(POLL_INTERVAL)
    raise RuntimeError(f"FINISHED にならないままタイムアウト（{POLL_LIMIT * POLL_INTERVAL}秒）")


def reel_caption(item, credit):
    """投稿直前に ig_queue.build_caption で組み直す（キューに入った時点の古い書式を出さない）。

    「写真:」は動画の背景写真のクレジットに差し替える。背景は記事ヒーローと別の写真
    （Commons 等）になることが多く、CC BY の表示義務は動画に実際に使った写真に対して負う。
    クレジットが無い（記事ヒーロー流用）時は記事のまま。--caption で手書きした記事だけはそのまま使う。
    """
    if item.get("caption_manual") and item.get("caption"):
        return item["caption"]
    return Q.build_caption(dict(item, photo_credit=credit or item.get("photo_credit", "")))


def thumb_offset_ms(url):
    """サムネ（カバー）にするコマ＝終わりの THUMB_BEFORE_END 秒前（文字が全部出そろった画面）。

    2026-09-29 クリス指定「サムネが、この今送った状態になるように」。確認用の一覧も同じ時刻で切り出している。
    長さが測れない時は None（IG の既定＝先頭付近のコマになる）。
    """
    try:
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                              "-of", "csv=p=0", url], capture_output=True, text=True, timeout=60).stdout
        return max(0, int((float(out.strip()) - THUMB_BEFORE_END) * 1000))
    except Exception as e:
        print(f"    WARN: 動画の長さが測れずサムネ指定なし: {e}", file=sys.stderr)
        return None


def post_one(item, st, tok, test=False):
    if not st["url"].startswith("http"):
        raise RuntimeError(f"動画が Release に上がっていない: {st['url']}")
    caption = reel_caption(item, st.get("credit", ""))
    if ig_experiments:
        caption, arms = ig_experiments.apply(caption, item, datetime.now(VB.JST))
        if arms:
            st["exp_arms"] = arms   # どのアームで出したか（video_status.json に残る）
    params = {"media_type": "REELS", "video_url": st["url"],
              "caption": caption,
              "share_to_feed": "true"}
    off = thumb_offset_ms(st["url"])
    if off is not None:
        params["thumb_offset"] = str(off)
        print(f"    サムネ = {off / 1000:.1f}秒目")
    cid = call("me/media", params, "POST", tok)["id"]
    print(f"    container {cid} → FINISHED 待ち")
    wait_finished(cid, tok)
    if test:
        print("    --test なので公開しない（コンテナは24時間で自動で消える）")
        return None
    return call("me/media_publish", {"creation_id": cid}, "POST", tok)["id"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--test", action="store_true", help="公開せず FINISHED まで確かめる")
    ap.add_argument("--max", type=int, default=MAX_PER_RUN)
    ap.add_argument("--ignore-quiet", action="store_true",
                    help=f"{QUIET_FROM}:00〜{QUIET_TO}:00 でも投稿する（{QUIET_TO}:00 の取りこぼし回収用）")
    args = ap.parse_args()

    if not (args.ids or args.test or args.ignore_quiet) and QUIET_FROM <= datetime.now(VB.JST).hour < QUIET_TO:
        print(f"今は {QUIET_FROM}:00〜{QUIET_TO}:00 の静音時間なので投稿しない（{QUIET_TO}:00 にまとめて投稿する）")
        return

    tok = token()
    if not tok:
        print("IG トークンが無いのでリール投稿は飛ばす（Secret IG_TOKEN を確認）")
        return
    status = VB.load_status(True)
    items = {it["id"]: it for it in json.load(open(VB.video_input.QUEUE, encoding="utf-8"))["items"]}
    want = {str(i).zfill(3) for i in args.ids}
    start = datetime.fromisoformat(POST_FROM)

    todo = []
    for aid, st in sorted(status.items()):
        it = items.get(aid)
        if not it or it.get("state") == "skipped" or st.get("no_photo") or (st.get("mix_dropped") and not want):
            continue
        if want:
            if aid in want and (args.test or not st.get("reel_media_id")):
                todo.append(aid)
            continue
        if st.get("reel_media_id") or st.get("reel_attempts", 0) >= MAX_ATTEMPTS:
            continue
        if datetime.fromisoformat(st["built_at"]) < start:
            continue
        todo.append(aid)
    if want or args.test:
        todo = todo[: args.max]
    else:
        todo, dropped = apply_mix(todo, items, status, args.max)
        if dropped:
            VB.save_status(status, True)
    if not todo:
        print("投稿するリールはない")
        return

    failed = 0
    for n, aid in enumerate(todo):
        if n:
            time.sleep(BETWEEN_POSTS)
        st = status[aid]
        print(f"[reel] {aid} {items[aid]['headline']}")
        try:
            media_id = post_one(items[aid], st, tok, args.test)
        except Exception as e:
            failed += 1
            print(f"  ✗ 失敗: {e}", file=sys.stderr)
            if not args.test:
                st["reel_attempts"] = st.get("reel_attempts", 0) + 1
                st["reel_error"] = str(e)[:500]
                VB.save_status(status, True)
            continue
        if args.test:
            print("  ✓ テスト通過")
            continue
        st["reel_media_id"] = media_id
        st["reel_posted_at"] = datetime.now(VB.JST).isoformat(timespec="seconds")
        st.pop("reel_error", None)
        VB.save_status(status, True)
        print(f"  ✓ 投稿した ig_media_id={media_id}")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
