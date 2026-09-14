/**
 * JSON を渡すだけで mp4 を書き出すレンダリングスクリプト。
 *
 *   npm run render -- input/2026-06-nba-finals.json   … 1本だけ
 *   npm run render:all                                 … input/ の全JSON
 *
 * 出力は out/<JSONと同じ名前>.mp4。尺は本文の行数から自動計算する
 * （JSON に durationInSeconds があればそちらが優先）。
 */

import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { parseNewsVideoInput } from "../src/props";
import { VIDEO } from "../src/theme";
import { BACKGROUND_ZOOM } from "../src/timeline";
import type { NewsVideoProps } from "../src/types";

/** npm script から実行されるので、カレントはプロジェクトルート */
const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "input");
const OUT_DIR = path.join(ROOT, "out");
const PUBLIC_DIR = path.join(ROOT, "public");
const COMPOSITION_ID = "NewsVideo";

/**
 * JPEG の EXIF Orientation を読む。
 * スマホや一眼で撮った写真は「横倒しのピクセル＋回転しろというEXIF」で入っていることがあり、
 * ブラウザ（＝Remotionの描画エンジン）は回転を適用して表示する。
 * 生のピクセル幅・高さのまま拡大率を計算すると縦横が逆になり、警告が真逆になるので、
 * 5〜8（90度系の回転）のときは幅と高さを入れ替える。
 */
const jpegOrientation = (buf: Buffer): number | undefined => {
  let i = 2;
  while (i + 4 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    // SOS 以降は画像データ本体なので探索を打ち切る
    if (marker === 0xda) return undefined;
    const segLength = buf.readUInt16BE(i + 2);
    if (marker === 0xe1 && buf.toString("ascii", i + 4, i + 8) === "Exif") {
      const tiff = i + 10; // "Exif\0\0" のあとが TIFF ヘッダ
      if (tiff + 8 > buf.length) return undefined;
      const le = buf.toString("ascii", tiff, tiff + 2) === "II";
      const u16 = (at: number) =>
        le ? buf.readUInt16LE(at) : buf.readUInt16BE(at);
      const u32 = (at: number) =>
        le ? buf.readUInt32LE(at) : buf.readUInt32BE(at);
      const ifd0 = tiff + u32(tiff + 4);
      if (ifd0 + 2 > buf.length) return undefined;
      const count = u16(ifd0);
      for (let e = 0; e < count; e += 1) {
        const entry = ifd0 + 2 + e * 12;
        if (entry + 12 > buf.length) break;
        if (u16(entry) === 0x0112) return u16(entry + 8); // Orientation
      }
      return undefined;
    }
    i += 2 + segLength;
  }
  return undefined;
};

/**
 * 画像の幅・高さをヘッダだけ読んで取る（PNG / JPEG / WebP）。
 * JPEG は EXIF の回転を反映した「実際に表示されるサイズ」を返す。
 * 解像度チェックのためだけなので、読めない形式は undefined を返して素通りさせる。
 */
const imageSize = (
  file: string,
): { width: number; height: number } | undefined => {
  const buf = fs.readFileSync(file);

  // PNG: IHDR が先頭固定位置にある
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // JPEG: SOF0/1/2… マーカーを探す
  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0-SOF3 / SOF5-SOF7 / SOF9-SOF11 / SOF13-SOF15 が寸法を持つ
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        const height = buf.readUInt16BE(i + 5);
        const width = buf.readUInt16BE(i + 7);
        // Orientation 5〜8 は 90度系の回転。表示上は縦横が入れ替わる
        const rotated = (jpegOrientation(buf) ?? 1) >= 5;
        return rotated
          ? { width: height, height: width }
          : { width, height };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
    return undefined;
  }

  // WebP（VP8X / VP8L / VP8 のロスあり）
  if (buf.length > 30 && buf.toString("ascii", 8, 12) === "WEBP") {
    const fourcc = buf.toString("ascii", 12, 16);
    if (fourcc === "VP8X") {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
      };
    }
    if (fourcc === "VP8 ") {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      };
    }
  }

  return undefined;
};

/**
 * 背景画像が 1080×1920 を埋めるのに足りているか見る。
 * 横長の記事ヒーロー画像（1600×900 など）をそのまま使うと2倍以上に引き伸ばされて眠くなるので、
 * 止めはせず「どれだけ足りないか」と必要サイズを出す。
 */
