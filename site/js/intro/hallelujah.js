/* ハレルヤ個人ページのオープニング（2026-11-04）
   本物の木目のコート（ニス光沢・照明の映り込み）を床すれすれに流す → カメラが上がって俯瞰
   → 床にマーカーで作戦が書かれていく → 本物のボールがその通りにドリブル→パス→レイアップでリングへ → HALLELUJAH
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる */
import { runIntro, prog, easeOut, easeIn, easeInOut, rand, loadTex } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const DUR = 5.2;
const T_UP = 1.1;     // カメラが上がり始める
const T_TOP = 2.3;    // 俯瞰に着く
const T_PASS = 2.75;  // パス
const T_SHOT = 3.15;  // レイアップ
const T_IN = 3.55;    // リングを通る
const T_NAME = 3.6;   // 名前
const TEAL = '#2bb3ad', PINK = '#ff4f9a';

/* 床の大きさ（m）: コートは 15×14 の半面。外側に余白 */
const FW = 19, FD = 16;
const BASE_Z = -7, RIM = { x: 0, y: 3.05, z: -7 + 1.575 };

runIntro({ key: 'hallelujah', duration: DUR, gl: true, setup });

/* m → 床テクスチャの px（キャンバス上端 = 奥 z=-8） */
const toPx = (W, H) => (x, z) => [(x + FW / 2) / FW * W, (z + FD / 2) / FD * H];

