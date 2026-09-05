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
  5. site/feed.xml            … RSS 2.0(最新30本)
  6. site/llms.txt            … AI検索向けサイト説明+最新記事一覧
  7. キャッシュバスター(2026-09-05) … journal.js の thumb と全HTML(site/*.html, journal/*.html, media/*.html)内の
                                 ローカル画像/CSS/JS参照(相対・/絶対・https://sixten.jp/絶対)に、ファイル内容の
                                 md5先頭10桁を `?v=` として付与する。同名上書きで写真を差し替えても、URLが変わるので
                                 ブラウザ/Cloudflare/surge のキャッシュに古い画像が残らない。手で `?v=` を書く必要なし。
                                 (css/*.css 内の url() は触らない。書体・CSSは手で触らないルールのため)
  8. 検証: 各記事のcanonical/JSON-LD/title形式を確認し、欠けていれば警告(exit 1にはしない)

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
def build_article(a: dict, arts: list[dict]) -> None:
    p = JOURNAL / a["href"]
    if not p.exists():
        warn(f"{a['href']}: journal.js にあるがファイルが無い")
        return
    t = read(p)
    t = ensure_common_head(t)

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

    # 関連記事の静的化(同カテゴリ優先→新しい順・journal.jsのinitRelatedと同じ)
    others = [x for x in arts if x["href"] != a["href"]]
    same = [x for x in others if x["cat"] == a["cat"]]
    rest = [x for x in others if x not in same]
    rel = "\n".join(rel_card(x) for x in (same + rest)[:3])
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
    for a in arts:
        lines.append(f"  <url><loc>{a['url']}</loc><lastmod>{a['iso']}</lastmod><priority>0.8</priority></url>")
    for m in sorted((SITE / "media").glob("*.html")):
        lines.append(f"  <url><loc>{BASE}/media/{m.name}</loc><priority>0.5</priority></url>")
    lines.append("</urlset>\n")
    write_if_changed(SITE / "sitemap.xml", "\n".join(lines))


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
        f"- [RSSフィード]({FEED_URL})",
        f"- [サイトマップ]({BASE}/sitemap.xml)",
        "",
        "## カテゴリ",
    ]
    for c in CATS:
        n = sum(1 for a in arts if a["cat"] == c)
        lines.append(f"- [{c}]({BASE}/journal/?cat={c}): {CAT_LABEL[c]}（{n}本）")
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
    for p in sorted(list(SITE.glob("*.html")) + list(JOURNAL.glob("*.html")) + list((SITE / "media").glob("*.html"))):
        write_if_changed(p, version_urls(read(p), p.parent))


# ---------------------------------------------------------------- main
def main() -> int:
    version_journal_js()
    arts = load_articles()
    print(f"ARTICLES: {len(arts)}本 (最新 {arts[0]['href']})")
    build_journal_index(arts)
    build_home(arts)
    for a in arts:
        build_article(a, arts)
    build_sitemap(arts)
    build_feed(arts)
    build_llms(arts)
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