const warnIfBackgroundTooSmall = (props: NewsVideoProps, source: string) => {
  if (props.background.type !== "image") return;
  const file = path.join(PUBLIC_DIR, props.background.src);
  const size = imageSize(file);
  if (!size) return;

  // object-fit: cover ＋ Ken Burns の最大ズームぶんまで拡大される
  const scale =
    Math.max(VIDEO.width / size.width, VIDEO.height / size.height) *
    BACKGROUND_ZOOM.to;
  // 1.2倍までは肉眼で分からないので黙っておく
  if (scale <= 1.2) return;

  const needW = Math.ceil((size.width * scale) / 10) * 10;
  const needH = Math.ceil((size.height * scale) / 10) * 10;
  console.warn(
    `  ⚠ ${source}: 背景 ${props.background.src} は ${size.width}×${size.height} で、` +
      `画面いっぱいにするのに ${scale.toFixed(2)}倍まで拡大されます（眠い絵になります）。` +
      `${needW}×${needH} 以上の画像を推奨。`,
  );
};

/** JSON を読んで props にする。ここで弾けば描画時に落ちない */
const loadInput = (jsonPath: string): NewsVideoProps => {
  const source = path.relative(ROOT, jsonPath);
  const raw: unknown = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const props = parseNewsVideoInput(raw, source);

  // public/ 配下に実体があるか先に確かめる（無いと真っ黒な動画ができてしまう）
  const assets = [props.background.src, props.bgm].filter(
    (v): v is string => typeof v === "string",
  );
  if (typeof props.brandTag === "object" && props.brandTag.type === "logo") {
    assets.push(props.brandTag.src);
  }
  for (const asset of assets) {
    if (!fs.existsSync(path.join(PUBLIC_DIR, asset))) {
      throw new Error(
        `入力JSON (${source}) が参照している public/${asset} が見つかりません`,
      );
    }
  }
  warnIfBackgroundTooSmall(props, source);
  return props;
};

/** 引数から対象のJSONを決める */
const resolveTargets = (args: string[]): string[] => {
  if (args.includes("--all")) {
    const all = fs
      .readdirSync(INPUT_DIR)
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => path.join(INPUT_DIR, f));
    if (all.length === 0) {
      throw new Error(`input/ に JSON がありません: ${INPUT_DIR}`);
    }
    return all;
  }

  const files = args.filter((a) => !a.startsWith("--"));
  if (files.length === 0) {
    throw new Error(
      "レンダリングするJSONを指定してください\n" +
        "  例: npm run render -- input/2026-06-nba-finals.json\n" +
        "  全部: npm run render:all",
    );
  }
  return files.map((f) => path.resolve(ROOT, f));
};

const main = async () => {
  const targets = resolveTargets(process.argv.slice(2));

  // 先に全部のJSONを検証する（3本目で落ちて1・2本目だけ出来る、を防ぐ）
  const jobs = targets.map((jsonPath) => ({
    jsonPath,
    props: loadInput(jsonPath),
    outPath: path.join(
      OUT_DIR,
      `${path.basename(jsonPath, ".json")}.mp4`,
    ),
  }));

  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`バンドル中… (${jobs.length}本)`);
  const serveUrl = await bundle({
    entryPoint: path.join(ROOT, "src", "index.ts"),
    onProgress: () => undefined,
  });

  for (const [index, job] of jobs.entries()) {
    const composition = await selectComposition({
      serveUrl,
      id: COMPOSITION_ID,
      inputProps: job.props,
    });

    const seconds = composition.durationInFrames / composition.fps;
    let lastLogged = -1;
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      outputLocation: job.outPath,
      inputProps: job.props,
      imageFormat: "jpeg",
      concurrency: 4,
      overwrite: true,
      onProgress: ({ progress }) => {
        const pct = Math.floor(progress * 100);
        if (pct >= lastLogged + 10) {
          lastLogged = pct;
          process.stdout.write(
            `  [${index + 1}/${jobs.length}] ${path.basename(job.outPath)} ${pct}%\r`,
          );
        }
      },
    });

    console.log(
      `  [${index + 1}/${jobs.length}] ${path.relative(ROOT, job.outPath)} ` +
        `(${seconds.toFixed(2)}秒 / ${composition.durationInFrames}フレーム` +
        `${job.props.bgm ? " / BGMあり" : ""})`,
    );
  }

  console.log(`完了: ${jobs.length}本を out/ に書き出しました`);
};

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
