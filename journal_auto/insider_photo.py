"""記者の X ポストの写真を探して保存する共通部品（Threads速報で使用中・X速報の実装でも使う予定）。
r/nba の転載にはツイートIDも画像も無いので、FxTwitter（非公式）の新着一覧から
「投稿時刻が30分以内・本文がほぼ同じ」ポストを元ポストとみなす。設計: 615_JOURNAL/Threads速報/DESIGN.md §4-④-2

写真は3段構えで必ず1枚用意する（2026-09-23 クリス指示「ただ絶対に画像が欲しい！絶対に！！ / 基本はshams
なら彼の投稿している画像を使って欲しいけど、そうでないなら、どこかから引っ張ってきて欲しいかな！」）:
  ① find_photo      記者本人のXポストの写真
  ② find_player_photo 主役（選手・監督）の Wikimedia Commons の CC 写真
  ③ fallback_photo  リポジトリ常備の汎用バスケ写真（必ず返る）
"""
import difflib, hashlib, json, os, re, subprocess, sys, time, urllib.request
from datetime import datetime, timedelta, timezone

BASE = os.path.dirname(os.path.abspath(__file__))
MEDIA_DIR = os.path.join(BASE, 'threads_media')   # 保存先（名前は Threads 由来だが X と共用。Actions だけが書く）
RAW = 'https://raw.githubusercontent.com/610chris/610-sixten/main/journal_auto/threads_media/'
ASSETS_RAW = 'https://raw.githubusercontent.com/610chris/610-sixten/main/site/assets/'
COMMONS_PY = os.path.join(BASE, 'pick_commons_photo.py')
FX = 'https://api.fxtwitter.com/2/profile/{}/statuses'

# ③の常備写真。journal_auto/fallback-images.md の表と同じもの（記事heroと共用・既にリポジトリにあるので push 不要）
FALLBACKS = [
    ('journal-fallback-01.jpg', '撮影: J.smith / CC BY-SA 4.0, via Wikimedia Commons'),
    ('journal-fallback-02.jpg', '撮影: Nick Jio / CC0, via Wikimedia Commons'),
    ('journal-fallback-03.jpg', '撮影: Matteo Paganelli / CC0, via Wikimedia Commons'),
    ('journal-fallback-04.jpg', '撮影: Shixart1985 / CC BY 2.0, via Wikimedia Commons'),
]


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


def find_player_photo(subject, slug, dry_run):
    """②主役（選手・監督）の Wikimedia Commons の CC 写真を取って (公開URL, クレジット) を返す。無ければ None。

    subject は threads_queue.json の `photo_subject`（英語名。`|` 区切りで別表記やチーム名も渡せる）。
    記者が画像なしで投稿した速報（実績では Lv3 の交渉中ネタが全部これだった）を文字だけにしないための2段目。
    """
    if not subject:
        return None
    os.makedirs(MEDIA_DIR, exist_ok=True)
    out = os.path.join(MEDIA_DIR, f'{slug}.jpg')
    terms = [t.strip() for t in subject.split('|') if t.strip()]
    try:
        r = subprocess.run([sys.executable, COMMONS_PY, *terms, '--person', '--out', out],
                           capture_output=True, text=True, timeout=240)
    except Exception as e:
        print(f'  選手写真の検索に失敗: {e}')
        return None
    if r.returncode != 0 or not os.path.exists(out):
        print(f'  選手写真の候補なし（{subject} / exit {r.returncode}）')
        return None
    credit = next((l[len('CREDIT: '):].strip() for l in r.stdout.splitlines() if l.startswith('CREDIT: ')), '')
    try:
        return publish_media(out, dry_run), credit
    except Exception as e:
        print(f'  選手写真の公開に失敗: {e}')
        return None


def fallback_photo(key):
    """③常備の汎用バスケ写真から1枚返す（必ず返る）。key のハッシュで散らし、連続で同じ写真にならないようにする。"""
    name, credit = FALLBACKS[int(hashlib.sha1(key.encode()).hexdigest(), 16) % len(FALLBACKS)]
    return ASSETS_RAW + name, f'イメージ写真（本文とは直接関係ありません）。{credit}'


def save_photo(tid, url, dry_run, max_bytes=5 * 1024 * 1024):
    """①記者の写真を journal_auto/threads_media/<tweet_id>.jpg に保存して push し、公開URLを返す（dry_run はローカル保存だけでパスを返す）。
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
    return publish_media(path, dry_run)


def publish_media(path, dry_run):
    """threads_media/ に置いたファイルを commit & push して raw の公開URLを返す（dry_run はローカルパスを返す）。"""
    if dry_run:
        return path
    rel = os.path.relpath(path, os.path.dirname(BASE))
    git = lambda *a: subprocess.run(['git', '-C', os.path.dirname(BASE), *a], check=True, capture_output=True, text=True)
    git('add', rel)
    if git('diff', '--cached', '--name-only').stdout.strip():
        git('-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
            'commit', '-q', '-m', f'threads: 速報の画像を保存 ({os.path.basename(path)})')
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
