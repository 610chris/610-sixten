#!/usr/bin/env python3
"""610 JOURNAL「610 VIDEO」セクション自動更新。

@sixten の最新リール4本を Instagram Graph API (graph.instagram.com) から取得し、
site/journal/index.html の REELS:START〜REELS:END 間のカードを差し替える。
サムネ(jpg)と動画(mp4)は site/assets/ に自前ホスト。

取得経路（2026-09-12 実測で確定）:
  第1経路 fetch_via_cdp()  9222 の Chrome に描画させて読む ← 本命
  第2経路 fetch_grid()     web_profile_info を Cookie 付きで直叩き（いま 429）
公式 Graph API (/me/media) は使わない。@sixten は collab（共同投稿）で招待された
側なので、サイトに載せたい投稿が /me/media に一切返らないことを実測で確認した
（返るのは 2021-2022 年の自前投稿90件だけ）。トークンは失効させないため延長だけ
回し、--probe-api の診断用に残してある。

使い方:
  reels_sync.py                     通常同期（launchd が毎朝これを叩く）
  reels_sync.py --probe             APIの戻りを表示するだけ（HTMLもアセットも触らない）
  reels_sync.py --exchange <SHORT>  短期トークンを長期(60日)に交換して state に保存

出力: CHANGED: <shortcodes> / NO_CHANGE / エラー時 stderr + exit 1
git 操作はしない（呼び出し側ルーチンの仕事）。
"""
import html
import json
import os
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(REPO, "site", "journal", "index.html")
ASSETS = os.path.join(REPO, "site", "assets")

TOKEN_FILE = os.path.join(os.path.expanduser("~"), ".claude", "state", "ig_token.txt")
COOKIE_FILE = os.path.join(os.path.expanduser("~"), ".claude", "state", "ig_cookies.txt")

# @sixten のプロフィール「グリッド」を返す唯一の経路。
# 公式 Graph API (/me/media) は共同投稿(collab)で招待された側の投稿を返さないため、
# 610 のサイトに載せたい投稿がここからしか取れない（2026-09-12 実測で確認）。
GRID_USER = "sixten"
GRID_API = "https://www.instagram.com/api/v1/users/web_profile_info/?username="
IG_APP_ID = "936619743392459"          # instagram.com のウェブが使う公開値
GRID_RETRY = (0, 60, 180, 420)         # 429 のときの待ち秒（IP単位のスロットル対策）

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

# --- 第1経路: 9222 の Chrome に実際に描画させて読む ------------------------
# web_profile_info は Python から叩くと 429（IP/セッション単位のスロットル）を
# 返し続けるが、ブラウザが自分で発行する正規リクエストは通る（2026-09-12 実測）。
# ページの script[type=application/json] に video_versions まで入っているので、
# サムネも mp4 もここから取れる。CDN 自体は Cookie 不要で落とせる。
CDP_PY = os.path.expanduser("~/.claude/scripts/cdp/cdpvenv/bin/python")
CDP_SCRIPT = os.path.expanduser("~/.claude/scripts/cdp/cdp.py")
CDP_MAX = "400000"       # cdp.py js の出力打ち切り既定 6000 では URL が切れる
CDP_SCAN = 12            # グリッド先頭から何本まで見るか

PROFILE_JS = """(()=>{const s=new Set();const out=[];
document.querySelectorAll('a[href*="/reel/"],a[href*="/p/"]').forEach(a=>{
const m=(a.getAttribute('href')||'').match(/^\\/([\\w.]+)\\/(reel|p)\\/([\\w-]+)\\//);
if(m&&!s.has(m[3])){s.add(m[3]);out.push(m[1]+':'+m[2]+':'+m[3]);}});
return out.slice(0,24).join(' ');})()"""

