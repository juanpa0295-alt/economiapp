// Desarrollo Económico · laboratorios interactivos
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


// ===================== LABORATORIOS DE DESARROLLO ECONÓMICO =====================
const d2=v=>isFinite(v)?fmt(Math.abs(v)<5e-4?0:v,2).replace(/^-/,"−"):"—",d4=v=>isFinite(v)?fmt(Math.abs(v)<5e-6?0:v,4).replace(/^-/,"−"):"—",pc=v=>isFinite(v)?d2(v*100)+" %":"—";
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const tarea=(id,l,v,rows=3)=>`<label for="${id}">${l}<textarea id="${id}" rows="${rows}" spellcheck="false" style="width:100%;font-family:var(--f-mono)">${v}</textarea></label>`;
const nums=s=>String(s).replace(/;/g," ").split(/[\s,]+/).map(x=>x.trim()).filter(Boolean).map(x=>+x.replace(/[^\d.eE+-]/g,"")).filter(isFinite);
const rng=(lo,hi,yv,pad=.1)=>{const f=yv.filter(isFinite),a=Math.min(lo,...f),b=Math.max(hi,...f),d=(b-a)||1;return[a-d*pad,b+d*pad]};

// ---------- IDH
SIMS.idh=function(){
  const R=[["País A",77,8.9,14.4,15000],["País B",64,5.2,10.5,3200],["País C",82,12.5,17,45000]];
  $("sim").innerHTML=`<p class="hint">Valores ilustrativos; reemplázalos con los del Informe de Desarrollo Humano del país que estudies. EV: esperanza de vida; AME: años medios de escolaridad; AEE: años esperados; INB: ingreso nacional bruto per cápita en dólares PPA.</p>${R.map((r,i)=>`<div class="calcf"><label for="ih-n${i}">Nombre<input id="ih-n${i}" value="${r[0]}"></label>${nin("ih-e"+i,"EV (años)",r[1],"0.1")}${nin("ih-m"+i,"AME",r[2],"0.1")}${nin("ih-x"+i,"AEE",r[3],"0.1")}${nin("ih-y"+i,"INB per cápita",r[4],"100")}</div>`).join("")}<div id="ih-o"></div>`;
  const ids=R.flatMap((_,i)=>["ih-n"+i,"ih-e"+i,"ih-m"+i,"ih-x"+i,"ih-y"+i]);
  const run=()=>{const P=R.map((_,i)=>{const e=N("ih-e"+i),m=N("ih-m"+i),x=N("ih-x"+i),y=N("ih-y"+i);const cl=v=>Math.max(0,Math.min(1,v));const Is=cl((e-20)/65),Ie=cl((Math.min(m,15)/15+Math.min(x,18)/18)/2),Iy=cl((Math.log(Math.max(y,100))-Math.log(100))/(Math.log(75000)-Math.log(100)));return{n:$("ih-n"+i).value||"País "+(i+1),e,m,x,y,Is,Ie,Iy,idh:Math.cbrt(Is*Ie*Iy),ar:(Is+Ie+Iy)/3}});
    const cat=v=>v>=0.8?"muy alto":v>=0.7?"alto":v>=0.55?"medio":"bajo";
    $("ih-o").innerHTML=stp(1,"Índices por dimensión",`<div class="tbl"><table><tr><th>País</th><th>Salud</th><th>Educación</th><th>Ingreso</th><th>IDH (geométrica)</th><th>Media aritmética</th><th>Nivel</th></tr>${P.map(p=>`<tr><td>${esc(p.n)}</td><td>${d4(p.Is)}</td><td>${d4(p.Ie)}</td><td>${d4(p.Iy)}</td><td><b>${d4(p.idh)}</b></td><td>${d4(p.ar)}</td><td>${cat(p.idh)}</td></tr>`).join("")}</table></div>`)
      +stp(2,"Cálculo para "+esc(P[0].n),`<div class="eq al">Salud = (${fm(P[0].e)} − 20)/(85 − 20) = ${d4(P[0].Is)}<br>Educación = ½(${fm(P[0].m)}/15 + ${fm(P[0].x)}/18) = ${d4(P[0].Ie)}<br>Ingreso = (ln ${fm(P[0].y)} − ln 100)/(ln 75 000 − ln 100) = ${d4(P[0].Iy)}<br>IDH = (${d4(P[0].Is)} × ${d4(P[0].Ie)} × ${d4(P[0].Iy)})^(1/3) = <b>${d4(P[0].idh)}</b></div><p class="hint">La media geométrica siempre es menor o igual a la aritmética, y la diferencia crece cuando las dimensiones están desbalanceadas. Duplicar el ingreso de ${esc(P[0].n)} sube su índice de ingreso solo ${d4(Math.log(2)/(Math.log(75000)-Math.log(100)))}.</p>`)
      +`<div class="plot">${plotXY({xr:[0,P.length*4],yr:[0,1],areas:P.flatMap((p,i)=>[p.Is,p.Ie,p.Iy,p.idh].map((v,j)=>({pts:[[i*4+j*0.9+0.3,0],[i*4+j*0.9+1.1,0],[i*4+j*0.9+1.1,v],[i*4+j*0.9+0.3,v]],col:["--line","--exam","--good","--ink"][j],op:j===3?.9:.55}))),xl:P.map(p=>p.n).join(" · "),yl:"Índice",label:"IDH por dimensión"})}</div>`+legend([["--line","Salud"],["--exam","Educación"],["--good","Ingreso"],["--ink","IDH"]])};
  onIn(ids,run);run()};

// ---------- Pobreza FGT
SIMS.fgt=function(){
  $("sim").innerHTML=`<div class="calcf">${tarea("fg-y","Ingresos de los hogares (uno por persona, separados por espacio o coma)","120 180 250 300 340 420 500 650 800 950 1200 1500 2100 3000 4500",3)}${nin("fg-z","Línea de pobreza z",400)}</div><div class="res" id="fg-res"></div><div id="fg-o"></div>`;
  const run=()=>{const y=nums($("fg-y").value).sort((a,b)=>a-b),z=N("fg-z");if(y.length<2||!(z>0)){$("fg-res").innerHTML=err("escribe al menos dos ingresos y una línea positiva.");return}const n=y.length,P=y.filter(v=>v<z),g=P.map(v=>(z-v)/z);
    const P0=P.length/n,P1=g.reduce((s,x)=>s+x,0)/n,P2=g.reduce((s,x)=>s+x*x,0)/n,W=P.reduce((s,v)=>s+Math.log(z/Math.max(v,1e-9)),0)/n,costo=g.reduce((s,x)=>s+x*z,0);
    $("fg-res").innerHTML=tl([["Pobres",`${P.length} de ${n}`],["P₀ incidencia",pc(P0),"okt"],["P₁ brecha",pc(P1)],["P₂ severidad",pc(P2)],["Índice de Watts",d4(W)],["Costo de cerrar la brecha",fm(costo)]]);
    $("fg-o").innerHTML=stp(1,"Brechas de los pobres",`<div class="tbl"><table><tr><th>Ingreso</th><th>(z − y)/z</th><th>Al cuadrado</th></tr>${P.map((v,i)=>`<tr><td>${fm(v)}</td><td>${d4(g[i])}</td><td>${d4(g[i]*g[i])}</td></tr>`).join("")}</table></div>`)
      +stp(2,"Índices",`<div class="eq al">P₀ = ${P.length}/${n} = ${d4(P0)}<br>P₁ = (1/${n})·Σ(z − yᵢ)/z = ${d4(P1*n)}/${n} = ${d4(P1)}<br>P₂ = (1/${n})·Σ[(z − yᵢ)/z]² = ${d4(P2*n)}/${n} = ${d4(P2)}</div><p class="hint">Costo mínimo de eliminar la pobreza con focalización perfecta: P₁·z·n = ${fm(costo)}. Brecha promedio de los pobres: ${pc(P.length?P1/P0:0)} de la línea. Prueba bajar el ingreso del más pobre: P₀ no cambia, P₁ y P₂ sí.</p>`)};
  onIn(["fg-y","fg-z"],run);run()};

