import { Config } from "@remotion/cli/config";

// Remotion Studio / CLI 共通設定。
// レンダリング本体の設定は scripts/render.ts 側にも同じ値を持たせている。
Config.setEntryPoint("./src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
