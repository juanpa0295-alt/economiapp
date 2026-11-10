// Contabilidad y Análisis Financiero · laboratorios interactivos
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


// ===================== LABORATORIOS DE CONTABILIDAD Y ANÁLISIS FINANCIERO =====================
const d2=v=>isFinite(v)?fmt(Math.abs(v)<5e-3?0:v,2).replace(/^-/,"−"):"—",pc=v=>isFinite(v)?d2(v*100)+" %":"—",m0=v=>isFinite(v)?fmt(Math.round(v),0).replace(/^-/,"−"):"—";
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const tarea=(id,l,v,rows=3)=>`<label for="${id}">${l}<textarea id="${id}" rows="${rows}" spellcheck="false" style="width:100%;font-family:var(--f-mono)">${v}</textarea></label>`;
const lines=s=>String(s).split("\n").map(l=>l.split(/;|\t/).map(x=>x.trim())).filter(p=>p.length&&p[0]!=="");
const num=x=>{const v=+String(x??"").replace(/\s/g,"").replace(/\.(?=\d{3}(\D|$))/g,"").replace(/,/g,".");return isFinite(v)?v:NaN};
const xl=s=>`<code class="xl">${s}</code>`;

// ---------- Partida doble
const PUC={"1105":"Caja","1110":"Bancos","1305":"Clientes","1435":"Inventario de mercancías","1524":"Equipo de oficina","1528":"Equipo de cómputo","1592":"Depreciación acumulada","1705":"Gastos pagados por anticipado","2105":"Obligaciones financieras","2205":"Proveedores","2335":"Costos y gastos por pagar","2365":"Retención en la fuente","2408":"IVA por pagar","2505":"Salarios por pagar","3105":"Capital suscrito y pagado","3605":"Utilidad del ejercicio","4135":"Comercio al por mayor y menor","4210":"Ingresos financieros","5105":"Gastos de personal","5120":"Arrendamientos","5135":"Servicios","5160":"Depreciaciones","5305":"Gastos financieros","6135":"Costo de ventas"};
const CLASE={1:["Activo","D"],2:["Pasivo","C"],3:["Patrimonio","C"],4:["Ingresos","C"],5:["Gastos","D"],6:["Costos de ventas","D"],7:["Costos de producción","D"]};
SIMS.partida=function(){
  $("sim").innerHTML=`<p class="hint">Cada línea es un asiento simple: descripción; código PUC débito; código PUC crédito; valor. Para asientos con varias cuentas, escribe varias líneas con la misma descripción. Catálogo disponible: ${Object.entries(PUC).map(([k,v])=>`${k} ${v}`).join(" · ")}.</p><div class="calcf">${tarea("pd-d","Asientos del periodo","Aporte de los socios; 1110; 3105; 50000000\nCompra de mercancía a crédito; 1435; 2205; 30000000\nCompra de computador de contado; 1528; 1110; 6000000\nVenta de contado; 1105; 4135; 25000000\nCosto de la mercancía vendida; 6135; 1435; 15000000\nVenta a crédito; 1305; 4135; 12000000\nCosto de la mercancía vendida; 6135; 1435; 7000000\nPago de arriendo; 5120; 1110; 2500000\nCausación de la nómina; 5105; 2505; 4000000\nPréstamo bancario; 1110; 2105; 10000000\nIntereses pagados; 5305; 1110; 300000\nDepreciación del computador; 5160; 1592; 500000\nAbono a proveedores; 2205; 1110; 12000000",12)}</div><div class="res" id="pd-res"></div><div id="pd-o"></div>`;
  const nom=c=>PUC[c]||`Cuenta ${c}`,cl=c=>+String(c)[0];
  const run=()=>{const A=lines($("pd-d").value).map(p=>({d:p[0],db:(p[1]||"").replace(/\D/g,""),cr:(p[2]||"").replace(/\D/g,""),v:num(p[3])})).filter(a=>a.db&&a.cr&&isFinite(a.v));
    const bad=A.filter(a=>!CLASE[cl(a.db)]||!CLASE[cl(a.cr)]);if(!A.length||bad.length){$("pd-res").innerHTML=err(bad.length?`la cuenta ${bad[0].db} o ${bad[0].cr} no empieza por una clase válida (1 a 7).`:"escribe al menos un asiento.");$("pd-o").innerHTML="";return}
    const M={};A.forEach(a=>{(M[a.db]=M[a.db]||{d:0,c:0}).d+=a.v;(M[a.cr]=M[a.cr]||{d:0,c:0}).c+=a.v});const cods=Object.keys(M).sort();
    const sal=c=>{const n=CLASE[cl(c)][1];return n==="D"?M[c].d-M[c].c:M[c].c-M[c].d};const tot=k=>cods.filter(c=>cl(c)===k).reduce((s,c)=>s+sal(c),0);
    const Ac=tot(1),Pa=tot(2),Pt=tot(3),I=tot(4),G=tot(5),Cv=tot(6)+tot(7),U=I-G-Cv,TD=cods.reduce((s,c)=>s+M[c].d,0),TC=cods.reduce((s,c)=>s+M[c].c,0);
    $("pd-res").innerHTML=tl([["Total débitos",m0(TD)],["Total créditos",m0(TC),Math.abs(TD-TC)<1?"okt":"badt"],["Activo",m0(Ac)],["Pasivo + patrimonio + utilidad",m0(Pa+Pt+U),Math.abs(Ac-Pa-Pt-U)<1?"okt":"badt"],["Utilidad del periodo",m0(U)]]);
    $("pd-o").innerHTML=stp(1,"Libro diario",`<div class="tbl"><table><tr><th>#</th><th>Descripción</th><th>Cuenta</th><th>Débito</th><th>Crédito</th></tr>${A.map((a,i)=>`<tr><td rowspan="2">${i+1}</td><td rowspan="2">${esc(a.d)}</td><td>${a.db} ${esc(nom(a.db))}</td><td>${m0(a.v)}</td><td></td></tr><tr><td style="padding-left:24px">${a.cr} ${esc(nom(a.cr))}</td><td></td><td>${m0(a.v)}</td></tr>`).join("")}</table></div>`)
      +stp(2,"Libro mayor y balance de prueba",`<div class="tbl"><table><tr><th>Cuenta</th><th>Clase</th><th>Débitos</th><th>Créditos</th><th>Saldo débito</th><th>Saldo crédito</th></tr>${cods.map(c=>{const s=M[c].d-M[c].c;return`<tr><td>${c} ${esc(nom(c))}</td><td>${CLASE[cl(c)][0]}</td><td>${m0(M[c].d)}</td><td>${m0(M[c].c)}</td><td>${s>0?m0(s):""}</td><td>${s<0?m0(-s):""}</td></tr>`}).join("")}<tr><td><b>Sumas</b></td><td></td><td><b>${m0(TD)}</b></td><td><b>${m0(TC)}</b></td><td><b>${m0(cods.reduce((s,c)=>s+Math.max(0,M[c].d-M[c].c),0))}</b></td><td><b>${m0(cods.reduce((s,c)=>s+Math.max(0,M[c].c-M[c].d),0))}</b></td></tr></table></div><p class="hint">La depreciación acumulada (1592) es una cuenta de activo con saldo crédito: resta del activo.</p>`)
      +stp(3,"Estados resumidos",`<div class="grid2"><div class="tbl"><table><tr><th colspan="2">Estado de resultados</th></tr><tr><td>Ingresos</td><td>${m0(I)}</td></tr><tr><td>− Costo de ventas</td><td>${m0(Cv)}</td></tr><tr><td>= Utilidad bruta</td><td>${m0(I-Cv)}</td></tr><tr><td>− Gastos</td><td>${m0(G)}</td></tr><tr><td><b>= Utilidad</b></td><td><b>${m0(U)}</b></td></tr></table></div><div class="tbl"><table><tr><th colspan="2">Situación financiera</th></tr><tr><td>Activo</td><td>${m0(Ac)}</td></tr><tr><td>Pasivo</td><td>${m0(Pa)}</td></tr><tr><td>Patrimonio (aportes)</td><td>${m0(Pt)}</td></tr><tr><td>Utilidad del ejercicio</td><td>${m0(U)}</td></tr><tr><td><b>Pasivo + patrimonio</b></td><td><b>${m0(Pa+Pt+U)}</b></td></tr></table></div></div><div class="eq al">A = P + Pt + (I − G − C): ${m0(Ac)} = ${m0(Pa)} + ${m0(Pt)} + ${m0(U)}</div>`)};
  onIn(["pd-d"],run);run()};

