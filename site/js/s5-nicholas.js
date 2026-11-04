/* ニコラス個人ページ: オープニング（パック開封風）の後始末（2026-11-04）
   - 演出の再生・自動フェードは CSS だけで完結（このJSが読めなくても約3.4秒で消える）
   - ここでは タップ/クリック/キー操作でスキップ と 終了後の要素削除 だけを行う */
(function () {
  'use strict';
  var intro = document.getElementById('nk-intro');
  if (!intro) return;
  var root = document.documentElement;
  if (!root.classList.contains('nk-intro-on')) { intro.remove(); return; }
  try { sessionStorage.setItem('nkIntroSeen', '1'); } catch (e) { /* 保存できなくても再生は続ける */ }

  var done = false;
  function finish() {
    if (done) return;
    done = true;
    intro.remove();
    root.classList.remove('nk-intro-on');
    document.removeEventListener('keydown', onKey);
  }
  function skip() { intro.classList.add('skip'); setTimeout(finish, 300); }
  function onKey(e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip(); }

  intro.addEventListener('click', skip);
  document.addEventListener('keydown', onKey);
  intro.addEventListener('animationend', function (e) { if (e.target === intro && e.animationName === 'nkOut') finish(); });
  setTimeout(finish, 3800); /* 念のための保険 */
})();
