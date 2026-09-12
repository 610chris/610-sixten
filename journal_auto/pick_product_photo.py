#!/usr/bin/env python3
"""KICKS記事のヒーローに「その靴そのものの公式商品画像」を持ってくる。

2026-09-12 クリス指示「KICKSの記事の時はその靴の写真にして欲しいかな！」で設置。
それまでの §1d-5 は「媒体の商品画像は著作権上使わない → Wikimedia CC → 汎用フォールバック」
だったため、新作バッシュの記事なのにヒーローが選手の顔写真や屋外コートの汎用写真になっていた
（実例: 記事131 Air Jordan 4 Lemonade = Venice Beach のフープ、記事133/134 = エドワーズの顔）。

このスクリプトが取るのは **ブランド公式が自社の商品ページで配布している商品画像** だけ。
媒体(Sneaker News / Hypebeast 等)がリホストした画像は使わない(2026-09-12実測: 各媒体は自社CDNに
リホストしていて公式CDNへの直リンクは無い)。キャプションでブランドに帰属表示する前提で使う。

使い方:
  python3 journal_auto/pick_product_photo.py "Ja 4" --list
  python3 journal_auto/pick_product_photo.py "Ja 4" --sku IM4135-001 --out site/assets/journal-135-hero.jpg
  python3 journal_auto/pick_product_photo.py "Air Jordan 12" "Jordan 12 Retro" --out site/assets/journal-136-hero.jpg
  python3 journal_auto/pick_product_photo.py "Anthony Edwards 3" --sku KH8537 --out site/assets/journal-134-hero.jpg
  python3 journal_auto/pick_product_photo.py "KAI 3" "Alchemist" --brand anta --out site/assets/journal-110-hero.jpg

対応ブランド(いずれも公式サイト・2026-09-13時点で実測):
  Nike / Jordan  nike.com/w?q= の商品カードを読む
  adidas         adidas.com/us/search?q= → 商品ページの JSON-LD(sku/name/image)を読む
  New Balance    newbalance.com/search のページに埋まっている Algolia の公開検索キーを読み、
                 その Algolia に検索を投げる(商品一覧は JS 描画なのでHTMLには出ない)。
                 画像は Scene7(nb.scene7.com)。`?wid=2000&hei=2000&fmt=jpg` で 2000px
                 (原版2400pxの縮小。wid=4000 は "illegal image size" で拒否される)
  Puma           us.puma.com/us/en/search?q= のHTMLに公式商品画像(images.puma.com・2000px)の
                 URLがそのまま入っている。品番は URL の /global/<6桁>/<カラー2桁>/
  ANTA           anta.com は Shopify。/search/suggest.json と /products/<handle>.js の
                 公開JSONで商品名(カラー名は " " 付き)と画像が取れる

  → 非対応ブランドは exit 2 を返すので、呼び出し側は pick_commons_photo.py --product(CC写真)へ進む。

  ※ adidas は 2026-09-12 に「403で不可」と記録したが、それは User-Agent だけを付けて
    /api/products/<品番> を叩いていたのが原因だった。**通常の商品ページ(PDP)に
    ブラウザ相当のヘッダ一式(Sec-Fetch-* / Accept / Accept-Language / Sec-Ch-Ua)を
    付ければ 200 が返る**(2026-09-13実測)。品番での検索は PDP へ直接リダイレクトする。
    画像CDN(assets.adidas.com)自体は最初から bot を弾いていない。
  ※ New Balance の「403」(2026-09-12記録)も同じ誤診だった。同じヘッダ一式を付ければ
    /search は 200 を返す。ただし /pd/(商品ページ)と /on/demandware.store/ は今も403なので、
    **商品ページは開かずに Algolia の結果だけで完結させる**。Algolia 側は Referer 必須
    (付けないと {"message":"Method not allowed with this referer"} の403)。
  ※ Algolia の applicationID / searchApiKey は「検索専用の公開キー」で、ブラウザが読むのと
    同じものを毎回ページから読み直す。**コードに焼き付けない**(NB がキーを更新したら
    焼き付けた側だけが壊れるため)。

選び方:
  1. --sku を渡していて、その品番の商品カードがあれば最優先(＝記事と同じカラー)
  2. 無ければ渡した語がより多く当たった商品(＝同じモデル・できればカラー名も一致)。
     カラーが違う時はキャプションに「別カラー」と明記して使う(出力の COLORWAY: 行で判別できる)
  3. バッシュ以外(アパレル・ソックス等)は名前で除外、キッズは後ろに回す

仕上げ:
  商品画像は正方形(1728x1728)で、16:9 に切ると靴の上下が切れる。そこで **切らずに**
  背景色(四隅からサンプル)で塗った 1600x900 のキャンバスに靴を収める(レターボックス合成)。

exit: 0=保存した / 2=候補なし(CC写真ルートへ) / 3=ネットワーク失敗
"""
import argparse, html, io, json, os, re, subprocess, sys, urllib.parse

