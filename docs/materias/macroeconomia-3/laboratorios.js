// Macroeconomía III · laboratorios interactivos
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


// ===================== LABORATORIOS DE MACROECONOMÍA III =====================
const f2=v=>isFinite(v)?fmt(Math.abs(v)<5e-3?0:v,2).replace(/^-/,"−"):"—",f3=v=>isFinite(v)?fmt(Math.abs(v)<5e-4?0:v,3).replace(/^-/,"−"):"—",pc=v=>f2(v*100)+" %";
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const fail=(p,m)=>{$(p+"-res").innerHTML=err(m);["-g","-o"].forEach(x=>{const e=document.getElementById(p+x);if(e)e.innerHTML=""})};
const pesos=v=>"$ "+fmt(Math.round(v),0);
const rng2=(lo,hi,arr,pad=.08)=>{const v=arr.filter(isFinite),a=Math.min(lo,...v),b=Math.max(hi,...v),d=(b-a)||1;return[a-d*pad,b+d*pad]};

// ---------- Regla de Taylor
SIMS.taylor=function(){
  $("sim").innerHTML=`<div class="calcf">${nin("ty-r","Tasa real neutral r* (%)",2,"0.1")}${nin("ty-ps","Meta de inflación π* (%)",3,"0.1")}${nin("ty-p","Inflación observada π (%)",5,"0.1")}${nin("ty-y","Brecha del producto (%)",-1,"0.1")}${nin("ty-a","Peso a la inflación a",0.5,"0.1")}${nin("ty-b","Peso a la brecha b",0.5,"0.1")}${nin("ty-i","Tasa de política actual (%)",9.25,"0.25")}</div><div class="res" id="ty-res"></div><div id="ty-g"></div><div id="ty-o"></div>`;
  const run=()=>{const[r,ps,p,y,a,b,i0]=["ty-r","ty-ps","ty-p","ty-y","ty-a","ty-b","ty-i"].map(N);if(![r,ps,p,y,a,b].every(isFinite))return fail("ty","faltan datos.");
    const i=r+p+a*(p-ps)+b*y,re=i-p,gap=isFinite(i0)?i0-i:NaN;
    $("ty-res").innerHTML=tl([["Tasa según la regla",f2(i)+" %","okt"],["Tasa real implícita",f2(re)+" %"],["Respuesta a 1 punto de inflación",f2(1+a)+" puntos",1+a>1?"okt":"badt"],...(isFinite(gap)?[["Tasa actual frente a la regla",(gap>0?"+":"")+f2(gap)+" puntos",Math.abs(gap)<.5?"okt":""]]:[])]);
    $("ty-g").innerHTML=plotXY({xr:[0,10],yr:[0,Math.max(15,i+3)],series:[{f:x=>r+x+a*(x-ps)+b*y,col:"--line"},{f:x=>r+x,col:"--muted",dash:"5 4",w:1.6}],points:[{x:p,y:i,label:"regla"},...(isFinite(i0)?[{x:p,y:i0,label:"actual",col:"--exam"}]:[])],vlines:[{x:ps,col:"--good"}],xl:"inflación π (%)",yl:"tasa nominal i (%)",label:"Regla de Taylor"})+legend([["--line","Regla de Taylor"],["--muted","Tasa real constante (i = r* + π)",1],["--good","Meta π*"]]);
    $("ty-o").innerHTML=stp(1,"Cálculo",`<div class="eq al">i = r* + π + a(π − π*) + b(y − y*) = ${f2(r)} + ${f2(p)} + ${f2(a)}(${f2(p)} − ${f2(ps)}) + ${f2(b)}(${f2(y)}) = <b>${f2(i)} %</b></div><p>${p>ps?"La inflación está por encima de la meta: la regla pide una política contractiva (tasa real por encima de la neutral).":p<ps?"La inflación está por debajo de la meta: la regla pide una tasa real menor que la neutral.":"Inflación en la meta: la tasa real solo responde a la brecha."} ${1+a>1?"Se cumple el principio de Taylor: la tasa real sube cuando sube la inflación, lo que estabiliza.":"No se cumple el principio de Taylor (a ≤ 0): la tasa real cae con la inflación, lo que es desestabilizador."}</p>`)};
  onIn(["ty-r","ty-ps","ty-p","ty-y","ty-a","ty-b","ty-i"],run);run()};

// ---------- Curva de Lucas
SIMS.lucas=function(){
  $("sim").innerHTML=`<p class="hint">Oferta de Lucas: y − y* = b(p − Eₜ₋₁p). Demanda agregada en logaritmos: y = m − p. Expectativas racionales: E p = E m − y*.</p>${ctl("lu-b","Sensibilidad de la oferta b",0.1,5,0.1,1)}<div class="calcf">${nin("lu-ma","Expansión monetaria anunciada (%)",5,"0.5")}${nin("lu-ms","Sorpresa monetaria (%)",0,"0.5")}</div><div class="res" id="lu-res"></div><div id="lu-o"></div>`;
  const run=()=>{const b=V("lu-b"),ma=N("lu-ma"),ms=N("lu-ms");if(!isFinite(ma)||!isFinite(ms))return;const dy=b*ms/(1+b),dp=ma+ms/(1+b);
    $("lu-res").innerHTML=tl([["Efecto en el producto",f2(dy)+" %",Math.abs(dy)>0?"okt":""],["Efecto en el nivel de precios",f2(dp)+" %"],["Parte de la sorpresa que va a producto",pc(b/(1+b))]]);
    $("lu-o").innerHTML=stp(1,"Solución",`<div class="eq al">m − p = y* + b(p − Ep) ⟹ p = (m − y* + b·Ep)/(1 + b)<br>Ep = Em − y* ⟹ p − Ep = (m − Em)/(1 + b) ⟹ y − y* = b(m − Em)/(1 + b)</div>
      <p>La parte anunciada (${f2(ma)} %) sube los precios uno a uno y no mueve el producto. Solo la sorpresa (${f2(ms)} %) afecta el producto: ${f2(dy)} %. ${b>2?"Con oferta muy sensible, la sorpresa se va casi toda a producto.":""}</p><p class="hint">Proposición de inefectividad (Sargent y Wallace): una regla monetaria sistemática es anticipada y no estabiliza el producto. Con contratos de precios fijados por adelantado (Fischer), parte de la política anticipada sí tendría efecto real en el corto plazo.</p>`)};
  bindCtl(["lu-b"],run);onIn(["lu-ma","lu-ms"],run);run()};