REEL_JS = """(()=>{const want=location.pathname.split('/').filter(Boolean).pop();let f=null;
const walk=(o)=>{if(f||!o||typeof o!=='object')return;
if(Array.isArray(o)){for(const x of o)walk(x);return;}
if((o.code===want||o.shortcode===want)&&(o.video_versions||o.video_url)){f=o;return;}
for(const k in o){walk(o[k]);if(f)return;}};
document.querySelectorAll('script[type="application/json"]').forEach(s=>{
if(f)return;try{walk(JSON.parse(s.textContent))}catch(e){}});
if(!f)return 'NOTFOUND';
const vs=f.video_versions||[];let best=null;
for(const v of vs){if(!best||(v.width||0)*(v.height||0)>(best.width||0)*(best.height||0))best=v;}
return JSON.stringify({code:f.code||f.shortcode,pt:f.product_type,ts:f.taken_at,
co:(f.coauthor_producers||[]).map(c=>c.username),
cap:((f.caption||{}).text||'').slice(0,300),
thumb:(((f.image_versions2||{}).candidates||[])[0]||{}).url,
video:best?best.url:(f.video_url||null)});})()"""

GRAPH = "https://graph.instagram.com"
GRAPH_VER = "v23.0"
MEDIA_FIELDS = ("id,media_type,media_product_type,media_url,thumbnail_url,"
                "permalink,caption,timestamp")
WANT = 4          # カード枚数
LOOKUP = 50       # 何件さかのぼって REELS を探すか

JST = timezone(timedelta(hours=9))

KNOWN = {
    "blacksamurai": "BLACK SAMURAI",
    "postup.podcast": "POST UP PODCAST",
    "postup": "POST UP PODCAST",
    "muwe.c": "クリスのバスケ日記",
}

MARK_START = "<!-- REELS:START"
MARK_END = "<!-- REELS:END -->"


# ---------------------------------------------------------------- token

def load_state():
    """~/.claude/state/ig_token.txt を KEY=VALUE で読む。無ければ空dict。"""
    state = {}
    if os.path.exists(TOKEN_FILE):
        for line in open(TOKEN_FILE, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            state[k.strip()] = v.strip()
    for k in ("IG_ACCESS_TOKEN", "IG_APP_ID", "IG_APP_SECRET"):
        if os.environ.get(k):
            state[k] = os.environ[k]
    return state


def save_state(state):
    os.makedirs(os.path.dirname(TOKEN_FILE), exist_ok=True)
    body = "".join(f"{k}={v}\n" for k, v in state.items())
    tmp = TOKEN_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(body)
    os.chmod(tmp, 0o600)
    os.replace(tmp, TOKEN_FILE)


def api(path, params, base=GRAPH):
    url = base.rstrip("/") + "/" + path.lstrip("/") + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:600]
        raise RuntimeError(f"Graph API {e.code} {path}: {detail}") from None


def refresh_token(state):
    """長期トークンを延長（毎朝叩けば失効しない）。失敗しても同期自体は続行する。"""
    token = state.get("IG_ACCESS_TOKEN")
    if not token:
        return state
    try:
        r = api("refresh_access_token",
                {"grant_type": "ig_refresh_token", "access_token": token})
    except RuntimeError as e:
        sys.stderr.write(f"WARN: トークン延長に失敗（既存トークンで続行）: {e}\n")
        return state
    new = r.get("access_token")
    if new and new != token:
        state["IG_ACCESS_TOKEN"] = new
        state["IG_TOKEN_UPDATED"] = datetime.now(JST).isoformat(timespec="seconds")
        state["IG_TOKEN_EXPIRES_IN"] = str(r.get("expires_in", ""))
        save_state(state)
    return state


def exchange(short_token):
    """短期トークン → 長期(60日)トークン。state に保存する。"""
    state = load_state()
    secret = state.get("IG_APP_SECRET")
    if not secret:
        sys.stderr.write(
            f"ERROR: IG_APP_SECRET が無い。{TOKEN_FILE} に\n"
            "  IG_APP_SECRET=<Instagramアプリシークレット>\n"
            "を書いてから、もう一度 --exchange してください。\n")
        return 1
    r = api("access_token", {
        "grant_type": "ig_exchange_token",
        "client_secret": secret,
        "access_token": short_token,
    })
    state["IG_ACCESS_TOKEN"] = r["access_token"]
    state["IG_TOKEN_UPDATED"] = datetime.now(JST).isoformat(timespec="seconds")
    state["IG_TOKEN_EXPIRES_IN"] = str(r.get("expires_in", ""))
    save_state(state)
    days = int(r.get("expires_in", 0)) // 86400
    print(f"OK: 長期トークンを {TOKEN_FILE} に保存しました（有効 約{days}日）")
    return 0


# ---------------------------------------------------------------- fetch

