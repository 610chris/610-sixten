#!/usr/bin/env python3
"""610 JOURNAL 週次レポート資料（記事・リール・Threads の3軸）→ 印刷用 HTML（A4縦）＋メール用の要約テキスト

2026-10-12 クリス指示「記事・リール・Threads の3軸で、テキスト羅列ではなくプロのマーケターが作る見やすい資料（PDF・グラフ付き）を
毎週メールで届くように」で設置。PDF化とメール送信は Mac の ~/.claude/scripts/journal_weekly_mail.sh（月曜12:00）がやる。

読むもの（全部リポ内・外部ライブラリ不要・グラフはインライン SVG を自前で描く＝オフラインで描ける）
    記事     growth/weekly_report.py の build() をそのまま使う（日付の区切りも既存ロジックのまま）
    リール   growth/ig/data/（fetch_ig.py が毎日保存: media/*.json・media_index.json・account_daily.json・account_snapshots.jsonl）
    Threads  growth/threads/data/（fetch_threads.py が毎日保存）＋ journal_auto/threads_state.json

書き出すもの
    analytics/data/reports/YYYY-MM-DD.deck.html   資料本体（Chrome で PDF 化する前提・A4縦・ページ区切りつき）
    analytics/data/reports/YYYY-MM-DD.deck.txt    メール本文用の要約

期間: リールと Threads は「レポート日の前日までの7日間（JST）」。比べる先週はその前の7日間。
数字が足りない軸も落とさず「データ蓄積中」と出す。要点・提案は数字から機械的に言える事実だけ（盛らない）。

    python3 journal_auto/growth/weekly_deck.py                 # 今日(JST)の日付で作る
    python3 journal_auto/growth/weekly_deck.py --date 2026-10-12 --out /tmp/x
"""
import argparse
import html
import json
import statistics
import sys
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import weekly_report as wr  # noqa: E402  記事の集計は既存のものを再利用

AUTO = HERE.parent
IG = HERE / "ig/data"
TH = HERE / "threads/data"
TH_STATE = AUTO / "threads_state.json"
JST = timezone(timedelta(hours=9))
TEMPLATE_LABEL = {"news": "ニュース", "score": "試合結果", "quote": "発言", None: "手動投稿"}
MIN_N = 3          # グループ比較で最低限ほしい本数（これ未満のグループは提案に使わない）

# 色（dataviz スキルの参照パレット・ライト面）。紙に刷る資料なのでダークモードは持たない
C = {"surface": "#fcfcfb", "ink": "#0b0b0b", "ink2": "#52514e", "muted": "#898781", "grid": "#e1e0d9",
     "axis": "#c3c2b7", "blue": "#2a78d6", "blue_lt": "#9ec5f4", "band": "#f0efec",
     "good": "#006300", "bad": "#d03b3b"}


def esc(s):
    return html.escape(str(s), quote=True)


def cut(s, n):
    """n文字を超える時だけ切って「…」を付ける（途中で切れたと分かるように）"""
    s = str(s)
    return s[:n] + "…" if len(s) > n else s


def load(p, default):
    try:
        return json.load(open(p, encoding="utf-8"))
    except (OSError, ValueError):
        return default


def ts(s):
    return datetime.fromisoformat(s.replace("Z", "+00:00").replace("+0000", "+00:00")).astimezone(JST)


def n0(x):
    return "—" if x is None else f"{x:,.0f}"


def pct(a, b):
    return None if not b or a is None else (a - b) / b


def med(xs):
    xs = [x for x in xs if x is not None]
    return statistics.median(xs) if xs else None


# ====================================================================== SVG グラフ（自前）

def nice_ticks(vmax, n=4):
    if not vmax or vmax <= 0:
        return [0, 1]
    raw = vmax / n
    mag = 10 ** (len(str(int(raw))) - 1) if raw >= 1 else 1
    step = next(m * mag for m in (1, 2, 2.5, 5, 10) if m * mag >= raw)
    ticks, v = [], 0
    while v < vmax + step * 0.001:
        ticks.append(v)
        v += step
    if ticks[-1] < vmax:
        ticks.append(v)
    return ticks


def fmt_tick(v):
    if v >= 10000:
        return f"{v / 10000:g}万"
    return f"{v:,.0f}"


def _frame(w, h, pad, ticks, ymax):
    L, R, T, B = pad
    out = []
    for t in ticks:
        y = T + (h - T - B) * (1 - t / ymax)
        out.append(f'<line x1="{L}" x2="{w - R}" y1="{y:.1f}" y2="{y:.1f}" stroke="{C["axis"] if t == 0 else C["grid"]}" stroke-width="1"/>')
        out.append(f'<text x="{L - 6}" y="{y + 4:.1f}" text-anchor="end" class="tick">{fmt_tick(t)}</text>')
    return out


