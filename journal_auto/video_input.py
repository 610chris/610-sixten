#!/usr/bin/env python3
"""ig_queue.json の記事1本 → 縦型ニュース動画の入力JSON＋背景画像（1080x1920）

2026-09-14 クリス指示「背景には該当する選手の画像を使って欲しいかな！」「俺は1つも動きたくない。
完全自動で記事が作られる形がいいんだ」で設置。video_build.py から呼ばれる（単体でも動く）。

    python3 journal_auto/video_input.py 137

出力:
    journal_video/input/auto/<slug>.json
    journal_video/public/assets/journal/auto/<NNN>-bg.jpg

背景は次の順で探し、取れた時点で止める（item["subject"] = 記事の主役の選手名・英語）:
    ⓢ ネタ元記事のメイン画像（記事ページの外部リンク＝ネタ元。ESPN は公開APIで原寸を引く）
    ① hero_sources.json に記事ヒーローの原寸URLがある（汎用写真でない）→ 顔を上から約30%に置いて縦に切る
    ② subject で Commons 検索（直近3年・切り抜く高さが元画像で1600px以上・顔が検出できる）
    ③ subject で Commons 検索（年代は問わない）
    ④ 記事ヒーローをぼかして敷き、くっきりしたヒーローを上側に重ねる
    ⑤ 記事が汎用イメージ写真（fallback-images.md）を使っていて記事専用ヒーローが無い場合、
       その写真の縦版（1080x1920・make_video_fallbacks.py で常備）をフル画面で敷く

ⓢ は 2026-09-29 クリス指示「IG投稿は写真権利に関しては大きくリーグに許容されているから、もっと画像
いいのにしてよ！」→ 取得元の選択「元記事の写真」で先頭に置いた。IGリールの話で、サイト記事の写真ルール
（PROMPT_CLOUD.md §1b）とは別。次のものは主役と合わない写真になるので使わない:
    - 記事の日付より SOURCE_MAX_AGE 日以上前の写真（ESPN は画像URLの /photo/<年>/<月日>/ で判定）
    - 複数の記事が同じネタ元を指している（ESPN のまとめページ等＝写真が特定の選手の物ではない）
NBA.com の公式ヘッドショット（顔写真を黒地に合成する経路）は同日「あの種類の画像は2度と、このIGリールに
使うな」で削除した。戻さない。

メディアデーの記事（見出し・要約・要点に「メディアデー」を含む）は、ⓢ の次に subject で Commons を
直近 FRESH_DAYS 日の撮影に絞って探す（2026-09-29 クリス指示「メディアデーで、新ユニフォーム姿が
あったりする！それをこのメディアデーのIGリール投稿ではどんどんその新しい画像を使ってほしい！」）。

Ⓛ NBA写真ライブラリ（各チーム公式IGの写真・Mac 側で集めて Release「photolib」に置いたもの。
索引は journal_auto/photolib_index.json＝~/.claude/scripts/nba_photo_library/publish_photolib.py が生成）
を subject の選手名で引く（2026-09-30 設置）。
    - メディアデー記事: ⓞ の次・ⓢ より前（チーム公式の新ユニフォーム姿を最優先で使う）
    - それ以外の記事: ⓢ の次（ネタ元の写真が取れない時の代替）
同じ写真が続かないよう、video_build.py が video_status.json の経路（"library <key> …"）から使用回数を数えて
渡し、使った回数の少ない写真 → 主役1人だけの写真 → （メディアデー記事なら）メディアデーの写真 → 撮影日が新しい順に選ぶ。

BGM は型ごとに BGM の曲を必ず入れる（2026-09-29 クリス指示「このIGリールBGMがない！れkは大問題だわ！！」）。
曲ファイルが journal_video/public/ に無いときは例外で止める＝BGMなしの動画は書き出さない。
"""

