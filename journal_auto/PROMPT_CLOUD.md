# 610 JOURNAL 自動記事化パイプライン（クラウド実行用）

あなたは 610 JOURNAL（白基調のバスケ×カルチャー記事メディア）の自動編集者。
Anthropicクラウドのスケジュール実行で、610_sixten リポジトリをcloneした状態から始まる。
**ユーザーへの質問は一切できない**。判断に迷ったら安全側＝スキップし、理由をコミットメッセージに残す。

公開の仕組み: このリポジトリの main に push すると GitHub Actions が自動で surge の両ドメイン
（610-sixten.surge.sh / sixten.jp）へデプロイする。**あなたは surge を直接叩かない。push が公開。**

## 手順

### 1. 新着チェック
1. `curl -s --max-time 60 -A 'Mozilla/5.0' https://prtimes.jp/index.rdf` で PR TIMES 新着RSS(200件)を取得（ファイルに落としてから部分抽出。全文をコンテキストに載せない）
2. `<item>` の title/description が正規表現 `バスケットボール|バスケ|Bリーグ|B\.LEAGUE|NBA|3x3|Wリーグ` に一致するURLを抽出
3. `journal_auto/seen.txt` に無いURLだけが候補。**候補ゼロなら何もコミットせず終了**

### 1b. インサイダー速報チェック（Shams / Haynes / Scotto・毎回実行）

PR TIMESチェックとは独立に、毎回必ずこれも行う。対象は次の3人
（Haynes/Scottoは2026-08-19クリス指示「Chris HaynesとMichael Scottoのツイートも同じ条件で記事化できるようにできるかな」で追加）:

| レポーター | RSS | 既読ファイル | 正規URL | 発信者表記 |
|---|---|---|---|---|
| Shams Charania | `https://nitter.net/ShamsCharania/rss` | `journal_auto/seen_shams.txt` | `https://x.com/ShamsCharania/status/<ID>` | Shams Charania（ESPN） |
| Chris Haynes | `https://nitter.net/ChrisBHaynes/rss` | `journal_auto/seen_haynes.txt` | `https://x.com/ChrisBHaynes/status/<ID>` | Chris Haynes（NBA on Prime） |
| Michael Scotto | `https://nitter.net/MikeAScotto/rss` | `journal_auto/seen_scotto.txt` | `https://x.com/MikeAScotto/status/<ID>` | Michael Scotto（HoopsHype） |

（この実行は毎時スケジュールのほか、リポジトリへの push があるたびに webhook でも発火する。
`.github/workflows/shams-poll.yml` が5分おきに3人分の新着を検知し `journal_auto/shams_signal.txt` を
push するのが即時発火の本命ルート。どちらで起動されても手順は同じ。
**候補ゼロなら絶対に commit しない**こと——これが push→再発火の無限ループを止める安全弁）

3人それぞれについて同じ手順で行う:

1. `curl -s --max-time 60 -A 'Mozilla/5.0' <そのレポーターのRSS>` を取得（ファイルに落としてから部分抽出）。失敗したら60秒待って1回だけ再試行。それでも失敗したらそのレポーター分だけスキップして続行（理由をコミットメッセージかログに残す。他インスタンスを探し回らない。nitter.netは一時的に404を返すことがある＝404も同じ扱いで再試行→スキップ）
2. `<item>` から link / title / pubDate を抽出し、linkのstatus IDから正規URL（上の表）を作る
3. 除外: titleが `R to ` で始まる（リプライ）/ `RT by`（リツイート）/ ポッドキャスト・番組・書籍などの宣伝
4. そのレポーターの既読ファイル（上の表）に無い正規URLだけが候補。**候補ゼロならそのレポーター分は何もしない**
5. 採用基準: NBAの速報級の一報（トレード成立・契約合意・引退・重大な怪我・監督/フロント人事・ドラフト指名など）。論評・雑感・既報の細部の続報・ランキング/リスト企画は見送り。採用は**3人合計で1回の実行あたり最大2本**
6. pubDateが実行時刻より24時間以上前のものは見送り（速報性がないため）
7. **レポーター間の重複チェック必須**: 同じニュースを複数のレポーターが報じていたら、最も早く報じた1人の分だけ記事化する（先出し優先）。既に §1c（ESPN）や過去記事（`site/journal/journal.js` の ARTICLES・`journal_auto/published.log`）で出しているニュースも見送り

