/* ニコラスのカード（NBA 2K Mobile 風）の絵を canvas に描く（2026-11-05）
   オープニング（nicholas.js）のカードの表と、ページ上部のカード画像（assets/s5/nicholas/card-2k.webp）の両方の元。
   見本: NBA 2K Mobile 公式サイト（nba2kmobile.com/nba2kmobile-news）の Curry / LeBron カード。
     上=選手の大きな絵＋装飾の枠、左右に丸いバッジ（エンブレム／ポジション）、
     下=質感のあるプレートに装飾書体の名前、その下に「LVL」「T(ティア)＋PWR 数値＋S(シーズン)」の楕円、宝石、★x/5。
   クリス指示（2026-11-04）「あんま強くないな、これ、みたいなぐらいのカードのライン」
     → 公式の見本は Curry T28・717.4K、LeBron T35・7.036M。ニコラスは T9・31.6K・LVL 1・★1/5 にする。 */

export const CARD = { tier: 'T9', pwr: '31.6K', season: 'S5', lvl: '1', stars: '1/5', pos: 'YT', name: 'NICHOLAS' };

const GOLD = '#e9c46a';
function cv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function rand(seed) { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let r = Math.imul(s ^ (s >>> 15), 1 | s); r ^= r + Math.imul(r ^ (r >>> 7), 61 | r); return ((r ^ (r >>> 14)) >>> 0) / 4294967296; }; }
function metal(g, x0, y0, x1, y1, stops) { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; }
const BRONZE = [[0, '#f6dc9a'], [0.22, '#b07a32'], [0.45, '#fff0c2'], [0.62, '#8a5a22'], [0.85, '#e2b462'], [1, '#6b4419']];

/* 角の飾り（小さな菱形＋渦）。2K Mobile の装飾枠の雰囲気 */
function ornament(g, x, y, sx, sy) {
  g.save(); g.translate(x, y); g.scale(sx, sy);
  g.fillStyle = metal(g, 0, 0, 40, 40, BRONZE);
  g.beginPath(); g.moveTo(0, -16); g.lineTo(10, 0); g.lineTo(0, 16); g.lineTo(-10, 0); g.closePath(); g.fill();
  g.strokeStyle = '#3a240c'; g.lineWidth = 1.5; g.stroke();
  g.lineWidth = 4; g.strokeStyle = metal(g, 0, 0, 60, 0, BRONZE);
  g.beginPath(); g.moveTo(12, 0); g.bezierCurveTo(30, -2, 40, 10, 32, 18); g.stroke();
  g.beginPath(); g.moveTo(0, 18); g.bezierCurveTo(-2, 34, 10, 44, 18, 36); g.stroke();
  g.restore();
}