import io, json, os, re, sys, unicodedata, urllib.parse, urllib.request
from collections import Counter
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from pick_commons_photo import (  # noqa: E402
    UA, blur_ng, blur_score, detect_face, eligible, fetch, rank_key, search,
)
from make_video_fallbacks import FALLBACKS, OUT_DIR as FALLBACK_DIR  # noqa: E402
from PIL import Image, ImageFilter, ImageOps  # noqa: E402

ROOT = os.path.dirname(HERE)
VIDEO = os.path.join(ROOT, "journal_video")
QUEUE = os.path.join(HERE, "ig_queue.json")
SOURCES = os.path.join(HERE, "hero_sources.json")
LIBRARY = os.path.join(HERE, "photolib_index.json")
LIBRARY_MEDIADAY_EVENTS = {"メディアデー", "メディアデー期間"}
# NBA.com の選手顔写真（headshot）は背景に使わない（2026-09-29 クリス「あの種類の画像は2度と使うな」）
HEADSHOT = re.compile(r"cdn\.nba\.com/headshots|/headshots/", re.I)
W, H = 1080, 1920
FACE_Y = 0.30            # 顔の中心を仕上がりの上から何割に置くか
MIN_CROP_H = 1600        # ②④: 縦に切る高さ（元画像px）の下限。これ未満は拡大で眠くなる
MIN_CROP_H_HERO = 1200   # ①: 記事と同じ写真は多少粗くても優先する
MIN_FACE = 0.065         # 顔の高さ÷切り抜く高さの下限。選手が遠くに小さく写っている写真は、
                         # 一番大きい顔が観客になって観客のアップになる（2026-09-29 296・302 で発生）
MAX_TRY = 8
GENERIC = re.compile(r"^イメージ|本文とは直接関係")
MEDIADAY = re.compile(r"メディアデー|[Mm]edia [Dd]ay")
FRESH_DAYS = 14          # メディアデー記事で「新しい写真」とみなす日数
SOURCE_MAX_AGE = 200     # ⓢ: 記事の日付からこれ以上前の写真は使わない（前シーズン終盤より前＝移籍前の恐れ）
MIN_CROP_H_SOURCE = 1000 # ⓢ: ネタ元の写真は記事の主役が確実に写っているので多少粗くても使う
# 自動では主役の写真に届かない記事だけ、写真を名指しする（記事番号 → (画像URL, クレジット[, 横位置])）。
# ネタ元がまとめページで Commons にも使える写真が無い記事や、ネタ元の写真に主役が写っていない記事用。
# 画像URLは journal_auto/ からの相対パスでもよい（手で作った背景用）。
# 横位置(0〜1)は主役の顔の横位置。複数人が写る写真で、顔検出が別人を拾うのを防ぐ。
PHOTO_OVERRIDES = {
    "295": ("https://a.espncdn.com/photo/2026/0928/r1723110.jpg", "AP Photo/Chris Szagola", 0.54),
    "296": ("https://a.espncdn.com/photo/2023/0928/r1230782.jpg", "Troy Wayrynen/USA TODAY Sports", 0.5),
    # 298 は靴の記事なので、ネタ元（Sneaker News）の靴のアップを文字に隠れない上半分に置いた合成画像を使う
    "298": ("manual_bg/298.jpg", "Sneaker News", 0.5),
    "299": ("https://a.espncdn.com/photo/2025/0616/r1507331.jpg", "John Fisher/Getty Images"),
    "300": ("https://a.espncdn.com/photo/2024/1218/r1429531.jpg", "Mark Blinch/NBAE via Getty Images", 0.44),
    "302": ("https://a.espncdn.com/photo/2025/0209/r1449466.jpg", "Michael Reaves/Getty Images", 0.22),
    "306": ("https://a.espncdn.com/photo/2026/0430/r1651520.jpg", "Jesse D. Garrabrant/NBAE via Getty Images", 0.53),
    "307": ("https://a.espncdn.com/photo/2026/0204/r1610377.jpg", "Daniel Dunn-Imagn Images"),
    "308": ("https://a.espncdn.com/photo/2025/1004/r1555269.jpg", "Denis Poroy/Imagn Images"),
}
# ニュース型の見出し・本文の改行位置を記事ごとに指定する（記事番号 → {"headline": str, "body": [str]}）。
# 画面幅で機械的に折り返すと単語の途中で切れるので、意味の切れ目に "\n" を入れた文字で置き換える。
# 見出しは 68px で1行13字・58px で1行16字まで（theme.ts headlineFontSize）、本文は40pxで1行22字までを目安にする。
TEXT_OVERRIDES = {
    "297": {"headline": "カニングハムに\n「もっと良いバージョン」\n—— ピストンズHC保証",
            "body": ["ビッカースタッフHC\n「彼は自分から引っ張っている」",
                     "昨季23.9得点9.9アシスト、東地区最多TOは課題",
                     "初シグネチャーNikeシューズは今季後半デビュー"]},
    "298": {"headline": "SGA、未発売の\nV.A.A. x AF1 Lowを\nメディアデーで披露"},
    "299": {"headline": "バックス、\nトレント・Jr.契約の\nNBA調査に進展なし",
            "body": ["エデンス共同オーナー、\n開示できる進展はないと説明",
                     "今オフの契約にキャップ規定違反の疑い",
                     "リーグに全面協力していると強調"]},
    "300": {"headline": "ニックス、タウンズに続き\nハートの延長交渉も難航"},
    "301": {"headline": "エドワーズ\n「もう運ばなくていい」\nボール加入でSG回帰"},
    "302": {"headline": "バトラー\n「僕の数値は驚異的」\n—— ACL手術から8カ月"},
    "303": {"headline": "デイビス\n「シーズン終了後に決める」\n—— ウィザーズ残留は\n開幕後に持ち越し"},
    "306": {"headline": "エンビード\n「このチームには\n本気で興奮している」"},
}
SITE_JOURNAL = os.path.join(ROOT, "site", "journal")
NOT_SOURCE = re.compile(r"fonts\.(googleapis|gstatic)\.com|sixten\.jp|instagram\.com/sixten|"
                        r"creativecommons\.org|wikimedia\.org|wikipedia\.org")
