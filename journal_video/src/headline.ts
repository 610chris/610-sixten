/**
 * 見出しの改行。
 *
 * 2026-10-02 クリス指示「タイトルの改行のタイミングが非常に悪い。今は無理に2行にしようとしてるから
 * 改行がうまくいってない。基本は2行だけど場合によっては3行がありっていう状態にして」で追加。
 *
 * それまでは長さだけでフォントサイズを段階的に決め、折り返しは CSS に任せていた。CSS は幅に入る
 * ところで切るだけなので「エンビード「このチームには本気で興／奮している」」のように語の途中や
 * 助詞の前で折れた。ここでは
 *   ① 日本語として切ってよい位置（句読点・閉じカッコ・ダッシュ・助詞の後・文字種の変わり目）に点数を付け
 *   ② 語の内部（カタカナ語・熟語・英単語の途中）は原則として切らず
 *   ③ 2行で割って、収まる文字サイズが小さくなりすぎるときだけ3行にし
 *   ④ 文字サイズがほぼ同じ割り方が複数あるなら、点数の高い＝意味の切れ目で割る
 * という順で行を決める。禁則（行頭に「、。」」や単独の助詞、行末に「「（」）も守る。
 */

import { HEADLINE, SAFE_WIDTH, textWidthEm } from "./theme";

/** 見出しの太さ。幅の実測テーブルを引くのに使う */
const WEIGHT = HEADLINE.fontWeight;

/** 行数ごとのフォントサイズ上限。行数が増えるぶん1行を小さくして縦の高さを揃える */
const MAX_SIZE = [0, 104, 92, 72] as const;
/** 2行のままで許せるフォントサイズの下限。これを下回るなら3行に逃がす */
const TWO_LINE_MIN = 62;
/** 3行で許せるフォントサイズの下限。これを下回るなら語の内部を切ってでも大きくする */
const THREE_LINE_MIN = 52;
/** 1行で出すフォントサイズの下限（これ未満になるなら2行にする） */
const ONE_LINE_MIN = 88;
/**
 * 文字サイズの許容差。最大サイズからこの範囲に収まる割り方は「同じくらい読める」とみなし、
 * サイズより切れ目の自然さを優先する（「CHIBA SKY WINGS女／子、…」より数px小さい自然な割り方を選ぶ）。
 */
const SIZE_TOLERANCE = 5;
/** 最大行数 */
const MAX_LINES = 3;
/**
 * 「文節を割っていない」とみなせる切れ目の点数。
 * 句読点(12) / スペース(11) / カッコ閉じ・——(10,8) / カッコ開き前(9) / 助詞のあと(6) がここに入る。
 * 文字種の変わり目だけ（カタカナ→漢字=4 など）はこれを下回る。
 *
 * 2026-10-04 クリス指示「シルバー委員長が で一フレーズだから改行は その前だよね。
 * 句読点・改行とかそのワードに、主語述語までは一文に収まるように改行ルールを直して」で追加。
 * それまでは行数が少なく文字が大きい割り方を優先していたので、
 * 「NBA拡張、シルバー／委員長が年内投票を目指す」のように肩書きの途中で割れていた。
 * 文字が数px小さくなっても、文節の切れ目で割るほうを先に採る。
 */
const PHRASE_BREAK = 6;

/** 行頭に置けない文字 */
const NO_START = /[、。，．）」』】〉》”’!?！？・ーぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ々〜:：;；＆&×✕／/\s]/;
/** 行末に置けない文字 */
const NO_END = /[（「『【〈《“‘]/;
const ALNUM = /[0-9A-Za-z]/;
/**
 * 英数の語を作る文字。B.PREMIER / Jr. / V.A.A. / 3.5 のピリオド、2026-27 / 114-37 のハイフンも
 * 語の一部として扱う（「2026-／27シーズン」で割れるのを防ぐ）
 */
