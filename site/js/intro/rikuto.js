/* リクト（Rikuto AF）のオープニング（2026-11-04）
   マーベルのオープニングを意識: 暗転にオレンジの光の線 → ニューヨーク／ニックスの歴史写真がダダダッと切り替わる
   → 巨大な「RIKUTO AF」の文字の中で写真が高速に切り替わりながら引いてくる → 文字がニックスのオレンジで確定
   写真: Wikimedia Commons（作者・ライセンスはページ下部のクレジットに記載）＋ STARTING 5IVE のリクト回
   Canvas 2D だけで描く（WebGL 不要）。演出は時刻 t の純関数 → ?introt=秒 で止めて確認できる */
import { runIntro, clamp, prog, easeOut, easeIn, easeInOut } from './core.js';

const DUR = 5.2;
const ORANGE = '#f58426';
const WORD = 'RIKUTO AF';
const BASE = '../../assets/s5/rikuto/intro/';
// 並び順＝見せる順（時代を行き来しながら最後は今のニックスとリクト本人へ）
const IMGS = ['msg1968.webp', 'reed.webp', 'frazier.webp', 'ewing88.webp', 'times.webp', 'melo.webp', 'lin.webp', 'msggame.webp',
  'brunson.webp', 'champ.webp', '../yt-8UQTzTzxt_A.webp', '../../member-rikuto.jpg'];

// カットの切替時刻（だんだん速くなる＝ダダダダダッ）
const FLIP_A = 0.45, FLIP_B = 2.4, TXT_A = 2.3;
function cuts(n) {
  const out = []; let t = FLIP_A, d = 0.24;
  while (t < FLIP_B) { out.push(t); t += d; d = Math.max(0.075, d * 0.8); }
  return out;
}
const CUTS = cuts();

function loadImg(src) {
  return new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; });
}

