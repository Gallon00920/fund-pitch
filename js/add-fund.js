/* ---------- "Add Funds" from a PPTX deck (admin only) ----------
   Step 1: the admin chooses a .pptx screening deck.  js/pptx-reader.js turns it into drafts, one per table column.
   Step 2: the admin checks each draft (name, manager, tab) and adds the ones they want.
   Depends on: Auth, FundStore, PptxReader, and t / applyLang / closeD from app.js. */
const fundModal = document.getElementById("fundModal"), fundForm = document.getElementById("fundForm");
const fundErr = document.getElementById("fundErr"), fundFile = document.getElementById("fundFile");
const imStatus = document.getElementById("imStatus"), imList = document.getElementById("imList"), imSubmit = document.getElementById("imSubmit");
let drafts = [];

const imStratRow = document.getElementById("imStratRow"), imStratName = document.getElementById("imStratName");
// esc() comes from app.js
const escLines = a => (a || []).map(esc).filter(Boolean).join("<br>");

function showFundModal(show) {
  fundModal.hidden = !show;
  document.body.classList.toggle("modal-open", show);
  if (show) { resetImport(); refreshTokenBox(); fundModal.scrollTop = 0; }
}
function resetImport() {
  drafts = []; fundForm.reset();
  imList.innerHTML = ""; imStatus.textContent = ""; fundErr.hidden = true; imSubmit.hidden = true; imStratRow.hidden = true;
}

/** <option> list of every strategy tab, with one selected. */
const stratOptions = selected => FundStore.strategies()
  .map(s => `<option value="${s.id}"${s.id === selected ? " selected" : ""}>${stratLabel(s)}</option>`).join("");

// "create a new strategy for these funds": makes the tab, then points every listed fund at it
document.getElementById("imStratCreate").onclick = () => {
  const s = createStrategy(imStratName.value);
  if (!s) return;
  imStratName.value = "";
  imList.querySelectorAll(".im-tab").forEach(sel => { sel.innerHTML = stratOptions(s.id); });
  renderTabs();
};
imStratName.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("imStratCreate").click(); } });
addFundBtn.onclick = () => { if (Auth.isAdmin()) showFundModal(true); };
document.getElementById("fundCancel").onclick = () => showFundModal(false);
document.getElementById("fundClose").onclick = () => showFundModal(false);
fundModal.addEventListener("mousedown", e => { if (e.target === fundModal) showFundModal(false); });
addEventListener("keydown", e => { if (e.key === "Escape" && !fundModal.hidden) showFundModal(false); });

const fail = msg => { fundErr.textContent = msg; fundErr.hidden = false; };

/** Reads the chosen deck and shows what was found. Also callable directly with a File (used in testing). */
async function importDeck(file) {
  imList.innerHTML = ""; fundErr.hidden = true; imSubmit.hidden = true; drafts = [];
  if (!file) return;
  imStatus.textContent = t("imReading");
  try {
    drafts = await PptxReader.read(file);
  } catch (e) {
    imStatus.textContent = "";
    return fail(t("imBad"));
  }
  if (!drafts.length) { imStatus.textContent = ""; return fail(t("imNone")); }
  imStatus.textContent = t("imFound")(drafts.length, file.name);
  renderDrafts();
  imSubmit.hidden = false; imStratRow.hidden = false;
}
fundFile.addEventListener("change", () => importDeck(fundFile.files[0]));

/* drag and drop: a deck can be dropped anywhere on the Add Fund window */
const dropZone = document.getElementById("dropZone");
let dragDepth = 0;                                           // dragenter/dragleave fire for every child element, so count them
const hasFiles = e => e.dataTransfer && [...e.dataTransfer.types].includes("Files");
/* A picture being dragged is a table (monthly returns or share classes) for one fund in the list, not a deck: it lights up that fund's
   picture box instead of the deck zone. (The file's type is readable while dragging; its name is not.) */
