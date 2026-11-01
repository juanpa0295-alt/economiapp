// Principios de Macroeconomía · laboratorios interactivos
// ===================== LABORATORIOS DE PRINCIPIOS DE MACROECONOMÍA =====================
const SIMS={};
let CLIP=0;
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
const legend=items=>`<div class="legend">${items.map(([c,t,d])=>`<span><i style="background:var(${c})${d?";opacity:.55":""}"></i>${t}</span>`).join("")}</div>`;
const n0=v=>fmt(v,0),n2=v=>fmt(v,2),okAll=a=>a.every(x=>isFinite(x));
function marginal(id,opts,cb){return{html:`<h4 class="subh">Análisis marginal</h4>${seg(id,"Variable a derivar",opts,opts[0][0])}<div id="${id}-o"></div>`,
  bind:()=>{let cur=opts[0][0];const draw=()=>{$(`${id}-o`).innerHTML=cb(cur)};bindSeg(id,v=>{cur=v;draw()});return draw}}}

// ---- PIB y multiplicador
SIMS.pib=function(){
  const vals=()=>({C0:V("p-C0"),c1:V("p-c1"),T:V("p-T"),I:V("p-I"),G:V("p-G")});
  const mg=marginal("p-d",[["G","Gasto público (G)"],["T","Impuestos (T)"],["c1","Propensión (c₁)"]],k=>{const v=vals(),R=PM.pib(v);if(!R)return"";
    if(k==="G")return `<div class="eq">∂Y/∂G = ${fr("1","1 − c<sub>1</sub>")} = ${fr("1",fm(1-v.c1))} = <b>${n2(R.dY_dG)}</b><span class="note">Si el gasto público sube en 100.000, el PIB sube en ${n0(R.dY_dG*1e5)}.</span></div>`;
    if(k==="T")return `<div class="eq">∂Y/∂T = −${fr("c<sub>1</sub>","1 − c<sub>1</sub>")} = −${fr(fm(v.c1),fm(1-v.c1))} = <b>${n2(R.dY_dT)}</b><span class="note">Si los impuestos suben en 100.000, el PIB cae en ${n0(-R.dY_dT*1e5)}.</span></div>`;
    return `<div class="eq">∂Y/∂c<sub>1</sub> = ${fr("C<sub>0</sub> − T + I + G","(1 − c<sub>1</sub>)²")} = ${fr(n0(v.C0-v.T+v.I+v.G),fm((1-v.c1)**2))} = <b>${n0(R.dY_dc1)}</b><span class="note">Si c₁ sube 0,01, el PIB sube unos ${n0(R.dY_dc1*0.01)}.</span></div>`});
  $("sim").innerHTML=`<div class="ctr">${ctl("p-C0","Consumo autónomo (C₀)",0,3e6,1e4,8e5)}${ctl("p-c1","Propensión marginal a consumir (c₁)",0.05,0.95,0.01,0.8)}${ctl("p-T","Impuestos netos (T)",0,3e6,1e4,2e5)}${ctl("p-I","Inversión autónoma (I)",0,4e6,1e4,1e6)}${ctl("p-G","Gasto público (G)",0,4e6,1e4,1.5e6)}</div>
  <div class="res" id="p-res"></div><div id="p-steps"></div>${legend([["--line","Demanda agregada DA = C + I + G"],["--muted","Recta de 45° (Y = DA)"]])}<div id="p-plot"></div><h4 class="subh">Composición del PIB</h4><div id="p-bars"></div>${mg.html}`;
  const draw=mg.bind();
  const run=()=>{const v=vals();if(!okAll(Object.values(v))||v.c1>=1||v.c1<=0){$("p-res").innerHTML=err("c₁ debe estar entre 0 y 1.");return}
    const R=PM.pib(v);
    $("p-res").innerHTML=tiles([["Multiplicador 1/(1 − c₁)",n2(R.mult)],["Gasto autónomo",n0(R.A)],["PIB de equilibrio Y*",n0(R.Y)],["Consumo C",n0(R.C)]]);
    $("p-steps").innerHTML=stp(1,"Resolución paso a paso",`<div class="eq al">Y = ${fr("1","1 − "+fm(v.c1))} · [${n0(v.C0)} − ${fm(v.c1)} · ${n0(v.T)} + ${n0(v.I)} + ${n0(v.G)}]<br>Y = ${n2(R.mult)} · ${n0(R.A)} = <b>${n0(R.Y)}</b><br>C = C<sub>0</sub> + c<sub>1</sub>(Y − T) = ${n0(v.C0)} + ${fm(v.c1)} · ${n0(R.Y-v.T)} = ${n0(R.C)}</div><p>Comprobación: C + I + G = ${n0(R.C)} + ${n0(v.I)} + ${n0(v.G)} = ${n0(R.C+v.I+v.G)} = Y*.</p>`);
    const xm=R.Y*1.6,da=y=>R.A+v.c1*y;
    $("p-plot").innerHTML=plotXY({xr:[0,xm],yr:[0,Math.max(xm,da(xm))*1.02],series:[{f:y=>y,col:"--muted",w:1.5,dash:"6 5"},{f:da,col:"--line"}],points:[{x:R.Y,y:R.Y,col:"--ink",label:"Y*"}],xl:"ingreso (Y)",yl:"gasto",label:"Cruz keynesiana: demanda agregada y recta de 45 grados"});
    const parts=[["Consumo",R.C,"--line"],["Inversión",v.I,"--branch"],["Gasto público",v.G,"--exam"]],tot=R.C+v.I+v.G;let x=0;
    $("p-bars").innerHTML=`<div class="plot"><svg viewBox="0 0 600 70" role="img" aria-label="Composición del PIB">${parts.map(([t,val,c])=>{const w=Math.max(0,val/tot*600),s=`<rect x="${x}" y="8" width="${w}" height="30" fill="var(${c})" fill-opacity=".85"/>${w>80?`<text x="${x+6}" y="28" font-size="12" fill="var(--card)" font-weight="600">${t}</text>`:""}<text x="${x+2}" y="58" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${w>70?fmt(val/tot*100,1)+" %":""}</text>`;x+=w;return s}).join("")}</svg></div>`;
    draw()};
  bindCtl(["p-C0","p-c1","p-T","p-I","p-G"],run);run();
};