ESPN_ID = re.compile(r"espn\.com/.*/id/(\d+)")
BROWSER_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/130 Safari/537.36")
# 型 → BGM（journal_video/public/ からの相対パス）。無い型は "news" を使う
BGM = {"news": "audio/bgm_news.mp3", "quote": "audio/bgm_quote.mp3",
       "score": "audio/bgm_score.mp3", "ranking": "audio/bgm_ranking.mp3"}


def log(msg):
    print(msg, flush=True)


def find_item(aid):
    for it in json.load(open(QUEUE, encoding="utf-8"))["items"]:
        if it["id"] == aid:
            return it
    raise SystemExit(f"ig_queue.json に {aid} が無い")


def portrait_from(data, min_crop_h, focus_x=None):
    """写真を顔基準で 9:16 に切る。条件を満たさなければ (None, 理由)。
    focus_x を渡すと、横の中心はその位置に固定する（顔検出は縦位置にだけ使う）"""
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
    sw, sh = im.size
    ch = min(sh, sw * 16 / 9)
    cw = ch * 9 / 16
    if ch < min_crop_h:
        return None, f"切り抜き高さ{ch:.0f}px<{min_crop_h}"
    face = detect_face(im, with_size=True)
    if focus_x is not None:
        fx = focus_x * sw
        fy = face[1] * sh if face and abs(face[0] - focus_x) < 0.1 else FACE_Y * sh
    elif not face:
        return None, "顔が検出できない"
    elif face[2] * sh / ch < MIN_FACE:
        return None, f"顔が小さい（{face[2] * sh / ch:.3f}<{MIN_FACE}）"
    else:
        fx, fy = face[0] * sw, face[1] * sh
    x = min(max(fx - cw / 2, 0), sw - cw)
    y = min(max(fy - FACE_Y * ch, 0), sh - ch)
    out = im.crop((round(x), round(y), round(x + cw), round(y + ch))).resize((W, H), Image.LANCZOS)
    return out, f"元{sw}x{sh}→切り抜き{cw:.0f}x{ch:.0f}（顔 上から{(fy - y) / ch * 100:.0f}%）"


