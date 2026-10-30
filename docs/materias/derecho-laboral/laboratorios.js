// Derecho Laboral y Constitucional · calculadoras
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
  <div class="calcf">${dateIn("p-ini","Inicio del contrato","2026-01-01")}${numIn("p-mes","Duración inicial (meses)",3)}${dateIn("p-cor","Fecha de consulta",di(HOY))}</div>
  <div class="res" id="p-res"></div><div class="verdict" id="p-ver"></div><div id="p-line"></div><div class="tbl"><table id="p-tab"></table></div><div id="p-note"></div>`;
  const run=()=>{const ini=D("p-ini"),mes=Math.round(N("p-mes")),cor=D("p-cor");
    if(!ini||!cor||!(mes>=1&&mes<=48)){$("p-res").innerHTML=err("revisa las fechas y que la duración esté entre 1 y 48 meses.");$("p-tab").innerHTML="";return}
    const R=LAB.prorrogas(ini,mes,cor),act=R.actual,name=p=>p.n===0?"Inicial":`${p.n}.ª prórroga`;
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
    $("p-tab").innerHTML=`<tr><th>Período</th><th>Desde</th><th>Hasta</th><th>Duración</th><th>Último día para avisar</th></tr>`+P.map(p=>`<tr class="${act&&act.n===p.n&&!R.indefinidoEnCorte?"ne":""}"><td>${name(p)}</td><td>${dt(p.inicio)}</td><td>${dt(p.fin)}${p.recortado?" (tope)":""}</td><td>${p.recortado?"Hasta el tope":p.meses===12?"1 año":p.meses+" meses"}</td><td>${p.recortado?"—":dt(p.preaviso)}</td></tr>`).join("");
    $("p-note").innerHTML=R.antesReforma?`<p class="link"><b>Contrato anterior a la reforma:</b> empezó antes del 25 de junio de 2025, así que el tope de 4 años se cuenta desde esa fecha y no desde el inicio del contrato.</p>`:""};
  watch(["p-ini","p-mes","p-cor"],run);run();
};

// ---- Indemnización (art. 64)
SIMS.ind=function(){
  $("sim").innerHTML=`<div class="calcf">${selIn("i-tipo","Tipo de contrato",[["indef","Término indefinido"],["fijo","Término fijo"],["obra","Obra o labor"]],"indef")}${numIn("i-sal","Último salario mensual",3000000,"10000")}
  <span id="i-wini">${dateIn("i-ini","Inicio del contrato","2025-01-01")}</span>${dateIn("i-des","Fecha del despido","2026-05-10")}<span id="i-wfin" hidden>${dateIn("i-fin","Vencimiento pactado o fin de la obra","2026-12-31")}</span></div>
  <div class="res" id="i-res"></div><div id="i-steps"></div>`;
  const run=()=>{const tipo=$("i-tipo").value,sal=N("i-sal"),ini=D("i-ini"),des=D("i-des"),fin=D("i-fin"),{smmlv}=LAB.valores(des||HOY);
    $("i-wini").hidden=tipo!=="indef";$("i-wfin").hidden=tipo==="indef";
    if(!(sal>0)||!des||(tipo==="indef"&&(!ini||LAB.cmp(ini,des)>0))||(tipo!=="indef"&&(!fin||LAB.cmp(fin,des)<0))){$("i-res").innerHTML=err("revisa el salario y que las fechas estén en orden.");$("i-steps").innerHTML="";return}
    const R=LAB.indemnizacion({tipo,salario:sal,inicio:ini,despido:des,finPactado:fin,smmlv});
    if(tipo==="indef"){
      $("i-res").innerHTML=tiles([["Tiempo de servicio",`${R.servicio.toLocaleString("es-CO")} días (${fmt(R.anios,3)} años)`],["Días de indemnización",fmt(R.dias,2)],["Salario diario",$c(R.diario)],["Indemnización",$p(R.valor),"okt"]]);
      $("i-steps").innerHTML=stp(1,"Paso a paso",`<div class="eq al">Salario ${R.alto?"≥":"<"} 10 SMMLV (${$p(10*smmlv)}) ⇒ ${R.p1} días por el primer año y ${R.pn} por cada año siguiente<br>Días de servicio = días360(${dt(ini)}, ${dt(des)}) + 1 = ${R.servicio}<br>Años = ${R.servicio} / 360 = ${fmt(R.anios,4)}<br>${R.anios<=1?`Trabajó un año o menos ⇒ ${R.p1} días completos`:`Días = ${R.p1} + ${R.pn} × (${fmt(R.anios,4)} − 1) = ${fmt(R.dias,4)}`}<br>Indemnización = ${fmt(R.dias,4)} × ${$c(R.diario)} = <b>${$c(R.valor)}</b></div>`)}
    else{
      $("i-res").innerHTML=tiles([["Tiempo que faltaba",`${R.falta.toLocaleString("es-CO")} días`],["Días a pagar",String(R.dias)],["Salario diario",$c(R.diario)],["Indemnización",$p(R.valor),"okt"]]);
      $("i-steps").innerHTML=stp(1,"Paso a paso",`<div class="eq al">Días que faltaban = días360(${dt(des)}, ${dt(fin)}) = ${R.falta}${R.minimo15?"<br>Es menor que 15 ⇒ se paga el mínimo de 15 días (obra o labor)":""}<br>Indemnización = ${R.dias} × ${$c(R.diario)} = <b>${$c(R.valor)}</b></div>${tipo==="fijo"?`<p class="hint" style="margin:0">Usa como vencimiento el fin del período o de la prórroga que estaba corriendo. La estación de prórrogas te da esa fecha.</p>`:""}`)}};
  watch(["i-tipo","i-sal","i-ini","i-des","i-fin"],run);run();
};

// ---- Moratoria (art. 65)
SIMS.mora=function(){
  $("sim").innerHTML=`<div class="calcf">${numIn("m-sal","Último salario mensual",3000000,"10000")}${dateIn("m-fin","Terminación del contrato","2026-03-31")}${dateIn("m-pago","Fecha de pago (o de consulta)",di(HOY))}</div><div class="res" id="m-res"></div><div id="m-steps"></div>`;
  const run=()=>{const sal=N("m-sal"),f=D("m-fin"),p=D("m-pago");if(!(sal>0)||!f||!p||LAB.cmp(p,f)<0){$("m-res").innerHTML=err("el pago no puede ser anterior a la terminación.");$("m-steps").innerHTML="";return}
    const dias=LAB.days360(f,p),{smmlv}=LAB.valores(f),R=LAB.moratoria({salario:sal,diasRetardo:dias,smmlv});
    $("m-res").innerHTML=tiles([["Días de retardo",dias.toLocaleString("es-CO")],["Días que se pagan",R.dias.toLocaleString("es-CO")],["Salario diario",$c(R.diario)],["Moratoria",$p(R.valor),"okt"]]);
    $("m-steps").innerHTML=stp(1,"Paso a paso",`<div class="eq al">Salario ${R.minimo?"≤":">"} 1 SMMLV (${$p(smmlv)}) ⇒ ${R.minimo?"régimen anterior: sin tope de 24 meses":"tope de 24 meses (720 días)"}<br>Moratoria = ${R.dias} × ${$c(R.diario)} = <b>${$c(R.valor)}</b></div>${R.intereses?`<p class="warn"><b>Desde el mes 25</b> (${R.diasInteres} días) ya no corre la indemnización diaria: se deben intereses moratorios sobre lo adeudado a la tasa máxima vigente, que certifica la Superintendencia Financiera.</p>`:""}`)};
  watch(["m-sal","m-fin","m-pago"],run);run();
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
  <div class="res" id="n-res"></div><div class="tbl"><table id="n-tab"></table></div><div id="n-emp"></div>`;
  const ks=Object.keys(KEYS).filter(k=>k!=="ord");
  const run=()=>{const sal=N("n-sal"),dias=N("n-dias"),f=D("n-fec")||HOY,V_=LAB.valores(f);
    if(!(sal>0)||!(dias>=0&&dias<=30)){$("n-res").innerHTML=err("revisa el salario y que los días estén entre 0 y 30.");return}
    const H={};ks.forEach(k=>{const v=N("n-"+k);H[k]=isFinite(v)&&v>0?v:0});
    const hora=LAB.horaOrdinaria(sal,V_.horasMes),X=LAB.valorHoras(H,hora,V_.dominical),R=LAB.nomina({salario:sal,dias,extras:X.total,smmlv:V_.smmlv,aux:V_.aux,auxDerecho:$("n-aux").value==="si"});
    $("n-res").innerHTML=tiles([["Total devengado",$p(R.dev)],["Total deducciones",$p(R.ded),"badt"],["Neto a pagar",$p(R.neto),"okt"],["IBC",`${$p(R.ibc)} (${fmt(R.veces,2)} SMMLV)`]]);
    const row=(a,b,c="")=>`<tr><td>${a}</td><td class="num ${c}">${b}</td></tr>`;
    $("n-tab").innerHTML=`<tr><th>Concepto</th><th>Valor</th></tr><tr><td colspan="2"><b>Devengados</b></td></tr>`+row(`Salario básico (${fm(dias)} días × ${$c(sal/30)})`,$c(R.basico))+X.items.map(i=>row(`${KEYS[i.k]}: ${fmt(i.h,2)} h × ${$c(hora)} × ${fmt(i.factor,2)}`,$c(i.valor))).join("")+row(R.auxT?`Auxilio de transporte (${fm(dias)} días)`:`Auxilio de transporte ${sal>2*V_.smmlv?"(no aplica: gana más de 2 SMMLV)":"(no aplica)"}`,$c(R.auxT))
      +`<tr><td colspan="2"><b>Deducciones</b></td></tr>`+row("Salud (4 % del IBC)",$c(R.salud))+row("Pensión (4 % del IBC)",$c(R.pension))+row(R.fsp?`Fondo de solidaridad pensional (${fmt(R.fsp*100,1)} %)`:"Fondo de solidaridad pensional (no aplica: menos de 4 SMMLV)",$c(R.fspV))+`<tr><td><b>Neto a pagar</b></td><td class="num"><b>${$c(R.neto)}</b></td></tr>`;
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

// ---- Planilla de horas del taller: cada hora en su columna y pago por quincena
const PLAP={
  ej1:{t:"Taller · Ejercicio 1 (ingresó por primera vez)",ingreso:2,venia:false,salario:2940000,x:"2-4: 8am-5pm\n5: 10pm-7am\n6: descanso\n7-11: 6pm-4am\n12: 1pm-8pm\n13: 2pm-11pm\n14-15: 2pm-11pm\n16-19: 8am-12m, 2pm-7pm\n20-21: 5am-3pm\n22-24: 11am-9pm\n25: permiso remunerado\n26: descanso\n27-28: 10pm-7am\n29-30: incapacidad\n31: 9pm-7am"},
  ej2:{t:"Taller · Ejercicio 2 (venía laborando)",ingreso:1,venia:true,salario:2850000,x:"1-4: 2pm-11pm\n5-6: descanso\n7-9: 9pm-7am\n10-12: sancion\n13-15: 7pm-4am\n16-19: 8am-12m, 2pm-8pm\n20-21: 10am-7pm\n22-23: 10pm-8am\n24: licencia no remunerada\n25: 10pm-8am\n26: incapacidad\n27-28: 2pm-11pm\n29: descanso\n30-31: licencia no remunerada"},
  vacio:{t:"Empezar en blanco",ingreso:1,venia:true,salario:2000000,x:"1-3: 6am-2pm\n"}};
const DIAS=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],DI1="DLMMJVS";
const hh=m=>{m=((m%1440)+1440)%1440;const h=Math.floor(m/60),mi=m%60,ap=h<12?"a. m.":"p. m.",h12=h%12===0?12:h%12;return `${h12}:${String(mi).padStart(2,"0")} ${ap}`};
const hN=v=>v?(Math.round(v*100)/100).toLocaleString("es-CO"):"";
SIMS.planilla=function(){
  $("sim").innerHTML=`<div class="calcf">${selIn("pl-pre","Ejercicio",Object.keys(PLAP).map(k=>[k,PLAP[k].t]),"ej1")}</div>
  <details class="exted" open><summary>Datos del mes y del trabajador</summary><div class="calcf" style="margin-top:8px">
  ${numIn("pl-n","Días del mes",31)}${selIn("pl-w","El día 1 es",DIAS.map((d,i)=>[String(i),d]),"2")}<label for="pl-f">Festivos (días)<input id="pl-f" value="1, 14, 21"></label>
  ${selIn("pl-v","El trabajador",[["v","venía laborando"],["n","ingresó por primera vez"]],"n")}${numIn("pl-i","Día de ingreso",2)}
  ${numIn("pl-s","Salario mensual",2940000,"1000")}${numIn("pl-j","Jornada diaria (h, lunes a sábado)",7,"0.5")}
  ${selIn("pl-d","Recargo dominical y festivo",[["0.8","80 % (desde 1-jul-2025)"],["0.9","90 % (desde 1-jul-2026)"],["1","100 % (desde 1-jul-2027)"]],"0.9")}
  ${selIn("pl-no","Jornada nocturna desde",[["19","7:00 p. m. (desde 25-dic-2025)"],["21","9:00 p. m. (antes)"]],"19")}
  ${selIn("pl-pd","Sanción o licencia en la semana",[["1","pierde el dominical (art. 173)"],["0","no afecta el dominical"]],"1")}
  ${selIn("pl-pr","Dominical proporcional (si no cumplió la semana)",[["h","por horas: 7 × horas/42"],["d","por días: 7 × días/6"]],"h")}
  ${selIn("pl-in","Incapacidad (días 1 y 2)",[["2/3","2/3 del día (art. 227)"],["1","día completo"]],"2/3")}
  ${selIn("pl-ax","Auxilio de transporte",[["0","no incluir"],["1","incluir si gana hasta 2 SMMLV"]],"0")}
  ${selIn("pl-de","Deducciones",[["0","no descontar"],["1","salud 4 % y pensión 4 %"]],"0")}</div></details>
  <label for="pl-tx" style="display:block;font-size:13px;margin-top:6px"><b>Novedades del mes</b>, una por línea: «días: horario» o «días: novedad». Horarios: <code>8am-5pm</code>, <code>10:00pm-7:00am</code>, <code>8am-12m, 2pm-7pm</code>. Novedades: <code>descanso</code>, <code>permiso remunerado</code>, <code>incapacidad</code>, <code>sancion</code>, <code>licencia no remunerada</code>, <code>vacaciones</code>. Los domingos y festivos que no escribas se toman como descanso.</label>
  <textarea id="pl-tx" class="pltx" rows="10" spellcheck="false"></textarea><div id="pl-out" class="slv-out"></div>`;
  const load=k=>{const p=PLAP[k];$("pl-tx").value=p.x;$("pl-s").value=p.salario;$("pl-v").value=p.venia?"v":"n";$("pl-i").value=p.ingreso;$("pl-n").value=31;$("pl-w").value="2";$("pl-f").value="1, 14, 21"};
  const run=()=>{const out=$("pl-out");const n=Math.round(N("pl-n")),w=+$("pl-w").value,sal=N("pl-s"),J=N("pl-j"),venia=$("pl-v").value==="v",ing=venia?1:Math.round(N("pl-i"));
    $("pl-i").disabled=venia;
    if(!(n>=28&&n<=31)||!(sal>0)||!(J>0&&J<=10)||!(ing>=1&&ing<=n)){out.innerHTML=`<p class="err">Revisa los datos: días del mes entre 28 y 31, salario positivo, jornada entre 0 y 10 horas y día de ingreso dentro del mes.</p>`;return}
    const fs=($("pl-f").value.match(/\d+/g)||[]).map(Number).filter(d=>d>=1&&d<=n);
    const p=LAB.parsePlanilla($("pl-tx").value,n);if(p.errs.length){out.innerHTML=`<p class="err">Revisa las novedades: ${p.errs.join(" ")}</p>`;return}
    const V0=LAB.valores({y:2026,m:10,d:1}),cfg={ndias:n,dow1:w,festivos:fs,ingreso:ing,venia,salario:sal,jornada:J,d:+$("pl-d").value,noct:+$("pl-no").value,smmlv:V0.smmlv,pierde:$("pl-pd").value==="1",propHoras:$("pl-pr").value==="h",ndiasPrev:30,incap:$("pl-in").value==="2/3"?2/3:1};
    const r=LAB.planilla(cfg,p.rec),C=LAB.COLS,F=r.F;
    // calendario
    let cal=`<div class="tbl plcal"><table><tr>${DI1.split("").map(x=>`<th>${x}</th>`).join("")}</tr><tr>`;for(let i=0;i<w;i++)cal+="<td></td>";
    for(let d=1;d<=n;d++){const row=r.rows[d-1],tp=row.tipo;if((w+d-1)%7===0&&d>1)cal+="</tr><tr>";cal+=`<td class="${row.dom?"pdom":""}${d<ing?" pfuera":""}" title="${tp||""}"><b>${d}</b><small>${tp==="trabajo"?"✓":tp?{descanso:"desc.",permiso:"perm.",incapacidad:"incap.",sancion:"sanc.",licencia:"lic.",vacaciones:"vac."}[tp]:""}</small></td>`}
    cal+="</tr></table></div>";
    // tabla principal
    const head=`<tr><th>Día</th>${C.map(k=>`<th title="${LAB.NOMCOL[k]}">${k}<br><small>${fmt(F[k],2)}</small></th>`).join("")}<th>Nota</th></tr>`;
    const corto=row=>{const t=[];if(row.dom&&row.desc){const w=row.desc.why;t.push(row.desc.h?(row.descSum?(row.desc.prop?`descanso proporcional: ${row.desc.form} = ${hN(row.descSum)} h`:(row.fest&&row.dow!==0?"festivo remunerado 7 h":"descanso dominical 7 h")):"descanso proporcional no se suma"):(/no trabajaba/.test(w)?"aún no trabajaba":/31/.test(w)?"día 31":/incapacidad/.test(w)?"recibe incapacidad":"pierde el dominical"))}
      if(row.trabajo){if(row.base==="desc")t.push("ordinarias: solo recargo");if(row.base==="31")t.push("día 31: base ya pagada");const ex=["HED","HEN","HEDD","HEND"].reduce((q,k)=>q+row.h[k],0);if(ex>2)t.push(`⚠ ${hN(ex)} h extra (máx. 2)`)}
      const x=row.tipo;if(x&&x!=="trabajo")t.push({descanso:row.dom?"":"descanso compensatorio",permiso:"permiso remunerado",incapacidad:"incapacidad 2/3",sancion:"sanción (art. 51)",licencia:"licencia no remunerada",vacaciones:"vacaciones"}[x]+(row.d===31?" (no suma)":""));
      return t.filter(Boolean).join(" · ")};
    const largo=row=>{const t=[];if(row.dom&&row.desc)t.push(row.desc.h?`${hN(row.descSum)} h en HD: ${row.desc.why}.`:`Sin descanso pagado: ${row.desc.why}.`);
      if(row.trabajo){const ex=["HED","HEN","HEDD","HEND"].reduce((q,k)=>q+row.h[k],0);if(ex>2)t.push(`Son ${hN(ex)} horas extra: pasan el máximo legal de 2 al día, pero se pagan igual.`);if(row.h.D0)t.push(`${hN(row.h.D0)} h diurnas ordinarias del día 31 no suman: ya las paga el salario.`)}
      t.push(...row.notas.map(z=>z.charAt(0).toUpperCase()+z.slice(1)+"."));return t};
    const rowH=row=>`<tr class="${row.dom?"pdom":""}"><td><b>${row.d}</b> ${DI1[row.dow]}${row.fest?" F":""}</td>${C.map(k=>`<td class="num">${hN(row.h[k])}</td>`).join("")}<td class="pnota">${corto(row)}</td></tr>`;
    const sub=(i,lab)=>`<tr class="psub"><td>${lab}</td>${C.map(k=>`<td class="num">${hN(r.tot[i].h[k])}</td>`).join("")}<td>${i===1&&r.extra30?`incluye ${hN(r.extra30)} h para completar 30 días`:""}</td></tr>`;
    let tab=`<div class="tbl ptab"><table>${head}${r.rows.filter(x=>x.d<=15).map(rowH).join("")}${sub(0,"1.ª quincena")}${r.rows.filter(x=>x.d>15).map(rowH).join("")}${sub(1,"2.ª quincena")}</table></div>`;
    // pago
    const aux=$("pl-ax").value==="1"&&sal<=2*V0.smmlv,ded=$("pl-de").value==="1";
    const diasAux=q=>r.rows.filter(x=>(q?x.d>15:x.d<=15)&&x.d<=30&&x.tipo==="trabajo").length;
    const pago=i=>{const t=r.tot[i];const ax=aux?V0.aux/30*diasAux(i):0,dd=ded?t.total*0.08:0;
      return `<div class="tbl"><table><tr><th>Columna</th><th>Horas</th><th>Factor</th><th>Valor de la hora × factor</th><th>Valor</th></tr>${C.filter(k=>t.h[k]).map(k=>`<tr><td>${k} · ${LAB.NOMCOL[k]}</td><td class="num">${hN(t.h[k])}</td><td class="num">${fmt(F[k],2)}</td><td class="num">${$c(r.vh*F[k])}</td><td class="num">${$p(t.val[k])}</td></tr>`).join("")}
      <tr class="psub"><td>Total por horas</td><td class="num">${hN(C.reduce((s,k)=>s+t.h[k],0))}</td><td></td><td></td><td class="num">${$p(t.total)}</td></tr>
      ${aux?`<tr><td>Auxilio de transporte (${diasAux(i)} días trabajados)</td><td></td><td></td><td></td><td class="num">${$p(ax)}</td></tr>`:""}${ded?`<tr><td>Salud y pensión (8 % de lo que no es auxilio)</td><td></td><td></td><td></td><td class="num">−${$p(dd)}</td></tr>`:""}
      <tr class="psub"><td><b>A pagar</b></td><td></td><td></td><td></td><td class="num"><b>${$p(t.total+ax-dd)}</b></td></tr></table></div>`};
    // detalle de cada día
    const det=r.rows.filter(x=>x.trabajo||largo(x).length).map(row=>{const segs=row.trabajo?`<ul>${row.detalle.map(s=>`<li>${hh(s.a)} a ${hh(s.b)}${s.sd!==row.d?` (ya es el día ${s.sd>n?s.sd-n+" del mes siguiente":s.sd})`:""}: ${s.extra?"extra":"ordinaria"}, ${s.noct?"nocturna":"diurna"}${s.dom?", en domingo o festivo":""} → <b>${(s.b-s.a)/60} h ${s.k==="D0"?"sin pago adicional":s.k}</b></li>`).join("")}</ul>`:"";
      return `<details class="pdet"><summary>Día ${row.d} (${DIAS[row.dow]}${row.fest?", festivo":""})${row.trabajo?"":" · "+corto(row)}</summary>${segs}${largo(row).map(z=>`<p class="hint">${z}</p>`).join("")}${row.base==="desc"?`<p class="hint">La base de las horas ordinarias ya está pagada con el descanso remunerado de ese día, así que solo se suman los recargos: RDD de día, RND de noche y RN si el turno pasa a un día hábil.</p>`:""}${row.base==="31"?`<p class="hint">El salario mensual cubre 30 días: en el 31 las ordinarias diurnas no suman, las nocturnas llevan solo el recargo (RN o RND) y las extra se pagan completas.</p>`:""}</details>`}).join("");
    out.innerHTML=`<div class="stepc"><h4><span class="n">1</span>Calendario</h4>${cal}<p class="hint">Sombreados: domingos y festivos. Valor de la hora ordinaria: ${$p(sal)} / (${hN(J)} × 30) = <b>${$c(r.vh)}</b>.</p></div>
    <div class="stepc"><h4><span class="n">2</span>Planilla de horas</h4><p class="hint">Cada turno se asigna a la fila del día en que empieza. Cada franja se clasifica por el día en que cae: lo que pasa de medianoche a un domingo o festivo es dominical. Las primeras ${hN(J)} horas del turno son ordinarias y el resto son extra.</p>${tab}</div>
    <div class="stepc"><h4><span class="n">3</span>Pago de la primera quincena (días 1 a 15)</h4>${pago(0)}</div>
    <div class="stepc"><h4><span class="n">4</span>Pago de la segunda quincena (días 16 a ${n})</h4>${pago(1)}<div class="verdict acc">Total del mes por horas: ${$p(r.tot[0].total+r.tot[1].total)}</div></div>
    <div class="stepc"><h4><span class="n">5</span>Detalle de cada día</h4><p class="hint">Abre un día para ver cada franja del turno, en qué columna quedó y por qué.</p>${det}</div>`};
  load("ej1");
  $("pl-pre").addEventListener("change",()=>{load($("pl-pre").value);run()});
  watch(["pl-n","pl-w","pl-f","pl-v","pl-i","pl-s","pl-j","pl-d","pl-no","pl-pd","pl-pr","pl-in","pl-ax","pl-de","pl-tx"],run);run()};
