// Economía Ambiental · laboratorios interactivos
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


// ===================== LABORATORIOS DE ECONOMÍA AMBIENTAL =====================
const d2=v=>isFinite(v)?fmt(Math.abs(v)<5e-4?0:v,2).replace(/^-/,"−"):"—",d4=v=>isFinite(v)?fmt(Math.abs(v)<5e-6?0:v,4).replace(/^-/,"−"):"—",pc=v=>isFinite(v)?d2(v*100)+" %":"—",m0=v=>isFinite(v)?fmt(Math.round(v),0).replace(/^-/,"−"):"—";
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const tarea=(id,l,v,rows=3)=>`<label for="${id}">${l}<textarea id="${id}" rows="${rows}" spellcheck="false" style="width:100%;font-family:var(--f-mono)">${v}</textarea></label>`;
const lines=s=>String(s).split("\n").map(l=>l.split(/;|\t/).map(x=>x.trim())).filter(p=>p.length&&p[0]!=="");
const num=x=>{const v=+String(x??"").replace(/\s/g,"").replace(/,/g,".");return isFinite(v)?v:NaN};
const bis=(f,lo,hi,it=90)=>{let flo=f(lo);for(let i=0;i<it;i++){const m=(lo+hi)/2,fm_=f(m);if(flo*fm_<=0)hi=m;else{lo=m;flo=fm_}}return(lo+hi)/2};

// ---------- Análisis costo-beneficio de largo plazo
SIMS.acb=function(){
  $("sim").innerHTML=`<p class="hint">Política climática: cuesta C por año durante los primeros años y evita daños B por año a partir de un año futuro, hasta el año 100.</p>${ctl("cb-c","Costo anual de la política",1,50,1,10)}${ctl("cb-n","Años en que se paga",1,40,1,20)}${ctl("cb-b","Daño evitado por año",1,100,1,20)}${ctl("cb-s","Año en que empiezan los beneficios",1,80,1,30)}${ctl("cb-r","Tasa de descuento (%)",0.5,8,0.1,3)}<div class="res" id="cb-res"></div><div id="cb-gr"></div><div id="cb-o"></div>`;
  const vpn=(r,C,n,B,s)=>{let v=0;for(let t=1;t<=100;t++){v+=((t<=n?-C:0)+(t>=s?B:0))/Math.pow(1+r,t)}return v};
  const run=()=>{const C=V("cb-c"),n=V("cb-n"),B=V("cb-b"),s=V("cb-s"),r=V("cb-r")/100,v=vpn(r,C,n,B,s),rs=[...Array(80)].map((_,i)=>0.001+i*0.001),cr=rs.find((x,i)=>i>0&&vpn(rs[i-1],C,n,B,s)*vpn(x,C,n,B,s)<=0);
    $("cb-res").innerHTML=tl([["VPN de la política",d2(v),v>0?"okt":"badt"],["Tasa a la que el VPN es cero",cr?pc(cr):"fuera del rango 0,1 %–8 %"],["Valor hoy de 1 000 de daño en el año 100",d2(1000/Math.pow(1+r,100))]]);
    $("cb-gr").innerHTML=plotXY({xr:[0.1,8],yr:(()=>{const vs=rs.map(x=>vpn(x,C,n,B,s));return[Math.min(0,...vs)*1.1,Math.max(0,...vs)*1.1]})(),series:[{pts:rs.map(x=>[x*100,vpn(x,C,n,B,s)]),col:"--line"}],hlines:[{y:0,col:"--muted"}],vlines:[{x:r*100,col:"--exam"}],xl:"Tasa de descuento (%)",yl:"VPN",label:"Sensibilidad a la tasa de descuento"});
    $("cb-o").innerHTML=stp(1,"Lectura",`<p>Con ${pc(r)} el VPN es ${d2(v)}: la política ${v>0?"pasa":"no pasa"} el análisis costo-beneficio. ${cr?`Con tasas por encima de ${pc(cr)} el resultado se invierte.`:""} Como los costos llegan pronto y los beneficios tarde, la decisión depende casi por completo de la tasa: es el núcleo del debate entre Stern (tasas bajas, acción inmediata) y Nordhaus (tasas de mercado, acción gradual).</p><p class="hint">Regla de Ramsey: r = ρ + ηg. Con ρ = 0,1 %, η = 1 y g = 1,3 %, r = 1,4 % (cercana a la de Stern).</p>`)};
  bindCtl(["cb-c","cb-n","cb-b","cb-s","cb-r"],run);run()};

