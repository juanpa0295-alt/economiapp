// Economía Internacional · laboratorios interactivos
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


// ===================== LABORATORIOS DE ECONOMÍA INTERNACIONAL =====================
const d2=v=>isFinite(v)?fmt(Math.abs(v)<5e-4?0:v,2).replace(/^-/,"−"):"—",d4=v=>isFinite(v)?fmt(Math.abs(v)<5e-6?0:v,4).replace(/^-/,"−"):"—",pc=v=>isFinite(v)?d2(v*100)+" %":"—",m0=v=>isFinite(v)?fmt(Math.round(v),0).replace(/^-/,"−"):"—";
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const tarea=(id,l,v,rows=3)=>`<label for="${id}">${l}<textarea id="${id}" rows="${rows}" spellcheck="false" style="width:100%;font-family:var(--f-mono)">${v}</textarea></label>`;
const lines=s=>String(s).split("\n").map(l=>l.split(/;|\t/).map(x=>x.trim())).filter(p=>p.length&&p[0]!=="");
const num=x=>{const v=+String(x??"").replace(/\s/g,"").replace(/,/g,".");return isFinite(v)?v:NaN};
const bis=(f,lo,hi,it=80)=>{let flo=f(lo);for(let i=0;i<it;i++){const m=(lo+hi)/2,fm_=f(m);if(flo*fm_<=0)hi=m;else{lo=m;flo=fm_}}return(lo+hi)/2};

// ---------- Ricardo
SIMS.ricardo=function(){
  $("sim").innerHTML=`<p class="hint">Horas de trabajo por unidad. Ejemplo de Krugman y Obstfeld: queso y vino.</p><div class="calcf">${nin("ri-q","Local: horas por queso a_LQ",1,"0.1")}${nin("ri-v","Local: horas por vino a_LV",2,"0.1")}${nin("ri-l","Local: trabajadores L",1000)}${nin("ri-q2","Extranjero: horas por queso a*_LQ",6,"0.1")}${nin("ri-v2","Extranjero: horas por vino a*_LV",3,"0.1")}${nin("ri-l2","Extranjero: trabajadores L*",1000)}${nin("ri-p","Precio relativo mundial del queso P_Q/P_V",1,"0.05")}</div><div class="res" id="ri-res"></div><div id="ri-gr"></div><div id="ri-o"></div>`;
  const run=()=>{const[aq,av,L,aq2,av2,L2,p]=["ri-q","ri-v","ri-l","ri-q2","ri-v2","ri-l2","ri-p"].map(N);if(![aq,av,L,aq2,av2,L2,p].every(x=>x>0)){$("ri-res").innerHTML=err("todos los valores deben ser positivos.");return}
    const pa=aq/av,pa2=aq2/av2,local=pa<pa2?"queso":"vino",lo=Math.min(pa,pa2),hi=Math.max(pa,pa2),dentro=p>lo&&p<hi,wq=1/aq,wv=1/av;
    const espL=pa<pa2?(p>pa?"queso":"vino"):(p<pa?"vino":"queso"),espE=pa<pa2?(p<pa2?"vino":"queso"):(p>pa2?"queso":"vino");
    const ww=pa<pa2?(p/aq)/(1/av2):(1/av)/(p/aq2);
    $("ri-res").innerHTML=tl([["Precio de autarquía en Local",d4(pa)+" vinos por queso"],["En Extranjero",d4(pa2)],["Ventaja comparativa de Local",local,"okt"],["El precio mundial está",dentro?"entre los de autarquía: ambos ganan":"fuera del rango: un país no gana",dentro?"okt":"badt"],["Salario relativo w/w* (con especialización completa)",dentro?d4(ww):"—"]]);
    const Qm=L/aq,Vm=L/av;let cons="";if(dentro){if(espL==="queso"){cons=`Local produce ${m0(Qm)} quesos y puede cambiarlos por hasta ${m0(Qm*p)} vinos (antes podía producir solo ${m0(Vm)}).`}else{cons=`Local produce ${m0(Vm)} vinos y puede cambiarlos por hasta ${m0(Vm/p)} quesos (antes podía producir solo ${m0(Qm)}).`}}
    const xm=Math.max(Qm,espL==="vino"&&dentro?Vm/p:0)*1.1,ym=Math.max(Vm,espL==="queso"&&dentro?Qm*p:0)*1.1;
    $("ri-gr").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{pts:[[0,Vm],[Qm,0]],col:"--line"},...(dentro?[espL==="queso"?{pts:[[Qm,0],[0,Qm*p]],col:"--good",dash:"6 4"}:{pts:[[0,Vm],[Vm/p,0]],col:"--good",dash:"6 4"}]:[])],xl:"Queso",yl:"Vino",label:"Local: posibilidades de producción y de consumo"})+legend([["--line","Frontera de posibilidades de producción"],["--good","Posibilidades de consumo con comercio",1]]);
    $("ri-o").innerHTML=stp(1,"Ventaja comparativa",`<div class="eq al">Local: a_LQ/a_LV = ${d2(aq)}/${d2(av)} = ${d4(pa)} · Extranjero: ${d2(aq2)}/${d2(av2)} = ${d4(pa2)}<br>${d4(pa)} ${pa<pa2?"<":">"} ${d4(pa2)} ⟹ Local tiene ventaja comparativa en <b>${local}</b>${aq<aq2&&av<av2?", aunque es más productivo en ambos bienes (ventaja absoluta en los dos)":""}.</div>`)
      +stp(2,"Especialización y ganancias",dentro?`<p>Con P_Q/P_V = ${d2(p)}, Local se especializa en ${espL} y Extranjero en ${espE}. ${cons} Una hora de trabajo en Local rinde ${pa<pa2?`${d4(1/aq)} quesos = ${d4(p/aq)} vinos vía comercio, frente a ${d4(1/av)} vinos produciéndolos directamente`:`${d4(1/av)} vinos = ${d4(1/(av*p))} quesos vía comercio, frente a ${d4(1/aq)} quesos directamente`}.</p><p class="hint">El salario relativo ${d4(ww)} queda entre las productividades relativas en cada bien: ${d4(aq2/aq)} en queso y ${d4(av2/av)} en vino.</p>`:`<p>Con un precio fuera del rango [${d4(lo)}, ${d4(hi)}] ambos países querrían producir el mismo bien: no es un equilibrio. El precio mundial debe quedar entre los de autarquía.</p>`)};
  onIn(["ri-q","ri-v","ri-l","ri-q2","ri-v2","ri-l2","ri-p"],run);run()};

