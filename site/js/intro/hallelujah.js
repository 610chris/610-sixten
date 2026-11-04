/* ハレルヤ個人ページのオープニング（2026-11-04 初版 → 2026-11-05 作り直し）
   ミネソタ風の配色（ターゲット・センターのコア・コート: 木の地＋ミッドナイトブルーのペイント/外周/センターサークル＋白ライン。ロゴ・文字なし）
   床すれすれを流す → 俯瞰 → 床にマーカーで作戦図（ホーンズからのピック＆ロール）
   → その図の通りに 5対5（ウルブス開幕戦の先発 #5 #0 #3 #30 #27 と相手5人）が動く → ゴベアがロールしてアリウープ → HALLELUJAH
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる */
import { runIntro, prog, easeOut, easeInOut, rand, loadTex } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const DUR = 5.7;
const T_UP = 1.1;      // カメラが上がり始める
const T_TOP = 2.3;     // 俯瞰に着く
const T_SCR = 2.45;    // ゴベアがスクリーンに上がる
const T_DRV = 2.78;    // エドワーズがスクリーンを使ってドライブ
const T_PASS = 3.32;   // ロールするゴベアへロブパス
const T_CATCH = 3.6;   // キャッチ
const T_IN = 3.86;     // ダンク（リングを通る）
const T_NAME = 3.95;   // 名前
const NAVY = '#0c2340', LAKE = '#236192', GREEN = '#78be20', CHALK = '#f6f2ea', CORAL = '#ff6b5a';

/* 床の大きさ（m）: コートは 15×14 の半面。外側に余白 */
const FW = 19, FD = 16;
const RIM = { x: 0, y: 3.05, z: -7 + 1.575 };

runIntro({ key: 'hallelujah', duration: DUR, gl: true, setup });

/* m → 床テクスチャの px（キャンバス上端 = 奥 z=-8） */
const toPx = (W, H) => (x, z) => [(x + FW / 2) / FW * W, (z + FD / 2) / FD * H];

