/* ---------- helpers ---------- */
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let lang="en", tab="liquid";
try{ const s=localStorage.getItem("jc-lang"); if(UI[s]) lang=s }catch(e){}
const t=k=>UI[lang][k];
const L=o=>o?(o[lang]||o.en):"";
const zh=()=>lang!=="en";
// Free-text fields of added funds hold either one text (shown in every language) or, once translated, { en, sc, tc }.
const LX=v=>v&&typeof v==="object"&&!Array.isArray(v)?(v[lang]||v.en||""):v||"";
/* Inception is held two ways: `inception` ("YYYY-MM", from the Inception month field) and optional free text.
   The month is the authority when it is set. Without it, a year at the start of the text is used, so
   "2025 (first year)" still puts 2025 on the card. */
const LEAD_DATE=/^\s*((?:19|20)\d{2})(?:\s*[\/\-.年]\s*\d{1,2}\s*月?)?\s*/;
const incYear=f=>{
  if(f.inception) return f.inception.slice(0,4);
  const texts=f.inceptionText&&typeof f.inceptionText==="object"?[LX(f.inceptionText),...Object.values(f.inceptionText)]:[f.inceptionText];
  for(const x of texts){const m=String(x||"").match(LEAD_DATE); if(m) return m[1]}
  return "";
};
/** Inception as shown in View Fund: the month first, then the free text without its own leading date. */
function incShown(f){
  const text=LX(f.inceptionText);
  if(!f.inception) return text?R(f,text):"—";
  const rest=text.replace(LEAD_DATE,"");
  return ym(f.inception)+(rest?(/^[(（;；,，]/.test(rest)?" ":"<br>")+R(f,rest):"");
}
const notesOf=f=>Array.isArray(f.perfNotes)?f.perfNotes:(f.perfNotes&&(f.perfNotes[lang]||f.perfNotes.en))||[];
const fmt=v=>(v>0?"+":v<0?"−":"")+Math.abs(v).toFixed(2)+"%";
const ym=s=>{const [y,m]=s.split("-");return zh()?`${y}年${+m}月`:`${MON[m-1]} ${y}`};
const money=bn=>zh()?`${+(bn*10).toFixed(1)}亿美元`.replace("亿",lang==="tc"?"億":"亿"):`US$${bn.toFixed(bn<10?2:1)}bn`;
const perLabel=([y,,k,m])=>k==="ytd"?(zh()?`${y} YTD (至${m}月)`:`${y} YTD (to ${MON[m-1]})`):k==="p"?(zh()?`${y} (${m}月起)`:`${y} (from ${MON[m-1]})`):y;
const ann=p=>{const f=p.filter(x=>!x[2]);if(!f.length)return null;return(Math.pow(f.reduce((a,x)=>a*(1+x[1]/100),1),1/f.length)-1)*100};
/* Yearly returns shown on the card: the latest 15 periods. A fund with `cardFrom` (a year) keeps everything before that
   year off the card, because those rows are a predecessor or composite record and not the fund's own. */
const CARD_BARS=15;
const cardPerf=f=>{const all=[...(f.hist||[]),...f.perf];return(f.cardFrom?all.filter(p=>p[0]>=f.cardFrom):all).slice(-CARD_BARS)};
const liqTxt=f=>f.liq?L(f.liq):t("daily");
const veh=f=>f.vehicle==="private"?t("private"):f.vehicle;
// text typed by an admin or read from a deck is inserted into the page as HTML, so neutralise any markup first
const esc=s=>String(s==null?"":s).trim().replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
/* Investors (anyone who is not an admin) never see the real fund or manager name:
   the strategy label is shown as the fund's title instead. Admins see everything. */
const anon=()=>!Auth.isAdmin();
const title=f=>anon()?L(f.tag):f.name;
/* Deck-imported text can mention the fund or manager by name. For investors, mask the words the admin typed as the
   fund name and manager. This is best-effort: other names in the deck text (sister funds, vintages) are not caught. */
const R=(f,s)=>anon()&&f.redact&&f.redact.length&&s?s.replace(new RegExp(f.redact.join("|"),"gi"),"●●●"):s;
const trackHTML=f=>`<div class="trk"><div class="mini-label"><span>${t("trackRecord")}</span></div><ul>${notesOf(f).slice(0,6).map(x=>`<li>${R(f,x)}</li>`).join("")||"<li>—</li>"}</ul></div>`;

function ddText(f){                                     // max drawdown as a plain sentence, same style as other drawer text
  const d=f.dd, z=zh(), c=z?"：":": ", sep=z?"；":". ", end=z?"。":".";
  const wm=d.wm?`${d.since2020?t("wm20"):t("wm")}${c}${ym(d.wm[1])}${z?" ":", "}${fmt(d.wm[0])}`:"";   // funds added by form may have no worst month
  const wy=d.wy===false?"":d.wy?`${t("wy")}${c}${d.wy[1]}${z?"年 ":", "}${fmt(d.wy[0])}`:t("noNeg");      // wy:false = leave the worst-year sentence out
  return [wm,wy].filter(Boolean).join(sep)+end+(d.extra?(z?"":" ")+L(d.extra):"");
}

const track=document.getElementById("track"), prog=document.getElementById("prog");

function cardHTML(f,i){
  const P=cardPerf(f), has=P.length>0;                               // deck-imported funds may have no yearly returns
  const max=has?Math.max(...P.map(x=>Math.abs(x[1])))||1:1;
  const bars=P.map(p=>`<div class="bar ${p[2]==="ytd"?"ytd":""}" data-v="${perLabel(p)}: ${fmt(p[1])}"><i class="${p[1]>=0?"p":"n"}" style="height:0" data-h="${Math.abs(p[1])/max*50}%"></i><em>${p[2]==="ytd"?"YTD":"'"+p[0].slice(2)}</em></div>`).join("");
  const a=has?ann(P):null, last=P.at(-1);
  return `<article class="card">
    <div class="card-top${Auth.isAdmin()?" has-tools":""}">${Auth.isAdmin()?`<div class="card-tools">
        ${FUNDS[tab].length>1?`<button class="tool grip" data-grip title="${t("reorder")}" aria-label="${t("reorder")}"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="5" r="1.9"/><circle cx="16" cy="5" r="1.9"/><circle cx="8" cy="12" r="1.9"/><circle cx="16" cy="12" r="1.9"/><circle cx="8" cy="19" r="1.9"/><circle cx="16" cy="19" r="1.9"/></svg></button>`:""}
        <button class="tool" data-edit="${f.id}" title="${t("edit")}" aria-label="${t("edit")}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/></svg></button>
        <button class="tool del" data-delfund="${f.id}" title="${t("del")}" aria-label="${t("del")}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg></button>
      </div>`:""}${anon()?"":`<span class="tag">${L(f.tag)}</span>`}<h3>${title(f)}</h3>${anon()?"":`<div class="mgr">${L(f.mgr)} · ${veh(f)}</div>`}</div>
    <div class="kpis">
      <div>${f.aum!=null?`<b>${money(f.aum)}</b>`:`<b class="txt">${LX(f.aumText)||"—"}</b>`}<span>${t("aum")}</span></div>
      <div><b>${incYear(f)||(f.isNew?t("newFund"):"—")}</b><span>${t("inception")}</span></div>
      <div><b>${a!==null?fmt(a):LX(f.target)||"—"}</b><span>${a===null&&LX(f.target)?t("target"):t("ann")}</span></div>
    </div>
    <div class="liq-row${/^(daily|每日)$/i.test(liqTxt(f))?"":" semi"}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11a8 8 0 0 0-14.6-3.5M4 4v4h4M4 13a8 8 0 0 0 14.6 3.5M20 20v-4h-4"/></svg>
      <div><span>${t("liqLabel")}</span><b>${liqTxt(f)}</b></div>
    </div>
    <div class="card-body">
      <p class="strategy">${R(f,L(f.strategy))}</p>
      ${has?`<div class="mini-label"><span>${t("annual")}</span><span>${fmt(last[1])} ${perLabel(last)}</span></div>
      <div class="bars">${bars}</div>
      <div class="mini-label"><span>${t("recent5")}</span></div>
      <table class="recent"><tr><th>${t("period")}</th><th>${t("ret")}</th></tr>${P.slice(-5).reverse().map(p=>`<tr><td>${perLabel(p)}</td><td class="${p[1]>=0?"pos":"neg"}">${fmt(p[1])}</td></tr>`).join("")}</table>`:trackHTML(f)}
      <div class="card-foot">
        <button class="more" data-n="${i}">${t("view")} <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 7h10M8 3l4 4-4 4"/></svg></button></div>
    </div></article>`;
}

const scroller=document.getElementById("scroller");

function renderCards(keepPos){
  const x=scroller.scrollLeft;
  track.innerHTML=(FUNDS[tab]||[]).map(cardHTML).join("");
  document.getElementById("tabDesc").textContent=tab==="liquid"?t(anon()?"descLiquidAnon":"descLiquid"):tab==="illiquid"?t("descIlliquid"):"";   // custom strategies have no description line
  requestAnimationFrame(()=>setTimeout(()=>track.querySelectorAll(".bar i").forEach(b=>b.style.height=b.dataset.h),80));
  document.getElementById("restoreBtn").hidden=!(Auth.isAdmin()&&FundStore.builtInsChanged());
  scroller.scrollLeft=keepPos?x:0;
  updateProg();
}
function updateProg(){
  const w=scroller.scrollWidth||1;
  prog.style.width=Math.min(100,scroller.clientWidth/w*100)+"%";
  prog.style.left=(scroller.scrollLeft/w*100)+"%";
  const max=scroller.scrollWidth-scroller.clientWidth, pager=document.getElementById("pager");
  pager.hidden=max<=1;                                                     // every card already fits: no buttons needed
  document.getElementById("prevBtn").disabled=scroller.scrollLeft<=1;
  document.getElementById("nextBtn").disabled=scroller.scrollLeft>=max-1;
}
scroller.addEventListener("scroll",updateProg,{passive:true});

/* previous / next buttons: each click moves the row by exactly one card */
const prevBtn=document.getElementById("prevBtn"), nextBtn=document.getElementById("nextBtn");
let pageTo=0, pageAt=0;
function page(dir){
  const first=track.firstElementChild; if(!first) return;
  const step=first.offsetWidth+(parseFloat(getComputedStyle(track).columnGap)||0);
  const max=scroller.scrollWidth-scroller.clientWidth;
  const from=performance.now()-pageAt<700?pageTo:scroller.scrollLeft;      // quick clicks add up instead of restarting mid-slide
  pageTo=Math.max(0,Math.min(max,(Math.round(from/step)+dir)*step));
  pageAt=performance.now();
  cancelAnimationFrame(glide); scroller.classList.remove("dragging");
  scroller.scrollTo({left:pageTo,behavior:"smooth"});
}
prevBtn.onclick=()=>page(-1);
nextBtn.onclick=()=>page(1);
addEventListener("resize",updateProg);

/* ---------- cover-page numbers ----------
   The three figures on the cover come from index.html until an admin edits them; after that they are part of the
   shared data. An admin clicks a number, types, and presses Enter (or clicks away) to save; Esc cancels. */
const statEls=[...document.querySelectorAll(".hero-stats b[data-stat]")];
const STAT_DEFAULT=statEls.map(b=>b.textContent);
function renderStats(){
  const list=FundStore.stats()||STAT_DEFAULT, admin=Auth.isAdmin();
  statEls.forEach((b,i)=>{
    if(document.activeElement!==b) b.textContent=list[i];           // never overwrite a number while it is being typed
    if(admin){b.contentEditable="plaintext-only";b.title=t("statEdit");b.spellcheck=false}
    else{b.removeAttribute("contenteditable");b.removeAttribute("title")}
  });
}
statEls.forEach((b,i)=>{
  b.addEventListener("keydown",e=>{
    if(e.key==="Enter"){e.preventDefault();b.blur()}
    if(e.key==="Escape"){b.textContent=(FundStore.stats()||STAT_DEFAULT)[i];b.blur()}
  });
  b.addEventListener("blur",()=>{
    const list=FundStore.stats()||[...STAT_DEFAULT], value=b.textContent.replace(/\s+/g," ").trim().slice(0,12);
    if(!value||value===list[i]||!Auth.isAdmin()||needToken()){b.textContent=list[i];return}
    list[i]=value; b.textContent=value;
    FundStore.setStats(list);
  });
});

function applyLang(){
  document.documentElement.lang={en:"en",sc:"zh-Hans",tc:"zh-Hant"}[lang];
  document.querySelectorAll("[data-i]").forEach(el=>el.innerHTML=t(el.dataset.i));
  document.querySelectorAll(".lang-menu button").forEach(b=>{const on=b.dataset.lang===lang;b.classList.toggle("on",on);b.setAttribute("aria-checked",on)});
  document.getElementById("langCur").textContent={en:"EN",sc:"简体",tc:"繁體"}[lang];
  renderStats();
  renderTabs();
  renderCards(true);
  if(openFund) openD(openFund);
  if(window.onLangChange) onLangChange();                 // lets account.js refresh login / admin controls
}
const langBox=document.getElementById("lang"), langBtn=document.getElementById("langBtn");
function setMenu(open){langBox.classList.toggle("open",open);langBtn.setAttribute("aria-expanded",open)}
langBtn.onclick=e=>{e.stopPropagation();setMenu(!langBox.classList.contains("open"))};
document.querySelectorAll(".lang-menu button").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;try{localStorage.setItem("jc-lang",lang)}catch(e){}setMenu(false);applyLang()});
document.addEventListener("click",e=>{if(!langBox.contains(e.target))setMenu(false)});
addEventListener("keydown",e=>{if(e.key==="Escape")setMenu(false)});

