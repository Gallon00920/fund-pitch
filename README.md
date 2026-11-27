# Junson Capital Fund Platform (frontend)

A static website: plain HTML, CSS and JavaScript. There is no build step and nothing to install.

## Run it locally

Open this folder in your IDE, then start a local web server from the folder. Either of these works:

- **VS Code:** install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".
- **Python:** run the command below, then open http://localhost:5173

```
python -m http.server 5173
```

Double-clicking `index.html` also works, but a local server behaves more like a real site (saved logins and funds are kept per address).

## Files

| File | What it holds |
|---|---|
| `index.html` | Page structure: top bar, cover, fund section, footer, login screen, Add Fund form |
| `css/styles.css` | All styling. Brand colours and fonts are set once at the top |
| `js/config.js` | Settings and the demo login accounts |
| `js/i18n.js` | All wording in English, 简体 and 繁體 |
| `js/funds-data.js` | The built-in funds (the `FUNDS` list) |
| `js/fund-store.js` | Saves funds added through the form in the browser and merges them into `FUNDS` |
| `js/auth.js` | Login, logout and "who is signed in" |
| `js/app.js` | Cards, sliding, detail panel, language switch, top menu |
| `js/account.js` | Login screen and the account button |
| `js/add-fund.js` | The Add Fund form and Delete Fund |
| `assets/junson-logo.png` | Logo |
| `index.standalone.html` | The earlier single-file version, kept as a backup. It has no login or Add Fund |

## Logging in

The demo accounts are in `js/config.js` (`DEMO_USERS`). There are two roles:

**username: "admin",    password: "Junson-Admin-Demo1"
**username: "investor", password: "Junson-Viewer-Demo1"

Set `REQUIRE_LOGIN` in `js/config.js` to `false` to make the site public, with login used only to unlock Add Fund.

The session ends when the browser tab is closed.

## Adding a fund

1. Sign in with the admin account.
2. Click **+ Add Fund** in the top bar and fill in the form. Yearly returns go one per line, for example `2024: 12.5`.
3. The fund appears at the end of the tab you chose. Open it with View Fund to see all years, or to delete it.

Text typed into the form is shown as typed in all three languages.

## Limits of this version

- **The login is a demo, not security.** The accounts sit in a file that every visitor's browser downloads, and all fund data is in the page code. Do not rely on it to keep anything private.
- **Added funds stay in one browser.** They are stored in that browser's local storage, so other people and other devices do not see them, and clearing site data removes them. To make a fund permanent for everyone, copy it into `js/funds-data.js`. Running `FundStore.exportJSON()` in the browser console prints the saved funds in the right shape.
- Real accounts and shared funds need a backend (a server with a database). `js/auth.js` and `js/fund-store.js` are the only two files that would need to change to call one.