// ---------- Hotelling
SIMS.hotelling=function(){
  $("sim").innerHTML=`<p class="hint">Demanda inversa P = a − b·q en cada periodo, costo marginal de extracción c constante, reserva total S. Se compara competencia y monopolio.</p>${ctl("ht-a","a (precio máximo, techo de la tecnología sustituta)",20,200,5,100)}${ctl("ht-b","b",0.5,5,0.1,1)}${ctl("ht-c","Costo marginal c",0,50,1,10)}${ctl("ht-r","Tasa de interés r (%)",1,20,0.5,5)}${ctl("ht-s","Reserva S",50,1500,10,500)}<div class="res" id="ht-res"></div><div id="ht-gr"></div><div id="ht-o"></div>`;
  const path=(a,b,c,r,S,mono)=>{const q=(l,t)=>Math.max(0,(a-c-l*Math.pow(1+r,t))/(mono?2*b:b));const tot=l=>{let s=0;for(let t=0;t<400;t++){const x=q(l,t);if(x<=0)break;s+=x}return s};const lam=bis(l=>tot(l)-S,1e-9,a-c);const Q=[];for(let t=0;t<400;t++){const x=q(lam,t);if(x<=1e-9)break;Q.push(x)}return{lam,Q,P:Q.map(x=>a-b*x)}};
  const run=()=>{const a=V("ht-a"),b=V("ht-b"),c=V("ht-c"),r=V("ht-r")/100,S=V("ht-s"),C=path(a,b,c,r,S,false),M=path(a,b,c,r,S,true),T=Math.max(C.Q.length,M.Q.length);
    $("ht-res").innerHTML=tl([["Renta de escasez inicial (competencia)",d2(C.lam),"okt"],["Precio inicial: competencia / monopolio",`${d2(C.P[0])} / ${d2(M.P[0])}`],["Duración de la reserva: competencia / monopolio",`${C.Q.length} / ${M.Q.length} periodos`,"okt"]]);
    $("ht-gr").innerHTML=`<div class="grid2">${plotXY({xr:[0,T],yr:[0,a*1.05],series:[{pts:C.P.map((p,t)=>[t,p]),col:"--line"},{pts:M.P.map((p,t)=>[t,p]),col:"--exam"}],hlines:[{y:a,col:"--muted"},{y:c,col:"--muted"}],xl:"Periodo",yl:"Precio",label:"Trayectoria del precio"})}${plotXY({xr:[0,T],yr:[0,Math.max(C.Q[0],M.Q[0])*1.1],series:[{pts:C.Q.map((q,t)=>[t,q]),col:"--line"},{pts:M.Q.map((q,t)=>[t,q]),col:"--exam"}],xl:"Periodo",yl:"Extracción",label:"Trayectoria de la extracción"})}</div>`+legend([["--line","Competencia"],["--exam","Monopolio"]]);
    $("ht-o").innerHTML=stp(1,"Regla de Hotelling",`<div class="eq al">P_t − c = λ(1 + r)^t, con λ elegido para que Σ q_t = S ⟹ λ = ${d4(C.lam)}<br>Periodo 0: P = ${d2(C.P[0])}, renta ${d2(C.P[0]-c)} · periodo 1: P = ${d2(C.P[1]??NaN)}, renta ${d2((C.P[1]??NaN)-c)} = ${d2(C.P[0]-c)}·(1 + ${pc(r)})</div><p>La extracción cae y el precio sube hasta el techo a = ${d2(a)}, donde la demanda se anula (o entra la tecnología sustituta) justo cuando se agota la reserva. El monopolista iguala el valor presente del <b>ingreso marginal</b> neto: cobra más al principio y extrae más despacio, así que la reserva le dura ${M.Q.length} periodos frente a ${C.Q.length}. Sube r: el recurso se extrae más rápido.</p>`)};
  bindCtl(["ht-a","ht-b","ht-c","ht-r","ht-s"],run);run()};