/* ---------- strategy tabs ----------
   Two built-in tabs (liquid, illiquid) plus any strategies an admin has added. `tab` holds the id of the open one.
   Admins also get a small × on every tab and a "+ Add Strategy" button at the end. Deleting one of the two built-in
   tabs can be undone with "Restore original funds". */
const tabsEl=document.getElementById("tabs");
const stratName=s=>s.builtIn?t(s.id==="liquid"?"tabLiquid":"tabIlliquid"):s.name;
let addingStrat=false;
function renderTabs(){
  const list=FundStore.strategies(), admin=Auth.isAdmin();
  if(!list.some(s=>s.id===tab)) tab=list.length?list[0].id:"";       // the open tab was deleted: fall back to the first one
  if(!admin) addingStrat=false;
  tabsEl.innerHTML=list.map(s=>`<button class="tab ${s.id===tab?"active":""}" data-tab="${s.id}" role="tab"><span>${stratName(s)}</span><span class="count">${(FUNDS[s.id]||[]).length}</span>${admin?`<span class="tab-del" data-del="${s.id}" title="${t("stratDelete")}">×</span>`:""}</button>`).join("")
    +(!admin?"":addingStrat
      ?`<form class="strat-new" id="stratForm"><input id="stratName" maxlength="40" placeholder="${t("stratPh")}"><button class="btn sm solid" type="submit">${t("stratAdd")}</button><button class="strat-x" type="button" id="stratCancel" aria-label="${t("cancel")}">×</button></form>`
      :`<button class="tab tab-add" id="stratAddBtn">${t("addStrategy")}</button>`);
}
function selectTab(id){tab=id;renderTabs();renderCards()}

