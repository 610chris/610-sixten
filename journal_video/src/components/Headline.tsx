import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeSlideIn } from "../animation";
import { wrapHeadline } from "../headline";
import { FONT_FAMILY, HEADLINE } from "../theme";
import { HEADLINE_IN } from "../timeline";

/**
 * 大見出し。左寄せ・極太サンセリフ。
 * ラベルのあと、下から少し上へスライドしながらフェードインする。
 * 改行位置と文字サイズは wrapHeadline が日本語の切れ目を見て決める（基本2行・長いものは3行）。
 */
export const Headline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { lines, fontSize } = wrapHeadline(text);

  return (
    <div
      style={{
        ...fadeSlideIn(frame, HEADLINE_IN),
        fontFamily: FONT_FAMILY.sans,
        fontSize,
        fontWeight: HEADLINE.fontWeight,
        lineHeight: HEADLINE.lineHeight,
        color: HEADLINE.color,
        textAlign: "left",
        // 想定外に長い行が来ても、はみ出す前に CSS 側でも折り返す
        lineBreak: "strict",
        overflowWrap: "anywhere",
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};
