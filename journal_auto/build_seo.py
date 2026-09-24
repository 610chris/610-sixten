#!/usr/bin/env python3
"""610 JOURNAL SEO/AEO ビルド（2026-09-05設置）

site/journal/journal.js の ARTICLES を唯一の記事台帳として、クローラー(Google/Bing/GPTBot/ClaudeBot等)が
JSを実行しなくても全記事に辿り着ける静的HTMLと配信ファイルを生成する。何度実行しても同じ結果(冪等)。

生成/更新するもの
  1. site/journal/index.html  … ヒーロー/LATEST/ALL STORIES を静的HTMLで埋める(JSは従来通り上書き描画)
  2. site/index.html          … JOURNALセクションの最新3本を差し替え(HOME-LATEST マーカー内)
  3. site/journal/NNN-*.html  … 関連記事3本の静的化・パンくず(表示+BreadcrumbList JSON-LD)・
                                 RSS alternate・article:section・robots拡張・フッター説明文・空altの補完
  4. site/sitemap.xml         … 全ページ(lastmod=記事日付)
     site/news-sitemap.xml    … Google News 用(公開48時間以内の記事だけ)
  5. site/feed.xml            … RSS 2.0(最新30本)
  6. site/llms.txt            … AI検索向けサイト説明+最新記事一覧
  7. キャッシュバスター(2026-09-05) … journal.js の thumb と全HTML(site/*.html, journal/*.html, media/*.html)内の
                                 ローカル画像/CSS/JS参照(相対・/絶対・https://sixten.jp/絶対)に、ファイル内容の
                                 md5先頭10桁を `?v=` として付与する。同名上書きで写真を差し替えても、URLが変わるので
                                 ブラウザ/Cloudflare/surge のキャッシュに古い画像が残らない。手で `?v=` を書く必要なし。
                                 (css/*.css 内の url() は触らない。書体・CSSは手で触らないルールのため)
  8. アクセス解析(2026-09-12) … journal_auto/analytics_config.json に GA4測定ID が入っていれば、site配下の
                                 全HTML(検証用のgoogle*.htmlを除く)の </head> 直前に gtag.js を挿入し、
                                 フッターの著作権表示の下にプライバシーポリシー導線を置く。IDを空にすれば
                                 全ページから消える。どちらも何度実行しても同じ結果(冪等)。
                                 広告営業に出す月間PV/UUを貯めるための土台。集計は 615_JOURNAL/analytics/ 側。
  9. 検証: 各記事のcanonical/JSON-LD/title形式を確認し、欠けていれば警告(exit 1にはしない)

使い方: リポジトリルートで `python3 journal_auto/build_seo.py`
  - 自動記事化ルーチン(PROMPT_CLOUD.md §3)は記事追加後・commit前に必ず実行する
  - GitHub Actions(deploy.yml)もデプロイ直前に実行するので、実行し忘れても公開物は最新になる
"""
from __future__ import annotations

import datetime as dt
import hashlib
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
JOURNAL = SITE / "journal"
BASE = "https://sixten.jp"
SITE_NAME = "610バスケットボールジャーナル"
ORG_NAME = "610 — sixten"
FEED_URL = f"{BASE}/feed.xml"
TODAY = dt.date.today().isoformat()

SITE_DESC = (
    "610バスケットボールジャーナル（610 JOURNAL）は、メディアエージェンシー 610（シックステン）が運営する"
    "バスケットボール専門メディア。NBA速報、Bリーグ・日本代表などの国内バスケ、キックス、カルチャーの"
    "ニュースと読みものを日本語で日々更新。すべての記事に出典を明記。"
)
FOOTER_ABOUT = (
    "610バスケットボールジャーナル（610 JOURNAL）は、メディアエージェンシー 610（シックステン）が運営する"
    "バスケットボール専門メディアです。NBA・Bリーグ・日本代表・キックス・カルチャーのニュースと読みものを"
    "日本語で日々更新しています。"
)
CATS = ["NBA", "JAPAN", "KICKS", "CULTURE", "REPORT"]
CAT_LABEL = {
    "NBA": "NBAのニュース・速報",
    "JAPAN": "国内バスケ（Bリーグ・日本代表・ユース・スクール）",
    "KICKS": "バッシュ・スニーカー",
    "CULTURE": "バスケとカルチャー",
    "REPORT": "取材・レポート",
}
# 分野ハブ(静的URL・2026-09-15 施策8)。?cat= のJS絞り込みは URL の実体が一覧1枚なので、強い分野だけ実体ページを持たせる
HUBS = {
    "JAPAN": {
        "slug": "japan",
        "title": "国内バスケ（Bリーグ・日本代表）のニュース・記事一覧",
        "h1": "国内バスケのニュース",
        "en": "JAPAN — B.LEAGUE / 日本代表 / ユース",
        "desc": "B.LEAGUE（Bリーグ）、バスケ日本代表、ユース・高校・スクールなど国内バスケのニュースと読みもの。"
        "プレスリリースなどの一次情報を出典付きで記事にしています。",
    },
    "KICKS": {
        "slug": "kicks",
        "title": "バッシュ・スニーカーのニュース・記事一覧",
        "h1": "バッシュ・スニーカーのニュース",
        "en": "KICKS — SIGNATURE SHOES / SNEAKERS",
        "desc": "バッシュ（バスケットボールシューズ）とスニーカーのニュース。シグネチャーモデルの新作・発売情報・シリーズまとめを、"
        "ブランドの発表や専門メディアの出典付きで紹介しています。",
    },
}

warnings: list[str] = []
changed: list[str] = []


def warn(msg: str) -> None:
    warnings.append(msg)
    print("  ! " + msg)


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def write_if_changed(p: Path, new: str) -> None:
    if p.suffix == ".html":
        new = add_img_dims(new, p.parent)  # 途中の工程で width なしのカードを書いて戻す往復(見かけの「更新」)を防ぐ
    old = p.read_text(encoding="utf-8") if p.exists() else None
    if old != new:
        p.write_text(new, encoding="utf-8")
        changed.append(str(p.relative_to(ROOT)))


