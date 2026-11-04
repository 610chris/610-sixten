/* STARTING 5IVE メンバー個人ページ共通: オープニングの再生エンジン（2026-11-04）
   使い方: runIntro({ key, duration, gl: true/false, setup: async (ctx) => ({ render(t), resize?() }) })
   - 演出は「時刻 t（秒）の純関数」として書く → ?introt=2.4 でその瞬間に止めて撮影確認できる
   - WebGL が使えない／素材の読み込みが 2.5 秒を超えた時は、演出を出さずに本文へ（待たせない）
   - タップ・クリック・Esc/Enter/Space でスキップ。sessionStorage で 1 セッション 1 回 */
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
      scene.render(t);
      if (t >= opt.duration) { finish(); return; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  } catch (e) {
    finish();
  }
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
