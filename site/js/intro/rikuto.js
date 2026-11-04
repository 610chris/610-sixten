/* リクト（RIKUTO AF）のオープニング（2026-11-05 作り直し）
   マーベル・スタジオのオープニング（2016〜 ファンファーレ版）の構成・テンポ・質感をなぞる（ロゴ・キャラ・映像は使わない）
   ① 暗い2色刷りの印刷物の超寄り → ② 明るいオレンジの印刷物（網点＋線画）が数フレームごとにホイップで切替
   → ③ タイプ文字 → ④ 実写写真のディゾルブ（選手名のタイプ文字・横の光）→ ⑤ 白飛び→炎の寄り→光の筋
   → ⑥ 立体ロゴ（銀の板に「RIKUTO」の抜き・奥に写真）の表面を飛び、引きながら正面へ → 抜きの中がオレンジで確定
   色: マーベルの赤 → ニックスのオレンジ、差し色に青。文字に縁取りは付けない（抜きだけ）
   写真: Wikimedia Commons（作者・ライセンスはページ下部のクレジット）＋ スプリーウェル（ニックス時代）＋ リクト本人の写真（Instagram @rikutoaf）
   Canvas 2D だけで描く（立体は縦の短冊に分けた透視で近似）。演出は時刻 t の純関数 → ?introt=秒 で止めて確認できる */
import { runIntro, clamp, prog, easeOut, easeIn, easeInOut, rand } from './core.js';

const DUR = 6.8;
const BASE = '../../assets/s5/rikuto/intro/';
const FILES = {
  brunson: 'brunson.webp', champ: 'champ.webp', ewing: 'ewing88.webp', frazier: 'frazier.webp', lin: 'lin.webp',
  melo: 'melo.webp', msg68: 'msg1968.webp', msg: 'msggame.webp', reed: 'reed.webp', times: 'times.webp',
  spree: 'sprewell.webp',
  // リクト本人（本人の Instagram @rikutoaf より・文字入りの YouTube サムネは使わない）
  rikuto: 'rikuto-hoodie.webp', rikuto2: 'rikuto-allen.webp', rikuto3: 'rikuto-shake.webp',
};
// 写真ごとの「ピントを合わせる点」（横, 縦 を 0〜1）
const FOC = {
  brunson: { face: [0.37, 0.29], ball: [0.26, 0.43], body: [0.33, 0.5] },
  champ: { trophy: [0.28, 0.32], face: [0.48, 0.2] },
  ewing: { text: [0.35, 0.3], text2: [0.62, 0.62], num: [0.5, 0.12] },
  frazier: { face: [0.6, 0.3], eye: [0.64, 0.24], hand: [0.82, 0.86] },
  lin: { play: [0.5, 0.55], player: [0.47, 0.42] },
  melo: { face: [0.5, 0.16], num: [0.52, 0.5], ball: [0.68, 0.64], band: [0.5, 0.1] },
  msg68: { court: [0.5, 0.62], sign: [0.58, 0.93], roof: [0.5, 0.12] },
  msg: { court: [0.5, 0.6], board: [0.92, 0.12] },
  reed: { ball: [0.62, 0.08], face: [0.38, 0.33], leg: [0.35, 0.85] },
  times: { board: [0.62, 0.35], crowd: [0.5, 0.85] },
  spree: { face: [0.5, 0.52], fist: [0.28, 0.36], jersey: [0.55, 0.88] },
  rikuto: { face: [0.3, 0.42], eye: [0.3, 0.36] },
  rikuto2: { face: [0.86, 0.32], trophy: [0.12, 0.55] },
  rikuto3: { face: [0.25, 0.32], hand: [0.44, 0.68] },
};
const ORANGE = '#f58426', BLUE = '#2f6bd8';
const TONE = { orange: '#f58426', blue: '#2f6bd8', teal: '#1d8fb8' };

// ── 段ごとのショット ─────────────────────────────
// 印刷物（暗）: [写真, ピント, 寄り, 流れる向き(度)]
const PRINT_DARK = [['msg68', 'roof', 2.4, 200], ['ewing', 'num', 2.8, 80], ['reed', 'leg', 2.6, 20]];
// 印刷物（明）: 数フレームごとに切替。紙の色 0=黄 1=オレンジ 2=深いオレンジ 3=青（差し色）
const PRINT = [
  ['reed', 'ball', 2.6, 200, 0], ['frazier', 'eye', 3.0, 20, 1], ['msg68', 'sign', 2.4, 180, 0], ['melo', 'face', 2.6, 300, 2],
  ['ewing', 'text', 2.2, 90, 0], ['brunson', 'ball', 2.8, 160, 1], ['times', 'board', 2.0, 0, 3], ['reed', 'face', 2.6, 250, 0],
  ['lin', 'player', 2.4, 30, 1], ['champ', 'trophy', 2.6, 120, 0], ['frazier', 'hand', 2.6, 210, 2], ['melo', 'num', 2.2, 340, 0],
  ['msg', 'court', 1.8, 270, 1], ['brunson', 'face', 2.8, 60, 0],
];
// 実写: [写真, ピント, 寄り, トーン, 名前]
const LIVE = [
  ['frazier', 'face', 1.3, 'blue', 'CLYDE'], ['melo', 'face', 1.25, 'orange', 'MELO'], ['msg68', 'court', 1.2, 'teal', 'THE GARDEN'],
  ['lin', 'play', 1.25, 'blue', 'LINSANITY'], ['reed', 'face', 1.3, 'orange', 'THE CAPTAIN'], ['spree', 'face', 1.3, 'teal', 'SPREE'],
  ['brunson', 'face', 1.35, 'blue', 'BRUNSON'],
  ['champ', 'trophy', 1.3, 'orange', 'NEW YORK'], ['rikuto', 'face', 1.25, 'blue', 'RIKUTO'],
];
const FIRE = [['brunson', 'ball', 2.4], ['melo', 'band', 2.6]];
// 文字の抜きの奥に入る写真（文字ごとに別々に切り替わる）
const HOLE = [
  ['melo', 'face', 1.5], ['frazier', 'face', 1.4], ['msg68', 'court', 1.2], ['brunson', 'face', 1.5], ['reed', 'face', 1.4],
  ['lin', 'player', 1.4], ['times', 'board', 1.2], ['champ', 'trophy', 1.4], ['melo', 'num', 1.3], ['ewing', 'text', 1.3],
  ['rikuto', 'face', 1.3], ['msg', 'court', 1.2], ['brunson', 'ball', 1.5], ['reed', 'ball', 1.5], ['frazier', 'eye', 2.0], ['champ', 'face', 1.4],
  ['spree', 'face', 1.5], ['rikuto2', 'face', 1.6], ['rikuto3', 'face', 1.5],
];
const HOLE_TONE = ['orange', 'blue', 'orange', 'teal', 'orange', 'blue'];

