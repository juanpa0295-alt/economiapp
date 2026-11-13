
// ===================== LABORATORIOS DEL PROGRAMA 1503712 =====================
(function(){
const lp=({xr,yr,series,hl=[],xl,yl,label,H=240})=>{const W=600,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl);
  let b=hl.map(h=>`<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(h.y)}" y2="${f.sy(h.y)}" stroke="var(${h.col||"--muted"})" stroke-dasharray="5 4"/>`).join("");
  series.forEach(s=>{b+=`<path d="${s.pts.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(${s.col})" stroke-width="2.5"/>`});
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${f.g}${b}</svg></div>`};
const lg=items=>`<div class="legend">${items.map(([c,t])=>`<span><i style="background:var(${c})"></i>${t}</span>`).join("")}</div>`;
const rg=(arrs)=>{let lo=Infinity,hi=-Infinity;arrs.flat().forEach(v=>{lo=Math.min(lo,v);hi=Math.max(hi,v)});const d=(hi-lo)||1;return[lo-0.1*d,hi+0.1*d]};
const pcx=v=>fmt(100*v,2)+" %";

SIMS.multi=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("mu-B","Base monetaria B",10,1000,10,100)}${ctl("mu-c","Efectivo/depósitos c",0.01,1,0.01,0.25)}${ctl("mu-r","Encaje r",0.01,1,0.01,0.1)}${ctl("mu-R","Compra de reservas internacionales del BC",-50,50,1,10)}${ctl("mu-s","Fracción esterilizada (venta de TES)",0,1,0.05,0)}</div><div class="res" id="mu-res"></div><div id="mu-st"></div>`;
  const run=()=>{const B=V("mu-B"),c=V("mu-c"),r=V("mu-r"),R=V("mu-R"),s=V("mu-s"),m=(1+c)/(c+r),B2=B+R*(1-s),D=B/(c+r),C=c*D;
    $("mu-res").innerHTML=tiles([["Multiplicador m",fmt(m,3)],["Depósitos D",fmt(D,2)],["Efectivo C",fmt(C,2)],["M1 inicial",fmt(m*B,2),"okt"],["Base después de la compra",fmt(B2,2)],["M1 final",fmt(m*B2,2)]]);
    $("mu-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">m = (1 + c)/(c + r) = ${fm(1+c)}/${fm(c+r)} = ${fmt(m,4)} · M1 = m·B = ${fmt(m*B,2)}<br>Compra de reservas: ΔRIN = ${fm(R)} ⟹ ΔB = ${fm(R)} − esterilización ${fm(R*s)} = ${fmt(R*(1-s),2)} ⟹ ΔM1 = ${fmt(m*R*(1-s),2)}</div><p>Con tipo de cambio fijo, defender la paridad comprando o vendiendo dólares cambia la base; la esterilización (vender o comprar títulos en la misma cuantía) la neutraliza, pero tiene costo fiscal y sostiene el diferencial de tasas que atrae más capitales.</p>`)};
  bindCtl(["mu-B","mu-c","mu-r","mu-R","mu-s"],run);run()};

SIMS.over=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ov-m","Aumento permanente del dinero (%)",1,30,1,10)}${ctl("ov-l","Semielasticidad de la demanda de dinero λ",0.5,10,0.5,2)}${ctl("ov-t","Velocidad de ajuste de precios θ",0.05,1,0.05,0.3)}</div><div class="res" id="ov-res"></div>${lg([["--line","Tipo de cambio (ln E, %)"],["--exam","Nivel de precios (ln P, %)"],["--muted","Valor de largo plazo"]])}<div id="ov-pl"></div><div id="ov-st"></div>`;
  const run=()=>{const dm=V("ov-m"),l=V("ov-l"),th=V("ov-t"),e0=dm*(1+1/(l*th)),T=20,E=[],P=[];for(let t=-2;t<=T;t++){if(t<0){E.push([t,0]);P.push([t,0])}else{const g=Math.exp(-th*t);E.push([t,dm+(e0-dm)*g]);P.push([t,dm*(1-g)])}}
    $("ov-res").innerHTML=tiles([["Depreciación inmediata",fmt(e0,2)+" %","badt"],["Depreciación de largo plazo",fmt(dm,2)+" %"],["Sobrerreacción",fmt(e0-dm,2)+" puntos"],["Caída inicial de i",fmt((e0-dm)*th,2)+" puntos"]]);
    $("ov-pl").innerHTML=lp({xr:[-2,T],yr:rg([[0,e0*1.1]]),series:[{pts:E,col:"--line"},{pts:P,col:"--exam"}],hl:[{y:dm}],xl:"períodos",yl:"% respecto al inicio",label:"Sobrerreacción del tipo de cambio"});
    $("ov-st").innerHTML=stp(1,"Dornbusch",`<div class="eq al">Δe₀ = Δm·(1 + 1/(λθ)) = ${fm(dm)}·(1 + 1/(${fm(l)}·${fm(th)})) = <b>${fmt(e0,2)} %</b><br>Luego eₜ − ē = (e₀ − ē)e<sup>−θt</sup>: el tipo de cambio se aprecia mientras los precios suben</div><p>Cuanto más lentos los precios (θ pequeño) o menos sensible la demanda de dinero a la tasa (λ pequeño), mayor la sobrerreacción.</p>`)};
  bindCtl(["ov-m","ov-l","ov-t"],run);run()};

SIMS.hbs=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("hb-aT","Productividad de transables, local (% anual)",0,10,0.1,4)}${ctl("hb-aN","Productividad de no transables, local",0,10,0.1,1)}${ctl("hb-aT2","Productividad de transables, externa",0,10,0.1,2)}${ctl("hb-aN2","Productividad de no transables, externa",0,10,0.1,1)}${ctl("hb-g","Peso de los transables en el IPC γ",0.1,0.9,0.05,0.5)}${ctl("hb-T","Años",5,40,1,20)}</div><div class="res" id="hb-res"></div><div id="hb-pl"></div><div id="hb-st"></div>`;
  const run=()=>{const aT=V("hb-aT")/100,aN=V("hb-aN")/100,aT2=V("hb-aT2")/100,aN2=V("hb-aN2")/100,g=V("hb-g"),T=V("hb-T"),dq=-(1-g)*((aT-aN)-(aT2-aN2)),pts=[...Array(Math.round(T)+1)].map((_,t)=>[t,100*Math.pow(1+dq,t)]);
    $("hb-res").innerHTML=tiles([["Cambio del precio relativo PN/PT local",pcx(aT-aN)+" anual"],["Cambio anual del TCR",pcx(dq),dq<0?"okt":"badt"],[`TCR en ${Math.round(T)} años (hoy = 100)`,fmt(pts[pts.length-1][1],1)]]);
    $("hb-pl").innerHTML=lp({xr:[0,T],yr:rg([pts.map(p=>p[1]),[100]]),series:[{pts,col:"--line"}],hl:[{y:100}],xl:"años",yl:"índice del TCR (EP*/P)",label:"Efecto Harrod-Balassa-Samuelson"});
    $("hb-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">q̂ ≈ −(1 − γ)[(âT − âN) − (âT* − âN*)] = −${fm(1-g)}·[(${fm(100*aT)} − ${fm(100*aN)}) − (${fm(100*aT2)} − ${fm(100*aN2)})] % = <b>${pcx(dq)}</b></div><p>${dq<0?"El diferencial de productividad a favor de los transables locales aprecia la moneda en términos reales: no es pérdida de competitividad, sino reflejo de mayor productividad.":"La productividad relativa de los transables crece menos que afuera: la moneda tiende a depreciarse en términos reales."}</p>`)};
  bindCtl(["hb-aT","hb-aN","hb-aT2","hb-aN2","hb-g","hb-T"],run);run()};

