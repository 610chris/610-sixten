#!/usr/bin/env python3
"""@sixten（IG）のエンゲージレポート → journal_auto/growth/ig/REPORT.md

fetch_ig.py が貯めた data/ を読んで毎日作り直す（外部ライブラリ不要）。
    1. アカウント: フォロワー数・フォロー/解除・日別リーチ等
    2. 自動投稿リールの全体像（中央値・シェア率・保存率・スキップ率）
    3. 経過日数ごとの伸び（スナップショットから）
    4. 属性別の比較（テンプレ・背景経路・カテゴリ・人物の有無・時間帯・曜日・本文の長さ・出典）
    5. 上位・下位
    6. 実験の途中経過と判定（growth/ig/experiments.json）

数字の扱い
    - 比べる views/reach は「投稿から72時間時点の値」（その時点のスナップショットが無い古い投稿は、
      投稿3日以上たっている現在値で代用）。累計値をそのまま比べると古い投稿ほど有利になるため。
    - 率（シェア率・保存率・いいね率）は「合計 ÷ リーチ合計」。1本ずつの率の平均より外れ値に強い。
    - 1グループ10本未満は「参考値」。差が出ていても断定しない。

    python3 journal_auto/growth/ig/report.py
"""

import json, random, statistics as S
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
OUT = HERE / "REPORT.md"
JST = timezone(timedelta(hours=9))
MIN_N = 10
WEEK = "月火水木金土日"


def load(p, default):
    try:
        return json.load(open(p, encoding="utf-8"))
    except (OSError, ValueError):
        return default


def ts(s):
    return datetime.fromisoformat(s.replace("+0000", "+00:00")).astimezone(JST)


def snapshots():
    out = []
    for p in sorted((DATA / "media").glob("*.json")):
        d = load(p, {})
        if d.get("fetched_at"):
            out.append((datetime.fromisoformat(d["fetched_at"]), d.get("items", {})))
    return out


def reels(now):
    """自動投稿リールごとに属性＋最新値＋72時間値を1行にまとめる"""
    idx = load(DATA / "media_index.json", {})
    snaps = snapshots()
    if not snaps:
        return [], [], snaps
    latest = snaps[-1][1]
    rows = []
    for mid, m in idx.items():
        if mid not in latest or not m.get("timestamp"):
            continue
        t = ts(m["timestamp"])
        age_h = (now - t).total_seconds() / 3600
        cur = latest[mid]
        # 72時間に一番近いスナップショット（48〜120時間の範囲）
        at72, best = None, None
        for at, items in snaps:
            if mid in items:
                h = (at - t).total_seconds() / 3600
                if 48 <= h <= 120 and (best is None or abs(h - 72) < best):
                    at72, best = items[mid], abs(h - 72)
        if at72 is None and age_h >= 72:
            at72 = cur        # 計測を始める前の投稿は現在値で代用（72時間以降の伸びは小さい）
        rows.append(dict(m, mid=mid, t=t, age_h=age_h, cur=cur, at72=at72))
    auto = [r for r in rows if r.get("auto")]
    other = [r for r in rows if not r.get("auto")]
    return auto, other, snaps


def med(xs):
    xs = [x for x in xs if x is not None]
    return S.median(xs) if xs else None


def rate(rs, key, base="reach", src="at72"):
    num = sum((r[src] or {}).get(key) or 0 for r in rs)
    den = sum((r[src] or {}).get(base) or 0 for r in rs)
    return num / den * 100 if den else None


def f0(x):
    return "—" if x is None else f"{x:,.0f}"


def f2(x):
    return "—" if x is None else f"{x:.2f}%"


def f1(x):
    return "—" if x is None else f"{x:.1f}"


HEAD = "| グループ | 本数 | views中央値 | reach中央値 | シェア率 | 保存率 | いいね率 | コメント率 | 平均視聴(秒) | スキップ率 | |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|"


def row(label, rs):
    v = [r["at72"].get("views") for r in rs]
    re = [r["at72"].get("reach") for r in rs]
    w = med([(r["at72"].get("avg_watch_ms") or 0) / 1000 for r in rs])
    sk = med([r["at72"].get("skip_rate") for r in rs])
    note = "参考値" if len(rs) < MIN_N else ""
    return (f"| {label} | {len(rs)} | {f0(med(v))} | {f0(med(re))} | {f2(rate(rs, 'shares'))} | "
            f"{f2(rate(rs, 'saved'))} | {f2(rate(rs, 'likes'))} | {f2(rate(rs, 'comments'))} | {f1(w)} | "
            f"{f1(sk)}{'%' if sk is not None else ''} | {note} |")


