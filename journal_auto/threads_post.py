#!/usr/bin/env python3
"""Threads速報の投稿係（GitHub Actions threads-post.yml から呼ばれる）。

設計書: 615_JOURNAL/Threads速報/DESIGN.md（2026-09-19 クリス指示「あれをスレッズでもやれるようにしたい！」）

- 文面を作るのはクラウドルーチン（PROMPT_CLOUD.md §1b-0）。ルーチンは journal_auto/threads_queue.json にだけ書く
- このスクリプトは threads_queue.json を読むだけで、書き込むのは journal_auto/threads_state.json だけ
  （ルーチンと Actions が同じファイルを書いて push がぶつかるのを防ぐため、書き手を1ファイル1人に分けている）
- journal_auto/threads_enabled.txt が on の時だけ本当に投稿する。off なら何もしない（--dry-run は off でも文面を表示する）

threads_queue.json: {"items": [{"key", "reporter", "posted_utc", "level", "text", "status": "ready|held",
                                "held_reason", "article_url", "created_utc"}]}
threads_state.json: {"posted": {key: {"post_id", "permalink", "posted_utc", "reply_id", "reply_utc"}},
                     "skipped": {key: {"reason", "utc"}}}
"""
import argparse, json, os, sys, time, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from insider_photo import find_photo, save_photo  # 記者の写真（X速報でも使う共通部品）

BASE = os.path.dirname(os.path.abspath(__file__))
QUEUE = os.path.join(BASE, 'threads_queue.json')
STATE = os.path.join(BASE, 'threads_state.json')
ENABLED = os.path.join(BASE, 'threads_enabled.txt')
FEED = os.path.join(BASE, 'insider_feed.json')
API = 'https://graph.threads.net/v1.0'

DAILY_CAP = 20            # 24時間で20件まで（誤作動の連投止め。公式上限250件よりずっと手前）
# 記者のポストから3時間を過ぎた話は出さない（環境変数は Mac から過去の話で試す時だけ使う）
MAX_AGE = timedelta(hours=float(os.environ.get('THREADS_MAX_AGE_HOURS', '3')))
REPLY_WINDOW = timedelta(hours=48)  # 記事URLの返信は投稿から48時間以内だけ付ける
MAX_CHARS = 500           # Threads の1投稿の上限


def now():
    return datetime.now(timezone.utc)


def parse(ts):
    return datetime.fromisoformat(ts.replace('Z', '+00:00'))


