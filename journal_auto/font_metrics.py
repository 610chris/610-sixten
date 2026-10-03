#!/usr/bin/env python3
"""同梱フォントの実測文字幅を測って journal_video/src/metrics.ts を書き出す。

2026-10-04 クリス指示「句読点改行とかそのワードに主語述語までは一文に収まるように
改行ルールを直してほしい」で追加。

それまで幅の見積もりは theme.ts の `visualLength`（半角=0.55・全角=1.0 の概算）だった。
Noto Sans JP の実測はこれとずれていて（wght900 で "N"=0.764 / "A"=0.660 / "B"=0.695）、
たとえば「NBA拡張、シルバー委員長が」は概算 12.65em に対し実測 13.12em。
75px で描くと 984px になり、文字を置いてよい 950px を 34px はみ出して、
ブラウザ側の折り返しが「が」1文字だけを次の行へ落としていた
（＝改行ルールが決めた行とは別の場所で勝手に折れていた）。

ここでフォントから実際の送り幅を測ってテーブルにしておけば、
改行ルールが「この行は収まる」と判断した行は本当に収まる。

    python3 journal_auto/font_metrics.py        # 測って metrics.ts を更新
    python3 journal_auto/font_metrics.py --check # 差分があるかだけ見る（CIで使える）
"""

import json
import os
import sys

from PIL import ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, "journal_video", "public", "fonts", "NotoSansJP-Variable.ttf")
OUT = os.path.join(ROOT, "journal_video", "src", "metrics.ts")
QUEUE = os.path.join(ROOT, "journal_auto", "ig_queue.json")

# 測る太さ。theme.ts で実際に使っている weight（本文500・引用/タグ700・見出し900）
WEIGHTS = (500, 700, 900)
# 測定用のフォントサイズ（大きいほど丸め誤差が小さい）
EM = 1000
# 全角とみなす既定値。テーブルに無い文字はこの幅として安全側に見積もる
DEFAULT_W = 1.0


def charset():
    """テーブルに入れる文字を集める。ASCII 全部＋実際の記事に出てくる文字。"""
    chars = {chr(c) for c in range(0x20, 0x7F)}
    if os.path.exists(QUEUE):
        items = json.load(open(QUEUE, encoding="utf-8"))["items"]
        for it in items:
            for key in ("headline", "excerpt", "question", "source", "photo_credit"):
                chars |= set(it.get(key) or "")
            for p in it.get("points") or []:
                chars |= set(p)
    return chars


def measure():
    """weight → {文字: 幅(em)}。幅が DEFAULT_W と違う文字だけ残す。"""
    table = {}
    for w in WEIGHTS:
        f = ImageFont.truetype(FONT, EM)
        f.set_variation_by_axes([w])
        row = {}
        for ch in sorted(charset()):
            if ch in "\n\r\t":
                continue
            em = round(f.getlength(ch) / EM, 4)
            if abs(em - DEFAULT_W) > 0.0005:
                row[ch] = em
        table[w] = row
    return table


def render(table):
    lines = [
        "/**",
        " * フォントの実測文字幅（em単位）。journal_auto/font_metrics.py が自動生成する。",
        " * 手で書き換えないこと（フォントを差し替えたら生成し直す）。",
        " *",
        " * 2026-10-04 追加。それまでの概算（半角0.55・全角1.0）は Noto Sans JP の実寸とずれていて、",
        " * 改行ルールが『収まる』と判断した行が実際には枠をはみ出し、ブラウザの折り返しが",
        " * 行末の1文字だけを次の行へ落としていた（「NBA拡張、シルバー委員長／が」）。",
        " *",
        f" * 載っていない文字は {DEFAULT_W} em（全角）として扱う。CJK はすべて 1.0 em なので表に出てこない。",
        " */",
        "",
        f"export const DEFAULT_GLYPH_WIDTH = {DEFAULT_W};",
        "",
        "/** weight → 文字 → 送り幅(em)。この表に無い文字は DEFAULT_GLYPH_WIDTH */",
        "export const GLYPH_WIDTH: Record<number, Record<string, number>> = {",
    ]
    for w in WEIGHTS:
        row = table[w]
        pairs = ", ".join(f"{json.dumps(ch, ensure_ascii=False)}: {v}" for ch, v in row.items())
        lines.append(f"  {w}: {{ {pairs} }},")
    lines += [
        "};",
        "",
        "/** 測ってある weight（近いものを使う） */",
        f"export const METRIC_WEIGHTS = [{', '.join(str(w) for w in WEIGHTS)}] as const;",
        "",
    ]
    return "\n".join(lines)


def main():
    table = measure()
    text = render(table)
    old = open(OUT, encoding="utf-8").read() if os.path.exists(OUT) else ""
    if "--check" in sys.argv:
        print("差分なし" if old == text else "差分あり（font_metrics.py を実行して更新してください）")
        sys.exit(0 if old == text else 1)
    with open(OUT, "w", encoding="utf-8") as fh:
        fh.write(text)
    for w in WEIGHTS:
        print(f"wght={w}: 既定(1.0em)以外の文字 {len(table[w])} 種")
    print("書き出し:", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
