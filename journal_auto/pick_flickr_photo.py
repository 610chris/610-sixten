#!/usr/bin/env python3
"""Flickr の CC ライセンス写真から hero を1枚選んで保存する（Wikimedia Commons の次に試す②番目のルート）。

2026-09-13 クリスの質問「これ以外にも選手の話をしている時はチームのIGから写真とか持ってきて
クレジット付けられない？」への回答として設置。**チームのIGの写真はクレジットを付けても使えない**
（①クレジットは許諾ではない。NBA/Bリーグの試合写真は Getty/NBAE 契約で、チーム自身も再許諾できない
ことが多い ②Instagram の利用規約が画像の抜き出しと自サイトへの再アップを禁止していて、認められて
いるのは公式 embed だけ ③その embed は og:image と JSON-LD に実ファイルURLが要る hero には使えない）。
代わりに「許諾が写真そのものに付いている」CC 写真の在庫を Commons の外へ広げるのがこのファイル。

使い方（pick_commons_photo.py / pick_product_photo.py と同じ作法）:
  python3 journal_auto/pick_flickr_photo.py "Kyrie Irving" --out site/assets/journal-NNN-hero.jpg
  python3 journal_auto/pick_flickr_photo.py "Jayson Tatum" "Tatum Celtics" --list   # 候補一覧だけ
  python3 journal_auto/pick_flickr_photo.py "Air Jordan 1" --product --out ...      # 靴モード
  # 画像の切り直しだけしたい時は pick_commons_photo.py --from-url を使う（このファイルには無い）

呼び出し順（PROMPT_CLOUD.md §1b / §1d-5）:
  ①Wikimedia Commons(pick_commons_photo.py) → ②Flickr CC(このファイル) → ③汎用フォールバック

ライセンス（最重要・2026-09-13 実測で組んだ）:
  検索URLに license=4,5,9,10 を付けるが、**それを信用せず写真1枚ずつ実物のページから読み直す**。
  採用するのは CC BY / CC BY-SA / CC0 / Public Domain Mark の4つだけ。
  **NC（非商用）と ND（改変禁止）は絶対に採らない**（610 JOURNAL は事業サイトなので NC は使えない。
  ND は 16:9 クロップが改変に当たりうる）。判定は creativecommons.org のURLそのものを見るので、
  Flickr 側のIDが間違っていても NC/ND が混ざることはない。

取得の仕組み（APIキー不要。2026-09-13 実測）:
  ①検索: https://www.flickr.com/search/?text=<語>&license=4,5,9,10 が 200 を返し、HTML に
    `modelExport:` の JSON が埋まっている。そこから id / 題名 / ライセンスID / 撮影者
    (realname・username) / pathAlias が取れる。ただし **画像URLは長辺1024(`l`)で頭打ち**。
  ②実寸: だから写真ごとに /photos/<pathAlias>/<id>/sizes/o/ を開く。このページには
    creativecommons.org のライセンスURLと、その写真で用意されている全サイズが実寸付きで載っている
    （sq/q/t/s/n/w/m/z/c/l/h/k/o）。**採るのは条件を満たす中で一番小さいサイズ**で、原寸ではない
    （理由は detail() のコメント。ボケ判定の較正と通信量の両方）。原寸を選んだ時だけ、開いている
    /sizes/o/ ページの画像がそれなので追加の通信が要らない。

判定（Commons 版と同じ土俵に揃えてある。画質を落として②に流れる意味がないため）:
  画質: 幅>=1600 かつ 高さ>=900（--product は短辺>=1000）。拡大はしない
  ボケ: pick_commons_photo の blur_score / blur_ng をそのまま使う（等倍＋400px縮小の2段）
  クロップ: 選手写真は顔検出（YuNet）で顔が上から32%に来る位置、靴は切らずにレターボックス合成
  被写体: 選手モードは**顔が1つも検出できない写真を落とす**（--allow-faceless で解除）。Flickr は
        Commons と違って個人の日常写真が主で、題名に選手名が入っているだけのグッズ・小物が混ざるため。
        それでも「別人」までは機械では弾けない（実測: "Stephen Curry" で『Mrs Stephen Curry』＝
        本人でない写真が上位に来た）ので、**公開前の目視確認は必須**。スクリプトも最後に警告を出す
  誤マッチ対策（2026-09-13 目視確認で4枚中2枚が誤マッチだったのを受けて追加。詳細は各関数のコメント）:
        ①題名に検索語が1つも入っていない写真は採らない（eligible の model>0）。実測で落ちた
          『Air Jordan 1』検索の "ゴミの野焼き" はこれ。上位が解像度で脱落すると一致0まで降りていた
        ②靴モードは SHOE_HINT を**必須条件**にする（Commons 版と同じ。従来は順位付けの加点だけ）
        ③BAD_TITLE に Mrs/wife/wedding/grave 等の family-history 系を追加（『Mrs Stephen Curry』＝
          同姓の別人の夫人・19世紀の肖像写真を塞ぐ）
        ④scan_ng(): 台紙に貼った古写真のスキャンを落とす（選手モードのみ・--allow-scan で解除）
  並び順: 題名の語一致（model_score）→ 解像度 → 写真IDの大きい順。**Flickr の検索結果には撮影日が
        入っていない**ので Commons のような「直近3年」の絞り込みはできない。IDは通し番号なので
        大きいほど新しくアップされたという目安にしかならず、撮影日として扱わない（捏造しない）。

出力: 候補を順位付きで表示し、--out があれば 1600x900 で保存。最後に
      `CREDIT: 撮影: <撮影者> / <ライセンス>, via Flickr` を出す（キャプションにそのまま使う）。
      候補ゼロ / 全滅は exit 2（→ ③フォールバックへ）。ネットワーク失敗は exit 3。

在庫の実感（2026-09-13 実測）: Flickr の NBA 系 CC 写真は Erik Drost（2012-2016 のキャバリアーズ）
      など特定の撮影者に偏っていて、新しい選手ほど手薄（"victor wembanyama" は0件）。
      Commons の All-Pro Reels 22,980枚の方が本命で、これはあくまで②の補欠。
"""
import argparse, os, re, sys, json, urllib.parse, urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pick_commons_photo import (  # noqa: E402  画質・ボケ・クロップの判定は Commons 版と共有する
    MIN_W, MIN_H, OUT_W, OUT_H, PROD_MIN_SIDE, FACE_TOP, SHOE_HINT, NOT_SHOE,
    blur_score, blur_ng, model_score, save_hero, save_hero_product, detect_face,
)

