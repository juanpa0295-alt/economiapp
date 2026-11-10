// Evaluación de Proyectos · laboratorios interactivos
// ===================== AYUDAS COMUNES DE LOS LABORATORIOS DE MICROECONOMÍA =====================
const SIMS={};
let CLIP=0;
function plotXY({xr,yr,series=[],points=[],vlines=[],hlines=[],xl,yl,H=300,label,areas=[]}){
  const W=600,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/5)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl),id="cp"+(++CLIP);
  let b="";
  areas.forEach(a=>{const d=a.pts.map(([x,y],i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(y).toFixed(1)).join("")+"Z";b+=`<path d="${d}" fill="var(${a.col})" fill-opacity="${a.op||.22}" stroke="none"/>`});
  series.forEach(s=>{const pts=s.pts||[...Array(241)].map((_,i)=>{const x=xr[0]+(xr[1]-xr[0])*i/240;const y=s.f(x);return[x,y==null?NaN:y]});
    let d="",pen=false;pts.forEach(([x,y])=>{if(!isFinite(y)){pen=false;return}d+=(pen?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(Math.max(yr[0]-(yr[1]-yr[0]),Math.min(yr[1]+(yr[1]-yr[0]),y))).toFixed(1);pen=true});
    b+=`<path d="${d}" fill="none" stroke="var(${s.col||"--ink"})" stroke-width="${s.w||2.5}" ${s.dash?`stroke-dasharray="${s.dash}"`:""}/>`});
  vlines.forEach(v=>b+=`<line x1="${f.sx(v.x)}" x2="${f.sx(v.x)}" y1="${f.sy(yr[0])}" y2="${f.sy(yr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  hlines.forEach(v=>b+=`<line y1="${f.sy(v.y)}" y2="${f.sy(v.y)}" x1="${f.sx(xr[0])}" x2="${f.sx(xr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  let p="";points.forEach(q=>{if(!isFinite(q.x)||!isFinite(q.y))return;const x=f.sx(q.x),y=f.sy(q.y),anc=x>W*.7?"end":"start";
    p+=`<circle cx="${x}" cy="${y}" r="6" fill="var(${q.col||"--ink"})" stroke="var(--card)" stroke-width="2"/>${q.label?`<text x="${x+(anc==="end"?-9:9)}" y="${y-9}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${q.col||"--ink"})">${q.label}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfico"}"><defs><clipPath id="${id}"><rect x="${f.L}" y="${f.T}" width="${W-f.L-f.R}" height="${H-f.T-f.B}"/></clipPath></defs>${f.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const legend=items=>`<div class="legend">${items.map(([c,t,d])=>`<span><i style="background:var(${c})${d?";opacity:.55":""}"></i>${t}</span>`).join("")}</div>`;
const okAll=a=>a.every(x=>isFinite(x)),n2=v=>fmt(v,2),n4=v=>fmt(v,4);
const tabsBox=(id,opts)=>`<div style="margin-bottom:10px">${seg(id,"Herramienta",opts,opts[0][0])}</div><div id="${id}-b"></div>`;
function tabsRun(id,M){const go=k=>M[k]();bindSeg(id,go);go(Object.keys(M)[0])}
const nin=(id,l,v,st)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" ${st?`step="${st}"`:""} inputmode="decimal"></label>`;
const N=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",",".")):NaN};
const onIn=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});



// ===================== HERRAMIENTAS COMUNES DE LAS GUÍAS DE ESTUDIO =====================
// Cada materia de tipo guía define en su contenido: GL (glosario), MCQ (preguntas de opción múltiple),
// ABIERTAS (preguntas abiertas con esquema de respuesta) y TL (línea de tiempo), todas con el número de unidad.
const GSTORE={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const gShuffle=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const gUnits=arr=>[...new Set(arr.map(x=>x.u))].sort((a,b)=>a-b);
const gSeg=(id,arr,u0)=>seg(id,"Unidad",[["0","Todas"],...gUnits(arr).map(u=>[String(u),"Unidad "+u])],u0||"0");
const gCurU=()=>{try{const id=decodeURIComponent(location.hash.slice(1)),x=[...TRUNK,...WORKSHOPS].find(t=>t.id===id);return x&&x.u?String(x.u):"0"}catch(e){return"0"}};
const gUnitName=u=>(typeof UNIDADES!=="undefined"&&UNIDADES[u])?UNIDADES[u]:"Unidad "+u;

// ---------- Tarjetas de conceptos
SIMS.tarjetas=function(){
  let u=gCurU(),ord=[],k=0,show=false;
  $("sim").innerHTML=`${gSeg("tj-u",GL,u)}<div class="card-q" id="tj-card" aria-live="polite"></div>
  <div class="chips pre"><button type="button" class="btn" id="tj-rev">Revelar definición</button><button type="button" class="btn" id="tj-next">Siguiente concepto</button></div>
  <p class="hint" id="tj-pos"></p><details class="pdet"><summary><b>Ver el glosario completo</b></summary><dl class="glos" id="tj-all"></dl></details>`;
  const pool=()=>GL.filter(g=>u==="0"||String(g.u)===u);
  const shuffle=()=>{ord=gShuffle(pool().map((_,i)=>i));k=0;show=false};
  const draw=()=>{const P=pool();if(!P.length){$("tj-card").innerHTML=`<p class="hint">No hay conceptos en esta unidad.</p>`;return}const g=P[ord[k]];
    $("tj-card").innerHTML=`<p class="lbl">${esc(gUnitName(g.u))}</p><p class="gq">${g.t}</p>${show?`<p>${g.d}</p>`:`<p class="hint">Di o escribe tu definición en dos líneas y luego revélala.</p>`}`;
    $("tj-pos").textContent=`Concepto ${k+1} de ${P.length}`;$("tj-rev").disabled=show;
    $("tj-all").innerHTML=P.slice().sort((a,b)=>a.t.localeCompare(b.t,"es")).map(g=>`<dt>${g.t}</dt><dd>${g.d}</dd>`).join("")};
  bindSeg("tj-u",v=>{u=v;shuffle();draw()});
  $("tj-rev").onclick=()=>{show=true;draw()};
  $("tj-next").onclick=()=>{k=(k+1)%ord.length;if(k===0)shuffle();show=false;draw()};
  shuffle();draw()};

// ---------- Autoevaluación de opción múltiple
SIMS.quiz=function(){
  let u=gCurU(),Q=[],ans={};
  $("sim").innerHTML=`${gSeg("qz-u",MCQ,u)}<div class="res" id="qz-res"></div><div id="qz-l"></div><div class="chips pre"><button type="button" class="btn" id="qz-new">Barajar de nuevo</button></div>`;
  const score=()=>{const n=Object.keys(ans).length,ok=Object.entries(ans).filter(([i,a])=>Q[i].ok===a).length;$("qz-res").innerHTML=tiles([["Respondidas",`${n} de ${Q.length}`],["Correctas",String(ok),n&&ok===n?"okt":""],["Puntaje",n?fmt(ok/n*5,1)+" / 5":"—"]])};
  const draw=()=>{$("qz-l").innerHTML=Q.map((q,i)=>{const a=ans[i];return`<div class="stepc qz" data-i="${i}"><p class="lbl">${esc(gUnitName(q.u))}</p><p><b>${i+1}. ${q.q}</b></p><div class="qz-o">${q.o.map((o,j)=>`<button type="button" class="qz-b${a!==undefined?(j===q.ok?" ok":j===a?" no":""):""}" data-j="${j}"${a!==undefined?" disabled":""}>${String.fromCharCode(97+j)}) ${o}</button>`).join("")}</div>${a!==undefined?`<p class="qz-f ${a===q.ok?"qz-si":"qz-no"}"><b>${a===q.ok?"Correcto.":"No es esa."}</b> ${q.e}</p>`:""}</div>`}).join("");score()};
  const nuevo=()=>{Q=gShuffle(MCQ.filter(q=>u==="0"||String(q.u)===u)).slice(0,10).map(q=>{const idx=gShuffle(q.o.map((_,j)=>j));return{...q,o:idx.map(j=>q.o[j]),ok:idx.indexOf(q.ok)}});ans={};draw()};
  $("qz-l").addEventListener("click",e=>{const b=e.target.closest("button.qz-b");if(!b)return;const i=+b.closest(".qz").dataset.i;if(ans[i]!==undefined)return;ans[i]=+b.dataset.j;draw()});
  bindSeg("qz-u",v=>{u=v;nuevo()});$("qz-new").onclick=nuevo;nuevo()};

