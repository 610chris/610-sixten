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
        // 改行位置は wrapHeadline だけが決める。CSS には折り返させない。
        // 2026-10-04 まではここに overflowWrap:"anywhere" があり、幅の見積もりが甘いと
        // ブラウザが行末の1文字だけを次行へ落としていた（「シルバー委員長／が」）。
        // 幅は metrics.ts の実測値で計算するので、収まらない行はそもそも作られない。
        whiteSpace: "nowrap",
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
};