// ---------- Sostenibilidad de la deuda
SIMS.deuda=function(){
  $("sim").innerHTML=`<div class="calcf">${nin("de-d","Deuda inicial (% del PIB)",60,"1")}${nin("de-r","Tasa de interés real r (%)",4,"0.1")}${nin("de-g","Crecimiento real g (%)",2,"0.1")}${nin("de-s","Superávit primario s (% del PIB)",0.5,"0.1")}${nin("de-n","Años",20,"1")}</div><div class="res" id="de-res"></div><div id="de-gr"></div><div id="de-o"></div>`;
  const run=()=>{const[d0,r,g,s,n]=["de-d","de-r","de-g","de-s","de-n"].map(N);if(![d0,r,g,s].every(isFinite)||!(n>0))return fail("de","faltan datos.");const R=(1+r/100)/(1+g/100),ss=(r-g)/(100+g)*d0,path=[d0];
    for(let t=1;t<=Math.min(100,n);t++)path.push(path[t-1]*R-s);const dinf=Math.abs(R-1)>1e-9&&R<1?-s/(R-1):NaN;
    $("de-res").innerHTML=tl([["Superávit que estabiliza s*",f2(ss)+" % del PIB","okt"],[`Deuda en ${n} años`,f2(path[path.length-1])+" %",path[path.length-1]>d0?"badt":"okt"],["r − g",f2(r-g)+" puntos",r>g?"badt":"okt"],...(isFinite(dinf)?[["Nivel al que converge",f2(dinf)+" %"]]:[])]);
    $("de-gr").innerHTML=plotXY({xr:[0,path.length-1],yr:rng2(0,d0,path),series:[{pts:path.map((v,t)=>[t,v]),col:"--line",w:2.4}],hlines:[{y:d0,col:"--muted"}],xl:"años",yl:"deuda / PIB (%)",label:"Trayectoria de la deuda"});
    $("de-o").innerHTML=stp(1,"Dinámica",`<div class="eq al">d_t = [(1 + r)/(1 + g)]·d_(t−1) − s = ${f3(R)}·d_(t−1) − ${f2(s)}<br>s* = (r − g)/(1 + g)·d = (${f2(r)} − ${f2(g)})/(${f2(100+g)})·${f2(d0)} = <b>${f2(ss)} %</b> del PIB</div>
      <p>${s>=ss-1e-9?"El superávit actual alcanza o supera el que estabiliza la deuda: la razón deuda/PIB no crece.":`Falta un ajuste de ${f2(ss-s)} puntos del PIB para estabilizar la deuda.`} ${r>g?"Como r > g, el efecto bola de nieve empuja la deuda hacia arriba si no hay superávit.":"Como r < g, el crecimiento diluye la deuda: puede estabilizarse incluso con déficit primario."}</p>`)};
  onIn(["de-d","de-r","de-g","de-s","de-n"],run);run()};

// ---------- Señoreaje
SIMS.senor=function(){
  $("sim").innerHTML=`${ctl("sn-a","Semielasticidad α",0.5,10,0.1,2)}${ctl("sn-A","Saldos reales con inflación cero A (% del PIB)",2,30,1,10)}${ctl("sn-D","Déficit a financiar con emisión (% del PIB)",0,5,0.1,1)}<div class="res" id="sn-res"></div><div id="sn-g"></div><div id="sn-o"></div>`;
  const run=()=>{const a=V("sn-a"),A=V("sn-A"),D=V("sn-D"),S=p=>p*A*Math.exp(-a*p),pm=1/a,Sm=S(pm);
    const root=(lo,hi)=>{let f=p=>S(p)-D;if(f(lo)*f(hi)>0)return NaN;for(let i=0;i<100;i++){const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m}return(lo+hi)/2};
    const pL=D>0&&D<=Sm?root(0,pm):NaN,pH=D>0&&D<=Sm?root(pm,20/a):NaN,xm=Math.min(6/a,8);
    $("sn-res").innerHTML=tl([["Inflación que maximiza el señoreaje",pc(pm),"okt"],["Señoreaje máximo",f3(Sm)+" % del PIB"],["Equilibrio de inflación baja",isFinite(pL)?pc(pL):"—"],["Equilibrio de inflación alta",isFinite(pH)?pc(pH):"—"],["¿Financiable?",D<=Sm?"sí":"no: hiperinflación",D<=Sm?"okt":"badt"]]);
    $("sn-g").innerHTML=plotXY({xr:[0,xm],yr:[0,Math.max(Sm,D)*1.25],series:[{f:S,col:"--line"}],hlines:[{y:D,col:"--exam"}],points:[{x:pm,y:Sm,label:"máximo"},...(isFinite(pL)?[{x:pL,y:D,label:"A",col:"--good"}]:[]),...(isFinite(pH)?[{x:pH,y:D,label:"B",col:"--exam"}]:[])],xl:"inflación π (tanto por uno)",yl:"señoreaje (% del PIB)",label:"Curva de Laffer del señoreaje"})+legend([["--line","S(π) = π·A·e^(−απ)"],["--exam","Déficit a financiar"]]);
    $("sn-o").innerHTML=stp(1,"Análisis",`<div class="eq al">dS/dπ = A·e^(−απ)(1 − απ) = 0 ⟹ π* = 1/α = ${f3(pm)} ⟹ S_max = A/(α·e) = ${f3(Sm)}</div><p>${D>Sm?`El déficit (${f2(D)} % del PIB) supera el máximo señoreaje posible: ninguna tasa de inflación estable lo financia. La inflación se acelera sin límite: hiperinflación (Cagan).`:D>0?`Hay dos inflaciones que financian el déficit: A (${pc(pL)}) y B (${pc(pH)}). A está en el lado «bueno» de la curva; B es ineficiente, porque con la misma recaudación el público tiene muchos menos saldos reales.`:"Sin déficit monetizado no se necesita señoreaje."}</p>`)};
  bindCtl(["sn-a","sn-A","sn-D"],run);run()};