/** Creates a strategy tab from typed text. Returns the new strategy, or null if the name is empty or already used. */
function createStrategy(raw){
  if(!Auth.isAdmin()||needToken()) return null;
  const name=esc(raw);
  if(!name) return null;
  if(FundStore.strategies().some(s=>stratName(s).toLowerCase()===name.toLowerCase())){alert(t("stratExists"));return null}
  return FundStore.addStrategy(name);
}
tabsEl.addEventListener("click",e=>{
  const del=e.target.closest("[data-del]");
  if(del){
    const id=del.dataset.del, s=FundStore.strategies().find(x=>x.id===id);
    if(s&&Auth.isAdmin()&&!needToken()&&confirm(t("stratDelConfirm")(del.parentElement.firstChild.textContent,(FUNDS[id]||[]).length))){
      FundStore.removeStrategy(id); closeD(); selectTab(tab);
    }
    return;
  }
  if(e.target.closest("#stratAddBtn")){addingStrat=true;renderTabs();document.getElementById("stratName").focus();return}
  if(e.target.closest("#stratCancel")){addingStrat=false;renderTabs();return}
  const b=e.target.closest(".tab[data-tab]");
  if(b) selectTab(b.dataset.tab);
});
tabsEl.addEventListener("submit",e=>{
  e.preventDefault();
  const s=createStrategy(document.getElementById("stratName").value);
  if(s){addingStrat=false;selectTab(s.id)}
});
tabsEl.addEventListener("keydown",e=>{if(e.key==="Escape"&&addingStrat){addingStrat=false;renderTabs()}});

