import React from "react";
import { CREDIT, FONT_FAMILY, MARGIN_X } from "../theme";

/**
 * 背景写真のクレジット。CC BY 系は表示義務があるので、全編アニメーションなしで固定表示する。
 * ブランドタグ（下から230px）より下の空きに置くので、文字ブロックとは重ならない。
 */
export const Credit: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: MARGIN_X,
      right: MARGIN_X,
      bottom: CREDIT.bottomPx,
      fontFamily: FONT_FAMILY.sans,
      fontSize: CREDIT.fontSize,
      fontWeight: CREDIT.fontWeight,
      color: CREDIT.color,
      opacity: CREDIT.opacity,
      lineHeight: 1.3,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {text}
  </div>
);
