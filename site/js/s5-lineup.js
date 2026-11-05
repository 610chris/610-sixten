/* STARTING 5IVE チームページ：スタメン発表（毎回・音あり前提）
   A 暗転＋丸いスポット＋コール → B ジャンボトロンの背番号カード を 1番→5番 の順に。
   最後に白フラッシュで照明が戻り、5人のラインナップ → 通常ページへ。
   - メンバーの写真・名前・番号・登録者数は #members のカードから読む（二重管理しない）
   - prefers-reduced-motion では出さない／再読み込みのたびに毎回再生（2026-11-05 クリス指示）
   - アンカー付き（#members など）・戻る/進むで来たときは出さない。?lineup=1 で強制再生
   - 右下の TAP TO SKIP（バンバのページと同じ見た目・位置）・Esc で即座に通常ページへ
   - 音: 2026-11-05 クリス指示「基本的に音ありで見る、絶対にね」「音ありかなしかもう判断させなくていいや」→ 音あり/なしの選択ボタンは置かない。
     自動再生が許されていれば最初から音あり。ブラウザに止められた時は、最初のクリック・タップ・キー・スクロールで頭から音ありでやり直す（表示は出さない）
   - 三角のライト（ビーム・コーン）は 2026-11-05 クリス指示「安っぽいからやめて。なしだわ」で削除
   - GSAP は再生するときだけ読み込む（js/vendor/gsap.min.js） */