// ---------- Preguntas abiertas con esquema de respuesta
SIMS.abiertas=function(){
  const K="guia-"+(typeof GUIA_ID!=="undefined"?GUIA_ID:"x")+"-ab-";let u=gCurU();
  $("sim").innerHTML=`${gSeg("ab-u",ABIERTAS,u)}<p class="hint">Escribe tu respuesta (se guarda en este navegador) y luego compárala con el esquema: una buena respuesta toca todas las ideas clave, con fechas y ejemplos.</p><div id="ab-l"></div>`;
  const draw=()=>{const L=ABIERTAS.map((q,i)=>({...q,i})).filter(q=>u==="0"||String(q.u)===u);
    $("ab-l").innerHTML=L.map(q=>`<div class="stepc"><p class="lbl">${esc(gUnitName(q.u))}</p><p><b>${q.q}</b></p><label class="vh" for="ab-t${q.i}">Tu respuesta</label><textarea id="ab-t${q.i}" rows="4" style="width:100%" placeholder="Tu respuesta…">${esc(GSTORE.get(K+q.i)||"")}</textarea><details class="pdet"><summary><b>Esquema de respuesta</b></summary><ul>${q.a.map(x=>`<li>${x}</li>`).join("")}</ul></details></div>`).join("");
    L.forEach(q=>$("ab-t"+q.i).addEventListener("input",e=>GSTORE.set(K+q.i,e.target.value)))};
  bindSeg("ab-u",v=>{u=v;draw()});draw()};

// ---------- Línea de tiempo
SIMS.tiempo=function(){
  let u=gCurU();
  $("sim").innerHTML=`${gSeg("tl-u",TL,u)}<div class="calcf"><label for="tl-q">Buscar en la línea de tiempo<input id="tl-q" type="search" placeholder="Por ejemplo: patrón oro"></label></div><ol class="tline" id="tl-l"></ol>`;
  const nz=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const draw=()=>{const q=nz($("tl-q").value.trim()),L=TL.filter(x=>(u==="0"||String(x.u)===u)&&(!q||nz(x.a+" "+x.t+" "+x.d).includes(q)));
    $("tl-l").innerHTML=L.length?L.map(x=>`<li><span class="tl-a">${x.a}</span><div><b>${x.t}</b><br><span>${x.d}</span></div></li>`).join(""):`<li><span></span><div class="hint">No hay hechos con ese filtro.</div></li>`};
  bindSeg("tl-u",v=>{u=v;draw()});$("tl-q").addEventListener("input",draw);draw()};


// ===================== LABORATORIOS DE EVALUACIÓN DE PROYECTOS =====================
const d2=v=>isFinite(v)?fmt(Math.abs(v)<5e-3?0:v,2).replace(/^-/,"−"):"—",d4=v=>isFinite(v)?fmt(Math.abs(v)<5e-6?0:v,4).replace(/^-/,"−"):"—",pc=v=>isFinite(v)?d2(v*100)+" %":"—",m0=v=>isFinite(v)?fmt(Math.round(v),0).replace(/^-/,"−"):"—";
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const tarea=(id,l,v,rows=3)=>`<label for="${id}">${l}<textarea id="${id}" rows="${rows}" spellcheck="false" style="width:100%;font-family:var(--f-mono)">${v}</textarea></label>`;
const lines=s=>String(s).split("\n").map(l=>l.split(/;|\t/).map(x=>x.trim())).filter(p=>p.length&&p[0]!=="");
const num=x=>{const v=+String(x||"").replace(/\s/g,"").replace(/,/g,".");return isFinite(v)?v:NaN};
const xl=s=>`<code class="xl">${s}</code>`;
const cin=(id,lab,v,st="any")=>`<input id="${id}" type="number" value="${v}" step="${st}" aria-label="${lab}" style="width:100%;min-width:90px">`;
const npv=(r,F)=>F.reduce((s,f,t)=>s+f/Math.pow(1+r,t),0);
const irr=F=>{let lo=-0.99,hi=10,flo=npv(lo,F),fhi=npv(hi,F);if(flo*fhi>0)return NaN;for(let i=0;i<200;i++){const m=(lo+hi)/2,fm_=npv(m,F);if(flo*fm_<=0){hi=m}else{lo=m;flo=fm_}}return(lo+hi)/2};
const Phi=x=>{const t=1/(1+0.2316419*Math.abs(x)),d=0.3989423*Math.exp(-x*x/2),p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return x>0?1-p:p};