SEARCH = 'https://www.flickr.com/search/'
# Flickr は素の urllib の UA だと検索ページを返さないことがあるのでブラウザ相当を名乗る
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36')
OK_LICENSE_IDS = '4,5,9,10'   # 検索URLに渡す値。CC BY / CC BY-SA / CC0 / PDM
PER_PAGE = 25                 # 検索1ページあたりの件数（Flickr 側の既定）
# creativecommons.org のURL → キャプションに書く名前。**この表に無いURLは全部不採用**
# （by-nc / by-nc-sa / by-nc-nd / by-nd はここに載せない＝弾かれる）。by-sa を by より先に見る
CC_OK = [
    (re.compile(r'creativecommons\.org/licenses/by-sa/([\d.]+)'), 'CC BY-SA {}'),
    (re.compile(r'creativecommons\.org/licenses/by/([\d.]+)'), 'CC BY {}'),
    (re.compile(r'creativecommons\.org/publicdomain/zero/([\d.]+)'), 'CC0 {}'),
    (re.compile(r'creativecommons\.org/publicdomain/mark/([\d.]+)'), 'Public Domain Mark {}'),
]
# 題名の時点で「選手本人の写真ではない」と分かるもの。Flickr は Commons と違って個人の日常写真が
# 大量にあり、選手名を題名に含むグッズ・ファンアートが混ざる（2026-09-13 実測: "Stephen Curry" の
# 1位が『NBA GRADUATION TOWEL CAKE (Stephen Curry)』というケーキの写真だった）
# 後半の mrs/wife 以降は「同姓の別人（家系・古写真アルバム）」対策。2026-09-13 の目視確認で
# "Stephen Curry" の採用結果が『4 - Mrs Stephen Curry - Enhanced』＝19世紀のセピア調肖像写真の
# 年配女性（同姓の別人の夫人）だった。Flickr には家系調査のスキャン写真が大量にあり、名字が一致
# するだけで上位に来る。撮影日では弾けない（この写真の dateTaken は 2020-11-20＝スキャンした日）
BAD_TITLE = re.compile(r'\blogo\b|\bmap\b|screenshot|trading card|\bstamp\b|\bticket\b|\bcake\b|'
                       r'\bfunko\b|\btoy\b|\bmural\b|\btattoo\b|\bposter\b|\bbillboard\b|'
                       r'\bdrawing\b|\bpainting\b|\bsketch\b|\bfan ?art\b|\bcostume\b|\bcookie\b|'
                       r'\bmrs\.?\b|\bmr\.?\b|\bwife\b|\bhusband\b|\bwedding\b|\bfuneral\b|'
                       r'\bgrave\b|\bgravestone\b|\bheadstone\b|\bcemetery\b|\bobituary\b|'
                       r'\bancestry\b|\bgenealogy\b|\bfamily tree\b', re.I)
