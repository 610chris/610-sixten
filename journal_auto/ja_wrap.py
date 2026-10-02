#!/usr/bin/env python3
"""日本語の「切ってよい位置」の点数付け。

2026-10-02 クリス指示「改行ルールを記事ページのOG画像・カルーセル画像にも流用」で追加。
動画の見出し改行（`journal_video/src/headline.ts` の `breakScore`）と同じルールを Python へ
移植したもの。元のロジックは、幅に入るところで機械的に折ると
「エンビード「このチームには本気で興／奮している」」のように語の途中や助詞の前で折れる問題を
直すために作った。ルールは

  ① 句読点・閉じカッコ・ダッシュ・助詞の後・文字種の変わり目は切ってよく、自然さを点数で表す
  ② 語の内部（カタカナ語・熟語・英数字の語の途中）は原則として切らない
  ③ 行頭が助詞・ひらがなになる切り方は送り仮名や活用語尾を割っていることが多いので避ける
  ④ 禁則（行頭に「、。」」、行末に「「（」）は常に守る

`relaxed=True` は最後の手段で、他に切れる場所が無いときだけ語の内部を許す。

※ 点数と判定は headline.ts と同じ値に揃えてある。片方を直したら両方直すこと。
"""

import re

# 行頭に置けない文字
NO_START = re.compile(r"[、。，．）」』】〉》”’!?！？・ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ々〜:：;；＆&×✕／/\s]")
# 行末に置けない文字
NO_END = re.compile(r"[（「『【〈《“‘]")
ALNUM = re.compile(r"[0-9A-Za-z]")
# 英数の語を作る文字。B.PREMIER / Jr. / 3.5 のピリオド、2026-27 / 114-37 のハイフンも
# 語の一部として扱う（「2026-／27シーズン」で割れるのを防ぐ）
WORDCHAR = re.compile(r"[0-9A-Za-z.\-]")
HIRA = re.compile(r"[ぁ-ん]")
KATA = re.compile(r"[ァ-ヴー]")
KANJI = re.compile(r"[一-龥]")
# 直後で切ってよい助詞（1文字）
PARTICLE = re.compile(r"[はがをにでともへやのかばねよわ]")
# 語の一部になりにくい＝ほぼ確実に助詞と言える文字。このあとなら次がひらがなでも切ってよい。
# 「と」「の」「か」は「こと」「もの」「たか」のように語尾にも現れるのでこちらには入れない
STRONG_PARTICLE = re.compile(r"[がをはにでも]")
SPACE = re.compile(r"\s")
# 数量の単位。数字のあとのこれは語の一部なので切らない（「9月26／日」「5／人の」を防ぐ）
UNIT_CHAR = re.compile(r"[日月年時分秒週人名回戦本点位個枚件勝敗度割円万億兆％%歳番台試]")
# カタカナの単位。数字・漢数単位のあとに続くときだけ語の一部とみなす（「3000万／ドル」を防ぐ）
KATA_UNIT = ("ドル", "ユーロ", "ポイント", "パーセント", "メートル", "センチ", "キロ", "インチ",
             "ヤード", "ゲーム", "シーズン", "イニング", "シート")
DIGIT = re.compile(r"[0-9]")
LATIN = re.compile(r"[A-Za-z]")


def _at(text, i):
    """範囲外は空文字（TS の text[i] ?? "" 相当。Python の負インデックスを踏まないため）"""
    return text[i] if 0 <= i < len(text) else ""


def kind(ch):
    """文字種（切れ目の点数に使う）"""
    if ALNUM.match(ch):
        return "a"
    if HIRA.match(ch):
        return "h"
    if KATA.match(ch):
        return "k"
    if KANJI.match(ch):
        return "j"
    return "o"


def break_score(text, i, relaxed=False):
    """text[i-1] と text[i] の間で改行してよいか、よいなら自然さの点数（大きいほど自然）。

    切ってはいけない位置は 0 を返す。relaxed=True のときだけ、語の内部（同じ文字種の連続）も
    最後の手段として許す。
    """
    if i <= 0 or i >= len(text):
        return 0
    prev, ch = text[i - 1], text[i]
    if NO_START.match(ch) or NO_END.match(prev):
        return 0
    # 英数字の語の途中では切らない（Air Jordan / 1226万ドル / B.PREMIER / V.A.A. など）
    if WORDCHAR.match(prev) and WORDCHAR.match(ch) and (ALNUM.match(prev) or ALNUM.match(ch)):
        return 0
    # 数量の内部では切らない（「9月26／日発売」「罰金3000万／ドル」）
    if (ALNUM.match(prev) or UNIT_CHAR.match(prev)) and UNIT_CHAR.match(ch):
        return 0
    if (ALNUM.match(prev) or UNIT_CHAR.match(prev)) and text[i:].startswith(KATA_UNIT):
        return 0
    # 行頭が助詞になる切り方は禁則（「このチームに／は本気で」「LeBron Witness 10」／がこの〜」）
    if PARTICLE.match(ch):
        return 0
    # 半角スペース。ただし「Air Jordan 4」のように英字のあとの数字は製品名の一部なので他へ譲る
    if SPACE.match(prev):
        return 3 if DIGIT.match(ch) and LATIN.match(_at(text, i - 2) or " ") else 11
    if re.match(r"[、。，．]", prev):
        return 12                                            # 読点・句点のあと
    if re.match(r"[」』）】〉》]", prev):
        return 10                                            # 発言・カッコの閉じたあと
    if prev == "—" and _at(text, i - 2) == "—":
        return 10                                            # 「——」のあと
    if ch == "—":
        return 8                                             # 「——」の前
    if re.match(r"[「『（【〈《]", ch):
        return 9                                             # 発言・カッコの開く前
    # ほぼ確実に助詞と言える文字のあとは、次がひらがなでも切ってよい
    prev2 = _at(text, i - 2)
    if STRONG_PARTICLE.match(prev) and not (prev2 and PARTICLE.match(prev2)):
        return 6
    # 句読点やカッコを挟まずに行頭がひらがなになる切り方は、送り仮名・活用語尾・複合語を
    # 割っていることがほとんど（「前向／きなことだ」「届いてい／ない」）
    if HIRA.match(ch) and not relaxed:
        return 0
    if PARTICLE.match(prev) and not (prev2 and PARTICLE.match(prev2)):
        return 6                                             # 助詞のあと
    kp, kc = kind(prev), kind(ch)
    # 同じ文字種の連続＝ひとつの語の内部。カタカナ語や熟語を割るのでふつうは切らない
    if kp == kc:
        return 1 if relaxed else 0
    if kp == "h":
        return 5                                             # ひらがな → 漢字・カタカナ・英数
    if kp == "k":
        return 4
    if kp == "j" and kc == "h":
        return 2                                             # 漢字 → ひらがな（送り仮名を割りやすい）
    return 3
