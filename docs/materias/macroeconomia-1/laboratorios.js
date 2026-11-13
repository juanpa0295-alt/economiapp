// Macroeconomía I · laboratorios interactivos
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
  const mg=marginal("v-mg",[["r","Tasa (r)"],["delta","Depreciación (δ)"],["Y","Producción (Y)"]],k=>{const v=vals(),R=MAC.inversion(v);
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
    ["Dinámico","Inversión óptima","PMgK₂ = r + δ"],["Dinámico","Capital de mañana","K₂* = [αz₂/(r + δ)]^(1/(1−α))"],["Dinámico","Cuña fiscal","γC/l = w(1 − τ)"],
    ["Ciclos","Filtro HP","min Σ(ln Yₜ − τₜ)² + λΣ(Δ²τₜ)², λ = 100 anual, 1.600 trimestral"],["Consumo","Renta permanente","ΔC = Δ·r/[(1 + r)(1 − (1 + r)^(−N))] (transitorio); ΔC = Δ (permanente)"],["Consumo","Hall","Eₜ[Cₜ₊₁] = Cₜ"],["Consumo","Ciclo de vida","C = (W₀ + ΣYₜ)/T"],
    ["Activos","Factor de descuento estocástico","m = β(Cₜ₊₁/Cₜ)^(−θ); p = E[mx]"],["Activos","Tasa libre de riesgo","1 + r_f = 1/E[m]"],["Activos","Prima de riesgo","E[R] − R_f = −R_f·Cov(m, R)"],
    ["Inversión","Acelerador","Iₜ = vΔYₜ + δKₜ₋₁"],["Inversión","Restricción de liquidez","I = min{I*, flujo de caja + B}"],
    ["Gobierno","Restricción intertemporal","G₁ + G₂/(1 + r) = T₁ + T₂/(1 + r)"],["Gobierno","Dinámica de la deuda","bₜ₊₁ = [(1 + r)/(1 + g)]bₜ − sₜ"],["Gobierno","Superávit que estabiliza","s* = (r − g)b/(1 + g)"],
    ["Economía cerrada","Equilibrio de un período","Y = C + G; γC/l = w = zF_N"],["Economía cerrada","Tasa de interés (dotaciones, log)","1 + r = (Y₂ − G₂)/[β(Y₁ − G₁)]"],
    ["Crecimiento","Regla del 70","t ≈ 70/g(%)"],["Crecimiento","Solow","k̇ = sk^α − (n + g + δ)k; k* = [s/(n + g + δ)]^(1/(1−α))"],["Crecimiento","Regla de oro","f′(k) = n + g + δ; s = α"],["Crecimiento","Convergencia","λ = (1 − α)(n + g + δ)"],
    ["Crecimiento","MRW","ln y* = [α ln sₖ + β ln sₕ − (α + β) ln(n + g + δ)]/(1 − α − β)"],["Crecimiento","AK","γ = sA − (n + δ)"],["Crecimiento","Contabilidad","g_A = g_Y − αg_K − (1 − α)g_L"],["Crecimiento","Ramsey","ċ/c = [f′(k) − δ − ρ]/θ; f′(k*) = δ + ρ"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: multiplicador"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));
    $("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run();
};

// Visuales de cambios de Macroeconomía 1 (usa el motor comun/visual.js)

// 1. Consumo intertemporal: restricción C1 + C2/(1+r) = Y1 + Y2/(1+r), utilidad ln C1 + ln C2/(1+ρ)
VIS.add("inter",{t:"Consumo intertemporal: restricción y canasta óptima",
  hint:"Arrastra la dotación E = (Y₁, Y₂) para cambiar el ingreso de cada período, o el círculo sobre la restricción para girarla alrededor de la dotación (cambia la tasa r).",
  opts:[{id:"rho",lab:"Tasa de descuento ρ",ch:[["0","0 %"],["0.05","5 %"],["0.2","20 %"]],v:"0.05"}],
  p0:{Y1:60,Y2:60,r:0.1},lim:{Y1:[15,110],r:[-0.3,0.8]},
  presets:[["Sube r (10 % → 30 %)",{r:0.3}],["Baja r (10 % → 0 %)",{r:0}],["Bonificación transitoria (∆Y₁)",{Y1:80}],["Aumento permanente (Y₁ y Y₂)",{Y1:75,Y2:75}],["Ingreso futuro esperado (∆Y₂)",{Y2:85}]],
  fit:{Y1:(x,y,st)=>{st.p.Y2=VIS.clamp(y,15,110);return x},r:(x,y,st)=>{const{Y1,Y2}=st.p;if(Math.abs(Y1-x)<3)return st.p.r;return (y-Y2)/(Y1-x)-1}},
  compute(st){const rho=+st.o.rho,{Y1,Y2,r}=st.p,b=1/(1+rho);
    const opt=(y1,y2,rr)=>{const W=y1+y2/(1+rr),C1=W/(1+b),C2=C1*(1+rr)*b;return{W,C1,C2,u:Math.log(C1)+b*Math.log(C2)}};
    const o0=opt(60,60,0.1),o1=opt(Y1,Y2,r),BL=(y1,y2,rr)=>c1=>y2+(1+rr)*(y1-c1),IC=u=>c1=>c1>0?Math.exp((u-Math.log(c1))/b):NaN;
    const mv=Math.abs(Y1-60)>0.5||Math.abs(Y2-60)>0.5||Math.abs(r-0.1)>0.004;
    const curves=[{sh:VIS.fx(BL(60,60,0.1)),col:"--line",dash:1,op:.55,lab:""},{sh:VIS.fx(IC(o0.u)),col:"--branch",dash:1,op:.45},
      {sh:VIS.fx(BL(Y1,Y2,r)),col:"--line",lab:"restricción"},{sh:VIS.fx(IC(o1.u)),col:"--branch",lab:"indiferencia"}];
    const pts=[{x:60,y:60,lab:"E₀",col:"--muted"},{x:o0.C1,y:o0.C2,lab:"0"}];if(mv)pts.push({x:o1.C1,y:o1.C2,lab:"1",col:"--good"});
    const segs=[{x1:Y1,y1:0,x2:Y1,y2:Y2,col:"--muted",dash:1,w:1},{x1:0,y1:Y2,x2:Y1,y2:Y2,col:"--muted",dash:1,w:1}];
    const hx=Math.max(4,Y1*0.35),P={cap:"Plano (C₁, C₂) · ρ = "+VIS.n(rho*100,0)+" %",xr:[0,160],yr:[0,160],xl:"Consumo hoy C₁",yl:"Consumo mañana C₂",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"Y1",x:Y1,y:Y2,col:"--exam",name:"la dotación (Y₁, Y₂)"},{c:"r",x:hx,y:BL(Y1,Y2,r)(hx),col:"--line",name:"la restricción (tasa r)"}]};
    const S0=60-o0.C1,S1=Y1-o1.C1;let h;
    if(!mv)h=`<p>Todavía no hay cambios. Con Y₁ = Y₂ = 60 y r = 10 %, la riqueza es W = ${VIS.n(o0.W,1)} y el óptimo es C₁ = ${VIS.n(o0.C1,1)}, C₂ = ${VIS.n(o0.C2,1)}: el hogar ${S0>0?"ahorra":"se endeuda"} ${VIS.n(Math.abs(S0),1)} hoy. Arrastra la dotación o gira la restricción.</p>`;
    else{const mvl=[],cs=[];const dY1=Y1-60,dY2=Y2-60,dr=r-0.1;
      if(Math.abs(dr)>0.004){mvl.push(`La restricción <b>giró</b> alrededor de la dotación: r pasó de 10 % a ${VIS.n(r*100,1)} % (pendiente −(1 + r)).`);cs.push(dr>0?"Sube la tasa de interés: el banco central la sube o hay más demanda de crédito.":"Baja la tasa de interés.")}
      if(Math.abs(dY1)>0.5||Math.abs(dY2)>0.5){mvl.push(`La dotación se movió a (${VIS.n(Y1,1)}, ${VIS.n(Y2,1)}): la restricción se desplazó en paralelo si r no cambió.`);
        cs.push(Math.abs(dY1)>0.5&&Math.abs(dY2)>0.5&&Math.sign(dY1)===Math.sign(dY2)?"Cambio <b>permanente</b> del ingreso (afecta los dos períodos).":Math.abs(dY1)>0.5&&Math.abs(dY2)<=0.5?"Cambio <b>transitorio</b> del ingreso de hoy (bonificación, desempleo temporal).":"Cambio del ingreso <b>futuro esperado</b> (un ascenso, una pensión).")}
      let m=`<p>El hogar iguala la tasa marginal de sustitución con 1 + r (ecuación de Euler): C₂ = C₁·(1 + r)/(1 + ρ). Con utilidad logarítmica, C₁ = W/(1 + 1/(1 + ρ)): consume hoy una fracción fija de la riqueza.</p>`;
      if(Math.abs(dr)>0.004)m+=`<p><b>Efecto sustitución:</b> ${dr>0?"consumir hoy se vuelve más caro en términos de mañana: se pospone consumo":"consumir hoy se abarata: se adelanta consumo"}. <b>Efecto ingreso:</b> ${S0>0?(dr>0?"como el hogar era ahorrador, la subida de r lo hace más rico y empuja C₁ hacia arriba":"como era ahorrador, la baja de r lo empobrece"):(dr>0?"como era deudor, la subida de r lo empobrece y reduce C₁":"como era deudor, la baja de r lo enriquece")}. <b>Efecto riqueza humana:</b> el ingreso futuro vale ${dr>0?"menos":"más"} en valor presente. Aquí C₁ ${o1.C1>o0.C1?"sube":"baja"}.</p>`;
      if(Math.abs(dY1)>0.5||Math.abs(dY2)>0.5)m+=`<p>La riqueza pasa de ${VIS.n(o0.W,1)} a ${VIS.n(o1.W,1)}. El hogar <b>suaviza</b> el consumo: reparte el cambio entre los dos períodos${Math.abs(dY1)>0.5&&Math.abs(dY2)<=0.5?", así que ahorra la mayor parte de un ingreso transitorio":""}.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Riqueza W",o0.W,o1.W,1),VIS.tile("Consumo hoy C₁",o0.C1,o1.C1,1),VIS.tile("Consumo mañana C₂",o0.C2,o1.C2,1),VIS.tile("Ahorro hoy S₁",S0,S1,1)])}</div><p>${S1>0.05?"El hogar es <b>prestamista</b> (ahorra hoy).":S1<-0.05?"El hogar es <b>prestatario</b> (se endeuda hoy).":"El hogar consume justo su ingreso."}</p>`)}
    return{panels:[P],text:h}}});

