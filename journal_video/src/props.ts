/**
 * input/ に置いた JSON を NewsVideoProps に変換する。
 * Remotion Studio（Root.tsx）とレンダリングスクリプト（scripts/render.ts）の両方から使う。
 * 未指定のブランドタグは theme.ts の DEFAULT_BRAND_TAG で補完するので、
 * JSON には見出し・本文・背景だけ書けば1本作れる。
 */

import {
  DEFAULT_BRAND_TAG,
  QUOTE_MAX_LINES,
  RANKING_MAX_ROWS,
  SCORE_MAX_STATS,
} from "./theme";
import type {
  BackgroundSpec,
  BrandTagSpec,
  NewsVideoProps,
  QuoteVideoProps,
  RankingVideoProps,
  ScoreVideoProps,
  VideoInput,
} from "./types";

const fail = (source: string, message: string): never => {
  throw new Error(`入力JSON (${source}) が不正です: ${message}`);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseBackground = (value: unknown, source: string): BackgroundSpec => {
  if (!isRecord(value)) {
    return fail(source, "background は { type, src } のオブジェクトにしてください");
  }
  const type =
    value.type === "image" || value.type === "video"
      ? value.type
      : fail(source, 'background.type は "image" か "video" のどちらかです');
  const src =
    typeof value.src === "string" && value.src.length > 0
      ? value.src
      : fail(source, "background.src（public/ 配下の相対パス）が必要です");
  return { type, src };
};

const parseBrandTag = (value: unknown, source: string): BrandTagSpec => {
  if (value === undefined) return DEFAULT_BRAND_TAG;
  if (typeof value === "string") return value;
  if (!isRecord(value)) {
    return fail(
      source,
      'brandTag は文字列、または { "type": "logo", "src": "..." } のオブジェクトです',
    );
  }
  if (value.type === "logo") {
    const src =
      typeof value.src === "string" && value.src.length > 0
        ? value.src
        : fail(source, "brandTag.src（ロゴ画像の相対パス）が必要です");
    const heightPx =
      value.heightPx === undefined
        ? undefined
        : typeof value.heightPx === "number"
          ? value.heightPx
          : fail(source, "brandTag.heightPx は数値です");
    return { type: "logo", src, heightPx };
  }
  if (value.type === "text") {
    const text =
      typeof value.text === "string"
        ? value.text
        : fail(source, "brandTag.text（文字列）が必要です");
    return { type: "text", text };
  }
  return fail(source, 'brandTag.type は "logo" か "text" のどちらかです');
};

export const parseNewsVideoInput = (
  raw: unknown,
  source: string,
): NewsVideoProps => {
  if (!isRecord(raw)) {
    return fail(source, "トップレベルはオブジェクトにしてください");
  }

  const label =
    typeof raw.label === "string"
      ? raw.label
      : fail(source, "label（文字列）が必要です");

  const headline =
    typeof raw.headline === "string"
      ? raw.headline
      : fail(source, "headline（文字列）が必要です");

  const body =
    Array.isArray(raw.body) &&
    raw.body.length > 0 &&
    raw.body.every((line) => typeof line === "string")
      ? (raw.body as string[])
      : fail(source, "body（1行1要素の文字列配列・1行以上）が必要です");

  const bgm =
    raw.bgm === undefined
      ? undefined
      : typeof raw.bgm === "string"
        ? raw.bgm
        : fail(source, "bgm は public/ 配下の相対パス（文字列）です");

  const durationInSeconds =
    raw.durationInSeconds === undefined
      ? undefined
      : typeof raw.durationInSeconds === "number" && raw.durationInSeconds > 0
        ? raw.durationInSeconds
        : fail(source, "durationInSeconds は正の数値です");

  const credit =
    raw.credit === undefined || raw.credit === ""
      ? undefined
      : typeof raw.credit === "string"
        ? raw.credit
        : fail(source, "credit は文字列です");

  return {
    label,
    headline,
    body,
    background: parseBackground(raw.background, source),
    brandTag: parseBrandTag(raw.brandTag, source),
    bgm,
    durationInSeconds,
    credit,
  };
};

/* ------------------------------------------------------------------ */
/* ニュース以外の型（得点・名言・ランキング）                          */
/* ------------------------------------------------------------------ */

const requiredString = (
  raw: Record<string, unknown>,
  key: string,
  source: string,
): string =>
  typeof raw[key] === "string" && (raw[key] as string).length > 0
    ? (raw[key] as string)
    : fail(source, `${key}（文字列）が必要です`);

const optionalString = (
  raw: Record<string, unknown>,
  key: string,
  source: string,
): string | undefined =>
  raw[key] === undefined || raw[key] === ""
    ? undefined
    : typeof raw[key] === "string"
      ? (raw[key] as string)
      : fail(source, `${key} は文字列です`);

const stringLines = (
  raw: Record<string, unknown>,
  key: string,
  source: string,
  { min }: { min: number },
): string[] => {
  const value = raw[key] ?? [];
  return Array.isArray(value) &&
    value.length >= min &&
    value.every((line) => typeof line === "string")
    ? (value as string[])
    : fail(source, `${key}（1行1要素の文字列配列・${min}行以上）が必要です`);
};

/** 背景・ブランドタグ・BGM・尺・クレジット・ラベルは全型共通 */
const parseCommon = (
  raw: Record<string, unknown>,
  source: string,
  defaultLabel: string,
) => {
  const durationInSeconds =
    raw.durationInSeconds === undefined
      ? undefined
      : typeof raw.durationInSeconds === "number" && raw.durationInSeconds > 0
        ? raw.durationInSeconds
        : fail(source, "durationInSeconds は正の数値です");
  return {
    label: optionalString(raw, "label", source) ?? defaultLabel,
    background: parseBackground(raw.background, source),
    brandTag: parseBrandTag(raw.brandTag, source),
    bgm: optionalString(raw, "bgm", source),
    durationInSeconds,
    credit: optionalString(raw, "credit", source),
  };
};

export const parseScoreVideoInput = (
  raw: Record<string, unknown>,
  source: string,
): ScoreVideoProps => {
  const points =
    typeof raw.points === "number" &&
    Number.isInteger(raw.points) &&
    raw.points >= 0
      ? raw.points
      : fail(source, "points は0以上の整数です");
  const stats = stringLines(raw, "stats", source, { min: 0 });
  if (stats.length > SCORE_MAX_STATS) {
    fail(source, `stats は最大${SCORE_MAX_STATS}行です（今 ${stats.length}行）`);
  }
  return {
    ...parseCommon(raw, source, "SCORE"),
    player: requiredString(raw, "player", source),
    opponent: optionalString(raw, "opponent", source),
    points,
    unit: optionalString(raw, "unit", source) ?? "PTS",
    stats,
  };
};

export const parseQuoteVideoInput = (
  raw: Record<string, unknown>,
  source: string,
): QuoteVideoProps => {
  const quote = stringLines(raw, "quote", source, { min: 1 });
  if (quote.length > QUOTE_MAX_LINES) {
    fail(source, `quote は最大${QUOTE_MAX_LINES}行です（今 ${quote.length}行）`);
  }
  return {
    ...parseCommon(raw, source, "QUOTE"),
    quote,
    speaker: requiredString(raw, "speaker", source),
    speakerNote: optionalString(raw, "speakerNote", source),
  };
};

const parseRankingRow = (
  value: unknown,
  source: string,
  where: string,
): { rank?: string; name: string; value: string } => {
  if (!isRecord(value)) {
    return fail(source, `${where} は { name, value } のオブジェクトです`);
  }
  const str = (v: unknown) =>
    typeof v === "number" ? String(v) : typeof v === "string" ? v : undefined;
  const name = str(value.name) ?? fail(source, `${where}.name が必要です`);
  const val = str(value.value) ?? fail(source, `${where}.value が必要です`);
  const rank = value.rank === undefined ? undefined : str(value.rank);
  return { rank, name, value: val };
};

export const parseRankingVideoInput = (
  raw: Record<string, unknown>,
  source: string,
): RankingVideoProps => {
  const rows =
    Array.isArray(raw.rows) && raw.rows.length > 0
      ? raw.rows.map((row, i) => parseRankingRow(row, source, `rows[${i}]`))
      : fail(source, "rows（{ name, value } の配列・1行以上）が必要です");
  if (rows.length > RANKING_MAX_ROWS) {
    fail(source, `rows は最大${RANKING_MAX_ROWS}行です（今 ${rows.length}行）`);
  }
  const total =
    raw.total === undefined
      ? undefined
      : parseRankingRow(raw.total, source, "total");
  return {
    ...parseCommon(raw, source, "RANKING"),
    title: requiredString(raw, "title", source),
    subtitle: optionalString(raw, "subtitle", source),
    rows,
    total: total ? { name: total.name, value: total.value } : undefined,
  };
};

/**
 * JSON 1本を読んで、どの型で描くかと props を返す。
 * "template" が無い JSON は従来どおりニュース型（既存の自動パイプラインはこれ）。
 */
export const parseVideoInput = (raw: unknown, source: string): VideoInput => {
  if (!isRecord(raw)) {
    return fail(source, "トップレベルはオブジェクトにしてください");
  }
  switch (raw.template ?? "news") {
    case "news":
      return { template: "news", props: parseNewsVideoInput(raw, source) };
    case "score":
      return { template: "score", props: parseScoreVideoInput(raw, source) };
    case "quote":
      return { template: "quote", props: parseQuoteVideoInput(raw, source) };
    case "ranking":
      return {
        template: "ranking",
        props: parseRankingVideoInput(raw, source),
      };
    default:
      return fail(
        source,
        'template は "news" / "score" / "quote" / "ranking" のどれかです',
      );
  }
};