# 台紙スキャン判定のしきい値（2026-09-13 実測で較正。数値は analyze() のコメントに全部載せた）
SCAN_EDGE_MAX = 12.0   # 外周3pxの明度の標準偏差。これ未満＝周りが一様＝余白・台紙の疑い
SCAN_HUE_MIN = 0.95    # 色相の集中度(0〜1)。これ超え＝ほぼ単色＝セピア・モノクロの疑い


def fetch_html(url, timeout=40):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode('utf-8', 'replace')


def fetch_bytes(url, timeout=60):
    if url.startswith('//'):
        url = 'https:' + url
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def model_export(html):
    """検索ページの HTML に埋まっている modelExport の JSON を取り出す"""
    m = re.search(r'modelExport:\s*(\{.*?\}),\s*\n\s*auth:', html, re.S)
    return json.loads(m.group(1)) if m else None


def search(term, limit):
    """検索語1つぶんの候補を返す。画像URLはこの時点では長辺1024止まり（実寸は detail で取る）"""
    out, page = [], 1
    while len(out) < limit and page <= (limit + PER_PAGE - 1) // PER_PAGE:
        q = urllib.parse.urlencode({'text': term, 'license': OK_LICENSE_IDS, 'page': page})
        data = model_export(fetch_html(SEARCH + '?' + q))
        if not data:
            break
        try:
            items = data['main']['search-photos-lite-models'][0]['data']['photos']['data']['_data']
        except (KeyError, IndexError):
            break
        if not items:
            break
        for it in items:
            # 検索結果には中身が null の枠（広告・Getty 差し込み）が混ざるので飛ばす
            n = (it or {}).get('data') or {}
            if not n.get('id') or not n.get('pathAlias'):
                continue
            sizes = [v['data'] for v in (n.get('sizes') or {}).get('data', {}).values()]
            best = max(sizes, key=lambda s: s['width'] * s['height']) if sizes else {'width': 0, 'height': 0}
            out.append({
                'id': n['id'],
                'title': n.get('title') or '',
                'lic_id': n.get('license'),
                'author': (n.get('realname') or n.get('username') or '').strip(),
                'path': n['pathAlias'],
                'page': f"https://www.flickr.com/photos/{n['pathAlias']}/{n['id']}/",
                'lite_w': best['width'], 'lite_h': best['height'],
            })
        page += 1
    return out


