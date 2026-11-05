/* リクト（RIKUTO AF）のオープニング（2026-11-05 第10版・8.95秒）
   第10版（p_rk9）: 優勝パレードの別カット parade-01〜120 を足し、めくる写真は1回ずつ配る（同じ写真が二度出ない・最後のバスだけ固定）
   第8版: ・手本に無い「寄り（ズームイン）」を全部やめた（冒頭のぼけた写真 1.5→1.6倍・めくりの各コマの中の +3.5% 寄り）。
           手本はどのカットもカメラが寄らない（動くのは文字が縮むことだけ）: p_rk7/clips.md
         ・白い RIKUTO AF が出きったら 0.9秒見せる（溜め。第9版: 止めずに手本どおりゆっくり縮み続ける）→ 0.75秒（前は0.6秒）かけて見出しへ移る
         ・9秒以内に収めるため、黒 0.2→0.1秒・ぼけ 0.4→0.3秒・めくり〜白を手本の 0.945倍の時間（5.5%速いだけ・カット順と並びは同じ）
   第7版: 第6版（マーベルの手本のカットを秒まで同じにした版）のカット順はそのまま、
     ・最後の「黒へ暗転」をやめ、白い RIKUTO AF がそのままページの見出し RIKUTO AF の位置・大きさ・色へ移って重なり、本物の見出しに入れ替わる
     ・長さを 13.35秒 → 8.95秒（冒頭の黒 1.2→0.2秒・ぼけ 0.65→0.4秒・白文字のゆっくり縮む所 2.9→0.45秒。めくり〜大ヒットは手本と等倍）
     第9版（p_rk8・2026-11-05）: 「急に静止画みたいな瞬間」を無くす（手本は黒が明けてから白文字まで1コマも止まらない）
        ・黒 0.1秒 → フェードイン 0.45秒（0.3→0.45・毎コマ明るくなり続ける）
        ・めくりの各コマも止めない: 写真が流れる向きへ平行に滑り、後半で次のページが端から差し込む（めくれ）。大きさは変えない＝寄らない
        ・白い RIKUTO AF の溜め 0.9秒は、読める大きさのまま手本⑥どおりゆっくり縮み続ける＋背景がゆっくり暗くなる（止めない）
        ・9秒以内に収めるため、めくり〜白を手本の 0.92倍の時間（第8版 0.945）
    第10版（p_rk10・2026-11-05）: 「揺れ」をやめる・黒からのフェードインで始めて名前表示まで止めない
        ・第9版で入れた写真の滑り（1ページの中で幅7%・高さ5%・向きがページごとに逆）＝揺れ を削除。ずらし重ねのぶれも削除（全ページくっきり）
        ・ページは置いた位置から動かず、次のページが端から等速で差し込む（めくれ）だけ＝ページの最初から最後まで動き続ける
        ・0秒の1コマ目は真っ黒 → すぐ毎コマ明るくなる（黒で止まる0.1秒を無くした）。写真の並び（p_rk9）・秒割りは変えていない
    下の①〜⑥の秒は「手本の秒（τ）」。実時間 t との対応は tau()。
   手本: https://youtu.be/Ok5PXdmQV-s 「Marvel Comics Intro」（13.354秒）。手本を0.125秒ごとに切って測った表: p_rk5/ref_cuts.md
   手本と同じ秒・同じ並び（MARVEL → RIKUTO AF、コミック → NY・MSG・ニックス史の実写）:
     ① 0.00–1.20 黒（文字なし）
     ② 1.20–1.85 暗いオレンジの中で、ぼけた写真が浮かび明るくなる（文字なし）
     ③ 1.85–     写真のめくり（2コマ＝0.083秒ごと・くっきり／ブラー混じり）。2.42秒までは文字なし
     ④ 2.42–2.62 画面からはみ出す巨大な「RIKUTO AF」がうっすら→はっきり出る（以後ずっと出たまま・点滅しない）
                  文字の中心は最初から最後までど真ん中（左右にも上下にも動かない）。カメラを引くように一続きで縮む
                  大きさ＝単語全体の幅÷画面幅: 2.42秒 5.6倍 → 3.6秒 2.1倍 → 6.25秒 1.0倍（全体が収まる）→ 7.5秒 0.78
     ⑤ 6.25–8.90 文字の中も外も2026年ニックス優勝パレードの写真（7.0–7.95 で背景がオレンジに沈み、文字の中だけめくれる）
     ⑥ 8.90–9.13 文字の中が白に（9.13 で音の大ヒット）→ 第8版: 白い文字は縮めずに 0.9秒止めて見せる（溜め）
     ⑦ 実時間 8.18–8.93 白文字が、ページの見出し「RIKUTO AF」（.rk-word .fill を getBoundingClientRect で測る）の位置・大きさへ移り、
                  色は白 → オレンジ＋青い影に。同時に背景が消えてページが見えてくる → 8.95 で本物の見出しに入れ替わる
                  （スクロールしていて見出しが画面の外なら、文字はそのまま上へ抜けて消える）
   色: マーベルの赤 → ニックスのオレンジ。優勝パレードの写真だけ色付けを弱くしてニックスの青を残す。
   写真: 実写だけ（Wikimedia Commons・スプリーウェル・リクト本人の Instagram）。クレジットはページ下
   音: オリジナル合成のブラス（sfx-open.mp3）＋めくるたびに「ペラッ」（sfx-flip.mp3）。ボタン・文字の表示は出さない。
       ・同じサイトのページから入って来た時（Chrome は同じドメインでの操作を引き継いで自動再生を許す）は開始と同時に鳴る
       ・URL直打ち・再読み込みで止められている時は、最初のクリック・タップ・キー・スクロールで鳴り始める（その1回目ではスキップしない）
   演出は時刻 t の純関数 → ?introt=秒 で止めて確認できる（この時は音を出さない） */