// ---------- Desigualdad
SIMS.gini=function(){
  $("sim").innerHTML=`<div class="calcf">${tarea("gi-y","Ingresos (uno por persona u hogar)","120 180 250 300 340 420 500 650 800 950 1200 1500 2100 3000 4500",3)}${nin("gi-e","Aversión a la desigualdad ε (Atkinson)",1,"0.5")}${nin("gi-t","Transferencia del más rico al más pobre",0,"10")}</div><div class="res" id="gi-res"></div><div id="gi-g"></div><div id="gi-o"></div>`;
  const ind=y=>{const n=y.length,S=y.reduce((a,b)=>a+b,0),mu=S/n,G=2*y.reduce((s,v,i)=>s+(i+1)*v,0)/(n*S)-(n+1)/n,Th=y.reduce((s,v)=>s+(v>0?v/mu*Math.log(v/mu):0),0)/n,q=p=>{const k=Math.max(1,Math.round(n*p));return k},
    e=N("gi-e"),ede=Math.abs(e-1)<1e-9?Math.exp(y.reduce((s,v)=>s+Math.log(Math.max(v,1e-9)),0)/n):Math.pow(y.reduce((s,v)=>s+Math.pow(Math.max(v,1e-9),1-e),0)/n,1/(1-e)),sh=k=>y.slice(0,k).reduce((a,b)=>a+b,0)/S,top=k=>y.slice(n-k).reduce((a,b)=>a+b,0)/S;
    return{n,S,mu,G,Th,A:1-ede/mu,ede,r2020:top(q(.2))/sh(q(.2)),palma:top(q(.1))/sh(q(.4)),lor:[[0,0],...y.map((_,i)=>[(i+1)/n,sh(i+1)])]}};
  const run=()=>{let y=nums($("gi-y").value).filter(v=>v>=0).sort((a,b)=>a-b);if(y.length<2){$("gi-res").innerHTML=err("escribe al menos dos ingresos.");return}const t=Math.max(0,N("gi-t")||0),A=ind(y);
    let B=null;if(t>0){const z=y.slice();const tt=Math.min(t,(z[z.length-1]-z[0])/2);z[0]+=tt;z[z.length-1]-=tt;B=ind(z.sort((a,b)=>a-b))}
    $("gi-res").innerHTML=tl([["Gini",d4(A.G),"okt"],["Theil",d4(A.Th)],[`Atkinson (ε = ${fm(N("gi-e"))})`,d4(A.A)],["Razón 20/20",d2(A.r2020)],["Palma (10 % / 40 %)",d2(A.palma)],...(B?[["Gini tras la transferencia",d4(B.G),"okt"]]:[])]);
    $("gi-g").innerHTML=plotXY({xr:[0,1],yr:[0,1],series:[{f:x=>x,col:"--muted",dash:"5 4"},{pts:A.lor,col:"--line",w:2.6},...(B?[{pts:B.lor,col:"--good",w:2}]:[])],areas:[{pts:[...A.lor,[1,1]].concat([[0,0]]),col:"--line",op:.12}],xl:"Población acumulada",yl:"Ingreso acumulado",label:"Curva de Lorenz"})+legend([["--muted","Igualdad perfecta",1],["--line","Curva de Lorenz"],...(B?[["--good","Tras la transferencia"]]:[])]);
    $("gi-o").innerHTML=stp(1,"Gini",`<div class="eq al">G = 2·Σ i·y₍ᵢ₎/(n·Σy) − (n + 1)/n = 2·${fm(y.reduce((s,v,i)=>s+(i+1)*v,0))}/(${A.n}·${fm(A.S)}) − ${A.n+1}/${A.n} = <b>${d4(A.G)}</b></div><p class="hint">El área sombreada entre la diagonal y la curva es G/2.</p>`)
      +stp(2,"Otros índices",`<div class="eq al">Theil = (1/n)·Σ (yᵢ/μ)·ln(yᵢ/μ) = ${d4(A.Th)} (μ = ${d2(A.mu)})<br>Atkinson: ingreso equivalente igualmente distribuido = ${d2(A.ede)} ⟹ A = 1 − ${d2(A.ede)}/${d2(A.mu)} = ${d4(A.A)}</div><p class="hint">Atkinson se lee así: la sociedad aceptaría perder ${pc(A.A)} del ingreso total a cambio de repartirlo en partes iguales. Con mayor ε la cifra aumenta.</p>`)
      +(B?stp(3,"Principio de Pigou-Dalton",`<p>Al transferir ${fm(Math.min(t,(y[y.length-1]-y[0])/2))} del más rico al más pobre, el Gini pasa de ${d4(A.G)} a ${d4(B.G)}, el Theil de ${d4(A.Th)} a ${d4(B.Th)} y el Palma de ${d2(A.palma)} a ${d2(B.palma)}. Todos los índices que cumplen el principio de transferencias bajan.</p>`):"")};
  onIn(["gi-y","gi-e","gi-t"],run);run()};

// ---------- Malthus
SIMS.malthus=function(){
  $("sim").innerHTML=`<p class="hint">y = A·N^(β−1) · crecimiento de la población = θ(y − ȳ). En el periodo 40 la tecnología A sube en el porcentaje que elijas.</p>${ctl("ma-b","β (rendimientos del trabajo)",0.3,0.9,0.05,0.6)}${ctl("ma-t","θ (respuesta de la población)",0.005,0.1,0.005,0.03)}${ctl("ma-s","Subsistencia ȳ",0.5,2,0.1,1)}${ctl("ma-k","Mejora técnica en t = 40 (%)",0,100,5,50)}<div class="res" id="ma-res"></div><div id="ma-g"></div><div id="ma-o"></div>`;
  const run=()=>{const b=V("ma-b"),th=V("ma-t"),yb=V("ma-s"),k=V("ma-k")/100,T=200;let A=1,Nn=Math.pow(yb/A,1/(b-1));const Y=[],P=[];for(let t=0;t<=T;t++){if(t===40)A*=1+k;const y=A*Math.pow(Nn,b-1);Y.push([t,y]);P.push([t,Nn]);Nn=Nn*(1+Math.max(-0.5,th*(y-yb)))}
    const N0=P[0][1],Nf=P[T][1],ymax=Math.max(...Y.map(p=>p[1]));
    $("ma-res").innerHTML=tl([["Ingreso inicial",d2(Y[0][1])],["Máximo tras la mejora",d2(ymax)],["Ingreso final",d2(Y[T][1]),"okt"],["Población final / inicial",d2(Nf/N0),"okt"]]);
    $("ma-g").innerHTML=`<div class="grid2">${plotXY({xr:[0,T],yr:[0,ymax*1.15],series:[{pts:Y,col:"--line"}],hlines:[{y:yb,col:"--good"}],xl:"t",yl:"y",label:"Ingreso por persona"})}${plotXY({xr:[0,T],yr:[0,Math.max(...P.map(p=>p[1]))*1.15],series:[{pts:P,col:"--exam"}],xl:"t",yl:"N",label:"Población"})}</div>`;
    $("ma-o").innerHTML=stp(1,"Lectura",`<p>La mejora técnica de ${pc(k)} eleva el ingreso por persona a ${d2(ymax)}, por encima de la subsistencia; la población crece y, por los rendimientos decrecientes (β = ${fm(b)}), el ingreso vuelve a ${d2(Y[T][1])}. Al final la población es ${d2(Nf/N0)} veces la inicial: en el largo plazo, la tecnología determina la <b>densidad</b> de la población, no su nivel de vida. Población de equilibrio: N* = (ȳ/A)^(1/(β−1)); con A ${fm(1+k)} veces mayor, N* se multiplica por ${d2(Math.pow(1+k,1/(1-b)))}.</p>`)};
  bindCtl(["ma-b","ma-t","ma-s","ma-k"],run);run()};