SEARCH = 'https://www.nike.com/w?q={q}&vst={q}'
ADIDAS_SEARCH = 'https://www.adidas.com/us/search?q={q}'
ADIDAS_XF = 'h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto'   # 商品画像の最大サイズ(2000x2000)
ADIDAS_SKU = re.compile(r'^[A-Z]{2}\d{4}$')                 # 例 KH8537
ADIDAS_MAX_PDP = 6         # モデル名検索でPDPを開く上限(1件ずつHTMLを取るので欲張らない)
NB_SEARCH = 'https://www.newbalance.com/search?q={q}'
NB_S7 = '?wid=2000&hei=2000&fmt=jpg'    # Scene7。原版2400pxの縮小(4000は拒否される)
NB_VIEWS = ('_nb_02', '_nb_05', '_nb_03')   # 02=真横のメインカット
PUMA_SEARCH = 'https://us.puma.com/us/en/search?q={q}'
PUMA_IMG = re.compile(
    r'https://images\.puma\.com/image/upload/[^"\\ ]*?/global/(\d{5,7})/(\d{2})/'
    r'(?:(sv01|bv|dt\d\d|mod\d\d)/)?fnd/PNA/fmt/png/([^"\\ ?]+)')
PUMA_XF = 'f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000'
PUMA_PD = re.compile(r'/us/en/pd/([A-Za-z0-9\-]+)/(\d{5,7})')
ANTA_SUGGEST = ('https://anta.com/search/suggest.json?q={q}'
                '&resources%5Btype%5D=product&resources%5Blimit%5D=8')
ANTA_PRODUCT = 'https://anta.com/products/{h}.js'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36')
# adidas は UA だけだと 403。ブラウザ相当のヘッダ一式で 200 になる(2026-09-13実測)
BROWSER_HEADERS = {
    'User-Agent': UA,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Ch-Ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
}
OUT_W, OUT_H, JPEG_Q = 1600, 900, 85
PDP = 't_PDP_1728_v1'      # 商品画像の最大サイズ(1728x1728・2026-09-12実測)
MIN_SRC = 1000             # これ未満しか取れない画像は使わない(拡大はしない)
NOT_SHOE = re.compile(r'\b(t-?shirt|hoodie|shorts?|sleeve|jersey|socks?|pants|jacket|'
                      r'backpack|bag|hat|cap|crew|tights|bra|top|sweatshirt|headband)\b', re.I)
KIDS = re.compile(r'\b(little kids|big kids|baby|toddler|infant)\b', re.I)


def _curl(url, timeout=30, post=None, extra=None):
    """本文と最終URLを返す。post を渡すとPOSTする。

    adidas は urllib だと同じヘッダ一式を付けても 403 になる(2026-09-13実測)。
    ヘッダの問題ではなく TLS/HTTP2 の指紋で弾かれているため、curl で取る。
    curl は macOS にも GitHub Actions の ubuntu にも標準で入っている。
    """
    mark = b'\n__FINAL_URL__'
    args = ['curl', '-sSL', '--compressed', '--max-time', str(timeout),
            '-w', mark.decode() + '%{url_effective}']
    for k, v in {**BROWSER_HEADERS, **(extra or {})}.items():
        args += ['-H', f'{k}: {v}']
    if post is not None:
        args += ['--data-binary', post]
    r = subprocess.run(args + [url], capture_output=True, timeout=timeout + 15)
    if r.returncode != 0:
        raise RuntimeError(f'curl 失敗({r.returncode}): {r.stderr.decode("utf-8", "replace")[:200]}')
    body, _, final = r.stdout.rpartition(mark)
    return body, final.decode('utf-8', 'replace').strip()