def eligible(c, product=False):
    """一次ふるい。ここを通ったものだけ実寸とライセンスを見に行く（c['model'] を先に入れておくこと）

    2026-09-13 追加の2条件が誤マッチ対策の本体:
      ・model>0 … 題名に検索語が1つも入っていない写真を採らない。Flickr の検索は題名・説明・タグの
        どれかに当たれば返すので、**題名と無関係な写真が大量に混ざる**。順位付けでは最下位になるが、
        上位が解像度やボケで全部脱落すると detail ループがそこまで降りてしまう。実測で『Air Jordan 1』
        検索から "ゴミの野焼きと歩く少年" が保存されたのがこれ（一致0・靴は一切写っていない）
      ・product は SHOE_HINT 必須 … Commons 版(pick_commons_photo.eligible)と同じ条件に揃える。
        従来このファイルは rank_key の加点にしか使っておらず、靴と無関係な写真を弾けていなかった
    """
    if not c.get('model'):
        return False
    if BAD_TITLE.search(c['title']):
        return False
    if str(c['lic_id']) not in OK_LICENSE_IDS.split(','):
        return False
    if product and (NOT_SHOE.search(c['title']) or not SHOE_HINT.search(c['title'])):
        return False
    return True


def title_focus(title, terms):
    """題名のうち検索語が占める割合（0〜1）。「余計な語が少ない＝被写体が検索語そのもの」の目安。

    語一致(model_score)だけだと「選手名を含むが本人ではない写真」が解像度で勝ってしまう。
    実例: `"Stephen Curry"` で『NBA GRADUATION TOWEL CAKE (Stephen Curry)』(1826x3072)が
    『Stephen Curry warmup!』に競り勝った。前者は6語中2語=0.33、後者は3語中2語=0.67 で差が付く。
    """
    words = re.findall(r'[a-z0-9]+', (title or '').lower())
    if not words:
        return 0.0
    hit = set()
    for term in terms:
        tw = re.findall(r'[a-z0-9]+', (term or '').lower())
        if tw and all(w in words for w in tw):
            hit |= set(tw)
    return len(hit) / len(words)


def rank_key(c, product=False):
    """題名の語一致を最優先。次に題名の絞り込み度、（靴モードなら靴らしい題名か→）解像度、写真ID"""
    base = (c['model'], round(c['focus'], 1))
    if product:
        base += (bool(SHOE_HINT.search(c['title'])),)
    return base + (c['lite_w'] * c['lite_h'], int(c['id']) if c['id'].isdigit() else 0)


def license_from_page(html):
    """写真ページのライセンス欄から (表示名, URL) を読む。CC BY/BY-SA/CC0/PDM 以外は None（=不採用）"""
    head = html
    i, j = html.find('<dt>License</dt>'), html.find('<dt>Sizes</dt>')
    if 0 <= i < j:
        head = html[i:j]          # ページ下部の無関係な CC リンクを拾わないように License 欄だけ見る
    for pat, name in CC_OK:
        m = pat.search(head)
        if m:
            return name.format(m.group(1)), m.group(0)
    return None, None


def sizes_from_page(html):
    """サイズ一覧を [(キー, 幅, 高さ)] で返す。Original は キー 'o' として先頭に入れる"""
    out = []
    m = re.search(r'Original\s*<small>\((\d+)\s*&times;\s*(\d+)\)</small>', html)
    if m:
        out.append(('o', int(m.group(1)), int(m.group(2))))
    for key, w, h in re.findall(r'/sizes/(\w+)/">[^<]*</a>\s*<small>\((\d+)\s*&times;\s*(\d+)\)</small>', html):
        out.append((key, int(w), int(h)))
    return out


def page_image_url(html):
    """/sizes/<キー>/ ページに表示されている画像の実URL"""
    m = re.search(r'id="allsizes-photo">\s*<img src="([^"]+)"', html)
    return m.group(1) if m else None