// ---------- Marco lógico
SIMS.mlog=function(){
  $("sim").innerHTML=tabsBox("ml",[["arb","Árbol de problemas y objetivos"],["mat","Matriz de marco lógico"]]);const B=$("ml-b");
  const K="guia-ep-ml-";
  tabsRun("ml",{
   arb(){const def={p:"Baja cobertura de agua potable en la vereda El Alto",c:"Red de acueducto obsoleta\nFuentes de agua sin protección\nComunidad sin organización para administrar el servicio",e:"Enfermedades de origen hídrico en niños\nTiempo perdido acarreando agua\nMenor productividad de los hogares",o:"Alta cobertura de agua potable en la vereda El Alto",m:"Red de acueducto renovada\nFuentes de agua protegidas\nJunta de acueducto organizada y capacitada",f:"Menos enfermedades de origen hídrico en niños\nTiempo liberado para estudio y trabajo\nMayor productividad de los hogares"};
    const g=k=>{const v=GSTORE.get(K+k);return v===null?def[k]:v};
    B.innerHTML=`<p class="hint">Escribe el problema central, sus causas y sus efectos; luego redáctalos en positivo para el árbol de objetivos. Lo que escribas se guarda en este navegador.</p><div class="calcf">${tarea("ml-p","Problema central",g("p"),2)}${tarea("ml-c","Causas (una por línea)",g("c"),3)}${tarea("ml-e","Efectos (uno por línea)",g("e"),3)}</div><div class="calcf">${tarea("ml-o","Objetivo central (el problema en positivo)",g("o"),2)}${tarea("ml-m","Medios (las causas en positivo)",g("m"),3)}${tarea("ml-f","Fines (los efectos en positivo)",g("f"),3)}</div><div id="ml-out"></div>`;
    const box=(t,c)=>`<div style="border:1.5px solid var(${c});border-radius:8px;padding:6px 9px;font-size:13.5px;background:var(--card);flex:1;min-width:120px">${esc(t)}</div>`;
    const tree=(top,mid,bot,cTop,cMid,cBot,lab)=>`<div style="display:flex;flex-direction:column;gap:8px"><p class="lbl">${lab[0]}</p><div style="display:flex;gap:8px;flex-wrap:wrap">${top.map(t=>box(t,cTop)).join("")}</div><div style="text-align:center;color:var(--muted)">↑</div><p class="lbl">${lab[1]}</p><div style="display:flex">${box(mid,cMid)}</div><div style="text-align:center;color:var(--muted)">↑</div><p class="lbl">${lab[2]}</p><div style="display:flex;gap:8px;flex-wrap:wrap">${bot.map(t=>box(t,cBot)).join("")}</div></div>`;
    const run=()=>{["p","c","e","o","m","f"].forEach(k=>GSTORE.set(K+k,$("ml-"+k).value));const L=k=>$("ml-"+k).value.split("\n").map(s=>s.trim()).filter(Boolean),C=L("c"),E=L("e"),M=L("m"),Fi=L("f"),warn=[];
      if(/^(falta|no hay|ausencia|carencia|inexistencia)/i.test($("ml-p").value.trim()))warn.push("El problema está redactado como la falta de una solución («falta de…», «no hay…»). Redáctalo como una situación negativa que afecta a alguien; así no se impone la alternativa desde el principio.");
      if(M.length!==C.length)warn.push(`Hay ${C.length} causas y ${M.length} medios: cada causa debe tener su medio.`);if(Fi.length!==E.length)warn.push(`Hay ${E.length} efectos y ${Fi.length} fines: cada efecto debe tener su fin.`);
      $("ml-out").innerHTML=(warn.length?`<div class="stepc">${warn.map(w=>`<p class="err">${w}</p>`).join("")}</div>`:"")+`<div class="grid2">${tree(E,$("ml-p").value.trim(),C,"--bad","--ink","--exam",["Efectos","Problema central","Causas"])}${tree(Fi,$("ml-o").value.trim(),M,"--good","--ink","--line",["Fines","Objetivo central (propósito)","Medios (componentes)"])}</div>`};
    onIn(["ml-p","ml-c","ml-e","ml-o","ml-m","ml-f"],run);run()},
   mat(){const rows=["Fin","Propósito","Componentes","Actividades"],cols=["Resumen narrativo","Indicadores","Medios de verificación","Supuestos"];
    const def=[["Contribuir a reducir la morbilidad infantil por enfermedades de origen hídrico en la vereda","Tasa de EDA en menores de 5 años baja 40 % en 3 años","Registros del puesto de salud","Se mantienen los programas de salud del municipio"],["Los hogares de la vereda acceden a agua potable de forma continua","95 % de los hogares con agua potable 24 horas al final del año 2","Encuesta de hogares; informes de calidad del agua","Los hogares usan el agua tratada para consumo"],["1. Red renovada. 2. Fuentes protegidas. 3. Junta de acueducto capacitada","1. 8 km de red. 2. 20 ha reforestadas. 3. 12 directivos capacitados","Actas de recibo; informes de interventoría","Los propietarios permiten el paso de la red"],["1.1 Diseños; 1.2 Construcción; 2.1 Compra de predios; 3.1 Talleres","Presupuesto: $850 millones; cronograma de 18 meses","Contratos, facturas, informes de avance","Los recursos se desembolsan a tiempo"]];
    const g=(i,j)=>{const v=GSTORE.get(K+"m"+i+j);return v===null?def[i][j]:v};
    B.innerHTML=`<div class="tbl"><table><tr><th></th>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>${rows.map((r,i)=>`<tr><td><b>${r}</b></td>${cols.map((c,j)=>`<td><label class="vh" for="mm-${i}${j}">${r}: ${c}</label><textarea id="mm-${i}${j}" rows="3" style="width:100%;min-width:150px">${esc(g(i,j))}</textarea></td>`).join("")}</tr>`).join("")}</table></div><div id="mm-o"></div><div class="chips pre"><button type="button" class="btn" id="mm-r">Volver al ejemplo</button></div>`;
    const ids=rows.flatMap((_,i)=>cols.map((_,j)=>`mm-${i}${j}`));
    const run=()=>{ids.forEach(id=>GSTORE.set(K+"m"+id.slice(3),$(id).value));const v=(i,j)=>$(`mm-${i}${j}`).value.trim()||"[vacío]";
      const sinNum=[0,1,2].filter(i=>!/\d/.test($(`mm-${i}1`).value));
      $("mm-o").innerHTML=stp(1,"Lógica vertical (léela de abajo hacia arriba)",`<ol class="steps"><li>Si realizamos <i>${esc(v(3,0))}</i> y se cumple que <i>${esc(v(3,3))}</i>, entonces producimos <i>${esc(v(2,0))}</i>.</li><li>Si producimos los componentes y se cumple que <i>${esc(v(2,3))}</i>, entonces logramos que <i>${esc(v(1,0))}</i>.</li><li>Si logramos el propósito y se cumple que <i>${esc(v(1,3))}</i>, contribuimos a <i>${esc(v(0,0))}</i>.</li></ol><p class="hint">Si alguna frase no tiene sentido, la matriz tiene un problema de lógica vertical.</p>`)
        +stp(2,"Lógica horizontal",sinNum.length?`<p class="err">Los indicadores de ${sinNum.map(i=>rows[i].toLowerCase()).join(", ")} no tienen cifras: un buen indicador dice cantidad, calidad, tiempo y lugar.</p>`:`<p>Todos los indicadores tienen metas cuantitativas. Revisa que cada uno tenga un medio de verificación que alguien realmente produzca.</p>`)};
    onIn(ids,run);$("mm-r").onclick=()=>{rows.forEach((_,i)=>cols.forEach((_,j)=>{$(`mm-${i}${j}`).value=def[i][j]}));run()};run()}})};

