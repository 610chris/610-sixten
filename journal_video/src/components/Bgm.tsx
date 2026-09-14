import React from "react";
import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";
import { BGM, sec } from "../timeline";

/**
 * BGM。JSON に "bgm"（public/ 配下の相対パス）があるときだけ鳴る。
 * 末尾は BGM.fadeOut 秒かけてフェードアウトさせ、ブツ切りを防ぐ。
 */
export const Bgm: React.FC<{ src: string }> = ({ src }) => {
  const { durationInFrames } = useVideoConfig();
  const fade = sec(BGM.fadeOut);

  return (
    <Audio
      src={staticFile(src)}
      volume={(frame) =>
        interpolate(
          frame,
          [durationInFrames - fade, durationInFrames - 1],
          [BGM.volume, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};
