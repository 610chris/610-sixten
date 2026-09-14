import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { NewsVideo } from "./NewsVideo";
import { parseNewsVideoInput } from "./props";
import { VIDEO } from "./theme";
import { resolveDurationInFrames } from "./timeline";
import sampleJson from "../input/2026-06-nba-finals.json";

/**
 * Studio で開いたときに表示されるサンプル。
 * input/ の別JSONを見たいときは Studio 右側の props 欄を差し替えるか、
 * npm run render -- input/xxx.json でレンダリングする。
 */
const SAMPLE_SOURCE = "input/2026-06-nba-finals.json";
const sample = parseNewsVideoInput(sampleJson, SAMPLE_SOURCE);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="NewsVideo"
    component={NewsVideo}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
    durationInFrames={resolveDurationInFrames(
      sample.body.length,
      sample.durationInSeconds,
    )}
    defaultProps={sample}
    calculateMetadata={({ props }) => ({
      // 尺は本文の行数から自動計算する（durationInSeconds 指定があればそちらを優先）
      durationInFrames: resolveDurationInFrames(
        props.body.length,
        props.durationInSeconds,
      ),
    })}
  />
);
