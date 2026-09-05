#!/bin/bash
# IndexNow 送信(2026-09-05設置)。sitemap.xml の全URLを api.indexnow.org へPOSTし、
# Bing / Yandex / Naver / Seznam 等(Copilot・ChatGPT検索の下地になるBingインデックス)へ更新を即時通知する。
# Googleは IndexNow 非参加なので Search Console のsitemap登録で別途カバー。
# 使い方: リポジトリルートで bash journal_auto/indexnow_ping.sh  (deploy.yml がデプロイ後に自動実行)
set -u
cd "$(dirname "$0")/.."
KEYFILE=$(ls site/*.txt 2>/dev/null | grep -E '/[0-9a-f]{32}\.txt$' | head -1)
if [ -z "$KEYFILE" ]; then echo "indexnow: key file not found (site/<32hex>.txt)"; exit 0; fi
KEY=$(basename "$KEYFILE" .txt)
URLS=$(grep -o '<loc>[^<]*</loc>' site/sitemap.xml | sed 's/<loc>//;s/<\/loc>//' | sed 's/&amp;/\&/g')
COUNT=$(printf '%s\n' "$URLS" | grep -c .)
BODY=$(python3 - "$KEY" <<PY
import json, sys
urls = [u for u in """$URLS""".split() if u]
print(json.dumps({"host": "sixten.jp", "key": sys.argv[1], "keyLocation": f"https://sixten.jp/{sys.argv[1]}.txt", "urlList": urls}))
PY
)
CODE=$(curl -s -o /tmp/indexnow_resp.txt -w '%{http_code}' --max-time 30 -X POST 'https://api.indexnow.org/indexnow' -H 'Content-Type: application/json; charset=utf-8' --data "$BODY")
echo "indexnow: submitted $COUNT urls -> HTTP $CODE $(head -c 200 /tmp/indexnow_resp.txt)"
exit 0