// ---------- Harrod-Domar
SIMS.hd=function(){
  $("sim").innerHTML=`${ctl("hd-s","Tasa de ahorro s (%)",2,40,1,15)}${ctl("hd-v","Relación capital-producto v",1,8,0.1,3.5)}${ctl("hd-d","Depreciación δ (%)",0,10,0.5,3)}${ctl("hd-n","Crecimiento de la población n (%)",0,4,0.1,1.5)}${ctl("hd-g","Crecimiento objetivo del PIB (%)",0,12,0.5,7)}<div class="res" id="hd-res"></div><div id="hd-gr"></div><div id="hd-o"></div>`;
  const run=()=>{const s=V("hd-s")/100,v=V("hd-v"),d=V("hd-d")/100,n=V("hd-n")/100,gt=V("hd-g")/100,g=s/v-d,gy=(1+g)/(1+n)-1,sr=v*(gt+d),gap=sr-s;
    $("hd-res").innerHTML=tl([["Crecimiento del PIB s/v − δ",pc(g),"okt"],["Crecimiento per cápita",pc(gy)],["Ahorro requerido para el objetivo",pc(sr)],["Brecha de financiamiento",gap>0?pc(gap)+" del PIB":"no hay brecha",gap>0?"badt":"okt"],["Años para duplicar el ingreso per cápita",gy>0?d2(Math.log(2)/Math.log(1+gy)):"no se duplica"]]);
    const yrs=[...Array(31)].map((_,t)=>t),p1=yrs.map(t=>[t,100*Math.pow(1+gy,t)]),p2=yrs.map(t=>[t,100*Math.pow((1+gt)/(1+n),t)]);
    $("hd-gr").innerHTML=plotXY({xr:[0,30],yr:[0,Math.max(p1[30][1],p2[30][1])*1.1],series:[{pts:p1,col:"--line"},{pts:p2,col:"--exam",dash:"6 4"}],xl:"Años",yl:"Ingreso per cápita (año 0 = 100)",label:"Harrod-Domar"})+legend([["--line","Con el ahorro actual"],["--exam","Con el crecimiento objetivo",1]]);
    $("hd-o").innerHTML=stp(1,"Crecimiento",`<div class="eq al">g = s/v − δ = ${pc(s)}/${fm(v)} − ${pc(d)} = <b>${pc(g)}</b> · per cápita ≈ g − n = ${pc(gy)}</div>`)+stp(2,"Modelo de brecha",`<div class="eq al">s requerido = v(g* + δ) = ${fm(v)}·(${pc(gt)} + ${pc(d)}) = ${pc(sr)}</div><p>${gap>0?`Faltan ${pc(gap)} del PIB de ahorro. En el modelo de brecha, la ayuda externa o la inversión extranjera llenaría ese hueco. Easterly mostró que esa relación mecánica no se cumple en los datos: la ayuda no se traduce uno a uno en inversión ni la inversión en crecimiento.`:"El ahorro interno alcanza para la meta."}</p>`)};
  bindCtl(["hd-s","hd-v","hd-d","hd-n","hd-g"],run);run()};

// ---------- Solow
SIMS.solow=function(){
  $("sim").innerHTML=`${ctl("sw-s","Ahorro s",0.05,0.6,0.01,0.2)}${ctl("sw-a","α (participación del capital)",0.2,0.7,0.01,0.33)}${ctl("sw-n","n (%)",0,4,0.1,1.5)}${ctl("sw-g","g progreso técnico (%)",0,4,0.1,1.5)}${ctl("sw-d","δ (%)",1,10,0.5,5)}${ctl("sw-k","Capital inicial como % de k*",10,200,5,30)}<div class="res" id="sw-res"></div><div id="sw-gr"></div><div id="sw-o"></div>`;
  const run=()=>{const s=V("sw-s"),a=V("sw-a"),n=V("sw-n")/100,g=V("sw-g")/100,d=V("sw-d")/100,f0=V("sw-k")/100,m=n+g+d,ks=Math.pow(s/m,1/(1-a)),ys=Math.pow(ks,a),cs=(1-s)*ys,kg=Math.pow(a/m,1/(1-a)),cg=(1-a)*Math.pow(kg,a),lam=(1-a)*m;
    const path=[];let k=f0*ks;for(let t=0;t<=80;t++){path.push([t,Math.log(Math.pow(k,a))+g*t]);k=k+s*Math.pow(k,a)-m*k}
    $("sw-res").innerHTML=tl([["k*",d4(ks),"okt"],["y*",d4(ys),"okt"],["c*",d4(cs)],["Ahorro de la regla de oro",d2(a)],["c* en la regla de oro",d4(cg)],["Velocidad de convergencia λ",pc(lam)],["Vida media",d2(Math.log(2)/lam)+" años"]]);
    const km=ks*2;$("sw-gr").innerHTML=`<div class="grid2">${plotXY({xr:[0,km],yr:[0,Math.pow(km,a)*1.05],series:[{f:x=>Math.pow(x,a),col:"--muted"},{f:x=>s*Math.pow(x,a),col:"--line"},{f:x=>m*x,col:"--exam"}],points:[{x:ks,y:m*ks,label:"k*"}],vlines:[{x:f0*ks,col:"--good"}],xl:"k",yl:"",label:"Diagrama de Solow"})}${plotXY({xr:[0,80],yr:rng(path[0][1],path[80][1],path.map(p=>p[1])),series:[{pts:path,col:"--line"},{f:t=>Math.log(ys)+g*t,col:"--good",dash:"5 4"}],xl:"Años",yl:"ln y por trabajador",label:"Transición"})}</div>`+legend([["--muted","f(k)"],["--line","s·f(k)"],["--exam","(n + g + δ)k"],["--good","Senda de estado estacionario",1]]);
    $("sw-o").innerHTML=stp(1,"Estado estacionario",`<div class="eq al">k* = (s/(n + g + δ))^(1/(1 − α)) = (${fm(s)}/${d4(m)})^(${d4(1/(1-a))}) = <b>${d4(ks)}</b><br>y* = k*^α = ${d4(ys)} · c* = (1 − s)y* = ${d4(cs)}</div><p>${s<a-0.005?`El ahorro está por debajo de la regla de oro (s = α = ${fm(a)}): ahorrar más elevaría el consumo de largo plazo.`:s>a+0.005?"El ahorro supera la regla de oro: hay ineficiencia dinámica, ahorrar menos elevaría el consumo en todos los periodos.":"Estás en la regla de oro."}</p>`)
      +stp(2,"Convergencia",`<p>Partiendo con ${pc(f0)} de k*, la economía ${f0<1?"crece más rápido que g mientras se acerca":"crece más lento que g mientras baja hacia"} su senda de estado estacionario. Cerca de él, la brecha se cierra a λ = (1 − α)(n + g + δ) = ${pc(lam)} por año: la mitad de la distancia se recorre en ${d2(Math.log(2)/lam)} años.</p>`)};
  bindCtl(["sw-s","sw-a","sw-n","sw-g","sw-d","sw-k"],run);run()};

