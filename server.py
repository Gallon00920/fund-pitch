"""Local server for the fund site: serves the files AND translates funds as they are uploaded.

Start it from the project folder:

    PowerShell:   $env:ANTHROPIC_API_KEY = "your-key"; python server.py
    bash:         ANTHROPIC_API_KEY=your-key python server.py

then open http://localhost:5173

What it adds on top of a plain file server, for the site running on this computer only:
    GET  /api/health      tells the site that this server is here and whether it can translate
    POST /api/translate   translates one fund with Claude and returns it in English / 简体 / 繁體
    PUT  /api/funds       saves the shared data to data/funds.json on this computer

The key stays in this process. It is read from the ANTHROPIC_API_KEY environment variable, never written to a file
and never sent to the browser. The server listens on this computer only (127.0.0.1) and refuses requests that come
from other websites. The published site on GitHub Pages does not use this file; there the workflow translates.

Needs the Anthropic SDK for translation:   pip install anthropic
Without it, or without the key, the site still runs and funds are saved untranslated.
"""
import json
import os
import socket
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "funds.json"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
MAX_BODY = 2_000_000

sys.path.insert(0, str(ROOT / "scripts"))
try:
    import anthropic
    import translate_funds as tf           # the same prompt, schema and text handling the GitHub workflow uses
    SDK_ERROR = None
except ImportError as exc:                 # the site still works; translation is reported as unavailable
    anthropic = tf = None
    SDK_ERROR = str(exc)


def translate_status():
    """(can translate, reason code when it cannot)."""
    if SDK_ERROR:
        return False, "nosdk"
    if not os.environ.get("ANTHROPIC_API_KEY"):
        return False, "nokey"
    return True, ""


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    # ---- helpers ----
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")        # always serve the files as they are on disk now
        super().end_headers()

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def same_site(self):
        """Browsers send Origin on POST/PUT. Refuse anything that is not this local site, so another web page
        open in the browser cannot spend the key or overwrite the data file."""
        origin = self.headers.get("Origin")
        return origin is None or origin in (f"http://localhost:{PORT}", f"http://127.0.0.1:{PORT}", f"http://[::1]:{PORT}")

    def read_json(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0 or length > MAX_BODY:
            raise ValueError("missing or oversized body")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    # ---- routes ----
    def do_GET(self):
        if self.path.split("?")[0] == "/api/health":
            ok, reason = translate_status()
            return self.send_json(200, {"fundPitchLocal": True, "translate": ok, "reason": reason})
        return super().do_GET()

    def do_POST(self):
        if self.path.split("?")[0] != "/api/translate":
            return self.send_json(404, {"error": "notfound"})
        if not self.same_site():
            return self.send_json(403, {"error": "forbidden"})
        ok, reason = translate_status()
        if not ok:
            return self.send_json(503, {"error": reason})
        try:
            fund = self.read_json()["fund"]
            client = anthropic.Anthropic()                    # reads ANTHROPIC_API_KEY from the environment
            tf.apply_translation(fund, tf.translate(client, tf.fields_of(fund)))
            return self.send_json(200, {"fund": fund})
        except anthropic.AuthenticationError:
            return self.send_json(401, {"error": "key"})
        except anthropic.RateLimitError:
            return self.send_json(429, {"error": "rate"})
        except (anthropic.APIStatusError, anthropic.APIConnectionError) as exc:
            return self.send_json(502, {"error": "api", "detail": f"{type(exc).__name__}: {exc}"[:300]})
        except (ValueError, KeyError, TypeError, RuntimeError, StopIteration) as exc:
            return self.send_json(400, {"error": "api", "detail": f"{type(exc).__name__}: {exc}"[:300]})

    def do_PUT(self):
        if self.path.split("?")[0] != "/api/funds":
            return self.send_json(404, {"error": "notfound"})
        if not self.same_site():
            return self.send_json(403, {"error": "forbidden"})
        try:
            state = self.read_json()
            if not isinstance(state, dict) or not isinstance(state.get("funds"), dict):
                raise ValueError("not a funds file")
        except (ValueError, KeyError, TypeError) as exc:
            return self.send_json(400, {"error": "bad", "detail": str(exc)[:200]})
        DATA.parent.mkdir(exist_ok=True)
        DATA.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return self.send_json(200, {"saved": True})

    def log_message(self, fmt, *args):                        # keep the terminal readable: only show the API calls
        if "/api/" in (args[0] if args else ""):
            super().log_message(fmt, *args)


def main():
    ok, reason = translate_status()
    print(f"Fund site running at http://localhost:{PORT}   (Ctrl+C to stop)")
    if ok:
        print("Translation: ON. Funds are translated with Claude as you upload them.")
    elif reason == "nosdk":
        print(f"Translation: OFF. The Anthropic SDK is not installed ({SDK_ERROR}). Run:  pip install anthropic")
    else:
        print("Translation: OFF. ANTHROPIC_API_KEY is not set in this terminal. Set it, then start the server again.")
    # Listen on this computer only, on both loopback addresses: "localhost" is 127.0.0.1 on some machines and ::1 on others.
    servers = []
    for family, address in ((socket.AF_INET, "127.0.0.1"), (socket.AF_INET6, "::1")):
        try:
            cls = type("LoopbackServer", (ThreadingHTTPServer,), {"address_family": family})
            servers.append(cls((address, PORT), Handler))
        except OSError as exc:
            print(f"(not listening on {address}: {exc})")
    if not servers:
        sys.exit(f"Could not start: port {PORT} is in use. Close the other server or run:  python server.py 5174")
    for server in servers[1:]:
        threading.Thread(target=server.serve_forever, daemon=True).start()
    try:
        servers[0].serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
