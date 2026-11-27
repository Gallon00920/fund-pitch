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

/* earlier funds by vintage as editable lines:   Kreos IV, 2012: 11.1 / 1.32x / DPI 1.23x   |   Kreos VII, 2022: 17.0 / 1.31x investing */
const vintLine = v => `${plain(v.n)}, ${v.y}: ${v.irr}${v.x != null ? ` / ${v.x}x` : ""}${v.dpi != null ? ` / DPI ${v.dpi}x` : ""}${v.live ? " investing" : ""}`;
/** Returns { rows } sorted by vintage, or { bad: line number }. */
function parseVintLines(text) {
  const rows = [], all = lines(text);
  for (let i = 0; i < all.length; i++) {
    const m = all[i].match(/^(.+?)\s*[,，]\s*(\d{4})\s*[:：]\s*([+\-−]?\d+(?:\.\d+)?)\s*%?(?:\s*\/\s*(\d+(?:\.\d+)?)\s*x)?(?:\s*\/\s*DPI\s*(\d+(?:\.\d+)?)\s*x?)?\s*(investing|投资中|投資中)?$/i);
    if (!m) return { bad: i + 1 };
    rows.push({ n: esc(m[1]), y: m[2], irr: Number(m[3].replace("−", "-")), ...(m[4] ? { x: Number(m[4]) } : {}), ...(m[5] ? { dpi: Number(m[5]) } : {}), ...(m[6] ? { live: true } : {}) });
  }
  return { rows: rows.sort((a, b) => a.y - b.y) };
}

function showEditModal(show) {
  setModal(editModal, show);
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
  ef("efStrat").innerHTML = FundStore.strategies().map(s => `<option value="${s.id}"${s.id === hit.strat ? " selected" : ""}>${stratLabel(s)}</option>`).join("");
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
  ef("efVint").value = (f.vintages || []).map(vintLine).join("\n");
  ef("efDd").value = ddShown;
  ef("efNote").value = f.note ? plain(L(f.note)) : "";
  ef("efAdminNote").value = plain(f.adminNote);
  ef("efHide").defaultValue = ef("efHide").value = (f.redact || []).map(w => plain(w.replace(/\\(.)/g, "$1"))).join(", ");
  // The monthly table is edited as text, one year per line. A picture fills the box; any figure can then be corrected.
  ef("efMonthly").value = "";
  editing.monthlyShown = ef("efMonthlyText").value = monthlyText(f.monthly);
  editing.classesShown = ef("efClassesText").value = classesText(classesOf(f));
  ef("efClassesKeep").checked = !!f.classesKeepText;
  ef("efPicStatus").textContent = "";
  refreshMonthlyField();
  refreshClassesField();
  showEditModal(true);
  editModal.scrollTop = 0;
}

const refreshMonthlyField = () => checkMonthlyText(ef("efMonthlyText").value, ef("efMonthlyStatus"));
const refreshClassesField = () => checkClassesText(ef("efClassesText").value, ef("efClassesStatus"));
/* Claude reads the picture and says whether it is a monthly-returns table or a share-class table; it fills that box. */
async function loadEditPicture(file) {
  const session = editing;
  if (!file || !session) return;
  ef("efMonthly").value = "";
  const found = await readFundPicture(file, ef("efPicStatus"));
  if (!found || editing !== session) return;
  if (found.kind === "classes") { ef("efClassesText").value = classesText(found.table); refreshClassesField(); }
  else { ef("efMonthlyText").value = monthlyText(found.rows); refreshMonthlyField(); }
}
ef("efMonthly").addEventListener("change", () => loadEditPicture(ef("efMonthly").files[0]));
/* a picture can also be dropped anywhere on the Edit window, or pasted from the clipboard (a screenshot) */
editModal.addEventListener("dragover", e => { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = "copy"; lightDrop(ef("efMonthlyDrop")); });
editModal.addEventListener("dragleave", e => { if (!editModal.contains(e.relatedTarget)) lightDrop(null); });
editModal.addEventListener("drop", e => {
  if (!hasFiles(e)) return;
  e.preventDefault();                                        // otherwise the browser would open the file
  lightDrop(null);
  ef("efMonthlyDrop").scrollIntoView({ block: "nearest" });  // the result is reported under the box
  loadEditPicture(e.dataTransfer.files[0]);
});
editModal.addEventListener("paste", e => {
  const file = pictureFrom(e.clipboardData && e.clipboardData.files);
  if (file) { e.preventDefault(); ef("efMonthlyDrop").scrollIntoView({ block: "nearest" }); loadEditPicture(file); }
});
ef("efMonthlyText").addEventListener("input", refreshMonthlyField);
ef("efClassesText").addEventListener("input", refreshClassesField);