// ---------- AK y Romer
SIMS.ak=function(){
  $("sim").innerHTML=tabsBox("ak",[["ak","AK frente a Solow"],["rom","Romer: ideas"]]);const B=$("ak-b");
  tabsRun("ak",{
   ak(){B.innerHTML=`${ctl("k1-s","Ahorro inicial s",0.05,0.5,0.01,0.2)}${ctl("k1-s2","Nuevo ahorro desde el año 20",0.05,0.5,0.01,0.3)}${ctl("k1-A","A (productividad del capital amplio)",0.1,0.6,0.01,0.35)}${ctl("k1-d","δ + n (%)",1,10,0.5,5)}<div class="res" id="k1-res"></div><div id="k1-g"></div><div id="k1-o"></div>`;
    const run=()=>{const s1=V("k1-s"),s2=V("k1-s2"),A=V("k1-A"),dn=V("k1-d")/100,a=0.33,T=80;const ak=[],so=[];let K=1,k=Math.pow(s1*A/dn,1/(1-a))/1;let lk=Math.log(K);
      for(let t=0;t<=T;t++){const s=t<20?s1:s2;ak.push([t,lk+Math.log(A)]);lk+=Math.log(1+s*A-dn);so.push([t,a*Math.log(k)]);k=k+s*Math.pow(k,a)-dn*k}
      const g1=s1*A-dn,g2=s2*A-dn;
      $("k1-res").innerHTML=tl([["Crecimiento AK antes",pc(g1)],["Crecimiento AK después",pc(g2),"okt"],["Crecimiento Solow de largo plazo","igual antes y después (solo g exógeno)"]]);
      const lo=Math.min(ak[0][1],so[0][1]),hi=Math.max(ak[T][1],so[T][1]);
      $("k1-g").innerHTML=plotXY({xr:[0,T],yr:rng(lo,hi,[lo,hi]),series:[{pts:ak,col:"--line"},{pts:so.map(([t,v])=>[t,v-so[0][1]+ak[0][1]]),col:"--exam"}],vlines:[{x:20,col:"--muted"}],xl:"Años",yl:"ln y",label:"Un aumento del ahorro en el año 20"})+legend([["--line","Modelo AK"],["--exam","Modelo de Solow (sin progreso técnico)"]]);
      $("k1-o").innerHTML=stp(1,"Comparación",`<div class="eq al">AK: g = sA − (δ + n) = ${fm(s1)}·${fm(A)} − ${pc(dn)} = ${pc(g1)} → ${fm(s2)}·${fm(A)} − ${pc(dn)} = <b>${pc(g2)}</b></div><p>En AK el mayor ahorro cambia la <b>pendiente</b> de ln y para siempre. En Solow, por los rendimientos decrecientes, solo produce un aumento transitorio del crecimiento y un <b>nivel</b> más alto; la pendiente de largo plazo vuelve a ser la misma.</p>`)};
    bindCtl(["k1-s","k1-s2","k1-A","k1-d"],run);run()},
   rom(){B.innerHTML=`<p class="hint">Romer (1990) simplificado: Y = A·L_Y, Ȧ/A = δ·L_A, con L_A = s_R·L investigadores.</p>${ctl("ro-d","δ (productividad de la investigación, %)",0.01,0.5,0.01,0.1)}${ctl("ro-l","L (millones de trabajadores)",1,100,1,20)}${ctl("ro-s","s_R (fracción en investigación, %)",0,20,0.5,5)}<div class="res" id="ro-res"></div><div id="ro-o"></div>`;
    const run=()=>{const dl=V("ro-d")/100,L=V("ro-l"),sR=V("ro-s")/100,gA=dl*sR*L;
      $("ro-res").innerHTML=tl([["Investigadores L_A",d2(sR*L)],["Crecimiento de las ideas y del ingreso per cápita",pc(gA),"okt"],["Nivel inicial de y/A",d4(1-sR)]]);
      $("ro-o").innerHTML=stp(1,"El intercambio",`<p>Dedicar más trabajadores a investigar baja hoy el producto (y = A·(1 − s_R)) pero sube su crecimiento: g = δ·s_R·L = ${pc(gA)}. Como las ideas son no rivales, cada idea sirve a toda la economía. El efecto escala (g crece con L) es el punto débil que señaló Jones (1995): los países más poblados no crecen más rápido.</p>`)};
    bindCtl(["ro-d","ro-l","ro-s"],run);run()}})};

