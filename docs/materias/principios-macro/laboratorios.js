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