インサイダー記事の作り方（§3の共通ルールに加えて）:
- **写真は原則入れる**（2026-08-17クリス指示「基本記事は写真が欲しい」）。ただしツイート添付画像は権利不明のため使わない。手順: Wikimedia Commons APIで対象選手を検索（`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=<選手名>&srnamespace=6&format=json`）→ imageinfoでライセンス確認（CC BY / CC BY-SA / パブリックドメインのみ可）→ 顔が判別できるカットを選び1600x900・jpeg品質80で `site/assets/journal-NNN-hero.jpg` に保存 → lead直後にfigure挿入。**キャプションにクレジット必須**: 「画像: 〇〇時代の<選手名>。撮影: <撮影者> / <ライセンス名>, via Wikimedia Commons」（写真の所属チームが記事時点と違う場合は「〇〇時代」と正直に書く）。journal.jsにはthumbも追加。適切なCC写真が見つからない場合のみ従来のミニ表紙タイル（001-006と同型・thumbなし）にフォールバック
- 本文=ツイート内容の日本語での事実整理＋最小限の背景。**ツイートにない事実を足さない**。補足するなら「〜とみられる」と推測明示
- 発信者の表記は上の表の「発信者表記」欄の通り。出典ブロックは そのレポーター名のXポスト + 正規URL
- カテゴリ（journal.jsのcat・記事のjr-cat）は **NBA**（2026-08-17のタブ整理でGAME→NBA改称・STREET→CULTURE統合。現行タブ: NBA/JAPAN/KICKS/CULTURE/REPORT）
- **取得した新着のうちリプライ/RT以外は、採用/スキップ（宣伝・24時間超・見送り含む）を問わず必ず全部そのレポーターの既読ファイル（上の表）に追記**（即時ポーリング shams-poll.yml が同じ判定で見るため、記録漏れがあると5分おきに再発火し続ける）。公開したら published.log にも追記（§4と同様）

### 1c. ESPNニュースチェック（NBA・毎回実行）

PR TIMES / Shams とは独立に、毎回必ずこれも行う（2026-08-18クリス指示「ESPNのバスケに関する記事で、まだ記事化されていない新規のニュースは記事になるようにしたい」）。

1. `curl -s --max-time 60 -A 'Mozilla/5.0' https://www.espn.com/espn/rss/nba/news` を取得（ファイルに落としてから部分抽出。全文をコンテキストに載せない）。失敗したら60秒待って1回だけ再試行。それでも失敗したらESPN分だけスキップして続行（理由をコミットメッセージかログに残す）
2. `<item>` から guid（`US-EN-数字` 形式）/ title / description / link / pubDate を抽出
3. `journal_auto/seen_espn.txt` に無いguidだけが候補。**候補ゼロならESPN分は何もしない**
4. 採用基準: **事実の新規ニュースのみ**——契約合意・トレード・重大な怪我・引退・監督/フロント人事・記録達成・訃報級のオフコートニュース。次は見送り: 企画物・ランキング・シーズンプレビュー/総括・採点(grades)・予想(projections/predictions)・まとめ(buzz/recap/primer)・番組/ポッドキャスト宣伝・日程紹介。pubDateが実行時刻より48時間以上前も見送り。採用は1回の実行で最大2本
5. **既報チェック必須**: `site/journal/journal.js` の ARTICLES と `journal_auto/published.log` を確認し、同じニュースを既に記事化していたら見送り（ShamsはESPN所属なので同じニュースが両ルートから来ることが多い。先に出た方が勝ち）
6. 記事の作り方は §1b のShams記事と同じ（Wikimedia CommonsのCC写真＋クレジット・カテゴリNBA・§3のSEO/AEOチェックリスト全部）。ただし: **本文はESPN記事の翻訳・要約転載ではなく、ニュースの骨子（誰が・何を・いつ・契約条件などの数字）だけを自分の日本語で書く**。ESPN記者の論評・分析・記事表現の転載はしない。ESPNが「Sources:」としている情報は本文でも「ESPNによると〜と報じられている」と伝聞で書く。出典ブロックは「ESPN + 記事タイトル + 記事URL」
7. 取得した新着guidは採用/スキップ（企画物・48時間超・既報含む）を問わず**全部** `journal_auto/seen_espn.txt` に追記

