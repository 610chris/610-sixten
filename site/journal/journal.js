// 610 JOURNAL 共通スクリプト
// 記事メタデータ(日付降順)。新記事を追加したらここに1件足す。
// thumb: 実写真のパス(あれば必ず優先) / tile: 写真がない記事用のタイポグラフィ表紙
const ARTICLES = [
  {
    href: "027-converse-accelerator.html",
    cat: "KICKS",
    title: "名作「ACCELERATOR」が最新技術で復活 —— コンバース「CONS ACCELERATOR SE LOW」8月25日発売",
    excerpt: "コンバースジャパンは8月20日、バスケットボールシューズ「CONS ACCELERATOR SE LOW」を8月25日に発売すると発表。アーカイブモデル「ACCELERATOR」を、新構造シャンクや中空ミッドソールなど最新技術でアップデートした。価格14,300円(税込)。",
    date: "2026.08.20",
    thumb: "../assets/journal-027-hero.jpg",
    tile: "ACCELERATOR"
  },
  {
    href: "026-watson-cavaliers.html",
    cat: "NBA",
    title: "ワトソン、キャバリアーズへ —— ナゲッツとの5チーム間サイン&トレードで合意へ",
    excerpt: "Chris Haynes（NBA on Prime）が一報。デンバー・ナゲッツが、制限付きFAのペイトン・ワトソンをクリーブランド・キャバリアーズへ送るサイン&トレードに近づいている。5チーム間の取引で、ワトソンは4年8800万ドル(プレーヤーオプション付き)の契約条件に合意する見通し。",
    date: "2026.08.20",
    thumb: "../assets/journal-026-hero.jpg",
    tile: "WATSON"
  },
  {
    href: "025-lakers-buss-family-sale.html",
    cat: "NBA",
    title: "レイカーズ、バス家が最後の株式を手放す —— カシュナー氏とアイガー氏に17.8%売却、ジーニー・バスはガバナー退任へ",
    excerpt: "Shams Charania（ESPN）が一報。ロサンゼルス・レイカーズを保有するバス・ファミリー・トラストが、信託に残る17.8%の株式をジョシュ・カシュナー氏とボブ・アイガー氏に売却することを決定。完了後、ジーニー・バスはガバナーの資格を失う見通しとなった。",
    date: "2026.08.18",
    thumb: "../assets/journal-025-hero.jpg",
    tile: "LAKERS"
  },
  {
    href: "024-highsmith-suns.html",
    cat: "NBA",
    title: "古巣へ、1年契約で復帰 —— ヘイウッド・ハイスミス、サンズと合意",
    excerpt: "Shams Charania（ESPN）が一報。FAのヘイウッド・ハイスミスが、フェニックス・サンズとの1年契約に合意した。",
    date: "2026.08.17",
    thumb: "../assets/journal-024-hero.jpg",
    tile: "HIGHSMITH"
  },
  {
    href: "023-watford-pelicans.html",
    cat: "NBA",
    title: "遅めのオフシーズンに、掘り出し物 —— トレンドン・ワトフォード、ペリカンズと1年290万ドルで契約合意",
    excerpt: "Shams Charania（ESPN）が一報。FAのトレンドン・ワトフォードが、ニューオーリンズ・ペリカンズと1年290万ドルの契約に合意した。",
    date: "2026.08.17",
    thumb: "../assets/journal-023-hero.jpg",
    tile: "WATFORD"
  },
  {
    href: "020-bandai-namco-arena-matsue.html",
    cat: "JAPAN",
    title: "ホームアリーナに、クラブと同じ名前を —— 松江市総合体育館は9月から「バンダイナムコアリーナ松江」に",
    excerpt: "B.LEAGUE PREMIER参入の島根スサノオマジック。運営会社が松江市とネーミングライツ契約を締結、2026年9月1日から新愛称に。",
    date: "2026.08.17",
    thumb: "../assets/journal-020-hero.jpg",
    tile: "MATSUE"
  },
  {
    href: "001-banned-aj1.html",
    cat: "KICKS",
    title: "「禁止」が生んだ伝説 —— エア・ジョーダン1とルールの向こう側",
    excerpt: "1足のシューズが、なぜ40年経っても語り継がれるのか。伝説の始まりにあったのは、リーグの規定と1枚の広告だった。",
    date: "2026.08.15",
    thumb: "../assets/journal-001-hero.jpg",
    tile: "BANNED"
  },
  {
    href: "010-abema-saudi.html",
    cat: "JAPAN",
    title: "深夜2時、W杯への初戦 —— 最終予選サウジアラビア戦、ABEMAが無料生中継",
    excerpt: "W杯2027アジア最終予選が8月27日に開幕。八村塁と河村勇輝が合流予定の初戦を、ABEMAが無料生中継する。",
    date: "2026.08.14",
    thumb: "../assets/journal-010-hero.jpg",
    tile: "WINDOW4"
  },
  {
    href: "021-westbrook-retires.html",
    cat: "NBA",
    title: "トリプルダブルの王が、コートを去る —— ラッセル・ウェストブルック、18シーズンで現役引退",
    excerpt: "Shams Charania（ESPN）が一報。2017年MVP、通算トリプルダブル209回の男が、自らの流儀で18年のキャリアに幕を下ろした。",
    date: "2026.08.13",
    thumb: "../assets/journal-021-hero.jpg",
    tile: "RUSS"
  },
  {
    href: "009-abema-korea.html",
    cat: "JAPAN",
    title: "有明に、日の丸のエースが帰ってきた —— 八村塁と河村勇輝、約2年ぶりの代表戦をABEMAが無料生中継",
    excerpt: "8月16日・有明アリーナの韓国戦。パリ五輪以来およそ2年ぶりに、2人が代表のコートへ戻る。",
    date: "2026.08.12",
    thumb: "../assets/journal-009-hero.jpg",
    tile: "ARIAKE"
  },
  {
    href: "002-iverson.html",
    cat: "CULTURE",
    title: "コーンロウとアームスリーブ —— アレン・アイバーソンがコートに持ち込んだ「街」",
    excerpt: "NBAとヒップホップの距離を一気に縮めた男の話。",
    date: "2026.08.12",
    thumb: "../assets/journal-002-hero.jpg",
    tile: "IVERSON"
  },
  {
    href: "003-signature-shoes.html",
    cat: "KICKS",
    title: "シグネチャーシューズは「物語」でできている",
    excerpt: "スペックではなく、ストーリーがスニーカーを売る理由。",
    date: "2026.08.10",
    thumb: "../assets/journal-003-hero.jpg",
    tile: "SIGNATURE"
  },
  {
    href: "004-japan-hoops.html",
    cat: "JAPAN",
    title: "日本のバスケが「カルチャー」になる日",
    excerpt: "Bリーグ、部活、ストリート。この国のバスケの現在地。",
    date: "2026.08.07",
    thumb: "../assets/journal-fallback-04.jpg",
    tile: "JAPAN"
  },
  {
    href: "011-mandom-bs-summit.html",
    cat: "JAPAN",
    title: "整えることから、始まる —— マンダムが「BLACK SAMURAI SUMMIT 2026」ローカルパートナーに就任",
    excerpt: "ギャツビーが「部活ヘアサロン」でスタイリングとマインドセットを次世代へ。GAME DAYにはサンプリングも。",
    date: "2026.08.06",
    thumb: "../assets/journal-011-hero.jpg",
    tile: "GATSBY"
  },
  {
    href: "005-small-guards.html",
    cat: "NBA",
    title: "160cmの証明 —— 小さな選手たちがコートに残したもの",
    excerpt: "サイズの神話を壊し続けてきたガードたちの系譜。",
    date: "2026.08.04",
    thumb: "../assets/journal-005-hero.jpg",
    tile: "160cm"
  },
  {
    href: "012-glion-kobe-camp.html",
    cat: "JAPAN",
    title: "神戸の2日間を、神戸が運ぶ —— G LION GROUPが「BLACK SAMURAI KOBE CAMP」モビリティパートナーに",
    excerpt: "GLION ARENA KOBE開催のキャンプへBMW X7を提供。会場も移動も神戸の企業が支える2日間。",
    date: "2026.08.03",
    thumb: "../assets/journal-012-hero.jpg",
    tile: "GLION"
  },
  {
    href: "006-streetball.html",
    cat: "CULTURE",
    title: "アスファルトの聖地 —— ラッカーパークとストリートの系譜",
    excerpt: "NBAではない場所で、バスケが文化になった理由。",
    date: "2026.08.01",
    thumb: "../assets/journal-006-hero.jpg",
    tile: "RUCKER"
  },
  {
    href: "013-bs-summit-3players.html",
    cat: "JAPAN",
    title: "八村塁が選んだ、次の3人 —— 佐藤凪、トンプソン・ヨセフ・ハサン、磯田陸斗がSUMMITへ",
    excerpt: "渡米、大学、Bユース。3人3様のルートがIG ARENAに集まる。招待16名の残る1枠はKOBE CAMP MVP。",
    date: "2026.07.29",
    thumb: "../assets/journal-013-hero.jpg",
    tile: "NEXTGEN"
  },
  {
    href: "014-oikos-gold-partner.html",
    cat: "JAPAN",
    title: "アンバサダーから、パートナーへ —— ダノン オイコスが「BLACK SAMURAI 2026」のゴールドパートナーに",
    excerpt: "八村塁主宰の次世代育成プロジェクトにダノン オイコスが協賛。神戸・名古屋の2会場でサンプリング等を実施。",
    date: "2026.07.28",
    thumb: "../assets/journal-014-hero.jpg",
    tile: "OIKOS"
  },
  {
    href: "015-tabuse-hachimura-sasaki-talk.html",
    cat: "JAPAN",
    title: "日本バスケの過去・現在・未来を、この3人で —— 田臥勇太×八村塁×佐々木クリス、SUMMITでスペシャル対談",
    excerpt: "8月8日、名古屋IG ARENAのGAME DAYで実現。テーマは日本バスケットボール業界の過去・現在・未来。",
    date: "2026.07.27",
    thumb: "../assets/journal-015-hero.jpg",
    tile: "LEGENDS"
  },
  {
    href: "008-osakabe-donation-2026.html",
    cat: "REPORT",
    title: "恩師のもとへ、ふたたび —— 小酒部泰暉と、クリスのバスケ日記、2回目の40球を寄贈",
    excerpt: "2年ぶり2回目のボール寄贈。大磯高校と山北高校へ、計40球。",
    date: "2026.07.24",
    thumb: "../assets/journal-008-hero.jpg",
    heroThumb: "../assets/journal-008-group.jpg",
    featured: true
  },
  {
    href: "016-kobe-camp-storks.html",
    cat: "JAPAN",
    title: "地元のプロが、八村の舞台に上がる —— BLACK SAMURAI KOBE CAMP「THE SHOWCASE」に神戸ストークスが参加",
    excerpt: "8月4日・5日、GLION ARENA KOBEで全演目発表。8HOOPSで八村率いるチームと地元プロが対戦。",
    date: "2026.07.24",
    thumb: "../assets/journal-016-hero.jpg",
    tile: "STORKS"
  },
  {
    href: "019-toyama-kurobe-hachimura.html",
    cat: "JAPAN",
    title: "富山に、八村塁が帰ってくる —— NBA入り後初の公式凱旋イベント、8月22日にYKK AP ARENAで",
    excerpt: "8月22日、富山Homecomingで八村塁がNBA入り後初の公式凱旋。昼はクリニック、夜は祭り。",
    date: "2026.07.24",
    thumb: "../assets/journal-019-hero.jpg",
    tile: "TOYAMA"
  },
  {
    href: "017-canon-mj-bs2026.html",
    cat: "JAPAN",
    title: "コートの熱を、写真に残す人を育てる —— キヤノンMJが八村塁主宰「BLACK SAMURAI 2026」に協賛",
    excerpt: "キヤノンMJがBLACK SAMURAI 2026の神戸・名古屋に協賛。若手スポーツフォトグラファー育成プログラムを実施する。",
    date: "2026.07.22",
    thumb: "../assets/journal-017-hero.jpg",
    tile: "CANON"
  },
  {
    href: "018-bs-summit-second-wave.html",
    cat: "JAPAN",
    title: "大濠から3人、開志国際から2人 —— BLACK SAMURAI SUMMIT 2026、招待選手第二弾と指導陣が発表",
    excerpt: "名古屋・IG ARENAに集うU18招待選手第二弾と指導陣が発表。MVPにはNBA観戦ツアーが贈られる。",
    date: "2026.07.22",
    thumb: "../assets/journal-018-hero.jpg",
    tile: "ROSTER"
  },
  {
    href: "022-hachimura-clippers.html",
    cat: "NBA",
    title: "同じ街で、新しいユニフォームを —— 八村塁、クリッパーズと2年2800万ドルで契約合意",
    excerpt: "Shams Charania（ESPN）が一報。レイカーズとのサイン&トレードは成立せず、FA契約で望んだロサンゼルスに残る道を選んだ。",
    date: "2026.07.07",
    thumb: "../assets/journal-022-hero.jpg",
    tile: "RUI"
  },
  {
    href: "007-osakabe-donation.html",
    cat: "REPORT",
    title: "「足りない分は、顧問の自腹」を変えたい —— 小酒部泰暉と、母校へ届けたボール",
    excerpt: "県大会2回戦止まりだった2人の、恩師と母校へのはじめての恩返し。",
    date: "2024.08",
    thumb: "../assets/journal-007-hero.jpg"
  }
];

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// サムネHTML: 実写真 > タイポグラフィ表紙
function thumbHtml(a, forHero) {
  const src = forHero ? (a.heroThumb || a.thumb) : a.thumb;
  if (src) return '<div class="thumb"><img src="' + src + '" alt="" loading="lazy"></div>';
  return '<div class="thumb"><div class="tile"><span class="bar"></span><span class="word">' + esc(a.tile || a.cat) + "</span></div></div>";
}

