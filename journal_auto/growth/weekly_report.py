#!/usr/bin/env python3
"""610 JOURNAL 週次成長率レポート。

analytics/data/daily/ の日別CSV（fetch_daily.py が毎朝更新）と growth/experiments.json を読み、
  1. 今週 vs 先週の数字（Search Console は確定遅れ3日を除いた直近7日 / GA4 は昨日まで）
  2. 施策ごとの前後比較（開始前14日 vs 開始後14日・対照群やサイト全体との伸び率差）と判定
  3. 次に書く記事候補・次にタイトルを直す記事候補
を analytics/data/reports/YYYY-MM-DD.md（Markdown）と YYYY-MM-DD.mail.txt（メール本文）に書き出す。

外部ライブラリ不要。
  python3 journal_auto/growth/weekly_report.py                # 今日(JST)の日付で作る
  python3 journal_auto/growth/weekly_report.py --date 2026-09-21 --out /tmp/x
"""
import argparse
import csv
import json
import re
import statistics
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

AUTO = Path(__file__).resolve().parents[1]  # journal_auto/
DAILY = AUTO / "analytics/data/daily"
REPORTS = AUTO / "analytics/data/reports"
EXPERIMENTS = AUTO / "growth/experiments.json"
JOURNAL_JS = AUTO.parent / "site/journal/journal.js"
JST = timezone(timedelta(hours=9))
GSC_LAG_DAYS = 3
WINDOW = 14
MIN_IMP = 30
NUM = re.compile(r"/journal/(\d{3})-")


def read_csv(name):
    p = DAILY / name
    if not p.exists():
        return []
    with p.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def d(s):
    return date.fromisoformat(s)


def page_num(url):
    m = NUM.search(url)
    return m.group(1) if m else None


def load_articles():
    """journal.js の ARTICLES から {番号: {title, date}}。"""
    if not JOURNAL_JS.exists():
        return {}
    js = JOURNAL_JS.read_text(encoding="utf-8")
    out = {}
    # 1記事ずつ区切って読む（007 の "2024.08" のように日が無い日付は1日扱い）
    for block in re.split(r'\n\s*\{\s*\n', js):
        h = re.search(r'href: "(\d{3})-[^"]*\.html"', block)
        t = re.search(r'title: ("(?:[^"\\]|\\.)*")', block)
        dt = re.search(r'date: "(\d{4})\.(\d{2})(?:\.(\d{2}))?"', block)
        if h and t and dt:
            out[h.group(1)] = {"title": json.loads(t.group(1)), "date": date(int(dt.group(1)), int(dt.group(2)), int(dt.group(3) or 1))}
    return out


# ---------- 集計 ----------

def gsc_sum(rows, start, end, nums=None, exclude=()):
    """GSC 日別ページCSVを期間・記事番号で絞って合計。nums=None なら全ページ（exclude を除く）。"""
    imp = clk = 0
    pos_w = 0.0
    for r in rows:
        dt = d(r["date"])
        if not (start <= dt <= end):
            continue
        key = r.get("page")
        if key is not None:
            n = page_num(key)
            if nums is not None and n not in nums:
                continue
            if n in exclude:
                continue
        i = int(r["impressions"])
        imp += i
        clk += int(r["clicks"])
        pos_w += float(r["position"]) * i
    return {"imp": imp, "clk": clk, "ctr": clk / imp if imp else None, "pos": pos_w / imp if imp else None}


def ga4_pv(rows, start, end, nums):
    return sum(int(r["pageviews"]) for r in rows
               if start <= d(r["date"]) <= end and page_num(r["path"]) in nums)


def growth(a, b):
    return (a - b) / b if b else None


def fmt_pct(x, signed=True):
    if x is None:
        return "—"
    return f"{x * 100:+.0f}%" if signed else f"{x * 100:.1f}%"


def fmt_pt(x):
    return "—" if x is None else f"{x * 100:+.1f}pt"


