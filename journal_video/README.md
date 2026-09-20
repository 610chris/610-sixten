# 610journal-video

610ジャーナルのSNS縦型ニュース動画（1080×1920）を、**JSONを1枚置くだけで量産する** Remotion プロジェクト。

## 使い方

```bash
npm install                                        # 初回だけ
npm run dev                                        # Remotion Studio でプレビュー
npm run render -- input/2026-06-nba-finals.json    # 1本だけ書き出し
npm run render:all                                 # input/ の全JSONを一括書き出し
npm run typecheck
```

出力は `out/<JSONと同じ名前>.mp4`。

## JSON の書き方

`input/` に置く。必須は `label` / `headline` / `body` / `background` の4つだけ。

```json
{
  "label": "NEWS",
  "headline": "NBA Finals",
  "body": [
    "2026年、NBAチャンピオンは",
    "ニューヨーク・ニックス！",
    "94-90で53年ぶりの優勝。"
  ],
  "background": { "type": "image", "src": "assets/knicks.jpg" },
  "brandTag": { "type": "logo", "src": "assets/610journal-logo.png" },
  "bgm": "audio/default.mp3",
  "durationInSeconds": 12
}
```

| キー | 必須 | 内容 |
|---|---|---|
| `label` | ○ | 画面上部の小さいラベル（`NEWS` / `BREAKING` など） |
| `headline` | ○ | 大見出し。長いほど自動で縮む（104→58px の5段階） |
| `body` | ○ | **配列の1要素＝1行**。この行数で尺が決まる |
| `background` | ○ | `{"type":"image"\|"video","src":"..."}`。`src` は `public/` 配下の相対パス |
| `brandTag` | | 省略で黒版ロゴ。文字列を書くと白ボックスに黒文字で組む |
| `bgm` | | `public/` 配下の相対パス。**ステレオ音源を推奨**（モノラルだと -3dB 下がる） |
| `durationInSeconds` | | 尺の手動指定。省略時は本文行数から自動計算（8〜30秒でクランプ） |

素材は `public/assets/`（画像）と `public/audio/`（BGM）に置く。
JSON が参照する素材が無いときはレンダリング前にエラーで止まる。

### 背景画像のサイズ

**縦長、または短辺 1920px 以上**を推奨。画面は 1080×1920 で、画像は `object-fit: cover` ＋
最大1.06倍のズームで引き伸ばされるため、記事のヒーロー画像（1600×900）をそのまま使うと **2.26倍**に拡大されて眠い絵になる。
1.2倍を超える拡大になる画像は、レンダリング時に必要サイズ付きで警告が出る（止まりはしない）。

## 尺の自動計算

```
尺 = 2.0（本文開始）+ 0.55 × 本文行数 + 0.8（間）+ 0.5（ワイプ）+ 3.0（余韻）
```

本文5行なら 9.05秒。最短8秒・最長30秒。

## タイムライン

| 時刻 | 動き |
|---|---|
| 0.0s〜 | 背景が 1.00→1.06 までゆっくりズーム（Ken Burns・画像背景のみ）／暗転が 0.15→0.55 へ線形に濃くなる |
| 0.2s | ラベルがフェードイン（0.4秒） |
| 1.2s | 見出しが下から28pxスライド＋フェードイン（0.6秒） |
| 2.0s〜 | 本文が1行ずつ、0.55秒間隔でフェードイン（各0.5秒・下から18px） |
| 最終行+0.8s | ブランドタグの白ボックスが左→右へワイプ（0.5秒）、開ききってからロゴが出る |
| 以降 | 3秒の余韻。BGMは末尾0.8秒でフェードアウト |

イージングは全て `Easing.out(Easing.cubic)`（減速して止まる・バウンドなし）。最終状態は保持される。

## 文字の下敷き（スクリム）

暗転オーバーレイは 0.15 から始まるので、**明るい写真**を背景にすると序盤の白文字が背景に溶ける。
実測（白い靴の記事写真）では、スクリム無しだとラベルのコントラストが **1.71:1**（読めない）だった。

そこで上端と下端だけ、時間に依らない黒のグラデーション（`src/components/Scrim.tsx`）を常時敷いている。
画面中央（上から約30%〜下から約64%）には掛からないので、被写体は暗転のぶんだけで見える。
濃さは `theme.ts` の `SCRIM`。弱めたいときはここの alpha を下げる。

| 背景 | 測定箇所 | スクリム無し | スクリム有り |
|---|---|---|---|
| 明るい写真 | ラベル 0.4秒 | 文字が背景に埋もれて検出不能 | **4.95:1** |
| 明るい写真 | 見出し 1.5秒 | 3.03:1 | **6.19:1** |
| 明るい写真 | 見出し＋本文 末尾 | 5.10:1 | **11.73:1** |
| 暗い写真 | 見出し 1.5秒 | 3.41:1 | **13.58:1** |

