/* ---------- Fund store ----------
   Built-in funds come from js/funds-data.js. Funds added through the "Add Fund" form are kept in this
   browser's localStorage and merged into FUNDS here, before the page renders.
   They are NOT shared with other people or browsers. To make a fund permanent for everyone,
   copy it into js/funds-data.js (FundStore.exportJSON() in the browser console prints the saved funds). */
const FundStore = (() => {
  const KEY = "jc-custom-funds";

  function read() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      return { liquid: (d && d.liquid) || [], illiquid: (d && d.illiquid) || [] };
    } catch (e) { return { liquid: [], illiquid: [] }; }
  }
  function write(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (e) { return false; }
  }

  // merge saved funds into the live list once, at load
  const saved = read();
  FUNDS.liquid.push(...saved.liquid);
  FUNDS.illiquid.push(...saved.illiquid);

  return {
    /** Adds a fund to "liquid" or "illiquid". Returns false if the browser refused to save it. */
    add(tab, fund) {
      const d = read();
      d[tab].push(fund);
      const ok = write(d);
      FUNDS[tab].push(fund);
      return ok;
    },
    /** Removes a fund that was added through the form (built-in funds cannot be removed here). */
    remove(id) {
      const d = read();
      for (const tab of ["liquid", "illiquid"]) {
        d[tab] = d[tab].filter(f => f.id !== id);
        const i = FUNDS[tab].findIndex(f => f.id === id);
        if (i > -1) FUNDS[tab].splice(i, 1);
      }
      write(d);
    },
    exportJSON: () => JSON.stringify(read(), null, 2)
  };
})();
