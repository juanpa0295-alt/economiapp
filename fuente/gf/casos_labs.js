// ===================== SIMULADORES DE LOS LABORATORIOS (Gerencia Financiera I) =====================
(function(){
const pesos=v=>"$"+fmt(v,0),pct=(v,d=2)=>fmt(v*100,d)+" %";
// 1. Descuento por pronto pago
SIMS.gfProntoPago=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("pp-f","Valor de la factura",1000000,100000000,500000,20000000)}${ctl("pp-d","Descuento (%)",0.5,5,0.1,2)}${ctl("pp-a","Días con descuento",0,30,1,10)}${ctl("pp-b","Días totales",10,90,1,30)}${ctl("pp-r","Tasa del banco (% EA)",5,60,0.5,24)}</div><div class="kpis" id="pp-k"></div><div id="pp-g"></div>`;
  const run=()=>{const F=V("pp-f"),d=V("pp-d")/100,a=V("pp-a"),b=V("pp-b"),r=V("pp-r")/100;if(!(b>a&&d>0&&d<1&&F>0)){$("pp-k").innerHTML=err("los días totales deben ser más que los días con descuento.");$("pp-g").innerHTML="";return}
    const t=b-a,i=d/(1-d),ea=Math.pow(1+i,365/t)-1,ib=Math.pow(1+r,t/365)-1,int=F*(1-d)*ib,neto=F*d-int;
    $("pp-k").innerHTML=labKpi(pct(i,3),`Tasa del proveedor por ${t} días: d/(1−d)`)+labKpi(pct(ea,1),"EA del proveedor")+labKpi(pct(ib,3),`Banco en ${t} días`)+labKpi(pesos(int),"Intereses del banco")+labKpi(pesos(neto),neto>=0?"Ahorro neto: tomar el descuento":"Pérdida: mejor no tomarlo");
    const pts=[];for(let x=5;x<=90;x++)pts.push([x,(Math.pow(1+i,365/x)-1)*100]);
    $("pp-g").innerHTML=labPlot({xr:[5,90],yr:[0,Math.min(300,Math.max(ea*100,r*100)*1.3)],series:[{pts}],hl:[r*100],vlines:[{x:t,color:"--good",lbl:"tu caso",dot:ea*100}],xl:"días que se financia el proveedor (totales − con descuento)",yl:"EA del proveedor (%)",label:"EA implícita según los días"})+`<p class="hint">Curva: tasa efectiva anual de no tomar el descuento según los días que se financia. Línea roja: tasa del banco. Por encima de la roja conviene tomar el descuento.</p>`};
  bindCtl(["pp-f","pp-d","pp-a","pp-b","pp-r"],run);run()};
// 2. Máquina nueva: VPN, TIR, PRI
SIMS.gfMaquina=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("mq-i","Inversión (millones)",5,150,1,45)}${ctl("mq-a","Ahorro neto anual (millones)",1,50,0.5,12)}${ctl("mq-n","Vida útil (años)",2,15,1,6)}${ctl("mq-s","Salvamento (millones)",0,50,0.5,5)}${ctl("mq-r","TIO (% EA)",1,40,0.5,15)}</div><div class="kpis" id="mq-k"></div><div id="mq-g"></div>`;
  const run=()=>{const I=V("mq-i"),A=V("mq-a"),n=Math.round(V("mq-n")),S=V("mq-s"),r=V("mq-r")/100;if(!(I>0&&A>0&&n>=1)){$("mq-k").innerHTML=err("revisa la inversión, el ahorro y la vida útil.");return}
    const vpn=x=>-I+A*(Math.abs(x)<1e-12?n:(1-Math.pow(1+x,-n))/x)+S/Math.pow(1+x,n);
    let tir=NaN;if(vpn(-0.99)>0&&vpn(5)<0){let lo=-0.99,hi=5;for(let k=0;k<200;k++){const m=(lo+hi)/2;if(vpn(m)>0)lo=m;else hi=m}tir=(lo+hi)/2}
    let acc=-I,pri=NaN;for(let t=1;t<=n;t++){const v=(A+(t===n?S:0))/Math.pow(1+r,t);if(acc+v>=0){pri=t-1+(-acc)/v;break}acc+=v}
    const fa=(1-Math.pow(1+r,-n))/r,Aeq=(I-S/Math.pow(1+r,n))/fa,V0=vpn(r);
    $("mq-k").innerHTML=labKpi(fmt(V0,2),"VPN a la TIO (millones)")+labKpi(isFinite(tir)?pct(tir,1):"—","TIR")+labKpi(isFinite(pri)?fmt(pri,1)+" años":"no recupera","Recuperación descontada")+labKpi(fmt(Aeq,2),"Ahorro anual de equilibrio (VPN = 0)")+labKpi(fmt((1-Aeq/A)*100,1)+" %","Cuánto pueden caer los ahorros");
    const top=Math.max(0.5,isFinite(tir)?Math.min(1,tir*1.8):0.5),pts=[];for(let k=0;k<=80;k++){const x=top*k/80;pts.push([x*100,vpn(x)])}
    const ys=pts.map(p=>p[1]),y0=Math.min(0,...ys),y1=Math.max(0,...ys);
    $("mq-g").innerHTML=labPlot({xr:[0,top*100],yr:[y0-(y1-y0)*.08,y1+(y1-y0)*.12],series:[{pts}],hl:[0],vlines:[{x:r*100,color:"--line",lbl:"TIO",dot:V0}].concat(isFinite(tir)&&tir<=top?[{x:tir*100,color:"--good",lbl:"TIR"}]:[]),xl:"tasa de descuento (% EA)",yl:"VPN (millones)",label:"Perfil del VPN"})+`<p class="hint">Perfil del VPN: a la izquierda de la TIR el proyecto crea valor.</p>`};
  bindCtl(["mq-i","mq-a","mq-n","mq-s","mq-r"],run);run()};