// ---------- Pesca
SIMS.pesca=function(){
  $("sim").innerHTML=`<p class="hint">Gordon-Schaefer: G(S) = g·S(1 − S/K), H = q·E·S, ingreso p·H, costo w·E.</p>${ctl("ps-g","Tasa intrínseca de crecimiento g",0.1,1.5,0.05,0.5)}${ctl("ps-k","Capacidad de carga K",100,2000,50,1000)}${ctl("ps-q","Capturabilidad q",0.001,0.02,0.001,0.01)}${ctl("ps-p","Precio p",1,50,1,10)}${ctl("ps-w","Costo por unidad de esfuerzo w",5,150,5,30)}<div class="res" id="ps-res"></div><div id="ps-gr"></div><div id="ps-o"></div>`;
  const run=()=>{const g=V("ps-g"),K=V("ps-k"),q=V("ps-q"),p=V("ps-p"),w=V("ps-w"),Hs=E=>q*E*K*Math.max(0,1-q*E/g),TR=E=>p*Hs(E),TC=E=>w*E,Emax=g/q,Emsy=g/(2*q),Eoa=Math.max(0,g/q*(1-w/(p*q*K))),Emey=Eoa/2,R=E=>TR(E)-TC(E);
    $("ps-res").innerHTML=tl([["Esfuerzo en RMS",d2(Emsy)],["Esfuerzo en REM",d2(Emey),"okt"],["Esfuerzo en libre acceso",d2(Eoa),"badt"],["Captura: RMS / REM / libre acceso",`${d2(Hs(Emsy))} / ${d2(Hs(Emey))} / ${d2(Hs(Eoa))}`],["Renta en el REM",d2(R(Emey)),"okt"],["Stock en libre acceso",d2(Eoa>0?K*(1-q*Eoa/g):K)]]);
    $("ps-gr").innerHTML=plotXY({xr:[0,Emax],yr:[0,Math.max(TR(Emsy),TC(Emax))*1.05],series:[{f:TR,col:"--line"},{f:TC,col:"--exam"}],vlines:[{x:Emey,col:"--good"},{x:Emsy,col:"--muted"},{x:Eoa,col:"--bad"}],xl:"Esfuerzo E",yl:"Pesos",label:"Ingreso y costo sostenibles"})+legend([["--line","Ingreso sostenible p·H(E)"],["--exam","Costo w·E"],["--good","REM"],["--muted","RMS"],["--bad","Libre acceso"]]);
    $("ps-o").innerHTML=stp(1,"Tres equilibrios",`<div class="eq al">Captura sostenible: H(E) = qEK(1 − qE/g)<br>RMS: E = g/(2q) = ${d2(Emsy)} · REM: máx p·H − wE ⟹ E = ${d2(Emey)} · libre acceso: p·H = wE ⟹ E = ${d2(Eoa)}</div><p>En libre acceso cada pescador entra mientras gane algo, y la renta del recurso se disipa por completo: el esfuerzo es el doble del REM. ${Eoa>Emsy?"Aquí el libre acceso incluso supera el RMS: hay sobrepesca biológica, con menos captura que la máxima sostenible.":""} ${Eoa===0?"Con este costo no es rentable pescar.":""} Si el precio sube mucho o el costo cae, el stock de libre acceso se acerca a cero: riesgo de colapso.</p>`)};
  bindCtl(["ps-g","ps-k","ps-q","ps-p","ps-w"],run);run()};

