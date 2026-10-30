// Macroeconomía 1 · laboratorios interactivos
// ===================== LABORATORIOS DE MACROECONOMÍA 1 =====================
const SIMS={};
let CLIP=0;
// Gráfico de líneas genérico: series [{f | pts, col, w, dash, label}], puntos [{x,y,col,label}]
function plotXY({xr,yr,series=[],points=[],vlines=[],hlines=[],xl,yl,H=280,label}){
  const W=600,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/5)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl),id="cp"+(++CLIP);
  let b="";
  series.forEach(s=>{const pts=s.pts||[...Array(161)].map((_,i)=>{const x=xr[0]+(xr[1]-xr[0])*i/160;return[x,s.f(x)]});
    const d=pts.filter(([,y])=>isFinite(y)).map(([x,y],i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(Math.max(yr[0]-(yr[1]-yr[0]),Math.min(yr[1]+(yr[1]-yr[0]),y))).toFixed(1)).join("");
    b+=`<path d="${d}" fill="none" stroke="var(${s.col||"--ink"})" stroke-width="${s.w||2.5}" ${s.dash?`stroke-dasharray="${s.dash}"`:""}/>`});
  vlines.forEach(v=>b+=`<line x1="${f.sx(v.x)}" x2="${f.sx(v.x)}" y1="${f.sy(yr[0])}" y2="${f.sy(yr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  hlines.forEach(v=>b+=`<line y1="${f.sy(v.y)}" y2="${f.sy(v.y)}" x1="${f.sx(xr[0])}" x2="${f.sx(xr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  let p="";points.forEach(q=>{if(!isFinite(q.x)||!isFinite(q.y))return;const x=f.sx(q.x),y=f.sy(q.y),anc=x>W*.7?"end":"start";
    p+=`<circle cx="${x}" cy="${y}" r="6" fill="var(${q.col||"--ink"})" stroke="var(--card)" stroke-width="2"/>${q.label?`<text x="${x+(anc==="end"?-9:9)}" y="${y-9}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${q.col||"--ink"})">${q.label}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfico"}"><defs><clipPath id="${id}"><rect x="${f.L}" y="${f.T}" width="${W-f.L-f.R}" height="${H-f.T-f.B}"/></clipPath></defs>${f.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const legend=items=>`<div class="legend">${items.map(([c,t,d])=>`<span><i style="background:var(${c})${d?";opacity:.6":""}"></i>${t}</span>`).join("")}</div>`;
const n0=v=>fmt(v,0),n2=v=>fmt(v,2);
const pos=(...a)=>a.every(x=>isFinite(x));
function marginal(id,opts,cb){return {html:`<h4 class="subh">Análisis marginal</h4>${seg(id,"Variable a derivar",opts.map(o=>[o[0],o[1]]),opts[0][0])}<div id="${id}-o"></div>`,
  bind:()=>{let cur=opts[0][0];const draw=()=>{$(`${id}-o`).innerHTML=cb(cur)};bindSeg(id,v=>{cur=v;draw()});return draw}}}

// ---- Teoría del consumo
SIMS.consumo=function(){
  const mg=marginal("c-d",[["Y","Ingreso (Y)"],["T","Impuestos (T)"]],v=>{const c1=V("c-c1");return `<div class="eq">${v==="Y"?`∂C/∂Y = c<sub>1</sub> = ${fm(c1)}`:`∂C/∂T = −c<sub>1</sub> = ${fm(-c1)}`}<span class="note">${v==="Y"?`Si el ingreso sube en 100, el consumo sube en ${fm(100*c1)}.`:`Si los impuestos suben en 100, el consumo cae en ${fm(100*c1)}.`}</span></div>`});
  $("sim").innerHTML=`<div class="ctr">${ctl("c-C0","Consumo autónomo (C₀)",0,2000,10,500)}${ctl("c-c1","Propensión marginal a consumir (c₁)",0.05,0.99,0.01,0.8)}${ctl("c-Y","Ingreso total (Y)",100,10000,50,2000)}${ctl("c-T","Impuestos (T)",0,3000,10,400)}</div>
  <div class="res" id="c-res"></div><div id="c-steps"></div>${legend([["--line","Función de consumo"],["--muted","Recta de 45° (C = Y)"]])}<div id="c-plot"></div>${mg.html}`;
  const draw=mg.bind();
  const run=()=>{const v={C0:V("c-C0"),c1:V("c-c1"),Y:V("c-Y"),T:V("c-T")};if(!pos(v.C0,v.c1,v.Y,v.T)||v.Y<=0){$("c-res").innerHTML=err("el ingreso debe ser positivo.");return}
    const r=MAC.consumo(v);
    $("c-res").innerHTML=tiles([["Ingreso disponible Yd",n2(r.Yd)],["Consumo C",n2(r.C)],["PMeC = C/Y",fmt(r.pmec,3)],["PMgC = c₁",fm(v.c1)],["Ahorro S",n2(r.ahorro),r.ahorro<0?"badt":""]]);
    $("c-steps").innerHTML=stp(1,"Resolución paso a paso",`<div class="eq al">Y<sub>d</sub> = Y − T = ${fm(v.Y)} − ${fm(v.T)} = ${fm(r.Yd)}<br>C = C<sub>0</sub> + c<sub>1</sub>Y<sub>d</sub> = ${fm(v.C0)} + ${fm(v.c1)} · ${fm(r.Yd)} = ${fm(v.C0)} + ${fm(r.inducido)} = <b>${fm(r.C)}</b><br>PMeC = C / Y = ${fm(r.C)} / ${fm(v.Y)} = ${fmt(r.pmec,3)}</div>${r.pmec>v.c1?`<p>La propensión media (${fmt(r.pmec,2)}) es mayor que la marginal (${fm(v.c1)}). Si el ingreso crece, la PMeC baja hacia ${fm(v.c1)}.</p>`:""}`);
    const xm=Math.max(v.Y*2,100),ym=Math.max(xm,v.C0+v.c1*(xm-v.T))*1.05;
    $("c-plot").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:x=>x,col:"--muted",w:1.5,dash:"6 5"},{f:x=>v.C0+v.c1*(x-v.T),col:"--line"}],points:[{x:v.Y,y:r.C,col:"--line",label:`(${n0(v.Y)}, ${n0(r.C)})`}],xl:"Ingreso (Y)",yl:"Consumo (C)",label:"Función de consumo y recta de 45 grados"});
    draw()};
  bindCtl(["c-C0","c-c1","c-Y","c-T"],run);run();
};

