/* バンバ個人ページのオープニング（2026-11-04 / 2026-11-05 クリス指示で作り直し）
   本物の8パネル溝のバスケットボール（文字なし・床に落ち影）が回る（背景は拍ごとに色替え）
   → 止まってジグソーパズルの継ぎ目が光る → パズルのピースになって剥がれ飛ぶ → バスケは酸素
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる */
import { runIntro, prog, easeOut, easeIn, easeInOut, rand } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const T_STOP = 2.5;   // 回転が止まる
const T_OPEN = 2.55;  // パズルの継ぎ目が開き始める
const T_BREAK = 3.1;  // ピースが剥がれ飛ぶ
/* 2026-11-05 クリス指示: ボールが割れて中から「バスケは酸素」が出る → トップの同じ文言の位置へ移動して重なる／
   「バンバ」もヒーローの名前の位置・大きさへ → 重なった瞬間にサイトがパーンと開く */
const T_EMERGE = T_BREAK;      // 割れた中心（光るコア）から文字が生まれる
const EMERGE_D = 0.62;         // 生まれて原寸になるまで
const T_FLY = 4.15;   // 前面の文字が本文の見出しの位置へ移動し始める
const T_LAND = 4.85;  // 全部の文字が本文の見出しにぴたりと重なる瞬間 = サイトがパーンと開く
const T_ROLE = T_LAND + 0.2; // 開いた直後に肩書きがタタタッとはまる
const OPEN_D = 0.42;  // 開ききるまで
const FLY_ORDER = [0, 0.03, 0.06, 0.09, 0.12, 0.15, 0.08, 0.04, 0.12]; // 動き出しのずれ（着地は全部 T_LAND で同時）
const DUR = T_ROLE + 0.08 * 2 + 0.16 + 0.2;
/* 回転: 指の上で回すスピン。一定の速さで回り、最後の0.9秒で摩擦のように減速して止まる。
   2026-11-05 クリス指示「ボールの回転が遅すぎる」で 11 rad/s（約1.75回転/秒）→ 約2.5倍（約4.4回転/秒）。
   総回転量をちょうど5回転ぶん増やしたので、止まった時のボールの向き（割れる瞬間の見え方）は前と同じ */
const W0 = 11 + 10 * Math.PI / (T_STOP - 0.9 + 0.9 / 3), T_DEC = T_STOP - 0.9;
function spinAngle(t) {
  if (t <= T_DEC) return W0 * t + 0.4;
  const u = Math.min(1, (t - T_DEC) / (T_STOP - T_DEC));
  return W0 * T_DEC + W0 * (T_STOP - T_DEC) * (1 - Math.pow(1 - u, 3)) / 3 + 0.4;
}
const TEAL = 0x0064b1; // 2026-11-05 クリス指示77本目: マブス（ロイヤルブルー系）
/* 2026-11-05 クリス指示77本目: 拍ごとの背景色はダラス・マーベリックスのチームカラー（ボールのオレンジ以外）。拍数・速さは前と同じ7色の輪 */
/* 2026-11-05 クリス指示85本目: マブスの緑も入れる（2拍目。紺は6拍目に残す） */
const BEATS = ['#00538C', '#00843D', '#B8C4CA', '#000000', '#0064B1', '#002B5E', '#00538C'];
const BEAT = 0.36;
const GRID = 3;       // 立方体の1面を 3×3 のピースに（6面で54ピース）
const TEX = 640;      // 1面ぶんのテクスチャの画素数
/* 効果音: この演出の時刻に合わせて一から合成した1本（2026-11-05 クリス指示「相性のいいものを作れるんだったら作ってほしい」）。
   拍0.36秒ごとのキック（背景の色替えと同時）／回転の速さに合わせた風切り（減速で周期も音程も下がる）／2.5秒で止まる「トン」／
   継ぎ目が光る間のうなり／3.1秒の割れて剥がれ飛ぶ音（54ピースの破片音つき）／中から文字が生まれるきらめき／
   見出しへ移動する風切り → T_LAND（4.85秒）重なった瞬間の「パーン」（ドン＋破裂音＋和音）。
   作り方: scratchpad/p_bamba7/gen_sfx.py（時刻定数はこのファイルと同じ値）（numpy＋ffmpeg・外部素材なし）。前の sfx-intro.mp3 は使っていない */
const SFX = new URL('../../assets/s5/bamba/sfx-spin.mp3', import.meta.url).href;

runIntro({ key: 'bamba', duration: DUR, gl: true, setup });