import { runIntro, introTouch, clamp, prog, easeIn, easeOut, easeInOut, rand } from './core.js?v=1105s';

const BASE = '../../assets/s5/rikuto/intro/';
const HIST = [
  'msg1968', 'ny-ny1970', 'reed', 'ny-bkbridge', 'frazier', 'ny-debuss', 'ny-grandcentral', 'ewing88', 'ny-msg-marq', 'times',
  'sprewell', 'ny-subway', 'melo', 'ny-empire', 'lin', 'ny-knicks-msg2', 'ny-taxi', 'msggame', 'ny-queensboro', 'brunson',
  'ny-msg-in', 'ny-harlem', 'champ', 'ny-msg-final', 'ny-skyline', 'ny-liberty', 'ny-flatiron', 'ny-manh-night', 'ny-chrysler',
];
const ME = ['rikuto-shake', 'rikuto-allen', 'rikuto-hoodie'];
// 第11版（p_rk11）で足した別の写真（Wikimedia Commons・出典は p_rk11/sources.md）
const NEW = ['nb-01', 'nb-02', 'nb-03', 'nb-04', 'nb-05', 'nb-06', 'nb-07', 'nb-08', 'nb-09', 'nb-10', 'nb-11', 'nb-12', 'nb-13', 'nb-14', 'nb-15', 'nb-16', 'nb-17', 'nb-18', 'nb-19', 'nb-20', 'nb-21', 'nb-23', 'nb-24', 'nb-25', 'nb-26', 'nb-27', 'nb-28', 'nb-29', 'nb-30', 'nb-31', 'nb-32', 'nb-34', 'nb-35', 'nb-37', 'nb-38', 'nb-39', 'nb-40', 'nb-41', 'nb-42', 'nb-43', 'nb-44', 'nb-45', 'nb-46', 'nb-47', 'nb-48', 'nb-49', 'nb-50', 'nb-51'];
// 2026年ニックス優勝パレード（2026-06-18・NYC Mayor's Office の動画から・CC BY 4.0）
// 第10版（p_rk9）: 同じ動画から別カット parade-01〜120 を足し、めくりでは同じ写真を二度出さない（1回ずつ配る）
// 第11版: 他の写真と同じ場所・同じ構図に近いコマ（ORB 特徴点の照合で inlier 12以上・p_rk11/orb_all.json）は使わない
const PARADE_SIMILAR = new Set(['parade-25', 'parade-28', 'parade-29', 'parade-37', 'parade-41', 'parade-48', 'parade-49', 'parade-54', 'parade-57', 'parade-79', 'parade-94']);
const PARADE = ['parade-champs', 'parade-fans', 'parade-confetti', 'parade-bus',
  ...Array.from({ length: 120 }, (_, i) => 'parade-' + String(i + 1).padStart(2, '0'))].filter((n) => !PARADE_SIMILAR.has(n));
const ALL = [...HIST, ...NEW, ...ME, ...PARADE];
const SOFT = new Set([...PARADE, 'champ']); // 色付けを弱くしてニックスの青を残す写真
// 写真ごとの「画面の真ん中に来る点」（横, 縦 を 0〜1）。書いていない写真は真ん中
const FOC = {
  msg1968: [0.5, 0.6], reed: [0.4, 0.4], frazier: [0.6, 0.32], ewing88: [0.5, 0.35], times: [0.6, 0.4],
  sprewell: [0.5, 0.45], melo: [0.5, 0.3], lin: [0.48, 0.45], msggame: [0.5, 0.55], brunson: [0.35, 0.35],
  champ: [0.4, 0.3], 'rikuto-shake': [0.3, 0.38], 'rikuto-allen': [0.7, 0.4], 'rikuto-hoodie': [0.3, 0.4],
  'ny-debuss': [0.5, 0.3], 'ny-empire': [0.5, 0.35], 'ny-flatiron': [0.5, 0.4], 'ny-taxi': [0.45, 0.6], 'ny-liberty': [0.5, 0.4],
  'parade-bus': [0.42, 0.74], 'parade-champs': [0.66, 0.72], 'parade-confetti': [0.45, 0.6], 'parade-fans': [0.4, 0.5],
};
const ORANGE = '#f58426', BLUE = '#006bb6';