// ---------- Bosque
SIMS.bosque=function(){
  $("sim").innerHTML=`<p class="hint">Volumen de madera V(t) = Vmax·(1 − e^(−kt))³ (curva de Chapman-Richards). Precio neto p por m³ y costo de plantación c.</p>${ctl("bq-v","Volumen máximo Vmax (m³/ha)",100,800,10,400)}${ctl("bq-k","Velocidad de crecimiento k",0.02,0.15,0.005,0.05)}${ctl("bq-p","Precio neto p",10,100,1,40)}${ctl("bq-c","Costo de plantación c",0,5000,100,1000)}${ctl("bq-r","Tasa de interés r (%)",1,12,0.5,4)}${ctl("bq-a","Servicios ambientales por año en pie (Hartman)",0,200,10,0)}<div class="res" id="bq-res"></div><div id="bq-gr"></div><div id="bq-o"></div>`;
  const run=()=>{const Vm=V("bq-v"),k=V("bq-k"),p=V("bq-p"),c=V("bq-c"),r=V("bq-r")/100,A=V("bq-a"),Vt=t=>Vm*Math.pow(1-Math.exp(-k*t),3),ts=[...Array(1500)].map((_,i)=>1+i*0.1);
    const amenity=T=>A*(1-Math.exp(-r*T))/r,fau=T=>(p*Vt(T)*Math.exp(-r*T)-c+amenity(T))/(1-Math.exp(-r*T)),wic=T=>p*Vt(T)*Math.exp(-r*T)-c,msy=T=>Vt(T)/T;
    const arg=f=>ts.reduce((b,t)=>f(t)>f(b)?t:b,ts[0]),Tf=arg(fau),Tw=arg(wic),Tm=arg(msy);
    $("bq-res").innerHTML=tl([["Rotación de Faustmann",d2(Tf)+" años","okt"],["Una sola rotación (Wicksell)",d2(Tw)+" años"],["Máximo incremento medio anual",d2(Tm)+" años"],["Valor del suelo (Faustmann)",m0(fau(Tf))]]);
    $("bq-gr").innerHTML=plotXY({xr:[0,Math.max(Tm,Tw,Tf)*1.6],yr:[0,Vm*1.05],series:[{f:Vt,col:"--line"}],vlines:[{x:Tf,col:"--good"},{x:Tw,col:"--exam"},{x:Tm,col:"--muted"}],xl:"Edad del bosque (años)",yl:"Volumen (m³/ha)",label:"Crecimiento del bosque y rotaciones"})+legend([["--line","V(t)"],["--good","Faustmann"],["--exam","Wicksell"],["--muted","Máximo incremento medio"]]);
    $("bq-o").innerHTML=stp(1,"Comparación",`<p>Faustmann (${d2(Tf)} años) ${A>0?"incluye los servicios ambientales, que alargan la rotación (Hartman), y":""} cuenta que retrasar el corte también retrasa todas las rotaciones futuras, por lo que corta antes que la regla de una sola rotación (${d2(Tw)} años). Ambas cortan antes que el criterio forestal del máximo incremento medio anual (${d2(Tm)} años), porque descontar penaliza la espera. Sube r: las rotaciones se acortan. Con r cercano a cero, Faustmann se acerca al máximo incremento medio.</p>`)};
  bindCtl(["bq-v","bq-k","bq-p","bq-c","bq-r","bq-a"],run);run()};

