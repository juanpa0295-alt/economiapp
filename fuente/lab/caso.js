
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
  CASO_PRE.mariana={id:"mariana",nombre:"Mariana (taller)",tipo:"fijo",ingreso:"2023-11-08",retiro:"2026-10-31",durM:8,durD:15,modo:"360",salario:4950000,desde:"2025-01-01",vacDesde:"2025-01-01",disfrutados:0,meses:m,pagos:{prima:false,ces:false,int:false},planilla:{pre:"mariana"},res:{}};
  const p={};[1,2,3,4,8,9,10,11,12].forEach(k=>p["2025-"+k]=[1835000,2000000,0,"Comisiones"]);p["2025-5"]=[1835000,4000000,0,"Comisiones"];p["2025-6"]=[1835000,0,30,"Suspensión"];p["2025-7"]=[1835000,0,30,"Suspensión"];
  [1,2,3,5,7].forEach(k=>p["2026-"+k]=[4250000,0,0,""]);p["2026-4"]=[4250000,0,30,"Suspensión"];p["2026-6"]=[4250000,1198094,3,"Junio de la solución de clase: 5.448.094"];p["2026-8"]=[4250000,0,30,"Licencia no remunerada"];
  CASO_PRE.pedro={id:"pedro",nombre:"Pedro (taller)",tipo:"indef",ingreso:"2021-05-08",retiro:"2026-08-31",durM:12,durD:0,modo:"360",salario:4250000,desde:"2025-01-01",vacDesde:"2025-01-01",disfrutados:0,meses:p,pagos:{prima:false,ces:false,int:false},planilla:{pre:"pedro"},res:{}}})();
