/* ハレルヤ個人ページのオープニング（2026-11-04 初版 → 11-05 作り直し → 11-05 3Dコート復活・人形なし）
   ミネソタ風の配色（ターゲット・センターのコア・コート: 木の地＋ミッドナイトブルーのペイント/外周/センターサークル＋白ライン。ロゴ・文字なし）
   1. 床すれすれを流しながら、白いラインが光って引かれていく（効果音: 自作合成のライン音）
   2. 作戦ボードのマグネットのように O（攻め）/ X（守り）の駒が盤に置かれる。人の形は使わない（クリス指示「人形がいらなかっただけ」）
   3. 俯瞰になり、床にマーカーで作戦図（marker-pen.mp3）
   4. その図の通りに駒が動く: クリス・フィンチのウルブスのセット「HORNS DIVE FIST EXIT」
      （Canis Hoopus 2022-09-30「Deep Dive Inside the Minnesota Timberwolves Creative Offensive Scheme」が名前を挙げたセット）
      #3 ダイブ → #30 のピンダウンで #3 が3Pへ抜ける ＋ 同時に #27 のボールスクリーン → #5 ドライブ → #27 ロール → ロブ → ダンク
      背番号は 2025-26 開幕戦（10/22 @POR・NBA公式スコアシート）の先発 #5 #0 #3 #30 #27
   5. HALLELUJAH → ヒーローへ（ヒーローの背景も同じコートとセット図なので、そのまま繋がる）
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる
   音（sfx-intro.mp3 = 下の時刻表どおりに並べた1本）: ① サイト内リンクから来た時は開始と同時に鳴る（Chrome は同じサイトでの操作を引き継ぐ）
   ② 直接開いた・再読み込みの時は、最初のクリック・タップ・キー・スクロールの時点の場面から鳴る。オープニングが終わった後なら、
   ヒーローのコートのラインが光り直して court-line.mp3 が鳴る。「音が出ます」等の表示は出さない */
import { runIntro, prog, easeOut, easeInOut, rand, loadTex } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

/* 2026-11-05 36本目: ① 線を全部書いてから動く → ペンで書くのと同時に駒が線を追う ② ダンクの後、3D の盤を真上の2D（作戦盤）に倒しながら
   左へ動かし、ヒーローの盤（同じ線・同じ駒の位置の SVG）にそのまま重ねる ③ 名前は「ハレルヤ」（大）＋下に小さく「Be a baller Hallelujah」（36本目訂正）。ダンクの後ポンと出て、そのままヒーローの見出しの位置へ
   時刻は2本: t＝画面の時刻 / u＝t+SH＝作戦の時刻（MOVES・ドリブル・キャッチ・ダンクは u で書いてある） */
const SH = 0.9;
const DUR = 6.15;
const T_UP = 1.1;      // カメラが上がり始める（t）
const T_TOP = 2.3;     // 俯瞰に着く（t）
const T_PASS = 4.48;   // ロールする #27 へロブ（u）
const T_CATCH = 4.78;  // キャッチ（u）
const T_IN = 5.0;      // ダンク（リングを通る）（u）
const T_NAME = 5.1 - SH; // 名前（t）
const F0 = 4.45, F1 = 5.6;   // 盤を真上の2Dに倒しながら左へ（t）
const X0 = 5.5, X1 = 6.05;   // 3D を透かしてヒーローに重ねる（t）
const NAVY = '#0c2340', LAKE = '#5b9bd5', GREEN = '#78be20', CHALK = '#f6f2ea', CORAL = '#ff6b5a';

/* 床の大きさ（m）: コートは 15×14 の半面。外側に余白 */
const FW = 19, FD = 16;
const RIM = { x: 0, y: 3.05, z: -7 + 1.575 };

/* ── 時刻表（効果音 sfx-intro.mp3 も同じ時刻で作ってある: scratchpad/p_hl5/gen_sfx.py。MOVES・ドリブル・キャッチの時刻に足音/キュッ/トン/ドリブル音を合わせてある） ── */
const arcPts = (cx, cz, r, a0, a1, n = 48) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });
const ZC = RIM.z + Math.sqrt(6.75 * 6.75 - 6.6 * 6.6);
const A3 = Math.atan2(ZC - RIM.z, 6.6);
const COURT = [ // [開始, 長さ, 折れ線, 破線]
  [0.20, 0.70, [[-7.5, 7], [-7.5, -7], [7.5, -7], [7.5, 7], [-7.5, 7]]],
  [0.55, 0.45, [[-2.45, -7], [-2.45, -1.2], [2.45, -1.2], [2.45, -7]]],
  [0.80, 0.35, arcPts(0, -1.2, 1.8, 0, Math.PI)],
  [0.80, 0.35, arcPts(0, -1.2, 1.8, Math.PI, Math.PI * 2), true],
  [0.95, 0.60, [[-6.6, -7], ...arcPts(RIM.x, RIM.z, 6.75, Math.PI - A3, A3, 64).reverse().reverse(), [6.6, -7]]],
  [1.25, 0.25, arcPts(RIM.x, RIM.z, 1.25, Math.PI, 0)],
  [1.35, 0.30, arcPts(0, 7, 1.8, Math.PI, Math.PI * 2)],
];
const DROP_O = (i) => 1.25 + i * 0.06; // 駒が落ち始める（0.22 秒で着く）
const DROP_X = (i) => 1.5 + i * 0.05;

/* m → 床テクスチャの px（キャンバス上端 = 奥 z=-8） */
const toPx = (W, H) => (x, z) => [(x + FW / 2) / FW * W, (z + FD / 2) / FD * H];

