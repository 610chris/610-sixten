# フォールバック写真（記事hero用・リポジトリ常備）

写真が他ルート（og:image / Wikimedia Commons検索）で用意できなかった記事に使う汎用バスケ写真。
全て `site/assets/` に1600x900・jpeg品質80で格納済み。ライセンスは取得日（2026-08-19）にWikimedia Commons APIのextmetadataで確認済み。

| ファイル | 内容（選び方の目安） | 出典（Wikimedia Commons） | 撮影者 | ライセンス |
|---|---|---|---|---|
| `journal-fallback-01.jpg` | アリーナのフープとネット。NBA・Bリーグ・試合/移籍などニュース系向け | File:Basketball net.jpg | J.smith | CC BY-SA 4.0 |
| `journal-fallback-02.jpg` | 夕暮れのフープとヤシの木のシルエット（Venice Beach）。カルチャー/KICKS系向け | File:Outdoor basketball in Venice (Unsplash).jpg | Nick Jio | CC0 |
| `journal-fallback-03.jpg` | 夕日のストリートコート全景（Venice Beach）。ストリート/イベント系向け | File:Outdoor basketball with sunset (Unsplash).jpg | Matteo Paganelli | CC0 |
| `journal-fallback-04.jpg` | 青空と屋外フープの見上げカット。汎用 | File:A basketball hoop positioned against a clear blue sky, revealing white clouds.jpg | Shixart1985 | CC BY 2.0 |

## キャプション書式（figcaption にそのまま使う）

- 01: `画像: イメージ（本文とは直接関係ありません）。撮影: J.smith / CC BY-SA 4.0, via Wikimedia Commons`
- 02: `画像: イメージ（本文とは直接関係ありません）。撮影: Nick Jio / CC0, via Wikimedia Commons`
- 03: `画像: イメージ（本文とは直接関係ありません）。撮影: Matteo Paganelli / CC0, via Wikimedia Commons`
- 04: `画像: イメージ（本文とは直接関係ありません）。撮影: Shixart1985 / CC BY 2.0, via Wikimedia Commons`

## 使い方の注意

- そのままheroに使う（再ダウンロード・再変換不要）。journal.js の thumb にも同じパスを入れる
- 同じフォールバック写真が直近の記事と連続しないよう、直近記事のheroを見て別の番号を選ぶ
- OGP(og:image)にもこのフォールバック写真の絶対URLを使う（og-default.jpgより写真優先）