// ---------- DFS
SIMS.dfs=function(){
  $("sim").innerHTML=`<p class="hint">A(z) = A₀·e^(−γ(z − ½)): productividad relativa de Local en el bien z, decreciente. B(z) = [z/(1 − z)]·(L*/L).</p>${ctl("df-a","A₀ (ventaja tecnológica media de Local)",0.3,4,0.05,1.5)}${ctl("df-g","γ (dispersión de las ventajas)",0.5,6,0.1,3)}${ctl("df-l","L*/L",0.2,5,0.05,1)}<div class="res" id="df-res"></div><div id="df-gr"></div><div id="df-o"></div>`;
  const run=()=>{const A0=V("df-a"),g=V("df-g"),r=V("df-l"),A=z=>A0*Math.exp(-g*(z-0.5)),B=z=>z/(1-z)*r,z=bis(x=>A(x)-B(x),1e-6,1-1e-6),w=A(z);
    $("df-res").innerHTML=tl([["Bienes que produce Local z̃",pc(z),"okt"],["Salario relativo ω = w/w*",d4(w),"okt"],["Ingreso de Local / mundial",pc(z)]]);
    $("df-gr").innerHTML=plotXY({xr:[0,1],yr:[0,Math.max(A(0),4)*1.05],series:[{f:A,col:"--line"},{f:x=>x<0.995?B(x):NaN,col:"--exam"}],points:[{x:z,y:w,label:"equilibrio"}],xl:"Bien z",yl:"ω",label:"Dornbusch-Fischer-Samuelson"})+legend([["--line","A(z): productividad relativa"],["--exam","B(z): equilibrio de la balanza"]]);
    $("df-o").innerHTML=stp(1,"Equilibrio",`<p>Local produce los bienes z &lt; ${d4(z)} (aquellos donde su ventaja relativa A(z) supera el salario relativo ω = ${d4(w)}) y Extranjero el resto. Prueba: sube L*/L (Extranjero más grande) y verás que Local se especializa en menos bienes con un salario relativo mayor; sube A₀ (progreso técnico uniforme en Local) y el salario relativo de Local aumenta.</p>`)};
  bindCtl(["df-a","df-g","df-l"],run);run()};

// ---------- Factores específicos
SIMS.especificos=function(){
  $("sim").innerHTML=`<p class="hint">Q_M = K^0,5·L_M^0,5 · Q_A = T^0,5·L_A^0,5 · L_M + L_A = 100. El trabajo se mueve hasta igualar el salario.</p>${ctl("sf-pm","Precio de las manufacturas P_M",0.5,3,0.05,1)}${ctl("sf-pa","Precio de los alimentos P_A",0.5,3,0.05,1)}${ctl("sf-k","Capital K",20,200,5,100)}${ctl("sf-t","Tierra T",20,200,5,100)}${ctl("sf-x","Aumento de P_M para comparar (%)",0,100,5,20)}<div class="res" id="sf-res"></div><div id="sf-gr"></div><div id="sf-o"></div>`;
  const eq=(pm,pa,K,T)=>{const LM=bis(l=>pm*0.5*Math.sqrt(K/l)-pa*0.5*Math.sqrt(T/(100-l)),1e-6,100-1e-6),w=pm*0.5*Math.sqrt(K/LM),rK=pm*0.5*Math.sqrt(LM/K),rT=pa*0.5*Math.sqrt((100-LM)/T);return{LM,w,rK,rT}};
  const run=()=>{const pm=V("sf-pm"),pa=V("sf-pa"),K=V("sf-k"),T=V("sf-t"),x=V("sf-x")/100,E0=eq(pm,pa,K,T),E1=eq(pm*(1+x),pa,K,T),ch=(a,b)=>b/a-1;
    $("sf-res").innerHTML=tl([["Trabajo en manufactura",`${d2(E0.LM)} → ${d2(E1.LM)}`],["Salario nominal",`${pc(ch(E0.w,E1.w))}`],["Renta del capital",pc(ch(E0.rK,E1.rK)),"okt"],["Renta de la tierra",pc(ch(E0.rT,E1.rT)),"badt"],["Salario real en alimentos / en manufacturas",`${pc(ch(E0.w,E1.w))} / ${pc((E1.w/(pm*(1+x)))/(E0.w/pm)-1)}`]]);
    $("sf-gr").innerHTML=plotXY({xr:[0,100],yr:[0,Math.max(E0.w,E1.w)*2.2],series:[{f:l=>l>0.5?pm*0.5*Math.sqrt(K/l):NaN,col:"--line"},{f:l=>l>0.5?pm*(1+x)*0.5*Math.sqrt(K/l):NaN,col:"--line",dash:"6 4"},{f:l=>l<99.5?pa*0.5*Math.sqrt(T/(100-l)):NaN,col:"--exam"}],points:[{x:E0.LM,y:E0.w,label:"1"},{x:E1.LM,y:E1.w,label:"2",col:"--good"}],xl:"L_M (de izquierda a derecha); L_A (de derecha a izquierda)",yl:"Salario",label:"Asignación del trabajo"})+legend([["--line","P_M·PMgL_M"],["--line","Con P_M más alto",1],["--exam","P_A·PMgL_A"]]);
    $("sf-o").innerHTML=stp(1,"Efectos de subir P_M en "+pc(x),`<p>El trabajo se desplaza a la manufactura (de ${d2(E0.LM)} a ${d2(E1.LM)}). El salario sube ${pc(ch(E0.w,E1.w))}, <b>menos</b> que el precio de las manufacturas: el poder de compra del trabajador sube en alimentos y baja en manufacturas, así que su ganancia es ambigua. El dueño del capital gana sin ambigüedad (${pc(ch(E0.rK,E1.rK))}) y el de la tierra pierde (${pc(ch(E0.rT,E1.rT))}).</p>`)};
  bindCtl(["sf-pm","sf-pa","sf-k","sf-t","sf-x"],run);run()};