/* 丸いバッジ（左=エンブレム、右=ポジション） */
function badge(g, x, y, r, label, kind) {
  g.save();
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 12; g.shadowOffsetY = 4;
  g.fillStyle = metal(g, x - r, y - r, x + r, y + r, kind === 'pos' ? [[0, '#5b5b5b'], [0.5, '#1d1d1d'], [1, '#444']] : [[0, '#f2f4f6'], [0.4, '#8f9aa3'], [0.7, '#e3e8ec'], [1, '#5d6870']]);
  g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  g.shadowColor = 'transparent';
  g.lineWidth = 3; g.strokeStyle = metal(g, x - r, y - r, x + r, y + r, BRONZE); g.stroke();
  if (kind === 'pos') {
    g.fillStyle = '#f3f3f3'; g.font = '600 ' + Math.round(r * 1.05) + 'px "Teko", "Archivo Black", sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, x, y + r * 0.08);
  } else {
    // コレクションのエンブレム: ボールの線（銀地に濃い線）
    g.strokeStyle = '#33404a'; g.lineWidth = 2.6;
    g.beginPath(); g.arc(x, y, r * 0.58, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(x - r * 0.58, y); g.lineTo(x + r * 0.58, y); g.stroke();
    g.beginPath(); g.moveTo(x, y - r * 0.58); g.lineTo(x, y + r * 0.58); g.stroke();
    g.beginPath(); g.ellipse(x - r * 0.62, y, r * 0.42, r * 0.5, 0, -Math.PI / 2.6, Math.PI / 2.6); g.stroke();
    g.beginPath(); g.ellipse(x + r * 0.62, y, r * 0.42, r * 0.5, 0, Math.PI - Math.PI / 2.6, Math.PI + Math.PI / 2.6); g.stroke();
  }
  g.restore();
}

/* 宝石（ティアの結晶）: 縦長の六角形 */
function gem(g, x, y, w, h) {
  g.save();
  const pts = [[x, y - h / 2], [x + w / 2, y - h / 2 + w * 0.45], [x + w / 2, y + h / 2 - w * 0.45], [x, y + h / 2], [x - w / 2, y + h / 2 - w * 0.45], [x - w / 2, y - h / 2 + w * 0.45]];
  g.beginPath(); pts.forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.closePath();
  g.shadowColor = 'rgba(79,209,165,.8)'; g.shadowBlur = 18;
  g.fillStyle = metal(g, x - w / 2, y - h / 2, x + w / 2, y + h / 2, [[0, '#d9fff1'], [0.3, '#4fd1a5'], [0.55, '#0d6b52'], [0.8, '#7ff0c8'], [1, '#08402f']]);
  g.fill();
  g.shadowColor = 'transparent';
  g.lineWidth = 3; g.strokeStyle = '#e8d29a'; g.stroke();
  g.globalAlpha = 0.6; g.fillStyle = '#fff';
  g.beginPath(); g.moveTo(x - w * 0.18, y - h * 0.34); g.lineTo(x - w * 0.02, y - h * 0.38); g.lineTo(x - w * 0.12, y + h * 0.1); g.closePath(); g.fill();
  g.restore();
}

function star(g, x, y, r) {
  g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  g.closePath();
}

/* 表の絵（650x910 の座標で描く。k 倍の解像度で出力）と、ホログラムの効き具合マスク */
export function cardArt(photo, k = 2) {
  const W = 650, H = 910;
  const [c, g] = cv(W * k, H * k), [m, f] = cv(W * k, H * k);
  g.scale(k, k); f.scale(k, k);
  const R = rand(504);
  f.fillStyle = '#000'; f.fillRect(0, 0, W, H);

  g.save(); rr(g, 0, 0, W, H, 30); g.clip();
  // 地: 暗い茶金
  g.fillStyle = metal(g, 0, 0, W, H, [[0, '#2b1d0c'], [0.5, '#0d0a06'], [1, '#24180a']]); g.fillRect(0, 0, W, H);

  /* 上: 選手の絵。後ろにティアの色の光（低ティアなので控えめな青緑） */
  const ax = 30, ay = 30, aw = W - 60, ah = 590;
  g.save(); rr(g, ax, ay, aw, ah, 18); g.clip();
  const s = Math.max(aw / photo.width, ah / photo.height), sw = aw / s, sh = ah / s;
  g.drawImage(photo, (photo.width - sw) / 2, Math.max(0, (photo.height - sh) * 0.2), sw, sh, ax, ay, aw, ah);
  // 色をカードの世界に寄せる（暗部を沈め、周囲に光）
  let gr = g.createRadialGradient(W / 2, ay + ah * 0.42, ah * 0.15, W / 2, ay + ah * 0.45, ah * 0.75);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(6,20,18,.78)');
  g.fillStyle = gr; g.fillRect(ax, ay, aw, ah);
  g.globalCompositeOperation = 'screen';
  gr = g.createLinearGradient(ax, ay, ax + aw, ay + ah);
  gr.addColorStop(0, 'rgba(79,209,165,.28)'); gr.addColorStop(0.5, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(233,196,106,.30)');
  g.fillStyle = gr; g.fillRect(ax, ay, aw, ah);
  // 粒子（きらきら）
  for (let i = 0; i < 70; i++) {
    const px = ax + R() * aw, py = ay + R() * ah * 0.95, pr = 0.6 + R() * 2.2;
    g.fillStyle = `rgba(255,${200 + R() * 55 | 0},${140 + R() * 80 | 0},${0.25 + R() * 0.6})`;
    g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.fill();
  }
  g.globalCompositeOperation = 'source-over';
  // 下側はプレートに溶ける
  gr = g.createLinearGradient(0, ay + ah - 190, 0, ay + ah); gr.addColorStop(0, 'rgba(10,8,5,0)'); gr.addColorStop(1, 'rgba(10,8,5,.95)');
  g.fillStyle = gr; g.fillRect(ax, ay + ah - 190, aw, 190);
  g.restore();
  f.save(); rr(f, ax, ay, aw, ah, 18); f.fillStyle = '#1e1e1e'; f.fill(); f.restore();

  /* 枠（ブロンズ・二重）＋上の紋章＋四隅の飾り */
  g.lineWidth = 14; g.strokeStyle = metal(g, 0, 0, W, H, BRONZE); rr(g, 9, 9, W - 18, H - 18, 24); g.stroke();
  g.lineWidth = 2; g.strokeStyle = '#3a240c'; rr(g, 17, 17, W - 34, H - 34, 20); g.stroke();
  g.lineWidth = 4; g.strokeStyle = metal(g, 0, ay, 0, ay + ah, BRONZE); rr(g, ax - 2, ay - 2, aw + 4, ah + 4, 19); g.stroke();
  f.save(); f.lineWidth = 16; f.strokeStyle = '#fff'; rr(f, 9, 9, W - 18, H - 18, 24); f.stroke(); f.restore();
  ornament(g, 44, 46, 1, 1); ornament(g, W - 44, 46, -1, 1);
  // 上中央の紋章（S5 の盾）
  g.save();
  g.fillStyle = metal(g, W / 2 - 40, 8, W / 2 + 40, 70, BRONZE);
  g.beginPath(); g.moveTo(W / 2 - 46, 14); g.lineTo(W / 2 + 46, 14); g.lineTo(W / 2 + 40, 44); g.quadraticCurveTo(W / 2, 74, W / 2 - 40, 44); g.closePath(); g.fill();
  g.lineWidth = 2; g.strokeStyle = '#3a240c'; g.stroke();
  g.fillStyle = '#2a1a08'; g.font = '400 24px "Archivo Black", sans-serif'; g.textAlign = 'center'; g.fillText('S5', W / 2, 44);
  g.restore();

  /* 左右の丸バッジ（絵とプレートの境目） */
  badge(g, 74, 560, 36, '', 'emb');
  badge(g, W - 74, 560, 36, CARD.pos, 'pos');

  /* 下: プレート（石目のブロンズ）。上辺は名前の所だけ山になる */
  const py = 606;
  g.save();
  g.beginPath();
  g.moveTo(14, py + 26); g.lineTo(150, py + 26); g.quadraticCurveTo(170, py + 26, 182, py + 8); g.lineTo(196, py - 8);
  g.lineTo(W - 196, py - 8); g.lineTo(W - 182, py + 8); g.quadraticCurveTo(W - 170, py + 26, W - 150, py + 26); g.lineTo(W - 14, py + 26);
  g.lineTo(W - 14, H - 14); g.lineTo(14, H - 14); g.closePath();
  g.fillStyle = metal(g, 0, py, 0, H, [[0, '#3a2c1a'], [0.5, '#22180c'], [1, '#2f2214']]); g.fill();
  g.save(); g.clip();
  for (let i = 0; i < 2600; i++) { // 石目
    const x = R() * W, y = py - 10 + R() * (H - py + 10), v = R();
    g.fillStyle = v > 0.5 ? `rgba(255,236,190,${0.04 + R() * 0.08})` : `rgba(0,0,0,${0.1 + R() * 0.2})`;
    g.fillRect(x, y, 1 + R() * 2.5, 1 + R() * 2.5);
  }
  g.restore();
  g.lineWidth = 5; g.strokeStyle = metal(g, 0, 0, W, 0, BRONZE); g.stroke();
  g.restore();

  /* 名前（装飾書体・金のグラデーション・濃い縁） */
  g.save();
  g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  g.font = '900 66px "Cinzel Decorative", "Zen Old Mincho", serif';
  let nw = g.measureText(CARD.name).width; if (nw > 430) g.font = `900 ${Math.floor(66 * 430 / nw)}px "Cinzel Decorative", "Zen Old Mincho", serif`;
  g.lineJoin = 'round'; g.lineWidth = 9; g.strokeStyle = '#1c1206'; g.strokeText(CARD.name, W / 2, py + 62);
  g.fillStyle = metal(g, 0, py + 10, 0, py + 66, [[0, '#fff6d8'], [0.45, '#f1cf7c'], [0.55, '#a8742a'], [1, '#f7dd94']]);
  g.fillText(CARD.name, W / 2, py + 62);
  g.font = '700 20px "Noto Sans JP", sans-serif'; g.fillStyle = '#e8d29a'; g.fillText('ニコラス武', W / 2, py + 92);
  g.restore();

  /* LVL ／ T・PWR・S の楕円 ／ 宝石 ／ ★1/5 */
  const ry = 786;
  g.save();
  g.textAlign = 'center';
  g.fillStyle = '#e8cf8f'; g.font = '400 30px "Cinzel Decorative", "Zen Old Mincho", serif';
  g.fillText('LVL', 92, ry - 10);
  g.font = '600 50px "Teko", sans-serif'; g.fillText(CARD.lvl, 92, ry + 34);
  // 楕円（銀の縁・紺の中）
  const lx = 160, lw = 300, lt = ry - 50, lh = 104;
  g.shadowColor = 'rgba(0,0,0,.7)'; g.shadowBlur = 16;
  g.fillStyle = metal(g, lx, lt, lx + lw, lt + lh, [[0, '#f4f6f8'], [0.35, '#7b8794'], [0.6, '#e6eaee'], [1, '#56616c']]);
  rr(g, lx, lt, lw, lh, lh / 2); g.fill();
  g.shadowColor = 'transparent';
  g.fillStyle = metal(g, 0, lt, 0, lt + lh, [[0, '#1b2140'], [0.5, '#0a0d1e'], [1, '#161a33']]);
  rr(g, lx + 6, lt + 6, lw - 12, lh - 12, (lh - 12) / 2); g.fill();
  // ティアのタブ（上）
  g.fillStyle = '#0c0f22'; g.strokeStyle = '#c7ced6'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(lx + 90, lt - 2); g.lineTo(lx + lw - 90, lt - 2); g.lineTo(lx + lw - 104, lt + 24); g.lineTo(lx + 104, lt + 24); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#dfe6ff'; g.font = '600 24px "Teko", sans-serif'; g.fillText(CARD.tier, lx + lw / 2, lt + 21);
  // PWR の数字（薄紫のグラデーション・斜体）
  g.save(); g.translate(lx + lw / 2, ry + 26); g.transform(1, 0, -0.12, 1, 0, 0);
  g.font = '600 74px "Teko", sans-serif';
  g.fillStyle = metal(g, 0, -56, 0, 0, [[0, '#f2f0ff'], [0.55, '#b9b5ff'], [1, '#7d86ff']]);
  g.fillText(CARD.pwr, 0, 0);
  g.restore();
  g.fillStyle = '#c7ced6'; g.font = '600 22px "Teko", sans-serif'; g.fillText(CARD.season, lx + lw / 2, lt + lh - 2);
  // 宝石
  gem(g, lx + lw + 26, ry - 2, 30, 94);
  // ★ 1/5
  g.fillStyle = '#e9c46a'; star(g, W - 92, ry - 22, 15); g.fill();
  g.fillStyle = '#e8cf8f'; g.font = '600 40px "Teko", sans-serif'; g.fillText(CARD.stars, W - 92, ry + 28);
  g.restore();

  // 一番下の小さな文字
  g.fillStyle = 'rgba(232,210,154,.55)'; g.font = '400 13px "Archivo Black", sans-serif'; g.textAlign = 'center';
  g.fillText('STARTING 5IVE  ·  NBA YOUTUBER  ·  SINCE 2018', W / 2, H - 30);
  g.restore();

  // ホロの効き: 枠・紋章は強め、プレートと数字は効かせない（読ませる）
  // 紋章は盾の形どおりに（四角で塗ると盾の下の写真に虹の四角が出る）
  f.save(); f.fillStyle = '#9a9a9a';
  f.beginPath(); f.moveTo(W / 2 - 46, 14); f.lineTo(W / 2 + 46, 14); f.lineTo(W / 2 + 40, 44); f.quadraticCurveTo(W / 2, 74, W / 2 - 40, 44); f.closePath(); f.fill();
  f.restore();
  return [c, m];
}