// ---- Consumo intertemporal (2 períodos)
SIMS.inter=function(){
  const mg=marginal("i-d",[["r","∂W/∂r"],["Y2","∂W/∂Y₂"]],v=>{const Y2=V("i-Y2"),r=V("i-r"),R=MAC.intertemporal({Y1:V("i-Y1"),Y2,r,rho:V("i-rho"),theta:V("i-th")});
    return v==="r"?`<div class="eq">∂W/∂r = −Y<sub>2</sub>/(1+r)² = −${fm(Y2)}/(1 + ${fm(r)})² = <b>${n2(R.dW_dr)}</b><span class="note">Si la tasa sube un punto porcentual (0,01), la riqueza cae unos ${n2(-R.dW_dr*0.01)}.</span></div>`
      :`<div class="eq">∂W/∂Y<sub>2</sub> = 1/(1+r) = 1/(1 + ${fm(r)}) = <b>${fmt(R.dW_dY2,4)}</b><span class="note">Cada peso adicional mañana vale ${fmt(R.dW_dY2,4)} hoy.</span></div>`});
  $("sim").innerHTML=`<div class="ctr">${ctl("i-Y1","Ingreso período 1 (Y₁)",0,5000,10,1000)}${ctl("i-Y2","Ingreso período 2 (Y₂)",0,5000,10,1100)}${ctl("i-r","Tasa de interés real (r)",0,0.5,0.005,0.05)}${ctl("i-rho","Tasa de impaciencia (ρ)",0,0.5,0.005,0.08)}${ctl("i-th","Aversión a la variación del consumo (θ)",0.2,5,0.1,1.5)}</div>
  <div class="res" id="i-res"></div><div id="i-steps"></div>${legend([["--line","Restricción presupuestaria"],["--branch","Curva de indiferencia"]])}<div id="i-plot"></div><div class="verdict" id="i-ver"></div>${mg.html}`;
  const draw=mg.bind();
  const run=()=>{const v={Y1:V("i-Y1"),Y2:V("i-Y2"),r:V("i-r"),rho:V("i-rho"),theta:V("i-th")};
    if(!pos(...Object.values(v))||v.r<=-1||v.rho<=-1||v.theta<=0||v.Y1+v.Y2<=0){$("i-res").innerHTML=err("los ingresos no pueden ser ambos cero, las tasas deben ser mayores que −1 y θ positiva.");return}
    const r=MAC.intertemporal(v),beta=1/(1+v.rho),U=MAC.uCRRA(r.C1,v.theta)+beta*MAC.uCRRA(r.C2,v.theta);
    $("i-res").innerHTML=tiles([["Riqueza W",n2(r.W)],["Factor de Euler C₂/C₁",fmt(r.factor,4)],["C₁*",n2(r.C1)],["C₂*",n2(r.C2)],["Ahorro hoy S₁ = Y₁ − C₁",n2(r.S1),r.S1<0?"badt":""]]);
    $("i-steps").innerHTML=stp(1,"Resolución con la ecuación de Euler",`<div class="eq al">W = Y<sub>1</sub> + ${fr("Y<sub>2</sub>","1 + r")} = ${fm(v.Y1)} + ${fr(fm(v.Y2),"1 + "+fm(v.r))} = ${n2(r.W)}<br>C<sub>2</sub> = C<sub>1</sub>(${fr("1 + r","1 + ρ")})<sup>1/θ</sup> = C<sub>1</sub> · ${fmt(r.factor,4)}<br>C<sub>1</sub>* = ${fr("W","1 + "+fmt(r.factor,4)+" / (1 + "+fm(v.r)+")")} = <b>${n2(r.C1)}</b> &nbsp;&nbsp; C<sub>2</sub>* = <b>${n2(r.C2)}</b></div>`);
    const X=r.W*1.05,Ym=r.W*(1+v.r)*1.05;
    const ic=x=>{const k=(U-MAC.uCRRA(x,v.theta))/beta;if(Math.abs(v.theta-1)<1e-9)return Math.exp(k);const b=1+(1-v.theta)*k;return b>0?b**(1/(1-v.theta)):NaN};
    $("i-plot").innerHTML=plotXY({xr:[0,X],yr:[0,Ym],series:[{f:x=>(r.W-x)*(1+v.r),col:"--line"},{f:ic,col:"--branch"}],points:[{x:r.C1,y:r.C2,col:"--ink",label:"Óptimo"},{x:v.Y1,y:v.Y2,col:"--muted",label:"Dotación (Y₁, Y₂)"}],xl:"Consumo hoy (C₁)",yl:"Consumo mañana (C₂)",label:"Restricción presupuestaria intertemporal y curva de indiferencia"});
    const ve=$("i-ver");ve.className="verdict "+(r.S1>=0?"acc":"warnv");
    ve.textContent=Math.abs(r.S1)<0.005?"El hogar consume exactamente su ingreso de hoy.":r.S1>0?`El hogar ahorra ${n2(r.S1)} hoy y mañana recibe ${n2(r.S1*(1+v.r))} con intereses.`:`El hogar se endeuda ${n2(-r.S1)} hoy y mañana paga ${n2(-r.S1*(1+v.r))}.`;
    draw()};
  bindCtl(["i-Y1","i-Y2","i-r","i-rho","i-th"],run);run();
};

