#!/usr/bin/env python3
"""Build every game into one self-contained HTML file.

Each game = src/shell.html + src/engine.css (+ game css)
          + src/engine-base.js + src/games/<game>.js + src/engine-core.js

Run:  python build.py
"""
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

# (source file in src/games, output path, browser-tab title, header title, shared files from src/)
GAMES = [
    ("geometry-5.js", "geometry/block-geometry.html", "עולם הקוביות – גאומטריה כיתה ה׳", "עולם הקוביות"),
    ("math-5.js",     "math/math-5.html",             "עולם הקוביות – חשבון כיתה ה׳",    "עולם המספרים"),
    ("english-5.js",  "english/english-5.html",       "עולם הקוביות – אנגלית כיתה ה׳",   "עולם האנגלית", ["vocab-en.js"]),
    ("geometry-2.js", "geometry/geometry-2.html",     "עולם הקוביות – צורות כיתה ב׳",    "עולם הצורות"),
    ("math-2.js",     "math/math-2.html",             "עולם הקוביות – חשבון כיתה ב׳",    "עולם המספרים"),
    ("english-2.js",  "english/english-2.html",       "עולם הקוביות – אנגלית כיתה ב׳",   "עולם האנגלית", ["vocab-en.js"]),
]


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def split_css(js: str):
    """A game file may start with /*CSS ... CSS*/ holding extra styles."""
    if js.startswith("/*CSS"):
        end = js.index("CSS*/")
        return js[5:end].strip(), js[end + 5:].lstrip("\n")
    return "", js


def main():
    shell = read(SRC / "shell.html")
    css = read(SRC / "engine.css")
    base = read(SRC / "engine-base.js")
    core = read(SRC / "engine-core.js")
    built = []
    for src, out, page_title, title, *inc in GAMES:
        p = SRC / "games" / src
        if not p.exists():
            continue
        extra_css, game_js = split_css(read(p))
        shared = "".join(read(SRC / f) + "\n" for f in (inc[0] if inc else []))
        html = (shell.replace("{{PAGETITLE}}", page_title)
                     .replace("{{TITLE}}", title)
                     .replace("{{CSS}}", css + ("\n" + extra_css if extra_css else ""))
                     .replace("{{SCRIPT}}", base + "\n" + shared + game_js + "\n" + core))
        dest = ROOT / out
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
        built.append(out)
    print("built:", *built, sep="\n  ")


if __name__ == "__main__":
    main()
