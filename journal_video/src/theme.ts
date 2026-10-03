/**
 * 色・サイズ・マージン・フォント。
 * 見た目に関する数値はすべてこのファイルに集約する（timeline.ts はタイミング専用）。
 */

import { DEFAULT_GLYPH_WIDTH, GLYPH_WIDTH } from "./metrics";

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  /** 暗転オーバーレイの色 */
  overlay: "#000000",
  /**
   * 差し色。610ジャーナルは白・黒のみ運用なので null。
   * 入れる場合はここに HEX を書けばラベル文字色に適用される。
   */
  accent: null as string | null,
} as const;

export const FONT_FAMILY = {
  /** 見出し・本文（同梱の可変フォント。100〜900 まで連続可変） */
  sans: '"Noto Sans JP", "Hiragino Sans", sans-serif',
  /** ラベル（英字セリフ体） */
  serif: '"Playfair Display", "Noto Serif JP", serif',
} as const;

/** 左右の共通マージン（画面幅の約6% = 65px） */
export const MARGIN_X = Math.round(VIDEO.width * 0.06);

export const LABEL = {
  /** 上からの位置（画面高さ比） */
  topRatio: 0.08,
  fontSize: 34,
  fontWeight: 500,
  letterSpacing: "0.3em",
  color: COLORS.white,
} as const;

export const HEADLINE = {
  /** 見出しブロックの上端（画面高さ比） */
  topRatio: 0.23,
  fontWeight: 900,
  lineHeight: 1.06,
  color: COLORS.white,
} as const;

export const BODY = {
  /** 見出しからの間隔 */
  marginTop: 44,
  fontWeight: 500,
  lineHeight: 1.85,
  color: COLORS.white,
} as const;

export const BRAND_TAG = {
  /** 下からの位置（画面高さ比） */
  bottomRatio: 0.12,
  /** ロゴ画像の表示高さ（JSON 側の brandTag.heightPx で1本ごとに上書きも可能） */
  logoHeight: 60,
  /** 下地なしなので左右の余白は0（本文と左端を揃える）。上下は配置計算のため残す */
  paddingX: 0,
  paddingY: 20,
  /** テキスト運用時のスタイル */
  fontSize: 34,
  fontWeight: 700,
  letterSpacing: "0.18em",
  /** クリス指示で白い下地は廃止（白ロゴを写真の上に直接置く） */
  boxColor: "transparent",
  textColor: COLORS.white,
  /** 明るい写真の上でも白ロゴが溶けないための影 */
  shadow: "drop-shadow(0 2px 10px rgba(0,0,0,0.65))",
} as const;

/** ブランドタグの枠の高さ（ロゴ高さ＋上下パディング）= 100px */
export const brandTagBoxHeight = BRAND_TAG.logoHeight + BRAND_TAG.paddingY * 2;

/**
 * 文字の下敷き（スクリム）。
 * 暗転オーバーレイは全編で 0.15→0.55 と薄いところから始まるので、
 * 明るい実写写真を背景にすると序盤の白文字が背景に溶ける
 * （実測: 白い靴の記事写真で f12 のラベルが コントラスト 1.71:1）。
 * そこで文字が乗る上端と下端だけ、時間に依らない黒のグラデーションを常時敷いて
 * どんな明るさの写真でも白文字が WCAG AA（4.5:1）を超えるようにする。
 * 中央（上から約30%〜下から約64%）には掛けないので、被写体は暗転ぶんだけで見える。
 */
export const SCRIM = {
  /** ラベル帯（上から8%付近）を守る。stop は画面上端からの% */
  top: "linear-gradient(to bottom, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.38) 12%, rgba(0,0,0,0) 30%)",
  /** 見出し＋本文＋ブランドタグ帯を守る。stop は画面下端からの% */
  bottom:
    "linear-gradient(to top, rgba(0,0,0,0.64) 0%, rgba(0,0,0,0.56) 28%, rgba(0,0,0,0.44) 50%, rgba(0,0,0,0) 64%)",
} as const;