def route_hero_source(item):
    if GENERIC.search(item.get("photo_credit", "")):
        return None
    try:
        src = json.load(open(SOURCES, encoding="utf-8")).get(item["id"])
    except (FileNotFoundError, ValueError):
        src = None
    if not src:
        return None
    try:
        img, how = portrait_from(fetch(src["url"]), MIN_CROP_H_HERO)
    except Exception as e:
        log(f"  ① 取得失敗: {e}")
        return None
    if img is None:
        log(f"  ① 不採用: {how}")
        return None
    return img, src["credit"], f"hero_source {how}"


def route_commons(names, years, days=None):
    since = datetime.now(timezone.utc) - timedelta(days=days or 365 * years) if (days or years) else None
    span = f"直近{days}日" if days else ("直近%d年" % years if years else "年代不問")
    for name in names:
        last = name.split()[-1].lower()
        try:
            cands = search(f'"{name}"', 50)
        except Exception as e:
            log(f"  Commons 検索失敗 {name}: {e}")
            continue
        cands = [c for c in cands if eligible(c, since) and last in c["title"].lower()
                 and min(c["height"], c["width"] * 16 / 9) >= MIN_CROP_H]
        cands.sort(key=rank_key, reverse=True)
        log(f"  Commons「{name}」{span}: 候補{len(cands)}")
        for c in cands[:MAX_TRY]:
            try:
                data = fetch(c["url"])
            except Exception as e:
                log(f"    取得失敗 {c['title'][:50]}: {e}")
                continue
            ng = blur_ng(blur_score(data))
            if ng:
                log(f"    ボケNG({ng}) {c['title'][:50]}")
                continue
            img, how = portrait_from(data, MIN_CROP_H)
            if img is None:
                log(f"    不採用({how}) {c['title'][:50]}")
                continue
            credit = f"撮影: {c['artist'] or '不明'} / {c['license']}, via Wikimedia Commons"
            return img, credit, f"commons {c['title']} {c['taken']} {how}"
    return None


def source_url(aid):
    """記事ページ site/journal/NNN-*.html の外部リンク（フォント・自サイト・クレジット以外）＝ネタ元"""
    page = next((f for f in os.listdir(SITE_JOURNAL) if f.startswith(f"{aid}-") and f.endswith(".html")), None)
    if not page:
        return None
    html = open(os.path.join(SITE_JOURNAL, page), encoding="utf-8").read()
    for u in re.findall(r'href="(https?://[^"]+)"', html):
        if not NOT_SOURCE.search(u):
            return u
    return None


def source_key(url):
    """ESPN は URL の末尾（slug）が変わっても記事IDが同じなら同じページ"""
    m = ESPN_ID.search(url or "")
    return f"espn:{m.group(1)}" if m else url


def shared_sources(aid, url):
    """同じネタ元を指している別の記事の番号（まとめページ判定用）"""
    same, key = [], source_key(url)
    for f in os.listdir(SITE_JOURNAL):
        m = re.match(r"(\d{3})-.*\.html$", f)
        if m and m.group(1) != aid and source_key(source_url(m.group(1))) == key:
            same.append(m.group(1))
    return same