# ---------------------------------------------------------------- 記事台帳
def load_articles() -> list[dict]:
    js = read(JOURNAL / "journal.js")
    m = re.search(r"const ARTICLES = \[(.*?)\n\];", js, re.S)
    if not m:
        sys.exit("journal.js: ARTICLES が見つからない")
    body = m.group(1)
    # JSオブジェクトリテラル → JSON: 行頭のキーをクォート、末尾カンマ除去
    body = re.sub(r"(?m)^(\s*)([A-Za-z_]\w*)\s*:", r'\1"\2":', body)
    body = re.sub(r",(\s*[}\]])", r"\1", body)
    try:
        arts = json.loads("[" + body + "]")
    except json.JSONDecodeError as e:
        sys.exit(f"journal.js の ARTICLES を JSON として読めない: {e}")
    for a in arts:
        a["iso"] = iso_date(a["date"])
        a["url"] = f"{BASE}/journal/{a['href']}"
        a["abs_thumb"] = abs_asset(a.get("thumb"))
    return arts


def iso_date(d: str) -> str:
    """'2026.08.31' → '2026-08-31'  /  '2024.08' → '2024-08-01'"""
    parts = re.findall(r"\d+", d)
    if len(parts) == 2:
        parts.append("1")
    if len(parts) != 3:
        warn(f"日付形式が不明: {d}")
        return TODAY
    y, mo, da = (int(x) for x in parts)
    return f"{y:04d}-{mo:02d}-{da:02d}"


def abs_asset(rel: str | None) -> str | None:
    if not rel:
        return None
    return BASE + "/" + rel.replace("../", "")


def rfc822(iso: str) -> str:
    d = dt.date.fromisoformat(iso)
    return dt.datetime(d.year, d.month, d.day, 9, 0, tzinfo=dt.timezone(dt.timedelta(hours=9))).strftime(
        "%a, %d %b %Y %H:%M:%S %z"
    )


# ---------------------------------------------------------------- 部品HTML(journal.jsの描画と同じ構造)
def thumb_html(a: dict) -> str:
    if a.get("thumb"):
        return f'<div class="thumb"><img src="{esc(a["thumb"])}" alt="{esc(a["title"])}" loading="lazy"></div>'
    return (
        '<div class="thumb"><div class="tile"><span class="bar"></span><span class="word">'
        + esc(a.get("tile") or a["cat"])
        + "</span></div></div>"
    )


def feed_row(a: dict) -> str:
    return (
        f'<a class="feed-row" href="{esc(a["href"])}" data-cat="{esc(a["cat"])}">'
        + thumb_html(a)
        + '<div class="body"><div class="meta-row"><span class="jr-cat">'
        + esc(a["cat"])
        + '</span><span class="jr-date">'
        + esc(a["date"])
        + "</span></div><h3>"
        + esc(a["title"])
        + '</h3><p class="excerpt">'
        + esc(a["excerpt"])
        + "</p></div></a>"
    )


def rel_card(a: dict) -> str:
    return (
        f'<a class="rel-card" href="{esc(a["href"])}">'
        + thumb_html(a)
        + f'<span class="jr-cat">{esc(a["cat"])}</span><h4>{esc(a["title"])}</h4>'
        + f'<span class="jr-date">{esc(a["date"])}</span></a>'
    )


VIDEO_DIR = SITE / "assets" / "journal" / "video"
VIDEO_NOTE = "この記事の要点を8秒の縦型動画にまとめています。"


def article_video(a: dict) -> str:
    """記事の縦型ニュース動画ブロック（2026-09-20）

    site/assets/journal/video/NNN.mp4 があれば記事末尾に置く。無ければ空文字＝マーカー間が空になり
    ブロックは自動で消える。動画は journal_auto/video_build.py が Release「videos」に上げた原寸
    （1080x1920）を web 用に 720x1280 へ落としたもの。Release の生URLを直接貼らないのは、GitHub が
    Release アセットを application/octet-stream + attachment で返すため iOS Safari が再生しないから
    （2026-09-20 実測: Chrome は再生できるが Safari は不可）。サイト自身から配信すれば
    Content-Type: video/mp4 になり、surge も Range(206) に対応している。

    style に height:auto / aspect-ratio:9/16 / object-fit:cover を入れている理由（2026-09-20 実測）:
    width:100% だけだと height="1280" 属性がそのまま px として効き、iPhone 幅で 300x1280 の
    黒い箱になって上下に 370px ずつ黒帯が出ていた。さらに poster は記事のヒーロー画像（16:9 の横長）
    なので、cover で箱に合わせて切らないと箱の中央に小さく浮く。動画自体は 9:16 なので cover でも
    切られない。ポスター用の縦画像を別に作るとリポジトリが太るため、この 3 プロパティで解決している。
    """
    vid = VIDEO_DIR / f"{a['href'][:3]}.mp4"
    if not vid.exists():
        return ""
    url = f"{BASE}/assets/journal/video/{vid.name}"
    poster = a.get("abs_thumb")
    ld = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": a["title"],
        "description": VIDEO_NOTE,
        "contentUrl": url,
        "uploadDate": a.get("published") or a["iso"],
        "duration": "PT8S",
    }
    if poster:
        ld["thumbnailUrl"] = poster
    poster_attr = f' poster="{esc(poster)}"' if poster else ""
    return (
        '  <aside class="article-video" style="margin-top:56px;padding-top:28px;'
        'border-top:1px solid var(--line)">\n'
        '    <div style="font-family:var(--font-display);font-size:13px;letter-spacing:0.3em;'
        'color:var(--accent);margin-bottom:14px">VIDEO</div>\n'
        f'    <video src="{url}"{poster_attr} controls preload="none" '
        'playsinline width="720" height="1280" '
        'style="width:100%;max-width:300px;height:auto;aspect-ratio:9/16;object-fit:cover;'
        'display:block;border-radius:4px;background:#000">'
        f'<a href="{url}">{esc(a["title"])}の動画</a></video>\n'
        f'    <p style="margin-top:10px;font-size:12px;letter-spacing:0.05em;color:var(--muted)">'
        f'{esc(VIDEO_NOTE)}</p>\n'
        '  </aside>\n'
        '  <script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + "</script>"
    )


def between(text: str, start: str, end: str, inner: str) -> str:
    """マーカー間を差し替える。マーカーが無ければ text をそのまま返す"""
    pat = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
    if not pat.search(text):
        return text
    return pat.sub(lambda _: start + "\n" + inner + "\n" + end, text, count=1)


