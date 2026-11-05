// STARTING 5IVE 共通ヘッダーの三本線（メンバー個人ページ・グッズページ用。css/s5-nav.css とセット）
// starting5ive.html は章のハイライトもあるのでページ内のスクリプトで同じことをしている
(() => {
  const toggle = document.querySelector('.x5-burger');
  const menu = document.getElementById('x5-menu');
  if (!toggle || !menu) return;
  function setNav(open) {
    menu.hidden = !open;
    document.documentElement.classList.toggle('x5-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }
  toggle.addEventListener('click', () => setNav(menu.hidden));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setNav(false); toggle.focus(); } });
  document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('.x5-nav')) setNav(false); });
})();