ef("editCancel").onclick = () => showEditModal(false);
ef("editClose").onclick = () => showEditModal(false);
editModal.addEventListener("mousedown", e => { if (e.target === editModal) showEditModal(false); });
addEventListener("keydown", e => { if (e.key === "Escape" && !editModal.hidden) showEditModal(false); });

editForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!editing || !Auth.isAdmin()) return;
  const fail = (key, arg) => { const msg = t(key); editErr.textContent = typeof msg === "function" ? msg(arg) : msg; editErr.hidden = false; };
  if (monthlyBusy) return fail("moWait");                    // a picture is still being read
  const monthlyChanged = ef("efMonthlyText").value !== editing.monthlyShown, monthly = parseMonthlyText(ef("efMonthlyText").value);
  if (monthlyChanged && monthly.bad != null) return fail("moErrLine", monthly.bad);
  const classesChanged = ef("efClassesText").value !== editing.classesShown, classes = parseClassesText(ef("efClassesText").value);
  if (classesChanged && classes.bad != null) return fail("clErrLine", classes.bad);
  const val = id => ef(id).value.trim();
  if (!val("efName") || !val("efTag")) return fail("efErrRequired");
  const all = parseReturnLines(ef("efReturns").value);
  if (!all) return fail("efErrReturns");
  const vint = parseVintLines(ef("efVint").value);
  if (vint.bad != null) return fail("efErrVint", vint.bad);
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
  // The card shows the latest 15 periods; older years appear in View Fund only. A fund with `cardFrom` (a year) keeps
  // everything before that year off the card: those rows are a predecessor or composite record, not the fund's own.
  const own = f.cardFrom ? all.filter(p => p[0] >= f.cardFrom) : all;
  f.perf = own.slice(-15);
  f.hist = all.filter(p => !f.perf.includes(p));
  const noteLines = lines(ef("efNotes").value).map(esc);
  if (perLang("perfNotes")) f.perfNotes[lang] = noteLines; else f.perfNotes = noteLines;
  if (vint.rows.length) f.vintages = vint.rows; else delete f.vintages;
  const dd = ef("efDd").value.trim();
  if (dd !== editing.ddShown.trim()) {                       // only touched when the admin changed it
    if (perLang("ddRaw")) f.ddRaw[lang] = escLines(lines(dd));
    else if (dd) f.ddRaw = escLines(lines(dd));
    else { delete f.ddRaw; delete f.dd; }
  }
  optional("note", escLines(lines(ef("efNote").value)), true);
  // admin notes: one text in every language, kept as typed (blank lines become line breaks too)
  const adminNote = ef("efAdminNote").value.replace(/\s+$/, "").split(/\n/).map(s => esc(s.trimEnd())).join("<br>").replace(/^(<br>)+/, "");
  if (adminNote) f.adminNote = adminNote; else delete f.adminNote;
  if (val("efHide") !== ef("efHide").defaultValue.trim()) f.redactAuto = false;   // the admin changed the list: keep it on later re-translations
  f.redact = [...new Set(val("efHide").split(/[,，、;；]/).map(w => esc(w)).filter(w => w.length > 1))]
    .sort((x, y) => y.length - x.length)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (monthlyChanged) { if (monthly.rows.length) f.monthly = monthly.rows; else delete f.monthly; }   // untouched text leaves the table as it is

  if (classesChanged) {                                      // a built-in fund can hold one table per language: only the one on screen changes
    if (!classes.table) delete f.classes;
    else if (f.classes && !f.classes.head && Object.keys(f.classes).length > 1) f.classes[lang] = classes.table;
    else f.classes = classes.table;
  }
  if (f.classes && ef("efClassesKeep").checked) f.classesKeepText = true; else delete f.classesKeepText;

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