def table(title, rs, key, order=None):
    g = defaultdict(list)
    for r in rs:
        k = key(r)
        if k is not None:
            g[k].append(r)
    keys = order or sorted(g, key=lambda k: -len(g[k]))
    lines = [f"### {title}", "", HEAD]
    lines += [row(k, g[k]) for k in keys if k in g]
    return lines + [""]


def hour_band(r):
    h = r["t"].hour
    for lo, hi, name in ((0, 3, "0-2時"), (3, 7, "3-6時"), (7, 10, "7-9時"), (10, 13, "10-12時"),
                         (13, 18, "13-17時"), (18, 21, "18-20時"), (21, 24, "21-23時")):
        if lo <= h < hi:
            return name


def cap_band(r):
    n = r.get("caption_len") or 0
    return "〜299字" if n < 300 else ("300〜349字" if n < 350 else "350字〜")


def perm_test(a, b, n=4000, seed=7):
    """平均の差の並べ替え検定（両側）。外部ライブラリなしで小標本の偶然度合いを見る"""
    if len(a) < 2 or len(b) < 2:
        return None
    obs = abs(S.mean(a) - S.mean(b))
    pool = a + b
    rnd = random.Random(seed)
    hit = 0
    for _ in range(n):
        rnd.shuffle(pool)
        if abs(S.mean(pool[:len(a)]) - S.mean(pool[len(a):])) >= obs - 1e-12:
            hit += 1
    return hit / n


# ---------------------------------------------------------------- 節

def sec_account(now):
    snaps = [json.loads(l) for l in open(DATA / "account_snapshots.jsonl", encoding="utf-8") if l.strip()] \
        if (DATA / "account_snapshots.jsonl").exists() else []
    daily = load(DATA / "account_daily.json", {})
    L = ["## 1. アカウント", ""]
    if snaps:
        cur = snaps[-1]
        L.append(f"- フォロワー **{cur['followers']:,}**（{cur['at'][:16].replace('T', ' ')} 時点）・投稿 {cur['media']}")

        def back(days):
            target = datetime.fromisoformat(cur["at"]) - timedelta(days=days)
            olds = [s for s in snaps if datetime.fromisoformat(s["at"]) <= target + timedelta(hours=12)]
            return olds[-1] if olds else None
        for d in (1, 7, 28):
            o = back(d)
            if o and o is not cur:
                L.append(f"- {d}日前比: {cur['followers'] - o['followers']:+,}")
        if len(snaps) < 8:
            L.append(f"- フォロワー数の記録は {snaps[0]['at'][:10]} から（{len(snaps)}回分）。純増は記録がたまると上に出る")
    days = sorted(daily)
    if days:
        def tot(k, ds):
            return sum(daily[d].get(k) or 0 for d in ds)
        for span in (7, 28):
            ds = days[-span:]
            fo, un = tot("follows", ds), tot("unfollows", ds)
            L.append(f"- 直近{len(ds)}日（太平洋時間の日別）: フォロー **{fo}** / フォロー解除 **{un}** → 差 **{fo - un:+}**・"
                     f"プロフィール訪問 {tot('profile_views', ds):,}・シェア {tot('shares', ds)}・保存 {tot('saves', ds)}")
        L += ["", "| 日 | リーチ | 再生 | プロフ訪問 | 反応数 | シェア | 保存 | フォロー | 解除 | リンクタップ |",
              "|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|"]
        for d in days[-14:][::-1]:
            x = daily[d]
            L.append(f"| {d} | {f0(x.get('reach'))} | {f0(x.get('views'))} | {f0(x.get('profile_views'))} | "
                     f"{f0(x.get('total_interactions'))} | {f0(x.get('shares'))} | {f0(x.get('saves'))} | "
                     f"{f0(x.get('follows'))} | {f0(x.get('unfollows'))} | {f0(x.get('website_clicks'))} |")
        L += ["", "※ 日別は IG の集計単位（太平洋時間の0時区切り＝日本時間の16時/17時区切り）。直近1〜2日は確定前で小さく出る。"
              "アカウント日別リーチは 2026-09-26 以前が API 上ほぼ0で返る（取得側の不具合ではなく IG の返す値）。"]
    demo = sorted((DATA / "demographics").glob("*.json"))
    if demo:
        d = load(demo[-1], {})
        if d.get("age"):
            tot_age = sum(d["age"].values()) or 1
            ages = "・".join(f"{k} {v / tot_age * 100:.0f}%" for k, v in sorted(d["age"].items()))
            L.append(f"- フォロワーの年齢（{demo[-1].stem}）: {ages}")
        if d.get("gender"):
            g = d["gender"]
            tg = sum(g.values()) or 1
            L.append("- 性別: " + "・".join(f"{ {'M': '男性', 'F': '女性', 'U': '不明'}.get(k, k)} {v / tg * 100:.0f}%"
                                          for k, v in sorted(g.items(), key=lambda kv: -kv[1])))
    return L + [""]


