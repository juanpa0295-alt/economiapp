// Derecho Laboral y Comercial · calculadoras
// ===================== CALCULADORAS DE DERECHO LABORAL =====================
const SIMS={};
const HOY=(()=>{const t=new Date();return{y:t.getFullYear(),m:t.getMonth()+1,d:t.getDate()}})();
const $p=n=>"$"+Math.round(n).toLocaleString("es-CO");
const $c=n=>"$"+n.toLocaleString("es-CO",{minimumFractionDigits:2,maximumFractionDigits:2});
const dt=d=>LAB.fmtFecha(d),di=d=>LAB.iso(d);
function dateIn(id,label,val){return `<label for="${id}">${label}<input id="${id}" type="date" value="${val}"></label>`}
function numIn(id,label,val,step="1"){return `<label for="${id}">${label}<input id="${id}" type="number" value="${val}" step="${step}" inputmode="decimal"></label>`}
function selIn(id,label,opts,val){return `<label for="${id}">${label}<select id="${id}">${opts.map(([v,t])=>`<option value="${v}" ${v===val?"selected":""}>${t}</option>`).join("")}</select></label>`}
const N=id=>parseFloat($(id).value),D=id=>LAB.parse($(id).value);
function watch(ids,run){ids.forEach(i=>{$(i).addEventListener("input",run);$(i).addEventListener("change",run)})}

// ---- Prórrogas (art. 46)
SIMS.pro=function(){
  $("sim").innerHTML=`<p>Escribe cuándo empezó el contrato y su duración inicial. La calculadora asume que nadie dio preaviso, así que muestra las prórrogas automáticas.</p>
  <div class="chips pre" id="p-ej"><button type="button" data-k="mariana">Taller: Mariana (8 meses y 15 días)</button><button type="button" data-k="tres">Ejemplo: 3 meses</button></div>
  <div class="calcf">${dateIn("p-ini","Inicio del contrato","2026-01-01")}${numIn("p-mes","Duración inicial (meses)",3)}${numIn("p-dd","… más días",0)}${selIn("p-mo","Contar la duración con",[["360","año de 360 días (30 por mes, como en clase)"],["cal","calendario (meses del calendario y días corridos)"]],"360")}${dateIn("p-cor","Fecha de consulta (o de retiro)",di(HOY))}</div>
  <div class="res" id="p-res"></div><div class="verdict" id="p-ver"></div><div id="p-line"></div><div class="tbl"><table id="p-tab"></table></div><div id="p-note"></div>`;
  let last=null;const run=()=>{const ini=D("p-ini"),mes=Math.round(N("p-mes")),dd=Math.max(0,Math.round(N("p-dd")||0)),modo=$("p-mo").value,cor=D("p-cor");
    if(!ini||!cor||!(mes>=0&&mes<=48)||mes*30+dd<1||dd>29){$("p-res").innerHTML=err("revisa las fechas, que la duración esté entre 1 y 48 meses y que los días adicionales sean menos de 30.");$("p-tab").innerHTML="";last=null;return}
    const R=LAB.prorrogas(ini,mes,cor,{dias:dd,modo}),act=R.actual,name=p=>p.n===0?"Inicial":`${p.n}.ª prórroga`,dur=p=>p.recortado?"Hasta el tope":p.anual?"1 año (desde la 4.ª prórroga)":p.meses+" meses"+(p.dias?` y ${p.dias} días`:"");last={R,act,cor};
    $("p-res").innerHTML=tiles([["Tope de 4 años",dt(R.tope)],["Pasa a indefinido",R.conversion?dt(R.conversion):"—"],["Período en la consulta",R.indefinidoEnCorte?"Indefinido":act?name(act):"Aún no empieza"],["Último día para avisar",act&&!R.indefinidoEnCorte?dt(act.preaviso):"—"]]);
    const ve=$("p-ver");
    if(R.indefinidoEnCorte){ve.className="verdict acc";ve.textContent=`En la fecha de consulta el contrato ya es a término indefinido: superó el tope de 4 años el ${dt(R.tope)}.`}
    else if(act){const late=LAB.cmp(cor,act.preaviso)>0;ve.className="verdict "+(late?"warnv":"acc");
      ve.textContent=late?`Ya pasó la fecha para avisar la no renovación (${dt(act.preaviso)}). Si nadie avisó, el contrato se prorrogará al vencer el ${dt(act.fin)}.`:`El período actual vence el ${dt(act.fin)}. Para que no se renueve, el aviso debe darse a más tardar el ${dt(act.preaviso)}.`}
    else{ve.className="verdict warnv";ve.textContent="La fecha de consulta es anterior al inicio del contrato."}
    // línea de tiempo
    const P=R.periodos,a=P[0].inicio,z=R.conversion?LAB.addDays(R.conversion,180):P[P.length-1].fin,span=LAB.days360(a,z)||1,W=600,H=96,x=d=>14+Math.max(0,Math.min(1,LAB.days360(a,d)/span))*(W-28);
    let g=P.map((p,i)=>`<rect x="${x(p.inicio)}" y="26" width="${Math.max(1.5,x(LAB.addDays(p.fin,1))-x(p.inicio)-1.5)}" height="26" rx="3" fill="var(${p.n===0?"--line":p.meses>=12&&mes<12?"--exam":"--branch"})" fill-opacity="${act&&act.n===p.n?1:.55}"/>`).join("");
    if(R.conversion)g+=`<rect x="${x(R.conversion)}" y="26" width="${W-14-x(R.conversion)}" height="26" fill="var(--good)" fill-opacity=".25"/><text x="${Math.min(x(R.conversion)+4,W-120)}" y="44" font-size="11.5" fill="var(--good)" font-weight="600">indefinido</text>`;
    g+=`<line x1="${x(R.tope)}" x2="${x(R.tope)}" y1="16" y2="62" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="4 3"/><text x="${x(R.tope)-4}" y="13" text-anchor="end" font-size="11" fill="var(--bad)">tope 4 años</text>`;
    if(LAB.cmp(cor,a)>=0&&LAB.cmp(cor,z)<=0)g+=`<line x1="${x(cor)}" x2="${x(cor)}" y1="20" y2="70" stroke="var(--ink)" stroke-width="2"/><text x="${x(cor)}" y="84" text-anchor="middle" font-size="11" fill="var(--ink)">consulta</text>`;
    $("p-line").innerHTML=`<div class="legend"><span><i style="background:var(--line)"></i>Período inicial</span><span><i style="background:var(--branch)"></i>Prórroga igual</span>${mes<12?`<span><i style="background:var(--exam)"></i>Prórroga de 1 año</span>`:""}</div><div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Línea de tiempo de las prórrogas">${g}</svg></div>`;
    $("p-tab").innerHTML=`<tr><th>Período</th><th>Desde</th><th>Hasta</th><th>Duración</th><th>Último día para avisar</th></tr>`+P.map(p=>`<tr class="${act&&act.n===p.n&&!R.indefinidoEnCorte?"ne":""}"><td>${name(p)}</td><td>${dt(p.inicio)}</td><td>${dt(p.fin)}${p.recortado?" (tope)":""}</td><td>${dur(p)}</td><td>${p.recortado?"—":dt(p.preaviso)}</td></tr>`).join("");
    const p0=P[0];$("p-note").innerHTML=stp(1,"Cómo se cuenta un período",modo==="360"?`<div class="eq al">${mes} meses${dd?` y ${dd} días`:""} = ${mes} × 30${dd?` + ${dd}`:""} = <b>${mes*30+dd} días</b> de 360<br>Período inicial: desde el ${dt(p0.inicio)}, se cuentan ${mes*30+dd} días con el año de 360 (contando el primero) ⇒ termina el <b>${dt(p0.fin)}</b><br>Cada prórroga empieza al día siguiente del fin del período anterior.</div>`:`<div class="eq al">Período inicial: ${dt(p0.inicio)} + ${mes} meses del calendario${dd?` + ${dd} días corridos`:""} − 1 día ⇒ termina el <b>${dt(p0.fin)}</b></div>`)
      +`<p class="hint">Art. 46: si el contrato es de menos de un año, se prorroga hasta tres veces por un tiempo igual; desde la cuarta prórroga, cada renovación es de un año. Si se despide al trabajador sin justa causa, la indemnización es el salario del tiempo que faltaba para que venciera el período que estaba corriendo.</p>`
      +(R.antesReforma?`<p class="link"><b>Contrato anterior a la reforma:</b> empezó antes del 25 de junio de 2025, así que el tope de 4 años se cuenta desde esa fecha y no desde el inicio del contrato.</p>`:"")};
  const SETP=v=>{Object.entries(v).forEach(([k,x])=>$(k).value=x);run()};
  const deCaso=c=>SETP({"p-ini":c.ingreso,"p-mes":c.durM,"p-dd":c.durD||0,"p-mo":c.modo||"360","p-cor":c.retiro});
  $("p-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.k==="mariana"){deCaso(CASO.taller("mariana"));bar.draw("Se activó el caso de Mariana.")}else SETP({"p-ini":"2026-01-01","p-mes":3,"p-dd":0,"p-mo":"360"})});
  watch(["p-ini","p-mes","p-dd","p-mo","p-cor"],run);run();
  const bar=casoBar("prorrogas",{cargar:deCaso,resultado:()=>last&&last.act&&!last.R.indefinidoEnCorte?{t:`${last.act.n===0?"período inicial":last.act.n+".ª prórroga"}: vence el ${dt(last.act.fin)}`,v:0,fin:di(last.act.fin)}:null});
  const c0=CASO.dePre((()=>{const p=window.TOOL_PRE;window.TOOL_PRE=null;return p})());if(c0)deCaso(c0);
};

// ---- Indemnización (art. 64)
// ---- Puente nómina → liquidación: un mes calculado en la nómina o en la planilla llega a la tabla de la liquidación
const LIQ_IN="eco-liq-envios",MESN=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
function enviarALiq(env){let a=[];try{a=JSON.parse(localStorage.getItem(LIQ_IN)||"[]")}catch(e){a=window.LIQ_ENVIOS||[]}
  a=a.filter(x=>!(x.y===env.y&&x.m===env.m));a.push(env);window.LIQ_ENVIOS=a;try{localStorage.setItem(LIQ_IN,JSON.stringify(a))}catch(e){}}
function tomarEnvios(){let a=null;try{a=JSON.parse(localStorage.getItem(LIQ_IN)||"null")}catch(e){}a=a||window.LIQ_ENVIOS||[];try{localStorage.removeItem(LIQ_IN)}catch(e){}window.LIQ_ENVIOS=[];return a}
function botonEnvio(id,info){return`<div class="sendliq"><div><b>¿Sigue la liquidación?</b> ${info}</div><div class="sendliq-b"><button class="btn" type="button" id="${id}">Enviar este mes a la liquidación</button><span id="${id}-m" role="status"></span></div></div>`}

// ---- Guardar resultados: cada herramienta guarda sus datos con un nombre (en este navegador) y recuerda lo último que se hizo
function guardados(key,{get,set,label,restore}){const K="eco-guard-"+key,KL="eco-last-"+key,esc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rd=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}},wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
  const lista=()=>rd(K)||[],box=document.createElement("details");box.className="gbox";
  const draw=(m)=>{const a=lista();box.innerHTML=`<summary>💾 Guardar este resultado o abrir uno guardado${a.length?` <span class="gb-n">${a.length}</span>`:""}</summary><div class="gb-in">
    <div class="gb-row"><label for="${key}-gn">Nombre<input id="${key}-gn" placeholder="Por ejemplo: ${esc(label)} de Pedro"></label><button class="btn" type="button" data-g="save">Guardar</button></div>
    ${a.length?`<ul class="gb-l">${a.map((x,i)=>`<li><span><b>${esc(x.n)}</b><small>${esc(x.f)}</small></span><span><button class="btn" type="button" data-g="open" data-i="${i}">Abrir</button><button class="btn gb-del" type="button" data-g="del" data-i="${i}" aria-label="Borrar ${esc(x.n)}">Borrar</button></span></li>`).join("")}</ul>`:`<p class="hint">Todavía no has guardado nada aquí.</p>`}
    <p class="hint" style="margin:0">Se guarda en este navegador (si cambias de celular o computador, no aparece allá). Además, la herramienta recuerda lo último que hiciste.</p><p class="gb-m" role="status">${m||""}</p></div>`};
  box.addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(!b)return;const a=lista();
    if(b.dataset.g==="save"){const n=($(key+"-gn").value||"").trim()||`${label} ${a.length+1}`;a.unshift({n,f:new Date().toLocaleString("es-CO",{dateStyle:"medium",timeStyle:"short"}),s:get()});
      const ok=wr(K,a.slice(0,40));draw(ok?`Guardado «${esc(n)}». Ya puedes hacer otro.`:"No se pudo guardar: este navegador no permite guardar datos (por ejemplo, en modo incógnito).");box.open=true}
    else if(b.dataset.g==="open"){const x=a[+b.dataset.i];if(x){set(x.s);wr(KL,get());draw(`Abriste «${esc(x.n)}».`);box.open=true}}
    else if(b.dataset.g==="del"){const x=a.splice(+b.dataset.i,1)[0];wr(K,a);draw(`Borraste «${esc(x.n)}».`);box.open=true}});
  draw();$("sim").prepend(box);
  // lo último que se hizo: se restaura al volver, salvo que se llegue desde un taller con datos cargados
  let tm=null;const saveLast=()=>{clearTimeout(tm);tm=setTimeout(()=>{try{wr(KL,get())}catch(e){}},400)};
  $("sim").addEventListener("input",saveLast);$("sim").addEventListener("change",saveLast);$("sim").addEventListener("click",e=>{if(e.target.closest(".pre button,[data-k]"))saveLast()});
  const last=rd(KL);if(restore&&last){try{set(last);draw("Se cargó lo último que hiciste aquí.")}catch(e){}}else saveLast()}
const formGet=ids=>()=>Object.fromEntries(ids.filter(i=>$(i)).map(i=>[i,$(i).type==="checkbox"?$(i).checked:$(i).value]));
const formSet=(ids,after)=>st=>{ids.forEach(i=>{const el=$(i);if(el&&i in st){if(el.type==="checkbox")el.checked=st[i];else el.value=st[i]}});after()};