const WORDCHAR = /[0-9A-Za-z.-]/;
const HIRA = /[ぁ-ん]/;
const KATA = /[ァ-ヴー]/;
const KANJI = /[一-龥]/;
/** 直後で切ってよい助詞（1文字） */
const PARTICLE = /[はがをにでともへやのかばねよわ]/;
/**
 * 語の一部になりにくい＝ほぼ確実に助詞と言える文字。このあとなら次がひらがなでも切ってよい
 * （「〜10」が／このホリデーシーズンに発売」）。「と」「の」「か」は「こと」「もの」「たか」の
 * ように語尾にも現れるので、こちらには入れない。
 */
const STRONG_PARTICLE = /[がをはにでも]/;
/**
 * 指示連体詞の頭（この・その・あの・どの）。直後の「の」で切ると語を割るので禁じる
 * （「エンビード「この／チームには本気で興奮している」」を防ぐ）
 */
const DEMONSTRATIVE = /[こそあど]/;
/** 数量の単位。数字のあとのこれは語の一部なので切らない（「9月26／日」を防ぐ） */
const UNIT_CHAR = /[日月年時分秒週人名回戦本点位個枚件勝敗度割円万億兆％%歳番台試]/;
/** カタカナの単位。数字・漢数単位のあとに続くときだけ語の一部とみなす（「3000万／ドル」を防ぐ） */
const KATA_UNIT = ["ドル", "ユーロ", "ポイント", "パーセント", "メートル", "センチ", "キロ",
                   "インチ", "ヤード", "ゲーム", "シーズン", "イニング", "シート"];

/** 文字種（切れ目の点数に使う） */
const kind = (ch: string): string =>
  ALNUM.test(ch) ? "a" : HIRA.test(ch) ? "h" : KATA.test(ch) ? "k" : KANJI.test(ch) ? "j" : "o";

/**
 * text[at] の助詞が「語の末尾の一部」に見えるか（「こと」「もの」「たか」の と/の/か）。
 * 直前も助詞なら（「には」「とは」「でも」）助詞が連なっているだけなので語尾ではない。
 */
const isWordTailParticle = (text: string, at: number): boolean => {
  const before = text[at - 1] ?? "";
  return PARTICLE.test(before) && !STRONG_PARTICLE.test(before);
};

/**
 * text[i-1] と text[i] の間で改行してよいか、よいなら自然さの点数（大きいほど自然）。
 * 切ってはいけない位置は 0 を返す。
 * relaxed=true のときだけ、語の内部（同じ文字種の連続）も最後の手段として許す。
 */
