// ===================== MOTOR DE LA RUTA =====================
const ALL=[]; TRUNK.forEach(s=>ALL.push(Object.assign(s,{kind:"t"})));
BRANCHES.forEach(g=>g.items.forEach(it=>ALL.push(Object.assign(it,{kind:"b",grp:g}))));
WORKSHOPS.forEach(w=>ALL.push(Object.assign(w,{kind:"w"})));
const LESSONS=ALL.filter(s=>s.kind!=="w");
const byId=id=>ALL.find(s=>s.id===id);
const KEY="ruta-est2-done";
let done={}; try{done=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){done={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(done))}catch(e){}}
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $=id=>document.getElementById(id);
const trunkEl=$("trunk"), brEl=$("branches"), les=$("lesson");
let cur=null;
const NW='<span class="tag nw">Nuevo</span>';

function typeset(el){if(window.MathJax&&MathJax.typesetPromise){try{MathJax.typesetClear&&MathJax.typesetClear([el])}catch(e){}MathJax.typesetPromise([el]).catch(()=>{})}}

function renderMap(){
  trunkEl.innerHTML=TRUNK.map((s,i)=>`<li><button class="st ${done[s.id]?"done":""} ${cur===s.id?"on":""}" type="button" data-go="${s.id}">
    <span class="dot">${done[s.id]?"✓":i+1}</span><span class="nm">${s.t}</span></button></li>`).join("");
  brEl.innerHTML=BRANCHES.map(b=>`<div class="bgrp"><h4>${b.g}</h4><small>Sale de: ${byId(b.from).t}</small><div class="chips">${
    b.items.map(it=>`<button class="chip ${cur===it.id?"on":""} ${done[it.id]?"done":""}" type="button" data-go="${it.id}">${it.t}${it.nuevo?'<span class="nwdot">nuevo</span>':""}</button>`).join("")}</div></div>`).join("");
  $("talleres").innerHTML=`<div class="wsgrp"><small>Herramientas para practicar</small><div class="chips">${WORKSHOPS.map(w=>`<button class="chip ws-chip ${cur===w.id?"on":""}" type="button" data-go="${w.id}">${w.t}</button>`).join("")}</div></div>`;
  const n=LESSONS.filter(s=>done[s.id]).length;
  $("pbar").style.width=(n/LESSONS.length*100)+"%";
  $("ptxt").textContent=`${n} de ${LESSONS.length} temas dominados`;
  requestAnimationFrame(moveTrain);
}
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
function show(id,scroll){
  const s=byId(id)||TRUNK[0]; const prevIdx=ALL.findIndex(x=>x.id===cur); cur=s.id;
  const i=ALL.indexOf(s), prev=ALL[i-1], next=ALL[i+1];
  const eyebrow=s.kind==="t"
    ? `<span>Estación ${i+1} de ${TRUNK.length} · módulo de Economiapp</span>`
    : s.kind==="b" ? `<span class="tag br">Rama</span>${s.nuevo?NW:""}<span>${s.grp.g} · sale de ${byId(s.grp.from).t}</span>`
    : `<span class="tag ws">Taller</span>${NW}<span>Herramienta interactiva</span>`;
  const rel=WORKSHOPS.filter(w=>w.links.includes(s.id));
  const relHtml=s.kind==="w"
    ? `<div class="relws"><span class="lbl">Lecciones relacionadas</span>${s.links.map(l=>`<button class="btn" type="button" data-go="${l}">${byId(l).t}</button>`).join("")}</div>`
    : rel.length?`<div class="relws"><span class="lbl">Practica en</span>${rel.map(w=>`<button class="btn" type="button" data-go="${w.id}">${w.t} →</button>`).join("")}</div>`:"";
  les.innerHTML=`<div><div class="eyebrow">${eyebrow}</div><h2>${s.t}</h2></div>
    ${s.kind==="w"?`<p class="lead" style="margin:0">${s.d}</p>`:""}
    ${s.html}
    ${relHtml}
    ${deepBlock(s)}
    ${quizBlock(s)}
    <div class="foot">${s.kind!=="w"?`<label for="chk"><input type="checkbox" id="chk" ${done[s.id]?"checked":""}> Ya lo domino</label>`:"<span></span>"}
      <div class="row">${prev?`<button class="btn" type="button" data-go="${prev.id}">← ${prev.t}</button>`:""}${next?`<button class="btn solid" type="button" data-go="${next.id}">${next.t} →</button>`:""}</div></div>`;
  [...les.children].forEach((c,k)=>c.style.setProperty("--i",k));
  if(!reduce && prevIdx>=0 && les.animate){
    const dir=i>=prevIdx?1:-1;
    les.animate([{transform:"translateX("+(dir*36)+"px)",opacity:.35},{transform:"none",opacity:1}],{duration:420,easing:"cubic-bezier(.2,.7,.2,1)"});
  }
  const ck=$("chk");
  if(ck) ck.onchange=e=>{done[s.id]=e.target.checked;save();renderMap()};
  if(s.sim) try{SIMS[s.sim]()}catch(err){const b=$("sim");if(b)b.innerHTML=`<p class="err">El laboratorio no pudo cargarse: ${esc(String(err.message||err))}</p>`}
  renderMap();
  typeset(les);
  if(scroll){ if(window.matchMedia("(max-width:860px)").matches) les.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"}); else window.scrollTo({top:0,behavior:reduce?"auto":"smooth"}); }
}
document.addEventListener("click",e=>{
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
  const i=ALL.findIndex(x=>x.id===cur);
  if(e.key==="ArrowRight"&&ALL[i+1]) location.hash=ALL[i+1].id;
  if(e.key==="ArrowLeft"&&ALL[i-1]) location.hash=ALL[i-1].id;
});
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
const SIMS={};

// ---- Estimadores: una muestra y 1.000 repeticiones
SIMS.estim=function(){
  let seed=20261029;
  $("sim").innerHTML=`<p>Define la población y extrae muestras, como en el botón de Economiapp. Además se repite el muestreo 1.000 veces para ver las propiedades en acción.</p>
  <div class="ctr">${ctl("e-mu","Media poblacional (μ)",0,100,0.5,50)}${ctl("e-sg","Desviación estándar (σ)",1,30,0.5,10)}${ctl("e-n","Tamaño de muestra (n)",2,200,1,30)}</div>
  <div class="row"><button class="btn solid" type="button" id="e-new">Extraer nueva muestra</button></div>
  <h4 class="subh">Tu muestra</h4><div class="res" id="e-one"></div>
  <h4 class="subh">Si repites el muestreo 1.000 veces</h4>
  <div class="legend"><span><i style="background:var(--line);height:10px;opacity:.5"></i>Medias muestrales obtenidas</span><span><i style="background:var(--ink)"></i>Normal(μ, σ²/n) de la teoría</span></div>
  <div class="plot" id="e-plot"></div><div class="res" id="e-many"></div><div class="verdict acc" id="e-ver"></div>`;
  const run=()=>{const mu=V("e-mu"),sg=V("e-sg"),n=Math.round(V("e-n"));
    if(!(sg>0)||!(n>=2)||!isFinite(mu)){$("e-one").innerHTML=err("σ debe ser positiva y n al menos 2.");return}
    const K=1000,R=rng(seed),Z=normals(R,K*n),means=new Float64Array(K);let sS=0,sB=0;
    for(let k=0;k<K;k++){const x=Array.from(Z.subarray(k*n,(k+1)*n),z=>mu+sg*z),r=CALC.muestra(x,mu);means[k]=r.media_muestral;sS+=r.var_insesgada;sB+=r.var_sesgada;
      if(k===0)$("e-one").innerHTML=tiles([["Media muestral x̄",fmt(r.media_muestral)],["Error |x̄ − μ|",fmt(r.error_media)],["S² (divide por n − 1)",fmt(r.var_insesgada),"okt"],["σ̂² (divide por n)",fmt(r.var_sesgada),"badt"]])}
    let m=0;for(const v of means)m+=v;m/=K;let vm=0;for(const v of means)vm+=(v-m)**2;vm/=K-1;
    const se=sg/Math.sqrt(n),lo=mu-4*se,hi=mu+4*se,B=32,w=(hi-lo)/B,cnt=new Array(B).fill(0);
    for(const v of means){const j=Math.floor((v-lo)/w);if(j>=0&&j<B)cnt[j]++}
    const ym=Math.max(...cnt,K*w*npdf(0)/se)*1.15;
    const f=frame(600,250,[lo,hi],[0,ym],ticks(lo,hi,nice((hi-lo)/6)),ticks(0,ym,nice(ym/4)),"x̄","frecuencia");
    let b=cnt.map((c,j)=>`<rect x="${f.sx(lo+j*w)+1}" y="${f.sy(c)}" width="${Math.max(0,f.sx(lo+w)-f.sx(lo)-2)}" height="${f.sy(0)-f.sy(c)}" fill="var(--line)" fill-opacity=".45"/>`).join("");
    let d="";for(let i=0;i<=160;i++){const x=lo+(hi-lo)*i/160;d+=(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(K*w*npdf((x-mu)/se)/se).toFixed(1)}
    b+=`<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="${f.sx(mu)}" x2="${f.sx(mu)}" y1="${f.sy(ym)}" y2="${f.sy(0)}" stroke="var(--bad)" stroke-dasharray="5 4" stroke-width="1.5"/><text x="${f.sx(mu)+5}" y="${f.sy(ym)+12}" font-size="11.5" fill="var(--bad)">μ = ${fm(mu)}</text>`;
    $("e-plot").innerHTML=`<svg viewBox="0 0 600 250" role="img" aria-label="Histograma de 1.000 medias muestrales con la normal teórica">${f.g}${b}</svg>`;
    const s2=sg*sg;
    $("e-many").innerHTML=tiles([["Promedio de x̄ (μ = "+fm(mu)+")",fmt(m)],["Varianza de x̄ (σ²/n = "+fmt(s2/n,3)+")",fmt(vm,3)],["Promedio de S²",fmt(sS/K)],["Promedio de σ̂²",fmt(sB/K)],["σ² verdadera",fmt(s2)]]);
    $("e-ver").innerHTML=`En promedio S² = ${fmt(sS/K)} queda junto a σ² = ${fmt(s2)}: es insesgado. σ̂² = ${fmt(sB/K)} la subestima; la teoría predice (n − 1)/n · σ² = ${fmt(s2*(n-1)/n)}. Sube n y verás que las medias se concentran alrededor de μ (consistencia) y que el sesgo de σ̂² desaparece.`};
  bindCtl(["e-mu","e-sg","e-n"],run);
  $("e-new").onclick=()=>{seed=(seed*1103515245+12345)>>>0;run()};
  run();
};

// ---- Máxima verosimilitud: curva de ln L(μ)
SIMS.mle=function(){
  const R=rng(12),X=Array.from(normals(R,12),z=>+(50+10*z).toFixed(1)),n=X.length,sg=10,xb=X.reduce((a,b)=>a+b)/n;
  const lnL=mu=>-n/2*Math.log(2*Math.PI*sg*sg)-X.reduce((s,x)=>s+(x-mu)**2,0)/(2*sg*sg);
  $("sim").innerHTML=`<p>Una muestra fija de 12 datos de una normal con σ = 10 conocida: <span class="mono">${X.map(v=>fmt(v,1)).join(" · ")}</span>. Mueve la μ candidata y mira cómo cambia la log-verosimilitud.</p>
  <div class="ctr">${ctl("m-mu","μ candidata",35,65,0.1,44)}</div>
  <div class="plot" id="m-plot"></div><div class="res" id="m-res"></div>
  <div class="row"><button class="btn solid" type="button" id="m-max">Ir al máximo</button><span id="m-msg" class="hint"></span></div>`;
  const run=()=>{const mu=V("m-mu");if(!isFinite(mu))return;const lo=35,hi=65,ys=[];for(let i=0;i<=150;i++)ys.push(lnL(lo+(hi-lo)*i/150));
    const y0=Math.min(...ys),y1=lnL(xb),pad=(y1-y0)*.12;const f=frame(600,260,[lo,hi],[y0-pad,y1+pad],ticks(lo,hi,5),ticks(y0-pad,y1+pad,nice((y1-y0)/4)),"μ","ln L(μ)");
    let b=`<path d="${ys.map((y,i)=>(i?"L":"M")+f.sx(lo+(hi-lo)*i/150).toFixed(1)+","+f.sy(y).toFixed(1)).join("")}" fill="none" stroke="var(--line)" stroke-width="2.5"/>`;
    b+=`<line x1="${f.sx(xb)}" x2="${f.sx(xb)}" y1="${f.sy(y1+pad)}" y2="${f.sy(y0-pad)}" stroke="var(--muted)" stroke-dasharray="5 4"/><text x="${f.sx(xb)+5}" y="${f.sy(y1+pad)+12}" font-size="11.5" fill="var(--muted)">x̄ = ${fm(xb)}</text>`;
    const m=Math.max(lo,Math.min(hi,mu)),sl=X.reduce((s,x)=>s+(x-m),0)/(sg*sg),yv=lnL(m),dx=2.5;
    b+=`<line x1="${f.sx(m-dx)}" y1="${f.sy(yv-sl*dx)}" x2="${f.sx(m+dx)}" y2="${f.sy(yv+sl*dx)}" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${f.sx(m)}" cy="${f.sy(yv)}" r="6" fill="var(--ink)"/>`;
    $("m-plot").innerHTML=`<svg viewBox="0 0 600 260" role="img" aria-label="Log-verosimilitud en función de μ">${f.g}${b}</svg>`;
    $("m-res").innerHTML=tiles([["ln L en la candidata",fmt(yv,3)],["ln L máxima",fmt(y1,3)],["Pendiente ∂ln L/∂μ",fmt(sl,3)],["μ̂ MV = x̄",fmt(xb,3)]]);
    $("m-msg").textContent=Math.abs(m-xb)<0.05?"La pendiente es cero: llegaste al máximo, que es x̄.":sl>0?"Pendiente positiva: subir μ aumenta la verosimilitud.":"Pendiente negativa: bajar μ aumenta la verosimilitud."};
  bindCtl(["m-mu"],run);$("m-max").onclick=()=>{$("m-mu").value=+xb.toFixed(2);$("m-mu-r").value=xb;run()};run();
};

// ---- Intervalos y tamaño de muestra (módulo de Economiapp)
SIMS.ic=function(){
  const NIV={"90":1.645,"95":1.96,"99":2.576};let nv="95";
  $("sim").innerHTML=`<div class="lbl">Nivel de confianza (1 − α)</div>${seg("i-nv","Nivel de confianza",[["90","90 % (Z = 1,645)"],["95","95 % (Z = 1,960)"],["99","99 % (Z = 2,576)"]],nv)}
  <div class="ctr">${ctl("i-xb","Media muestral (x̄)",0,300,0.5,105)}${ctl("i-sg","Desviación estándar (σ)",0.5,60,0.5,15)}${ctl("i-n","Tamaño de muestra actual (n)",2,1000,1,100)}${ctl("i-E","Margen de error deseado (E)",0.25,30,0.25,5)}</div>
  <h4 class="subh">Intervalo de confianza</h4><div class="res" id="i-res"></div><div class="plot" id="i-plot"></div><p id="i-int" style="margin:0"></p>
  <h4 class="subh">Tamaño de muestra requerido</h4><div id="i-n2"></div>`;
  const run=()=>{const Z=NIV[nv],v={x_bar:V("i-xb"),sigma:V("i-sg"),n_actual:Math.round(V("i-n")),E:V("i-E"),Z};
    if(!(v.sigma>0)||!(v.n_actual>=1)||!(v.E>0)||!isFinite(v.x_bar)){$("i-res").innerHTML=err("σ y E deben ser positivos y n al menos 1.");return}
    const r=CALC.intervalo(v),se=r.error_estandar;
    $("i-res").innerHTML=tiles([["Límite inferior",fmt(r.lim_inf)],["Media puntual x̄",fmt(v.x_bar)],["Límite superior",fmt(r.lim_sup)],["Error estándar σ/√n",fmt(se,3)],["Margen Z·σ/√n",fmt(r.margen_error_actual,3)]]);
    const pdf=x=>npdf((x-v.x_bar)/se)/se;
    $("i-plot").innerHTML=curvePlot({lo:v.x_bar-4*se,hi:v.x_bar+4*se,curves:[{f:pdf}],areas:[{f:pdf,a:r.lim_inf,b:r.lim_sup,col:"--line",op:.3}],
      marks:[{x:r.lim_inf,label:fmt(r.lim_inf),col:"--line",dash:1},{x:r.lim_sup,label:fmt(r.lim_sup),col:"--line",dash:1}],xl:"medias muestrales",label:"Distribución de las medias muestrales con el intervalo sombreado"});
    $("i-int").innerHTML=`<b>Interpretación:</b> con el procedimiento al ${nv} %, el intervalo para la media poblacional va de <b>${fmt(r.lim_inf)}</b> a <b>${fmt(r.lim_sup)}</b>. El área sombreada equivale al ${nv} % de las medias muestrales posibles.`;
    const nr=r.n_requerido,raw=((Z*v.sigma)/v.E)**2;
    $("i-n2").innerHTML=`<div class="eq">n = (${fr(`${fm(Z)} · ${fm(v.sigma)}`,fm(v.E))})² = ${fmt(raw,2)} &nbsp;→&nbsp; <b>${nr.toLocaleString("es-CO")}</b><span class="note">Si quieres que la estimación no falle por más de ±${fm(v.E)} con ${nv} % de confianza, se redondea hacia arriba.</span></div>`+
      (nr>v.n_actual?`<div class="verdict warnv">Te faltan ${(nr-v.n_actual).toLocaleString("es-CO")} observaciones para alcanzar esa precisión.</div>`:`<div class="verdict acc">Tu muestra actual (${v.n_actual.toLocaleString("es-CO")}) ya es suficiente para ese margen de error.</div>`)};
  bindCtl(["i-xb","i-sg","i-n","i-E"],run);bindSeg("i-nv",x=>{nv=x;run()});run();
};

// ---- Cobertura: 50 intervalos
SIMS.cob=function(){
  const NIV={"90":1.645,"95":1.96,"99":2.576};let nv="95",seed=7,acc=[0,0];
  $("sim").innerHTML=`${seg("c-nv","Nivel de confianza",[["90","90 %"],["95","95 %"],["99","99 %"]],nv)}
  <div class="ctr">${ctl("c-n","Tamaño de cada muestra (n)",5,200,1,25)}</div>
  <div class="row"><button class="btn solid" type="button" id="c-new">Sacar 50 muestras nuevas</button></div>
  <div class="legend"><span><i style="background:var(--line)"></i>Contiene a μ</span><span><i style="background:var(--bad)"></i>No contiene a μ</span></div>
  <div class="plot" id="c-plot"></div><div class="res" id="c-res"></div>`;
  const mu=100,sg=15;
  const run=(add)=>{const n=Math.round(V("c-n"));if(!(n>=2))return;const Z=NIV[nv],se=sg/Math.sqrt(n),R=rng(seed),K=50,E=normals(R,K*n);
    const iv=[];let hit=0;for(let k=0;k<K;k++){let s=0;for(let i=0;i<n;i++)s+=mu+sg*E[k*n+i];const xb=s/n,ok=Math.abs(xb-mu)<=Z*se;hit+=ok;iv.push([xb-Z*se,xb+Z*se,ok])}
    if(add){acc[0]+=hit;acc[1]+=K}
    const H=K*7+48,lo=mu-6*se,hi=mu+6*se,f=frame(600,H,[lo,hi],[0,K+1],ticks(lo,hi,nice((hi-lo)/6)),[],"valor de la media","");
    let b=`<line x1="${f.sx(mu)}" x2="${f.sx(mu)}" y1="${f.T}" y2="${f.sy(0)}" stroke="var(--ink)" stroke-width="1.5"/><text x="${f.sx(mu)+5}" y="${f.T+9}" font-size="11.5" fill="var(--ink)">μ = 100</text>`;
    iv.forEach(([a,c,ok],k)=>{const y=f.sy(K-k);b+=`<line x1="${f.sx(Math.max(lo,a))}" x2="${f.sx(Math.min(hi,c))}" y1="${y}" y2="${y}" stroke="var(${ok?"--line":"--bad"})" stroke-width="${ok?2:3}" stroke-linecap="round"/>`});
    $("c-plot").innerHTML=`<svg viewBox="0 0 600 ${H}" role="img" aria-label="Cincuenta intervalos de confianza y la media verdadera">${f.g}${b}</svg>`;
    $("c-res").innerHTML=tiles([["Contienen a μ",`${hit} de ${K}`],["Proporción",fmt(hit/K*100,0)+" %"],["Se esperaba",nv+" %"],["Acumulado",acc[1]?`${fmt(acc[0]/acc[1]*100,1)} % de ${acc[1].toLocaleString("es-CO")}`:"—"]])};
  bindCtl(["c-n"],()=>{acc=[0,0];run(true)});
  bindSeg("c-nv",x=>{nv=x;acc=[0,0];run(true)});
  $("c-new").onclick=()=>{seed=(seed*1664525+1013904223)>>>0;run(true)};run(true);
};

// ---- Pruebas de hipótesis (módulo de Economiapp)
SIMS.prueba=function(){
  const CFG={
    z:[["mu_0","Media hipotética (μ₀)",0,200,0.5,50],["x_bar","Media muestral (x̄)",0,200,0.5,52],["sigma","Desv. est. poblacional (σ)",0.1,50,0.1,5],["n","Tamaño muestral (n)",2,500,1,30],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    t:[["mu_0","Media hipotética (μ₀)",0,200,0.5,50],["x_bar","Media muestral (x̄)",0,200,0.5,52],["s","Desv. est. muestral (s)",0.1,50,0.1,5.5],["n","Tamaño muestral (n)",2,500,1,20],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    p:[["p_0","Prop. hipotética (p₀)",0.01,0.99,0.01,0.5],["p_hat","Prop. muestral (p̂)",0,1,0.01,0.6],["n","Tamaño muestral (n)",2,2000,1,100],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]]};
  const mem={z:{},t:{},p:{}};let tipo="z",cola="dos";
  $("sim").innerHTML=`<div class="lbl">Parámetro y estadístico</div>${seg("h-tipo","Parámetro y estadístico",[["z","Media, σ conocida (Z)"],["t","Media, σ desconocida (t)"],["p","Proporción (Z)"]],tipo)}
  <div class="lbl">Hipótesis alternativa</div>${seg("h-cola","Tipo de prueba",COLAS,cola)}
  <div class="ctr" id="h-in"></div><div id="h-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const build=()=>{$("h-in").innerHTML=CFG[tipo].map(([k,l,a,b,s,d])=>ctl(`h${tipo}-${k}`,l,a,b,s,mem[tipo][k]??d)).join("");bindCtl(CFG[tipo].map(c=>`h${tipo}-${c[0]}`),run)};
  const run=()=>{const v={};CFG[tipo].forEach(([k])=>{v[k]=V(`h${tipo}-${k}`);mem[tipo][k]=v[k]});v.n=Math.round(v.n);
    const bad=!(v.n>=2)||!(v.alpha>0&&v.alpha<1)||(tipo==="p"?!(v.p_0>0&&v.p_0<1&&v.p_hat>=0&&v.p_hat<=1):!(isFinite(v.mu_0)&&isFinite(v.x_bar)&&(tipo==="z"?v.sigma>0:v.s>0)));
    if(bad){$("h-out").innerHTML=err(tipo==="p"?"p₀ debe estar entre 0 y 1, p̂ entre 0 y 1, n ≥ 2 y 0 < α < 1.":"la desviación debe ser positiva, n ≥ 2 y 0 < α < 1.");return}
    const r=CALC.prueba(tipo,cola,v),par=tipo==="p"?"p":"μ",nm=tipo==="t"?"T":"Z",[o0,o1]=OPS[cola];
    const sub=tipo==="p"?`Z = ${fr("p̂ − p₀",rt(fr("p₀(1 − p₀)","n")))} = ${fr(`${fm(v.p_hat)} − ${fm(v.p_0)}`,rt(fr(`${fm(v.p_0)}(1 − ${fm(v.p_0)})`,fm(v.n))))} = <b>${fmt(r.stat,3)}</b>`
      :`${nm} = ${fr("x̄ − μ₀",`${tipo==="t"?"s":"σ"} / √n`)} = ${fr(`${fm(v.x_bar)} − ${fm(v.mu_0)}`,`${fm(tipo==="t"?v.s:v.sigma)} / √${fm(v.n)}`)} = <b>${fmt(r.stat,3)}</b>`;
    const crit=cola==="dos"?`±${fmt(r.critico,3)}`:fmt(r.critico,3),rej=r.rechaza_por_p;
    const desc={dos:"diferente de",der:"mayor que",izq:"menor que"}[cola];
    let h=`<div class="hyp"><span>H₀: ${par} ${o0} ${fm(r.valor_hip)}</span><span>H₁: ${par} ${o1} ${fm(r.valor_hip)}</span></div>`;
    h+=stp(1,`Estadístico de prueba (${nm}<sub>calc</sub>)`,`<div class="eq">${sub}<span class="note">Error estándar: ${fmt(r.error_estandar,4)} · Distribución: ${distOf(r.dist)}</span></div>`);
    h+=stp(2,"Valor crítico, p-valor y veredicto",`<div class="res">${tiles([["Valor crítico",crit],["p-valor",pf(r.p_valor)],["α",fm(v.alpha)]])}</div>${rejPlot(r.dist,cola,[r.critico],r.stat,nm)}`+
      verdict(rej,`Como p-valor (${pf(r.p_valor)}) &lt; α (${fm(v.alpha)}), se rechaza H₀. Hay evidencia estadística suficiente para afirmar que ${par} es ${desc} ${fm(r.valor_hip)}.`,
        `Como p-valor (${pf(r.p_valor)}) ≥ α (${fm(v.alpha)}), no se rechaza H₀. La diferencia entre tu muestra (${fm(r.valor_mue)}) y la hipótesis (${fm(r.valor_hip)}) no es estadísticamente significativa; puede deberse al azar del muestreo.`));
    h+=stp(3,"Dualidad con el intervalo de confianza",cola==="dos"
      ?`<div class="eq">IC<sub>${fmt((1-v.alpha)*100,1)} %</sub> = [ ${fmt(r.ic_inf,4)} ; ${fmt(r.ic_sup,4)} ]</div><p>${r.dentro?`El valor hipotético ${par}₀ = ${fm(r.valor_hip)} <b>está dentro</b> del intervalo: es un valor razonable, así que no se rechaza H₀.`:`El valor hipotético ${par}₀ = ${fm(r.valor_hip)} <b>cae afuera</b> del intervalo: es muy improbable que sea el verdadero valor, así que se rechaza H₀.`}${tipo==="p"?" En proporciones el intervalo usa p̂ en el error estándar, así que la equivalencia es aproximada.":""}</p>`
      :`<p class="hint" style="margin:0">La equivalencia exacta con los intervalos de confianza estándar se ve en las pruebas de dos colas. Estás usando una prueba de una cola.</p>`);
    $("h-out").innerHTML=h};
  bindSeg("h-tipo",x=>{tipo=x;build();run()});bindSeg("h-cola",x=>{cola=x;run()});build();run();
};

// ---- Potencia (rama nueva)
SIMS.pot=function(){
  let cola="der";const mu0=50;
  $("sim").innerHTML=`${seg("p-cola","Tipo de prueba",[["der","Cola derecha (>)"],["dos","Dos colas (≠)"]],cola)}
  <div class="ctr">${ctl("p-mu1","Media verdadera (μ₁)",40,65,0.1,53)}${ctl("p-sg","Desviación estándar (σ)",1,20,0.1,5)}${ctl("p-n","Tamaño de muestra (n)",2,300,1,30)}${ctl("p-al","Significancia (α)",0.001,0.2,0.001,0.05)}</div>
  <div class="legend"><span><i style="background:var(--muted)"></i>x̄ si H₀ es cierta (μ₀ = 50)</span><span><i style="background:var(--line)"></i>x̄ si la media es μ₁</span><span><i style="background:var(--bad);height:8px;opacity:.4"></i>α</span><span><i style="background:var(--branch);height:8px;opacity:.5"></i>β</span></div>
  <div id="p-plot"></div><div class="res" id="p-res"></div><div class="verdict" id="p-ver"></div>`;
  const run=()=>{const v={mu0,mu1:V("p-mu1"),sigma:V("p-sg"),n:Math.round(V("p-n")),alpha:V("p-al"),cola};
    if(!(v.sigma>0)||!(v.n>=2)||!(v.alpha>0&&v.alpha<1)||!isFinite(v.mu1)){$("p-res").innerHTML=err("σ positiva, n ≥ 2 y 0 < α < 1.");return}
    const r=CALC.potencia(v),se=r.se,f0=x=>npdf((x-mu0)/se)/se,f1=x=>npdf((x-v.mu1)/se)/se,lo=Math.min(mu0,v.mu1)-4.2*se,hi=Math.max(mu0,v.mu1)+4.2*se;
    const areas=cola==="der"?[{f:f0,a:r.c[0],b:hi,col:"--bad",op:.35},{f:f1,a:lo,b:r.c[0],col:"--branch",op:.4}]
      :[{f:f0,a:lo,b:r.c[0],col:"--bad",op:.35},{f:f0,a:r.c[1],b:hi,col:"--bad",op:.35},{f:f1,a:r.c[0],b:r.c[1],col:"--branch",op:.4}];
    $("p-plot").innerHTML=curvePlot({lo,hi,curves:[{f:f0,col:"--muted"},{f:f1,col:"--line",w:2.5}],areas,marks:r.c.map(c=>({x:c,label:`crítico x̄ = ${fm(c)}`,col:"--ink",dash:1})),xl:"x̄",H:250,label:"Distribuciones de la media bajo H₀ y bajo H₁ con las áreas α y β"});
    const pw=r.potencia;
    $("p-res").innerHTML=tiles([["Error estándar",fmt(se,3)],[cola==="der"?"Valor crítico de x̄":"Valores críticos de x̄",r.c.map(c=>fmt(c,2)).join(" y ")],["β (error tipo II)",fmt(1-pw,3)],["Potencia 1 − β",fmt(pw,3)]]);
    const ve=$("p-ver");ve.className="verdict "+(pw>=.8?"acc":"warnv");
    ve.textContent=Math.abs(v.mu1-mu0)<1e-9?`Si μ₁ = μ₀, H₀ es cierta y la probabilidad de rechazar es α = ${fm(v.alpha)}.`
      :`Si la media verdadera es ${fm(v.mu1)}, la prueba la detecta el ${fmt(pw*100,1)} % de las veces.${pw<.8?" Por debajo del 80 % que se suele exigir: prueba subiendo n.":""}`};
  bindCtl(["p-mu1","p-sg","p-n","p-al"],run);bindSeg("p-cola",x=>{cola=x;run()});run();
};

// ---- Pruebas avanzadas (módulo de Economiapp)
SIMS.avanz=function(){
  const CFG={
    difp:[["x1","Éxitos muestra 1 (x₁)",0,1000,1,45],["n1","Tamaño muestra 1 (n₁)",1,1000,1,100],["x2","Éxitos muestra 2 (x₂)",0,1000,1,30],["n2","Tamaño muestra 2 (n₂)",1,1000,1,80],["d0","Diferencia hipotética (d₀)",-1,1,0.01,0],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    var:[["n","Tamaño muestral (n)",2,500,1,30],["s2","Varianza muestral (S²)",0.1,100,0.1,12.5],["sigma2_0","Varianza hipotética (σ²₀)",0.1,100,0.1,10],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    cov:[["n1","Tamaño muestra 1 (n₁)",2,500,1,25],["s2_1","Varianza muestral 1 (S²₁)",0.1,100,0.1,15],["n2","Tamaño muestra 2 (n₂)",2,500,1,20],["s2_2","Varianza muestral 2 (S²₂)",0.1,100,0.1,10],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]]};
  const mem={difp:{},var:{},cov:{}};let tipo="difp",cola="dos";
  $("sim").innerHTML=`<div class="lbl">Prueba</div>${seg("a-tipo","Prueba a realizar",[["difp","Diferencia de proporciones"],["var","Una varianza"],["cov","Cociente de varianzas"]],tipo)}
  <div class="lbl">Hipótesis alternativa</div>${seg("a-cola","Tipo de prueba",COLAS,cola)}
  <div class="ctr" id="a-in"></div><div id="a-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const build=()=>{$("a-in").innerHTML=CFG[tipo].map(([k,l,a,b,s,d])=>ctl(`a${tipo}-${k}`,l,a,b,s,mem[tipo][k]??d)).join("");bindCtl(CFG[tipo].map(c=>`a${tipo}-${c[0]}`),run)};
  const run=()=>{const v={};CFG[tipo].forEach(([k])=>{v[k]=V(`a${tipo}-${k}`);mem[tipo][k]=v[k]});["n","n1","n2","x1","x2"].forEach(k=>{if(k in v)v[k]=Math.round(v[k])});
    let msg="";if(!(v.alpha>0&&v.alpha<1))msg="0 < α < 1.";
    if(tipo==="difp"){if(!(v.n1>=1&&v.n2>=1&&v.x1>=0&&v.x2>=0&&v.x1<=v.n1&&v.x2<=v.n2))msg="los éxitos no pueden superar el tamaño de cada muestra.";else if(v.x1+v.x2===0||v.x1+v.x2===v.n1+v.n2)msg="p* queda en 0 o 1 y el error estándar se anula.";}
    if(tipo==="var"&&!(v.n>=2&&v.s2>0&&v.sigma2_0>0))msg="n ≥ 2 y varianzas positivas.";
    if(tipo==="cov"&&!(v.n1>=2&&v.n2>=2&&v.s2_1>0&&v.s2_2>0))msg="n ≥ 2 en cada muestra y varianzas positivas.";
    if(msg){$("a-out").innerHTML=err(msg);return}
    const r=CALC.avanzada(tipo,cola,v),[o0,o1]=OPS[cola];let hyp,s1,lbl;
    if(tipo==="difp"){hyp=[`H₀: p₁ − p₂ ${o0} ${fm(v.d0)}`,`H₁: p₁ − p₂ ${o1} ${fm(v.d0)}`];lbl="Z";
      s1=`<div class="eq">p̂₁ = ${fr(fm(v.x1),fm(v.n1))} = ${fmt(r.p_hat1,4)} &nbsp; p̂₂ = ${fr(fm(v.x2),fm(v.n2))} = ${fmt(r.p_hat2,4)} &nbsp; p* = ${fr(`${fm(v.x1)} + ${fm(v.x2)}`,`${fm(v.n1)} + ${fm(v.n2)}`)} = ${fmt(r.p_star,4)}</div>
      <div class="eq">Z<sub>c</sub> = ${fr(`(p̂₁ − p̂₂) − d₀`,rt(`${fr("p*(1 − p*)","n₁")} + ${fr("p*(1 − p*)","n₂")}`))} = ${fr(`(${fmt(r.p_hat1,4)} − ${fmt(r.p_hat2,4)}) − ${fm(v.d0)}`,rt(`${fr(`${fmt(r.p_star,4)}(1 − ${fmt(r.p_star,4)})`,fm(v.n1))} + ${fr(`${fmt(r.p_star,4)}(1 − ${fmt(r.p_star,4)})`,fm(v.n2))}`))} = <b>${fmt(r.stat,4)}</b></div>`}
    else if(tipo==="var"){hyp=[`H₀: σ² ${o0} ${fm(v.sigma2_0)}`,`H₁: σ² ${o1} ${fm(v.sigma2_0)}`];lbl="χ²";
      s1=`<div class="eq">χ²<sub>c</sub> = ${fr("(n − 1) S²","σ²₀")} = ${fr(`(${fm(v.n)} − 1) · ${fm(v.s2)}`,fm(v.sigma2_0))} = <b>${fmt(r.stat,4)}</b><span class="note">Distribución: ${distOf(r.dist)}</span></div>`}
    else{hyp=[`H₀: σ₁² ${o0} σ₂²`,`H₁: σ₁² ${o1} σ₂²`];lbl="F";
      s1=`<div class="eq">F<sub>c</sub> = ${fr("S²₁","S²₂")} = ${fr(fm(v.s2_1),fm(v.s2_2))} = <b>${fmt(r.stat,4)}</b><span class="note">Distribución: ${distOf(r.dist)}</span></div>`}
    const crit=r.criticos.map(c=>fmt(c,3)).join(" y "),rej=r.rechaza_por_p;
    let h=`<div class="hyp"><span>${hyp[0]}</span><span>${hyp[1]}</span></div>`;
    h+=stp(1,`Estadístico de prueba (${lbl}<sub>c</sub>)`,s1);
    h+=stp(2,"p-valor y veredicto",`<div class="res">${tiles([["p-valor",pf(r.p_valor)],["α",fm(v.alpha)],[r.criticos.length>1?"Valores críticos":"Valor crítico",crit]])}</div>
      <p class="hint" style="margin:0">${NW} Economiapp decide solo con el p-valor; los valores críticos se agregan para leerlo también con la tabla.</p>${rejPlot(r.dist,cola,r.criticos,r.stat,lbl)}`+
      verdict(rej,`Como p-valor (${pf(r.p_valor)}) &lt; α (${fm(v.alpha)}), se rechaza H₀.`,`Como p-valor (${pf(r.p_valor)}) ≥ α (${fm(v.alpha)}), no se rechaza H₀.`));
    $("a-out").innerHTML=h};
  bindSeg("a-tipo",x=>{tipo=x;build();run()});bindSeg("a-cola",x=>{cola=x;run()});build();run();
};

// ---- Diferencia de medias, Welch (rama nueva)
SIMS.welch=function(){
  let cola="dos";
  $("sim").innerHTML=`<div class="lbl">Hipótesis alternativa</div>${seg("w-cola","Tipo de prueba",COLAS,cola)}
  <div class="ctr">${ctl("w-x1","Media muestra 1 (x̄₁)",0,200,0.5,72)}${ctl("w-s1","Varianza muestra 1 (S²₁)",0.1,500,0.1,64)}${ctl("w-n1","Tamaño muestra 1 (n₁)",2,500,1,40)}
  ${ctl("w-x2","Media muestra 2 (x̄₂)",0,200,0.5,68)}${ctl("w-s2","Varianza muestra 2 (S²₂)",0.1,500,0.1,100)}${ctl("w-n2","Tamaño muestra 2 (n₂)",2,500,1,45)}
  ${ctl("w-d0","Diferencia hipotética (μ₁ − μ₂)",-50,50,0.5,0)}${ctl("w-al","Significancia (α)",0.001,0.2,0.001,0.05)}</div><div id="w-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const run=()=>{const v={x1:V("w-x1"),s2_1:V("w-s1"),n1:Math.round(V("w-n1")),x2:V("w-x2"),s2_2:V("w-s2"),n2:Math.round(V("w-n2")),d0:V("w-d0"),alpha:V("w-al"),cola};
    if(!(v.s2_1>0&&v.s2_2>0&&v.n1>=2&&v.n2>=2&&v.alpha>0&&v.alpha<1)||![v.x1,v.x2,v.d0].every(isFinite)){$("w-out").innerHTML=err("varianzas positivas, n ≥ 2 en cada muestra y 0 < α < 1.");return}
    const r=CALC.welch(v),[o0,o1]=OPS[cola],d=r.dist,cr=cola==="dos"?[d.ppf(v.alpha/2),d.ppf(1-v.alpha/2)]:cola==="der"?[d.ppf(1-v.alpha)]:[d.ppf(v.alpha)];
    let h=`<div class="hyp"><span>H₀: μ₁ − μ₂ ${o0} ${fm(v.d0)}</span><span>H₁: μ₁ − μ₂ ${o1} ${fm(v.d0)}</span></div>`;
    h+=stp(1,"Estadístico de prueba",`<div class="eq">t = ${fr(`(${fm(v.x1)} − ${fm(v.x2)}) − ${fm(v.d0)}`,rt(`${fr(fm(v.s2_1),fm(v.n1))} + ${fr(fm(v.s2_2),fm(v.n2))}`))} = ${fr(fmt(v.x1-v.x2-v.d0,2),fmt(r.error_estandar,4))} = <b>${fmt(r.stat,4)}</b><span class="note">Grados de libertad de Welch: ${fmt(r.gl,2)}</span></div>`);
    h+=stp(2,"p-valor y veredicto",`<div class="res">${tiles([["p-valor",pf(r.p_valor)],["α",fm(v.alpha)],[cr.length>1?"Valores críticos":"Valor crítico",cr.map(c=>fmt(c,3)).join(" y ")]])}</div>${rejPlot(d,cola,cr,r.stat,"t")}`+
      verdict(r.rechaza_por_p,`Como p-valor (${pf(r.p_valor)}) &lt; α (${fm(v.alpha)}), se rechaza H₀: las medias de los dos grupos difieren ${cola==="dos"?"":"en la dirección planteada "}de forma significativa.`,`Como p-valor (${pf(r.p_valor)}) ≥ α (${fm(v.alpha)}), no se rechaza H₀: la diferencia observada puede deberse al azar.`));
    $("w-out").innerHTML=h};
  bindCtl(["w-x1","w-s1","w-n1","w-x2","w-s2","w-n2","w-d0","w-al"],run);bindSeg("w-cola",x=>{cola=x;run()});run();
};

// ---- Taller: tablas de distribuciones
SIMS.tab=function(){
  let dn="t",cola="dos";
  $("sim").innerHTML=`<div class="lbl">Distribución</div>${seg("t-d","Distribución",[["norm","Normal Z"],["t","t de Student"],["chi2","Ji cuadrado"],["f","F de Fisher"]],dn)}
  <div class="lbl">Cola</div>${seg("t-c","Cola",COLAS,cola)}
  <div class="calcf"><label for="t-g1" id="t-l1">Grados de libertad<input id="t-g1" type="number" value="20" min="1" step="1" inputmode="numeric"></label>
  <label for="t-g2" id="t-l2">gl del denominador<input id="t-g2" type="number" value="15" min="1" step="1" inputmode="numeric"></label>
  <label for="t-a">Significancia (α)<input id="t-a" type="number" value="0.05" min="0.0001" max="0.5" step="0.005" inputmode="decimal"></label>
  <label for="t-s">Tu estadístico (opcional)<input id="t-s" type="number" step="0.01" placeholder="Para el p-valor" inputmode="decimal"></label></div>
  <div id="t-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const run=()=>{const g1=+$("t-g1").value,g2=+$("t-g2").value,a=+$("t-a").value,sv=$("t-s").value.trim(),s=sv===""?null:+sv;
    $("t-l1").hidden=dn==="norm";$("t-l2").hidden=dn!=="f";$("t-l1").firstChild.textContent=dn==="f"?"gl del numerador":"Grados de libertad";
    if((dn!=="norm"&&!(g1>0))||(dn==="f"&&!(g2>0))||!(a>0&&a<1)||(s!==null&&!isFinite(s))){$("t-out").innerHTML=err("los grados de libertad deben ser positivos y 0 < α < 1.");return}
    const d=dn==="norm"?DIST.norm():dn==="t"?DIST.t(g1):dn==="chi2"?DIST.chi2(g1):DIST.f(g1,g2);
    const sym=dn==="norm"||dn==="t",cr=cola==="dos"?[d.ppf(a/2),d.ppf(1-a/2)]:cola==="der"?[d.ppf(1-a)]:[d.ppf(a)];
    const nm={norm:"Z",t:"t",chi2:"χ²",f:"F"}[dn];let p=null;
    if(s!==null){const c=d.cdf(s);p=cola==="dos"?(sym?2*(1-d.cdf(Math.abs(s))):Math.min(2*c,2*(1-c))):cola==="der"?1-c:c}
    let h=`<div class="res">${tiles([[cr.length>1?"Valores críticos":"Valor crítico",cr.map(c=>fmt(c,4)).join(" y ")],["Distribución",distOf(d)],["p-valor",p===null?"Escribe un estadístico":pf(p)]])}</div>`;
    h+=rejPlot(d,cola,cr,s===null?NaN:s,nm);
    if(p!==null)h+=verdict(p<a,`Con α = ${fm(a)} se rechaza H₀: el estadístico cae en la región de rechazo.`,`Con α = ${fm(a)} no se rechaza H₀.`);
    h+=`<p class="hint" style="margin:0">${sym&&cola==="dos"?"En distribuciones simétricas los dos críticos son iguales en valor absoluto.":dn==="chi2"||dn==="f"?"En χ² y F el p-valor de dos colas es min{2F(x), 2[1 − F(x)]}, como en Economiapp.":"Una cola: toda el área α queda de un solo lado."}</p>`;
    $("t-out").innerHTML=h};
  ["t-g1","t-g2","t-a","t-s"].forEach(i=>$(i).addEventListener("input",run));
  bindSeg("t-d",x=>{dn=x;run()});bindSeg("t-c",x=>{cola=x;run()});run();
};

show(location.hash.slice(1)||TRUNK[0].id,false);