// línea de tiempo del contrato a término fijo: prórrogas, despido y lo que faltaba
function lineaIndem(PR,des,fin,falta){
  const W=480,H=118,P=PR?PR.periodos.filter(p=>p.n<=PR.actual.n):[],a=P.length?P[0].inicio:LAB.addDays(des,-Math.max(30,Math.round(falta/2))),span=LAB.days360(a,fin)||1,x=d=>14+Math.max(0,Math.min(1,LAB.days360(a,d)/span))*(W-28);
  const f3=d=>`${d.d}/${d.m}/${d.y}`,nom=p=>p.n===0?"Inicial":p.n+".ª",col=p=>p.n===0?"--line":p.meses>=12&&P[0].meses<12?"--exam":"--branch";
  let g=`<defs><pattern id="i-rx" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3.5" height="7" fill="var(--bad)" fill-opacity=".55"/></pattern></defs>`;
  if(P.length)g+=P.map(p=>{const x0=x(p.inicio),w=Math.max(1.5,x(LAB.addDays(p.fin,1))-x0-1.5);return`<rect x="${x0}" y="30" width="${w}" height="28" rx="3" fill="var(${col(p)})" fill-opacity="${p.n===PR.actual.n?1:.5}"/>${w>34?`<text x="${x0+w/2}" y="48" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--paper)">${nom(p)}</text>`:""}`}).join("");
  else g+=`<rect x="${x(a)}" y="30" width="${x(LAB.addDays(fin,1))-x(a)}" height="28" rx="3" fill="var(--branch)" fill-opacity=".5"/>`;
  const xd=x(LAB.addDays(des,1)),xf=x(LAB.addDays(fin,1));
  g+=`<rect x="${xd}" y="30" width="${Math.max(2,xf-xd)}" height="28" fill="url(#i-rx)"/><text x="${(xd+xf)/2+48>W-8?W-14:(xd+xf)/2}" y="22" text-anchor="${(xd+xf)/2+48>W-8?"end":"middle"}" font-size="13" font-weight="700" fill="var(--bad)">faltan ${falta} días</text>`;
  g+=`<line x1="${xd}" x2="${xd}" y1="24" y2="74" stroke="var(--ink)" stroke-width="2"/><text x="${xd}" y="88" text-anchor="${xd>W-70?"end":"middle"}" font-size="12" fill="var(--ink)">despido ${LAB.fmtCorta?LAB.fmtCorta(des):`${des.d}/${des.m}/${String(des.y).slice(2)}`}</text>`;
  g+=`<text x="${xf}" y="106" text-anchor="end" font-size="12" fill="var(--ink-2)">vence ${fin.d}/${fin.m}/${String(fin.y).slice(2)}</text>`;
  if(P.length)g+=`<text x="${x(a)}" y="106" font-size="12" fill="var(--ink-2)">inicio ${a.d}/${a.m}/${String(a.y).slice(2)}</text>`;
  const leg=P.length?`<div class="legend"><span><i style="background:var(--line)"></i>Período inicial</span>${P.some(p=>p.n>0&&col(p)==="--branch")?`<span><i style="background:var(--branch)"></i>Prórroga igual</span>`:""}${P.some(p=>col(p)==="--exam")?`<span><i style="background:var(--exam)"></i>Prórroga de 1 año (art. 46)</span>`:""}<span><i style="background:var(--bad);opacity:.6"></i>Lo que faltaba: se paga</span></div>`:`<div class="legend"><span><i style="background:var(--bad);opacity:.6"></i>Lo que faltaba para el vencimiento: se paga</span></div>`;
  const tab=P.length?`<div class="tbl"><table><tr><th>Período</th><th>Desde</th><th>Hasta</th></tr>${P.map(p=>`<tr${p.n===PR.actual.n?' style="font-weight:600"':""}><td>${p.n===0?"Inicial":p.n+".ª prórroga"}${p.meses>=12&&P[0].meses<12?" (1 año)":""}${p.n===PR.actual.n?" ← corría al despido":""}</td><td>${f3(p.inicio)}</td><td>${f3(p.fin)}</td></tr>`).join("")}</table></div>`:"";
  return`${leg}<div class="plot"><svg style="min-width:0" viewBox="0 0 ${W} ${H}" role="img" aria-label="Línea de tiempo del contrato: período que corría, despido y tiempo que faltaba">${g}</svg></div>${tab}`}
SIMS.ind=function(){
  $("sim").innerHTML=`<div class="chips pre" id="i-ej"><button type="button" data-k="mariana">Taller: Mariana (término fijo)</button><button type="button" data-k="pedro">Taller: Pedro (indefinido)</button><button type="button" data-k="ej">Ejemplo del texto</button></div>
  <div class="calcf">${selIn("i-tipo","Tipo de contrato",[["indef","Término indefinido"],["fijo","Término fijo"],["obra","Obra o labor"]],"indef")}${numIn("i-sal","Último salario mensual",3000000,"10000")}
  <span id="i-wini">${dateIn("i-ini","Inicio del contrato","2025-01-01")}</span>${dateIn("i-des","Fecha del despido","2026-05-10")}<span id="i-wa51">${numIn("i-a51","Días de suspensión a descontar (art. 51)",0)}</span><span id="i-wdur" hidden>${numIn("i-dm","Duración inicial pactada en meses (opcional)","","1")}${numIn("i-dd","… más días",0,"1")}</span><span id="i-wfin" hidden>${dateIn("i-fin","Vencimiento del período que corría o fin de la obra","2026-12-31")}</span></div>
  <p class="hint" id="i-hfijo" hidden>Término fijo: escribe el inicio y la duración pactada y el vencimiento de la prórroga que corría se calcula solo (art. 46). Si no, escribe tú el vencimiento.</p>
  <div class="res" id="i-res"></div><div id="i-line"></div><div id="i-steps"></div>`;
  const run=()=>{const tipo=$("i-tipo").value,sal=N("i-sal"),ini=D("i-ini"),des=D("i-des"),dm=Math.round(N("i-dm")||0),dd=Math.max(0,Math.round(N("i-dd")||0)),{smmlv}=LAB.valores(des||HOY),a51=Math.max(0,Math.round(N("i-a51")||0));
    $("i-wini").hidden=tipo==="obra";$("i-wa51").hidden=tipo!=="indef";$("i-wfin").hidden=tipo==="indef";$("i-wdur").hidden=$("i-hfijo").hidden=tipo!=="fijo";$("i-line").innerHTML="";
    let PR=null;if(tipo==="fijo"&&ini&&des&&(dm>0||dd>0)&&LAB.cmp(ini,des)<=0){PR=LAB.prorrogas(ini,dm,des,{dias:dd,modo:"360"});if(PR&&PR.actual&&!PR.indefinidoEnCorte){$("i-fin").value=di(PR.actual.fin)}else PR=null}
    const fin=D("i-fin");
    if(!(sal>0)||!des||(tipo==="indef"&&(!ini||LAB.cmp(ini,des)>0))||(tipo!=="indef"&&(!fin||LAB.cmp(fin,des)<0))){$("i-res").innerHTML=err("revisa el salario y que las fechas estén en orden.");$("i-steps").innerHTML="";return}
    const R=LAB.indemnizacion({tipo,salario:sal,inicio:ini,despido:des,finPactado:fin,smmlv,art51:a51});
    if(tipo==="indef"){
      $("i-res").innerHTML=tiles([["Tiempo de servicio",`${R.servicio.toLocaleString("es-CO")} días (${R.completos} año${R.completos===1?"":"s"}${R.frac?` y ${R.frac} días`:""})`],["Días de indemnización",String(R.dias)],["Salario diario",$c(R.diario)],["Indemnización",$p(R.valor),"okt"]]);
      $("i-steps").innerHTML=stp(1,"Paso a paso",`<div class="eq al">Salario ${R.alto?"≥":"<"} 10 SMMLV (${$p(10*smmlv)}) ⇒ ${R.p1} días por el primer año y ${R.pn} por cada año siguiente<br>Días de servicio = días360(${dt(ini)}, ${dt(des)}) + 1 = ${R.servicioTotal}${R.art51?`<br>Menos los días de suspensión del art. 51: ${R.servicioTotal} − ${R.art51} = <b>${R.servicio}</b>`:""}<br>${R.servicio<=360?`Trabajó un año o menos ⇒ ${R.p1} días completos`:`${R.servicio} días = ${R.completos} año${R.completos>1?"s":""} completo${R.completos>1?"s":""}${R.frac?` y ${R.frac} días`:""}<br>Primer año: ${R.p1} días${R.completos>1?`<br>Años siguientes completos: ${R.pn} × ${R.completos-1} = ${R.pn*(R.completos-1)} días`:""}${R.frac?`<br>Fracción: ${R.pn} × ${R.frac} / 360 = ${fmt(R.fracExacta,2)} ⇒ <b>${R.diasFrac}</b> días (los días no llevan decimales: se redondea)`:""}<br>Días = ${R.p1}${R.completos>1?` + ${R.pn*(R.completos-1)}`:""}${R.frac?` + ${R.diasFrac}`:""} = <b>${R.dias}</b>`}<br>Indemnización = ${R.dias} × ${$c(R.diario)} = <b>${$c(R.valor)}</b></div>`)}
    else{
      $("i-res").innerHTML=tiles([["Tiempo que faltaba",`${R.falta.toLocaleString("es-CO")} días`],["Días a pagar",String(R.dias)],["Salario diario",$c(R.diario)],["Indemnización",$p(R.valor),"okt"]]);
      if(tipo==="fijo")$("i-line").innerHTML=lineaIndem(PR,des,fin,R.falta);
      $("i-steps").innerHTML=stp(1,"Paso a paso",`<div class="eq al">Días que faltaban: del ${dt(LAB.addDays(des,1))} al ${dt(fin)} = días360(${dt(des)}, ${dt(fin)}) = ${R.falta}${R.minimo15?"<br>Es menor que 15 ⇒ se paga el mínimo de 15 días (obra o labor)":""}<br>Indemnización = ${R.dias} × ${$c(R.diario)} = <b>${$c(R.valor)}</b></div>${tipo==="fijo"?`<p class="hint" style="margin:0">Usa como vencimiento el fin del período o de la prórroga que estaba corriendo. La estación de prórrogas te da esa fecha.</p>`:""}`)}};
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;const P={pedro:{tipo:"indef",sal:4250000,ini:"2021-05-08",des:"2026-08-31",a51:0},pedro51:{tipo:"indef",sal:4250000,ini:"2021-05-08",des:"2026-08-31",a51:123}}[pre];if(P){$("i-tipo").value=P.tipo;$("i-sal").value=P.sal;$("i-ini").value=P.ini;$("i-des").value=P.des;$("i-a51").value=P.a51}
  const c0=P?(CASO.taller("pedro"),null):(CASO.dePre(pre)||CASO.activo());
  const deCaso=c=>{$("i-tipo").value=c.tipo;$("i-sal").value=c.salario;$("i-ini").value=c.ingreso;$("i-des").value=c.retiro;$("i-a51").value=0;$("i-dm").value=c.tipo==="fijo"?(c.durM||""):"";$("i-dd").value=c.tipo==="fijo"?(c.durD||0):0;const f=CASO.finPactado(c);if(f)$("i-fin").value=di(f);run()};
  watch(["i-tipo","i-sal","i-ini","i-des","i-fin","i-a51","i-dm","i-dd"],run);run();
  {const ids=["i-tipo","i-sal","i-ini","i-des","i-dm","i-dd","i-fin","i-a51"];guardados("indem",{get:formGet(ids),set:formSet(ids,run),label:"Indemnización",restore:!P&&!c0})}
  $("i-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const k=b.dataset.k;
    if(k==="mariana"){deCaso(CASO.taller("mariana"));bar.draw("Se activó el caso de Mariana. Al despido corría la 4.ª prórroga, que ya es de un año (art. 46): del 8 de septiembre de 2026 al 7 de septiembre de 2027.")}
    else{const V=k==="pedro"?{tipo:"indef",sal:4250000,ini:"2021-05-08",des:"2026-08-31",a51:0}:{tipo:"indef",sal:3000000,ini:"2025-01-01",des:"2026-05-10",a51:0};if(k==="pedro"){CASO.taller("pedro");bar.draw("Se activó el caso de Pedro.")}
      $("i-tipo").value=V.tipo;$("i-sal").value=V.sal;$("i-ini").value=V.ini;$("i-des").value=V.des;$("i-a51").value=V.a51;$("i-dm").value="";$("i-dd").value=0;run()}});
  const bar=casoBar("indemnizaciones",{cargar:deCaso,resultado:()=>{const tipo=$("i-tipo").value,sal=N("i-sal"),ini=D("i-ini"),des=D("i-des"),fin=D("i-fin");if(!(sal>0)||!des)return null;
    const R=LAB.indemnizacion({tipo,salario:sal,inicio:ini,despido:des,finPactado:fin,smmlv:LAB.valores(des).smmlv,art51:Math.max(0,Math.round(N("i-a51")||0))});return isFinite(R.valor)?{t:`${R.dias} días de salario`,v:R.valor}:null}});
  if(c0)deCaso(c0);
};

// ---- Moratoria (art. 65)
SIMS.mora=function(){
  $("sim").innerHTML=`<div class="calcf">${numIn("m-sal","Último salario mensual",3000000,"10000")}${dateIn("m-fin","Terminación del contrato","2026-03-31")}${dateIn("m-pago","Fecha de pago (o de consulta)",di(HOY))}</div><div class="res" id="m-res"></div><div id="m-steps"></div>`;
  const run=()=>{const sal=N("m-sal"),f=D("m-fin"),p=D("m-pago");if(!(sal>0)||!f||!p||LAB.cmp(p,f)<0){$("m-res").innerHTML=err("el pago no puede ser anterior a la terminación.");$("m-steps").innerHTML="";return}
    const dias=LAB.days360(f,p),{smmlv}=LAB.valores(f),R=LAB.moratoria({salario:sal,diasRetardo:dias,smmlv});
    $("m-res").innerHTML=tiles([["Días de retardo",dias.toLocaleString("es-CO")],["Días que se pagan",R.dias.toLocaleString("es-CO")],["Salario diario",$c(R.diario)],["Moratoria",$p(R.valor),"okt"]]);
    $("m-steps").innerHTML=stp(1,"Paso a paso",`<div class="eq al">Salario ${R.minimo?"≤":">"} 1 SMMLV (${$p(smmlv)}) ⇒ ${R.minimo?"régimen anterior: sin tope de 24 meses":"tope de 24 meses (720 días)"}<br>Moratoria = ${R.dias} × ${$c(R.diario)} = <b>${$c(R.valor)}</b></div>${R.intereses?`<p class="warn"><b>Desde el mes 25</b> (${R.diasInteres} días) ya no corre la indemnización diaria: se deben intereses moratorios sobre lo adeudado a la tasa máxima vigente, que certifica la Superintendencia Financiera.</p>`:""}`)};
  watch(["m-sal","m-fin","m-pago"],run);run();
  const deCaso=c=>{$("m-sal").value=c.salario;$("m-fin").value=c.retiro;run()};
  casoBar("moratoria",{cargar:deCaso,resultado:()=>{const sal=N("m-sal"),f=D("m-fin"),p=D("m-pago");if(!(sal>0)||!f||!p||LAB.cmp(p,f)<0)return null;const R=LAB.moratoria({salario:sal,diasRetardo:LAB.days360(f,p),smmlv:LAB.valores(f).smmlv});return{t:`${R.dias} días de retardo hasta el ${dt(p)}`,v:R.valor}}});
  const c0=CASO.dePre((()=>{const p=window.TOOL_PRE;window.TOOL_PRE=null;return p})());if(c0)deCaso(c0);
};

