#!/usr/bin/env python3
"""バスケットボール男子・女子日本代表（フル代表）の試合記事を集めて national_feed.json を書く。

.github/workflows/national-poll.yml が毎時実行する。クラウドルーチンの環境からは JBA / バスケットボールキングに
届かないので、ここが取得役になり、ルーチンは PROMPT_CLOUD.md §1e の手順でこのファイルを読んで記事化する。

2026-09-14 設置（クリス指示「日本代表の記事を作成とかできる？？試合のやつ！」→「完全自動で実行して！」）。
取得元:
  A = JBA公式サイトの日本代表ニュース（大会レポート・試合結果。一次情報）
  B = バスケットボールキング（国内ニュースのうち代表の試合結果。試合経過・個人スタッツ・コメントの補助）

著作権の扱い: リポジトリは public なので、記事本文は丸ごと保存しない。
「数字を含む文（スコア・得点・リバウンド等）」「クォーター別スコア行」「短いコメント」だけを抜き出して渡す。
ルーチンはこれを事実の材料にして自分の日本語で書く（転載はしない）。

終了コード: 0 = 正常（新着なしも含む）。新着があれば /tmp/new_national.txt に key を書き、
GITHUB_OUTPUT があれば new=true を出す。
"""
import html
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

FEEDS = [
    # (媒体名, RSS, tier)
    ('日本バスケットボール協会（JBA）', 'https://www.japanbasketball.jp/japan/feed', 'A'),
    ('バスケットボールキング', 'https://basketballking.jp/news/japan/feed', 'B'),
]
FEED_FILE = 'journal_auto/national_feed.json'
SEEN_FILE = 'journal_auto/seen_national.txt'
UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/128 Safari/537.36 610-journal-bot')
MAX_AGE_HOURS = 72

NATIONAL = re.compile(r'日本代表|Akatsuki Japan|AKATSUKI JAPAN')
# 試合の記事か（大会レポート・Window・試合結果・スコア表記・勝敗の語）
GAME = re.compile(r'大会レポート|試合結果|Window\s*\d|Game\s*\d|\d{2,3}\s*[-－–]\s*\d{2,3}|勝利|白星|敗戦|敗れ|黒星|逆転|撃破|下し|破り|決勝|準決勝|ベスト\d|グループ\d位')
# フル代表以外・試合記事ではないもの
EXCLUDE = re.compile(r'U\s?-?1\d|U\s?-?2\d|3x3|3×3|車いす|車椅子|デフ|ユニバーシアード|ワールドユニバーシティ|高校|大学|'
                     r'招集メンバー|メンバー発表|ロスター|合宿レポート|チケット|放送|配信予定|グッズ|前半を折り返|ハーフタイム|試合前')
TEAM_WOMEN = re.compile(r'女子')
TEAM_MEN = re.compile(r'男子')


def get(url, timeout=40):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': '*/*', 'Accept-Language': 'ja,en;q=0.8'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read().decode('utf-8', 'replace')


def get_retry(url):
    for attempt in (1, 2):
        try:
            return get(url)
        except Exception as e:
            print(f'  fetch fail {attempt}: {url} {e}')
            time.sleep(8)
    return None


def strip_html(s):
    s = re.sub(r'<!\[CDATA\[(.*?)\]\]>', r'\1', s, flags=re.S)
    s = re.sub(r'<script.*?</script>|<style.*?</style>', '', s, flags=re.S)
    s = re.sub(r'<br\s*/?>|</p>|</div>|</h\d>|</li>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s)


def tag(item, name):
    m = re.search(r'<' + name + r'[^>]*>(.*?)</' + name + '>', item, re.S)
    return re.sub(r'\s+', ' ', strip_html(m.group(1))).strip() if m else ''


def body_text(source, page):
    """記事ページから本文テキストだけを取り出す（ナビ・広告・関連記事を除く）。"""
    if 'JBA' in source:
        i = page.find('lower-content')
        seg = page[i:] if i >= 0 else page
        t = strip_html(seg)
        # 日付行（2026年9月14日）の後ろから「関連リンク」/「一覧へ」の手前まで
        m = re.search(r'\d{4}年\d{1,2}月\d{1,2}日', t)
        if m:
            t = t[m.end():]
        for stop in ('関連リンク', '一覧へ'):
            k = t.find(stop)
            if k > 0:
                t = t[:k]
    else:
        i = page.find('entryContent')
        k = page.find('article_tag', i)
        seg = page[i:k] if i >= 0 and k > i else page[i:] if i >= 0 else ''
        t = strip_html(seg)
        # BK はリンクごとに改行されるので、段落は全角スペース始まり or 空行で区切り直す
        t = re.sub(r'\n(?![　■▼【]|JPN|KOR|[A-Z]{3}｜)', '', t)
        for stop in ('日本代表名鑑', '【PR】', '▼'):
            k = t.find(stop)
            if k > 0:
                t = t[:k]
        t = re.sub(r'^[^\n]*entryContent[^\n]*">', '', t)
    t = re.sub(r'[ \t　]+', ' ', t)
    return '\n'.join(l.strip() for l in t.split('\n') if l.strip())