/* mouse drag with momentum (touch uses native scrolling) */
let drag=null, glide=0, justDragged=false;
scroller.addEventListener("pointerdown",e=>{
  if(e.pointerType!=="mouse"||e.button!==0||e.target.closest("button"))return;
  cancelAnimationFrame(glide);
  drag={x:e.clientX,start:scroller.scrollLeft,lastX:e.clientX,lastT:performance.now(),v:0,moved:false};
});
addEventListener("pointermove",e=>{
  if(!drag)return;
  const dx=e.clientX-drag.x;
  if(!drag.moved&&Math.abs(dx)>4){drag.moved=true;scroller.classList.add("dragging")}
  if(!drag.moved)return;
  const now=performance.now(), dt=Math.max(1,now-drag.lastT);
  drag.v=0.8*((drag.lastX-e.clientX)/dt)+0.2*drag.v;   // px per ms, smoothed
  drag.lastX=e.clientX; drag.lastT=now;
  scroller.scrollLeft=drag.start-dx;
});
addEventListener("pointerup",()=>{
  if(!drag)return;
  const {moved}=drag; let v=drag.v*16; drag=null;
  if(!moved)return;
  justDragged=true; setTimeout(()=>justDragged=false,0);
  (function step(){                                     // decelerate, then let snap settle
    if(Math.abs(v)<0.5){scroller.classList.remove("dragging");return}
    scroller.scrollLeft+=v; v*=0.94; glide=requestAnimationFrame(step);
  })();
});
scroller.addEventListener("click",e=>{if(justDragged){e.preventDefault();e.stopPropagation()}},true);