// ---------- Depreciación
SIMS.depre=function(){
  $("sim").innerHTML=`<div class="calcf">${nin("dp-c","Costo del activo",50000000,"100000")}${nin("dp-r","Valor residual",5000000,"100000")}${nin("dp-n","Vida útil (años)",5)}${tarea("dp-u","Unidades producidas por año (para el método de unidades)","12000 10000 9000 8000 6000",1)}</div><div id="dp-o"></div>`;
  const run=()=>{const C=N("dp-c"),R=N("dp-r"),n=Math.round(N("dp-n")),U=String($("dp-u").value).split(/[\s,;]+/).map(Number).filter(x=>x>0);if(!(C>R)||!(n>=1&&n<=40)){$("dp-o").innerHTML=err("el costo debe superar el valor residual y la vida útil estar entre 1 y 40.");return}
    const B=C-R,SD=n*(n+1)/2,tasa=R>0?1-Math.pow(R/C,1/n):NaN,UT=U.slice(0,n).reduce((a,b)=>a+b,0);
    const M={lr:t=>B/n,sd:t=>B*(n-t+1)/SD,rs:(t,vl)=>isFinite(tasa)?vl*tasa:NaN,up:t=>U.length>=n?B*U[t-1]/UT:NaN},nm={lr:"Línea recta",sd:"Suma de dígitos",rs:"Reducción de saldos",up:"Unidades de producción"};
    const tab={};Object.keys(M).forEach(k=>{let vl=C;tab[k]=[...Array(n)].map((_,i)=>{const d=M[k](i+1,vl);vl-=d;return{d,vl}})});
    const cols=["--line","--exam","--good","--ink"];
    $("dp-o").innerHTML=stp(1,"Depreciación anual",`<div class="tbl"><table><tr><th>Año</th>${Object.keys(M).map(k=>`<th>${nm[k]}</th>`).join("")}</tr>${[...Array(n)].map((_,i)=>`<tr><td>${i+1}</td>${Object.keys(M).map(k=>`<td>${m0(tab[k][i].d)}</td>`).join("")}</tr>`).join("")}<tr><td><b>Valor en libros final</b></td>${Object.keys(M).map(k=>`<td><b>${m0(tab[k][n-1].vl)}</b></td>`).join("")}</tr></table></div>`)
      +plotXY({xr:[0,n],yr:[0,C*1.05],series:Object.keys(M).map((k,j)=>({pts:[[0,C],...tab[k].map((r,i)=>[i+1,r.vl])],col:cols[j]})),hlines:[{y:R,col:"--muted"}],xl:"Año",yl:"Valor en libros",label:"Valor en libros"})+legend(Object.keys(M).map((k,j)=>[cols[j],nm[k]]))
      +stp(2,"Fórmulas",`<div class="eq al">Línea recta: (${m0(C)} − ${m0(R)})/${n} = ${m0(B/n)} por año · Excel ${xl("=SLN(costo; residual; vida)")}<br>Suma de dígitos: año 1 = ${n}/${SD} × ${m0(B)} = ${m0(B*n/SD)} · Excel ${xl("=SYD(costo; residual; vida; año)")}<br>Reducción de saldos: tasa = 1 − (${m0(R)}/${m0(C)})^(1/${n}) = ${pc(tasa)} · Excel ${xl("=DB(costo; residual; vida; año)")}<br>Unidades: ${m0(B)}/${m0(UT)} = ${d2(B/UT)} por unidad</div><p class="hint">Los métodos acelerados cargan más gasto al principio: reducen la utilidad de los primeros años, pero el total depreciado es el mismo. ${U.length<n?"Para el método de unidades escribe una cifra por cada año de vida útil.":""}</p>`)};
  onIn(["dp-c","dp-r","dp-n","dp-u"],run);run()};