// ---------- Convergencia
SIMS.conv=function(){
  const ols=(X,y)=>{const k=X[0].length,XtX=[...Array(k)].map((_,i)=>[...Array(k)].map((_,j)=>X.reduce((s,r)=>s+r[i]*r[j],0))),Xty=[...Array(k)].map((_,i)=>X.reduce((s,r,t)=>s+r[i]*y[t],0));
    const M=XtX.map((r,i)=>[...r,Xty[i]]);for(let c=0;c<k;c++){let p=c;for(let i=c+1;i<k;i++)if(Math.abs(M[i][c])>Math.abs(M[p][c]))p=i;[M[c],M[p]]=[M[p],M[c]];for(let i=0;i<k;i++)if(i!==c){const f=M[i][c]/M[c][c];for(let j=c;j<=k;j++)M[i][j]-=f*M[c][j]}}const b=M.map((r,i)=>r[k]/r[i]);
    const e=y.map((v,t)=>v-X[t].reduce((s,x,i)=>s+x*b[i],0)),my=y.reduce((a,c)=>a+c,0)/y.length,r2=1-e.reduce((s,x)=>s+x*x,0)/y.reduce((s,v)=>s+(v-my)**2,0),s2=e.reduce((s,x)=>s+x*x,0)/(y.length-k);
    const inv=(()=>{const n=k,A=XtX.map((r,i)=>[...r,...[...Array(n)].map((_,j)=>i===j?1:0)]);for(let c=0;c<n;c++){let p=c;for(let i=c+1;i<n;i++)if(Math.abs(A[i][c])>Math.abs(A[p][c]))p=i;[A[c],A[p]]=[A[p],A[c]];const d=A[c][c];for(let j=0;j<2*n;j++)A[c][j]/=d;for(let i=0;i<n;i++)if(i!==c){const f=A[i][c];for(let j=0;j<2*n;j++)A[i][j]-=f*A[c][j]}}return A.map(r=>r.slice(n))})();
    return{b,r2,se:b.map((_,i)=>Math.sqrt(s2*inv[i][i]))}};
  $("sim").innerHTML=`<p class="hint">Muestra simulada de países que siguen el modelo de Solow. Cada uno tiene su tasa de ahorro y, por tanto, su propio estado estacionario; todos empiezan algo por debajo de él. Cuanto más distintos son los ahorros, más ricos empiezan los que ahorran más.</p>${ctl("cv-n","Número de países",20,150,5,60)}${ctl("cv-l","Velocidad verdadera λ (%)",0.5,6,0.25,2)}${ctl("cv-r","Dispersión del ahorro entre países (desviación de ln s)",0,1.5,0.05,0.9)}${ctl("cv-T","Años del periodo",10,60,5,40)}<div class="chips pre"><button type="button" class="btn" id="cv-new">Nueva muestra</button></div><div class="res" id="cv-res"></div><div id="cv-g"></div><div id="cv-o"></div>`;
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646},gau=()=>Math.sqrt(-2*Math.log(rnd()+1e-12))*Math.cos(2*Math.PI*rnd());
  const run=()=>{const n=V("cv-n"),lam=V("cv-l")/100,rho=V("cv-r"),T=V("cv-T");seed=7+n*3+Math.round(rho*100)+keep;const D=[];
    for(let i=0;i<n;i++){const ls=Math.log(0.18)+rho*gau(),lss=0.5*(ls-Math.log(0.06))+8,ly0=lss-(0.8+0.35*gau());const gr=(1-Math.exp(-lam*T))/T*(lss-ly0)+0.015+0.006*gau();D.push({ly0,ls,gr,lss})}
    const A=ols(D.map(d=>[1,d.ly0]),D.map(d=>d.gr)),C=ols(D.map(d=>[1,d.ly0,d.ls]),D.map(d=>d.gr)),sp=b=>b<0&&1+b*T>0?-Math.log(1+b*T)/T:NaN;
    const sd0=Math.sqrt(D.reduce((s,d)=>s+(d.ly0-D.reduce((a,c)=>a+c.ly0,0)/n)**2,0)/n),lyT=D.map(d=>d.ly0+d.gr*T),mT=lyT.reduce((a,c)=>a+c,0)/n,sdT=Math.sqrt(lyT.reduce((s,v)=>s+(v-mT)**2,0)/n);
    $("cv-res").innerHTML=tl([["β absoluta",`${d4(A.b[1])} (ee ${d4(A.se[1])})`,A.b[1]<-2*A.se[1]?"okt":"badt"],["β condicional",`${d4(C.b[1])} (ee ${d4(C.se[1])})`,C.b[1]<-2*C.se[1]?"okt":"badt"],["λ implícita (condicional)",pc(sp(C.b[1]))],["σ inicial → final",`${d4(sd0)} → ${d4(sdT)}`,sdT<sd0?"okt":"badt"]]);
    const xs=D.map(d=>d.ly0),xr=[Math.min(...xs)-.2,Math.max(...xs)+.2];
    $("cv-g").innerHTML=plotXY({xr,yr:rng(0,0,D.map(d=>d.gr),.1),series:[{f:x=>A.b[0]+A.b[1]*x,col:"--exam"}],points:D.map(d=>({x:d.ly0,y:d.gr,col:"--line"})),xl:"ln del ingreso inicial",yl:"Crecimiento anual",label:"Convergencia β"})+legend([["--line","Países"],["--exam","Regresión sin controles"]]);
    $("cv-o").innerHTML=stp(1,"Regresiones",`<div class="eq al">Absoluta: g = ${d4(A.b[0])} ${A.b[1]<0?"−":"+"} ${d4(Math.abs(A.b[1]))}·ln y₀ · R² = ${d4(A.r2)}<br>Condicional: g = ${d4(C.b[0])} ${C.b[1]<0?"−":"+"} ${d4(Math.abs(C.b[1]))}·ln y₀ ${C.b[2]<0?"−":"+"} ${d4(Math.abs(C.b[2]))}·ln s · R² = ${d4(C.r2)}</div><p>Coeficiente esperado según la λ verdadera: β = −(1 − e^(−λT))/T = ${d4(-(1-Math.exp(-lam*T))/T)}. ${A.b[1]<-2*A.se[1]?`La β absoluta es apenas ${pc(A.b[1]/C.b[1])} de la condicional: sin controlar por el ahorro, los países que empiezan ricos lo son porque su estado estacionario es alto, no porque estén cerca de él, y la convergencia se diluye.`:"Sin controlar por el ahorro, la convergencia desaparece: los países ricos también tienen estados estacionarios más altos. Es lo que pasa en las muestras amplias de países."} Sube la dispersión del ahorro para ver cómo se debilita la convergencia absoluta mientras la condicional se mantiene.}</p>`)};
  let keep=0;$("cv-new").onclick=()=>{keep++;run()};bindCtl(["cv-n","cv-l","cv-r","cv-T"],run);run()};

// ---------- Encadenamientos (Rasmussen)
SIMS.encad=function(){
  $("sim").innerHTML=`<p class="hint">Matriz de coeficientes técnicos A (columna j: insumos que el sector j compra a cada sector por peso producido). Datos ilustrativos de cuatro sectores.</p><div class="calcf">${tarea("en-n","Nombres de los sectores (uno por línea)","Agricultura\nIndustria\nConstrucción\nServicios",4)}${tarea("en-a","Matriz A (una fila por sector)","0.10 0.15 0.02 0.03\n0.12 0.25 0.30 0.10\n0.00 0.01 0.05 0.02\n0.08 0.15 0.12 0.20",4)}</div><div id="en-o"></div>`;
  const inv=M=>{const n=M.length,A=M.map((r,i)=>[...r,...r.map((_,j)=>i===j?1:0)]);for(let c=0;c<n;c++){let p=c;for(let i=c+1;i<n;i++)if(Math.abs(A[i][c])>Math.abs(A[p][c]))p=i;if(Math.abs(A[p][c])<1e-12)return null;[A[c],A[p]]=[A[p],A[c]];const d=A[c][c];for(let j=0;j<2*n;j++)A[c][j]/=d;for(let i=0;i<n;i++)if(i!==c){const f=A[i][c];for(let j=0;j<2*n;j++)A[i][j]-=f*A[c][j]}}return A.map(r=>r.slice(n))};
  const run=()=>{const nm=$("en-n").value.split("\n").map(s=>s.trim()).filter(Boolean),A=$("en-a").value.trim().split("\n").map(nums),n=A.length;
    if(n<2||A.some(r=>r.length!==n)){$("en-o").innerHTML=err("la matriz debe ser cuadrada.");return}const L=inv(A.map((r,i)=>r.map((v,j)=>(i===j?1:0)-v)));if(!L||L.flat().some(v=>v<-1e-9)){$("en-o").innerHTML=err("I − A no tiene una inversa no negativa: revisa que cada columna sume menos de 1.");return}
    const name=i=>esc(nm[i]||"Sector "+(i+1)),col=L[0].map((_,j)=>L.reduce((s,r)=>s+r[j],0)),row=L.map(r=>r.reduce((s,v)=>s+v,0)),mc=col.reduce((a,b)=>a+b,0)/n,mr=row.reduce((a,b)=>a+b,0)/n,BL=col.map(v=>v/mc),FL=row.map(v=>v/mr);
    const cls=i=>BL[i]>1&&FL[i]>1?"clave":BL[i]>1?"impulsor (arrastre hacia atrás)":FL[i]>1?"estratégico (base hacia adelante)":"independiente";
    $("en-o").innerHTML=stp(1,"Inversa de Leontief (I − A)⁻¹",`<div class="tbl"><table><tr><th></th>${A.map((_,j)=>`<th>${name(j)}</th>`).join("")}<th>Suma de fila</th></tr>${L.map((r,i)=>`<tr><td>${name(i)}</td>${r.map(v=>`<td>${d4(v)}</td>`).join("")}<td>${d4(row[i])}</td></tr>`).join("")}<tr><td><b>Suma de columna</b></td>${col.map(v=>`<td><b>${d4(v)}</b></td>`).join("")}<td></td></tr></table></div><p class="hint">La suma de la columna j es el multiplicador de producción: lo que debe producir toda la economía para entregar un peso más de demanda final del sector j.</p>`)
      +stp(2,"Índices de Rasmussen y clasificación",`<div class="tbl"><table><tr><th>Sector</th><th>Hacia atrás (BL)</th><th>Hacia adelante (FL)</th><th>Tipo</th></tr>${A.map((_,i)=>`<tr${cls(i)==="clave"?' class="hl"':""}><td>${name(i)}</td><td>${d4(BL[i])}</td><td>${d4(FL[i])}</td><td>${cls(i)}</td></tr>`).join("")}</table></div><p>Para Hirschman, los sectores <b>clave</b> (ambos índices mayores que 1) son los mejores candidatos para una estrategia de crecimiento desequilibrado: invertir en ellos genera presiones de demanda y de oferta sobre muchos otros sectores.</p>`)
      +plotXY({xr:[0,Math.max(...BL)*1.25],yr:[0,Math.max(...FL)*1.25],series:[],vlines:[{x:1,col:"--muted"}],hlines:[{y:1,col:"--muted"}],points:A.map((_,i)=>({x:BL[i],y:FL[i],label:nm[i]||"S"+(i+1)})),xl:"Encadenamiento hacia atrás",yl:"Hacia adelante",label:"Cuadrantes de Rasmussen"})};
  onIn(["en-n","en-a"],run);run()};