// 2. Capital óptimo: PMgK = αY/K contra el costo de uso uc = r + δ
VIS.add("capital",{t:"Capital óptimo: PMgK y costo de uso",
  hint:"Arrastra la recta del costo de uso (cambia r) o la curva de la productividad marginal del capital (cambia la producción esperada Y).",
  p0:{uc:0.15,Y:300},lim:{uc:[0.06,0.35],Y:[180,450]},
  presets:[["Sube r 5 puntos",{uc:0.2}],["Baja r 5 puntos",{uc:0.1}],["Mejoran las ventas esperadas",{Y:380}],["Recesión esperada",{Y:220}]],
  fit:{uc:(K,u)=>u,Y:(K,u)=>u*K/0.3},
  compute(st){const a=0.3,d=0.1,K0prev=600,{uc,Y}=st.p,PM=y=>K=>a*y/K,K0=a*300/0.15,K1=a*Y/uc,mU=Math.abs(uc-0.15)>0.002,mY=Math.abs(Y-300)>1;
    const curves=[{sh:VIS.hy(0.15),col:"--line",dash:1,op:.55,lab:mU?"uc":""},{sh:VIS.fx(PM(300)),col:"--branch",dash:1,op:.55,lab:mY?"PMgK":""},{sh:VIS.hy(uc),col:"--line",lab:mU?"uc’ = r’ + δ":"uc = r + δ"},{sh:VIS.fx(PM(Y)),col:"--branch",lab:mY?"PMgK’ = αY’/K":"PMgK = αY/K"}];
    const pts=[{x:K0,y:0.15,lab:"K*₀"}];if(mU||mY)pts.push({x:K1,y:uc,lab:"K*₁",col:"--good"});
    const hk=VIS.clamp(a*Y/0.09,150,1350),P={cap:"Capital deseado",xr:[0,1400],yr:[0,0.4],xl:"Capital K",yl:"PMgK, costo de uso",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,2),curves,pts,
      handles:[{c:"uc",x:1250,y:uc,col:"--line",name:"el costo de uso"},{c:"Y",x:hk,y:PM(Y)(hk),col:"--branch",name:"la productividad marginal del capital"}]};
    let h;if(!mU&&!mY)h=`<p>Todavía no hay cambios. La firma acumula capital hasta que PMgK = uc: K* = αY/(r + δ) = 0,3·300/0,15 = ${VIS.n(K0,0)}. Con K₋₁ = ${K0prev}, la inversión neta es ${VIS.n(K0-K0prev,0)} y la bruta ${VIS.n(K0-(1-d)*K0prev,0)}.</p>`;
    else{const mv=[],cs=[];if(mU){mv.push(`El costo de uso pasó de 0,15 a ${VIS.n(uc,3)} (r de 5 % a ${VIS.n((uc-d)*100,1)} %, con δ = 10 %).`);cs.push(uc>0.15?"Sube la tasa de interés (política monetaria contractiva) o el capital se deprecia más rápido.":"Baja la tasa de interés o mejoran las condiciones de crédito.")}
      if(mY){mv.push(`La curva PMgK se desplazó <b>${Y>300?"a la derecha":"a la izquierda"}</b>: producción esperada Y = ${VIS.n(Y,0)}.`);cs.push(Y>300?"Las empresas esperan vender más (expectativas optimistas, más demanda).":"Las empresas esperan vender menos (recesión esperada).")}
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",`<p>Con el capital inicial ${VIS.n(K0,0)}, ahora ${K1>K0?"la PMgK supera al costo de uso: cada unidad adicional de capital rinde más de lo que cuesta, así que la firma invierte":"el costo de uso supera a la PMgK: sobra capital y la firma invierte menos (o deja que se deprecie)"} hasta K* = αY/uc = ${VIS.n(K1,0)}.</p><div class="eq al chain">I neta = K* − K₋₁ = ${VIS.n(K1,0)} − ${K0prev} = ${VIS.n(K1-K0prev,0)}<br>I bruta = K* − (1 − δ)K₋₁ = ${VIS.n(K1-(1-d)*K0prev,0)}</div>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Capital deseado K*",K0,K1,0),VIS.tile("Inversión bruta",K0-(1-d)*K0prev,K1-(1-d)*K0prev,0)])}</div>`)}
    return{panels:[P],text:h}}});


// ===================== LABORATORIOS DEL PROGRAMA 1503711 =====================
const tilesM=a=>tiles(a.map(([l,v,c])=>[`<span class="nt">${l}</span>`,v,c]));
const n4=v=>fmt(v,4),pc=(v,d=2)=>fmt(100*v,d)+" %";
const numIn=(id,l,v)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" step="any" inputmode="decimal"></label>`;
const NV=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",",".")):NaN};
const onInput=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});
const rng1=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const gauss=R=>{const u=R()||1e-12,v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const rangeOf=(arrs,pad=0.08)=>{let lo=Infinity,hi=-Infinity;arrs.forEach(a=>a.forEach(v=>{if(isFinite(v)){lo=Math.min(lo,v);hi=Math.max(hi,v)}}));if(!isFinite(lo)){lo=0;hi=1}const d=(hi-lo)||Math.abs(hi)||1;return[lo-d*pad,hi+d*pad]};
const bisect=(f,a,b,it=200)=>{let fa=f(a);for(let i=0;i<it;i++){const m=(a+b)/2,fm_=f(m);if(fa*fm_<=0)b=m;else{a=m;fa=fm_}}return(a+b)/2};
const meanA=a=>a.reduce((s,v)=>s+v,0)/a.length,sdA=a=>{const m=meanA(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1))};
const corA=(a,b)=>{const ma=meanA(a),mb=meanA(b);let s=0,x=0,y=0;a.forEach((v,i)=>{s+=(v-ma)*(b[i]-mb);x+=(v-ma)**2;y+=(b[i]-mb)**2});return s/Math.sqrt(x*y)};

// ---------- Unidad 1: hechos del ciclo con el filtro de Hodrick-Prescott
function hp(y,lam){const n=y.length,A=[...Array(n)].map(()=>new Float64Array(n));
  for(let i=0;i<n;i++)A[i][i]=1;for(let t=0;t<n-2;t++){const d=[1,-2,1];for(let a=0;a<3;a++)for(let b=0;b<3;b++)A[t+a][t+b]+=lam*d[a]*d[b]}
  const x=Float64Array.from(y);for(let c=0;c<n;c++){const lim=Math.min(n,c+3);for(let r=c+1;r<lim;r++){const f=A[r][c]/A[c][c];if(!f)continue;for(let j=c;j<Math.min(n,c+3);j++)A[r][j]-=f*A[c][j];x[r]-=f*x[c]}}
  const t=new Float64Array(n);for(let r=n-1;r>=0;r--){let s=x[r];for(let j=r+1;j<Math.min(n,r+3);j++)s-=A[r][j]*t[j];t[r]=s/A[r][r]}return Array.from(t)}
const CICLO_DEMO=(()=>{const R=rng1(7);let c=0,L=["año pib consumo inversion"];let Y=100;for(let t=0;t<40;t++){c=0.7*c+0.012*gauss(R);const y=Y*Math.exp(0.035*t+c),C=0.65*y*Math.exp(-0.45*c+0.004*gauss(R)),I=0.22*y*Math.exp(2.8*c+0.02*gauss(R));L.push(`${1985+t} ${y.toFixed(1)} ${C.toFixed(1)} ${I.toFixed(1)}`)}return L.join("\n")})();
SIMS.ciclo=function(){
  $("sim").innerHTML=`<div class="calcf"><label for="cy-d">Series en niveles reales (año, PIB, consumo, inversión). La serie de ejemplo es <b>simulada</b>: pega aquí los datos del DANE para Colombia.<textarea id="cy-d" rows="6" style="width:100%;font-family:var(--f-mono)">${CICLO_DEMO}</textarea></label></div>
  <div style="margin:8px 0">${seg("cy-l","Frecuencia",[["100","Anual (λ = 100)"],["1600","Trimestral (λ = 1.600)"]],"100")}</div><div class="res" id="cy-res"></div><div id="cy-p1"></div>${legend([["--ink","PIB"],["--line","Consumo"],["--exam","Inversión"]])}<div id="cy-p2"></div><div id="cy-st"></div>`;
  let lam=100;
  const run=()=>{const L=$("cy-d").value.trim().split(/\n+/).slice(1).map(r=>r.trim().split(/[\s;\t]+/).map(v=>+v.replace(",","."))).filter(r=>r.length>=4&&r.every(isFinite));
    if(L.length<8||L.some(r=>r[1]<=0||r[2]<=0||r[3]<=0)){$("cy-res").innerHTML=err("se necesitan al menos 8 filas con año, PIB, consumo e inversión positivos.");$("cy-p1").innerHTML=$("cy-p2").innerHTML=$("cy-st").innerHTML="";return}
    const yr=L.map(r=>r[0]),lg=k=>L.map(r=>Math.log(r[k])),cyc=k=>{const v=lg(k),t=hp(v,lam);return{v,t,c:v.map((x,i)=>x-t[i])}},Y=cyc(1),C=cyc(2),I=cyc(3);
    const sY=sdA(Y.c),sC=sdA(C.c),sI=sdA(I.c),g=(Math.log(L[L.length-1][1])-Math.log(L[0][1]))/(yr[yr.length-1]-yr[0]);
    $("cy-res").innerHTML=tilesM([["Crecimiento medio del PIB",pc(g)],["Volatilidad del PIB",pc(sY)],["Consumo: σ relativa",n2(sC/sY)],["Inversión: σ relativa",n2(sI/sY)],["Correlación C–PIB",n2(corA(C.c,Y.c))],["Correlación I–PIB",n2(corA(I.c,Y.c))]]);
    $("cy-p1").innerHTML=plotXY({xr:[yr[0],yr[yr.length-1]],yr:rangeOf([Y.v,Y.t]),series:[{pts:yr.map((x,i)=>[x,Y.v[i]]),col:"--ink",w:2},{pts:yr.map((x,i)=>[x,Y.t[i]]),col:"--exam",dash:"6 4"}],xl:"año",yl:"ln PIB y tendencia",label:"PIB y su tendencia de Hodrick-Prescott"});
    $("cy-p2").innerHTML=plotXY({xr:[yr[0],yr[yr.length-1]],yr:rangeOf([Y.c,C.c,I.c].map(a=>a.map(v=>100*v))),series:[{pts:yr.map((x,i)=>[x,100*Y.c[i]]),col:"--ink"},{pts:yr.map((x,i)=>[x,100*C.c[i]]),col:"--line"},{pts:yr.map((x,i)=>[x,100*I.c[i]]),col:"--exam"}],hlines:[{y:0}],xl:"año",yl:"% de desviación de la tendencia",label:"Componentes cíclicos"});
    $("cy-st").innerHTML=stp(1,"Cómo leerlo",`<p>El filtro de Hodrick-Prescott separa ln Yₜ en una tendencia τₜ y un ciclo ln Yₜ − τₜ, minimizando Σ(ln Yₜ − τₜ)² + λΣ(Δ²τₜ)². Hechos estilizados que se esperan: el consumo es <b>procíclico y menos volátil</b> que el PIB (σ relativa < 1, por suavizamiento), y la inversión es <b>procíclica y mucho más volátil</b> (σ relativa de 3 a 5). Por eso la inversión explica buena parte de las fluctuaciones aunque pese menos en el PIB.</p>`)};
  bindSeg("cy-l",v=>{lam=+v;run()});onInput(["cy-d"],run);run()};

