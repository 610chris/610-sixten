import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeSlideIn } from "../animation";
import { BODY, FONT_FAMILY } from "../theme";
import { BODY_IN } from "../timeline";

/**
 * 本文。受け取るのは layoutBody（body.ts）で折り返しとサイズを確定させたあとの行
 * （2026-10-04 まで折り返しは CSS 任せで「落選組はシ／アトルへ」のように語の途中で折れていた）。
 * BODY_IN.start から BODY_IN.stagger 秒間隔で、1行ずつ順番にフェードイン＋スライドする。
 */
export const BodyLines: React.FC<{ lines: string[]; fontSize: number }> = ({
  lines,
  fontSize,
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ marginTop: BODY.marginTop }}>
      {lines.map((line, index) => (
        <div
          key={`${index}-${line}`}
          style={{
            ...fadeSlideIn(frame, {
              start: BODY_IN.start + BODY_IN.stagger * index,
              duration: BODY_IN.duration,
              slideY: BODY_IN.slideY,
            }),
            fontFamily: FONT_FAMILY.sans,
            fontSize,
            fontWeight: BODY.fontWeight,
            lineHeight: BODY.lineHeight,
            color: BODY.color,
            textAlign: "left",
            // 折り返しは layoutBody が決めるので CSS には折らせない
            whiteSpace: "nowrap",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