def sec_overall(auto, other):
    ok = [r for r in auto if r["at72"]]
    L = ["## 2. 自動投稿リールの全体像", "",
         f"- 自動投稿リール {len(auto)} 本（うち比較に使える＝投稿から72時間以上 {len(ok)} 本）・それ以前の手動投稿 {len(other)} 本は比較から外す",
         "", HEAD, row("自動投稿リール（72時間値）", ok)]
    recent = [r for r in auto if r["age_h"] < 72]
    if recent:
        L.append(f"| （参考）投稿72時間未満 {len(recent)} 本の現在値 views中央値 {f0(med([r['cur'].get('views') for r in recent]))} | | | | | | | | | | |")
    return L + ["", "※ シェア率＝シェア÷リーチ、保存率＝保存÷リーチ。スキップ率は IG の reels_skip_rate（冒頭で飛ばされた割合）。", ""]


def sec_growth(auto, snaps):
    L = ["## 3. 投稿後の伸び方（経過日数ごとの views 中央値）", ""]
    if len(snaps) < 2:
        return L + ["スナップショットが1日分しかないので、2日目以降の記録がたまると出る。", ""]
    buckets = {"1日": (12, 36), "2日": (36, 60), "3日": (60, 84), "7日": (156, 180), "14日": (324, 348)}
    L += ["| 経過 | 本数 | views中央値 | reach中央値 |", "|---|---:|---:|---:|"]
    by = {r["mid"]: r for r in auto}
    for name, (lo, hi) in buckets.items():
        vs, rs = [], []
        for mid, r in by.items():
            for at, items in snaps:
                h = (at - r["t"]).total_seconds() / 3600
                if lo <= h < hi and mid in items:
                    vs.append(items[mid].get("views"))
                    rs.append(items[mid].get("reach"))
                    break
        L.append(f"| {name} | {len(vs)} | {f0(med(vs))} | {f0(med(rs))} |")
    return L + [""]


def sec_breakdown(auto):
    ok = [r for r in auto if r["at72"]]
    L = ["## 4. 属性別の比較（投稿72時間値）", "",
         "10本未満のグループは **参考値**。属性同士が重なっている（例: KICKS はほぼ人物写真なし）ので、1つの表だけで原因を決めない。", ""]
    L += table("ジャンル（テンプレ）", ok, lambda r: r.get("template"))
    L += table("カテゴリ", ok, lambda r: r.get("category"))
    L += table("背景に選手がいるか（記事の subject）", ok,
               lambda r: "選手あり" if r.get("subject") else "選手なし")
    L += table("背景の写真の経路", ok, lambda r: r.get("route"))
    L += table("投稿時刻帯（JST）", ok, hour_band,
               ["0-2時", "3-6時", "7-9時", "10-12時", "13-17時", "18-20時", "21-23時"])
    L += table("曜日（JST）", ok, lambda r: WEEK[r["t"].weekday()], list(WEEK))
    L += table("キャプションの長さ", ok, cap_band, ["〜299字", "300〜349字", "350字〜"])

    def src(r):
        s = r.get("source") or ""
        if "PR TIMES" in s:
            return "PR TIMES"
        for k in ("ESPN", "Shams", "Hypebeast", "Sneaker", "Nice Kicks"):
            if k in s:
                return "Sneaker系" if k in ("Sneaker", "Nice Kicks", "Hypebeast") else ("ESPN" if k == "Shams" else k)
        return "その他" if s else None
    L += table("出典（まとめ）", ok, src)
    return L