// ---------- Heckscher-Ohlin con coeficientes fijos
SIMS.ho=function(){
  $("sim").innerHTML=`<p class="hint">Coeficientes fijos: a_ij = unidades del factor i por unidad del bien j. X (telas) intensivo en trabajo; Y (máquinas) intensivo en capital.</p><div class="calcf">${nin("ho-lx","a_LX",2,"0.1")}${nin("ho-kx","a_KX",1,"0.1")}${nin("ho-ly","a_LY",1,"0.1")}${nin("ho-ky","a_KY",3,"0.1")}${nin("ho-L","Dotación de trabajo L",200)}${nin("ho-K","Dotación de capital K",250)}${nin("ho-px","Precio P_X",10,"0.5")}${nin("ho-py","Precio P_Y",15,"0.5")}${nin("ho-dk","Aumento del capital (%)",10,"1")}${nin("ho-dp","Aumento de P_Y (%)",10,"1")}</div><div class="res" id="ho-res"></div><div id="ho-o"></div>`;
  const sol=(a,b,c,d,e,f)=>{const D=a*d-b*c;return[(e*d-b*f)/D,(a*f-e*c)/D,D]};
  const run=()=>{const[lx,kx,ly,ky,L,K,px,py,dk,dp]=["ho-lx","ho-kx","ho-ly","ho-ky","ho-L","ho-K","ho-px","ho-py","ho-dk","ho-dp"].map(N);
    const[X,Y,D]=sol(lx,ly,kx,ky,L,K),[w,r]=sol(lx,kx,ly,ky,px,py),[X2,Y2]=sol(lx,ly,kx,ky,L,K*(1+dk/100)),[w2,r2]=sol(lx,kx,ly,ky,px,py*(1+dp/100)),intX=kx/lx<ky/ly?"trabajo":"capital";
    const div=X>0&&Y>0,pos=w>0&&r>0;
    $("ho-res").innerHTML=tl([["Producción de X",d2(X),div?"okt":"badt"],["Producción de Y",d2(Y),div?"okt":"badt"],["Salario w",d2(w),pos?"okt":"badt"],["Renta r",d2(r),pos?"okt":"badt"],["X es intensivo en",intX]]);
    $("ho-o").innerHTML=(!div?`<p class="err">Con estas dotaciones la economía no se diversifica (una producción sale negativa): fuera del cono de diversificación, se especializa en un bien.</p>`:"")+(!pos?`<p class="err">Con estos precios un precio de factor sale negativo: la economía no produciría ambos bienes.</p>`:"")
      +stp(1,"Pleno empleo y precios igual a costos",`<div class="eq al">${d2(lx)}X + ${d2(ly)}Y = ${d2(L)} · ${d2(kx)}X + ${d2(ky)}Y = ${d2(K)} ⟹ X = ${d2(X)}, Y = ${d2(Y)}<br>${d2(lx)}w + ${d2(kx)}r = ${d2(px)} · ${d2(ly)}w + ${d2(ky)}r = ${d2(py)} ⟹ w = ${d2(w)}, r = ${d2(r)}</div>`)
      +stp(2,"Rybczynski: K sube "+pc(dk/100),`<div class="eq al">X: ${d2(X)} → ${d2(X2)} (${pc(X2/X-1)}) · Y: ${d2(Y)} → ${d2(Y2)} (${pc(Y2/Y-1)})</div><p>A precios constantes, la producción del bien intensivo en capital crece más que el capital (${pc(dk/100)}) y la del otro cae: efecto magnificación. Los precios de los factores no cambian.</p>`)
      +stp(3,"Stolper-Samuelson: P_Y sube "+pc(dp/100),`<div class="eq al">w: ${d2(w)} → ${d2(w2)} (${pc(w2/w-1)}) · r: ${d2(r)} → ${d2(r2)} (${pc(r2/r-1)})</div><p>El factor usado intensivamente en Y ${intX==="trabajo"?"(capital)":"(trabajo)"} gana más que proporcionalmente al aumento del precio y el otro pierde en términos absolutos. Si este país es abundante en capital y exporta Y, la apertura beneficia al capital y perjudica al trabajo.</p>`)};
  onIn(["ho-lx","ho-kx","ho-ly","ho-ky","ho-L","ho-K","ho-px","ho-py","ho-dk","ho-dp"],run);run()};

// ---------- Modelo estándar
SIMS.estandar=function(){
  $("sim").innerHTML=`<p class="hint">Oferta relativa mundial de alimentos sobre manufacturas: RS = s·p^ε · demanda relativa: RD = p^(−σ), con p = P_A/P_M. Colombia exporta alimentos.</p>${ctl("st-e","Elasticidad de la oferta relativa ε",0.1,3,0.1,1)}${ctl("st-s","Elasticidad de la demanda relativa σ",0.1,3,0.1,1)}${ctl("st-g","Crecimiento sesgado: aumento de la oferta relativa de alimentos (%)",-50,100,5,30)}${ctl("st-x","Participación de Colombia en la oferta mundial de alimentos (%)",1,80,1,10)}<div class="res" id="st-res"></div><div id="st-gr"></div><div id="st-o"></div>`;
  const run=()=>{const e=V("st-e"),s=V("st-s"),g=V("st-g")/100,sh=V("st-x")/100,s1=1+g*sh,p0=1,p1=Math.pow(1/s1,1/(e+s));
    $("st-res").innerHTML=tl([["Aumento de la oferta relativa mundial",pc(s1-1)],["Cambio de los términos de intercambio de Colombia",pc(p1-1),p1<1?"badt":"okt"]]);
    $("st-gr").innerHTML=plotXY({xr:[0,2.5],yr:[0,2.5],series:[{f:q=>Math.pow(q,1/e),col:"--line"},{f:q=>Math.pow(q/s1,1/e),col:"--line",dash:"6 4"},{f:q=>Math.pow(q,-1/s),col:"--exam"}],points:[{x:1,y:1,label:"1"},{x:Math.pow(p1,-s),y:p1,label:"2",col:"--good"}],xl:"Cantidad relativa de alimentos",yl:"p = P_A/P_M",label:"Oferta y demanda relativas"})+legend([["--line","RS"],["--line","RS tras el crecimiento",1],["--exam","RD"]]);
    $("st-o").innerHTML=stp(1,"Crecimiento y términos de intercambio",`<div class="eq al">p = (1/s)^(1/(ε + σ)) ⟹ p₁ = (1/${d4(s1)})^(1/${d2(e+s)}) = ${d4(p1)}</div><p>${g>0?"El crecimiento sesgado hacia lo que Colombia exporta aumenta la oferta relativa mundial de alimentos y empeora sus términos de intercambio; el efecto es mayor cuanto más grande es su participación en el mercado y cuanto menos elásticas son la oferta y la demanda relativas. Si el deterioro supera la ganancia de producir más, aparece el crecimiento empobrecedor de Bhagwati.":"Una caída de la oferta relativa de lo que Colombia exporta (por ejemplo, el crecimiento sesgado hacia las importaciones) mejora sus términos de intercambio."}</p>`)};
  bindCtl(["st-e","st-s","st-g","st-x"],run);run()};