def fmt_pos(x):
    return "—" if x is None else f"{x:.1f}位"


# ---------- 施策の判定 ----------

def evaluate(exp, gsc_pages, ga4_pages, gsc_end, articles):
    s = d(exp["started"])
    elapsed = (gsc_end - s).days + 1
    res = {"exp": exp, "elapsed": max(elapsed, 0), "lines": []}
    if elapsed < 7:
        res["verdict"] = f"判定保留（反映から{max(elapsed, 0)}日分しかデータが無い・7日分たまったら判定）"
        return res
    win = min(WINDOW, elapsed)
    b0, b1 = s - timedelta(days=win), s - timedelta(days=1)
    a0, a1 = s, s + timedelta(days=win - 1)
    nums = set(exp["pages"])
    tentative = "（暫定: 開始から14日未満）" if win < WINDOW else ""

    if exp["metric"] == "new_article":
        per = []
        for n in exp["pages"]:
            pub = articles.get(n, {}).get("date", s)
            per.append((n, gsc_sum(gsc_pages, pub, min(pub + timedelta(days=win - 1), gsc_end), {n})["imp"]))
        base = []
        for n, a in articles.items():
            if n in nums or not (s - timedelta(days=28) <= a["date"] < s):
                continue
            end = a["date"] + timedelta(days=win - 1)
            if end > gsc_end:  # 公開後win日ぶんのデータがまだ揃っていない記事は比較から外す（不利に小さく出るため）
                continue
            base.append(gsc_sum(gsc_pages, a["date"], end, {n})["imp"])
        med = statistics.median(base) if base else None
        mine = statistics.median([i for _, i in per]) if per else 0
        for n, i in per:
            res["lines"].append(f"{n} {articles.get(n, {}).get('title', '')[:40]}: 公開後{win}日の表示 {i}回")
        res["lines"].append(f"比較: 開始前28日に出た他の新記事{len(base)}本の公開後{win}日の表示（中央値）= {med if med is not None else '—'}回")
        if med is None or (mine < MIN_IMP and (med or 0) < MIN_IMP):
            res["verdict"] = f"判定保留（表示が{MIN_IMP}回未満で差が偶然と区別できない）{tentative}"
        elif mine >= max(med, 1) * 1.5:
            res["verdict"] = f"うまくいった可能性（中央値 {mine:.0f}回 vs 他の新記事 {med:.0f}回）{tentative}"
        elif mine <= med * 0.67:
            res["verdict"] = f"ダメだった可能性（中央値 {mine:.0f}回 vs 他の新記事 {med:.0f}回）{tentative}"
        else:
            res["verdict"] = f"判定保留（他の新記事と大差なし: {mine:.0f}回 vs {med:.0f}回）{tentative}"
        return res

    tb, ta = gsc_sum(gsc_pages, b0, b1, nums), gsc_sum(gsc_pages, a0, a1, nums)
    ctrl_nums = set(exp.get("control_pages") or [])
    if ctrl_nums:
        cb, ca = gsc_sum(gsc_pages, b0, b1, ctrl_nums), gsc_sum(gsc_pages, a0, a1, ctrl_nums)
        ctrl_label = "対照群（触っていない記事 " + "・".join(sorted(ctrl_nums)) + "）"
    else:
        cb, ca = gsc_sum(gsc_pages, b0, b1, None, nums), gsc_sum(gsc_pages, a0, a1, None, nums)
        ctrl_label = "サイト全体（対象記事を除く）"
    pv = ga4_pv(ga4_pages, a0, min(a1, gsc_end + timedelta(days=GSC_LAG_DAYS)), nums)
    res["lines"] += [
        f"比較期間: 前 {b0:%m/%d}〜{b1:%m/%d} / 後 {a0:%m/%d}〜{a1:%m/%d}（各{win}日）",
        f"対象記事: 表示 {tb['imp']}→{ta['imp']}回（{fmt_pct(growth(ta['imp'], tb['imp']))}） / クリック {tb['clk']}→{ta['clk']} / CTR {fmt_pct(tb['ctr'], False)}→{fmt_pct(ta['ctr'], False)} / 平均順位 {fmt_pos(tb['pos'])}→{fmt_pos(ta['pos'])} / 後期間のPV {pv}",
        f"{ctrl_label}: 表示 {cb['imp']}→{ca['imp']}回（{fmt_pct(growth(ca['imp'], cb['imp']))}） / クリック {cb['clk']}→{ca['clk']} / CTR {fmt_pct(cb['ctr'], False)}→{fmt_pct(ca['ctr'], False)}",
    ]

    if ta["imp"] < MIN_IMP:
        res["verdict"] = f"判定保留（後期間の表示が{ta['imp']}回で{MIN_IMP}回未満）{tentative}"
        return res

    if exp["metric"] == "ctr":
        dt_ = (ta["ctr"] or 0) - (tb["ctr"] or 0)
        dc = (ca["ctr"] or 0) - (cb["ctr"] or 0)
        diff = dt_ - dc
        res["lines"].append(f"CTRの変化: 対象 {fmt_pt(dt_)} / 比較先 {fmt_pt(dc)} → 差 {fmt_pt(diff)}")
        if diff >= 0.01 and ta["clk"] >= 2:
            res["verdict"] = f"うまくいった可能性（CTRが比較先より {fmt_pt(diff)}）{tentative}"
        elif diff <= -0.01:
            res["verdict"] = f"ダメだった可能性（CTRが比較先より {fmt_pt(diff)}）{tentative}"
        elif ta["clk"] == 0 and win >= WINDOW:
            res["verdict"] = f"ダメだった可能性（表示{ta['imp']}回でクリック0のまま）"
        else:
            res["verdict"] = f"判定保留（CTRの差 {fmt_pt(diff)}・クリック{ta['clk']}回で判断材料不足）{tentative}"
    else:
        gt, gc = growth(ta["imp"], tb["imp"]), growth(ca["imp"], cb["imp"])
        if gt is None:
            res["verdict"] = f"判定保留（開始前の表示が0で伸び率を出せない）{tentative}"
            return res
        diff = gt - (gc or 0)
        res["lines"].append(f"表示の伸び率: 対象 {fmt_pct(gt)} / 比較先 {fmt_pct(gc)} → 差 {fmt_pct(diff)}")
        if diff >= 0.2:
            res["verdict"] = f"うまくいった可能性（表示の伸びが比較先より {fmt_pct(diff)}）{tentative}"
        elif diff <= -0.2:
            res["verdict"] = f"ダメだった可能性（表示の伸びが比較先より {fmt_pct(diff)}）{tentative}"
        else:
            res["verdict"] = f"判定保留（比較先との差 {fmt_pct(diff)} で小さい）{tentative}"
    return res


