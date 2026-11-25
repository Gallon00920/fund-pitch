/* ---------- Edit and delete a fund (admin only) ----------
   Every card has Edit and Delete buttons for admins; View Fund has the same two buttons at the bottom.
   Depends on: Auth, FundStore, escLines (add-fund.js), and esc / t / L / lang / veh / ddText / selectTab / applyLang / closeD from app.js. */
const editModal = document.getElementById("editModal"), editForm = document.getElementById("editForm"), editErr = document.getElementById("editErr");
const ef = id => document.getElementById(id);
let editing = null;                                          // { fund, strat, ddShown } while the form is open

/* stored text is HTML (escaped, with <br> between lines); turn it back into what a person would type */
const plain = html => { const box = document.createElement("textarea"); box.innerHTML = String(html || "").replace(/<br\s*\/?>/gi, "\n"); return box.value; };
const lines = text => String(text).split(/\n/).map(s => s.trim()).filter(Boolean);

/* yearly returns as editable lines:   2023: 25.04   |   2022 from 6: 15.62   |   2026 YTD 10: 4.78 */
const returnLine = p => `${p[0]}${p[2] === "p" ? ` from ${p[3]}` : p[2] === "ytd" ? ` YTD ${p[3]}` : ""}: ${p[1]}`;
function parseReturnLines(text) {
  const rows = [];
  for (const line of lines(text)) {
    const m = line.match(/^(\d{4})\s*(?:(from|ytd)\s*(\d{1,2}))?\s*[:：,]\s*([+\-−]?\d+(?:\.\d+)?)\s*%?$/i);
    if (!m || (m[2] && !(+m[3] >= 1 && +m[3] <= 12))) return null;
    const v = Number(m[4].replace("−", "-"));
    rows.push(m[2] ? [m[1], v, m[2].toLowerCase() === "from" ? "p" : "ytd", +m[3]] : [m[1], v]);
  }
  const keys = rows.map(r => r[0] + (r[2] === "ytd" ? "y" : ""));
  if (new Set(keys).size !== keys.length) return null;       // the same period twice
  return rows.sort((a, b) => a[0] - b[0] || (a[2] === "ytd") - (b[2] === "ytd"));
}

function showEditModal(show) {
  editModal.hidden = !show;
  document.body.classList.toggle("modal-open", show);
  if (!show) editing = null;
}

function openEdit(id) {
  const hit = FundStore.find(id);
  if (!hit || !Auth.isAdmin() || needToken()) return;
  closeD();
  const f = hit.fund;
  const ddShown = LX(f.ddRaw) ? plain(LX(f.ddRaw)) : f.dd ? plain(ddText(f)) : "";
  const liqShown = plain(liqTxt(f));                          // funds with daily dealing have no stored text; "Daily" is the default
  editing = { fund: f, strat: hit.strat, ddShown, liqShown };
  editErr.hidden = true;
  ef("efStrat").innerHTML = FundStore.strategies().map(s => `<option value="${s.id}"${s.id === hit.strat ? " selected" : ""}>${stratName(s)}</option>`).join("");
  ef("efName").value = plain(f.name);
  ef("efMgr").value = plain(L(f.mgr));
  ef("efTag").value = plain(L(f.tag));
  ef("efVehicle").value = plain(veh(f));
  ef("efInception").value = f.inception || "";
  ef("efInceptionText").value = plain(LX(f.inceptionText));
  ef("efAum").value = f.aum != null ? f.aum : "";
  ef("efAumText").value = plain(LX(f.aumText));
  ef("efTarget").value = plain(LX(f.target));
  ef("efStrategy").value = plain(L(f.strategy));
  ef("efLiq").value = liqShown;
  ef("efLiqFull").value = f.liqFull ? plain(L(f.liqFull)) : "";
  ef("efReturns").value = [...(f.hist || []), ...f.perf].map(returnLine).join("\n");
  ef("efNotes").value = notesOf(f).map(plain).join("\n");
  ef("efDd").value = ddShown;
  ef("efNote").value = f.note ? plain(L(f.note)) : "";
  ef("efHide").value = (f.redact || []).map(w => plain(w.replace(/\\(.)/g, "$1"))).join(", ");
  showEditModal(true);
  editModal.scrollTop = 0;
}

ef("editCancel").onclick = () => showEditModal(false);
ef("editClose").onclick = () => showEditModal(false);
editModal.addEventListener("mousedown", e => { if (e.target === editModal) showEditModal(false); });
addEventListener("keydown", e => { if (e.key === "Escape" && !editModal.hidden) showEditModal(false); });

editForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!editing || !Auth.isAdmin()) return;
  const fail = key => { editErr.textContent = t(key); editErr.hidden = false; };
  const val = id => ef(id).value.trim();
  if (!val("efName") || !val("efTag")) return fail("efErrRequired");
  const all = parseReturnLines(ef("efReturns").value);
  if (!all) return fail("efErrReturns");
  const aum = val("efAum") === "" ? null : Number(val("efAum"));
  if (aum !== null && !(aum > 0)) return fail("errAum");

  const f = JSON.parse(JSON.stringify(editing.fund));        // work on a copy; nothing changes unless saving succeeds
  // Built-in funds hold separate English / 简体 / 繁體 text: an edit changes the language being viewed.
  // Added funds hold one text, shown in every language.
  const setText = (key, html) => {
    const o = f[key] && typeof f[key] === "object" ? f[key] : {};
    if (Object.keys(o).length > 1) o[lang] = html; else o.en = html;
    f[key] = o;
  };
  // true for a field that holds one text per language (built-in funds, and added funds after translation)
  const perLang = key => f[key] && typeof f[key] === "object" && !Array.isArray(f[key]) && Object.keys(f[key]).length > 1;
  const optional = (key, html, asText) => {
    if (perLang(key)) f[key][lang] = html;                   // only the language being viewed changes
    else if (!html) delete f[key];
    else if (asText) setText(key, html);
    else f[key] = html;
  };

  f.name = esc(val("efName"));
  setText("mgr", esc(val("efMgr")) || "—");
  setText("tag", esc(val("efTag")));
  const vehicle = val("efVehicle");
  f.vehicle = ["en", "sc", "tc"].some(k => UI[k].private.toLowerCase() === vehicle.toLowerCase()) ? "private" : esc(vehicle) || "—";
  f.inception = val("efInception") || null;
  optional("inceptionText", escLines(lines(ef("efInceptionText").value)));
  f.isNew = !f.inception && /新发|新發|new/i.test(val("efInceptionText"));
  f.aum = aum;
  optional("aumText", esc(val("efAumText")));
  if (perLang("target")) f.target[lang] = esc(val("efTarget")); else f.target = esc(val("efTarget")) || null;
  setText("strategy", escLines(lines(ef("efStrategy").value)));
  if (f.liq || val("efLiq") !== editing.liqShown) setText("liq", esc(val("efLiq")) || "—");   // keep the translated default unless it was changed
  optional("liqFull", escLines(lines(ef("efLiqFull").value)), true);
  f.hist = all.slice(0, -9);                                 // the card shows the latest 9 periods; older years appear in View Fund only
  f.perf = all.slice(-9);
  const noteLines = lines(ef("efNotes").value).map(esc);
  if (perLang("perfNotes")) f.perfNotes[lang] = noteLines; else f.perfNotes = noteLines;
  const dd = ef("efDd").value.trim();
  if (dd !== editing.ddShown.trim()) {                       // only touched when the admin changed it
    if (perLang("ddRaw")) f.ddRaw[lang] = escLines(lines(dd));
    else if (dd) f.ddRaw = escLines(lines(dd));
    else { delete f.ddRaw; delete f.dd; }
  }
  optional("note", escLines(lines(ef("efNote").value)), true);
  f.redact = [...new Set(val("efHide").split(/[,，、;；]/).map(w => esc(w)).filter(w => w.length > 1))]
    .sort((x, y) => y.length - x.length)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const strat = ef("efStrat").value, id = f.id;
  const saved = FundStore.update(id, f, strat);
  showEditModal(false);
  selectTab(strat);
  applyLang();
  if (!saved) alert(t("errStorage"));
});

/* Edit / Delete buttons on the cards */
document.getElementById("track").addEventListener("click", e => {
  const edit = e.target.closest("[data-edit]"), del = e.target.closest("[data-delfund]");
  if (edit) openEdit(edit.dataset.edit);
  if (del) deleteFund(del.dataset.delfund);
});

/* "Restore original funds": undo every edit and deletion of the built-in funds */
document.getElementById("restoreBtn").onclick = () => {
  if (!Auth.isAdmin() || needToken() || !confirm(t("restoreConfirm"))) return;
  FundStore.restoreBuiltIns();
  applyLang();
};