// ---------- Proyección de la demanda
SIMS.demanda=function(){
  $("sim").innerHTML=`<p class="hint">Serie histórica de la demanda (consumo aparente = producción + importaciones − exportaciones). Datos ilustrativos.</p><div class="calcf">${tarea("dm-d","Año; demanda (una línea por año)","2018; 1200\n2019; 1290\n2020; 1250\n2021; 1410\n2022; 1520\n2023; 1600\n2024; 1720\n2025; 1810",6)}${nin("dm-h","Años a proyectar",5)}${nin("dm-o","Oferta actual de la competencia",1500)}${nin("dm-g","Crecimiento anual de la oferta (%)",3,"0.5")}</div><div class="res" id="dm-res"></div><div id="dm-gr"></div><div id="dm-out"></div>`;
  const fit=(t,y)=>{const n=t.length,mt=t.reduce((a,b)=>a+b,0)/n,my=y.reduce((a,b)=>a+b,0)/n,b=t.reduce((s,x,i)=>s+(x-mt)*(y[i]-my),0)/t.reduce((s,x)=>s+(x-mt)**2,0),a=my-b*mt,r2=1-y.reduce((s,v,i)=>s+(v-a-b*t[i])**2,0)/y.reduce((s,v)=>s+(v-my)**2,0);return{a,b,r2}};
  const run=()=>{const D=lines($("dm-d").value).map(p=>[num(p[0]),num(p[1])]).filter(p=>isFinite(p[0])&&isFinite(p[1])&&p[1]>0);if(D.length<3){$("dm-res").innerHTML=err("escribe al menos tres años con «año; demanda».");return}
    const h=Math.max(1,Math.min(15,Math.round(N("dm-h")||5))),of0=N("dm-o"),go=N("dm-g")/100,t0=D[0][0],t=D.map(p=>p[0]-t0+1),y=D.map(p=>p[1]),L=fit(t,y),E=fit(t,y.map(Math.log)),r2e=1-y.reduce((s,v,i)=>s+(v-Math.exp(E.a+E.b*t[i]))**2,0)/y.reduce((s,v)=>s+(v-y.reduce((a,b)=>a+b,0)/y.length)**2,0);
    const best=L.r2>=r2e?"lineal":"exponencial",pr=x=>best==="lineal"?L.a+L.b*x:Math.exp(E.a+E.b*x),last=t[t.length-1],ye=D[D.length-1][0],P=[...Array(h)].map((_,k)=>{const x=last+k+1,d=pr(x),o=of0*Math.pow(1+go,k+1);return{a:ye+k+1,d,o,di:d-o}});
    $("dm-res").innerHTML=tl([["Tendencia lineal",`Q = ${d2(L.a)} + ${d2(L.b)}t · R² = ${d4(L.r2)}`],["Tendencia exponencial",`crecimiento ${pc(Math.exp(E.b)-1)} anual · R² = ${d4(r2e)}`],["Modelo elegido",best,"okt"],[`Demanda insatisfecha en ${P[h-1].a}`,m0(P[h-1].di),P[h-1].di>0?"okt":"badt"]]);
    const xs=[...D.map(p=>p[0]),...P.map(p=>p.a)];$("dm-gr").innerHTML=plotXY({xr:[xs[0],xs[xs.length-1]],yr:[0,Math.max(...y,...P.map(p=>Math.max(p.d,p.o)))*1.1],series:[{f:a=>L.a+L.b*(a-t0+1),col:"--line",dash:"6 4"},{f:a=>Math.exp(E.a+E.b*(a-t0+1)),col:"--exam",dash:"3 4"},{pts:P.map(p=>[p.a,p.o]),col:"--ink"}],points:[...D.map(p=>({x:p[0],y:p[1]})),...P.map(p=>({x:p.a,y:p.d,col:"--good"}))],xl:"Año",yl:"Unidades",label:"Proyección de la demanda"})+legend([["--line","Tendencia lineal",1],["--exam","Tendencia exponencial",1],["--good","Demanda proyectada"],["--ink","Oferta proyectada"]]);
    $("dm-out").innerHTML=stp(1,"Mínimos cuadrados",`<div class="eq al">t = 1, …, ${t.length} · b = Σ(t − t̄)(Q − Q̄)/Σ(t − t̄)² = ${d4(L.b)} · a = Q̄ − b·t̄ = ${d4(L.a)}<br>Exponencial: ln Q = ${d4(E.a)} + ${d4(E.b)}t ⟹ Q = ${d2(Math.exp(E.a))}·e^(${d4(E.b)}t)</div><p class="hint">En Excel: ${xl("=PRONOSTICO.LINEAL(x; Q; t)")} o ${xl("=TENDENCIA(Q; t; nuevo_t)")} para la lineal y ${xl("=CRECIMIENTO(Q; t; nuevo_t)")} para la exponencial.</p>`)
      +stp(2,"Demanda insatisfecha",`<div class="tbl"><table><tr><th>Año</th><th>Demanda</th><th>Oferta</th><th>Demanda insatisfecha</th></tr>${P.map(p=>`<tr><td>${p.a}</td><td>${m0(p.d)}</td><td>${m0(p.o)}</td><td><b>${m0(p.di)}</b></td></tr>`).join("")}</table></div><p class="hint">El proyecto puede aspirar a captar parte de la demanda insatisfecha; si es negativa, tendría que quitarle mercado a la competencia.</p>`)};
  onIn(["dm-d","dm-h","dm-o","dm-g"],run);run()};

// ---------- Localización por puntos
SIMS.loc=function(){
  $("sim").innerHTML=`<p class="hint">Factor; peso; calificación de cada sitio (de 0 a 10). La primera línea da los nombres de los sitios.</p><div class="calcf">${tarea("lc-d","Tabla de factores","Factor; Peso; Rionegro; Itagüí; Caldas\nCercanía al mercado; 0.25; 7; 9; 6\nMano de obra disponible; 0.20; 6; 8; 7\nCosto del terreno; 0.20; 5; 4; 8\nVías y transporte; 0.15; 9; 8; 6\nServicios públicos; 0.10; 8; 9; 7\nIncentivos tributarios; 0.10; 7; 5; 6",7)}</div><div id="lc-o"></div>`;
  const run=()=>{const L=lines($("lc-d").value);if(L.length<3){$("lc-o").innerHTML=err("escribe el encabezado y al menos dos factores.");return}const S=L[0].slice(2),F=L.slice(1).map(p=>({f:p[0],w:num(p[1]),c:S.map((_,j)=>num(p[2+j]))}));
    if(F.some(f=>!isFinite(f.w)||f.c.some(x=>!isFinite(x)))){$("lc-o").innerHTML=err("hay un peso o una calificación que no es número.");return}const W=F.reduce((s,f)=>s+f.w,0),tot=S.map((_,j)=>F.reduce((s,f)=>s+f.w*f.c[j],0)),best=tot.indexOf(Math.max(...tot));
    $("lc-o").innerHTML=(Math.abs(W-1)>1e-6?`<p class="err">Los pesos suman ${d4(W)}, no 1. Los puntajes se calculan igual, pero conviene normalizarlos.</p>`:"")+tl([...S.map((s,j)=>[esc(s),d2(tot[j]),j===best?"okt":""])])
      +stp(1,"Calificación ponderada",`<div class="tbl"><table><tr><th>Factor</th><th>Peso</th>${S.map(s=>`<th>${esc(s)}</th>`).join("")}</tr>${F.map(f=>`<tr><td>${esc(f.f)}</td><td>${d2(f.w)}</td>${f.c.map(c=>`<td>${d2(c)} × ${d2(f.w)} = ${d2(c*f.w)}</td>`).join("")}</tr>`).join("")}<tr><td><b>Total</b></td><td>${d2(W)}</td>${tot.map((t,j)=>`<td><b>${d2(t)}</b></td>`).join("")}</tr></table></div><p>Se elige <b>${esc(S[best])}</b>. Antes de decidir, prueba si la elección cambia al mover un poco los pesos: si cambia fácil, la decisión es frágil y conviene complementar con costos (Brown-Gibson).</p><p class="hint">En Excel: ${xl("=SUMAPRODUCTO(pesos; calificaciones)")}.</p>`)};
  onIn(["lc-d"],run);run()};

