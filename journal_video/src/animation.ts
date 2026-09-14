/**
 * アニメーションの共通ヘルパー。
 * タイミングの数値は timeline.ts、見た目の数値は theme.ts。ここは"動かし方"だけ。
 */

import type React from "react";
import { Easing, interpolate } from "remotion";
import { sec } from "./timeline";

/** 全アニメーション共通のイージング（減速して止まる・バウンドしない） */
export const EASE = Easing.out(Easing.cubic);

/**
 * start 秒から duration 秒かけて 0→1 に進む進捗。
 * 前後はクランプするので、始まる前は0・終わったあとは1のまま保持される。
 */
export const progressIn = (
  frame: number,
  start: number,
  duration: number,
  easing: (v: number) => number = EASE,
): number =>
  interpolate(frame, [sec(start), sec(start + duration)], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * フェードイン（＋下から少し上へスライド）の style。
 * 最終状態（opacity:1・移動量0）はそのまま保持される。
 */
export const fadeSlideIn = (
  frame: number,
  { start, duration, slideY = 0 }: { start: number; duration: number; slideY?: number },
): React.CSSProperties => {
  const p = progressIn(frame, start, duration);
  return {
    opacity: p,
    ...(slideY === 0
      ? {}
      : { transform: `translateY(${((1 - p) * slideY).toFixed(3)}px)` }),
  };
};

/** 0→1 の線形進捗（全編かけてゆっくり変化させる用。イージングなし） */
export const linearOverDuration = (
  frame: number,
  durationInFrames: number,
): number =>
  interpolate(frame, [0, Math.max(1, durationInFrames - 1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