// ---------- Equivalencia ricardiana
SIMS.ricardo=function(){
  $("sim").innerHTML=tabsBox("rc",[["eq","Equivalencia ricardiana"],["suav","Suavización de impuestos"]]);const B=$("rc-b");
  tabsRun("rc",{
   eq(){B.innerHTML=`<p class="hint">Hogar con dos periodos y utilidad ln c₁ + β ln c₂. El gobierno recorta impuestos hoy en Δ y los sube en (1 + r)Δ mañana.</p><div class="calcf">${nin("ri-y1","Ingreso y₁",100)}${nin("ri-y2","Ingreso y₂",100)}${nin("ri-T","Impuesto base en cada periodo",20)}${nin("ri-r","Tasa de interés r (%)",5,"0.5")}${nin("ri-b","Paciencia β",0.95,"0.01")}${nin("ri-d","Recorte Δ",10)}</div><div style="margin:8px 0">${seg("ri-l","Crédito",[["no","Puede endeudarse"],["si","Restricción de liquidez"]],"no")}</div><div class="res" id="ri-res"></div><div id="ri-o"></div>`;
    let liq=false;const run=()=>{const[y1,y2,T,r0,b,D]=["ri-y1","ri-y2","ri-T","ri-r","ri-b","ri-d"].map(N);if(![y1,y2,T,r0,b,D].every(isFinite))return fail("ri","faltan datos.");const r=r0/100;
      const sol=(T1,T2)=>{const W=y1-T1+(y2-T2)/(1+r);let c1=W/(1+b);if(liq&&c1>y1-T1)c1=y1-T1;const c2=(y1-T1-c1)*(1+r)+y2-T2;return{c1,c2,s:y1-T1-c1,W}};
      const a=sol(T,T),n=sol(T-D,T+(1+r)*D);
      $("ri-res").innerHTML=tl([["Consumo hoy antes",f2(a.c1)],["Consumo hoy después",f2(n.c1),Math.abs(n.c1-a.c1)<1e-9?"okt":"badt"],["Ahorro privado antes",f2(a.s)],["Ahorro privado después",f2(n.s)],["Cambio en el ahorro nacional",f2((n.s-D)-a.s)]]);
      $("ri-o").innerHTML=stp(1,"Riqueza y consumo",`<div class="eq al">Riqueza = (y₁ − T₁) + (y₂ − T₂)/(1 + r): antes ${f2(a.W)}, después ${f2(n.W)}<br>c₁ = Riqueza/(1 + β)${liq?", con el tope c₁ ≤ y₁ − T₁":""}</div><p>${Math.abs(n.c1-a.c1)<1e-9?`La riqueza no cambia: el hogar ahorra todo el recorte (${f2(D)}) para pagar el impuesto futuro. El ahorro público cae en ${f2(D)} y el privado sube lo mismo: el ahorro nacional no cambia. Se cumple la equivalencia ricardiana.`:`Con restricción de liquidez el hogar quería consumir más de lo que su ingreso disponible permitía; el recorte le da liquidez y consume ${f2(n.c1-a.c1)} más. La equivalencia ricardiana falla.`}</p>`)};
    bindSeg("ri-l",v=>{liq=v==="si";run()});onIn(["ri-y1","ri-y2","ri-T","ri-r","ri-b","ri-d"],run);run()},
   suav(){B.innerHTML=`<p class="hint">El gobierno debe financiar un gasto extraordinario en un año. Costo de eficiencia de cada año ∝ τ²: comparar financiarlo de una vez frente a repartirlo con deuda.</p><div class="calcf">${nin("su-G","Gasto extraordinario (% del PIB)",6,"0.5")}${nin("su-n","Años para repartir",10,"1")}${nin("su-t","Tasa impositiva normal (%)",20,"1")}</div><div class="res" id="su-res"></div>`;
    const run=()=>{const[G,n,t]=["su-G","su-n","su-t"].map(N);if(!(n>=1)||![G,t].every(isFinite))return;const una=(t+G)**2+(n-1)*t*t,rep=n*(t+G/n)**2;
      $("su-res").innerHTML=tl([["Pérdida si se cobra de una vez",fmt(una,1)],["Pérdida si se reparte",fmt(rep,1),"okt"],["Ahorro de eficiencia",pc(1-rep/una)]])+`<p class="hint">Suma de τ² en los ${n} años (proporcional al exceso de gravamen, ignorando intereses). Como la pérdida es convexa en la tasa, repartir el gasto con deuda reduce el costo: es la teoría de Barro.</p>`};
    onIn(["su-G","su-n","su-t"],run);run()}})};