def fetch_media(token):
    r = api(f"{GRAPH_VER}/me/media",
            {"fields": MEDIA_FIELDS, "limit": str(LOOKUP), "access_token": token})
    return r.get("data", [])


def load_cookies():
    if not os.path.exists(COOKIE_FILE):
        raise RuntimeError(
            f"{COOKIE_FILE} が無い。9222 の Chrome（@sixten でログイン済み）から\n"
            "  Network.getCookies で sessionid / ds_user_id / csrftoken 等を書き出してください。")
    ck = {}
    for line in open(COOKIE_FILE, encoding="utf-8"):
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            ck[k.strip()] = v.strip()
    if "sessionid" not in ck:
        raise RuntimeError(f"{COOKIE_FILE} に sessionid が無い（ログインし直しが必要）")
    return ck


def _cdp(args, timeout=180):
    if not (os.path.exists(CDP_PY) and os.path.exists(CDP_SCRIPT)):
        raise RuntimeError("cdp.py が無い（9222 の Chrome 経路は使えない）")
    r = subprocess.run([CDP_PY, CDP_SCRIPT] + args,
                       capture_output=True, timeout=timeout)
    out = r.stdout.decode("utf-8", "replace")
    if r.returncode != 0:
        err = r.stderr.decode("utf-8", "replace")[:300] or out[:300]
        raise RuntimeError(f"cdp {args[0]} 失敗: {err.strip()}")
    return out


def _cdp_tab():
    """9222 の Chrome から Instagram を開けるタブを1つ確保する。"""
    for attempt in range(2):
        for line in _cdp(["targets"], timeout=60).splitlines():
            m = re.match(r"([0-9A-Fa-f]{16,})\s+.*?(https?://\S+)", line)
            if m and "instagram.com" in m.group(2):
                return m.group(1)
        if attempt == 0:
            _cdp(["newtab", "https://www.instagram.com/"], timeout=90)
            time.sleep(4)
    raise RuntimeError("9222 の Chrome に Instagram タブを用意できなかった")


def _cdp_js(tab, script):
    """cdp.py js は評価結果を JSON で出す。JS 側は文字列を返す約束。"""
    out = _cdp(["js", script, "--tab", tab, "--max", CDP_MAX], timeout=120).strip()
    if not out:
        return ""
    try:
        val = json.loads(out)
    except json.JSONDecodeError:
        return ""
    return val if isinstance(val, str) else ""


def fetch_via_cdp():
    """9222 の Chrome に @sixten のグリッドと各リールを描画させて読み取る。

    collab（共同投稿で招待された側）の投稿はここにしか出ない。
    戻りは Graph API と同じ形の dict のリスト。
    """
    tab = _cdp_tab()
    _cdp(["open", f"https://www.instagram.com/{GRID_USER}/", "--tab", tab])
    links = ""
    for wait in (5, 4, 6):
        time.sleep(wait)
        links = (_cdp_js(tab, PROFILE_JS) or "").strip()
        if links:
            break
    if not links:
        raise RuntimeError(f"@{GRID_USER} のグリッドが描画されなかった"
                           "（ログアウト or ページ構造の変更）")

    out = []
    for tok in links.split()[:CDP_SCAN]:
        parts = tok.split(":")
        if len(parts) != 3:
            continue
        owner, kind, sc = parts
        _cdp(["open", f"https://www.instagram.com/{owner}/{kind}/{sc}/", "--tab", tab])
        d = None
        for wait in (4, 4, 6):
            time.sleep(wait)
            raw = _cdp_js(tab, REEL_JS)
            if raw and raw != "NOTFOUND":
                try:
                    d = json.loads(raw)
                except json.JSONDecodeError:
                    d = None
                if d:
                    break
        if not d:
            sys.stderr.write(f"WARN: {sc} の埋め込みデータが取れなかった（スキップ）\n")
            continue
        out.append({
            "permalink": f"https://www.instagram.com/reel/{sc}/",
            "media_product_type": "REELS" if d.get("pt") == "clips" else "FEED",
            "media_url": d.get("video"),
            "thumbnail_url": d.get("thumb"),
            "caption": d.get("cap") or "",
            "timestamp": datetime.fromtimestamp(
                d.get("ts") or 0, timezone.utc).strftime("%Y-%m-%dT%H:%M:%S%z"),
            "owner": owner,
            "coauthors": d.get("co") or [],
        })
        ready = [m for m in out
                 if m["media_product_type"] == "REELS" and m["media_url"]]
        if len(ready) >= WANT:
            break
    return out