// ---- N períodos
SIMS.nper=function(){let N=3;const ys=[1000,1000,1000,1000,1000,1000,1000,1000,1000,1000];
  $("sim").innerHTML=`<div class="ctr">${ctl("n-N","Número de períodos (N)",2,10,1,3)}${ctl("n-r","Tasa de interés (r)",0,0.3,0.005,0.05)}</div><div class="calcf" id="n-ys"></div>
  <div class="res" id="n-res"></div>${legend([["--branch","Valor nominal Yₜ"],["--line","Valor presente"]])}<div id="n-bars"></div><h4 class="subh">Sensibilidad de la riqueza a la tasa</h4><div id="n-sens"></div><div id="n-der"></div>`;
  const inputs=()=>{$("n-ys").innerHTML=[...Array(N)].map((_,t)=>`<label for="n-y${t}">Ingreso período ${t+1}<input id="n-y${t}" type="number" value="${ys[t]}" step="100" inputmode="decimal"></label>`).join("");
    [...Array(N)].forEach((_,t)=>$("n-y"+t).addEventListener("input",()=>{const x=parseFloat($("n-y"+t).value);if(isFinite(x))ys[t]=x;run()}))};
  const run=()=>{const r=V("n-r");if(!isFinite(r)||r<=-1)return;const Y=ys.slice(0,N),R=MAC.nPeriodos(Y,r);
    $("n-res").innerHTML=tiles([["Riqueza W",n2(R.W)],["Suma nominal",n2(Y.reduce((a,b)=>a+b,0))],["∂W/∂r",n2(R.dW_dr)]]);
    const W=600,H=230,ym=Math.max(...Y,1)*1.15,f=frame(W,H,[0,N],[0,ym],[],ticks(0,ym,nice(ym/4)),"período",""),bw=(W-f.L-f.R)/N;
    let b="";Y.forEach((y,t)=>{const x0=f.L+t*bw;b+=`<rect x="${x0+bw*.14}" y="${f.sy(Math.max(0,y))}" width="${bw*.34}" height="${Math.max(0,f.sy(0)-f.sy(Math.max(0,y)))}" fill="var(--branch)" fill-opacity=".7"/><rect x="${x0+bw*.52}" y="${f.sy(Math.max(0,R.vp[t]))}" width="${bw*.34}" height="${Math.max(0,f.sy(0)-f.sy(Math.max(0,R.vp[t])))}" fill="var(--line)"/><text x="${x0+bw/2}" y="${H-18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">t=${t+1}</text>`});
    $("n-bars").innerHTML=`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ingresos nominales y en valor presente por período">${f.g}${b}</svg></div>`;
    const Wr=x=>MAC.nPeriodos(Y,x).W,lo=Wr(0.2),hi=Wr(0);
    $("n-sens").innerHTML=plotXY({xr:[0,0.2],yr:[Math.min(lo,hi)*0.95,Math.max(lo,hi)*1.03],series:[{f:Wr,col:"--line"}],points:[r<=0.2?{x:r,y:R.W,col:"--ink",label:`r = ${fm(r)}`}:{}],xl:"tasa de interés (r)",yl:"W",H:240,label:"Riqueza según la tasa de interés"});
    $("n-der").innerHTML=stp(1,"Derivadas parciales",`<div class="eq al">∂W/∂r = ${Y.slice(1).map((y,t)=>`−${t+1}·${fm(y)}/(1+r)<sup>${t+2}</sup>`).join(" ")} = <b>${fmt(R.dW_dr,4)}</b><br>${R.dW_dY.map((d,t)=>`∂W/∂Y<sub>${t+1}</sub> = 1/(1+r)<sup>${t}</sup> = ${fmt(d,4)}`).join("<br>")}</div><p>Por cada peso adicional que se recibe en el período t, la riqueza en valor presente sube 1/(1+r)<sup>t−1</sup> pesos.</p>`)};
  $("n-N").addEventListener("input",()=>{N=Math.max(2,Math.min(10,Math.round(V("n-N"))||2));inputs();run()});$("n-N-r").addEventListener("input",()=>{$("n-N").value=$("n-N-r").value;N=Math.round(V("n-N"));inputs();run()});
  bindCtl(["n-r"],run);inputs();run();
};