def time_chart(series, highlight_from, kind="line", w=680, h=210, unit="回", label_last=True):
    """series = [(date, 値 or None)]（日付順）。highlight_from 以降を「今週」として強調する"""
    pts = [(d, v) for d, v in series if v is not None]
    if len(pts) < 2:
        return '<div class="empty">データ蓄積中（グラフにできる日数がまだ足りない）</div>'
    pad = (52, 44, 18, 26)
    L, R, T, B = pad
    ymax_raw = max(v for _, v in pts)
    ticks = nice_ticks(ymax_raw)
    ymax = ticks[-1] or 1
    days = [d for d, _ in series]
    n = len(days)
    slot = (w - L - R) / n
    xc = {d: L + slot * (i + 0.5) for i, d in enumerate(days)}
    yv = lambda v: T + (h - T - B) * (1 - v / ymax)  # noqa: E731
    out = [f'<svg viewBox="0 0 {w} {h}" class="chart" role="img">']
    # 今週の帯
    if highlight_from in xc:
        x0 = xc[highlight_from] - slot / 2
        out.append(f'<rect x="{x0:.1f}" y="{T}" width="{w - R - x0:.1f}" height="{h - T - B}" fill="{C["band"]}"/>')
        out.append(f'<text x="{x0 + 4:.1f}" y="{T + 12}" class="tick">今週</text>')
    out += _frame(w, h, pad, ticks, ymax)
    # 日付ラベル（7日おき＋最後）
    for i, d in enumerate(days):
        if (n - 1 - i) % 7 == 0:
            out.append(f'<text x="{xc[d]:.1f}" y="{h - 8}" text-anchor="middle" class="tick">{d.month}/{d.day}</text>')
    if kind == "bar":
        bw = min(24, slot * 0.7)
        for d, v in pts:
            x, y, base = xc[d] - bw / 2, yv(v), yv(0)
            r = min(4, (base - y) / 2, bw / 2)
            col = C["blue"] if d >= highlight_from else C["blue_lt"]
            out.append(f'<path d="M{x:.1f},{base:.1f} V{y + r:.1f} Q{x:.1f},{y:.1f} {x + r:.1f},{y:.1f} H{x + bw - r:.1f} '
                       f'Q{x + bw:.1f},{y:.1f} {x + bw:.1f},{y + r:.1f} V{base:.1f} Z" fill="{col}">'
                       f'<title>{d.month}/{d.day} {v:,.0f}{unit}</title></path>')
        if label_last:
            d, v = pts[-1]
            out.append(f'<text x="{xc[d]:.1f}" y="{yv(v) - 5:.1f}" text-anchor="middle" class="val">{v:,.0f}</text>')
    else:
        line = " ".join(f"{xc[d]:.1f},{yv(v):.1f}" for d, v in pts)
        area = f"{xc[pts[0][0]]:.1f},{yv(0):.1f} {line} {xc[pts[-1][0]]:.1f},{yv(0):.1f}"
        out.append(f'<polygon points="{area}" fill="{C["blue"]}" fill-opacity="0.10"/>')
        out.append(f'<polyline points="{line}" fill="none" stroke="{C["blue"]}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>')
        for d, v in pts:
            out.append(f'<circle cx="{xc[d]:.1f}" cy="{yv(v):.1f}" r="7" fill="transparent"><title>{d.month}/{d.day} {v:,.0f}{unit}</title></circle>')
        d, v = pts[-1]
        out.append(f'<circle cx="{xc[d]:.1f}" cy="{yv(v):.1f}" r="4" fill="{C["blue"]}" stroke="{C["surface"]}" stroke-width="2"/>')
        if label_last:
            out.append(f'<text x="{xc[d] + 8:.1f}" y="{yv(v) + 4:.1f}" class="val">{v:,.0f}</text>')
    out.append("</svg>")
    return "".join(out)


def hbar_chart(rows, w=680, unit="回"):
    """rows = [(ラベル, 値, 補足)]。横棒。値は棒の先に書く"""
    rows = [r for r in rows if r[1] is not None]
    if not rows:
        return '<div class="empty">データ蓄積中</div>'
    L, R, rh = 150, 150, 30
    h = rh * len(rows) + 22
    vmax = max(v for _, v, _ in rows) or 1
    ticks = nice_ticks(vmax)
    ymax = ticks[-1]
    sx = lambda v: L + (w - L - R) * v / ymax  # noqa: E731
    out = [f'<svg viewBox="0 0 {w} {h}" class="chart" role="img">']
    for t in ticks:
        out.append(f'<line x1="{sx(t):.1f}" x2="{sx(t):.1f}" y1="0" y2="{h - 18}" stroke="{C["axis"] if t == 0 else C["grid"]}"/>')
        out.append(f'<text x="{sx(t):.1f}" y="{h - 4}" text-anchor="middle" class="tick">{fmt_tick(t)}</text>')
    for i, (lab, v, note) in enumerate(rows):
        y = i * rh + 6
        bh = 16
        x1 = sx(v)
        r = min(4, (x1 - L) / 2, bh / 2)
        out.append(f'<text x="{L - 8}" y="{y + 12}" text-anchor="end" class="lab">{esc(lab)}</text>')
        if v > 0:
            out.append(f'<path d="M{L},{y} H{x1 - r:.1f} Q{x1:.1f},{y} {x1:.1f},{y + r:.1f} V{y + bh - r:.1f} '
                       f'Q{x1:.1f},{y + bh} {x1 - r:.1f},{y + bh} H{L} Z" fill="{C["blue"]}"><title>{esc(lab)} {v:,.0f}{unit}</title></path>')
        out.append(f'<text x="{x1 + 6:.1f}" y="{y + 12}" class="val">{v:,.0f}{unit}<tspan class="tick"> {esc(note)}</tspan></text>')
    out.append("</svg>")
    return "".join(out)


def tile(label, value, cur=None, prev=None, prev_label="先週", note="", unit=""):
    """KPIタイル: ラベル・今週値・先週比（上がった=緑▲・下がった=赤▼。どちらも記号＋文字つき）"""
    if cur is not None and prev is not None:
        g = pct(cur, prev)
        if g is None:
            delta = f'<div class="delta">{prev_label} {n0(prev)}{unit}</div>'
        else:
            up = g >= 0
            delta = (f'<div class="delta" style="color:{C["good"] if up else C["bad"]}">{"▲" if up else "▼"} {g * 100:+.0f}%'
                     f'<span class="sub">（{prev_label} {n0(prev)}{unit}）</span></div>')
    else:
        delta = ""
    return (f'<div class="tile"><div class="tl">{esc(label)}</div><div class="tv">{value}</div>{delta}'
            f'{f"<div class=tn>{esc(note)}</div>" if note else ""}</div>')