// ── タイミング（秒）─────────
// 手本（p_rk5/ref_cuts.md）と同じ秒
const T_IN = 1.2, T_FLIP = 1.85, STEP = (1001 / 24000) * 2; // 手本の2コマ = 0.0834秒
const T_TXT0 = 2.42, T_TXT1 = 2.62; // 文字が出る（うっすら→はっきり）
const T_DIM1 = 12.1; // 手本⑥: 白文字の間に画面がゆっくり暗くなる（72→47）
const T_WORD = 6.25, T_PARADE = 6.25, T_SINK0 = 7.0, T_SINK1 = 7.95, T_WHITE0 = 8.9, T_WHITE = 9.13;
// 実時間（秒）: 大ヒット（文字が白で確定）7.24 → 溜め 0.75秒（白い RIKUTO AF が止まったまま）→ 見出しへ移動 7.99〜8.89（0.9秒・目で追える速さ）→ 8.91 で終わり
const RATE = 0.92; // めくり〜白: 実時間÷手本の時間
// 第11版（p_rk11）: 黒い画面からのフェードイン＝0秒は真っ黒・覆いが T_FADE 秒かけて消える。その下では最初からめくれ続ける
//   （第10版までの「ぼけた1枚が止まったまま明るくなる」区間を廃止）。めくりの始まりを NPRE ページ前倒し＝最初の写真から手本と同じ速さで替わる
const NPRE = 7, T_FL0 = T_FLIP - NPRE * STEP; // めくりの始まり（手本の秒）
const T_FADE = 0.6, FADE_G = 1.6; // 実時間: 黒い覆いの不透明度 1 − (t/T_FADE)^FADE_G
const T_HIT = (T_WHITE - T_FL0) * RATE, T_HOLD = 0.75, T_MOVE0 = T_HIT + T_HOLD, T_MOVE1 = T_MOVE0 + 0.9;
const DUR = T_MOVE1 + 0.02;
// 見出しへの移動の進み: なめらかに出て着くが、一瞬で飛ばない（サイン曲線＝動きが移動時間全体に広がる。75本目: 3乗カーブだと0.3秒弱に集中して目で追えなかった）。
// 等速を1/4混ぜる＝最後のコマでも少し動いてぴたっと重なる
const moveE = (t) => { const x = prog(t, T_MOVE0, T_MOVE1); return 0.75 * (0.5 - 0.5 * Math.cos(Math.PI * x)) + 0.25 * x; };
// 実時間 t → 手本の秒 τ（区間ごとに直線で写す）
function tau(t) {
  return T_FL0 + Math.max(0, t) / RATE; // 0秒からめくり続ける。白の後も止めない: 溜め〜移動の間も手本⑥の時間が進む＝白い RIKUTO AF がゆっくり縮み続ける
}
// 文字の大きさ＝単語全体（インクの端から端）の幅÷画面幅。手本の MARVEL と同じ数字（7.95秒以降は画素で実測・それより前は見えている字から推定）
// 途切れずに縮む（対数で補間）。横長も縦長も同じ幅比。
const WREL = [[T_TXT0, 5.6], [2.84, 4.0], [3.6, 2.1], [4.1, 1.8], [5.0, 1.4], [6.25, 1.0], [7.25, 0.84], [7.5, 0.78], [8.0, 0.731],
  [8.5, 0.677], [9.0, 0.63], [9.5, 0.589], [10.0, 0.552], [10.5, 0.522], [11.0, 0.492], [11.5, 0.466], [12.0, 0.444], [12.5, 0.424], [13.35, 0.395]];
function scaleAt(tab, t) {
  if (t <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++) {
    const [t1, s1] = tab[i], [t0, s0] = tab[i - 1];
    if (t <= t1) return Math.exp(Math.log(s0) + (Math.log(s1) - Math.log(s0)) * ((t - t0) / (t1 - t0)));
  }
  return tab[tab.length - 1][1];
}

