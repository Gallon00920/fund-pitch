/* ---------- Fund store ----------
   Strategies sit in two fixed categories: "liquid" (Liquid) and "closed" (Closed-End / Semi-Liquid).
   Built-in funds come from js/funds-data.js and fill the three built-in strategies of the Liquid category:
   "liquid" (Daily), "monthly" (Monthly) and "illiquid" (Quarterly).
   Everything admins change lives in ONE shared file in the repository, data/funds.json, so every visitor sees it:
     strategies  [ { id, name, group } ]     strategies admins added, in display order; group is "liquid" or "closed"
     funds       { strategyId: [fund, ...] } funds admins added
     hidden      [ fundId, ... ]             built-in funds admins deleted
     overrides   { fundId: { fund, strat } } edited built-in funds (js/funds-data.js itself is never changed)
     order       { strategyId: [fundId, ...] } card order admins set by dragging; funds not listed come after
     removed     [ built-in strategy id ]    built-in strategies admins deleted
     names       { built-in strategy id: name }      built-in strategies admins renamed
     stats       [ "130+", "40+", "9" ]      the three cover-page numbers, once an admin has edited them
     featured    [ fundId, ... ]             funds admins highlighted, in the order shown on the Focus List tab
   This file only holds that state in memory and rebuilds the live FUNDS list from it.
   Loading and saving the file is done by js/repo.js, which is told about every change through onChange(). */
