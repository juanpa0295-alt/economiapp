// ===================== MOTOR DE LA RUTA =====================
const ALL=[]; TRUNK.forEach(s=>ALL.push(Object.assign(s,{kind:"t"})));
BRANCHES.forEach(g=>g.items.forEach(it=>ALL.push(Object.assign(it,{kind:"b",grp:g}))));
WORKSHOPS.forEach(w=>ALL.push(Object.assign(w,{kind:"w"})));
// Talleres resueltos (opcional por materia): cada punto se escribe una vez y aparece en su taller y en las lecciones de su tema
const TLS=typeof TALLERES!=="undefined"?TALLERES:[];
TLS.forEach(t=>ALL.push(Object.assign(t,{kind:"k"})));
const PTS={};TLS.forEach(t=>t.puntos.forEach(p=>PTS[p.id]=Object.assign(p,{tl:t})));
const ALIASES=typeof ALIAS!=="undefined"?ALIAS:{};
// Laboratorios (opcional por materia): casos de la vida real donde la herramienta del curso produce un beneficio
const LABS=typeof LABORATORIOS!=="undefined"?LABORATORIOS:[];
LABS.forEach(l=>{if(l.caso&&!l.html)l.html=LAB_CASO(l.caso);ALL.push(Object.assign(l,{kind:"l"}))});
// Usos de la pestaña Práctica. Las ramas de repaso (fórmulas, visuales, preparar el parcial) se muestran allí; las demás son subestaciones opcionales de su estación
const USO_RE={examen:/simulacro|parcial|supletorio|examen|pr[aá]ctica de la gu[ií]a|preparar/i,repaso:/f[oó]rmula|formulario|tarjeta|pregunta|l[ií]nea de tiempo|tabla|glosario|repaso|visuales/i};
const usoDe=x=>x.uso||(x.kind==="w"&&x.grp==="ver"?"ver":USO_RE.examen.test(x.t)?"examen":USO_RE.repaso.test(x.t)?"repaso":x.kind==="b"?"":"resolver");
BRANCHES.forEach(g=>{const u=g.uso||(USO_RE.examen.test(g.g)?"examen":USO_RE.repaso.test(g.g)?"repaso":"");g.items.forEach(it=>{if(u){it.prac=true;it.uso=it.uso||u}})});
const SUBS={};TRUNK.forEach(t=>SUBS[t.id]=[]);BRANCHES.forEach(g=>g.items.forEach(it=>{if(!it.prac&&SUBS[g.from])SUBS[g.from].push(it)}));
const PRAC_ITEMS=ALL.filter(x=>x.kind==="w"||x.kind==="k"||(x.kind==="b"&&x.prac));
const USOS=[["talleres","Hacer los talleres","Los talleres resueltos, con las fórmulas y fichas para estudiarlos"],["resolver","Herramientas para resolver","Meten tus datos y hacen el cálculo paso a paso"],["examen","Preparar el examen","Simulacros, parciales y preguntas como las del examen"],["ver","Herramientas visuales","Para entender: gráficos y escenas que se mueven"]];
const usoGrupo=x=>x.kind==="k"||usoDe(x)==="repaso"?"talleres":usoDe(x)||"resolver";
const PRAC=USOS.flatMap(([u])=>u==="talleres"?[...TLS,...PRAC_ITEMS.filter(x=>x.kind!=="k"&&usoGrupo(x)==="talleres")]:PRAC_ITEMS.filter(x=>x.kind!=="k"&&usoGrupo(x)===u));
// Solo las estaciones del tronco cuentan como progreso: las subestaciones son opcionales
const LESSONS=TRUNK;
const paneDe=x=>!x?"ruta":x.kind==="l"?"lab":x.kind==="t"||(x.kind==="b"&&!x.prac)?"ruta":"prac";
function vecinos(s){
  if(s.kind==="t"){const i=TRUNK.indexOf(s);return [TRUNK[i-1],TRUNK[i+1]]}
  if(s.kind==="b"&&!s.prac){const p=byId(s.grp.from),sib=SUBS[p.id],i=sib.indexOf(s);return [sib[i-1]||p,sib[i+1]||TRUNK[TRUNK.indexOf(p)+1]]}
  const L=s.kind==="l"?LABS:PRAC,i=L.indexOf(s);return [L[i-1],L[i+1]]}