// ---------- Punto de equilibrio
SIMS.pe=function(){
  $("sim").innerHTML=tabsBox("pq",[["uno","Un producto"],["mul","Varios productos"]]);const B=$("pq-b");
  tabsRun("pq",{
   uno(){B.innerHTML=`<div class="calcf">${nin("p1-f","Costos fijos",120000000,"1000000")}${nin("p1-p","Precio unitario",45000,"500")}${nin("p1-v","Costo variable unitario",27000,"500")}${nin("p1-q","Ventas esperadas (unidades)",10000,"100")}</div><div class="res" id="p1-res"></div><div id="p1-gr"></div><div id="p1-o"></div>`;
    const run=()=>{const F=N("p1-f"),P=N("p1-p"),v=N("p1-v"),Q=N("p1-q");if(!(P>v)||!(F>=0)){$("p1-res").innerHTML=err("el precio debe ser mayor que el costo variable.");return}const mc=P-v,qe=F/mc,ue=qe*P,uo=Q*mc-F,ms=(Q-qe)/Q,gao=Q*mc/uo;
      $("p1-res").innerHTML=tl([["Punto de equilibrio (unidades)",m0(Math.ceil(qe)),"okt"],["En pesos",m0(ue)],["Margen de contribución",m0(mc)+" ("+pc(mc/P)+")"],["Utilidad operativa esperada",m0(uo),uo>0?"okt":"badt"],["Margen de seguridad",pc(ms)],["GAO",uo>0?d2(gao):"—"]]);
      const qm=Math.max(Q,qe)*1.4;$("p1-gr").innerHTML=plotXY({xr:[0,qm],yr:[0,qm*P*1.05],series:[{f:q=>P*q,col:"--good"},{f:q=>F+v*q,col:"--bad"},{f:()=>F,col:"--muted",dash:"5 4"}],points:[{x:qe,y:ue,label:"PE"}],vlines:[{x:Q,col:"--line"}],xl:"Unidades",yl:"Pesos",label:"Punto de equilibrio"})+legend([["--good","Ingresos"],["--bad","Costos totales"],["--muted","Costos fijos",1],["--line","Ventas esperadas"]]);
      $("p1-o").innerHTML=stp(1,"Cálculo",`<div class="eq al">Q_PE = CF/(P − CVu) = ${m0(F)}/(${m0(P)} − ${m0(v)}) = ${d2(qe)} unidades<br>En pesos = CF/(1 − CVu/P) = ${m0(F)}/${d4(1-v/P)} = ${m0(ue)}<br>GAO = Q(P − CVu)/[Q(P − CVu) − CF] = ${m0(Q*mc)}/${m0(uo)} = ${d2(gao)} = 1/margen de seguridad</div><p class="hint">Con un GAO de ${d2(gao)}, si las ventas caen 10 % la utilidad operativa cae ${pc(gao*0.1)}.</p>`)};
    onIn(["p1-f","p1-p","p1-v","p1-q"],run);run()},
   mul(){B.innerHTML=`<div class="calcf">${tarea("pm-d","Producto; precio; costo variable unitario; mezcla de ventas (%)","Camisa; 60000; 35000; 50\nPantalón; 90000; 55000; 30\nChaqueta; 150000; 95000; 20",4)}${nin("pm-f","Costos fijos comunes",180000000,"1000000")}</div><div id="pm-o"></div>`;
    const run=()=>{const D=lines($("pm-d").value).map(p=>({n:p[0],p:num(p[1]),v:num(p[2]),w:num(p[3])/100})).filter(x=>isFinite(x.p)&&isFinite(x.v)&&isFinite(x.w)),F=N("pm-f");if(D.length<2){$("pm-o").innerHTML=err("escribe al menos dos productos.");return}
      const W=D.reduce((s,x)=>s+x.w,0);D.forEach(x=>x.w/=W);const mp=D.reduce((s,x)=>s+x.w*(x.p-x.v),0),pp=D.reduce((s,x)=>s+x.w*x.p,0),q=F/mp;
      $("pm-o").innerHTML=tl([["Margen de contribución ponderado",m0(mp)],["Unidades totales en equilibrio",m0(Math.ceil(q)),"okt"],["Ventas en equilibrio",m0(q*pp)]])
        +stp(1,"Margen ponderado por la mezcla",`<div class="eq al">MC ponderado = ${D.map(x=>`${pc(x.w)}·(${m0(x.p)} − ${m0(x.v)})`).join(" + ")} = ${m0(mp)}<br>Q_PE = ${m0(F)}/${m0(mp)} = ${d2(q)} unidades</div>`)
        +stp(2,"Reparto por producto",`<div class="tbl"><table><tr><th>Producto</th><th>Mezcla</th><th>Unidades</th><th>Ventas</th><th>Contribución</th></tr>${D.map(x=>`<tr><td>${esc(x.n)}</td><td>${pc(x.w)}</td><td>${m0(q*x.w)}</td><td>${m0(q*x.w*x.p)}</td><td>${m0(q*x.w*(x.p-x.v))}</td></tr>`).join("")}</table></div><p class="hint">Si la mezcla cambia hacia los productos de menor margen, el punto de equilibrio sube aunque los precios no cambien.${W!==1&&Math.abs(W-1)>1e-9?" La mezcla no sumaba 100 %; se normalizó.":""}</p>`)};
    onIn(["pm-d","pm-f"],run);run()}})};

// ---------- Matriz de Conesa
SIMS.conesa=function(){
  const AT=[["IN","Intensidad",[[1,"baja"],[2,"media"],[4,"alta"],[8,"muy alta"],[12,"total"]]],["EX","Extensión",[[1,"puntual"],[2,"parcial"],[4,"extensa"],[8,"total"],[12,"crítica"]]],["MO","Momento",[[1,"largo plazo"],[2,"medio plazo"],[4,"inmediato"],[8,"crítico"]]],["PE","Persistencia",[[1,"fugaz"],[2,"temporal"],[4,"permanente"]]],["RV","Reversibilidad",[[1,"corto plazo"],[2,"medio plazo"],[4,"irreversible"]]],["SI","Sinergia",[[1,"sin sinergia"],[2,"sinérgico"],[4,"muy sinérgico"]]],["AC","Acumulación",[[1,"simple"],[4,"acumulativo"]]],["EF","Efecto",[[1,"indirecto"],[4,"directo"]]],["PR","Periodicidad",[[1,"irregular"],[2,"periódico"],[4,"continuo"]]],["MC","Recuperabilidad",[[1,"inmediata"],[2,"medio plazo"],[4,"mitigable"],[8,"irrecuperable"]]]];
  const IMP=[["Remoción de cobertura vegetal",-1,[4,2,4,4,2,2,4,4,4,4]],["Ruido durante la construcción",-1,[2,1,4,1,1,1,1,4,2,1]],["Generación de empleo local",1,[2,2,4,2,1,2,1,4,4,1]],["Vertimientos en la quebrada",-1,[8,4,4,2,2,2,4,4,4,4]]];
  $("sim").innerHTML=`<p class="hint">Califica cada impacto con la escala de Conesa. El signo indica si es benéfico (+) o perjudicial (−).</p><div class="tbl"><table><tr><th>Impacto</th><th>±</th>${AT.map(a=>`<th title="${a[1]}">${a[0]}</th>`).join("")}<th>I</th><th>Clase</th></tr>${IMP.map((im,i)=>`<tr><td><label class="vh" for="cn-n${i}">Impacto ${i+1}</label><input id="cn-n${i}" value="${esc(im[0])}" style="min-width:170px"></td><td><label class="vh" for="cn-s${i}">Signo</label><select id="cn-s${i}"><option value="-1"${im[1]<0?" selected":""}>−</option><option value="1"${im[1]>0?" selected":""}>+</option></select></td>${AT.map((a,j)=>`<td><label class="vh" for="cn-${i}-${j}">${a[1]}</label><select id="cn-${i}-${j}">${a[2].map(([v,l])=>`<option value="${v}"${v===im[2][j]?" selected":""}>${v} ${l}</option>`).join("")}</select></td>`).join("")}<td id="cn-i${i}"></td><td id="cn-c${i}"></td></tr>`).join("")}</table></div><div id="cn-o"></div>`;
  const ids=IMP.flatMap((_,i)=>["cn-n"+i,"cn-s"+i,...AT.map((_,j)=>`cn-${i}-${j}`)]);
  const run=()=>{const R=IMP.map((_,i)=>{const v=AT.map((_,j)=>+$(`cn-${i}-${j}`).value),I=3*v[0]+2*v[1]+v.slice(2).reduce((a,b)=>a+b,0),s=+$("cn-s"+i).value;return{n:$("cn-n"+i).value,v,I,s}});
    const cl=I=>I<25?"irrelevante":I<50?"moderado":I<75?"severo":"crítico";
    R.forEach((r,i)=>{$("cn-i"+i).innerHTML=`<b>${r.s<0?"−":"+"}${r.I}</b>`;$("cn-c"+i).textContent=r.s>0?"benéfico":cl(r.I)});
    const w=R.filter(r=>r.s<0).sort((a,b)=>b.I-a.I)[0];
    $("cn-o").innerHTML=stp(1,"Importancia",w?`<div class="eq al">I = ±(3·IN + 2·EX + MO + PE + RV + SI + AC + EF + PR + MC)<br>${esc(w.n)}: −(3·${w.v[0]} + 2·${w.v[1]} + ${w.v.slice(2).join(" + ")}) = <b>−${w.I}</b> ⟹ ${cl(w.I)}</div><p>Los impactos severos y críticos requieren medidas en el plan de manejo ambiental: prevenir, mitigar, corregir o compensar, con indicadores de seguimiento.</p>`:"<p>No hay impactos negativos.</p>")};
  onIn(ids,run);ids.forEach(id=>$(id).addEventListener("change",run));run()};

