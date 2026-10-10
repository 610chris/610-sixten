#!/usr/bin/env python3
"""NBA の直近の試合から「得点リール（score 型）」にする好スタッツを拾う。

2026-10-10 クリス指示「得点スコアを表示させるやつがあったよねレブロンのやつ。あれめっちゃいいと思うから、
このプレシーズンからいろんな選手で上げていってほしい」「本当はプレシーズンでの八村塁君の試合のやつも作ってほしかった」。

ESPN の公開API（scoreboard / summary）からボックススコアを読み、基準に当たった選手を候補として出す。
記事化・ig_queue への登録は呼び出し側（ルーチン）が行う。このスクリプトは何も書き込まない
（--mark を付けた時だけ seen_score.txt に追記する）。

使い方:
  python3 journal_auto/score_scan.py               # 直近2日（米東部時間）
  python3 journal_auto/score_scan.py --days 5
  python3 journal_auto/score_scan.py --dates 20261008 20261009
  python3 journal_auto/score_scan.py --mark 401898717:4066648   # 記事化した候補を既出にする
"""
import argparse
import datetime as dt
import json
import os
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SEEN = os.path.join(HERE, "seen_score.txt")
API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba"
# ESPN の Akamai は Mozilla 系UAに403を返すことがある（PROMPT_CLOUD.md §1g の実測メモ）。curl 既定UAに合わせる
UA = "curl/8.4.0"

# 日本人選手: 出場したら成績を問わず候補にする
JAPANESE = {"Rui Hachimura": "八村塁", "Yuki Kawamura": "河村勇輝"}
# スーパースター: 20得点以上で候補にする（それ以外の選手は30得点以上）
STARS = {
    "LeBron James", "Stephen Curry", "Kevin Durant", "Giannis Antetokounmpo", "Nikola Jokic",
    "Luka Doncic", "Shai Gilgeous-Alexander", "Victor Wembanyama", "Anthony Edwards",
    "Jayson Tatum", "Joel Embiid", "Kawhi Leonard", "Jalen Brunson", "Donovan Mitchell",
    "Devin Booker", "Anthony Davis", "Ja Morant", "Tyrese Haliburton", "Cade Cunningham",
    "Jaylen Brown", "Kyrie Irving", "Damian Lillard", "James Harden", "Trae Young",
    "Cooper Flagg", "Paolo Banchero", "Tyrese Maxey", "Karl-Anthony Towns",
}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def load_seen():
    if not os.path.exists(SEEN):
        return set()
    with open(SEEN, encoding="utf-8") as f:
        return {line.split("\t")[0].strip() for line in f if line.strip()}


def to_int(v):
    try:
        return int(v)
    except (TypeError, ValueError):
        return None


def made_att(v):
    try:
        m, a = v.split("-")
        return int(m), int(a)
    except (AttributeError, ValueError):
        return None


def stat_lines(st):
    """score 型の stats（最大5行）を、目立つ順に組む。0本・0回の行は出さない"""
    lines = []
    reb, ast, stl, blk = (to_int(st.get(k)) or 0 for k in ("REB", "AST", "STL", "BLK"))
    for n, label in sorted([(reb, "REB"), (ast, "AST"), (stl, "STL"), (blk, "BLK")], key=lambda x: -x[0]):
        if n >= (1 if label in ("REB", "AST") else 2):
            lines.append(f"{n} {label}")
    fg, tp, ft = made_att(st.get("FG")), made_att(st.get("3PT")), made_att(st.get("FT"))
    if fg and fg[1]:
        lines.append(f"{fg[0]}/{fg[1]} FG")
    if tp and tp[0] >= 2:
        lines.append(f"{tp[0]}/{tp[1]} 3PT")
    if ft and ft[0] >= 6:
        lines.append(f"{ft[0]}/{ft[1]} FT")
    return lines[:5]


