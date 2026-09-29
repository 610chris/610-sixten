import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { linearOverDuration } from "../animation";
import { COLORS } from "../theme";
import { OVERLAY_OPACITY } from "../timeline";

/**
 * 暗転オーバーレイ。背景の上に黒の半透明レイヤーを敷き、
 * 全編かけて OVERLAY_OPACITY.from → to へ線形に濃くする。
 * range を渡すとその範囲で濃くする（新しい3型は最初から暗い。theme.ts の DIM）。
 */
export const Overlay: React.FC<{
  range?: { from: number; to: number };
}> = ({ range = OVERLAY_OPACITY }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = linearOverDuration(frame, durationInFrames);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.overlay,
        opacity:
          range.from + (range.to - range.from) * p,
      }}
    />
  );
};