/* 木目のコート（メープル材の板・継ぎ目・木目）＋ミッドナイトブルーの塗り分け＋白ライン */
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
  const paint = 'rgba(12,35,64,.93)'; // ミッドナイトブルー（木目がうっすら透ける塗装）
  // コートの外周（サイドライン・ベースラインの外）はミッドナイトブルーの太い帯
  const [cx0, cz0] = P(-7.5, -7), [cx1, cz1] = P(7.5, 7);
  g.fillStyle = paint;
  g.fillRect(0, 0, W, cz0); g.fillRect(0, cz1, W, H - cz1); g.fillRect(0, cz0, cx0, cz1 - cz0); g.fillRect(cx1, cz0, W - cx1, cz1 - cz0);
  // ペイントエリア（ミッドナイトブルー）
  const [kx0, kz0] = P(-2.45, -7), [kx1, kz1] = P(2.45, -7 + 5.8);
  g.fillRect(kx0, kz0, kx1 - kx0, kz1 - kz0);
  // センターサークル（ミッドナイトブルーの円・ロゴなし）
  { const [px, py] = P(0, 7); g.beginPath(); g.arc(px, py, 1.8 * m, Math.PI, Math.PI * 2); g.closePath(); g.fill(); }
  // ライン（白・5cm）
  g.strokeStyle = 'rgba(250,248,240,.95)'; g.lineWidth = 0.05 * m; g.lineCap = 'butt';
  const line = (pts) => { g.beginPath(); pts.forEach(([x, z], i) => { const [px, py] = P(x, z); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); };
  const arc = (x, z, r, a0, a1) => { const [px, py] = P(x, z); g.beginPath(); g.arc(px, py, r * m, a0, a1); g.stroke(); };
  g.strokeRect(cx0, cz0, cx1 - cx0, cz1 - cz0);
  g.strokeRect(kx0, kz0, kx1 - kx0, kz1 - kz0);
  arc(0, -7 + 5.8, 1.8, 0, Math.PI);
  g.setLineDash([0.3 * m, 0.25 * m]); arc(0, -7 + 5.8, 1.8, Math.PI, Math.PI * 2); g.setLineDash([]);
  arc(RIM.x, RIM.z, 1.25, 0, Math.PI);
  const zc = RIM.z + Math.sqrt(6.75 * 6.75 - 6.6 * 6.6);
  line([[-6.6, -7], [-6.6, zc]]); line([[6.6, -7], [6.6, zc]]);
  const [rx, rz] = P(RIM.x, RIM.z); g.beginPath(); g.arc(rx, rz, 6.75 * m, Math.atan2(zc - RIM.z, 6.6), Math.atan2(zc - RIM.z, -6.6)); g.stroke();
  arc(0, 7, 1.8, Math.PI, Math.PI * 2);
  // コート中央寄りに薄く S5 の文字（ミッドナイトブルー）
  g.save(); const [lx, lz] = P(0, 4.6); g.translate(lx, lz);
  g.font = `${0.62 * m}px "Archivo Black", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(12,35,64,.42)'; g.fillText('STARTING 5IVE', 0, 0); g.restore();
  return c;
}

/* ---------- 作戦: ホーンズ → ピック＆ロール（m 座標・x=左右 / z=奥がゴール） ---------- */
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

/* 動きの区間 [開始, 終了, 折れ線]。区間の外は直前の位置で止まる */
const SCREEN = [0.66, 1.3];
const MOVES = {
  // オフェンス（ホーンズの並び: 1番トップ・両エルボーにビッグ・両コーナー）
  edw: [[T_DRV, T_PASS + 0.05, [[0, 2.35], [1.15, 2.05], [2.05, 1.0], [2.5, -0.55]]]],
  gob: [[T_SCR, T_DRV - 0.02, [[2.45, -1.2], [1.7, 0.2], SCREEN]], [T_DRV + 0.14, T_CATCH, [SCREEN, [1.25, 0.1], [0.95, -2.3], [0.42, -4.3]]], [T_CATCH, T_IN - 0.06, [[0.42, -4.3], [0.16, -4.95]]]],
  ran: [[T_SCR + 0.05, T_DRV + 0.25, [[-2.45, -1.2], [-2.85, 0.3], [-3.15, 1.95]]]],
  div: [[T_DRV + 0.2, T_PASS + 0.1, [[6.95, -6.2], [6.9, -5.55]]]],
  mcd: [[T_DRV + 0.3, T_PASS + 0.15, [[-6.95, -6.2], [-6.95, -5.7]]]],
  // ディフェンス
  x5: [[T_DRV, T_DRV + 0.24, [[0, 1.4], [0.42, 1.55]]], [T_DRV + 0.36, T_PASS + 0.25, [[0.42, 1.55], [0.85, 2.1], [1.75, 1.15], [2.05, -0.2]]]],
  x27: [[T_SCR + 0.05, T_DRV + 0.05, [[1.9, -2.1], [1.15, -0.25]]], [T_DRV + 0.12, T_PASS, [[1.15, -0.25], [1.85, -0.7]]], [T_PASS + 0.05, T_IN - 0.05, [[1.85, -0.7], [1.05, -2.9], [0.78, -4.25]]]],
  x30: [[T_SCR + 0.1, T_DRV + 0.3, [[-1.9, -2.1], [-2.4, -0.3], [-2.55, 1.25]]]],
  x0: [[T_DRV + 0.15, T_PASS + 0.1, [[5.9, -5.6], [5.45, -5.05]]]],
  x3: [[T_PASS - 0.05, T_IN - 0.02, [[-5.9, -5.6], [-3.1, -5.1], [-0.75, -4.75]]]],
};
const SMOOTHED = Object.fromEntries(Object.entries(MOVES).map(([k, segs]) => [k, segs.map(([a, b, pts]) => [a, b, smooth(pts)])]));
function posOf(key, t) {
  const segs = SMOOTHED[key]; let p = segs[0][2][0];
  for (const [a, b, pts] of segs) { if (t < a) return p; p = along(pts, easeInOut(prog(t, a, b))); }
  return p;
}
/* 背番号は 2025-26 開幕戦（10/22 @POR）の先発 = NBA公式スコアシート */
const OFF = [
  { key: 'edw', num: '5', h: 1.93 }, { key: 'div', num: '0', h: 1.93 }, { key: 'mcd', num: '3', h: 2.06 },
  { key: 'ran', num: '30', h: 2.03 }, { key: 'gob', num: '27', h: 2.16 },
];
const DEF = [
  { key: 'x5', man: 'edw', h: 1.95 }, { key: 'x0', man: 'div', h: 1.96 }, { key: 'x3', man: 'mcd', h: 2.01 },
  { key: 'x30', man: 'ran', h: 2.05 }, { key: 'x27', man: 'gob', h: 2.12 },
];

async function setup(ctx) {
  const THREE = ctx.THREE;
  const { renderer, el, lay } = ctx;
  const R = rand(5150);
  const base = new URL('../../assets/s5/intro/', import.meta.url).href;
  try { await Promise.race([document.fonts.load('400 60px "Archivo Black"', 'HALLELUJAH 0123579'), new Promise((r) => setTimeout(r, 900))]); } catch (e) { /* 代わりの書体 */ }
  const ballTex = await Promise.race([
    Promise.all([loadTex(THREE, base + 'ball_albedo.webp'), loadTex(THREE, base + 'ball_normal.webp', false), loadTex(THREE, base + 'ball_rough.webp', false)]).catch(() => null),
    new Promise((r) => setTimeout(() => r(null), 1400)),
  ]);

  lay.innerHTML = '<div class="hl3-flash"></div><div class="hl3-name"><b>' + [...'HALLELUJAH'].map((ch) => '<i>' + ch + '</i>').join('') + '</b><span>NIHON TENGUS&nbsp;&nbsp;/&nbsp;&nbsp;HEAD COACH</span></div>';
  const st = document.createElement('style');
  st.textContent = `
    .hl3-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,250,235,.9),rgba(255,250,235,0) 55%);opacity:0}
    .hl3-name{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;color:#f6f2ea}
    .hl3-name b{display:block;font-family:"Archivo Black",sans-serif;font-weight:400;font-size:min(10.5vw,19vh);white-space:nowrap;line-height:.9;letter-spacing:.02em;text-shadow:0 .04em 0 rgba(0,0,0,.35),0 0 .5em rgba(0,0,0,.55)}
    .hl3-name i{display:inline-block;font-style:normal}
    .hl3-name span{display:block;margin-top:1.4vh;font-family:"Archivo Black",sans-serif;font-size:max(11px,min(1.7vw,2.4vh));letter-spacing:.34em;color:${GREEN};opacity:0}`;
  el.appendChild(st);
  const flash = lay.querySelector('.hl3-flash'), name = lay.querySelector('.hl3-name'), chars = [...name.querySelectorAll('i')], sub = name.querySelector('span');

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

  /* 作戦を書く層（床の少し上・マーカーの線） */
  const ink = document.createElement('canvas'); ink.width = 1536; ink.height = Math.round(1536 * FD / FW);
  const ig = ink.getContext('2d'), IP = toPx(ink.width, ink.height), im = ink.width / FW;
  const inkT = new THREE.CanvasTexture(ink); inkT.colorSpace = THREE.SRGBColorSpace; inkT.anisotropy = 8;
  const inkM = new THREE.MeshBasicMaterial({ map: inkT, transparent: true, depthWrite: false, toneMapped: false });
  const inkPlane = new THREE.Mesh(new THREE.PlaneGeometry(FW, FD), inkM);
  inkPlane.rotation.x = -Math.PI / 2; inkPlane.position.y = 0.004; scene.add(inkPlane);
  const wob = (seed) => { const r = rand(seed); const a = r() * 6, b = r() * 6; return (s) => 0.035 * Math.sin(s * 7 + a) + 0.02 * Math.sin(s * 17 + b); };

  function stroke(pts, k, color, opt = {}) {
    if (k <= 0) return;
    const n = Math.max(2, Math.ceil(pts.length * k)), w = wob(opt.seed || 1);
    ig.save();
    ig.strokeStyle = color; ig.lineWidth = (opt.w || 0.1) * im; ig.lineCap = 'round'; ig.lineJoin = 'round';
    ig.shadowColor = color; ig.shadowBlur = 0.12 * im;
    if (opt.dash) ig.setLineDash([0.28 * im, 0.2 * im]);
    ig.beginPath();
    let last = null, prev = null;
    for (let i = 0; i < n; i++) {
      const f = i / (pts.length - 1), q = pts[Math.min(i, pts.length - 1)];
      let [x, z] = q;
      if (opt.zig) { const nx = pts[Math.min(i + 1, pts.length - 1)], pv = pts[Math.max(i - 1, 0)]; const dx = nx[0] - pv[0], dz = nx[1] - pv[1], L = Math.hypot(dx, dz) || 1; const o = Math.sin(f * 40) * 0.16; x += -dz / L * o; z += dx / L * o; }
      x += w(f * 3); z += w(f * 3 + 9);
      const [px, py] = IP(x, z);
      i ? ig.lineTo(px, py) : ig.moveTo(px, py);
      prev = last; last = [px, py];
    }
    ig.stroke(); ig.setLineDash([]);
    if (k >= 1 && prev && opt.arrow) {
      const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]), s = 0.34 * im;
      ig.beginPath(); ig.moveTo(last[0] - Math.cos(a - 0.5) * s, last[1] - Math.sin(a - 0.5) * s); ig.lineTo(last[0], last[1]); ig.lineTo(last[0] - Math.cos(a + 0.5) * s, last[1] - Math.sin(a + 0.5) * s); ig.stroke();
    }
    if (k >= 1 && prev && opt.screen) { const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]) + Math.PI / 2, s = 0.32 * im; ig.beginPath(); ig.moveTo(last[0] - Math.cos(a) * s, last[1] - Math.sin(a) * s); ig.lineTo(last[0] + Math.cos(a) * s, last[1] + Math.sin(a) * s); ig.stroke(); }
    ig.restore();
  }
  // 作戦図の O は人の足元より少し手前（カメラ側）にずらし、背番号のラベルが人に隠れないようにする
  const LBL = 0.62;
  function piece([x, z], kind, label, k) {
    if (k <= 0) return;
    const [px, py] = IP(x, z + (kind === 'o' ? LBL : 0)), r = 0.34 * im;
    ig.save(); ig.globalAlpha = Math.min(1, k * 1.5); ig.lineWidth = 0.08 * im; ig.lineCap = 'round';
    if (kind === 'o') {
      ig.strokeStyle = GREEN; ig.shadowColor = GREEN; ig.shadowBlur = 0.1 * im; ig.fillStyle = 'rgba(6,16,30,.6)';
      ig.beginPath(); ig.arc(px, py, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * Math.min(1, k * 1.3)); ig.fill(); ig.stroke();
      ig.fillStyle = '#f2ffe6'; ig.shadowBlur = 0; ig.font = `${(label.length > 1 ? 0.34 : 0.42) * im}px "Archivo Black", sans-serif`; ig.textAlign = 'center'; ig.textBaseline = 'middle'; ig.fillText(label, px, py + 0.02 * im);
    } else {
      ig.strokeStyle = CORAL; ig.shadowColor = CORAL; ig.shadowBlur = 0.1 * im; const s = r * 0.62 * Math.min(1, k * 1.4);
      ig.beginPath(); ig.moveTo(px - s, py - s); ig.lineTo(px + s, py + s); ig.moveTo(px + s, py - s); ig.lineTo(px - s, py + s); ig.stroke();
    }
    ig.restore();
  }
  const M = MOVES;
  const P_SCR = smooth(M.gob[0][2]), P_ROLL = smooth(M.gob[1][2].concat([[0.16, -4.95]])), P_DRV = smooth(M.edw[0][2]), P_POP = smooth(M.ran[0][2]);
  const P_PASS = smooth([[2.5, -0.55], [1.6, -2.6], [0.42, -4.3]]);
  let lastKey = '';
  function drawInk(t) {
    const kPc = prog(t, 1.0, 1.5), kS = easeInOut(prog(t, 1.5, 1.8)), kD = easeInOut(prog(t, 1.72, 2.1)), kR = easeInOut(prog(t, 1.95, 2.3)), kO = easeInOut(prog(t, 1.85, 2.15)), kP = prog(t, 2.2, 2.45);
    const fade = 1 - 0.6 * prog(t, T_NAME, T_NAME + 0.5);
    const key = [kPc, kS, kD, kR, kO, kP, fade].map((v) => v.toFixed(3)).join();
    if (key === lastKey) return; lastKey = key;
    ig.clearRect(0, 0, ink.width, ink.height);
    inkM.opacity = fade;
    stroke(P_SCR, kS, CHALK, { screen: true, seed: 11, w: 0.09 });
    stroke(P_DRV, kD, GREEN, { zig: true, arrow: true, seed: 3, w: 0.09 });
    stroke(P_POP, kO, '#5aa7e0', { arrow: true, seed: 9, w: 0.08 });
    stroke(P_ROLL, kR, GREEN, { arrow: true, seed: 7, w: 0.09 });
    stroke(P_PASS, kP, CHALK, { dash: true, arrow: true, seed: 5, w: 0.08 });
    OFF.forEach((o, i) => piece(SMOOTHED[o.key][0][2][0], 'o', o.num, kPc - i * 0.06));
    DEF.forEach((d, i) => piece(SMOOTHED[d.key][0][2][0], 'x', '', kPc - 0.15 - i * 0.05));
    inkT.needsUpdate = true;
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

  /* ---------- 選手（シンプルな立体の人形・ユニフォームだけ色と番号） ---------- */
  function jerseyTex(num, body, side, trim) {
    const c = document.createElement('canvas'); c.width = 512; c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = body; g.fillRect(0, 0, 512, 256);
    g.fillStyle = side; for (const u of [0.25, 0.75]) g.fillRect(u * 512 - 26, 40, 52, 216); // 脇のパネル
    g.fillStyle = trim; g.fillRect(0, 0, 512, 14); g.fillRect(0, 242, 512, 14);               // 襟ぐり・裾のパイピング
    if (num) {
      g.font = `${num.length > 1 ? 118 : 138}px "Archivo Black", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.lineJoin = 'round'; g.lineWidth = 14; g.strokeStyle = side; g.fillStyle = '#ffffff';
      for (const cx of [0, 256, 512]) { g.strokeText(num, cx, 140); g.fillText(num, cx, 140); } // 前と背中（u=0 と 0.5）
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
  }
  const G = {
    leg: new THREE.CapsuleGeometry(0.075, 0.66, 4, 10), arm: new THREE.CapsuleGeometry(0.055, 0.5, 4, 10),
    torso: new THREE.CylinderGeometry(0.235, 0.2, 0.62, 28, 1, false), shorts: new THREE.CylinderGeometry(0.2, 0.2, 0.3, 24),
    head: new THREE.SphereGeometry(0.115, 24, 16), neck: new THREE.CylinderGeometry(0.055, 0.06, 0.1, 12), shoe: new THREE.BoxGeometry(0.11, 0.07, 0.27),
  };
  const skinM = new THREE.MeshPhysicalMaterial({ color: 0x8d939b, roughness: 0.45, metalness: 0.05, clearcoat: 0.4, clearcoatRoughness: 0.3 }); // マネキン調（人種を描かない）
  function makePlayer(team, num, h) {
    const off = team === 'o';
    const jM = new THREE.MeshStandardMaterial({ map: jerseyTex(num, off ? NAVY : '#7a2026', off ? LAKE : '#b9b4ab', off ? GREEN : '#f0ece4'), roughness: 0.7 });
    const sM = new THREE.MeshStandardMaterial({ color: off ? NAVY : '#7a2026', roughness: 0.72 });
    const shoeM = new THREE.MeshStandardMaterial({ color: off ? 0x9be04a : 0xefefea, roughness: 0.5 });
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
    const add = (geo, mat, x, y, z, parent = body) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
    const legs = [-1, 1].map((s) => { const p = new THREE.Group(); p.position.set(0.1 * s, 0.86, 0); body.add(p); add(G.leg, skinM, 0, -0.42, 0, p); add(G.shoe, shoeM, 0, -0.82, -0.04, p); return p; });
    add(G.shorts, sM, 0, 0.88, 0);
    const torso = add(G.torso, jM, 0, 1.33, 0); torso.scale.set(1.18, 1, 0.78);
    add(G.neck, skinM, 0, 1.68, 0); add(G.head, skinM, 0, 1.8, 0);
    const arms = [-1, 1].map((s) => { const p = new THREE.Group(); p.position.set(0.3 * s, 1.58, 0); body.add(p); add(G.arm, skinM, 0, -0.3, 0, p); return p; });
    root.scale.setScalar(h / 1.95);
    scene.add(root);
    return { root, body, legs, arms };
  }
  const players = {};
  OFF.forEach((o) => { players[o.key] = { ...o, team: 'o', fig: makePlayer('o', o.num, o.h) }; });
  DEF.forEach((d) => { players[d.key] = { ...d, team: 'x', fig: makePlayer('x', '', d.h) }; });

  const yawTo = (from, to) => Math.atan2(-(to[0] - from[0]), -(to[1] - from[1]));
  function pose(t) {
    for (const k in players) {
      const p = players[k], f = p.fig, [x, z] = posOf(k, t);
      const a = posOf(k, t - 0.03), b = posOf(k, t + 0.03), sp = Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.06;
      // 向き: オフェンスはゴール（スクリーン中のゴベアは相手、ドライブ中のエドワーズは進行方向）／ディフェンスはマーク相手
      let look = [RIM.x, RIM.z];
      if (p.team === 'x') look = k === 'x3' && t > T_PASS ? posOf('gob', t) : posOf(p.man, t);
      if (k === 'gob' && t > T_SCR && t < T_DRV + 0.14) look = posOf('x5', t);
      if (k === 'edw' && t > T_DRV + 0.1 && t < T_PASS) look = [b[0] + (b[0] - a[0]) * 20, b[1] + (b[1] - a[1]) * 20];
      f.root.position.set(x, 0, z);
      f.root.rotation.y = yawTo([x, z], look);
      // 歩き・走り（脚と腕を振る）。止まっている時は小さく構える
      const run = Math.min(1, sp / 3.5), ph = t * (8 + sp * 1.5) + (k.length * 1.7);
      const sw = Math.sin(ph) * 0.75 * run;
      const stance = p.team === 'x' ? 1 : 0.35;
      f.legs[0].rotation.x = sw; f.legs[1].rotation.x = -sw;
      f.legs[0].rotation.z = -0.1 * stance * (1 - run); f.legs[1].rotation.z = 0.1 * stance * (1 - run);
      f.arms[0].rotation.x = -sw * 0.8; f.arms[1].rotation.x = sw * 0.8;
      let armOut = p.team === 'x' ? 0.55 * (1 - run * 0.6) : 0.12;
      let armUp = 0, jump = 0, crouch = (1 - run) * 0.05 * stance + Math.abs(Math.sin(ph)) * 0.04 * run;
      // ボール持ちの右腕（ドリブル）
      if (k === 'edw' && t < T_PASS + 0.05) f.arms[1].rotation.x = -0.5 + 0.25 * Math.sin(t * 16);
      if (k === 'edw' && t >= T_PASS - 0.06 && t < T_PASS + 0.3) { const q = Math.sin(prog(t, T_PASS - 0.06, T_PASS + 0.3) * Math.PI); f.arms[0].rotation.x = f.arms[1].rotation.x = -2.2 * q; }
      // ゴベア: キャッチ→跳んでダンク
      if (k === 'gob') {
        const up = prog(t, T_CATCH - 0.1, T_CATCH + 0.05);
        if (t > T_CATCH - 0.1) armUp = up;
        const jk = prog(t, T_CATCH + 0.02, T_IN + 0.32);
        jump = Math.sin(jk * Math.PI) * 0.78;
        if (t > T_IN + 0.32) armUp = 1 - prog(t, T_IN + 0.32, T_IN + 0.7);
      }
      // 手を上げて飛び込むヘルプ（3番のマーク・ゴベアのマーク）
      if ((k === 'x3' || k === 'x27') && t > T_CATCH - 0.05) { armUp = prog(t, T_CATCH - 0.05, T_CATCH + 0.15) * 0.85; jump = Math.sin(prog(t, T_CATCH + 0.02, T_IN + 0.2) * Math.PI) * (k === 'x3' ? 0.45 : 0.3); }
      // スクリーンに当たった5番のマークは一瞬止まって弾かれる
      if (k === 'x5') { const hit = Math.max(0, 1 - Math.abs(t - (T_DRV + 0.27)) / 0.12); f.root.rotation.z = 0.12 * hit; f.root.position.x -= 0.08 * hit; }
      if (armUp > 0) { f.arms[0].rotation.x = f.arms[1].rotation.x = -2.9 * armUp; armOut *= 1 - armUp; }
      f.arms[0].rotation.z = -armOut; f.arms[1].rotation.z = armOut;
      f.body.position.y = jump - crouch;
      f.legs[0].rotation.x += jump > 0.05 ? 0.25 : 0; f.legs[1].rotation.x -= jump > 0.05 ? 0.35 : 0;
    }
  }

  /* ボール */
  const BR = 0.135; // 実寸より少し大きく（俯瞰でも見えるように）
  const ballM = ballTex
    ? new THREE.MeshStandardMaterial({ map: ballTex[0], normalMap: ballTex[1], roughnessMap: ballTex[2], roughness: 1, metalness: 0 })
    : new THREE.MeshStandardMaterial({ color: 0xd4561c, roughness: 0.75 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BR, 48, 32), ballM); ball.castShadow = true; scene.add(ball);

  // 体の右手側（向きに対して）の床の位置
  function handSide(key, t, side = 0.32, fwd = 0.22) {
    const [x, z] = posOf(key, t), yaw = players[key].fig.root.rotation.y;
    const fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    return [x + fx * fwd + rx * side, z + fz * fwd + rz * side];
  }
  function ballAt(t) {
    if (t < T_PASS) { // エドワーズのドリブル（その場→ドライブ）
      const [x, z] = handSide('edw', t), ph = t * (t < T_DRV ? 2.4 : 3.2);
      return [x, BR + Math.abs(Math.sin(ph * Math.PI)) * 0.82, z, t * 3];
    }
    const A = handSide('edw', T_PASS, 0.15, 0.35);
    const g = posOf('gob', T_CATCH), hy = 2.16 / 1.95 * 2.35;
    if (t < T_CATCH) { // 浮かせたロブ（ディフェンスの頭の上）
      const k = prog(t, T_PASS, T_CATCH);
      return [lerp(A[0], g[0], k), lerp(1.75, hy, k) + Math.sin(k * Math.PI) * 1.0, lerp(A[1], g[1] - 0.15, k), 6 + k * 4];
    }
    if (t < T_IN) { // 空中でつかんでリングへ叩き込む
      const k = easeInOut(prog(t, T_CATCH, T_IN));
      const jy = Math.sin(prog(t, T_CATCH + 0.02, T_IN + 0.32) * Math.PI) * 0.78;
      return [lerp(g[0], RIM.x, k), lerp(hy, RIM.y + 0.32, k) + jy * (1 - k), lerp(g[1] - 0.15, RIM.z + 0.02, k), 10 + k * 2];
    }
    const k = t - T_IN; // リングを抜けて床へ
    const y0 = RIM.y + 0.32, y = y0 - 5 * k * k - 3 * k;
    if (y > BR) return [RIM.x, y, RIM.z + 0.02 + k * 0.5, 12 + k * 2];
    const tl = (-3 + Math.sqrt(9 + 20 * (y0 - BR))) / 10, kk = k - tl;
    return [RIM.x, BR + Math.abs(Math.sin(kk * 4.5)) * 1.0 * Math.exp(-kk * 2.5), RIM.z + 0.02 + k * 0.5, 12 + k * 2];
  }

  let aspect = 1, nar = false;
  function resize() {
    aspect = innerWidth / innerHeight; nar = aspect < 0.8;
    camera.aspect = aspect; camera.fov = nar ? 54 : 38; camera.updateProjectionMatrix();
    scene.fog.near = nar ? 22 : 13; scene.fog.far = nar ? 44 : 30;
  }
  resize();
  const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  function render(t) {
    /* カメラ: 床すれすれを横に流す → 上がって俯瞰 → リングへ少し寄る
       縦長（スマホ）は俯瞰をサイドライン側から撮る（コートの横幅15mを画面の縦に入れる） */
    const lk = easeInOut(prog(t, 0, T_UP));
    const low = [lerp(6.6, 4.5, lk), 0.36, lerp(3.8, 2.5, lk)];
    const top = nar ? [8.4, 19.6, -1.9] : [0, 15.0, 6.6];
    const end = nar ? [6.6, 14.0, -3.4] : [0, 10.8, 3.2];
    const up = easeInOut(prog(t, T_UP, T_TOP)), push = easeInOut(prog(t, T_CATCH - 0.45, DUR));
    const cp = v3(low).lerp(v3(top), up).lerp(v3(end), push);
    const lowL = nar ? [lerp(1.2, 0.6, lk), 0.9, -2.6] : [lerp(-1.2, -0.2, lk), 0.9, -3.2];
    const topL = nar ? [0, 0, -1.9] : [0, 0, -2.05];
    const endL = nar ? [0, 0.8, -4.0] : [0, 0.6, -3.7];
    const cl = v3(lowL).lerp(v3(topL), up).lerp(v3(endL), push);
    camera.position.copy(cp); camera.lookAt(cl);

    pose(t);
    const [bx, by, bz, rot] = ballAt(t);
    ball.position.set(bx, by, bz); ball.rotation.set(rot * 2.2, rot * 0.7, rot * 0.4);
    const sw = Math.max(0, 1 - Math.abs(t - T_IN - 0.06) * 5);
    net.scale.set(1 - 0.15 * sw, 1 + 0.25 * sw, 1 - 0.15 * sw);
    rim.position.y = RIM.y - 0.03 * Math.max(0, 1 - Math.abs(t - T_IN) / 0.12); // ダンクでリングがしなる

    drawInk(t);
    renderer.render(scene, camera);

    flash.style.opacity = Math.max(0, 1 - Math.abs(t - T_IN - 0.02) / 0.18) * 0.55;
    const nk = prog(t, T_NAME, T_NAME + 0.55);
    chars.forEach((c, i) => { const k = easeOut(prog(t, T_NAME + i * 0.045, T_NAME + i * 0.045 + 0.4)); c.style.opacity = k; c.style.transform = `translateY(${(1 - k) * 0.5}em) scale(${1 + (1 - k) * 0.25})`; });
    sub.style.opacity = prog(t, T_NAME + 0.45, T_NAME + 0.8);
    name.style.transform = `translateY(-50%) scale(${1.04 - 0.04 * easeOut(prog(t, T_NAME, DUR))})`;
    lay.style.background = `radial-gradient(120% 70% at 50% 50%, rgba(4,6,7,${0.62 * nk}), rgba(4,6,7,${0.3 * nk}))`;
  }
  return { render, resize };
}