function feedRowHtml(a) {
  return '<a class="feed-row" href="' + a.href + '" data-cat="' + a.cat + '">' +
    thumbHtml(a, false) +
    '<div class="body">' +
    '<div class="meta-row"><span class="jr-cat">' + a.cat + '</span><span class="jr-date">' + a.date + "</span></div>" +
    "<h3>" + esc(a.title) + "</h3>" +
    '<p class="excerpt">' + esc(a.excerpt) + "</p>" +
    "</div></a>";
}

function relCardHtml(a) {
  return '<a class="rel-card" href="' + a.href + '">' +
    thumbHtml(a, false) +
    '<span class="jr-cat">' + a.cat + "</span>" +
    "<h4>" + esc(a.title) + "</h4>" +
    '<span class="jr-date">' + a.date + "</span></a>";
}

// ナビのアクティブ表示(現在のカテゴリ or ALL)
function markActiveTab(cat) {
  document.querySelectorAll(".jnav-links a").forEach(function (link) {
    const url = new URL(link.href, location.href);
    const linkCat = url.searchParams.get("cat");
    const isIndex = url.pathname.endsWith("/index.html") || url.pathname.endsWith("/journal/");
    if (isIndex && !url.search && !cat && link.textContent.trim() === "ALL") link.classList.add("active");
    else if (linkCat && linkCat === cat) link.classList.add("active");
  });
}