// ---- Jornada y horas extras
const KEYS={ord:"Ordinaria diurna",recN:"Ordinaria nocturna (recargo)",extraD:"Extra diurna",extraN:"Extra nocturna",domD:"Dominical o festiva diurna",domN:"Dominical o festiva nocturna",extraDomD:"Extra diurna dominical",extraDomN:"Extra nocturna dominical"};
const KCOL={ord:"--rule",recN:"--line",extraD:"--branch",extraN:"--bad",domD:"--good",domN:"--exam",extraDomD:"--branch",extraDomN:"--bad"};
SIMS.horas=function(){
  $("sim").innerHTML=`<p>Escribe un turno y la calculadora clasifica cada hora según la franja, el día y si supera la jornada ordinaria del día.</p>
  <div class="calcf">${numIn("h-sal","Salario mensual",2100000,"10000")}${dateIn("h-fec","Fecha del turno",di(HOY))}<label for="h-ini">Entrada<input id="h-ini" type="time" value="14:00" step="900"></label><label for="h-fin">Salida<input id="h-fin" type="time" value="23:00" step="900"></label>
  ${selIn("h-d1","El día de entrada es",[["ord","Ordinario"],["dom","Domingo o festivo"]],"ord")}${selIn("h-d2","Si pasa de medianoche, el día siguiente es",[["ord","Ordinario"],["dom","Domingo o festivo"]],"ord")}${numIn("h-ord","Horas ordinarias del turno",8,"0.25")}</div>
  <div class="row" id="h-pre"></div><div class="res" id="h-res"></div><div id="h-bar"></div><div class="tbl"><table id="h-tab"></table></div><div id="h-warn"></div>`;
  const P=[["Martes 2 p. m. a 11 p. m.","14:00","23:00","ord","ord",8],["Sábado 10 p. m. a domingo 6 a. m.","22:00","06:00","ord","dom",8],["Domingo 8 a. m. a 7 p. m.","08:00","19:00","dom","ord",8],["Lunes 6 a. m. a 4 p. m.","06:00","16:00","ord","ord",8]];
  $("h-pre").innerHTML=`<div class="chips pre">${P.map((p,i)=>`<button class="chip ws-chip" type="button" data-i="${i}">${p[0]}</button>`).join("")}</div>`;
  $("h-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const p=P[+b.dataset.i];$("h-ini").value=p[1];$("h-fin").value=p[2];$("h-d1").value=p[3];$("h-d2").value=p[4];$("h-ord").value=p[5];run()});
  const run=()=>{const sal=N("h-sal"),f=D("h-fec")||HOY,ordH=N("h-ord"),V_=LAB.valores(f);
    if(!(sal>0)||!(ordH>=0&&ordH<=12)){$("h-res").innerHTML=err("revisa el salario y las horas ordinarias (0 a 12).");return}
    const T=LAB.turno({ini:$("h-ini").value,fin:$("h-fin").value,dia1:$("h-d1").value,dia2:$("h-d2").value,ordH,inicioNoct:V_.nocturno});
    if(!T){$("h-res").innerHTML=err("escribe la entrada y la salida en formato de hora.");return}
    const hora=LAB.horaOrdinaria(sal,V_.horasMes),R=LAB.valorHoras(T.H,hora,V_.dominical),fac=LAB.factores(V_.dominical);
    $("h-res").innerHTML=tiles([["Jornada vigente",`${V_.jornada} h/semana → ${V_.horasMes} h/mes`],["Hora ordinaria",$c(hora)],["Recargo dominical",fmt(V_.dominical*100,0)+" %"],["Nocturno desde",V_.nocturno===19?"7:00 p. m.":"9:00 p. m."],["Pago adicional del turno",$p(R.total),"okt"]]);
    const a=T.seg[0].a,b=T.seg[T.seg.length-1].b,W=600,x=t=>14+(t-a)/(b-a)*(W-28),hh=t=>{const m=((t%1440)+1440)%1440;return `${Math.floor(m/60)}:${String(m%60).padStart(2,"0")}`};
    let g=T.seg.map(s=>`<rect x="${x(s.a)}" y="18" width="${Math.max(1,x(s.b)-x(s.a)-1)}" height="30" fill="var(${KCOL[s.k]})" fill-opacity="${s.k==="ord"?1:.8}"><title>${KEYS[s.k]}</title></rect>`).join("");
    for(let t=Math.ceil(a/60)*60;t<=b;t+=60)g+=`<line x1="${x(t)}" x2="${x(t)}" y1="48" y2="54" stroke="var(--muted)"/><text x="${x(t)}" y="68" text-anchor="middle" font-size="10.5" fill="var(--muted)" font-family="var(--f-mono)">${hh(t)}</text>`;
    $("h-bar").innerHTML=`<div class="legend">${[...new Set(T.seg.map(s=>s.k))].map(k=>`<span><i style="background:var(${KCOL[k]});height:10px"></i>${KEYS[k]}</span>`).join("")}</div><div class="plot"><svg viewBox="0 0 ${W} 76" role="img" aria-label="Clasificación de las horas del turno">${g}</svg></div>`;
    $("h-tab").innerHTML=`<tr><th>Tipo de hora</th><th>Horas</th><th>Factor adicional</th><th>Valor</th></tr>`+Object.keys(T.H).filter(k=>T.H[k]>0).map(k=>`<tr><td>${KEYS[k]}</td><td class="num">${fmt(T.H[k],2)}</td><td class="num">${k==="ord"?"0 (ya en el salario)":fmt(fac[k],2)}</td><td class="num">${$c(T.H[k]*hora*fac[k])}</td></tr>`).join("")+`<tr><td><b>Total adicional</b></td><td class="num">${fmt(T.total,2)}</td><td></td><td class="num"><b>${$c(R.total)}</b></td></tr>`;
    const ex=T.H.extraD+T.H.extraN+T.H.extraDomD+T.H.extraDomN;
    $("h-warn").innerHTML=ex>2?`<p class="warn"><b>Ojo:</b> el turno tiene ${fmt(ex,2)} horas extra; el máximo legal es 2 al día y 12 a la semana.</p>`:""};
  watch(["h-sal","h-fec","h-ini","h-fin","h-d1","h-d2","h-ord"],run);run();
};

// ---- Nómina mensual
SIMS.nom=function(){
  $("sim").innerHTML=`<div class="calcf">${numIn("n-sal","Salario mensual",1750905,"10000")}${numIn("n-dias","Días trabajados en el mes",30)}${dateIn("n-fec","Mes de la nómina",di(HOY))}${selIn("n-aux","¿Recibe auxilio de transporte?",[["si","Sí, si gana hasta 2 SMMLV"],["no","No (vive cerca o trabaja en casa)"]],"si")}</div>
  <h4 class="subh">Horas del mes</h4><div class="calcf">${Object.keys(KEYS).filter(k=>k!=="ord").map(k=>numIn("n-"+k,KEYS[k],0,"0.5")).join("")}</div>
  <div class="res" id="n-res"></div><div class="tbl"><table id="n-tab"></table></div><div id="n-envio"></div><div id="n-emp"></div>`;
  const ks=Object.keys(KEYS).filter(k=>k!=="ord");
  const run=()=>{const sal=N("n-sal"),dias=Math.round(N("n-dias")),f=D("n-fec")||HOY,V_=LAB.valores(f);
    if(!(sal>0)||!(dias>=0&&dias<=30)){$("n-res").innerHTML=err("revisa el salario y que los días estén entre 0 y 30.");return}
    const H={};ks.forEach(k=>{const v=N("n-"+k);H[k]=isFinite(v)&&v>0?v:0});
    const hora=LAB.horaOrdinaria(sal,V_.horasMes),X=LAB.valorHoras(H,hora,V_.dominical),R=LAB.nomina({salario:sal,dias,extras:X.total,smmlv:V_.smmlv,aux:V_.aux,auxDerecho:$("n-aux").value==="si"});
    $("n-res").innerHTML=tiles([["Total devengado",$p(R.dev)],["Total deducciones",$p(R.ded),"badt"],["Neto a pagar",$p(R.neto),"okt"],["IBC",`${$p(R.ibc)} (${fmt(R.veces,2)} SMMLV)`]]);
    const row=(a,b,c="")=>`<tr><td>${a}</td><td class="num ${c}">${b}</td></tr>`;
    $("n-tab").innerHTML=`<tr><th>Concepto</th><th>Valor</th></tr><tr><td colspan="2"><b>Devengados</b></td></tr>`+row(`Salario básico (${fm(dias)} días × ${$c(sal/30)})`,$c(R.basico))+X.items.map(i=>row(`${KEYS[i.k]}: ${fmt(i.h,2)} h × ${$c(hora)} × ${fmt(i.factor,2)}`,$c(i.valor))).join("")+row(R.auxT?`Auxilio de transporte (${fm(dias)} días)`:`Auxilio de transporte ${sal>2*V_.smmlv?"(no aplica: gana más de 2 SMMLV)":"(no aplica)"}`,$c(R.auxT))
      +`<tr><td colspan="2"><b>Deducciones</b></td></tr>`+row("Salud (4 % del IBC)",$c(R.salud))+row("Pensión (4 % del IBC)",$c(R.pension))+row(R.fsp?`Fondo de solidaridad pensional (${fmt(R.fsp*100,1)} %)`:"Fondo de solidaridad pensional (no aplica: menos de 4 SMMLV)",$c(R.fspV))+`<tr><td><b>Neto a pagar</b></td><td class="num"><b>${$c(R.neto)}</b></td></tr>`;
    $("n-envio").innerHTML=botonEnvio("n-send",`Lleva el devengado de este mes sin el auxilio (${$p(R.basico+X.total)}: salario de ${fm(dias)} días más horas extras y recargos) al renglón del mes en la liquidación de prestaciones.${dias<30?` Los ${30-dias} días no trabajados se envían como días del art. 51 (licencia o suspensión); si fueron por ingreso o retiro en el mes, ponlos en 0 en la liquidación.`:""}`);
    $("n-send").onclick=()=>{const f2=D("n-fec")||HOY;enviarALiq({y:f2.y,m:f2.m,basico:sal,extra:Math.round((R.basico+X.total-sal)*100)/100,art51:30-dias,nota:`Nómina: ${$p(R.basico+X.total)}`,origen:"la nómina"});
      $("n-send-m").innerHTML=` Listo: ${MESN[f2.m-1]} de ${f2.y} quedó para la liquidación. <button class="btn" type="button" data-go="liquidacion">Ir a la liquidación →</button>`};
    const E=R.empleador,tot=Object.values(E).reduce((a,b)=>a+b,0);
    $("n-emp").innerHTML=stp(1,"Lo que paga el empleador además del salario (aproximado)",`<div class="tbl"><table><tr><th>Concepto</th><th>Valor</th></tr>${[["Pensión (12 %)",E.pension],["ARL riesgo I (0,522 %)",E.arl],["Caja de compensación (4 %)",E.caja],...(R.veces>=10?[["Salud (8,5 %)",E.saludEmp],["ICBF (3 %)",E.icbf],["SENA (2 %)",E.sena]]:[]),["Cesantías (8,33 %)",E.cesantias],["Intereses sobre cesantías (12 % anual de las cesantías)",E.intereses],["Prima de servicios (8,33 %)",E.prima],["Vacaciones (4,17 %)",E.vacaciones]].map(([a,b])=>row(a,$c(b))).join("")}<tr><td><b>Costo adicional del mes</b></td><td class="num"><b>${$c(tot)}</b></td></tr></table></div>${R.veces<10?`<p class="hint" style="margin:0">Salud, ICBF y SENA no se pagan por trabajadores que ganan menos de 10 SMMLV (empresas exoneradas).</p>`:""}`)};
  watch(["n-sal","n-dias","n-fec","n-aux",...ks.map(k=>"n-"+k)],run);run();
};

// ---- Valores por fecha
SIMS.val=function(){
  $("sim").innerHTML=`<div class="calcf">${dateIn("v-f","Fecha",di(HOY))}</div><div class="res" id="v-res"></div><div class="tbl"><table id="v-tab"></table></div>`;
  const run=()=>{const f=D("v-f");if(!f){$("v-res").innerHTML=err("escribe una fecha.");return}const V_=LAB.valores(f);
    $("v-res").innerHTML=tiles([[`Salario mínimo ${V_.anioSM}`,$p(V_.smmlv)],["Auxilio de transporte",$p(V_.aux)],["Jornada máxima",`${V_.jornada} h/semana`],["Horas al mes",String(V_.horasMes)],["Hora ordinaria con el mínimo",$c(V_.smmlv/V_.horasMes)],["Recargo dominical",fmt(V_.dominical*100,0)+" %"],["Nocturno desde",V_.nocturno===19?"7:00 p. m.":"9:00 p. m."]]);
    const F=LAB.factores(V_.dominical);
    $("v-tab").innerHTML=`<tr><th>Hora</th><th>Factor</th><th>Valor con el salario mínimo</th></tr>`+Object.keys(KEYS).filter(k=>k!=="ord").map(k=>`<tr><td>${KEYS[k]}</td><td class="num">${fmt(F[k],2)}</td><td class="num">${$c(V_.smmlv/V_.horasMes*F[k])}</td></tr>`).join("")};
  watch(["v-f"],run);run();
};

// ---- Planilla de horas del taller: cada hora en su columna y pago por quincena o por el mes completo
const PLAP={
  ej1:{t:"Taller · Ejercicio 1 (ingresó por primera vez)",ingreso:2,venia:false,salario:2940000,x:"2-4: 8am-5pm\n5: 10pm-7am\n6: descanso\n7-11: 6pm-4am\n12: 1pm-8pm\n13: 2pm-11pm\n14-15: 2pm-11pm\n16-19: 8am-12m, 2pm-7pm\n20-21: 5am-3pm\n22-24: 11am-9pm\n25: permiso remunerado\n26: descanso\n27-28: 10pm-7am\n29-30: incapacidad\n31: 9pm-7am"},
  ej2:{t:"Taller · Ejercicio 2 (venía laborando)",ingreso:1,venia:true,salario:2850000,x:"1-4: 2pm-11pm\n5-6: descanso\n7-9: 9pm-7am\n10-12: sancion\n13-15: 7pm-4am\n16-19: 8am-12m, 2pm-8pm\n20-21: 10am-7pm\n22-23: 10pm-8am\n24: licencia no remunerada\n25: 10pm-8am\n26: incapacidad\n27-28: 2pm-11pm\n29: descanso\n30-31: licencia no remunerada"},
  pedro:{t:"Taller 2026-2 · Pedro, junio de 2026",mes:"2026-06",ingreso:1,venia:true,salario:4250000,n:30,w:"2",f:"8, 15, 29",j:7,d:"0.75",no:"19",x:"# Calendario del taller: el 1 de junio es martes; domingos 6, 13, 20 y 27\n# De lunes a sábado de 2 pm a 10 pm, festivos incluidos; descansa los domingos\n1-5: 2pm-10pm\n7-11: 2pm-10pm\n12-14: licencia no remunerada\n15-19: 2pm-10pm\n21-26: 2pm-10pm\n28-30: 2pm-10pm"},
  mariana:{t:"Taller · Mariana, octubre de 2026",mes:"2026-10",ingreso:1,venia:true,salario:4950000,n:31,w:"2",f:"7",j:7,d:"0.9",no:"19",x:"# Calendario del taller: el 1 de octubre es martes; domingos 6, 13, 20 y 27; festivo el lunes 7\n# De lunes a viernes de 10 pm a 6 am; los sábados de 10 pm a 5 am; descansa domingos y festivos\n1-4: 10pm-6am\n5: 10pm-5am\n8-11: 10pm-6am\n12: 10pm-5am\n14-18: 10pm-6am\n19: 10pm-5am\n21-25: 10pm-6am\n26: 10pm-5am\n28-29: 10pm-6am\n30-31: licencia no remunerada"},
  vacio:{t:"Empezar en blanco",ingreso:1,venia:true,salario:2000000,x:"1-3: 6am-2pm\n"}};
const DIAS=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],DI1="DLMMJVS";
const hh=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mi=m%60,ap=h<12?"a. m.":"p. m.",h12=h%12===0?12:h%12;return `${h12}:${String(mi).padStart(2,"0")} ${ap}`};
const hN=v=>v?(Math.round(v*100)/100).toLocaleString("es-CO"):"";
SIMS.planilla=function(){
  $("sim").innerHTML=`<div class="calcf">${selIn("pl-pre","Ejercicio",Object.keys(PLAP).map(k=>[k,PLAP[k].t]),"ej1")}</div>
  <details class="exted" open><summary>Datos del mes y del trabajador</summary><div class="calcf" style="margin-top:8px">
  <label for="pl-mes">Mes y año (para enviarlo a la liquidación)<input id="pl-mes" type="month" value=""></label>${numIn("pl-n","Días del mes",31)}${selIn("pl-w","El día 1 es",DIAS.map((d,i)=>[String(i),d]),"2")}<label for="pl-f">Festivos (días)<input id="pl-f" value="1, 14, 21"></label>
  ${selIn("pl-v","El trabajador",[["v","venía laborando"],["n","ingresó por primera vez"]],"n")}${numIn("pl-i","Día de ingreso",2)}
  ${numIn("pl-s","Salario mensual",2940000,"1000")}${numIn("pl-j","Jornada diaria (h, lunes a sábado)",7,"0.5")}
  ${selIn("pl-d","Recargo dominical y festivo",[["0.75","75 % (tabla del taller 2026-2)"],["0.8","80 % (desde 1-jul-2025)"],["0.9","90 % (desde 1-jul-2026)"],["1","100 % (desde 1-jul-2027)"]],"0.9")}
  ${selIn("pl-no","Jornada nocturna desde",[["19","7:00 p. m. (desde 25-dic-2025)"],["21","9:00 p. m. (antes)"]],"19")}
  ${selIn("pl-pd","Sanción o licencia en la semana",[["1","pierde el dominical (art. 173)"],["0","no afecta el dominical"]],"1")}
  ${selIn("pl-dt","Domingo trabajado",[["auto","R si descansa la semana siguiente, si no H"],["H","siempre H (7 h + 90 %)"],["R","siempre R (solo el 90 %)"]],"auto")}
  ${selIn("pl-pr","Dominical proporcional (si no cumplió la semana)",[["h","por horas: 7 × horas/42"],["d","por días: 7 × días/6"]],"h")}
  ${selIn("pl-in","Incapacidad (días 1 y 2)",[["2/3","2/3 del día (art. 227)"],["1","día completo"]],"2/3")}
  ${selIn("pl-ax","Auxilio de transporte",[["0","no incluir"],["1","incluir si gana hasta 2 SMMLV"]],"0")}
  ${selIn("pl-de","Deducciones",[["0","no descontar"],["1","salud 4 % y pensión 4 %"]],"0")}
  ${selIn("pl-pe","Liquidar el pago por",[["q","quincenas (1 a 15 y 16 a fin de mes)"],["m","mes completo"]],"q")}</div></details>
  <label for="pl-tx" style="display:block;font-size:13px;margin-top:6px"><b>Novedades del mes</b>, una por línea: «días: horario» o «días: novedad». Horarios: <code>8am-5pm</code>, <code>10:00pm-7:00am</code>, <code>8am-12m, 2pm-7pm</code>. Novedades: <code>descanso</code>, <code>permiso remunerado</code>, <code>incapacidad</code>, <code>sancion</code>, <code>licencia no remunerada</code>, <code>vacaciones</code>. Los domingos y festivos que no escribas se toman como descanso.</label>
  <textarea id="pl-tx" class="pltx" rows="10" spellcheck="false"></textarea><div id="pl-out" class="slv-out"></div>`;
  const load=k=>{const p=PLAP[k];$("pl-pre").value=k;$("pl-tx").value=p.x;$("pl-s").value=p.salario;$("pl-v").value=p.venia?"v":"n";$("pl-i").value=p.ingreso;$("pl-n").value=p.n||31;$("pl-w").value=p.w||"2";$("pl-f").value=p.f||"1, 14, 21";$("pl-j").value=p.j||7;$("pl-d").value=p.d||"0.9";$("pl-no").value=p.no||"19";$("pl-mes").value=p.mes||""};
  const run=()=>{const out=$("pl-out");const n=Math.round(N("pl-n")),w=+$("pl-w").value,sal=N("pl-s"),J=N("pl-j"),venia=$("pl-v").value==="v",ing=venia?1:Math.round(N("pl-i"));
    $("pl-i").disabled=venia;
    if(!(n>=28&&n<=31)||!(sal>0)||!(J>0&&J<=10)||!(ing>=1&&ing<=n)){out.innerHTML=`<p class="err">Revisa los datos: días del mes entre 28 y 31, salario positivo, jornada entre 0 y 10 horas y día de ingreso dentro del mes.</p>`;return}
    const fs=($("pl-f").value.match(/\d+/g)||[]).map(Number).filter(d=>d>=1&&d<=n);
    const p=LAB.parsePlanilla($("pl-tx").value,n);if(p.errs.length){out.innerHTML=`<p class="err">Revisa las novedades: ${p.errs.join(" ")}</p>`;return}
    const V0=LAB.valores({y:2026,m:10,d:1}),cfg={ndias:n,dow1:w,festivos:fs,ingreso:ing,venia,salario:sal,jornada:J,d:+$("pl-d").value,noct:+$("pl-no").value,smmlv:V0.smmlv,pierde:$("pl-pd").value==="1",propHoras:$("pl-pr").value==="h",domTrab:$("pl-dt").value,ndiasPrev:30,incap:$("pl-in").value==="2/3"?2/3:1};
    const r=LAB.planilla(cfg,p.rec),C=LAB.COLS,F=r.F;
    // calendario
    let cal=`<div class="tbl plcal"><table><tr>${DI1.split("").map(x=>`<th>${x}</th>`).join("")}</tr><tr>`;for(let i=0;i<w;i++)cal+="<td></td>";
    for(let d=1;d<=n;d++){const row=r.rows[d-1],tp=row.tipo;if((w+d-1)%7===0&&d>1)cal+="</tr><tr>";cal+=`<td class="${row.dom?"pdom":""}${d<ing?" pfuera":""}" title="${tp||""}"><b>${d}</b><small>${tp==="trabajo"?"✓":tp?{descanso:"desc.",permiso:"perm.",incapacidad:"incap.",sancion:"sanc.",licencia:"lic.",vacaciones:"vac."}[tp]:""}</small></td>`}
    cal+="</tr></table></div>";
    // tabla principal
    const head=`<tr><th>Día</th>${C.map(k=>`<th title="${LAB.NOMCOL[k]}">${k}<br><small>${fmt(F[k],2)}</small></th>`).join("")}<th>Nota</th></tr>`;
    const corto=row=>{const t=[];if(row.dow===0&&row.trabajo)t.push(row.comp>0?`horas en R (descansa el ${row.comp})`:row.comp===-1?"horas en R":"horas en H (no descansa la semana siguiente)");if(row.dom&&row.desc){const w=row.desc.why;t.push(row.desc.h?(row.descSum?(row.desc.prop?`descanso proporcional: ${row.desc.form} = ${hN(row.descSum)} h`:(row.fest&&row.dow!==0?"festivo remunerado 7 h":"descanso dominical 7 h")):"descanso proporcional no se suma"):(/no trabajaba/.test(w)?"aún no trabajaba":/31/.test(w)?"día 31":/incapacidad/.test(w)?"recibe incapacidad":"pierde el dominical"))}
      if(row.trabajo){if(row.base==="31")t.push("día 31: base ya pagada");const ex=["HED","HEN","HEDD","HEND"].reduce((q,k)=>q+row.h[k],0);if(ex>2)t.push(`⚠ ${hN(ex)} h extra (máx. 2)`)}
      if(row.compDe)t.push(`compensatorio del domingo ${row.compDe}`);const x=row.tipo;if(x&&x!=="trabajo")t.push({descanso:row.dom||row.compDe?"":"descanso remunerado",permiso:"permiso remunerado",incapacidad:"incapacidad 2/3",sancion:"sanción (art. 51)",licencia:"licencia no remunerada",vacaciones:"vacaciones"}[x]+(row.d===31?" (no suma)":""));
      return t.filter(Boolean).join(" · ")};
    const largo=row=>{const t=[];if(row.dom&&row.desc)t.push(row.desc.h?`${hN(row.descSum)} h en HD: ${row.desc.why}.`:`Sin descanso pagado: ${row.desc.why}.`);
      if(row.trabajo){const ex=["HED","HEN","HEDD","HEND"].reduce((q,k)=>q+row.h[k],0);if(ex>2)t.push(`Son ${hN(ex)} horas extra: pasan el máximo legal de 2 al día, pero se pagan igual.`);if(row.h.D0)t.push(`${hN(row.h.D0)} h diurnas ordinarias del día 31 no suman: ya las paga el salario.`)}
      t.push(...row.notas.map(z=>z.charAt(0).toUpperCase()+z.slice(1)+"."));return t};
    const rowH=row=>`<tr class="${row.dom?"pdom":""}"><td><b>${row.d}</b> ${DI1[row.dow]}${row.fest?" F":""}</td>${C.map(k=>`<td class="num">${hN(row.h[k])}</td>`).join("")}<td class="pnota">${corto(row)}</td></tr>`;
    const mes=$("pl-pe").value==="m",TM={h:Object.fromEntries(C.map(k=>[k,r.tot[0].h[k]+r.tot[1].h[k]])),val:Object.fromEntries(C.map(k=>[k,r.tot[0].val[k]+r.tot[1].val[k]])),total:r.tot[0].total+r.tot[1].total};
    const sub=(t,lab,x30)=>`<tr class="psub"><td>${lab}</td>${C.map(k=>`<td class="num">${hN(t.h[k])}</td>`).join("")}<td>${x30&&r.extra30?`incluye ${hN(r.extra30)} h para completar 30 días`:""}</td></tr>`;
    let tab=mes?`<div class="tbl ptab"><table>${head}${r.rows.map(rowH).join("")}${sub(TM,"Total del mes",true)}</table></div>`
      :`<div class="tbl ptab"><table>${head}${r.rows.filter(x=>x.d<=15).map(rowH).join("")}${sub(r.tot[0],"1.ª quincena")}${r.rows.filter(x=>x.d>15).map(rowH).join("")}${sub(r.tot[1],"2.ª quincena",true)}</table></div>`;
    // pago
    const aux=$("pl-ax").value==="1"&&sal<=2*V0.smmlv,ded=$("pl-de").value==="1";
    const diasAux=q=>r.rows.filter(x=>(q==="m"?true:q?x.d>15:x.d<=15)&&x.d<=30&&x.tipo==="trabajo").length;
    const pago=i=>{const t=i==="m"?TM:r.tot[i];const ax=aux?V0.aux/30*diasAux(i):0,dd=ded?t.total*0.08:0;
      return `<div class="tbl"><table><tr><th>Columna</th><th>Horas</th><th>Factor</th><th>Valor de la hora × factor</th><th>Valor</th></tr>${C.filter(k=>t.h[k]).map(k=>`<tr><td>${k} · ${LAB.NOMCOL[k]}</td><td class="num">${hN(t.h[k])}</td><td class="num">${fmt(F[k],2)}</td><td class="num">${$c(r.vh*F[k])}</td><td class="num">${$p(t.val[k])}</td></tr>`).join("")}
      <tr class="psub"><td>Total por horas</td><td class="num">${hN(C.reduce((s,k)=>s+t.h[k],0))}</td><td></td><td></td><td class="num">${$p(t.total)}</td></tr>
      ${aux?`<tr><td>Auxilio de transporte (${diasAux(i)} días trabajados)</td><td></td><td></td><td></td><td class="num">${$p(ax)}</td></tr>`:""}${ded?`<tr><td>Salud y pensión (8 % de lo que no es auxilio)</td><td></td><td></td><td></td><td class="num">−${$p(dd)}</td></tr>`:""}
      <tr class="psub"><td><b>A pagar</b></td><td></td><td></td><td></td><td class="num"><b>${$p(t.total+ax-dd)}</b></td></tr></table></div>`};
    // detalle de cada día
    const det=r.rows.filter(x=>x.trabajo||largo(x).length).map(row=>{const segs=row.trabajo?`<ul>${row.detalle.map(s=>`<li>${hh(s.a)} a ${hh(s.b)}${s.sd!==row.d?` (ya es el día ${s.sd>n?s.sd-n+" del mes siguiente":s.sd})`:""}: ${s.extra?"extra":"ordinaria"}, ${s.noct?"nocturna":"diurna"}${s.dom?", en domingo o festivo":""} → <b>${(s.b-s.a)/60} h ${s.k==="D0"?"sin pago adicional":s.k}</b></li>`).join("")}</ul>`:"";
      return `<details class="pdet"><summary>Día ${row.d} (${DIAS[row.dow]}${row.fest?", festivo":""})${row.trabajo?"":" · "+corto(row)}</summary>${segs}${largo(row).map(z=>`<p class="hint">${z}</p>`).join("")}${row.base==="comp"?`<p class="hint">Como descansa en la semana siguiente, las horas ordinarias de este turno llevan solo el recargo: RDD de día, RND de noche y RN si el turno pasa a un día hábil. El domingo igual suma sus horas de descanso en HD, y el día de descanso también se paga.</p>`:""}${row.base==="31"?`<p class="hint">El salario mensual cubre 30 días: en el 31 las ordinarias diurnas no suman, las nocturnas llevan solo el recargo (RN o RND) y las extra se pagan completas.</p>`:""}</details>`}).join("");
    out.innerHTML=`<div class="stepc"><h4><span class="n">1</span>Calendario</h4>${cal}<p class="hint">Sombreados: domingos y festivos. Valor de la hora ordinaria: ${$p(sal)} / (${hN(J)} × 30) = <b>${$c(r.vh)}</b>.</p></div>
    <div class="stepc"><h4><span class="n">2</span>Planilla de horas</h4><p class="hint">Cada turno se asigna a la fila del día en que empieza. Cada franja se clasifica por el día en que cae: lo que pasa de medianoche a un domingo o festivo es dominical. Las primeras ${hN(J)} horas del turno son ordinarias y el resto son extra.</p>${tab}</div>
    ${mes?`<div class="stepc"><h4><span class="n">3</span>Pago del mes completo (días 1 a ${n})</h4>${pago("m")}<div class="verdict acc">Total del mes por horas: ${$p(TM.total)}</div></div>`
    :`<div class="stepc"><h4><span class="n">3</span>Pago de la primera quincena (días 1 a 15)</h4>${pago(0)}</div>
    <div class="stepc"><h4><span class="n">4</span>Pago de la segunda quincena (días 16 a ${n})</h4>${pago(1)}<div class="verdict acc">Total del mes por horas: ${$p(r.tot[0].total+r.tot[1].total)}</div></div>`}
    ${botonEnvio("pl-send",`Lleva el total de este mes (${$p(r.tot[0].total+r.tot[1].total)}) y sus ${Math.min(30,r.rows.filter(x=>x.tipo==="licencia"||x.tipo==="sancion").length)} días de licencia o suspensión (art. 51) al renglón del mes en la liquidación de prestaciones.`)}
    <div class="stepc"><h4><span class="n">${mes?4:5}</span>Detalle de cada día</h4><p class="hint">Abre un día para ver cada franja del turno, en qué columna quedó y por qué.</p>${det}</div>`};
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;const cP=PLAP[pre]?(CASO_PRE[pre]&&CASO.taller(pre),null):CASO.dePre(pre),viaPre=!!(pre&&PLAP[pre])||!!cP;load(PLAP[pre]?pre:"ej1");
  $("pl-pre").addEventListener("change",()=>{load($("pl-pre").value);run()});
  $("sim").addEventListener("click",e=>{if(e.target.id!=="pl-send")return;const mm=$("pl-send-m"),v=$("pl-mes").value;
    if(!/^\d{4}-\d{2}$/.test(v)){mm.innerHTML=` Escribe arriba el <b>mes y año</b> de esta planilla.`;$("pl-mes").focus();return}
    const n=Math.round(N("pl-n")),sal=N("pl-s"),p=LAB.parsePlanilla($("pl-tx").value,n);if(p.errs.length)return;
    const fs=($("pl-f").value.match(/\d+/g)||[]).map(Number).filter(d=>d>=1&&d<=n),V0=LAB.valores({y:2026,m:10,d:1}),venia=$("pl-v").value==="v";
    const r=LAB.planilla({ndias:n,dow1:+$("pl-w").value,festivos:fs,ingreso:venia?1:Math.round(N("pl-i")),venia,salario:sal,jornada:N("pl-j"),d:+$("pl-d").value,noct:+$("pl-no").value,smmlv:V0.smmlv,pierde:$("pl-pd").value==="1",propHoras:$("pl-pr").value==="h",domTrab:$("pl-dt").value,ndiasPrev:30,incap:$("pl-in").value==="2/3"?2/3:1},p.rec);
    const tot=r.tot[0].total+r.tot[1].total,a51=Math.min(30,r.rows.filter(x=>x.tipo==="licencia"||x.tipo==="sancion").length),[y,m]=v.split("-").map(Number);
    enviarALiq({y,m,basico:sal,extra:Math.round((tot-sal)*100)/100,art51:a51,nota:`Planilla: ${$p(tot)}${a51?`, ${a51} días art. 51`:""}`,origen:"el resolvedor de horas extras"});
    mm.innerHTML=` Listo: ${MESN[m-1]} de ${y} quedó para la liquidación. <button class="btn" type="button" data-go="liquidacion">Ir a la liquidación →</button>`});
  $("pl-mes").addEventListener("change",()=>{const v=$("pl-mes").value;if(!/^\d{4}-\d{2}$/.test(v))return;const [y,m]=v.split("-").map(Number);
    $("pl-n").value=new Date(Date.UTC(y,m,0)).getUTCDate();$("pl-w").value=String(new Date(Date.UTC(y,m-1,1)).getUTCDay());run()});
  const PIDS=["pl-pre","pl-mes","pl-n","pl-w","pl-f","pl-v","pl-i","pl-s","pl-j","pl-d","pl-no","pl-pd","pl-pr","pl-dt","pl-in","pl-ax","pl-de","pl-pe","pl-tx"];
  watch(PIDS.slice(1),run);run();
  guardados("planilla",{get:formGet(PIDS),set:formSet(PIDS,run),label:"Planilla",restore:!viaPre});
  const deCaso=c=>{const q=c.planilla||{};if(q.state)formSet(PIDS,run)(q.state);else if(q.pre&&PLAP[q.pre]){load(q.pre);run()}else{$("pl-s").value=c.salario;run()}};
  const resPl=()=>{const n=Math.round(N("pl-n")),sal=N("pl-s"),v=$("pl-mes").value,p=LAB.parsePlanilla($("pl-tx").value,n);if(p.errs.length||!(sal>0)||!/^\d{4}-\d{2}$/.test(v))return null;
    const fs=($("pl-f").value.match(/\d+/g)||[]).map(Number).filter(d=>d>=1&&d<=n),V0=LAB.valores({y:2026,m:10,d:1}),venia=$("pl-v").value==="v";
    const r=LAB.planilla({ndias:n,dow1:+$("pl-w").value,festivos:fs,ingreso:venia?1:Math.round(N("pl-i")),venia,salario:sal,jornada:N("pl-j"),d:+$("pl-d").value,noct:+$("pl-no").value,smmlv:V0.smmlv,pierde:$("pl-pd").value==="1",propHoras:$("pl-pr").value==="h",domTrab:$("pl-dt").value,ndiasPrev:30,incap:$("pl-in").value==="2/3"?2/3:1},p.rec);
    const tot=r.tot[0].total+r.tot[1].total,a51=r.rows.filter(x=>x.d<=31&&(x.tipo==="licencia"||x.tipo==="sancion")).length,[y,m]=v.split("-").map(Number);
    return{t:`${MESN[m-1]} de ${y}`,v:tot,y,m,sal,a51}};
  casoBar("planilla",{cargar:deCaso,resultado:()=>{const r=resPl();if(!r)return null;return{t:r.t,v:r.v}},
    despues:c=>{const r=resPl();if(!r)return;c.meses=c.meses||{};c.meses[r.y+"-"+r.m]=[r.sal,Math.round((r.v-r.sal)*100)/100,r.a51,`Planilla: ${$p(r.v)}${r.a51?`, ${r.a51} días art. 51`:""}`];c.planilla={state:formGet(PIDS)()};CASO.guardar(c)}});
  if(cP)deCaso(cP)};

