#!/usr/bin/env python3
"""書き出した動画の白文字が背景に対して読めるかを画素で測る

    python3 scripts/check_contrast.py out/176-kobe-3-low-mismatch.mp4

明るい写真を背景にすると白文字が溶ける。目視やスクショ1枚では判断できないので、
WCAG の相対輝度でコントラスト比を出す（AA の基準は 4.5:1）。

測り方は README「記事135の実測」と同じ:
  ① 文字がまだ出ていないフレーム（暗転がいちばん薄い＝最悪ケース）を「背景」として取る
  ② 文字が出揃ったフレームとの差分から白文字の画素を特定する
  ③ 文字画素と同じ座標の背景輝度と比べる。背景は暗部に助けられないよう「明るい方5%」で見る
"""

import os
import subprocess
import sys
import tempfile

from PIL import Image


def frame(mp4, t, out):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t), "-i", mp4,
                    "-frames:v", "1", out], check=True)
    return Image.open(out).convert("RGB")


def relative_luminance(rgb):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def ratio(l1, l2):
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def check(mp4, bg_t=0.9, text_t=None):
    dur = float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", mp4], capture_output=True, text=True, check=True).stdout.strip())
    text_t = text_t if text_t is not None else dur - 2.0
    with tempfile.TemporaryDirectory() as d:
        bg = frame(mp4, bg_t, os.path.join(d, "bg.png"))
        tx = frame(mp4, text_t, os.path.join(d, "tx.png"))

    bgp, txp = bg.load(), tx.load()
    lums = []
    for y in range(0, bg.height):
        for x in range(0, bg.width):
            t, b = txp[x, y], bgp[x, y]
            # 白文字＝背景よりはっきり明るくなった、かつ十分に白い画素だけを見る
            if min(t) > 200 and sum(t) - sum(b) > 150:
                lums.append((relative_luminance(t), relative_luminance(b)))
    if not lums:
        return {"文字画素": 0}

    lums.sort(key=lambda p: p[1])                 # 背景が明るい順に並べる
    top5 = lums[int(len(lums) * 0.95):]           # 背景の明るい方5%＝いちばん読みにくい所
    text_l = sum(p[0] for p in lums) / len(lums)
    bg_bright = sum(p[1] for p in top5) / len(top5)
    return {
        "文字画素": len(lums),
        "背景フレーム": f"{bg_t}s",
        "文字フレーム": f"{text_t:.1f}s",
        "コントラスト比(背景の明るい方5%)": round(ratio(text_l, bg_bright), 2),
        "コントラスト比(最悪の1画素)": round(ratio(lums[-1][0], lums[-1][1]), 2),
        "WCAG AA(4.5:1)": "✅" if ratio(text_l, bg_bright) >= 4.5 else "❌",
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("使い方: check_contrast.py <mp4> [<mp4> ...]")
    for mp4 in sys.argv[1:]:
        print(os.path.basename(mp4))
        for k, v in check(mp4).items():
            print(f"  {k}: {v}")