// ── タイムライン（実物の約28秒を6.8秒に圧縮。カットは実物より速く） ──
function makeCuts(t0, n, d0, d1) { const a = []; let t = t0; for (let k = 0; k < n; k++) { a.push(t); t += d0 + (d1 - d0) * (n > 1 ? k / (n - 1) : 0); } a.push(t); return a; }
const B_CUTS = [0.12, 0.245, 0.37, 0.49];
const C_CUTS = makeCuts(0.49, PRINT.length, 0.085, 0.052); // 5→3フレーム@60fps に加速
const C_END = C_CUTS[C_CUTS.length - 1];
const D0 = C_END - 0.03, D1 = D0 + 0.3;
const E_CUTS = makeCuts(D1 - 0.06, LIVE.length, 0.19, 0.152); // 9カットで8カット時と同じ尺（約1.54秒）に収める
const E_END = E_CUTS[E_CUTS.length - 1];
const F_T = E_END - 0.03;          // 白飛びのピーク
const G0 = E_END, G1 = G0 + 0.27;  // 炎
const H0 = G1 - 0.04, H1 = H0 + 0.42; // 光の筋
const L0 = H1 - 0.1;               // 立体ロゴ
// カメラ: [秒, 距離(文字の高さ=1), 横回転, 見下ろし, 傾き(度), 注視点x(全幅比), 注視点y(高さ比)]
const CAMK = [
  [L0, 1.3, 62, 20, -16, 0.04, 0.55],
  [4.45, 1.9, 56, 20, -15, 0.4, 0.55],
  [5.0, 3.6, 40, 17, -12, 0.55, 0.5],
  [5.55, 6.0, 18, 9, -5, 0.5, 0.5],
  [6.0, 9.0, 2.5, 4, -0.6, 0.5, 0.5],
  [DUR, 9.35, 0, 3, 0, 0.5, 0.5],
];
const D2R = Math.PI / 180;

function camAt(t) { // エルミート補間（速度がつながる＝カメラが止まらない）
  const K = CAMK; t = clamp(t, K[0][0], K[K.length - 1][0]);
  let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1], h = b[0] - a[0], s = (t - a[0]) / h, s2 = s * s, s3 = s2 * s;
  const out = [];
  for (let j = 1; j < a.length; j++) {
    const m = (k) => { const p = K[Math.max(0, k - 1)], q = K[Math.min(K.length - 1, k + 1)]; return (q[j] - p[j]) / (q[0] - p[0]); };
    const m0 = (i === 0 ? 0.6 : 1) * m(i) * h, m1 = (i + 1 === K.length - 1 ? 0 : m(i + 1)) * h;
    out.push((2 * s3 - 3 * s2 + 1) * a[j] + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * b[j] + (s3 - s2) * m1);
  }
  return out;
}
// 文字の奥の写真が何回切り替わったか（後半ほど速い）
function holePhase(t) {
  const seg = [[L0, 0.12], [4.85, 0.055], [5.55, 0.1], [6.0, 0]];
  let p = 0;
  for (let i = 0; i < seg.length - 1; i++) { const a = seg[i][0], b = seg[i + 1][0]; if (t <= a) break; p += (Math.min(t, b) - a) / seg[i][1]; }
  return p;
}
function cutAt(cuts, t) { let i = 0; while (i < cuts.length - 2 && cuts[i + 1] <= t) i++; return i; }

function loadImg(src) {
  return new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; });
}
const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };

// 写真 → 2色刷りの版（網点＋線画の黒インク・白い紙）。描く時に紙の色の上へ乗算する
function makeInk(im) {
  const s = Math.min(1, 640 / Math.max(im.width, im.height));
  const w = Math.max(3, Math.round(im.width * s)), h = Math.max(3, Math.round(im.height * s));
  const c = mk(w, h), x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(im, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h), p = d.data, n = w * h;
  const L = new Float32Array(n), hist = new Uint32Array(64);
  for (let i = 0; i < n; i++) { const v = (p[i * 4] * 0.299 + p[i * 4 + 1] * 0.587 + p[i * 4 + 2] * 0.114) / 255; L[i] = v; hist[Math.min(63, v * 64 | 0)]++; }
  let acc = 0, lo = 0, hi = 1;
  for (let b = 0; b < 64; b++) { acc += hist[b]; if (acc < n * 0.02) lo = b / 64; if (acc < n * 0.98) hi = (b + 1) / 64; }
  const rg = Math.max(0.2, hi - lo);
  for (let y = 0; y < h; y++) {
    for (let xx = 0; xx < w; xx++) {
      const i = y * w + xx, k = i * 4;
      const v = clamp((L[i] - lo) / rg);
      let e = 0;
      if (xx > 0 && xx < w - 1 && y > 0 && y < h - 1) {
        const gx = (L[i - w + 1] + 2 * L[i + 1] + L[i + w + 1]) - (L[i - w - 1] + 2 * L[i - 1] + L[i + w - 1]);
        const gy = (L[i + w - 1] + 2 * L[i + w] + L[i + w + 1]) - (L[i - w - 1] + 2 * L[i - w] + L[i - w + 1]);
        e = Math.sqrt(gx * gx + gy * gy) / rg;
      }
      const u = (xx + y) * 0.7071 / 4.2, vv = (xx - y) * 0.7071 / 4.2;
      const fu = u - Math.floor(u) - 0.5, fv = vv - Math.floor(vv) - 0.5;
      const dark = Math.pow(1 - v, 1.6);
      const ink = e > 0.6 || v < 0.13 || Math.sqrt(fu * fu + fv * fv) < Math.sqrt(dark * 0.8 / Math.PI);
      p[k] = ink ? 38 : 255; p[k + 1] = ink ? 12 : 255; p[k + 2] = ink ? 4 : 255; p[k + 3] = 255;
    }
  }
  x.putImageData(d, 0, 0);
  return c;
}

