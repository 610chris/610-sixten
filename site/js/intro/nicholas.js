/* ニコラス個人ページのオープニング（2026-11-04）
   しわの入った金属ホイルのパックが浮かぶ（光が流れる）→ 上の端がギザギザに裂けてちぎれ飛ぶ
   → 中から光とともにカードがせり上がる → 一回転して正面へ、ホログラムが光る
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる */
import { runIntro, prog, easeOut, easeIn, easeInOut, rand } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';
import { cardArt } from './nicholas-card.js';

/* 2026-11-05 クリス指示: 出てきたカードがそのまま横へ動いてページのカード位置に収まり、そこでページが始まる
   （T_FLY〜T_LAND で背景が消えてページが見え、3D のカードがヒーローの .nk-card にぴったり重なって着地 → 本物に入れ替わる）
   音: すべて自作の合成（scratchpad/p_nic5/synth5.py・標準ライブラリだけで一から作った波形。素材は不使用）→ sfx-open.mp3
       2026-11-05 クリス指示「ガーリーな音は絶対使うな・NBA 2K のカード開封の音に似せて・レアカードが当たったような演出に」
       ＋同日「ちゃんと開ける音・ガチャ感・静かすぎるのでリクトくらいの音量に」→ 低く重い 2K 系の上に開封音とガチャの溜めを追加。ベル/チャイム/キラキラは使わない:
       パックの低いうなり＋カサカサ → 「ビッ」から裂けるビリビリ(T_TEAR〜) → 「パンッ」＋重いドン(T_RIP)
       → 加速するドラムロール＋上がっていくコード(T_RISE〜) → 0.12 秒の無音 → 確定のブーム＋破裂＋ブラスのコード(T_HERO)
       → ウーシュ(T_FLY) → 着地のドン(T_LAND)。音量はリクトの sfx-open.mp3 と同じくらい（約 -13.6 LUFS）。
       映像も T_DROP〜T_HERO で画面が沈んでカメラが寄り、T_HERO で金/紫の光のバーストと輪が広がる（音のブームと同時）。
       2026-11-05 クリス指示「再リロードで途中から再開した時、カードがパッと消えないで上の方に飛んでいくように」
       → 着地先の .nk-card が画面外なら、カードは上へ飛んで画面から抜ける（フェードで消さない）。
       表示は何も出さない。自動再生が止められている時は、最初のクリック・タップ・キー・スクロールで鳴らす（その1回はスキップしない） */
const DUR = 5.2;
const T_TEAR = 1.5;   // 裂け始め
const T_RIP = 1.95;   // ちぎれて飛ぶ
const T_RISE = 2.0;   // カードがせり上がる
const T_DROP = 2.55;  // パックが落ちる
const T_HERO = 3.35;  // カードが正面で止まる
const T_FLY = 4.0;    // ページのカード位置へ横に動き始める
const T_LAND = 4.95;  // 着地（ここでページが始まる）
const PW = 1.62, PH = 2.7;   // パック
const CW = 1.3, CH = 1.82;   // カード（5:7）
const TEAR_V = 0.86;         // 裂け目の高さ（uv）
const GOLD = '#e9c46a';