// ---------- Unidad 2: ciclo de vida, renta permanente y Hall
SIMS.rp=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("rp-v","Teoría",[["cv","Ciclo de vida"],["rp","Renta permanente"],["hall","Paseo aleatorio de Hall"]],"cv")}</div><div class="ctr" id="rp-c"></div><div class="res" id="rp-res"></div><div id="rp-pl"></div><div id="rp-st"></div>`;
  let v="cv";
  const build=()=>{const C={cv:[["rp-w","Años de trabajo (desde los 20)",10,55,1,42],["rp-T","Edad al morir",60,100,1,85],["rp-g","Pendiente del salario",0,0.1,0.005,0.05]],
      rp:[["rp-d","Tamaño del choque de ingreso",-50,50,1,20],["rp-N","Años de vida restantes N",2,80,1,40],["rp-r","Tasa de interés r",0.005,0.15,0.005,0.03],["rp-c1","PMgC keynesiana",0.1,1,0.01,0.8]],
      hall:[["rp-s","Desviación de los choques",1,20,0.5,5],["rp-rho","Persistencia del ingreso transitorio",0,0.95,0.05,0.5]]}[v];
    $("rp-c").innerHTML=C.map(c=>ctl(...c)).join("");bindCtl(C.map(c=>c[0]),run);run()};
  const run=()=>{
    if(v==="cv"){const W=Math.round(V("rp-w")),T=Math.round(V("rp-T")),g=V("rp-g"),ages=[],y=[],c=[],a=[];if(20+W>=T){$("rp-res").innerHTML=err("la jubilación debe llegar antes de la muerte.");return}
      for(let e=20;e<T;e++){ages.push(e);const t=e-20;y.push(t<W?100*(1+g*t-g*t*t/(2*W)):0)}const Ctot=y.reduce((s,x)=>s+x,0)/y.length;let A=0;y.forEach(x=>{c.push(Ctot);A+=x-Ctot;a.push(A)});
      $("rp-res").innerHTML=tilesM([["Consumo anual (constante)",n2(Ctot)],["Riqueza máxima",n2(Math.max(...a))],["Edad de máxima riqueza",ages[a.indexOf(Math.max(...a))]],["Años de jubilación",T-20-W]]);
      $("rp-pl").innerHTML=legend([["--ink","Ingreso"],["--line","Consumo"],["--exam","Riqueza acumulada ÷ 10"]])+plotXY({xr:[20,T],yr:rangeOf([y,c,a.map(x=>x/10)]),series:[{pts:ages.map((e,i)=>[e,y[i]]),col:"--ink"},{pts:ages.map((e,i)=>[e,c[i]]),col:"--line"},{pts:ages.map((e,i)=>[e,a[i]/10]),col:"--exam",dash:"6 4"}],hlines:[{y:0}],xl:"edad",yl:"unidades por año",label:"Ciclo de vida"});
      $("rp-st").innerHTML=stp(1,"Modigliani",`<p>Con r = 0 y sin herencias, el consumo constante es el ingreso de toda la vida repartido entre los años que quedan: C = (Σ Yₜ)/(T − 20) = ${n2(Ctot)}. Se ahorra en la madurez (ingreso > consumo) y se desahorra en la jubilación. Implicaciones: la tasa de ahorro agregada depende de la estructura de edades y del crecimiento; un sistema de pensiones de reparto reduce el ahorro privado.</p>`)}
    else if(v==="rp"){const d=V("rp-d"),N=Math.round(V("rp-N")),r=V("rp-r"),c1=V("rp-c1"),an=r/((1+r)*(1-Math.pow(1+r,-N))),dT=d*an,dP=d,dK=c1*d,ts=[...Array(12)].map((_,i)=>i);
      $("rp-res").innerHTML=tilesM([["ΔC, choque transitorio (Friedman)",n2(dT),"okt"],["ΔC, choque permanente",n2(dP)],["ΔC keynesiana (cualquier choque)",n2(dK)],["Factor de anualidad",n4(an)]]);
      $("rp-pl").innerHTML=legend([["--ink","Ingreso con choque transitorio"],["--line","Consumo según renta permanente"],["--exam","Consumo keynesiano"]])+plotXY({xr:[0,11],yr:rangeOf([[100,100+d,100+dK,100+dT]]),series:[{pts:ts.map(t=>[t,t===2?100+d:100]),col:"--ink"},{pts:ts.map(t=>[t,t>=2?100+dT:100]),col:"--line"},{pts:ts.map(t=>[t,t===2?100+dK:100]),col:"--exam",dash:"6 4"}],xl:"período",yl:"nivel",label:"Choque transitorio"});
      $("rp-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">Riqueza adicional por un choque transitorio de ${fm(d)}: ${fm(d)} (llega hoy)<br>Consumo permanente: ΔC = Δ·r/[(1 + r)(1 − (1 + r)<sup>−N</sup>)] = ${fm(d)} × ${n4(an)} = <b>${n2(dT)}</b> por año, durante ${N} años<br>Choque permanente: el ingreso sube ${fm(d)} cada año ⟹ ΔC = ${fm(d)}</div><p>La hipótesis del ingreso permanente explica por qué la PMgC de corto plazo es baja frente a la de largo plazo, y por qué un bono único o un recorte temporal de impuestos mueve poco el consumo, salvo en hogares con restricciones de liquidez.</p>`)}
    else{const s=V("rp-s"),rho=V("rp-rho"),R=rng1(42),T=80,Yp=[],Y=[],Cp=[],Ck=[];let p=100,e=0;
      let cp=100;for(let t=0;t<T;t++){const perm=0.4*s*gauss(R),eps=s*gauss(R);p+=perm;e=rho*e+eps;cp+=perm+eps*0.03/(1.03-rho);Yp.push(p);Y.push(p+e);Ck.push(0.9*(p+e));Cp.push(cp)}
      const reg=(C)=>{const dC=[],dY=[];for(let t=2;t<T;t++){dC.push(C[t]-C[t-1]);dY.push(Y[t-1]-Y[t-2])}const m1=meanA(dC),m2=meanA(dY);let a=0,b=0;dC.forEach((x,i)=>{a+=(x-m1)*(dY[i]-m2);b+=(dY[i]-m2)**2});return a/b};
      $("rp-res").innerHTML=tilesM([["β de ΔCₜ sobre ΔYₜ₋₁: renta permanente",n4(reg(Cp)),"okt"],["β de ΔCₜ sobre ΔYₜ₋₁: keynesiano",n4(reg(Ck)),"badt"],["σ(ΔC)/σ(ΔY) renta permanente",n2(sdA(Cp.slice(1).map((x,i)=>x-Cp[i]))/sdA(Y.slice(1).map((x,i)=>x-Y[i])))]]);
      $("rp-pl").innerHTML=legend([["--ink","Ingreso"],["--line","Consumo (renta permanente)"],["--exam","Consumo keynesiano"]])+plotXY({xr:[0,T-1],yr:rangeOf([Y,Cp,Ck]),series:[{pts:Y.map((x,i)=>[i,x]),col:"--ink",w:1.5},{pts:Cp.map((x,i)=>[i,x]),col:"--line"},{pts:Ck.map((x,i)=>[i,x]),col:"--exam",dash:"6 4"}],xl:"período",yl:"nivel",label:"Paseo aleatorio de Hall"});
      $("rp-st").innerHTML=stp(1,"Hall (1978)",`<p>Con expectativas racionales y utilidad cuadrática (β(1 + r) = 1), la ecuación de Euler da Eₜ[Cₜ₊₁] = Cₜ: el consumo es un <b>paseo aleatorio</b>, Cₜ₊₁ = Cₜ + εₜ₊₁, y solo cambia por noticias sobre el ingreso permanente. Prueba empírica: regresar ΔCₜ sobre información pasada (ΔYₜ₋₁); el coeficiente debería ser cero. En los datos suele ser positivo (<b>exceso de sensibilidad</b>, Flavin 1981), lo que se atribuye a restricciones de liquidez o consumidores «regla de dedo» (Campbell y Mankiw).</p>`)}};
  bindSeg("rp-v",x=>{v=x;build()});build()};