// ---- Prima de servicios (art. 306)
SIMS.prima=function(){
  const MES=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const EJ={min:{t:"Salario mínimo, semestre completo",sem:"1",ing:"",ret:"",m:Array(6).fill(1750905),aux:"auto",aus:0,pago:"",bm:""},
    ing:{t:"Ingresó el 15 de marzo",sem:"1",ing:"2026-03-15",ret:"",m:Array(6).fill(2500000),aux:"auto",aus:0,pago:"",bm:""},
    var:{t:"Salario variable (horas extra)",sem:"1",ing:"",ret:"",m:[2000000,2000000,2000000,2200000,2350000,2150000],aux:"auto",aus:0,pago:"",bm:"2000000"},
    mora1:{t:"Pagó la prima de junio el 15 de julio",sem:"1",ing:"",ret:"",m:Array(6).fill(1750905),aux:"auto",aus:0,pago:"2026-07-15",bm:""},
    mora2:{t:"Pagó la de diciembre el 28",sem:"2",ing:"",ret:"",m:Array(6).fill(1750905),aux:"auto",aus:0,pago:"2026-12-28",bm:""},
    aus:{t:"10 días de licencia no remunerada",sem:"1",ing:"",ret:"",m:Array(6).fill(1750905),aux:"auto",aus:10,pago:"",bm:""}};
  $("sim").innerHTML=`<p class="hint" style="margin-top:0">Ejemplos:</p><div class="chips pre" id="pr-ej">${Object.entries(EJ).map(([k,v])=>`<button type="button" data-k="${k}">${v.t}</button>`).join("")}</div>
  <div class="calcf">${selIn("pr-sem","Semestre",[["1","Primer semestre: 1 de enero a 30 de junio"],["2","Segundo semestre: 1 de julio a 31 de diciembre"]],"1")}${numIn("pr-an","Año",2026)}
  ${dateIn("pr-ing","Fecha de ingreso (vacía si ya trabajaba)","")}${dateIn("pr-ret","Fecha de retiro (vacía si sigue)","")}</div>
  <p class="hint">Salario devengado de cada mes: el salario mensual más horas extra, recargos y comisiones de ese mes, sin el auxilio de transporte. Si entró a mitad de mes, escribe el salario del mes completo; los días se ajustan solos.</p>
  <div class="calcf" id="pr-m"></div>
  <div class="calcf">${selIn("pr-aux","Auxilio de transporte",[["auto","Automático: si el salario es de hasta 2 SMMLV"],["1","Sí lo recibe"],["0","No lo recibe"]],"auto")}${numIn("pr-aus","Días no laborados (licencias no remuneradas, suspensiones)",0)}
  ${dateIn("pr-pago","Fecha en que pagó la prima (para la mora)","")}${numIn("pr-bm","Salario básico para la mora (vacío = el del último mes)","","1000")}</div>
  <div class="res" id="pr-res"></div><div id="pr-steps"></div>`;
  const drawM=()=>{const s=+$("pr-sem").value,old=[...$("pr-m").querySelectorAll("input")].map(i=>i.value);
    $("pr-m").innerHTML=Array.from({length:6},(_,i)=>numIn("pr-m"+i,MES[(s===1?0:6)+i],old[i]||1750905,"1000")).join("");
    for(let i=0;i<6;i++){$("pr-m"+i).addEventListener("input",run)}};
  const run=()=>{const sem=+$("pr-sem").value,anio=Math.round(N("pr-an")),meses=Array.from({length:6},(_,i)=>N("pr-m"+i)),av=$("pr-aux").value;
    if(!(anio>=2025&&anio<=2030)||meses.some(v=>!(v>0))){$("pr-res").innerHTML=err("escribe un año entre 2025 y 2030 y un salario positivo en cada mes.");$("pr-steps").innerHTML="";return}
    const R=LAB.prima({anio,sem,ingreso:D("pr-ing"),retiro:D("pr-ret"),meses,aux:av==="auto"?"auto":av==="1",ausencias:Math.max(0,Math.round(N("pr-aus")||0)),pago:D("pr-pago"),basicoMora:N("pr-bm")});
    if(R.error){$("pr-res").innerHTML=err(R.error);$("pr-steps").innerHTML="";return}
    const nm=R.idx.map(i=>MES[R.S.m0-1+i]),ultNm=nm.slice(-3).map(x=>x.toLowerCase());
    $("pr-res").innerHTML=tiles([["Días trabajados",String(R.dias)],["Base mensual",$p(R.base)],["Prima del semestre",$p(R.valor),"okt"],...(R.mora?[["Mora ("+R.mora.dias+" días)",$p(R.mora.valor)]]:[])]);
    let h=stp(1,"Periodo y días (año de 360 días)",`<div class="eq al">Del ${dt(R.a)} al ${dt(R.b)}: ${R.diasPer} días${R.ausencias?` − ${R.ausencias} días no laborados = <b>${R.dias}</b>`:""}${R.diasPer===180&&!R.ausencias?" (el semestre completo)":""}</div><p class="hint">Cada mes cuenta 30 días, aunque tenga 31 o 28.</p>`);
    h+=stp(2,"Salario base",`<div class="tbl"><table><tr>${nm.map(x=>`<th class="num">${x}</th>`).join("")}</tr><tr>${R.sal.map(v=>`<td class="num">${$p(v)}</td>`).join("")}</tr></table></div>
      <div class="eq al">${R.iguales?`Los últimos ${R.ult.length===3?"tres":R.ult.length} meses (${ultNm.join(", ")}) son iguales ⇒ base = salario actual = <b>${$p(R.basico)}</b>`:`Los últimos tres meses (${ultNm.join(", ")}) no son iguales ⇒ base = promedio de lo devengado en ${nm.length===6?"el semestre":"lo trabajado del semestre"} = (${R.sal.map($p).join(" + ")}) / ${R.sal.length} = <b>${$c(R.basico)}</b>`}<br>
      Auxilio de transporte: ${R.recibeAux?`sí, porque ${av==="auto"?`el salario es de hasta 2 SMMLV (${$p(2*R.smmlv)})`:"lo recibe"} ⇒ + ${$p(R.auxV)}`:`no${av==="auto"?`, porque el salario supera 2 SMMLV (${$p(2*R.smmlv)})`:""}`}<br>
      Base para la prima = ${$c(R.basico)} + ${$p(R.auxV)} = <b>${$c(R.base)}</b></div>`);
    h+=stp(3,"Prima",`<div class="eq al">Prima = base × días / 360 = ${$c(R.base)} × ${R.dias} / 360 = <b>${$c(R.valor)}</b></div><p class="hint">En Excel, con la base en la celda B1: <code>=B1*${R.dias}/360</code>. Un semestre completo da medio mes de base (15 días de salario).</p>`);
    h+=stp(4,"Plazo y mora",R.retiroAntes?`<p>El contrato terminó el ${dt(R.b)}, antes del fin del semestre: esta prima proporcional se paga con la liquidación final. Si no se paga, aplica la <button class="btn" type="button" data-go="moratoria">indemnización moratoria (art. 65)</button>.</p>`
      :`<p>Se paga a más tardar el <b>${dt(R.S.limite)}</b>. Desde el ${dt(LAB.addDays(R.S.limite,1))} el empleador está en mora.</p>${R.mora?`<div class="eq al">Días de mora: del ${dt(R.mora.desde)} al ${dt(D("pr-pago"))} = <b>${R.mora.dias}</b><br>Mora = salario básico / 30 × días = ${$p(R.mora.basico)} / 30 × ${R.mora.dias} = ${$c(R.mora.diario)} × ${R.mora.dias} = <b>${$c(R.mora.valor)}</b></div><p class="hint">Con el salario básico, sin auxilio de transporte, como se vio en clase. Total a pagar: prima ${$p(R.valor)} + mora ${$p(R.mora.valor)} = ${$p(R.valor+R.mora.valor)}.</p>`:`<p class="hint">Escribe la fecha en que pagó para calcular la mora.</p>`}`);
    $("pr-steps").innerHTML=h};
  const setEJ=k=>{const e=EJ[k];$("pr-sem").value=e.sem;drawM();e.m.forEach((v,i)=>$("pr-m"+i).value=v);$("pr-an").value=2026;$("pr-ing").value=e.ing;$("pr-ret").value=e.ret;$("pr-aux").value=e.aux;$("pr-aus").value=e.aus;$("pr-pago").value=e.pago;$("pr-bm").value=e.bm;run()};
  $("pr-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setEJ(b.dataset.k)});
  $("pr-sem").addEventListener("change",()=>{drawM();run()});
  watch(["pr-an","pr-ing","pr-ret","pr-aux","pr-aus","pr-pago","pr-bm"],run);
  drawM();run();
  {const ids=["pr-an","pr-ing","pr-ret","pr-aux","pr-aus","pr-pago","pr-bm"];guardados("prima",{label:"Prima",restore:true,
    get:()=>Object.assign(formGet(ids)(),{sem:$("pr-sem").value,m:Array.from({length:6},(_,i)=>$("pr-m"+i).value)}),
    set:st=>{$("pr-sem").value=st.sem||"1";drawM();(st.m||[]).forEach((v,i)=>{if($("pr-m"+i))$("pr-m"+i).value=v});formSet(ids,run)(st)}})}
};

// ---- Liquidación de prestaciones con el formato de clase (primas, cesantías e intereses)
SIMS.liq=function(){
  const MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],Cap=s=>s[0].toUpperCase()+s.slice(1);
  const f2=d=>`${d.d}/${d.m}/${String(d.y).slice(2)}`,n=v=>Math.round(v).toLocaleString("es-CO");
  const CLASE={ini:"2025-09-20",ret:"2026-11-03",m:{"2025-9":[2000000,0,0,""],"2025-10":[2000000,0,0,""],"2025-11":[2000000,0,0,""],"2025-12":[2000000,0,0,""],"2026-1":[2900000,0,0,""],"2026-2":[2900000,0,0,""],"2026-3":[2900000,0,0,""],"2026-4":[2900000,0,0,""],"2026-5":[2900000,0,30,"Art. 51"],"2026-6":[2900000,0,0,""],"2026-7":[2900000,50000,0,"Horas extra"],"2026-8":[2900000,400000,0,"Recargos"],"2026-9":[2900000,400000,0,"Recargos"],"2026-10":[2900000,400000,0,"Recargos"],"2026-11":[2900000,400000,0,"Recargos"]},pagos:{prima:false,ces:false,int:false}};
  $("sim").innerHTML=`<div class="chips pre" id="lq-ej"><button type="button" data-k="clase">Ejercicio de clase: 20 sep 2025 a 3 nov 2026, no le han pagado primas</button><button type="button" data-k="pedro">Taller 2026-2: Pedro (2025 y 2026)</button><button type="button" data-k="mariana">Taller: Mariana (2025 y 2026)</button><button type="button" data-k="limpio">Empezar uno nuevo</button></div>
  <div class="calcf">${dateIn("lq-ini","Fecha de inicio","2025-09-20")}${dateIn("lq-ret","Fecha de retiro (o de corte)","2026-11-03")}</div>
  <div id="lq-env"></div>
  <p class="hint"><b>¿El ejercicio trae la nómina de un mes</b> (horas extras, recargos, licencias)? Calcúlala en la <button class="btn" type="button" data-go="nomina">Nómina mensual</button> o en el <button class="btn" type="button" data-go="planilla">Resolvedor de horas extras</button> y toca «Enviar este mes a la liquidación»: el devengado y los días del art. 51 llegan solos a su renglón.</p>
  <p class="hint">Un renglón por mes. <b>Básico</b>: el salario mensual del contrato. <b>Extras</b>: horas extra, recargos y comisiones de ese mes. <b>Art. 51</b>: días de suspensión (licencia no remunerada, sanción), que se restan de los días. Si entró o salió a mitad de mes, escribe el salario del mes completo.</p>
  <div class="tbl"><table id="lq-m"></table></div>
  <div class="chips" style="margin:8px 0"><label class="chkl"><input type="checkbox" id="lq-pp"> Las primas se pagaron a tiempo</label><label class="chkl"><input type="checkbox" id="lq-pc"> Las cesantías se consignaron a tiempo</label><label class="chkl"><input type="checkbox" id="lq-pi"> Los intereses se pagaron a tiempo</label></div>
  <div class="res" id="lq-res"></div><div id="lq-out"></div>`;
  let vals={};
  const months=()=>{const a=D("lq-ini"),b=D("lq-ret");if(!a||!b||LAB.cmp(a,b)>0)return null;const o=[];let y=a.y,m=a.m;while(y*12+m<=b.y*12+b.m&&o.length<120){o.push([y,m]);m++;if(m>12){m=1;y++}}return o};
  const read=()=>{$("lq-m").querySelectorAll("tr[data-k]").forEach(tr=>{const q=tr.querySelectorAll("input");vals[tr.dataset.k]=[+q[0].value||0,+q[1].value||0,Math.round(+q[2].value||0),q[3].value]})};
  const draw=()=>{read();const ms=months();if(!ms){$("lq-m").innerHTML="";return}let last=[1750905,0,0,""];
    $("lq-m").innerHTML=`<tr><th>Mes</th><th class="num">Básico</th><th class="num">Extras</th><th class="num">Art. 51 (días)</th><th>Nota</th></tr>`+ms.map(([y,m])=>{const k=y+"-"+m,v=vals[k]||[last[0],0,0,""];last=v;vals[k]=v;
      return`<tr data-k="${k}"><td>${Cap(MES[m-1])} ${y}</td><td><input type="number" step="1000" value="${v[0]}" aria-label="Básico ${MES[m-1]} ${y}"></td><td><input type="number" step="1000" value="${v[1]}" aria-label="Extras"></td><td><input type="number" min="0" max="30" value="${v[2]}" aria-label="Días art. 51"></td><td><input type="text" value="${v[3]}" aria-label="Nota"></td></tr>`}).join("");
    $("lq-m").querySelectorAll("input").forEach(i=>i.addEventListener("input",run));run()};
  const FORM=k=>{const F={
    prima:[["Prima","(salario base + auxilio de transporte) × (días del semestre − días del art. 51) / 360","art. 306: 30 días de salario por año, pagados por semestres"],["Salario base","salario del último mes si los tres últimos meses son iguales; si no, promedio de lo devengado en todos los meses del semestre, con los meses suspendidos en 0","como en clase"],["Auxilio de transporte","se suma solo si el salario básico es de hasta 2 SMMLV",""],["Plazos","30 de junio (primer semestre) y 20 de diciembre (segundo)",""],["Mora","días de retraso × salario básico / 30, desde el 1 de julio o el 21 de diciembre","regla de clase"]],
    ces:[["Cesantías","(salario base + auxilio de transporte) × (días del año − días del art. 51) / 360","art. 249: un mes de salario por año"],["Salario base","igual que en la prima, pero con los meses del año",""],["Plazo","consignar en el fondo a más tardar el 14 de febrero del año siguiente; las del año del retiro se pagan al trabajador","Ley 50 de 1990, art. 99"],["Mora","días de retraso × salario básico / 30, desde el 15 de febrero hasta el retiro","art. 99, num. 3"]],
    int:[["Intereses","cesantías × días trabajados × 12 % / 360","Ley 52 de 1975: 12 % anual sobre el saldo"],["Plazo","pagarlos directamente al trabajador a más tardar el 31 de enero; los del año del retiro, con la liquidación",""],["Sanción","si no se pagan a tiempo, un valor adicional igual a los intereses","Ley 52 de 1975, art. 1"]]}[k];
    return`<div class="tbl lq-ftab"><table><tr><th>Término</th><th>Cómo se calcula</th></tr>${F.map(([a,b,c])=>`<tr><td><b>${a}</b></td><td>${b}${c?` <small>(${c})</small>`:""}</td></tr>`).join("")}</table></div>`};
  const fila=(nombre,r,extra)=>{const P=r.tipo==="prima"?"Prima":"Cesantías";return`<div class="lq-b"><div class="lq-h">${nombre}</div>
    <div class="lq-fs"><div><span class="lq-fn">Días</span> = días del ${r.tipo==="prima"?"semestre":"año"} trabajados (año de 360, contando el primero y el último) = ${f2(r.ini)} – ${f2(r.fin)} = <b>${r.dias360}</b></div>
    <div><span class="lq-fn">${P}</span> = (salario base + auxilio de transporte) × (días − días del art. 51) / 360</div>
    <div class="lq-sub">= (${n(r.B.sal)} + ${n(r.B.aux)}) × (${r.dias360} − ${r.aus}) / 360 = <b class="lq-box">${n(r.valor)}</b></div>
    ${r.mora?`<div><span class="lq-fn">Mora</span> = días de retraso × salario básico / 30 (truncado) · días desde el ${f2(r.mora.desde)} hasta el retiro, ${f2(D("lq-ret"))}</div><div class="lq-sub">= ${r.mora.dias} × ${n(r.B.basico)} / 30 = ${r.mora.dias} × ${n(r.mora.diario)} = <b class="lq-box">${n(r.mora.valor)}</b></div><p class="hint">${Math.abs(r.B.sal-r.B.basico)>=0.5?`Ojo: la base de ${r.tipo==="ces"?"las cesantías":"la prima"} (${n(r.B.sal)}) sale de lo que devengó en el periodo (promedio con meses suspendidos, horas extra, recargos o comisiones), pero la mora se calcula solo con el <b>salario básico</b> (${n(r.B.basico)}). Así se hace en clase: la sanción es un día de salario básico por cada día de retraso.`:`La mora se calcula con el salario básico (${n(r.B.basico)}), sin horas extra ni comisiones.`}</p>`:""}</div>
    <p class="hint">${r.B.iguales?`Los últimos tres meses (${r.B.ult.map(x=>MES[x.m-1]).join(", ")}) son iguales: base = ${n(r.B.sal)}`:`Los últimos tres meses no son iguales: base = promedio de ${r.B.vivos.length} meses = (${r.B.devs.map(n).join(" + ")}) / ${r.B.vivos.length} = ${n(r.B.prom)}${r.B.susp?` (${r.B.susp} mes${r.B.susp>1?"es":""} suspendido${r.B.susp>1?"s":""} en 0)`:""}`}${r.B.aux?` + auxilio de transporte ${n(r.B.aux)}`:", sin auxilio (más de 2 SMMLV)"}${r.aus?`; se restan ${r.aus} días del art. 51`:""}. ${r.enLiquidacion?"Se paga con la liquidación final.":r.mora?`Plazo: ${dt(r.limite)}; la mora corre hasta el retiro con el básico / 30, truncado.`:`Plazo: ${dt(r.limite)}.`}${extra||""}</p></div>`};
  const run=()=>{read();const a=D("lq-ini"),b=D("lq-ret"),ms=months();if(!ms){$("lq-res").innerHTML=err("la fecha de retiro debe ser posterior a la de inicio.");$("lq-out").innerHTML="";return}
    const meses=ms.map(([y,m])=>{const v=vals[y+"-"+m];return{y,m,basico:v[0],extra:v[1],art51:v[2]}});if(meses.some(r=>!(r.basico>0))){$("lq-res").innerHTML=err("escribe el salario básico de cada mes.");return}
    const pagos={prima:$("lq-pp").checked,ces:$("lq-pc").checked,int:$("lq-pi").checked},R=LAB.liquidacion({inicio:a,retiro:b,meses,pagos}),T=R.tot;
    // datos agrupados como en el tablero
    const g=[];ms.forEach(([y,m])=>{const v=vals[y+"-"+m],sig=v.slice(0,3).join("|"),l=g[g.length-1];if(l&&l.sig===sig&&l.y===y&&l.nota===v[3])l.m2=m;else g.push({y,m1:m,m2:m,sig,v,nota:v[3]})});
    let yy=null;const datos=g.map(x=>{const per=x.m1===x.m2?Cap(MES[x.m1-1]):`${Cap(MES[x.m1-1])} – ${MES[x.m2-1]}`,hd=x.y!==yy?`<b>${x.y}</b> · auxilio de transporte ${n(LAB.valores({y:x.y,m:12,d:1}).aux)}<br>`:"";yy=x.y;
      return hd+(x.v[2]>=30?`${per}: art. 51, ${x.v[2]} días`:`${per}: ${n(x.v[0]+x.v[1])}${x.v[1]?` (${x.nota||"con extras"})`:""} · ${n(x.v[0])} / 30 = ${n(Math.floor(x.v[0]/30))}${x.v[2]?` · art. 51: ${x.v[2]} días`:""}`)}).join("<br>");
    $("lq-res").innerHTML=tiles([["Primas",$p(T.primas)],["Cesantías",$p(T.ces)],["Intereses",$p(T.ints)],["Moras y sanciones",$p(T.moraPrimas+T.moraCes+T.sancionInt)],["Total a pagar",$p(T.total),"okt"]]);
    $("lq-out").innerHTML=stp(1,"Datos",`<div class="eq al">F. inicio ${f2(a)}<br>${datos}<br>F. retiro ${f2(b)}</div>`)
      +stp(2,"Primas de servicios (art. 306)",FORM("prima")+R.primas.map(r=>fila(r.nombre,r,pagos.prima&&!r.enLiquidacion?" Ya se pagó.":"")).join(""))
      +stp(3,"Cesantías (art. 249)",FORM("ces")+R.ces.map(r=>fila(r.nombre,r,pagos.ces&&!r.enLiquidacion?" Ya se consignó.":"")).join(""))
      +stp(4,"Intereses sobre las cesantías (12 % anual)",FORM("int")+R.ints.map(r=>`<div class="lq-b"><div class="lq-h">${r.nombre}</div><div class="lq-fs"><div><span class="lq-fn">Intereses</span> = cesantías del año × días trabajados × 12 % / 360</div><div class="lq-sub">= ${n(r.ces)} × ${r.dias} × 12 % / 360 = <b class="lq-box">${n(r.valor)}</b></div>${r.sancion?`<div><span class="lq-fn">Sanción</span> = un valor igual a los intereses, por no pagarlos antes del ${dt(r.limite)} (Ley 52 de 1975)</div><div class="lq-sub">= <b class="lq-box">${n(r.sancion)}</b></div>`:""}</div><p class="hint">${r.enLiquidacion?"Se pagan con la liquidación final, directamente al trabajador.":`Se pagan directamente al trabajador a más tardar el ${dt(r.limite)}.${pagos.int?" Ya se pagaron.":""}`}</p></div>`).join(""))
      +stp(5,"Total de la liquidación",`<div class="tbl"><table><tr><td>Primas adeudadas</td><td class="num">${$p(T.primas)}</td></tr><tr><td>Mora de las primas</td><td class="num">${$p(T.moraPrimas)}</td></tr><tr><td>Cesantías adeudadas</td><td class="num">${$p(T.ces)}</td></tr><tr><td>Mora por no consignar las cesantías</td><td class="num">${$p(T.moraCes)}</td></tr><tr><td>Intereses sobre las cesantías</td><td class="num">${$p(T.ints)}</td></tr><tr><td>Sanción por no pagar los intereses</td><td class="num">${$p(T.sancionInt)}</td></tr><tr><td><b>Total</b></td><td class="num"><b>${$p(T.total)}</b></td></tr></table></div>
        <p class="hint">No incluye vacaciones, salarios pendientes ni indemnización. Si después del retiro no se paga esta liquidación, corre la <button class="btn" type="button" data-go="moratoria">indemnización moratoria (art. 65)</button>.</p>`)};
  const PEDRO={ini:"2025-01-01",ret:"2026-08-31",m:{}};
  [1,2,3,4].forEach(m=>PEDRO.m["2025-"+m]=[1835000,2000000,0,"Comisiones"]);PEDRO.m["2025-5"]=[1835000,4000000,0,"Comisiones"];PEDRO.m["2025-6"]=[1835000,0,30,"Suspensión"];PEDRO.m["2025-7"]=[1835000,0,30,"Suspensión"];
  [8,9,10,11,12].forEach(m=>PEDRO.m["2025-"+m]=[1835000,2000000,0,"Comisiones"]);[1,2,3,5,7].forEach(m=>PEDRO.m["2026-"+m]=[4250000,0,0,""]);PEDRO.m["2026-4"]=[4250000,0,30,"Suspensión"];
  PEDRO.m["2026-6"]=[4250000,1198094,3,"Junio de la solución de clase: 5.448.094"];PEDRO.m["2026-8"]=[4250000,0,30,"Licencia no remunerada"];
  const load=k=>{if(k==="pedro"){$("lq-ini").value=PEDRO.ini;$("lq-ret").value=PEDRO.ret;vals=JSON.parse(JSON.stringify(PEDRO.m));$("lq-pp").checked=$("lq-pc").checked=$("lq-pi").checked=false;$("lq-m").innerHTML="";draw();return}
    if(k==="clase"){$("lq-ini").value=CLASE.ini;$("lq-ret").value=CLASE.ret;vals=JSON.parse(JSON.stringify(CLASE.m));$("lq-pp").checked=$("lq-pc").checked=$("lq-pi").checked=false}
    else{vals={};$("lq-ini").value=di(HOY).slice(0,4)+"-01-01";$("lq-ret").value=di(HOY)}$("lq-m").innerHTML="";draw()};
  const deCaso=c=>{$("lq-ini").value=c.desde||c.ingreso;$("lq-ret").value=c.retiro;vals=JSON.parse(JSON.stringify(c.meses||{}));const pg=c.pagos||{};$("lq-pp").checked=!!pg.prima;$("lq-pc").checked=!!pg.ces;$("lq-pi").checked=!!pg.int;$("lq-m").innerHTML="";draw()};
  $("lq-ej").addEventListener("click",e=>{const bt=e.target.closest("button");if(!bt)return;if(bt.dataset.k==="mariana"){deCaso(CASO.taller("mariana"));cbar&&cbar.draw("Se activó el caso de Mariana.")}else load(bt.dataset.k)});let cbar=null;
  ["lq-ini","lq-ret"].forEach(i=>$(i).addEventListener("change",draw));["lq-pp","lq-pc","lq-pi"].forEach(i=>$(i).addEventListener("change",run));
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;const cL=pre==="pedro"?(CASO.taller("pedro"),null):CASO.dePre(pre);load(pre==="pedro"?"pedro":"clase");
  guardados("liquidacion",{label:"Liquidación",restore:pre!=="pedro"&&!cL,
    get:()=>{read();return{ini:$("lq-ini").value,ret:$("lq-ret").value,vals:JSON.parse(JSON.stringify(vals)),pp:$("lq-pp").checked,pc:$("lq-pc").checked,pi:$("lq-pi").checked}},
    set:st=>{$("lq-ini").value=st.ini;$("lq-ret").value=st.ret;vals=JSON.parse(JSON.stringify(st.vals||{}));$("lq-pp").checked=!!st.pp;$("lq-pc").checked=!!st.pc;$("lq-pi").checked=!!st.pi;$("lq-m").innerHTML="";draw()}});
  cbar=casoBar("liquidacion",{cargar:deCaso,resultado:()=>{read();const a=D("lq-ini"),b=D("lq-ret"),ms=months();if(!ms)return null;const meses=ms.map(([y,m])=>{const v=vals[y+"-"+m];return{y,m,basico:v[0],extra:v[1],art51:v[2]}});if(meses.some(r=>!(r.basico>0)))return null;
      const T=LAB.liquidacion({inicio:a,retiro:b,meses,pagos:{prima:$("lq-pp").checked,ces:$("lq-pc").checked,int:$("lq-pi").checked}}).tot;return{t:"Prestaciones con moras y sanciones",v:T.total,tot:T}},
    despues:c=>{read();c.desde=$("lq-ini").value;c.retiro=$("lq-ret").value;c.meses=JSON.parse(JSON.stringify(vals));c.pagos={prima:$("lq-pp").checked,ces:$("lq-pc").checked,int:$("lq-pi").checked};CASO.guardar(c)}});
  if(cL)deCaso(cL);
  // meses que llegan desde la nómina o la planilla
  const env=tomarEnvios();if(env.length){read();const a=D("lq-ini"),b=D("lq-ret"),k0=a?a.y*12+a.m:0,k1=b?b.y*12+b.m:0,dentro=[],fuera=[];
    env.forEach(x=>{vals[x.y+"-"+x.m]=[x.basico,x.extra,x.art51,x.nota];(x.y*12+x.m>=k0&&x.y*12+x.m<=k1?dentro:fuera).push(x)});
    $("lq-m").innerHTML="";draw();$("sim").dispatchEvent(new Event("change"));
    $("lq-env").innerHTML=`<div class="okbox">${dentro.length?`Llegó desde ${dentro[0].origen}: ${dentro.map(x=>`<b>${MESN[x.m-1]} de ${x.y}</b> (devengado ${$p(x.basico+x.extra)}${x.art51?`, ${x.art51} día${x.art51===1?"":"s"} del art. 51`:""})`).join("; ")}. Revisa su renglón en la tabla.`:""}${fuera.length?` ${fuera.map(x=>`${MESN[x.m-1]} de ${x.y}`).join(", ")} está fuera de las fechas de esta liquidación: ajusta la fecha de inicio o de retiro y aparecerá con sus datos.`:""}</div>`}
};