// ---------- Kárdex
SIMS.kardex=function(){
  $("sim").innerHTML=`<div class="calcf">${nin("kx-q","Inventario inicial (unidades)",100)}${nin("kx-c","Costo unitario inicial",10000,"100")}${tarea("kx-d","Movimientos: fecha; E (entrada) o S (salida); cantidad; costo unitario (solo entradas)","05-mar; E; 200; 11000\n10-mar; S; 150\n18-mar; E; 100; 12500\n22-mar; S; 180\n29-mar; E; 80; 13000\n30-mar; S; 60",6)}${nin("kx-p","Precio de venta unitario",18000,"100")}</div><div class="res" id="kx-res"></div><div id="kx-o"></div>`;
  const run=()=>{const q0=N("kx-q"),c0=N("kx-c"),pv=N("kx-p"),D=lines($("kx-d").value).map(p=>({f:p[0],t:(p[1]||"").toUpperCase()[0],q:num(p[2]),c:num(p[3])})).filter(m=>(m.t==="E"&&m.q>0&&m.c>=0)||(m.t==="S"&&m.q>0));
    let P={q:q0,v:q0*c0},cvP=0,lotes=q0>0?[{q:q0,c:c0}]:[],cvF=0,rowsP=[],rowsF=[],falta=null;
    for(const m of D){if(m.t==="E"){P.q+=m.q;P.v+=m.q*m.c;lotes.push({q:m.q,c:m.c});rowsP.push([m.f,"Entrada",m.q,m.c,m.q*m.c,"","",P.q,P.v/P.q,P.v]);rowsF.push([m.f,"Entrada",`${m.q} × ${m0(m.c)}`,"",lotes.map(l=>`${l.q}×${m0(l.c)}`).join(" + ")])}
      else{if(m.q>P.q+1e-9){falta=m;break}const cu=P.v/P.q,co=m.q*cu;P.q-=m.q;P.v-=co;cvP+=co;rowsP.push([m.f,"Salida","","","",m.q,co,P.q,P.q?P.v/P.q:0,P.v]);
        let r=m.q,co2=0,det=[];while(r>1e-9){const l=lotes[0],t=Math.min(r,l.q);co2+=t*l.c;det.push(`${t}×${m0(l.c)}`);l.q-=t;r-=t;if(l.q<1e-9)lotes.shift()}cvF+=co2;rowsF.push([m.f,"Salida",det.join(" + "),m0(co2),lotes.map(l=>`${l.q}×${m0(l.c)}`).join(" + ")||"—"])}}
    if(falta){$("kx-res").innerHTML=err(`la salida del ${falta.f} supera las existencias.`);$("kx-o").innerHTML="";return}
    const qs=D.filter(m=>m.t==="S").reduce((s,m)=>s+m.q,0),ing=qs*pv,invF=lotes.reduce((s,l)=>s+l.q*l.c,0);
    $("kx-res").innerHTML=tl([["Unidades vendidas",m0(qs)],["Costo de ventas: promedio",m0(cvP)],["Costo de ventas: PEPS",m0(cvF)],["Inventario final: promedio",m0(P.v)],["Inventario final: PEPS",m0(invF)],["Utilidad bruta: promedio / PEPS",`${m0(ing-cvP)} / ${m0(ing-cvF)}`,"okt"]]);
    $("kx-o").innerHTML=stp(1,"Kárdex por promedio ponderado",`<div class="tbl"><table><tr><th>Fecha</th><th>Detalle</th><th>Entra</th><th>Costo u.</th><th>Valor</th><th>Sale</th><th>Valor</th><th>Saldo</th><th>Costo promedio</th><th>Valor saldo</th></tr><tr><td>Inicial</td><td></td><td></td><td></td><td></td><td></td><td></td><td>${m0(q0)}</td><td>${m0(c0)}</td><td>${m0(q0*c0)}</td></tr>${rowsP.map(r=>`<tr>${r.map((x,i)=>`<td>${typeof x==="number"?(i===2||i===5||i===7?m0(x):m0(x)):esc(x)}</td>`).join("")}</tr>`).join("")}</table></div>`)
      +stp(2,"Kárdex por PEPS",`<div class="tbl"><table><tr><th>Fecha</th><th>Detalle</th><th>Lotes que entran o salen</th><th>Costo de la salida</th><th>Lotes en existencia</th></tr>${rowsF.map(r=>`<tr>${r.map(x=>`<td>${esc(String(x))}</td>`).join("")}</tr>`).join("")}</table></div><p>${cvF<cvP-1?"Con costos crecientes, PEPS asigna a las ventas los lotes más baratos: menor costo de ventas, mayor utilidad y un inventario final a costos más recientes.":cvF>cvP+1?"Con costos decrecientes, PEPS da mayor costo de ventas que el promedio.":"Ambos métodos dan casi lo mismo con estos datos."} Comprobación: inventario inicial + compras = costo de ventas + inventario final.</p>`)};
  onIn(["kx-q","kx-c","kx-d","kx-p"],run);run()};

