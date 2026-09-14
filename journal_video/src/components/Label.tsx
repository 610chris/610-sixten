import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeSlideIn } from "../animation";
import { COLORS, FONT_FAMILY, LABEL, MARGIN_X, VIDEO } from "../theme";
import { LABEL_IN } from "../timeline";

/**
 * 上部の小さいラベル（例: "NEWS"）。画面上部・中央揃え・セリフ体。
 * 最初にこれだけがふわっとフェードインする。
 */
export const Label: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        ...fadeSlideIn(frame, LABEL_IN),
        position: "absolute",
        top: VIDEO.height * LABEL.topRatio,
        left: MARGIN_X,
        right: MARGIN_X,
        textAlign: "center",
        fontFamily: FONT_FAMILY.serif,
        fontSize: LABEL.fontSize,
        fontWeight: LABEL.fontWeight,
        letterSpacing: LABEL.letterSpacing,
        color: COLORS.accent ?? LABEL.color,
        // letter-spacing は文字の右側に付くので、中央揃えの見た目を補正する
        textIndent: LABEL.letterSpacing,
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
};