def fetch_media_list():
    """第1経路=ブラウザ描画、駄目なら第2経路=web_profile_info 直叩き。"""
    try:
        media = fetch_via_cdp()
        if len([m for m in media if m["media_product_type"] == "REELS"]) >= WANT:
            return media
        sys.stderr.write("WARN: ブラウザ経路で REELS が足りなかった。直叩きを試す\n")
    except Exception as e:
        sys.stderr.write(f"WARN: ブラウザ経路が使えなかった（{e}）。直叩きを試す\n")
    return fetch_grid()


def fetch_grid():
    """@sixten のプロフィールグリッドを取る。collab で招待された投稿もここには載る。

    429（IP単位のスロットル）が出るので待ちながら数回リトライする。
    取れなければ例外。HTML は絶対に触らせない（古い内容のまま残す方が安全）。
    """
    ck = load_cookies()
    headers = {
        "User-Agent": UA,
        "x-ig-app-id": IG_APP_ID,
        "x-csrftoken": ck.get("csrftoken", ""),
        "x-requested-with": "XMLHttpRequest",
        "Referer": f"https://www.instagram.com/{GRID_USER}/",
        "Accept": "*/*",
        "Accept-Language": "ja,en;q=0.9",
        "Cookie": "; ".join(f"{k}={v}" for k, v in ck.items()),
    }
    req = urllib.request.Request(GRID_API + GRID_USER, headers=headers)
    last = None
    for wait in GRID_RETRY:
        if wait:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.loads(r.read().decode("utf-8"))
            break
        except urllib.error.HTTPError as e:
            last = e.code
            if e.code in (429, 500, 502, 503):
                continue
            raise RuntimeError(f"web_profile_info {e.code}") from None
    else:
        raise RuntimeError(
            f"web_profile_info が {last} を返し続けた（リトライ{len(GRID_RETRY)}回）。"
            "IPスロットルなら時間をおけば戻る。401/403 なら sessionid の入れ直し。")

    edges = data["data"]["user"]["edge_owner_to_timeline_media"]["edges"]
    out = []
    for e in edges:
        n = e["node"]
        caps = n.get("edge_media_to_caption", {}).get("edges") or []
        out.append({
            "permalink": f"https://www.instagram.com/reel/{n['shortcode']}/",
            "media_product_type": "REELS" if n.get("product_type") == "clips" else "FEED",
            "media_url": n.get("video_url"),
            "thumbnail_url": n.get("display_url"),
            "caption": (caps[0]["node"]["text"] if caps else ""),
            "timestamp": datetime.fromtimestamp(
                n.get("taken_at_timestamp", 0), timezone.utc
            ).strftime("%Y-%m-%dT%H:%M:%S%z"),
            "owner": (n.get("owner") or {}).get("username"),
            "coauthors": [c.get("username") for c in (n.get("coauthor_producers") or [])],
        })
    return out


def download(url, binary=True):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def shortcode(permalink):
    m = re.search(r"/(?:reel|reels|p|tv)/([\w-]+)", permalink or "")
    return m.group(1) if m else None


def pick_reels(media):
    out = []
    for m in media:
        if m.get("media_product_type") != "REELS":
            continue
        if not shortcode(m.get("permalink")):
            continue
        if not m.get("media_url"):      # mp4 が無いとカードが作れない
            continue
        out.append(m)
        if len(out) >= WANT:
            break
    return out


# ---------------------------------------------------------------- render

def derive_title(item):
    caption = item.get("caption") or ""
    line = caption.split("\n", 1)[0]
    line = line.replace("✅", "")
    line = re.sub(r"#\S+", "", line)
    mentions = re.findall(r"@([\w.]+)", line)
    line = re.sub(r"@[\w.]+", "", line)
    text = re.sub(r"\s+", " ", line).strip()
    if text:
        text = text.split("。", 1)[0]
        return text[:45]
    for m in mentions:
        if m in KNOWN:
            return KNOWN[m]
    if mentions:
        return "@" + mentions[0]
    return "REEL"