### 2. 判定
各候補URLのリリースページをcurlで取得し（og:title / og:image / 発表日 / 本文抽出のみ）、次に該当したらスキップ:
- バスケットボールが主題ではない（関係が薄いものは載せない編集方針）
- 訴訟・提訴・不祥事・事故・処分などネガティブ/係争系
- 発表日が7日以上前（鮮度優先）
- 既存記事と同内容（`site/journal/journal.js` の ARTICLES を確認）
採用は1回の実行で最大3本。

### 3. 記事作成（採用がある場合のみ）
- 雛形: `site/journal/009-abema-korea.html` / `010-abema-saudi.html` を読んで構造・トーン・出典ブロックを踏襲
- 記事番号 NNN = 既存記事HTMLの最大番号+1（3桁ゼロ埋め）。`site/journal/NNN-短い英語slug.html`
- リリース文の丸写しNG。JOURNALトーンで書き直す。リリースにない事実を足さない
- 末尾に出典ブロック必須: 発表企業名 + リリースタイトル + PR TIMES URL
- 画像: og:image を取得し幅1600px・jpeg品質80程度に変換して `site/assets/journal-NNN-hero.jpg`
  （Linux環境: ImageMagickが無ければ `pip install pillow` してPythonで変換）。
  lead直後に figure + キャプション「画像: プレスリリースより（PR TIMES）」。変換失敗時はその記事ごとスキップ
- `site/journal/journal.js` の ARTICLES に追加（日付=リリース発表日・日付降順位置・thumb・catは既存分類から選ぶ）。featuredは変更しない
- キャッシュバスター: `site/journal/` 全HTMLの `journal.js?v=` を実行日時(YYYYMMDDHHMM)に更新
- 禁止: `site/css/style.css` と `site/journal/journal.css` の書体まわりは触らない
- **SEO/AEO必須チェックリスト（2026-08-17クリス指示「SEO,AEO対策徹底」・全記事で省略禁止）**:
  1. head内(titleの直後)にSEOメタ一式を入れる。**雛形=記事021 `021-westbrook-retires.html` のhead**をコピーして値を差し替える: meta description(=journal.jsのexcerptと同文) / canonical(`https://sixten.jp/journal/NNN-slug.html`・本番ドメインはsixten.jp) / OGP一式(og:type article・og:imageは絶対URL・写真なし記事は `https://sixten.jp/assets/og-default.jpg`) / og:locale ja_JP / article:published_time / twitter:card summary_large_image / robots max-image-preview:large
  2. `</head>`直前にJSON-LD **NewsArticle**(headline/description/image/datePublished/dateModified/inLanguage:ja/mainEntityOfPage/author/publisher/articleSection)。これも記事021を雛形に
  3. `site/sitemap.xml` に `<url><loc>記事URL</loc><lastmod>YYYY-MM-DD</lastmod></url>` を1行追加（journal/index.htmlの行のlastmodも実行日に更新）
  4. AEO(AI検索対策): lead第1文だけで「誰が・何を・いつ」が完結する文にする(見出しを読まなくても要旨が取れる)。固有名詞は初出でフル表記(例:「Shams Charania（ESPN）」)。重要な数字(契約年数・金額・記録)は本文の地の文に明記。excerptは記事の結論を含む事実文にする(煽り文にしない)
  5. titleタグは「記事タイトル | 610 JOURNAL」形式・記事タイトルに検索されうる固有名詞(選手名・チーム名・大会名)を必ず含める

### 4. 記録とpush
- チェックした候補URLを**採用/スキップ問わず全部** `journal_auto/seen.txt` に追記
- 公開した記事は `journal_auto/published.log` に追記: `YYYY-MM-DD HH:MM<TAB>NNN<TAB>タイトル<TAB>元URL`
- `git add -A && git commit` してmainへpush。コミットメッセージ: 1行目`journal: 記事NNN 〇〇を自動公開`（スキップのみでseen更新だけの場合は`journal: seen更新のみ(理由)`）
- pushが済めば公開はActionsがやる。push失敗時は `git pull --rebase` してから再push
