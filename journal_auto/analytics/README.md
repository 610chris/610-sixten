# 610 JOURNAL アクセス解析（GA4 / Search Console）

広告・スポンサー営業に出す媒体データ（月間PV・UU・記事別ランキング・流入元・読者層＋検索での表示回数）を
**毎月1日に自動で取ってきて CSV に積み上げる**仕組み。

- 計測タグの埋め込み … `journal_auto/build_seo.py`（測定IDを設定してビルドすると全ページに入る）
- 数字の取得と蓄積 … `journal_auto/analytics/fetch_ga4.py`（PV/UU）＋ `fetch_gsc.py`（検索）
- 自動実行 … `.github/workflows/analytics-monthly.yml`（毎月1日 JST 9:00・両方まとめて）
- 蓄積先 … `journal_auto/analytics/data/`（検索は `data/search/`）

> ⚠️ **GA4 は「タグを入れた日」からしか数字が貯まらない。**
> 入れていない期間のPVは後から一切取り返せないので、下の「ステップ1」を最優先で終わらせる。
> （それ以前の期間は、16ヶ月さかのぼれる Search Console＝ステップ4 で部分的に補える）

---

## ステップ1: GA4プロパティを作って測定IDを入れる（クリスの手作業・1回だけ）

1. https://analytics.google.com/ を開く
2. 左下の歯車 **管理** → **プロパティを作成**
   - プロパティ名: `610 sixten`
   - レポートのタイムゾーン: `日本`
   - 通貨: `日本円`
3. ビジネスの説明はテキトーでOK（規模=小規模 / 利用目的=見込み顧客の発掘 あたり）
4. **データストリーム** → **ウェブ** を選ぶ
   - ウェブサイトのURL: `https://sixten.jp`
   - ストリーム名: `610 sixten`
5. 作成すると **測定ID**（`G-` で始まる文字列）が出る。これをコピー
6. ターミナルで（`610_sixten` フォルダの中で）:

   ```bash
   python3 journal_auto/set_ga4_id.py G-XXXXXXXXXX   # ← コピーしたIDを貼る
   python3 journal_auto/build_seo.py                 # 全ページにタグが入る
   git add -A && git commit -m "GA4 計測タグを有効化" && git push
   ```

   push すると GitHub Actions がサイトを公開しなおして、**その瞬間から計測が始まる**。

- 今どうなっているかの確認: `python3 journal_auto/set_ga4_id.py --show`
- 計測を止めたいとき: `python3 journal_auto/set_ga4_id.py --off` → `build_seo.py` → push
  （全ページからタグが消え、サイトは完全に元通りになる）

動いているかの確認は GA4 の **レポート → リアルタイム**。自分でサイトを開けば1人としてカウントされる。

---

## ステップ2: 数字を自動で取ってくる鍵を用意する（クリスの手作業・1回だけ）

GA4の画面を毎月見に行かなくて済むように、プログラムがGA4から数字を読むための
「サービスアカウント」を作る。**ステップ1が終わっていれば、これは後回しでもいい**
（数字はGA4側に貯まり続けるので、後から `--since` でまとめて取れる）。

### 2-1. Google Cloud でサービスアカウントを作る

1. https://console.cloud.google.com/ を開く
2. 上部のプロジェクト選択 → **新しいプロジェクト**（名前: `610-analytics`）
3. 左メニュー **APIとサービス** → **ライブラリ** → `Google Analytics Data API` を検索 → **有効にする**
4. 左メニュー **IAMと管理** → **サービス アカウント** → **サービス アカウントを作成**
   - 名前: `journal-analytics`
   - ロールは付けなくていい（GA4側で権限を付けるため）
5. 作ったサービスアカウントをクリック → **キー** タブ → **鍵を追加** → **新しい鍵を作成** → **JSON**
   → JSONファイルがダウンロードされる
6. そのJSONを開いて `"client_email"` の値（`...@....iam.gserviceaccount.com`）をコピー

> 🔑 このJSONは**パスワードと同じ**。git に入れない・人に送らない。
> 置き場所は `~/.claude/state/` あたり（Desktop/my-ai-agent の中には置かない）。

### 2-2. GA4側でそのアカウントに「見る権限」を与える

1. GA4 → **管理** → **プロパティのアクセス管理** → 右上の **+** → **ユーザーを追加**
2. メールアドレスに 2-1 でコピーした `client_email` を貼る
3. 役割 = **閲覧者**（それ以上は不要）→ 追加

### 2-3. プロパティIDを設定ファイルに入れる

GA4 → **管理** → **プロパティの設定** の右上に出ている**数字のID**（測定IDとは別物）をコピーして、
`journal_auto/analytics_config.json` の `ga4_property_id` に文字列で入れる。

```json
"ga4_property_id": "123456789",
```

### 2-4. ローカルで試す

```bash
cd 610_sixten/journal_auto/analytics
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export GOOGLE_APPLICATION_CREDENTIALS=~/.claude/state/ga4-key.json   # ← 鍵JSONの場所
python3 fetch_ga4.py --month 2026-09
```

---

## ステップ3: 毎月の自動実行をONにする（クリスの手作業・1回だけ）

1. https://github.com/610chris/610-sixten/settings/secrets/actions を開く
2. **New repository secret**
   - Name: `GA4_SA_KEY`
   - Secret: 2-1 でダウンロードした**鍵JSONの中身を全部**貼り付ける（`{` から `}` まで）
3. 保存