def load(path, default):
    try:
        with open(path, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return default


def api(method, path, token, **params):
    params['access_token'] = token
    data = urllib.parse.urlencode(params).encode()
    if method == 'GET':
        req = urllib.request.Request(f'{API}/{path}?{data.decode()}')
    else:
        req = urllib.request.Request(f'{API}/{path}', data=data, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'replace')
        raise RuntimeError(f'{method} {path} -> HTTP {e.code}: {body[:400]}')


def publish_text(uid, token, text, reply_to=None, image_url=None):
    """1件を「コンテナ作成 → 公開」の2段階で出す（公式手順）。image_url があれば画像つき。投稿IDを返す。"""
    params = {'media_type': 'IMAGE', 'image_url': image_url, 'text': text} if image_url else {'media_type': 'TEXT', 'text': text}
    if reply_to:
        params['reply_to_id'] = reply_to
    cid = api('POST', f'{uid}/threads', token, **params)['id']
    if image_url:  # 画像は Meta 側の取り込みが終わるまで公開できない
        for wait in (3, 5, 10, 15, 20):
            time.sleep(wait)
            st = api('GET', cid, token, fields='status,error_message')
            if st.get('status') == 'FINISHED':
                break
            if st.get('status') in ('ERROR', 'EXPIRED'):
                raise RuntimeError(f'画像コンテナが {st.get("status")}: {st.get("error_message", "")}')
    last = None
    for wait in (2, 5, 10, 20):  # コンテナの準備待ち。すぐ公開すると弾かれることがある
        time.sleep(wait)
        try:
            return api('POST', f'{uid}/threads_publish', token, creation_id=cid)['id']
        except RuntimeError as e:
            last = e
    raise last


def with_utm(url):
    if not url or 'utm_source=' in url:
        return url
    return url + ('&' if '?' in url else '?') + 'utm_source=threads'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true', help='投稿せずに、出す予定の文面を表示する')
    args = ap.parse_args()

    enabled = open(ENABLED).read().strip().lower() == 'on' if os.path.exists(ENABLED) else False
    if not enabled and not args.dry_run:
        print('threads_enabled.txt が on ではないので投稿しない')
        return 0

    queue = load(QUEUE, {'items': []})
    state = load(STATE, {'posted': {}, 'skipped': {}})
    state.setdefault('posted', {})
    state.setdefault('skipped', {})
    t = now()

    posted_24h = sum(1 for v in state['posted'].values() if t - parse(v['posted_utc']) < timedelta(hours=24))

    todo, replies = [], []
    for it in queue.get('items', []):
        key = it.get('key')
        if not key or key in state['skipped']:
            continue
        if key in state['posted']:
            p = state['posted'][key]
            if it.get('article_url') and not p.get('reply_id') and t - parse(p['posted_utc']) < REPLY_WINDOW:
                replies.append((it, p))
            continue
        if it.get('status') != 'ready':
            continue
        todo.append(it)

    token = os.environ.get('THREADS_TOKEN', '')
    if not args.dry_run and not token:
        print('::error::THREADS_TOKEN が設定されていない')
        return 1
    uid = None
    if not args.dry_run:
        uid = api('GET', 'me', token, fields='id,username')['id']

    feed_text = {p.get('key'): p.get('text', '') for p in load(FEED, {}).get('posts', [])}
    fx_cache = {}
    errors = []
    for it in todo:
        key, text = it['key'], it['text'].strip()
        reason = None
        try:
            if t - parse(it['posted_utc']) > MAX_AGE:
                reason = 'stale(記者のポストから3時間超)'
        except Exception:
            reason = 'posted_utc が読めない'
        if not reason and len(text) > MAX_CHARS:
            reason = f'文字数オーバー({len(text)}字)'
        if not reason and not text:
            reason = '本文が空'
        if reason:
            print(f'SKIP {key}: {reason}')
            if not args.dry_run:
                state['skipped'][key] = {'reason': reason, 'utc': t.isoformat(timespec='seconds')}
            continue
        if posted_24h >= DAILY_CAP:
            print(f'HOLD {key}: 24時間の上限{DAILY_CAP}件に到達。次回に回す')
            continue
        photo, image_url, image_src = find_photo(it['reporter'], it['posted_utc'], feed_text.get(key, ''), fx_cache), None, ''
        if photo:
            try:
                image_url = save_photo(photo[0], photo[1], args.dry_run, max_bytes=8 * 1024 * 1024)
                image_src = f'https://x.com/{it["reporter"]}/status/{photo[0]}'
                print(f'  写真あり: {image_src} -> {image_url}')
            except Exception as e:
                print(f'  写真の保存に失敗（文字だけで出す）: {e}')
        if args.dry_run:
            print(f'---- DRY-RUN {key}（画像: {"あり" if image_url else "なし"}）\n{text}\n')
            continue
        try:
            try:
                pid = publish_text(uid, token, text, image_url=image_url)
            except Exception as e:
                if not image_url:
                    raise
                print(f'  画像つき投稿に失敗、文字だけで出し直す: {e}')
                image_url = None
                pid = publish_text(uid, token, text)
            link = api('GET', pid, token, fields='permalink').get('permalink', '')
            state['posted'][key] = {'post_id': pid, 'permalink': link,
                                    'posted_utc': now().isoformat(timespec='seconds'),
                                    'image': image_url or '', 'image_src': image_src if image_url else ''}
            posted_24h += 1
            print(f'POSTED {key}{"（画像つき）" if image_url else ""} -> {link or pid}')
            if it.get('article_url'):
                replies.append((it, state['posted'][key]))
        except Exception as e:
            errors.append(f'{key}: {e}')
            print(f'::error::投稿失敗 {key}: {e}')

    for it, p in replies:
        body = f'詳しくはこちら👇\n{with_utm(it["article_url"])}'
        if args.dry_run:
            print(f'---- DRY-RUN reply to {it["key"]}\n{body}\n')
            continue
        try:
            rid = publish_text(uid, token, body, reply_to=p['post_id'])
            p['reply_id'] = rid
            p['reply_utc'] = now().isoformat(timespec='seconds')
            print(f'REPLIED {it["key"]}')
        except Exception as e:
            errors.append(f'reply {it["key"]}: {e}')
            print(f'::error::返信失敗 {it["key"]}: {e}')

    if not args.dry_run:
        with open(STATE, 'w', encoding='utf-8') as f:
            json.dump(state, f, ensure_ascii=False, indent=1)
            f.write('\n')
    if errors:
        with open(os.environ.get('GITHUB_STEP_SUMMARY', os.devnull), 'a') as f:
            f.write('\n'.join(errors) + '\n')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
