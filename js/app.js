/* ---------- helpers ---------- */
const MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let lang="en", tab="liquid";
try{ const s=localStorage.getItem("jc-lang"); if(UI[s]) lang=s }catch(e){}
const t=k=>UI[lang][k];
const L=o=>o?(o[lang]||o.en):"";
const zh=()=>lang!=="en";
const fmt=v=>(v>0?"+":v<0?"−":"")+Math.abs(v).toFixed(2)+"%";
const ym=s=>{const [y,m]=s.split("-");return zh()?`${y}年${+m}月`:`${MON[m-1]} ${y}`};
const money=bn=>zh()?`${+(bn*10).toFixed(1)}亿美元`.replace("亿",lang==="tc"?"億":"亿"):`US$${bn.toFixed(bn<10?2:1)}bn`;
const perLabel=([y,,k,m])=>k==="ytd"?(zh()?`${y} YTD (至${m}月)`:`${y} YTD (to ${MON[m-1]})`):k==="p"?(zh()?`${y} (${m}月起)`:`${y} (from ${MON[m-1]})`):y;
const ann=p=>{const f=p.filter(x=>!x[2]);if(!f.length)return null;return(Math.pow(f.reduce((a,x)=>a*(1+x[1]/100),1),1/f.length)-1)*100};
const liqTxt=f=>f.liq?L(f.liq):t("daily");
const veh=f=>f.vehicle==="private"?t("private"):f.vehicle;
/* Investors (anyone who is not an admin) never see the real fund or manager name:
   the strategy label is shown as the fund's title instead. Admins see everything. */
const anon=()=>!Auth.isAdmin();
const title=f=>anon()?L(f.tag):f.name;

function ddText(f){                                     // max drawdown as a plain sentence, same style as other drawer text
  const d=f.dd, z=zh(), c=z?"：":": ", sep=z?"；":". ", end=z?"。":".";
  const wm=d.wm?`${d.since2020?t("wm20"):t("wm")}${c}${ym(d.wm[1])}${z?" ":", "}${fmt(d.wm[0])}`:"";   // funds added by form may have no worst month
  const wy=d.wy===false?"":d.wy?`${t("wy")}${c}${d.wy[1]}${z?"年 ":", "}${fmt(d.wy[0])}`:t("noNeg");      // wy:false = leave the worst-year sentence out
  return [wm,wy].filter(Boolean).join(sep)+end+(d.extra?(z?"":" ")+L(d.extra):"");
}

const track=document.getElementById("track"), prog=document.getElementById("prog");

function cardHTML(f,i){
  const max=Math.max(...f.perf.map(x=>Math.abs(x[1])));
  const bars=f.perf.map(p=>`<div class="bar ${p[2]==="ytd"?"ytd":""}" data-v="${perLabel(p)}: ${fmt(p[1])}"><i class="${p[1]>=0?"p":"n"}" style="height:0" data-h="${Math.abs(p[1])/max*50}%"></i><em>${p[2]==="ytd"?"YTD":"'"+p[0].slice(2)}</em></div>`).join("");
  const a=ann(f.perf), last=f.perf.at(-1);
  return `<article class="card">
    <div class="card-top">${anon()?"":`<span class="tag">${L(f.tag)}</span>`}<h3>${title(f)}</h3>${anon()?"":`<div class="mgr">${L(f.mgr)} · ${veh(f)}</div>`}</div>
    <div class="kpis">
      <div><b>${money(f.aum)}</b><span>${t("aum")}</span></div>
      <div><b>${f.inception.slice(0,4)}</b><span>${t("inception")}</span></div>
      <div><b>${a!==null?fmt(a):"—"}</b><span>${t("ann")}</span></div>
    </div>
    <div class="card-body">
      <p class="strategy">${L(f.strategy)}</p>
      <div class="mini-label"><span>${t("annual")}</span><span>${fmt(last[1])} ${perLabel(last)}</span></div>
      <div class="bars">${bars}</div>
      <div class="mini-label"><span>${t("recent5")}</span></div>
      <table class="recent"><tr><th>${t("period")}</th><th>${t("ret")}</th></tr>${f.perf.slice(-5).reverse().map(p=>`<tr><td>${perLabel(p)}</td><td class="${p[1]>=0?"pos":"neg"}">${fmt(p[1])}</td></tr>`).join("")}</table>
      <div class="card-foot"><span class="liq ${tab!=="liquid"?"semi":""}">${liqTxt(f)}</span>
        <button class="more" data-n="${i}">${t("view")} <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 7h10M8 3l4 4-4 4"/></svg></button></div>
    </div></article>`;
}