// ---------- Gravedad
SIMS.gravedad=function(){
  $("sim").innerHTML=`<p class="hint">Datos ficticios para practicar: PIB del socio (miles de millones de USD), distancia desde el país de origen (km) y comercio observado (millones de USD). PIB del país de origen: el valor del campo.</p><div class="calcf">${nin("gv-y","PIB del país de origen",350,"10")}${tarea("gv-d","Socio; PIB; distancia; comercio observado","Vecino A; 450; 1000; 5200\nVecino B; 250; 1500; 2100\nPotencia C; 25000; 4000; 28000\nBloque D; 18000; 9000; 9500\nAsia E; 17000; 15000; 6500\nIsla F; 60; 2500; 300\nLejano G; 2000; 12000; 700",7)}</div><div class="res" id="gv-res"></div><div id="gv-gr"></div><div id="gv-o"></div>`;
  const run=()=>{const Y0=N("gv-y"),D=lines($("gv-d").value).map(p=>({n:p[0],y:num(p[1]),d:num(p[2]),t:num(p[3])})).filter(x=>x.y>0&&x.d>0&&x.t>0);if(D.length<3||!(Y0>0)){$("gv-res").innerHTML=err("escribe al menos tres socios con valores positivos.");return}
    const yv=D.map(x=>Math.log(x.t)-Math.log(Y0*x.y)),xv=D.map(x=>Math.log(x.d)),n=D.length,mx=xv.reduce((a,b)=>a+b,0)/n,my=yv.reduce((a,b)=>a+b,0)/n,b=xv.reduce((s,x,i)=>s+(x-mx)*(yv[i]-my),0)/xv.reduce((s,x)=>s+(x-mx)**2,0),a=my-b*mx,th=-b,r2=1-yv.reduce((s,y,i)=>s+(y-a-b*xv[i])**2,0)/yv.reduce((s,y)=>s+(y-my)**2,0);
    D.forEach(x=>{x.p=Math.exp(a)*Y0*x.y/Math.pow(x.d,th);x.r=x.t/x.p});
    $("gv-res").innerHTML=tl([["Elasticidad a la distancia θ",d2(th),"okt"],["Constante A",d4(Math.exp(a))],["R²",d4(r2)]]);
    $("gv-gr").innerHTML=plotXY({xr:[Math.min(...xv)-.2,Math.max(...xv)+.2],yr:[Math.min(...yv)-.5,Math.max(...yv)+.5],series:[{f:x=>a+b*x,col:"--exam"}],points:D.map((x,i)=>({x:xv[i],y:yv[i],label:x.n})),xl:"ln distancia",yl:"ln(T/(Y·Y*))",label:"Ecuación de gravedad"});
    $("gv-o").innerHTML=stp(1,"Estimación",`<div class="eq al">ln(T/(Yᵢ·Yⱼ)) = ${d4(a)} − ${d4(th)}·ln D · R² = ${d4(r2)}</div><p>Un aumento de 1 % en la distancia reduce el comercio en ${d2(th)} %. En los estudios empíricos esta elasticidad suele estar cerca de 1.</p>`)
      +stp(2,"Comercio observado frente al predicho",`<div class="tbl"><table><tr><th>Socio</th><th>Observado</th><th>Predicho</th><th>Observado/predicho</th></tr>${D.map(x=>`<tr><td>${esc(x.n)}</td><td>${m0(x.t)}</td><td>${m0(x.p)}</td><td${x.r>1.5||x.r<0.67?' style="font-weight:700;color:var(--exam)"':""}>${d2(x.r)}</td></tr>`).join("")}</table></div><p class="hint">Los socios con comercio muy por encima de lo predicho suelen compartir frontera, idioma o un acuerdo comercial; los que están por debajo enfrentan barreras.</p>`)};
  onIn(["gv-y","gv-d"],run);run()};

// ---------- Competencia monopolística
SIMS.cm=function(){
  $("sim").innerHTML=`<p class="hint">Ejemplo de Krugman y Obstfeld (automóviles): F = 750 millones, c = 5 000, b = 1/30 000. Ventas anuales: Local 900 000 y Extranjero 1 600 000.</p><div class="calcf">${nin("cm-f","Costo fijo F",750000000,"1000000")}${nin("cm-c","Costo marginal c",5000,"100")}${nin("cm-b","1/b (sensibilidad de la demanda)",30000,"1000")}${nin("cm-s1","Tamaño del mercado de Local S₁",900000,"10000")}${nin("cm-s2","Tamaño del mercado de Extranjero S₂",1600000,"10000")}</div><div class="res" id="cm-res"></div><div id="cm-gr"></div><div id="cm-o"></div>`;
  const run=()=>{const F=N("cm-f"),c=N("cm-c"),ib=N("cm-b"),S1=N("cm-s1"),S2=N("cm-s2");if(![F,ib,S1,S2].every(x=>x>0)){$("cm-res").innerHTML=err("valores positivos.");return}const b=1/ib,eq=S=>{const n=Math.sqrt(S/(b*F));return{n,P:c+1/(b*n),q:S/n,AC:F*n/S+c}},E1=eq(S1),E2=eq(S2),EI=eq(S1+S2);
    $("cm-res").innerHTML=tl([["Empresas en Local / Extranjero",`${d2(E1.n)} / ${d2(E2.n)}`],["Empresas en el mercado integrado",d2(EI.n),"okt"],["Precio en Local antes y después",`${m0(E1.P)} → ${m0(EI.P)}`,"okt"],["Producción por empresa",`${m0(E1.q)} → ${m0(EI.q)}`]]);
    const nm=Math.max(E1.n,E2.n,EI.n)*1.8;$("cm-gr").innerHTML=plotXY({xr:[1,nm],yr:[c,c+1/(b*1)*0.6],series:[{f:n=>c+1/(b*n),col:"--exam"},{f:n=>F*n/S1+c,col:"--line"},{f:n=>F*n/(S1+S2)+c,col:"--good"}],points:[{x:E1.n,y:E1.P,label:"Local"},{x:EI.n,y:EI.P,label:"Integrado",col:"--good"}],xl:"Número de empresas n",yl:"Precio y costo medio",label:"Competencia monopolística"})+legend([["--exam","P = c + 1/(bn)"],["--line","CMe en Local"],["--good","CMe en el mercado integrado"]]);
    $("cm-o").innerHTML=stp(1,"Equilibrio: P = CMe",`<div class="eq al">nF/S + c = c + 1/(bn) ⟹ n = √(S/(bF))<br>Local: n = √(${m0(S1)}·${m0(ib)}/${m0(F)}) = ${d2(E1.n)} · P = ${m0(c)} + ${m0(ib)}/${d2(E1.n)} = ${m0(E1.P)}<br>Integrado: n = ${d2(EI.n)} · P = ${m0(EI.P)}</div><p>Al integrarse, el mercado es más grande: hay más variedades en total (${d2(EI.n)} frente a ${d2(E1.n)} en Local y ${d2(E2.n)} en Extranjero por separado), cada empresa produce más y el precio baja porque el costo fijo se reparte entre más unidades. Las ganancias del comercio vienen de la escala, no de la ventaja comparativa.</p>`)};
  onIn(["cm-f","cm-c","cm-b","cm-s1","cm-s2"],run);run()};

