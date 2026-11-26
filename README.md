# Junson Capital Fund Platform (frontend)

A static website: plain HTML, CSS and JavaScript. There is no build step and nothing to install.

## Public Link
https://Gallon00920.github.io/fund-pitch

## Run it locally

Open this folder in your IDE, then start the local server from the folder and open http://localhost:5173

**With translation** (funds are translated the moment you upload them). Set your Claude key in the terminal first:

```
$env:ANTHROPIC_API_KEY = "your-key"; python server.py
```

**Without translation** (the site works; funds stay in the deck's language):

```
python server.py
```

`server.py` serves the files and adds three things for the site on this computer only: it translates each new fund with Claude as you upload it, it saves your changes to `data/funds.json` in this folder, and it always serves the newest files. It needs the Anthropic SDK for translation (`pip install anthropic`, once).

- The key lives only in that terminal. It is not written to any file and never reaches the browser. Closing the terminal forgets it.
- Changes you make locally are on this computer only. To publish them, commit and push `data/funds.json`.
- If you save a GitHub token in the site while running locally, changes are translated locally and then saved to GitHub for everyone, the same as on the live site.
- A plain file server (`python -m http.server 5173`, or VS Code Live Server) still shows the site, but cannot translate or save without a GitHub token.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page structure: top bar, cover, fund section, footer, login screen, Add Fund form |
| `css/styles.css` | All styling. Brand colours and fonts are set once at the top |
| `js/config.js` | Settings and the demo login accounts |
| `js/i18n.js` | All wording in English, 简体 and 繁體 |
| `js/funds-data.js` | The built-in funds (the `FUNDS` list) |
| `js/fund-store.js` | Holds the shared state in memory and builds the fund list from it |
| `js/auth.js` | Login, logout and "who is signed in" |
| `js/app.js` | Cards, sliding, detail panel, language switch, top menu |
| `js/account.js` | Login screen and the account button |
| `js/pptx-reader.js` | Reads a `.pptx` deck in the browser and pulls out one draft fund per table column |
| `js/add-fund.js` | The Add Fund screen (deck upload and review) and Delete Fund |
| `js/edit-fund.js` | The Edit Fund form, and the card Edit / Delete buttons |
| `js/reorder.js` | Drag a card by its grip to change the order of funds in a tab |
| `js/repo.js` | Saves admin changes to `data/funds.json` on GitHub, the GitHub token box, and the status banner |
| `server.py` | Local server: serves the site, translates uploads with Claude, reads table pictures and saves `data/funds.json` on this computer |
| `scripts/picture_tables.py` | Reads a picture of a monthly-returns or share-class table with Claude; used by `server.py` |
| `data/funds.json` | The shared data: added strategies and funds, edits and deletions |
| `scripts/translate_funds.py` | Translates new funds with Claude; run by the workflow |
| `.github/workflows/translate-funds.yml` | The GitHub Actions workflow that runs the translation |
| `assets/junson-logo.png` | Logo |
| `index.standalone.html` | The earlier single-file version, kept as a backup. It has no login or Add Fund |

## Logging in

The demo accounts are in `js/config.js` (`DEMO_USERS`). There are two roles:

- **admin** can view the site, add funds and delete funds they added.
- **viewer** can only view the site.

`REQUIRE_LOGIN` in `js/config.js` is `false`: the site opens straight into the investor view, and "Admin Login" in the top-right corner unlocks the admin tools. Logging out returns to the investor view. Set it to `true` to make every visitor sign in first.

The session ends when the browser tab is closed.

## Strategies (tabs)

The site starts with two strategy tabs, **Liquid** and **Semi-Liquid / Private**. An admin can add more:

- Click **+ Add Strategy** at the end of the tab row, type a name and click Add.
- Or create one inside the Add Fund window while uploading a deck (see below).
- Every tab has a small **x**. Clicking it deletes the strategy and every fund in it, after a confirmation. This applies to the two starting tabs as well, and there is no undo on the site.

- **Rename:** each tab has a small pencil. Click it, type the new name and click Save (Esc cancels). A renamed
  starting tab shows your name in all three languages; saving an empty name brings back its
  original translated name.

Strategy names are shown as typed in all three languages. Investors see the tabs but cannot add or delete them.

## Editing and deleting funds

Signed in as admin, every fund card has two small buttons in its top right corner: a pencil (edit) and a bin (delete). The same two buttons are at the bottom of View Fund.

- **Edit** opens a form with everything on the card and in View Fund: name, strategy tab, manager, label, size, inception, description, returns, track record notes, drawdown text, liquidity terms, source note and the words hidden from investors. Changing the strategy moves the fund to that tab.
- **Returns** are one period per line: `2024: 12.5` for a full year, `2022 from 6: 15.62` for a part year starting in June, `2026 YTD 10: 4.78` for year to date through October.
- **Delete** removes the fund after a confirmation.
- **Reorder:** each card also has a grip button (six dots) next to the pencil. Press it and drag the card left or right; the other cards slide aside and the row scrolls near its edges. Letting go saves the new order for that strategy tab, for everyone. Press Esc while dragging to cancel. A tab with one fund shows no grip.
- The 7 original funds can be edited and deleted too. There is no undo on the site: to bring back an original fund, an original tab, or its original text, remove its entry from `hidden`, `removed` or `overrides` in `data/funds.json`.
- For an original fund, an edit changes the text in the language you are viewing; the other two languages keep their text. Numbers apply to all languages.

## Adding funds from a deck

1. Sign in with the admin account.
2. Click **+ Add Fund** in the top bar and choose a fund screening deck (`.pptx`).
3. The site reads the deck in the browser and lists one fund per table column. For each fund, check the name, manager, strategy and the words to hide from investors, then click **Add Selected Funds**. To put the funds under a strategy that does not exist yet, type its name in "Or put these funds under a new strategy" and click Create.
4. The funds appear at the end of the strategy tab you chose. Open one with View Fund to see everything, or to delete it.

**Deck layout the reader expects** (the layout of the "基金筛选汇报" decks):

- One comparison table per slide, one fund per column.
- First row: each fund's name on the first line and its strategy label on the second.
- Rows labelled 成立日期, 基金规模, 基金策略, 年度表现 / Vintage 表现, 最大回撤 / 损失率, 流动性 (English labels such as Inception, AUM, Strategy, Performance, Drawdown, Liquidity also work).
- Yearly returns written as `2023: +25.04%`, one per line, or inline as `2023 +11.2%、2024 +10.7%`.

A fund with no yearly returns (for example a new drawdown fund) gets a card that shows its track record text and target return instead of the chart.

Deck text is shown as written, in all three languages. Nothing is uploaded: the file is read on your own computer.

## Shared data and automatic translation (GitHub Actions)

Everything admins change (added funds, strategies, edits, deletions) is saved in one file in this repository, `data/funds.json`, so every visitor sees the same site. There is no separate server.

**How a change travels**

1. An admin makes a change on the site. The site commits `data/funds.json` to this repository through the GitHub API, using the admin's GitHub token.
2. That commit starts the **Translate funds** workflow (`.github/workflows/translate-funds.yml`).
3. The workflow runs `scripts/translate_funds.py`, which sends each new fund's text to Claude and writes it back in English, 简体 and 繁體. The Claude key comes from the `ANTHROPIC_API_KEY` repository secret and never reaches the website.
4. The workflow commits the result. GitHub Pages republishes, and every visitor gets the update.

The admin's own page shows the change at once, then updates by itself when the translation is done.

**One-time setup**

1. **Claude key as a repository secret.** On GitHub open the repository, then Settings > Secrets and variables > Actions > New repository secret. Name it `ANTHROPIC_API_KEY` and paste the key as the value.
2. **A GitHub token for each admin.** On GitHub open Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token. Under Repository access choose "Only select repositories" and pick this repository. Under Permissions set **Contents: Read and write**.
3. **Give the token to the site.** Sign in as admin, click **+ Add Fund**, open **Save for everyone (GitHub token)**, paste the token and click **Save Token**.

**Things to know**

- Without a token, an admin can look around but cannot add, edit or delete anything.
- The token is kept in the browser where it was saved and sent only to `api.github.com`. Click **Remove Token** on a shared computer. It can only touch this one repository.
- Other visitors see a change after GitHub Pages republishes, usually within a couple of minutes.
- A fund whose translation failed stays in the deck's language. Open the repository's Actions tab to see why. **Translate** at the bottom of View Fund asks the workflow to try again; **Translate Again** re-translates from the language on screen.
- Fund names, manager names, numbers and strategy tab names are not translated.
- **Claude also decides what to hide from investors.** In the same request that translates a fund, Claude lists the words that would identify the fund or its manager (their names and abbreviations, sister funds, platforms, people). That list becomes the fund's "Words hidden from investors". The list shown in the upload window is only a first guess by simple rules; if you edit it there, your words are kept and Claude's are added. You can change the final list at any time in Edit Fund.
- This repository is public, so everything in `data/funds.json` is public too.
- Running the site locally with a token saved also writes to the repository: that change is live for everyone. Without a token, local changes stay in the local `data/funds.json`.

## Limits of this version

- **The login is a demo, not security.** The accounts sit in a file that every visitor's browser downloads, and all fund data is in public files. Do not rely on it to keep anything private. What actually protects the data from being changed is the GitHub token: only someone with a token can save.
- **Two admins at once.** If two admins save at the same moment, the site retries and keeps both admins' new funds, but two edits to the same fund follow whoever saved last.
- **Funds saved in a browser by earlier versions** of this site are no longer shown. Upload them again to share them.

## Tables from a picture: monthly returns and share classes

A fund can carry two extra tables. Both are filled the same way, in **Add Fund** or **Edit**: give the picture box a
picture from the manager's document (PNG, JPEG, WebP or GIF, under 4.5 MB). Click the box to choose a file, drag a
picture onto it, or paste a copied screenshot with Ctrl+V. In Edit the picture can be dropped anywhere on the window;
in Add Fund, drop it on the fund it belongs to.

The local server sends the picture to Claude (`scripts/picture_tables.py`). Claude decides which table it is and
returns the table only: no fund name, manager name or footnotes. The picture itself is never saved.

- **Monthly returns** (a row per year, Jan to Dec and the year total). In **View Fund**, a small preview under
  Calendar-Year Performance opens the full table, with **Download CSV**.
- **Share classes** (a row per class or series: management fee, performance fee, lock-up, gate, minimum size and so
  on). In **View Fund** this table is shown under "Share Classes: Fees & Liquidity" and replaces the liquidity terms
  text. A fund without the table keeps the text.

Things to know:

- Reading a picture needs `python server.py` with `ANTHROPIC_API_KEY` set. The published site cannot read pictures,
  because it has no server holding the key; add the picture locally, then commit and push `data/funds.json`.
- **Both tables can be edited by hand.** After a picture is read, the table appears in a text box. In **Edit** both
  boxes are always shown, so a table can also be typed or pasted from Excel without a picture; that needs no Claude
  key and works on the published site too. Emptying a box removes that table.
  - Monthly returns: one year per line, the year, Jan to Dec, then the year total, with `-` for an empty cell.
  - Share classes: the column titles on the first line, then one class per line, with `|` between the cells.
- Admins see a warning on any year whose twelve months do not compound to the printed year total. Check those years
  against the picture.
- Share-class text is shown as written in all three languages; it is not translated automatically. A built-in fund
  can hold one table per language in `js/funds-data.js` (see TPG AG MVP).