/* 立方体の6面（n=面の向き、a/b=面内の座標軸。a×b=n） */
const FACES = [
  [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
  [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[0, 1, 0], [1, 0, 0], [0, 0, -1]],
  [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
  [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
  [[0, 0, -1], [-1, 0, 0], [0, 1, 0]],
];
function faceDir(f, s, t, out) {
  const [n, a, b] = FACES[f];
  const x = n[0] + s * a[0] + t * b[0], y = n[1] + s * a[1] + t * b[1], z = n[2] + s * a[2] + t * b[2];
  const l = Math.hypot(x, y, z);
  out[0] = x / l; out[1] = y / l; out[2] = z / l;
  return out;
}

/* 実物の8パネルの溝（Wilson NBA公式球 WTB7500 の正面写真を画素で測って合わせた 2026-11-05）:
   赤道(y=0)＋縦の大円(x=0)の2本が直交し、その交点(0,0,±1)を正面に見ると
   左右の曲線が「)｜(」の形で十字に寄り（赤道で |x|≈0.27）、上下へ行くほど外へ開いて
   球の縁（|y|≈0.72）で閉じる。曲線は ±x を囲む閉じた輪: |x| = SC0 + SCK·y²
   方向 d から一番近い溝までの角距離（ラジアン）を返す */
const SC0 = 0.27, SCK = 0.85;
function seamDist(x, y, z) {
  let d = Math.min(Math.abs(Math.asin(y)), Math.abs(Math.asin(x)));
  const ax = Math.abs(x), f = ax - (SC0 + SCK * y * y);
  const gx = 1, gy = -2 * SCK * y; // ∇f（x>0 側に揃えて評価）
  const gd = gx * ax + gy * y;
  const tx = gx - gd * ax, ty = gy - gd * y, tz = -gd * z; // 球面に沿う成分
  const gl = Math.hypot(tx, ty, tz) || 1;
  d = Math.min(d, Math.abs(f) / gl);
  return d;
}

/* 1面ぶんの色テクスチャと凹凸テクスチャ（オレンジ地＋細かいシボ＋黒い溝。文字は入れない） */
function hash(i, j, s) { let h = Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
// シボの粒（ワーリー）を小さな継ぎ目なしタイルで1回だけ作り、6面で使い回す（重い計算を1回に）
const TILE = 128, CELLS = 30;
let pebble = null;
function pebbleTile() {
  if (pebble) return pebble;
  pebble = new Float32Array(TILE * TILE);
  const cell = TILE / CELLS, wrap = (n) => ((n % CELLS) + CELLS) % CELLS;
  for (let j = 0; j < TILE; j++) for (let i = 0; i < TILE; i++) {
    const gx = i / cell, gy = j / cell, ix = Math.floor(gx), iy = Math.floor(gy);
    let m = 9, m2 = 9;
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      const cx = wrap(ix + ox), cy = wrap(iy + oy);
      const px = ix + ox + 0.05 + hash(cx, cy, 1) * 0.9, py = iy + oy + 0.05 + hash(cy, cx, 8) * 0.9;
      const dd = (gx - px) * (gx - px) + (gy - py) * (gy - py);
      if (dd < m) { m2 = m; m = dd; } else if (dd < m2) m2 = dd;
    }
    pebble[j * TILE + i] = Math.sqrt(Math.min(1, (Math.sqrt(m2) - Math.sqrt(m)) * 2.2)); // 粒の盛り上がり（境目で0）
  }
  return pebble;
}
function faceTextures(THREE, f) {
  const W = TEX, half = 0.023, soft = 0.006, pb = pebbleTile(), off = f * 37;
  const cc = document.createElement('canvas'), bc = document.createElement('canvas');
  cc.width = cc.height = bc.width = bc.height = W;
  const cx = cc.getContext('2d'), bx = bc.getContext('2d');
  const ci = cx.createImageData(W, W), bi = bx.createImageData(W, W);
  const C = ci.data, B = bi.data, d = [0, 0, 0];
  for (let j = 0; j < W; j++) {
    for (let i = 0; i < W; i++) {
      faceDir(f, (i + 0.5) / W * 2 - 1, 1 - (j + 0.5) / W * 2, d);
      const bump = pb[((j + off) % TILE) * TILE + ((i + off) % TILE)];
      const sd = seamDist(d[0], d[1], d[2]);
      const sm = sd < half ? 1 : sd < half + soft ? 1 - (sd - half) / soft : 0;   // 溝(黒)
      const groove = sd < half + 0.014 ? Math.min(1, (half + 0.014 - sd) / 0.014) : 0; // 溝の凹み
      const tone = 0.86 + 0.14 * bump + (hash(i >> 5, j >> 5, f + 3) - 0.5) * 0.05;
      const k = (j * W + i) * 4;
      // 革の色は実物写真の中間調（茶色寄りのオレンジ）、溝は黒いゴム
      C[k] = (204 * tone) * (1 - sm) + 20 * sm;
      C[k + 1] = (100 * tone) * (1 - sm) + 17 * sm;
      C[k + 2] = (52 * tone) * (1 - sm) + 15 * sm;
      C[k + 3] = 255;
      const h = (150 + 90 * bump) * (1 - groove * 0.85);
      B[k] = B[k + 1] = B[k + 2] = h; B[k + 3] = 255;
    }
  }
  cx.putImageData(ci, 0, 0); bx.putImageData(bi, 0, 0);
  const map = new THREE.CanvasTexture(cc); map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 8;
  const bmp = new THREE.CanvasTexture(bc); bmp.anisotropy = 8;
  map.wrapS = map.wrapT = bmp.wrapS = bmp.wrapT = THREE.ClampToEdgeWrapping;
  return { map, bmp };
}

/* ジグソーの辺（A→B）。sign で凸凹の向き、j で形のゆらぎ。始点を含む点列を返す */
function cubic(p0, p1, p2, p3, n, out) {
  for (let k = 1; k <= n; k++) {
    const t = k / n, u = 1 - t;
    out.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]);
  }
}
const SEG = 10;
function tabEdge(A, B, sign, j) {
  const L = [B[0] - A[0], B[1] - A[1]], Wv = [-L[1] * sign, L[0] * sign];
  const P = (l, w) => [A[0] + L[0] * l + Wv[0] * w, A[1] + L[1] * l + Wv[1] * w];
  const t = 0.1, [a, b, c, d, e] = j;
  const out = [A.slice()];
  cubic(P(0, 0), P(0.2, a), P(0.5 + b + d, -t + c), P(0.5 - t + b, t + c), SEG, out);
  cubic(P(0.5 - t + b, t + c), P(0.5 - 2 * t + b - d, 3 * t + c), P(0.5 + 2 * t + b - d, 3 * t + c), P(0.5 + t + b, t + c), SEG, out);
  cubic(P(0.5 + t + b, t + c), P(0.5 + b + e, -t + c), P(0.8, e), P(1, 0), SEG, out);
  return out;
}
function straightEdge(A, B) {
  const out = [], n = SEG * 3;
  for (let k = 0; k <= n; k++) out.push([A[0] + (B[0] - A[0]) * k / n, A[1] + (B[1] - A[1]) * k / n]);
  return out;
}

/* 多角形を三角形に分け、球に沿うよう長い辺を細かく割る */
function triangulate(THREE, contour) {
  const v = contour.map((p) => p.slice());
  let tris = THREE.ShapeUtils.triangulateShape(contour.map((p) => new THREE.Vector2(p[0], p[1])), []);
  tris = tris.map(([a, b, c]) => {
    const cr = (v[b][0] - v[a][0]) * (v[c][1] - v[a][1]) - (v[b][1] - v[a][1]) * (v[c][0] - v[a][0]);
    return cr < 0 ? [a, c, b] : [a, b, c];
  });
  const MAX = 0.12, mid = new Map(), out = [];
  const len = (a, b) => Math.hypot(v[a][0] - v[b][0], v[a][1] - v[b][1]);
  const midOf = (a, b) => {
    const key = a < b ? a + '_' + b : b + '_' + a;
    if (!mid.has(key)) { v.push([(v[a][0] + v[b][0]) / 2, (v[a][1] + v[b][1]) / 2]); mid.set(key, v.length - 1); }
    return mid.get(key);
  };
  const stack = tris.slice();
  while (stack.length) {
    const [a, b, c] = stack.pop();
    const lab = len(a, b), lbc = len(b, c), lca = len(c, a), mx = Math.max(lab, lbc, lca);
    if (mx <= MAX) { out.push([a, b, c]); continue; }
    if (mx === lab) { const m = midOf(a, b); stack.push([a, m, c], [m, b, c]); }
    else if (mx === lbc) { const m = midOf(b, c); stack.push([a, b, m], [a, m, c]); }
    else { const m = midOf(c, a); stack.push([a, b, m], [m, b, c]); }
  }
  return { v, tris: out };
}

async function setup(ctx) {
  const THREE = ctx.THREE;
  const { renderer, el, lay } = ctx;

  /* 前面の文字・フラッシュ（背景の大きな文字は出さない） */
  const WORD = 'バスケは酸素';
  // 名前は大きく: チャンネル名 → バンバ／スポーツMC（このあと本文の見出しの位置へ1つずつはまる）
  lay.innerHTML = '<div class="bm-flash"></div><div class="bm-title"><b>' + [...WORD].map((ch) => '<i>' + ch + '</i>').join('') + '</b>'
    + '<span class="bm-ch">BALLIN&#x27; WITH BAMBA</span>'
    + '<span class="bm-nm"><span class="bm-ja">バンバ</span><span class="bm-sl">／</span><span class="bm-role">スポーツMC</span></span></div>';
  // 極太の書体（Zen Kaku Gothic New 900）を待つ。遅くても 1.2 秒で先へ
  const fontWait = Promise.race([document.fonts.load('900 80px "Zen Kaku Gothic New"', WORD), new Promise((r) => setTimeout(r, 1200))]).catch(() => {});
  const flash = lay.querySelector('.bm-flash');
  const title = lay.querySelector('.bm-title');
  const chars = [...title.querySelectorAll('i')];
  const style = document.createElement('style');
  style.textContent = `
    .bm-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#fff 0,#e6eef5 30%,rgba(0,100,177,.0) 75%);opacity:0}
    .bm-title{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
    .bm-title b{display:block;font-family:"Zen Kaku Gothic New","Noto Sans JP",sans-serif;font-weight:900;font-size:min(13.5vw,19vh);line-height:1;letter-spacing:.02em;color:#fff;white-space:nowrap;-webkit-text-stroke:.012em #fff;text-shadow:0 .05em 0 #002B5E,0 .09em .18em rgba(0,0,0,.45),0 0 .5em rgba(0,100,177,.55)}
    .bm-title i{display:inline-block;font-style:normal;opacity:0}
    .bm-title .bm-ch,.bm-title .bm-nm{display:block;opacity:0;white-space:nowrap;line-height:1}
    .bm-title .bm-ch{margin-top:.55em;font-family:"Archivo Black",sans-serif;font-size:min(4.6vw,6.4vh);letter-spacing:.14em;color:#fff;text-shadow:0 0 .5em rgba(0,100,177,.7)}
    .bm-title .bm-nm{margin-top:.45em;font-family:"Zen Kaku Gothic New","Noto Sans JP",sans-serif;font-weight:900;font-size:min(6.6vw,8.6vh);color:#B8C4CA}
    .bm-title .bm-nm>span{display:inline-block}
    .bm-title .bm-ja{color:#fff;letter-spacing:.01em}
    .bm-title .bm-sl{margin:0 .25em;color:rgba(255,255,255,.55)}
    .bm-title .bm-role{color:#B8C4CA}`;
  el.appendChild(style);
  /* 2026-11-05 クリス指示53: 文字は割れたボールの「中から」出る。カメラから見てボールの中心より手前にある殻の破片だけを
     この前面キャンバスに描き、文字（.bm-title）の上に重ねる。本体のキャンバスには奥の破片・コア・影だけを描く
     → 文字は手前の破片の奥（殻の内側）にあって、割れ目の隙間から見えてせり出してくる */
  const front = document.createElement('canvas');
  front.className = 'bm-front';
  front.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
  lay.appendChild(front);
  const fctx = front.getContext('2d');
  let frontDirty = false;
  const canvasEl = el.querySelector('canvas'), vig = el.querySelector('.vig'), grain = el.querySelector('.grain'), hint = el.querySelector('.hint');
  const ch2 = title.querySelector('.bm-ch'), nm = title.querySelector('.bm-nm'), sl = title.querySelector('.bm-sl');

  /* 本文側の着地点（ヒーローの見出し）。演出中だけ隠し、文字がはまった瞬間に入れ替える */
  const root = document.documentElement;
  const oxy = [...document.querySelectorAll('.bb-oxygen > span')];
  const tName = document.querySelector('.bb-name .ja'), tEn = document.querySelector('.bb-name .en'), tRole = document.querySelector('.bb-roles b');
  const reals = [...oxy, tName, tEn, tRole].filter(Boolean);
  const hero = document.querySelector('.bb-hero');
  /* 効果音（回る音 → 割れて弾ける音 → 「バスケは酸素」の締めの音 → 文字がはまるポン）。
     1本にまとめた音を、演出の時刻に合わせて途中からでも鳴らす。音量は控えめ・隅の小さなボタンで消せる（選んだ状態は次回も覚える）。
     ブラウザは「人が何か操作するまで音を出させない」ので、最初のクリック・タップ・キー操作の瞬間に鳴らし始める。
     その操作がスキップ（画面タップ）だった時も、割れて弾ける音から締めの音までは鳴らす（無音で終わらせない）。 */
  const snd = { ctx: null, buf: null, src: null, lastT: 0, on: true, tail: false };
  try { snd.on = localStorage.getItem('s5Sound') !== 'off'; } catch (e) { /* noop */ }
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'bm-snd';
  btn.innerHTML = '<i></i><i></i><i></i><i></i>';
  el.appendChild(btn);
  const sndStyle = document.createElement('style');
  sndStyle.textContent = `
    .bm-snd{position:absolute;left:18px;bottom:14px;z-index:3;width:34px;height:34px;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(5,5,5,.28);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;gap:2.5px;cursor:pointer;opacity:.5;transition:opacity .25s,border-color .25s,background .25s;-webkit-tap-highlight-color:transparent}
    .bm-snd:hover,.bm-snd:focus-visible{opacity:.95;border-color:rgba(0,100,177,.85);background:rgba(5,5,5,.5);outline:none}
    .bm-snd i{display:block;width:2px;height:12px;border-radius:1px;background:#fff;transform-origin:50% 50%;transform:scaleY(.25);transition:transform .3s,background .3s}
    .bm-snd.wait i{transform:scaleY(.45)}
    .bm-snd.live i{background:#B8C4CA;animation:bmWave .9s ease-in-out infinite}
    .bm-snd.live i:nth-child(2){animation-delay:-.45s}.bm-snd.live i:nth-child(3){animation-delay:-.2s}.bm-snd.live i:nth-child(4){animation-delay:-.65s}
    .bm-snd.off i{transform:scaleY(.17);background:rgba(255,255,255,.7)}
    @keyframes bmWave{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
    @media (max-width:600px){.bm-snd{left:14px;bottom:12px}}`;
  el.appendChild(sndStyle);
  const label = () => {
    const live = snd.on && snd.ctx && snd.ctx.state === 'running';
    btn.className = 'bm-snd ' + (!snd.on ? 'off' : live && snd.src ? 'live' : 'wait');
    btn.setAttribute('aria-label', snd.on ? '効果音を消す' : '効果音を出す');
    btn.setAttribute('aria-pressed', snd.on ? 'true' : 'false');
  };
  async function sndReady() {
    if (!snd.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      snd.ctx = new AC();
    }
    if (!snd.buf) snd.buf = await fetch(SFX).then((r) => r.arrayBuffer()).then((a) => snd.ctx.decodeAudioData(a));
    return true;
  }
  // 鳴らしてよい時だけ、演出の今の時刻（スキップ後は割れる瞬間）から鳴らす
  function sndStart() {
    if (!snd.on || !snd.buf || !snd.ctx || snd.ctx.state !== 'running' || snd.src) return;
    const playing = root.classList.contains('s5-intro-on');
    if (!playing && !snd.tail) return;
    if (playing && !snd.ticked) return; // 演出の1コマ目が描かれるまで待つ（音だけ先に走らない）
    if (snd.lastT >= snd.buf.duration - 0.2) return;
    const g = snd.ctx.createGain(); g.gain.value = 0.85; g.connect(snd.ctx.destination);
    const s = snd.ctx.createBufferSource(); s.buffer = snd.buf; s.connect(g);
    s.onended = () => { if (snd.src && snd.src.s === s) { snd.src = null; label(); } };
    s.start(0, Math.max(0, snd.lastT));
    snd.src = { s, g };
    if (!playing) snd.tail = false; // スキップ後の締めは1回だけ
    label();
  }
  function sndStop() {
    if (!snd.src) return;
    const { s, g } = snd.src;
    try { g.gain.setTargetAtTime(0, snd.ctx.currentTime, 0.08); s.stop(snd.ctx.currentTime + 0.45); } catch (e) { /* noop */ }
    snd.src = null;
  }
  /* 鳴らすきっかけ（ボタンは自分で切り替えるので除く）
     ① サイト内のリンクから来た時: ブラウザが「前のページで操作があった」と覚えているので、開いた瞬間に鳴る（下の sndReady→resume）
     ② URL直開き・再読み込み: 最初のクリック・タップ・キー（Esc も含む）で鳴る。
        スクロール（ホイール・トラックパッド・指で払う）でも鳴らしにいく。ただし Chrome はスクロールを「音を出してよい操作」と
        認めていないので、そのサイトで音を許可済み（Chrome のサイト設定「音声: 許可」・よく音を再生しているサイト）の時だけ鳴る */
  const UNLOCK = ['pointerdown', 'pointerup', 'mousedown', 'touchstart', 'touchend', 'keydown', 'keyup', 'click', 'wheel', 'touchmove', 'scroll'];
  function unlock(e) {
    if (e && e.target && btn.contains(e.target)) return;
    if (!snd.on) return;
    if (!snd.ctx) sndReady().catch(() => {});
    if (!snd.ctx) return;
    snd.ctx.resume().then(() => {
      if (snd.ctx.state !== 'running') return;
      UNLOCK.forEach((n) => removeEventListener(n, unlock, true));
      return sndReady().then(sndStart);
    }).catch(() => {});
  }
  if (ctx.freeze === null) UNLOCK.forEach((n) => addEventListener(n, unlock, { capture: true, passive: true }));
  // スマホで指を払った時: 演出中は画面がスクロールしない（overflow:hidden）ので、払う動きをブラウザのスクロールとして扱わせない。
  // こうすると指を離した瞬間が「操作」と認められて、払っただけでも音が鳴る（タップと違ってスキップはしない）
  if (ctx.freeze === null) el.style.touchAction = 'none';
  btn.addEventListener('click', async (e) => {
    e.stopPropagation(); // 押してもオープニングはスキップしない
    snd.on = !(snd.on && snd.ctx && snd.ctx.state === 'running'); // まだ鳴っていない時に押したら「鳴らす」
    try { localStorage.setItem('s5Sound', snd.on ? 'on' : 'off'); } catch (err) { /* noop */ }
    if (!snd.on) { sndStop(); label(); return; }
    try { if (await sndReady()) { await snd.ctx.resume(); sndStart(); } } catch (err) { /* 音が出せなくても演出は続ける */ }
    label();
  });
  label();
  if (ctx.freeze === null && snd.on) {
    // 自動再生が許されている環境ならそのまま鳴る。許されていなければ最初の操作（unlock）で鳴る
    sndReady().then(() => snd.ctx.resume()).then(() => { label(); sndStart(); }).catch(() => {});
  }

  const roleRest = [...document.querySelectorAll('.bb-roles > span')];
  const restore = () => [...reals, ...roleRest].forEach((r) => { r.style.opacity = ''; r.style.transform = ''; });
  if (root.classList.contains('s5-intro-on')) {
    [...reals, ...roleRest].forEach((r) => { r.style.opacity = '0'; });
    // スキップ・終了でオープニングが外れたら必ず元に戻す。
    // 音: 最後まで見た時はそのまま鳴り切らせる。スキップした時は、割れて弾ける音から締めまでを鳴らす
    new MutationObserver((_, ob) => {
      if (root.classList.contains('s5-intro-on')) return;
      ob.disconnect(); restore(); if (hero) hero.style.transform = '';
      if (snd.lastT >= DUR - 0.2) return;
      if (snd.src && snd.lastT >= T_BREAK - 0.1) return;
      sndStop();
      snd.lastT = T_BREAK - 0.05; snd.tail = true;
      sndStart(); // まだ音が許されていなければ、unlock が resume した直後にここから鳴る
      setTimeout(() => { snd.tail = false; UNLOCK.forEach((n) => removeEventListener(n, unlock, true)); }, 1500);
    }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }
  const textRange = (node, a, b) => { const r = document.createRange(); r.setStart(node, a); r.setEnd(node, b); return r; };
  const firstText = (e) => { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.data.trim()) return n; return null; };
  // 飛ぶ部品: 前面の文字（node）→ 本文の文字（tgt: Range を返す）。real は着地後に見せる本文側の要素
  const pieces = [];
  const oxyText = oxy.map(firstText);
  chars.forEach((c, i) => {
    const si = i < 4 ? 0 : 1, k = i < 4 ? i : i - 4;
    pieces.push({ node: c, tgt: () => oxyText[si] && textRange(oxyText[si], k, k + 1), real: oxy[si], last: i === 3 || i === 5, start: T_FLY + FLY_ORDER[i], land: T_LAND });
  });
  [[ch2, tEn], [title.querySelector('.bm-ja'), tName], [title.querySelector('.bm-role'), tRole]].forEach(([n, r], j) => {
    pieces.push({ node: n, tgt: () => r && firstText(r) && textRange(firstText(r), 0, firstText(r).data.length), real: r, last: true, start: T_FLY + FLY_ORDER[6 + j], land: j === 2 ? T_ROLE : T_LAND });
  });
  // 前面の文字側も「字面」の箱で測る（行の高さに左右されないように）
  const srcRect = (n) => { const tn = firstText(n); return tn ? textRange(tn, 0, tn.data.length).getBoundingClientRect() : n.getBoundingClientRect(); };
  let flyCache = null, emCache = null;
  const emNodes = [...chars, ch2, nm];
  const vOrg = new THREE.Vector3();
  const vC = new THREE.Vector3(), vF = new THREE.Vector3();
  function measureFly() {
    pieces.forEach((p) => { p.node.style.transform = ''; });
    flyCache = pieces.map((p) => {
      const s = srcRect(p.node), e = p.node.getBoundingClientRect(), tr = p.tgt();
      const g = tr && tr.getBoundingClientRect();
      if (!g || !g.height || g.bottom < 0 || g.top > innerHeight) return null; // 画面外なら飛ばさず消すだけ
      const k = g.height / s.height;
      const ex = e.left + e.width / 2, ey = e.top + e.height / 2;
      const sx = s.left + s.width / 2, sy = s.top + s.height / 2;
      return { k, dx: g.left + g.width / 2 - ex - k * (sx - ex), dy: g.top + g.height / 2 - ey - k * (sy - ey), gx: g.left + g.width / 2, gy: g.top + g.height / 2 };
    });
    // パーンと開く中心 = 「バスケは酸素」と「バンバ」が重なった所の真ん中
    const hit = flyCache.filter(Boolean);
    flyCache.cx = hit.length ? hit.reduce((a, c) => a + c.gx, 0) / hit.length : innerWidth / 2;
    flyCache.cy = hit.length ? hit.reduce((a, c) => a + c.gy, 0) / hit.length : innerHeight / 2;
  }

  /* シーン */
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(TEAL, 3.0); rim.position.set(4, -1, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffd7b0, 0.55); fill.position.set(4, 1, 3); scene.add(fill);
  const glow = new THREE.PointLight(TEAL, 0, 6, 1.5); scene.add(glow);

  const faceMats = FACES.map((_, f) => {
    const { map, bmp } = faceTextures(THREE, f);
    return new THREE.MeshStandardMaterial({ map, bumpMap: bmp, bumpScale: 2.2, roughness: 0.78, metalness: 0 });
  });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x2a170c, roughness: 0.92, metalness: 0, side: THREE.DoubleSide });
  const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(TEAL).multiplyScalar(2.2), toneMapped: false, transparent: true });

  /* 床の落ち影（ボールの真下・楕円） */
  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sg = sc.getContext('2d'), gr = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.92)'); gr.addColorStop(0.3, 'rgba(0,0,0,.7)'); gr.addColorStop(0.65, 'rgba(0,0,0,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  sg.fillStyle = gr; sg.fillRect(0, 0, 256, 256);
  const shadowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, toneMapped: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), shadowMat);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.12; shadow.renderOrder = -1;
  scene.add(shadow);

  const ball = new THREE.Group();
  ball.rotation.z = 0.1; // 指回しの軸はほぼ垂直（わずかに傾ける）
  scene.add(ball);
  const spin = new THREE.Group();
  ball.add(spin);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 24), coreMat);
  spin.add(core);

  /* 割れる前の継ぎ目のないボール（6面を球に沿わせた1枚ずつ。ピースの細い隙間が見えないように） */
  const whole = new THREE.Group();
  spin.add(whole);
  FACES.forEach((_, f) => {
    const pg = new THREE.PlaneGeometry(2, 2, 40, 40), pp = pg.attributes.position, pn = pg.attributes.normal, w = [0, 0, 0];
    for (let k = 0; k < pp.count; k++) {
      faceDir(f, pp.getX(k), pp.getY(k), w);
      pp.setXYZ(k, w[0], w[1], w[2]); pn.setXYZ(k, w[0], w[1], w[2]);
    }
    whole.add(new THREE.Mesh(pg, faceMats[f]));
  });
  /* 速い回転の残像（モーションブラー）: 約4.4回転/秒だと1コマで約26°進み、くっきりした溝が飛び飛びに見えてちらつく。
     「前のコマから今のコマまでの間」の向きの球を BLUR_N-1 個、少しずつ透かして重ね、溝を回転方向に流れる帯にする
     （回転の速さはそのまま）。球の中心まわりの回転なので輪郭は同じ。裏面は描かないので奥行きテストなしで重ねても破綻しない。
     n個目を 1/(n+1) の濃さで重ねると、全部が同じ重みの平均になる */
  const BLUR_N = 12; // 1枚ごとのずれ（約1.2°）を溝の幅（約2.6°）より小さくして、帯の中に縞が出ないように
  let spinAxisLocal = null; // ボールの中から見た回転軸（UP・qOrient は下で定義されるので最初のコマで求める）
  const blurCopies = [];
  for (let i = 1; i < BLUR_N; i++) {
    const g = new THREE.Group();
    whole.children.slice(0, FACES.length).forEach((m) => {
      const mat = m.material.clone();
      mat.transparent = true; mat.opacity = 1 / (i + 1); mat.depthTest = false; mat.depthWrite = false;
      const c = new THREE.Mesh(m.geometry, mat); c.renderOrder = i; g.add(c);
    });
    g.visible = false; whole.add(g); blurCopies.push(g);
  }
  let prevT = null;
  function motionBlur(t) {
    if (!spinAxisLocal) spinAxisLocal = UP.clone().applyQuaternion(qOrient.clone().invert());
    const dt = prevT === null || t <= prevT ? 1 / 60 : Math.min(1 / 30, t - prevT);
    prevT = t;
    const sweep = (spinAngle(t) - spinAngle(Math.max(0, t - dt))) * 0.5; // このコマで回った角度の半分（映画のカメラと同じ180°シャッター。溝が帯になりすぎず、縞にもならない）
    const on = t < T_OPEN && sweep > 0.02;
    blurCopies.forEach((g, k) => {
      g.visible = on;
      if (on) g.quaternion.setFromAxisAngle(spinAxisLocal, -sweep * (k + 1) / (BLUR_N - 1));
    });
  }

  /* ジグソーパズルのピースを作る（立方体の各面を GRID×GRID に割り、内側の辺に凸凹のタブ） */
  const R = rand(610);
  const jit = () => [0, 1, 2, 3, 4].map(() => (R() - 0.5) * 0.06);
  const frags = [];
  const d = [0, 0, 0];
  const IN = 0.93;
  for (let f = 0; f < 6; f++) {
    const xs = [...Array(GRID + 1)].map((_, i) => -1 + (2 * i) / GRID);
    // 内側の辺を先に決める（隣のピースと同じ形を共有する）
    const H = [], V = [];
    for (let i = 0; i < GRID; i++) { H[i] = []; for (let j = 1; j < GRID; j++) H[i][j] = tabEdge([xs[i], xs[j]], [xs[i + 1], xs[j]], R() < 0.5 ? 1 : -1, jit()); }
    for (let i = 1; i < GRID; i++) { V[i] = []; for (let j = 0; j < GRID; j++) V[i][j] = tabEdge([xs[i], xs[j]], [xs[i], xs[j + 1]], R() < 0.5 ? 1 : -1, jit()); }
    for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) {
      const x0 = xs[i], x1 = xs[i + 1], y0 = xs[j], y1 = xs[j + 1];
      const fwd = (e) => e.slice(1), rev = (e) => e.slice(0, -1).reverse();
      const contour = [
        ...(j === 0 ? fwd(straightEdge([x0, y0], [x1, y0])) : fwd(H[i][j])),
        ...(i === GRID - 1 ? fwd(straightEdge([x1, y0], [x1, y1])) : fwd(V[i + 1][j])),
        ...(j === GRID - 1 ? fwd(straightEdge([x1, y1], [x0, y1])) : rev(H[i][j + 1])),
        ...(i === 0 ? fwd(straightEdge([x0, y1], [x0, y0])) : rev(V[i][j])),
      ];
      const { v, tris } = triangulate(THREE, contour);
      const ctr = new THREE.Vector3(...faceDir(f, (x0 + x1) / 2, (y0 + y1) / 2, d)).multiplyScalar(0.97);
      // 表（ボールの皮）
      const op = new Float32Array(v.length * 3), on = new Float32Array(v.length * 3), ou = new Float32Array(v.length * 2);
      v.forEach((p, k) => {
        faceDir(f, p[0], p[1], d);
        op[k * 3] = d[0] - ctr.x; op[k * 3 + 1] = d[1] - ctr.y; op[k * 3 + 2] = d[2] - ctr.z;
        on[k * 3] = d[0]; on[k * 3 + 1] = d[1]; on[k * 3 + 2] = d[2];
        ou[k * 2] = (p[0] + 1) / 2; ou[k * 2 + 1] = (p[1] + 1) / 2;
      });
      const og = new THREE.BufferGeometry();
      og.setAttribute('position', new THREE.BufferAttribute(op, 3));
      og.setAttribute('normal', new THREE.BufferAttribute(on, 3));
      og.setAttribute('uv', new THREE.BufferAttribute(ou, 2));
      og.setIndex(tris.flat());
      // 裏（ゴム）と側面（ピースの厚み）
      const rp = [];
      const at = (p, r) => { faceDir(f, p[0], p[1], d); return [d[0] * r - ctr.x, d[1] * r - ctr.y, d[2] * r - ctr.z]; };
      for (const [a, b, c] of tris) rp.push(...at(v[a], IN), ...at(v[c], IN), ...at(v[b], IN));
      for (let k = 0; k < contour.length; k++) {
        const p = contour[k], q = contour[(k + 1) % contour.length];
        const po = at(p, 1), qo = at(q, 1), pi = at(p, IN), qi = at(q, IN);
        rp.push(...po, ...qi, ...qo, ...po, ...pi, ...qi);
      }
      const rg = new THREE.BufferGeometry();
      rg.setAttribute('position', new THREE.Float32BufferAttribute(rp, 3));
      rg.computeVertexNormals();
      const g = new THREE.Group();
      g.add(new THREE.Mesh(og, faceMats[f]), new THREE.Mesh(rg, rubberMat));
      g.position.copy(ctr);
      spin.add(g);
      const dir = ctr.clone().normalize();
      const axis = new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize();
      frags.push({ g, ctr, dir, axis, delay: R() * 0.22, speed: 2.0 + R() * 1.8, rot: (R() < 0.5 ? -1 : 1) * (2.2 + R() * 3) });
    }
  }
  await fontWait;

  let camZ = 7;
  function resize() {
    const a = innerWidth / innerHeight;
    camera.aspect = a;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // ボールを旧版（1.32）より大きく。縦は床の影まで収まる余白を残し、横（スマホ）は幅いっぱい近くまで
    camZ = Math.max(1.24 / half, 1.1 / (half * a));
    camera.updateProjectionMatrix();
  }
  resize();

  const UP = new THREE.Vector3(0, 1, 0);
  const qOrient = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.62, 0.35, 0.48, 'YXZ'));
  const q = new THREE.Quaternion(), tmp = new THREE.Vector3(), down = new THREE.Vector3(), inv = new THREE.Quaternion();
  function render(t) {
    snd.lastT = t; // 効果音の再生位置を演出の時刻に合わせるため
    if (!snd.ticked) { snd.ticked = true; sndStart(); } // 音が許されていれば、演出の始まりと同時に鳴らす
    /* 背景: 拍ごとに色が切り替わる（砕けた後は黒へ） */
    const beat = Math.floor(t / BEAT);
    const col = t < T_OPEN ? BEATS[beat % BEATS.length] : '#050505';
    el.style.background = `radial-gradient(120% 95% at 50% 45%, ${col} 0%, #050505 100%)`;

    /* ボール: 登場 → 減速しながら回転 → 停止 */
    const inP = easeOut(prog(t, 0, 0.6));
    ball.scale.setScalar(0.6 + 0.4 * inP);
    ball.position.y = (1 - inP) * 0.9 + Math.sin(t * 2.2) * 0.03;
    // 指の上で回すスピン: 軸はほぼ真上の1本に固定（首振りなし）。ボールは溝と無関係な向きに傾けて載せるので、
    // 赤道の溝の中を滑るようには見えず、全部の溝が球面に沿って同じ向きに流れる
    spin.quaternion.setFromAxisAngle(UP, spinAngle(t)).multiply(qOrient);
    motionBlur(t);

    /* パズルの継ぎ目が開く → ピースが剥がれ飛ぶ */
    const openP = easeInOut(prog(t, T_OPEN, T_BREAK));
    const tb = Math.max(0, t - T_BREAK);
    const shake = t > T_OPEN && t < T_BREAK ? Math.sin(t * 90) * 0.01 * openP : 0;
    ball.position.x = shake;
    // 影: ボールが高いほど薄く広がる。ピースが飛んだら消える
    const lift = Math.max(0, ball.position.y);
    shadow.scale.set(ball.scale.x * (1 + lift * 0.35), ball.scale.x * (1 + lift * 0.35) * 0.62, 1);
    shadowMat.opacity = inP * (1 - lift * 0.4) * (t < T_BREAK ? 1 : Math.max(0, 1 - tb * 2.5));
    // 重力（画面の下向き）をボールの中の座標に直す
    spin.updateWorldMatrix(true, false);
    spin.getWorldQuaternion(inv).invert();
    down.set(0, -1, 0).applyQuaternion(inv);
    whole.visible = t < T_OPEN;
    const shrink = 1 - 0.045 * openP;
    for (const f of frags) {
      const tf = Math.max(0, tb - f.delay);
      tmp.copy(f.dir).multiplyScalar(0.05 * openP + f.speed * tf * (1 - 0.18 * tf) + (tb > 0 ? 0.04 : 0) * Math.min(1, tb / 0.06));
      tmp.addScaledVector(down, 1.9 * tf * tf);
      f.g.position.copy(f.ctr).add(tmp);
      q.setFromAxisAngle(f.axis, f.rot * tf);
      f.g.quaternion.copy(q);
      f.g.scale.setScalar(shrink);
      f.g.visible = t >= T_OPEN && tf < 1.9;
    }
    glow.intensity = 16 * openP * (tb > 0 ? Math.max(0, 1 - tb * 6) : 1); // 剥がれた後はすぐ消す（ピースが白飛びしないように）
    core.scale.setScalar(1 + easeOut(prog(t, T_BREAK, T_BREAK + 0.2)) * 0.35);
    coreMat.opacity = t < T_BREAK ? 1 : Math.max(0, 1 - tb / 0.3); // 割れた後もしばらく光り、その光から文字が生まれる
    rim.intensity = 3.0 + openP * 3;

    /* カメラ: ゆっくり寄る → 剥がれた瞬間に少し引く */
    const cz = camZ * (1.08 - 0.08 * easeInOut(prog(t, 0, T_OPEN)) + 0.14 * easeOut(prog(t, T_BREAK, T_BREAK + 0.8)));
    camera.position.set(0, cz * 0.14, cz);
    camera.lookAt(0, -0.12, 0);
    if (t >= T_BREAK && t < T_FLY + 0.45) {
      // 手前の破片だけ → 前面キャンバスへ写す → 奥の破片・コア・影を本体へ
      ball.updateWorldMatrix(true, true);
      vC.setFromMatrixPosition(ball.matrixWorld);
      const dC = vC.distanceTo(camera.position);
      const vis = frags.map((f) => f.g.visible);
      frags.forEach((f, i) => { f.front = vis[i] && f.g.getWorldPosition(vF).distanceTo(camera.position) < dC; f.g.visible = f.front; });
      const cv = core.visible, sv = shadow.visible;
      core.visible = false; shadow.visible = false;
      renderer.render(scene, camera);
      const src = renderer.domElement;
      if (front.width !== src.width || front.height !== src.height) { front.width = src.width; front.height = src.height; }
      fctx.clearRect(0, 0, front.width, front.height);
      fctx.drawImage(src, 0, 0);
      frontDirty = true;
      frags.forEach((f, i) => { f.g.visible = vis[i] && !f.front; });
      core.visible = cv; shadow.visible = sv;
      renderer.render(scene, camera);
      frags.forEach((f, i) => { f.g.visible = vis[i]; });
    } else {
      if (frontDirty) { fctx.clearRect(0, 0, front.width, front.height); frontDirty = false; }
      renderer.render(scene, camera);
    }

    /* フラッシュと前面タイトル */
    // 割れたボールの中心（光るコア）の画面上の位置 = 文字が生まれる所
    vOrg.setFromMatrixPosition(ball.matrixWorld).project(camera);
    const ox = (vOrg.x + 1) / 2 * innerWidth, oy = (1 - vOrg.y) / 2 * innerHeight;
    title.style.opacity = t > T_BREAK ? 1 : 0;
    title.style.transform = 'translateY(-50%)';
    /* 1) 割れて中から出る: 各文字はコアの位置で小さく光って生まれ、外へ押し広がりながら原寸の自分の位置へ（上から降らない・いきなり出ない） */
    if (t < T_FLY) {
      if (!emCache) {
        emNodes.forEach((n) => { n.style.transform = ''; });
        emCache = emNodes.map((n) => { const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
      }
      emNodes.forEach((n, i) => {
        const a = i < 6 ? T_EMERGE + 0.02 + i * 0.035 : T_EMERGE + 0.34 + (i - 6) * 0.1;
        const p = prog(t, a, a + EMERGE_D), e = easeOut(p), c = emCache[i];
        n.style.opacity = Math.min(1, p * 4);
        n.style.transform = `translate(${(ox - c.x) * (1 - e)}px,${(oy - c.y) * (1 - e)}px) scale(${0.06 + 0.94 * e})`;
        n.style.filter = p < 1 ? `blur(${(1 - e) * 5}px) brightness(${1 + (1 - e) * 2.5})` : 'none';
      });
      sl.style.opacity = 1;
    }
    if (hint) hint.style.opacity = 1 - prog(t, T_FLY, T_FLY + 0.2);

    /* 2) 移動して重なる: 全部の文字が同じ瞬間 T_LAND に本文の見出し（同じ文言・同じ位置・同じ大きさ）へぴたりと重なる。
       それまでサイトは黒幕の向こうにうっすら見えるだけ */
    canvasEl.style.opacity = 1 - prog(t, T_FLY, T_FLY + 0.45);
    front.style.opacity = canvasEl.style.opacity; // 前面の破片も本体と一緒に消える
    const op = prog(t, T_LAND, T_LAND + OPEN_D);
    vig.style.opacity = t < T_LAND ? 1 : 1 - op;
    grain.style.opacity = 0.09 * (t < T_LAND ? 1 : 1 - op);
    const curtain = 1 - 0.12 * easeInOut(prog(t, T_FLY, T_LAND)); // 移動中は行き先がうっすら透ける
    if (t < T_FLY) {
      if (flyCache) { flyCache = null; pieces.forEach((p) => { p.node.style.transform = ''; }); ch2.style.letterSpacing = ''; }
      [...reals, ...roleRest].forEach((r) => { if (root.classList.contains('s5-intro-on')) r.style.opacity = '0'; });
      if (hero) hero.style.transform = '';
      if (t >= T_OPEN) el.style.background = '#050505';
      flash.style.opacity = t < T_BREAK ? openP * 0.06 : Math.max(0, 0.45 - tb / 0.3);
      return;
    }
    if (!flyCache) { emNodes.forEach((n) => { n.style.transform = ''; n.style.filter = 'none'; n.style.opacity = 1; }); measureFly(); }
    sl.style.opacity = 1 - prog(t, T_FLY, T_FLY + 0.2);
    const landed = t >= T_LAND;
    pieces.forEach((p, i) => {
      const c = flyCache[i], f = easeInOut(prog(t, p.start, p.land));
      if (!c) { p.node.style.opacity = 1 - f; return; }
      p.node.style.transform = `translate(${c.dx * f}px,${c.dy * f}px) scale(${1 + (c.k - 1) * f})`;
      p.node.style.filter = 'none';
      p.node.style.opacity = t >= p.land ? 0 : 1; // 重なった瞬間に本文側の文字と入れ替える
      if (p.real) p.real.style.opacity = t >= p.land ? '1' : '0';
    });
    // 肩書き: 開いた直後にスポーツMC → アリーナMC → NBA 実況・解説 がタタタッとはまる（指示10）
    roleRest.forEach((r, j) => {
      const b = prog(t, T_ROLE + 0.08 * (j + 1), T_ROLE + 0.08 * (j + 1) + 0.16);
      r.style.opacity = String(Math.min(1, b * 2)); r.style.transform = b < 1 ? `translateX(${(1 - easeOut(b)) * -0.6}em) scale(${1 + 0.2 * (1 - easeOut(b))})` : '';
    });
    // チャンネル名は本文側の字間（広い）へ字間も寄せて、重なった時にずれないように
    const ce = flyCache[pieces.findIndex((p) => p.node === ch2)];
    if (ce && tEn) { const ls0 = parseFloat(getComputedStyle(ch2).fontSize) * 0.14, ls1 = parseFloat(getComputedStyle(tEn).letterSpacing) / ce.k; ch2.style.letterSpacing = `${ls0 + (ls1 - ls0) * easeInOut(prog(t, T_FLY, T_LAND))}px`; }

    /* 3) 重なった瞬間にパーンと開く: 白いフラッシュ＋着地点から黒幕が円形に一気に抜ける＋ヒーローが少し弾む */
    if (!landed) {
      el.style.background = `rgba(5,5,5,${curtain})`;
      flash.style.opacity = 0;
      return;
    }
    const cx = flyCache.cx, cy = flyCache.cy;
    const R = easeOut(op) * Math.hypot(innerWidth, innerHeight) * 1.15;
    const a = curtain * (1 - easeIn(op));
    el.style.background = `radial-gradient(circle at ${cx}px ${cy}px, rgba(5,5,5,0) ${R}px, rgba(5,5,5,${a}) ${R + 90}px)`;
    flash.style.background = `radial-gradient(circle at ${cx}px ${cy}px,#fff 0,rgba(255,255,255,.9) ${18 + 30 * op}%,rgba(0,100,177,.45) ${45 + 40 * op}%,rgba(0,100,177,0) ${75 + 40 * op}%)`;
    flash.style.opacity = Math.max(0, 0.95 - (t - T_LAND) / 0.3);
    if (hero) {
      const b = prog(t, T_LAND, T_LAND + 0.38);
      const hr = hero.getBoundingClientRect();
      hero.style.transformOrigin = `${cx - hr.left}px ${cy - hr.top}px`;
      hero.style.transform = b < 1 ? `scale(${1 + 0.035 * Math.sin(Math.PI * b) * (1 - b)})` : '';
    }
  }
  function resizeAll() { resize(); flyCache = null; emCache = null; }
  return { render, resize: resizeAll };
}
