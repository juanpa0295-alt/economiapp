// ===================== SIMULADORES DE LOS LABORATORIOS (casos reales) =====================
(function(){
const N=DIST.norm(),phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
const kpi=(v,l)=>`<div class="kpi"><b>${v}</b><span>${l}</span></div>`;
// gráfico de línea con marcas: series [{pts,color,dash}], verticales [{x,color,lbl}], banda [x0,x1]
function linePlot({xr,yr,series,vlines=[],hl=[],band,xl,yl,label}){const W=600,H=250,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl);
  const cl=y=>Math.max(yr[0],Math.min(yr[1],y));
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${band?`<rect x="${f.sx(band[0])}" y="${f.T}" width="${Math.max(1,f.sx(band[1])-f.sx(band[0]))}" height="${H-f.T-f.B}" fill="var(--line-soft)" opacity=".7"/>`:""}${f.g}${hl.map(h=>`<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(h)}" y2="${f.sy(h)}" stroke="var(--bad)" stroke-dasharray="5 4"/>`).join("")}
  ${series.map(s=>`<polyline fill="none" stroke="var(${s.color||"--line"})" stroke-width="2.2" ${s.dash?'stroke-dasharray="6 4"':""} points="${s.pts.map(p=>f.sx(p[0]).toFixed(1)+","+f.sy(cl(p[1])).toFixed(1)).join(" ")}"/>`).join("")}
  ${vlines.map(v=>`<line x1="${f.sx(v.x)}" x2="${f.sx(v.x)}" y1="${f.T}" y2="${H-f.B}" stroke="var(${v.color||"--muted"})" stroke-dasharray="4 3"/>${v.dot!==undefined?`<circle cx="${f.sx(v.x)}" cy="${f.sy(cl(v.dot))}" r="5" fill="var(${v.color||"--line"})"/>`:""}${v.lbl?`<text x="${f.sx(v.x)+4}" y="${f.T+12}" font-size="11" fill="var(--muted)">${v.lbl}</text>`:""}`).join("")}</svg></div>`}

// 1. Precio óptimo con la elasticidad del modelo log-log de la demanda de TV
SIMS.labPrecio=function(){
  const b1=16.5223287,b2=-2.2467117,b3=0.1345433,se2=0.09682203,t=2.014,A=75.301,Q=P=>Math.exp(b1+b2*Math.log(P)+b3*Math.log(A));
  $("sim").innerHTML=`<div class="ctr">${ctl("lp-c","Costo unitario c",300,1000,10,700)}${ctl("lp-p","Precio que evalúas",500,2400,5,1436)}</div><div class="kpis" id="lp-k"></div><div id="lp-g"></div><p class="hint" id="lp-t"></p>`;
  const run=()=>{const c=V("lp-c"),P=V("lp-p");if(!(c>0&&P>0)){$("lp-k").innerHTML=err("el costo y el precio deben ser positivos.");return}
    const e=Math.abs(b2),Ps=c*e/(e-1),lo=c*(e+t*se2)/((e+t*se2)-1),hi=c*(e-t*se2)/((e-t*se2)-1),U=p=>(p-c)*Q(p),Us=U(Ps),Up=U(P);
    $("lp-k").innerHTML=kpi(fmt(Ps,0),"Precio óptimo P* = c·|ε|/(|ε|−1)")+kpi(fmt(Q(P),3)+" → "+fmt(Q(Ps),3),"Unidades al precio evaluado → al óptimo")+kpi(fmt(Up,1)+" → "+fmt(Us,1),"Utilidad mensual: evaluado → óptimo")+kpi((Up>0?"+"+fmt((Us/Up-1)*100,1):"—")+" %","Mejora de pasar al óptimo");
    const x0=c*1.05,x1=Math.max(c*3,P*1.15),pts=[];for(let i=0;i<=120;i++){const p=x0+(x1-x0)*i/120;pts.push([p,U(p)])}
    const ym=Math.max(...pts.map(p=>p[1]));
    $("lp-g").innerHTML=linePlot({xr:[x0,x1],yr:[0,ym*1.15],series:[{pts}],band:[lo,hi],vlines:[{x:Ps,color:"--good",lbl:"P*",dot:Us},{x:P,color:"--line",lbl:"tu precio",dot:Up}],xl:"precio",yl:"utilidad (P − c)·Q",label:"Utilidad según el precio"});
    $("lp-t").textContent=`Franja: precio óptimo entre ${fmt(lo,0)} y ${fmt(hi,0)} con el intervalo del 95 % de la elasticidad. ${P>Ps?"Tu precio está por encima del óptimo: conviene bajarlo.":P<Ps?"Tu precio está por debajo del óptimo: conviene subirlo.":""}`};
  bindCtl(["lp-c","lp-p"],run);run()};

// 2. Pedido óptimo (vendedor de periódicos) con el error estándar de predicción
SIMS.labInventario=function(){
  const y0=2.089267,se=Math.sqrt(0.1641598**2+0.0302582**2);
  $("sim").innerHTML=`<div class="ctr">${ctl("li-p","Precio de venta P",800,2000,5,1425)}${ctl("li-c","Costo unitario c",300,1400,10,700)}${ctl("li-s","Valor de liquidación s",0,1000,10,500)}</div><div class="kpis" id="li-k"></div><div id="li-g"></div>`;
  const run=()=>{const P=V("li-p"),c=V("li-c"),s=V("li-s");if(!(P>c&&c>s)){$("li-k").innerHTML=err("debe cumplirse P > c > s.");$("li-g").innerHTML="";return}
    const cu=P-c,co=c-s,RC=cu/(cu+co),z=N.ppf(RC),Qs=y0+z*se,L=z=>phi(z)-z*(1-N.cdf(z)),cost=z=>se*(cu*L(z)+co*(z+L(z))),c0=cost(0),c1=cost(z);
    $("li-k").innerHTML=kpi(fmt(RC,3),"Razón crítica c_u/(c_u+c_o)")+kpi(fmt(z,3),"z de la razón crítica")+kpi(fmt(Qs,3),"Pedido óptimo Q* = ŷ₀ + z·ee(pred)")+kpi(fmt(c0,1)+" → "+fmt(c1,1),"Costo esperado de equivocarse: pedir ŷ₀ → pedir Q*")+kpi("−"+fmt((1-c1/c0)*100,1)+" %","Ahorro");
    const lo=y0-3.2*se,hi=y0+3.2*se,dens=[],cs=[];for(let i=0;i<=120;i++){const q=lo+(hi-lo)*i/120;dens.push([q,phi((q-y0)/se)/se]);cs.push([q,cost((q-y0)/se)])}
    const cm=Math.max(...cs.map(p=>p[1])),dm=Math.max(...dens.map(p=>p[1]));
    $("li-g").innerHTML=linePlot({xr:[lo,hi],yr:[0,cm*1.1],series:[{pts:cs},{pts:dens.map(p=>[p[0],p[1]/dm*cm*.6]),color:"--muted",dash:true}],vlines:[{x:y0,color:"--muted",lbl:"ŷ₀"},{x:Qs,color:"--good",lbl:"Q*",dot:c1}],xl:"unidades pedidas",yl:"costo esperado",label:"Costo esperado según el pedido"})+`<p class="hint">Línea continua: costo esperado de equivocarse según el pedido. Punteada: la distribución de la demanda del mes 49 (normal con media ŷ₀ = ${fmt(y0,4)} y ee(pred) = ${fmt(se,4)}).</p>`};
  bindCtl(["li-p","li-c","li-s"],run);run()};

// 3. Economías de escala con la función de costos de Nerlove
SIMS.labEscala=function(){
  const b2=0.801522,se2=0.01106801,b4=0.4585449,t=1.977;
  $("sim").innerHTML=`<div class="ctr">${ctl("le-k","Producción nueva / actual (k)",1,4,0.1,2)}${ctl("le-c","Costo total actual (millones)",1,100,1,10)}${ctl("le-g","Cambio del precio del combustible (%)",-30,50,1,0)}</div><div class="kpis" id="le-k2"></div><div id="le-gr"></div>`;
  const run=()=>{const k=V("le-k"),C=V("le-c"),g=V("le-g");if(!(k>=1&&C>0)){$("le-k2").innerHTML=err("k debe ser al menos 1 y el costo positivo.");return}
    const fF=Math.pow(1+g/100,b4),m=Math.pow(k,b2),mlo=Math.pow(k,b2-t*se2),mhi=Math.pow(k,b2+t*se2),C1=C*m*fF,Cp=C*k*fF;
    $("le-k2").innerHTML=kpi(fmt(m,3),"Multiplicador del costo k^β₂")+kpi(fmt(C1,2),"Costo nuevo (millones)")+kpi(fmt(Cp,2),"Si el costo creciera proporcional")+kpi(fmt(Cp-C1,2)+" ("+fmt((1-m/k)*100,1)+" %)","Ahorro por escala")+kpi((g>=0?"+":"")+fmt((fF-1)*100,1)+" %","Efecto del combustible (β₄ = 0,459)");
    const pts=[],plo=[],phi2=[],pp=[];for(let i=0;i<=60;i++){const x=1+3*i/60;pts.push([x,C*Math.pow(x,b2)*fF]);plo.push([x,C*Math.pow(x,b2-t*se2)*fF]);phi2.push([x,C*Math.pow(x,b2+t*se2)*fF]);pp.push([x,C*x*fF])}
    $("le-gr").innerHTML=linePlot({xr:[1,4],yr:[0,C*4*fF*1.05],series:[{pts:pp,color:"--muted",dash:true},{pts:plo,color:"--line-soft"},{pts:phi2,color:"--line-soft"},{pts}],vlines:[{x:k,color:"--good",lbl:"k",dot:C1}],xl:"k (veces la producción actual)",yl:"costo total",label:"Costo según la producción"})+`<p class="hint">Punteada: costo proporcional (sin economías de escala). Continua: costo con β₂ = 0,8015; las líneas claras usan los extremos del intervalo del 95 % (${fmt(b2-t*se2,4)} y ${fmt(b2+t*se2,4)}).</p>`};
  bindCtl(["le-k","le-c","le-g"],run);run()};

// 4. Prueba de Chow con el corte que elijas, sobre la base de consumo trimestral
SIMS.labCambio=function(){
  const Y=[8.4,8.505,8.6,8.705,8.85,8.95,9.05,9.155,9.3,9.4,9.5,9.6,9.35,9.35,9.3,8.95,8.95,9.02,9.13,9.18,9.32,9.55,9.63,9.69],
        X=[10.024,10.15,10.28,10.41,10.55,10.68,10.82,10.96,11.1,11.25,11.38,11.5,11.4,11.35,11.2,11,10.95,11.02,11.1,11.25,11.4,11.55,11.7,11.85];
  const fit=(a,b)=>{const x=X.slice(a,b),y=Y.slice(a,b),n=x.length,mx=x.reduce((s,v)=>s+v,0)/n,my=y.reduce((s,v)=>s+v,0)/n;let sxy=0,sxx=0;for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2}const b2=sxy/sxx,b1=my-b2*mx;return{b1,b2,rss:y.reduce((s,v,i)=>s+(v-b1-b2*x[i])**2,0)}};
  const n=24,k=2,R=fit(0,n),Fc=DIST.f(k,n-2*k).ppf(.95),chow=c=>{const a=fit(0,c-1),b=fit(c-1,n),u=a.rss+b.rss;return{a,b,F:((R.rss-u)/k)/(u/(n-2*k))}};
  const lab=c=>{const yr=2005+Math.floor((c-1)/4),q=(c-1)%4+1;return yr+"-T"+q};
  $("sim").innerHTML=`<div class="ctr">${ctl("lc-t","Primer trimestre del segundo periodo (T)",5,20,1,13)}${ctl("lc-v","Compras anuales guiadas por el pronóstico (millones de pesos)",1000,200000,1000,50000)}</div><div class="kpis" id="lc-k"></div><div id="lc-g"></div><p class="hint" id="lc-h"></p>`;
  const run=()=>{const c=Math.round(V("lc-t")),v=V("lc-v");if(!(c>=4&&c<=21)){$("lc-k").innerHTML=err("el corte debe dejar al menos 3 trimestres en cada lado.");return}
    const r=chow(c),p=1-DIST.f(k,n-2*k).cdf(r.F);
    const e=[];for(let i=c-1;i<n;i++)e.push(Y[i]-(r.a.b1+r.a.b2*X[i]));const bias=e.reduce((s,x)=>s+x,0)/e.length,my=Y.slice(c-1).reduce((s,x)=>s+x,0)/e.length,pct=-bias/my*100;
    $("lc-k").innerHTML=kpi(fmt(r.F,2),`F de Chow con corte en T = ${c} (${lab(c)})`)+kpi(fmt(Fc,2),"F crítica al 5 %, (2, 20)")+kpi(p<1e-4?"&lt; 0,0001":fmt(p,4),"Valor p")+kpi(fmt(r.a.b2,3)+" → "+fmt(r.b.b2,3),"Pendiente: antes → después")+kpi((pct>=0?"+":"")+fmt(pct,2)+" %","Sobrestimación (+) del consumo con el modelo viejo")+kpi(fmt(Math.abs(pct)/100*v,0),"Millones de pesos de más (o de menos) al año");
    const pts=[];for(let t=5;t<=20;t++)pts.push([t,chow(t).F]);const fm=Math.max(...pts.map(q=>q[1]));
    $("lc-g").innerHTML=linePlot({xr:[5,20],yr:[0,fm*1.12],series:[{pts}],vlines:[{x:c,color:"--line",lbl:"tu corte",dot:r.F}],hl:[Fc],xl:"trimestre de corte T",yl:"F de Chow",label:"F de Chow según el corte"})+`<p class="hint">La línea roja punteada es la F crítica (${fmt(Fc,2)}): todo corte con F mayor rechaza la estabilidad.</p>`;
    $("lc-h").textContent=r.F>Fc?`Con corte en ${lab(c)} se rechaza que la relación sea la misma en los dos periodos.`:`Con corte en ${lab(c)} no se rechaza la estabilidad.`};
  bindCtl(["lc-t","lc-v"],run);run()};
})();
