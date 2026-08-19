#!/usr/bin/env python3
"""610 JOURNAL「610 VIDEO」セクション自動更新。

@sixten の最新共同投稿リール4本を Instagram Web API から取得し、
site/journal/index.html の REELS:START〜REELS:END 間のカードを差し替える。
サムネ(jpg)と動画(mp4)は site/assets/ に自前ホスト。

出力: CHANGED: <shortcodes> / NO_CHANGE / エラー時 stderr + exit 1
git 操作はしない（呼び出し側ルーチンの仕事）。
"""
import html
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(REPO, "site", "journal", "index.html")
ASSETS = os.path.join(REPO, "site", "assets")

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
HEADERS = {"User-Agent": UA, "x-ig-app-id": "936619743392459"}
API = "https://www.instagram.com/api/v1/users/web_profile_info/?username=sixten"

JST = timezone(timedelta(hours=9))

KNOWN = {
    "blacksamurai": "BLACK SAMURAI",
    "postup.podcast": "POST UP PODCAST",
    "postup": "POST UP PODCAST",
    "muwe.c": "クリスのバスケ日記",
}

MARK_START = "<!-- REELS:START"
MARK_END = "<!-- REELS:END -->"


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def derive_title(node):
    edges = node.get("edge_media_to_caption", {}).get("edges", [])
    caption = edges[0]["node"]["text"] if edges else ""
    line = caption.split("\n", 1)[0]
    line = line.replace("✅", "")
    line = re.sub(r"#\S+", "", line)
    mentions = re.findall(r"@([\w.]+)", line)
    line = re.sub(r"@[\w.]+", "", line)
    text = re.sub(r"\s+", " ", line).strip()
    if text:
        text = text.split("。", 1)[0]
        return text[:45]
    for m in mentions:
        if m in KNOWN:
            return KNOWN[m]
    if mentions:
        return "@" + mentions[0]
    return "REEL"


def convert_thumb(src, dst):
    """9:16センタークロップ→720x1280 q80。PIL→ffmpeg→原本コピーの順に試す。"""
    try:
        from PIL import Image
        im = Image.open(src).convert("RGB")
        w, h = im.size
        target = 9 / 16
        if w / h > target:
            nw = int(h * target)
            im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = int(w / target)
            im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        im = im.resize((720, 1280), Image.LANCZOS)
        im.save(dst, "JPEG", quality=80)
        return
    except Exception:
        pass
    if shutil.which("ffmpeg"):
        r = subprocess.run(
            ["ffmpeg", "-y", "-i", src,
             "-vf", "crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=720:1280",
             "-q:v", "3", dst],
            capture_output=True)
        if r.returncode == 0:
            return
    shutil.copyfile(src, dst)


def convert_video(src, dst):
    """480p・音声なし・crf28圧縮。ffmpeg無ければ原本コピー。"""
    if shutil.which("ffmpeg"):
        r = subprocess.run(
            ["ffmpeg", "-y", "-i", src,
             "-vf", "scale=480:-2", "-c:v", "libx264", "-crf", "28",
             "-preset", "veryfast", "-an", "-movflags", "+faststart", dst],
            capture_output=True)
        if r.returncode == 0:
            return
        sys.stderr.write(r.stderr.decode("utf-8", "replace")[-500:] + "\n")
    shutil.copyfile(src, dst)


def build_card(sc, title, date_str):
    t = html.escape(title, quote=True)
    return (
        f'        <a class="reel-card" href="https://www.instagram.com/reel/{sc}/" target="_blank" rel="noopener">\n'
        f'          <div class="reel-img"><video src="../assets/reel-{sc}.mp4" poster="../assets/reel-{sc}.jpg" muted loop playsinline preload="none" aria-label="{t}"></video></div>\n'
        f'          <div class="reel-meta">\n'
        f'            <span class="code">▶ REEL — {date_str}</span>\n'
        f'            <h3>{t}</h3>\n'
        f'          </div>\n'
        f'        </a>'
    )


def main():
    profile = json.loads(fetch(API))
    edges = profile["data"]["user"]["edge_owner_to_timeline_media"]["edges"]
    reels = [e["node"] for e in edges
             if e["node"].get("product_type") == "clips" and e["node"].get("is_video")][:4]
    if len(reels) < 4:
        sys.stderr.write(f"ERROR: リールが{len(reels)}本しか取れなかった\n")
        return 1

    new_scs = [n["shortcode"] for n in reels]

    src = open(INDEX, encoding="utf-8").read()
    i0 = src.find(MARK_START)
    i1 = src.find(MARK_END)
    if i0 < 0 or i1 < 0:
        sys.stderr.write("ERROR: REELSマーカーが index.html に見つからない\n")
        return 1
    block = src[i0:i1]
    cur_scs = re.findall(r"instagram\.com/reel/([\w-]+)/", block)

    if new_scs == cur_scs:
        print("NO_CHANGE")
        return 0

    os.makedirs(ASSETS, exist_ok=True)
    tmpdir = os.path.join(ASSETS, ".reels_tmp")
    os.makedirs(tmpdir, exist_ok=True)

    for n in reels:
        sc = n["shortcode"]
        jpg = os.path.join(ASSETS, f"reel-{sc}.jpg")
        mp4 = os.path.join(ASSETS, f"reel-{sc}.mp4")
        if not os.path.exists(jpg):
            raw = os.path.join(tmpdir, f"{sc}.jpg")
            open(raw, "wb").write(fetch(n["display_url"], binary=True))
            convert_thumb(raw, jpg)
        if not os.path.exists(mp4):
            if not n.get("video_url"):
                sys.stderr.write(f"ERROR: {sc} に video_url が無い\n")
                return 1
            raw = os.path.join(tmpdir, f"{sc}.mp4")
            open(raw, "wb").write(fetch(n["video_url"], binary=True))
            convert_video(raw, mp4)

    shutil.rmtree(tmpdir, ignore_errors=True)

    cards = []
    for n in reels:
        ts = n.get("taken_at_timestamp", 0)
        date_str = datetime.fromtimestamp(ts, JST).strftime("%Y.%m.%d")
        cards.append(build_card(n["shortcode"], derive_title(n), date_str))

    start_line_end = src.index("\n", i0) + 1
    new_src = (src[:start_line_end] + "\n".join(cards) + "\n        " + src[i1:])
    open(INDEX, "w", encoding="utf-8").write(new_src)

    # 新4本に含まれない古いアセットを掃除
    keep = set(new_scs)
    for f in os.listdir(ASSETS):
        m = re.match(r"reel-([\w-]+)\.(jpg|mp4)$", f)
        if m and m.group(1) not in keep:
            os.remove(os.path.join(ASSETS, f))

    print("CHANGED: " + " ".join(new_scs))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        sys.stderr.write(f"ERROR: {type(e).__name__}: {e}\n")
        sys.exit(1)