def detail(c, min_w, min_h, product):
    """写真1枚ぶんの実ライセンスと実寸を /sizes/o/ から読む。使えないなら理由の文字列を返す。

    戻り値: (採用する画像URL, 幅, 高さ, ライセンス名) か、不採用なら (None, 理由, None, None)
    """
    base = f"https://www.flickr.com/photos/{c['path']}/{c['id']}/sizes/"
    try:
        html = fetch_html(base + 'o/')
    except Exception as e:
        return None, f'ページ取得失敗({e})', None, None
    name, url = license_from_page(html)
    if not name:
        return None, 'ライセンスがCC BY/BY-SA/CC0/PDM以外（NC・NDを含む）', None, None
    c['lic_url'] = url
    sizes = sizes_from_page(html)
    if not sizes:
        return None, 'サイズ一覧を読めない', None, None
    ok = [s for s in sizes if (min(s[1], s[2]) >= PROD_MIN_SIDE if product
                               else s[1] >= min_w and s[2] >= min_h)]
    if not ok:
        big = max(sizes, key=lambda s: s[1] * s[2])
        return None, f'解像度不足(最大{big[1]}x{big[2]})', None, None
    # 条件を満たす中で「一番小さいもの」を採る。原寸ではなく 1600px 相当を落とすのがポイントで、
    # ボケ判定の閾値(BLUR_MIN)は Commons の 1600px サムネイルで較正されているため、原寸(2000〜4000px)
    # で測ると同じ写真でも分散が下がって判定がずれる（2026-09-13 実測: 同一写真で原寸30 / 1600px32 /
    # 1024px55）。通信量も原寸2.5MB→1600px0.4MBに減る
    key, w, h = min(ok, key=lambda s: s[1] * s[2])
    if key == 'o':
        src = page_image_url(html)          # 今開いているのが原寸ページなので追加の取得は要らない
    else:
        try:
            src = page_image_url(fetch_html(base + key + '/'))
        except Exception as e:
            return None, f'サイズページ取得失敗({e})', None, None
    if not src:
        return None, '画像URLを読めない', None, None
    return src, w, h, name


def load_rgb(data):
    """判定用に画像を1回だけ開く。開けなければ None（＝画像側の判定は全部スキップ＝落とさない）"""
    try:
        from PIL import Image, ImageOps
        import io
        return ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
    except Exception:
        return None


def has_face(im):
    """選手モードの安全弁。顔が1つも取れない画像は「人物写真ではない」とみなす。

    Flickr は Commons と違って個人の日常写真が主で、題名に選手名が入っているだけのグッズ・小物・
    会場風景が大量に混ざる。BAD_TITLE の語だけでは取りこぼすので、実データ側からも見る
    （OpenCV / YuNet が無い環境では判定できないので True を返して素通しする＝ここで落とさない）。
    """
    if im is None:
        return True
    try:
        import cv2  # noqa: F401  検出器が使えない環境かどうかの判定だけに使う
    except ImportError:
        return True
    return detect_face(im) is not None