// ---------- Matriz de riesgos
SIMS.matriz=function(){
  $("sim").innerHTML=`<p class="hint">Riesgo; probabilidad (1 a 5); impacto (1 a 5); tratamiento. Ejemplo para un proyecto de planta de confección.</p><div class="calcf">${tarea("rg-d","Riesgos","Caída de la demanda; 3; 4; reducir: contratos marco con clientes\nAumento del precio de la tela; 4; 3; transferir: compras a término\nDemora en la licencia; 2; 3; reducir: iniciar trámites temprano\nAccidente laboral; 2; 5; transferir: ARL y seguro\nFalla de la cortadora; 3; 2; reducir: mantenimiento preventivo\nTasa de cambio; 3; 3; retener y vigilar",7)}</div><div id="rg-o"></div>`;
  const zona=v=>v>=15?["extrema","#c0392b"]:v>=10?["alta","#e67e22"]:v>=5?["moderada","#d4ac0d"]:["baja","#27ae60"];
  const run=()=>{const R=lines($("rg-d").value).map((p,i)=>({k:i+1,n:p[0],p:Math.max(1,Math.min(5,Math.round(num(p[1])))),i:Math.max(1,Math.min(5,Math.round(num(p[2])))),t:p[3]||""})).filter(r=>isFinite(r.p)&&isFinite(r.i));if(!R.length){$("rg-o").innerHTML=err("escribe al menos un riesgo.");return}
    let g=`<div style="display:grid;grid-template-columns:auto repeat(5,1fr);gap:3px;max-width:520px;font-size:12.5px"><div></div>${[1,2,3,4,5].map(i=>`<div style="text-align:center;color:var(--muted)">I=${i}</div>`).join("")}`;
    for(let p=5;p>=1;p--){g+=`<div style="color:var(--muted);align-self:center">P=${p}</div>`;for(let i=1;i<=5;i++){const z=zona(p*i),here=R.filter(r=>r.p===p&&r.i===i);g+=`<div style="background:${z[1]};opacity:${here.length?1:.35};min-height:38px;border-radius:5px;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;gap:4px">${here.map(r=>r.k).join(", ")}</div>`}}g+=`</div>`;
    R.sort((a,b)=>b.p*b.i-a.p*a.i);
    $("rg-o").innerHTML=stp(1,"Mapa de calor",g+`<p class="hint">Probabilidad × impacto: 1 a 4 baja, 5 a 9 moderada, 10 a 14 alta, 15 a 25 extrema.</p>`)+stp(2,"Priorización",`<div class="tbl"><table><tr><th>#</th><th>Riesgo</th><th>P × I</th><th>Zona</th><th>Tratamiento</th></tr>${R.map(r=>`<tr><td>${r.k}</td><td>${esc(r.n)}</td><td><b>${r.p*r.i}</b></td><td>${zona(r.p*r.i)[0]}</td><td>${esc(r.t)}</td></tr>`).join("")}</table></div>`)};
  onIn(["rg-d"],run);run()};