// ---------- Lewis
SIMS.lewis=function(){
  $("sim").innerHTML=`<p class="hint">Sector moderno Y = A·K^α·L^(1−α). Contrata al salario fijo w̄ mientras haya excedente de trabajo y reinvierte la fracción s de sus utilidades.</p>${ctl("lw-w","Salario w̄",0.5,3,0.1,1)}${ctl("lw-s","Reinversión de utilidades s",0.1,1,0.05,0.6)}${ctl("lw-a","α",0.2,0.6,0.01,0.4)}${ctl("lw-x","Excedente de trabajo (múltiplo del empleo moderno inicial)",2,30,1,10)}<div class="res" id="lw-res"></div><div id="lw-g"></div><div id="lw-o"></div>`;
  const run=()=>{const w=V("lw-w"),s=V("lw-s"),a=V("lw-a"),X=V("lw-x"),A=1;let K=1;const Ld=K=>K*Math.pow((1-a)*A/w,1/a),L0=Ld(1),Ltot=L0*X;const P=[],Wg=[];let tp=null;
    for(let t=0;t<=80;t++){let L=Ld(K),wt=w;if(L>=Ltot){L=Ltot;wt=(1-a)*A*Math.pow(K,a)*Math.pow(L,-a);if(tp===null)tp=t}const Y=A*Math.pow(K,a)*Math.pow(L,1-a),Pi=Y-wt*L;P.push([t,L/Ltot*100]);Wg.push([t,wt]);K+=s*Pi-0.0*K}
    $("lw-res").innerHTML=tl([["Crecimiento del capital antes del punto de inflexión",pc(s*a*A*Math.pow((1-a)*A/w,(1-a)/a))],["Punto de inflexión de Lewis",tp!==null?"año "+tp:"después del año 80","okt"],["Participación de las utilidades",pc(a)]]);
    $("lw-g").innerHTML=`<div class="grid2">${plotXY({xr:[0,80],yr:[0,105],series:[{pts:P,col:"--line"}],vlines:tp!==null?[{x:tp,col:"--muted"}]:[],xl:"Años",yl:"% del trabajo en el sector moderno",label:"Absorción del excedente"})}${plotXY({xr:[0,80],yr:[0,Math.max(...Wg.map(p=>p[1]))*1.15],series:[{pts:Wg,col:"--exam"}],vlines:tp!==null?[{x:tp,col:"--muted"}]:[],xl:"Años",yl:"Salario",label:"Salario del sector moderno"})}</div>`;
    $("lw-o").innerHTML=stp(1,"Dinámica",`<div class="eq al">Empleo moderno: (1 − α)·A·(K/L)^α = w̄ ⟹ L = K·((1 − α)A/w̄)^(1/α)<br>Utilidades = αY; inversión = s·αY ⟹ el capital y el empleo crecen a s·α·Y/K = ${pc(s*a*A*Math.pow((1-a)*A/w,(1-a)/a))} por año</div><p>Mientras dura el excedente, el salario no sube y toda la productividad va a utilidades que se reinvierten: el sector moderno crece a una tasa constante. ${tp!==null?`En el año ${tp} se absorbe todo el excedente y el salario empieza a subir: la economía entra en la fase neoclásica.`:"Con este excedente, el punto de inflexión llega después del horizonte."} Un salario más alto o una menor reinversión retrasan el punto de inflexión.</p>`)};
  bindCtl(["lw-w","lw-s","lw-a","lw-x"],run);run()};

