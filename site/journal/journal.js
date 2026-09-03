// 610 JOURNAL 共通スクリプト
// 記事メタデータ(日付降順)。新記事を追加したらここに1件足す。
// thumb: 実写真のパス(あれば必ず優先) / tile: 写真がない記事用のタイポグラフィ表紙
const ARTICLES = [
  {
    href: "074-amen-thompson-rockets-extension.html",
    cat: "NBA",
    title: "次代のロケッツを託される —— アメン・トンプソン、5年2億800万ドルの契約延長で合意",
    excerpt: "ヒューストン・ロケッツが、主力ガードのアメン・トンプソン(23)と5年総額2億800万ドルのルーキー契約延長で合意したと、ESPNが9月3日(現地時間)、複数の関係者の話として報じた。10%のトレードキッカーが付帯し、2024年のアルペレン・シェングンの延長契約とサラリーキャップに占める割合は同水準だという。",
    date: "2026.09.03",
    thumb: "../assets/journal-074-hero.jpg",
    tile: "AMEN THOMPSON × ROCKETS"
  },
  {
    href: "072-nba-docomo-kawamura-ambassador.html",
    cat: "JAPAN",
    title: "「NBA docomo」新アンバサダーに河村勇輝 —— NBA2026-27シーズンパス、本日発売開始",
    excerpt: "NTTドコモは9月3日、映像配信サービス「NBA docomo」の新アンバサダーに河村勇輝選手が就任したと発表。同日からNBA2026-27シーズンを通じて視聴できるシーズンパス(16,500円)の販売も始まった。",
    date: "2026.09.03",
    thumb: "../assets/journal-072-hero.jpg",
    tile: "NBA docomo × KAWAMURA"
  },
  {
    href: "073-mills-parker-asvel.html",
    cat: "NBA",
    title: "元スパーズの名コンビ再結成 —— パティ・ミルズ、恩師トニー・パーカー率いるASVELへ移籍",
    excerpt: "元NBA選手のパティ・ミルズが、トニー・パーカーがヘッドコーチを務めるフランス1部ASVELヴィルールバンヌと1年契約を結び加入したと、ESPNが9月2日(現地時間)報じた。スパーズで9年間チームメートだった2人が「勝つ文化」の再現を目指す。",
    date: "2026.09.02",
    thumb: "../assets/journal-073-hero.jpg",
    tile: "MILLS × PARKER × ASVEL"
  },
  {
    href: "071-westbrook-project-b.html",
    cat: "NBA",
    title: "ラッセル・ウェストブルック、新リーグ「Project B」の共同創業者兼最高戦略責任者に就任",
    excerpt: "引退したばかりのラッセル・ウェストブルックが、2027年1月開幕予定の男女新リーグ「Project B」に共同創業者兼チーフ・ストラテジー・オフィサーとして参加し取締役会にも加わったと、ESPNが9月2日(現地時間)報じた。",
    date: "2026.09.02",
    thumb: "../assets/journal-071-hero.jpg",
    tile: "WESTBROOK × PROJECT B"
  },
  {
    href: "070-beril-yokohama-excellence.html",
    cat: "JAPAN",
    title: "ライバー事務所Beril、横浜エクセレンスとオフィシャルスポンサー契約 —— 2026-27シーズンから冠試合開催",
    excerpt: "ライバーマネジメント事務所「Beril」を運営するlapaz株式会社は9月2日、B.LEAGUEのプロバスケットボールクラブ「横浜エクセレンス」と2026-27シーズンのオフィシャルスポンサー契約を締結したと発表した。ホームゲームでのBeril冠試合も予定する。",
    date: "2026.09.02",
    thumb: "../assets/journal-070-hero.jpg",
    tile: "BERIL × YOKOHAMA EXCELLENCE"
  },
  {
    href: "069-meitetsu-fe-nagoya-court.html",
    cat: "JAPAN",
    title: "名駅に一夜限りのバスケコート出現 —— 名鉄×FE名古屋、包括連携協定を締結し9月15日にイベント開催",
    excerpt: "名古屋鉄道は9月2日、B.LEAGUEのファイティングイーグルス名古屋と包括連携協定を締結、9月15日に名古屋駅前「Meieki Parklet」で一夜限りのバスケットボールイベントを共同開催すると発表した。期間中は「ナナちゃん」もFE名古屋のユニフォーム姿になる。",
    date: "2026.09.02",
    thumb: "../assets/journal-069-hero.jpg",
    tile: "MEITETSU × FE NAGOYA"
  },
  {
    href: "068-albirex-recruit-strategy-lab.html",
    cat: "JAPAN",
    title: "新潟アルビレックスBB、採用戦略研究所とオフィシャルパートナー契約 —— 「新潟社長図鑑」運営元が2026-27シーズンから参入",
    excerpt: "株式会社採用戦略研究所は9月2日、B.LEAGUE ONE・新潟アルビレックスBBと2026-27シーズンよりオフィシャルパートナー契約を締結したと発表した。新潟県内の経営者を取材するメディア「新潟社長図鑑」の運営元が、地域の採用課題解決へ連携する。",
    date: "2026.09.02",
    thumb: "../assets/journal-068-hero.jpg",
    tile: "ALBIREX BB × RS-LAB"
  },
  {
    href: "067-tacko-fall-76ers-camp.html",
    cat: "NBA",
    title: "ターコ・フォール、76ersとキャンプ契約 —— ネルソン・ジュニア、セイント・トーマスも同時合意",
    excerpt: "76ersは9月1日、身長231cm(7フィート6インチ)のセンター、ターコ・フォールとエキシビット10契約(キャンプ契約)で合意したと発表。ジェイミア・ネルソン・ジュニア、セイント・トーマスとも同時契約し、3人は今月開催のキャンプでロースター入りを争う。",
    date: "2026.09.01",
    thumb: "../assets/journal-067-hero.jpg",
    tile: "TACKO FALL × 76ers"
  },
  {
    href: "066-joshu-rydeen-upset-supplier.html",
    cat: "JAPAN",
    title: "JOSHU RYDEEN、株式会社アップセットとオフィシャルサプライヤー契約締結 —— 群馬発・女子3x3が新シーズンへ体制強化",
    excerpt: "群馬県太田市を拠点とする女子3x3プロバスケットボールチーム「JOSHU RYDEEN」は9月1日、スポーツメーカーの株式会社アップセットとオフィシャルサプライヤー契約を締結したと発表した。",
    date: "2026.09.01",
    thumb: "../assets/journal-066-hero.jpg",
    tile: "JOSHU RYDEEN × UPSET"
  },
  {
    href: "065-uenohara-sunrise-jumpshot3x3.html",
    cat: "JAPAN",
    title: "世界一に続き、国際舞台で準優勝 —— 上野原サンライズ女子、シンガポール「Jumpshot 3x3」で1st Runner Up",
    excerpt: "ジェリービーンズグループが提携する3x3チーム「上野原サンライズ」の女子チームは、シンガポールで開催された国際大会「Jumpshot 3x3 Season 3: Play Bigger」女子の部で準優勝したと9月1日発表した。",
    date: "2026.09.01",
    thumb: "../assets/journal-065-hero.jpg",
    tile: "UENOHARA SUNRISE"
  },
  {
    href: "064-unext-bleague-streaming.html",
    cat: "NBA",
    title: "U-NEXT、B.LEAGUE新体制の全試合を見放題配信 —— B.PREMIER・B.ONE、9月22日開幕",
    excerpt: "U-NEXTは9月1日、9月22日開幕の「りそなグループ B.LEAGUE 2026-27 SEASON」でB.PREMIER最大803試合に加え、新たにB.ONE最大798試合も見放題でライブ配信すると発表した。追加課金なしで全試合が視聴できる。",
    date: "2026.09.01",
    thumb: "../assets/journal-064-hero.jpg",
    tile: "U-NEXT × B.LEAGUE"
  },
  {
    href: "063-bambitious-basketball-day.html",
    cat: "JAPAN",
    title: "バンビシャス奈良「バスケの日2026 in 奈良市」開催 —— 奈良市長も参加、約8時間バスケ三昧の一日に",
    excerpt: "バンビシャス奈良は8月29日、老若男女が一日バスケを楽しむ「バスケの日2026 in 奈良市」をロートアリーナ奈良で開催した。仲川げん奈良市長も参加し、フリースロー大会や中学生以上の8分流し試合など多彩な企画で朝から夕方まで盛り上がった。",
    date: "2026.09.01",
    thumb: "../assets/journal-063-hero.jpg",
    tile: "BASKET DAY 2026"
  },
  {
    href: "062-zamst-kawamura-sponsorship.html",
    cat: "JAPAN",
    title: "ザムスト、河村勇輝選手とスポンサーシップ契約を更新 —— 2021年から続く4年目のパートナーシップ",
    excerpt: "日本シグマックスは9月1日、サポート・ケア製品ブランド「ZAMST」と河村勇輝選手のスポンサーシップ契約を更新したと発表した。大学生だった2021年からの関係が、米国挑戦を続ける現在も継続する。",
    date: "2026.09.01",
    thumb: "../assets/journal-062-hero.jpg",
    tile: "ZAMST × KAWAMURA"
  },
  {
    href: "061-hamada-sakai-ambassador.html",
    cat: "JAPAN",
    title: "全中制覇の濵田誉（四日市メリノール学院）、堺整骨院とアンバサダー契約 —— 熊本地震復興応援大会も9月開催",
    excerpt: "堺整骨院グループは9月1日、全国中学校バスケットボール大会を制した濵田誉選手（四日市メリノール学院中学校3年）とアンバサダー契約を締結したと発表した。あわせて熊本地震復興応援「堺整骨院杯」を9月5・6日に熊本県で開催する。",
    date: "2026.09.01",
    thumb: "../assets/journal-061-hero.jpg",
    tile: "HAMADA HOMARE"
  },
  {
    href: "060-his-bleague-partnership.html",
    cat: "NBA",
    title: "HIS、B.LEAGUEと「グローカル・パートナー」契約 —— 公式ツアー「B.旅」独占展開へ",
    excerpt: "HISは8月31日、B.LEAGUEとグローカル・パートナー契約を締結したと発表した。全クラブ対象の公式観戦ツアー「B.旅」の企画・販売独占権を取得し、アジア中心の海外プロモーションやインバウンド送客も進める。",
    date: "2026.08.31",
    thumb: "../assets/journal-060-hero.jpg",
    tile: "HIS x B.LEAGUE"
  },
  {
    href: "059-streetball-courtmap.html",
    cat: "JAPAN",
    title: "首都圏189件、コートマップで一望 ——「バスケしようよ！」が新機能公開",
    excerpt: "草バスケコミュニティサービス「バスケしようよ！」を運営する株式会社Walkersは8月31日、首都圏のストリートバスケットボールコート189件を地図から探せる新機能「コートマップ」を公開したと発表した。東京110件・千葉29件・埼玉28件・神奈川22件を掲載し、会員登録不要・無料で利用できる。",
    date: "2026.08.31",
    thumb: "../assets/journal-059-hero.jpg",
    tile: "COURT MAP"
  },
  {
    href: "058-bambitious-basketball-festival.html",
    cat: "JAPAN",
    title: "王寺町とバンビシャス奈良、バスケットボールフェスティバル開催 —— シュート大会や3x3で子どもたちと交流",
    excerpt: "B.LEAGUE・バンビシャス奈良は8月23日、奈良県王寺町のいずみアリーナで「バスケットボールフェスティバル」を実施したと発表した。シュート大会やバスケットボール教室、3x3の試合、抽選会など多彩な企画で、選手と多くの子どもたちが交流した。",
    date: "2026.08.31",
    thumb: "../assets/journal-058-hero.jpg",
    tile: "BAMBITIOUS"
  },
  {
    href: "057-converse-2faced.html",
    cat: "KICKS",
    title: "隠れた名作「COURT STAR」が令和に蘇る —— コンバース「2FACED」9月11日先行発売",
    excerpt: "コンバースジャパンは8月31日、80年代のアーカイブモデル「COURT STAR」を現代技術でアップデートしたバスケットボールシューズ「2FACED」を発表。MID・LOW・LE LOWの3モデルを9月11日にGALLERY・2 渋谷店とKinetics HARAJUKUで先行発売する。",
    date: "2026.08.31",
    thumb: "../assets/journal-057-hero.jpg",
    tile: "2FACED"
  },
  {
    href: "056-josh-green-jazz-trade.html",
    cat: "NBA",
    title: "ジョシュ・グリーン、ジャズへトレード成立 —— ティンバーウルブズ、クミンガ契約完了へサラリー捻出",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ミネソタ・ティンバーウルブズはウィングのジョシュ・グリーンと現金をユタ・ジャズへトレードし、見返りにコーディ・ウィリアムズとジョン・コンチャーを獲得。グリーンの1470万ドルの給与を放出し、ジョナサン・クミンガとの2年1240万ドル契約を完了させるための資金繰りだった。",
    date: "2026.08.29",
    thumb: "../assets/journal-056-hero.jpg",
    tile: "JOSH GREEN"
  },
  {
    href: "055-rimtown-basketball-school.html",
    cat: "JAPAN",
    title: "在籍200名突破 —— バスケットボールスクール「Rimtown」、元Bリーガー・齊藤洋介が指導",
    excerpt: "東京・神奈川・埼玉でバスケットボールスクール「Rimtown」を運営する株式会社neveleは、2026年8月にスクール在籍者数が200名を突破したと発表した。元Bリーガー・元3x3日本代表の齊藤洋介がメインコーチを務め、スキルだけでなく試合での判断力を養う指導を行っている。",
    date: "2026.08.28",
    thumb: "../assets/journal-055-hero.jpg",
    tile: "RIMTOWN"
  },
  {
    href: "054-crane-thunders-afterschool.html",
    cat: "JAPAN",
    title: "夏休み、体育館に響いた歓声 —— 群馬クレインサンダーズ、県内7市町の放課後児童クラブを訪問",
    excerpt: "群馬クレインサンダーズは、群馬県が実施する「プロスポーツチーム等と連携したこどもの居場所づくり・体験創出モデル事業」の一環として、県内7市町の放課後児童クラブを訪問し、子どもたちを対象としたバスケットボール体験を実施したと8月28日発表した。基礎練習に加えゲーム性を取り入れたメニューを通じ、体を動かす楽しさや仲間と協力する大切さを伝えた。",
    date: "2026.08.28",
    thumb: "../assets/journal-054-hero.jpg",
    tile: "CRANE THUNDERS"
  },
  {
    href: "053-yoneda-u18-tryout.html",
    cat: "JAPAN",
    title: "奈良から次世代の舞台へ —— バンビシャス奈良U18・米田時生、B.LEAGUE U18 TRYOUT CAMP 2026に初選出",
    excerpt: "バンビシャス奈良U18に所属する米田時生選手（SG、175cm）が、B.LEAGUEユース育成プロジェクトの一環「B.LEAGUE U18 TRYOUT CAMP 2026」に初選出されたと、同クラブが8月27日発表した。キャンプは9月5・6日に駒沢オリンピック公園総合運動場 屋内球技場で行われる。",
    date: "2026.08.27",
    thumb: "../assets/journal-053-hero.jpg",
    tile: "YONEDA"
  },
  {
    href: "052-lowry-raptors-retired-number.html",
    cat: "NBA",
    title: "フランチャイズ史上2人目の栄誉 —— ラプターズ、カイル・ラウリーの背番号7永久欠番を発表",
    excerpt: "トロント・ラプターズは、カイル・ラウリーの背番号7を永久欠番にすると8月27日発表した。2026年1月10日のフィラデルフィア・セブンティシクサーズ戦後にセレモニーを行い、バンス・カーターに次ぐ球団史上2人目の永久欠番選手となる。ラウリーは9シーズン在籍しオールスター6回選出、2018-19シーズンの優勝メンバーだった。",
    date: "2026.08.27",
    thumb: "../assets/journal-052-hero.jpg",
    tile: "LOWRY"
  },
  {
    href: "051-nakamura-asano-jonescup.html",
    cat: "JAPAN",
    title: "台湾で掴んだ国際経験 —— 群馬クレインサンダーズ・中村拓人、淺野ケニー、日本代表として第45回ウィリアム・ジョーンズカップ出場",
    excerpt: "群馬クレインサンダーズ所属の中村拓人選手、淺野ケニー選手が、2026年度バスケットボール男子日本代表として台湾で開催された「第45回ウィリアム・ジョーンズカップ」に出場したと同クラブが8月27日発表した。中村選手は4試合で26得点・13リバウンド・18アシスト、淺野選手は6試合で25得点・17リバウンド・2アシストを記録した。",
    date: "2026.08.27",
    thumb: "../assets/journal-051-hero.jpg",
    tile: "JONES CUP"
  },
  {
    href: "050-hokurikugakuin-komatsuwall.html",
    cat: "JAPAN",
    title: "地元企業が支える全国区の挑戦 —— 小松ウオール、北陸学院高校 男子バスケットボール部のメインパートナーに就任",
    excerpt: "石川県小松市の小松ウオール工業株式会社は、同県を拠点とする北陸学院高等学校 男子バスケットボール部のメインパートナーに就任したと8月27日発表した。8月22日に開幕した「U18日清食品トップリーグ2026 Div.1」に出場する同部を環境面から支援する。",
    date: "2026.08.27",
    thumb: "../assets/journal-050-hero.jpg",
    tile: "HOKURIKUGAKUIN"
  },
  {
    href: "049-yoshii-japan-roster.html",
    cat: "JAPAN",
    title: "茨城ロボッツ・吉井裕鷹選手、日本代表ロスターに選出 —— FIBAワールドカップ2027アジア予選、サウジアラビア戦",
    excerpt: "茨城ロボッツの吉井裕鷹選手が、8月28日未明(日本時間)にサウジアラビアで行われる「FIBAバスケットボールワールドカップ2027アジア地区予選Window4」のサウジアラビア代表戦で日本代表のロスターに選出されたと茨城ロボッツが8月27日発表した。",
    date: "2026.08.27",
    thumb: "../assets/journal-049-hero.jpg",
    tile: "YOSHII"
  },
  {
    href: "048-fujita-japan-coach.html",
    cat: "JAPAN",
    title: "大阪エヴェッサ・藤田弘輝HC、日本代表コーチに選出 —— FIBAワールドカップ2027アジア予選、サウジアラビア戦で指揮",
    excerpt: "大阪エヴェッサの藤田弘輝ヘッドコーチが、8月28日にサウジアラビアで行われる「FIBAバスケットボールワールドカップ2027アジア地区予選Window4」のサウジアラビア戦で日本代表コーチに選出されたと大阪エヴェッサが8月27日発表した。",
    date: "2026.08.27",
    thumb: "../assets/journal-048-hero.jpg",
    tile: "FUJITA"
  },
  {
    href: "047-kuminga-timberwolves.html",
    cat: "NBA",
    title: "ジョナサン・クミンガ、ティンバーウルブズ入り合意 —— 2年1240万ドル、レイカーズのサインアンドトレード案を退ける",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。フリーエージェントのジョナサン・クミンガ(23)がミネソタ・ティンバーウルブズと2年1240万ドル(2年目にプレーヤーオプション付き)の契約に合意。レイカーズなど複数球団の争奪戦を制し、来夏の完全なフリーエージェント権取得を見据えた短期契約を選んだ。",
    date: "2026.08.26",
    thumb: "../assets/journal-047-hero.jpg",
    tile: "KUMINGA"
  },
  {
    href: "046-mathurin-pelicans.html",
    cat: "NBA",
    title: "ベネディクト・マチュリン、ペリカンズ入り合意 —— 2年1600万ドル、クリッパーズへのQO撤回で移籍実現",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ベネディクト・マチュリン(24)がニューオーリンズ・ペリカンズと2年1600万ドル(プレーヤーオプション付き)の契約に合意。クリッパーズへのクオリファイング・オファーを撤回しての移籍となった。",
    date: "2026.08.26",
    thumb: "../assets/journal-046-hero.jpg",
    tile: "MATHURIN"
  },
  {
    href: "045-crane-thunders-clinic.html",
    cat: "JAPAN",
    title: "中学・高校生34人が参加 —— 群馬クレインサンダーズ、鶴巻啓太・細川一輝が指導するバスケットボールスキルアップクリニックを開催",
    excerpt: "群馬クレインサンダーズは8月2日・9日の2日間、群馬パース大学で「バスケットボールスキルアップクリニック」を開催。鶴巻啓太選手・細川一輝選手が指導にあたり、県内外の中学生・高校生34人が参加した。",
    date: "2026.08.26",
    thumb: "../assets/journal-045-hero.jpg",
    tile: "CRANE THUNDERS"
  },
  {
    href: "044-kings-academy-cup-2026.html",
    cat: "JAPAN",
    title: "北部地域と交流、約90人が参加 —— 琉球ゴールデンキングス「KINGS ACADEMY CUP 2026」を名護市で開催",
    excerpt: "沖縄バスケットボール株式会社（琉球ゴールデンキングス）が運営するキングスアカデミーは8月23日、沖縄県名護市で「KINGS ACADEMY CUP 2026」を開催。北部地域の部活動チームとスクール生ら約90人が参加した。",
    date: "2026.08.26",
    thumb: "../assets/journal-044-hero.jpg",
    tile: "KINGS ACADEMY"
  },
  {
    href: "043-payrollcup-4th-wheelchair.html",
    cat: "JAPAN",
    title: "車いすバスケ「ペイロールカップ」第4回、9月26日・27日に札幌開催 —— 札幌ノースウィンドなど6チームが参加",
    excerpt: "株式会社ペイロールが車いすバスケットボール大会「ペイロールカップ」第4回を2026年9月26日・27日に札幌市西区体育館で開催。今回は6チームが参加し、入場は無料。",
    date: "2026.08.26",
    thumb: "../assets/journal-043-hero.jpg",
    tile: "PAYROLLCUP"
  },
  {
    href: "042-broncos-akita-preseason.html",
    cat: "JAPAN",
    title: "さいたまブロンコス vs 秋田ノーザンハピネッツ、プレシーズンマッチを8月29日開催 —— Red EyeやENBASEが試合前を彩る",
    excerpt: "さいたまブロンコスが8月29日、蓮田市総合市民体育館パルシーでB.PREMIERの秋田ノーザンハピネッツを迎えるプレシーズンマッチを開催。試合前にはRed EyeやENBASEによるオープニングイベントも行われる。",
    date: "2026.08.26",
    thumb: "../assets/journal-042-hero.jpg",
    tile: "BRONCOS"
  },
  {
    href: "041-niang-warriors.html",
    cat: "NBA",
    title: "ウォリアーズがジョージ・ニアングと1年390万ドルで契約合意 —— ブランドン・ウィリアムズに続く今夏2人目の補強、15人ロースターが確定",
    excerpt: "ゴールデンステート・ウォリアーズがフリーエージェントのベテランPF、ジョージ・ニアングと1年390万ドルで契約合意。ESPNのシャムズ・チャラニア氏が一報。同日発表のブランドン・ウィリアムズに続く今夏2人目の外部補強で、15人ロースターが確定した。",
    date: "2026.08.25",
    thumb: "../assets/journal-041-hero.jpg",
    tile: "NIANG"
  },
  {
    href: "040-williams-warriors.html",
    cat: "NBA",
    title: "ウォリアーズがブランドン・ウィリアムズと1年260万ドルで契約合意 —— マーベリックスから加入、バトラー&ムーディ離脱のベンチ層を補強",
    excerpt: "ゴールデンステート・ウォリアーズがフリーエージェントのガード、ブランドン・ウィリアムズと1年260万ドル(最低保証額)で契約合意。代理人がESPNのシャムズ・チャラニア氏に明らかにした。マーベリックスから加入し、開幕から離脱するバトラーとムーディの穴を埋める狙い。",
    date: "2026.08.25",
    thumb: "../assets/journal-040-hero.jpg",
    tile: "WILLIAMS"
  },
  {
    href: "039-sharpe-injury.html",
    cat: "NBA",
    title: "シェイドン・シャープが右膝半月板損傷 —— ブレイザーズの23歳、全治6ヶ月で2026-27シーズン大半を欠場へ",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ポートランド・トレイルブレイザーズのシェイドン・シャープ(23)が右膝の半月板を損傷し、全治6ヶ月の見通し。前季に続き2年連続の長期離脱となる。",
    date: "2026.08.24",
    thumb: "../assets/journal-039-hero.jpg",
    tile: "SHARPE"
  },
  {
    href: "038-jue-jones-cup-wkbl.html",
    cat: "JAPAN",
    title: "日本経済大学、バスケ部の監督と学生が国際舞台へ —— 片桐監督が日本代表コーチとしてジョーンズカップ、中老選手はWKBLフューチャーズリーグの日本学生選抜に",
    excerpt: "日本経済大学男子バスケットボール部の片桐章光監督が台湾開催「第45回ウィリアム・ジョーンズカップ」に日本代表コーチとして参加。女子バスケットボール部の中老小雪選手は日本学生選抜に選出され、案浦知仁監督もアシスタントコーチとして韓国開催の「2026 WKBLフューチャーズリーグ」に参加した。",
    date: "2026.08.24",
    thumb: "../assets/journal-038-hero.jpg",
    tile: "JUE HOOPS"
  },
  {
    href: "037-haruyoshi-yanagigaura.html",
    cat: "JAPAN",
    title: "陽吉グループ、大分・柳ヶ浦高校男子バスケ部のスポンサーに就任 —— U18日清食品トップリーグ2026初出場、開幕戦で鳥取城北を67-57で撃破",
    excerpt: "リユース企業の陽吉グループが大分県・柳ヶ浦高校男子バスケットボール部のスポンサーに就任し、ユニフォームを贈呈した。柳ヶ浦は「U18日清食品トップリーグ2026 ディビジョン1」に初出場し、8月22日の開幕戦で鳥取城北を67-57で破って白星スタートを切った。",
    date: "2026.08.24",
    thumb: "../assets/journal-037-hero.jpg",
    tile: "YANAGIGAURA"
  },
  {
    href: "036-anker-nagasaki-velca.html",
    cat: "JAPAN",
    title: "Anker Japan、Bリーグ王者・長崎ヴェルカとトップパートナー契約 —— ユニフォーム胸ロゴとアリーナ命名権を取得、直営店も出店",
    excerpt: "アンカー・ジャパンがB.LEAGUE王者の長崎ヴェルカとトップパートナー契約を締結。2026-27シーズンユニフォーム胸部へのロゴ掲出やホームアリーナ「HAPPINESS ARENA」の命名権を取得し、長崎県内に直営店「Anker Store」を2店舗出店する。",
    date: "2026.08.23",
    thumb: "../assets/journal-036-hero.jpg",
    tile: "ANKER"
  },
  {
    href: "035-fukuyama-denix-homegame.html",
    cat: "JAPAN",
    title: "びんご福山デニックス、9月12日・13日にホームゲーム —— 観戦無料、九州電力・富士通と対戦",
    excerpt: "広島県福山市を拠点にSB1リーグで戦うびんご福山デニックスが、2026年9月12日・13日にエフピコアリーナふくやまで観戦無料のホームゲームを開催する。対戦相手は九州電力(福岡)と富士通(神奈川)。",
    date: "2026.08.22",
    thumb: "../assets/journal-035-hero.jpg",
    tile: "DENIX"
  },
  {
    href: "034-derozan-nuggets.html",
    cat: "NBA",
    title: "デマー・デローザン、ナゲッツ入り合意 —— ヒート等蹴り1年390万ドル、ヨキッチ&マレーの下でプレーオフ勝負へ",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。6度のオールスターに選出されたデマー・デローザン(36)が、ヒート・ウィザーズ・ペリカンズとの交渉を経てデンバー・ナゲッツと1年390万ドルの契約に合意したと報じられた。",
    date: "2026.08.21",
    thumb: "../assets/journal-034-hero.jpg",
    tile: "DEROZAN"
  },
  {
    href: "033-klay-thompson-heat.html",
    cat: "NBA",
    title: "クレイ・トンプソン、マーベリックス退団へ —— ヒート入り濃厚、ジアニス擁する優勝候補に加入",
    excerpt: "ESPNのシャムズ・チャラニア氏が一報。ダラス・マーベリックスがクレイ・トンプソン(36)との契約を買い取ることで合意し、ウェイバー通過後はマイアミ・ヒートと契約する見通しだと報じられた。",
    date: "2026.08.21",
    thumb: "../assets/journal-033-hero.jpg",
    tile: "KLAY"
  },
  {
    href: "032-timberwolves-lynx-stad.html",
    cat: "NBA",
    title: "ティンバーウルブズ&リンクス、支配株主が交代 —— マーク・スタッド氏がロア氏保有株の大半を取得、評価額45億ドル",
    excerpt: "ESPNが情報筋の話として報道。NBAミネソタ・ティンバーウルブズとWNBAミネソタ・リンクスの共同オーナー、マーク・ロア氏が保有株式の大半をマーク・スタッド氏に売却し、スタッド氏が両球団の支配株主・筆頭株主になることで合意した。",
    date: "2026.08.21",
    thumb: "../assets/journal-032-hero.jpg",
    tile: "OWNERSHIP"
  },
  {
    href: "031-sportsnavi-u18-league.html",
    cat: "JAPAN",
    title: "高校バスケの頂点争い、全56試合を無料生中継 —— スポーツナビ「U18日清食品トップリーグ2026」ライブ配信・速報",
    excerpt: "スポーツナビ株式会社は、高校バスケットボール最高峰リーグ「U18日清食品トップリーグ2026 ディビジョン1」全56試合を8月22日から11月15日にかけてライブ配信・試合速報で無料展開すると発表した。",
    date: "2026.08.21",
    thumb: "../assets/journal-031-hero.jpg",
    tile: "U18 LEAGUE"
  },
  {
    href: "030-kings-summer-camp-2026.html",
    cat: "JAPAN",
    title: "コートを3分割、実戦スキルを叩き込む —— 琉球ゴールデンキングス「キングスバスケットボールスクールサマーキャンプ2026」",
    excerpt: "沖縄バスケットボール株式会社(琉球ゴールデンキングス)が運営するキングスバスケットボールスクールは、7月29日・8月5日・8月19日の3日間、小学4〜6年生を対象に『サマーキャンプ2026』を実施したと発表した。",
    date: "2026.08.21",
    thumb: "../assets/journal-030-hero.jpg",
    tile: "KINGS"
  },
  {
    href: "029-agest-tubc-partner.html",
    cat: "JAPAN",
    title: "「機敏性」で重なる2社 —— AGEST、東京ユナイテッドバスケットボールクラブとオフィシャルパートナー契約",
    excerpt: "ソフトウェア品質支援のAGESTが2026-27シーズンより、有明アリーナ拠点のB.LEAGUEクラブ・東京ユナイテッドバスケットボールクラブ(TUBC)とオフィシャルパートナー契約を締結した。",
    date: "2026.08.21",
    thumb: "../assets/journal-029-hero.jpg",
    tile: "TUBC"
  },
  {
    href: "028-harden-cavaliers.html",
    cat: "NBA",
    title: "ハーデン、キャバリアーズ残留 —— 3年9700万ドルの新契約で合意",
    excerpt: "ジェームズ・ハーデンが、3年総額9700万ドルの新契約でクリーブランド・キャバリアーズに残留することで合意した。2028-29シーズンのプレーヤーオプションとトレードキッカー付き。代理人らがESPNに明らかにした。",
    date: "2026.08.20",
    thumb: "../assets/journal-028-hero.jpg",
    tile: "HARDEN"
  },
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