// ---------- Dumping recíproco
SIMS.dumping=function(){
  $("sim").innerHTML=`<p class="hint">Dos países idénticos con demanda P = a − Q, una empresa en cada uno con costo marginal c, y costo de transporte t por unidad exportada. Competencia de Cournot en cada mercado.</p>${ctl("dm-a","a",50,200,5,100)}${ctl("dm-c","c",0,60,1,20)}${ctl("dm-t","Costo de transporte t",0,45,1,10)}<div class="res" id="dm-res"></div><div id="dm-o"></div>`;
  const run=()=>{const a=V("dm-a"),c=V("dm-c"),t=V("dm-t"),qh=(a-c+t)/3,qf=Math.max(0,(a-c-2*t)/3),qhh=qf>0?qh:(a-c)/2,P=a-qhh-qf,pi_h=(P-c)*qhh,pi_f=(P-c-t)*qf,cs=(qhh+qf)**2/2,Pm=(a+c)/2,csm=((a-c)/2)**2/2,pim=((a-c)/2)**2,W=cs+pi_h+pi_f,Wm=csm+pim;
    $("dm-res").innerHTML=tl([["Ventas de la empresa local en casa",d2(qhh)],["Exportaciones de la extranjera",d2(qf),qf>0?"okt":"badt"],["Precio",d2(P)],["Precio neto que recibe el exportador",d2(P-t)],["Bienestar por país: con comercio / monopolio",`${d2(W)} / ${d2(Wm)}`,W>Wm?"okt":"badt"]]);
    $("dm-o").innerHTML=stp(1,"Cournot en el mercado local",`<div class="eq al">Empresa local (costo c): q_h = (a − c + t)/3 = ${d2(qh)}<br>Empresa extranjera (costo c + t): q_f = (a − c − 2t)/3 = ${d2((a-c-2*t)/3)}${qf===0?" ⟹ no exporta: el transporte es demasiado caro (t ≥ (a − c)/2)":""}<br>P = a − q_h − q_f = ${d2(P)}</div><p>${qf>0?`Por simetría, la empresa local también exporta ${d2(qf)} al mercado extranjero: hay comercio en dos sentidos del <b>mismo bien</b>. Cada empresa recibe en el exterior ${d2(P-t)} neto de transporte, menos que los ${d2(P)} de su mercado: eso es dumping.`:"Sin exportaciones, cada empresa es monopolista en su país."}</p><p>Bienestar de cada país: excedente del consumidor ${d2(cs)} + beneficios ${d2(pi_h+pi_f)} = ${d2(W)}, frente a ${d2(Wm)} con monopolio. ${W>Wm?"La mayor competencia compensa los costos de transporte.":"Los costos de transporte desperdiciados superan la ganancia de competencia."}</p>`)};
  bindCtl(["dm-a","dm-c","dm-t"],run);run()};

// ---------- Migración
SIMS.migracion=function(){
  $("sim").innerHTML=`<p class="hint">Producto marginal del trabajo lineal: Local w = A − b·L; Extranjero w* = A* − b*·L*. Hay 100 trabajadores en total.</p>${ctl("mg-a","A (Local)",50,150,1,100)}${ctl("mg-b","b (Local)",0.2,2,0.05,1)}${ctl("mg-a2","A* (Extranjero)",50,150,1,80)}${ctl("mg-b2","b* (Extranjero)",0.2,2,0.05,1)}${ctl("mg-l","Trabajadores inicialmente en Local",5,95,1,30)}<div class="res" id="mg-res"></div><div id="mg-gr"></div><div id="mg-o"></div>`;
  const run=()=>{const A=V("mg-a"),b=V("mg-b"),A2=V("mg-a2"),b2=V("mg-b2"),L0=V("mg-l"),w=L=>A-b*L,w2=L=>A2-b2*(100-L),Le=Math.max(0,Math.min(100,(A-A2+100*b2)/(b+b2))),we=w(Le),Y=L=>A*L-b*L*L/2+A2*(100-L)-b2*(100-L)**2/2,gain=Y(Le)-Y(L0);
    $("mg-res").innerHTML=tl([["Salario inicial Local / Extranjero",`${d2(w(L0))} / ${d2(w2(L0))}`],["Trabajadores en Local tras la migración",d2(Le),"okt"],["Salario común",d2(we)],["Ganancia de producción mundial",d2(gain),"okt"]]);
    $("mg-gr").innerHTML=plotXY({xr:[0,100],yr:[0,Math.max(A,A2)*1.05],series:[{f:w,col:"--line"},{f:w2,col:"--exam"}],vlines:[{x:L0,col:"--muted"}],points:[{x:Le,y:we,label:"equilibrio"}],areas:[{pts:Le>L0?[[L0,w(L0)],[Le,we],[L0,w2(L0)]]:[[L0,w(L0)],[Le,we],[L0,w2(L0)]],col:"--good",op:.35}],xl:"Trabajadores en Local (de izquierda a derecha)",yl:"Salario real",label:"Migración internacional"})+legend([["--line","PMgL en Local"],["--exam","PMgL en Extranjero"],["--good","Ganancia mundial"]]);
    $("mg-o").innerHTML=stp(1,"Quién gana y quién pierde",`<p>${Le>L0?`Migran ${d2(Le-L0)} trabajadores hacia Local. Su salario baja de ${d2(w(L0))} a ${d2(we)} para los trabajadores locales (pierden), y sube de ${d2(w2(L0))} a ${d2(we)} para los que se quedan en Extranjero (ganan). Los dueños de los otros factores en Local ganan; en Extranjero pierden.`:`Migran ${d2(L0-Le)} trabajadores hacia Extranjero. El salario converge a ${d2(we)}.`} La producción mundial crece en ${d2(gain)} (el triángulo sombreado) porque el trabajo se mueve hacia donde es más productivo.</p>`)};
  bindCtl(["mg-a","mg-b","mg-a2","mg-b2","mg-l"],run);run()};

