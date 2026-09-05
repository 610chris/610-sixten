#!/usr/bin/env python3
"""Wikimedia Commons から「高画質・新しい・ライセンス可」の写真を1枚選んで hero に保存する。

2026-09-05 クリス指示「記事に使ってる写真が粗い事が多い。一定のライン以上の画質のやつで、
画像自体も新しいものを採用してほしい！」で設置。旧手順(検索→ライセンス確認→顔が分かる1枚)は
元画像の解像度も撮影日も見ていなかったので、小さい写真を1600pxに引き伸ばして粗くなっていた。

使い方（ルーチン・ローカル共通）:
  python3 journal_auto/pick_commons_photo.py "Luka Doncic" "Luka Dončić" --out site/assets/journal-085-hero.jpg
  python3 journal_auto/pick_commons_photo.py "Air Jordan 4" --list           # 候補一覧だけ見る（保存しない）
  python3 journal_auto/pick_commons_photo.py "Rui Hachimura" --pick 2 --out ... # 一覧の2番目を採用

判定（上から順に厳しい条件で探し、見つかった段階で止まる）:
  画質: 元画像が幅 >=1600 かつ 高さ >=900（拡大しない）。幅 >=2000 を優先。
        保存前に 1600px 版のボケ判定（ラプラシアン分散 < BLUR_MIN は不採用・次の候補へ）
  新しさ: 撮影日(DateTimeOriginal・無ければアップロード日)が 直近3年 → 5年 → 制限なし の順で緩める
  ライセンス: CC BY / CC BY-SA / CC0 / Public domain だけ（extmetadata の LicenseShortName で判定）
  除外: svg/gif/pdf、ロゴ・地図・スクリーンショット・トレーディングカード・記念切手らしいタイトル

出力: 候補を順位付きで表示し、--out があれば 1600x900（16:9 中央クロップ・jpeg品質85）で保存。
      最後の行に `CREDIT: 撮影: <撮影者> / <ライセンス>, via Wikimedia Commons` を出す（キャプションにそのまま使う）。
      候補ゼロなら exit 2（→ フォールバック写真へ）。ネットワーク失敗は exit 3。

依存: 標準ライブラリのみで検索・ランク付けできる。保存とボケ判定は Pillow(+numpy) があれば行い、無ければ
      Commons が生成した 1600px 版をそのまま保存する（拡大は起きないので画質は保たれる）。
"""
import argparse, json, os, re, sys, urllib.parse, urllib.request
from datetime import datetime, timezone

API = 'https://commons.wikimedia.org/w/api.php'
UA = '610-journal-bot/1.0 (https://sixten.jp/journal/; photo picker)'
OK_LICENSE = re.compile(r'^(cc[- ]?by(-sa)?(-[0-9.]+)?|cc0|public domain|pd[- ]?\w*|no restrictions)', re.I)
BAD_TITLE = re.compile(r'logo|emblem|map|screenshot|trading card|stamp|coat of arms|\.svg$|\.gif$|\.pdf$|\.tif', re.I)
MIN_W, MIN_H, PREF_W = 1600, 900, 2000
BLUR_MIN = 100.0   # ラプラシアン分散。既存記事の実測: 5〜12=完全にボケ, 30〜90=粗い, 200以上=十分, 1000以上=鮮明
OUT_W, OUT_H, JPEG_Q = 1600, 900, 85


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


def eligible(c, since):
    if BAD_TITLE.search(c['title']):
        return False
    if not OK_LICENSE.search(c['license'] or ''):
        return False
    if c['width'] < MIN_W or c['height'] < MIN_H:
        return False
    if c['mime'] not in ('image/jpeg', 'image/png', 'image/webp'):
        return False
    if since and (not c['taken_dt'] or c['taken_dt'] < since):
        return False
    return True


def rank_key(c):
    # 新しい順を最優先、次に幅2000以上、次に画素数
    return (c['taken_dt'] or datetime(1900, 1, 1, tzinfo=timezone.utc), c['width'] >= PREF_W, c['width'] * c['height'])


def blur_score(data):
    try:
        from PIL import Image
        import numpy as np, io
    except Exception:
        return None
    im = Image.open(io.BytesIO(data)).convert('L')
    a = np.asarray(im, dtype=float)
    lap = a[1:-1, 1:-1] * 4 - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:]
    return float(lap.var())


def save_hero(data, out):
    try:
        from PIL import Image, ImageOps
        import io
        im = Image.open(io.BytesIO(data))
        im = ImageOps.exif_transpose(im).convert('RGB')
        im = ImageOps.fit(im, (OUT_W, OUT_H), method=Image.LANCZOS, centering=(0.5, 0.4))
        im.save(out, 'JPEG', quality=JPEG_Q, optimize=True, progressive=True)
    except ImportError:
        with open(out, 'wb') as f:
            f.write(data)


def main():
    global MIN_W
    ap = argparse.ArgumentParser()
    ap.add_argument('terms', nargs='+', help='検索語（複数可。英語表記・別名・チーム名+選手名 など）')
    ap.add_argument('--out', help='保存先 site/assets/journal-NNN-hero.jpg')
    ap.add_argument('--list', action='store_true', help='候補一覧だけ表示')
    ap.add_argument('--pick', type=int, default=1, help='一覧のN番目を採用（既定1）')
    ap.add_argument('--limit', type=int, default=40)
    ap.add_argument('--min-width', type=int, default=MIN_W)
    args = ap.parse_args()
    MIN_W = args.min_width

    try:
        found, seen = [], set()
        for t in args.terms:
            for c in search(t, args.limit):
                if c['title'] not in seen:
                    seen.add(c['title']); found.append(c)
    except Exception as e:
        print(f'network error: {e}', file=sys.stderr); sys.exit(3)

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
        if b is not None and b < BLUR_MIN:
            print(f"  ボケ判定NG(分散{b:.0f}<{BLUR_MIN:.0f}) → 次の候補: {c['title'][:60]}"); continue
        if args.out:
            os.makedirs(os.path.dirname(args.out) or '.', exist_ok=True)
            save_hero(data, args.out)
            print(f"保存: {args.out} ({OUT_W}x{OUT_H}) 元={c['width']}x{c['height']} 撮影={c['taken']} ボケ判定={'%.0f' % b if b is not None else 'skip'}")
        print(f"FILE: {c['title']}\nPAGE: {c['page']}\nTAKEN: {c['taken']}")
        print(f"CREDIT: 撮影: {c['artist'] or '不明'} / {c['license']}, via Wikimedia Commons")
        return
    print('全候補がボケ判定NG → フォールバック写真を使う'); sys.exit(2)


if __name__ == '__main__':
    main()
