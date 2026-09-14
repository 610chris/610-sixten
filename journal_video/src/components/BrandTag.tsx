import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { progressIn } from "../animation";
import { BRAND_TAG, FONT_FAMILY, MARGIN_X, VIDEO } from "../theme";
import { BRAND_TAG_IN, brandTagStart } from "../timeline";
import { normalizeBrandTag, type BrandTagSpec } from "../types";

/**
 * 最下部のブランドタグ。白い背景ボックス＋黒の中身。
 * ボックスは中身の幅にフィットし、左寄せ。
 * 本文の最終行から少し置いて、白ボックスが左→右へワイプで開き、開ききってから中身が出る。
 */
export const BrandTag: React.FC<{
  brandTag: BrandTagSpec;
  bodyLineCount: number;
}> = ({ brandTag, bodyLineCount }) => {
  const frame = useCurrentFrame();
  const tag = normalizeBrandTag(brandTag);

  const start = brandTagStart(bodyLineCount);
  /** 白ボックスの開き具合（0=閉じている / 1=開ききり） */
  const wipe = progressIn(frame, start, BRAND_TAG_IN.wipeDuration);
  /** 中身（ロゴ／文字）のフェード。ワイプが開ききってから始める */
  const content = progressIn(
    frame,
    start + BRAND_TAG_IN.wipeDuration + BRAND_TAG_IN.contentDelay,
    BRAND_TAG_IN.contentFadeDuration,
  );

  return (
    <div
      style={{
        position: "absolute",
        bottom: VIDEO.height * BRAND_TAG.bottomRatio,
        left: MARGIN_X,
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: BRAND_TAG.boxColor,
          padding: `${BRAND_TAG.paddingY}px ${BRAND_TAG.paddingX}px`,
          display: "flex",
          alignItems: "center",
          // 右側を削っておき、ワイプの進行に合わせて左から右へ開く
          clipPath: `inset(0 ${((1 - wipe) * 100).toFixed(3)}% 0 0)`,
        }}
      >
        {tag.kind === "logo" ? (
          <Img
            src={staticFile(tag.src)}
            style={{
              opacity: content,
              height: tag.heightPx ?? BRAND_TAG.logoHeight,
              width: "auto",
              display: "block",
            }}
          />
        ) : (
          <span
            style={{
              opacity: content,
              fontFamily: FONT_FAMILY.sans,
              fontSize: BRAND_TAG.fontSize,
              fontWeight: BRAND_TAG.fontWeight,
              letterSpacing: BRAND_TAG.letterSpacing,
              color: BRAND_TAG.textColor,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {tag.text}
          </span>
        )}
      </div>
    </div>
  );
};