runIntro({
  key: 'rikuto',
  duration: DUR,
  gl: false,
  async setup(ctx) {
    const fontP = Promise.race([document.fonts.load('400 120px "Anton"', 'RIKUTO AF'), new Promise((r) => setTimeout(r, 1200))]).catch(() => {});
    const names = Object.keys(FILES);
    const loaded = await Promise.all(names.map((n) => loadImg(BASE + FILES[n]).catch(() => null)));
    await fontP;
    const IM = {};
    names.forEach((n, i) => { if (loaded[i]) IM[n] = loaded[i]; });
    const have = Object.keys(IM);
    if (have.length < 6) throw new Error('no images');
    const img = (n) => IM[n] || IM[have[0]];
    const foc = (n, k) => (IM[n] && FOC[n] && FOC[n][k]) || [0.5, 0.45];
    const INK = {};
    for (const n of have) INK[n] = makeInk(IM[n]);
    const ink = (n) => INK[n] || INK[have[0]];

    const cv = ctx.canvas;
    const g = cv.getContext('2d');
    const off = document.createElement('canvas'), og = off.getContext('2d');
    const loff = document.createElement('canvas'), lg = loff.getContext('2d');
    let W = 0, H = 0;
    const dpr = ctx.dpr;
    const FONT = (px) => `400 ${px}px "Anton", "Archivo Black", "Impact", sans-serif`;
    const TYPE = (px) => `700 ${px}px "Courier New", Courier, monospace`;

    // フィルム粒子
    const noise = mk(192, 192);
    {
      const nx = noise.getContext('2d'), d = nx.createImageData(192, 192), R = rand(11);
      for (let i = 0; i < d.data.length; i += 4) { const v = R() * 255 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
      nx.putImageData(d, 0, 0);
    }
    const noisePat = g.createPattern(noise, 'repeat');
    // 光の筋の乱数（固定）
    const SR = rand(23), STREAK = Array.from({ length: 150 }, () => [SR(), SR(), SR(), SR(), SR(), SR()]);
    const GR = rand(5), GLOW = Array.from({ length: 32 }, () => [GR(), GR(), GR()]);

    // ── 立体ロゴの型（resize のたびに作る） ──
    let LG = null;
    function buildLogo() {
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.font = FONT(100);
      const mh = g.measureText('H');
      const cap = mh.actualBoundingBoxAscent > 20 ? mh.actualBoundingBoxAscent : 73.5;
      // 幅は Anton 100px のまま測って控えておく（restore 後に measureText すると既定フォントで測ってしまう）
      const W100 = {};
      for (const s of ['MARVEL', 'R', 'I', 'K', 'U', 'T', 'O', 'A', 'F']) W100[s] = g.measureText(s).width;
      g.restore();
      const adv = (s) => W100[s] / cap;
      // 字形: 実物のロゴと同じく「1文字の幅＝高さの約0.49」「字間ほぼ0」に合わせて横を詰める
      const sx = clamp(2.94 / adv('MARVEL'), 0.72, 1.3);
      const padX = 0.075, padY = 0.12, trk = -0.012, gap = 0.12, trkR = 0.05, lineT = 0.045;
      const PH = 1 + padY * 2;
      const letters = []; let x = padX;
      for (const ch of 'RIKUTO') { const w = adv(ch) * sx; letters.push({ ch, x, w }); x += w + trk; }
      const PW = x - trk + padX;
      const right = []; x = PW + gap;
      for (const ch of 'AF') { const w = adv(ch) * sx; right.push({ ch, x, w }); x += w + trkR; }
      const LW = x - trkR;
      // 最後に正面で収まる大きさ（横長は幅の72%、縦長は92%。高さは画面の26%まで）
      const fit = W / H < 0.8 ? 0.92 : 0.72;
      const finalCap = Math.min(fit * W / LW, 0.26 * H / PH);
      const DF = CAMK[CAMK.length - 1][1];
      const F = finalCap * DF;
      const CH = Math.round(clamp(finalCap * dpr * 2.2, 160, 520));
      const SW = LW * CH, SH = PH * CH, fpx = CH * 100 / cap, base = (padY + 1) * CH;

      const face = mk(SW, SH), fx = face.getContext('2d');
      const silver = fx.createLinearGradient(0, 0, 0, SH);
      silver.addColorStop(0, '#ececee'); silver.addColorStop(0.2, '#c6c7cb'); silver.addColorStop(0.5, '#8f9197');
      silver.addColorStop(0.62, '#9ea0a6'); silver.addColorStop(0.86, '#cacbcf'); silver.addColorStop(1, '#ebebec');
      fx.fillStyle = silver;
      fx.fillRect(0, 0, PW * CH, SH);
      fx.font = FONT(fpx); fx.textBaseline = 'alphabetic'; fx.textAlign = 'left';
      for (const r of right) { fx.save(); fx.translate(r.x * CH, base); fx.scale(sx, 1); fx.fillText(r.ch, 0, 0); fx.restore(); }
      fx.fillRect((PW + gap) * CH, 0, (LW - PW - gap) * CH, lineT * CH);
      fx.fillRect((PW + gap) * CH, SH - lineT * CH, (LW - PW - gap) * CH, lineT * CH);
      // ヘアライン（横の細かい筋）
      fx.globalCompositeOperation = 'source-atop';
      const R = rand(7);
      for (let y = 0; y < SH; y++) {
        const v = R();
        fx.fillStyle = v < 0.5 ? `rgba(255,255,255,${(0.5 - v) * 0.24})` : `rgba(0,0,0,${(v - 0.5) * 0.2})`;
        fx.fillRect(0, y, SW, 1);
      }
      for (let k = 0; k < 260; k++) { // 長さの違う筋
        fx.fillStyle = R() < 0.5 ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)';
        fx.fillRect(R() * SW, R() * SH, (0.1 + R() * 0.5) * SW, 1);
      }
      const warm = fx.createLinearGradient(0, SH * 0.55, 0, SH);
      warm.addColorStop(0, 'rgba(245,132,38,0)'); warm.addColorStop(1, 'rgba(245,132,38,0.2)');
      fx.fillStyle = warm; fx.fillRect(0, 0, SW, SH);
      // RIKUTO を抜く（縁取りなし）
      fx.globalCompositeOperation = 'destination-out';
      fx.fillStyle = '#000';
      for (const l of letters) { fx.save(); fx.translate(l.x * CH, base); fx.scale(sx, 1); fx.fillText(l.ch, 0, 0); fx.restore(); }
      fx.globalCompositeOperation = 'source-over';

      const variant = (col) => { const c = mk(SW, SH), x2 = c.getContext('2d'); x2.drawImage(face, 0, 0); x2.globalCompositeOperation = 'source-atop'; x2.fillStyle = col; x2.fillRect(0, 0, SW, SH); return c; };
      const faceLow = variant('rgba(14,8,5,0.74)');
      const faceHi = variant('rgba(255,250,242,0.62)');
      const side = variant('#4e1e08');
      const hole = mk(PW * CH, SH);
      // 文字ごとの帯（文字の間の中点で区切る）
      const bands = letters.map((l, i) => {
        const a = i === 0 ? 0 : (letters[i - 1].x + letters[i - 1].w + l.x) / 2;
        const b = i === letters.length - 1 ? PW : (l.x + l.w + letters[i + 1].x) / 2;
        return [a, b];
      });
      LG = { PH, PW, LW, F, CH, gap, face, faceLow, faceHi, side, hole, bands, T: 0.17 };
    }

    function resize() {
      W = ctx.W; H = ctx.H;
      cv.width = off.width = loff.width = Math.round(W * dpr);
      cv.height = off.height = loff.height = Math.round(H * dpr);
      buildLogo();
    }

    // ── 描画の小道具 ──
    // 写真を矩形いっぱいに（ピント点を中央へ・寄り・ずらし）。はみ出さないように寄せる
    function coverRect(c, im, f, zoom, rx, ry, rw, rh, dx = 0, dy = 0) {
      const r = Math.max(rw / im.width, rh / im.height) * zoom, w = im.width * r, h = im.height * r;
      let x = rx + rw / 2 - f[0] * w, y = ry + rh / 2 - f[1] * h;
      x = clamp(x, rx + rw - w, rx); y = clamp(y, ry + rh - h, ry);
      c.drawImage(im, x + dx * rw, y + dy * rh, w, h);
    }
    // 方向モーションブラー（ずらして平均）
    function blurShot(c, im, f, zoom, dx, dy, bx, by, n) {
      c.save();
      for (let i = 0; i < n; i++) {
        const k = n > 1 ? i / (n - 1) - 0.5 : 0;
        c.globalAlpha = 1 / (i + 1);
        coverRect(c, im, f, zoom, 0, 0, W, H, dx + bx * k, dy + by * k);
      }
      c.restore();
    }
    // ズームブラー（拡大率をずらして平均）
    function zoomShot(c, im, f, zoom, amt, n) {
      c.save();
      for (let i = 0; i < n; i++) { c.globalAlpha = 1 / (i + 1); coverRect(c, im, f, zoom * (1 + amt * i / Math.max(1, n - 1)), 0, 0, W, H); }
      c.restore();
    }
    function fillAll(c, style, op = 'source-over', a = 1) {
      c.save(); c.globalCompositeOperation = op; c.globalAlpha = a; c.fillStyle = style; c.fillRect(0, 0, W, H); c.restore();
    }
    function radial(c, x, y, r, stops, op, a = 1) {
      const gr = c.createRadialGradient(x, y, 0, x, y, r);
      for (const [o, col] of stops) gr.addColorStop(o, col);
      fillAll(c, gr, op, a);
    }
    function offBegin() { og.setTransform(dpr, 0, 0, dpr, 0, 0); og.globalCompositeOperation = 'source-over'; og.globalAlpha = 1; }
    function offPut(op = 'source-over', a = 1) { g.save(); g.globalCompositeOperation = op; g.globalAlpha = a; g.drawImage(off, 0, 0, W, H); g.restore(); }

    // ── ①② 印刷物（コミックの段の代わり） ──
    const PAPER = [
      ['#fff6c8', '#ffd04a', '#f58426', '#9a3208'],
      ['#ffe7a8', '#ffab3a', '#e2621a', '#7a2405'],
      ['#ffcf8a', '#f58426', '#b8400c', '#4a1204'],
      ['#dcecff', '#6fa2ff', '#2f6bd8', '#0b2a6b'],
    ];
    function drawPrintShot(t, sh, t0, dark, idx) {
      const [nm, fk, z, dirD, pal] = sh;
      const lt = t - t0, a = dirD * D2R, v = dark ? 0.07 : 0.3;
      const whip = dark ? 0 : 1 - clamp(lt / 0.04);
      const bl = (dark ? 0.012 : 0.02) + 0.2 * whip;
      offBegin();
      og.fillStyle = '#fff'; og.fillRect(0, 0, W, H);
      blurShot(og, ink(nm), foc(nm, fk), z * (1 + (dark ? 0.25 : 0.6) * lt), Math.cos(a) * v * lt, Math.sin(a) * v * lt, Math.cos(a) * bl, Math.sin(a) * bl, whip > 0 ? 6 : 3);
      const R = rand(101 + idx * 7), rx = R(), ry = R(), gl = R();
      if (dark) {
        const gr = g.createLinearGradient(0, 0, W * 0.4, H);
        gr.addColorStop(0, '#7a2207'); gr.addColorStop(1, '#260702');
        fillAll(g, gr);
      } else {
        const P = PAPER[pal];
        const gr = g.createRadialGradient(W * (0.3 + 0.4 * rx), H * (0.3 + 0.4 * ry), 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.95);
        gr.addColorStop(0, P[0]); gr.addColorStop(0.3, P[1]); gr.addColorStop(0.68, P[2]); gr.addColorStop(1, P[3]);
        fillAll(g, gr);
      }
      offPut('multiply');
      if (!dark) { // 白飛び（毎カット位置と強さが違う）
        const s = 0.3 + 0.65 * gl;
        radial(g, W * (0.15 + 0.7 * rx), H * (0.15 + 0.7 * ry), Math.max(W, H) * (0.35 + 0.4 * gl),
          [[0, `rgba(255,252,236,${s})`], [0.35, `rgba(255,214,120,${s * 0.55})`], [1, 'rgba(255,170,60,0)']], 'screen');
      } else {
        radial(g, W * 0.5, H * 0.5, Math.max(W, H) * 0.8, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.55)']], 'source-over');
      }
    }
    function drawPrint(t) {
      if (t < B_CUTS[B_CUTS.length - 1]) {
        const i = cutAt(B_CUTS, t);
        drawPrintShot(t, PRINT_DARK[i], B_CUTS[i], true, i);
        const fin = clamp((t - B_CUTS[0]) / 0.08); // 黒から立ち上がる
        if (fin < 1) fillAll(g, '#000', 'source-over', 1 - fin);
      } else {
        const i = cutAt(C_CUTS, t);
        drawPrintShot(t, PRINT[i], C_CUTS[i], false, i + 10);
      }
    }

    // ③ タイプ文字
    const TYPE_LINES = ['the New York Knickerbockers,', 'est. 1946 —', 'Madison Square Garden, N.Y.'];
    function drawType(t) {
      const lt = t - D0;
      offBegin();
      og.fillStyle = '#fff'; og.fillRect(0, 0, W, H);
      coverRect(og, ink('ewing'), foc('ewing', 'text2'), 1.6 * (1 + 0.15 * lt), 0, 0, W, H, -0.05 * lt, 0);
      const gr = g.createRadialGradient(W * 0.45, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
      gr.addColorStop(0, '#c2410c'); gr.addColorStop(0.6, '#7a1e06'); gr.addColorStop(1, '#2a0802');
      g.save(); g.globalAlpha = clamp(lt / 0.05); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
      offPut('multiply', clamp(lt / 0.05) * 0.85);
      const sz = Math.min(W * 0.075, H * 0.1);
      g.save();
      g.globalCompositeOperation = 'screen';
      g.globalAlpha = clamp(lt / 0.05) * (1 - prog(t, D1 - 0.08, D1 + 0.02) * 0.5);
      g.font = TYPE(sz); g.fillStyle = '#ffe2c4'; g.textBaseline = 'middle';
      TYPE_LINES.forEach((s, i) => {
        const x = W * 0.06 - (0.25 + i * 0.08) * W * lt + (i - 1) * sz * 0.7;
        for (let k = 0; k < 3; k++) { g.globalAlpha *= 0.75; g.fillText(s, x - k * sz * 0.08, H * 0.5 + (i - 1) * sz * 1.25); }
      });
      g.restore();
    }

    // ④ 実写
    function drawLiveShot(c, sh, lt, k) {
      const [nm, fk, z, tone] = sh;
      const dir = k % 2 ? 1 : -1;
      const bl = 0.06 * (1 - clamp(lt / 0.06));
      blurShot(c, img(nm), foc(nm, fk), z * (1 + 0.5 * lt), dir * (0.025 - 0.1 * lt), 0, dir * bl, 0, bl > 0.003 ? 4 : 1);
      c.save();
      c.globalCompositeOperation = 'color'; c.globalAlpha = 0.42; c.fillStyle = TONE[tone]; c.fillRect(0, 0, W, H);
      c.globalCompositeOperation = 'soft-light'; c.globalAlpha = 0.55; c.fillRect(0, 0, W, H);
      c.restore();
      // 反対色の横の光漏れ（青のカットにはオレンジ、オレンジのカットには青）
      const lc = tone === 'orange' ? '111,162,255' : '255,150,60';
      const R = rand(300 + k), yy = H * (0.25 + 0.5 * R()), xx = W * (-0.2 + 0.4 * R() + 1.2 * lt);
      c.save(); c.globalCompositeOperation = 'screen';
      c.translate(xx, yy); c.scale(1, 0.18);
      const gr = c.createRadialGradient(0, 0, 0, 0, 0, W * 0.7);
      gr.addColorStop(0, `rgba(${lc},0.75)`); gr.addColorStop(0.4, `rgba(${lc},0.25)`); gr.addColorStop(1, `rgba(${lc},0)`);
      c.fillStyle = gr; c.fillRect(-W * 0.7, -W * 0.7, W * 1.4, W * 1.4);
      c.restore();
      c.save(); c.globalCompositeOperation = 'screen'; // 細い横線（アナモルフィック）
      const lg2 = c.createLinearGradient(0, 0, W, 0);
      lg2.addColorStop(0, `rgba(${lc},0)`); lg2.addColorStop(0.5, `rgba(${lc},0.8)`); lg2.addColorStop(1, `rgba(${lc},0)`);
      c.fillStyle = lg2; c.fillRect(0, yy - 1, W, 2);
      c.restore();
      radial(c, W * 0.5, H * 0.48, Math.max(W, H) * 0.75, [[0.35, 'rgba(0,0,0,0)'], [1, 'rgba(4,4,10,0.75)']], 'source-over');
    }
    function drawLive(t) {
      const i = cutAt(E_CUTS, t), t0 = E_CUTS[i], a = clamp((t - t0) / 0.06);
      if (a < 1 && i > 0) { offBegin(); drawLiveShot(og, LIVE[i - 1], t - E_CUTS[i - 1], i - 1); offPut(); }
      offBegin(); drawLiveShot(og, LIVE[i], t - t0, i); offPut('source-over', a);
      // 名前のタイプ文字（大きく・薄く・横に流れる）
      const sz = Math.min(W * 0.16, H * 0.2);
      g.save();
      g.globalCompositeOperation = 'screen';
      g.font = TYPE(sz); g.textBaseline = 'middle'; g.fillStyle = '#ffffff';
      const lt = t - t0, nm = LIVE[i][4];
      g.globalAlpha = 0.3 * a;
      g.fillText(nm, W * (i % 2 ? 0.02 : 0.12) - W * 0.25 * lt, H * (i % 2 ? 0.7 : 0.3));
      g.font = TYPE(sz * 0.3); g.globalAlpha = 0.4 * a;
      g.fillText('NEW YORK KNICKS', W * (i % 2 ? 0.06 : 0.16) - W * 0.12 * lt, H * (i % 2 ? 0.7 : 0.3) + sz * 0.62);
      g.restore();
    }

    // ⑤ 炎・光の筋
    function drawFire(t) {
      const k = t < G0 + 0.135 ? 0 : 1, lt = t - (G0 + k * 0.135), sh = FIRE[k];
      offBegin();
      zoomShot(og, img(sh[0]), foc(sh[0], sh[1]), sh[2] * (1 + 0.5 * lt), 0.06, 4);
      og.save(); og.globalCompositeOperation = 'color'; og.globalAlpha = 0.6; og.fillStyle = ORANGE; og.fillRect(0, 0, W, H); og.restore();
      for (let j = 0; j < 8; j++) {
        const [a, b, c] = GLOW[j + k * 8];
        radial(og, W * a, H * (1.1 - b * 0.9 - 1.5 * lt), Math.max(W, H) * (0.2 + 0.35 * c),
          [[0, 'rgba(255,246,200,0.85)'], [0.4, 'rgba(255,150,40,0.45)'], [1, 'rgba(245,90,10,0)']], 'screen');
      }
      offPut('source-over', clamp((t - G0) / 0.04));
    }
    function drawStreak(t) {
      const p = clamp((t - H0) / (H1 - H0)), inA = clamp((t - H0) / 0.05);
      g.save(); g.globalAlpha = inA; g.fillStyle = '#050302'; g.fillRect(0, 0, W, H); g.restore();
      offBegin();
      zoomShot(og, img('msg68'), foc('msg68', 'court'), 1.3 + 0.8 * p, 0.12, 4);
      og.save(); og.globalCompositeOperation = 'color'; og.globalAlpha = 0.8; og.fillStyle = '#e8a02a'; og.fillRect(0, 0, W, H); og.restore();
      offPut('source-over', 0.32 * inA);
      const cx = W * 0.5, cy = H * 1.1, D = Math.hypot(W, H);
      g.save();
      g.globalCompositeOperation = 'lighter';
      for (const [ra, rr, rs, rl, rc, rw] of STREAK) {
        const ang = -Math.PI / 2 + (ra - 0.5) * 2.5;
        const r0 = (((rr + p * (0.9 + rs)) % 1.15) - 0.1) * D * 0.95;
        const len = (0.12 + 0.45 * rl) * D * (0.5 + p);
        const col = rc < 0.1 ? '120,170,255' : rc < 0.6 ? '255,206,110' : '245,132,38';
        const x0 = cx + Math.cos(ang) * r0, y0 = cy + Math.sin(ang) * r0;
        const x1 = cx + Math.cos(ang) * (r0 + len), y1 = cy + Math.sin(ang) * (r0 + len);
        const gr = g.createLinearGradient(x0, y0, x1, y1);
        gr.addColorStop(0, `rgba(${col},0)`); gr.addColorStop(0.6, `rgba(${col},${0.25 + 0.4 * rw})`); gr.addColorStop(1, `rgba(${col},0)`);
        g.strokeStyle = gr; g.globalAlpha = inA; g.lineWidth = 1 + 6 * rw * rw;
        g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
      }
      g.restore();
      radial(g, W * 0.5, H * 0.95, Math.max(W, H) * 0.6, [[0, 'rgba(255,214,140,0.55)'], [0.5, 'rgba(245,132,38,0.2)'], [1, 'rgba(245,132,38,0)']], 'screen', inA);
    }

    // ⑥ 立体ロゴ
    function proj(C, X, Y, Z) {
      const Xr = X * C.cyw - Z * C.syw, Zr = X * C.syw + Z * C.cyw;
      const Yr = Y * C.cp + Zr * C.sp, Zf = C.dist + Zr * C.cp - Y * C.sp;
      return [C.F * Xr / Zf, C.F * Yr / Zf, Zf];
    }
    // 板1枚（z の深さ）を縦の短冊×横の帯に分けて透視で貼る
    function drawLayer(c, im, z, C, S, Rn, uMax, aFn) {
      const hU = LG.PH, CH = LG.CH;
      for (let s = 0; s < S; s++) {
        const u0 = uMax * s / S, u1 = uMax * (s + 1) / S, um = (u0 + u1) / 2;
        const al = aFn ? aFn(um) : 1;
        if (al <= 0.003) continue;
        c.globalAlpha = al;
        for (let r = 0; r < Rn; r++) {
          const v0 = hU * r / Rn, v1 = hU * (r + 1) / Rn, vm = (v0 + v1) / 2;
          const a = proj(C, u0 - C.ox, vm - C.oy, z), b = proj(C, u1 - C.ox, vm - C.oy, z);
          const tp = proj(C, um - C.ox, v0 - C.oy, z), bt = proj(C, um - C.ox, v1 - C.oy, z);
          if (a[2] < 0.05 || b[2] < 0.05 || tp[2] < 0.05 || bt[2] < 0.05) continue;
          const dw = b[0] - a[0], dh = bt[1] - tp[1];
          if (dw < 0.05 || dh < 0.05) continue;
          c.drawImage(im, u0 * CH, v0 * CH, (u1 - u0) * CH, (v1 - v0) * CH, a[0], tp[1], dw + 0.7, dh + (Rn > 1 ? 0.7 : 0));
        }
      }
      c.globalAlpha = 1;
    }
    function updateHole(t, solid) {
      const hx = LG.hole.getContext('2d'), CH = LG.CH, SH = LG.PH * CH;
      hx.setTransform(1, 0, 0, 1, 0, 0);
      hx.globalCompositeOperation = 'source-over'; hx.globalAlpha = 1;
      const ph = holePhase(t);
      if (solid < 1) {
        LG.bands.forEach(([a, b], i) => {
          const k = Math.floor(ph + i * 0.43), sh = HOLE[(k * 5 + i * 3) % HOLE.length];
          const bx = a * CH, bw = (b - a) * CH;
          hx.save(); hx.beginPath(); hx.rect(bx, 0, bw, SH); hx.clip();
          coverRect(hx, img(sh[0]), foc(sh[0], sh[1]), sh[2], bx, 0, bw, SH);
          hx.globalCompositeOperation = 'color'; hx.globalAlpha = 0.32 + 0.5 * solid;
          hx.fillStyle = TONE[solid > 0.3 ? 'orange' : HOLE_TONE[i]]; hx.fillRect(bx, 0, bw, SH);
          hx.restore();
        });
      }
      if (solid > 0) {
        const gr = hx.createLinearGradient(0, 0, 0, SH);
        gr.addColorStop(0, '#ff9a3c'); gr.addColorStop(0.5, '#f36f1e'); gr.addColorStop(1, '#d4520c');
        hx.globalAlpha = solid; hx.fillStyle = gr; hx.fillRect(0, 0, LG.PW * CH, SH); hx.globalAlpha = 1;
      }
    }
    function drawLogo(t) {
      const inA = clamp((t - L0) / 0.12);
      const [dist, yawD, pitD, rollD, oxr, oyr] = camAt(t);
      const yaw = yawD * D2R, pit = pitD * D2R;
      const C = { F: LG.F, dist, cyw: Math.cos(yaw), syw: Math.sin(yaw), cp: Math.cos(pit), sp: Math.sin(pit), ox: oxr * LG.LW, oy: oyr * LG.PH };
      const solid = easeInOut(prog(t, 5.55, 6.05));
      const bgA = easeInOut(prog(t, 5.1, 6.0));
      // 背景: 黒 → オレンジのビネット（中央やや上が明るい）
      g.save(); g.globalAlpha = inA; g.fillStyle = '#040202'; g.fillRect(0, 0, W, H); g.restore();
      if (bgA > 0) {
        radial(g, W * 0.5, H * 0.44, Math.max(W, H) * 0.78,
          [[0, '#c4570f'], [0.42, '#7a2a07'], [0.82, '#260b03'], [1, '#0b0302']], 'source-over', bgA * inA);
      }
      // ロゴの後ろの光（実物の24秒あたりの赤い発光 → オレンジ）
      const af = proj(C, (LG.PW + LG.gap + LG.LW) / 2 - C.ox, LG.PH / 2 - C.oy, 0.3);
      const glow = prog(t, 4.6, 5.1) * (1 - 0.6 * prog(t, 5.8, 6.4));
      updateHole(t, solid);
      // 分割数（斜めほど細かく）
      const sY = Math.abs(C.syw), near = Math.sqrt(3 / dist);
      const S = Math.round(clamp(6 + 70 * sY * near, 6, 110));
      const top = proj(C, LG.LW / 2 - C.ox, -C.oy, 0)[2], bot = proj(C, LG.LW / 2 - C.ox, LG.PH - C.oy, 0)[2];
      const Rn = Math.round(clamp(Math.abs(top / bot - 1) * 10, 1, 5));
      const thick = LG.F * LG.T / dist * (sY + Math.abs(C.sp));
      const N = Math.round(clamp(thick / 1.4, 2, 34));
      const lit = 0.45 + 0.55 * prog(t, 4.4, 5.7);
      const hc = -0.3 + 1.6 * prog(t, 4.9, 6.3);
      const band = (u) => 0.75 * Math.exp(-Math.pow((u / LG.LW - hc) / 0.11, 2));

      lg.setTransform(dpr, 0, 0, dpr, 0, 0);
      lg.globalCompositeOperation = 'source-over'; lg.globalAlpha = 1;
      lg.clearRect(0, 0, W, H);
      lg.save();
      lg.translate(W / 2, H / 2); lg.rotate(rollD * D2R);
      if (glow > 0) {
        const gr = lg.createRadialGradient(af[0], af[1], 0, af[0], af[1], LG.F / dist * 3.2);
        gr.addColorStop(0, `rgba(255,150,60,${0.85 * glow})`); gr.addColorStop(0.35, `rgba(245,110,30,${0.35 * glow})`); gr.addColorStop(1, 'rgba(245,90,20,0)');
        lg.fillStyle = gr; lg.fillRect(-W, -H, W * 2, H * 2);
      }
      drawLayer(lg, LG.hole, LG.T, C, S, Rn, LG.PW);
      for (let k = N; k >= 1; k--) drawLayer(lg, LG.side, LG.T * k / (N + 1), C, S, Rn, LG.LW);
      drawLayer(lg, LG.faceLow, 0, C, S, Rn, LG.LW);
      drawLayer(lg, LG.face, 0, C, S, Rn, LG.LW, () => lit);
      if (hc > -0.25 && hc < 1.25) drawLayer(lg, LG.faceHi, 0, C, S, Rn, LG.LW, band);
      lg.restore();
      // カメラの動きのブラー（前進・引きの間だけ）
      const bl = 0.03 * (1 - prog(t, 4.2, 4.95));
      g.save();
      if (bl > 0.002) {
        const ca = Math.cos(rollD * D2R) * W * bl, sa = Math.sin(rollD * D2R) * W * bl;
        for (let i = 0; i < 4; i++) { const k = i / 3 - 0.5; g.globalAlpha = inA * (i === 0 ? 1 : 0.45); g.drawImage(loff, k * ca, k * sa, W, H); }
      } else { g.globalAlpha = inA; g.drawImage(loff, 0, 0, W, H); }
      g.restore();
    }

    function render(t) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      if (t >= B_CUTS[0] && t < D0 + 0.06) drawPrint(t);
      if (t >= D0 && t < E_CUTS[0] + 0.07) drawType(t);
      if (t >= E_CUTS[0] && t < G0 + 0.05) {
        if (t < E_CUTS[0] + 0.06) { g.save(); g.globalAlpha = clamp((t - E_CUTS[0]) / 0.06); g.fillStyle = '#000'; g.restore(); }
        drawLive(t);
      }
      // 白飛び
      const fl = clamp(1 - Math.abs(t - F_T) / 0.08);
      if (fl > 0) fillAll(g, '#fff8ee', 'screen', Math.pow(fl, 0.7));
      if (t >= G0 && t < H0 + 0.06) drawFire(t);
      if (t >= H0 && t < L0 + 0.13) drawStreak(t);
      if (t >= L0) drawLogo(t);
      // フィルム粒子と周辺減光
      g.save();
      g.globalCompositeOperation = 'overlay'; g.globalAlpha = 0.09;
      const R = rand(Math.floor(t * 24) + 1);
      g.translate(-R() * 192, -R() * 192); g.fillStyle = noisePat; g.fillRect(0, 0, W + 192, H + 192);
      g.restore();
      if (t < L0) radial(g, W * 0.5, H * 0.5, Math.max(W, H) * 0.75, [[0.45, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.5)']], 'source-over');
      // 最後に暗くして本文へ
      const out = easeIn(prog(t, 6.45, DUR));
      if (out > 0) fillAll(g, '#050505', 'source-over', out * 0.6);
    }

    resize();
    return { render, resize };
  },
});
