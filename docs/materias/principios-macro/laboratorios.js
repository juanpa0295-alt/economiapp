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

// =====================================================================
// LABORATORIOS DEL PROGRAMA (Jones): medición, ciclos, largo plazo y corto plazo
// =====================================================================
const alf=v=>Math.abs(v-1/3)<0.002?1/3:v;
const pc=(v,d=2)=>isFinite(v)?fmt(100*v,d)+" %":"—";
const pp=(v,d=2)=>isFinite(v)?fmt(v,d):"—";
const tabsBox=(id,opts)=>`<div style="margin-bottom:10px">${seg(id,"Herramienta",opts,opts[0][0])}</div><div id="${id}-b"></div>`;
function tabsRun(id,M){let cur=null;const go=k=>{cur=k;M[k]()};bindSeg(id,go);go(Object.keys(M)[0])}
const nin=(id,l,v,st)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" ${st?`step="${st}"`:""} inputmode="decimal"></label>`;
const N=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",", ".")):NaN};
const onIn=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});
const tsPlot=(T,series,yl,label,extra={})=>{const ys=series.flatMap(s=>s.pts.map(p=>p[1])).concat(extra.ys||[]),lo=Math.min(...ys),hi=Math.max(...ys),pad=(hi-lo)*0.1||0.5;
  return plotXY({xr:[0,T],yr:[lo-pad,hi+pad],series,hlines:extra.hlines||[],vlines:extra.vlines||[],points:extra.points||[],xl:extra.xl||"período (t)",yl,H:extra.H||230,label})};

