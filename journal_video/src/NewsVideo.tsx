import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "./components/Background";
import { Bgm } from "./components/Bgm";
import { BodyLines } from "./components/BodyLines";
import { BrandTag } from "./components/BrandTag";
import { Credit } from "./components/Credit";
import { Headline } from "./components/Headline";
import { Label } from "./components/Label";
import { Overlay } from "./components/Overlay";
import { Scrim } from "./components/Scrim";
import {
  BRAND_TAG,
  brandTagBoxHeight,
  COLORS,
  FONT_FAMILY,
  HEADLINE,
  MARGIN_X,
  TEXT_BLOCK,
  VIDEO,
} from "./theme";
import type { NewsVideoProps } from "./types";

/**
 * 見出し＋本文ブロックの縦位置。theme.ts の TEXT_BLOCK.anchor で切り替える。
 * - top:    上から23%（従来の挙動）
 * - center: 画面の上下中央
 * - bottom: ブランドタグの上に下寄せ
 */
const textBlockAnchorStyle = (): React.CSSProperties => {
  switch (TEXT_BLOCK.anchor) {
    case "center":
      return {
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      };
    case "bottom":
      return {
        bottom:
          VIDEO.height * BRAND_TAG.bottomRatio +
          brandTagBoxHeight +
          TEXT_BLOCK.gapAboveBrandTag,
      };
    default:
      return { top: VIDEO.height * HEADLINE.topRatio };
  }
};

/**
 * 610ジャーナル ニュース動画の本体。
 * 下から順に: 背景 → 暗転オーバーレイ → 文字の下敷き → ラベル → 見出し＋本文 → ブランドタグ。
 */
export const NewsVideo: React.FC<NewsVideoProps> = ({
  label,
  headline,
  body,
  background,
  brandTag,
  bgm,
  credit,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: COLORS.black,
      fontFamily: FONT_FAMILY.sans,
    }}
  >
    <Background background={background} />
    <Overlay />
    <Scrim />
    <Label text={label} />

    {/* 見出しと本文は1つのブロック。見出しが何行になっても本文がすぐ下に続く */}
    <div
      style={{
        position: "absolute",
        left: MARGIN_X,
        right: MARGIN_X,
        ...textBlockAnchorStyle(),
      }}
    >
      <Headline text={headline} />
      <BodyLines lines={body} />
    </div>

    <BrandTag brandTag={brandTag} bodyLineCount={body.length} />

    {credit ? <Credit text={credit} /> : null}

    {bgm ? <Bgm src={bgm} /> : null}
  </AbsoluteFill>
);
