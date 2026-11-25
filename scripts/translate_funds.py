"""Translates newly added funds in data/funds.json into English, Simplified Chinese and Traditional Chinese.

Run by .github/workflows/translate-funds.yml whenever the site commits data/funds.json.
The Claude API key comes from the ANTHROPIC_API_KEY environment variable, which the workflow fills from the
repository secret of the same name. The key is never written to a file or printed.

A fund needs translating when its "translated" flag is not true. Text is taken from the language named in
"translateFrom" (set by the site's "Translate Again" button) or, for a fresh upload, from the single text the
deck supplied. Funds that fail are left as they are and retried on the next run.

Local use:  ANTHROPIC_API_KEY=... python scripts/translate_funds.py
"""
import html
import json
import os
import re
import sys
from pathlib import Path

import anthropic

DATA = Path(__file__).resolve().parent.parent / "data" / "funds.json"
MODEL = "claude-opus-5-5"
LANGS = ("en", "sc", "tc")

# text fields of one fund: (name sent to Claude, key in the fund, keeps line breaks)
FIELDS = [
    ("tag", "tag", False), ("strategy", "strategy", True), ("inceptionText", "inceptionText", True),
    ("aumText", "aumText", False), ("target", "target", False), ("ddLabel", "ddLabel", False),
    ("dd", "ddRaw", True), ("liq", "liq", False), ("liqFull", "liqFull", True), ("note", "note", True),
]

LANG_SCHEMA = {
    "type": "object",
    "properties": {**{name: {"type": "string"} for name, _, _ in FIELDS},
                   "perfNotes": {"type": "array", "items": {"type": "string"}}},
    "required": [name for name, _, _ in FIELDS] + ["perfNotes"],
    "additionalProperties": False,
}
SCHEMA = {
    "type": "object",
    "properties": {lang: LANG_SCHEMA for lang in LANGS},
    "required": list(LANGS),
    "additionalProperties": False,
}

SYSTEM = """You translate the text on investment fund cards for a website read by professional investors.

The user message is a JSON object holding the text fields of one fund, written in one language (usually Simplified Chinese or English, sometimes mixed). Return the same fields in three languages: "en" (English), "sc" (Simplified Chinese) and "tc" (Traditional Chinese).

Readers compare these cards against the fund manager's own documents, so the translation has to carry exactly the same facts:
- Keep every number, percentage, date, year, currency amount, multiple (1.5x) and range exactly as written.
- Keep fund names, manager names and other proper names unchanged, along with product codes and standard abbreviations such as ABL, ABF, CLO, RMBS, IRR, DPI, MOIC, NAV, UCITS, YTD, Evergreen and Drawdown.
- Keep the structure: a field with several lines (separated by newline characters) has the same number of lines in every language, in the same order. Each perfNotes entry stays one entry, in the same order.
- An empty field stays an empty string. Do not add explanations or drop details.
- For the language the source is already written in, return the source text as is, apart from fixing obvious punctuation.

Write the way a private-markets professional would. For Traditional Chinese, use the financial terms used in Hong Kong and Taiwan (for example 基金規模, 贖回, 鎖定期), not a character-by-character conversion of the Simplified text."""


# The site stores text as HTML: special characters escaped, <br> between lines.
def to_plain(value):
    return html.unescape(re.sub(r"<br\s*/?>", "\n", value or "", flags=re.I))


def to_html(value, multiline):
    lines = [html.escape(line.strip(), quote=True) for line in (value or "").split("\n")]
    lines = [line for line in lines if line]
    return "<br>".join(lines) if multiline else " ".join(lines)


def source_text(value, source_lang):
    """A field is either one text, {"en": text} from a fresh upload, or {"en","sc","tc"} once translated."""
    if isinstance(value, dict):
        return value.get(source_lang) or value.get("en") or ""
    return value or ""


def fields_of(fund):
    source_lang = fund.get("translateFrom") or "en"       # a fresh upload keeps the deck text under "en", whatever its language
    out = {name: to_plain(source_text(fund.get(key), source_lang)) for name, key, _ in FIELDS}
    notes = fund.get("perfNotes") or []
    if isinstance(notes, dict):
        notes = notes.get(source_lang) or notes.get("en") or []
    out["perfNotes"] = [to_plain(n) for n in notes]
    return out


def apply_translation(fund, result):
    for name, key, multiline in FIELDS:
        per_lang = {lang: to_html(result[lang][name], multiline) for lang in LANGS}
        if any(per_lang.values()):
            fund[key] = per_lang
    fund["perfNotes"] = {lang: [to_html(n, False) for n in result[lang]["perfNotes"]] for lang in LANGS}
    fund["translated"] = True
    fund.pop("translateFrom", None)


def translate(client, fields):
    response = client.beta.messages.create(
        model=MODEL,
        max_tokens=16000,
        # if a safety classifier declines the request, the API re-runs it on Anthropic's recommended fallback model
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        thinking={"type": "adaptive"},
        output_config={"effort": "low", "format": {"type": "json_schema", "schema": SCHEMA}},
        system=SYSTEM,
        messages=[{"role": "user", "content": json.dumps(fields, ensure_ascii=False)}],
    )
    if response.stop_reason == "refusal":
        raise RuntimeError("the model declined the request")
    if response.stop_reason == "max_tokens":
        raise RuntimeError("the reply was cut off at max_tokens")
    text = next(block.text for block in response.content if block.type == "text")
    return json.loads(text)


def main():
    if not DATA.exists():
        print("data/funds.json not found; nothing to do.")
        return 0
    state = json.loads(DATA.read_text(encoding="utf-8"))
    pending = [fund for funds in (state.get("funds") or {}).values() for fund in funds if not fund.get("translated")]
    if not pending:
        print("Every added fund is already translated.")
        return 0
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print(f"{len(pending)} fund(s) need translating, but the ANTHROPIC_API_KEY secret is not set. "
              "Add it under Settings > Secrets and variables > Actions, then re-run this workflow.")
        return 1

    client = anthropic.Anthropic()       # reads ANTHROPIC_API_KEY from the environment
    done = failed = 0
    for fund in pending:
        label = fund.get("id", "?")
        try:
            apply_translation(fund, translate(client, fields_of(fund)))
            done += 1
            print(f"translated {label}")
        except anthropic.AuthenticationError:
            print("The ANTHROPIC_API_KEY secret was rejected by the API. Check the secret's value.")
            failed = len(pending) - done
            break
        except anthropic.RateLimitError as exc:
            failed += 1
            print(f"rate limited on {label}; it will be retried on the next run ({exc})")
        except (anthropic.APIStatusError, anthropic.APIConnectionError, RuntimeError, ValueError, KeyError, StopIteration) as exc:
            failed += 1
            print(f"could not translate {label}; it stays in the deck's language ({type(exc).__name__}: {exc})")

    if done:
        DATA.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{done} translated, {failed} failed.")
    return 1 if failed and not done else 0


if __name__ == "__main__":
    sys.exit(main())