（白文字グリフの周囲6pxの実背景・明るい方5%で測定。WCAG AA の基準は 4.5:1）

## ファイルの役割

| ファイル | 役割 |
|---|---|
| `src/theme.ts` | 色・サイズ・余白・フォント。**見た目の数値はここだけ** |
| `src/timeline.ts` | 秒数・尺の計算。**タイミングの数値はここだけ** |
| `src/animation.ts` | フェード／スライドの共通ヘルパー |
| `src/props.ts` | JSON の検証と正規化 |
| `src/components/Scrim.tsx` | 文字の下敷き。上下だけ黒のグラデを常時敷いて白文字を読ませる |
| `src/NewsVideo.tsx` | 本体。背景→暗転→下敷き→ラベル→見出し＋本文→ブランドタグ→BGM の重ね順 |
| `scripts/render.ts` | 書き出し（`npm run render`） |

文字ブロックの縦位置は `theme.ts` の `TEXT_BLOCK.anchor`（`"top"` / `"center"` / `"bottom"`）で切り替わる。既定は `"bottom"`（ブランドタグの上に下寄せ）。

## BGM

`public/audio/_bgm-test-tone.mp3` は**配線を確かめるためのサイン波**で、作品用の音ではない。
Artlist から本番BGMを `public/audio/` に置いて、JSON の `"bgm"` をそのファイル名に変えれば差し替わる。
テストトーンはそのとき消してよい。

実測（`tests/test-01-long.json`・尺12.90秒）:

| 測定 | 結果 |
|---|---|
| 音声ストリーム | AAC / 2ch で合成される |
| 音量 | 元音源比 **−4.7dB＝倍率0.58**（`BGM.volume` の設定値 0.6・誤差3%） |
| フェードアウト | 12.10秒まで −32.0dB で平ら → 12.5s −37.7dB → 12.7s −42.1dB → 12.85s −53.2dB |
| `bgm` を書かない場合 | 音声ストリームそのものが作られない |

## 背景写真の EXIF 回転

スマホ・一眼で撮った写真は「横倒しのピクセル＋回転しろという EXIF」で入っていることがある。
描画エンジン（Chromium）は EXIF を適用して回すので**絵は正しく出る**が、解像度チェックが生のピクセル幅を読むと
縦横が逆になり警告が真逆になる。`scripts/render.ts` の `jpegOrientation()` で Orientation 5〜8 を検出して幅高を入れ替えている。

実測: 生ピクセル 1000×2000 ＋ Orientation=8 の JPEG を「2000×1000・2.04倍に拡大」と正しく警告した（対応前は 1.14倍で無警告だった）。

## 指示書との対応

指示書は `~/Downloads/610journal-remotion-spec.md`。§9「完成の条件」を実測で確認した結果:

| 完成の条件 | 実測 |
|---|---|
| JSONを1つ足すだけで1本書き出せる | ✅ `npm run render:all` で input/ の本数ぶん出力（4本で確認） |
| コードを触らず見出し・本文・背景・BGM・ブランドタグを差し替えられる | ✅ tests/ の5本はすべてJSONだけの違い |
| 本文の行数が変わっても尺とレイアウトが破綻しない | ✅ 1行=8.00秒 / 3行=8.00秒（下限クランプ）/ 5行=9.07秒 / 12行=12.90秒。全ケースで文字ブロックとブランドタグの隙間 90〜116px（設計値76px・衝突なし） |
| 日本語が正しく表示されフォントが崩れない | ✅ 漢字・ひらがな・カタカナ・長音・全角ダッシュ・鉤括弧・半角英数混在すべて描画（豆腐なし） |
| 見出しが長い場合も自動改行されはみ出さない | ✅ 21字の見出しが2行に折返し、右端 x=982（マージン境界 1015px の内側） |
| 色・フォント・タイミングが theme.ts / timeline.ts に集約 | ✅ 数値の定義はこの2ファイルのみ |

**指示書からあえて変えた3点**（どれも1箇所戻せば指示書通りになる）:

1. **見出しの垂直位置**。§4-4は「上から約23%」だが、クリスの「文字の場所も見づらい」を受けて下寄せにした。
   → `theme.ts` の `TEXT_BLOCK.anchor` を `"top"` に戻せば指示書通り。
2. **`brandTag` を必須の文字列から任意＋ロゴ対応に拡張**。§10の回答が「ブランドタグ＝ロゴ画像」だったため。
   文字列で書けば §3 のままの挙動（`tests/test-03-textbrand.json` で確認済み）。