def table(head, rows, num_cols=(), nowrap=()):
    cls = lambda i: " ".join(c for c, on in (("num", i in num_cols), ("nw", i in nowrap)) if on)  # noqa: E731
    out = ['<table><thead><tr>'] + [f'<th class="{cls(i)}">{esc(h)}</th>' for i, h in enumerate(head)]
    out.append("</tr></thead><tbody>")
    for r in rows:
        out.append("<tr>" + "".join(f'<td class="{cls(i)}">{c}</td>' for i, c in enumerate(r)) + "</tr>")
    out.append("</tbody></table>")
    return "".join(out)


# ====================================================================== 集計: 記事

def articles(today):
    r = wr.build(today)
    gc0, ge, gp0, gp1, cur, prev = r["gsc"]
    ac0, ae, ap0, ap1, ga_rows, ga_days = r["ga"]
    sess = next(x for x in ga_rows if x[0] == "セッション")
    pv = next(x for x in ga_rows if x[0] == "PV")
    gsc_daily = {wr.d(x["date"]): int(x["impressions"]) for x in wr.read_csv("gsc.csv")}
    clk_daily = {wr.d(x["date"]): int(x["clicks"]) for x in wr.read_csv("gsc.csv")}
    ga_daily = {wr.d(x["date"]): int(x["pageviews"]) for x in wr.read_csv("ga4.csv")}
    imp_series = [(ge - timedelta(days=i), gsc_daily.get(ge - timedelta(days=i))) for i in range(27, -1, -1)]
    clk_series = [(ge - timedelta(days=i), clk_daily.get(ge - timedelta(days=i))) for i in range(27, -1, -1)]
    pv_series = [(ae - timedelta(days=i), ga_daily.get(ae - timedelta(days=i))) for i in range(27, -1, -1)]
    return dict(r=r, gsc=(gc0, ge, gp0, gp1), ga=(ac0, ae, ap0, ap1), cur=cur, prev=prev, sess=sess, pv=pv,
                ga_days=ga_days, imp_series=imp_series, clk_series=clk_series, pv_series=pv_series)


# ====================================================================== 集計: リール

def snapshots(folder, today):
    out = []
    for p in sorted(folder.glob("*.json")):
        d = load(p, {})
        if d.get("fetched_at"):
            at = datetime.fromisoformat(d["fetched_at"])
            if at.astimezone(JST).date() <= today:
                out.append((at, d.get("items", {})))
    return out


def value_at(snaps, mid, t, target_h, lo, hi):
    """投稿 t から target_h 時間に一番近いスナップショットの値（lo〜hi 時間の範囲だけ）"""
    best, got = None, None
    for at, items in snaps:
        if mid in items:
            h = (at - t).total_seconds() / 3600
            if lo <= h <= hi and (best is None or abs(h - target_h) < best):
                best, got = abs(h - target_h), items[mid]
    return got


def reels(today, ws, we):
    idx = load(IG / "media_index.json", {})
    snaps = snapshots(IG / "media", today)
    latest_at, latest = (snaps[-1] if snaps else (None, {}))
    rows = []
    for mid, m in idx.items():
        if not m.get("timestamp"):
            continue
        t = ts(m["timestamp"])
        cur = latest.get(mid)
        at72 = value_at(snaps, mid, t, 72, 48, 120)
        if at72 is None and cur is not None and latest_at and (latest_at - t).total_seconds() >= 72 * 3600:
            at72 = cur  # 計測を始める前の投稿は現在値で代用（72時間以降の伸びは小さい・ig/report.py と同じ考え方）
        rows.append(dict(m, mid=mid, t=t, cur=cur, at72=at72))
    week = [x for x in rows if ws <= x["t"].date() <= we]
    pweek = [x for x in rows if ws - timedelta(days=7) <= x["t"].date() <= we - timedelta(days=7)]

    daily = load(IG / "account_daily.json", {})
    series = [(we - timedelta(days=i), (daily.get((we - timedelta(days=i)).isoformat()) or {}).get("views")) for i in range(27, -1, -1)]
    cur_days = [(we - timedelta(days=i)) for i in range(7)]
    have = [dd for dd in cur_days if (daily.get(dd.isoformat()) or {}).get("views") is not None]
    vsum = sum(daily[dd.isoformat()]["views"] for dd in have) if have else None
    psum_days = [dd - timedelta(days=7) for dd in have if (daily.get((dd - timedelta(days=7)).isoformat()) or {}).get("views") is not None]
    psum = sum(daily[dd.isoformat()]["views"] for dd in psum_days) if psum_days and len(psum_days) == len(have) else None
    follows = sum((daily.get(dd.isoformat()) or {}).get("follows") or 0 for dd in have)
    unfollows = sum((daily.get(dd.isoformat()) or {}).get("unfollows") or 0 for dd in have)

    fol = []
    p = IG / "account_snapshots.jsonl"
    if p.exists():
        for line in p.read_text(encoding="utf-8").splitlines():
            try:
                x = json.loads(line)
                fol.append((datetime.fromisoformat(x["at"]).astimezone(JST), x.get("followers")))
            except (ValueError, KeyError):
                pass
    fol = [(a, f) for a, f in fol if f is not None and a.date() <= today]
    f_end = fol[-1] if fol else None
    before = [x for x in fol if x[0].date() <= ws]
    f_start = before[-1] if before else (fol[0] if fol else None)

    # ジャンル（型）別: 直近28日に投稿したリールの72時間時点の再生の中央値
    g = defaultdict(list)
    for x in rows:
        if we - timedelta(days=27) <= x["t"].date() <= we and x["at72"] and x["at72"].get("views") is not None:
            g[x.get("template") if x.get("auto") else None].append(x["at72"]["views"])
    genres = sorted(((TEMPLATE_LABEL.get(k, k), med(v), len(v)) for k, v in g.items()), key=lambda z: -(z[1] or 0))
    return dict(week=week, pweek=pweek, series=series, have=len(have), vsum=vsum, psum=psum,
                follows=follows, unfollows=unfollows, f_start=f_start, f_end=f_end, genres=genres,
                fetched=latest_at)