// ── 音（Web Audio・1本の音をオープニングの時計に合わせて鳴らす）。表示は何も出さない ───────────
// ① サイト内のリンクから来た時（Chrome は同じサイトでの操作があれば自動再生を許す）: 開始と同時に鳴る
// ② 直接開いた・再読み込みの時: resume が通らない → 最初のクリック・タップ・キー・スクロールで、その時点の場面から鳴り始める
const SFX = { ctx: null, out: null, buf: null, src: null, started: false, swallow: false, t: -1 };
const SFX_URL = new URL('../../assets/s5/nicholas/sfx-open.mp3?v=gacha5', import.meta.url).href;
function initAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    SFX.ctx = new AC();
    SFX.out = SFX.ctx.createGain(); SFX.out.gain.value = 1; SFX.out.connect(SFX.ctx.destination);
    fetch(SFX_URL).then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((ab) => (ab ? new Promise((res) => SFX.ctx.decodeAudioData(ab, res, () => res(null))) : null))
      .then((b) => { SFX.buf = b; trySound(); }).catch(() => {});
    SFX.ctx.resume().then(trySound).catch(() => {});
  } catch (e) { SFX.ctx = null; }
}
const audioOn = () => SFX.ctx && SFX.ctx.state === 'running';
function trySound() {
  if (SFX.started || !audioOn() || !SFX.buf || SFX.t < 0 || SFX.t >= T_LAND) return;
  SFX.started = true;
  const s = SFX.ctx.createBufferSource(); s.buffer = SFX.buf; s.connect(SFX.out);
  s.start(0, Math.max(0, SFX.t)); SFX.src = s;
}
function armUnlock(el) {
  const unlock = (e) => {
    if (!SFX.ctx || audioOn()) return;
    if (e.type === 'keydown' && e.key === 'Escape') return; // Esc はいつでもスキップ
    SFX.ctx.resume().then(trySound).catch(() => {});
    if (e.type === 'pointerdown' || e.type === 'keydown') SFX.swallow = true; // 音を出すための1回目はスキップしない
    if (e.type === 'keydown') { e.stopImmediatePropagation(); e.preventDefault(); }
  };
  // Chrome が「ユーザー操作」と認めるのは keydown・mousedown/pointerdown・pointerup・touchend。wheel・touchstart は試すだけ（認められない環境では次の操作で鳴る）
  ['pointerdown', 'pointerup', 'keydown'].forEach((n) => addEventListener(n, unlock, true));
  ['touchstart', 'touchend', 'wheel'].forEach((n) => addEventListener(n, unlock, { capture: true, passive: true }));
  el.addEventListener('click', (e) => { if (SFX.swallow) { SFX.swallow = false; e.stopImmediatePropagation(); } }, true);
}
{
  const el = document.getElementById('s5-intro');
  if (el && !new URLSearchParams(location.search).has('introt') && document.documentElement.classList.contains('s5-intro-on')) { initAudio(); armUnlock(el); }
}
window.__nkSfx = SFX; // 確認用（CDP で state と再生位置を読む）

runIntro({ key: 'nicholas', duration: DUR, gl: true, setup });

function loadImg(url) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
}
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

/* パックの印刷（金属ホイルなので、色＝反射の色） */
function packArt() {
  const [c, g] = cv(600, 1000);
  let gr = g.createLinearGradient(0, 0, 600, 1000);
  gr.addColorStop(0, '#4a3f2a'); gr.addColorStop(0.45, '#17140f'); gr.addColorStop(1, '#3b311e');
  g.fillStyle = gr; g.fillRect(0, 0, 600, 1000);
  // 斜めの金ライン
  g.save(); g.translate(300, 500); g.rotate(-0.55);
  for (let i = -14; i < 14; i++) { g.fillStyle = i % 3 ? 'rgba(201,162,74,.10)' : 'rgba(233,196,106,.32)'; g.fillRect(-900, i * 46, 1800, i % 3 ? 6 : 14); }
  g.restore();
  // 上下の圧着部
  gr = g.createLinearGradient(0, 0, 0, 70); gr.addColorStop(0, '#d9b45c'); gr.addColorStop(1, '#8a6a2a');
  g.fillStyle = gr; g.fillRect(0, 0, 600, 64); g.fillRect(0, 936, 600, 64);
  // ラベル
  g.textAlign = 'center';
  g.fillStyle = '#f4e3b0'; g.font = '400 30px "Archivo Black", sans-serif';
  g.fillText('S T A R T I N G   5 I V E', 300, 210);
  g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(40, 300, 520, 330);
  g.strokeStyle = GOLD; g.lineWidth = 4; g.strokeRect(52, 312, 496, 306);
  gr = g.createLinearGradient(0, 360, 0, 470); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(0.5, '#e9c46a'); gr.addColorStop(1, '#b8862b');
  g.fillStyle = gr; g.font = '400 92px "Archivo Black", sans-serif'; g.fillText('NICHOLAS', 300, 462);
  g.fillStyle = '#ffffff'; g.font = '900 56px "Noto Sans JP", sans-serif'; g.fillText('ニコラス武', 300, 548);
  g.fillStyle = '#e9c46a'; g.font = '400 24px "Archivo Black", sans-serif'; g.fillText('NBA YOUTUBER PACK', 300, 596);
  g.fillStyle = '#f4e3b0'; g.font = '400 26px "Archivo Black", sans-serif'; g.fillText('1 CARD  ·  SINCE 2018', 300, 820);
  return c;
}