// ---- Inversión neoclásica
SIMS.inv=function(){
  const mg=marginal("v-d",[["r","Tasa (r)"],["delta","Depreciación (δ)"],["Y","Producción (Y)"]],k=>{const v=vals(),R=MAC.inversion(v);
    return k==="Y"?`<div class="eq">∂K*/∂Y = α/(r + δ) = ${fm(v.alpha)}/${fm(R.uc)} = <b>${fmt(R.dK_dY,3)}</b><span class="note">Por cada peso adicional de producción esperada, el capital deseado sube ${fmt(R.dK_dY,3)} pesos.</span></div>`
      :`<div class="eq">∂K*/∂${k==="r"?"r":"δ"} = −αY/(r + δ)² = −${fm(v.alpha)} · ${n0(v.Y)} / ${fm(R.uc)}² = <b>${n0(R.dK_dr)}</b><span class="note">Si ${k==="r"?"la tasa":"la depreciación"} sube un punto porcentual, el capital deseado cae unos ${n0(-R.dK_dr*0.01)}.</span></div>`});
  $("sim").innerHTML=`<div class="ctr">${ctl("v-Y","Producción esperada (Y)",1e7,3e9,1e7,5e8)}${ctl("v-a","Participación del capital (α)",0.05,0.95,0.01,0.33)}${ctl("v-r","Tasa de interés (r)",0,0.4,0.005,0.05)}${ctl("v-d","Depreciación (δ)",0,0.4,0.005,0.1)}${ctl("v-K","Capital previo (Kₜ₋₁)",0,5e9,1e7,1e9)}${ctl("v-P","Producto marginal del capital (PMgK)",0,0.6,0.005,0.15)}</div>
  <div class="res" id="v-res"></div><div id="v-steps"></div>${legend([["--line","PMgK = αY/K"],["--bad","Costo de uso r + δ"]])}<div id="v-plot"></div><div class="verdict" id="v-ver"></div>${mg.html}`;
  const vals=()=>({Y:V("v-Y"),alpha:V("v-a"),r:V("v-r"),delta:V("v-d"),K_prev:V("v-K"),PMK:V("v-P"),VM:1,CR:1});
  const draw=mg.bind();
  const run=()=>{const v=vals();if(!pos(...Object.values(v))||v.r+v.delta<=0||v.Y<=0){$("v-res").innerHTML=err("r + δ y Y deben ser positivos.");return}
    const R=MAC.inversion(v);
    $("v-res").innerHTML=tiles([["Costo de uso uc",fmt(R.uc,3)],["Capital óptimo K*",n0(R.K)],["Inversión bruta",n0(R.bruta),R.bruta<0?"badt":""],["Inversión neta",n0(R.neta),R.neta<0?"badt":""]]);
    $("v-steps").innerHTML=stp(1,"Cálculo",`<div class="eq al">uc = r + δ = ${fm(v.r)} + ${fm(v.delta)} = ${fmt(R.uc,3)}<br>K* = α ${fr("Y","uc")} = ${fm(v.alpha)} · ${fr(n0(v.Y),fmt(R.uc,3))} = <b>${n0(R.K)}</b><br>I<sup>bruta</sup> = K* − (1 − δ)K<sub>t−1</sub> = ${n0(R.K)} − ${fm(1-v.delta)} · ${n0(v.K_prev)} = ${n0(R.bruta)}</div>`);
    const xm=R.K*2.2,ym=R.uc*3;
    $("v-plot").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:k=>v.alpha*v.Y/k,col:"--line"}],hlines:[{y:R.uc,col:"--bad",dash:"0",w:2.5}],points:[{x:R.K,y:R.uc,col:"--ink",label:"K*"}],vlines:[{x:v.K_prev,col:"--muted"}],xl:"capital (K)",yl:"tasa",label:"Producto marginal del capital frente al costo de uso"});
    const ve=$("v-ver"),g=R.reglaPMK;ve.className="verdict "+(Math.abs(g)<1e-9?"acc":g>0?"acc":"warnv");
    ve.textContent=`Con PMgK = ${fm(v.PMK)} y costo de uso ${fmt(R.uc,3)}: ${Math.abs(g)<1e-9?"son iguales, la empresa ya está en su capital óptimo.":g>0?"la máquina rinde más de lo que cuesta, conviene invertir.":"la máquina rinde menos de lo que cuesta, conviene desinvertir."} La línea punteada marca el capital previo.`;
    draw()};
  bindCtl(["v-Y","v-a","v-r","v-d","v-K","v-P"],run);run();
};