SIMS.taylor=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ty-pi","Inflación observada o esperada (%)",-2,15,0.1,5.2)}${ctl("ty-m","Meta de inflación (%)",1,6,0.5,3)}${ctl("ty-r","Tasa real neutral (%)",0,5,0.1,2)}${ctl("ty-y","Brecha del producto (%)",-6,6,0.1,-0.5)}${ctl("ty-a","Peso de la brecha de inflación",0,2,0.1,0.5)}${ctl("ty-b","Peso de la brecha del producto",0,2,0.1,0.5)}</div><div class="res" id="ty-res"></div><div id="ty-st"></div>`;
  const run=()=>{const pi=V("ty-pi"),m=V("ty-m"),r=V("ty-r"),y=V("ty-y"),a=V("ty-a"),b=V("ty-b"),i=r+pi+a*(pi-m)+b*y;
    $("ty-res").innerHTML=tiles([["Tasa de política sugerida",fmt(i,2)+" %","okt"],["Tasa real implícita",fmt(i-pi,2)+" %"],["Postura",i-pi>r+0.25?"Contractiva":i-pi<r-0.25?"Expansiva":"Neutral"]]);
    $("ty-st").innerHTML=stp(1,"Regla de Taylor (1993)",`<div class="eq al">i = r* + π + a(π − π*) + b·brecha = ${fm(r)} + ${fm(pi)} + ${fm(a)}·(${fm(pi)} − ${fm(m)}) + ${fm(b)}·(${fm(y)}) = <b>${fmt(i,2)} %</b></div><p>Principio de Taylor: la tasa nominal debe subir más que uno a uno con la inflación (1 + a > 1), para que la tasa real suba cuando la inflación se acelera. Es una guía descriptiva: la Junta del Banco de la República decide con un modelo de pronóstico y su juicio, no con una fórmula.</p>`)};
  bindCtl(["ty-pi","ty-m","ty-r","ty-y","ty-a","ty-b"],run);run()};

