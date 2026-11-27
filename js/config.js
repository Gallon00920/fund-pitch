/* ---------- Local demo configuration ----------
   DEMO ONLY. These accounts live in the browser so the login flow can be tested without a server.
   Anyone who opens this file can read them, so never put real passwords here.
   For a real site, delete DEMO_USERS and make Auth.login() in js/auth.js call your backend instead. */
const CONFIG = {
  // true  = visitors must sign in before they can see the site
  // false = the site is public; signing in only unlocks admin tools (Add Fund)
  REQUIRE_LOGIN: false,

  // The GitHub repository that holds the shared fund data. Admin changes are committed to `path` on `branch`.
  REPO: { owner: "Gallon00920", name: "fund-pitch", branch: "main", path: "data/funds.json" },

  DEMO_USERS: [
    { username: "admin",    password: "AID2026!",            role: "admin",  name: "Admin" },     // can add and delete funds
    { username: "investor", password: "Junson-Viewer-Demo1", role: "viewer", name: "Investor" }   // can only view
  ]
};