def analyze(im):
    """(外周の明度の標準偏差, 色相の集中度) を返す。台紙スキャンの判定材料。

    外周の標準偏差: 画像を長辺400pxに縮めて外周3pxの明度を見る。写真を白い台紙やマットに貼って
      スキャンしたものは周りが一様なので極端に小さくなる。
    色相の集中度: 彩度40以上の画素の色相を単位円上のベクトルとして平均した長さ(0〜1)。
      セピア・モノクロは色相が1点に集まるので1に近づく。

    2026-09-13 の実測値（すべて Flickr の実データ）:
      『4 - Mrs Stephen Curry』(誤マッチ・台紙付きセピア) … 外周 4.8 / 5.0、色相 0.989
      Kyrie Irving Passing                             … 外周 51.7、色相 0.980(青い壁の体育館)
      Kyrie Irving Dribbling                           … 色相 0.923(同上)
      Jayson Tatum ×4                                  … 外周 76.2〜82.9、色相 0.337
      Kevin Durant ×4                                  … 外周 26.1〜85.4
      LeBron James Homecoming                          … 外周 8.1、色相 0.487(暗い観客席)
    つまり**片方だけでは分離できない**（外周は 5.0 と 8.1 が近すぎ、色相は 0.989 と 0.980 が
    ほぼ同じ）。両方を同時に満たす時だけ落とす、という組み合わせで初めて誤マッチだけが分離できる。
    片方だけをしきい値にすると、青い壁の体育館で撮った Kyrie(色相0.980)まで巻き添えで落ちる。
    """
    import math
    small = im.copy()
    small.thumbnail((400, 400))
    w, h = small.size
    px = small.load()
    edge = [px[x, y] for x in range(w) for y in (0, 1, 2, h - 3, h - 2, h - 1)]
    edge += [px[x, y] for y in range(h) for x in (0, 1, 2, w - 3, w - 2, w - 1)]
    lum = [sum(p) / 3 for p in edge]
    mean = sum(lum) / len(lum)
    std = (sum((v - mean) ** 2 for v in lum) / len(lum)) ** 0.5
    hs = [p[0] for p in small.convert('HSV').getdata() if p[1] >= 40]
    if len(hs) < 500:                     # 彩度のある画素がほぼ無い＝完全なモノクロとみなす
        return std, 1.0
    xs = sum(math.cos(v / 255 * 2 * math.pi) for v in hs) / len(hs)
    ys = sum(math.sin(v / 255 * 2 * math.pi) for v in hs) / len(hs)
    return std, math.hypot(xs, ys)