def post_date(item):
    """Graph API の timestamp (ISO8601 +0000) を JST の YYYY.MM.DD にする。"""
    ts = item.get("timestamp") or ""
    try:
        dt = datetime.strptime(ts, "%Y-%m-%dT%H:%M:%S%z")
    except ValueError:
        try:
            dt = datetime.fromisoformat(ts)
        except ValueError:
            return datetime.now(JST).strftime("%Y.%m.%d")
    return dt.astimezone(JST).strftime("%Y.%m.%d")


def convert_thumb(src, dst):
    """9:16センタークロップ→720x1280 q80。PIL→ffmpeg→原本コピーの順に試す。"""
    try:
        from PIL import Image
        im = Image.open(src).convert("RGB")
        w, h = im.size
        target = 9 / 16
        if w / h > target:
            nw = int(h * target)
            im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
        else:
            nh = int(w / target)
            im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        im = im.resize((720, 1280), Image.LANCZOS)
        im.save(dst, "JPEG", quality=80)
        return
    except Exception:
        pass
    if shutil.which("ffmpeg"):
        r = subprocess.run(
            ["ffmpeg", "-y", "-i", src,
             "-vf", "crop=min(iw\\,ih*9/16):min(ih\\,iw*16/9),scale=720:1280",
             "-q:v", "3", dst],
            capture_output=True)
        if r.returncode == 0:
            return
    shutil.copyfile(src, dst)


def convert_video(src, dst):
    """480p・音声なし・crf28圧縮。ffmpeg無ければ原本コピー。"""
    if shutil.which("ffmpeg"):
        r = subprocess.run(
            ["ffmpeg", "-y", "-i", src,
             "-vf", "scale=480:-2", "-c:v", "libx264", "-crf", "28",
             "-preset", "veryfast", "-an", "-movflags", "+faststart", dst],
            capture_output=True)
        if r.returncode == 0:
            return
        sys.stderr.write(r.stderr.decode("utf-8", "replace")[-500:] + "\n")
    shutil.copyfile(src, dst)


def build_card(sc, title, date_str):
    t = html.escape(title, quote=True)
    return (
        f'        <a class="reel-card" href="https://www.instagram.com/reel/{sc}/" target="_blank" rel="noopener">\n'
        f'          <div class="reel-img"><video src="../assets/reel-{sc}.mp4" poster="../assets/reel-{sc}.jpg" muted loop playsinline preload="none" aria-label="{t}"></video></div>\n'
        f'          <div class="reel-meta">\n'
        f'            <span class="code">▶ REEL — {date_str}</span>\n'
        f'            <h3>{t}</h3>\n'
        f'          </div>\n'
        f'        </a>'
    )


# ---------------------------------------------------------------- probe

def probe_grid():
    """グリッド側が何を返すかを確認するだけ。HTMLもアセットも触らない。"""
    media = fetch_media_list()
    print(f"グリッド件数: {len(media)}")
    for i, m in enumerate(media[:12], 1):
        cap = (m.get("caption") or "").split("\n", 1)[0][:34]
        print(f"{i:2d}. {m['media_product_type']:<6} {m['timestamp'][:10]} "
              f"sc={shortcode(m['permalink'])} owner={m.get('owner')} "
              f"co={','.join(m.get('coauthors') or []) or '-'} "
              f"video={'Y' if m.get('media_url') else '-'} | {cap}")
    reels = pick_reels(media)
    print(f"\nREELS として採用される先頭{WANT}本: "
          + (" ".join(shortcode(m['permalink']) for m in reels) or "(なし)"))
    src = open(INDEX, encoding="utf-8").read()
    block = src[src.find(MARK_START):src.find(MARK_END)]
    print("いま index.html に載っている4本: " + " ".join(
        re.findall(r"instagram\.com/reel/([\w-]+)/", block)))
    return 0 if len(reels) == WANT else 1


def probe(token):
    """公式 Graph API が何を返すかの確認用（--probe-api）。"""
    media = fetch_media(token)
    print(f"/me/media 件数: {len(media)}")
    for i, m in enumerate(media, 1):
        cap = (m.get("caption") or "").split("\n", 1)[0][:40]
        print(f"{i:2d}. {m.get('media_product_type'):<10} {m.get('media_type'):<9} "
              f"{m.get('timestamp','')[:10]} sc={shortcode(m.get('permalink'))} "
              f"video={'Y' if m.get('media_url') else '-'} "
              f"thumb={'Y' if m.get('thumbnail_url') else '-'} | {cap}")
    reels = pick_reels(media)
    print(f"\nREELS として採用される先頭{WANT}本: "
          + (" ".join(shortcode(m['permalink']) for m in reels) or "(なし)"))
    src = open(INDEX, encoding="utf-8").read()
    block = src[src.find(MARK_START):src.find(MARK_END)]
    print("いま index.html に載っている4本: " + " ".join(
        re.findall(r"instagram\.com/reel/([\w-]+)/", block)))
    return 0 if len(reels) == WANT else 1


