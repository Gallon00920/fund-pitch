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
  .map(s => `<option value="${s.id}"${s.id === selected ? " selected" : ""}>${stratName(s)}</option>`).join("");

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
fundModal.addEventListener("dragenter", e => { if (!hasFiles(e)) return; e.preventDefault(); dragDepth++; dropZone.classList.add("drag"); });
fundModal.addEventListener("dragover", e => { if (!hasFiles(e)) return; e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
fundModal.addEventListener("dragleave", e => { if (!hasFiles(e)) return; if (--dragDepth <= 0) { dragDepth = 0; dropZone.classList.remove("drag"); } });
fundModal.addEventListener("drop", e => {
  if (!hasFiles(e)) return;
  e.preventDefault();                                        // otherwise the browser would open or download the file
  dragDepth = 0; dropZone.classList.remove("drag");
  const file = e.dataTransfer.files[0];
  fundFile.value = "";                                       // the picker no longer matches what is loaded
  if (file && !/\.pptx$/i.test(file.name)) { imList.innerHTML = ""; imStatus.textContent = ""; imSubmit.hidden = true; drafts = []; return fail(t("imBad")); }
  importDeck(file);
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
    hist: d.perf.slice(0, -9),                                // the card shows the latest 9 periods; older years appear in View Fund only
    perf: d.perf.slice(-9),
    perfNotes: d.perfNotes.map(esc), target: d.target ? esc(d.target) : null,
    ddLabel: esc(d.ddLabel), ddRaw: escLines(d.ddLines),
    liq: one(esc(d.liqShort) || "—"), liqFull: one(escLines(d.liqLines))
  };
  if (d.source) fund.note = one(esc(d.source));
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
  const picked = [...imList.querySelectorAll(".im-item")].filter(el => el.querySelector(".im-on").checked);
  if (!picked.length || picked.some(el => !el.querySelector(".im-name").value.trim())) return fail(t("imNoneSel"));

  let saved = true, lastTab = "illiquid";
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
