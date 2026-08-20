// 610 BASKETBALL JOURNAL 広告枠（常設スロット）
// ここのCONFIGを書き換えるだけで全ページの広告が一括で切り替わる。
// null / 空配列 のあいだは「広告掲載のご案内」プレースホルダーが表示される。

// ① 純広告バナー（スポンサー直販枠）— トップのフィード内＋各記事の本文末尾に出る
const SPONSOR_BANNER = null;
// 例: const SPONSOR_BANNER = { img: "../assets/ad-sponsor.png", href: "https://example.com/", alt: "スポンサー名" };

// ③ アフィリエイト（PICK UP — おすすめアイテム枠）— 各記事の本文末尾に出る
const AFFILIATE_ITEMS = [];
// 例: AFFILIATE_ITEMS = [
//   { img: "../assets/item-aj1.jpg", href: "https://amzn.to/xxxx", title: "Air Jordan 1 Retro High OG", note: "Amazonで見る →" },
// ];

function adSponsorSlot() {
  if (SPONSOR_BANNER) {
    const a = document.createElement('a');
    a.className = 'ad-slot ad-sponsor';
    a.href = SPONSOR_BANNER.href;
    a.target = '_blank';
    a.rel = 'sponsored noopener';
    a.innerHTML = '<span class="ad-label">SPONSOR</span>';
    const img = document.createElement('img');
    img.src = SPONSOR_BANNER.img;
    img.alt = SPONSOR_BANNER.alt || 'sponsor';
    img.loading = 'lazy';
    a.appendChild(img);
    return a;
  }
  const d = document.createElement('div');
  d.className = 'ad-slot ad-sponsor ad-empty';
  d.innerHTML = '<span class="ad-label">SPONSOR</span>'
    + '<p>AD SPACE — この枠に貴社の広告を掲載できます</p>'
    + '<a class="ad-cta" href="../index.html#contact">広告掲載のご相談 →</a>';
  return d;
}

function adAffiliateSlot() {
  const box = document.createElement('div');
  box.className = 'ad-slot ad-affiliate';
  if (AFFILIATE_ITEMS.length) {
    box.innerHTML = '<span class="ad-label">PICK UP — おすすめアイテム</span>';
    const grid = document.createElement('div');
    grid.className = 'aff-grid';
    AFFILIATE_ITEMS.forEach(it => {
      const a = document.createElement('a');
      a.className = 'aff-card';
      a.href = it.href;
      a.target = '_blank';
      a.rel = 'sponsored noopener';
      const img = document.createElement('img');
      img.src = it.img;
      img.alt = it.title;
      img.loading = 'lazy';
      a.appendChild(img);
      const t = document.createElement('strong');
      t.textContent = it.title;
      a.appendChild(t);
      const n = document.createElement('span');
      n.textContent = it.note || '詳しく見る →';
      a.appendChild(n);
      grid.appendChild(a);
    });
    box.appendChild(grid);
  } else {
    box.classList.add('ad-empty');
    box.innerHTML = '<span class="ad-label">PICK UP</span>'
      + '<p>おすすめアイテム枠 — COMING SOON</p>';
  }
  return box;
}

// トップページ: ALL STORIESのVIDEO帯の5記事後(11番目)に純広告バナー
const adFeed = document.getElementById('feed-list');
if (adFeed && adFeed.children.length) {
  adFeed.insertBefore(adSponsorSlot(), adFeed.children[11] || null);
}

// 記事ページ: 本文の後(MORE FROMの手前)に アフィリ枠 → 純広告バナー の順で常設
const adRelated = document.querySelector('.related');
if (adRelated && document.querySelector('.article-body')) {
  adRelated.parentNode.insertBefore(adAffiliateSlot(), adRelated);
  adRelated.parentNode.insertBefore(adSponsorSlot(), adRelated);
}
