/**
 * 本文の折り返し。
 *
 * 2026-10-04 クリス指示「本文の中もちょっと気持ち悪くて、本文に句読点が全くないから
 * それは気持ち悪いし、もうちょっと文章長くてもいいかな。12行ぐらい内容深掘っても
 * いいんじゃないかな」で追加。
 *
 * それまで本文（BodyLines.tsx）は改行を CSS に任せていた。CSS は幅に入るところで切るだけ
 * なので「落選組はシ／アトルへ」のように語の途中で折れた。見出し（headline.ts）はすでに
 * 日本語の切れ目を点数で選ぶようにしてあるので、同じ点数（breakScore）を本文にも使う。
 *
 * 見出しとの違いは、本文は「1行を何行に割るか」ではなく「与えられた文を上から順に流す」こと。
 * なので行ごとに貪欲（幅いっぱいまで使う）＋ルックバック（行末の手前に自然な切れ目があれば
 * そこまで戻す）で切る。フォントサイズは行数が増えると小さくなる（theme.ts の段階表）ので、
 * 大きいサイズから順に試して「そのサイズで折ったときの行数」と整合する最大のサイズを選ぶ。
 */

import { breakScore } from "./headline";
import { BODY, BODY_SIZE_STEPS, bodyFontSize, SAFE_WIDTH, textWidthEm } from "./theme";

/** 本文の太さ。幅の実測テーブルを引くのに使う */
const WEIGHT = BODY.fontWeight;

/**
 * 行末から戻ってよい割合。行の 72% より手前まで戻すのは行が短くなりすぎるので、
 * そこに切れ目が無ければ語の内部を許す（relaxed）→ それでも無ければ幅で切る。
 */
const LOOKBACK = 0.72;

/** 行頭に置くと気持ち悪いので、1文字だけ前の行の末尾にぶら下げる文字 */
const HANGING = /[、。，．）」』】〉》！？!?]/;

/** 幅 maxEm に収まる最後の文字位置（1文字も入らないときは1） */
const widthLimit = (text: string, maxEm: number): number => {
  let width = 0;
  let limit = 0;
  for (let i = 0; i < text.length; i += 1) {
    width += textWidthEm(text[i], WEIGHT);
    if (width > maxEm) break;
    limit = i + 1;
  }
  return Math.max(1, limit);
};

/**
 * limit までの範囲で切る位置。行末をできるだけ使いつつ、点数の高い切れ目を選ぶ
 * （同点なら後ろ＝行を長く使う）。自然な切れ目が無ければ null。
 */
const findCut = (text: string, limit: number): number | null => {
  const from = Math.max(1, Math.floor(limit * LOOKBACK));
  for (const relaxed of [false, true]) {
    let cut = 0;
    let best = 0;
    for (let i = from; i <= limit; i += 1) {
      const score = breakScore(text, i, relaxed);
      if (score > 0 && score >= best) {
        best = score;
        cut = i;
      }
    }
    if (cut) return cut;
  }
  return null;
};

/** 1つの文を、幅 maxEm に収まる複数行に折る */
const wrapToWidth = (text: string, maxEm: number): string[] => {
  const out: string[] = [];
  let rest = text;
  while (rest) {
    if (textWidthEm(rest, WEIGHT) <= maxEm) {
      out.push(rest);
      break;
    }
    const limit = widthLimit(rest, maxEm);
    let cut = findCut(rest, limit);
    if (cut === null) {
      // 自然な切れ目が無い（長い英単語・記号の列など）。幅で切るが、
      // 次の行頭が句読点になるなら1文字だけぶら下げる
      cut = HANGING.test(rest[limit] ?? "") ? limit + 1 : limit;
    }
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  return out.filter(Boolean);
};

/**
 * 本文を画面に流せる行の配列とフォントサイズに整える。
 * 入力の1要素は「1つの文（段落）」。画面の幅に入らなければ意味の切れ目で折る。
 */
export const layoutBody = (
  input: string[],
): { lines: string[]; fontSize: number } => {
  const sentences = input
    .map((line) => line.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  if (!sentences.length) return { lines: [], fontSize: BODY_SIZE_STEPS[0].fontSize };

  let result: { lines: string[]; fontSize: number } = {
    lines: sentences,
    fontSize: BODY_SIZE_STEPS[0].fontSize,
  };
  for (const { fontSize } of BODY_SIZE_STEPS) {
    const maxEm = SAFE_WIDTH / fontSize;
    const lines = sentences.flatMap((text) => wrapToWidth(text, maxEm));
    result = { lines, fontSize };
    // この行数ならこのサイズで出してよい（＝縮めた結果が自分の段階と矛盾しない）
    if (fontSize <= bodyFontSize(lines.length)) return result;
  }
  return result;
};
