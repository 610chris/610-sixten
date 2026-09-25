/* ブランドページ共通の3D・アニメーション演出（brand-fx.css と対）
   - トップ(home-fx.js)と同じ手ざわり: 進捗バー・ラベルの線・カードの時間差と3D傾き・ヒーローの視差
   - <html class="fx"> が無い（=視差効果を減らす設定）なら何もしない */
(function () {
  'use strict';
  var root = document.documentElement;
  if (!root.classList.contains('fx')) return;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var tasks = [], vh = innerHeight;

  /* 進捗バー */
  var bar = document.createElement('div');
  bar.className = 'fx-progress';
  document.body.appendChild(bar);
  tasks.push(function (sy) {
    var max = document.documentElement.scrollHeight - vh;
    bar.style.transform = 'scaleX(' + (max > 0 ? clamp(sy / max, 0, 1) : 0) + ')';
  });

  /* ラベルの線・グリッドの子の時間差 */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('.sec-label').forEach(function (el) { io.observe(el); });
  document.querySelectorAll('.fx-stagger').forEach(function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', i); });
  });

  /* ブランド名を1文字ずつ（子要素 small は残す） */
  document.querySelectorAll('.brand-hero .type-logo').forEach(function (el) {
    var t = el.firstChild;
    if (!t || t.nodeType !== 3) return;
    var frag = document.createDocumentFragment(), i = 0;
    Array.prototype.forEach.call(t.textContent.trim(), function (c) {
      var s = document.createElement('span');
      s.className = c === ' ' ? 'ch sp' : 'ch'; s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i++);
      s.textContent = c === ' ' ? ' ' : c;
      frag.appendChild(s);
    });
    el.setAttribute('aria-label', t.textContent.trim());
    el.replaceChild(frag, t);
  });

  /* カードの3D傾き＋光（マウス環境だけ） */
  if (canHover) {
    document.querySelectorAll('.channel-card, .tt-card, .thumb-card, .s5-camp, .s5-member, .fx-card').forEach(function (card) {
      card.classList.add('fx-tilt');
      var g = document.createElement('span');
      g.className = 'fx-glare'; g.setAttribute('aria-hidden', 'true');
      card.appendChild(g);
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 7).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 9).toFixed(2) + 'deg) translateY(-4px)';
        g.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        g.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ヒーロー: 写真・背景文字の視差 */
  var hero = document.querySelector('.brand-hero');
  var person = hero && hero.querySelector('.hero-chris');
  var typo = hero && hero.querySelector('.stage-typo');
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  if (hero && canHover) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect();
    tmx = (e.clientX - r.left) / r.width - 0.5; tmy = (e.clientY - r.top) / r.height - 0.5;
  });
  tasks.push(function (sy) {
    if (!hero || sy > hero.offsetHeight * 1.2) return;
    mx += (tmx - mx) * 0.06; my += (tmy - my) * 0.06;
    if (person) person.style.translate = (mx * -18).toFixed(1) + 'px ' + (sy * 0.12 + my * -10).toFixed(1) + 'px';
    if (typo) typo.style.translate = (mx * 30 - sy * 0.25).toFixed(1) + 'px ' + (sy * 0.3).toFixed(1) + 'px';
  });

  function frame(now) {
    var sy = window.scrollY;
    for (var i = 0; i < tasks.length; i++) tasks[i](sy);
    requestAnimationFrame(frame);
  }
  addEventListener('resize', function () { vh = innerHeight; });
  requestAnimationFrame(frame);
})();