# ---------- 本体 ----------

def build(today):
    gsc_site = read_csv("gsc.csv")
    gsc_pages = read_csv("gsc_pages_daily.csv")
    gsc_queries = read_csv("gsc_queries_daily.csv")
    ga4 = read_csv("ga4.csv")
    ga4_pages = read_csv("ga4_pages_daily.csv")
    ga4_channels = read_csv("ga4_channels_daily.csv")
    articles = load_articles()
    exps = json.loads(EXPERIMENTS.read_text(encoding="utf-8"))["experiments"] if EXPERIMENTS.exists() else []

    last_gsc = max((d(r["date"]) for r in gsc_site), default=today - timedelta(days=GSC_LAG_DAYS))
    gsc_end = min(today - timedelta(days=GSC_LAG_DAYS), last_gsc)
    gc0, gp1 = gsc_end - timedelta(days=6), gsc_end - timedelta(days=7)
    gp0 = gsc_end - timedelta(days=13)
    cur, prev = gsc_sum(gsc_site, gc0, gsc_end), gsc_sum(gsc_site, gp0, gp1)

    last_ga4 = max((d(r["date"]) for r in ga4), default=today - timedelta(days=1))
    ga_end = min(today - timedelta(days=1), last_ga4)
    ac0, ap1, ap0 = ga_end - timedelta(days=6), ga_end - timedelta(days=7), ga_end - timedelta(days=13)

    def ga_sum(field, s, e):
        return sum(float(r[field]) for r in ga4 if s <= d(r["date"]) <= e)

    ga_rows = []
    for field, label in [("pageviews", "PV"), ("users", "ユーザー（日別の延べ）"), ("sessions", "セッション")]:
        c, p = ga_sum(field, ac0, ga_end), ga_sum(field, ap0, ap1)
        ga_rows.append((label, int(c), int(p), growth(c, p)))
    ga_days = len({r["date"] for r in ga4 if ac0 <= d(r["date"]) <= ga_end})

    ch = defaultdict(lambda: [0, 0])
    for r in ga4_channels:
        dt = d(r["date"])
        if ac0 <= dt <= ga_end:
            ch[r["channel"]][0] += int(r["sessions"])
        elif ap0 <= dt <= ap1:
            ch[r["channel"]][1] += int(r["sessions"])

    new_cur = sorted((n for n, a in articles.items() if today - timedelta(days=6) <= a["date"] <= today), reverse=True)
    new_prev = [n for n, a in articles.items() if today - timedelta(days=13) <= a["date"] <= today - timedelta(days=7)]

    # 記事別: 表示の増減
    per_cur, per_prev = defaultdict(int), defaultdict(int)
    for r in gsc_pages:
        n, dt = page_num(r["page"]), d(r["date"])
        if not n:
            continue
        if gc0 <= dt <= gsc_end:
            per_cur[n] += int(r["impressions"])
        elif gp0 <= dt <= gp1:
            per_prev[n] += int(r["impressions"])
    movers = sorted(set(per_cur) | set(per_prev), key=lambda n: per_cur[n] - per_prev[n], reverse=True)
    top_up = [n for n in movers if per_cur[n] - per_prev[n] > 0][:5]

    results = [evaluate(e, gsc_pages, ga4_pages, gsc_end, articles) for e in exps]

    # 次に書く記事候補: 直近28日で表示3回以上・平均順位8〜20位の検索語
    q = defaultdict(lambda: [0, 0, 0.0])
    q0 = gsc_end - timedelta(days=27)
    for r in gsc_queries:
        if q0 <= d(r["date"]) <= gsc_end:
            i = int(r["impressions"])
            q[r["query"]][0] += i
            q[r["query"]][1] += int(r["clicks"])
            q[r["query"]][2] += float(r["position"]) * i
    cands = [(k, v[0], v[1], v[2] / v[0]) for k, v in q.items() if v[0] >= 3 and 8 <= v[2] / v[0] <= 20]
    cands.sort(key=lambda x: -x[1])

    # 次にタイトルを直す候補: 直近28日で表示10回以上・クリック0、まだ施策に入っていない記事
    touched = {n for e in exps for n in e["pages"] + (e.get("control_pages") or [])}
    pz = defaultdict(lambda: [0, 0, 0.0])
    for r in gsc_pages:
        n = page_num(r["page"])
        if n and q0 <= d(r["date"]) <= gsc_end:
            i = int(r["impressions"])
            pz[n][0] += i
            pz[n][1] += int(r["clicks"])
            pz[n][2] += float(r["position"]) * i
    ctr_cands = sorted(((n, v[0], v[2] / v[0]) for n, v in pz.items() if v[0] >= 10 and v[1] == 0 and n not in touched), key=lambda x: -x[1])

    return {
        "today": today, "gsc": (gc0, gsc_end, gp0, gp1, cur, prev), "ga": (ac0, ga_end, ap0, ap1, ga_rows, ga_days),
        "channels": ch, "new": (new_cur, new_prev), "top_up": [(n, per_prev[n], per_cur[n]) for n in top_up],
        "results": results, "cands": cands[:10], "ctr_cands": ctr_cands[:5], "articles": articles,
    }