(function () {
  'use strict';
  var root = document.documentElement;
  var me = document.currentScript;
  var GSAP_SRC = new URL('vendor/gsap.min.js', me ? me.src : location.href).href;
  // アリーナMCのコール（AI音声: Gemini TTS gemini-3.1-flash-tts-preview / 声 Fenrir → ffmpeg で低音・圧縮・残響）。
  // 会場の歓声＋拍手（crowd）は Freesound の CC0 実録音3本（678544 / 678542 / 706732）をつないで均したもの（出典は p_call5/sources.md・67本目）。
  // 5番の盛り上がり（roar）はノイズから合成した自作音（外部素材なし）。
  // crowd / roar / cheer は 2026-11-05 クリス指示で男声中心に加工（高さ×0.78＋叫びの帯域を削り胸声の帯域を足す。p_call7/build16.py）。
  // 締めの大歓声（cheer）は Freesound の CC0 素材2本（385920 / 480765）を重ねて加工したもの（出典は p_call2/sources.md）。
  // call-final＝締めの一言（"And your SIXTH MAN... is YOU!"）。文言を差し替える時はこのファイルと CUE.final だけ直す。
  var SND_BASE = new URL('../assets/s5/lineup/', me ? me.src : location.href).href;
  var SND_FILES = ['call-0', 'call-1', 'call-2', 'call-3', 'call-4', 'call-5', 'call-final', 'crowd', 'roar', 'cheer'];
  // 各コール音声の「名前を言い始める秒」と「声が終わる秒」（call-1=1番リクト … call-5=5番クリス。音量の切れ目で測定）
  var CUE = { intro: { lad: 0.1, starting: 4.72, five: 5.72, voice: 7.16, end: 8.06 },
    calls: { 1: [2.52, 8.78], 2: [1.98, 7.56], 3: [1.48, 4.36], 4: [2.06, 7.18], 5: [1.94, 8.62] }, // [名前の頭, 反応の間まで含めた終わり]
    voice: [0, 7.88, 6.66, 3.46, 6.28, 7.62], // n番の声が終わる秒＝ここで歓声が わー と上がる
    // 締め: call-final の中の秒。cheer=歓声を重ね始める（YOU の直前）/ you=YOU の頭 / end=伸ばした YOOOU の終わり＝サイトが開く
    final: { cheer: 3.15, you: 3.70, end: 7.66 } }; // 2026-11-05 81本目: 呼ぶ→呼び終わりに わー の掛け合い / 締めを実況と同じ声(Orus・native-audio)で "AND THE SIXTH MAN IS YOU" に作り直し
  // 歓声（crowd）: 呼んでいる間は under（最初はほぼ出ない→だんだん呼んでいる間も叫び始める）、呼び終わりに up へ跳ね上がる（81本目）。
  // under も up も 1→5番で必ず上がる。intro=[呼んでいる間, 呼び終わり] / roar=反応に重ねる roar の音量 / final=[締めの "is" まで, サイトが開くまで]
  // 2026-11-05 NBA 実映像の傾向で見直し: 歓声は呼び終わりを待たず名前の途中から上がり始める。riseAt=名前の何割で上がり始めるか（1番は名前の前半が終わる約50%＝RIKUTO の後、後ろの人ほど早く）/ rise=呼び終わりまでに上げる音量（声が歓声より上に残る値）
  var CROWD = { intro: [0.22, 2.2], under: [0.2, 0.3, 0.5, 0.85, 1.4], riseAt: [0.5, 0.45, 0.4, 0.3, 0.2], rise: [0.7, 1.0, 1.4, 2.0, 2.7], up: [2.6, 3.0, 3.4, 3.8, 4.3], roar: [0.5, 0.6, 0.7, 0.85, 1.0], final: [2.4, 4.8] };

  function unpend() { root.classList.remove('s5lu-pending'); }

  var force = /[?&]lineup=1\b/.test(location.search);
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 2026-11-05 クリス指示「リロードした時にもう一回エフェクトを見れるように」→ 再読み込みのたびに毎回再生（個人ページと同じ）。
  // 出さないのは #アンカー付きで来た時と、戻る/進むで戻ってきた時だけ
  var nav = '';
  try { nav = (performance.getEntriesByType('navigation')[0] || {}).type || ''; } catch (e) {}
  if (reduce || (!force && (location.hash || nav === 'back_forward'))) { unpend(); return; }

  // 顔の中心（写真 640×600 に対する割合 [x, y, 顔の高さ]）。macOS Vision の顔検出で測定（2026-11-05・y は目〜鼻の高さに補正）。
  // 写真を差し替えたら測り直す。キーは member-<名前>.jpg / member-<名前>-2.jpg の <名前>
  // 2026-11-05 クリス指示「クリスの写真だけ横切れちゃってる」: 旧 member-chris-2.jpg は顔が左端寄り（x=0.21）で髪・服が写真の左端で切れていた。
  // 同じ写真の左に会場のボケを足して左端をなじませた member-chris-3.jpg（1012×600・顔は中央。p_main5/widen.py）に替えた
  var FACE = {
    rikuto: [0.31, 0.43, 0.33], hallelujah: [0.49, 0.39, 0.38], bamba: [0.63, 0.47, 0.49],
    nicholas: [0.40, 0.50, 0.29], chris: [0.51, 0.43, 0.40]
  };

  function readMembers() {
    var list = [];
    document.querySelectorAll('#members .s5-member').forEach(function (fig) {
      var img = fig.querySelector('.ph img');
      var no = fig.querySelector('figcaption .no');
      var ja = fig.querySelector('figcaption strong');
      var en = fig.querySelector('figcaption .en');
      var hint = fig.querySelector('.yt-hint');
      if (!img || !no || !ja || !en) return;
      var src = img.currentSrc || img.src;
      var key = (src.match(/member-([a-z]+)(?:-\d+)?\./) || [])[1] || ''; // -2 付き（差し替え写真）も拾う
      var m = hint ? hint.textContent.match(/([\d.]+)\s*万/) : null;
      list.push({
        n: parseInt(no.textContent, 10), src: src, ja: ja.textContent.trim(),
        en: en.textContent.trim(), subs: m ? m[1] : '', plat: hint && /tiktok/i.test(hint.textContent) ? 'TikTok' : 'YouTube', face: FACE[key] || [0.45, 0.4, 0.35]
      });
    });
    return list.sort(function (a, b) { return a.n - b.n; });
  }

  function loadScript(src) {
    return new Promise(function (ok, ng) {
      if (window.gsap) return ok();
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = ng; document.head.appendChild(s);
    });
  }
  function loadImg(src) {
    return new Promise(function (ok) {
      var i = new Image(); i.decoding = 'async'; i.src = src;
      (i.decode ? i.decode() : Promise.resolve()).then(ok, ok);
    });
  }
  function timeout(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // 写真を枠いっぱいに敷き（cover）、顔の中心が枠の (tx, ty) に来るように置く。
  // object-position の割合では顔は真ん中に来ないので、枠の実寸から写真の大きさと位置を px で決める。
  // 写真の端に顔が寄っている人（クリス）は、真ん中に来るところまで少しだけ拡大する（最大 zmax 倍）
  function frame(img, face, tx, ty, zmax, flip) {
    var box = img.parentElement, cw = box.clientWidth, ch = box.clientHeight;
    if (!cw || !ch) return;
    var fx = flip ? 1 - face[0] : face[0], fy = face[1];
    var nw = img.naturalWidth || 640, nh = img.naturalHeight || 600; // 写真の実寸（クリスは 1012×600）
    var s0 = Math.max(cw / nw, ch / nh), s = s0;
    s = Math.max(s, cw * tx / (nw * fx), cw * (1 - tx) / (nw * (1 - fx)), ch * ty / (nh * fy), ch * (1 - ty) / (nh * (1 - fy)));
    s = Math.min(s, s0 * (zmax || 1));
    var iw = nw * s, ih = nh * s;
    var x = Math.min(0, Math.max(cw - iw, cw * tx - iw * fx));
    var y = Math.min(0, Math.max(ch - ih, ch * ty - ih * fy));
    var st = img.style;
    st.position = 'absolute'; st.maxWidth = 'none'; st.objectFit = 'fill';
    st.width = iw + 'px'; st.height = ih + 'px'; st.left = x + 'px'; st.top = y + 'px';
    // 寄り（scale）しても顔の位置が動かないよう顔を原点に。左右反転（scaleX(-1)）の写真は中心で反転させる
    st.transformOrigin = flip ? '50% 50%' : (fx * 100) + '% ' + (fy * 100) + '%';
  }

  function build(members) {
    var ov = el('div', 's5lu');
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'STARTING 5IVE スタメン発表');

    var intro = el('div', 's5lu-layer s5lu-intro',
      '<div><span class="k">STARTING 5IVE</span>' +
      '<h2 class="t"><span>STARTING</span><span>LINEUP</span></h2><i class="ln"></i></div>');
    ov.appendChild(intro);

    var scenes = members.map(function (m) {
      var spot = el('div', 's5lu-layer s5lu-spot',
        '<div class="box"><img alt="" src="' + esc(m.src) + '"></div>' +
        '<div class="dark"></div>' +
        '<div class="s5lu-call"><span class="num">NUMBER ' + m.n + '</span>' +
        '<b class="nm">' + esc(m.en) + '</b><span class="ja">' + esc(m.ja) + '</span></div>');
      var rep = '';
      for (var i = 0; i < 16; i++) rep += '<span>' + esc(m.en) + ' ✦ ' + esc(m.ja) + '</span>';
      var card = el('div', 's5lu-layer s5lu-card',
        '<div class="s5lu-mq top"><div class="tr">' + rep + '</div></div>' +
        '<div class="s5lu-grid">' +
          '<div class="ph l"><img alt="" src="' + esc(m.src) + '"></div>' +
          '<div class="s5lu-big"><span class="tag">STARTING 5IVE</span><span class="o">' + m.n + '</span><span class="f">' + m.n + '</span></div>' +
          '<div class="ph r"><img alt="" src="' + esc(m.src) + '"></div>' +
        '</div>' +
        '<div class="s5lu-bar"><span class="no">' + String(m.n).padStart(2, '0') + '</span><strong>' + esc(m.ja) + '</strong>' +
          '<span class="en">' + esc(m.en) + '</span>' +
          (m.subs ? '<span class="yt">' + m.plat + '<em>0</em>万人</span>' : '') + '</div>' + // クリスは TikTok（2026-11-05 クリス指示）
        '<div class="s5lu-mq bot"><div class="tr">' + rep + '</div></div>' +
        '<i class="s5lu-led"></i><i class="s5lu-sweep"></i>');
      ov.appendChild(spot); ov.appendChild(card);
      return { m: m, spot: spot, card: card };
    });

    var cards = members.map(function (m) {
      return '<div class="c"><img alt="" src="' + esc(m.src) + '">' +
        '<span class="n">' + m.n + '</span><span class="nm">' + esc(m.ja) + '</span></div>';
    }).join('');
    var final = el('div', 's5lu-layer s5lu-final',
      '<div class="hd"><span class="k">TONIGHT\'S STARTERS</span><h2 class="t">STARTING 5IVE</h2></div>' +
      '<div class="s5lu-row">' + cards + '</div>' +
      '<a class="s5lu-go" href="#members">メンバー紹介を見る ↓</a>');
    ov.appendChild(final);

    ov.appendChild(el('i', 's5lu-flash'));
    // スキップはバンバのページと同じ「TAP TO SKIP」（右下・小さい文字）。押すと即座に通常ページへ
    var skip = el('button', 's5lu-skip', 'TAP TO SKIP');
    skip.type = 'button';
    skip.setAttribute('aria-label', 'スタメン発表をスキップ');
    ov.appendChild(skip);
    return { ov: ov, intro: intro, scenes: scenes, final: final, skip: skip };
  }

  // スポットの中心：frame() で置いた写真の「顔」の位置を画面座標で求める（寄りの scale は顔が原点なので影響しない）
  function facePoint(img, face) {
    var b = img.parentElement.getBoundingClientRect();
    var x = parseFloat(img.style.left) || 0, y = parseFloat(img.style.top) || 0;
    var w = parseFloat(img.style.width) || b.width, h = parseFloat(img.style.height) || b.height;
    return { x: b.left + x + w * face[0], y: b.top + y + h * face[1], h: h * (face[2] || 0.35) };
  }

  // ---------- 音（Web Audio。押した時だけ読み込む） ----------
  function makeAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {} // iPhone の消音スイッチが入っていても鳴らす（2026-11-05 クリス指示「スマホで見ると音が鳴らない」）
    var ctx = new AC();
    var master = ctx.createGain();
    // 歓声を最後まで上げ続けても割れないように、出口に音割れ防止（リミッター）を1つだけ挟む（音色は変えない）
    var lim = ctx.createDynamicsCompressor();
    lim.threshold.value = -7.5; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = 0; lim.release.value = 0.15; // 実ブラウザ出力で 0dB 超ゼロを確認した値
    master.connect(lim); lim.connect(ctx.destination);
    var a = { ctx: ctx, master: master, bufs: {}, srcs: [] };
    a.load = function () {
      return Promise.all(SND_FILES.map(function (k) {
        return fetch(SND_BASE + k + '.mp3').then(function (r) { if (!r.ok) throw new Error(k); return r.arrayBuffer(); })
          .then(function (ab) { return new Promise(function (ok, ng) { ctx.decodeAudioData(ab, ok, ng); }); })
          .then(function (b) { a.bufs[k] = b; });
      }));
    };
    a.play = function (k, vol) {
      var b = a.bufs[k]; if (!b || ctx.state === 'closed') return null;
      var src = ctx.createBufferSource(), g = ctx.createGain();
      src.buffer = b; g.gain.value = vol == null ? 1 : vol;
      src.connect(g); g.connect(master); src.start();
      a.srcs.push(src);
      return g;
    };
    a.ramp = function (g, v, sec) { if (g) { g.gain.cancelScheduledValues(ctx.currentTime); g.gain.setValueAtTime(g.gain.value, ctx.currentTime); g.gain.linearRampToValueAtTime(v, ctx.currentTime + sec); } };
    a.stop = function (fade) {
      if (ctx.state === 'closed') return;
      var end = function () { a.srcs.forEach(function (x) { try { x.stop(); } catch (e) {} }); a.srcs = []; try { ctx.close(); } catch (e) {} };
      if (fade) { a.ramp(master, 0, fade); setTimeout(end, fade * 1000 + 50); } else end();
    };
    return a;
  }

  function play(members, audio, audioReady) {
    var g = window.gsap;
    var ui = build(members);
    document.body.appendChild(ui.ov);
    root.classList.add('s5lu-lock');
    unpend();

    var done = false, tl = null, soundOn = false;
    var UNLOCK = ['pointerdown', 'pointerup', 'mousedown', 'touchstart', 'touchend', 'keydown', 'keyup', 'click', 'wheel', 'touchmove', 'scroll'];
    function close(instant, toMembers) {
      if (done) return; done = true;
      if (tl) tl.kill();
      document.removeEventListener('keydown', onKey);
      UNLOCK.forEach(function (n) { removeEventListener(n, unlock, true); });
      freeTouch();
      removeEventListener('resize', layout);
      if (audio) audio.stop(instant ? 0 : 2.8); // 歓声のピークで開き、歓声が残ったまま 2.8 秒かけて消える
      function fin() {
        ui.ov.remove();
        root.classList.remove('s5lu-lock');
        if (toMembers) {
          var t = document.getElementById('members');
          if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      if (instant) fin();
      else g.to(ui.ov, { autoAlpha: 0, duration: 0.5, ease: 'power2.out', onComplete: fin });
    }
    function onKey(e) { if (e.key === 'Escape') close(true); }
    ui.skip.addEventListener('click', function () { close(true); });
    ui.final.querySelector('.s5lu-go').addEventListener('click', function (e) { e.preventDefault(); close(true, true); });
    document.addEventListener('keydown', onKey);

    // 顔を各枠の真ん中に置く（スポット・背番号カード左右・最後の5人）。画面サイズが変わったら置き直す
    function layout() {
      ui.scenes.forEach(function (sc) {
        var f = sc.m.face;
        frame(sc.spot.querySelector('.box img'), f, 0.5, 0.42, 1);
        frame(sc.card.querySelector('.ph.l img'), f, 0.5, 0.42, 1.6);
        frame(sc.card.querySelector('.ph.r img'), f, 0.5, 0.42, 1.6, true); // 右は左右反転の写真
      });
      ui.final.querySelectorAll('.s5lu-row .c img').forEach(function (img, i) { frame(img, members[i].face, 0.5, 0.4, 1.6); });
    }
    layout();
    addEventListener('resize', layout);
    // 写真の実寸は読み込み後に決まるので、まだの写真は読み込めた時に置き直す
    ui.ov.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', layout, { once: true }); });

    // スマホの音: ブラウザのスクロールとして扱われた指の動きは「操作」と認められず、音を許可できない。
    // そこで音が出るまでの間だけ touch-action:none にして JS でスクロールさせる（指示87のスクロールはそのまま）。指を離した瞬間に音が出る
    var touchOn = !!audio && (('ontouchstart' in window) || navigator.maxTouchPoints > 0), tY = 0, tT = 0, tV = 0, tRaf = 0;
    function toY(d) { window.scrollBy({ top: d, left: 0, behavior: 'instant' }); }
    function tStart(e) { cancelAnimationFrame(tRaf); tY = e.touches[0].clientY; tT = e.timeStamp; tV = 0; }
    function tMove(e) {
      var y = e.touches[0].clientY, d = tY - y;
      toY(d);
      tV = 0.8 * d / Math.max(1, e.timeStamp - tT) + 0.2 * tV; tY = y; tT = e.timeStamp;
    }
    function tEnd(e) {
      if (e.touches.length) return;
      (function step() { if (Math.abs(tV) < 0.03) return; toY(tV * 16); tV *= 0.95; tRaf = requestAnimationFrame(step); })();
    }
    function freeTouch() {
      if (!touchOn) return; touchOn = false;
      root.style.touchAction = ''; document.body.style.touchAction = '';
      removeEventListener('touchstart', tStart); removeEventListener('touchmove', tMove); removeEventListener('touchend', tEnd);
    }
    if (touchOn) {
      root.style.touchAction = 'none'; document.body.style.touchAction = 'none';
      addEventListener('touchstart', tStart, { passive: true }); addEventListener('touchmove', tMove, { passive: true }); addEventListener('touchend', tEnd, { passive: true });
    }

    // 音: 常に音あり前提。許されていれば最初から鳴らし、止められていたら最初の操作で頭から音ありでやり直す
    function startSound() {
      if (done || soundOn || !audio || audio.ctx.state !== 'running') return;
      soundOn = true;
      UNLOCK.forEach(function (n) { removeEventListener(n, unlock, true); });
      freeTouch();
      run(true);
    }
    function unlock(e) {
      if (done || soundOn || !audio) return;
      if (e && e.target && e.target.closest && e.target.closest('.s5lu-skip')) return; // スキップを押した時は鳴らさず閉じる
      if (e && e.key === 'Escape') return;
      var r = audio.ctx.resume ? audio.ctx.resume() : null;
      Promise.resolve(r).then(function () { return audioReady; }).then(function (ok) { if (ok) startSound(); });
    }
    if (audio) {
      UNLOCK.forEach(function (n) { addEventListener(n, unlock, { capture: true, passive: true }); });
      audioReady.then(function (ok) {
        if (!ok) { audio.stop(0); audio = null; freeTouch(); return; }
        if (audio.ctx.resume) audio.ctx.resume().then(startSound, function () {});
        startSound();
      });
    }

    var small = innerWidth <= 700;
    var it = ui.intro, tSpans = it.querySelectorAll('.t span'), kEl = it.querySelector('.k');
    var fl = ui.ov.querySelector('.s5lu-flash');

    function run(sound) {
      if (tl) tl.kill();
      // やり直す時は各層を初期状態（CSS の非表示）に戻す
      g.set(ui.ov.querySelectorAll('.s5lu-layer'), { clearProps: 'visibility,opacity,clipPath' });
      g.set(fl, { opacity: 0 });
      tl = g.timeline({ onComplete: function () { close(false); } });
      var snd = sound && audio ? function (fn) { return function () { if (!done) fn(); }; } : null;
      var crowd = null, react = null;

      // 0. イントロ（音ありは MC の「Ladies and gentlemen… here is your STARTING… FIVE!」に合わせて伸ばす）
      kEl.textContent = sound ? 'LADIES & GENTLEMEN' : 'STARTING 5IVE';
      tSpans[1].textContent = sound ? '5IVE' : 'LINEUP';
      var ci = CUE.intro;
      var tS = sound ? ci.starting : 0.3, tF = sound ? ci.five : 0.42, tOut = sound ? ci.end + 0.35 : 1.75;
      tl.set(it, { autoAlpha: 1 }, 0)
        .fromTo(kEl, { autoAlpha: 0, letterSpacing: '1.2em' }, { autoAlpha: 1, letterSpacing: '0.5em', duration: sound ? 1.6 : 0.8, ease: 'power3.out' }, 0.15)
        .fromTo(tSpans[0], { yPercent: 110, clipPath: 'inset(0 0 100% 0)' }, { yPercent: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.out' }, tS)
        .fromTo(tSpans[1], { yPercent: 110, clipPath: 'inset(0 0 100% 0)' }, { yPercent: 0, clipPath: 'inset(0 0 0% 0)', duration: sound ? 0.45 : 0.6, ease: 'power4.out' }, tF)
        .fromTo(it.querySelector('.ln'), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: 'power3.inOut' }, tF + 0.18)
        .to(it, { autoAlpha: 0, duration: 0.25 }, tOut);
      if (sound) {
        tl.call(snd(function () { crowd = audio.play('crowd', 0); audio.ramp(crowd, CROWD.intro[0], 0.4); audio.play('call-0'); }), null, 0.01)
          .call(snd(function () { audio.ramp(crowd, CROWD.intro[1], 0.25); }), null, 0.01 + ci.voice);
      }

      var at = tOut + 0.25;
      ui.scenes.forEach(function (sc) {
        var sp = sc.spot, cd = sc.card, m = sc.m;
        var dark = sp.querySelector('.dark'), simg = sp.querySelector('.box img');
        var R = small ? 150 : 210;
        var cue = CUE.calls[m.n];
        var useSnd = sound && cue;
        // 音なし: 従来どおり 2.6 秒刻み。音あり: 名前を言い始める瞬間に名前を出し、声が終わるまで待つ
        var tNum = useSnd ? 0.2 : 0.3, tName = useSnd ? 0.15 + cue[0] : 0.4;
        var bt = at + (useSnd ? tName + 0.75 : 1.15);
        var last = sc === ui.scenes[ui.scenes.length - 1];
        // 最後（5番）は声が上がりきった直後にフラッシュ→ラインナップへ（間を空けない）
        var step = useSnd ? 0.15 + cue[1] + (last ? 0.05 : 0.55) : 2.6;

        function aim() {
          var p = facePoint(simg, m.face);
          R = Math.round(Math.min(small ? 190 : 300, Math.max(small ? 120 : 150, p.h * 0.62))); // 顔の大きさに合わせた丸
          dark.style.setProperty('--x', p.x + 'px');
          dark.style.setProperty('--y', p.y + 'px');
        }
        aim();
        // A：暗転 → スポットライト → コール
        tl.set(sp, { autoAlpha: 1 }, at)
          .call(aim, null, at)
          .fromTo(dark, { '--r': 0 }, { '--r': function () { return R; }, duration: 0.7, ease: 'expo.out' }, at + 0.15)
          .fromTo(simg, { scale: 1.12 }, { scale: 1, duration: useSnd ? 2.4 : 1.4, ease: 'power2.out' }, at)
          .fromTo(sp.querySelector('.num'), { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power3.out' }, at + tNum)
          .fromTo(sp.querySelector('.nm'), { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: 'power3.inOut' }, at + tName)
          .fromTo(sp.querySelector('.ja'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3 }, at + tName + 0.3);
        if (useSnd) {
          var nameHead = CUE.calls[m.n][0], riseT = nameHead + (CUE.voice[m.n] - nameHead) * CROWD.riseAt[m.n - 1];
          tl.call(snd(function () { audio.ramp(crowd, CROWD.under[m.n - 1], 0.25); audio.ramp(react, 0, 0.25); }), null, at - 0.1)
            .call(snd(function () { audio.play('call-' + m.n); }), null, at + 0.15)
            .call(snd(function () { audio.ramp(crowd, CROWD.rise[m.n - 1], CUE.voice[m.n] - riseT); }), null, at + 0.15 + riseT)
            .call(snd(function () { audio.ramp(crowd, CROWD.up[m.n - 1], 0.25); react = audio.play('roar', CROWD.roar[m.n - 1]); }), null, at + 0.15 + CUE.voice[m.n]);
        }

        // B：ジャンボトロンの背番号カードにワイプで切り替え
        tl.set(cd, { autoAlpha: 1 }, bt)
          .fromTo(cd, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.45, ease: 'power4.inOut' }, bt)
          .fromTo(cd.querySelector('.s5lu-sweep'), { xPercent: 450, opacity: 1 }, { xPercent: -100, opacity: 0, duration: 0.6, ease: 'power2.out' }, bt + 0.05)
          .set(sp, { autoAlpha: 0 }, bt + 0.45)
          .fromTo(cd.querySelector('.s5lu-big .o'), { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 0.55, duration: 0.6, ease: 'expo.out' }, bt + 0.2)
          .fromTo(cd.querySelector('.s5lu-big .f'), { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 0.5, ease: 'power3.out' }, bt + 0.35)
          .fromTo(cd.querySelectorAll('.s5lu-grid .ph'), { yPercent: function (k) { return k ? -12 : 12; }, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, bt + 0.2)
          .fromTo(cd.querySelector('.s5lu-bar'), { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: 'power3.out' }, bt + 0.4);
        var em = cd.querySelector('.s5lu-bar .yt em');
        if (em && m.subs) {
          var dec = (m.subs.split('.')[1] || '').length, target = parseFloat(m.subs);
          // 値の代入（setter）で表示を書き換える。onUpdate はシーク時に呼ばれず 0 のまま残るため（2026-11-05 撮影で確認）
          var cnt = (function (e, d) { var v = 0; return { get v() { return v; }, set v(x) { v = x; e.textContent = x.toFixed(d); } }; })(em, dec);
          tl.fromTo(cnt, { v: 0 }, { v: target, duration: 0.8, ease: 'power2.out' }, bt + 0.45);
        }
        at += step;
        tl.set(cd, { autoAlpha: 0 }, at);
      });

      // 3. 照明が戻る（白フラッシュ）→ 5人のラインナップ
      var ft = at;
      tl.fromTo(fl, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: 'power1.in' }, ft - 0.12)
        .set(ui.final, { autoAlpha: 1 }, ft)
        .to(fl, { opacity: 0, duration: 0.9, ease: 'power2.out' }, ft + 0.05)
        .fromTo(ui.final.querySelectorAll('.s5lu-row .c'), { yPercent: 18, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, ft + 0.1)
        .fromTo(ui.final.querySelector('.hd'), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.5 }, ft + 0.15)
        .fromTo(ui.final.querySelector('.s5lu-go'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ft + 0.7)
        .to({}, { duration: sound && CUE.final ? Math.max(1.5, 0.1 + CUE.final.end - 0.8) : (sound ? 1.5 : 1.6) }, ft + 0.8);
      // 音あり: 5人が並んだ所で締めの一言 → "is" から大歓声を重ね、YOU で最大に → 歓声のピーク（CUE.final.end）でサイトが開く
      if (sound && CUE.final) {
        var fz = ft + 0.1, cf = CUE.final;
        tl.call(snd(function () { audio.play('call-final'); audio.ramp(crowd, CROWD.final[0], 0.5); audio.ramp(react, 0, 0.5); }), null, fz)
          .call(snd(function () { audio.play('cheer', 1); audio.ramp(crowd, CROWD.final[1], cf.end - cf.cheer); }), null, fz + cf.cheer)
          .call(snd(function () { audio.play('roar', 0.7); }), null, fz + cf.you);
      }
      if (sound && !CUE.calls[5]) tl.call(snd(function () { audio.play('roar', 0.9); audio.ramp(crowd, 0.9, 0.4); }), null, ft - 0.15);
      window.__s5lu = { tl: tl, close: close, run: run }; // 確認撮影用（tl.pause().seek(秒)）
    }
    run(false);
  }

  function start() {
    var members = readMembers();
    if (members.length !== 5) { unpend(); return; }
    var fonts = document.fonts && document.fonts.load ? Promise.all([
      document.fonts.load('400 100px Anton'), document.fonts.load('400 20px "Archivo Black"')
    ]) : Promise.resolve();
    // 音は最初から読み込んでおく（デコードは操作前でもできる。鳴らすのは許された時だけ）
    var audio = makeAudio();
    var audioReady = audio ? audio.load().then(function () { return true; }, function () { return false; }) : Promise.resolve(false);
    Promise.race([
      Promise.all([loadScript(GSAP_SRC), fonts.catch(function () {}), audioReady].concat(members.map(function (m) { return loadImg(m.src); }))),
      timeout(2500)
    ]).then(function () {
      if (window.gsap) play(members, audio, audioReady); else { if (audio) audio.stop(0); unpend(); }
    }, unpend);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