// ---- q de Tobin
SIMS.tobin=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("t-VM","Valor de mercado (VM)",0,5e9,1e7,1.5e9)}${ctl("t-CR","Costo de reposición (CR)",1e7,5e9,1e7,1.2e9)}</div><div class="res" id="t-res"></div><div id="t-bars"></div><div class="verdict" id="t-ver"></div>`;
  const run=()=>{const VM=V("t-VM"),CR=V("t-CR");if(!pos(VM,CR)||CR<=0){$("t-res").innerHTML=err("el costo de reposición debe ser positivo.");return}
    const q=VM/CR;$("t-res").innerHTML=tiles([["q = VM / CR",fmt(q,3)],["VM − CR",n0(VM-CR),VM<CR?"badt":""]]);
    const W=600,H=150,m=Math.max(VM,CR)*1.1,sx=x=>150+x/m*430;
    $("t-bars").innerHTML=`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Valor de mercado frente a costo de reposición">${[["Valor de mercado",VM,"--line",30],["Costo de reposición",CR,"--branch",86]].map(([t,v,c,y])=>`<text x="140" y="${y+22}" text-anchor="end" font-size="12.5" fill="var(--ink)">${t}</text><rect x="150" y="${y}" width="${Math.max(0,sx(v)-150)}" height="34" fill="var(${c})" rx="4"/><text x="${Math.min(sx(v)+6,W-4)}" y="${y+22}" font-size="12" fill="var(--ink)" text-anchor="${sx(v)>500?"end":"start"}" font-family="var(--f-mono)">${n0(v)}</text>`).join("")}</svg></div>`;
    const ve=$("t-ver");ve.className="verdict "+(q>1?"acc":q<1?"rej":"warnv");
    ve.textContent=q>1?"q > 1: el mercado valora la empresa por más de lo que cuestan sus máquinas. Conviene invertir.":q<1?"q < 1: el capital existente es más barato que instalar máquinas nuevas. No conviene invertir.":"q = 1: equilibrio, no hay incentivo a cambiar el capital."};
  bindCtl(["t-VM","t-CR"],run);run();
};