// めくる写真の並び
const R0 = rand(20261105);
const flipIndex = (t) => Math.floor((t - T_FL0) / STEP);
const K_PARADE = flipIndex(T_PARADE), K_END = flipIndex(T_WHITE); // めくりは白になるまで続く（手本どおり止まらない）
const K_BGEND = flipIndex(T_SINK1); // 背景のめくりはここまで（以後は背景がオレンジに沈んで見えない）
const K_ME = flipIndex(T_WORD) - 3, K_BUS = flipIndex(T_WHITE0) - 1; // リクト本人3枚／白になる直前のバス「2026 NBA CHAMPIONS」
// 第11版（p_rk11）: 画面に出る全ページ（背景・文字の中・差し込み中の次のページ）で写真ファイルを1回ずつしか使わない
//   第10版までの重複: ニックス史 HIST を背景と文字の中で2回（構図違い）・バスを文字の中で4ページ続けて・msg1968 をぼけとめくりで2回・沈む間の msggame の透かし
//   → 背景と文字の中を時刻順に1枠ずつ並べ、写真を1枚ずつ配る。6.25秒（手本）より前はニックス史・NY・NBA（EARLY）、以後は優勝パレード
const K_TXT = flipIndex(T_TXT0); // 文字が出る最初のページ
// HIST と NEW を交互に。最初の14枚（黒からのフェードイン中に出る）は暗い順＝画面の明るさが毎コマ上がり続ける
const EARLY = ['nb-06', 'nb-07', 'ny-grandcentral', 'ny-ny1970', 'ny-debuss', 'msg1968', 'nb-01', 'ny-bkbridge', 'nb-03', 'nb-04', 'frazier', 'nb-05', 'nb-02', 'reed', 'nb-08', 'ewing88', 'nb-09', 'ny-msg-marq', 'nb-10', 'times', 'nb-11', 'sprewell', 'nb-12', 'ny-subway', 'nb-13', 'melo', 'nb-14', 'ny-empire', 'nb-15', 'lin', 'nb-16', 'ny-knicks-msg2', 'nb-17', 'ny-taxi', 'nb-18', 'msggame', 'nb-19', 'ny-queensboro', 'nb-20', 'brunson', 'nb-21', 'ny-msg-in', 'nb-23', 'ny-harlem', 'nb-24', 'champ', 'nb-25', 'ny-msg-final', 'nb-26', 'ny-skyline', 'nb-27', 'ny-liberty', 'nb-28', 'ny-flatiron', 'nb-29', 'ny-manh-night', 'nb-30', 'ny-chrysler', 'nb-31', 'nb-32', 'nb-34', 'nb-35', 'nb-37', 'nb-38', 'nb-39', 'nb-40', 'nb-41', 'nb-42', 'nb-43', 'nb-44', 'nb-45', 'nb-46', 'nb-47', 'nb-48', 'nb-49', 'nb-50', 'nb-51'];
const POOL = PARADE.filter((n) => n !== 'parade-bus').map((n) => [R0(), n]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
const FLIP_SEQ = [], WORD_SEQ = [];
{
  let iE = 0, iP = 0;
  const take = (k) => (k < K_PARADE && iE < EARLY.length) || iP >= POOL.length ? EARLY[iE++] : POOL[iP++];
  for (let k = 0; k <= K_END; k++) {
    if (k <= K_BGEND + 1) FLIP_SEQ.push(take(k)); // +1 = 沈む直前に差し込み始める次のページ
    if (k < K_TXT) WORD_SEQ.push(null); // 文字が出る前は描かれない
    else if (k === K_BUS) WORD_SEQ.push('parade-bus');
    else if (k >= K_ME && k < K_ME + ME.length) WORD_SEQ.push(ME[k - K_ME]);
    else WORD_SEQ.push(take(k));
  }
  var SPARE = [...EARLY.slice(iE), ...POOL.slice(iP)];
}
const wordName = (k) => WORD_SEQ[Math.min(k, WORD_SEQ.length - 1)];
// 出る順（読み込みの順番）: 最初に描くもの → 後で描くもの
const ORDER = [...new Set([...WORD_SEQ.flatMap((n, k) => [FLIP_SEQ[k], n]).filter(Boolean), ...SPARE])];
// コマごとの見え方: 0=くっきり 1=横に流れる 2=斜めに流れる（zoom はコマごとの構図。コマの中では変えない＝手本どおり寄らない）
function frameLook(k) {
  const r = rand(k * 7919 + 13);
  const a = r(), b = r(), c = r(), d = r();
  return { type: a < 0.4 ? 0 : a < 0.8 ? 1 : 2, zoom: 1.12 + b * 0.5, dir: c < 0.5 ? -1 : 1, jx: (d - 0.5) * 0.16, jy: (r() - 0.5) * 0.12, spread: 0.035 + r() * 0.045, wipe: Math.floor(r() * 3) };
}

function loadImg(src) {
  return new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; });
}
// 写真をオレンジに色付けした小さめの canvas にする（長い辺 900px）。優勝の写真は弱め＝青が残る
function grade(im, name) {
  const k = Math.min(1, 900 / Math.max(im.width, im.height));
  const c = document.createElement('canvas');
  c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
  const x = c.getContext('2d');
  x.drawImage(im, 0, 0, c.width, c.height);
  const soft = SOFT.has(name);
  x.globalCompositeOperation = 'color'; x.globalAlpha = soft ? 0.22 : 0.62; x.fillStyle = ORANGE; x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'soft-light'; x.globalAlpha = soft ? 0.2 : 0.35; x.fillStyle = '#ffb060'; x.fillRect(0, 0, c.width, c.height);
  return c;
}