def extract(text):
    """数字を含む文・クォーター別スコア行・短いコメントだけを抜く（本文全文は保存しない）。"""
    quarters = [l for l in text.split('\n') if re.match(r'^[A-Z]{3}\s*[｜|]', l)][:4]
    scoreline = next((l for l in text.split('\n') if re.search(r'\d{2,3}\s*[-－–]\s*\d{2,3}', l) and len(l) < 40), '')
    facts, quotes = [], []
    speaker = ''
    for line in text.split('\n'):
        if line.startswith('■'):
            speaker = line.lstrip('■').strip()[:40]
            continue
        for q in re.findall(r'「([^「」]{20,400})」', line):
            # 大会名・スローガン等（句読点なし）はコメントではない
            if len(quotes) >= 6 or not re.search(r'[。、！？]', q) or re.search(r'大会|（\d{4}', q[:20]):
                continue
            # 話者: 「〜」と吉本ヘッドコーチは ／ 吉本ヘッドコーチは「〜」 ／ 直前の ■選手名 行
            who = speaker
            before, _, after = line.partition('「' + q)
            role = r'(?:ヘッドコーチ|HC|監督|選手|キャプテン|主将|会長)'
            m = re.match(r'」と(?:[^、。]{0,6}?)([^、。「」]{2,15}?' + role + r')(?:は|が)', after[:40]) \
                or re.search(r'([^、。「」]{2,15}?' + role + r')(?:は|が)[^、。]{0,10}$', before)
            if m:
                who = m.group(1).strip()
            quotes.append({'speaker': who, 'text': q[:120] + ('…' if len(q) > 120 else '')})
        if line.startswith('「') and line.endswith('」'):
            continue
        for sent in re.split(r'(?<=[。！？])', line):
            sent = sent.strip()
            if not sent or sent.startswith('「'):
                continue
            if re.search(r'\d', sent) and re.search(r'得点|リバウンド|アシスト|スティール|ブロック|3P|3ポイント|スリー|フリースロー|クォーター|点差|勝|敗|対戦|位|本|[-－–]\s*\d', sent):
                facts.append(sent[:180])
            if len(facts) >= 16:
                break
    scoreline = re.sub(r'^■?試合経過', '', scoreline).strip()
    return {'scoreline': scoreline, 'quarters': quarters, 'facts': facts, 'quotes': quotes}


def parse_date(s):
    try:
        d = parsedate_to_datetime(s)
        return (d if d.tzinfo else d.replace(tzinfo=timezone.utc)).astimezone(timezone.utc)
    except Exception:
        return None


def main():
    now = datetime.now(timezone.utc)
    try:
        seen = {l.strip() for l in open(SEEN_FILE) if l.strip()}
    except FileNotFoundError:
        seen = set()
    try:
        old = json.load(open(FEED_FILE, encoding='utf-8'))
    except Exception:
        old = {}
    old_by_key = {p['key']: p for p in old.get('posts', [])}

    items, ok = [], []
    for name, url, tier in FEEDS:
        body = get_retry(url)
        if not body:
            continue
        ok.append(name)
        n = 0
        for it in re.findall(r'<item>(.*?)</item>', body, re.S):
            title = tag(it, 'title')
            link = tag(it, 'link')
            if not title or not link:
                continue
            cats = [re.sub(r'\s+', ' ', strip_html(c)).strip() for c in re.findall(r'<category[^>]*>(.*?)</category>', it, re.S)]
            hay = title + ' ' + ' '.join(cats)
            if not NATIONAL.search(hay) or not GAME.search(title) or EXCLUDE.search(title):
                continue
            pub = parse_date(tag(it, 'pubDate'))
            if pub and (now - pub).total_seconds() > MAX_AGE_HOURS * 3600:
                continue
            team = '女子' if TEAM_WOMEN.search(hay) and not TEAM_MEN.search(title) else '男子' if TEAM_MEN.search(hay) else ''
            post = {
                'source': name, 'tier': tier, 'team': team, 'key': link, 'url': link, 'title': title,
                'published_utc': pub.strftime('%Y-%m-%dT%H:%M:%SZ') if pub else '',
                'summary': tag(it, 'description')[:300], 'categories': cats[:8],
            }
            if link in old_by_key and old_by_key[link].get('facts'):
                post.update({k: old_by_key[link][k] for k in ('scoreline', 'quarters', 'facts', 'quotes')})
            elif link not in seen:
                page = get_retry(link)
                if page:
                    post.update(extract(body_text(name, page)))
            items.append(post)
            n += 1
        print(f'{name}: {n} national-team game items')

    if not ok:
        print('all feeds failed')
        return
    feed = sorted({p['key']: p for p in items}.values(), key=lambda p: p['published_utc'], reverse=True)[:40]
    new = [p for p in feed if p['key'] not in seen]
    print(f'items: {len(feed)}  new: {len(new)}')
    for p in new:
        print(f"  [{p['tier']}] {p['team']} {p['published_utc']} {p['title'][:70]}  facts={len(p.get('facts', []))} quotes={len(p.get('quotes', []))}")
    if not new:
        return
    if [p['key'] for p in old.get('posts', [])] != [p['key'] for p in feed]:
        with open(FEED_FILE, 'w', encoding='utf-8') as f:
            json.dump({'updated_utc': now.strftime('%Y-%m-%d %H:%M UTC'), 'sources_ok': ok, 'posts': feed},
                      f, ensure_ascii=False, indent=1)
    else:
        print('feed unchanged (same keys) — 前回シグナルはルーチン処理待ち')
    with open('/tmp/new_national.txt', 'w') as f:
        f.writelines(p['key'] + '\n' for p in new)
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as out:
            out.write('new=true\n')


if __name__ == '__main__':
    sys.exit(main())
