#!/usr/bin/env python3
"""公開済みのヒーロー画像を全部スキャンして「顔が切れている疑い」を洗い出す。

2026-09-06 クリス指摘「画像がある時に、顔が切れてるのはNG」で設置。原因は
pick_commons_photo.py の固定クロップ centering=(0.5, 0.4) で、縦長の全身写真だと顔が枠外に出ていた。
その修正（顔検出クロップ）を入れる前に公開した記事を洗い直すための検査ツール。

使い方:
  python3 journal_auto/check_hero_faces.py                 # site/assets の全 journal-*-hero.jpg
  python3 journal_auto/check_hero_faces.py 067 081         # 記事番号を指定

判定（すでに1600x900に切られた画像を見るので、元写真の顔位置は分からない前提）:
  OK      : 顔が検出でき、上端に接していない
  要確認  : 顔が検出できたが枠の上端に接している（頭頂部が切れている可能性）
  顔なし  : 顔が検出できない。人物記事ならクロップ事故の疑い。ただしシューズ(KICKS)・
            アリーナ・ロゴなど元々人物が写らない記事もあるので、記事タイトルと突き合わせて人が判断する

出力の最後に、記事タイトル付きの「顔なし」一覧を出す（タイトルは site/journal/journal.js から拾う）。
依存: opencv-python-headless / pillow / numpy（無ければ何が足りないか表示して exit 1）
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
ASSETS = os.path.join(ROOT, 'site', 'assets')
JOURNAL_JS = os.path.join(ROOT, 'site', 'journal', 'journal.js')
YUNET = os.path.join(HERE, 'models', 'face_detection_yunet_2023mar.onnx')
FACE_SCORE = 0.6
FACE_LONG = 1024
TOP_EDGE = 0.02      # 顔の上端がこれより上なら「枠に接している＝切れている可能性」
MAIN_FACE_W = 0.045  # 主役の顔と見なす最小の幅（画像幅比）。これ未満は観客席の顔として無視する


def titles():
    """journal.js の ARTICLES から 記事番号 → タイトル を作る（正規表現で十分・JSは実行しない）"""
    out = {}
    try:
        src = open(JOURNAL_JS, encoding='utf-8').read()
    except OSError:
        return out
    for m in re.finditer(r'\{[^{}]*\}', src):
        blk = m.group(0)
        u = re.search(r'''href\s*:\s*['"](\d{3})-''', blk)
        t = re.search(r'''title\s*:\s*['"](.+?)['"]\s*,''', blk)
        if u and t:
            out[u.group(1)] = t.group(1)
    return out


def faces_in(path, cv2, np, Image):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    s = FACE_LONG / max(w, h)
    if s < 1.0:
        im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    arr = np.ascontiguousarray(np.asarray(im)[:, :, ::-1])
    det = cv2.FaceDetectorYN.create(YUNET, '', (arr.shape[1], arr.shape[0]), score_threshold=FACE_SCORE)
    _, f = det.detect(arr)
    if f is None or len(f) == 0:
        return []
    H, W = arr.shape[0], arr.shape[1]
    # (顔の上端割合, 下端割合, 顔幅の画像幅比) を大きい順に
    return sorted(((y / H, (y + fh) / H, fw / W) for x, y, fw, fh in (r[:4] for r in f)),
                  key=lambda r: -r[2])


def main():
    try:
        import cv2, numpy as np
        from PIL import Image
    except ImportError as e:
        print(f'依存が足りない: {e}. pip install opencv-python-headless pillow numpy', file=sys.stderr)
        sys.exit(1)
    if not os.path.exists(YUNET):
        print(f'顔検出モデルが無い: {YUNET}', file=sys.stderr); sys.exit(1)

    want = set(sys.argv[1:])
    names = sorted(n for n in os.listdir(ASSETS) if re.fullmatch(r'journal-\d{3}-hero\.jpg', n))
    if want:
        names = [n for n in names if n[8:11] in want]
    tt = titles()
    noface, edge = [], []
    for n in names:
        num = n[8:11]
        fs = faces_in(os.path.join(ASSETS, n), cv2, np, Image)
        title = tt.get(num, '')
        big = [f for f in fs if f[2] >= MAIN_FACE_W]
        if not fs:
            noface.append((num, title, '顔なし')); mark = '顔なし'
        elif not big:
            # 観客席の小さい顔しか無い＝主役の顔が枠から外れている可能性が高い（記事067がこれ）
            noface.append((num, title, f'小さい顔だけ(最大{fs[0][2] * 100:.1f}%)'))
            mark = f'主役なし疑い(最大の顔 幅{fs[0][2] * 100:.1f}%)'
        elif big[0][0] <= TOP_EDGE:
            edge.append((num, title)); mark = f'要確認(上端{big[0][0] * 100:.0f}%)'
        else:
            mark = f'OK(顔 上から{big[0][0] * 100:.0f}〜{big[0][1] * 100:.0f}%)'
        print(f'{num} {mark:22} {title[:52]}')

    print(f'\n=== 合計 {len(names)}枚 / 顔なし {len(noface)}枚 / 要確認 {len(edge)}枚 ===')
    for num, title, why in noface:
        print(f'顔なし {num}  [{why}] {title}')
    for num, title in edge:
        print(f'要確認 {num}  {title}')


if __name__ == '__main__':
    main()
