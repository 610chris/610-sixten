import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { fadeSlideIn, progressIn } from "./animation";
import { Background } from "./components/Background";
import { Bgm } from "./components/Bgm";
import { BrandTag } from "./components/BrandTag";
import { Credit } from "./components/Credit";
import { Label } from "./components/Label";
import { Overlay } from "./components/Overlay";
import { Scrim } from "./components/Scrim";
import {
  COLORS,
  contentBottomPx,
  DIM,
  FONT_FAMILY,
  fitFontSize,
  MARGIN_X,
  QUOTE,
  SAFE_WIDTH,
  textWidthEm,
} from "./theme";
import {
  QUOTE_IN,
  quoteBrandTagStart,
  quoteSpeakerStart,
} from "./timeline";
import type { QuoteVideoProps } from "./types";

/**
 * 発言の文字サイズ。いちばん長い行が1行に収まるサイズを全行で揃える
 * （行ごとにサイズが変わるとガタガタに見えるため）。行数が多いときは上限を下げる。
 */
const quoteFontSize = (lines: string[]): number => {
  const longest = lines.reduce(
    (a, b) =>
      textWidthEm(b, QUOTE.line.fontWeight) > textWidthEm(a, QUOTE.line.fontWeight) ? b : a,
    "",
  );
  return fitFontSize(longest, {
    width: SAFE_WIDTH,
    max: lines.length >= 6 ? QUOTE.line.maxWhenMany : QUOTE.line.max,
    min: QUOTE.line.min,
    weight: QUOTE.line.fontWeight,
  });
};

/**
 * 名言・コメントの型。
 * 背景をかなり暗くし、中央に大きな引用符 → 発言を1行ずつ → 発言者 → ブランドタグ。
 * 文字ブロックはラベルの下〜ブランドタグの上の範囲で上下中央に置く。
 */
export const QuoteVideo: React.FC<QuoteVideoProps> = ({
  label,
  quote,
  speaker,
  speakerNote,
  background,
  brandTag,
  bgm,
  credit,
}) => {
  const frame = useCurrentFrame();
  const fontSize = quoteFontSize(quote);
  const speakerStart = quoteSpeakerStart(quote.length);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        fontFamily: FONT_FAMILY.sans,
        color: COLORS.white,
      }}
    >
      <Background background={background} />
      <Overlay range={DIM.quote} />
      <Scrim />
      <Label text={label} />

      <div
        style={{
          position: "absolute",
          top: QUOTE.topPx,
          bottom: contentBottomPx(QUOTE.gapAboveBrandTag),
          left: MARGIN_X,
          right: MARGIN_X,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            opacity: progressIn(
              frame,
              QUOTE_IN.mark.start,
              QUOTE_IN.mark.duration,
            ),
            fontFamily: FONT_FAMILY.serif,
            fontSize: QUOTE.mark.fontSize,
            fontWeight: QUOTE.mark.fontWeight,
            // 引用符は字面の下半分が空くので、行の高さを詰めて発言との間を締める
            height: QUOTE.mark.height,
            lineHeight: 1,
          }}
        >
          {"“"}
        </div>

        {quote.map((line, index) => (
          <div
            key={`${index}-${line}`}
            style={{
              ...fadeSlideIn(frame, {
                start: QUOTE_IN.lines.start + QUOTE_IN.lines.stagger * index,
                duration: QUOTE_IN.lines.duration,
                slideY: QUOTE_IN.lines.slideY,
              }),
              fontSize,
              fontWeight: QUOTE.line.fontWeight,
              lineHeight: QUOTE.line.lineHeight,
              lineBreak: "strict",
              overflowWrap: "anywhere",
              whiteSpace: "pre-wrap",
            }}
          >
            {line}
          </div>
        ))}

        <div
          style={{
            ...fadeSlideIn(frame, {
              start: speakerStart,
              duration: QUOTE_IN.speaker.duration,
              slideY: QUOTE_IN.speaker.slideY,
            }),
            marginTop: QUOTE.speaker.marginTop,
          }}
        >
          <div
            style={{
              fontSize: QUOTE.speaker.fontSize,
              fontWeight: QUOTE.speaker.fontWeight,
              lineHeight: 1.3,
            }}
          >
            {`— ${speaker}`}
          </div>
          {speakerNote ? (
            <div
              style={{
                marginTop: QUOTE.speakerNote.marginTop,
                fontSize: QUOTE.speakerNote.fontSize,
                fontWeight: QUOTE.speakerNote.fontWeight,
                opacity: QUOTE.speakerNote.opacity,
                lineHeight: 1.3,
              }}
            >
              {speakerNote}
            </div>
          ) : null}
        </div>
      </div>

      <BrandTag
        brandTag={brandTag}
        startSec={quoteBrandTagStart(quote.length)}
        align="center"
      />

      {credit ? <Credit text={credit} /> : null}

      {bgm ? <Bgm src={bgm} /> : null}
    </AbsoluteFill>
  );
};
