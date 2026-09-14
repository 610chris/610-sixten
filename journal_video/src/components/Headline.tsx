import React from "react";
import { useCurrentFrame } from "remotion";
import { fadeSlideIn } from "../animation";
import { FONT_FAMILY, HEADLINE, headlineFontSize } from "../theme";
import { HEADLINE_IN } from "../timeline";

/**
 * 大見出し。左寄せ・極太サンセリフ。
 * ラベルのあと、下から少し上へスライドしながらフェードインする。
 * 長い見出しは headlineFontSize で段階的に縮み、さらに CSS 側でも折り返すのではみ出さない。
 */
export const Headline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        ...fadeSlideIn(frame, HEADLINE_IN),
        fontFamily: FONT_FAMILY.sans,
        fontSize: headlineFontSize(text),
        fontWeight: HEADLINE.fontWeight,
        lineHeight: HEADLINE.lineHeight,
        color: HEADLINE.color,
        textAlign: "left",
        // 日本語は禁則処理を効かせつつ、長い英単語も強制改行してはみ出しを防ぐ
        lineBreak: "strict",
        overflowWrap: "anywhere",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
};
