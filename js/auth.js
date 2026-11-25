/* ---------- Auth (demo, browser-only) ----------
   One small object so the rest of the site never touches credentials directly.
   To connect a real backend later, rewrite login()/logout() to call your API and keep the same return shapes. */
const Auth = (() => {
  const KEY = "jc-session";
  let current = null;
  try { current = JSON.parse(sessionStorage.getItem(KEY)); } catch (e) {}

  function save() {
    try {
      if (current) sessionStorage.setItem(KEY, JSON.stringify(current));
      else sessionStorage.removeItem(KEY);
    } catch (e) {}
  }

  return {
    /** Signed-in user ({username, role, name}) or null. The session ends when the browser tab closes. */
    user: () => current,
    isAdmin: () => !!current && current.role === "admin",

    /** Returns true on success, false on a wrong username or password. */
    login(username, password) {
      const u = CONFIG.DEMO_USERS.find(x => x.username.toLowerCase() === String(username).trim().toLowerCase() && x.password === password);
      if (!u) return false;
      current = { username: u.username, role: u.role, name: u.name };
      save();
      return true;
    },

    logout() { current = null; save(); }
  };
})();
