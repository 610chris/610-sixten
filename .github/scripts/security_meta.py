#!/usr/bin/env python3
"""デプロイ直前に site/ の全HTMLへセキュリティ用の meta とスクリプトを差し込む（2026-11-19 サイトセキュリティ総点検）。

Surge は任意の応答ヘッダを付けられず、sixten.jp は Cloudflare 前段で http でも 200 を返すため、
ヘッダの代わりにページ内で次を行う（ソースのHTMLは書き換えず、Actions の作業コピーだけに入れる）:
  - http で開かれたら https へ置き換え（Cloudflare の Always Use HTTPS が入るまでの代替）
  - 他サイトの iframe に入れられたら最上位で開き直す（frame-ancestors は meta では効かないための代替）
  - CSP(meta): upgrade-insecure-requests / object-src 'none' / base-uri 'self'
  - Referrer-Policy(meta): strict-origin-when-cross-origin
<head> の無いファイル（Search Console の確認用HTML等）と、既に差し込み済みのファイルは触らない。
"""
import pathlib
import re
import sys

MARK = 'data-sec-guard="1"'
CSP = '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests; object-src \'none\'; base-uri \'self\'">'
REF = '<meta name="referrer" content="strict-origin-when-cross-origin">'
JS = ('<script ' + MARK + '>if(location.protocol==="http:"&&!/^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname))'
      'location.replace("https://"+location.host+location.pathname+location.search+location.hash);'
      'if(window.top!==window.self){try{window.top.location=window.location.href}catch(e){}}</script>')

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "site")
changed = skipped = 0
for p in root.rglob("*.html"):
    s = p.read_text(encoding="utf-8")
    m = re.search(r"<head(\s[^>]*)?>", s, re.I)
    if not m or MARK in s:
        skipped += 1
        continue
    add = [JS]
    if not re.search(r'http-equiv=["\']Content-Security-Policy', s, re.I):
        add.append(CSP)
    if not re.search(r'<meta[^>]+name=["\']referrer', s, re.I):
        add.append(REF)
    # 文字コード宣言は先頭1024バイト以内に置く必要があるので、meta charset があればその直後に入れる
    cm = re.search(r"<meta[^>]+charset=[^>]*>", s[m.end():], re.I)
    pos = m.end() + cm.end() if cm else m.end()
    s = s[:pos] + "\n" + "\n".join(add) + s[pos:]
    p.write_text(s, encoding="utf-8")
    changed += 1
print(f"security_meta: changed={changed} skipped={skipped}")