SIMS.trinidad=function(){
  const O=[["fijo","Tipo de cambio fijo"],["cap","Libre movilidad de capitales"],["mon","Política monetaria autónoma"]];let sel=new Set(["cap","mon"]);
  $("sim").innerHTML=`<p>Elige dos de los tres objetivos:</p><div class="chips" id="tr-c">${O.map(([k,t])=>`<button type="button" data-v="${k}">${t}</button>`).join("")}</div><div id="tr-o"></div>`;
  const R={"cap,mon":["Flotación cambiaria","Colombia, Chile, México desde finales de los noventa: tasa de interés propia y libre movimiento de capitales; el tipo de cambio absorbe los choques."],"cap,fijo":["Unión monetaria, caja de convertibilidad o dolarización","Ecuador, Panamá, la eurozona, Argentina 1991–2001: la tasa de interés la fija el exterior."],"fijo,mon":["Tipo de cambio fijo con controles de capitales","Bretton Woods (1944–1971), China por décadas, Colombia con el Decreto 444 de 1967: los controles permiten fijar la tasa de cambio y la tasa de interés a la vez."]};
  const run=()=>{$("tr-c").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",sel.has(b.dataset.v)));const k=[...sel].sort().join(",");const r=R[k];
    $("tr-o").innerHTML=r?stp(1,r[0],`<p>${r[1]} Se renuncia a: <b>${O.find(o=>!sel.has(o[0]))[1].toLowerCase()}</b>.</p>`):`<p class="hint">Elige exactamente dos.</p>`};
  $("tr-c").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const v=b.dataset.v;if(sel.has(v))sel.delete(v);else{if(sel.size>=2)sel.delete([...sel][0]);sel.add(v)}run()});run()};
})();

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "mu-B":"<b>Base monetaria</b>: efectivo más reservas de los bancos en el banco central.","mu-c":"<b>Relación efectivo/depósitos</b>: cuánto efectivo guarda el público por cada peso en depósitos. Más alta, menor multiplicador.","mu-r":"<b>Encaje</b>: fracción de los depósitos que los bancos deben guardar como reserva. Multiplicador = (1 + c)/(c + r).","mu-R":"<b>Compra de reservas internacionales</b> del banco central: aumenta la base monetaria.","mu-s":"<b>Fracción esterilizada</b>: parte de esa expansión que el banco central anula vendiendo TES.",
 "ov-m":"<b>Aumento permanente de la oferta de dinero.</b> En Dornbusch, el tipo de cambio sube primero más que en el largo plazo (overshooting).","ov-l":"<b>Semielasticidad de la demanda de dinero</b> a la tasa de interés.","ov-t":"<b>Velocidad de ajuste de los precios.</b> Más lenta, mayor el overshooting.",
 "hb-aT":"<b>Crecimiento de la productividad de transables en el país.</b> Balassa-Samuelson: si crece más que la de no transables, se encarecen los no transables y la moneda se aprecia en términos reales.","hb-aN":"<b>Crecimiento de la productividad de no transables en el país.</b>","hb-aT2":"<b>Crecimiento de la productividad de transables en el exterior.</b>","hb-aN2":"<b>Crecimiento de la productividad de no transables en el exterior.</b>","hb-g":"<b>Peso de los transables en el IPC.</b>","hb-T":"<b>Años</b> que se simulan.",
 "df-d":"<b>Déficit fiscal real</b> que se financia con emisión.","df-m":"<b>Saldos reales de dinero</b> que demanda el público. La inflación necesaria para financiar el déficit es aproximadamente déficit/(M/P).","df-e":"<b>Tipo de cambio.</b>",
 "ty-pi":"<b>Inflación observada o esperada.</b>","ty-m":"<b>Meta de inflación</b> del banco central.","ty-r":"<b>Tasa real neutral</b>: la que no estimula ni frena la economía.","ty-y":"<b>Brecha del producto</b>: positiva si la economía produce por encima de su potencial.","ty-a":"<b>Peso de la brecha de inflación</b> en la regla de Taylor. Debe ser mayor que 0 para que la tasa real suba cuando sube la inflación (principio de Taylor).","ty-b":"<b>Peso de la brecha del producto</b> en la regla de Taylor."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
