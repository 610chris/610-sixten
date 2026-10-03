import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { layoutBody } from "./body";
import { NewsVideo } from "./NewsVideo";
import {
  parseNewsVideoInput,
  parseQuoteVideoInput,
  parseRankingVideoInput,
  parseScoreVideoInput,
} from "./props";
import { QuoteVideo } from "./QuoteVideo";
import { RankingVideo } from "./RankingVideo";
import { ScoreVideo } from "./ScoreVideo";
import { VIDEO } from "./theme";
import {
  computeQuoteDuration,
  computeRankingDuration,
  computeScoreDuration,
  resolveDurationInFrames,
  sec,
} from "./timeline";
import sampleJson from "../input/2026-06-nba-finals.json";
import scoreJson from "../tests/score-01.json";
import quoteJson from "../tests/quote-01.json";
import rankingJson from "../tests/ranking-01.json";

/**
 * Studio で開いたときに表示されるサンプル。
 * input/ の別JSONを見たいときは Studio 右側の props 欄を差し替えるか、
 * npm run render -- input/xxx.json でレンダリングする。
 * JSON の "template" で型が決まる（無ければニュース型）。Composition の id は scripts/render.ts と揃える。
 */
const SAMPLE_SOURCE = "input/2026-06-nba-finals.json";
const sample = parseNewsVideoInput(sampleJson, SAMPLE_SOURCE);
const scoreSample = parseScoreVideoInput(scoreJson, "tests/score-01.json");
const quoteSample = parseQuoteVideoInput(quoteJson, "tests/quote-01.json");
const rankingSample = parseRankingVideoInput(
  rankingJson,
  "tests/ranking-01.json",
);

/** durationInSeconds の指定があればそれを優先し、無ければ型ごとの自動計算 */
const frames = (auto: number, override?: number): number =>
  sec(override ?? auto);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="NewsVideo"
      component={NewsVideo}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      durationInFrames={resolveDurationInFrames(
        layoutBody(sample.body).lines.length,
        sample.durationInSeconds,
      )}
      defaultProps={sample}
      calculateMetadata={({ props }) => ({
        // 尺は本文の行数から自動計算する（durationInSeconds 指定があればそちらを優先）
        durationInFrames: resolveDurationInFrames(
          // 折り返し後の行数。1行ずつ出すので、折れて増えた行のぶんも尺に乗る
          layoutBody(props.body).lines.length,
          props.durationInSeconds,
        ),
      })}
    />
    <Composition
      id="ScoreVideo"
      component={ScoreVideo}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      durationInFrames={frames(
        computeScoreDuration(scoreSample.stats.length),
        scoreSample.durationInSeconds,
      )}
      defaultProps={scoreSample}
      calculateMetadata={({ props }) => ({
        durationInFrames: frames(
          computeScoreDuration(props.stats.length),
          props.durationInSeconds,
        ),
      })}
    />
    <Composition
      id="QuoteVideo"
      component={QuoteVideo}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      durationInFrames={frames(
        computeQuoteDuration(quoteSample.quote.length),
        quoteSample.durationInSeconds,
      )}
      defaultProps={quoteSample}
      calculateMetadata={({ props }) => ({
        durationInFrames: frames(
          computeQuoteDuration(props.quote.length),
          props.durationInSeconds,
        ),
      })}
    />
    <Composition
      id="RankingVideo"
      component={RankingVideo}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
      durationInFrames={frames(
        computeRankingDuration(rankingSample.rows.length, !!rankingSample.total),
        rankingSample.durationInSeconds,
      )}
      defaultProps={rankingSample}
      calculateMetadata={({ props }) => ({
        durationInFrames: frames(
          computeRankingDuration(props.rows.length, !!props.total),
          props.durationInSeconds,
        ),
      })}
    />
  </>
);
