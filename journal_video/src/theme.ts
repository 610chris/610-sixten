/**
 * 色・サイズ・マージン・フォント。
 * 見た目に関する数値はすべてこのファイルに集約する（timeline.ts はタイミング専用）。
 */

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
  paddingX: 30,
  paddingY: 20,
  /** テキスト運用時のスタイル */
  fontSize: 34,
  fontWeight: 700,
  letterSpacing: "0.18em",
  boxColor: COLORS.white,
  textColor: COLORS.black,
} as const;

/** ブランドタグの白ボックスの高さ（ロゴ高さ＋上下パディング）= 100px */
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

/** ブランドタグに何も指定がない場合の既定値（黒版ロゴ） */
export const DEFAULT_BRAND_TAG = {
  type: "logo" as const,
  src: "assets/610journal-logo.png",
};

/**
 * 全角換算の文字数。半角英数は全角の約0.55文字幅として数える。
 * 見出し／本文のフォントサイズ自動調整に使う。
 */
export const visualLength = (text: string): number =>
  [...text].reduce(
    (sum, ch) => sum + (/[ -~]/.test(ch) ? 0.55 : 1),
    0,
  );

/**
 * 見出しのフォントサイズ。
 * 「1行あたり高さ約100px相当」を基準に、長い見出しは段階的に縮める。
 * CSS 側でも折り返すので、これは"はみ出し"ではなく"行数が増えすぎない"ための調整。
 */
export const headlineFontSize = (text: string): number => {
  const len = visualLength(text);
  if (len <= 9) return 104;
  if (len <= 13) return 92;
  if (len <= 18) return 80;
  if (len <= 26) return 68;
  return 58;
};

/** 本文のフォントサイズ。行数が増えたら縮めて下部のブランドタグと衝突させない。 */
export const bodyFontSize = (lines: string[]): number => {
  const n = lines.length;
  if (n <= 5) return 40;
  if (n <= 7) return 36;
  if (n <= 9) return 32;
  return 28;
};