// activa un caso de taller (conserva los resultados guardados si ya existía)
CASO.taller=k=>{const P=CASO_PRE[k];if(!P)return null;const ya=CASO.lista().find(c=>c.id===P.id);const c=ya||CASO.nuevo(P);if(!ya)CASO.guardar(c);CASO.activar(c.id);return c};
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
SIMS.vac=function(){
  $("sim").innerHTML=`<div class="chips pre" id="v-ej"><button type="button" data-k="mariana">Taller: Mariana (desde 2025)</button><button type="button" data-k="simple">Ejemplo: un año completo</button></div>
  <h4 class="subh">1. Vacaciones causadas y compensación en dinero</h4>
  <div class="calcf">${dateIn("v-ini","Desde (ingreso o últimas vacaciones)","2025-01-01")}${dateIn("v-ret","Hasta (retiro o fecha de corte)","2026-10-31")}${numIn("v-sal","Salario ordinario mensual",4950000,"1000")}${numIn("v-a51","Días de suspensión (art. 51) a descontar",122)}${numIn("v-dis","Días hábiles ya disfrutados en ese tiempo",0,"0.5")}
  ${selIn("v-bt","Tipo de salario",[["fijo","Fijo: el salario ordinario actual"],["var","Variable: promedio del último año"]],"fijo")}</div>
  <div class="res" id="v-res"></div><div id="v-st"></div>
  <h4 class="subh">2. Disfrute: ¿cuándo regresa?</h4>
  <div class="calcf">${dateIn("v-d0","Primer día de vacaciones","2026-12-14")}${numIn("v-dh","Días hábiles de vacaciones",15)}${selIn("v-sab","¿Trabaja los sábados?",[["1","Sí: el sábado es día hábil"],["0","No: de lunes a viernes"]],"1")}</div>
  <div class="res" id="v-res2"></div><div id="v-st2"></div>`;
  let last=null;
  const run=()=>{const a=D("v-ini"),b=D("v-ret"),sal=N("v-sal"),a51=Math.max(0,Math.round(N("v-a51")||0)),dis=Math.max(0,N("v-dis")||0),vari=$("v-bt").value==="var";
    $("v-sal").closest("label").firstChild.textContent=vari?"Promedio mensual del último año (sin horas extra ni dominicales trabajados)":"Salario ordinario mensual";
    if(!a||!b||LAB.cmp(a,b)>0||!(sal>0)){$("v-res").innerHTML=err("revisa las fechas y el salario.");$("v-st").innerHTML="";last=null}
    else{const R=LAB.vacaciones({inicio:a,retiro:b,salario:sal,art51:a51,disfrutados:dis});last={R,a,b,sal};
      $("v-res").innerHTML=tiles([["Días trabajados",R.dias.toLocaleString("es-CO")],["Días hábiles causados",fmt(R.causados,2)],["Pendientes",fmt(R.pend,2)],["Compensación en dinero",$p(R.valor),"okt"]]);
      $("v-st").innerHTML=stp(1,"Días trabajados",`<div class="eq al">Días = días360(${dt(a)}, ${dt(b)}) + 1 = ${R.total}${R.art51?`<br>Menos las suspensiones del art. 51 (art. 53 las descuenta para vacaciones): ${R.total} − ${R.art51} = <b>${R.dias}</b>`:""}</div>`)
       +stp(2,"Días de vacaciones",`<div class="eq al">Por cada 360 días trabajados, 15 días hábiles (art. 186)<br>Días de vacaciones = ${R.dias} × 15 / 360 = <b>${fmt(R.causados,2)}</b>${dis?`<br>Menos los ya disfrutados: ${fmt(R.causados,2)} − ${fmt(dis,2)} = <b>${fmt(R.pend,2)}</b>`:""}</div>`)
       +stp(3,"Valor",`<div class="eq al">Vacaciones = salario × días trabajados / 720${dis?" (menos lo disfrutado)":""}<br>= ${$p(sal)} × ${R.dias} / 720${dis?` − ${$c(R.diario)} × ${fmt(dis,2)}`:""} = <b>${$c(R.valor)}</b><br><small>Es lo mismo que salario / 30 × días de vacaciones: ${$c(R.diario)} × ${fmt(R.pend,2)} = ${$c(R.valor)}</small></div>
       <p class="hint">${vari?"Salario variable: la base es el promedio de lo devengado en el último año (art. 192, num. 2).":"La base es el último salario ordinario devengado (art. 189, num. 2)."} No se incluyen las horas extra, el trabajo en dominicales y festivos ni el auxilio de transporte: las vacaciones son un descanso remunerado, no una prestación social. Al terminar el contrato, las no disfrutadas se compensan en dinero por año cumplido y proporcionalmente por la fracción (art. 189).</p>`)}
    const d0=D("v-d0"),dh=Math.round(N("v-dh"));if(!d0||!(dh>=1&&dh<=60)){$("v-res2").innerHTML=err("revisa la fecha de inicio y los días hábiles (1 a 60).");$("v-st2").innerHTML="";return}
    const Q=LAB.disfrute(d0,dh,$("v-sab").value==="1"),dia=sal>0?sal/30:0,pago=dia*Q.calendario,vv=dia*dh,otros=Q.calendario-dh,b2=D("v-ret"),fuera=b2&&LAB.cmp(d0,b2)>0;
    $("v-res2").innerHTML=(fuera?`<p class="note" style="margin:0 0 10px">Ojo: el ${dt(d0)} es posterior a la fecha de retiro (${dt(b2)}). Si el contrato ya terminó, las vacaciones no se disfrutan: se <b>compensan en dinero</b> (parte 1). Esta parte sirve cuando la persona sigue trabajando.</p>`:"")+tiles([["Último día de vacaciones",dt(Q.ultimo)],["Regresa a trabajar",dt(Q.regreso),"okt"],["Valor de las vacaciones ("+dh+" días hábiles)",$p(vv)],["Total que recibe por el período ("+Q.calendario+" días calendario)",$p(pago)]]);
    $("v-st2").innerHTML=stp(1,"Conteo de días hábiles",`<p>Se cuentan ${dh} días hábiles desde el ${dt(d0)}. No cuentan: ${Q.no.length?Q.no.map(x=>`${x.f.d}/${x.f.m} (${x.por})`).join(", "):"ningún día"}.</p><div class="eq al">Valor de las vacaciones = salario / 30 × días hábiles = ${$p(sal)} / 30 × ${dh} = <b>${$c(vv)}</b><br>Los otros ${otros} días hasta el regreso (domingos y festivos${$("v-sab").value==="1"?"":" y sábados"} que caen entre el primer día de vacaciones y el día en que vuelve) se pagan como salario ordinario: ${$c(dia)} × ${otros} = ${$c(dia*otros)}<br>Total que recibe por el período = ${$c(dia)} × ${Q.calendario} = <b>${$c(pago)}</b></div><p class="hint">Los festivos se calculan con la Ley 51 de 1983 (los movibles pasan al lunes). El empleador debe avisar la fecha con 15 días de anticipación (art. 187) y pagar las vacaciones por anticipado (art. 192).</p>`)};
  const SET=v=>{Object.entries(v).forEach(([k,x])=>{if($(k))$(k).value=x});run()};
  const EJ={mariana:{"v-ini":"2025-01-01","v-ret":"2026-10-31","v-sal":4950000,"v-a51":122,"v-dis":0,"v-bt":"fijo"},simple:{"v-ini":"2025-01-01","v-ret":"2025-12-31","v-sal":2000000,"v-a51":0,"v-dis":0,"v-bt":"fijo"}};
  const deCaso=c=>{const desde=c.vacDesde||c.desde||c.ingreso;SET({"v-ini":desde,"v-ret":c.retiro,"v-sal":c.salario,"v-a51":CASO.art51(c,desde,c.retiro),"v-dis":c.disfrutados||0})};
  $("v-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.k==="mariana"){const c=CASO.taller("mariana");deCaso(c);bar.draw("Se activó el caso de Mariana.")}else SET(EJ[b.dataset.k])});
  const ids=["v-ini","v-ret","v-sal","v-a51","v-dis","v-bt","v-d0","v-dh","v-sab"];watch(ids,run);
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;const c0=CASO.dePre(pre)||CASO.activo();run();
  guardados("vacaciones",{get:formGet(ids),set:formSet(ids,run),label:"Vacaciones",restore:!c0});
  const bar=casoBar("vacaciones",{cargar:deCaso,resultado:()=>last&&{t:`${fmt(last.R.pend,2)} días hábiles (${last.R.dias} días trabajados)`,v:last.R.valor,l:[["Desde",dt(last.a)],["Hasta",dt(last.b)],["Base",$p(last.sal)],["Días trabajados",String(last.R.dias)]]}});
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