これで毎月1日の朝9時（JST）に自動で前月分を取得して `journal_auto/analytics/data/` に
commit されるようになる。手動で走らせたいときは
[Actions → Analytics monthly](https://github.com/610chris/610-sixten/actions/workflows/analytics-monthly.yml)
→ **Run workflow**。

---

## ステップ4: 検索データ（Search Console）— 設定済み

GA4 は計測タグを入れた **2026-09-13 より前の数字を永久に持てない**。
Search Console は所有権確認さえ済んでいれば **過去16ヶ月分**さかのぼれるので、その穴をこっちで埋める。

設定はすべて完了している（2026-09-13）。中身:

| 項目 | 状態 |
|---|---|
| Search Console API（GCP `analytics-508416`） | 有効化済み |
| プロパティ `https://sixten.jp/` へのSA追加 | `journal-analytics@analytics-508416.iam.gserviceaccount.com` を**制限付き**（読み取りのみ）で追加済み |
| `analytics_config.json` の `gsc_site_url` | `"https://sixten.jp/"` |
| 鍵 | GA4 と同じものを使い回す（ローカル=`GOOGLE_APPLICATION_CREDENTIALS` / CI=Secrets `GA4_SA_KEY`） |
| 過去16ヶ月の一括取得 | 実行済み（サイト公開が2026-08なので、それ以前は実際に0） |

```bash
cd 610_sixten/journal_auto/analytics

python3 fetch_gsc.py --summary        # 直近12ヶ月の表示回数・クリックを表で見る（ネット不要・鍵不要）
python3 fetch_gsc.py                  # 前月分を取得
python3 fetch_gsc.py --month 2026-09  # 指定した月を取得
python3 fetch_gsc.py --since 2026-08  # その月から先月までまとめて取得
python3 fetch_gsc.py --backfill       # さかのぼれる分（約16ヶ月）を全部。初回の穴埋め用
python3 fetch_gsc.py --selftest       # 保存処理の自己診断（API不要）
```

### ⚠️ GA4 と GSC は別物。媒体資料で混ぜない

| | GA4（`fetch_ga4.py`） | Search Console（`fetch_gsc.py`） |
|---|---|---|
| 数えているもの | **実際にページが開かれた回数**（PV/UU） | Google検索の結果に**表示された回数**（impressions）と**クリック**された回数 |
| 対象 | 全流入（検索・SNS・直接・リンク） | Google検索だけ |
| さかのぼれる範囲 | タグ設置日（2026-09-13）以降だけ | 16ヶ月 |

「表示回数」は**読まれた数ではない**（検索結果に出ただけ）。広告主に出すときは
PV は GA4、検索での見つかりやすさは GSC、と分けて並べること。足し算はしない。
GSC の clicks は GA4 の「Organic Search の PV」に近いが一致はしない。

### 貯まるファイル（検索）

| ファイル | 中身 | 営業でどう使うか |
|---|---|---|
| `data/search/monthly.csv` | 月次（表示回数・クリック・CTR・平均掲載順位） | 検索での伸びを時系列で見せる |
| `data/search/queries/YYYY-MM.csv` | 検索キーワード別 上位50 | 「どんな言葉で見つかっているか」＝読者の関心の証明 |
| `data/search/pages/YYYY-MM.csv` | ページ別 上位50 | どの記事が検索資産になっているか |
| `data/search/latest.json` | 最新月の要約＋上位キーワード10 | 媒体資料ページの生成元 |

- 数字は**確定まで2〜3日**かかる。当月ぶんを取ると末尾が欠ける。
  なので毎月1日の自動実行では前月と**前々月**を取り直して、後から埋め直している（上書きなので二重にならない）。
- 16ヶ月より前は Google 側にも残っていないので永久に取れない。

---

## 普段の使い方

```bash
cd 610_sixten/journal_auto/analytics

python3 fetch_ga4.py --summary        # 直近12ヶ月のPV/UUを表で見る（ネット不要・鍵不要）
python3 fetch_ga4.py                  # 前月分を取得
python3 fetch_ga4.py --month 2026-10  # 指定した月を取得
python3 fetch_ga4.py --since 2026-09  # その月から先月までまとめて取得（取りこぼしの穴埋め）
python3 fetch_ga4.py --selftest       # 保存処理の自己診断（API不要）
```

同じ月を何度取り直しても行は増えない（上書きされる）ので、気軽に走らせていい。

## 貯まるファイル

| ファイル | 中身 | 営業でどう使うか |
|---|---|---|
| `data/monthly.csv` | 月次サマリ（1行=1ヶ月） | 媒体資料の「月間PV / UU」はここ |
| `data/articles/YYYY-MM.csv` | 記事別ランキング | 「どのネタが強いか」＝提案の説得材料 |
| `data/channels/YYYY-MM.csv` | 流入元（検索/SNS/直接） | 検索流入比率＝資産性の証明 |
| `data/devices/YYYY-MM.csv` | 端末（モバイル/PC） | 広告フォーマットの選定根拠 |
| `data/audience/YYYY-MM.csv` | 年齢・性別 | ターゲット層の提示（※下記の注意あり） |
| `data/latest.json` | 最新月の要約 | 媒体資料ページを自動生成するときの元データ |

> 読者層（audience）は Google シグナルが有効で、かつ人数がある程度いないと
> Google 側のしきい値で伏せられて空になる。数字が増えてから使う。

## 知っておくこと

- **このリポジトリは public** なので、ここに commit される PV/UU は誰でも見られる。
  もともと広告主に出す数字だし、`latest.json` は媒体資料ページの生成元として使う想定なので
  そのままにしてある。伏せたくなったら言ってくれれば private な置き場に切り替える。
- Search Console（検索の表示回数・クリック）は `fetch_gsc.py` で自動取得済み（上のステップ4）。
  所有権確認は `site/google353a8b31d20cdaa9.html` で済んでいる。
  画面で見たいときは https://search.google.com/search-console 。
- プライバシーポリシー（`site/privacy.html`）は GA4/Cookie の利用を明記済み。全ページのフッターから導線が入る。