// ---------- Multiplicadores
SIMS.mult=function(){
  $("sim").innerHTML=`${ctl("mu-c","Propensión a consumir c",0.3,0.95,0.01,0.75)}${ctl("mu-t","Tasa impositiva t",0,0.5,0.01,0.25)}${ctl("mu-m","Propensión a importar m",0,0.5,0.01,0.2)}${ctl("mu-f","Fracción anulada por la política monetaria",0,1,0.05,0.3)}${ctl("mu-k","Efecto expectativas por peso de ajuste creíble",0,1.5,0.05,0)}<div class="calcf">${nin("mu-g","Cambio en el gasto (% del PIB)",-1,"0.5")}</div><div class="res" id="mu-res"></div><div id="mu-o"></div>`;
  const run=()=>{const c=V("mu-c"),t=V("mu-t"),m=V("mu-m"),f=V("mu-f"),k=V("mu-k"),dg=N("mu-g");if(!isFinite(dg))return;const s=1/(1-c),a=1/(1-c*(1-t)+m),mu=a*(1-f),dy=mu*dg+(dg<0?k*Math.abs(dg)*a:0);
    $("mu-res").innerHTML=tl([["Multiplicador simple 1/(1 − c)",f2(s)],["Con impuestos e importaciones",f2(a)],["Con respuesta monetaria",f2(mu),"okt"],["Efecto en el PIB",f2(dy)+" % del PIB",dy>0?"okt":dy<0?"badt":""]]);
    $("mu-o").innerHTML=stp(1,"Cálculo",`<div class="eq al">1/(1 − c(1 − t) + m) = 1/(1 − ${f2(c)}·${f2(1-t)} + ${f2(m)}) = ${f2(a)} ⟹ × (1 − ${f2(f)}) = ${f2(mu)}</div><p>${dg<0&&k>0?`Con un ajuste (ΔG = ${f2(dg)}) el canal keynesiano resta ${f2(-mu*dg)} puntos, pero el canal de expectativas (menor prima de riesgo y menos impuestos futuros) suma ${f2(k*Math.abs(dg)*a)}. ${dy>0?"El resultado neto es una contracción fiscal expansiva.":"El canal de expectativas no alcanza a compensar: el ajuste sigue siendo contractivo."}`:"Cada filtración (impuestos, importaciones, respuesta monetaria) reduce el multiplicador. Prueba un ajuste (ΔG negativo) con un efecto expectativas positivo para ver una contracción expansiva."}</p>`)};
  bindCtl(["mu-c","mu-t","mu-m","mu-f","mu-k"],run);onIn(["mu-g"],run);run()};

// ---------- Barro-Gordon
SIMS.bg=function(){
  $("sim").innerHTML=`<p class="hint">L = ½(y − y* − g)² + (a/2)π², con y = y* + b(π − πᵉ). g = (k − 1)y* es la brecha que la autoridad quisiera tener.</p>${ctl("bg-a","Peso a la inflación a",0.1,5,0.1,1)}${ctl("bg-b","Pendiente de la curva de Phillips b",0.1,3,0.1,1)}${ctl("bg-g","Brecha deseada g (%)",0,5,0.1,2)}${ctl("bg-r","Peso del banquero conservador a′",0.1,10,0.1,3)}${ctl("bg-d","Factor de descuento δ",0.05,0.99,0.01,0.6)}<div class="res" id="bg-res"></div><div id="bg-o"></div>`;
  const run=()=>{const a=V("bg-a"),b=V("bg-b"),g=V("bg-g"),ar=V("bg-r"),d=V("bg-d");const L=(pi,pe)=>{const x=b*(pi-pe);return .5*(x-g)**2+a/2*pi*pi};
    const pD=b*g/a,pC=b*g/(a+b*b),LR=L(0,0),LD=L(pD,pD),LC=L(pC,0),pRog=b*g/ar,LRog=L(pRog,pRog),tent=LR-LC,cast=d/(1-d)*(LD-LR),dmin=tent/(tent+(LD-LR));
    $("bg-res").innerHTML=tl([["Inflación con discreción",f2(pD)+" %","badt"],["Inflación con regla",f2(0)+" %","okt"],["Con banquero conservador",f2(pRog)+" %"],["¿Regla sostenible por reputación?",cast>=tent?"sí":"no",cast>=tent?"okt":"badt"]]);
    $("bg-o").innerHTML=stp(1,"Tres situaciones",`<div class="tbl"><table><tr><th>Situación</th><th>π</th><th>πᵉ</th><th>y − y*</th><th>Pérdida</th></tr><tr><td>Regla creída y cumplida</td><td>0</td><td>0</td><td>0</td><td>${f3(LR)}</td></tr><tr><td>Engaño (el público cree la regla)</td><td>${f2(pC)}</td><td>0</td><td>${f2(b*pC)}</td><td>${f3(LC)}</td></tr><tr><td>Discreción (equilibrio)</td><td>${f2(pD)}</td><td>${f2(pD)}</td><td>0</td><td>${f3(LD)}</td></tr><tr><td>Banquero conservador (a′ = ${f2(ar)})</td><td>${f2(pRog)}</td><td>${f2(pRog)}</td><td>0</td><td>${f3(LRog)}</td></tr></table></div>
      <div class="eq al">Discreción: ∂L/∂π = b(b(π − πᵉ) − g) + aπ = 0 con π = πᵉ ⟹ π = bg/a = ${f2(pD)}<br>Engaño: π = bg/(a + b²) = ${f2(pC)}</div><p>La discreción da más inflación y la misma producción que la regla: pérdida ${f3(LD)} frente a ${f3(LR)}. Pero el engaño es aún mejor para la autoridad (${f3(LC)}), así que la regla no es creíble por sí sola.</p>`)
      +stp(2,"Reputación en el juego repetido",`<div class="eq al">Tentación = L(regla) − L(engaño) = ${f3(tent)}<br>Castigo = δ/(1 − δ)·[L(discreción) − L(regla)] = ${f3(cast)}</div><p>${cast>=tent?"El castigo futuro (volver a la discreción) supera la tentación: la regla se sostiene por reputación.":"La tentación supera el castigo: la autoridad engañaría."} La regla es sostenible si δ ≥ ${f3(dmin)}.</p>`)};
  bindCtl(["bg-a","bg-b","bg-g","bg-r","bg-d"],run);run()};