3. **スクリムの追加**（指示書に無いレイヤー）。明るい写真で白文字が読めなかったため。
   → `NewsVideo.tsx` から `<Scrim />` を1行外せば元に戻る。暗転オーバーレイの数値（0.15→0.55）は指示書のまま触っていない。

## 記事から自動生成（クリスの操作ゼロ）

記事化ルーチンが `journal_auto/ig_queue.json` に記事を積むと、GitHub Actions が動画を作って Release に置く。
下の「実記事から1本作る手順」を全部自動にしたもの。

```
ig_queue.json に push
  → .github/workflows/video-build.yml
  → journal_auto/video_build.py       まだ動画が無い記事を最大6本
      → journal_auto/video_input.py   文言は ig_queue.json、背景は選手の写真を探して入力JSONを作る
      → scripts/render.ts             out/<slug>.mp4
  → Release「videos」に mp4 と video_status.json を添付
```

```bash
python3 journal_auto/video_build.py                          # 未作成の記事をまとめて
python3 journal_auto/video_build.py 137 --force --no-upload  # ローカルで1本だけ作り直して確認
```

Actions の手動実行（workflow_dispatch）でも `ids` と `force` を指定できる。

### 背景の探し方

記事化ルーチンが `ig_queue.py add --subject "Bradley Beal"` で**記事の主役の選手名（英語）**を入れておく。
`video_input.py` は次の順で探し、取れた時点で止める。

| 順 | 経路 | 中身 |
|---|---|---|
| ① | `journal_auto/hero_sources.json` | 記事ヒーローに使った写真の原寸（汎用のイメージ写真は除く）。顔を上から30%に置いて縦に切る |
| ② | Commons 直近3年 | 選手名で検索。切り抜く高さが元画像で1600px以上・顔が検出できるもの |
| ③ | NBA.com 公式ヘッドショット | Wikidata P3647 で選手IDを引き、黒地に合成 |
| ④ | Commons 年代不問 | ②の年代制限を外したもの |
| ⑤ | 記事ヒーローのぼかし | `subject` が無い記事（シューズ単体など）を、ぼかした背景の上に重ねる |
| ⑥ | 汎用フォールバック写真の縦版 | 記事が `journal_auto/fallback-images.md` の汎用写真を使っていて、記事専用ヒーローが無い場合 |

### ⑥ 汎用フォールバック写真の縦版（2026-09-20）

記事が汎用写真を使うとき、記事側は `site/assets/journal-fallback-0N.jpg`（1600x900）をそのまま参照し
`journal-NNN-hero.jpg` を作らない。⑤がそのファイル名だけを見ていたため空振りし、**64本中16本が真っ黒**だった。

同じ4枚を Commons の原寸から 9:16 に切り直した縦版を `public/assets/journal/fallback/0N.jpg` に常備する。

```bash
python3 journal_auto/make_video_fallbacks.py     # 4枚を作り直す（通常は不要・git に入っている）
```

どの写真かは記事の `photo_credit` の撮影者名で一意に決まる（記事と動画で同じ写真になる）。
写真を選べない＝同じ絵が続くので、常備画像は画面より **360px 横に広い 1440x1920** で持ち、
記事番号で切り出し窓を左/中/右にずらしている（`pan=0.0/0.5/1.0`・拡大なし）。連番の記事は必ず別の位置になる。

#### 実測（16本すべて・`scripts/check_contrast.py`）

汎用写真は明るいものを含む（夕日のコートは平均輝度162）ため、白文字が溶けないかを全本測った。

| | コントラスト比（背景の明るい方5%） |
|---|---|
| 16本の範囲 | **5.55〜11.01:1**（全本 WCAG AA 4.5:1 を超える） |
| いちばん低い | 193 えいごdeバスケ 5.55:1 |
| いちばん明るい背景 | 176 Kobe 3 Low（輝度162）で 8.79:1 |

```bash
python3 scripts/check_contrast.py out/176-kobe-3-low-mismatch.mp4
```

`hero_sources.json` は `pick_commons_photo.py` / `pick_flickr_photo.py` が記事の写真を保存したときに自動で追記する。

### 写真クレジット

画面の下端（`theme.ts` の `CREDIT`・22px・不透明度0.7）に写真の出典を出す（`src/components/Credit.tsx`・JSON の `credit`）。
例: `撮影: Bryan Berlin / CC BY-SA 4.0, via Wikimedia Commons` ／ `写真: NBA.com`

### 記録を git に commit しない理由

どの記事を作ったかの記録 `video_status.json` は、リポジトリではなく **Release「videos」の添付**に置いている。
commit すると push のたびに記事化ルーチンの webhook が空振りで起動するため。ローカル実行時は `out/video_status.json`。