// ---- Presupuesto equilibrado
SIMS.equi=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("q-c1","Propensión marginal a consumir (c₁)",0.05,0.95,0.01,0.8)}${ctl("q-d","Aumento de G y de T (Δ)",0,1e6,1e4,1e5)}</div><div class="res" id="q-res"></div><div id="q-steps"></div>`;
  const run=()=>{const c1=V("q-c1"),d=V("q-d");if(!(c1>0&&c1<1)||!isFinite(d))return;const g=d/(1-c1),t=-c1*d/(1-c1);
    $("q-res").innerHTML=tiles([["Efecto del gasto",n0(g)],["Efecto de los impuestos",n0(t),"badt"],["Efecto total ΔY",n0(g+t),"okt"],["Cambio del déficit","0"]]);
    $("q-steps").innerHTML=stp(1,"Cálculo",`<div class="eq al">ΔY = ${fr("1","1 − "+fm(c1))} · ${n0(d)} − ${fr(fm(c1),"1 − "+fm(c1))} · ${n0(d)} = ${n0(g)} − ${n0(-t)} = <b>${n0(g+t)}</b></div><p>Mueve c₁: el efecto total siempre es igual a Δ.</p>`)};
  bindCtl(["q-c1","q-d"],run);run();
};

// ---- Mercado de dinero
SIMS.din=function(){
  const vals=()=>({M:V("d-M"),P:V("d-P"),Y:V("d-Y"),k:V("d-k"),h:V("d-h")});
  const mg=marginal("d-x",[["Y","Ingreso (Y)"],["M","Oferta monetaria (M)"]],k=>{const v=vals(),R=PM.dinero(v);
    return k==="Y"?`<div class="eq">∂r/∂Y = k/h = ${fm(v.k)}/${n0(v.h)} = <b>${fmt(R.dr_dY,6)}</b><span class="note">Es la pendiente de la curva LM: por cada unidad que sube el PIB, la tasa sube ${fmt(R.dr_dY,6)} para mantener el equilibrio.</span></div>`
      :`<div class="eq">∂r/∂M = −1/(P·h) = −1/(${fm(v.P)} · ${n0(v.h)}) = <b>${fmt(R.dr_dM,8)}</b><span class="note">Una expansión monetaria baja la tasa de interés.</span></div>`});
  $("sim").innerHTML=`<div class="ctr">${ctl("d-M","Oferta monetaria (M)",1e4,3e6,1e4,5e5)}${ctl("d-P","Nivel de precios (P)",0.2,5,0.05,1)}${ctl("d-Y","PIB real (Y)",1e5,1e7,5e4,3e6)}${ctl("d-k","Sensibilidad al ingreso (k)",0.05,2,0.01,0.5)}${ctl("d-h","Sensibilidad a la tasa (h)",1000,1e6,1000,2e4)}</div>
  <div class="res" id="d-res"></div><div id="d-steps"></div>${legend([["--line","Demanda de dinero L = kY − hr"],["--branch","Oferta real M/P"]])}<div id="d-plot"></div>${mg.html}`;
  const draw=mg.bind();
  const run=()=>{const v=vals();if(!okAll(Object.values(v))||v.P<=0||v.h<=0){$("d-res").innerHTML=err("P y h deben ser positivos.");return}
    const R=PM.dinero(v);
    $("d-res").innerHTML=tiles([["Oferta real M/P",n0(R.ms)],["Tasa de equilibrio r*",fmt(R.r,4),R.r<0?"badt":""],["Pendiente LM k/h",fmt(R.dr_dY,6)]]);
    $("d-steps").innerHTML=stp(1,"Resolución del mercado",`<div class="eq al">M/P = ${n0(v.M)}/${fm(v.P)} = ${n0(R.ms)}<br>${n0(R.ms)} = ${fm(v.k)} · ${n0(v.Y)} − ${n0(v.h)} · r<br>r* = ${fr(`${n0(v.k*v.Y)} − ${n0(R.ms)}`,n0(v.h))} = <b>${fmt(R.r,4)}</b></div>${R.r<0?`<p class="warn"><b>Ojo:</b> la tasa salió negativa: la oferta de dinero supera lo que se demanda incluso con r = 0.</p>`:""}`);
    const xm=Math.max(v.k*v.Y,R.ms)*1.4,rmax=Math.max(v.k*v.Y/v.h,Math.abs(R.r)*1.6,1e-9);
    $("d-plot").innerHTML=plotXY({xr:[0,xm],yr:[Math.min(0,R.r*1.2),rmax*1.05],series:[{f:L=>(v.k*v.Y-L)/v.h,col:"--line"}],vlines:[{x:R.ms,col:"--branch",dash:"0",w:2.5}],points:[{x:R.ms,y:R.r,col:"--ink",label:"Equilibrio"}],xl:"saldos reales",yl:"tasa (r)",label:"Mercado de dinero: demanda y oferta real"});
    draw()};
  bindCtl(["d-M","d-P","d-Y","d-k","d-h"],run);run();
};

// ---- IS-LM
const ISLM_IDS=[["C0","Consumo autónomo (C₀)",0,3e6,1e4,8e5],["c1","Propensión a consumir (c₁)",0.05,0.95,0.01,0.8],["T","Impuestos (T)",0,3e6,1e4,2e5],["I0","Inversión autónoma (I₀)",0,3e6,1e4,5e5],["b","Sensibilidad de la inversión (b)",100,1e5,100,1e4],["G","Gasto público (G)",0,4e6,1e4,1.5e6],["M","Oferta monetaria (M)",1e4,3e6,1e4,5e5],["P","Precios (P)",0.2,5,0.05,1],["k","Sensibilidad k",0.05,2,0.01,0.5],["h","Sensibilidad h",1000,1e6,1000,2e4]];
const islmVals=pre=>Object.fromEntries(ISLM_IDS.map(([k])=>[k,V(pre+k)]));
function islmPlot(v,R,extra){const xm=[R.Y*0.7,R.Y*1.3],IS=y=>(v.C0-v.c1*v.T+v.I0+v.G-(1-v.c1)*y)/v.b,LM=y=>(v.k*y-v.M/v.P)/v.h;
  const ys=[IS(xm[0]),IS(xm[1]),LM(xm[0]),LM(xm[1]),...(extra?extra.ys:[])],lo=Math.min(...ys),hi=Math.max(...ys),pad=(hi-lo)*0.08||1;
  return plotXY({xr:xm,yr:[lo-pad,hi+pad],series:[{f:IS,col:"--line"},{f:LM,col:"--branch"},...(extra?extra.series:[])],points:[{x:R.Y,y:R.r,col:"--ink",label:"E"},...(extra?extra.points:[])],xl:"PIB (Y)",yl:"tasa (r)",label:"Curvas IS y LM con su equilibrio"})}
SIMS.islm=function(){
  const mg=marginal("s-x",[["G","Gasto (G)"],["M","Oferta monetaria (M)"],["T","Impuestos (T)"]],k=>{const v=islmVals("s-"),R=PM.islm(v),den=`${n0(v.h)}(1 − ${fm(v.c1)}) + ${n0(v.b)} · ${fm(v.k)}`;
    if(k==="G")return `<div class="eq">∂Y/∂G = ${fr("h","h(1 − c<sub>1</sub>) + bk")} = ${fr(n0(v.h),den)} = <b>${fmt(R.mG,4)}</b><span class="note">Menor que el multiplicador keynesiano ${fmt(R.keynes,2)}: la subida de la tasa de interés reduce la inversión privada.</span></div>`;
    if(k==="M")return `<div class="eq">∂Y/∂M = ${fr("b/P","h(1 − c<sub>1</sub>) + bk")} = ${fr(n0(v.b)+"/"+fm(v.P),den)} = <b>${fmt(R.mM,4)}</b><span class="note">Más dinero baja la tasa de interés y estimula la inversión.</span></div>`;
    return `<div class="eq">∂Y/∂T = −${fr("c<sub>1</sub>h","h(1 − c<sub>1</sub>) + bk")} = <b>${fmt(R.mT,4)}</b><span class="note">Subir impuestos reduce el ingreso disponible, el consumo y el PIB.</span></div>`});
  $("sim").innerHTML=`<div class="ctr">${ISLM_IDS.map(([k,l,a,b,s,d])=>ctl("s-"+k,l,a,b,s,d)).join("")}</div><div class="res" id="s-res"></div>${legend([["--line","IS (mercado de bienes)"],["--branch","LM (mercado de dinero)"]])}<div id="s-plot"></div><div id="s-steps"></div>${mg.html}`;
  const draw=mg.bind();
  const run=()=>{const v=islmVals("s-");if(!okAll(Object.values(v))||v.c1<=0||v.c1>=1||v.h<=0||v.b<=0||v.P<=0){$("s-res").innerHTML=err("c₁ entre 0 y 1; b, h y P positivos.");return}
    const R=PM.islm(v);
    $("s-res").innerHTML=tiles([["PIB de equilibrio Y*",n0(R.Y)],["Tasa de equilibrio r*",fmt(R.r,4)],["Inversión I = I₀ − br",n0(R.I),R.I<0?"badt":""],["Multiplicador fiscal",fmt(R.mG,4)]]);
    $("s-plot").innerHTML=islmPlot(v,R);
    $("s-steps").innerHTML=stp(1,"Solución del sistema",`<div class="eq al">Y* = ${fr(`${n0(v.h)} · ${n0(R.A)} + ${n0(v.b)} · ${n0(v.M/v.P)}`,`${n0(v.h)}(1 − ${fm(v.c1)}) + ${n0(v.b)} · ${fm(v.k)}`)} = <b>${n0(R.Y)}</b><br>r* = ${fr(`${fm(v.k)} · ${n0(R.Y)} − ${n0(v.M/v.P)}`,n0(v.h))} = <b>${fmt(R.r,4)}</b></div>`);
    draw()};
  bindCtl(ISLM_IDS.map(([k])=>"s-"+k),run);run();
};

// ---- Efecto expulsión
SIMS.expu=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("x-dG","Aumento del gasto público (ΔG)",-1e6,1e6,1e4,3e5)}${ctl("x-dM","Aumento de la oferta monetaria (ΔM)",-4e5,1e6,1e4,0)}${ctl("x-b","Sensibilidad de la inversión (b)",100,1e5,100,1e4)}${ctl("x-h","Sensibilidad h",1000,1e6,1000,2e4)}</div>
  <div class="res" id="x-res"></div>${legend([["--line","IS inicial"],["--branch","LM inicial"],["--line","IS nueva",1],["--branch","LM nueva",1]])}<div id="x-plot"></div><div class="verdict acc" id="x-ver"></div>`;
  const run=()=>{const base={C0:8e5,c1:0.8,T:2e5,I0:5e5,b:V("x-b"),G:1.5e6,M:5e5,P:1,k:0.5,h:V("x-h")},dG=V("x-dG"),dM=V("x-dM");
    if(!okAll([dG,dM,base.b,base.h])||base.M+dM<=0)return;const nv=Object.assign({},base,{G:base.G+dG,M:base.M+dM}),R0=PM.islm(base),R1=PM.islm(nv);
    const dY=R1.Y-R0.Y,dr=R1.r-R0.r,dI=R1.I-R0.I,kY=dG*R0.keynes;
    $("x-res").innerHTML=tiles([["ΔY en IS-LM",n0(dY)],["Δr",fmt(dr,4)],["ΔI (expulsión)",n0(dI),dI<0?"badt":"okt"],["ΔY sin mercado de dinero",dG?n0(kY):"—"]]);
    const IS=(v)=>y=>(v.C0-v.c1*v.T+v.I0+v.G-(1-v.c1)*y)/v.b,LM=(v)=>y=>(v.k*y-v.M/v.P)/v.h;
    $("x-plot").innerHTML=islmPlot(base,R0,{ys:[R1.r],series:[{f:IS(nv),col:"--line",dash:"7 5"},{f:LM(nv),col:"--branch",dash:"7 5"}],points:[{x:R1.Y,y:R1.r,col:"--exam",label:"E′"}]});
    $("x-ver").textContent=dG&&!dM?`El PIB sube ${n0(dY)}, menos que los ${n0(kY)} del modelo keynesiano simple, porque la tasa sube ${fmt(dr,4)} y la inversión cae ${n0(-dI)}.`:!dG&&dM?`La expansión monetaria baja la tasa ${fmt(-dr,4)}, la inversión sube ${n0(dI)} y el PIB sube ${n0(dY)}.`:dG&&dM?`Con las dos políticas a la vez, el PIB cambia ${n0(dY)} y la tasa ${fmt(dr,4)}. Si el banco central acomoda el gasto, se reduce la expulsión.`:"Mueve ΔG o ΔM para ver el efecto."};
  bindCtl(["x-dG","x-dM","x-b","x-h"],run);run();
};

