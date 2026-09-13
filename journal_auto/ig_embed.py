#!/usr/bin/env python3
"""Instagram投稿を記事に「引用」として埋め込むHTMLブロックを作る（2026-09-13設置）。

なぜこれが要るか
----------------
IGの写真をダウンロードして自サイトに置くのは、クレジットを書いても著作権の許可には
ならない（権利はチーム/カメラマン/リーグ側にある）。一方、IG公式の埋め込みは
写真・動画がIGのサーバから配信され、投稿者のアカウント名と元投稿へのリンクが
必ず表示される形なので、IG側が用意した正規の引用ルートになる。

方式（実測で確定・2026-09-13）
------------------------------
- Meta の `embed.js` は読み込まない。iframe だけで完結させる。
  → sixten.jp に第三者のトラッキングJSを入れない。静的サイトのまま動く。
- 高さは IG の iframe 自身が `{"type":"MEASURE","details":{"height":N}}` を
  postMessage してくるので、`journal.js` の initIgEmbeds() がそれを見て合わせる。
  （ログアウトのまっさらなChromeで実測: MEASURE height=971 が届く）
- `https://www.instagram.com/p/<shortcode>/embed/captioned/` は
  **ログインなし・アクセストークンなし**で描画されることを実測済み。
  oEmbed API（graph.facebook.com）はトークンが要るが、こちらは要らない。

使い方
------
    python3 journal_auto/ig_embed.py <IG投稿URL> [--verify] [--no-caption]
        [--note "この埋め込みが何を示すかの一言"] [--width 540]

    --verify   ログアウト状態のheadless Chromeで実際に描画して、
               公開投稿か・埋め込みが生きているかを確認してから出力する（推奨）
    --check    記事HTML内の既存の埋め込みを全部 --verify し直す
               例: python3 journal_auto/ig_embed.py --check site/journal/

出力されたHTMLブロックを記事の `<div class="prose">` の中に貼る。
ルールは PROMPT_CLOUD.md §3c を見ること。
"""

import argparse
import html
import json
import os
import re
import select
import shutil
import subprocess
import sys
import tempfile
import time

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]

# 投稿URLから shortcode を取る。/p/ (写真・カルーセル) /reel/ (リール) /tv/ (IGTV) の3種。
URL_RE = re.compile(
    r"instagram\.com/(?:[A-Za-z0-9_.]+/)?(p|reel|reels|tv)/([A-Za-z0-9_-]+)"
)

# 描画済みDOMから投稿者を拾う。IGが埋め込み内のプロフィールリンクに必ず付ける印。
OWNER_RE = re.compile(
    r'href="https://www\.instagram\.com/([A-Za-z0-9_.]+)/?\?utm_source=ig_embed'
)

# 埋め込みが正常に描画できた時だけDOMに出るクラス名（実測）。
RENDER_MARKERS = ("EmbeddedMedia", "EmbedVideo", "EmbeddedMediaImage")


def find_chrome():
    for p in CHROME_CANDIDATES:
        if os.path.exists(p):
            return p
    for name in ("google-chrome", "chromium", "chromium-browser"):
        p = shutil.which(name)
        if p:
            return p
    return None


def parse_url(url):
    """投稿URL → (kind, shortcode)。取れなければ SystemExit。"""
    m = URL_RE.search(url)
    if not m:
        raise SystemExit(
            f"IGの投稿URLとして読めない: {url}\n"
            "  例: https://www.instagram.com/p/XXXXXXXXXXX/ "
            "または https://www.instagram.com/reel/XXXXXXXXXXX/"
        )
    kind = m.group(1)
    kind = "reel" if kind in ("reel", "reels") else kind
    return kind, m.group(2)


def embed_src(kind, shortcode, captioned=True):
    tail = "embed/captioned/" if captioned else "embed/"
    return f"https://www.instagram.com/{kind}/{shortcode}/{tail}"


def permalink(kind, shortcode):
    return f"https://www.instagram.com/{kind}/{shortcode}/"


def render(url, budget_ms=15000, window="600,900", limit=120):
    """ログアウトのまっさらなプロファイルで url を描画し、DOMを返す。

    クリスの普段のChrome(9222)はIGにログインしている可能性があるので絶対に使わない。
    ログイン済みで見えても、読者(匿名)に見えなければ意味がないため。

    Chrome 152 の headless は --dump-dom を書き出した後もプロセスが終了しない
    （example.com でも60秒居座るのを実測・2026-09-13）。終了を待つと必ずタイムアウトするので、
    stdout を読みながら `</html>` まで届いた時点でこちらから Chrome を止める。
    """
    chrome = find_chrome()
    if not chrome:
        raise SystemExit("Chrome が見つからないので --verify できない")
    with tempfile.TemporaryDirectory(prefix="ig_embed_") as prof:
        cmd = [
            chrome,
            "--headless=new",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            f"--user-data-dir={prof}",
            f"--timeout={budget_ms}",
            f"--window-size={window}",
            "--hide-scrollbars",
            "--dump-dom",
            url,
        ]
        proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
        buf = bytearray()
        deadline = time.monotonic() + limit
        try:
            while True:
                left = deadline - time.monotonic()
                if left <= 0:
                    raise SystemExit("Chrome の描画がタイムアウトした")
                ready, _, _ = select.select([proc.stdout], [], [], min(left, 1.0))
                if not ready:
                    continue
                chunk = os.read(proc.stdout.fileno(), 65536)
                if not chunk:
                    break  # Chrome が自分で終了した
                buf += chunk
                if bytes(buf).rstrip().endswith(b"</html>"):
                    break
        finally:
            if proc.poll() is None:
                proc.kill()
            proc.wait()
    return buf.decode("utf-8", "replace")


