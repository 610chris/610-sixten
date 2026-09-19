#!/usr/bin/env python3
"""Threads速報の選手名カタカナ辞書（journal_auto/players_kana.json）を作る・引く。

設計書: 615_JOURNAL/Threads速報/DESIGN.md §4-③
カタカナは「英語版Wikipediaの選手ページ → 日本語版への言語間リンクの題名」だけを採用する。
日本語版にページが無い選手は辞書に入れない（推測のカタカナで出さない＝クリス指示「名前は1つ1つ調べていって欲しい」）。

  python3 journal_auto/players_kana.py build            # 30チームのロスター表から作り直す（既存の項目は残す）
  python3 journal_auto/players_kana.py lookup "Name" …  # 辞書を引く。無ければWikipediaを1人ずつ調べる
  python3 journal_auto/players_kana.py lookup --add "Name" …  # 見つかったら辞書に書き足す

lookup の出力は1行1人: `OK<TAB>英語名<TAB>カタカナ` / `MISSING<TAB>英語名<TAB>理由`。
MISSING が1人でもいたら exit 2（Threads の文面は held にする）。通信できない時は exit 3。
"""
import json, os, re, sys, time, unicodedata, urllib.parse, urllib.request

BASE = os.path.dirname(os.path.abspath(__file__))
DICT = os.path.join(BASE, 'players_kana.json')
EN = 'https://en.wikipedia.org/w/api.php'
UA = 'sixten-journal-kana/1.0 (https://sixten.jp)'

TEAMS = ['Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 'Chicago Bulls',
         'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons',
         'Golden State Warriors', 'Houston Rockets', 'Indiana Pacers', 'Los Angeles Clippers',
         'Los Angeles Lakers', 'Memphis Grizzlies', 'Miami Heat', 'Milwaukee Bucks',
         'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks', 'Oklahoma City Thunder',
         'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns', 'Portland Trail Blazers',
         'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards']


class NetError(Exception):
    pass


def get(params):
    params = dict(params, format='json', formatversion='2')
    url = EN + '?' + urllib.parse.urlencode(params)
    for i in range(3):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            last = e
            time.sleep(2 + i * 3)
    raise NetError(str(last))


def fold(s):
    """Luka Dončić → Luka Doncic（記者のポストは記号なしで書くことが多いので、引く時の鍵にする）"""
    return ''.join(c for c in unicodedata.normalize('NFKD', s) if not unicodedata.combining(c))


def clean_ja(title):
    # 「ジョン・コリンズ (バスケットボール)」のような曖昧さ回避の括弧を外す
    return re.sub(r'\s*[（(][^）)]*[）)]\s*$', '', title).strip()


def is_kana_name(s):
    # 人名だけを通す: 「・」か「＝」で区切られたカタカナ（「A・J・グリーン」の頭文字・「ペイトン2世」は可）。国名・大学名は落ちる
    s = re.sub(r'[0-9２-９]世$', '', s)
    return (bool(s) and ('・' in s or '＝' in s)
            and all(('゠' <= c <= 'ヿ') or c in '・＝=ー .' or 'A' <= c <= 'Z' for c in s)
            and any('ァ' <= c <= 'ヺ' for c in s))


def keys_for(en_title):
    """引く時の鍵: 題名・記号なし・曖昧さ回避の括弧なし・頭文字の点なし（A. J. Green → AJ Green）"""
    base = re.sub(r'\s*\([^)]*\)$', '', en_title)
    ks = {en_title, base}
    ks.add(re.sub(r'\b([A-Z])\. ?(?=[A-Z]\.)', r'\1', base).replace('.', ''))
    return {k for x in ks for k in (x, fold(x))}


