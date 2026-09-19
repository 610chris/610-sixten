"""記者の X ポストの写真を探して保存する共通部品（Threads速報で使用中・X速報の実装でも使う予定）。
r/nba の転載にはツイートIDも画像も無いので、FxTwitter（非公式）の新着一覧から
「投稿時刻が30分以内・本文がほぼ同じ」ポストを元ポストとみなす。設計: 615_JOURNAL/Threads速報/DESIGN.md §4-④-2
"""
import difflib, json, os, re, subprocess, time, urllib.request
from datetime import datetime, timedelta, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
MEDIA_DIR = os.path.join(BASE, 'threads_media')   # 保存先（名前は Threads 由来だが X と共用。Actions だけが書く）
RAW = 'https://raw.githubusercontent.com/610chris/610-sixten/main/journal_auto/threads_media/'
FX = 'https://api.fxtwitter.com/2/profile/{}/statuses'


def find_photo(handle, posted_utc, feed_text, cache):
    """記者の X のポストに写真があれば (tweet_id, 画像URL) を返す。無ければ None（2026-09-19 クリス指示
    「shamsが画像付きで投稿していたら、それを保存して、それをつけて投稿して欲しい」）。
    r/nba の転載にはツイートIDが無いので、FxTwitter の新着一覧から「投稿時刻が30分以内・本文がほぼ同じ」ものを探す。"""
    if not handle or not feed_text:
        return None
    if handle not in cache:
        try:
            req = urllib.request.Request(FX.format(handle), headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=20) as r:
                cache[handle] = json.load(r).get('results', [])
        except Exception as e:
            print(f'  写真の検索に失敗（文字だけで出す）: {e}')
            cache[handle] = []
    want = norm(feed_text)
    posted = datetime.fromisoformat(posted_utc.replace('Z', '+00:00'))
    for st in cache[handle]:
        photos = (st.get('media') or {}).get('photos') or []
        if not photos or st.get('reposted_by') or (st.get('author') or {}).get('screen_name', '').lower() != handle.lower():
            continue
        try:
            dt = abs(datetime.fromtimestamp(st['created_timestamp'], timezone.utc) - posted)
        except Exception:
            continue
        got = norm(st.get('text', ''))
        if dt <= timedelta(minutes=30) and got and (got[:60] in want or difflib.SequenceMatcher(None, got[:150], want[:150]).ratio() >= 0.8):
            return st['id'], photos[0]['url'].split('?')[0] + '?name=orig'
    return None


def norm(s):
    """本文の突き合わせ用。URL・「Shams Charania:」の前置き・記号を落として小文字にする"""
    s = re.sub(r'https?://\S+', '', s)
    s = re.sub(r'^\s*[\w .\-]{3,40}:\s*\n', '', s)
    return re.sub(r'[^a-z0-9$]', '', s.lower())


def save_photo(tid, url, dry_run, max_bytes=5 * 1024 * 1024):
    """写真を journal_auto/threads_media/<tweet_id>.jpg に保存して push し、公開URLを返す（dry_run はローカル保存だけでパスを返す）。
    上限の既定は X の tweet_image の 5MB。Threads は 8MB を渡す。X はファイルを直接アップロードするので、公開URLは使わずパスを使えばよい。"""
    os.makedirs(MEDIA_DIR, exist_ok=True)
    path = os.path.join(MEDIA_DIR, f'{tid}.jpg')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    if len(data) > max_bytes:
        raise RuntimeError(f'画像が上限{max_bytes}バイトを超えている({len(data)}バイト)')
    with open(path, 'wb') as f:
        f.write(data)
    if dry_run:
        return path
    rel = os.path.relpath(path, os.path.dirname(BASE))
    git = lambda *a: subprocess.run(['git', '-C', os.path.dirname(BASE), *a], check=True, capture_output=True, text=True)
    git('add', rel)
    if git('diff', '--cached', '--name-only').stdout.strip():
        git('-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
            'commit', '-q', '-m', f'threads: 速報の画像を保存 ({tid})')
        for i in range(3):
            try:
                git('pull', '--rebase', '--autostash', '-q')
                git('push', '-q')
                break
            except subprocess.CalledProcessError:
                if i == 2:
                    raise
                time.sleep(5)
    raw = RAW + os.path.basename(path)
    for wait in (0, 3, 5, 10, 15):  # push 直後は raw がまだ 404 のことがある
        time.sleep(wait)
        try:
            with urllib.request.urlopen(urllib.request.Request(raw, method='HEAD'), timeout=15):
                return raw
        except Exception:
            pass
    raise RuntimeError(f'保存した画像が公開URLで見えない: {raw}')