export const breakScore = (text: string, i: number, relaxed = false): number => {
  const prev = text[i - 1];
  const ch = text[i];
  if (NO_START.test(ch) || NO_END.test(prev)) return 0;
  // 英数字の語の途中では切らない（Air Jordan / 1226万ドル / B.PREMIER / V.A.A. など）
  if (WORDCHAR.test(prev) && WORDCHAR.test(ch) && (ALNUM.test(prev) || ALNUM.test(ch))) return 0;
  // 数量の内部では切らない（「9月26／日発売」「罰金3000万／ドル」）
  if ((ALNUM.test(prev) || UNIT_CHAR.test(prev)) && UNIT_CHAR.test(ch)) return 0;
  if ((ALNUM.test(prev) || UNIT_CHAR.test(prev)) &&
      KATA_UNIT.some((u) => text.startsWith(u, i))) return 0;
  // 行頭が助詞になる切り方は禁則（「このチームに／は本気で」「このチーム／には本気で」
  // 「LeBron Witness 10」／がこのホリデーシーズンに」）。「もっと」のような語頭も諦める
  if (PARTICLE.test(ch)) return 0;
  // 「この」「その」「あの」「どの」の直後は切らない（連体詞と体言を割ってしまう）
  if (prev === "の" && DEMONSTRATIVE.test(text[i - 2] ?? "")) return 0;
  // 半角スペース（英語タイトル・—— の前後）。ただし「Air Jordan 4」「Nike Caitlin 1」のように
  // 英字のあとの数字は製品名の一部なので、ここで割るのは他の切れ目に譲る
  if (/\s/.test(prev)) {
    return /[0-9]/.test(ch) && /[A-Za-z]/.test(text[i - 2] ?? "") ? 3 : 11;
  }
  if (/[、。，．]/.test(prev)) return 12;                        // 読点・句点のあと
  if (/[」』）】〉》]/.test(prev)) return 10;                    // 発言・カッコの閉じたあと
  if (prev === "—" && text[i - 2] === "—") return 10;           // 「——」のあと
  if (ch === "—") return 8;                                     // 「——」の前
  if (/[「『（【〈《]/.test(ch)) return 9;                       // 発言・カッコの開く前
  // ほぼ確実に助詞と言える文字のあとは、次がひらがなでも切ってよい。
  // 直前がさらに助詞（「には」「とは」「でも」）なら助詞が連なっているだけなので、
  // それも文節の切れ目として扱う（2026-10-04: ここを一律で外していたため「〜には／本気で」が
  // 5点どまりで、代わりに「この／チームには」で割れていた）
  if (STRONG_PARTICLE.test(prev) && !isWordTailParticle(text, i - 1)) return 6;
  // 句読点やカッコを挟まずに行頭がひらがなになる切り方は、送り仮名・活用語尾・複合語を
  // 割っていることがほとんど（「前向／きなことだ」「届いてい／ない」「こと／だ」）
  if (HIRA.test(ch) && !relaxed) return 0;
  if (PARTICLE.test(prev) && !isWordTailParticle(text, i - 1)) return 6;   // 助詞のあと
  const [kp, kc] = [kind(prev), kind(ch)];
  // 同じ文字種の連続＝ひとつの語の内部。カタカナ語（インガム・アレクサンダー）や熟語を割るのでふつうは切らない
  if (kp === kc) return relaxed ? 1 : 0;
  if (kp === "h") return 5;                                     // ひらがな → 漢字・カタカナ・英数
  if (kp === "k") return 4;
  if (kp === "j" && kc === "h") return 2;                       // 漢字 → ひらがな（送り仮名を割りやすいので低め）
  return 3;
};

type Split = {
  lines: string[];
  fontSize: number;
  score: number;
  /** 使った切れ目のうち、いちばん自然さの低い点数（文節を割っていないかの判定に使う） */
  minScore: number;
  spread: number;
};

const measure = (text: string, cuts: number[], relaxed: boolean): Split | null => {
  const bounds = [0, ...cuts, text.length];
  const lines: string[] = [];
  for (let n = 0; n < bounds.length - 1; n += 1) {
    const line = text.slice(bounds[n], bounds[n + 1]).trim();
    if (!line) return null;
    lines.push(line);
  }
  const lens = lines.map((line) => textWidthEm(line, WEIGHT));
  const longest = Math.max(...lens);
  const fontSize = Math.min(MAX_SIZE[lines.length], Math.floor(SAFE_WIDTH / longest));
  const scores = cuts.map((i) => breakScore(text, i, relaxed));
  const score = scores.reduce((sum, v) => sum + v, 0);
  return {
    lines,
    fontSize,
    score,
    minScore: scores.length ? Math.min(...scores) : Infinity,
    spread: longest - Math.min(...lens),
  };
};

/**
 * 同じ行数の中からいちばん良い割り方を選ぶ。
 * いちばん大きい文字サイズから SIZE_TOLERANCE 以内の候補を「同じくらい読める」とみなし、
 * そのなかで 切れ目の自然さ → 文字サイズ → 行長の揃い方 の順に選ぶ。
 */