// ---------- CCAPM
SIMS.ccapm=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("cc-b","Factor de descuento β",0.9,0.999,0.001,0.97)}${ctl("cc-t","Aversión al riesgo θ (CRRA)",0.5,50,0.5,2)}${ctl("cc-p","Probabilidad del estado bueno",0.05,0.95,0.05,0.5)}${ctl("cc-g1","Crecimiento del consumo, estado bueno",0.95,1.1,0.005,1.04)}${ctl("cc-g2","Crecimiento del consumo, estado malo",0.9,1.05,0.005,0.98)}${ctl("cc-x1","Pago del activo riesgoso, estado bueno",0.5,2,0.01,1.2)}${ctl("cc-x2","Pago del activo riesgoso, estado malo",0.5,2,0.01,0.9)}${ctl("cc-ep","Prima observada a explicar (%)",0.5,10,0.1,6)}</div><div class="res" id="cc-res"></div><div id="cc-st"></div>`;
  const run=()=>{const b=V("cc-b"),th=V("cc-t"),p=V("cc-p"),g=[V("cc-g1"),V("cc-g2")],x=[V("cc-x1"),V("cc-x2")],P=[p,1-p];
    const calc=th=>{const m=g.map(v=>b*Math.pow(v,-th)),Em=P[0]*m[0]+P[1]*m[1],Rf=1/Em,pr=P[0]*m[0]*x[0]+P[1]*m[1]*x[1],R=x.map(v=>v/pr),ER=P[0]*R[0]+P[1]*R[1];return{m,Em,Rf,pr,R,ER,prem:ER-Rf}};
    const C=calc(th),covmR=P[0]*(C.m[0]-C.Em)*(C.R[0]-C.ER)+P[1]*(C.m[1]-C.Em)*(C.R[1]-C.ER),tgt=V("cc-ep")/100;
    let need=NaN;if(calc(500).prem>tgt&&calc(0).prem<tgt)need=bisect(t=>calc(t).prem-tgt,0,500);
    $("cc-res").innerHTML=tilesM([["Tasa libre de riesgo",pc(C.Rf-1)],["Precio del activo riesgoso",n4(C.pr)],["Rendimiento esperado",pc(C.ER-1)],["Prima de riesgo",pc(C.prem),C.prem>0?"okt":""],["θ necesario para la prima observada",isFinite(need)?n2(need):"fuera de rango",isFinite(need)&&need>10?"badt":""]]);
    $("cc-st").innerHTML=stp(1,"Factor de descuento estocástico",`<div class="eq al">Euler: u′(Cₜ) pₜ = β Eₜ[u′(Cₜ₊₁) xₜ₊₁] ⟹ p = E[m x], con m = β(Cₜ₊₁/Cₜ)<sup>−θ</sup><br>m<sub>bueno</sub> = ${fm(b)}·${fm(g[0])}<sup>−${fm(th)}</sup> = ${n4(C.m[0])} · m<sub>malo</sub> = ${n4(C.m[1])} · E[m] = ${n4(C.Em)}<br>1 + r<sub>f</sub> = 1/E[m] = ${n4(C.Rf)} · p = Σπₛmₛxₛ = ${n4(C.pr)}<br>Prima: E[R] − R<sub>f</sub> = −R<sub>f</sub>·Cov(m, R) = −${n4(C.Rf)}·(${n4(covmR)}) = <b>${pc(C.prem)}</b></div>`)+
      stp(2,"Lectura",`<p>Un activo que paga más cuando el consumo es alto (cuando la utilidad marginal es baja) es riesgoso y debe ofrecer prima. El <b>acertijo de la prima de riesgo</b> (Mehra y Prescott, 1985): como el consumo agregado varía poco, se necesita una aversión al riesgo enorme para explicar primas accionarias de alrededor de 6 %; aquí harían falta θ ≈ ${isFinite(need)?n2(need):"—"}. Además, un θ alto implica una tasa libre de riesgo demasiado alta (acertijo de la tasa libre de riesgo).</p>`)};
  bindCtl(["cc-b","cc-t","cc-p","cc-g1","cc-g2","cc-x1","cc-x2","cc-ep"],run);run()};

// ---------- Acelerador y restricciones de liquidez
SIMS.acel=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("ac-v","Modelo",[["acel","Acelerador"],["liq","Restricciones de liquidez"]],"acel")}</div><div class="ctr" id="ac-c"></div><div class="res" id="ac-res"></div><div id="ac-pl"></div><div id="ac-st"></div>`;
  let v="acel";
  const build=()=>{const C=v==="acel"?[["ac-v2","Relación capital-producto v",0.5,6,0.1,3],["ac-d","Depreciación δ",0,0.2,0.01,0.06],["ac-a","Amplitud del ciclo del PIB (%)",0.5,10,0.5,2]]:[["ac-is","Inversión deseada I* (q de Tobin)",10,300,5,100],["ac-B","Crédito disponible B",0,200,5,20]];
    $("ac-c").innerHTML=C.map(c=>ctl(...c)).join("");bindCtl(C.map(c=>c[0]),run);run()};
  const run=()=>{if(v==="acel"){const vv=V("ac-v2"),d=V("ac-d"),A=V("ac-a")/100,T=40,Y=[],I=[];for(let t=0;t<=T;t++)Y.push(100*Math.pow(1.02,t)*(1+A*Math.sin(2*Math.PI*t/10)));
      for(let t=1;t<=T;t++)I.push(vv*Y[t]-(1-d)*vv*Y[t-1]);const gY=[],gI=[];for(let t=2;t<=T;t++){gY.push(Y[t]/Y[t-1]-1);gI.push(I[t-1]/I[t-2]-1)}
      $("ac-res").innerHTML=tilesM([["σ del crecimiento del PIB",pc(sdA(gY))],["σ del crecimiento de la inversión",pc(sdA(gI))],["Volatilidad relativa I/Y",n2(sdA(gI)/sdA(gY)),"okt"],["Inversión media / PIB",pc(meanA(I)/meanA(Y.slice(1)))]]);
      $("ac-pl").innerHTML=legend([["--ink","Crecimiento del PIB"],["--exam","Crecimiento de la inversión"]])+plotXY({xr:[2,T],yr:rangeOf([gY.map(x=>100*x),gI.map(x=>100*x)]),series:[{pts:gY.map((x,i)=>[i+2,100*x]),col:"--ink"},{pts:gI.map((x,i)=>[i+2,100*x]),col:"--exam"}],hlines:[{y:0}],xl:"período",yl:"% anual",label:"Acelerador"});
      $("ac-st").innerHTML=stp(1,"Acelerador flexible",`<div class="eq al">K*ₜ = v·Yₜ ⟹ Iₜ = K*ₜ − (1 − δ)K*ₜ₋₁ = v(Yₜ − Yₜ₋₁) + δvYₜ₋₁</div><p>La inversión depende del <b>cambio</b> del producto, no de su nivel: pequeñas variaciones del crecimiento del PIB generan grandes oscilaciones de la inversión. Combinado con el multiplicador produce ciclos (Samuelson, 1939). Su debilidad: ignora el costo de uso del capital (r + δ) y supone ajuste instantáneo.</p>`)}
    else{const Is=V("ac-is"),B=V("ac-B"),cf=[...Array(81)].map((_,i)=>i*Is*2/80),inv=cf.map(c=>Math.min(Is,c+B)),kink=Math.max(0,Is-B);
      $("ac-res").innerHTML=tilesM([["Flujo de caja a partir del cual no hay restricción",n2(kink),"okt"],["Sensibilidad inversión–flujo de caja (restringida)","1"],["Sensibilidad (no restringida)","0"]]);
      $("ac-pl").innerHTML=plotXY({xr:[0,2*Is],yr:[0,Is*1.25],series:[{pts:cf.map((c,i)=>[c,inv[i]]),col:"--line"},{f:()=>Is,col:"--muted",dash:"6 4",w:1.5}],vlines:[{x:kink,col:"--exam"}],xl:"flujo de caja interno",yl:"inversión",label:"Inversión con restricción de liquidez"});
      $("ac-st").innerHTML=stp(1,"Restricciones de liquidez",`<div class="eq al">I = min{I*, flujo de caja + B}</div><p>Si la empresa no puede endeudarse libremente (información asimétrica entre la empresa y el banco), su inversión depende de sus recursos internos y no solo de la q de Tobin o del costo de uso. Fazzari, Hubbard y Petersen (1988) encontraron mayor sensibilidad de la inversión al flujo de caja en empresas pequeñas, que no pagan dividendos. Un auge (más ventas, más flujo de caja) relaja la restricción y amplifica el ciclo: es un acelerador financiero.</p>`)}};
  bindSeg("ac-v",x=>{v=x;build()});build()};

// ---------- Unidad 3: equivalencia ricardiana y deuda
SIMS.ric=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ri-y","Ingreso Y₁ = Y₂",50,300,5,100)}${ctl("ri-g","Gasto G₁ = G₂",0,100,1,20)}${ctl("ri-r","Tasa de interés r",0,0.2,0.005,0.05)}${ctl("ri-d","Recorte de impuestos hoy ΔT",0,40,1,10)}${ctl("ri-l","Fracción de hogares con restricción de liquidez",0,1,0.05,0)}</div><div class="res" id="ri-res"></div><div id="ri-st"></div>`;
  const run=()=>{const Y=V("ri-y"),G=V("ri-g"),r=V("ri-r"),d=V("ri-d"),lam=V("ri-l"),T1=G-d,T2=G+(1+r)*d,W0=(Y-G)+(Y-G)/(1+r),W1=(Y-T1)+(Y-T2)/(1+r),cR=W1*(1+r)/(2+r),c0=W0*(1+r)/(2+r),cL0=Y-G,cL1=Y-T1,C0=(1-lam)*c0+lam*Math.min(c0,cL0),C1=(1-lam)*cR+lam*Math.min(Math.max(cR,0),cL1);
    $("ri-res").innerHTML=tilesM([["Deuda emitida hoy",n2(d)],["Impuesto futuro T₂",n2(T2)],["Riqueza del hogar antes / después",n2(W0)+" / "+n2(W1)],["C₁ agregado antes",n2(C0)],["C₁ agregado después",n2(C1),Math.abs(C1-C0)<1e-9?"okt":"badt"],["Ahorro privado adicional",n2((Y-T1-C1)-(Y-G-C0))]]);
    $("ri-st").innerHTML=stp(1,"Restricción intertemporal del gobierno",`<div class="eq al">G₁ + G₂/(1 + r) = T₁ + T₂/(1 + r) ⟹ si T₁ baja ${fm(d)}, T₂ debe subir (1 + r)·${fm(d)} = ${n2((1+r)*d)}<br>Valor presente de los impuestos del hogar: sin cambio (${n2(G+G/(1+r))})</div>`)+
      stp(2,"Equivalencia ricardiana (Barro, 1974)",`<p>Los hogares ricardianos saben que el recorte de hoy se paga mañana: su riqueza no cambia y <b>ahorran todo el recorte</b> para pagar el impuesto futuro. El ahorro privado sube lo mismo que baja el ahorro público y el ahorro nacional no cambia. ${lam>0?`Con ${pc(lam,0)} de hogares sin acceso al crédito (que querían consumir más de lo que su ingreso disponible permite), el recorte sí eleva el consumo: la equivalencia falla.`:"Mueve la fracción de hogares con restricción de liquidez para ver cuándo falla."} Otras razones: horizontes finitos sin altruismo intergeneracional, impuestos distorsionantes y miopía.</p>`)};
  bindCtl(["ri-y","ri-g","ri-r","ri-d","ri-l"],run);run()};

