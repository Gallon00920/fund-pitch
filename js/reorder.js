/* ---------- Drag a card to change the order of funds (admin only) ----------
   Each card has a grip button (six dots) in its top right corner. Press it and drag left or right; the other cards
   slide out of the way, and the row scrolls by itself near its edges. Releasing saves the new order for the open
   strategy tab through FundStore.reorder(), which is shared with everyone like any other change.
   Depends on: Auth, FundStore, needToken (repo.js), and tab / applyLang from app.js. */
(() => {
  const row = document.getElementById("track"), box = document.getElementById("scroller");
  let drag = null, scrollLoop = 0;

  // card centres are measured in the row's own coordinates, so they stay valid while the row scrolls
  const contentX = clientX => clientX + box.scrollLeft;

  row.addEventListener("pointerdown", e => {
    const grip = e.target.closest("[data-grip]");
    if (!grip || e.button > 0 || !Auth.isAdmin()) return;
    e.preventDefault();
    if (needToken()) return;
    const cards = [...row.querySelectorAll(".card")], card = grip.closest(".card"), from = cards.indexOf(card);
    if (cards.length < 2 || from < 0) return;
    const rects = cards.map(c => c.getBoundingClientRect());
    drag = {
      grip, card, cards, from, to: from, pointerId: e.pointerId,
      startX: contentX(e.clientX), lastClientX: e.clientX,
      centres: rects.map(r => r.left + r.width / 2 + box.scrollLeft),
      step: cards.length > 1 ? rects[1].left - rects[0].left : rects[0].width      // card width plus the gap
    };
    grip.setPointerCapture(e.pointerId);
    box.classList.add("reordering");
    card.classList.add("moving");
    autoScroll();
  });

  function place() {
    const dx = contentX(drag.lastClientX) - drag.startX;
    const centre = drag.centres[drag.from] + dx;
    // the new position is the number of other cards whose centre lies to the left of the dragged card's centre
    drag.to = drag.centres.filter((c, i) => i !== drag.from && c < centre).length;
    drag.cards.forEach((c, i) => {
      if (i === drag.from) c.style.transform = `translateX(${dx}px)`;
      else if (i > drag.from && i <= drag.to) c.style.transform = `translateX(${-drag.step}px)`;
      else if (i < drag.from && i >= drag.to) c.style.transform = `translateX(${drag.step}px)`;
      else c.style.transform = "";
    });
  }

  function autoScroll() {                                   // scroll the row while the pointer is held near either edge
    cancelAnimationFrame(scrollLoop);
    if (!drag) return;
    const r = box.getBoundingClientRect(), edge = 70, x = drag.lastClientX;
    const speed = x < r.left + edge ? -Math.min(18, (r.left + edge - x) / 4) : x > r.right - edge ? Math.min(18, (x - (r.right - edge)) / 4) : 0;
    if (speed) { box.scrollLeft += speed; place(); }
    scrollLoop = requestAnimationFrame(autoScroll);
  }

  row.addEventListener("pointermove", e => {
    if (!drag || e.pointerId !== drag.pointerId) return;
    drag.lastClientX = e.clientX;
    place();
  });

  function finish(commit) {
    if (!drag) return;
    const { from, to, cards, card } = drag;
    cancelAnimationFrame(scrollLoop);
    cards.forEach(c => { c.style.transform = ""; });
    card.classList.remove("moving");
    box.classList.remove("reordering");
    drag = null;
    if (commit && to !== from) {
      const keep = box.scrollLeft;
      if (tab === FOCUS) FundStore.reorderFeatured(from, to); else FundStore.reorder(tab, from, to);   // the Focus List has its own order
      applyLang();
      box.scrollLeft = keep;
    }
  }
  row.addEventListener("pointerup", e => { if (drag && e.pointerId === drag.pointerId) finish(true); });
  row.addEventListener("pointercancel", () => finish(false));
  addEventListener("keydown", e => { if (e.key === "Escape") finish(false); });
})();
