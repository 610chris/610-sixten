/* ニコラス個人ページのオープニング（2026-11-04）
   しわの入った金属ホイルのパックが浮かぶ（光が流れる）→ 上の端がギザギザに裂けてちぎれ飛ぶ
   → 中から光とともにカードがせり上がる → 一回転して正面へ、ホログラムが光る
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる */
import { runIntro, prog, easeOut, easeIn, easeInOut, rand } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const DUR = 5.6;
const T_TEAR = 1.5;   // 裂け始め
const T_RIP = 1.95;   // ちぎれて飛ぶ
const T_RISE = 2.0;   // カードがせり上がる
const T_DROP = 2.55;  // パックが落ちる
const T_HERO = 3.35;  // カードが正面で止まる
const PW = 1.62, PH = 2.7;   // パック
const CW = 1.3, CH = 1.82;   // カード（5:7）
const TEAR_V = 0.86;         // 裂け目の高さ（uv）
const GOLD = '#e9c46a';

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

/* カードの表（写真・金の枠・名前）と、ホログラムの効き具合マスク */
function cardArt(photo) {
  const W = 650, H = 910;
  const [c, g] = cv(W, H), [m, f] = cv(W, H);
  f.fillStyle = '#000'; f.fillRect(0, 0, W, H);
  g.save(); rr(g, 0, 0, W, H, 36); g.clip();
  let gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#2a2416'); gr.addColorStop(0.5, '#0c0b09'); gr.addColorStop(1, '#2a2416');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  f.save(); rr(f, 0, 0, W, H, 36); f.fillStyle = '#fff'; f.fill(); f.restore();
  // 写真
  const px = 44, py = 44, pw = W - 88, ph = 600;
  const s = Math.max(pw / photo.width, ph / photo.height), sw = pw / s, sh = ph / s;
  g.save(); rr(g, px, py, pw, ph, 18); g.clip();
  g.drawImage(photo, (photo.width - sw) / 2, 0, sw, sh, px, py, pw, ph);
  gr = g.createLinearGradient(0, py + ph * 0.55, 0, py + ph); gr.addColorStop(0, 'rgba(12,11,9,0)'); gr.addColorStop(1, 'rgba(12,11,9,.95)');
  g.fillStyle = gr; g.fillRect(px, py, pw, ph);
  g.restore();
  f.save(); rr(f, px, py, pw, ph, 18); f.fillStyle = '#2a2a2a'; f.fill(); f.restore();
  // 金の枠
  g.lineWidth = 10; g.strokeStyle = GOLD; rr(g, 18, 18, W - 36, H - 36, 26); g.stroke();
  g.lineWidth = 3; g.strokeStyle = '#fff3cc'; rr(g, px - 4, py - 4, pw + 8, ph + 8, 20); g.stroke();
  // 左上のバッジ
  g.fillStyle = 'rgba(0,0,0,.6)'; rr(g, 64, 64, 168, 104, 14); g.fill();
  g.textAlign = 'left'; g.fillStyle = GOLD; g.font = '400 54px "Archivo Black", sans-serif'; g.fillText('NBA', 84, 124);
  g.fillStyle = '#fff'; g.font = '400 17px "Archivo Black", sans-serif'; g.fillText('Y O U T U B E R', 84, 152);
  // 名前
  g.textAlign = 'center';
  gr = g.createLinearGradient(0, 640, 0, 760); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#f1d98f');
  g.fillStyle = gr; g.font = '400 84px "Archivo Black", sans-serif'; g.fillText('NICHOLAS', W / 2, 740);
  g.fillStyle = GOLD; g.font = '900 42px "Noto Sans JP", sans-serif'; g.fillText('ニコラス武', W / 2, 800);
  g.fillStyle = 'rgba(255,255,255,.75)'; g.font = '400 19px "Archivo Black", sans-serif'; g.fillText('STARTING 5IVE  ·  SINCE 2018', W / 2, 850);
  g.restore();
  return [c, m];
}

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
  ]).catch(() => {});
  const [photo] = await Promise.all([loadImg(base + 'member-nicholas.jpg'), Promise.race([fontsP, new Promise((r) => setTimeout(r, 1200))])]);
  const R = rand(2018);

  /* 背面の光の筋・巨大文字と、前面のフラッシュ（DOM） */
  const back = document.createElement('div');
  back.className = 'nk3-back';
  back.innerHTML = '<div class="nk3-rays"></div><div class="nk3-word">NICHOLAS</div>';
  el.insertBefore(back, ctx.canvas);
  const rays = back.querySelector('.nk3-rays'), word = back.querySelector('.nk3-word');
  lay.innerHTML = '<div class="nk3-flash"></div>';
  const flash = lay.firstChild;
  const style = document.createElement('style');
  style.textContent = `
    .nk3-back{position:absolute;inset:0;pointer-events:none;overflow:hidden}
    .nk3-rays{position:absolute;left:50%;top:50%;width:220vmax;height:220vmax;margin:-110vmax 0 0 -110vmax;background:repeating-conic-gradient(from 0deg,rgba(233,196,106,.22) 0deg 5deg,transparent 5deg 15deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 42%);mask:radial-gradient(circle,#000 0,transparent 42%);opacity:0}
    .nk3-word{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:"Archivo Black",sans-serif;font-size:min(22vw,30vh);line-height:1;color:transparent;-webkit-text-stroke:1px rgba(233,196,106,.35);white-space:nowrap;opacity:0}
    .nk3-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#fff6dc 0,rgba(233,196,106,.55) 22%,rgba(233,196,106,0) 60%);opacity:0}`;
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
  const matStrip = foil({ alphaMap: mStrip, alphaTest: 0.5 });
  const pack = new THREE.Group(); scene.add(pack);
  const twoSided = (mat) => { const g = new THREE.Group(); const a = new THREE.Mesh(geo, mat), b = new THREE.Mesh(geo, mat); b.rotation.y = Math.PI; g.add(a, b); return g; };
  const full = twoSided(matFull), body = twoSided(matBody);
  pack.add(full, body);
  const tearY = (TEAR_V - 0.5) * PH;
  const pivot = new THREE.Group(); pivot.position.set(PW / 2, tearY, 0); pack.add(pivot);
  const strip = twoSided(matStrip); strip.position.set(-PW / 2, -tearY, 0); pivot.add(strip);

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
        float m=texture2D(foil,vUv).r;
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

  function render(t) {
    el.style.background = `radial-gradient(110% 85% at 50% 45%, ${t < T_RISE ? '#1d1a12' : '#2a2210'} 0%, #050505 72%)`;

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
    // 帯: 左端からめくれて（右端を支点）→ ちぎれて右上へ飛ぶ
    const tr = Math.max(0, t - T_RIP);
    pivot.position.set(PW / 2 + tr * 2.6, tearY + tr * 3.2 - tr * tr * 1.2, tr * 1.2);
    pivot.rotation.set(easeIn(tearP) * 0.7 + tr * 2, 0, -easeIn(tearP) * 0.42 - tr * 4.5);
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
    card.position.set(0, cy, 0.6 * c * free);
    card.scale.setScalar(1 + 0.22 * c);
    const ht = Math.max(0, t - T_HERO);
    card.rotation.set((-0.04 * c + Math.sin(ht * 1.6) * 0.07 * c) * free, (Math.PI * 2 * c + Math.sin(ht * 2.0 + 0.6) * 0.26 * c * Math.min(1, ht * 2)) * free, 0);
    holo.uniforms.sweep.value = -0.4 + 2.4 * prog(t, T_HERO - 0.1, T_HERO + 0.9);
    holo.uniforms.glow.value = 0.5 * Math.max(0, 1 - Math.abs(t - T_HERO) * 4);
    inner.position.set(0, tearY + 0.1, 0.25);
    inner.intensity = 10 * prog(t, T_TEAR + 0.2, T_RIP) * (1 - prog(t, T_DROP, T_DROP + 0.5));

    spark.uniforms.uT.value = t;
    spark.uniforms.uOn.value = prog(t, T_RISE, T_HERO);

    const cz = camZ * (1.06 - 0.06 * easeInOut(prog(t, 0, T_TEAR)) + 0.04 * c);
    camera.position.set(0, 0.05, cz);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);

    rays.style.opacity = 0.9 * prog(t, T_RISE, T_HERO);
    rays.style.transform = `rotate(${t * 9}deg)`;
    word.style.opacity = prog(t, T_DROP, T_HERO);
    word.style.transform = `translate(-50%,-50%) scale(${1.12 - 0.12 * easeOut(prog(t, T_DROP, DUR))})`;
    flash.style.opacity = Math.max(0, 1 - Math.abs(t - T_RIP) / 0.25) * 0.85 + Math.max(0, 1 - Math.abs(t - T_HERO) / 0.2) * 0.35;
  }
  return { render, resize };
}