// ---- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["PIB","Identidad del gasto","Y = C + I + G (+ X − M)"],["PIB","Consumo","C = C₀ + c₁(Y − T)"],["PIB","Equilibrio","Y* = [C₀ − c₁T + I + G]/(1 − c₁)"],["PIB","Multiplicador del gasto","∂Y/∂G = 1/(1 − c₁)"],["PIB","Multiplicador de impuestos","∂Y/∂T = −c₁/(1 − c₁)"],["PIB","Presupuesto equilibrado","ΔY = ΔG si ΔG = ΔT"],
    ["Dinero","Equilibrio","M/P = kY − hr"],["Dinero","Tasa de equilibrio","r* = (kY − M/P)/h"],["Dinero","Pendiente LM","∂r/∂Y = k/h"],["Dinero","Efecto de M","∂r/∂M = −1/(Ph)"],
    ["IS-LM","Curva IS","Y = C₀ + c₁(Y − T) + I₀ − br + G"],["IS-LM","Curva LM","M/P = kY − hr"],["IS-LM","Producción de equilibrio","Y* = [h(C₀ − c₁T + I₀ + G) + bM/P]/[h(1 − c₁) + bk]"],["IS-LM","Multiplicador fiscal","h/[h(1 − c₁) + bk]"],["IS-LM","Multiplicador monetario","(b/P)/[h(1 − c₁) + bk]"],["IS-LM","Expulsión","ΔI = −bΔr"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: multiplicador"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));
    $("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run();
};

// Visuales de cambios de Principios de Macroeconomía (usa el motor comun/visual.js)
// Parámetros base: C0 = 100, T = 100, I0 = 200, G = 100, b = 10, k = 0,5, h = 25, M/P = 300.

// 1. Cruz keynesiana: DA = gasto autónomo + c1·Y contra la recta de 45°
VIS.add("keynes",{t:"Cruz keynesiana: demanda agregada y recta de 45°",
  hint:"Arrastra la DA hacia arriba o hacia abajo (cambio del gasto autónomo). Cambia c₁ para ver cómo cambia el multiplicador.",
  opts:[{id:"c1",lab:"Propensión a consumir c₁",ch:[["0.6","0,6"],["0.75","0,75"],["0.8","0,8"]],v:"0.8"}],
  p0:{dA:0},lim:{dA:[-120,120]},
  presets:[["∆G = +40",{dA:40}],["∆T = +50",{dA:-1}],["∆I = −30",{dA:-30}],["∆G = ∆T = +50",{dA:0.001}]],
  fit:{dA:(Y,D,st)=>{const c=+st.o.c1,A0=100-c*100+200+100;return D-c*Y-A0}},
  compute(st){const c=+st.o.c1,A0=100-c*100+200+100,m=1/(1-c);let dA=st.p.dA,nota="";
    if(Math.abs(dA+1)<1e-9){dA=-c*50;nota="Una subida de impuestos de 50 reduce el ingreso disponible en 50 y el consumo en c₁·50 = "+VIS.n(c*50,1)+": la DA baja ese monto, no los 50 completos."}
    if(Math.abs(dA-0.001)<1e-9){dA=50-c*50;nota="Con ∆G = ∆T = 50 la DA sube 50 por el gasto y baja c₁·50 por los impuestos: neto, sube (1 − c₁)·50 = "+VIS.n(50-c*50,1)+". Multiplicado por 1/(1 − c₁), el PIB sube exactamente 50: el multiplicador del presupuesto equilibrado es 1."}
    const A=A0+dA,Y0=A0*m,Y1=A*m,DA=a=>Y=>a+c*Y,mv=Math.abs(dA)>0.5;
    const curves=[{sh:VIS.fx(Y=>Y),col:"--muted",w:1.6,lab:"45°: DA = Y"},{sh:VIS.fx(DA(A0)),col:"--line",dash:1,op:.55,lab:mv?"DA":""},{sh:VIS.fx(DA(A)),col:"--line",lab:mv?"DA’":"DA = C + I + G"}];
    const pts=[{x:Y0,y:Y0,lab:"0"}],segs=[];if(mv){pts.push({x:Y1,y:Y1,lab:"1",col:"--good"});segs.push({x1:Y0,y1:Y0,x2:Y0,y2:DA(A)(Y0),col:"--bad",w:3,lab:dA>0?"DA > Y":"DA < Y"});segs.push({x1:Y0,y1:120,x2:Y1,y2:120,col:"--good",arrow:1,lab:"∆Y"})}
    const hx=1700,P={cap:"Cruz keynesiana · c₁ = "+VIS.n(c,2),xr:[0,2400],yr:[0,2400],xl:"Ingreso Y",yl:"Demanda agregada DA",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,handles:[{c:"dA",x:hx,y:DA(A)(hx),col:"--line",name:"la DA"}]};
    let h;if(!mv)h=`<p>Todavía no hay cambios. El equilibrio está donde la DA corta la recta de 45°: Y* = gasto autónomo × multiplicador = ${VIS.n(A0,0)} × ${VIS.n(m,2)} = ${VIS.n(Y0,0)}. Arrastra la DA o prueba un choque.</p>`;
    else{h=VIS.sec("Qué cambió",VIS.list([`La DA se desplazó <b>${dA>0?"hacia arriba":"hacia abajo"}</b> en ${VIS.n(Math.abs(dA),1)}: el gasto autónomo pasó de ${VIS.n(A0,0)} a ${VIS.n(A,0)}.`]));
      h+=VIS.sec("Qué pudo haberlo causado",(nota?`<p>${nota}</p>`:"")+VIS.list([dA>0?"∆+G o ∆+I (entran completos a la DA), ∆+C₀ (más consumo autónomo) o ∆-T (sube la DA en c₁·∆T).":"∆-G o ∆-I, ∆-C₀ o ∆+T (baja la DA en c₁·∆T)."]));
      h+=VIS.sec("Mecanismo",`<p>Al ingreso inicial ${VIS.n(Y0,0)} ahora ${dA>0?"la demanda supera a la producción: se desacumulan inventarios y las empresas producen más":"la producción supera a la demanda: se acumulan inventarios y las empresas producen menos"}. El nuevo ingreso genera más (menos) consumo, y así en rondas: ${VIS.n(Math.abs(dA),1)} × (1 + ${VIS.n(c,2)} + ${VIS.n(c,2)}² + …) = ${VIS.n(Math.abs(dA),1)} × ${VIS.n(m,2)}.</p><div class="eq al chain">∆Y = ∆A / (1 − c₁) = ${VIS.n(dA,1)} / ${VIS.n(1-c,2)} = ${VIS.n(Y1-Y0,1)}</div>`);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Ingreso Y*",Y0,Y1,0),["Multiplicador",VIS.n(m,2)],VIS.tile("Consumo C",100+c*(Y0-100),100+c*(Y1-100),0)])}</div>`)}
    return{panels:[P],text:h}}});

// 2. Mercado de dinero en (M/P, r): oferta vertical, demanda L = kY − hr
VIS.add("dinero",{t:"Mercado de dinero: oferta real y demanda L(r, Y)",
  hint:"Arrastra la oferta monetaria real (vertical) o la demanda de dinero (cambia con el ingreso Y).",
  p0:{M:300,Y:1100},lim:{M:[150,450],Y:[800,1400]},
  presets:[["El banco central expande M",{M:375}],["Sube el ingreso Y",{Y:1300}],["Suben los precios P",{M:240}]],
  fit:{M:x=>x,Y:(m,r)=>(m+25*r)/0.5},
  compute(st){const{M,Y}=st.p,L=y=>m=>(0.5*y-m)/25,r0=L(1100)(300),r1=L(Y)(M),mM=Math.abs(M-300)>1,mY=Math.abs(Y-1100)>2;
    const curves=[{sh:VIS.vx(300),col:"--line",dash:1,op:.55,lab:mM?"M/P":""},{sh:VIS.fx(L(1100)),col:"--branch",dash:1,op:.55,lab:mY?"L":""},{sh:VIS.vx(M),col:"--line",lab:mM?"M/P’":"M/P (oferta)"},{sh:VIS.fx(L(Y)),col:"--branch",lab:mY?"L’ = kY’ − hr":"L = kY − hr"}];
    const pts=[{x:300,y:r0,lab:"0"}];if(mM||mY)pts.push({x:M,y:r1,lab:"1",col:"--good"});
    const hx=VIS.clamp(0.5*Y-25*4,20,580),P={cap:"Mercado de dinero",xr:[0,600],yr:[0,20],xl:"Saldos reales M/P",yl:"Tasa de interés r (%)",fx:v=>VIS.n(v,0),curves,pts,handles:[{c:"M",x:M,y:18,col:"--line",name:"la oferta monetaria"},{c:"Y",x:hx,y:L(Y)(hx),col:"--branch",name:"la demanda de dinero"}]};
    let h;if(!mM&&!mY)h=`<p>Todavía no hay cambios: r* = (kY − M/P)/h = (0,5·1.100 − 300)/25 = ${VIS.n(r0,1)} %. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mM){mv.push(`La oferta real se desplazó <b>${M>300?"a la derecha":"a la izquierda"}</b> (M/P = ${VIS.n(M,0)}).`);cs.push(M>300?"El banco central aumenta M (compra bonos) o bajan los precios P.":"El banco central reduce M (vende bonos) o suben los precios P.")}
      if(mY){mv.push(`La demanda de dinero se desplazó <b>${Y>1100?"a la derecha":"a la izquierda"}</b> (Y = ${VIS.n(Y,0)}).`);cs.push(Y>1100?"Sube el ingreso: se necesitan más saldos para transacciones (motivo transacción, kY).":"Baja el ingreso: se necesita menos dinero para transacciones.")}
      const dr=r1-r0;h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",`<p>A la tasa inicial de ${VIS.n(r0,1)} % hay ${dr<0?"<b>exceso de oferta de dinero</b>: la gente compra bonos, su precio sube y la tasa baja":"<b>exceso de demanda de dinero</b>: la gente vende bonos, su precio baja y la tasa sube"} hasta ${VIS.n(r1,1)} %, donde el público quiere tener justo el dinero que hay.</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tasa r (%)",r0,r1,2)])}</div>`)}
    return{panels:[P],text:h}}});

// 3. IS-LM en (Y, r)
VIS.add("islm",{t:"Modelo IS-LM",
  hint:"Arrastra la IS (política fiscal o gasto autónomo) o la LM (política monetaria). La línea punteada horizontal muestra cuánto subiría Y si la tasa no cambiara: la diferencia es el efecto expulsión.",
  p0:{dA:0,M:300},lim:{dA:[-100,100],M:[180,420]},
  presets:[["∆G = +40",{dA:40}],["∆M/P = +60",{M:360}],["∆T = +50",{dA:-40}],["Política mixta: ∆G y ∆M",{dA:40,M:350}]],
  fit:{dA:(Y,r)=>0.2*Y+10*r-320,M:(Y,r)=>0.5*Y-25*r},
  compute(st){const{dA,M}=st.p,A=320+dA,IS=a=>Y=>(a-0.2*Y)/10,LM=m=>Y=>(0.5*Y-m)/25,solve=(a,m)=>{const Y=(25*a+10*m)/(25*0.2+10*0.5);return{Y,r:(0.5*Y-m)/25}};
    const e0=solve(320,300),e1=solve(A,M),mI=Math.abs(dA)>0.5,mL=Math.abs(M-300)>1;
    const curves=[{sh:VIS.fx(IS(320)),col:"--branch",dash:1,op:.55,lab:mI?"IS":""},{sh:VIS.fx(LM(300)),col:"--line",dash:1,op:.55,lab:mL?"LM":""},{sh:VIS.fx(IS(A)),col:"--branch",lab:mI?"IS’":"IS"},{sh:VIS.fx(LM(M)),col:"--line",lab:mL?"LM’":"LM"}];
    const pts=[{x:e0.Y,y:e0.r,lab:"0"}],segs=[];let Yk=null;
    if(mI||mL)pts.push({x:e1.Y,y:e1.r,lab:"1",col:"--good"});
    if(mI&&!mL){Yk=(A-10*e0.r)/0.2;segs.push({x1:e0.Y,y1:e0.r,x2:Yk,y2:e0.r,col:"--muted",dash:1,w:1.5,arrow:1});pts.push({x:Yk,y:e0.r,lab:"sin expulsión",col:"--muted"})}
    const hi=1450,hl=VIS.clamp(800+2*(M-300),300,1900),P={cap:"Equilibrio IS-LM",xr:[0,2200],yr:[0,25],xl:"Ingreso Y",yl:"Tasa de interés r (%)",fx:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"dA",x:hi,y:IS(A)(hi),col:"--branch",name:"la IS"},{c:"M",x:hl,y:LM(M)(hl),col:"--line",name:"la LM"}]};
    let h;if(!mI&&!mL)h=`<p>Todavía no hay cambios. En 0 se cruzan la IS (bienes) y la LM (dinero): Y* = ${VIS.n(e0.Y,0)}, r* = ${VIS.n(e0.r,1)} %. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mI){mv.push(`La IS se desplazó <b>${dA>0?"a la derecha":"a la izquierda"}</b>: el gasto autónomo cambió en ${VIS.n(dA,1)}.`);cs.push(dA>0?"∆+G, ∆+I₀, ∆+C₀ o ∆-T (política fiscal expansiva).":"∆-G, ∆-I₀, ∆-C₀ o ∆+T (política fiscal contractiva).")}
      if(mL){mv.push(`La LM se desplazó <b>${M>300?"a la derecha":"a la izquierda"}</b>: M/P = ${VIS.n(M,0)}.`);cs.push(M>300?"∆+M (política monetaria expansiva) o ∆-P.":"∆-M (política monetaria contractiva) o ∆+P.")}
      let m="";if(mI)m+=`<p><b>Fiscal:</b> ${dA>0?"∆+G → ∆+DA → ∆+Y → ∆+L (más dinero para transacciones) → ∆+r → ∆-I":"∆-G → ∆-DA → ∆-Y → ∆-L → ∆-r → ∆+I"}.${Yk!==null?` Con la tasa fija, Y llegaría a ${VIS.n(Yk,0)} (multiplicador simple); con la subida de r llega solo a ${VIS.n(e1.Y,0)}. La diferencia es el <b>efecto expulsión</b>: ∆I = −b·∆r = −10 × ${VIS.n(e1.r-e0.r,2)} = ${VIS.n(-10*(e1.r-e0.r),1)}.`:""}</p>`;
      if(mL)m+=`<p><b>Monetaria:</b> ${M>300?"∆+M/P → exceso de oferta de dinero → ∆-r → ∆+I → ∆+DA → ∆+Y":"∆-M/P → exceso de demanda de dinero → ∆+r → ∆-I → ∆-DA → ∆-Y"}.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Ingreso Y",e0.Y,e1.Y,0),VIS.tile("Tasa r (%)",e0.r,e1.r,2),VIS.tile("Inversión I",200-10*e0.r,200-10*e1.r,1)])}</div>`)}
    return{panels:[P],text:h}}});
