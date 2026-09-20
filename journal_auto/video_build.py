#!/usr/bin/env python3
"""ig_queue.json の記事 → 縦型ニュース動画（mp4）を自動で作って GitHub Release「videos」に置く

GitHub Actions（.github/workflows/video-build.yml）が ig_queue.json の push で起動して叩く。
クリスの操作はゼロ（2026-09-14 クリス指示「俺は1つも動きたくない。完全自動で記事が作られる形がいいんだ」）。

    python3 journal_auto/video_build.py                 # まだ動画が無い記事を最大6本
    python3 journal_auto/video_build.py 137 --force     # 指定記事を作り直す
    python3 journal_auto/video_build.py 137 --no-upload # ローカル確認（journal_video/out/ に書くだけ）

作ったかどうかの記録（video_status.json）は git に commit せず Release の添付ファイルとして置く。
commit すると push のたびに記事化ルーチンの webhook が空振りで起動してしまうため。
"""

import argparse, json, os, subprocess, sys, tempfile
from datetime import datetime, timedelta, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import video_input  # noqa: E402

JST = timezone(timedelta(hours=9))
TAG = "videos"
STATUS = "video_status.json"
MAX_PER_RUN = 6

# 記事ページに埋め込む軽量版の置き場と変換設定（2026-09-20）
# Release の mp4 を直リンクしないのは、GitHub が Release アセットを octet-stream + attachment で
# 返すため iOS Safari が再生しないから。サイト自身から配信すれば video/mp4 になる。
# Remotion の出力はフルレンジ（yuvj420p / pc / bt470bg）なので tv + bt709 に正規化する。
SITE_VIDEO = os.path.join(os.path.dirname(HERE), "site", "assets", "journal", "video")
WEB_VF = ("scale=720:1280:flags=lanczos,"
          "scale=in_range=pc:out_range=tv:in_color_matrix=bt470bg:out_color_matrix=bt709,"
          "format=yuv420p")


def make_web_copy(mp4, article_id):
    """記事ページ用の軽量版（720x1280・音声なし・faststart）を site/ に置く

    記事内の表示幅は 300px なので 720p で足りる（1080p の約1/2.4のサイズ）。
    ここに置いたファイルを .github/workflows/video-build.yml が commit し、
    deploy.yml の build_seo.py が記事末尾の <video> に差し込む。
    """
    os.makedirs(SITE_VIDEO, exist_ok=True)
    out = os.path.join(SITE_VIDEO, f"{article_id}.mp4")
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", mp4, "-vf", WEB_VF,
           "-color_range", "tv", "-colorspace", "bt709",
           "-color_primaries", "bt709", "-color_trc", "bt709",
           "-c:v", "libx264", "-crf", "26", "-preset", "slow",
           "-pix_fmt", "yuv420p", "-profile:v", "high",
           "-movflags", "+faststart", "-an", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"web 版の変換に失敗: {(r.stderr or '').strip()[:200]}")
    return out


def gh(*args, check=True):
    return subprocess.run(["gh", *args], check=check, capture_output=True, text=True)


def repo():
    return os.environ.get("GITHUB_REPOSITORY") or gh("repo", "view", "--json", "nameWithOwner",
                                                     "-q", ".nameWithOwner").stdout.strip()


def ensure_release():
    if gh("release", "view", TAG, check=False).returncode != 0:
        gh("release", "create", TAG, "--title", "610 JOURNAL 縦型ニュース動画",
           "--notes", "journal_auto/video_build.py が記事ごとに自動で置く縦型動画（1080x1920）。")


def load_status(upload):
    if upload:
        with tempfile.TemporaryDirectory() as d:
            p = os.path.join(d, STATUS)
            if gh("release", "download", TAG, "-p", STATUS, "-O", p, check=False).returncode == 0:
                return json.load(open(p, encoding="utf-8"))
        return {}
    p = os.path.join(video_input.VIDEO, "out", STATUS)
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


def save_status(status, upload):
    p = os.path.join(video_input.VIDEO, "out", STATUS)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(status, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")
    if upload:
        gh("release", "upload", TAG, p, "--clobber")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--force", action="store_true", help="動画があっても作り直す")
    ap.add_argument("--no-upload", action="store_true", help="Release に上げない（ローカル確認用）")
    ap.add_argument("--max", type=int, default=0,
                    help=f"1回の上限。0（既定）なら記事番号を指定した時は無制限、"
                         f"指定しない時は {MAX_PER_RUN} 本")
    args = ap.parse_args()
    upload = not args.no_upload

    if upload:
        ensure_release()
    status = load_status(upload)
    items = json.load(open(video_input.QUEUE, encoding="utf-8"))["items"]
    want = {str(i).zfill(3) for i in args.ids}
    # 記事番号を名指しした時は「その本数を作りたい」意思表示なので上限をかけない。
    # 上限は自動実行（番号なし＝新着ぜんぶ）が長時間ジョブになるのを防ぐためのもの。
    limit = args.max if args.max > 0 else (len(items) if want else MAX_PER_RUN)
    cand = [it for it in items
            if (not want or it["id"] in want) and it.get("state") != "skipped"
            and (args.force or it["id"] not in status)]
    todo = cand[:limit]
    if len(cand) > len(todo):
        rest = [it["id"] for it in cand[len(todo):]]
        print(f"※ 上限 {limit} 本で打ち切り。未処理 {len(rest)} 本: {' '.join(rest)}")
    if not todo:
        print("新しく作る動画はない")
        return

    failed = 0
    for it in todo:
        try:
            res = video_input.build(it["id"])
            rel = os.path.relpath(res["json"], video_input.VIDEO)
            subprocess.run(["npx", "tsx", "scripts/render.ts", rel], cwd=video_input.VIDEO, check=True)
            mp4 = os.path.join(video_input.VIDEO, "out", f"{res['slug']}.mp4")
            url = ""
            if upload:
                gh("release", "upload", TAG, mp4, "--clobber")
                url = f"https://github.com/{repo()}/releases/download/{TAG}/{res['slug']}.mp4"
                # 記事ページ用の軽量版。ここで失敗しても Release 側は成功しているので、
                # 動画そのものは残したまま [warn] を出して次の記事へ進む。
                try:
                    web = make_web_copy(mp4, it["id"])
                    print(f"[web ] {it['id']} {os.path.relpath(web, os.path.dirname(HERE))}")
                except Exception as e:
                    print(f"[warn] {it['id']}: 記事用の軽量版が作れなかった: {e}", file=sys.stderr)
            status[it["id"]] = {"slug": res["slug"], "url": url or mp4, "route": res["route"],
                                "credit": res["credit"],
                                "built_at": datetime.now(JST).isoformat(timespec="seconds")}
            save_status(status, upload)
            print(f"[done] {it['id']} {url or mp4}")
        except Exception as e:
            failed += 1
            print(f"[fail] {it['id']}: {e}", file=sys.stderr)
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
