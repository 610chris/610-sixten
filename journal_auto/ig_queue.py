#!/usr/bin/env python3
"""610 JOURNAL → Instagram 投稿キュー（テキスト側）

記事が1本公開されるたびに、IG投稿1本分のテキスト（見出し・要点3行・キャプション・出典）を
`journal_auto/ig_queue.json` に積む。画像は `ig_card.py`、投稿は `ig_post.py` が担当する。

    state の流れ:
        pending ──(クリスが承認)──> approved ──(ig_post.py)──> posted
            └────(見送り)────> skipped

記事HTMLから機械的に取れるもの（カテゴリ・日付・URL・ヒーロー画像・写真クレジット）は
自分で読む。クラウドルーチンが書くのは「人間が書いた方がいいもの」＝見出し・要点3行・
キャプションだけでよい。省略されても記事のOGPから埋めるので落ちない。

使い方:
    python3 journal_auto/ig_queue.py add 134 \
        --headline "adidas AE3「Cold Blooded」9月18日発売" \
        --points "3代目シグネチャーの新色" "品番KH8537" "adidas.comと一部取扱店"
    python3 journal_auto/ig_queue.py list [--state pending]
    python3 journal_auto/ig_queue.py approve 134 135
    python3 journal_auto/ig_queue.py skip 134
    python3 journal_auto/ig_queue.py reset 134      # 承認/見送りを取り消して未承認に戻す
    python3 journal_auto/ig_queue.py show 134
"""

import argparse
import glob
import html
import json
import os
import re
import sys
from datetime import datetime, timezone, timedelta

JST = timezone(timedelta(hours=9))

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUEUE = os.path.join(ROOT, "journal_auto", "ig_queue.json")
JOURNAL_DIR = os.path.join(ROOT, "site", "journal")
ASSETS_DIR = os.path.join(ROOT, "site", "assets")
SITE = "https://sixten.jp"

TAGS_BASE = ["#610", "#sixten", "#バスケ", "#バスケットボール", "#basketball"]
TAGS_BY_CAT = {
    "NBA": ["#NBA", "#nba", "#バスケ好きと繋がりたい"],
    "JAPAN": ["#Bリーグ", "#bleague", "#日本バスケ"],
    "KICKS": ["#バッシュ", "#スニーカー", "#kicks", "#sneakers"],
    "CULTURE": ["#バスケカルチャー", "#hoops"],
    "REPORT": ["#バスケ", "#hoops"],
}


# ---------------------------------------------------------------- 記事HTML読み

def article_path(article_id):
    aid = str(article_id).zfill(3)
    hits = sorted(glob.glob(os.path.join(JOURNAL_DIR, f"{aid}-*.html")))
    return hits[0] if hits else None


def _meta(text, prop):
    for attr in ("property", "name"):
        m = re.search(rf'<meta\s+{attr}="{re.escape(prop)}"\s+content="(.*?)"\s*/?>', text, re.S)
        if m:
            return html.unescape(m.group(1)).strip()
    return ""


def article_meta(article_id):
    """記事HTMLから機械的に取れるものを全部読む"""
    path = article_path(article_id)
    if not path:
        raise SystemExit(f"記事HTMLが見つからない: {str(article_id).zfill(3)}-*.html")
    text = open(path, encoding="utf-8").read()

    canonical = ""
    m = re.search(r'<link\s+rel="canonical"\s+href="(.*?)"', text)
    if m:
        canonical = html.unescape(m.group(1)).strip()

    # 写真クレジットは本文1つ目の figcaption から取る（CC BY-SA の表示義務をここで担保）
    credit = ""
    m = re.search(r"<figcaption>(.*?)</figcaption>", text, re.S)
    if m:
        credit = html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
        credit = re.sub(r"^画像[:：]\s*", "", credit)

    slug = os.path.basename(path)[:-5]
    hero = os.path.join(ASSETS_DIR, f"journal-{str(article_id).zfill(3)}-hero.jpg")
    return {
        "slug": slug,
        "title": _meta(text, "og:title"),
        "excerpt": _meta(text, "og:description"),
        "category": _meta(text, "article:section") or "NBA",
        "date": _meta(text, "article:published_time") or datetime.now(JST).strftime("%Y-%m-%d"),
        "url": canonical or f"{SITE}/journal/{slug}.html",
        "photo_credit": credit,
        "hero_path": hero if os.path.exists(hero) else "",
    }


# ---------------------------------------------------------------- キュー入出力

def load():
    if not os.path.exists(QUEUE):
        return {"updated": "", "items": []}
    with open(QUEUE, encoding="utf-8") as f:
        return json.load(f)


def save(data):
    data["updated"] = datetime.now(JST).isoformat(timespec="seconds")
    tmp = QUEUE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    os.replace(tmp, QUEUE)


def find(data, article_id):
    aid = str(article_id).zfill(3)
    for it in data["items"]:
        if it["id"] == aid:
            return it
    return None


# ---------------------------------------------------------------- キャプション

