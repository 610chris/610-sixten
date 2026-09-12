#!/usr/bin/env python3
"""610 JOURNAL → Instagram カルーセル画像（3枚）の生成

`ig_queue.json` の1件から 1080x1350 のカードを3枚作り `site/assets/ig/NNN-1..3.jpg` に置く。
push → Actions が surge にデプロイ → `https://sixten.jp/assets/ig/NNN-1.jpg` が公開URLになる。
Instagram の投稿APIは「公開URLの画像」を食う仕様なので、これで外部ストレージが要らない。

    1枚目: ヒーロー写真（顔検出クロップ）＋カテゴリ＋見出し  ← 表紙
    2枚目: 黒地に要点3行                                    ← 中身
    3枚目: 出典・写真クレジット・プロフィールリンク導線        ← 締め

配色とフォントは site/journal/journal.css に合わせてある（Anton + Noto Sans JP）。

使い方:
    python3 journal_auto/ig_card.py 134          # キューの1件を作る
    python3 journal_auto/ig_card.py --all        # imagesが空の pending/approved を全部
    python3 journal_auto/ig_card.py 134 --preview  # キューに無くても記事HTMLだけで試作
"""

import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageOps

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ig_queue as Q  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT_DIR = os.path.join(Q.ROOT, "site", "assets", "ig")

W, H = 1080, 1350
PHOTO_H = 700
PAD = 72
JPEG_Q = 88

BG = (250, 249, 247)      # --bg  #faf9f7
TEXT = (19, 19, 19)       # --text #131313
ACCENT = (232, 68, 46)    # --accent #e8442e
BLACK = (20, 20, 20)      # --black #141414
MUTED = (111, 108, 103)   # --muted #6f6c67
LINE = (227, 224, 218)    # --line #e3e0da

# 行頭に来てはいけない/行末に来てはいけない文字（最小限の禁則処理）
NO_START = "、。，．）」』】〉》〕｝!?！？・:：;；ー…‐-%％"
NO_END = "（「『【〈《〔｛"


# ---------------------------------------------------------------- フォント

def anton(size):
    return ImageFont.truetype(os.path.join(FONTS, "Anton-Regular.ttf"), size)