def reasons(name, st):
    pts = to_int(st.get("PTS")) or 0
    doubles = sum(1 for k in ("PTS", "REB", "AST", "STL", "BLK") if (to_int(st.get(k)) or 0) >= 10)
    r = []
    if name in JAPANESE:
        r.append("日本人選手")
    if pts >= 30:
        r.append(f"{pts}得点")
    elif name in STARS and pts >= 20:
        r.append(f"スター{pts}得点")
    if doubles >= 3:
        r.append("トリプルダブル")
    return r


def local_date(iso):
    """ESPN の試合日時は UTC。記事に書く「現地時間」は米東部の日付にする（西海岸の夜の試合も同じ日付になる）"""
    t = dt.datetime.fromisoformat(iso.replace("Z", "+00:00"))
    return (t - dt.timedelta(hours=5)).strftime("%Y-%m-%d")


def scan_event(eid, seen):
    d = get(f"{API}/summary?event={eid}")
    comp = d["header"]["competitions"][0]
    season_type = d["header"].get("season", {}).get("type")
    teams = {c["team"]["id"]: c for c in comp["competitors"]}
    out = []
    for block in d.get("boxscore", {}).get("players", []):
        tid = block["team"]["id"]
        opp = next(c for k, c in teams.items() if k != tid)
        me = teams[tid]
        labels = block["statistics"][0]["labels"]
        for a in block["statistics"][0]["athletes"]:
            if a.get("didNotPlay") or not a.get("stats"):
                continue
            name = a["athlete"]["displayName"]
            st = dict(zip(labels, a["stats"]))
            why = reasons(name, st)
            if not why:
                continue
            key = f"{eid}:{a['athlete']['id']}"
            out.append({
                "key": key,
                "seen": key in seen,
                "why": why,
                "date_et": local_date(comp["date"]),
                "season_type": {1: "preseason", 2: "regular", 3: "playoffs"}.get(season_type, season_type),
                "player": name,
                "player_ja": JAPANESE.get(name),
                "team": me["team"]["displayName"],
                "opponent_team": opp["team"]["displayName"],
                "result": f"{me['team']['abbreviation']} {me.get('score')}-{opp.get('score')} {opp['team']['abbreviation']}"
                          f"（{'勝ち' if me.get('winner') else '負け'}）",
                "box": st,
                "video": {
                    "template": "score",
                    "player": name.upper(),
                    "opponent": f"vs. {opp['team']['name'].upper()}",
                    "points": to_int(st.get("PTS")) or 0,
                    "stats": stat_lines(st),
                },
                "espn_url": f"https://www.espn.com/nba/boxscore/_/gameId/{eid}",
            })
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=2)
    ap.add_argument("--dates", nargs="*")
    ap.add_argument("--all", action="store_true", help="既出（seen_score.txt）も表示する")
    ap.add_argument("--mark", nargs="*", help="記事化した候補の key を seen_score.txt に追記する")
    args = ap.parse_args()

    if args.mark:
        with open(SEEN, "a", encoding="utf-8") as f:
            for k in args.mark:
                f.write(f"{k}\t{dt.datetime.now().isoformat(timespec='minutes')}\n")
        print(f"marked {len(args.mark)}")
        return

    if args.dates:
        dates = args.dates
    else:
        today = dt.datetime.now(dt.timezone(dt.timedelta(hours=-5))).date()  # 米東部（夏時間のずれは1日の幅で吸収）
        dates = [(today - dt.timedelta(days=i)).strftime("%Y%m%d") for i in range(args.days)]

    seen = load_seen()
    found = []
    for day in dates:
        sb = get(f"{API}/scoreboard?dates={day}")
        for e in sb.get("events", []):
            if e["status"]["type"].get("completed"):
                try:
                    found += scan_event(e["id"], seen)
                except Exception as ex:  # 1試合の取得失敗で全体を止めない
                    print(f"! {e['id']} {e.get('name')}: {ex}", file=sys.stderr)
    if not args.all:
        found = [c for c in found if not c["seen"]]
    # 日本人選手 → スター → 得点の多い順
    found.sort(key=lambda c: (c["player_ja"] is None, c["player"] not in STARS, -c["video"]["points"]))
    print(json.dumps(found, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
