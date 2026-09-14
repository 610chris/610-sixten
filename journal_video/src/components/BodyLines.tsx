import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeSlideIn } from "../animation";
import { BODY, bodyFontSize, FONT_FAMILY } from "../theme";
import { BODY_IN } from "../timeline";

/**
 * 本文。配列の1要素が1行。
 * BODY_IN.start から BODY_IN.stagger 秒間隔で、1行ずつ順番にフェードイン＋スライドする。
 */
export const BodyLines: React.FC<{ lines: string[] }> = ({ lines }) => {
  const frame = useCurrentFrame();
  const fontSize = bodyFontSize(lines);

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
            lineBreak: "strict",
            overflowWrap: "anywhere",
            whiteSpace: "pre-wrap",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
