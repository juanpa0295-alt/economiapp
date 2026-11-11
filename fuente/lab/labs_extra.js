
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
