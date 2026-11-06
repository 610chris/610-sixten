// スマホの音（2026-11-05 クリス指示「スマホで音出るようにして」）
// iPhone は「触る」まで音を出せない。そこで全ページ共通で次の3つをする（各ページの演出コードは変えない）。
//  1. 触った瞬間に、ページが作った AudioContext を全部その場で起こす
//  2. 同時に無音の <audio> を流す。消音スイッチ ON やアプリ内ブラウザでも Web Audio が聞こえるようにするため
//  3. 音が止まっている間だけ、右上にスピーカーのマークを出す（文字なし）。押せる部品ではなく、タップは下の画面へ通す
(function () {
  var Native = window.AudioContext || window.webkitAudioContext;
  if (!Native) return;
  var ctxs = [];
  function Wrapped(opt) {
    var c = opt ? new Native(opt) : new Native();
    ctxs.push(c);
    return c;
  }
  Wrapped.prototype = Native.prototype;
  window.AudioContext = Wrapped;
  if (window.webkitAudioContext) window.webkitAudioContext = Wrapped;

  var touch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!touch) return;

  // 無音の WAV（8kHz・8bit・0.5秒）
  function silentUri() {
    var n = 4000, s = 'RIFF', i;
    function u32(v) { return String.fromCharCode(v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >> 24) & 255); }
    function u16(v) { return String.fromCharCode(v & 255, (v >> 8) & 255); }
    s += u32(36 + n) + 'WAVEfmt ' + u32(16) + u16(1) + u16(1) + u32(8000) + u32(8000) + u16(1) + u16(8) + 'data' + u32(n);
    for (i = 0; i < n; i++) s += String.fromCharCode(128); // 128＝8bit の無音。以前の 128/129 交互は 4kHz の小さな「ピー」になっていた（2026-11-06 クリス指示で修正）
    return 'data:audio/wav;base64,' + btoa(s);
  }
  var keep = null, finished = false;
  function startKeep() {
    if (keep || finished) return; // 幕が終わった後は、触っても無音を流し直さない
    try {
      keep = new Audio(silentUri());
      keep.loop = true;
      keep.setAttribute('playsinline', '');
      var p = keep.play();
      if (p && p.catch) p.catch(function () { keep = null; });
    } catch (e) { keep = null; }
  }
  function stopKeep() {
    if (!keep) return;
    try { keep.pause(); } catch (e) {}
    keep = null;
  }
  function kick() {
    startKeep();
    ctxs.forEach(function (c) {
      if (c.state !== 'running' && c.state !== 'closed' && c.resume) { try { c.resume().catch(function () {}); } catch (e) {} }
    });
  }
  ['touchend', 'pointerup', 'click', 'keydown'].forEach(function (n) {
    addEventListener(n, kick, { capture: true, passive: true });
  });

  var mark = null;
  function showMark() {
    if (mark || !document.body) return;
    mark = document.createElement('div');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText = 'position:fixed;top:calc(env(safe-area-inset-top,0px) + 14px);right:14px;width:52px;height:52px;border-radius:50%;background:rgba(0,0,0,.62);border:1px solid rgba(255,255,255,.55);display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2147483647';
    mark.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="#fff"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M16 9.4l1.4-1.4 2.1 2.1 2.1-2.1L23 9.4l-2.1 2.1 2.1 2.1-1.4 1.4-2.1-2.1-2.1 2.1-1.4-1.4 2.1-2.1z"/></svg>';
    document.body.appendChild(mark);
  }
  function hideMark() {
    if (mark) { mark.remove(); mark = null; }
  }

  var root = document.documentElement, silentSince = 0, offSince = 0, started = Date.now();
  var timer = setInterval(function () {
    var cl = root.classList, on = cl.contains('s5-intro-on') || cl.contains('s5lu-lock');
    var live = ctxs.filter(function (c) { return c.state !== 'closed'; });
    var muted = on && live.length && live.some(function (c) { return c.state !== 'running'; });
    if (muted) {
      if (!silentSince) silentSince = Date.now();
      if (Date.now() - silentSince > 500) showMark(); // 最初から鳴らせる端末で一瞬出さない
    } else {
      silentSince = 0;
      hideMark();
    }
    if (on) offSince = 0;
    else if (!offSince) offSince = Date.now();
    // 幕が終わって少ししたら無音を止める（ロック画面に再生中と出続けないように）
    if (offSince && Date.now() - offSince > 15000 && Date.now() - started > 15000) {
      finished = true;
      stopKeep();
      clearInterval(timer);
    }
  }, 200);
  addEventListener('pagehide', stopKeep);
})();
