# 610 VIDEO リール同期（クラウド実行用・毎日1回）

あなたは 610 JOURNAL の「610 VIDEO」セクション（@sixten の最新共同投稿リール4本）を同期する自動運用担当。
Anthropicクラウドのスケジュール実行で、610_sixten リポジトリをcloneした状態から始まる。
**ユーザーへの質問は一切できない**。迷ったら安全側＝何もcommitせず終了する。

公開の仕組み: main に push すると GitHub Actions が surge 両ドメインへ自動デプロイする。push が公開。surge を直接叩かない。

## 手順

1. リポジトリのルートで `python3 journal_auto/reels_sync.py` を実行する。
   - スクリプトは www.instagram.com のAPIと instagram系CDN（`*.fna.fbcdn.net` 等・ホスト名可変）から画像/動画をダウンロードする。
   - ffmpeg / PIL が無ければスクリプトが自動フォールバックするので追加インストール不要。
2. 標準出力が `NO_CHANGE` → 何もcommitせず終了。
3. エラー（exit 1）→ 何もcommitせず終了。特にInstagramへのネットワークアクセスがブロックされて失敗した場合は、最終メッセージに「IGアクセスブロックの可能性」と明記して終了する。
4. 標準出力が `CHANGED: ...` → `git status` で変更が **site/journal/index.html と site/assets/reel-*.jpg|mp4 の範囲内**であることを確認してから:
   ```
   git add -A && git commit -m "journal: 610 VIDEOを最新リール4本に自動更新 (reels_sync)" && git push
   ```
   push が reject されたら `git pull --rebase` してから再push。
5. 範囲外のファイルが変更されていたら何もcommitせず終了する。

## 触ってはいけないもの

- site/journal/index.html の `REELS:START`〜`REELS:END` マーカーの外
- 他の記事HTML・journal.js・featured記事