# ====================================================================== 集計: Threads

TH_KEYS = ["views", "likes", "replies", "reposts", "quotes", "shares"]
TH_LABEL = {"views": "表示", "likes": "いいね", "replies": "返信", "reposts": "再投稿", "quotes": "引用", "shares": "シェア"}


def threads(today, ws, we):
    posted = load(TH_STATE, {}).get("posted", {})
    index = load(TH / "posts_index.json", {})
    snaps = snapshots(TH / "posts", today)
    latest_at, latest = (snaps[-1] if snaps else (None, {}))
    posts = []
    for key, p in posted.items():
        pid = p.get("post_id")
        if not pid or not p.get("posted_utc"):
            continue
        t = ts(p["posted_utc"])
        info = index.get(pid, {})
        posts.append(dict(pid=pid, t=t, text=" ".join((info.get("text") or "").split()), permalink=info.get("permalink") or p.get("permalink", ""),
                          cur=latest.get(pid), at48=value_at(snaps, pid, t, 48, 36, 72)))
    week = [x for x in posts if ws <= x["t"].date() <= we]
    pweek = [x for x in posts if ws - timedelta(days=7) <= x["t"].date() <= we - timedelta(days=7)]
    both = week + pweek
    basis = "at48" if both and all(x["at48"] for x in both) else "cur"

    def agg(rs):
        vals = [x[basis] for x in rs if x[basis]]
        tot = {k: sum(v.get(k) or 0 for v in vals) for k in TH_KEYS}
        n = len(vals)
        return dict(n=len(rs), measured=n, tot=tot, avg={k: (tot[k] / n if n else None) for k in TH_KEYS})

    daily = load(TH / "account_daily.json", {})
    series = [(we - timedelta(days=i), (daily.get((we - timedelta(days=i)).isoformat()) or {}).get("views")) for i in range(27, -1, -1)]
    have = [dd for dd, v in series[-7:] if v is not None]
    vsum = sum(daily[dd.isoformat()]["views"] for dd in have) if have else None
    pdays = [dd - timedelta(days=7) for dd in have]
    psum = sum(daily[dd.isoformat()]["views"] for dd in pdays) if pdays and all(
        (daily.get(dd.isoformat()) or {}).get("views") is not None for dd in pdays) else None
    fol = sorted((date.fromisoformat(k), v) for k, v in load(TH / "followers.json", {}).items() if date.fromisoformat(k) <= today)

    # 時間帯別（参考）: 直近28日の投稿で、投稿から48時間以上たったものの表示（48時間値・無ければ現在値）
    band = defaultdict(list)
    for x in posts:
        v = x["at48"] or (x["cur"] if latest_at and (latest_at - x["t"]).total_seconds() >= 48 * 3600 else None)
        if v and we - timedelta(days=27) <= x["t"].date() <= we:
            band[hour_band(x["t"].hour)].append(v.get("views") or 0)
    return dict(week=week, pweek=pweek, basis=basis, cur=agg(week), prev=agg(pweek), series=series, have=len(have),
                vsum=vsum, psum=psum, fol=fol, band=band, fetched=latest_at, n_snaps=len(snaps))


def hour_band(h):
    for lo, hi, name in ((0, 6, "深夜 0-5時"), (6, 10, "朝 6-9時"), (10, 14, "昼 10-13時"), (14, 18, "午後 14-17時"),
                         (18, 21, "夜 18-20時"), (21, 24, "夜遅め 21-23時")):
        if lo <= h < hi:
            return name


def react_avg(a):
    if not a["measured"]:
        return None
    return sum(v for k, v in a["tot"].items() if k != "views") / a["measured"]


def engagement(v):
    return sum((v or {}).get(k) or 0 for k in TH_KEYS if k != "views")


# ====================================================================== 要点・提案（数字から機械的に言えることだけ）

def summary_lines(A, R, T):
    L = []
    c, p = A["cur"], A["prev"]
    g = pct(c["imp"], p["imp"])
    L.append(f"記事：検索に出た回数は{c['imp']:,}回（先週{p['imp']:,}回・{'—' if g is None else f'{g * 100:+.0f}%'}）、"
             f"検索から読みに来た回数は{c['clk']:,}回（先週{p['clk']:,}回）。")
    top = A["r"]["top_up"]
    if top:
        n, a, b = top[0]
        L.append(f"記事：検索で一番伸びたのは「{cut(wr.title(A['r'], n), 30)}」（{a:,}→{b:,}回）。")
    if R["vsum"] is not None:
        g = pct(R["vsum"], R["psum"])
        L.append(f"リール：今週{len(R['week'])}本を投稿。アカウント全体の再生は{R['vsum']:,}回"
                 + (f"（先週の同じ曜日{R['have']}日分 {R['psum']:,}回・{g * 100:+.0f}%）。" if g is not None else "（先週分はデータなし）。"))
    if R["week"]:
        best = max(R["week"], key=lambda x: (x["cur"] or {}).get("views") or 0)
        if best["cur"]:
            L.append(f"リール：今週一番見られたのは「{cut(best.get('headline') or '', 28)}」（再生{best['cur'].get('views', 0):,}回）。")
    tc, tp = T["cur"], T["prev"]
    if tc["n"]:
        L.append(f"Threads：今週の速報{tc['n']}本で表示{tc['tot']['views']:,}回・1本平均{n0(tc['avg']['views'])}回"
                 + (f"（先週{tp['n']}本・平均{n0(tp['avg']['views'])}回）。" if tp["measured"] else "。"))
    else:
        L.append("Threads：今週投稿した速報は0本。")
    return L[:5]