// ---------- Flujo de caja
SIMS.flujo=function(){
  $("sim").innerHTML=`<p class="hint">Cifras en millones de pesos. Depreciación en línea recta; el capital de trabajo se invierte en el año 0 y se recupera al final; el préstamo se paga con cuota fija.</p><div class="calcf">${nin("fl-i","Inversión en activos fijos",800)}${nin("fl-vu","Vida útil para depreciar (años)",10)}${nin("fl-kt","Capital de trabajo",100)}${nin("fl-n","Horizonte de evaluación (años)",5)}${nin("fl-s","Valor de salvamento de los activos al final",400)}${nin("fl-v","Ventas del año 1",900)}${nin("fl-g","Crecimiento de las ventas (%)",5,"0.5")}${nin("fl-cv","Costos variables (% de ventas)",45,"1")}${nin("fl-cf","Costos fijos anuales (sin depreciación)",180)}${nin("fl-t","Impuesto de renta (%)",35,"1")}${nin("fl-w","Tasa del proyecto (WACC, %)",14,"0.5")}${nin("fl-pr","Préstamo (% de la inversión total)",40,"5")}${nin("fl-ti","Tasa del préstamo (%)",12,"0.5")}${nin("fl-ke","Costo del patrimonio (%)",17,"0.5")}</div><div class="res" id="fl-res"></div><div id="fl-o"></div>`;
  const ids=["fl-i","fl-vu","fl-kt","fl-n","fl-s","fl-v","fl-g","fl-cv","fl-cf","fl-t","fl-w","fl-pr","fl-ti","fl-ke"];
  const run=()=>{const[I,vu,KT,n0,S,V1,g0,cv0,CF,t0,w0,pr0,ti0,ke0]=ids.map(N),n=Math.max(1,Math.min(15,Math.round(n0))),[g,cv,t,w,pr,ti,ke]=[g0,cv0,t0,w0,pr0,ti0,ke0].map(x=>x/100);if(![I,vu,KT,S,V1,CF].every(isFinite)||vu<=0){$("fl-res").innerHTML=err("faltan datos.");return}
    const dep=I/vu,lib=I-dep*Math.min(n,vu),gan=S-lib,Y=[...Array(n+1)].map((_,k)=>k),rows=Y.map(k=>{if(k===0)return{k,v:0,cvv:0,cf:0,d:0,uaii:0,imp:0,inv:-(I+KT),sal:0,fcl:-(I+KT)};const v=V1*Math.pow(1+g,k-1),cvv=v*cv,d=k<=vu?dep:0,uaii=v-cvv-CF-d,imp=uaii*t,sal=k===n?S-gan*t+KT:0;return{k,v,cvv,cf:CF,d,uaii,imp,inv:0,sal,fcl:uaii-imp+d+sal}});
    const L=pr*(I+KT),q=ti>0?L*ti/(1-Math.pow(1+ti,-n)):L/n;let sal=L;const deu=Y.map(k=>{if(k===0)return{int:0,am:0,cuota:0,s:L};const int=sal*ti,am=q-int;sal-=am;return{int,am,cuota:q,s:Math.max(0,sal)}});
    const F=rows.map(r=>r.fcl),FE=rows.map((r,k)=>k===0?r.fcl+L:r.fcl-deu[k].int*(1-t)-deu[k].am);
    const vpn=npv(w,F),tir=irr(F),vpnE=npv(ke,FE),tirE=irr(FE),fv=F.slice(1).reduce((s,f,k)=>s+(f>0?f*Math.pow(1+w,n-k-1):0),0),pvneg=F.reduce((s,f,k)=>s+(f<0?f/Math.pow(1+w,k):0),0),tirm=Math.pow(fv/-pvneg,1/n)-1;
    const ben=F.slice(1).reduce((s,f,k)=>s+Math.max(0,f)/Math.pow(1+w,k+1),0),bc=ben/-pvneg;let acc=0,pri=NaN;for(let k=0;k<=n;k++){const prev=acc;acc+=F[k]/Math.pow(1+w,k);if(k>0&&prev<0&&acc>=0){pri=k-1+(-prev)/(F[k]/Math.pow(1+w,k));break}}const vae=vpn*w/(1-Math.pow(1+w,-n));
    $("fl-res").innerHTML=tl([["VPN del proyecto",d2(vpn),vpn>0?"okt":"badt"],["TIR del proyecto",pc(tir)],["TIRM (reinversión al WACC)",pc(tirm)],["B/C",d2(bc)],["PRI descontado",isFinite(pri)?d2(pri)+" años":"no se recupera"],["VPN en anualidad (VAE)",d2(vae)],["VPN del inversionista",d2(vpnE),vpnE>0?"okt":"badt"],["TIR del inversionista",pc(tirE)]]);
    const row=(l,f,b)=>`<tr><td>${b?"<b>"+l+"</b>":l}</td>${rows.map((r,k)=>`<td>${b?"<b>":""}${d2(f(r,k))}${b?"</b>":""}</td>`).join("")}</tr>`;
    $("fl-o").innerHTML=stp(1,"Flujo de caja libre del proyecto",`<div class="tbl"><table><tr><th>Año</th>${Y.map(k=>`<th>${k}</th>`).join("")}</tr>${row("Ventas",r=>r.v)}${row("− Costos variables",r=>-r.cvv)}${row("− Costos fijos",r=>-r.cf)}${row("− Depreciación",r=>-r.d)}${row("= UAII",r=>r.uaii,1)}${row("− Impuestos",r=>-r.imp)}${row("+ Depreciación",r=>r.d)}${row("− Inversión (activos y KT)",r=>r.inv)}${row("+ Salvamento neto y recuperación del KT",r=>r.sal)}${row("= FCL",r=>r.fcl,1)}</table></div><p class="hint">Salvamento neto = ${d2(S)} − (${d2(S)} − valor en libros ${d2(lib)})·${pc(t)} = ${d2(S-gan*t)}. En Excel: ${xl("=VNA(WACC; FCL1:FCLn) + FCL0")} y ${xl("=TIR(FCL0:FCLn)")}, ${xl("=TIRM(FCL0:FCLn; tasa_fin; tasa_reinv)")}.</p>`)
      +stp(2,"Flujo del inversionista",`<div class="tbl"><table><tr><th>Año</th>${Y.map(k=>`<th>${k}</th>`).join("")}</tr>${row("FCL",r=>r.fcl)}${row("+ Préstamo",(r,k)=>k===0?L:0)}${row("− Intereses",(r,k)=>-deu[k].int)}${row("+ Ahorro de impuestos por intereses",(r,k)=>deu[k].int*t)}${row("− Amortización",(r,k)=>-deu[k].am)}${row("= Flujo del inversionista",(r,k)=>FE[k],1)}</table></div><p>Descontado al costo del patrimonio (${pc(ke)}), el VPN del inversionista es ${d2(vpnE)}, frente a ${d2(vpn)} del proyecto al WACC. ${tirE>tir?"La TIR del inversionista es mayor que la del proyecto porque la deuda cuesta menos que lo que rinde el proyecto (apalancamiento favorable).":"La deuda cuesta más que lo que rinde el proyecto: el apalancamiento es desfavorable."}</p>`)};
  onIn(ids,run);run()};

// ---------- Hillier y Monte Carlo
SIMS.hillier=function(){
  $("sim").innerHTML=`<div class="calcf">${tarea("hl-d","Año; flujo esperado; desviación estándar","0; -1000; 0\n1; 300; 60\n2; 350; 80\n3; 400; 100\n4; 400; 120\n5; 450; 150",6)}${nin("hl-r","Tasa de descuento (%)",12,"0.5")}</div><div class="res" id="hl-res"></div><div id="hl-gr"></div><div id="hl-o"></div>`;
  const run=()=>{const D=lines($("hl-d").value).map(p=>({t:num(p[0]),m:num(p[1]),s:Math.abs(num(p[2]))})).filter(x=>isFinite(x.t)&&isFinite(x.m)&&isFinite(x.s)),r=N("hl-r")/100;if(D.length<2){$("hl-res").innerHTML=err("escribe al menos dos años.");return}
    const df=x=>Math.pow(1+r,-x.t),E=D.reduce((s,x)=>s+x.m*df(x),0),sI=Math.sqrt(D.reduce((s,x)=>s+x.s*x.s*df(x)*df(x),0)),sC=D.reduce((s,x)=>s+x.s*df(x),0);
    let sd=3;const rnd=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646},gau=()=>Math.sqrt(-2*Math.log(rnd()+1e-12))*Math.cos(2*Math.PI*rnd());const M=4000,sims=[];for(let k=0;k<M;k++)sims.push(D.reduce((s,x)=>s+(x.m+x.s*gau())*df(x),0));
    const neg=sims.filter(v=>v<0).length/M,lo=Math.min(...sims),hi=Math.max(...sims),B=30,h=(hi-lo)/B,cnt=Array(B).fill(0);sims.forEach(v=>cnt[Math.min(B-1,Math.floor((v-lo)/h))]++);
    $("hl-res").innerHTML=tl([["E[VPN]",d2(E),E>0?"okt":"badt"],["σ con flujos independientes",d2(sI)],["σ con flujos perfectamente correlacionados",d2(sC)],["P(VPN < 0) independientes",pc(Phi(-E/sI))],["P(VPN < 0) correlacionados",pc(Phi(-E/sC))],["P(VPN < 0) Monte Carlo",pc(neg)]]);
    $("hl-gr").innerHTML=plotXY({xr:[lo,hi],yr:[0,Math.max(...cnt)/(M*h)*1.15],areas:cnt.map((c,i)=>({pts:[[lo+i*h,0],[lo+(i+1)*h,0],[lo+(i+1)*h,c/(M*h)],[lo+i*h,c/(M*h)]],col:lo+(i+.5)*h<0?"--bad":"--line",op:.6})),series:[{f:x=>Math.exp(-Math.pow((x-E)/sI,2)/2)/(sI*Math.sqrt(2*Math.PI)),col:"--ink"}],vlines:[{x:0,col:"--muted"}],xl:"VPN",yl:"Densidad",label:"Distribución del VPN"})+legend([["--line","Monte Carlo (4 000 escenarios)"],["--ink","Normal de Hillier (independientes)"]]);
    $("hl-o").innerHTML=stp(1,"Media y varianza",`<div class="eq al">E[VPN] = Σ μₜ/(1 + i)ᵗ = ${D.map(x=>d2(x.m*df(x))).join(" + ")} = <b>${d2(E)}</b><br>σ² (independientes) = Σ σₜ²/(1 + i)^(2t) = ${d2(sI*sI)} ⟹ σ = ${d2(sI)}<br>σ (correlación perfecta) = Σ σₜ/(1 + i)ᵗ = ${d2(sC)}</div><p>P(VPN < 0) = Φ(−E/σ) = Φ(${d4(-E/sI)}) = ${pc(Phi(-E/sI))} si los flujos son independientes. Con correlación perfecta el riesgo es mayor: ${pc(Phi(-E/sC))}. La realidad suele estar en medio: si a un proyecto le va mal un año, es probable que le vaya mal el siguiente.</p><p class="hint">En Excel: ${xl("=DISTR.NORM.N(0; E; σ; VERDADERO)")}.</p>`)};
  onIn(["hl-d","hl-r"],run);run()};