# ---------------------------------------------------------------- main

def sync():
    media = fetch_media_list()
    reels = pick_reels(media)
    if len(reels) < WANT:
        sys.stderr.write(
            f"ERROR: グリッド{len(media)}件のうち REELS が{len(reels)}本しか取れなかった"
            f"（{WANT}本必要）\n")
        return 1

    new_scs = [shortcode(m["permalink"]) for m in reels]

    src = open(INDEX, encoding="utf-8").read()
    i0 = src.find(MARK_START)
    i1 = src.find(MARK_END)
    if i0 < 0 or i1 < 0:
        sys.stderr.write("ERROR: REELSマーカーが index.html に見つからない\n")
        return 1
    block = src[i0:i1]
    cur_scs = re.findall(r"instagram\.com/reel/([\w-]+)/", block)

    if new_scs == cur_scs:
        print("NO_CHANGE")
        return 0

    os.makedirs(ASSETS, exist_ok=True)
    tmpdir = os.path.join(ASSETS, ".reels_tmp")
    os.makedirs(tmpdir, exist_ok=True)

    for m in reels:
        sc = shortcode(m["permalink"])
        jpg = os.path.join(ASSETS, f"reel-{sc}.jpg")
        mp4 = os.path.join(ASSETS, f"reel-{sc}.mp4")
        if not os.path.exists(jpg):
            thumb = m.get("thumbnail_url") or m.get("media_url")
            if not thumb:
                sys.stderr.write(f"ERROR: {sc} に thumbnail_url が無い\n")
                return 1
            raw = os.path.join(tmpdir, f"{sc}.jpg")
            open(raw, "wb").write(download(thumb))
            convert_thumb(raw, jpg)
        if not os.path.exists(mp4):
            if not m.get("media_url"):
                sys.stderr.write(f"ERROR: {sc} に media_url が無い\n")
                return 1
            raw = os.path.join(tmpdir, f"{sc}.mp4")
            open(raw, "wb").write(download(m["media_url"]))
            convert_video(raw, mp4)

    shutil.rmtree(tmpdir, ignore_errors=True)

    cards = [build_card(shortcode(m["permalink"]), derive_title(m), post_date(m))
             for m in reels]

    start_line_end = src.index("\n", i0) + 1
    new_src = (src[:start_line_end] + "\n".join(cards) + "\n        " + src[i1:])
    open(INDEX, "w", encoding="utf-8").write(new_src)

    # 新4本に含まれない古いアセットを掃除
    keep = set(new_scs)
    for f in os.listdir(ASSETS):
        mm = re.match(r"reel-([\w-]+)\.(jpg|mp4)$", f)
        if mm and mm.group(1) not in keep:
            os.remove(os.path.join(ASSETS, f))

    print("CHANGED: " + " ".join(new_scs))
    return 0


def main(argv):
    if len(argv) > 1 and argv[1] == "--exchange":
        if len(argv) < 3:
            sys.stderr.write("ERROR: --exchange <短期トークン> が必要\n")
            return 1
        return exchange(argv[2])

    if len(argv) > 1 and argv[1] == "--probe":
        return probe_grid()

    if len(argv) > 1 and argv[1] == "--probe-api":
        state = load_state()
        token = state.get("IG_ACCESS_TOKEN")
        if not token:
            sys.stderr.write(f"ERROR: {TOKEN_FILE} に IG_ACCESS_TOKEN が無い\n")
            return 1
        return probe(token)

    # 公式トークンは同期には使わないが、失効させないため毎回延長だけしておく
    state = load_state()
    if state.get("IG_ACCESS_TOKEN"):
        refresh_token(state)
    return sync()


if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv))
    except Exception as e:
        sys.stderr.write(f"ERROR: {type(e).__name__}: {e}\n")
        sys.exit(1)
