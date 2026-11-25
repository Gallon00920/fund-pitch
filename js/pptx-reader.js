/* ---------- PPTX reader ----------
   Reads a fund screening deck (.pptx) in the browser, with no server and no library.
   Expected layout, as in the "基金筛选汇报" decks: each slide has ONE comparison table,
   one fund per column, and rows labelled 成立日期 / 基金规模 / 基金策略 / 表现 / 回撤·损失率 / 流动性.
   The first row of the table holds each fund's strategy label.

   PptxReader.read(file) resolves to an array of plain "draft" objects (raw, unescaped text).
   js/add-fund.js turns the drafts the admin accepts into fund cards. */
const PptxReader = (() => {

  /* ---- 1. unzip: a .pptx is a zip file; pull out the slide XML ---- */
  async function inflate(bytes) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  async function slideXml(buf) {
    const v = new DataView(buf), u8 = new Uint8Array(buf), dec = new TextDecoder("utf-8");
    let end = -1;                                              // "end of central directory" record, searched from the back
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) {
      if (v.getUint32(i, true) === 0x06054b50) { end = i; break; }
    }
    if (end < 0) throw new Error("not a zip file");
    const count = v.getUint16(end + 10, true);
    let p = v.getUint32(end + 16, true);
    const slides = [];
    for (let n = 0; n < count; n++) {
      if (v.getUint32(p, true) !== 0x02014b50) throw new Error("bad zip directory");
      const method = v.getUint16(p + 10, true), size = v.getUint32(p + 20, true);
      const nameLen = v.getUint16(p + 28, true), extraLen = v.getUint16(p + 30, true), commentLen = v.getUint16(p + 32, true);
      const local = v.getUint32(p + 42, true);
      const name = dec.decode(u8.subarray(p + 46, p + 46 + nameLen));
      const m = name.match(/^ppt\/slides\/slide(\d+)\.xml$/);
      if (m) {
        const start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
        const data = u8.subarray(start, start + size);
        const raw = method === 0 ? data : method === 8 ? await inflate(data) : null;
        if (raw) slides.push({ no: +m[1], xml: dec.decode(raw) });
      }
      p += 46 + nameLen + extraLen + commentLen;
    }
    return slides.sort((a, b) => a.no - b.no);
  }

  /* ---- 2. slide XML -> table rows and text boxes ---- */
  const kids = (el, tag) => [...el.getElementsByTagNameNS("*", tag)];
  // one entry per visible line: paragraphs, and manual line breaks (<a:br>) inside a paragraph
  const paraLines = el => kids(el, "p")
    .flatMap(p => kids(p, "*")
      .map(n => n.localName === "t" ? n.textContent : n.localName === "br" ? "\n" : "")
      .join("").split("\n"))
    .map(s => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  function parseSlide(xml) {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const tbl = kids(doc, "tbl")[0];
    const rows = tbl ? kids(tbl, "tr").map(tr => kids(tr, "tc").map(paraLines)) : [];
    const texts = kids(doc, "sp").map(sp => paraLines(sp).join(" ")).filter(Boolean);
    return { rows, texts };
  }

  /* ---- 3. text -> numbers ---- */
  const num = s => Number(String(s).replace("−", "-"));

  /** "$1.5bn", "US$9.61bn", "NAV $3,211M" -> size in US$ bn, or null when no dollar figure is found. */
  function parseMoney(s) {
    const m = s.match(/(?:US)?\$\s*([\d,]+(?:\.\d+)?)\s*(bn|billion|b|mn|million|m)\b/i);
    if (!m) return null;
    const v = parseFloat(m[1].replace(/,/g, ""));
    return /^b/i.test(m[2]) ? v : v / 1000;
  }

  /** Pulls yearly returns out of the performance cell. Everything it cannot read as a yearly return is kept as a note.
      Understands   "2023: +25.04%"   "2022 (6月起): +15.62%"   "2026 YTD (至10月): +4.78%"
      and inline    "净回报: 2023 +11.2%、2024 +10.7%、2025 +8.0%、Q1'26 +1.5%"                                   */
  function parsePerf(lines) {
    const byYear = new Map(), notes = [];
    let target = null;
    const add = (y, v, kind, month) => { if (isFinite(v)) byYear.set(y + (kind || ""), kind ? [y, v, kind, month] : [y, v]); };
    for (const line of lines) {
      const tm = line.match(/目标[^0-9%]{0,14}?(\d+(?:\.\d+)?\s*[-–~]\s*\d+(?:\.\d+)?\s*%|\d+(?:\.\d+)?\s*%)/);
      if (tm && !target) target = tm[1].replace(/\s/g, "");

      const one = line.match(/^((?:19|20)\d{2})\s*(?:\(\s*(\d{1,2})\s*月起\s*\)|YTD\s*\(\s*至\s*(\d{1,2})\s*月\s*\))?\s*[:：]\s*(.+)$/);
      if (one) {
        const v = one[4].trim().match(/^([+\-−]?\d+(?:\.\d+)?)\s*%$/);
        if (v) { add(one[1], num(v[1]), one[2] ? "p" : one[3] ? "ytd" : "", +(one[2] || one[3]) || undefined); continue; }
        if (/^(?:[—–\-]+|NA|N\/A)$/i.test(one[4].trim())) continue;          // "2019: —" means no data that year
      }
      const inline = [...line.matchAll(/((?:19|20)\d{2})\s*([+\-−]\d+(?:\.\d+)?)\s*%/g)];
      if (inline.length >= 2) {
        inline.forEach(x => add(x[1], num(x[2])));
        const q = line.match(/Q([1-4])\s*[‘’'′`]\s*(\d{2})\s*([+\-−]\d+(?:\.\d+)?)\s*%/);   // "Q1'26 +1.5%" = year to date through March 2026
        if (q) add("20" + q[2], num(q[3]), "ytd", q[1] * 3);
        continue;
      }
      notes.push(line);
    }
    const all = [...byYear.values()].sort((a, b) => a[0] - b[0] || (a[2] === "ytd") - (b[2] === "ytd"));
    return { all, notes, target };
  }

  /* ---- 4. one table -> one draft per column ---- */
  const ROWS = [                                    // which table row feeds which field (matched on the first column)
    ["inception", /成立|Inception/i],
    ["aum",       /规模|規模|AUM|Size/i],
    ["strategy",  /策略|Strategy/i],
    ["perf",      /表现|表現|业绩|業績|回报|回報|Performance|Return/i],
    ["dd",        /回撤|损失|損失|Drawdown|Loss/i],
    ["liq",       /流动性|流動性|赎回|贖回|Liquidity|Redemption/i]
  ];

  function draftsFromSlide(slide) {
    const { rows, texts } = parseSlide(slide.xml);
    if (rows.length < 2 || rows[0].length < 2) return [];
    const field = {};
    rows.slice(1).forEach(r => {
      const label = (r[0] || []).join(" ");
      const hit = ROWS.find(([key, re]) => !field[key] && re.test(label));
      if (hit) field[hit[0]] = { label, cells: r.slice(1) };
    });
    if (!field.strategy && !field.perf) return [];                // not a fund comparison table

    const title = texts[0] || "";
    const source = texts.find(x => /^(来源|來源|Source)/i.test(x)) || "";
    // fund names are not in the table; the source line usually lists one "<name> deck" per column, in order
    const names = [...source.matchAll(/(?:^(?:来源|來源|Source)\s*[:：]\s*|[；;]\s*)([A-Za-z][\w&.\- ]*?)\s+deck\b/gi)].map(m => m[1].trim());
    const cols = rows[0].length - 1;
    const cell = (key, c) => (field[key] && field[key].cells[c]) || [];

    return Array.from({ length: cols }, (_, c) => {
      const inc = cell("inception", c), aumLines = cell("aum", c), liq = cell("liq", c), dd = cell("dd", c);
      const perf = parsePerf(cell("perf", c));
      const incText = inc.join(" ");
      const im = incText.match(/^\s*((?:19|20)\d{2})\s*[\/\-.年]\s*(\d{1,2})/);
      const liqText = liq.join(" ");
      const first = liqText.split(/[；;，,。]/)[0].trim();
      // header cell: first line = fund name, remaining lines = strategy label. With a single line, it is the label
      // and the name falls back to the source line.
      const head = rows[0][c + 1] || [];
      const name = head.length > 1 ? head[0] : names.length === cols ? names[c] : "";
      const words = name.split(" ");
      return {
        slide: slide.no, slideTitle: title,
        tag: (head.length > 1 ? head.slice(1) : head).join(" ") || `Fund ${c + 1}`,
        name, mgr: /^group$/i.test(words[1] || "") ? words.slice(0, 2).join(" ") : words[0] || "",
        vehicle: /UCITS/i.test(title) ? "UCITS" : "private",
        liquid: /^(每日|Daily)/i.test(liqText),                   // daily dealing goes to the Liquid tab by default
        inception: im ? `${im[1]}-${String(im[2]).padStart(2, "0")}` : null,
        inceptionLines: inc, isNew: /新发|新發|new fund/i.test(incText),
        aum: parseMoney(aumLines.join(" ")), aumText: aumLines.join(" "),
        strategyLines: cell("strategy", c),
        perf: perf.all, perfNotes: perf.notes, target: perf.target,
        ddLabel: field.dd ? field.dd.label : "", ddLines: dd.filter(x => !/^(NA|N\/A|—|-)$/i.test(x)),
        liqShort: first.length > 26 ? first.slice(0, 25) + "…" : first, liqLines: liq,
        source
      };
    });
  }

  return {
    /** Reads a File chosen by the user. Rejects if it is not a .pptx; resolves to [] if no fund table is found. */
    async read(file) {
      const slides = await slideXml(await file.arrayBuffer());
      if (!slides.length) throw new Error("no slides");
      return slides.flatMap(draftsFromSlide);
    }
  };
})();
