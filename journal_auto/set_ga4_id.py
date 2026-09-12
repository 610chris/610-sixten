#!/usr/bin/env python3
"""GA4の測定IDを1コマンドで全ページに反映する（2026-09-12設置）

使い方:
    python3 journal_auto/set_ga4_id.py G-XXXXXXXXXX   … 測定IDを設定して全HTMLにタグを入れる
    python3 journal_auto/set_ga4_id.py --off          … 測定IDを空にして全HTMLからタグを消す
    python3 journal_auto/set_ga4_id.py --show         … 今の設定を表示するだけ

測定IDの取り方:
    https://analytics.google.com/ → 管理 → プロパティを作成
      プロパティ名: 610 sixten / タイムゾーン: 日本 / 通貨: 円
      → データストリーム → ウェブ → URL: https://sixten.jp / ストリーム名: 610 sixten
      → 作成直後に出る「測定ID」(G- で始まる) をこのコマンドに渡す

反映されるのは手元のファイルまで。公開するには git commit → push が必要(GitHub Actions が surge へ配る)。
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONFIG = HERE / "analytics_config.json"
BUILD = HERE / "build_seo.py"
ID_RE = re.compile(r"^G-[A-Z0-9]{4,20}$")


def load() -> dict:
    return json.loads(CONFIG.read_text(encoding="utf-8")) if CONFIG.exists() else {}


def save(cfg: dict) -> None:
    CONFIG.write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return 0

    cfg = load()
    arg = args[0].strip()

    if arg == "--show":
        cur = cfg.get("ga4_measurement_id") or ""
        print(f"現在の測定ID: {cur or '(未設定 — 計測タグはどのページにも入っていません)'}")
        return 0

    if arg == "--off":
        new_id = ""
    else:
        new_id = arg.upper()
        if not ID_RE.match(new_id):
            print(f"エラー: 測定IDの形が違います → {arg!r}")
            print("　　　　G- で始まる英数字（例: G-ABCD123XYZ）を渡してください。")
            print("　　　　GA4管理画面の「データストリーム」を開くと右上に表示されています。")
            return 1

    cfg["ga4_measurement_id"] = new_id
    save(cfg)
    print(f"設定を更新: ga4_measurement_id = {new_id or '(空)'}")
    print("build_seo.py を実行して全HTMLに反映します…\n")

    r = subprocess.run([sys.executable, str(BUILD)], cwd=HERE.parent)
    if r.returncode != 0:
        print("\nビルドが失敗しました。上のログを確認してください。")
        return r.returncode

    print("\n" + "-" * 60)
    if new_id:
        print(f"完了: 測定ID {new_id} を site 配下の全HTMLに入れました。")
        print("公開するには 610_sixten で:")
        print('  git add -A && git commit -m "GA4計測タグを導入" && git push')
        print("公開の数分後、GA4の「リアルタイム」で自分のアクセスが見えれば成功です。")
    else:
        print("完了: 計測タグを全HTMLから外しました。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