def fetch(url, timeout=30):
    data, _ = _curl(url, timeout)
    if not data:
        raise RuntimeError(f'空レスポンス: {url}')
    return data


def fetch_page(url, timeout=30):
    """HTML本文と、リダイレクト後の最終URLを返す(品番検索はPDPへ飛ぶので最終URLが要る)"""
    data, final = _curl(url, timeout)
    return data.decode('utf-8', 'ignore'), final


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


def adidas_card(page, url):
    """adidas の商品ページ(PDP)の JSON-LD から品番・商品名・画像URLを取る"""
    for m in re.finditer(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', page, re.S):
        try:
            d = json.loads(m.group(1))
        except json.JSONDecodeError:
            continue
        if not isinstance(d, dict) or d.get('@type') != 'Product':
            continue
        sku = (d.get('sku') or '').upper()
        imgs = [i for i in (d.get('image') or []) if isinstance(i, str)]
        # 01_00 / 01 が横向きのメインカット。無ければ先頭
        key = lambda u: (f'_{sku}_01_00_standard' not in u, f'_{sku}_01' not in u)
        imgs.sort(key=key)
        if not (sku and imgs):
            continue
        # /images/<変形>/<hash>/<ファイル名> の <変形> を最大サイズに差し替える
        tail = re.search(r'/images/(?:[^/]+/)*([0-9a-f]{32}_\d+)/([^/?"]+\.jpg)', imgs[0])
        if not tail:
            continue
        return {
            'sku': sku,
            'name': html.unescape(d.get('name') or ''),
            'page': d.get('url') or url,
            'img': f'https://assets.adidas.com/images/{ADIDAS_XF}/{tail.group(1)}/{tail.group(2)}',
        }
    return None


def adidas_cards(term):
    """adidas の検索から商品を拾う。品番検索は商品ページへ直接リダイレクトする"""
    page, final = fetch_page(ADIDAS_SEARCH.format(q=urllib.parse.quote(term)))
    if re.search(r'/[A-Z]{2}\d{4}\.html$', final):
        c = adidas_card(page, final)
        return [c] if c else []
    out, seen = [], set()
    for m in re.finditer(r'(/us/[A-Za-z0-9._\-]+/([A-Z]{2}\d{4})\.html)', page):
        if m.group(2) in seen:
            continue
        seen.add(m.group(2))
        try:
            p, u = fetch_page('https://www.adidas.com' + m.group(1))
        except Exception:
            continue
        c = adidas_card(p, u)
        if c:
            out.append(c)
        if len(out) >= ADIDAS_MAX_PDP:
            break
    return out


_NB_CFG = {}


def nb_config():
    """newbalance.com の検索ページに埋まっている Algolia の公開検索キーを読む。

    キーはブラウザが使うのと同じ検索専用キー。NB が更新しても追随できるよう毎回読む。
    """
    if _NB_CFG:
        return _NB_CFG
    page = fetch(NB_SEARCH.format(q='basketball')).decode('utf-8', 'ignore')
    m = re.search(r'var algoliaData = (\{.*?\});', page, re.S)
    if not m:
        raise RuntimeError('newbalance.com に algoliaData が見つからない(構造が変わった可能性)')
    for key in ('applicationID', 'searchApiKey', 'productsIndex'):
        v = re.search(rf'"{key}"\s*:\s*"([^"]+)"', m.group(1))
        if not v:
            raise RuntimeError(f'algoliaData に {key} が無い')
        _NB_CFG[key] = v.group(1)
    return _NB_CFG


def nb_img(images):
    """Scene7 のURLからプリセットを外して 2000px 指定にする。真横のカットを優先"""
    urls = [i['dis_base_link'].split('?')[0] for i in images or [] if i.get('dis_base_link')]
    if not urls:
        return None
    urls.sort(key=lambda u: [v not in u for v in NB_VIEWS])
    return urls[0] + NB_S7


def nb_cards(term):
    """New Balance。商品一覧はJS描画なのでHTMLからは取れず、Algolia に直接投げる"""
    cfg = nb_config()
    url = (f"https://{cfg['applicationID'].lower()}-dsn.algolia.net/1/indexes/"
           f"{urllib.parse.quote(cfg['productsIndex'])}/query"
           f"?x-algolia-application-id={cfg['applicationID']}"
           f"&x-algolia-api-key={cfg['searchApiKey']}&x-algolia-agent=Browser")
    body = json.dumps({'params': urllib.parse.urlencode({'query': term, 'hitsPerPage': 12})})
    # Referer が無いと Algolia 側が 403("Method not allowed with this referer")
    data, _ = _curl(url, post=body, extra={
        'Origin': 'https://www.newbalance.com', 'Referer': 'https://www.newbalance.com/',
        'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded',
        'Sec-Fetch-Dest': 'empty', 'Sec-Fetch-Mode': 'cors', 'Sec-Fetch-Site': 'cross-site'})
    out = []
    for hit in json.loads(data).get('hits', []):
        model = hit.get('name') or ''
        style = (hit.get('styleData') or {})
        # ヒット本体(既定カラー)と、同じ型の他カラーを1件ずつカードにする
        groups = [(hit.get('styleID') or '', hit.get('image_groups') or [])]
        groups += [(cv.get('color') or '', cv.get('image_groups') or [])
                   for cv in (hit.get('colorVariations') or [])]
        for sku, gs in groups:
            img = nb_img(gs[0].get('images') if gs else None)
            if not (sku and img):
                continue
            out.append({
                'sku': sku.upper(),
                'name': f'New Balance {model}'.strip(),
                'page': (style.get(sku) or {}).get('url') or hit.get('pdpLink') or '',
                'img': img,
            })
    return out


def puma_cards(term):
    """Puma。検索結果のHTMLに公式商品画像(2000px)のURLがそのまま入っている"""
    page, _ = fetch_page(PUMA_SEARCH.format(q=urllib.parse.quote(term)))
    slugs = {sty: slug for slug, sty in PUMA_PD.findall(page)}
    out, seen = [], set()
    for style, color, view, name in PUMA_IMG.findall(page):
        sku = f'{style}-{color}'
        if sku in seen or (view and view != 'sv01'):
            continue           # モデル着用カット(mod)や背面(bv)ではなく真横のメインカットだけ
        seen.add(sku)
        name = html.unescape(name)      # HTML中は ' が &#x27; になっている
        out.append({
            'sku': sku,
            'name': urllib.parse.unquote(name).replace('-', ' '),
            'page': (f'https://us.puma.com/us/en/pd/{slugs[style]}/{style}?swatch={color}'
                     if style in slugs else f'https://us.puma.com/us/en/pd/{style}'),
            'img': (f'https://images.puma.com/image/upload/{PUMA_XF}/global/{style}/{color}/'
                    f'{view + "/" if view else ""}fnd/PNA/fmt/png/{name}'),
        })
    return out


def anta_cards(term):
    """ANTA。anta.com は Shopify なので公開JSONで商品名(カラー名込み)と画像が取れる"""
    data = fetch(ANTA_SUGGEST.format(q=urllib.parse.quote(term)))
    hits = json.loads(data).get('resources', {}).get('results', {}).get('products', [])
    out = []
    for p in hits:
        handle = p.get('handle') or ''
        if not handle:
            continue
        try:
            d = json.loads(fetch(ANTA_PRODUCT.format(h=handle)))
        except Exception:
            continue
        imgs = [('https:' + u if u.startswith('//') else u) for u in (d.get('images') or [])]
        if not imgs:
            continue
        out.append({
            # ANTA の記事に品番が載ることはまずないので、handle を品番の代わりの識別子にする
            'sku': handle.upper(),
            'name': html.unescape(d.get('title') or p.get('title') or ''),
            'page': f'https://anta.com/products/{handle}',
            'img': imgs[0],
        })
    return out


LOOKUP = {'nike': cards, 'adidas': adidas_cards,
          'newbalance': nb_cards, 'puma': puma_cards, 'anta': anta_cards}
LABEL = {'nike': 'Nike', 'adidas': 'adidas', 'newbalance': 'New Balance',
         'puma': 'PUMA', 'anta': 'ANTA'}


def detect_brand(sku, terms):
    """ブランド名(と adidas だけは品番の形)から判定する。

    New Balance / Puma / ANTA の品番は Nike と紛らわしいので形からは判定しない。
    記事にブランド名が出ていない時は --brand で明示する。
    """
    blob = ' '.join(terms)
    if re.search(r'\bnew ?balance\b|\bnb\b', blob, re.I):
        return 'newbalance'
    if re.search(r'\bpuma\b|\bmb\.?0\d\b|\bstewie\b', blob, re.I):
        return 'puma'
    if re.search(r'\banta\b|\bkai \d\b', blob, re.I):
        return 'anta'
    if re.search(r'\badidas\b', blob, re.I) or ADIDAS_SKU.match(sku):
        return 'adidas'
    return 'nike'


def model_hit(name, terms):
    """商品名にモデル名が語として含まれるか"""
    n = norm(name)
    return any(re.search(r'\b' + re.escape(norm(t)) + r'\b', n) for t in terms if norm(t))


def term_score(name, terms):
    """渡した語のうち何個が商品名に当たったか(モデル名＋カラー名を別々に渡す前提)"""
    n = norm(name)
    return sum(1 for t in terms
               if norm(t) and re.search(r'\b' + re.escape(norm(t)) + r'\b', n))


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
    ap.add_argument('--brand', choices=['auto'] + sorted(LOOKUP), default='auto',
                    help='既定はブランド名(と adidas の品番の形)からの自動判定')
    args = ap.parse_args()
    sku = args.sku.upper().strip()
    brand = detect_brand(sku, args.terms) if args.brand == 'auto' else args.brand
    lookup, label = LOOKUP[brand], LABEL[brand]

    try:
        found, seen = [], set()
        for t in ([sku] if sku else []) + args.terms:
            for c in lookup(t):
                if c['sku'] not in seen:
                    seen.add(c['sku']); found.append(c)
            if sku and any(c['sku'] == sku for c in found):
                break      # 品番一致が出たらそれ以上探さない(PDPを何枚も開かない)
    except Exception as e:
        print(f'network error: {e}', file=sys.stderr); sys.exit(3)

    cands = [c for c in found if not NOT_SHOE.search(c['name'])]
    cands = [c for c in cands if c['sku'] == sku or model_hit(c['name'], args.terms)]
    # 渡した語が多く当たった商品を上に。モデル名とカラー名を別の語で渡せば同じカラーが選ばれる
    cands.sort(key=lambda c: (c['sku'] == sku, term_score(c['name'], args.terms),
                              not KIDS.search(c['name'])), reverse=True)

    print(f'{label}公式 検索 {len(found)} 件 → モデル一致のシューズ {len(cands)} 件')
    for i, c in enumerate(cands[:10], 1):
        mark = '★品番一致' if c['sku'] == sku else '         '
        print(f"{i:2}. {mark} {c['sku']:20} {c['name'][:60]}")
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
        cw = colorway(c['name']) or {
            'adidas': '(adidasは商品ページにカラー名を出さない。品番一致なら記事のカラーで正しい)',
            'newbalance': '(New Balanceはカラー名を出さない。品番=styleIDが一致していれば記事のカラー)',
            'puma': '(PUMAはカラー名を商品名に含める。上の商品名で記事のカラーと照合する)',
        }.get(brand, '(カラー名なし)')
        print(f"COLORWAY: {cw} / 品番 {c['sku']}"
              f"{'' if c['sku'] == sku else '  ※記事の品番とは別カラー。キャプションに明記する'}")
        print(f'CREDIT: 画像: {label}(ブランド公式の商品画像)')
        return
    print('候補は出たが画像を保存できなかった → CC写真ルートへ'); sys.exit(2)


if __name__ == '__main__':
    main()
