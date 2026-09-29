#!/usr/bin/env python3
"""ig_queue.json の記事1本 → 縦型ニュース動画の入力JSON＋背景画像（1080x1920）

2026-09-14 クリス指示「背景には該当する選手の画像を使って欲しいかな！」「俺は1つも動きたくない。
完全自動で記事が作られる形がいいんだ」で設置。video_build.py から呼ばれる（単体でも動く）。

    python3 journal_auto/video_input.py 137

出力:
    journal_video/input/auto/<slug>.json
    journal_video/public/assets/journal/auto/<NNN>-bg.jpg

背景は次の順で探し、取れた時点で止める（item["subject"] = 記事の主役の選手名・英語）:
    ① hero_sources.json に記事ヒーローの原寸URLがある（汎用写真でない）→ 顔を上から約30%に置いて縦に切る
    ② subject で Commons 検索（直近3年・切り抜く高さが元画像で1600px以上・顔が検出できる）
    ③ NBA.com 公式ヘッドショット（Wikidata P3647 で選手IDを引く）を黒地に合成
    ④ subject で Commons 検索（年代は問わない）
    ⑤ 記事ヒーローをぼかして敷き、くっきりしたヒーローを上側に重ねる
    ⑥ 記事が汎用イメージ写真（fallback-images.md）を使っていて記事専用ヒーローが無い場合、
       その写真の縦版（1080x1920・make_video_fallbacks.py で常備）をフル画面で敷く

メディアデーの記事（見出し・要約・要点に「メディアデー」を含む）だけは、①より前に
「新ユニフォーム姿の新しい写真」を探す（2026-09-29 クリス指示「メディアデーで、新ユニフォーム姿が
あったりする！それをこのメディアデーのIGリール投稿ではどんどんその新しい画像を使ってほしい！」）:
    ⓪-a subject で Commons 検索（直近 FRESH_DAYS 日に撮影・条件は②と同じ）
    ⓪-b NBA.com 公式ヘッドショットが直近 FRESH_DAYS 日に更新されている（＝今季のメディアデー撮影分）
取れなければ従来の①〜⑥に戻る。チーム公式IG・Getty・NBA.com のフォトギャラリーの写真は
クレジットを付けても使えない（PROMPT_CLOUD.md §1b）ので探さない。
NBA.com のヘッドショットは毎年メディアデー直後の約2週間で順に差し替わる（2025年は 9/24〜10/6 に
更新されたことを Last-Modified で確認）ので、更新前の選手は従来の写真になる。
"""

import io, json, os, re, sys, urllib.parse, urllib.request
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
W, H = 1080, 1920
FACE_Y = 0.30            # 顔の中心を仕上がりの上から何割に置くか
MIN_CROP_H = 1600        # ②④: 縦に切る高さ（元画像px）の下限。これ未満は拡大で眠くなる
MIN_CROP_H_HERO = 1200   # ①: 記事と同じ写真は多少粗くても優先する
MAX_TRY = 8
GENERIC = re.compile(r"^イメージ|本文とは直接関係")
MEDIADAY = re.compile(r"メディアデー|[Mm]edia [Dd]ay")
FRESH_DAYS = 14          # メディアデー記事で「新しい写真」とみなす日数


def log(msg):
    print(msg, flush=True)


def find_item(aid):
    for it in json.load(open(QUEUE, encoding="utf-8"))["items"]:
        if it["id"] == aid:
            return it
    raise SystemExit(f"ig_queue.json に {aid} が無い")


def portrait_from(data, min_crop_h):
    """写真を顔基準で 9:16 に切る。条件を満たさなければ (None, 理由)"""
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
    sw, sh = im.size
    ch = min(sh, sw * 16 / 9)
    cw = ch * 9 / 16
    if ch < min_crop_h:
        return None, f"切り抜き高さ{ch:.0f}px<{min_crop_h}"
    face = detect_face(im)
    if not face:
        return None, "顔が検出できない"
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