def suggestions(A, R, T):
    S = []
    gs = [x for x in R["genres"] if x[2] >= MIN_N]
    if len(gs) >= 2 and gs[0][1] >= (gs[1][1] or 0) * 1.2:  # 2割以上の差がある時だけ（小さい差で「優先」と言わない）
        top, second = gs[0], gs[1]
        S.append((f"リールは「{top[0]}」型を優先する",
                  f"直近28日の投稿から72時間時点の再生の中央値：「{top[0]}」{n0(top[1])}回（{top[2]}本） ＞ 「{second[0]}」{n0(second[1])}回（{second[2]}本）"))
    bands = sorted(((k, med(v), len(v)) for k, v in T["band"].items() if len(v) >= MIN_N), key=lambda z: -(z[1] or 0))
    if len(bands) >= 2:
        S.append((f"Threads速報は「{bands[0][0]}」の投稿が伸びやすい（参考）",
                  f"直近28日の表示の中央値：{bands[0][0]} {n0(bands[0][1])}回（{bands[0][2]}本） ＞ {bands[-1][0]} {n0(bands[-1][1])}回（{bands[-1][2]}本）。速報は話題の大きさに左右されるので傾向の目安"))
    if T["week"]:
        rated = [(x, engagement(x[T["basis"]]) / x[T["basis"]]["views"]) for x in T["week"] if x[T["basis"]] and x[T["basis"]].get("views")]
        if rated:
            x, rr = max(rated, key=lambda z: z[1])
            S.append(("反応率が一番高かった速報の切り口を次も試す",
                      f"「{cut(x['text'], 34)}」 反応率{rr * 100:.1f}%（いいね・返信・再投稿・引用・シェアの合計÷表示）"))
    c = A["r"]["cands"]
    if c:
        k, i, cl, p = c[0]
        S.append((f"「{k}」の記事を書く・強化する", f"直近28日で検索に{i:,}回出ているが平均{p:.1f}位（2ページ目付近）"))
    cc = A["r"]["ctr_cands"]
    if cc:
        n, i, p = cc[0]
        S.append((f"記事{n}のタイトルを見直す", f"「{cut(wr.title(A['r'], n), 30)}」 直近28日で検索に{i}回出てクリック0（平均{p:.1f}位）"))
    return S


# ====================================================================== HTML

CSS = f"""
@page {{ size: A4; margin: 13mm 13mm 12mm; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; font-family: system-ui, -apple-system, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif;
  color: {C['ink']}; background: #fff; font-size: 10.5pt; line-height: 1.55; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
.page {{ page-break-after: always; break-after: page; }}
.page:last-child {{ page-break-after: auto; break-after: auto; }}
header.top {{ display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {C['ink']}; padding-bottom: 4px; margin-bottom: 10px; }}
header.top .brand {{ font-weight: 700; letter-spacing: .08em; font-size: 10pt; }}
header.top .pg {{ color: {C['muted']}; font-size: 9pt; }}
h1 {{ font-size: 24pt; margin: 18px 0 2px; line-height: 1.25; }}
h2 {{ font-size: 15pt; margin: 0 0 2px; }}
h3 {{ font-size: 11.5pt; margin: 14px 0 4px; }}
.period {{ color: {C['ink2']}; font-size: 9.5pt; margin-bottom: 8px; }}
.tiles {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 6px 0 4px; }}
.tile {{ border: 1px solid rgba(11,11,11,.10); border-radius: 8px; padding: 8px 10px; background: {C['surface']}; }}
.tl {{ font-size: 9.5pt; color: {C['ink2']}; }}
.tv {{ font-size: 19pt; font-weight: 600; line-height: 1.25; }}
.tv small {{ font-size: 10pt; font-weight: 400; color: {C['ink2']}; }}
.delta {{ font-size: 9.5pt; font-weight: 600; }}
.delta .sub {{ font-weight: 400; color: {C['ink2']}; }}
.tn {{ font-size: 8.5pt; color: {C['muted']}; margin-top: 2px; }}
.axis-title {{ font-weight: 700; font-size: 11pt; margin: 12px 0 2px; display: flex; gap: 8px; align-items: baseline; }}
.axis-title .p {{ font-weight: 400; color: {C['ink2']}; font-size: 9pt; }}
ul.points {{ margin: 6px 0 0; padding-left: 1.2em; }}
ul.points li {{ margin: 3px 0; }}
.chart {{ width: 100%; height: auto; display: block; }}
.chart .tick {{ font-size: 12px; fill: {C['muted']}; }}
.chart .val {{ font-size: 13px; fill: {C['ink']}; font-weight: 600; }}
.chart .lab {{ font-size: 13px; fill: {C['ink2']}; }}
.cap {{ font-size: 9pt; color: {C['ink2']}; margin: 0 0 2px; }}
.two {{ display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }}
table {{ width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-top: 4px; }}
th {{ text-align: left; font-weight: 600; color: {C['ink2']}; border-bottom: 1px solid {C['axis']}; padding: 3px 5px; }}
td {{ border-bottom: 1px solid {C['grid']}; padding: 3px 5px; vertical-align: top; }}
.nw {{ white-space: nowrap; }}
.num {{ text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }}
.note {{ font-size: 8.5pt; color: {C['muted']}; margin-top: 4px; }}
.empty {{ border: 1px dashed {C['axis']}; border-radius: 8px; padding: 14px; color: {C['ink2']}; font-size: 9.5pt; text-align: center; }}
.verdict-good {{ color: {C['good']}; font-weight: 600; }}
.verdict-bad {{ color: {C['bad']}; font-weight: 600; }}
.sugg {{ border-left: 3px solid {C['blue']}; padding: 4px 0 4px 10px; margin: 10px 0; }}
.sugg b {{ font-size: 11pt; }}
.sugg div {{ font-size: 9.5pt; color: {C['ink2']}; }}
a {{ color: {C['blue']}; text-decoration: none; }}
"""


