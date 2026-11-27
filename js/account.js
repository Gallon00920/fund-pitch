/* ---------- Login screen + account button in the top bar ----------
   Depends on: CONFIG (config.js), Auth (auth.js), and t / lang / applyLang / closeD from app.js. */
const loginBox = document.getElementById("login"), loginForm = document.getElementById("loginForm");
const loginErr = document.getElementById("loginErr"), loginCancel = document.getElementById("loginCancel");
const acctBtn = document.getElementById("acctBtn"), addFundBtn = document.getElementById("addFundBtn");

/* The login screen fades in with its form rising a little, and fades out the same way. (The class "in" carries the
   visible state; `hidden` is only set once the fade-out has finished.) */
const stillMotion = matchMedia("(prefers-reduced-motion: reduce)");
let loginTimer = 0;
function showLogin(show) {
  clearTimeout(loginTimer);
  document.body.classList.toggle("modal-open", show || !document.getElementById("fundModal").hidden);
  loginCancel.hidden = CONFIG.REQUIRE_LOGIN;                 // a required login cannot be dismissed
  if (show) {
    loginErr.hidden = true; loginForm.reset();
    loginBox.hidden = false;
    void loginBox.offsetWidth;                               // let the browser register the starting state before the fade
    loginBox.classList.add("in");
    setTimeout(() => document.getElementById("loginUser").focus(), 50);
  } else {
    loginBox.classList.remove("in");
    if (stillMotion.matches || loginBox.hidden) loginBox.hidden = true;
    else loginTimer = setTimeout(() => { loginBox.hidden = true; }, 320);
  }
}

/* After signing in or out the page is redrawn (admin tools appear or disappear). `fadeFirst` fades the cards, tabs and
   top-bar buttons out before the redraw; either way they then fade and rise back in. */
let authTimer = 0;
function redrawForAccount(fadeFirst) {
  const redraw = () => { refreshAccount(); applyLang(); };
  clearTimeout(authTimer);
  document.body.classList.remove("auth-out", "auth-in");
  if (stillMotion.matches) return redraw();
  const comeIn = () => {
    redraw();
    document.body.classList.remove("auth-out");
    document.body.classList.add("auth-in");
    authTimer = setTimeout(() => document.body.classList.remove("auth-in"), 750);
  };
  if (!fadeFirst) return comeIn();
  document.body.classList.add("auth-out");
  authTimer = setTimeout(comeIn, 220);
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
  redrawForAccount(false);                                   // redraw behind the login screen so admin-only controls appear,
  showLogin(false);                                          // then let the screen fade away over the page coming in
});
loginCancel.onclick = () => showLogin(false);

acctBtn.onclick = () => {
  if (!Auth.user()) { showLogin(true); return; }
  Auth.logout();
  closeD();
  document.getElementById("drawer").innerHTML = "";          // drop the last opened fund so an admin's view never lingers in the page
  redrawForAccount(true);
};

// language links on the login screen (the top-bar menu is covered while it is open)
document.querySelectorAll(".login-lang button").forEach(b => b.onclick = () => {
  setLanguage(b.dataset.lang);
});

// app.js calls this at the end of every applyLang()
window.onLangChange = () => {
  document.querySelectorAll("[data-ph]").forEach(el => el.placeholder = t(el.dataset.ph));
  document.querySelectorAll(".login-lang button").forEach(b => b.classList.toggle("on", b.dataset.lang === lang));
  refreshAccount();
};
window.onLangChange();