# ---------------------------------------------------------------- 1. journal/index.html
def build_journal_index(arts: list[dict]) -> None:
    p = JOURNAL / "index.html"
    t = read(p)
    featured = next((a for a in arts if a.get("featured")), arts[0])

    src = featured.get("heroThumb") or featured.get("thumb")
    visual = (
        f'<img src="{esc(src)}" alt="{esc(featured["title"])}">'
        if src
        else '<div class="tile"><span class="bar"></span><span class="word">'
        + esc(featured.get("tile") or featured["cat"])
        + "</span></div>"
    )
    hero_inner = (
        f'<div class="photo">{visual}</div><div class="overlay"><span class="jr-cat">{esc(featured["cat"])}</span>'
        f'<h2>{esc(featured["title"])}</h2><p class="excerpt">{esc(featured["excerpt"])}</p>'
        f'<span class="jr-date">{esc(featured["date"])} — FEATURED</span></div>'
    )
    t, n = re.subn(
        r'<a class="hero-featured" id="hero-featured" href="[^"]*">.*?</a>',
        lambda _: f'<a class="hero-featured" id="hero-featured" href="{esc(featured["href"])}">{hero_inner}</a>',
        t,
        count=1,
        flags=re.S,
    )
    if not n:
        warn("journal/index.html: hero-featured が見つからない")

    latest = "".join(
        f'<li><a href="{esc(a["href"])}"><span class="t">{esc(a["title"])}</span><span class="d">{esc(a["cat"])} — {esc(a["date"])}</span></a></li>'
        for a in arts[:6]
    )
    t, n = re.subn(r'<ol id="latest-list">.*?</ol>', lambda _: f'<ol id="latest-list">{latest}</ol>', t, count=1, flags=re.S)
    if not n:
        warn("journal/index.html: latest-list が見つからない")

    rows = "\n".join(feed_row(a) for a in arts)
    if "<!-- STATIC-FEED:START -->" not in t:
        t, n = re.subn(
            r'<div class="feed-list" id="feed-list">\s*</div>',
            '<div class="feed-list" id="feed-list"><!-- STATIC-FEED:START -->\n<!-- STATIC-FEED:END --></div>',
            t,
            count=1,
        )
        if not n:
            warn("journal/index.html: feed-list(空)が見つからない。STATIC-FEEDマーカーを入れられない")
    t = between(t, "<!-- STATIC-FEED:START -->", "<!-- STATIC-FEED:END -->", rows)
    t = ensure_common_head(t)
    write_if_changed(p, t)


# ---------------------------------------------------------------- 2. index.html(ホーム)
def build_home(arts: list[dict]) -> None:
    p = SITE / "index.html"
    t = read(p)
    cards = "\n".join(
        f'      <a class="jr-card" href="journal/{esc(a["href"])}">\n'
        f'        <span class="jr-cat">{esc(a["cat"])}</span>\n'
        f"        <h4>{esc(a['title'])}</h4>\n"
        f"        <p>{esc(a['excerpt'])}</p>\n"
        f'        <span class="jr-date">{esc(a["date"])}</span>\n'
        f"      </a>"
        for a in arts[:3]
    )
    if "<!-- HOME-LATEST:START -->" not in t:
        t, n = re.subn(
            r'(<div class="journal-grid reveal">).*?(\n    </div>\n    <div class="journal-more)',
            r"\1<!-- HOME-LATEST:START -->\n<!-- HOME-LATEST:END -->\2",
            t,
            count=1,
            flags=re.S,
        )
        if not n:
            warn("index.html: journal-grid が見つからない。HOME-LATESTマーカーを入れられない")
    t = between(t, "<!-- HOME-LATEST:START -->", "<!-- HOME-LATEST:END -->", cards)
    t = ensure_common_head(t)
    write_if_changed(p, t)


# ---------------------------------------------------------------- 2b. 分野ハブ journal/<slug>/index.html(施策8)
def hub_url(cat: str) -> str:
    return f"{BASE}/journal/{HUBS[cat]['slug']}/"


_HUB_REL_RE = re.compile(r'(["\'])([^"\'\s]*?)index\.html\?cat=(' + "|".join(HUBS) + r')(["\'])')
_HUB_ABS_RE = re.compile(r"/journal/\?cat=(" + "|".join(HUBS) + r")\b")


def apply_hub_links(t: str) -> str:
    """ナビ・パンくず等の ?cat=JAPAN/KICKS をハブの静的URLに置き換える(冪等)"""
    t = _HUB_REL_RE.sub(lambda m: f"{m.group(1)}{m.group(2)}{HUBS[m.group(3)]['slug']}/{m.group(4)}", t)
    return _HUB_ABS_RE.sub(lambda m: f"/journal/{HUBS[m.group(1)]['slug']}/", t)


def build_hubs(arts: list[dict]) -> None:
    nav_items = [("ALL", "../index.html")] + [
        (c, f"../{HUBS[c]['slug']}/" if c in HUBS else f"../index.html?cat={c}") for c in CATS
    ]
    for cat, h in HUBS.items():
        items = [a for a in arts if a["cat"] == cat]
        url = hub_url(cat)
        title = f"{h['title']} | {SITE_NAME}"
        desc = f"{h['desc']}（全{len(items)}本・新しい順）"
        og = next((a["abs_thumb"] for a in items if a.get("abs_thumb")), f"{BASE}/assets/og-default.jpg")
        page_ld = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": h["title"],
            "url": url,
            "inLanguage": "ja",
            "description": desc,
            "isPartOf": {"@type": "WebSite", "name": ORG_NAME, "url": BASE},
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": len(items),
                "itemListElement": [
                    {"@type": "ListItem", "position": i + 1, "url": a["url"], "name": a["title"]}
                    for i, a in enumerate(items[:30])
                ],
            },
        }
        bc_ld = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": ORG_NAME, "item": BASE + "/"},
                {"@type": "ListItem", "position": 2, "name": SITE_NAME, "item": BASE + "/journal/"},
                {"@type": "ListItem", "position": 3, "name": cat, "item": url},
            ],
        }
        nav = "\n".join(
            f'      <a href="{href}"{active_cls}>{label}</a>'
            for label, href, active_cls in (
                (label, href, ' class="active"' if label == cat else "")
                for label, href in nav_items
            )
        )
        rows = "\n".join(
            feed_row(dict(a, href="../" + a["href"], thumb=("../" + a["thumb"]) if a.get("thumb") else None))
            for a in items
        )
        t = f"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE_NAME}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{esc(og)}">