// 3. Compra de cartera
SIMS.gfCartera=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("cc-p","Saldo de la deuda",1000000,200000000,500000,30000000)}${ctl("cc-n","Cuotas que faltan",6,120,1,36)}${ctl("cc-a","Tasa actual (% mensual)",0.5,4,0.05,2.2)}${ctl("cc-b","Tasa nueva (% mensual)",0.5,4,0.05,1.6)}${ctl("cc-c","Comisión (% del saldo)",0,10,0.1,1.5)}</div><div class="kpis" id="cc-k"></div><div id="cc-g"></div>`;
  const cuota=(P,i,n)=>P*i/(1-Math.pow(1+i,-n));
  const run=()=>{const P=V("cc-p"),n=Math.round(V("cc-n")),i0=V("cc-a")/100,i1=V("cc-b")/100,c=V("cc-c")/100;if(!(P>0&&n>0&&i0>0&&i1>0)){$("cc-k").innerHTML=err("revisa saldo, plazo y tasas.");return}
    const A0=cuota(P,i0,n),A1=cuota(P,i1,n),dA=A0-A1,vp=dA*(1-Math.pow(1+i1,-n))/i1,neto=vp-P*c;
    $("cc-k").innerHTML=labKpi(pesos(A0)+" → "+pesos(A1),"Cuota actual → nueva")+labKpi(pesos(dA*n),"Ahorro sumado (sin descontar)")+labKpi(pesos(vp),"Ahorro en valor presente")+labKpi(pesos(P*c),"Comisión")+labKpi(pesos(neto),neto>=0?"Ahorro neto de hoy: conviene":"Pérdida neta: no conviene")+labKpi(pct(vp/P,1),"Comisión máxima que aguanta");
    const s0=[],s1=[];let b0=P,b1=P;for(let t=0;t<=n;t++){s0.push([t,b0/1e6]);s1.push([t,b1/1e6]);b0=b0*(1+i0)-A0;b1=b1*(1+i1)-A1}
    $("cc-g").innerHTML=labPlot({xr:[0,n],yr:[0,P/1e6*1.05],series:[{pts:s0,color:"--muted",dash:true},{pts:s1}],xl:"mes",yl:"saldo (millones)",label:"Saldo de las dos deudas"})+`<p class="hint">Saldo mes a mes: punteada la deuda actual, continua la nueva. Con la tasa más baja, una parte mayor de cada cuota abona a capital.</p>`};
  bindCtl(["cc-p","cc-n","cc-a","cc-b","cc-c"],run);run()};
})();