// =====================================================================
// SEGUIMIENTO DE UN CASO: los datos del trabajador se escriben una vez y cada herramienta los usa y guarda allí su resultado
// =====================================================================
const CASO_K="eco-casos",CASO_A="eco-caso-activo";
const CASO={mem:{lista:null,activo:null}};
CASO.rd=(k,def)=>{try{const v=JSON.parse(localStorage.getItem(k)||"null");return v===null?def:v}catch(e){return k===CASO_K?(CASO.mem.lista||def):(CASO.mem.activo||def)}};
CASO.wr=(k,v)=>{if(k===CASO_K)CASO.mem.lista=v;else CASO.mem.activo=v;try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
CASO.lista=()=>CASO.rd(CASO_K,[]);
CASO.activo=()=>{const id=CASO.rd(CASO_A,null);return id?CASO.lista().find(c=>c.id===id)||null:null};
CASO.guardar=c=>{const a=CASO.lista(),i=a.findIndex(x=>x.id===c.id);if(i>=0)a[i]=c;else a.unshift(c);CASO.wr(CASO_K,a.slice(0,30));return c};
CASO.activar=id=>CASO.wr(CASO_A,id);
CASO.borrar=id=>{CASO.wr(CASO_K,CASO.lista().filter(c=>c.id!==id));if(CASO.rd(CASO_A,null)===id)CASO.wr(CASO_A,null)};
CASO.nuevo=(base={})=>Object.assign({id:"c"+Date.now().toString(36),nombre:"Caso nuevo",tipo:"indef",ingreso:di(HOY).slice(0,4)+"-01-01",retiro:di(HOY),durM:12,durD:0,modo:"360",salario:1750905,desde:di(HOY).slice(0,4)+"-01-01",vacDesde:"",disfrutados:0,meses:{},pagos:{prima:false,ces:false,int:false},planilla:null,res:{}},JSON.parse(JSON.stringify(base)));
CASO.art51=(c,desde,hasta)=>{const a=LAB.parse(desde||c.desde),b=LAB.parse(hasta||c.retiro);if(!a||!b)return 0;let s=0;
  Object.entries(c.meses||{}).forEach(([k,v])=>{const [y,m]=k.split("-").map(Number),q=y*12+m;if(q>=a.y*12+a.m&&q<=b.y*12+b.m)s+=Math.min(30,+v[2]||0)});return s};
// vencimiento del período que corría en la fecha de retiro (contrato a término fijo)
CASO.finPactado=c=>{const ini=LAB.parse(c.ingreso),ret=LAB.parse(c.retiro);if(!ini||!ret||c.tipo!=="fijo")return null;const R=LAB.prorrogas(ini,+c.durM||0,ret,{dias:+c.durD||0,modo:c.modo||"360"});
  return R.indefinidoEnCorte?null:R.actual?R.actual.fin:null};
// ---- casos de los talleres
const CASO_PRE={};
(()=>{const m={};for(let k=1;k<=12;k++)m["2025-"+k]=[3725000,k>=9?175000:0,k===5?30:0,k===5?"Sanción disciplinaria (art. 51)":k>=9?"Horas extra: devengó 3.900.000":""];
  for(let k=1;k<=10;k++)m["2026-"+k]=[4950000,k===10?2305285.71:0,k>=4&&k<=6?30:k===10?2:0,k>=4&&k<=6?"Suspensión por razones técnicas (art. 51)":k===10?"Planilla de octubre: 7.255.285,71; licencia 30 y 31":""];
  CASO_PRE.mariana={id:"mariana",nombre:"Mariana (taller)",tipo:"fijo",ingreso:"2023-11-08",retiro:"2026-10-31",durM:8,durD:15,modo:"360",salario:4950000,vacHex:825000,desde:"2025-01-01",vacDesde:"2023-11-08",disfrutados:0,meses:m,pagos:{prima:false,ces:false,int:false},planilla:{pre:"mariana"},res:{}};
  const p={};[1,2,3,4,8,9,10,11,12].forEach(k=>p["2025-"+k]=[1835000,2000000,0,"Comisiones"]);p["2025-5"]=[1835000,4000000,0,"Comisiones"];p["2025-6"]=[1835000,0,30,"Suspensión"];p["2025-7"]=[1835000,0,30,"Suspensión"];
  [1,2,3,5,7].forEach(k=>p["2026-"+k]=[4250000,0,0,""]);p["2026-4"]=[4250000,0,30,"Suspensión"];p["2026-6"]=[4250000,1198094,3,"Junio de la solución de clase: 5.448.094"];p["2026-8"]=[4250000,0,30,"Licencia no remunerada"];
  CASO_PRE.pedro={id:"pedro",nombre:"Pedro (taller)",tipo:"indef",ingreso:"2021-05-08",retiro:"2026-08-31",durM:12,durD:0,modo:"360",salario:4250000,desde:"2025-01-01",vacDesde:"2025-01-01",disfrutados:0,meses:p,pagos:{prima:false,ces:false,int:false},planilla:{pre:"pedro"},res:{}}})();
// activa un caso de taller (conserva los resultados guardados si ya existía)
CASO.taller=k=>{const P=CASO_PRE[k];if(!P)return null;const ya=CASO.lista().find(c=>c.id===P.id);if(ya&&P.id==="mariana"&&ya.vacDesde==="2025-01-01"){ya.vacDesde=P.vacDesde;CASO.guardar(ya)}const c=ya||CASO.nuevo(P);if(!ya)CASO.guardar(c);CASO.activar(c.id);return c};
// TOOL_PRE: "caso" usa el caso activo; "mariana" o "pedro" activan ese caso. Devuelve el caso o null.
CASO.dePre=pre=>pre==="caso"?CASO.activo():CASO_PRE[pre]?CASO.taller(pre):null;
CASO.resultado=(tool,r)=>{const c=CASO.activo();if(!c)return false;c.res=c.res||{};c.res[tool]=Object.assign({f:new Date().toLocaleString("es-CO",{dateStyle:"medium",timeStyle:"short"})},r);CASO.guardar(c);return true};
const CASO_TOOLS={prorrogas:"Prórrogas (vencimiento del contrato)",planilla:"Salario del mes (planilla)",liquidacion:"Prestaciones sociales",vacaciones:"Vacaciones",indemnizaciones:"Indemnización (art. 64)",moratoria:"Indemnización moratoria (art. 65)"};
// Barra del caso en cada herramienta. cargar(c): llena el formulario con el caso. resultado(): {t, v, l:[[concepto, valor]], ...} o null.
function casoBar(tool,{cargar,resultado,despues}){const box=document.createElement("div");box.className="cbar";$("sim").prepend(box);
  const esc=t=>String(t).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  const draw=msg=>{const c=CASO.activo();box.innerHTML=c?`<div class="cb-t">📁 <b>Caso: ${esc(c.nombre)}</b> <small>${c.tipo==="fijo"?"término fijo":c.tipo==="obra"?"obra o labor":"término indefinido"} · ${dt(LAB.parse(c.ingreso))} → ${dt(LAB.parse(c.retiro))}</small></div>
    <div class="cb-b"><button class="btn" type="button" data-cb="load">Usar los datos del caso</button>${resultado?`<button class="btn" type="button" data-cb="save">Guardar este resultado en el caso</button>`:""}<button class="btn" type="button" data-go="caso">Ver el expediente →</button></div>
    ${c.res&&c.res[tool]?`<p class="hint" style="margin:4px 0 0">Guardado en el caso: ${esc(c.res[tool].t)}${c.res[tool].v?` = <b>${$p(c.res[tool].v)}</b>`:""} (${esc(c.res[tool].f)}).</p>`:""}<p class="cb-m" role="status">${msg||""}</p>`
    :`<div class="cb-t">📁 <b>Seguimiento de un caso</b> <small>Escribe los datos del trabajador una vez y úsalos en todas las herramientas.</small></div><div class="cb-b"><button class="btn" type="button" data-go="caso">Crear o abrir un caso</button></div>`};
  box.addEventListener("click",e=>{const b=e.target.closest("[data-cb]");if(!b)return;const c=CASO.activo();if(!c)return;
    if(b.dataset.cb==="load"){cargar(c);draw("Se cargaron los datos del caso.")}
    else{const r=resultado&&resultado();if(!r){draw("Todavía no hay un resultado válido para guardar.");return}CASO.resultado(tool,r);if(despues)despues(CASO.activo(),r);draw("Guardado en el expediente del caso.")}});
  draw();return{draw}}

// =====================================================================
// VACACIONES (arts. 186 a 192)
// =====================================================================
const D2=t=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t||"");return m?{y:+m[1],m:+m[2],d:+m[3]}:null};
SIMS.vac=function(){
  const ESC=[["nunca","Nunca ha salido a vacaciones"],["algunos","Disfrutó algunos períodos"],["todos","Disfrutó todos los períodos completos"],["fraccion","Disfrutó todo, incluida la fracción"],["dias","Otro: días hábiles disfrutados"]];
  $("sim").innerHTML=`<div class="chips pre" id="v-ej"><button type="button" data-k="mariana">Taller: Mariana</button><button type="button" data-k="simple">Ejemplo: un año completo</button></div>
  <h4 class="subh">1. Datos del contrato</h4>
  <div class="calcf">${dateIn("v-ini","Desde (inicio del contrato o últimas vacaciones)","2023-11-08")}${dateIn("v-ret","Hasta (retiro o fecha de corte)","2026-10-31")}${numIn("v-a51","Días de suspensión (art. 51) a descontar",122)}</div>
  <h4 class="subh">2. Base: último salario devengado</h4>
  <div class="calcf">${numIn("v-dev","Total devengado en el último mes",7255285.71,"0.01")}${numIn("v-hex","Horas extra de ese mes (se restan)",825000,"0.01")}${selIn("v-bt","Tipo de salario",[["fijo","El del último mes"],["var","Variable: promedio del último año"]],"fijo")}</div>
  <div id="v-base"></div>
  <h4 class="subh">3. Escenario</h4>
  <div style="margin:4px 0 8px">${seg("v-esc","Escenario",ESC,"nunca")}</div>
  <div class="calcf"><span id="v-wnp" hidden>${numIn("v-np","Períodos que disfrutó",2,"1")}</span><span id="v-wdis" hidden>${numIn("v-dis","Días hábiles ya disfrutados",0,"0.5")}</span></div>
  <div class="res" id="v-res"></div><div id="v-st"></div>
  <h4 class="subh">Comparación de escenarios</h4><div id="v-cmp"></div>
  <h4 class="subh">4. Si sigue trabajando: ¿cuándo regresa de vacaciones?</h4>
  <div class="calcf">${dateIn("v-d0","Primer día de vacaciones","2026-12-14")}${numIn("v-dh","Días hábiles de vacaciones",15)}${selIn("v-sab","¿Trabaja los sábados?",[["1","Sí: el sábado es día hábil"],["0","No: de lunes a viernes"]],"1")}</div>
  <div class="res" id="v-res2"></div><div id="v-st2"></div>`;
  let last=null,esc="nunca";
  const run=()=>{const a=D("v-ini"),b=D("v-ret"),dev=N("v-dev"),hex=Math.max(0,N("v-hex")||0),a51=Math.max(0,Math.round(N("v-a51")||0)),vari=$("v-bt").value==="var",sal=dev-hex;
    $("v-dev").closest("label").firstChild.textContent=vari?"Promedio mensual devengado en el último año":"Total devengado en el último mes";
    $("v-wnp").hidden=esc!=="algunos";$("v-wdis").hidden=esc!=="dias";
    if(!a||!b||LAB.cmp(a,b)>0||!(sal>0)){$("v-res").innerHTML=err("revisa las fechas, el salario y las horas extra.");$("v-st").innerHTML=$("v-cmp").innerHTML=$("v-base").innerHTML="";last=null}
    else{const R0=LAB.vacaciones({inicio:a,retiro:b,salario:sal,art51:a51,disfrutados:0}),comp=Math.floor(R0.dias/360),dia=sal/30;
      $("v-base").innerHTML=`<div class="eq al">Base = ${$c(dev)}${hex?` − ${$c(hex)} (horas extra)`:""} = <b>${$c(sal)}</b> · salario diario = ${$c(sal)} / 30 = ${$c(dia)}</div><p class="hint">${vari?"Salario variable: promedio de lo devengado en el año anterior (art. 192, num. 2).":"El último salario devengado (art. 189, num. 2) sin las horas extra (art. 192). Como se trabaja en clase, los recargos nocturnos y las horas dominicales sí entran."} No se incluye el auxilio de transporte.</p>`;
      let k=0,dis=0,warn="";
      if(esc==="algunos"){const np=Math.max(0,Math.round(N("v-np")||0));k=Math.min(np,comp);dis=k*15;if(np>comp)warn=`Solo alcanzó a completar ${comp} período${comp===1?"":"s"} (${comp} × 360 = ${comp*360} días trabajados): se toman ${comp}.`}
      else if(esc==="todos"){k=comp;dis=k*15}else if(esc==="fraccion"){dis=R0.causados}else if(esc==="dias"){dis=Math.max(0,N("v-dis")||0)}
      const R=LAB.vacaciones({inicio:a,retiro:b,salario:sal,art51:a51,disfrutados:dis}),pendD=Math.max(0,R0.dias-dis*24);last={R,a,b,sal,esc};
      const nm=ESC.find(e=>e[0]===esc)[1];
      $("v-res").innerHTML=(warn?`<p class="note" style="margin:0 0 10px">${warn}</p>`:"")+tiles([["Días trabajados",R0.dias.toLocaleString("es-CO")],["Períodos completos",String(comp)],["Días hábiles pendientes",fmt(R.pend,3)],["Compensación en dinero",$p(R.valor),"okt"]]);
      const per=k?` − ${k} × 360`:"",fr=esc==="fraccion";
      $("v-st").innerHTML=stp(1,"Días trabajados",`<div class="eq al">Días = días360(${dt(a)}, ${dt(b)}) + 1 = ${R0.total}${R0.art51?`<br>Menos los días del art. 51 (art. 53): ${R0.total} − ${R0.art51} = <b>${R0.dias}</b>`:""}<br>Períodos completos de 360 días: ${R0.dias} / 360 → <b>${comp}</b>; días de vacaciones causados: ${R0.dias} × 15 / 360 = ${fmt(R0.causados,3)}</div>`)
       +stp(2,"Escenario: "+nm.toLowerCase(),esc==="dias"?`<div class="eq al">Días hábiles pendientes = ${fmt(R0.causados,3)} − ${fmt(dis,3)} = <b>${fmt(R.pend,3)}</b></div>`:`<div class="eq al">${esc==="nunca"?"No ha disfrutado ningún período: se deben todos los días trabajados.":fr?"Disfrutó todo lo causado, también la parte proporcional del último año: no queda nada pendiente.":`Disfrutó ${k} período${k===1?"":"s"} = ${k} × 360 días trabajados (${k} × 15 = ${dis} días hábiles).`}<br>Días pendientes = ${R0.dias}${fr?` − ${R0.dias}`:per} = <b>${fr?0:R0.dias-k*360}</b></div>`)
       +stp(3,"Valor",esc==="dias"?`<div class="eq al">Vacaciones = salario diario × días hábiles pendientes = ${$c(dia)} × ${fmt(R.pend,3)} = <b>${$c(R.valor)}</b></div>`:`<div class="eq al">Vacaciones = salario × (días − días del art. 51${fr?" − todo lo disfrutado":per?" − períodos disfrutados × 360":""}) / 720<br>= ${$p(sal)} × (${R0.total} − ${R0.art51}${fr?` − ${R0.dias}`:per}) / 720 = ${$p(sal)} × ${fr?0:R0.dias-k*360} / 720 = <b>${$c(R.valor)}</b></div>`)
        +`<p class="hint">Al terminar el contrato, las vacaciones no disfrutadas se compensan en dinero por año cumplido y proporcionalmente por la fracción (art. 189). Normalmente solo se disfrutan años cumplidos, así que la fracción del último año casi siempre queda pendiente.</p>`;
      const rows=[["Nunca ha salido a vacaciones",0,"nunca"]];for(let j=1;j<=comp;j++)rows.push([`Disfrutó ${j} período${j===1?"":"s"}${j===comp?" (todos los completos)":""}`,j,j===comp?"todos":"algunos"]);
      $("v-cmp").innerHTML=`<div class="tbl"><table><tr><th>Escenario</th><th class="num">Días pendientes</th><th class="num">Días hábiles</th><th class="num">Valor</th></tr>${rows.map(([t,j,e])=>{const d=R0.dias-j*360,sel=(esc===e&&(e!=="algunos"||k===j));return`<tr${sel?' style="font-weight:700"':""}><td>${t}</td><td class="num">${d}</td><td class="num">${fmt(d*15/360,3)}</td><td class="num">${$p(sal*d/720)}</td></tr>`}).join("")}<tr${esc==="fraccion"?' style="font-weight:700"':""}><td>Disfrutó todo, incluida la fracción</td><td class="num">0</td><td class="num">0</td><td class="num">$0</td></tr></table></div><p class="hint">Fórmula de clase en cada fila: ${$p(sal)} × (días − art. 51 − períodos disfrutados × 360) / 720.</p>`}
    const sal2=dev-hex,d0=D("v-d0"),dh=Math.round(N("v-dh"));if(!d0||!(dh>=1&&dh<=60)||!(sal2>0)){$("v-res2").innerHTML=err("revisa la fecha de inicio y los días hábiles (1 a 60).");$("v-st2").innerHTML="";return}
    const Q=LAB.disfrute(d0,dh,$("v-sab").value==="1"),dia=sal2/30,pago=dia*Q.calendario,vv=dia*dh,otros=Q.calendario-dh,b2=D("v-ret"),fuera=b2&&LAB.cmp(d0,b2)>0;
    $("v-res2").innerHTML=(fuera?`<p class="note" style="margin:0 0 10px">El ${dt(d0)} es posterior a la fecha de retiro (${dt(b2)}): si el contrato ya terminó, las vacaciones no se disfrutan, se <b>compensan en dinero</b> (arriba). Esta parte sirve cuando la persona sigue trabajando.</p>`:"")+tiles([["Último día de vacaciones",dt(Q.ultimo)],["Regresa a trabajar",dt(Q.regreso),"okt"],["Valor de las vacaciones ("+dh+" días hábiles)",$p(vv)],["Total que recibe por el período ("+Q.calendario+" días calendario)",$p(pago)]]);
    $("v-st2").innerHTML=stp(1,"Conteo de días hábiles",`<p>Se cuentan ${dh} días hábiles desde el ${dt(d0)}. No cuentan: ${Q.no.length?Q.no.map(x=>`${x.f.d}/${x.f.m} (${x.por})`).join(", "):"ningún día"}.</p><div class="eq al">Valor de las vacaciones = salario / 30 × días hábiles = ${$p(sal2)} / 30 × ${dh} = <b>${$c(vv)}</b><br>Los otros ${otros} días hasta el regreso (domingos y festivos${$("v-sab").value==="1"?"":" y sábados"}) se pagan como salario ordinario: ${$c(dia)} × ${otros} = ${$c(dia*otros)}<br>Total que recibe por el período = ${$c(dia)} × ${Q.calendario} = <b>${$c(pago)}</b></div><p class="hint">Los festivos se calculan con la Ley 51 de 1983 (los movibles pasan al lunes). El empleador debe avisar la fecha con 15 días de anticipación (art. 187) y pagar las vacaciones por anticipado (art. 192).</p>`)};
  const setEsc=v=>{esc=v;document.querySelectorAll("#v-esc button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v))};
  const SET=v=>{Object.entries(v).forEach(([k,x])=>{if(k==="esc")setEsc(x);else if($(k))$(k).value=x});run()};
  const EJ={simple:{"v-ini":"2025-01-01","v-ret":"2025-12-31","v-dev":2000000,"v-hex":0,"v-a51":0,"v-bt":"fijo",esc:"nunca"}};
  const deCaso=c=>{const desde=c.vacDesde||c.ingreso,rt=D2(c.retiro),um=rt&&c.meses&&c.meses[rt.y+"-"+rt.m],P=CASO_PRE[c.id]||{},dev=um?(+um[0]||0)+(+um[1]||0):c.salario,hex=c.vacHex!==undefined?c.vacHex:(P.vacHex||0);
    SET({"v-ini":desde,"v-ret":c.retiro,"v-dev":Math.round(dev*100)/100,"v-hex":hex,"v-a51":CASO.art51(c,desde,c.retiro),"v-bt":"fijo"})};
  $("v-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.k==="mariana"){const c=CASO.taller("mariana");setEsc("nunca");deCaso(c);bar.draw("Se activó el caso de Mariana.")}else SET(EJ[b.dataset.k])});
  bindSeg("v-esc",v=>{esc=v;run()});
  const ids=["v-ini","v-ret","v-dev","v-hex","v-a51","v-bt","v-np","v-dis","v-d0","v-dh","v-sab"];watch(ids,run);
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;const c0=CASO.dePre(pre)||CASO.activo();run();
  guardados("vacaciones",{get:()=>Object.assign(formGet(ids)(),{esc}),set:st=>{if(st.esc)setEsc(st.esc);formSet(ids,run)(st)},label:"Vacaciones",restore:!c0});
  const bar=casoBar("vacaciones",{cargar:deCaso,resultado:()=>last&&{t:`${ESC.find(e=>e[0]===last.esc)[1]}: ${fmt(last.R.pend,3)} días hábiles pendientes`,v:last.R.valor,l:[["Desde",dt(last.a)],["Hasta",dt(last.b)],["Base",$p(last.sal)],["Días trabajados",String(last.R.dias)]]}});
  if(c0)deCaso(c0)};

// =====================================================================
// EXPEDIENTE DEL CASO
// =====================================================================
SIMS.caso=function(){
  const esc=t=>String(t).replace(/[&<>"]/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[ch]));
  $("sim").innerHTML=`<div class="calcf"><label for="c-sel">Caso<select id="c-sel"></select></label></div>
  <div class="chips pre" id="c-acc"><button type="button" data-a="nuevo">＋ Caso nuevo</button><button type="button" data-a="mariana">Cargar el caso de Mariana (taller)</button><button type="button" data-a="pedro">Cargar el caso de Pedro (taller)</button><button type="button" data-a="borrar">Borrar este caso</button></div>
  <div id="c-body"></div>`;
  const F=[["c-nom","nombre","Nombre del caso","text"],["c-tipo","tipo","Tipo de contrato","sel",[["indef","Término indefinido"],["fijo","Término fijo"],["obra","Obra o labor"]]],["c-ing","ingreso","Fecha de ingreso","date"],["c-ret","retiro","Fecha de retiro (último día trabajado)","date"],
    ["c-dm","durM","Duración pactada: meses","num"],["c-dd","durD","… y días","num"],["c-mo","modo","Contar la duración con","sel",[["360","año de 360 días (clase)"],["cal","calendario"]]],["c-sal","salario","Último salario básico mensual","num"],["c-des","desde","Prestaciones adeudadas desde","date"],["c-vd","vacDesde","Vacaciones pendientes desde","date"],["c-vdis","disfrutados","Días hábiles de vacaciones ya disfrutados","num"]];
  const body=()=>{const c=CASO.activo();const sel=$("c-sel"),L=CASO.lista();sel.innerHTML=L.length?L.map(x=>`<option value="${x.id}" ${c&&x.id===c.id?"selected":""}>${esc(x.nombre)}</option>`).join(""):`<option value="">(no hay casos)</option>`;
    if(!c){$("c-body").innerHTML=`<p class="hint">Crea un caso nuevo o carga el de un taller. Los casos se guardan en este navegador.</p>`;return}
    const fin=CASO.finPactado(c),a51=CASO.art51(c),ms=Object.keys(c.meses||{}).sort((p,q)=>{const [a,b]=p.split("-").map(Number),[x,y]=q.split("-").map(Number);return a*12+b-(x*12+y)});
    const MES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],res=c.res||{};
    const pasos=[["prorrogas","Prórrogas","Si el contrato es a término fijo: qué período corría al retiro y cuándo vencía.",c.tipo==="fijo"],["planilla","Salario del mes con novedades","Planilla de horas del mes (recargos, licencias). Guardarlo actualiza ese mes del caso.",true],["liquidacion","Prestaciones sociales","Primas, cesantías, intereses, moras y sanciones, con los meses del caso.",true],["vacaciones","Vacaciones","Compensación de las vacaciones no disfrutadas.",true],["indemnizaciones","Indemnización (art. 64)","Si el despido fue sin justa causa.",true],["moratoria","Moratoria (art. 65)","Solo si no le pagan la liquidación al retirarse.",true]];
    const incl=c.incl||{};
    $("c-body").innerHTML=stp(1,"Datos del trabajador",`<div class="calcf">${F.map(([id,k,l,t,o])=>t==="sel"?selIn(id,l,o,String(c[k])):t==="date"?dateIn(id,l,c[k]||""):t==="num"?numIn(id,l,c[k]??0):`<label for="${id}">${l}<input id="${id}" value="${esc(c[k]||"")}"></label>`).join("")}</div>
      <p class="hint">${c.tipo==="fijo"?(fin?`Con la duración pactada, el período que corría al retiro vencía el <b>${dt(fin)}</b> (ver Prórrogas).`:"Revisa la duración pactada: no se encontró el período vigente al retiro."):""} Días de suspensión (art. 51) registrados desde ${dt(LAB.parse(c.desde)||HOY)}: <b>${a51}</b>.</p>`)
      +stp(2,"Meses del caso",ms.length?`<div class="tbl"><table><tr><th>Mes</th><th class="num">Básico</th><th class="num">Extras</th><th class="num">Devengado</th><th class="num">Art. 51</th><th>Nota</th></tr>${ms.map(k=>{const [y,m]=k.split("-").map(Number),v=c.meses[k];return`<tr><td>${MES[m-1]} ${y}</td><td class="num">${$p(v[0])}</td><td class="num">${v[1]?$p(v[1]):""}</td><td class="num">${v[2]>=30?"0 (suspendido)":$p(v[0]+v[1])}</td><td class="num">${v[2]||""}</td><td>${esc(v[3]||"")}</td></tr>`}).join("")}</table></div><p class="hint">Se editan en la liquidación de prestaciones («Guardar este resultado en el caso» guarda también los meses) o llegan desde la planilla.</p>`:`<p class="hint">Todavía no hay meses. Ábrelos en la liquidación de prestaciones, escríbelos y guarda el resultado en el caso.</p>`)
      +stp(3,"Ruta del caso",`<ol class="steps">${pasos.filter(p=>p[3]).map(([id,t,d])=>`<li><b>${t}</b>${res[id]?` ✓ <span class="okt">${esc(res[id].t)}${res[id].v?`: <b>${$p(res[id].v)}</b>`:""}</span>`:""}<br><small>${d}</small><br><button class="btn" type="button" data-tool="${id}" data-pre="caso">${res[id]?"Volver a abrir":"Abrir"} con los datos del caso</button></li>`).join("")}</ol>`)
      +stp(4,"Resumen para el taller",(()=>{const items=[];if(res.planilla)items.push(["planilla","Salario del mes ("+res.planilla.t+")",res.planilla.v]);
        if(res.liquidacion){const T=res.liquidacion.tot||{};items.push(["liq-p","Prestaciones sociales (primas, cesantías e intereses)",(T.primas||0)+(T.ces||0)+(T.ints||0)],["liq-m","Moras y sanciones de las prestaciones",(T.moraPrimas||0)+(T.moraCes||0)+(T.sancionInt||0)])}
        if(res.vacaciones)items.push(["vacaciones","Vacaciones compensadas",res.vacaciones.v]);if(res.indemnizaciones)items.push(["indemnizaciones","Indemnización por despido sin justa causa",res.indemnizaciones.v]);if(res.moratoria)items.push(["moratoria","Indemnización moratoria",res.moratoria.v]);
        if(!items.length)return`<p class="hint">Cuando guardes resultados en el caso, aparecen aquí con su total.</p>`;
        const on=k=>incl[k]!==false,tot=items.filter(x=>on(x[0])).reduce((s,x)=>s+x[2],0);
        return`<div class="tbl"><table><tr><th></th><th>Concepto</th><th class="num">Valor</th></tr>${items.map(([k,t,v])=>`<tr><td><input type="checkbox" data-inc="${k}" ${on(k)?"checked":""} aria-label="Sumar ${esc(t)}"></td><td>${esc(t)}</td><td class="num">${$p(v)}</td></tr>`).join("")}<tr><td></td><td><b>Total marcado</b></td><td class="num"><b>${$p(tot)}</b></td></tr></table></div><p class="hint">Desmarca lo que el enunciado no pida sumar (por ejemplo, el salario del mes si ya se pagó).</p>`})());
    F.forEach(([id,k,,t])=>{const el=$(id);el.addEventListener("change",()=>{const c2=CASO.activo();if(!c2)return;c2[k]=t==="num"?(+el.value||0):el.value;if(k==="nombre"&&!c2[k])c2[k]="Caso";CASO.guardar(c2);body()})});
    $("c-body").querySelectorAll("[data-inc]").forEach(ch=>ch.addEventListener("change",()=>{const c2=CASO.activo();c2.incl=c2.incl||{};c2.incl[ch.dataset.inc]=ch.checked;CASO.guardar(c2);body()}))};
  $("c-sel").addEventListener("change",()=>{CASO.activar($("c-sel").value||null);body()});
  $("c-acc").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const a=b.dataset.a;
    if(a==="nuevo"){const c=CASO.guardar(CASO.nuevo());CASO.activar(c.id)}else if(a==="borrar"){const c=CASO.activo();if(c)CASO.borrar(c.id)}else CASO.taller(a);body()});
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;if(CASO_PRE[pre])CASO.taller(pre);body()};


// ===================== CALCULADORAS DEL PROGRAMA 1501875 =====================
const jsd=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(Date.UTC(y,m-1,d))},fmtD=t=>t.toLocaleDateString("es-CO",{timeZone:"UTC",day:"numeric",month:"long",year:"numeric"}),ddiff=(a,b)=>Math.round((b-a)/86400000);
SIMS.prueba=function(){
  $("sim").innerHTML=`<h4 class="subh">Período de prueba</h4><div class="calcf">${selIn("pp-t","Tipo de contrato",[["ind","Término indefinido"],["fijo","Término fijo"],["obra","Obra o labor"]],"fijo")}${numIn("pp-m","Duración pactada (meses, si es a término fijo)",6,"0.5")}</div><div class="res" id="pp-res"></div>
  <h4 class="subh">Prescripción</h4><div class="calcf">${dateIn("pp-e","Fecha en que la obligación se hizo exigible","2024-02-15")}${dateIn("pp-r","Fecha del reclamo escrito (opcional)","")}${dateIn("pp-h","Fecha de consulta",di(HOY))}</div><div class="res" id="pp-res2"></div><div id="pp-st"></div>`;
  const run=()=>{const t=$("pp-t").value,m=N("pp-m");let max=60,why="máximo legal de dos meses";
    if(t==="fijo"&&m>0&&m<12){max=Math.min(60,Math.floor(m*30/5));why=`quinta parte de ${fm(m)} meses (${fm(m*30)} días) = ${Math.floor(m*30/5)} días, sin pasar de 60`}
    $("pp-res").innerHTML=tiles([["Período de prueba máximo",max+" días","okt"],["Regla",why],["Forma","Por escrito"]]);
    const e=$("pp-e").value,r=$("pp-r").value,h=$("pp-h").value;if(!e||!h){$("pp-res2").innerHTML=err("indica las fechas.");return}
    const E=jsd(e),H=jsd(h),add3=d=>new Date(Date.UTC(d.getUTCFullYear()+3,d.getUTCMonth(),d.getUTCDate()));let lim=add3(E),nota="Tres años desde que la obligación se hizo exigible (art. 488 CST).";
    if(r){const R=jsd(r);if(R<E){$("pp-res2").innerHTML=err("el reclamo no puede ser anterior a la exigibilidad.");return}if(R<=lim){lim=add3(R);nota="El reclamo escrito interrumpió la prescripción una vez: vuelven a contarse tres años desde el reclamo."}else nota="El reclamo se hizo cuando la acción ya había prescrito: no la interrumpe."}
    const left=ddiff(H,lim);
    $("pp-res2").innerHTML=tiles([["La acción prescribe el",fmtD(lim)],["Estado",left>=0?"Vigente":"Prescrita",left>=0?"okt":"badt"],[left>=0?"Días que quedan":"Días desde que prescribió",Math.abs(left).toLocaleString("es-CO")]]);
    $("pp-st").innerHTML=stp(1,"Explicación",`<p>${nota} Después, el trabajador pierde la posibilidad de exigir judicialmente el pago, aunque el derecho haya existido.</p>`)};
  watch(["pp-t","pp-m","pp-e","pp-r","pp-h"],run);run()};

SIMS.salario2=function(){
  const sm=LAB.valores(LAB.parse(di(HOY))).smmlv;
  $("sim").innerHTML=`<h4 class="subh">Embargo del salario</h4><div class="calcf">${numIn("sa-s","Salario mensual",3000000,"10000")}${selIn("sa-t","Tipo de deuda",[["comun","Crédito ordinario (banco, comercio)"],["alim","Pensión alimenticia o cooperativa"]],"comun")}</div><div class="res" id="sa-res"></div>
  <h4 class="subh">¿Puede pactarse salario integral?</h4><div class="calcf">${numIn("sa-i","Salario integral mensual propuesto",24000000,"10000")}</div><div class="res" id="sa-res2"></div><div id="sa-st"></div>`;
  const run=()=>{const s=N("sa-s"),t=$("sa-t").value,I=N("sa-i");if(!(s>0)){$("sa-res").innerHTML=err("salario positivo.");return}
    const emb=t==="alim"?0.5*s:Math.max(0,(s-sm)/5);
    $("sa-res").innerHTML=tiles([["Salario mínimo vigente",$p(sm)],["Máximo embargable al mes",$p(emb),"okt"],["Le queda al trabajador",$p(s-emb)]]);
    const min=13*sm,ok=I>=min;
    $("sa-res2").innerHTML=tiles([["Mínimo del salario integral (13 SMMLV)",$p(min)],["¿Es válido?",ok?"Sí":"No",ok?"okt":"badt"],["Factor prestacional incluido (30 %)",$p(I*0.3/1.3)],["Base de aportes (70 %)",$p(0.7*I)]]);
    $("sa-st").innerHTML=stp(1,"Reglas",`<div class="eq al">${t==="alim"?`Pensión alimenticia o cooperativa: hasta el 50 % del salario = 0,5 × ${$p(s)} = <b>${$p(emb)}</b>`:`Crédito ordinario: el mínimo (${$p(sm)}) es inembargable; se embarga la quinta parte del excedente: (${$p(s)} − ${$p(sm)})/5 = <b>${$p(emb)}</b>`}<br>Salario integral: al menos 10 SMMLV de salario + 30 % de factor prestacional = 13 × ${$p(sm)} = ${$p(min)}</div>`)};
  watch(["sa-s","sa-t","sa-i"],run);run()};

SIMS.sancion=function(){
  $("sim").innerHTML=`<div class="calcf">${numIn("sn-s","Salario mensual",2400000,"10000")}${numIn("sn-a","Año al que corresponden las cesantías",2025)}${dateIn("sn-c","Fecha en que se consignaron (o de consulta)","2026-03-01")}${numIn("sn-i","Intereses sobre cesantías no pagados",288000,"1000")}${selIn("sn-p","¿Se pagaron los intereses antes del 31 de enero?",[["si","Sí"],["no","No"]],"no")}</div><div class="res" id="sn-res"></div><div id="sn-st"></div>`;
  const run=()=>{const s=N("sn-s"),a=N("sn-a"),c=$("sn-c").value,i=N("sn-i"),p=$("sn-p").value;if(!(s>0)||!c||!(a>1990)){$("sn-res").innerHTML=err("completa los datos.");return}
    const lim=new Date(Date.UTC(a+1,1,14)),C=jsd(c),dias=Math.max(0,ddiff(lim,C)),diario=s/30,san=dias*diario,int=p==="no"?i:0;
    $("sn-res").innerHTML=tiles([["Plazo para consignar",fmtD(lim)],["Días de retardo",dias],["Sanción art. 99 Ley 50",$p(san),dias?"badt":"okt"],["Sanción por intereses",$p(int)],["Total a cargo del empleador",$p(san+int+(p==="no"?i:0))]]);
    $("sn-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">Salario diario = ${$p(s)}/30 = ${$c(diario)}<br>Sanción por no consignar = ${dias} días × ${$c(diario)} = <b>${$p(san)}</b>${p==="no"?`<br>Intereses no pagados: se deben los intereses (${$p(i)}) más una suma igual como sanción (${$p(i)})`:""}</div>`)};
  watch(["sn-s","sn-a","sn-c","sn-i","sn-p"],run);run()};

SIMS.soc=function(){
  $("sim").innerHTML=`<div class="calcf">${numIn("so-n","Número de socios",2)}${selIn("so-r","Responsabilidad de los socios",[["lim","Limitada a los aportes"],["ili","Pueden responder con su patrimonio"]],"lim")}${selIn("so-b","¿Quieren emitir acciones o cotizar en bolsa en el futuro?",[["no","No"],["si","Sí"]],"no")}${selIn("so-f","¿Necesitan flexibilidad (estatutos libres, documento privado)?",[["si","Sí"],["no","No"]],"si")}</div><div id="so-o"></div>`;
  const T=[["Colectiva",n=>n>=2,"ili","no"],["Comandita simple",n=>n>=2,"mix","no"],["Comandita por acciones",n=>n>=6,"mix","si"],["Limitada",n=>n>=2&&n<=25,"lim","no"],["Anónima",n=>n>=5,"lim","si"],["SAS",n=>n>=1,"lim","ambos"]];
  const run=()=>{const n=Math.round(N("so-n")),r=$("so-r").value,b=$("so-b").value,f=$("so-f").value;if(!(n>=1)){$("so-o").innerHTML=err("al menos un socio.");return}
    const rows=T.map(([t,fn,res,acc])=>{const okN=fn(n),okR=r==="lim"?res!=="ili":true,okB=b==="si"?acc!=="no":true,okF=f==="si"?t==="SAS":true,ok=okN&&okR&&okB&&okF;return{t,ok,why:[!okN&&"número de socios",!okR&&"responsabilidad",!okB&&"no emite acciones",!okF&&"poca flexibilidad"].filter(Boolean).join(", ")}});
    $("so-o").innerHTML=`<div class="tbl"><table><tr><th>Tipo</th><th>¿Sirve?</th><th>Por qué no</th></tr>${rows.map(x=>`<tr${x.ok?' class="hl"':""}><td>${x.t}</td><td>${x.ok?"Sí":"No"}</td><td>${x.why}</td></tr>`).join("")}</table></div>`+
      stp(1,"Recomendación",`<p>${n===1?"Con un solo socio las opciones son la SAS o la empresa unipersonal; la SAS es la más usada.":rows.find(x=>x.t==="SAS").ok?"La SAS cumple tus condiciones: responsabilidad limitada, constitución por documento privado y libertad para pactar las reglas.":"Revisa las filas resaltadas."} Las dudas tributarias y contables (régimen, facturación electrónica, revisor fiscal) dependen del tamaño de la empresa: consúltalas con un contador.</p>`)};
  watch(["so-n","so-r","so-b","so-f"],run);run()};
