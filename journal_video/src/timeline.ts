/**
 * 全アニメーションのタイミング定数（単位は秒）。
 * タイミングを直したいときはこのファイルだけ触れば済むようにしてある。
 */

import { VIDEO } from "./theme";

/** 秒 → フレーム */
export const sec = (s: number): number => Math.round(s * VIDEO.fps);

/** 背景画像のゆるやかなズームイン（Ken Burns）。動画背景のときは適用しない。 */
export const BACKGROUND_ZOOM = { from: 1.0, to: 1.06 } as const;

/** 暗転オーバーレイ。全編かけて線形に濃くなる。 */
export const OVERLAY_OPACITY = { from: 0.15, to: 0.55 } as const;

/** ラベル: 0.2秒からフェードイン（0.4秒） */
export const LABEL_IN = { start: 0.2, duration: 0.4 } as const;

/** 見出し: 1.2秒からフェードイン＋下から少し上へスライド */
export const HEADLINE_IN = { start: 1.2, duration: 0.6, slideY: 28 } as const;

/** 本文: 2.0秒から1行ずつ、0.55秒間隔 */
export const BODY_IN = {
  start: 2.0,
  stagger: 0.55,
  duration: 0.5,
  slideY: 18,
} as const;

/** ブランドタグ: 本文最終行の0.8秒後に白ボックスが左→右へワイプ（0.5秒）、開ききってから文字/ロゴ */
export const BRAND_TAG_IN = {
  delayAfterLastBodyLine: 0.8,
  wipeDuration: 0.5,
  /** ワイプ完了からロゴ／文字が現れるまでの待ち */
  contentDelay: 0.05,
  contentFadeDuration: 0.3,
} as const;

/** 最終行が出現し始める時刻 */
export const lastBodyLineStart = (bodyLineCount: number): number =>
  BODY_IN.start + BODY_IN.stagger * Math.max(0, bodyLineCount - 1);

/** ブランドタグのワイプ開始時刻 */
export const brandTagStart = (bodyLineCount: number): number =>
  lastBodyLineStart(bodyLineCount) + BRAND_TAG_IN.delayAfterLastBodyLine;

/**
 * BGM。JSON に "bgm": "audio/xxx.mp3" があるときだけ鳴る。
 * 終わりでブツ切りにならないよう、末尾 fadeOut 秒かけて音量を0にする。
 */
export const BGM = { volume: 0.6, fadeOut: 0.8 } as const;

/** 余韻（ブランドタグが出たあと動画が終わるまでの保持時間） */
export const OUTRO_HOLD = 3.0;

/** 尺のクランプ範囲 */
export const DURATION_CLAMP = { min: 8, max: 30 } as const;

/**
 * 尺の自動計算。
 * 尺 = 2.0（本文開始）+ 0.55 × 本文行数 + 0.8（間）+ 0.5（ワイプ）+ 3.0（余韻）
 * 最低8秒・最大30秒でクランプする。
 */
export const computeDurationInSeconds = (bodyLineCount: number): number => {
  const raw =
    BODY_IN.start +
    BODY_IN.stagger * bodyLineCount +
    BRAND_TAG_IN.delayAfterLastBodyLine +
    BRAND_TAG_IN.wipeDuration +
    OUTRO_HOLD;
  return Math.min(DURATION_CLAMP.max, Math.max(DURATION_CLAMP.min, raw));
};

/* ------------------------------------------------------------------ */
/* ニュース以外の型（得点・名言・ランキング）                          */
/* ------------------------------------------------------------------ */

const clampDuration = (raw: number): number =>
  Math.min(DURATION_CLAMP.max, Math.max(DURATION_CLAMP.min, raw));

