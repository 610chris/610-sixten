#!/usr/bin/env python3
"""リポジトリ肥大の見張り。

記事1本ごとに縦型動画（site/assets/journal/video/NNN.mp4）が git に積まれるので、
放っておくと clone が重くなる。GitHub の推奨は 1リポジトリ 1GB 以下なので、
  1. いまの GitHub 上のリポジトリサイズ（API の size・KB単位）
  2. 何が容量を食っているか（履歴上の blob をディレクトリ別に集計）
  3. 記事の公開ペース × 動画1本の平均サイズ から出した増加ペースと閾値到達の予測日
を測って repo_size_history.json に記録し、閾値を超えたら知らせる。

判断（間引く / LFS / 外部配信に移す）は人がやる。このスクリプトは測って知らせるだけで、
ファイルを消したり履歴を書き換えたりは一切しない。

  python3 journal_auto/repo_size_check.py            # レポートを表示して履歴に記録
  python3 journal_auto/repo_size_check.py --no-save  # 記録せず表示だけ
  python3 journal_auto/repo_size_check.py --json     # 機械向け

終了コード: 0=正常 / 0=警告（WARN・CIは緑のまま）/ 1=危険（CRIT・CIを赤くする）
"""
import argparse
import json
import os
import re
import subprocess
import sys
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

AUTO = Path(__file__).resolve().parent  # journal_auto/
ROOT = AUTO.parent
VIDEO_DIR = ROOT / "site/assets/journal/video"
IG_QUEUE = AUTO / "ig_queue.json"
HISTORY = AUTO / "repo_size_history.json"
JST = timezone(timedelta(hours=9))

MB = 1024 * 1024
LIMIT_MB = 1024      # GitHub の推奨上限（1GB）
WARN_MB = 700        # ここを超えたら間引きの検討を始める
CRIT_MB = 900        # ここを超えたら CI を落として気づかせる
PACE_DAYS = 14       # 公開ペースを見る窓（直近N日）


def sh(cmd, cwd=ROOT):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    return r.stdout if r.returncode == 0 else ""


def github_size_mb():
    """GitHub が数えているリポジトリサイズ(MB)。取れなければ None。"""
    url = sh(["git", "remote", "get-url", "origin"]).strip()
    m = re.search(r"github\.com[:/]+([^/]+/[^/.]+)", url)
    if not m:
        return None, None
    slug = m.group(1)
    out = sh(["gh", "api", f"repos/{slug}", "--jq", ".size"]).strip()
    if not out.isdigit():
        return None, slug
    return int(out) / 1024, slug  # API の size は KB


def local_pack_mb():
    """ローカルの pack サイズ(MB)。gh が使えないときのフォールバック。"""
    for line in sh(["git", "count-objects", "-v"]).splitlines():
        if line.startswith("size-pack:"):
            return int(line.split()[1]) / 1024  # KiB
    return None


def blob_breakdown():
    """履歴上の全 blob をディレクトリ別に集計する（圧縮後のディスク占有）。

    CI の checkout は浅い（fetch-depth:1）ので履歴が無い。そのときは数えずに空で返す
    （全履歴を取りに行くと毎週リポジトリ全体を fetch することになる）。
    """
    if sh(["git", "rev-parse", "--is-shallow-repository"]).strip() == "true":
        return [], 0
    rev = subprocess.run(["git", "rev-list", "--objects", "--all"],
                         cwd=ROOT, capture_output=True, text=True)
    if rev.returncode != 0:
        return [], 0
    cat = subprocess.run(
        ["git", "cat-file", "--batch-check=%(objecttype) %(objectsize:disk) %(rest)"],
        cwd=ROOT, input=rev.stdout, capture_output=True, text=True)
    size, count, total = Counter(), Counter(), 0
    for line in cat.stdout.splitlines():
        p = line.split(" ", 2)
        if len(p) < 3 or p[0] != "blob":
            continue
        n, path = int(p[1]), p[2]
        total += n
        size[bucket(path)] += n
        count[bucket(path)] += 1
    rows = [(v, count[k], k) for k, v in size.most_common()]
    return rows, total


