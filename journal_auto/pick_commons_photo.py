#!/usr/bin/env python3
"""Wikimedia Commons から「高画質・新しい・ライセンス可」の写真を1枚選んで hero に保存する。

2026-09-05 クリス指示「記事に使ってる写真が粗い事が多い。一定のライン以上の画質のやつで、
画像自体も新しいものを採用してほしい！」で設置。旧手順(検索→ライセンス確認→顔が分かる1枚)は
元画像の解像度も撮影日も見ていなかったので、小さい写真を1600pxに引き伸ばして粗くなっていた。

使い方（ルーチン・ローカル共通）:
  python3 journal_auto/pick_commons_photo.py "Luka Doncic" "Luka Dončić" --out site/assets/journal-085-hero.jpg
  python3 journal_auto/pick_commons_photo.py "Air Jordan 4" --list           # 候補一覧だけ見る（保存しない）
  python3 journal_auto/pick_commons_photo.py "Rui Hachimura" --pick 2 --out ... # 一覧の2番目を採用
  python3 journal_auto/pick_commons_photo.py --from-url <画像URL> --out ... --crop-y 0.05  # 切り直しだけ

判定（上から順に厳しい条件で探し、見つかった段階で止まる）:
  画質: 元画像が幅 >=1600 かつ 高さ >=900（拡大しない）。幅 >=2000 を優先。
        保存前に 1600px 版のボケ判定（ラプラシアン分散 < BLUR_MIN は不採用・次の候補へ）
        さらに 400px に縮小してから同じ判定（< BLUR_MIN_SMALL は不採用）。ノイズだらけの拡大写真は
        等倍だとノイズを「ディテール」と誤認して通ってしまうが、縮小するとノイズが均されて正体が出る
        （2026-09-05 記事081/039 の事故: 等倍201/110で通過→目視で完全にボケ。縮小後は206/136）
  新しさ: 撮影日(DateTimeOriginal・無ければアップロード日)が 直近3年 → 5年 → 制限なし の順で緩める
  ライセンス: CC BY / CC BY-SA / CC0 / Public domain だけ（extmetadata の LicenseShortName で判定）
  除外: svg/gif/pdf、ロゴ・地図・スクリーンショット・トレーディングカード・記念切手らしいタイトル

出力: 候補を順位付きで表示し、--out があれば 1600x900（16:9・jpeg品質85）で保存。
      最後の行に `CREDIT: 撮影: <撮影者> / <ライセンス>, via Wikimedia Commons` を出す（キャプションにそのまま使う）。
      候補ゼロなら exit 2（→ フォールバック写真へ）。ネットワーク失敗は exit 3。

クロップ位置（2026-09-06 クリス指摘「画像がある時に、顔が切れてるのはNG」で設置）:
  旧実装は centering=(0.5, 0.4) の固定で、縦長の全身写真を 16:9 に切ると顔が枠の外に出ていた
  （記事067 ターコ・フォール=身長231cm で胴体だけの写真になった）。今は次の順で縦位置を決める:
    ①--crop-y を指定していればそれ（0=一番上, 1=一番下）
    ②顔検出（OpenCV YuNet・models/face_detection_yunet_2023mar.onnx）が成功したら、
      一番大きい顔の中心が仕上がりの上から FACE_TOP(既定0.32) に来る位置。横位置も顔に合わせる
    ③顔が取れない/OpenCVが無い時は縦横比フォールバック。縦長の写真ほど上寄せ（正方形以上に縦長=0.12 →
      16:9 と同じ横長=0.40 の間を線形）。全身写真の顔切れはこれだけでもほぼ防げる
  保存時に `クロップ:` 行で採用した方法と centering 値を出すので、ログを見れば手動で直せる。

商品(靴)モード `--product`（2026-09-12 クリス指示「KICKSの記事の時はその靴の写真にして欲しいかな！」）:
  KICKS記事で「そのモデルのCC写真」を探す時に付ける。人物写真とは要求が逆なので3点変える。
    ①モデル名の一致度を最優先でランクする。既定は「新しい順→解像度」なので、`"Air Jordan 4"` で
      検索しても AJ1/AJ2/AJ3/AJ9 の新しい写真が上位に来て、肝心の AJ4 の写真が埋もれていた
      （実例: 記事131 は `File:Nike Air Jordan IV.jpg` 2952x2592 CC0 が候補にあったのに汎用
      フォールバックへ落ちた）。検索語のどれかが題名に語として入っているものだけを上位に置く
    ②顔検出を切る（靴に顔はない。検出失敗の縦横比フォールバックで上下が切れるのも避ける）
    ③16:9に切らず、レターボックス合成で収める（`pick_product_photo.py` の save_hero と同じ処理。
      商品写真は正方形〜縦長が多く、切ると靴の上下が落ちる）
  判定も商品写真向けに緩める: 短辺1000px以上（正方形でも通す）・ボケ判定は白背景で分散が下がるため
  PROD_BLUR_* を使う。新しさの絞り込みは行わない（名作の復刻は古い写真しか無いことが多い）。

依存: 標準ライブラリのみで検索・ランク付けできる。保存とボケ判定は Pillow(+numpy)、顔検出は
      opencv-python-headless があれば行う。無い場合もエラーにはせず、上の②→③に自動で落ちる。
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request
from datetime import datetime, timezone

API = 'https://commons.wikimedia.org/w/api.php'
UA = '610-journal-bot/1.0 (https://sixten.jp/journal/; photo picker)'
OK_LICENSE = re.compile(r'^(cc[- ]?by(-sa)?(-[0-9.]+)?|cc0|public domain|pd[- ]?\w*|no restrictions)', re.I)
BAD_TITLE = re.compile(r'logo|emblem|map|screenshot|trading card|stamp|coat of arms|\.svg$|\.gif$|\.pdf$|\.tif', re.I)
MIN_W, MIN_H, PREF_W = 1600, 900, 2000
BLUR_MIN = 100.0   # ラプラシアン分散(等倍)。既存記事の実測: 5〜12=完全にボケ, 30〜90=粗い, 200以上=十分, 1000以上=鮮明
BLUR_MIN_SMALL = 300.0  # 400px縮小後の分散。実測: ボケ拡大写真=136〜206, 許容下限の実写=349〜439, 普通の写真=800〜10000
SMALL_W = 400
OUT_W, OUT_H, JPEG_Q = 1600, 900, 85
YUNET = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'face_detection_yunet_2023mar.onnx')
FACE_TOP = 0.32      # 顔の中心を仕上がりの上から何割の位置に置くか（人物写真の定番＝上から1/3）
FACE_SCORE = 0.6     # YuNet の採用スコア。これ未満は顔と見なさない
FACE_LONG = 1024     # 顔検出に渡す画像の長辺px（小さすぎると小さい顔を拾えない）
CY_PORTRAIT = 0.12   # 顔が取れない時の上寄せ下限（縦長写真）
CY_DEFAULT = 0.40    # 顔が取れない時の既定（横長写真・旧実装と同じ）
PROD_MIN_SIDE = 1000     # --product の画質下限（短辺）。切らずに収めるので16:9の縛りは要らない
PROD_BLUR_MIN = 40.0     # --product のボケ判定。商品写真は白背景の面積が広く分散が下がるため緩める
PROD_BLUR_MIN_SMALL = 120.0
NOT_SHOE = re.compile(r'\b(store|shop|museum|billboard|poster|advertis|box|packaging|'
                      r'jersey|shirt|sock)\b', re.I)  # --product で除外（靴そのものが写っていない）
# --product のランク補助。モデル名だけだと同名の別物が混ざる（実例: "Superstar II" で
# ギリシャ・ティノス島のフェリー "Superstar II" が候補に入った）ので、靴だと分かる語を優先する
SHOE_HINT = re.compile(r'\b(shoe|sneaker|trainer|footwear|basketball|kicks|nike|jordan|adidas|'
                       r'puma|reebok|converse|new balance|under armour|anta|li[- ]ning|asics)\b', re.I)


def api(params):
    params = dict(params, format='json', formatversion=2)
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def parse_date(s):
    m = re.search(r'(\d{4})-(\d{2})-(\d{2})', s or '')
    if m:
        try:
            return datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)), tzinfo=timezone.utc)
        except ValueError:
            pass
    m = re.search(r'(\d{4})', s or '')
    return datetime(int(m.group(1)), 1, 1, tzinfo=timezone.utc) if m else None


def search(term, limit):
    d = api({'action': 'query', 'generator': 'search', 'gsrsearch': term, 'gsrnamespace': 6, 'gsrlimit': limit,
             'prop': 'imageinfo', 'iiprop': 'url|size|timestamp|extmetadata|mime',
             'iiextmetadatafilter': 'DateTimeOriginal|LicenseShortName|Artist|Credit|ImageDescription',
             'iiurlwidth': OUT_W})
    out = []
    for p in d.get('query', {}).get('pages', []) or []:
        ii = (p.get('imageinfo') or [{}])[0]
        if not ii or not ii.get('mime', '').startswith('image/'):
            continue
        em = ii.get('extmetadata') or {}
        val = lambda k: re.sub(r'<[^>]+>', '', (em.get(k) or {}).get('value', '')).strip()
        taken = parse_date(val('DateTimeOriginal')) or parse_date(ii.get('timestamp'))
        out.append({
            'title': p['title'], 'width': ii.get('width', 0), 'height': ii.get('height', 0),
            'taken': taken.strftime('%Y-%m-%d') if taken else '', 'taken_dt': taken,
            'license': val('LicenseShortName'), 'artist': val('Artist')[:80],
            'url': ii.get('url'), 'thumb': ii.get('thumburl') or ii.get('url'),
            'page': ii.get('descriptionurl'), 'mime': ii.get('mime'),
        })
    return out


def eligible(c, since, product=False):
    if BAD_TITLE.search(c['title']):
        return False
    if not OK_LICENSE.search(c['license'] or ''):
        return False
    if c['mime'] not in ('image/jpeg', 'image/png', 'image/webp'):
        return False
    if product:
        # 切らずに収めるので短辺だけ見る。モデル名が題名に無いものは別モデルなので落とす
        if min(c['width'], c['height']) < PROD_MIN_SIDE:
            return False
        if NOT_SHOE.search(c['title']):
            return False
        # モデル名だけの一致は同名の別物を拾う（実例: "AE 1" で Canon AE-1 のカメラ写真、
        # "Superstar II" でフェリー）。靴だと分かる語(ブランド名 or shoe/sneaker)を必須にする。
        # 落としすぎても次の階層(選手写真→フォールバック)に進むだけなので、厳しい側に倒す
        if not SHOE_HINT.search(c['title']):
            return False
        return c['model'] > 0
    if c['width'] < MIN_W or c['height'] < MIN_H:
        return False
    if since and (not c['taken_dt'] or c['taken_dt'] < since):
        return False
    return True


def model_score(title, terms):
    """題名に検索語が「語として」いくつ含まれるか。--product のランクの第一キー。

    `"Air Jordan 4" "Air Jordan IV"` で検索した時に `Nike Air Jordan I.jpg`(=別モデル)を
    上位に出さないための判定。部分一致ではなく単語境界で見るので 4 が 14 に化けない。
    """
    t = re.sub(r'[^a-z0-9 ]+', ' ', (title or '').lower())
    n = 0
    for term in terms:
        q = re.sub(r'[^a-z0-9 ]+', ' ', (term or '').lower()).strip()
        if q and re.search(r'(?<![a-z0-9])' + re.escape(q) + r'(?![a-z0-9])', t):
            n += 1
    return n


def rank_key(c):
    # 新しい順を最優先、次に幅2000以上、次に画素数
    return (c['taken_dt'] or datetime(1900, 1, 1, tzinfo=timezone.utc), c['width'] >= PREF_W, c['width'] * c['height'])


def rank_key_product(c):
    # 商品(靴)はモデル名の一致度が最優先。次に「靴だと分かる題名か」、次に解像度、最後に新しさ
    return (c['model'], bool(SHOE_HINT.search(c['title'])), c['width'] * c['height'],
            c['taken_dt'] or datetime(1900, 1, 1, tzinfo=timezone.utc))


def blur_score(data):
    try:
        from PIL import Image
        import numpy as np, io
    except Exception:
        return None
    im = Image.open(io.BytesIO(data)).convert('L')

    def lapvar(img):
        a = np.asarray(img, dtype=float)
        lap = a[1:-1, 1:-1] * 4 - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:]
        return float(lap.var())

    small = im.resize((SMALL_W, max(1, round(im.height * SMALL_W / im.width))), Image.LANCZOS)
    return lapvar(im), lapvar(small)


def blur_ng(b, product=False):
    """(等倍, 縮小) の分散タプルを受け取り、不採用なら理由文字列、採用なら None"""
    if b is None:
        return None
    lo, lo_small = (PROD_BLUR_MIN, PROD_BLUR_MIN_SMALL) if product else (BLUR_MIN, BLUR_MIN_SMALL)
    full, small = b
    if full < lo:
        return f'分散{full:.0f}<{lo:.0f}'
    if small < lo_small:
        return f'縮小後分散{small:.0f}<{lo_small:.0f}(ノイズ拡大写真)'
    return None


def detect_face(im):
    """PIL Image から一番大きい顔を探し、中心を (x割合, y割合) で返す。取れなければ None。

    OpenCV(opencv-python-headless) と同梱の YuNet モデルが揃っている時だけ動く。
    どちらか欠けても例外にせず None を返し、呼び出し側が縦横比フォールバックへ落ちる。
    """
    try:
        import cv2, numpy as np
        from PIL import Image
    except ImportError:
        return None
    if not os.path.exists(YUNET):
        return None
    try:
        w, h = im.size
        s = FACE_LONG / max(w, h)
        if s < 1.0:
            im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
        arr = np.asarray(im.convert('RGB'))[:, :, ::-1]  # PILはRGB / OpenCVはBGR
        arr = np.ascontiguousarray(arr)
        det = cv2.FaceDetectorYN.create(YUNET, '', (arr.shape[1], arr.shape[0]), score_threshold=FACE_SCORE)
        _, faces = det.detect(arr)
        if faces is None or len(faces) == 0:
            return None
        x, y, fw, fh = max(faces, key=lambda f: f[2] * f[3])[:4]
        return ((x + fw / 2) / arr.shape[1], (y + fh / 2) / arr.shape[0])
    except Exception:
        return None


def crop_centering(src_w, src_h, face, crop_y=None, face_top=FACE_TOP):
    """ImageOps.fit に渡す centering (cx, cy) と、採用した方法の説明を返す"""
    clamp = lambda v: min(1.0, max(0.0, v))
    target = OUT_W / OUT_H
    if crop_y is not None:
        return (0.5, clamp(crop_y)), f'手動指定 --crop-y {crop_y}'
    if face:
        fx, fy = face
        # 16:9 に切った時に実際に残る範囲（元画像px）。顔の中心がその中で face_top に来る位置を逆算する
        ch = min(src_h, src_w / target)
        cw = min(src_w, src_h * target)
        cy = 0.5 if src_h - ch < 1 else clamp((fy * src_h - face_top * ch) / (src_h - ch))
        cx = 0.5 if src_w - cw < 1 else clamp((fx * src_w - 0.5 * cw) / (src_w - cw))
        return (cx, cy), f'顔検出（顔の中心 上から{fy * 100:.0f}%）'
    # 顔が取れない時: 縦長の写真ほど上を残す（全身写真の頭が切れるのを防ぐ）
    a = src_w / src_h
    if a >= target:
        return (0.5, CY_DEFAULT), '縦横比フォールバック（横長・縦は切らない）'
    cy = CY_PORTRAIT + (CY_DEFAULT - CY_PORTRAIT) * clamp((a - 1.0) / (target - 1.0))
    return (0.5, clamp(cy)), f'縦横比フォールバック（縦横比{a:.2f}）'


def save_hero_product(data, out):
    """--product 用。靴を切らずに 1600x900 へ収める（余白は元画像の背景色）。

    実体は pick_product_photo.save_hero（Nike公式ルートと同じ見え方にするため共有する）。
    同じフォルダにあるので import できる。戻り値は背景色 / 解像度不足なら None。
    """
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from pick_product_photo import save_hero as _letterbox
    return _letterbox(data, out)


def save_hero(data, out, crop_y=None, face_top=FACE_TOP, use_face=True):
    try:
        from PIL import Image, ImageOps
        import io
        im = Image.open(io.BytesIO(data))
        im = ImageOps.exif_transpose(im).convert('RGB')
        face = detect_face(im) if (use_face and crop_y is None) else None
        centering, how = crop_centering(im.width, im.height, face, crop_y, face_top)
        im = ImageOps.fit(im, (OUT_W, OUT_H), method=Image.LANCZOS, centering=centering)
        im.save(out, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True)
        print(f'クロップ: {how} → centering=({centering[0]:.2f}, {centering[1]:.2f})')
    except ImportError:
        with open(out, 'wb') as f:
            f.write(data)


def main():
    global MIN_W
    ap = argparse.ArgumentParser()
    ap.add_argument('terms', nargs='*', help='検索語（複数可。英語表記・別名・チーム名+選手名 など）')
    ap.add_argument('--out', help='保存先 site/assets/journal-NNN-hero.jpg')
    ap.add_argument('--list', action='store_true', help='候補一覧だけ表示')
    ap.add_argument('--pick', type=int, default=1, help='一覧のN番目を採用（既定1）')
    ap.add_argument('--limit', type=int, default=40)
    ap.add_argument('--min-width', type=int, default=MIN_W)
    ap.add_argument('--crop-y', type=float, default=None,
                    help='縦のクロップ位置を手で指定（0=一番上を残す, 0.5=中央, 1=一番下）。指定すると顔検出より優先')
    ap.add_argument('--face-top', type=float, default=FACE_TOP,
                    help=f'顔の中心を仕上がりの上から何割の位置に置くか（既定{FACE_TOP}）')
    ap.add_argument('--no-face', action='store_true', help='顔検出を使わず縦横比フォールバックだけで切る')
    ap.add_argument('--product', action='store_true',
                    help='商品(靴)モード: モデル名一致を最優先・顔検出オフ・切らずにレターボックス合成')
    ap.add_argument('--from-url', help='検索せず、このURLの画像を切り直して --out に保存する')
    ap.add_argument('--from-file', help='検索せず、このローカル画像を切り直して --out に保存する')
    args = ap.parse_args()
    MIN_W = args.min_width
    crop_opts = dict(crop_y=args.crop_y, face_top=args.face_top, use_face=not args.no_face)

    # 切り直しモード: 検索を通さず、渡された画像をそのまま 16:9 にして保存する
    if args.from_url or args.from_file:
        if not args.out:
            print('--from-url / --from-file には --out が必要', file=sys.stderr); sys.exit(1)
        try:
            data = fetch(args.from_url) if args.from_url else open(args.from_file, 'rb').read()
        except Exception as e:
            print(f'取得失敗: {e}', file=sys.stderr); sys.exit(3)
        os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
        save_hero(data, args.out, **crop_opts)
        print(f'保存: {args.out} ({OUT_W}x{OUT_H})')
        return
    if not args.terms:
        print('検索語か --from-url / --from-file が必要', file=sys.stderr); sys.exit(1)

    try:
        found, seen = [], set()
        for t in args.terms:
            for c in search(t, args.limit):
                if c['title'] not in seen:
                    seen.add(c['title']); found.append(c)
    except Exception as e:
        print(f'network error: {e}', file=sys.stderr); sys.exit(3)

    for c in found:
        c['model'] = model_score(c['title'], args.terms)

    if args.product:
        cands = sorted([c for c in found if eligible(c, None, product=True)], key=rank_key_product, reverse=True)
        print(f'検索 {len(found)} 件 → 商品モード(短辺>={PROD_MIN_SIDE}・CCライセンス・モデル名一致) {len(cands)} 件')
        for i, c in enumerate(cands[:15], 1):
            print(f"{i:2}. 一致{c['model']} {c['taken'] or '----------'} {c['width']}x{c['height']} "
                  f"{c['license'][:12]:12} {c['title'][:70]}")
    else:
        now = datetime.now(timezone.utc)
        tiers = [('直近3年', now.replace(year=now.year - 3)), ('直近5年', now.replace(year=now.year - 5)), ('年代不問', None)]
        cands, tier_name = [], ''
        for name, since in tiers:
            cands = sorted([c for c in found if eligible(c, since)], key=rank_key, reverse=True)
            if cands:
                tier_name = name; break
        print(f'検索 {len(found)} 件 → 条件(幅>={MIN_W}・高さ>={MIN_H}・CCライセンス・{tier_name or "該当なし"}) {len(cands)} 件')
        for i, c in enumerate(cands[:15], 1):
            print(f"{i:2}. {c['taken'] or '----------'} {c['width']}x{c['height']} {c['license'][:12]:12} {c['title'][:70]}")
    if not cands:
        print('候補なし → journal_auto/fallback-images.md のフォールバック写真を使う'); sys.exit(2)
    if args.list and not args.out:
        return

    # 指定番号から順にボケ判定しながら採用
    order = cands[args.pick - 1:] + cands[:args.pick - 1]
    for c in order:
        try:
            data = fetch(c['thumb'])
        except Exception as e:
            print(f"  取得失敗 {c['title'][:50]}: {e}"); continue
        b = blur_score(data)
        ng = blur_ng(b, product=args.product)
        if ng:
            print(f"  ボケ判定NG({ng}) → 次の候補: {c['title'][:60]}"); continue
        if args.out:
            os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
            if args.product:
                bg = save_hero_product(data, args.out)
                if bg is None:
                    print(f"  解像度不足(拡大はしない) → 次の候補: {c['title'][:60]}"); continue
                print(f'合成: 切らずに収める（レターボックス・背景 rgb{bg}）')
            else:
                save_hero(data, args.out, **crop_opts)
            bs = f'{b[0]:.0f}/縮小{b[1]:.0f}' if b is not None else 'skip'
            print(f"保存: {args.out} ({OUT_W}x{OUT_H}) 元={c['width']}x{c['height']} 撮影={c['taken']} ボケ判定={bs}")
        print(f"FILE: {c['title']}\nPAGE: {c['page']}\nTAKEN: {c['taken']}")
        print(f"CREDIT: 撮影: {c['artist'] or '不明'} / {c['license']}, via Wikimedia Commons")
        return
    print('全候補がボケ判定NG → フォールバック写真を使う'); sys.exit(2)


if __name__ == '__main__':
    main()