// ---- Gobierno
function gobVals(){const o=(id,d)=>$(id)?V(id):d;return{G:V("g-G"),T0:V("g-T0"),t:V("g-t"),Y:V("g-Y"),Ypot:o("g-Yp",V("g-Y")*0.95),c:o("g-c",0.8),B:o("g-B",0),r:o("g-r",0)}}
SIMS.gob=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("g-G","Gasto público (G)",0,3000,10,500)}${ctl("g-T0","Impuestos autónomos (T₀)",0,1000,10,100)}${ctl("g-t","Tasa impositiva marginal (t)",0,0.6,0.005,0.2)}${ctl("g-Y","Ingreso nacional (Y)",100,10000,50,2000)}${ctl("g-c","Propensión a consumir (c)",0.1,0.95,0.01,0.8)}${ctl("g-B","Deuda pública (B)",0,10000,50,1000)}${ctl("g-r","Tasa de interés de la deuda (r)",0,0.3,0.005,0.05)}</div>
  <div class="res" id="g-res"></div><div class="verdict" id="g-ver"></div>${legend([["--line","Balance BS = T₀ + tY − G"]])}<div id="g-plot"></div><div id="g-deuda"></div>`;
  const run=()=>{const v=gobVals();if(!pos(...Object.values(v))||v.Y<=0||v.c*(1-v.t)>=1){$("g-res").innerHTML=err("revisa que c(1 − t) sea menor que 1 y que Y sea positivo.");return}
    const R=MAC.gobierno(v);
    $("g-res").innerHTML=tiles([["Recaudo T = T₀ + tY",n2(R.T)],["Gasto G",n2(v.G)],["Balance BS",n2(R.balance),R.balance<0?"badt":R.balance>0?"okt":""],["Multiplicador 1/(1 − c(1 − t))",fmt(R.mult,3)],["∂BS/∂Y = t",fm(v.t)]]);
    const ve=$("g-ver");ve.className="verdict "+(R.balance>0?"acc":R.balance<0?"rej":"warnv");
    ve.textContent=R.balance>0?`Superávit fiscal de ${n2(R.balance)}: el gobierno tiene espacio para ahorrar o pagar deuda.`:R.balance<0?`Déficit fiscal de ${n2(-R.balance)}: hay que emitir deuda, lo que puede presionar la tasa de interés (crowding out).`:"Presupuesto equilibrado: el recaudo cubre exactamente el gasto.";
    const lo=v.Y*0.5,hi=v.Y*1.5,bs=y=>v.T0+v.t*y-v.G,a=bs(lo),b=bs(hi),pad=Math.max(1,Math.abs(b-a)*0.15),yb=v.t>0?(v.G-v.T0)/v.t:NaN;
    $("g-plot").innerHTML=plotXY({xr:[lo,hi],yr:[Math.min(a,b,0)-pad,Math.max(a,b,0)+pad],series:[{f:bs,col:"--line"}],hlines:[{y:0,col:"--muted"}],points:[{x:v.Y,y:R.balance,col:"--ink",label:"Hoy"},...(yb>lo&&yb<hi?[{x:yb,y:0,col:"--muted",label:`BS = 0 en Y = ${n0(yb)}`}]:[])],xl:"ingreso (Y)",yl:"balance",label:"Balance fiscal según el ingreso"});
    $("g-deuda").innerHTML=stp(1,`Deuda del próximo período ${NW}`,`<div class="eq al">B<sub>t</sub> = (1 + r)B<sub>t−1</sub> + G − T = (1 + ${fm(v.r)}) · ${fm(v.B)} + ${fm(v.G)} − ${n2(R.T)} = <b>${n2(R.Bnext)}</b></div><p>Los intereses de la deuda (${n2(R.intereses)}) se suman al déficit primario${R.balance>=0?`; aunque el balance primario no es negativo, la deuda ${R.Bnext>v.B?"crece":"no crece"} si el superávit no alcanza a cubrir los intereses.`:"."}</p>`)};
  bindCtl(["g-G","g-T0","g-t","g-Y","g-c","g-B","g-r"],run);run();
};
SIMS.estr=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("g-G","Gasto público (G)",0,3000,10,500)}${ctl("g-T0","Impuestos autónomos (T₀)",0,1000,10,100)}${ctl("g-t","Tasa impositiva marginal (t)",0,0.6,0.005,0.2)}${ctl("g-Y","Ingreso observado (Y)",100,10000,50,2000)}${ctl("g-Yp","PIB potencial (Y*)",100,10000,50,1900)}</div>
  <div class="res" id="e-res"></div><div class="verdict" id="e-ver"></div>`;
  const run=()=>{const v=Object.assign(gobVals(),{c:0.8,B:0,r:0});if(!pos(v.G,v.T0,v.t,v.Y,v.Ypot)){$("e-res").innerHTML=err("completa todos los valores.");return}
    const R=MAC.gobierno(v);
    $("e-res").innerHTML=tiles([["Balance observado BS",n2(R.balance)],["Balance estructural BS*",n2(R.BSe),R.BSe<0?"badt":""],["Componente cíclico",n2(R.ciclico)],["Brecha Y − Y*",n2(v.Y-v.Ypot)]]);
    const ve=$("e-ver");ve.className="verdict "+(R.BSe>=0?"acc":"warnv");
    ve.textContent=v.Y>v.Ypot?`La economía está por encima de su potencial: ${n2(R.ciclico)} del balance se debe al auge y desaparecerá cuando la economía vuelva a Y*.`:v.Y<v.Ypot?`La economía está por debajo de su potencial: el ciclo empeora el balance en ${n2(-R.ciclico)}. La posición fiscal de fondo es ${n2(R.BSe)}.`:"La economía está en su potencial: el balance observado es el estructural."};
  bindCtl(["g-G","g-T0","g-t","g-Y","g-Yp"],run);run();
};

