/**
 * 610ジャーナル ニュース動画の入力型。
 * 1本の動画はこの props だけで完全に決まる。
 */

export type BackgroundSpec = {
  type: "image" | "video";
  /** public/ 配下の相対パス 例: "assets/knicks.jpg" */
  src: string;
};

/**
 * 最下部のブランドタグ。
 * - 文字列    … その文字を白ボックス内に黒文字で組む（例: "610 JOURNAL"）
 * - logo 指定 … ロゴ画像を白ボックス内に置く（既定の運用。黒版ロゴを使う）
 */
export type BrandTagSpec =
  | string
  | { type: "text"; text: string }
  | { type: "logo"; src: string; heightPx?: number };

export type NewsVideoProps = {
  /** 上部の小さいラベル 例: "NEWS" */
  label: string;
  /** 大見出し 例: "NBA Finals" */
  headline: string;
  /** 本文。配列の1要素が1行として順番に出現する */
  body: string[];
  background: BackgroundSpec;
  brandTag: BrandTagSpec;
  /** public/ 配下の相対パス 例: "audio/default.mp3" */
  bgm?: string;
  /** 未指定なら本文行数から自動計算（timeline.ts の computeDurationInSeconds） */
  durationInSeconds?: number;
  /** 背景写真のクレジット 例: "Photo: Bryan Berlin / CC BY-SA 4.0" */
  credit?: string;
};

/** ブランドタグの3形態を1つの形に正規化する */
export type ResolvedBrandTag =
  | { kind: "text"; text: string }
  | { kind: "logo"; src: string; heightPx?: number };

export const normalizeBrandTag = (tag: BrandTagSpec): ResolvedBrandTag => {
  if (typeof tag === "string") {
    return { kind: "text", text: tag };
  }
  if (tag.type === "logo") {
    return { kind: "logo", src: tag.src, heightPx: tag.heightPx };
  }
  return { kind: "text", text: tag.text };
};