// ── 音（Web Audio）。表示は何も出さない ───────────
const SFX = { ctx: null, gain: null, open: null, flip: null, openStarted: false, swallow: false, mode: '' };
function initAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {} // iPhone の消音スイッチが入っていても鳴らす（2026-11-05 クリス指示「スマホで見ると音が鳴らない」）
    SFX.ctx = new AC();
    SFX.gain = SFX.ctx.createGain();
    SFX.gain.gain.value = 0.7;
    SFX.gain.connect(SFX.ctx.destination);
    const get = (n) => fetch(BASE + 'sfx-' + n + '.mp3').then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((ab) => (ab ? new Promise((res) => SFX.ctx.decodeAudioData(ab, res, () => res(null))) : null)).catch(() => null);
    get('open').then((b) => { SFX.open = b; });
    get('flip').then((b) => { SFX.flip = b; });
    // ① 同じサイトのページから来た時は、ここでそのまま鳴る（Chrome が同じドメインの操作を引き継ぐ）
    if (SFX.ctx.state !== 'running') SFX.ctx.resume().catch(() => {});
    SFX.mode = SFX.ctx.state === 'running' ? 'auto' : 'wait';
    window.__rkAudio = SFX; // 確認用（CDP で state を読む）
  } catch (e) { SFX.ctx = null; }
}
const audioOn = () => SFX.ctx && SFX.ctx.state === 'running';
function playBuf(buf, vol, rate, offset) {
  if (!audioOn() || !buf) return;
  const s = SFX.ctx.createBufferSource(), v = SFX.ctx.createGain();
  s.buffer = buf; s.playbackRate.value = rate || 1; v.gain.value = vol;
  s.connect(v); v.connect(SFX.gain); s.start(0, offset || 0);
}
// ② 自動再生が止められている時: 最初のクリック・タップ・キー・スクロールで鳴らす（その操作ではスキップしない）
function armUnlock(el) {
  introTouch(el, audioOn); // 払う動きは JS でスクロール＝指を離した瞬間が「操作」になり音が出る
  const opts = { capture: true, passive: true };
  const unlock = (e) => {
    if (!SFX.ctx || audioOn() || !el.isConnected) return;
    if (e.type === 'keydown') {
      if (e.key === 'Escape') return; // Esc はいつでもスキップ
      e.stopImmediatePropagation(); e.preventDefault(); // この1回はスキップしない
    }
    if (e.type === 'pointerdown' || e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'touchend') SFX.swallow = true;
    SFX.ctx.resume().catch(() => {});
  };
  for (const ev of ['pointerdown', 'mousedown', 'touchstart', 'touchmove', 'touchend', 'wheel', 'scroll']) addEventListener(ev, unlock, opts);
  addEventListener('keydown', unlock, true);
  // 鳴らすための1回目のクリックは、オープニングのスキップ（core.js の click）まで届かせない
  addEventListener('click', (e) => {
    if (!el.isConnected) return;
    if (SFX.ctx && !audioOn()) { SFX.ctx.resume().catch(() => {}); SFX.swallow = true; }
    if (SFX.swallow) { SFX.swallow = false; e.stopPropagation(); }
  }, true);
}