const bestOf = (candidates: Split[]): Split | null => {
  if (!candidates.length) return null;
  const maxFont = Math.max(...candidates.map((c) => c.fontSize));
  const pool = candidates.filter((c) => c.fontSize >= maxFont - SIZE_TOLERANCE);
  return pool.reduce<Split | null>((best, c) => {
    if (!best) return c;
    if (c.score !== best.score) return c.score > best.score ? c : best;
    if (c.fontSize !== best.fontSize) return c.fontSize > best.fontSize ? c : best;
    return c.spread < best.spread ? c : best;
  }, null);
};

/**
 * 指定の行数での割り方を1つ選ぶ。
 * minBreak を渡すと、それより自然さの低い切れ目を使う割り方は候補から外す
 * （＝文節の途中で割らせない）。
 */
const splitInto = (
  text: string,
  lineCount: number,
  relaxed: boolean,
  minBreak = 0,
): Split | null => {
  if (lineCount === 1) return measure(text, [], relaxed);
  const points: number[] = [];
  for (let i = 1; i < text.length; i += 1) if (breakScore(text, i, relaxed) > 0) points.push(i);
  const found: Split[] = [];
  if (lineCount === 2) {
    for (const i of points) {
      const s = measure(text, [i], relaxed);
      if (s) found.push(s);
    }
  } else {
    for (let a = 0; a < points.length; a += 1) {
      for (let b = a + 1; b < points.length; b += 1) {
        const s = measure(text, [points[a], points[b]], relaxed);
        if (s) found.push(s);
      }
    }
  }
  return bestOf(found.filter((s) => s.minScore >= minBreak));
};

/**
 * 見出しを行に割り、その行数で読めるフォントサイズを返す。
 * 2行が基本。2行だと文字が小さくなりすぎる見出しだけ3行にする。
 */
export const wrapHeadline = (text: string): { lines: string[]; fontSize: number } => {
  const flat = text.replace(/\s*\n\s*/g, " ").trim();
  const show = (s: Split) => ({ lines: s.lines, fontSize: s.fontSize });

  const one = splitInto(flat, 1, false);
  if (one && one.fontSize >= ONE_LINE_MIN) return show(one);

  // ① まず文節の切れ目（句読点・カッコ・助詞のあと）だけで割れる形を 2行 → 3行 で探す。
  //    行数が増えても、肩書きや複合語の途中で割らないほうを優先する。
  const twoPhrase = splitInto(flat, 2, false, PHRASE_BREAK);
  if (twoPhrase && twoPhrase.fontSize >= TWO_LINE_MIN) return show(twoPhrase);
  const threePhrase =
    MAX_LINES >= 3 ? splitInto(flat, 3, false, PHRASE_BREAK) : null;
  if (threePhrase && threePhrase.fontSize >= THREE_LINE_MIN) return show(threePhrase);

  // ② 文節の切れ目だけでは読めるサイズに収まらない見出し。
  //    語の内部は切らないまま、文字種の変わり目も使って 2行 → 3行 の順で探す
  const two = splitInto(flat, 2, false);
  if (two && two.fontSize >= TWO_LINE_MIN) return show(two);
  const three = MAX_LINES >= 3 ? splitInto(flat, 3, false) : null;
  if (three && three.fontSize >= THREE_LINE_MIN && (!two || three.fontSize > two.fontSize)) {
    return show(three);
  }

  // ここまで来たら、語の内部を切らずには読めるサイズに収まらない見出し。
  // 語の内部も許して探し直し、いちばん大きく出せる割り方を使う。
  const best = [two, three, splitInto(flat, 2, true), MAX_LINES >= 3 ? splitInto(flat, 3, true) : null]
    .filter((s): s is Split => Boolean(s))
    .reduce<Split | null>((acc, s) => (!acc || s.fontSize > acc.fontSize ? s : acc), null);
  if (best) return show(best);

  // 切れ目が1つも無い（記号だけ等）＝ CSS の折り返しに任せる
  return {
    lines: [flat],
    fontSize: Math.min(MAX_SIZE[2], Math.floor(SAFE_WIDTH / textWidthEm(flat, WEIGHT)) * 2),
  };
};