/* 木目のコート（メープル材の板・継ぎ目・木目・塗装ライン・ペイントエリア） */
function courtCanvas(R) {
  const W = 2048, H = Math.round(2048 * FD / FW);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const P = toPx(W, H), m = W / FW;
  const bw = 0.11 * m; // 板の幅
  for (let x = 0, i = 0; x < W; x += bw, i++) {
    let y = -R() * 2.5 * m;
    while (y < H) {
      const len = (1.6 + R() * 2.4) * m;
      const h = 31 + R() * 6, s = 42 + R() * 16, l = 58 + R() * 11;
      g.fillStyle = `hsl(${h},${s}%,${l}%)`;
      g.fillRect(x, y, bw + 1, len);
      // 木目（板の向きに沿って細い線が揺れながら走る）
      for (let k = 0; k < 7; k++) {
        const gx = x + R() * bw, amp = 0.6 + R() * 2.2, f = 0.004 + R() * 0.01, ph = R() * 6.28;
        g.strokeStyle = `hsla(${h - 4},${s + 10}%,${l - 18 - R() * 10}%,${0.12 + R() * 0.2})`;
        g.lineWidth = 0.6 + R() * 1.4;
        g.beginPath();
        for (let yy = y; yy <= y + len; yy += 10) { const xx = gx + Math.sin(yy * f + ph) * amp; yy === y ? g.moveTo(xx, yy) : g.lineTo(xx, yy); }
        g.stroke();
      }
      // 節（たまに）
      if (R() < 0.08) { g.fillStyle = `hsla(${h - 6},60%,${l - 30}%,.35)`; g.beginPath(); g.ellipse(x + bw / 2, y + R() * len, bw * 0.18, bw * 0.5, 0, 0, 6.28); g.fill(); }
      g.fillStyle = 'rgba(70,40,15,.35)'; g.fillRect(x, y, bw, 1.2); // 継ぎ目
      y += len;
    }
    g.fillStyle = 'rgba(70,40,15,.28)'; g.fillRect(x, 0, 1, H); // 板と板のすき間
  }
  // コートの外は少し濃いステイン
  const [cx0, cz0] = P(-7.5, -7), [cx1, cz1] = P(7.5, 7);
  g.fillStyle = 'rgba(90,40,10,.38)';
  g.fillRect(0, 0, W, cz0); g.fillRect(0, cz1, W, H - cz1); g.fillRect(0, cz0, cx0, cz1 - cz0); g.fillRect(cx1, cz0, W - cx1, cz1 - cz0);
  // ペイントエリア（ティール）
  const [kx0, kz0] = P(-2.45, -7), [kx1, kz1] = P(2.45, -7 + 5.8);
  g.fillStyle = 'rgba(18,110,106,.78)'; g.fillRect(kx0, kz0, kx1 - kx0, kz1 - kz0);
  // ライン（白・5cm）
  g.strokeStyle = 'rgba(250,248,240,.95)'; g.lineWidth = 0.05 * m; g.lineCap = 'butt';
  const line = (pts) => { g.beginPath(); pts.forEach(([x, z], i) => { const [px, py] = P(x, z); i ? g.lineTo(px, py) : g.moveTo(px, py); }); g.stroke(); };
  const arc = (x, z, r, a0, a1) => { const [px, py] = P(x, z); g.beginPath(); g.arc(px, py, r * m, a0, a1); g.stroke(); };
  g.strokeRect(cx0, cz0, cx1 - cx0, cz1 - cz0);
  g.strokeRect(kx0, kz0, kx1 - kx0, kz1 - kz0);
  arc(0, -7 + 5.8, 1.8, 0, Math.PI);                       // フリースローサークル（外側）
  g.setLineDash([0.3 * m, 0.25 * m]); arc(0, -7 + 5.8, 1.8, Math.PI, Math.PI * 2); g.setLineDash([]);
  arc(RIM.x, RIM.z, 1.25, 0, Math.PI);                     // 制限区域
  // 3P（コーナーは直線・サイドから0.9m）
  const zc = RIM.z + Math.sqrt(6.75 * 6.75 - 6.6 * 6.6);
  line([[-6.6, -7], [-6.6, zc]]); line([[6.6, -7], [6.6, zc]]);
  const [rx, rz] = P(RIM.x, RIM.z); g.beginPath(); g.arc(rx, rz, 6.75 * m, Math.atan2(zc - RIM.z, 6.6), Math.atan2(zc - RIM.z, -6.6)); g.stroke();
  arc(0, 7, 1.8, Math.PI, Math.PI * 2);                    // センターサークル（半分）
  // コート中央寄りに薄くロゴ文字（S5のティール）
  g.save(); const [lx, lz] = P(0, 4.6); g.translate(lx, lz);
  g.font = `${0.62 * m}px "Archivo Black", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(18,110,106,.55)'; g.fillText('STARTING 5IVE', 0, 0); g.restore();
  return c;
}

/* 作戦（m 座標）: 1番がドリブルで右ウイングへ／2番が左からカールでゴール下へ／パス→レイアップ */
const PLAY = {
  o1: [[0, 0.6], [1.2, -0.3], [2.4, -1.2], [3.3, -2.0]],
  o2: [[-5.6, -2.4], [-4.0, -2.0], [-2.4, -3.2], [-1.1, -4.4], [-0.35, -5.0]],
  o3: [[5.9, -6.2]],
  x1: [[0.1, -0.4], [2.6, -2.6]],
  x2: [[-4.9, -3.0], [-1.6, -4.0]],
  x3: [[5.2, -5.7], [4.6, -5.0]],
};
const lerp = (a, b, k) => a + (b - a) * k;
function along(pts, k) { // 折れ線上の位置（長さで等分）
  if (pts.length === 1) return pts[0];
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let s = Math.min(1, Math.max(0, k)) * L;
  for (let i = 0; i < seg.length; i++) { if (s <= seg[i] || i === seg.length - 1) { const f = seg[i] ? Math.min(1, s / seg[i]) : 0; return [lerp(pts[i][0], pts[i + 1][0], f), lerp(pts[i][1], pts[i + 1][1], f)]; } s -= seg[i]; }
  return pts[pts.length - 1];
}
function smooth(pts, n = 40) { // なめらかな曲線に（Catmull-Rom）
  if (pts.length < 3) { const o = []; for (let i = 0; i <= n; i++) o.push(along(pts, i / n)); return o; }
  const o = [], P = [pts[0], ...pts, pts[pts.length - 1]];
  for (let i = 1; i < P.length - 2; i++) for (let j = 0; j < n / (pts.length - 1); j++) {
    const t = j / (n / (pts.length - 1)), [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    o.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
  }
  o.push(pts[pts.length - 1]); return o;
}
const O1 = smooth(PLAY.o1), O2 = smooth(PLAY.o2);

async function setup(ctx) {
  const THREE = ctx.THREE;
  const { renderer, el, lay } = ctx;
  const R = rand(5150);
  const base = new URL('../../assets/s5/intro/', import.meta.url).href;
  try { await Promise.race([document.fonts.load('400 60px "Archivo Black"', 'HALLELUJAH'), new Promise((r) => setTimeout(r, 900))]); } catch (e) { /* 代わりの書体 */ }
  // ボールの質感はバンバと共通の画像。遅ければ単色で代用（演出全体は止めない）
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
    .hl3-name span{display:block;margin-top:1.4vh;font-family:"Archivo Black",sans-serif;font-size:max(11px,min(1.7vw,2.4vh));letter-spacing:.34em;color:${TEAL};opacity:0}`;
  el.appendChild(st);
  const flash = lay.querySelector('.hl3-flash'), name = lay.querySelector('.hl3-name'), chars = [...name.querySelectorAll('i')], sub = name.querySelector('span');

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07080a);
  scene.fog = new THREE.Fog(0x07080a, 11, 26);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environmentIntensity = 0.55;
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 80);

  /* 照明: アリーナの天井灯（床のニスに映る）＋ボールの影を落とす光 */
  scene.add(new THREE.HemisphereLight(0xfff2dd, 0x2a1a0c, 0.35));
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
    if (k >= 1 && prev && opt.arrow) { // 矢印
      const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]), s = 0.34 * im;
      ig.beginPath(); ig.moveTo(last[0] - Math.cos(a - 0.5) * s, last[1] - Math.sin(a - 0.5) * s); ig.lineTo(last[0], last[1]); ig.lineTo(last[0] - Math.cos(a + 0.5) * s, last[1] - Math.sin(a + 0.5) * s); ig.stroke();
    }
    if (k >= 1 && prev && opt.screen) { const a = Math.atan2(last[1] - prev[1], last[0] - prev[0]) + Math.PI / 2, s = 0.3 * im; ig.beginPath(); ig.moveTo(last[0] - Math.cos(a) * s, last[1] - Math.sin(a) * s); ig.lineTo(last[0] + Math.cos(a) * s, last[1] + Math.sin(a) * s); ig.stroke(); }
    ig.restore();
  }
  function piece([x, z], kind, label, k) {
    if (k <= 0) return;
    const [px, py] = IP(x, z), r = 0.36 * im;
    ig.save(); ig.globalAlpha = Math.min(1, k * 1.5); ig.lineWidth = 0.09 * im; ig.lineCap = 'round';
    if (kind === 'o') {
      ig.strokeStyle = TEAL; ig.shadowColor = TEAL; ig.shadowBlur = 0.1 * im; ig.fillStyle = 'rgba(8,24,23,.55)';
      ig.beginPath(); ig.arc(px, py, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * Math.min(1, k * 1.3)); ig.fill(); ig.stroke();
      ig.fillStyle = '#eafffd'; ig.shadowBlur = 0; ig.font = `${0.42 * im}px "Archivo Black", sans-serif`; ig.textAlign = 'center'; ig.textBaseline = 'middle'; ig.fillText(label, px, py + 0.02 * im);
    } else {
      ig.strokeStyle = PINK; ig.shadowColor = PINK; ig.shadowBlur = 0.1 * im; const s = r * 0.75 * Math.min(1, k * 1.4);
      ig.beginPath(); ig.moveTo(px - s, py - s); ig.lineTo(px + s, py + s); ig.moveTo(px + s, py - s); ig.lineTo(px - s, py + s); ig.stroke();
    }
    ig.restore();
  }
  let lastKey = '';
  function drawInk(t) {
    const kD = easeInOut(prog(t, 1.45, T_PASS)), kC = easeInOut(prog(t, 1.65, T_PASS + 0.1)), kP = prog(t, T_PASS, T_SHOT - 0.05), kS = prog(t, 2.2, 2.6);
    const kPc = prog(t, 1.05, 1.55), fade = 1 - 0.55 * prog(t, T_NAME, T_NAME + 0.5);
    const key = [kD, kC, kP, kS, kPc, fade].map((v) => v.toFixed(3)).join();
    if (key === lastKey) return; lastKey = key;
    ig.clearRect(0, 0, ink.width, ink.height);
    ig.globalAlpha = 1; inkM.opacity = fade;
    stroke(O1, kD, TEAL, { zig: true, arrow: true, seed: 3, w: 0.09 });
    stroke(O2, kC, PINK, { arrow: true, seed: 7 });
    stroke(smooth([[5.9, -6.2], [5.2, -4.9], [4.4, -3.9]]), kS, '#f6f2ea', { screen: true, seed: 11, w: 0.09 });
    stroke(smooth([PLAY.o1[3], PLAY.o2[4]]), kP, '#f6f2ea', { dash: true, arrow: true, seed: 5, w: 0.08 });
    piece(along(PLAY.o1, kD), 'o', '1', kPc); piece(along(PLAY.o2, kC), 'o', '2', kPc); piece(along(smooth([[5.9, -6.2], [5.2, -4.9], [4.4, -3.9]]), kS), 'o', '3', kPc);
    piece(along(PLAY.x1, kD), 'x', '', kPc - 0.1); piece(along(PLAY.x2, kC), 'x', '', kPc - 0.15); piece(along(PLAY.x3, kS), 'x', '', kPc - 0.2);
    inkT.needsUpdate = true;
  }

  /* ゴール（ボード・リング・ネット） */
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

  /* ボール */
  const BR = 0.12;
  const ballM = ballTex
    ? new THREE.MeshStandardMaterial({ map: ballTex[0], normalMap: ballTex[1], roughnessMap: ballTex[2], roughness: 1, metalness: 0 })
    : new THREE.MeshStandardMaterial({ color: 0xd4561c, roughness: 0.75 });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(BR, 48, 32), ballM); ball.castShadow = true; scene.add(ball);

  function ballAt(t) { // 位置 [x,y,z] と回転量
    const d0 = 1.45, d1 = T_PASS;
    if (t < d1) { // ドリブル（1番の線に沿って弾む）
      const k = easeInOut(prog(t, d0, d1)); const [x, z] = along(PLAY.o1, k);
      const ph = Math.max(0, t - 0.2) * 5.2;
      return [x + 0.35, BR + Math.abs(Math.sin(ph * Math.PI)) * 0.85, z, k * 6];
    }
    const A = [PLAY.o1[3][0] + 0.35, 1.1, PLAY.o1[3][1]], B = [PLAY.o2[4][0] + 0.3, 1.25, PLAY.o2[4][1] + 0.1];
    if (t < T_SHOT) { const k = prog(t, d1, T_SHOT); return [lerp(A[0], B[0], k), lerp(A[1], B[1], k) + Math.sin(k * Math.PI) * 0.6, lerp(A[2], B[2], k), 6 + k * 4]; }
    if (t < T_IN) { const k = prog(t, T_SHOT, T_IN); return [lerp(B[0], RIM.x, k), lerp(B[1], RIM.y + 0.05, k) + Math.sin(k * Math.PI) * 1.2, lerp(B[2], RIM.z + 0.02, k), 10 + k * 3]; }
    const k = t - T_IN; // リングを抜けて床へ
    const y = RIM.y + 0.05 - 4.9 * k * k;
    if (y > BR) return [RIM.x, y, RIM.z + 0.02 + k * 0.4, 13 + k * 2];
    const tl = Math.sqrt((RIM.y + 0.05 - BR) / 4.9), kk = k - tl;
    return [RIM.x, BR + Math.abs(Math.sin(kk * 4.5)) * 1.2 * Math.exp(-kk * 2.5), RIM.z + 0.02 + k * 0.4, 13 + k * 2];
  }

  let aspect = 1;
  function resize() { aspect = innerWidth / innerHeight; camera.aspect = aspect; camera.updateProjectionMatrix(); }
  resize();
  const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  function render(t) {
    /* カメラ: 床すれすれを横に流す → 上がって俯瞰 → リングへ少し寄る */
    const nar = aspect < 0.8; // 縦長（スマホ）は少し引く
    const low = [lerp(4.6, 1.8, easeInOut(prog(t, 0, T_UP))), 0.32, lerp(2.2, 0.6, easeInOut(prog(t, 0, T_UP)))];
    const top = nar ? [0, 15.5, 4.2] : [0, 10.2, 3.4];
    const end = nar ? [0, 12.5, 2.2] : [0, 8.6, 1.8];
    const up = easeInOut(prog(t, T_UP, T_TOP)), push = easeInOut(prog(t, T_SHOT - 0.3, DUR));
    const cp = v3(low).lerp(v3(top), up).lerp(v3(end), push);
    const lowL = [lerp(-1.5, -0.5, easeInOut(prog(t, 0, T_UP))), 0.15, -3.2];
    const topL = nar ? [0, 0, -2.9] : [0, 0, -2.6];
    const endL = [0, 0.6, -3.8];
    const cl = v3(lowL).lerp(v3(topL), up).lerp(v3(endL), push);
    camera.position.copy(cp); camera.lookAt(cl);

    const [bx, by, bz, rot] = ballAt(t);
    ball.position.set(bx, by, bz); ball.rotation.set(rot * 2.2, rot * 0.7, rot * 0.4);
    ball.visible = t > 1.0;
    // ネット: ボールが通る瞬間に揺れる
    const sw = Math.max(0, 1 - Math.abs(t - T_IN - 0.06) * 5);
    net.scale.set(1 - 0.15 * sw, 1 + 0.25 * sw, 1 - 0.15 * sw);

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
