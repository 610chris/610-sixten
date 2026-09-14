/**
 * 同梱フォントの読み込み。
 * public/fonts/ のローカルファイルだけを使う（CDN依存なし・オフラインでも同じ結果になる）。
 * delayRender で読み込み完了まで待つので、レンダリング時に字形が崩れない。
 */

import { continueRender, delayRender, staticFile } from "remotion";

const handle = delayRender("Loading local fonts");

const fonts = [
  new FontFace(
    "Noto Sans JP",
    `url(${staticFile("fonts/NotoSansJP-Variable.ttf")}) format("truetype")`,
    { weight: "100 900" },
  ),
  new FontFace(
    "Playfair Display",
    `url(${staticFile("fonts/PlayfairDisplay-Variable.ttf")}) format("truetype")`,
    { weight: "400 900" },
  ),
];

Promise.all(fonts.map((f) => f.load()))
  .then((loaded) => {
    loaded.forEach((f) => document.fonts.add(f));
    continueRender(handle);
  })
  .catch((err) => {
    console.error("フォント読み込みに失敗しました", err);
    continueRender(handle);
  });