SIMS.deuda=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("de-b","Deuda inicial (% del PIB)",0,200,1,60)}${ctl("de-r","Tasa de interés real r (%)",-2,15,0.1,4)}${ctl("de-g","Crecimiento real g (%)",-3,10,0.1,3)}${ctl("de-s","Superávit primario (% del PIB)",-6,8,0.1,0.5)}${ctl("de-T","Años",5,60,1,30)}</div><div class="res" id="de-res"></div><div id="de-pl"></div><div id="de-st"></div>`;
  const run=()=>{const b0=V("de-b")/100,r=V("de-r")/100,g=V("de-g")/100,s=V("de-s")/100,T=Math.round(V("de-T")),k=(1+r)/(1+g),b=[b0];for(let t=0;t<T;t++)b.push(k*b[t]-s);
    const sStar=(r-g)/(1+g)*b0,bInf=r!==g?s*(1+g)/(r-g):NaN;
    $("de-res").innerHTML=tilesM([["Deuda al final",pc(b[T],1),b[T]>b0?"badt":"okt"],["Superávit que estabiliza la deuda",pc(sStar),""],["Diferencial r − g",pc(r-g)],["Deuda de largo plazo",r<g?pc(-bInf,1):"explota si s < s*"]]);
    $("de-pl").innerHTML=plotXY({xr:[0,T],yr:rangeOf([b.map(x=>100*x),[0]]),series:[{pts:b.map((x,t)=>[t,100*x]),col:"--line"}],hlines:[{y:100*b0}],xl:"años",yl:"deuda (% del PIB)",label:"Dinámica de la deuda"});
    $("de-st").innerHTML=stp(1,"Ecuación de la deuda",`<div class="eq al">bₜ₊₁ = [(1 + r)/(1 + g)]·bₜ − sₜ (b = deuda/PIB, s = superávit primario/PIB)<br>Para mantener b constante: s* = [(r − g)/(1 + g)]·b = [(${fm(V("de-r"))} − ${fm(V("de-g"))})/(1 + ${fm(g)})]·${fm(V("de-b"))} % = <b>${pc(sStar)}</b> del PIB</div><p>${r>g?"Con r > g la deuda crece sola por los intereses: hace falta un superávit primario para estabilizarla.":"Con r < g el crecimiento «licúa» la deuda: puede estabilizarse incluso con déficit primario."} La restricción presupuestaria intertemporal exige que el valor presente de los superávits primarios futuros iguale la deuda actual (sin juegos de Ponzi). La regla fiscal colombiana (Ley 1473 de 2011, reformada en 2021) fija un ancla de deuda y una meta de balance primario.</p>`)};
  bindCtl(["de-b","de-r","de-g","de-s","de-T"],run);run()};

// ---------- Unidad 4: equilibrio de un período y economía de dos períodos
function eq1({z,K,G,al,ga,h}){const MP=N=>(1-al)*z*Math.pow(K,al)*Math.pow(N,-al),Y=N=>z*Math.pow(K,al)*Math.pow(N,1-al),f=N=>MP(N)/(Y(N)-G)-ga/(h-N);
  const lo=G>0&&Y(1e-9)<G?bisect(N=>Y(N)-G,1e-9,h):1e-9;const N=bisect(f,Math.max(1e-6,lo*1.000001),h-1e-9);return{N,Y:Y(N),C:Y(N)-G,w:MP(N),l:h-N,ok:Y(h*0.999)>G}}
SIMS.eq1=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("e1-z","Productividad total z",0.5,2,0.05,1)}${ctl("e1-G","Gasto público G",0,0.6,0.01,0.1)}${ctl("e1-g","Preferencia por el ocio γ",0.2,3,0.1,1)}</div><p class="hint">Base de comparación: z = 1, G = 0,1 (línea punteada). K = 1, α = 0,3, h = 1 hora disponible, utilidad ln C + γ ln l.</p><div class="res" id="e1-res"></div>${legend([["--line","Frontera de posibilidades (actual)"],["--muted","Frontera base",1],["--exam","Curva de indiferencia en el óptimo"]])}<div id="e1-pl"></div><div id="e1-st"></div>`;
  const run=()=>{const P={z:V("e1-z"),K:1,G:V("e1-G"),al:0.3,ga:V("e1-g"),h:1},B=eq1({...P,z:1,G:0.1}),E=eq1(P);if(!E.ok){$("e1-res").innerHTML=err("G es mayor que lo que la economía puede producir.");return}
    const d=(a,b)=>`${n4(b)} <small>(${b>=a?"+":""}${n4(b-a)})</small>`,u=Math.log(E.C)+P.ga*Math.log(E.l);
    $("e1-res").innerHTML=tilesM([["Empleo N",d(B.N,E.N)],["Producto Y",d(B.Y,E.Y)],["Consumo C",d(B.C,E.C)],["Salario real w",d(B.w,E.w)],["Ocio l",d(B.l,E.l)]]);
    const ppf=(z,G)=>l=>z*Math.pow(1-l,0.7)-G;
    $("e1-pl").innerHTML=plotXY({xr:[0,1],yr:[0,Math.max(1.2,P.z)*1.05],series:[{f:ppf(P.z,P.G),col:"--line"},{f:ppf(1,0.1),col:"--muted",dash:"5 4",w:1.5},{f:l=>l>0.02?Math.exp(u)/Math.pow(l,P.ga):NaN,col:"--exam",w:1.8}],points:[{x:E.l,y:E.C,col:"--line",label:"óptimo"}],xl:"ocio l",yl:"consumo C",label:"Equilibrio competitivo de un período"});
    $("e1-st").innerHTML=stp(1,"Condiciones de equilibrio",`<div class="eq al">Firma: w = PMgN = (1 − α)zK<sup>α</sup>N<sup>−α</sup> · Hogar: TMS ocio-consumo = γC/l = w · Gobierno: T = G · Mercado de bienes: Y = C + G<br>En el óptimo, la pendiente de la frontera (−PMgN) iguala la de la curva de indiferencia: el equilibrio competitivo es eficiente (Pareto).</div>`)+
      stp(2,"Estática comparativa",`<p><b>Aumento de G:</b> desplaza la frontera hacia abajo; por el efecto ingreso el hogar consume menos y trabaja más: N y Y suben, C baja (expulsión), w baja. <b>Aumento de z:</b> la frontera se vuelve más empinada: efecto sustitución (trabajar más) y efecto ingreso (más ocio) se compensan en el empleo; C, Y y w suben. Prueba los dos choques.</p>`)};
  bindCtl(["e1-z","e1-G","e1-g"],run);run()};

SIMS.dosp=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("dp-s","Choque",[["g1","Gasto transitorio (G₁ sube)"],["gp","Gasto permanente (G₁ y G₂ suben)"],["y2","Mejor producto futuro (Y₂ sube)"],["y1","Mejor producto actual (Y₁ sube)"]],"g1")}</div>
  <div class="ctr">${ctl("dp-y","Producto Y₁ = Y₂ base",50,300,5,100)}${ctl("dp-g","Gasto G base",0,60,1,20)}${ctl("dp-b","Factor de descuento β",0.8,0.999,0.001,0.96)}${ctl("dp-d","Tamaño del choque",1,40,1,10)}</div><div class="res" id="dp-res"></div>${legend([["--muted","Ahorro nacional deseado (base)",1],["--line","Después del choque"]])}<div id="dp-pl"></div><div id="dp-st"></div>`;
  let s="g1";
  const run=()=>{const Y=V("dp-y"),G=V("dp-g"),b=V("dp-b"),d=V("dp-d"),base={y1:Y,y2:Y,g1:G,g2:G},nw={...base};
    if(s==="g1")nw.g1+=d;else if(s==="gp"){nw.g1+=d;nw.g2+=d}else if(s==="y2")nw.y2+=d;else nw.y1+=d;
    const solve=e=>{const c1=e.y1-e.g1,c2=e.y2-e.g2;return{r:c2/(b*c1)-1,c1,c2}},S=e=>r=>{const W=(e.y1-e.g1)+(e.y2-e.g2)/(1+r);return(e.y1-e.g1)-W/(1+b)},A=solve(base),N=solve(nw);
    if(!(A.c1>0&&A.c2>0&&N.c1>0&&N.c2>0)){$("dp-res").innerHTML=err("el gasto no puede superar el producto.");return}
    $("dp-res").innerHTML=tilesM([["r de equilibrio base",pc(A.r)],["r después del choque",pc(N.r),N.r>A.r?"badt":"okt"],["C₁ base / nuevo",n2(A.c1)+" / "+n2(N.c1)],["C₂ base / nuevo",n2(A.c2)+" / "+n2(N.c2)]]);
    const rr=[Math.min(A.r,N.r)-0.15,Math.max(A.r,N.r)+0.15],Sb=S(base),Sn=S(nw);
    const sx=[rr[0],rr[1]].flatMap(r=>[Sb(r),Sn(r)]),xm=Math.max(...sx.map(Math.abs))*1.1||1;$("dp-pl").innerHTML=plotXY({xr:[-xm,xm],yr:[100*rr[0],100*rr[1]],series:[{pts:[...Array(81)].map((_,i)=>{const r=rr[0]+(rr[1]-rr[0])*i/80;return[Sb(r),100*r]}),col:"--muted",dash:"5 4"},{pts:[...Array(81)].map((_,i)=>{const r=rr[0]+(rr[1]-rr[0])*i/80;return[Sn(r),100*r]}),col:"--line"}],vlines:[{x:0}],points:[{x:0,y:100*A.r,col:"--muted"},{x:0,y:100*N.r,col:"--line",label:"r nuevo"}],xl:"ahorro nacional deseado",yl:"r (%)",label:"Mercado de crédito en una economía cerrada"});
    const txt={g1:"Un aumento transitorio de G reduce los recursos de hoy más que los de mañana: los hogares quieren desahorrar (o pedir prestado) para suavizar, pero en una economía cerrada sin inversión el ahorro agregado debe ser cero, así que r sube hasta que nadie quiera pedir prestado.",gp:"Si el aumento es permanente, los recursos caen en ambos períodos por igual y el consumo cae en ambos: no hay deseo de suavizar y r casi no cambia. Por eso un gasto transitorio sube más la tasa de interés que uno permanente.",y2:"Mejor producto futuro (por ejemplo, un descubrimiento petrolero que producirá mañana): los hogares quieren consumir más hoy pidiendo prestado; r sube para que el mercado se equilibre.",y1:"Más producto hoy (cosecha excepcional): los hogares quieren ahorrar parte para mañana; r baja."};
    $("dp-st").innerHTML=stp(1,"Equilibrio",`<div class="eq al">Con utilidad logarítmica y C = Y − G en cada período: 1 + r = C₂/(βC₁) = (Y₂ − G₂)/[β(Y₁ − G₁)]<br>Base: 1 + r = ${n2(A.c2)}/(${fm(b)}·${n2(A.c1)}) = ${n4(1+A.r)} · Nuevo: ${n4(1+N.r)}</div><p>${txt[s]}</p>`)};
  bindSeg("dp-s",x=>{s=x;run()});bindCtl(["dp-y","dp-g","dp-b","dp-d"],run);run()};

// ---------- Unidad 5: crecimiento
SIMS.reg70=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("r7-g1","Crecimiento per cápita país A (%)",-2,10,0.1,1.5)}${ctl("r7-g2","Crecimiento per cápita país B (%)",-2,10,0.1,4)}${ctl("r7-y2","Ingreso inicial de B (A = 100)",5,200,1,20)}${ctl("r7-T","Años",10,150,1,100)}</div><div class="res" id="r7-res"></div>${legend([["--ink","País A"],["--line","País B"]])}<div id="r7-pl"></div><div id="r7-st"></div>`;
  const run=()=>{const g1=V("r7-g1")/100,g2=V("r7-g2")/100,y2=V("r7-y2"),T=Math.round(V("r7-T")),A=[...Array(T+1)].map((_,t)=>100*Math.pow(1+g1,t)),B=[...Array(T+1)].map((_,t)=>y2*Math.pow(1+g2,t)),catch_=g2>g1?Math.log(100/y2)/Math.log((1+g2)/(1+g1)):NaN;
    $("r7-res").innerHTML=tilesM([["Duplicación A (regla del 70)",g1>0?n2(70/(100*g1))+" años":"no se duplica"],["Duplicación B",g2>0?n2(70/(100*g2))+" años":"no se duplica"],["B alcanza a A en",isFinite(catch_)&&catch_>0?n2(catch_)+" años":"no lo alcanza"],[`Ingreso tras ${T} años A / B`,n2(A[T])+" / "+n2(B[T])]]);
    $("r7-pl").innerHTML=plotXY({xr:[0,T],yr:rangeOf([A.map(Math.log),B.map(Math.log)]),series:[{pts:A.map((v,t)=>[t,Math.log(v)]),col:"--ink"},{pts:B.map((v,t)=>[t,Math.log(v)]),col:"--line"}],xl:"años",yl:"ln ingreso per cápita",label:"Crecimiento compuesto"});
    $("r7-st").innerHTML=stp(1,"Por qué importa el crecimiento",`<p>En escala logarítmica un crecimiento constante es una recta. Diferencias pequeñas en la tasa se acumulan: con la regla del 70, el tiempo de duplicación es 70/g. Hechos estilizados de Kaldor: el producto por trabajador crece a tasa casi constante, el capital por trabajador también, la razón capital-producto y la tasa de interés son estables, y las participaciones del capital y el trabajo en el ingreso también.</p>`)};
  bindCtl(["r7-g1","r7-g2","r7-y2","r7-T"],run);run()};