// ---------- Estado de resultados
SIMS.resultados=function(){
  const F=[["er-v","Ventas brutas",1200],["er-dv","Devoluciones y descuentos",40],["er-c","Costo de ventas",690],["er-ga","Gastos de administración (sin depreciación)",150],["er-gv","Gastos de ventas",110],["er-dp","Depreciaciones y amortizaciones",45],["er-oi","Otros ingresos",12],["er-gf","Gastos financieros",38],["er-t","Tarifa de impuesto de renta (%)",35]];
  $("sim").innerHTML=`<p class="hint">Cifras en millones de pesos.</p><div class="calcf">${F.map(f=>nin(f[0],f[1],f[2])).join("")}</div><div class="res" id="er-res"></div><div id="er-o"></div>`;
  const run=()=>{const[v,dv,c,ga,gv,dp,oi,gf,t0]=F.map(f=>N(f[0])),t=t0/100,vn=v-dv,ub=vn-c,uo=ub-ga-gv-dp,uai=uo+oi-gf,imp=Math.max(0,uai*t),un=uai-imp,eb=uo+dp;
    $("er-res").innerHTML=tl([["Utilidad bruta",d2(ub)+" ("+pc(ub/vn)+")"],["Utilidad operacional",d2(uo)+" ("+pc(uo/vn)+")"],["EBITDA",d2(eb)+" ("+pc(eb/vn)+")","okt"],["Utilidad neta",d2(un)+" ("+pc(un/vn)+")",un>0?"okt":"badt"],["Cobertura de intereses (EBITDA)",d2(eb/gf)+" veces"]]);
    const r=(l,x,b)=>`<tr><td>${b?"<b>"+l+"</b>":l}</td><td>${b?"<b>":""}${d2(x)}${b?"</b>":""}</td><td>${pc(x/vn)}</td></tr>`;
    $("er-o").innerHTML=stp(1,"Estado de resultados",`<div class="tbl"><table><tr><th>Partida</th><th>Valor</th><th>% de ventas netas</th></tr>${r("Ventas brutas",v)}${r("− Devoluciones y descuentos",-dv)}${r("= Ventas netas",vn,1)}${r("− Costo de ventas",-c)}${r("= Utilidad bruta",ub,1)}${r("− Gastos de administración",-ga)}${r("− Gastos de ventas",-gv)}${r("− Depreciaciones y amortizaciones",-dp)}${r("= Utilidad operacional (UAII)",uo,1)}${r("+ Otros ingresos",oi)}${r("− Gastos financieros",-gf)}${r("= Utilidad antes de impuestos",uai,1)}${r("− Impuesto de renta",-imp)}${r("= Utilidad neta",un,1)}</table></div><p class="hint">EBITDA = UAII + depreciaciones = ${d2(uo)} + ${d2(dp)} = ${d2(eb)}. El impuesto se calcula aquí sobre la utilidad contable; en la práctica la base fiscal puede ser distinta.</p>`)};
  onIn(F.map(f=>f[0]),run);run()};

