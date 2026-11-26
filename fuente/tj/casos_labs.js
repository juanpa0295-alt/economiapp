// ===================== SIMULADORES DE LOS LABORATORIOS (Teoría de Juegos) =====================
(function(){
// 1. Guerra de precios: gatillo en el juego repetido
SIMS.tjGuerra=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("gp-t","T: rebajo y el otro no",1,40,0.5,16)}${ctl("gp-r","R: los dos con precio normal",1,40,0.5,10)}${ctl("gp-p","P: los dos rebajan",0,40,0.5,5)}${ctl("gp-i","Tasa de descuento mensual r (%)",0,10,0.1,1.5)}${ctl("gp-q","Probabilidad de que la relación siga, p",0.05,1,0.01,0.9)}</div><div class="kpis" id="gp-k"></div><div id="gp-g"></div>`;
  const run=()=>{const T=V("gp-t"),R=V("gp-r"),P=V("gp-p"),r=V("gp-i")/100,p=V("gp-q");if(!(T>R&&R>P)){$("gp-k").innerHTML=err("para que sea un dilema debe cumplirse T > R > P.");$("gp-g").innerHTML="";return}
    const ds=(T-R)/(T-P),d=Math.min(0.999,p/(1+r)),vc=R/(1-d),vd=T+d*P/(1-d);
    $("gp-k").innerHTML=labKpi(fmt(ds,3),"δ* = (T − R)/(T − P)")+labKpi(fmt(d,3),"δ = p/(1 + r)")+labKpi(fmt(vc,1),"Mantener el precio: R/(1 − δ)")+labKpi(fmt(vd,1),"Rebajar: T + δP/(1 − δ)")+labKpi(d>=ds?"Mantener":"Rebajar",d>=ds?"La guerra de precios no conviene":"Con este δ la rebaja es racional");
    const a=[],b=[];for(let k=0;k<=90;k++){const x=0.05+0.9*k/90;a.push([x,R/(1-x)]);b.push([x,T+x*P/(1-x)])}
    const ym=Math.max(...a.map(q=>q[1]),...b.map(q=>q[1]));
    $("gp-g").innerHTML=labPlot({xr:[0.05,0.95],yr:[0,ym*1.05],series:[{pts:b,color:"--bad",dash:true},{pts:a}],vlines:[{x:ds,color:"--muted",lbl:"δ*"},{x:Math.min(.95,Math.max(.05,d)),color:"--good",lbl:"tu δ",dot:d<=.95?vc:undefined}],xl:"factor de descuento δ",yl:"valor presente",label:"Mantener frente a rebajar según δ"})+`<p class="hint">Continua: valor de mantener el precio. Punteada roja: valor de rebajar. Se cruzan en δ*.</p>`};
  bindCtl(["gp-t","gp-r","gp-p","gp-i","gp-q"],run);run()};
// 2. Cournot con costos distintos: efecto estratégico de bajar el costo
SIMS.tjCournot=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("cn-a","a (demanda P = a − Q)",50,200,1,100)}${ctl("cn-0","c₁ antes de la inversión",0,100,1,40)}${ctl("cn-1","c₁ después de la inversión",0,100,1,30)}${ctl("cn-2","c₂ del rival",0,100,1,40)}</div><div class="kpis" id="cn-k"></div><div id="cn-g"></div>`;
  const eq=(a,c1,c2)=>{const q1=Math.max(0,(a-2*c1+c2)/3),q2=Math.max(0,(a-2*c2+c1)/3),P=a-q1-q2;return{q1,q2,P,p1:(P-c1)*q1}};
  const run=()=>{const a=V("cn-a"),c0=V("cn-0"),c1=V("cn-1"),c2=V("cn-2");const E0=eq(a,c0,c2),E1=eq(a,c1,c2);
    if(!(E0.q1>0&&E0.q2>0&&E1.q1>0&&E1.q2>0)){$("cn-k").innerHTML=err("con estos costos alguna empresa no produce: sube a o baja los costos.");$("cn-g").innerHTML="";return}
    const qn=Math.max(0,(a-E0.q2-c1)/2),pn=(a-qn-E0.q2-c1)*qn,gn=pn-E0.p1,ge=E1.p1-E0.p1;
    $("cn-k").innerHTML=labKpi(fmt(E0.p1,1),"π₁ antes (q₁ = q₂ = "+fmt(E0.q1,2)+")")+labKpi(fmt(gn,1),"Ganancia ingenua (el rival sigue en "+fmt(E0.q2,2)+")")+labKpi(fmt(ge,1),"Ganancia en el nuevo equilibrio")+labKpi(fmt(ge-gn,1),"Efecto estratégico")+labKpi(fmt(E0.q2,2)+" → "+fmt(E1.q2,2),"Producción del rival");
    const M=a,br1=c=>[[(a-c)/2,0],[0,a-c]],br2=[[0,(a-c2)/2],[a-c2,0]];
    const f=frame(600,300,[0,M],[0,M],ticks(0,M,nice(M/8)),ticks(0,M,nice(M/8)),"q₁","q₂"),line=(p,c,d)=>`<polyline fill="none" stroke="var(${c})" stroke-width="2.2" ${d?'stroke-dasharray="6 4"':""} points="${p.map(x=>f.sx(x[0])+","+f.sy(x[1])).join(" ")}"/>`;
    $("cn-g").innerHTML=`<div class="plot"><svg viewBox="0 0 600 300" role="img" aria-label="Mejores respuestas de Cournot">${f.g}${line(br1(c0),"--muted",true)}${line(br1(c1),"--line")}${line(br2,"--branch")}
      <circle cx="${f.sx(E0.q1)}" cy="${f.sy(E0.q2)}" r="5" fill="var(--muted)"/><circle cx="${f.sx(E1.q1)}" cy="${f.sy(E1.q2)}" r="6" fill="var(--good)"/></svg></div><p class="hint">La línea más plana es la mejor respuesta del rival. Las empinadas son las de la empresa 1: punteada antes de la inversión y continua después. Al bajar el costo, la curva de la empresa 1 se corre a la derecha y el equilibrio (punto grande) baja por la curva del rival: el rival produce menos.</p>`};
  bindCtl(["cn-a","cn-0","cn-1","cn-2"],run);run()};