/** 見出し＋本文ブロックの縦位置アンカー。3パターンを比較するための切り替え。 */
/** 背景写真のクレジット（CC BY 系の表示義務）。全編、画面の最下部に小さく固定表示する */
export const CREDIT = {
  /** 下端からの距離（文字の下端） */
  bottomPx: 48,
  fontSize: 22,
  fontWeight: 500,
  opacity: 0.7,
  color: COLORS.white,
} as const;

export const TEXT_BLOCK = {
  /** "top" = 上から23%（現状） / "center" = 上下中央 / "bottom" = ブランドタグの上に下寄せ */
  anchor: "bottom" as "top" | "center" | "bottom",
  /** bottom のとき、文字ブロック下端とブランドタグ上端の間隔 */
  gapAboveBrandTag: 76,
};

/** ブランドタグに何も指定がない場合の既定値（白版ロゴ・下地なし） */
export const DEFAULT_BRAND_TAG = {
  type: "logo" as const,
  src: "assets/610journal-logo-white.png",
};

/**
 * 文字列の幅（em単位 = フォントサイズ1pxあたりの横幅）。
 * metrics.ts の実測テーブルを引く。表に無い文字は全角（1.0em）扱い＝安全側。
 *
 * 2026-10-04 以前は「半角=0.55em・全角=1.0em」の概算だった。Noto Sans JP の実寸は
 * wght900 で N=0.764 / A=0.660 と大きく、見出しの幅を 0.5em ほど小さく見積もっていた。
 * そのため改行ルールが「収まる」と判断した行が実際には枠を超え、CSS の折り返しが
 * 行末の1文字だけを次行へ落としていた（「NBA拡張、シルバー委員長／が」）。
 */
export const textWidthEm = (text: string, weight: number): number => {
  const table = GLYPH_WIDTH[weight] ?? GLYPH_WIDTH[nearestWeight(weight)];
  return [...text].reduce(
    (sum, ch) => sum + (table[ch] ?? DEFAULT_GLYPH_WIDTH),
    0,
  );
};

/** 実測テーブルがある太さ（500/700/900）のうち、いちばん近いもの */
const nearestWeight = (weight: number): number =>
  Object.keys(GLYPH_WIDTH)
    .map(Number)
    .reduce((best, w) => (Math.abs(w - weight) < Math.abs(best - weight) ? w : best), 500);

/**
 * 見出しのフォントサイズ。
 * 「1行あたり高さ約100px相当」を基準に、長い見出しは段階的に縮める。
 * CSS 側でも折り返すので、これは"はみ出し"ではなく"行数が増えすぎない"ための調整。
 */
export const headlineFontSize = (text: string): number => {
  const len = textWidthEm(text, HEADLINE.fontWeight);
  if (len <= 9) return 104;
  if (len <= 13) return 92;
  if (len <= 18) return 80;
  if (len <= 26) return 68;
  return 58;
};

/* ------------------------------------------------------------------ */
/* ニュース以外の型（得点・名言・ランキング）                          */
/* ------------------------------------------------------------------ */

/** 文字を置いてよい横幅（左右マージンの内側 = 950px） */
export const CONTENT_WIDTH = VIDEO.width - MARGIN_X * 2;

/**
 * 実際に文字を収める幅。実測テーブルは字送りの合計なので理屈では CONTENT_WIDTH まで入るが、
 * 字間の丸めやフォントの合成（Hiragino へのフォールバック）で数px増えることがあるため
 * 1%だけ安全側に取る。CSS の折り返しを切った（Headline.tsx）ので、ここがはみ出しの最後の砦。
 */
export const SAFE_WIDTH = Math.floor(CONTENT_WIDTH * 0.99);

/**
 * 文字ブロックの下端。ブランドタグ箱の上端から gap だけ空ける。
 * ニュース型と同じくブランドタグ（下から12%）＋箱の高さの上に収める。
 */
export const contentBottomPx = (gap: number): number =>
  VIDEO.height * BRAND_TAG.bottomRatio + brandTagBoxHeight + gap;

/**
 * 1行に収まるフォントサイズ。textWidthEm（実測）× サイズ = 描画幅として、
 * 横幅 width に収まる最大値を max〜min の範囲で返す。
 * min まで縮めても収まらない分は CSS の折り返しに任せる。
 */