def wikidata_json(params):
    url = "https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode(dict(params, format="json"))
    with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=30) as r:
        return json.load(r)


def route_nba_headshot(names, fresh_since=None):
    """fresh_since を渡すと、その日時より後に更新されたヘッドショットだけを使う（メディアデー用）"""
    for name in names:
        try:
            hits = wikidata_json({"action": "wbsearchentities", "search": name, "language": "en",
                                  "type": "item", "limit": 5}).get("search", [])
            pid = None
            for h in hits:
                claims = wikidata_json({"action": "wbgetclaims", "entity": h["id"], "property": "P3647"})
                vals = claims.get("claims", {}).get("P3647", [])
                if vals:
                    pid = vals[0]["mainsnak"]["datavalue"]["value"]
                    break
            if not pid:
                log(f"  ③ NBA選手ID(P3647)が見つからない: {name}")
                continue
            url = f"https://cdn.nba.com/headshots/nba/latest/1040x760/{pid}.png"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r:
                modified = r.headers.get("Last-Modified")
                if fresh_since:
                    from email.utils import parsedate_to_datetime
                    mod = parsedate_to_datetime(modified) if modified else None
                    if not mod or mod < fresh_since:
                        log(f"  ⓪-b ヘッドショットが今季の更新前: {name} id={pid} 更新={modified or '不明'}")
                        continue
                head = Image.open(io.BytesIO(r.read())).convert("RGBA")
        except Exception as e:
            log(f"  ③ 失敗 {name}: {e}")
            continue
        tw = 1300
        th = round(head.height * tw / head.width)
        head = head.resize((tw, th), Image.LANCZOS)
        # 下端 35% を黒に溶かす（肩の切れ目を見せない）
        fade = Image.linear_gradient("L").resize((tw, th))  # 上0→下255
        start = int(th * 0.65)
        alpha = head.getchannel("A")
        mask = Image.new("L", (tw, th), 255)
        mask.paste(ImageOps.invert(fade.crop((0, 0, tw, th - start)).resize((tw, th - start))), (0, start))
        head.putalpha(Image.composite(alpha, Image.new("L", (tw, th), 0), mask))
        bg = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        bg.alpha_composite(head, ((W - tw) // 2, 180))
        return bg.convert("RGB"), "写真: NBA.com", f"nba_headshot id={pid} 更新={modified or '不明'}"
    return None


def is_mediaday(item):
    text = " ".join([item.get("headline", ""), item.get("excerpt", "")] + list(item.get("points") or []))
    return bool(MEDIADAY.search(text))


def route_fresh(names):
    """メディアデー記事: 新ユニフォーム姿が写っている見込みの高い、撮影・更新が新しい写真だけを探す"""
    since = datetime.now(timezone.utc) - timedelta(days=FRESH_DAYS)
    log(f"  メディアデー記事: 直近{FRESH_DAYS}日の新しい写真を優先して探す")
    got = route_commons(names, 0, days=FRESH_DAYS) or route_nba_headshot(names, fresh_since=since)
    if got:
        img, credit, route = got
        return img, credit, f"mediaday_fresh {route}"
    log("  ⓪ 新しい写真なし → 従来の順で探す")
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


def build(aid):
    aid = str(aid).zfill(3)
    item = find_item(aid)
    names = [s for s in item.get("subject") or [] if s.strip()]
    log(f"[{aid}] {item['headline']} subject={names or 'なし'}")
    got = route_fresh(names) if names and is_mediaday(item) else None
    got = got or route_hero_source(item)
    if not got and names:
        got = route_commons(names, 3) or route_nba_headshot(names) or route_commons(names, 0)
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
            "label": item.get("category") or "NEWS",
            "headline": item["headline"],
            "body": body,
            "background": {"type": "image", "src": bg_rel},
            "credit": credit,
        }
    props.update({"_article": item["url"], "_route": route})
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