// ---------- Flujo de efectivo indirecto
SIMS.efectivo=function(){
  const F=[["fe-un","Utilidad neta",120],["fe-dp","Depreciaciones y amortizaciones",45],["fe-cc","Aumento de cuentas por cobrar",60],["fe-in","Aumento de inventarios",35],["fe-pr","Aumento de proveedores",25],["fe-op","Aumento de otras cuentas por pagar",8],["fe-ca","Compra de propiedad, planta y equipo",150],["fe-va","Venta de activos",10],["fe-np","Nuevos préstamos",80],["fe-pp","Pago de préstamos",30],["fe-ap","Aportes de capital",0],["fe-dv","Dividendos pagados",40],["fe-e0","Efectivo al inicio",70],["fe-e1","Efectivo al final según el balance",43]];
  $("sim").innerHTML=`<p class="hint">Cifras en millones. Escribe los aumentos como positivos y las disminuciones como negativos.</p><div class="calcf">${F.map(f=>nin(f[0],f[1],f[2])).join("")}</div><div class="res" id="fe-res"></div><div id="fe-o"></div>`;
  const run=()=>{const[un,dp,cc,inv,pr,op,ca,va,np,pp,ap,dv,e0,e1]=F.map(f=>N(f[0])),fo=un+dp-cc-inv+pr+op,fi=va-ca,ff=np-pp+ap-dv,de=fo+fi+ff,ok=Math.abs(e0+de-e1)<0.5;
    $("fe-res").innerHTML=tl([["Flujo de operación",d2(fo),fo>0?"okt":"badt"],["Flujo de inversión",d2(fi)],["Flujo de financiación",d2(ff)],["Cambio del efectivo",d2(de)],["Comprobación con el balance",ok?"cuadra":`no cuadra por ${d2(e0+de-e1)}`,ok?"okt":"badt"]]);
    $("fe-o").innerHTML=stp(1,"Método indirecto",`<div class="tbl"><table><tr><td>Utilidad neta</td><td>${d2(un)}</td></tr><tr><td>+ Depreciaciones y amortizaciones</td><td>${d2(dp)}</td></tr><tr><td>− Aumento de cuentas por cobrar</td><td>${d2(-cc)}</td></tr><tr><td>− Aumento de inventarios</td><td>${d2(-inv)}</td></tr><tr><td>+ Aumento de proveedores</td><td>${d2(pr)}</td></tr><tr><td>+ Aumento de otras cuentas por pagar</td><td>${d2(op)}</td></tr><tr><td><b>= Flujo de operación</b></td><td><b>${d2(fo)}</b></td></tr><tr><td>− Compra de activos + venta de activos</td><td>${d2(fi)}</td></tr><tr><td><b>= Flujo de inversión</b></td><td><b>${d2(fi)}</b></td></tr><tr><td>+ Préstamos − pagos + aportes − dividendos</td><td>${d2(ff)}</td></tr><tr><td><b>= Flujo de financiación</b></td><td><b>${d2(ff)}</b></td></tr><tr><td>Efectivo inicial + cambio</td><td>${d2(e0)} + ${d2(de)} = <b>${d2(e0+de)}</b></td></tr></table></div><p>${fo<un?`La operación generó ${d2(fo)}, menos que la utilidad (${d2(un)}): el crecimiento de la cartera y los inventarios absorbió caja.`:`La operación generó más caja (${d2(fo)}) que la utilidad.`} ${fo+fi<0?"La operación no alcanzó para pagar las inversiones: la diferencia se financió con deuda o aportes, o se tomó del efectivo.":""}</p>`)};
  onIn(F.map(f=>f[0]),run);run()};