// ---------- Aranceles
SIMS.arancel=function(){
  $("sim").innerHTML=tabsBox("ar",[["ar","Arancel"],["tpe","Protección efectiva"]]);const B=$("ar-b");
  tabsRun("ar",{
   ar(){B.innerHTML=`<p class="hint">Demanda Q_d = a − bP; oferta interna Q_s = c + dP. En un país grande, el arancel baja el precio mundial en una fracción φ del arancel.</p>${ctl("ta-a","a",100,300,5,200)}${ctl("ta-b","b",1,10,0.5,5)}${ctl("ta-c","c",-50,50,5,0)}${ctl("ta-d","d",1,10,0.5,5)}${ctl("ta-w","Precio mundial P_W",5,25,0.5,10)}${ctl("ta-t","Arancel por unidad t",0,15,0.5,4)}${ctl("ta-f","φ: parte del arancel que paga el extranjero",0,0.9,0.05,0)}<div class="res" id="ta-res"></div><div id="ta-gr"></div><div id="ta-o"></div>`;
    const run=()=>{const a=V("ta-a"),b=V("ta-b"),c=V("ta-c"),d=V("ta-d"),Pw=V("ta-w"),t=V("ta-t"),f=V("ta-f"),Pa=(a-c)/(b+d);if(Pw>=Pa){$("ta-res").innerHTML=err(`con P_W ≥ ${d2(Pa)} (precio de autarquía) el país no importa.`);$("ta-gr").innerHTML=$("ta-o").innerHTML="";return}
      const Pw2=Pw-f*t,Pd=Math.min(Pa,Pw2+t),D=P=>a-b*P,S=P=>c+d*P,S0=S(Pw),D0=D(Pw),S1=S(Pd),D1=D(Pd),M1=D1-S1,A=(Pd-Pw)*(S0+S1)/2,Bb=(Pd-Pw)*(S1-S0)/2,C=(Pd-Pw)*M1,Dd=(Pd-Pw)*(D0-D1)/2,E=(Pw-Pw2)*M1,net=E-Bb-Dd;
      $("ta-res").innerHTML=tl([["Precio interno",`${d2(Pw)} → ${d2(Pd)}`],["Importaciones",`${d2(D0-S0)} → ${d2(M1)}`],["Recaudo",d2(t*M1)],["Pérdida b + d",d2(Bb+Dd),"badt"],["Ganancia de términos de intercambio e",d2(E)],["Efecto neto en el bienestar",d2(net),net>=0?"okt":"badt"]]);
      const qm=Math.max(D(0),S(Pa))*1.05;$("ta-gr").innerHTML=plotXY({xr:[0,qm],yr:[0,Pa*1.5],series:[{f:q=>(a-q)/b,col:"--line"},{f:q=>(q-c)/d,col:"--exam"}],hlines:[{y:Pw,col:"--muted"},{y:Pd,col:"--ink"},...(f>0?[{y:Pw2,col:"--muted"}]:[])],areas:[{pts:[[S0,Pw],[S1,Pd],[S1,Pw]],col:"--bad",op:.35},{pts:[[D1,Pw],[D1,Pd],[D0,Pw]],col:"--bad",op:.35},{pts:[[S1,Pw],[S1,Pd],[D1,Pd],[D1,Pw]],col:"--good",op:.3}],xl:"Cantidad",yl:"Precio",label:"Arancel"})+legend([["--line","Demanda"],["--exam","Oferta interna"],["--bad","Pérdidas b y d"],["--good","Recaudo"]]);
      $("ta-o").innerHTML=stp(1,"Áreas",`<div class="eq al">Excedente del productor: +a = ${d2(A)} · consumidor: −(a + b + c + d) = ${d2(-(A+Bb+C+Dd))}<br>Recaudo: c${f>0?" + e":""} = ${d2(C+E)} · pérdida de eficiencia b + d = ${d2(Bb+Dd)}${f>0?` · ganancia de términos de intercambio e = ${d2(E)}`:""}<br>Bienestar nacional: ${f>0?"e − (b + d)":"−(b + d)"} = <b>${d2(net)}</b></div><p>${f>0?(net>0?"Al ser un país grande, la ganancia en términos de intercambio supera la distorsión: el arancel mejora el bienestar nacional, a costa del resto del mundo, y el resultado es frágil ante represalias.":"Aunque parte del arancel lo paga el extranjero, la distorsión es mayor."):"En un país pequeño, el arancel siempre reduce el bienestar."}</p>`)};
    bindCtl(["ta-a","ta-b","ta-c","ta-d","ta-w","ta-t","ta-f"],run);run()},
   tpe(){B.innerHTML=`<div class="calcf">${nin("tp-tf","Arancel al bien final (%)",20,"1")}${tarea("tp-in","Insumo; participación en el valor del bien (%); arancel (%)","Tela; 40; 5\nHilo; 15; 10\nBotones; 5; 0",3)}</div><div id="tp-o"></div>`;
    const run=()=>{const tf=N("tp-tf")/100,I=lines($("tp-in").value).map(p=>({n:p[0],a:num(p[1])/100,t:num(p[2])/100})).filter(x=>isFinite(x.a)&&isFinite(x.t)),sa=I.reduce((s,x)=>s+x.a,0),sat=I.reduce((s,x)=>s+x.a*x.t,0);if(sa>=1){$("tp-o").innerHTML=err("los insumos no pueden sumar el 100 % del valor.");return}const tpe=(tf-sat)/(1-sa);
      $("tp-o").innerHTML=tl([["Arancel nominal",pc(tf)],["Protección efectiva",pc(tpe),"okt"],["Valor agregado a precios mundiales",pc(1-sa)]])+stp(1,"Cálculo",`<div class="eq al">TPE = (t_f − Σaᵢtᵢ)/(1 − Σaᵢ) = (${pc(tf)} − ${pc(sat)})/(1 − ${pc(sa)}) = <b>${pc(tpe)}</b></div><p>${tpe>tf?"Como los insumos pagan menos arancel que el bien final, la protección del valor agregado es mayor que la nominal: es el escalonamiento arancelario.":"Si los insumos pagan más arancel que el bien final, la protección efectiva es menor que la nominal y puede ser negativa."}</p>`)};
    onIn(["tp-tf","tp-in"],run);run()}})};

