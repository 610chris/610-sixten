/* バンバ個人ページのオープニング（2026-11-04）
   超リアルなバスケットボールが回る（背景は拍ごとに色替え）→ 止まって割れ目から光 → 砕け散る → BAMBA
   演出はすべて時刻 t の純関数。?introt=秒 でその瞬間を確認できる */
import { runIntro, prog, easeOut, easeIn, easeInOut, rand, loadTex } from './core.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const DUR = 4.8;
const T_STOP = 2.5;   // 回転が止まる
const T_OPEN = 2.6;   // 割れ目が開き始める
const T_BREAK = 3.1;  // 砕ける
const TEAL = 0x2bb3ad;
const BEATS = ['#0f3f3d', '#c2410c', '#1e1b4b', '#9f1239', '#0e7490', '#b45309', '#14532d'];
const BEAT = 0.36;

runIntro({ key: 'bamba', duration: DUR, gl: true, setup });

async function setup(ctx) {
  const THREE = ctx.THREE;
  const { renderer, el, lay } = ctx;
  const base = new URL('../../assets/s5/intro/', import.meta.url).href;
  const [albedo, normal, rough] = await Promise.all([
    loadTex(THREE, base + 'ball_albedo.webp'),
    loadTex(THREE, base + 'ball_normal.webp', false),
    loadTex(THREE, base + 'ball_rough.webp', false),
  ]);

  /* 背面の巨大文字（canvas の後ろ）と前面の文字・フラッシュ */
  const back = document.createElement('div');
  back.className = 'bm-back';
  back.textContent = 'BAMBA';
  el.insertBefore(back, ctx.canvas);
  const WORD = 'バスケは酸素';
  lay.innerHTML = '<div class="bm-flash"></div><div class="bm-title"><b>' + [...WORD].map((ch) => '<i>' + ch + '</i>').join('') + '</b><span>BAMBA&nbsp;&nbsp;/&nbsp;&nbsp;SPORTS MC</span></div>';
  // 極太の書体（Zen Kaku Gothic New 900）を待つ。遅くても 1.2 秒で先へ
  try { await Promise.race([document.fonts.load('900 80px "Zen Kaku Gothic New"', WORD), new Promise((r) => setTimeout(r, 1200))]); } catch (e) { /* 代わりの書体で出す */ }
  const flash = lay.querySelector('.bm-flash');
  const title = lay.querySelector('.bm-title');
  const chars = [...title.querySelectorAll('i')];
  const style = document.createElement('style');
  style.textContent = `
    .bm-back{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-family:"Archivo Black",sans-serif;font-size:min(34vw,46vh);line-height:1;letter-spacing:-.02em;color:rgba(255,255,255,.13);white-space:nowrap;pointer-events:none}
    .bm-flash{position:absolute;inset:0;background:radial-gradient(circle at 50% 50%,#fff 0,#e9fffd 30%,rgba(43,179,173,.0) 75%);opacity:0}
    .bm-title{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;opacity:0}
    .bm-title b{display:block;font-family:"Zen Kaku Gothic New","Noto Sans JP",sans-serif;font-weight:900;font-size:min(13.5vw,19vh);line-height:1;letter-spacing:.02em;color:#fff;white-space:nowrap;text-shadow:0 .04em 0 #1a6f6b,0 0 .5em rgba(43,179,173,.55)}
    .bm-title i{display:inline-block;font-style:normal;opacity:0}
    .bm-title span{display:inline-block;margin-top:1.4em;font-family:"Archivo Black",sans-serif;font-size:clamp(12px,1.5vw,16px);letter-spacing:.34em;color:#2bb3ad}`;
  el.appendChild(style);

  /* シーン */
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.32;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const key = new THREE.DirectionalLight(0xffffff, 3.2); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(TEAL, 3.2); rim.position.set(4, -1, -4); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffd7b0, 0.5); fill.position.set(4, 1, 3); scene.add(fill);
  const glow = new THREE.PointLight(TEAL, 0, 6, 1.5); scene.add(glow);

  const outerMat = new THREE.MeshStandardMaterial({ map: albedo, normalMap: normal, roughnessMap: rough, roughness: 1, metalness: 0, normalScale: new THREE.Vector2(1.1, 1.1) });
  const innerMat = new THREE.MeshStandardMaterial({ color: 0x1b1714, roughness: 0.9, metalness: 0 });
  const coreMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(TEAL).multiplyScalar(2.2), toneMapped: false, transparent: true });

  const sc = document.createElement('canvas'); sc.width = sc.height = 256;
  const sg = sc.getContext('2d'), gr = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(0.35, 'rgba(0,0,0,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  sg.fillStyle = gr; sg.fillRect(0, 0, 256, 256);
  const shadowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, toneMapped: false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), shadowMat);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.18;
  scene.add(shadow);
  const ball = new THREE.Group();
  ball.rotation.z = 0.32;
  scene.add(ball);
  const spin = new THREE.Group();
  ball.add(spin);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 48, 24), coreMat);
  spin.add(core);

  /* ボールをボロノイ分割して破片を作る（外面=ボール、内面=ゴム） */
  const R = rand(610);
  const N = 34;
  const seeds = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), a = i * 2.39996 + R() * 0.5;
    seeds.push(new THREE.Vector3(Math.cos(a) * r, y + (R() - 0.5) * 0.12, Math.sin(a) * r).normalize());
  }
  const src = new THREE.SphereGeometry(1, 128, 64).toNonIndexed();
  const P = src.attributes.position.array, U = src.attributes.uv.array, NO = src.attributes.normal.array;
  const buckets = seeds.map(() => ({ p: [], u: [], n: [] }));
  const c = new THREE.Vector3();
  for (let t = 0; t < P.length / 9; t++) {
    const o = t * 9;
    c.set(P[o] + P[o + 3] + P[o + 6], P[o + 1] + P[o + 4] + P[o + 7], P[o + 2] + P[o + 5] + P[o + 8]).normalize();
    // 境界をギザギザにするため、判定点を少し揺らす
    c.x += Math.sin(c.y * 23 + c.z * 17) * 0.035; c.y += Math.sin(c.z * 19 + c.x * 29) * 0.035;
    let best = 0, bd = -2;
    for (let s = 0; s < N; s++) { const d = c.dot(seeds[s]); if (d > bd) { bd = d; best = s; } }
    const b = buckets[best];
    for (let k = 0; k < 9; k++) { b.p.push(P[o + k]); b.n.push(NO[o + k]); }
    for (let k = 0; k < 6; k++) b.u.push(U[t * 6 + k]);
  }
  const frags = [];
  buckets.forEach((b, i) => {
    if (!b.p.length) return;
    const ctr = new THREE.Vector3();
    for (let k = 0; k < b.p.length; k += 3) ctr.x += b.p[k], ctr.y += b.p[k + 1], ctr.z += b.p[k + 2];
    ctr.divideScalar(b.p.length / 3);
    const op = new Float32Array(b.p.length), ip = new Float32Array(b.p.length), inn = new Float32Array(b.p.length);
    for (let k = 0; k < b.p.length; k += 9) {
      for (let v = 0; v < 3; v++) {
        const s = k + v * 3, d = k + [0, 2, 1][v] * 3; // 内面は巻き順を反転
        for (let a = 0; a < 3; a++) {
          op[s + a] = b.p[s + a] - ctr.getComponent(a);
          ip[d + a] = b.p[s + a] * 0.93 - ctr.getComponent(a);
          inn[d + a] = -b.n[s + a];
        }
      }
    }
    const og = new THREE.BufferGeometry();
    og.setAttribute('position', new THREE.BufferAttribute(op, 3));
    og.setAttribute('normal', new THREE.Float32BufferAttribute(b.n, 3));
    og.setAttribute('uv', new THREE.Float32BufferAttribute(b.u, 2));
    const ig = new THREE.BufferGeometry();
    ig.setAttribute('position', new THREE.BufferAttribute(ip, 3));
    ig.setAttribute('normal', new THREE.BufferAttribute(inn, 3));
    const g = new THREE.Group();
    g.add(new THREE.Mesh(og, outerMat), new THREE.Mesh(ig, innerMat));
    g.position.copy(ctr);
    spin.add(g);
    const dir = ctr.clone().normalize();
    const axis = new THREE.Vector3(R() - 0.5, R() - 0.5, R() - 0.5).normalize();
    frags.push({ g, ctr, dir, axis, open: 0.03 + R() * 0.05, speed: 3.2 + R() * 3.4, rot: (R() - 0.5) * 14, drift: new THREE.Vector3(R() - 0.5, R() - 0.2, R() - 0.5).multiplyScalar(1.6) });
  });
  src.dispose();

  let camZ = 7;
  function resize() {
    const a = innerWidth / innerHeight;
    camera.aspect = a;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camZ = Math.max(1.32 / half, 1.32 / (half * a));
    camera.updateProjectionMatrix();
  }
  resize();

  const q = new THREE.Quaternion(), tmp = new THREE.Vector3();
  function render(t) {
    /* 背景: 拍ごとに色が切り替わる（砕けた後は黒へ） */
    const beat = Math.floor(t / BEAT);
    const col = t < T_OPEN ? BEATS[beat % BEATS.length] : '#050505';
    el.style.background = `radial-gradient(120% 95% at 50% 45%, ${col} 0%, #050505 100%)`;
    back.style.opacity = t < T_OPEN ? 1 : Math.max(0, 1 - (t - T_OPEN) * 3);
    back.style.transform = `translate(-50%,-50%) scale(${1 + t * 0.03})`;

    /* ボール: 登場 → 減速しながら回転 → 停止 */
    const inP = easeOut(prog(t, 0, 0.6));
    ball.scale.setScalar(0.55 + 0.45 * inP);
    ball.position.y = (1 - inP) * 0.9 + Math.sin(t * 2.2) * 0.03;
    const ts = Math.min(t, T_STOP);
    spin.rotation.y = 15 * (ts - (ts * ts) / (2 * T_STOP)) + 0.4;
    spin.rotation.x = Math.sin(ts * 1.7) * 0.18;

    /* 割れ目が開く → 砕ける */
    const openP = easeInOut(prog(t, T_OPEN, T_BREAK));
    const tb = Math.max(0, t - T_BREAK);
    const shake = t > T_OPEN && t < T_BREAK ? Math.sin(t * 90) * 0.012 * openP : 0;
    ball.position.x = shake;
    shadow.scale.setScalar(ball.scale.x * (1 + Math.max(0, ball.position.y) * 0.3));
    shadowMat.opacity = inP * (t < T_BREAK ? 1 - openP * 0.3 : Math.max(0, 0.7 - tb * 3));
    for (const f of frags) {
      tmp.copy(f.dir).multiplyScalar(f.open * openP + f.speed * tb * (1 - 0.12 * tb));
      tmp.addScaledVector(f.drift, tb * tb * 0.8);
      f.g.position.copy(f.ctr).add(tmp);
      q.setFromAxisAngle(f.axis, f.rot * tb * (1 - 0.1 * tb));
      f.g.quaternion.copy(q);
      f.g.visible = tb < 2.2;
    }
    glow.intensity = 14 * openP * (tb > 0 ? Math.max(0, 1 - tb * 2.5) : 1);
    core.scale.setScalar(1 + easeOut(prog(t, T_BREAK, T_BREAK + 0.25)) * 0.9);
    coreMat.opacity = t < T_BREAK ? 1 : Math.max(0, 1 - tb / 0.18);
    rim.intensity = 3.2 + openP * 3;

    /* カメラ: ゆっくり寄る → 砕けた瞬間に少し引く */
    const cz = camZ * (1.08 - 0.08 * easeInOut(prog(t, 0, T_OPEN)) + 0.12 * easeOut(prog(t, T_BREAK, T_BREAK + 0.8)));
    camera.position.set(0, cz * 0.13, cz);
    camera.lookAt(0, -0.08, 0);
    renderer.render(scene, camera);

    /* フラッシュと前面タイトル */
    flash.style.opacity = t < T_BREAK ? openP * 0.25 : Math.max(0, 1 - tb / 0.35);
    const tp = easeOut(prog(t, T_BREAK + 0.1, T_BREAK + 1.2));
    title.style.opacity = (t > T_BREAK ? 1 : 0) * (1 - easeIn(prog(t, DUR - 0.25, DUR)));
    title.style.transform = `translateY(-50%) scale(${1.04 - 0.04 * tp})`;
    // 1文字ずつ叩きつける（大きく→ドン）
    chars.forEach((ch, i) => {
      const p = prog(t, T_BREAK + 0.1 + i * 0.07, T_BREAK + 0.3 + i * 0.07);
      ch.style.opacity = p > 0 ? 1 : 0;
      ch.style.transform = `scale(${1 + (1 - easeOut(p)) * 1.6}) translateY(${(1 - easeOut(p)) * -0.08}em)`;
      ch.style.filter = p < 1 ? `blur(${(1 - p) * 6}px)` : 'none';
    });
  }
  return { render, resize };
}