def verify(kind, shortcode, captioned=True):
    """埋め込みが匿名で描画できるか実際に確かめる。

    戻り: (ok: bool, owner: str|None, reason: str)
    """
    dom = render(embed_src(kind, shortcode, captioned))
    if not dom.strip():
        return False, None, "Chromeが何も返さなかった"
    hit = [m for m in RENDER_MARKERS if m in dom]
    owners = OWNER_RE.findall(dom)
    owner = owners[0] if owners else None
    if not hit:
        # 非公開・削除済み・年齢制限などはここに落ちる
        return False, owner, (
            "埋め込みが描画されなかった"
            "（非公開アカウント / 投稿が削除済み / 埋め込み不可の設定 のいずれか）"
        )
    return True, owner, "OK（" + ", ".join(hit) + "）"


def block_html(kind, shortcode, owner=None, note=None, captioned=True, width=540):
    """記事に貼るHTMLブロックを組む。

    figcaption に投稿者と元投稿へのリンクを必ず出す＝引用の出典明示。
    """
    src = embed_src(kind, shortcode, captioned)
    link = permalink(kind, shortcode)
    who = f"@{owner}" if owner else "Instagram"
    title = html.escape(f"Instagram: {who} の投稿")
    # heightは初期値。journal.js の initIgEmbeds() が MEASURE を受けて実寸に直す。
    lines = [
        '<figure class="ig-embed">',
        f'  <iframe class="ig-embed-frame" src="{src}"',
        f'          width="{width}" height="700" loading="lazy" frameborder="0"',
        '          scrolling="no" allowtransparency="true"',
        '          allow="encrypted-media; picture-in-picture; web-share"',
        f'          title="{title}"></iframe>',
    ]
    cap = []
    if note:
        cap.append(html.escape(note))
    cap.append(
        f'出典: <a href="{link}" target="_blank" rel="noopener">{html.escape(who)} '
        "の Instagram投稿</a>（Instagram公式埋め込み）"
    )
    lines.append("  <figcaption>" + "<br>".join(cap) + "</figcaption>")
    lines.append("</figure>")
    return "\n".join(lines)


def cmd_check(target):
    """記事HTML内の既存の埋め込みを全部 --verify し直す。

    投稿者が元投稿を消すと埋め込みは空になるので、定期的に回して腐りを見つける用。
    """
    paths = []
    if os.path.isdir(target):
        for root, _dirs, files in os.walk(target):
            for f in files:
                if f.endswith(".html"):
                    paths.append(os.path.join(root, f))
    else:
        paths = [target]

    found = {}
    for p in sorted(paths):
        try:
            with open(p, encoding="utf-8") as fh:
                body = fh.read()
        except OSError:
            continue
        for m in re.finditer(
            r'class="ig-embed-frame"\s+src="https://www\.instagram\.com/'
            r"(p|reel|tv)/([A-Za-z0-9_-]+)/embed",
            body,
        ):
            found.setdefault((m.group(1), m.group(2)), []).append(p)

    if not found:
        print("埋め込みは1件も見つからなかった")
        return 0

    bad = 0
    for (kind, sc), files in found.items():
        ok, owner, reason = verify(kind, sc)
        mark = "OK " if ok else "NG "
        where = ", ".join(os.path.basename(f) for f in files)
        print(f"{mark} {kind}/{sc}  owner=@{owner or '?'}  [{where}]  {reason}")
        if not ok:
            bad += 1
    print(f"\n合計 {len(found)} 件 / 落ちている埋め込み {bad} 件")
    return 1 if bad else 0


def main():
    ap = argparse.ArgumentParser(
        description="Instagram投稿の引用埋め込みHTMLを作る（PROMPT_CLOUD.md §3c）"
    )
    ap.add_argument("url", nargs="?", help="IGの投稿URL（/p/ か /reel/）")
    ap.add_argument("--verify", action="store_true",
                    help="ログアウトのheadless Chromeで描画確認してから出力する")
    ap.add_argument("--no-caption", action="store_true",
                    help="IG側のキャプション本文を出さない（/embed/ を使う）")
    ap.add_argument("--note", default=None,
                    help="figcaptionの1行目に出す説明（この埋め込みが何を示すか）")
    ap.add_argument("--width", type=int, default=540, help="iframeのwidth属性（既定540）")
    ap.add_argument("--owner", default=None,
                    help="投稿者のIGユーザー名。--verify なら自動で取れるので普通は不要")
    ap.add_argument("--check", metavar="PATH",
                    help="記事HTML（またはディレクトリ）内の既存埋め込みを検証する")
    args = ap.parse_args()

    if args.check:
        return cmd_check(args.check)

    if not args.url:
        ap.error("投稿URL か --check のどちらかが要る")

    kind, shortcode = parse_url(args.url)
    captioned = not args.no_caption
    owner = args.owner

    if args.verify:
        ok, found_owner, reason = verify(kind, shortcode, captioned)
        owner = owner or found_owner
        print(f"# 検証: {kind}/{shortcode} → {'OK' if ok else 'NG'} / {reason}",
              file=sys.stderr)
        if not ok:
            print("# この投稿は埋め込めない。記事には使わないこと。", file=sys.stderr)
            return 2
        print(f"# 投稿者: @{owner or '取得できず'}", file=sys.stderr)

    print(block_html(kind, shortcode, owner=owner, note=args.note,
                     captioned=captioned, width=args.width))
    return 0


if __name__ == "__main__":
    sys.exit(main())
