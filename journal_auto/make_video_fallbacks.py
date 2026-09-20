#!/usr/bin/env python3
"""汎用フォールバック写真の「縦型動画版」（1080x1920）をリポジトリに常備する

記事のフォールバック写真（`fallback-images.md`・site/assets/journal-fallback-0N.jpg）は
1600x900 の横長で、縦型動画（1080x1920）に敷くと 2.13倍に拡大されて眠くなる。
そこで Commons の原寸から 9:16 に切り直したものを別に置く。

    python3 journal_auto/make_video_fallbacks.py          # 4枚を作り直す
    python3 journal_auto/make_video_fallbacks.py 2        # 02 だけ

出力: journal_video/public/assets/journal/fallback/0N.jpg（git に commit して常備する）

元画像・ライセンスは `fallback-images.md` と同じもの。切り抜きは横方向だけで、
縦は原寸の全高を使う（4枚とも元画像が 16:9 より横長なため）。`crop_x` は
被写体（フープ）が画面に収まる位置を1枚ずつ決めた値。

**画面(1080)より横に広い 1440px で保存している**。記事のクレジットと写真は1対1で対応する
（＝写真は選べない）ので、同じ写真を使う記事が続くと動画の絵が完全に同じになる。
`video_input.py` が記事番号で左/中/右に窓をずらして 1080 を切り出し、拡大なしで絵に変化をつける。
"""

import io
import os
import sys
import urllib.request

from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT_DIR = os.path.join(ROOT, "journal_video", "public", "assets", "journal", "fallback")
UA = "610journal/1.0 (muwete.m.c@gmail.com)"
W, H = 1440, 1920      # 画面は1080幅。横の余白360pxが video_input.py のパンの振り幅になる
SCREEN_W = 1080

# crop_x: 9:16 の切り抜き窓の左端を、切り抜ける範囲(0.0=左端 / 1.0=右端)のどこに置くか
FALLBACKS = {
    "01": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/7/76/Basketball_net.jpg",
        "credit": "撮影: J.smith / CC BY-SA 4.0, via Wikimedia Commons",
        "note": "アリーナのフープとネット。NBA・Bリーグ・試合/移籍などニュース系向け",
        "crop_x": 0.5,
    },
    "02": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Outdoor_basketball_in_Venice_%28Unsplash%29.jpg",
        "credit": "撮影: Nick Jio / CC0, via Wikimedia Commons",
        "note": "夕暮れのフープとヤシの木のシルエット（Venice Beach）。カルチャー/KICKS系向け",
        "crop_x": 0.5,
    },
    "03": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Outdoor_basketball_with_sunset_%28Unsplash%29.jpg",
        "credit": "撮影: Matteo Paganelli / CC0, via Wikimedia Commons",
        "note": "夕日のストリートコート全景（Venice Beach）。ストリート/イベント系向け",
        "crop_x": 0.5,
    },
    "04": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/b/bd/A_basketball_hoop_positioned_against_a_clear_blue_sky%2C_revealing_white_clouds.jpg",
        "credit": "撮影: Shixart1985 / CC BY 2.0, via Wikimedia Commons",
        "note": "青空と屋外フープの見上げカット。汎用",
        "crop_x": 0.5,
    },
}


def build(key):
    spec = FALLBACKS[key]
    req = urllib.request.Request(spec["url"], headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(r.read()))).convert("RGB")
    sw, sh = im.size
    ch = min(sh, sw * H / W)
    cw = ch * W / H
    x = (sw - cw) * spec["crop_x"]
    y = (sh - ch) / 2
    out = im.crop((round(x), round(y), round(x + cw), round(y + ch))).resize((W, H), Image.LANCZOS)
    os.makedirs(OUT_DIR, exist_ok=True)
    path = os.path.join(OUT_DIR, f"{key}.jpg")
    out.save(path, "JPEG", quality=88, optimize=True)
    print(f"{key}: 元{sw}x{sh} → 切り抜き{cw:.0f}x{ch:.0f}（{cw / W:.2f}倍から縮小）→ {W}x{H} → {path}")


if __name__ == "__main__":
    keys = [a.zfill(2) for a in sys.argv[1:]] or sorted(FALLBACKS)
    for k in keys:
        build(k)