// ---------- Vertical y horizontal
SIMS.vh=function(){
  $("sim").innerHTML=`<p class="hint">Partida; año 1; año 2. Marca con * la partida que sirve de base del análisis vertical (activo total o ventas). Cifras en millones.</p><div class="calcf">${tarea("vh-b","Estado de situación financiera","Efectivo; 70; 43\nCuentas por cobrar; 180; 240\nInventarios; 210; 245\nActivo corriente; 460; 528\nPropiedad, planta y equipo neta; 540; 645\n*Activo total; 1000; 1173\nProveedores; 150; 175\nObligaciones financieras de corto plazo; 90; 110\nPasivo corriente; 240; 285\nObligaciones de largo plazo; 260; 290\nPasivo total; 500; 575\nPatrimonio; 500; 598",12)}${tarea("vh-r","Estado de resultados","*Ventas netas; 1050; 1160\nCosto de ventas; 620; 690\nUtilidad bruta; 430; 470\nGastos operacionales; 280; 305\nUtilidad operacional; 150; 165\nGastos financieros; 32; 38\nUtilidad neta; 77; 82",7)}</div><div id="vh-o"></div>`;
  const tab=(txt,tit)=>{const L=lines(txt).map(p=>({n:p[0].replace(/^\*/,""),base:p[0].startsWith("*"),a:num(p[1]),b:num(p[2])})).filter(x=>isFinite(x.a)&&isFinite(x.b));const B=L.find(x=>x.base)||L[0];if(!B)return"";
    return stp(tit[0],tit[1],`<div class="tbl"><table><tr><th>Partida</th><th>Año 1</th><th>Vertical</th><th>Año 2</th><th>Vertical</th><th>Variación</th><th>Variación %</th></tr>${L.map(x=>{const v=x.b-x.a,vp=x.a?v/Math.abs(x.a):NaN;return`<tr${x.base?' style="font-weight:700"':""}><td>${esc(x.n)}</td><td>${d2(x.a)}</td><td>${pc(x.a/B.a)}</td><td>${d2(x.b)}</td><td>${pc(x.b/B.b)}</td><td>${d2(v)}</td><td${Math.abs(vp-(B.b-B.a)/B.a)>0.1?' style="color:var(--exam);font-weight:600"':""}>${pc(vp)}</td></tr>`}).join("")}</table></div><p class="hint">Base: ${esc(B.n)}, que crece ${pc((B.b-B.a)/B.a)}. Las variaciones resaltadas se alejan más de 10 puntos de ese crecimiento: allí hay una historia que contar.</p>`)};
  const run=()=>{$("vh-o").innerHTML=tab($("vh-b").value,[1,"Balance: vertical y horizontal"])+tab($("vh-r").value,[2,"Resultados: vertical y horizontal"])};
  onIn(["vh-b","vh-r"],run);run()};