def http_get(url, timeout=30):
    req = urllib.request.Request(url, headers={"User-Agent": BROWSER_UA})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def source_image(url):
    """ネタ元URL → (画像URL, クレジット, 撮影日 or None)。取れなければ None"""
    m = ESPN_ID.search(url)
    if m:
        # espn.com の記事ページはボット判定で空（202）が返るので公開ニュースAPIを使う
        d = json.loads(http_get(f"https://now.core.api.espn.com/v1/sports/news/{m.group(1)}"))
        imgs = (d.get("headlines") or [{}])[0].get("images") or []
        im = next((i for i in imgs if i.get("type") == "header"), imgs[0] if imgs else None)
        if not im or not im.get("url"):
            return None
        # r1723110_600x400_3-2.jpg → r1723110.jpg（原寸）
        full = re.sub(r"_\d+x\d+(_[\d-]+)?(\.jpg)$", r"\2", im["url"])
        dm = re.search(r"/photo/(\d{4})/(\d{2})(\d{2})/", full)
        taken = datetime(int(dm[1]), int(dm[2]), int(dm[3]), tzinfo=timezone.utc) if dm else None
        return full, im.get("credit") or "ESPN", taken
    html = http_get(url).decode("utf-8", "replace")
    og = re.search(r'<meta[^>]+property="og:image"[^>]+content="([^"]+)"', html) or \
        re.search(r'<meta[^>]+content="([^"]+)"[^>]+property="og:image"', html)
    if not og:
        return None
    host = urllib.parse.urlparse(url).netloc.replace("www.", "")
    return og.group(1), host, None


def route_source(item):
    aid = item["id"]
    url = source_url(aid)
    if not url:
        log("  ⓢ ネタ元リンクが記事に無い")
        return None
    same = shared_sources(aid, url)
    if same:
        log(f"  ⓢ 不採用: 同じネタ元を {' '.join(same)} も指している（まとめページ）{url}")
        return None
    try:
        got = source_image(url)
        if not got:
            log(f"  ⓢ ネタ元に画像が無い: {url}")
            return None
        img_url, credit, taken = got
        if taken and item.get("date"):
            art = datetime.fromisoformat(item["date"][:10]).replace(tzinfo=timezone.utc)
            if (art - taken).days >= SOURCE_MAX_AGE:
                log(f"  ⓢ 不採用: 写真が古い（{taken:%Y-%m-%d}・記事 {item['date'][:10]}）{img_url}")
                return None
        img, how = portrait_from(http_get(img_url, 60), MIN_CROP_H_SOURCE)
    except Exception as e:
        log(f"  ⓢ 取得失敗 {url}: {e}")
        return None
    if img is None:
        log(f"  ⓢ 不採用: {how} {img_url}")
        return None
    return img, f"写真: {credit}", f"source {img_url} {how}"


def is_mediaday(item):
    text = " ".join([item.get("headline", ""), item.get("excerpt", "")] + list(item.get("points") or []))
    return bool(MEDIADAY.search(text))


def route_fresh(names):
    """メディアデー記事: 新ユニフォーム姿が写っている見込みの高い、撮影が新しい Commons 写真だけを探す"""
    log(f"  メディアデー記事: Commons で直近{FRESH_DAYS}日の新しい写真を探す")
    got = route_commons(names, 0, days=FRESH_DAYS)
    if got:
        img, credit, route = got
        return img, credit, f"mediaday_fresh {route}"
    log("  新しい写真なし → 従来の順で探す")
    return None


def norm_name(s):
    """選手名の照合用（アクセント・大文字小文字・記号を落とす: Jokić → nikolajokic）"""
    s = unicodedata.normalize("NFKD", s or "")
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if not unicodedata.combining(c)).lower())


def split_names(names):
    """subject は ["A|B"] のように1要素に複数名が入っていることがある"""
    return [p.strip() for n in names or [] for p in n.split("|") if p.strip()]


def library_used(status, exclude_aid=None):
    """video_status.json → ライブラリ写真の key ごとの使用回数（作り直す記事自身の分は数えない）"""
    used = Counter()
    for aid, st in (status or {}).items():
        route = st.get("route") or ""
        if aid != exclude_aid and route.startswith("library "):
            used[route.split()[1]] += 1
    return used


