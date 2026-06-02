#!/usr/bin/env python3
"""Build static Hapa site indexes from local wiki + repos.

Dependency-free snapshot builder for the static front-door site. It indexes enough
Markdown body/media metadata for in-browser browsing while keeping the DOM bounded.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

SITE_DIR = Path(__file__).resolve().parent
REPO_ROOT = SITE_DIR.parent
DESKTOP = Path(os.environ.get("HAPA_DESKTOP_ROOT", REPO_ROOT.parent)).expanduser()
WIKI_ROOT = Path(os.environ.get("HAPA_WIKI_ROOT", DESKTOP / "Hapa_Worldbuilding_Wiki")).expanduser()
DATA_DIR = SITE_DIR / "data"
ASSET_LINK = SITE_DIR / "wiki-assets"
THUMB_DIR = SITE_DIR / "generated" / "video-thumbs"
WIKI_LINK = SITE_DIR / "wiki-vault"
DESKTOP_LINK = SITE_DIR / "local-desktop"

SKIP_PARTS = {".git", "Raw", "node_modules", "dist", "build", ".venv", "venv", "__pycache__"}
MAX_WIKI_INDEX_PAGES = 10000
MAX_CARDS = 420
MAX_REPOS = 80
MAX_MARKDOWN_CHARS = 18000

CATEGORY_RANK = {"Canon": 0, "Systems": 1, "Nodes": 2, "Cards": 3, "Artifacts": 4, "Development": 5, "Operations": 6, "Names": 7}
CARD_RARITY = ["common", "rare", "epic", "legendary", "mythic"]
REPO_HINTS = ("hapa", "Hapa", "Overwatch", "Consul", "Project Cymatica")


def parse_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            raw = text[4:end].strip()
            body = text[end + 4:].lstrip("\n")
            meta: dict[str, Any] = {}
            for line in raw.splitlines():
                if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
                    continue
                key, value = line.split(":", 1)
                value = value.strip().strip('"').strip("'")
                if value.startswith("[") and value.endswith("]"):
                    value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(",") if v.strip()]
                meta[key.strip()] = value
            return meta, body
    return {}, text


def titleize(path: Path) -> str:
    return re.sub(r"\b\w", lambda m: m.group(0).upper(), re.sub(r"[-_]+", " ", path.stem))


def first_heading(body: str) -> str | None:
    for line in body.splitlines():
        m = re.match(r"^#\s+(.+?)\s*$", line)
        if m:
            return re.sub(r"\s+#*$", "", m.group(1)).strip()
    return None


def clean_md(value: str) -> str:
    value = re.sub(r"```.*?```", " ", value, flags=re.S)
    value = re.sub(r"<video[^>]*>.*?</video>", " ", value, flags=re.I | re.S)
    value = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", value)
    value = re.sub(r"\[\[([^\]|]+)\|([^\]]+)\]\]", r"\2", value)
    value = re.sub(r"\[\[([^\]]+)\]\]", r"\1", value)
    value = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", value)
    value = re.sub(r"[`*_>#-]", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def section_body(body: str, heading_names: str | list[str]) -> str:
    """Return the Markdown under the first matching h2/h3 heading."""
    names = [heading_names] if isinstance(heading_names, str) else heading_names
    for name in names:
        pattern = re.compile(rf"^#{{2,3}}\s+{re.escape(name)}\s*$\n(?P<body>.*?)(?=^#{{2,3}}\s+|\Z)", re.M | re.S)
        match = pattern.search(body)
        if match:
            return match.group("body").strip()
    return ""


def excerpt(body: str, preferred_heading: str | None = None, limit: int = 230) -> str:
    if preferred_heading:
        section = section_body(body, preferred_heading)
        if section:
            text = clean_md(section)
            if text:
                return text[:limit].rstrip() + ("…" if len(text) > limit else "")
    chunks = []
    for line in body.splitlines():
        if line.startswith("#") or line.startswith("---"):
            continue
        line = clean_md(line)
        if line:
            chunks.append(line)
        if len(" ".join(chunks)) > limit:
            break
    text = " ".join(chunks) or "No excerpt available."
    return text[:limit].rstrip() + ("…" if len(text) > limit else "")


def wiki_href(path: Path) -> str:
    return Path("wiki-vault", path.relative_to(WIKI_ROOT)).as_posix().replace(" ", "%20")


def page_key(path: Path) -> str:
    rel = path.relative_to(WIKI_ROOT).as_posix()
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "-", rel.replace("/", "__"))[:120]
    digest = hashlib.sha1(rel.encode("utf-8")).hexdigest()[:12]
    return f"{safe}-{digest}"


def extract_wikilinks(body: str) -> list[dict[str, str]]:
    links = []
    for raw in re.findall(r"\[\[([^\]]+)\]\]", body):
        target, _, alias = raw.partition("|")
        target = target.strip()
        if not target:
            continue
        links.append({"target": target, "label": (alias.strip() or target)})
    return links[:80]


def slugify_page_ref(value: str) -> str:
    value = value.split("#", 1)[0].strip().replace("\\", "/")
    value = re.sub(r"\.md$", "", value, flags=re.I)
    value = re.sub(r"^wiki-vault/", "", value)
    value = re.sub(r"^local-desktop/Hapa_Worldbuilding_Wiki/", "", value)
    value = value.replace("%20", " ")
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")



def local_asset_candidate(markdown_path: Path, raw: str) -> Path | None:
    raw = raw.strip().strip('"').strip("'")
    if raw.startswith(("http://", "https://", "data:")):
        return None
    return (markdown_path.parent / raw).resolve() if not raw.startswith("/") else Path(raw)


def video_thumb_url(candidate: Path | None) -> str:
    if not candidate or not candidate.exists() or candidate.suffix.lower() not in {".mp4", ".webm", ".mov", ".m4v"}:
        return ""
    THUMB_DIR.mkdir(parents=True, exist_ok=True)
    digest = hashlib.sha1(str(candidate).encode("utf-8")).hexdigest()[:14]
    out = THUMB_DIR / f"{candidate.stem}-{digest}.jpg"
    if not out.exists():
        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", "0.6", "-i", str(candidate), "-frames:v", "1", "-vf", "scale=640:-1", str(out)]
        try:
            subprocess.run(cmd, check=True, timeout=12)
        except Exception:
            # Some generated loops begin black or reject seeking; try first decodable frame.
            try:
                subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(candidate), "-frames:v", "1", "-vf", "scale=640:-1", str(out)], check=True, timeout=12)
            except Exception:
                return ""
    if not out.exists() or out.stat().st_size == 0:
        return ""
    try:
        return out.relative_to(SITE_DIR).as_posix().replace(" ", "%20")
    except Exception:
        return ""

def asset_url_for(markdown_path: Path, raw: str) -> str:
    raw = raw.strip().strip('"').strip("'")
    if raw.startswith(("http://", "https://", "data:")):
        return raw
    candidate = local_asset_candidate(markdown_path, raw)
    try:
        rel = candidate.relative_to(WIKI_ROOT / "Assets")
        return Path("wiki-assets", rel).as_posix().replace(" ", "%20")
    except Exception:
        return ""


def extract_media(markdown_path: Path, body: str, meta: dict[str, Any]) -> list[dict[str, str]]:
    media: list[dict[str, str]] = []
    for alt, src in re.findall(r"!\[([^\]]*)\]\(([^)\n]+)\)", body):
        if src.startswith("data:") or "[truncated]" in src:
            continue
        url = asset_url_for(markdown_path, src)
        if url:
            kind = "image" if re.search(r"\.(png|jpe?g|gif|webp|svg)$", src, re.I) else "asset"
            media.append({"kind": kind, "url": url, "label": alt or Path(src).name, "source": src})
    for src in re.findall(r"<video[^>]+src=[\"']([^\"']+)[\"']", body, flags=re.I):
        if src.startswith("data:") or "[truncated]" in src:
            continue
        url = asset_url_for(markdown_path, src)
        if url:
            media.append({"kind": "video", "url": url, "poster": video_thumb_url(local_asset_candidate(markdown_path, src)), "label": Path(src).name, "source": src})
    for src in re.findall(r"Imported media:\s*`([^`]+)`", body):
        if src.startswith("data:") or "[truncated]" in src:
            continue
        url = asset_url_for(markdown_path, src)
        if url and all(m["url"] != url for m in media):
            kind = "video" if url.lower().endswith((".mp4", ".webm", ".mov")) else "image" if url.lower().endswith((".png", ".jpg", ".jpeg", ".webp")) else "asset"
            media.append({"kind": kind, "url": url, "poster": video_thumb_url(local_asset_candidate(markdown_path, src)) if kind == "video" else "", "label": Path(src).name, "source": src})
    return media[:4]


def markdown_body(text: str) -> str:
    return text[:MAX_MARKDOWN_CHARS] + ("\n\n[TRUNCATED IN STATIC SNAPSHOT]" if len(text) > MAX_MARKDOWN_CHARS else "")


def wiki_files() -> list[Path]:
    files = []
    for p in WIKI_ROOT.rglob("*.md"):
        rel = p.relative_to(WIKI_ROOT)
        if any(part in SKIP_PARTS for part in rel.parts):
            continue
        files.append(p)
    return files


def page_record(path: Path, include_body: bool = True) -> dict[str, Any]:
    text = path.read_text(errors="replace")
    meta, body = parse_frontmatter(text)
    rel = path.relative_to(WIKI_ROOT)
    category = rel.parts[0] if len(rel.parts) > 1 else "Root"
    stat = path.stat()
    title = str(meta.get("title") or first_heading(body) or titleize(path))
    headings = [m.group(1).strip() for m in re.finditer(r"^##\s+(.+)$", body, flags=re.M)][:10]
    rec = {
        "title": title,
        "category": category,
        "path": rel.as_posix(),
        "href": wiki_href(path),
        "viewer_href": f"#wiki:{rel.as_posix().replace(' ', '%20')}",
        "slug": slugify_page_ref(rel.as_posix()),
        "basename_slug": slugify_page_ref(path.stem),
        "status": str(meta.get("status") or ("generated-draft" if "Agent Drafted" in rel.as_posix() else "local-wiki")),
        "kind": str(meta.get("kind") or meta.get("card_type") or category),
        "theme": str(meta.get("theme") or meta.get("source") or category.lower()),
        "excerpt": excerpt(body),
        "headings": headings,
        "updated": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat(),
        "bytes": stat.st_size,
        "retrieval_id": str(meta.get("retrieval_id") or ""),
        "media": extract_media(path, body, meta),
        "wikilinks": extract_wikilinks(body),
    }
    if include_body:
        rec["markdown"] = markdown_body(text)
    return rec


def infer_affixes(title: str, theme: str, body: str, media: list[dict[str, str]]) -> list[str]:
    hay = f"{title} {theme} {body[:1200]}".lower()
    pairs = [("provenance", ["source", "retrieval", "manifest", "export"]), ("interface", ["interface", "ui", "mode", "gravity"]), ("audio", ["song", "music", "bpm", "chorus", "audio"]), ("forge", ["forge", "ingestion", "mint", "artifact"]), ("identity", ["name", "identity", "love", "truth", "conviction"]), ("loop", ["loop", "video", "media"]), ("agent", ["agent", "consul", "architect"])]
    affixes = [name for name, needles in pairs if any(n in hay for n in needles)]
    if any(m["kind"] == "video" for m in media) and "video" not in affixes:
        affixes.append("video")
    if any(m["kind"] == "image" for m in media) and "image" not in affixes:
        affixes.append("image")
    return affixes[:5] or ["wiki"]


def stat_value(seed: str, salt: str, base: int) -> int:
    h = 0
    for ch in seed + salt:
        h = ((h << 5) - h) + ord(ch)
    return abs(h % 50) + base


def compact_text(markdown: str, limit: int = 520) -> str:
    text = clean_md(markdown)
    return text[:limit].rstrip() + ("…" if len(text) > limit else "")


def parse_skill_rows(markdown: str) -> list[dict[str, str]]:
    skills: list[dict[str, str]] = []
    for line in markdown.splitlines():
        raw = line.strip()
        if not raw.startswith(("- ", "* ")):
            continue
        item = raw[2:].strip()
        match = re.match(r"(?P<name>[^—–-]+?)\s*(?:\((?P<mode>[^)]+)\))?\s*[—–-]\s*(?P<desc>.+)", item)
        if match:
            skills.append({"name": clean_md(match.group("name")), "mode": clean_md(match.group("mode") or "Capability"), "description": compact_text(match.group("desc"), 280)})
        else:
            skills.append({"name": compact_text(item, 64), "mode": "Capability", "description": compact_text(item, 220)})
        if len(skills) >= 6:
            break
    return skills


def split_goal_sentences(markdown: str) -> list[str]:
    text = clean_md(markdown)
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 24]
    return [s[:210].rstrip() + ("…" if len(s) > 210 else "") for s in sentences[:4]]


def content_profile(body: str, media: list[dict[str, str]]) -> dict[str, Any]:
    lore_md = section_body(body, ["Lore", "Description", "Source Echoes"])
    why_md = section_body(body, ["Why this card matters", "Meaning", "Card Text"])
    skills_md = section_body(body, ["Skills / capabilities encoded", "Skills", "Signals"])
    goals_md = section_body(body, ["Goals", "Goal", "App Retrieval Contract", "Lineage metadata"])
    prompt_md = section_body(body, ["Media Prompts", "Hapa Dev Proto Media"])
    skills = parse_skill_rows(skills_md)
    goals = split_goal_sentences(goals_md) or split_goal_sentences(why_md)
    flags = []
    if any(m.get("kind") == "video" for m in media): flags.append("video-loop")
    if any(m.get("kind") == "image" for m in media): flags.append("image")
    if lore_md: flags.append("lore")
    if skills: flags.append("skills")
    if why_md: flags.append("why")
    if goals: flags.append("goals")
    if prompt_md: flags.append("media-prompt")
    return {
        "lore": compact_text(lore_md, 620),
        "description": compact_text(why_md, 620),
        "skills": skills,
        "goals": goals,
        "media_prompt": compact_text(prompt_md, 520),
        "content_flags": flags,
        "content_score": len([f for f in [lore_md, why_md, skills, goals, prompt_md] if f]) * 22 + sum(12 for m in media if m.get("kind") == "video") + sum(6 for m in media if m.get("kind") == "image"),
    }


def card_record(path: Path) -> dict[str, Any]:
    rec = page_record(path, include_body=True)
    text = path.read_text(errors="replace")
    meta, body = parse_frontmatter(text)
    theme = str(meta.get("theme") or meta.get("source") or rec["theme"])
    status = str(meta.get("status") or rec["status"])
    media = rec.get("media", [])
    score_seed = sum(ord(c) for c in rec["title"] + theme)
    rarity = CARD_RARITY[score_seed % len(CARD_RARITY)]
    if any(token in rec["title"].lower() for token in ["mode gravity", "shared library", "love truth", "sovereign"]):
        rarity = "mythic"
    elif any(m["kind"] == "video" for m in media) or "loop-video" in path.name:
        rarity = "epic"
    content = content_profile(body, media)
    rec.update({
        "card_id": str(meta.get("card_id") or path.stem),
        "retrieval_id": str(meta.get("retrieval_id") or rec.get("retrieval_id") or ""),
        "rarity": rarity,
        "theme": theme,
        "status": status,
        "media_kind": str(meta.get("media_kind") or (media[0]["kind"] if media else "text")),
        "card_type": str(meta.get("card_type") or meta.get("kind") or rec.get("kind") or "Concept"),
        "card_text": excerpt(body, "Card Text", 260),
        "meaning": excerpt(body, "Meaning", 260),
        "source": rec["path"],
        "affixes": infer_affixes(rec["title"], theme, body, media),
        "stats": {"power": stat_value(rec["title"], "power", 40), "wisdom": stat_value(rec["title"], "wisdom", 30), "speed": stat_value(rec["title"], "speed", 35), "magic": stat_value(rec["title"], "magic", 45)},
    })
    rec.update(content)
    return rec


def discover_repos() -> list[Path]:
    repos = []
    for readme in DESKTOP.rglob("README.md"):
        if any(part in SKIP_PARTS for part in readme.parts):
            continue
        repo = readme.parent
        if any(h in repo.as_posix() for h in REPO_HINTS) or (repo / ".git").exists():
            repos.append(repo)
    seen = set(); out = []
    for repo in sorted(repos, key=lambda p: (0 if p.name.startswith("hapa") else 1, len(p.parts), p.as_posix().lower())):
        if repo in seen: continue
        seen.add(repo); out.append(repo)
        if len(out) >= MAX_REPOS: break
    return out


def desktop_href(path: Path) -> str:
    try:
        return Path("local-desktop", path.relative_to(DESKTOP)).as_posix().replace(" ", "%20")
    except Exception:
        return str(path)


def repo_record(repo: Path) -> dict[str, Any]:
    md_files = []
    for p in repo.rglob("*.md"):
        rel = p.relative_to(repo)
        if any(part in SKIP_PARTS for part in rel.parts): continue
        try: text = p.read_text(errors="replace")
        except Exception: continue
        meta, body = parse_frontmatter(text)
        md_files.append({"title": str(meta.get("title") or first_heading(body) or titleize(p)), "path": rel.as_posix(), "abs_path": str(p), "href": desktop_href(p), "excerpt": excerpt(body), "bytes": p.stat().st_size, "markdown": markdown_body(text)})
        if len(md_files) >= 80: break
    readme = next((f for f in md_files if f["path"].lower() == "readme.md"), md_files[0] if md_files else None)
    return {"name": repo.name, "path": str(repo), "href": desktop_href(repo), "relative": repo.relative_to(DESKTOP).as_posix() if repo.is_relative_to(DESKTOP) else str(repo), "file_count": len(md_files), "excerpt": readme["excerpt"] if readme else "No README indexed.", "markdown_files": md_files}


def ensure_asset_link() -> None:
    for link, target in ((ASSET_LINK, WIKI_ROOT / "Assets"), (WIKI_LINK, WIKI_ROOT), (DESKTOP_LINK, DESKTOP)):
        if link.exists() or link.is_symlink():
            continue
        try:
            link.symlink_to(target, target_is_directory=True)
        except FileExistsError:
            pass


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    ensure_asset_link()
    all_pages = wiki_files()
    pages = sorted(all_pages, key=lambda p: (CATEGORY_RANK.get(p.relative_to(WIKI_ROOT).parts[0] if len(p.relative_to(WIKI_ROOT).parts) > 1 else "Root", 99), p.relative_to(WIKI_ROOT).as_posix().lower()))[:MAX_WIKI_INDEX_PAGES]
    cards = [p for p in all_pages if p.relative_to(WIKI_ROOT).parts and p.relative_to(WIKI_ROOT).parts[0] == "Cards" and "Index" not in p.stem]
    cards = sorted(cards, key=lambda p: (0 if "Hapa OG Cards/Cards" in p.as_posix() else 1 if "ChatGPT Export Cards" in p.as_posix() else 2, -p.stat().st_mtime, p.name.lower()))[:MAX_CARDS]
    wiki_records = [page_record(p, include_body=False) for p in pages]
    card_records = [card_record(p) for p in cards]
    repo_records = [repo_record(r) for r in discover_repos()]
    payload = {"generated_at": datetime.now(timezone.utc).isoformat(), "wiki_root": str(WIKI_ROOT), "truth": "static snapshot from local Markdown wiki and local repo READMEs; refresh by running site/build-data.py", "counts": {"wiki_pages_indexed": len(wiki_records), "cards_indexed": len(card_records), "wiki_pages_seen": len(all_pages), "repos_indexed": len(repo_records), "cards_with_media": sum(1 for c in card_records if c.get("media")), "cards_with_video": sum(1 for c in card_records if any(m.get("kind") == "video" for m in c.get("media", [])))}, "wiki": wiki_records, "cards": card_records, "repos": repo_records}
    (DATA_DIR / "hapa-index.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(payload["counts"], indent=2))


if __name__ == "__main__":
    main()