// ---------- Viner
SIMS.viner=function(){
  $("sim").innerHTML=`<p class="hint">Mercado de Colombia con demanda Q_d = 100 − P y oferta interna Q_s = −20 + P. Costos constantes de los proveedores externos.</p>${ctl("vi-w","Costo del proveedor mundial más eficiente",10,50,1,30)}${ctl("vi-p","Costo del socio del acuerdo",10,60,1,34)}${ctl("vi-t","Arancel antes del acuerdo (%)",0,100,5,50)}<div class="res" id="vi-res"></div><div id="vi-o"></div>`;
  const run=()=>{const cw=V("vi-w"),cp=V("vi-p"),t=V("vi-t")/100,D=P=>Math.max(0,100-P),S=P=>Math.max(0,P-20),Pa=60,P0=Math.min(Pa,cw*(1+t),cp*(1+t)),src0=cw<=cp?"mundo":"socio",P1=Math.min(Pa,cp,cw*(1+t)),src1=cp<=cw*(1+t)?"socio":"mundo",M0=D(P0)-S(P0),M1=D(P1)-S(P1),rec0=src0==="mundo"?(P0-cw)*M0:(P0-cp)*M0,rec1=src1==="mundo"?(P1-cw)*M1:0;
    const dCS=(D(P0)+D(P1))/2*(P0-P1),dPS=-(S(P0)+S(P1))/2*(P0-P1),dW=dCS+dPS-rec0+rec1,crea=(P0-P1)*((S(P0)-S(P1))+(D(P1)-D(P0)))/2,desv=src0==="mundo"&&src1==="socio"?(cp-cw)*M0:0;
    $("vi-res").innerHTML=tl([["Precio interno antes / después",`${d2(P0)} → ${d2(P1)}`],["Proveedor antes / después",`${src0} → ${src1}`],["Creación de comercio (triángulos)",d2(crea),"okt"],["Costo de la desviación",d2(desv),desv>0?"badt":""],["Cambio en el bienestar",d2(dW),dW>=0?"okt":"badt"]]);
    $("vi-o").innerHTML=stp(1,"Antes del acuerdo",`<p>El precio interno es ${d2(P0)} (el costo del ${src0==="mundo"?"proveedor mundial":"socio"} más el arancel). Se importan ${d2(M0)} unidades y el gobierno recauda ${d2(rec0)}.</p>`)
      +stp(2,"Con el acuerdo",`<p>${src1==="socio"?`El socio entra sin arancel a ${d2(cp)}, más barato que el proveedor mundial con arancel (${d2(cw*(1+t))}). Se importan ${d2(M1)} unidades del socio y el recaudo desaparece.`:`El proveedor mundial con arancel (${d2(cw*(1+t))}) sigue siendo más barato que el socio: el acuerdo no cambia nada.`}</p><div class="eq al">ΔEC = +${d2(dCS)} · ΔEP = ${d2(dPS)} · Δrecaudo = ${d2(rec1-rec0)} ⟹ Δbienestar = <b>${d2(dW)}</b></div><p>${desv>0?`Hay desviación de comercio: las ${d2(M0)} unidades que antes se compraban al mundo a ${d2(cw)} ahora se compran al socio a ${d2(cp)}, un costo de ${d2(desv)}. La creación de comercio vale ${d2(crea)}. ${dW>=0?"Domina la creación.":"Domina la desviación: el acuerdo reduce el bienestar."}`:crea>0?"Solo hay creación de comercio: el acuerdo mejora el bienestar.":""}</p>`)};
  bindCtl(["vi-w","vi-p","vi-t"],run);run()};

