/* STARTING 5IVE メンバー個人ページ共通: オープニングの再生エンジン（2026-11-04）
   使い方: runIntro({ key, duration, gl: true/false, setup: async (ctx) => ({ render(t), resize?() }) })
   - 演出は「時刻 t（秒）の純関数」として書く → ?introt=2.4 でその瞬間に止めて撮影確認できる
   - WebGL が使えない／素材の読み込みが 2.5 秒を超えた時は、演出を出さずに本文へ（待たせない）
   - タップ・クリック・Esc/Enter/Space でスキップ。再読み込みのたびに毎回再生（2026-11-05 クリス指示） */
let glHold = false; // 音が出るまでの間、指を置いている間は WebGL の描画を飛ばす（下の introTouch）
export async function runIntro(opt) {
  const el = document.getElementById('s5-intro');
  const root = document.documentElement;
  if (!el) return;
  if (!root.classList.contains('s5-intro-on')) { el.remove(); return; }
  try { sessionStorage.setItem('s5IntroSeen:' + opt.key, '1'); } catch (e) { /* 保存できなくても再生は続ける */ }

  const q = new URLSearchParams(location.search);
  const freeze = q.has('introt') ? parseFloat(q.get('introt')) : null;
  let done = false, raf = 0, three = null, renderer = null;

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    el.classList.add('out');
    root.classList.remove('s5-intro-on');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      try { if (renderer) { renderer.dispose(); renderer.forceContextLoss(); } } catch (e) { /* noop */ }
      el.remove();
    }, 650);
  }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish(); }
  if (freeze === null) {
    el.addEventListener('click', finish);
    document.addEventListener('keydown', onKey);
  }

  const canvas = el.querySelector('canvas');
  const ctx = { el, canvas, lay: el.querySelector('.lay'), W: innerWidth, H: innerHeight, freeze };
  const dpr = Math.min(window.devicePixelRatio || 1, innerWidth < 700 ? 1.75 : 2);
  ctx.dpr = dpr;

  try {
    if (opt.gl) {
      three = await import('three');
      renderer = new three.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(dpr);
      renderer.setSize(innerWidth, innerHeight, false);
      renderer.outputColorSpace = three.SRGBColorSpace;
      renderer.toneMapping = three.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const draw = renderer.render.bind(renderer);
      renderer.render = (s, c) => { if (!glHold) draw(s, c); };
      ctx.THREE = three; ctx.renderer = renderer;
    }
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), freeze === null ? 2500 : 20000));
    const scene = await Promise.race([opt.setup(ctx), timeout]);
    if (done) return;
    el.classList.add('live');
    const onResize = () => {
      ctx.W = innerWidth; ctx.H = innerHeight;
      if (renderer) renderer.setSize(innerWidth, innerHeight, false);
      if (scene.resize) scene.resize();
    };
    addEventListener('resize', onResize);
    if (freeze !== null) {
      // 止め撮り: 同じ瞬間を描き続ける（WebGL は1回描きだと撮影時に消えることがある）
      onResize();
      const still = () => { scene.render(freeze); raf = requestAnimationFrame(still); };
      raf = requestAnimationFrame(still);
      return;
    }
    const t0 = performance.now();
    const loop = (now) => {
      if (done) return;
      const t = (now - t0) / 1000;
      if (!(opt.holdDraw && glHold)) scene.render(t); // holdDraw: 2D のページは描画ごと飛ばす（演出は時刻の純関数なので次のフレームで追いつく）
      if (t >= opt.duration) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  } catch (e) {
    finish();
  }
}

/* スマホ: ブラウザのスクロールとして扱われた指の動きは「操作」と認められず、音を許可できない（2026-11-05 指示89・90）。
   そこで音が出るまでの間だけ touch-action:none にして JS でスクロールさせる。指を離した瞬間が操作になり音が出る。
   音が出た・幕が終わった時点でブラウザの普通のスクロールに戻す（メインの s5-lineup.js と同じ方式）
   描画が重いと、指を離しても操作と認められず音が出ない（シミュレーターの実測: 1フレーム23msで0/4、指の間だけ止めると3/3）。
   そこで音が出るまでの間は、指を置いている間と離して0.3秒だけ WebGL の描画を飛ばす。演出の時刻は進み続ける */
export function introTouch(el, soundOn) {
  const root = document.documentElement, body = document.body;
  if (!(('ontouchstart' in window) || navigator.maxTouchPoints > 0)) return;
  let tY = 0, tT = 0, tV = 0, tRaf = 0, timer = 0, hold = 0;
  const toY = (d) => window.scrollBy({ top: d, left: 0, behavior: 'instant' });
  const tStart = (e) => { clearTimeout(hold); glHold = true; cancelAnimationFrame(tRaf); tY = e.touches[0].clientY; tT = e.timeStamp; tV = 0; };
  const tMove = (e) => {
    const y = e.touches[0].clientY, d = tY - y;
    toY(d);
    tV = 0.8 * d / Math.max(1, e.timeStamp - tT) + 0.2 * tV; tY = y; tT = e.timeStamp;
  };
  const tEnd = (e) => {
    if (e.touches.length) return;
    clearTimeout(hold); hold = setTimeout(() => { glHold = false; }, 300);
    (function step() { if (Math.abs(tV) < 0.03) return; toY(tV * 16); tV *= 0.95; tRaf = requestAnimationFrame(step); })();
  };
  const tCancel = () => { clearTimeout(hold); glHold = false; };
  const free = () => {
    clearInterval(timer); clearTimeout(hold); glHold = false;
    removeEventListener('touchcancel', tCancel);
    root.style.touchAction = ''; body.style.touchAction = '';
    removeEventListener('touchstart', tStart); removeEventListener('touchmove', tMove); removeEventListener('touchend', tEnd);
  };
  root.style.touchAction = 'none'; body.style.touchAction = 'none';
  addEventListener('touchstart', tStart, { passive: false }); addEventListener('touchmove', tMove, { passive: false }); addEventListener('touchend', tEnd, { passive: false }); addEventListener('touchcancel', tCancel);
  timer = setInterval(() => { if (soundOn() || !el.isConnected || !root.classList.contains('s5-intro-on')) free(); }, 200);
}

/* 演出用の小道具 */
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const easeOut = (x) => 1 - Math.pow(1 - x, 3);
export const easeIn = (x) => x * x * x;
export const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export function rand(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let r = Math.imul(s ^ (s >>> 15), 1 | s); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
export function loadTex(THREE, url, srgb = true) {
  return new Promise((res, rej) => new THREE.TextureLoader().load(url, (t) => { if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; res(t); }, undefined, rej));
}