// ---- Microfundamentos
SIMS.micro=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("m-a","Participación del capital (α)",0.05,0.95,0.01,0.33)}${ctl("m-z","Productividad (z)",0.1,5,0.05,1)}${ctl("m-K","Stock de capital (K)",1,500,1,100)}${ctl("m-w","Salario real (w)",0.1,10,0.05,2.5)}${ctl("m-g","Preferencia por el ocio (γ)",0.1,5,0.05,1.5)}${ctl("m-h","Dotación de tiempo (h)",1,24,0.5,24)}</div>
  <div class="res" id="m-res"></div>${legend([["--line","Demanda de trabajo Nᵈ (firma)"],["--branch","Oferta de trabajo Nˢ (hogar)"],["--muted","Salario actual"]])}<div id="m-plot"></div><div class="verdict" id="m-ver"></div><div id="m-steps"></div>`;
  const run=()=>{const v={alpha:V("m-a"),z:V("m-z"),K:V("m-K"),w:V("m-w"),gamma:V("m-g"),h:V("m-h")};
    if(!pos(...Object.values(v))||Object.values(v).some(x=>x<=0)||v.alpha>=1){$("m-res").innerHTML=err("todos los valores deben ser positivos y α menor que 1.");return}
    const R=MAC.micro(v);
    $("m-res").innerHTML=tiles([["Demanda Nᵈ",n2(R.Nd)+" h"],["Producción Y",n2(R.Y)],["Ocio l*",n2(R.l)+" h"],["Oferta Nˢ",n2(R.Ns)+" h"],["Salario de equilibrio w*",fmt(R.wEq,3)]]);
    const nd=w=>(R.A/w)**(1/v.alpha),wm=Math.max(v.w,R.wEq)*1.8,xm=Math.max(v.h,nd(Math.min(v.w,R.wEq)*0.9)*1.05);
    $("m-plot").innerHTML=plotXY({xr:[0,Math.min(xm,v.h*3)],yr:[0,wm],series:[{pts:[...Array(161)].map((_,i)=>{const w=wm*(0.02+0.98*i/160);return[nd(w),w]}),col:"--line"}],vlines:[{x:R.Ns,col:"--branch",dash:"0",w:2.5}],hlines:[{y:v.w,col:"--muted"}],points:[{x:R.Ns,y:R.wEq,col:"--ink",label:"Equilibrio"}],xl:"horas de trabajo (N)",yl:"salario (w)",label:"Mercado laboral: demanda de la firma y oferta del hogar"});
    const gap=v.w-R.wEq,ve=$("m-ver");
    if(Math.abs(gap)<=0.01*R.wEq){ve.className="verdict acc";ve.textContent="El mercado está en equilibrio: el salario actual vacía el mercado."}
    else if(gap>0){ve.className="verdict rej";ve.textContent=`Con w = ${fm(v.w)} hay desempleo: exceso de oferta de ${n2(R.Ns-R.Nd)} horas. El hogar dedica el ${fmt(R.l/v.h*100,1)} % de su tiempo al ocio.`}
    else{ve.className="verdict warnv";ve.textContent=`Con w = ${fm(v.w)} hay vacantes: exceso de demanda de ${n2(R.Nd-R.Ns)} horas.`}
    $("m-steps").innerHTML=stp(1,"Sustitución numérica",`<div class="eq al">N<sup>d</sup> = (${fr(fmt(R.A,3),fm(v.w))})<sup>1/${fm(v.alpha)}</sup> = ${n2(R.Nd)} &nbsp;&nbsp; l* = ${fr(fm(v.gamma),"1 + "+fm(v.gamma))} · ${fm(v.h)} = ${n2(R.l)}<br>w* = ${fmt(R.A,3)} · (${fr("1 + "+fm(v.gamma),fm(v.h))})<sup>${fm(v.alpha)}</sup> = <b>${fmt(R.wEq,3)}</b></div>`)};
  bindCtl(["m-a","m-z","m-K","m-w","m-g","m-h"],run);run();
};

// ---- Equilibrio general dinámico
SIMS.din=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("d-a","Participación del capital (α)",0.05,0.9,0.01,0.35)}${ctl("d-z1","Productividad actual (z₁)",0.1,3,0.01,1)}${ctl("d-z2","Productividad futura (z₂)",0.1,3,0.01,1.05)}${ctl("d-r","Tasa de interés (r)",0,0.3,0.005,0.05)}${ctl("d-d","Depreciación (δ)",0,0.3,0.005,0.1)}${ctl("d-K","Capital inicial (K₁)",0.5,300,0.5,100)}${ctl("d-g","Preferencia por el ocio (γ)",0.1,5,0.05,1.5)}${ctl("d-h","Dotación de tiempo (h)",1,24,0.5,24)}${ctl("d-b","Factor de descuento (β)",0.5,1,0.005,0.95)}${ctl("d-t","Impuesto al salario (τ)",0,0.6,0.01,0.15)}</div>
  <div class="res" id="d-res"></div>${legend([["--line","PMgK₂ = αz₂K₂^(α−1)"],["--bad","Costo de uso r + δ"]])}<div id="d-plot"></div><div class="verdict" id="d-ver"></div><div id="d-tax"></div>`;
  const run=()=>{const v={alpha:V("d-a"),z1:V("d-z1"),z2:V("d-z2"),r:V("d-r"),delta:V("d-d"),K1:V("d-K"),gamma:V("d-g"),h:V("d-h"),beta:V("d-b"),tau:V("d-t")};
    if(!pos(...Object.values(v))||v.alpha<=0||v.alpha>=1||v.r+v.delta<=0||v.tau>=1){$("d-res").innerHTML=err("α entre 0 y 1, r + δ positivo y τ menor que 1.");return}
    const R=MAC.dinamico(v);
    $("d-res").innerHTML=tiles([["Capital mañana K₂*",fmt(R.K2,3)],["Inversión hoy I₁",n2(R.I1),R.I1<0?"badt":""],["Salario de equilibrio w₁*",fmt(R.w1,3)],["Oferta laboral Nˢ",n2(R.Ns)],["C₂/C₁ = β(1 + r)",fmt(R.euler,4)]]);
    const uc=v.r+v.delta,pm=k=>v.alpha*v.z2*k**(v.alpha-1);
    $("d-plot").innerHTML=plotXY({xr:[0,R.K2*2.2],yr:[0,uc*3],series:[{f:pm,col:"--line"}],hlines:[{y:uc,col:"--bad",dash:"0",w:2.5}],points:[{x:R.K2,y:uc,col:"--ink",label:"K₂*"}],xl:"capital de mañana (K₂)",yl:"tasa",label:"Producto marginal del capital futuro frente al costo de uso"});
    const ve=$("d-ver");ve.className="verdict "+(R.I1>=0?"acc":"warnv");
    ve.textContent=`${R.I1>=0?`La firma invierte ${n2(R.I1)} hoy.`:`La inversión es negativa (${n2(R.I1)}): la firma vende máquinas, porque K₁ es mayor que el capital que quiere tener mañana.`} ${R.euler>1?"Como β(1 + r) > 1, el hogar ahorra para consumir más mañana.":R.euler<1?"Como β(1 + r) < 1, el hogar es impaciente y prefiere consumir hoy.":"Como β(1 + r) = 1, el hogar consume lo mismo en ambos períodos."}`;
    $("d-tax").innerHTML=stp(1,`La cuña fiscal ${NW}`,`<div class="eq al">Salario neto = w<sub>1</sub>(1 − τ) = ${fmt(R.w1,3)} · (1 − ${fm(v.tau)}) = ${fmt(R.w1*(1-v.tau),3)}<br>Si el gobierno se queda con lo recaudado: N<sup>s</sup> = h/(1 + γ) = ${n2(R.Ns)} (no cambia)<br>Si lo devuelve como transferencia: N<sup>s</sup> = ${fr("h(1 − τ)","1 + γ − τ")} = <b>${n2(R.NsTau)}</b></div><p>Con impuesto devuelto, la oferta de trabajo cae ${n2(R.Ns-R.NsTau)} horas: queda solo el efecto sustitución.</p>`)};
  bindCtl(["d-a","d-z1","d-z2","d-r","d-d","d-K","d-g","d-h","d-b","d-t"],run);run();
};

