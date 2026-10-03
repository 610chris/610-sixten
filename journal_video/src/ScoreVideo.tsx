import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASE, fadeSlideIn, progressIn } from "./animation";
import { Background } from "./components/Background";
import { Bgm } from "./components/Bgm";
import { BrandTag } from "./components/BrandTag";
import { Credit } from "./components/Credit";
import { Label } from "./components/Label";
import { Overlay } from "./components/Overlay";
import { Scrim } from "./components/Scrim";
import {
  COLORS,
  SAFE_WIDTH,
  DIM,
  FONT_FAMILY,
  fitFontSize,
  MARGIN_X,
  SCORE,
  VIDEO,
} from "./theme";
import { SCORE_IN, scoreBrandTagStart, sec } from "./timeline";
import type { ScoreVideoProps } from "./types";

/**
 * 得点の数字。count の区間で 0→points へ数え上げ、数え終わりに一瞬だけ大きくして止める。
 * 桁数が増えても横に揺れないよう tabular-nums（等幅数字）で組む。
 */
const Points: React.FC<{ points: number; unit: string }> = ({
  points,
  unit,
}) => {
  const frame = useCurrentFrame();
  const { count, pop } = SCORE_IN;

  const appear = progressIn(frame, count.start, 0.3);
  const counted = Math.round(
    points * progressIn(frame, count.start, count.duration),
  );
  const popEnd = count.start + count.duration;
  const scale = interpolate(
    frame,
    [sec(popEnd), sec(popEnd + pop.duration / 2), sec(popEnd + pop.duration)],
    [1, pop.scale, 1],
    { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        opacity: appear,
        marginTop: SCORE.points.marginTop,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: SCORE.unit.gap,
        transform: `scale(${scale.toFixed(4)})`,
      }}
    >
      <span
        style={{
          fontSize: SCORE.points.fontSize,
          fontWeight: SCORE.points.fontWeight,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
        }}
      >
        {counted}
      </span>
      <span
        style={{
          fontSize: SCORE.unit.fontSize,
          fontWeight: SCORE.unit.fontWeight,
          letterSpacing: SCORE.unit.letterSpacing,
          lineHeight: 1,
        }}
      >
        {unit}
      </span>
    </div>
  );
};

/**
 * 試合の得点の型。
 * 下から順に: 背景 → 暗転 → 文字の下敷き → ラベル → 選手名＋下線＋対戦相手 → 得点 → 補足スタッツ → ブランドタグ。
 * 文字はすべて中央揃え。
 */
export const ScoreVideo: React.FC<ScoreVideoProps> = ({
  label,
  player,
  opponent,
  points,
  unit,
  stats,
  background,
  brandTag,
  bgm,
  credit,
}) => {
  const frame = useCurrentFrame();
  const underline = progressIn(
    frame,
    SCORE_IN.underline.start,
    SCORE_IN.underline.duration,
  );
  const statFontSize =
    stats.length >= 4 ? SCORE.stats.fontSizeMany : SCORE.stats.fontSize;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        fontFamily: FONT_FAMILY.sans,
        color: COLORS.white,
      }}
    >
      <Background background={background} />
      <Overlay range={DIM.score} />
      <Scrim />
      <Label text={label} />

      <div
        style={{
          position: "absolute",
          top: VIDEO.height * SCORE.topRatio,
          left: MARGIN_X,
          right: MARGIN_X,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...fadeSlideIn(frame, SCORE_IN.player),
            fontSize: fitFontSize(player, {
              width: SAFE_WIDTH,
              max: SCORE.player.max,
              min: SCORE.player.min,
              weight: SCORE.player.fontWeight,
            }),
            fontWeight: SCORE.player.fontWeight,
            letterSpacing: SCORE.player.letterSpacing,
            lineHeight: 1.1,
            lineBreak: "strict",
            overflowWrap: "anywhere",
          }}
        >
          {player}
        </div>

        {/* 下線は中央から左右へ伸びる */}
        <div
          style={{
            marginTop: SCORE.underline.marginTop,
            width: SCORE.underline.width,
            height: SCORE.underline.height,
            backgroundColor: COLORS.white,
            transform: `scaleX(${underline.toFixed(4)})`,
          }}
        />

        {opponent ? (
          <div
            style={{
              ...fadeSlideIn(frame, SCORE_IN.opponent),
              marginTop: SCORE.opponent.marginTop,
              fontFamily: FONT_FAMILY.serif,
              fontSize: SCORE.opponent.fontSize,
              fontWeight: SCORE.opponent.fontWeight,
              letterSpacing: SCORE.opponent.letterSpacing,
              // letter-spacing は文字の右側に付くので、中央揃えの見た目を補正する
              textIndent: SCORE.opponent.letterSpacing,
            }}
          >
            {opponent}
          </div>
        ) : null}

        <Points points={points} unit={unit} />

        <div style={{ marginTop: SCORE.stats.marginTop }}>
          {stats.map((line, index) => (
            <div
              key={`${index}-${line}`}
              style={{
                ...fadeSlideIn(frame, {
                  start: SCORE_IN.stats.start + SCORE_IN.stats.stagger * index,
                  duration: SCORE_IN.stats.duration,
                  slideY: SCORE_IN.stats.slideY,
                }),
                fontSize: statFontSize,
                fontWeight: SCORE.stats.fontWeight,
                lineHeight: SCORE.stats.lineHeight,
                letterSpacing: "0.04em",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      <BrandTag
        brandTag={brandTag}
        startSec={scoreBrandTagStart(stats.length)}
        align="center"
      />

      {credit ? <Credit text={credit} /> : null}

      {bgm ? <Bgm src={bgm} /> : null}
    </AbsoluteFill>
  );
};