### 実測（2026-09-14・各 1080×1920 / 240フレーム / 8.00秒）

| 記事 | 経路 | クレジット位置 | ブランドタグとの隙間 |
|---|---|---|---|
| 134 Anthony Edwards | ② Commons（2026-07-07撮影） | y1849-1870 / x66-665 | 161px |
| 135 AJ1 Low（subject なし） | ⑤ ヒーローのぼかし | y1849-1870 / x66-531 | 161px |
| 137 Bradley Beal | ③ NBA.com ヘッドショット（Commons 直近3年は候補0） | y1849-1868 / x66-214 | 161px |

クレジットの右端はいちばん長い134でも x665（マージン境界 1015px の内側）。文字ブロック・ブランドタグ（最下端 y1688）とは重ならない。

## 実記事から1本作る手順

記事135（Air Jordan 1 Low OG「Last Dance At The Garden」）で実際に1本作った。
`input/135-air-jordan-1-low-last-dance-at-the-garden.json` → `out/135-air-jordan-1-low-last-dance-at-the-garden.mp4`（8.00秒）。

1. **文言は `journal_auto/ig_queue.json` からそのまま取る**。記事1本ぶんのエントリに
   `category`（→`label`）・`headline`・`points`（→`body` の3行）が揃っているので、書き起こさない＝事実がズレない。
   見出しは記事タイトルの末尾（「が9月26日発売」など）を落として商品名だけにし、日付は `body` に回すと読みやすい。
2. **背景は記事のヒーロー画像を使わない**。`site/assets/journal-NNN-hero.jpg` は全部 1600×900 で、
   縦型にすると 2.26倍に伸びて眠くなる。出典（Wikimedia Commons など）の**原寸**を落として縦に切り抜く。

   ```bash
   # 例: Commons の原寸URLと解像度を調べる（UAは明示する）
   curl -s -H "User-Agent: 610journal/1.0 (メールアドレス)" \
     "https://commons.wikimedia.org/w/api.php?action=query&titles=File:〜.jpg&prop=imageinfo&iiprop=url|size&format=json"
   ```

   切り抜きは `ImageOps.exif_transpose()` を通してから（PIL の素の `save` は EXIF を落とすので、
   横倒しのピクセルだけが残って事故る）。9:16 で短辺 1080px 以上あれば拡大警告は出ない。
   記事135は 4094×2730 の原寸から x1157 起点・1536×2730 で切り出した（出力1080に対して 0.70倍＝縮小のみ）。
3. `npm run render -- input/<slug>.json` で書き出し、`out/` の mp4 を確認する。
4. **JSON に出典を残す**。`_article` / `_source` / `_photoCredit` は描画には使われない（`props.ts` は既知のキーだけ読む）が、
   後からどの記事・どの写真かを追えるようにするためのメモとして書いておく。

### 記事135の実測（1080×1920 / 30fps / 8.00秒 / 音声なし）

白文字のコントラストは、**文字が出る前（0.9秒・暗転がいちばん薄い＝最悪ケース）のフレーム**を背景として、
文字画素と同じ座標で比べて測った。

| 測定 | 結果 |
|---|---|
| ラベル「KICKS」 0.9秒 | **12.07:1** |
| 見出し＋本文（文字画素 71,385px） | 背景の明るい方5%に対し **7.90:1** ／ いちばん明るい画素でも **7.11:1** |
| 本文帯（y1050〜1700）の白飛び | 0.00%（輝度 最大99・平均55） |
| レイアウト | 見出し上端 y1109 → 本文下端 y1514 → ブランドタグ箱 y1590-1690。重なりなし |
| 見出しの折返し | 45文字（全角換算25.7字 → 68px）が2行（右端 x967・マージン境界 1015px の内側） |

（WCAG AA の基準は 4.5:1）

## tests/

仕様の確認用JSON。`input/` に置くと `render:all` に混ざるので分けてある。個別に指定すれば動く。

```bash
npm run render -- tests/test-01-long.json
```

| ファイル | 何を確かめるもの |
|---|---|
| `test-01-long.json` | 本文12行・見出し21字・縦長背景・BGM |
| `test-02-min.json` | 本文1行・見出し2字（尺の下限クランプ） |
| `test-03-textbrand.json` | `brandTag` を文字列で指定した場合 |
| `test-04-smallbg.json` | 1600×900 の背景（拡大警告） |
| `test-05-exif.json` | EXIF Orientation 付き背景（回転を反映した警告） |

参照する写真は `public/assets/test/`（Wikimedia Commons・CC BY 4.0 / CC BY-SA 4.0）。テスト専用で、記事には使わない。

比較シート: `out/verify/step5-spec-check.png`