def group_focus_x(data):
    """複数人の写真: 大きい顔（最大の顔の半分以上の幅）全員の横位置の中央（0〜1）。取れなければ None。
    detect_face は一番大きい顔しか返さないので、2ショットで主役が端にいると主役が切れる（Curry×Lendeborg で発生）"""
    try:
        import cv2, numpy as np
        from pick_commons_photo import YUNET, FACE_SCORE, FACE_LONG
        im = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
        s = min(1.0, FACE_LONG / max(im.size))
        if s < 1.0:
            im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
        arr = np.ascontiguousarray(np.asarray(im)[:, :, ::-1])
        det = cv2.FaceDetectorYN.create(YUNET, "", (arr.shape[1], arr.shape[0]), score_threshold=FACE_SCORE)
        _, faces = det.detect(arr)
    except Exception:
        return None
    if faces is None or len(faces) < 2:
        return None
    big = max(f[2] for f in faces)
    xs = [(f[0] + f[2] / 2) / arr.shape[1] for f in faces if f[2] >= big * 0.5]
    return (min(xs) + max(xs)) / 2 if len(xs) >= 2 else None


def route_library(names, item, used=None):
    """NBA写真ライブラリ（チーム公式IG）から記事の選手の写真を選び、顔基準で縦に切る"""
    try:
        lib = json.load(open(LIBRARY, encoding="utf-8")).get("items") or []
    except (FileNotFoundError, ValueError):
        log("  Ⓛ ライブラリ索引が無い")
        return None
    used = used or Counter()
    mediaday = is_mediaday(item)
    want = [norm_name(n) for n in split_names(names)]
    best = {}  # key → (候補の並び順キー, 写真)
    for e in lib:
        if HEADSHOT.search(e.get("url", "")) or HEADSHOT.search(e.get("source_url", "")):
            continue
        ps = {norm_name(p) for p in e.get("players") or []}
        rank = next((i for i, n in enumerate(want) if n in ps), None)
        if rank is None:
            continue
        # 未使用 → 記事の主役順 → 使った回数が少ない → 1人だけの写真 → メディアデー記事ならメディアデーの写真 → 新しい順
        # （主役の写真が使い切りなら、記事に出てくる2人目以降の未使用の写真を先に使う）
        n_used = used.get(e["key"], 0)
        # @nba（リーグ公式）の投稿は写真に大きな文字を載せた加工画像が多いので、チーム公式の後に回す
        order = (n_used > 0, rank, n_used, len(ps) > 1, (e.get("credit") or "").startswith("nba "),
                 mediaday and e.get("event") not in LIBRARY_MEDIADAY_EVENTS,
                 -int(re.sub(r"\D", "", e.get("date", "")) or 0))
        best[e["key"]] = (order, e)
    cands = [e for _, e in sorted(best.values(), key=lambda t: t[0])]
    log(f"  Ⓛ ライブラリ「{' / '.join(split_names(names))}」: 候補{len(cands)}")
    for e in cands[:MAX_TRY]:
        try:
            data = http_get(e["url"], 60)
            # 複数人の写真は顔の並びの中央で切る（一番大きい顔＝主役とは限らない）
            fx = group_focus_x(data) if len(e.get("players") or []) > 1 else None
            img, how = portrait_from(data, MIN_CROP_H_SOURCE, fx)
        except Exception as ex:
            log(f"    取得失敗 {e['key']}: {ex}")
            continue
        if img is None:
            log(f"    不採用({how}) {e['key']}")
            continue
        return img, f"写真: {e['credit']}", f"library {e['key']} {e.get('event', '')} {e.get('date', '')} {how}"
    return None