// ---------- Evaluación económica
SIMS.social=function(){
  const P=[["Beneficios (ventas o ahorros de los usuarios)",420,1],["Mano de obra no calificada",-90,0.6],["Mano de obra calificada",-60,1],["Insumos importados",-80,1.1],["Insumos nacionales",-50,0.9],["Impuestos pagados",-40,0],["Subsidio recibido",30,0]];
  $("sim").innerHTML=`<p class="hint">Partidas anuales (millones de pesos) con su razón precio cuenta (RPC). Valores ilustrativos: las RPC oficiales las publica el DNP.</p><div class="tbl"><table><tr><th>Partida anual</th><th>Valor financiero</th><th>RPC</th></tr>${P.map((p,i)=>`<tr><td>${p[0]}</td><td>${cin("so-v"+i,p[0]+": valor financiero",p[1])}</td><td>${cin("so-r"+i,p[0]+": RPC",p[2],"0.05")}</td></tr>`).join("")}<tr><td>Inversión inicial</td><td>${cin("so-iv","Inversión inicial: valor financiero",-900)}</td><td>${cin("so-ir","Inversión inicial: RPC",0.95,"0.05")}</td></tr></table></div><div class="calcf">${nin("so-n","Años de operación",10)}${nin("so-tp","Tasa privada (%)",14,"0.5")}${nin("so-ts","Tasa social de descuento (%)",9,"0.5")}</div><div class="res" id="so-res"></div><div id="so-o"></div>`;
  const ids=[...P.flatMap((_,i)=>["so-v"+i,"so-r"+i]),"so-iv","so-ir","so-n","so-tp","so-ts"];
  const run=()=>{const v=P.map((_,i)=>N("so-v"+i)),rp=P.map((_,i)=>N("so-r"+i)),iv=N("so-iv"),ir=N("so-ir"),n=Math.max(1,Math.round(N("so-n"))),tp=N("so-tp")/100,ts=N("so-ts")/100;
    const af=v.reduce((a,b)=>a+b,0),ae=v.reduce((s,x,i)=>s+x*rp[i],0),fa=r=>(1-Math.pow(1+r,-n))/r,vf=iv+af*fa(tp),ve=iv*ir+ae*fa(ts);
    $("so-res").innerHTML=tl([["Flujo anual financiero",d2(af)],["Flujo anual económico",d2(ae)],["VPN financiero",d2(vf),vf>0?"okt":"badt"],["VPN económico",d2(ve),ve>0?"okt":"badt"]]);
    $("so-o").innerHTML=stp(1,"Conversión a precios de cuenta",`<div class="tbl"><table><tr><th>Partida</th><th>Financiero</th><th>RPC</th><th>Económico</th></tr>${P.map((p,i)=>`<tr><td>${p[0]}</td><td>${d2(v[i])}</td><td>${d2(rp[i])}</td><td>${d2(v[i]*rp[i])}</td></tr>`).join("")}<tr><td><b>Flujo anual</b></td><td><b>${d2(af)}</b></td><td></td><td><b>${d2(ae)}</b></td></tr></table></div><p class="hint">Impuestos y subsidios tienen RPC 0: son transferencias entre agentes, no usan recursos reales. La mano de obra no calificada tiene RPC menor que 1 porque, con desempleo, su costo de oportunidad es menor que el salario.</p>`)
      +stp(2,"Comparación",`<div class="eq al">VPN financiero = ${d2(iv)} + ${d2(af)}·[1 − (1 + ${pc(tp)})^(−${n})]/${pc(tp)} = <b>${d2(vf)}</b><br>VPN económico = ${d2(iv*ir)} + ${d2(ae)}·[1 − (1 + ${pc(ts)})^(−${n})]/${pc(ts)} = <b>${d2(ve)}</b></div><p>${vf<0&&ve>0?"El proyecto no le conviene a un inversionista privado pero sí a la sociedad: es un candidato a financiación pública o a una alianza con subsidio.":vf>0&&ve<0?"El proyecto es rentable para el inversionista pero le resta a la sociedad: sus ganancias vienen de transferencias o distorsiones.":vf>0?"El proyecto es conveniente desde ambos puntos de vista.":"El proyecto no conviene ni al inversionista ni a la sociedad."}</p>`)};
  onIn(ids,run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Mercado","Tendencia lineal","Q = a + bt; Excel: =TENDENCIA(Q; t; t_nuevo)"],["Mercado","Tendencia exponencial","Q = A·e^(rt); Excel: =CRECIMIENTO(Q; t; t_nuevo)"],["Técnico","Factor de escala","I₁ = I₀·(T₁/T₀)^α"],["Técnico","Localización por puntos","Σ pesoᵢ·calificaciónᵢ; Excel: =SUMAPRODUCTO()"],["Técnico","Punto de equilibrio","Q = CF/(P − CVu); en pesos CF/(1 − CVu/P)"],["Técnico","Multiproducto","Q = CF/Σ wᵢ(Pᵢ − CVuᵢ)"],["Técnico","GAO","Q(P − CVu)/[Q(P − CVu) − CF]"],["Ambiental","Conesa","I = ±(3IN + 2EX + MO + PE + RV + SI + AC + EF + PR + MC)"],["Riesgo","Nivel","Probabilidad × impacto"],
    ["Financiero","Flujo de caja libre","UAII(1 − t) + depreciación − inversiones − ΔKT + salvamento"],["Financiero","Salvamento neto","S − (S − valor en libros)·t"],["Financiero","Flujo del inversionista","FCL + préstamo − intereses(1 − t) − amortización"],["Criterios","VPN","Σ Fₜ/(1 + i)ᵗ; Excel: =VNA(i; F1:Fn) + F0"],["Criterios","TIR","VPN(TIR) = 0; Excel: =TIR(F0:Fn)"],["Criterios","TIRM","(VF de positivos/VP de negativos)^(1/n) − 1; Excel: =TIRM()"],["Criterios","B/C","VP beneficios/VP costos"],["Criterios","CAE","VP·i/[1 − (1 + i)^(−n)]; Excel: =PAGO(i; n; −VP)"],
    ["Riesgo","E[VPN]","Σ μₜ/(1 + i)ᵗ"],["Riesgo","σ independientes","√Σ σₜ²/(1 + i)^(2t)"],["Riesgo","σ correlacionados","Σ σₜ/(1 + i)ᵗ"],["Riesgo","Probabilidad de pérdida","Φ(−E[VPN]/σ)"],["Social","Precio de cuenta","Precio de mercado × RPC"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: TIRM"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
