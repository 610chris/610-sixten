import React from "react";
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearOverDuration } from "../animation";
import { BACKGROUND_ZOOM } from "../timeline";
import type { BackgroundSpec } from "../types";

/**
 * 背景レイヤー。画像でも動画でも画面全体を object-fit: cover で埋める。
 * 画像のときだけ、全編かけてゆっくりズームイン（Ken Burns）する。
 */
export const Background: React.FC<{ background: BackgroundSpec }> = ({
  background,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom =
    BACKGROUND_ZOOM.from +
    (BACKGROUND_ZOOM.to - BACKGROUND_ZOOM.from) *
      linearOverDuration(frame, durationInFrames);

  const style: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  if (background.type === "video") {
    return (
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(background.src)} style={style} muted />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(background.src)}
        style={{ ...style, transform: `scale(${zoom.toFixed(5)})` }}
      />
    </AbsoluteFill>
  );
};