// ---------- Indicadores
SIMS.razones=function(){
  const F=[["rz-ac","Activo corriente",528],["rz-ef","Efectivo",43],["rz-cx","Cuentas por cobrar",240],["rz-iv","Inventarios",245],["rz-at","Activo total",1173],["rz-pc","Pasivo corriente",285],["rz-pr","Proveedores",175],["rz-pt","Pasivo total",575],["rz-pa","Patrimonio",598],["rz-v","Ventas netas (a crédito)",1160],["rz-c","Costo de ventas",690],["rz-cm","Compras",725],["rz-uo","Utilidad operacional",165],["rz-dp","Depreciaciones",45],["rz-gf","Gastos financieros",38],["rz-un","Utilidad neta",82]];
  $("sim").innerHTML=`<p class="hint">Cifras de un año (en millones). Para las rotaciones se usan los saldos finales; con dos años conviene usar promedios.</p><div class="calcf">${F.map(f=>nin(f[0],f[1],f[2])).join("")}</div><div class="res" id="rz-res"></div><div id="rz-o"></div>`;
  const run=()=>{const[ac,ef,cx,iv,at,pc_,pr,pt,pa,v,c,cm,uo,dp,gf,un]=F.map(f=>N(f[0])),rc=ac/pc_,pa_=(ac-iv)/pc_,kt=ac-pc_,dc=360*cx/v,di=360*iv/c,dpv=360*pr/cm,ce=dc+di-dpv,en=pt/at,ap=pt/pa,cob=uo/gf,mb=(v-c)/v,mo=uo/v,mn=un/v,ra=v/at,mul=at/pa,roa=uo/at,roe=un/pa,ktno=cx+iv-pr,eb=uo+dp;
    $("rz-res").innerHTML=tl([["Razón corriente",d2(rc),rc>=1?"okt":"badt"],["Prueba ácida",d2(pa_)],["Ciclo de efectivo",d2(ce)+" días"],["Endeudamiento",pc(en)],["Cobertura de intereses",d2(cob)+" veces",cob>=2?"okt":"badt"],["ROA operativo",pc(roa)],["ROE",pc(roe),"okt"],["KTNO / ventas (PKT)",pc(ktno/v)]]);
    const t=(rows)=>`<div class="tbl"><table><tr><th>Indicador</th><th>Cálculo</th><th>Resultado</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td><b>${r[2]}</b></td></tr>`).join("")}</table></div>`;
    $("rz-o").innerHTML=stp(1,"Liquidez",t([["Razón corriente",`${d2(ac)}/${d2(pc_)}`,d2(rc)],["Prueba ácida",`(${d2(ac)} − ${d2(iv)})/${d2(pc_)}`,d2(pa_)],["Capital de trabajo neto",`${d2(ac)} − ${d2(pc_)}`,d2(kt)]]))
      +stp(2,"Actividad",t([["Días de cartera",`360·${d2(cx)}/${d2(v)}`,d2(dc)],["Días de inventario",`360·${d2(iv)}/${d2(c)}`,d2(di)],["Días de proveedores",`360·${d2(pr)}/${d2(cm)}`,d2(dpv)],["Ciclo de efectivo",`${d2(dc)} + ${d2(di)} − ${d2(dpv)}`,d2(ce)],["Rotación del activo",`${d2(v)}/${d2(at)}`,d2(ra)]]))
      +stp(3,"Endeudamiento",t([["Nivel de endeudamiento",`${d2(pt)}/${d2(at)}`,pc(en)],["Apalancamiento",`${d2(pt)}/${d2(pa)}`,d2(ap)],["Cobertura (UAII)",`${d2(uo)}/${d2(gf)}`,d2(cob)],["Cobertura (EBITDA)",`${d2(eb)}/${d2(gf)}`,d2(eb/gf)]]))
      +stp(4,"Rentabilidad y Du Pont",t([["Margen bruto",`(${d2(v)} − ${d2(c)})/${d2(v)}`,pc(mb)],["Margen operacional",`${d2(uo)}/${d2(v)}`,pc(mo)],["Margen neto",`${d2(un)}/${d2(v)}`,pc(mn)],["ROA operativo",`${d2(uo)}/${d2(at)}`,pc(roa)],["ROE",`${d2(un)}/${d2(pa)}`,pc(roe)]])+`<div class="eq al">Du Pont: ROE = margen neto × rotación del activo × multiplicador = ${pc(mn)} × ${d2(ra)} × ${d2(mul)} = <b>${pc(mn*ra*mul)}</b></div>`)
      +stp(5,"Diagnóstico automático (borrador del informe gerencial)",`<ul><li>${rc>=1.5?"La liquidez es holgada":rc>=1?"La liquidez es ajustada pero positiva":"La empresa no cubre sus pasivos corrientes con sus activos corrientes"} (razón corriente ${d2(rc)}; sin inventarios, ${d2(pa_)}).</li><li>El ciclo de efectivo es de ${d2(ce)} días: la empresa financia ${m0(ce)} días de operación con recursos propios o deuda. Cada peso de ventas requiere ${pc(ktno/v)} de KTNO.</li><li>El endeudamiento es ${pc(en)} y la utilidad operacional cubre ${d2(cob)} veces los intereses${cob<2?", un nivel bajo que limita nuevo endeudamiento":""}.</li><li>El ROE de ${pc(roe)} se explica por un margen neto de ${pc(mn)}, una rotación de ${d2(ra)} y un multiplicador de ${d2(mul)}. ${roa>gf/pt?"La rentabilidad operativa del activo supera el costo de la deuda: el apalancamiento favorece al dueño.":"El costo de la deuda supera la rentabilidad operativa: el endeudamiento destruye valor para el dueño."}</li></ul><p class="hint">Costo promedio de la deuda aproximado: gastos financieros/pasivo total = ${pc(gf/pt)}. Completa el informe comparando con el año anterior y con el sector.</p>`)};
  onIn(F.map(f=>f[0]),run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Ecuación","Contable","Activo = Pasivo + Patrimonio; durante el periodo A = P + Pt + I − G"],["Depreciación","Línea recta","(C − VR)/n; Excel: =SLN()"],["Depreciación","Suma de dígitos","(C − VR)·(n − t + 1)/[n(n + 1)/2]; Excel: =SYD()"],["Depreciación","Reducción de saldos","tasa = 1 − (VR/C)^(1/n); Excel: =DB()"],["Inventarios","Costo de ventas","Inventario inicial + compras − inventario final"],["Resultados","EBITDA","UAII + depreciaciones y amortizaciones"],["Flujo de efectivo","Operación (indirecto)","Utilidad + depreciación − ΔCxC − Δinventarios + Δproveedores"],["Flujo de efectivo","Comprobación","Efectivo inicial + operación + inversión + financiación = efectivo final"],
    ["Liquidez","Razón corriente","AC/PC"],["Liquidez","Prueba ácida","(AC − inventarios)/PC"],["Actividad","Días de cartera","360·CxC/ventas a crédito"],["Actividad","Días de inventario","360·inventario/costo de ventas"],["Actividad","Días de proveedores","360·proveedores/compras"],["Actividad","Ciclo de efectivo","Días cartera + días inventario − días proveedores"],["Endeudamiento","Nivel","Pasivo total/activo total"],["Endeudamiento","Cobertura","UAII/gastos financieros"],["Rentabilidad","ROA","UAII/activo total"],["Rentabilidad","ROE","Utilidad neta/patrimonio"],["Rentabilidad","Du Pont","Margen neto × rotación del activo × activo/patrimonio"],["Capital de trabajo","KTNO","Cartera + inventarios − proveedores; PKT = KTNO/ventas"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: prueba ácida"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