// ---------- Tragedia de los comunes
SIMS.comunes=function(){
  $("sim").innerHTML=`<p class="hint">Cada uno de n grupos obtiene b·ln(gᵢ) de su gasto; el costo de financiar el total G es ½G², repartido por igual.</p>${ctl("co-n","Número de grupos n",1,30,1,5)}${ctl("co-b","Valoración del gasto b",0.5,10,0.5,4)}<div class="res" id="co-res"></div><div id="co-g"></div><div id="co-o"></div>`;
  const run=()=>{const n=V("co-n"),b=V("co-b"),Gc=k=>k*Math.sqrt(b),Go=k=>Math.sqrt(k*b);
    $("co-res").innerHTML=tl([["Gasto total con fondo común",f2(Gc(n)),"badt"],["Gasto socialmente óptimo",f2(Go(n)),"okt"],["Exceso de gasto",pc(Gc(n)/Go(n)-1)]]);
    $("co-g").innerHTML=plotXY({xr:[1,30],yr:[0,Gc(30)*1.05],series:[{f:Gc,col:"--exam"},{f:Go,col:"--good"}],points:[{x:n,y:Gc(n),label:"n actual",col:"--exam"}],xl:"número de grupos n",yl:"gasto total G",label:"Ley de 1/n"})+legend([["--exam","Fondo común"],["--good","Óptimo"]]);
    $("co-o").innerHTML=stp(1,"Solución",`<div class="eq al">Grupo i: máx b·ln gᵢ − (1/n)·½G² ⟹ b/gᵢ = G/n ⟹ con G = n·g: g = √b, G = n√b = ${f2(Gc(n))}<br>Óptimo social: máx Σ b·ln gᵢ − ½G² ⟹ b/gᵢ = G ⟹ g = √(b/n), G = √(nb) = ${f2(Go(n))}</div><p>El gasto con fondo común crece como n; el óptimo, como √n. La razón entre ambos es √n = ${f2(Math.sqrt(n))}: más grupos, más sobregasto. Las reglas fiscales y un ministerio de Hacienda con poder de veto buscan que alguien internalice todo el costo.</p>`)};
  bindCtl(["co-n","co-b"],run);run()};

// ---------- IVA en la cadena
SIMS.iva=function(){
  $("sim").innerHTML=`<p class="hint">Precios de venta sin IVA en cada etapa de la cadena. Cada empresa cobra IVA sobre su venta y descuenta el que pagó en sus compras.</p><div class="calcf">${nin("iv-t","Tarifa (%)",19,"1")}${nin("iv-1","Productor de materia prima",1000,"10")}${nin("iv-2","Fabricante",2500,"10")}${nin("iv-3","Mayorista",3200,"10")}${nin("iv-4","Minorista (venta al consumidor)",4000,"10")}</div><div style="margin:8px 0">${seg("iv-k","Bien final",[["g","Gravado"],["e","Exento"],["x","Excluido"]],"g")}</div><div class="res" id="iv-res"></div><div id="iv-o"></div>`;
  let k="g";const run=()=>{const t=N("iv-t")/100,v=["iv-1","iv-2","iv-3","iv-4"].map(N);if(!v.every(x=>isFinite(x)&&x>=0)||!isFinite(t))return fail("iv","faltan datos.");const nom=["Materia prima","Fabricante","Mayorista","Minorista"];
    const rows=v.map((x,i)=>{const last=i===3,gen=last&&k!=="g"?0:x*t,desc=i?v[i-1]*t:0,pagar=last&&k==="x"?0:gen-desc;return{n:nom[i],x,va:x-(i?v[i-1]:0),gen,desc:last&&k==="x"?0:desc,pagar,costo:last&&k==="x"?desc:0}});
    const tot=rows.reduce((s,r)=>s+r.pagar,0),pf=k==="g"?v[3]*(1+t):k==="e"?v[3]:v[3]+rows[3].costo;
    $("iv-res").innerHTML=tl([["Recaudo total",pesos(tot),"okt"],["Precio final al consumidor",pesos(pf)],["IVA oculto en el precio",k==="x"?pesos(rows[3].costo):"0"]]);
    $("iv-o").innerHTML=stp(1,"IVA por etapa",`<div class="tbl"><table><tr><th>Etapa</th><th>Venta sin IVA</th><th>Valor agregado</th><th>IVA generado</th><th>IVA descontable</th><th>Saldo a pagar</th></tr>${rows.map(r=>`<tr><td>${r.n}</td><td>${pesos(r.x)}</td><td>${pesos(r.va)}</td><td>${pesos(r.gen)}</td><td>${pesos(r.desc)}</td><td>${pesos(r.pagar)}${r.pagar<0?" (saldo a favor)":""}</td></tr>`).join("")}</table></div>`)
      +stp(2,"Lectura",`<p>${k==="g"?`El recaudo total (${pesos(tot)}) es igual a la tarifa por el precio final: ${fmt(t*100,0)} % × ${pesos(v[3])}. Cada etapa paga solo sobre su valor agregado, y quien soporta el impuesto es el consumidor final.`:k==="e"?`El bien exento tiene tarifa 0: el minorista no cobra IVA y queda con un saldo a favor de ${pesos(-rows[3].pagar)}, que puede pedir en devolución. El IVA total es 0 y el precio no lleva impuesto.`:`El bien excluido no es sujeto del IVA: el minorista no cobra IVA ni puede descontar el que pagó (${pesos(rows[3].costo)}), que se vuelve costo y se traslada al precio. El Estado recauda ${pesos(tot)} en las etapas anteriores.`}</p>`)};
  bindSeg("iv-k",x=>{k=x;run()});onIn(["iv-t","iv-1","iv-2","iv-3","iv-4"],run);run()};

