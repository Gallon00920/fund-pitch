"""Reads a picture of a table from a fund document and returns it as plain data.

Used by server.py (POST /api/picture) when an admin gives a fund a picture. Two kinds of table are understood:

- a monthly-returns table (a row per year, twelve months and a year total): returned as numbers;
- a share-class table (a row per share class or series, with columns such as management fee, performance fee,
  lock-up, gate and minimum size): returned as text cells.

Claude decides which of the two the picture shows. Fund names, manager names, logos and footnotes in the picture are
deliberately left out, so the tables can be shown to investors and downloaded without naming the fund.

The Claude API key comes from the ANTHROPIC_API_KEY environment variable, as everywhere else in this project.

Check a picture from the command line:  ANTHROPIC_API_KEY=... python scripts/picture_tables.py picture.png
"""
import base64
import json
import mimetypes
import re
import sys

MODEL = "claude-opus-5-5"
MEDIA_TYPES = ("image/png", "image/jpeg", "image/webp", "image/gif")
MAX_IMAGE_BYTES = 4_500_000          # the API accepts images up to 5 MB
MAX_CLASS_COLUMNS = 10
MAX_CLASS_ROWS = 40
MAX_CELL_CHARS = 120

# Monthly cells come back as text exactly as printed ("-1.24", "0.95", "" for an empty cell) and are turned into
# numbers here, so a blank month can never be confused with a zero return.
SCHEMA = {
    "type": "object",
    "properties": {
        "kind": {"type": "string", "enum": ["monthly_returns", "share_classes", "none"]},
        "rows": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "year": {"type": "string"},
                    "months": {"type": "array", "items": {"type": "string"}},
                    "total": {"type": "string"},
                },
                "required": ["year", "months", "total"],
                "additionalProperties": False,
            },
        },
        "class_header": {"type": "array", "items": {"type": "string"}},
        "class_rows": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"cells": {"type": "array", "items": {"type": "string"}}},
                "required": ["cells"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["kind", "rows", "class_header", "class_rows"],
    "additionalProperties": False,
}

SYSTEM = """You transcribe tables from pictures of investment fund documents. The picture shows one of two kinds of table. Decide which, set "kind", and fill only the fields for that kind; leave the other fields as empty lists.

Accuracy matters more than anything else here: the result is shown to investors and compared against the manager's own documents. Copy what is printed. Do not round, recalculate, reword, fill in or estimate anything.

Never return the fund's name, the manager's name, a document title, captions, footnotes or any other text from outside the table; the table is published without them.

1. Monthly returns ("kind": "monthly_returns")

A table with a row per calendar year, twelve month columns (Jan to Dec) and usually a final column with the full-year or year-to-date return. Fill "rows", one entry per year:
- "year": the four-digit year.
- "months": exactly twelve entries, January first. Each entry is the figure printed in that cell, as plain digits with a leading minus sign for negative values and without the percent sign, for example "0.13", "-21.80", "6.56". An empty cell is an empty string "".
- "total": the figure in the year / YTD column, written the same way, or "" if the table has no such column.
- Copy every figure digit for digit, keeping the decimals as printed. If a cell cannot be read with confidence, return "" for it.
- Negative values may be printed with a minus sign, in parentheses or in red. Return them with a leading minus sign.
- Keep each figure in its own month. A year that is only partly filled (the fund's first year, or the current year) has "" for the months without a figure.
- Drop footnote markers such as * or superscript numbers; return only the number.
- If the months run in a different order or the table is laid out with months as rows, still return one row per year with January first.

2. Share classes ("kind": "share_classes")

A table with a row per share class, series or tranche, and columns for its terms: for example management fee, performance fee, lock-up, redemption gate, notice period, minimum investment. Fill:
- "class_header": the column titles, left to right, each on one line (join a title printed on two lines with a space, for example "Quarterly Gate"). The first column holds the class names and often has no title: use "Class" for it.
- "class_rows": one entry per row, top to bottom. "cells" has exactly as many entries as "class_header": the class name first, then each term as printed, for example "1.50%", "1 Year Soft, 5% Penalty", "$100M", "No". Join text printed on two lines with a space. An empty cell is "".
- Keep class and series names as printed ("Class CS", "Series I"). If a name includes the fund's or the manager's name, leave that part out and keep the rest.
- Drop footnote markers.

3. Neither ("kind": "none")

If the picture shows neither kind of table, set "kind" to "none" and leave every list empty."""