SIMS.solow=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("so-v","Vista",[["dia","Diagrama de Solow"],["tr","Transición tras un cambio en s"]],"dia")}</div>
  <div class="ctr">${ctl("so-s","Tasa de ahorro s",0.02,0.8,0.01,0.25)}${ctl("so-s2","Nueva tasa de ahorro (transición)",0.02,0.8,0.01,0.35)}${ctl("so-a","Participación del capital α",0.1,0.8,0.01,0.33)}${ctl("so-n","Crecimiento de la población n",0,0.06,0.001,0.015)}${ctl("so-g","Progreso técnico g",0,0.06,0.001,0.02)}${ctl("so-d","Depreciación δ",0.01,0.15,0.005,0.05)}</div><div class="res" id="so-res"></div><div id="so-pl"></div><div id="so-st"></div>`;
  let v="dia";
  const run=()=>{const s=V("so-s"),s2=V("so-s2"),a=V("so-a"),n=V("so-n"),g=V("so-g"),d=V("so-d"),dep=n+g+d,ks=Math.pow(s/dep,1/(1-a)),ys=Math.pow(ks,a),kg=Math.pow(a/dep,1/(1-a)),beta=(1-a)*dep;
    $("so-res").innerHTML=tilesM([["k* (por trabajador efectivo)",n4(ks)],["y*",n4(ys)],["c* = (1 − s)y*",n4((1-s)*ys)],["Regla de oro: s = α",n2(a)+(Math.abs(s-a)<0.005?" (estás en ella)":s<a?" (ahorras de menos)":" (ahorras de más)")],["Velocidad de convergencia",pc(beta)],["Vida media de la brecha",n2(Math.log(2)/beta)+" años"]]);
    if(v==="dia"){const km=Math.max(ks,kg)*1.8;$("so-pl").innerHTML=legend([["--ink","y = k^α"],["--line","s·f(k)"],["--exam","(n + g + δ)k"]])+plotXY({xr:[0,km],yr:[0,Math.pow(km,a)*1.1],series:[{f:k=>Math.pow(k,a),col:"--ink",w:1.5},{f:k=>s*Math.pow(k,a),col:"--line"},{f:k=>dep*k,col:"--exam"}],vlines:[{x:ks}],points:[{x:ks,y:s*ys,col:"--line",label:"k*"}],xl:"k (capital por trabajador efectivo)",yl:"",label:"Diagrama de Solow"})}
    else{const T=100,k=[ks],ly=[];for(let t=0;t<T;t++)k.push(k[t]+s2*Math.pow(k[t],a)-dep*k[t]);k.forEach((kk,t)=>ly.push(Math.log(Math.pow(kk,a))+g*t));const base=[...Array(T+1)].map((_,t)=>Math.log(ys)+g*t),gr=ly.slice(1).map((x,t)=>100*(x-ly[t]+n*0)),ks2=Math.pow(s2/dep,1/(1-a));
      $("so-pl").innerHTML=legend([["--muted","Sin cambio",1],["--line","Con la nueva tasa de ahorro"]])+plotXY({xr:[0,T],yr:rangeOf([ly,base]),series:[{pts:base.map((x,t)=>[t,x]),col:"--muted",dash:"5 4"},{pts:ly.map((x,t)=>[t,x]),col:"--line"}],xl:"años",yl:"ln producto por trabajador",label:"Transición"})+plotXY({xr:[1,T],yr:rangeOf([gr]),series:[{pts:gr.map((x,t)=>[t+1,x]),col:"--line"}],hlines:[{y:100*g}],xl:"años",yl:"crecimiento por trabajador (%)",H:200,label:"Tasa de crecimiento"})+`<p class="hint">Nuevo k* = ${n4(ks2)}: el crecimiento sube transitoriamente y vuelve a g = ${pc(g)}; el nivel queda permanentemente más alto.</p>`}
    $("so-st").innerHTML=stp(1,"Ecuación fundamental",`<div class="eq al">k̇ = s·k<sup>α</sup> − (n + g + δ)k ⟹ k* = [s/(n + g + δ)]<sup>1/(1−α)</sup> = [${fm(s)}/${n4(dep)}]<sup>${n4(1/(1-a))}</sup> = <b>${n4(ks)}</b><br>Regla de oro: f′(k) = n + g + δ ⟹ k<sub>oro</sub> = [α/(n + g + δ)]<sup>1/(1−α)</sup> = ${n4(kg)}</div><p>En estado estacionario el producto por trabajador crece a g (progreso técnico exógeno) y el total a n + g. Más ahorro sube el <b>nivel</b>, no la tasa de crecimiento de largo plazo. La convergencia es condicional: economías con iguales parámetros convergen al mismo k*.</p>`)};
  bindSeg("so-v",x=>{v=x;run()});bindCtl(["so-s","so-s2","so-a","so-n","so-g","so-d"],run);run()};

SIMS.mrw=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("mw-v","Modelo",[["mrw","Mankiw, Romer y Weil"],["trap","Trampa de pobreza"]],"mrw")}</div><div class="ctr" id="mw-c"></div><div class="res" id="mw-res"></div><div id="mw-pl"></div><div id="mw-st"></div>`;
  let v="mrw";
  const build=()=>{const C=v==="mrw"?[["mw-k1","Ahorro en capital físico, país rico",0.05,0.4,0.01,0.25],["mw-h1","Inversión en capital humano, país rico",0.01,0.2,0.005,0.12],["mw-n1","Crecimiento poblacional, país rico",0,0.05,0.001,0.01],["mw-k2","Ahorro en capital físico, país pobre",0.05,0.4,0.01,0.1],["mw-h2","Inversión en capital humano, país pobre",0.01,0.2,0.005,0.04],["mw-n2","Crecimiento poblacional, país pobre",0,0.05,0.001,0.03]]
      :[["mw-sl","Ahorro cuando el país es pobre",0.01,0.3,0.01,0.05],["mw-sh","Ahorro cuando el país es rico",0.05,0.5,0.01,0.3],["mw-k0","Umbral de capital",0.2,5,0.1,1.5],["mw-nd","n + δ",0.02,0.2,0.005,0.08]];
    $("mw-c").innerHTML=C.map(c=>ctl(...c)).join("");bindCtl(C.map(c=>c[0]),run);run()};
  const run=()=>{if(v==="mrw"){const a=1/3,b=1/3,gd=0.05,y=(sk,sh,n)=>Math.pow(Math.pow(sk,a)*Math.pow(sh,b)/Math.pow(n+gd,a+b),1/(1-a-b)),ys=(sk,n)=>Math.pow(sk/(n+gd),a/(1-a));
      const R=y(V("mw-k1"),V("mw-h1"),V("mw-n1")),P=y(V("mw-k2"),V("mw-h2"),V("mw-n2")),Rs=ys(V("mw-k1"),V("mw-n1")),Ps=ys(V("mw-k2"),V("mw-n2"));
      $("mw-res").innerHTML=tilesM([["y* rico / y* pobre con capital humano (MRW)",n2(R/P),"okt"],["Misma razón en Solow simple (α = 1/3)",n2(Rs/Ps)],["Exponente de sₖ en MRW",n2(a/(1-a-b))],["Exponente de sₖ en Solow",n2(a/(1-a))]]);
      $("mw-pl").innerHTML="";
      $("mw-st").innerHTML=stp(1,"Solow aumentado con capital humano",`<div class="eq al">Y = K<sup>α</sup>H<sup>β</sup>(AL)<sup>1−α−β</sup> ⟹ ln y* = ln A + gt + [α/(1 − α − β)] ln sₖ + [β/(1 − α − β)] ln sₕ − [(α + β)/(1 − α − β)] ln(n + g + δ)</div><p>Con α = β = 1/3, el ahorro y el crecimiento poblacional pesan mucho más que en Solow simple: diferencias razonables en sₖ, sₕ y n explican brechas de ingreso grandes entre países (MRW, 1992, explican cerca del 80 % de la variación entre países). La convergencia sigue siendo condicional y más lenta: (1 − α − β)(n + g + δ) ≈ 2 % anual.</p>`)}
    else{const sl=V("mw-sl"),sh=V("mw-sh"),k0=V("mw-k0"),nd=V("mw-nd"),a=0.4,s=k=>sl+(sh-sl)/(1+Math.exp(-(k-k0)/(0.15*k0))),f=k=>s(k)*Math.pow(k,a)-nd*k,km=Math.pow(sh/nd,1/(1-a))*1.3,roots=[];let prev=f(1e-4);
      for(let i=1;i<=2000;i++){const k=km*i/2000,c=f(k);if(prev*c<0)roots.push(bisect(f,km*(i-1)/2000,k));prev=c}
      const stab=roots.map(k=>f(k*0.98)>0&&f(k*1.02)<0);
      $("mw-res").innerHTML=tilesM([["Equilibrios encontrados",roots.length],...roots.map((k,i)=>[`k${i+1}`,n4(k)+(stab[i]?" (estable)":" (inestable, umbral)"),stab[i]?"okt":"badt"])]);
      $("mw-pl").innerHTML=legend([["--line","s(k)·f(k)"],["--exam","(n + δ)k"]])+plotXY({xr:[0,km],yr:[0,nd*km*1.1],series:[{f:k=>s(k)*Math.pow(k,a),col:"--line"},{f:k=>nd*k,col:"--exam"}],points:roots.map((k,i)=>({x:k,y:nd*k,col:stab[i]?"--line":"--bad"})),xl:"k",yl:"",label:"Trampa de pobreza"});
      $("mw-st").innerHTML=stp(1,"Equilibrios múltiples",`<p>Si el ahorro (o la productividad) depende del nivel de desarrollo, la curva de ahorro tiene forma de S y puede cortar a la de depreciación tres veces: dos equilibrios estables (uno pobre y uno rico) y uno inestable en medio, que funciona como umbral. Un país por debajo del umbral vuelve al equilibrio pobre aunque reciba ayudas pequeñas; un <b>gran empujón</b> que lo lleve por encima del umbral lo encamina al equilibrio rico (Rosenstein-Rodan, Sachs). Reduce el ahorro de los pobres o sube n + δ para ver desaparecer equilibrios.</p>`)}};
  bindSeg("mw-v",x=>{v=x;build()});build()};