/* Block trackpad swipe-to-go-back / forward (also covers Safari, which ignores overscroll-behavior for this).
   Horizontal wheel movement is allowed only while the fund carousel can still scroll that way. */
document.addEventListener("wheel",e=>{
  if(Math.abs(e.deltaX)<=Math.abs(e.deltaY))return;            // vertical scrolling: leave alone
  const sc=e.target.closest&&e.target.closest("#scroller");
  if(sc){
    const max=sc.scrollWidth-sc.clientWidth;
    const canScroll=e.deltaX<0?sc.scrollLeft>0:sc.scrollLeft<max-1;
    if(canScroll)return;                                        // carousel handles it natively
  }
  e.preventDefault();                                           // at an edge or outside the carousel: swallow it
},{passive:false});

/* keyboard: hold ← / → to slide continuously; Home / End jump */
let keyDir=0, keyLoop=0, kv=0;
function keySlide(){                                    // held: steady speed; released: glide out
  if(keyDir) kv=keyDir*Math.max(Math.abs(kv),18); else kv*=0.9;
  if(Math.abs(kv)<0.5){kv=0;scroller.classList.remove("dragging");return}
  scroller.scrollLeft+=kv; keyLoop=requestAnimationFrame(keySlide);
}
addEventListener("keydown",e=>{
  if(e.key==="Escape"){closeD();return}
  if(drawer.classList.contains("on")||document.body.classList.contains("modal-open")||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||document.activeElement.isContentEditable)return;
  if(e.key==="ArrowRight"||e.key==="ArrowLeft"){
    e.preventDefault();
    const d=e.key==="ArrowRight"?1:-1;
    if(keyDir!==d){keyDir=d;if(Math.sign(kv)!==d)kv=0;cancelAnimationFrame(glide);scroller.classList.add("dragging");cancelAnimationFrame(keyLoop);keySlide()}
  }
  if(e.key==="Home"&&document.activeElement===scroller){e.preventDefault();scroller.scrollTo({left:0,behavior:"smooth"})}
  if(e.key==="End"&&document.activeElement===scroller){e.preventDefault();scroller.scrollTo({left:scroller.scrollWidth,behavior:"smooth"})}
});
addEventListener("keyup",e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft")keyDir=0});
addEventListener("blur",()=>keyDir=0);

/* ---------- monthly returns ----------
   A fund can carry `monthly`: [{ y:"2008", m:[12 numbers or null], t: year total or null }], read from a picture the
   admin attached (scripts/picture_tables.py). It holds numbers only, so it is safe to show and download for investors. */
const moNum=(v,d)=>v==null?"":(v<0?"−":"")+Math.abs(v).toFixed(d)+"%";
const moDecimals=v=>(String(v).split(".")[1]||"").length>1?2:1;
/** Years whose twelve months do not compound to the printed year total: a hint that a figure was misread. */
function monthlySuspects(rows){
  return rows.filter(r=>r.t!=null&&r.m.every(v=>v!=null)&&Math.abs((r.m.reduce((a,v)=>a*(1+v/100),1)-1)*100-r.t)>0.15).map(r=>r.y);
}
/** A small picture of the table: one tiny cell per month, navy for gains and red for losses. */
function monthlyThumb(rows){
  const show=rows.slice(-14), peak=Math.max(1,...show.flatMap(r=>r.m.filter(v=>v!=null).map(Math.abs)).map(v=>Math.min(v,5)));
  const cells=show.map((r,y)=>r.m.map((v,x)=>v==null?"":`<rect x="${x*7}" y="${y*5}" width="6" height="4" fill="${v<0?"#b4443a":"#1A2445"}" opacity="${(0.25+0.75*Math.min(Math.abs(v),5)/peak).toFixed(2)}"/>`).join("")).join("");
  return `<svg class="mo-pic" viewBox="0 0 83 ${show.length*5-1}" width="83" height="${show.length*5-1}" aria-hidden="true">${cells}</svg>`;
}
const monthNames=()=>zh()?MON.map((_,i)=>`${i+1}月`):MON;
const moModal=document.getElementById("monthlyModal");
let moFund=null;
function openMonthly(id){
  const hit=FundStore.find(id); if(!hit||!hit.fund.monthly) return;
  const f=moFund=hit.fund, rows=f.monthly, bad=Auth.isAdmin()?monthlySuspects(rows):[];
  document.getElementById("moTitle").innerHTML=`${t("monthlyTitle")}<small>${title(f)}</small>`;
  document.getElementById("moTable").innerHTML=`<table class="mo"><tr><th>${t("moYear")}</th>${monthNames().map(m=>`<th>${m}</th>`).join("")}<th>${t("moTotal")}</th></tr>${
    rows.map(r=>`<tr${bad.includes(r.y)?' class="check"':""}><td>${r.y}</td>${r.m.map(v=>`<td class="${v<0?"neg":""}">${moNum(v,2)}</td>`).join("")}<td class="${r.t<0?"neg":""}">${moNum(r.t,r.t==null?1:moDecimals(r.t))}</td></tr>`).join("")}</table>`;
  document.getElementById("moNote").textContent=(bad.length?t("moCheck")(bad.join(", "))+" ":"")+t("past");
  moModal.hidden=false; document.body.classList.add("modal-open"); moModal.scrollTop=0;
}
function closeMonthly(){ if(moModal.hidden) return; moModal.hidden=true; moFund=null; document.body.classList.remove("modal-open") }
document.getElementById("moClose").onclick=closeMonthly;
moModal.addEventListener("mousedown",e=>{if(e.target===moModal)closeMonthly()});
addEventListener("keydown",e=>{if(e.key==="Escape"&&!moModal.hidden){e.stopImmediatePropagation();closeMonthly()}},true);
/** Downloads the table as a CSV file that opens in Excel. Figures are percentages; the file never names the fund for investors. */
document.getElementById("moDownload").onclick=()=>{
  if(!moFund) return;
  const cell=v=>v==null?"":String(v);
  const csv=[["Year",...MON,"Total"].join(","),...moFund.monthly.map(r=>[r.y,...r.m.map(cell),cell(r.t)].join(","))].join("\r\n");
  const slug=document.getElementById("moTitle").querySelector("small").textContent.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob(["﻿"+csv],{type:"text/csv;charset=utf-8"}));
  a.download=`monthly-returns${slug?"-"+slug:""}.csv`;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
};

