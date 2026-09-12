#!/usr/bin/env python3
"""KICKS記事のヒーローに「その靴そのものの公式商品画像」を持ってくる。

2026-09-12 クリス指示「KICKSの記事の時はその靴の写真にして欲しいかな！」で設置。
それまでの §1d-5 は「媒体の商品画像は著作権上使わない → Wikimedia CC → 汎用フォールバック」
だったため、新作バッシュの記事なのにヒーローが選手の顔写真や屋外コートの汎用写真になっていた
（実例: 記事131 Air Jordan 4 Lemonade = Venice Beach のフープ、記事133/134 = エドワーズの顔）。

このスクリプトが取るのは **ブランド公式(nike.com)が自社の商品ページで配布している商品画像** だけ。
媒体(Sneaker News / Hypebeast 等)がリホストした画像は使わない(2026-09-12実測: 各媒体は自社CDNに
リホストしていて公式CDNへの直リンクは無い)。キャプションでブランドに帰属表示する前提で使う。

使い方:
  python3 journal_auto/pick_product_photo.py "Ja 4" --list
  python3 journal_auto/pick_product_photo.py "Ja 4" --sku IM4135-001 --out site/assets/journal-135-hero.jpg
  python3 journal_auto/pick_product_photo.py "Air Jordan 12" "Jordan 12 Retro" --out site/assets/journal-136-hero.jpg

対応ブランド:
  Nike / Jordan のみ(nike.com/w?q= の商品カードを読む)。
  adidas・New Balance・Puma は公式サイトが bot を弾く(403 / 202空・2026-09-12実測)ため未対応。
  品番から画像URLを組み立てる adidas CDN のパターンも 404 で不可だった。
  → 非対応ブランドは exit 2 を返すので、呼び出し側は pick_commons_photo.py --product(CC写真)へ進む。

選び方:
  1. --sku を渡していて、その品番の商品カードがあれば最優先(＝記事と同じカラー)
  2. 無ければモデル名が商品名に一致するもの(＝同じモデルの別カラー。キャプションに
     「別カラー」と明記して使う。出力の COLORWAY: 行で判別できる)
  3. バッシュ以外(アパレル・ソックス等)は名前で除外、キッズは後ろに回す

仕上げ:
  商品画像は正方形(1728x1728)で、16:9 に切ると靴の上下が切れる。そこで **切らずに**
  背景色(四隅からサンプル)で塗った 1600x900 のキャンバスに靴を収める(レターボックス合成)。

exit: 0=保存した / 2=候補なし(CC写真ルートへ) / 3=ネットワーク失敗
"""
import argparse, html, io, os, re, sys, urllib.parse, urllib.request

SEARCH = 'https://www.nike.com/w?q={q}&vst={q}'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36')
OUT_W, OUT_H, JPEG_Q = 1600, 900, 85
PDP = 't_PDP_1728_v1'      # 商品画像の最大サイズ(1728x1728・2026-09-12実測)
MIN_SRC = 1000             # これ未満しか取れない画像は使わない(拡大はしない)
NOT_SHOE = re.compile(r'\b(t-?shirt|hoodie|shorts?|sleeve|jersey|socks?|pants|jacket|'
                      r'backpack|bag|hat|cap|crew|tights|bra|top|sweatshirt|headband)\b', re.I)
KIDS = re.compile(r'\b(little kids|big kids|baby|toddler|infant)\b', re.I)