def route_generic_fallback(item):
    """記事が汎用イメージ写真を使っている（＝記事専用のヒーローが無い）場合。

    記事と同じ写真の縦版をフル画面で敷く。記事側は横長（1600x900）をそのまま使うので
    `journal-NNN-hero.jpg` が作られず、⑤が空振りして真っ黒になっていた（2026-09-20 に64本中16本）。
    どの写真かは記事の `photo_credit` の撮影者名で一意に決まる。
    """
    want = video_credit(item.get("photo_credit", ""))
    key = next((k for k, v in FALLBACKS.items() if v["credit"] == want), None)
    if key is None:
        key = sorted(FALLBACKS)[int(item["id"]) % len(FALLBACKS)]
        log(f"  ⑥ 記事の写真を特定できないので {key} を使う: {want or '（クレジットなし）'}")
    path = os.path.join(FALLBACK_DIR, f"{key}.jpg")
    if not os.path.exists(path):
        log(f"  ⑥ 縦版が無い（make_video_fallbacks.py を実行）: {path}")
        return None
    # 写真は記事のクレジットで決まる＝選べないので、絵が完全に同じ動画が続かないよう
    # 記事番号で切り出し窓を左/中/右にずらす（常備画像は画面より 360px 横に広い・拡大なし）
    im = Image.open(path).convert("RGB")
    pan = (0.0, 0.5, 1.0)[int(item["id"]) % 3]
    x = round((im.width - W) * pan)
    img = im.crop((x, 0, x + W, H)) if im.width > W else im.resize((W, H), Image.LANCZOS)
    return img, FALLBACKS[key]["credit"], f"fallback {key} pan={pan}"