def sec_top(auto):
    ok = sorted([r for r in auto if r["at72"]], key=lambda r: -(r["at72"].get("views") or 0))
    L = ["## 5. 上位・下位（投稿72時間値の views）", ""]
    for title, rs in (("上位10", ok[:10]), ("下位10", ok[-10:][::-1])):
        L += [f"### {title}", "", "| views | reach | シェア | 保存 | スキップ率 | 投稿(JST) | カテゴリ | 背景 | 見出し |",
              "|---:|---:|---:|---:|---:|---|---|---|---|"]
        for r in rs:
            a = r["at72"]
            L.append(f"| {f0(a.get('views'))} | {f0(a.get('reach'))} | {a.get('shares', 0)} | {a.get('saved', 0)} | "
                     f"{f1(a.get('skip_rate'))}% | {r['t']:%m/%d %H:%M} | {r.get('category') or ''} | {r.get('route') or ''} | "
                     f"[{(r.get('headline') or '')[:32]}]({r.get('permalink')}) |")
        L.append("")
    return L


def per_post_rate(r, key):
    a = r["at72"]
    return (a.get(key) or 0) / a["reach"] * 100 if a.get("reach") else 0.0


def sec_experiments(auto, now):
    exps = load(HERE / "experiments.json", {}).get("experiments", [])
    daily = load(DATA / "account_daily.json", {})
    L = ["## 6. 実験", "", "定義と判定基準は [experiments.json](experiments.json)。止め方・回し方は [../PLAYBOOK.md](../PLAYBOOK.md) の IG 節。", ""]
    for e in exps:
        L += [f"### {e['id']}（{e.get('status')}・{e.get('started')}〜{e.get('ends')}）", "",
              f"- 変える: {e.get('variable')}", f"- 仮説: {e.get('hypothesis')}", f"- 判定基準: {e.get('decision')}", ""]
        start = date.fromisoformat(e["started"])
        if e.get("kind") == "per_post":
            g = defaultdict(list)
            for r in auto:
                if r["t"].date() < start:
                    continue
                arm = (r.get("arms") or {}).get(e["id"])
                if arm is None:     # 記録が無い時はキャプション本文で判定
                    arm = "B" if r.get("cta_share") else ("A" if r.get("has_question") and not r.get("no_question") else "na")
                g[arm].append(r)
            L += ["| アーム | 投稿数 | うち72h以上 | views中央値 | シェア率 | 保存率 |", "|---|---:|---:|---:|---:|---:|"]
            for arm in ("A", "B", "na"):
                rs = g.get(arm, [])
                ok = [r for r in rs if r["at72"]]
                L.append(f"| {arm} | {len(rs)} | {len(ok)} | {f0(med([r['at72'].get('views') for r in ok]))} | "
                         f"{f2(rate(ok, 'shares'))} | {f2(rate(ok, 'saved'))} |")
            a = [r for r in g.get("A", []) if r["at72"]]
            b = [r for r in g.get("B", []) if r["at72"]]
            verdict = "データ集め中"
            if len(a) >= 30 and len(b) >= 30:
                ra, rb = rate(a, "shares") or 0, rate(b, "shares") or 0
                p = perm_test([per_post_rate(r, "shares") for r in a], [per_post_rate(r, "shares") for r in b])
                va, vb = med([r["at72"]["views"] for r in a]), med([r["at72"]["views"] for r in b])
                if vb is not None and va and vb < va * 0.85:
                    verdict = f"止める（B の views 中央値が A の {vb / va:.0%}）"
                elif ra and rb >= ra * 1.5 and p is not None and p < 0.10:
                    verdict = f"B を採用候補（シェア率 A {ra:.2f}% → B {rb:.2f}%・p={p:.2f}）"
                elif ra == 0 and rb > 0 and p is not None and p < 0.10:
                    verdict = f"B を採用候補（A のシェア0・B {rb:.2f}%・p={p:.2f}）"
                else:
                    verdict = f"まだ差と言えない（シェア率 A {ra:.2f}% / B {rb:.2f}%・p={p if p is None else round(p, 2)}）"
                if now.date() > date.fromisoformat(e["ends"]) and verdict.startswith("まだ"):
                    verdict = "期限切れ・差なし → 元に戻す"
            else:
                verdict += f"（72時間以上たった投稿 A {len(a)} 本 / B {len(b)} 本・各30本で判定）"
            L += ["", f"**判定: {verdict}**", ""]
        elif e.get("kind") == "per_week":
            wk = defaultdict(lambda: defaultdict(float))
            for d, x in daily.items():
                dd = date.fromisoformat(d)
                if dd < start or dd > date.fromisoformat(e["ends"]):
                    continue
                w = dd.isocalendar()[1]
                arm = "A" if w % 2 == 0 else "B"
                k = (w, arm)
                for m in ("reach", "follows", "unfollows", "profile_views"):
                    wk[k][m] += x.get(m) or 0
                wk[k]["days"] += 1
            L += ["| ISO週 | アーム | 日数 | リーチ | フォロー | 解除 | フォロー/1kリーチ | プロフ訪問/1kリーチ |",
                  "|---|---|---:|---:|---:|---:|---:|---:|"]
            per = defaultdict(list)
            for (w, arm), x in sorted(wk.items()):
                fr = x["follows"] / x["reach"] * 1000 if x["reach"] else None
                pr = x["profile_views"] / x["reach"] * 1000 if x["reach"] else None
                if fr is not None and x["days"] >= 5:
                    per[arm].append((fr, x["unfollows"] / x["days"]))
                L.append(f"| {w} | {arm} | {x['days']:.0f} | {f0(x['reach'])} | {f0(x['follows'])} | {f0(x['unfollows'])} | "
                         f"{f1(fr)} | {f1(pr)} |")
            if len(per["A"]) >= 2 and len(per["B"]) >= 2:
                fa, fb = S.mean(x[0] for x in per["A"]), S.mean(x[0] for x in per["B"])
                ua, ub = S.mean(x[1] for x in per["A"]), S.mean(x[1] for x in per["B"])
                verdict = (f"B を採用候補（参考値: フォロー/1kリーチ A {fa:.1f} → B {fb:.1f}）" if fa and fb >= fa * 1.2 and ub <= ua
                           else f"差なし（参考値: A {fa:.1f} / B {fb:.1f}・1日あたり解除 A {ua:.1f} / B {ub:.1f}）")
            else:
                verdict = f"データ集め中（5日以上そろった週 A {len(per['A'])} / B {len(per['B'])}・各2週で判定）"
            L += ["", f"**判定: {verdict}**", "", "※ 日別は確定に1〜2日かかるので、直近の週は小さく出る。", ""]
        else:
            ok = [r for r in auto if r["at72"] and r["t"].date() >= start]
            allok = [r for r in auto if r["at72"]]
            L += [f"開始後の投稿で72時間たったもの {len(ok)} 本（開始前も含む全体 {len(allok)} 本）。", "", HEAD]
            for cat in ("NBA", "KICKS", "JAPAN"):
                for has in (True, False):
                    rs = [r for r in allok if r.get("category") == cat and bool(r.get("subject")) == has]
                    if rs:
                        L.append(row(f"{cat}・{'選手あり' if has else '選手なし'}", rs))
            L += ["", "**判定: 観察中**（同じカテゴリ内で選手あり/なしが各20本たまったら比較する）", ""]
            if e["id"] == MIX_EXP:
                L += decide_mix(auto, now)
    return L