def build_caption(item):
    """キャプション未指定時の既定フォーマット。

    IGは本文中のURLがリンクにならないので導線は「プロフィールのリンク」に寄せる。
    写真クレジットは CC BY-SA の表示義務なので必ず入れる（消さないこと）。
    """
    lines = [item["headline"], ""]
    if item.get("points"):
        lines += ["・" + p for p in item["points"]] + [""]
    elif item.get("excerpt"):
        lines += [item["excerpt"], ""]
    lines.append("詳しくは 610バスケットボールジャーナル（プロフィールのリンク）から。")
    lines.append("")
    if item.get("source"):
        lines.append(f"出典: {item['source']}")
    if item.get("photo_credit"):
        lines.append(f"写真: {item['photo_credit']}")
    lines.append("")
    lines.append(" ".join(dict.fromkeys(TAGS_BASE + TAGS_BY_CAT.get(item.get("category", ""), []))))
    return "\n".join(lines)


# ---------------------------------------------------------------- コマンド

def cmd_add(args):
    data = load()
    aid = str(args.id).zfill(3)
    meta = article_meta(aid)
    item = {
        "id": aid,
        "slug": meta["slug"],
        "category": args.category or meta["category"],
        "date": (args.date or meta["date"])[:10],
        "headline": args.headline or meta["title"],
        "excerpt": meta["excerpt"],
        "points": [p.strip() for p in (args.points or []) if p.strip()][:3],
        "source": args.source or "",
        "photo_credit": args.photo_credit or meta["photo_credit"],
        "url": meta["url"],
        "hero_path": meta["hero_path"],
        "images": [],
        "state": "pending",
        "created": datetime.now(JST).isoformat(timespec="seconds"),
        "posted_at": None,
        "ig_media_id": None,
        "error": None,
    }
    item["caption"] = args.caption or build_caption(item)

    old = find(data, aid)
    if old:
        if old["state"] == "posted":
            print(f"[skip] {aid} は投稿済みなので触らない")
            return
        item["state"] = old["state"]
        item["images"] = old["images"]
        data["items"] = [item if x["id"] == aid else x for x in data["items"]]
        print(f"[update] {aid} {item['headline']}")
    else:
        data["items"].append(item)
        print(f"[add] {aid} {item['headline']}")
    save(data)


def cmd_list(args):
    items = [i for i in load()["items"] if not args.state or i["state"] == args.state]
    if not items:
        print("（該当なし）")
        return
    for it in items:
        img = f"{len(it['images'])}枚" if it["images"] else "画像なし"
        print(f"{it['id']}  {it['state']:<8} {it['category']:<7} {img:<6} {it['headline']}")


def cmd_show(args):
    it = find(load(), args.id)
    if not it:
        raise SystemExit(f"キューに {args.id} が無い")
    print(json.dumps(it, ensure_ascii=False, indent=2))


def _set_state(ids, state):
    data = load()
    for i in ids:
        it = find(data, i)
        if not it:
            print(f"[!] キューに {i} が無い")
            continue
        if it["state"] == "posted":
            print(f"[skip] {it['id']} は投稿済み")
            continue
        it["state"] = state
        print(f"[{state}] {it['id']} {it['headline']}")
    save(data)


def cmd_approve(args):
    _set_state(args.ids, "approved")


def cmd_skip(args):
    _set_state(args.ids, "skipped")


def cmd_reset(args):
    """承認・見送り・失敗を取り消して pending（＝未承認）に戻す。

    承認を間違えた時と、動作確認で一時的に approve した時の戻し口。posted は触らない。
    """
    _set_state(args.ids, "pending")


def main():
    ap = argparse.ArgumentParser(description="610 JOURNAL → IG 投稿キュー")
    sub = ap.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("add", help="記事をキューに積む")
    a.add_argument("id")
    a.add_argument("--headline", help="IG用の短い見出し（省略時はog:title）")
    a.add_argument("--points", nargs="*", help="要点3行（2枚目のカードに載る）")
    a.add_argument("--caption", help="キャプション全文（省略時は自動生成）")
    a.add_argument("--source", help="出典（例: Nice Kicks / Shams Charania（ESPN））")
    a.add_argument("--photo-credit", dest="photo_credit", help="省略時は記事のfigcaptionから")
    a.add_argument("--category")
    a.add_argument("--date")
    a.set_defaults(func=cmd_add)

    l = sub.add_parser("list", help="キュー一覧")
    l.add_argument("--state", choices=["pending", "approved", "posted", "skipped", "failed"])
    l.set_defaults(func=cmd_list)

    s = sub.add_parser("show", help="1件の中身をJSONで見る")
    s.add_argument("id")
    s.set_defaults(func=cmd_show)

    av = sub.add_parser("approve", help="承認（これをしないと投稿されない）")
    av.add_argument("ids", nargs="+")
    av.set_defaults(func=cmd_approve)

    sk = sub.add_parser("skip", help="見送り")
    sk.add_argument("ids", nargs="+")
    sk.set_defaults(func=cmd_skip)

    rs = sub.add_parser("reset", help="承認/見送り/失敗を取り消して未承認(pending)に戻す")
    rs.add_argument("ids", nargs="+")
    rs.set_defaults(func=cmd_reset)

    args = ap.parse_args()
    args.func(args)


if __name__ == "__main__":
    sys.exit(main())