const scroller=document.getElementById("scroller");

function renderCards(keepPos){
  const x=scroller.scrollLeft;
  track.innerHTML=FUNDS[tab].map(cardHTML).join("");
  document.getElementById("tabDesc").textContent=t(tab==="liquid"?(anon()?"descLiquidAnon":"descLiquid"):"descIlliquid");
  requestAnimationFrame(()=>setTimeout(()=>track.querySelectorAll(".bar i").forEach(b=>b.style.height=b.dataset.h),80));
  scroller.scrollLeft=keepPos?x:0;
  updateProg();
}
function updateProg(){
  const w=scroller.scrollWidth||1;
  prog.style.width=Math.min(100,scroller.clientWidth/w*100)+"%";
  prog.style.left=(scroller.scrollLeft/w*100)+"%";
}
scroller.addEventListener("scroll",updateProg,{passive:true});
addEventListener("resize",updateProg);

function applyLang(){
  document.documentElement.lang={en:"en",sc:"zh-Hans",tc:"zh-Hant"}[lang];
  document.querySelectorAll("[data-i]").forEach(el=>el.innerHTML=t(el.dataset.i));
  document.querySelectorAll(".lang-menu button").forEach(b=>{const on=b.dataset.lang===lang;b.classList.toggle("on",on);b.setAttribute("aria-checked",on)});
  document.getElementById("langCur").textContent={en:"EN",sc:"简体",tc:"繁體"}[lang];
  document.getElementById("cLiquid").textContent=FUNDS.liquid.length;
  document.getElementById("cIlliquid").textContent=FUNDS.illiquid.length;
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

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));
  tab=b.dataset.tab; renderCards();
});

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
  if(drawer.classList.contains("on")||document.body.classList.contains("modal-open")||/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
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

/* drawer */
const drawer=document.getElementById("drawer"), scrim=document.getElementById("scrim");
let openFund=null;
track.addEventListener("click",e=>{const b=e.target.closest(".more");if(b)openD(FUNDS[tab][b.dataset.n])});
function openD(f){
  const keep=openFund===f?drawer.scrollTop:0; openFund=f;
  drawer.innerHTML=`<div class="d-head"><button class="close" onclick="closeD()" aria-label="Close">✕</button>${anon()?"":`<span class="tag">${L(f.tag)}</span>`}<h3>${title(f)}</h3>${anon()?"":`<p>${L(f.mgr)} · ${veh(f)}</p>`}</div>
  <div class="d-body">
    <h4>${t("overview")}</h4><p>${L(f.strategy)}</p>
    <h4>${t("facts")}</h4>
    <div class="facts">
      <div><span>${t("inception")}</span><b>${ym(f.inception)}</b></div><div><span>${t("aum")}</span><b>${money(f.aum)}</b></div>
      <div><span>${t("vehicle")}</span><b>${veh(f)}</b></div><div><span>${t("dealing")}</span><b>${liqTxt(f)}</b></div>
    </div>
    <h4>${t("maxdd")}</h4><p>${ddText(f)}</p>
    <h4>${t("liqTerms")}</h4><p>${f.liqFull?L(f.liqFull):t("dailyFull")}</p>
    <h4>${t("perfTitle")}</h4>
    <table class="perf"><tr><th>${t("period")}</th><th>${t("ret")}</th></tr>${[...(f.hist||[]),...f.perf].map(p=>`<tr><td>${perLabel(p)}</td><td class="${p[1]>=0?"pos":"neg"}">${fmt(p[1])}</td></tr>`).join("")}</table>
    <p class="note">${f.note&&!anon()?L(f.note)+" ":""}${t("past")}</p>
    ${f.custom&&Auth.isAdmin()?`<button class="btn danger" onclick="deleteFund('${f.id}')">${t("del")}</button>`:""}
  </div>`;
  drawer.classList.add("on");scrim.classList.add("on");drawer.setAttribute("aria-hidden","false");drawer.scrollTop=keep;
}
function closeD(){openFund=null;drawer.classList.remove("on");scrim.classList.remove("on");drawer.setAttribute("aria-hidden","true")}
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
