// Historia Económica · herramientas de estudio
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


// ===================== LABORATORIOS DE HISTORIA ECONÓMICA =====================
// PIB per cápita en dólares internacionales de 1990 (Geary-Khamis). Maddison (2001), The World Economy: a Millennial Perspective, cuadro B-21.
const MY=[1,1000,1500,1600,1700,1820,1870,1913,1950,1973,1998];
const MD={
 "Mundo":[445,436,566,596,615,667,873,1525,2111,4091,5709],
 "Europa occidental":[450,400,774,894,1024,1232,1974,3473,4594,11534,17921],
 "Reino Unido":[null,null,714,974,1250,1706,3191,4921,6939,12025,18714],
 "Estados Unidos":[null,null,400,400,527,1257,2445,5301,9561,16689,27331],
 "Japón":[400,425,500,520,570,669,737,1387,1921,11439,20413],
 "China":[450,450,600,600,600,600,530,552,439,839,3117],
 "India":[450,450,550,550,550,533,533,673,619,853,1746],
 "América Latina":[400,400,416,438,527,692,681,1481,2506,4531,5795],
 "África":[430,425,400,400,400,420,500,637,894,1410,1368],
 "Antigua URSS":[null,null,500,553,611,688,943,1488,2841,6059,3893]};
const MCOL={"Mundo":"--ink","Europa occidental":"--line","Reino Unido":"--exam","Estados Unidos":"--good","Japón":"--bad","China":"--muted","India":"--line","América Latina":"--exam","África":"--good","Antigua URSS":"--bad"};
const MDASH={"India":"6 4","América Latina":"6 4","África":"6 4","Antigua URSS":"6 4","China":"2 3"};
const yrs=h=>h.replace(/(text-anchor="middle"[^>]*>)(\d)\.(\d{3})</g,"$1$2$3<");
const tasa=(a,b,n)=>Math.pow(b/a,1/n)-1;
const pct=(v,d=2)=>fmt(v*100,d).replace(/^-/,"−")+" %";

SIMS.madd=function(){
  const def={"tendencias":["Mundo","Europa occidental","China","América Latina","África"],"eeuu":["Reino Unido","Estados Unidos","Europa occidental","Mundo"],"regiones":["Europa occidental","Estados Unidos","Japón","China","India","América Latina","África"]};
  const id=decodeURIComponent(location.hash.slice(1));let sel=new Set(def[id]||def.tendencias),modo="niv";
  $("sim").innerHTML=`<p class="hint">PIB per cápita en dólares internacionales de 1990, según Maddison (2001). Las cifras anteriores a 1820 son estimaciones gruesas.</p>
  <div class="chips pre" id="md-r"><span class="lbl">Regiones</span>${Object.keys(MD).map(k=>`<button type="button" data-k="${k}">${k}</button>`).join("")}</div>
  <div style="margin:8px 0">${seg("md-m","Ver",[["niv","Nivel"],["rel","Relativo al mundo"]],"niv")}</div>
  <div class="calcf"><label for="md-a">Desde<select id="md-a">${MY.map(y=>`<option${y===1500?" selected":""}>${y}</option>`).join("")}</select></label><label for="md-b">Hasta<select id="md-b">${MY.map(y=>`<option${y===1998?" selected":""}>${y}</option>`).join("")}</select></label></div>
  <div id="md-g"></div><div id="md-o"></div>`;
  const run=()=>{document.querySelectorAll("#md-r button").forEach(b=>b.setAttribute("aria-pressed",sel.has(b.dataset.k)));
    const a=+$("md-a").value,b=+$("md-b").value;if(b<=a){$("md-o").innerHTML=err("el año final debe ser posterior al inicial.");return}
    const ia=MY.indexOf(a),ib=MY.indexOf(b),ks=[...sel],val=(k,i)=>{const v=MD[k][i];return v==null?null:modo==="rel"?v/MD["Mundo"][i]:v};
    const ys=ks.flatMap(k=>MY.slice(ia,ib+1).map((_,j)=>val(k,ia+j))).filter(v=>v!=null);if(!ks.length){$("md-g").innerHTML="";$("md-o").innerHTML=`<p class="hint">Elige al menos una región.</p>`;return}
    $("md-g").innerHTML=yrs(plotXY({xr:[a,b],yr:[0,Math.max(...ys)*1.08],series:ks.map(k=>({pts:MY.slice(ia,ib+1).map((y,j)=>[y,val(k,ia+j)]).filter(p=>p[1]!=null),col:MCOL[k],dash:MDASH[k],w:2.4,dots:true})),hlines:modo==="rel"?[{y:1,col:"--muted"}]:[],xl:"año",yl:modo==="rel"?"veces el promedio mundial":"dólares de 1990",label:"PIB per cápita de largo plazo"}))+legend(ks.map(k=>[MCOL[k],k,!!MDASH[k]]));
    const rows=ks.map(k=>{const x=MD[k][ia],y=MD[k][ib];return[k,x,y,x&&y?tasa(x,y,b-a):null]});const ok=rows.filter(r=>r[3]!=null),mx=ok.length?ok.reduce((p,c)=>c[2]>p[2]?c:p):null,mn=ok.length?ok.reduce((p,c)=>c[2]<p[2]?c:p):null;
    $("md-o").innerHTML=stp(1,`Crecimiento anual compuesto entre ${a} y ${b}`,`<div class="tbl"><table><tr><th>Región</th><th>${a}</th><th>${b}</th><th>Veces</th><th>Tasa anual</th><th>Años para duplicar</th></tr>${rows.map(([k,x,y,g])=>`<tr><td>${k}</td><td>${x??"—"}</td><td>${y??"—"}</td><td>${x&&y?fmt(y/x,2):"—"}</td><td>${g!=null?pct(g):"—"}</td><td>${g>0?fmt(Math.log(2)/Math.log(1+g),0):"—"}</td></tr>`).join("")}</table></div><p class="hint">Tasa = (valor final / valor inicial)^(1/${b-a}) − 1.</p>`)
      +(mx&&mn&&mx!==mn?stp(2,"Brecha",`<p>En ${a} la relación entre ${mx[0]} y ${mn[0]} era ${fmt(mx[1]/mn[1],2)} a 1; en ${b} es ${fmt(mx[2]/mn[2],2)} a 1. ${mx[2]/mn[2]>mx[1]/mn[1]?"La brecha se amplió: divergencia.":"La brecha se cerró: convergencia."}</p>`):"")};
  $("md-r").addEventListener("click",e=>{const b=e.target.closest("button[data-k]");if(!b)return;const k=b.dataset.k;sel.has(k)?sel.delete(k):sel.add(k);run()});
  bindSeg("md-m",v=>{modo=v;run()});$("md-a").onchange=run;$("md-b").onchange=run;run()};