// 3. Juego de inspección
SIMS.tjAuditoria=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("au-g","g: impuesto que ahorra quien evade",1,50,0.5,10)}${ctl("au-f","F: sanción si lo auditan",0,100,0.5,10)}${ctl("au-k","k: costo de cada auditoría",0.1,20,0.1,2)}${ctl("au-n","Contribuyentes del grupo",100,100000,100,10000)}</div><div class="kpis" id="au-k2"></div><div id="au-gr"></div>`;
  const run=()=>{const g=V("au-g"),F=V("au-f"),k=V("au-k"),N=V("au-n");if(!(g>0&&F>=0&&k>0)){$("au-k2").innerHTML=err("g y k deben ser positivos.");return}
    if(k>=g+F){$("au-k2").innerHTML=labKpi("0","Auditar nunca compensa: k ≥ g + F")+labKpi("1","Todos evaden");$("au-gr").innerHTML="";return}
    const q=g/(g+F),p=k/(g+F);
    $("au-k2").innerHTML=labKpi(fmt(q,3),"q* = g/(g + F): probabilidad de auditar")+labKpi(fmt(p,3),"p* = k/(g + F): probabilidad de evadir")+labKpi(fmt(q*N,0),"Auditorías esperadas")+labKpi(fmt(q*N*k,0),"Costo de auditar (millones)")+labKpi(fmt(p*N,0),"Evasores esperados");
    const a=[],b=[];for(let x=0;x<=100;x++){a.push([x,g/(g+x)]);b.push([x,k/(g+x)])}
    $("au-gr").innerHTML=labPlot({xr:[0,100],yr:[0,1],series:[{pts:a},{pts:b,color:"--bad",dash:true}],vlines:[{x:F,color:"--good",lbl:"tu F"}],xl:"sanción F",yl:"probabilidad",label:"Auditoría y evasión según la sanción"})+`<p class="hint">Azul: probabilidad de auditar que hace falta. Roja punteada: evasión de equilibrio. Las dos bajan con la sanción; la roja también baja si las auditorías son más baratas.</p>`};
  bindCtl(["au-g","au-f","au-k","au-n"],run);run()};
})();