// ---------- Incidencia y exceso de gravamen
SIMS.dwl=function(){
  $("sim").innerHTML=`<p class="hint">Demanda P = a − bQ, oferta P = c + dQ, impuesto unitario t.</p>${ctl("dw-t","Impuesto por unidad t",0,40,0.5,10)}${ctl("dw-b","Pendiente de la demanda b",0.1,5,0.1,1)}${ctl("dw-d","Pendiente de la oferta d",0.1,5,0.1,1)}<div class="calcf">${nin("dw-a","Intercepto de la demanda a",100)}${nin("dw-c","Intercepto de la oferta c",10)}</div><div class="res" id="dw-res"></div><div id="dw-g"></div><div id="dw-o"></div>`;
  const run=()=>{const t=V("dw-t"),b=V("dw-b"),d=V("dw-d"),a=N("dw-a"),c=N("dw-c");if(!(a>c))return fail("dw","el intercepto de la demanda debe superar al de la oferta.");
    const Q0=(a-c)/(b+d),P0=a-b*Q0,Qt=Math.max(0,(a-c-t)/(b+d)),Pc=a-b*Qt,Pp=Pc-t,R=t*Qt,DW=.5*t*(Q0-Qt),ed=P0/(b*Q0),es=P0/(d*Q0),shC=(Pc-P0)/(t||1);
    $("dw-res").innerHTML=tl([["Precio al consumidor",f2(Pc)],["Precio al productor",f2(Pp)],["Recaudo",f2(R),"okt"],["Exceso de gravamen",f2(DW),"badt"],["Parte del consumidor",pc(t?shC:b/(b+d))],["EG / recaudo",R?pc(DW/R):"—"]]);
    const qm=(a-c)/(b+d)*1.6,pm=a*1.05;
    $("dw-g").innerHTML=plotXY({xr:[0,qm],yr:[0,pm],areas:[{pts:[[0,Pp],[Qt,Pp],[Qt,Pc],[0,Pc]],col:"--good",op:.18},{pts:[[Qt,Pc],[Q0,P0],[Qt,Pp]],col:"--bad",op:.3}],series:[{f:q=>a-b*q,col:"--line"},{f:q=>c+d*q,col:"--ink"},{f:q=>c+t+d*q,col:"--ink",dash:"6 4",w:1.6}],points:[{x:Q0,y:P0,label:"E₀"},{x:Qt,y:Pc,label:"P_c",col:"--good"}],xl:"Q",yl:"P",label:"Incidencia y exceso de gravamen"})+legend([["--line","Demanda"],["--ink","Oferta"],["--ink","Oferta + t",1],["--good","Recaudo"],["--bad","Exceso de gravamen"]]);
    $("dw-o").innerHTML=stp(1,"Cálculo",`<div class="eq al">Q₀ = (a − c)/(b + d) = ${f2(Q0)}, P₀ = ${f2(P0)} · Q_t = (a − c − t)/(b + d) = ${f2(Qt)}<br>P_c = ${f2(Pc)} (sube ${f2(Pc-P0)}), P_p = ${f2(Pp)} (baja ${f2(P0-Pp)})<br>EG = ½·t·(Q₀ − Q_t) = ½·${f2(t)}·${f2(Q0-Qt)} = <b>${f2(DW)}</b></div><p>En el equilibrio inicial |ε_d| = ${f2(ed)} y ε_s = ${f2(es)}: el consumidor paga ε_s/(ε_s + |ε_d|) = ${pc(es/(es+ed))} de la carga. Paga más el lado menos elástico (de pendiente más inclinada). Duplica t y verás que el exceso de gravamen se multiplica por cuatro.</p>`)};
  bindCtl(["dw-t","dw-b","dw-d"],run);onIn(["dw-a","dw-c"],run);run()};

// ---------- Ramsey
SIMS.ramsey=function(){
  $("sim").innerHTML=`<p class="hint">Dos bienes con gasto inicial X₁ y X₂ y elasticidades |ε₁|, |ε₂|. Aproximaciones: recaudo ≈ tᵢXᵢ(1 − εᵢtᵢ), exceso de gravamen ≈ ½εᵢtᵢ²Xᵢ.</p><div class="calcf">${nin("ra-x1","Gasto en el bien 1",100)}${nin("ra-e1","|ε₁|",0.3,"0.05")}${nin("ra-x2","Gasto en el bien 2",100)}${nin("ra-e2","|ε₂|",1.5,"0.05")}${nin("ra-R","Recaudo requerido",20)}</div><div class="res" id="ra-res"></div><div id="ra-o"></div>`;
  const run=()=>{const[X1,e1,X2,e2,R]=["ra-x1","ra-e1","ra-x2","ra-e2","ra-R"].map(N);if(![X1,e1,X2,e2,R].every(v=>isFinite(v)&&v>0))return fail("ra","usa valores positivos.");
    const rec=(t1,t2)=>t1*X1*(1-e1*t1)+t2*X2*(1-e2*t2),eg=(t1,t2)=>.5*e1*t1*t1*X1+.5*e2*t2*t2*X2,tr=l=>[l/(e1*(1+2*l)),l/(e2*(1+2*l))];
    let lo=0,hi=1e3;const Rmax=X1/(4*e1)+X2/(4*e2);if(R>=Rmax*0.999)return fail("ra","el recaudo pedido supera el máximo de la curva de Laffer de estos bienes.");
    for(let i=0;i<200;i++){const m=(lo+hi)/2,[a,b]=tr(m);if(rec(a,b)<R)lo=m;else hi=m}const[t1,t2]=tr((lo+hi)/2);
    const A=e1*X1+e2*X2,S=X1+X2,disc=S*S-4*A*R,tu=disc>=0?(S-Math.sqrt(disc))/(2*A):NaN;
    $("ra-res").innerHTML=tl([["Tasa de Ramsey bien 1",pc(t1),"okt"],["Tasa de Ramsey bien 2",pc(t2),"okt"],["Tasa uniforme",pc(tu)],["EG con Ramsey",f2(eg(t1,t2)),"okt"],["EG con tasa uniforme",f2(eg(tu,tu)),"badt"]]);
    $("ra-o").innerHTML=stp(1,"Regla de la elasticidad inversa",`<div class="eq al">min ½ε₁t₁²X₁ + ½ε₂t₂²X₂ s.a. Σ tᵢXᵢ(1 − εᵢtᵢ) = R ⟹ tᵢ = λ/(εᵢ(1 + 2λ))<br>t₁/t₂ = ε₂/ε₁ = ${f2(e2/e1)} (resultado: ${f2(t1/t2)})</div><p>La tasa uniforme recauda lo mismo con un exceso de gravamen ${pc(eg(tu,tu)/eg(t1,t2)-1)} mayor. Si el bien 1 es una necesidad (inelástico), la regla de Ramsey lo grava más: eficiente pero regresivo. Por eso se combina con un impuesto progresivo a la renta y con transferencias.</p>`)};
  onIn(["ra-x1","ra-e1","ra-x2","ra-e2","ra-R"],run);run()};