// ---------- Contaminación óptima
SIMS.contam=function(){
  $("sim").innerHTML=`<p class="hint">Emisiones sin control E₀. Costo marginal de abatimiento CMgA = α·A (A: reducción); daño marginal DMg = δ·E, con E = E₀ − A.</p>${ctl("ct-e","Emisiones sin control E₀",50,500,10,200)}${ctl("ct-a","Pendiente del CMgA α",0.1,5,0.1,1)}${ctl("ct-d","Pendiente del daño marginal δ",0.1,5,0.1,1)}<div class="res" id="ct-res"></div><div id="ct-gr"></div><div id="ct-o"></div>`;
  const run=()=>{const E0=V("ct-e"),a=V("ct-a"),d=V("ct-d"),Es=a*E0/(a+d),As=E0-Es,t=d*Es,cost=a*As*As/2,dam=d*Es*Es/2,dam0=d*E0*E0/2;
    $("ct-res").innerHTML=tl([["Emisiones óptimas E*",d2(Es),"okt"],["Reducción óptima",d2(As)+" ("+pc(As/E0)+")"],["Impuesto pigouviano t*",d2(t),"okt"],["Costo de abatimiento",d2(cost)],["Daño restante",d2(dam)],["Ganancia frente a no regular",d2(dam0-dam-cost)]]);
    $("ct-gr").innerHTML=plotXY({xr:[0,E0],yr:[0,Math.max(a*E0,d*E0)*1.05],series:[{f:E=>a*(E0-E),col:"--line"},{f:E=>d*E,col:"--exam"}],points:[{x:Es,y:t,label:"óptimo"}],hlines:[{y:t,col:"--muted"}],xl:"Emisiones E",yl:"Pesos por unidad",label:"Nivel óptimo de contaminación"})+legend([["--line","CMgA (crece al reducir E)"],["--exam","Daño marginal"]]);
    $("ct-o").innerHTML=stp(1,"Óptimo",`<div class="eq al">α(E₀ − E) = δE ⟹ E* = αE₀/(α + δ) = ${d2(Es)} · t* = δE* = ${d2(t)}</div><p>Contaminar cero costaría ${d2(a*E0*E0/2)} en abatimiento para evitar ${d2(dam0)} de daño: más allá de E*, cada unidad reducida cuesta más que el daño que evita. Con un impuesto t* por unidad, la empresa reduce hasta que su CMgA iguala t*, y llega sola al óptimo.</p>`)};
  bindCtl(["ct-e","ct-a","ct-d"],run);run()};

// ---------- Instrumentos con dos empresas
SIMS.instr=function(){
  $("sim").innerHTML=`<p class="hint">Dos empresas emiten 100 unidades cada una. Costos marginales de abatimiento lineales: CMgA₁ = c₁·A₁ y CMgA₂ = c₂·A₂. Meta: reducir R unidades en total.</p>${ctl("in-1","c₁ (empresa 1, limpieza barata)",0.2,5,0.1,1)}${ctl("in-2","c₂ (empresa 2, limpieza cara)",0.2,5,0.1,3)}${ctl("in-r","Reducción total exigida R",10,190,5,100)}<div class="res" id="in-res"></div><div id="in-gr"></div><div id="in-o"></div>`;
  const run=()=>{const c1=V("in-1"),c2=V("in-2"),R=V("in-r");let A1=R*c2/(c1+c2),A2=R-A1;if(A1>100){A1=100;A2=R-100}if(A2>100){A2=100;A1=R-100}const t=c1*A1,costE=c1*A1*A1/2+c2*A2*A2/2,u=R/2,costU=(c1+c2)*u*u/2,perm1=100-A1,perm0=100-u,trade=perm0-perm1;
    $("in-res").innerHTML=tl([["Costo con estándar uniforme",d2(costU),"badt"],["Costo con impuesto o permisos",d2(costE),"okt"],["Ahorro",d2(costU-costE)+" ("+pc(1-costE/costU)+")"],["Impuesto o precio del permiso",d2(t)]]);
    $("in-gr").innerHTML=plotXY({xr:[0,R],yr:[0,Math.max(c1*R,c2*R)*1.05],series:[{f:A=>c1*A,col:"--line"},{f:A=>c2*(R-A),col:"--exam"}],points:[{x:A1,y:t,label:"costo mínimo"},{x:u,y:c1*u,label:"estándar 1",col:"--bad"},{x:u,y:c2*u,label:"estándar 2",col:"--bad"}],xl:"Reducción de la empresa 1 (la empresa 2 hace el resto)",yl:"CMgA",label:"Costo-efectividad"})+legend([["--line","CMgA empresa 1"],["--exam","CMgA empresa 2 (desde la derecha)"]]);
    $("in-o").innerHTML=stp(1,"Tres instrumentos, una meta",`<ul><li><b>Estándar uniforme</b>: cada empresa reduce ${d2(u)}. Sus costos marginales quedan distintos (${d2(c1*u)} y ${d2(c2*u)}): se podría lograr lo mismo más barato.</li><li><b>Impuesto</b> t = ${d2(t)}: la empresa 1 reduce ${d2(A1)} y la 2 reduce ${d2(A2)}; los CMgA se igualan y el costo total es el mínimo.</li><li><b>Permisos negociables</b>: si se reparten ${d2(perm0)} permisos a cada una, la empresa 1 le vende ${d2(trade)} a la 2 a un precio de ${d2(t)}; el resultado es el mismo que con el impuesto, pero la cantidad total queda fija y no hay recaudo para el Estado.</li></ul>`)};
  bindCtl(["in-1","in-2","in-r"],run);run()};

