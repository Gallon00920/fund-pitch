"""Bundles the site into one self-contained HTML file that can be emailed and opened by double-clicking.

Run from the project folder:   python tools/build_single_file.py
Output:                        dist/fund-platform.html

It inlines css/styles.css and every js/*.js file that index.html loads, in the same order.
Re-run it after any change to the project so the single file stays up to date.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "dist", "fund-platform.html")


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf8") as f:
        return f.read()


html = read("index.html")

# stylesheet -> <style>
html, n_css = re.subn(
    r'<link rel="stylesheet" href="(css/[^"?]+)(?:\?v=\d+)?">',
    lambda m: "<style>\n" + read(m.group(1)) + "</style>",
    html,
)

# scripts -> inline <script>, keeping their order
def inline_script(m):
    code = read(m.group(1))
    if "</script" in code.lower():
        sys.exit(f"{m.group(1)} contains '</script', which cannot be inlined safely")
    return f"<script>\n/* ===== {m.group(1)} ===== */\n{code}</script>"

html, n_js = re.subn(r'<script src="(js/[^"?]+)(?:\?v=\d+)?"></script>', inline_script, html)

left = re.findall(r'(?:src|href)="(?!https?:|#|data:)([^"]+)"', html)
if left:
    sys.exit(f"Still references local files: {left}")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf8", newline="\n") as f:
    f.write(html)
print(f"Wrote {OUT}  ({len(html) // 1024} KB, {n_css} stylesheet, {n_js} scripts inlined)")