// ---------- Brander-Spencer
SIMS.airbus=function(){
  $("sim").innerHTML=`<p class="hint">Ejemplo de Krugman y Obstfeld: si las dos empresas producen, cada una pierde; si produce solo una, gana el beneficio de monopolio.</p><div class="calcf">${nin("ab-m","Beneficio de monopolio",100)}${nin("ab-l","Beneficio de cada una si ambas producen",-5)}${nin("ab-sa","Subsidio europeo a Airbus si produce",25)}${nin("ab-sb","Subsidio de EE. UU. a Boeing si produce",0)}</div><div id="ab-o"></div>`;
  const run=()=>{const m=N("ab-m"),l=N("ab-l"),sa=N("ab-sa"),sb=N("ab-sb"),P={"PP":[l+sb,l+sa],"PN":[m+sb,0],"NP":[0,m+sa],"NN":[0,0]},S=["P","N"],ne=[];
    S.forEach(b=>S.forEach(a=>{const k=b+a,[ub,ua]=P[k],okB=ub>=P[(b==="P"?"N":"P")+a][0],okA=ua>=P[b+(a==="P"?"N":"P")][1];if(okB&&okA)ne.push(k)}));
    const lab=k=>`Boeing ${k[0]==="P"?"produce":"no produce"}, Airbus ${k[1]==="P"?"produce":"no produce"}`,welf=k=>[P[k][0]-(k[0]==="P"?sb:0),P[k][1]-(k[1]==="P"?sa:0)];
    $("ab-o").innerHTML=`<div class="tbl"><table><tr><th>Boeing \\ Airbus</th><th>Produce</th><th>No produce</th></tr>${S.map(b=>`<tr><td><b>${b==="P"?"Produce":"No produce"}</b></td>${S.map(a=>`<td${ne.includes(b+a)?' class="hl"':""}>${d2(P[b+a][0])}, ${d2(P[b+a][1])}</td>`).join("")}</tr>`).join("")}</table></div>`
      +stp(1,"Equilibrios de Nash",ne.length?`<ul>${ne.map(k=>`<li><b>${lab(k)}</b>. Bienestar nacional (beneficio menos subsidio): EE. UU. ${d2(welf(k)[0])}, Europa ${d2(welf(k)[1])}.</li>`).join("")}</ul>`:"<p>No hay equilibrio en estrategias puras.</p>")
      +stp(2,"Lectura",`<p>${sa>-l&&sb<=-l?`El subsidio europeo (${d2(sa)}) es mayor que la pérdida de producir en duopolio (${d2(-l)}): Airbus producirá pase lo que pase, y a Boeing ya no le conviene entrar. Europa gasta ${d2(sa)} y captura un beneficio de ${d2(m+sa)}: su bienestar sube de 0 a ${d2(m)}.`:sa>-l&&sb>-l?"Si ambos gobiernos subsidian, las dos empresas producen y los dos países gastan en subsidios para terminar con pérdidas: la guerra de subsidios.":"Sin subsidios suficientes hay dos equilibrios y no se sabe cuál ocurrirá: la empresa que entre primero se queda con el mercado."}</p><p class="hint">El argumento depende de que el gobierno conozca los beneficios y de que la competencia sea en cantidades; con competencia en precios lo óptimo cambia.</p>`)};
  onIn(["ab-m","ab-l","ab-sa","ab-sb"],run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Ricardo","Ventaja comparativa","a_LQ/a_LV < a*_LQ/a*_LV"],["Ricardo","Precio de autarquía","P_Q/P_V = a_LQ/a_LV"],["DFS","Equilibrio","A(z̃) = ω = [z̃/(1 − z̃)]·(L*/L)"],["Factores específicos","Salario","w = P_M·PMgL_M = P_A·PMgL_A"],["Heckscher-Ohlin","Pleno empleo","a_LX X + a_LY Y = L; a_KX X + a_KY Y = K"],["Heckscher-Ohlin","Precio igual a costo","a_LX w + a_KX r = P_X; a_LY w + a_KY r = P_Y"],["Modelo estándar","Términos de intercambio","RS(p) = RD(p)"],["Gravedad","Ecuación","T = A·Yᵢ·Yⱼ/D^θ"],["Comercio intraindustrial","Grubel-Lloyd","1 − |X − M|/(X + M)"],["Krugman","Número de empresas","n = √(S/(bF)); P = c + 1/(bn)"],["Dumping recíproco","Cournot con transporte","q_h = (a − c + t)/3; q_f = (a − c − 2t)/3"],
    ["Arancel","País pequeño","Pérdida = b + d"],["Arancel","País grande","Bienestar = e − (b + d)"],["Arancel","Protección efectiva","(t_f − Σaᵢtᵢ)/(1 − Σaᵢ)"],["Integración","Viner","Δbienestar = creación de comercio − costo de la desviación"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: gravedad"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "df-a":"<b>Ventaja tecnológica media de Local</b> frente a Extranjero en el continuo de bienes. Más alta, Local produce más bienes y gana más salario relativo.","df-g":"<b>Qué tan distintas son las ventajas</b> de un bien a otro: más γ, la curva A(z) es más inclinada.","df-l":"<b>Tamaño relativo de Extranjero</b> (L*/L). Un país más grande tiene que producir más bienes para emplear a todos.",
 "sf-pm":"<b>Precio de las manufacturas.</b> Si sube, el trabajo se mueve hacia ese sector; gana el dueño del capital y pierde el de la tierra.","sf-pa":"<b>Precio de los alimentos.</b>","sf-k":"<b>Capital</b>, factor específico de las manufacturas.","sf-t":"<b>Tierra</b>, factor específico de los alimentos.","sf-x":"<b>Aumento del precio de las manufacturas</b> con el que se compara: el salario sube menos que el precio.",
 "st-e":"<b>Elasticidad de la oferta relativa</b> de alimentos a su precio relativo.","st-s":"<b>Elasticidad de la demanda relativa.</b>","st-g":"<b>Crecimiento sesgado</b>: cuánto aumenta la oferta mundial relativa de alimentos. Si crece la oferta del bien que exporta Colombia, empeoran sus términos de intercambio.","st-x":"<b>Peso de Colombia</b> en la oferta mundial de alimentos: con más peso, su propio crecimiento mueve más el precio.",
 "dm-a":"<b>Intercepto de la demanda</b> de cada país (P = a − Q).","dm-c":"<b>Costo marginal</b> de cada empresa.","dm-t":"<b>Costo de transporte</b> por unidad exportada. Aun así cada empresa vende en el otro mercado a menor margen: es el dumping recíproco.",
 "mg-a":"<b>Productividad del primer trabajador en Local</b> (w = A − bL).","mg-b":"<b>Qué tan rápido cae el salario en Local</b> al llegar más trabajadores.","mg-a2":"<b>Productividad del primer trabajador en Extranjero.</b>","mg-b2":"<b>Qué tan rápido cae el salario en Extranjero.</b>","mg-l":"<b>Trabajadores que empiezan en Local.</b> Migran hasta que los salarios se igualan; el producto mundial sube.",
 "ta-a":"<b>Intercepto de la demanda interna.</b>","ta-b":"<b>Pendiente de la demanda interna.</b>","ta-c":"<b>Intercepto de la oferta interna.</b>","ta-d":"<b>Pendiente de la oferta interna.</b>","ta-w":"<b>Precio mundial</b> del bien sin arancel.","ta-t":"<b>Arancel por unidad.</b> Sube el precio interno, protege a los productores y crea pérdida de eficiencia.","ta-f":"<b>Parte del arancel que paga el extranjero</b>: un país grande baja el precio mundial (mejora sus términos de intercambio).",
 "vi-w":"<b>Costo del proveedor más eficiente del mundo.</b>","vi-p":"<b>Costo del socio del acuerdo.</b> Si es mayor que el mundial pero gana por no pagar arancel, hay desviación de comercio.","vi-t":"<b>Arancel antes del acuerdo</b> (%), que se sigue cobrando a los que no son socios."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
