
// ===================== LABORATORIOS DEL PROGRAMA 1503704 =====================
(function(){
const ni=(id,l,v)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" step="any" inputmode="decimal"></label>`;
const g=id=>parseFloat(String($(id).value).replace(",","."));
const on=(ids,run)=>ids.forEach(i=>$(i).addEventListener("input",run));
SIMS.folk=function(){
  $("sim").innerHTML=`<p>Dilema del prisionero simétrico: pagos del jugador fila.</p><div class="calcf">${ni("fk-R","R: ambos cooperan",3)}${ni("fk-T","T: me desvío y el otro coopera",5)}${ni("fk-S","S: coopero y el otro se desvía",0)}${ni("fk-P","P: ambos se desvían",1)}</div><div class="ctr">${ctl("fk-d","Factor de descuento δ",0,0.99,0.01,0.6)}</div><div class="res" id="fk-res"></div><div id="fk-st"></div>`;
  const run=()=>{const R=g("fk-R"),T=g("fk-T"),S=g("fk-S"),P=g("fk-P"),d=V("fk-d");if(!(T>R&&R>P&&P>S)){$("fk-res").innerHTML=err("un dilema del prisionero exige T > R > P > S.");$("fk-st").innerHTML="";return}
    const ds=(T-R)/(T-P),coop=R/(1-d),dev=T+d*P/(1-d),tft=(T-R)/(R-S);
    $("fk-res").innerHTML=tiles([["δ* con gatillo",fmt(ds,4),"okt"],["Valor de cooperar R/(1 − δ)",fmt(coop,3)],["Valor de desviarse T + δP/(1 − δ)",fmt(dev,3)],["¿Se sostiene la cooperación?",d>=ds?"Sí":"No",d>=ds?"okt":"badt"],["δ mínimo con ojo por ojo",fmt(tft,4)]]);
    $("fk-st").innerHTML=stp(1,"Comparación",`<div class="eq al">Cooperar siempre: ${fm(R)}/(1 − ${fm(d)}) = ${fmt(coop,3)}<br>Desviarse hoy y recibir el castigo: ${fm(T)} + ${fm(d)}·${fm(P)}/(1 − ${fm(d)}) = ${fmt(dev,3)}<br>δ* = (T − R)/(T − P) = (${fm(T)} − ${fm(R)})/(${fm(T)} − ${fm(P)}) = <b>${fmt(ds,4)}</b></div><p>Por el teorema de Folk, cualquier pago promedio entre ${fm(P)} (minimax) y el máximo factible puede sostenerse con δ suficientemente alto. Con un horizonte finito conocido, en cambio, la cooperación se desarma desde la última ronda.</p>`)};
  on(["fk-R","fk-T","fk-S","fk-P"],run);bindCtl(["fk-d"],run);run()};
SIMS.suscrip=function(){
  $("sim").innerHTML=`<h4 class="subh">Contribuciones voluntarias</h4><div class="ctr">${ctl("su-n","Jugadores n",2,30,1,4)}${ctl("su-a","Rendimiento marginal per cápita a",0.05,1.5,0.05,0.5)}${ctl("su-w","Dotación w",1,100,1,20)}</div><div class="res" id="su-res"></div>
  <h4 class="subh">Mecanismo de suscripción</h4><div class="calcf">${ni("su-C","Costo del bien C",100)}<label for="su-v">Valoraciones de los jugadores<input id="su-v" value="40 35 30 20" style="width:100%"></label><label for="su-c">Aportes propuestos<input id="su-c" value="30 30 25 15" style="width:100%"></label></div><div id="su-o"></div>`;
  const run=()=>{const n=Math.round(V("su-n")),a=V("su-a"),w=V("su-w");
    $("su-res").innerHTML=tiles([["Aporte de equilibrio",a<1?"0 (free riding)":"w (aportar es dominante)",a<1?"badt":"okt"],["Pago de cada uno en equilibrio",fmt(a<1?w:a*n*w,2)],["Aporte socialmente óptimo",n*a>1?"w":"0"],["Pago si todos aportan",fmt(a*n*w,2)]]);
    const C=g("su-C"),v=($("su-v").value.match(/-?\d+(?:[.,]\d+)?/g)||[]).map(x=>+x.replace(",",".")),c=($("su-c").value.match(/-?\d+(?:[.,]\d+)?/g)||[]).map(x=>+x.replace(",","."));
    if(v.length!==c.length||!v.length||!(C>0)){$("su-o").innerHTML=err("una valoración y un aporte por jugador.");return}
    const tot=c.reduce((s,x)=>s+x,0),prov=tot>=C,rows=v.map((vi,i)=>{const u=prov?vi-c[i]:0;let dev="";if(prov&&tot-c[i]<C&&c[i]>vi)dev="aporta más de lo que valora: prefiere no aportar";else if(prov&&tot>C&&c[i]>0)dev="podría aportar menos y el bien igual se provee";else if(!prov&&C-(tot-c[i])<vi)dev="le conviene completar el faltante";return[i+1,fm(vi),fm(c[i]),fmt(u,2),dev||"no tiene desviación rentable"]});
    const nash=rows.every(r=>r[4]==="no tiene desviación rentable");
    $("su-o").innerHTML=`<div class="tbl"><table><tr><th>Jugador</th><th>Valoración</th><th>Aporte</th><th>Pago</th><th>Desviación</th></tr>${rows.map(r=>`<tr><td>${r.join("</td><td>")}</td></tr>`).join("")}</table></div>`+verdict(nash,`Es un equilibrio de Nash: los aportes suman ${fm(tot)} ${prov?"= C":"y nadie puede completar el costo por sí solo"}.`,`No es equilibrio de Nash (aportes = ${fm(tot)}, C = ${fm(C)}).`)};
  bindCtl(["su-n","su-a","su-w"],run);on(["su-C","su-v","su-c"],run);run()};
SIMS.spence=function(){
  $("sim").innerHTML=`<div class="calcf">${ni("sp-H","θH: productividad del tipo alto",10)}${ni("sp-L","θL: productividad del tipo bajo",4)}${ni("sp-cH","cH: costo por unidad de educación, tipo alto",1)}${ni("sp-cL","cL: costo por unidad, tipo bajo",3)}${ni("sp-p","Probabilidad a priori del tipo alto",0.4)}</div><div class="ctr">${ctl("sp-e","Umbral de educación e* que exigen las empresas",0,12,0.1,3)}</div><div class="res" id="sp-res"></div><div id="sp-st"></div>`;
  const run=()=>{const H=g("sp-H"),L=g("sp-L"),cH=g("sp-cH"),cL=g("sp-cL"),p=g("sp-p"),e=V("sp-e");if(!(H>L&&cL>cH&&cH>0&&p>0&&p<1)){$("sp-res").innerHTML=err("se requiere θH > θL, cL > cH > 0 y 0 < p < 1.");return}
    const lo=(H-L)/cL,hi=(H-L)/cH,icH=H-cH*e>=L,icL=L>=H-cL*e,sep=icH&&icL,pool=p*H+(1-p)*L;
    $("sp-res").innerHTML=tiles([["Rango separador de e*",`[${fmt(lo,2)}; ${fmt(hi,2)}]`],["¿El tipo alto se educa?",icH?"Sí":"No",icH?"okt":"badt"],["¿El tipo bajo prefiere no educarse?",icL?"Sí":"No",icL?"okt":"badt"],["Equilibrio",sep?"Separador":"No separa",sep?"okt":"badt"],["Salario agrupador",fmt(pool,2)]]);
    $("sp-st").innerHTML=stp(1,"Restricciones de incentivos",`<div class="eq al">Tipo alto: θH − cH·e* ≥ θL ⟺ ${fm(H)} − ${fm(cH)}·${fm(e)} = ${fmt(H-cH*e,2)} ≥ ${fm(L)}<br>Tipo bajo: θL ≥ θH − cL·e* ⟺ ${fm(L)} ≥ ${fmt(H-cL*e,2)}<br>Creencias: μ(alto | e ≥ e*) = 1, μ(alto | e < e*) = 0</div><p>Con e* = ${fmt(lo,2)} se obtiene el separador menos costoso. En un equilibrio agrupador nadie se educa y todos ganan ${fmt(pool,2)}; el tipo alto gana más en el separador si θH − cH·e* > ${fmt(pool,2)}.</p>`)};
  on(["sp-H","sp-L","sp-cH","sp-cL","sp-p"],run);bindCtl(["sp-e"],run);run()};
})();

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "re-a":"<b>Intercepto de la demanda</b> P = a − bQ.","re-b":"<b>Pendiente de la demanda.</b>","re-c":"<b>Costo marginal</b> de cada firma.","re-n":"<b>Número de firmas</b> en Cournot. Con más firmas, el precio se acerca al costo marginal.",
 "su-n":()=>document.getElementById("su-v")?"<b>Número de postores</b> en la subasta. Con más rivales conviene pujar más cerca de la propia valoración.":"<b>Número de jugadores</b> que pueden aportar al bien público.",
 "su-a":"<b>Rendimiento marginal per cápita</b>: lo que le devuelve a cada jugador cada peso aportado. Si a < 1, aportar es dominado; si n·a > 1, aportar es eficiente.","su-w":"<b>Dotación</b> de cada jugador.",
 "fk-d":"<b>Factor de descuento</b>: cuánto vale hoy un pago de mañana. Si supera el umbral (T − R)/(T − P), la cooperación con estrategias gatillo es un equilibrio (teorema de tradición oral).",
 "sp-e":"<b>Educación mínima que exigen las empresas</b> para pagar el salario alto. Hay equilibrio separador si al tipo bajo no le conviene alcanzarla y al alto sí.",
 "co-A":"<b>Valor del primer pez</b> en ρ(H) = A − bH: el precio cae cuando la captura total H crece.","co-b":"<b>Qué tan rápido cae el valor</b> con la captura total.","co-k":"<b>Costo del esfuerzo</b> de cada pescador, c(h) = k·h²/2.","co-n":"<b>Número de pescadores.</b> Más pescadores, más sobreexplotación (tragedia de los comunes).","co-al":"<b>Peso del bien público</b> en la utilidad.","co-w":"<b>Dotación</b> de cada jugador.",
 "ar-m":"<b>Lo que el árbitro considera justo</b> en promedio (arbitraje de oferta final).","ar-s":"<b>Incertidumbre</b> sobre el criterio del árbitro: más incertidumbre, ofertas más extremas.",
 "st-M":"<b>Intercepto de la demanda</b> P = M − dQ.","st-d":"<b>Pendiente de la demanda.</b>","st-c":"<b>Costo marginal</b> de las dos firmas.",
 "ng-d1":"<b>Paciencia del jugador 1</b>: cuánto vale para él hoy un peso del próximo período. Más paciente, mayor su parte.","ng-d2":"<b>Paciencia del jugador 2.</b>","ng-T":"<b>Número de períodos</b> de negociación.","ng-s":"<b>Reparto que se impone</b> si se llega al último período sin acuerdo (parte del jugador 1).",
 "bc-a":"<b>Intercepto de la demanda.</b>","bc-c":"<b>Costo de la firma 1</b> (conocido por todos).","bc-h":"<b>Costo alto</b> que puede tener la firma 2.","bc-l":"<b>Costo bajo</b> que puede tener la firma 2.","bc-t":"<b>Probabilidad de que la firma 2 tenga costo alto</b>, según cree la firma 1 (Cournot con información asimétrica).",
 "su-v":"<b>Tu valoración</b> del objeto que se subasta.","su-m":"<b>Valoración máxima posible</b>: las valoraciones de los rivales se reparten uniformes entre 0 y v̄."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
