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
| `js/fund-store.js` | Holds the shared state in memory and builds the fund list from it |
| `js/auth.js` | Login, logout and "who is signed in" |
| `js/app.js` | Cards, sliding, detail panel, language switch, top menu |
| `js/account.js` | Login screen and the account button |
| `js/pptx-reader.js` | Reads a `.pptx` deck in the browser and pulls out one draft fund per table column |
| `js/add-fund.js` | The Add Fund screen (deck upload and review) and Delete Fund |
| `js/edit-fund.js` | The Edit Fund form, the card Edit / Delete buttons and Restore original funds |
| `js/repo.js` | Saves admin changes to `data/funds.json` on GitHub, the GitHub token box, and the status banner |
| `data/funds.json` | The shared data: added strategies and funds, edits and deletions |
| `scripts/translate_funds.py` | Translates new funds with Claude; run by the workflow |
| `.github/workflows/translate-funds.yml` | The GitHub Actions workflow that runs the translation |
| `assets/junson-logo.png` | Logo |
| `index.standalone.html` | The earlier single-file version, kept as a backup. It has no login or Add Fund |

## Logging in

The demo accounts are in `js/config.js` (`DEMO_USERS`). There are two roles:

- **admin** can view the site, add funds and delete funds they added.
- **viewer** can only view the site.

Set `REQUIRE_LOGIN` in `js/config.js` to `false` to make the site public, with login used only to unlock Add Fund.

The session ends when the browser tab is closed.

## Strategies (tabs)

The site starts with two strategy tabs, **Liquid** and **Semi-Liquid / Private**. An admin can add more:

- Click **+ Add Strategy** at the end of the tab row, type a name and click Add.
- Or create one inside the Add Fund window while uploading a deck (see below).
- A strategy you added has a small **x** on its tab. Clicking it deletes the strategy and every fund in it, after a confirmation. The two starting tabs cannot be deleted.

Strategy names are shown as typed in all three languages. Investors see the tabs but cannot add or delete them.

## Editing and deleting funds

Signed in as admin, every fund card has two small buttons in its top right corner: a pencil (edit) and a bin (delete). The same two buttons are at the bottom of View Fund.

- **Edit** opens a form with everything on the card and in View Fund: name, strategy tab, manager, label, size, inception, description, returns, track record notes, drawdown text, liquidity terms, source note and the words hidden from investors. Changing the strategy moves the fund to that tab.
- **Returns** are one period per line: `2024: 12.5` for a full year, `2022 from 6: 15.62` for a part year starting in June, `2026 YTD 10: 4.78` for year to date through October.
- **Delete** removes the fund after a confirmation.
- The 7 original funds can be edited and deleted too. Their original versions are kept, and **Restore original funds** (shown under the cards once any original has been changed) brings them all back. Funds and strategies you added are not affected by a restore.
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
- This repository is public, so everything in `data/funds.json` is public too.
- Running the site locally uses the same repository file: a change made on `localhost` with a token is saved for everyone.

## Limits of this version

- **The login is a demo, not security.** The accounts sit in a file that every visitor's browser downloads, and all fund data is in public files. Do not rely on it to keep anything private. What actually protects the data from being changed is the GitHub token: only someone with a token can save.
- **Two admins at once.** If two admins save at the same moment, the site retries and keeps both admins' new funds, but two edits to the same fund follow whoever saved last.
- **Funds saved in a browser by earlier versions** of this site are no longer shown. Upload them again to share them.