def bucket(path):
    """容量の犯人を人の言葉で言えるところまでまとめる。"""
    if path.startswith("site/assets/journal/video/"):
        return "記事の縦型動画 site/assets/journal/video/"
    if re.match(r"site/assets/reels?[-/]", path):
        return "IGリール同期 site/assets/reel*"
    ext = os.path.splitext(path)[1].lower()
    if ext in (".mp4", ".mov", ".webm"):
        return f"その他の動画 ({ext})"
    if ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        return "画像"
    if ext == ".html":
        return "記事HTML"
    if ext in (".ttf", ".otf", ".woff", ".woff2"):
        return "フォント"
    return f"その他 ({ext or 'なし'})"


def video_stats():
    """いま git に入っている記事動画の本数と平均サイズ。"""
    files = sorted(VIDEO_DIR.glob("*.mp4")) if VIDEO_DIR.exists() else []
    total = sum(f.stat().st_size for f in files)
    return len(files), total, (total / len(files) if files else 0)


def publish_pace():
    """直近 PACE_DAYS 日の記事本数/日。記事1本 = 動画1本。"""
    if not IG_QUEUE.exists():
        return None, 0, 0
    q = json.loads(IG_QUEUE.read_text(encoding="utf-8"))
    items = q["items"] if isinstance(q, dict) else q
    today = datetime.now(JST).date()
    since = today - timedelta(days=PACE_DAYS)
    recent, oldest = 0, None
    for it in items:
        d = str(it.get("date") or it.get("created") or "")[:10]
        try:
            day = date.fromisoformat(d)
        except ValueError:
            continue
        if oldest is None or day < oldest:
            oldest = day
        if since <= day <= today:
            recent += 1
    if not recent:
        return None, 0, 0
    # 運用開始が窓より新しいうちは実働日数で割る（14で割ると立ち上げ期を過小評価する）。
    # 当日は書きかけなので分母に入れない。
    window = PACE_DAYS
    if oldest and oldest > since:
        window = max(1, (today - oldest).days)
    return recent / window, recent, window