<meta property="og:locale" content="ja_JP">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" type="application/rss+xml" title="{SITE_NAME}" href="{FEED_URL}">
<link rel="icon" type="image/png" href="../../assets/favicon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../journal.css">
<script type="application/ld+json">{json.dumps(page_ld, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps(bc_ld, ensure_ascii=False)}</script>
</head>
<body>

<header class="jnav">
  <div class="wrap jnav-inner">
    <a href="../index.html" class="jnav-logo"><img src="../../assets/journal-logo-black.png" alt="610 Basketball Journal"></a>
    <button class="jnav-toggle" aria-label="メニュー">☰</button>
    <nav class="jnav-links">
{nav}
      <a href="../../index.html" class="jnav-home">610 — SIXTEN</a>
    </nav>
  </div>
</header>

<main>
  <section class="site-intro wrap">
    <h1>{esc(h['h1'])}<small>{esc(h['en'])}</small></h1>
    <p>{esc(h['desc'])}</p>
  </section>

  <section class="feed wrap">
    <div class="sec-label">{cat} STORIES</div>
    <div class="journal-count">{cat} — {len(items)} STORIES</div>
    <div class="feed-list">
{rows}
    </div>
  </section>
</main>

<footer>
  <div class="wrap footer-inner">
    <img src="../../assets/logo-white-800.png" alt="610">
    <p class="footer-about">{esc(FOOTER_ABOUT)}</p>
    <small>© 2026 610 — sixten. ALL RIGHTS RESERVED.</small>
  </div>
</footer>

<script>
document.querySelector('.jnav-toggle').addEventListener('click', () => document.querySelector('.jnav-links').classList.toggle('open'));
</script>
</body>
</html>
"""
        (JOURNAL / h["slug"]).mkdir(exist_ok=True)
        p = JOURNAL / h["slug"] / "index.html"
        # 計測タグ・ポリシー導線・?v= を先に付けて書く(後段と同じ結果になり、毎回の見かけの「更新」を防ぐ)
        t = analytics_html(t, p.relative_to(SITE).as_posix(), ga4_id())
        write_if_changed(p, version_urls(t, p.parent))


# ---------------------------------------------------------------- 共通head
def ensure_common_head(t: str) -> str:
    # robots: スニペット/プレビュー制限なし(AI検索・リッチリザルト向け)
    t = t.replace(
        '<meta name="robots" content="max-image-preview:large">',
        '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    )
    if 'type="application/rss+xml"' not in t:
        link = f'<link rel="alternate" type="application/rss+xml" title="{SITE_NAME}" href="{FEED_URL}">\n'
        t = t.replace('<link rel="icon"', link + '<link rel="icon"', 1)
    return t


# ---------------------------------------------------------------- 3. 記事ページ
JST = dt.timezone(dt.timedelta(hours=9))
_shallow: bool | None = None


def publish_time(p: Path, day: str) -> str | None:
    """記事の公開時刻(JST・秒まで)。日付だけの datePublished を一度だけ時刻付きにするために使う(2026-09-15 施策6)。
    未コミット=今まさに公開する記事は現在時刻、コミット済みは最初に git に入った時刻。
    記事の日付と JST の日が一致しない時(一括移行した古い記事など)は時刻を作らず None。
    shallow clone(GitHub Actions)では履歴が無いので何もしない"""
    import subprocess
    global _shallow
    root = p.parent
    try:
        if _shallow is None:
            _shallow = subprocess.run(["git", "rev-parse", "--is-shallow-repository"], cwd=root,
                                      capture_output=True, text=True).stdout.strip() != "false"
        tracked = subprocess.run(["git", "ls-files", "--error-unmatch", p.name], cwd=root,
                                 capture_output=True, text=True).returncode == 0
        if not tracked:
            ts = dt.datetime.now(JST)
        elif _shallow:
            return None
        else:
            out = subprocess.run(["git", "log", "--diff-filter=A", "--format=%aI", "--", p.name], cwd=root,
                                 capture_output=True, text=True).stdout.split()
            if not out:
                return None
            ts = dt.datetime.fromisoformat(out[-1]).astimezone(JST)
    except OSError:
        return None
    ts = ts.replace(microsecond=0)
    return ts.isoformat() if ts.date().isoformat() == day else None


REL_TOKEN = re.compile(r"[ァ-ヴー・]{3,}|[A-Za-z][A-Za-z0-9]{2,}|[一-龥々]{2,}")
REL_STOP = {
    "バスケ", "バスケットボール", "NBA", "Bリーグ", "日本", "シーズン", "発表", "開催", "選手", "チーム",
    "契約", "ESPN", "発売", "公式", "報道", "決定", "情報", "まとめ", "記事", "モデル", "リーグ",
    # 数字・汎用語(話題の近さを表さない)
    "得点", "平均", "リバウンド", "アシスト", "試合", "出場", "参加", "大会", "現在", "所属", "東京",
    "代表", "優勝", "加入", "移籍", "合意", "昇格", "就任", "記者", "報じ", "明らか", "予定", "今季", "昨季",
    # 情報源・記者名
    "hoopshype", "michael", "scotto", "shams", "charania", "stein", "marc", "jake", "fischer", "brian",
    "windhorst", "haynes", "chris", "bobby", "marks", "amick", "spears", "the", "athletic", "nick", "depaula",
}
REL_MIN_SCORE = 3.0
_rel_index: dict[int, tuple[dict[str, set[str]], dict[str, float]]] = {}


def rel_terms(a: dict) -> set[str]:
    text = f"{a.get('title', '')} {a.get('excerpt', '')}"
    out = set()
    for w in REL_TOKEN.findall(text):
        w = w.strip("ー・")
        if len(w) >= 2 and w not in REL_STOP and w.upper() not in REL_STOP:
            out.add(w.lower() if w.isascii() else w)
    return out


def related_picks(a: dict, arts: list[dict], k: int = 3) -> list[dict]:
    """共通語の IDF 合計(ありふれた語は除外)+同カテゴリ0.5 で近い記事。スコアが低い枠は従来ロジックで埋める"""
    key = id(arts)
    if key not in _rel_index:
        import math
        terms = {x["href"]: rel_terms(x) for x in arts}
        df: dict[str, int] = {}
        for ts in terms.values():
            for w in ts:
                df[w] = df.get(w, 0) + 1
        n = len(arts)
        idf = {w: math.log(n / c) for w, c in df.items() if c < n * 0.2}
        _rel_index.clear()
        _rel_index[key] = (terms, idf)
    terms, idf = _rel_index[key]
    mine = terms[a["href"]]
    others = [x for x in arts if x["href"] != a["href"]]
    scored = []
    for i, x in enumerate(others):
        s = sum(idf.get(w, 0) for w in mine & terms[x["href"]])
        if s <= 0:
            continue
        if x["cat"] == a["cat"]:
            s += 0.5
        scored.append((s, -i, x))
    scored.sort(key=lambda t: (t[0], t[1]), reverse=True)
    picks = [x for s, _, x in scored if s >= REL_MIN_SCORE][:k]
    same = [x for x in others if x["cat"] == a["cat"]]
    rest = [x for x in others if x["cat"] != a["cat"]]
    for x in same + rest:
        if len(picks) >= k:
            break
        if x not in picks:
            picks.append(x)
    return picks


def build_article(a: dict, arts: list[dict]) -> None:
    p = JOURNAL / a["href"]
    if not p.exists():
        warn(f"{a['href']}: journal.js にあるがファイルが無い")
        return
    t = read(p)
    t = ensure_common_head(t)

    # 日時: datePublished を時刻+タイムゾーン付きに(一度だけ)。dateModified は本文を書き足した時だけ上げる運用
    m = re.search(r'"datePublished": ?"([^"]*)"', t)
    if m and len(m.group(1)) == 10 and m.group(1) == a["iso"]:
        ts = publish_time(p, a["iso"])
        if ts:
            t = t.replace(m.group(0), f'"datePublished": "{ts}"', 1)
            t = re.sub(r'"dateModified": ?"' + re.escape(a["iso"]) + '"', f'"dateModified": "{ts}"', t, count=1)
    pub = re.search(r'"datePublished": ?"([^"]*)"', t)
    mod = re.search(r'"dateModified": ?"([^"]*)"', t)
    if pub:
        a["published"] = pub.group(1)
        t = re.sub(r'(<meta property="article:published_time" content=")[^"]*(">)',
                   lambda x: x.group(1) + pub.group(1) + x.group(2), t, count=1)
    if mod:
        a["lastmod"] = mod.group(1)
        if 'property="article:modified_time"' in t:
            t = re.sub(r'(<meta property="article:modified_time" content=")[^"]*(">)',
                       lambda x: x.group(1) + mod.group(1) + x.group(2), t, count=1)
        else:
            t = re.sub(r'(<meta property="article:published_time" content="[^"]*">\n)',
                       lambda x: x.group(1) + f'<meta property="article:modified_time" content="{mod.group(1)}">\n',
                       t, count=1)

    # article:section
    if 'property="article:section"' not in t:
        t = re.sub(
            r'(<meta property="article:published_time" content="[^"]*">\n)',
            lambda m: m.group(1) + f'<meta property="article:section" content="{esc(a["cat"])}">\n',
            t,
            count=1,
        )

    # BreadcrumbList JSON-LD
    if '"BreadcrumbList"' not in t:
        bc = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": ORG_NAME, "item": BASE + "/"},
                {"@type": "ListItem", "position": 2, "name": SITE_NAME, "item": BASE + "/journal/"},
                {"@type": "ListItem", "position": 3, "name": a["cat"], "item": f"{BASE}/journal/?cat={a['cat']}"},
                {"@type": "ListItem", "position": 4, "name": a["title"], "item": a["url"]},
            ],
        }
        t = t.replace(
            "</head>",
            '<script type="application/ld+json">' + json.dumps(bc, ensure_ascii=False) + "</script>\n</head>",
            1,
        )

    # 表示パンくず
    if 'class="crumbs"' not in t:
        crumbs = (
            '  <nav class="crumbs" aria-label="現在地">'
            f'<a href="../index.html">{esc(ORG_NAME)}</a><span>/</span>'
            f'<a href="index.html">{esc(SITE_NAME)}</a><span>/</span>'
            f'<a href="index.html?cat={esc(a["cat"])}">{esc(a["cat"])}</a></nav>\n'
        )
        t, n = re.subn(r'(<main class="article-body">\n)', lambda m: m.group(1) + crumbs, t, count=1)
        if not n:
            warn(f"{a['href']}: <main class=\"article-body\"> が見つからずパンくずを入れられない")

    # 関連記事の静的化(話題の近さ→足りない枠は同カテゴリ優先→新しい順・2026-09-15 施策5)
    rel = "\n".join(rel_card(x) for x in related_picks(a, arts))
    if "<!-- STATIC-RELATED:START -->" not in t:
        t, n = re.subn(
            r'<div class="related-grid" id="related-grid">\s*</div>',
            '<div class="related-grid" id="related-grid"><!-- STATIC-RELATED:START -->\n<!-- STATIC-RELATED:END --></div>',
            t,
            count=1,
        )
        if not n:
            warn(f"{a['href']}: related-grid(空)が見つからない")
    t = between(t, "<!-- STATIC-RELATED:START -->", "<!-- STATIC-RELATED:END -->", rel)

    # 記事動画(2026-09-20): 本文の後・「JOURNAL一覧へ」の前に置く
    vhtml = article_video(a)
    if "<!-- ARTICLE-VIDEO:START -->" not in t:
        t, n = re.subn(r'(\n  <nav class="article-nav">)',
                       '\n  <!-- ARTICLE-VIDEO:START -->\n  <!-- ARTICLE-VIDEO:END -->\\1', t, count=1)
        if not n and vhtml:
            warn(f"{a['href']}: <nav class=\"article-nav\"> が見つからず動画を入れられない")
    t = between(t, "<!-- ARTICLE-VIDEO:START -->", "<!-- ARTICLE-VIDEO:END -->", vhtml)

    # フッター説明文
    if 'class="footer-about"' not in t:
        t = t.replace(
            '<img src="../assets/logo-white-800.png" alt="610">\n',
            '<img src="../assets/logo-white-800.png" alt="610">\n'
            f'    <p class="footer-about">{esc(FOOTER_ABOUT)}</p>\n',
            1,
        )

    # 空alt: figcaption から補完
    def fix_alt(m: re.Match) -> str:
        cap = re.sub(r"<[^>]+>", "", m.group(3))
        cap = re.sub(r"^画像[:：]\s*", "", cap).strip()
        alt = cap.split("。")[0][:120] or a["title"]
        return f'{m.group(1)} alt="{esc(alt)}"{m.group(2)}<figcaption>{m.group(3)}</figcaption>'

    t = re.sub(r'(<img src="[^"]*") alt=""(>\s*)<figcaption>(.*?)</figcaption>', fix_alt, t, flags=re.S)

    # 画像(2026-09-15 施策9): 最初の見出しより前にある冒頭写真は最優先で読み込む(LCP)・og:image に実寸
    t = re.sub(r'(<div class="prose">(?:(?!<h2)(?!fetchpriority).)*?<figure>\s*<img)(?=\s)(?![^>]*(?:fetchpriority|loading=))',
               r'\1 fetchpriority="high"', t, count=1, flags=re.S)
    og = re.search(r'<meta property="og:image" content="([^"]+)">\n', t)
    t = re.sub(r'<meta property="og:image:(?:width|height)" content="\d+">\n', "", t)
    if og:
        op = resolve_local(og.group(1).split("?")[0], p.parent)
        dims = img_dims(op) if op else None
        if dims:
            t = t.replace(og.group(0), og.group(0) + f'<meta property="og:image:width" content="{dims[0]}">\n'
                          f'<meta property="og:image:height" content="{dims[1]}">\n', 1)

    # 検証
    if f'<link rel="canonical" href="{a["url"]}">' not in t:
        warn(f"{a['href']}: canonical が {a['url']} と一致しない")
    if '"@type": "NewsArticle"' not in t and '"@type":"NewsArticle"' not in t:
        warn(f"{a['href']}: NewsArticle JSON-LD が無い")
    if f"| {SITE_NAME}</title>" not in t:
        warn(f"{a['href']}: title が「… | {SITE_NAME}」形式でない")
    if 'name="description"' not in t:
        warn(f"{a['href']}: meta description が無い")

    write_if_changed(p, t)


# ---------------------------------------------------------------- 4. sitemap
def build_sitemap(arts: list[dict]) -> None:
    newest = max(a["iso"] for a in arts)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        f"  <url><loc>{BASE}/</loc><lastmod>{newest}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>",
        f"  <url><loc>{BASE}/journal/</loc><lastmod>{newest}</lastmod><changefreq>hourly</changefreq><priority>1.0</priority></url>",
    ]
    for c in HUBS:
        cat_newest = max((a["iso"] for a in arts if a["cat"] == c), default=newest)
        lines.append(f"  <url><loc>{hub_url(c)}</loc><lastmod>{cat_newest}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>")
    for a in arts:
        lines.append(f"  <url><loc>{a['url']}</loc><lastmod>{a.get('lastmod', a['iso'])}</lastmod><priority>0.8</priority></url>")
    for m in sorted((SITE / "media").glob("*.html")):
        lines.append(f"  <url><loc>{BASE}/media/{m.name}</loc><priority>0.5</priority></url>")
    if (SITE / "privacy.html").exists():
        lines.append(f"  <url><loc>{BASE}/privacy.html</loc><changefreq>yearly</changefreq><priority>0.2</priority></url>")
    lines.append("</urlset>\n")
    write_if_changed(SITE / "sitemap.xml", "\n".join(lines))


NEWS_WINDOW = dt.timedelta(hours=48)


def build_news_sitemap(arts: list[dict]) -> None:
    """Google News 用サイトマップ(2026-09-15 施策12)。Googleの決まりで公開48時間以内の記事だけ載せる。
    deploy.yml が公開のたびに build_seo.py を回すので、古い記事はその時に自然に外れる。
    日付だけの記事は JST 0時公開として扱う(遅く見積もらない=窓から早めに外れる側)"""
    now = dt.datetime.now(JST)
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ]
    for a in arts:
        pub = a.get("published") or a["iso"]
        try:
            ts = dt.datetime.fromisoformat(pub if "T" in pub else pub + "T00:00:00+09:00")
        except ValueError:
            continue
        if not (dt.timedelta(0) <= now - ts <= NEWS_WINDOW):
            continue
        lines.append(
            f"  <url><loc>{a['url']}</loc><news:news>"
            f"<news:publication><news:name>{esc(SITE_NAME)}</news:name><news:language>ja</news:language></news:publication>"
            f"<news:publication_date>{pub}</news:publication_date><news:title>{esc(a['title'])}</news:title>"
            "</news:news></url>"
        )
    lines.append("</urlset>\n")
    write_if_changed(SITE / "news-sitemap.xml", "\n".join(lines))


# ---------------------------------------------------------------- 5. RSS
def build_feed(arts: list[dict]) -> None:
    items = []
    for a in arts[:30]:
        img = f'\n      <enclosure url="{esc(a["abs_thumb"])}" type="image/jpeg" length="0"/>' if a["abs_thumb"] else ""
        items.append(
            "    <item>\n"
            f"      <title>{esc(a['title'])}</title>\n"
            f"      <link>{a['url']}</link>\n"
            f'      <guid isPermaLink="true">{a["url"]}</guid>\n'
            f"      <pubDate>{rfc822(a['iso'])}</pubDate>\n"
            f"      <category>{esc(a['cat'])}</category>\n"
            f"      <description>{esc(a['excerpt'])}</description>{img}\n"
            "    </item>"
        )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n'
        "  <channel>\n"
        f"    <title>{SITE_NAME}（610 JOURNAL）</title>\n"
        f"    <link>{BASE}/journal/</link>\n"
        f"    <description>{esc(SITE_DESC)}</description>\n"
        "    <language>ja</language>\n"
        f"    <lastBuildDate>{rfc822(max(a['iso'] for a in arts))}</lastBuildDate>\n"
        f'    <atom:link href="{FEED_URL}" rel="self" type="application/rss+xml"/>\n'
        f"    <image><url>{BASE}/assets/journal-logo-black.png</url><title>{SITE_NAME}</title><link>{BASE}/journal/</link></image>\n"
        + "\n".join(items)
        + "\n  </channel>\n</rss>\n"
    )
    write_if_changed(SITE / "feed.xml", xml)


# ---------------------------------------------------------------- 6. llms.txt
def build_llms(arts: list[dict]) -> None:
    lines = [
        "# 610バスケットボールジャーナル（610 JOURNAL） / 610 — sixten",
        "",
        f"> {SITE_DESC}",
        "",
        "## 610（シックステン）とは",
        "610（シックステン）は、バスケットボールとカルチャーの交差点からブランドの物語をつくる日本（東京）のメディアエージェンシー。"
        "運営メディアは「610バスケットボールジャーナル」（本サイト）、動画メディア「クリスのバスケ日記」、トーク番組「POST UP PODCAST」。",
        "",
        "## 主要ページ",
        f"- [610バスケットボールジャーナル 記事一覧]({BASE}/journal/): 全記事のインデックス",
        f"- [610 — sixten]({BASE}/): エージェンシー本体",
        f"- [クリスのバスケ日記]({BASE}/media/chris-basketball-diary.html): NBAとバスケの「今」を毎日届ける動画メディア",
        f"- [POST UP PODCAST]({BASE}/media/postup.html): バスケにルーツを持つ人たちの物語を深掘りするトーク番組",
        f"- [STARTING 5IVE]({BASE}/media/starting5ive.html): 5人のNBAクリエイターがバスケを語り合うYouTubeチャンネル（キャンプ「Be 5IVE CAMP」も主催）",
        f"- [RSSフィード]({FEED_URL})",
        f"- [サイトマップ]({BASE}/sitemap.xml)",
        "",
        "## カテゴリ",
    ]
    for c in CATS:
        n = sum(1 for a in arts if a["cat"] == c)
        link = hub_url(c) if c in HUBS else f"{BASE}/journal/?cat={c}"
        lines.append(f"- [{c}]({link}): {CAT_LABEL[c]}（{n}本）")
    lines += [
        "",
        "## 記事の特徴（情報の信頼性）",
        "- NBA速報は Shams Charania（ESPN）/ Chris Haynes（NBA on Prime）/ Michael Scotto（HoopsHype）など一次ソースを明記して事実ベースで整理",
        "- 国内バスケはプレスリリース（PR TIMES等）の一次情報を出典付きで記事化",
        "- すべての記事末尾に出典URLを明記。記事は日本語",
        "",
        f"## 最新記事（全{len(arts)}本のうち最新30本・新しい順）",
    ]
    for a in arts[:30]:
        lines.append(f"- [{a['title']}]({a['url']}) — {a['cat']} / {a['iso']}: {a['excerpt']}")
    lines.append("")
    write_if_changed(SITE / "llms.txt", "\n".join(lines))


# ---------------------------------------------------------------- 7. キャッシュバスター
VERSIONED_EXT = ("jpg", "jpeg", "png", "webp", "gif", "svg", "css", "js")
_hash_cache: dict[Path, str] = {}

# 引用符で囲まれた「ローカル資産のURLだけ」の文字列。末尾に既存の ?v=… があれば捨てて付け直す。
# 例: "../assets/journal-081-hero.jpg?v=20260905" / "journal.js?v=202609050809" / "https://sixten.jp/assets/og-default.jpg"
_URL_RE = re.compile(
    r'(?P<q>["\'])'
    r"(?P<url>(?:" + re.escape(BASE) + r"/|\.\./|\./|/)?[A-Za-z0-9_][A-Za-z0-9_./-]*\.(?:" + "|".join(VERSIONED_EXT) + r"))"
    r"(?:\?v=[^\"']*)?"
    r"(?P=q)"
)


def asset_hash(p: Path) -> str:
    """ファイル内容の md5 先頭10桁。同じ内容なら同じ値(冪等)、差し替えれば必ず変わる"""
    if p not in _hash_cache:
        _hash_cache[p] = hashlib.md5(p.read_bytes()).hexdigest()[:10]
    return _hash_cache[p]


def resolve_local(url: str, base_dir: Path) -> Path | None:
    """URL文字列を site/ 配下の実ファイルに解決する。外部URLや存在しないファイルは None"""
    if url.startswith(BASE + "/"):
        p = SITE / url[len(BASE) + 1 :]
    elif url.startswith("/"):
        p = SITE / url[1:]
    else:
        p = base_dir / url
    p = p.resolve()
    try:
        p.relative_to(SITE.resolve())
    except ValueError:
        return None
    return p if p.is_file() else None


def version_urls(text: str, base_dir: Path) -> str:
    def sub(m: re.Match) -> str:
        url = m.group("url")
        p = resolve_local(url, base_dir)
        if p is None:
            return m.group(0)
        q = m.group("q")
        return f"{q}{url}?v={asset_hash(p)}{q}"

    return _URL_RE.sub(sub, text)


def version_journal_js() -> None:
    """記事台帳(journal.js)の thumb 等を先に版付けする。以降の一覧/関連カード/feed は台帳から生成されるので自動で伝播する"""
    p = JOURNAL / "journal.js"
    write_if_changed(p, version_urls(read(p), JOURNAL))


def version_html_files() -> None:
    for p in sorted(list(SITE.glob("*.html")) + list(JOURNAL.glob("*.html")) + list(JOURNAL.glob("*/index.html")) + list((SITE / "media").glob("*.html"))):
        write_if_changed(p, version_urls(read(p), p.parent))


# ---------------------------------------------------------------- 画像の実寸(2026-09-15 施策9)
# 記事写真の <img> に width/height を付けると、読み込み前に高さの枠が確保されてレイアウトがずれない(CLS)。
# 表示幅は CSS(width:100%; height:auto / サムネは object-fit)が決めるので見た目は変わらない。
# ロゴは CSS が高さだけ指定しているため付けない(付けると横幅が実寸になり崩れる)。Pillow 不要の自前読み取り。
_dim_cache: dict[Path, tuple[int, int] | None] = {}
_IMG_TAG_RE = re.compile(r"<img\b[^>]*>")
_CONTENT_IMG_RE = re.compile(r"assets/journal-(?!logo)[^\"?]+\.(?:jpe?g|png)(?:\?|$)", re.I)


def img_dims(p: Path) -> tuple[int, int] | None:
    if p in _dim_cache:
        return _dim_cache[p]
    dims = None
    b = p.read_bytes()
    if b[:8] == b"\x89PNG\r\n\x1a\n":
        dims = (int.from_bytes(b[16:20], "big"), int.from_bytes(b[20:24], "big"))
    elif b[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(b):
            if b[i] != 0xFF:
                i += 1
                continue
            mk = b[i + 1]
            if mk in (0xD8, 0x01) or 0xD0 <= mk <= 0xD7 or mk == 0xFF:
                i += 1 if mk == 0xFF else 2
                continue
            seg = int.from_bytes(b[i + 2 : i + 4], "big")
            if mk in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                dims = (int.from_bytes(b[i + 7 : i + 9], "big"), int.from_bytes(b[i + 5 : i + 7], "big"))
                break
            i += 2 + seg
    _dim_cache[p] = dims if dims and all(dims) else None
    return _dim_cache[p]


def add_img_dims(text: str, base_dir: Path) -> str:
    def sub(m: re.Match) -> str:
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        if not src or not _CONTENT_IMG_RE.search(src.group(1)):
            return tag
        p = resolve_local(src.group(1).split("?")[0], base_dir)
        dims = img_dims(p) if p else None
        if not dims:
            return tag
        tag = re.sub(r'\s(?:width|height)="\d+"', "", tag)
        return tag.replace(src.group(0), f'{src.group(0)} width="{dims[0]}" height="{dims[1]}"', 1)

    return _IMG_TAG_RE.sub(sub, text)


# ---------------------------------------------------------------- 8. アクセス解析(GA4)
# 広告営業に出す「月間PV/UU」を貯めるための計測タグ。測定IDは analytics_config.json の1行だけで、
# 入れれば site 配下の全HTMLに入り、空にすれば全HTMLから消える(どちらも冪等)。
ANALYTICS_CONFIG = Path(__file__).resolve().parent / "analytics_config.json"
GA4_START = "<!-- ga4:start build_seo.py が自動生成。手で編集しない -->"
GA4_END = "<!-- ga4:end -->"
# 行頭のインデントごと消す(消し残すと再ビルドのたびに空白が増えて冪等でなくなる)
GA4_BLOCK_RE = re.compile(r"[ \t]*" + re.escape(GA4_START) + r".*?" + re.escape(GA4_END) + r"\n?", re.S)
GA4_ID_RE = re.compile(r"^G-[A-Z0-9]{4,20}$")

LEGAL_START = "<!-- legal:start build_seo.py が自動生成 -->"
LEGAL_END = "<!-- legal:end -->"
LEGAL_BLOCK_RE = re.compile(r"[ \t]*" + re.escape(LEGAL_START) + r".*?" + re.escape(LEGAL_END) + r"\n?", re.S)
# ホームの著作権表示は <small>© <span id="year">2026</span> …</small> なので内側のタグごと拾う
COPYRIGHT_RE = re.compile(r"(<small>©.*?</small>\n)")

# 計測タグを入れないファイル(Search Console の所有権確認用HTMLは中身を変えると確認が外れる)
SKIP_HTML = re.compile(r"^google[0-9a-f]+\.html$")
# ポリシー導線を置かないページ(TIP OFFはアプリ側の独立したポリシー。610サイトの導線を混ぜない)
SKIP_LEGAL = {"tipoff/privacy.html", "privacy.html"}


def ga4_id() -> str:
    """analytics_config.json から測定IDを読む。未設定・書式違いは空扱い(=タグを入れない)"""
    if not ANALYTICS_CONFIG.exists():
        return ""
    try:
        mid = (json.loads(read(ANALYTICS_CONFIG)).get("ga4_measurement_id") or "").strip()
    except json.JSONDecodeError:
        warn("analytics_config.json が壊れている(JSONとして読めない) → 計測タグはスキップ")
        return ""
    if mid and not GA4_ID_RE.match(mid):
        warn(f"測定IDの書式が違う: {mid!r}（G-XXXXXXXXXX の形）→ 計測タグはスキップ")
        return ""
    return mid


def ga4_block(mid: str) -> str:
    return (
        f"{GA4_START}\n"
        f'<script async src="https://www.googletagmanager.com/gtag/js?id={mid}"></script>\n'
        "<script>\n"
        "window.dataLayer = window.dataLayer || [];\n"
        "function gtag(){dataLayer.push(arguments);}\n"
        "gtag('js', new Date());\n"
        f"gtag('config', '{mid}');\n"
        "</script>\n"
        f"{GA4_END}\n"
    )


def legal_block() -> str:
    """フッターのプライバシーポリシー導線。Cookie利用を告知する先が無いと広告審査で止まるので全ページに置く"""
    return (
        f"    {LEGAL_START}\n"
        f'    <small class="footer-legal" style="display:block;margin-top:8px;opacity:.6">'
        f'<a href="/privacy.html">プライバシーポリシー</a></small>\n'
        f"    {LEGAL_END}\n"
    )


def analytics_html(t: str, rel: str, mid: str) -> str:
    # --- 計測タグ: 既存ブロックを消してから、IDがあるときだけ </head> 直前に入れ直す
    t = GA4_BLOCK_RE.sub("", t)
    if mid:
        if "</head>" not in t:
            warn(f"{rel}: </head> が無いので計測タグを入れられない")
        else:
            t = t.replace("</head>", ga4_block(mid) + "</head>", 1)

    # --- プライバシーポリシー導線: フッターの著作権表示の直後(1回だけ)
    t = LEGAL_BLOCK_RE.sub("", t)
    if rel not in SKIP_LEGAL:
        m = COPYRIGHT_RE.search(t)
        if m:
            t = t[: m.end()] + legal_block() + t[m.end() :]
        else:
            warn(f"{rel}: フッターの著作権表示が見つからずポリシー導線を置けない")
    return t


def apply_analytics(mid: str) -> None:
    """site配下の全HTMLに 計測タグ + プライバシーポリシー導線 を反映する"""
    targets = [p for p in sorted(SITE.rglob("*.html")) if not SKIP_HTML.match(p.name)]
    for p in targets:
        t = apply_hub_links(read(p))
        write_if_changed(p, analytics_html(t, p.relative_to(SITE).as_posix(), mid))

    print(f"ANALYTICS: {'測定ID ' + mid if mid else '測定ID 未設定(タグなし)'} / 対象 {len(targets)}ページ")


# ---------------------------------------------------------------- main
def main() -> int:
    version_journal_js()
    arts = load_articles()
    print(f"ARTICLES: {len(arts)}本 (最新 {arts[0]['href']})")
    build_journal_index(arts)
    build_home(arts)
    build_hubs(arts)
    for a in arts:
        build_article(a, arts)
    build_sitemap(arts)
    build_news_sitemap(arts)
    build_feed(arts)
    build_llms(arts)
    apply_analytics(ga4_id())
    version_html_files()
    uniq = list(dict.fromkeys(changed))
    print(f"更新: {len(uniq)}ファイル")
    for c in uniq[:80]:
        print("  - " + c)
    if warnings:
        print(f"警告: {len(warnings)}件（上記 ! 行）")
    return 0


if __name__ == "__main__":
    sys.exit(main())