// ---------- Valoración
SIMS.valor=function(){
  $("sim").innerHTML=tabsBox("va",[["cv","Costo de viaje"],["vc","Valoración contingente"]]);const B=$("va-b");
  tabsRun("va",{
   cv(){B.innerHTML=`<p class="hint">Método zonal (datos ficticios): zona; población; visitas al año; costo del viaje por persona (transporte + tiempo).</p><div class="calcf">${tarea("cv-d","Zonas","Zona 1; 50000; 15000; 10000\nZona 2; 80000; 16000; 25000\nZona 3; 120000; 12000; 45000\nZona 4; 200000; 8000; 70000\nZona 5; 150000; 1500; 95000",5)}</div><div class="res" id="cv-res"></div><div id="cv-gr"></div><div id="cv-o"></div>`;
    const run=()=>{const Z=lines($("cv-d").value).map(p=>({n:p[0],N:num(p[1]),v:num(p[2]),c:num(p[3])})).filter(z=>z.N>0&&z.v>=0&&isFinite(z.c));if(Z.length<3){$("cv-res").innerHTML=err("al menos tres zonas.");return}
      Z.forEach(z=>z.t=z.v/z.N*1000);const n=Z.length,mc=Z.reduce((s,z)=>s+z.c,0)/n,mt=Z.reduce((s,z)=>s+z.t,0)/n,b=Z.reduce((s,z)=>s+(z.c-mc)*(z.t-mt),0)/Z.reduce((s,z)=>s+(z.c-mc)**2,0),a=mt-b*mc,choke=-a/b;
      Z.forEach(z=>{const tpred=Math.max(0,a+b*z.c);z.cs=b<0?(tpred*tpred/(-2*b))*z.N/1000:NaN});const CS=Z.reduce((s,z)=>s+z.cs,0);
      $("cv-res").innerHTML=tl([["Demanda de visitas por mil habitantes",`${d2(a)} ${b<0?"−":"+"} ${d4(Math.abs(b))}·costo`],["Precio de cierre",m0(choke)],["Excedente del consumidor anual (valor recreativo)",m0(CS),"okt"]]);
      $("cv-gr").innerHTML=plotXY({xr:[0,Math.max(choke,...Z.map(z=>z.c))*1.05],yr:[0,Math.max(a,...Z.map(z=>z.t))*1.1],series:[{f:c=>Math.max(0,a+b*c),col:"--exam"}],points:Z.map(z=>({x:z.c,y:z.t,label:z.n})),xl:"Costo del viaje",yl:"Visitas por mil habitantes",label:"Demanda recreativa"});
      $("cv-o").innerHTML=stp(1,"Excedente por zona",`<div class="tbl"><table><tr><th>Zona</th><th>Costo</th><th>Visitas por mil</th><th>Excedente de la zona</th></tr>${Z.map(z=>`<tr><td>${esc(z.n)}</td><td>${m0(z.c)}</td><td>${d2(z.t)}</td><td>${m0(z.cs)}</td></tr>`).join("")}</table></div><p>Para cada zona, el excedente es el área bajo la demanda entre su costo actual y el precio de cierre (${m0(choke)}), multiplicada por su población. La suma, ${m0(CS)} al año, es el valor recreativo del sitio: lo que perderían los visitantes si se cerrara.</p>`)};
    onIn(["cv-d"],run);run()},
   vc(){B.innerHTML=`<p class="hint">Referéndum (datos ficticios): ¿pagaría X pesos al año por conservar el parque? Precio ofrecido; encuestados; respuestas sí.</p><div class="calcf">${tarea("vc-d","Precio; encuestados; síes","5000; 80; 66\n10000; 80; 55\n20000; 80; 41\n40000; 80; 22\n80000; 80; 8",5)}</div><div class="res" id="vc-res"></div><div id="vc-gr"></div><div id="vc-o"></div>`;
    const run=()=>{const D=lines($("vc-d").value).map(p=>({x:num(p[0]),n:num(p[1]),y:num(p[2])})).filter(d=>d.n>0&&d.y>=0&&d.y<=d.n&&isFinite(d.x));if(D.length<2){$("vc-res").innerHTML=err("al menos dos precios.");return}
      const sx=Math.max(...D.map(d=>d.x));let al=0,be=0;for(let it=0;it<100;it++){let g0=0,g1=0,h00=0,h01=0,h11=0;D.forEach(d=>{const z=d.x/sx,p=1/(1+Math.exp(-(al-be*z))),w=d.n*p*(1-p),e=d.y-d.n*p;g0+=e;g1+=-e*z;h00+=w;h01+=-w*z;h11+=w*z*z});const det=h00*h11-h01*h01;if(Math.abs(det)<1e-12)break;const da=(h11*g0-h01*g1)/det,db=(-h01*g0+h00*g1)/det;al+=da;be+=db;if(Math.abs(da)+Math.abs(db)<1e-10)break}
      const B1=be/sx,dap=al/B1,ll=D.reduce((s,d)=>{const p=1/(1+Math.exp(-(al-be*d.x/sx)));return s+d.y*Math.log(p)+(d.n-d.y)*Math.log(1-p)},0);
      $("vc-res").innerHTML=tl([["α",d4(al)],["β por peso",d4(B1*1000)+" por mil pesos"],["DAP media = mediana",m0(dap),"okt"]]);
      $("vc-gr").innerHTML=plotXY({xr:[0,sx*1.2],yr:[0,1],series:[{f:x=>1/(1+Math.exp(-(al-B1*x))),col:"--exam"}],points:D.map(d=>({x:d.x,y:d.y/d.n})),vlines:[{x:dap,col:"--good"}],hlines:[{y:0.5,col:"--muted"}],xl:"Precio ofrecido",yl:"Proporción de síes",label:"Logit del referéndum"});
      $("vc-o").innerHTML=stp(1,"Estimación por máxima verosimilitud",`<div class="eq al">P(sí | X) = 1/(1 + e^(−(α − βX))) · α = ${d4(al)} · β = ${d4(B1)} · log-verosimilitud = ${d2(ll)}<br>DAP media = α/β = ${m0(dap)} por persona al año</div><p>Multiplicada por la población relevante, da el valor de conservación del parque. Revisa el sesgo de alcance (¿cambia la DAP si el área conservada es el doble?) y la sensibilidad al rango de precios ofrecidos.</p><p class="hint">En R: <code>glm(cbind(si, n - si) ~ precio, family = binomial)</code> y DAP = −coef[1]/coef[2].</p>`)};
    onIn(["vc-d"],run);run()}})};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Bienestar","Análisis costo-beneficio","VPN = Σ(Bₜ − Cₜ)/(1 + r)ᵗ"],["Bienestar","Regla de Ramsey","r = ρ + ηg"],["No renovables","Hotelling (competencia)","P_t − c = λ(1 + r)^t"],["No renovables","Hotelling (monopolio)","IMg_t − c = λ(1 + r)^t"],["Pesca","Crecimiento logístico","G(S) = gS(1 − S/K)"],["Pesca","Captura","H = qES"],["Pesca","RMS","S = K/2; H = gK/4"],["Pesca","Libre acceso","pH = wE; E_LA = 2·E_REM"],["Bosques","Wicksell","pV′(T)/pV(T) = r"],["Bosques","Faustmann","pV′(T)/(pV(T) − c) = r/(1 − e^(−rT))"],
    ["Contaminación","Óptimo","CMgA = DMg"],["Contaminación","Impuesto pigouviano","t* = DMg(E*)"],["Contaminación","Costo-efectividad","CMgA₁ = CMgA₂ = t"],["Valoración","Costo de viaje","V/N = a − b·C; EC = área bajo la demanda"],["Valoración","Referéndum","P(sí) = Λ(α − βX); DAP = α/β"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Hotelling"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "cb-c":"<b>Costo de la política por año</b> mientras se paga.","cb-n":"<b>Años durante los que se paga el costo.</b>","cb-b":"<b>Daño evitado por año</b> una vez empiezan los beneficios.","cb-s":"<b>Año en que empiezan los beneficios.</b> Entre más lejos, más pesa la tasa de descuento.","cb-r":"<b>Tasa de descuento social.</b> Decide si vale la pena: con 1,4 % (Stern) la política pasa; con 5 % (Nordhaus) puede no pasar.",
 "ht-a":"<b>Precio máximo</b>: el de la tecnología sustituta (backstop). Por encima nadie compra el recurso.","ht-b":"<b>Pendiente de la demanda.</b>","ht-c":"<b>Costo marginal de extracción.</b>","ht-r":"<b>Tasa de interés.</b> Regla de Hotelling: la renta (P − c) crece a la tasa r.","ht-s":"<b>Reserva total</b> del recurso. Más reserva, menor precio inicial.",
 "ps-g":"<b>Tasa intrínseca de crecimiento</b> del stock de peces.","ps-k":"<b>Capacidad de carga</b>: el máximo stock que sostiene el ecosistema.","ps-q":"<b>Capturabilidad</b>: qué tanto pesca cada unidad de esfuerzo por cada pez en el agua.","ps-p":"<b>Precio del pescado.</b>","ps-w":"<b>Costo de cada unidad de esfuerzo</b> (barcos, días). En acceso abierto se pesca hasta que el beneficio es cero: sobrepesca.",
 "bq-v":"<b>Volumen máximo de madera</b> por hectárea.","bq-k":"<b>Velocidad de crecimiento</b> del bosque.","bq-p":"<b>Precio neto de la madera</b> por m³.","bq-c":"<b>Costo de plantar.</b>","bq-r":"<b>Tasa de interés.</b> Más alta, rotación más corta (regla de Faustmann).","bq-a":"<b>Valor anual de los servicios ambientales</b> del bosque en pie. Con Hartman, si son altos se corta más tarde o nunca.",
 "ct-e":"<b>Emisiones sin ninguna regulación.</b>","ct-a":"<b>Pendiente del costo marginal de abatir</b>: qué tan rápido se encarece reducir emisiones.","ct-d":"<b>Pendiente del daño marginal</b>: qué tan rápido crece el daño de cada unidad emitida. El óptimo iguala costo y daño marginal.",
 "in-1":"<b>Costo de limpiar de la empresa 1</b> (la barata).","in-2":"<b>Costo de limpiar de la empresa 2</b> (la cara). Con impuesto o permisos, reduce más la barata y la meta sale más económica que con una norma uniforme.","in-r":"<b>Reducción total de emisiones</b> que se exige."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
