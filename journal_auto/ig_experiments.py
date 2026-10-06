"""@sixten リールのキャプション実験（growth/ig/experiments.json の status=running だけ効かせる）

reel_post.py が投稿直前のキャプションに apply() をかけ、返ってきたアームを video_status.json の
exp_arms に残す。growth/ig/fetch_ig.py がそれを media_index.json に写し、report.py が判定する。

変えてよいのは CTA の1行だけ（見出し・要点・出典・写真クレジット・ハッシュタグには触らない）。
何か1つでもおかしければ元のキャプションをそのまま返す＝投稿は絶対に止めない。
"""

import hashlib, json, os
from datetime import date, datetime

EXPERIMENTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "growth", "ig", "experiments.json")

COMMENT_LINE = "👇 コメントで教えて！"
FOLLOW_A = "👉 最新のバスケニュースは @sixten をフォローしてチェック"


def _running(today):
    try:
        exps = json.load(open(EXPERIMENTS, encoding="utf-8")).get("experiments", [])
    except Exception:
        return {}
    out = {}
    for e in exps:
        try:
            if e.get("status") == "running" and \
                    date.fromisoformat(e["started"]) <= today <= date.fromisoformat(e["ends"]):
                out[e["id"]] = e
        except Exception:
            continue
    return out


def arm_by_hash(exp_id, article_id):
    h = hashlib.sha256(f"{exp_id}:{article_id}".encode()).digest()[0]
    return "A" if h % 2 == 0 else "B"


def arm_by_week(day):
    return "A" if day.isocalendar()[1] % 2 == 0 else "B"


def apply(caption, item, now=None):
    """(新しいキャプション, {実験ID: アーム}) を返す。対象外は 'na'"""
    try:
        now = now or datetime.now()
        today = now.date()
        exps = _running(today)
        arms = {}
        manual = bool(item.get("caption_manual"))
        lines = caption.split("\n")

        e = exps.get("ig-2026-10-share-cta")
        if e:
            if manual or item.get("no_question") or COMMENT_LINE not in lines:
                arms[e["id"]] = "na"
            else:
                arm = arm_by_hash(e["id"], item.get("id", ""))
                arms[e["id"]] = arm
                if arm == "B":
                    i = lines.index(COMMENT_LINE)
                    lines.insert(i + 1, e["arms"]["B"])

        e = exps.get("ig-2026-10-follow-cta")
        if e:
            if manual or FOLLOW_A not in lines:
                arms[e["id"]] = "na"
            else:
                arm = arm_by_week(today)
                arms[e["id"]] = arm
                if arm == "B":
                    lines[lines.index(FOLLOW_A)] = e["arms"]["B"]
        return "\n".join(lines), arms
    except Exception:
        return caption, {}