def title(r, n):
    return r["articles"].get(n, {}).get("title", "")[:48]


def render_md(r):
    gc0, ge, gp0, gp1, cur, prev = r["gsc"]
    ac0, ae, ap0, ap1, ga_rows, ga_days = r["ga"]
    L = [f"# 610 JOURNAL 週次成長率レポート（{r['today']:%Y-%m-%d}）", ""]
    L += ["## 1. 今週の数字（先週比）", "",
          f"### 検索（Search Console）: {gc0:%m/%d}〜{ge:%m/%d} vs {gp0:%m/%d}〜{gp1:%m/%d}", "※ 直近3日は確定前なので除外", "",
          "| 指標 | 今週 | 先週 | 伸び率 |", "|---|---|---|---|",
          f"| 表示回数 | {cur['imp']} | {prev['imp']} | {fmt_pct(growth(cur['imp'], prev['imp']))} |",
          f"| クリック | {cur['clk']} | {prev['clk']} | {fmt_pct(growth(cur['clk'], prev['clk']))} |",
          f"| CTR | {fmt_pct(cur['ctr'], False)} | {fmt_pct(prev['ctr'], False)} | {fmt_pt((cur['ctr'] or 0) - (prev['ctr'] or 0))} |",
          f"| 平均順位 | {fmt_pos(cur['pos'])} | {fmt_pos(prev['pos'])} | |", "",
          f"### サイト訪問（GA4）: {ac0:%m/%d}〜{ae:%m/%d} vs {ap0:%m/%d}〜{ap1:%m/%d}"]
    if ga_days < 7:
        L.append(f"※ GA4は2026-09-13設置のため今週分は{ga_days}日分だけ。先週比は参考値")
    L += ["", "| 指標 | 今週 | 先週 | 伸び率 |", "|---|---|---|---|"]
    L += [f"| {label} | {c} | {p} | {fmt_pct(g)} |" for label, c, p, g in ga_rows]
    if r["channels"]:
        L += ["", "流入元（セッション 今週/先週）: " + " / ".join(f"{k} {v[0]}/{v[1]}" for k, v in sorted(r["channels"].items(), key=lambda x: -x[1][0]))]
    nc, np_ = r["new"]
    L += ["", f"### 新しく公開した記事: 今週 {len(nc)}本（先週 {len(np_)}本）", ""]
    if r["top_up"]:
        L += ["### 表示が伸びた記事（先週比）", ""]
        L += [f"- {n} {title(r, n)}: {p}→{c}回" for n, p, c in r["top_up"]]
    L += ["", "## 2. 施策の検証（開始前14日 vs 開始後14日）", ""]
    for x in r["results"]:
        e = x["exp"]
        L += [f"### {e['id']}（{e['playbook']}・{e['started']}開始）", "", f"- やったこと: {e['change']}", f"- 仮説: {e['hypothesis']}",
              f"- **判定: {x['verdict']}**"]
        L += [f"- {line}" for line in x["lines"]]
        L.append("")
    L += ["## 3. 次にやること", "", "### 次に書く記事候補（直近28日で表示3回以上・平均8〜20位の検索語）", ""]
    L += [f"- 「{k}」 表示{i}回・クリック{c}・平均{p:.1f}位" for k, i, c, p in r["cands"]] or ["- 該当なし"]
    L += ["", "### 次にタイトルを直す候補（直近28日で表示10回以上・クリック0・未着手）", ""]
    L += [f"- {n} {title(r, n)}: 表示{i}回・平均{p:.1f}位" for n, i, p in r["ctr_cands"]] or ["- 該当なし"]
    L += ["", "---", "判定の基準: 表示30回未満は判定保留 / CTR施策は対照群とのCTR差±1pt / 表示施策は伸び率差±20% / 新記事は同時期の新記事の中央値の1.5倍・0.67倍。",
          "施策一覧: journal_auto/growth/PLAYBOOK.md ・ 施策ログ: journal_auto/growth/experiments.json", ""]
    return "\n".join(L)