// ---------- Renta personal y progresividad
const TAB241=[[0,1090,0,0],[1090,1700,.19,0],[1700,4100,.28,116],[4100,8670,.33,788],[8670,18970,.35,2296],[18970,31000,.37,5901],[31000,Infinity,.39,10352]];
const imp241=u=>{const f=TAB241.find(r=>u>r[0]&&u<=r[1])||TAB241[0];return u<=1090?0:(u-f[0])*f[2]+f[3]};
const marg241=u=>(TAB241.find(r=>u>r[0]&&u<=r[1])||TAB241[0])[2];
const gini=x=>{const s=x.slice().sort((a,b)=>a-b),n=s.length,tot=s.reduce((a,v)=>a+v,0);return s.reduce((a,v,i)=>a+(2*(i+1)-n-1)*v,0)/(n*tot)};
const conc=(x,ord)=>{const idx=ord.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]).map(p=>p[1]),s=idx.map(i=>x[i]),n=s.length,tot=s.reduce((a,v)=>a+v,0);return s.reduce((a,v,i)=>a+(2*(i+1)-n-1)*v,0)/(n*tot)};
SIMS.renta=function(){
  $("sim").innerHTML=tabsBox("rt",[["uno","Impuesto de una persona"],["prog","Progresividad de una población"]]);const B=$("rt-b");
  tabsRun("rt",{
   uno(){B.innerHTML=`<div class="calcf">${nin("rn-u","Valor de la UVT",52374,"1")}${nin("rn-y","Renta líquida gravable anual (pesos)",150000000,"1000000")}</div><p class="hint">UVT 2026: $52.374 (Resolución DIAN 000238 de 2025). Cambia el valor para otro año.</p><div class="res" id="rn-res"></div><div id="rn-g"></div><div id="rn-o"></div>`;
    const run=()=>{const U=N("rn-u"),Y=N("rn-y");if(!(U>0)||!(Y>=0))return fail("rn","datos no válidos.");const u=Y/U,T=imp241(u),f=TAB241.find(r=>u>r[0]&&u<=r[1])||TAB241[0];
      $("rn-res").innerHTML=tl([["Renta en UVT",fmt(u,2)],["Impuesto en UVT",fmt(T,2)],["Impuesto en pesos",pesos(T*U),"okt"],["Tasa media",pc(Y?T/u:0)],["Tasa marginal",pc(marg241(u))]]);
      const xm=Math.max(40000,u*1.2);$("rn-g").innerHTML=plotXY({xr:[0,xm],yr:[0,42],series:[{f:x=>x>0?imp241(x)/x*100:0,col:"--line"},{f:x=>marg241(x)*100,col:"--exam",w:1.8}],points:[{x:Math.min(u,xm),y:u?T/u*100:0,label:"tú"}],xl:"renta gravable (UVT)",yl:"tasa (%)",label:"Tasas media y marginal"})+legend([["--line","Tasa media"],["--exam","Tasa marginal"]]);
      $("rn-o").innerHTML=stp(1,"Cálculo con el artículo 241",`<div class="eq al">${fmt(Y,0)} / ${fmt(U,0)} = ${fmt(u,2)} UVT<br>${u<=1090?"Tramo exento: impuesto 0":`(${fmt(u,2)} − ${fmt(f[0],0)}) × ${fmt(f[2]*100,0)} % + ${fmt(f[3],0)} = ${fmt(T,2)} UVT`} ⟹ ${fmt(T,2)} × ${fmt(U,0)} = <b>${pesos(T*U)}</b></div><p class="hint">La renta líquida gravable es la que queda después de restar ingresos no constitutivos de renta, rentas exentas y deducciones. Como la tasa marginal supera a la media, el impuesto es progresivo.</p>`)};
    onIn(["rn-u","rn-y"],run);run()},
   prog(){B.innerHTML=`<div class="calcf">${nin("pg-u","Valor de la UVT",52374,"1")}<label for="pg-x">Ingresos gravables anuales de la población (pesos, uno por línea)<textarea id="pg-x" rows="6" style="width:100%">30000000\n55000000\n70000000\n95000000\n130000000\n200000000\n320000000\n600000000\n1200000000\n2500000000</textarea></label></div><div class="res" id="pg-res"></div><div id="pg-o"></div>`;
    const run=()=>{const U=N("pg-u"),X=$("pg-x").value.split(/[\s;]+/).map(s=>parseFloat(s.replace(/\./g,"").replace(",","."))).filter(v=>isFinite(v)&&v>=0);if(X.length<3||!(U>0))return fail("pg","escribe al menos 3 ingresos.");
      const T=X.map(x=>imp241(x/U)*U),N1=X.map((x,i)=>x-T[i]),tt=T.reduce((a,v)=>a+v,0);if(!tt)return fail("pg","con estos ingresos nadie paga impuesto: no se puede medir la progresividad.");const gx=gini(X),gn=gini(N1),ct=conc(T,X),K=ct-gx,RS=gx-gn,tm=tt/X.reduce((a,v)=>a+v,0);
      $("pg-res").innerHTML=tl([["Gini antes",f3(gx)],["Gini después",f3(gn)],["Concentración del impuesto",f3(ct)],["Kakwani",f3(K),K>0?"okt":"badt"],["Reynolds-Smolensky",f3(RS),"okt"],["Tasa media de la población",pc(tm)]]);
      $("pg-o").innerHTML=stp(1,"Lectura",`<div class="eq al">K = C_T − G_X = ${f3(ct)} − ${f3(gx)} = ${f3(K)} · RS = G_X − G_(X−T) = ${f3(gx)} − ${f3(gn)} = ${f3(RS)}<br>Aproximación: t/(1 − t)·K = ${f3(tm/(1-tm)*K)} (la diferencia es el reordenamiento)</div><p>${K>0?"El impuesto está más concentrado en los ricos que el ingreso: es progresivo.":"El impuesto no es progresivo."} El efecto redistributivo depende tanto de la progresividad (K) como del tamaño del recaudo (t): un impuesto muy progresivo que recauda poco redistribuye poco.</p>`)};
    onIn(["pg-u","pg-x"],run);run()}})};