SIMS.ak=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ak-s","Tasa de ahorro s",0.05,0.6,0.01,0.25)}${ctl("ak-A","Productividad A",0.1,1,0.01,0.4)}${ctl("ak-d","δ + n",0.01,0.2,0.005,0.06)}${ctl("ak-a","α en el modelo de Solow comparado",0.2,0.9,0.01,0.33)}</div><div class="res" id="ak-res"></div>${legend([["--line","Modelo AK"],["--exam","Solow sin progreso técnico (mismo k inicial)"]])}<div id="ak-pl"></div><div id="ak-st"></div>`;
  const run=()=>{const s=V("ak-s"),A=V("ak-A"),d=V("ak-d"),a=V("ak-a"),gAK=s*A-d,T=80;let k1=1,k2=1;const L1=[],L2=[];
    for(let t=0;t<=T;t++){L1.push(Math.log(A*k1));L2.push(Math.log(A*Math.pow(k2,a)));k1+=s*A*k1-d*k1;k2+=s*A*Math.pow(k2,a)-d*k2}
    $("ak-res").innerHTML=tilesM([["Crecimiento en AK: sA − (δ + n)",pc(gAK),gAK>0?"okt":"badt"],["Crecimiento de Solow en el año 80",pc(L2[T]-L2[T-1])],["¿Afecta s al crecimiento de largo plazo?","AK: sí · Solow: no"]]);
    $("ak-pl").innerHTML=plotXY({xr:[0,T],yr:rangeOf([L1,L2]),series:[{pts:L1.map((x,t)=>[t,x]),col:"--line"},{pts:L2.map((x,t)=>[t,x]),col:"--exam"}],xl:"años",yl:"ln y",label:"AK frente a Solow"});
    $("ak-st").innerHTML=stp(1,"Crecimiento endógeno",`<div class="eq al">Y = AK ⟹ k̇/k = sA − (δ + n): sin rendimientos decrecientes, la tasa de crecimiento es permanente y depende de s y de A</div><p>En Solow los rendimientos decrecientes del capital apagan el crecimiento si no hay progreso técnico. El modelo AK los elimina tomando el capital en sentido amplio (físico más humano). Fundamentos: externalidades del conocimiento (Romer, 1986: y = Ak<sup>α</sup>k̄<sup>1−α</sup>, en el agregado y = Ak), capital humano (Lucas, 1988), gasto público productivo (Barro, 1990). Implicaciones: las políticas que suben el ahorro o la productividad tienen efectos permanentes sobre el crecimiento y no hay convergencia.</p>`)};
  bindCtl(["ak-s","ak-A","ak-d","ak-a"],run);run()};

SIMS.contab=function(){
  $("sim").innerHTML=`<div class="calcf"><label for="ca-d">Períodos con crecimiento anual promedio (%) del PIB, del capital y del empleo. Los valores de ejemplo son <b>ilustrativos</b>; reemplázalos con datos de la Penn World Table o del DNP.<textarea id="ca-d" rows="5" style="width:100%;font-family:var(--f-mono)">periodo gY gK gL
1950-1980 5.0 4.6 2.8
1980-2000 3.0 3.5 2.6
2000-2019 4.0 4.2 2.2</textarea></label>${numIn("ca-a","Participación del capital α",0.4)}</div><div id="ca-o"></div>`;
  const run=()=>{const a=NV("ca-a"),rows=$("ca-d").value.trim().split(/\n+/).slice(1).map(r=>r.trim().split(/[\s;\t]+/)).filter(r=>r.length>=4&&r.slice(1,4).every(x=>isFinite(+x.replace(",","."))));
    if(!(a>0&&a<1)||!rows.length){$("ca-o").innerHTML=err("α entre 0 y 1 y al menos un período.");return}
    const R=rows.map(r=>{const[gY,gK,gL]=r.slice(1,4).map(x=>+x.replace(",","."));const cK=a*gK,cL=(1-a)*gL,tfp=gY-cK-cL;return{p:r[0],gY,cK,cL,tfp}});
    $("ca-o").innerHTML=`<div class="tbl"><table><tr><th>Período</th><th>Crecimiento del PIB</th><th>Aporte del capital αgK</th><th>Aporte del trabajo (1 − α)gL</th><th>PTF (residuo de Solow)</th><th>% explicado por la PTF</th></tr>${R.map(x=>`<tr><td>${x.p}</td><td>${n2(x.gY)}</td><td>${n2(x.cK)}</td><td>${n2(x.cL)}</td><td><b>${n2(x.tfp)}</b></td><td>${x.gY?fmt(100*x.tfp/x.gY,1)+" %":"—"}</td></tr>`).join("")}</table></div>`+
      plotXY({xr:[0,R.length+1],yr:rangeOf([R.flatMap(x=>[x.gY,x.cK,x.cL,x.tfp]),[0]]),series:[],points:R.flatMap((x,i)=>[{x:i+1-0.2,y:x.cK,col:"--line"},{x:i+1,y:x.cL,col:"--ink"},{x:i+1+0.2,y:x.tfp,col:"--exam",label:x.p}]),hlines:[{y:0}],xl:"período (capital, trabajo, PTF)",yl:"puntos porcentuales",H:220,label:"Contribuciones al crecimiento"})+
      stp(1,"Contabilidad del crecimiento",`<div class="eq al">Y = AK<sup>α</sup>L<sup>1−α</sup> ⟹ g<sub>Y</sub> = g<sub>A</sub> + α·g<sub>K</sub> + (1 − α)·g<sub>L</sub> ⟹ g<sub>A</sub> = g<sub>Y</sub> − ${fm(a)}·g<sub>K</sub> − ${fm(1-a)}·g<sub>L</sub></div><p>La productividad total de los factores (PTF) es un residuo: mide todo lo que no explican la acumulación de capital y trabajo (tecnología, eficiencia, instituciones, errores de medición). Enfoques alternativos agregan capital humano (calidad del trabajo) o usan la ecuación dual con precios de los factores. Para Colombia, los estudios encuentran que la mayor parte del crecimiento se explica por la acumulación de factores y que la PTF ha crecido poco.</p>`)};
  onInput(["ca-d","ca-a"],run);run()};