def render_mail(r):
    gc0, ge, gp0, gp1, cur, prev = r["gsc"]
    ac0, ae, ap0, ap1, ga_rows, ga_days = r["ga"]
    L = [f"610 JOURNAL 週次成長率レポート（{r['today']:%Y-%m-%d}）", "",
         f"■ 検索（Search Console） {gc0:%m/%d}〜{ge:%m/%d}（先週比）",
         f"・表示回数 {cur['imp']}回（先週 {prev['imp']}回・{fmt_pct(growth(cur['imp'], prev['imp']))}）",
         f"・クリック {cur['clk']}回（先週 {prev['clk']}回・{fmt_pct(growth(cur['clk'], prev['clk']))}）",
         f"・CTR {fmt_pct(cur['ctr'], False)}（先週 {fmt_pct(prev['ctr'], False)}）",
         f"・平均順位 {fmt_pos(cur['pos'])}（先週 {fmt_pos(prev['pos'])}）", "",
         f"■ サイト訪問（GA4） {ac0:%m/%d}〜{ae:%m/%d}（先週比）"]
    L += [f"・{label} {c}（先週 {p}・{fmt_pct(g)}）" for label, c, p, g in ga_rows]
    if ga_days < 7:
        L.append(f"  ※GA4は9/13設置のため今週分は{ga_days}日分。先週比は参考値")
    nc, np_ = r["new"]
    L += [f"・新しく公開した記事 今週{len(nc)}本（先週{len(np_)}本）", "", "■ 施策の検証"]
    for x in r["results"]:
        e = x["exp"]
        L += ["", f"【{e['playbook']}】{e['id']}（{e['started']}開始）", f"やったこと: {e['change']}", f"判定: {x['verdict']}"]
        L += [f"  {line}" for line in x["lines"]]
    L += ["", "■ 次に書く記事候補（表示はあるが8〜20位の検索語）"]
    L += [f"・「{k}」 表示{i}回・平均{p:.1f}位" for k, i, c, p in r["cands"]] or ["・該当なし"]
    L += ["", "■ 次にタイトルを直す候補（表示10回以上・クリック0）"]
    L += [f"・{n} {title(r, n)}（表示{i}回・平均{p:.1f}位）" for n, i, p in r["ctr_cands"]] or ["・該当なし"]
    L += ["", "判定の基準: 表示30回未満は判定保留 / CTR施策は対照群とのCTR差±1pt / 表示施策は伸び率差±20% / 新記事は同時期の新記事の中央値比1.5倍・0.67倍",
          "（このメールは毎週月曜に自動送信されています）", ""]
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", help="レポート日付 YYYY-MM-DD（既定: 今日 JST）")
    ap.add_argument("--out", help="出力先ディレクトリ（既定: analytics/data/reports）")
    a = ap.parse_args()
    today = d(a.date) if a.date else datetime.now(JST).date()
    out = Path(a.out) if a.out else REPORTS
    out.mkdir(parents=True, exist_ok=True)
    r = build(today)
    (out / f"{today:%Y-%m-%d}.md").write_text(render_md(r), encoding="utf-8")
    (out / f"{today:%Y-%m-%d}.mail.txt").write_text(render_mail(r), encoding="utf-8")
    print(out / f"{today:%Y-%m-%d}.md")
    print(out / f"{today:%Y-%m-%d}.mail.txt")


if __name__ == "__main__":
    main()