// ---- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Consumo","Función de consumo","C = C₀ + c₁(Y − T)"],["Consumo","Propensión media","PMeC = C / Y"],["Consumo","Ahorro","S = Y − T − C"],
    ["Intertemporal","Riqueza","W = Y₁ + Y₂/(1 + r)"],["Intertemporal","Restricción","C₁ + C₂/(1 + r) = W"],["Intertemporal","Euler CRRA","C₂ = C₁ [(1 + r)/(1 + ρ)]^(1/θ)"],["Intertemporal","Euler logarítmica","C₂/C₁ = β(1 + r)"],["Intertemporal","Riqueza en N períodos","W = Σ Yₜ/(1 + r)^(t−1)"],["Intertemporal","∂W/∂r","−Y₂/(1 + r)²"],
    ["Inversión","Costo de uso","uc = r + δ"],["Inversión","Capital óptimo","K* = αY/(r + δ)"],["Inversión","Inversión bruta","I = K* − (1 − δ)Kₜ₋₁"],["Inversión","q de Tobin","q = VM / CR"],["Inversión","∂K*/∂r","−αY/(r + δ)²"],
    ["Gobierno","Recaudo","T = T₀ + tY"],["Gobierno","Balance","BS = T₀ + tY − G"],["Gobierno","Multiplicador","m = 1/(1 − c(1 − t))"],["Gobierno","Balance estructural","BS* = T₀ + tY* − G"],["Gobierno","Deuda","Bₜ = (1 + r)Bₜ₋₁ + G − T"],
    ["Microfundamentos","Demanda de trabajo","Nᵈ = [(1 − α)zK^α / w]^(1/α)"],["Microfundamentos","Ocio óptimo","l* = γh/(1 + γ)"],["Microfundamentos","Oferta de trabajo","Nˢ = h/(1 + γ)"],["Microfundamentos","Salario de equilibrio","w* = (1 − α)zK^α [(1 + γ)/h]^α"],
    ["Dinámico","Inversión óptima","PMgK₂ = r + δ"],["Dinámico","Capital de mañana","K₂* = [αz₂/(r + δ)]^(1/(1−α))"],["Dinámico","Cuña fiscal","γC/l = w(1 − τ)"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: multiplicador"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));
    $("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run();
};