def scan_ng(im):
    """台紙に貼った古写真のスキャンなら理由の文字列、問題なければ None。

    選手モードだけで使う。靴モードは白背景の商品写真（＝外周が一様）が正解なので当てはめない。
    """
    if im is None:
        return None
    std, hue = analyze(im)
    if std < SCAN_EDGE_MAX and hue > SCAN_HUE_MIN:
        return f'台紙に貼った古写真のスキャン疑い(外周{std:.1f}・色相集中{hue:.2f})'
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('terms', nargs='*', help='検索語（複数可。英語表記・別名・チーム名+選手名 など）')
    ap.add_argument('--out', help='保存先 site/assets/journal-NNN-hero.jpg')
    ap.add_argument('--list', action='store_true', help='候補一覧だけ表示（保存しない）')
    ap.add_argument('--pick', type=int, default=1, help='一覧のN番目を採用（既定1）')
    ap.add_argument('--limit', type=int, default=50, help='検索語1つあたりの取得件数')
    ap.add_argument('--detail-max', type=int, default=12,
                    help='実寸とライセンスを見に行く上位件数（1件につきページ1回ぶんの通信）')
    ap.add_argument('--min-width', type=int, default=MIN_W)
    ap.add_argument('--min-height', type=int, default=MIN_H)
    ap.add_argument('--crop-y', type=float, default=None,
                    help='縦のクロップ位置を手で指定（0=一番上, 0.5=中央, 1=一番下）。顔検出より優先')
    ap.add_argument('--face-top', type=float, default=FACE_TOP,
                    help=f'顔の中心を仕上がりの上から何割の位置に置くか（既定{FACE_TOP}）')
    ap.add_argument('--no-face', action='store_true', help='顔検出を使わず縦横比フォールバックだけで切る')
    ap.add_argument('--allow-faceless', action='store_true',
                    help='選手モードで「顔が写っていない写真」も許す（既定は落とす）')
    ap.add_argument('--allow-scan', action='store_true',
                    help='選手モードで「台紙に貼った古写真のスキャン」も許す（既定は落とす）')
    ap.add_argument('--product', action='store_true',
                    help='商品(靴)モード: モデル名一致を最優先・顔検出オフ・切らずにレターボックス合成')
    args = ap.parse_args()
    if not args.terms:
        print('検索語が必要', file=sys.stderr); sys.exit(1)
    crop_opts = dict(crop_y=args.crop_y, face_top=args.face_top, use_face=not args.no_face)

    try:
        found, seen = [], set()
        for t in args.terms:
            for c in search(t, args.limit):
                if c['id'] not in seen:
                    seen.add(c['id']); found.append(c)
    except Exception as e:
        print(f'network error: {e}', file=sys.stderr); sys.exit(3)

    for c in found:
        c['model'] = model_score(c['title'], args.terms)
        c['focus'] = title_focus(c['title'], args.terms)
    cands = sorted([c for c in found if eligible(c, args.product)],
                   key=lambda c: rank_key(c, args.product), reverse=True)
    cond = f'短辺>={PROD_MIN_SIDE}' if args.product else f'幅>={args.min_width}・高さ>={args.min_height}'
    print(f'検索 {len(found)} 件 → 一次通過(CC BY/BY-SA/CC0/PDM) {len(cands)} 件 / 実寸({cond})は上位から順に確認')
    for i, c in enumerate(cands[:15], 1):
        print(f"{i:2}. 一致{c['model']} 絞込{c['focus']:.2f} lic{c['lic_id']} 検索表示{c['lite_w']}x{c['lite_h']} "
              f"{(c['author'] or '不明')[:18]:18} {c['title'][:60]}")
    if not cands:
        print('候補なし → journal_auto/fallback-images.md のフォールバック写真を使う'); sys.exit(2)

    # 指定番号から順に「実寸とライセンスを確認 → ボケ判定 → 保存」。通ったところで止める
    order = (cands[args.pick - 1:] + cands[:args.pick - 1])[:args.detail_max]
    for c in order:
        src, w, h, lic = detail(c, args.min_width, args.min_height, args.product)
        if src is None:
            print(f"  除外({w}) → 次の候補: {c['title'][:55]}"); continue
        if args.list and not args.out:
            print(f"採用候補: {c['title']}\nPAGE: {c['page']}\nIMAGE: {src} ({w}x{h})")
            print(f"CREDIT: 撮影: {c['author'] or '不明'} / {lic}, via Flickr")
            return
        try:
            data = fetch_bytes(src)
        except Exception as e:
            print(f"  取得失敗 {c['title'][:50]}: {e}"); continue
        b = blur_score(data)
        ng = blur_ng(b, product=args.product)
        if ng:
            print(f"  ボケ判定NG({ng}) → 次の候補: {c['title'][:55]}"); continue
        if not args.product:
            im = load_rgb(data)
            if not args.allow_faceless and not has_face(im):
                print(f"  顔が検出できない（人物写真でない疑い） → 次の候補: {c['title'][:55]}"); continue
            sc = None if args.allow_scan else scan_ng(im)
            if sc:
                print(f"  {sc} → 次の候補: {c['title'][:55]}"); continue
        if args.out:
            os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
            if args.product:
                bg = save_hero_product(data, args.out)
                if bg is None:
                    print(f"  解像度不足(拡大はしない) → 次の候補: {c['title'][:55]}"); continue
                print(f'合成: 切らずに収める（レターボックス・背景 rgb{bg}）')
            else:
                save_hero(data, args.out, **crop_opts)
            bs = f'{b[0]:.0f}/縮小{b[1]:.0f}' if b is not None else 'skip'
            print(f'保存: {args.out} ({OUT_W}x{OUT_H}) 元={w}x{h} ボケ判定={bs}')
        print(f"FILE: {c['title']}\nPAGE: {c['page']}\nLICENSE: {lic} ({c.get('lic_url')})")
        print(f"CREDIT: 撮影: {c['author'] or '不明'} / {lic}, via Flickr")
        print('⚠️ 公開前に目視確認すること（Flickr は題名が当てにならず、別人・別物が混ざりうる）')
        return
    print('全候補が条件を満たさない → フォールバック写真を使う'); sys.exit(2)


if __name__ == '__main__':
    main()