def fetch(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
    return urllib.request.urlopen(req, timeout=timeout).read()


def norm(s):
    """比較用のゆるい正規化(Air Jordan 4 と air-jordan-4 を同じ扱いにする)"""
    return re.sub(r'[^a-z0-9 ]+', ' ', html.unescape(s or '').lower()).strip()


def cards(term):
    """nike.com の検索結果から商品カード(品番・商品名・画像URL)を抜く"""
    page = fetch(SEARCH.format(q=urllib.parse.quote(term))).decode('utf-8', 'ignore')
    out = []
    for c in re.findall(r'<div class="product-card [^"]*".*?</figure>', page, re.S):
        href = re.search(r'href="(https://www\.nike\.com/t/[^"]+)"', c)
        alt = re.search(r'<img alt="([^"]*)"', c)
        src = re.search(r'src="(https://static\.nike\.com/[^"]+)"', c)
        if not (href and src):
            continue
        out.append({
            'sku': href.group(1).rsplit('/', 1)[-1].upper(),
            'name': html.unescape(alt.group(1) if alt else ''),
            'page': href.group(1),
            'img': re.sub(r'/t_[a-zA-Z0-9_]+/', f'/{PDP}/', src.group(1)),
        })
    return out


def model_hit(name, terms):
    """商品名にモデル名が語として含まれるか"""
    n = norm(name)
    return any(re.search(r'\b' + re.escape(norm(t)) + r'\b', n) for t in terms if norm(t))


def colorway(name):
    """商品名から "Dark Mode" のようなカラー名を取り出す"""
    m = re.search(r'"([^"]{2,40})"', name)
    return m.group(1) if m else ''


def save_hero(data, out):
    """切らずに 1600x900 に収める。余白は元画像の背景色(四隅の平均)で塗る"""
    from PIL import Image
    im = Image.open(io.BytesIO(data)).convert('RGB')
    if min(im.width, im.height) < MIN_SRC:
        return None
    k = max(8, min(im.width, im.height) // 40)
    px = [im.crop(b).resize((1, 1), Image.LANCZOS).getpixel((0, 0)) for b in (
        (0, 0, k, k), (im.width - k, 0, im.width, k),
        (0, im.height - k, k, im.height), (im.width - k, im.height - k, im.width, im.height))]
    bg = tuple(sum(v[i] for v in px) // len(px) for i in range(3))
    scale = min(OUT_W * 0.96 / im.width, OUT_H * 0.96 / im.height)
    im = im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)
    canvas = Image.new('RGB', (OUT_W, OUT_H), bg)
    canvas.paste(im, ((OUT_W - im.width) // 2, (OUT_H - im.height) // 2))
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    canvas.save(out, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True)
    return bg


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('terms', nargs='+', help='モデル名(英語表記。別表記も並べてよい)')
    ap.add_argument('--sku', default='', help='品番(例 IM4135-001)。一致する商品があれば最優先')
    ap.add_argument('--out', help='保存先 site/assets/journal-NNN-hero.jpg')
    ap.add_argument('--list', action='store_true', help='候補一覧だけ表示')
    ap.add_argument('--pick', type=int, default=1, help='一覧のN番目を採用(既定1)')
    args = ap.parse_args()
    sku = args.sku.upper().strip()

    try:
        found, seen = [], set()
        for t in ([sku] if sku else []) + args.terms:
            for c in cards(t):
                if c['sku'] not in seen:
                    seen.add(c['sku']); found.append(c)
    except Exception as e:
        print(f'network error: {e}', file=sys.stderr); sys.exit(3)

    cands = [c for c in found if not NOT_SHOE.search(c['name'])]
    cands = [c for c in cands if c['sku'] == sku or model_hit(c['name'], args.terms)]
    cands.sort(key=lambda c: (c['sku'] == sku, model_hit(c['name'], args.terms),
                              not KIDS.search(c['name'])), reverse=True)

    print(f'Nike公式 検索 {len(found)} 件 → モデル一致のシューズ {len(cands)} 件')
    for i, c in enumerate(cands[:10], 1):
        mark = '★品番一致' if c['sku'] == sku else '         '
        print(f"{i:2}. {mark} {c['sku']:14} {c['name'][:60]}")
    if not cands:
        print('公式の商品画像なし → pick_commons_photo.py --product(CC写真)へ'); sys.exit(2)
    if args.list and not args.out:
        return
    if not args.out:
        print('--out が必要', file=sys.stderr); sys.exit(1)

    for c in cands[args.pick - 1:] + cands[:args.pick - 1]:
        try:
            data = fetch(c['img'])
        except Exception as e:
            print(f"  取得失敗 {c['sku']}: {e}"); continue
        try:
            bg = save_hero(data, args.out)
        except ImportError:
            print('Pillow が必要(pip install pillow)', file=sys.stderr); sys.exit(3)
        if bg is None:
            print(f"  解像度不足 {c['sku']}(拡大はしない)"); continue
        print(f"保存: {args.out} ({OUT_W}x{OUT_H}) 背景 rgb{bg}")
        print(f"SOURCE: {c['page']}")
        print(f"COLORWAY: {colorway(c['name']) or '(カラー名なし)'} / 品番 {c['sku']}"
              f"{'' if c['sku'] == sku else '  ※記事の品番とは別カラー。キャプションに明記する'}")
        print('CREDIT: 画像: Nike(ブランド公式の商品画像)')
        return
    print('候補は出たが画像を保存できなかった → CC写真ルートへ'); sys.exit(2)


if __name__ == '__main__':
    main()
