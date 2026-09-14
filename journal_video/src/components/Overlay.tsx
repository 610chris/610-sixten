import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { linearOverDuration } from "../animation";
import { COLORS } from "../theme";
import { OVERLAY_OPACITY } from "../timeline";

/**
 * 暗転オーバーレイ。背景の上に黒の半透明レイヤーを敷き、
 * 全編かけて OVERLAY_OPACITY.from → to へ線形に濃くする。
 */
export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = linearOverDuration(frame, durationInFrames);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.overlay,
        opacity:
          OVERLAY_OPACITY.from + (OVERLAY_OPACITY.to - OVERLAY_OPACITY.from) * p,
      }}
    />
  );
};
