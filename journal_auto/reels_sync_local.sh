#!/bin/zsh
# 610 VIDEO リール同期のローカル実行ラッパー（launchdから毎朝07:00に起動）
# CHANGEDのときだけ対象ファイルをcommit→push（=公開）。それ以外は何もしない。
REPO="/Users/muuetemuneokirisuchan/Desktop/my-ai-agent/610_sixten"
LOG="$REPO/journal_auto/logs/reels_sync.log"
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

cd "$REPO" || exit 1
mkdir -p journal_auto/logs

OUT=$(python3 journal_auto/reels_sync.py 2>>"$LOG")
CODE=$?
echo "$(date '+%Y-%m-%d %H:%M:%S') exit=$CODE $OUT" >> "$LOG"

if [ $CODE -eq 0 ] && [[ "$OUT" == CHANGED:* ]]; then
  # 変更範囲が想定内（index.htmlとreelアセット）かを確認してからcommit
  UNEXPECTED=$(git status --porcelain | grep -v -E "site/journal/index\.html|site/assets/reel-")
  if [ -n "$UNEXPECTED" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') SKIP_COMMIT: 想定外の変更あり: $UNEXPECTED" >> "$LOG"
    exit 1
  fi
  git add site/journal/index.html site/assets
  git commit -m "journal: 610 VIDEOを最新リール4本に自動更新 (reels_sync)" >> "$LOG" 2>&1
  git push >> "$LOG" 2>&1 || { git pull --rebase >> "$LOG" 2>&1 && git push >> "$LOG" 2>&1; }
fi