runIntro({
  key: 'rikuto',
  duration: DUR,
  gl: false,
  async setup(ctx) {
    const fontP = Promise.race([document.fonts.load('400 120px "Anton"', WORD), new Promise((r) => setTimeout(r, 1200))]).catch(() => {});
    const imgs = (await Promise.all(IMGS.map((f) => loadImg(BASE + f).catch(() => null)))).filter(Boolean);
    await fontP;
    if (imgs.length < 4) throw new Error('no images');

    const cv = ctx.canvas;
    const g = cv.getContext('2d');
    const off = document.createElement('canvas');
    const og = off.getContext('2d');
    let W = 0, H = 0, dpr = ctx.dpr, fontPx = 100, textY = 0;
    const FONT = (px) => `400 ${px}px "Anton", "Archivo Black", "Impact", sans-serif`;

    function resize() {
      W = ctx.W; H = ctx.H;
      cv.width = off.width = Math.round(W * dpr);
      cv.height = off.height = Math.round(H * dpr);
      // 文字の大きさ: 幅の 88%（縦長は 92%）・高さの 40% に収まる最大
      g.font = FONT(100);
      const w100 = g.measureText(WORD).width;
      fontPx = Math.min((W * (W / H < 0.8 ? 0.92 : 0.88)) / w100 * 100, H * 0.40 / 0.74);
      textY = H * 0.5;
    }

    // 画像を画面いっぱいに（cover）・s=拡大率・dy=縦のずれ（画面高さ比）
    function cover(c, im, s, dx, dy) {
      const r = Math.max(W / im.width, H / im.height) * s;
      const w = im.width * r, h = im.height * r;
      c.drawImage(im, (W - w) / 2 + dx * W, (H - h) / 2 + dy * H, w, h);
    }
    // オレンジの単色調（マーベルの赤の代わり）
    function tint(c, a) {
      c.save(); c.globalCompositeOperation = 'color'; c.globalAlpha = a; c.fillStyle = ORANGE; c.fillRect(0, 0, W, H); c.restore();
    }
    function cutIndex(t) { let i = 0; while (i + 1 < CUTS.length && CUTS[i + 1] <= t) i++; return i; }

    function drawFlip(c, t) {
      const i = cutIndex(t);
      const t0 = CUTS[i], t1 = CUTS[i + 1] ?? FLIP_B + 0.2;
      const lt = (t - t0) / (t1 - t0);
      const im = imgs[i % imgs.length], prev = imgs[(i + imgs.length - 1) % imgs.length];
      // 下から一気に差し替わる（めくり）＋前の写真が上へ抜ける
      const sw = easeOut(clamp((t - t0) / 0.07));
      if (i > 0 && sw < 1) { cover(c, prev, 1.06, 0, -sw * 0.9); if (i % 2 === 0) tint(c, 0.85); }
      c.save();
      if (i > 0) { c.beginPath(); c.rect(0, H * (1 - sw), W, H * sw + 1); c.clip(); }
      cover(c, im, 1.16 - 0.1 * lt, (i % 3 - 1) * 0.015 * lt, (1 - sw) * 0.35);
      if (i % 2 === 1) tint(c, 0.85);
      c.restore();
      // 切替の瞬間に白く光る
      const fl = 1 - clamp((t - t0) / 0.06);
      if (i > 0 && fl > 0) { c.fillStyle = `rgba(255,240,225,${0.22 * fl})`; c.fillRect(0, 0, W, H); }
    }

    function render(t) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      g.fillStyle = '#050505'; g.fillRect(0, 0, W, H);

      // ① 光の線（0〜0.55）
      if (t < 0.6) {
        const a = prog(t, 0.05, 0.3), b = 1 - prog(t, 0.42, 0.58);
        const len = W * 0.42 * easeOut(a);
        const grd = g.createLinearGradient(W / 2 - len, 0, W / 2 + len, 0);
        grd.addColorStop(0, 'rgba(245,132,38,0)'); grd.addColorStop(0.5, `rgba(255,214,170,${b})`); grd.addColorStop(1, 'rgba(245,132,38,0)');
        g.fillStyle = grd; g.fillRect(W / 2 - len, H / 2 - 1, len * 2, 2);
        const rg = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(8, 70 * a));
        rg.addColorStop(0, `rgba(255,230,200,${0.9 * b})`); rg.addColorStop(0.3, `rgba(245,132,38,${0.45 * b})`); rg.addColorStop(1, 'rgba(245,132,38,0)');
        g.fillStyle = rg; g.fillRect(0, 0, W, H);
      }

      // ② 写真のめくり（0.45〜2.4）
      if (t >= FLIP_A && t < TXT_A + 0.15) {
        g.save();
        g.globalAlpha = clamp(prog(t, FLIP_A, FLIP_A + 0.05)) * (1 - prog(t, TXT_A, TXT_A + 0.15));
        drawFlip(g, t);
        g.restore();
      }

      // ③ 文字の中で写真が切り替わる（2.3〜）
      if (t >= TXT_A) {
        const k = easeOut(prog(t, TXT_A, 3.55));
        const s = 1.9 - 0.9 * k;                       // 大きく寄った所から引いてくる
        const solid = easeInOut(prog(t, 3.5, 3.85));   // オレンジで確定
        const px = fontPx * s;
        // 文字の形に写真を抜く
        og.setTransform(dpr, 0, 0, dpr, 0, 0);
        og.globalCompositeOperation = 'source-over';
        og.clearRect(0, 0, W, H);
        const j = Math.floor((t - TXT_A) / 0.085);
        cover(og, imgs[(j * 3 + 1) % imgs.length], 1.05, 0, 0);
        og.save(); og.globalCompositeOperation = 'color'; og.globalAlpha = 0.35; og.fillStyle = ORANGE; og.fillRect(0, 0, W, H); og.restore();
        og.fillStyle = `rgba(245,132,38,${solid})`; og.fillRect(0, 0, W, H);
        og.globalCompositeOperation = 'destination-in';
        og.font = FONT(px); og.textAlign = 'center'; og.textBaseline = 'middle';
        og.fillStyle = '#000'; og.fillText(WORD, W / 2, textY);
        // 文字の後ろ: うっすら写真（暗く）
        g.save();
        g.globalAlpha = 0.16 * (1 - solid);
        cover(g, imgs[(j * 3 + 2) % imgs.length], 1.1, 0, 0);
        g.restore();
        g.save();
        g.shadowColor = `rgba(245,132,38,${0.35 + 0.35 * solid})`; g.shadowBlur = 40 * solid;
        g.drawImage(off, 0, 0, W, H);
        g.restore();
        // 縁取り
        g.save();
        g.font = FONT(px); g.textAlign = 'center'; g.textBaseline = 'middle';
        g.lineWidth = Math.max(1.5, px * 0.012); g.strokeStyle = `rgba(255,170,100,${0.85 * (1 - solid)})`;
        g.strokeText(WORD, W / 2, textY);
        g.restore();
        // フラッシュ
        const fl = clamp(1 - Math.abs(t - 3.55) / 0.12);
        if (fl > 0) { g.fillStyle = `rgba(255,236,214,${0.55 * fl})`; g.fillRect(0, 0, W, H); }
        // サブタイトル
        const sa = easeOut(prog(t, 3.8, 4.3));
        if (sa > 0) {
          const sp = Math.max(11, Math.min(W * 0.017, H * 0.024));
          g.save();
          g.globalAlpha = sa;
          g.font = `400 ${sp}px "Archivo Black", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'top';
          g.fillStyle = '#fff';
          if ('letterSpacing' in g) g.letterSpacing = `${sp * 0.34}px`;
          g.fillText('BORN & RAISED IN NEW YORK', W / 2 + sp * 0.17, textY + fontPx * 0.46 + 10 * (1 - sa));
          g.restore();
        }
      }
      // 最後に暗くして本文へ
      const out = easeIn(prog(t, 4.75, DUR));
      if (out > 0) { g.fillStyle = `rgba(5,5,5,${out * 0.6})`; g.fillRect(0, 0, W, H); }
    }

    resize();
    return { render, resize };
  },
});
