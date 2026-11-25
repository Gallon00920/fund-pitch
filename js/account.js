/* ---------- Login screen + account button in the top bar ----------
   Depends on: CONFIG (config.js), Auth (auth.js), and t / lang / applyLang / closeD from app.js. */
const loginBox = document.getElementById("login"), loginForm = document.getElementById("loginForm");
const loginErr = document.getElementById("loginErr"), loginCancel = document.getElementById("loginCancel");
const acctBtn = document.getElementById("acctBtn"), addFundBtn = document.getElementById("addFundBtn");

function showLogin(show) {
  loginBox.hidden = !show;
  document.body.classList.toggle("modal-open", show || !document.getElementById("fundModal").hidden);
  loginCancel.hidden = CONFIG.REQUIRE_LOGIN;                 // a required login cannot be dismissed
  if (show) { loginErr.hidden = true; loginForm.reset(); setTimeout(() => document.getElementById("loginUser").focus(), 50); }
}

/** Updates everything that depends on who is signed in. Called after login, logout and language changes. */
function refreshAccount() {
  const u = Auth.user();
  acctBtn.textContent = u ? `${u.name} · ${t("logout")}` : t("loginBtn");
  addFundBtn.hidden = !Auth.isAdmin();
  if (CONFIG.REQUIRE_LOGIN && !u) showLogin(true);
}

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const ok = Auth.login(document.getElementById("loginUser").value, document.getElementById("loginPass").value);
  if (!ok) { loginErr.textContent = t("loginErr"); loginErr.hidden = false; return; }
  showLogin(false);
  refreshAccount();
  applyLang();                                               // re-render so admin-only controls appear
});
loginCancel.onclick = () => showLogin(false);

acctBtn.onclick = () => {
  if (!Auth.user()) { showLogin(true); return; }
  Auth.logout();
  closeD();
  document.getElementById("drawer").innerHTML = "";          // drop the last opened fund so an admin's view never lingers in the page
  refreshAccount();
  applyLang();
};

// language links on the login screen (the top-bar menu is covered while it is open)
document.querySelectorAll(".login-lang button").forEach(b => b.onclick = () => {
  lang = b.dataset.lang;
  try { localStorage.setItem("jc-lang", lang); } catch (e) {}
  applyLang();
});

// app.js calls this at the end of every applyLang()
window.onLangChange = () => {
  document.querySelectorAll("[data-ph]").forEach(el => el.placeholder = t(el.dataset.ph));
  document.querySelectorAll(".login-lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
  refreshAccount();
};
window.onLangChange();