MIX = HERE / "mix.json"
MIX_EXP = "ig-2026-10-content-mix-observe"
MIX_WAIT_DAYS = 3        # 終了日の投稿が72時間たつのを待ってから決める
MIX_MIN_CAT = 5          # KICKS/JAPAN がこれ未満なら、そのカテゴリは決めない（上限なしのまま）


def decide_mix(auto, now):
    """観察実験が終わったら本数配分を決めて mix.json に書く（1回だけ。reel_post.py が読む）。

    2026-10-06 クリス指示「KICKS・PR系の投稿本数の配分を見直す（エンゲージの観察実験の結果が出てから）」
    「これから自分で続けて言いたくないから…言わずとも成立するようにして」→ 提案待ちにせず自動で反映する。
    - KICKS・JAPAN の views 中央値（72時間値）が NBA の 0.5倍未満 → 24時間に1本 / 0.8倍未満 → 2本 / それ以上 → 上限なし
    - 同じカテゴリ内で選手あり・なしが各20本以上あり、選手ありが1.5倍以上 →「選手なし」の投稿は全カテゴリで24時間に1本
    戻り値は REPORT に書く行。
    """
    mix = load(MIX, {})
    if mix.get("decided_by") == MIX_EXP:
        return [f"**配分: 決定済み（{mix.get('decided_at')}）** → 24時間の上限 {json.dumps(mix.get('daily_cap'), ensure_ascii=False)}"
                f"・選手なし {json.dumps(mix.get('no_person_cap'))}（null=上限なし）。理由: {mix.get('reason')}", ""]
    exp = next((e for e in load(HERE / "experiments.json", {}).get("experiments", []) if e["id"] == MIX_EXP), None)
    if not exp:
        return []
    start, ends = date.fromisoformat(exp["started"]), date.fromisoformat(exp["ends"])
    if now.date() < ends + timedelta(days=MIX_WAIT_DAYS):
        return [f"配分は {ends + timedelta(days=MIX_WAIT_DAYS)} 以降の毎朝の更新で自動で決まる（mix.json → reel_post.py）。", ""]
    ok = [r for r in auto if r["at72"] and start <= r["t"].date() <= ends and r["at72"].get("views") is not None]
    by = lambda cat, has=None: [r["at72"]["views"] for r in ok if r.get("category") == cat
                                and (has is None or bool(r.get("subject")) == has)]
    nba = by("NBA")
    if len(nba) < MIN_N:
        return [f"配分: NBA の比較対象が {len(nba)} 本で足りない（{MIN_N}本で決める）。上限なしのまま。", ""]
    base = med(nba)
    caps, why = {}, [f"NBA {len(nba)}本 中央値{base:.0f}"]
    for cat in ("KICKS", "JAPAN"):
        v = by(cat)
        if len(v) < MIX_MIN_CAT:
            caps[cat] = None
            why.append(f"{cat} {len(v)}本で少なすぎ→上限なし")
            continue
        ratio = med(v) / base if base else 1
        caps[cat] = 1 if ratio < 0.5 else (2 if ratio < 0.8 else None)
        why.append(f"{cat} {len(v)}本 中央値{med(v):.0f}（NBAの{ratio:.2f}倍）")
    person = []
    for cat in ("NBA", "KICKS", "JAPAN"):
        a, b = by(cat, True), by(cat, False)
        if len(a) >= 20 and len(b) >= 20 and med(b) and med(a) >= med(b) * 1.5:
            person.append(f"{cat} 選手あり{med(a):.0f}/なし{med(b):.0f}")
    np_cap = 1 if person else None
    why.append("人物の効果あり: " + "・".join(person) if person else "人物の効果は判定できず/差なし")
    mix = {"decided_by": MIX_EXP, "decided_at": f"{now:%Y-%m-%d %H:%M}", "daily_cap": caps,
           "no_person_cap": np_cap, "reason": " / ".join(why),
           "note": "report.py が観察実験の判定で自動で書いた。消す・null にすると上限なしに戻る"}
    MIX.write_text(json.dumps(mix, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return [f"**配分: 今回決定（{mix['decided_at']}）** → 24時間の上限 {json.dumps(caps, ensure_ascii=False)}"
            f"・選手なし {json.dumps(np_cap)}（null=上限なし）。理由: {mix['reason']}", ""]


def main():
    now = datetime.now(JST)
    auto, other, snaps = reels(now)
    L = [f"# @sixten Instagram エンゲージレポート", "",
         f"更新: {now:%Y-%m-%d %H:%M} JST（journal_auto/growth/ig/report.py が毎日自動で作り直す・手で編集しない）", ""]
    L += sec_account(now)
    if auto:
        L += sec_overall(auto, other)
        L += sec_growth(auto, snaps)
        L += sec_breakdown(auto)
        L += sec_top(auto)
    else:
        L += ["リールのデータがまだ無い。", ""]
    L += sec_experiments(auto, now)
    OUT.write_text("\n".join(L).rstrip() + "\n", encoding="utf-8")
    print(f"→ {OUT}")


if __name__ == "__main__":
    main()