def head(pg, total, today):
    return f'<header class="top"><span class="brand">610 JOURNAL ／ 週次レポート {today:%Y-%m-%d}</span><span class="pg">{pg} / {total}</span></header>'


def md(d):
    return f"{d.month}/{d.day}"


def render(today, A, R, T, summ, sugg):
    ws, we = today - timedelta(days=7), today - timedelta(days=1)
    gc0, ge, gp0, gp1 = A["gsc"]
    ac0, ae, ap0, ap1 = A["ga"]
    total = 6
    P = []

    # ---- 1. 表紙＋今週のまとめ
    c, p = A["cur"], A["prev"]
    tc, tp = T["cur"], T["prev"]
    fol_delta = (R["f_end"][1] - R["f_start"][1]) if R["f_end"] and R["f_start"] else None
    t_art = [tile("検索に出た回数", n0(c["imp"]), c["imp"], p["imp"]),
             tile("検索から読みに来た回数", n0(c["clk"]), c["clk"], p["clk"]),
             tile("サイト訪問", n0(A["sess"][1]), A["sess"][1], A["sess"][2], note="GA4のセッション数")]
    t_reel = [tile("投稿したリール", f"{len(R['week'])}<small> 本</small>", len(R["week"]), len(R["pweek"]), unit="本"),
              tile("アカウント全体の再生", n0(R["vsum"]), R["vsum"], R["psum"],
                   note=f"先週の同じ曜日{R['have']}日分と比較" if R["vsum"] is not None else "データ蓄積中"),
              tile("フォロワー増減", "—" if fol_delta is None else f"{fol_delta:+,}<small> 人</small>",
                   note=f"{md(R['f_start'][0])}→{md(R['f_end'][0])}（{R['f_end'][1]:,}人）" if fol_delta is not None else "データ蓄積中")]
    t_th = [tile("投稿した速報", f"{tc['n']}<small> 本</small>", tc["n"], tp["n"], unit="本"),
            tile("1本あたりの見られた回数", n0(tc["avg"]["views"]), tc["avg"]["views"], tp["avg"]["views"],
                 note="経過日数が違うので先週比は参考" if T["basis"] == "cur" else "投稿48時間時点の値で比較"),
            tile("1本あたりの反応", n0(react_avg(tc)), react_avg(tc), react_avg(tp),
                 note="いいね・返信・再投稿・引用・シェアの合計")]
    P.append(f"""<section class="page">{head(1, total, today)}
<h1>週次レポート<br>記事・リール・Threads</h1>
<div class="period">レポート日 {today:%Y年%-m月%-d日}（月）　リール・Threads の集計期間 {md(ws)}〜{md(we)}（先週 {md(ws - timedelta(days=7))}〜{md(we - timedelta(days=7))}）</div>
<h3>今週のまとめ</h3>
<ul class="points">{''.join(f'<li>{esc(x)}</li>' for x in summ)}</ul>
<div class="axis-title">記事（サイト・検索）<span class="p">検索 {md(gc0)}〜{md(ge)}／訪問 {md(ac0)}〜{md(ae)}（検索は確定待ちの直近3日を除く）</span></div>
<div class="tiles">{''.join(t_art)}</div>
<div class="axis-title">リール（Instagram @sixten）<span class="p">{md(ws)}〜{md(we)}</span></div>
<div class="tiles">{''.join(t_reel)}</div>
<div class="axis-title">Threads 速報（@muwe.c）<span class="p">{md(ws)}〜{md(we)} に投稿した速報</span></div>
<div class="tiles">{''.join(t_th)}</div>
<div class="note">▲緑＝先週より増えた／▼赤＝先週より減った。数字はすべて自動取得の実測値。</div>
</section>""")

    # ---- 2. 記事
    r = A["r"]
    up_rows = [[f"{n}", esc(cut(wr.title(r, n), 40)), f"{a:,}", f"{b:,}", f"+{b - a:,}"] for n, a, b in r["top_up"]]
    verd = []
    for x in r["results"]:
        v = x["verdict"]
        cls = "verdict-good" if v.startswith("うまく") else "verdict-bad" if v.startswith("ダメ") else ""
        mark = "○ " if cls == "verdict-good" else "× " if cls == "verdict-bad" else "… "
        ch = x["exp"]["change"]
        verd.append([f'<b>{esc(x["exp"]["playbook"])}</b>　{esc(cut(ch, 46))}',
                     f'<span class="{cls}">{mark}{esc(v)}</span>'])
    cands = [[f"「{esc(k)}」", f"{i:,}", f"{pp:.1f}位"] for k, i, cl, pp in r["cands"][:5]]
    ctr = [[n, esc(cut(wr.title(r, n), 40)), f"{i:,}", f"{pp:.1f}位"] for n, i, pp in r["ctr_cands"][:5]]
    ga_note = f'<div class="note">GA4は今週分{A["ga_days"]}日分だけ（設置2026-09-13）。先週比は参考。</div>' if A["ga_days"] < 7 else ""
    P.append(f"""<section class="page">{head(2, total, today)}
<h2>記事（サイト・検索）</h2>
<div class="period">検索（Search Console）{md(gc0)}〜{md(ge)} vs {md(gp0)}〜{md(gp1)}／サイト訪問（GA4）{md(ac0)}〜{md(ae)} vs {md(ap0)}〜{md(ap1)}</div>
<div class="tiles">{tile("検索に出た回数", n0(c["imp"]), c["imp"], p["imp"])}{tile("検索から読みに来た回数", n0(c["clk"]), c["clk"], p["clk"])}{tile("ページが読まれた回数", n0(A["pv"][1]), A["pv"][1], A["pv"][2], note="GA4のPV")}</div>{ga_note}
<h3>検索に出た回数（日別・直近4週）</h3>
{time_chart(A["imp_series"], gc0)}
<div class="two"><div><h3>検索から読みに来た回数（日別）</h3>{time_chart(A["clk_series"], gc0, w=330, h=170)}</div>
<div><h3>ページが読まれた回数（日別・GA4）</h3>{time_chart(A["pv_series"], ac0, w=330, h=170)}</div></div>
<h3>検索で伸びた記事 トップ5（検索に出た回数・先週→今週）</h3>
{table(["No", "記事", "先週", "今週", "増加"], up_rows, (2, 3, 4)) if up_rows else '<div class="empty">伸びた記事なし</div>'}
</section>
<section class="page">{head(3, total, today)}
<h2>記事（サイト・検索）つづき：施策の判定と次の一手</h2>
<div class="period">施策は「開始前14日 vs 開始後14日」で比較（既存の週次レポートと同じ判定基準）</div>
<h3>改善施策の判定</h3>
{table(["やったこと", "判定"], verd) if verd else '<div class="empty">施策なし</div>'}
<h3>次に書くといい記事（検索に出ているが8〜20位の検索語・直近28日）</h3>
{table(["検索語", "検索に出た回数", "平均順位"], cands, (1, 2)) if cands else '<div class="empty">該当なし</div>'}
<h3>次にタイトルを直すといい記事（検索に10回以上出てクリック0・直近28日）</h3>
{table(["No", "記事", "検索に出た回数", "平均順位"], ctr, (2, 3)) if ctr else '<div class="empty">該当なし</div>'}
<div class="note">判定の基準：表示30回未満は判定保留／タイトル施策は対照群とのクリック率の差±1pt／表示施策は伸び率の差±20%／新記事は同時期の新記事の中央値の1.5倍・0.67倍。</div>
</section>""")

    # ---- 3. リール
    wk = sorted(R["week"], key=lambda x: -((x["cur"] or {}).get("views") or 0))
    rk = []
    for x in wk[:5]:
        v = x["cur"] or {}
        head_ = esc(cut(x.get("headline") or x.get("caption") or "（見出しなし）", 38))
        link = f'<a href="{esc(x.get("permalink", ""))}">{head_}</a>' if x.get("permalink") else head_
        rk.append([f"{md(x['t'])}", link, n0(v.get("views")), n0(v.get("reach")), n0(v.get("saved")), n0(v.get("shares"))])
    gen = [(g, m, f"（{n}本）") for g, m, n in R["genres"] if n >= MIN_N]
    few = "・".join(f"{g} {n0(m)}回（{n}本）" for g, m, n in R["genres"] if n < MIN_N)
    fol_txt = (f"{md(R['f_start'][0])} {R['f_start'][1]:,}人 → {md(R['f_end'][0])} {R['f_end'][1]:,}人（{fol_delta:+,}人）。"
               f"期間中の新規フォロー{R['follows']:,}・フォロー解除{R['unfollows']:,}（IG集計）") if fol_delta is not None else "データ蓄積中"
    P.append(f"""<section class="page">{head(4, total, today)}
<h2>リール（Instagram @sixten）</h2>
<div class="period">集計期間 {md(ws)}〜{md(we)}（先週 {md(ws - timedelta(days=7))}〜{md(we - timedelta(days=7))}）</div>
<div class="tiles">{''.join(t_reel)}</div>
<div class="note">フォロワー：{esc(fol_txt)}</div>
<h3>アカウント全体の再生（日別・直近4週）</h3>
<div class="cap">濃い青＝今週。IGの日別集計は米国太平洋時間の1日区切り（日本時間の16〜17時で日付が変わる）</div>
{time_chart(R["series"], ws, kind="bar")}
<h3>今週投稿したリール 再生ランキング Top5</h3>
{table(["投稿日", "見出し", "再生", "届いた人数", "保存", "シェア"], rk, (2, 3, 4, 5), nowrap=(0,)) if rk else '<div class="empty">今週投稿したリールの数字がまだ無い</div>'}
<div class="note">現時点の累計（{R['fetched'].strftime('%-m/%-d %H:%M') if R['fetched'] else '—'} 取得）。投稿日が早いほど数字が積み上がる点に注意。</div>
<h3>ジャンル（型）別 再生の中央値（直近28日の投稿・投稿72時間時点）</h3>
{hbar_chart(gen)}
<div class="note">中央値＝真ん中の1本の値（バズった1本に引っぱられにくい）。{MIN_N}本未満の型はグラフから外した{('：' + esc(few)) if few else ''}。</div>
</section>""")

    # ---- 4. Threads
    basis_note = ("投稿から48時間時点の値で揃えて比較" if T["basis"] == "at48"
                  else "今の累計で比較（投稿からの経過日数が違うので参考。毎日の記録が溜まると自動で「投稿48時間時点」の比較に切り替わる）")
    rows = []
    for lab, a in (("今週", tc), ("先週", tp)):
        rows.append([f"{lab}（{a['n']}本）"] + [n0(a["tot"][k]) if a["measured"] else "—" for k in TH_KEYS]
                    + [n0(a["avg"]["views"])])
    tops = sorted([x for x in T["week"] if x[T["basis"]]], key=lambda x: -(x[T["basis"]].get("views") or 0))[:5]
    trows = []
    for x in tops:
        v = x[T["basis"]]
        rr = engagement(v) / v["views"] * 100 if v.get("views") else None
        txt = esc(cut(x["text"] or "（本文未取得）", 40))
        trows.append([md(x["t"]), f'<a href="{esc(x["permalink"])}">{txt}</a>', n0(v.get("views")), n0(v.get("likes")),
                      n0(v.get("replies")), n0(v.get("reposts")), "—" if rr is None else f"{rr:.1f}%"])
    fol = T["fol"]
    if len(fol) >= 2:
        fol_html = time_chart(fol, fol[-1][0] + timedelta(days=1), unit="人", h=150)
    elif fol:
        fol_html = f'<div class="note" style="font-size:9.5pt;color:{C["ink2"]}">フォロワー {fol[-1][1]:,}人（{md(fol[-1][0])}時点）。毎日の記録を始めたばかりなので、推移のグラフはデータ蓄積中。</div>'
    else:
        fol_html = '<div class="empty">データ蓄積中</div>'
    g = pct(T["vsum"], T["psum"])
    acc_note = (f"直近{T['have']}日の合計 {T['vsum']:,}回" + (f"（先週の同じ日数 {T['psum']:,}回・{g * 100:+.0f}%）" if g is not None else "")) if T["vsum"] is not None else "データ蓄積中"
    P.append(f"""<section class="page">{head(5, total, today)}
<h2>Threads 速報（@muwe.c）</h2>
<div class="period">{md(ws)}〜{md(we)} に投稿した速報（先週 {md(ws - timedelta(days=7))}〜{md(we - timedelta(days=7))}）。{esc(basis_note)}</div>
<div class="tiles">{''.join(t_th)}</div>
<h3>今週分と先週分の合計</h3>
{table(["", "表示", "いいね", "返信", "再投稿", "引用", "シェア", "1本平均の表示"], rows, (1, 2, 3, 4, 5, 6, 7))}
<h3>反応が大きかった速報 Top5（表示の多い順）</h3>
{table(["投稿日", "本文の冒頭", "表示", "いいね", "返信", "再投稿", "反応率"], trows, (2, 3, 4, 5, 6), nowrap=(0,)) if trows else '<div class="empty">今週の速報の数字がまだ無い</div>'}
<div class="note">反応率＝（いいね＋返信＋再投稿＋引用＋シェア）÷表示。本文をタップすると投稿が開く。</div>
<h3>アカウント全体の見られた回数（日別・参考）</h3>
<div class="cap">⚠️ @muwe.c はクリス個人の投稿も含むので参考値。{esc(acc_note)}。米国太平洋時間の1日区切り</div>
{time_chart(T["series"], ws, kind="bar", h=150)}
<h3>フォロワー数の推移（参考・アカウント全体）</h3>
{fol_html}
</section>""")

    # ---- 5. 来週やるといいこと
    sg = "".join(f'<div class="sugg"><b>{i}. {esc(a)}</b><div>根拠：{esc(b)}</div></div>' for i, (a, b) in enumerate(sugg, 1)) \
        or '<div class="empty">データから言える提案はまだ無い（データ蓄積中）</div>'
    P.append(f"""<section class="page">{head(6, total, today)}
<h2>来週やるといいこと</h2>
<div class="period">データから機械的に言えることだけを、根拠の数字つきで並べています（推測や感想は入れていません）。</div>
{sg}
<h3>この資料の数字の出どころ</h3>
<ul class="points" style="font-size:9.5pt;color:{C['ink2']}">
<li>記事：Google Search Console（検索）と Google アナリティクス 4（サイト訪問）。毎朝自動で取得。</li>
<li>リール：Instagram の公式インサイト。毎朝8:30に全リールの累計を記録（{R['fetched'].strftime('%-m/%-d') if R['fetched'] else '—'} 取得分まで）。</li>
<li>Threads：Threads の公式インサイト。毎朝8:40に速報{len(load(TH_STATE, {}).get('posted', {}))}本の累計を記録（記録 {T['n_snaps']}日分）。</li>
<li>表記：検索に出た回数＝表示回数／検索から読みに来た回数＝クリック数／届いた人数＝リーチ。</li>
</ul>
</section>""")
    return f"""<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>610 JOURNAL 週次レポート {today:%Y-%m-%d}</title>
<style>{CSS}</style></head><body>{''.join(P)}</body></html>"""


