// 610 JOURNAL 共通スクリプト
// 記事メタデータ(日付降順)。新記事を追加したらここに1件足す。
// thumb: 実写真のパス(あれば必ず優先) / tile: 写真がない記事用のタイポグラフィ表紙
const ARTICLES = [
  {
    href: "991-shai-gilgeous-alexander-40-points-clippers.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、クリッパーズ戦で40得点 —— サンダーは112-113の1点差で敗戦",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは敵地ロサンゼルスでのクリッパーズ戦に39分出場し、40得点・リバウンド4・アシスト5を記録した。両チーム通じてこの日の最多得点者となったが、サンダーは112-113の1点差でクリッパーズに敗れた。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "990-hachimura-7-points-thunder.html",
    cat: "NBA",
    title: "八村塁、サンダー戦で7得点11リバウンド —— クリッパーズが113-112の接戦を制す",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は本拠地でのオクラホマシティ・サンダー戦に32分出場し、7得点・リバウンド11・アシスト3を記録した。クリッパーズは113-112の1点差でサンダーを下した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "989-castle-32-points-warriors.html",
    cat: "NBA",
    title: "ステフォン・キャッスル、ウォリアーズ戦で32得点 —— スパーズが123-85で圧勝",
    excerpt: "サンアントニオ・スパーズのステフォン・キャッスルは本拠地でのゴールデンステート・ウォリアーズ戦に25分出場し、32得点・リバウンド5・アシスト6を記録した。両チーム通じてこの日の最多得点者となり、スパーズは123-85でウォリアーズに圧勝した。",
    date: "2026.11.14",
    thumb: "../assets/journal-989-hero.jpg?v=a1de88a148"
  },
  {
    href: "988-avdija-34-points-kings.html",
    cat: "NBA",
    title: "デニ・アヴディア、キングス戦で34得点 —— トレイルブレイザーズが120-107で勝利",
    excerpt: "ポートランド・トレイルブレイザーズのデニ・アヴディアは敵地サクラメントでのキングス戦に35分出場し、34得点・リバウンド6・アシスト4を記録した。両チーム通じてこの日の最多得点者となり、トレイルブレイザーズは120-107でキングスを下した。",
    date: "2026.11.14",
    thumb: "../assets/journal-988-hero.jpg?v=8773fd915e"
  },
  {
    href: "987-sengun-43-points-jazz.html",
    cat: "NBA",
    title: "アルペラン・シェングン、ジャズ戦で43得点 —— ロケッツが125-118で勝利",
    excerpt: "ヒューストン・ロケッツのアルペラン・シェングンは本拠地でのユタ・ジャズ戦に37分出場し、43得点・リバウンド12を記録した。両チーム通じてこの日の最多得点者となり、ロケッツは125-118でジャズに勝利した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "986-saddiq-bey-30-points-grizzlies.html",
    cat: "NBA",
    title: "サディーク・ベイ、グリズリーズ戦で30得点 —— ペリカンズは111-142で大敗",
    excerpt: "ニューオーリンズ・ペリカンズのサディーク・ベイは敵地メンフィスでのグリズリーズ戦に35分出場し、30得点・リバウンド10を記録した。両チーム通じてこの日の最多得点者となったが、ペリカンズは111-142でグリズリーズに大敗した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "985-norman-powell-33-points-hawks.html",
    cat: "NBA",
    title: "ノーマン・パウエル、ホークス戦で33得点 —— ブルズが延長で125-117の勝利",
    excerpt: "シカゴ・ブルズのノーマン・パウエルは本拠地でのアトランタ・ホークス戦に31分出場し、33得点を記録した。両チーム通じてこの日の最多得点者となり、ブルズは延長戦に持ち込んだ末125-117でホークスを下した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "984-bam-adebayo-37-points-cavaliers.html",
    cat: "NBA",
    title: "バム・アデバヨ、キャバリアーズ戦で37得点 —— ヒートが133-121で勝利",
    excerpt: "マイアミ・ヒートのバム・アデバヨは本拠地でのクリーブランド・キャバリアーズ戦に38分出場し、37得点・リバウンド14を記録した。ヤニス・アデトクンボと並び両チーム通じてこの日の最多得点者となり、ヒートは133-121でキャバリアーズに勝利した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "983-giannis-antetokounmpo-37-points-cavaliers.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ、キャバリアーズ戦で37得点 —— ヒートが133-121で勝利",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは本拠地でのクリーブランド・キャバリアーズ戦に31分出場し、37得点・リバウンド9を記録した。バム・アデバヨと並び両チーム通じてこの日の最多得点者となり、ヒートは133-121でキャバリアーズに勝利した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "982-jalen-brunson-33-points-pacers.html",
    cat: "NBA",
    title: "ジェイレン・ブランソン、ペイサーズ戦で33得点 —— ニックスは104-106で惜敗",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンは敵地インディアナでのペイサーズ戦に36分出場し、33得点・アシスト11を記録した。両チーム通じてこの日の最多得点者となったが、ニックスは104-106でペイサーズに惜敗した。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "981-franz-wagner-35-points-bucks.html",
    cat: "NBA",
    title: "フランツ・ワグナー、バックス戦で35得点 —— マジックが107-99で勝利",
    excerpt: "オーランド・マジックのフランツ・ワグナーは現地時間11月13日、本拠地でのミルウォーキー・バックス戦に36分出場し、フィールドゴール22本中13本・3ポイント8本中3本・フリースロー6本を全て沈めて35得点を記録した。アシスト12・リバウンド9も記録し、両チーム通じてこの日の最多得点者となり、マジックは107-99でバックスに勝利した。",
    date: "2026.11.14",
    thumb: "../assets/journal-981-hero.jpg?v=4cf3e72f9b"
  },
  {
    href: "980-social-status-air-jordan-1-low-sashiko.html",
    cat: "KICKS",
    title: "Social Status × Air Jordan 1 Low OG「Sashiko」—— 和の刺し子柄をあしらった新色、2026年12月発売",
    excerpt: "The Whitaker Groupのスニーカー店「Social Status」とJordan Brandのコラボレーションとして、Air Jordan 1 Low OGの新色「Sashiko」が2026年12月に発売される。品番IU4982-600。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "979-dejounte-murray-sit-out-pelicans.html",
    cat: "NBA",
    title: "デジャンテ・マレー「今季はもうプレーしない」—— トレード要求の解決待ち、サンズが興味",
    excerpt: "ニューオーリンズ・ペリカンズのデジャンテ・マレーが、トレード要求が解決するまで今季はもう出場しない意向をチームに伝えたとESPNのシャムズ・シャラニア記者が報じた。フェニックス・サンズが興味を示しているとも伝えられている。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "978-dejounte-murray-trade-request-pelicans.html",
    cat: "NBA",
    title: "デジャンテ・マレー、ペリカンズにトレード志望を伝える —— 代理人リッチ・ポールらと解決へ協議中",
    excerpt: "ニューオーリンズ・ペリカンズのデジャンテ・マレーが球団にトレードを志望していることが分かった。代理人のリッチ・ポール（Klutch Sports CEO）とチーム関係者が解決に向けた協議を始めているとESPNのシャムズ・シャラニア記者が報じている。チームは開幕4勝8敗で4連敗中。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "977-doug-mcdermott-retires.html",
    cat: "NBA",
    title: "ダグ・マクダーモット、12シーズンのNBA生活に幕 —— 7球団を渡った3P職人、通算41%の外角精度",
    excerpt: "ダグ・マクダーモットが現役引退を発表した。2014年ドラフト全体11位から12シーズンで7球団を渡り、通算726試合で3P成功率41%を残した外角のスペシャリストだった。エージェンシーのPriority Sportsが発表し、ESPNが伝えている。",
    date: "2026.11.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "976-donovan-mitchell-cavaliers-belief.html",
    cat: "NBA",
    title: "ドノバン・ミッチェル、4年2億7300万ドルに託したもの —— 6勝6敗のキャバリアーズと「まだ一歩」の自覚",
    excerpt: "クリーブランド・キャバリアーズのドノバン・ミッチェルは今夏、4年2億7300万ドルの延長契約にサインした。来夏まで待てば8000万ドルを上積みできる状況での決断だった。開幕6勝6敗と苦しむチームへの思いをESPNの特集記事で語っている。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "975-kobe-9-em-low-protro-philippines.html",
    cat: "KICKS",
    title: "KOBE 9 EM LOW PROTRO「Laser Crimson & Obsidian」—— フィリピンのバスケ文化を刻んだプロトロ版が登場",
    excerpt: "2014年に限定発売されたKOBE 9 LOWがプロトロ仕様でカムバック。フィリピン伝統の手織り「バニッグ」をモチーフにしたプリントや、乗合バス「ジプニー」をイメージしたクロム調アクセントなど、現地のバスケットボール文化へのオマージュを随所に取り入れた新色「Laser Crimson & Obsidian」。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "974-air-jordan-12-atmos-jade.html",
    cat: "KICKS",
    title: "AIR JORDAN 12「atmos JADE」が11月21日発売 —— atmosとTOKYO 23だけの世界限定、誕生30周年に\"JADE\"カラー復活",
    excerpt: "atmos（アトモス）とTOKYO 23は、誕生30周年を迎えたAir Jordan 12をベースにした限定モデル「AIR JORDAN 12 RETRO \"atmos JADE\"」を2026年11月21日に発売する。世界で両店舗だけの限定販売で、価格は31,900円（税込）。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "973-stephen-curry-oblique-injury.html",
    cat: "NBA",
    title: "ステフィン・カリー、腹斜筋損傷で最低2週間離脱 —— ウォリアーズは最大1ヶ月の欠場も想定",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリー(Stephen Curry)は現地時間11日のヒューストン・ロケッツ戦で腹斜筋を損傷し、最低2週間の離脱となることが分かった。ESPNのシャムズ・チャラニア記者が情報源の話として伝え、チーム内では復帰までおよそ1ヶ月近くを要する可能性も想定されているという。",
    date: "2026.11.13",
    thumb: "../assets/journal-973-hero.jpg?v=7b41a57397"
  },
  {
    href: "972-nagoya-dolphins-jazz-dream-nagashima.html",
    cat: "JAPAN",
    title: "名古屋ダイヤモンドドルフィンズ、三井アウトレットパーク ジャズドリーム長島とオフィシャルパートナー契約 —— 2027年3月31日にIGアリーナで冠試合",
    excerpt: "B.LEAGUE PREMIER所属の名古屋ダイヤモンドドルフィンズは、三井不動産商業マネジメントが運営する三井アウトレットパーク ジャズドリーム長島と2026-27シーズンのオフィシャルパートナー契約を締結した。2027年3月31日にIGアリーナで開催されるアルティーリ千葉戦が同施設の冠試合となる。",
    date: "2026.11.13",
    thumb: "../assets/journal-972-hero.jpg?v=5012fc105a"
  },
  {
    href: "971-devin-booker-30-points-hornets.html",
    cat: "NBA",
    title: "デビン・ブッカー、ホーネッツ戦で30得点 —— サンズが101-96で勝利",
    excerpt: "フェニックス・サンズのデビン・ブッカー(Devin Booker)は現地時間11月12日、本拠地でのシャーロット・ホーネッツ戦に35分出場し、フィールドゴール20本中12本・3ポイント8本中4本を沈めて30得点を記録した。アシスト7・スティール3も記録し、両チーム通じてこの日の最多得点者となり、サンズは101-96でホーネッツを下した。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "970-bones-hyland-24-points-mavericks.html",
    cat: "NBA",
    title: "ボーンズ・ハイランド、マーベリックス戦でチーム最多24得点 —— ティンバーウルブズが133-94で大勝",
    excerpt: "ミネソタ・ティンバーウルブズのボーンズ・ハイランド(Bones Hyland)は現地時間11月12日のダラス・マーベリックス戦にベンチから23分出場し、フィールドゴール10本中7本・3ポイント6本中5本を沈めて24得点を記録した。アシスト8・スティール2も記録し、両チーム通じてこの日の最多得点者となり、ティンバーウルブズは133-94でマーベリックスに大勝した。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "969-cade-cunningham-52-points-wizards.html",
    cat: "NBA",
    title: "ケイド・カニンガム、ウィザーズ戦で52得点 —— ピストンズが144-140の乱打戦を制す",
    excerpt: "デトロイト・ピストンズのケイド・カニンガム(Cade Cunningham)は現地時間11月12日、敵地でのワシントン・ウィザーズ戦に48分フル出場し、フィールドゴール25本中16本・3ポイント5本中3本・フリースロー18本中17本を沈めて52得点を記録した。アシスト11・リバウンド5も記録し、両チーム通じてこの日の最多得点者となり、ピストンズは144-140の乱打戦でウィザーズを下した。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "968-rj-barrett-31-points-76ers.html",
    cat: "NBA",
    title: "RJ・バレット、76ers戦で31得点 —— ラプターズは112-123で敗れる",
    excerpt: "トロント・ラプターズのRJ・バレット(RJ Barrett)は現地時間11月12日、敵地でのフィラデルフィア・76ers戦に37分出場し、フィールドゴール20本中13本・3ポイント7本中4本を沈めて31得点を記録した。リバウンド14・アシスト5も記録し、両チーム通じてこの日の最多得点者となったが、ラプターズは112-123で76ersに敗れた。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "967-shinjuku-givers-tipness-sponsor.html",
    cat: "JAPAN",
    title: "新宿givers、ティップネスとスポンサー契約 —— 東新宿で「女子スポーツ×地域×フィットネス」を発信",
    excerpt: "女子3人制バスケットボールチーム「新宿givers」は、2026年11月1日付でティップネス東新宿を運営する株式会社ティップネスとスポンサー契約を締結した。選手の競技活動支援に加え、試合・イベント・SNSを通じた同店の紹介や地域向けイベントなど、新宿エリアでの連携に取り組む。",
    date: "2026.11.13",
    thumb: "../assets/journal-967-hero.jpg?v=b8dca0f2a3"
  },
  {
    href: "966-rockets-smart-suspended.html",
    cat: "NBA",
    title: "ロケッツのマーカス・スマート、3試合出場停止 —— ウォリアーズ戦でバセイに右フックが接触",
    excerpt: "NBAはロケッツのマーカス・スマートに、ウォリアーズのチャールズ・バセイへパンチを放ったとして無給3試合の出場停止処分を科した。ESPNが報じた。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "965-bleague-sports-business-award.html",
    cat: "JAPAN",
    title: "B.LEAGUE、「第2回スポーツビジネスアワード」で大賞受賞 —— 評価されたのは「B.革新」の経営改革",
    excerpt: "B.LEAGUEが11月12日開催の「Sports Business Summit 2026」内「第2回スポーツビジネスアワード」でスポーツビジネス大賞を受賞。2026-27シーズンから始動したリーグ構造改革「B.革新」が評価された。",
    date: "2026.11.13",
    thumb: "../assets/journal-965-hero.jpg?v=06158f2ae4"
  },
  {
    href: "964-caleb-wilson-hand-surgery.html",
    cat: "NBA",
    title: "ブルズのケイレブ・ウィルソン、右手骨折で手術へ —— 4〜6週間の離脱、開幕1勝9敗を支えたルーキー",
    excerpt: "シカゴ・ブルズのルーキー、ケイレブ・ウィルソンが右手骨折の手術を受け、4〜6週間の離脱が見込まれることが分かった。11日のスパーズ戦で負傷。開幕1勝9敗のブルズを平均18.9得点で支えていた。ESPNが報じた。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "963-air-jordan-6-carmine-2027.html",
    cat: "KICKS",
    title: "Air Jordan 6「Carmine」が2027年3月に復刻 —— 初めてヒールに「Nike Air」ロゴ、品番CT8529-109",
    excerpt: "Jordan Brandは、1991年発売のオリジナルカラー「Air Jordan 6 \"Carmine\"」(品番CT8529-109)を2027年3月に復刻する。これまでの復刻で使われてきたジャンプマンロゴに代わり、初めてヒールに「Nike Air」ロゴが入る仕立て。米Sneaker News、Sneaker Bar Detroitが伝えた。",
    date: "2026.11.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "962-nba-trade-deadline-contenders-preview.html",
    cat: "NBA",
    title: "NBAトレードデッドラインの「欠けている一枚」—— ESPN記者陣が読むニックス・サンダーなど強豪10チームの課題",
    excerpt: "ESPNのNBA担当記者陣は11月11日、2027年2月11日のトレードデッドラインを見据えた特集でBPI上位10チームの補強ポイントを分析。サンダー・ウルブズは主力離脱、前年王者ニックスは資産の乏しさ、レイカーズは守備リバウンド不足が課題と指摘した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "961-curry-abdominal-injury-mri.html",
    cat: "NBA",
    title: "ステフィン・カリーが腹部を負傷、MRI検査へ —— ウォリアーズ「懸念は大きい」、8連勝ならずロケッツに敗れる",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリーが現地時間11月11日のロケッツ戦で右腹部を負傷し途中退場、MRI検査を受けた。スティーブ・カー監督は「懸念は大きい」と語った。チームは108-115で敗れ、8連勝で止まった。ESPNが報じた。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "960-tokyo-derby-sunrockers-alvark.html",
    cat: "JAPAN",
    title: "B.LEAGUE PREMIER初の「東京ダービー」 —— 東京サンロッカーズ×アルバルク東京、11月18日にTOYOTA ARENA TOKYOで激突",
    excerpt: "東京を本拠地とする2クラブ、東京サンロッカーズとアルバルク東京が11月18日(水)19時05分TIP OFF、TOYOTA ARENA TOKYOで対戦する。試合名称は「東京ダービー Presented by km GROUP」。B.LEAGUE PREMIERになって両クラブの対戦は今回が初めて。国際自動車株式会社がパートナーとして参加すると発表した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "959-yaxel-lendeborg-25-points-rockets.html",
    cat: "NBA",
    title: "ヤクセル・レンデボーグ、ロケッツ戦で25得点10リバウンド —— ウォリアーズは108-115で敗戦",
    excerpt: "ゴールデンステート・ウォリアーズのヤクセル・レンデボーグは現地時間11月11日、敵地ヒューストンでのロケッツ戦に36分出場し、フィールドゴール19本中9本を沈めて25得点・リバウンド10を記録した。両チーム通じてこの日の最多得点者となったが、ウォリアーズは108-115でロケッツに敗れた。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "958-shai-gilgeous-alexander-31-points-blazers.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、トレイルブレイザーズ戦で31得点 —— サンダーが108-118で敗戦",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間11月11日、敵地ポートランドでのトレイルブレイザーズ戦に36分出場し、フィールドゴール20本中9本・フリースロー14本中13本を沈めて31得点を記録した。両チーム通じてこの日の最多得点者となったが、サンダーは108-118でトレイルブレイザーズに敗れた。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "957-franz-wagner-38-points-magic.html",
    cat: "NBA",
    title: "フランツ・ワグナー、ジャズ戦で38得点 —— マジックが123-108で勝利",
    excerpt: "オーランド・マジックのフランツ・ワグナーは現地時間11月11日、敵地ソルトレイクシティでのジャズ戦に39分出場し、フィールドゴール23本中13本・3ポイント8本中3本・フリースロー10本中9本を沈めて38得点を記録した。両チーム通じてこの日の最多得点者となり、マジックは123-108でジャズに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "956-zion-williamson-29-points-nets.html",
    cat: "NBA",
    title: "ザイオン・ウィリアムソン、ネッツ戦で29得点 —— ペリカンズは111-145で大敗",
    excerpt: "ニューオーリンズ・ペリカンズのザイオン・ウィリアムソンは現地時間11月11日、本拠地でのネッツ戦に30分出場し、フィールドゴール14本中8本・フリースロー14本中12本を沈めて29得点を記録した。両チーム通じてこの日の最多得点者となったが、ペリカンズは111-145でネッツに大敗した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "955-jamal-murray-30-points-grizzlies.html",
    cat: "NBA",
    title: "ジャマール・マレー、グリズリーズ戦で30得点 —— ナゲッツが123-118で勝利",
    excerpt: "デンバー・ナゲッツのジャマール・マレーは現地時間11月11日、敵地メンフィスでのグリズリーズ戦に32分出場し、フィールドゴール19本中12本・アシスト8を記録して30得点を挙げた。両チーム通じてこの日の最多得点者となり、ナゲッツは123-118でグリズリーズに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "954-luka-doncic-32-points-bucks.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、バックス戦で32得点 —— レイカーズが123-112で勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間11月11日、敵地ミルウォーキーでのバックス戦に32分出場し、フィールドゴール25本中10本・3ポイント12本中5本・フリースロー10本中7本を沈めて32得点を記録した。両チーム通じてこの日の最多得点者となり、レイカーズは123-112でバックスに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "953-victor-wembanyama-32-points-bulls.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、ブルズ戦で32得点 —— スパーズが124-119で勝利",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間11月11日、敵地シカゴでのブルズ戦に32分出場し、フィールドゴール18本中13本・3ポイント6本中2本を沈めて32得点、リバウンド9・ブロック5を記録した。両チーム通じてこの日の最多得点者となり、スパーズは124-119でブルズに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "952-adidas-harden-vol-11-royalty.html",
    cat: "KICKS",
    title: "ジェームズ・ハーデン、adidas Harden Vol. 11新色「Royalty」を実戦デビュー —— ニックス戦のMSGで初披露",
    excerpt: "adidasのシグネチャーシューズ最新作「adidas Harden Vol. 11」の新色「Royalty」を、ジェームズ・ハーデン(クリーブランド・キャバリアーズ)が11月11日(現地時間)、敵地マディソン・スクエア・ガーデンでのニックス戦で実戦投入し、初めて披露した。発売日・価格は執筆時点で未発表。Sneaker Newsが伝えた。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "951-jayson-tatum-24-points-raptors.html",
    cat: "NBA",
    title: "ジェイソン・テイタム、ラプターズ戦で24得点 —— セルティックスが98-93で勝利",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間11月11日、敵地トロントでのラプターズ戦に38分出場し、アシスト8・リバウンド7とともに24得点を記録した。両チーム通じてこの日の最多得点者となり、セルティックスは98-93でラプターズに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "950-pascal-siakam-28-points-wizards.html",
    cat: "NBA",
    title: "パスカル・シアカム、ウィザーズ戦で28得点 —— ペイサーズが114-101で勝利",
    excerpt: "インディアナ・ペイサーズのパスカル・シアカムは現地時間11月11日、本拠地でのウィザーズ戦に32分出場し、フィールドゴール17本中7本・フリースロー12本を全て沈めて28得点を記録した。両チーム通じてこの日の最多得点者となり、ペイサーズは114-101でウィザーズに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "949-james-harden-32-points-knicks.html",
    cat: "NBA",
    title: "ジェームズ・ハーデン、ニックス戦で32得点 —— キャバリアーズが115-107で勝利",
    excerpt: "クリーブランド・キャバリアーズのジェームズ・ハーデンは現地時間11月11日、敵地ニューヨークでのニックス戦に33分出場し、フィールドゴール14本中9本・3ポイント7本中5本・フリースロー11本中9本を沈めて32得点を記録した。両チーム通じてこの日の最多得点者となり、キャバリアーズは115-107でニックスに勝利した。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "948-plumlee-kings.html",
    cat: "NBA",
    title: "メイソン・プラムリー、キングス入りへ —— 14年目のベテランセンターがロースター補強",
    excerpt: "ベテランセンターのメイソン・プラムリー(Mason Plumlee)が、サクラメント・キングスと契約することが分かった。プラムリーの代理人が11日(現地時間)、ESPNのシャムズ・シャラニア記者に伝えた。今季で14年目のシーズンを迎える同選手だが、契約の年数や金額などの詳細は明らかになっていない。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "947-air-jordan-4-spotlight.html",
    cat: "KICKS",
    title: "Air Jordan 4「Spotlight」ファーストルック公開 —— 「Black Cat」とは異なる素材使いの女性限定モデル、品番HV0823-002",
    excerpt: "Jordan Brandは、女性限定(WMNS)モデル「Air Jordan 4 \"Spotlight\"」(品番HV0823-002)の先行カットを公開した。黒レザーのアッパーに爬虫類型押しレザーのトゥとサイドウィングを組み合わせた仕立てで、発売日・価格は現時点で未発表。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.12",
    thumb: "../assets/journal-947-hero.jpg?v=1a6657a22f"
  },
  {
    href: "946-markkanen-fractured-hand.html",
    cat: "NBA",
    title: "マルカネン、右手骨折で最低1ヶ月離脱 —— 1勝10敗のジャズ、怪我人続出に拍車",
    excerpt: "ユタ・ジャズのラウリ・マルカネン(Lauri Markkanen)は右手に剥離のない骨折があり、最低1ヶ月の離脱が見込まれることが分かった。今月6日のマーベリックス戦で手を強打して負傷。ジャズ(1勝10敗)はヌルキッチ・ジャクソンJr.・ジョージも負傷者リストに名を連ねる。ESPNのシャムズ・シャラニア記者とティム・マクマホン記者が伝えた。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "945-nike-book-2-be-legendary.html",
    cat: "KICKS",
    title: "Nike Book 2「Be Legendary」が11月20日発売 —— デビン・ブッカーの2代目シグネチャーに、コービー・ブライアントへのトリビュートカラー",
    excerpt: "ナイキが、フェニックス・サンズのデビン・ブッカーの2代目シグネチャーモデル「Nike Book 2」の新色「Be Legendary」(品番FZ7013-501)を2026年11月20日に発売する。コービー・ブライアントへのトリビュートをテーマにした紫基調のカラーで、価格は145ドル。Hypebeastが伝えた。",
    date: "2026.11.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "944-nba-black-coaches-group-chat.html",
    cat: "NBA",
    title: "J.B.ビッカースタッフとジャマール・モズリーが明かすNBA黒人コーチ陣の絆 —— 11人の秘密グループチャットが支える「仲間」たち",
    excerpt: "ESPNのヴィンセント・グッドウィル記者は11月11日、NBAの黒人ヘッドコーチ・アシスタントコーチ11人が敵同士になっても支え合う非公開グループチャットの実態を特集記事で伝えた。デトロイト・ピストンズのJ.B.ビッカースタッフHCとニューオーリンズ・ペリカンズのジャマール・モズリーHCが昨季プレーオフGame7前に交わしたハグを起点に、現在9人(数年前は15人)まで減ったリーグの黒人ヘッドコーチたちが築く「兄弟」の絆を描いている。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "943-shai-gilgeous-alexander-26-points-blazers.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、トレイルブレイザーズ戦で26得点 —— サンダーが103-123で大敗",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダー(Shai Gilgeous-Alexander)は現地時間11月10日、敵地ポートランドでのトレイルブレイザーズ戦に29分出場し、フィールドゴール22本中8本・フリースロー11本中10本を沈めて26得点を記録した。両チーム通じてこの日の最多得点者となったが、サンダーは103-123でトレイルブレイザーズに大敗した。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "942-adidas-ae3-doctor-doom-ant-man.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards 3「Doctor Doom」「Ant-Man」が12月発売 —— 『アベンジャーズ: ダムズデイ』コラボでAE3に2色",
    excerpt: "adidasが、アンソニー・エドワーズの3代目シグネチャーモデル「adidas Anthony Edwards 3」から、映画『アベンジャーズ: ダムズデイ』(12月18日全米公開)とのコラボカラー「Doctor Doom」「Ant-Man」を2026年12月に発売する。Sneaker Bar DetroitとSneaker Newsが伝えた。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "941-air-jordan-3-not-nice.html",
    cat: "KICKS",
    title: "Air Jordan 3「Not Nice」が11月21日発売 —— かかとのタブ裏に隠れ文字、サンタが「二度チェック」したクリスマス仕様",
    excerpt: "Jordan Brandが、Air Jordan 3の新色「Not Nice」(配色名「Black & Challenge Red」)を2026年11月21日に発売する。焦がしたレザーにエレファントプリントを重ねたクリスマス仕様で、かかとのNike Airタブをめくると「Not Nice」の文字が現れる仕掛けを入れた。FLY BASKETBALL CULTURE MAGAZINEとSneaker Filesが伝えた。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "940-franz-wagner-33-points-magic.html",
    cat: "NBA",
    title: "フランツ・ワグナー、キングス戦で33得点 —— マジックが107-100で勝利",
    excerpt: "オーランド・マジックのフランツ・ワグナー(Franz Wagner)は現地時間11月10日、敵地サクラメントでのキングス戦に38分出場し、フィールドゴール23本中11本・フリースロー10本を全て沈めて33得点を記録した。両チーム通じてこの日の最多得点者となり、マジックは107-100でキングスに勝利した。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "939-jordan-goodwin-18-points-clippers.html",
    cat: "NBA",
    title: "ジョーダン・グッドウィン、クリッパーズ戦で18得点 —— サンズが133-110で快勝",
    excerpt: "フェニックス・サンズのジョーダン・グッドウィンは現地時間11月10日、本拠地でのクリッパーズ戦に14分出場し、フィールドゴール7本中6本(3ポイント7本中6本)を沈めて18得点を記録した。両チーム通じてこの日の最多得点者となり、サンズは133-110でクリッパーズに快勝した。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "938-giannis-30-points-jazz.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ、ジャズ戦で30得点 —— ヒートが115-109で勝利",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは現地時間11月10日、敵地ソルトレイクシティでのジャズ戦に31分出場し、フィールドゴール21本中12本を沈めて30得点を記録した。両チーム通じてこの日の最多得点者となり、ヒートは115-109でジャズに勝利した。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "937-hachimura-13-points-suns.html",
    cat: "NBA",
    title: "八村塁、サンズ戦で13得点 —— クリッパーズは110-133で敗戦",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間11月10日、敵地フェニックスでのサンズ戦に23分出場し、フィールドゴール10本中4本(3ポイント5本中3本)を沈めて13得点を記録した。クリッパーズは110-133でサンズに敗れた。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "936-paul-george-36-points-76ers.html",
    cat: "NBA",
    title: "ポール・ジョージ、セブンティシクサーズ戦で36得点 —— セルティックスが123-101で勝利",
    excerpt: "ボストン・セルティックスのポール・ジョージは現地時間11月10日、敵地フィラデルフィアでのセブンティシクサーズ戦に30分出場し、フィールドゴール22本中14本・3ポイント11本中6本を沈めて36得点を記録した。両チーム通じてこの日の最多得点者となり、セルティックスは123-101でセブンティシクサーズに勝利した。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "935-jalen-brunson-23-points-bucks.html",
    cat: "NBA",
    title: "ジェイレン・ブランソン、バックス戦で23得点 —— ニックスが117-85で快勝",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンは現地時間11月10日、本拠地でのミルウォーキー・バックス戦に28分出場し、フィールドゴール18本中7本・フリースロー8本を全て沈めて23得点を記録した。両チーム通じてこの日の最多得点者となり、ニックスは117-85でバックスに快勝した。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "934-jaylen-brown-tatum-cold-shoulder.html",
    cat: "NBA",
    title: "ジェイレン・ブラウン、テイタムのダップを拒否 —— 移籍後初対戦、ウォームアップでも距離置く",
    excerpt: "ジェイソン・テイタム(セルティックス)とジェイレン・ブラウン(76ers)は現地時間11月10日、今夏のトレード以来初めて同じコートに立った。試合前のウォームアップは互いの陣営に分かれ、ティップオフ直前にテイタムが求めたダップにブラウンは応じなかった。ESPNが伝えた。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "933-kawhi-leonard-miss-another-week.html",
    cat: "NBA",
    title: "カワイ・レナード、左膝の腫れでさらに最低1週間離脱 —— ラプターズ発表、今季出場はわずか2試合",
    excerpt: "トロント・ラプターズは現地時間11月10日、カワイ・レナードが左膝の腫れの治療で「リコンディショニング」を継続中で、最低1週間(最少あと3試合)欠場すると発表した。MRIに構造的損傷はなく、1週間後に次の経過発表が行われる。ESPNが伝えた。",
    date: "2026.11.11",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "932-stephen-curry-kevin-durant-decade-longevity.html",
    cat: "NBA",
    title: "ステフィン・カリーとケビン・デュラント、結成10年の再戦へ —— ウォリアーズ対ロケッツ、38歳の両エースが衰えない理由",
    excerpt: "ESPNのベン・ゴリバー記者は11月10日、38歳のステフィン・カリー(ウォリアーズ)とケビン・デュラント(ロケッツ)が11日に今季初対戦するのを前に、2016年に同じウォリアーズでタッグを組んだ2人がなぜ結成10年を経た今も最前線で活躍を続けているのかを分析する特集記事を公開した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "931-nba-core-danger-tiers.html",
    cat: "NBA",
    title: "NBAの編成「危険地帯」19チーム —— バックスに年俸操作疑惑、サンダーは5億ドル超えへ、ESPN記者が5段階評価",
    excerpt: "ESPNのボビー・マークス記者は11月9日、サラリーキャップと編成の観点から重大な決断を控える19チームを5段階のティアに分類する分析記事を公開した。ミルウォーキー・バックスには年俸操作疑惑、オクラホマシティ・サンダーは2027-28シーズンに総額5億ドル超えの見通し、ニューヨーク・ニックスはオーナーの「セカンドエプロン回避」方針と主力の契約交渉が重なる。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "929-doc-rivers-apologizes-giannis.html",
    cat: "NBA",
    title: "ドック・リバーズ、ヤニスに謝罪 —— 「スーパーIQ」発言を訂正、「称賛のつもりだった」",
    excerpt: "元ミルウォーキー・バックスのヘッドコーチ、ドック・リバーズは11月9日(現地時間)、Andscapeに対しマイアミ・ヒートのヤニス・アデトクンボへ謝罪の連絡をしたと明らかにした。ポッドキャストでの「スーパーIQがあるわけではない」という発言は「フィール(感覚)」と言うべきだったとし、称賛のつもりだったと説明。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "928-yokohama-excellence-bleague-one-2027-28-districts.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、2027-28シーズンは「東地区」—— B.LEAGUE ONEが東西2地区制に再編",
    excerpt: "横浜エクセレンスは11月10日、2027-28シーズンのB.LEAGUE ONE地区分けが決定したと発表した。2027-28シーズンよりB.LEAGUE ONEは東西2地区制に移行し、横浜エクセレンスは青森ワッツや新潟アルビレックスBBなど13クラブが集まる東地区に所属する。",
    date: "2026.11.10",
    thumb: "../assets/journal-928-hero.jpg?v=7bd9f3e4b4"
  },
  {
    href: "927-brandin-podziemski-25-points-pelicans.html",
    cat: "NBA",
    title: "ブランディン・ポジェムスキー、ペリカンズ戦で25得点 —— ウォリアーズが138-87で大勝",
    excerpt: "ゴールデンステート・ウォリアーズのブランディン・ポジェムスキー(Brandin Podziemski)は現地時間11月9日、本拠地でのニューオーリンズ・ペリカンズ戦に26分出場し、フィールドゴール19本中10本・3ポイント11本中5本を沈めて25得点を記録した。チームメートのステフィン・カリーと並び両チーム通じてこの日の最多得点者となり、ウォリアーズは138-87でペリカンズに大勝した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "926-stephen-curry-25-points-pelicans.html",
    cat: "NBA",
    title: "ステフィン・カリー、ペリカンズ戦で25得点 —— ウォリアーズが138-87で大勝",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリー(Stephen Curry)は現地時間11月9日、本拠地でのニューオーリンズ・ペリカンズ戦に21分出場し、フィールドゴール10本中6本・3ポイント7本中4本・フリースロー9本中9本を沈めて25得点を記録した。ブランディン・ポジェムスキーと並び両チーム通じてこの日の最多得点者となり、ウォリアーズは138-87でペリカンズに大勝した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "925-jaylen-brown-tatum-no-beef.html",
    cat: "NBA",
    title: "ジェイレン・ブラウン「話すことなんて何もない」—— 移籍後初のセルティックス戦を前にテイタムとの確執なお",
    excerpt: "フィラデルフィア・76ersのジェイレン・ブラウンは現地時間11月9日、ブルズ戦(127-121で勝利)後の取材で、移籍後初めて対戦する元チームメイトのジェイソン・テイタムについて「話すことなんて何もない」と述べた。セルティックス戦は火曜に行われる。ESPNが伝えた。",
    date: "2026.11.10",
    thumb: "../assets/journal-925-hero.jpg?v=15c4383426"
  },
  {
    href: "922-nba-miami-2028-all-star.html",
    cat: "NBA",
    title: "マイアミ、2028年NBAオールスターウィークエンド開催へ —— ヒートの地元開催は1990年以来",
    excerpt: "NBAは現地時間11月9日、2028年のオールスターウィークエンドをマイアミで開催する方向で最終調整に入ったと、ESPNのシャムズ・シャラニア記者が関係者の情報として伝えた。マイアミでのオールスターウィークエンド開催はヒートが本拠地とした1990年以来となる。",
    date: "2026.11.10",
    thumb: "../assets/journal-922-hero.jpg?v=75c748799b"
  },
  {
    href: "921-victor-wembanyama-40-points-suns.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、サンズ戦で40得点11リバウンド8ブロック —— スパーズが122-96で快勝",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマ(Victor Wembanyama)は現地時間11月9日、敵地でのフィニックス・サンズ戦に25分出場し、フィールドゴール19本中15本・3ポイント3本中2本・フリースロー10本中8本を沈めて40得点を記録した。リバウンド11・ブロック8も記録し、両チーム通じてこの日の最多得点者となり、スパーズは122-96でサンズに勝利した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "920-jamal-murray-38-points-rockets.html",
    cat: "NBA",
    title: "ジャマール・マレー、ロケッツ戦で38得点 —— ナゲッツは100-110で敗戦",
    excerpt: "デンバー・ナゲッツのジャマール・マレーは現地時間11月9日、ヒューストン・ロケッツ戦に39分出場し、フィールドゴール23本中14本・3ポイント8本中5本を沈めて38得点を記録した。両チーム通じてこの日の最多得点者となったが、ナゲッツは100-110でロケッツに敗れた。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "919-cooper-flagg-43-points-pacers.html",
    cat: "NBA",
    title: "クーパー・フラッグ、ペイサーズ戦で43得点 —— マーベリックスが125-122で勝利",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグは現地時間11月9日、インディアナ・ペイサーズ戦に39分出場し、43得点・リバウンド10・アシスト6のダブルダブルを記録した。両チーム通じてこの日の最多得点者となり、マーベリックスは125-122でペイサーズを下した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "918-sklz-bashhhketball-pro.html",
    cat: "CULTURE",
    title: "ドリブル音を気にせず自主練習を —— SKLZ「BASHHHKETBALL PRO」、公式球相当サイズの静音バスケットボール11月18日発売",
    excerpt: "Implus EUは11月10日、スポーツトレーニングブランド「SKLZ」から静音バスケットボール「BASHHHKETBALL PRO」を発表した。特殊ポリウレタンフォーム素材でドリブル音と振動を大幅に軽減しつつ、直径約24.5cm・重量約590gの公式7号球相当サイズを維持。価格6,900円(税抜)、11月18日発売。",
    date: "2026.11.10",
    thumb: "../assets/journal-918-hero.jpg?v=3b07f88eaf"
  },
  {
    href: "917-ty-jerome-27-points-raptors.html",
    cat: "NBA",
    title: "タイ・ジェローム、ラプターズ戦で27得点 —— グリズリーズが118-102で快勝",
    excerpt: "メンフィス・グリズリーズのタイ・ジェローム(Ty Jerome)は現地時間11月9日、敵地でのトロント・ラプターズ戦に32分出場し、フィールドゴール19本中9本・3ポイント11本中5本・フリースロー4本を全て沈めて27得点を記録した。両チーム通じてこの日の最多得点者となり、グリズリーズは118-102でラプターズを下した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "916-anthony-davis-44-points-pistons.html",
    cat: "NBA",
    title: "アンソニー・デイビス、ピストンズ戦で44得点 —— ウィザーズは111-122で敗戦",
    excerpt: "ワシントン・ウィザーズのアンソニー・デイビス(Anthony Davis)は現地時間11月9日、敵地でのデトロイト・ピストンズ戦に34分出場し、フィールドゴール21本中16本(76.2%)・3ポイント4本中2本・フリースロー11本中10本を沈めて44得点を記録した。両チーム通じてこの日の試合最多得点者となったが、ウィザーズは111-122でピストンズに敗れた。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "915-grayson-allen-27-points-cavaliers.html",
    cat: "NBA",
    title: "グレイソン・アレン、キャバリアーズ戦で27得点 —— ホーネッツが124-112で勝利",
    excerpt: "シャーロット・ホーネッツのグレイソン・アレン(Grayson Allen)は現地時間11月9日、本拠地でのクリーブランド・キャバリアーズ戦に34分出場し、フィールドゴール14本中8本・3ポイント12本中6本・フリースロー6本中5本を沈めて27得点を記録した。両チーム通じてこの日の最多得点者となり、ホーネッツは124-112でキャバリアーズを下した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "914-doncic-32-points-hawks.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、ホークス戦で32得点 —— レイカーズが124-114で勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチ(Luka Doncic)は現地時間11月9日、敵地でのアトランタ・ホークス戦に39分出場し、フィールドゴール22本中11本・3ポイント11本中3本・フリースロー7本を全て沈めて32得点、アシスト10を記録した。両チーム通じてこの日の最多得点者となり、レイカーズは124-114でホークスを下した。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "913-nike-sabrina-4-guava-ice.html",
    cat: "KICKS",
    title: "Nike Sabrina 4「Guava Ice」が登場 —— 品番II0402-800、桜色を纏った新色",
    excerpt: "ナイキは、サブリナ・イオネスクの4代目シグネチャーシューズ「Nike Sabrina 4」の新色「Guava Ice」(品番II0402-800)を発表した。淡いピーチピンクを基調に、サイドにピンク・ライム・ブラックを配した仕立て。Sneaker News、Sneaker Bar Detroitが伝えた。",
    date: "2026.11.10",
    thumb: "../assets/journal-913-hero.jpg?v=289146eefe"
  },
  {
    href: "912-air-jordan-4-bred-black-friday.html",
    cat: "KICKS",
    title: "Air Jordan 4「Bred」がブラックフライデーに復刻 —— 「Reimagined」版から2年、オリジナルカラーで登場",
    excerpt: "ジョーダン ブランドの定番「Air Jordan 4」の人気カラー「Bred」が、2026年11月27日のブラックフライデーに発売される。物議を醸した「Reimagined」版の発売からおよそ2年ぶりに、オリジナルの配色で復刻する。Sneaker Newsが伝えた。",
    date: "2026.11.10",
    thumb: "../assets/journal-912-hero.jpg?v=8dc43aa975"
  },
  {
    href: "911-gunma-crane-thunders-nagoya-d-11-win-streak.html",
    cat: "JAPAN",
    title: "群馬クレインサンダーズ、開幕11連勝中の名古屋Dを撃破 —— 藤井祐眞が齋藤拓実のアシストを2本に封じる",
    excerpt: "群馬クレインサンダーズは現地時間11月9日、本拠地オープンハウスアリーナ太田でのB.LEAGUE PREMIER 2026-27シーズンの一戦で名古屋ダイヤモンドドルフィンズを破り、開幕から11連勝中だった名古屋Dの連勝記録を止めた。前節のシーホース三河戦に続く強豪撃破で、藤井祐眞は相手のエース齋藤拓実のアシストを2本に抑えるディフェンスで勝利に貢献した。",
    date: "2026.11.10",
    thumb: "../assets/journal-911-hero.jpg?v=b9ae7fa332"
  },
  {
    href: "910-jordan-tatum-5-nike-by-you.html",
    cat: "KICKS",
    title: "Jordan Tatum 5が「Nike By You」に対応 —— 11月12日からカスタムオーダー開始、ジョーダンブランドは約10年ぶり参加",
    excerpt: "ジェイソン・テイタムの最新シグネチャー「Jordan Tatum 5」が、ナイキのカスタムオーダーサービス「Nike By You」に対応する。2026年11月12日から利用可能で、ジョーダンブランドの同プログラム参加は約10年ぶり。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "909-foamposite-pro-dr-doom-avengers-doomsday.html",
    cat: "KICKS",
    title: "Nike Air Foamposite Pro「Dr. Doom」が12月18日に3度目の発売 —— 『アベンジャーズ: ダムズデイ』公開日に合わせ、初登場から20年",
    excerpt: "Nike Air Foamposite Proの人気カラー「Dr. Doom」（品番HF0794-003）が2026年12月18日、マーベル映画『アベンジャーズ: ダムズデイ』の公開日と同日に3度目の発売を迎える。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.10",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "908-giannis-doc-rivers-response.html",
    cat: "NBA",
    title: "ヤニス「妬みや意地悪さに目標を邪魔されるな」—— ドック・リバーズの批判に「言葉に詰まる」",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは、現地時間11月8日のキングス戦勝利後、元ヘッドコーチのドック・リバーズによる自身への批判に「言葉に詰まる」と語り、「妬みや意地悪さに、目標や夢を邪魔されてはいけない」と述べた。コーチは「スポ(エリック・スポールストラ)だけ」と一線を引いた。ESPNが伝えた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "907-giannis-heat-trust-4-6-start.html",
    cat: "NBA",
    title: "ヤニス「今は互いを信頼できていない」—— ヒート4勝6敗、守備25位の低迷にライリーらOBが合流",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは、現地時間11月2日のレイカーズ戦に117-138で敗れた後「今は互いを信頼できていない」と守備の崩壊を認めた。ヒートは4勝6敗、守備はリーグ25位に低迷しており、パット・ライリー氏やドウェイン・ウェイド氏ら球団OBもチームに合流した。ESPNが伝えた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "906-nike-af1-pony-hair-atomic-violet.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low Pony Hair「Atomic Violet」が11月20日発売 —— ファー素材のアッパーに紫を効かせた新色、品番IR1940-500",
    excerpt: "ナイキは「Air Force 1 Low Pony Hair」の新色「Atomic Violet」(品番IR1940-500、価格140ドル)を2026年11月20日にSNKRSおよび一部店舗で発売する。アッパーとソールにアトミックバイオレットとハイパーパープルの長めのファー素材をあしらったメンズモデル。Hypebeastが公式画像を伝えた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "905-kawamata-japan-window5.html",
    cat: "JAPAN",
    title: "琉球ゴールデンキングス・川真田紘也選手、日本代表Window5直前合宿メンバーに選出",
    excerpt: "琉球ゴールデンキングスの川真田紘也選手が、「FIBAバスケットボールワールドカップ2027アジア地区予選Window5」に向けた男子日本代表直前合宿の18名のメンバーに選出されたと、JBAの発表を受けて琉球ゴールデンキングスが11月9日発表した。日本代表はレバノン・カタール両代表とアウェーで対戦する。",
    date: "2026.11.09",
    thumb: "../assets/journal-905-hero.jpg?v=03fb1fa518"
  },
  {
    href: "904-yoshii-yuminami-japan-window5.html",
    cat: "JAPAN",
    title: "茨城ロボッツ・吉井裕鷹選手と弓波英人AC、日本代表Window5直前合宿メンバーに選出 —— レバノン・カタール戦へ",
    excerpt: "茨城ロボッツの吉井裕鷹選手と弓波英人アシスタントコーチが、「FIBAバスケットボールワールドカップ2027アジア地区予選Window5」に向けた男子日本代表の直前合宿招集メンバーに選出されたと茨城ロボッツが11月9日発表した。日本代表はレバノン・カタール両代表とアウェーで対戦する。",
    date: "2026.11.09",
    thumb: "../assets/journal-904-hero.jpg?v=c8e753a967"
  },
  {
    href: "903-will-richard-thumb-injury-warriors.html",
    cat: "NBA",
    title: "ウィル・リチャード、左手拇指の靱帯損傷で離脱 —— ウォリアーズは7連勝中、復帰時期は未定",
    excerpt: "ゴールデンステート・ウォリアーズは現地時間11月8日(日)、2年目ガードのウィル・リチャード(Will Richard)が左手拇指の靱帯(尺側側副靱帯)を損傷したと発表した。回復までの具体的な期間や治療方針は未定。ESPNが伝えた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "902-trey-murphy-26-points-clippers.html",
    cat: "NBA",
    title: "トレイ・マーフィーIII、クリッパーズ戦で26得点 —— ペリカンズは123-139で敗戦",
    excerpt: "ニューオーリンズ・ペリカンズのトレイ・マーフィーIII(Trey Murphy III)は現地時間11月8日、ロサンゼルス・クリッパーズ戦に30分出場し、フィールドゴール17本中9本・3ポイント9本中4本・フリースロー4本を全て沈めて26得点を記録した。両チーム通じてこの日の最多得点者となったが、ペリカンズは123-139でクリッパーズに敗れた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "901-acuff-32-points-heat.html",
    cat: "NBA",
    title: "ダリウス・アカフJr.、ヒート戦で32得点10アシスト —— キングスは108-114で惜敗",
    excerpt: "サクラメント・キングスのダリウス・アカフJr.(Darius Acuff Jr.)は現地時間11月8日、マイアミ・ヒート戦に39分出場し、フィールドゴール21本中11本・3ポイント7本中3本・フリースロー7本を全て沈めて32得点、アシスト10を記録した。両チーム通じてこの日の最多得点者となったが、キングスは108-114でヒートに惜敗した。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "900-hachimura-14-points-pelicans.html",
    cat: "NBA",
    title: "八村塁、ペリカンズ戦で14得点 —— クリッパーズが139-123で快勝",
    excerpt: "ロサンゼルス・クリッパーズの八村塁(Rui Hachimura)は現地時間11月8日、ニューオーリンズ・ペリカンズ戦に26分出場し、フィールドゴール13本中6本(3ポイント6本中2本)を沈めて14得点を記録した。クリッパーズは139-123でペリカンズに快勝した。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "899-cooper-flagg-25-points-nets.html",
    cat: "NBA",
    title: "クーパー・フラッグ、ネッツ戦で25得点12アシスト —— マーベリックスが130-93で大勝",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグ(Cooper Flagg)は現地時間11月8日、本拠地でのブルックリン・ネッツ戦に28分出場し、フィールドゴール13本中8本・3ポイント5本中3本・フリースロー6本全てを沈めて25得点、アシスト12を記録した。両チーム通じてこの日の最多得点者となり、マーベリックスは130-93でネッツに大勝した。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "898-kyle-kuzma-27-points-celtics.html",
    cat: "NBA",
    title: "カイル・クーズマ、セルティックス戦で27得点 —— バックスは97-117で敗戦",
    excerpt: "ミルウォーキー・バックスのカイル・クーズマ(Kyle Kuzma)は現地時間11月8日、本拠地でのボストン・セルティックス戦に31分出場し、フィールドゴール17本中10本・3ポイント13本中6本を沈めて27得点を記録した。セルティックスのポール・ジョージと並び両チーム通じてこの日の最多得点者となったが、バックスは97-117でセルティックスに敗れた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "897-paul-george-27-points-bucks.html",
    cat: "NBA",
    title: "ポール・ジョージ、バックス戦で27得点 —— セルティックスが117-97で快勝",
    excerpt: "ボストン・セルティックスのポール・ジョージ(Paul George)は現地時間11月8日、敵地でのミルウォーキー・バックス戦に28分出場し、フィールドゴール18本中11本・3ポイント10本中5本を沈めて27得点を記録した。バックスのカイル・クーズマと並び両チーム通じてこの日の最多得点者となり、セルティックスは117-97でバックスを下した。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "896-plaud-alvark-tokyo-academy-partnership.html",
    cat: "JAPAN",
    title: "AIボイスレコーダーPlaud、アルバルク東京とアカデミーサポーター契約 —— 文字起こし・要約機能で育成現場の指導振り返りを支援",
    excerpt: "AI議事録デバイス「Plaud」を展開するPLAUD株式会社(本社:東京都渋谷区)は、B.LEAGUE PREMIER所属のアルバルク東京のアカデミーサポーターとして、オフィシャルパートナー契約を締結したと発表した。アルバルク東京アカデミーのコーチ陣・フロントオフィスにPlaud製品を導入し、音声の記録とAIによる文字起こし・要約を指導内容の振り返りや情報共有に活用する。",
    date: "2026.11.09",
    thumb: "../assets/journal-896-hero.jpg?v=c20cd0bd81"
  },
  {
    href: "895-darryn-peterson-26-points-timberwolves.html",
    cat: "NBA",
    title: "ダリン・ピーターソン、ティンバーウルブズ戦で26得点 —— ジャズは100-115で敗戦",
    excerpt: "ユタ・ジャズのダリン・ピーターソン(Darryn Peterson)は現地時間11月8日、敵地でのミネソタ・ティンバーウルブズ戦に35分出場し、フィールドゴール21本中11本・3ポイント8本中4本を沈めて26得点を記録した。ティンバーウルブズのアヨ・ドスンムと並び両チーム通じてこの日の最多得点者となったが、ジャズは100-115でティンバーウルブズに敗れた。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "894-ayo-dosunmu-26-points-jazz.html",
    cat: "NBA",
    title: "アヨ・ドスンム、ジャズ戦で26得点 —— ティンバーウルブズが115-100で勝利",
    excerpt: "ミネソタ・ティンバーウルブズのアヨ・ドスンム(Ayo Dosunmu)は現地時間11月8日、本拠地でのユタ・ジャズ戦に30分出場し、フィールドゴール13本中7本・3ポイント5本中4本・フリースロー8本全てを沈めて26得点を記録した。ジャズのダリン・ピーターソンと並び両チーム通じてこの日の最多得点者となり、ティンバーウルブズは115-100でジャズに勝利した。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "893-axis-consulting-yokohama-bcorsairs-partnership.html",
    cat: "JAPAN",
    title: "アクシスコンサルティング、横浜ビー・コルセアーズとオフィシャルパートナー（ゴールド）契約 —— 「人が活きる、人を活かす。」の人材企業が「ヨコハマをバスケの街に」を後押し",
    excerpt: "ハイエンド人材の人材紹介・スキルシェア事業を手がけるアクシスコンサルティング株式会社(本社:東京都千代田区、代表取締役社長COO:伊藤文隆)は、B.LEAGUE PREMIER所属のプロバスケットボールチーム「横浜ビー・コルセアーズ」を運営する株式会社横浜ビーコルセアーズ(代表取締役社長:原毅人)と、2026-27シーズンのオフィシャルパートナー(ゴールド)契約を締結したと発表した。",
    date: "2026.11.09",
    thumb: "../assets/journal-893-hero.jpg?v=f1f2aabf6b"
  },
  {
    href: "892-austin-reaves-43-points-pistons.html",
    cat: "NBA",
    title: "オースティン・リーブス、ピストンズ戦で43得点 —— レイカーズが121-116で勝利",
    excerpt: "ロサンゼルス・レイカーズのオースティン・リーブス(Austin Reaves)は現地時間11月8日、デトロイト・ピストンズ戦に37分出場し、フィールドゴール27本中14本(51.9%)・3ポイント6本中4本を沈めて43得点を記録した。両チーム通じてこの日の最多得点者となり、レイカーズは121-116でピストンズを振り切った。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "891-kings-u18-championship-2026.html",
    cat: "JAPAN",
    title: "キングスU18、「B.LEAGUE U18 CHAMPIONSHIP 2026」出場へ —— 11月21日開幕、全国43チームが頂点争う",
    excerpt: "琉球ゴールデンキングスのU18チームは、11月21日から25日まで日環アリーナ栃木で開催される「インフロニア B.LEAGUE U18 CHAMPIONSHIP 2026」に出場する。全国のBリーグU18 43チームがノックアウト方式で日本一を争い、上位4チームには2027年の国際大会出場権が与えられる。",
    date: "2026.11.09",
    thumb: "../assets/journal-891-hero.jpg?v=5e1ba285b7"
  },
  {
    href: "890-yokohama-excellence-koshigaya-split.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、北地区首位・越谷と1勝1敗 —— B.LEAGUE ONE第9節、終盤のミスが明暗を分ける",
    excerpt: "横浜エクセレンスは11月7日・8日、本拠地・横浜武道館で北地区首位の越谷アルファーズと対戦したB.LEAGUE ONE 2026-27シーズン第9節で1勝1敗に終えた。Game1は92-88で勝利したが、Game2は97-103で競り負けた。",
    date: "2026.11.09",
    thumb: "../assets/journal-890-hero.jpg?v=fdcf46e6b4"
  },
  {
    href: "889-jaylen-brown-29-points-bulls.html",
    cat: "NBA",
    title: "ジェイレン・ブラウン、ブルズ戦で29得点 —— 76ersが127-121で勝利",
    excerpt: "フィラデルフィア・76ersのジェイレン・ブラウン(Jaylen Brown)は現地時間11月8日、シカゴ・ブルズ戦に35分出場し、フィールドゴール22本中11本・3ポイント6本中2本を沈めて29得点を記録した。両チーム通じてこの日の最多得点者となり、76ersは127-121でブルズを振り切った。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "888-kon-knueppel-hamstring-strain-hornets.html",
    cat: "NBA",
    title: "コン・カニップル、左ハムストリング再負傷で最低4週間離脱 —— ホーネッツは6連敗、シュルーダーも同じ診断",
    excerpt: "シャーロット・ホーネッツは現地時間11月8日(日)、2年目ガードのコン・カニップル(Kon Knueppel)が左ハムストリングを肉離れし、最低4週間の離脱になると発表した。ESPNが伝えた。デニス・シュルーダー(Dennis Schroder)も同じ左ハムストリング肉離れと診断され、2週間後に再評価される。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "887-76ers-8-1-start-insiders.html",
    cat: "NBA",
    title: "76ersの「8勝1敗」を球団関係者はどう見ているか —— マクシーへの信頼、レブロンとナースの新しい関係性",
    excerpt: "ESPNのブライアン・ウィンドホースト記者とティム・マクマホン記者は現地時間11月6日、8勝1敗と好調なフィラデルフィア・76ers(Philadelphia 76ers)について、複数の匿名スカウト・フロント幹部の見方を集めた特集を公開した。レブロン・ジェームズ(LeBron James)ら5人のMVP経験者が揃う「スーパーチーム」がクラッチタイムで強さを見せる背景に、タイリース・マクシー(Tyrese Maxey)への信頼と、ニック・ナース(Nick Nurse)HCとの新しい関係構築があると報じている。",
    date: "2026.11.09",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "886-jalen-duren-cleared-on-court-activity.html",
    cat: "NBA",
    title: "ジェイレン・デューレン、オンコート活動を許可 —— 右ハムストリング肉離れから2週間、ピストンズが発表",
    excerpt: "デトロイト・ピストンズは現地時間11月8日、右ハムストリング肉離れで離脱していたジェイレン・デューレン(Jalen Duren)がオンコートでのバスケットボール活動を許可されたと発表。HoopsHypeのマイケル・スコット記者が伝えた。ステータスは2週間後に改めて発表される。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "885-markkanen-jazz-wrist-center.html",
    cat: "NBA",
    title: "マルカネン「チームメイトのために、何としてもコートに立ちたい」—— 手首を保護しながらセンターに初挑戦",
    excerpt: "ユタ・ジャズ公式サイトは現地時間11月8日、ラウリ・マルカネン(Lauri Markkanen)が右手首の捻挫を抱えながら出場を続け、ジャレン・ジャクソンJr.とユスフ・ヌルキッチの離脱を受けてキャリア10年目で本格的にセンターへ回っている現状を特集した。マルカネンは「チームメイトのために、何としてもコートに立ちたい」と語り、11月は3ポイント17本を沈めるなど好調を維持している。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "884-thunder-nique-clifford-trade-kings.html",
    cat: "NBA",
    title: "サンダー、ニーク・クリフォードをキングスから獲得 —— ウィリアムズ/ウォーレス離脱の穴埋め、キングスは2巡指名権2本で手放す",
    excerpt: "オクラホマシティ・サンダーは現地時間11月8日、サクラメント・キングスとのトレードで2年目のウイング、ニーク・クリフォード(Nique Clifford)を獲得したと、ESPNのアンソニー・スレイター記者がシャムズ・シャラニア記者の情報として報じた。見返りに2028年・2030年の2巡目指名権2本をキングスへ送る。ジェイレン・ウィリアムズとケイソン・ウォーレスの長期離脱でウイング陣が手薄なサンダーの補強で、1勝8敗のキングスはロスター整理を進める。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "883-jaylen-brown-onoff-rapm-trade.html",
    cat: "NBA",
    title: "ジェイレン・ブラウンは、なぜ「数字の裏」で評価が割れたのか —— オン/オフデータとRAPMが語るセルティックス-76ersトレードの舞台裏",
    excerpt: "ESPNのザック・クラム記者は現地時間11月8日、ジェイレン・ブラウン(Jaylen Brown)の「オン/オフ」データを軸に、セルティックスが今夏ブラウンを76ersへ放出した背景を分析した特集を公開。28.7得点のオールスターがなぜ先進統計で評価されなかったのかを探る。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "882-devin-booker-24-points-rockets.html",
    cat: "NBA",
    title: "デビン・ブッカー、ロケッツ戦で24得点 —— サンズが102-99で接戦制す",
    excerpt: "フェニックス・サンズのデビン・ブッカー(Devin Booker)は現地時間11月7日、本拠地モーゲージ・マッチアップ・センターで行われたヒューストン・ロケッツ戦に39分出場し、フィールドゴール24本中10本・3ポイント9本中2本を沈めて24得点を記録した。両チーム通じてこの日の最多得点者となり、サンズは102-99でロケッツを振り切った。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "881-victor-wembanyama-29-points-trail-blazers.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、トレイルブレイザーズ戦で29得点 —— スパーズが125-103で快勝",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマ(Victor Wembanyama)は現地時間11月7日、ポートランドのモダ・センターで行われたポートランド・トレイルブレイザーズ戦に24分出場し、フィールドゴール13本中9本・3ポイント6本中3本・フリースロー9本中8本を沈めて29得点を記録した。両チーム通じてこの日の最多得点者となり、スパーズは125-103でトレイルブレイザーズに快勝した。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "880-stephen-curry-41-points-warriors.html",
    cat: "NBA",
    title: "ステフィン・カリー、マジック戦で41得点 —— ウォリアーズが126-119で勝利",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリー(Stephen Curry)は現地時間11月7日、本拠地チェイス・センターで行われたオーランド・マジック戦に36分出場し、フィールドゴール19本中13本・3ポイント10本中5本・フリースロー10本中10本を沈めて41得点を記録した。両チーム通じてこの日の最多得点者となり、ウォリアーズは126-119でマジックを下した。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "879-shai-gilgeous-alexander-30-points-wizards.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、ウィザーズ戦で30得点 —— サンダーが114-75で大勝",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダー(Shai Gilgeous-Alexander)は現地時間11月7日、本拠地ペイコム・センターで行われたワシントン・ウィザーズ戦に29分出場し、フィールドゴール20本中11本・3ポイント5本中3本を沈めて30得点を記録した。両チーム通じてこの日の最多得点者となり、サンダーは114-75でウィザーズに大勝した。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "878-jalen-johnson-30-points-nets.html",
    cat: "NBA",
    title: "ジェイレン・ジョンソン、ネッツ戦で30得点 —— ホークスが124-121の逆転勝利",
    excerpt: "アトランタ・ホークスのジェイレン・ジョンソン(Jalen Johnson)は現地時間11月7日、本拠地ステート・ファーム・アリーナで行われたブルックリン・ネッツ戦に36分出場し、フィールドゴール17本中11本・フリースロー10本中8本を沈めて30得点を記録した。両チーム通じてこの日の最多得点者となり、ホークスは試合終盤に逆転して124-121でネッツを下した。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "877-donovan-mitchell-37-points-knicks.html",
    cat: "NBA",
    title: "ドノバン・ミッチェル、ニックス戦で37得点 —— キャバリアーズは97-109で敗戦",
    excerpt: "クリーブランド・キャバリアーズのドノバン・ミッチェル(Donovan Mitchell)は現地時間11月7日、本拠地ロケット・アリーナで行われたニューヨーク・ニックス戦に37分出場し、フィールドゴール22本中13本・3ポイント13本中5本を沈めて37得点を記録した。両チーム通じてこの日の最多得点者となったが、キャバリアーズは97-109でニックスに敗れた。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "876-pascal-siakam-23-points-nuggets.html",
    cat: "NBA",
    title: "パスカル・シアカム、ナゲッツ戦で23得点 —— ペイサーズはメキシコシティで102-114の敗戦",
    excerpt: "インディアナ・ペイサーズのパスカル・シアカム(Pascal Siakam)は現地時間11月7日、メキシコシティのアリーナCDMXで行われたNBAカップ・グループステージのデンバー・ナゲッツ戦に32分出場し、フィールドゴール18本中10本・3ポイント7本中2本を沈めて23得点を記録した。両チーム通じてこの日の最多得点者となったが、ペイサーズは102-114でナゲッツに敗れた。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "875-grizzlies-saunders-two-way.html",
    cat: "NBA",
    title: "リッチー・サンダース、グリズリーズとツーウェイ契約へ —— ACL断裂からの復帰、合流練習が可能に",
    excerpt: "メンフィス・グリズリーズは、ドラフト全体32位指名のリッチー・サンダース(Richie Saunders)とツーウェイ契約で合意した。ESPNのシャムズ・シャラニア記者が現地時間11月7日、サンダースの代理人を務めるプライオリティ・スポーツの話としてそう伝えた。サンダースは2月に前十字靭帯(ACL)を断裂しリハビリ中で、契約によりチームとの合流練習が可能になる。",
    date: "2026.11.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "874-doncic-53-points-trail-blazers.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、トレイルブレイザーズ戦で53得点 —— レイカーズが124-118で勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチ(Luka Doncic)は現地時間11月6日、本拠地でのポートランド・トレイルブレイザーズ戦に38分出場し、フィールドゴール33本中17本・3ポイント15本中5本・フリースロー18本中14本を沈めて53得点を記録した。両チーム通じてこの日の最多得点者となり、レイカーズは124-118でトレイルブレイザーズを下した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "873-lebron-cleveland-return-bad-rhythm.html",
    cat: "NBA",
    title: "レブロン「いいリズムではなかった」—— クリーブランド凱旋で自己最悪級の8得点、22年続いた2桁得点が途切れる",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)は現地時間11月6日、故郷クリーブランドでのNBAカップ公式戦でキャバリアーズと対戦し、フィールドゴール12本中3本・ターンオーバー7という自己最悪級の出来で8得点に終わった。76ersは96-119でキャバリアーズに完敗し、ジェームズは試合後「いいリズムで試合をできたとは思わない」と振り返った。ESPNが伝えた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "872-victor-wembanyama-30-points-kings.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、キングス戦で30得点 —— スパーズが124-109で勝利",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマ(Victor Wembanyama)は現地時間11月6日、敵地でのサクラメント・キングス戦に26分出場し、フィールドゴール18本中10本・3ポイント6本中4本・フリースロー9本中6本を沈めて30得点を記録した。リバウンド14・ブロック2も記録し、両チーム通じてこの日の最多得点者となり、スパーズは124-109でキングスに勝利した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "871-ayo-dosunmu-26-points-pelicans.html",
    cat: "NBA",
    title: "アヨ・ドスンム、ペリカンズ戦で26得点 —— ティンバーウルブズが115-109で勝利",
    excerpt: "ミネソタ・ティンバーウルブズのアヨ・ドスンム(Ayo Dosunmu)は現地時間11月6日、敵地でのニューオーリンズ・ペリカンズ戦に39分出場し、フィールドゴール14本中8本・3ポイント6本中4本・フリースロー6本全てを沈めて26得点を記録した。アシスト4も記録し、両チーム通じてこの日の最多得点者となり、ティンバーウルブズは115-109でペリカンズに勝利した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "870-pj-washington-26-points-jazz.html",
    cat: "NBA",
    title: "P・J・ワシントン、ジャズ戦で26得点 —— マーベリックスが112-100で勝利",
    excerpt: "ダラス・マーベリックスのP・J・ワシントン(P.J. Washington)は現地時間11月6日、本拠地でのユタ・ジャズ戦に33分出場し、フィールドゴール14本中7本・3ポイント10本中6本・フリースロー7本中6本を沈めて26得点を記録した。リバウンド6も記録し、両チーム通じてこの日の最多得点者となり、マーベリックスは112-100でジャズに勝利した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "869-alijah-martin-27-points-bucks.html",
    cat: "NBA",
    title: "アライジャ・マーティン、バックス戦で27得点 —— ラプターズが121-107で逆転勝利",
    excerpt: "トロント・ラプターズのアライジャ・マーティン(Alijah Martin)は現地時間11月6日、敵地でのミルウォーキー・バックス戦に31分出場し、フィールドゴール11本中9本・3ポイント7本中6本・フリースロー4本中3本を沈めて27得点を記録した。リバウンド4・スティール2も記録し、RJ・バレットと並んで両チーム通じてこの日の最多得点者となり、ラプターズは121-107でバックスから逆転勝利を挙げた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "868-rj-barrett-27-points-bucks.html",
    cat: "NBA",
    title: "RJ・バレット、バックス戦で27得点 —— ラプターズが121-107で逆転勝利",
    excerpt: "トロント・ラプターズのRJ・バレット(RJ Barrett)は現地時間11月6日、敵地でのミルウォーキー・バックス戦に37分出場し、フィールドゴール21本中9本・フリースロー11本中9本を沈めて27得点を記録した。アシスト5・リバウンド7も記録し、アライジャ・マーティンと並んで両チーム通じてこの日の最多得点者となり、ラプターズは121-107でバックスから逆転勝利を挙げた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "867-ajay-mitchell-35-points-grizzlies.html",
    cat: "NBA",
    title: "エイジェイ・ミッチェル、グリズリーズ戦で35得点 —— サンダーが128-97で快勝",
    excerpt: "オクラホマシティ・サンダーのエイジェイ・ミッチェル(Ajay Mitchell)は現地時間11月6日、敵地でのメンフィス・グリズリーズ戦に30分出場し、フィールドゴール20本中14本・3ポイント7本中4本・フリースロー5本中3本を沈めて35得点を記録した。アシスト5も記録し、両チーム通じてこの日の最多得点者となり、サンダーは128-97でグリズリーズに快勝した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "866-donovan-mitchell-23-points-76ers.html",
    cat: "NBA",
    title: "ドノバン・ミッチェル、76ers戦で23得点8アシスト —— キャバリアーズが119-95で快勝",
    excerpt: "クリーブランド・キャバリアーズのドノバン・ミッチェル(Donovan Mitchell)は現地時間11月6日、本拠地でのフィラデルフィア・76ers戦に33分出場し、フィールドゴール18本中7本・3ポイント6本中1本・フリースロー10本中8本を沈めて23得点を記録した。アシスト8・リバウンド7・スティール2も合わせ、両チーム通じてこの日の最多得点者となり、キャバリアーズは119-95で76ersに快勝した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "865-kyshawn-george-33-points-hawks.html",
    cat: "NBA",
    title: "カイショーン・ジョージ、ホークス戦で33得点 —— ウィザーズは132-139で敗戦",
    excerpt: "ワシントン・ウィザーズのカイショーン・ジョージ(Kyshawn George)は現地時間11月6日、敵地でのアトランタ・ホークス戦に39分出場し、フィールドゴール19本中10本・3ポイント7本中5本を沈めて33得点を記録した。アシスト7・ブロック2も記録し、両チーム通じてこの日の最多得点者となったが、ウィザーズは132-139でホークスに敗れた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "864-jayson-tatum-34-points-hornets.html",
    cat: "NBA",
    title: "ジェイソン・テイタム、ホーネッツ戦で34得点 —— セルティックスが119-80で大勝",
    excerpt: "ボストン・セルティックスのジェイソン・テイタム(Jayson Tatum)は現地時間11月6日、敵地でのシャーロット・ホーネッツ戦に29分出場し、フィールドゴール16本中9本・3ポイント8本中5本・フリースロー11本を全て沈めて34得点を記録した。アシスト9・リバウンド8も合わせ、両チーム通じてこの日の最多得点者となり、セルティックスは119-80でホーネッツに大勝した。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "863-nike-lebron-24-purple-aura.html",
    cat: "KICKS",
    title: "Nike LeBron 24「Purple Aura」が12月14日発売 —— 品番IO8201-500、8勝1敗と好調な76ersのレブロンに新色",
    excerpt: "ナイキは、フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)が手がける最新シグネチャーモデル「Nike LeBron 24」の新色「Purple Aura」(品番IO8201-500)を2026年12月14日に発売する。パープルを基調にしたカラーリングで、レブロンが加入した76ersが開幕から好調なスタートを切っている時期の新色となる。Sneaker Newsが伝えた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "862-spoelstra-heat-defense-resumes-quote.html",
    cat: "NBA",
    title: "スポールストラ「経歴や紙切れは守備をしない」—— ヒート守備は18年指揮でワースト圏、ジアニスはメディア対応を拒否",
    excerpt: "マイアミ・ヒート(Miami Heat)のエリック・スポールストラ(Erik Spoelstra)HCは現地時間11月5日、ウォリアーズ戦(120-100で敗戦)前の会見で、低迷するチーム守備について「経歴や紙切れは守備をしてくれない」と語った。ヒートの守備レーティングは26位(117.5)で、18年のヒート指揮でワースト圏に沈んでいる。The Athletic(Sam Amick記者)が伝えた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "861-porzingis-steps-away-health.html",
    cat: "NBA",
    title: "ポルジンギス本人が「バスケから離れる」と表明 —— ウォリアーズは契約維持、2月までトレード模索続行",
    excerpt: "ゴールデンステート・ウォリアーズのクリスタプス・ポルジンギス(Kristaps Porzingis)は現地時間11月6日、自身のXで健康を最優先するため「バスケットボールから離れる」と表明した。公式な引退ではなく、球団は来年2月11日のトレード期限まで契約を動かせる状態を維持する方針。ESPNのアンソニー・スレーター記者が伝えた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "860-nike-kobe-ad-protro-coals.html",
    cat: "KICKS",
    title: "Nike Kobe AD Protro「Coals」が12月発売 —— 品番IO8233-002、Kobe 6「Coals」と対になるクリスマス企画",
    excerpt: "ナイキは、コービー・ブライアント(Kobe Bryant)のパフォーマンスシューズ「Kobe AD Protro」の新色「Coals」(品番IO8233-002)を2026年12月に発売する。ブラック・パープル・ライムグリーンの配色で、同時期に登場する「Kobe 6 Protro」の「Coals」と組み合わせるクリスマス企画の一足。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.07",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "859-doc-rivers-giannis-bucks-exit.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ退団の内幕、リバーズ前HCが激白 —— 「彼は悪者になりたくなかった」",
    excerpt: "元ミルウォーキー・バックスのヘッドコーチ、ドック・リバーズ(Doc Rivers)は現地時間11月5日、ポッドキャスト「The Bill Simmons Podcast」で、ヤニス・アデトクンボ(Giannis Antetokounmpo)がバックスからの退団を望みながらも自らトレードを要求せず、フロント側に「トレードする」と言わせたがっていたと明かした。アデトクンボは今夏のトレードでボビー・ポーティスとともにマイアミ・ヒートへ移っている。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "858-seattle-nba-crawford-advisor.html",
    cat: "NBA",
    title: "ジャマール・クロフォード、シアトルNBA復帰ビッドのアドバイザーに —— サマンサ・ハロウェイ氏陣営、評価額は約60億ドル",
    excerpt: "シアトル出身の元NBA選手ジャマール・クロフォードが、シアトルへのNBA拡張球団ビッドでサマンサ・ハロウェイ氏率いるグループのアドバイザーを務めていることが分かった。同グループの評価額は約60億ドルとみられる。ESPNのラモーナ・シェルバーン記者が報じた。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "857-nike-lebron-24-christmas.html",
    cat: "KICKS",
    title: "Nike LeBron 24「Christmas」(品番IO8205-300)が姿を見せる —— グリーンのジップカバー仕立て、Book 2・Sabrina 4と並ぶホリデーコレクション",
    excerpt: "ナイキは、フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)が手がける最新シグネチャーモデル「Nike LeBron 24」の新色「Christmas」(品番IO8205-300)の画像を公開した。グリーンのシンセティック素材の上にジッパー付きのカバーを重ねた仕立てで、同時期に登場する「Nike Sabrina 4」「Nike Book 2」の赤いクリスマス新色とともに、ナイキ バスケットボールのホリデーコレクションを構成する。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "856-stephen-curry-29-points-heat.html",
    cat: "NBA",
    title: "ステフィン・カリー、ヒート戦で29得点 —— ウォリアーズが120-100で6連勝",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリー(Stephen Curry)は現地時間11月5日、本拠地でのマイアミ・ヒート戦に28分出場し、フィールドゴール19本中9本・3ポイント12本中6本を沈めて29得点を記録した。ウォリアーズは120-100でヒートに勝利し、両チーム通じてこの日の最多得点者となったカリーの活躍で6連勝とした。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "855-devin-booker-30-points-magic.html",
    cat: "NBA",
    title: "デビン・ブッカー、マジック戦で30得点8アシスト —— サンズが117-104で勝利",
    excerpt: "フェニックス・サンズのデビン・ブッカー(Devin Booker)は現地時間11月5日、本拠地でのオーランド・マジック戦に34分出場し、フィールドゴール22本中11本・3ポイント8本中4本を沈めて30得点・8アシストを記録した。サンズは117-104でマジックに勝利し、両チーム通じてこの日の最多得点者となった。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "854-bleague-episode-zero-book.html",
    cat: "JAPAN",
    title: "Bリーグ誕生前夜の119日間を描く『Bリーグ エピソードゼロ』、本日刊行 —— 著者は川淵三郎氏タスクフォースの「ナンバー2」",
    excerpt: "株式会社講談社は11月6日、日本のバスケットボール界が2リーグ分裂からB.LEAGUE誕生に至るまでの119日間を描いたノンフィクション『Bリーグ エピソードゼロ 日本バスケットボール界を変えた119日間』を刊行した。著者は境田正樹氏(TMI総合法律事務所)で、当時、川淵三郎氏率いるタスクフォースの「ナンバー2」として交渉の最前線に立った弁護士本人による著作になる。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "853-bronny-james-g-league-assignment.html",
    cat: "NBA",
    title: "レイカーズ、ブロニー・ジェームズをGリーグへ降格 —— 開幕7勝2敗の好調チームで出場機会乏しく",
    excerpt: "ロサンゼルス・レイカーズは現地時間11月5日、ブロニー・ジェームズ(22)をGリーグ提携チームのコーチェラ・バレー・レイカーズへ降格させた。開幕7勝2敗と好調なチームで出場機会はわずか5試合・平均2.4分0.8得点にとどまっていた。ESPNが伝えた。",
    date: "2026.11.06",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "852-wembanyama-52-points-mvp-quote.html",
    cat: "NBA",
    title: "ウェンバンヤマ「もっとこうあるべきだ。もっと頻繁に」—— チェンバレン以来の52得点24リバウンド8ブロック",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマ(Victor Wembanyama)は現地時間11月4日、本拠地でのダラス・マーベリックス戦で52得点・24リバウンド・8ブロックを記録し、112-111の勝利後「もっとこうあるべきだ。もっと頻繁に」と語った。ブロックが公式スタッツとなった1973-74シーズン以降、このラインに並んだのは本人が初めてで、同等以上の数字は1961年にウィルト・チェンバレン(Wilt Chamberlain)が記録した1度のみだという。ESPNが伝えた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "851-lebron-bron-ai-cease-desist.html",
    cat: "NBA",
    title: "レブロン・ジェームズ、AI予想アプリ「Bron AI」に使用停止要求 —— 無断の肖像使用に代理人が抗議",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)は現地時間11月5日、スポーツベッティング予想アプリ「Bron AI」が本人の許可なく肖像を使用しているとして、運営会社PlayVision社に使用停止を求める通知書(cease-and-desist)を送った。広告は「23」番のユニフォーム姿で本人を思わせる人物の後ろ姿を描いており、代理人の弁護士は「NBAの規則に抵触するほど深刻な印象を与えている」と指摘したとFront Office Sportsが伝え、ESPNが報じた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "850-nike-book-2-christmas.html",
    cat: "KICKS",
    title: "Nike Book 2「Christmas」(品番IO7943-600)が透明シュラウドを纏う —— ブッカーの2代目シグネチャー、Sabrina 4と呼応するホリデー仕立て",
    excerpt: "ナイキは、デビン・ブッカー(Devin Booker)の2代目シグネチャーモデル「Nike Book 2」の新色「Christmas」(品番IO7943-600)の画像を公開した。アッパーの大部分を透明なシュラウド(覆い)で包んだ仕立てで、同じ透明シュラウドを使う「Nike Sabrina 4」とともに、ナイキ バスケットボールのホリデーコレクションを構成する。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "849-nike-kobe-6-protro-brunson-pe.html",
    cat: "KICKS",
    title: "Nike Kobe 6 Protro「Jalen Brunson PE」をブランソンが初披露 —— ブルズ戦で前半26得点、ニックスが135-105で快勝",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソン(Jalen Brunson)は現地時間11月4日、本拠地でのシカゴ・ブルズ戦で新しいプレーヤーエクスクルーシブ「Nike Kobe 6 Protro」(ブルー×オレンジ)を初めて着用した。前半だけで26得点を記録し、最終的に33得点。開幕から出だしに苦しんでいたディフェンディングチャンピオンのニックスは、この勝利で勝率5割に戻したという。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "848-jokic-nuggets-slow-start.html",
    cat: "NBA",
    title: "ニコラ・ヨキッチ、開幕7試合でキャリア最低効率 —— 脇役不足のナゲッツに広がる危機感",
    excerpt: "デンバー・ナゲッツのニコラ・ヨキッチ(Nikola Jokic)は2026-27シーズン開幕7試合でフィールドゴール成功率50.4%・3P成功率21.9%とキャリア最低レベルの効率に苦しんでいる。チームも4勝3敗で勝率5割超えの相手には3戦全敗と苦しい立ち上がりで、デイビッド・アデルマンHCは「6試合のサンプルサイズ」と火消しに回るが、手薄な脇役陣への不安が広がっているとESPNが伝えた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "847-ryukyu-kings-emperor-cup-bracket.html",
    cat: "JAPAN",
    title: "琉球ゴールデンキングス、天皇杯ファイナルラウンドは2回戦から —— 初戦1月6日・代々木第一体育館、10度目の出場",
    excerpt: "沖縄バスケットボール株式会社は11月5日、日本バスケットボール協会が発表した「第102回天皇杯 全日本バスケットボール選手権大会」ファイナルラウンドの組み合わせで、琉球ゴールデンキングスが2回戦から出場することを発表した。初戦は2027年1月6日、国立代々木競技場第一体育館で東北ブロック代表・日本体育大学の勝者と対戦する。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "846-bam-adebayo-35-points-clippers.html",
    cat: "NBA",
    title: "バム・アデバヨ、クリッパーズ戦で35得点 —— ヒートがOTで117-116の接戦を制す",
    excerpt: "マイアミ・ヒートのバム・アデバヨ(Bam Adebayo)は現地時間11月4日、本拠地でのロサンゼルス・クリッパーズ戦に41分出場し、フィールドゴール20本中14本・フリースロー8本中6本を沈めて35得点、リバウンド10・アシスト4を記録した。両チーム通じてこの日の最多得点者となり、ヒートは延長戦の末117-116でクリッパーズを下した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "845-rui-hachimura-21-points-heat.html",
    cat: "NBA",
    title: "八村塁、ヒート戦で21得点9リバウンド7アシスト —— クリッパーズはOTで116-117の惜敗",
    excerpt: "ロサンゼルス・クリッパーズの八村塁(Rui Hachimura)は現地時間11月4日、敵地でのマイアミ・ヒート戦に37分出場し、フィールドゴール18本中7本・フリースロー7本中6本を沈めて21得点、リバウンド9・アシスト7を記録した。試合は延長戦までもつれ、クリッパーズは116-117の1点差でヒートに惜敗した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "844-yokohama-excellence-tachikawa-win.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、立川ダイス戦を99-97で制す —— ローソンが来日通算4,000得点、B.LEAGUE ONE第8節",
    excerpt: "横浜エクセレンスは11月4日、アウェーで対戦した立川ダイスとのB.LEAGUE ONE 2026-27シーズン第8節で99-97の接戦を制した。試合では#34ベンジャミン・ローソンが来日通算4,000得点を達成する節目にもなった。",
    date: "2026.11.05",
    thumb: "../assets/journal-844-hero.jpg?v=9dc61f0e2c"
  },
  {
    href: "843-lebron-too-early-finals-talk.html",
    cat: "NBA",
    title: "レブロン「ファイナルの話は時期尚早」—— 76ersが8勝1敗、唯一の黒星ピストンズに雪辱",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)は現地時間11月4日、敵地デトロイトでのピストンズ戦後、開幕8勝1敗の好スタートについて「ファイナルの話をするのは時期尚早だ」と慎重な姿勢を示した。76ersはこの試合で今季唯一の黒星を付けたピストンズに112-106で雪辱し、ジェイレン・ブラウンがシーズンハイの30得点を記録した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "842-luka-doncic-40-points-kings.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、キングス戦で40得点 —— レイカーズが116-103で勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチ(Luka Doncic)は現地時間11月4日、敵地でのサクラメント・キングス戦に35分出場し、フィールドゴール23本中11本・3ポイント13本中6本・フリースロー13本中12本を沈めて40得点を記録した。両チーム通じてこの日の最多得点者となり、レイカーズは116-103でキングスを下した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "841-victor-wembanyama-52-points-mavericks.html",
    cat: "NBA",
    title: "ヴィクター・ウェンバンヤマ、マーベリックス戦で52得点24リバウンド8ブロック —— スパーズが112-111の接戦を制す",
    excerpt: "サンアントニオ・スパーズのヴィクター・ウェンバンヤマ(Victor Wembanyama)は現地時間11月4日、本拠地でのダラス・マーベリックス戦に34分出場し、フィールドゴール28本中16本・フリースロー23本中19本を沈めて52得点、リバウンド24・ブロック8を記録した。スパーズは112-111の1点差でマーベリックスを振り切った。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "840-kevin-durant-21-points-timberwolves.html",
    cat: "NBA",
    title: "ケビン・デュラント、ティンバーウルブズ戦で21得点 —— ロケッツは107-117で敗戦",
    excerpt: "ヒューストン・ロケッツのケビン・デュラント(Kevin Durant)は現地時間11月4日、本拠地でのミネソタ・ティンバーウルブズ戦に35分出場し、フィールドゴール14本中7本・3ポイント5本中2本・フリースロー6本中5本を沈めて21得点を記録した。ティンバーウルブズのアヨ・ドスンムと並び両チーム通じてこの日の最多得点者となったが、ロケッツは107-117でティンバーウルブズに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "839-ayo-dosunmu-21-points-rockets.html",
    cat: "NBA",
    title: "アヨ・ドスンム、ロケッツ戦で21得点 —— ティンバーウルブズが117-107で勝利",
    excerpt: "ミネソタ・ティンバーウルブズのアヨ・ドスンム(Ayo Dosunmu)は現地時間11月4日、敵地でのヒューストン・ロケッツ戦に34分出場し、フィールドゴール20本中10本を沈めて21得点、アシスト6・スティール2を記録した。ロケッツのケビン・デュラントと並び両チーム通じてこの日の最多得点者となり、ティンバーウルブズは117-107でロケッツを下した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "838-nikola-jokic-32-points-raptors.html",
    cat: "NBA",
    title: "ニコラ・ヨキッチ、ラプターズ戦で32得点11アシスト10リバウンド —— ナゲッツが128-109で快勝",
    excerpt: "デンバー・ナゲッツのニコラ・ヨキッチ(Nikola Jokic)は現地時間11月4日、本拠地でのトロント・ラプターズ戦に30分出場し、フィールドゴール19本中13本を沈めて32得点、アシスト11・リバウンド10のトリプルダブルを記録した。両チーム通じてこの日の最多得点者となり、ナゲッツは128-109でラプターズに快勝した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "837-devin-booker-33-points-trail-blazers.html",
    cat: "NBA",
    title: "デビン・ブッカー、トレイルブレイザーズ戦で33得点 —— サンズは119-132で敗戦",
    excerpt: "フェニックス・サンズのデビン・ブッカー(Devin Booker)は現地時間11月4日、本拠地でのポートランド・トレイルブレイザーズ戦に34分出場し、フィールドゴール19本中9本・3ポイント8本中2本・フリースロー13本中13本を沈めて33得点を記録した。両チーム通じてこの日の最多得点者となったが、サンズは119-132でトレイルブレイザーズに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "836-keyonte-george-39-points-pelicans.html",
    cat: "NBA",
    title: "キヨンテ・ジョージ、ペリカンズ戦でキャリアハイ39得点 —— ジャズはOTで113-120の敗戦",
    excerpt: "ユタ・ジャズのキヨンテ・ジョージ(Keyonte George)は現地時間11月4日、敵地でのニューオーリンズ・ペリカンズ戦に44分出場し、フィールドゴール26本中14本・3ポイント9本中2本・フリースロー13本中9本を沈めて39得点、アシスト9・スティール4を記録した。両チーム通じてこの日の最多得点者となったが、ジャズはオーバータイムにもつれた末、113-120でペリカンズに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "835-shai-gilgeous-alexander-42-points-cavaliers.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、キャバリアーズ戦で42得点 —— サンダーが124-116で勝利",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダー(Shai Gilgeous-Alexander)は現地時間11月4日、本拠地でのクリーブランド・キャバリアーズ戦に35分出場し、フィールドゴール26本中11本・3ポイント11本中5本・フリースロー19本中15本を沈めて42得点、アシスト8を記録した。両チーム通じてこの日の最多得点者となり、サンダーは124-116でキャバリアーズに勝利した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "834-ty-jerome-23-points-pacers.html",
    cat: "NBA",
    title: "タイ・ジェローム、ペイサーズ戦で23得点 —— グリズリーズは103-107で敗れる",
    excerpt: "メンフィス・グリズリーズのタイ・ジェローム(Ty Jerome)は現地時間11月4日、本拠地でのインディアナ・ペイサーズ戦に29分出場し、フィールドゴール20本中10本・3ポイント10本中2本・フリースロー2本中1本を沈めて23得点、アシスト3を記録した。チームメイトのセドリック・カワードと並び両チーム通じてこの日の最多得点者だったが、グリズリーズは103-107でペイサーズに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "833-cedric-coward-23-points-pacers.html",
    cat: "NBA",
    title: "セドリック・カワード、ペイサーズ戦で23得点 —— グリズリーズは103-107で敗れる",
    excerpt: "メンフィス・グリズリーズのセドリック・カワード(Cedric Coward)は現地時間11月4日、本拠地でのインディアナ・ペイサーズ戦に33分出場し、フィールドゴール19本中8本・3ポイント12本中4本・フリースロー4本中3本を沈めて23得点、リバウンド9・アシスト4・スティール4を記録した。チームメイトのタイ・ジェロームと並び両チーム通じてこの日の最多得点者だったが、グリズリーズは103-107でペイサーズに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "832-naz-reid-28-points-nets.html",
    cat: "NBA",
    title: "ナズ・リード、ネッツ戦で28得点 —— ホーネッツは104-114で敗れる",
    excerpt: "シャーロット・ホーネッツのナズ・リード(Naz Reid)は現地時間11月4日、敵地でのブルックリン・ネッツ戦に36分出場し、フィールドゴール18本中11本・3ポイント5本中2本・フリースロー5本中4本を沈めて28得点、リバウンド9を記録した。両チーム通じてこの日の最多得点者だったが、ホーネッツは104-114でネッツに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "831-paul-george-25-points-bucks.html",
    cat: "NBA",
    title: "ポール・ジョージ、バックス戦で25得点 —— セルティックスが109-102で勝利",
    excerpt: "ボストン・セルティックスのポール・ジョージ(Paul George)は現地時間11月4日、本拠地でのミルウォーキー・バックス戦に35分出場し、フィールドゴール18本中8本・3ポイント9本中5本・フリースロー7本中4本を沈めて25得点、アシスト5・スティール4を記録した。セルティックスは109-102でバックスを下した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "830-tyler-herro-25-points-celtics.html",
    cat: "NBA",
    title: "タイラー・ヒーロー、セルティックス戦で25得点 —— バックスは102-109で敗れる",
    excerpt: "ミルウォーキー・バックスのタイラー・ヒーロー(Tyler Herro)は現地時間11月4日、敵地でのボストン・セルティックス戦に33分出場し、フィールドゴール17本中8本・3ポイント10本中4本・フリースロー5本全てを沈めて25得点を記録し、チーム最多得点者となった。バックスは102-109でセルティックスに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "829-jaylen-brown-30-points-pistons.html",
    cat: "NBA",
    title: "ジェイレン・ブラウン、ピストンズ戦で30得点 —— 76ersが112-106で勝利",
    excerpt: "フィラデルフィア・セブンティシクサーズのジェイレン・ブラウン(Jaylen Brown)は現地時間11月4日、敵地でのデトロイト・ピストンズ戦に37分出場し、フィールドゴール19本中11本・3ポイント5本中3本・フリースロー7本中5本を沈めて30得点、リバウンド7を記録した。両チーム通じてこの日の最多得点者で、76ersは112-106でピストンズを下した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "828-jalen-brunson-33-points-bulls.html",
    cat: "NBA",
    title: "ジェイレン・ブランソン、ブルズ戦で33得点 —— ニックスが135-105で快勝",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソン(Jalen Brunson)は現地時間11月4日、本拠地でのシカゴ・ブルズ戦に28分出場し、フィールドゴール17本中10本・3ポイント10本中5本・フリースロー9本中8本を沈めて33得点、アシスト4を記録した。両チーム通じてこの日の最多得点者で、ニックスは135-105でブルズに快勝した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "827-anthony-davis-26-points-hawks.html",
    cat: "NBA",
    title: "アンソニー・デイビス、ホークス戦で26得点 —— ウィザーズは105-120で敗戦",
    excerpt: "ワシントン・ウィザーズのアンソニー・デイビス(Anthony Davis)は現地時間11月4日、本拠地でのアトランタ・ホークス戦に30分出場し、フィールドゴール19本中12本・フリースロー2本中2本を沈めて26得点、リバウンド10・ブロック3を記録した。両チーム通じてこの日の最多得点(ホークスのニキール・アレクサンダー＝ウォーカーと並ぶ)だったが、ウィザーズは105-120でホークスに敗れた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "826-nickeil-alexander-walker-26-points-wizards.html",
    cat: "NBA",
    title: "ニキール・アレクサンダー＝ウォーカー、ウィザーズ戦で26得点 —— ホークスが120-105で勝利",
    excerpt: "アトランタ・ホークスのニキール・アレクサンダー＝ウォーカー(Nickeil Alexander-Walker)は現地時間11月4日、敵地でのワシントン・ウィザーズ戦に32分出場し、フィールドゴール20本中9本・3ポイント14本中6本・フリースロー2本中2本を沈めて26得点を記録した。両チーム通じてこの日の最多得点(ウィザーズのアンソニー・デイビスと並ぶ)で、ホークスは120-105でウィザーズを下した。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "825-kon-knueppel-hamstring-reinjury.html",
    cat: "NBA",
    title: "コン・カニップル、シーズン復帰戦で6分弱で途中退場 —— 左ハムストリングを再び痛め前半で欠場に",
    excerpt: "シャーロット・ホーネッツのコン・カニップル(Kon Knueppel)は現地時間11月4日、ブルックリン・ネッツ戦でのシーズン初出場からわずか6分弱で、オフシーズンから抱えていた左ハムストリングの負傷を再び痛めたような様子を見せた。チームは「左足の張り」として前半で欠場を発表。カニップルはこの負傷でプレシーズンを全休し、開幕から8試合を欠場していた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "824-air-zoom-generation-gloria-james-pe.html",
    cat: "KICKS",
    title: "Nike Air Zoom Generation「Gloria James」が2027年春に発売 —— レブロンの母に捧げた非売品PEが約17年越しで一般販売へ",
    excerpt: "ナイキは、レブロン・ジェームズの初代シグネチャーモデル「Air Zoom Generation」のPE(プレイヤーエディション)カラー「Gloria James」を2027年春に一般発売する。白・メタリックシルバー・リアルピンクを基調にしたこのカラーは、レブロンをアクロンで一人で育てた母グロリアに捧げたもので、当初は10足未満しか作られず店頭には並ばなかった。Sneaker News、Sneaker Bar Detroitが伝えた。",
    date: "2026.11.05",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "823-air-jordan-1-high-og-starfall.html",
    cat: "KICKS",
    title: "Air Jordan 1 High OG「Starfall」が中国限定で登場 —— スウッシュのステッチ輪郭とウイングロゴ移動、複数手法を重ねた一足",
    excerpt: "ジョーダン ブランドは、Air Jordan 1 High OGの新色「Starfall」(品番IZ5845-011)を2026年11月、中国限定で発売する。レザーのスウッシュをステッチの輪郭線に置き換え、パンチングの位置をずらし、ウイングロゴを襟元のキャンバスパッチへ移すなど、複数の手法を重ねた一足。Sneaker News・Sneaker Bar Detroitなどが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "822-air-jordan-15-17-low-black-pack.html",
    cat: "KICKS",
    title: "Air Jordan 15 / Air Jordan 17 Low「Black Pack」が11月7日発売 —— ブラックアウト4モデルコレクション",
    excerpt: "ジョーダン ブランドは、Air Jordan 15とAir Jordan 17 Lowを含む「Black Pack」を2026年11月7日に発売する。黒を基調にしたカラーアウトの4モデルコレクションで、Air Jordan 15は240ドル、Air Jordan 17 Lowは245ドル(いずれも米国価格)。Sneaker Newsなどが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "821-porzingis-warriors-withhold-pay.html",
    cat: "NBA",
    title: "ポルジンギス、ウォリアーズが今季分2000万ドルの支払いを停止 —— 2月11日までトレード模索継続、本人は引退に傾く",
    excerpt: "ゴールデンステート・ウォリアーズは、無期限離脱中のクリスタプス・ポルジンギスについて「職務を履行していない」と判断し、今季分の年俸2000万ドルの支払いを停止していることが、ESPNのシャムズ・シャラニア記者とアンソニー・スレーター記者の報道で明らかになった。球団は来年2月11日のトレード期限前ならいつでも契約を動かせるとし、模索を続ける方針。31歳の本人はNBAでのキャリアに幕を引く意向に傾いているという。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "820-nike-zoom-hyperflight-safari.html",
    cat: "KICKS",
    title: "Nike Zoom Hyperflight「Safari」が2026年ホリデー発売へ —— 品番IZ2573-010、バスケアーカイブの再始動",
    excerpt: "ナイキは、バスケットボールのパフォーマンスアーカイブから「Nike Zoom Hyperflight」を新色「Safari」で復活させる。スペックル柄のモールドアッパーにオレンジの差し色、半透明のアウトソールを組み合わせた一足。品番はIZ2573-010、価格170ドル(米国)、2026年ホリデーシーズンにナイキ・一部取扱店で発売予定。Hypebeastが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "819-nike-air-bakin-high-sp-varsity-royal.html",
    cat: "KICKS",
    title: "Nike Air Bakin HIGH SP「Varsity Royal & Black」が登場 —— 90年代バスケアーカイブの一足、2度目の復刻",
    excerpt: "ナイキは、1990年代後半のバスケットボールシューズ「Air Bakin」のアーカイブから、新色「Air Bakin HIGH SP」の「Varsity Royal & Black」を発表した。ボリューム感のあるハイカットシルエットに、バーシティロイヤルとブラックのリブ仕様アッパーを組み合わせ、かかとにMax Air・前足部にAirを搭載する。発売日・価格は本稿執筆時点で非公表。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "818-bleague-allstar-2027-fan-vote.html",
    cat: "JAPAN",
    title: "「B.LEAGUE ALL-STAR GAME 2027」ファン投票スタート —— 舞台は愛知・名古屋、『B.LEAGUE CARD』でスタメン5人に投票",
    excerpt: "株式会社VOLZは11月4日、公式デジタルトレーディングカードサービス『B.LEAGUE CARD』で「りそなグループ B.LEAGUE ALL-STAR GAME 2027」のファン投票を開始したと発表した。2027年の開催地は愛知・名古屋。「B.BLACK」「B.WHITE」それぞれに理想のスタメン5人を編成して投票でき、1日1票の無料投票に加え、カードパックを引くことで最大3票まで増やせる。投票期間は11月8日23:59まで。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "817-devin-vassell-spurs-consistent.html",
    cat: "NBA",
    title: "デビン・バッセルが「最も安定した男」—— ウェンバンヤマ・フォックスら主役級が並ぶスパーズを支える派手さ抜きの存在感",
    excerpt: "サンアントニオ・スパーズでプレーするデビン・バッセル(Devin Vassell)は、ビクター・ウェンバンヤマやディアロン・フォックスら華やかな主力が並ぶ中、目立たないが欠かせない存在として今季も開幕7年目を迎えている。ミッチ・ジョンソン監督は「ロースターで最も安定した人物」と評価。ESPNのマイケル・C・ライト記者が現地時間11月4日、バッセルの役割を特集した。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "816-nba-power-rankings-week2.html",
    cat: "NBA",
    title: "ロケッツが開幕2週目で初の首位 —— ウォリアーズは27位から12位に急浮上、サンダー・ウォルブスは離脱者続出で後退",
    excerpt: "ESPNは現地時間11月4日、NBA開幕2週目時点の最新パワーランキングを公開。フレッド・ヴァンブリートが復帰したヒューストン・ロケッツが前回4位から初の首位に浮上した。ゴールデンステイト・ウォリアーズはルーキーのヤクセル・レンデボーグの活躍で27位から12位へ急上昇。一方、主力の負傷が相次いだオクラホマシティ・サンダーは1位から10位、ミネソタ・ティンバーウルブズは2位から11位まで後退した。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "815-torsten-loibl-online-clinic.html",
    cat: "JAPAN",
    title: "シュート練習を「試合で生み出す力」へ —— トーステン・ロイブル氏のオンライン講習を11月25日に開催",
    excerpt: "育成年代のバスケットボール指導を学ぶオンライン講習「Torsten Loibl ONLINE CLINIC Vol.2」が、11月25日（水）20:00〜21:30（日本時間）にZoomで開かれる。主催はRiot Basketball Academy（RBA）。テーマは、育成年代を含む指導現場でのシューター育成と、現代バスケットボールにおけるシューターの活かし方。講義は英語で行われ、日本語の逐次通訳を含む90分となる。",
    date: "2026.11.04",
    thumb: "../assets/journal-815-hero.jpg?v=a893677341"
  },
  {
    href: "814-nba-docomo-november-schedule.html",
    cat: "NBA",
    title: "「NBA docomo」11月の配信試合が決定 —— 八村塁出場のクリッパーズvsスパーズ含む全74試合、Emirates NBA Cupも配信",
    excerpt: "NTTドコモが提供する映像配信サービス「NBA docomo」は4日、NBA2026-27シーズン11月の配信試合を発表した。レギュラーシーズン74試合全てを日本語実況・解説付きで配信し、10月31日に開幕したEmirates NBA Cupの対象試合も配信する。目玉は八村塁選手出場予定のロサンゼルス・クリッパーズと、ビクター・ウェンバンヤマが率いるサンアントニオ・スパーズの対戦(20日)。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "813-puma-mb06-lafrance-stranger-things.html",
    cat: "KICKS",
    title: "PUMA MB.06 / LaFrancé RNR「Stranger Things」が11月6日発売 —— ラメロ・ボールのシグネチャーに人気ドラマコラボ",
    excerpt: "プーマ ジャパンは、ラメロ・ボールのシグネチャーモデル「PUMA MB.06」とライフスタイルシューズ「LaFrancé RNR」に『ストレンジャー・シングス』とのコラボレーションモデルを2026年11月6日発売する。「MB.06 Stranger Things」(品番313625、22,000円)は紫を基調にピンクのアクセントを配し、作中のクリーチャーや謎をイメージしたディテールを採用。「LaFrancé RNR Stranger Things」(品番313928、20,900円)は紫のアッパーにピンクのシューレースを合わせ、「裏側の世界」をイメージしたグラフィックを施した。「PUMA BASKETBALL INFORMATION」第五弾として発表された。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "812-nba-title-mvp-race-wide-open.html",
    cat: "NBA",
    title: "サンダー四重苦、ニックス・スパーズも苦戦 —— 開幕2週間でタイトル・MVP争いが大混戦に",
    excerpt: "開幕前の優勝候補サンダー・ニックス・スパーズが、ジェイレン・ウィリアムズやチェット・ホルムグレンらの大怪我・苦戦で失速。ESPNの優勝確率(BPI)は3強合計58%から38%まで低下した。MVP戦線も連続受賞中のニコラ・ヨキッチとシェイ・ギルジャス・アレクサンダーが数字を落とし、ビクター・ウェンバンヤマが有力候補に浮上している。ESPNのザック・クラム記者らが分析した。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "811-kawhi-leonard-knee-return-process.html",
    cat: "NBA",
    title: "カワイ・レナード、左膝の治療完了 —— 復帰プロセス開始、ラプターズは1週間後に経過発表",
    excerpt: "トロント・ラプターズは現地時間11月3日、カワイ・レナードが左膝の腫れに対する治療を終え「復帰に向けたプロセス」に入ったと発表した。今季出場はわずか2試合で、1週間後に次の経過発表が行われる。ESPNが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "810-bape-adidas-crazy-energy-plus.html",
    cat: "KICKS",
    title: "BAPE × adidas Crazy Energy Plus、ジェイレン・ウィリアムズが主役のキャンペーン始動 —— 品番KH8660",
    excerpt: "adidasはバスケットボールシューズ「Crazy Energy Plus」のBAPEコラボキャンペーンを始動した。主役を務めるのはサンダーのジェイレン・ウィリアムズ。シルバーカモのアッパーに紫カモのアパレル、Baby Milo小物を合わせた一式で、品番はKH8660。Sneaker Bar Detroitが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "809-nike-gt-cut-4-baja-blast.html",
    cat: "KICKS",
    title: "Nike Zoom GT Cut 4 新色「Baja Blast」—— ペイジ・ベッカーズの次期シグネチャーカラー、品番IX2113-300",
    excerpt: "ペイジ・ベッカーズのシグネチャーモデル「Nike Zoom GT Cut 4」に、新色「Baja Blast」が登場する。今季すでに発売された「Shirley Buckets」に続く一足で、品番はIX2113-300。発売日・価格は本稿時点で非公開。Sneaker Newsが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "808-mavericks-dumont-controlling-owner.html",
    cat: "NBA",
    title: "マーベリックス、デュモン家が株式69%の支配株主に —— アデルソン家の保有株を買収、新アリーナ計画は継続",
    excerpt: "ダラス・マーベリックスは、シヴァン・デュモンとパトリック・デュモンがミリアム・アデルソンの保有株を先月買収し、デュモン家がフランチャイズの69%を握る支配株主になった。パトリックは「ダラスへの長期投資」と語り、新アリーナ計画は継続する。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "807-nike-gt-cut-4-n7.html",
    cat: "KICKS",
    title: "Nike GT Cut 4「N7」が11月7日発売 —— 先住民コミュニティ支援プログラムの新色、品番IV5677-300",
    excerpt: "ナイキは、バスケットボールシューズ「Nike GT Cut 4」の新色「N7」を2026年11月7日に発売する。ネイティブ・アメリカンと先住民コミュニティのスポーツ参加を支援するナイキの「N7」プログラムに連なる一足で、アーティストのスティーブン・ポール・ジャッド氏がデザインを手がけた。品番はIV5677-300。Sneaker Bar Detroitが伝えた。",
    date: "2026.11.04",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "806-thunder-sign-dalen-terry.html",
    cat: "NBA",
    title: "サンダー、ダレン・テリーと2年契約で合意 —— アバジ撤回後のロスター枠を補強",
    excerpt: "オクラホマシティ・サンダーは、フリーエージェントのスウィングマン、ダレン・テリー(24)と2年契約で合意した。ESPNのシャムズ・シャラニア記者が関係者の話として伝えた。ウィリアムズ・ウォレス・ホルムグレンの離脱でオチャイ・アバジとの契約を撤回していたサンダーが、空いたロスター枠を低コストで埋める形となった。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "805-espn-contract-year-all-stars.html",
    cat: "NBA",
    title: "ESPNが選ぶ「契約イヤー・オールスター」12人 —— タイ・ジェロームやフレッド・ヴァンヴリートが来夏FA市場の台風の目に",
    excerpt: "ESPNのボビー・マークス記者は11月3日、2027年オフシーズンの去就に注目が集まる「契約イヤー・オールスター」12人を選出した。オールスター・オールNBA経験者やチームオプション保持者を除いた基準で、グリズリーズのタイ・ジェロームやロケッツのフレッド・ヴァンヴリートらが名を連ねている。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "804-knicks-rough-start-contract-ring-controversy.html",
    cat: "NBA",
    title: "王者ニックス、開幕3勝4敗の苦しい出だし —— 契約交渉停止と指輪騒動、オフコートの火種が影を落とす",
    excerpt: "ニューヨーク・ニックスは現地時間11月2日、フィラデルフィア・76ersに98-93で敗れて3勝4敗とした。主力3選手の契約延長交渉は10月9日から中断中で、開幕戦では指輪未配布やフィッシングメール騒動も重なっている。ESPNのヴィンセント・グッドウィル記者が、連覇を目指す王者の苦しい序盤を分析している。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "803-lebron-wine-sip-76ers.html",
    cat: "NBA",
    title: "レブロン「悪くなかったよ」—— ファンの赤ワインを一口、76ersは126-107で7勝1敗",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)は現地時間11月2日、本拠地でのシカゴ・ブルズ戦の第3クォーター中にルーズボールを追ってファンと接触し、ファンが持っていた赤ワインを思わず一口飲んだ。「肘にかかった分がどれくらいの価値か確かめたくて。悪くなかったよ」と笑って振り返った。76ersは126-107で快勝し、7勝1敗とした。ESPNが伝えた。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "802-giannis-luka-goat-praise.html",
    cat: "NBA",
    title: "ヤニス「今じゃない、オールタイムだ」—— 42得点ドンチッチへ最大級の評価、ヒートは138-117で敗戦",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボ(Giannis Antetokounmpo)は現地時間11月2日、ロサンゼルス・レイカーズに138-117で敗れた試合後、42得点を記録したルカ・ドンチッチ(Luka Doncic)について「今の話じゃない。オールタイムで考えてもトップクラスにいるはずだ」と最大級の評価を口にした。ESPNが伝えた。",
    date: "2026.11.03",
    thumb: "../assets/journal-802-hero.jpg?v=90f28cdb98"
  },
  {
    href: "801-quickley-27-points-clippers.html",
    cat: "NBA",
    title: "イマニュエル・クイックリー、クリッパーズ戦で27得点 —— ラプターズが125-118で逆転勝利",
    excerpt: "トロント・ラプターズのイマニュエル・クイックリーは現地時間11月2日、敵地でのLAクリッパーズ戦に38分出場し、フィールドゴール13本中8本・3ポイント4本中1本・フリースロー11本中10本を沈めて27得点、アシスト2・スティール1を記録した。両チーム通じてこの日の最多得点で、ラプターズは13点差を背負った第4クォーターに47得点を奪う猛攻で逆転し、125-118でクリッパーズを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "800-stephen-curry-34-points-suns.html",
    cat: "NBA",
    title: "ステフィン・カリー、サンズ戦で34得点 —— ウォリアーズが116-113で勝利",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリーは現地時間11月2日、本拠地でのフェニックス・サンズ戦に33分出場し、フィールドゴール21本中9本・3ポイント13本中5本・フリースロー12本中11本を沈めて34得点、リバウンド6・アシスト7を記録した。両チーム通じてこの日の最多得点で、ウォリアーズは116-113でサンズを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "799-luka-doncic-42-points-heat.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、ヒート戦で42得点 —— レイカーズが138-117で快勝",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間11月2日、本拠地でのマイアミ・ヒート戦に36分出場し、フィールドゴール24本中14本・3ポイント15本中6本・フリースロー10本中8本を沈めて42得点、リバウンド7・アシスト13を記録した。両チーム通じてこの日の最多得点で、レイカーズは138-117でヒートに快勝した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "798-jamal-murray-35-points-trail-blazers.html",
    cat: "NBA",
    title: "ジャマール・マレー、トレイルブレイザーズ戦で35得点 —— ナゲッツが110-118で敗れる",
    excerpt: "デンバー・ナゲッツのジャマール・マレーは現地時間11月2日、本拠地でのポートランド・トレイルブレイザーズ戦に39分出場し、フィールドゴール19本中10本・3ポイント9本中4本・フリースロー11本中11本を沈めて35得点、リバウンド5・アシスト6を記録した。両チーム通じてこの日の最多得点だったが、ナゲッツは110-118でトレイルブレイザーズに敗れた。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "797-lauri-markkanen-22-points-spurs.html",
    cat: "NBA",
    title: "ラウリ・マルカネン、スパーズ戦で22得点 —— ジャズが97-119で敗れる",
    excerpt: "ユタ・ジャズのラウリ・マルカネンは現地時間11月2日、敵地でのサンアントニオ・スパーズ戦に31分出場し、フィールドゴール16本中8本・3ポイント7本中4本・フリースロー2本中2本を沈めて22得点、リバウンド8を記録した。両チーム通じてこの日の最多得点だったが、ジャズは97-119でスパーズに敗れた。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "796-alperen-sengun-26-points-celtics.html",
    cat: "NBA",
    title: "アルペラン・シェングン、セルティックス戦で26得点 —— ロケッツが109-93で勝利",
    excerpt: "ヒューストン・ロケッツのアルペラン・シェングンは現地時間11月2日、本拠地でのボストン・セルティックス戦に38分出場し、フィールドゴール15本中12本・3ポイント2本中1本・フリースロー2本中1本を沈めて26得点、アシスト10・リバウンド7・スティール2・ブロック2を記録した。両チーム通じてこの日の最多得点で、ロケッツは109-93でセルティックスを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "795-ty-jerome-40-points-pelicans.html",
    cat: "NBA",
    title: "タイ・ジェローム、ペリカンズ戦で自己最多40得点 —— グリズリーズはOTで134-135の惜敗",
    excerpt: "メンフィス・グリズリーズのタイ・ジェロームは現地時間11月2日、ニューオーリンズ・ペリカンズ戦に37分出場し、フィールドゴール22本中14本・3ポイント6本中5本・フリースロー8本中7本を沈めて40得点、リバウンド5・アシスト5を記録した。両チーム通じてこの日の最多得点だったが、試合はオーバータイムにもつれ、グリズリーズは134-135でペリカンズに惜敗した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "794-darius-acuff-25-points-mavericks.html",
    cat: "NBA",
    title: "ダリアス・エイカフ・ジュニア、マーベリックス戦で25得点 —— キングスが115-100で勝利",
    excerpt: "サクラメント・キングスのダリアス・エイカフ・ジュニアは現地時間11月2日、敵地でのダラス・マーベリックス戦に37分出場し、フィールドゴール21本中10本・3ポイント8本中2本を沈めて25得点、アシスト6を記録した。両チーム通じてこの日の最多得点で、キングスは115-100でマーベリックスを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "793-lamelo-ball-34-points-bucks.html",
    cat: "NBA",
    title: "ラメロ・ボール、バックス戦で34得点 —— ティンバーウルブズが112-100で勝利",
    excerpt: "ミネソタ・ティンバーウルブズのラメロ・ボールは現地時間11月2日、本拠地でのミルウォーキー・バックス戦に33分出場し、フィールドゴール21本中12本・3ポイント13本中6本・フリースロー5本中4本を沈めて34得点、リバウンド6・アシスト3を記録した。両チーム通じてこの日の最多得点で、ティンバーウルブズは112-100でバックスを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "792-landry-shamet-22-points-nets.html",
    cat: "NBA",
    title: "ランドリー・シャメット、ネッツ戦で22得点 —— ニックスが103-90で勝利",
    excerpt: "ニューヨーク・ニックスのランドリー・シャメットは現地時間11月2日、ホームでのブルックリン・ネッツ戦に30分出場し、フィールドゴール8本中6本・3ポイント6本中4本を沈めて22得点を記録した。両チーム通じてこの日の最多得点で、ニックスは103-90でネッツを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "791-cunningham-33-points-hornets.html",
    cat: "NBA",
    title: "ケイド・カニングハム、ホーネッツ戦で33得点 —— ピストンズが124-91で勝利",
    excerpt: "デトロイト・ピストンズのケイド・カニングハムは現地時間11月2日、敵地でのシャーロット・ホーネッツ戦に27分出場し、フィールドゴール20本中13本・3ポイント7本中4本・フリースロー4本中3本を沈めて33得点、アシスト7・スティール5を記録した。両チーム通じてこの日の最多得点で、ピストンズは124-91でホーネッツを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "790-maxey-26-points-bulls.html",
    cat: "NBA",
    title: "タイリース・マクシー、ブルズ戦で26得点 —— 76ersが126-107で勝利",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは現地時間11月2日、本拠地でのシカゴ・ブルズ戦に36分出場し、フィールドゴール15本中10本・3ポイント5本中1本・フリースロー6本中5本を沈めて26得点、アシスト11を記録した。両チーム通じてこの日の最多得点で、76ersは126-107でブルズを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "789-alexander-walker-34-points-pacers.html",
    cat: "NBA",
    title: "ニキール・アレクサンダー＝ウォーカー、ペイサーズ戦で34得点 —— ホークスが108-104で勝利",
    excerpt: "アトランタ・ホークスのニキール・アレクサンダー＝ウォーカーは現地時間11月2日、敵地でのインディアナ・ペイサーズ戦に31分出場し、フィールドゴール25本中12本・3ポイント15本中9本・フリースロー1本中1本を沈めて34得点、アシスト4・スティール4を記録した。両チーム通じてこの日の最多得点で、ホークスは108-104でペイサーズを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "788-nike-gt-future-volt.html",
    cat: "KICKS",
    title: "Nike GT Future「Volt」が登場 —— 品番FZ5590-701、ランニングシューズ譲りの蛍光イエロー",
    excerpt: "Nike Basketballのパフォーマンスライン「Nike GT Future」に、陸上・ランニングシューズを思わせる蛍光イエロー(Volt)とブラックを組み合わせた新色(品番FZ5590-701)が登場した。Sneaker Newsが伝えた。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "787-thunder-500-million-payroll-problem.html",
    cat: "NBA",
    title: "サンダーに迫る「5億ドル問題」—— ジェイレン・ウィリアムズとウォーレスの負傷、ESPN記者2人がトレード市場での選択肢を分析",
    excerpt: "ESPNのブライアン・ウィンドホルスト記者とティム・マクマホン記者は、ジェイレン・ウィリアムズ(左腓骨骨折・足首脱臼)とケイソン・ウォーレス(肩関節唇断裂)が離脱したオクラホマシティ・サンダーの編成上の選択肢を分析した。チームの総年俸(ラグジュアリータックス込み)が2027-28シーズンに5億ドルを超える見通しの中、サム・プレスティGMがトレード市場で動くかどうかに各チーム幹部の見方が割れている。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "786-anthony-davis-27-points-magic.html",
    cat: "NBA",
    title: "アンソニー・デイビス、マジック戦で27得点9リバウンド —— ウィザーズが103-94で勝利",
    excerpt: "ワシントン・ウィザーズのアンソニー・デイビスは現地時間11月2日、敵地でのオーランド・マジック戦に34分出場し、フィールドゴール17本中12本を沈めて27得点、リバウンド9・スティール4を記録した。両チーム通じてこの日の最多得点で、ウィザーズは103-94でマジックを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "785-adidas-harden-vol-11.html",
    cat: "KICKS",
    title: "adidas Harden Vol. 11 が12月発売へ —— ジェームズ・ハーデンの11代目シグネチャー",
    excerpt: "adidasは、ジェームズ・ハーデン(クリーブランド・キャバリアーズ)とのシグネチャーシューズ11作目となる「adidas Harden Vol. 11」を2026年12月に発売する予定だ。詳細な仕様・価格・品番は執筆時点で未発表。Sneaker Newsが伝えた。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "784-nike-ja-4-blur.html",
    cat: "KICKS",
    title: "Nike Ja 4「Blur」が11月24日発売 —— ジャ・モラント4代目シグネチャーにグラデーション新色",
    excerpt: "ナイキは、ジャ・モラント(メンフィス・グリズリーズ)の4代目シグネチャーモデル「Nike Ja 4」に新色「Blur」を投入し、11月24日に発売する。トゥの水色が紫と暗いグレーへ滲むグラデーション配色で、品番はIM4135-501。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "783-sga-43-points-cavaliers.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、キャバリアーズ戦で43得点 —— サンダーが117-112で勝利",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間11月2日、敵地でのクリーブランド・キャバリアーズ戦に39分出場し、フィールドゴール35本中14本・3ポイント8本中4本・フリースロー12本中11本を沈めて43得点、アシスト8・スティール2を記録した。両チーム通じてこの日の最多得点で、サンダーは117-112でキャバリアーズを下した。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "782-hornets-coby-white-returns-knueppel-close.html",
    cat: "NBA",
    title: "ホーネッツのコービー・ホワイト、今季初出場へ —— カニップルの復帰も「目前」とリーHC",
    excerpt: "シャーロット・ホーネッツは現地時間11月2日、ふくらはぎ負傷から復帰するコービー・ホワイトが今季初出場を果たすと発表。チャールズ・リーHCはハムストリングを負傷中のコン・カニップルの復帰も「目前」と述べた。カニップルは昨季3P数リーグ1位、新人王投票2位の実力者。",
    date: "2026.11.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "781-air-jordan-3-knicks.html",
    cat: "KICKS",
    title: "Air Jordan 3「Knicks」が12月発売へ —— 品番JU1525-148、優勝パレードを経ての正式発表",
    excerpt: "ジョーダン ブランドの「Air Jordan 3」に、ニューヨーク・ニックスのチームカラーをまとった「Knicks」(品番JU1525-148)が登場する。2026年6月の予約受付開始・優勝記念イベントでの先行展開を経て、公式画像が公開され12月発売が見込まれている。Sneaker News/Sneaker Bar Detroitが伝えた。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "780-thunder-retire-westbrook-no0.html",
    cat: "NBA",
    title: "サンダー、ラッセル・ウェストブルックの背番号0を永久引退へ —— 2027年2月7日に式典、球団2人目の永久欠番に",
    excerpt: "オクラホマシティ・サンダーは現地時間11月2日、ラッセル・ウェストブルックの背番号0を2027年2月7日に永久引退すると発表した。ウェストブルックは2008年ドラフト1巡目指名で、18年のキャリアのうち最初の11シーズンを同球団で過ごし、2016-17シーズンにはオスカー・ロバートソン以来となるシーズン平均トリプルダブルを記録してMVPに輝いた。球団として2人目の永久欠番で、ニック・コリソンの4番に続く。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "779-jazz-bailey-collier-options.html",
    cat: "NBA",
    title: "ジャズ、エース・ベイリーの3年目ルーキー契約オプションを行使 —— アイザイア・コリアーは行使せず来夏UFAへ",
    excerpt: "ユタ・ジャズが、2025年ドラフト指名のフォワード、エース・ベイリーについて2027-28シーズン分(998万ドル)のルーキー・スケール契約オプションを行使したことが分かった。一方、ガードのアイザイア・コリアーについては同シーズン分(499万ドル)のオプションを行使せず、コリアーは来夏、制限のない完全フリーエージェントになる。HoopsHypeのマイケル・スコット記者が報じた。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "778-nba-title-mvp-race-wide-open.html",
    cat: "NBA",
    title: "優勝争い、サンダー・スパーズ・ニックスの「3強」後退 —— MVP争いもウェンバンヤマが最有力に、ESPNが開幕2週間を分析",
    excerpt: "ESPNは現地時間11月2日、2026-27シーズン開幕からの2週間でNBAの優勝争い・MVP争いが大きく揺れ動いたとする分析記事を公開した。開幕前の本命サンダー・スパーズ・ニックスの「3強」はいずれも主力の負傷や苦戦で優勝確率を落とし、BPI(ESPNの勝敗予測指標)による3チーム合計の優勝確率は開幕前の約58%から38%まで低下。MVP争いも直近2年連続受賞のシェイ・ギルジャス=アレクサンダーとニコラ・ヨキッチが出場停止水準まで数字を落とし、ビクター・ウェンバンヤマが最有力候補に浮上したという。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "777-lendeborg-37-points-clippers.html",
    cat: "NBA",
    title: "ヤクセル・レンデボーグ、クリッパーズ戦で37得点 —— ウォリアーズが124-112で勝利",
    excerpt: "ゴールデンステート・ウォリアーズのヤクセル・レンデボーグは現地時間11月1日、本拠地でのロサンゼルス・クリッパーズ戦に34分出場し、フィールドゴール19本中13本・3ポイント11本中6本・フリースロー6本中5本を沈めて37得点、アシスト6を記録した。両チーム通じてこの日の最多得点で、ウォリアーズは124-112でクリッパーズを下した。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "776-doncic-45-points-raptors.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、ラプターズ戦で45得点15リバウンド —— レイカーズが131-125で勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間11月1日、本拠地でのトロント・ラプターズ戦に35分出場し、フィールドゴール23本中12本・3ポイント12本中8本・フリースロー13本中13本を沈めて45得点、リバウンド15・アシスト6・スティール5を記録した。両チーム通じてこの日の最多得点で、レイカーズは131-125でラプターズを下した。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "775-hachimura-24-points-warriors.html",
    cat: "NBA",
    title: "八村塁、ウォリアーズ戦で24得点 —— クリッパーズは112-124で敗戦",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間11月1日、敵地ゴールデンステート・ウォリアーズ戦に30分出場し、フィールドゴール16本中10本・3ポイント7本中4本を沈めて24得点、リバウンド7を記録した。チーム最多得点となったが、クリッパーズは112-124でウォリアーズに敗れた。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "774-thunder-topic-declines-option.html",
    cat: "NBA",
    title: "サンダー、ニコラ・トピッチの来季オプションを行使せず —— 2024年ドラフト12位、精巣がんの闘病でわずか10試合",
    excerpt: "オクラホマシティ・サンダーは、2024年ドラフト全体12位指名のニコラ・トピッチについて740万ドルの来季オプションを行使せず、来夏の完全フリーエージェントになることが決まった。トピッチはドラフト前の膝の負傷でルーキーイヤーを全休し、昨季は精巣がんの診断でさらに長期離脱。復帰後も今夏の背中の手術から復帰の見通しが立っておらず、サンダーでの3年間でわずか10試合の出場にとどまっている。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "773-thunder-mccain-sorber-options.html",
    cat: "NBA",
    title: "サンダー、ジャレッド・マケインとトーマス・ソーバーの契約オプションを行使 —— ともに2027-28シーズンまで残留確定",
    excerpt: "オクラホマシティ・サンダーは、ガードのジャレッド・マケインとフォワード/センターのトーマス・ソーバーについて、ルーキー・スケール契約に基づく契約オプションを行使したと発表した。マケインは4年目、ソーバーは3年目のオプションで、ともに2027-28シーズンまでサンダーでプレーすることが確定した。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "772-yokohama-excellence-niigata-split.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、新潟戦は1勝1敗 —— 西山達哉引退試合は77-83で涙、第2戦は90-75で立て直す",
    excerpt: "横浜エクセレンスは10月31日・11月1日、本拠地でB.LEAGUE ONE 2026-27第7節の新潟アルビレックスBBと連戦した。西山達哉の引退セレモニーを控えた第1戦は77-83で落としたが、第2戦はトレイ・ボイドⅢらの活躍で90-75と立て直した。",
    date: "2026.11.02",
    thumb: "../assets/journal-772-hero.jpg?v=483a82f339"
  },
  {
    href: "771-gunma-crane-thunders-osaka-evessa-102-60.html",
    cat: "JAPAN",
    title: "群馬クレインサンダーズ、大阪エヴェッサに102-60で2連勝 —— 11人全員得点、谷口大智の3Pで「ドーナツ」達成",
    excerpt: "群馬クレインサンダーズは現地時間11月1日、本拠地オープンハウスアリーナ太田でのB.LEAGUE PREMIER 2026-27シーズンの一戦で大阪エヴェッサと対戦し、102-60で快勝した。前日の93-60に続く連勝で、ロスター11人全員が得点。谷口大智の3Pでジャストの100点に到達し、チームで恒例の「ドーナツ」ポーズが出た。",
    date: "2026.11.02",
    thumb: "../assets/journal-771-hero.jpg?v=ac14ddcd22"
  },
  {
    href: "769-nembhard-23-points-nets.html",
    cat: "NBA",
    title: "アンドリュー・ネムハード、ネッツ戦で23得点 —— ペイサーズは90-98で敗戦",
    excerpt: "インディアナ・ペイサーズのアンドリュー・ネムハードは現地時間11月1日、ブルックリン・ネッツ戦に35分出場し、23得点・アシスト4・リバウンド3を記録した。マイケル・ポーター・ジュニアと並ぶこの日の最多得点となったが、ペイサーズは90-98でネッツに敗れた。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "768-porter-jr-23-points-pacers.html",
    cat: "NBA",
    title: "マイケル・ポーター・ジュニア、ペイサーズ戦で23得点9リバウンド —— ネッツが98-90で勝利",
    excerpt: "ブルックリン・ネッツのマイケル・ポーター・ジュニアは現地時間11月1日、インディアナ・ペイサーズ戦に36分出場し、23得点・リバウンド9・アシスト3を記録した。アンドリュー・ネムハードと並ぶこの日の最多得点となり、ネッツは98-90でペイサーズに勝利した。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "767-tatum-32-points-magic.html",
    cat: "NBA",
    title: "ジェイソン・テイタム、マジック戦で32得点 —— セルティックスが108-97で勝利",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間11月1日、オーランド・マジック戦に34分出場し、32得点・アシスト7・リバウンド4を記録した。両チーム通じてこの日の最多得点者となり、セルティックスは108-97でマジックに勝利した。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "766-hornets-knueppel-mcneeley-option.html",
    cat: "NBA",
    title: "ホーネッツ、コン・カニップルとリアム・マクニーリーの3年目チームオプションを行使 —— カニップルは新人史上初の3P王、2027-28シーズンまで残留確定",
    excerpt: "シャーロット・ホーネッツは、フォワードのコン・カニップルとリアム・マクニーリーについてルーキー・スケール契約の3年目チームオプションを行使したと発表した。カニップルはルーキーシーズンに新人史上初めてリーグ3Pシュート成功数1位(273本)を記録している。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "765-wizards-team-options.html",
    cat: "NBA",
    title: "ウィザーズ、主力5選手のチームオプションを一括行使 —— カリントン・ジョージ・サーら2027-28シーズンまで確保",
    excerpt: "ワシントン・ウィザーズは、カールトン・カリントン、キーショーン・ジョージ、アレックス・サーの4年目チームオプションと、トレイ・ジョンソン、ウィル・ライリーの3年目チームオプションを一括で行使したと発表した。5選手は2027-28シーズンまでウィザーズでプレーすることが確定した。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "764-hawks-asa-newell-option.html",
    cat: "NBA",
    title: "ホークス、エイサ・ニューエルの3年目契約オプションを行使 —— Gリーグで平均22.5得点、2027-28シーズンまで残留確定",
    excerpt: "アトランタ・ホークスは、フォワードのエイサ・ニューエルについてルーキー・スケール契約の3年目契約オプションを行使したと発表した。2025年ドラフト23位指名で、昨季はGリーグのカレッジ・パーク・スカイホークスで平均22.5得点7.8リバウンドを記録している。",
    date: "2026.11.02",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "763-nba-overreactions-giannis-heat-thunder-jerome.html",
    cat: "NBA",
    title: "ヒートは2008年以来の最低ペース？ サンダーの優勝戦線は終わった？ —— ESPN記者2人が開幕序盤の「過剰反応」を検証",
    excerpt: "ESPNのザック・クラム記者とベン・ゴリバー記者は10月29日(現地時間)、2026-27シーズン開幕1週目に飛び交った「過剰反応」10項目について検証する企画を公開した。ヤニス・アデトクンボを迎えたヒートの苦しい立ち上がり、主力2人を失ったサンダーの優勝戦線、タイ・ジェロームのオールスター入りの可能性を取り上げている。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "762-jabari-smith-30-points-thunder.html",
    cat: "NBA",
    title: "ジャバリ・スミス・ジュニア、サンダー戦で30得点 —— ロケッツが119-98で快勝",
    excerpt: "ヒューストン・ロケッツのジャバリ・スミス・ジュニアは現地時間10月31日、オクラホマシティ・サンダー戦に33分出場し、30得点・リバウンド9・アシスト5を記録した。両チーム通じてこの日の最多得点者となり、ロケッツは119-98でサンダーに快勝した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "761-gunma-crane-thunders-osaka-evessa-93-60.html",
    cat: "JAPAN",
    title: "群馬クレインサンダーズ、大阪エヴェッサに93-60で快勝 —— 淺野ケニーがキャリアハイ17得点",
    excerpt: "群馬クレインサンダーズは10月31日、本拠地オープンハウスアリーナ太田でのB.LEAGUE PREMIER 2026-27シーズンの一戦で大阪エヴェッサと対戦し、93-60で快勝した。淺野ケニーがキャリアハイとなる17得点を記録した。",
    date: "2026.11.01",
    thumb: "../assets/journal-761-hero.jpg?v=8e92e27aec"
  },
  {
    href: "760-darius-acuff-38-points-grizzlies.html",
    cat: "NBA",
    title: "ダリアス・エイカフ・ジュニア、グリズリーズ戦で38得点 —— キングスは105-136で大敗",
    excerpt: "サクラメント・キングスのダリアス・エイカフ・ジュニアは現地時間10月31日、メンフィス・グリズリーズ戦に37分出場し、38得点・リバウンド5・アシスト5を記録した。両チーム通じてこの日の最多得点者となったが、キングスは105-136でグリズリーズに大敗した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "759-wembanyama-43-points-timberwolves.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、ティンバーウルブズ戦で43得点6ブロック —— スパーズが121-111で勝利",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間10月31日、ミネソタ・ティンバーウルブズ戦に34分出場し、43得点・リバウンド7・ブロック6を記録した。両チーム通じてこの日の最多得点者となり、スパーズは121-111でティンバーウルブズに勝利した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "758-evan-mobley-27-points-bucks.html",
    cat: "NBA",
    title: "エヴァン・モブリー、バックス戦で27得点 —— キャバリアーズが136-111で快勝",
    excerpt: "クリーブランド・キャバリアーズのエヴァン・モブリーは現地時間10月31日、敵地ミルウォーキー・バックス戦に25分出場し、27得点・リバウンド5・アシスト3を記録した。両チーム通じてこの日の最多得点者となり、キャバリアーズは136-111でバックスに快勝した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "757-saddiq-bey-25-points-hawks.html",
    cat: "NBA",
    title: "サディーク・ベイ、ホークス戦で25得点 —— ペリカンズが121-99で大勝",
    excerpt: "ニューオーリンズ・ペリカンズのサディーク・ベイは現地時間10月31日、アトランタ・ホークス戦に26分出場し、25得点・リバウンド6・スティール4を記録した。両チーム通じてこの日の最多得点者となり、ペリカンズは121-99でホークスに大勝した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "756-maxey-38-points-hornets.html",
    cat: "NBA",
    title: "タイリース・マクシー、ホーネッツ戦で38得点 —— 76ersが109-104で逆転勝利",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは現地時間10月31日、シャーロット・ホーネッツ戦に38分出場し、38得点・リバウンド4・アシスト4を記録した。両チーム通じてこの日の最多得点者となり、76ersは第1クォーターの10点ビハインドから逆転して109-104でホーネッツを下した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "755-deni-avdija-24-points-trail-blazers.html",
    cat: "NBA",
    title: "デニ・アヴディア、ジャズ戦で24得点 —— トレイルブレイザーズが112-90で快勝",
    excerpt: "ポートランド・トレイルブレイザーズのデニ・アヴディアは現地時間10月31日、ユタ・ジャズ戦に30分出場し、24得点・リバウンド5・アシスト2を記録した。両チーム通じてこの日の最多得点者となり、トレイルブレイザーズは112-90でジャズに快勝した。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "754-thunder-agbaji-signing-called-off.html",
    cat: "NBA",
    title: "サンダー、オチャイ・アバジとの契約を撤回 —— ホルムグレン離脱でロスター枠を再検討",
    excerpt: "ESPNのシャムズ・シャラニア記者によると、オクラホマシティ・サンダーはフリーエージェントのオチャイ・アバジとの契約を撤回した。チェット・ホルムグレンが2カ月超の離脱となったことを受け、空いたロスター枠の使い方を一度見直す方針という。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "753-lebron-76ers-best-game-knicks.html",
    cat: "NBA",
    title: "レブロン「24年も続くなんて、分からなかった」—— 76ersで自己初の20得点ゲーム、ナース監督「間違いなくベストゲーム」",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズは現地時間10月30日のニックス戦で20得点・9リバウンド・8アシストを記録し、76ers加入後初の20点ゲームを飾った。ニック・ナースヘッドコーチは「間違いなく彼のベストゲームだった」と評価。ジェームズは40歳以降に20得点以上を記録した試合が68に達し、NBA史上の40歳以上の選手全員を合計した数(67)を上回っている。",
    date: "2026.11.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "752-luka-doncic-37-points-lakers.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、ウォリアーズ戦で37得点 —— レイカーズが95-112で敗戦",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間10月30日、ゴールデンステート・ウォリアーズ戦に37分出場し、37得点・リバウンド7・アシスト5を記録した。両チーム通じてこの日の最多得点者となったが、レイカーズは95-112でウォリアーズに敗れた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "751-jamal-murray-39-points-nuggets.html",
    cat: "NBA",
    title: "ジャマール・マレー、サンズ戦で39得点 —— ナゲッツが127-120で勝利",
    excerpt: "デンバー・ナゲッツのジャマール・マレーは現地時間10月30日、フェニックス・サンズ戦に37分出場し、39得点・リバウンド8・アシスト5を記録した。両チーム通じてこの日の最多得点者となり、ナゲッツは127-120でサンズに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "750-kyrie-irving-35-points-mavericks.html",
    cat: "NBA",
    title: "カイリー・アービング、ロケッツ戦で35得点9アシスト —— マーベリックスが116-111で勝利",
    excerpt: "ダラス・マーベリックスのカイリー・アービングは現地時間10月30日、ヒューストン・ロケッツ戦に35分出場し、35得点・アシスト9を記録した。両チーム通じてこの日の試合最多得点者となり、マーベリックスは116-111でロケッツに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "749-giannis-31-points-17-rebounds-10-assists-heat.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ、ペイサーズ戦で31得点17リバウンド10アシスト —— ヒートが145-125で快勝",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは現地時間10月30日、インディアナ・ペイサーズ戦に31分出場し、31得点・リバウンド17・アシスト10のトリプルダブルに迫る成績を記録した。ヒートは145-125でペイサーズに快勝した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "748-nike-ja-4-unseen.html",
    cat: "KICKS",
    title: "Nike Ja 4「Unseen」が11月13日発売へ —— 品番IM4135-700、ジャ・モラントの新色",
    excerpt: "ナイキは、ジャ・モラントの4代目シグネチャーシューズ「Ja 4」の新色「Unseen」（品番IM4135-700）を発表した。「GT Cut 'Black Volt'」「GT Future 'Volt'」と同じ黒とヴォルトの配色を共有し、11月13日に発売予定。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "747-nike-giannis-freak-8-origin-story.html",
    cat: "KICKS",
    title: "Nike Giannis Freak 8「Origin Story」に軍服役の記憶 —— 品番IV4378-200、ヤニス・アデトクンボの新色",
    excerpt: "ナイキは、ヤニス・アデトクンボの8代目シグネチャーシューズ「Giannis Freak 8」の新色「Origin Story」（品番IV4378-200）を発表した。ギリシャでは兵役がNBA選手であっても義務であり、アデトクンボ自身の軍服役の記憶をデザインに重ねたモデルだという。Sneaker Newsが伝えた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "746-lamelo-ball-24-points-timberwolves.html",
    cat: "NBA",
    title: "ラメロ・ボール、クリッパーズ戦で24得点7アシスト —— ティンバーウルブズが127-101で勝利",
    excerpt: "ミネソタ・ティンバーウルブズのラメロ・ボールは現地時間10月30日、LAクリッパーズ戦に29分出場し、24得点・アシスト7を記録した。両チーム通じてこの日の最多得点者の一人となり、ティンバーウルブズは127-101でクリッパーズに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "745-darius-garland-24-points-clippers.html",
    cat: "NBA",
    title: "ダリアス・ガーランド、ティンバーウルブズ戦で24得点5アシスト —— クリッパーズが101-127で敗戦",
    excerpt: "LAクリッパーズのダリアス・ガーランドは現地時間10月30日、ミネソタ・ティンバーウルブズ戦に31分出場し、24得点・アシスト5を記録した。両チーム通じてこの日の最多得点者となったが、クリッパーズは101-127でティンバーウルブズに敗れた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "744-rui-hachimura-12-points-clippers.html",
    cat: "NBA",
    title: "八村塁、ティンバーウルブズ戦で12得点5リバウンド —— クリッパーズが101-127で敗戦",
    excerpt: "LAクリッパーズの八村塁は現地時間10月30日、ミネソタ・ティンバーウルブズ戦に26分出場し、12得点・リバウンド5・スティール2を記録した。クリッパーズは101-127でティンバーウルブズに敗れた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "743-payton-pritchard-30-points-celtics.html",
    cat: "NBA",
    title: "ペイトン・プリチャード、ブルズ戦で30得点 —— セルティックスが125-111で勝利",
    excerpt: "ボストン・セルティックスのペイトン・プリチャードは現地時間10月30日、シカゴ・ブルズ戦に35分出場し、30得点・リバウンド3・アシスト3を記録した。両チーム通じてこの日の最多得点者となり、セルティックスは125-111でブルズに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "742-scottie-barnes-41-points-raptors.html",
    cat: "NBA",
    title: "スコッティ・バーンズ、マジック戦で41得点 —— ラプターズは114-121で敗戦",
    excerpt: "トロント・ラプターズのスコッティ・バーンズは現地時間10月30日、オーランド・マジック戦に39分出場し、41得点・リバウンド5・アシスト5を記録した。両チーム通じてこの日の最多得点者となったが、ラプターズは114-121でマジックに敗れた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "741-tyrese-maxey-27-points-76ers.html",
    cat: "NBA",
    title: "タイレス・マクシー、ニックス戦で27得点4アシスト —— 76ersが98-93で勝利",
    excerpt: "フィラデルフィア・76ersのタイレス・マクシーは現地時間10月30日、ニューヨーク・ニックス戦に38分出場し、27得点・アシスト4を記録した。両チーム通じてこの日の最多得点者となり、76ersは98-93でニックスに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "740-cade-cunningham-20-points-pistons.html",
    cat: "NBA",
    title: "ケード・カニンガム、ネッツ戦で20得点4アシスト —— ピストンズが110-94で勝利",
    excerpt: "デトロイト・ピストンズのケード・カニンガムは現地時間10月30日、ブルックリン・ネッツ戦に28分出場し、20得点・アシスト4を記録した。両チーム通じてこの日の最多得点者となり、ピストンズは110-94でネッツに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "739-anthony-davis-25-points-hornets.html",
    cat: "NBA",
    title: "アンソニー・デイビス、ホーネッツ戦で25得点13リバウンド —— ウィザーズが95-79で勝利",
    excerpt: "ワシントン・ウィザーズのアンソニー・デイビスは現地時間10月30日、シャーロット・ホーネッツ戦に34分出場し、25得点・リバウンド13を記録した。両チーム通じてこの日の最多得点者となり、ウィザーズは95-79でホーネッツに勝利した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "738-durant-oklahoma-standard-interview.html",
    cat: "NBA",
    title: "デュラント「サンダーの卒業生であることに本当に感謝している」—— OKC時代と2025年優勝を語る",
    excerpt: "ケビン・デュラントがESPNのドキュメンタリー企画のインタビューで、2008〜2016年のサンダー時代と、自分たちが果たせなかった優勝を2025年に成し遂げたチームへの思いを語った。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "737-thunder-holmgren-knee-injury.html",
    cat: "NBA",
    title: "サンダー、チェット・ホルムグレンが右膝蓋腱の一部断裂で治療 —— 8〜10週間の離脱へ",
    excerpt: "オクラホマシティ・サンダーのチェット・ホルムグレンが右膝蓋腱の一部断裂で治療を受け、復帰まで8〜10週間を要するとチームが発表した。ESPNが伝えた。ウィリアムズ、ウォレスに続く主力の離脱で、サンダーは開幕早々に大きな戦力ダウンを強いられている。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "736-jaylen-brown-patellar-tendinopathy-76ers.html",
    cat: "NBA",
    title: "76ersのジェイレン・ブラウン、左膝蓋腱炎と診断 —— ニックス戦のNBAカップ出場を欠場",
    excerpt: "フィラデルフィア・76ersのジェイレン・ブラウンが左膝蓋腱炎と診断された。マーク・スタイン記者(The Stein Line)が伝えた。76ersはニューヨーク・ニックスとのNBAカップ戦でブラウンを欠場させると発表、ニック・ナース監督が会見で明らかにした。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "735-lakers-sale-finalize-terms.html",
    cat: "NBA",
    title: "ウォルター氏とカシュナー氏、レイカーズ売却の全条件固まる —— 125億ドル評価、調印は最終段階へ",
    excerpt: "ESPNが米国時間10月29日、関係者の話として報じた。ロサンゼルス・レイカーズの支配株主マーク・ウォルター氏とジョシュ・カシュナー氏は、125億ドル評価での球団売却について残っていた全ての条件で合意。ウォルター氏の自宅で直接交渉を固め、正式契約の調印も近い見通しで、調印後はNBAの審査に入る。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "734-knicks-dadiet-option.html",
    cat: "NBA",
    title: "ニックス、パコメ・ダディエの4年目オプションを行使せず —— 537万ドル、来夏に制限なしFAへ",
    excerpt: "ニューヨーク・ニックスは、フォワードのパコメ・ダディエの2027-28シーズン分となる4年目チームオプション(537万ドル)を行使しない方針。ESPNのシャムズ・チャラニア記者が報じた。来夏、ダディエは制限なしフリーエージェントになる見通し。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "733-rockets-reed-sheppard-option.html",
    cat: "NBA",
    title: "ロケッツ、リード・シェパードの4年目オプションを行使 —— ドラフト3位指名のガード、2年目に大幅成長",
    excerpt: "ヒューストン・ロケッツは、ガードのリード・シェパードの2027-28シーズン分のチームオプションを行使したと発表した。2024年ドラフト3位指名で、昨季は平均13.5得点3.4アシストと大きく成長した。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "729-thunder-sign-agbaji.html",
    cat: "NBA",
    title: "サンダー、オチャイ・アバジと契約へ —— ウィリアムズとウォレスの大怪我でロスター枠を補強",
    excerpt: "ESPNのシャムズ・シャラニア記者によると、オクラホマシティ・サンダーはジェイレン・ウィリアムズとケイソン・ウォレスの大怪我で空いたロスター枠を埋めるため、オチャイ・アバジ(26)と契約する。アバジは2022年ドラフト14位指名で、今月ニックスから戦力外となっていた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "730-nike-air-force-1-harajuku-atmoscon.html",
    cat: "KICKS",
    title: "Nike Air Force 1 '01「Harajuku」がatmosconに登場 —— atmos創作ディレクターによる原宿の地図をレーザーで刻んだ限定カスタム",
    excerpt: "東京の老舗スニーカーショップatmosは、自社主催のスニーカーイベント「atmoscon」向けに、Nike Air Force 1 '01をベースにした限定カスタム「Harajuku」を発表した。真っ白なアッパーに原宿エリアの地図をレーザーで刻み込んだデザインで、atmosconで50足限定を販売した10年前の企画の後継にあたる。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "731-nike-sabrina-4-cork.html",
    cat: "KICKS",
    title: "Nike Sabrina 4「Cork」が11月発売へ —— 品番II0402-004、コルク素材を使ったサブリナ・イオネスクの新色",
    excerpt: "ナイキは、サブリナ・イオネスクの4代目シグネチャーシューズ「Sabrina 4」の新色「Cork」（品番II0402-004）を発表した。コルク素材を使った配色が特徴で、11月発売予定。Sneaker Newsが伝えた。",
    date: "2026.10.31",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "732-marvelous-glp-second-cohort.html",
    cat: "JAPAN",
    title: "女子バスケの米国挑戦支援「MARVELOUS GLP」第2期生募集開始 —— 馬瓜エブリン選手が全面協力",
    excerpt: "スポヲタ株式会社は、日本の女子バスケットボール選手の米国大学進学を支援する育成プロジェクト「MARVELOUS GLP」の第2期生募集を開始したと発表した。東京五輪銀メダリストの馬瓜エブリン選手がアンバサダーを務め、高校2・3年生を対象に約5名を選抜する。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "728-thunder-500-million-problem.html",
    cat: "NBA",
    title: "サンダー、主力2人の大怪我で浮上した「5億ドル問題」—— GMプレスティの次の一手に球界が注目",
    excerpt: "ESPNのブライアン・ウィンダーホースト記者とティム・マクマホン記者によると、オクラホマシティ・サンダーはジェイレン・ウィリアムズ(左腓骨骨折・足首脱臼)とケイソン・ウォレス(肩関節唇断裂)の大怪我を受け、今季の戦い方とリーグ最高クラスに膨らむ将来の給与総額をどう両立させるか、球界内で活発な観測が飛び交っている。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "727-nike-dunk-low-union-natural-selection.html",
    cat: "KICKS",
    title: "Nike Dunk Low「Natural Selection」が登場 —— UNIONとの新コラボ、ヒールを折り畳める2WAY仕様で3色展開",
    excerpt: "『UNION』と〈Nike〉が再びタッグを組み、Dunk Lowの新作コレクション「Natural Selection」を発表した。「Hide」「Fatigue」「Eclipse」の3色展開で、ヒールを折り畳んでスリッポン風にも履ける2WAY仕様が特徴。価格130ドルで10月30日発売。Hypebeast・HYPEBEAST JPが伝えた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "726-morant-hamstring-injury-grizzlies.html",
    cat: "NBA",
    title: "ジャ・モラント、古巣グリズリーズ戦で左ハムストリング負傷退場 —— トレイルブレイザーズは移籍後初黒星",
    excerpt: "ポートランド・トレイルブレイザーズのジャ・モラントは古巣メンフィス・グリズリーズ戦で左ハムストリングを負傷し途中退場。チームは現地時間10月30日、グレード2の肉離れと診断され最低4週間の離脱になると発表した。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "725-avdija-24-points-grizzlies.html",
    cat: "NBA",
    title: "デニ・アヴディア、グリズリーズ戦で24得点9リバウンド7アシスト —— トレイルブレイザーズは103-124で敗戦",
    excerpt: "ポートランド・トレイルブレイザーズのデニ・アヴディアは現地時間10月29日、メンフィス・グリズリーズ戦に32分出場し、24得点・リバウンド9・アシスト7を記録した。両チーム通じてこの日の最多得点者となったが、トレイルブレイザーズは103-124でグリズリーズに敗れた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "724-fukui-blowinds-atom-cup.html",
    cat: "JAPAN",
    title: "アトム、福井ブローウィンズ冠試合「ATOM CUP」開催 —— 2日間で7,125人来場、チョンディー・ブラウンJr.と川島聖那がMIPに",
    excerpt: "福井ブローウィンズのスポンサー企業・株式会社アトムは、冠試合「ATOM CUP」を2026年10月24日・25日にセーレン・ドリームアリーナ（福井県営体育館）で実施したと発表した。対戦相手はさいたまブロンコスで、2日間合計7,125人が来場。両日のMIPにはチョンディー・ブラウンJr.選手と川島聖那選手が選ばれた。",
    date: "2026.10.30",
    thumb: "../assets/journal-724-hero.jpg?v=12b6e6ea47"
  },
  {
    href: "723-okongwu-29-points-cavaliers.html",
    cat: "NBA",
    title: "オニエカ・オコング、キャバリアーズ戦で29得点12リバウンド —— ホークスが114-111で勝利",
    excerpt: "アトランタ・ホークスのオニエカ・オコングは現地時間10月29日、クリーブランド・キャバリアーズ戦に33分出場し、29得点・リバウンド12を記録した。両チーム通じてこの日の最多得点者となり、ホークスは114-111でキャバリアーズに勝利した。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "722-acuff-34-points-pelicans.html",
    cat: "NBA",
    title: "ダリアス・エイカフ・ジュニア、ペリカンズ戦で34得点14アシスト —— キングスは120-132で敗戦",
    excerpt: "サクラメント・キングスのダリアス・エイカフ・ジュニアは現地時間10月29日、ニューオーリンズ・ペリカンズ戦に41分出場し、34得点・14アシスト・リバウンド6を記録した。両チーム通じてこの日の最多得点者となったが、キングスは120-132でペリカンズに敗れた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "721-nike-sabrina-4-grey-fog.html",
    cat: "KICKS",
    title: "Nike Sabrina 4「Grey Fog」が登場 —— 品番II0402-102、サブリナ・イオネスクの4代目シグネチャーに新色",
    excerpt: "ナイキは、サブリナ・イオネスクの4代目シグネチャーシューズ「Sabrina 4」の新色「Grey Fog」（品番II0402-102）を発表した。控えめなグレー基調の配色で、Sneaker Newsが伝えた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "720-foamposite-pro-tcu-horned-frogs.html",
    cat: "KICKS",
    title: "Nike Air Foamposite Pro「TCU Horned Frogs」の公式画像が登場 —— 品番IX2092-500、大学カラー展開の最新色",
    excerpt: "Nike Air Foamposite Proのカレッジチームカラー最新作「TCU Horned Frogs」（品番IX2092-500）が公式画像で登場。TCUのスクールカラーであるパープルを基調にしたデザインで、Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "719-hornets-naz-reid-benched-standards.html",
    cat: "NBA",
    title: "ホーネッツ、ネイズ・リードを前半で下げ後半出場なし —— リーHC「チームの基準に届かなかった」",
    excerpt: "シャーロット・ホーネッツは現地時間28日のピストンズ戦、今季加入のネイズ・リードを前半で下げ後半は出場させなかった。チャールズ・リーHCは試合後「前半、チームの基準に届かなかった」と説明。ホーネッツは89-97で敗れた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "718-clippers-blake-wesley-hardship.html",
    cat: "NBA",
    title: "クリッパーズ、ブレイク・ウェスリーと10日間契約 —— ハードシップ例外で元スパーズ・ブレイザーズのガードを補強",
    excerpt: "ロサンゼルス・クリッパーズは、元スパーズ・ブレイザーズのガード、ブレイク・ウェスリーと負傷者救済（ハードシップ）例外を使った10日間契約を結ぶ。ESPNのシャムズ・シャラニア記者が現地時間29日、関係者の話として伝えた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "717-blazers-clingan-yang-hansen-option.html",
    cat: "NBA",
    title: "ブレイザーズ、クリンガンとヤン・ハンセンの契約オプションを行使 —— 新人ビッグマン2人を2027-28シーズンまで確保",
    excerpt: "ポートランド・トレイルブレイザーズは、センターのドノバン・クリンガンとヤン・ハンセンの2027-28シーズン分のチームオプションを行使したと発表した。ジョー・クローニンGMが発表。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "716-champagnie-foot-surgery-wizards.html",
    cat: "NBA",
    title: "ウィザーズのジャスティン・シャンペニー、右足骨折の手術を受け無期限離脱",
    excerpt: "ワシントン・ウィザーズは、ジャスティン・シャンペニーが右足の骨折を修復する外科手術を受けたと発表した。チームは無期限の離脱になるとしている。ESPNのマーク・スタイン記者が現地時間28日、球団の発表として伝えた。",
    date: "2026.10.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "715-adidas-ae3-with-love.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards 3「With Love」が11月6日発売 —— 品番KH8540、地元ジョージア州にちなんだピーチカラー",
    excerpt: "アディダスは、アンソニー・エドワーズの3代目シグネチャーシューズ「Anthony Edwards 3」の新色「With Love」(品番KH8540)を2026年11月6日に発売する。地元ジョージア州にちなんだピーチカラーで、Sneaker Bar Detroitが伝えた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "713-off-the-glass.html",
    cat: "CULTURE",
    title: "代々木公園の路地裏に、バスケ好きの大人のためのバーラウンジ「OFF THE GLASS」 —— NBA開幕に合わせビューイングイベント、11月6日はクリスがゲスト出演",
    excerpt: "東京・渋谷区富ヶ谷、代々木公園エリアの路地裏に、バスケットボールを愛する大人たちのためのバーラウンジ「OFF THE GLASS（オフ・ザ・グラス）」がオープンした。NBA新シーズンの開幕に合わせ、少人数限定のビューイングイベント「TIP-OFF EXCLUSIVE VIEWING」を開催している。11月6日（金）には、バスケ動画クリエイターのクリスがゲストとして登場する。",
    date: "2026.10.29",
    thumb: "../assets/journal-713-hero.jpg?v=a3364db9b1"
  },
  {
    href: "712-charles-bassey-injury-journey-warriors.html",
    cat: "NBA",
    title: "チャールズ・バッシー「長く、過酷な道のりだった」—— 幾度もの大怪我を越え、ウォリアーズで迎えた26歳の誕生日",
    excerpt: "ナイジェリア出身のウォリアーズ センター、チャールズ・バッシーは26歳の誕生日に公開された球団の動画で、大学時代からの度重なる大怪我を越えてNBA6年目を迎えた自身の道のりを振り返った。ESPNが報じた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "711-grimes-23-points-clippers.html",
    cat: "NBA",
    title: "クエンティン・グライムズ、クリッパーズ戦で23得点 —— レイカーズが103-87で勝利",
    excerpt: "レイカーズのクエンティン・グライムズは現地時間10月28日、ロサンゼルス・クリッパーズ戦に38分出場し、23得点・アシスト5・スティール4を記録した。両チーム通じてこの日の最多得点者となり、レイカーズは103-87でクリッパーズに勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "710-seahorses-mikawa-u18-championship.html",
    cat: "JAPAN",
    title: "シーホース三河U18、「B.LEAGUE U18 CHAMPIONSHIP 2026」出場 —— 初戦は11月21日、徳島ガンバロウズU18と対戦",
    excerpt: "シーホース三河U18は、全国43チームが参加する「インフロニア B.LEAGUE U18 CHAMPIONSHIP 2026」(11月21日〜25日・日環アリーナ栃木)に出場する。初戦は11月21日13時30分から徳島ガンバロウズU18と対戦。上位4チームは2027年の国際大会「B.LEAGUE U18 INTERNATIONAL CUP」出場権を獲得する。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "709-ajay-mitchell-29-points-mavericks.html",
    cat: "NBA",
    title: "エイジェイ・ミッチェル、マーベリックス戦で29得点 —— サンダーは96-120で敗戦",
    excerpt: "オクラホマシティ・サンダーのエイジェイ・ミッチェルは現地時間10月28日、ダラス・マーベリックス戦に28分出場し、29得点・リバウンド4・アシスト3を記録した。両チーム通じて最多得点者となったが、サンダーは96-120でマーベリックスに敗戦した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "708-jokic-200th-triple-double.html",
    cat: "NBA",
    title: "ヨキッチ、史上2人目の通算200回目トリプルダブル —— ナゲッツはペリカンズに104-91、ウェストブルックの記録まで10回に",
    excerpt: "デンバー・ナゲッツのニコラ・ヨキッチは現地時間10月28日、ニューオーリンズ・ペリカンズ戦で21得点13リバウンド10アシストを記録し、レギュラーシーズン通算200回目のトリプルダブルに到達した。200回到達は史上2人目で、歴代1位ラッセル・ウェストブルックの209回まで残り10回。ナゲッツは104-91で快勝し、ペリカンズとの2連戦を連勝で終えた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "707-wembanyama-36-points-jazz.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、ジャズ戦で36得点14リバウンド —— スパーズが117-111で勝利",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間10月28日、ユタ・ジャズ戦に39分出場し、36得点・リバウンド14・アシスト5・スティール2・ブロック2を記録した。両チーム通じて最多得点者となり、スパーズは117-111でジャズに勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "706-curry-44-points-timberwolves.html",
    cat: "NBA",
    title: "ステフィン・カリー、ティンバーウルブズ戦で44得点 —— ウォリアーズが119-114で勝利",
    excerpt: "ゴールデンステイト・ウォリアーズのステフィン・カリーは現地時間10月28日、ミネソタ・ティンバーウルブズ戦に32分出場し、44得点・リバウンド8・アシスト6を記録した。両チーム通じて最多得点者となり、ウォリアーズは119-114でティンバーウルブズに勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "705-brunson-38-points-bulls.html",
    cat: "NBA",
    title: "ジェイレン・ブランソン、ブルズ戦で38得点7アシスト —— ニックスが133-127で勝利",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンは現地時間10月28日、シカゴ・ブルズ戦に35分出場し、38得点・リバウンド1・アシスト7を記録した。両チーム通じて最多得点者となり、ニックスは133-127でブルズに勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "704-vanvleet-24-points-bucks.html",
    cat: "NBA",
    title: "フレッド・ヴァンブリート、バックス戦で24得点5アシスト —— ロケッツが132-100で大勝",
    excerpt: "ヒューストン・ロケッツのフレッド・ヴァンブリートは現地時間10月28日、ミルウォーキー・バックス戦に29分出場し、24得点・リバウンド6・アシスト5を記録した。両チーム通じて最多得点者となり、ロケッツは132-100でバックスに大勝した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "703-zion-williamson-25-points-nuggets.html",
    cat: "NBA",
    title: "ザイオン・ウィリアムソン、ナゲッツ戦で25得点 —— ペリカンズは91-104で敗戦",
    excerpt: "ニューオーリンズ・ペリカンズのザイオン・ウィリアムソンは現地時間10月28日、デンバー・ナゲッツ戦に32分出場し、25得点・5リバウンド・2アシスト・スティール3を記録した。両チーム通じて最多得点者となったが、ペリカンズは91-104でナゲッツに敗れた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "702-scottie-barnes-28-points-magic.html",
    cat: "NBA",
    title: "スコッティ・バーンズ、マジック戦で28得点6リバウンド —— ラプターズが129-99で快勝",
    excerpt: "トロント・ラプターズのスコッティ・バーンズは現地時間10月28日、オーランド・マジック戦に31分出場し、28得点・6リバウンド・4アシスト・スティール3・ブロック3を記録した。両チーム通じて最多得点者となり、ラプターズは129-99でマジックに快勝した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "701-tyrese-maxey-27-points-pacers.html",
    cat: "NBA",
    title: "タイリース・マクシー、ペイサーズ戦で27得点4アシスト —— セブンティシクサーズが114-109で勝利",
    excerpt: "フィラデルフィア・セブンティシクサーズのタイリース・マクシーは現地時間10月28日、インディアナ・ペイサーズ戦に36分出場し、27得点・5リバウンド・4アシストを記録した。両チーム通じてこの日の試合最多得点者となり、セブンティシクサーズは114-109でペイサーズに勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "700-dybantsa-19-points-nba-debut-cavaliers.html",
    cat: "NBA",
    title: "ウィザーズ1位指名ダイバンツァ、NBAデビューでチーム最多19得点 —— キャバリアーズに121-111で敗戦",
    excerpt: "ワシントン・ウィザーズのAJ・ダイバンツァは現地時間10月28日、クリーブランド・キャバリアーズ戦でNBAデビューを果たし、チーム最多の19得点を記録した。左足首の負傷で開幕から4試合を欠場しており、1992年のトム・グリオッタ以来となるウィザーズ選手のデビュー戦最多得点。試合はキャバリアーズが121-111で勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "699-evan-mobley-24-points-wizards.html",
    cat: "NBA",
    title: "エバン・モーブリー、ウィザーズ戦で24得点12リバウンド —— キャバリアーズが121-111で勝利",
    excerpt: "クリーブランド・キャバリアーズのエバン・モーブリーは現地時間10月28日、ワシントン・ウィザーズ戦に32分出場し、24得点・12リバウンド・2アシストを記録した。両チーム通じて最多得点者となり、キャバリアーズは121-111でウィザーズに勝利した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "698-bam-adebayo-24-points-hawks.html",
    cat: "NBA",
    title: "バム・アデバヨ、ホークス戦で24得点9リバウンド —— ヒートが129-117で快勝",
    excerpt: "マイアミ・ヒートのバム・アデバヨは現地時間10月28日、アトランタ・ホークス戦に33分出場し、24得点・9リバウンド・3スティールを記録した。両チーム通じて最多得点者の一人となり、ヒートは129-117でホークスに快勝した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "697-giannis-antetokounmpo-24-points-hawks.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ、ホークス戦で24得点18リバウンド —— ヒートが129-117で快勝",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは現地時間10月28日、アトランタ・ホークス戦に31分出場し、24得点・18リバウンド・3アシストを記録した。両チーム通じて最多得点者の一人となり、ヒートは129-117でホークスに快勝した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "696-brandon-miller-31-points-pistons.html",
    cat: "NBA",
    title: "ブランドン・ミラー、ピストンズ戦で31得点12リバウンド —— ホーネッツは89-97で敗戦",
    excerpt: "シャーロット・ホーネッツのブランドン・ミラーは現地時間10月28日、デトロイト・ピストンズ戦に38分出場し、31得点・12リバウンド・3アシストを記録した。両チーム通じて最多得点者となったが、ホーネッツは89-97でピストンズに敗れた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "695-nike-gt-uptempo-dylan-harper.html",
    cat: "KICKS",
    title: "Nike GT Uptempo、ディラン・ハーパーが試合で初披露 —— 2027年発売、GT Force・GT Flightに続く新モデル",
    excerpt: "ナイキの新作バスケットボールシューズ「Nike GT Uptempo」を、サンアントニオ・スパーズのディラン・ハーパーが試合でいち早く着用した。2027年発売予定で、既存の「GT Force」「GT Flight」と並ぶ\"Greater Than\"シリーズの新モデルになる。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "694-mavericks-risacher-option.html",
    cat: "NBA",
    title: "マーベリックス、ザカリー・リザシェイの2027-28年オプションを行使 —— ルーキー契約4年目、1740万ドルの保障サラリーに",
    excerpt: "ダラス・マーベリックスは、フォワードのザカリー・リザシェイのルーキー契約における4年目チームオプションを行使したと発表した。2027-28シーズンの1740万ドルの給与が保障される。リザシェイは2024年ドラフト全体1位でホークスから加入した。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "693-mavericks-ceo-welts-retires-casson.html",
    cat: "NBA",
    title: "マーベリックスCEOリック・ウェルツが退任へ —— 後任はチームプレジデントのキャソン、新アリーナ計画は継続",
    excerpt: "ダラス・マーベリックスは、CEOのリック・ウェルツが2度目の退任をすると発表した。後任にはチームプレジデントのイーサン・キャソンが就く。ウェルツは北ダラスの新アリーナ計画を主導するため2024年に加入していた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "692-haliburton-hamstring-injury.html",
    cat: "NBA",
    title: "タイリース・ハリバートン、左ハムストリングを負傷 —— 復帰直後のペイサーズに暗雲、離脱期間は未定",
    excerpt: "ESPNのシャムズ・シャラニア記者が一報。インディアナ・ペイサーズのタイリース・ハリバートンは左ハムストリングを負傷し、しばらく欠場する見通しとなった。アキレス腱断裂からの復帰直後での離脱で、期間は現時点で未定。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "691-dybantsa-return-nba-debut-cavaliers.html",
    cat: "NBA",
    title: "ウィザーズ1位指名ダイバンツァ、負傷から復帰 —— 28日のキャバリアーズ戦でNBAデビューへ",
    excerpt: "ワシントン・ウィザーズは、2026年ドラフト全体1位指名のAJ・ダイバンツァを現地10月28日のキャバリアーズ戦に向けて「出場可能」にアップグレードしたと発表した。プレシーズン終盤の左足首負傷で開幕から4試合を欠場しており、今シーズン初出場となる。ESPNが報じた。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "690-nike-kobe-mamba-vs-diamondback-pack.html",
    cat: "KICKS",
    title: "Nike Kobe「Mamba Vs. Diamondback」が始動 —— 2027年NBAオールスターに合わせた全4モデル",
    excerpt: "ナイキとコービー・ブランドは、2027年NBAオールスターウィークエンドに合わせた特別コレクション「Mamba Vs. Diamondback」を計画している。ブラックマンバを砂漠の世界観で描く4モデル構成のパックで、Sneaker Newsが伝えた。具体的なモデルや発売日は本稿執筆時点で明らかにされていない。",
    date: "2026.10.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "689-porzingis-not-with-team-warriors.html",
    cat: "NBA",
    title: "ポルジンギス、公式ステータスが「チーム非同行」に —— ウォリアーズ内部は復帰にほぼ絶望、契約の行方は不透明",
    excerpt: "ゴールデンステート・ウォリアーズは、無期限離脱中のクリスタプス・ポルジンギスの欠場理由を「体調不良」から「チームに帯同せず」へ公式に変更した。チーム関係者は本人が二度とプレーしない可能性に極めて悲観的だとESPNに語っており、2年4000万ドルの契約とトレードの行方は不透明なままだ。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "688-doncic-41-points-trail-blazers.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、トレイルブレイザーズ戦で41得点9アシスト —— レイカーズは129-136で敗戦",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間10月27日、ポートランド・トレイルブレイザーズ戦に37分出場し、41得点・9アシスト・5リバウンド(FG12/22・3P6/15・FT11/13)を記録した。両チーム通じて最多得点者となったが、レイカーズは129-136でトレイルブレイザーズに敗れた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "687-towns-27-points-20-rebounds-pistons.html",
    cat: "NBA",
    title: "カール-アンソニー・タウンズ、ピストンズ戦で27得点20リバウンド —— ニックスが111-97で勝利",
    excerpt: "ニューヨーク・ニックスのカール-アンソニー・タウンズは現地時間10月27日、デトロイト・ピストンズ戦に33分出場し、27得点・20リバウンド(オフェンス8)を記録した。両チーム通じて最多得点者となり、ニックスは111-97でピストンズに勝利した。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "686-wembanyama-29-points-kings.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、キングス戦で29得点10リバウンド5ブロック —— スパーズが130-103で快勝",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間10月27日、サクラメント・キングス戦に27分出場し、29得点・10リバウンド・5ブロックを記録した。両チーム通じて最多得点者となり、スパーズは130-103でキングスに快勝した。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "685-tatum-40-points-nets.html",
    cat: "NBA",
    title: "ジェイソン・テイタム、ネッツ戦で40得点8アシスト —— セルティックスが125-124で辛勝",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間10月27日、ブルックリン・ネッツ戦に42分出場し、40得点・8アシスト・5リバウンドを記録した。両チーム通じて最多得点者となり、セルティックスは125-124の1点差でネッツを振り切った。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "684-edwards-knee-procedure-two-months.html",
    cat: "NBA",
    title: "ティンバーウルブズのアンソニー・エドワーズ、右膝の関節鏡手術で最大2カ月離脱へ —— キャバリアーズ戦で47得点を記録した直後",
    excerpt: "ミネソタ・ティンバーウルブズのアンソニー・エドワーズは、右膝の関節鏡による外科的処置を受けることになり、最大2カ月の離脱が見込まれる。26日のキャバリアーズ戦で47得点を記録した直後の発表で、ESPNのシャムズ・チャラニア記者が関係者の話として伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "683-new-balance-maxey-v1-red-rock.html",
    cat: "KICKS",
    title: "New Balance Maxey v1「Red Rock」が登場 —— タイリース・マクシーの76ersカラー、品番UMAX59K",
    excerpt: "New Balance Basketballは、タイリース・マクシー（フィラデルフィア・76ers）のシグネチャーモデル「New Balance Maxey v1」に、チームカラーのレッドを基調にした新色「Red Rock」（品番UMAX59K）を投入する。Sneaker Newsが伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "682-air-jordan-10-red-steel-retro.html",
    cat: "KICKS",
    title: "Air Jordan 10「Red Steel」が2027年3月20日に復刻 —— 2005年以来の再登場、品番HJ6779-100",
    excerpt: "ジョーダン ブランドは、2005年の発売以来市場から姿を消していた「Air Jordan 10」の人気カラー「Red Steel」を2027年3月20日に復刻発売する。品番はHJ6779-100で、当時の配色をほぼそのまま再現しているという。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "681-jazz-jackson-torn-mcl-markkanen-wrist.html",
    cat: "NBA",
    title: "ジャズのジャクソンJr.、右膝MCL断裂で6〜8週間離脱 —— マルカネンは手首の捻挫と判明",
    excerpt: "ユタ・ジャズのジャレン・ジャクソンJr.は右膝のMCL(内側側副靭帯)断裂と判明し、6〜8週間の離脱が見込まれる。ラウリ・マルカネンはMRIで右手首の捻挫と判明した。ESPNのティム・マクマホン、シャムズ・チャラニア両記者が関係者の話として伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-681-hero.jpg?v=e3dff30df6"
  },
  {
    href: "680-hornets-muggsy-bogues-retire-jersey.html",
    cat: "NBA",
    title: "ホーネッツ、マグジー・ボーグスの背番号1を永久欠番へ —— NBA史上最も小さい男、2月11日に栄誉",
    excerpt: "シャーロット・ホーネッツは、身長160cmでNBA史上最も小さい選手として知られるマグジー・ボーグスの背番号1を2026年2月11日に永久欠番にすると発表した。ボーグスは球団のアシスト・スティール・出場時間の歴代最多記録保持者。ホーネッツ史上3人目の永久欠番となる。ESPNが伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "679-converse-shai-001-flare.html",
    cat: "KICKS",
    title: "Converse SHAI 001「Flare」が10月29日発売 —— シャイ・ギルジャス＝アレクサンダー、コンバース在籍時モデルに新色",
    excerpt: "コンバースは、シャイ・ギルジャス＝アレクサンダーの初代シグネチャーモデル「Converse SHAI 001」の新色「Flare」（品番A23933C）を10月29日に発売する。ギルジャス＝アレクサンダーはすでにナイキ・バスケットボールへシグネチャー契約を移しているが、コンバース在籍時のモデルも新色展開が続いている。Sneaker Newsが伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "678-leonard-knee-weeks-out.html",
    cat: "NBA",
    title: "カワイ・レナード、左膝の腫れで数週間離脱の見通し —— MRIに構造的損傷なし、1週間後に再評価",
    excerpt: "ESPNのシャムズ・シャラニア記者が一報。トロント・ラプターズのカワイ・レナードは左膝の腫れにより今後数週間の離脱が見込まれている。MRI検査で構造的な損傷は見つからなかったが、チームは1週間後に状態を再評価するとしている。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "677-bam-adebayo-scapegoat-heat-0-4.html",
    cat: "NBA",
    title: "バム・アデバヨ「外野は自分をスケープゴートにしたがる」—— ヒート開幕4連敗、ヤニスとの新体制は手探り",
    excerpt: "マイアミ・ヒートのバム・アデバヨは現地時間10月26日、ダラス・マーベリックス戦の敗戦後、低調な自身のシュートについて「外野は自分をスケープゴートにしたがる」と語った。ヤニス・アデトクンボとの新体制は開幕4連敗からの立て直しが急務。ESPNが伝えた。",
    date: "2026.10.28",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "676-lakers-sale-walter-kushner-iger.html",
    cat: "NBA",
    title: "ウォルター氏、わずか10カ月でレイカーズを“転売” —— カシュナー氏＆アイガー氏が125億ドルで買収合意、バス家の対立は法廷闘争へ",
    excerpt: "ESPNのラモーナ・シェルバーン記者が特集で詳報。レイカーズの支配株主マーク・ウォルター氏は、わずか10カ月の保有で球団をジョシュ・カシュナー氏とボブ・アイガー氏の投資グループに125億ドル評価で売却することに米国時間8月11日夜合意した。バス家に残る株式の売却をめぐる対立は法廷闘争に発展し、12月8日に審理が予定されている。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "675-nike-dunk-low-basketball-charm.html",
    cat: "KICKS",
    title: "Nike Dunk Low「Basketball Charm」が登場 —— 着脱式バスケットボール型チャーム付き新色、品番JA3772-658",
    excerpt: "ナイキは、定番モデル「Dunk Low」のウィメンズ新色「Basketball Charm」(品番JA3772-658)を発表した。靴ひもに取り外し可能な金属製のバスケットボール型チャームを取り付けた一足で、2026年秋冬シーズン中の発売を予定している。HYPEBEAST JPが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "674-seahorses-mikawa-booster-book.html",
    cat: "JAPAN",
    title: "シーホース三河公認ブック「BOOSTER'S 2026-27」11月4日発売 —— 西田優大の覚悟、安齋竜三HC×須田侑太郎の師弟対談も",
    excerpt: "株式会社東京ニュース通信社は、B.LEAGUEプレミア・シーホース三河の公認ブック「BOOSTER'S 2026-27」を11月4日に発売する。2026-27シーズンのロスター12選手の名鑑に加え、キャプテン西田優大の特集や安齋竜三HCと須田侑太郎の師弟対談などを収録する。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "673-meleek-thomas-nba-debut-cavaliers.html",
    cat: "NBA",
    title: "ミーリック・トーマス、NBAデビューで16得点 —— キャバリアーズが127-125のOTでウルブズに勝利",
    excerpt: "クリーブランド・キャバリアーズのルーキー、ミーリック・トーマスは現地時間10月26日のミネソタ・ティンバーウルブズ戦でNBAデビューを果たし、19分の出場で16得点を記録。キャバリアーズは127-125のオーバータイムで勝利した。ESPNが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "672-markkanen-jackson-injuries-jazz-grizzlies.html",
    cat: "NBA",
    title: "マルカネンとジャクソンJr.、前半で相次ぎ負傷退場 —— ジャズがグリズリーズに105-110で敗戦",
    excerpt: "ユタ・ジャズのラウリ・マルカネン（右手首）とジャレン・ジャクソンJr.（右膝）は現地時間10月26日のメンフィス・グリズリーズ戦で前半のうちに相次いで負傷退場した。ジャズは105-110で敗戦。2人とも27日にMRI検査を受ける。ESPNが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "671-jaylen-brown-denies-trade-demand-celtics.html",
    cat: "NBA",
    title: "ブラウン陣営、セルティックスへの「トレード要求」報道を否定 —— 「100%嘘」",
    excerpt: "フィラデルフィア・76ersのジェイレン・ブラウンの代理人は現地時間10月26日、ブラウンがボストン・セルティックス在籍時にトレードを要求した、あるいは要求リストを突きつけたとする報道を「100%嘘」と否定した。ESPNが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "670-fanatics-game-used-ball-photo-panel-vol2.html",
    cat: "NBA",
    title: "NBA実使用ボール入りフォトパネル第2弾、ファナティクスが発売 —— ブランソン・カリー・ウェンバンヤマが登場",
    excerpt: "ファナティクス・ジャパンは、NBAの試合で実際に使用されたゲームボールの一部を封入した額装フォトパネルの第2弾を10月29日正午よりNBA Store Japanで発売する。ジェイレン・ブランソン、ステフィン・カリー、ヴィクター・ウェンバンヤマの3選手がラインナップ、各選手世界250点限定。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "669-nike-af1-gtx-thunder-blue.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low GORE-TEX「Thunder Blue」発表 —— Vibramソール搭載の冬仕様、価格150ドル",
    excerpt: "ナイキは、定番モデル「Air Force 1 Low」の防水GORE-TEXラインに新色「Thunder Blue」を追加発表した。品番HV5953-400、価格150ドルで2026年秋発売予定。Hypebeastが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "668-lendeborg-31-points-nuggets.html",
    cat: "NBA",
    title: "ヤクセル・レンデボーグ、ナゲッツ戦で31得点12リバウンド6アシスト —— ウォリアーズが134-114で快勝",
    excerpt: "ゴールデンステート・ウォリアーズのヤクセル・レンデボーグは現地時間10月26日、敵地でのデンバー・ナゲッツ戦に31分出場し、31得点・12リバウンド・6アシストを記録した。両チーム通じて最多得点者となり、ウォリアーズは134-114でナゲッツに快勝した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "667-george-26-points-grizzlies.html",
    cat: "NBA",
    title: "キヨンテ・ジョージ、グリズリーズ戦で26得点6アシスト —— ジャズは105-110で敗戦",
    excerpt: "ユタ・ジャズのキヨンテ・ジョージは現地時間10月26日、敵地でのメンフィス・グリズリーズ戦に33分出場し、26得点・6アシストを記録した。両チーム通じて最多得点者となったが、ジャズは105-110の5点差でグリズリーズに敗れた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "666-sengun-29-points-hawks.html",
    cat: "NBA",
    title: "アルペラン・シェングン、ホークス戦で29得点9リバウンド9アシスト —— ロケッツが120-110で勝利",
    excerpt: "ヒューストン・ロケッツのアルペラン・シェングンは現地時間10月26日、本拠地でのアトランタ・ホークス戦に37分出場し、29得点・9リバウンド・9アシスト・スティール6を記録した。両チーム通じて最多得点者となり、ロケッツは120-110でホークスに勝利した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "665-herro-23-points-pacers.html",
    cat: "NBA",
    title: "タイラー・ヒーロー、ペイサーズ戦で23得点10リバウンド7アシスト —— バックスが110-102で勝利",
    excerpt: "ミルウォーキー・バックスのタイラー・ヒーローは現地時間10月26日、本拠地でのインディアナ・ペイサーズ戦に32分出場し、23得点・10リバウンド・7アシストを記録した。両チーム通じて最多得点者となり、バックスは110-102でペイサーズに勝利した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "664-mitchell-30-points-suns.html",
    cat: "NBA",
    title: "エイジェイ・ミッチェル、サンズ戦で30得点 —— 主力4人欠くサンダーが125-114で勝利",
    excerpt: "オクラホマシティ・サンダーのエイジェイ・ミッチェルは現地時間10月26日、本拠地でのフィニックス・サンズ戦に25分出場し、フィールドゴール16本中10本・フリースロー10本中9本を沈めて30得点を記録した。ジェイレン・ウィリアムズ、ケイソン・ウォレス、チェット・ホルムグレン、アレックス・カルーソを欠くサンダーは125-114でサンズに勝利した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "663-pritchard-28-points-bulls.html",
    cat: "NBA",
    title: "ペイトン・プリチャード、ブルズ戦で28得点 —— セルティックスが134-99で快勝",
    excerpt: "ボストン・セルティックスのペイトン・プリチャードは現地時間10月26日、本拠地でのシカゴ・ブルズ戦に22分出場し、フィールドゴール16本中10本(3ポイント10本中7本)を沈めて28得点を記録した。セルティックスは134-99の35点差でブルズに快勝した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "662-antetokounmpo-29-points-mavericks.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ、マブス戦で29得点15リバウンド11アシスト —— ヒートは109-113で敗戦",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは現地時間10月26日、敵地でのダラス・マブス戦に39分出場し、29得点・リバウンド15・アシスト11を記録した。ヒートは109-113の4点差でマブスに敗れた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "661-flagg-29-points-heat.html",
    cat: "NBA",
    title: "クーパー・フラッグ、ヒート戦で29得点11アシスト5スティール —— マブスが113-109で勝利",
    excerpt: "ダラス・マブスのクーパー・フラッグは現地時間10月26日、本拠地でのマイアミ・ヒート戦に40分出場し、29得点・11アシスト・リバウンド6・スティール5・ブロック2を記録した。マブスは113-109でヒートに勝利した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "660-edwards-47-points-cavaliers.html",
    cat: "NBA",
    title: "アンソニー・エドワーズ、キャバリアーズ戦で47得点 —— ティンバーウルブズは125-127で惜敗",
    excerpt: "ミネソタ・ティンバーウルブズのアンソニー・エドワーズは現地時間10月26日、敵地でのクリーブランド・キャバリアーズ戦に41分出場し、フィールドゴール33本中19本(3ポイント15本中5本)を沈めて47得点を記録した。両チーム通じて最多得点者となったが、ティンバーウルブズは125-127の2点差でキャバリアーズに敗れた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "659-caruso-ankle-sprain-thunder.html",
    cat: "NBA",
    title: "アレックス・カルーソ、サンズ戦で右足首を負傷 —— ホルムグレンも欠場、サンダーは主力4人が同時に不在",
    excerpt: "オクラホマシティ・サンダーのアレックス・カルーソは現地時間10月26日、本拠地でのフィニックス・サンズ戦で右足首を負傷し途中退場した。同じ試合にはチェット・ホルムグレンも右膝の膝蓋腱炎で欠場。前日に手術が発表されたジェイレン・ウィリアムズ、ケイソン・ウォレスに続き、サンダーの主力4人が同時に戦列を離れる事態となっている。ESPNが報じた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "658-miller-39-points-wizards.html",
    cat: "NBA",
    title: "ブランドン・ミラー、ウィザーズ戦で39得点 —— ホーネッツが110-103で勝利",
    excerpt: "シャーロット・ホーネッツのブランドン・ミラーは現地時間10月26日、本拠地でのワシントン・ウィザーズ戦に36分出場し、フィールドゴール28本中15本(3ポイント10本中5本)を沈めて39得点を記録した。両チーム通じて最多得点者となり、ホーネッツは110-103でウィザーズに勝利した。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "657-ben-sheppard-surgery-pacers.html",
    cat: "NBA",
    title: "パーサーズのベン・シェパード、膝の半月板損傷で手術へ —— カーライルHC発表、開幕戦以降は出場なし",
    excerpt: "インディアナ・パーサーズは現地時間10月26日、ベン・シェパードが膝の半月板損傷の手術を28日に受けると発表した。リック・カーライルHCがバックス戦前の会見で明らかにした。シェパードは開幕戦の勝利以降、一度も出場していない。ESPNが報じた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "656-jalen-williams-cason-wallace-surgery-thunder.html",
    cat: "NBA",
    title: "サンダーのジェイレン・ウィリアムズとケイソン・ウォレス、ともに手術へ —— プレスティGM発表、今季復帰は不透明",
    excerpt: "オクラホマシティ・サンダーは現地時間10月26日、スターターのジェイレン・ウィリアムズとケイソン・ウォレスがともに手術を受け長期離脱すると発表した。サム・プレスティGMによると、ウィリアムズは左足首の脱臼と腓骨骨折、ウォレスは左肩の関節唇断裂。ESPNが報じた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "654-new-balance-kawhi-v-slate-grey.html",
    cat: "KICKS",
    title: "New Balance Kawhi 5「Slate Grey」が11月発売へ —— カワイ・レナードの最新シグネチャーにグレー新色",
    excerpt: "ニューバランスは、トロント・ラプターズのカワイ・レナードのシグネチャーシューズ最新作「Kawhi 5」に新色「Slate Grey」を投入する。グレーを基調にホワイトとオフホワイトを差した配色で、2026年11月の発売が見込まれている。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "653-nike-ja-4-code-red.html",
    cat: "KICKS",
    title: "Nike Ja 4「Code Red」が11月発売 —— ジャ・モラント4代目シグネチャー、ロートップにレッド新色",
    excerpt: "ナイキは、ジャ・モラントの4代目シグネチャーモデル「Nike Ja 4」の新色「Code Red」を発表した。品番IM4135-603で、2026年11月の発売が予定されている。ハイトップ仕様「Ja 4 High」のハロウィン新色「Zombie」に続き、レギュラーのロートップ型にレッドを基調とした配色を投入する。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "652-new-balance-kawhi-v-oxford-blue.html",
    cat: "KICKS",
    title: "New Balance Kawhi 5「Oxford Blue」が発表 —— ドレスシャツ発想の新色、カワイ・レナードの最新シグネチャーに追加",
    excerpt: "ニューバランスは、カワイ・レナードのシグネチャーシューズ最新作「Kawhi 5」の新色「Oxford Blue」を発表した。ドレスシャツを思わせるモノトーンのデザインで、2026年のホリデーシーズンに160ドルで発売予定。Sneaker News、Hypebeastが伝えた。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "651-nba-breakout-tiers-2026-27.html",
    cat: "NBA",
    title: "ウェンバンヤマ、ドンチッチ、フラッグ…… ESPNが選ぶ2026-27ブレイクアウト候補30人を6段階ティアで解説",
    excerpt: "ESPNは2026-27シーズンに飛躍が見込まれるNBA選手30人を、現在の実力と状況に応じて6段階のティアに分けて紹介する特集を公開した。初のMVP候補とされるビクター・ウェンバンヤマやルカ・ドンチッチから、開幕から活躍するルーキーまでを紹介する。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "650-pritchard-iso-king.html",
    cat: "NBA",
    title: "誰も知らない「アイソ・キング」—— ペイトン・プリチャード、2025-26アイソレーション効率でNBA全選手1位に",
    excerpt: "ESPNの特集記事によると、セルティックスのペイトン・プリチャードは2025-26シーズンのアイソレーション(1対1)プレーで、ニコラ・ヨキッチやシェイ・ギルジアス・アレクサンダーを上回るNBA最高の効率を記録した。アレン・アイバーソンも一目置くという、知られざる強さの秘密に迫る。",
    date: "2026.10.26",
    thumb: "../assets/journal-650-hero.jpg?v=0cfc672edf"
  },
  {
    href: "649-alpen-wleague-sponsor.html",
    cat: "JAPAN",
    title: "アルペン、W LEAGUEとオフィシャルスポンサー契約 —— B.LEAGUEに続き男女トップリーグを初めて同時サポート",
    excerpt: "スポーツ用品販売の株式会社アルペンは、女子バスケットボール国内最高峰リーグ「W LEAGUE」運営団体とオフィシャルスポンサー契約を締結したと発表した。男子B.LEAGUEへの支援に続き、男女のトップリーグを初めて同時にサポートする。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "648-brunson-knicks-0-3-start.html",
    cat: "NBA",
    title: "ブランソン「全部、俺の責任だ」—— ニックスは開幕3連敗、前王者としては2011-12マブス以来の不振",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンは現地時間10月25日、マジックに111-102で逆転負けし開幕3連敗となった試合後、不調のオフェンスについて「全部、俺の責任だ」と語った。前王者の開幕3連敗は2011-12シーズンのマブス以来。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "647-lebron-center-role-76ers.html",
    cat: "NBA",
    title: "レブロン「センターでの定着は望んでいない」—— エンビード欠場の76ersで15度目のセンター起用、今季初黒星",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズは現地時間10月25日、エンビード欠場に伴いキャリア通算15度目のセンターでスタートした。18得点5アシストを記録したが76ersは93-106でピストンズに敗れ今季初黒星。試合後「センターで固定の役割を担うためにここにいるわけじゃない」と語った。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "646-lavine-37-points-kings.html",
    cat: "NBA",
    title: "ザック・ラヴィン、グリズリーズ戦で37得点 —— キングスは112-123で敗れる",
    excerpt: "サクラメント・キングスのザック・ラヴィンは現地時間10月25日、敵地でのメンフィス・グリズリーズ戦に40分出場し、フィールドゴール25本中13本を沈めて37得点を記録した。両チーム通じて最多得点者となったが、キングスは112-123でグリズリーズに敗れた。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "645-maxey-29-points-pistons.html",
    cat: "NBA",
    title: "タイリース・マクシー、ピストンズ戦で29得点 —— 76ersは93-106で敗れる",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは現地時間10月25日、本拠地でのデトロイト・ピストンズ戦に34分出場し、フィールドゴール24本中11本を沈めて29得点・5リバウンド・4アシストを記録した。チーム最多得点者となったが、76ersは93-106でピストンズに敗れた。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "644-suggs-knee-injury-magic.html",
    cat: "NBA",
    title: "ジェイレン・サッグス、右膝は軽度の骨挫傷と判明 —— 2週間の欠場へ、大きな損傷なし",
    excerpt: "オーランド・マジックは現地時間10月26日、ニックス戦で負傷したジェイレン・サッグスの右膝が軽度の骨挫傷で、大きな構造的損傷はないと発表した。少なくとも2週間の欠場が見込まれ、2週間後に再検査を行う。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "643-jokic-booing-fans-nuggets.html",
    cat: "NBA",
    title: "ヨキッチ「ブーイングしたファンは、もう来なくていい」—— 23点差からの大逆転勝利、199回目のトリプルダブルも",
    excerpt: "ナゲッツのニコラ・ヨキッチは現地時間10月24日、23点差を跳ね返してペリカンズにOT勝利した試合後、前半にブーイングした地元ファンへ「もう来なくていい」と苦言を述べた。この日35得点15リバウンド10アシストでキャリア199回目のトリプルダブルを記録している。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "642-jalen-williams-leg-injury-thunder.html",
    cat: "NBA",
    title: "ジェイレン・ウィリアムズ、クリッパーズ戦で左脚を負傷 —— ストレッチャーで退場、サンダーは108-101で勝利",
    excerpt: "オクラホマシティ・サンダーのジェイレン・ウィリアムズは現地時間10月25日、本拠地でのロサンゼルス・クリッパーズ戦の試合中に左脚を負傷し、ストレッチャーでコートから運び出された。負傷の詳細についてチームからの公式発表はまだない。サンダーは108-101でクリッパーズに勝利した。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "641-edwards-26-points-raptors.html",
    cat: "NBA",
    title: "アンソニー・エドワーズ、ラプターズ戦で26得点 —— ティンバーウルブズが117-94で快勝",
    excerpt: "ミネソタ・ティンバーウルブズのアンソニー・エドワーズは現地時間10月25日、トロント・ラプターズ戦に28分出場し、フィールドゴール18本中10本を沈めて26得点・3アシストを記録した。両チーム通じてこの日の試合最多得点者となり、ティンバーウルブズは117-94でラプターズに快勝した。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "640-brunson-28-points-magic.html",
    cat: "NBA",
    title: "ジェイレン・ブランソン、マジック戦で28得点 —— ニックスは第4Qに失速し102-111で敗戦",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンは現地時間10月25日、オーランド・マジック戦に32分出場し、フィールドゴール28本中12本を沈めて28得点・4アシスト・2スティールを記録した。両チーム通じてこの日の試合最多得点者となったが、ニックスは第4Qに27-40と失速し102-111でマジックに敗れた。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "639-gilgeous-alexander-34-points-clippers.html",
    cat: "NBA",
    title: "シェイ・ギルジャス＝アレクサンダー、クリッパーズ戦で34得点 —— サンダーが108-101で勝利、開幕3連勝",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間10月25日、本拠地でのロサンゼルス・クリッパーズ戦に36分出場し、34得点・6リバウンド・5アシスト・2スティールを記録した。両チーム通じてこの日の試合最多得点者となり、サンダーは108-101でクリッパーズに勝利し開幕3連勝とした。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "638-hachimura-5-points-thunder.html",
    cat: "NBA",
    title: "八村塁、サンダー戦で5得点 —— クリッパーズは101-108で敗れ1勝2敗",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間10月25日、敵地でのオクラホマシティ・サンダー戦に29分出場し、5得点・4リバウンドを記録した。クリッパーズは101-108でサンダーに敗れ、今季1勝2敗(敵地0-2)となった。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "637-haliburton-24-points-nets.html",
    cat: "NBA",
    title: "タイリース・ハリバートン、ネッツ戦で24得点10アシスト —— ペイサーズが136-109で快勝",
    excerpt: "インディアナ・ペイサーズのタイリース・ハリバートンは現地時間10月25日、ブルックリン・ネッツ戦に31分出場し、24得点・10アシスト・4リバウンド・2スティールのダブルダブルを記録した。両チーム通じてこの日の試合最多得点者となり、ペイサーズは136-109でネッツに快勝した。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "636-yokohama-excellence-kagawa-split.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、香川ファイブアローズ戦は1勝1敗 —— B.LEAGUE ONE第6節、連敗を即日ねじ返す",
    excerpt: "横浜エクセレンスはB.LEAGUE ONE 2026-27シーズン第6節で香川ファイブアローズと対戦し、第1戦は83-86で敗れたが、第2戦は111-92で快勝し1勝1敗で終えた。河合竜児ヘッドコーチは第1戦の敗因を「緩んだ状態で試合に入ってしまったこと」と振り返った。次回ホームは10月31日・11月1日の新潟アルビレックスBB戦。",
    date: "2026.10.26",
    thumb: "../assets/journal-636-hero.jpg?v=2954182db6"
  },
  {
    href: "635-doncic-52-points-jazz.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、ジャズ戦で52得点 —— レイカーズが132-123で勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間10月25日、敵地でのユタ・ジャズ戦に38分出場し、52得点・8リバウンド・10アシストを記録した。両チーム通じてこの日の試合最多得点者となり、レイカーズは132-123で勝利した。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "634-leonard-knee-swelling-wolves.html",
    cat: "NBA",
    title: "カワイ・レナード、ティンバーウルブズ戦を欠場 —— 左膝の腫れ、ラプターズ復帰後初の欠場",
    excerpt: "トロント・ラプターズのカワイ・レナードは現地時間10月25日、ミネソタ・ティンバーウルブズ戦を左膝の腫れで欠場した。クリッパーズからのトレードでラプターズに復帰した今季、公式戦では初めての欠場。出場した2試合では平均19.5得点・7.5リバウンド・3.5スティールを記録していた。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "633-embiid-plantar-fasciitis-pistons.html",
    cat: "NBA",
    title: "ジョエル・エンビード、ピストンズ戦を欠場 —— 本人は出場望むも76ersは右足底筋膜炎の管理を優先",
    excerpt: "フィラデルフィア・セブンティシクサーズのジョエル・エンビードは現地時間10月25日、本拠地での今季初のバックトゥバック2戦目となるデトロイト・ピストンズ戦を右足底筋膜炎の管理で欠場した。前日のバックス戦勝利後に出場を強く望んでいたエンビードだったが、球団はその意向に反して欠場を決めている。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "632-duren-hamstring-strain-pistons.html",
    cat: "NBA",
    title: "ジェイレン・デューレン、右ハムストリング肉離れで最低2週間離脱 —— ヒート戦の前半で負傷、5年2億ドル契約から早くも試練",
    excerpt: "デトロイト・ピストンズのジェイレン・デューレンは現地時間10月23日、本拠地でのマイアミ・ヒート戦の前半で右ハムストリングを負傷し、10分の出場で途中退場した。球団は現地時間10月25日、最低2週間の離脱になると発表した。デューレンは今オフ、5年2億ドルの契約延長で揉めた末にサインしたばかりだった。",
    date: "2026.10.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "631-booker-43-points-warriors.html",
    cat: "NBA",
    title: "デビン・ブッカー、ウォリアーズ戦で43得点 —— サンズが131-122で勝利",
    excerpt: "フィニックス・サンズのデビン・ブッカーは現地時間10月24日、本拠地でのゴールデンステート・ウォリアーズ戦に36分出場し、43得点・7リバウンド・7アシストを記録した。両チーム通じてこの日の試合最多得点者となり、サンズは131-122で勝利した。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "630-murray-42-points-pelicans.html",
    cat: "NBA",
    title: "ジャマール・マレー、ペリカンズ戦で42得点 —— ナゲッツはOTで141-135の接戦を制す",
    excerpt: "デンバー・ナゲッツのジャマール・マレーは現地時間10月24日、本拠地ボール・アリーナでのニューオーリンズ・ペリカンズ戦に43分出場し、42得点・3リバウンド・6アシストを記録した。両チーム通じてこの日の試合最多得点者となり、ナゲッツはオーバータイムにもつれる接戦を141-135で制した。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "629-johnson-26-points-rockets.html",
    cat: "NBA",
    title: "ジェイレン・ジョンソン、ロケッツ戦で26得点16アシスト —— ホークスは114-121で敗戦",
    excerpt: "アトランタ・ホークスのジェイレン・ジョンソンは現地時間10月24日、本拠地でのヒューストン・ロケッツ戦に38分出場し、26得点・9リバウンド・16アシスト・2スティールを記録した。両チーム通じてこの日の試合最多得点者となったが、ホークスは114-121でロケッツに敗れた。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "628-lebron-kessler-season-debuts-espn.html",
    cat: "NBA",
    title: "レブロン、76ersでアシスト役に専念 —— ケスラーはレイカーズ初陣でシュート12本全て成功、ESPNが開幕週の新加入組を分析",
    excerpt: "ESPNは開幕週に新天地へ加入した主力選手たちの立ち上がりを分析。76ersのレブロン・ジェームズは得点を抑えてアシスト役に回り、レイカーズのウォーカー・ケスラーはレギュラーシーズン初出場でシュート12本全てを成功させた。ESPNのベン・ゴリバー記者が報じた。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "627-flagg-shoulder-sprain-home-opener.html",
    cat: "NBA",
    title: "クーパー・フラッグ、左肩「軽度」捻挫でホームオープナー欠場 —— ペイサーズ戦のネスミスのファウルで負傷、来週再評価へ",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグは現地時間10月24日朝のMRI検査で左肩の軽度の捻挫と判明し、同日本拠地で行われたサンアントニオ・スパーズ戦を欠場した。来週再評価される予定。ESPNが報じた。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "626-wembanyama-23-points-mavericks.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、マーベリックス戦で23得点4ブロック —— スパーズが122-106で勝利",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間10月24日、アウェイでのダラス・マーベリックス戦に29分出場し、フィールドゴール18本中9本、フリースロー5本中3本を沈めて23得点・7リバウンド・4ブロックを記録した。スパーズは122-106でマーベリックスを下した。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "625-embiid-triple-double-bucks.html",
    cat: "NBA",
    title: "ジョエル・エンビード、バックス戦でトリプルダブル —— 76ersは127-116で無敗を継続",
    excerpt: "フィラデルフィア・76ersのジョエル・エンビードは現地時間10月24日、本拠地でのミルウォーキー・バックス戦に36分出場し、フィールドゴール20本中8本、フリースロー14本中12本を沈めて28得点・11リバウンド・10アシストのトリプルダブルを記録した。76ersは127-116でバックスを下し、無敗を継続した。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "624-porter-jr-28-points-cavaliers.html",
    cat: "NBA",
    title: "マイケル・ポーター・ジュニア、キャバリアーズ戦で28得点 —— ネッツは121-125で敗戦",
    excerpt: "ブルックリン・ネッツのマイケル・ポーター・ジュニアは現地時間10月24日、アウェイでのクリーブランド・キャバリアーズ戦に33分出場し、フィールドゴール18本中10本、フリースロー4本中4本を沈めて28得点・9リバウンド・4スティールを記録した。両チーム通じてこの日の試合最多得点者となったが、ネッツは121-125でキャバリアーズに敗れた。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "623-wilson-30-points-wizards.html",
    cat: "NBA",
    title: "ケイレブ・ウィルソン、ウィザーズ戦で30得点 —— ブルズは120-124で敗戦",
    excerpt: "シカゴ・ブルズのケイレブ・ウィルソンは現地時間10月24日、本拠地でのワシントン・ウィザーズ戦に38分出場し、フィールドゴール24本中10本、フリースロー11本中9本を沈めて30得点・15リバウンド・3アシスト・2スティール・1ブロックを記録した。両チーム通じてこの日の試合最多得点者となったが、ブルズは120-124でウィザーズに敗れた。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "622-miller-34-points-heat.html",
    cat: "NBA",
    title: "ブランドン・ミラー、ヒート戦で34得点 —— ホーネッツが115-110で勝利",
    excerpt: "シャーロット・ホーネッツのブランドン・ミラーは現地時間10月24日、本拠地でのマイアミ・ヒート戦に36分出場し、フィールドゴール29本中10本(3ポイント10本中3本)、フリースロー12本中11本を沈めて34得点・7リバウンド・4アシストを記録した。両チーム通じてこの日の試合最多得点者となり、ホーネッツは115-110でヒートを下して2-1とした。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "621-lebron-sciatica-bucks.html",
    cat: "NBA",
    title: "レブロン・ジェームズ、バックス戦を欠場へ —— 坐骨神経痛の管理で76ers加入後初の欠場",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズは現地時間10月24日、坐骨神経痛による腰の痛みを管理するため、本拠地でのミルウォーキー・バックス戦を欠場する。76ersが発表した。ジェームズは昨季も坐骨神経痛で開幕14試合を欠場しており、76ers加入後では今季初の欠場となる。ESPNが報じた。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "620-banchero-ankle-injury-timberwolves.html",
    cat: "NBA",
    title: "パオロ・バンケロ、「軽度」の足首捻挫で数週間離脱へ —— ティンバーウルブズ戦の第3Qで負傷、マジックは93-115で敗戦",
    excerpt: "オーランド・マジックのパオロ・バンケロは現地時間10月23日、本拠地キア・センターでのティンバーウルブズ戦の第3Qで足首を負傷し、第4Qを欠場した。ESPNのShams Charania記者によると診断は「軽度の高位足首捻挫」で、数週間の離脱が見込まれるという。マジックは93-115で敗戦した。",
    date: "2026.10.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "619-adidas-harden-vol-10-ruei.html",
    cat: "KICKS",
    title: "Ray Asian Boy x adidas ハーデン Vol. 10 PE「RUEI」が10月26日発売 —— adidas CONFIRMEDアプリ限定",
    excerpt: "adidasは、ジェームズ・ハーデンのシグネチャーモデル「ハーデン Vol. 10」のPE(プレイヤーエディション)、Ray Asian Boyとのコラボレーション「RUEI」を10月26日に発売する。adidas CONFIRMEDアプリでの限定販売となる。Nice Kicksが報じた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "618-nike-air-force-1-square-toe.html",
    cat: "KICKS",
    title: "ナイキ「エア フォース 1 ロー スクエアトゥ」トリプルホワイト／トリプルブラックが11月6日発売 —— 定番シルエットのトゥを角型に変更",
    excerpt: "ナイキは、定番モデル「エア フォース 1 ロー」のトゥの形状を変えた新バリエーション「スクエアトゥ」から、2色「トリプルホワイト」（品番JF7766-100）と「トリプルブラック」（品番JF7766-001）を11月6日に発売する。Sneaker Bar Detroitが報じた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "617-giannis-spoelstra-heat-0-2-start.html",
    cat: "NBA",
    title: "アデトクンボ「僕らは間違いなくショックを受けた」—— ヒート0-2発進、スポールストラ「たどり着く」",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは開幕2試合で自己最多の71得点をマークしながら、チームは0-2発進。被失点259はフランチャイズ最悪で、アデトクンボの選手人生で初めてチームが開幕2試合を未勝利で終えた。エリック・スポールストラ監督は「たどり着く」と語った。ESPNが伝えた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "616-tatum-denies-beef-jaylen-brown.html",
    cat: "NBA",
    title: "テイタム「確執もない」—— 開幕戦36得点の夜、「キャップ」論争に自ら反論",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間10月23日、ニックスとの本拠地開幕戦後の会見で、76ersへトレードされたジェイレン・ブラウンとの関係について「確執も悪意もない」と語った。ブラウンが数日前にSNSで青い帽子の絵文字を投稿したことで再燃した「キャップ（嘘）」論争に自ら火消しを図った。ESPNが伝えた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "615-jackson-24-points-pelicans.html",
    cat: "NBA",
    title: "ジェイレン・ジャクソン・ジュニア、ペリカンズ戦で24得点10リバウンド —— ジャズが120-119で勝利",
    excerpt: "ユタ・ジャズのジェイレン・ジャクソン・ジュニアは現地時間10月23日、本拠地ソルトレイクシティでのペリカンズ戦に33分出場し、フィールドゴール15本中7本(3ポイント4本中2本)、フリースロー10本中8本を沈めて24得点・10リバウンド・3ブロックを記録した。両チーム通じてこの日の試合最多得点者となり、ジャズは第3Qの逆転を第4Qで跳ね返して120-119でペリカンズを下した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "614-reaves-28-points-clippers.html",
    cat: "NBA",
    title: "オースティン・リーブス、クリッパーズ戦で28得点9アシスト —— レイカーズが125-117で勝利",
    excerpt: "ロサンゼルス・レイカーズのオースティン・リーブスは現地時間10月23日、クロスタウンのクリッパーズ戦に38分出場し、フィールドゴール13本中10本(3ポイント5本中3本)、フリースロー6本中5本を沈めて28得点・9アシスト・2スティールを記録した。レイカーズは第3Qに突き放して125-117でクリッパーズを下した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "613-jerome-28-points-warriors.html",
    cat: "NBA",
    title: "タイ・ジェローム、ウォリアーズ戦で28得点 —— グリズリーズが111-108で勝利",
    excerpt: "メンフィス・グリズリーズのタイ・ジェロームは現地時間10月23日、敵地サンフランシスコでのウォリアーズ戦に32分出場し、フィールドゴール22本中11本(3ポイント5本中3本)、フリースロー5本中3本を沈めて28得点・5アシストを記録した。両チーム通じてこの日の試合最多得点者となり、グリズリーズは111-108でウォリアーズを下した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "612-sengun-29-points-spurs.html",
    cat: "NBA",
    title: "アルペラン・シェングン、スパーズ戦で29得点 —— ロケッツが114-110で勝利",
    excerpt: "ヒューストン・ロケッツのアルペラン・シェングンは現地時間10月23日、敵地サンアントニオでのスパーズ戦に36分出場し、フィールドゴール20本中10本(3ポイント4本中2本)、フリースロー8本中7本を沈めて29得点・7リバウンド・7アシストを記録した。両チーム通じてこの日の試合最多得点者となり、ロケッツは114-110でスパーズを下した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "611-acuff-33-points-blazers.html",
    cat: "NBA",
    title: "ダリアス・エイカフ・ジュニア、トレイルブレイザーズ戦で33得点 —— キングスは120-128で敗戦",
    excerpt: "サクラメント・キングスのダリアス・エイカフ・ジュニアは現地時間10月23日、本拠地でのポートランド・トレイルブレイザーズ戦に37分出場し、フィールドゴール26本中10本(3ポイント11本中2本)、フリースロー12本中11本を沈めて33得点・4アシストを記録した。両チーム通じてこの日の試合最多得点者となったが、キングスは第3Qに突き放されて120-128で敗れた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "610-hachimura-16-points-lakers.html",
    cat: "NBA",
    title: "八村塁、レイカーズ戦で16得点6リバウンド —— クリッパーズは117-125で敗戦",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間10月23日、クロスタウンのレイカーズ戦に33分出場し、フィールドゴール14本中5本(3ポイント6本中3本)、フリースロー4本中3本を沈めて16得点・6リバウンド・2スティールを記録した。クリッパーズは第3Qに突き放されて117-125でレイカーズに敗れた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "609-yves-missi-knee-injury-jazz.html",
    cat: "NBA",
    title: "イブ・ミッシ、ジャズ戦で左膝負傷退場 —— ウィリアムソンの着地に巻き込まれる、ペリカンズは119-120で惜敗",
    excerpt: "ニューオーリンズ・ペリカンズのイブ・ミッシは現地時間10月23日、敵地でのユタ・ジャズ戦の第2Q、ザイオン・ウィリアムソンのシュートがブロックされた後の着地でミッシの左脚に乗り込む形となり、左膝を負傷して途中退場した。左脚に体重をかけられずロッカールームへ運ばれ、試合には戻らなかった。ペリカンズは119-120でジャズに惜敗し、ミッシは24日に再検査を受ける。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "608-giannis-36-points-pistons.html",
    cat: "NBA",
    title: "ヤニス・アデトクンボ、ピストンズ戦で36得点 —— ヒートは111-128で敗戦",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは現地時間10月23日、本拠地Kaseya Centerでのデトロイト・ピストンズ戦に33分出場し、フィールドゴール26本中15本(3ポイント3本中1本)、フリースロー8本中5本を沈めて36得点・12リバウンド・5アシストを記録した。両チーム通じてこの日の試合最多得点者となったが、ヒートは111-128でピストンズに敗れた。",
    date: "2026.10.24",
    thumb: "../assets/journal-608-hero.jpg?v=924b454993"
  },
  {
    href: "607-wiggins-19-points-hornets.html",
    cat: "NBA",
    title: "アーロン・ウィギンス、ホーネッツ戦で19得点 —— ホークスが128-81で大勝",
    excerpt: "アトランタ・ホークスのアーロン・ウィギンスは現地時間10月23日、シャーロットのスペクトラム・センターでのシャーロット・ホーネッツ戦に22分出場し、フィールドゴール9本中7本を沈めて19得点・2スティールを記録した。チームメートのジェイレン・ジョンソン(19得点)と並び両チーム通じてこの日の試合最多得点者となり、ホークスは128-81でホーネッツに大勝した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "606-cooper-flagg-shoulder-injury-pacers.html",
    cat: "NBA",
    title: "クーパー・フラッグ、ペイサーズ戦で左肩負傷退場 —— ネスミスのハードファウルで激突、前半は14得点",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグは現地時間10月23日のインディアナ・ペイサーズ戦で、第1Q終盤にインディアナのエイロン・ネスミスから受けたハードファウルで左肩を負傷し、前半のみで出場を終えた。ESPNによると、フラッグはブレイクアウェイのダンクに向かう場面で背後からファウルを受け、バスケット下で肩から転倒したという。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "605-jalen-johnson-19-points-hornets.html",
    cat: "NBA",
    title: "ジェイレン・ジョンソン、ホーネッツ戦で19得点7リバウンド8アシスト —— ホークスが128-81で大勝",
    excerpt: "アトランタ・ホークスのジェイレン・ジョンソンは現地時間10月23日、シャーロットのスペクトラム・センターでのシャーロット・ホーネッツ戦に29分出場し、フィールドゴール16本中9本を沈めて19得点・7リバウンド・8アシスト・3スティールを記録した。チームメートのアーロン・ウィギンス(19得点)と並び両チーム通じてこの日の試合最多得点者となり、ホークスは128-81でホーネッツに大勝した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "604-carter-jr-20-points-timberwolves.html",
    cat: "NBA",
    title: "ウェンデル・カーター・ジュニア、ティンバーウルブズ戦で20得点 —— マジックは93-115で敗戦",
    excerpt: "オーランド・マジックのウェンデル・カーター・ジュニアは現地時間10月23日、本拠地キア・センターでのミネソタ・ティンバーウルブズ戦に29分出場し、フィールドゴール9本中8本を沈めて20得点・9リバウンド・2ブロックを記録した。両チーム通じてこの日の試合最多得点者となったが、マジックは93-115でティンバーウルブズに敗れた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "603-irving-24-points-pacers.html",
    cat: "NBA",
    title: "カイリー・アービング、ペイサーズ戦で24得点 —— マーベリックスが121-105で快勝",
    excerpt: "ダラス・マーベリックスのカイリー・アービングは現地時間10月23日、インディアナポリスのゲインブリッジ・フィールドハウスでのインディアナ・ペイサーズ戦に25分出場し、フィールドゴール15本中8本(3ポイント10本中5本)を沈めて24得点を記録した。両チーム通じてこの日の試合最多得点者となり、マーベリックスは121-105でペイサーズに快勝した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "602-barnes-28-points-wizards.html",
    cat: "NBA",
    title: "スコッティ・バーンズ、ウィザーズ戦で28得点14リバウンド —— ラプターズが112-102で勝利",
    excerpt: "トロント・ラプターズのスコッティ・バーンズは現地時間10月23日、ワシントンのキャピタル・ワン・アリーナでのワシントン・ウィザーズ戦に37分出場し、フィールドゴール26本中12本を沈めて28得点・14リバウンド・5アシストを記録した。両チーム通じてこの日の試合最多得点者となり、ラプターズは112-102でウィザーズを下した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "601-tatum-36-points-knicks.html",
    cat: "NBA",
    title: "ジェイソン・テイタム、ニックス戦で36得点 —— セルティックスが107-103で勝利",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間10月23日、本拠地TDガーデンでのニューヨーク・ニックス戦に37分出場し、フィールドゴール26本中14本(3ポイント10本中3本)、フリースロー5本中5本を沈めて36得点・9リバウンド・7アシストを記録した。両チーム通じてこの日の試合最多得点者となり、セルティックスは107-103でニックスを下した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "600-thunder-sign-micah-peavy-two-way.html",
    cat: "NBA",
    title: "サンダー、マイカ・ピービーと2ウェイ契約で合意 —— グリズリーズのウェーバー公示から4日、ペリカンズ時代のドラフト40位がオクラホマシティへ",
    excerpt: "オクラホマシティ・サンダーはマイカ・ピービーと2ウェイ契約で合意した。ESPNのシャムズ・チャラニア記者が伝えた。ピービーは10月19日にメンフィス・グリズリーズからウェーバー公示されていた(610既報)。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "599-kings-sign-sean-pedulla-two-way.html",
    cat: "NBA",
    title: "キングス、ショーン・ペデュラと2ウェイ契約で合意 —— 2025-26 Gリーグ新人王、代理人がESPNに伝える",
    excerpt: "サクラメント・キングスはガードのショーン・ペデュラと2ウェイ契約で合意した。代理人ジョージ・S・ラングバーグ氏がESPNのシャムズ・チャラニア記者に伝えた。ペデュラは2025-26シーズンのNBA Gリーグ新人王だった。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "598-herro-34-points-bulls.html",
    cat: "NBA",
    title: "タイラー・ヒーロー、ブルズ戦で34得点 —— バックスは125-132で敗戦",
    excerpt: "ミルウォーキー・バックスのタイラー・ヒーローは現地時間10月23日、本拠地Fiserv Forumでのシカゴ・ブルズ戦に32分出場し、フィールドゴール24本中12本(3ポイント10本中5本)、フリースロー7本中5本を沈めて34得点・4アシスト・5リバウンドを記録した。両チーム通じてこの日の試合最多得点者となったが、バックスは125-132でブルズに敗れた。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "597-air-jordan-41-amethyst.html",
    cat: "KICKS",
    title: "Air Jordan 41「Amethyst」公開 —— ジョーダン ブランド「ジェムストーン」新色シリーズの一足、品番HV6474-002",
    excerpt: "ジョーダン ブランドはエア ジョーダン41の新色「アメジスト」（品番HV6474-002）を公開した。メタリックパープルの光沢パネルに黒メッシュのアッパーを組み合わせ、ブランドが展開する「ジェムストーン」カラーシリーズの一足となる。発売日・価格は現時点で未発表。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "596-air-jordan-6-white-infrared.html",
    cat: "KICKS",
    title: "Air Jordan 6「White Infrared」が11月7日発売 —— 1991年オリジナルの意匠に寄せた復刻、品番CT8529-105",
    excerpt: "ナイキはエア ジョーダン6の人気カラー「ホワイト インフラレッド」（品番CT8529-105）を2026年11月7日、SNKRSと一部取扱店で発売する。前回の復刻から12年ぶり、1991年のオリジナルに近いディテールを採用した。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "595-knicks-sign-dalton-knecht-two-way.html",
    cat: "NBA",
    title: "ニックス、ダルトン・クネクトと2ウェイ契約で合意 —— レイカーズ解雇から数日、前王者の下で再起期す",
    excerpt: "ニューヨーク・ニックスは現地時間10月23日、レイカーズにウェーバー公示されていたダルトン・クネクトと2ウェイ契約で合意した。本人の代理人がESPNのシャムズ・チャラニア記者に伝えた。クリーブランド、サクラメント、ミネソタも関心を示していたという。",
    date: "2026.10.24",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "594-anta-kai-1-chief-hela-red.html",
    cat: "KICKS",
    title: "ANTA「Kai 1 Chief Hélà Red」が10月24日発売 —— カイリー・アービングのシグネチャー、2026年初のKai 1新色",
    excerpt: "ANTAはカイリー・アービングのシグネチャーシューズ「Kai 1」の新色「Chief Hélà Red」（品番812631102M-1）を2026年10月24日に発売する。2026年のKai 1としては初の新色リリース。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "593-nike-air-force-1-philly.html",
    cat: "KICKS",
    title: "ナイキ「エア フォース 1 '01 Philly」発売 —— レブロン・ジェームズの76ers入りを祝う一足",
    excerpt: "ナイキは「エア フォース 1 '01 Philly」（品番JW9694-100・140ドル）を発売した。レブロン・ジェームズのフィラデルフィア・76ers入りを記念し、チームカラーと地域性を落とし込んだ一足。SNKRSで販売中。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "592-nba-contract-talks-thunder-payroll.html",
    cat: "NBA",
    title: "「不満」はもう交渉カードにならない —— NBA球団がスター契約で強硬姿勢に、サンダーは来季4.5億ドル規模のぜいたく税負担へ",
    excerpt: "ESPNのブライアン・ウィンダーホースト記者とティム・マクマホン記者が開幕週の球団事情を特集。カール・アンソニー・タウンズらスター選手の契約交渉で球団側が強硬姿勢を見せる新潮流と、オクラホマシティ・サンダーが来季4.5億ドル、2027-28年には5億ドル規模のぜいたく税負担に直面する財政事情を報じた。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "591-sga-20-point-streak-ends.html",
    cat: "NBA",
    title: "ギルジャス＝アレクサンダー、NBA記録の141試合連続20得点が途絶える —— 自ら交代を志願、サンダーはナゲッツに96-84で快勝",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間10月22日のデンバー・ナゲッツ戦で17得点に終わり、2024年10月30日から続いていたNBA記録の141試合連続20得点以上のストリークが途絶えた。残り1分43秒、あと3点でストリークを伸ばせる場面で自らベンチに下がることを志願し、マーク・デイグノルトHCはその姿勢を称賛した。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "590-jalen-williams-21-points-nuggets.html",
    cat: "NBA",
    title: "ジェイレン・ウィリアムズ、ナゲッツ戦で21得点 —— サンダーが96-84で快勝",
    excerpt: "オクラホマシティ・サンダーのジェイレン・ウィリアムズは現地時間10月22日、本拠地でのデンバー・ナゲッツ戦に33分出場し、フィールドゴール15本中7本(3ポイント6本中2本)、フリースロー6本中5本を沈めて21得点・5リバウンド・3アシストを記録した。両チーム通じてこの日の試合最多得点者となり、サンダーは96-84でナゲッツを下した。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "589-nba-docomo-day-free-streaming.html",
    cat: "NBA",
    title: "「NBA docomo DAY」11月3日に全5試合無料配信 —— 八村塁×レナード復帰の一戦にJ-POP aoen颯太がゲスト出演",
    excerpt: "NTTドコモは23日、映像配信サービス「NBA docomo」のイベント「NBA docomo DAY」を11月3日に開催すると発表した。当日配信の全5試合を無料配信し、八村塁のクリッパーズとカワイ・レナードが7年ぶりに復帰したラプターズの一戦は特別番組として実況中継、7人組J-POPグループaoenの颯太がスペシャルゲスト出演する。渋谷キャストでの無料パブリックビューイングも実施。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "588-maxey-32-points-cavaliers.html",
    cat: "NBA",
    title: "タイリース・マクシー、キャバリアーズ戦で32得点 —— 76ersが114-106で逆転勝利",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは現地時間10月22日、本拠地Xfinity Mobile Arenaでのクリーブランド・キャバリアーズ戦に42分出場し、フィールドゴール23本中12本(3ポイント7本中2本)、フリースロー8本中6本を沈めて32得点・6アシストを記録した。両チーム通じてこの日の試合最多得点者(タイ)となり、76ersは前半のビハインドを跳ね返して114-106で勝利した。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "587-mitchell-32-points-76ers.html",
    cat: "NBA",
    title: "ドノバン・ミッチェル、76ers戦で32得点 —— キャバリアーズが106-114で逆転負け",
    excerpt: "クリーブランド・キャバリアーズのドノバン・ミッチェルは現地時間10月22日、敵地フィラデルフィアのXfinity Mobile Arenaでの76ers戦に35分出場し、フィールドゴール19本中11本(3ポイント4本中2本)、フリースロー11本中8本を沈めて32得点・10リバウンド・3アシストを記録した。両チーム通じてこの日の試合最多得点者(タイ)となったが、キャバリアーズは前半の大量リードを守れず106-114で逆転負けを喫した。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "586-foamposite-pro-college-pack.html",
    cat: "KICKS",
    title: "Nike Air Foamposite Pro、LSU＆オハイオ州立カラーが11月5日発売 —— カレッジチーム仕様の新色2型",
    excerpt: "Nike Air Foamposite Proのカレッジチームカラー2色、LSUタイガース仕様（品番IX2091-700）とオハイオ州立大学仕様（品番IX2094-100）が2026年11月5日に発売される。",
    date: "2026.10.23",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "585-sga-presti-patience-bond.html",
    cat: "NBA",
    title: "「カメとウサギ」の絵本が始まりだった —— サンダーGMプレスティとシェイ・ギルジャス＝アレクサンダー、急がない再建の7年",
    excerpt: "オクラホマシティ・サンダーのサム・プレスティGMは、不調に苦しんだシェイ・ギルジャス＝アレクサンダーの2年目にイソップ童話「ウサギとカメ」の絵本を贈り、気の長い再建計画への理解を求めた。ESPNのティム・マクマホン記者が、MVPに至るまでの信頼関係を特集した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "584-haliburton-return-pacers-opener.html",
    cat: "NBA",
    title: "タイリース・ハリバートン、400日越しの実戦復帰で涙 —— ペイサーズが開幕戦でペリカンズに123-120の接戦制す",
    excerpt: "インディアナ・ペイサーズのタイリース・ハリバートンは現地時間10月21日、2025年NBAファイナルGame7で負った右アキレス腱断裂から約16カ月半ぶりに実戦復帰。23得点12アシストでペリカンズとの開幕戦を123-120で勝利に導いた。ESPN(Andscape)が伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "583-lebron-era-ends-lakers-warriors.html",
    cat: "NBA",
    title: "レイカーズ、開幕戦でウォリアーズに127-105 —— リーブスが語ったレブロンとの「最後の抱擁」",
    excerpt: "ロサンゼルス・レイカーズは現地時間10月21日の開幕戦でゴールデンステート・ウォリアーズを127-105で下したが、コートにレブロン・ジェームズの姿はなかった。オースティン・リーブスが明かした別れの夜と、新時代を担うルカ・ドンチッチの奮闘をESPNが伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "582-giannis-heat-debut-trust-quote.html",
    cat: "NBA",
    title: "ヤニス「お互いをもっと信じないと」—— ヒート公式戦デビューは35得点も開幕戦で大敗",
    excerpt: "マイアミ・ヒートのヤニス・アデトクンボは現地時間10月21日のレギュラーシーズン開幕戦(対ティンバーウルブズ)でヒート公式戦デビューを果たし35得点を記録したが、チームは106-131で大敗。試合後「お互いをもっと信じないといけない」と課題を語った。ESPNが伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-582-hero.jpg?v=90f28cdb98"
  },
  {
    href: "581-garland-30-points-kings.html",
    cat: "NBA",
    title: "ダリアス・ガーランド、キングス戦で30得点 —— クリッパーズが121-96で快勝",
    excerpt: "ロサンゼルス・クリッパーズのダリアス・ガーランドは現地時間10月21日、本拠地Intuit Domeでのサクラメント・キングス戦に32分出場し、フィールドゴール19本中11本(3ポイント8本中3本)、フリースロー8本中5本を沈めて30得点・4アシストを記録した。両チーム通じてこの日の試合最多得点者となり、クリッパーズは121-96でキングスに快勝した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "580-hachimura-10-points-kings.html",
    cat: "NBA",
    title: "八村塁、キングス戦で10得点8リバウンド —— クリッパーズが121-96で快勝",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間10月21日、本拠地Intuit Domeでのサクラメント・キングス戦に32分出場し、フィールドゴール13本中3本(3ポイント7本中2本)、フリースロー5本中2本を沈めて10得点・8リバウンドを記録した。クリッパーズは121-96でキングスに快勝した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "579-lillard-25-points-suns.html",
    cat: "NBA",
    title: "デイミアン・リラード、サンズ戦で25得点 —— ブレイザーズが124-83で大勝",
    excerpt: "ポートランド・トレイルブレイザーズのデイミアン・リラードは現地時間10月21日、本拠地でのフェニックス・サンズ戦に24分出場し、フィールドゴール12本中7本(3ポイント10本中6本)、フリースロー5本中5本を沈めて25得点・6アシスト・3リバウンドを記録した。両チーム通じてこの日の試合最多得点者となり、ブレイザーズは124-83でサンズに大勝した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "578-doncic-28-points-warriors.html",
    cat: "NBA",
    title: "ルカ・ドンチッチ、ウォリアーズ戦で28得点 —— レイカーズが127-105で快勝",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間10月21日、本拠地でのゴールデンステート・ウォリアーズ戦に30分出場し、フィールドゴール18本中7本(3ポイント12本中5本)、フリースロー9本中9本を沈めて28得点・8リバウンド・7アシストを記録した。両チーム通じてこの日の試合最多得点者となり、レイカーズは127-105でウォリアーズを下した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "577-flagg-32-points-rockets.html",
    cat: "NBA",
    title: "クーパー・フラッグ、ロケッツ戦で32得点 —— マーベリックスは110-128で敗戦",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグは現地時間10月21日、敵地でのヒューストン・ロケッツ戦に33分出場し、フィールドゴール17本中10本(3ポイント4本中1本)、フリースロー13本中11本を沈めて32得点・5リバウンド・2アシストを記録した。両チーム通じてこの日の試合最多得点者となったが、マーベリックスは110-128でロケッツに敗れた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "576-siakam-30-points-pelicans.html",
    cat: "NBA",
    title: "パスカル・シアカム、ペリカンズ戦で30得点 —— ペイサーズが123-120で接戦制す",
    excerpt: "インディアナ・ペイサーズのパスカル・シアカムは現地時間10月21日、敵地でのニューオーリンズ・ペリカンズ戦に35分出場し、フィールドゴール23本中13本(3ポイント3本中1本)、フリースロー8本中3本を沈めて30得点・8リバウンドを記録した。両チーム通じてこの日の試合最多得点者となり、ペイサーズは123-120でペリカンズとの接戦を制した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "575-ty-jerome-45-points-jazz.html",
    cat: "NBA",
    title: "タイ・ジェローム、ジャズ戦で45得点 —— グリズリーズが123-103で快勝",
    excerpt: "メンフィス・グリズリーズのタイ・ジェロームは現地時間10月21日、本拠地でのユタ・ジャズ戦に32分出場し、フィールドゴール25本中17本(3ポイント10本中5本)、フリースロー7本中6本を沈めて45得点・7リバウンド・6アシストを記録した。両チーム通じてこの日の試合最多得点者となり、グリズリーズは123-103でジャズを下した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "574-quickley-23-points-bulls.html",
    cat: "NBA",
    title: "イマニュエル・クイックリー、ブルズ戦で23得点7アシスト —— ラプターズが135-92で大勝",
    excerpt: "トロント・ラプターズのイマニュエル・クイックリーは現地時間10月21日、本拠地でのシカゴ・ブルズ戦に28分出場し、フィールドゴール13本中6本(3ポイント9本中4本)、フリースロー8本中7本を沈めて23得点・7アシスト・2スティールを記録した。クイックリーはカワイ・レナード、スコッティ・バーンズと並んで両チーム通じてこの日の試合最多得点となり、ラプターズは135-92でブルズに大勝した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "573-barnes-23-points-bulls.html",
    cat: "NBA",
    title: "スコッティ・バーンズ、ブルズ戦で23得点5アシスト —— ラプターズが135-92で大勝",
    excerpt: "トロント・ラプターズのスコッティ・バーンズは現地時間10月21日、本拠地でのシカゴ・ブルズ戦に26分出場し、フィールドゴール19本中8本(3ポイント3本中1本)、フリースロー6本中6本を沈めて23得点・5アシスト・6リバウンドを記録した。バーンズはカワイ・レナード、イマニュエル・クイックリーと並んで両チーム通じてこの日の試合最多得点となり、ラプターズは135-92でブルズに大勝した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "572-leonard-23-points-bulls.html",
    cat: "NBA",
    title: "カワイ・レナード、ブルズ戦で23得点4スティール —— ラプターズが135-92で大勝",
    excerpt: "トロント・ラプターズのカワイ・レナードは現地時間10月21日、本拠地でのシカゴ・ブルズ戦に24分出場し、フィールドゴール17本中5本(3ポイント6本中2本)、フリースロー11本中11本を沈めて23得点・4スティールを記録した。レナードはスコッティ・バーンズ、イマニュエル・クイックリーと並んで両チーム通じてこの日の試合最多得点となり、ラプターズは135-92でブルズに大勝した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "571-edwards-45-points-heat.html",
    cat: "NBA",
    title: "アンソニー・エドワーズ、ヒート戦で45得点 —— ティンバーウルブズが131-106で快勝",
    excerpt: "ミネソタ・ティンバーウルブズのアンソニー・エドワーズは現地時間10月21日、敵地でのマイアミ・ヒート戦に33分出場し、フィールドゴール29本中16本(3ポイント17本中9本)、フリースロー5本中4本を沈めて45得点・10リバウンド・3アシストを記録した。両チーム通じてこの日の試合最多得点者となり、ティンバーウルブズは131-106でヒートを下した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "570-randle-33-points-hornets.html",
    cat: "NBA",
    title: "ジュリアス・ランドル、ホーネッツ戦で33得点 —— ネッツは103-110で敗戦",
    excerpt: "ブルックリン・ネッツのジュリアス・ランドルは現地時間10月21日、本拠地でのシャーロット・ホーネッツ戦に38分出場し、フィールドゴール18本中11本(3ポイント5本中3本)、フリースロー11本中8本を沈めて33得点・7アシスト・8リバウンドを記録した。両チーム通じてこの日の試合最多得点者となったが、ネッツは103-110でホーネッツに敗れた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "569-banchero-35-points-hawks.html",
    cat: "NBA",
    title: "パオロ・バンケロ、ホークス戦で35得点10アシスト —— マジックは125-132で敗戦",
    excerpt: "オーランド・マジックのパオロ・バンケロは現地時間10月21日、アトランタ・ホークス戦に41分出場し、フィールドゴール12本中10本(3ポイント4本中3本)、フリースロー16本中12本を沈めて35得点・10アシスト・7リバウンドを記録した。両チーム通じてこの日の試合最多得点者となったが、マジックは125-132でホークスに敗れた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "568-anthony-davis-34-points-wizards-opener.html",
    cat: "NBA",
    title: "アンソニー・デイビス、バックス戦で34得点 —— ウィザーズが開幕戦を128-116で制す",
    excerpt: "ワシントン・ウィザーズのアンソニー・デイビスは現地時間10月21日、2026-27シーズン開幕戦のミルウォーキー・バックス戦に34分出場し、フィールドゴール20本中11本(3ポイント3本中1本)、フリースロー14本中11本を沈めて34得点を記録した。両チーム通じてこの日の試合最多得点者となり、ウィザーズは128-116でバックスを下して開幕戦を白星で飾った。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "567-adidas-superstar-halloween.html",
    cat: "KICKS",
    title: "adidas Superstar「Halloween」が10月23日発売 —— アンソニー・エドワーズのハロウィン限定カラー",
    excerpt: "アディダスは、ミネソタ・ティンバーウルブズのアンソニー・エドワーズとのコラボモデル「adidas Superstar」の新色「Halloween」(品番KZ9164)を2026年10月23日に発売する。Sneaker Newsが伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "566-mavericks-walter-clayton-two-way.html",
    cat: "NBA",
    title: "ウォルター・クレイトンJr.、マーベリックスとツーウェイ契約で合意 —— グリズリーズでのウェーバー公示から新天地へ",
    excerpt: "ダラス・マーベリックスは、2025年ドラフト全体18位指名のウォルター・クレイトンJr.とツーウェイ契約で合意した。ESPNのシャムズ・シャラニア記者が現地時間10月21日、複数の情報源の話として伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "565-blazers-morant-lillard-backcourt-start.html",
    cat: "NBA",
    title: "ブレイザーズ、開幕からジャ・モラントをデイミアン・リラードとの新バックコートで先発起用 —— ヘインズ記者が報道",
    excerpt: "ポートランド・トレイルブレイザーズは、2026-27シーズンの開幕にあたりジャ・モラントをデイミアン・リラードと組むバックコートで先発起用する。リーグ関係者の情報として、NBA on Primeのクリス・ヘインズ記者が現地時間10月21日に伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "564-magic-richardson-dasilva-options.html",
    cat: "NBA",
    title: "マジック、ジェイス・リチャードソンとトリスタン・ダ・シウバのチームオプションを行使 —— 2人とも2027-28シーズンまで残留確定",
    excerpt: "オーランド・マジックは現地時間10月21日、ガードのジェイス・リチャードソンとフォワードのトリスタン・ダ・シウバについて、ルーキー・スケール契約に基づくチームオプションをそれぞれ行使したと発表した。契約条件は球団方針により非公表で、2人は2027-28シーズンまでマジックでプレーすることが確定した。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "563-adidas-ae3-lucid-pink.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards 3「Lucid Pink」が登場 —— 品番KH8545、エドワーズの新バックコートでの開幕に合わせ新色投入",
    excerpt: "アディダスは、アンソニー・エドワーズの3代目シグネチャーシューズ「Anthony Edwards 3」の新色「Lucid Pink」を発売した。ラメロ・ボールとの新バックコートで臨む今季開幕に合わせたタイミングでの投入で、Sneaker Newsが伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "562-porzingis-trade-exploration-warriors.html",
    cat: "NBA",
    title: "ポルジンギス、トレード市場へ —— ウォリアーズが放出先の模索開始、本人は引退も視野に",
    excerpt: "ゴールデンステート・ウォリアーズは、個人的な健康上の問題で無期限離脱中のクリスタプス・ポルジンギスについて、トレードでの放出先を探り始めた。本人はバスケットボール選手としてのキャリアを終える可能性も真剣に検討しているという。ESPNのシャムズ・シャラニア記者が伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "561-doncic-lakers-ad-championship-run.html",
    cat: "NBA",
    title: "ドンチッチ「特別なチームがある」—— 全面広告でファンへ協力要請、レイカーズが開幕戦へ",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間10月21日、ロサンゼルス・タイムズに全面広告を掲載し「今夜、優勝への道を始める」とファンへ呼びかけた。レギュラーシーズン開幕戦(対ウォリアーズ)を控えてのメッセージで、ESPNが伝えた。",
    date: "2026.10.22",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "560-doncic-lakers-5-questions.html",
    cat: "NBA",
    title: "ルカ・ドンチッチが背負う新時代のレイカーズ、残る5つの疑問 —— ESPNが開幕前夜に総括",
    excerpt: "ESPNは21日（現地時間）、今夏レブロン・ジェームズが76ersへ移籍して迎える新体制のロサンゼルス・レイカーズについて、開幕を前に残る5つの疑問点を総括する特集記事を公開した。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "559-edwards-ball-timberwolves-chemistry.html",
    cat: "NBA",
    title: "アンソニー・エドワーズ×ラメロ・ボール、噛み合う新バックコート —— ESPN特集、ティンバーウルブズが取り戻した「笑顔」",
    excerpt: "ESPNは21日（現地時間）、今夏ラメロ・ボールを獲得したミネソタ・ティンバーウルブズのバックコート改革を特集し、アンソニー・エドワーズとボールの間に新たな連係と「笑顔」が生まれていると伝えている。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "558-egozaru-ego-blaze-low.html",
    cat: "KICKS",
    title: "EGOZARU「EGO BLAZE LOW」が10月22日発売 —— 定番モデルをローカット化、軽量メッシュで足首の可動域アップ",
    excerpt: "バスケットボールブランド「EGOZARU」は、2024年発売の定番モデル「EGO BLAZE」をベースにしたローカットモデル「EGO BLAZE LOW」を2026年10月22日(木)に発売する。アッパーを再構築し、軽量化と足首の可動域向上を図った。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "557-cools-yokohama-bcorsairs-partnership.html",
    cat: "JAPAN",
    title: "Cools、横浜ビー・コルセアーズとオフィシャルパートナー（ゴールド）契約 —— 神奈川の住宅設備専門店が「ヨコハマをバスケの街に」を後押し",
    excerpt: "住宅設備の販売・施工を手がける株式会社Cools(本社:神奈川県平塚市、代表取締役社長:重田淳平)は、B.LEAGUE PREMIER所属のプロバスケットボールチーム「横浜ビー・コルセアーズ」を運営する株式会社横浜ビーコルセアーズ(代表取締役社長:原毅人)と、2026年10月1日よりオフィシャルパートナー(ゴールド)契約を締結したと発表した。",
    date: "2026.10.21",
    thumb: "../assets/journal-557-hero.jpg?v=50b0ed7ef2"
  },
  {
    href: "556-sga-32-points-spurs-opener.html",
    cat: "NBA",
    title: "ギルジャス＝アレクサンダー、スパーズ戦で32得点 —— サンダーが開幕戦を116-104で制す",
    excerpt: "オクラホマシティ・サンダーのシャイ・ギルジャス＝アレクサンダーは現地時間10月20日、2026-27シーズン開幕戦のサンアントニオ・スパーズ戦に36分出場し、フィールドゴール27本中13本(3ポイント7本中3本)、フリースロー4本中3本を沈めて32得点を記録した。両チーム通じてこの日の試合最多得点者となり、サンダーは116-104でスパーズを下して開幕戦を白星で飾った。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "555-maxey-28-points-knicks.html",
    cat: "NBA",
    title: "タイリース・マクシー、ニックス戦で28得点 —— 76ersが優勝バナーの夜に106-100で勝利",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは現地時間10月20日、ニューヨーク・ニックスの優勝バナー掲揚試合に敵地で出場し、40分でフィールドゴール19本中9本(3ポイント9本中2本)、フリースロー9本中8本を沈めて28得点を記録した。両チーム通じてこの日の試合最多得点者となり、76ersは106-100でニックスに勝利した。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "554-pistons-comeback-celtics-opener.html",
    cat: "NBA",
    title: "ピストンズ、22点差の大逆転で開幕戦制す —— セルティックスに121-113、1997-98年以降で最大の逆転劇",
    excerpt: "デトロイト・ピストンズは現地時間10月20日、本拠地でのレギュラーシーズン開幕戦でボストン・セルティックスに121-113で逆転勝利した。3Qには最大22点のビハインドを負ったが、ESPNリサーチによるとプレイ・バイ・プレイの記録が残る1997-98シーズン以降で開幕戦における最大の逆転劇になった。ジェイレン・デューレンが22得点9リバウンド、ケイド・カニングハムが22得点8アシストを記録した。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "552-grizzlies-coward-edey-options.html",
    cat: "NBA",
    title: "グリズリーズ、カワード・エデイの2027-28シーズン・オプションを行使 —— エデイはパデュー時代に歴代2人目の主要個人賞総なめ",
    excerpt: "メンフィス・グリズリーズは現地時間10月20日、ウイングのセドリック・カワードとセンターのザック・エデイについて、ルーキー・スケール契約に基づく2027-28シーズンのチームオプションをそれぞれ行使したと発表した。カワードは2025-26シーズンにオールルーキー1stチームに選出され、エデイはパデュー大時代にビル・ウォルトン以来となる主要個人賞の総なめを果たしている。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "551-pelicans-fears-missi-queen-options.html",
    cat: "NBA",
    title: "ペリカンズ、フィアーズ・ミッシ・クインの3人のオプションを一斉行使 —— クインは昨季唯一のルーキーでトリプルダブル複数回",
    excerpt: "ニューオーリンズ・ペリカンズは現地時間10月20日、ガードのジェレマイア・フィアーズとフォワード/センターのデリック・クインの3年目オプション、センターのイヴ・ミッシの4年目オプションを行使したと発表した。クインは2025-26シーズンに平均11.7得点7.1リバウンドを記録し、ルーキーで複数回のトリプルダブルを達成した22人のNBA選手の1人かつ唯一のルーキーだった。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "550-kobe-6-protro-brunson-ring-night.html",
    cat: "KICKS",
    title: "Nike Kobe 6 Protro「オールゴールド」のブランソンPE —— ニックス優勝リング授与式で着用",
    excerpt: "ニューヨーク・ニックスのジェイレン・ブランソンに、オールゴールドの「Nike Kobe 6 Protro」プレーヤーエクスクルーシブ(PE)が用意された。現地時間10月20日にマディソン・スクエア・ガーデンで行われた優勝リング授与式・バナー掲揚の夜に合わせたもので、チームの優勝記念ユニフォームと色を揃えている。Sneaker Bar Detroit・Sneaker Newsが伝えた。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "549-paul-george-38-points-pistons.html",
    cat: "NBA",
    title: "ポール・ジョージ、ピストンズ戦で38得点 —— セルティックスは113-121で敗戦",
    excerpt: "ボストン・セルティックスのポール・ジョージは現地時間10月20日、デトロイト・ピストンズとのレギュラーシーズン戦に出場し、31分でフィールドゴール21本中12本(3ポイント12本中7本)、フリースロー8本中7本を沈めて38得点を記録した。両チーム通じてこの日の試合最多得点者となったが、セルティックスは113-121でピストンズに敗れた。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "547-bulls-buzelis-essengue-option.html",
    cat: "NBA",
    title: "ブルズ、マタス・ブゼリスとノア・エッセングのチームオプションを行使 —— ブゼリスは2年目で平均16.3得点、エッセングはGリーグで平均23.0得点",
    excerpt: "シカゴ・ブルズは現地時間10月20日、フォワードのマタス・ブゼリスとノア・エッセングについて、ルーキー・スケール契約に基づくチームオプションをそれぞれ行使したと発表した。契約条件は球団方針により非公表。ブゼリスは2025-26シーズンに平均16.3得点5.8リバウンドを記録し、エッセングはGリーグのウィンディ・シティ・ブルズで平均23.0得点をマークしている。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "546-nike-kobe-5-protro-eagles.html",
    cat: "KICKS",
    title: "Nike Kobe 5 Protro「Eagles」が2027年1月発売 —— 品番JF1792-300、コービーが愛したイーグルスを色に",
    excerpt: "ナイキは、「Nike Kobe 5 Protro」の新色「Eagles」(品番JF1792-300)を2027年1月に発売する。Sneaker Bar Detroitが伝え、Sneaker Newsもクローズアップ画像を公開した。フィラデルフィア・イーグルスのファンだったコービー・ブライアントへのトリビュートカラーとなる。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "545-air-jordan-4-deep-royal-blue.html",
    cat: "KICKS",
    title: "Air Jordan 4「Deep Royal Blue」のファーストルックが公開 —— 品番IU4601-400、キッズ限定GS版は2027年春発売",
    excerpt: "ジョーダン ブランドは、「Air Jordan 4」の新色「Deep Royal Blue」(品番IU4601-400)のファーストルック画像を公開した。Sneaker Newsが現地時間10月20日に伝えた。キッズ限定のGS版は2027年春発売が決まっている。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "544-cavaliers-jaylon-tyson-option.html",
    cat: "NBA",
    title: "キャバリアーズ、ジェイロン・タイソンの4年目チームオプションを行使 —— 新人超えの平均13.2得点、2027-28シーズンまで残留確定",
    excerpt: "クリーブランド・キャバリアーズは現地時間10月20日、2024年ドラフト全体20位指名のジェイロン・タイソンについて、ルーキー・スケール契約4年目にあたる2027-28シーズンのチームオプションを行使したと発表した。タイソンは2025-26シーズンに平均13.2得点5.1リバウンドを記録し主要スタッツ全てでキャリアハイをマークしている。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "543-dybantsa-ankle-season-opener.html",
    cat: "NBA",
    title: "ウィザーズ1位指名ダイバンツァ、開幕戦を欠場 —— 左足首ねんざでプレシーズン終盤に負傷",
    excerpt: "ワシントン・ウィザーズは現地時間10月21日、2026年ドラフト全体1位指名のAJ・ダイバンツァが左足首の負傷で開幕戦を欠場すると発表した。プレシーズン最終戦で負傷しブライアン・キーフHCが明らかにした。ESPNが報じた。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "542-spurs-wembanyama-finals-return.html",
    cat: "NBA",
    title: "スパーズ、ファイナル敗退の悔しさを糧に —— ウェンバンヤマ「保証されたものは何もない」で迎える新シーズン",
    excerpt: "サンアントニオ・スパーズは現地時間10月21日、ファイナルで敗れたニューヨーク・ニックスの優勝から新シーズンを迎える。ヴィクター・ウェンバンヤマは「保証されたものは何もない」と語り、チームは3ガード体制の深化や新加入のトバイアス・ハリスを軸に再挑戦する。ESPNのマイケル・C・ライト記者が特集した。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "541-knicks-championship-offseason-recap.html",
    cat: "NBA",
    title: "ニックス、53年ぶり優勝のオフシーズンを満喫 —— 悲願のパレード、タウンズ結婚、ブランソンのSNL出演まで",
    excerpt: "ニューヨーク・ニックスは2026年、球団史上3度目・53年ぶりとなるNBA優勝を果たした直後のオフシーズンを、記憶に残る形で過ごした。悲願の初ティッカーテープパレード、カール=アンソニー・タウンズの結婚、ジェイレン・ブランソンの「サタデー・ナイト・ライブ」出演まで、ESPNが特集記事で振り返った。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "540-nba-2026-27-season-preview-rankings.html",
    cat: "NBA",
    title: "サンダーが開幕前評価で2年連続トップ —— ESPN「シーズンプレビュー」30チーム格付け、レブロン&ブラウン加入の76ersは4位",
    excerpt: "ESPNは現地時間10月19日、2026-27シーズン開幕直前の30チーム展望企画「シーズンプレビュー」を公開した。NBA担当記者・アナリスト陣の格付けでオクラホマシティ・サンダーが2年連続の総合1位、ファイナルで敗れたサンアントニオ・スパーズが2位、優勝したニューヨーク・ニックスは3位。レブロン・ジェームズとジェイレン・ブラウンが加入したフィラデルフィア・76ersは4位となった。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "539-nba-europe-tatum-2027-launch.html",
    cat: "NBA",
    title: "NBA副コミッショナー、「2027年10月開幕は変えない」—— ユーロリーグ抜きでも欧州進出路線を明言",
    excerpt: "NBAのマーク・テイタム副コミッショナーが20日、2027年10月開幕予定の新リーグ「NBAヨーロッパ」の計画に変更はないと明言。ユーロリーグが統合提案を拒否した後も、史上最大規模という欧州投資方針を示した。",
    date: "2026.10.21",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "553-yokohama-excellence-bleague-one-2027-28.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、2027-28シーズンもB.LEAGUE ONE参入決定 —— B.ONE仮入会基準を充足",
    excerpt: "横浜エクセレンスは、公益社団法人ジャパン・プロフェッショナル・バスケットボールリーグ(B.LEAGUE)から2027-28シーズンのクラブライセンス判定結果を受け、「B.NEXT」ライセンス交付のうえB.ONE仮入会基準を充足していることが認められ、2027-28シーズンもB.LEAGUE ONE参入が決定した。クラブは2030-31シーズンのB.LEAGUE PREMIER参入を目標に掲げている。",
    date: "2026.10.20",
    thumb: "../assets/journal-553-hero.jpg?v=698416c6e3"
  },
  {
    href: "538-landry-shamet-serious-player-only.html",
    cat: "KICKS",
    title: "NBAガードのランドリー・シャメット、新興ブランド「Serious Player Only」とシューズ契約",
    excerpt: "NBAガードのランドリー・シャメット(Landry Shamet)は、複数のシューズブランドを試した末に、新興ブランド「Serious Player Only」と複数年契約を結んだ。取り外し可能なインソールでクッションの量を調整できる点を評価しているという。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "537-kobe-3-low-protro-jalen-brunson-pe.html",
    cat: "KICKS",
    title: "Nike Kobe 3 Low Protro「Jalen Brunson」PEが発売 —— ニックス優勝リング授与・バナー掲揚の夜にフットロッカー「Rings-N-Things」で",
    excerpt: "ナイキは、ニューヨーク・ニックスのジェイレン・ブランソン(Jalen Brunson)によるプレーヤーエクスクルーシブ「Kobe 3 Low Protro」を、ニックスの優勝リング授与式とバナー掲揚に合わせ、現地時間10月20日にフットロッカーのポップアップ「Rings-N-Things」で発売した。Sneaker Newsが伝えた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "536-lebron-msg-legacy-76ers-opener.html",
    cat: "NBA",
    title: "レブロン、76ers移籍後初のMSGへ —— ニックス優勝バナーの夜、キャリア通算28勝11敗の「聖地」で新章",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズ(LeBron James)は現地時間10月20日、ニューヨーク・ニックスの優勝バナー掲揚試合でマディソン・スクエア・ガーデンに登場する。プレーオフを含め同アリーナで通算28勝11敗、平均28得点7リバウンド7アシストを記録してきたジェームズにとって、76ers移籍後初めてとなるバスケの聖地でのプレーだ。ESPNのブライアン・ウィンドホースト記者が分析した。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "535-nike-kobe-dunk-low-protro-mamba-eterno.html",
    cat: "KICKS",
    title: "Nike Kobe Dunk Low Protro「Mamba Eterno」が10月30日発売 —— 品番IQ3922-001、Air Force 1 Lowも同コレクションに合流",
    excerpt: "ナイキは、コービー・ブライアント(Kobe Bryant)のシグネチャーライン「Mamba Eterno」コレクションに「Kobe Dunk Low Protro」(品番IQ3922-001)と「Air Force 1 Low」の新色を追加し、いずれも2026年10月30日に発売する。Hypebeastとsneaker Filesが現地時間10月20日に伝えた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "534-gunma-crane-thunders-bpremier-license-2028.html",
    cat: "JAPAN",
    title: "群馬クレインサンダーズ、2028-29シーズンの「B.PREMIERライセンス」交付が決定 —— B.LEAGUE理事会で判定",
    excerpt: "群馬クレインサンダーズは10月20日、B.LEAGUE理事会において2028-29シーズンの「B.PREMIERライセンス」交付が決定したと発表した。B.PREMIER初年度の今季に続き、最上位ディビジョンでの地位を2年先まで確保した形だ。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "533-jaden-mcdaniels-timberwolves-extension.html",
    cat: "NBA",
    title: "ティンバーウルブズ、ジェイデン・マクダニエルズと1年4000万ドルの契約延長に合意 —— 2029-30シーズンまで確保",
    excerpt: "ミネソタ・ティンバーウルブズはフォワードのジェイデン・マクダニエルズと1年4000万ドルの契約延長に合意した。ESPNのシャムズ・シャラニア記者が、代理人のニマ・ナマキアン氏（イノベート・スポーツ）とビル・ダフィー氏（WMEバスケットボール）の話として伝えた。契約は2029-30シーズンまで。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "532-bucks-waive-kevin-porter-jr.html",
    cat: "NBA",
    title: "バックス、ケビン・ポーター・ジュニアをウェーバー公示 —— 昨季17.4得点7.4アシストも、ロースター確定の期限に散る",
    excerpt: "ミルウォーキー・バックスは現地時間10月19日、ガードのケビン・ポーター・ジュニアをウェーバー公示した。ESPNのシャムズ・シャラニア記者が伝えた。ポーターは昨季38試合(36先発)で平均17.4得点7.4アシスト5.2リバウンドを記録していたが、保証契約15人枠の期限に合わせてロースターから外れた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "531-paul-george-celtics-offense.html",
    cat: "NBA",
    title: "ポール・ジョージ「美しい挑戦」—— 17年目の今季、セルティックスで初めて経験する“ノーセットプレー”のオフェンス",
    excerpt: "ボストン・セルティックスのポール・ジョージは、ジョー・マズーラHCが仕掛ける自由度の高いオフェンスへの適応を「美しい挑戦」と表現した。16シーズンを経て6度のオールNBAに選ばれてきたベテランウイングが、17年目にして初めてセルティックスのユニフォームで開幕を迎える。プレシーズン2試合では計7スティールを記録し、守備面でも存在感を示している。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "530-76ers-vj-edgecombe-option.html",
    cat: "NBA",
    title: "76ers、VJ・エッジコムの3年目オプションを行使 —— 全会一致のオールルーキー1位、2027-28シーズンも残留確定",
    excerpt: "フィラデルフィア・76ersは現地時間10月19日、2025年ドラフト全体3位指名のVJ・エッジコムについて、ルーキー・スケール契約3年目(2027-28シーズン)のチームオプションを行使したと発表した。エッジコムは新人シーズンに平均16.0得点、新人トップのスティール107本を記録し、全会一致でNBAオールルーキー1位チームに選ばれている。",
    date: "2026.10.20",
    thumb: "../assets/journal-530-hero.jpg?v=32652893ea"
  },
  {
    href: "529-lakers-waive-dalton-knecht.html",
    cat: "NBA",
    title: "レイカーズ、ダルトン・クネクトをウェーバー公示 —— 2024年ドラフト17位指名、ロースター15人枠の期限に散る",
    excerpt: "ロサンゼルス・レイカーズは現地時間10月19日、2024年ドラフト全体17位指名のダルトン・クネクトをウェーバー公示した。保証契約15人枠の期限に合わせた措置で、ビッグマン獲得を狙った2対1トレードも土壇場でまとまらなかった。ルーキーイヤーに見せた一時の好調を2年目以降は再現できず、今季のプレシーズンも低調な内容に終わっていた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "528-grizzlies-waive-clayton-peavy.html",
    cat: "NBA",
    title: "グリズリーズ、ウォルター・クレイトンJr.とマイカ・ピービーをウェーバー公示 —— ロースター確定の期限で2選手に幕",
    excerpt: "メンフィス・グリズリーズは現地時間10月19日、2025年ドラフト全体18位のウォルター・クレイトンJr.とマイカ・ピービーをウェーバー公示した。ESPNのシャムズ・シャラニア記者が伝えた。レギュラーシーズンのロースター確定期限に合わせた措置で、保証契約16人・2ウェイ3人の体制に整えた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "527-brandon-miller-hornets-extension.html",
    cat: "NBA",
    title: "ブランドン・ミラー、ホーネッツと5年2億900万ドルの契約延長に合意 —— キャリア最高の20.2得点を経て新体制の核に",
    excerpt: "シャーロット・ホーネッツのブランドン・ミラーが、5年総額2億900万ドルのルーキー・スケール契約延長に合意した。ESPNのシャムズ・シャラニア記者が、代理人のAJ・ヴェイナーチャック氏とジョーイ・ミドルトン氏(ヴェイナースポーツ)の話として伝えた。ミラーは昨季平均20.2得点のキャリアハイを記録し、LaMelo Ball・マイルス・ブリッジズが去ったホーネッツで一段と大きな役割を担うシーズンになる。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "526-curry-ankle-season-opener-lakers.html",
    cat: "NBA",
    title: "カリー、右足首痛めるも開幕のレイカーズ戦出場へ —— ムーディー・バトラーも離脱中のウォリアーズ",
    excerpt: "ゴールデンステイト・ウォリアーズは現地時間10月19日、前日のオープンスクリメージで右足首を痛めたステフィン・カリーについて、今週水曜のロサンゼルス・レイカーズ戦（開幕戦）への出場が見込まれると伝えた。モーゼス・ムーディーとジミー・バトラーが離脱中、クリスタプス・ポルジンギスも無期限離脱と、開幕前から主力の負傷が相次いでいる。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "525-mavericks-waive-dwight-powell.html",
    cat: "NBA",
    title: "マブス、ドワイト・パウエルをウェーバー公示 —— ロンド獲得トレードから12年、在籍最長級の選手に幕",
    excerpt: "ダラス・マーベリックスは現地時間10月19日、センターのドワイト・パウエルをウェーバー公示した。2014年12月のトレードで加入してから12年、通算768試合のうち763試合をマーベリックスでプレーしたチーム在籍最長級の選手が去ることになる。今季はキャンプ招待から13年目に手が届きかけたが、保有契約数の都合で実らなかった。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "524-durant-ishbia-suns-tenure-feud.html",
    cat: "NBA",
    title: "デュラント「俺のせいにするのか」—— サンズ時代の総括めぐりイシュビア会長と舌戦",
    excerpt: "ヒューストン・ロケッツのケビン・デュラントは17日(現地時間)、フェニックス・サンズ在籍時代の総括をめぐり、サンズのオーナー、マット・イシュビアとSNS上で言い合いになった。イシュビアがCNBC Sportの番組でデュラント獲得を「学び」と振り返ったことに対し、デュラントは「#blameKD」とXで反論。イシュビアも「責めてはいない」と応じた。",
    date: "2026.10.20",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "523-air-force-1-nightmare.html",
    cat: "KICKS",
    title: "Nike Air Force 1 '01「Nightmare」が登場 —— ブラックにジムレッドを効かせたハロウィン仕様の新色",
    excerpt: "ナイキは、「Air Force 1 '01」の新色「Nightmare」を発表した。ブラックレザーのアッパーに並ぶピンの間からジムレッドのディテールが覗く配色で、ミッドソール・アウトソールもブラックで統一している。発売日・価格は本稿執筆時点で明らかになっていない。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.10.19",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "522-air-jordan-12-fireside.html",
    cat: "KICKS",
    title: "Air Jordan 12「Fireside」が登場 —— ライトオールウッドブラウンにカカオワオを効かせた新色、品番CT8013-105",
    excerpt: "ジョーダン ブランドは、「Air Jordan 12」の新色「Fireside」を発表した。ライトオールウッドブラウンのアッパーにカカオワオのオーバーレイを合わせ、放射状のステッチでオリジナルモデルのブザービーターを想起させるディテールを加えている。品番はCT8013-105（Nice Kicksが確認）で、2026年10月発売。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.10.19",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "521-joshu-rydeen-home-game-physioflex.html",
    cat: "JAPAN",
    title: "JOSHU RYDEEN、11月7日に群馬県太田市でホームゲームを開催 —— 女子3x3の熱戦に車いすバスケ体験も",
    excerpt: "群馬県太田市を拠点とする女子3x3バスケットボールチーム「JOSHU RYDEEN(上州ライディーン)」は、2026年11月7日(土)、太田市運動公園市民体育館で開催される「TOMOEYA Presents RBL WOMEN AUTUMN TOUR -PHYSIOFLEX GAME-」にホストチームとして出場する。当日は一般社団法人ぐんま車いすスポーツによる車いすバスケットボール体験・エキシビションゲームや、「リトル清原ものまね野球団」によるスペシャルショーも実施される。入場無料。",
    date: "2026.10.19",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "520-cason-wallace-thunder-extension.html",
    cat: "NBA",
    title: "サンダー、ケイソン・ウォーレスと5年1億3900万ドルの契約延長に合意 —— ルーキー延長期限の前日に決着",
    excerpt: "オクラホマシティ・サンダーは、オールディフェンス経験を持つガードのケイソン・ウォーレスと5年1億3900万ドルのルーキー契約延長に合意した。ESPNのシャムズ・シャラニア記者が現地時間10月18日、代理人の話として伝えた。合意はルーキー延長の申請期限(現地時間10月19日午後6時)の前日というタイミングになった。",
    date: "2026.10.19",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "519-yokohama-excellence-gifu-sweep.html",
    cat: "JAPAN",
    title: "横浜エクセレンス、岐阜スゥープスに連勝 —— B.LEAGUE ONE第5節、長谷川比源がタラ負傷離脱の穴を埋める",
    excerpt: "横浜エクセレンスはB.LEAGUE ONE 2026-27シーズン第5節のホーム開幕節で岐阜スゥープスと対戦し、96-86、111-67で連勝した。クーリバリ セリンムルタラが負傷離脱する中、横浜出身の長谷川比源がBリーグ入り2回目のダブルダブルで穴を埋めた。次回ホームは10月31日・11月1日の新潟アルビレックスBB戦。",
    date: "2026.10.18",
    thumb: "../assets/journal-519-hero.jpg?v=78387e9fef"
  },
  {
    href: "518-oso-ighodaro-suns-extension.html",
    cat: "NBA",
    title: "サンズ、オソ・イゴダロと3年2900万ドルの契約延長に合意 —— 2030-31シーズンまで確保",
    excerpt: "フェニックス・サンズはセンターのオソ・イゴダロと3年2900万ドルの契約延長に合意した。ESPNのシャムズ・シャラニア記者が、代理人のエリカ・ルイス氏（プリメラ・スポーツ）の話として伝えた。契約は2030-31シーズンまで。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "517-ben-simmons-torn-achilles-kings.html",
    cat: "NBA",
    title: "ベン・シモンズがアキレス腱を断裂 —— 今季絶望、キングスでの復帰は開幕直前に絶たれる",
    excerpt: "サクラメント・キングスのベン・シモンズが現地時間10月18日の練習中にアキレス腱を断裂したとみられ、今季絶望的であることが分かった。ESPNが複数の関係者の話として伝えた。シモンズは2024-25シーズン以来のレギュラーシーズン出場を目指し、今夏キングスと1年350万ドルで契約していた。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "516-jazz-claim-tony-bradley-waivers.html",
    cat: "NBA",
    title: "ジャズがトニー・ブラッドリーをウェーバー公示から獲得 —— 2017年ドラフト28位指名球団に復帰",
    excerpt: "ユタ・ジャズはセンターのトニー・ブラッドリーをウェーバー公示から獲得した。ESPNのシャムズ・シャラニア記者によれば、ブラッドリーは2017年のNBAドラフトでジャズから全体28位指名を受け、キャリア最初の3シーズンを過ごした球団への復帰となる。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "515-devin-carter-celtics-two-way.html",
    cat: "NBA",
    title: "セルティックスがデビン・カーターをツーウェイ契約に転換 —— 昨季キングスで新人シーズンを戦った23歳",
    excerpt: "ボストン・セルティックスはガードのデビン・カーターをツーウェイ契約に転換した。HoopsHypeのマイケル・スコット記者によれば、カーターは昨季サクラメント・キングスで38試合に出場し、平均8.9得点3.3リバウンド2.7アシストを記録していた。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "514-spurs-team-options-castle-harper-bryant.html",
    cat: "NBA",
    title: "スパーズがキャッスル・ハーパー・ブライアントのチームオプションを行使 —— 3選手を2027-28シーズンまで確保",
    excerpt: "サンアントニオ・スパーズはステフォン・キャッスル、ディラン・ハーパー、カーター・ブライアントの3選手について、2027-28シーズンのチームオプションを行使した。契約額はキャッスルが1267万ドル、ハーパーが1361万ドル、ブライアントが539万ドル。HoopsHypeのマイケル・スコット記者が伝えた。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "513-knicks-waive-bruce-brown-wiseman-roster.html",
    cat: "NBA",
    title: "ニックスがブルース・ブラウンをウェーバー —— ジェームズ・ワイズマンはバックアップセンターで開幕ロースター入りへ",
    excerpt: "ニューヨーク・ニックスはブルース・ブラウンをウェーバー公示にかけた。ESPNのシャムズ・シャラニア記者によれば、センターのジェームズ・ワイズマンはバックアップとして開幕のレギュラーシーズン・ロースターに入る見通しだという。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "512-tacko-fall-76ers-two-way.html",
    cat: "NBA",
    title: "ターコ・フォール、76ersとツーウェイ契約に合意 —— フロントコート陣の負傷相次ぎ、キャンプ契約から昇格",
    excerpt: "フィラデルフィア・76ersは現地時間10月17日、センターのターコ・フォール(身長231cm/7フィート6インチ)をツーウェイ契約に転換したと発表した。先月のエキシビット10契約(キャンプ契約)からの昇格で、フロントコート陣の負傷が相次いだことが背景にある。",
    date: "2026.10.18",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "511-air-jordan-14-forest-green.html",
    cat: "KICKS",
    title: "Air Jordan 14「Forest Green」が10月31日発売 —— 品番487471-300、価格215ドル",
    excerpt: "ジョーダン ブランドは「Air Jordan 14」の新色「Forest Green」(品番487471-300)を2026年10月31日に発売する。価格は215ドル(米国価格)で、SNKRSおよび一部リテイラーで販売される。Nice Kicksが伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "510-nike-air-force-1-low-lace-metallic-gold.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low「Lace Metallic Gold」が2026年秋発売 —— レザーをウーブン素材に変えたウィメンズ仕様、品番IX7038-121",
    excerpt: "ナイキは「Air Force 1 Low」の新色「Lace Metallic Gold」(品番IX7038-121、価格120ドル)を2026年秋に発売する。定番のオールレザー仕様から一転、サイドパネルにテクスチャードファブリックを採用し、ゴールドレザーのアクセントとフローラルレース装飾を加えたウィメンズモデル。Hypebeastが公式画像を伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "509-murray-21-points-lakers-preseason.html",
    cat: "NBA",
    title: "ジャマール・マレー、レイカーズ戦で21得点 —— プレシーズンでナゲッツが121-106で快勝",
    excerpt: "デンバー・ナゲッツのジャマール・マレーは現地時間10月16日、プレシーズンのロサンゼルス・レイカーズ戦に出場し、31分の出場でフィールドゴール15本中8本、フリースロー5本中5本を沈めて21得点6アシストを記録し、両チーム通じてこの日の試合最多得点者となった。ナゲッツは121-106でレイカーズに快勝した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "508-lebron-76ers-home-debut-chemistry.html",
    cat: "NBA",
    title: "レブロン「まだ完璧じゃない」—— 満員のホームデビューで76ersが連携を模索",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズは現地時間10月16日、プレシーズン最終戦のボストン・セルティックス戦(延長の末120-125で敗戦)で満員1万9746人の本拠地デビューを飾り、タイリース・マクシーからのロブパスを叩き込むダンクで会場を沸かせた。試合後は「まだ完璧じゃない」と連携構築の途中であることを語り、ジョエル・エンビードも新布陣について「誰も一歩下がる必要はない」と話した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "507-markkanen-19-points-suns-preseason.html",
    cat: "NBA",
    title: "ラウリ・マルカネン、サンズ戦で19得点 —— プレシーズンでジャズが119-116の接戦を制す",
    excerpt: "ユタ・ジャズのラウリ・マルカネンは現地時間10月16日、プレシーズンのフィニックス・サンズ戦に出場し、27分の出場でフィールドゴール12本中5本、フリースロー6本中6本を沈めて19得点5リバウンドを記録し、両チーム通じてこの日の試合最多得点者となった。ジャズは119-116でサンズとの接戦を制した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "506-lillard-23-points-warriors-preseason.html",
    cat: "NBA",
    title: "デイミアン・リラード、ウォリアーズ戦で23得点 —— プレシーズンでトレイルブレイザーズが118-128で敗戦",
    excerpt: "ポートランド・トレイルブレイザーズのデイミアン・リラードは現地時間10月16日、プレシーズンのゴールデンステート・ウォリアーズ戦に出場し、26分の出場でフィールドゴール10本中4本、フリースロー13本中13本を沈めて23得点3アシストを記録し、両チーム通じてこの日の試合最多得点者となった。トレイルブレイザーズは118-128でウォリアーズに敗れた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "505-bey-19-points-wizards-preseason.html",
    cat: "NBA",
    title: "サディック・ベイ、ウィザーズ戦で19得点 —— プレシーズンでペリカンズが107-106の接戦を制す",
    excerpt: "ニューオーリンズ・ペリカンズのサディック・ベイは現地時間10月16日、プレシーズンのワシントン・ウィザーズ戦に出場し、17分でフィールドゴール11本中7本、3ポイント5本中3本を沈めて19得点6リバウンドを記録し、両チーム通じてこの日の試合最多得点者となった。ペリカンズは107-106でウィザーズを下した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "504-boozer-19-points-hornets-preseason.html",
    cat: "NBA",
    title: "キャメロン・ブーザー、ホーネッツ戦で19得点 —— プレシーズンでグリズリーズが117-98で快勝",
    excerpt: "メンフィス・グリズリーズのキャメロン・ブーザーは現地時間10月16日、プレシーズンのシャーロット・ホーネッツ戦に出場し、29分でフィールドゴール13本中4本、フリースロー10本中9本を沈めて19得点7リバウンドを記録し、両チーム通じてこの日の試合最多得点者の1人となった。グリズリーズは117-98でホーネッツに快勝した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "503-steinbach-19-points-grizzlies-preseason.html",
    cat: "NBA",
    title: "ハンネス・スタインバック、グリズリーズ戦で19得点10リバウンド —— プレシーズンでホーネッツが98-117で敗戦",
    excerpt: "シャーロット・ホーネッツのハンネス・スタインバックは現地時間10月16日、プレシーズンのメンフィス・グリズリーズ戦に出場し、28分でフィールドゴール9本中7本、フリースロー5本中5本を沈めて19得点10リバウンドを記録し、両チーム通じてこの日の試合最多得点者の1人となった。ホーネッツは98-117でグリズリーズに敗れた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "502-lavine-20-points-spurs-preseason.html",
    cat: "NBA",
    title: "ザック・ラビーン、スパーズ戦で20得点 —— プレシーズンでキングスが97-126で大敗",
    excerpt: "サクラメント・キングスのザック・ラビーンは現地時間10月16日、プレシーズンのサンアントニオ・スパーズ戦に出場し、30分でフィールドゴール12本中6本、フリースロー7本中7本を沈めて20得点を記録し、両チーム通じてこの日の試合最多得点者となった。キングスは97-126でスパーズに大敗した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "501-evans-21-points-bulls-preseason.html",
    cat: "NBA",
    title: "アイザイア・エバンス、ブルズ戦で21得点 —— プレシーズンでティンバーウルブズが116-133で敗戦",
    excerpt: "ミネソタ・ティンバーウルブズのアイザイア・エバンスは現地時間10月16日、プレシーズンのシカゴ・ブルズ戦に出場し、30分でフィールドゴール13本中6本、3ポイント10本中5本を沈めて21得点を記録し、両チーム通じてこの日の試合最多得点者となった。ティンバーウルブズは116-133でブルズに敗れた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "500-flagg-26-points-hawks-preseason.html",
    cat: "NBA",
    title: "クーパー・フラッグ、ホークス戦で26得点12リバウンド —— プレシーズンでマーベリックスが111-135で敗戦",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグは現地時間10月16日、プレシーズンのアトランタ・ホークス戦に出場し、30分でフィールドゴール20本中8本、3ポイント6本中2本を沈めて26得点12リバウンド4アシストを記録し、両チーム通じてこの日の試合最多得点者となった。マーベリックスは111-135でホークスに敗れた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "499-malachi-smith-24-points-pistons-preseason.html",
    cat: "NBA",
    title: "マラカイ・スミス、ピストンズ戦で24得点 —— プレシーズンでラプターズが125-129で敗戦",
    excerpt: "トロント・ラプターズのマラカイ・スミスは現地時間10月16日、プレシーズンのデトロイト・ピストンズ戦に出場し、33分でフィールドゴール17本中8本、3ポイント7本中4本を沈めて24得点7リバウンド3アシストを記録し、両チーム通じてこの日の試合最多得点者となった。ラプターズは125-129でピストンズに敗れた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "498-embiid-27-points-celtics-preseason.html",
    cat: "NBA",
    title: "ジョエル・エンビード、セルティックス戦で27得点 —— プレシーズンで76ersがOTの末120-125で敗戦",
    excerpt: "フィラデルフィア・セブンティシクサーズのジョエル・エンビードは現地時間10月16日、プレシーズンのボストン・セルティックス戦に先発し、29分の出場でフィールドゴール13本中7本、フリースロー13本中11本を沈めて27得点8リバウンド5アシストを記録し、両チーム通じてこの日の試合最多得点者となった。76ersは延長戦の末120-125でセルティックスに敗れた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "497-herro-25-points-pacers-preseason.html",
    cat: "NBA",
    title: "タイラー・ヒーロー、ペイサーズ戦で25得点 —— プレシーズンでバックスが128-127の接戦を制す",
    excerpt: "ミルウォーキー・バックスのタイラー・ヒーローが、プレシーズンのインディアナ・ペイサーズ戦で24分の出場で25得点を記録した。両チーム通じての最多得点者となり、バックスは128-127の接戦を制した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "496-nuggets-strawther-knee-sprain.html",
    cat: "NBA",
    title: "ナゲッツのストローザー、左膝を負傷 —— プレシーズンのクリッパーズ戦で、6週間後に再評価",
    excerpt: "デンバー・ナゲッツのジュリアン・ストローザーが、現地時間10月14日に行われたLAクリッパーズとのプレシーズンの試合中に左膝を負傷し、6週間後に再評価されることになった。ナゲッツは当面、このガード/フォワードを欠くことになる。ESPNが伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "495-banchero-24-points-heat-preseason.html",
    cat: "NBA",
    title: "パオロ・バンケロ、ヒート戦で24得点 —— プレシーズンでマジックが136-115で快勝",
    excerpt: "オーランド・マジックのパオロ・バンケロは現地時間10月16日、プレシーズンのマイアミ・ヒート戦に先発し、27分の出場でフィールドゴール11本中5本、フリースロー16本中13本を沈めて24得点7リバウンド4アシストを記録し、両チーム通じてこの日の試合最多得点者となった。マジックは136-115でヒートに快勝した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "494-cliff-hagan-dies-94.html",
    cat: "NBA",
    title: "クリフ・ハーガン氏が94歳で死去 —— ビル・ラッセル指名権との伝説のトレード、1958年王者の殿堂入りフォワード",
    excerpt: "バスケットボール殿堂入りのクリフ・ハーガン氏が94歳で死去した。セントルイス・ホークス一筋のオールスターで、1956年にビル・ラッセルの指名権と引き換えにセルティックスからトレードされ、1958年のNBA王座に貢献した。ケンタッキー大学が現地時間10月16日に発表した。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "493-cam-christie-clippers-two-way.html",
    cat: "NBA",
    title: "キャム・クリスティー、ウェーバー通過後にクリッパーズへ復帰 —— ツーウェイ契約で合意、Shams Charania記者が一報",
    excerpt: "ガードのキャム・クリスティーが、ウェーバー公示を通過したうえでロサンゼルス・クリッパーズに復帰する。ツーウェイ契約での合意という。ESPNのシャムズ・シャラニア記者が現地時間10月16日、複数の情報源の話として伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "492-nike-gt-cut-4-wemby-halloween.html",
    cat: "KICKS",
    title: "Nike Zoom GT Cut 4「Alien」がヴィクター・ウェンバヤマ仕様に —— ハロウィン企画の一足、品番IX5395-300",
    excerpt: "ナイキは、ヴィクター・ウェンバヤマ（スパーズ）が着用する「Nike Zoom GT Cut 4」に、自身のニックネーム「エイリアン」をテーマにしたハロウィン仕様の新色「Alien」（品番IX5395-300）を投入する。ナイキ バスケットボール所属選手を横断するハロウィン企画の一足。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "491-air-jordan-12-unc-pe.html",
    cat: "KICKS",
    title: "Air Jordan 12 PE「UNC」にデニム仕立ての新色 —— マイケル・ジョーダンの母校仕様、大学バスケPEシーズン開幕の一足",
    excerpt: "ノースカロライナ大学（UNC）バスケットボール部に、デニム素材を使った「Air Jordan 12」のプレーヤーエクスクルーシブ（PE）が用意された。Sneaker Newsによると、2026-27シーズンの大学バスケPE展開の開幕を飾る一足という。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "490-hornets-waive-pat-connaughton.html",
    cat: "NBA",
    title: "ホーネッツ、ベテランのパット・コナートンを解雇 —— 開幕前のロースター整理、Shams Charania記者が一報",
    excerpt: "シャーロット・ホーネッツが、ベテランのパット・コナートンを解雇する。ESPNのシャムズ・シャラニア記者が10月16日(現地時間)、複数の情報源の話として伝えた。レギュラーシーズン開幕を控えたロースター整理の一環とみられる。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "489-nike-ja-4-high-zombie.html",
    cat: "KICKS",
    title: "Nike Ja 4 High「Zombie」が10月31日発売 —— ジャ・モラント初のハイトップ仕様、品番IQ3864-600",
    excerpt: "ナイキは、ジャ・モラントのシグネチャーモデル「Nike Ja 4」の初のハイトップ仕様「Ja 4 High」を発表した。ハロウィン仕様の新色「Zombie」（品番IQ3864-600）で10月31日に発売予定。Sneaker Newsが公式画像を、Sneaker Bar Detroitが発売日を伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "488-nike-lebron-24-storm-drain-halloween.html",
    cat: "KICKS",
    title: "Nike LeBron 24「Storm Drain」はレブロン本人のペニーワイズ仮装がモチーフ —— ナイキ バスケ版ハロウィンコレクション、品番IX5103-001",
    excerpt: "ナイキは、レブロン・ジェームズのシグネチャーモデル「LeBron 24」の新色「Storm Drain」（品番IX5103-001）を発表した。10人のナイキ バスケットボール所属選手それぞれにハロウィン仕様の新色とお揃いのマスクを展開する企画の一足で、レブロン本人が過去に扮したペニーワイズの仮装がモチーフ。Sneaker Newsが公式画像を伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "487-nba-docomo-dazn-launch.html",
    cat: "NBA",
    title: "「NBA docomo」、DAZN経由でも視聴可能に —— シーズンプラン16,500円・月間2,728円、レギュラーシーズン400試合を日本語実況で配信",
    excerpt: "NTTドコモは16日、映像配信サービス「NBA docomo」を「DAZN」上でも加入・視聴できるようにした。シーズンプラン16,500円(税込)・月間プラン2,728円(税込)の2プランで、NBA2026-27シーズンのレギュラーシーズン400試合を日本語実況・解説付きで配信。レイカーズ・ウォリアーズ・サンダー・スパーズ・クリッパーズの5チームを中心に編成する。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "486-nba-seattle-expansion-mexico-city-leverage.html",
    cat: "NBA",
    title: "NBA拡張、シアトル復帰は「ロック」ではなくなった —— シルバー委員長がメキシコシティ案で揺さぶり、ウィンダーホースト記者が内幕",
    excerpt: "NBAのアダム・シルバー委員長が、シアトル・スーパーソニックス復帰をめぐる駆け引きで揺さぶりを強めている。先月のガバナーズ会議で球団代表者らはシアトルの拡張チームが「確定事項ではない」との印象を受け、メキシコシティ案も再び持ち出されたという。ESPNのブライアン・ウィンダーホースト記者が16日(現地時間)、オフィシャルの動きを特集記事で伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "485-thunder-aday-mara-eligibility.html",
    cat: "NBA",
    title: "サンダー、ルーキー大型選手アデイ・マーラの出場資格に「問題ない」—— 元所属スペイン・バスケット・サラゴサは契約継続を主張",
    excerpt: "オクラホマシティ・サンダーは、ルーキーの大型選手アデイ・マーラについてNBA出場資格に問題はないとの立場を球団声明で示した。マーク・スタイン記者(The Stein Line)が16日(現地時間)、元所属のスペイン・バスケット・サラゴサが契約継続を主張しクリアランス問題が浮上していることを伝えた。",
    date: "2026.10.17",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "484-bambitious-nara-kamimaki-basketball-class.html",
    cat: "JAPAN",
    title: "バンビシャス奈良、上牧町スポーツフェスティバルでバスケットボール教室 —— 元澤誠ら4選手がコーチ、小学生にシュート・ドリブル指導",
    excerpt: "B.LEAGUE所属のバンビシャス奈良は、10月11日に奈良県上牧町で開催された「上牧町スポーツフェスティバル」内で、同町在住・在学の小学生を対象としたバスケットボール教室を実施した。元澤誠・坂口竜也・イデムディア オサセレ・間山柊の4選手がコーチを務め、ロート製薬の企業版ふるさと納税による寄附金を活用し上牧町が主催した。",
    date: "2026.10.16",
    thumb: "../assets/journal-484-hero.jpg?v=f2574dc453"
  },
  {
    href: "483-akita-happinets-vpoint-partner.html",
    cat: "JAPAN",
    title: "Vポイントマーケティング、秋田ノーザンハピネッツとオフィシャルパートナー契約 —— ホームゲーム限定グッズやマスコット「ビッキー」のVキセカエも",
    excerpt: "Vポイントマーケティング株式会社は、B.LEAGUE所属のプロバスケットボールクラブ「秋田ノーザンハピネッツ」を運営する秋田ノーザンハピネッツ株式会社とオフィシャルパートナー契約を締結したと発表した。2026-27シーズンはホームゲームでのVポイント限定グッズ交換や、マスコット「ビッキー」デザインのVキセカエを展開する。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "482-magic-anthony-black-extension-deadline.html",
    cat: "NBA",
    title: "マジックのアンソニー・ブラック、契約延長交渉は19日が期限 —— ぜいたく税で手詰まり、決裂ならトレード市場の注目株に",
    excerpt: "オーランド・マジックは、昨季ブレイクアウトを果たしたガードのアンソニー・ブラックとの契約延長交渉について、19日(月)に設定されている期限までの決着を目指している。ESPNのブライアン・ウィンダーホースト記者が16日(現地時間)、交渉の内幕を伝える特集記事で明らかにした。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "481-jimmy-butler-acl-return-warriors.html",
    cat: "NBA",
    title: "ジミー・バトラー「仲間を落胆させた」—— ACL大怪我から復帰へ、ウォリアーズ再建のラストピース",
    excerpt: "ゴールデンステート・ウォリアーズのジミー・バトラーは、1月19日に右膝前十字靭帯(ACL)を断裂してから8か月、チームを優勝争いから遠ざけてしまったという思いを抱えながら2月ごろの復帰に向けてリハビリを続けている。ESPNのアンソニー・スレイター記者が16日(現地時間)、特集記事で伝えた。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "480-jalen-williams-18-points-rockets-preseason.html",
    cat: "NBA",
    title: "ジェイレン・ウィリアムズ、ロケッツ戦で18得点 —— プレシーズンでサンダーが89-116で敗戦",
    excerpt: "オクラホマシティ・サンダーのジェイレン・ウィリアムズは現地時間10月15日、プレシーズンのヒューストン・ロケッツ戦に先発し、25分の出場でフィールドゴール14本中7本、3ポイント5本中2本を沈めて18得点7リバウンドを記録し、両チーム通じてこの日の試合最多得点者となった。サンダーは89-116でロケッツに敗れた。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "479-barnes-23-points-knicks-preseason.html",
    cat: "NBA",
    title: "スコッティ・バーンズ、ニックス戦で23得点 —— プレシーズンでラプターズが120-122で惜敗",
    excerpt: "トロント・ラプターズのスコッティ・バーンズは現地時間10月15日、プレシーズンのニューヨーク・ニックス戦に先発し、28分の出場でフィールドゴール15本中9本、3ポイント5本中4本を沈めて23得点を記録し、両チーム通じてこの日の試合最多得点者となった。ラプターズは120-122でニックスに惜敗した。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "478-maxey-healthy-embiid-sixers.html",
    cat: "NBA",
    title: "マクシー「健康なエンビードは全てを変える」—— 76ers、新戦力との連係構築に好材料",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは15日（現地時間）、故障が続いていたジョエル・エンビードが健康な状態でトレーニングキャンプとプレシーズンを過ごせたことが「全てを変える」と語った。エンビードは昨季38試合の出場にとどまったが、今季は新加入のレブロン・ジェームズやジェイレン・ブラウンとの連係構築が順調に進んでいるという。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "477-nba-gm-survey-wembanyama-spurs.html",
    cat: "NBA",
    title: "ウェンバンヤマがMVP最有力、スパーズは優勝候補1位 —— NBA恒例のGM調査、ハーパーはフラッグ超えの評価",
    excerpt: "NBA.comは15日（現地時間）、リーグ30チームのゼネラルマネージャー（GM）を対象にした恒例調査の結果を公開した。スパーズが優勝候補の最有力（50％）に挙がり、ウェンバンヤマはMVP（77％）とDPOYの本命に選ばれた。ディラン・ハーパーはクーパー・フラッグを上回るブレイクアウト候補に選ばれている。",
    date: "2026.10.16",
    thumb: "../assets/journal-477-hero.jpg?v=1427d7febc"
  },
  {
    href: "476-adidas-ae3-purple-iridescent.html",
    cat: "KICKS",
    title: "アディダス「Anthony Edwards 3」新色「Purple Iridescent」が11月10日発売 —— 光で色を変えるサイドケージ",
    excerpt: "アディダスは、アンソニー・エドワーズの3代目シグネチャーシューズ「Anthony Edwards 3」の新色「Purple Iridescent」を2026年11月10日に発売する。アッパーの大半をパープルが覆い、特徴的な大型サイドケージには光の当たり方でシルバー・ブルー・ピンクへと色を変えるイリデセント加工が施されている。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "475-nike-dunk-low-shibuya-halloween.html",
    cat: "KICKS",
    title: "Nike Dunk Low「Shibuya」新色「Halloween」が10月23日発売 —— 品番IX5169-300、価格135ドル",
    excerpt: "ナイキは「Dunk Low」の渋谷モチーフモデルに新色「Halloween」（品番IX5169-300、価格135ドル）を加え、2026年10月23日にNike.comおよび一部取扱店で発売する。Nice Kicksが伝えた。",
    date: "2026.10.16",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "474-nba-preseason-storylines.html",
    cat: "NBA",
    title: "ヤニス、ヒートでも“らしさ”全開 —— ESPNがプレシーズン総括、レブロンは慎重出場・ヨキッチは規格外パス",
    excerpt: "ESPNは15日（現地時間）、開幕を間近に控えたNBAのプレシーズンで見えてきた今シーズンの見どころを総括する記事を公開した。マイアミに移籍したヤニス・アデトクンボの好調ぶり、ニコラ・ヨキッチの規格外のパス、ジェイレン・デューレンの契約延長決着、タイリース・ハリバートンの感動の復帰戦などを取り上げている。ベン・ゴリバー記者が執筆した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "473-nba-10-important-names-this-season.html",
    cat: "NBA",
    title: "ウィリアムソンからカワイまで —— ESPNが選ぶ2026-27シーズンを左右する「注目の10人」",
    excerpt: "ESPNのヴィンセント・グッドウィル記者は、2026-27シーズンの行方を左右しうる選手・コーチ・GMとして10人を選出した。ザイオン・ウィリアムソン、カール・アンソニー・タウンズの去就、カワイ・レナードの去就など、開幕直前の注目ポイントを610 JOURNALが整理する。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "472-nike-af1-iron-man.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low Patent「Iron Man」が11月1日発売 —— 品番IX8058-687、2013年モデルの再解釈",
    excerpt: "ナイキは「Air Force 1 Low Patent ”Iron Man”」（品番IX8058-687）を2026年11月1日に発売する。グロッシーなパテントレザーにジムレッドを基調とした配色で、ソールには鮮やかなオレンジを採用。マーベル「アイアンマン」を思わせる一足で、2013年にも似たテーマのAir Force 1が発売されている。Sneaker Files、Sneaker Bar Detroitが伝えた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "471-jordan-tatum-5-houtoku-trial.html",
    cat: "KICKS",
    title: "Jordan Brand「TATUM 5」を高校生がひと足早く —— Alpenとのシューズトライアルを報徳学園で実施",
    excerpt: "AlpenとJordan Brandは、兵庫県・報徳学園高校男子バスケットボール部を対象にシューズトライアルを実施した。選手たちが試したのはジェイソン・テイタムの最新シグネチャーモデル「TATUM 5」。特別コーチに青木康平氏を招き、シュートやフットワーク、ピック＆ロールなどのドリルを通じてシューズの機能を体感した。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "469-hachimura-16-points-nuggets-preseason.html",
    cat: "NBA",
    title: "八村塁、ナゲッツ戦で16得点5リバウンド —— プレシーズンでクリッパーズが122-110で快勝",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間10月14日、本拠地Intuit Domeで行われたプレシーズンのデンバー・ナゲッツ戦に先発し、24分の出場でフィールドゴール12本中5本、3ポイント5本中3本を沈めて16得点5リバウンド2スティールを記録した。クリッパーズは122-110でナゲッツに快勝した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "470-brazile-22-points-clippers-preseason.html",
    cat: "NBA",
    title: "トレボン・ブラジル、クリッパーズ戦で22得点 —— プレシーズンでナゲッツが110-122で敗戦",
    excerpt: "デンバー・ナゲッツのトレボン・ブラジルは現地時間10月14日、プレシーズンのロサンゼルス・クリッパーズ戦に出場し、25分の出場でフィールドゴール10本中8本、3ポイント4本中3本を沈めて22得点を記録し、両チーム通じてこの日の試合最多得点者となった。ナゲッツは110-122でクリッパーズに敗れた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "468-tokyomx-alvark-utsunomiya.html",
    cat: "JAPAN",
    title: "TOKYO MX、「アルバルク東京vs宇都宮ブレックス」を録画放送 —— 11月1日19時、昨季東地区王者との一戦",
    excerpt: "東京メトロポリタンテレビジョン株式会社（TOKYO MX）は、B.LEAGUE PREMIERのアルバルク東京のホームゲーム「アルバルク東京 VS 宇都宮ブレックス」を2026年11月1日（日）19:00からTOKYO MX1で録画放送すると発表した。",
    date: "2026.10.15",
    thumb: "../assets/journal-468-hero.jpg?v=201c676ca5"
  },
  {
    href: "467-ieho-kawasaki-bravethunders-game.html",
    cat: "JAPAN",
    title: "「iehoいえほ」presents 川崎ブレイブサンダース冠試合 —— 10月21日、大阪エヴェッサ戦で開催",
    excerpt: "住宅用火災保険「iehoいえほ」を手がけるジェイアイ傷害火災保険株式会社は、2026年10月21日に開催されるB.LEAGUE PREMIER・川崎ブレイブサンダースのホームゲーム（vs大阪エヴェッサ）で冠試合「ホームを守れ！iehoマッチ」を実施すると発表した。「iehoいえほ」としては初の冠協賛となる。",
    date: "2026.10.15",
    thumb: "../assets/journal-467-hero.jpg?v=d9b0886a46"
  },
  {
    href: "466-poulakidas-16-points-mavericks-preseason.html",
    cat: "NBA",
    title: "ジョン・ポウラキダス、ペリカンズ戦で3ポイント4本成功の16得点 —— プレシーズンでマーベリックスが97-101で惜敗",
    excerpt: "ダラス・マーベリックスのジョン・ポウラキダスは現地時間10月14日、プレシーズンのニューオーリンズ・ペリカンズ戦に出場し、26分の出場でフィールドゴール9本中5本、3ポイントは8本中4本を沈めて16得点を記録し、ペリカンズのジェレマイア・フィアーズ、チームメイトのトビ・ラワルと並んで両チーム通じてこの日の試合最多得点者となった。マーベリックスは97-101でペリカンズに惜敗した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "465-tobi-lawal-16-points-pelicans-preseason.html",
    cat: "NBA",
    title: "トビ・ラワル、ペリカンズ戦で16得点 —— プレシーズンでマーベリックスが97-101で惜敗",
    excerpt: "ダラス・マーベリックスのトビ・ラワルは現地時間10月14日、プレシーズンのニューオーリンズ・ペリカンズ戦に出場し、23分の出場でフィールドゴール6本中4本、フリースロー8本全てを沈めて16得点を記録した。マーベリックスは97-101でペリカンズに惜敗した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "464-fears-16-points-mavericks-preseason.html",
    cat: "NBA",
    title: "ジェレマイア・フィアーズ、マーベリックス戦で16得点5アシスト —— プレシーズンでペリカンズが101-97で勝利",
    excerpt: "ニューオーリンズ・ペリカンズのジェレマイア・フィアーズは現地時間10月14日、プレシーズンのダラス・マーベリックス戦に出場し、20分の出場でフィールドゴール11本中6本、3ポイント3本中2本を沈めて16得点5アシストを記録し、両チーム通じてこの日の試合最多得点者となった。ペリカンズは101-97でマーベリックスを下した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "463-wembanyama-19-points-suns-preseason.html",
    cat: "NBA",
    title: "ビクター・ウェンバンヤマ、サンズ戦で19得点4ブロック —— プレシーズンでスパーズが123-103で快勝",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間10月14日、プレシーズンのフェニックス・サンズ戦に出場し、23分の出場でフィールドゴール14本中9本を沈めて19得点4ブロックを記録し、両チーム通じてこの日の試合最多得点者となった。スパーズは123-103でサンズを下した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "462-kam-jones-23-points-bulls-preseason.html",
    cat: "NBA",
    title: "キャム・ジョーンズ、ブルズ戦で23得点 —— プレシーズンでバックスが104-125で敗戦",
    excerpt: "ミルウォーキー・バックスのキャム・ジョーンズは現地時間10月14日、プレシーズンのシカゴ・ブルズ戦に出場し、22分の出場でフィールドゴール14本中9本、3ポイント6本中2本を沈めて23得点を記録し、両チーム通じてこの日の試合最多得点者となった。バックスは104-125でブルズに敗れた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "461-duren-24-points-timberwolves-preseason.html",
    cat: "NBA",
    title: "ジャレン・デューレン、ティンバーウルブズ戦で24得点 —— プレシーズンでピストンズが128-106で快勝",
    excerpt: "デトロイト・ピストンズのジャレン・デューレンは現地時間10月14日、プレシーズンのミネソタ・ティンバーウルブズ戦に出場し、15分の出場でフィールドゴール9本中8本、フリースロー8本全てを沈めて24得点を記録し、両チーム通じてこの日の試合最多得点者となった。ピストンズは128-106でティンバーウルブズを下した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "460-porter-jr-27-points-heat-preseason.html",
    cat: "NBA",
    title: "ポーター・ジュニア、ヒート戦で27得点 —— プレシーズンでネッツが128-144で敗戦",
    excerpt: "ブルックリン・ネッツのマイケル・ポーター・ジュニアは現地時間10月14日、プレシーズンのマイアミ・ヒート戦に出場し、27分の出場でフィールドゴール17本中9本、3ポイント8本中4本を沈めて27得点を記録した。ネッツは128-144でヒートに敗れた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "459-tatum-19-points-hornets-preseason.html",
    cat: "NBA",
    title: "テイタム、ホーネッツ戦で19得点6アシスト —— プレシーズンでセルティックスが114-93で快勝",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間10月14日、プレシーズンのシャーロット・ホーネッツ戦に先発出場し、29分の出場でフィールドゴール17本中8本、3ポイント8本中3本を沈めて19得点6アシスト8リバウンドを記録した。セルティックスは114-93でホーネッツを下した。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "458-chiba-sky-wings-oamishirasato-taiken.html",
    cat: "JAPAN",
    title: "CHIBA SKY WINGS、大網白里校で10月の体験会を実施中 —— 11月から本格スタートへ",
    excerpt: "3x3チーム「CHIBA SKY WINGS」を運営する株式会社SKYPORTは、2026年10月の毎週水曜日、千葉県大網白里市の「Swish(スウィッシュ)」で小学生向けの体験会を開催している。担当は現役3x3選手でスクールのメインコーチを務める遠藤涼真。初回は無料、10月の2回目以降は1回1,000円で、初心者・経験者ともに参加を受け付けている。公式Instagramでは11月から本格的にスタートする予定としている。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "457-kessler-lakers-preseason-debut-relentless.html",
    cat: "NBA",
    title: "ケスラー「とにかく貪欲に」—— レイカーズ初陣で11得点9リバウンド、347日ぶりの実戦復帰",
    excerpt: "ロサンゼルス・レイカーズのウォーカー・ケスラー(Walker Kessler)は現地時間10月13日、ラスベガスでのウォリアーズ戦でプレシーズン初出場を果たし、16分の出場で11得点9リバウンド1ブロック1スティールを記録した。左肩手術からの実戦復帰は347日ぶり。JJ・レディックHCは「relentless(とにかく貪欲に)」を合言葉に掲げている。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "456-nets-pacers-nuggets-spurs-aba-uniforms.html",
    cat: "NBA",
    title: "ネッツ・ペイサーズ・ナゲッツ・スパーズがABA復刻の「クラシック・エディション」ユニフォームを発表 —— 4球団そろって60周年",
    excerpt: "ブルックリン・ネッツ、インディアナ・ペイサーズ、デンバー・ナゲッツ、サンアントニオ・スパーズの4球団は現地時間10月12日、ABA(アメリカン・バスケットボール・アソシエーション)時代にルーツを持つ「クラシック・エディション」ユニフォームとコートデザインを発表した。4球団はいずれも今季が球団60周年にあたる。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "455-porzingis-out-indefinitely-private-health.html",
    cat: "NBA",
    title: "ポルジンギス、無期限離脱も施設には復帰へ —— ウォリアーズ、カーHCは小型ラインアップで開幕へ",
    excerpt: "ゴールデンステート・ウォリアーズは現地時間10月14日、クリスタプス・ポルジンギスが「個人的な健康上の問題」で無期限の離脱を続けると発表した一方、本人はチームの練習施設には戻り周囲に居続ける見込みだと明らかにした。ESPNのアンソニー・スレイター記者が伝えた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "454-nike-air-raid-2-return.html",
    cat: "KICKS",
    title: "Nike Air Raid IIの復刻が濃厚に —— 90年代の名作バッシュ、初のリトロ発売へ",
    excerpt: "ナイキは、1990年代半ばに発売したバスケットボールシューズ「Air Raid II」を初めて本格的に復刻する見通しであることがわかった。ナイキのデザイナー、フランク・クック氏がInstagramで示唆し、Sneaker NewsとSneaker Bar Detroitが伝えた。具体的な発売日は本稿時点で未定。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "453-new-balance-kawhi-5.html",
    cat: "KICKS",
    title: "New Balance Kawhi 5が10月21日発売 —— ラプターズ復帰のカワイ・レナード、最新シグネチャーを2色展開",
    excerpt: "ニューバランスは、トロント・ラプターズのカワイ・レナードのシグネチャーシューズ最新作「Kawhi 5」を2026年10月21日に2色展開で発売する。Sneaker Newsが伝えた。",
    date: "2026.10.15",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "452-nike-tatum-5-lock-in-session.html",
    cat: "KICKS",
    title: "Nike Tatum 5 体験セッション「LOCK IN」—— 大濠高OB・渡邉伶音と恩師・片峯監督が再会",
    excerpt: "Nikeのジェイソン・テイタム新シグネチャー「Tatum 5」の体験セッション「LOCK IN」が開催され、福岡大学附属大濠高校の片峯聡太監督と、教え子でB.PREMIER アルティーリ千葉の渡邉伶音選手が同じコートに立った。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "451-wembanyama-first-seed-goal-spurs.html",
    cat: "NBA",
    title: "ウェンバンヤマ「1番シードを獲りたい」—— ファイナル敗退のスパーズ、新シーズンへ高い目標",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは、9月のメディアデーでチーム内の目標について「去年は西地区を制した。今年はそれより劣る結果で終わるつもりはない。1番シードを獲りたいし、そのトップの座を守り抜きたい」と語った。ESPNが報じた。昨季ニックスにファイナルで敗れたスパーズは、その悔しさを糧に高い目標を掲げる。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "450-espn-now-or-later-rankings-2026-27.html",
    cat: "NBA",
    title: "サンズが1年ぶり首位、ネッツは3年連続最下位 —— ESPN「Now or Later」ランキングでNBA30チームを格付け",
    excerpt: "ESPNのザック・クラム記者は14日(現地時間)、契約の重さとドラフト資産の豊富さから「今勝つべきか、後で勝つか」を測る年次企画『Now or Later Rankings』の2026-27シーズン版を公開した。フェニックス・サンズが1年ぶりに1位、ブルックリン・ネッツは3年連続で30位(最下位)となった。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "449-chiba-sky-wings-pickup-game-yokoshiba.html",
    cat: "JAPAN",
    title: "CHIBA SKY WINGS、10月17日に横芝光町でPICK UP GAMEを開催 —— 初心者・一人参加も歓迎",
    excerpt: "3人制バスケットボールチーム「CHIBA SKY WINGS」を運営する株式会社SKYPORTは、2026年10月17日19時から21時まで、千葉県横芝光町の横芝中学校で「PICK UP GAME in 横芝光町」を開催する。当日集まった参加者でチームを組む形式で、年齢・経験を問わず初心者や一人での参加も歓迎。参加費は一般500円、ファンクラブ会員は無料。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "448-avdija-26-points-kings-preseason.html",
    cat: "NBA",
    title: "デニ・アヴディア、キングス戦で26得点 —— プレシーズンでトレイルブレイザーズが110-98で快勝",
    excerpt: "ポートランド・トレイルブレイザーズのデニ・アヴディアは現地時間10月13日、ゴールデン1センター(サクラメント)で行われたプレシーズンのサクラメント・キングス戦に出場し、25分の出場でフィールドゴール13本中9本、3ポイント6本中2本を沈めて26得点9リバウンド4アシスト2ブロックを記録した。トレイルブレイザーズは110-98でキングスを破った。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "447-reaves-28-points-warriors-preseason.html",
    cat: "NBA",
    title: "オースティン・リーブス、ウォリアーズ戦で28得点 —— プレシーズンでレイカーズが89-101で敗れる",
    excerpt: "ロサンゼルス・レイカーズのオースティン・リーブスは現地時間10月13日、Tモバイル・アリーナ(ラスベガス)で行われたプレシーズンのゴールデンステイト・ウォリアーズ戦に出場し、25分の出場でフィールドゴール18本中10本、3ポイント7本中4本を沈めて28得点7アシスト4リバウンドを記録した。レイカーズは89-101でウォリアーズに敗れた。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "446-haliburton-24-points-thunder-preseason.html",
    cat: "NBA",
    title: "タイリース・ハリバートン、サンダー戦で24得点 —— プレシーズンでペイサーズが112-114で惜敗",
    excerpt: "インディアナ・ペイサーズのタイリース・ハリバートンは現地時間10月13日、ペイコム・センター(オクラホマシティ)で行われたプレシーズンのオクラホマシティ・サンダー戦に出場し、18分の出場でフィールドゴール14本中9本、3ポイント6本中4本を沈めて24得点3リバウンド2ブロックを記録した。ペイサーズは112-114でサンダーに惜敗した。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "445-kawhi-leonard-21-points-knicks-preseason.html",
    cat: "NBA",
    title: "カワイ・レナード、ニックス戦で21得点 —— プレシーズンでラプターズが148-98で大勝",
    excerpt: "トロント・ラプターズのカワイ・レナードは現地時間10月13日、スコシアバンク・アリーナ(トロント)で行われたプレシーズンのニューヨーク・ニックス戦に出場し、17分の出場でフィールドゴール12本中6本、3ポイント8本中4本を沈めて21得点5リバウンド2スティールを記録した。ラプターズは148-98でニックスに大勝した。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "444-banchero-24-points-cavaliers-preseason.html",
    cat: "NBA",
    title: "パオロ・バンケーロ、キャバリアーズ戦で24得点 —— プレシーズンでマジックが132-116で快勝",
    excerpt: "オーランド・マジックのパオロ・バンケーロは現地時間10月13日、キア・センター(オーランド)で行われたプレシーズンのクリーブランド・キャバリアーズ戦に出場し、28分の出場でフィールドゴール13本中10本を沈めて24得点8リバウンド3アシストを記録した。マジックは132-116でキャバリアーズに快勝した。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "443-pritchard-celtics-extension.html",
    cat: "NBA",
    title: "セルティックス、プリチャードと2年4420万ドルで契約延長 —— 2029-30シーズンに相互オプション",
    excerpt: "ボストン・セルティックスは、ガードのペイトン・プリチャードと2年4420万ドルの契約延長に合意した。代理人を務めるCAAのオースティン・ブラウン氏とマックス・サイドマン氏がESPNに伝えた。延長は完全保証の最大額契約で、2029-30シーズンには相互オプションが付く。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "442-caldwell-pope-chemistry-76ers.html",
    cat: "NBA",
    title: "コールドウェル＝ポープ「お互いを好きになることが一番大事」—— 76ers新戦力、選手層の融合に手応え",
    excerpt: "フィラデルフィア・76ersのケンテイビアス・コールドウェル＝ポープ(Kentavious Caldwell-Pope)は12日(現地時間)、チーム施設での取材に応じ、スター選手を揃えた今季の76ersの成否は「選手層の化学反応にかかっている」と語った。「お互いを好きになること、コートの内外で一緒に楽しく過ごせることだ」と述べた。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "441-air-jordan-3-santa-dm0967-601.html",
    cat: "KICKS",
    title: "Air Jordan 3「Santa」が11月発売 —— 品番DM0967-601、1985年のヴィンテージ・ポスターに着想",
    excerpt: "ジョーダン ブランドの「Air Jordan 3」に、クリスマスをテーマにしたキッズ専用カラー「Santa」(品番DM0967-601)が2026年11月に発売されることがわかった。サンタクロースの衣装から着想を得たレッド・ホワイト・ブラックの配色で、1985年当時のナイキのヴィンテージ・ポスターをモチーフにしている。",
    date: "2026.10.14",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "440-eneos-sunflowers-2026-27-season-opener.html",
    cat: "JAPAN",
    title: "ENEOSサンフラワーズ、Wリーグ2026-27シーズンが10月14日開幕 —— ユナイテッドカップ連覇、4年ぶり24度目のリーグ制覇目指す",
    excerpt: "ENEOS株式会社は10月13日、実業団バスケットボールクラブ「ENEOSサンフラワーズ」が10月14日(水)開幕の「大樹生命Wリーグユナイテッドカップ2026-27」から2026-27シーズンを始動すると発表した。初戦は三菱電機コアラーズと対戦し、前回大会王者として連覇を目指す。10月31日開幕のレギュラーシーズンでは、4年ぶり・史上最多24回目のリーグ優勝を目指す。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "439-golden-kings-fy20-record-revenue.html",
    cat: "JAPAN",
    title: "琉球ゴールデンキングス、単体売上高38億6400万円で過去最高 —— B.LEAGUE史上初の5年連続ファイナル進出も",
    excerpt: "沖縄バスケットボール株式会社は10月13日、琉球ゴールデンキングスの2025-26シーズン(2026年6月期・第20期)実績を発表。単体売上高は3,864百万円で前期比108%の過去最高を記録し、チームはB.LEAGUE史上初となる5年連続のファイナル進出を果たした。",
    date: "2026.10.13",
    thumb: "../assets/journal-439-hero.jpg?v=4af158d839"
  },
  {
    href: "438-clippers-waive-kawamura.html",
    cat: "NBA",
    title: "クリッパーズ、河村勇輝をウェイブ —— Michael Scotto記者（HoopsHype）が報道",
    excerpt: "ロサンゼルス・クリッパーズが河村勇輝をウェイブで放出したことが、日本時間10月13日に明らかになった。HoopsHypeのMichael Scotto記者が自身のXで一報を伝えた。放出の理由や今後の去就は本稿時点で明らかになっていない。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "437-air-force-1-low-what-the-la.html",
    cat: "KICKS",
    title: "Nike Air Force 1 Low「What The LA」が10月に再登場 —— 品番CT1117-100で2度目の発売",
    excerpt: "ナイキの「Air Force 1 Low ”What The LA”」(品番CT1117-100)が、2026年10月中に2度目の発売を予定している。具体的な発売日・価格は本稿時点で未定。Nice Kicksが伝えた。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "436-gillespie-25-points-jazz-preseason.html",
    cat: "NBA",
    title: "ジャコビ・ギレスピー、ジャズ戦で25得点 —— プレシーズンでスパーズが109-119で敗れる",
    excerpt: "サンアントニオ・スパーズのジャコビ・ギレスピーは現地時間10月12日、デルタ・センターで行われたプレシーズンのユタ・ジャズ戦に出場し、25分の出場でフィールドゴール14本中9本を沈めて25得点3アシスト3スティールを記録した。スパーズは109-119でジャズに敗れた。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "435-edwards-26-points-knicks-preseason.html",
    cat: "NBA",
    title: "アンソニー・エドワーズ、ニックス戦で26得点 —— プレシーズンでウルブズが122-104で快勝",
    excerpt: "ミネソタ・ティンバーウルブズのアンソニー・エドワーズは現地時間10月12日、マディソン・スクエア・ガーデンで行われたプレシーズンのニューヨーク・ニックス戦に出場し、25分の出場で3ポイント8本中5本を含む26得点3アシストを記録し試合最多得点者となった。ティンバーウルブズは122-104でニックスに快勝した。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "434-porter-jr-22-points-wizards-preseason.html",
    cat: "NBA",
    title: "マイケル・ポーター・ジュニア、ウィザーズ戦で22得点 —— プレシーズンでネッツが131-122で快勝",
    excerpt: "ブルックリン・ネッツのマイケル・ポーター・ジュニアは現地時間10月12日、キャピタル・ワン・アリーナで行われたプレシーズンのワシントン・ウィザーズ戦に出場し、24分の出場でフィールドゴール13本中8本を沈めて22得点4リバウンド2スティールを記録した。ネッツは131-122でウィザーズに快勝した。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "433-stirtz-26-points-hawks-preseason.html",
    cat: "NBA",
    title: "ベネット・スターツ、ホークス戦で26得点 —— プレシーズンでサンダーが110-113で惜敗",
    excerpt: "オクラホマシティ・サンダーのベネット・スターツは現地時間10月12日、ステート・ファーム・アリーナで行われたプレシーズンのアトランタ・ホークス戦に出場し、38分の出場で3ポイント9本中6本を含む26得点5アシストを記録し試合最多得点者となった。サンダーは110-113でホークスに惜敗した。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "432-jordan-brand-space-jam-30th-campaign.html",
    cat: "KICKS",
    title: "ジョーダン ブランド、『スペース・ジャム』30周年キャンペーン「Greatness is Never Out of Reach」始動",
    excerpt: "ジョーダン ブランドは、映画『スペース・ジャム』公開30周年を記念し、新作フットウェア・アパレルコレクションとキャンペーン「Greatness is Never Out of Reach」、ミニドキュメンタリーシリーズ「Space Jam: Beyond the Jam」を展開する。Wieden+Kennedy、ワーナー・ブラザース アニメーションと再タッグ。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "431-air-jordan-11-low-made-for-locals.html",
    cat: "KICKS",
    title: "APB × Air Jordan 11 Low「Made For Locals」が10月23日発売 —— 品番IU8266-400",
    excerpt: "APBとのコラボレーションによる「Air Jordan 11 Low ”Made For Locals”」（品番IU8266-400）が10月23日、ホイッテカー・グループ取扱店舗およびオンラインで発売される。地元で愛される場所をテーマにしたデザイン。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "430-henderson-14-points-lions-preseason.html",
    cat: "NBA",
    title: "スクート・ヘンダーソン、ロンドン・ライオンズ戦で14得点 —— 3ポイント5本中4本、ブレイザーズが119-66で快勝",
    excerpt: "ポートランド・トレイルブレイザーズのスクート・ヘンダーソンは現地時間10月12日、モダ・センターで行われたプレシーズンの親善試合、ロンドン・ライオンズ戦に途中出場し、16分の出場で3ポイント5本中4本を含む14得点3アシスト2スティールを記録した。ブレイザーズは119-66でロンドン・ライオンズに快勝した。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "429-camara-14-points-lions-preseason.html",
    cat: "NBA",
    title: "トゥマニ・カマラ、ロンドン・ライオンズ戦で14得点 —— プレシーズンの親善試合でブレイザーズが119-66で快勝",
    excerpt: "ポートランド・トレイルブレイザーズのトゥマニ・カマラは現地時間10月12日、モダ・センターで行われたプレシーズンの親善試合、ロンドン・ライオンズ戦に出場し、15分の出場で14得点2リバウンド3アシストを記録した。ブレイザーズは119-66でロンドン・ライオンズに快勝した。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "428-porzingis-return-warriors-facility.html",
    cat: "NBA",
    title: "ポルジンギス、2週間の離脱から火曜に施設復帰へ —— 原因はセルティックス時代のウイルス感染の後遺症",
    excerpt: "ゴールデンステート・ウォリアーズのクリスタプス・ポルジンギスが、現地時間10月13日(火)午後にチームの練習施設へ復帰する見込みであることが、ヘッドコーチのスティーブ・カーの発言で明らかになった。プレシーズン開始から2週間の離脱の背景には、セルティックス時代に患った上気道系ウイルス感染の後遺症があるという。ESPNのアンソニー・スレイター記者が伝えた。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "427-nike-kd-19-halloween.html",
    cat: "KICKS",
    title: "Nike KD 19「Halloween」が10月23日発売 —— デュラントの最新シグネチャーに秋限定カラー",
    excerpt: "ナイキは、ケビン・デュラント（ヒューストン・ロケッツ）のシグネチャーシューズ「Nike KD 19」の新色「Halloween」（品番IO8112-600）を10月23日、ナイキ公式サイトおよび一部取扱店で発売する。価格は170ドル（米国価格）。米スニーカーメディアNice Kicksが伝えた。",
    date: "2026.10.13",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "426-jordan-finals-game2-jersey-record.html",
    cat: "NBA",
    title: "ジョーダンの1998年ファイナル第2戦ジャージが1400万ドルで落札 —— バスケ記念品史上最高額を更新",
    excerpt: "マイケル・ジョーダンが1998年NBAファイナル第2戦で着用したシカゴ・ブルズの赤いロードジャージが、現地時間10月12日、オークション会社ハント・オークションズを通じた個人間取引で1400万ドル(約21億円)で落札された。同社はバスケットボール記念品として史上最高額と説明している。ESPNが伝えた。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "425-cooper-flagg-china-games-ascension.html",
    cat: "NBA",
    title: "クーパー・フラッグ、マカオ遠征2試合で33得点10リバウンド10アシスト —— ウィンドホースト記者「進化はもう避けられない」",
    excerpt: "ダラス・マーベリックスのクーパー・フラッグ(Cooper Flagg)は、中国・マカオで行われたロケッツとのNBAチャイナゲーム2連戦で、合計45分の出場に対し33得点10リバウンド10アシスト3スティール2ブロックを記録した。ESPNのブライアン・ウィンドホースト記者は「フラッグの進化はもう避けられない段階に入っている」と分析している。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "424-kyrie-irving-return-macao-quotes.html",
    cat: "NBA",
    title: "アービング「自分らしく、アグレッシブに」—— ACL断裂から586日ぶりの実戦でマカオを沸かす",
    excerpt: "ダラス・マーベリックスのカイリー・アービング(Kyrie Irving)は現地時間10月11日、中国・マカオで行われたロケッツ戦(NBAチャイナゲーム第2戦)で左膝ACL断裂からの復帰後初めて実戦に立ち、22分の出場で17得点3アシストを記録した。「自分らしく見せようとした」と振り返った。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "423-kessler-lakers-preseason-debut-nears.html",
    cat: "NBA",
    title: "ケスラー、小指のけがから練習フル参加 —— レイカーズでのプレシーズン初出場に前進",
    excerpt: "ロサンゼルス・レイカーズのウォーカー・ケスラー(Walker Kessler)は現地時間10月11日、エル・セグンドでの練習に全体参加し、トレーニングキャンプ序盤に負傷した左手小指のけがからプレシーズン初出場に近づいた。JJ・レディックHCは次戦の出場を明言していない。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "422-miller-26-points-nuggets-preseason.html",
    cat: "NBA",
    title: "レナード・ミラー、ナゲッツ戦で26得点 —— プレシーズンでブルズが128-133で敗れる",
    excerpt: "シカゴ・ブルズのレナード・ミラーは現地時間10月11日、デンバーで行われたプレシーズンのナゲッツ戦に途中出場し、22分の出場で26得点7リバウンド2アシストを記録した。ブルズは128-133でナゲッツに敗れた。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "421-miller-18-points-bucks-preseason.html",
    cat: "NBA",
    title: "ブランドン・ミラー、バックス戦で18得点 —— プレシーズンでホーネッツが105-90で勝利",
    excerpt: "シャーロット・ホーネッツのブランドン・ミラーは現地時間10月11日、本拠地で行われたプレシーズンのミルウォーキー・バックス戦に先発出場し、23分の出場で18得点3リバウンド4アシストを記録した。ホーネッツは105-90でバックスを下した。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "420-herro-18-points-hornets-preseason.html",
    cat: "NBA",
    title: "タイラー・ヒーロー、ホーネッツ戦で18得点 —— プレシーズンでバックスが90-105で敗れる",
    excerpt: "ミルウォーキー・バックスのタイラー・ヒーローは現地時間10月11日、シャーロットで行われたプレシーズンのホーネッツ戦に先発出場し、23分の出場で18得点7リバウンド2アシストを記録した。バックスは90-105でホーネッツに敗れた。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "419-harden-24-points-magic-preseason.html",
    cat: "NBA",
    title: "ジェームズ・ハーデン、マジック戦で24得点 —— プレシーズンでキャバリアーズが119-105と快勝",
    excerpt: "クリーブランド・キャバリアーズのジェームズ・ハーデンは現地時間10月11日、本拠地で行われたプレシーズンのオーランド・マジック戦に先発出場し、26分の出場で24得点4リバウンド2アシストを記録した。キャバリアーズは119-105でマジックを下した。",
    date: "2026.10.12",
    thumb: "../assets/journal-419-hero.jpg?v=66518f8b70"
  },
  {
    href: "418-kings-raynaud-patellar-subluxation.html",
    cat: "NBA",
    title: "キングスのレイノー、右膝蓋骨亜脱臼と診断 —— 球団公式発表、約2週間後に再検査",
    excerpt: "サクラメント・キングスは11日(現地時間)、プレシーズンのウォリアーズ戦で右膝を負傷したマクシーム・レイノーについて、MRI検査の結果「右膝蓋骨亜脱臼」と診断されたと公式発表した。約2週間後に再検査を行い、続報があり次第伝えるとしている。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "417-towns-knicks-news-to-me.html",
    cat: "NBA",
    title: "タウンズ「初耳だった」—— ニックスの契約延長保留発表に「かなり残念」",
    excerpt: "ニューヨーク・ニックスのカール=アンソニー・タウンズ(Karl-Anthony Towns)は11日(現地時間)、球団が契約延長交渉を開幕まで保留すると発表したことについて「初耳だった」と語った。「かなり残念と言わざるを得ない」とも述べ、落胆をあらわにした。タウンズの延長資格は4年2億7600万ドル超、球団提示は4年総額約2億ドルとされる。",
    date: "2026.10.12",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "416-smart-20-points-mavericks-macau.html",
    cat: "NBA",
    title: "マーカス・スマート、マーベリックス戦で20得点 —— マカオ第2戦でロケッツが115-132、カードは1勝1敗に",
    excerpt: "ヒューストン・ロケッツのマーカス・スマートは現地時間10月11日、中国・マカオで行われたNBAチャイナゲームのプレシーズン第2戦、ダラス・マーベリックス戦に先発出場し、24分の出場で20得点5リバウンド4アシストを記録した。ロケッツは115-132で敗れ、カードは1勝1敗となった。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "415-kennard-20-points-suns-preseason.html",
    cat: "NBA",
    title: "ケナード、スパーズ戦で20得点 —— プレシーズンでサンズが102-98の接戦を制す",
    excerpt: "フィニックス・サンズのルーク・ケナードは現地時間10月10日、本拠地で行われたプレシーズンのサンアントニオ・スパーズ戦に出場し、25分の出場で20得点5リバウンド4アシストを記録した。サンズは102-98でスパーズを下した。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "414-kawamura-10-points-plus12-raptors.html",
    cat: "NBA",
    title: "河村勇輝、ラプターズ戦で10得点4アシスト —— 14分の出場でチーム最高のプラスマイナス+12",
    excerpt: "ロサンゼルス・クリッパーズの河村勇輝は現地時間10月10日、カナダ・バンクーバーで行われたプレシーズンのトロント・ラプターズ戦にベンチから出場し、14分で10得点4アシスト2スティール（FG3/4・3P1/2・FT3/3）を記録した。プラスマイナス+12はチーム最高。試合はクリッパーズが106-114で敗れた。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "413-kings-raynaud-knee-injury.html",
    cat: "NBA",
    title: "キングスのレイノー、右膝に重傷の恐れ —— プレシーズンのウォリアーズ戦で負傷、長期離脱を懸念",
    excerpt: "サクラメント・キングスのマクシーム・レイノーは現地時間10月10日、ゴールデンステート・ウォリアーズ戦のプレシーズンで右膝を負傷し、重傷の恐れがあるとESPNが報じた。球団内では長期離脱を懸念する声が出ている。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "412-tatum-23-points-76ers-preseason.html",
    cat: "NBA",
    title: "テイタム、76ers戦で23得点 —— プレシーズンでセルティックスが144-106と大勝",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間10月10日、本拠地TD Gardenで行われたプレシーズンのフィラデルフィア・76ers戦に先発し、27分の出場で23得点5リバウンド4アシストを記録した。セルティックスは144-106で大勝した。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "411-hachimura-kawamura-raptors-vancouver.html",
    cat: "NBA",
    title: "八村塁が14得点、河村勇輝はプラマイ+12 —— クリッパーズ、バンクーバーのラプターズ戦でプレシーズン初黒星",
    excerpt: "ロサンゼルス・クリッパーズは現地時間10月10日、カナダ・バンクーバーのロジャーズ・アリーナで行われたNBAカナダシリーズ、トロント・ラプターズ戦に106-114で敗れ、プレシーズン初黒星となった。八村塁は19分の出場でチーム最多の14得点、河村勇輝は14分の出場で10得点4アシスト、チーム最高のプラスマイナス+12を記録した。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "410-warriors-podziemski-extension.html",
    cat: "NBA",
    title: "ウォリアーズ、ポジェムスキーと5年1億1000万ドルで契約延長 —— 来夏の制限付きFA回避、最終年にトレードキッカー付き",
    excerpt: "ゴールデンステート・ウォリアーズは、主力ガードのブランディン・ポジェムスキーと5年1億1000万ドルの契約延長に合意した。代理人のビル・ダフィーがESPNのシャムズ・シャラニア記者に伝えた。来夏の制限付きフリーエージェント入りを回避する形で、完全保証に最終年の相互オプション・トレードキッカーが付く。",
    date: "2026.10.11",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "409-sga-nike-shai-002-hand-drawn.html",
    cat: "KICKS",
    title: "ギルジャス＝アレクサンダー、「Nike SHAI 002」は自分でデザインを描いた —— 2作目のシグネチャー、発売は2027年序盤予定",
    excerpt: "オクラホマシティ・サンダーのシャイ・ギルジャス＝アレクサンダーは、自身2作目のシグネチャーシューズ「Nike SHAI 002」のデザインを自らペンで描いたと米TIME誌のインタビューで明らかにした。コンバースからナイキ・バスケットボールへ移籍して以降、初めての完全新規デザインとなる一足で、発売は2027年序盤を予定している。Hypebeastが伝えた。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "408-westbrook-la-olympics-torch.html",
    cat: "NBA",
    title: "ラッセル・ウェストブルック「2028年LA五輪の聖火ランナーになりたい」—— 引退後、地元への恩返しが新たな目標に",
    excerpt: "8月に現役を引退したラッセル・ウェストブルックは9日(現地時間)、地元ロサンゼルス市議会の表彰式で、2028年ロサンゼルス五輪の聖火ランナーになりたいという目標を公表した。2012年ロンドン五輪で金メダルを獲得した元MVPは、自身の財団を通じた地域貢献の拡大でその実現を目指すという。ESPNが伝えた。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "407-haliburton-lillard-fences.html",
    cat: "NBA",
    title: "ハリバートン「ダミアンとの関係、取り戻したい」—— リラードの決め台詞を奪った「あの瞬間」を悔いる",
    excerpt: "インディアナ・ペイサーズのタイリース・ハリバートンは、ポッドキャスト「The Zach Lowe Show」で、2023年のイン・シーズン・トーナメントでデイミアン・リラードの決めポーズを真似たことについて「後悔している」と明かし、関係の修復を望んでいると語った。両者とも2025年プレーオフでアキレス腱を断裂し、今季復帰している。ESPNが伝えた。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "406-embiid-easy-target-lebron-report.html",
    cat: "NBA",
    title: "エンビード、レブロン「叱責」報道を否定 —— 「なぜ自分が」とこぼす、76ersプレシーズンでミスも",
    excerpt: "フィラデルフィア・76ersのジョエル・エンビードは9日(現地時間)、ネッツ戦後の会見で、レブロン・ジェームズが練習に遅れた自分を叱ったとする実況者の発言を「事実ではない」と否定した。「なぜ自分が標的になるのか」と心境を語りつつ、チームでまとまる重要性を強調した。ESPNが伝えた。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "405-espn-30-teams-roster-holes.html",
    cat: "NBA",
    title: "ESPNが開幕前「全30チーム診断」—— クリッパーズは「オーナー不在」、連覇目指すニックスはバックアップ層の薄さが課題",
    excerpt: "ESPNのベン・ゴリバー記者は8日(現地時間)、開幕を控えたNBA全30球団について「今シーズン最も埋まっていない穴」を分析する特集を公開した。1年間の職務停止処分を受けたオーナーを抱えるクリッパーズを最大の課題に挙げ、連覇を狙うニックスのバックアップセンター問題、76ersのエンビード故障対策なども取り上げている。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "404-knicks-towns-hart-extension-tabled.html",
    cat: "NBA",
    title: "ニックス、タウンズとハートの契約延長交渉を公式に一時中断 —— 球団が声明、タウンズの資格は4年2億7600万ドル超",
    excerpt: "ニューヨーク・ニックスは9日(現地時間)、カール=アンソニー・タウンズとジョシュ・ハートの契約延長交渉を今季の開幕前は行わないと公式に発表した。球団広報はESPNに「シーズン開幕の準備に集中する」との声明を出し、タウンズへの球団提示額は4年総額約2億ドルにとどまるという。",
    date: "2026.10.10",
    thumb: "../assets/journal-404-hero.jpg?v=0bf346832b"
  },
  {
    href: "403-sengun-triple-double-macao-mavericks.html",
    cat: "NBA",
    title: "シェングン、22分でトリプルダブル —— マカオでのプレシーズン・マーベリックス戦、16得点10リバウンド10アシスト",
    excerpt: "ヒューストン・ロケッツのアルペラン・シェングンは現地時間10月9日、マカオで行われたNBAチャイナゲームのプレシーズン、ダラス・マーベリックス戦に先発し、22分の出場で16得点10リバウンド10アシストのトリプルダブルを記録した。ロケッツは135-117で勝利した。",
    date: "2026.10.10",
    thumb: "../assets/journal-403-hero.jpg?v=ae09c11272"
  },
  {
    href: "402-doncic-23-points-kings-preseason.html",
    cat: "NBA",
    title: "ドンチッチ、キングス戦で23得点 —— プレシーズン本拠初戦、FT9/9でレイカーズ勝利",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間10月8日、本拠地crypto.com Arenaでのプレシーズン、サクラメント・キングス戦に先発し、25分の出場で23得点3リバウンド3アシスト（FT9/9）を記録した。レイカーズは114-110で勝ち、プレシーズン2勝1敗とした。",
    date: "2026.10.10",
    thumb: "../assets/journal-402-hero.jpg?v=367736ec9f"
  },
  {
    href: "401-hachimura-clippers-debut-warriors-hawaii.html",
    cat: "NBA",
    title: "八村塁、クリッパーズ初戦で21得点 —— ハワイでのプレシーズン・ウォリアーズ戦、3P4/5でチーム最多",
    excerpt: "ロサンゼルス・クリッパーズの八村塁は現地時間10月4日、ハワイで行われたプレシーズンのゴールデンステート・ウォリアーズ戦に先発し、15分の出場で21得点5リバウンド（FG8/11・3P4/5）を記録した。チームは104-101で勝利。八村はクリッパーズでの初戦で両チーム最多得点を挙げた。",
    date: "2026.10.10",
    thumb: "../assets/journal-401-hero.jpg?v=edaf225261"
  },
  {
    href: "400-jeff-hamilton-night-postup-live.html",
    cat: "CULTURE",
    title: "レザージャケットの皇帝、東京タワーへ —— ジェフ・ハミルトン×「クリスのバスケ日記」POSTUP公開収録が10月13日開催",
    excerpt: "ジョーダンやコービーが優勝の夜に袖を通したジャケットを手がけてきたデザイナー、ジェフ・ハミルトン。YouTube「クリスのバスケ日記」のクリスが聞き手となるバスケカルチャー・ポッドキャスト「POSTUP」の公開収録「Jeff Hamilton Night」が、10月13日に東京タワー Club333で開かれる。",
    date: "2026.10.10",
    thumb: "../assets/journal-400-hero.jpg?v=f7cd365791"
  },
  {
    href: "399-air-jordan-1-somos-historias.html",
    cat: "KICKS",
    title: "Air Jordan 1 Low OG「Somos Historias」が登場 —— “死者の日”テーマ、品番IZ4686-216で5,026足限定",
    excerpt: "ジョーダン ブランドは、メキシコの“死者の日(Día de los Muertos)”をテーマにした新色「Air Jordan 1 Low OG『Somos Historias』」(品番IZ4686-216)を5,026足限定で展開する。Sneaker Bar Detroitが現地時間10月9日に伝え、Nice Kicksも同日報じている。発売日・価格は記事執筆時点で明らかにされていない。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "398-air-jordan-41-trunner-os-space-jam.html",
    cat: "KICKS",
    title: "Jordan Brand『スペース・ジャム』コレクションがさらに拡大 —— Air Jordan 41とJordan Trunner O/S「Space Jam Planet」に新色",
    excerpt: "ジョーダン ブランドは、映画『スペース・ジャム』30周年記念コレクションをさらに拡大し、「Air Jordan 41 Space Jam」(品番HV6474-003)と「Jordan Trunner O/S Space Jam Planet」(品番IX6403-200)を明らかにした。Sneaker News、Sneaker Bar Detroitが伝えた。発売日・価格は記事執筆時点で明らかにされていない。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "397-air-jordan-4-bin23.html",
    cat: "KICKS",
    title: "Air Jordan 4「BIN23」のファーストルックが公開 —— 品番JA3588-200、プレミアムライン復活の最新作",
    excerpt: "ジョーダン ブランドの上質素材ライン“BIN23”の最新作となる「Air Jordan 4 BIN23」(品番JA3588-200)のファーストルック画像が公開された。Sneaker Newsが現地時間10月9日に伝え、Sneaker Bar Detroitも同日報じている。BIN23は2026年にAir Jordan 3・6・8で復活してきたライン。発売日・価格は記事執筆時点で明らかにされていない。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "396-nike-kobe-3-mamba-eterno.html",
    cat: "KICKS",
    title: "Nike Kobe 3 Low Protro「Mamba Eterno」が登場 —— 品番IO6260-800、“死者の日”着想の新色",
    excerpt: "ナイキは、コービー・ブライアントのシグネチャーライン「Kobe 3 Low Protro」に、メキシコの伝統行事“死者の日(Dia de los Muertos)”をテーマにした新色「Mamba Eterno」(品番IO6260-800)を投入する。同ラインの中でもとりわけ作り込まれた仕上げになるとみられ、Sneaker Newsが現地時間10月9日に伝えた。発売日・価格は記事執筆時点で明らかにされていない。",
    date: "2026.10.10",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "395-pistons-explored-leonard-durant-trades.html",
    cat: "NBA",
    title: "ピストンズ、今オフにレナード・デュラント獲りを画策 —— 実現せず、デューレンと5年2億ドルで決着",
    excerpt: "デトロイト・ピストンズが今シーズン開幕前のオフシーズン中、カワイ・レナードとケビン・デュラントのトレード獲得を探っていたことが分かった。ESPNのヴィンセント・グッドウィル記者が10月9日(現地時間)に報じた。いずれも実現せず、ピストンズは制限付きFAだったジェイレン・デューレンと5年2億ドルで契約している。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "394-victory-lap-radio-air-force-1-pine-green.html",
    cat: "KICKS",
    title: "Victory Lap Radio x Nike Air Force 1 Low「Pine Green」が登場 —— パテントレザーに差し色、ホリデー発売へ",
    excerpt: "ナイキは、ロンドンを拠点とするプラットフォーム「Victory Lap Radio」とのコラボレーションとして「Air Force 1 Low」の新色「Pine Green」を発表した。パイングリーンのパテントレザーパネリングにオリジナルのブランディンググラフィック、プリント入りインソールを備える。品番JA7805-302、2026年ホリデーシーズンにSNKRSおよび一部グローバル店舗での発売が予定されている。Hypebeastが伝えた。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "393-tominaga-kobe-storks-partner.html",
    cat: "JAPAN",
    title: "富永貿易、神戸ストークスとブロンズパートナー契約を締結 —— 神戸で100年、地域への感謝を未来へ",
    excerpt: "兵庫県神戸市の富永貿易株式会社は、B.LEAGUE PREMIER所属のプロバスケットボールクラブ「神戸ストークス」とブロンズパートナー契約を締結したと発表した。神戸の地で100年以上事業を続けてきた感謝を地域の未来につなぎたいとの思いが背景にある。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "392-lebron-76ers-debut-nets.html",
    cat: "NBA",
    title: "レブロン、76ersで公式戦デビュー —— ネッツ戦で前半10得点5アシスト、キャリア24年目の船出",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズは現地時間10月8日、プレシーズンのブルックリン・ネッツ戦で76ersとして初めてコートに立ち、前半だけで10得点5アシスト4リバウンドを記録した。チームは108-114で敗れた。NBA通算24年目、ニック・ナース新HC体制での船出となった。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "391-venex-wolga-shonan-recovery-wear.html",
    cat: "JAPAN",
    title: "ベネクス、「ウォルガ湘南」とオフィシャルリカバリーウェアサプライヤー契約 —— B.LEAGUE NEXT参戦のチームを「休養」で支援",
    excerpt: "リカバリーウェアを手がける株式会社ベネクスは、りそなグループB.LEAGUE 2026-27シーズン B.LEAGUE NEXTに参戦するプロバスケットボールチーム「ウォルガ湘南」とオフィシャルリカバリーウェアサプライヤー契約を締結したと発表した。VENEXリカバリーウェアや休養の知見提供を通じて選手・スタッフを支える。",
    date: "2026.10.09",
    thumb: "../assets/journal-391-hero.jpg?v=552b2e8116"
  },
  {
    href: "390-syfood-bleague-allstar-2027-partner.html",
    cat: "JAPAN",
    title: "「世界の山ちゃん」のエスワイフード、B.LEAGUE ALL-STAR GAME WEEKEND 2027にイベントパートナー就任 —— 来年1月、名古屋IGアリーナで開催",
    excerpt: "「世界の山ちゃん」を展開する株式会社エスワイフードは、2027年1月15日から17日にかけて愛知県名古屋市のIGアリーナで開催される「りそなグループ B.LEAGUE ALL-STAR GAME WEEKEND 2027 IN AICHI-NAGOYA」のB.LEAGUE EVENT PARTNERSに就任したと発表した。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "389-nigo-nike-air-force-1-j-hope.html",
    cat: "KICKS",
    title: "NIGO® x Nike Air Force 1、BTS j-hopeを迎えたトリプルコラボ —— 「Hobicore」を落とし込んだバーントサンライズ×ゴールド",
    excerpt: "NIGO®とナイキによるコラボプロジェクト「Air Force 1 World Tour」最新作として、BTSのj-hope(ジェイホープ)を共同パートナーに迎えた「NIGO® x Nike Air Force 1」が発表された。2001年発売のAir Force 1のヴィンテージルックを再解釈し、j-hope自身のスタイル「Hobicore」の要素を落とし込んだ一足。Hypebeast、HYPEBEAST JPが伝えた。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "388-jordan-space-jam-30th-collection.html",
    cat: "KICKS",
    title: "Jordan Brand、『スペース・ジャム』30周年コレクションを拡大 —— Air Jordan 11「Space Jam Laser」はF&Fなど限定、Air Jordan 1「Lola Bunny」「Hare」も",
    excerpt: "ジョーダン ブランドは、映画『スペース・ジャム』30周年を記念したコレクションを拡大。Air Jordan 11「Space Jam Laser」は一般発売のない関係者限定仕様で、Air Jordan 1 Low「Lola Bunny」(品番IX6038-100)は2026年ホリデー、Air Jordan 1 Mid「Space Jam Hare」は11月5日に発売される。Sneaker News、Sneaker Bar Detroit、Sneaker Filesが伝えた。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "387-agentbase-levanga-hokkaido-diamond-partner.html",
    cat: "JAPAN",
    title: "エージェントベース、レバンガ北海道とオフィシャルダイヤモンドパートナー契約 —— 10月10日の千葉ジェッツ戦を冠試合に",
    excerpt: "北海道札幌市のAI・Salesforce支援企業エージェントベースは、B.LEAGUE PREMIER所属のレバンガ北海道と2026-27シーズンのオフィシャルダイヤモンドパートナー契約を締結したと発表した。10月10日の千葉ジェッツ戦を冠試合「エージェントベース presents」として北海きたえーるで開催する。",
    date: "2026.10.09",
    thumb: "../assets/journal-387-hero.jpg?v=2efe8aeb55"
  },
  {
    href: "386-nba-fiba-europe-push-continue-euroleague.html",
    cat: "NBA",
    title: "NBAとFIBA「統合拒否のユーロリーグ抜きでも欧州進出は続行」—— 対立の中でも交渉の扉は開く",
    excerpt: "NBAとFIBAは8日(現地時間)、ユーロリーグ加盟クラブによる統合提案拒否を受けても、新リーグ「NBAヨーロッパ」創設を独自に進める方針を共同声明で示した。両者の緊張は高まっているが交渉の余地は残るとESPNが報じた。アダム・シルバーコミッショナーらは中国遠征中の澳門(マカオ)で欧州情勢への対応に当たっている。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "385-nike-giannis-freak-8-star-blue.html",
    cat: "KICKS",
    title: "Nike Giannis Freak 8「Star Blue」が登場 —— 品番IQ7703-400、ターコイズ×ブルーの新色",
    excerpt: "ナイキは、ヤニス・アデトクンボ(マイアミ・ヒート)のシグネチャー8代目モデル「Nike Giannis Freak 8」に新色「Star Blue」(品番IQ7703-400)を投入する。ハイパーターコイズ・グレイシャーブルー・ライトニングを組み合わせた配色で、Sneaker Newsが伝えた。発売日と価格は記事執筆時点で明らかにされていない。",
    date: "2026.10.09",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "384-lendeborg-warriors-preseason.html",
    cat: "NBA",
    title: "ウォリアーズ新人レンデボーグ、プレシーズン2戦で21得点18リバウンド —— カーHC「もう我々のベストプレーヤーの1人」",
    excerpt: "2026年ドラフト全体11位のヤクセル・レンデボーグが、ウォリアーズのプレシーズン開幕2戦で21得点18リバウンド5アシスト2ブロックを記録。カリー・グリーンとのコンビネーションや八村塁への守備対応まで、新人の滑り出しをESPNが詳報した。",
    date: "2026.10.08",
    thumb: "../assets/journal-384-hero.jpg?v=e3dff30df6"
  },
  {
    href: "383-nba-docomo-october-schedule.html",
    cat: "NBA",
    title: "「NBA docomo」10月の配信試合が決定 —— 開幕戦「サンダー vs スパーズ」含む全25試合、八村塁の\"古巣対決\"は2度",
    excerpt: "NTTドコモの映像配信サービス「NBA docomo」は8日、NBA2026-27シーズン10月の配信試合を発表した。10月21日開幕のレギュラーシーズン25試合とプレシーズン5試合を日本語実況・解説付きで配信し、開幕戦の目玉は「オクラホマシティ・サンダー vs サンアントニオ・スパーズ」。八村塁選手が所属するクリッパーズとレイカーズの対戦も10月に2度組まれている。",
    date: "2026.10.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "382-towns-knicks-extension-not-looking-good.html",
    cat: "NBA",
    title: "タウンズ「状況は良くない」—— ニックスとの契約延長、開幕前合意は絶望的に",
    excerpt: "ニューヨーク・ニックスのカール=アンソニー・タウンズ(Karl-Anthony Towns)は5日(現地時間)、契約延長交渉について「状況は良くない」と語り、レギュラーシーズン開幕前の合意は困難との認識を示した。最大4年2億7600万ドルの資格を持つ中、球団側の最新提示は4年総額約2億ドルにとどまるとESPNが報じている。",
    date: "2026.10.08",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "381-haliburton-return-iowa-state-preseason.html",
    cat: "NBA",
    title: "ハリバートン、アキレス腱から400日ぶり実戦復帰 —— 母校アイオワ州立で16分7得点、ペイサーズがプレシーズン開幕戦を快勝",
    excerpt: "インディアナ・ペイサーズのタイリース・ハリバートン(Tyrese Haliburton)は7日(現地時間)、母校アイオワ州立大学で行われたティンバーウルブズとのプレシーズン開幕戦に出場し、右アキレス腱断裂から400日以上ぶりに実戦復帰した。16分の出場で7得点・6アシストを記録し、ペイサーズは123-112で勝利した。",
    date: "2026.10.08",
    thumb: "../assets/journal-381-hero.jpg?v=9836230fd4"
  },
  {
    href: "380-jazz-nurkic-toe-injury-four-weeks.html",
    cat: "NBA",
    title: "ジャズのヌルキッチ、右足第2趾の足底板を部分断裂 —— プレシーズン開幕戦で負傷、4週間後に再評価",
    excerpt: "ユタ・ジャズ(Utah Jazz)は、センターのユスフ・ヌルキッチ(Jusuf Nurkić)がプレシーズン開幕戦で右足第2趾の足底板を部分断裂したと公式サイトで発表した。4週間後に再評価される見通し。",
    date: "2026.10.08",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "379-air-jordan-12-obsidian-2027.html",
    cat: "KICKS",
    title: "Air Jordan 12「Obsidian」が2027年に復刻 —— 品番CT8013-401、ハイトップでは15年ぶり",
    excerpt: "ジョーダン ブランドは、1997年デビューのオリジナルカラー「Air Jordan 12 Obsidian」(品番CT8013-401)を2027年に復刻する。ハイトップ仕様での再展開は2012年以来で、実に15年ぶりとなる。Nice KicksとSneaker Bar Detroitが伝えた。",
    date: "2026.10.08",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "378-adidas-harden-vol-10-snakeskin.html",
    cat: "KICKS",
    title: "adidas Harden Vol. 10「Snakeskin」が10月16日発売 —— 品番KI1612、160ドル",
    excerpt: "ジェームズ・ハーデン(クリーブランド・キャバリアーズ)のシグネチャー10代目モデル「adidas Harden Vol. 10」に新色「Snakeskin」(品番KI1612)が登場。2026年10月16日にadidas.comおよび一部取扱店で発売、価格は160ドルの見通しだと、Nice Kicksが伝えた。",
    date: "2026.10.08",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "377-tubc-bleague-one-attendance-record.html",
    cat: "JAPAN",
    title: "東京ユナイテッドBC、B.LEAGUE ONE最多入場者数を更新 —— 有明アリーナに7,293人、アースフレンズ東京Z戦",
    excerpt: "東京ユナイテッドバスケットボールクラブ(TUBC)は10月3日、有明アリーナで行われたB.LEAGUE 2026-27シーズン B.LEAGUE ONE第2節のアースフレンズ東京Z戦に7,293人を集め、B.LEAGUE ONEの1試合最多入場者数記録を更新したと発表した。",
    date: "2026.10.07",
    thumb: "../assets/journal-377-hero.jpg?v=72ab55ce51"
  },
  {
    href: "376-adidas-anthony-edwards-3-omen.html",
    cat: "KICKS",
    title: "adidas Anthony Edwards 3「Omen」がハロウィンに合わせて発売 —— 品番KJ3021、レッド×シルバーの新色",
    excerpt: "アンソニー・エドワーズの3代目シグネチャー「adidas Anthony Edwards 3」に、新色「Omen」(品番KJ3021)が登場。ハロウィン(10月31日)に合わせて発売される見通しで、アッパーのメッシュ部分にルーシッドレッド、その他にシルバーメタリックを配した、これまでより主張の強い配色になっている。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "375-jordan-tatum-5-laser.html",
    cat: "KICKS",
    title: "Jordan Tatum 5「Laser」が10月10日発売 —— コンセプツ限定の先行販売、ブラウン×レッドの新色",
    excerpt: "ジェイソン・テイタムの3代目シグネチャー「Jordan Tatum 5」に新色「Laser」が登場。ボストンの老舗セレクトショップ、コンセプツ(CNCPTS)限定での先行発売が2026年10月10日に行われる。ブラウンとタンを基調に、レーザーで刻んだようなグラフィックとレッドのアクセントが特徴。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "374-sixers-hukporti-injury-roster-impact.html",
    cat: "NBA",
    title: "フクポルティ離脱で76ers、選手枠の選択迫られる —— ウォーカーの保証額はわずか25万ドル、ボビー・マークス分析",
    excerpt: "アリエル・フクポルティの右アキレス腱断裂を受け、フィラデルフィア・76ersはロースター編成の選択を迫られている。ESPNのボビー・マークス記者が、ファーストエプロンまで残り180万ドルという制約や、ジャバリ・ウォーカー(保証額25万ドル)の処遇を軸にチーム事情を分析した。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "373-nba-bpi-2026-27-projections.html",
    cat: "NBA",
    title: "ESPN「BPI」が2026-27シーズン予測を公開 —— サンダーが守備・優勝オッズで首位、ウォリアーズはバトラー負傷で20位評価",
    excerpt: "ESPNの分析モデル「BPI」が10月20日開幕の2026-27シーズン事前予測を公開。守備力はサンダーが+5.7で断トツ首位、優勝オッズも単独トップに。ウォリアーズはバトラー3世のACL負傷で20位評価、76ersはエンビードの出場率次第という評価になった。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "372-nba-europe-euroleague-reject-merger.html",
    cat: "NBA",
    title: "NBAの「NBAヨーロッパ」統合提案、ユーロリーグが拒否 —— 独自に16チーム構想、2027-28開幕も視野",
    excerpt: "NBAが2年以上かけて提示していた欧州統合案「NBAヨーロッパ」を、ユーロリーグ加盟クラブが今週拒否した。ESPNによると、NBAは拒否後も独自に16チーム規模の新リーグ創設を進める方針で、早ければ2027-28シーズンの開幕を目指す。Brian Windhorst記者が伝えた。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "371-nba-smart-basketball-referee-wearables.html",
    cat: "NBA",
    title: "NBA、「スマートバスケットボール」とレフェリー用リストバンドをプレシーズンで試験導入 —— リプレイ判定の高度化へ、今季はまだ本採用せず",
    excerpt: "NBAは一部のプレシーズンの試合で、Bluetoothセンサーを内蔵した「スマートバスケットボール」と、審判がリプレイセンターと通信できるリストウェアラブルの試験導入を発表した。データ収集が目的で、今季の判定そのものには影響しないという。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "370-spurs-tobias-harris-calf-strain.html",
    cat: "NBA",
    title: "スパーズのトバイアス・ハリス、左ふくらはぎ負傷で開幕戦の出場に黄信号 —— 加入直後、先発定着を目指す中での負傷",
    excerpt: "サンアントニオ・スパーズに今夏加入したトバイアス・ハリスが左ふくらはぎを負傷し、10月20日のレギュラーシーズン開幕戦(オクラホマシティ・サンダー戦)の出場が微妙な情勢になっている。ESPNが伝えた。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "369-hornets-coby-white-calf-strain.html",
    cat: "NBA",
    title: "ホーネッツのコービー・ホワイト、左ふくらはぎ負傷でプレシーズン残り全休 —— カニップルも故障中、バックコートに不安",
    excerpt: "シャーロット・ホーネッツのコービー・ホワイトが左ふくらはぎを負傷し、プレシーズン残り試合を全休することが分かった。夏に3年7400万ドルで再契約した主力ガードの離脱で、ラメロ・ボール放出後のバックコートに不安が残る。ESPNが伝えた。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "368-sixers-hukporti-achilles-season-ending.html",
    cat: "NBA",
    title: "76ersのフクポルティ、右アキレス腱完全断裂で今季絶望 —— プレシーズン開幕戦で負傷、本日手術へ",
    excerpt: "フィラデルフィア・76ersのバックアップセンター、アリエル・フクポルティが右アキレス腱を完全断裂し、今シーズンを絶望視されている。10月5日のプレシーズン開幕戦で負傷し、翌6日のMRIで判明。Shams Charania記者（ESPN）が伝えた。",
    date: "2026.10.07",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "367-circus-kawasaki-bravethunders-sponsor.html",
    cat: "JAPAN",
    title: "circus、川崎ブレイブサンダースの冠スポンサーに就任 —— 11月1日の横浜戦、「UNLOCK YOUR POTENTIAL」掲げ特設ブースも",
    excerpt: "HRTech企業のcircus株式会社は、B.LEAGUE所属・川崎ブレイブサンダースが11月1日に開催するホームゲーム（vs横浜ビー・コルセアーズ）の冠スポンサーに就任したと発表した。代表の矢部貴志氏は中学時代に神奈川県選抜でプレーした経験を持ち、現在同クラブに所属する篠山竜青選手とはかつてのチームメート。",
    date: "2026.10.06",
    thumb: "../assets/journal-367-hero.jpg?v=82e985217b"
  },
  {
    href: "366-nba-new-lottery-rules-tanking.html",
    cat: "NBA",
    title: "新ドラフト抽選ルールでNBAはどう変わる —— ザック・クラム記者が5つの予測、\"タンキング\"は本当に消えるか",
    excerpt: "2026-27シーズンから、NBAは勝率下位チームが故意に負けて指名権を得る\"タンキング\"への対抗策として、抽選方式を大幅に刷新した。ESPNのザック・クラム記者は、大敗の減少や中位チームの混戦化など5つの変化を予測する一方、指名権を自チームで保有しないチームには依然タンキングの誘因が残ると分析している。",
    date: "2026.10.06",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "365-doncic-lakers-kings-preseason-weight.html",
    cat: "NBA",
    title: "レディックHC「夏、本気で体を作り込んだ」—— 絞ったドンチッチがキングス戦21得点、レイカーズがプレシーズン開幕戦を白星発進",
    excerpt: "ロサンゼルス・レイカーズは現地時間10月5日のプレシーズン開幕戦でサクラメント・キングスに127-103で快勝し、ルカ・ドンチッチが16分で21得点を記録した。JJ・レディックHCは「夏の間、本気で体を作り込んだ」とドンチッチの減量を明かした。ESPNが伝えた。",
    date: "2026.10.06",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "364-air-jordan-11-space-jam-2026.html",
    cat: "KICKS",
    title: "Air Jordan 11「Space Jam」が12月12日に\"真のOG仕様\"で復刻 —— 「Green Screen」「WMNS マジックボール」も同時展開",
    excerpt: "ジョーダン ブランドは、映画『スペース・ジャム』のカラーとして知られる「Air Jordan 11」オリジナルカラーを12月12日に復刻発売する。あわせて「Green Screen」(品番IQ5700-900・11月14日)、WMNS「Magic Ball」(品番IZ1800-200・11月11日)も展開し、映画にちなんだ3カラー展開となる。Nice Kicks、Sneaker Filesなどが伝えた。",
    date: "2026.10.06",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "363-nike-lebron-24-stars.html",
    cat: "KICKS",
    title: "Nike LeBron 24「Stars」が11月17日発売 —— 歴代最軽量とされる最新シグネチャー、\"本番\"カラーが登場",
    excerpt: "ナイキは、レブロン・ジェームズの最新シグネチャーモデル「Nike LeBron 24」の正式な一般発売カラー「Stars」(品番IO8204-400)を11月17日に発売する。LeBronシリーズ史上もっとも軽量な仕上がりとされ、数カ月にわたる先行お披露目を経ての\"本番\"投入となる。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.10.06",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "362-hachimura-clippers-camp-notebook.html",
    cat: "NBA",
    title: "八村塁がFG8/11・3P4本と好調 —— ルーキー・ワグラーの終盤ショットでクリッパーズが開幕戦を接戦制す",
    excerpt: "ロサンゼルス・クリッパーズは現地10月4日、ハワイで行われたプレシーズン開幕戦でウォリアーズに104-101で競り勝った。八村塁はFG11本中8本・3P5本中4本と好調で、イングラム離脱の中オフェンスの中心を担い、ルーキーのキートン・ワグラーが終盤の決勝ショットを沈めた。クリッパーズ公式サイトが伝えた。",
    date: "2026.10.06",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "361-clippers-strus-foot-injury-four-weeks.html",
    cat: "NBA",
    title: "クリッパーズのストゥルース、右足底腱膜を部分断裂 —— プレシーズン開幕戦で負傷、4週間後に再評価",
    excerpt: "LAクリッパーズのマックス・ストゥルースは、ハワイで行われたプレシーズン開幕戦で右足の足底腱膜を部分断裂し、4週間後に再評価されることになった。ブランドン・インガムやブラッドリー・ビールらの離脱が続く中でのさらなる負傷で、クリッパーズは開幕前から主力を欠く苦しい状況に置かれている。ESPNが伝えた。",
    date: "2026.10.06",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "359-kaws-air-jordan-4-dark-grey.html",
    cat: "KICKS",
    title: "KAWS×Air Jordan 4「Dark Grey」が2027年夏発売へ —— 10年越しの再タッグ、3代目のコラボカラーに",
    excerpt: "アーティストのKAWSとジョーダン ブランドは、「Air Jordan 4」の新色「Dark Grey」（品番JU4624-002）を2027年夏に発売する見通し。2017年の初コラボからおよそ10年ぶりの再タッグで、実現すればKAWS×Air Jordan 4としては3代目のコラボカラーとなる。Sneaker NewsとSneaker Bar Detroitが伝えた。",
    date: "2026.10.06",
    thumb: "../assets/journal-359-hero.jpg?v=8dc43aa975"
  },
  {
    href: "358-nurse-lebron-recruiting-call-sixers-camp.html",
    cat: "NBA",
    title: "ナース「完璧に当てはまると思った」—— レブロン加入前、ゴルフ場で受けた電話が描いた構想",
    excerpt: "フィラデルフィア・76ersのニック・ナース監督は、レブロン・ジェームズの加入が決まる2週間前の7月中旬、ゴルフ中に代理人リッチ・ポールを介して本人からの電話を受け、オフェンスとディフェンスの基本方針や「フィット」を話し合っていたと明かした。キャンプ初日には4人のスターが自主的にワークアウトで合流し、VJ・エッジコムが仕掛けたグループチャットにジェームズも加わった。ESPNが伝えた。",
    date: "2026.10.05",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "357-nike-dunk-low-jade-stone-old-royal.html",
    cat: "KICKS",
    title: "Nike Dunk Low「Jade Stone/Old Royal」が2026年秋冬発売へ —— 品番IM4414-301、3色を切り分けたマルチカラー",
    excerpt: "ナイキは「Dunk Low」の新色「Jade Stone/Old Royal」（品番IM4414-301、価格120ドル）を2026年秋冬に発売する。トゥやアイステイに差し込んだ鮮やかなオールドロイヤルのスエードが特徴で、ジェイドストーンとライトカーキを組み合わせたマルチカラー仕様。Hypebeastが公式画像を、Sneaker Bar Detroitが詳細を伝えた。",
    date: "2026.10.05",
    thumb: "../assets/journal-357-hero.jpg?v=d2cd0d1d8c"
  },
  {
    href: "356-tissot-supersport-nba.html",
    cat: "CULTURE",
    title: "ティソが新作NBAウォッチ「スーパースポーツ NBA」を発表 —— 文字盤に24秒ルール、河村勇輝がジャパンアンバサダーに",
    excerpt: "スイスの時計ブランド、ティソ（TISSOT）は10月5日、NBAとのパートナーシップから着想を得た新作モデル「ティソ スーパースポーツ NBA」を発表した。文字盤やケースバックにバスケットボールのディテールを落とし込み、価格は77,000円（税込）。ジャパンアンバサダーにはNBA挑戦中の河村勇輝選手が名を連ねる。",
    date: "2026.10.05",
    thumb: "../assets/journal-356-hero.jpg?v=170198c56d"
  },
  {
    href: "355-vrtx-chiba-jets-partner.html",
    cat: "JAPAN",
    title: "VRTX、千葉ジェッツとオフィシャルパートナー契約 —— B.LEAGUE開幕へトレーニングをサポート",
    excerpt: "次世代トレーニングバンド「VRTX」を日本で展開する株式会社Japan Insiderは、B.LEAGUE所属・千葉ジェッツの2026-27シーズンのオフィシャルパートナーに就任したと発表した。トップレベルの競技現場にVRTXを提供するとともに、トレーナーインタビューやトレーニングHOW TO動画も公開する。",
    date: "2026.10.05",
    thumb: "../assets/journal-355-hero.jpg?v=ed595772aa"
  },
  {
    href: "354-lebron-great-first-step-76ers-scrimmage.html",
    cat: "NBA",
    title: "レブロン「目指す方向への大きな一歩」—— 76ers紅白戦に1万人、エンビードも「かなりいい」と手応え",
    excerpt: "フィラデルフィア・76ersは現地時間10月3日、本拠地アリーナで恒例のブルー・ホワイト紅白戦を開催し、約1万人のファンが詰めかけた。レブロン・ジェームズは「目指す方向への大きな一歩になった」と語り、ジョエル・エンビードも前季からの体調の回復ぶりに「かなりいい」と手応えを口にした。ESPNが伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "353-air-jordan-5-halloween.html",
    cat: "KICKS",
    title: "Air Jordan 5「Halloween」が10月17日発売 —— 品番HQ7978-001、蓄光ディテールのブラックベース",
    excerpt: "ジョーダン ブランドは「Air Jordan 5」の新色「Halloween」（品番HQ7978-001）を2026年10月17日にSNKRSおよび一部取扱店舗で発売する。黒を基調に蓄光ディテールと明るい差し色を効かせたハロウィーン向けの一足。Nice KicksとSneaker Bar Detroitが伝えた。",
    date: "2026.10.04",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "352-nike-kobe-ad-protro-purple-stardust.html",
    cat: "KICKS",
    title: "Nike Kobe AD Protro「Purple Stardust」が始動 —— 品番IO8233-500、2016年オリジナルカラーが復刻",
    excerpt: "ナイキは「Kobe AD Protro」の新色「Purple Stardust」（品番IO8233-500）の公式写真を公開した。2016年のオリジナル「Kobe AD」のカラーをプロトロ仕様で復刻し、2026年のホリデーシーズンに発売予定。Sneaker Bar Detroitが伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "351-grizzlies-waive-hawkins.html",
    cat: "NBA",
    title: "グリズリーズ、ホーキンスをウェイブ —— ペリカンズとのトレード成立からわずか3週間",
    excerpt: "メンフィス・グリズリーズはガードのジョーダン・ホーキンスをウェイバーで放出することに合意した。2023年ドラフト14位指名のホーキンスはフリーエージェントとして新天地を探す。ペリカンズからのトレードでグリズリーズに加入してからわずか3週間での決断で、ESPNのシャムズ・チャラニア記者が情報筋の話として伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "350-wleague-2026-27-okinawa-opener.html",
    cat: "JAPAN",
    title: "Wリーグ、沖縄サントリーアリーナで開幕戦 —— 沖縄出身の安間志織・伊波美空が出場、キングスと初の同日開催",
    excerpt: "バスケットボール女子日本リーグ(Wリーグ)は2026-27シーズンの開幕戦を10月31日(土)・11月1日(日)、沖縄サントリーアリーナで開催する。沖縄アリーナ株式会社の自主事業で、琉球ゴールデンキングスのホームゲームと初めて同日開催。対戦カードはトヨタ自動車アンテロープス対トヨタ紡織サンシャインラビッツで、沖縄県出身の安間志織選手・伊波美空選手が出場する。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "349-nba-expansion-vegas-seattle-blazers.html",
    cat: "NBA",
    title: "NBA拡張、シルバー委員長が年内投票を目指す —— ラスベガス落選組はシアトルへ、ブレイザーズに思わぬ余波",
    excerpt: "ESPNのラモーナ・シェルバーン記者が、NBA拡張(新規2球団追加)に関する最新の内部情報を報じた。シルバー委員長は年内の理事会投票を目指し、ラスベガスで落選した陣営がシアトル市場へ回る可能性があるという。ポートランド・トレイルブレイザーズの新オーナーが移転をちらつかせる交渉材料にしている側面も浮上している。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "348-jordan-6-rings-winterized-cobalt-blue.html",
    cat: "KICKS",
    title: "Jordan 6 Rings Winterized「Cobalt Blue」が2026年冬発売へ —— 防寒仕様の新色、品番IX8456-479",
    excerpt: "ジョーダン ブランドは、定番シルエット「Jordan 6 Rings」の防寒仕様モデル「Winterized」に新色「Cobalt Blue」を投入し、2026年冬に発売する予定。品番はIX8456-479。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "347-nike-air-foamposite-one-glow-in-the-dark.html",
    cat: "KICKS",
    title: "Nike Air Foamposite One PRM「Glow in the Dark」が10月16日発売 —— 品番IV6246-100、SNKRSで",
    excerpt: "ナイキは、伝説的なバスケットボールシューズ「Nike Air Foamposite One」のプレミアムモデル「PRM」で、新色「Glow in the Dark」を2026年10月16日にSNKRSで発売する。品番はIV6246-100。Nice Kicksが伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "346-nike-kobe-ad-protro-laser-orange.html",
    cat: "KICKS",
    title: "Nike Kobe AD Protro「Laser Orange」が始動 —— 品番IO8233-800の新色先行カット",
    excerpt: "ナイキは「Kobe AD Protro」の新色「Laser Orange」（品番IO8233-800）の先行カットを公開した。コービー・ブライアントのパフォーマンスラインの最新カラーで、発売日・価格は現時点で未定。Sneaker Newsが伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "345-air-jordan-3-middle-east.html",
    cat: "KICKS",
    title: "Air Jordan 3「Middle East」発表 —— 中東地域限定、タンにアラビア数字の「23」",
    excerpt: "ジョーダン ブランドは中東地域限定の新色「Air Jordan 3『Middle East』」（品番IX6986-047）を発表した。通常のカラーウェイに地域名を添えるのではなく、タンにアラビア数字の「23」を配したディテールを加え、ホリデーシーズンに中東地域で限定発売する。Sneaker News・Nice Kicksなどが伝えた。",
    date: "2026.10.03",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "344-johnson-donovan-spurs-assistant.html",
    cat: "NBA",
    title: "ジョンソンHC「袖をまくって、手を汚して働いてくれている」—— スパーズ新アシスタントのドノバンに感謝",
    excerpt: "サンアントニオ・スパーズのミッチ・ジョンソンHCは現地時間10月1日、新加入のアシスタントコーチ、ビリー・ドノバン氏について「袖をまくって、手を汚して働いてくれている」と評価した。ドノバン氏は7月、守備を改善させたシーン・スウィニー前アシスタントの後任としてスタッフに加わった。ESPNが伝えた。",
    date: "2026.10.02",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "343-shinjuku-givers-3x3-season2.html",
    cat: "JAPAN",
    title: "新宿givers、3x3.EXE PREMIERで年間2位 —— エスター選手が168得点で得点女王に、大阪PLAYOFFSへ",
    excerpt: "女子3人制バスケットボールチーム「新宿givers」は2026年9月26日に終えた3x3.EXE PREMIER 2026 WOMEN'S JAPANのレギュラーシーズン全8Roundを565ポイントの年間2位で終えた。イベ・エスター・チカンソ選手は通算168得点で得点ランキング1位。チームは10月3日・4日に大阪で開催されるPLAYOFFSに進出する。",
    date: "2026.10.02",
    thumb: "../assets/journal-343-hero.jpg?v=a213d0ab62"
  },
  {
    href: "342-nishida-brothers-fan-space.html",
    cat: "JAPAN",
    title: "Bリーグ・西田三兄弟のファンコミュニティ「海部の三兄弟」SPACE開設 —— 徳島の旧地名に由来、三者三様のキャリアをつなぐ",
    excerpt: "日本のプロバスケットボール選手、西田優大・公陽・陽成の三兄弟を応援するデジタルファンコミュニティ「海部の三兄弟」SPACEが10月1日、BIGCのプラットフォーム上にオープンした。名称は3人が育った徳島県海陽町の旧称「海部町」に由来する。株式会社ビックジャパンが発表した。",
    date: "2026.10.02",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "341-duren-pistons-200m-deal-agreed.html",
    cat: "NBA",
    title: "デューレン、ピストンズと5年2億ドルで合意 —— 4ヶ月の契約交渉に決着、QO期限の土壇場で決断",
    excerpt: "デトロイト・ピストンズのオールNBAセンター、ジェイレン・デューレンが5年2億ドルの完全保証契約でチーム残留に合意した。代理人がESPNのシャムズ・シャラニア記者に伝えた。制限付きフリーエージェントとして臨んだ夏からの交渉は、1年996万ドルのクオリファイングオファーを受諾する期限の土壇場で決着した。",
    date: "2026.10.02",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "340-nurse-lebron-offense-creator.html",
    cat: "NBA",
    title: "ナース「レブロンは稀代のテーブルセッター」—— 76ers、キャンプ3日目でオフェンスの役割分担が明確に",
    excerpt: "フィラデルフィア・76ersのニック・ナース監督は現地時間10月1日、トレーニングキャンプ3日目の練習後、レブロン・ジェームズのオフェンスでの役割について「得点源というより、オフェンスの創造者でテーブルセッターだと思う」と語った。ジェイレン・ブラウンもポストプレーでのスペーシングについて言及した。ESPNが伝えた。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "339-wembanyama-betting-sites.html",
    cat: "NBA",
    title: "ウェンバンヤマ「絶対にやらない」—— ベッティングサイトの宣伝は拒否、「良い形で人を鼓舞したい」",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間10月1日、トレーニングキャンプの練習後にスポーツベッティングサイトを宣伝する考えはないと明言した。レブロン・ジェームズやケビン・デュラントら宣伝する同僚とは一線を画す姿勢を示した。ESPNのマイケル・C・ライト記者が伝えた。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "338-unext-easl-2026-27-live.html",
    cat: "JAPAN",
    title: "U-NEXT、EASL 2026-27シーズン全試合を独占ライブ配信 —— 長崎ヴェルカ・琉球キングス・アルバルク東京が参戦、日本戦は日本語実況付き",
    excerpt: "動画配信サービス「U-NEXT」は、東アジアスーパーリーグ(EASL)2026-27シーズンの全試合を見放題で独占ライブ配信する。日本戦は全試合日本語実況・解説付き。開幕戦は10月3日、フィリピン・セブで行われる。株式会社U-NEXTが10月1日発表した。",
    date: "2026.10.01",
    thumb: "../assets/journal-338-hero.jpg?v=3cf5db0f62"
  },
  {
    href: "337-donovan-mitchell-adidas-extension.html",
    cat: "KICKS",
    title: "ドノバン・ミッチェル、アディダスと複数年契約を延長 —— 10作目のシグネチャーモデルへ、現役では7人目の到達",
    excerpt: "クリーブランド・キャバリアーズのドノバン・ミッチェルは、アディダスと新たな複数年契約延長を締結した。10作目のシグネチャーモデルに向けた契約で、現役NBA選手としては7人目の節目となる。ESPNのシャムズ・シャラニア記者が現地時間10月1日に伝えた。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "336-jamal-shead-raptors-extension.html",
    cat: "NBA",
    title: "ラプターズ、ジャマール・シードと3年2400万ドルの契約延長で合意 —— 控えからベンチ最多アシストの司令塔へ",
    excerpt: "トロント・ラプターズは、ガードのジャマール・シード選手と3年2400万ドルの契約延長で合意した。ESPNのシャムズ・シャラニア記者が現地時間10月1日、代理人のKJ・スミス氏の話として伝えた。新契約により2029-30シーズンまでラプターズに所属する。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "335-kobe-air-force-1-purple-stardust.html",
    cat: "KICKS",
    title: "Kobe Bryant x Nike Air Force 1 Low「Black/Purple Stardust」が発売 —— バスケ発のアイコンにコービーの名を冠した新色",
    excerpt: "ナイキは、コービー・ブライアントの名を冠した「Kobe Bryant x Nike Air Force 1 Low」の新色「Black/Purple Stardust」(品番IB0018-007)を2026年10月1日に発売した。価格・取扱店舗は本稿執筆時点で明らかになっていない。Nice Kicksが伝えた。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "334-nba-coaches-under-pressure.html",
    cat: "NBA",
    title: "開幕前、最も重圧を背負う監督5人 —— ESPNがプレビュー、トップは76ersのナース「レブロン×エンビード」の共存術",
    excerpt: "ESPNは10月1日（現地時間）、開幕前に最も重圧を背負うNBA監督5人を選ぶプレビュー記事を掲載した。キャバリアーズのアトキンソン、ナゲッツのアデルマン、スパーズのジョンソン、ロケッツのウドカを挙げた上で、単独トップにはレブロン・ジェームズを迎えた76ersのニック・ナース監督を選出。ベン・ゴリバー記者が分析した。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "333-nike-lebron-24-greater-china.html",
    cat: "KICKS",
    title: "Nike LeBron 24「Greater China」10月9日発売 —— 吉祥の雲文様をまとった旧正月限定モデル、品番IX5105-200",
    excerpt: "ナイキは、レブロン・ジェームズのシグネチャーモデル「LeBron 24」の新色「Greater China」（品番IX5105-200）を、中国本土・香港・マカオ・台湾で10月9日に発売する。旧正月を祝う中国の伝統的な雲文様「祥雲」をベージュのKingknitメッシュアッパーに赤のアクセントで描いた限定モデルで、価格は190米ドル。Hypebeastが伝えた。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "332-air-jordan-4-amazonas-j-balvin.html",
    cat: "KICKS",
    title: "J Balvin x Air Jordan 4「Amazonas」10月2日発売 —— コロンビアの生物多様性を纏った新色、英西2カ国語の「Just Do It」",
    excerpt: "ジョーダン ブランドは、コロンビア出身のシンガーソングライター J・バルヴィンとのコラボレーション最新作「Air Jordan 4『Amazonas』」を、10月2日午前9時より『SNKRS』などで発売する。価格は34,100円（税込）。コロンビアの豊かな生物多様性を鮮やかな配色で表現し、シューレースには英語とスペイン語の2カ国語で「Just Do It」をあしらった。Hypebeastが伝えた。",
    date: "2026.10.01",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "331-igarashi-venex-ambassador.html",
    cat: "JAPAN",
    title: "ベネクス、日本バスケ界のレジェンド・五十嵐圭選手とアンバサダー契約 —— 現役24年目、支えるのは「質の高いリカバリー」",
    excerpt: "リカバリーウェアを手がける株式会社ベネクスは、新潟アルビレックスBB所属の五十嵐圭選手とアンバサダー契約を締結したと10月1日発表した。46歳・現役24年目の五十嵐選手は2017年からVENEXリカバリーウェアを愛用してきたという。",
    date: "2026.10.01",
    thumb: "../assets/journal-331-hero.jpg?v=84a3150731"
  },
  {
    href: "330-air-jordan-4028-black-volt.html",
    cat: "KICKS",
    title: "Air Jordan 4028「Black/Barely Volt」10月2日発売 —— アディバヨの83得点試合で火がついた、XX8の伝説カラーが復刻",
    excerpt: "ジョーダン ブランドは、「Air Jordan 4028」の新色「Black/Barely Volt」（品番IR2084-001）を10月2日に発売する。マイアミ・ヒートのバム・アディバヨが2026年3月の83得点の試合でサンプルを着用し注目された一足で、2013年発表の「Air Jordan XX8」のブラック×ブライトグリーンの配色を復刻している。Sneaker Bar Detroitが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "329-ryan-nembhard-nuggets-two-way.html",
    cat: "NBA",
    title: "ナゲッツ、ライアン・ネムハードとツーウェイ契約で合意 —— ホーネッツ移籍から1週間余りで新天地へ",
    excerpt: "デンバー・ナゲッツは、ガードのライアン・ネムハード選手とツーウェイ契約で合意した。ESPNのシャムズ・シャラニア記者が現地時間9月30日、複数の関係筋の話として伝えた。ネムハード選手は9月にホークスからホーネッツへトレードされたばかりで、1週間余りで新天地へ移る。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "328-towns-knicks-pay-cut-andrews.html",
    cat: "NBA",
    title: "タウンズ、契約延長で\"減俸\"は受け入れる構え —— ニックスの提示額は「妥当ではない」とアンドリュース記者",
    excerpt: "ニューヨーク・ニックスのカール＝アンソニー・タウンズは、契約延長交渉でジェイレン・ブランソンに続く減俸を受け入れる用意がある一方、球団側が求める減俸幅は妥当ではないと受け止めていることが分かった。ESPNのマリカ・アンドリュース記者が現地時間9月29日、番組「NBA Today」で伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-328-hero.jpg?v=eef9cf375c"
  },
  {
    href: "327-maxey-76ers-judged-by-winning.html",
    cat: "NBA",
    title: "マクシー「勝つことで判断されたい」—— 76ersキャンプ2日目、キャリアハイ翌季も個人成績にこだわらず",
    excerpt: "フィラデルフィア・76ersのタイリース・マクシーは現地時間9月30日、トレーニングキャンプ2日目の練習後に「勝つことで判断されたい」と語った。平均28.3得点でキャリアハイを記録した昨シーズンに続き、個人成績よりチームの勝敗を最優先する考えを明らかにした。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "326-jordan-jersey-record-auction.html",
    cat: "NBA",
    title: "ジョーダンの「ラストダンス」第3戦ジャージが1226万ドルで落札 —— NBAジャージ史上最高額を更新",
    excerpt: "マイケル・ジョーダンが1998年NBAファイナル第3戦で着用したブルズのユニフォームが現地時間9月30日、オークションで1226万ドル(約18億円)で落札され、NBAジャージ史上最高額を更新した。これまでの記録も同じ1998年ファイナルシリーズのジョーダンのジャージだった。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "325-bs10-bpremier-free-broadcast.html",
    cat: "JAPAN",
    title: "BS10、10月は毎週土曜にB.PREMIER5試合を全国無料生中継 —— 「バスケ魂」含め今シーズン累計約20試合を放送予定",
    excerpt: "株式会社ジャパネットブロードキャスティングが運営する無料BS放送局「BS10」は、B.LEAGUEの新トップカテゴリー「B.PREMIER」の試合を10月の毎週土曜日に全国無料生中継すると発表した。対象は滋賀vs琉球、長崎vs群馬など5試合。レギュラー番組「バスケ魂」と合わせ、今シーズン累計約20試合を放送予定。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "324-nike-caitlin-1-halloween.html",
    cat: "KICKS",
    title: "Nike Caitlin 1「Halloween」10月23日発売 —— グロー・イン・ザ・ダークのアウトソール、品番JA4290-001",
    excerpt: "ナイキは、ケイトリン・クラーク初のシグネチャーシューズ「Nike Caitlin 1」のホリデーカラー「Halloween」を10月23日に発売する。ブラックベースにアウトソールとブランディングが暗闇で光る仕様。価格150ドル、品番JA4290-001。Hypebeastが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-324-hero.jpg?v=5b15e70027"
  },
  {
    href: "323-uniqlo-jwbf-partnership.html",
    cat: "JAPAN",
    title: "ユニクロ、日本車いすバスケットボール連盟とパートナーシップ契約 —— 国枝慎吾氏の縁で日本代表・次世代チームにLifeWearを提供",
    excerpt: "株式会社ユニクロは、一般社団法人日本車いすバスケットボール連盟（JWBF）と2029年3月31日までのパートナーシップ契約を締結したと発表した。オフィシャルスポンサー兼サプライヤーとして、車いすバスケットボール日本代表男女と次世代チームにユニフォームなどのLifeWearを提供する。",
    date: "2026.09.30",
    thumb: "../assets/journal-323-hero.jpg?v=3f64828cd4"
  },
  {
    href: "322-quest-kawasaki-brave-thunders-partner.html",
    cat: "JAPAN",
    title: "クエスト、川崎ブレイブサンダースとオフィシャルパートナー契約 —— 2026-27シーズンから地域活性化を支援",
    excerpt: "ITコンサルティング事業を手がける株式会社クエスト（東証スタンダード上場）は、B.LEAGUE PREMIER所属・川崎ブレイブサンダースと2026-27シーズンからのオフィシャルパートナー契約を締結したと発表した。グループ会社が長年続けてきた支援をクエストが引き継ぐ形で、公式サイトへのロゴ掲出や会場広告を通じ、クラブと地域社会とのつながりを深めるとしている。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "321-nba-push-off-officiating.html",
    cat: "NBA",
    title: "NBA、プッシュオフ厳格化へ新指針「4つのF」—— ジョーダンの伝説のシュートも新基準では反則にならず",
    excerpt: "NBAは現地時間9月29日、審判向けに新しい判定指針を発表した。得点上昇が続く中、オフェンス側が非ドリブル側の腕を使ってディフェンスを押し離す「プッシュオフ」を「feeling／firming／force／full extension」の「4つのF」基準で判定する。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "320-sga-mvp-threepeat.html",
    cat: "NBA",
    title: "ギルジャス＝アレクサンダー「MVPの決定なんて82試合先の話」—— 史上初の3連覇へ、冷静に開幕を待つ",
    excerpt: "サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間9月28日のメディアデーで、史上初となるMVP3年連続受賞の可能性を問われ「MVPの決定なんて、文字通り82試合先の話だ」と述べた。ESPNの事前予想では受賞確率4位。3連覇は1984〜86年のラリー・バード以来40年ぶりの快挙となる。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "319-kawhi-leonard-raptors-media-day.html",
    cat: "NBA",
    title: "カワイ「自分が騒動の種になっていた」—— ラプターズ加入後初のメディアデーで、調査には触れず前進を選ぶ",
    excerpt: "トロント・ラプターズのカワイ・レナードは現地時間9月28日、移籍後初のメディアデーでNBAとNBA選手会が進める調査について問われ、「自分は70日間、騒動の種になっていた」と述べた上で、詳細には触れずラプターズでの新シーズンに集中する考えを示した。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "318-chiba-sky-wings-3x3-miyako.html",
    cat: "JAPAN",
    title: "CHIBA SKY WINGS女子、3x3宮古大会で優勝 —— 21-17で決勝制し日本選手権への出場権",
    excerpt: "3x3チーム「CHIBA SKY WINGS」の女子チームは2026年9月27日、岩手県宮古市で開催された「3x3 TOHOKU 2026 - MIYAKO STOP」で優勝した。中山桂・石田悠月・田戸郁乃の3選手が決勝でXDに21-17で勝利し、2027年2月の第12回3x3日本選手権大会への出場権を獲得した。",
    date: "2026.09.30",
    thumb: "../assets/journal-318-hero.jpg?v=5ea70e58b8"
  },
  {
    href: "317-kessler-lakers-defense.html",
    cat: "NBA",
    title: "ケスラー「うちは意地の悪い守備チームになる」—— レイカーズ新体制、キャンプ初日から自信",
    excerpt: "レイカーズのウォーカー・ケスラーは現地時間9月29日、キャンプ初日を終えて「うちは意地の悪い守備チームになると思う」と語った。ルカ・ドンチッチ主体の新体制で、周辺の守備陣にも自信を示した。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "316-brandon-ingram-achilles-clippers.html",
    cat: "NBA",
    title: "クリッパーズのインガム、アキレス腱部分断裂 —— 2026-27シーズン開幕に間に合わず",
    excerpt: "LAクリッパーズは、ブランドン・インガムの足に部分的なアキレス腱断裂が見つかったと発表した。今夏のヒール手術後に判明したもので、2026-27シーズンの開幕には間に合わない見通し。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "315-embiid-full-participant-sixers-practice.html",
    cat: "NBA",
    title: "エンビード「フル参加」で76ers始動 —— ナース監督「非常に良いニュース」、故障続きからの復調に手応え",
    excerpt: "フィラデルフィア76ersのジョエル・エンビードは現地時間9月29日、トレーニングキャンプの初練習に最初から最後までフル参加した。ニック・ナースHCは「非常に良いニュースだ」と評価。直近3シーズンで150試合を欠場してきただけに、上々の滑り出しとなった。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "314-nba-vegas-expansion-bids.html",
    cat: "NBA",
    title: "NBA、ラスベガス拡張枠の入札を最終候補3グループに絞る —— 総額120億〜130億ドル規模",
    excerpt: "NBAはラスベガスに新設する拡張枠球団のオーナー候補を、最終候補3グループに絞り込んだ。フランチャイズと新アリーナを合わせた総額は少なくとも120億〜130億ドル規模になる見込みで、リーグは年内にラスベガスとシアトルの拡張2球団について正式な承認プロセスを行う予定だという。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "313-new-balance-maxey-v1.html",
    cat: "KICKS",
    title: "タイリース・マクシー、New Balanceと初のシグネチャーモデル「Maxey v1」発表",
    excerpt: "New Balanceは、フィラデルフィア・76ersのタイリース・マクシーとの初のシグネチャーモデル「Maxey v1」を発表した。パフォーマンスバスケットボールを軸にした一足だという。カラー・価格・発売日は現時点で明らかになっていない。Nice Kicksが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "312-suns-ishbia-mortgage-no-effect.html",
    cat: "NBA",
    title: "サンズ会長イシュビア「金融会社の不調、影響はゼロ」—— 保有比率、80%への積み増しも表明",
    excerpt: "フェニックス・サンズのオーナー、マット・イシュビアは現地時間9月28日、自身が創業した住宅ローン会社の業績不振について「チーム経営には全く関係ない」と述べた。球団の保有比率をさらに14%積み増し、約80%まで引き上げる意向も明らかにした。ESPNが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "311-air-jordan-4-light-army.html",
    cat: "KICKS",
    title: "Air Jordan 4「Light Army」、10月31日にヨーロッパ限定発売 —— 品番JA5911-320",
    excerpt: "ジョーダン ブランドは、Air Jordan 4の新色「Light Army」（品番JA5911-320）を2026年10月31日にヨーロッパの一部店舗限定で発売する。他地域での発売は現時点で明らかになっていない。Nice Kicksが伝えた。",
    date: "2026.09.30",
    thumb: "../assets/journal-311-hero.jpg?v=1a6657a22f"
  },
  {
    href: "310-ss-andteras-partnership.html",
    cat: "JAPAN",
    title: "SS、アンドテラスとトップパートナー契約 —— 3x3の関口サムエル、2028年ロス五輪目指し名古屋の不動産会社と提携",
    excerpt: "2025年創設のプロ3x3クラブ「SS」（東京都新宿区、代表・関口サムエル）は9月29日、愛知県名古屋市の不動産会社アンドテラスとトップパートナー契約を締結したと発表した。関口は2028年ロサンゼルス五輪の3x3日本代表出場を目指しており、アンドテラスは子どもたちへ夢を伝えるという理念への共感からパートナーに加わったとしている。",
    date: "2026.09.29",
    thumb: "../assets/journal-310-hero.jpg?v=aebf60364f"
  },
  {
    href: "309-air-jordan-4-j-balvin-amazonas.html",
    cat: "KICKS",
    title: "J Balvin x Air Jordan 4「Amazonas」発表 —— コロンビアの生物多様性を色彩で表現、2言語ロゴも",
    excerpt: "J Balvinとジョーダン ブランドは、Air Jordan 4の新色「Amazonas」を発表した。Balvinの故郷コロンビアの生物多様性から着想を得た配色で、英語・スペイン語の2言語で「Just Do It」をあしらったシューレース飾りとジャンプマン×J Balvinのロゴを採用。発売日・価格は現時点で明らかになっていない。FLY BASKETBALL CULTURE MAGAZINEが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-309-hero.jpg?v=1a6657a22f"
  },
  {
    href: "308-bronny-james-own-path.html",
    cat: "NBA",
    title: "ブロニー・ジェームズ「彼には彼の道、僕には僕の道がある」—— レブロンの76ers移籍後、レイカーズで自分を証明する道へ",
    excerpt: "ロサンゼルス・レイカーズのブロニー・ジェームズは現地時間9月28日のメディアデーで、父レブロン・ジェームズが今夏フィラデルフィア76ersへ移籍したことについて「彼には彼の道があり、僕には僕の道がある」と語った。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "307-dylan-harper-spurs-role.html",
    cat: "NBA",
    title: "ハーパー「コーチが望む場所に、喜んで入る」—— 役割論争にスパーズのガードが淡々と応じる",
    excerpt: "サンアントニオ・スパーズのディラン・ハーパーは現地時間9月28日のメディアデーで、オフシーズンに注目された自身の役割について「コーチ陣が最善だと考える場所に、喜んで入る」と語った。チームの勝利に何ができるかを最優先に挙げた。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "306-embiid-76ers-extremely-excited.html",
    cat: "NBA",
    title: "エンビード「このチームには本気で興奮している」—— レブロン加入の76ers、正しい組み合わせに手応え",
    excerpt: "フィラデルフィア76ersのジョエル・エンビードは現地時間9月28日のメディアデーで、ジェイレン・ブラウン獲得とレブロン・ジェームズ加入を経た今季のチームについて「このチームには本気で興奮している」と語った。ベテランと若手の組み合わせを評価した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "305-tatum-comfortable-leading-celtics-post-brown-trade.html",
    cat: "NBA",
    title: "テイタム「とても心地いい」—— ブラウン放出後の新生セルティックス、10年目でリーダーシップ引き受け",
    excerpt: "ボストン・セルティックスのジェイソン・テイタムは現地時間9月28日のメディアデーで、長年の相棒ジェイレン・ブラウンが76ersへトレードされた後のチームを率いることについて「とても心地いい。10年目だから」と語った。ポール・ジョージやミッチェル・ロビンソンらを加えた新体制での船出となる。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "304-zion-williamson-not-where-i-want-to-be.html",
    cat: "NBA",
    title: "ザイオン・ウィリアムソン「まだそこには届いていない」—— 8年目の減量成功、ペリカンズは契約延長より再建優先で一致",
    excerpt: "ニューオーリンズ・ペリカンズのザイオン・ウィリアムソンは現地時間9月28日のメディアデーで、自身のキャリア7年間を振り返り「まだそこには届いていない」と語った。体重を284ポンドから277ポンドに落としてキャンプ入りしており、ジョー・デュマース副社長は「理想的な状態」と評価した。契約延長交渉はチーム再建を優先し先送りする考えも示した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "303-anthony-davis-wizards-extension-wait.html",
    cat: "NBA",
    title: "デイビス「シーズンが終わってから」—— ウィザーズ残留の判断、契約延長交渉は開幕後に持ち越し",
    excerpt: "ワシントン・ウィザーズのアンソニー・デイビスは現地時間9月28日のメディアデーで、契約延長を巡る交渉について「シーズンが終わってから、あらためてフロントと話す」と述べ、判断をシーズン終了後に持ち越す考えを示した。8月に延長交渉の資格を得ていた。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "302-jimmy-butler-acl-rehab-ahead.html",
    cat: "NBA",
    title: "バトラー「僕の数値は驚異的」—— ACL手術から8カ月、ウォリアーズのメディアデーで回復に自信",
    excerpt: "ゴールデンステート・ウォリアーズのジミー・バトラーは現地時間9月28日のメディアデーで、右膝前十字靭帯(ACL)断裂の手術からおよそ8カ月が経過したリハビリの経過について「数値は予定より先行している」と自信を語った。復帰時期は明言しなかった。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "301-edwards-cede-pg-duties-lamelo-ball.html",
    cat: "NBA",
    title: "アンソニー・エドワーズ「もう1人で運ばなくていい」—— ボール加入でSG回帰、守備に集中する新シーズンへ",
    excerpt: "ミネソタ・ティンバーウルブズのアンソニー・エドワーズは現地時間9月28日のメディアデーで、新加入のラメロ・ボールにポイントガード業務を委ね、本来のシューティングガードに専念する姿勢を語った。ボール運びから解放されることで守備によりエネルギーを割けるとした。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "300-knicks-brown-towns-hart-extensions.html",
    cat: "NBA",
    title: "ブラウンHC「部屋に象は作らない」—— ニックス、タウンズに続きハートの契約延長交渉も難航中と判明",
    excerpt: "ニューヨーク・ニックスのマイク・ブラウンHCは現地時間9月28日、カール=アンソニー・タウンズとジョシュ・ハートの契約延長交渉について「腫れ物扱いにはしない」と述べた。タウンズだけでなくハートの延長交渉も難航していることが新たに判明した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "299-bucks-trent-jr-investigation.html",
    cat: "NBA",
    title: "バックス、トレント・Jr.契約のNBA調査に「特に進展なし」—— エデンス共同オーナー、キャップ規定違反の疑いでリーグに全面協力と説明",
    excerpt: "ミルウォーキー・バックスのウェス・エデンス共同オーナーは現地時間9月28日のメディアデーで、ゲイリー・トレント・ジュニアの契約を巡るNBAの調査について「開示できる進展はない」と述べた。NBAは今オフに結んだ契約にサラリーキャップ規定違反の疑いがあるとみて調査している。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "298-sga-vaa-air-force-1-low.html",
    cat: "KICKS",
    title: "ギルジャス＝アレクサンダー、未発売「V.A.A. x Nike Air Force 1 Low」をメディアデーで —— コンバースからの移籍後、鮮烈なオレンジ",
    excerpt: "オクラホマシティ・サンダーのシャイ・ギルジャス＝アレクサンダーは現地時間9月28日のチームメディアデーで、未発売の「Virgil Abloh Archive（V.A.A.）x Nike Air Force 1 Low」を鮮やかなオレンジのカラーで着用した。コンバースからナイキへ移籍して以降でも目を引く一足になった。Sneaker News・Sneaker Bar Detroitが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "297-pistons-bickerstaff-cunningham-better.html",
    cat: "NBA",
    title: "カニングハムに「もっと良いバージョン」—— ピストンズHC保証、専用シグネチャーシューズも始動へ",
    excerpt: "デトロイト・ピストンズのJ・B・ビッカースタッフHCは現地時間9月28日のメディアデーで、ケイド・カニングハムについて「もっと良いバージョン」を今季見せると保証した。カニングハムはこの日、自身の新シグネチャーシューズにつながるNike S.T. Chargeの新色を履いて登場した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "296-lillard-morant-blazers-backcourt.html",
    cat: "NBA",
    title: "リラード「バランスは自然と解決する」—— ブレイザーズの過密バックコート、モラントも「再出発」",
    excerpt: "ポートランド・トレイルブレイザーズのデイミアン・リラードは現地時間9月28日のメディアデーで、ジャ・モラント、ドリュー・ホリデー、スクート・ヘンダーソンと重なる過密バックコートについて「バランスは自然と解決する」と語った。アキレス腱断裂から復帰したリラードは「制限は何もない」とも明かした。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "295-76ers-sacrifice-media-day.html",
    cat: "NBA",
    title: "レブロン「犠牲は前向きなことだ」—— 76ers新布陣、メディアデー前から4人で自主合流",
    excerpt: "フィラデルフィア・76ersのレブロン・ジェームズは現地時間9月28日のメディアデーで、ジョエル・エンビード、タイリース・マクシー、ジェイレン・ブラウンとの新布陣について「集団としての犠牲」が必要だと語った。4人はメディアデー前に自主的に合同ワークアウトを行っていたこともESPNの取材で判明した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "294-hornets-waive-dillingham.html",
    cat: "NBA",
    title: "ホーネッツ、獲得2日でディリングハムを解雇 —— 元8位指名、トレード直後の再放出に",
    excerpt: "シャーロット・ホーネッツは現地時間9月28日、ガードのロブ・ディリングハムを解雇すると発表した。ディリングハムは9月26日にブルズからバディ・ヒールドと現金を対価にトレードで獲得されたばかりで、獲得からわずか2日での再放出となった。ホーネッツはこの動きで960万ドルのトレード例外枠を得る。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "293-sga-third-mvp-thunder.html",
    cat: "NBA",
    title: "ギルジャス＝アレクサンダー「MVPの答えは82試合先」—— 3年連続なら1986年のバード以来、サンダーのメディアデーで淡々",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間9月28日のメディアデーで、自身の3年連続NBA MVPについて問われ、「答えは82試合先の話だ」と述べ、開幕前から意識しすぎない考えを示した。3年連続MVPは1984〜86年のラリー・バード以来誰も達成しておらず、ESPNの「サマー・フォーキャスト」でも2027年MVP候補の4番手に位置付けられている。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "292-thunder-daigneault-spurs-media-day.html",
    cat: "NBA",
    title: "デイグノルトHC「スパーズと82試合戦うわけじゃない」—— サンダー、経験を糧に新シーズンへ",
    excerpt: "オクラホマシティ・サンダーのマーク・デイグノルトHCは現地時間9月28日のメディアデーで、昨季ウェスタン・カンファレンス決勝で敗れたスパーズについて「スパーズと82試合戦うわけじゃない」と述べ、特定の1チーム対策に絞らない方針を示した。故障で出場が限られたジェイレン・ウィリアムズも「もう一度プレーできるのが楽しみ」と復帰への意気込みを語った。ESPNのバクスター・ホームズ記者が伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "291-curry-home-warriors-extension-injuries.html",
    cat: "NBA",
    title: "カリー「これがホームだ」—— 延長契約後初の公の場で心境語る、バトラー・ムーディーも数カ月級の離脱に",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリーは、2年1億1600万ドルの契約延長合意後初めて公の場に立ち「これがホームだ」と語った。一方でジミー・バトラーとモーゼス・ムーディーが数カ月単位の離脱になる見通しであることも明らかになった。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "290-clippers-apologize-fans-leonard-investigation.html",
    cat: "NBA",
    title: "クリッパーズ、メディアデーで謝罪 —— 「信頼を取り戻したい」暫定バスケットボール運営責任者レデン、再建シーズンへ",
    excerpt: "ロサンゼルス・クリッパーズは現地時間9月28日のメディアデーで、カワイ・レナードを巡るサラリーキャップ規定違反の調査を受け、ファンに謝罪した。オーナーのスティーブ・バルマー氏らが職務停止処分となる中、暫定でバスケットボール運営を率いるトレント・レデン氏(Trent Redden)が「信頼を取り戻したい」と語った。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "289-ben-simmons-kings-media-day.html",
    cat: "NBA",
    title: "ベン・シモンズ「期待が低いのは自分にも重なる」—— キングスのメディアデーで復帰へ意気込み",
    excerpt: "サクラメント・キングスのベン・シモンズは現地時間9月28日のメディアデーで、キングス入りを決めた理由について「期待値が低いということ。それは自分にも重なる部分がある」と語った。2024-25シーズンはネッツとクリッパーズで計51試合の出場にとどまっており、体と心を整える時間になったと振り返った。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "288-thunder-sga-roster-reaction.html",
    cat: "NBA",
    title: "ギルジャス＝アレクサンダー「まだ来ると思ってた」—— サンダー、放出した3人の不在にチーム写真で実感",
    excerpt: "オクラホマシティ・サンダーのシェイ・ギルジャス＝アレクサンダーは現地時間9月28日のチーム写真撮影で、今夏トレードでチームを去ったルゲンツ・ドート、アイザイア・ジョー、アーロン・ウィギンズについて「まだ来ると思ってた」と冗談めかして振り返った。「NBAのビジネスだから」と受け止めつつ、チームメートのジェイレン・ウィリアムズも「一番変な感じ」と同じ心境を口にした。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "287-duren-pistons-langdon-gm.html",
    cat: "NBA",
    title: "ピストンズのラングドンGM「デューレンとは夏、一度も話していない」—— 5年2億ドルかQOか、10月1日の決断迫る",
    excerpt: "デトロイト・ピストンズのトレイジャン・ラングドン球団社長は現地時間9月28日のメディアデーで、契約交渉が続くジェイレン・デューレンについて「今夏、彼とは一度も話していない」と明かした。デューレンは10月1日までに1年960万ドルのクオリファイング・オファーにサインするか、球団提示の5年2億ドル契約を受け入れるかの決断を迫られている。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "286-doncic-lakers-lebron-exit.html",
    cat: "NBA",
    title: "ドンチッチ「レブロンとのプレーは最高だった」—— レイカーズ新体制、優勝こそが目標と明言",
    excerpt: "ロサンゼルス・レイカーズのルカ・ドンチッチは現地時間9月28日のメディアデーで、今夏76ersへ移籍したレブロン・ジェームズについて「一緒にプレーできたのは最高だった」と振り返り、2026-27シーズンのレイカーズについて「優勝を狙えないと思うなら、ここにいるべきじゃない」と語った。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "285-mitchell-harden-cavaliers-media-day.html",
    cat: "NBA",
    title: "ミッチェル「レブロンは戻ってきてもおかしくなかった」—— キャバリアーズのメディアデー、ハーデンも延長契約への思い語る",
    excerpt: "クリーブランド・キャバリアーズのドノバン・ミッチェルは現地時間9月28日のメディアデーで、レブロン・ジェームズの去就について「フィラデルフィアだとは思わなかった。来なければゴールデンステートだったと思う」と語った。ジェームズ・ハーデンも契約延長への思いを明かした。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "284-warriors-2027-cap-space-bobby-marks.html",
    cat: "NBA",
    title: "カリーの2年1.16億ドル延長で ウォリアーズ、2027年に最大5500万ドルの空き枠 —— ボビー・マークス分析",
    excerpt: "スティーブン・カリーの2年1億1600万ドル延長により、ウォリアーズは2027年オフに最大5500万ドルの空き枠を持てる可能性が出てきた。ESPNのボビー・マークス記者が、ポルジンギス放出やグリーン・バトラーのFA離脱を条件とした試算を伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "283-brandon-miller-hornets-camp-ready.html",
    cat: "NBA",
    title: "ホーネッツGM「オープニングナイトへ準備万端」—— ブランドン・ミラー、左肩手術からキャンプ本格復帰へ",
    excerpt: "シャーロット・ホーネッツのジェフ・ピーターソンGMは現地時間9月28日のメディアデーで、オフに左肩の手術を受けたブランドン・ミラーについて「キャンプにフル参加できるはずで、オープニングナイトへの準備は万端になる」と語った。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "282-nba-media-day-2026-quotes-roundup.html",
    cat: "NBA",
    title: "NBAメディアデー2026 発言まとめ —— レブロン、ヤニス、タウンズ、ヨキッチ、カワイ…開幕前に各チームで何が語られたか",
    excerpt: "NBAの2026-27シーズンに向けたメディアデーが現地時間9月28日、28チームで一斉に開かれた。76ersのレブロン・ジェームズ「文字通り、何でもできる」、ヒートのヤニス・アデトクンボ「世界最高の選手の1人」、ナゲッツのニコラ・ヨキッチ「来年サインする」など、主な発言をチームごとにまとめた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "281-blazers-morant-belief-media-day.html",
    cat: "NBA",
    title: "ブレイザーズGM「ジャへの純粋な信頼」—— モラント獲得の理由を語る、ホリデーのウイング起用も",
    excerpt: "ポートランド・トレイルブレイザーズのジョー・クローニンGMは現地時間9月28日のメディアデーで、今オフにジャ・モラントをトレードで獲得した理由について「ジャへの純粋な信頼だ。彼は今もとても高いレベルの選手だと見ている」と語った。ドリュー・ホリデーをウイングで起用する可能性にも触れた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "280-clippers-ingram-partial-achilles-tear.html",
    cat: "NBA",
    title: "クリッパーズ、イングラムのアキレス腱部分断裂を発表 —— かかとの手術後に判明、開幕に間に合わず",
    excerpt: "ロサンゼルス・クリッパーズは現地時間9月28日、ブランドン・イングラムに最近受けたかかとの手術の後、アキレス腱の部分断裂が見つかったと発表した。イングラムは2026-27シーズンの開幕に間に合わない。クリッパーズには八村塁と河村勇輝が所属している。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "279-wembanyama-finals-motivation-spurs.html",
    cat: "NBA",
    title: "ウェンバンヤマ「これ以上の原動力は想像できない」—— ファイナル敗退を糧に、ハーパーも「どの役割でも喜んで」",
    excerpt: "サンアントニオ・スパーズのビクター・ウェンバンヤマは現地時間9月28日のメディアデーで、昨季のNBAファイナルでニックスに敗れた記憶について「これ以上の原動力は想像できない」と語った。ディラン・ハーパーも自身の役割について「コーチが最善と考えるポジションに喜んで入る」と話した。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "278-curry-knee-ready-kerr-lendeborg.html",
    cat: "NBA",
    title: "カリー「膝の調子は最高、問題なし」—— ウォリアーズのメディアデー、カーHCは新人レンデボーグを「たくさん起用する」",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリーは現地時間9月28日のメディアデーで、負傷していた膝について「調子は最高。準備はできている。問題はない」と語った。スティーブ・カーHCは2026年ドラフト11位の新人ヤクセル・レンデボーグについて「間違いなくたくさん出場する」と明言した。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "277-jokic-sign-next-year-nuggets.html",
    cat: "NBA",
    title: "ヨキッチ「来年サインするよ。向こうが望むなら」—— ナゲッツ首脳も「懸念はない」と信頼強調",
    excerpt: "デンバー・ナゲッツのニコラ・ヨキッチは現地時間9月28日のメディアデーで「来年サインするよ。向こうが望むならね」と語り、球団に残る意思をあらためて示した。今オフは延長契約を結ばなかったが、フロントも「信頼関係に心地よさを感じている。懸念はない」と強調した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "276-giannis-heat-media-day-best-player.html",
    cat: "NBA",
    title: "ヤニス「世界最高の選手の1人だと信じている」—— ヒートのメディアデーで初登場、目標は「優勝」",
    excerpt: "マイアミ・ヒートに移籍したヤニス・アデトクンボは現地時間9月28日のメディアデーで「最高ではないにしても、自分は世界最高の選手の1人だと本気で信じている」と語り、新天地での目標を「優勝」と明言した。エリック・スポールストラHCも「一歩後退させるために連れてきたのではない」と期待を示した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "275-lebron-76ers-media-day-can-do-everything.html",
    cat: "NBA",
    title: "レブロン「文字通り、何でもできる」—— 76ersでキャリア24年目へ、エンビードも「正しい組み合わせ」",
    excerpt: "フィラデルフィア・76ersに加入したレブロン・ジェームズは現地時間9月28日のメディアデーで、チームでの役割について「チームが必要とすることは何でもやる。僕のゲームの強みは何でもできること。文字通り、何でもできる」と語った。ジョエル・エンビードも「ベテランと若手の正しい組み合わせがある」と新チームへの期待を口にした。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "274-haliburton-no-restrictions-achilles-return.html",
    cat: "NBA",
    title: "ハリバートン、アキレス腱断裂から完全復帰へ「制限は一切ない、俺が情報源だ」",
    excerpt: "インディアナ・ペイサーズのタイリース・ハリバートンが現地時間9月28日のメディアデーで、1年以上コートを離れる原因となった右アキレス腱断裂からの復帰に制限は一切無いと明言した。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "273-towns-knicks-extension-media-day.html",
    cat: "NBA",
    title: "タウンズ、ニックスとの契約延長「ここでプレーしたい」—— 開幕前合意は困難な情勢、資格は4年2億7600万ドル超",
    excerpt: "ニューヨーク・ニックスのカール=アンソニー・タウンズが現地時間9月28日のメディアデーで契約延長への意欲を改めて示した。4年2億7600万ドル超の延長資格を持つが、シーズン開幕前の合意は見込みにくい情勢という。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "272-lebron-envisioned-knicks.html",
    cat: "NBA",
    title: "レブロン、ニックス入りを思い描いていた —— 優勝後に「無理だ」と断念、76ers移籍決断の裏側",
    excerpt: "レブロン・ジェームズは76ersのメディアデーでESPNに対し、今夏のフリーエージェンシーでニューヨーク・ニックス入りを思い描いていたが、ニックスが優勝した後にその考えを断念したと明かした。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "271-kawhi-leonard-focused-raptors.html",
    cat: "NBA",
    title: "カワイ・レナード、ラプターズのメディアデーで捜査に終止符 —— 「前を向いてラプターズの話だけしたい」",
    excerpt: "トロント・ラプターズのカワイ・レナードが現地時間9月28日のメディアデーで、クリッパーズ時代の契約疑惑を巡る調査には触れず、バスケットボールとラプターズでのプレーに専念する意思を語った。ESPNが伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "270-porzingis-warriors-health-issue.html",
    cat: "NBA",
    title: "ポルジンギス、ウォリアーズのキャンプ初日を欠場 —— 原因不明の「健康上の問題」再発、無期限の離脱に",
    excerpt: "ゴールデンステート・ウォリアーズは現地時間9月28日、先発センターのクリスタプス・ポルジンギスが「健康上の問題」を理由にトレーニングキャンプの開始を欠場すると発表した。GMのマイク・ダンリービーは離脱を無期限とし、チームのハワイ合宿にも同行しない。ポルジンギスは過去2年で計90試合を欠場しており、原因不明の体調不良が再発した形だ。ESPNのアンソニー・スレイター記者が伝えた。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "269-kobe-10-protro-blue-lagoon.html",
    cat: "KICKS",
    title: "Kobe 10 Protro「Blue Lagoon」が復活 —— 2015年発売時のカラーを再現、フルレングスZoomとカーボンウィング搭載",
    excerpt: "FLY BASKETBALL CULTURE MAGAZINEが2026年9月28日、「Kobe 10」のプロトロ(Protro)仕様、新色「Blue Lagoon」を紹介した。2015年のオリジナル発売時のカラーを再現し、フルレングスのAir Zoomストロベルやカーボン製ウィングなど現行仕様の機能性を備える。",
    date: "2026.09.29",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "268-duren-pistons-contract-standoff.html",
    cat: "NBA",
    title: "デューレン、ピストンズとの契約交渉巡り媒体デー欠席 —— 5年2億ドルの提示拒否、木曜のQO期限が迫る",
    excerpt: "デトロイト・ピストンズのオールスターセンター、ジェイレン・デューレンが契約交渉の膠着を理由に9月28日のメディアデーとキャンプ開始を欠席した。5年2億ドルの提示を拒否しており、1年960万ドルのクオリファイング・オファー期限である木曜日を前に交渉は難航している。ESPNのシャムズ・シャラニア記者が伝えた。",
    date: "2026.09.28",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "267-espn-newcomers-preview-2026-27.html",
    cat: "NBA",
    title: "移籍組で最も目が離せない8人 —— ESPNが開幕前プレビュー、トップはマイアミ移籍のヤニス",
    excerpt: "ESPNは9月28日(現地時間)、今夏に移籍した選手の中から開幕前に最も目が離せない8人をプレビュー記事で選出した。過去5シーズンにオールスター経験を持つ15人が移籍した中、トップに挙げたのはマイアミへ移ったヤニス・アデトクンボ。レブロン・ジェームズの76ers入りやラメロ・ボールのウルブズ移籍なども取り上げている。",
    date: "2026.09.28",
    thumb: "../assets/journal-267-hero.jpg?v=652d0bc8a2"
  },
  {
    href: "266-dennis-smith-jr-heat-deal.html",
    cat: "NBA",
    title: "デニス・スミス・ジュニア、ヒートと契約合意 —— 元ロッタリーピックのガード、夏を通じて注視された末の新天地",
    excerpt: "マイアミ・ヒートは、フリーエージェントのガード、デニス・スミス・ジュニアと契約合意に達した。エージェントを務めるヘイザン・スポーツのダニエル・ヘイザン氏の情報として、NBA on Primeのクリス・ヘインズ記者が現地時間9月27日に伝えた。ヒートはこの夏を通じて元ロッタリーピックの動向を注視してきたという。",
    date: "2026.09.27",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "265-bulls-trade-dillingham-hield-hornets.html",
    cat: "NBA",
    title: "ブルズ、ディリンガムをホーネッツへトレード —— バディ・ヒールドと交換、獲得1週間足らずでの再放出に",
    excerpt: "シカゴ・ブルズは現地時間9月26日、ロブ・ディリングハムをシャーロット・ホーネッツへ送り、バディ・ヒールドと現金を獲得するトレードを成立させた。ESPNのシャムズ・シャラニア記者が関係者の話として伝えた。ヒールドはホーネッツ加入から1週間足らずでの退団となる。",
    date: "2026.09.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "264-nba-rank-2026-audit-metrics.html",
    cat: "NBA",
    title: "ブランソンの6位は「買いかぶり」? —— ESPN分析官が指標で「NBA Rank」検証、マレー＝ボイルズは見逃された過小評価に",
    excerpt: "ESPNは9月24日(現地時間)、「NBA Rank」2026-27版トップ100の発表を受け、アナリストのディーン・オリバー氏による検証記事を公開した。DARKO・LEBRON・EPM・RAPMなど先進指標とパネル投票のズレを分析。ファイナルMVPのジェイレン・ブランソン(6位)は指標上25位前後、ジェイレン・ブラウン(14位)は指標平均60位付近と、「見えている選手」と「数字が見ている選手」のギャップを指摘している。",
    date: "2026.09.26",
    thumb: "../assets/journal-fallback-02.jpg?v=6d15bae6e8"
  },
  {
    href: "263-altman-cavs-sustainable-run-lebron.html",
    cat: "NBA",
    title: "アルトマン、レブロン逃した夏でも「良いオフだった」—— キャバリアーズ社長、ハーデン・ミッチェル延長とワトソン獲得語る",
    excerpt: "クリーブランド・キャバリアーズのコビー・アルトマン球団社長兼GMは9月25日(現地時間)、開幕前の記者会見で、今夏レブロン・ジェームズが76ersを選んだことについて「一つの結果に依存するわけにはいかない」と述べた。ジェームズ・ハーデン、ドノバン・ミッチェルとの契約延長やペイトン・ワトソン獲得を含め、今オフを「良いオフだった」と総括した。ESPN(AP通信)が伝えた。",
    date: "2026.09.26",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
  {
    href: "262-knueppel-hamstring-injury.html",
    cat: "NBA",
    title: "ホーネッツのカニップル、左ハムストリング負傷でプレシーズン全休 —— グラント・ウィリアムズも故障、開幕は10月21日ブルックリン戦",
    excerpt: "シャーロット・ホーネッツは9月26日(現地時間)、2年目ガードのコン・カニップルが左ハムストリングを負傷し、プレシーズン全4試合を欠場すると発表した。ベテランフォワードのグラント・ウィリアムズも右ハムストリングを負傷し、同様に欠場する。ESPNが伝えた。",
    date: "2026.09.26",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "261-warriors-curry-extension.html",
    cat: "NBA",
    title: "カリー、ウォリアーズと2年1億1600万ドルの契約延長に合意 —— 最大契約より2000万ドル減額、2028-29はプレーヤーオプション",
    excerpt: "ゴールデンステート・ウォリアーズのステフィン・カリーは現地時間9月25日、球団と2年1億1600万ドルの契約延長に合意した。2028-29シーズンにプレーヤーオプションが付く。8月29日に資格を得た最大2年1億3670万ドルから2000万ドル減額を受け入れた形で、来夏のサラリーキャップに余裕をもたらす。Shams Charania記者(ESPN)が伝えた。",
    date: "2026.09.26",
    thumb: "../assets/journal-fallback-04.jpg?v=e3dff30df6"
  },
  {
    href: "260-kyrie-irving-acl-recovery-no-restrictions.html",
    cat: "NBA",
    title: "カイリー・アービング、ACL断裂から19カ月ぶりに完全復帰 —— マーベリックス公式メディアデーで「制限は一切ない」と明言",
    excerpt: "ダラス・マーベリックスのカイリー・アービングは現地時間9月25日、球団公式メディアデーで、2025年3月に負った左ひざ前十字靭帯(ACL)断裂から19カ月が経ち、プレーに身体的な制限は一切ないと明らかにした。負傷後、初めて報道陣の前に立った。ESPNが伝えた。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-01.jpg?v=15c4383426"
  },
  {
    href: "259-hotscape-saitama-broncos-partnership.html",
    cat: "JAPAN",
    title: "ホットスケープ、さいたまブロンコスとオフィシャルパートナー契約を締結 —— イベントプロデュースの知見で「熱狂空間」づくりを支援",
    excerpt: "東京・虎ノ門の株式会社ホットスケープ（代表取締役・前野伸幸）は9月25日、B.LEAGUE ONE所属「さいたまブロンコス」とオフィシャルパートナー契約を締結したと発表した。ホットスケープが手がけてきたイベント企画・施設運営の知見と、ブロンコスが掲げる新アリーナ構想を軸にした「熱狂空間」づくりの想いが共鳴したという。",
    date: "2026.09.25",
    thumb: "../assets/journal-fallback-03.jpg?v=9981f0df79"
  },
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
