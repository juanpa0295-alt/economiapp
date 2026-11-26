// ===================== SIMULADORES DE LOS LABORATORIOS (Macroeconomía II) =====================
(function(){
const npdf=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const ncdf=z=>{const t=1/(1+0.2316419*Math.abs(z)),d=npdf(z),p=d*t*(0.319381530+t*(-0.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return z>0?1-p:p};
// 1. Forward y paridad cubierta
SIMS.m2Forward=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("fw-m","Monto en dólares",1000,1000000,1000,50000)}${ctl("fw-e","E de contado",2500,6000,10,4000)}${ctl("fw-i","i en pesos (% EA)",0,20,0.25,9)}${ctl("fw-s","i* en dólares (% EA)",0,10,0.25,4.5)}${ctl("fw-t","Plazo (meses)",1,24,1,6)}${ctl("fw-v","Volatilidad anual del dólar (%)",2,40,1,15)}${ctl("fw-p","Venta pactada en pesos (millones)",10,5000,1,230)}</div><div class="kpis" id="fw-k"></div><div id="fw-g"></div>`;
  const run=()=>{const M=V("fw-m"),E=V("fw-e"),i=V("fw-i")/100,s=V("fw-s")/100,t=V("fw-t")/12,v=V("fw-v")/100,P=V("fw-p");if(!(M>0&&E>0)){$("fw-k").innerHTML=err("revisa el monto y el tipo de cambio.");return}
    const F=E*Math.pow((1+i)/(1+s),t),sd=v*Math.sqrt(t),Em=F*(1+1.645*sd),cF=M*F/1e6,cM=M*Em/1e6,pl=ncdf(((P*1e6/M)/F-1)/sd);
    $("fw-k").innerHTML=labKpi(fmt(F,1),"Forward F = E·((1+i)/(1+i*))^t")+labKpi(fmt(cF,2),"Costo cubierto (millones)")+labKpi(fmt(P-cF,2),"Margen asegurado")+labKpi(fmt(Em,0),"Dólar en el escenario malo (5 %)")+labKpi(fmt(P-cM,2),"Margen sin cubrir en ese escenario")+labKpi(fmt((1-pl)*100,1)+" %","Probabilidad de perder sin cubrir");
    const lo=cF*(1-3.2*sd),hi=cF*(1+3.2*sd),pts=[];for(let k=0;k<=120;k++){const c=lo+(hi-lo)*k/120;pts.push([c,npdf((c/cF-1)/sd)])}
    $("fw-g").innerHTML=labPlot({xr:[lo,hi],yr:[0,0.45],series:[{pts}],vlines:[{x:cF,color:"--good",lbl:"cubierto"},{x:cM,color:"--bad",lbl:"malo"}].concat(P>lo&&P<hi?[{x:P,color:"--muted",lbl:"venta"}]:[]),xl:"costo del pago en pesos (millones)",yl:"densidad",label:"Costo del pago sin cubrir"})+`<p class="hint">Curva: costos posibles si no se cubre (centrados en el forward). A la derecha de la línea «venta», la operación da pérdida.</p>`};
  bindCtl(["fw-m","fw-e","fw-i","fw-s","fw-t","fw-v","fw-p"],run);run()};
// 2. Exportador y tipo de cambio real
SIMS.m2Exportador=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ex-e","E hoy",2500,6000,10,4000)}${ctl("ex-p","Precio en dólares P*",1,100,0.1,12)}${ctl("ex-c","Costo unitario en pesos",1000,300000,500,38000)}${ctl("ex-d","Devaluación nominal en el año (%)",-20,30,0.5,0)}${ctl("ex-pi","Inflación Colombia π (%)",0,15,0.1,5)}${ctl("ex-ps","Inflación EE. UU. π* (%)",0,10,0.1,2.5)}${ctl("ex-q","Unidades al año",100,1000000,100,100000)}</div><div class="kpis" id="ex-k"></div><div id="ex-g"></div>`;
  const run=()=>{const E=V("ex-e"),P=V("ex-p"),C=V("ex-c"),d=V("ex-d")/100,pi=V("ex-pi")/100,ps=V("ex-ps")/100,Q=V("ex-q");if(!(E>0&&P>0&&C>0)){$("ex-k").innerHTML=err("revisa los valores.");return}
    const m0=E*P-C,E1=E*(1+d),P1=P*(1+ps),C1=C*(1+pi),m1=E1*P1-C1,tcr=(1+d)*(1+ps)/(1+pi)-1;
    $("ex-k").innerHTML=labKpi(fmt(m0,0)+" → "+fmt(m1,0),"Margen por unidad: hoy → en un año")+labKpi((tcr>=0?"+":"")+fmt(tcr*100,2)+" %",tcr<0?"Cambio del TCR: apreciación real":"Cambio del TCR: depreciación real")+labKpi(fmt(C/P,0)+" → "+fmt(C1/P1,0),"E de equilibrio: hoy → en un año")+labKpi(fmt((m1-m0)*Q/1e6,1),"Cambio de la utilidad anual (millones)");
    const pts=[];for(let x=-20;x<=30;x+=0.5){pts.push([x,(E*(1+x/100)*P1-C1)])}
    const ys=pts.map(p=>p[1]),y0=Math.min(0,...ys),y1=Math.max(...ys,m0);
    $("ex-g").innerHTML=labPlot({xr:[-20,30],yr:[y0,y1*1.1],series:[{pts}],hl:[0,m0],vlines:[{x:d*100,color:"--good",lbl:"tu escenario",dot:m1},{x:((1+pi)/(1+ps)-1)*100,color:"--muted",lbl:"TCR igual"}],xl:"devaluación nominal en el año (%)",yl:"margen por unidad en un año",label:"Margen según la devaluación"})+`<p class="hint">Línea vertical gris: la devaluación que deja el TCR igual, ≈ π − π*. Con menos devaluación que esa, el exportador pierde margen real. Las horizontales marcan cero y el margen de hoy.</p>`};
  bindCtl(["ex-e","ex-p","ex-c","ex-d","ex-pi","ex-ps","ex-q"],run);run()};
// 3. Carry trade y paridad descubierta
SIMS.m2Carry=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ct-i","i en pesos (% EA)",0,25,0.25,10)}${ctl("ct-s","i* en dólares (% EA)",0,10,0.25,4.5)}${ctl("ct-d","Devaluación que esperas (%)",-15,30,0.5,4)}${ctl("ct-v","Volatilidad anual del dólar (%)",2,40,1,15)}</div><div class="kpis" id="ct-k"></div><div id="ct-g"></div>`;
  const run=()=>{const i=V("ct-i")/100,s=V("ct-s")/100,d=V("ct-d")/100,v=V("ct-v")/100;
    const ds=(1+i)/(1+s)-1,r=(1+i)/(1+d)-1,rp=(1+i)/((1+s)*(1+d))-1,pl=1-ncdf((ds-d)/v);
    $("ct-k").innerHTML=labKpi(fmt(ds*100,2)+" %","Devaluación de equilibrio d* = (1+i)/(1+i*) − 1")+labKpi(fmt(r*100,2)+" %","Rentabilidad en dólares con tu devaluación")+labKpi(fmt(s*100,2)+" %","Quedarse en dólares")+labKpi(fmt(rp*100,2)+" pts","Prima implícita (riesgo país)")+labKpi(fmt(pl*100,1)+" %","Probabilidad de quedar por debajo de i*");
    const pts=[];for(let x=-15;x<=30;x+=0.5)pts.push([x,((1+i)/(1+x/100)-1)*100]);
    $("ct-g").innerHTML=labPlot({xr:[-15,30],yr:[Math.min(-15,...pts.map(p=>p[1])),Math.max(...pts.map(p=>p[1]))*1.05],series:[{pts}],hl:[s*100],vlines:[{x:ds*100,color:"--muted",lbl:"d*"},{x:d*100,color:"--good",lbl:"tu d",dot:r*100}],xl:"devaluación del peso en el año (%)",yl:"rentabilidad en US$ (%)",label:"Rentabilidad en dólares según la devaluación"})+`<p class="hint">Curva: rentabilidad en dólares de invertir en pesos. Línea roja: lo que paga quedarse en dólares. Se cruzan en d*.</p>`};
  bindCtl(["ct-i","ct-s","ct-d","ct-v"],run);run()};
})();
