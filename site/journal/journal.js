// 610 JOURNAL 共通スクリプト
// 記事メタデータ(日付降順)。新記事を追加したらここに1件足す。
// thumb: 実写真のパス(あれば必ず優先) / tile: 写真がない記事用のタイポグラフィ表紙
const ARTICLES = [
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
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
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
    title: "Jordan Tatum 5「Sunrise」が10月15日発売 —— ジェイソン・テイタムの最新シグネチャー、新色登場",
    excerpt: "Sneaker Newsによると、ジェイソン・テイタム（ボストン・セルティックス）のシグネチャーモデル「Jordan Tatum 5」の新色「Sunrise」が2026年10月15日に発売される。品番はIO1746-401。9月に発表されたばかりの最新シグネチャーモデルの初期カラー展開のひとつとなる。",
    date: "2026.09.10",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79",
    tile: "JORDAN TATUM 5 SUNRISE"
  },
  {
    href: "120-air-jordan-1-high-og-royal.html",
    cat: "KICKS",
    title: "Air Jordan 1 High OG「Royal」10月10日に復刻 —— 黒×ロイヤルブルー、約10年ぶりの再登場",
    excerpt: "Air Jordan 1 High OGの定番カラー「Royal」（品番IQ5495-005）が2026年10月10日に発売。黒×ロイヤルブルーの配色が約10年ぶりに復刻する。Nice Kicks・Sneaker Bar Detroitが報じた。",
    date: "2026.09.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "AIR JORDAN 1 ROYAL"
  },
  {
    href: "119-air-jordan-14-blue-ferrari.html",
    cat: "KICKS",
    title: "Air Jordan 14「Blue Ferrari」2027年秋発売へ —— 2014年「Ferrari」の系譜、レッドからブルーへ",
    excerpt: "Air Jordan 14の新色「Blue Ferrari」が2027年秋に発売予定。2014年発売の初代「Ferrari」のレッドスエードをブルーに置き換えた新解釈。Sneaker News・Sneaker Bar Detroitが報じた。",
    date: "2026.09.10",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "AIR JORDAN 14 BLUE FERRARI"
  },
  {
    href: "118-air-jordan-4-fire-red-2027.html",
    cat: "KICKS",
    title: "Air Jordan 4「Fire Red」2027年秋に復刻 —— ティンカー・ハットフィールドが手がけた1989年オリジナルカラー",
    excerpt: "Air Jordan 4の代表的カラー「Fire Red」が2027年秋に復刻。1989年のオリジナルを起点に、2020年以来の再登場となる。Sneaker News・Sneaker Bar Detroitが揃って報じた。",
    date: "2026.09.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
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
    title: "ジョーダン ブランド「テイタム5」発表 —— 復帰のジェイソン・テイタム、雑音を遮断する哲学を体現",
    excerpt: "FLY BASKETBALL CULTURE MAGAZINEによると、ジョーダン ブランドはジェイソン・テイタム（ボストン・セルティックス）のシグネチャー最新作「テイタム5」を発表した。コートを支配するテイタムのプレースタイルを軸に、軽量性と反発性を追求したデザイン。復帰した本人は「周りの雑音がなくなることはない」と自身の哲学を語っている。",
    date: "2026.09.10",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
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
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
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
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
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
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "NIKE JA 4 JAWS"
  },
  {
    href: "101-nike-book-2-halloween.html",
    cat: "KICKS",
    title: "Nike Book 2に新色「Halloween」—— ブッカー恒例のハロウィン企画、今年はオオギー・ブギーがテーマに",
    excerpt: "Sneaker Newsは、デビン・ブッカーのシグネチャーモデル「Nike Book 2」の新色「Halloween」を公式画像で紹介。品番はIO7942-001で、Sneaker Bar Detroitによると今年10月の発売が見込まれている。テーマは「ナイトメア・ビフォア・クリスマス」の悪役オオギー・ブギー。",
    date: "2026.09.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
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
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
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
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
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
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "AIR JORDAN 12 IDOLS BECOME RIVALS"
  },
  {
    href: "089-bucks-2026-27-season-preview.html",
    cat: "NBA",
    title: "ジアニス退団、再建の船出へ —— ESPN、ミルウォーキー・バックスの2026-27シーズンを展望",
    excerpt: "ESPNは9月7日(現地時間)、6月にヤニス・アデトクンボをマイアミ・ヒートへ放出したミルウォーキー・バックスの2026-27シーズンを展望する特集記事を公開。見返りに獲得したタイラー・ハーローらの起用と、新HCテイラー・ジェンキンス体制での若手育成が今シーズンの焦点になるとしている。",
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
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "NIKE AIR FORCE 1 GORE-TEX"
  },
  {
    href: "087-fc-barcelona-nike-kobe-3-protro.html",
    cat: "KICKS",
    title: "クラブエンブレムを刻んだコービーモデル —— Nike Kobe 3 Low Protro「Electro Purple」9月4日発売",
    excerpt: "ナイキとFCバルセロナのコラボレーション「Kobe 3 Low Protro」新色「Electro Purple」が2026年9月4日に発売された。ブラックにエレクトロパープルとメタリックゴールドを配し、クラブエンブレムをあしらったディテールが特徴。品番IO6257-001、価格200ドル(米国価格)。",
    date: "2026.09.06",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
    tile: "NIKE KOBE 3 LOW PROTRO"
  },
  {
    href: "086-air-jordan-9-space-jam.html",
    cat: "KICKS",
    title: "『スペース・ジャム』30周年復刻 —— Air Jordan 9 OG「Space Jam」9月19日発売",
    excerpt: "ジョーダン ブランドは、映画『スペース・ジャム』公開30周年を記念し「Air Jordan 9 OG \"Space Jam\"」(品番: IX6179-100)を2026年9月19日に発売する。マイケル・ジョーダン時代を象徴するオリジナルカラーの復刻。",
    date: "2026.09.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6",
    tile: "AIR JORDAN 9 SPACE JAM"
  },
  {
    href: "085-nike-sabrina-4-the-switch.html",
    cat: "KICKS",
    title: "サブリナ・イオネスクの4代目シグネチャー —— Nike Sabrina 4「The Switch」本日発売",
    excerpt: "ナイキは2026年9月5日、WNBAニューヨーク・リバティのサブリナ・イオネスクによるシグネチャーシューズ最新作「Nike Sabrina 4」の新色「The Switch」を発売した。Nike.comおよび一部取扱店で取り扱い、価格は$135(米国価格)。",
    date: "2026.09.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8",
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
    title: "WNBAコミッショナー、キャシー・エンゲルバート氏が年内退任へ",
    excerpt: "WNBAのキャシー・エンゲルバート コミッショナー(61)が、12月31日付で退任することが決まったと、ESPNのシャムズ・チャラニア記者らが9月4日(現地時間)、複数の関係者の話として報じた。後任探しは早ければ今月中にも始まるという。",
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
    title: "次代のロケッツを託される —— アメン・トンプソン、5年2億800万ドルの契約延長で合意",
    excerpt: "ヒューストン・ロケッツが、主力ガードのアメン・トンプソン(23)と5年総額2億800万ドルのルーキー契約延長で合意したと、ESPNが9月3日(現地時間)、複数の関係者の話として報じた。10%のトレードキッカーが付帯し、2024年のアルペレン・シェングンの延長契約とサラリーキャップに占める割合は同水準だという。",
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
    title: "ラッセル・ウェストブルック、新リーグ「Project B」の共同創業者兼最高戦略責任者に就任",
    excerpt: "引退したばかりのラッセル・ウェストブルックが、2027年1月開幕予定の男女新リーグ「Project B」に共同創業者兼チーフ・ストラテジー・オフィサーとして参加し取締役会にも加わったと、ESPNが9月2日(現地時間)報じた。",
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
    title: "隠れた名作「COURT STAR」が令和に蘇る —— コンバース「2FACED」9月11日先行発売",
    excerpt: "コンバースジャパンは8月31日、80年代のアーカイブモデル「COURT STAR」を現代技術でアップデートしたバスケットボールシューズ「2FACED」を発表。MID・LOW・LE LOWの3モデルを9月11日にGALLERY・2 渋谷店とKinetics HARAJUKUで先行発売する。",
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
    title: "さいたまブロンコス vs 秋田ノーザンハピネッツ、プレシーズンマッチを8月29日開催 —— Red EyeやENBASEが試合前を彩る",
    excerpt: "さいたまブロンコスが8月29日、蓮田市総合市民体育館パルシーでB.PREMIERの秋田ノーザンハピネッツを迎えるプレシーズンマッチを開催。試合前にはRed EyeやENBASEによるオープニングイベントも行われる。",
    date: "2026.08.26",
    thumb: "../assets/journal-042-hero.jpg?v=53e5e59727",
    tile: "BRONCOS"
  },
  {
    href: "041-niang-warriors.html",
    cat: "NBA",
    title: "ウォリアーズがジョージ・ニアングと1年390万ドルで契約合意 —— ブランドン・ウィリアムズに続く今夏2人目の補強、15人ロースターが確定",
    excerpt: "ゴールデンステート・ウォリアーズがフリーエージェントのベテランPF、ジョージ・ニアングと1年390万ドルで契約合意。ESPNのシャムズ・チャラニア氏が一報。同日発表のブランドン・ウィリアムズに続く今夏2人目の外部補強で、15人ロースターが確定した。",
    date: "2026.08.25",
    thumb: "../assets/journal-041-hero.jpg?v=ab5f394447",
    tile: "NIANG"
  },
  {
    href: "040-williams-warriors.html",
    cat: "NBA",
    title: "ウォリアーズがブランドン・ウィリアムズと1年260万ドルで契約合意 —— マーベリックスから加入、バトラー&ムーディ離脱のベンチ層を補強",
    excerpt: "ゴールデンステート・ウォリアーズがフリーエージェントのガード、ブランドン・ウィリアムズと1年260万ドル(最低保証額)で契約合意。代理人がESPNのシャムズ・チャラニア氏に明らかにした。マーベリックスから加入し、開幕から離脱するバトラーとムーディの穴を埋める狙い。",
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
    title: "陽吉グループ、大分・柳ヶ浦高校男子バスケ部のスポンサーに就任 —— U18日清食品トップリーグ2026初出場、開幕戦で鳥取城北を67-57で撃破",
    excerpt: "リユース企業の陽吉グループが大分県・柳ヶ浦高校男子バスケットボール部のスポンサーに就任し、ユニフォームを贈呈した。柳ヶ浦は「U18日清食品トップリーグ2026 ディビジョン1」に初出場し、8月22日の開幕戦で鳥取城北を67-57で破って白星スタートを切った。",
    date: "2026.08.24",
    thumb: "../assets/journal-037-hero.jpg?v=12d819d98a",
    tile: "YANAGIGAURA"
  },
  {
    href: "036-anker-nagasaki-velca.html",
    cat: "JAPAN",
    title: "Anker Japan、Bリーグ王者・長崎ヴェルカとトップパートナー契約 —— ユニフォーム胸ロゴとアリーナ命名権を取得、直営店も出店",
    excerpt: "アンカー・ジャパンがB.LEAGUE王者の長崎ヴェルカとトップパートナー契約を締結。2026-27シーズンユニフォーム胸部へのロゴ掲出やホームアリーナ「HAPPINESS ARENA」の命名権を取得し、長崎県内に直営店「Anker Store」を2店舗出店する。",
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
    thumb: "../assets/journal-010-hero.jpg?v=b425540e41",
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
    thumb: "../assets/journal-009-hero.jpg?v=cf9db437dd",
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
    thumb: "../assets/journal-011-hero.jpg?v=ce402f097d",
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
    thumb: "../assets/journal-012-hero.jpg?v=465eeda7f2",
    tile: "GLION"
  },
  {
    href: "006-streetball.html",
    cat: "CULTURE",
    title: "アスファルトの聖地 —— ラッカーパークとストリートの系譜",
    excerpt: "NBAではない場所で、バスケが文化になった理由。",
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
    thumb: "../assets/journal-015-hero.jpg?v=3258a0a882",
    tile: "LEGENDS"
  },
  {
    href: "008-osakabe-donation-2026.html",
    cat: "REPORT",
    title: "恩師のもとへ、ふたたび —— 小酒部泰暉と、クリスのバスケ日記、2回目の40球を寄贈",
    excerpt: "2年ぶり2回目のボール寄贈。大磯高校と山北高校へ、計40球。",
    date: "2026.07.24",
    thumb: "../assets/journal-008-hero.jpg?v=721929fb6c",
    heroThumb: "../assets/journal-008-group.jpg?v=c267afe6f2",
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
    thumb: "../assets/journal-019-hero.jpg?v=8ec482c46b",
    tile: "TOYAMA"
  },
  {
    href: "017-canon-mj-bs2026.html",
    cat: "JAPAN",
    title: "コートの熱を、写真に残す人を育てる —— キヤノンMJが八村塁主宰「BLACK SAMURAI 2026」に協賛",
    excerpt: "キヤノンMJがBLACK SAMURAI 2026の神戸・名古屋に協賛。若手スポーツフォトグラファー育成プログラムを実施する。",
    date: "2026.07.22",
    thumb: "../assets/journal-017-hero.jpg?v=7d73428beb",
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