/* しわ（高さ）→ 法線マップ。圧着部は縦の細かいギザギザ */
function crinkleNormal(R) {
  const W = 300, H = 500, h = new Float32Array(W * H);
  for (let k = 0; k < 190; k++) {
    const x0 = R() * W, y0 = R() * H, ang = Math.PI / 2 + (R() - 0.5) * 1.6, len = 20 + R() * 150;
    const amp = (R() - 0.5) * (k < 30 ? 2.4 : 1.1), wd = 1.2 + R() * (k < 30 ? 6 : 2.5);
    const dx = Math.cos(ang), dy = Math.sin(ang);
    const x1 = x0 + dx * len, y1 = y0 + dy * len, pad = wd * 3;
    const minx = Math.max(0, Math.floor(Math.min(x0, x1) - pad)), maxx = Math.min(W - 1, Math.ceil(Math.max(x0, x1) + pad));
    const miny = Math.max(0, Math.floor(Math.min(y0, y1) - pad)), maxy = Math.min(H - 1, Math.ceil(Math.max(y0, y1) + pad));
    for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
      const px = x - x0, py = y - y0, s = Math.max(0, Math.min(len, px * dx + py * dy));
      const ex = px - dx * s, ey = py - dy * s, d2 = ex * ex + ey * ey;
      const taper = Math.sin((s / len) * Math.PI);
      h[y * W + x] += amp * taper * Math.exp(-d2 / (wd * wd));
    }
  }
  for (let y = 0; y < H; y++) {
    const v = y / H;
    if (v < 0.064 || v > 0.936) for (let x = 0; x < W; x++) h[y * W + x] += Math.abs(Math.sin(x * 0.9)) * 1.6;
  }
  const [c, g] = cv(W, H), im = g.createImageData(W, H), d = im.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const l = h[y * W + Math.max(0, x - 1)], r = h[y * W + Math.min(W - 1, x + 1)];
    const u = h[Math.max(0, y - 1) * W + x], b = h[Math.min(H - 1, y + 1) * W + x];
    let nx = (l - r) * 0.9, ny = (b - u) * 0.9, nz = 1;
    const n = Math.hypot(nx, ny, nz); nx /= n; ny /= n; nz /= n;
    const o = (y * W + x) * 4;
    d[o] = (nx * 0.5 + 0.5) * 255; d[o + 1] = (ny * 0.5 + 0.5) * 255; d[o + 2] = (nz * 0.5 + 0.5) * 255; d[o + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  return c;
}

/* 裂け目のマスク（下=本体、上=ちぎれる帯）。同じギザギザ線を使うのでぴったり噛み合う */
function tearMasks(R) {
  const W = 256, H = 512, pts = [];
  for (let u = 0; u <= 1.0001; u += 1 / 48) pts.push([u * W, (1 - (TEAR_V + (R() - 0.5) * 0.014 + Math.sin(u * 11) * 0.005)) * H]);
  const mk = (below) => {
    const [c, g] = cv(W, H);
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff'; g.beginPath();
    g.moveTo(0, below ? H : 0);
    pts.forEach(([x, y]) => g.lineTo(x, y));
    g.lineTo(W, below ? H : 0); g.closePath(); g.fill();
    return c;
  };
  return [mk(true), mk(false)];
}

/* カードの表は NBA 2K Mobile 風（nicholas-card.js）。数値は「あんま強くない」ライン */
function cardBack() {
  const [c, g] = cv(325, 455);
  g.save(); rr(g, 0, 0, 325, 455, 18); g.clip();
  g.fillStyle = '#121110'; g.fillRect(0, 0, 325, 455);
  g.strokeStyle = 'rgba(233,196,106,.18)'; g.lineWidth = 2;
  for (let i = -20; i < 40; i++) { g.beginPath(); g.moveTo(i * 18, 0); g.lineTo(i * 18 - 455, 455); g.stroke(); }
  g.lineWidth = 6; g.strokeStyle = GOLD; rr(g, 10, 10, 305, 435, 12); g.stroke();
  g.fillStyle = GOLD; g.textAlign = 'center'; g.font = '400 64px "Archivo Black", sans-serif'; g.fillText('S5', 162, 250);
  g.font = '400 13px "Archivo Black", sans-serif'; g.fillText('S T A R T I N G   5 I V E', 162, 284);
  g.restore();
  return c;
}