const isPicture = file => !!file && (/^image\//.test(file.type) || /\.(png|jpe?g|webp|gif)$/i.test(file.name || ""));
const draggingPicture = e => [...(e.dataTransfer.items || [])].some(i => i.kind === "file" && /^image\//.test(i.type));
const pictureFrom = list => [...(list || [])].find(isPicture);             // from a drop or from the clipboard
function lightDrop(el) {                                     // highlights one picture box (or none)
  document.querySelectorAll(".mo-drop.drag").forEach(z => { if (z !== el) z.classList.remove("drag"); });
  if (el) el.classList.add("drag");
}
const draftItemAt = target => target.closest(".im-item") || (imList.children.length === 1 ? imList.firstElementChild : null);
fundModal.addEventListener("dragenter", e => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth++; if (!draggingPicture(e)) dropZone.classList.add("drag"); });
fundModal.addEventListener("dragover", e => {
  if (!hasFiles(e)) return;
  e.preventDefault(); e.dataTransfer.dropEffect = "copy";
  if (draggingPicture(e)) { const item = draftItemAt(e.target); lightDrop(item && item.querySelector(".mo-drop")); }
});
fundModal.addEventListener("dragleave", e => { if (!hasFiles(e)) return; if (--dragDepth <= 0) { dragDepth = 0; dropZone.classList.remove("drag"); lightDrop(null); } });
fundModal.addEventListener("drop", e => {
  if (!hasFiles(e)) return;
  e.preventDefault();                                        // otherwise the browser would open or download the file
  dragDepth = 0; dropZone.classList.remove("drag"); lightDrop(null);
  const file = e.dataTransfer.files[0];
  if (isPicture(file)) {                                     // a picture of a table, for the fund it was dropped on
    const item = draftItemAt(e.target);
    return item ? loadDraftPicture(item, file) : fail(t(imList.children.length ? "moDropWhere" : "imBad"));
  }
  fundFile.value = "";                                       // the picker no longer matches what is loaded
  if (file && !/\.pptx$/i.test(file.name)) { imList.innerHTML = ""; imStatus.textContent = ""; imSubmit.hidden = true; drafts = []; return fail(t("imBad")); }
  importDeck(file);
});

/* ---------- tables from a picture ----------
   The admin gives a fund a picture of a monthly-returns table or of a share-class table (fees and liquidity terms per
   class). The local server has Claude read it and say which of the two it is. Only the table is kept: the picture
   itself is never saved or uploaded anywhere else. */
let monthlyBusy = 0;                                         // pictures still being read; the forms wait for them
const MONTHLY_ACCEPT = "image/png,image/jpeg,image/webp,image/gif";
/** Resolves to { kind: "monthly", rows } or { kind: "classes", table }, or null when the picture could not be read. */
async function readFundPicture(file, statusEl) {
  statusEl.className = "mo-status"; statusEl.textContent = t("moReading");
  monthlyBusy++;
  try {
    const found = await Local.parsePicture(file);
    if (found.kind === "classes") {
      found.table = { head: found.table.head.map(c => esc(c)), rows: found.table.rows.map(r => r.map(c => esc(c))) };
      statusEl.textContent = t("clDone")(found.table.rows.length);
      statusEl.classList.add("ok");
      return found;
    }
    const rows = found.rows, bad = monthlySuspects(rows);
    statusEl.textContent = t("moDone")(rows.length, rows[0].y, rows.at(-1).y) + (bad.length ? " " + t("moCheck")(bad.join(", ")) : "");
    statusEl.classList.add(bad.length ? "warn" : "ok");
    return found;
  } catch (e) {
    statusEl.textContent = UI[lang]["moErr_" + e.message] || t("moErr_api");
    statusEl.classList.add("err");
    return null;
  } finally { monthlyBusy--; }
}
/* The table is edited as text, one year per line (the same idea as "Returns by period" in Edit):
     2020    0.84   -0.37  -21.80   ...   -12.9
   year, twelve months (Jan first), then the year total; "-" stands for an empty cell. Rows pasted from Excel work too. */
const moCellText = (v, d) => v == null ? "-" : v.toFixed(Math.max(d, (String(v).split(".")[1] || "").length));
function monthlyText(rows) {
  if (!rows || !rows.length) return "";
  const line = cells => cells.map((c, i) => i ? String(c).padStart(6) : String(c).padEnd(4)).join(" ");   // always a space between figures
  return [line(["Year", ...MON, "Total"]), ...rows.map(r => line([r.y, ...r.m.map(v => moCellText(v, 2)), moCellText(r.t, 1)]))].join("\n");
}
/** Text -> { rows } (empty list for no table), or { bad: "2020" } naming the first line that cannot be read. */
function parseMonthlyText(text) {
  const rows = {};
  for (const raw of String(text).split(/\n/)) {
    const line = raw.replace(/\s+$/, "");
    if (!/^\s*\d/.test(line)) continue;                       // blank lines and the "Year Jan Feb ..." heading
    const head = line.match(/^\s*(\d+) *[:：]?(?: *[,;，；\t]| +|$)(.*)$/), bad = { bad: line.trim().split(/[\s,;:：]/)[0].slice(0, 12) };
    if (!head) return bad;
    const year = head[1], rest = head[2];                     // the year, then the cells: tab, comma or space separated
    const cells = (rest.includes("\t") ? rest.split("\t") : /[,;，；]/.test(rest) ? rest.split(/[,;，；]/) : rest.trim().split(/\s+/)).map(c => c.trim());
    if (!/^(19|20)\d{2}$/.test(year) || rows[year] || cells.length < 12 || cells.length > 13) return bad;
    const nums = [];
    for (const c of cells) {
      const neg = /^\(.*\)$/.test(c), s = c.replace(/[()%\s]/g, "").replace(/[−–]/g, "-");
      if (s === "" || s === "-" || s === "—" || /^n\/?a$/i.test(s)) { nums.push(null); continue; }
      if (!/^[+-]?(\d+(\.\d+)?|\.\d+)$/.test(s)) return bad;
      nums.push(neg ? -Math.abs(+s) : +s);
    }
    if (nums.some(v => v != null)) rows[year] = { y: year, m: nums.slice(0, 12), t: nums.length > 12 ? nums[12] : null };
  }
  return { rows: Object.keys(rows).sort().map(y => rows[y]) };
}
/** Shows what the text holds (or the line that is wrong) under the box, and returns the parse result. */
function checkMonthlyText(text, statusEl) {
  const p = parseMonthlyText(text);
  statusEl.className = "mo-status";
  if (p.bad != null) { statusEl.textContent = t("moErrLine")(p.bad); statusEl.classList.add("err"); return p; }
  const suspect = monthlySuspects(p.rows);
  statusEl.textContent = p.rows.length ? t("moRows")(p.rows.length, p.rows[0].y, p.rows.at(-1).y) + (suspect.length ? " " + t("moCheck")(suspect.join(", ")) : "") : t("moNone");
  if (suspect.length) statusEl.classList.add("warn");
  return p;
}

/* The share-class table is edited as text too: the column titles on the first line, then one class per line, with
   " | " between the cells:
     Class    | Management Fee | Lock-Up
     Class CS | 1.50%          | 1 Year Hard
   Rows pasted from Excel (tab separated) work too. Stored as { head: [titles], rows: [[cells]] }, cells as escaped text. */
function classesText(table) {
  if (!table || !table.rows || !table.rows.length) return "";
  const grid = [table.head, ...table.rows].map(r => r.map(c => plain(c)));
  const width = table.head.map((_, i) => Math.max(...grid.map(r => (r[i] || "").length)));
  return grid.map(r => r.map((c, i) => i < r.length - 1 ? c.padEnd(width[i]) : c).join(" | ")).join("\n");
}
/** Text -> { table } (null for no table), or { bad: "Series M" } naming the first line that cannot be read. */
function parseClassesText(text) {
  const lines = String(text).split(/\n/).filter(l => l.trim());
  if (!lines.length) return { table: null };
  const cellsOf = l => (l.includes("\t") ? l.split("\t") : l.split(/[|｜]/)).map(c => esc(c.slice(0, 120)));
  const name = l => l.trim().split(/\s*[|｜\t]/)[0].slice(0, 24);
  const head = cellsOf(lines[0]);
  if (head.length < 2 || head.length > 10 || lines.length < 2 || lines.length > 41) return { bad: name(lines[0]) };
  const rows = [];
  for (const l of lines.slice(1)) {
    const cells = cellsOf(l);
    if (cells.length > head.length || !cells[0]) return { bad: name(l) };
    rows.push([...cells, ...Array(head.length - cells.length).fill("")]);
  }
  return { table: { head, rows } };
}
function checkClassesText(text, statusEl) {
  const p = parseClassesText(text);
  statusEl.className = "mo-status";
  if (p.bad != null) { statusEl.textContent = t("clErrLine")(p.bad); statusEl.classList.add("err"); }
  else statusEl.textContent = p.table ? t("clRows")(p.table.rows.length, p.table.head.length) : t("clNone");
  return p;
}

/* the picture box: click to choose, drop a picture on it, or paste a screenshot */
const moDropHTML = inputAttrs => `<label class="mo-drop"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.6"/><path d="m4 17 5-4.5 3.5 3 3-2.5 4.5 4"/></svg><div><b>${t("moDrop")}</b><small>${t("moDropHint")}</small></div><input ${inputAttrs} type="file" accept="${MONTHLY_ACCEPT}"></label>`;
imList.addEventListener("change", e => {
  if (e.target.matches(".im-monthly") && e.target.files[0]) loadDraftPicture(e.target.closest(".im-item"), e.target.files[0]);
});
imList.addEventListener("paste", e => {
  const item = e.target.closest(".im-item"), file = pictureFrom(e.clipboardData && e.clipboardData.files);
  if (item && file) { e.preventDefault(); loadDraftPicture(item, file); }
});
async function loadDraftPicture(item, file) {
  fundErr.hidden = true;
  item.querySelector(".im-monthly").value = "";              // the picker no longer matches what was read
  const found = await readFundPicture(file, item.querySelector(".im-mo .mo-status"));
  if (!found || !item.isConnected) return;
  // the table goes into its text box, where the admin can correct anything before adding the fund
  const box = item.querySelector(found.kind === "classes" ? ".im-cledit" : ".im-moedit"), area = box.querySelector("textarea");
  area.value = found.kind === "classes" ? classesText(found.table) : monthlyText(found.rows);
  box.hidden = false;
  area.dispatchEvent(new Event("input", { bubbles: true }));
}
imList.addEventListener("input", e => {
  if (e.target.matches(".im-motext")) checkMonthlyText(e.target.value, e.target.closest(".im-moedit").querySelector(".mo-status"));
  if (e.target.matches(".im-cltext")) checkClassesText(e.target.value, e.target.closest(".im-cledit").querySelector(".mo-status"));
});

/** Suggests the words to hide from investors: the fund and manager names, plus other name-like words
    (sister funds, vintages) found in the deck's track record, loss and inception text. The admin can edit the list. */
function suggestHidden(d) {
  // ordinary words and finance abbreviations that are never a fund or manager name, so "ITD", "ROE" or "Residential"
  // are not hidden; roman numerals and quarter labels are skipped too
  const generic = /^(abf|abl|abs|absolute|alpha|and|annual|annualized|approved|asset|assets|aum|average|aviation|backed|based|beta|biopharma|bond|bonds|bps|capital|cash|class|clo|close|closed|cmbs|commercial|composite|consumer|core|corporate|covid|credit|debt|deck|direct|disease|diseases|distribution|diversified|dividend|dpi|drawdown|duration|dynamic|end|ended|equipment|equity|est|estate|estimated|etf|eur|euribor|evergreen|expected|fico|final|finance|financial|first|fixed|flagship|floating|fully|fund|funds|gbp|global|grade|gross|group|harvesting|healthcare|high|hypothetical|inc|inception|income|institutional|international|invested|investing|investment|investments|irr|issue|itd|launch|launched|legacy|lending|libor|lien|liens|liquid|llc|loan|loans|long|ltd|ltv|management|marketing|master|medical|model|moic|monthly|mortgage|mortgages|msr|msrs|multi|nav|net|new|note|notes|npl|off|one|open|opportunistic|opportunities|opportunity|orphan|partners|performance|platform|plc|portfolio|portfolios|private|privates|product|products|program|programme|proj|projected|public|quarterly|rare|rate|real|realized|record|reit|related|remaining|residential|return|returns|rmbs|roa|roe|royalties|royalty|rpl|run|rvpi|second|secured|securitized|semi|senior|series|sharpe|short|sicav|since|situations|sofr|special|specialty|spv|strategies|strategy|structured|target|targeting|term|the|therapeutic|third|total|track|transportation|tvpi|ucits|usd|value|vintage|year|years|yield|yoy|ytd|[ivx]+[a-c]?|q[1-4])$/i;
  const text = [d.name, d.mgr, ...d.inceptionLines, ...d.perfNotes, ...d.ddLines].join(" ");
  const words = text.match(/\b[A-Z][A-Za-z0-9&]{2,}\b/g) || [];
  return [...new Set(words.filter(w => !generic.test(w)))];
}

function renderDrafts() {
  imList.innerHTML = drafts.map((d, i) => {
    const size = d.aum != null ? money(d.aum) : esc(d.aumText) || "—";
    const inc = d.inception ? ym(d.inception) : d.isNew ? t("newFund") : esc(d.inceptionLines[0]) || "—";
    const returns = d.perf.length
      ? `${t("imReturns")(d.perf.length)}: ${d.perf.map(p => perLabel(p) + " " + fmt(p[1])).join(", ")}`
      : t("imNoReturns");
    return `<div class="im-item" data-n="${i}">
      <input class="im-on" type="checkbox" checked aria-label="${t("imInclude")}">
      <div class="im-main">
        <div class="im-tag">${esc(d.tag)}<small>${t("imSlide")} ${d.slide}${d.slideTitle ? " · " + esc(d.slideTitle) : ""}</small></div>
        <div class="im-fields">
          <label><span>${t("imName")}</span><input class="im-name" maxlength="80" value="${esc(d.name)}"></label>
          <label><span>${t("afMgr")}</span><input class="im-mgr" maxlength="60" value="${esc(d.mgr)}"></label>
          <label><span>${t("afCategory")}</span><select class="im-tab">${stratOptions(d.liquid ? "liquid" : "illiquid")}</select></label>
          <label class="wide"><span>${t("imHide")}</span><input class="im-hide" maxlength="300" data-auto="${esc(suggestHidden(d).join(", "))}" value="${esc(suggestHidden(d).join(", "))}"></label>
        </div>
        <ul class="im-sum">
          <li><b>${t("aum")}:</b> ${size} &nbsp;·&nbsp; <b>${t("inception")}:</b> ${inc}</li>
          <li><b>${t("ret")}:</b> ${returns}</li>
          <li><b>${t("dealing")}:</b> ${esc(d.liqShort) || "—"}</li>
        </ul>
        <div class="im-mo"><span>${t("picTitle")}</span>${moDropHTML('class="im-monthly"')}<small class="mo-status"></small></div>
        <div class="im-moedit" hidden><span class="im-sub">${t("moBoxTitle")}</span><textarea class="im-motext mo-text" rows="8" wrap="off" spellcheck="false" aria-label="${t("moBoxTitle")}"></textarea><small class="mo-status"></small><small>${t("moHelp")}</small></div>
        <div class="im-cledit" hidden><span class="im-sub">${t("clTitle")}</span><textarea class="im-cltext mo-text" rows="6" wrap="off" spellcheck="false" aria-label="${t("clTitle")}"></textarea><small class="mo-status"></small><small>${t("clHelp")}</small></div>
      </div></div>`;
  }).join("");
}

/** Turns an accepted draft into a fund object, in the shape used by js/funds-data.js plus a few free-text fields. */
function fundFromDraft(d, i, name, mgr, hide, hideUntouched) {
  const one = s => ({ en: s });                               // deck text is shown as written, in every language
  const fund = {
    id: `custom-${Date.now()}-${i}`, custom: true,
    name: esc(name), mgr: one(esc(mgr) || "—"), tag: one(esc(d.tag)),
    vehicle: d.vehicle,
    inception: d.inception, inceptionText: escLines(d.inceptionLines), isNew: d.isNew,
    aum: d.aum, aumText: esc(d.aumText),
    strategy: one(escLines(d.strategyLines)),
    hist: d.perf.slice(0, -15),                               // the card shows the latest 15 periods; older years appear in View Fund only
    perf: d.perf.slice(-15),
    perfNotes: d.perfNotes.map(esc), target: d.target ? esc(d.target) : null,
    ddLabel: esc(d.ddLabel), ddRaw: escLines(d.ddLines),
    liq: one(esc(d.liqShort) || "—"), liqFull: one(escLines(d.liqLines))
  };
  if (d.source) fund.note = one(esc(d.source));
  if (d.classes) fund.classes = d.classes;                  // share classes: fees and liquidity terms per class
  if (d.monthly && d.monthly.length) fund.monthly = d.monthly;   // numbers read from the monthly-returns picture, as corrected by the admin
  // words masked in the investor view (see R() in app.js); longest first so "HCRx" is matched before "HCR"
  fund.redact = [...new Set(String(hide).split(/[,，、;；]/).map(w => esc(w)).filter(w => w.length > 1))]
    .sort((x, y) => y.length - x.length)
    .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  // true = the list above is only the site's rule-based guess, so Claude's choice replaces it when the fund is translated;
  // false = the admin edited the list, so their words are kept and Claude's are added
  fund.redactAuto = !!hideUntouched;
  return fund;
}

fundForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!Auth.isAdmin()) return fail(t("errAdmin"));
  if (!Repo.hasToken() && !Local.on) return fail(t("ghNeedTokenHere"));   // nothing can be saved for everyone without it
  if (monthlyBusy) return fail(t("moWait"));
  const picked = [...imList.querySelectorAll(".im-item")].filter(el => el.querySelector(".im-on").checked);
  if (!picked.length || picked.some(el => !el.querySelector(".im-name").value.trim())) return fail(t("imNoneSel"));

  for (const el of picked) {                                   // the monthly tables as they stand in the text boxes
    const p = parseMonthlyText(el.querySelector(".im-motext").value);
    if (p.bad != null) return fail(t("moErrLine")(p.bad));
    drafts[+el.dataset.n].monthly = p.rows;
    const c = parseClassesText(el.querySelector(".im-cltext").value);
    if (c.bad != null) return fail(t("clErrLine")(c.bad));
    drafts[+el.dataset.n].classes = c.table;
  }

  let saved = true, lastTab = "";
  const added = [];
  picked.forEach(el => {
    const i = +el.dataset.n;
    lastTab = el.querySelector(".im-tab").value;
    const fund = fundFromDraft(drafts[i], i, el.querySelector(".im-name").value, el.querySelector(".im-mgr").value, el.querySelector(".im-hide").value,
      el.querySelector(".im-hide").value.trim() === el.querySelector(".im-hide").dataset.auto.trim());
    saved = FundStore.add(lastTab, fund) && saved;
    added.push(fund.id);
  });
  showFundModal(false);
  selectTab(lastTab);                                                               // show the strategy the funds went to
  applyLang();
  const sc = document.getElementById("scroller");
  sc.scrollTo({ left: sc.scrollWidth, behavior: "smooth" });                        // new funds are added at the end
  if (!saved) alert(t("errStorage"));
  // Saving and translating happen in js/repo.js: FundStore reports the change, the file is committed to GitHub,
  // and the "Translate funds" workflow fills in the other two languages.
});

/** Called from the Delete button inside an added fund's detail panel. */
function deleteFund(id) {
  if (needToken()) return;
  if (!Auth.isAdmin() || !confirm(t(String(id).startsWith("b-") ? "confirmDeleteBuiltIn" : "confirmDelete"))) return;
  FundStore.remove(id);
  closeD();
  applyLang();
}