/** 得点: 選手名 → 下線 → 対戦相手 → 得点カウントアップ → 補足スタッツ1行ずつ */
export const SCORE_IN = {
  player: { start: 0.5, duration: 0.6, slideY: 28 },
  underline: { start: 0.9, duration: 0.5 },
  opponent: { start: 1.1, duration: 0.5, slideY: 18 },
  /** 得点の数字が出てから 0→points まで数える時間 */
  count: { start: 1.6, duration: 1.6 },
  /** 数え終わりに一瞬だけ大きくして止める */
  pop: { duration: 0.35, scale: 1.08 },
  stats: { start: 3.6, stagger: 0.5, duration: 0.5, slideY: 18 },
} as const;

export const scoreBrandTagStart = (statCount: number): number =>
  statCount > 0
    ? SCORE_IN.stats.start +
      SCORE_IN.stats.stagger * (statCount - 1) +
      BRAND_TAG_IN.delayAfterLastBodyLine
    : SCORE_IN.count.start +
      SCORE_IN.count.duration +
      BRAND_TAG_IN.delayAfterLastBodyLine;

export const computeScoreDuration = (statCount: number): number =>
  clampDuration(
    scoreBrandTagStart(statCount) + BRAND_TAG_IN.wipeDuration + OUTRO_HOLD,
  );

/** 名言: 引用符 → 発言を1行ずつ（読む時間を取ってゆっくり） → 発言者 */
export const QUOTE_IN = {
  mark: { start: 0.4, duration: 0.6 },
  lines: { start: 1.1, stagger: 0.7, duration: 0.6, slideY: 16 },
  speakerDelay: 0.9,
  speaker: { duration: 0.6, slideY: 12 },
} as const;

/** 名言は読み終わるまで待つので余韻を長めにとる */
export const QUOTE_OUTRO_HOLD = 3.5;

export const quoteSpeakerStart = (lineCount: number): number =>
  QUOTE_IN.lines.start +
  QUOTE_IN.lines.stagger * Math.max(0, lineCount - 1) +
  QUOTE_IN.speakerDelay;

export const quoteBrandTagStart = (lineCount: number): number =>
  quoteSpeakerStart(lineCount) + BRAND_TAG_IN.delayAfterLastBodyLine;

export const computeQuoteDuration = (lineCount: number): number =>
  clampDuration(
    quoteBrandTagStart(lineCount) + BRAND_TAG_IN.wipeDuration + QUOTE_OUTRO_HOLD,
  );

/** ランキング: 見出し → 行が上から1行ずつ左から滑り込む → 合計行が白帯でワイプ */
export const RANKING_IN = {
  title: { start: 0.5, duration: 0.6, slideY: 28 },
  rows: { start: 1.4, stagger: 0.4, duration: 0.5, slideX: 60 },
  totalDelay: 0.6,
  total: { wipeDuration: 0.5, contentDelay: 0.05, contentFadeDuration: 0.3 },
} as const;

export const rankingTotalStart = (rowCount: number): number =>
  RANKING_IN.rows.start +
  RANKING_IN.rows.stagger * Math.max(0, rowCount - 1) +
  RANKING_IN.totalDelay;

export const rankingBrandTagStart = (
  rowCount: number,
  hasTotal: boolean,
): number =>
  (hasTotal
    ? rankingTotalStart(rowCount) + RANKING_IN.total.wipeDuration
    : RANKING_IN.rows.start +
      RANKING_IN.rows.stagger * Math.max(0, rowCount - 1)) +
  BRAND_TAG_IN.delayAfterLastBodyLine;

export const computeRankingDuration = (
  rowCount: number,
  hasTotal: boolean,
): number =>
  clampDuration(
    rankingBrandTagStart(rowCount, hasTotal) +
      BRAND_TAG_IN.wipeDuration +
      OUTRO_HOLD,
  );

/** props から最終的なフレーム数を出す */
export const resolveDurationInFrames = (
  bodyLineCount: number,
  durationInSeconds?: number,
): number => sec(durationInSeconds ?? computeDurationInSeconds(bodyLineCount));