async function setup(ctx) {
  const THREE = ctx.THREE;
  const { renderer, el, lay } = ctx;
  const base = new URL('../../assets/s5/', import.meta.url).href;
  const fontsP = Promise.all([
    document.fonts.load('400 80px "Archivo Black"', 'NICHOLAS'),
    document.fonts.load('900 56px "Noto Sans JP"', 'ニコラス武'),
    document.fonts.load('900 66px "Cinzel Decorative"', 'NICHOLAS'),
    document.fonts.load('400 30px "Cinzel Decorative"', 'LVL'),
    document.fonts.load('700 20px "Noto Sans JP"', 'ニコラス武'),
    document.fonts.load('600 74px "Teko"', 'T9 31.6K S5 1/5'),
  ]).catch(() => {});
  const [photo] = await Promise.all([loadImg(base + 'member-nicholas.jpg'), Promise.race([fontsP, new Promise((r) => setTimeout(r, 1200))])]);
  const R = rand(2018);

  /* 背面の光の筋・巨大文字と、前面のフラッシュ（DOM） */
  const back = document.createElement('div');
  back.className = 'nk3-back';
  back.innerHTML = '<div class="nk3-rays"></div><div class="nk3-burst"></div><div class="nk3-ring"></div><div class="nk3-word">NICHOLAS</div>';
  el.insertBefore(back, ctx.canvas);
  const rays = back.querySelector('.nk3-rays'), word = back.querySelector('.nk3-word');
  const burst = back.querySelector('.nk3-burst'), ring = back.querySelector('.nk3-ring');
  lay.innerHTML = '<div class="nk3-flash"></div><div class="nk3-pu"></div>';
  const flash = lay.firstChild, pu = lay.lastChild;
  const style = document.createElement('style');
  style.textContent = `
    .nk3-back{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    .nk3-rays{position:absolute;left:50%;top:50%;width:220vmax;height:220vmax;margin:-110vmax 0 0 -110vmax;background:repeating-conic-gradient(from 0deg,rgba(233,196,106,.22) 0deg 5deg,transparent 5deg 15deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 42%);mask:radial-gradient(circle,#000 0,transparent 42%);opacity:0}
    .nk3-word{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:"Archivo Black",sans-serif;font-size:min(22vw,30vh);line-height:1;color:transparent;-webkit-text-stroke:1px rgba(233,196,106,.35);white-space:nowrap;opacity:0}
    .nk3-burst{position:absolute;left:50%;top:50%;width:150vmax;height:150vmax;margin:-75vmax 0 0 -75vmax;border-radius:50%;background:radial-gradient(circle,rgba(255,244,214,.95) 0,rgba(233,196,106,.75) 9%,rgba(155,107,255,.5) 21%,rgba(110,60,220,.18) 36%,rgba(110,60,220,0) 52%);opacity:0;mix-blend-mode:screen}
    .nk3-ring{position:absolute;left:50%;top:50%;width:60vmin;height:60vmin;margin:-30vmin 0 0 -30vmin;border-radius:50%;border:3px solid rgba(233,196,106,.9);box-shadow:0 0 40px 8px rgba(155,107,255,.55),inset 0 0 30px 4px rgba(233,196,106,.5);opacity:0}
    .nk3-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#fff6dc 0,rgba(233,196,106,.55) 22%,rgba(233,196,106,0) 60%);opacity:0}
    .nk3-pu{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle at 50% 46%,rgba(155,107,255,0) 18%,rgba(155,107,255,.45) 42%,rgba(155,107,255,0) 75%);opacity:0}`;
  el.appendChild(style);

  /* シーン */
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xfff1d6, 2.2); key.position.set(-2, 4, 5); scene.add(key);
  const sweepL = new THREE.DirectionalLight(0xffffff, 3.5); scene.add(sweepL);
  const rim = new THREE.DirectionalLight(0xe9c46a, 2.5); rim.position.set(3, 2, -4); scene.add(rim);
  const inner = new THREE.PointLight(0xffd88a, 0, 5, 1.6); scene.add(inner);
  // レア確定の色付きの光（T_HERO で紫と金がカードの縁を照らす）
  const rareP = new THREE.PointLight(0x9b6bff, 0, 6, 1.4); rareP.position.set(-1.4, 0.6, 1.2); scene.add(rareP);
  const rareG = new THREE.PointLight(0xffd27a, 0, 6, 1.4); rareG.position.set(1.4, -0.4, 1.2); scene.add(rareG);

  /* パック: 枕型にふくらんだ面（表裏）＋しわの法線＋金属 */
  const artT = new THREE.CanvasTexture(packArt()); artT.colorSpace = THREE.SRGBColorSpace; artT.anisotropy = 8;
  const nrmT = new THREE.CanvasTexture(crinkleNormal(R)); nrmT.anisotropy = 8;
  const [mBody, mStrip] = tearMasks(R).map((m) => new THREE.CanvasTexture(m));
  const geo = new THREE.PlaneGeometry(PW, PH, 48, 90);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = Math.abs(pos.getX(i) / (PW / 2)), v = Math.abs(pos.getY(i) / (PH / 2));
    const lim = 0.872;
    const z = v > lim ? 0.004 : 0.004 + 0.085 * Math.sqrt(Math.max(0, 1 - Math.pow(u, 6))) * Math.sqrt(Math.max(0, 1 - Math.pow(v / lim, 8)));
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();
  const foil = (extra) => new THREE.MeshStandardMaterial(Object.assign({ map: artT, normalMap: nrmT, normalScale: new THREE.Vector2(0.9, 0.9), metalness: 1, roughness: 0.3, side: THREE.FrontSide }, extra));
  const matFull = foil({});
  const matBody = foil({ alphaMap: mBody, alphaTest: 0.5 });
  const tearY = (TEAR_V - 0.5) * PH;
  /* 2026-11-05 クリス指示「ただ上に引き下がって消えるのは不自然。パックを開ける時の動きを再現・横にビリビリっと開くように」
     → 実物の開け方（左上の切り込みをつまんで右へ引き裂く）: 裂け目の先端 TEAR.xf が左→右へ小刻みに進み、
        先端より左（裂けた所）の上部だけが裂け目の線を折り目に手前へめくれる。先端より右はまだ本体とつながったまま。
        右端まで裂けきったら（T_RIP）帯が外れて右上へ飛ぶ。曲げは頂点シェーダ（表裏の面それぞれ、パック座標で計算） */
  const TEAR = { xf: { value: -9 }, th: { value: 0 } };
  const TEAR_L = 0.5; // 先端から何 m で最大までめくれるか
  const ripMat = (sg) => {
    const m = foil({ alphaMap: mStrip, alphaTest: 0.5 });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uXf = TEAR.xf; sh.uniforms.uTh = TEAR.th;
      const fn = `uniform float uXf;uniform float uTh;
        float nkA(vec3 P){float b=clamp((uXf-P.x*${sg.toFixed(1)})/${TEAR_L.toFixed(2)},0.,1.);b=b*b*(3.-2.*b);return uTh*b*smoothstep(0.,0.05,P.y-(${tearY.toFixed(4)}));}
        vec3 nkR(vec3 P,float a,float hy){float zg=P.z*${sg.toFixed(1)},dy=P.y-hy,c=cos(a),s=sin(a);return vec3(P.x,hy+dy*c-zg*s,(dy*s+zg*c)*${sg.toFixed(1)});}`;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\n' + fn)
        .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>\nobjectNormal=nkR(objectNormal,nkA(position),0.);`)
        .replace('#include <begin_vertex>', `#include <begin_vertex>\ntransformed=nkR(transformed,nkA(position),${tearY.toFixed(4)});`);
    };
    return m;
  };
  const matStripA = ripMat(1), matStripB = ripMat(-1);
  const pack = new THREE.Group(); scene.add(pack);
  const twoSided = (mat, matB) => { const g = new THREE.Group(); const a = new THREE.Mesh(geo, mat), b = new THREE.Mesh(geo, matB || mat); b.rotation.y = Math.PI; g.add(a, b); return g; };
  const full = twoSided(matFull), body = twoSided(matBody);
  pack.add(full, body);
  const pivot = new THREE.Group(); pivot.position.set(PW / 2, tearY, 0); pack.add(pivot);
  const strip = twoSided(matStripA, matStripB); strip.position.set(-PW / 2, -tearY, 0); pivot.add(strip);

  /* カード: 表=ホログラム（自作シェーダ）、裏=S5 */
  const [cArt, cMask] = cardArt(photo);
  const cT = new THREE.CanvasTexture(cArt); cT.colorSpace = THREE.SRGBColorSpace; cT.anisotropy = 8;
  const mT = new THREE.CanvasTexture(cMask);
  const holo = new THREE.ShaderMaterial({
    uniforms: { map: { value: cT }, foil: { value: mT }, sweep: { value: -1 }, glow: { value: 0 } },
    vertexShader: `varying vec2 vUv;varying vec3 vN;varying vec3 vV;
      void main(){vUv=uv;vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=-mv.xyz;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform sampler2D map;uniform sampler2D foil;uniform float sweep;uniform float glow;
      varying vec2 vUv;varying vec3 vN;varying vec3 vV;
      vec3 hue(float h){return clamp(abs(mod(h*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);}
      void main(){
        vec4 b=texture2D(map,vUv); if(b.a<.5) discard;
        float m=texture2D(foil,vUv).r; m*=m; // 2K Mobile 風: 虹は枠だけ・写真と数値はほぼ素のまま
        vec3 N=normalize(vN), V=normalize(vV);
        float tilt=N.x*1.8+N.y*1.3+V.x*.5+V.y*.4;
        vec3 rb=hue(fract(vUv.x*.7-vUv.y*1.1+tilt));
        float fine=.55+.45*sin((vUv.x*.8+vUv.y)*300.+tilt*50.);
        vec3 col=mix(b.rgb,b.rgb*.5+rb*.8*fine,m*.5)+rb*m*.08;
        float band=vUv.x*.9+(1.-vUv.y)*.6-sweep;
        col+=vec3(1.,.96,.88)*exp(-band*band*160.)*.8*(.35+.65*m);
        col*=.82+.25*max(N.z,0.)+glow;
        gl_FragColor=vec4(col,1.);
        #include <colorspace_fragment>
      }`,
  });
  const backT = new THREE.CanvasTexture(cardBack()); backT.colorSpace = THREE.SRGBColorSpace;
  const backM = new THREE.MeshStandardMaterial({ map: backT, alphaTest: 0.5, roughness: 0.5, metalness: 0.3 });
  const edgeM = new THREE.MeshStandardMaterial({ color: 0xe9c46a, roughness: 0.4, metalness: 0.6 });
  const card = new THREE.Mesh(new THREE.BoxGeometry(CW, CH, 0.012), [edgeM, edgeM, edgeM, edgeM, holo, backM]);
  // 角を丸めた分だけ側面の四隅が見えないよう、厚みはごく薄く
  scene.add(card);

  /* きらきら */
  const NS = 90, sp = new Float32Array(NS * 3), ph = new Float32Array(NS), sz = new Float32Array(NS);
  for (let i = 0; i < NS; i++) { sp[i * 3] = (R() - 0.5) * 3.4; sp[i * 3 + 1] = (R() - 0.5) * 3.2; sp[i * 3 + 2] = (R() - 0.3) * 1.6; ph[i] = R() * 6.28; sz[i] = 0.5 + R(); }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  sg.setAttribute('aPh', new THREE.BufferAttribute(ph, 1));
  sg.setAttribute('aSz', new THREE.BufferAttribute(sz, 1));
  const spark = new THREE.ShaderMaterial({
    uniforms: { uT: { value: 0 }, uOn: { value: 0 }, uPx: { value: ctx.dpr * innerHeight } },
    vertexShader: `attribute float aPh;attribute float aSz;uniform float uT;uniform float uPx;varying float vA;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);float tw=max(0.,sin(uT*3.+aPh*3.));vA=tw;gl_PointSize=aSz*tw*uPx*.05/-mv.z;gl_Position=projectionMatrix*mv;}`,
    fragmentShader: `uniform float uOn;varying float vA;
      void main(){vec2 p=gl_PointCoord-.5;float c=max(0.,1.-abs(p.x)*14.)*max(0.,1.-abs(p.y)*2.2)+max(0.,1.-abs(p.y)*14.)*max(0.,1.-abs(p.x)*2.2);float d=exp(-dot(p,p)*40.);
        gl_FragColor=vec4(vec3(1.,.9,.65)*(c+d),(c+d)*vA*uOn);}`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const sparks = new THREE.Points(sg, spark); scene.add(sparks);

  let camZ = 9;
  function resize() {
    const a = innerWidth / innerHeight;
    camera.aspect = a;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camZ = Math.max(1.72 / half, 1.12 / (half * a));
    camera.updateProjectionMatrix();
    spark.uniforms.uPx.value = ctx.dpr * innerHeight;
  }
  resize();

  /* 着地先: ヒーローの .nk-card（再生中は visibility:hidden で場所だけある）。
     画面外（再読み込みで前のスクロール位置から再開した等）なら null → カードは上へ飛んで抜ける（T_FLY の瞬間に1回だけ決める） */
  const vig = el.querySelector('.vig'), grain = el.querySelector('.grain'), hint = el.querySelector('.hint');
  let target = null, targetAt = -1, flyMode = null;
  const T_GAP = T_HERO - 0.12; // 音の無音（ドロップ）の始まり
  function heroTarget() {
    const n = document.querySelector('.nk-hero .nk-card');
    if (!n) return null;
    const r = n.getBoundingClientRect();
    if (r.bottom < 40 || r.top > innerHeight - 40) return null;
    const ry = parseFloat(getComputedStyle(n).getPropertyValue('--ry')) || 0;
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: n.offsetWidth, ry: ry * Math.PI / 180 };
  }
  function sounds(t) {
    if (ctx.freeze !== null) return;
    SFX.t = t;
    if (!SFX.started) trySound();
  }
  const camZFinal = () => camZ * 1.04;
  function render(t) {
    sounds(t);
    const fly = easeInOut(prog(t, T_FLY, T_LAND));
    const bgA = 1 - prog(t, T_FLY, T_LAND - 0.15);
    // レア演出: T_DROP〜T_GAP で画面が暗く沈む（sink）→ T_HERO で光が弾ける（hit は 0.35 秒で減衰）
    const sink = easeInOut(prog(t, T_DROP, T_GAP)) * (1 - prog(t, T_HERO - 0.02, T_HERO + 0.12));
    const hit = t >= T_HERO ? Math.exp(-(t - T_HERO) / 0.35) : 0;
    const hitF = t >= T_HERO ? Math.exp(-(t - T_HERO) / 0.12) : 0;
    const bc = t < T_RISE ? [29, 26, 18] : [42, 34, 16];
    const bgc = bc.map((v, i) => Math.round(v * (1 - 0.8 * sink) + [46, 22, 78][i] * hit * 0.7)).join(',');
    el.style.background = `radial-gradient(110% 85% at 50% 45%, rgba(${bgc},${bgA}) 0%, rgba(5,5,5,${bgA}) 72%)`;
    vig.style.opacity = grain.style.opacity = String(bgA);
    if (hint) hint.style.opacity = String(bgA);

    /* パック: 下から入って斜め → 正面へ。光の帯が流れる */
    const inP = easeOut(prog(t, 0, 0.75));
    const face = easeInOut(prog(t, 0, T_TEAR - 0.1));
    const tearP = prog(t, T_TEAR, T_RIP);
    const drop = easeIn(prog(t, T_DROP, T_DROP + 0.65));
    const shake = tearP > 0 && tearP < 1 ? Math.sin(t * 70) * 0.012 : 0;
    pack.position.set(shake, (1 - inP) * -3.2 + Math.sin(t * 2.1) * 0.03 * (1 - face) - drop * 4.2, 0);
    pack.rotation.set(0.22 * (1 - face), -0.62 * (1 - face) + Math.sin(t * 1.7) * 0.05 * (1 - face), 0.06 * (1 - face) + shake * 2);
    sweepL.position.set(Math.cos(t * 1.9 + 2.2) * 6, 1.5, 4);
    full.visible = t < T_TEAR; body.visible = !full.visible; pivot.visible = !full.visible;
    // 帯: 裂け目の先端が左→右へビリ、ビリと進む（5 回に分けて進む＝単調増加の段々）→ 裂けた所から手前へめくれる
    //      → 右端まで裂けたら（T_RIP）外れて、引っぱった方向＝右上へ飛ぶ
    const tq = tearP - Math.sin(2 * Math.PI * 5 * tearP) / (2 * Math.PI * 5);
    TEAR.xf.value = t < T_TEAR ? -9 : -PW / 2 - 0.02 + (PW + TEAR_L + 0.04) * tq;
    TEAR.th.value = 1.05 + 0.25 * easeOut(prog(t, T_RIP - 0.08, T_RIP + 0.25));
    const tr = Math.max(0, t - T_RIP);
    pivot.position.set(PW / 2 + tr * 2.6, tearY + tr * 3.2 - tr * tr * 1.2, tr * 1.2);
    pivot.rotation.set(tr * 2, 0, -tr * 4.5);
    if (tr > 1) pivot.visible = false;

    /* カード: 光とともにせり上がる → パックが落ちる → 一回転して正面へ → ゆらゆら */
    const rise = easeOut(prog(t, T_RISE, T_DROP + 0.2));
    const c = easeInOut(prog(t, T_DROP + 0.15, T_HERO));
    const riseY = -0.2 + 1.45 * rise;
    card.visible = t > T_TEAR;
    const cy = riseY * (1 - c) + 0.04 * c;
    // パックから抜け切るまではパックの中（表裏の面の間）に留める＝前に重ならない
    const packTop = pack.position.y + tearY;
    const out = Math.min(1, Math.max(0, (cy - CH * 0.5 * (1 + 0.22 * c) - packTop) / 0.25 + 0.15));
    const free = easeInOut(out);
    const ht = Math.max(0, t - T_HERO);
    let px = 0, py = cy, pz = 0.6 * c * free, sc = 1 + 0.22 * c, rz = 0;
    let rx = (-0.04 * c + Math.sin(ht * 1.6) * 0.07 * c) * free, ry = (Math.PI * 2 * c + Math.sin(ht * 2.0 + 0.6) * 0.26 * c * Math.min(1, ht * 2)) * free;
    if (t >= T_FLY) {
      // 横へスライドして、ページのカードとぴったり同じ位置・大きさ・傾きに収まる
      if (flyMode === null || ctx.freeze !== null) { target = heroTarget(); targetAt = t; flyMode = target ? 'land' : 'up'; } // 止め撮りは毎回判定
      else if (flyMode === 'land' && t - targetAt > 0.2) { const nt = heroTarget(); if (nt) target = nt; targetAt = t; }
      if (flyMode === 'land') {
        const k = 2 * camZFinal() * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / innerHeight; // 1px あたりの長さ（z=0 の面）
        const tx = (target.cx - innerWidth / 2) * k, ty = -(target.cy - innerHeight / 2) * k, ts = (target.w * k) / CW;
        const fy = easeInOut(prog(t, T_FLY + 0.08, T_LAND)); // 縦は少し遅らせて「横に動く」感じを強く
        px += (tx - px) * fly; py += (ty - py) * fy; pz += (0 - pz) * fly; sc += (ts - sc) * fly;
        rx += (0 - rx) * fly; ry += (Math.PI * 2 + target.ry - ry) * fly;
        // スマホなどページのカードが真ん中にある時は、そのままだと横に動かない → 左へ大きく振れてから戻って収まる
        const sway = Math.max(0, 1 - Math.abs(tx) / (CW * 0.8));
        if (sway > 0) {
          const arc = Math.sin(Math.PI * fly);
          px -= arc * CW * 0.55 * sway;
          ry += arc * 0.5 * sway;
          rz = arc * 0.1 * sway;
        }
      } else {
        // ページの途中から見ている（ヒーローのカードが画面外）: 消さずに、少し沈んでから上へ飛んで画面の外へ抜ける
        const up = easeIn(prog(t, T_FLY, T_LAND - 0.1));
        const dip = Math.sin(Math.PI * prog(t, T_FLY, T_FLY + 0.32)) * (t < T_FLY + 0.16 ? 1 : 0.6);
        const halfH = camZFinal() * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        py += -0.12 * dip + (halfH + CH * sc * 0.8 + 0.4 - py) * up;
        rx += -0.55 * up; rz = 0.12 * up; sc *= 1 + 0.08 * up;
      }
    }
    card.position.set(px, py, pz);
    card.scale.setScalar(sc);
    card.rotation.set(rx, ry, rz);
    holo.uniforms.sweep.value = -0.4 + 2.4 * prog(t, T_HERO - 0.1, T_HERO + 0.9);
    holo.uniforms.glow.value = 0.5 * Math.max(0, 1 - Math.abs(t - T_HERO) * 4) - 0.3 * sink;
    inner.position.set(0, tearY + 0.1, 0.25);
    inner.intensity = 10 * prog(t, T_TEAR + 0.2, T_RIP) * (1 - prog(t, T_DROP, T_DROP + 0.5));
    key.intensity = 2.2 * (1 - 0.55 * sink); sweepL.intensity = 3.5 * (1 - 0.6 * sink);
    rareP.intensity = 9 * hit + 1.5 * sink; rareG.intensity = 7 * hit;

    spark.uniforms.uT.value = t;
    spark.uniforms.uOn.value = prog(t, T_RISE, T_HERO) * (1 - fly) * (1 - 0.7 * sink);

    // カメラ: 沈む間にじわっと寄る → T_HERO で小さく揺れて戻る（T_FLY 前に元の距離へ）
    const push = 0.08 * easeInOut(prog(t, T_DROP, T_GAP)) * (1 - easeOut(prog(t, T_HERO, T_HERO + 0.55)));
    const cz = camZ * (1.06 - 0.06 * easeInOut(prog(t, 0, T_TEAR)) + 0.04 * c - push);
    const shk = 0.025 * hitF;
    camera.position.set(Math.sin(t * 90) * shk, 0.05 * (1 - fly) + Math.cos(t * 77) * shk, cz);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);

    // 光の筋: せり上がりで少し漏れる → 沈む間は消える → T_HERO で全開
    const raysA = Math.max(0.4 * prog(t, T_RISE, T_DROP) * (1 - sink) * (t < T_HERO ? 1 : 0), t >= T_HERO ? 0.55 + 0.45 * hit : 0);
    rays.style.opacity = raysA * bgA;
    rays.style.transform = `rotate(${t * 9}deg)`;
    // カードの後ろの光のバースト（沈む間は小さく漏れる → T_HERO で金→紫に大きく弾ける）と、広がる輪
    burst.style.opacity = Math.max(0.22 * sink, hit) * bgA;
    burst.style.transform = `scale(${t < T_HERO ? 0.32 + 0.06 * sink : 0.5 + 0.8 * (1 - hit)})`;
    const rp = prog(t, T_HERO, T_HERO + 0.7);
    ring.style.opacity = t >= T_HERO ? (1 - rp) * 0.9 * bgA : 0;
    ring.style.transform = `scale(${0.3 + 2.6 * easeOut(rp)})`;
    word.style.opacity = prog(t, T_HERO - 0.05, T_HERO + 0.35) * bgA;
    word.style.transform = `translate(-50%,-50%) scale(${1.12 - 0.12 * easeOut(prog(t, T_DROP, DUR))})`;
    flash.style.opacity = Math.max(0, 1 - Math.abs(t - T_RIP) / 0.25) * 0.85 + 0.55 * hitF;
    pu.style.opacity = String(Math.min(1, hit * 1.2) * bgA);
  }
  return { render, resize };
}
