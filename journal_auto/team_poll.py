#!/usr/bin/env python3
"""NBA 30チームの公式サイト（nba.com/<team>）の発表記事を集めて team_feed.json を書く。

.github/workflows/national-poll.yml の同じジョブの中で毎時実行する（スケジュールは日本代表ポーリングと共用）。
ルーチンは PROMPT_CLOUD.md §1g の手順でこのファイルを読んで記事化する。

2026-09-30 設置（依頼「記事の元ネタに、NBA 30チームの公式発信を加えて」）。
取得元: NBA.com のコンテンツAPI（チーム公式サイトの記事と同じもの）
  https://content-api-prod.nba.com/public/1/teams/<teamId>/content?count=20&types=article
  - 30チームとも nba.com/<team>/news の記事がこの1本で取れる（permalink は https://www.nba.com/<team>/news/...）。
  - 実測 2026-09-30（ローカル）: 30/30 チームで HTTP 200。
  - ⚠️ User-Agent に「bot」を含めると接続を切られる（HTTP/2 INTERNAL_ERROR）。ESPN API も同じく Akamai が403。
    なので national_poll.py の UA（末尾に 610-journal-bot）は使わず、素のブラウザUAにしている。
  - 応答は gzip で返ることがあるので展開する。

ここで拾うのは「一次情報」になる公式発表だけ:
  roster = 契約・トレード・ウェイブ・延長・2way・人事（HC/GM）・キャンプロスター
  injury = ケガ・手術・復帰の公式アップデート
  quotes = メディアデー・会見・インタビュー（選手/監督の発言）
  feature = チーム公式ライターの特集・プレビュー（発言や起用の見通しを含む。優先度は低い）
提携・スポンサー・地域貢献・チケット・グッズ・放送・日程発表などは上流で落とす。

著作権の扱い（national_poll.py と同じ）: リポジトリは public なので記事本文は丸ごと保存しない。
冒頭の要約（最大400字）・数字や契約/ケガの語を含む文・短い発言だけを抜いて渡す。

終了コード: 0 = 正常（新着なしも含む）。新着があれば /tmp/new_team.txt に key を書き、
GITHUB_OUTPUT があれば team_new=true を出す。
"""
import gzip
import html
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone

API = 'https://content-api-prod.nba.com/public/1/teams/{tid}/content?count=20&types=article'
FEED_FILE = 'journal_auto/team_feed.json'
SEEN_FILE = 'journal_auto/seen_team.txt'
# 「bot」を含めない（含めると NBA.com / ESPN の Akamai に弾かれる。2026-09-30 実測）
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36'
MAX_AGE_HOURS = 72
MAX_POSTS = 80

# NBAチームID → (略称, 日本語通称)
TEAMS = {
    1610612737: ('ATL', 'ホークス'), 1610612738: ('BOS', 'セルティックス'), 1610612739: ('CLE', 'キャバリアーズ'),
    1610612740: ('NOP', 'ペリカンズ'), 1610612741: ('CHI', 'ブルズ'), 1610612742: ('DAL', 'マーベリックス'),
    1610612743: ('DEN', 'ナゲッツ'), 1610612744: ('GSW', 'ウォリアーズ'), 1610612745: ('HOU', 'ロケッツ'),
    1610612746: ('LAC', 'クリッパーズ'), 1610612747: ('LAL', 'レイカーズ'), 1610612748: ('MIA', 'ヒート'),
    1610612749: ('MIL', 'バックス'), 1610612750: ('MIN', 'ティンバーウルブズ'), 1610612751: ('BKN', 'ネッツ'),
    1610612752: ('NYK', 'ニックス'), 1610612753: ('ORL', 'マジック'), 1610612754: ('IND', 'ペイサーズ'),
    1610612755: ('PHI', '76ers'), 1610612756: ('PHX', 'サンズ'), 1610612757: ('POR', 'トレイルブレイザーズ'),
    1610612758: ('SAC', 'キングス'), 1610612759: ('SAS', 'スパーズ'), 1610612760: ('OKC', 'サンダー'),
    1610612761: ('TOR', 'ラプターズ'), 1610612762: ('UTA', 'ジャズ'), 1610612763: ('MEM', 'グリズリーズ'),
    1610612764: ('WAS', 'ウィザーズ'), 1610612765: ('DET', 'ピストンズ'), 1610612766: ('CHA', 'ホーネッツ'),
}