export const fitFontSize = (
  text: string,
  { width, max, min, weight }: { width: number; max: number; min: number; weight: number },
): number => {
  const len = Math.max(0.1, textWidthEm(text, weight));
  return Math.max(min, Math.min(max, Math.floor(width / len)));
};

/**
 * 背景の暗さ。ニュース型は全編で 0.15→0.55 と薄く始まるが、
 * 新しい3型は画面の中央に文字を置くので最初から暗くしておく
 * （中央にはスクリムが掛からないため、暗転だけで白文字を読ませる）。
 */
export const DIM = {
  score: { from: 0.5, to: 0.62 },
  quote: { from: 0.72, to: 0.8 },
  ranking: { from: 0.55, to: 0.65 },
} as const;

export const SCORE = {
  /** 選手名ブロックの上端（画面高さ比） */
  topRatio: 0.24,
  player: { max: 92, min: 56, fontWeight: 900, letterSpacing: "0.02em" },
  underline: { width: 180, height: 6, marginTop: 26 },
  opponent: { fontSize: 42, fontWeight: 500, letterSpacing: "0.12em", marginTop: 30 },
  points: { fontSize: 300, fontWeight: 900, marginTop: 40 },
  unit: { fontSize: 64, fontWeight: 800, letterSpacing: "0.06em", gap: 18 },
  /** 補足スタッツ。4行以上で縮める */
  stats: { fontSize: 48, fontSizeMany: 40, fontWeight: 700, lineHeight: 1.6, marginTop: 36 },
} as const;

/** 得点の補足スタッツの上限（これ以上はブランドタグとぶつかる） */
export const SCORE_MAX_STATS = 5;

export const QUOTE = {
  /** 文字ブロックを上下中央に置く範囲の上端（ラベルの下） */
  topPx: 250,
  gapAboveBrandTag: 60,
  mark: { fontSize: 260, fontWeight: 700, height: 170 },
  line: { max: 60, min: 38, maxWhenMany: 52, fontWeight: 700, lineHeight: 1.7 },
  speaker: { fontSize: 40, fontWeight: 700, marginTop: 56 },
  speakerNote: { fontSize: 30, fontWeight: 500, marginTop: 12, opacity: 0.8 },
} as const;

/** 名言の行数の上限 */
export const QUOTE_MAX_LINES = 8;

export const RANKING = {
  /** 見出しの上端（画面高さ比） */
  topRatio: 0.15,
  gapAboveBrandTag: 60,
  title: { max: 96, min: 56, fontWeight: 900, lineHeight: 1.08 },
  subtitle: { fontSize: 34, fontWeight: 500, marginTop: 16, opacity: 0.85 },
  /** 見出しと1行目の間 */
  rowsMarginTop: 52,
  rowGap: 14,
  rowMaxHeight: 112,
  /** 行の文字サイズ = 行の高さ × この比率 */
  fontRatio: 0.42,
  paddingX: 30,
  /** 各行の帯（半透明の黒） */
  rowColor: "rgba(0,0,0,0.55)",
  /** 合計行の帯（白・黒文字で強調） */
  totalColor: COLORS.white,
  totalTextColor: COLORS.black,
} as const;

/** ランキングの行数の上限（合計行は別） */
export const RANKING_MAX_ROWS = 10;

/**
 * 本文のフォントサイズの段階。行数が増えたら縮めて下部のブランドタグと衝突させない。
 * body.ts の折り返しが「このサイズなら何行になるか」を上から順に試すので、降順で並べる。
 */
export const BODY_SIZE_STEPS = [
  { maxLines: 5, fontSize: 40 },
  { maxLines: 7, fontSize: 36 },
  { maxLines: 9, fontSize: 32 },
  { maxLines: Infinity, fontSize: 28 },
] as const;

/** その行数で使ってよい本文のフォントサイズ */
export const bodyFontSize = (lineCount: number): number =>
  (BODY_SIZE_STEPS.find((s) => lineCount <= s.maxLines) ?? BODY_SIZE_STEPS[3]).fontSize;
