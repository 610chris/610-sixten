#!/bin/bash
# 610 JOURNAL 記事自動化ウォッチャー（2026-08-17設置）
# cronから15分おきに起動。PR TIMES RSS(新着200件)からバスケ系を抽出し、
# 未見URLがあるときだけヘッドレスClaude Codeで記事化→両ドメインデプロイ→Mac通知。
# 使い方:
#   watch.sh          … RSSフィード監視（通常運用）
#   watch.sh --sweep  … キーワード検索ページ巡回（1日1回の取りこぼし保険）
set -u
BASE="/Users/muuetemuneokirisuchan/Desktop/my-ai-agent/610_sixten/journal_auto"
REPO="/Users/muuetemuneokirisuchan/Desktop/my-ai-agent"
CLAUDE_BIN="/opt/homebrew/bin/claude"
SEEN="$BASE/seen.txt"
LOCK="$BASE/.lock"
LOG="$BASE/logs/watch-$(date +%Y%m%d).log"
UA='Mozilla/5.0'
mkdir -p "$BASE/logs"
touch "$SEEN"
ts(){ date '+%F %T'; }

# 二重起動防止（Claude実行は数分かかる。前回が生きていたらスキップ）
if ! mkdir "$LOCK" 2>/dev/null; then
  echo "$(ts) skip: 前回実行が継続中" >> "$LOG"
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

CAND="$BASE/candidates.txt"
: > "$CAND"

if [ "${1:-}" = "--sweep" ]; then
  # 検索ページ巡回（「バスケ」検索の上位30件）
  curl -s --max-time 60 -A "$UA" \
    'https://prtimes.jp/main/action.php?run=html&page=searchkey&search_word=%E3%83%90%E3%82%B9%E3%82%B1' \
    | grep -o 'href="/main/html/rd/p/[^"]*"' \
    | sed 's|href="|https://prtimes.jp|; s|"$||' \
    | head -30 | sort -u > "$BASE/.pool"
else
  # 全体RSS(200件)からバスケ系キーワードに一致するリリースを抽出
  curl -s --max-time 60 -A "$UA" https://prtimes.jp/index.rdf > "$BASE/.feed"
  /usr/bin/python3 - "$BASE/.feed" <<'PY' > "$BASE/.pool"
import re, sys, html
feed = open(sys.argv[1], encoding='utf-8', errors='ignore').read()
kw = re.compile(r'バスケットボール|バスケ|Bリーグ|B\.LEAGUE|B\.リーグ|NBA|3x3|Wリーグ')
for m in re.finditer(r'<item rdf:about="([^"]+)">(.*?)</item>', feed, re.S):
    url, body = m.group(1), m.group(2)
    t = re.search(r'<title>(.*?)</title>', body, re.S)
    d = re.search(r'<description>(.*?)</description>', body, re.S)
    text = html.unescape((t.group(1) if t else '') + ' ' + (d.group(1) if d else ''))
    if kw.search(text):
        print(url)
PY
fi

# 既読(seen.txt)にないURLだけ候補にする
while IFS= read -r u; do
  [ -z "$u" ] && continue
  grep -qxF "$u" "$SEEN" || echo "$u" >> "$CAND"
done < "$BASE/.pool"

n=$(grep -c . "$CAND" 2>/dev/null || echo 0)
if [ "$n" -eq 0 ]; then
  echo "$(ts) 新着なし (${1:-feed})" >> "$LOG"
  exit 0
fi

echo "$(ts) 新着${n}件 → Claude起動 (${1:-feed})" >> "$LOG"
cat "$CAND" >> "$LOG"

: > "$BASE/last_result.txt"
cd "$REPO" || exit 1
"$CLAUDE_BIN" -p "【実行】$(cat "$BASE/PROMPT.md")

## 今回の候補URL
$(cat "$CAND")" --dangerously-skip-permissions >> "$LOG" 2>&1
rc=$?

if [ "$rc" -eq 0 ]; then
  cat "$CAND" >> "$SEEN"
  msg=$(head -1 "$BASE/last_result.txt" 2>/dev/null | tr -d '"' | cut -c1-200)
  [ -z "$msg" ] && msg="実行完了（詳細はログ）"
  /usr/bin/osascript -e "display notification \"$msg\" with title \"610 JOURNAL 自動更新\"" 2>/dev/null
  echo "$(ts) 完了: $msg" >> "$LOG"
else
  /usr/bin/osascript -e "display notification \"記事化の実行に失敗(rc=$rc)。次回リトライ\" with title \"610 JOURNAL 自動更新\"" 2>/dev/null
  echo "$(ts) 失敗 rc=$rc（seen未更新→次回再試行）" >> "$LOG"
fi