/* 木目のコート（メープル材の板・継ぎ目・木目）＋ミッドナイトブルーの塗り分け。白ラインは別の層で「引く」 */
function courtCanvas(R) {
  const W = 2048, H = Math.round(2048 * FD / FW);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const P = toPx(W, H), m = W / FW;
  const bw = 0.11 * m; // 板の幅
  for (let x = 0; x < W; x += bw) {
    let y = -R() * 2.5 * m;
    while (y < H) {
      const len = (1.6 + R() * 2.4) * m;
      const h = 33 + R() * 6, s = 40 + R() * 14, l = 62 + R() * 10;
      g.fillStyle = `hsl(${h},${s}%,${l}%)`;
      g.fillRect(x, y, bw + 1, len);
      for (let k = 0; k < 7; k++) {
        const gx = x + R() * bw, amp = 0.6 + R() * 2.2, f = 0.004 + R() * 0.01, ph = R() * 6.28;
        g.strokeStyle = `hsla(${h - 4},${s + 10}%,${l - 18 - R() * 10}%,${0.12 + R() * 0.2})`;
        g.lineWidth = 0.6 + R() * 1.4;
        g.beginPath();
        for (let yy = y; yy <= y + len; yy += 10) { const xx = gx + Math.sin(yy * f + ph) * amp; yy === y ? g.moveTo(xx, yy) : g.lineTo(xx, yy); }
        g.stroke();
      }
      if (R() < 0.08) { g.fillStyle = `hsla(${h - 6},60%,${l - 30}%,.35)`; g.beginPath(); g.ellipse(x + bw / 2, y + R() * len, bw * 0.18, bw * 0.5, 0, 0, 6.28); g.fill(); }
      g.fillStyle = 'rgba(70,40,15,.35)'; g.fillRect(x, y, bw, 1.2);
      y += len;
    }
    g.fillStyle = 'rgba(70,40,15,.28)'; g.fillRect(x, 0, 1, H);
  }
  g.fillStyle = 'rgba(12,35,64,.93)'; // ミッドナイトブルー（木目がうっすら透ける塗装）
  const [cx0, cz0] = P(-7.5, -7), [cx1, cz1] = P(7.5, 7);
  g.fillRect(0, 0, W, cz0); g.fillRect(0, cz1, W, H - cz1); g.fillRect(0, cz0, cx0, cz1 - cz0); g.fillRect(cx1, cz0, W - cx1, cz1 - cz0);
  const [kx0, kz0] = P(-2.45, -7), [kx1, kz1] = P(2.45, -1.2);
  g.fillRect(kx0, kz0, kx1 - kx0, kz1 - kz0);
  { const [px, py] = P(0, 7); g.beginPath(); g.arc(px, py, 1.8 * m, Math.PI, Math.PI * 2); g.closePath(); g.fill(); }
  return c;
}