// ── オープニング本体 ───────────────────────
function start() {
  const el = document.getElementById('s5-intro');
  const freeze = new URLSearchParams(location.search).has('introt');
  if (el) {
    const hint = el.querySelector('.hint');
    if (hint) hint.style.display = 'none'; // 余計な表示は出さない
    if (!freeze && document.documentElement.classList.contains('s5-intro-on')) { initAudio(); armUnlock(el); }
  }
  runIntro({
    key: 'rikuto',
    duration: DUR,
    gl: false,
    holdDraw: true,
    async setup(ctx) {
      const fontP = Promise.race([document.fonts.load('400 120px "Anton"', 'RIKUTO AF'), new Promise((r) => setTimeout(r, 1200))]).catch(() => {});
      // 写真は出る順に6本ずつ読み込む（124枚を一度に頼まない）。色付けした canvas は直近24枚だけ持つ（メモリ対策）
      const RAW = {}, waits = {};
      // 待つのは最初の方に描く写真とリクト本人だけ（止め撮り ?introt の時は全部）。それを先頭に読み込む。届く前の写真は余りの別カットで代用
      const first = [...new Set([...FLIP_SEQ.slice(0, 18), ...WORD_SEQ.slice(K_TXT, K_TXT + 6), ...ME])];
      // 2026-11-05 クリス指示93本目: 8Mbps で 2.5 秒に間に合わず幕ごと出なかった（27枚≒2.7MB）。幕を開けるのに待つのは出だしの8枚とリクト本人だけにする。残りは出る順に読み続ける
      const must = [...new Set([...FLIP_SEQ.slice(0, 8), ...ME])];
      const queue = [...must, ...first.filter((n) => !must.includes(n)), ...ORDER.filter((n) => !first.includes(n) && !must.includes(n))];
      let qi = 0;
      const next = () => {
        if (qi >= queue.length) return null;
        const n = queue[qi++];
        return loadImg(BASE + n + '.webp').then((im) => { RAW[n] = im; }).catch(() => {})
          .then(() => { (waits[n] || []).forEach((f) => f()); waits[n] = null; }).then(next);
      };
      const until = (n) => (waits[n] === null ? null : new Promise((res) => { (waits[n] = waits[n] || []).push(res); }));
      const firstP = must.map(until); // 読み込みを始める前に登録しておく
      const lanes = Array.from({ length: 6 }, next);
      if (freeze) await Promise.all(lanes);
      else await Promise.all(firstP);
      await fontP;
      if (Object.keys(RAW).length < 6) throw new Error('no images');
      const GC = new Map(), MEMO = {}, taken = new Set();
      const graded = (n) => {
        let c = GC.get(n);
        if (c) { GC.delete(n); GC.set(n, c); return c; }
        c = grade(RAW[n], n); GC.set(n, c);
        if (GC.size > 24) GC.delete(GC.keys().next().value);
        return c;
      };
      // 予定の写真 n → 実際に描く写真。最初に描く時に決めて以後は同じ。
      // まだ届いていない（または前の代用に使われた）時は、届いていてまだどこにも出していない別カットを使う＝回線が遅くても同じ写真を二度出さない
      const SUBS = [...SPARE, ...POOL, ...EARLY];
      const pic = (n) => {
        let a = MEMO[n];
        if (!a || !RAW[a]) {
          a = RAW[n] && !taken.has(n) ? n : SUBS.find((s) => RAW[s] && !taken.has(s)) || (RAW[n] ? n : Object.keys(RAW)[0]);
          MEMO[n] = a; taken.add(a);
        }
        const c = graded(a); c.rkName = a; return c;
      };
      const LOG = new URLSearchParams(location.search).has('introlog') ? {} : null; // 確認用: 描いた写真の名前（render の最後に window.__rkShown へ）

      const g = ctx.canvas.getContext('2d');
      const off = document.createElement('canvas'), og = off.getContext('2d');
      const dpr = ctx.dpr;
      let W = 0, H = 0, M = null;
      const FONT = (s) => `400 ${s}px "Anton", sans-serif`;
      const TEXT = 'RIKUTO AF';

      // 文字のインク（実際に塗られる部分）の幅と中心を測る → 中心を画面のど真ん中に置く
      function measure() {
        g.save(); g.font = FONT(100);
        const m = g.measureText(TEXT);
        const L = m.actualBoundingBoxLeft || 0, R = m.actualBoundingBoxRight || m.width;
        const cap = (g.measureText('H').actualBoundingBoxAscent || 86) / 100;
        g.restore();
        M = { ink: (L + R) / 100, mid: (R - L) / 2 / 100, cap };
      }
      // ⑦ ページの見出し（.rk-word .fill）の文字の位置・大きさ。移動中は毎コマ測る
      function heading() {
        const fill = document.querySelector('.rk-word .fill');
        if (!fill) return null;
        const r = fill.getBoundingClientRect();
        if (!r.width) return null;
        const cs = getComputedStyle(fill);
        const size = parseFloat(cs.fontSize), ls = parseFloat(cs.letterSpacing) || 0;
        const lh = parseFloat(cs.lineHeight) || size * 0.92;
        g.save(); g.font = FONT(size); const m = g.measureText(TEXT); g.restore();
        const asc = m.fontBoundingBoxAscent || size * 1.18, desc = m.fontBoundingBoxDescent || size * 0.33;
        const hd = { size, ls, left: r.left, base: Math.floor(r.top + scrollY + (lh - (asc + desc)) / 2 + asc) }; // 本物の文字の基線は整数の画素に乗る（小数のままだと着地で1px跳ねる）
        window.__rkHD = hd;
        return hd;
      }
      function resize() {
        W = innerWidth; H = innerHeight;
        ctx.canvas.width = off.width = Math.round(W * dpr);
        ctx.canvas.height = off.height = Math.round(H * dpr);
        measure();
      }

      function place(im, name, x, y, w, h, zoom, jx, jy) {
        const f = FOC[name] || [0.5, 0.45];
        const s = Math.max(w / im.width, h / im.height) * zoom;
        const iw = im.width * s, ih = im.height * s;
        const ox = clamp(x + w / 2 - f[0] * iw + jx * w, x + w - iw, x);
        const oy = clamp(y + h / 2 - f[1] * ih + jy * h, y + h - ih, y);
        return [ox, oy, iw, ih];
      }
      // 1ページ: 置いた位置から動かさない・くっきり（第10版: 滑り＝揺れ・ずらし重ね＝ぶれ を削除。手本どおり「ただ漫画がめくられているだけ」）
      function drawPic(c, name, k, p, x, y, w, h, sharp) {
        const im = pic(name, k), L = frameLook(k);
        const [ox, oy, iw, ih] = place(im, name, x, y, w, h, L.zoom, L.jx, L.jy);
        c.drawImage(im, ox, oy, iw, ih);
      }
      // 1ページ = 次のページが端から差し込む（めくれ）。ページの最初から最後まで等速＝止まる瞬間が無い。差し込み終わり＝次のページの始まりと同じ絵・同じ位置
      function drawFrame(c, name, k, local, x, y, w, h, sharp, next) {
        const p = clamp(local / STEP, 0, 1);
        drawPic(c, name, k, p, x, y, w, h, sharp);
        if (!next || p <= 0) return;
        const e = p, L = frameLook(k);
        let rx = x, ry = y, rw = w, rh = h;
        if (L.wipe === 0) { rh = h * e; ry = y + h - rh; } // 下から
        else if (L.wipe === 1) { rw = w * e; rx = x + w - rw; } // 右から
        else rw = w * e; // 左から
        if (rw < 0.5 || rh < 0.5) return;
        c.save(); c.beginPath(); c.rect(rx, ry, rw, rh); c.clip();
        drawPic(c, next.name, next.k, 0, x, y, w, h, next.sharp);
        c.restore();
        // ページの縁の影
        c.save(); c.globalAlpha = 0.45 * (1 - e); c.fillStyle = '#000';
        if (L.wipe === 0) c.fillRect(x, ry - 3, w, 3); else if (L.wipe === 1) c.fillRect(rx - 3, y, 3, h); else c.fillRect(rx + rw, y, 3, h);
        c.restore();
      }
      // ③ 背景のめくり（文字が浮いて見えるよう少し暗く）
      function drawFlips(t) {
        const k = Math.max(0, flipIndex(t)), local = t - (T_FL0 + k * STEP);
        if (LOG) { LOG.bg = pic(FLIP_SEQ[k]).rkName; LOG.bgk = k; }
        drawFrame(g, FLIP_SEQ[k % FLIP_SEQ.length], k, local, 0, 0, W, H, false, { name: FLIP_SEQ[(k + 1) % FLIP_SEQ.length], k: k + 1, sharp: false });
        g.fillStyle = `rgba(25,8,0,${(0.36 - 0.16 * prog(t, T_WORD - 0.3, T_PARADE + 0.2)).toFixed(3)})`; g.fillRect(0, 0, W, H); // パレードは明るめに見せる
      }
      // 背景がオレンジに沈む（手本の赤い背景）
      function drawSink(a) {
        if (a <= 0) return;
        const gr = g.createRadialGradient(W / 2, H * 0.48, 0, W / 2, H * 0.48, Math.hypot(W, H) * 0.6);
        gr.addColorStop(0, '#e9771f'); gr.addColorStop(0.55, '#b9500f'); gr.addColorStop(1, '#3d1503');
        g.globalAlpha = a; g.fillStyle = gr; g.fillRect(0, 0, W, H);
        g.globalAlpha = 1;
      }
      function textAt(c, x, base, size, ls) {
        c.font = FONT(size);
        if (!ls) { c.fillText(TEXT, x, base); return; }
        for (let i = 0; i < TEXT.length; i++) {
          if (TEXT[i] === ' ') continue;
          c.fillText(TEXT[i], x + c.measureText(TEXT.slice(0, i)).width + i * ls, base);
        }
      }
      function wordBox(t) {
        const w = W * scaleAt(WREL, t), size = w / M.ink;
        const x = W / 2 - M.mid * size; // インクの中心＝画面の中心（どの秒でも同じ）
        window.__rkBox = { t, w: w / W, cx: (x + M.mid * size) / W, size };
        return { size, w, x, x0: W / 2 - w / 2, base: H / 2 + (M.cap * size) / 2, top: H / 2 - (M.cap * size) / 2 };
      }
      // ③〜⑥ 抜き文字（最初から最後まで出たまま・文字の中で写真がめくられる）→ 白へ
      function drawKnockout(t) {
        const B = wordBox(t);
        const kk = Math.max(0, flipIndex(t)), local = t - (T_FL0 + kk * STEP);
        og.setTransform(dpr, 0, 0, dpr, 0, 0);
        og.globalCompositeOperation = 'source-over'; og.globalAlpha = 1;
        og.clearRect(0, 0, W, H);
        og.fillStyle = '#fff'; textAt(og, B.x, B.base, B.size, 0);
        og.globalCompositeOperation = 'source-atop';
        // 文字の中の写真は、画面に見えている部分だけに合わせる（巨大な時でも写真が引き伸ばされすぎない）
        const x0 = Math.max(B.x0, 0), x1 = Math.min(B.x0 + B.w, W);
        const pad = Math.min(B.size * 0.15, H * 0.1);
        const y0 = Math.max(B.top - pad, 0), y1 = Math.min(B.top + M.cap * B.size + pad, H);
        // 文字の中の1ページ＝j。構図（frameLook）は j だけで決まる
        const look = (j) => ({ name: wordName(j), k: 500 + j, sharp: true }); // 第11版: 構図はページごとに固定（沈んだ瞬間に同じ写真の構図が切り替わっていた＝同じ写真が2回に見えるのを直した）
        const A = look(kk);
        if (LOG) { LOG.in = pic(A.name).rkName; LOG.ink = kk; }
        drawFrame(og, A.name, A.k, local, x0, y0, x1 - x0, y1 - y0, A.sharp, kk + 1 <= K_END ? look(kk + 1) : null);
        // 文字の中は明るめ（巨大な間は外のめくりと見分けがつくよう少し強く）→ 8.9〜9.13秒で白に
        const wash = 0.3 - 0.14 * prog(t, T_SINK0, T_SINK1); // 背景がオレンジに沈むまでは強め＝文字が背景に溶けない
        og.globalAlpha = wash + (1 - wash) * (0.5 * prog(t, T_WHITE0, T_WHITE) + 0.5 * easeOut(prog(t, T_WHITE0, T_WHITE))); og.fillStyle = '#f2e6e0'; og.fillRect(0, 0, W, H);
        og.globalAlpha = 1; og.globalCompositeOperation = 'source-over';
        g.globalAlpha = easeOut(prog(t, T_TXT0, T_TXT1)); // 2.42〜2.62秒で出る（以後ずっと出たまま）
        g.drawImage(off, 0, 0, off.width, off.height, 0, 0, W, H);
        g.globalAlpha = 1;
      }
      // ⑥ 白文字（ど真ん中で止まる）→ ⑦ 見出しの位置・大きさ・色（オレンジ＋青い影）へ移って重なる
      function drawFinal(t, u) {
        const B = wordBox(T_WHITE); // 75本目: 白で確定したら大きさ・位置とも止める（溜め）。そこから見出しへ
        const e = moveE(t);
        let x = B.x, base = B.base, size = B.size, ls = 0;
        const hd = e > 0 ? heading() : null;
        if (hd) {
          x += (hd.left - x) * e; base += (hd.base - base) * e;
          size += (hd.size - size) * e; ls = hd.ls * e;
          g.globalAlpha = e; g.fillStyle = BLUE; textAt(g, x + size * 0.035, base + size * 0.035, size, ls); g.globalAlpha = 1; // 見出しの青い影（::before）
        }
        const c0 = [242, 230, 224], c1 = [245, 132, 38]; // 手本の白 → ニックスのオレンジ（見出しの色）
        const k = hd ? e : 0;
        g.fillStyle = `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * k)).join(',')})`;
        textAt(g, x, base, size, ls);
      }
      let lastT = -1;
      function sound(t, u) {
        if (ctx.freeze !== null || !SFX.ctx) return;
        if (t < lastT) lastT = -1;
        if (audioOn() && SFX.open && !SFX.openStarted && t < DUR - 1) { SFX.openStarted = true; playBuf(SFX.open, 0.9, 1, Math.max(0, t)); }
        if (audioOn() && SFX.flip) {
          // めくるたびにペラッ（白になったら鳴らさない）
          const kA = flipIndex(tau(Math.max(0, lastT))), kB = flipIndex(u);
          if (u >= T_FL0 && u < T_WHITE0 && kB !== kA) {
            playBuf(SFX.flip, (0.18 + 0.32 * prog(u, T_FL0, T_WORD)) * (0.8 + 0.4 * rand(kB)()), 0.9 + 0.3 * rand(kB + 99)());
          }
        }
        lastT = t;
      }

      const root = document.documentElement;
      function render(t) {
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
        g.clearRect(0, 0, W, H);
        const u = tau(t);
        // ⑦ 背景（黒・オレンジ・周辺減光・粒子）が消えてページが見えてくる。本物の見出しは文字が重なるまで隠す
        const mv = t >= DUR ? 1 : moveE(t);
        root.classList.toggle('rk-hand', t >= T_MOVE0 && t < DUR);
        if (ctx.el) {
          ctx.el.style.background = mv > 0 ? `rgba(5,5,5,${(1 - mv).toFixed(3)})` : '';
          for (const c of ctx.el.querySelectorAll('.vig,.grain')) c.style.opacity = mv > 0 ? String(1 - mv) : '';
        }
        if (t >= DUR) return; // 終わった後（止め撮り ?introt=9 など）: 本物の見出しだけ
        if (mv < 1) { g.globalAlpha = 1 - mv; g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        if (u < T_SINK1) drawFlips(u);
        const sink = (u < T_SINK1 ? easeInOut(prog(u, T_SINK0, T_SINK1)) : 1) * (1 - mv);
        if (u >= T_SINK0) drawSink(sink);
        // 手本⑤'〜⑥: 背景（赤一色）がゆっくり暗くなり続ける（79→70→47）。文字はこの上に描くので暗くならない＝読めるまま
        const dim = u <= T_SINK1 ? 0 : 0.12 * prog(u, T_SINK1, T_WHITE) + 0.5 * prog(u, T_WHITE, T_DIM1);
        if (dim > 0) { g.globalAlpha = dim * (1 - mv); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
        if (u >= T_TXT0 && u < T_WHITE) drawKnockout(u);
        else if (u >= T_WHITE) drawFinal(t, u);
        if (t < T_FADE) { g.globalAlpha = 1 - Math.pow(Math.max(0, t) / T_FADE, FADE_G); g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; } // 黒い画面からのフェードイン
        sound(t, u);
        if (LOG) window.__rkShown = { ...LOG };
      }

      resize();
      document.fonts.load('400 120px "Anton"', TEXT).then(measure).catch(() => {});
      return { render, resize };
    },
  });
}

start();