def noto(size, weight=900):
    """weight 900 は静的Black、それ以外は可変フォントを指定ウェイトで開く"""
    if weight >= 900:
        return ImageFont.truetype(os.path.join(FONTS, "NotoSansJP-Black.ttf"), size)
    f = ImageFont.truetype(os.path.join(FONTS, "NotoSansJP-VariableFont_wght.ttf"), size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f


# ---------------------------------------------------------------- テキスト組み

def text_w(d, s, font):
    return d.textbbox((0, 0), s, font=font)[2]


WORD_CHARS = ".-_/'&+"


def tokenize(text):
    """日本語は1文字ずつ、英数字は単語ごとに1トークンにまとめる。

    1文字ずつ折ると "adidas.com" が "adidas.c / om" のように割れて読めなくなるので、
    ラテン文字・数字の連なりだけは塊のまま扱う。
    """
    out, buf = [], ""
    for ch in text:
        if ch.isascii() and (ch.isalnum() or ch in WORD_CHARS):
            buf += ch
            continue
        if buf:
            out.append(buf)
            buf = ""
        out.append(ch)
    if buf:
        out.append(buf)
    return out


def wrap_ja(d, text, font, max_w):
    """日本語は単語区切りが無いので詰めて折る。禁則と英単語だけ面倒を見る。"""
    lines, cur = [], ""

    def split_long(tk):
        """1行に収まらない長い英単語だけは文字単位で割る"""
        while text_w(d, tk, font) > max_w and len(tk) > 1:
            k = 1
            while k < len(tk) and text_w(d, tk[:k + 1], font) <= max_w:
                k += 1
            lines.append(tk[:k])
            tk = tk[k:]
        return tk

    for tk in tokenize(text):
        if tk == "\n":
            lines.append(cur)
            cur = ""
            continue
        if not cur and tk == " ":       # 折り返し直後の空白は落とす
            continue
        if cur and text_w(d, cur + tk, font) > max_w:
            if len(tk) == 1 and tk in NO_START:   # 行頭禁則: ぶら下げる
                cur += tk
                lines.append(cur)
                cur = ""
                continue
            if cur[-1] in NO_END:       # 行末禁則: 直前の1字を次行へ送る
                lines.append(cur[:-1])
                cur = cur[-1]
            else:
                lines.append(cur.rstrip())
                cur = ""
            tk = split_long(tk)
        cur += tk
    if cur:
        lines.append(cur)
    return lines


def fit_lines(d, text, max_w, max_h, sizes, weight=900, lh=1.32):
    """入るまでフォントを落とす。最小サイズでも溢れたら行を削って…を付ける。"""
    for size in sizes:
        f = noto(size, weight)
        lines = wrap_ja(d, text, f, max_w)
        if len(lines) * size * lh <= max_h:
            return f, lines, size * lh
    f = noto(sizes[-1], weight)
    lines = wrap_ja(d, text, f, max_w)
    keep = max(1, int(max_h // (sizes[-1] * lh)))
    if len(lines) > keep:
        lines = lines[:keep]
        lines[-1] = lines[-1][:-1] + "…"
    return f, lines, sizes[-1] * lh


def draw_lines(d, xy, lines, font, step, fill):
    x, y = xy
    for ln in lines:
        d.text((x, y), ln, font=font, fill=fill)
        y += step
    return y


def logo(name, height):
    p = os.path.join(Q.ASSETS_DIR, name)
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert("RGBA")
    return im.resize((round(im.width * height / im.height), height), Image.LANCZOS)


def chip(d, xy, label, bg=ACCENT, fg=(255, 255, 255), size=30):
    """カテゴリの四角いラベル（journal.css の .jr-cat 相当）"""
    f = anton(size)
    x, y = xy
    tw = text_w(d, label, f)
    d.rectangle([x, y, x + tw + 34, y + size + 22], fill=bg)
    d.text((x + 17, y + 8), label, font=f, fill=fg)
    return y + size + 22


# ---------------------------------------------------------------- 1枚目

def crop_hero(path, out_w, out_h):
    """ヒーローを顔検出つきで out_w x out_h に切る。pick_commons_photo の検出器を再利用。"""
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    face = None
    try:
        import pick_commons_photo as P
        face = P.detect_face(im)
    except Exception:
        face = None
    cx, cy = 0.5, 0.42
    if face:
        fx, fy = face
        target = out_w / out_h
        ch = min(im.height, im.width / target)
        cw = min(im.width, im.height * target)
        clamp = lambda v: min(1.0, max(0.0, v))
        # 顔の中心が枠の上から38%に来る位置を逆算（全身写真の頭切れ防止）
        cy = 0.5 if im.height - ch < 1 else clamp((fy * im.height - 0.38 * ch) / (im.height - ch))
        cx = 0.5 if im.width - cw < 1 else clamp((fx * im.width - 0.5 * cw) / (im.width - cw))
    return ImageOps.fit(im, (out_w, out_h), method=Image.LANCZOS, centering=(cx, cy))


def card_cover(item):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)

    hero = item.get("hero_path") or ""
    if hero and os.path.exists(hero):
        im.paste(crop_hero(hero, W, PHOTO_H), (0, 0))
    else:
        # 写真が取れなかった記事でも投稿カードは作れるようにする（黒ベタ＋ロゴ）
        d.rectangle([0, 0, W, PHOTO_H], fill=BLACK)
        lg = logo("journal-logo-white.png", 46)
        if lg:
            im.paste(lg, ((W - lg.width) // 2, PHOTO_H // 2 - 23), lg)
    d.rectangle([0, PHOTO_H, W, PHOTO_H + 6], fill=ACCENT)

    y = PHOTO_H + 6 + 44
    y = chip(d, (PAD, y), item["category"]) + 34

    foot_y = H - PAD - 46
    f, lines, step = fit_lines(d, item["headline"], W - PAD * 2, foot_y - y - 40,
                               [70, 64, 58, 52, 46, 42])
    draw_lines(d, (PAD, y), lines, f, step, TEXT)

    d.line([PAD, foot_y - 26, W - PAD, foot_y - 26], fill=LINE, width=2)
    lg = logo("journal-logo-black.png", 30)
    if lg:
        im.paste(lg, (PAD, foot_y), lg)
    fd = noto(24, 500)
    dt = item["date"].replace("-", ".")
    d.text((W - PAD - text_w(d, dt, fd), foot_y + 4), dt, font=fd, fill=MUTED)
    return im


# ---------------------------------------------------------------- 2枚目

def card_points(item):
    im = Image.new("RGB", (W, H), BLACK)
    d = ImageDraw.Draw(im)

    d.text((PAD, PAD), "POINTS", font=anton(46), fill=ACCENT)
    d.line([PAD, PAD + 74, W - PAD, PAD + 74], fill=(58, 56, 54), width=2)

    points = item.get("points") or [item.get("excerpt", "")]
    points = [p for p in points if p][:3]
    top, bottom = PAD + 130, H - PAD - 60
    area = bottom - top
    gap = 56
    slot = (area - gap * (len(points) - 1)) // max(1, len(points))

    # 先に全部組んでから、合計の高さで縦センターに置く（要点が1〜2行しか無い日に
    # 下半分がごっそり空くのを防ぐ）
    blocks = [fit_lines(d, p, W - PAD * 2 - 76, slot, [44, 40, 36, 32, 28], weight=700, lh=1.5)
              for p in points]
    total = sum(len(lines) * step for _, lines, step in blocks) + gap * (len(blocks) - 1)

    y = top + max(0, int((area - total) * 0.38))   # 真ん中より気持ち上（据わりが良い）
    for i, (f, lines, step) in enumerate(blocks):
        d.text((PAD, y + 6), f"{i + 1:02d}", font=anton(34), fill=ACCENT)
        y = draw_lines(d, (PAD + 76, y), lines, f, step, BG) + gap

    lg = logo("journal-logo-white.png", 28)
    if lg:
        im.paste(lg, (PAD, H - PAD - 14), lg)
    return im


# ---------------------------------------------------------------- 3枚目

def card_source(item):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 10], fill=ACCENT)

    lg = logo("journal-logo-black.png", 30)
    if lg:
        im.paste(lg, (PAD, H - PAD - 20), lg)

    # 出典・写真クレジットは下に固定して積む（CC BY-SA の表示義務。消さないこと）。
    # 上のブロックの長さで位置が動かないように先に確保する。
    fs = noto(24, 400)
    credits = []
    for label, val in (("出典", item.get("source")), ("写真", item.get("photo_credit"))):
        if val:
            credits += wrap_ja(d, f"{label}: {val}", fs, W - PAD * 2) + [""]
    if credits:
        credits.pop()
    credit_top = H - PAD - 70 - len(credits) * 34
    draw_lines(d, (PAD, credit_top), credits, fs, 34, MUTED)

    # 本体は残りの余白に縦センターで置く
    f, lines, step = fit_lines(d, "詳しくはプロフィールのリンクから。", W - PAD * 2, 200,
                               [42, 38, 34], weight=700, lh=1.4)
    body_h = 232 + 40 + len(lines) * step + 44 + 52
    y = 10 + max(PAD, int((credit_top - 40 - 10 - body_h) * 0.38))

    d.text((PAD, y), "READ THE", font=anton(96), fill=TEXT)
    d.text((PAD, y + 104), "FULL STORY", font=anton(96), fill=TEXT)
    y += 232
    d.line([PAD, y, W - PAD, y], fill=TEXT, width=3)
    y += 40

    y = draw_lines(d, (PAD, y), lines, f, step, TEXT) + 44
    d.text((PAD, y), "SIXTEN.JP / JOURNAL", font=anton(40), fill=ACCENT)
    return im


# ---------------------------------------------------------------- 出力

def build(item, preview=False):
    os.makedirs(OUT_DIR, exist_ok=True)
    urls = []
    for n, fn in enumerate((card_cover, card_points, card_source), 1):
        name = f"{item['id']}-{n}.jpg" if not preview else f"preview-{item['id']}-{n}.jpg"
        path = os.path.join(OUT_DIR, name)
        fn(item).save(path, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        print(f"  {path}")
        urls.append(f"{Q.SITE}/assets/ig/{name}")
    return urls


def main():
    ap = argparse.ArgumentParser(description="610 JOURNAL → IG カルーセル画像")
    ap.add_argument("id", nargs="?")
    ap.add_argument("--all", action="store_true", help="画像未生成の pending/approved を全部")
    ap.add_argument("--preview", action="store_true",
                    help="キューを使わず記事HTMLだけで試作（preview-*.jpg・キューは更新しない）")
    args = ap.parse_args()

    if args.preview:
        if not args.id:
            raise SystemExit("--preview には記事番号が要る")
        m = Q.article_meta(args.id)
        item = {"id": str(args.id).zfill(3), "category": m["category"], "date": m["date"],
                "headline": m["title"], "excerpt": m["excerpt"], "points": [],
                "source": "", "photo_credit": m["photo_credit"], "hero_path": m["hero_path"]}
        print(f"[preview] {item['id']} {item['headline']}")
        build(item, preview=True)
        return

    data = Q.load()
    if args.all:
        targets = [i for i in data["items"]
                   if i["state"] in ("pending", "approved") and not i["images"]]
    else:
        if not args.id:
            raise SystemExit("記事番号か --all が要る")
        it = Q.find(data, args.id)
        if not it:
            raise SystemExit(f"キューに {args.id} が無い（先に ig_queue.py add）")
        targets = [it]

    if not targets:
        print("（生成対象なし）")
        return
    for it in targets:
        print(f"[card] {it['id']} {it['headline']}")
        it["images"] = build(it)
    Q.save(data)


if __name__ == "__main__":
    sys.exit(main())