// ---------- Thirlwall y términos de intercambio
SIMS.thirlwall=function(){
  $("sim").innerHTML=tabsBox("th",[["tw","Ley de Thirlwall"],["ti","Términos de intercambio"]]);const B=$("th-b");
  tabsRun("th",{
   tw(){B.innerHTML=`${ctl("tw-e","ε: elasticidad ingreso de las exportaciones",0.3,3,0.05,1)}${ctl("tw-z","z: crecimiento mundial (%)",0,6,0.1,3)}${ctl("tw-p","π: elasticidad ingreso de las importaciones",0.5,4,0.05,2)}${ctl("tw-g","Crecimiento observado (%)",0,10,0.1,4)}<div class="res" id="tw-res"></div><div id="tw-o"></div>`;
    const run=()=>{const e=V("tw-e"),z=V("tw-z")/100,p=V("tw-p"),go=V("tw-g")/100,gb=e*z/p;
      $("tw-res").innerHTML=tl([["Crecimiento compatible con la balanza de pagos",pc(gb),"okt"],["Crecimiento de las exportaciones εz",pc(e*z)],["Brecha con el observado",pc(go-gb),go>gb?"badt":"okt"]]);
      $("tw-o").innerHTML=stp(1,"Ley de Thirlwall",`<div class="eq al">g_B = εz/π = ${fm(e)}·${pc(z)}/${fm(p)} = <b>${pc(gb)}</b></div><p>${go>gb?`Crecer a ${pc(go)} haría que las importaciones crezcan más que las exportaciones: déficit externo creciente que terminaría en ajuste (devaluación, recesión).`:"El crecimiento observado es sostenible desde el punto de vista externo."} Para elevar g_B hay que exportar bienes con mayor ε (manufacturas, servicios de conocimiento) o reducir π sustituyendo importaciones: es el argumento estructuralista para el cambio de la estructura productiva.</p>`)};
    bindCtl(["tw-e","tw-z","tw-p","tw-g"],run);run()},
   ti(){B.innerHTML=`<p class="hint">Simulación: precios de exportación (primarios) e importación (manufacturas) con tendencias distintas y volatilidad.</p>${ctl("ti-x","Tendencia de los precios de exportación (% anual)",-3,3,0.1,0.5)}${ctl("ti-m","Tendencia de los precios de importación (% anual)",-3,3,0.1,1.5)}${ctl("ti-v","Volatilidad de las exportaciones (%)",0,25,1,12)}<div class="res" id="ti-res"></div><div id="ti-g"></div>`;
    const run=()=>{const gx=V("ti-x")/100,gm=V("ti-m")/100,vo=V("ti-v")/100;let sd=11;const r=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646};const P=[];let x=100,m=100;for(let t=0;t<=50;t++){P.push([t,100*x/m]);x*=Math.exp(gx+vo*(r()-0.5)*1.5);m*=Math.exp(gm)}
      const tr=(gx-gm),ytx=[...Array(51)].map((_,t)=>[t,100*Math.exp(tr*t)]);
      $("ti-res").innerHTML=tl([["Tendencia de los términos de intercambio",pc(Math.exp(tr)-1)+" anual",tr<0?"badt":"okt"],["Índice al final (año 0 = 100)",d2(P[50][1])],["Exportaciones extra para pagar las mismas importaciones",tr<0?pc(1/Math.exp(tr*50)-1):"ninguna"]]);
      $("ti-g").innerHTML=plotXY({xr:[0,50],yr:[0,Math.max(...P.map(p=>p[1]),...ytx.map(p=>p[1]))*1.1],series:[{pts:P,col:"--line"},{pts:ytx,col:"--exam",dash:"6 4"}],hlines:[{y:100,col:"--muted"}],xl:"Años",yl:"Px/Pm (año 0 = 100)",label:"Términos de intercambio"})+legend([["--line","Índice"],["--exam","Tendencia",1]])};
    bindCtl(["ti-x","ti-m","ti-v"],run);run()}})};

// ---------- Trampa de pobreza
SIMS.trampa=function(){
  $("sim").innerHTML=`<p class="hint">k' = s·max(0, A·k^α − c̄) + (1 − δ)k: solo se ahorra lo que supera el consumo de subsistencia c̄.</p>${ctl("tp-s","Ahorro sobre el excedente s",0.1,0.6,0.01,0.4)}${ctl("tp-c","Subsistencia c̄",0,2,0.05,1.2)}${ctl("tp-a","α",0.2,0.6,0.01,0.4)}${ctl("tp-d","δ",0.02,0.2,0.01,0.05)}${ctl("tp-k","Capital inicial k₀",0.1,20,0.1,2)}${ctl("tp-x","Ayuda única en el año 5 (unidades de k)",0,15,0.5,0)}<div class="res" id="tp-res"></div><div id="tp-g"></div><div id="tp-o"></div>`;
  const run=()=>{const s=V("tp-s"),c=V("tp-c"),a=V("tp-a"),d=V("tp-d"),k0=V("tp-k"),x=V("tp-x"),A=1,F=k=>s*Math.max(0,A*Math.pow(k,a)-c)+(1-d)*k;
    const roots=[];let prev=F(1e-4)-1e-4;for(let i=1;i<=4000;i++){const k=i*0.02,v=F(k)-k;if(prev*v<0||v===0){let lo=k-0.02,hi=k;for(let j=0;j<60;j++){const m=(lo+hi)/2;(F(lo)-lo)*(F(m)-m)<=0?hi=m:lo=m}roots.push((lo+hi)/2)}prev=v}
    const kmax=Math.max(roots.length?roots[roots.length-1]*1.4:10,k0*1.3,6);const path=[];let k=k0;for(let t=0;t<=60;t++){if(t===5)k+=x;path.push([t,k]);k=F(k)}
    const kL=roots.length>=2?roots[0]:null,kH=roots.length?roots[roots.length-1]:null;
    $("tp-res").innerHTML=tl([["Umbral (equilibrio inestable)",kL!==null?d4(kL):"no hay"],["Equilibrio alto (estable)",kH!==null?d4(kH):"no hay"],["Capital en el año 60",d4(path[60][1]),"okt"],["Destino",kH!==null&&Math.abs(path[60][1]-kH)<0.05*kH?"sale de la trampa":"queda en la trampa",kH!==null&&Math.abs(path[60][1]-kH)<0.05*kH?"okt":"badt"]]);
    $("tp-g").innerHTML=`<div class="grid2">${plotXY({xr:[0,kmax],yr:[0,kmax],series:[{f:k=>k,col:"--muted",dash:"5 4"},{f:F,col:"--line"}],points:roots.map((r,i)=>({x:r,y:r,label:i===roots.length-1&&roots.length>1?"alto":roots.length>1?"umbral":"k*"})),xl:"k_t",yl:"k_(t+1)",label:"Dinámica del capital"})}${plotXY({xr:[0,60],yr:[0,Math.max(kmax,...path.map(p=>p[1]))],series:[{pts:path,col:"--exam"}],hlines:kL!==null?[{y:kL,col:"--muted"}]:[],vlines:x>0?[{x:5,col:"--good"}]:[],xl:"Años",yl:"k",label:"Trayectoria"})}</div>`;
    $("tp-o").innerHTML=stp(1,"Equilibrios múltiples",`<p>${kL!==null?`Por debajo de k = ${d4(kL)} el ahorro no alcanza a cubrir la depreciación y el capital se desvanece; por encima, la economía converge a ${d4(kH)}. Una ayuda que lleve el capital por encima del umbral tiene efecto permanente (el argumento de Sachs); una que se quede corta se disipa (y alimenta el escepticismo de Easterly).`:"Con estos parámetros no hay umbral: hay un solo equilibrio, como en Solow. Sube c̄ o baja s para que aparezca la trampa."}</p>`)};
  bindCtl(["tp-s","tp-c","tp-a","tp-d","tp-k","tp-x"],run);run()};