/* ---------- 作戦: HORNS DIVE FIST EXIT（m 座標・x=左右 / z=奥がゴール） ---------- */
const lerp = (a, b, k) => a + (b - a) * k;
function along(pts, k) {
  if (pts.length === 1) return pts[0];
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let s = Math.min(1, Math.max(0, k)) * L;
  for (let i = 0; i < seg.length; i++) { if (s <= seg[i] || i === seg.length - 1) { const f = seg[i] ? Math.min(1, s / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } s -= seg[i]; }
  return pts[pts.length - 1];
}
function smooth(pts, n = 40) { // Catmull-Rom
  if (pts.length < 3) { const o = []; for (let i = 0; i <= n; i++) o.push(along(pts, i / n)); return o; }
  const o = [], P = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 1; i < P.length - 2; i++) for (let j = 0; j < n / (pts.length - 1); j++) {
    const t = j / (n / (pts.length - 1)), [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    o.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
  }
  o.push(pts[pts.length - 1]); return o;
}

/* 動きの区間 [開始, 終了, 折れ線]。区間の外は直前の位置で止まる
   並び（HORNS）: #5 トップ／#3 左エルボー／#27 右エルボー／#30 左コーナー／#0 右コーナー */
const SCREEN = [0.74, 1.6];   // #27 が X5 の右肩にボールスクリーン
const PIN = [-3.4, -3.6];     // #30 のピンダウン
const MOVES = {
  edw: [[3.95, 4.45, [[0, 2.35], [1.25, 2.05], [2.2, 0.9], [2.6, -0.5]]]],
  mcd: [[3.3, 3.7, [[-2.45, -1.2], [-1.6, -2.6], [-0.85, -4.3]]], [3.82, 4.25, [[-0.85, -4.3], [-2.6, -4.75], [-4.25, -4.1], [-5.75, -1.55]]]],
  ran: [[3.4, 3.8, [[-6.6, -5.9], [-5.2, -4.9], PIN]]],
  gob: [[3.55, 3.9, [[2.45, -1.2], [1.6, 0.3], SCREEN]], [4.05, T_CATCH, [SCREEN, [1.15, 0.2], [1.0, -2.2], [0.45, -4.2]]]],
  div: [[4.0, 4.4, [[6.6, -5.9], [6.6, -5.35]]]],
  x5: [[3.97, 4.09, [[0, 1.45], [0.12, 1.36]]], [4.13, 4.6, [[0.12, 1.36], [0.9, 2.35], [1.9, 1.6], [2.35, 0.4]]]],
  x3: [[3.32, 3.72, [[-1.9, -2.0], [-1.5, -3.3], [-1.35, -3.75]]], [3.86, 4.12, [[-1.35, -3.75], [-2.0, -3.95], [-2.65, -3.95]]]],
  x30: [[3.42, 3.82, [[-5.8, -5.4], [-4.3, -4.0], [-3.0, -2.9]]], [4.15, 4.5, [[-3.0, -2.9], [-4.0, -2.4], [-4.9, -2.0]]]],
  x27: [[3.6, 3.95, [[1.9, -2.1], [0.95, -0.2]]], [4.05, 4.4, [[0.95, -0.2], [1.95, -0.9]]], [4.55, 4.95, [[1.95, -0.9], [1.2, -3.0], [1.05, -3.7]]]],
  x0: [[4.1, 4.5, [[5.7, -5.4], [5.3, -5.0]]]],
};
const SMOOTHED = Object.fromEntries(Object.entries(MOVES).map(([k, segs]) => [k, segs.map(([a, b, pts]) => [a, b, smooth(pts)])]));
function posOf(key, t) {
  const segs = SMOOTHED[key]; let p = segs[0][2][0];
  for (const [a, b, pts] of segs) { if (t < a) return p; p = along(pts, easeInOut(prog(t, a, b))); }
  return p;
}
/* 駒の床の上の位置（m）。#27 はキャッチ後リングへ跳ぶぶん寄る。ヒーローの SVG の駒もこの最終位置 */
function tokXZ(k, u) {
  const [x, z] = posOf(k, u);
  if (k !== 'gob' || u <= T_CATCH - 0.08) return [x, z];
  const j = easeOut(prog(u, T_CATCH - 0.08, T_IN)) * 0.6;
  return [lerp(x, RIM.x, j), lerp(z, RIM.z + 0.45, j)];
}
const OFF = [{ key: 'edw', num: '5' }, { key: 'div', num: '0' }, { key: 'mcd', num: '3' }, { key: 'ran', num: '30' }, { key: 'gob', num: '27' }];
const DEF = ['x5', 'x0', 'x3', 'x30', 'x27'];
/* 作戦図（マーカー）: [開始(u), 長さ, 折れ線, 色, 形]。各駒の動きの区間と同じ時刻・同じ緩急で、LEAD 秒だけ先にペン先が進む
   （= 書きながら動く。線を全部書いてから動くのはやめた・36本目） */
const LEAD = 0.08;
const INK = [
  [3.3, 0.4, smooth(MOVES.mcd[0][2]), GREEN, { arrow: true, seed: 3 }],                            // DIVE（#3）
  [3.4, 0.4, smooth(MOVES.ran[0][2]), CHALK, { screen: true, seed: 11 }],                          // ピンダウン（#30）
  [3.55, 0.35, smooth(MOVES.gob[0][2]), CHALK, { screen: true, seed: 12 }],                        // ボールスクリーン（#27）
  [3.82, 0.43, smooth(MOVES.mcd[1][2]), LAKE, { arrow: true, seed: 9 }],                           // FIST EXIT（#3）
  [3.95, 0.5, smooth(MOVES.edw[0][2]), GREEN, { zig: true, arrow: true, seed: 4 }],                // ドライブ（#5）
  [4.05, T_CATCH - 4.05, smooth(MOVES.gob[1][2].concat([[0.15, -4.95]])), GREEN, { arrow: true, seed: 7 }], // ロール（#27）
  [T_PASS, T_CATCH - T_PASS, smooth([[2.6, -0.5], [1.7, -2.4], [0.45, -4.2]]), CHALK, { dash: true, arrow: true, seed: 5 }], // ロブ
];
const inkK = (u, d, l) => easeInOut(prog(u, d - LEAD, d + l - LEAD));
/* マーカーの線の点列（m）: 弧長の割合 k まで。手書きの揺れ（wob）・ドリブルのジグザグ込み。3D の線とヒーローの SVG（__hlSvgSet）で共通 */
const wob = (seed) => { const r = rand(seed); const a = r() * 6, b = r() * 6; return (s) => 0.035 * Math.sin(s * 7 + a) + 0.02 * Math.sin(s * 17 + b); };
function inkPts(pts, k, opt = {}) {
  const N = pts.length - 1, w = wob(opt.seed || 1), cum = [0];
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const s = Math.min(1, Math.max(0, k)) * cum[N];
  let j = 1; while (j < N && cum[j] < s) j++;
  const fr = cum[j] > cum[j - 1] ? Math.min(1, (s - cum[j - 1]) / (cum[j] - cum[j - 1])) : 0;
  const src = pts.slice(0, j).map((q, i) => [i, q]);
  src.push([j - 1 + fr, [lerp(pts[j - 1][0], pts[j][0], fr), lerp(pts[j - 1][1], pts[j][1], fr)]]);
  return src.map(([fi, q]) => {
    const f = fi / N, i = Math.round(fi); let [x, z] = q;
    if (opt.zig) { const nx = pts[Math.min(i + 1, N)], pv = pts[Math.max(i - 1, 0)]; const dx = nx[0] - pv[0], dz = nx[1] - pv[1], L = Math.hypot(dx, dz) || 1; const o = Math.sin(f * 40) * 0.16; x += -dz / L * o; z += dx / L * o; }
    return [x + w(f * 3), z + w(f * 3 + 9)];
  });
}
const PHASES = [[2.0, 'HORNS'], [3.3, 'DIVE'], [3.82, 'FIST EXIT'], [3.95, 'PICK & ROLL'], [T_PASS, 'LOB'], [T_IN - 0.02, 'DUNK']];
/* ヒーローの盤（SVG）の座標: ゴールが右。x=1380 がベースライン、1m=49。X=1380-(z+7)*49 / Y=450+x*49 */
const SV = (x, z) => [+(1380 - (z + 7) * 49).toFixed(1), +(450 + x * 49).toFixed(1)];

/* ── 音 ── */
const SFX = { ctx: null, out: null, buf: null, line: null, started: false, swallow: false, t: -1, done: false };
const base = new URL('../../assets/s5/hallelujah/', import.meta.url).href;
function initAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    SFX.ctx = new AC();
    SFX.out = SFX.ctx.createGain(); SFX.out.gain.value = 0.9; SFX.out.connect(SFX.ctx.destination);
    const get = (f) => fetch(base + f).then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((ab) => (ab ? new Promise((res) => SFX.ctx.decodeAudioData(ab, res, () => res(null))) : null)).catch(() => null);
    get('sfx-intro.mp3').then((b) => { SFX.buf = b; trySound(); });
    get('court-line.mp3').then((b) => { SFX.line = b; });
    SFX.ctx.resume().then(trySound).catch(() => {});
  } catch (e) { SFX.ctx = null; }
}
const audioOn = () => SFX.ctx && SFX.ctx.state === 'running';
function trySound() {
  if (SFX.started || !audioOn() || !SFX.buf || SFX.t < 0 || SFX.done || SFX.t >= T_NAME) return;
  SFX.started = true;
  const s = SFX.ctx.createBufferSource(); s.buffer = SFX.buf; s.connect(SFX.out);
  s.start(0, Math.max(0, SFX.t));
}
/* オープニングが終わってから最初の操作が来た時: ヒーローのラインを光らせ直して、ラインの音 */
function heroLine() {
  if (SFX.started || !audioOn() || !SFX.line) return;
  SFX.started = true;
  const hero = document.getElementById('top');
  if (hero && hero.getBoundingClientRect().bottom > 80) { hero.classList.remove('hl-glint'); void hero.offsetWidth; hero.classList.add('hl-glint'); }
  const s = SFX.ctx.createBufferSource(); s.buffer = SFX.line; s.connect(SFX.out); s.start();
}
function armUnlock(el) {
  const unlock = (e) => {
    if (!SFX.ctx || SFX.started) return;
    if (e.type === 'keydown' && e.key === 'Escape') return; // Esc はいつでもスキップ
    SFX.ctx.resume().then(() => (SFX.done ? heroLine() : trySound())).catch(() => {});
    if (!SFX.done && (e.type === 'pointerdown' || e.type === 'keydown')) SFX.swallow = true; // 音を出すための1回目はスキップしない
    if (!SFX.done && e.type === 'keydown') { e.stopImmediatePropagation(); e.preventDefault(); }
  };
  // Chrome が「ユーザー操作」と認めるのは keydown・mousedown/pointerdown・pointerup・touchend。wheel・scroll・touchstart は試すだけ
  ['pointerdown', 'pointerup', 'keydown'].forEach((n) => addEventListener(n, unlock, true));
  ['touchstart', 'touchend', 'wheel', 'scroll'].forEach((n) => addEventListener(n, unlock, { capture: true, passive: true }));
  el.addEventListener('click', (e) => { if (SFX.swallow) { SFX.swallow = false; e.stopImmediatePropagation(); } }, true);
}
{
  const el = document.getElementById('s5-intro');
  const root = document.documentElement;
  if (el && !new URLSearchParams(location.search).has('introt') && root.classList.contains('s5-intro-on')) {
    initAudio(); armUnlock(el);
    // オープニングが外れたらヒーローを入場させる（CSS: html.hl-in）
    new MutationObserver((_, mo) => {
      if (root.classList.contains('s5-intro-on')) return;
      mo.disconnect(); SFX.done = true; root.classList.add('hl-in');
    }).observe(root, { attributes: true, attributeFilter: ['class'] });
  }
}
window.__hlSfx = SFX; // 確認用（CDP で state と再生位置を読む）
/* ヒーローの盤（SVG .hl-court の中身）を、このオープニングと同じ線・同じ駒の最終位置で書き出す（制作用: CDP で呼んで HTML に貼る） */
window.__hlSvgSet = () => {
  const D = (q) => 'M' + q.map(([x, z]) => SV(x, z).join(' ')).join(' L');
  const o = [];
  COURT.forEach(([d, l, pts, dash]) => o.push(dash ? `<path class="cd" d="${D(pts)}"/>` : `<path pathLength="1" style="--d:${d}s;--t:${l}s" class="c" d="${D(pts)}"/>`));
  const [bx, by] = SV(0, -7 + 1.2), [rx, ry] = SV(RIM.x, RIM.z);
  o.push(`<path pathLength="1" style="--d:1.6s;--t:0.2s" class="c" d="M${bx} ${by - 44.1} V${by + 44.1}"/>`, `<circle pathLength="1" style="--d:1.7s;--t:0.25s" class="c" cx="${rx}" cy="${ry}" r="11.3"/>`);
  o.push('<g class="hl-set">');
  INK.forEach(([d, l, pts, color, opt]) => {
    const q = inkPts(pts, 1, opt).map(([x, z]) => SV(x, z)), cls = 'p ink ' + (color === GREEN ? 'g' : color === LAKE ? 'b' : 'w');
    const st = `style="--d:${Math.max(0.05, d - LEAD - SH).toFixed(2)}s;--t:${l.toFixed(2)}s"`;
    o.push(`<path pathLength="1" ${st} class="${cls}${opt.dash ? ' dash' : ''}" d="M${q.map((p) => p.join(' ')).join(' L')}"/>`);
    const [lx, ly] = q[q.length - 1], [px, py] = q[q.length - 2], a = Math.atan2(ly - py, lx - px), e = `style="--d:${(d + l - LEAD - SH).toFixed(2)}s;--t:0.1s"`;
    const f = (v) => v.toFixed(1);
    if (opt.arrow) { const s = 0.34 * 49; o.push(`<path pathLength="1" ${e} class="${cls}" d="M${f(lx - Math.cos(a - 0.5) * s)} ${f(ly - Math.sin(a - 0.5) * s)} L${f(lx)} ${f(ly)} L${f(lx - Math.cos(a + 0.5) * s)} ${f(ly - Math.sin(a + 0.5) * s)}"/>`); }
    if (opt.screen) { const b = a + Math.PI / 2, s = 0.36 * 49; o.push(`<path pathLength="1" ${e} class="${cls} scr" d="M${f(lx - Math.cos(b) * s)} ${f(ly - Math.sin(b) * s)} L${f(lx + Math.cos(b) * s)} ${f(ly + Math.sin(b) * s)}"/>`); }
  });
  const uEnd = DUR + SH;
  OFF.forEach((t, i) => { const [x, y] = SV(...tokXZ(t.key, uEnd)); o.push(`<g class="pc o" transform="translate(${x} ${y})"><circle pathLength="1" style="--d:${DROP_O(i).toFixed(2)}s;--t:0.22s" class="p g" r="15.5"/><text style="--d:${(DROP_O(i) + 0.1).toFixed(2)}s" y="1">${t.num}</text></g>`); });
  DEF.forEach((k, i) => { const [x, y] = SV(...tokXZ(k, uEnd)); o.push(`<g class="pc x" transform="translate(${x} ${y})"><path pathLength="1" style="--d:${DROP_X(i).toFixed(2)}s;--t:0.16s" class="p r" d="M-7 -7 L7 7 M7 -7 L-7 7"/></g>`); });
  o.push('<circle class="hl-ball" r="8" cx="0" cy="0"/>', `<circle class="hl-rip" cx="${rx}" cy="${ry}" r="11.3"/>`, '</g>');
  return o.join('\n      ');
};

