/* ---------- Shared data on GitHub ----------
   Admin changes are saved for everyone by committing data/funds.json to the repository through the GitHub API.
   That commit also starts the "Translate funds" workflow (.github/workflows/translate-funds.yml), which fills in
   English / 简体 / 繁體 for new funds using the ANTHROPIC_API_KEY repository secret. The Claude key never reaches
   the browser.

   What the browser does hold is a GitHub token the admin pastes in the Add Fund window. Create it as a
   fine-grained personal access token limited to this one repository with "Contents: Read and write".
   It is kept in this browser's localStorage and sent only to api.github.com.

   Depends on: CONFIG.REPO (config.js), FundStore, Auth, and t / applyLang from app.js. */
const Repo = (() => {
  const TOKEN_KEY = "jc-github-token";
  const R = CONFIG.REPO;
  const API = `https://api.github.com/repos/${R.owner}/${R.name}/contents/${R.path}`;
  const RAW = `https://raw.githubusercontent.com/${R.owner}/${R.name}/${R.branch}/${R.path}`;

  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ""; } catch (e) { return ""; } };
  const setToken = k => { try { k ? localStorage.setItem(TOKEN_KEY, k) : localStorage.removeItem(TOKEN_KEY); return true; } catch (e) { return false; } };

  // base64 that is safe for Chinese text
  const encode = str => { let bin = ""; new TextEncoder().encode(str).forEach(b => { bin += String.fromCharCode(b); }); return btoa(bin); };
  const decode = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), c => c.charCodeAt(0)));

  /** Thrown with a `code` the UI turns into a message: auth, network, conflict, api. */
  class RepoError extends Error { constructor(code, detail) { super(detail || code); this.code = code; } }

  async function call(method, body) {
    let res;
    try {
      res = await fetch(method === "GET" ? `${API}?ref=${R.branch}` : API, {
        method, cache: "no-store",
        headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${getToken()}`, "X-GitHub-Api-Version": "2022-11-28" },
        body: body ? JSON.stringify(body) : undefined
      });
    } catch (e) { throw new RepoError("network", String(e && e.message || e)); }
    if (res.status === 401 || res.status === 403) throw new RepoError("auth", `GitHub answered ${res.status}`);
    if (res.status === 409 || res.status === 422) throw new RepoError("conflict", `GitHub answered ${res.status}`);
    if (res.status === 404 && method === "GET") return null;
    if (!res.ok) throw new RepoError(res.status === 404 ? "auth" : "api", `GitHub answered ${res.status}`);
    return res.json();
  }

  /** Latest shared state straight from the repository (needs the token). Returns { state, sha }. */
  async function readRemote() {
    const file = await call("GET");
    if (!file) return { state: null, sha: null };
    try { return { state: JSON.parse(decode(file.content)), sha: file.sha }; }
    catch (e) { throw new RepoError("api", "data/funds.json is not valid JSON"); }
  }
  /** Shared state as every visitor gets it: the published file, no token needed. */
  async function readPublic() {
    for (const url of [`${R.path}?ts=${Date.now()}`, `${RAW}?ts=${Date.now()}`]) {
      try { const res = await fetch(url, { cache: "no-store" }); if (res.ok) return await res.json(); } catch (e) {}
    }
    return null;
  }

  /* ---- merging, so two sources of change do not overwrite each other ----
     `synced` remembers each added fund as it was when this page last loaded or saved. When saving:
       - a fund this admin has not touched since then takes the repository's version (that is how translations arrive);
       - funds and strategies that appeared in the repository meanwhile (another admin) are kept;
       - everything else follows this admin's page. */
  let synced = new Map(), syncedStrats = new Set();
  const eachFund = (state, fn) => Object.entries(state.funds || {}).forEach(([strat, list]) => (list || []).forEach(f => fn(f, strat)));
  function remember(state) {
    synced = new Map(); syncedStrats = new Set((state.strategies || []).map(s => s.id));
    eachFund(state, f => synced.set(f.id, JSON.stringify(f)));
  }
  function merge(local, remote) {
    const out = JSON.parse(JSON.stringify(local));
    const remoteById = new Map(); eachFund(remote, (f, strat) => remoteById.set(f.id, { f, strat }));
    const localIds = new Set(); eachFund(out, f => localIds.add(f.id));
    Object.keys(out.funds).forEach(strat => {
      out.funds[strat] = out.funds[strat].map(f => (remoteById.has(f.id) && synced.get(f.id) === JSON.stringify(f) ? remoteById.get(f.id).f : f));
    });
    (remote.strategies || []).forEach(s => { if (!out.strategies.some(x => x.id === s.id) && !syncedStrats.has(s.id)) out.strategies.push(s); });
    remoteById.forEach(({ f, strat }, id) => {
      if (localIds.has(id) || synced.has(id)) return;
      if (strat === "liquid" || strat === "illiquid" || out.strategies.some(s => s.id === strat)) (out.funds[strat] = out.funds[strat] || []).push(f);
    });
    return out;
  }
  const untranslated = state => { let n = 0; eachFund(state, f => { if (!f.translated) n++; }); return n; };

  /** Commits the page's state to data/funds.json. Returns the state that was saved. */
  async function saveNow() {
    for (let attempt = 0; ; attempt++) {
      const remote = await readRemote();
      const merged = remote.state ? merge(FundStore.getState(), remote.state) : FundStore.getState();
      try {
        await call("PUT", {
          message: "Update funds from the site",
          content: encode(JSON.stringify(merged, null, 2) + "\n"),
          branch: R.branch,
          ...(remote.sha ? { sha: remote.sha } : {})
        });
        remember(merged);
        FundStore.setState(merged);
        return merged;
      } catch (e) {
        if (!(e instanceof RepoError) || e.code !== "conflict" || attempt >= 2) throw e;   // someone else saved in between: read again and retry
      }
    }
  }

  return { hasToken: () => !!getToken(), setToken, readRemote, readPublic, saveNow, merge, remember, untranslated, RepoError };
})();

/* ---------- Local server (server.py) ----------
   When the site is opened through `python server.py` on someone's own computer, that server can translate funds
   straight away (it holds the Claude key) and can save data/funds.json on disk. The published site has no such
   server, so there `Local.on` stays false and everything goes through GitHub as described above. */
const Local = {
  on: false, canTranslate: false, reason: "nokey",
  async detect() {
    try {
      const res = await fetch("api/health", { cache: "no-store" });
      const info = res.ok ? await res.json() : null;
      if (info && info.fundPitchLocal) { Local.on = true; Local.canTranslate = !!info.translate; Local.reason = info.reason || "nokey"; }
    } catch (e) {}
  },
  /** Writes the shared data to data/funds.json on this computer. */
  async save(state) {
    const res = await fetch("api/funds", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) });
    if (!res.ok) throw new Error("local save failed");
  },
  /** Sends a picture of a table to the local server, which has Claude read it. Resolves to
      { kind: "monthly", rows } or { kind: "classes", table: { head, rows } }; rejects with an Error whose message
      is a code (noserver, nokey, notable, big, ...). */
  async parsePicture(file) {
    if (!Local.on) throw new Error("noserver");
    if (!Local.canTranslate) throw new Error(Local.reason);
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) throw new Error("type");
    if (file.size > 4500000) throw new Error("big");
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("api"));
      reader.readAsDataURL(file);
    });
    let res, reply;
    try {
      res = await fetch("api/picture", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: String(dataUrl).split(",")[1], mediaType: file.type }) });
      reply = await res.json();
    } catch (e) { throw new Error("network"); }
    const good = reply.kind === "monthly" ? Array.isArray(reply.rows) && reply.rows.length
      : reply.kind === "classes" && reply.table && Array.isArray(reply.table.head) && Array.isArray(reply.table.rows) && reply.table.rows.length;
    if (!res.ok || !good) throw new Error(reply.error || "api");
    return reply;
  },
  /** Translates every fund that is not translated yet. Resolves to { done, failed, code }. */
  async translatePending() {
    const pending = Object.values(FundStore.getState().funds).flat().filter(f => !f.translated);
    if (!pending.length) return { done: 0, failed: 0, code: "" };
    if (!Local.canTranslate) return { done: 0, failed: pending.length, code: Local.reason };
    let done = 0, failed = 0, code = "";
    await Promise.all(pending.map(async fund => {
      const before = JSON.stringify(fund);
      try {
        const res = await fetch("api/translate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fund }) });
        const reply = await res.json();
        if (!res.ok) { failed++; code = reply.error || "api"; return; }
        const state = FundStore.getState();                   // put it back only if the admin has not changed the fund meanwhile
        for (const list of Object.values(state.funds)) {
          const i = list.findIndex(f => f.id === fund.id);
          if (i > -1 && JSON.stringify(list[i]) === before) { list[i] = reply.fund; FundStore.setState(state); done++; return; }
        }
      } catch (e) { failed++; code = "network"; }
    }));
    return { done, failed, code };
  }
};
const localReady = Local.detect();
// Opened from this computer (localhost or a file) but without server.py: the usual cause of "why does it want a token?"
const onThisComputer = ["localhost", "127.0.0.1", "[::1]", ""].includes(location.hostname);

/* ---------- small status banner ---------- */
const toastEl = document.getElementById("toast");
let toastTimer = 0;
function toast(message, kind, sticky) {
  clearTimeout(toastTimer);
  toastEl.textContent = message;
  toastEl.className = "toast" + (kind ? " " + kind : "");
  toastEl.hidden = false;
  if (!sticky) toastTimer = setTimeout(() => { toastEl.hidden = true; }, 7000);
}
toastEl.addEventListener("click", () => { toastEl.hidden = true; });

/** Admin actions call this first. Without a GitHub token nothing can be saved for everyone, so the action is stopped. */
function needToken() {
  if (Repo.hasToken() || Local.on) return false;           // the local server can save to this computer without a token
  toast(t(onThisComputer ? "locNeedServer" : "ghNeedToken"), "warn", true);
  return true;
}

/* ---------- saving: changes made close together go out as one commit, one save at a time ---------- */
let saveTimer = 0, saveChain = Promise.resolve(), pollTimer = 0;
function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveChain = saveChain.then(runSave); }, 400);
}
async function runSave() {
  clearTimeout(pollTimer);
  let note = "";
  if (Local.on) {                                             // on this computer: translate first, so what is saved is already translated
    const waiting = Repo.untranslated(FundStore.getState());
    if (waiting) {
      toast(t("locTranslating")(waiting), "", true);
      const result = await Local.translatePending();
      applyLang();
      if (result.failed) note = " " + t("locErr_" + result.code);
    }
  }
  if (!Repo.hasToken()) {
    if (!Local.on) return toast(t("ghNotSaved") + " " + t("ghNeedToken"), "err", true);
    try {
      await Local.save(FundStore.getState());
      toast(t("locSaved") + note, note ? "warn" : "ok", !!note);
    } catch (e) { toast(t("ghNotSaved") + " " + t("locErr_save"), "err", true); }
    return;
  }
  toast(t("ghSaving"), "", true);
  try {
    const saved = await Repo.saveNow();
    applyLang();
    const waiting = Repo.untranslated(saved);
    if (waiting) { toast(t("ghSavedTranslating")(waiting), "", true); watchTranslation(0); }
    else toast(t("ghSaved"), "ok");
  } catch (e) {
    toast(t("ghNotSaved") + " " + t("ghErr_" + ((e && e.code) || "api")), "err", true);
  }
}
FundStore.onChange(queueSave);

/** After a save with untranslated funds: look at the repository every 10 seconds until the workflow has filled them in. */
function watchTranslation(tries) {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(async () => {
    try {
      const remote = await Repo.readRemote();
      if (remote.state) {
        const merged = Repo.merge(FundStore.getState(), remote.state);
        if (!Repo.untranslated(merged)) {
          Repo.remember(merged); FundStore.setState(merged); applyLang();
          return toast(t("ghTranslated"), "ok");
        }
      }
    } catch (e) {}
    if (tries >= 30) return toast(t("ghTranslateSlow"), "warn", true);      // about five minutes
    watchTranslation(tries + 1);
  }, 10000);
}

/** "Translate" / "Translate Again" in View Fund: marks the fund so the workflow translates it from the language on screen. */
function translateNow(id) {
  if (!Auth.isAdmin() || needToken()) return;
  const hit = FundStore.find(id);
  if (!hit) return;
  closeD();
  const copy = JSON.parse(JSON.stringify(hit.fund));
  copy.translated = false;
  copy.translateFrom = lang;
  FundStore.update(id, copy, hit.strat);
  applyLang();
}

/* ---------- GitHub token box in the Add Fund window ---------- */
const ghInput = document.getElementById("ghInput"), ghStatus = document.getElementById("ghStatus");
function refreshTokenBox() {
  ghStatus.textContent = t(Repo.hasToken() ? "ghTokenSaved" : Local.on ? "locStatus" : onThisComputer ? "locNeedServer" : "ghTokenNone");
  ghStatus.classList.toggle("ok", Repo.hasToken());
  document.getElementById("ghRemove").hidden = !Repo.hasToken();
  document.getElementById("ghBox").open = !Repo.hasToken();          // show the instructions until a token is saved
  ghInput.value = "";
}
document.getElementById("ghSave").onclick = async () => {
  const k = ghInput.value.trim();
  if (!k) return;
  if (!Repo.setToken(k)) return toast(t("errStorage"), "err");
  refreshTokenBox();
  try { await Repo.readRemote(); toast(t("ghTokenOk"), "ok"); }       // check it straight away
  catch (e) { toast(t("ghErr_" + ((e && e.code) || "api")), "err", true); }
};
document.getElementById("ghRemove").onclick = () => { Repo.setToken(""); refreshTokenBox(); };
ghInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("ghSave").click(); } });

/* ---------- first load: show the shared funds ---------- */
(async () => {
  await localReady;
  let state = null;
  if (Repo.hasToken()) { try { state = (await Repo.readRemote()).state; } catch (e) {} }   // an admin gets the very latest
  if (!state) state = await Repo.readPublic();
  if (!state) return;
  FundStore.setState(state);
  Repo.remember(FundStore.getState());
  applyLang();
  if (Auth.isAdmin() && Repo.hasToken() && Repo.untranslated(FundStore.getState())) watchTranslation(0);
})();
