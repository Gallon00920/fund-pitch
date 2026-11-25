/* ---------- "Add Fund" form (admin only) ----------
   Builds a fund object in the same shape as the entries in js/funds-data.js and saves it through FundStore.
   Depends on: Auth, FundStore, and t / tab / applyLang / closeD from app.js. */
const fundModal = document.getElementById("fundModal"), fundForm = document.getElementById("fundForm");
const fundErr = document.getElementById("fundErr");

// typed text is inserted into the page as HTML, so neutralise any markup first
const esc = s => String(s).trim().replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const txt = id => esc(document.getElementById(id).value);
const num = id => { const v = document.getElementById(id).value.trim(); return v === "" ? null : Number(v); };

function showFundModal(show) {
  fundModal.hidden = !show;
  document.body.classList.toggle("modal-open", show);
  if (show) {
    fundForm.reset(); fundErr.hidden = true;
    document.getElementById("fTab").value = tab;             // default to the tab being viewed
    fundModal.scrollTop = 0;
    setTimeout(() => document.getElementById("fName").focus(), 50);
  }
}
addFundBtn.onclick = () => { if (Auth.isAdmin()) showFundModal(true); };
document.getElementById("fundCancel").onclick = () => showFundModal(false);
document.getElementById("fundClose").onclick = () => showFundModal(false);
fundModal.addEventListener("mousedown", e => { if (e.target === fundModal) showFundModal(false); });
addEventListener("keydown", e => { if (e.key === "Escape" && !fundModal.hidden) showFundModal(false); });

/** Reads "2023: 12.5" style lines. Returns [["2023", 12.5], ...] sorted by year, or null if a line is invalid. */
function parseReturns(text) {
  const rows = [];
  for (const line of text.split(/\n/).map(l => l.trim()).filter(Boolean)) {
    const m = line.match(/^(\d{4})\s*[:,\t ]\s*([+\-−]?\d+(?:\.\d+)?)\s*%?$/);
    if (!m) return null;
    rows.push([m[1], Number(m[2].replace("−", "-"))]);
  }
  if (new Set(rows.map(r => r[0])).size !== rows.length) return null;   // same year twice
  return rows.sort((a, b) => a[0] - b[0]);
}

fundForm.addEventListener("submit", e => {
  e.preventDefault();
  const fail = key => { fundErr.textContent = t(key); fundErr.hidden = false; fundErr.scrollIntoView({ block: "nearest" }); };
  if (!Auth.isAdmin()) return fail("errAdmin");
  if ([...fundForm.querySelectorAll("[required]")].some(el => !el.value.trim())) return fail("errRequired");

  const years = parseReturns(document.getElementById("fReturns").value);
  if (!years || !years.length) return fail("errReturns");
  const aum = num("fAum");
  if (!(aum > 0)) return fail("errAum");

  // optional year-to-date row: needs both the return and the month it runs to
  const ytd = num("fYtd"), ytdTo = document.getElementById("fYtdTo").value;        // "YYYY-MM"
  if ((ytd !== null) !== (ytdTo !== "")) return fail("errYtd");
  const all = years.map(r => [...r]);
  if (ytd !== null) {
    if (years.some(r => r[0] >= ytdTo.slice(0, 4))) return fail("errYtd");
    all.push([ytdTo.slice(0, 4), ytd, "ytd", Number(ytdTo.slice(5))]);
  }

  // optional worst month; the worst year is worked out from the yearly returns
  const wm = num("fWm"), wmAt = document.getElementById("fWmAt").value;
  if ((wm !== null) !== (wmAt !== "")) return fail("errWm");
  const worst = years.reduce((a, r) => (r[1] < a[1] ? r : a), years[0]);
  const dd = { wy: worst[1] < 0 ? [worst[1], worst[0]] : null };
  if (wm !== null) dd.wm = [wm, wmAt];

  const one = id => ({ en: txt(id) });                       // typed once, shown as typed in every language
  const fund = {
    id: "custom-" + Date.now(), custom: true,
    name: txt("fName"), mgr: one("fMgr"), tag: one("fTag"),
    vehicle: txt("fVehicle") || "—",
    inception: document.getElementById("fInception").value,  // "YYYY-MM"
    aum,
    strategy: one("fStrategy"),
    hist: all.slice(0, -9),                                  // the card shows the latest 9 periods; older years appear in View Fund only
    perf: all.slice(-9),
    dd,
    liq: one("fLiq")
  };
  if (txt("fLiqFull")) fund.liqFull = one("fLiqFull");
  if (txt("fNote")) fund.note = one("fNote");

  const target = document.getElementById("fTab").value;
  const saved = FundStore.add(target, fund);
  showFundModal(false);
  document.querySelector(`.tab[data-tab="${target}"]`).click();                     // show the tab the fund went to
  applyLang();
  const sc = document.getElementById("scroller");
  sc.scrollTo({ left: sc.scrollWidth, behavior: "smooth" });                        // new funds are added at the end
  if (!saved) alert(t("errStorage"));
});

/** Called from the Delete button inside a custom fund's detail panel. */
function deleteFund(id) {
  if (!Auth.isAdmin() || !confirm(t("confirmDelete"))) return;
  FundStore.remove(id);
  closeD();
  applyLang();
}
