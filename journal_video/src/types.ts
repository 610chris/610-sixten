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

/**
 * ニュース以外の型（得点・名言・ランキング）が共通で持つ項目。
 * JSON の "template" で型を選ぶ。"template" が無い JSON は従来どおりニュース型。
 */
type CommonProps = {
  /** 上部の小さいラベル。未指定なら型ごとの既定値（SCORE / QUOTE / RANKING） */
  label: string;
  background: BackgroundSpec;
  brandTag: BrandTagSpec;
  bgm?: string;
  durationInSeconds?: number;
  credit?: string;
};

/** 試合の得点。得点が0からカウントアップし、下に補足スタッツが1行ずつ出る */
export type ScoreVideoProps = CommonProps & {
  /** 選手名 例: "STEPHEN CURRY" */
  player: string;
  /** 対戦相手の行 例: "vs. KINGS" */
  opponent?: string;
  /** カウントアップする得点 */
  points: number;
  /** 得点の単位 例: "PTS"（既定） */
  unit: string;
  /** 補足スタッツ。1要素が1行 例: ["5 REB", "7/12 3PT"] */
  stats: string[];
};

/** 名言・コメント。暗い背景の中央に発言を1行ずつ出し、最後に発言者 */
export type QuoteVideoProps = CommonProps & {
  /** 発言。1要素が1行（改行位置は JSON 側で決める） */
  quote: string[];
  /** 発言者 例: "ステフィン・カリー" */
  speaker: string;
  /** 発言者の補足 例: "試合後の会見で" */
  speakerNote?: string;
};

export type RankingRow = {
  /** 順位の表示。未指定なら上から 1, 2, 3… */
  rank?: string;
  name: string;
  value: string;
};

/** ランキング。見出しの下に、1行ずつ帯が積み上がり、最後に合計行 */
export type RankingVideoProps = CommonProps & {
  /** 大見出し 例: "LAKERS 3PT% RANKING" */
  title: string;
  /** 見出しの下の小さい補足 例: "2025-26 レギュラーシーズン" */
  subtitle?: string;
  rows: RankingRow[];
  /** 最後に強調して出す行 例: { name: "TEAM", value: "36.8%" } */
  total?: { name: string; value: string };
};

export type TemplateId = "news" | "score" | "quote" | "ranking";

/** JSON 1本を読んだ結果。template で描画する Composition が決まる */
export type VideoInput =
  | { template: "news"; props: NewsVideoProps }
  | { template: "score"; props: ScoreVideoProps }
  | { template: "quote"; props: QuoteVideoProps }
  | { template: "ranking"; props: RankingVideoProps };

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