def render_txt(today, A, R, T, summ, sugg):
    ws, we = today - timedelta(days=7), today - timedelta(days=1)
    L = [f"610 JOURNAL 週次レポート（記事・リール・Threads）{today:%Y-%m-%d}", "",
         f"■ 今週のまとめ（リール・Threads は {md(ws)}〜{md(we)}）"]
    L += [f"・{x}" for x in summ]
    L += ["", "■ 来週やるといいこと"]
    L += [f"{i}. {a}\n   根拠：{b}" for i, (a, b) in enumerate(sugg, 1)] or ["・データ蓄積中"]
    L += ["", "詳しくは添付PDF（グラフ・ランキング・施策の判定つき）をご覧ください。",
          "（このメールは毎週月曜に自動送信されています）", ""]
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date", help="レポート日付 YYYY-MM-DD（既定: 今日 JST）")
    ap.add_argument("--out", help="出力先ディレクトリ（既定: analytics/data/reports）")
    a = ap.parse_args()
    today = date.fromisoformat(a.date) if a.date else datetime.now(JST).date()
    out = Path(a.out) if a.out else wr.REPORTS
    out.mkdir(parents=True, exist_ok=True)
    ws, we = today - timedelta(days=7), today - timedelta(days=1)
    A, R, T = articles(today), reels(today, ws, we), threads(today, ws, we)
    summ, sugg = summary_lines(A, R, T), suggestions(A, R, T)
    (out / f"{today:%Y-%m-%d}.deck.html").write_text(render(today, A, R, T, summ, sugg), encoding="utf-8")
    (out / f"{today:%Y-%m-%d}.deck.txt").write_text(render_txt(today, A, R, T, summ, sugg), encoding="utf-8")
    print(out / f"{today:%Y-%m-%d}.deck.html")
    print(out / f"{today:%Y-%m-%d}.deck.txt")


if __name__ == "__main__":
    main()