def to_number(text):
    """'-1.24%', '(1.24)', '−1.24*', '1,234.5' -> float, or None for an empty or unreadable cell."""
    s = str(text or "").strip().replace("−", "-").replace("–", "-").replace(",", "")
    negative = s.startswith("(") and s.endswith(")")
    s = re.sub(r"[^0-9.\-]", "", s)
    if not re.fullmatch(r"-?\d+(\.\d+)?|-?\.\d+", s):
        return None
    value = float(s)
    return -abs(value) if negative else value


def clean_monthly(result):
    """Claude's reply -> [{"y": "2008", "m": [12 numbers or None], "t": number or None}], oldest year first."""
    rows = {}
    for row in result.get("rows") or []:
        year = re.search(r"(19|20)\d{2}", str(row.get("year") or ""))
        if not year:
            continue
        months = [to_number(cell) for cell in (row.get("months") or [])[:12]]
        months += [None] * (12 - len(months))
        total = to_number(row.get("total"))
        if total is None and all(v is None for v in months):
            continue
        rows[year.group(0)] = {"y": year.group(0), "m": months, "t": total}
    if not rows:
        raise ValueError("notable")
    return [rows[year] for year in sorted(rows)]


def clean_classes(result):
    """Claude's reply -> {"head": [column titles], "rows": [[cells]]}, every row as long as the header."""
    def cell(text):
        return re.sub(r"\s+", " ", str(text or "")).strip()[:MAX_CELL_CHARS]

    head = [cell(c) for c in (result.get("class_header") or [])][:MAX_CLASS_COLUMNS]
    if len(head) < 2:
        raise ValueError("notable")
    if not head[0]:
        head[0] = "Class"
    rows = []
    for row in (result.get("class_rows") or [])[:MAX_CLASS_ROWS]:
        cells = [cell(c) for c in (row.get("cells") or [])][:len(head)]
        cells += [""] * (len(head) - len(cells))
        if cells[0] and any(cells[1:]):
            rows.append(cells)
    if not rows:
        raise ValueError("notable")
    return {"head": head, "rows": rows}


def clean(result):
    """Claude's reply -> {"kind": "monthly", "rows": [...]} or {"kind": "classes", "table": {...}}."""
    kind = result.get("kind")
    if kind == "monthly_returns":
        return {"kind": "monthly", "rows": clean_monthly(result)}
    if kind == "share_classes":
        return {"kind": "classes", "table": clean_classes(result)}
    raise ValueError("notable")


def parse_image(client, data_b64, media_type):
    """Sends one picture to Claude and returns the cleaned table. Raises ValueError("notable") when there is none."""
    if media_type not in MEDIA_TYPES:
        raise ValueError("type")
    if len(data_b64) * 3 // 4 > MAX_IMAGE_BYTES:
        raise ValueError("big")
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        # if a safety classifier declines the request, the API re-runs it on Anthropic's recommended fallback model
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        thinking={"type": "adaptive"},
        output_config={"effort": "medium", "format": {"type": "json_schema", "schema": SCHEMA}},
        system=SYSTEM,
        messages=[{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": data_b64}},
            {"type": "text", "text": "Transcribe the table in this picture."},
        ]}],
    )
    if response.stop_reason == "refusal":
        raise RuntimeError("the model declined the request")
    if response.stop_reason == "max_tokens":
        raise RuntimeError("the reply was cut off at max_tokens")
    text = next(block.text for block in response.content if block.type == "text")
    return clean(json.loads(text))


if __name__ == "__main__":
    import anthropic

    path = sys.argv[1]
    kind = mimetypes.guess_type(path)[0] or "image/png"
    with open(path, "rb") as f:
        found = parse_image(anthropic.Anthropic(), base64.standard_b64encode(f.read()).decode("ascii"), kind)
    if found["kind"] == "monthly":
        for r in found["rows"]:
            print(r["y"], *("" if v is None else v for v in r["m"]), "|", r["t"])
    else:
        for line in [found["table"]["head"], *found["table"]["rows"]]:
            print(" | ".join(line))