// フロントページ: ヒーロー+LATEST+フィード生成、?cat=XXX で絞り込み
function initIndex() {
  const feed = document.getElementById("feed-list");
  if (!feed) return false;
  const cat = new URLSearchParams(location.search).get("cat");
  markActiveTab(cat);

  const featured = ARTICLES.find(function (a) { return a.featured; }) || ARTICLES[0];

  // ヒーロー(FEATURED)
  const heroBox = document.getElementById("hero-featured");
  if (heroBox) {
    const src = featured.heroThumb || featured.thumb;
    const visual = src
      ? '<img src="' + src + '" alt="">'
      : '<div class="tile"><span class="bar"></span><span class="word">' + esc(featured.tile || featured.cat) + "</span></div>";
    heroBox.href = featured.href;
    heroBox.innerHTML =
      '<div class="photo">' + visual + "</div>" +
      '<div class="overlay">' +
      '<span class="jr-cat">' + featured.cat + "</span>" +
      "<h2>" + esc(featured.title) + "</h2>" +
      '<p class="excerpt">' + esc(featured.excerpt) + "</p>" +
      '<span class="jr-date">' + featured.date + " — FEATURED</span></div>";
  }

  // LATEST(サイドバー)
  const latest = document.getElementById("latest-list");
  if (latest) {
    latest.innerHTML = ARTICLES.slice(0, 6).map(function (a) {
      return '<li><a href="' + a.href + '"><span class="t">' + esc(a.title) + '</span><span class="d">' + a.cat + " — " + a.date + "</span></a></li>";
    }).join("");
  }

  // フィード
  const list = cat ? ARTICLES.filter(function (a) { return a.cat === cat; }) : ARTICLES;
  feed.innerHTML = list.map(feedRowHtml).join("");

  // 絞り込み時はヒーロー/LATESTを隠して件数表示
  if (cat) {
    const hero = document.getElementById("hero");
    if (hero) hero.classList.add("jhidden");
    const label = document.getElementById("journal-count");
    if (label) label.textContent = cat + " — " + list.length + " STORIES";
  }
  return true;
}

// 記事ページ: 関連記事3本(同カテゴリ優先→新しい順)
function initRelated() {
  const grid = document.getElementById("related-grid");
  if (!grid) return false;
  const current = location.pathname.split("/").pop();
  const me = ARTICLES.find(function (a) { return a.href === current; });
  const others = ARTICLES.filter(function (a) { return a.href !== current; });
  const sameCat = me ? others.filter(function (a) { return a.cat === me.cat; }) : [];
  const rest = others.filter(function (a) { return sameCat.indexOf(a) === -1; });
  const picks = sameCat.concat(rest).slice(0, 3);
  grid.innerHTML = picks.map(relCardHtml).join("");
  if (me) markActiveTab(me.cat);
  return true;
}

initIndex();
initRelated();