def fmt_days(n):
    if n is None:
        return "—"
    if n > 3650:
        return "10年以上先"
    d = datetime.now(JST).date() + timedelta(days=int(n))
    return f"約{int(n)}日後（{d.isoformat()} 頃）"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-save", action="store_true", help="履歴に記録しない")
    ap.add_argument("--json", action="store_true", help="JSON で出す")
    args = ap.parse_args()

    gh_mb, slug = github_size_mb()
    size_mb = gh_mb if gh_mb is not None else local_pack_mb()
    source = "GitHub API" if gh_mb is not None else "ローカル pack（API が使えなかった）"

    n_vid, vid_total, vid_avg = video_stats()
    per_day, recent, window = publish_pace()
    rows, blob_total = blob_breakdown()

    # 増加ペース: 記事1本につき動画1本。動画以外（HTML・JSON）は1本あたり数十KBなので
    # 実績の比率（履歴上の記事HTML ÷ 動画）で上乗せして概算する。
    grow_per_day = (per_day * vid_avg / MB) if (per_day and vid_avg) else None
    if grow_per_day:
        grow_per_day *= 1.15  # 記事HTML・sitemap・JSON ぶんの上乗せ
    to_warn = to_crit = to_limit = None
    if grow_per_day and size_mb is not None and grow_per_day > 0:
        to_warn = max(0, (WARN_MB - size_mb) / grow_per_day)
        to_crit = max(0, (CRIT_MB - size_mb) / grow_per_day)
        to_limit = max(0, (LIMIT_MB - size_mb) / grow_per_day)

    if size_mb is None:
        level = "UNKNOWN"
    elif size_mb >= CRIT_MB:
        level = "CRIT"
    elif size_mb >= WARN_MB:
        level = "WARN"
    else:
        level = "OK"

    today = datetime.now(JST).date().isoformat()
    record = {
        "date": today,
        "size_mb": round(size_mb, 1) if size_mb is not None else None,
        "size_source": source,
        "videos": n_vid,
        "videos_mb": round(vid_total / MB, 1),
        "video_avg_kb": round(vid_avg / 1024) if vid_avg else 0,
        "articles_per_day": round(per_day, 2) if per_day else None,
        "growth_mb_per_day": round(grow_per_day, 2) if grow_per_day else None,
        "level": level,
    }

    hist = []
    if HISTORY.exists():
        try:
            hist = json.loads(HISTORY.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            hist = []
    if not args.no_save:
        hist = [h for h in hist if h.get("date") != today] + [record]
        hist.sort(key=lambda h: h["date"])
        HISTORY.write_text(json.dumps(hist, ensure_ascii=False, indent=2) + "\n",
                           encoding="utf-8")

    if args.json:
        print(json.dumps({"now": record, "breakdown": [
            {"mb": round(m / MB, 1), "count": c, "kind": k} for m, c, k in rows[:12]
        ]}, ensure_ascii=False, indent=2))
        return 1 if level == "CRIT" else 0

    mark = {"OK": "✅", "WARN": "⚠️", "CRIT": "🛑", "UNKNOWN": "❓"}[level]
    lines = [
        f"# リポジトリ肥大の見張り（{today}）",
        "",
        f"{mark} **{size_mb:.0f} MB** / 警告 {WARN_MB} MB / 危険 {CRIT_MB} MB"
        f"（GitHub 推奨上限 {LIMIT_MB} MB）" if size_mb is not None else f"{mark} サイズを取得できなかった",
        f"　取得元: {source}" + (f" / {slug}" if slug else ""),
        "",
        "## 増え方",
        f"- 記事動画: {n_vid}本 / {vid_total / MB:.1f} MB（平均 {vid_avg / 1024:.0f} KB/本）",
        f"- 公開ペース: 直近{window}日で {recent}本 = **{per_day:.1f}本/日**" if per_day
        else "- 公開ペース: 取得できなかった",
        f"- 増加ペース: **約 {grow_per_day:.2f} MB/日**（≒ {grow_per_day * 365:.0f} MB/年）" if grow_per_day
        else "- 増加ペース: 算出できなかった",
        "",
        "## 閾値に届くまで",
        f"- 警告 {WARN_MB} MB: {fmt_days(to_warn)}",
        f"- 危険 {CRIT_MB} MB: {fmt_days(to_crit)}",
        f"- 上限 {LIMIT_MB} MB: {fmt_days(to_limit)}",
        "",
        "## 何が容量を食っているか（履歴上の blob・圧縮後）",
    ]
    if rows:
        lines.append(f"合計 {blob_total / MB:.0f} MB")
        for m, c, k in rows[:8]:
            lines.append(f"- {m / MB:7.1f} MB　{c:6d}件　{k}")
    else:
        lines.append("（履歴が無い clone なので数えていない。"
                     "内訳を見るときは手元で `python3 journal_auto/repo_size_check.py`）")

    if level in ("WARN", "CRIT"):
        lines += [
            "",
            "## 閾値を超えた（人の判断が要る）",
            "選択肢は3つ。どれも本番の見え方に関わるのでクリスが決める。",
            "1. 古い記事の動画を間引く（git から消すと本番からも消える）",
            "2. 動画だけ Git LFS に移す（clone は軽くなる・LFS の帯域課金に注意）",
            "3. 動画を外部配信（R2 / Cloudflare Stream 等）に移し、記事からはURL参照にする",
        ]

    out = "\n".join(lines)
    print(out)

    # CI では job のサマリにも出す（ログを開かなくても GitHub の画面で読める）
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write(out + "\n")

    return 1 if level == "CRIT" else 0


if __name__ == "__main__":
    sys.exit(main())