SIMS.ramsey=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ra-a","α",0.2,0.6,0.01,0.33)}${ctl("ra-d","δ",0.01,0.15,0.005,0.05)}${ctl("ra-n","n",0,0.04,0.001,0.01)}${ctl("ra-r","Tasa de descuento ρ",0.005,0.1,0.001,0.03)}${ctl("ra-r2","Nueva ρ (cambio de paciencia)",0.005,0.1,0.001,0.02)}${ctl("ra-t","θ (inversa de la elasticidad de sustitución)",0.5,5,0.1,2)}</div><div class="res" id="ra-res"></div>${legend([["--exam","k̇ = 0"],["--muted","ċ = 0 inicial",1],["--bad","ċ = 0 con la nueva ρ"],["--line","Senda de silla (nueva ρ)"]])}<div id="ra-pl"></div><div id="ra-st"></div>`;
  const run=()=>{const a=V("ra-a"),d=V("ra-d"),n=V("ra-n"),r1=V("ra-r"),r2=V("ra-r2"),th=V("ra-t"),f=k=>Math.pow(k,a),kss=r=>Math.pow(a/(d+r+n*0),1/(1-a)),cK=k=>f(k)-(n+d)*k;
    const k1=kss(r1),k2=kss(r2),c1=cK(k1),c2=cK(k2),kg=Math.pow(a/(n+d),1/(1-a));
    const path=(k0,c0,rho,T=300,dt=0.05)=>{let k=k0,c=c0;const P=[[k,c]];for(let i=0;i<T/dt;i++){const kd=f(k)-c-(n+d)*k,cd=c*(a*Math.pow(k,a-1)-d-rho)/th;k+=kd*dt;c+=cd*dt;if(i%10===0)P.push([k,c]);if(k<=0||c<=0||k>5*kg)break}return P};
    const shoot=(k0,rho,ks)=>{let lo=0,hi=f(k0)*1.5+0.5;for(let it=0;it<60;it++){const c0=(lo+hi)/2;let k=k0,c=c0,res=0;const dt=0.05;for(let i=0;i<8000;i++){const kd=f(k)-c-(n+d)*k,cd=c*(a*Math.pow(k,a-1)-d-rho)/th;k+=kd*dt;c+=cd*dt;
      if(k0<ks){if(k>ks){res=-1;break}if(kd<0){res=1;break}}else{if(k<ks){res=1;break}if(kd>0){res=-1;break}}if(!(k>0&&c>0)){res=k<=0?1:-1;break}}if(res>0)hi=c0;else lo=c0}return(lo+hi)/2};
    const km=Math.max(k1,k2,kg)*1.4,saddle=[];for(const k0 of [0.15,0.35,0.6,0.85,0.97].map(x=>x*k2).concat([1.03,1.3,1.6].map(x=>x*k2))){const c0=shoot(k0,r2,k2);saddle.push([k0,c0])}saddle.sort((x,y)=>x[0]-y[0]);
    const jumpC=shoot(k1,r2,k2);
    $("ra-res").innerHTML=tilesM([["k* inicial",n4(k1)],["c* inicial",n4(c1)],["k* con la nueva ρ",n4(k2),"okt"],["c* con la nueva ρ",n4(c2)],["Regla de oro k",n4(kg)],["Salto inicial de c",n4(jumpC-c1)]]);
    $("ra-pl").innerHTML=plotXY({xr:[0,km],yr:[0,Math.max(...[...Array(50)].map((_,i)=>cK(km*i/49)))*1.25],series:[{f:k=>cK(k),col:"--exam"},{pts:[[k1,0],[k1,10]],col:"--muted",dash:"5 4",w:1.5},{pts:[[k2,0],[k2,10]],col:"--bad",w:1.5},{pts:saddle,col:"--line",w:2.5}],points:[{x:k1,y:c1,col:"--muted",label:"E₀"},{x:k1,y:jumpC,col:"--line",label:"salto"},{x:k2,y:c2,col:"--line",label:"E₁"}],xl:"k",yl:"c",label:"Diagrama de fases de Ramsey"});
    $("ra-st").innerHTML=stp(1,"Sistema dinámico",`<div class="eq al">k̇ = f(k) − c − (n + δ)k · ċ/c = [f′(k) − δ − ρ]/θ (ecuación de Euler o de Keynes-Ramsey)<br>Estado estacionario: f′(k*) = δ + ρ ⟹ k* = [α/(δ + ρ)]<sup>1/(1−α)</sup> < k<sub>oro</sub> (regla de oro modificada)</div><p>El estado estacionario es un <b>punto de silla</b>: para cada k inicial hay un único c que lleva a él (senda de silla); las demás trayectorias violan la condición de transversalidad o agotan el capital. Si los hogares se vuelven más pacientes (ρ baja), k* sube: el consumo <b>salta hacia abajo</b> sobre la nueva senda de silla y luego crece junto con el capital. A diferencia de Solow, la tasa de ahorro es endógena y nunca hay sobreacumulación de capital.</p>`)};
  bindCtl(["ra-a","ra-d","ra-n","ra-r","ra-r2","ra-t"],run);run()};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "c-C0":"<b>Consumo autónomo</b>: lo que se consume aunque el ingreso disponible sea cero.","c-c1":"<b>Propensión marginal a consumir</b>: de cada peso adicional de ingreso disponible, la fracción que se consume (el resto se ahorra).","c-Y":"<b>Ingreso total</b> de los hogares.","c-T":"<b>Impuestos</b>: el consumo depende del ingreso disponible Y − T.",
 "i-Y1":"<b>Ingreso del período 1</b> (hoy).","i-Y2":"<b>Ingreso del período 2</b> (mañana). Con mercado de crédito, lo que importa es el valor presente de ambos.","i-r":"<b>Tasa de interés real</b>: el precio de consumir hoy en vez de mañana. Si r > ρ, conviene posponer consumo.","i-rho":"<b>Tasa de impaciencia</b>: cuánto descuenta el hogar el consumo futuro.","i-th":"<b>Aversión a la variación del consumo</b>: más alta, más quiere el hogar suavizar el consumo y menos reacciona a r.",
 "n-N":"<b>Número de períodos</b> de vida que planea el hogar.","n-r":"<b>Tasa de interés</b> a la que se ahorra o se presta entre períodos.",
 "v-Y":"<b>Producción esperada</b> de la empresa.","v-a":"<b>Participación del capital</b> en la producción.","v-r":"<b>Tasa de interés</b>: costo de oportunidad de financiar capital.","v-d":"<b>Depreciación</b> del capital. El costo de uso del capital es r + δ.","v-K":"<b>Capital del período anterior.</b> La inversión es lo que falta para llegar al capital deseado, más la reposición.","v-P":"<b>Producto marginal del capital</b>: invertir conviene mientras PMgK > r + δ.",
 "t-VM":"<b>Valor de mercado</b> de la empresa (lo que vale en bolsa).","t-CR":"<b>Costo de reposición</b> de su capital. Si q = VM/CR > 1, conviene invertir.",
 "g-G":"<b>Gasto público.</b>","g-T0":"<b>Impuestos autónomos</b>: la parte que no depende del ingreso.","g-t":"<b>Tasa impositiva marginal</b>: lo que se recauda de cada peso adicional de ingreso. Actúa como estabilizador automático y reduce el multiplicador.","g-Y":"<b>Ingreso nacional</b> con el que se calcula la recaudación y el saldo.","g-c":"<b>Propensión marginal a consumir.</b>","g-B":"<b>Deuda pública</b> acumulada.","g-r":"<b>Tasa de interés de la deuda</b>: los intereses r·B son gasto del gobierno.","g-Yp":"<b>PIB potencial.</b> El saldo estructural es el que habría si Y = Y*, sin el efecto del ciclo.",
 "m-a":"<b>Participación del capital</b> en Y = z·K^α·N^(1−α).","m-z":"<b>Productividad total de los factores.</b> Si sube, la empresa demanda más trabajo.","m-K":"<b>Stock de capital</b> (fijo en el corto plazo).","m-w":"<b>Salario real.</b> La empresa contrata hasta que el producto marginal del trabajo iguala a w.","m-g":"<b>Preferencia por el ocio</b> en la utilidad del hogar: más alta, menos trabajo ofrece.","m-h":"<b>Horas disponibles</b>, que se reparten entre trabajo y ocio.",
 "d-a":"<b>Participación del capital.</b>","d-z1":"<b>Productividad de hoy.</b>","d-z2":"<b>Productividad esperada para el futuro</b>: si sube, conviene invertir más hoy.","d-r":"<b>Tasa de interés real.</b>","d-d":"<b>Depreciación.</b>","d-K":"<b>Capital inicial.</b>","d-g":"<b>Preferencia por el ocio.</b>","d-h":"<b>Horas disponibles.</b>","d-b":"<b>Factor de descuento</b>: cuánto vale hoy un útil de mañana (cerca de 1, hogar paciente).","d-t":"<b>Impuesto al salario</b>: reduce el salario neto y con él la oferta de trabajo.",
 "cc-b":"<b>Factor de descuento</b> del inversionista.","cc-t":"<b>Aversión relativa al riesgo</b> (CRRA). El puzle de la prima: hace falta un θ enorme para explicar la prima observada.","cc-p":"<b>Probabilidad del estado bueno.</b>","cc-g1":"<b>Crecimiento del consumo en el estado bueno</b> (1,04 = 4 %).","cc-g2":"<b>Crecimiento del consumo en el estado malo.</b>","cc-x1":"<b>Pago del activo riesgoso en el estado bueno.</b>","cc-x2":"<b>Pago del activo riesgoso en el estado malo.</b> Un activo que paga poco cuando el consumo cae exige prima alta.","cc-ep":"<b>Prima de riesgo observada</b> que se quiere explicar con el modelo.",
 "ri-y":"<b>Ingreso del hogar</b>, igual en los dos períodos.","ri-g":"<b>Gasto público</b>, igual en los dos períodos.","ri-r":"<b>Tasa de interés.</b>","ri-d":"<b>Recorte de impuestos hoy</b>, financiado con deuda que se paga mañana. Con equivalencia ricardiana, el consumo no cambia.","ri-l":"<b>Fracción de hogares que no pueden endeudarse.</b> Para ellos el recorte sí aumenta el consumo: se rompe la equivalencia ricardiana.",
 "de-b":"<b>Deuda pública inicial</b> como % del PIB.","de-r":"<b>Tasa de interés real</b> que se paga sobre la deuda.","de-g":"<b>Crecimiento real del PIB.</b> Si g > r, la deuda tiende a bajar como % del PIB aun con déficit primario pequeño.","de-s":"<b>Superávit primario</b> (ingresos menos gastos sin intereses) como % del PIB.","de-T":"<b>Años</b> que se proyectan.",
 "e1-z":"<b>Productividad total.</b> Si sube, aumentan el salario real, el producto y el consumo.","e1-G":"<b>Gasto público</b>: se financia con impuestos de suma fija y reduce la riqueza del hogar (efecto riqueza: trabaja más).","e1-g":"<b>Preferencia por el ocio</b> en u = ln C + γ ln l.",
 "dp-y":"<b>Producto</b> de cada período antes del choque.","dp-g":"<b>Gasto público</b> de cada período antes del choque.","dp-b":"<b>Factor de descuento</b> del hogar.","dp-d":"<b>Tamaño del choque</b> elegido arriba (gasto o producto).",
 "r7-g1":"<b>Crecimiento anual del ingreso por persona en el país A.</b>","r7-g2":"<b>Crecimiento anual en el país B.</b> Si es mayor, B alcanza a A con el tiempo (convergencia).","r7-y2":"<b>Ingreso inicial de B</b> con A = 100.","r7-T":"<b>Años</b> que se proyectan.",
 "so-s":"<b>Tasa de ahorro</b>: fracción del producto que se invierte.","so-s2":"<b>Nueva tasa de ahorro</b> para la transición: el crecimiento sube un tiempo y vuelve a g; queda más alto el nivel.","so-a":"<b>Participación del capital.</b>","so-n":"<b>Crecimiento de la población.</b> Más n, menos capital por trabajador efectivo.","so-g":"<b>Progreso técnico</b>: la única fuente de crecimiento sostenido por persona.","so-d":"<b>Depreciación.</b>",
 "ak-s":"<b>Tasa de ahorro.</b> En el modelo AK el crecimiento de largo plazo es sA − (δ + n): el ahorro sí cambia el crecimiento.","ak-A":"<b>Productividad del capital</b> en Y = AK (sin rendimientos decrecientes).","ak-d":"<b>Depreciación más crecimiento de la población.</b>","ak-a":"<b>α del modelo de Solow</b> con el que se compara.",
 "ra-a":"<b>Participación del capital.</b>","ra-d":"<b>Depreciación.</b>","ra-n":"<b>Crecimiento de la población.</b>","ra-r":"<b>Tasa de descuento</b>: impaciencia del hogar. Más alta, menos capital en estado estacionario (regla de oro modificada).","ra-r2":"<b>Nueva tasa de descuento</b> tras el cambio de paciencia.","ra-t":"<b>Inversa de la elasticidad de sustitución intertemporal</b>: más alta, más suaviza el hogar el consumo y más lenta es la transición."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
(function(){const T={
 "rp-w":"<b>Años de trabajo</b> desde los 20; después viene la jubilación sin ingreso laboral.","rp-T":"<b>Edad al morir.</b> Ciclo de vida: se ahorra mientras se trabaja para consumir parejo toda la vida.","rp-g":"<b>Qué tan rápido sube el salario</b> con la edad.","rp-d":"<b>Tamaño del choque de ingreso.</b>","rp-N":"<b>Años de vida que le quedan</b> al hogar: con más años, un choque transitorio se reparte en más períodos y mueve poco el consumo.","rp-r":"<b>Tasa de interés.</b>","rp-c1":"<b>Propensión marginal a consumir keynesiana</b>, para comparar con la del ingreso permanente.","rp-s":"<b>Tamaño típico de los choques de ingreso.</b>","rp-rho":"<b>Persistencia del ingreso transitorio</b>: cerca de 1, los choques duran mucho y el consumo reacciona más.",
 "ac-v2":"<b>Relación capital-producto</b> deseada. Acelerador: la inversión responde al cambio del producto, por eso es mucho más volátil que el PIB.","ac-d":"<b>Depreciación.</b>","ac-a":"<b>Amplitud del ciclo del PIB.</b>","ac-is":"<b>Inversión que la empresa quisiera hacer</b> según la q de Tobin.","ac-B":"<b>Crédito disponible.</b> Si es poco, la inversión depende del flujo de caja propio (restricción financiera).",
 "mw-k1":"<b>Ahorro en capital físico del país rico.</b>","mw-h1":"<b>Inversión en capital humano del país rico</b> (educación). Mankiw-Romer-Weil: sumarla explica mejor las diferencias de ingreso.","mw-n1":"<b>Crecimiento de la población del país rico.</b>","mw-k2":"<b>Ahorro en capital físico del país pobre.</b>","mw-h2":"<b>Inversión en capital humano del país pobre.</b>","mw-n2":"<b>Crecimiento de la población del país pobre.</b>",
 "mw-sl":"<b>Tasa de ahorro cuando el país es pobre.</b>","mw-sh":"<b>Tasa de ahorro cuando el país es rico.</b> Si el ahorro sube con el ingreso pueden aparecer dos estados estacionarios (trampa de pobreza).","mw-k0":"<b>Umbral de capital</b> en el que el ahorro pasa de bajo a alto.","mw-nd":"<b>Crecimiento de la población más depreciación</b>: la inversión necesaria para mantener el capital por trabajador."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