/* ---------- share classes ----------
   A fund can carry `classes`: { head:[column titles], rows:[[cells]] }, one row per share class with its fees and
   liquidity terms. A built-in fund may hold one table per language ({ en, sc, tc }). In View Fund the table replaces
   the liquidity text. */
const classesOf=f=>{const c=f.classes&&(f.classes.head?f.classes:L(f.classes));return c&&c.head&&c.rows&&c.rows.length?c:null};

/* drawer */
const drawer=document.getElementById("drawer"), scrim=document.getElementById("scrim");
let openFund=null;
track.addEventListener("click",e=>{const b=e.target.closest(".more");if(b)openD(FUNDS[tab][b.dataset.n])});
function openD(f){
  const keep=openFund===f?drawer.scrollTop:0; openFund=f;
  const rows=[...(f.hist||[]),...f.perf];
  const ddRaw=LX(f.ddRaw), notes=notesOf(f), incText=LX(f.inceptionText), aumText=LX(f.aumText);
  const ddBlock=ddRaw||f.dd?`<h4>${LX(f.ddLabel)||t("maxdd")}</h4><p>${ddRaw?R(f,ddRaw):ddText(f)}</p>`:"";
  // perfCaption explains rows that are not this fund's own record (a predecessor or composite series)
  const perfBlock=rows.length?`<h4>${t("perfTitle")}</h4>${LX(f.perfCaption)?`<p class="perf-cap">${R(f,LX(f.perfCaption))}</p>`:""}
    <table class="perf"><tr><th>${t("period")}</th><th>${t("ret")}</th></tr>${rows.map(p=>`<tr><td>${perLabel(p)}</td><td class="${p[1]>=0?"pos":"neg"}">${fmt(p[1])}</td></tr>`).join("")}</table>`:"";
  const mo=f.monthly&&f.monthly.length?f.monthly:null;
  const monthlyBlock=mo?`<button class="mo-thumb" type="button" onclick="openMonthly('${f.id}')">${monthlyThumb(mo)}<span><b>${t("monthlyTitle")}</b><small>${mo[0].y}${mo.length>1?" – "+mo.at(-1).y:""} · ${t("monthlyOpen")}</small></span>
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 7h10M8 3l4 4-4 4"/></svg></button>`:"";
  const cls=classesOf(f);
  const liqBlock=cls?`<h4>${t("clHead")}</h4><div class="cls-scroll"><table class="cls"><tr>${cls.head.map(h=>`<th>${R(f,h)}</th>`).join("")}</tr>${
      cls.rows.map(r=>`<tr>${r.map(c=>`<td>${R(f,c)||"—"}</td>`).join("")}</tr>`).join("")}</table></div>`
    :`<h4>${t("liqTerms")}</h4><p>${f.liqFull?R(f,L(f.liqFull)):t("dailyFull")}</p>`;
  const notesBlock=notes.length?`<h4>${t("trackRecord")}</h4><p>${notes.map(x=>R(f,x)).join("<br>")}</p>`:"";
  drawer.innerHTML=`<div class="d-head"><button class="close" onclick="closeD()" aria-label="Close">✕</button>${anon()?"":`<span class="tag">${L(f.tag)}</span>`}<h3>${title(f)}</h3>${anon()?"":`<p>${L(f.mgr)} · ${veh(f)}</p>`}</div>
  <div class="d-body">
    <h4>${t("overview")}</h4><p>${R(f,L(f.strategy))}</p>
    <h4>${t("facts")}</h4>
    <div class="facts">
      <div><span>${t("inception")}</span><b>${incShown(f)}</b></div><div><span>${t("aum")}</span><b>${aumText?R(f,aumText):f.aum!=null?money(f.aum):"—"}</b></div>
      <div><span>${t("vehicle")}</span><b>${veh(f)}</b></div><div><span>${t("dealing")}</span><b>${liqTxt(f)}</b></div>
    </div>
    ${ddBlock}
    ${liqBlock}
    ${perfBlock}${monthlyBlock}${notesBlock}
    <p class="note">${f.note&&!anon()?L(f.note)+" ":""}${t("past")}</p>
    ${Auth.isAdmin()?`<div class="d-admin"><button class="btn ghost" onclick="openEdit('${f.id}')">${t("edit")}</button>${f.custom?`<button class="btn ghost" onclick="translateNow('${f.id}')">${t(f.translated?"retranslate":"translate")}</button>`:""}<button class="btn danger" onclick="deleteFund('${f.id}')">${t("del")}</button></div>`:""}
  </div>`;
  drawer.classList.add("on");scrim.classList.add("on");drawer.setAttribute("aria-hidden","false");drawer.scrollTop=keep;
}
function closeD(){closeMonthly();openFund=null;drawer.classList.remove("on");scrim.classList.remove("on");drawer.setAttribute("aria-hidden","true")}
scrim.onclick=closeD;