SIMS.crec=function(){
  $("sim").innerHTML=tabsBox("cr",[["tasa","Tasa entre dos datos"],["proy","Proyectar con una tasa"],["div","Divergencia"]]);const B=$("cr-b");
  tabsRun("cr",{
   tasa(){B.innerHTML=`<div class="calcf">${nin("ct-a","Valor inicial",714)}${nin("ct-b","Valor final",1706)}${nin("ct-n","Años transcurridos",320)}</div><div class="res" id="ct-res"></div><div id="ct-o"></div>`;
    const run=()=>{const[a,b,n]=["ct-a","ct-b","ct-n"].map(N);if(!(a>0&&b>0&&n>0)){$("ct-res").innerHTML=err("valores y años positivos.");return}const g=tasa(a,b,n);
      $("ct-res").innerHTML=tiles([["Tasa anual compuesta",pct(g,3),"okt"],["Veces que se multiplicó",fmt(b/a,3)],["Años para duplicar",g>0?fmt(Math.log(2)/Math.log(1+g),1):"—"],["Regla del 70",g>0?fmt(70/(g*100),1):"—"]]);
      $("ct-o").innerHTML=stp(1,"Cálculo",`<div class="eq al">g = (${fm(b)}/${fm(a)})^(1/${fm(n)}) − 1 = ${fmt(b/a,4)}^(${fmt(1/n,5)}) − 1 = <b>${pct(g,3)}</b></div><p class="hint">Ejemplo precargado: Reino Unido entre 1500 (714) y 1820 (1.706). Ni siquiera el país que encabezó la industrialización llegó al 0,3 % anual en la era preindustrial.</p>`)};
    onIn(["ct-a","ct-b","ct-n"],run);run()},
   proy(){B.innerHTML=`${ctl("cp-g","Tasa anual (%)",0,8,0.1,2)}${ctl("cp-n","Años",10,200,5,100)}${nin("cp-a","Valor inicial",1000)}<div class="res" id="cp-res"></div><div id="cp-g2"></div>`;
    const run=()=>{const g=V("cp-g")/100,n=V("cp-n"),a=N("cp-a");if(!(a>0))return;const f=t=>a*Math.pow(1+g,t);
      $("cp-res").innerHTML=tiles([["Valor final",fmt(f(n),0),"okt"],["Veces",fmt(f(n)/a,2)],["Años para duplicar",g>0?fmt(Math.log(2)/Math.log(1+g),1):"—"]]);
      $("cp-g2").innerHTML=plotXY({xr:[0,n],yr:[0,f(n)*1.08],series:[{f,col:"--line"},{f:t=>a*Math.pow(1.01,t),col:"--muted",dash:"5 4",w:1.6}],xl:"años",yl:"valor",label:"Crecimiento compuesto"})+legend([["--line",`${fmt(g*100,1)} % anual`],["--muted","1 % anual",1]])};
    bindCtl(["cp-g","cp-n"],run);onIn(["cp-a"],run);run()},
   div(){B.innerHTML=`<p class="hint">Dos países parten del mismo ingreso y crecen a tasas distintas: así se forman las brechas de la gran divergencia.</p>${ctl("cd-1","Tasa del país A (%)",0,4,0.1,1.5)}${ctl("cd-2","Tasa del país B (%)",0,4,0.1,0.5)}${ctl("cd-n","Años",20,300,10,180)}<div class="res" id="cd-res"></div>`;
    const run=()=>{const a=V("cd-1")/100,b=V("cd-2")/100,n=V("cd-n"),r=Math.pow((1+a)/(1+b),n);
      $("cd-res").innerHTML=tiles([["Ingreso A / B al final",fmt(r,2)+" a 1","okt"],["Diferencia de tasas",fmt((a-b)*100,1)+" puntos"]])+`<p class="hint">Entre 1820 y 1998, Europa occidental creció cerca de 1,5 % anual y África cerca de 0,7 %: unos 0,8 puntos de diferencia durante 178 años bastan para multiplicar la brecha por más de 4.</p>`};
    bindCtl(["cd-1","cd-2","cd-n"],run);run()}})};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={"cp-g":"<b>Tasa de crecimiento anual.</b> Aun tasas pequeñas, mantenidas por siglos, multiplican el ingreso.","cp-n":"<b>Años</b> que se acumula el crecimiento.","cd-1":"<b>Tasa de crecimiento anual del país A.</b>","cd-2":"<b>Tasa de crecimiento anual del país B.</b> Una diferencia de 1 o 2 puntos explica la gran divergencia.","cd-n":"<b>Años</b> que se comparan."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
