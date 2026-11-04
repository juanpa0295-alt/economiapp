// Economiapp · motor común de las rutas. Requiere que antes se carguen TRUNK, BRANCHES y WORKSHOPS,
// y que el archivo de laboratorios de la materia defina SIMS. Se arranca con RUTA_START().
// ===================== MOTOR DE LA RUTA =====================
const ALL=[]; TRUNK.forEach(s=>ALL.push(Object.assign(s,{kind:"t"})));
BRANCHES.forEach(g=>g.items.forEach(it=>ALL.push(Object.assign(it,{kind:"b",grp:g}))));
WORKSHOPS.forEach(w=>ALL.push(Object.assign(w,{kind:"w"})));
// Talleres resueltos (opcional por materia): cada punto se escribe una vez y aparece en su taller y en las lecciones de su tema
const TLS=typeof TALLERES!=="undefined"?TALLERES:[];
TLS.forEach(t=>ALL.push(Object.assign(t,{kind:"k"})));
const PTS={};TLS.forEach(t=>t.puntos.forEach(p=>PTS[p.id]=Object.assign(p,{tl:t})));
const ALIASES=typeof ALIAS!=="undefined"?ALIAS:{};
ALL.forEach(s=>{if(s.q&&!s.qs)s.qs=[{q:s.q,a:s.a}]});
const LESSONS=ALL.filter(s=>s.kind==="t"||s.kind==="b");
const EXAM=window.RUTA_EXAM||"",TNOTE=window.RUTA_TRUNK_NOTE===undefined?"<span>· módulo de Economiapp</span>":window.RUTA_TRUNK_NOTE;
const byId=id=>ALL.find(s=>s.id===(ALIASES[id]||id));
const KEY=window.RUTA_KEY||"ruta-done";
let done={}; try{done=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){done={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $=id=>document.getElementById(id);
const trunkEl=$("trunk"), brEl=$("branches"), les=$("lesson");
let cur=null;
function remember(id){try{localStorage.setItem(KEY+"-last",id)}catch(e){}}
const NW='<span class="tag nw">Nuevo</span>';

function typeset(el){if(window.MathJax&&MathJax.typesetPromise){try{MathJax.typesetClear&&MathJax.typesetClear([el])}catch(e){}MathJax.typesetPromise([el]).catch(()=>{})}}

function renderMap(){
  trunkEl.innerHTML=TRUNK.map((s,i)=>`<li><button class="st ${done[s.id]?"done":""} ${cur===s.id?"on":""}" type="button" data-go="${s.id}">
    <span class="dot">${done[s.id]?"✓":i+1}</span><span class="nm">${s.t}</span>${s.exam&&EXAM?`<span class="tag">${EXAM}</span>`:""}</button></li>`).join("");
  brEl.innerHTML=BRANCHES.map((b,gi)=>{const has=b.items.some(it=>it.id===cur),op=has||OPENG.has(gi),nd=b.items.filter(it=>done[it.id]).length;
    return `<details class="bgrp${has?" cur":""}" data-g="${gi}" ${op?"open":""}><summary><span class="bgt">${b.g}</span><span class="bgn">${nd?nd+"/":""}${b.items.length}</span></summary><small>Sale de: ${byId(b.from).t}</small><div class="chips">${
    b.items.map(it=>`<button class="chip ${cur===it.id?"on":""} ${done[it.id]?"done":""}" type="button" data-go="${it.id}">${it.t}${it.nuevo?'<span class="nwdot">nuevo</span>':""}</button>`).join("")}</div></details>`}).join("");
  const wgrp=(g,title,list,cls)=>{if(!list.length)return"";const has=list.some(w=>w.id===cur);return `<details class="wsgrp${has?" cur":""}" ${has||OPENG.has(g)?"open":""} data-g="${g}"><summary><span class="bgt">${title}</span><span class="bgn">${list.length}</span></summary><div class="chips">${list.map(w=>`<button class="chip ${cls} ${cur===w.id?"on":""}" type="button" data-go="${w.id}">${w.t}</button>`).join("")}</div></details>`};
  const W2=WORKSHOPS.filter(w=>w.grp==="ver"),W1=WORKSHOPS.filter(w=>w.grp!=="ver");
  let tlh="";if(TLS.length){const has=TLS.some(t=>t.id===cur),all=Object.values(PTS),nd=all.filter(p=>done["p:"+p.id]).length;
    tlh=`<details class="wsgrp tlgrp${has?" cur":""}" ${has||OPENG.has("k")?"open":""} data-g="k"><summary><span class="bgt">Talleres resueltos</span><span class="bgn">${nd?nd+"/":""}${all.length}</span></summary><small>Cada punto paso a paso, con las propiedades que usa</small><div class="chips">${TLS.map(t=>{const d=t.puntos.filter(p=>done["p:"+p.id]).length;return `<button class="chip tl-chip ${cur===t.id?"on":""}" type="button" data-go="${t.id}">${t.t}<span class="nwdot">${d}/${t.puntos.length}</span></button>`}).join("")}</div></details>`}
  $("talleres").innerHTML=tlh+wgrp("w",W2.length?"Herramientas para resolver":"Herramientas para practicar",W1,"ws-chip")+wgrp("v","Para entender (visualizaciones)",W2,"ws-chip");
  const mt=$("maptg");if(mt){const s0=byId(cur),pos=s0?(s0.kind==="t"?`Estación ${TRUNK.indexOf(s0)+1} de ${TRUNK.length}`:s0.kind==="w"?"Herramienta":s0.kind==="k"?"Taller":"Rama"):"";mt.querySelector(".t").textContent=MOBILE()?`Temas del curso · ${pos}`:(document.body.classList.contains("nomap")?"Mostrar temas":"Ocultar temas")}
  const n=LESSONS.filter(s=>done[s.id]).length;
  $("pbar").style.width=(n/LESSONS.length*100)+"%";
  $("ptxt").textContent=`${n} de ${LESSONS.length} temas dominados`;
  requestAnimationFrame(moveTrain);
}
const OPENG=new Set();
const MOBILE=()=>window.matchMedia("(max-width:860px)").matches;
document.addEventListener("toggle",e=>{const d=e.target;if(!d.matches||!d.matches("details[data-g]"))return;const g=/^\d+$/.test(d.dataset.g)?+d.dataset.g:d.dataset.g;if(d.open)OPENG.add(g);else OPENG.delete(g)},true);
(function(){const mt=$("maptg");if(!mt)return;const nav=mt.closest("nav");try{if(localStorage.getItem("ruta-nomap")==="1")document.body.classList.add("nomap")}catch(e){}
  mt.addEventListener("click",()=>{if(MOBILE()){nav.classList.toggle("open");mt.setAttribute("aria-expanded",nav.classList.contains("open"))}else{const on=document.body.classList.toggle("nomap");mt.setAttribute("aria-expanded",!on);try{localStorage.setItem("ruta-nomap",on?"1":"0")}catch(e){}}renderMap()});
  nav.addEventListener("click",e=>{if(e.target.closest("[data-go]")&&MOBILE()){nav.classList.remove("open");mt.setAttribute("aria-expanded","false")}})})();
// Código: separa los comentarios para que no queden partidos debajo del código
function splitComment(line){let q=null;for(let i=0;i<line.length;i++){const c=line[i];if(q){if(c==="\\"){i++;continue}if(c===q)q=null;continue}if(c==='"'||c==="'"||c==="`"){q=c;continue}
  if(c==="#"&&!/[A-Za-z0-9_]/.test(line[i-1]||""))return i;if(c==="/"&&line[i+1]==="/"&&line[i-1]!==":")return i}return -1}
function prettyCode(root){(root||document).querySelectorAll("pre:not([data-pc])").forEach(pre=>{const t=pre.textContent;if(!/#|\/\//.test(t)||pre.closest(".nopc"))return;pre.dataset.pc="1";
  pre.innerHTML=t.split("\n").map((ln,k,a)=>{const nl=k<a.length-1?'<span class="pc-nl">\n</span>':"";if(!ln.trim())return `<span class="pc-ln pc-bl">${esc(ln)}${nl}</span>`;
    const j=/^\s*\*/.test(ln)?ln.search(/\*/):splitComment(ln);if(j<0)return `<span class="pc-ln"><span class="pc-cd">${esc(ln)}</span>${nl}</span>`;
    const code=ln.slice(0,j),cm=ln.slice(j),body=code.replace(/\s+$/,""),sp=code.slice(body.length);
    if(!body.trim())return `<span class="pc-ln"><span class="pc-cd">${esc(code)}</span><span class="pc-cm pc-full">${esc(cm)}</span>${nl}</span>`;
    return `<span class="pc-ln"><span class="pc-cd">${esc(body)}</span><span class="pc-sp">${esc(sp)}</span><span class="pc-cm">${esc(cm)}</span>${nl}</span>`}).join("")})}
function moveTrain(){
  const s=byId(cur); if(!s) return;
  const anchor=s.kind==="t"?s.id:s.kind==="b"?s.grp.from:s.anchor;
  const btn=trunkEl.querySelector(`[data-go="${anchor}"]`); if(!btn) return;
  const y=btn.offsetTop+btn.offsetHeight/2;
  $("fill").style.height=Math.max(0,y-14)+"px";
  $("train").style.top=(y-8)+"px";
}
function deepBlock(s){
  let h=(s.deep||[]).map(d=>`<div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">${d.k}</span><span>${d.t}${d.n?" "+NW:""}</span><span class="chev">›</span></button><div class="dpb"><div><div>${d.html}</div></div></div></div>`).join("");
  if(s.code) h+=`<div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">Código</span><span>En el software: R, Stata y Python</span><span class="chev">›</span></button><div class="dpb"><div><div>
    <div class="tabs" role="tablist">${["r","stata","py"].map((l,j)=>`<button type="button" role="tab" aria-selected="${j===0}" data-tab="${l}">${{r:"R",stata:"Stata",py:"Python"}[l]}</button>`).join("")}</div>
    ${["r","stata","py"].map((l,j)=>`<div data-pane="${l}" ${j?"hidden":""}><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(s.code[l])}</pre></div>`).join("")}
  </div></div></div></div>`;
  if(s.py) h+=`<div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">Python</span><span>El cálculo de Economiapp como función</span><span class="chev">›</span></button><div class="dpb"><div><div>
    <p class="hint" style="margin:0 0 8px">Es la misma lógica de tu página de Streamlit, separada de la interfaz. El laboratorio de arriba hace estas operaciones y da los mismos resultados.</p>
    <div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(s.py)}</pre></div></div></div></div></div>`;
  return h?`<section><h3>Para profundizar</h3><div class="deep">${h}</div></section>`:"";
}
function quizBlock(s){
  if(!s.qs||!s.qs.length) return "";
  return `<div class="quiz"><div class="lbl" style="margin-bottom:6px">Ponte a prueba</div>${s.qs.map((x,j)=>`<div class="qa"><p style="margin:0 0 8px">${x.q}</p>
    <button type="button" data-rev="${j}">Ver respuesta</button><div class="ans" id="ans-${j}" hidden>${x.a}</div></div>`).join("")}</div>`;
}
let TLHIDE=false;try{TLHIDE=localStorage.getItem("ruta-tl-hide")==="1"}catch(e){}
function ptoBody(p,inLesson){const temas=(p.temas||[]).map(byId).filter(Boolean);
  return `<div class="pto-meta">${p.tipo?`<span class="tag">${p.tipo}</span>`:""}${temas.length?`<span class="lbl">Teoría</span>${temas.map(l=>`<button class="chip" type="button" data-go="${l.id}">${l.t}</button>`).join("")}`:""}</div>
  <div class="pto-s"><h4>Qué pide</h4>${p.enun}</div>
  ${p.saber&&p.saber.length?`<div class="pto-s pto-saber"><h4>Lo que necesitas saber</h4><ul>${p.saber.map(x=>`<li>${x}</li>`).join("")}</ul></div>`:""}
  ${inLesson?"":`<button class="btn pto-ver" type="button" data-ver>Ya lo intenté: ver la solución</button>`}
  <div class="pto-s pto-sol"><h4>Paso a paso</h4>${p.sol}</div>
  <div class="pto-s pto-res"><h4>Respuesta</h4>${p.res}</div>
  <div class="pto-f">${p.tool?`<button class="btn" type="button" data-tool="${p.tool.id}" data-pre="${p.tool.pre||""}">${p.tool.lbl} →</button>`:""}${inLesson?`<button class="btn" type="button" data-go="${p.tl.id}~${p.id}">Ver en el taller →</button>`:`<label class="pto-ok"><input type="checkbox" data-pdone="${p.id}" ${done["p:"+p.id]?"checked":""}> Ya lo resolví</label>`}</div>`}
function tallerHTML(s){const n=s.puntos.length,d=s.puntos.filter(p=>done["p:"+p.id]).length;
  return `<p class="lead" style="margin:0">${s.intro}</p>
  <div class="tl-bar"><div class="tl-prog"><div class="tl-pb"><i id="tl-pbi" style="width:${d/n*100}%"></i></div><span id="tl-pt">${d} de ${n} puntos resueltos</span></div>
    <label class="chkl"><input type="checkbox" id="tl-hide" ${TLHIDE?"checked":""}> Intentar primero: ocultar las soluciones</label></div>
  <div class="tl-idx" role="list">${s.puntos.map(p=>`<button type="button" role="listitem" class="tl-i${done["p:"+p.id]?" done":""}" data-pi="${p.id}"><b>${p.n}</b><span>${p.t}</span></button>`).join("")}</div>
  <div class="tl-list">${s.puntos.map(p=>`<details class="pto" id="pto-${p.id}"><summary><span class="pn">${p.n}</span><span class="pt">${p.t}${p.tipo?`<small>${p.tipo}</small>`:""}</span><span class="pk">${done["p:"+p.id]?"✓":""}</span></summary><div class="pto-b">${ptoBody(p)}</div></details>`).join("")}</div>`}
function enTalleres(s){const ps=Object.values(PTS).filter(p=>(p.temas||[]).includes(s.id));if(!ps.length)return"";const ej=ps.find(p=>p.ej===s.id);
  const grupos=TLS.map(t=>[t,ps.filter(p=>p.tl===t)]).filter(g=>g[1].length);
  return `<section class="tl-en"><h3>En los talleres</h3><p class="hint" style="margin:0 0 8px">Estos puntos se resuelven con lo de esta lección${ej?"; abajo está resuelto uno como ejemplo":""}.</p>
  ${grupos.map(([t,l])=>`<div class="tl-g"><span class="lbl">${t.t}</span><div class="tl-enl">${l.map(p=>`<button class="tl-ref${p===ej?" ej":""}" type="button" data-go="${t.id}~${p.id}"><b>${p.n}</b><span>${p.t}</span></button>`).join("")}</div></div>`).join("")}
  ${ej?`<details class="pto tl-ej" open><summary><span class="pn">${ej.n}</span><span class="pt"><small>Ejemplo resuelto · ${ej.tl.t}, ${ej.tl.nl||"punto"} ${ej.n}</small>${ej.t}</span></summary><div class="pto-b">${ptoBody(ej,true)}</div></details>`:""}</section>`}
function openPto(pid,smooth){const d=$("pto-"+pid);if(!d)return;d.open=true;requestAnimationFrame(()=>d.scrollIntoView({behavior:smooth&&!reduce?"smooth":"auto",block:"start"}))}
function show(id,scroll){
  let sub=null;id=id||"";if(id.includes("~")){[id,sub]=id.split("~")}else if(PTS[id]){sub=id;id=PTS[id].tl.id}
  const s=byId(id)||TRUNK[0]; const prevIdx=ALL.findIndex(x=>x.id===cur); cur=s.id; remember(s.id);
  const i=ALL.indexOf(s), prev=ALL[i-1], next=ALL[i+1];
  const eyebrow=s.kind==="t"
    ? `<span>Estación ${i+1} de ${TRUNK.length}</span>${s.exam&&EXAM?`<span class="tag">${EXAM}</span>`:""}${s.nuevo?NW:TNOTE}`
    : s.kind==="b" ? `<span class="tag br">Rama</span>${s.nuevo?NW:""}<span>${s.grp.g} · sale de ${byId(s.grp.from).t}</span>`
    : s.kind==="k" ? `<span class="tag ws">Taller resuelto</span><span>${s.sub||""} · ${s.puntos.length} puntos</span>`
    : `<span class="tag ws">Herramienta</span><span>${s.grp==="ver"?"Para entender":"Para resolver ejercicios"}</span>`;
  const rel=WORKSHOPS.filter(w=>w.links.includes(s.id));
  const relHtml=s.kind==="k"?"":s.kind==="w"
    ? `<div class="relws"><span class="lbl">Lecciones relacionadas</span>${s.links.map(l=>`<button class="btn" type="button" data-go="${l}">${byId(l).t}</button>`).join("")}</div>`
    : rel.length?`<div class="relws"><span class="lbl">Practica en</span>${rel.map(w=>`<button class="btn" type="button" data-go="${w.id}">${w.t} →</button>`).join("")}</div>`:"";
  les.innerHTML=`<div><div class="eyebrow">${eyebrow}</div><h2>${s.t}</h2></div>
    ${s.kind==="w"?`<p class="lead" style="margin:0">${s.d}</p>`:""}
    ${s.kind==="k"?tallerHTML(s):s.html}
    ${s.kind==="t"||s.kind==="b"?enTalleres(s):""}
    ${relHtml}
    ${deepBlock(s)}
    ${quizBlock(s)}
    <div class="foot">${s.kind==="t"||s.kind==="b"?`<label for="chk"><input type="checkbox" id="chk" ${done[s.id]?"checked":""}> Ya lo domino</label>`:"<span></span>"}
      <div class="row">${prev?`<button class="btn" type="button" data-go="${prev.id}">← ${prev.t}</button>`:""}${next?`<button class="btn solid" type="button" data-go="${next.id}">${next.t} →</button>`:""}</div></div>`;
  [...les.children].forEach((c,k)=>c.style.setProperty("--i",k));
  if(!reduce && prevIdx>=0 && les.animate){
    const dir=i>=prevIdx?1:-1;
    les.animate([{transform:"translateX("+(dir*36)+"px)",opacity:.35},{transform:"none",opacity:1}],{duration:420,easing:"cubic-bezier(.2,.7,.2,1)"});
  }
  const ck=$("chk");
  if(ck) ck.onchange=e=>{done[s.id]=e.target.checked;save();renderMap()};
  if(s.sim) try{SIMS[s.sim]()}catch(err){const b=$("sim");if(b)b.innerHTML=`<p class="err">El laboratorio no pudo cargarse: ${esc(String(err.message||err))}</p>`}
  if(typeof VISUAL==="function") les.querySelectorAll("[data-vis]").forEach(el=>{try{VISUAL(el,el.dataset.vis)}catch(err){el.innerHTML=`<p class="err">El visual no pudo cargarse: ${esc(String(err.message||err))}</p>`}});
  les.classList.toggle("tl-page",s.kind==="k");
  renderMap();
  prettyCode(les);
  typeset(les);
  if(sub&&s.kind==="k"){openPto(sub,false);return}
  if(scroll){ if(window.matchMedia("(max-width:860px)").matches) les.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"}); else window.scrollTo({top:0,behavior:reduce?"auto":"smooth"}); }
}
document.addEventListener("click",e=>{
  const tlb=e.target.closest("[data-tool]");
  if(tlb){window.TOOL_PRE=tlb.dataset.pre||null;location.hash=tlb.dataset.tool;return}
  const pi=e.target.closest("[data-pi]");
  if(pi){const id=pi.dataset.pi;try{history.replaceState(null,"","#"+cur+"~"+id)}catch(er){}openPto(id,true);return}
  const vr=e.target.closest("[data-ver]");
  if(vr){vr.closest(".pto").classList.add("rev");return}
  const g=e.target.closest("[data-go]");
  if(g){const id=g.dataset.go; if(location.hash==="#"+id) show(id,true); else location.hash=id; return;}
  const tb=e.target.closest("[data-tab]");
  if(tb){const box=tb.closest("div:not(.tabs)");box.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-selected",b===tb));
    box.querySelectorAll("[data-pane]").forEach(p=>p.hidden=p.dataset.pane!==tb.dataset.tab);return;}
  const d=e.target.closest("[data-dp]");
  if(d){const p=d.parentElement;p.classList.toggle("open");d.setAttribute("aria-expanded",p.classList.contains("open"));return;}
  const r=e.target.closest("[data-rev]");
  if(r){const a=$("ans-"+r.dataset.rev);a.hidden=!a.hidden;r.textContent=a.hidden?"Ver respuesta":"Ocultar respuesta";return;}
  const c=e.target.closest("[data-copy]");
  if(c){const pre=c.nextElementSibling,txt=pre.textContent;
    const ok=()=>{c.textContent="Copiado";setTimeout(()=>c.textContent="Copiar",1500)};
    try{navigator.clipboard.writeText(txt).then(ok,()=>sel(pre))}catch(err){sel(pre)}}
});
function sel(el){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)}
document.addEventListener("keydown",e=>{
  if(e.target.closest("input,textarea,select")) return;
  const i=ALL.findIndex(x=>x.id===cur);
  if(e.key==="ArrowRight"&&ALL[i+1]) location.hash=ALL[i+1].id;
  if(e.key==="ArrowLeft"&&ALL[i-1]) location.hash=ALL[i-1].id;
});
document.addEventListener("change",e=>{const t=e.target;
  if(t.id==="tl-hide"){TLHIDE=t.checked;document.body.classList.toggle("tl-hide",TLHIDE);try{localStorage.setItem("ruta-tl-hide",TLHIDE?"1":"0")}catch(er){}return}
  if(t.dataset&&t.dataset.pdone){const id=t.dataset.pdone;done["p:"+id]=t.checked;save();const s=byId(cur);
    const d=$("pto-"+id);if(d)d.querySelector(".pk").textContent=t.checked?"✓":"";const ix=les.querySelector(`[data-pi="${id}"]`);if(ix)ix.classList.toggle("done",t.checked);
    if(s&&s.kind==="k"){const n=s.puntos.length,k=s.puntos.filter(p=>done["p:"+p.id]).length;$("tl-pt").textContent=`${k} de ${n} puntos resueltos`;$("tl-pbi").style.width=(k/n*100)+"%"}
    renderMap()}});
document.body.classList.toggle("tl-hide",TLHIDE);
window.addEventListener("hashchange",()=>show(location.hash.slice(1)||TRUNK[0].id,true));
window.addEventListener("resize",()=>moveTrain());

// ===================== UTILIDADES DE INTERFAZ Y GRÁFICOS =====================
const fmt=(v,d=2)=>isFinite(v)?v.toLocaleString("es-CO",{minimumFractionDigits:d,maximumFractionDigits:d}):"—";
const pf=p=>p<1e-4?"&lt; 0,0001":fmt(p,4);
function fm(v){if(!isFinite(v))return"—";const a=Math.abs(v);if(a===0)return"0";
  if(Number.isInteger(v))return v.toLocaleString("es-CO");return v.toLocaleString("es-CO",{maximumFractionDigits:a>=100?2:a>=1?3:4})}
const tiles=a=>a.map(([s,v,c])=>`<div${c?` class="${c}"`:""}><small>${s}</small><b>${v}</b></div>`).join("");
const fr=(a,b)=>`<span class="frac"><span>${a}</span><span>${b}</span></span>`;
const rt=x=>`√<span class="ov">${x}</span>`;
const stp=(n,t,h)=>`<div class="stepc"><h4><span class="n">${n}</span>${t}</h4>${h}</div>`;
function ctl(id,label,min,max,step,val){return `<div class="ctl"><label for="${id}">${label}</label><div class="ctlrow"><input type="range" id="${id}-r" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label}"><input type="number" id="${id}" value="${val}" step="${step}" inputmode="decimal"></div></div>`}
function bindCtl(ids,run){ids.forEach(id=>{const r=$(id+"-r"),n=$(id);
  r.addEventListener("input",()=>{n.value=r.value;run()});
  n.addEventListener("input",()=>{if(n.value!==""&&isFinite(+n.value))r.value=n.value;run()})})}
const V=id=>parseFloat($(id).value);
function seg(id,label,opts,val){return `<div class="seg" id="${id}" role="group" aria-label="${label}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===val}">${t}</button>`).join("")}</div>`}
function bindSeg(id,cb){$(id).addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;
  $(id).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));cb(b.dataset.v)})}
function nice(v){const p=10**Math.floor(Math.log10(v)),m=v/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
function ticks(a,b,step){const o=[];for(let v=Math.ceil(a/step-1e-9)*step;v<=b+1e-9;v+=step)o.push(+v.toFixed(8));return o}
function frame(W,H,xr,yr,xt,yt,xl,yl){
  const L=yt.length?50:14,R=14,T=14,B=36; const sx=x=>L+(x-xr[0])/(xr[1]-xr[0])*(W-L-R), sy=y=>T+(yr[1]-y)/(yr[1]-yr[0])*(H-T-B);
  let g="";
  yt.forEach(v=>g+=`<line x1="${L}" x2="${W-R}" y1="${sy(v)}" y2="${sy(v)}" stroke="var(--rule)"/><text x="${L-6}" y="${sy(v)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${fm(v)}</text>`);
  xt.forEach(v=>g+=`<text x="${sx(v)}" y="${H-18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${fm(v)}</text>`);
  g+=`<text x="${W-R}" y="${H-3}" text-anchor="end" font-size="11" fill="var(--muted)">${xl}</text>`;
  if(yl)g+=`<text x="${L+4}" y="${T+8}" font-size="11" fill="var(--muted)">${yl}</text>`;
  return{sx,sy,g,W,H,L,R,T,B};
}
// Gráfico de densidades: curvas, áreas sombreadas y marcas verticales
function curvePlot({lo,hi,curves,areas=[],marks=[],xl,H=230,label}){
  const W=600,N=260,xs=[];for(let i=0;i<=N;i++)xs.push(lo+(hi-lo)*i/N);
  let ym=0;curves.forEach(c=>xs.forEach(x=>{if(x>=lo+(hi-lo)*.025){const y=c.f(x);if(isFinite(y))ym=Math.max(ym,y)}}));ym=(ym||1)*1.3;
  const f=frame(W,H,[lo,hi],[0,ym],ticks(lo,hi,nice((hi-lo)/6)),[],xl,""),cy=y=>f.sy(Math.min(isFinite(y)?y:ym,ym));
  let b=`<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(0)}" y2="${f.sy(0)}" stroke="var(--muted)"/>`;
  areas.forEach(a=>{const A=Math.max(lo,a.a),B=Math.min(hi,a.b);if(!(B>A))return;const n=Math.max(2,Math.ceil((B-A)/(hi-lo)*N));let d=`M${f.sx(A).toFixed(1)},${f.sy(0)}`;
    for(let i=0;i<=n;i++){const x=A+(B-A)*i/n;d+=`L${f.sx(x).toFixed(1)},${cy(a.f(x)).toFixed(1)}`}d+=`L${f.sx(B).toFixed(1)},${f.sy(0)}Z`;
    b+=`<path d="${d}" fill="var(${a.col})" fill-opacity="${a.op||.25}"/>`});
  curves.forEach(c=>{b+=`<path d="${xs.map((x,i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+cy(c.f(x)).toFixed(1)).join("")}" fill="none" stroke="var(${c.col||"--ink"})" stroke-width="${c.w||2}"/>`});
  const top=f.sy(ym);
  marks.forEach(m=>{const out=m.x<lo||m.x>hi,x=f.sx(Math.max(lo,Math.min(hi,m.x))),row=m.row||0,yT=top+12+row*15,anc=x>W*.72?"end":x<W*.28?"start":"middle",off=anc==="end"?-5:anc==="start"?5:0;
    b+=`<line x1="${x}" x2="${x}" y1="${yT+4}" y2="${f.sy(0)}" stroke="var(${m.col})" stroke-width="${m.w||1.5}" ${m.dash?'stroke-dasharray="5 4"':""}/>`;
    b+=`<text x="${x+off}" y="${yT}" font-size="11.5" ${m.bold?'font-weight="600"':""} text-anchor="${anc}" fill="var(${m.col})">${m.label}${out?" (fuera de escala)":""}</text>`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Distribución"}">${f.g}${b}</svg></div>`;
}
function distOf(d){return d.name==="norm"?"Normal estándar":d.name==="t"?`t con ${fm(d.v)} gl`:d.name==="chi2"?`χ² con ${fm(d.k)} gl`:`F con (${fm(d.a)}, ${fm(d.b)}) gl`}
// Región de rechazo dibujada sobre la distribución del estadístico
function rejPlot(dist,cola,crits,stat,lbl){
  const cs=cola==="dos"&&crits.length===1?[-Math.abs(crits[0]),Math.abs(crits[0])]:crits,has=isFinite(stat);
  let lo,hi;
  if(dist.name==="norm"||dist.name==="t"){const c=Math.max(...cs.map(Math.abs));const R=Math.max(4,c*1.3,has?Math.min(Math.abs(stat)*1.15,8):0);lo=-R;hi=R}
  else{const cm=Math.max(...cs),base=dist.name==="chi2"?Math.max(dist.k+4*Math.sqrt(2*dist.k),cm*1.3):Math.max(3,cm*1.5);lo=0;hi=Math.max(base,has?Math.min(stat*1.15,base*3):0)}
  const areas=cola==="dos"?[{f:dist.pdf,a:lo,b:cs[0],col:"--bad"},{f:dist.pdf,a:cs[1],b:hi,col:"--bad"}]
    :cola==="der"?[{f:dist.pdf,a:cs[0],b:hi,col:"--bad"}]:[{f:dist.pdf,a:lo,b:cs[0],col:"--bad"}];
  const marks=cs.map(c=>({x:c,label:`crítico ${fm(c)}`,col:"--bad",dash:1}));
  if(has)marks.push({x:stat,label:`${lbl} = ${fm(stat)}`,col:"--line",w:2.5,row:1,bold:1});
  return curvePlot({lo,hi,curves:[{f:dist.pdf}],areas,marks,xl:distOf(dist),label:"Distribución del estadístico con la región de rechazo"});
}
const OPS={dos:["=","≠"],der:["≤",">"],izq:["≥","<"]};
const COLAS=[["dos","Dos colas (≠)"],["der","Cola derecha (>)"],["izq","Cola izquierda (<)"]];
const verdict=(rej,a,b)=>`<div class="verdict ${rej?"rej":"acc"}">${rej?a:b}</div>`;
const err=m=>`<p class="err">Revisa los datos: ${m}</p>`;
function RUTA_START(){show(location.hash.slice(1)||TRUNK[0].id,false)}