def route_hero_blur(item):
    hero = os.path.join(ROOT, "site", "assets", f"journal-{item['id']}-hero.jpg")
    if not os.path.exists(hero):
        return None
    im = Image.open(hero).convert("RGB")
    bg = ImageOps.fit(im, (W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(40))
    bg = Image.eval(bg, lambda v: int(v * 0.6))
    fg = im.resize((W, round(im.height * W / im.width)), Image.LANCZOS)
    bg.paste(fg, (0, 300))
    credit = GENERIC.sub("", item.get("photo_credit", "")).lstrip("（）)。 ")
    credit = re.sub(r"^[^。]*（本文とは直接関係ありません）。", "", credit)
    return bg, credit, "hero_blur"


def video_credit(credit):
    """記事の写真クレジット「アンソニー・エドワーズ。撮影: 〜」から被写体名を落として動画用に短くする"""
    m = re.search(r"(撮影|画像|写真)[:：].*$", credit or "")
    return m.group(0) if m else (credit or "")


# item["video"] の型ごとの必須キーと行数上限（journal_video/src/props.ts と揃える）
TEMPLATES = {
    "score": {"required": ("player", "points"), "lists": {"stats": 5}},
    "quote": {"required": ("quote", "speaker"), "lists": {"quote": 8}},
    "ranking": {"required": ("title", "rows"), "lists": {"rows": 10}},
}
TEMPLATE_KEYS = {
    "score": ("player", "opponent", "points", "unit", "stats", "label"),
    "quote": ("quote", "speaker", "speakerNote", "label"),
    "ranking": ("title", "subtitle", "rows", "total", "label"),
}


def template_props(video):
    """item["video"] → 新しい型の props。使えなければ (None, 理由)。自動なので止めずにニュース型へ戻す"""
    if not video:
        return None, "video 指定なし"
    t = video.get("template")
    spec = TEMPLATES.get(t)
    if not spec:
        return None, f"未知の template: {t}"
    for k in spec["required"]:
        if video.get(k) in (None, "", []):
            return None, f"{t}: {k} が空"
    for k, cap in spec["lists"].items():
        v = video.get(k, [])
        if not isinstance(v, list) or len(v) > cap:
            return None, f"{t}: {k} は最大{cap}行の配列"
    if t == "score" and not isinstance(video["points"], (int, float)):
        return None, "score: points が数値でない"
    if t == "ranking" and not all(isinstance(r, dict) and r.get("name") and r.get("value")
                                  for r in video["rows"]):
        return None, "ranking: rows の各行に name と value が要る"
    props = {"template": t}
    props.update({k: video[k] for k in TEMPLATE_KEYS[t] if k in video})
    return props, t


def route_override(aid):
    if aid not in PHOTO_OVERRIDES:
        return None
    img_url, credit, *focus = PHOTO_OVERRIDES[aid]
    try:
        data = http_get(img_url, 60) if img_url.startswith("http") else open(os.path.join(os.path.dirname(os.path.abspath(__file__)), img_url), "rb").read()
        img, how = portrait_from(data, MIN_CROP_H_SOURCE, *focus)
    except Exception as e:
        log(f"  ⓞ 取得失敗 {img_url}: {e}")
        return None
    if img is None:
        log(f"  ⓞ 不採用: {how} {img_url}")
        return None
    return img, f"写真: {credit}", f"override {img_url} {how}"


def build(aid, used=None):
    """used: ライブラリ写真の key → 使用回数（video_build.py が library_used() で渡す）"""
    aid = str(aid).zfill(3)
    item = find_item(aid)
    names = [s for s in item.get("subject") or [] if s.strip()]
    mediaday = bool(names) and is_mediaday(item)
    log(f"[{aid}] {item['headline']} subject={names or 'なし'}")
    got = route_override(aid)
    if not got and mediaday:
        got = route_library(names, item, used)
    got = got or route_source(item)
    if not got and names and not mediaday:
        got = route_library(names, item, used)
    if not got and mediaday:
        got = route_fresh(names)
    got = got or route_hero_source(item)
    if not got and names:
        got = route_commons(names, 3) or route_commons(names, 0)
    if not got:
        got = route_hero_blur(item) or route_generic_fallback(item)
    if not got:
        got = Image.new("RGB", (W, H), (0, 0, 0)), "", "black（フォールバック写真も無い）"
    img, credit, route = got
    credit = video_credit(credit)

    bg_rel = f"assets/journal/auto/{aid}-bg.jpg"
    bg_path = os.path.join(VIDEO, "public", bg_rel)
    os.makedirs(os.path.dirname(bg_path), exist_ok=True)
    img.save(bg_path, "JPEG", quality=90, optimize=True)

    props, why = template_props(item.get("video"))
    if props:
        props.update({"background": {"type": "image", "src": bg_rel}, "credit": credit})
    else:
        if item.get("video"):
            log(f"  video 指定を使わずニュース型にする（{why}）")
        body = [p for p in item.get("points") or [] if p.strip()] or [item.get("excerpt", "")[:80]]
        props = {
            "label": "NEWS",  # ニュース型は記事のカテゴリ（NBA/KICKS 等）に関係なく NEWS と出す
            "headline": item["headline"],
            "body": body,
            "background": {"type": "image", "src": bg_rel},
            "credit": credit,
        }
        props.update(TEXT_OVERRIDES.get(aid, {}))
    bgm =BGM.get(props.get("template", "news"), BGM["news"])
    if not os.path.exists(os.path.join(VIDEO, "public", bgm)):
        raise RuntimeError(f"BGM が無い（BGMなしでは書き出さない）: journal_video/public/{bgm}")
    props.update({"bgm": bgm, "_article": item["url"], "_route": route})
    json_path = os.path.join(VIDEO, "input", "auto", f"{item['slug']}.json")
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(props, f, ensure_ascii=False, indent=2)
        f.write("\n")
    template = props.get("template", "news")
    log(f"  型: {template}\n  背景: {route.split()[0]} → {bg_rel}\n  経路詳細: {route}\n  クレジット: {credit or '（なし）'}")
    return {"json": json_path, "route": route, "credit": credit, "slug": item["slug"],
            "template": template}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("使い方: video_input.py NNN [NNN ...]")
    for a in sys.argv[1:]:
        build(a)