runIntro({ key: 'hallelujah', duration: DUR, gl: true, setup });

async function setup(ctx) {
  const THREE = ctx.THREE;
  const { renderer, el, lay } = ctx;
  const R = rand(5150);
  const ibase = new URL('../../assets/s5/intro/', import.meta.url).href;
  try { await Promise.race([Promise.all([document.fonts.load('400 60px "Archivo Black"', 'Be a baller Hallelujah 0123579 &'), document.fonts.load('900 60px "Noto Sans JP"', 'ハレルヤ')]), new Promise((r) => setTimeout(r, 900))]); } catch (e) { /* 代わりの書体 */ }
  const ballTex = await Promise.race([
    Promise.all([loadTex(THREE, ibase + 'ball_albedo.webp'), loadTex(THREE, ibase + 'ball_normal.webp', false), loadTex(THREE, ibase + 'ball_rough.webp', false)]).catch(() => null),
    new Promise((r) => setTimeout(() => r(null), 1400)),
  ]);

  lay.innerHTML = '<div class="hl3-flash"></div>'
    + '<div class="hl3-set"><span>CHRIS FINCH ／ MINNESOTA</span><b>HORNS DIVE FIST EXIT</b><i></i></div>'
    + '<div class="hl3-name"><b>' + [...'ハレルヤ'].map((ch) => '<i>' + ch + '</i>').join('') + '</b><span>Be a baller Hallelujah</span></div>'
    + '<div class="hl3-end"></div>';
  const st = document.createElement('style');
  st.textContent = `
    .hl3-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,250,235,.9),rgba(255,250,235,0) 55%);opacity:0}
    .hl3-set{position:absolute;left:max(20px,4vw);top:max(20px,5vh);color:${CHALK};opacity:0;font-family:"Archivo Black",sans-serif;font-weight:400;line-height:1.25;text-shadow:0 2px 12px rgba(0,0,0,.6)}
    .hl3-set span{display:block;font-size:max(10px,min(1.1vw,1.6vh));letter-spacing:.26em;color:${GREEN}}
    .hl3-set b{display:block;font-weight:400;font-size:max(15px,min(2.2vw,3.4vh));letter-spacing:.06em;margin-top:.3em}
    .hl3-set i{display:block;font-style:normal;font-size:max(12px,min(1.4vw,2.1vh));letter-spacing:.2em;margin-top:.5em;color:#fff;min-height:1.3em}
    .hl3-name{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;color:${CHALK}}
    .hl3-name b{display:block;font-family:"Noto Sans JP",sans-serif;font-weight:900;font-size:min(13vw,20vh);white-space:nowrap;line-height:1;letter-spacing:.06em;color:#f4f1ea;transform-origin:50% 50%;text-shadow:0 .04em 0 rgba(0,0,0,.35),0 0 .5em rgba(0,0,0,.55)}
    .hl3-name i{display:inline-block;font-style:normal}
    .hl3-name span{display:block;width:max-content;margin:2.4vh auto 0;font-family:"Archivo Black","Noto Sans JP",sans-serif;font-weight:400;font-size:max(14px,min(2.2vw,3.4vh));letter-spacing:.12em;white-space:nowrap;color:#f4f1ea;transform-origin:50% 50%;opacity:0}
    .hl3-end{position:absolute;inset:0;background:radial-gradient(120% 90% at 70% 50%,#143562 0%,${NAVY} 60%,#081a31 100%);opacity:0}`;
  el.appendChild(st);
  const flash = lay.querySelector('.hl3-flash'), name = lay.querySelector('.hl3-name'), chars = [...name.querySelectorAll('i')], sub = name.querySelector('span');
  const setBox = lay.querySelector('.hl3-set'), phase = setBox.querySelector('i'), endBg = lay.querySelector('.hl3-end');

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05070b);
  scene.fog = new THREE.Fog(0x05070b, 11, 26);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.55;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 90);

  scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2a1a0c, 0.4));
  const sun = new THREE.DirectionalLight(0xfff4e2, 2.3);
  sun.position.set(2.5, 12, 3); sun.target.position.set(0, 0, -2.5);
  sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); sun.shadow.radius = 4; sun.shadow.bias = -0.0005;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  scene.add(sun, sun.target);
  for (const [x, z] of [[-4.5, -4], [4.5, -4], [-4.5, 3.5], [4.5, 3.5], [0, -0.5]]) {
    const p = new THREE.PointLight(0xfff0d8, 26, 18, 1.7); p.position.set(x, 7.5, z); scene.add(p);
  }

  /* 床 */
  const cc = courtCanvas(R);
  const albedo = new THREE.CanvasTexture(cc); albedo.colorSpace = THREE.SRGBColorSpace; albedo.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const bump = new THREE.CanvasTexture(cc); bump.anisotropy = 8;
  const floorM = new THREE.MeshPhysicalMaterial({ map: albedo, bumpMap: bump, bumpScale: 0.6, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.07, specularIntensity: 0.6 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(FW, FD), floorM);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  floorM.transparent = true; floor.renderOrder = -1; // 最後に床（木目）を消して紺の作戦盤にする

  /* 床の上の層（キャンバス→テクスチャ）: 白ライン用と作戦図用 */
  function layer(px, y) {
    const c = document.createElement('canvas'); c.width = px; c.height = Math.round(px * FD / FW);
    const g = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(FW, FD), mat); mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; scene.add(mesh);
    return { c, g, tex, mat, P: toPx(c.width, c.height), m: c.width / FW };
  }
  const LN = layer(2048, 0.003), IK = layer(1536, 0.006);

  /* 白ライン: 引いている先端が光り、引き終わると落ち着いた白になる */
  let lastLn = '';
  function drawCourt(t) {
    const ks = COURT.map(([d, l]) => prog(t, d, d + l));
    const key = ks.map((v) => v.toFixed(3)).join() + (t > 2 ? 1 : 0);
    if (key === lastLn) return; lastLn = key;
    const { g, P, m, c } = LN;
    g.clearRect(0, 0, c.width, c.height);
    COURT.forEach(([d, l, pts, dash], i) => {
      const k = easeInOut(ks[i]); if (k <= 0) return;
      const n = Math.max(2, Math.round((pts.length - 1) * k) + 1), tip = along(pts, k);
      const sub = pts.slice(0, n - 1).concat([tip]);
      const hot = Math.max(0, 1 - prog(t, d + l, d + l + 0.6)); // 引き終わってから 0.6 秒で落ち着く
      g.save(); g.lineCap = dash ? 'butt' : 'round'; g.lineJoin = 'round';
      if (dash) g.setLineDash([0.3 * m, 0.25 * m]);
      const path = () => { g.beginPath(); sub.forEach(([x, z], j) => { const [px, py] = P(x, z); j ? g.lineTo(px, py) : g.moveTo(px, py); }); };
      g.strokeStyle = `rgba(190,255,140,${0.35 * hot})`; g.lineWidth = 0.16 * m; g.shadowColor = GREEN; g.shadowBlur = 0.4 * m * hot; path(); g.stroke();
      g.shadowBlur = 0; g.strokeStyle = `rgba(252,250,242,${0.9 + 0.1 * hot})`; g.lineWidth = 0.055 * m; path(); g.stroke();
      if (ks[i] < 1) { const [px, py] = P(tip[0], tip[1]); const gr = g.createRadialGradient(px, py, 0, px, py, 0.5 * m); gr.addColorStop(0, 'rgba(255,255,240,1)'); gr.addColorStop(0.3, 'rgba(200,255,150,.6)'); gr.addColorStop(1, 'rgba(120,190,32,0)'); g.fillStyle = gr; g.setLineDash([]); g.beginPath(); g.arc(px, py, 0.5 * m, 0, 6.29); g.fill(); }
      g.restore();
    });
    LN.tex.needsUpdate = true;
  }

  /* 作戦図（マーカーの線） */
  function stroke(pts, k, color, opt = {}) {
    if (k <= 0) return;
    const { g: ig, P: IP, m: im } = IK;
    const q = inkPts(pts, k, opt).map(([x, z]) => IP(x, z));
    ig.save();
    ig.strokeStyle = color; ig.lineWidth = 0.09 * im; ig.lineCap = 'round'; ig.lineJoin = 'round';
    ig.shadowColor = color; ig.shadowBlur = 0.12 * im;
    if (opt.dash) ig.setLineDash([0.28 * im, 0.2 * im]);
    ig.beginPath();
    q.forEach(([px, py], i) => (i ? ig.lineTo(px, py) : ig.moveTo(px, py)));
    const last = q[q.length - 1], prev = q[Math.max(0, q.length - 2)];
    ig.stroke(); ig.setLineDash([]);
    if (k < 1) { // ペン先（いま書いているところ）
      ig.shadowBlur = 0.35 * im; ig.fillStyle = '#fffdf4';
      ig.beginPath(); ig.arc(last[0], last[1], 0.075 * im, 0, 6.29); ig.fill();
    }
    if (k >= 1 && prev && opt.arrow) {
      const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]), s = 0.34 * im;
      ig.beginPath(); ig.moveTo(last[0] - Math.cos(a - 0.5) * s, last[1] - Math.sin(a - 0.5) * s); ig.lineTo(last[0], last[1]); ig.lineTo(last[0] - Math.cos(a + 0.5) * s, last[1] - Math.sin(a + 0.5) * s); ig.stroke();
    }
    if (k >= 1 && prev && opt.screen) { const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]) + Math.PI / 2, s = 0.36 * im; ig.lineWidth = 0.12 * im; ig.beginPath(); ig.moveTo(last[0] - Math.cos(a) * s, last[1] - Math.sin(a) * s); ig.lineTo(last[0] + Math.cos(a) * s, last[1] + Math.sin(a) * s); ig.stroke(); }
    ig.restore();
  }
  let lastInk = '';
  function drawInk(u, fade) {
    const ks = INK.map(([d, l]) => inkK(u, d, l));
    const key = ks.map((v) => v.toFixed(3)).join() + fade.toFixed(3);
    if (key === lastInk) return; lastInk = key;
    IK.g.clearRect(0, 0, IK.c.width, IK.c.height);
    IK.mat.opacity = fade;
    INK.forEach(([, , pts, color, opt], i) => stroke(pts, ks[i], color, opt));
    IK.tex.needsUpdate = true;
  }

  /* ゴール */
  const hoop = new THREE.Group(); scene.add(hoop);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.05, 0.03), new THREE.MeshPhysicalMaterial({ color: 0xdfeff0, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0, clearcoat: 1 }));
  glass.position.set(0, 2.9 + 0.525, -7 + 1.2); hoop.add(glass);
  const frameM = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.4 });
  const edge = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.035), frameM); m.position.set(x, y, -7 + 1.2 + 0.001); hoop.add(m); };
  edge(1.8, 0.05, 0, 2.9 + 1.025); edge(1.8, 0.05, 0, 2.925); edge(0.05, 1.05, -0.875, 3.425); edge(0.05, 1.05, 0.875, 3.425);
  edge(0.59, 0.04, 0, 3.05 + 0.43); edge(0.59, 0.04, 0, 3.07); edge(0.04, 0.45, -0.275, 3.27); edge(0.04, 0.45, 0.275, 3.27);
  const rimM = new THREE.MeshStandardMaterial({ color: 0xff5a14, roughness: 0.35, metalness: 0.6 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.012, 10, 48), rimM); rim.rotation.x = Math.PI / 2; rim.position.set(RIM.x, RIM.y, RIM.z); rim.castShadow = true; hoop.add(rim);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.15), rimM); arm.position.set(0, RIM.y, -7 + 1.2 + 0.09); hoop.add(arm);
  const netM = new THREE.LineBasicMaterial({ color: 0xf4f4f0, transparent: true, opacity: 0.85 });
  const netPts = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2, b = a + Math.PI / 12; netPts.push(new THREE.Vector3(Math.cos(a) * 0.23, 0, Math.sin(a) * 0.23), new THREE.Vector3(Math.cos(b) * 0.15, -0.42, Math.sin(b) * 0.15)); netPts.push(new THREE.Vector3(Math.cos(a + Math.PI / 6) * 0.23, 0, Math.sin(a + Math.PI / 6) * 0.23), new THREE.Vector3(Math.cos(b) * 0.15, -0.42, Math.sin(b) * 0.15)); }
  const net = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(netPts), netM); net.position.set(RIM.x, RIM.y, RIM.z); hoop.add(net);
  const pole = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.6, 0.2), new THREE.MeshStandardMaterial({ color: 0x1a1d20, roughness: 0.6, metalness: 0.4 }));
  pole.position.set(0, 1.8, -8.4); pole.castShadow = true; hoop.add(pole);
  const brace = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.6), pole.material); brace.position.set(0, 3.3, -7.1); hoop.add(brace);

  /* ---------- 駒（作戦ボードのマグネット）: 人の形は使わない ---------- */
  const TR = 0.36, TH = 0.14;
  function faceTex(off, label) {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = off ? NAVY : '#1d1012'; g.fillRect(0, 0, 256, 256);
    g.lineWidth = 16; g.strokeStyle = off ? GREEN : CORAL; g.beginPath(); g.arc(128, 128, 112, 0, 6.29); g.stroke();
    if (off) {
      g.fillStyle = '#ffffff'; g.font = `${label.length > 1 ? 104 : 124}px "Archivo Black", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 128, 136);
    } else {
      g.strokeStyle = CORAL; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(78, 78); g.lineTo(178, 178); g.moveTo(178, 78); g.lineTo(78, 178); g.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  const tokGeo = new THREE.CylinderGeometry(TR, TR * 1.04, TH, 56);
  const sideO = new THREE.MeshPhysicalMaterial({ color: GREEN, emissive: GREEN, emissiveIntensity: 0.25, roughness: 0.3, clearcoat: 1 });
  const sideX = new THREE.MeshPhysicalMaterial({ color: CORAL, emissive: CORAL, emissiveIntensity: 0.2, roughness: 0.3, clearcoat: 1 });
  function makeToken(off, label) {
    const tex = faceTex(off, label);
    const top = new THREE.MeshPhysicalMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0.32, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 });
    const mesh = new THREE.Mesh(tokGeo, [off ? sideO : sideX, top, off ? sideO : sideX]);
    mesh.castShadow = true; mesh.visible = false; scene.add(mesh);
    return mesh;
  }
  const tokens = {};
  OFF.forEach((o, i) => { tokens[o.key] = { mesh: makeToken(true, o.num), drop: DROP_O(i) }; });
  DEF.forEach((k, i) => { tokens[k] = { mesh: makeToken(false, ''), drop: DROP_X(i) }; });
  // 置く: 上から落ちて、盤に「カチッ」と着く（0.22 秒・少し弾む）
  function dropY(t, d) {
    const k = prog(t, d, d + 0.22);
    if (k < 1) return TH / 2 + 2.4 * (1 - k * k);
    const b = prog(t, d + 0.22, d + 0.36);
    return TH / 2 + Math.sin(b * Math.PI) * 0.06;
  }
  function placeTokens(t, u) {
    for (const k in tokens) {
      const { mesh, drop } = tokens[k];
      mesh.visible = t >= drop;
      if (!mesh.visible) continue;
      const [x, z] = tokXZ(k, u);
      let y = dropY(t, drop), rx = 0, rz = 0;
      const a = posOf(k, u - 0.03), b = posOf(k, u + 0.03), vx = (b[0] - a[0]) / 0.06, vz = (b[1] - a[1]) / 0.06;
      rx = -vz * 0.025; rz = vx * 0.025; // 滑る向きに少し傾く
      if (k === 'x5') { const hit = Math.max(0, 1 - Math.abs(u - 4.08) / 0.1); rz += 0.25 * hit; } // スクリーンに当たる
      if (k === 'x3') { const hit = Math.max(0, 1 - Math.abs(u - 4.1) / 0.1); rz -= 0.25 * hit; }
      if (k === 'gob' && u > T_CATCH - 0.08) { // キャッチ → 跳んでリングへ
        const j = prog(u, T_CATCH - 0.08, T_IN), down = prog(u, T_IN + 0.05, T_IN + 0.4);
        y += Math.sin(Math.min(1, j) * Math.PI * 0.5) * 1.9 * (1 - easeInOut(down));
        rx = -0.5 * Math.sin(Math.min(1, j) * Math.PI) * (1 - down);
      }
      if ((k === 'x27' || k === 'x3') && u > T_CATCH - 0.05) y += Math.sin(prog(u, T_CATCH - 0.05, T_IN + 0.2) * Math.PI) * (k === 'x27' ? 0.7 : 0.4);
      mesh.position.set(x, y, z); mesh.rotation.set(rx, 0, rz);
    }
  }

  /* ボール */
  const BR = 0.16;
  const ballM = ballTex
    ? new THREE.MeshStandardMaterial({ map: ballTex[0], normalMap: ballTex[1], roughnessMap: ballTex[2], roughness: 1, metalness: 0 })
    : new THREE.MeshStandardMaterial({ color: 0xd4561c, roughness: 0.75 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BR, 48, 32), ballM); ball.castShadow = true; scene.add(ball);
  function ballAt(t) {
    if (t < T_PASS) { // #5 の横でドリブル
      const [x, z] = posOf('edw', t), ph = t * (t < 3.95 ? 2.2 : 3.2);
      return [x + 0.42, BR + Math.abs(Math.sin(ph * Math.PI)) * 0.7, z + 0.1, t * 3];
    }
    const A = posOf('edw', T_PASS), G = posOf('gob', T_CATCH);
    if (t < T_CATCH) { // ディフェンスの上を越えるロブ
      const k = prog(t, T_PASS, T_CATCH);
      return [lerp(A[0] + 0.3, G[0], k), lerp(0.9, 1.5, k) + Math.sin(k * Math.PI) * 1.7, lerp(A[1], G[1], k), 6 + k * 4];
    }
    if (t < T_IN) { // 跳んだ #27 と一緒にリングへ
      const k = easeInOut(prog(t, T_CATCH, T_IN));
      return [lerp(G[0], RIM.x, k), lerp(1.5, RIM.y + 0.3, k), lerp(G[1], RIM.z + 0.02, k), 10 + k * 2];
    }
    const k = t - T_IN; // リングを抜けて床へ
    const y0 = RIM.y + 0.3, y = y0 - 5 * k * k - 3 * k;
    if (y > BR) return [RIM.x, y, RIM.z + 0.02 + k * 0.5, 12 + k * 2];
    const tl = (-3 + Math.sqrt(9 + 20 * (y0 - BR))) / 10, kk = k - tl;
    return [RIM.x, BR + Math.abs(Math.sin(kk * 4.5)) * 1.0 * Math.exp(-kk * 2.5), RIM.z + 0.02 + k * 0.5, 12 + k * 2];
  }

  let aspect = 1, nar = false;
  const BG0 = new THREE.Color(0x05070b), BG1 = new THREE.Color(0x10305a);
  const vig = el.querySelector('.vig'), grain = el.querySelector('.grain'), cv = el.querySelector('canvas');
  const nb = name.querySelector('b'), root = document.documentElement;
  function resize() {
    aspect = innerWidth / innerHeight; nar = aspect < 0.8;
    camera.aspect = aspect; camera.fov = nar ? 54 : 38; camera.updateProjectionMatrix();
    fogN = nar ? 22 : 13; fogF = nar ? 44 : 30;
  }
  let fogN = 13, fogF = 30;
  resize();
  const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  /* 着地点: ヒーローの盤（SVG .hl-court）と見出し（h1）。ページのレイアウトから毎フレーム測る（幅・読み込みの変化に追従） */
  const FOV_F = 16; // 真上から狭い画角で撮る＝ほぼ平面の作戦盤
  const hc = document.querySelector('.hl-hero .hl-court');
  const hEn = document.querySelector('.hl-hero .hl-name .en'), hJa = document.querySelector('.hl-hero .hl-name .ja');
  const hPh = document.querySelector('.hl-hero .hl-hero-ph'); // 70本目: 盤は写真の後ろ
  const hHero = document.querySelector('.hl-hero'), hHdr = document.querySelector('header.nav');
  function flatCam() {
    const M = hc && hc.getScreenCTM && hc.getScreenCTM();
    if (!M || !M.a) return null;
    const W = innerWidth, H = innerHeight, ppm = 49 * M.a;
    const [X, Y] = SV(RIM.x, RIM.z), rx = M.a * X + M.e, ry = M.d * Y + M.f;
    // 真上・画面の右＝ゴール（-z）・画面の下＝+x。画面の中心に来る床の点と、1m=ppm px になる高さ
    const cz = RIM.z - (W / 2 - rx) / ppm, cx = RIM.x + (H / 2 - ry) / ppm;
    const h = H / (2 * Math.tan(FOV_F / 2 * Math.PI / 180) * ppm);
    return { pos: [cx, h, cz], look: [cx, 0, cz] };
  }
  const rngRect = (node) => { const r = document.createRange(); r.selectNodeContents(node); return r.getBoundingClientRect(); };
  function fly(elm, target, k) { // elm（オープニングの文字）を target（ヒーローの文字）の位置・大きさへ
    elm.style.transform = '';
    if (k <= 0 || !target) return;
    const a = elm === nb ? rngRect(elm) : elm.getBoundingClientRect(), b = rngRect(target);
    if (!a.width || !b.width) return;
    const s = lerp(1, b.width / a.width, k);
    const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) * k, dy = (b.top + b.height / 2 - (a.top + a.height / 2)) * k;
    elm.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${s.toFixed(4)})`;
  }
  const UP_X = new THREE.Vector3(-1, 0, 0);
  function render(t) {
    SFX.t = t; if (t >= 0) trySound();
    const u = t + SH; // 作戦の時刻
    const fl = easeInOut(prog(t, F0, F1));  // 真上の2Dへ倒す（＋左へ）
    const xk = easeInOut(prog(t, X0, X1));  // 3D を透かしてヒーローへ
    root.classList.toggle('hl-land', t >= X0);
    /* カメラ: 床すれすれを横に流す（ラインが引かれていく）→ 上がって俯瞰 → リングへ少し寄る → 真上の2Dに倒しながらヒーローの盤の位置へ
       縦長（スマホ）は俯瞰をサイドライン側から撮る（コートの横幅15mを画面の縦に入れる） */
    const lk = easeInOut(prog(t, 0, T_UP));
    const low = [lerp(6.6, 4.5, lk), 0.5, lerp(3.8, 2.5, lk)];
    const top = nar ? [8.4, 19.6, -1.9] : [0, 15.0, 6.6];
    const end = nar ? [6.6, 14.0, -3.4] : [0, 10.8, 3.2];
    const up = easeInOut(prog(t, T_UP, T_TOP)), push = easeInOut(prog(u, T_CATCH - 0.45, 5.6));
    const cp = v3(low).lerp(v3(top), up).lerp(v3(end), push);
    const lowL = nar ? [lerp(1.2, 0.6, lk), 0.6, -2.6] : [lerp(-1.2, -0.2, lk), 0.6, -3.2];
    const topL = nar ? [0, 0, -1.9] : [0, 0, -2.05];
    const endL = nar ? [0, 0, -3.4] : [0, 0.4, -3.4];
    const cl = v3(lowL).lerp(v3(topL), up).lerp(v3(endL), push);
    let fov = nar ? 54 : 38;
    camera.up.set(0, 1, 0);
    const fc = fl > 0 ? flatCam() : null;
    if (fc) { // PC はゴールが上 → 右へ 1/4 回る。スマホは最初からゴールが右
      cp.lerp(v3(fc.pos), fl); cl.lerp(v3(fc.look), fl);
      camera.up.copy((nar ? UP_X.clone() : new THREE.Vector3(0, 0, -1)).lerp(UP_X, fl).normalize());
      fov = lerp(fov, FOV_F, fl);
    }
    /* 62本目: ヒーローの盤を左へ小さく寄せたので、真上のカメラが高くなる（PC 約136m・SP 約197m）。遠くの面 90m のままだと盤が切れて消えるので、倒す分だけ遠くの面を伸ばす */
    const near = fc ? lerp(0.05, fc.pos[1] * 0.5, fl) : 0.05, far = fc ? lerp(90, fc.pos[1] + 30, fl) : 90;
    if (camera.fov !== fov || camera.near !== near || camera.far !== far) { camera.fov = fov; camera.near = near; camera.far = far; camera.updateProjectionMatrix(); }
    camera.position.copy(cp); camera.lookAt(cl);
    scene.fog.near = lerp(fogN, 300, fl); scene.fog.far = lerp(fogF, 420, fl);
    scene.background.copy(BG0).lerp(BG1, fl);
    floorM.opacity = 1 - easeInOut(prog(t, F0 + 0.15, F1)); floor.visible = floorM.opacity > 0.001; // 木目を消して紺の盤へ
    LN.mat.opacity = 1 - 0.68 * fl;

    drawCourt(t);
    placeTokens(t, u);
    const [bx, by, bz, rot] = ballAt(u);
    const bs = 1 - easeInOut(prog(t, F0, F0 + 0.45));
    ball.visible = t >= DROP_O(0) + 0.22 && bs > 0.001;
    ball.scale.setScalar(Math.max(bs, 0.001));
    ball.position.set(bx, by, bz); ball.rotation.set(rot * 2.2, rot * 0.7, rot * 0.4);
    const sw = Math.max(0, 1 - Math.abs(u - T_IN - 0.06) * 5);
    net.scale.set(1 - 0.15 * sw, 1 + 0.25 * sw, 1 - 0.15 * sw);
    rim.position.y = RIM.y - 0.03 * Math.max(0, 1 - Math.abs(u - T_IN) / 0.12); // ダンクでリングがしなる

    drawInk(u, 1 - 0.6 * Math.max(prog(t, T_NAME, T_NAME + 0.5), fl));
    renderer.render(scene, camera);

    // セット名と今の局面（作戦ボードの見出し）
    setBox.style.opacity = Math.min(prog(t, 1.9, 2.2), 1 - prog(t, T_NAME - 0.1, T_NAME + 0.2));
    let ph = ''; for (const [a, s] of PHASES) if (u >= a) ph = s;
    if (phase.textContent !== ph) phase.textContent = ph;

    flash.style.opacity = Math.max(0, 1 - Math.abs(u - T_IN - 0.02) / 0.18) * 0.55;
    // 名前: ハレルヤ（大・ポンと出る）＋Be a baller Hallelujah（小）→ 盤と一緒にヒーローの見出しの位置・大きさへ
    chars.forEach((c, i) => { const k = easeOut(prog(t, T_NAME + i * 0.02, T_NAME + i * 0.02 + 0.22)); c.style.opacity = k; c.style.transform = k < 1 ? `translateY(${(1 - k) * 0.5}em) scale(${1 + (1 - k) * 0.25})` : ''; });
    sub.style.opacity = prog(t, T_NAME + 0.12, T_NAME + 0.4);
    name.style.transform = 'translateY(-50%)';
    const fk = easeInOut(prog(t, 4.95, F1));
    fly(nb, hJa, fk); fly(sub, hEn, fk);
    nb.style.textShadow = fk > 0 ? `0 .04em 0 rgba(0,0,0,${(0.35 * (1 - fk)).toFixed(3)}),0 0 .5em rgba(0,0,0,${(0.55 * (1 - fk)).toFixed(3)})` : '';
    name.style.opacity = 1 - xk;
    const nk = prog(t, T_NAME, T_NAME + 0.55) * (1 - fl);
    lay.style.background = `radial-gradient(120% 70% at 50% 50%, rgba(4,6,7,${0.62 * nk}), rgba(4,6,7,${0.3 * nk}))`;
    // 最後: 3D を透かす → 下のヒーロー（同じ盤・同じ見出しの位置）がそのまま見える。暗転しない
    cv.style.opacity = xk > 0 ? String(1 - xk) : '';
    el.style.background = xk > 0 ? `rgba(5,5,5,${(1 - xk).toFixed(3)})` : '';
    // 70本目「写真の後ろにコート」: 透かしの間も 3D の盤を写真の上に描かない（写真の矩形だけ canvas を抜く。下には同じ位置の SVG の盤がある）
    if (xk > 0 && hPh) {
      const r = hPh.getBoundingClientRect(), c = cv.getBoundingClientRect(), W = c.width, H = c.height;
      const x0 = (r.left - c.left).toFixed(1), y0 = (r.top - c.top).toFixed(1), x1 = (r.right - c.left).toFixed(1), y1 = (r.bottom - c.top).toFixed(1);
      // 76本目: 盤が大きくなり区画の外へ出るので、3D も下の SVG と同じ範囲（ヒーローの中・ヘッダーの下）だけ見せる
      const hr = hHero.getBoundingClientRect(), hb = hHdr ? hHdr.getBoundingClientRect().bottom : 0;
      const bx0 = (hr.left - c.left).toFixed(1), bx1 = (hr.right - c.left).toFixed(1), by0 = (Math.max(hr.top, hb) - c.top).toFixed(1), by1 = (hr.bottom - c.top).toFixed(1);
      const m = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><path fill-rule='evenodd' d='M${bx0} ${by0}H${bx1}V${by1}H${bx0}Z M${x0} ${y0}H${x1}V${y1}H${x0}Z'/></svg>`)}")`;
      cv.style.webkitMaskImage = cv.style.maskImage = m; cv.style.webkitMaskSize = cv.style.maskSize = '100% 100%';
    } else if (cv.style.maskImage) cv.style.webkitMaskImage = cv.style.maskImage = '';
    if (vig) vig.style.opacity = fl > 0 ? String(1 - fl) : '';
    if (grain) grain.style.opacity = fl > 0 ? String(0.09 * (1 - fl)) : '';
  }
  return { render, resize };
}