// ---------- Enfermedad holandesa
SIMS.enferm=function(){
  $("sim").innerHTML=`<p class="hint">Economía con manufactura transable (precio 1) y no transables (precio P_N, cuyo aumento es una apreciación real). Trabajo total 1, Q_T = L_T^a, Q_N = L_N^b. Los hogares gastan la fracción c de su ingreso, que incluye las rentas R del recurso, en no transables.</p>${ctl("eh-r","Rentas del recurso R",0,2,0.05,0.6)}${ctl("eh-c","Fracción del gasto en no transables c",0.2,0.8,0.05,0.5)}${ctl("eh-a","a (manufactura)",0.3,0.9,0.05,0.6)}${ctl("eh-b","b (no transables)",0.3,0.9,0.05,0.6)}<div class="res" id="eh-res"></div><div id="eh-g"></div><div id="eh-o"></div>`;
  const solve=(R,c,a,b)=>{let lo=1e-6,hi=1-1e-6;const f=LT=>{const LN=1-LT,QT=Math.pow(LT,a),QN=Math.pow(LN,b),PN=a*Math.pow(LT,a-1)/(b*Math.pow(LN,b-1));return PN*QN-c/(1-c)*(QT+R)};for(let i=0;i<80;i++){const m=(lo+hi)/2;f(m)>0?lo=m:hi=m}const LT=(lo+hi)/2,LN=1-LT;return{LT,QT:Math.pow(LT,a),PN:a*Math.pow(LT,a-1)/(b*Math.pow(LN,b-1)),w:a*Math.pow(LT,a-1)}};
  const run=()=>{const R=V("eh-r"),c=V("eh-c"),a=V("eh-a"),b=V("eh-b"),E0=solve(0,c,a,b),E1=solve(R,c,a,b),grid=[...Array(41)].map((_,i)=>i*0.05),S=grid.map(r=>solve(r,c,a,b));
    $("eh-res").innerHTML=tl([["Empleo en manufactura",`${pc(E0.LT)} → ${pc(E1.LT)}`,E1.LT<E0.LT?"badt":""],["Producción manufacturera",`${d4(E0.QT)} → ${d4(E1.QT)}`],["Precio relativo P_N (tasa de cambio real apreciada si sube)",`${d4(E0.PN)} → ${d4(E1.PN)}`]]);
    $("eh-g").innerHTML=`<div class="grid2">${plotXY({xr:[0,2],yr:[0,1],series:[{pts:grid.map((r,i)=>[r,S[i].LT]),col:"--line"}],vlines:[{x:R,col:"--muted"}],xl:"Rentas del recurso R",yl:"Empleo en manufactura",label:"Desindustrialización"})}${plotXY({xr:[0,2],yr:[0,Math.max(...S.map(e=>e.PN))*1.1],series:[{pts:grid.map((r,i)=>[r,S[i].PN]),col:"--exam"}],vlines:[{x:R,col:"--muted"}],xl:"Rentas del recurso R",yl:"P_N",label:"Apreciación real"})}</div>`;
    $("eh-o").innerHTML=stp(1,"El efecto gasto",`<p>Las rentas del recurso aumentan el gasto. La parte que va a bienes transables se cubre con importaciones a precio dado, pero la que va a no transables solo puede atenderse produciendo más localmente: su precio relativo sube (apreciación real) y el trabajo se desplaza de la manufactura. Con R = ${fm(R)}, la manufactura pasa de emplear ${pc(E0.LT)} a ${pc(E1.LT)} del trabajo. Si la manufactura es la fuente del aprendizaje y la productividad, esta reasignación reduce el crecimiento futuro: la maldición de los recursos.</p>`)};
  bindCtl(["eh-r","eh-c","eh-a","eh-b"],run);run()};

// ---------- Clústeres: cociente de localización
SIMS.cluster=function(){
  $("sim").innerHTML=`<p class="hint">Empleo por sector en una región y en el país. Datos ficticios; reemplázalos con los de la región que estudies.</p><div class="calcf">${tarea("cl-d","Sector; empleo regional; empleo nacional (una línea por sector)","Textil y confección; 95000; 420000\nAgroindustria; 40000; 900000\nConstrucción; 110000; 1300000\nServicios de salud; 60000; 700000\nTIC y software; 35000; 210000\nTurismo; 30000; 500000\nOtros; 630000; 8000000",7)}</div><div id="cl-o"></div>`;
  const run=()=>{const D=$("cl-d").value.split("\n").map(l=>l.split(/;|\t/)).filter(p=>p.length>=3).map(p=>({s:p[0].trim(),r:+p[1].replace(/[^\d.]/g,""),n:+p[2].replace(/[^\d.]/g,"")})).filter(x=>isFinite(x.r)&&isFinite(x.n)&&x.n>0);
    if(D.length<2){$("cl-o").innerHTML=err("escribe al menos dos sectores con «sector; regional; nacional».");return}const R=D.reduce((s,x)=>s+x.r,0),Nn=D.reduce((s,x)=>s+x.n,0);D.forEach(x=>{x.sr=x.r/R;x.sn=x.n/Nn;x.cl=x.sr/x.sn});
    const HH=D.reduce((s,x)=>s+x.sr*x.sr,0),K=D.reduce((s,x)=>s+Math.abs(x.sr-x.sn),0);D.sort((a,b)=>b.cl-a.cl);
    $("cl-o").innerHTML=tl([["Sectores con CL > 1",String(D.filter(x=>x.cl>1).length),"okt"],["Herfindahl regional",d4(HH)],["Índice de especialización de Krugman",d4(K)]])
      +stp(1,"Cocientes de localización",`<div class="tbl"><table><tr><th>Sector</th><th>Participación regional</th><th>Participación nacional</th><th>CL</th><th>Lectura</th></tr>${D.map(x=>`<tr${x.cl>1.25?' class="hl"':""}><td>${esc(x.s)}</td><td>${pc(x.sr)}</td><td>${pc(x.sn)}</td><td><b>${d2(x.cl)}</b></td><td>${x.cl>1.25?"especialización: candidato a clúster":x.cl>1?"leve especialización":"menos presente que en el país"}</td></tr>`).join("")}</table></div><div class="eq al">CL = (e_ir/e_r)/(E_i/E); ejemplo: ${esc(D[0].s)} = ${pc(D[0].sr)}/${pc(D[0].sn)} = ${d2(D[0].cl)}</div><p class="hint">Un CL alto es solo el primer filtro: un clúster requiere además empresas relacionadas, proveedores especializados, instituciones de apoyo y rivalidad (el diamante de Porter). El índice de Krugman va de 0 (estructura igual a la del país) a 2.</p>`)};
  onIn(["cl-d"],run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Medición","IDH","(I_salud·I_educ·I_ingreso)^(1/3); I_ingreso = (ln INB − ln 100)/(ln 75 000 − ln 100)"],["Pobreza","FGT","Pα = (1/n)·Σ_(y<z) ((z − y)/z)^α; α = 0, 1, 2"],["Pobreza","Costo de cerrar la brecha","P₁·z·n"],["Desigualdad","Gini","G = 2Σ i·y₍ᵢ₎/(nΣy) − (n + 1)/n"],["Desigualdad","Theil","T = (1/n)Σ(yᵢ/μ)ln(yᵢ/μ)"],["Desigualdad","Atkinson","A = 1 − y_EDE/μ"],["Desigualdad","Palma","Ingreso del 10 % más rico / ingreso del 40 % más pobre"],["Demografía","Malthus","y = A·N^(β−1); ΔN/N = θ(y − ȳ)"],
    ["Crecimiento","Harrod-Domar","g = s/v − δ; s requerido = v(g* + δ)"],["Crecimiento","Solow","k* = (s/(n + g + δ))^(1/(1−α)); y* = k*^α"],["Crecimiento","Regla de oro","s = α"],["Crecimiento","Velocidad de convergencia","λ = (1 − α)(n + g + δ); vida media = ln 2/λ"],["Crecimiento","AK","g = sA − δ − n"],["Crecimiento","Romer","Ȧ/A = δ·L_A"],["Convergencia","Regresión β","g = a + β ln y₀ (+ γX); λ = −ln(1 + βT)/T"],
    ["Encadenamientos","Rasmussen","BL_j = (Σᵢ bᵢⱼ)/media; FL_i = (Σⱼ bᵢⱼ)/media, con B = (I − A)⁻¹"],["Dualismo","Lewis","(1 − α)A(K/L)^α = w̄; inversión = s·αY"],["Estructuralismo","Thirlwall","g_B = εz/π"],["Localización","Cociente de localización","CL = (e_ir/e_r)/(E_i/E)"],["Localización","Krugman","Σ|s_ir − s_in|"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Gini"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