def resolve(names):
    """英語名 → {入力名: (英語版の題名, 日本語題名 or None, 理由)}。50件ずつまとめて問い合わせる。"""
    out = {}
    for i in range(0, len(names), 50):
        chunk = names[i:i + 50]
        d = get({'action': 'query', 'titles': '|'.join(chunk), 'redirects': 1,
                 'prop': 'langlinks', 'lllang': 'ja', 'lllimit': 'max'})
        q = d.get('query', {})
        alias = {}
        for n in q.get('normalized', []):
            alias[n['from']] = n['to']
        for r in q.get('redirects', []):
            alias[r['from']] = r['to']
        pages = {p['title']: p for p in q.get('pages', [])}
        for name in chunk:
            t = name
            while t in alias:
                t = alias[t]
            p = pages.get(t)
            if not p or p.get('missing') is not None:
                out[name] = (t, None, '英語版Wikipediaにページが無い')
                continue
            ll = p.get('langlinks') or []
            ja = clean_ja(ll[0]['title']) if ll else None
            if not ja:
                out[name] = (t, None, '日本語版Wikipediaにページが無い')
            elif re.fullmatch(r'[一-龥々]{3,5}', ja) and re.fullmatch(r'[A-Z][a-z]+ [A-Z][a-z]+', t):
                out[name] = (t, ja, '')  # 日本人選手（Yuki Kawamura → 河村勇輝）。国名(Japan→日本)は英語名が1語なので通らない
            elif not is_kana_name(ja):
                out[name] = (t, None, f'日本語版の題名がカタカナ名ではない（{ja}）')
            else:
                out[name] = (t, ja, '')
    return out


def load():
    try:
        with open(DICT, encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {'_note': '', 'players': {}}


def save(d):
    d['_note'] = ('Threads速報の選手名カタカナ辞書。カタカナ=日本語版Wikipediaの題名（英語版からの言語間リンク）だけ。'
                  '推測で足さない。追加は players_kana.py lookup --add。DESIGN.md §4-③')
    d['players'] = dict(sorted(d['players'].items(), key=lambda kv: kv[0].lower()))
    with open(DICT, 'w', encoding='utf-8') as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
        f.write('\n')


def put(d, en_title, ja):
    src = 'https://ja.wikipedia.org/wiki/' + urllib.parse.quote(ja.replace(' ', '_'))
    for key in keys_for(en_title):
        d['players'][key] = {'kana': ja, 'src': src}


def roster_names(team):
    d = get({'action': 'query', 'titles': f'Template:{team} roster', 'prop': 'links',
             'plnamespace': 0, 'pllimit': 'max'})
    names = []
    for p in d['query']['pages']:
        for l in p.get('links', []):
            t = l['title']
            if team in t or 'NBA' in t or 'National Basketball' in t or 'Injur' in t:
                continue
            names.append(t)
    return names


def build():
    d = load()
    names, misses = [], []
    for team in TEAMS:
        n = roster_names(team)
        print(f'{team}: {len(n)} links', file=sys.stderr)
        names += n
    names = sorted(set(names))
    res = resolve(names)
    added = 0
    for name, (t, ja, why) in res.items():
        if ja:
            put(d, t, ja)
            added += 1
        else:
            misses.append(f'{name}\t{why}')
    save(d)
    print(f'ロスター表のリンク {len(names)}件 → カタカナ確定 {added}件 / 未確定 {len(misses)}件（辞書の鍵は記号なし表記も含めて {len(d["players"])}件）')
    with open(os.path.join(BASE, 'players_kana_missing.txt'), 'w', encoding='utf-8') as f:
        f.write('# 日本語版Wikipediaで確認できなかった名前（辞書に入れていない＝この名前が出たら Threads は held）\n')
        f.write('\n'.join(misses) + '\n')


def lookup(names, add):
    d = load()
    found, ask = {}, []
    for n in names:
        hit = next((d['players'][k] for k in keys_for(n) if k in d['players']), None)
        if hit:
            found[n] = hit['kana']
        else:
            ask.append(n)
    res = resolve(ask) if ask else {}
    missing = 0
    for n in names:
        if n in found:
            print(f'OK\t{n}\t{found[n]}')
            continue
        t, ja, why = res[n]
        if ja:
            print(f'OK\t{n}\t{ja}')
            if add:
                put(d, t, ja)
        else:
            print(f'MISSING\t{n}\t{why}')
            missing += 1
    if add and res:
        save(d)
    return 2 if missing else 0


def main():
    a = sys.argv[1:]
    try:
        if a[:1] == ['build']:
            build()
            return 0
        if a[:1] == ['lookup']:
            add = '--add' in a
            names = [x for x in a[1:] if x != '--add']
            if not names:
                print(__doc__)
                return 1
            return lookup(names, add)
    except NetError as e:
        print(f'NETWORK\tWikipediaに届かない: {e}')
        return 3
    print(__doc__)
    return 1


if __name__ == '__main__':
    sys.exit(main())