// ---------- Medición
SIMS.medir=function(){
  $("sim").innerHTML=tabsBox("me",[["pib","PIB real, deflactor e IPC"],["lab","Mercado laboral (DANE)"],["va","Valor agregado y PNB"]]);
  const B=$("me-b");
  tabsRun("me",{
   pib(){const D=[["Naranjas",1,100,1.2,110],["Computadores",10,20,9,30],["",0,0,0,0]];
    B.innerHTML=`<p class="hint">Escribe precios (p) y cantidades (q) del año base (0) y del año corriente (1). Deja en cero las filas que no uses.</p>
    <div class="tbl"><table><tr><th>Bien</th><th>p₀</th><th>q₀</th><th>p₁</th><th>q₁</th></tr>${D.map((r,i)=>`<tr><td><input id="mb-n${i}" value="${r[0]}" aria-label="Bien ${i+1}" style="width:9em"></td>${[1,2,3,4].map(j=>`<td><input type="number" id="mb-${i}-${j}" value="${r[j]}" aria-label="${["","p0","q0","p1","q1"][j]} bien ${i+1}" style="width:6em" inputmode="decimal"></td>`).join("")}</tr>`).join("")}</table></div>
    <div class="res" id="mb-res"></div><div id="mb-st"></div>`;
    const run=()=>{const bs=[];for(let i=0;i<3;i++){const v=[1,2,3,4].map(j=>N(`mb-${i}-${j}`));if(v.some(x=>!isFinite(x)))return;if(v.every(x=>x===0))continue;bs.push({n:$("mb-n"+i).value||"Bien "+(i+1),p0:v[0],q0:v[1],p1:v[2],q1:v[3]})}
      if(!bs.length)return;const R=PM.pibReal(bs);if(!(R.N0>0&&R.real0b1>0)){$("mb-res").innerHTML=err("el PIB del año base debe ser positivo.");return}
      const sum=f=>bs.map(f).join(" + ");
      $("mb-res").innerHTML=tiles([["PIB nominal año 0",pp(R.N0)],["PIB nominal año 1",pp(R.N1)],["PIB real año 1 (precios año 0)",pp(R.real1)],["Crecimiento encadenado",pc(R.gFisher),"okt"],["Deflactor año 1",pp(R.defl1)],["IPC año 1",pp(R.ipc1)]]);
      $("mb-st").innerHTML=stp(1,"PIB nominal",`<div class="eq al">Año 0: ${sum(b=>`${fm(b.p0)}·${fm(b.q0)}`)} = <b>${pp(R.N0)}</b><br>Año 1: ${sum(b=>`${fm(b.p1)}·${fm(b.q1)}`)} = <b>${pp(R.N1)}</b><br>Crecimiento nominal: ${pp(R.N1)}/${pp(R.N0)} − 1 = ${pc(R.gNom)}</div>`)
       +stp(2,"Crecimiento real con cada año base",`<div class="eq al">Precios del año 0: ${sum(b=>`${fm(b.p0)}·${fm(b.q1)}`)} = ${pp(R.real1)} → ${pp(R.real1)}/${pp(R.N0)} − 1 = <b>${pc(R.gLasp)}</b><br>Precios del año 1: ${pp(R.N1)}/(${sum(b=>`${fm(b.p1)}·${fm(b.q0)}`)}) = ${pp(R.N1)}/${pp(R.real0b1)} − 1 = <b>${pc(R.gPaa)}</b><br>Encadenado (Fisher): √(${fmt(1+R.gLasp,4)} × ${fmt(1+R.gPaa,4)}) − 1 = <b>${pc(R.gFisher)}</b></div><p>PIB real encadenado del año 1, en pesos del año 0: ${pp(R.N0)} × ${fmt(1+R.gFisher,4)} = ${pp(R.realEnc)}.</p>`)
       +stp(3,"Precios: deflactor e IPC",`<div class="eq al">Deflactor (base año 0) = 100 · ${pp(R.N1)}/${pp(R.real1)} = <b>${pp(R.defl1)}</b> → inflación ${pc(R.inflDef)}<br>Deflactor encadenado = 100 · ${pp(R.N1)}/${pp(R.realEnc)} = ${pp(R.deflEnc)}<br>IPC (canasta del año 0) = 100 · ${pp(R.real0b1)}/${pp(R.N0)} = <b>${pp(R.ipc1)}</b> → inflación ${pc(R.inflIPC)}</div>${Math.abs(R.inflDef-R.inflIPC)>0.001?`<p>El deflactor y el IPC dan inflaciones distintas porque ponderan con canastas distintas: el deflactor usa lo producido en el año 1, y el IPC, la canasta fija del año 0.</p>`:""}`)};
    B.querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()},
   lab(){B.innerHTML=`<div class="calcf">${nin("ml-pet","Población en edad de trabajar (PET)",40000000)}${nin("ml-o","Ocupados (O)",23000000)}${nin("ml-d","Desocupados (D)",2500000)}</div><div class="res" id="ml-res"></div><div id="ml-st"></div>`;
    const run=()=>{const PET=N("ml-pet"),O=N("ml-o"),D=N("ml-d");if(!(PET>0&&O>=0&&D>=0)||O+D>PET){$("ml-res").innerHTML=err("ocupados + desocupados no pueden superar la PET.");$("ml-st").innerHTML="";return}
      const R=PM.laboral({PET,O,D});
      $("ml-res").innerHTML=tiles([["Fuerza de trabajo (FT)",fmt(R.FT,0)],["Fuera de la fuerza de trabajo",fmt(R.FFT,0)],["Tasa global de participación",pc(R.TGP)],["Tasa de ocupación",pc(R.TO)],["Tasa de desempleo",pc(R.TD),"badt"]]);
      $("ml-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">FT = O + D = ${fmt(O,0)} + ${fmt(D,0)} = ${fmt(R.FT,0)}<br>TGP = FT/PET = ${fmt(R.FT,0)}/${fmt(PET,0)} = <b>${pc(R.TGP)}</b><br>TO = O/PET = ${fmt(O,0)}/${fmt(PET,0)} = <b>${pc(R.TO)}</b><br>TD = D/FT = ${fmt(D,0)}/${fmt(R.FT,0)} = <b>${pc(R.TD)}</b></div><p class="hint">Prueba: pasa 500.000 desocupados a «fuera de la fuerza de trabajo» (resta 500.000 a D). La TD baja aunque nadie consiguió empleo.</p>`)};
    onIn(["ml-pet","ml-o","ml-d"],run);run()},
   va(){B.innerHTML=`<h4 class="subh">Valor agregado por etapas</h4><p class="hint">Escribe el valor de las ventas de cada etapa de la cadena, en orden. Cada etapa compra como insumo lo que vendió la anterior.</p>
    <div class="calcf">${nin("mv-0","Etapa 1: agricultor (trigo)",10)}${nin("mv-1","Etapa 2: molino (harina)",40)}${nin("mv-2","Etapa 3: panadería (pan)",100)}</div><div id="mv-o"></div>
    <h4 class="subh">Del PIB al PNB</h4><div class="calcf">${nin("mp-pib","PIB",1000)}${nin("mp-in","Ingresos de factores nacionales en el exterior",20)}${nin("mp-out","Pagos a factores extranjeros en el país",60)}</div><div id="mp-o"></div>`;
    const run=()=>{const v=[0,1,2].map(i=>N("mv-"+i));if(v.every(isFinite)){const va=PM.valorAgregado(v),nm=["Agricultor","Molino","Panadería"];
      $("mv-o").innerHTML=`<div class="tbl"><table><tr><th>Etapa</th><th>Ventas</th><th>Insumos comprados</th><th>Valor agregado</th></tr>${v.map((x,i)=>`<tr><td>${nm[i]}</td><td class="num">${pp(x)}</td><td class="num">${pp(i?v[i-1]:0)}</td><td class="num">${pp(va[i])}</td></tr>`).join("")}<tr><th>Total</th><th class="num">${pp(v.reduce((a,b)=>a+b,0))}</th><th></th><th class="num">${pp(va.reduce((a,b)=>a+b,0))}</th></tr></table></div><p>La suma de los valores agregados (${pp(va.reduce((a,b)=>a+b,0))}) es igual al valor del bien final (${pp(v[2])}). Sumar todas las ventas (${pp(v.reduce((a,b)=>a+b,0))}) contaría dos veces los bienes intermedios.</p>`}
      const P=N("mp-pib"),a=N("mp-in"),b=N("mp-out");if([P,a,b].every(isFinite))$("mp-o").innerHTML=`<div class="eq al">PNB = PIB + (ingresos del exterior − pagos al exterior) = ${pp(P)} + (${pp(a)} − ${pp(b)}) = <b>${pp(P+a-b)}</b></div><p>${a<b?"Como el país paga más a factores extranjeros de lo que recibe, su PNB es menor que su PIB (es el caso de Colombia).":a>b?"El país recibe más del exterior de lo que paga: su PNB supera a su PIB.":"Los flujos se compensan: PNB = PIB."}</p>`};
    onIn(["mv-0","mv-1","mv-2","mp-pib","mp-in","mp-out"],run);run()}})};

// ---------- Ciclos con el filtro HP
function rngSeed(s){return()=>{s=(s*1664525+1013904223)%4294967296;return s/4294967296}}
function cicloEjemplo(){const r=rngSeed(7),g=()=>{let u=0;for(let k=0;k<6;k++)u+=r();return(u-3)/Math.sqrt(0.5)},T=80,c=[0,0];
  for(let t=2;t<T+2;t++)c.push(1.3*c[t-1]-0.45*c[t-2]+0.55*g());const cy=c.slice(2),S={};
  const mk=(tr0,gr,f)=>cy.map((v,t)=>+(Math.exp(tr0+gr*t+f(t)/100)).toFixed(2));
  S["PIB"]=mk(Math.log(100),0.008,t=>cy[t]);
  S["Consumo"]=mk(Math.log(65),0.008,t=>0.7*cy[t]+0.25*g());
  S["Inversión"]=mk(Math.log(20),0.009,t=>3*cy[t]+0.8*g());
  S["Empleo"]=mk(Math.log(50),0.004,t=>0.6*(t?cy[t-1]:0)+0.15*g());
  return S}
function parseSerie(txt){const out=[];txt.replace(/,\s+/g," ").split(/[\s;\t]+/).forEach(tk=>{if(!tk)return;let t=tk;if(t.includes(",")&&t.includes("."))t=t.replace(/\./g,"").replace(",",".");else t=t.replace(",",".");const v=parseFloat(t);if(isFinite(v))out.push(v)});return out}
SIMS.ciclo=function(){
  const EJ=cicloEjemplo();
  $("sim").innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:10px 18px">${seg("cy-src","Datos",[["ej","Ejemplo simulado"],["mis","Mis datos"]],"ej")}${seg("cy-lam","λ",[["1600","Trimestral λ = 1.600"],["100","Anual λ = 100"],["6.25","Anual λ = 6,25"]],"1600")}</div>
  <div id="cy-in"></div><div class="res" id="cy-res"></div>${legend([["--ink","Serie"],["--line","Tendencia HP"]])}<div id="cy-p1"></div><h4 class="subh">Componente cíclico (% de desviación respecto a la tendencia)</h4>${legend([["--ink","PIB"],["--branch","Otra variable"]])}<div id="cy-p2"></div><h4 class="subh">Hechos del ciclo</h4><div id="cy-t"></div>`;
  let src="ej",lam=1600,other="Inversión";
  const inp=()=>{$("cy-in").innerHTML=src==="ej"?`<p class="hint">Serie trimestral <b>simulada</b> de 80 trimestres, construida para que cumpla las regularidades del ciclo. Para trabajar con datos reales de Colombia usa «Mis datos» y pega las series del DANE (PIB trimestral desestacionalizado a precios constantes).</p><div style="margin:6px 0">${seg("cy-oth","Comparar con",Object.keys(EJ).filter(k=>k!=="PIB").map(k=>[k,k]),other)}</div>`
    :`<p class="hint">Pega los valores en orden cronológico, uno por línea o separados por espacios (sirven tanto 1.234,5 como 1234.5). La segunda serie es opcional y debe tener la misma cantidad de datos.</p><div class="calcf"><label for="cy-y">PIB (u otra serie principal)<textarea id="cy-y" rows="5" style="width:100%;font-family:var(--f-mono)">${EJ.PIB.slice(0,40).join("\n")}</textarea></label><label for="cy-x">Otra variable (opcional)<textarea id="cy-x" rows="5" style="width:100%;font-family:var(--f-mono)"></textarea></label>${`<label for="cy-xn">Nombre de la otra variable<input id="cy-xn" value="Consumo"></label>`}</div>`;
    if(src==="ej")bindSeg("cy-oth",v=>{other=v;run()});else onIn(["cy-y","cy-x","cy-xn"],run)};
  const run=()=>{let y,x,xn;if(src==="ej"){y=EJ.PIB;x=EJ[other];xn=other}else{y=parseSerie($("cy-y").value);x=parseSerie($("cy-x").value);xn=$("cy-xn").value||"Otra variable";if(x.length&&x.length!==y.length){$("cy-res").innerHTML=err(`la otra variable tiene ${x.length} datos y el PIB ${y.length}.`);return}}
    if(y.length<8){$("cy-res").innerHTML=err("hacen falta al menos 8 datos.");return}if(y.length>400){$("cy-res").innerHTML=err("máximo 400 datos.");return}
    if(y.some(v=>v<=0)||x.some(v=>v<=0)){$("cy-res").innerHTML=err("las series deben ser positivas (se usan logaritmos).");return}
    const Cy=PM.ciclo(y,lam),Cx=x.length?PM.ciclo(x,lam):null,T=y.length-1,sy=PM.desv(Cy.c);
    $("cy-res").innerHTML=tiles([["Datos",String(y.length)],["Volatilidad del ciclo del PIB",fmt(sy,2)+" %"],["Persistencia del ciclo (correlación con su rezago)",fmt(PM.corrRez(Cy.c,Cy.c,-1),2)],...(Cx?[[`Volatilidad relativa de ${xn}`,fmt(PM.desv(Cx.c)/sy,2)+" veces"]]:[])]);
    $("cy-p1").innerHTML=tsPlot(T,[{pts:y.map((v,t)=>[t,v]),col:"--ink",w:1.8},{pts:Cy.tend.map((v,t)=>[t,v]),col:"--line",w:2.6}],"nivel","Serie y tendencia de Hodrick-Prescott");
    $("cy-p2").innerHTML=tsPlot(T,[{pts:Cy.c.map((v,t)=>[t,v]),col:"--ink",w:2},...(Cx?[{pts:Cx.c.map((v,t)=>[t,v]),col:"--branch",w:2}]:[])],"% de la tendencia","Componentes cíclicos",{hlines:[{y:0}]});
    if(!Cx){$("cy-t").innerHTML=`<p>Agrega otra variable para ver su correlación con el PIB.</p>`;return}
    const js=[-4,-3,-2,-1,0,1,2,3,4],cs=js.map(j=>PM.corrRez(Cx.c,Cy.c,j)),c0=cs[4],best=js[cs.reduce((bi,c,i)=>Math.abs(c)>Math.abs(cs[bi])?i:bi,0)],rel=PM.desv(Cx.c)/sy;
    const cic=Math.abs(c0)<0.2?"acíclica":c0>0?"procíclica":"contracíclica",tim=best<0?"adelantada":best>0?"rezagada":"coincidente";
    $("cy-t").innerHTML=`<div class="tbl"><table><tr><th>j</th>${js.map(j=>`<th>${j}</th>`).join("")}</tr><tr><td>ρ(${esc(xn)}<sub>t+j</sub>, PIB<sub>t</sub>)</td>${cs.map((c,i)=>`<td class="num"${js[i]===best?' style="font-weight:700"':""}>${fmt(c,2)}</td>`).join("")}</tr></table></div>
      <div class="verdict acc">${esc(xn)} es <b>${cic}</b> (correlación contemporánea ${fmt(c0,2)}), <b>${Math.abs(c0)<0.2?"":tim}</b>${Math.abs(c0)<0.2?"":` (la correlación más fuerte está en j = ${best})`} y ${rel>1.05?`<b>más volátil</b> que el PIB (${fmt(rel,2)} veces)`:rel<0.95?`<b>menos volátil</b> que el PIB (${fmt(rel,2)} veces)`:"tan volátil como el PIB"}.</div>
      <p class="hint">Lectura: j &lt; 0 compara la variable de períodos anteriores con el PIB de hoy. Si la correlación más alta está en j &lt; 0, la variable se adelanta al PIB.</p>`};
  bindSeg("cy-src",v=>{src=v;inp();run()});bindSeg("cy-lam",v=>{lam=+v;run()});inp();run()};

// ---------- Crecimiento
SIMS.crec=function(){
  $("sim").innerHTML=tabsBox("cr",[["comp","Crecimiento compuesto"],["media","Tasa media"],["alc","¿Cuándo lo alcanza?"]]);const B=$("cr-b");
  tabsRun("cr",{
   comp(){B.innerHTML=`<div class="ctr">${ctl("cc-y0","Ingreso inicial y₀",100,50000,100,1000)}${ctl("cc-g","Tasa de crecimiento (%)",-3,10,0.1,2)}${ctl("cc-t","Años",1,150,1,70)}</div><div class="res" id="cc-res"></div>${seg("cc-sc","Escala",[["lin","Lineal"],["log","Logarítmica"]],"lin")}<div id="cc-p"></div><div id="cc-st"></div>`;
    let sc="lin";const run=()=>{const y0=V("cc-y0"),g=V("cc-g")/100,t=V("cc-t");if(!(y0>0&&g>-1&&t>0))return;const R=PM.crec({y0,g,t});
      $("cc-res").innerHTML=tiles([["Ingreso al final",fmt(R.yt,0)],["Se multiplica por",fmt(R.yt/y0,2)+" veces"],["Años para duplicarse",g>0?fmt(R.duplica,1):"nunca"],["Regla del 70",g>0?fmt(R.regla70,1):"—"]]);
      const pts=[...Array(101)].map((_,i)=>{const x=t*i/100,v=y0*Math.pow(1+g,x);return[x,sc==="log"?Math.log(v):v]});
      $("cc-p").innerHTML=tsPlot(t,[{pts,col:"--line"}],sc==="log"?"ln(ingreso)":"ingreso","Trayectoria del ingreso",{xl:"años"});
      $("cc-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">y<sub>t</sub> = ${fmt(y0,0)} · (1 + ${fmt(g,3)})<sup>${t}</sup> = <b>${fmt(R.yt,0)}</b><br>Duplicación exacta: ln 2 / ln(1 + ${fmt(g,3)}) = ${fmt(R.duplica,2)} años; regla del 70: 70/${fmt(100*g,1)} = ${fmt(R.regla70,2)} años</div>${sc==="log"?"<p>En escala logarítmica la trayectoria es una recta: su pendiente es ln(1 + g).</p>":""}`)};
    bindCtl(["cc-y0","cc-g","cc-t"],run);bindSeg("cc-sc",v=>{sc=v;run()});run()},
   media(){B.innerHTML=`<div class="calcf">${nin("cm-0","Valor inicial",1000)}${nin("cm-1","Valor final",8000)}${nin("cm-t","Años entre los dos",70)}</div><div id="cm-o"></div>`;
    const run=()=>{const a=N("cm-0"),b=N("cm-1"),T=N("cm-t");if(!(a>0&&b>0&&T>0))return;const g=PM.tasaMedia(a,b,T);
      $("cm-o").innerHTML=`<div class="res">${tiles([["Tasa media anual",pc(g)],["Veces que se duplicó",fmt(Math.log2(b/a),2)]])}</div><div class="eq al">ḡ = (${fmt(b,0)}/${fmt(a,0)})<sup>1/${T}</sup> − 1 = ${fmt(b/a,4)}<sup>${fmt(1/T,4)}</sup> − 1 = <b>${pc(g,3)}</b></div>`};
    onIn(["cm-0","cm-1","cm-t"],run);run()},
   alc(){B.innerHTML=`<div class="calcf">${nin("ca-y1","Ingreso del país pobre",1)}${nin("ca-g1","Su crecimiento (%)",5)}${nin("ca-y2","Ingreso del país rico",4)}${nin("ca-g2","Su crecimiento (%)",2)}</div><div id="ca-o"></div><div id="ca-p"></div>`;
    const run=()=>{const y1=N("ca-y1"),g1=N("ca-g1")/100,y2=N("ca-y2"),g2=N("ca-g2")/100;if(!(y1>0&&y2>0))return;const t=PM.alcance(y1,g1,y2,g2);
      $("ca-o").innerHTML=isFinite(t)?`<div class="eq al">${fmt(y1,2)}·(1 + ${fmt(g1,3)})<sup>t</sup> = ${fmt(y2,2)}·(1 + ${fmt(g2,3)})<sup>t</sup> ⟹ t = ${fr(`ln(${fmt(y2,2)}/${fmt(y1,2)})`,`ln(${fmt(1+g1,3)}/${fmt(1+g2,3)})`)} = <b>${fmt(t,1)} años</b></div>`:`<p class="warn">${y1>=y2&&g1>=g2?"El primero ya es igual o más rico.":"El país pobre crece igual o más despacio: nunca lo alcanza."}</p>`;
      const T=isFinite(t)?Math.max(10,t*1.3):100;$("ca-p").innerHTML=legend([["--line","País pobre"],["--branch","País rico"]])+tsPlot(T,[{pts:[...Array(81)].map((_,i)=>[T*i/80,Math.log(y1)+T*i/80*Math.log(1+g1)]),col:"--line"},{pts:[...Array(81)].map((_,i)=>[T*i/80,Math.log(y2)+T*i/80*Math.log(1+g2)]),col:"--branch"}],"ln(ingreso)","Trayectorias en escala logarítmica",{xl:"años"})};
    onIn(["ca-y1","ca-g1","ca-y2","ca-g2"],run);run()}})};

// ---------- Modelo de producción
SIMS.prod=function(){
  $("sim").innerHTML=tabsBox("pr",[["pagos","Producción y pagos a los factores"],["des","Contabilidad del desarrollo"]]);const B=$("pr-b");
  tabsRun("pr",{
   pagos(){B.innerHTML=`<div class="ctr">${ctl("pa-A","Productividad (Ā)",0.1,5,0.01,1)}${ctl("pa-K","Capital (K̄)",1,10000,1,1000)}${ctl("pa-L","Trabajo (L̄)",1,1000,1,100)}${ctl("pa-al","Exponente del capital (α)",0.1,0.9,0.01,0.3333)}</div><div class="res" id="pa-res"></div><div id="pa-st"></div><h4 class="subh">Rendimientos decrecientes: Y al variar K</h4><div id="pa-p"></div>`;
    const run=()=>{const v={A:V("pa-A"),K:V("pa-K"),L:V("pa-L"),al:alf(V("pa-al"))};if(!okAll(Object.values(v))||v.K<=0||v.L<=0||v.al<=0||v.al>=1)return;const R=PM.prod(v),a=fmt(v.al,4),b=fmt(1-v.al,4);
      $("pa-res").innerHTML=tiles([["Producción Y*",pp(R.Y)],["Por trabajador y*",pp(R.y,4)],["Salario w*",pp(R.w,4)],["Alquiler del capital r*",pp(R.r,4)],["Masa salarial / Y",pc(1-v.al,1)]]);
      $("pa-st").innerHTML=stp(1,"Solución",`<div class="eq al">Y* = ${fm(v.A)} · ${fm(v.K)}<sup>${a}</sup> · ${fm(v.L)}<sup>${b}</sup> = <b>${pp(R.Y)}</b><br>w* = (1 − α)·Y/L = ${b} · ${pp(R.Y)}/${fm(v.L)} = <b>${pp(R.w,4)}</b><br>r* = α·Y/K = ${a} · ${pp(R.Y)}/${fm(v.K)} = <b>${pp(R.r,4)}</b><br>w*L + r*K = ${pp(R.masaW)} + ${pp(R.masaR)} = ${pp(R.masaW+R.masaR)} = Y*</div><p>Los pagos a los factores agotan la producción: no queda ganancia económica.</p>`);
      const km=v.K*2.2;$("pa-p").innerHTML=plotXY({xr:[0,km],yr:[0,PM.prod({...v,K:km}).Y*1.05],series:[{f:k=>PM.prod({...v,K:Math.max(k,1e-9)}).Y,col:"--line"}],points:[{x:v.K,y:R.Y,label:"actual"}],xl:"capital (K)",yl:"producción (Y)",label:"Producción en función del capital"})};
    bindCtl(["pa-A","pa-K","pa-L","pa-al"],run);run()},
   des(){const D=[["Estados Unidos",1,1],["País A",0.25,0.3],["País B",0.6,0.7],["País C",0.05,0.04],["",0,0]];
    B.innerHTML=`<p class="hint">Escribe el ingreso por trabajador (y) y el capital por trabajador (k) <b>relativos a Estados Unidos</b> (EE. UU. = 1). Los países de ejemplo son ilustrativos: reemplázalos con los de la tabla del libro o de Penn World Table.</p>
    <div class="calcf" style="max-width:220px">${nin("de-al","α",0.3333,0.01)}</div>
    <div class="tbl"><table><thead><tr><th>País</th><th>y</th><th>k</th><th>Predicho k<sup>α</sup></th><th>PTF implícita</th><th>Brecha por capital</th><th>Brecha por PTF</th></tr></thead><tbody>${D.map((r,i)=>`<tr><td><input id="de-n${i}" value="${r[0]}" style="width:9em" aria-label="País ${i+1}"></td><td><input type="number" id="de-y${i}" value="${r[1]}" step="0.01" style="width:5em" aria-label="y país ${i+1}"></td><td><input type="number" id="de-k${i}" value="${r[2]}" step="0.01" style="width:5em" aria-label="k país ${i+1}"></td><td class="num" id="de-p${i}"></td><td class="num" id="de-a${i}"></td><td class="num" id="de-bk${i}"></td><td class="num" id="de-ba${i}"></td></tr>`).join("")}</tbody></table></div><div id="de-o"></div>`;
    const run=()=>{const al=alf(N("de-al"));if(!(al>0&&al<1))return;let ej=null;D.forEach((_,i)=>{const y=N("de-y"+i),k=N("de-k"+i),ok=y>0&&k>0,R=ok?PM.desarrollo({y,k,al}):null;
      $("de-p"+i).textContent=ok?fmt(R.pred,3):"";$("de-a"+i).textContent=ok?fmt(R.A,3):"";$("de-bk"+i).textContent=ok?fmt(R.porK,2)+"×":"";$("de-ba"+i).textContent=ok?fmt(R.porA,2)+"×":"";if(ok&&!ej&&y<1)ej={n:$("de-n"+i).value,y,k,R}});
      $("de-o").innerHTML=ej?stp(1,`Lectura para ${esc(ej.n||"el primer país")}`,`<div class="eq al">Predicho con la PTF de EE. UU.: ${fmt(ej.k,2)}<sup>${fmt(al,3)}</sup> = ${fmt(ej.R.pred,3)}<br>PTF implícita: ${fmt(ej.y,2)}/${fmt(ej.R.pred,3)} = <b>${fmt(ej.R.A,3)}</b><br>Brecha total ${fmt(ej.R.brecha,2)}× = ${fmt(ej.R.porK,2)}× (capital) · ${fmt(ej.R.porA,2)}× (PTF)</div><p>${ej.R.porA>ej.R.porK?"La productividad explica más de la brecha que el capital, como concluye Jones.":"En este caso el capital explica más de la brecha que la productividad."}</p>`):""};
    B.querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()}})};

// ---------- Solow
SIMS.solow=function(){
  const P=[["s","Tasa de ahorro (s̄)",0.01,0.9,0.01,0.2],["d","Depreciación (d̄)",0.01,0.5,0.01,0.1],["A","Productividad (Ā)",0.2,3,0.01,1],["L","Trabajo (L̄)",10,500,1,100]];
  $("sim").innerHTML=`<h4 class="subh">Parámetros iniciales</h4><div class="ctr">${P.map(([k,l,a,b,s,v])=>ctl("so-"+k,l,a,b,s,v)).join("")}${ctl("so-al","Exponente del capital (α)",0.1,0.8,0.01,0.3333)}${ctl("so-k0","Capital inicial (% de K*)",10,200,1,100)}</div>
  <h4 class="subh">Después del cambio (desde el período 5)</h4><div class="ctr">${P.map(([k,l,a,b,s,v])=>ctl("sn-"+k,l,a,b,s,k==="s"?0.3:v)).join("")}</div>
  <div class="res" id="so-res"></div><h4 class="subh">Diagrama de Solow</h4>${legend([["--line","Inversión s̄Y (inicial)",1],["--line","Inversión s̄Y (nueva)"],["--branch","Depreciación d̄K (inicial)",1],["--branch","Depreciación d̄K (nueva)"]])}<div id="so-dg"></div>
  <h4 class="subh">Trayectorias</h4>${legend([["--ink","Producción Y"],["--muted","Estado estacionario"]])}<div id="so-y"></div>${legend([["--exam","Crecimiento de y (%)"]])}<div id="so-g"></div><div id="so-st"></div>`;
  const ids=[...P.map(p=>"so-"+p[0]),"so-al","so-k0",...P.map(p=>"sn-"+p[0])];
  const run=()=>{const al=alf(V("so-al")),b={al},n={al};P.forEach(([k])=>{b[k]=V("so-"+k);n[k]=V("sn-"+k)});if(!okAll([...Object.values(b),...Object.values(n)])||al<=0||al>=1||b.d<=0||n.d<=0)return;
    const E0=PM.solowEE(b),E1=PM.solowEE(n),K0=E0.K*V("so-k0")/100,T=60,t0=5,S=PM.solowSim(b,n,t0,T,K0),ch=["s","d","A","L"].filter(k=>b[k]!==n[k]);
    $("so-res").innerHTML=tiles([VIS.tile("Capital K*",E0.K,E1.K),VIS.tile("Producción Y*",E0.Y,E1.Y),VIS.tile("Por trabajador y*",E0.y,E1.y,3),VIS.tile("Consumo C*",E0.C,E1.C)]);
    const km=Math.max(E0.K,E1.K,K0)*1.6,inv=p=>K=>p.s*p.A*Math.max(K,0)**p.al*p.L**(1-p.al);
    $("so-dg").innerHTML=plotXY({xr:[0,km],yr:[0,Math.max(inv(b)(km),inv(n)(km),b.d*km,n.d*km)*1.05],series:[{f:inv(b),col:"--line",dash:"7 5",w:2},{f:K=>b.d*K,col:"--branch",dash:"7 5",w:2},{f:inv(n),col:"--line"},{f:K=>n.d*K,col:"--branch"}],points:[{x:E0.K,y:b.d*E0.K,label:"K*"},...(ch.length?[{x:E1.K,y:n.d*E1.K,col:"--exam",label:"K*′"}]:[])],xl:"capital (K)",yl:"inversión y depreciación",label:"Diagrama de Solow"});
    $("so-y").innerHTML=tsPlot(T,[{pts:S.map(o=>[o.t,o.Y]),col:"--ink"}],"Y","Trayectoria de la producción",{hlines:[{y:E0.Y},{y:E1.Y}]});
    $("so-g").innerHTML=tsPlot(T,[{pts:S.slice(1).map(o=>[o.t,100*o.gy]),col:"--exam"}],"g_y (%)","Tasa de crecimiento de la producción por trabajador",{hlines:[{y:0}],H:190});
    const f=v=>fmt(v,4),ex=fmt(1/(1-al),4),ey=fmt(al/(1-al),4);
    $("so-st").innerHTML=stp(1,"Estado estacionario inicial",`<div class="eq al">K* = (s̄Ā/d̄)<sup>1/(1−α)</sup>·L̄ = (${f(b.s)}·${f(b.A)}/${f(b.d)})<sup>${ex}</sup> · ${fm(b.L)} = <b>${pp(E0.K)}</b><br>Y* = Ā·K*<sup>α</sup>·L̄<sup>1−α</sup> = <b>${pp(E0.Y)}</b> &nbsp; y* = Ā<sup>${ex}</sup>(s̄/d̄)<sup>${ey}</sup> = <b>${pp(E0.y,4)}</b><br>C* = (1 − s̄)Y* = ${pp(E0.C)}</div>`)
      +(ch.length?stp(2,"Después del cambio",`<div class="eq al">K*′ = ${pp(E1.K)}, Y*′ = ${pp(E1.Y)}, y*′ = ${pp(E1.y,4)} (${E1.y>=E0.y?"+":""}${pc(E1.y/E0.y-1)})</div><p>En el período ${t0} cambia ${ch.map(k=>({s:"la tasa de ahorro",d:"la depreciación",A:"la productividad",L:"el trabajo"})[k]).join(" y ")}. ${E1.K>S[t0].K?"La inversión supera a la depreciación: el capital crece, rápido al principio y cada vez más despacio (dinámica de transición).":"La depreciación supera a la inversión: el capital cae hasta el nuevo estado estacionario."} Después de ${T-t0} períodos, Y = ${pp(S[T].Y)}.</p>`):stp(2,"Sin cambio",`<p>${V("so-k0")!==100?`La economía empieza con ${fmt(V("so-k0"),0)} % del capital de estado estacionario y ${V("so-k0")<100?"crece":"decrece"} hacia él.`:"Mueve los parámetros de «Después del cambio» para ver la dinámica de transición."}</p>`))};
  bindCtl(ids,run);run()};

// ---------- Regla de oro
SIMS.oro=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("or-s","Tasa de ahorro (s̄)",0.01,0.95,0.01,0.2)}${ctl("or-d","Depreciación (d̄)",0.01,0.5,0.01,0.1)}${ctl("or-A","Productividad (Ā)",0.2,3,0.01,1)}${ctl("or-al","α",0.1,0.8,0.01,0.3333)}</div><div class="res" id="or-res"></div>${legend([["--line","Consumo de estado estacionario c*(s̄)"]])}<div id="or-p"></div><div class="verdict acc" id="or-v"></div>`;
  const run=()=>{const s=V("or-s"),p={d:V("or-d"),A:V("or-A"),al:alf(V("or-al"))};if(!(s>0&&s<1&&p.d>0&&p.al>0&&p.al<1))return;const c=PM.cEE(s,p),co=PM.cEE(p.al,p);
    $("or-res").innerHTML=tiles([["c* con tu s̄",fmt(c,4)],["s̄ de la regla de oro = α",pc(p.al,1)],["c* máximo",fmt(co,4),"okt"]]);
    $("or-p").innerHTML=plotXY({xr:[0,1],yr:[0,co*1.15],series:[{f:x=>PM.cEE(Math.max(x,1e-6),p),col:"--line"}],vlines:[{x:p.al}],points:[{x:s,y:c,label:"tú"},{x:p.al,y:co,col:"--exam",label:"oro"}],xl:"tasa de ahorro s̄",yl:"c*",label:"Consumo de estado estacionario según la tasa de ahorro"});
    $("or-v").textContent=Math.abs(s-p.al)<0.005?"Estás en la regla de oro: ningún otro s̄ da más consumo en estado estacionario.":s<p.al?"Ahorras menos que la regla de oro: subir el ahorro aumentaría el consumo de largo plazo (a costa de consumir menos durante la transición).":"Ahorras más que la regla de oro: bajar el ahorro aumentaría el consumo hoy y en el largo plazo (ineficiencia dinámica)."};
  bindCtl(["or-s","or-d","or-A","or-al"],run);run()};

// ---------- Contabilidad del crecimiento
SIMS.contab=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ct-y","Crecimiento de y (%)",-5,10,0.1,2)}${ctl("ct-k","Crecimiento de k (%)",-5,15,0.1,2.4)}${ctl("ct-al","α",0.1,0.8,0.01,0.3333)}</div><div class="res" id="ct-res"></div><div id="ct-st"></div>`;
  const run=()=>{const gy=V("ct-y"),gk=V("ct-k"),al=alf(V("ct-al"));if(!okAll([gy,gk,al]))return;const R=PM.contab({gy,gk,al});
    $("ct-res").innerHTML=tiles([["Aporte del capital α·g_k",fmt(R.ck,2)+" pp"],["Crecimiento de la PTF g_A",fmt(R.gA,2)+" pp"],...(gy?[["Parte del capital",pc(R.partK,1)],["Parte de la PTF",pc(R.partA,1)]]:[])]);
    $("ct-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">g<sub>A</sub> = g<sub>y</sub> − α·g<sub>k</sub> = ${fmt(gy,2)} − ${fmt(al,4)} · ${fmt(gk,2)} = <b>${fmt(R.gA,2)}</b> puntos</div>`)};
  bindCtl(["ct-y","ct-k","ct-al"],run);run()};

// ---------- Mercado laboral
SIMS.trab=function(){
  $("sim").innerHTML=tabsBox("tr",[["ban","Modelo de la bañera"],["smin","Salario mínimo"],["vpd","Valor de estudiar"]]);const B=$("tr-b");
  tabsRun("tr",{
   ban(){B.innerHTML=`<div class="ctr">${ctl("tb-s","Tasa de separación s̄ (% mensual)",0.1,10,0.1,1)}${ctl("tb-f","Tasa de colocación f̄ (% mensual)",1,80,0.5,20)}${ctl("tb-u0","Desempleo inicial (%)",0,40,0.5,10)}${ctl("tb-T","Meses",6,120,1,36)}</div><div class="res" id="tb-res"></div>${legend([["--bad","Tasa de desempleo u_t"],["--muted","Tasa natural u*"]])}<div id="tb-p"></div><div id="tb-st"></div>`;
    const run=()=>{const s=V("tb-s")/100,f=V("tb-f")/100,u0=V("tb-u0")/100,T=Math.round(V("tb-T"));if(!(s>0&&f>0&&T>0))return;const R=PM.banera({s,f,L:100,u0,T}),h=R.path.findIndex(o=>Math.abs(o.u-R.ust)<=Math.abs(u0-R.ust)/2);
      $("tb-res").innerHTML=tiles([["Tasa natural u*",pc(R.ust),"badt"],["Duración media del desempleo",fmt(1/f,1)+" meses"],["Meses para cerrar la mitad de la brecha",h>0?String(h):"—"]]);
      $("tb-p").innerHTML=tsPlot(T,[{pts:R.path.map(o=>[o.t,100*o.u]),col:"--bad"}],"u (%)","Dinámica de la tasa de desempleo",{hlines:[{y:100*R.ust}],ys:[0],xl:"meses"});
      const p1=R.path[1];$("tb-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">u* = ${fr("s̄","s̄ + f̄")} = ${fr(fmt(s,3),fmt(s,3)+" + "+fmt(f,3))} = <b>${pc(R.ust)}</b><br>Mes 1: ΔU = s̄E − f̄U = ${fmt(s,3)}·${fmt(100-100*u0,2)} − ${fmt(f,3)}·${fmt(100*u0,2)} = ${fmt(p1.U-100*u0,3)} (por cada 100 personas de la fuerza de trabajo)</div><p>${u0>R.ust?"Como el desempleo empieza por encima de su tasa natural, salen más desempleados de los que entran y la tasa baja.":u0<R.ust?"Como empieza por debajo de la tasa natural, entran más de los que salen y la tasa sube.":"Ya está en su tasa natural."}</p>`)};
    bindCtl(["tb-s","tb-f","tb-u0","tb-T"],run);run()},
   smin(){B.innerHTML=`<p class="hint">Demanda L<sup>d</sup> = a − b·w y oferta L<sup>s</sup> = c + e·w.</p><div class="ctr">${ctl("tm-a","a (intercepto demanda)",50,300,1,150)}${ctl("tm-b","b (pendiente demanda)",0.5,20,0.1,5)}${ctl("tm-c","c (intercepto oferta)",0,100,1,30)}${ctl("tm-e","e (pendiente oferta)",0.5,20,0.1,5)}${ctl("tm-w","Salario mínimo",0,30,0.1,15)}</div><div class="res" id="tm-res"></div>${legend([["--line","Demanda de trabajo"],["--branch","Oferta de trabajo"],["--bad","Salario mínimo"]])}<div id="tm-p"></div><div id="tm-st"></div>`;
    const run=()=>{const v={a:V("tm-a"),b:V("tm-b"),c:V("tm-c"),e:V("tm-e"),wmin:V("tm-w")};if(!okAll(Object.values(v))||v.b<=0||v.e<=0)return;const R=PM.trabajo(v),wm=Math.max(R.w,v.wmin)*1.6||10;
      $("tm-res").innerHTML=tiles([["Salario de equilibrio",pp(R.w)],["Empleo de equilibrio",pp(R.L)],["Empleo con el mínimo",pp(R.Ld)],["Desempleo por el mínimo",pp(R.des),R.des>0?"badt":""]]);
      $("tm-p").innerHTML=plotXY({xr:[0,Math.max(v.a,v.c+v.e*wm)*1.05],yr:[0,wm],series:[{f:L=>(v.a-L)/v.b,col:"--line"},{f:L=>(L-v.c)/v.e,col:"--branch"}],hlines:[{y:v.wmin,col:"--bad",dash:"0",w:2}],points:[{x:R.L,y:R.w,label:"E"},...(R.des>0?[{x:R.Ld,y:v.wmin,col:"--bad",label:"Ld"},{x:R.Ls,y:v.wmin,col:"--bad",label:"Ls"}]:[])],xl:"trabajo (L)",yl:"salario (w)",label:"Mercado de trabajo con salario mínimo"});
      $("tm-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">Equilibrio: ${fm(v.a)} − ${fm(v.b)}w = ${fm(v.c)} + ${fm(v.e)}w ⟹ w* = ${fr(fm(v.a)+" − "+fm(v.c),fm(v.b)+" + "+fm(v.e))} = <b>${pp(R.w)}</b>, L* = ${pp(R.L)}</div>${R.des>0?`<div class="eq al">Con w = ${fm(v.wmin)}: L<sup>d</sup> = ${pp(R.Ld)}, L<sup>s</sup> = ${pp(R.Ls)} ⟹ desempleo = ${pp(R.des)}</div>`:`<p>El mínimo (${fm(v.wmin)}) está por debajo del salario de equilibrio: no tiene efecto.</p>`}`)};
    bindCtl(["tm-a","tm-b","tm-c","tm-e","tm-w"],run);run()},
   vpd(){B.innerHTML=`<div class="calcf">${nin("tv-w0","Salario anual sin estudios",20000000)}${nin("tv-w1","Salario anual con estudios",40000000)}${nin("tv-e","Años de estudio",5)}${nin("tv-c","Costo anual de estudiar",8000000)}${nin("tv-n","Años de vida laboral desde hoy",45)}${nin("tv-R","Tasa de descuento (%)",5,0.1)}</div><div id="tv-o"></div>`;
    const run=()=>{const w0=N("tv-w0"),w1=N("tv-w1"),e=Math.round(N("tv-e")),c=N("tv-c"),n=Math.round(N("tv-n")),R=N("tv-R")/100;if(![w0,w1,e,c,n,R].every(isFinite)||e>=n||R<=-1)return;
      const v0=PM.vpd(w0,R,n),dis=Math.pow(1+R,-e),v1=PM.vpd(w1,R,n-e)*dis-PM.vpd(c,R,e);
      $("tv-o").innerHTML=`<div class="res">${tiles([["VPD sin estudios",fmt(v0,0)],["VPD con estudios (neto del costo)",fmt(v1,0)],["Diferencia",fmt(v1-v0,0),v1>v0?"okt":"badt"]])}</div><div class="eq al">Sin estudios: ${fmt(w0,0)} · Σ<sub>t=0</sub><sup>${n-1}</sup> 1/(1+${fmt(R,3)})<sup>t</sup> = ${fmt(v0,0)}<br>Con estudios: [${fmt(w1,0)} · Σ<sub>t=0</sub><sup>${n-e-1}</sup> 1/(1+${fmt(R,3)})<sup>t</sup>] / (1+${fmt(R,3)})<sup>${e}</sup> − costo ${fmt(PM.vpd(c,R,e),0)} = ${fmt(v1,0)}</div><p>${v1>v0?"Estudiar es una buena inversión con estos datos.":"Con estos datos, estudiar no compensa en dinero."} Sube la tasa de descuento para ver que la educación pierde valor cuando el futuro pesa menos.</p>`};
    onIn(["tv-w0","tv-w1","tv-e","tv-c","tv-n","tv-R"],run);run()}})};

// ---------- Inflación
SIMS.infl=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("in-m","Crecimiento del dinero g_M (%)",-5,100,0.5,10)}${ctl("in-y","Crecimiento real g_Y (%)",-5,10,0.1,3)}${ctl("in-v","Crecimiento de la velocidad g_V (%)",-10,10,0.1,0)}${ctl("in-R","Tasa de interés real R (%)",-5,10,0.1,2)}</div><div class="res" id="in-res"></div><div id="in-st"></div><h4 class="subh">Diez años con estas tasas (M₀ = 100, V₀ = 1, Y₀ = 100)</h4><div id="in-t"></div>`;
  const run=()=>{const gM=V("in-m"),gY=V("in-y"),gV=V("in-v"),R=V("in-R");if(!okAll([gM,gY,gV,R]))return;const pi=PM.cuantitativa({gM,gV,gY}).pi,i=PM.fisher({R,pi}).i;
    $("in-res").innerHTML=tiles([["Inflación π",fmt(pi,2)+" %",pi>50?"badt":""],["Tasa nominal i = R + π",fmt(i,2)+" %"],["Años para que los precios se dupliquen",pi>0?fmt(70/pi,1):"—"]]);
    $("in-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">π = g<sub>M</sub> + g<sub>V</sub> − g<sub>Y</sub> = ${fmt(gM,2)} + ${fmt(gV,2)} − ${fmt(gY,2)} = <b>${fmt(pi,2)} %</b><br>i = R + π = ${fmt(R,2)} + ${fmt(pi,2)} = <b>${fmt(i,2)} %</b></div>${pi>50?`<p class="warn">Con más de 50 % mensual se habla de hiperinflación (criterio de Cagan); con estas tasas anuales la economía ya tiene una inflación muy alta.</p>`:""}`);
    let rows="";for(let t=0;t<=10;t+=2){const M=100*Math.pow(1+gM/100,t),Vv=Math.pow(1+gV/100,t),Y=100*Math.pow(1+gY/100,t);rows+=`<tr><td>${t}</td><td class="num">${fmt(M,1)}</td><td class="num">${fmt(Vv,3)}</td><td class="num">${fmt(Y,1)}</td><td class="num">${fmt(PM.nivelP({M,V:Vv,Y}),3)}</td></tr>`}
    $("in-t").innerHTML=`<div class="tbl"><table><tr><th>Año</th><th>M</th><th>V</th><th>Y</th><th>P = MV/Y</th></tr>${rows}</table></div>`};
  bindCtl(["in-m","in-y","in-v","in-R"],run);run()};

// ---------- Okun y Phillips
SIMS.okun=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ok-Y","Producción Y",50,150,0.1,97)}${ctl("ok-Yp","Producto potencial Ȳ",50,150,0.1,100)}${ctl("ok-u","Tasa natural de desempleo ū (%)",1,20,0.1,5)}${ctl("ok-nu","Sensibilidad ν̄",0.05,2,0.05,0.5)}${ctl("ok-pi","Inflación del período anterior (%)",-5,30,0.1,4)}${ctl("ok-o","Choque de precios ō (pp)",-5,5,0.1,0)}</div><div class="res" id="ok-res"></div><div id="ok-st"></div>`;
  const run=()=>{const Y=V("ok-Y"),Yp=V("ok-Yp"),u_=V("ok-u"),nu=V("ok-nu"),pi0=V("ok-pi"),o=V("ok-o");if(!okAll([Y,Yp,u_,nu,pi0,o])||Yp<=0)return;const Yt=100*PM.brecha(Y,Yp),R=PM.okun({Yt,u_,nu,pi0}),pi=R.pi+o;
    $("ok-res").innerHTML=tiles([["Brecha Ỹ",fmt(Yt,2)+" %",Yt<0?"badt":"okt"],["Desempleo u (Okun)",fmt(R.u,2)+" %"],["Inflación π (Phillips)",fmt(pi,2)+" %"],["Cambio de la inflación Δπ",fmt(pi-pi0,2)+" pp"]]);
    $("ok-st").innerHTML=stp(1,"Brecha",`<div class="eq al">Ỹ = (Y − Ȳ)/Ȳ = (${fm(Y)} − ${fm(Yp)})/${fm(Yp)} = <b>${fmt(Yt,2)} %</b></div>`)+stp(2,"Ley de Okun",`<div class="eq al">u = ū − ½Ỹ = ${fm(u_)} − ½(${fmt(Yt,2)}) = <b>${fmt(R.u,2)} %</b></div>`)+stp(3,"Curva de Phillips",`<div class="eq al">π<sub>t</sub> = π<sub>t−1</sub> + ν̄Ỹ<sub>t</sub> + ō = ${fm(pi0)} + ${fm(nu)}·(${fmt(Yt,2)}) + ${fm(o)} = <b>${fmt(pi,2)} %</b></div><p>${Yt<0?"La economía produce por debajo de su potencial: hay más desempleo que el natural y la inflación baja.":Yt>0?"La economía produce por encima de su potencial: el desempleo es menor que el natural y la inflación sube.":"La economía está en su potencial: la inflación solo cambia por el choque ō."}</p>`)};
  bindCtl(["ok-Y","ok-Yp","ok-u","ok-nu","ok-pi","ok-o"],run);run()};

// ---------- Apalancamiento
SIMS.apal=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ap-A","Activos",10,1000,1,100)}${ctl("ap-E","Patrimonio",0.5,200,0.5,4)}${ctl("ap-c","Caída del valor de los activos (%)",0,50,0.1,3)}</div><div class="res" id="ap-res"></div><div id="ap-p"></div><div id="ap-st"></div>`;
  const run=()=>{const A=V("ap-A"),E=V("ap-E"),c=V("ap-c")/100;if(!(A>0&&E>0&&E<=A))return;const R=PM.apal({A,E,caida:c}),D=A-E;
    $("ap-res").innerHTML=tiles([["Apalancamiento A/E",fmt(R.lev,1)+" veces"],["Pérdida",pp(R.perd)],["Patrimonio después",pp(R.E1),R.quiebra?"badt":""],["Cambio del patrimonio",pc(R.cEq,1),"badt"]]);
    const bar=(lab,a,d,e)=>{const s=280/A;return `<g><text x="0" y="16" font-size="12" fill="var(--ink)">${lab}</text><rect x="0" y="24" width="120" height="${a*s}" fill="var(--line)" fill-opacity=".75"/><text x="60" y="${24+a*s/2}" text-anchor="middle" font-size="11" fill="var(--card)">Activos ${fmt(a,1)}</text><rect x="130" y="24" width="120" height="${d*s}" fill="var(--muted)" fill-opacity=".5"/><text x="190" y="${24+d*s/2}" text-anchor="middle" font-size="11" fill="var(--ink)">Deuda ${fmt(d,1)}</text>${e>0?`<rect x="130" y="${24+d*s}" width="120" height="${Math.max(e*s,1)}" fill="var(--good)"/>`:""}<text x="256" y="${24+d*s+8}" font-size="11" fill="var(${e>0?"--good":"--bad"})">${e>0?"Patrimonio "+fmt(e,2):"Patrimonio "+fmt(e,2)+" (insolvente)"}</text></g>`};
    $("ap-p").innerHTML=`<div class="plot"><svg viewBox="0 0 640 320" role="img" aria-label="Hoja de balance antes y después"><g transform="translate(10,0)">${bar("Antes",A,D,E)}</g><g transform="translate(330,0)">${bar("Después",R.A1,D,R.E1)}</g></svg></div>`;
    const venta=R.E1>0?R.A1-R.lev*R.E1:NaN;
    $("ap-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">Apalancamiento = ${fm(A)}/${fm(E)} = ${fmt(R.lev,2)}<br>%ΔE = apalancamiento × %ΔA = ${fmt(R.lev,2)} × (−${fmt(100*c,2)} %) = <b>${pc(R.cEq,1)}</b></div>${R.quiebra?`<p class="warn">La pérdida supera al patrimonio: el banco queda insolvente. Basta una caída de ${pc(1/R.lev,2)} en los activos.</p>`:`<p>Para volver al apalancamiento de ${fmt(R.lev,1)} sin conseguir capital nuevo, el banco tendría que vender activos por ${pp(venta)} y dejar de prestar: así una pérdida pequeña se convierte en un recorte grande del crédito.</p>`}`)};
  bindCtl(["ap-A","ap-E","ap-c"],run);run()};

// ---------- Curva IS
SIMS.is=function(){
  const C=[["ac","Consumo ā_c (% de Ȳ)",40,80,0.5,60],["ai","Inversión ā_i (% de Ȳ)",5,40,0.5,17],["ag","Gobierno ā_g (% de Ȳ)",5,40,0.5,20],["aex","Exportaciones ā_ex (% de Ȳ)",0,50,0.5,13],["aim","Importaciones ā_im (% de Ȳ)",0,50,0.5,10]];
  $("sim").innerHTML=`<div class="ctr">${C.map(c=>ctl("is-"+c[0],...c.slice(1))).join("")}${ctl("is-b","Sensibilidad b̄",0.1,3,0.05,0.5)}${ctl("is-r","Tasa real de largo plazo r̄ (%)",0,10,0.1,2)}${ctl("is-R","Tasa real R (%)",-3,15,0.1,2)}${ctl("is-x","Propensión x̄ (multiplicador)",0,0.9,0.01,0)}</div>
  <div class="res" id="is-res"></div>${legend([["--line","IS"],["--branch","MP: R fijada por el banco central"]])}<div id="is-p"></div><div id="is-st"></div>`;
  const ids=[...C.map(c=>"is-"+c[0]),"is-b","is-r","is-R","is-x"];
  const run=()=>{const v=Object.fromEntries(ids.map(i=>[i.slice(3),V(i)]));if(!okAll(Object.values(v))||v.x>=1)return;
    const R=PM.is({ac:v.ac/100,ai:v.ai/100,ag:v.ag/100,aex:v.aex/100,aim:v.aim/100,b:v.b,R:v.R,r:v.r,x:v.x}),a=100*R.a,Y=R.m*(a-v.b*(v.R-v.r));
    $("is-res").innerHTML=tiles([["Choque de demanda ā",fmt(a,2)+" %"],["Multiplicador 1/(1 − x̄)",fmt(R.m,2)],["Brecha Ỹ",fmt(Y,2)+" %",Y<0?"badt":Y>0?"okt":""]]);
    const yr=[Math.min(-1,v.R-3,v.r-3),Math.max(v.R+3,v.r+3)],IS=Rr=>R.m*(a-v.b*(Rr-v.r)),xs=[IS(yr[0]),IS(yr[1]),Y,0],xl=Math.max(...xs.map(Math.abs))*1.1||1;
    $("is-p").innerHTML=plotXY({xr:[-xl,xl],yr,series:[{f:y=>v.r+(a-y/R.m)/v.b,col:"--line"}],hlines:[{y:v.R,col:"--branch",dash:"0",w:2.5}],vlines:[{x:0}],points:[{x:Y,y:v.R,label:"E"}],xl:"brecha Ỹ (%)",yl:"R (%)",label:"Curva IS y recta MP"});
    $("is-st").innerHTML=stp(1,"Choque de demanda",`<div class="eq al">ā = ā<sub>c</sub> + ā<sub>i</sub> + ā<sub>g</sub> + ā<sub>ex</sub> − ā<sub>im</sub> − 100 = ${fm(v.ac)} + ${fm(v.ai)} + ${fm(v.ag)} + ${fm(v.aex)} − ${fm(v.aim)} − 100 = <b>${fmt(a,2)} %</b></div>`)
      +stp(2,"Brecha del producto",`<div class="eq al">Ỹ = ${v.x?`${fr("1","1 − "+fm(v.x))}·`:""}[ā − b̄(R − r̄)] = ${v.x?fmt(R.m,3)+"·":""}[${fmt(a,2)} − ${fm(v.b)}·(${fm(v.R)} − ${fm(v.r)})] = <b>${fmt(Y,2)} %</b></div><p>${a===0&&v.R===v.r?"Con ā = 0 y R = r̄ la economía está en su potencial.":`Para cerrar la brecha, el banco central tendría que fijar R = r̄ + ā/b̄ = ${fmt(v.r+a/v.b,2)} %.`}</p>`)};
  bindCtl(ids,run);run()};

// ---------- IS-MP-Phillips dinámico
const ISMP_PRE={volcker:{nm:"Desinflación de Volcker",v:{b:0.5,nu:0.5,pi0:10,T:10,pR:3,p1:1,p2:3,aS:0,a1:1,a2:0,oS:0,o1:1}},
  petro:{nm:"Choque petrolero sin respuesta",v:{b:0.5,nu:0.5,pi0:2,T:10,pR:0,p1:1,p2:1,aS:0,a1:1,a2:0,oS:2,o1:1}},
  dem:{nm:"Choque de demanda sin respuesta",v:{b:0.5,nu:0.5,pi0:2,T:10,pR:0,p1:1,p2:1,aS:1,a1:1,a2:10,oS:0,o1:1}},
  demr:{nm:"Choque de demanda con respuesta",v:{b:0.5,nu:0.5,pi0:2,T:10,pR:2,p1:1,p2:10,aS:1,a1:1,a2:10,oS:0,o1:1}},
  crisis:{nm:"Crisis financiera: sube la prima de riesgo",v:{b:0.5,nu:0.5,pi0:2,T:10,pR:2,p1:1,p2:3,aS:-1,a1:1,a2:3,oS:0,o1:1}}};
SIMS.ismp=function(){
  const F=[["b","Sensibilidad b̄",0.1,2,0.05,0.5],["nu","Pendiente de Phillips ν̄",0.05,2,0.05,0.5],["pi0","Inflación inicial π₀ (%)",-2,20,0.1,10],["T","Períodos",4,20,1,10],
    ["pR","Política: R − r̄ (pp)",-6,8,0.1,3],["p1","… desde el período",1,20,1,1],["p2","… hasta el período",1,20,1,3],
    ["aS","Choque de demanda ā (pp)",-5,5,0.1,0],["a1","… desde",1,20,1,1],["a2","… hasta",0,20,1,0],["oS","Choque de inflación ō (pp)",-5,5,0.1,0],["o1","… en el período",1,20,1,1]];
  $("sim").innerHTML=`<div class="chips pre" style="margin-bottom:8px"><span class="lbl">Ejemplos</span>${Object.entries(ISMP_PRE).map(([k,p])=>`<button type="button" data-ip="${k}">${p.nm}</button>`).join("")}</div>
  <div class="ctr">${F.map(f=>ctl("im-"+f[0],...f.slice(1))).join("")}</div><div class="res" id="im-res"></div>
  ${legend([["--branch","R − r̄ (pp)"],["--line","Brecha Ỹ (%)"]])}<div id="im-g1"></div>${legend([["--exam","Inflación π (%)"]])}<div id="im-g2"></div><div id="im-t"></div>`;
  const ids=F.map(f=>"im-"+f[0]);
  const run=()=>{const v=Object.fromEntries(F.map(f=>[f[0],V("im-"+f[0])]));if(!okAll(Object.values(v)))return;const T=Math.round(v.T);
    const S=PM.ismpSim({b:v.b,nu:v.nu,pi0:v.pi0,T},t=>t>=v.p1&&t<=v.p2?v.pR:0,t=>t>=v.a1&&t<=v.a2?v.aS:0,t=>t===v.o1?v.oS:0),L=S[T];
    $("im-res").innerHTML=tiles([["Inflación inicial",fmt(v.pi0,2)+" %"],["Inflación final",fmt(L.pi,2)+" %"],["Brecha acumulada ΣỸ",fmt(S.reduce((a,o)=>a+o.Y,0),2)+" %",S.reduce((a,o)=>a+o.Y,0)<0?"badt":""],["Brecha final",fmt(L.Y,2)+" %"]]);
    $("im-g1").innerHTML=tsPlot(T,[{pts:S.map(o=>[o.t,o.R]),col:"--branch"},{pts:S.map(o=>[o.t,o.Y]),col:"--line"}],"pp / %","Tasa real y brecha del producto",{hlines:[{y:0}],H:210});
    $("im-g2").innerHTML=tsPlot(T,[{pts:S.map(o=>[o.t,o.pi]),col:"--exam"}],"π (%)","Inflación",{H:200});
    $("im-t").innerHTML=`<div class="tbl"><table><tr><th>t</th><th>R − r̄</th><th>ā</th><th>Ỹ = ā − b̄(R − r̄)</th><th>π = π<sub>t−1</sub> + ν̄Ỹ + ō</th></tr>${S.map((o,i)=>{const a=o.t>=v.a1&&o.t<=v.a2?v.aS:0,oo=o.t===v.o1?v.oS:0,pp0=i?S[i-1].pi:v.pi0;return `<tr><td>${o.t}</td><td class="num">${fmt(o.R,2)}</td><td class="num">${fmt(a,2)}</td><td class="num">${fmt(a,2)} − ${fm(v.b)}·${fmt(o.R,2)} = <b>${fmt(o.Y,3)}</b></td><td class="num">${fmt(pp0,3)} + ${fm(v.nu)}·${fmt(o.Y,3)}${oo?" + "+fmt(oo,2):""} = <b>${fmt(o.pi,3)}</b></td></tr>`}).join("")}</table></div>`};
  bindCtl(ids,run);
  $("sim").querySelectorAll("[data-ip]").forEach(b=>b.onclick=()=>{const p=ISMP_PRE[b.dataset.ip].v;Object.entries(p).forEach(([k,x])=>{$("im-"+k).value=x;$("im-"+k+"-r").value=x});run()});
  run()};

// ---------- OA-DA dinámico
const OADA_PRE={petro:{nm:"Choque de inflación (petróleo)",v:{aS:0,a1:1,a2:0,oS:1,o1:1,o2:1,pin:2,pt:1,pi0:2}},
  demt:{nm:"Choque de demanda temporal",v:{aS:2,a1:1,a2:3,oS:0,o1:1,o2:0,pin:2,pt:1,pi0:2}},
  demp:{nm:"Choque de demanda permanente",v:{aS:1,a1:1,a2:30,oS:0,o1:1,o2:0,pin:2,pt:1,pi0:2}},
  desin:{nm:"Desinflación: la meta baja de 5 % a 2 %",v:{aS:0,a1:1,a2:0,oS:0,o1:1,o2:0,pin:2,pt:1,pi0:5}}};
SIMS.oada=function(){
  const F=[["b","b̄",0.1,2,0.05,0.5],["m","Agresividad de la regla m̄",0.1,3,0.05,0.5],["nu","ν̄",0.05,2,0.05,0.5],["pi0","Inflación inicial π₀ (%)",-2,20,0.1,2],["pib","Meta inicial π̄ (%)",0,10,0.1,2],["T","Períodos",4,30,1,12],
    ["aS","Choque de demanda ā (pp)",-5,5,0.1,0],["a1","… desde",1,30,1,1],["a2","… hasta",0,30,1,0],["oS","Choque de inflación ō (pp)",-5,5,0.1,1],["o1","… desde",1,30,1,1],["o2","… hasta",0,30,1,1],["pin","Nueva meta π̄′ (%)",0,10,0.1,2],["pt","… desde",1,30,1,1]];
  $("sim").innerHTML=`<div class="chips pre" style="margin-bottom:8px"><span class="lbl">Ejemplos</span>${Object.entries(OADA_PRE).map(([k,p])=>`<button type="button" data-op="${k}">${p.nm}</button>`).join("")}</div>
  <div class="ctr">${F.map(f=>ctl("oa-"+f[0],...f.slice(1))).join("")}</div><div class="res" id="oa-res"></div>
  ${legend([["--line","Brecha Ỹ (%)"],["--exam","Inflación π (%)"],["--muted","Meta π̄"]])}<div id="oa-p1"></div>
  <h4 class="subh">Diagrama OA-DA en un período</h4><div class="ctr">${ctl("oa-k","Período a mirar",0,30,1,1)}</div>${legend([["--line","DA"],["--branch","OA"],["--line","DA del período anterior",1],["--branch","OA del período anterior",1]])}<div id="oa-p2"></div><div id="oa-t"></div>`;
  const ids=F.map(f=>"oa-"+f[0]).concat("oa-k");
  const run=()=>{const v=Object.fromEntries(F.map(f=>[f[0],V("oa-"+f[0])]));if(!okAll(Object.values(v)))return;const T=Math.round(v.T);
    const aT=t=>t>=v.a1&&t<=v.a2?v.aS:0,oT=t=>t>=v.o1&&t<=v.o2?v.oS:0,pT=t=>t>=v.pt?v.pin:v.pib;
    const S=PM.oadaSim({b:v.b,m:v.m,nu:v.nu,pi0:v.pi0,T},aT,oT,pT),L=S[T],k=Math.min(T,Math.max(0,Math.round(V("oa-k")))),K=S[k],Kp=k?S[k-1]:null;
    $("oa-res").innerHTML=tiles([["Inflación inicial",fmt(v.pi0,2)+" %"],["Inflación en t = "+T,fmt(L.pi,2)+" %"],["Brecha en t = "+T,fmt(L.Y,2)+" %"],["Pérdida acumulada ΣỸ",fmt(S.reduce((a,o)=>a+o.Y,0),2)+" %"]]);
    $("oa-p1").innerHTML=tsPlot(T,[{pts:S.map(o=>[o.t,o.Y]),col:"--line"},{pts:S.map(o=>[o.t,o.pi]),col:"--exam"},{pts:S.map(o=>[o.t,o.pib]),col:"--muted",dash:"5 4",w:1.5}],"% / pp","Brecha e inflación",{hlines:[{y:0}],vlines:[{x:k,col:"--muted"}]});
    const DA=(o)=>y=>o.pib+(o.a-y)/(o.b*o.m),OA=(o)=>y=>o.piPrev+o.nu*y+o.o,ys=[K.Y,Kp?Kp.Y:0,0],xr=Math.max(3,...ys.map(Math.abs))*1.6,pis=[K.pi,K.piPrev,K.pib,Kp?Kp.pi:K.pi],lo=Math.min(...pis)-2,hi=Math.max(...pis)+2;
    $("oa-p2").innerHTML=plotXY({xr:[-xr,xr],yr:[lo,hi],series:[...(Kp?[{f:DA(Kp),col:"--line",dash:"7 5",w:1.8},{f:OA(Kp),col:"--branch",dash:"7 5",w:1.8}]:[]),{f:DA(K),col:"--line"},{f:OA(K),col:"--branch"}],vlines:[{x:0}],hlines:[{y:K.pib}],points:[...(Kp?[{x:Kp.Y,y:Kp.pi,col:"--muted",label:"t−1"}]:[]),{x:K.Y,y:K.pi,label:"t = "+k}],xl:"brecha Ỹ (%)",yl:"π (%)",label:"Oferta y demanda agregadas"});
    $("oa-t").innerHTML=stp(1,`Equilibrio del período ${k}`,`<div class="eq al">π<sub>${k}</sub> = ${fr(`π<sub>${k}−1</sub> + ν̄ā + ν̄b̄m̄π̄ + ō`,"1 + ν̄b̄m̄")} = ${fr(`${fmt(K.piPrev,3)} + ${fm(v.nu)}·${fm(K.a)} + ${fmt(v.nu*v.b*v.m,4)}·${fm(K.pib)} + ${fm(K.o)}`,fmt(1+v.nu*v.b*v.m,4))} = <b>${fmt(K.pi,3)} %</b><br>Ỹ<sub>${k}</sub> = ā − b̄m̄(π − π̄) = ${fm(K.a)} − ${fmt(v.b*v.m,4)}·(${fmt(K.pi,3)} − ${fm(K.pib)}) = <b>${fmt(K.Y,3)} %</b><br>Tasa real del banco central: R − r̄ = m̄(π − π̄) = <b>${fmt(K.R,3)}</b> pp</div>`)
      +`<div class="tbl"><table><tr><th>t</th><th>ā</th><th>ō</th><th>π̄</th><th>π</th><th>Ỹ</th><th>R − r̄</th></tr>${S.map(o=>`<tr${o.t===k?' style="font-weight:700"':""}><td>${o.t}</td><td class="num">${fmt(o.a,2)}</td><td class="num">${fmt(o.o,2)}</td><td class="num">${fmt(o.pib,2)}</td><td class="num">${fmt(o.pi,3)}</td><td class="num">${fmt(o.Y,3)}</td><td class="num">${fmt(o.R,3)}</td></tr>`).join("")}</table></div>`};
  bindCtl(ids,run);
  $("sim").querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>{const p=OADA_PRE[b.dataset.op].v;Object.entries(p).forEach(([k,x])=>{$("oa-"+k).value=x;$("oa-"+k+"-r").value=x});run()});
  run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Medición","PIB por el gasto","Y = C + I + G + X − M"],["Medición","PNB","PNB = PIB + ingresos netos de factores del exterior"],["Medición","Deflactor","100 · PIB nominal / PIB real"],["Medición","IPC (Laspeyres)","100 · Σ p_t q_base / Σ p_base q_base"],["Medición","Crecimiento encadenado","1 + g = √[(Σp_{t−1}q_t/Σp_{t−1}q_{t−1}) · (Σp_t q_t/Σp_t q_{t−1})]"],["Medición","Inflación","π_t = (P_t − P_{t−1})/P_{t−1}"],["Medición","Tasa de desempleo","TD = D / (O + D)"],["Medición","Participación y ocupación","TGP = FT/PET; TO = O/PET"],
    ["Ciclos","Filtro HP","min Σ(ln Y − τ)² + λ Σ(Δ²τ)²; λ = 1.600 trimestral, 100 anual"],["Ciclos","Componente cíclico","c_t = 100·(ln Y_t − τ_t) %"],
    ["Crecimiento","Crecimiento compuesto","y_t = y_0 (1 + g)^t"],["Crecimiento","Regla del 70","años para duplicar ≈ 70 / g(%)"],["Crecimiento","Tasa media","g = (y_T / y_0)^(1/T) − 1"],
    ["Producción","Función de producción","Y = Ā K^(1/3) L^(2/3)"],["Producción","Salario","w = (2/3) Y/L"],["Producción","Alquiler del capital","r = (1/3) Y/K"],["Producción","Contabilidad del desarrollo","y_i/y_EEUU = (A_i/A_EEUU)(k_i/k_EEUU)^(1/3)"],["Producción","Contabilidad del crecimiento","g_y = g_A + (1/3) g_k"],
    ["Solow","Acumulación de capital","ΔK_{t+1} = s̄Y_t − d̄K_t"],["Solow","Capital de estado estacionario","K* = (s̄Ā/d̄)^(3/2) L̄"],["Solow","Producción por trabajador","y* = Ā^(3/2) (s̄/d̄)^(1/2)"],["Solow","Regla de oro","s̄ = α"],
    ["Trabajo","Dinámica del desempleo","ΔU_{t+1} = s̄E_t − f̄U_t"],["Trabajo","Tasa natural","u* = s̄/(s̄ + f̄)"],["Trabajo","Valor presente","VPD = Σ w/(1 + R)^t"],
    ["Inflación","Ecuación cuantitativa","M V = P Y"],["Inflación","Inflación de largo plazo","π = g_M + g_V − g_Y"],["Inflación","Ecuación de Fisher","i = R + π"],
    ["Corto plazo","Brecha del producto","Ỹ = (Y − Ȳ)/Ȳ"],["Corto plazo","Ley de Okun","u − ū = −½ Ỹ"],["Corto plazo","Curva de Phillips","π_t = π_{t−1} + ν̄Ỹ_t + ō"],["Corto plazo","Apalancamiento","%ΔPatrimonio = (Activos/Patrimonio) · %ΔActivos"],
    ["IS","Curva IS","Ỹ = ā − b̄(R − r̄)"],["IS","Choque de demanda","ā = ā_c + ā_i + ā_g + ā_ex − ā_im − 1"],["IS","Con multiplicador","Ỹ = [ā − b̄(R − r̄)]/(1 − x̄)"],
    ["MP","Tasa real del banco central","R_t = i_t − π_t"],["MP","Tasa para cerrar la brecha","R = r̄ + ā/b̄"],
    ["OA-DA","Regla de política","R − r̄ = m̄(π − π̄)"],["OA-DA","Demanda agregada","Ỹ = ā − b̄m̄(π − π̄)"],["OA-DA","Oferta agregada","π_t = π_{t−1} + ν̄Ỹ_t + ō"],["OA-DA","Equilibrio","π_t = [π_{t−1} + ν̄ā + ν̄b̄m̄π̄ + ō]/(1 + ν̄b̄m̄)"],["OA-DA","Choque de demanda permanente","π = π̄ + ā/(b̄m̄)"],
    ["Keynesiano","Equilibrio","Y* = [C₀ − c₁T + I + G]/(1 − c₁)"],["Keynesiano","Multiplicadores","∂Y/∂G = 1/(1 − c₁); ∂Y/∂T = −c₁/(1 − c₁)"],["IS-LM","Mercado de dinero","M/P = kY − hr"],["IS-LM","Producción de equilibrio","Y* = [h(C₀ − c₁T + I₀ + G) + bM/P]/[h(1 − c₁) + bk]"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Solow"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));
    $("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};

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

// ===================== Escenas del programa (Jones) =====================
// 4. Diagrama de Solow. Base: s = 0,2; d = 0,1; Ā = 1; L̄ = 100; α = 1/3
VIS.add("solow",{t:"Modelo de Solow: inversión, depreciación y estado estacionario",panels:2,
  hint:"Arrastra la curva de inversión s̄Y (cambia la tasa de ahorro) o la recta de depreciación d̄K. Abajo, la trayectoria de la producción después del cambio.",
  p0:{s:0.2,d:0.1,A:1},lim:{s:[0.05,0.5],d:[0.04,0.25],A:[0.5,2]},
  presets:[["∆+s̄: ahorro de 20 % a 30 %",{s:0.3}],["∆+d̄: depreciación de 10 % a 15 %",{d:0.15}],["∆+Ā: productividad +20 %",{A:1.2}],["∆-s̄: ahorro a 12 %",{s:0.12}]],
  fit:{s:(K,y,st)=>y/(st.p.A*Math.max(K,1)**(1/3)*100**(2/3)),d:(K,y)=>y/Math.max(K,1)},
  compute(st){const{s,d,A}=st.p,b={s:0.2,d:0.1,A:1,L:100,al:1/3},n={s,d,A,L:100,al:1/3},E0=PM.solowEE(b),E1=PM.solowEE(n);
    const inv=p=>K=>p.s*p.A*Math.max(K,0)**(1/3)*100**(2/3),mv=Math.abs(s-0.2)>0.002||Math.abs(d-0.1)>0.002||Math.abs(A-1)>0.002;
    const curves=[{sh:VIS.fx(inv(b)),col:"--line",dash:1,op:.55,lab:mv?"s̄Y":""},{sh:VIS.fx(K=>0.1*K),col:"--branch",dash:1,op:.55,lab:mv?"d̄K":""},{sh:VIS.fx(inv(n)),col:"--line",lab:mv?"s̄′Y":"inversión s̄Y"},{sh:VIS.fx(K=>d*K),col:"--branch",lab:mv?"d̄′K":"depreciación d̄K"}];
    const pts=[{x:E0.K,y:0.1*E0.K,lab:"K*"}],segs=[];if(mv){pts.push({x:E1.K,y:d*E1.K,lab:"K*′",col:"--good"});segs.push({x1:E0.K,y1:4,x2:E1.K,y2:4,col:"--good",arrow:1,lab:"∆K*"})}
    const P1={cap:"Diagrama de Solow",xr:[0,900],yr:[0,75],xl:"Capital K",yl:"Inversión y depreciación",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"s",x:760,y:inv(n)(760),col:"--line",name:"la curva de inversión"},{c:"d",x:600,y:d*600,col:"--branch",name:"la recta de depreciación"}]};
    const S=PM.solowSim(b,n,3,50),Yat=t=>{const i=Math.max(0,Math.min(50,Math.floor(t))),j=Math.min(50,i+1),w=t-i;return S[i].Y*(1-w)+S[j].Y*w};
    const P2={cap:"Trayectoria de la producción Y",xr:[0,50],yr:[Math.min(E0.Y,E1.Y)*0.85,Math.max(E0.Y,E1.Y)*1.12],xl:"Período",yl:"Y",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),
      curves:[{sh:VIS.hy(E0.Y),col:"--muted",dash:2,lab:"Y*"},...(mv?[{sh:VIS.hy(E1.Y),col:"--good",dash:2,lab:"Y*′"}]:[]),{sh:VIS.fx(Yat),col:"--ink"}]};
    let h;if(!mv)h=`<p>Todavía no hay cambios. El estado estacionario está donde la inversión iguala a la depreciación: K* = (s̄Ā/d̄)<sup>3/2</sup>L̄ = 2<sup>3/2</sup>·100 = ${VIS.n(E0.K,1)} y Y* = ${VIS.n(E0.Y,1)}. Arrastra una curva o prueba un choque.</p>`;
    else{const c=[];if(Math.abs(s-0.2)>0.002)c.push(`la tasa de ahorro ${s>0.2?"subió":"bajó"} a ${VIS.n(100*s,1)} %: la curva de inversión se desplazó ${s>0.2?"hacia arriba":"hacia abajo"}`);if(Math.abs(d-0.1)>0.002)c.push(`la depreciación ${d>0.1?"subió":"bajó"} a ${VIS.n(100*d,1)} %: la recta se hizo ${d>0.1?"más empinada":"más plana"}`);if(Math.abs(A-1)>0.002)c.push(`la productividad Ā pasó a ${VIS.n(A,2)}: la producción y, con ella, la inversión se desplazaron ${A>1?"hacia arriba":"hacia abajo"}`);
      const up=E1.K>E0.K;h=VIS.sec("Qué cambió",VIS.list(c))+VIS.sec("Mecanismo",`<p>En el capital inicial ${VIS.n(E0.K,0)}, ahora la inversión (${VIS.n(inv(n)(E0.K),2)}) ${up?"supera":"es menor que"} la depreciación (${VIS.n(d*E0.K,2)}): el capital ${up?"crece":"cae"}. Por los rendimientos decrecientes, el cambio es rápido al principio y cada vez más lento (<b>dinámica de transición</b>), hasta el nuevo estado estacionario. En el largo plazo la producción vuelve a quedarse quieta: Solow no genera crecimiento permanente.</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Capital K*",E0.K,E1.K,1),VIS.tile("Producción Y*",E0.Y,E1.Y,1),VIS.tile("Consumo C*",E0.C,E1.C,1)])}</div>${Math.abs(A-1)>0.002?`<p>Con Ā la producción de estado estacionario cambia en Ā<sup>3/2</sup> = ${VIS.n(A**1.5,3)} veces: más que el efecto directo, porque más producción también da más capital.</p>`:""}${s>0.2&&s>1/3?`<p class="warn">Con s̄ mayor que α = 1/3, el consumo de estado estacionario ya baja: se pasó de la regla de oro.</p>`:""}`)}
    return{panels:[P1,P2],text:h}}});

// 5. IS-MP y curva de Phillips. Base: ā = 0, b̄ = 0,5, r̄ = 2 %, ν̄ = 0,5, ō = 0
VIS.add("ismp",{t:"IS-MP y curva de Phillips",panels:2,
  hint:"Arrastra la recta MP (el banco central fija R), la IS (choque de demanda ā) o la curva de Phillips (choque de inflación ō).",
  p0:{a:0,R:2,o:0},lim:{a:[-3,3],R:[-2,8],o:[-3,3]},
  presets:[["El banco central sube R a 5 %",{R:5}],["Choque de demanda ā = +1",{a:1}],["ā = +1 y el banco central sube R a 4 %",{a:1,R:4}],["Choque petrolero ō = +1",{o:1}],["Crisis: ā = −2 y prima de riesgo +1",{a:-2,R:3}]],
  fit:{a:(x,y)=>x+0.5*(y-2),R:(x,y)=>y,o:(x,y)=>y-0.5*x},
  compute(st){const{a,R,o}=st.p,Y=a-0.5*(R-2),dp=0.5*Y+o,mI=Math.abs(a)>0.02,mM=Math.abs(R-2)>0.02,mO=Math.abs(o)>0.02,any=mI||mM||mO;
    const IS=aa=>x=>2+(aa-x)/0.5;
    const P1={cap:"IS-MP",xr:[-5,5],yr:[-2,8],xl:"Brecha Ỹ (%)",yl:"Tasa real R (%)",fx:v=>VIS.n(v,1),fy:v=>VIS.n(v,1),
      curves:[{sh:VIS.vx(0),col:"--muted",w:1.2},{sh:VIS.fx(IS(0)),col:"--line",dash:1,op:.55,lab:mI?"IS":""},{sh:VIS.hy(2),col:"--branch",dash:1,op:.55,lab:mM?"MP":""},{sh:VIS.fx(IS(a)),col:"--line",lab:mI?"IS’":"IS"},{sh:VIS.hy(R),col:"--branch",lab:mM?"MP’":"MP"}],
      pts:[{x:0,y:2,lab:"0"},...(any?[{x:Y,y:R,lab:"1",col:"--good"}]:[])],handles:[{c:"a",x:a-0.5*(6.5-2),y:6.5,col:"--line",name:"la IS"},{c:"R",x:3.8,y:R,col:"--branch",name:"la MP"}]};
    const P2={cap:"Curva de Phillips",xr:[-5,5],yr:[-4,4],xl:"Brecha Ỹ (%)",yl:"Δπ (pp)",fx:v=>VIS.n(v,1),fy:v=>VIS.n(v,1),
      curves:[{sh:VIS.hy(0),col:"--muted",w:1.2},{sh:VIS.fx(x=>0.5*x),col:"--exam",dash:1,op:.55,lab:mO?"PC":""},{sh:VIS.fx(x=>0.5*x+o),col:"--exam",lab:mO?"PC’":"Phillips"}],
      pts:[{x:0,y:0,lab:"0"},...(any?[{x:Y,y:dp,lab:"1",col:"--good"}]:[])],handles:[{c:"o",x:-3.5,y:-1.75+o,col:"--exam",name:"la curva de Phillips"}]};
    let h;if(!any)h=`<p>Todavía no hay cambios: con ā = 0 y R = r̄ = 2 %, la brecha es cero y la inflación no cambia. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mM){mv.push(`La MP ${R>2?"subió":"bajó"} a R = ${VIS.n(R,1)} %.`);cs.push(R>2?"El banco central sube la tasa nominal (política contractiva), o sube la prima de riesgo de los préstamos.":"El banco central baja la tasa nominal (política expansiva).")}
      if(mI){mv.push(`La IS se desplazó <b>${a>0?"a la derecha":"a la izquierda"}</b>: ā = ${VIS.n(a,1)}.`);cs.push(a>0?"∆+ā: más consumo (confianza, riqueza), más gasto público, más exportaciones o más inversión autónoma.":"∆-ā: caída de la confianza o de la riqueza, recorte del gasto público, caída de las exportaciones.")}
      if(mO){mv.push(`La curva de Phillips se desplazó <b>${o>0?"hacia arriba":"hacia abajo"}</b>: ō = ${VIS.n(o,1)}.`);cs.push(o>0?"Choque de oferta adverso: sube el petróleo, sequía, alza de salarios no ligada a la productividad.":"Choque de oferta favorable: baja el petróleo o mejora la productividad.")}
      const ch=`<div class="eq al chain">${mM?`R ${R>2?"∆+":"∆-"} → `:""}${mI||mM?`Ỹ = ā − b̄(R − r̄) = ${VIS.n(a,1)} − 0,5(${VIS.n(R-2,1)}) = ${VIS.n(Y,2)} % → `:""}Δπ = ν̄Ỹ + ō = 0,5(${VIS.n(Y,2)}) + ${VIS.n(o,1)} = ${VIS.n(dp,2)} pp</div>`;
      let ex="";if(mI&&!mM)ex=`<p>Para neutralizar el choque, el banco central tendría que subir R a r̄ + ā/b̄ = ${VIS.n(2+a/0.5,1)} %. Con un choque de demanda no hay dilema.</p>`;
      if(mO&&Math.abs(Y)<0.02)ex=`<p><b>Dilema:</b> la inflación sube sin que la economía esté recalentada. Si el banco central sube R para frenarla, causa una recesión; si no, la inflación se queda más alta.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",ch+ex)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Brecha Ỹ (%)",0,Y,2),VIS.tile("Cambio de la inflación Δπ",0,dp,2),VIS.tile("Desempleo u − ū (Okun)",0,-Y/2,2)])}</div>`)}
    return{panels:[P1,P2],text:h}}});

// 6. OA-DA. Base: π_{t−1} = π̄ = 2 %, b̄ = m̄ = ν̄ = 0,5
VIS.add("oada",{t:"Oferta y demanda agregadas (OA-DA)",
  hint:"Arrastra la DA (choque de demanda ā) o la OA (choque de inflación ō). El texto muestra el equilibrio del período y qué pasa después.",
  p0:{a:0,o:0,pib:2},lim:{a:[-3,3],o:[-3,3],pib:[0,6]},
  presets:[["Choque de inflación ō = +1",{o:1}],["Choque de demanda ā = +2",{a:2}],["Caída de la demanda ā = −2",{a:-2}],["Desinflación: π̄ baja de 2 % a 0 %",{pib:0}]],
  fit:{a:(x,y,st)=>x+0.25*(y-st.p.pib),o:(x,y)=>y-2-0.5*x},
  compute(st){const{a,o,pib}=st.p,bm=0.25,E=PM.oadaPaso({a,b:0.5,m:0.5,pib,nu:0.5,o},2),N=PM.oadaPaso({a,b:0.5,m:0.5,pib,nu:0.5,o:0},E.pi),N0=PM.oadaPaso({a:0,b:0.5,m:0.5,pib,nu:0.5,o:0},E.pi);
    const mA=Math.abs(a)>0.02,mO=Math.abs(o)>0.02,mP=Math.abs(pib-2)>0.02,any=mA||mO||mP,DA=(aa,pb)=>x=>pb+(aa-x)/bm,OA=(oo)=>x=>2+0.5*x+oo;
    const P={cap:"OA-DA en el período del choque",xr:[-5,5],yr:[-2,8],xl:"Brecha Ỹ (%)",yl:"Inflación π (%)",fx:v=>VIS.n(v,1),fy:v=>VIS.n(v,1),
      curves:[{sh:VIS.vx(0),col:"--muted",w:1.2},{sh:VIS.fx(DA(0,2)),col:"--line",dash:1,op:.55,lab:mA||mP?"DA":""},{sh:VIS.fx(OA(0)),col:"--branch",dash:1,op:.55,lab:mO?"OA":""},{sh:VIS.fx(DA(a,pib)),col:"--line",lab:mA||mP?"DA’":"DA"},{sh:VIS.fx(OA(o)),col:"--branch",lab:mO?"OA’":"OA"}],
      pts:[{x:0,y:2,lab:"0"},...(any?[{x:E.Y,y:E.pi,lab:"1",col:"--good"}]:[])],handles:[{c:"a",x:a-bm*(6.8-pib),y:6.8,col:"--line",name:"la DA"},{c:"o",x:3.6,y:OA(o)(3.6),col:"--branch",name:"la OA"}]};
    let h;if(!any)h=`<p>Todavía no hay cambios: la economía está en su estado estacionario, Ỹ = 0 y π = π̄ = 2 %. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mA){mv.push(`La DA se desplazó <b>${a>0?"a la derecha":"a la izquierda"}</b> (ā = ${VIS.n(a,1)}).`);cs.push(a>0?"Más gasto (consumo, inversión, gobierno, exportaciones).":"Menos gasto: caída de la confianza, crisis financiera, ajuste fiscal.")}
      if(mP){mv.push(`La meta bajó a π̄ = ${VIS.n(pib,1)} %: la DA se desplazó <b>${pib<2?"a la izquierda":"a la derecha"}</b>.`);cs.push(pib<2?"El banco central decide bajar la inflación: sube R aunque la inflación esté en 2 %.":"El banco central acepta más inflación.")}
      if(mO){mv.push(`La OA se desplazó <b>${o>0?"hacia arriba":"hacia abajo"}</b> (ō = ${VIS.n(o,1)}).`);cs.push(o>0?"Choque de precios adverso (petróleo, alimentos).":"Choque de precios favorable.")}
      const m=`<div class="eq al">π = ${fr(`π<sub>t−1</sub> + ν̄ā + ν̄b̄m̄π̄ + ō`,"1 + ν̄b̄m̄")} = ${fr(`2 + 0,5·${VIS.n(a,1)} + 0,125·${VIS.n(pib,1)} + ${VIS.n(o,1)}`,"1,125")} = ${VIS.n(E.pi,3)} %<br>Ỹ = ā − b̄m̄(π − π̄) = ${VIS.n(a,1)} − 0,25·(${VIS.n(E.pi,3)} − ${VIS.n(pib,1)}) = ${VIS.n(E.Y,3)} %</div>`;
      const next=mA&&!mO?`<p><b>Después:</b> si el choque sigue, la OA sube cada período (π<sub>t−1</sub> más alta) hasta que π = π̄ + ā/(b̄m̄) = ${VIS.n(pib+a/bm,2)} % y Ỹ = 0. Si el choque desaparece, en el período siguiente π = ${VIS.n(N0.pi,3)} % con Ỹ = ${VIS.n(N0.Y,3)} %: la inflación quedó alta y hace falta una recesión para bajarla.</p>`
        :`<p><b>Después:</b> en el período siguiente${mO?", sin el choque de precios,":""} la OA pasa por π<sub>t−1</sub> = ${VIS.n(E.pi,2)} %: π = ${VIS.n((mA?N:N0).pi,3)} % y Ỹ = ${VIS.n((mA?N:N0).Y,3)} %. La economía vuelve poco a poco a ${mP?`la nueva meta de ${VIS.n(pib,1)} %`:"π̄ con Ỹ = 0"}.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Equilibrio del período",m+(mO&&!mA?`<p>Sube la inflación y cae la producción a la vez: <b>estanflación</b>. El banco central, siguiendo su regla, sube R = r̄ + ${VIS.n(E.R,2)} pp.</p>`:""))+VIS.sec("Dinámica",next)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Inflación π (%)",2,E.pi,3),VIS.tile("Brecha Ỹ (%)",0,E.Y,3),VIS.tile("R − r̄ (pp)",0,E.R,3)])}</div>`)}
    return{panels:[P],text:h}}});