let PANE=null;
function setPane(p,user){PANE=p;document.querySelectorAll("[data-pane-tab]").forEach(b=>{const on=b.dataset.paneTab===p;b.setAttribute("aria-selected",on);b.classList.toggle("on",on)});
  document.querySelectorAll("[data-pane-box]").forEach(d=>d.hidden=d.dataset.paneBox!==p);if(user)try{localStorage.setItem("ruta-pane",p)}catch(e){}requestAnimationFrame(moveTrain)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-pane-tab]");if(b)setPane(b.dataset.paneTab,true)});
const byId=id=>ALL.find(s=>s.id===(ALIASES[id]||id));
const KEY="ruta-tj-done";
let done={}; try{done=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){done={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $=id=>document.getElementById(id);
const trunkEl=$("trunk"), les=$("lesson");
let cur=null;
const NW='<span class="tag nw">Nuevo</span>';

function typeset(el){if(window.MathJax&&MathJax.typesetPromise){try{MathJax.typesetClear&&MathJax.typesetClear([el])}catch(e){}MathJax.typesetPromise([el]).catch(()=>{})}}

function subsHTML(t){const l=SUBS[t.id];if(!l||!l.length)return"";const has=l.some(x=>x.id===cur)||cur===t.id;
  return `<details class="subs${has?" cur":""}" data-g="s:${t.id}" ${has||OPENG.has("s:"+t.id)?"open":""}><summary>${l.length} ${l.length>1?"subestaciones":"subestación"} <i>opcional</i></summary><div>${l.map(x=>`<button class="sub ${cur===x.id?"on":""} ${done[x.id]?"done":""}" type="button" data-go="${x.id}">${x.t}${x.nuevo?'<span class="nwdot">nuevo</span>':""}</button>`).join("")}</div></details>`}
function renderMap(){
  trunkEl.innerHTML=TRUNK.map((s,i)=>`${s.parte&&(!i||TRUNK[i-1].parte!==s.parte)?`<li class="tparte">${s.parte}</li>`:""}<li><button class="st ${done[s.id]?"done":""} ${cur===s.id?"on":""}" type="button" data-go="${s.id}">
    <span class="dot">${done[s.id]?"✓":i+1}</span><span class="nm">${s.t}</span></button></li>`).join("");
  trunkEl.querySelectorAll(":scope>li>.st").forEach(b=>{const h=subsHTML(byId(b.dataset.go));if(h)b.insertAdjacentHTML("afterend",h)});
  const chip=(x,cls)=>`<button class="chip ${cls||""} ${cur===x.id?"on":""}" type="button" data-go="${x.id}">${x.t}${x.kind==="k"?`<span class="nwdot">${x.puntos.filter(p=>done["p:"+p.id]).length}/${x.puntos.length}</span>`:""}</button>`;
  const pr=$("practica");if(pr)pr.innerHTML=USOS.map(([u,tt,dd])=>{const l=PRAC.filter(x=>usoGrupo(x)===u);if(!l.length)return"";
    const k=l.filter(x=>x.kind==="k"),r=l.filter(x=>x.kind!=="k");
    const t2=u==="talleres"&&!k.length?"Fórmulas y fichas para estudiar":tt,d2=u==="talleres"&&!k.length?"Lo que necesitas a mano para repasar y resolver":dd;
    return `<section class="uso${l.some(x=>x.id===cur)?" cur":""}"><h4>${t2}</h4><small>${d2}</small>${k.length?`<div class="chips">${k.map(x=>chip(x,"tl-chip")).join("")}</div>`:""}${r.length?`<div class="chips">${r.map(x=>chip(x,"ws-chip")).join("")}</div>`:""}</section>`}).join("");
  const lb=$("labs");if(lb)lb.innerHTML=LABS.length?`<p class="labintro">Casos reales: cómo se usa lo del curso para tomar una decisión que deja un beneficio medible.</p>${LABS.map(x=>`<button class="labc ${cur===x.id?"on":""}" type="button" data-go="${x.id}"><b>${x.t}</b><span>${x.sector||""}</span></button>`).join("")}`:"";
  const lt=document.querySelector('[data-pane-tab="lab"]');if(lt)lt.hidden=!LABS.length;
  const mt=$("maptg");if(mt){const s0=byId(cur),pos=s0?(s0.kind==="t"?`Estación ${TRUNK.indexOf(s0)+1} de ${TRUNK.length}`:s0.kind==="w"?"Práctica":s0.kind==="k"?"Taller":s0.kind==="l"?"Laboratorio":s0.prac?"Práctica":"Subestación"):"";mt.querySelector(".t").textContent=MOBILE()?`Temas del curso · ${pos}`:(document.body.classList.contains("nomap")?"Mostrar temas":"Ocultar temas")}
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
  const anchor=s.kind==="t"?s.id:s.kind==="b"?s.grp.from:s.kind==="l"?(s.links||[])[0]:s.anchor;
  const btn=trunkEl.querySelector(`[data-go="${anchor}"]`); if(!btn) return;
  const y=btn.offsetTop+btn.offsetHeight/2;
  $("fill").style.height=Math.max(0,y-14)+"px";
  $("train").style.top=(y-8)+"px";
}
function deepBlock(s){
  let h=(s.deep||[]).map(d=>`<div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">${d.k}</span><span>${d.t}${d.n?" "+NW:""}</span><span class="chev">›</span></button><div class="dpb"><div><div>${d.html}</div></div></div></div>`).join("");
  if(s.py) h+=`<div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">Python</span><span>El cálculo de Economiapp como función</span><span class="chev">›</span></button><div class="dpb"><div><div>
    <p class="hint" style="margin:0 0 8px">Es la misma lógica de tu página de Streamlit, separada de la interfaz. La herramienta interactiva de arriba hace estas operaciones y da los mismos resultados.</p>
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
  ${p.micro?`<details class="pto-micro"><summary>Micropasos: cada cálculo, cambio y propiedad, uno por uno</summary><div class="pto-micro-b">${p.micro}</div></details>`:""}
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
function subsLesson(t){const l=SUBS[t.id]||[],lb=LABS.filter(x=>(x.links||[]).includes(t.id));if(!l.length&&!lb.length)return"";
  return `${l.length?`<section class="subsec"><h3>Subestaciones <small>opcionales · para profundizar</small></h3><div class="subl">${l.map(x=>`<button class="tl-ref" type="button" data-go="${x.id}"><b>${done[x.id]?"✓":"↳"}</b><span>${x.t}<small>${x.grp.g}</small></span></button>`).join("")}</div></section>`:""}
  ${lb.length?`<section class="subsec labsec"><h3>Aplícalo en un caso real</h3><div class="subl">${lb.map(x=>`<button class="tl-ref" type="button" data-go="${x.id}"><b>◆</b><span>${x.t}<small>${x.sector||"Laboratorio"}</small></span></button>`).join("")}</div></section>`:""}`}
// Lo que antes se llamaba «laboratorio» dentro de una lección es una herramienta interactiva; «Laboratorios» ahora son los casos reales
const LABTXT=[[/\b([Dd])el laboratorio\b/g,"$1e la herramienta interactiva"],[/\b([Aa])l laboratorio\b/g,"$1 la herramienta interactiva"],[/\bEl laboratorio\b/g,"La herramienta interactiva"],[/\bel laboratorio\b/g,"la herramienta interactiva"],[/\bEl Laboratorio\b/g,"La herramienta interactiva"],[/\bel Laboratorio\b/g,"la herramienta interactiva"],[/\b([Uu])n laboratorio\b/g,"$1na herramienta interactiva"],[/\bLos laboratorios\b/g,"Las herramientas interactivas"],[/\blos laboratorios\b/g,"las herramientas interactivas"],[/\bLaboratorios\b/g,"Herramientas interactivas"],[/\blaboratorios\b/g,"herramientas interactivas"],[/\bLaboratorio\b/g,"Herramienta interactiva"],[/\blaboratorio\b/g,"herramienta interactiva"]];
function renombrarLab(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){if(!/aboratorio/.test(n.nodeValue)||n.parentNode.closest("pre,code"))continue;let v=n.nodeValue;LABTXT.forEach(([r,t])=>v=v.replace(r,t));n.nodeValue=v}}
function openPto(pid,smooth){const d=$("pto-"+pid);if(!d)return;d.open=true;requestAnimationFrame(()=>d.scrollIntoView({behavior:smooth&&!reduce?"smooth":"auto",block:"start"}))}
function show(id,scroll){
  let sub=null;id=id||"";if(id.includes("~")){[id,sub]=id.split("~")}else if(PTS[id]){sub=id;id=PTS[id].tl.id}
  const s=byId(id)||TRUNK[0]; const prevIdx=ALL.findIndex(x=>x.id===cur); cur=s.id;
  const i=ALL.indexOf(s), [prev,next]=vecinos(s);
  const eyebrow=s.kind==="t"
    ? `<span>Estación ${i+1} de ${TRUNK.length}</span>${s.nuevo?NW:"<span>· módulo de Economiapp</span>"}`
    : s.kind==="b"&&s.prac ? `<span class="tag ws">Para estudiar</span>${s.nuevo?NW:""}<span>${s.grp.g}</span>`
    : s.kind==="b" ? `<span class="tag br">Subestación · opcional</span>${s.nuevo?NW:""}<span>De la estación ${TRUNK.indexOf(byId(s.grp.from))+1}: ${byId(s.grp.from).t}</span>`
    : s.kind==="l" ? `<span class="tag lab">Laboratorio · caso real</span><span>${s.sector||""}</span>`
    : s.kind==="k" ? `<span class="tag ws">Taller resuelto</span><span>${s.sub||""} · ${s.puntos.length} puntos</span>`
    : `<span class="tag ws">Práctica</span><span>${(USOS.find(u=>u[0]===usoGrupo(s))||[])[1]||""}</span>`;
  const rel=WORKSHOPS.filter(w=>w.links.includes(s.id));
  const relHtml=s.kind==="k"?"":s.kind==="w"||s.kind==="l"
    ? `<div class="relws"><span class="lbl">Lecciones relacionadas</span>${(s.links||[]).map(byId).filter(Boolean).map(l=>`<button class="btn" type="button" data-go="${l.id}">${l.t}</button>`).join("")}</div>`
    : rel.length?`<div class="relws"><span class="lbl">Practica en</span>${rel.map(w=>`<button class="btn" type="button" data-go="${w.id}">${w.t} →</button>`).join("")}</div>`:"";
  les.innerHTML=`<div><div class="eyebrow">${eyebrow}</div><h2>${s.t}</h2></div>
    ${s.kind==="w"?`<p class="lead" style="margin:0">${s.d}</p>`:""}
    ${s.kind==="k"?tallerHTML(s):s.html}
    ${s.kind==="t"||s.kind==="b"?enTalleres(s):""}
    ${s.kind==="t"?subsLesson(s):""}
    ${relHtml}
    ${deepBlock(s)}
    ${quizBlock(s)}
    <div class="foot">${s.kind==="t"?`<label for="chk"><input type="checkbox" id="chk" ${done[s.id]?"checked":""}> Ya lo domino</label>`:s.kind==="b"&&!s.prac?`<label for="chk"><input type="checkbox" id="chk" ${done[s.id]?"checked":""}> Ya la vi <small class="hint">(opcional, no cuenta en el progreso)</small></label>`:"<span></span>"}
      <div class="row">${prev?`<button class="btn" type="button" data-go="${prev.id}">← ${prev.t}</button>`:""}${next?`<button class="btn solid" type="button" data-go="${next.id}">${next.t} →</button>`:""}</div></div>`;
  [...les.children].forEach((c,k)=>c.style.setProperty("--i",k));
  if(!reduce && prevIdx>=0 && les.animate){
    const dir=i>=prevIdx?1:-1;
    les.animate([{transform:"translateX("+(dir*36)+"px)",opacity:.35},{transform:"none",opacity:1}],{duration:420,easing:"cubic-bezier(.2,.7,.2,1)"});
  }
  const ck=$("chk");
  if(ck) ck.onchange=e=>{done[s.id]=e.target.checked;save();renderMap()};
  if(s.kind!=="l") renombrarLab(les);
  if(s.sim) try{SIMS[s.sim]()}catch(err){const b=$("sim");if(b)b.innerHTML=`<p class="err">La herramienta interactiva no pudo cargarse: ${esc(String(err.message||err))}</p>`}
  if(typeof VISUAL==="function") les.querySelectorAll("[data-vis]").forEach(el=>{try{VISUAL(el,el.dataset.vis)}catch(err){el.innerHTML=`<p class="err">El visual no pudo cargarse: ${esc(String(err.message||err))}</p>`}});
  les.classList.toggle("tl-page",s.kind==="k");
  {const want=paneDe(s);if(PANE!==want)setPane(want)}
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
  const s=byId(cur);if(!s)return;const [p,n]=vecinos(s);
  if(e.key==="ArrowRight"&&n) location.hash=n.id;
  if(e.key==="ArrowLeft"&&p) location.hash=p.id;
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
// Tooltips de los controles: cada materia define window.CTL_TIPS = {id: "texto" | () => "texto"}
function tipL(id,label){const b=tipBtn(id,label);return b?`<span class="tipl">${label}${b}</span>`:label}
function tipBtn(id,label){const t=window.CTL_TIPS&&window.CTL_TIPS[id];if(!t)return"";const l=String(label).replace(/<[^>]*>/g,"");return `<button type="button" class="tipb" data-tip="${id}" aria-label="¿Qué es ${l.replace(/"/g,"")}?" aria-expanded="false">?</button>`}
(function(){if(typeof document==="undefined")return;let pop=null,owner=null;const hov=matchMedia("(hover:hover)").matches;
  const hide=()=>{if(pop)pop.hidden=true;if(owner)owner.setAttribute("aria-expanded","false");owner=null};
  const place=()=>{if(!owner||pop.hidden)return;const b=owner,r=b.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight){hide();return}const w=pop.offsetWidth;let x=r.left+r.width/2-w/2;x=Math.max(12,Math.min(innerWidth-w-12,x));pop.style.left=x+"px";const h=pop.offsetHeight;let y=r.bottom+8;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-8);pop.style.top=y+"px"};
  const show=b=>{const t=window.CTL_TIPS&&window.CTL_TIPS[b.dataset.tip];if(!t)return;if(!pop){pop=document.createElement("div");pop.className="tippop";pop.id="tippop";pop.setAttribute("role","tooltip");document.body.appendChild(pop)}
    pop.innerHTML=typeof t==="function"?t():t;pop.hidden=false;owner=b;b.setAttribute("aria-expanded","true");b.setAttribute("aria-describedby","tippop");
    const r=b.getBoundingClientRect(),w=Math.min(300,innerWidth-24);pop.style.width=w+"px";let x=r.left+r.width/2-w/2;x=Math.max(12,Math.min(innerWidth-w-12,x));pop.style.left=x+"px";
    const h=pop.offsetHeight;let y=r.bottom+8;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-8);pop.style.top=y+"px"};
  document.addEventListener("click",e=>{const b=e.target.closest(".tipb");if(b){e.preventDefault();e.stopPropagation();owner===b?hide():show(b);return}if(pop&&!e.target.closest(".tippop"))hide()},true);
  if(hov){document.addEventListener("mouseover",e=>{const b=e.target.closest(".tipb");if(b&&owner!==b)show(b)});document.addEventListener("mouseout",e=>{const b=e.target.closest(".tipb");if(b&&!b.contains(e.relatedTarget))hide()})}
  document.addEventListener("focusin",e=>{const b=e.target.closest&&e.target.closest(".tipb");if(b&&b.matches(":focus-visible"))show(b)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")hide()});addEventListener("scroll",()=>requestAnimationFrame(place),{passive:true});addEventListener("resize",hide)})();
function ctl(id,label,min,max,step,val){return `<div class="ctl"><label for="${id}">${tipL(id,label)}</label><div class="ctlrow"><input type="range" id="${id}-r" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label}"><input type="number" id="${id}" value="${val}" step="${step}" inputmode="decimal"></div></div>`}
function bindCtl(ids,run){ids.forEach(id=>{const r=$(id+"-r"),n=$(id);
  r.addEventListener("input",()=>{n.value=r.value;run()});
  n.addEventListener("input",()=>{if(n.value!==""&&isFinite(+n.value))r.value=n.value;run()})})}
const V=id=>parseFloat($(id).value);
function seg(id,label,opts,val){return `<div class="seg" id="${id}" role="group" aria-label="${label}">${opts.map(([v,t])=>`<button type="button" data-v="${v}" aria-pressed="${v===val}">${t}</button>`).join("")}</div>`}
function bindSeg(id,cb){const el=$(id);el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!el.isConnected)return;
  el.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));cb(b.dataset.v)})}
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
show(location.hash.slice(1)||TRUNK[0].id,false);