I = re.I
KIND_INJURY = re.compile(r'injur|surgery|surgical|\bMRI\b|sprain|strain|fractur|\btorn\b|\btear\b|concussion|'
                         r'medical update|status update|injury update|\bupdate on\b|will miss|out indefinitely|'
                         r'return to play|rehab|procedure|diagnos', I)
KIND_ROSTER = re.compile(r'\b(sign|signs|signed|re-sign|re-signs|acquire|acquires|acquired|trade|trades|traded|'
                         r'waive|waives|waived|release|releases|claim|claims|extension|extend|two-way|'
                         r'exercise|option|hire|hires|hired|promote|promotes|converts?|agree|agrees|contract|'
                         r'roster|roster additions?|training camp|head coach|general manager|president of basketball)\b', I)
KIND_QUOTES = re.compile(r'media day|press conference|presser|quotes|takeaways|things we learned|\bQ&A\b|'
                         r'interview|\bsays\b|\bsaid\b|\btalks?\b|\bspeaks?\b|recap|storylines|mailbag|'
                         r'exit interview|introductory|notebook|address(es)?|reflects?|opens up', I)
# 一次情報でない・ニュース価値の低い発表（提携・地域貢献・チケット等）
EXCLUDE = re.compile(r'partner|partnership|sponsor|presenting|foundation|community|scholar|ticket|giveaway|'
                     r'promotional|promo night|jersey patch|auction|volunteer|\bgrant\b|winner|radio|broadcast|'
                     r'\bTV\b|television|\bapp\b|\bbook\b|statue|schedule release|season schedule|dancers|mascot|'
                     r'job fair|hiring event|fan fest|watch party|youth|basketball clinic|youth clinic|camp for kids|merch|\bstore\b|'
                     r'arena|court dedication|renovat|official (bank|drink|energy|airline|car|beer|water)|'
                     r'league pass|sweepstakes|contest|raffle|\bnight\b|heritage|celebrat|expanding access|new locations|renovates', I)
# 選手・スタッフ以外の「ロスター」ヒット（例: dance team roster）を避けるための補助
NOT_PLAYER = re.compile(r'dance|entertainment|in-arena|staff directory', I)


def get(url, timeout=30):
    req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'application/json',
                                               'Accept-Encoding': 'gzip', 'Accept-Language': 'en-US,en;q=0.9'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        b = r.read()
    if b[:2] == b'\x1f\x8b':
        b = gzip.decompress(b)
    return json.loads(b.decode('utf-8', 'replace'))


def get_retry(url):
    for attempt in (1, 2):
        try:
            return get(url)
        except Exception as e:
            print(f'  fetch fail {attempt}: {url} {e}')
            time.sleep(5)
    return None


def strip_html(s):
    s = re.sub(r'<script.*?</script>|<style.*?</style>', '', s or '', flags=re.S)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<[^>]+>', '', s)
    return re.sub(r'\s+', ' ', html.unescape(s).replace('\xa0', ' ')).strip()


def paragraphs(item):
    out = []
    for b in item.get('contentStructured') or []:
        if not isinstance(b, dict) or b.get('type') not in ('paragraph', 'heading', 'list', 'quote', 'core/quote'):
            continue
        t = strip_html(b.get('html') or '')
        if not t or re.match(r'^(ABOUT (THE )?|About the |For more information|Follow the |Tickets? )', t):
            continue
        out.append(t)
    return out


