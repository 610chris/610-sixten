// 610 JOURNAL 共通スクリプト
// 記事メタデータ(日付降順)。新記事を追加したらここに1件足す。
// thumb: 実写真のパス(あれば必ず優先) / tile: 写真がない記事用のタイポグラフィ表紙
const ARTICLES = [
  {
    href: "258-mavericks-resign-dwight-powell.html",
    cat: "NBA",
    title: "パウエル、マーベリックスと正式再契約 —— 球団はロースター枠確保の道も模索",
    excerpt: "ダラス・マーベリックスはドワイト・パウエルとの再契約を正式に発表した。Marc Stein氏(The Stein Line)が9月25日(現地時間)に一報。球団は開幕ロースターに彼の枠を確保する可能性も排除していないという。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "257-grizzlies-waive-dangelo-russell.html",
    cat: "NBA",
    title: "グリズリーズ、ラッセルをウェイバー —— ロースター整理の一環、開幕前の新天地探しが可能に",
    excerpt: "メンフィス・グリズリーズがディアンジェロ・ラッセルをウェイバー(解雇)した。Shams Charania記者(ESPN)が9月25日(現地時間)に一報。ロースターの人数調整が理由で、開幕前に他球団と契約する道が開かれた。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "256-brunson-cleared-wrist-surgery.html",
    cat: "NBA",
    title: "ファイナルMVP、フルに戦える —— ニックスのブランソン、オフに受けた左手首の手術から完全復帰を発表",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンは9月25日(現地時間)、自身のポッドキャスト公開収録で、オフに受けた左手首の手術から完全復帰したことを明らかにした。優勝を決めたファイナルの最中も痛みを抱えてプレーしていたという。ESPNが伝えた。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "255-shinagawa-cc-wildcats-3xs-homegame.html",
    cat: "JAPAN",
    title: "品川CC ワイルドキャッツ、10月18日に東品川海上公園でホームゲーム開催 —— リニューアルの水辺公園で3x3公式戦「PLCO 3XS」、観戦無料",
    excerpt: "3人制プロバスケットボールチーム「品川CC ワイルドキャッツ」は2026年10月18日、東京都品川区の東品川海上公園で3x3リーグ「PLCO 3XS 2026-27 SEASON DIVISION 2 ROUND.11」をホームゲームとして開催する。公園のPark-PFI事業による新施設開業後初のスポーツイベントで、観戦は無料。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "254-japan-women-taipei-asian-games-sf.html",
    cat: "JAPAN",
    title: "女子日本代表、アジア大会準決勝でチャイニーズ・タイペイに80-52で快勝 —— 決勝は韓国と対戦、28年ぶり金メダルを懸ける",
    excerpt: "9月25日、愛知国際アリーナで「第20回アジア競技大会（2026／愛知・名古屋）」女子バスケットボールの準決勝が行われ、女子日本代表がチャイニーズ・タイペイ代表に80-52で快勝した。26日の決勝は韓国代表と対戦し、1998年以来28年ぶりの金メダル獲得を目指す。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "253-lebron-76ers-decision-maxey-embiid.html",
    cat: "NBA",
    title: "「エンビードに、その初優勝を」—— レブロン・ジェームズ、76ers移籍の理由を語る マクシーとの友情も後押しに",
    excerpt: "レブロン・ジェームズ(41)は9月25日(現地時間)公開のポッドキャスト「Mind the Game」で、フィラデルフィア・76ers入りを決めた理由を語った。タイリース・マクシーとの長年の友情、そしてジョエル・エンビードに初優勝をもたらしたいという思いが後押しになったという。ESPNが伝えた。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "252-be5ive-camp-2026-report.html",
    cat: "REPORT",
    title: "Everything is a read —— FaFa Luと中高生68名、判断力を鍛えた2日間「Be 5IVE CAMP」開催レポート",
    excerpt: "STARTING 5IVE主催「Be 5IVE CAMP -Think the Game with FaFa-」を8月12・13日に開催。元NBAホーネッツのビデオコーディネーター FaFa Lu が、中高生68名に「いつ・なぜ選ぶか」を教えた2日間。",
    date: "2026.09.25",
    thumb: "../assets/journal-252-hero.jpg?v=2b5d6e6c88"
  },
  {
    href: "251-tryhoop-okayama-kimochiru-mvp.html",
    cat: "JAPAN",
    title: "トライフープ岡山、ファン投票MVP企画に「Kimochiru」導入 —— B.LEAGUE初、9月25日ホーム開幕戦から応援チップも",
    excerpt: "株式会社ぺこりは2026年9月25日、トライフープ岡山のファン投票型MVP企画「TRYBE'S CHOICE MVP」に応援チップサービス「Kimochiru」が導入されることを発表した。B.LEAGUE所属クラブでの導入は初。同日のシゲトーアリーナ岡山でのホーム開幕戦・越谷アルファーズ戦から、専用アプリ不要でカードのQRコードを読み取ってMVP投票と応援チップを送れる。",
    date: "2026.09.25",
    thumb: "../assets/journal-251-hero.jpg?v=7216833613",
    tile: "TRYHOOP OKAYAMA × KIMOCHIRU"
  },
  {
    href: "250-puma-mb06-shooting-star.html",
    cat: "KICKS",
    title: "PUMA MB.06「Shooting Star」が発売 —— ラメロ・ボール新シグネチャー、新色「Hills」やALL PRO NITRO™ 2シリーズ新色も",
    excerpt: "プーマ ジャパンは2026年9月25日、シャーロット・ホーネッツのラメロ・ボールを擁するシグネチャーモデル「PUMA MB.06」の新色「Shooting Star」（20,900円、品番313624）を発売した。10月16日には新色「MB.06 Hills」、10月2日には「ALL PRO NITRO™ 2 ELITE」（33,000円）も発売予定。「PUMA BASKETBALL INFORMATION」第四弾として紹介された。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "PUMA MB.06 SHOOTING STAR"
  },
  {
    href: "249-easl-2026-27-groups.html",
    cat: "JAPAN",
    title: "東アジアスーパーリーグ(EASL)2026-27シーズンのグループ分け決定 —— キングス・ヴェルカ・アルバルク東京が出場",
    excerpt: "B.LEAGUEは2026年9月25日、東アジアスーパーリーグ(EASL)2026-27シーズンのグループ分けを発表した。琉球ゴールデンキングス、長崎ヴェルカ、アルバルク東京のB.LEAGUE勢3クラブが、韓国・チャイニーズタイペイ・香港・マカオ・フィリピン・モンゴルの9クラブとともに計12クラブでA/B/Cの3グループに分かれる。キングスの初戦は10月28日、アウェーで桃園パウイアン・パイロッツと対戦する。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "EASL 2026-27 GROUPS"
  },
  {
    href: "248-bfive-cafe-series-sesame-street.html",
    cat: "CULTURE",
    title: "BFIVE、セサミストリートとコラボした新コレクション「CAFE SERIES」を発売 —— コートサイドのカフェ気分をまとうヴィンテージカジュアル",
    excerpt: "バスケットボールウェアブランド「BFIVE」を展開する株式会社フラスコ100ccは9月25日、米国セサミワークショップとのライセンス契約のもとセサミストリートとコラボレーションした新コレクション「CAFE SERIES」を発売した。コートサイドのカフェをイメージし、Tシャツやバスパン、スウェット、シューズケースなど幅広いアイテムを展開する。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "BFIVE × SESAME STREET"
  },
  {
    href: "247-pelinka-lebron-exit-lakers-reset.html",
    cat: "NBA",
    title: "「円満だった」—— レイカーズGMペリンカ、レブロン退団に開幕会見で初めて言及 リーブス残留・ケスラー獲得の舞台裏も",
    excerpt: "ロサンゼルス・レイカーズのロブ・ペリンカ球団社長兼GMは9月24日（現地時間）、開幕前恒例の記者会見でレブロン・ジェームズの退団に初めて言及し「円満だった」と述べた。オースティン・リーブスとの4年1億8470万ドル再契約、ユタ・ジャズとのサイン・アンド・トレードで獲得したウォーカー・ケスラーとの4年1億3000万ドル契約など、今オフの補強の狙いも語った。ESPNが伝えた。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "PELINKA ON LEBRON EXIT & LAKERS RESET"
  },
  {
    href: "246-bob-pettit-dies.html",
    cat: "NBA",
    title: "NBA草創期のスーパースター、ボブ・ペティ氏が死去 —— 2度のMVP、11年連続オールスターの93歳",
    excerpt: "ネイスミス・バスケットボール殿堂は現地時間9月24日、NBA最初期を代表するスター選手ボブ・ペティ氏が死去したと発表した。93歳だった。MVP賞創設初年の1955-56シーズンと1958-59シーズンに2度受賞し、11年連続でオールスターに選出。1958年にはホークスを優勝に導いた。ESPNが伝えた。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "BOB PETTIT NBA LEGEND DIES AT 93"
  },
  {
    href: "245-thunder-presti-preseason-presser.html",
    cat: "NBA",
    title: "主力3人放出で年俸3億ドル超を圧縮 —— サンダーGMプレスティ、プレシーズン会見で「更なる高み」への自信と「セカンドエプロン」観を語る",
    excerpt: "オクラホマシティ・サンダーのサム・プレスティGM兼エグゼクティブ・バイスプレジデントは9月24日（現地時間）のプレシーズン会見で、ルゲンツ・ドート、アイザイア・ジョー、アーロン・ウィギンズを放出し年俸3億ドル超を圧縮した今オフを振り返り、健康を保てれば「これまでのどのチームにも劣らない可能性がある」と述べた。ジェイレン・ウィリアムズの回復状況やNBAの「セカンドエプロン」への見解にも言及した。ESPNのバクスター・ホームズ記者が伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "THUNDER GM SAM PRESTI PRESEASON PRESSER"
  },
  {
    href: "244-air-jordan-1-mid-black-elephant-print.html",
    cat: "KICKS",
    title: "Air Jordan 1 Mid「Black Elephant Print」が発売開始 —— 品番IX3527-010、価格140ドル",
    excerpt: "Jordan Brandは、代表的な柄「エレファントプリント」をあしらった新色「Air Jordan 1 Mid \"Black Elephant Print\"」を、米国内でNike.com上にて発売した。価格は140ドル(米国価格)、品番はIX3527-010。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "AIR JORDAN 1 MID BLACK ELEPHANT PRINT"
  },
  {
    href: "243-broncos-urawa-reds-partnership.html",
    cat: "JAPAN",
    title: "さいたまブロンコス、浦和レッズと連携協定を締結 —— 競技の枠を超えて地域活性化へ、11月14日に「埼スタ」でコラボブース",
    excerpt: "さいたま市・所沢市をダブルホームタウンとするB.LEAGUE ONEのさいたまブロンコスを運営する埼玉ブロンコス株式会社は9月24日、浦和レッドダイヤモンズ株式会社（浦和レッズ）と競技の枠を超えたスポーツ推進・地域活性化を目的とする連携協定を締結したと発表した。第一弾として11月14日の埼玉県民の日「埼スタオープンデー25th anniversary」で特別コラボブースを出展する。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "SAITAMA BRONCOS × URAWA REDS"
  },
  {
    href: "242-nike-air-foamposite-one-oregon-ducks-black-mummy.html",
    cat: "KICKS",
    title: "Oregon Ducks x Nike Air Foamposite One「Black Mummy」が11月9日発売 —— 品番IZ7806-001",
    excerpt: "ナイキは、オレゴン大学ダックスとのコラボレーション「Oregon Ducks x Nike Air Foamposite One」のハロウィン新色「Black Mummy」を、2026年11月9日にSNKRSで発売する予定だ。品番はIZ7806-001。Nice Kicksが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "OREGON DUCKS FOAMPOSITE BLACK MUMMY"
  },
  {
    href: "241-aisaac-shinshu-brave-warriors.html",
    cat: "JAPAN",
    title: "アイザック、信州ブレイブウォリアーズとオフィシャルテックパートナー契約を締結 —— B.LEAGUE PREMIER参入へクラブ運営のDXを支援",
    excerpt: "東京・渋谷のアイザック株式会社は9月24日、信州ブレイブウォリアーズ（運営: 株式会社NAGANO SPIRIT）と2026-27シーズンのオフィシャルテックパートナー契約を締結したと発表した。信州は今シーズンからB.LEAGUEの最上位カテゴリー「B.LEAGUE PREMIER」に参入し、アイザックはクラブ運営のDX推進とファン体験向上のアプリ提供、トップチーム強化などを支援する。",
    date: "2026.09.24",
    thumb: "../assets/journal-241-hero.jpg?v=e9864c0b1a",
    tile: "AISAAC × SHINSHU BRAVE WARRIORS"
  },
  {
    href: "240-japan-women-thailand-asian-games-qf.html",
    cat: "JAPAN",
    title: "女子日本代表、アジア大会準々決勝でタイに86-29の大勝 —— 57点差で準決勝進出、28年ぶり金メダルへ",
    excerpt: "9月24日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」女子バスケットボールの準々決勝で、女子日本代表がタイ代表に86-29で大勝した。第1クォーターから守備でターンオーバーを誘発して主導権を握り、57点差で準決勝進出。25日の準決勝はチャイニーズ・タイペイ代表と対戦し、1998年以来28年ぶりの金メダル獲得を目指す。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "JAPAN vs THAILAND — ASIAN GAMES QF"
  },
  {
    href: "239-nba-rank-2026-top10.html",
    cat: "NBA",
    title: "ヨキッチが3年連続の総合1位 —— ESPN「NBA Rank 2026」トップ10発表、僅差3ポイントでウェンバンヤマ・ギルジャス・アレクサンダーと激戦",
    excerpt: "ESPNは24日（現地時間）、選手個人の実力を格付けする恒例企画「NBA Rank」2026-27版でトップ10を発表。デンバー・ナゲッツのニコラ・ヨキッチが3年連続の総合1位となり、2位ビクター・ウェンバンヤマ、3位シェイ・ギルジャス・アレクサンダーとの差はわずか3ポイントだった。ニューヨーク・ニックスのジェイレン・ブランソンはファイナルMVPを経て10位から6位に急上昇した。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "NBA RANK 2026 TOP 10"
  },
  {
    href: "238-361-oba-takeru-ambassador.html",
    cat: "JAPAN",
    title: "361°、越谷アルファーズ・大庭岳輝選手とアンバサダー契約 —— シュート力が武器のSG、シューズ着用でパフォーマンス発信へ",
    excerpt: "グローバルスポーツブランド「361°」の国内総代理店・361 Sports Japanは、B.LEAGUE越谷アルファーズ所属の大庭岳輝選手とアンバサダー契約を締結したと9月24日発表した。学生時代から高精度なシュートを武器にしてきたシューティングガードが、361°のバスケットボールシューズを着用してパフォーマンスを発信する。",
    date: "2026.09.24",
    thumb: "../assets/journal-238-hero.jpg?v=1d9424ea4a",
    tile: "361° OBA TAKERU"
  },
  {
    href: "237-lawrence-tanter-lakers-pa-dies.html",
    cat: "NBA",
    title: "レイカーズの名物PAアナウンサー、ローレンス・タンター氏が死去 —— 43年間コートサイドの「声」を担う、76歳",
    excerpt: "ロサンゼルス・レイカーズは、球団史上最長となる43年間PA(実況)アナウンサーを務めたローレンス・タンター氏が死去したと現地時間9月23日に発表した。76歳だった。今年6月に脳卒中からの療養を経て現役を退いていた。ESPNが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "LAWRENCE TANTER"
  },
  {
    href: "236-nike-air-force-1-subway-rat.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low「Subway Rat」が2026年10月発売 —— ニューヨークの地下鉄ネズミがテーマ、ピザ柄ディテールも",
    excerpt: "ナイキは、ニューヨークの地下鉄名物「サブウェイ・ラット」をテーマにした「Air Force 1 Low '01 \"Subway Rat\"」を2026年10月に発売する。毛羽立ったスエードアッパーに、ピザや地下鉄をモチーフにしたディテールを効かせた「College Grey/Pink Glaze」配色。品番はIV6999-001。Nice KicksとSneaker Bar Detroitが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "AIR FORCE 1 SUBWAY RAT"
  },
  {
    href: "235-mavericks-lively-not-cleared-camp.html",
    cat: "NBA",
    title: "マーベリックス、ライブリー2世がキャンプ入り未承認 —— 右足手術から回復途上、開幕出場も不透明",
    excerpt: "ダラス・マーベリックスのセンター、デレック・ライブリー2世が右足手術からの回復途上でトレーニングキャンプ入りを承認されておらず、開幕時点の出場可否も未定と23日(現地時間)ESPNが報道。過去14カ月で同じ右足を2度手術しており、直近の手術で7試合出場にとどまった2025-26シーズンは終了した。22歳、2023年ドラフト12位。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "MAVERICKS LIVELY CAMP"
  },
  {
    href: "234-nike-sabrina-4-halloween-vampire.html",
    cat: "KICKS",
    title: "Nike Sabrina 4「Halloween」が2026年10月発売 —— サブリナ・イオネスクの4代目にヴァンパイア新色",
    excerpt: "ナイキは、サブリナ・イオネスク（WNBAニューヨーク・リバティ）の4代目シグネチャー「Nike Sabrina 4」に、ハロウィン向けの新色「Halloween」を2026年10月に発売する。黒に深い赤を組み合わせたヴァンパイアをテーマにした配色で、品番はIX7058-001。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "SABRINA 4 HALLOWEEN"
  },
  {
    href: "233-kids-air-jordan-6-low-fearless.html",
    cat: "KICKS",
    title: "Kids Air Jordan 6 Low「Fearless」が10月2日発売 —— 価格155ドル",
    excerpt: "ジョーダンブランドは、キッズ向け「Air Jordan 6 Low」の新色「Fearless」を2026年10月2日にNike.comほかで発売する。価格は155ドル（米国価格）。品番は768878-001。Nice Kicksが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "AIR JORDAN 6 LOW FEARLESS"
  },
  {
    href: "232-knicks-towns-extension-stalled.html",
    cat: "NBA",
    title: "ニックス、タウンズとの契約延長交渉が停滞 —— キャンプ開始目前も合意は当面見込み薄、最大4年2億7300万ドルの資格",
    excerpt: "ニューヨーク・ニックスとカール=アンソニー・タウンズの契約延長交渉が停滞し、来週のキャンプ開始前の合意は当面見込みにくいとESPNが23日(現地時間)報道。タウンズは11月に31歳、最大4年2億7300万ドルの延長資格を持つ。オーナーはセカンドエプロン回避の方針を掲げており、バックアップセンターのミッチェル・ロビンソンは今オフ既に退団している。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "KNICKS TOWNS EXTENSION"
  },
  {
    href: "231-adidas-ae-adifoam-mule-bliss-blue.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards Adifoam Mule「Bliss Blue」が10月1日発売 —— シグネチャー展開に新たなスライド型",
    excerpt: "adidasは、アンソニー・エドワーズ（ミネソタ・ティンバーウルブズ）とのコラボモデル「Anthony Edwards Adifoam Mule」の新色「Bliss Blue」を2026年10月1日にadidas.comほかで発売する。Superstar IIやAE3にも展開している同色名の一足で、パフォーマンスシューズ以外へのシグネチャー展開がさらに広がる。Nice Kicksが伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "ADIDAS AE ADIFOAM MULE"
  },
  {
    href: "230-curry-contract-no-drama.html",
    cat: "NBA",
    title: "カリー、契約延長交渉に「ドラマは作りたくない」—— 最大2年1億3670万ドル、ウォリアーズと選択肢を協議中",
    excerpt: "ウォリアーズのステフィン・カリーは23日、契約延長交渉が未決着でもプレーやチームの雰囲気には影響しないと語った。8月29日に最大2年1億3670万ドルの延長資格を得ており、マックス契約か減額か様子見か、複数の選択肢を検討中。ESPNのアンソニー・スレイター記者が伝えた。",
    date: "2026.09.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "CURRY CONTRACT"
  },
  {
    href: "229-af1-low-ghostface-black.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low「Ghostface Black」発売 —— スクリーム風のオールブラック新色、品番IZ1207-010",
    excerpt: "Nikeは、映画「スクリーム」を思わせるデザインの「Air Force 1 Low Ghostface」シリーズに、オールブラック仕立ての新色「Ghostface Black」を追加した。品番はIZ1207-010、価格125ドルで発売中、ホリデーシーズンにかけて展開を拡大する。Hypebeastが伝えた。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "AF1 GHOSTFACE BLACK"
  },
  {
    href: "228-nike-twelve-time-halloween.html",
    cat: "KICKS",
    title: "Nike Twelve Time「Halloween」が2026年秋冬発売 —— ジャ・モラントのシグネチャーに不気味な新色、品番IM4164-002",
    excerpt: "ジャ・モラントのシグネチャーシューズ「Nike Twelve Time」に、ハロウィンをテーマにした新色「Halloween」が登場する。アイアングレーを基調にオレンジのアクセントを差した配色で、品番はIM4164-002、価格95ドル、2026年秋冬シーズンの発売が予定されている。Hypebeastが伝えた。",
    date: "2026.09.23",
    thumb: "../assets/journal-228-hero.jpg?v=c7477e262c",
    tile: "NIKE TWELVE TIME HALLOWEEN"
  },
  {
    href: "227-nba-rank-2026-50-11.html",
    cat: "NBA",
    title: "レブロン、NBA Rank史上初のトップ10圏外に —— ESPN「2026年版」50~11位発表、18位で76ers移籍後の役割は",
    excerpt: "ESPNは23日（現地時間）、選手個人のランキング企画「NBA Rank」2026-27版で50~11位を発表。76ers移籍のレブロン・ジェームズは8位から18位へ後退し、15年続く同企画で自身初めてトップ10圏外となった。カリー、デュラントも順位を落とす一方、カワイ・レナードは上昇。トップ10は24日発表予定。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "NBA RANK 2026"
  },
  {
    href: "226-clippers-redden-interim-president.html",
    cat: "NBA",
    title: "クリッパーズ、トレント・レデンGMを暫定バスケットボール運営責任者に —— フランク氏の停職期間、ヒューズ氏がGM代行",
    excerpt: "ロサンゼルス・クリッパーズは、ゼネラルマネージャーのトレント・レデン氏を暫定バスケットボール運営責任者に任命した。ローレンス・フランク氏がサラリーキャップ規定違反を巡るNBAの調査で6カ月の無給停職に入っている間の措置で、ESPNが伝えた。暫定オーナー兼CEOのジョン・ギブソン氏が動画で発表し、アシスタントGMのマーク・ヒューズ氏がGM業務を代行する。",
    date: "2026.09.23",
    thumb: "../assets/journal-226-hero.jpg?v=ac2b05c4f7",
    tile: "CLIPPERS INTERIM PRESIDENT"
  },
  {
    href: "225-rockets-vanvleet-return-preview.html",
    cat: "NBA",
    title: "ロケッツ、ヴァンヴリート完全復帰で新シーズン始動 —— ウドカHC「本物の旋風を起こす」",
    excerpt: "ヒューストン・ロケッツは22日（現地時間）、全30チームに先駆けてメディアデーを開催した。2年連続52勝からの1回戦敗退を経て、アイム・ウドカHCは「本物の旋風を起こしたい」と表明。ACL断裂から復帰するフレッド・ヴァンヴリートや故障明けのスティーブン・アダムスに加え、守備の要マーカス・スマートも新加入した。ケビン・デュラントは出場時間短縮の方針に「まだやれる」と反論している。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "ROCKETS VANVLEET RETURN"
  },
  {
    href: "224-hawks-buddy-hield-hornets-trade.html",
    cat: "NBA",
    title: "ホークスがバディ・ヒールドをホーネッツへトレード、フィニー＝スミスと交換で合意 —— ライアン・ネムハードと現金も動く",
    excerpt: "アトランタ・ホークスは22日(現地時間)、バディ・ヒールドとライアン・ネムハード、現金をシャーロット・ホーネッツへ送り、ドリアン・フィニー＝スミスを獲得するトレードを成立させた。ESPNのシャムズ・シャラニア記者が関係者の話として伝えた。ホークスは今夏、ヒールドを絡めたトレードを模索しており、今月に入りホーネッツとの協議も表面化していた。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "HAWKS TRADE BUDDY HIELD"
  },
  {
    href: "223-kawhi-leonard-raptors-extension-signed.html",
    cat: "NBA",
    title: "カワイ・レナード、ラプターズと2年1億1500万ドルの契約延長に合意 —— 総額3年1億6500万ドル、2028-29シーズンはプレーヤーオプション",
    excerpt: "トロント・ラプターズのカワイ・レナードは22日(現地時間)、2年1億1500万ドルの契約延長にラプターズと合意したとESPNが報道。2028-29シーズンのプレーヤーオプション付きで、既存分と合わせ総額は3年1億6500万ドルに達する。今年6月に合意していたクリッパーズからのトレードは、NBAのサラリーキャップ規定違反調査で一時保留となっていたが、今月の処分決定を経て正式に完了。処分の混乱を乗り越えての早期延長となった。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "KAWHI LEONARD EXTENSION"
  },
  {
    href: "222-nike-lebron-witness-10.html",
    cat: "KICKS",
    title: "ナイキ「LeBron Witness 10」がこのホリデーシーズンに発売 —— レブロン・ジェームズのシグネチャーライン第10弾",
    excerpt: "ナイキは、レブロン・ジェームズのシグネチャーモデル「LeBron Witness」シリーズ最新作「Witness 10」を発表した。発売はこのホリデーシーズン(2026年11〜12月ごろ)を予定している。具体的なカラーウェイや価格、正式な発売日は現時点では明らかにされていない。Sneaker Newsが伝えた。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "LEBRON WITNESS 10"
  },
  {
    href: "221-nike-air-force-1-low-jewel-indiana-fever.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low「Jewel」発表 —— インディアナ・フィーバーのチームカラーを纏った特別仕様、品番IR5099-400",
    excerpt: "ナイキは、WNBAインディアナ・フィーバーのチームカラーを纏った「Air Force 1 Low」新色「Jewel」を発表した。アッパーの大部分をネイビーのレザーが占め、チームカラーのイエローを随所に差し色として配した仕様。品番IR5099-400。Sneaker Newsとスニーカーバー・デトロイトが伝えた。",
    date: "2026.09.23",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "AF1 JEWEL INDIANA FEVER"
  },
  {
    href: "220-espn-nba-rank-2026.html",
    cat: "NBA",
    title: "ルーキー4人が早くもトップ100入り —— ESPN「NBA Rank 2026」が始動、100～51位を発表",
    excerpt: "ESPNは22日（現地時間）、選手個人の実力ランキング企画「NBA Rank」2026-27版で100～51位を公開した。全体1位指名のAJ・ダイバンツァ（ウィザーズ）ら新人4人が早速ランクインした一方、ドレイモンド・グリーン（ウォリアーズ）は93位、ACLの負傷で離脱中のジミー・バトラー（ウォリアーズ）は92位まで後退した。続く50～11位は23日、トップ10は24日に発表予定。",
    date: "2026.09.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "ESPN NBA RANK 2026"
  },
  {
    href: "219-japan-women-philippines-asian-games.html",
    cat: "JAPAN",
    title: "女子日本代表、アジア大会でフィリピンに89-67で快勝 —— 岡本美優が19得点、3戦全勝でグループB首位通過",
    excerpt: "9月22日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」女子バスケットボールのグループフェーズで、女子日本代表がフィリピン代表に89-67で快勝した。岡本美優が7本中5本の3ポイントを沈めて19得点、常田亜美が18得点、舘山萌菜が12得点を記録。日本はグループフェーズを3戦全勝で終え、グループB首位で24日の準々決勝に進出する。",
    date: "2026.09.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "JAPAN WOMEN VS PHILIPPINES"
  },
  {
    href: "218-nike-air-force-1-low-gold-charms.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low「Gold Charms」発表 —— スネークスキンのスウッシュに取り外し可能なゴールドチャーム、価格125ドル",
    excerpt: "ナイキは、定番モデル「Air Force 1 Low」の新色「Gold Charms」を発表した。スウッシュにスネークスキン調の型押し加工を施し、取り外し可能なゴールドのチャームを添えた仕様。品番IZ8908-100、価格125ドル(米国価格)。発売日は現時点で未定。Hypebeastが伝えた。",
    date: "2026.09.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "AF1 GOLD CHARMS"
  },
  {
    href: "217-air-jordan-16-black-pack.html",
    cat: "KICKS",
    title: "Air Jordan 16「Black Pack」が2026年10月発売 —— 14 Low・15・17 Lowと並ぶオールブラックの4型パック",
    excerpt: "ジョーダンブランドは、Air Jordan 14 Low・15・16・17 Lowの4モデルを揃ってオールブラックに仕立てた「Black Pack」を発表した。Air Jordan 16の品番はIZ2586-001で、2026年10月の発売が予定されている。Sneaker Newsが伝えた。",
    date: "2026.09.22",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "BLACK PACK"
  },
  {
    href: "216-doc-rivers-retires-nbc.html",
    cat: "NBA",
    title: "ドック・リバーズ、指導者キャリアに完全終止符 —— 「絶対的に引退した」、通算1194勝は歴代6位、今季からNBC解説者へ",
    excerpt: "殿堂入りしたドック・リバーズが現地時間9月21日、指導者としてのキャリアは完全に終わったと表明し、今季からNBC/Peacock/NBCSNのバスケットボール解説者に就任すると発表した。セルティックスで2008年に優勝、通算1194勝はNBA歴代6位。1996年にNBCの誘いを一度断った30年越しの合流でもある。",
    date: "2026.09.22",
    thumb: "../assets/journal-216-hero.jpg?v=71069a8317",
    tile: "DOC RIVERS RETIRES"
  },
  {
    href: "215-hawks-veesaar-acl-tear.html",
    cat: "NBA",
    title: "ホークス、ヴィーサーが右膝ACL断裂で今季絶望 —— 52位指名のルーキーセンター、10月に手術",
    excerpt: "アトランタ・ホークスは、ルーキーセンターのヘンリ・ヴィーサーが右膝の前十字靭帯(ACL)を断裂し、2026-27シーズンを欠場する見通しだと発表した。9月15日のワークアウト中に負傷し、10月に手術を受ける予定。ドラフトでクリッパーズから全体52位指名を受けた後、ホークスへ移籍していた。ESPNが伝えた。",
    date: "2026.09.21",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "VEESAAR ACL TEAR"
  },
  {
    href: "214-nike-ja-4-phantom.html",
    cat: "KICKS",
    title: "Nike Ja 4「Phantom」が10月発売 —— ジャ・モラント4代目シグネチャー、白ベースの新色",
    excerpt: "ナイキは、ジャ・モラントの4代目シグネチャーモデル「Nike Ja 4」の新色「Phantom」を発表した。品番IM4135-100で、2026年10月の発売が予定されている。白をベースに黒とグレーを差した落ち着いた配色。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.21",
    thumb: "../assets/journal-214-hero.jpg?v=c7477e262c",
    tile: "NIKE JA 4 PHANTOM"
  },
  {
    href: "213-air-jordan-9-low-what-the-kilroy.html",
    cat: "KICKS",
    title: "Air Jordan 9 Low「What The Kilroy」が発売開始 —— 2012年『Kilroy Pack』全6色を1足に集約、価格180ドル",
    excerpt: "Jordan Brandは、2012年の限定企画『Kilroy Pack』全6色のディテールを1足にまとめたミスマッチデザイン「Air Jordan 9 Low \"What The Kilroy\"」を発売した。価格は180ドル(米国価格)。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.21",
    thumb: "../assets/journal-213-hero.jpg?v=80bd69b26c",
    tile: "AJ9 WHAT THE KILROY"
  },
  {
    href: "212-nicolas-batum-retires.html",
    cat: "NBA",
    title: "ニコラ・バトゥム、18年のNBA生活に幕 —— 10歳の息子との動画で引退発表、フランス代表で五輪銀2度",
    excerpt: "37歳のニコラ・バトゥムが現地時間9月21日、10歳の息子アイデン君とのSNS動画で現役引退を発表した。2008年のドラフト1巡目からブレイザーズ、ホーネッツ、クリッパーズなどでプレーし、フランス代表として東京・パリ五輪で銀メダル2度を獲得した18年間に幕を下ろした。",
    date: "2026.09.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "NICOLAS BATUM RETIRES"
  },
  {
    href: "211-clippers-interim-governor-ceo.html",
    cat: "NBA",
    title: "クリッパーズ、ジョン・ギブソン氏を暫定オーナー兼CEOに任命 —— バルマー氏が指名、NBAが承認",
    excerpt: "ESPNのシャムズ・シャラニア記者が一報。ロサンゼルス・クリッパーズは、同地を拠点とする弁護士ジョン・ギブソン氏を球団の暫定オーナー(Governor)兼最高経営責任者(CEO)に任命した。オーナーのスティーブ・バルマー氏が指名し、NBAが承認したという。",
    date: "2026.09.21",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "CLIPPERS INTERIM GOVERNOR"
  },
  {
    href: "210-espn-key-number-every-team.html",
    cat: "NBA",
    title: "ニックスは歴代最高の得失点差、サンダーはスパーズに4勝8敗 —— ESPN、NBA全30チーム「今季を左右する数字」",
    excerpt: "ESPNのザック・クラム記者は21日（現地時間）、NBA全30チームについて「今季を左右する1つの数字」を選ぶ恒例企画を公開した。連覇を狙うニックスはプレーオフ史上最高の得失点差を記録し、王座奪還を狙うサンダーは昨季スパーズに4勝8敗と負け越していた。",
    date: "2026.09.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "30 TEAMS, 30 NUMBERS"
  },
  {
    href: "209-nike-air-force-1-low-nyc-rat.html",
    cat: "KICKS",
    title: "ダークグレーレザーに茶色のフェイクファー —— Nike Air Force 1 Low「NYC Rat」が10月23日発売",
    excerpt: "ナイキは、ニューヨークの街ネズミをモチーフにした新色「Air Force 1 Low \"NYC Rat\"」を発表した。品番IV4884-200、価格140ドル(米国価格)で、2026年10月23日の発売が予定されている。MTAメトロカードをテーマにしたペアと2足セットの「ニューヨーク・シティ・パック」として展開される。Hypebeastが伝えた。",
    date: "2026.09.21",
    thumb: "../assets/journal-209-hero.jpg?v=f3e5aa532f",
    tile: "AF1 NYC RAT"
  },
  {
    href: "208-nike-kobe-8-protro-shanghai-fireworks.html",
    cat: "KICKS",
    title: "Nike Kobe 8 Protro「Shanghai Fireworks」が2026年11月11日発売予定 —— 2013年の中国限定カラーが復活、価格200ドル",
    excerpt: "ナイキは、コービー8 プロトロに2013年の中国限定カラー「Shanghai Fireworks」を復刻した新色を発表した。発売は2026年11月11日を予定し、価格は200ドル(米国価格)、品番はIO6259-800。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.20",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "KOBE 8 PROTRO"
  },
  {
    href: "207-japan-korea-asian-games-final.html",
    cat: "JAPAN",
    title: "男子日本代表、アジア大会決勝で韓国に57-67で敗れる —— 64年ぶりの銀メダル獲得、金近が13得点",
    excerpt: "9月20日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」男子バスケットボール決勝で、男子日本代表が韓国代表に57-67で敗れた。1962年ジャカルタ大会以来64年ぶりの決勝進出を果たした日本は、初の金メダルには届かなかったものの64年ぶりの銀メダルを獲得した。金近廉が3本の3ポイントを含む13得点6リバウンド、小川敦也が12得点5リバウンドを記録した。",
    date: "2026.09.20",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "JAPAN vs KOREA — ASIAN GAMES FINAL"
  },
  {
    href: "206-japan-women-kazakhstan-asian-games.html",
    cat: "JAPAN",
    title: "女子日本代表、アジア大会でカザフスタンに88-23で快勝 —— 大脇が16得点でゲームハイ、2連勝でグループB突破",
    excerpt: "9月20日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」女子バスケットボールのグループフェーズで、女子日本代表がカザフスタン代表に88-23で快勝した。大脇が16得点でゲームハイ、三田が2本の3ポイントを含む14得点。この勝利でグループBを2連勝で終え、準々決勝進出を決めた。次戦のグループフェーズ3戦目はフィリピン代表と対戦する。",
    date: "2026.09.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "JAPAN vs KAZAKHSTAN — ASIAN GAMES"
  },
  {
    href: "205-air-jordan-3-wmns-fireside.html",
    cat: "KICKS",
    title: "Air Jordan 3 WMNS「Fireside」が2026年10月発売 —— ブラウン基調にピンクのレースを差した女性向けカラー、品番CK9246-200",
    excerpt: "ジョーダン ブランドは、「Air Jordan 3」の女性向け(WMNS)新色「Fireside」(品番CK9246-200)を2026年10月に発売する。ディープブラウンのアッパーにクリーム色のディテール、差し色にピンクのレースを合わせた配色。Nice KicksとSneaker Bar Detroitが伝えた。",
    date: "2026.09.19",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "AIR JORDAN 3 WMNS"
  },
  {
    href: "204-psg-nike-kd6-metallic-silver.html",
    cat: "KICKS",
    title: "PSG×Nike KD6「Metallic Silver」が発売 —— デュラントとパリ・サンジェルマンのコラボ最新作、価格135ドル",
    excerpt: "ナイキは、ケビン・デュラント選手のシグネチャーモデル「KD6」とパリ・サンジェルマン(PSG)のコラボレーション最新作「Metallic Silver」をNike.comで発売した。価格は135ドル。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.19",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "PSG x NIKE KD6"
  },
  {
    href: "203-ausar-thompson-pistons-extension.html",
    cat: "NBA",
    title: "ピストンズ、アウサー・トンプソンと5年1億5500万ドルの契約延長に合意 —— 双子アメンに続きNBA史上初の「兄弟そろって1億ドル超え」",
    excerpt: "デトロイト・ピストンズは、オールディフェンシブ選出のフォワード、アウサー・トンプソン選手と5年総額1億5500万ドルの完全保証契約延長で合意した。ESPNが伝えた。昨季はスティール王に輝き、双子の弟アメン・トンプソン選手(ロケッツ)もロケッツと契約延長で合意しており、兄弟そろって1億ドル超えの契約を手にしたのはNBA史上初めて。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "PISTONS x AUSAR THOMPSON"
  },
  {
    href: "202-pelle-larson-heat-extension.html",
    cat: "NBA",
    title: "マイアミ・ヒート、ペレ・ラーソンと4年6000万ドルの契約延長に合意 —— 2030-31シーズンに相互オプション付き",
    excerpt: "ESPNのシャムズ・シャラニア記者が一報。マイアミ・ヒートは、ガードのペレ・ラーソン選手と4年、総額6000万ドルの契約延長に合意した。2030-31シーズンには相互オプションが付く。代理人のオースティン・ブラウン氏とスティーブン・ヒューマン氏（CAAスポーツ）がESPNに伝えた。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "HEAT x PELLE LARSON"
  },
  {
    href: "201-cam-whitmore-nuggets-two-way.html",
    cat: "NBA",
    title: "ナゲッツ、カム・ウィットモアとツーウェイ契約に合意 —— 2023年ドラフト1巡目指名、NBA4年目でロースター争いへ",
    excerpt: "ESPNのシャムズ・シャラニア記者が一報。デンバー・ナゲッツは、2023年ドラフト1巡目指名のフォワード、カム・ウィットモア選手とツーウェイ契約で合意した。ウィットモア選手は通算119試合で平均10.5得点・3.3リバウンドを記録しており、既にデンバー入りしてチーム練習に合流しているという。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "NUGGETS x CAM WHITMORE"
  },
  {
    href: "200-japan-china-asian-games-sf.html",
    cat: "JAPAN",
    title: "男子日本代表、64年ぶりのアジア大会決勝進出 —— 中国に97-78で完勝、金近が4本の3ポイントで19得点、決勝は韓国と再戦へ",
    excerpt: "9月18日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」男子バスケットボール準決勝で、男子日本代表が中国代表に97-78で勝利し、1962年ジャカルタ大会以来64年ぶりの決勝進出を果たした。金近が4本の3ポイントを含む19得点、カークが15得点12リバウンドとダブルダブル。決勝では初の金メダルをかけて韓国代表と再戦する。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "JAPAN vs CHINA — ASIAN GAMES SF"
  },
  {
    href: "197-nike-foamposite-one-green-camo.html",
    cat: "KICKS",
    title: "Nike Air Foamposite One「Green Camo」が9月18日発売 —— 迷彩柄でカムバック、品番IM5204-001",
    excerpt: "ナイキは、一体成型アッパーが特徴の伝説的バスケットボールシューズ「Nike Air Foamposite One」の新色「Green Camo」を9月18日、SNKRSおよび一部取扱店で発売した。品番はIM5204-001。Nice Kicksが伝えた。",
    date: "2026.09.19",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "FOAMPOSITE GREEN CAMO"
  },
  {
    href: "199-jazz-keyonte-george-extension.html",
    cat: "NBA",
    title: "ジャズ、キーオンテ・ジョージと5年1億5750万ドルの契約延長に合意 —— 昨季キャリアハイの23.6得点、次代の司令塔へ",
    excerpt: "ESPNのシャムズ・シャラニア記者とティム・マクマホン記者が一報。ユタ・ジャズはガードのキーオンテ・ジョージと5年、総額1億5750万ドルの契約延長に合意した。22歳のジョージは2023年ドラフト全体16位指名で、昨季は平均23.6得点・6.1アシストとキャリアハイを記録している。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "JAZZ x KEYONTE GEORGE"
  },
  {
    href: "198-golden-kings-alvark-10years.html",
    cat: "JAPAN",
    title: "琉球ゴールデンキングスとアルバルク東京、10年間の全対戦を振り返る —— 天皇杯・EASLも制し、9月22日は再び開幕戦で激突",
    excerpt: "沖縄バスケットボール株式会社が9月18日発表。2016年9月22日のB.LEAGUE歴史的開幕戦から10年となる2026年9月22日、琉球ゴールデンキングスは新設「B.LEAGUE PREMIER」の開幕戦で再びアルバルク東京と対戦する。この10年でチャンピオンシップ・天皇杯・EASLと重ねてきた両者の対戦成績を振り返る。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "GOLDEN KINGS x ALVARK"
  },
  {
    href: "196-cavaliers-brandon-weems-gm.html",
    cat: "NBA",
    title: "クリーブランド・キャバリアーズ、ブランドン・ウィームズを新GMに昇格 —— 前任ガンジーは76ers入り、ルブロンの幼なじみが編成トップへ",
    excerpt: "ESPNのシャムズ・シャラニア記者が一報。クリーブランド・キャバリアーズは、球団社長コビー・アルトマンの下でブランドン・ウィームズをゼネラルマネージャーに昇格させる。前任のマイク・ガンジーは5月にフィラデルフィア・76ersのバスケットボール部門President就任のため退団。ウィームズはルブロン・ジェームズの幼なじみでもある。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "CAVALIERS NEW GM"
  },
  {
    href: "195-yachiyo-flags-parachallenge-3x3.html",
    cat: "JAPAN",
    title: "「もっとやりたい！」障害のある参加者とプロ選手が3×3で交流 —— NPO法人おりがみ×石井食品、八千代フラッグスと「ぷちパラ旅」開催",
    excerpt: "NPO法人おりがみは8月29日、石井食品との連携企画「石井食品×ぷちパラ旅〜八千代フラッグス交流編〜」を八千代市生涯学習プラザで開催したと発表した。障害のある方や学生、企業関係者ら計66名が、3x3プロチーム「八千代フラッグス」の選手と3x3バスケットボールで交流した。",
    date: "2026.09.18",
    thumb: "../assets/journal-195-hero.jpg?v=777aaf84a2",
    tile: "YACHIYO FLAGS × PARATABI"
  },
  {
    href: "194-knicks-2026-27-season-preview.html",
    cat: "NBA",
    title: "ニックス連覇なるか —— ESPNが2026-27シーズンプレビュー、タウンズの契約と故障リスクが焦点",
    excerpt: "ESPNは17日、53年ぶりの優勝を果たしたニューヨーク・ニックスの2026-27シーズンプレビューを公開。優勝メンバーの主力5人を残留させた一方、ミッチェル・ロビンソンはFAでセルティックスへ移籍。カール=アンソニー・タウンズの契約と故障リスクが連覇の鍵になると分析している。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "KNICKS 2026-27 PREVIEW"
  },
  {
    href: "193-eigo-de-basuke-ota.html",
    cat: "JAPAN",
    title: "佐々木クリス氏「えいごdeバスケ」第2回、オープンハウスアリーナ太田で9月25日開催 —— B.LEAGUE開幕戦翌日、群馬の小学生24名を無料招待",
    excerpt: "株式会社オープンハウスグループは、B.LEAGUE公認アナリスト佐々木クリス氏がプロデュースするバスケ×英会話のキッズスクール「えいごdeバスケ」の第2回イベントを、2026年9月25日（金）にオープンハウスアリーナ太田（群馬県太田市）で開催すると発表した。対象は小学生24名、参加費無料。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "EIGO DE BASUKE"
  },
  {
    href: "192-jrwest-hokuriku-derby-campaign.html",
    cat: "JAPAN",
    title: "JR西日本、B.LEAGUE「北陸ダービー」を交通系サービスWESTERで応援 —— 福井ブローウィンズ×金沢サムライズ、10月3-4日開催",
    excerpt: "西日本旅客鉄道株式会社（JR西日本）と金沢ターミナル開発株式会社は9月18日、10月3日・4日にセーレン・ドリームアリーナ（福井県営体育館）で行われるB.LEAGUE「北陸ダービー」（福井ブローウィンズ vs 金沢サムライズ）に合わせ、交通系サービス「WESTER」を通じた両チーム応援キャンペーンを実施すると発表した。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "JR WEST x HOKURIKU DERBY"
  },
  {
    href: "191-lebron-24-chosen-1s.html",
    cat: "KICKS",
    title: "レブロン最新シグネチャー「LEBRON 24」新色「Chosen 1s」が登場 —— 本人がワークアウトで着用、品番IO8201-700",
    excerpt: "レブロン・ジェームズが最新シグネチャー「Nike LeBron 24」の新色「Chosen 1s」を、トレーナーとのワークアウト中に着用してお披露目。Tour Yellow基調にMetallic GoldとMidnight Navyを配色し、品番はIO8201-700。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.09.18",
    thumb: "../assets/journal-191-hero.jpg?v=f13beaf18e",
    tile: "LEBRON 24 CHOSEN 1S"
  },
  {
    href: "190-suncall-hannaryz-partnership.html",
    cat: "JAPAN",
    title: "サンコール、京都ハンナリーズと2026-27シーズンのオフィシャルパートナー契約を継続 —— B.LEAGUE PREMIER参入シーズンもゴールドパートナーとして支援",
    excerpt: "京都市右京区に本社を置くサンコール株式会社は9月18日、B.LEAGUE「京都ハンナリーズ」と2026-27シーズンのオフィシャルパートナー契約（ゴールドパートナー）を継続すると発表した。2023年からのパートナーシップ継続で、京都ハンナリーズは今シーズンから新設の最上位カテゴリー「B.LEAGUE PREMIER」に参入する。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "SUNCALL x KYOTO HANNARYZ"
  },
  {
    href: "189-tokyomx-alvark-broadcast.html",
    cat: "JAPAN",
    title: "TOKYO MX、アルバルク東京とオフィシャルパートナーシップ契約を更新 —— 2026-27シーズンも試合を3試合放送",
    excerpt: "東京メトロポリタンテレビジョン株式会社（TOKYO MX）は9月18日、B.LEAGUE PREMIER所属のアルバルク東京とオフィシャルパートナーシップ契約（ゴールドパートナー）を締結したと発表した。2024-25シーズンから3シーズン連続の契約で、2026-27レギュラーシーズンのアルバルク東京戦を3試合、録画放送する。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "TOKYO MX x ALVARK TOKYO"
  },
  {
    href: "188-onecareer-alvark-partnership.html",
    cat: "JAPAN",
    title: "ワンキャリア、アルバルク東京と2026-27シーズンのプラチナパートナー契約を締結 —— 体育会学生の就活支援イベントが縁に",
    excerpt: "株式会社ワンキャリアは9月18日、B.LEAGUE PREMIER所属のアルバルク東京と2026-27シーズンのプラチナパートナー契約を締結したと発表した。同チームとのパートナー契約は今回が初。「炎の就活体育祭」をアルバルク東京の本拠地TOYOTA ARENA TOKYOで開催した縁が、契約のきっかけになったという。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "ONE CAREER x ALVARK TOKYO"
  },
  {
    href: "187-saddiq-bey-pelicans-extension.html",
    cat: "NBA",
    title: "ペリカンズ、サディーク・ベイと3年5550万ドルの契約延長に合意 —— ACL断裂からの復活シーズンを評価",
    excerpt: "ニューオーリンズ・ペリカンズがフォワードのサディーク・ベイと3年、総額5550万ドルの契約延長に合意した。トレードキッカー条項付きで2029-30シーズンまでフル保証。代理人がESPNに伝えた。",
    date: "2026.09.18",
    thumb: "../assets/journal-187-hero.jpg?v=3bcfbc4240",
    tile: "SADDIQ BEY EXTENSION"
  },
  {
    href: "186-michael-sweetney-dies.html",
    cat: "NBA",
    title: "元NBA選手マイケル・スウィートニー氏が43歳で死去 —— ジョージタウン大出身、2003年ドラフト全体9位でニックス入り",
    excerpt: "元NBA選手のマイケル・スウィートニー氏が9月16日（現地時間水曜）、米ニュージャージー州ニューアークの病院で死去した。43歳だった。ジョージタウン大出身で2003年ドラフト全体9位指名を受け、ニックスとブルズでプレーした。ESPNが伝えた。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "MICHAEL SWEETNEY, R.I.P."
  },
  {
    href: "185-kawhi-leonard-raptors-extension.html",
    cat: "NBA",
    title: "カワイ・レナード、ラプターズとの契約延長交渉が大詰め —— 最大2年1億2600万ドルでの署名資格",
    excerpt: "Jake Fischer氏（The Stein Line）が9月17日、関係者の話としてトロント・ラプターズとカワイ・レナードが契約延長に向けた協議を進め、合意に近づいていると報道。レナードは最大2年、総額1億2600万ドルの契約に署名する資格があるという。",
    date: "2026.09.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "KAWHI LEONARD EXTENSION TALKS"
  },
  {
    href: "184-japan-women-hkg-asian-games.html",
    cat: "JAPAN",
    title: "女子日本代表、アジア大会初戦でホンコン・チャイナに114-37の大勝 —— 舘山萌菜が26得点、グループ2戦目はカザフスタンと対戦",
    excerpt: "9月17日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」女子バスケットボールのグループフェーズで、女子日本代表がホンコン・チャイナ代表と対戦し114-37で大勝した。途中出場の舘山萌菜がチーム最多26得点、大脇晴が19得点、田中平和が17得点を記録。日本代表はグループフェーズ2戦目でカザフスタン代表と対戦する。",
    date: "2026.09.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "JAPAN vs HONG KONG, CHINA"
  },
  {
    href: "183-raptors-2026-27-season-preview.html",
    cat: "NBA",
    title: "ラプターズ、カワイ・レナード加入でイースト屈指の優勝候補に —— ESPNが2026-27シーズンプレビュー",
    excerpt: "ESPNは17日、トロント・ラプターズの2026-27シーズンプレビューを公開。クリッパーズからのカワイ・レナード完全移籍でオフェンス力が大幅に向上したと評価し、スコッティ・バーンズの成長やコリン・マレー=ボイルズの起用を含め、イースト屈指のプレーオフ突破候補になり得ると分析した。",
    date: "2026.09.17",
    thumb: "../assets/journal-183-hero.jpg?v=15c4383426",
    tile: "RAPTORS 2026-27 PREVIEW"
  },
  {
    href: "182-resona-bleague-2026-27-keyvisual.html",
    cat: "JAPAN",
    title: "りそなグループ、B.LEAGUE 2026-27シーズンのキービジュアルを公開 —— タイトルパートナー3年目、55選手の挑戦を伝える特設サイトも",
    excerpt: "株式会社りそなホールディングスは9月17日、B.LEAGUEのタイトルパートナーとして「りそなグループ B.LEAGUE 2026-27シーズン」のキービジュアルを公開したと発表。タイトルパートナー3年目となる今シーズンは開幕応援動画「挑戦をアシスト」をTVCM等で展開し、55人の選手の挑戦を紹介する特設サイト「みんなの挑戦」も開設する。",
    date: "2026.09.17",
    thumb: "../assets/journal-182-hero.jpg?v=e3dff30df6",
    tile: "RESONA x B.LEAGUE"
  },
  {
    href: "181-steady-veltex-shizuoka-partnership.html",
    cat: "JAPAN",
    title: "ステディジャパン、ベルテックス静岡とサポートパートナー契約 —— 「STEADYスピンバイク Pro」でコンディショニング支援",
    excerpt: "ホームフィットネスブランド「STEADY」を展開するステディジャパン株式会社は、B.LEAGUE所属のプロバスケットボールクラブ「ベルテックス静岡」とサポートパートナー契約を締結したと発表。フラッグシップモデル「STEADYスピンバイク Pro」を試合会場・練習施設に提供し、選手のコンディショニングとパフォーマンス向上を支援する。",
    date: "2026.09.17",
    thumb: "../assets/journal-181-hero.jpg?v=eeb5e57aac",
    tile: "STEADY x VELTEX SHIZUOKA"
  },
  {
    href: "180-garmin-yokohama-bcorsairs-partnership.html",
    cat: "JAPAN",
    title: "Garmin、横浜ビー・コルセアーズとオフィシャルパートナー契約 —— ウェアラブル端末でコンディション管理を支援",
    excerpt: "ガーミンジャパン株式会社は、B.LEAGUE PREMIER所属の横浜ビー・コルセアーズとオフィシャルパートナー（ゴールド）契約を締結したと発表。トップチームでヘルス＆フィットネストラッカー「CIRQA Smart Band」とGPSウォッチ「Instinct 3」を導入し、選手のコンディション管理とチームパフォーマンス向上をデータ面から支援する。",
    date: "2026.09.17",
    thumb: "../assets/journal-180-hero.jpg?v=772051a6ef",
    tile: "GARMIN x B.CORSAIRS"
  },
  {
    href: "179-kobe-3-protro-black-white.html",
    cat: "KICKS",
    title: "Nike Kobe 3 Protro「Black & White」が復刻 —— シャチ着想の2008年モデルをステルスカラーで再現",
    excerpt: "ナイキは、2008年初頭に発売された「コービー3」のプロトロモデルとして、新色「Black & White」を発表した。シャチ(オルカ)からインスピレーションを得たオリジナルを、漆黒のアッパーにホワイトのスウッシュを効かせたステルスカラーで復刻する。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.09.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "KOBE 3 BLACK & WHITE"
  },
  {
    href: "178-kuksiks-latvia-3x3-europe-cup.html",
    cat: "JAPAN",
    title: "SS所属リハーズ・ククシクス、ラトビア代表として「FIBA 3x3 Europe Cup 2026」優勝",
    excerpt: "東京を拠点とする3x3プロクラブ「SS」の海外組として国際大会を戦うリハーズ・ククシクス選手が、母国ラトビアの代表として「FIBA 3x3 Europe Cup 2026」に出場し優勝。決勝でオランダ代表を破り欧州王者に輝いた。SS株式会社が発表した。",
    date: "2026.09.17",
    thumb: "../assets/journal-178-hero.jpg?v=0488a817e1",
    tile: "LATVIA 3x3 CHAMPIONS"
  },
  {
    href: "177-reath-suns-signing.html",
    cat: "NBA",
    title: "デュオップ・リース、サンズと契約合意 —— ウィリアムズ離脱のセンター陣を補強",
    excerpt: "Shams Charania氏（ESPN）が伝えた。フェニックス・サンズはフリーエージェントのセンター、デュオップ・リース（30）と契約合意。肩の負傷で長期離脱するマーク・ウィリアムズの穴を埋める補強で、リースは元ポートランド・トレイル・ブレイザーズの選手。",
    date: "2026.09.17",
    thumb: "../assets/journal-177-hero.jpg?v=ef4c25d17e",
    tile: "REATH TO SUNS"
  },
  {
    href: "174-kobe-5-protro-what-the-rick.html",
    cat: "KICKS",
    title: "Nike Kobe 5 Protro「What The Rick」2027年夏発売 —— ブランソンの新PE、一般発売コービーPEは4足目",
    excerpt: "ニックスのジェイレン・ブランソンのプレーヤーエクスクルーシブ「Kobe 5 Protro “What The Rick”」が2027年夏に発売される見通し。ブランソン自身2足目のコービー5 プロトロで、一般発売されるコービーPEとしては通算4足目となる。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.09.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "WHAT THE RICK"
  },
  {
    href: "173-wiseman-knicks-exhibit9.html",
    cat: "NBA",
    title: "元全体2位指名、ジェームズ・ワイズマン —— ニックスとエキシビット9契約に合意",
    excerpt: "Michael Scotto氏（HoopsHype）が伝えた。ニューヨーク・ニックスは、2020年NBAドラフト全体2位指名のセンター、ジェームズ・ワイズマン（25）とエキシビット9契約を結んだ。ワイズマンはウォリアーズ・ピストンズ・ペイサーズでのNBA5シーズンで平均9.0得点5.5リバウンドを記録している。",
    date: "2026.09.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "WISEMAN TO KNICKS"
  },
  {
    href: "176-kobe-3-low-mismatch.html",
    cat: "KICKS",
    title: "Nike Kobe 3 Low Protro「Mismatch」が9月19日発売 —— キッズ向け限定モデル、122ドル",
    excerpt: "ナイキは、キッズ向け限定モデル「Nike Kobe 3 Low Protro “Mismatch”」を2026年9月19日にNike.comで発売する。品番IZ7934-900、価格122ドル(米国価格)。8月24日の「コービー・デー」以降、コービー・プロトロ・ラインの新色が続々と登場している。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.16",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "KOBE 3 LOW MISMATCH"
  },
  {
    href: "175-saga-ballooners-premier-opener.html",
    cat: "JAPAN",
    title: "佐賀バルーナーズ、B.LEAGUE PREMIER開幕戦へ —— 元NBAナシール・リトルが新加入、9月25日SAGAアリーナで開幕",
    excerpt: "佐賀市は、地元クラブ「佐賀バルーナーズ」が新設のトップリーグ「B.LEAGUE PREMIER」の開幕戦を9月25日、SAGAアリーナで迎えると発表。元NBAのナシール・リトルが新加入し、9月25日の開幕戦（vs広島ドラゴンフライズ）はBリーグの「オープニングセレクション」にも選ばれている。",
    date: "2026.09.16",
    thumb: "../assets/journal-175-hero.jpg?v=1666127aee",
    tile: "SAGA BALLOONERS"
  },
  {
    href: "172-japan-taipei-asian-games-qf.html",
    cat: "JAPAN",
    title: "男子日本代表、アジア大会準々決勝でチャイニーズ・タイペイに85-78で辛勝 —— 黒川虎徹23得点、準決勝は中国と対戦",
    excerpt: "9月16日、愛知国際アリーナで行われた「第20回アジア競技大会（2026／愛知・名古屋）」男子バスケットボール準々決勝で、男子日本代表がチャイニーズ・タイペイ代表に85-78で勝利した。黒川虎徹がチーム最多23得点、キャプテンの小川が15得点、アレックス・カークが12得点8リバウンドを記録。日本は18日の準決勝で中国代表と対戦する。",
    date: "2026.09.16",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "JAPAN vs CHINESE TAIPEI"
  },
  {
    href: "171-nba-future-power-rankings-2026-27.html",
    cat: "NBA",
    title: "サンダーが2年連続首位、スパーズは10位から2位へ急浮上 —— ESPN「フューチャー・パワーランキング」2026-27版",
    excerpt: "ESPNは16日（現地時間）、今後3年間のチーム力を予測する「フューチャー・パワーランキング」の最新版を公開。オクラホマシティ・サンダーが2年連続で首位、ヴィクター・ウェンバンヤマ擁するサンアントニオ・スパーズが前回10位から2位へ急浮上し、両チームが他球団を大きく引き離した。",
    date: "2026.09.16",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "FUTURE POWER RANKINGS"
  },
  {
    href: "170-nets-2026-27-preview.html",
    cat: "NBA",
    title: "ネッツ2026-27プレビュー —— ESPNがオフシーズンを「B-」評価、目玉はランドル獲得も長期展望は不透明",
    excerpt: "ESPNは16日（現地時間）、ブルックリン・ネッツの2026-27シーズンを展望する特集記事を公開し、オフシーズンの補強采配に「B-」評価。ミネソタから獲得したジュリアス・ランドルが目玉補強となる一方、若手中心の再建は今なお時間がかかるとの見立てが示されている。",
    date: "2026.09.16",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "NETS 2026-27"
  },
  {
    href: "169-oneconsist-tubc-partnership.html",
    cat: "JAPAN",
    title: "ワンコンシスト、東京ユナイテッドBBCとオフィシャルパートナー契約 —— イベント運営のノウハウで試合運営を支援",
    excerpt: "イベント企画・運営を手がける株式会社ワンコンシスト（東京都渋谷区、CEO兼COO：戸来拓也）は、有明アリーナを拠点とするB.LEAGUE ONE「東京ユナイテッドバスケットボールクラブ（TUBC）」と、2026-27シーズンのオフィシャルパートナー（ブロンズ）契約を8月26日付で締結したと発表。イベント運営のノウハウを生かし、試合運営やファン・地域が交流できる「場づくり」を支援する。",
    date: "2026.09.16",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "ONECONSIST × TUBC"
  },
  {
    href: "168-kobe-8-protro-mambacurial.html",
    cat: "KICKS",
    title: "コービー8 プロトロに新色「Mambacurial」—— サッカースパイク由来のグラデーションで復活",
    excerpt: "ナイキは、2013年発売の「コービー8 “Mambacurial”」をプロトロ仕様で復刻した新色「Red Plum & Pink Flash」を発表した。サッカースパイク「マーキュリアル ヴェイパー IX」に着想したグラデーションを踏襲し、Nike Reactフォームなど最新のプロトロ性能を搭載する。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.09.16",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "KOBE 8 PROTRO"
  },
  {
    href: "167-number-plus-bleague-guidebook.html",
    cat: "JAPAN",
    title: "Number PLUS「B.LEAGUE 2026-27 公式ガイドブック」9月16日発売 —— 表紙は富永啓生・齋藤拓実・馬場雄大の3選手",
    excerpt: "文藝春秋は9月16日、『Sports Graphic Number PLUS』B.LEAGUE 2026-27 OFFICIAL GUIDEBOOKを発売した。判型を刷新し全55クラブの選手名鑑を収録。表紙にはレバンガ北海道・富永啓生、名古屋ダイヤモンドドルフィンズ・齋藤拓実、長崎ヴェルカ・馬場雄大の3選手が登場する。定価1980円(税込)。",
    date: "2026.09.16",
    thumb: "../assets/journal-167-hero.jpg?v=5e17c47ae0",
    tile: "B.LEAGUE GUIDEBOOK"
  },
  {
    href: "166-konchar-knicks-one-year-deal.html",
    cat: "NBA",
    title: "ジョン・コンチャー、ニックスと1年契約に合意 —— フリーエージェントからNBA8年目のシーズンへ",
    excerpt: "Shams Charania（ESPN）が一報。フリーエージェントのフォワード、ジョン・コンチャーがニューヨーク・ニックスと1年契約に合意した。代理人ジョージ・S・ラングバーグ氏がESPNに明らかにしたもので、コンチャーは今シーズンでNBA8年目を迎える。",
    date: "2026.09.16",
    thumb: "../assets/journal-166-hero.jpg?v=6683bf555b",
    tile: "KONCHAR TO KNICKS"
  },
  {
    href: "165-celtics-offseason-tatum-return.html",
    cat: "NBA",
    title: "セルティックス、ブラウン放出でジョージ獲得 —— 復活のテイタムに懸かる2026-27シーズン",
    excerpt: "ボストン・セルティックスは2026年7月、2024年ファイナルMVPのジェイレン・ブラウンをフィラデルフィア・76ersへ放出しポール・ジョージらを獲得。ジアニス・アデトクンボ獲得も逃す中、2025年プレーオフでアキレス腱を断裂したジェイソン・テイタムの本格復帰に懸ける2026-27シーズンを迎える。ESPNがオフシーズンを総括し開幕前の展望を分析している。",
    date: "2026.09.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "CELTICS 2026-27"
  },
  {
    href: "164-nike-caitlin-1-signature.html",
    cat: "KICKS",
    title: "Nike「Caitlin 1」発表 —— ケイトリン・クラーク初のシグネチャーシューズ、中国9月24日・世界10月1日発売",
    excerpt: "ナイキは、インディアナ・フィーバーのケイトリン・クラーク選手にとって初のシグネチャーシューズとなる「Caitlin 1」とアパレルコレクションを正式発表した。新開発の「Nike Opticast」アッパーに前足部の「Air Zoom Turbo」ユニット、「Cushlon」ミッドソールを搭載。発売は中国が2026年9月24日、グローバルは10月1日。Hypebeastなどが伝えた。",
    date: "2026.09.15",
    thumb: "../assets/journal-164-hero.jpg?v=39fcd516fa",
    tile: "NIKE CAITLIN 1"
  },
  {
    href: "163-abema-bleague-premier-opener.html",
    cat: "JAPAN",
    title: "ABEMA、B.LEAGUE PREMIER開幕戦「アルバルク東京vs琉球」を無料生中継 —— 9月22日13時45分、10年前と同じ顔合わせ",
    excerpt: "ABEMAは、9月22日に開幕する新トップリーグ「B.LEAGUE PREMIER」の開幕戦「アルバルク東京vs琉球ゴールデンキングス」を無料生中継すると発表。ABEMAがB.LEAGUEの試合を生中継するのは今回が初。2016年のB.LEAGUE開幕戦と同じカードで、リーグ誕生から10年の節目を迎える。",
    date: "2026.09.15",
    thumb: "../assets/journal-163-hero.jpg?v=d5f81c1ec7",
    tile: "ABEMA × B.PREMIER"
  },
  {
    href: "162-air-jordan-1-low-halloween.html",
    cat: "KICKS",
    title: "漆黒にScream Greenの縁取り —— Air Jordan 1 Low「Halloween」、蓄光アウトソールでFall 2026発売",
    excerpt: "ジョーダン ブランドは、毎年恒例のハロウィン企画として「Air Jordan 1 Low」の新色「Halloween」を発表した。品番IQ5494-001、価格125ドル(米国価格)で、2026年秋(Fall 2026)の発売が予定されている。アウトソールはグロー・イン・ザ・ダーク仕様。Hypebeastが伝えた。",
    date: "2026.09.15",
    thumb: "../assets/journal-162-hero.jpg?v=151c4f1c3b",
    tile: "AJ1 HALLOWEEN"
  },
  {
    href: "161-nike-air-force-1-leopard.html",
    cat: "KICKS",
    title: "定番に全面レオパード柄 —— Nike Air Force 1 Low「Leopard」がFall 2026発売",
    excerpt: "ナイキは、定番モデル「Air Force 1 Low」のキャンバスアッパー全面に豹柄プリントをあしらった新色「Leopard」を発表した。品番JA5714-900、価格125ドル(米国価格)で、2026年秋(Fall 2026)の発売が予定されている。Hypebeastが伝えた。",
    date: "2026.09.15",
    thumb: "../assets/journal-161-hero.jpg?v=a9beda1666",
    tile: "AF1 LEOPARD"
  },
  {
    href: "160-palsystem-saitama-broncos.html",
    cat: "JAPAN",
    title: "パルシステム埼玉、さいたまブロンコスとスポンサー契約 —— コラボグッズや冠試合で地域連携",
    excerpt: "生活協同組合パルシステム埼玉（本部:埼玉県蕨市）は、所沢市とさいたま市をダブルホームタウンとするB.LEAGUE ONE「さいたまブロンコス」とスポンサー契約を締結したと発表。新規加入者向けのコラボグッズ企画やバスケイベントへのボール寄贈、「パルシステム埼玉杯」を冠した試合開催などを検討し、地域密着型のネットワークを生かした連携を進める。",
    date: "2026.09.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "PALSYSTEM × BRONCOS"
  },
  {
    href: "159-sakura-funabashi-yunnan-3x3.html",
    cat: "JAPAN",
    title: "SAKURA FUNABASHI、中国遠征でベスト4 —— 初期メンバー再結集の3x3チーム、9月27日は甲子園へ",
    excerpt: "3x3プロチーム「SAKURA FUNABASHI」(千葉県船橋市)が9月27日、兵庫県のららぽーと甲子園で開催の「3x3 UNITED」大会に出場すると発表。2025年8月には中国・雲南省の国際大会でベスト4に進んだ実績を振り返った。",
    date: "2026.09.15",
    thumb: "../assets/journal-159-hero.jpg?v=5316f3754b",
    tile: "SAKURA FUNABASHI"
  },
  {
    href: "158-taj-gibson-retires-bulls-coach.html",
    cat: "NBA",
    title: "タジ・ギブソン、17年の現役に幕 —— ブルズでティアゴ・スプリッター新体制のアシスタントコーチへ",
    excerpt: "Shams Charania（ESPN）が9月14日（現地時間）一報。タジ・ギブソンは17シーズンのNBA現役生活を終えて引退し、シカゴ・ブルズでティアゴ・スプリッター新ヘッドコーチのアシスタントコーチとして指導者のキャリアを歩み始める。",
    date: "2026.09.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "TAJ GIBSON RETIRES"
  },
  {
    href: "157-kawhi-leonard-trade-done-deal.html",
    cat: "NBA",
    title: "カワイ・レナードのラプターズ移籍が完全合意 —— クリッパーズはインガム、ディック、指名権5つを獲得とシャムズ・シャラニア記者",
    excerpt: "Shams Charania（ESPN）が9月14日(現地時間)一報。クリッパーズとラプターズがカワイ・レナードのトレードを完全合意し実行へ。クリッパーズはブランドン・インガム、グレイディ・ディック、1巡目指名権2つ(無保護)、1巡目指名権交換権1つ、2巡目指名権2つを獲得する。",
    date: "2026.09.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "KAWHI LEONARD TRADE"
  },
  {
    href: "156-adidas-superstar-cold-blooded.html",
    cat: "KICKS",
    title: "adidas Superstar「Cold Blooded」が9月18日発売 —— アンソニー・エドワーズのシグネチャー展開拡大",
    excerpt: "adidasは、アンソニー・エドワーズ選手とのコラボモデル「Superstar『Cold Blooded』」(品番LA7828)を2026年9月18日に発売する。同日にはAE3の同名カラー「Cold Blooded」も発売予定で、パフォーマンスシューズの枠を超えたエドワーズの展開が広がる。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.09.14",
    thumb: "../assets/journal-156-hero.jpg?v=7315121d58",
    tile: "ADIDAS SUPERSTAR COLD BLOODED"
  },
  {
    href: "155-kobe-3-protro-orca.html",
    cat: "KICKS",
    title: "Nike Kobe 3 Protro「Orca」が9月26日発売 —— 2007年オリジナルのハイトップ形状で復刻",
    excerpt: "ナイキは「コービー3 プロトロ」の新色「Orca」(品番IQ5340-001)を2026年9月26日に発売する。近年主流だったロートップではなく2007年オリジナルと同じハイトップ形状を採用し、最新プロトロの性能面のアップデートを組み込んだ。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.14",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "KOBE 3 PROTRO ORCA"
  },
  {
    href: "154-air-bakin-varsity-red.html",
    cat: "KICKS",
    title: "Nike Air Bakin OG「Varsity Red」が9月29日発売 —— 90年代バスケの一足、170ドルでSNKRSへ",
    excerpt: "ナイキは1990年代後半のバスケットボールシューズ「Air Bakin OG」の新色「Varsity Red」を、2026年9月29日にSNKRSと一部店舗で発売する。価格は170ドル(米国価格)。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "AIR BAKIN VARSITY RED"
  },
  {
    href: "153-air-jordan-5-sunset-retro.html",
    cat: "KICKS",
    title: "Air Jordan 5「Sunset」が2006年以来初の復刻へ —— 公式画像公開、9月下旬に発売",
    excerpt: "ナイキは「Air Jordan 5『Sunset』」(品番IV5678-102)を、2026年9月下旬に初の公式リトロとして発売する。2006年発売のカラーウェイの初復刻となる。Sneaker Newsが公式画像とともに伝えた。",
    date: "2026.09.14",
    thumb: "../assets/journal-153-hero.jpg?v=6d15bae6e8",
    tile: "AIR JORDAN 5 SUNSET"
  },
  {
    href: "152-nba-cup-guide.html",
    cat: "NBA",
    title: "NBAカップとは？ —— 仕組み・賞金・歴代優勝・2026年大会の日程まとめ",
    excerpt: "2023-24シーズンに「インシーズン・トーナメント」として始まったNBAカップ（Emirates NBA Cup）の仕組みを解説。グループステージからノックアウトまでの流れ、決勝だけがレギュラーシーズン成績に数えられない理由、選手に配られる賞金、専用コート、歴代優勝とMVP、2026年大会の日程までまとめた。",
    date: "2026.09.15",
    thumb: "../assets/journal-152-hero.jpg?v=a20caf99ba",
    tile: "NBA CUP"
  },
  {
    href: "151-bleague-premier-guide.html",
    cat: "JAPAN",
    title: "B.LEAGUE PREMIER（Bプレミア）とは —— 仕組み・開幕日・参加26クラブ一覧・参入基準・B1との違いまとめ",
    excerpt: "B.LEAGUE PREMIER（Bプレミア）は2026-27シーズンに始まるBリーグの新しいトップディビジョン。2026年9月22日のアルバルク東京vs琉球で開幕し、東西2地区・全26クラブで戦う。競技成績による昇降格はなく、入場者数・売上高・アリーナの審査で参入が決まる。",
    date: "2026.09.15",
    thumb: "../assets/journal-151-hero.jpg?v=d7626b765f",
    tile: "B.PREMIER"
  },
  {
    href: "150-bleague-asobisystem-kawaiilab.html",
    cat: "JAPAN",
    title: "B.LEAGUEとアソビシステムが連携 —— KAWAII LAB.所属5組が「B祭応援団」に就任、応援ソング「Over Drive」9月15日配信",
    excerpt: "B.LEAGUEはアソビシステムと連携し、同社のアイドルプロジェクト「KAWAII LAB.」所属5組（FRUITS ZIPPER、CANDY TUNE、SWEET STEADY、CUTIE STREET、MORE STAR）が「B祭応援団」に就任すると発表。応援ソング「Over Drive」を9月15日に配信リリースし、9月25日のB.LEAGUE PREMIER OPENING SELECTION（佐賀×広島）にはSWEET STEADYが出演する。",
    date: "2026.09.14",
    thumb: "../assets/journal-150-hero.jpg?v=31371e3f9d",
    tile: "B.LEAGUE x KAWAII LAB."
  },
  {
    href: "149-devin-carter-celtics-camp-deal.html",
    cat: "NBA",
    title: "デビン・カーター、セルティックスとキャンプ契約で合意 —— ロースター入りへ、キングス時代は平均8.9得点",
    excerpt: "Michael Scotto（HoopsHype）が一報。ボストン・セルティックスがガードのデビン・カーターとトレーニングキャンプ契約で合意し、ロースターまたは2ウェイ契約の枠を懸けて争う。前季はキングスで平均8.9得点、3.3リバウンド、2.7アシスト。",
    date: "2026.09.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "DEVIN CARTER"
  },
  {
    href: "148-rucker-park-new-york-guide.html",
    cat: "CULTURE",
    title: "ラッカーパーク（ニューヨーク）ガイド —— 場所・行き方・歴史・プレーした有名選手まとめ",
    excerpt: "ラッカーパーク（Holcombe Rucker Park）はニューヨーク・マンハッタンの155丁目とフレデリック・ダグラス・ブールバードの角にある屋外コート。最寄りは地下鉄155丁目駅（B・D線）。1950年に始まった夏の大会以来、チェンバレン、ドクターJ、コービー、デュラントらがプレーし、2025年1月に国の記念地に指定された。",
    date: "2026.09.14",
    thumb: "../assets/journal-148-hero.jpg?v=caa39bdaf2",
    tile: "RUCKER PARK"
  },
  {
    href: "147-patty-mills-profile.html",
    cat: "NBA",
    title: "パティ・ミルズの経歴・プレースタイル・現在の所属 —— オーストラリア代表、スパーズ優勝からASVELまで",
    excerpt: "パティ・ミルズは1988年キャンベラ生まれのオーストラリア代表ガード。2014年にスパーズでNBA優勝、東京2020五輪では銅メダル決定戦で42得点を挙げた。NBAでは7球団で16シーズン、2026-27シーズンはフランスのASVELと1年契約を結んでいる。",
    date: "2026.09.14",
    thumb: "../assets/journal-147-hero.jpg?v=2648858869",
    tile: "PATTY MILLS"
  },
  {
    href: "146-payroll-cup-wheelchair-basketball.html",
    cat: "JAPAN",
    title: "ペイロールカップとは —— 北海道の車いすバスケットボール大会、第1回から第4回までの開催地・参加チームまとめ",
    excerpt: "ペイロールカップは、給与計算BPOの株式会社ペイロールが2023年に始めた北海道の車いすバスケットボール大会。初回3チームから第3回（2025年）は6チームに拡大し、第4回は2026年9月26日・27日に札幌市西区体育館で入場無料で開かれる。",
    date: "2026.09.14",
    thumb: "../assets/journal-146-hero.jpg?v=31bd2b9632",
    tile: "PAYROLL CUP"
  },
  {
    href: "145-jordan-tatum-signature-series.html",
    cat: "KICKS",
    title: "ジョーダン「テイタム」シリーズ全モデルまとめ —— テイタム1〜テイタム5の発売日・価格・特徴",
    excerpt: "ジェイソン・テイタムのシグネチャーシューズ「テイタム」シリーズは2023年のテイタム1に始まり、最新作テイタム5は日本で2026年10月15日発売・税込1万7160円。全5モデルの発売時期・価格・搭載テクノロジーをまとめた。",
    date: "2026.09.14",
    thumb: "../assets/journal-145-hero.jpg?v=2163c215e7",
    tile: "JORDAN TATUM SERIES"
  },
  {
    href: "144-bleague-2026-27-how-to-watch.html",
    cat: "JAPAN",
    title: "Bリーグ 2026-27はどこで見られる？ —— Bプレミア・Bワン・Bネクストの配信・放送サービスまとめ【料金・開幕日】",
    excerpt: "りそなグループ B.LEAGUE 2026-27 SEASONは9月22日開幕。Bプレミア・Bワン・Bネクストの全試合を配信するのはバスケットLIVE（月額770円）。U-NEXTとDAZNはBプレミア・Bワン全試合、Prime Video内のバスケットLIVEはBプレミア全試合を配信し、NHK・J SPORTSは一部試合を放送する。",
    date: "2026.09.14",
    thumb: "../assets/journal-144-hero.jpg?v=4666d07e85",
    tile: "Bリーグ 配信まとめ 2026-27"
  },
  {
    href: "143-nba-2026-27-how-to-watch-japan.html",
    cat: "NBA",
    title: "NBA 2026-27シーズンを日本で見る方法 —— 開幕日、Prime Video・NBA docomo・WOWOWの配信範囲と料金、八村塁・河村勇輝の注目点",
    excerpt: "NBA 2026-27シーズンは現地10月20日（日本時間21日）に開幕する。日本ではPrime Video『NBA on Prime』（プライム会員特典）、NBA docomo（レギュラーシーズン400試合を日本語実況）、WOWOW（毎週2試合＋プレーオフ）で視聴でき、NBA docomoのシーズンパスは16,500円（9月30日までは14,300円）。八村塁と河村勇輝はともにクリッパーズで新シーズンを迎える。",
    date: "2026.09.14",
    thumb: "../assets/journal-143-hero.jpg?v=a20caf99ba",
    tile: "HOW TO WATCH NBA 2026-27"
  },
  {
    href: "142-76ers-lebron-super-users.html",
    cat: "NBA",
    title: "76ersの「4人のスーパーユーザー」問題 —— レブロン加入で優勝オッズ改善も、勝ち星予想は小幅増にとどまる",
    excerpt: "フィラデルフィア・76ersは2026年7月、ポール・ジョージらをセルティックスへ放出しファイナルMVPのジェイレン・ブラウンを獲得、同月末にはレブロン・ジェームズ(41)と2年800万ドルで契約した。ジェームズ・ブラウン・マクシー・エンビードと「キャリア使用率25%超」の4人がそろう異例の布陣について、ESPNが過去30チームのデータをもとに行方を分析している。",
    date: "2026.09.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "76ERS SUPER-USERS"
  },
  {
    href: "140-sendai-89ers-updraft.html",
    cat: "JAPAN",
    title: "仙台89ERS、アップドラフトとユニフォーム＆タオルスポンサー契約 —— Bプレミア初挑戦シーズンの肩に新ロゴ",
    excerpt: "宮城県仙台市の株式会社アップドラフトは、B.LEAGUE「仙台89ERS」の2026-27シーズンにおいて、ユニフォームへの広告掲出と応援グッズ「MyPLAYERタオル」への協賛を行うと発表した。ユニフォームシャツの肩に同社ロゴを掲出する。仙台89ERSは今シーズン、最高峰の舞台「Bプレミア」に初挑戦する。",
    date: "2026.09.14",
    thumb: "../assets/journal-140-hero.jpg?v=ff835500e3",
    tile: "SENDAI 89ERS × UPDRAFT"
  },
  {
    href: "141-japan-korea-asian-games.html",
    cat: "JAPAN",
    title: "男子日本代表、アジア大会で韓国に83-100で敗戦 —— 黒川虎徹が21得点、グループ2位で決勝Tへ",
    excerpt: "9月13日、愛知国際アリーナで「第20回アジア競技大会（愛知・名古屋2026）」男子バスケットボールのグループフェーズが行われ、男子日本代表が韓国代表と対戦し83-100で敗れた。黒川虎徹が4本の3ポイントを含む21得点を挙げたが及ばず、日本はグループAを2位で通過し決勝トーナメントに進む。",
    date: "2026.09.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "JAPAN vs KOREA"
  },
  {
    href: "139-ua-fox-3.html",
    cat: "KICKS",
    title: "アンダーアーマー「フォックス3」が9月18日発売 —— ディアロン・フォックスの第3弾シグネチャー",
    excerpt: "株式会社ドームは、NBAサンアントニオ・スパーズのディアロン・フォックスの第3弾シグネチャーバスケットボールシューズ「UAフォックス3」（カラー名:ARCTIC FOX）を2026年9月18日に発売すると発表した。価格は17,930円（税込）、重量は約337g。",
    date: "2026.09.14",
    thumb: "../assets/journal-139-hero.jpg?v=90debef506",
    tile: "UA FOX 3"
  },
  {
    href: "138-clippers-punishment-explained.html",
    cat: "NBA",
    title: "クリッパーズ処分の全貌 —— 1巡目指名権5つ剥奪、罰金3000万ドル、バルマー氏ら幹部も停職",
    excerpt: "NBAは、カワイ・レナードとの契約を巡るサラリーキャップ規定違反でロサンゼルス・クリッパーズを処分した。1巡目指名権5つの剥奪、3000万ドルの罰金、オーナーのスティーブ・バルマー氏ら幹部の停職処分の中身と、リーグがここまで厳しい処分に踏み切った理由をESPNのNBA担当記者陣の分析をもとに整理する。",
    date: "2026.09.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "CLIPPERS PUNISHMENT"
  },
  {
    href: "137-beal-clippers-no3-jersey.html",
    cat: "NBA",
    title: "ビール、クリッパーズで背番号3に —— 「レジェンドの歴史は消えない」とクリス・ポールに敬意",
    excerpt: "ロサンゼルス・クリッパーズのブラッドリー・ビールは、2026-27シーズンにクリス・ポールと長く結び付いてきた背番号3を着用する見通しだとESPNが11日（現地時間）伝えた。ビールは自身のSNSで「彼はレジェンドだ。あの歴史とブランドには誰も触れられないし、消すこともできない」とポールへの敬意を示した。",
    date: "2026.09.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "BEAL NO. 3"
  },
  {
    href: "136-clippers-kawhi-federal-investigation.html",
    cat: "NBA",
    title: "クリッパーズとレナードの契約疑惑、連邦検察も捜査に着手 —— NY州東部地区検事局、NBAの処分に続き刑事捜査へ",
    excerpt: "米ニューヨーク・タイムズは11日（現地時間）、関係者の話として、ロサンゼルス・クリッパーズがカワイ・レナードへの報酬を巡りサラリーキャップ規定を回避したとされる問題について、NY州東部地区の連邦検事局が刑事捜査に着手したと報じた。ESPNが伝えた。NBAは今月、同じ疑惑でクリッパーズに1巡目指名権5つの剥奪と3000万ドルの罰金などを科したばかり。",
    date: "2026.09.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "CLIPPERS FEDERAL PROBE"
  },
  {
    href: "135-air-jordan-1-low-last-dance-at-the-garden.html",
    cat: "KICKS",
    title: "Air Jordan 1 Low OG「Last Dance At The Garden」が9月26日発売 —— MSGでの引退試合を再現",
    excerpt: "ジョーダン ブランドは「Air Jordan 1 Low OG『Last Dance At The Garden』」(品番IR0088-001)を2026年9月26日にSNKRSほかで発売する。価格は155ドル(米国価格)。マイケル・ジョーダンがブルズ最後の試合でマディソン・スクエア・ガーデンに履いていった「Air Jordan 1『Chicago』」にインスパイアされた1足。Nice KicksとSneaker Bar Detroitが伝えた。",
    date: "2026.09.12",
    thumb: "../assets/journal-135-hero.jpg?v=6d15bae6e8",
    tile: "AIR JORDAN 1 LOW LAST DANCE"
  },
  {
    href: "133-anthony-edwards-adidas-superstar-ii-bliss-blue.html",
    cat: "KICKS",
    title: "Anthony Edwards x adidas Superstar II「Bliss Blue」が9月18日発売 —— ミネソタのエースとクラシックモデルのコラボ",
    excerpt: "アンソニー・エドワーズ（ミネソタ・ティンバーウルブズ）とadidasのコラボレーション「Anthony Edwards x adidas Superstar II」の新色「Bliss Blue」（品番LA7828）が2026年9月18日にadidas.comほかで発売される。Nice Kicksが伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-133-hero.jpg?v=30285b5395",
    tile: "ADIDAS SUPERSTAR II"
  },
  {
    href: "134-adidas-anthony-edwards-3-cold-blooded.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards 3「Cold Blooded」が9月18日発売 —— 3代目シグネチャーに新色",
    excerpt: "アンソニー・エドワーズ（ミネソタ・ティンバーウルブズ）の3代目シグネチャーモデル「adidas Anthony Edwards 3」に、新色「Cold Blooded」（品番KH8537）が2026年9月18日にadidas.comおよび一部取扱店で発売される。Nice Kicksが伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-134-hero.jpg?v=7a43c23426",
    tile: "ADIDAS ANTHONY EDWARDS 3"
  },
  {
    href: "132-kawhi-leonard-trade-clippers-raptors.html",
    cat: "NBA",
    title: "カワイ・レナードのラプターズ移籍、NBA承認に「障害なし」—— クリッパーズとの合意トレード、いつでも申請可能とマーク・スタイン記者",
    excerpt: "Marc Stein（The Stein Line）は11日、事情に詳しい複数の関係者の話として、クリッパーズとラプターズが今年6月に合意したとされるカワイ・レナードの移籍トレードについて、両球団はいつでもNBAへ承認を申請できる状態にあり、リーグ事務局サイドに障害はないと伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "KAWHI LEONARD TRADE"
  },
  {
    href: "131-air-jordan-4-lemonade-j-balvin.html",
    cat: "KICKS",
    title: "J Balvin x Air Jordan 4「Lemonade」が2026年9月発売 —— コロンビアにルーツを持つイエロー、クロコ型押しレザー",
    excerpt: "コロンビア出身のシンガー、J Balvinとジョーダン ブランドのコラボレーション「Air Jordan 4『Lemonade』」(品番IW2872-700)が2026年9月に発売される。クロコ型押しレザーを使い、複数のイエローを組み合わせた配色でBalvinのコロンビアにルーツを持つデザイン。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-131-hero.jpg?v=d532e074cd",
    tile: "J BALVIN x AIR JORDAN 4"
  },
  {
    href: "130-mark-williams-shoulder-surgery.html",
    cat: "NBA",
    title: "サンズのマーク・ウィリアムズが左肩を手術 —— 関節唇断裂で長期離脱へ",
    excerpt: "フェニックス・サンズのセンター、マーク・ウィリアムズが左肩の関節唇断裂の修復手術を受けた。Shams Charania（ESPN）によると、負傷はオフシーズンのワークアウト中に発生し、長期間の離脱が見込まれるという。",
    date: "2026.09.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "MARK WILLIAMS SHOULDER"
  },
  {
    href: "129-nba-nike-specter-uniforms.html",
    cat: "NBA",
    title: "NBA×Nikeが新ユニフォーム「Specter」発表 —— ニックス・セルティックス・レイカーズなど伝統8球団に導入",
    excerpt: "NBAとナイキは9日（現地時間）夜、ブルックリンで開いたイベントで、ニックス・セルティックス・レイカーズなどリーグ最古参8球団向けの新ユニフォーム「Specter」を発表した。各球団の歴史や本拠地の文化にインスパイアされたデザインで、対象は1946-47シーズン前後に創設された8球団。ESPNが伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-129-hero.jpg?v=bee79799ec",
    tile: "NBA × NIKE SPECTER"
  },
  {
    href: "128-mowalola-air-jordan-14-burnt-red.html",
    cat: "KICKS",
    title: "Mowalola x Air Jordan 14「Burnt Red」が9月18日発売 —— パリコレで発表、初コラボ",
    excerpt: "英国・ナイジェリア系デザイナー、モワロラ・オグンレシのレーベル「Mowalola」とジョーダン ブランドの初コラボレーション「Air Jordan 14 SP『Burnt Red』」(品番IQ5708-001)が2026年9月18日に発売される。パリ・ファッションウィーク期間中に披露された。Nice KicksとSneaker Newsが伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-128-hero.jpg?v=902a507ff9",
    tile: "MOWALOLA x AIR JORDAN 14"
  },
  {
    href: "127-nba-bog-clippers-europe.html",
    cat: "NBA",
    title: "NBA理事会が来週開催 —— クリッパーズ処分の「次章」とNBAヨーロッパ構想、シルバーコミッショナーが火曜に会見",
    excerpt: "ESPNのブライアン・ウィンドホースト記者は11日、来週月〜火曜にニューヨークで開かれるNBA理事会(Board of Governors)を前に争点を分析する記事を公開した。焦点はクリッパーズへの処分を巡る「次章」と、NBAヨーロッパ構想の行方。アダム・シルバーコミッショナーは火曜に会見を予定している。",
    date: "2026.09.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "NBA BOARD OF GOVERNORS"
  },
  {
    href: "126-adidas-anthony-edwards-3-snow-camo.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards 3「Snow Camo」が10月9日発売 —— ミネソタの冬をイメージしたグレー×ホワイト新色",
    excerpt: "アンソニー・エドワーズ（ミネソタ・ティンバーウルブズ）の3代目シグネチャーモデル「adidas Anthony Edwards 3」に、新色「Snow Camo」（品番KH8542）が2026年10月9日に発売される。グレーとホワイトを基調に、エドワーズの地元ミネソタの冬をイメージした配色。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.11",
    thumb: "../assets/journal-126-hero.jpg?v=38a0196018",
    tile: "ADIDAS ANTHONY EDWARDS 3"
  },
  {
    href: "125-pacers-2026-27-preview.html",
    cat: "NBA",
    title: "ペイサーズ2026-27プレビュー —— ハリバートン復帰、ESPNは「B−」評価でズバッチ加入を評価",
    excerpt: "ESPNは11日（現地時間）、インディアナ・ペイサーズの2026-27シーズンを展望する特集記事を公開した。2025年ファイナル第7戦でアキレス腱を断裂したタイリース・ハリバートンが1年半ぶりに復帰。トレード加入のアイビカ・ズバッチと合わせ、オフシーズンの補強はザック・クラム記者から「B−」評価を受けた。",
    date: "2026.09.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "PACERS 2026-27 PREVIEW"
  },
  {
    href: "124-ibaraki-robots-docomo.html",
    cat: "JAPAN",
    title: "茨城ロボッツとドコモが新プロジェクト始動 —— d払い利用の1%相当がチーム支援金に、9月13日から",
    excerpt: "茨城ロボッツ・スポーツエンターテインメントとNTTドコモ関信越支社は9月11日、地域とファン・ブースターをつなぐ共同プロジェクトを開始すると発表した。第一弾として9月13日から、「d払い」での買い物が茨城ロボッツの支援につながる「茨城ロボッツ応援店制度」を始める。支払い額の1%相当をドコモが負担し応援金として届ける仕組みで、利用者の負担はない。",
    date: "2026.09.11",
    thumb: "../assets/journal-124-hero.jpg?v=a15957c332",
    tile: "IBARAKI ROBOTS x DOCOMO"
  },
  {
    href: "123-sendai-89ers-eposcard.html",
    cat: "JAPAN",
    title: "仙台89ERSエポスカード誕生 —— 利用額の0.1%がチーム支援に、入会特典は2,000円引き",
    excerpt: "株式会社エポスカードは9月11日、プロバスケットボールチーム「仙台89ERS」と共創した「仙台89ERSエポスカード」の申し込み受け付けを同日開始したと発表した。年会費永年無料のVisaカードで、利用額に応じて還元されるポイントのうち0.1%分が仙台89ERSへの支援金として渡される。",
    date: "2026.09.11",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "SENDAI 89ERS x EPOS"
  },
  {
    href: "122-kobe-storks-symenergy-byell.html",
    cat: "JAPAN",
    title: "神戸ストークス、B.LEAGUE PREMIER初年度もシン・エナジーとトップパートナー契約 —— 新プロジェクト「B.YELL」で全30試合の観戦チケット抽選",
    excerpt: "シン・エナジー株式会社は、B.LEAGUE PREMIER初年度に参入する神戸ストークスと2026-27シーズンのトップパートナー契約を締結したと発表。3シーズン連続の契約継続とあわせ、ホームゲーム全30試合の観戦チケットを抽選でプレゼントする新プロジェクト「BASKETBALL YELL PROJECT『B.YELL』」を始動した。",
    date: "2026.09.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "KOBE STORKS x SYM ENERGY"
  },
  {
    href: "121-jordan-tatum-5-sunrise.html",
    cat: "KICKS",
    title: "テイタム5「Sunrise（サンライズ）」が10月15日発売 —— ジェイソン・テイタム最新シグネチャーの最初のカラー",
    excerpt: "ジェイソン・テイタム（ボストン・セルティックス）のシグネチャーモデル「Jordan Tatum 5（テイタム5）」の「Sunrise（サンライズ）」が2026年10月15日に発売される。品番はIO1746-401、日本での価格は17,160円（税込）。ボストンの日の出に着想を得たテイタム5最初のカラーで、中国では9月24日に先に発売される。",
    date: "2026.09.10",
    thumb: "../assets/journal-121-hero.jpg?v=c687506167",
    tile: "JORDAN TATUM 5 SUNRISE"
  },
  {
    href: "120-air-jordan-1-high-og-royal.html",
    cat: "KICKS",
    title: "Air Jordan 1 High OG「Royal」10月10日に復刻 —— 黒×ロイヤルブルー、約10年ぶりの再登場",
    excerpt: "Air Jordan 1 High OGの定番カラー「Royal」（品番IQ5495-005）が2026年10月10日に発売。黒×ロイヤルブルーの配色が約10年ぶりに復刻する。Nice Kicks・Sneaker Bar Detroitが報じた。",
    date: "2026.09.10",
    thumb: "../assets/journal-120-hero.jpg?v=ce3d1933e6",
    tile: "AIR JORDAN 1 ROYAL"
  },
  {
    href: "119-air-jordan-14-blue-ferrari.html",
    cat: "KICKS",
    title: "Air Jordan 14「Blue Ferrari」2027年秋発売へ —— 2014年「Ferrari」の系譜、レッドからブルーへ",
    excerpt: "Air Jordan 14の新色「Blue Ferrari」が2027年秋に発売予定。2014年発売の初代「Ferrari」のレッドスエードをブルーに置き換えた新解釈。Sneaker News・Sneaker Bar Detroitが報じた。",
    date: "2026.09.10",
    thumb: "../assets/journal-119-hero.jpg?v=e9525e943b",
    tile: "AIR JORDAN 14 BLUE FERRARI"
  },
  {
    href: "118-air-jordan-4-fire-red-2027.html",
    cat: "KICKS",
    title: "Air Jordan 4「Fire Red」2027年秋に復刻 —— ティンカー・ハットフィールドが手がけた1989年オリジナルカラー",
    excerpt: "Air Jordan 4の代表的カラー「Fire Red」が2027年秋に復刻。1989年のオリジナルを起点に、2020年以来の再登場となる。Sneaker News・Sneaker Bar Detroitが揃って報じた。",
    date: "2026.09.10",
    thumb: "../assets/journal-118-hero.jpg?v=1bf7ba9811",
    tile: "AIR JORDAN 4 FIRE RED"
  },
  {
    href: "117-yokohama-excellence-basketball-donation.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、地元中学校7校にバスケットボールを寄贈 —— 「よこはま夢ファンド」活用、寄贈式でクリニックも",
    excerpt: "B.LEAGUE ONEの横浜エクセレンスは、横浜市神奈川区内の中学校7校にB.LEAGUE公式試合球と同等のモルテン製バスケットボールを寄贈。8月30日の寄贈式ではAGM西山達哉氏らがバスケットボールクリニックも実施した。",
    date: "2026.09.10",
    thumb: "../assets/journal-117-hero.jpg?v=d8c0546777",
    tile: "YOKOHAMA EXCELLENCE"
  },
  {
    href: "116-pistons-2026-27-preview.html",
    cat: "NBA",
    title: "ピストンズ2026-27プレビュー —— ESPNがオフシーズンを「C−」評価、争点はデュレンとの契約交渉",
    excerpt: "ESPNは10日（現地時間）、デトロイト・ピストンズの2026-27シーズンを展望する特集記事を公開し、オフシーズンの補強采配に「C−」評価。制限付きFAのジェイレン・デュレンとの契約交渉が膠着したまま、看板選手ケイド・カニンガムの相棒となる補強は実現しなかった。",
    date: "2026.09.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "PISTONS 2026-27 PREVIEW"
  },
  {
    href: "115-chiba-sky-wings-festa.html",
    cat: "JAPAN",
    title: "CHIBA SKY WINGS、地元・多古町で3x3エキシビジョン開催 —— 新宿制覇の女子チームが9月21日に凱旋",
    excerpt: "3x3プロチーム「CHIBA SKY WINGS」が9月21日、拠点の多古町民体育館で無料の3x3エキシビジョンマッチを開催。5月31日には女子チームがRBL新宿大会で優勝している。",
    date: "2026.09.09",
    thumb: "../assets/journal-115-hero.jpg?v=182272b984",
    tile: "CHIBA SKY WINGS"
  },
  {
    href: "114-jordan-tatum-5.html",
    cat: "KICKS",
    title: "テイタム5の発売日は10月15日、価格は17,160円 —— ジョーダン ブランドがジェイソン・テイタムの最新シグネチャーを発表",
    excerpt: "ジョーダン ブランドがジェイソン・テイタム（ボストン・セルティックス）のシグネチャー最新作「テイタム5」を発表した。日本では2026年10月15日にNike.comなどで発売予定、価格は17,160円（税込）。ダイナミック ユーティリティ ストラップと厚さ10mmのエア ズーム ユニットを搭載し、最初のカラーは「サンライズ」となる。",
    date: "2026.09.10",
    thumb: "../assets/journal-114-hero.jpg?v=c687506167",
    tile: "JORDAN TATUM 5"
  },
  {
    href: "113-lakers-amsler-assistant-gm.html",
    cat: "NBA",
    title: "レイカーズ、ヒートのアムスラー氏をアシスタントGMに招聘 —— 22年在籍の生え抜き、ラマダス氏と共にペリンカ体制を支える",
    excerpt: "Shams Charania（ESPN）が伝えたところによると、ロサンゼルス・レイカーズはマイアミ・ヒートでバスケットボール運営担当バイスプレジデントを務めるエリック・アムスラー氏をアシスタント・ゼネラルマネージャーとして招聘する。アムスラー氏はヒート組織に22年以上在籍し、ロハン・ラマダス氏と共にロブ・ペリンカ体制を支えることになる。",
    date: "2026.09.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "LAKERS HIRE AMSLER AS ASSISTANT GM"
  },
  {
    href: "112-cavaliers-2026-27-preview.html",
    cat: "NBA",
    title: "キャバリアーズ2026-27プレビュー —— ESPNがオフシーズンを「B」評価、鍵はハーデンとタイソン",
    excerpt: "ESPNは9日（現地時間）、クリーブランド・キャバリアーズの2026-27シーズンを展望する特集記事を公開し、オフシーズンの補強采配に「B」評価。ドノバン・ミッチェルの4年2億7300万ドル契約に潜むリスクや、フルシーズンのジェームズ・ハーデン起用が焦点として挙げられている。",
    date: "2026.09.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "CAVALIERS 2026-27 PREVIEW"
  },
  {
    href: "111-nba-2026-27-tier-preview.html",
    cat: "NBA",
    title: "ニックス・サンダー・スパーズが最上位 —— ESPN、NBA全30チームを2026-27シーズン開幕前に8段階格付け",
    excerpt: "ESPNのザック・クラム記者は9日（現地時間）、開幕まで約6週間に迫った2026-27シーズンを前に、NBA全30チームを8段階のティアに格付けする分析記事を公開した。昨季カンファレンスファイナルで勝利を挙げたニックス・サンダー・スパーズの3チームが唯一無二の最上位ティアに位置づけられている。",
    date: "2026.09.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "NBA 2026-27 TIER PREVIEW"
  },
  {
    href: "110-anta-kai-3-alchemist.html",
    cat: "KICKS",
    title: "ANTA KAI 3「Alchemist」が9月12日発売 —— カイリー・アービングの哲学を映した新色",
    excerpt: "Hypebeastによると、カイリー・アービング（ダラス・マーベリックス）のシグネチャーモデル「ANTA KAI 3」の新色「Alchemist」が、2026年9月12日に135ドル（米国価格）で発売される。深いフォレストグリーンを基調に、逆境を力に変えるというアービングの哲学を表現したデザインだという。",
    date: "2026.09.09",
    thumb: "../assets/journal-110-hero.jpg?v=b741469cc1",
    tile: "ANTA KAI 3 ALCHEMIST"
  },
  {
    href: "109-tokyo-z-avantgardey.html",
    cat: "JAPAN",
    title: "アースフレンズ東京Z、ホーム開幕戦にダンスチーム「アバンギャルディ」出演 —— 9月26日、対立川ダイス",
    excerpt: "プロバスケットボールクラブ「アースフレンズ東京Z」は、2026年9月26日（土）のホーム開幕戦（vs立川ダイス、EBARA WAVEアリーナおおた）に、バブリーダンスの振付師akane氏がプロデュースするダンスチーム「アバンギャルディ」がスペシャルゲストとして出演すると発表した。",
    date: "2026.09.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "TOKYO Z AVANTGARDEY"
  },
  {
    href: "108-kobe-storks-hata-dojo.html",
    cat: "JAPAN",
    title: "神戸ストークス、専用トレーニングルーム「葉田道場」完成 —— エレコムがプラチナパートナー契約を2027年6月まで延長",
    excerpt: "エレコム株式会社は、今シーズンからB.LEAGUE PREMIERに参入する神戸ストークスの専用トレーニングルーム「葉田道場」の完成発表会に参画したと発表。特注ベンチやパワーラックを備えた施設が完成し、プラチナパートナー契約を2027年6月30日まで延長した。",
    date: "2026.09.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "KOBE STORKS HATA DOJO"
  },
  {
    href: "107-akaishi-iwbf-wheelchair-worlds.html",
    cat: "JAPAN",
    title: "コロプラ所属・赤石竜我、車いすバスケ日本代表としてIWBF世界選手権に出場 —— カナダ・オタワで9日開幕",
    excerpt: "株式会社コロプラ所属の車いすバスケットボール選手・赤石竜我が、2026年9月9日からカナダ・オタワで開催される「2026 IWBF世界選手権大会」に日本代表として出場する。東京2020パラリンピック銀メダリストで、現在はドイツ・ブンデスリーガのKoeln 99ersに所属している。",
    date: "2026.09.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "AKAISHI IWBF WHEELCHAIR WORLDS"
  },
  {
    href: "106-air-jordan-7-tennis-day.html",
    cat: "KICKS",
    title: "Air Jordan 7「Tennis Day」が9月9日発売 —— 価格215ドル",
    excerpt: "Nice Kicksによると、Air Jordan 7の新色「Tennis Day」が9月9日、Nike.comおよび一部取扱店で発売される。価格は215ドル(米国価格)、品番はIV6508-030。",
    date: "2026.09.09",
    thumb: "../assets/journal-106-hero.jpg?v=8e43c59108",
    tile: "AIR JORDAN 7 TENNIS DAY"
  },
  {
    href: "105-lakers-phil-jackson-statue.html",
    cat: "NBA",
    title: "レイカーズ、フィル・ジャクソン氏の銅像建立へ —— スタープラザに9人目、2027年4月に除幕式",
    excerpt: "ロサンゼルス・レイカーズは、通算5度の優勝に導いた名将フィル・ジャクソン氏を称える銅像を建立すると発表した。除幕式は2027年4月9日、本拠地クリプト・ドットコム・アリーナ外のスタープラザで行われ、ジャクソン氏はカリーム・アブドゥル＝ジャバーやコービー・ブライアントらに続く9人目となる。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "LAKERS PHIL JACKSON STATUE"
  },
  {
    href: "104-wizards-nichols-vp-promotion.html",
    cat: "NBA",
    title: "ウィザーズ、ニコルズ氏がバスケットボール運営担当VPに昇格 —— Gリーグ球団GMからフロント入り",
    excerpt: "Michael Scotto（HoopsHype）が伝えたところによると、ワシントン・ウィザーズはアンバー・ニコルズ氏をバスケットボール運営・パーソネル部門のバイスプレジデントに昇格させた。ニコルズ氏はアマチュア評価部門ディレクターを経て、以前はGリーグ傘下のキャピタル・シティ・ゴーゴーでゼネラルマネージャーを務めていた。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "WIZARDS NICHOLS VP PROMOTION"
  },
  {
    href: "103-hawks-front-office-reshuffle.html",
    cat: "NBA",
    title: "ホークス、フロント刷新 —— ディンウィディーがEVPに昇格、記者ボンテンプス氏も参画",
    excerpt: "Michael Scotto（HoopsHype）が伝えたところによると、アトランタ・ホークスはピーター・ディンウィディー氏をバスケットボール運営部門のエグゼクティブ・バイスプレジデントに昇格。ESPNのティム・ボンテンプス記者もストラテジック・アドバイザーとして加わり、マクスウェル・カプチャック氏もキャップ戦略・プレーヤーパーソネル部門ディレクターに昇格した。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "HAWKS FRONT OFFICE RESHUFFLE"
  },
  {
    href: "102-nike-ja-4-jaws.html",
    cat: "KICKS",
    title: "Nike Ja 4「Jaws」が9月18日発売 —— サメをテーマにした新色",
    excerpt: "Sneaker Newsは、ジャ・モラントのシグネチャーモデル「Nike Ja 4」の新色「Jaws」が9月18日に発売されると報じた。品番はJA9742-400。サメをモチーフにした「Deep Water」カラーで、Sneaker Bar Detroitも公式画像を紹介している。",
    date: "2026.09.08",
    thumb: "../assets/journal-102-hero.jpg?v=46019737b6",
    tile: "NIKE JA 4 JAWS"
  },
  {
    href: "101-nike-book-2-halloween.html",
    cat: "KICKS",
    title: "Nike Book 2に新色「Halloween」—— ブッカー恒例のハロウィン企画、今年はオオギー・ブギーがテーマに",
    excerpt: "Sneaker Newsは、デビン・ブッカーのシグネチャーモデル「Nike Book 2」の新色「Halloween」を公式画像で紹介。品番はIO7942-001で、Sneaker Bar Detroitによると今年10月の発売が見込まれている。テーマは「ナイトメア・ビフォア・クリスマス」の悪役オオギー・ブギー。",
    date: "2026.09.08",
    thumb: "../assets/journal-101-hero.jpg?v=4bf2e1aec6",
    tile: "NIKE BOOK 2 HALLOWEEN"
  },
  {
    href: "100-helpfeel-kyoto-hannaryz.html",
    cat: "JAPAN",
    title: "Helpfeel、京都ハンナリーズと2年連続のゴールドパートナー契約 —— AIナレッジ検索で公式ヘルプサイトを継続支援",
    excerpt: "京都府京都市の株式会社Helpfeelは9月8日、B.LEAGUE PREMIER西地区の京都ハンナリーズと2026-27シーズンのゴールドパートナー契約を締結したと発表。AIナレッジ検索システム「Helpfeel」を公式ヘルプサイトとして2年連続で提供する。",
    date: "2026.09.08",
    thumb: "../assets/journal-100-hero.jpg?v=5dd40a70d1",
    tile: "HELPFEEL KYOTO HANNARYZ"
  },
  {
    href: "099-pelicans-grizzlies-hawkins-trade.html",
    cat: "NBA",
    title: "ジョーダン・ホーキンス、グリズリーズへトレード成立 —— ペリカンズ、AJ・ジョンソンとタジ・ギブソンを獲得",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ニューオーリンズ・ペリカンズは、ジョーダン・ホーキンスとマイカ・ピービー、将来の2巡目指名権1つとそのスワップ権をメンフィス・グリズリーズへトレード。見返りにAJ・ジョンソンとタジ・ギブソンを獲得した。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "PELICANS GRIZZLIES HAWKINS TRADE"
  },
  {
    href: "098-air-jordan-1-low-element-gtx-cream-ii.html",
    cat: "KICKS",
    title: "Air Jordan 1 Low Element GTXに新色「Cream II」—— GORE-TEX仕様で秋冬向けに",
    excerpt: "Hypebeastは、Air Jordan 1 Low Element GTXの新色「Cream II」を紹介。SKUはFV4227-202、価格は205ドル(米国価格)で2026年内の発売が予定されている。GORE-TEXの防水ライニングを備え、秋冬シーズン向けの一足に仕上がっている。",
    date: "2026.09.08",
    thumb: "../assets/journal-098-hero.jpg?v=dac7ef199e",
    tile: "AIR JORDAN 1 LOW ELEMENT GTX CREAM II"
  },
  {
    href: "097-76ers-flyers-new-arena.html",
    cat: "NBA",
    title: "スペクトラム跡地に新アリーナ —— 76ers・フライヤーズ、2030年開業へ始動",
    excerpt: "フィラデルフィア・76ersとフィラデルフィア・フライヤーズは9月8日(現地時間)、南フィラデルフィアの旧スペクトラム跡地に建設する新アリーナのレンダリングを公開。市史上最大の完全民間資金プロジェクトとされ、フィラデルフィアの新WNBA拡張チームが開幕する2030年シーズン前の開業を目指す。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "76ERS FLYERS NEW ARENA"
  },
  {
    href: "096-nba-injury-returns-2026-27.html",
    cat: "NBA",
    title: "ハリバートン、アービングら故障組が続々復帰へ —— ESPN、2026-27シーズン開幕前チェック",
    excerpt: "ESPNは9月8日(現地時間)、故障で前シーズンを大きく欠場したタイリース・ハリバートン、カイリー・アービングら主力選手の2026-27シーズンでの復帰状況を展望する特集記事を公開。ハリバートンはアキレス腱断裂から15カ月ぶり、アービングは膝の前十字靭帯断裂から19カ月ぶりの実戦復帰になるとしている。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "NBA INJURY RETURNS 2026-27"
  },
  {
    href: "095-bulls-2026-27-season-preview.html",
    cat: "NBA",
    title: "新人ウィルソンが新たな顔に —— ESPN、シカゴ・ブルズの2026-27シーズンを展望",
    excerpt: "ESPNは9月8日(現地時間)、前シーズン4年連続でプレーオフ進出を逃したシカゴ・ブルズの2026-27シーズンを展望する特集記事を公開。新GMブライソン・グラハム氏と新HCティアゴ・スプリッター氏の下、ドラフト4位指名のケイレブ・ウィルソンを新たな顔に据えた再建プランの行方を分析している。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "BULLS 2026-27 PREVIEW"
  },
  {
    href: "094-kuas-kyoto-hannaryz.html",
    cat: "JAPAN",
    title: "京都先端科学大学、京都ハンナリーズの冠試合を初開催 —— 11月13日、茨城ロボッツ戦",
    excerpt: "京都先端科学大学は、B.LEAGUE PREMIER・京都ハンナリーズが11月13日に開催するホームゲームで、大学主催として初の冠試合「京都先端科学大学Presents 京都ハンナリーズ VS 茨城ロボッツ」を実施すると発表した。",
    date: "2026.09.08",
    thumb: "../assets/journal-094-hero.jpg?v=0f8dc78ef3",
    tile: "KUAS × KYOTO HANNARYZ"
  },
  {
    href: "093-lebron-23-white-team-red.html",
    cat: "KICKS",
    title: "レブロン最新シグネチャー「LEBRON 23」新色「White & Team Red」登場",
    excerpt: "FLY BASKETBALL CULTURE MAGAZINEが、レブロン・ジェームズの最新シグネチャーモデル「LEBRON 23 EP」新色「White & Team Red」を紹介。フルレングスのZoomXフォームとカーボンファイバー製プレートで軽量性と反発力を高めた一足。",
    date: "2026.09.08",
    thumb: "../assets/journal-093-hero.jpg?v=db05fb7f5a",
    tile: "LEBRON 23 WHITE TEAM RED"
  },
  {
    href: "092-revision-utsunomiya-brex.html",
    cat: "JAPAN",
    title: "株式会社Revision、宇都宮ブレックスのオフィシャルスポンサーに就任 —— マスコット「ブレッキー」にロゴ掲出",
    excerpt: "栃木県宇都宮市のWeb制作会社・株式会社Revisionは、B.LEAGUE（Bプレミア）の宇都宮ブレックスと2026-27シーズンのオフィシャルスポンサー契約を締結したと発表した。ユニフォームパンツ広告やマスコット「ブレッキー」にロゴを掲出する。",
    date: "2026.09.08",
    thumb: "../assets/journal-092-hero.jpg?v=38e51d2c68",
    tile: "REVISION × UTSUNOMIYA BREX"
  },
  {
    href: "091-shinjuku-givers-3x3-playoffs.html",
    cat: "JAPAN",
    title: "新宿givers、初参戦シーズンでPLAYOFFS進出決定 —— 3x3.EXE PREMIER女子、10月3・4日に大阪へ",
    excerpt: "女子3人制バスケットボールチーム「新宿givers(SHINJUKU GIVERS.EXE)」は、3x3.EXE PREMIER初参戦の2026シーズンで最終Round.8を残して国内年間3位以内を確定し、10月3日・4日に大阪で行われるPLAYOFFS出場権を獲得した。",
    date: "2026.09.08",
    thumb: "../assets/journal-091-hero.jpg?v=1db97456a3",
    tile: "SHINJUKU GIVERS × PLAYOFFS"
  },
  {
    href: "090-air-jordan-12-idols-become-rivals.html",
    cat: "KICKS",
    title: "新色「Idols Become Rivals」—— Air Jordan 12が9月12日発売",
    excerpt: "ジョーダン ブランドは、新色「Air Jordan 12 \"Idols Become Rivals\"」(品番: CT8013-103)を2026年9月12日にSNKRSほかで発売する。米スニーカーメディアNice Kicksが発売情報を伝えた。",
    date: "2026.09.07",
    thumb: "../assets/journal-090-hero.jpg?v=25ec1dcda0",
    tile: "AIR JORDAN 12 IDOLS BECOME RIVALS"
  },
  {
    href: "089-bucks-2026-27-season-preview.html",
    cat: "NBA",
    title: "バックス 2026-27シーズン展望 —— ヤニス放出後の再建、タイラー・ハーローと新HCジェンキンス体制の焦点",
    excerpt: "ミルウォーキー・バックスは6月にヤニス・アデトクンボをマイアミ・ヒートへ放出し、2026-27シーズンは再建の1年目になる。見返りに獲得したタイラー・ハーローらの起用と、新HCテイラー・ジェンキンス体制での若手育成が焦点。ESPNが9月7日(現地時間)に公開した展望特集をもとにまとめた。",
    date: "2026.09.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "MILWAUKEE BUCKS × 2026-27"
  },
  {
    href: "088-nike-air-force-1-gore-tex-baroque-brown.html",
    cat: "KICKS",
    title: "雨と雪の日にも履ける一足に —— Nike Air Force 1 Low GORE-TEX「Baroque Brown」発表",
    excerpt: "ナイキは「Air Force 1 Low」を冬仕様にアップデートした新色「GORE-TEX Baroque Brown」を発表した。防水素材GORE-TEXとVibram製アウトソールを組み合わせ、悪天候下でのグリップ力を高めている。品番HV5953-200、価格150ドル(米国価格)、発売時期は2026年内の見込み。",
    date: "2026.09.07",
    thumb: "../assets/journal-088-hero.jpg?v=08b3ea74f2",
    tile: "NIKE AIR FORCE 1 GORE-TEX"
  },
  {
    href: "087-fc-barcelona-nike-kobe-3-protro.html",
    cat: "KICKS",
    title: "クラブエンブレムを刻んだコービーモデル —— Nike Kobe 3 Low Protro「Electro Purple」9月4日発売",
    excerpt: "ナイキとFCバルセロナのコラボレーション「Kobe 3 Low Protro」新色「Electro Purple」が2026年9月4日に発売された。ブラックにエレクトロパープルとメタリックゴールドを配し、クラブエンブレムをあしらったディテールが特徴。品番IO6257-001、価格200ドル(米国価格)。",
    date: "2026.09.06",
    thumb: "../assets/journal-087-hero.jpg?v=c11add1952",
    tile: "NIKE KOBE 3 LOW PROTRO"
  },
  {
    href: "086-air-jordan-9-space-jam.html",
    cat: "KICKS",
    title: "『スペース・ジャム』30周年復刻 —— Air Jordan 9 OG「Space Jam」9月19日発売",
    excerpt: "ジョーダン ブランドは、映画『スペース・ジャム』公開30周年を記念し「Air Jordan 9 OG \"Space Jam\"」(品番: IX6179-100)を2026年9月19日に発売する。マイケル・ジョーダン時代を象徴するオリジナルカラーの復刻。",
    date: "2026.09.05",
    thumb: "../assets/journal-086-hero.jpg?v=9ac8ea871e",
    tile: "AIR JORDAN 9 SPACE JAM"
  },
  {
    href: "085-nike-sabrina-4-the-switch.html",
    cat: "KICKS",
    title: "サブリナ・イオネスクの4代目シグネチャー —— Nike Sabrina 4「The Switch」本日発売",
    excerpt: "ナイキは2026年9月5日、WNBAニューヨーク・リバティのサブリナ・イオネスクによるシグネチャーシューズ最新作「Nike Sabrina 4」の新色「The Switch」を発売した。Nike.comおよび一部取扱店で取り扱い、価格は$135(米国価格)。",
    date: "2026.09.05",
    thumb: "../assets/journal-085-hero.jpg?v=fb2765be55",
    tile: "NIKE SABRINA 4 THE SWITCH"
  },
  {
    href: "084-air-jordan-4-tour-yellow.html",
    cat: "KICKS",
    title: "20年ぶりの復刻 —— Air Jordan 4「Tour Yellow」9月5日発売",
    excerpt: "Air Jordan 4「Tour Yellow」が2026年9月5日に復刻発売。2006年の初リリースから20年、ジョーダン ブランドの\"LS\"時代を象徴するカラーが戻る。WearTestersはパフォーマンスレビューも公開した。",
    date: "2026.09.05",
    thumb: "../assets/journal-084-hero.jpg?v=2a4c5937c3",
    tile: "AIR JORDAN 4 TOUR YELLOW"
  },
  {
    href: "083-cdg-air-jordan-11.html",
    cat: "KICKS",
    title: "川久保玲がAir Jordan 11を\"ドレスシューズ\"に —— COMME des GARÇONS HOMME PLUSコラボ、9月5日発売",
    excerpt: "COMME des GARÇONS HOMME PLUSとJordan Brandによるコラボレーション「Air Jordan 11」が2026年9月5日発売。ブラックとホワイトの2色展開、価格358ドル。1995年にティンカー・ハットフィールドが手がけた名作を、川久保玲がミニマルなドレスシューズへと再構築した。",
    date: "2026.09.05",
    thumb: "../assets/journal-083-hero.jpg?v=ae4d996772",
    tile: "CDG × AIR JORDAN 11"
  },
  {
    href: "078-gunma-crane-thunders-slogan.html",
    cat: "JAPAN",
    title: "2026-27シーズンスローガンは「BREAK THE ORDER」 —— 群馬クレインサンダーズ、B.PREMIER初年度へ",
    excerpt: "B.LEAGUEのB.PREMIER所属クラブ「群馬クレインサンダーズ」は9月5日、2026-27シーズンのスローガンを「BREAK THE ORDER」に決定したと発表した。ヘッドコーチはカイル・ミリング氏、キャプテンは辻直人選手が3年目でそれぞれ続投し、新加入のスタンリー・ジョンソン選手、鶴巻啓太選手を加えた12名体制でB.PREMIER初代チャンピオンを目指す。",
    date: "2026.09.05",
    thumb: "../assets/journal-078-hero.jpg?v=bf9e87c8cb",
    tile: "GUNMA CRANE THUNDERS × 2026-27"
  },
  {
    href: "079-engelbert-wnba-retire.html",
    cat: "NBA",
    title: "WNBAコミッショナーのキャシー・エンゲルバートが12月31日付で退任へ —— 後任探しも始まる",
    excerpt: "WNBAコミッショナーのキャシー・エンゲルバート氏(61)が、12月31日付で退任することが決まった。ESPNのシャムズ・チャラニア記者らが9月4日(現地時間)に複数の関係者の話として報じたもので、後任のコミッショナー探しは早ければ今月中にも始まるという。",
    date: "2026.09.04",
    thumb: "../assets/journal-079-hero.jpg?v=15c4383426",
    tile: "WNBA COMMISSIONER"
  },
  {
    href: "082-nba-rivalries-2026-27.html",
    cat: "NBA",
    title: "セルティックスvs76ers、\"史上最多\"のライバル対決が再燃 —— ESPNが2026-27シーズン注目の10大リバルリーを選出",
    excerpt: "ESPNのザック・クラム記者は9月4日(現地時間)、2026-27シーズンを前にNBAの注目リバルリー・トップ10を選出する特集記事を公開。史上最多の通算23度のプレーオフ対決があるセルティックスvs76ersを1位とし、サンダーvsスパーズ、ドンチッチ移籍後のマーベリックスvsレイカーズなども上位に選出している。",
    date: "2026.09.04",
    thumb: "../assets/journal-082-hero.jpg?v=47df9d06e8",
    tile: "NBA RIVALRIES 2026-27"
  },
  {
    href: "081-magic-2026-27-season-preview.html",
    cat: "NBA",
    title: "新HCスウィーニーで巻き返しなるか —— ESPN、オーランド・マジックの2026-27シーズンを展望",
    excerpt: "ESPNは9月4日(現地時間)、オーランド・マジックの2026-27シーズンを展望する特集記事を公開。前シーズン限りでジェイマール・モズレー氏を解任しショーン・スウィーニー新ヘッドコーチを招へいしたほか、ニコラ・ヴチェビッチを1年390万ドルで再獲得したと伝え、パオロ・バンケロ、フランツ・ワグナーらの健康状態とディフェンス改善が浮上の鍵になるとしている。",
    date: "2026.09.04",
    thumb: "../assets/journal-081-hero.jpg?v=dcd7fda02a",
    tile: "ORLANDO MAGIC × 2026-27"
  },
  {
    href: "077-ben-simmons-kings.html",
    cat: "NBA",
    title: "1年半ぶりの現役復帰 —— ベン・シモンズ、キングスと1年350万ドルで契約合意",
    excerpt: "元NBA新人王のベン・シモンズ(30)が、サクラメント・キングスと1年350万ドルの契約で合意したと、ESPNのシャムズ・チャラニア記者らが9月4日(現地時間)、複数の関係者の話として報じた。昨シーズンは背中と脚の故障で全休しており、約1年半ぶりの現役復帰となる。",
    date: "2026.09.04",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "BEN SIMMONS × KINGS"
  },
  {
    href: "076-kings-u15-okinawa-qualifier.html",
    cat: "JAPAN",
    title: "琉球ゴールデンキングスの「キングスU15」、沖縄県予選が9月5日開幕 —— 全国大会出場権懸け熱戦",
    excerpt: "沖縄バスケットボール株式会社は9月4日、運営するB.LEAGUEクラブ「琉球ゴールデンキングス」の育成組織「キングスU15」が、9月5日開幕の「2026年度 第15回U15クラブバスケットボールゲームス沖縄県予選会」に出場すると発表した。",
    date: "2026.09.04",
    thumb: "../assets/journal-076-hero.jpg?v=9403ebb720",
    tile: "KINGS U15 × OKINAWA QUALIFIER"
  },
  {
    href: "075-eneos-sunflowers-fiba-worldcup.html",
    cat: "JAPAN",
    title: "ENEOSサンフラワーズから女子日本代表に4名選出 —— 田中こころ・今野紀花ら、FIBA女子W杯2026へ",
    excerpt: "ENEOS株式会社は9月3日、実業団の女子バスケットボールクラブ「ENEOSサンフラワーズ」から、9月4日開幕の「FIBA女子バスケットボールワールドカップ2026」女子日本代表に、田中こころ・今野紀花の両選手とスタッフ2名の計4名が選出されたと発表した。",
    date: "2026.09.03",
    thumb: "../assets/journal-075-hero.jpg?v=20b850a783",
    tile: "ENEOS SUNFLOWERS × TEAM JAPAN"
  },
  {
    href: "074-amen-thompson-rockets-extension.html",
    cat: "NBA",
    title: "アメン・トンプソン、ロケッツと5年2億800万ドルで契約延長 —— 10%のトレードキッカー付き",
    excerpt: "アメン・トンプソン(23)がヒューストン・ロケッツと5年総額2億800万ドルのルーキー契約延長で合意したと、ESPNが9月3日(現地時間)、複数の関係者の話として報じた。10%のトレードキッカーが付帯し、キャップに占める割合は2024年のアルペレン・シェングンの延長契約と同水準だという。",
    date: "2026.09.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "AMEN THOMPSON × ROCKETS"
  },
  {
    href: "080-nba-free-agency-grades-2026.html",
    cat: "NBA",
    title: "契約延長のトンプソンに\"Win-Win\"評価、デローザンはナゲッツへ —— ESPNが2026年NBA自由契約を採点",
    excerpt: "ESPNのザック・クラム記者は9月3日(現地時間)、2026年NBAオフシーズンの主要なFA契約・契約延長を採点する分析記事を公開。ヒューストン・ロケッツとアメン・トンプソンの5年2億800万ドル契約延長を「双方にとって理にかなった合意」と評価したほか、デマー・デローザンのナゲッツ入り、ジョナサン・クミンガのティンバーウルブズ移籍にも言及している。",
    date: "2026.09.03",
    thumb: "../assets/journal-080-hero.jpg?v=043ee52746",
    tile: "NBA FREE AGENCY GRADES"
  },
  {
    href: "072-nba-docomo-kawamura-ambassador.html",
    cat: "JAPAN",
    title: "「NBA docomo」新アンバサダーに河村勇輝 —— NBA2026-27シーズンパス、本日発売開始",
    excerpt: "NTTドコモは9月3日、映像配信サービス「NBA docomo」の新アンバサダーに河村勇輝選手が就任したと発表。同日からNBA2026-27シーズンを通じて視聴できるシーズンパス(16,500円)の販売も始まった。",
    date: "2026.09.03",
    thumb: "../assets/journal-072-hero.jpg?v=1e21d034f4",
    tile: "NBA docomo × KAWAMURA"
  },
  {
    href: "073-mills-parker-asvel.html",
    cat: "NBA",
    title: "元スパーズの名コンビ再結成 —— パティ・ミルズ、恩師トニー・パーカー率いるASVELへ移籍",
    excerpt: "元NBA選手のパティ・ミルズが、トニー・パーカーがヘッドコーチを務めるフランス1部ASVELヴィルールバンヌと1年契約を結び加入したと、ESPNが9月2日(現地時間)報じた。スパーズで9年間チームメートだった2人が「勝つ文化」の再現を目指す。",
    date: "2026.09.02",
    thumb: "../assets/journal-073-hero.jpg?v=6c1052d90a",
    tile: "MILLS × PARKER × ASVEL"
  },
  {
    href: "071-westbrook-project-b.html",
    cat: "NBA",
    title: "ウェストブルック、新リーグ「Project B」の共同創業者に —— 2027年1月開幕予定の男女リーグで最高戦略責任者",
    excerpt: "ラッセル・ウェストブルックが、2027年1月開幕予定の男女新リーグ「Project B」に共同創業者兼チーフ・ストラテジー・オフィサーとして参加し、取締役会にも加わった。引退を表明したばかりの元MVPの新たな役割を、ESPNが9月2日(現地時間)に報じた。",
    date: "2026.09.02",
    thumb: "../assets/journal-071-hero.jpg?v=b148889f2a",
    tile: "WESTBROOK × PROJECT B"
  },
  {
    href: "070-beril-yokohama-excellence.html",
    cat: "JAPAN",
    title: "ライバー事務所Beril、横浜エクセレンスとオフィシャルスポンサー契約 —— 2026-27シーズンから冠試合開催",
    excerpt: "ライバーマネジメント事務所「Beril」を運営するlapaz株式会社は9月2日、B.LEAGUEのプロバスケットボールクラブ「横浜エクセレンス」と2026-27シーズンのオフィシャルスポンサー契約を締結したと発表した。ホームゲームでのBeril冠試合も予定する。",
    date: "2026.09.02",
    thumb: "../assets/journal-070-hero.jpg?v=57a58148c1",
    tile: "BERIL × YOKOHAMA EXCELLENCE"
  },
  {
    href: "069-meitetsu-fe-nagoya-court.html",
    cat: "JAPAN",
    title: "名駅に一夜限りのバスケコート出現 —— 名鉄×FE名古屋、包括連携協定を締結し9月15日にイベント開催",
    excerpt: "名古屋鉄道は9月2日、B.LEAGUEのファイティングイーグルス名古屋と包括連携協定を締結、9月15日に名古屋駅前「Meieki Parklet」で一夜限りのバスケットボールイベントを共同開催すると発表した。期間中は「ナナちゃん」もFE名古屋のユニフォーム姿になる。",
    date: "2026.09.02",
    thumb: "../assets/journal-069-hero.jpg?v=ec1e054fcc",
    tile: "MEITETSU × FE NAGOYA"
  },
  {
    href: "068-albirex-recruit-strategy-lab.html",
    cat: "JAPAN",
    title: "新潟アルビレックスBB、採用戦略研究所とオフィシャルパートナー契約 —— 「新潟社長図鑑」運営元が2026-27シーズンから参入",
    excerpt: "株式会社採用戦略研究所は9月2日、B.LEAGUE ONE・新潟アルビレックスBBと2026-27シーズンよりオフィシャルパートナー契約を締結したと発表した。新潟県内の経営者を取材するメディア「新潟社長図鑑」の運営元が、地域の採用課題解決へ連携する。",
    date: "2026.09.02",
    thumb: "../assets/journal-068-hero.jpg?v=481c5b6b36",
    tile: "ALBIREX BB × RS-LAB"
  },
  {
    href: "067-tacko-fall-76ers-camp.html",
    cat: "NBA",
    title: "ターコ・フォール、76ersとキャンプ契約 —— ネルソン・ジュニア、セイント・トーマスも同時合意",
    excerpt: "76ersは9月1日、身長231cm(7フィート6インチ)のセンター、ターコ・フォールとエキシビット10契約(キャンプ契約)で合意したと発表。ジェイミア・ネルソン・ジュニア、セイント・トーマスとも同時契約し、3人は今月開催のキャンプでロースター入りを争う。",
    date: "2026.09.01",
    thumb: "../assets/journal-067-hero.jpg?v=cae7559494",
    tile: "TACKO FALL × 76ers"
  },
  {
    href: "066-joshu-rydeen-upset-supplier.html",
    cat: "JAPAN",
    title: "JOSHU RYDEEN、株式会社アップセットとオフィシャルサプライヤー契約締結 —— 群馬発・女子3x3が新シーズンへ体制強化",
    excerpt: "群馬県太田市を拠点とする女子3x3プロバスケットボールチーム「JOSHU RYDEEN」は9月1日、スポーツメーカーの株式会社アップセットとオフィシャルサプライヤー契約を締結したと発表した。",
    date: "2026.09.01",
    thumb: "../assets/journal-066-hero.jpg?v=766419560a",
    tile: "JOSHU RYDEEN × UPSET"
  },
  {
    href: "065-uenohara-sunrise-jumpshot3x3.html",
    cat: "JAPAN",
    title: "世界一に続き、国際舞台で準優勝 —— 上野原サンライズ女子、シンガポール「Jumpshot 3x3」で1st Runner Up",
    excerpt: "ジェリービーンズグループが提携する3x3チーム「上野原サンライズ」の女子チームは、シンガポールで開催された国際大会「Jumpshot 3x3 Season 3: Play Bigger」女子の部で準優勝したと9月1日発表した。",
    date: "2026.09.01",
    thumb: "../assets/journal-065-hero.jpg?v=4b0d98b4ce",
    tile: "UENOHARA SUNRISE"
  },
  {
    href: "064-unext-bleague-streaming.html",
    cat: "NBA",
    title: "U-NEXT、B.LEAGUE新体制の全試合を見放題配信 —— B.PREMIER・B.ONE、9月22日開幕",
    excerpt: "U-NEXTは9月1日、9月22日開幕の「りそなグループ B.LEAGUE 2026-27 SEASON」でB.PREMIER最大803試合に加え、新たにB.ONE最大798試合も見放題でライブ配信すると発表した。追加課金なしで全試合が視聴できる。",
    date: "2026.09.01",
    thumb: "../assets/journal-064-hero.jpg?v=bf4c646ff3",
    tile: "U-NEXT × B.LEAGUE"
  },
  {
    href: "063-bambitious-basketball-day.html",
    cat: "JAPAN",
    title: "バンビシャス奈良「バスケの日2026 in 奈良市」開催 —— 奈良市長も参加、約8時間バスケ三昧の一日に",
    excerpt: "バンビシャス奈良は8月29日、老若男女が一日バスケを楽しむ「バスケの日2026 in 奈良市」をロートアリーナ奈良で開催した。仲川げん奈良市長も参加し、フリースロー大会や中学生以上の8分流し試合など多彩な企画で朝から夕方まで盛り上がった。",
    date: "2026.09.01",
    thumb: "../assets/journal-063-hero.jpg?v=08ac607af4",
    tile: "BASKET DAY 2026"
  },
  {
    href: "062-zamst-kawamura-sponsorship.html",
    cat: "JAPAN",
    title: "ザムスト、河村勇輝選手とスポンサーシップ契約を更新 —— 2021年から続く4年目のパートナーシップ",
    excerpt: "日本シグマックスは9月1日、サポート・ケア製品ブランド「ZAMST」と河村勇輝選手のスポンサーシップ契約を更新したと発表した。大学生だった2021年からの関係が、米国挑戦を続ける現在も継続する。",
    date: "2026.09.01",
    thumb: "../assets/journal-062-hero.jpg?v=f948084902",
    tile: "ZAMST × KAWAMURA"
  },
  {
    href: "061-hamada-sakai-ambassador.html",
    cat: "JAPAN",
    title: "全中制覇の濵田誉（四日市メリノール学院）、堺整骨院とアンバサダー契約 —— 熊本地震復興応援大会も9月開催",
    excerpt: "堺整骨院グループは9月1日、全国中学校バスケットボール大会を制した濵田誉選手（四日市メリノール学院中学校3年）とアンバサダー契約を締結したと発表した。あわせて熊本地震復興応援「堺整骨院杯」を9月5・6日に熊本県で開催する。",
    date: "2026.09.01",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "HAMADA HOMARE"
  },
  {
    href: "060-his-bleague-partnership.html",
    cat: "NBA",
    title: "HIS、B.LEAGUEと「グローカル・パートナー」契約 —— 公式ツアー「B.旅」独占展開へ",
    excerpt: "HISは8月31日、B.LEAGUEとグローカル・パートナー契約を締結したと発表した。全クラブ対象の公式観戦ツアー「B.旅」の企画・販売独占権を取得し、アジア中心の海外プロモーションやインバウンド送客も進める。",
    date: "2026.08.31",
    thumb: "../assets/journal-060-hero.jpg?v=697183c7dc",
    tile: "HIS x B.LEAGUE"
  },
  {
    href: "059-streetball-courtmap.html",
    cat: "JAPAN",
    title: "首都圏189件、コートマップで一望 ——「バスケしようよ！」が新機能公開",
    excerpt: "草バスケコミュニティサービス「バスケしようよ！」を運営する株式会社Walkersは8月31日、首都圏のストリートバスケットボールコート189件を地図から探せる新機能「コートマップ」を公開したと発表した。東京110件・千葉29件・埼玉28件・神奈川22件を掲載し、会員登録不要・無料で利用できる。",
    date: "2026.08.31",
    thumb: "../assets/journal-059-hero.jpg?v=289e8c3d10",
    tile: "COURT MAP"
  },
  {
    href: "058-bambitious-basketball-festival.html",
    cat: "JAPAN",
    title: "王寺町とバンビシャス奈良、バスケットボールフェスティバル開催 —— シュート大会や3x3で子どもたちと交流",
    excerpt: "B.LEAGUE・バンビシャス奈良は8月23日、奈良県王寺町のいずみアリーナで「バスケットボールフェスティバル」を実施したと発表した。シュート大会やバスケットボール教室、3x3の試合、抽選会など多彩な企画で、選手と多くの子どもたちが交流した。",
    date: "2026.08.31",
    thumb: "../assets/journal-058-hero.jpg?v=5c3758b80a",
    tile: "BAMBITIOUS"
  },
  {
    href: "057-converse-2faced.html",
    cat: "KICKS",
    title: "コンバース「2FACED（2フェイスド）」MID・LOW・LE LOWの価格と発売日 —— 名作「COURT STAR」が令和に蘇る",
    excerpt: "コンバースのバスケットボールシューズ「2FACED（2フェイスド）」は、80年代のアーカイブモデル「COURT STAR」を現代技術でアップデートした新作。MID（16,500円）・LOW（15,950円）・LE LOW（16,500円）の3モデルで、2026年9月11日にGALLERY・2 渋谷店とKinetics HARAJUKUで先行発売、9月から全国発売される。",
    date: "2026.08.31",
    thumb: "../assets/journal-057-hero.jpg?v=688ff5771e",
    tile: "2FACED"
  },
  {
    href: "056-josh-green-jazz-trade.html",
    cat: "NBA",
    title: "ジョシュ・グリーン、ジャズへトレード成立 —— ティンバーウルブズ、クミンガ契約完了へサラリー捻出",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ミネソタ・ティンバーウルブズはウィングのジョシュ・グリーンと現金をユタ・ジャズへトレードし、見返りにコーディ・ウィリアムズとジョン・コンチャーを獲得。グリーンの1470万ドルの給与を放出し、ジョナサン・クミンガとの2年1240万ドル契約を完了させるための資金繰りだった。",
    date: "2026.08.29",
    thumb: "../assets/journal-056-hero.jpg?v=c2b5f8170e",
    tile: "JOSH GREEN"
  },
  {
    href: "055-rimtown-basketball-school.html",
    cat: "JAPAN",
    title: "在籍200名突破 —— バスケットボールスクール「Rimtown」、元Bリーガー・齊藤洋介が指導",
    excerpt: "東京・神奈川・埼玉でバスケットボールスクール「Rimtown」を運営する株式会社neveleは、2026年8月にスクール在籍者数が200名を突破したと発表した。元Bリーガー・元3x3日本代表の齊藤洋介がメインコーチを務め、スキルだけでなく試合での判断力を養う指導を行っている。",
    date: "2026.08.28",
    thumb: "../assets/journal-055-hero.jpg?v=5e65e1d54c",
    tile: "RIMTOWN"
  },
  {
    href: "054-crane-thunders-afterschool.html",
    cat: "JAPAN",
    title: "夏休み、体育館に響いた歓声 —— 群馬クレインサンダーズ、県内7市町の放課後児童クラブを訪問",
    excerpt: "群馬クレインサンダーズは、群馬県が実施する「プロスポーツチーム等と連携したこどもの居場所づくり・体験創出モデル事業」の一環として、県内7市町の放課後児童クラブを訪問し、子どもたちを対象としたバスケットボール体験を実施したと8月28日発表した。基礎練習に加えゲーム性を取り入れたメニューを通じ、体を動かす楽しさや仲間と協力する大切さを伝えた。",
    date: "2026.08.28",
    thumb: "../assets/journal-054-hero.jpg?v=589cb87efa",
    tile: "CRANE THUNDERS"
  },
  {
    href: "053-yoneda-u18-tryout.html",
    cat: "JAPAN",
    title: "奈良から次世代の舞台へ —— バンビシャス奈良U18・米田時生、B.LEAGUE U18 TRYOUT CAMP 2026に初選出",
    excerpt: "バンビシャス奈良U18に所属する米田時生選手（SG、175cm）が、B.LEAGUEユース育成プロジェクトの一環「B.LEAGUE U18 TRYOUT CAMP 2026」に初選出されたと、同クラブが8月27日発表した。キャンプは9月5・6日に駒沢オリンピック公園総合運動場 屋内球技場で行われる。",
    date: "2026.08.27",
    thumb: "../assets/journal-053-hero.jpg?v=67c3f29323",
    tile: "YONEDA"
  },
  {
    href: "052-lowry-raptors-retired-number.html",
    cat: "NBA",
    title: "フランチャイズ史上2人目の栄誉 —— ラプターズ、カイル・ラウリーの背番号7永久欠番を発表",
    excerpt: "トロント・ラプターズは、カイル・ラウリーの背番号7を永久欠番にすると8月27日発表した。2026年1月10日のフィラデルフィア・セブンティシクサーズ戦後にセレモニーを行い、バンス・カーターに次ぐ球団史上2人目の永久欠番選手となる。ラウリーは9シーズン在籍しオールスター6回選出、2018-19シーズンの優勝メンバーだった。",
    date: "2026.08.27",
    thumb: "../assets/journal-052-hero.jpg?v=5eca29fe37",
    tile: "LOWRY"
  },
  {
    href: "051-nakamura-asano-jonescup.html",
    cat: "JAPAN",
    title: "台湾で掴んだ国際経験 —— 群馬クレインサンダーズ・中村拓人、淺野ケニー、日本代表として第45回ウィリアム・ジョーンズカップ出場",
    excerpt: "群馬クレインサンダーズ所属の中村拓人選手、淺野ケニー選手が、2026年度バスケットボール男子日本代表として台湾で開催された「第45回ウィリアム・ジョーンズカップ」に出場したと同クラブが8月27日発表した。中村選手は4試合で26得点・13リバウンド・18アシスト、淺野選手は6試合で25得点・17リバウンド・2アシストを記録した。",
    date: "2026.08.27",
    thumb: "../assets/journal-051-hero.jpg?v=51338e5184",
    tile: "JONES CUP"
  },
  {
    href: "050-hokurikugakuin-komatsuwall.html",
    cat: "JAPAN",
    title: "地元企業が支える全国区の挑戦 —— 小松ウオール、北陸学院高校 男子バスケットボール部のメインパートナーに就任",
    excerpt: "石川県小松市の小松ウオール工業株式会社は、同県を拠点とする北陸学院高等学校 男子バスケットボール部のメインパートナーに就任したと8月27日発表した。8月22日に開幕した「U18日清食品トップリーグ2026 Div.1」に出場する同部を環境面から支援する。",
    date: "2026.08.27",
    thumb: "../assets/journal-050-hero.jpg?v=f0100c62dd",
    tile: "HOKURIKUGAKUIN"
  },
  {
    href: "049-yoshii-japan-roster.html",
    cat: "JAPAN",
    title: "茨城ロボッツ・吉井裕鷹選手、日本代表ロスターに選出 —— FIBAワールドカップ2027アジア予選、サウジアラビア戦",
    excerpt: "茨城ロボッツの吉井裕鷹選手が、8月28日未明(日本時間)にサウジアラビアで行われる「FIBAバスケットボールワールドカップ2027アジア地区予選Window4」のサウジアラビア代表戦で日本代表のロスターに選出されたと茨城ロボッツが8月27日発表した。",
    date: "2026.08.27",
    thumb: "../assets/journal-049-hero.jpg?v=945c15159e",
    tile: "YOSHII"
  },
  {
    href: "048-fujita-japan-coach.html",
    cat: "JAPAN",
    title: "大阪エヴェッサ・藤田弘輝HC、日本代表コーチに選出 —— FIBAワールドカップ2027アジア予選、サウジアラビア戦で指揮",
    excerpt: "大阪エヴェッサの藤田弘輝ヘッドコーチが、8月28日にサウジアラビアで行われる「FIBAバスケットボールワールドカップ2027アジア地区予選Window4」のサウジアラビア戦で日本代表コーチに選出されたと大阪エヴェッサが8月27日発表した。",
    date: "2026.08.27",
    thumb: "../assets/journal-048-hero.jpg?v=f70daf06ac",
    tile: "FUJITA"
  },
  {
    href: "047-kuminga-timberwolves.html",
    cat: "NBA",
    title: "ジョナサン・クミンガ、ティンバーウルブズ入り合意 —— 2年1240万ドル、レイカーズのサインアンドトレード案を退ける",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。フリーエージェントのジョナサン・クミンガ(23)がミネソタ・ティンバーウルブズと2年1240万ドル(2年目にプレーヤーオプション付き)の契約に合意。レイカーズなど複数球団の争奪戦を制し、来夏の完全なフリーエージェント権取得を見据えた短期契約を選んだ。",
    date: "2026.08.26",
    thumb: "../assets/journal-047-hero.jpg?v=74df93e231",
    tile: "KUMINGA"
  },
  {
    href: "046-mathurin-pelicans.html",
    cat: "NBA",
    title: "ベネディクト・マチュリン、ペリカンズ入り合意 —— 2年1600万ドル、クリッパーズへのQO撤回で移籍実現",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ベネディクト・マチュリン(24)がニューオーリンズ・ペリカンズと2年1600万ドル(プレーヤーオプション付き)の契約に合意。クリッパーズへのクオリファイング・オファーを撤回しての移籍となった。",
    date: "2026.08.26",
    thumb: "../assets/journal-046-hero.jpg?v=2851a77d70",
    tile: "MATHURIN"
  },
  {
    href: "045-crane-thunders-clinic.html",
    cat: "JAPAN",
    title: "中学・高校生34人が参加 —— 群馬クレインサンダーズ、鶴巻啓太・細川一輝が指導するバスケットボールスキルアップクリニックを開催",
    excerpt: "群馬クレインサンダーズは8月2日・9日の2日間、群馬パース大学で「バスケットボールスキルアップクリニック」を開催。鶴巻啓太選手・細川一輝選手が指導にあたり、県内外の中学生・高校生34人が参加した。",
    date: "2026.08.26",
    thumb: "../assets/journal-045-hero.jpg?v=d1e21f822d",
    tile: "CRANE THUNDERS"
  },
  {
    href: "044-kings-academy-cup-2026.html",
    cat: "JAPAN",
    title: "北部地域と交流、約90人が参加 —— 琉球ゴールデンキングス「KINGS ACADEMY CUP 2026」を名護市で開催",
    excerpt: "沖縄バスケットボール株式会社（琉球ゴールデンキングス）が運営するキングスアカデミーは8月23日、沖縄県名護市で「KINGS ACADEMY CUP 2026」を開催。北部地域の部活動チームとスクール生ら約90人が参加した。",
    date: "2026.08.26",
    thumb: "../assets/journal-044-hero.jpg?v=4ac2a51e2e",
    tile: "KINGS ACADEMY"
  },
  {
    href: "043-payrollcup-4th-wheelchair.html",
    cat: "JAPAN",
    title: "車いすバスケ「ペイロールカップ」第4回、9月26日・27日に札幌開催 —— 札幌ノースウィンドなど6チームが参加",
    excerpt: "株式会社ペイロールが車いすバスケットボール大会「ペイロールカップ」第4回を2026年9月26日・27日に札幌市西区体育館で開催。今回は6チームが参加し、入場は無料。",
    date: "2026.08.26",
    thumb: "../assets/journal-043-hero.jpg?v=b2ada27d7a",
    tile: "PAYROLLCUP"
  },
  {
    href: "042-broncos-akita-preseason.html",
    cat: "JAPAN",
    title: "さいたまブロンコス vs 秋田ノーザンハピネッツ プレシーズンマッチ(8月29日・パルシー) —— 会場とオープニングイベント",
    excerpt: "さいたまブロンコス対秋田ノーザンハピネッツのプレシーズンマッチは8月29日、蓮田市総合市民体育館パルシーで開催。B.PREMIERの秋田を迎える一戦で、試合前にはRed EyeやENBASEによるオープニングイベントも行われる。",
    date: "2026.08.26",
    thumb: "../assets/journal-042-hero.jpg?v=53e5e59727",
    tile: "BRONCOS"
  },
  {
    href: "041-niang-warriors.html",
    cat: "NBA",
    title: "ジョージ・ニアング、ウォリアーズと1年390万ドルで契約合意 —— 今夏2人目の補強で15人ロースター確定",
    excerpt: "フリーエージェントのベテランPF、ジョージ・ニアングがゴールデンステート・ウォリアーズと1年390万ドルで契約合意。ESPNのシャムズ・チャラニア氏が一報した。同日発表のブランドン・ウィリアムズに続く今夏2人目の外部補強で、ウォリアーズの15人ロースターが確定した。",
    date: "2026.08.25",
    thumb: "../assets/journal-041-hero.jpg?v=ab5f394447",
    tile: "NIANG"
  },
  {
    href: "040-williams-warriors.html",
    cat: "NBA",
    title: "ブランドン・ウィリアムズ、ウォリアーズと1年260万ドルで契約合意 —— バトラー&ムーディ離脱のベンチを補強",
    excerpt: "フリーエージェントのガード、ブランドン・ウィリアムズがゴールデンステート・ウォリアーズと1年260万ドル(最低保証額)で契約合意。代理人がESPNのシャムズ・チャラニア氏に明らかにした。マーベリックスからの加入で、開幕から離脱するバトラーとムーディの穴を埋める狙い。",
    date: "2026.08.25",
    thumb: "../assets/journal-040-hero.jpg?v=49e8416b0e",
    tile: "WILLIAMS"
  },
  {
    href: "039-sharpe-injury.html",
    cat: "NBA",
    title: "シェイドン・シャープが右膝半月板損傷 —— ブレイザーズの23歳、全治6ヶ月で2026-27シーズン大半を欠場へ",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ポートランド・トレイルブレイザーズのシェイドン・シャープ(23)が右膝の半月板を損傷し、全治6ヶ月の見通し。前季に続き2年連続の長期離脱となる。",
    date: "2026.08.24",
    thumb: "../assets/journal-039-hero.jpg?v=456203148a",
    tile: "SHARPE"
  },
  {
    href: "038-jue-jones-cup-wkbl.html",
    cat: "JAPAN",
    title: "日本経済大学、バスケ部の監督と学生が国際舞台へ —— 片桐監督が日本代表コーチとしてジョーンズカップ、中老選手はWKBLフューチャーズリーグの日本学生選抜に",
    excerpt: "日本経済大学男子バスケットボール部の片桐章光監督が台湾開催「第45回ウィリアム・ジョーンズカップ」に日本代表コーチとして参加。女子バスケットボール部の中老小雪選手は日本学生選抜に選出され、案浦知仁監督もアシスタントコーチとして韓国開催の「2026 WKBLフューチャーズリーグ」に参加した。",
    date: "2026.08.24",
    thumb: "../assets/journal-038-hero.jpg?v=cfc3f436be",
    tile: "JUE HOOPS"
  },
  {
    href: "037-haruyoshi-yanagigaura.html",
    cat: "JAPAN",
    title: "柳ヶ浦高校男子バスケ部、U18日清食品トップリーグ初出場で鳥取城北に67-57 —— 陽吉グループがスポンサーに就任",
    excerpt: "大分県・柳ヶ浦高校男子バスケットボール部が「U18日清食品トップリーグ2026 ディビジョン1」に初出場し、8月22日の開幕戦で鳥取城北を67-57で破った。リユース企業の陽吉グループが同部のスポンサーに就任し、ユニフォームを贈呈している。",
    date: "2026.08.24",
    thumb: "../assets/journal-037-hero.jpg?v=12d819d98a",
    tile: "YANAGIGAURA"
  },
  {
    href: "036-anker-nagasaki-velca.html",
    cat: "JAPAN",
    title: "Anker(アンカー)×長崎ヴェルカ、トップパートナー契約 —— ユニフォーム胸ロゴ・アリーナ命名権・Anker Store出店",
    excerpt: "Anker(アンカー・ジャパン)がB.LEAGUE王者の長崎ヴェルカとトップパートナー契約を締結。2026-27シーズンのユニフォーム胸部にロゴを掲出し、ホームアリーナ「HAPPINESS ARENA」の命名権を取得、長崎県内に直営店「Anker Store」を2店舗出店する。",
    date: "2026.08.23",
    thumb: "../assets/journal-036-hero.jpg?v=9d27fda4be",
    tile: "ANKER"
  },
  {
    href: "035-fukuyama-denix-homegame.html",
    cat: "JAPAN",
    title: "びんご福山デニックス、9月12日・13日にホームゲーム —— 観戦無料、九州電力・富士通と対戦",
    excerpt: "広島県福山市を拠点にSB1リーグで戦うびんご福山デニックスが、2026年9月12日・13日にエフピコアリーナふくやまで観戦無料のホームゲームを開催する。対戦相手は九州電力(福岡)と富士通(神奈川)。",
    date: "2026.08.22",
    thumb: "../assets/journal-035-hero.jpg?v=b6cbb760ad",
    tile: "DENIX"
  },
  {
    href: "034-derozan-nuggets.html",
    cat: "NBA",
    title: "デマー・デローザン、ナゲッツ入り合意 —— ヒート等蹴り1年390万ドル、ヨキッチ&マレーの下でプレーオフ勝負へ",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。6度のオールスターに選出されたデマー・デローザン(36)が、ヒート・ウィザーズ・ペリカンズとの交渉を経てデンバー・ナゲッツと1年390万ドルの契約に合意したと報じられた。",
    date: "2026.08.21",
    thumb: "../assets/journal-034-hero.jpg?v=da7eb078f1",
    tile: "DEROZAN"
  },
  {
    href: "033-klay-thompson-heat.html",
    cat: "NBA",
    title: "クレイ・トンプソン、マーベリックス退団へ —— ヒート入り濃厚、ジアニス擁する優勝候補に加入",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ダラス・マーベリックスがクレイ・トンプソン(36)との契約を買い取ることで合意し、ウェイバー通過後はマイアミ・ヒートと契約する見通しだと報じられた。",
    date: "2026.08.21",
    thumb: "../assets/journal-033-hero.jpg?v=ec10e30fd0",
    tile: "KLAY"
  },
  {
    href: "032-timberwolves-lynx-stad.html",
    cat: "NBA",
    title: "ティンバーウルブズ&リンクス、支配株主が交代 —— マーク・スタッド氏がロア氏保有株の大半を取得、評価額45億ドル",
    excerpt: "ESPNが情報筋の話として報道。NBAミネソタ・ティンバーウルブズとWNBAミネソタ・リンクスの共同オーナー、マーク・ロア氏が保有株式の大半をマーク・スタッド氏に売却し、スタッド氏が両球団の支配株主・筆頭株主になることで合意した。",
    date: "2026.08.21",
    thumb: "../assets/journal-032-hero.jpg?v=53d1b005c1",
    tile: "OWNERSHIP"
  },
  {
    href: "031-sportsnavi-u18-league.html",
    cat: "JAPAN",
    title: "高校バスケの頂点争い、全56試合を無料生中継 —— スポーツナビ「U18日清食品トップリーグ2026」ライブ配信・速報",
    excerpt: "スポーツナビ株式会社は、高校バスケットボール最高峰リーグ「U18日清食品トップリーグ2026 ディビジョン1」全56試合を8月22日から11月15日にかけてライブ配信・試合速報で無料展開すると発表した。",
    date: "2026.08.21",
    thumb: "../assets/journal-031-hero.jpg?v=15c4383426",
    tile: "U18 LEAGUE"
  },
  {
    href: "030-kings-summer-camp-2026.html",
    cat: "JAPAN",
    title: "コートを3分割、実戦スキルを叩き込む —— 琉球ゴールデンキングス「キングスバスケットボールスクールサマーキャンプ2026」",
    excerpt: "沖縄バスケットボール株式会社(琉球ゴールデンキングス)が運営するキングスバスケットボールスクールは、7月29日・8月5日・8月19日の3日間、小学4〜6年生を対象に『サマーキャンプ2026』を実施したと発表した。",
    date: "2026.08.21",
    thumb: "../assets/journal-030-hero.jpg?v=9764ca222b",
    tile: "KINGS"
  },
  {
    href: "029-agest-tubc-partner.html",
    cat: "JAPAN",
    title: "「機敏性」で重なる2社 —— AGEST、東京ユナイテッドバスケットボールクラブとオフィシャルパートナー契約",
    excerpt: "ソフトウェア品質支援のAGESTが2026-27シーズンより、有明アリーナ拠点のB.LEAGUEクラブ・東京ユナイテッドバスケットボールクラブ(TUBC)とオフィシャルパートナー契約を締結した。",
    date: "2026.08.21",
    thumb: "../assets/journal-029-hero.jpg?v=d67747cee7",
    tile: "TUBC"
  },
  {
    href: "028-harden-cavaliers.html",
    cat: "NBA",
    title: "ハーデン、キャバリアーズ残留 —— 3年9700万ドルの新契約で合意",
    excerpt: "ジェームズ・ハーデンが、3年総額9700万ドルの新契約でクリーブランド・キャバリアーズに残留することで合意した。2028-29シーズンのプレーヤーオプションとトレードキッカー付き。代理人らがESPNに明らかにした。",
    date: "2026.08.20",
    thumb: "../assets/journal-028-hero.jpg?v=b80304aa0d",
    tile: "HARDEN"
  },
  {
    href: "027-converse-accelerator.html",
    cat: "KICKS",
    title: "名作「ACCELERATOR」が最新技術で復活 —— コンバース「CONS ACCELERATOR SE LOW」8月25日発売",
    excerpt: "コンバースジャパンは8月20日、バスケットボールシューズ「CONS ACCELERATOR SE LOW」を8月25日に発売すると発表。アーカイブモデル「ACCELERATOR」を、新構造シャンクや中空ミッドソールなど最新技術でアップデートした。価格14,300円(税込)。",
    date: "2026.08.20",
    thumb: "../assets/journal-027-hero.jpg?v=fbb3e82aaf",
    tile: "ACCELERATOR"
  },
  {
    href: "026-watson-cavaliers.html",
    cat: "NBA",
    title: "ワトソン、キャバリアーズへ —— ナゲッツとの5チーム間サイン&トレードで合意へ",
    excerpt: "Chris Haynes（NBA on Prime）が一報。デンバー・ナゲッツが、制限付きFAのペイトン・ワトソンをクリーブランド・キャバリアーズへ送るサイン&トレードに近づいている。5チーム間の取引で、ワトソンは4年8800万ドル(プレーヤーオプション付き)の契約条件に合意する見通し。",
    date: "2026.08.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426",
    tile: "WATSON"
  },
  {
    href: "025-lakers-buss-family-sale.html",
    cat: "NBA",
    title: "レイカーズ、バス家が最後の株式を手放す —— カシュナー氏とアイガー氏に17.8%売却、ジーニー・バスはガバナー退任へ",
    excerpt: "Shams Charania（ESPN）が一報。ロサンゼルス・レイカーズを保有するバス・ファミリー・トラストが、信託に残る17.8%の株式をジョシュ・カシュナー氏とボブ・アイガー氏に売却することを決定。完了後、ジーニー・バスはガバナーの資格を失う見通しとなった。",
    date: "2026.08.18",
    thumb: "../assets/journal-025-hero.jpg?v=0e24230166",
    tile: "LAKERS"
  },
  {
    href: "024-highsmith-suns.html",
    cat: "NBA",
    title: "古巣へ、1年契約で復帰 —— ヘイウッド・ハイスミス、サンズと合意",
    excerpt: "Shams Charania（ESPN）が一報。FAのヘイウッド・ハイスミスが、フェニックス・サンズとの1年契約に合意した。",
    date: "2026.08.17",
    thumb: "../assets/journal-024-hero.jpg?v=afc443204c",
    tile: "HIGHSMITH"
  },
  {
    href: "023-watford-pelicans.html",
    cat: "NBA",
    title: "遅めのオフシーズンに、掘り出し物 —— トレンドン・ワトフォード、ペリカンズと1年290万ドルで契約合意",
    excerpt: "Shams Charania（ESPN）が一報。FAのトレンドン・ワトフォードが、ニューオーリンズ・ペリカンズと1年290万ドルの契約に合意した。",
    date: "2026.08.17",
    thumb: "../assets/journal-023-hero.jpg?v=fe8b376c49",
    tile: "WATFORD"
  },
  {
    href: "020-bandai-namco-arena-matsue.html",
    cat: "JAPAN",
    title: "ホームアリーナに、クラブと同じ名前を —— 松江市総合体育館は9月から「バンダイナムコアリーナ松江」に",
    excerpt: "B.LEAGUE PREMIER参入の島根スサノオマジック。運営会社が松江市とネーミングライツ契約を締結、2026年9月1日から新愛称に。",
    date: "2026.08.17",
    thumb: "../assets/journal-020-hero.jpg?v=aeaa4f363d",
    tile: "MATSUE"
  },
  {
    href: "001-banned-aj1.html",
    cat: "KICKS",
    title: "「禁止」が生んだ伝説 —— エア・ジョーダン1とルールの向こう側",
    excerpt: "1足のシューズが、なぜ40年経っても語り継がれるのか。伝説の始まりにあったのは、リーグの規定と1枚の広告だった。",
    date: "2026.08.15",
    thumb: "../assets/journal-001-hero.jpg?v=275678f497",
    tile: "BANNED"
  },
  {
    href: "010-abema-saudi.html",
    cat: "JAPAN",
    title: "深夜2時、W杯への初戦 —— 最終予選サウジアラビア戦、ABEMAが無料生中継",
    excerpt: "W杯2027アジア最終予選が8月27日に開幕。八村塁と河村勇輝が合流予定の初戦を、ABEMAが無料生中継する。",
    date: "2026.08.14",
    thumb: "../assets/journal-010-hero.jpg?v=bd2e568b66",
    tile: "WINDOW4"
  },
  {
    href: "021-westbrook-retires.html",
    cat: "NBA",
    title: "トリプルダブルの王が、コートを去る —— ラッセル・ウェストブルック、18シーズンで現役引退",
    excerpt: "Shams Charania（ESPN）が一報。2017年MVP、通算トリプルダブル209回の男が、自らの流儀で18年のキャリアに幕を下ろした。",
    date: "2026.08.13",
    thumb: "../assets/journal-021-hero.jpg?v=901b31a8a6",
    tile: "RUSS"
  },
  {
    href: "009-abema-korea.html",
    cat: "JAPAN",
    title: "有明に、日の丸のエースが帰ってきた —— 八村塁と河村勇輝、約2年ぶりの代表戦をABEMAが無料生中継",
    excerpt: "8月16日・有明アリーナの韓国戦。パリ五輪以来およそ2年ぶりに、2人が代表のコートへ戻る。",
    date: "2026.08.12",
    thumb: "../assets/journal-009-hero.jpg?v=dc4637e456",
    tile: "ARIAKE"
  },
  {
    href: "002-iverson.html",
    cat: "CULTURE",
    title: "コーンロウとアームスリーブ —— アレン・アイバーソンがコートに持ち込んだ「街」",
    excerpt: "NBAとヒップホップの距離を一気に縮めた男の話。",
    date: "2026.08.12",
    thumb: "../assets/journal-002-hero.jpg?v=59f1ed5d83",
    tile: "IVERSON"
  },
  {
    href: "003-signature-shoes.html",
    cat: "KICKS",
    title: "シグネチャーシューズは「物語」でできている",
    excerpt: "スペックではなく、ストーリーがスニーカーを売る理由。",
    date: "2026.08.10",
    thumb: "../assets/journal-003-hero.jpg?v=c3ab04e0d7",
    tile: "SIGNATURE"
  },
  {
    href: "004-japan-hoops.html",
    cat: "JAPAN",
    title: "日本のバスケが「カルチャー」になる日",
    excerpt: "Bリーグ、部活、ストリート。この国のバスケの現在地。",
    date: "2026.08.07",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "JAPAN"
  },
  {
    href: "011-mandom-bs-summit.html",
    cat: "JAPAN",
    title: "整えることから、始まる —— マンダムが「BLACK SAMURAI SUMMIT 2026」ローカルパートナーに就任",
    excerpt: "ギャツビーが「部活ヘアサロン」でスタイリングとマインドセットを次世代へ。GAME DAYにはサンプリングも。",
    date: "2026.08.06",
    thumb: "../assets/journal-011-hero.jpg?v=f52fceea94",
    tile: "GATSBY"
  },
  {
    href: "005-small-guards.html",
    cat: "NBA",
    title: "160cmの証明 —— 小さな選手たちがコートに残したもの",
    excerpt: "サイズの神話を壊し続けてきたガードたちの系譜。",
    date: "2026.08.04",
    thumb: "../assets/journal-005-hero.jpg?v=91bdc4a0ee",
    tile: "160cm"
  },
  {
    href: "012-glion-kobe-camp.html",
    cat: "JAPAN",
    title: "神戸の2日間を、神戸が運ぶ —— G LION GROUPが「BLACK SAMURAI KOBE CAMP」モビリティパートナーに",
    excerpt: "GLION ARENA KOBE開催のキャンプへBMW X7を提供。会場も移動も神戸の企業が支える2日間。",
    date: "2026.08.03",
    thumb: "../assets/journal-012-hero.jpg?v=dd12ace6c8",
    tile: "GLION"
  },
  {
    href: "006-streetball.html",
    cat: "CULTURE",
    title: "ラッカーパーク（ニューヨーク・ハーレム）の場所・行き方・歴史 —— アスファルトの聖地とストリートの系譜",
    excerpt: "ラッカーパーク（Holcombe Rucker Park）は、ニューヨーク・マンハッタンのハーレム北端、155丁目とフレデリック・ダグラス・ブールバードの角にある屋外コート。最寄りは地下鉄155丁目駅（B・D線）。1950年にホルコム・ラッカーが始めた夏の大会と、1982年創設のEBCがストリートバスケの聖地を築いた。",
    date: "2026.08.01",
    thumb: "../assets/journal-006-hero.jpg?v=e6bde98804",
    tile: "RUCKER"
  },
  {
    href: "013-bs-summit-3players.html",
    cat: "JAPAN",
    title: "八村塁が選んだ、次の3人 —— 佐藤凪、トンプソン・ヨセフ・ハサン、磯田陸斗がSUMMITへ",
    excerpt: "渡米、大学、Bユース。3人3様のルートがIG ARENAに集まる。招待16名の残る1枠はKOBE CAMP MVP。",
    date: "2026.07.29",
    thumb: "../assets/journal-013-hero.jpg?v=e6e00f88b8",
    tile: "NEXTGEN"
  },
  {
    href: "014-oikos-gold-partner.html",
    cat: "JAPAN",
    title: "アンバサダーから、パートナーへ —— ダノン オイコスが「BLACK SAMURAI 2026」のゴールドパートナーに",
    excerpt: "八村塁主宰の次世代育成プロジェクトにダノン オイコスが協賛。神戸・名古屋の2会場でサンプリング等を実施。",
    date: "2026.07.28",
    thumb: "../assets/journal-014-hero.jpg?v=dec74be9fa",
    tile: "OIKOS"
  },
  {
    href: "015-tabuse-hachimura-sasaki-talk.html",
    cat: "JAPAN",
    title: "日本バスケの過去・現在・未来を、この3人で —— 田臥勇太×八村塁×佐々木クリス、SUMMITでスペシャル対談",
    excerpt: "8月8日、名古屋IG ARENAのGAME DAYで実現。テーマは日本バスケットボール業界の過去・現在・未来。",
    date: "2026.07.27",
    thumb: "../assets/journal-015-hero.jpg?v=3d58e13c16",
    tile: "LEGENDS"
  },
  {
    href: "008-osakabe-donation-2026.html",
    cat: "REPORT",
    title: "恩師のもとへ、ふたたび —— 小酒部泰暉と、クリスのバスケ日記、2回目の40球を寄贈",
    excerpt: "2年ぶり2回目のボール寄贈。大磯高校と山北高校へ、計40球。",
    date: "2026.07.24",
    thumb: "../assets/journal-008-hero.jpg?v=721929fb6c",
    heroThumb: "../assets/journal-008-group.jpg?v=9de3b89a29",
    featured: true
  },
  {
    href: "016-kobe-camp-storks.html",
    cat: "JAPAN",
    title: "地元のプロが、八村の舞台に上がる —— BLACK SAMURAI KOBE CAMP「THE SHOWCASE」に神戸ストークスが参加",
    excerpt: "8月4日・5日、GLION ARENA KOBEで全演目発表。8HOOPSで八村率いるチームと地元プロが対戦。",
    date: "2026.07.24",
    thumb: "../assets/journal-016-hero.jpg?v=c4b819c318",
    tile: "STORKS"
  },
  {
    href: "019-toyama-kurobe-hachimura.html",
    cat: "JAPAN",
    title: "富山に、八村塁が帰ってくる —— NBA入り後初の公式凱旋イベント、8月22日にYKK AP ARENAで",
    excerpt: "8月22日、富山Homecomingで八村塁がNBA入り後初の公式凱旋。昼はクリニック、夜は祭り。",
    date: "2026.07.24",
    thumb: "../assets/journal-019-hero.jpg?v=1609756c1b",
    tile: "TOYAMA"
  },
  {
    href: "017-canon-mj-bs2026.html",
    cat: "JAPAN",
    title: "コートの熱を、写真に残す人を育てる —— キヤノンMJが八村塁主宰「BLACK SAMURAI 2026」に協賛",
    excerpt: "キヤノンMJがBLACK SAMURAI 2026の神戸・名古屋に協賛。若手スポーツフォトグラファー育成プログラムを実施する。",
    date: "2026.07.22",
    thumb: "../assets/journal-017-hero.jpg?v=923ec8a0ff",
    tile: "CANON"
  },
  {
    href: "018-bs-summit-second-wave.html",
    cat: "JAPAN",
    title: "大濠から3人、開志国際から2人 —— BLACK SAMURAI SUMMIT 2026、招待選手第二弾と指導陣が発表",
    excerpt: "名古屋・IG ARENAに集うU18招待選手第二弾と指導陣が発表。MVPにはNBA観戦ツアーが贈られる。",
    date: "2026.07.22",
    thumb: "../assets/journal-018-hero.jpg?v=d631be8788",
    tile: "ROSTER"
  },
  {
    href: "022-hachimura-clippers.html",
    cat: "NBA",
    title: "同じ街で、新しいユニフォームを —— 八村塁、クリッパーズと2年2800万ドルで契約合意",
    excerpt: "Shams Charania（ESPN）が一報。レイカーズとのサイン&トレードは成立せず、FA契約で望んだロサンゼルスに残る道を選んだ。",
    date: "2026.07.07",
    thumb: "../assets/journal-022-hero.jpg?v=9a479b0e3d",
    tile: "RUI"
  },
  {
    href: "007-osakabe-donation.html",
    cat: "REPORT",
    title: "「足りない分は、顧問の自腹」を変えたい —— 小酒部泰暉と、母校へ届けたボール",
    excerpt: "県大会2回戦止まりだった2人の、恩師と母校へのはじめての恩返し。",
    date: "2024.08",
    thumb: "../assets/journal-007-hero.jpg?v=364bb0fe14"
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
    const hubMatch = url.pathname.match(/\/journal\/(japan|kicks)\/$/); // 分野ハブ(静的URL・施策8)
    const linkCat = url.searchParams.get("cat") || (hubMatch ? hubMatch[1].toUpperCase() : null);
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
// build_seo.py が「話題の近さ」で静的に埋めた .rel-card があればそれを残す(2026-09-15 施策5)
function initRelated() {
  const grid = document.getElementById("related-grid");
  if (!grid) return false;
  const current = location.pathname.split("/").pop();
  const me = ARTICLES.find(function (a) { return a.href === current; });
  if (grid.querySelector(".rel-card")) {
    if (me) markActiveTab(me.cat);
    return true;
  }
  const others = ARTICLES.filter(function (a) { return a.href !== current; });
  const sameCat = me ? others.filter(function (a) { return a.cat === me.cat; }) : [];
  const rest = others.filter(function (a) { return sameCat.indexOf(a) === -1; });
  const picks = sameCat.concat(rest).slice(0, 3);
  grid.innerHTML = picks.map(relCardHtml).join("");
  if (me) markActiveTab(me.cat);
  return true;
}

// 記事ページ: Instagram埋め込みの高さ合わせ(2026-09-13設置)
// IGのiframeが {type:"MEASURE", details:{height:N}} を postMessage してくるので、
// それだけを見て高さを合わせる。Metaのembed.jsは読み込まない(第三者JSを入れないため)。
function initIgEmbeds() {
  const frames = document.querySelectorAll("iframe.ig-embed-frame");
  if (!frames.length) return false;
  window.addEventListener("message", function (e) {
    if (!/^https:\/\/(www\.)?instagram\.com$/.test(e.origin)) return;
    let data = e.data;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch (err) { return; }
    }
    if (!data || data.type !== "MEASURE" || !data.details) return;
    const h = parseInt(data.details.height, 10);
    if (!h || h < 100 || h > 3000) return;
    frames.forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = h + "px";
    });
  });
  return true;
}

initIndex();
initRelated();
initIgEmbeds();
