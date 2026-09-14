import React from "react";
import { AbsoluteFill } from "remotion";
import { SCRIM } from "../theme";

/**
 * 文字の下敷き。上端（ラベル）と下端（見出し・本文・ブランドタグ）にだけ
 * 黒のグラデーションを常時敷いて、背景写真の明るさに関係なく白文字を読ませる。
 * 暗転オーバーレイ（時間で濃くなる）とは役割が別なので、こちらは時間で変化させない。
 * 濃さの数値は theme.ts の SCRIM。
 */
export const Scrim: React.FC = () => (
  <>
    <AbsoluteFill style={{ backgroundImage: SCRIM.top }} />
    <AbsoluteFill style={{ backgroundImage: SCRIM.bottom }} />
  </>
);
