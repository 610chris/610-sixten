/* トップページの3D・アニメーション演出（home-fx.css と対）
   - 外部ライブラリなし（WebGL直書き）
   - <html class="fx"> が無い（=視差効果を減らす設定）なら何もしない */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('fx')) return;

  var ACCENT = [232 / 255, 121 / 255, 43 / 255]; // 小さいボールのオレンジ（バスケットボールの色）
  var isCoarse = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var tasks = [];           // 毎フレーム呼ぶ処理（1本の rAF にまとめる）
  var scrollY = window.scrollY, lastY = scrollY, vel = 0, vh = innerHeight;
  // 位置・大きさは毎フレーム読まない（スタイルを書いた直後に読むと毎回レイアウト計算が走ってスマホで重い）。
  // 大きさが変わった時だけ measures をまとめて測り直す。値はページ上の位置（スクロール量を足したもの）
  var measures = [], dirty = true;
  function markDirty() { dirty = true; }
  addEventListener('resize', markDirty);
  addEventListener('load', markDirty);
  if (window.ResizeObserver) new ResizeObserver(markDirty).observe(document.body);
  function docTop(el) { return el.getBoundingClientRect().top + window.scrollY; }

  /* ---------- 文字を1文字ずつ span に分ける ---------- */
  function splitChars(el) {
    if (!el) return;
    var text = el.textContent;
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var prev = null, i = 0;
    Array.prototype.forEach.call(text, function (c) {
      // 句読点は前の文字とくっつけて、行頭に来ないようにする
      if (prev && '、。，．,.!?！？」』）)'.indexOf(c) >= 0) { prev.textContent += c; return; }
      var s = document.createElement('span');
      prev = s;
      s.className = 'ch';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i++);
      s.textContent = c === ' ' ? ' ' : c;
      el.appendChild(s);
    });
  }
  splitChars(document.querySelector('.contact .sec-title'));

  /* ---------- 進捗バー ---------- */
  var bar = document.createElement('div');
  bar.className = 'fx-progress';
  document.body.appendChild(bar);
  tasks.push(function () {
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? clamp(scrollY / max, 0, 1) : 0) + ')';
  });

  /* ---------- ヒーローの文字: スクロールで上へ抜けて薄くなる ---------- */
  var hero = document.querySelector('.hero');
  var heroName = document.querySelector('.hero-name');
  var heroTag = document.querySelector('.hero-tag');
  var heroScroll = document.querySelector('.hero-scroll');
  var heroH = 1;
  if (hero) measures.push(function () { heroH = hero.offsetHeight || 1; });
  tasks.push(function () {
    if (!hero || scrollY > heroH * 1.2) return;
    var s = scrollY;
    var o = clamp(1 - s / (heroH * 0.55), 0, 1);
    if (heroName) { heroName.style.transform = 'translateY(' + (-s * 0.35) + 'px)'; heroName.style.opacity = o; }
    if (heroTag) { heroTag.style.transform = 'translateY(' + (-s * 0.22) + 'px)'; heroTag.style.opacity = o; }
    if (heroScroll) heroScroll.style.opacity = clamp(1 - s / 120, 0, 1);
  });

  /* ---------- マーキー: スクロール速度で加速・向きが反転・傾く ---------- */
  var track = document.querySelector('.marquee-track');
  if (track) {
    var mx = 0, dir = 1, skew = 0, half = 0;
    measures.push(function () { half = track.scrollWidth / 2; });
    tasks.push(function (dt) {
      if (!half) return;
      if (vel > 0.5) dir = 1; else if (vel < -0.5) dir = -1;
      mx -= (60 * dt + Math.abs(vel) * 0.9) * dir;
      if (mx <= -half) mx += half;
      if (mx > 0) mx -= half;
      skew += (clamp(-vel * 0.35, -14, 14) - skew) * 0.15;
      track.style.transform = 'translate3d(' + mx + 'px,0,0) skewX(' + skew.toFixed(2) + 'deg)';
    });
  }

  /* ---------- マニフェスト: 行ごとに分けて、画面下から上がるにつれ灯る ---------- */
  var lines = [];
  var mani = document.querySelector('.manifesto');
  if (mani) {
    var n = 0;
    mani.querySelectorAll('p, .en').forEach(function (p) {
      var parts = p.innerHTML.split(/<br\s*\/?>/i);
      p.innerHTML = parts.map(function (h) {
        return '<span class="ln"><span class="ln-i" style="--i:' + (n++) + '">' + h.trim() + '</span></span>';
      }).join('');
      p.querySelectorAll('.ln').forEach(function (l) { lines.push(l); });
    });
    var maniTop = 0, maniBot = 0, lineMid = [];
    measures.push(function () {
      var r = mani.getBoundingClientRect();
      maniTop = r.top + window.scrollY; maniBot = r.bottom + window.scrollY;
      lineMid = lines.map(function (l) { var b = l.getBoundingClientRect(); return b.top + window.scrollY + b.height / 2; });
    });
    tasks.push(function () {
      if (maniBot - scrollY < -100 || maniTop - scrollY > vh + 100) return;
      lines.forEach(function (l, i) {
        var c = lineMid[i] - scrollY;
        var t = clamp((vh * 0.9 - c) / (vh * 0.35), 0, 1);
        l.style.setProperty('--lit', (0.18 + 0.82 * t).toFixed(3));
      });
    });
  }

  /* ---------- カードの時間差・ラベルの線 ---------- */
  document.querySelectorAll('.media-grid, .work-grid, .journal-grid').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });
  var labelIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-in'); labelIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  document.querySelectorAll('.sec-label').forEach(function (el) { labelIO.observe(el); });

  /* ---------- カードの3D傾き＋光の反射（マウス環境だけ） ---------- */
  if (canHover) {
    document.querySelectorAll('.media-card, .work-card.project-card').forEach(function (card) {
      card.classList.add('fx-tilt');
      var glare = document.createElement('span');
      glare.className = 'fx-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 7).toFixed(2) + 'deg) rotateY(' +
          ((px - 0.5) * 9).toFixed(2) + 'deg) translateY(-4px)';
        glare.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        glare.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------- WORK 写真のパララックス ---------- */
  var photos = Array.prototype.slice.call(document.querySelectorAll('.work-card.has-photo .ph')), photoBox = [];
  measures.push(function () {
    photoBox = photos.map(function (ph) { var r = ph.getBoundingClientRect(); return [r.top + window.scrollY, r.height]; });
  });
  tasks.push(function () {
    photos.forEach(function (ph, i) {
      var top = photoBox[i][0] - scrollY, h = photoBox[i][1];
      if (top + h < 0 || top > vh) return;
      var t = (top + h / 2 - vh / 2) / (vh / 2 + h / 2); // -1〜1
      ph.firstElementChild.style.setProperty('--py', (t * h * 0.06).toFixed(1) + 'px');
    });
  });

  /* ---------- ヒーロー背景: バスケコートのラインを光の線で ----------
     フルコート（94ft×50ft を 1ft=10 で描く）。床のように奥へ倒し、
     白い線は引かず、オレンジの光だけが見えない線の上を走り続ける。
     スマホでは作らない（ぼかしの光を毎フレーム描き直すのが重く、ボールの動きまで止まるため） */
  if (hero && !isCoarse) {
    var half = '<path d="M0 170H190V330H0"/>' +                                    // キー（制限区域）
      '<path d="M130 250a60 60 0 1 0 120 0a60 60 0 1 0 -120 0"/>' +                // フリースローサークル
      '<path d="M0 30H142A237.5 237.5 0 0 1 142 470H0"/>' +                         // 3ポイントライン
      '<path d="M40 220V280M45 250a7.5 7.5 0 1 0 15 0a7.5 7.5 0 1 0 -15 0"/>';     // バックボードとリング
    var courtLines = '<path d="M0 0H940V500H0Z"/><path d="M470 0V500"/>' +               // 外枠・センターライン
      '<path d="M410 250a60 60 0 1 0 120 0a60 60 0 1 0 -120 0"/>' +                 // センターサークル
      half + '<g transform="translate(940 0) scale(-1 1)">' + half + '</g>';
    var court = document.createElement('div');
    court.className = 'fx-court';
    court.setAttribute('aria-hidden', 'true');
    // 全体は見せない: 右半面（センターサークルの端〜3P・キー・FTサークル）だけをズームで切り取る
    court.innerHTML = '<svg viewBox="440 -40 540 600" preserveAspectRatio="xMidYMid slice">' +
      '<defs><filter id="fxCourtGlow" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
      '<g class="run" filter="url(#fxCourtGlow)">' + courtLines + '</g></svg>';
    // pathLength=1 にそろえて、線の長さに関係なく同じ速さで引く／光らせる
    // 崩し: 線ごとに少しずらして傾ける。白い下地の線は引かない＝光だけが走る
    Array.prototype.forEach.call(court.querySelectorAll('path'), function (el, i) {
      var k = i % 13;
      el.setAttribute('pathLength', '1');
      el.setAttribute('transform', 'translate(' + ((k * 37) % 11 - 5) * 4 + ' ' + ((k * 23) % 9 - 4) * 4 + ') rotate(' + ((k * 53) % 9 - 4) * 0.9 + ' 700 250)');
      el.style.setProperty('--d', k);
    });
    hero.insertBefore(court, hero.firstChild);
  }

  /* ---------- ヒーロー: WebGL 粒子ロゴ ---------- */
  var heroFx = null;
  if (root.classList.contains('fx-hero') && hero) {
    try { heroFx = createHeroFx(hero); } catch (err) { heroFx = null; }
    if (!heroFx) root.classList.remove('fx-hero');
  }

  /* ---------- 1本の rAF ループ ---------- */
  var last = performance.now();
  // 検証用: URL に ?fxdebug があるときだけ、フレーム数などを window.__fx に出す
  var dbg = /[?&]fxdebug\b/.test(location.search) ? (window.__fx = { frames: 0 }) : null;
  addEventListener('scroll', function () { scrollY = window.scrollY; }, { passive: true });
  addEventListener('resize', function () { vh = innerHeight; });
  function frame(now) {
    var dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    scrollY = window.scrollY;
    vel += ((scrollY - lastY) - vel) * 0.2;
    lastY = scrollY;
    if (dirty) { dirty = false; vh = innerHeight; measures.forEach(function (m) { try { m(); } catch (e) {} }); }
    // 次のフレームを先に予約: 途中の演出でエラーが出てもループは止めない
    requestAnimationFrame(frame);
    for (var i = 0; i < tasks.length; i++) { try { tasks[i](dt, now); } catch (e) { if (dbg) dbg.err = 'task' + i + ':' + e.message; } }
    if (heroFx) { try { heroFx.render(now, scrollY); } catch (e) { if (dbg) dbg.err = 'hero:' + e.message; } }
    if (dbg) { dbg.frames++; dbg.hidden = document.hidden; if (heroFx) { dbg.intro = heroFx.intro(now); dbg.st = heroFx.state(); } }
  }
  requestAnimationFrame(frame);

  /* =====================================================
     WebGL ヒーロー
     世界座標 = CSS px（原点=ヒーロー中央・y上向き）。z=0 の面で 1単位=1px になるように
     fov40°・カメラ距離 D=(H/2)/tan(20°)
     ===================================================== */
  function createHeroFx(hero) {
    var logoImg = hero.querySelector('.hero-logo');
    if (!logoImg) return null;
    var canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    hero.insertBefore(canvas, hero.firstChild);

    function fail() {
      dead = true;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      root.classList.remove('fx-hero', 'fx-hero-on');
    }
    var dead = false;

    function compile(vs, fs) {
      function sh(type, src) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      }
      var p = gl.createProgram();
      gl.attachShader(p, sh(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      var info = { p: p, a: {}, u: {} };
      var na = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES), nu = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS), i, x;
      for (i = 0; i < na; i++) { x = gl.getActiveAttrib(p, i); info.a[x.name] = gl.getAttribLocation(p, x.name); }
      for (i = 0; i < nu; i++) { x = gl.getActiveUniform(p, i); info.u[x.name] = gl.getUniformLocation(p, x.name); }
      return info;
    }

    var HEAD = 'precision highp float;uniform mat4 uProj;uniform mat4 uView;uniform float uDpr;uniform float uD;';

    // 粒子ロゴ。1粒ずつが小さなバスケットボール（立体）:
    // 粒を球として陰影・ハイライトをつけ、縫い目を3Dで回す＝転がる。
    // 転がる向きは集まってくる移動方向。集まる間は速く、揃ったあとはゆっくり転がり続ける
    var P = compile(HEAD +
      'attribute vec3 aTarget;attribute vec3 aStart;attribute vec4 aRand;' +
      'uniform vec4 uLogo;uniform float uTime;uniform float uIntro;uniform vec3 uMouse;uniform float uScatter;uniform float uScatT;uniform vec2 uBound;uniform float uSize;' +
      'varying float vAlpha;varying float vAccent;varying vec3 vAx;varying float vAng;' +
      'void main(){' +
      ' vec3 tgt=vec3(uLogo.x+aTarget.x*uLogo.z,uLogo.y-aTarget.y*uLogo.w,aTarget.z);' +
      ' float t=clamp((uIntro-aRand.x)/.95,0.,1.);float e=1.-pow(1.-t,4.);' +
      ' vec3 p=mix(aStart,tgt,e);' +
      ' float ph=aRand.y*6.2832;' +
      ' p+=vec3(sin(uTime*1.3+ph),cos(uTime*1.1+ph*1.7),sin(uTime*.8+ph*2.3)*3.)*(.9+aRand.z)*e;' +
      // 弾ける→トップの枠の中で跳ね返り続ける: ロゴの中心から外へ弾けたあと、一定速度で飛び、
      // 枠（uBound）で反射する（三角波で折り返す）。トップに戻ると uScatter が下がって 610 に集まり直す
      ' float w=uScatter*uScatter*(3.-2.*uScatter);float T=uScatT;' +
      ' vec2 dc=tgt.xy-vec2(uLogo.x+uLogo.z*.5,uLogo.y-uLogo.w*.5);' +
      ' vec2 dir=normalize(dc/max(uLogo.z*.5,1.)+vec2(sin(ph*3.1),cos(ph*2.7))*.6+vec2(1e-3));' +
      ' vec2 q=tgt.xy+dir*((160.+aRand.z*240.)*T+(420.+aRand.z*620.)*(1.-exp(-T*3.)));' +
      ' q=uBound-abs(mod(q+uBound,4.*uBound)-2.*uBound);' +
      ' p.xy=mix(p.xy,q,w);' +
      ' vec2 d=p.xy-uMouse.xy;float r=uMouse.z;float f=exp(-dot(d,d)/max(r*r,1.))*step(.5,r);' +
      ' p.xy+=normalize(d+vec2(1e-3))*f*r*.45;p.z+=f*140.;' +
      ' vec4 v=uView*vec4(p,1.);gl_Position=uProj*v;' +
      ' gl_PointSize=uSize*(.7+aRand.z*.7)*uDpr*(uD/-v.z)*(1.+f*.8);' +
      ' vec2 m=normalize(tgt.xy-aStart.xy+vec2(1e-3));' +
      ' vAx=normalize(vec3(-m.y,m.x,0.)+.45*vec3(sin(ph*1.7),cos(ph*2.3),sin(ph)));' +
      ' vAng=ph+e*(10.+aRand.z*10.)+uTime*(.8+aRand.z*1.2)+f*4.+w*T*(1.5+aRand.z*2.);' +
      ' vAlpha=(.25+.75*e)*(1.-.25*w)*min(1.,uIntro*1.5);vAccent=aRand.w;' +
      '}',
      // 黒は使わない: 白い粒 → 白に近い薄グレーの縫い目／オレンジの粒 → 少し濃いオレンジの縫い目
      'precision mediump float;varying float vAlpha;varying float vAccent;varying vec3 vAx;varying float vAng;' +
      'float seam(vec3 p){' +
      ' float s=max(length(p.yz),1e-3);float k=.62+.5*(p.z*p.z-p.y*p.y)/(s*s);' +
      ' float cu=abs(abs(p.x)-k*s)/sqrt(1.+k*k);' +
      ' return min(min(abs(p.y),abs(p.x)),cu);}' +
      'void main(){vec2 c=(gl_PointCoord-.5)*2.;float d2=dot(c,c);if(d2>1.)discard;' +
      ' vec3 n=vec3(c.x,-c.y,sqrt(1.-d2));' +
      ' float cs=cos(vAng),sn=-sin(vAng);vec3 p=n*cs+cross(vAx,n)*sn+vAx*dot(vAx,n)*(1.-cs);' +
      ' float line=1.-smoothstep(.1,.2,seam(p));' +
      ' vec3 L=normalize(vec3(-.5,.6,.62));float dif=max(dot(n,L),0.);' +
      ' float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),16.)*.4;' +
      ' vec3 acc=vec3(' + ACCENT.join(',') + ');' +
      ' vec3 col=mix(vec3(.97,.96,.94),acc,vAccent);' +
      ' vec3 lc=mix(vec3(.74,.73,.71),acc*.68,vAccent);' +
      ' col=mix(col,lc,line)*(.5+.6*dif)+spec;' +
      ' gl_FragColor=vec4(col,vAlpha*smoothstep(1.,.8,sqrt(d2)));}');

    function buffer(data, prog, name, size) {
      var b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return { b: b, loc: prog.a[name], size: size };
    }
    function bindAll(list) {
      list.forEach(function (x) {
        if (x.loc === undefined || x.loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, x.b);
        gl.enableVertexAttribArray(x.loc);
        gl.vertexAttribPointer(x.loc, x.size, gl.FLOAT, false, 0, 0);
      });
    }
    function unbindAll(list) {
      list.forEach(function (x) { if (x.loc !== undefined && x.loc >= 0) gl.disableVertexAttribArray(x.loc); });
    }

    // ---- ロゴの粒子（画像を読んでから作る） ----
    var partBufs = null, partCount = 0;
    var img = new Image();
    img.onload = function () {
      try {
        var W = 600, H = Math.round(600 * img.naturalHeight / img.naturalWidth);
        var c = document.createElement('canvas'); c.width = W; c.height = H;
        var cx = c.getContext('2d');
        cx.drawImage(img, 0, 0, W, H);
        var px = cx.getImageData(0, 0, W, H).data, cand = [];
        for (var yy = 0; yy < H; yy++) for (var xx = 0; xx < W; xx++) if (px[(yy * W + xx) * 4 + 3] > 140) cand.push(xx, yy);
        var nc = cand.length / 2;
        if (nc < 50) { fail(); return; }
        var N = isCoarse ? 3800 : 9500;
        var tgt = new Float32Array(N * 3), st = new Float32Array(N * 3), rnd = new Float32Array(N * 4);
        for (var j = 0; j < N; j++) {
          var q = (Math.random() * nc) | 0;
          tgt[j * 3] = (cand[q * 2] + Math.random()) / W;
          tgt[j * 3 + 1] = (cand[q * 2 + 1] + Math.random()) / H;
          tgt[j * 3 + 2] = (Math.random() - 0.5) * 16;
          // 散らばった初期位置（球殻状）
          var u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, rad = 500 + Math.random() * 900, sq = Math.sqrt(1 - u * u);
          st[j * 3] = Math.cos(a) * sq * rad * 1.4;
          st[j * 3 + 1] = u * rad * 0.8;
          st[j * 3 + 2] = Math.sin(a) * sq * rad - 200;
          rnd[j * 4] = Math.random() * 0.42 + tgt[j * 3] * 0.21;  // 遅延（左から少し早く集まる）。全体で約1.6秒で揃う
          rnd[j * 4 + 1] = Math.random();
          rnd[j * 4 + 2] = Math.random();
          rnd[j * 4 + 3] = Math.random() < 0.06 ? 1 : 0;       // 約6%をオレンジのボール
        }
        partBufs = [buffer(tgt, P, 'aTarget', 3), buffer(st, P, 'aStart', 3), buffer(rnd, P, 'aRand', 4)];
        partCount = N;
        introStart = performance.now();
      } catch (e) { fail(); }
    };
    img.onerror = fail;
    img.src = logoImg.currentSrc || logoImg.src;

    // ---- サイズ・カメラ ----
    var Wc = 1, Hc = 1, dpr = 1, D = 1, proj = new Float32Array(16), logoRect = [0, 0, 1, 1];
    function resize() {
      var r = hero.getBoundingClientRect();
      Wc = Math.max(1, r.width); Hc = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.5 : 1.75);
      canvas.width = Math.round(Wc * dpr); canvas.height = Math.round(Hc * dpr);
      var f = 1 / Math.tan(20 * Math.PI / 180);
      D = (Hc / 2) * f;
      var near = 10, far = D + 4000, asp = Wc / Hc;
      proj.fill(0);
      proj[0] = f / asp; proj[5] = f; proj[10] = (far + near) / (near - far); proj[11] = -1; proj[14] = 2 * far * near / (near - far);
      // ロゴの位置は <img> に合わせる（img 自身は透明で残す＝SEO・フォールバック）
      var lr = logoImg.getBoundingClientRect();
      logoRect = [lr.left - r.left - Wc / 2, Hc / 2 - (lr.top - r.top), lr.width, lr.height];
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(hero);
    addEventListener('resize', resize);

    function lookAt(ex, ey, ez) {
      // 原点を見る。up=(0,1,0)
      var zx = ex, zy = ey, zz = ez, zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl;
      var xx = zz, xy = 0, xz = -zx, xl = Math.hypot(xx, xz); xx /= xl; xz /= xl;
      var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      return new Float32Array([
        xx, yx, zx, 0,
        xy, yy, zy, 0,
        xz, yz, zz, 0,
        -(xx * ex + xy * ey + xz * ez), -(yx * ex + yy * ey + yz * ez), -(zx * ex + zy * ey + zz * ez), 1
      ]);
    }

    // ---- ポインター ----
    var mouse = { x: 0, y: 0, on: 0, tx: 0, ty: 0, ton: 0 }, cam = { x: 0, y: 0 };
    function onPointer(e) {
      var r = hero.getBoundingClientRect();
      mouse.tx = e.clientX - r.left - Wc / 2;
      mouse.ty = Hc / 2 - (e.clientY - r.top);
      mouse.ton = (e.clientY >= r.top && e.clientY <= r.bottom) ? 1 : 0;
    }
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('pointerdown', onPointer, { passive: true });
    root.addEventListener('mouseleave', function () { mouse.ton = 0; });
    addEventListener('touchend', function () { mouse.ton = 0; }, { passive: true });

    // ---- 表示中だけ描く ----
    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(hero);

    var introStart = 0, shown = false;
    var t0 = performance.now();

    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // 散らばり: 少しでも下へスクロールしたら弾けて、トップの中を跳ね返りながら動き続ける。
    // 集まり直すのは「一番上に戻って 0.4秒そのまま」のときだけ（スクロール中の跳ね返り・慣性で戻らない）
    var scatter = 0, scatT = 0, lastNow = 0, goal = 0, atTop = 0;
    function render(now, sy) {
      if (dead) return;
      var dt = lastNow ? Math.min((now - lastNow) / 1000, 0.1) : 0;
      lastNow = now;
      if (sy > Math.min(24, Hc * 0.03)) { goal = 1; atTop = 0; }
      else if (sy <= 2) { atTop += dt; if (atTop > 0.4) goal = 0; }
      if (goal) {
        if (scatter === 0) { scatT = 0; scatter = 1; }          // 弾ける
        else scatter = Math.min(1, scatter + dt / 0.35);         // 集まりかけから、なめらかに散り直す
      } else scatter = Math.max(0, scatter - dt / 0.9);
      if (scatter > 0) scatT += dt;
      if (!visible || document.hidden) return;
      var time = (now - t0) / 1000;

      mouse.x += (mouse.tx - mouse.x) * 0.18; mouse.y += (mouse.ty - mouse.y) * 0.18;
      mouse.on += (mouse.ton - mouse.on) * 0.08;
      var nx = canHover ? clamp(mouse.tx / (Wc / 2), -1, 1) * mouse.ton : 0;
      var ny = canHover ? clamp(mouse.ty / (Hc / 2), -1, 1) * mouse.ton : 0;
      cam.x += (nx * 70 - cam.x) * 0.04; cam.y += (ny * 45 - cam.y) * 0.04;
      var view = lookAt(cam.x, cam.y, D);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // 粒子ロゴ
      if (partBufs) {
        var intro = (now - introStart) / 1000;
        gl.useProgram(P.p);
        gl.uniformMatrix4fv(P.u.uProj, false, proj);
        gl.uniformMatrix4fv(P.u.uView, false, view);
        gl.uniform1f(P.u.uDpr, dpr);
        gl.uniform1f(P.u.uD, D);
        gl.uniform4f(P.u.uLogo, logoRect[0], logoRect[1], logoRect[2], logoRect[3]);
        gl.uniform1f(P.u.uTime, time);
        gl.uniform1f(P.u.uIntro, intro);
        gl.uniform3f(P.u.uMouse, mouse.x, mouse.y, mouse.on > 0.02 ? (isCoarse ? 90 : 120) * mouse.on + 0.01 : 0);
        gl.uniform1f(P.u.uScatter, scatter);
        gl.uniform1f(P.u.uScatT, scatT);
        gl.uniform2f(P.u.uBound, Math.max(1, Wc / 2 - 6), Math.max(1, Hc / 2 - 6));
        gl.uniform1f(P.u.uSize, isCoarse ? 2.2 : 2.5);
        bindAll(partBufs);
        gl.drawArrays(gl.POINTS, 0, partCount);
        unbindAll(partBufs);
        if (!shown) {
          shown = true;
          if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) { fail(); return; }
          root.classList.add('fx-hero-on');
        }
      }
    }

    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); fail(); });
    return { render: render, intro: function (now) { return partBufs ? (now - introStart) / 1000 : -1; }, state: function () { return { scatter: scatter, scatT: scatT, goal: goal, visible: visible }; } };
  }
})();