/* nav: highlight the link for the section currently in view */
const navLinks=[...document.querySelectorAll(".links a[data-sec]")];
function spy(){
  const line=innerHeight*0.4;
  let cur="about";
  for(const a of navLinks){const el=document.getElementById(a.dataset.sec); if(el&&el.getBoundingClientRect().top<=line) cur=a.dataset.sec}
  if(innerHeight+scrollY>=document.documentElement.scrollHeight-4) cur="contact";
  navLinks.forEach(a=>a.classList.toggle("on",a.dataset.sec===cur));
}
addEventListener("scroll",spy,{passive:true}); addEventListener("resize",spy);
navLinks.forEach(a=>a.addEventListener("click",e=>{
  e.preventDefault();
  const el=document.getElementById(a.dataset.sec);
  const y=a.dataset.sec==="about"?0:el.getBoundingClientRect().top+scrollY+(a.dataset.sec==="funds"?10:0);   // lands "Featured Strategies" just below the nav
  window.scrollTo({top:Math.min(y,document.documentElement.scrollHeight-innerHeight),behavior:"smooth"});
}));
document.querySelector(".logo").addEventListener("click",e=>{e.preventDefault();window.scrollTo({top:0,behavior:"smooth"})});

/* nav + reveal */
addEventListener("scroll",()=>document.getElementById("nav").classList.toggle("solid",scrollY>40));
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add("in")),{threshold:.15});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

applyLang();
spy();