// ---------- Okun
SIMS.okun=function(){
  $("sim").innerHTML=`<div class="calcf">${nin("ok-r","Ingreso del rico",200)}${nin("ok-p","Ingreso del pobre",20)}${nin("ok-t","Transferencia tomada al rico",20)}</div>${ctl("ok-l","Fracción que se pierde en el balde",0,0.95,0.05,0.4)}<div class="res" id="ok-res"></div><div id="ok-o"></div>`;
  const run=()=>{const Yr=N("ok-r"),Yp=N("ok-p"),T=N("ok-t"),l=V("ok-l");if(!(Yr>0&&Yp>0&&T>=0&&T<Yr))return fail("ok","datos no válidos.");const pr=Yp+(1-l)*T,ri=Yr-T,dW=Math.log(pr)-Math.log(Yp)+Math.log(ri)-Math.log(Yr),lmax=1-Yp/Yr;
    $("ok-res").innerHTML=tl([["Recibe el pobre",f2((1-l)*T)],["Se pierde",f2(l*T),"badt"],["Utilitarista (utilidad ln)",dW>0?"mejora":"empeora",dW>0?"okt":"badt"],["Rawls (maximin)",pr>Yp&&pr<=ri?"mejora":pr>Yp?"mejora (pero el pobre supera al rico)":"no mejora",pr>Yp?"okt":"badt"]]);
    $("ok-o").innerHTML=stp(1,"El balde que gotea",`<div class="eq al">ΔW = ln(${f2(pr)}) − ln(${f2(Yp)}) + ln(${f2(ri)}) − ln(${f2(Yr)}) = ${f3(dW)}</div><p>Con utilidad logarítmica, una transferencia pequeña mejora el bienestar utilitarista mientras la gota no supere 1 − Y_pobre/Y_rico = ${pc(lmax)}. Para Rawls cualquier gota menor que 100 % es aceptable mientras mejore al peor situado. Los dos criterios difieren justamente en cuánta ineficiencia aceptan a cambio de igualdad.</p>`)};
  onIn(["ok-r","ok-p","ok-t"],run);bindCtl(["ok-l"],run);run()};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "lu-b":"<b>Sensibilidad de la oferta a la sorpresa de precios</b> (y − y* = b(p − Eₜ₋₁p)). Solo la parte no anticipada de la política mueve el producto.",
 "sn-a":"<b>Semielasticidad de la demanda de dinero a la inflación</b>: cuánto bajan los saldos reales por cada punto de inflación. Define la curva de Laffer del señoreaje.","sn-A":"<b>Saldos reales con inflación cero</b> (% del PIB).","sn-D":"<b>Déficit a financiar con emisión.</b> Si supera el señoreaje máximo, no hay inflación estable que lo financie.",
 "mu-c":"<b>Propensión a consumir.</b>","mu-t":"<b>Tasa impositiva</b>: reduce el multiplicador.","mu-m":"<b>Propensión a importar</b>: parte del gasto se va al exterior y reduce el multiplicador.","mu-f":"<b>Fracción del estímulo que anula la política monetaria</b> (si el banco central sube la tasa).","mu-k":"<b>Efecto expectativas</b>: con un ajuste fiscal creíble, la confianza puede compensar el efecto contractivo.",
 "bg-a":"<b>Peso que la autoridad le da a la inflación</b> en su función de pérdida.","bg-b":"<b>Pendiente de la curva de Phillips</b>: cuánto producto se gana con una sorpresa de inflación.","bg-g":"<b>Brecha de producto que la autoridad quisiera</b> por encima del natural. Es la fuente del sesgo inflacionario (Barro-Gordon).","bg-r":"<b>Peso del banquero conservador</b> (Rogoff): con más peso a la inflación, el sesgo baja.","bg-d":"<b>Factor de descuento</b>: con autoridad paciente, la reputación puede sostener la inflación baja.",
 "co-n":"<b>Número de grupos</b> que tiran del presupuesto común. Más grupos, más gasto excesivo (tragedia de los comunes fiscal).","co-b":"<b>Cuánto valora cada grupo su propio gasto.</b>",
 "dw-t":"<b>Impuesto por unidad.</b> La pérdida de eficiencia crece con el cuadrado del impuesto.","dw-b":"<b>Pendiente de la demanda.</b>","dw-d":"<b>Pendiente de la oferta.</b> Paga más el impuesto el lado menos elástico.",
 "ok-l":"<b>Fracción que se pierde en el «balde agujereado»</b> de Okun al redistribuir: el costo de eficiencia de pasar ingreso de ricos a pobres."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