def extract(paras):
    """冒頭の要約・数字/契約/ケガの語を含む文・短い発言だけを抜く（本文全文は保存しない）。"""
    text = ' '.join(paras)
    summary = ''
    for p in paras:
        if len(p) > 40:
            summary = p[:400] + ('…' if len(p) > 400 else '')
            break
    sents = re.split(r'(?<=[.!?])\s+(?=[A-Z“"])', text)
    facts = []
    for s in sents:
        s = s.strip()
        # 発言の途中で切れた文（カギカッコが閉じていない）は facts に入れない（発言は quotes 側で拾う）
        if s.count('“') != s.count('”') or s.count('"') % 2:
            continue
        if 20 <= len(s) and re.search(r'\d|contract|two-way|extension|waive|acquire|trade|injur|surgery|'
                                      r'sprain|strain|fractur|re-evaluat|expected to|will miss|return', s, I):
            if s[:60] not in (f[:60] for f in facts) and not s.startswith(('“', '"')):
                facts.append(s[:220] + ('…' if len(s) > 220 else ''))
        if len(facts) >= 8:
            break
    quotes = []
    for q in re.findall(r'[“"]([^“”"]{25,400})[”"]', text):
        if len(quotes) >= 4:
            break
        quotes.append(q[:200] + ('…' if len(q) > 200 else ''))
    return {'summary': summary, 'facts': facts, 'quotes': quotes}


def classify(title, lead):
    if EXCLUDE.search(title):
        return ''
    if KIND_INJURY.search(title) or (KIND_INJURY.search(lead[:300]) and re.search(r'update|status', title, I)):
        return 'injury'
    if KIND_ROSTER.search(title) and not NOT_PLAYER.search(title):
        return 'roster'
    if KIND_QUOTES.search(title):
        return 'quotes'
    # チーム公式ライターの特集（メディアデー・キャンプの発言や起用の見通しを含む）。優先度は低い
    return 'feature'


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

    items, ok, failed = [], [], []
    for tid, (abbr, ja) in TEAMS.items():
        d = get_retry(API.format(tid=tid))
        if not d or 'results' not in d:
            failed.append(abbr)
            continue
        ok.append(abbr)
        n = 0
        for it in d['results'].get('items', []):
            title = strip_html(it.get('title', ''))
            link = it.get('permalink') or ''
            date = it.get('date') or ''
            if not title or not link.startswith('https://www.nba.com/'):
                continue
            try:
                pub = datetime.strptime(date, '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
            except ValueError:
                continue
            if (now - pub).total_seconds() > MAX_AGE_HOURS * 3600:
                continue
            paras = paragraphs(it)
            kind = classify(title, ' '.join(paras[:2]))
            if not kind:
                continue
            author = (it.get('author') or {}).get('name', '')
            post = {
                'source': f'{abbr} 公式（nba.com）', 'team': abbr, 'team_ja': ja, 'team_id': tid,
                'kind': kind, 'key': link, 'url': link,
                'canonical_url': ((it.get('seo') or {}).get('canonicalUrl') or ''),
                'title': title, 'author': author, 'published_utc': date,
                'tags': list(((it.get('taxonomy') or {}).get('tags') or {}).values())[:8],
            }
            post.update(extract(paras))
            items.append(post)
            n += 1
        if n:
            print(f'{abbr}: {n} items')

    print(f'teams ok: {len(ok)}/30' + (f'  failed: {",".join(failed)}' if failed else ''))
    if not ok:
        print('all teams failed')
        return
    feed = sorted({p['key']: p for p in items}.values(), key=lambda p: p['published_utc'], reverse=True)[:MAX_POSTS]
    new = [p for p in feed if p['key'] not in seen]
    print(f'items: {len(feed)}  new: {len(new)}')
    for p in new:
        print(f"  [{p['kind']}] {p['team']} {p['published_utc']} {p['title'][:80]}  facts={len(p['facts'])} quotes={len(p['quotes'])}")
    if not new:
        return
    if [p['key'] for p in old.get('posts', [])] != [p['key'] for p in feed]:
        with open(FEED_FILE, 'w', encoding='utf-8') as f:
            json.dump({'updated_utc': now.strftime('%Y-%m-%d %H:%M UTC'), 'teams_ok': len(ok),
                       'teams_failed': failed, 'posts': feed}, f, ensure_ascii=False, indent=1)
    else:
        print('feed unchanged (same keys) — 前回シグナルはルーチン処理待ち')
    with open('/tmp/new_team.txt', 'w') as f:
        f.writelines(p['key'] + '\n' for p in new)
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as out:
            out.write('team_new=true\n')


if __name__ == '__main__':
    sys.exit(main())
