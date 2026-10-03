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
  RANKING,
  VIDEO,
  SAFE_WIDTH,
  textWidthEm,
} from "./theme";
import {
  RANKING_IN,
  rankingBrandTagStart,
  rankingTotalStart,
  sec,
} from "./timeline";
import type { RankingVideoProps } from "./types";

/**
 * 1行の高さ。見出しの下からブランドタグの上までを、行数（＋合計行）で割って決める。
 * 行が少ないときは RANKING.rowMaxHeight で頭打ちにして、帯が太くなりすぎないようにする。
 */
const rowHeightFor = (
  titleFontSize: number,
  title: string,
  hasSubtitle: boolean,
  rowCount: number,
): number => {
  const titleLines = Math.max(
    1,
    Math.ceil((textWidthEm(title, RANKING.title.fontWeight) * titleFontSize) / SAFE_WIDTH),
  );
  const titleHeight =
    titleLines * titleFontSize * RANKING.title.lineHeight +
    (hasSubtitle
      ? RANKING.subtitle.marginTop + RANKING.subtitle.fontSize * 1.3
      : 0);
  const available =
    VIDEO.height -
    VIDEO.height * RANKING.topRatio -
    contentBottomPx(RANKING.gapAboveBrandTag) -
    titleHeight -
    RANKING.rowsMarginTop -
    RANKING.rowGap * (rowCount - 1);
  return Math.min(RANKING.rowMaxHeight, Math.floor(available / rowCount));
};

/** 帯1本分の中身（順位・名前・数値）。順位の列幅は行の高さに合わせる */
const RowContent: React.FC<{
  rank?: string;
  name: string;
  value: string;
  height: number;
  color: string;
}> = ({ rank, name, value, height, color }) => {
  const fontSize = Math.round(height * RANKING.fontRatio);
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        padding: `0 ${RANKING.paddingX}px`,
        gap: 24,
        color,
      }}
    >
      {rank !== undefined ? (
        <span
          style={{
            width: Math.round(fontSize * 1.6),
            fontFamily: FONT_FAMILY.serif,
            fontSize: Math.round(fontSize * 1.15),
            fontWeight: 700,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          {rank}
        </span>
      ) : null}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize,
          fontWeight: 700,
          lineHeight: 1.2,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontSize: Math.round(fontSize * 1.1),
          fontWeight: 800,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  );
};

/**
 * ランキングの型。
 * 大見出し → 半透明の帯が上から1行ずつ左から滑り込む → 合計行（白帯）がワイプで開く → ブランドタグ。
 */
export const RankingVideo: React.FC<RankingVideoProps> = ({
  label,
  title,
  subtitle,
  rows,
  total,
  background,
  brandTag,
  bgm,
  credit,
}) => {
  const frame = useCurrentFrame();
  const titleFontSize = fitFontSize(title, {
    width: SAFE_WIDTH,
    max: RANKING.title.max,
    min: RANKING.title.min,
    weight: RANKING.title.fontWeight,
  });
  const rowCount = rows.length + (total ? 1 : 0);
  const rowHeight = rowHeightFor(titleFontSize, title, !!subtitle, rowCount);

  const totalStart = rankingTotalStart(rows.length);
  const totalWipe = progressIn(
    frame,
    totalStart,
    RANKING_IN.total.wipeDuration,
  );
  const totalContent = progressIn(
    frame,
    totalStart + RANKING_IN.total.wipeDuration + RANKING_IN.total.contentDelay,
    RANKING_IN.total.contentFadeDuration,
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        fontFamily: FONT_FAMILY.sans,
        color: COLORS.white,
      }}
    >
      <Background background={background} />
      <Overlay range={DIM.ranking} />
      <Scrim />
      <Label text={label} />

      <div
        style={{
          position: "absolute",
          top: VIDEO.height * RANKING.topRatio,
          left: MARGIN_X,
          right: MARGIN_X,
        }}
      >
        <div style={fadeSlideIn(frame, RANKING_IN.title)}>
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: RANKING.title.fontWeight,
              lineHeight: RANKING.title.lineHeight,
              lineBreak: "strict",
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: RANKING.subtitle.marginTop,
                fontSize: RANKING.subtitle.fontSize,
                fontWeight: RANKING.subtitle.fontWeight,
                opacity: RANKING.subtitle.opacity,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            marginTop: RANKING.rowsMarginTop,
            display: "flex",
            flexDirection: "column",
            gap: RANKING.rowGap,
          }}
        >
          {rows.map((row, index) => {
            const p = progressIn(
              frame,
              RANKING_IN.rows.start + RANKING_IN.rows.stagger * index,
              RANKING_IN.rows.duration,
            );
            return (
              <div
                key={`${index}-${row.name}`}
                style={{
                  opacity: p,
                  transform: `translateX(${((p - 1) * RANKING_IN.rows.slideX).toFixed(3)}px)`,
                  backgroundColor: RANKING.rowColor,
                }}
              >
                <RowContent
                  rank={row.rank ?? String(index + 1)}
                  name={row.name}
                  value={row.value}
                  height={rowHeight}
                  color={COLORS.white}
                />
              </div>
            );
          })}

          {total ? (
            <div
              style={{
                backgroundColor: RANKING.totalColor,
                // 右側を削っておき、左→右へ開く（ブランドタグと同じ動き）
                clipPath: `inset(0 ${((1 - totalWipe) * 100).toFixed(3)}% 0 0)`,
                opacity: frame < sec(totalStart) ? 0 : 1,
              }}
            >
              <div style={{ opacity: totalContent }}>
                <RowContent
                  name={total.name}
                  value={total.value}
                  height={rowHeight}
                  color={RANKING.totalTextColor}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <BrandTag
        brandTag={brandTag}
        startSec={rankingBrandTagStart(rows.length, !!total)}
      />

      {credit ? <Credit text={credit} /> : null}

      {bgm ? <Bgm src={bgm} /> : null}
    </AbsoluteFill>
  );
};
