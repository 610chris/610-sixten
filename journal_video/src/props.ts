/**
 * input/ に置いた JSON を NewsVideoProps に変換する。
 * Remotion Studio（Root.tsx）とレンダリングスクリプト（scripts/render.ts）の両方から使う。
 * 未指定のブランドタグは theme.ts の DEFAULT_BRAND_TAG で補完するので、
 * JSON には見出し・本文・背景だけ書けば1本作れる。
 */

import { DEFAULT_BRAND_TAG } from "./theme";
import type { BackgroundSpec, BrandTagSpec, NewsVideoProps } from "./types";

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