const FundStore = (() => {
  const BUILT_IN = ["liquid", "monthly", "illiquid"];
  const clone = x => JSON.parse(JSON.stringify(x));
  const isBuiltInFund = id => String(id).startsWith("b-");

  // js/funds-data.js lists the built-in funds under "liquid" and "illiquid"; a fund's id comes from its place there and
  // never changes. A fund marked `home` then moves to that built-in strategy (PARS IV: monthly dealing) with its id.
  const LISTED = ["liquid", "illiquid"];
  LISTED.forEach(s => FUNDS[s].forEach((f, i) => { f.id = `b-${s}-${i}`; f.builtIn = true; }));       // stable ids for built-ins
  BUILT_IN.forEach(s => { FUNDS[s] = FUNDS[s] || []; });
  LISTED.forEach(s => { FUNDS[s] = FUNDS[s].filter(f => !(f.home && f.home !== s && FUNDS[f.home] && FUNDS[f.home].push(f))); });
  const ORIGINAL = clone(Object.fromEntries(BUILT_IN.map(s => [s, FUNDS[s]])));                      // pristine copy to rebuild from

  const empty = () => ({ strategies: [], funds: {}, hidden: [], overrides: {}, order: {}, removed: [], names: {}, featured: [] });
  const normalise = s => ({
    strategies: Array.isArray(s && s.strategies) ? s.strategies : [],
    funds: s && s.funds && typeof s.funds === "object" ? s.funds : {},
    hidden: Array.isArray(s && s.hidden) ? s.hidden : [],
    overrides: s && s.overrides && typeof s.overrides === "object" ? s.overrides : {},
    order: s && s.order && typeof s.order === "object" ? s.order : {},
    removed: Array.isArray(s && s.removed) ? s.removed.filter(id => BUILT_IN.includes(id)) : [],
    names: Object.fromEntries(BUILT_IN.filter(id => s && s.names && typeof s.names[id] === "string" && s.names[id]).map(id => [id, s.names[id].slice(0, 200)])),
    stats: Array.isArray(s && s.stats) && s.stats.length === 3 ? s.stats.map(x => String(x).slice(0, 12)) : null,
    featured: Array.isArray(s && s.featured) ? [...new Set(s.featured.map(String))] : []
  });
  let state = empty();
  let listener = () => {};

  const locate = id => {                                              // where a fund currently sits in the live list
    for (const strat of Object.keys(FUNDS)) {
      const index = FUNDS[strat].findIndex(f => f.id === id);
      if (index > -1) return { strat, index };
    }
    return null;
  };

  /** Rebuilds the live FUNDS list from the built-in funds plus the shared state. */
  function rebuild() {
    Object.keys(FUNDS).forEach(k => delete FUNDS[k]);
    BUILT_IN.forEach(s => { FUNDS[s] = clone(ORIGINAL[s]).filter(f => !state.hidden.includes(f.id)); });
    state.strategies.forEach(s => { FUNDS[s.id] = []; });
    Object.entries(state.overrides).forEach(([id, o]) => {
      const at = locate(id);
      if (!at || !o || !o.fund) return;
      if (o.strat === at.strat || !FUNDS[o.strat]) FUNDS[at.strat][at.index] = clone(o.fund);        // edited in place
      else { FUNDS[at.strat].splice(at.index, 1); FUNDS[o.strat].push(clone(o.fund)); }              // edited and moved
    });
    state.removed.forEach(id => { delete FUNDS[id]; });                                              // deleted built-in tabs, after funds edited out of them have moved
    Object.keys(state.funds).forEach(id => {
      if (FUNDS[id] && Array.isArray(state.funds[id])) FUNDS[id].push(...clone(state.funds[id]));    // funds of a deleted strategy are ignored
    });
    Object.entries(state.order).forEach(([strat, ids]) => {                                          // apply the dragged order
      if (!FUNDS[strat] || !Array.isArray(ids)) return;
      const rank = f => { const i = ids.indexOf(f.id); return i < 0 ? Infinity : i; };              // unlisted funds keep their place at the end
      FUNDS[strat] = FUNDS[strat].map((f, i) => ({ f, i })).sort((a, b) => rank(a.f) - rank(b.f) || a.i - b.i).map(x => x.f);
    });
  }
  const changed = () => { rebuild(); listener(); };

  return {
    /** The shared state as plain data (a copy). */
    getState: () => clone(state),
    /** Replaces the shared state, for example after loading data/funds.json. Does not trigger a save. */
    setState(s) { state = normalise(clone(s || {})); rebuild(); },
    /** Registers the function called after every change an admin makes (js/repo.js saves to GitHub there). */
    onChange(fn) { listener = fn; },

    /** All strategies in display order: the built-in ones (Liquid category), then the added ones. Each has `group`. */
    strategies: () => [
      ...BUILT_IN.filter(id => !state.removed.includes(id)).map(id => ({ id, builtIn: true, group: "liquid", name: state.names[id] || "" })),
      ...state.strategies.map(s => ({ ...s, group: s.group === "liquid" ? "liquid" : "closed" }))],
    isBuiltIn: id => BUILT_IN.includes(id),

    /** Creates a strategy in a category ("liquid" or "closed"). `name` must already be safe to insert as HTML. Returns it. */
    addStrategy(name, group) {
      const s = { id: "s-" + Date.now(), name, group: group === "liquid" ? "liquid" : "closed" };
      state.strategies.push(s);
      changed();
      return s;
    },
    /** Renames a strategy tab. `name` must already be safe to insert as HTML. A built-in tab given an empty name goes
        back to its original name, which is the only one shown in three languages. Returns false for an unknown tab. */
    renameStrategy(id, name) {
      if (BUILT_IN.includes(id)) { if (name) state.names[id] = name; else delete state.names[id]; }
      else {
        const s = state.strategies.find(x => x.id === id);
        if (!s || !name) return false;
        s.name = name;
      }
      changed();
      return true;
    },
    /** Removes a strategy tab together with the funds in it. */
    removeStrategy(id) {
      if (BUILT_IN.includes(id)) {
        if (!state.removed.includes(id)) state.removed.push(id);
        delete state.funds[id];                                                                      // funds admins added to it
        delete state.order[id];
        changed();
        return;
      }
      Object.entries(state.overrides).forEach(([fid, o]) => {                                        // built-ins moved here go too
        if (o && o.strat === id) { if (!state.hidden.includes(fid)) state.hidden.push(fid); delete state.overrides[fid]; }
      });
      state.strategies = state.strategies.filter(s => s.id !== id);
      delete state.funds[id];
      delete state.order[id];
      changed();
    },

    /** Finds a fund by id. Returns { fund, strat } or null. */
    find(id) {
      const at = locate(id);
      return at ? { fund: FUNDS[at.strat][at.index], strat: at.strat } : null;
    },

    /** Adds a fund under a strategy id. */
    add(strategyId, fund) {
      (state.funds[strategyId] = state.funds[strategyId] || []).push(fund);
      changed();
      return true;
    },

    /** Replaces a fund with an edited copy, optionally moving it to another strategy. Works for built-in and added funds. */
    update(id, fund, strategyId) {
      const at = locate(id);
      if (!at || !FUNDS[strategyId]) return false;
      fund.id = id;
      if (isBuiltInFund(id)) {
        fund.builtIn = true;
        state.overrides[id] = { fund, strat: strategyId };
      } else {
        const list = state.funds[at.strat] || [], i = list.findIndex(f => f.id === id);
        if (strategyId === at.strat && i > -1) list[i] = fund;
        else { if (i > -1) list.splice(i, 1); (state.funds[strategyId] = state.funds[strategyId] || []).push(fund); }
      }
      changed();
      return true;
    },

    /** Ids of the highlighted funds that are on the site, in Focus List order. */
    featured: () => state.featured.filter(id => locate(id)),
    isFeatured: id => state.featured.includes(id),
    /** Adds a fund to the Focus List (at the end) or takes it off. */
    toggleFeatured(id) {
      state.featured = state.featured.includes(id) ? state.featured.filter(x => x !== id) : [...state.featured.filter(x => locate(x)), id];
      changed();
    },
    /** Moves the Focus List card at position `from` to position `to`. */
    reorderFeatured(from, to) {
      const ids = state.featured.filter(id => locate(id));
      if (from < 0 || from >= ids.length || to < 0 || to >= ids.length || from === to) return false;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      state.featured = ids;
      changed();
      return true;
    },

    /** Deletes a fund. An added fund is removed for good; a built-in fund is hidden. */
    remove(id) {
      state.featured = state.featured.filter(x => x !== id);
      if (isBuiltInFund(id)) {
        if (!state.hidden.includes(id)) state.hidden.push(id);
        delete state.overrides[id];
      } else {
        Object.keys(state.funds).forEach(s => { state.funds[s] = state.funds[s].filter(f => f.id !== id); });
      }
      changed();
    },

    /** Moves the card at position `from` to position `to` within one strategy tab. */
    reorder(strategyId, from, to) {
      const ids = (FUNDS[strategyId] || []).map(f => f.id);
      if (from < 0 || from >= ids.length || to < 0 || to >= ids.length || from === to) return false;
      ids.splice(to, 0, ids.splice(from, 1)[0]);
      state.order[strategyId] = ids;
      changed();
      return true;
    },


    /** The three cover-page numbers as edited by an admin, or null when they are still the ones in index.html. */
    stats: () => (state.stats ? [...state.stats] : null),
    setStats(list) { state.stats = list.map(x => String(x).slice(0, 12)); changed(); },

    exportJSON: () => JSON.stringify(state, null, 2)
  };
})();
