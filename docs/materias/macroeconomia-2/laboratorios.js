// Macroeconomía 2 · laboratorios interactivos
// ===================== LABORATORIOS DE MACROECONOMÍA 2 =====================
const SIMS={};
let CLIP2=0;
const D=(s,x)=>`∆${s>0?"+":s<0?"-":""}${x}`;                      // notación del curso: ∆+Y, ∆-i
const sg=x=>Math.abs(x)<1e-7?0:x>0?1:-1;
const f2=v=>fmt(v,2),f1=v=>fmt(v,1),f0=v=>fmt(v,0);
const flechaV=x=>sg(x)>0?"sube":sg(x)<0?"baja":"no cambia";
// Gráfico con curvas rotuladas, puntos y clic opcional
// curves: [{f(x)→y | pts | vx (vertical en x), col, w, dash, lab}] ; points: [{x,y,lab,col}] ; arrows: [{x1,y1,x2,y2,col}]
function gplot({xr,yr,curves=[],points=[],arrows=[],xl,yl,H=320,W=600,label,id,shade=[]}){
  const f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/5)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl),cid="m2c"+(++CLIP2);
  const cy=y=>f.sy(Math.max(yr[0]-(yr[1]-yr[0]),Math.min(yr[1]+(yr[1]-yr[0]),y)));let b="",t="";
  shade.forEach(s=>b+=`<rect x="${f.sx(s.x0)}" y="${f.sy(s.y1)}" width="${f.sx(s.x1)-f.sx(s.x0)}" height="${f.sy(s.y0)-f.sy(s.y1)}" fill="var(${s.col})" fill-opacity="${s.op||.08}"/>`);
  curves.forEach(c=>{let d,lx,ly;
    if(c.vx!=null){d=`M${f.sx(c.vx)},${f.sy(yr[0])}L${f.sx(c.vx)},${f.sy(yr[1])}`;lx=f.sx(c.vx)+4;ly=f.T+12}
    else{const pts=c.pts||[...Array(121)].map((_,i)=>{const x=xr[0]+(xr[1]-xr[0])*i/120;return[x,c.f(x)]});const ok=pts.filter(([,y])=>isFinite(y));
      d=ok.map(([x,y],i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+cy(y).toFixed(1)).join("");
      const inside=ok.filter(([x,y])=>y>=yr[0]&&y<=yr[1]&&x>=xr[0]&&x<=xr[1]);const q=inside.length?inside[c.at==="start"?Math.min(3,inside.length-1):inside.length-1]:null;if(q){lx=f.sx(q[0])+(c.at==="start"?4:-4);ly=f.sy(q[1])-6}}
    b+=`<path d="${d}" fill="none" stroke="var(${c.col||"--ink"})" stroke-width="${c.w||2.4}" ${c.dash?`stroke-dasharray="${c.dash}"`:""} ${c.op?`stroke-opacity="${c.op}"`:""}/>`;
    if(c.lab&&lx!=null)t+=`<text x="${lx}" y="${ly}" font-size="11.5" text-anchor="${c.at==="start"||c.vx!=null?"start":"end"}" fill="var(${c.col||"--ink"})" ${c.op?`fill-opacity="${Math.min(1,c.op+.25)}"`:""} font-weight="600">${c.lab}</text>`});
  arrows.forEach(a=>{const x1=f.sx(a.x1),y1=f.sy(a.y1),x2=f.sx(a.x2),y2=f.sy(a.y2),L=Math.hypot(x2-x1,y2-y1);if(L<8)return;const ux=(x2-x1)/L,uy=(y2-y1)/L,ex=x2-ux*9,ey=y2-uy*9;
    b+=`<line x1="${x1+ux*8}" y1="${y1+uy*8}" x2="${ex}" y2="${ey}" stroke="var(${a.col||"--muted"})" stroke-width="1.6" stroke-dasharray="4 3"/><path d="M${ex-uy*4.5},${ey+ux*4.5}L${x2-ux*3},${y2-uy*3}L${ex+uy*4.5},${ey-ux*4.5}Z" fill="var(${a.col||"--muted"})"/>`});
  const merged=[];points.forEach(q=>{if(!isFinite(q.x)||!isFinite(q.y))return;const m=merged.find(z=>Math.abs(f.sx(z.x)-f.sx(q.x))<4&&Math.abs(f.sy(z.y)-f.sy(q.y))<4);if(m){m.lab+=" = "+q.lab;m.col=q.col}else merged.push({...q})});
  merged.forEach(q=>{const x=f.sx(q.x),y=f.sy(q.y);if(q.y<yr[0]||q.y>yr[1]||q.x<xr[0]||q.x>xr[1])return;
    t+=`<circle cx="${x}" cy="${y}" r="5.5" fill="var(${q.col||"--exam"})" stroke="var(--card)" stroke-width="2"/><text x="${x+8}" y="${y+(q.dy||-8)}" font-size="12" font-weight="700" fill="var(${q.col||"--exam"})">${q.lab}</text>`});
  return `<div class="plot"><svg ${id?`id="${id}"`:""} viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfico"}" data-xr="${xr}" data-yr="${yr}" data-l="${f.L}" data-r="${f.R}" data-t="${f.T}" data-b="${f.B}"><defs><clipPath id="${cid}"><rect x="${f.L}" y="${f.T}" width="${W-f.L-f.R}" height="${H-f.T-f.B}"/></clipPath></defs>${f.g}<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(yr[0])}" y2="${f.sy(yr[0])}" stroke="var(--muted)"/><line x1="${f.L}" x2="${f.L}" y1="${f.sy(yr[0])}" y2="${f.T}" stroke="var(--muted)"/><g clip-path="url(#${cid})">${b}</g>${t}</svg></div>`}
// coordenadas del gráfico a partir de un clic
function gclick(svg,ev){const r=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal,sx=(ev.clientX-r.left)*vb.width/r.width,sy=(ev.clientY-r.top)*vb.height/r.height;
  const xr=svg.dataset.xr.split(",").map(Number),yr=svg.dataset.yr.split(",").map(Number),L=+svg.dataset.l,R=+svg.dataset.r,T=+svg.dataset.t,B=+svg.dataset.b;
  return{x:xr[0]+(sx-L)/(vb.width-L-R)*(xr[1]-xr[0]),y:yr[1]-(sy-T)/(vb.height-T-B)*(yr[1]-yr[0])}}
const legend2=items=>`<div class="legend">${items.map(([c,t,d])=>`<span><i style="background:var(${c})${d?";opacity:.45":""}"></i>${t}</span>`).join("")}</div>`;
const chain=s=>`<div class="eq al chain">${s}</div>`;

// ====================================================================
// 1. Registro en la balanza de pagos
SIMS.bp=function(start){let vista=start||"una";
  $("sim").innerHTML=`${seg("bp-v","Ejercicio",[["una","Una transacción"],["libro","Libro registro completo"]],vista)}<div id="bp-una"></div><div id="bp-lib"></div>`;
  const una=()=>{const K=Object.keys(M2.BPT);let hide=false;
  $("bp-una").innerHTML=`<div class="calcf"><label for="bp-t">Transacción<select id="bp-t">${K.map(k=>`<option value="${k}">${M2.BPT[k].t}</option>`).join("")}</select></label></div>
  ${seg("bp-m","Modo",[["ver","Ver el registro"],["prac","Practicar (ocultar)"]],"ver")}<div id="bp-out"></div>`;
  const CN={CC:"Cuenta corriente",CK:"Cuenta de capital",CF:"Cuenta financiera",RI:"Reservas internacionales"};
  const run=()=>{const x=M2.BPT[$("bp-t").value];
    const rows=x.e.map(([c,p,s])=>`<tr><td>${CN[c]}</td><td>${p}</td><td class="num">${s==="C"?"Crédito (+)":""}</td><td class="num">${s==="D"?"Débito (−)":""}</td></tr>`).join("");
    $("bp-out").innerHTML=hide?`<p>Piensa en las dos partidas: ¿qué cuenta recibe el crédito y cuál el débito? Recuerda: <b>crédito</b> = entra el pago al país o disminuyen los activos externos o aumentan los pasivos; <b>débito</b> = sale el pago o aumentan los activos externos o bajan los pasivos.</p><button type="button" class="btn" id="bp-sh">Mostrar el registro</button>`
      :`<div class="tbl"><table><tr><th>Cuenta</th><th>Partida</th><th>Crédito</th><th>Débito</th></tr>${rows}</table></div><p>${x.x}</p><p class="hint">Partida doble: cada transacción se registra dos veces, y la suma de créditos es igual a la suma de débitos.</p>`;
    const b=$("bp-sh");if(b)b.onclick=()=>{hide=false;$("bp-m").querySelectorAll("button").forEach(z=>z.setAttribute("aria-pressed",z.dataset.v==="ver"));run()}};
  $("bp-t").onchange=run;bindSeg("bp-m",v=>{hide=v==="prac";run()});run()};
  const libro=()=>{const K=Object.keys(M2.BPL);let key=start==="libro"&&SIMS.bp.preset?SIMS.bp.preset:"clase",prac=false;
    $("bp-lib").innerHTML=`<div class="calcf"><label for="bp-l">Ejercicio<select id="bp-l">${K.map(k=>`<option value="${k}"${k===key?" selected":""}>${M2.BPL[k].t}</option>`).join("")}</select></label></div>
    ${seg("bp-lm","Modo",[["ver","Ver la solución"],["prac","Practicar: calcula los saldos"]],"ver")}<div id="bp-lo"></div>`;
    const CN={BC:"CC · Balanza comercial",BS:"CC · Balanza de servicios",T:"CC · Transferencias",CFA:"CF · Activo",CFP:"CF · Pasivo",RI:"Reservas internacionales"};
    const sg=v=>(v>0?"+":"")+f0(v);
    const run=()=>{const P=M2.BPL[key],R=M2.bpLibro(key);
      const enun=`<ol class="steps">${P.tr.map(t=>`<li>${t.d}</li>`).join("")}</ol>`;
      if(prac){$("bp-lo").innerHTML=`${enun}<p>Registra cada transacción con la convención de clase y calcula los tres saldos (en US$, con signo).</p>
        <div class="calcf"><label for="bp-qcc">Saldo de la CC<input id="bp-qcc" type="number" step="any"></label><label for="bp-qcf">Saldo de la CF (entrada neta)<input id="bp-qcf" type="number" step="any"></label><label for="bp-qri">Variación de RI (acumulación +)<input id="bp-qri" type="number" step="any"></label></div>
        <button type="button" class="btn" id="bp-chk">Revisar</button><div id="bp-fb"></div>`;
        $("bp-chk").onclick=()=>{const a=[["CC",R.cc,"bp-qcc"],["CF",R.cf,"bp-qcf"],["ΔRI",R.dri,"bp-qri"]].map(([n,v,id])=>{const u=parseFloat($(id).value);return`<li>${n}: ${isFinite(u)?(Math.abs(u-v)<0.5?"✔ correcto":"✘ revisa (no es "+f0(u)+")"):"sin respuesta"}</li>`});
          $("bp-fb").innerHTML=`<ul>${a.join("")}</ul><p class="hint">Pista: CC = créditos − débitos de BC, BS y T; CF = créditos − débitos de la cuenta financiera; ΔRI = débitos − créditos de reservas. Debe cumplirse CC + CF = ΔRI.</p>`};return}
      const rows=P.tr.map((t,n)=>t.e.map(([c,p,s,v],k)=>`<tr><td>${k?"":n+1}</td><td>${p}</td><td>${CN[c]}</td><td class="num">${s==="D"?f0(v):""}</td><td class="num">${s==="C"?f0(v):""}</td></tr>`).join("")).join("");
      const g=R.g,line=(n,c)=>`<tr><td>${n}</td><td class="num">${f0(g(c).C)}</td><td class="num">${f0(g(c).D)}</td><td class="num">${sg(R.net(c))}</td></tr>`;
      $("bp-lo").innerHTML=`${enun}<div class="tbl"><table><tr><th>N.º</th><th>Partida</th><th>Cuenta</th><th>Débito</th><th>Crédito</th></tr>${rows}<tr><td></td><td><b>Totales</b></td><td></td><td class="num"><b>${f0(R.D)}</b></td><td class="num"><b>${f0(R.C)}</b></td></tr></table></div>
      <div class="tbl"><table><tr><th>Cuenta</th><th>Créditos</th><th>Débitos</th><th>Saldo</th></tr>
      <tr><td><b>I. Cuenta corriente</b></td><td class="num">${f0(g("BC").C+g("BS").C+g("T").C)}</td><td class="num">${f0(g("BC").D+g("BS").D+g("T").D)}</td><td class="num"><b>${sg(R.cc)}</b></td></tr>
      ${line("A. Balanza comercial","BC")}${line("B. Balanza de servicios","BS")}${line("C. Transferencias","T")}
      <tr><td><b>II. Cuenta financiera</b></td><td class="num">${f0(g("CFA").C+g("CFP").C)}</td><td class="num">${f0(g("CFA").D+g("CFP").D)}</td><td class="num"><b>${sg(R.cf)}</b></td></tr>
      <tr><td><b>III. Variación de RI</b> (débito = entran divisas)</td><td class="num">${f0(g("RI").C)}</td><td class="num">${f0(g("RI").D)}</td><td class="num"><b>${sg(R.dri)}</b> ${R.dri>=0?"de acumulación":"de pérdida"}</td></tr></table></div>
      <div class="res">${tiles([["CC",sg(R.cc),R.cc>=0?"okt":"badt"],["CF",sg(R.cf)],["ΔRI",sg(R.dri)]])}</div>
      <p>Identidad: \\(CC+CF=\\Delta RI\\Rightarrow ${f0(R.cc)}+${f0(R.cf)}=${f0(R.dri)}\\)${R.ok?" ✔":" ✘"}. En la forma del profesor: saldo CC = saldo CF ± variación de RI ± EyO, con EyO = 0.</p>
      <p>${R.cc<0?"La CC es deficitaria: el país absorbe más de lo que produce (CC = PNB − A < 0) e invierte más de lo que ahorra (S − I < 0). ":"La CC tiene superávit: el país produce más de lo que absorbe y presta al exterior. "}${R.cf>0?"Entra capital neto por la CF":"La CF no aporta entrada neta"}${R.dri>0?"; lo que sobra lo acumula el banco central como reservas.":R.dri<0?"; el faltante se cubre con reservas.":"."}</p>`;
      typeset($("bp-lo"))};
    $("bp-l").onchange=()=>{key=$("bp-l").value;run()};bindSeg("bp-lm",v=>{prac=v==="prac";run()});run()};
  una();libro();const go=()=>{$("bp-una").hidden=vista!=="una";$("bp-lib").hidden=vista!=="libro"};
  bindSeg("bp-v",v=>{vista=v;go()});go()};
SIMS.pardr=()=>SIMS.par("dr");SIMS.parcarry=()=>SIMS.par("carry");
SIMS.bplibro=()=>{SIMS.bp.preset="clase";SIMS.bp("libro")};
SIMS.bpsupl=()=>{SIMS.bp.preset="supl";SIMS.bp("libro")};

// ====================================================================
// 2. Paridades internacionales
SIMS.par=function(start){let mode=start||"abs";
  const MODES=[["abs","PPC absoluta (Big Mac)"],["rel","PPC relativa"],["esp","Tipo de cambio esperado"],["pci","Paridad cubierta (forward)"],["pnci","Paridad no cubierta"],["dr","RI frente a RE"],["tcr","Tipo de cambio real"],["var","Variación causada"],["carry","Carry trade"]];
  $("sim").innerHTML=`${seg("pa-m","Cálculo",MODES,mode)}<div id="pa-box"></div>`;
  const F={abs:[["pa-a","Precio en Colombia ($)",15000],["pa-b","Precio en EE. UU. (US$)",2.5],["pa-c","Tipo de cambio de mercado ($/US$)",8500]],
    rel:[["pa-a","Tipo de cambio del período anterior ($/US$)",4150],["pa-b","Inflación en Colombia Π (%)",6.5],["pa-c","Inflación en EE. UU. Π* (%)",3.2]],
    esp:[["pa-a","Tipo de cambio spot hoy ($/US$)",4000],["pa-b","Inflación esperada en Colombia Πᵉ (%)",6],["pa-c","Inflación esperada en EE. UU. Πᵉ* (%)",3]],
    pci:[["pa-a","Tipo de cambio spot ($/US$)",3980],["pa-b","Tasa de interés en Colombia i (% del período)",2],["pa-c","Tasa de interés en EE. UU. i* (% del período)",0.5]],
    pnci:[["pa-a","Tipo de cambio spot ($/US$)",4000],["pa-b","Tasa de interés en Colombia i (%)",9],["pa-c","Tasa de interés en EE. UU. i* (%)",4],["pa-d","Prima de riesgo país μ (%)",2]],
    dr:[["pa-a","Tipo de cambio de hoy Eₜ ($/US$)",3139],["pa-b","Tasa de interés en Colombia i (%)",11.2],["pa-c","Tasa externa i* (%)",5],["pa-d","Eᵉ(t+1) que espera el mercado",3800],["pa-e","EMBI (puntos básicos)",0]],
    var:[["pa-a","Tipo de cambio del período anterior Eₜ₋₁",4200],["pa-b","Tipo de cambio de hoy Eₜ",3050]],
    carry:[["pa-a","Préstamo en EE. UU. (US$)",100000],["pa-b","Tasa del préstamo i* (%)",5],["pa-c","Tipo de cambio al entrar ($/US$)",3100],["pa-d","Tasa en Colombia i (%)",12],["pa-e","Tipo de cambio al salir ($/US$)",3000]],
    tcr:[["pa-a","Tipo de cambio nominal E ($/US$)",4200],["pa-b","Índice de precios externo P*",105],["pa-c","Índice de precios interno P",110],["pa-d","Devaluación nominal del año (%)",8],["pa-e","Inflación externa Π* (%)",3],["pa-f","Inflación interna Π (%)",5]]};
  const draw=()=>{$("pa-box").innerHTML=`<div class="calcf">${F[mode].map(([id,l,v])=>`<label for="${id}">${l}<input id="${id}" type="number" step="any" value="${v}"></label>`).join("")}</div><div class="res" id="pa-res"></div><div id="pa-txt"></div>`;
    F[mode].forEach(([id])=>$(id).addEventListener("input",run));run()};
  const run=()=>{const v=id=>parseFloat($(id).value),ok=(...a)=>a.every(x=>isFinite(x));let h="",t="";
    if(mode==="abs"){const a=v("pa-a"),b=v("pa-b"),c=v("pa-c");if(!ok(a,b,c)||b<=0||c<=0){$("pa-res").innerHTML=err("los precios y el tipo de cambio deben ser positivos.");return}const r=M2.ppcAbs(a,b,c);
      const tq=c*b/a;h=tiles([["Tipo de cambio de la PPC",f2(r.e)],["Tipo de cambio de mercado",f2(c)],["Desalineamiento",fmt(r.des,1)+" %",r.des<0?"okt":"badt"],["TCR = E·P*/P",fmt(tq,3)]]);
      t=`<p>\\(TCN_{PPC}=\\dfrac{P_\\$}{P_{us}}=\\dfrac{${fm(a)}}{${fm(b)}}=${fm(r.e)}\\)</p><p>\\(\\%\\ \\text{subvaluación}=\\left[\\dfrac{TCN_{PPC}}{TCN_{mercado}}-1\\right]\\times100=\\left[\\dfrac{${fm(r.e)}}{${fm(c)}}-1\\right]\\times100=${fmt(r.des,1)}\\%\\)</p>
      <p>\\(TCR=\\dfrac{E\\,P^*}{P}=\\dfrac{${fm(c)}\\times${fm(b)}}{${fm(a)}}=${fmt(tq,3)}\\)${tq<1?": menor que 1, lo extranjero es más barato y Colombia pierde competitividad.":tq>1?": mayor que 1, Colombia gana competitividad.":": se cumple la PPC."}</p><p>El peso está <b>${r.estado}</b>${r.estado!=="en paridad"?` un ${fmt(Math.abs(r.des),1)} %`:""}. ${r.des<0?"Con el tipo de cambio de mercado se necesitan más pesos por dólar que los que indica la PPC: el peso está depreciado frente a la paridad. Eso abarata las exportaciones colombianas en dólares y encarece las importaciones en pesos, así que mejora la competitividad-precio del país.":r.des>0?"Se necesitan menos pesos por dólar que en la PPC: el peso está apreciado. Eso abarata las importaciones y encarece las exportaciones, y el país pierde competitividad-precio.":""}</p>`}
    if(mode==="rel"){const a=v("pa-a"),b=v("pa-b")/100,c=v("pa-c")/100;if(!ok(a,b,c)){$("pa-res").innerHTML=err("completa los datos.");return}const e=M2.ppcRel(a,b,c);
      h=tiles([["Tipo de cambio spot (PPC relativa)",f2(e)],["Devaluación",fmt((e/a-1)*100,2)+" %"]]);
      t=`<p>\\(E_t=E_{t-1}\\,\\dfrac{1+\\Pi}{1+\\Pi^*}=${fm(a)}\\times\\dfrac{${fm(1+b)}}{${fm(1+c)}}=${fmt(e,2)}\\)</p><p>La devaluación es aproximadamente la diferencia de inflaciones: \\(\\Pi-\\Pi^*=${fmt((b-c)*100,2)}\\%\\). Si Colombia tiene más inflación que EE. UU., el peso se debe devaluar para mantener la PPC.</p>`}
    if(mode==="esp"){const a=v("pa-a"),b=v("pa-b")/100,c=v("pa-c")/100;if(!ok(a,b,c)){$("pa-res").innerHTML=err("completa los datos.");return}const e=M2.ppcRel(a,b,c);
      h=tiles([["Tipo de cambio esperado Eᵉ(t+1)",f2(e)],["Devaluación esperada",fmt((e/a-1)*100,2)+" %"]]);
      t=`<p>\\(E^e_{t+1}=E_t\\,\\dfrac{1+\\Pi^e}{1+\\Pi^{e*}}=${fm(a)}\\times\\dfrac{${fm(1+b)}}{${fm(1+c)}}=${fmt(e,2)}\\)</p><p>Despejando al revés se obtienen los determinantes del tipo de cambio spot según la PPC: \\(E_t=E^e_{t+1}(1+\\Pi^{e*})/(1+\\Pi^e)\\). Sube con \\(E^e_{t+1}\\) y con \\(\\Pi^{e*}\\), y baja con \\(\\Pi^e\\).</p>`}
    if(mode==="pci"){const a=v("pa-a"),b=v("pa-b")/100,c=v("pa-c")/100;if(!ok(a,b,c)){$("pa-res").innerHTML=err("completa los datos.");return}const F_=M2.pci(a,b,c);
      h=tiles([["Tipo de cambio forward F",f2(F_)],["Prima forward",fmt((F_/a-1)*100,2)+" %"]]);
      t=`<p>Paridad cubierta: \\(1+i=(1+i^*)\\dfrac{F_t}{E}\\;\\Rightarrow\\;F_t=E\\,\\dfrac{1+i}{1+i^*}=${fm(a)}\\times\\dfrac{${fm(1+b)}}{${fm(1+c)}}=${fmt(F_,2)}\\)</p><p>Invertir ${fm(a)} pesos en Colombia da ${fmt(a*(1+b),2)}; invertir 1 dólar en EE. UU. da ${fmt(1+c,4)} dólares. El forward que iguala ambos retornos es ${fmt(F_,2)}. Ojo: el forward no predice el tipo de cambio futuro, solo refleja el diferencial de intereses.</p>`}
    if(mode==="pnci"){const a=v("pa-a"),b=v("pa-b")/100,c=v("pa-c")/100,d=v("pa-d")/100;if(!ok(a,b,c,d)){$("pa-res").innerHTML=err("completa los datos.");return}const e=M2.pnci(a,b,c,d),e0=M2.pnci(a,b,c,0);
      h=tiles([["Tipo de cambio esperado (sin riesgo)",f2(e0)],["Con prima de riesgo μ",f2(e)],["Devaluación esperada",fmt((e/a-1)*100,2)+" %"]]);
      t=`<p>\\(1+i=(1+i^*)(1+e^e)(1+\\mu)\\;\\Rightarrow\\;E^e_{t+1}=E_t\\,\\dfrac{1+i}{(1+i^*)(1+\\mu)}\\)</p><p>Para cambios pequeños: \\(i\\approx i^*+e^e+\\mu\\). Si \\(i>i^*+e^e+\\mu\\) entran capitales: baja \\(i\\) o se aprecia el peso hasta recuperar la paridad.</p>`}
    if(mode==="dr"){const E=v("pa-a"),i=v("pa-b")/100,is=v("pa-c")/100,Ee=v("pa-d"),eb=v("pa-e")/10000;if(!ok(E,i,is,Ee,eb)||E<=0||Ee<=0){$("pa-res").innerHTML=err("completa los datos con tipos de cambio positivos.");return}
      const RI=1+i,RE=(1+is)*(Ee/E)*(1+eb),DR=RI-RE,Eep=E*(1+i)/((1+is)*(1+eb)),Ep=Ee*(1+is)*(1+eb)/(1+i);
      h=tiles([["RI = 1 + i",fmt(RI,4)],["RE = (1+i*)·Eᵉ/E"+(eb?"·(1+EMBI)":""),fmt(RE,4)],["DR = RI − RE",fmt(DR,4),DR>=0?"okt":"badt"],["Eᵉ de paridad",f2(Eep)],["Eₜ que restablece la paridad",f2(Ep)]]);
      t=`<p>\\(RI=1+i=${fmt(RI,4)}\\). \\(RE=(1+i^*)\\dfrac{E^e_{t+1}}{E_t}${eb?"(1+EMBI)":""}=${fm(1+is)}\\times\\dfrac{${fm(Ee)}}{${fm(E)}}${eb?`\\times${fmt(1+eb,4)}`:""}=${fmt(RE,4)}\\)</p>
      <p>${Math.abs(DR)<5e-5?"DR = 0: se cumple la PNCI, entradas = salidas de capital.":DR>0?"<b>DR &gt; 0</b>: rinde más invertir en pesos. Entran capitales (Δ⁺F) → EOD → baja \\(E_t\\) (el peso se aprecia).":"<b>DR &lt; 0</b>: rinde más invertir afuera. Salen capitales (∇F) → EDD → sube \\(E_t\\) (el peso se deprecia)."}</p>
      <p>La depreciación esperada por el mercado es ${fmt((Ee/E-1)*100,2)} %; la que cumple la paridad es ${fmt((Eep/E-1)*100,2)} %. Con \\(E^e\\) fijo, el tipo de cambio de hoy que iguala las rentabilidades es \\(E_t=E^e\\,\\dfrac{(1+i^*)${eb?"(1+EMBI)":""}}{1+i}=${fmt(Ep,2)}\\).</p>${eb?`<p>El EMBI se suma como prima de riesgo país: con más riesgo, Colombia necesita una tasa más alta para atraer el mismo capital.</p>`:""}`}
    if(mode==="var"){const a=v("pa-a"),b=v("pa-b");if(!ok(a,b)||a<=0||b<=0){$("pa-res").innerHTML=err("los tipos de cambio deben ser positivos.");return}const r=(b/a-1)*100,back=(a/b-1)*100;
      h=tiles([["Variación causada",(r>0?"+":"")+fmt(r,1)+" %",r>0?"badt":"okt"],["Para volver al valor anterior",(back>0?"+":"")+fmt(back,1)+" %"]]);
      t=`<p>\\(\\%\\Delta E=\\left(\\dfrac{E_t}{E_{t-1}}-1\\right)\\times100=\\left(\\dfrac{${fm(b)}}{${fm(a)}}-1\\right)\\times100=${fmt(r,1)}\\%\\)</p><p>${r>0?"El dólar subió: el peso se <b>depreció</b> (o se devaluó, si lo decidió el banco central con tipo de cambio fijo).":r<0?"El dólar bajó: el peso se <b>apreció</b> (o se revaluó, con tipo de cambio fijo).":"No hay variación."} Ojo con la base: devolverse de ${fm(b)} a ${fm(a)} es un ${fmt(back,1)} %, no el mismo porcentaje con otro signo. Siempre divide por el valor del período anterior.</p>`}
    if(mode==="carry"){const L=v("pa-a"),is=v("pa-b")/100,E0=v("pa-c"),i=v("pa-d")/100,E1=v("pa-e");if(!ok(L,is,E0,i,E1)||L<=0||E0<=0||E1<=0){$("pa-res").innerHTML=err("completa los datos con valores positivos.");return}
      const deuda=L*(1+is),pesos=L*E0,fin=pesos*(1+i),usd=fin/E1,g=usd-deuda,sinInt=pesos/E1;
      h=tiles([["Pesos invertidos",f0(pesos)],["Pesos al final",f0(fin)],["Dólares al salir",f0(usd)],["Deuda a pagar",f0(deuda)],["Ganancia (US$)",f0(g),g>=0?"okt":"badt"]]);
      t=`<ol class="steps"><li>Pide prestado US$${fm(L)} al ${fmt(is*100,2)} %: debe devolver US$${f0(deuda)}.</li><li>Los trae a Colombia a ${fm(E0)}: $${f0(pesos)}.</li><li>Los invierte al ${fmt(i*100,2)} %: $${f0(fin)}.</li><li>Sale a ${fm(E1)}: ${f0(fin)} / ${fm(E1)} = US$${f0(usd)}.</li><li>Ganancia: US$${f0(usd)} − US$${f0(deuda)} = <b>US$${f0(g)}</b>.</li></ol>
      <p>La ganancia viene del diferencial de tasas y de la ${E1<E0?"apreciación":"depreciación"} del peso (sin intereses habría salido con US$${f0(sinInt)}). ${E1>E0?"Si el peso se deprecia, la pérdida cambiaria puede borrar el diferencial: es el riesgo de la operación.":""} En la BdeP la inversión entra como pasivo de la CF (crédito) y los intereses que paga Colombia son un débito en servicios financieros de la CC. Para frenar estas entradas: bajar i, exigir un tiempo mínimo de permanencia o gravar los rendimientos.</p>`}
    if(mode==="tcr"){const a=v("pa-a"),b=v("pa-b"),c=v("pa-c"),dE=v("pa-d"),pe=v("pa-e"),pi=v("pa-f");if(!ok(a,b,c,dE,pe,pi)||c<=0){$("pa-res").innerHTML=err("completa los datos.");return}const T=M2.tcr(a,b,c),dr=M2.devReal(dE,pe,pi);
      h=tiles([["TCR = E·P*/P",f2(T)],["Devaluación real (aprox.)",fmt(dr,2)+" %",dr>=0?"okt":"badt"]]);
      t=`<p>\\(TCR=\\dfrac{E\\,P^*}{P}=\\dfrac{${fm(a)}\\times${fm(b)}}{${fm(c)}}=${fmt(T,2)}\\)</p><p>\\(\\dfrac{\\Delta TCR}{TCR}\\approx\\dfrac{\\Delta E}{E}+\\Pi^*-\\Pi=${fm(dE)}+${fm(pe)}-${fm(pi)}=${fmt(dr,2)}\\%\\)</p><p>${dr>0?"Hay <b>devaluación real</b>: los bienes externos se encarecen en pesos frente a los nacionales; ganan competitividad las exportaciones.":dr<0?"Hay <b>revaluación real</b>: la inflación interna supera la devaluación nominal más la inflación externa; se pierde competitividad.":"El TCR no cambia."}</p>`}
    $("pa-res").innerHTML=h;$("pa-txt").innerHTML=t;typeset($("pa-txt"))};
  bindSeg("pa-m",m=>{mode=m;draw()});draw()};

// ====================================================================
// 3. ITCR con varios países (metodología del curso)
SIMS.itcr=function(){const P=[["EE. UU.",1.71,1,1,38],["Chile",2.24,679.2,713.4,7],["España",0.08,0.88,0.91,10],["Brasil",2.9,3.72,4.13,15],["China",2.8,6.97,7.07,5]];
  $("sim").innerHTML=`<p class="hint">Ejercicio de las diapositivas (octubre 2018 → octubre 2019). Tipos de cambio en moneda de cada país por dólar; inflación anual en %.</p>
  <div class="calcf"><label for="it-pi">Inflación de Colombia (%)<input id="it-pi" type="number" step="any" value="3.82"></label><label for="it-c0">TCN Colombia período base ($/US$)<input id="it-c0" type="number" step="any" value="3089"></label><label for="it-c1">TCN Colombia período actual ($/US$)<input id="it-c1" type="number" step="any" value="3430.16"></label></div>
  <div class="tbl gin"><table><tr><th>País</th><th>Inflación (%)</th><th>TCN base</th><th>TCN actual</th><th>Participación</th></tr>${P.map((r,i)=>`<tr><th><input id="it-n${i}" value="${r[0]}" aria-label="País ${i+1}"></th>${r.slice(1).map((v,j)=>`<td><input id="it-${i}-${j}" type="number" step="any" value="${v}" aria-label="${["Inflación","TCN base","TCN actual","Participación"][j]} de ${r[0]}"></td>`).join("")}</tr>`).join("")}</table></div><div class="res" id="it-res"></div><div id="it-tab"></div>`;
  const run=()=>{const v=id=>parseFloat($(id).value);const col={pi:v("it-pi")/100,tcn0:v("it-c0"),tcn1:v("it-c1")};
    const rows=P.map((_,i)=>({pais:$("it-n"+i).value,pi:v(`it-${i}-0`)/100,tcn0:v(`it-${i}-1`),tcn1:v(`it-${i}-2`),w:v(`it-${i}-3`)})).filter(r=>[r.pi,r.tcn0,r.tcn1,r.w].every(isFinite)&&r.tcn0>0&&r.w>0);
    if(!rows.length||![col.pi,col.tcn0,col.tcn1].every(isFinite)){$("it-res").innerHTML=err("completa los datos de Colombia y al menos un país.");return}
    const r=M2.itcr(col,rows);
    $("it-res").innerHTML=tiles([["ITCN Colombia",fmt(r.icol,4)],["IPC Colombia",fmt(r.ipc,4)],["ITCR",fmt(r.itcr,4)],[r.itcr>=1?"Devaluación real":"Revaluación real",fmt(Math.abs(r.itcr-1)*100,2)+" %",r.itcr>=1?"okt":"badt"]]);
    $("it-tab").innerHTML=`<div class="tbl"><table><tr><th>País</th><th>IPXj = 1 + πj</th><th>ITCNj</th><th>ITCAj = ITCN_col / ITCNj</th><th>Wj (normalizado)</th><th>Wj·IPXj·ITCAj</th></tr>${r.det.map(d=>`<tr><td>${d.pais}</td><td class="num">${fmt(d.ipx,4)}</td><td class="num">${fmt(d.itcn,4)}</td><td class="num">${fmt(d.itca,4)}</td><td class="num">${fmt(d.wn,4)}</td><td class="num">${fmt(d.prod,4)}</td></tr>`).join("")}<tr class="tot"><td>Total</td><td></td><td></td><td></td><td class="num">1,0000</td><td class="num">${fmt(r.num,4)}</td></tr></table></div>
    <p>\\(ITCR=\\dfrac{\\sum_j W_j\\,IPX_j\\,ITCA_j}{IPC}=\\dfrac{${fmt(r.num,4)}}{${fmt(r.ipc,4)}}=${fmt(r.itcr,4)}\\)</p><p>La participación se normaliza para que las ponderaciones sumen 1. ITCA ajusta el índice del peso frente al dólar con el de la moneda de cada país frente al dólar (tipo de cambio cruzado). Un ITCR mayor que 1 indica devaluación real: los productos colombianos ganaron competitividad frente a la canasta de socios.</p>`;typeset($("it-tab"))};
  $("sim").querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()};

// ====================================================================
// 4. Mundell-Fleming con números
const MOBS=[["none","Sin movilidad"],["steep","Imperfecta: BP más inclinada que EMM"],["flat","Imperfecta: BP menos inclinada que EMM"],["perfect","Perfecta"]];
function mfImpacto(r){const s=r.dir,dY=r.q1.Y-r.e0.Y,di=r.q1.i-r.e0.i,k=r.shock;let c="";
  const tailY=x=>`${D(x,"Y")} → ${D(x,"L")} /dado (M/P) → ${x>0?"EDM":"EOM"} → ${D(x,"i")}`;
  if(k==="G")c=`${D(s,"G")} → ${D(s,"A")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="C0")c=`${D(s,"C")} → ${D(s,"A")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="I0")c=`${D(s,"I")} → ${D(s,"A")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="T")c=`${D(s,"T")} → ${D(-s,"Yd")} → ${D(-s,"C")} → ${D(-s,"A")} → ${D(-s,"DA")} → ${tailY(-s)}`;
  if(k==="M")c=`${D(s,"M")} → ${D(s,"(M/P)")} /dado L → ${s>0?"EOM":"EDM"} → ${D(-s,"i")} → ${D(s,"I")} → ${D(s,"A")} → ${D(s,"DA")} → ${D(s,"Y")}`;
  if(k==="L0")c=`${D(s,"L")} /dado (M/P) → ${s>0?"EDM":"EOM"} → ${D(s,"i")} → ${D(-s,"I")} → ${D(-s,"A")} → ${D(-s,"DA")} → ${D(-s,"Y")}`;
  if(k==="x0")c=`${D(s,"X*")} → ${D(s,"XN")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="q0")c=`${D(s,"Q*")} → ${D(-s,"XN")} → ${D(-s,"DA")} → ${tailY(-s)}`;
  if(k==="Ys")c=`${D(s,"Y*")} → ${D(s,"X")} /dado Q → ${D(s,"XN")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="Ps")c=`${D(s,"P*")} → ${D(s,"TCR")} → [${D(s,"X")} / ${D(-s,"Q")}] → ${D(s,"XN")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="E")c=`${D(s,"E")} (decisión del BC) → ${D(s,"TCR")} → [${D(s,"X")} / ${D(-s,"Q")}] → ${D(s,"XN")} → ${D(s,"DA")} → ${tailY(s)}`;
  if(k==="is")c=`${D(s,"i*")} → ${D(s,"RE")} /dada la RI → DR ${s>0?"˂ 0":"> 0"} → ${s>0?"salida":"entrada"} de capitales → ${s>0?"déficit":"superávit"} en BP → ${s>0?"EDD":"EOD"}`;
  if(k==="ee")c=`${D(s,"Eᵉt+1/Et")} → ${D(s,"RE")} /dada la RI → DR ${s>0?"˂ 0":"> 0"} → ${s>0?"salida":"entrada"} de capitales → ${s>0?"déficit":"superávit"} en BP → ${s>0?"EDD":"EOD"}`;
  if(k==="fa")c=`${D(s,"F")} (preferencia por activos en pesos) → ${s>0?"entrada":"salida"} de capitales → ${s>0?"superávit":"déficit"} en BP → ${s>0?"EOD":"EDD"}`;
  return c}
function mfCurvas(r){const g=r.sh.g;return{emb:["emb","ext","cam"].includes(g)&&r.shock!=="is",emm:g==="emm",bp:["ext","bp","cam"].includes(g)}}
SIMS.mf=function(opt){opt=opt||{};let mob=opt.mob||"steep",reg=opt.reg||"fijo",shock=opt.shock||"M",dir=1,zonas=!!opt.zonas;
  const SH=Object.keys(M2.MFSHOCK);
  $("sim").innerHTML=`${seg("mf-mob","Movilidad del capital",MOBS,mob)}${seg("mf-reg","Régimen cambiario",[["fijo","Tipo de cambio fijo"],["flexible","Tipo de cambio flexible"]],reg)}
  <div class="row slv-top"><label class="selw" for="mf-sh">Choque<select id="mf-sh">${SH.map(k=>`<option value="${k}"${k===shock?" selected":""}>${M2.MFSHOCK[k].t}</option>`).join("")}</select></label>${seg("mf-dir","Sentido",[["1","Aumento"],["-1","Disminución"]],"1")}</div>
  <div id="mf-out" class="slv-out"></div>`;
  const run=()=>{if(shock==="E"&&reg!=="fijo"){$("mf-out").innerHTML=`<p class="err">La devaluación decretada es un instrumento del tipo de cambio fijo. Con tipo de cambio flexible, el mercado determina E.</p>`;return}
    const r=M2.mf(mob,reg,shock,dir),F=r.F,p0=r.p0,p1=r.p1,p2=r.p2,e0=r.e0,q1=r.q1,e2=r.e2;
    const Ys=[e0.Y,q1.Y,e2.Y],is_=[e0.i,q1.i,e2.i];const ylo=Math.min(...Ys)-150,yhi=Math.max(...Ys)+150,ilo=Math.min(...is_,p1.is)-2.2,ihi=Math.max(...is_,p1.is)+2.2;
    const cu=[],ch=mfCurvas(r);
    const bpC=(p,col,lab,dash,op)=>F===0?{vx:M2.mfBPY(p),col,lab,dash,op}:{f:Y=>M2.mfBPline(p,F,Y),col,lab,dash,op};
    cu.push({f:Y=>M2.mfIS(p0,Y),col:"--line",lab:"EMB₀",dash:"",op:.4},{f:Y=>M2.mfLM(p0,Y),col:"--branch",lab:"EMM₀",op:.4,at:"start"},bpC(p0,"--exam","BP₀=0","",.4));
    if(ch.emb)cu.push({f:Y=>M2.mfIS(p1,Y),col:"--line",lab:"EMB₁",dash:"6 4"});
    if(ch.emm)cu.push({f:Y=>M2.mfLM(p1,Y),col:"--branch",lab:"EMM₁",dash:"6 4",at:"start"});
    if(ch.bp)cu.push(bpC(p1,"--exam","BP₁=0","6 4"));
    // curvas del ajuste final
    if(reg==="fijo"&&Math.abs(p2.M-p1.M)>1e-6){if(Math.abs(p2.M-p0.M)<1e-6){cu[1].lab="EMM₀ = EMM₂";cu[1].op=.9}else cu.push({f:Y=>M2.mfLM(p2,Y),col:"--branch",lab:"EMM₂",at:"start"})}
    if(reg==="flexible"&&Math.abs(p2.E-p1.E)>1e-6){cu.push({f:Y=>M2.mfIS(p2,Y),col:"--line",lab:"EMB₂"});cu.push(bpC(p2,"--exam","BP₂=0",""))}
    const pts=[{x:e0.Y,y:e0.i,lab:"0",col:"--muted"},{x:q1.Y,y:q1.i,lab:"1",col:"--bad",dy:16},{x:e2.Y,y:e2.i,lab:"2",col:"--good"}];
    const g=gplot({xr:[ylo,yhi],yr:[ilo,ihi],curves:cu,points:pts,arrows:[{x1:e0.Y,y1:e0.i,x2:q1.Y,y2:q1.i,col:"--bad"},{x1:q1.Y,y1:q1.i,x2:e2.Y,y2:e2.i,col:"--good"}],xl:"Y",yl:"i",id:"mf-svg",label:"Modelo Mundell-Fleming"});
    // textos
    const bp1=r.bp1.bp,dY=q1.Y-e0.Y,di=q1.i-e0.i;let imp=`<p><b>Efecto impacto (paso del punto 0 al 1).</b></p>${chain(mfImpacto(r))}`;
    if(["is","ee","fa"].includes(shock)){imp+=`<p>La EMB y la EMM no se mueven: el punto 1 coincide con el 0, pero ${F===0?"sin movilidad del capital este choque no afecta la BP: no hay nada que ajustar.":`la curva BP=0 se desplaza ${(shock==="fa"?-dir:dir)>0?"arriba y a la izquierda":"abajo y a la derecha"} y el punto queda en una zona de ${bp1>0?"superávit":"déficit"}.`}</p>`}
    else{const parts=[];
      if(Math.abs(r.dTradeExo)>1e-6)parts.push(`el choque cambia directamente la balanza comercial (${D(sg(r.dTradeExo),"XN")})`);
      if(Math.abs(dY)>1e-6)parts.push(`el ${D(sg(dY),"Y")} → ${D(sg(dY),"Q")} /dado X → ${D(-sg(dY),"XN")}`);
      const cap=F===0?"sin movilidad del capital, el cambio en la tasa de interés no mueve divisas":Math.abs(di)<1e-6?"la tasa de interés no cambia":`la ${D(sg(di),"i")} → ${D(sg(di),"RI")} /dada la RE → DR ${di>0?"> 0":"˂ 0"} → ${di>0?"entrada":"salida"} de capitales${F===Infinity?" masiva (movilidad perfecta)":""}`;
      imp+=`<p>Esto mueve la balanza de pagos por dos vías: (i) cuenta corriente: ${parts.join("; ")||"no cambia"}; (ii) cuenta financiera: ${cap}.</p>`}
    const zon=bp1>1e-6?"superávit en BP: exceso de oferta de divisas (EOD)":bp1<-1e-6?"déficit en BP: exceso de demanda de divisas (EDD)":"equilibrio externo (BP = 0)";
    imp+=`<div class="verdict ${Math.abs(bp1)<1e-6?"acc":"warnv"}">En el punto 1: ${zon}${isFinite(bp1)&&Math.abs(bp1)>1e-6?` (saldo ${f1(bp1)})`:""}.</div>`;
    let adj=`<p><b>Ajuste final (paso del punto 1 al 2) con tipo de cambio ${reg}.</b></p>`;
    if(Math.abs(bp1)<1e-6&&!(shock==="E")){adj+=`<p>No hay desequilibrio externo, así que no hay ajuste adicional: el punto 1 es el equilibrio final.</p>`}
    else if(reg==="fijo"){const buy=bp1>0;adj+=chain(`${buy?"EOD":"EDD"} → presión a la ${buy?"apreciación (∆-E)":"depreciación (∆+E)"} → el BC ${buy?"compra":"vende"} US (${buy?"∆+RI":"∆-RI"}) → ${D(buy?1:-1,"M")} → ${D(buy?1:-1,"(M/P)")} /dado L → ${buy?"EOM":"EDM"} → ${D(buy?-1:1,"i")} → ${D(buy?1:-1,"I")} → ${D(buy?1:-1,"DA")} → ${D(buy?1:-1,"Y")}`)+`<p>La EMM se desplaza ${buy?"abajo y a la derecha":"arriba y a la izquierda"} hasta cruzar la EMB y la BP=0 en el punto 2. La política monetaria se vuelve endógena a la intervención: las reservas ${buy?"aumentan":"caen"} en ${f1(Math.abs(r.dRI))}.</p>`}
    else{const dep=bp1<0||(shock==="E");adj+=chain(`${dep?"EDD":"EOD"} → ${dep?"∆+E (depreciación)":"∆-E (apreciación)"} /dados P y P* → ${D(dep?1:-1,"TCR")} → [${D(dep?1:-1,"X")} / ${D(dep?-1:1,"Q")}] → ${D(dep?1:-1,"XN")} → ${D(dep?1:-1,"DA")} → ${D(dep?1:-1,"Y")}`)+`<p>La EMB se desplaza ${dep?"a la derecha":"a la izquierda"} y la BP=0 ${F===0?(dep?"a la derecha":"a la izquierda"):(dep?"abajo y a la derecha":"arriba y a la izquierda")}${F===Infinity?" (con movilidad perfecta la BP no se mueve: es la recta i = i*)":""}, hasta que las tres curvas se cruzan en el punto 2. La oferta monetaria no cambia.</p>`}
    const dYf=e2.Y-e0.Y,dif=e2.i-e0.i,dEf=e2.E/e0.E-1;
    let nota="";if(F===Infinity&&reg==="fijo"&&r.sh.g==="emm")nota="Con movilidad perfecta y tipo de cambio fijo, la política monetaria es <b>ineficaz</b>: el BC deshace la expansión vendiendo reservas.";
    if(F===Infinity&&reg==="flexible"&&r.sh.g==="emb")nota="Con movilidad perfecta y tipo de cambio flexible, la política fiscal es <b>ineficaz</b>: la apreciación reduce las exportaciones netas en la misma cuantía (desplazamiento externo).";
    if(F===Infinity&&reg==="fijo"&&r.sh.g==="emb")nota="Con movilidad perfecta y tipo de cambio fijo, la política fiscal alcanza su <b>máximo efecto</b>: la intervención expande el dinero y la tasa de interés vuelve a i*.";
    if(F===Infinity&&reg==="flexible"&&r.sh.g==="emm")nota="Con movilidad perfecta y tipo de cambio flexible, la política monetaria alcanza su <b>máximo efecto</b>: la depreciación refuerza la demanda.";
    const row=(l,a,b,c,fx)=>`<tr><td>${l}</td><td class="num">${fx(a)}</td><td class="num">${fx(b)}</td><td class="num">${fx(c)}</td></tr>`;
    const bpTxt=x=>!isFinite(x)?(x>0?"superávit":"déficit"):f1(x);
    const tab=`<div class="tbl"><table><tr><th></th><th>0 · inicial</th><th>1 · impacto</th><th>2 · final</th></tr>${row("Renta Y",e0.Y,q1.Y,e2.Y,f1)}${row("Tasa de interés i (%)",e0.i,q1.i,e2.i,f2)}${row("Tipo de cambio E (índice)",1,p1.E,reg==="fijo"?p1.E:e2.E,v=>fmt(v,3))}${row("Oferta monetaria M",p0.M,p1.M,p2.M,f1)}${row("Exportaciones netas XN",M2.mfXN(p0,e0.Y),M2.mfXN(p1,q1.Y),M2.mfXN(p2,e2.Y),f1)}${row("Saldo de la BP",r.bp0.bp,bp1,r.bp2.bp,bpTxt)}</table></div>`;
    $("mf-out").innerHTML=`${legend2([["--line","EMB (IS)"],["--branch","EMM (LM)"],["--exam","BP = 0"]])}${g}<p class="hint">Líneas tenues: curvas iniciales. Punteadas: después del choque. Continuas: después del ajuste. ${zonas?"Haz clic en cualquier punto del gráfico para ver en qué zona de desequilibrio está.":""}</p>
      ${seg("mf-z","Zonas",[["0","Ocultar zonas"],["1","Explorar zonas con un clic"]],zonas?"1":"0")}<div id="mf-zres"></div>
      <div class="stepc">${imp}</div><div class="stepc">${adj}</div>
      <div class="stepc"><p><b>Efecto final.</b> La renta ${flechaV(dYf)} (${dYf>=0?"+":""}${f1(dYf)}), la tasa de interés ${flechaV(dif)} (${dif>=0?"+":""}${f2(dif)} puntos)${reg==="flexible"?`, el tipo de cambio ${sg(dEf)>0?"se deprecia":sg(dEf)<0?"se aprecia":"no cambia"} (${dEf>=0?"+":""}${fmt(dEf*100,1)} %)`:`, las reservas ${r.dRI>0?"suben":r.dRI<0?"bajan":"no cambian"} (${r.dRI>=0?"+":""}${f1(r.dRI)})`}.</p>${nota?`<p>${nota}</p>`:""}${tab}</div>`;
    bindSeg("mf-z",v=>{zonas=v==="1";run()});
    const svg=$("mf-svg");if(zonas&&svg){svg.style.cursor="crosshair";svg.addEventListener("click",ev=>{const c=gclick(svg,ev),z=M2.mfZona(p0,F,c.x,c.y);
      $("mf-zres").innerHTML=`<div class="res">${tiles([["Punto",`Y = ${f0(c.x)}, i = ${f2(c.y)}`],["Mercado de bienes (EMB₀)",z.bienes],["Mercado monetario (EMM₀)",z.dinero],["Balanza de pagos (BP₀=0)",z.bp]])}</div><p class="hint">EOB: exceso de oferta de bienes (Y > DA). EDB: exceso de demanda de bienes. EOM/EDM: exceso de oferta o demanda monetaria. Las zonas se miden frente a las curvas iniciales.</p>`})}
    typeset($("mf-out"))};
  bindSeg("mf-mob",v=>{mob=v;run()});bindSeg("mf-reg",v=>{reg=v;run()});bindSeg("mf-dir",v=>{dir=+v;run()});$("mf-sh").onchange=e=>{shock=e.target.value;run()};run()};

// ====================================================================
// 5. Modelo Krugman EMA–EMB
SIMS.krug=function(){let reg="flexible",shock="M",dir=1;const SH=Object.keys(M2.KSHOCK);
  $("sim").innerHTML=`${seg("kr-reg","Régimen cambiario",[["flexible","Tipo de cambio flexible"],["fijo","Tipo de cambio fijo"]],reg)}<div class="row slv-top"><label class="selw" for="kr-sh">Choque<select id="kr-sh">${SH.map(k=>`<option value="${k}">${M2.KSHOCK[k].t}</option>`).join("")}</select></label>${seg("kr-dir","Sentido",[["1","Aumento"],["-1","Disminución"]],"1")}</div><div id="kr-out" class="slv-out"></div>`;
  const run=()=>{const r=M2.krug(reg,shock,dir),p0=r.p0,p1=r.p1,p2=r.p2,e0=r.e0,A=r.A,e2=r.e2,s=dir,ema=r.sh.g==="ema";
    const Ys=[e0.Y,A.Y,e2.Y],Es=[e0.E,A.E,e2.E];const xr=[Math.min(...Ys)-160,Math.max(...Ys)+160],yr=[Math.min(...Es)-0.18,Math.max(...Es)+0.18];
    const cu=[{f:Y=>M2.kEMB(p0,Y),col:"--line",lab:"EMB₀",op:.4},{f:Y=>M2.kEMA(p0,Y),col:"--branch",lab:"EMA₀",op:.4,at:"start"}];
    if(!ema)cu.push({f:Y=>M2.kEMB(p1,Y),col:"--line",lab:"EMB₁",dash:"6 4"});else cu.push({f:Y=>M2.kEMA(p1,Y),col:"--branch",lab:"EMA₁",dash:"6 4",at:"start"});
    if(reg==="fijo"&&Math.abs(r.dM)>1e-6)cu.push({f:Y=>M2.kEMA(p2,Y),col:"--branch",lab:"EMA₂",at:"start"});
    if(reg==="fijo")cu.push({f:()=>p0.E,col:"--muted",lab:"Ē",dash:"2 4"});
    const g=gplot({xr,yr,curves:cu,points:[{x:e0.Y,y:e0.E,lab:"0",col:"--muted"},{x:A.Y,y:A.E,lab:"A",col:"--bad",dy:16},{x:e2.Y,y:e2.E,lab:"1",col:"--good"}],arrows:[{x1:e0.Y,y1:e0.E,x2:A.Y,y2:A.E,col:"--bad"},{x1:A.Y,y1:A.E,x2:e2.Y,y2:e2.E,col:"--good"}],xl:"Y",yl:"E",label:"Modelo EMA-EMB"});
    const k=shock;let c1="",c2="";
    if(reg==="flexible"){
      if(k==="M")c1=`${D(s,"M")} → ${D(s,"(M/P)")} /dado L → ${s>0?"EOM":"EDM"} → ${D(-s,"i")} → ${D(-s,"RI")} /dada la RE → DR ${s>0?"˂ 0":"> 0"} → ${s>0?"salida":"entrada"} de capitales → ${s>0?"EDD":"EOD"} → ${D(s,"E")}`;
      if(k==="L0")c1=`${D(s,"L")} /dado (M/P) → ${s>0?"EDM":"EOM"} → ${D(s,"i")} → ${D(s,"RI")} /dada la RE → DR ${s>0?"> 0":"˂ 0"} → ${s>0?"entrada":"salida"} de capitales → ${s>0?"EOD":"EDD"} → ${D(-s,"E")}`;
      if(k==="is")c1=`${D(s,"i*")} → ${D(s,"RE")} /dada la RI → DR ${s>0?"˂ 0":"> 0"} → ${s>0?"salida":"entrada"} de capitales → ${s>0?"EDD":"EOD"} → ${D(s,"E")}`;
      if(k==="Ee")c1=`${D(s,"Eᵉt+1")} → ${D(s,"RE")} → DR ${s>0?"˂ 0":"> 0"} → ${s>0?"EDD":"EOD"} → ${D(s,"E")}`;
      if(!ema)c1=`${k==="T"?`${D(s,"T")} → ${D(-s,"Yd")} → ${D(-s,"C")}`:k==="X"?`${D(s,"X*")} → ${D(s,"XN")}`:D(s,"G")} → ${D(k==="T"?-s:s,"DA")} → ${D(k==="T"?-s:s,"Y")} (punto A, con E dado)`;
      const sE=sg(e2.E-A.E),sY=sg(e2.Y-A.Y);
      c2=ema?`En A el mercado de activos ya está en equilibrio, pero hay ${sg(A.E-e0.E)>0?"exceso de demanda de bienes (EDB)":"exceso de oferta de bienes (EOB)"}: ${D(sg(A.E-e0.E),"TCR")} → ${D(sg(A.E-e0.E),"XN")} → ${D(sY,"DA")} → ${D(sY,"Y")}. Al moverse Y, ${D(sY,"L")} → ${D(sY,"i")} → el tipo de cambio corrige parcialmente (${D(sE,"E")}) hasta el punto 1.${k==="M"?` Hay <b>overshooting</b>: la depreciación de corto plazo (E₀ → E_A) es mayor que la final (E₀ → E₁).`:""}`
        :`En A el mercado de bienes está en equilibrio, pero el de activos no: ${D(sg(A.Y-e0.Y),"Y")} → ${D(sg(A.Y-e0.Y),"L")} /dado (M/P) → ${sg(A.Y-e0.Y)>0?"EDM":"EOM"} → ${D(sg(A.Y-e0.Y),"i")} → ${sg(A.Y-e0.Y)>0?"entrada de capitales → EOD → ∆-E":"salida de capitales → EDD → ∆+E"}. El cambio en E mueve las XN y corrige parte del efecto sobre Y, hasta el punto 1.`}
    else{
      c1=ema?`${k==="M"?`${D(s,"M")} → ${s>0?"EOM":"EDM"} → ${D(-s,"i")}`:k==="L0"?`${D(s,"L")} → ${s>0?"EDM":"EOM"} → ${D(s,"i")}`:k==="is"?`${D(s,"i*")} → DR ${s>0?"˂ 0":"> 0"}`:`${D(s,"Eᵉt+1")} → DR ${s>0?"˂ 0":"> 0"}`} → ${sg(r.dM)<0?"salida de capitales → EDD":"entrada de capitales → EOD"} → presión sobre Ē (punto imaginario A)`
        :`${k==="T"?`${D(s,"T")} → ${D(-s,"Yd")}`:k==="X"?D(s,"X*"):D(s,"G")} → ${D(k==="T"?-s:s,"DA")} → ${D(k==="T"?-s:s,"Y")} → ${D(k==="T"?-s:s,"L")} → ${D(k==="T"?-s:s,"i")} → ${sg(r.dM)>0?"entrada de capitales → EOD":"salida de capitales → EDD"} → presión sobre Ē`;
      c2=`Para sostener Ē, el BC ${r.dM>0?"compra":"vende"} US (${r.dM>0?"∆+RI":"∆-RI"}) → ${D(sg(r.dM),"M")}: la EMA se desplaza ${r.dM>0?"a la derecha":"a la izquierda"} hasta el punto 1. ${ema?"La política monetaria pierde su efecto sobre la renta: Y vuelve a Y₀.":"La política fiscal alcanza todo su efecto, porque la intervención acomoda la demanda de dinero."}`}
    $("kr-out").innerHTML=`${legend2([["--line","EMB (DD)"],["--branch","EMA (AA)"]])}${g}<div class="stepc"><p><b>Efecto impacto (0 → A).</b></p>${chain(c1)}</div><div class="stepc"><p><b>Ajuste (A → 1).</b> ${c2}</p>
      <div class="tbl"><table><tr><th></th><th>0</th><th>A</th><th>1</th></tr><tr><td>Renta Y</td><td class="num">${f1(e0.Y)}</td><td class="num">${f1(A.Y)}</td><td class="num">${f1(e2.Y)}</td></tr><tr><td>Tipo de cambio E</td><td class="num">${fmt(e0.E,3)}</td><td class="num">${fmt(A.E,3)}</td><td class="num">${fmt(e2.E,3)}</td></tr>${reg==="fijo"?`<tr><td>Oferta monetaria M</td><td class="num">${f1(p0.M)}</td><td class="num">${f1(p1.M)}</td><td class="num">${f1(p2.M)}</td></tr>`:""}</table></div></div>`};
  bindSeg("kr-reg",v=>{reg=v;run()});bindSeg("kr-dir",v=>{dir=+v;run()});$("kr-sh").onchange=e=>{shock=e.target.value;run()};run()};

// ====================================================================
// 6. Modelo SA-DA de los cuatro planos
SIMS.sada=function(opt){opt=opt||{};let mod=opt.mod||"clasico",shock=opt.shock||"Mup";
  $("sim").innerHTML=`${seg("sd-m","Modelo",Object.entries(M2.SMOD).map(([k,v])=>[k,v.replace("Macroeconomía ","").replace("macroeconomía ","")]),mod)}<div class="row slv-top"><label class="selw" for="sd-sh">Choque<select id="sd-sh">${Object.keys(M2.SSHOCK).map(k=>`<option value="${k}"${k===shock?" selected":""}>${M2.SSHOCK[k].t}</option>`).join("")}</select></label></div><div id="sd-out" class="slv-out"></div>`;
  const run=()=>{const r=M2.sada(mod,shock),p0=r.p0,p1=r.p1,st=r.st,last=st[st.length-1],Pl=last.P,W0=r.W0;
    const Ys=st.map(x=>x.Y),Ps=st.map(x=>x.P),Ns=st.map(x=>x.N),Ws=st.map(x=>x.W);
    const yr_=[Math.min(...Ys)-90,Math.max(...Ys)+90],pr=[Math.min(...Ps)*0.82,Math.max(...Ps)*1.15],nr=[Math.min(...Ns)-20,Math.max(...Ns)+20];
    const ir=[Math.min(...st.map(x=>x.i))-2.5,Math.max(...st.map(x=>x.i))+2.5],wr=[Math.min(...Ws)*0.8,Math.max(...Ws)*1.2],rr=[Math.min(...st.map(x=>x.wr))*0.8,Math.max(...st.map(x=>x.wr))*1.2];
    const lbl=st.map((x,k)=>({x:x.Y,i:x.i,P:x.P,N:x.N,W:x.W,wr:x.wr,lab:String(k),col:k===0?"--muted":k===st.length-1?"--good":"--bad"}));
    // (Y,i)
    const same=(u,v)=>Math.abs(u-v)<1e-6,c1=[{f:Y=>(p0.A0-p0.s*Y)/p0.b,col:"--line",lab:same(p0.A0,p1.A0)?"EMB":"EMB₀",op:same(p0.A0,p1.A0)?0:.4}];
    if(!same(p0.A0,p1.A0))c1.push({f:Y=>(p1.A0-p1.s*Y)/p1.b,col:"--line",lab:"EMB₁"});
    const mpF=p1.M/Pl,lmEq=same(mpF,p0.M);c1.push({f:Y=>(p0.k*Y-p0.M)/p0.h,col:"--branch",lab:lmEq?"EMM₀ = EMM final":"EMM(M₀/P₀)",op:lmEq?0:.4,at:"start"});
    if(!same(p1.M,p0.M))c1.push({f:Y=>(p1.k*Y-p1.M)/p1.h,col:"--branch",lab:"EMM(M₁/P₀)",dash:"6 4",at:"start"});
    if(!lmEq)c1.push({f:Y=>(p1.k*Y-mpF)/p1.h,col:"--branch",lab:"EMM final",at:"start"});
    const g1=gplot({W:300,H:230,xr:yr_,yr:ir,curves:c1,points:lbl.map(q=>({x:q.x,y:q.i,lab:q.lab,col:q.col})),xl:"Y",yl:"i",label:"Mercados de bienes y activos"});
    // (N,W)
    const supW=(p,P,Pe)=>N=>mod==="clasico"?P*p.g*N:mod==="nmc"?Pe*p.g*N:p.g*N*P;
    const cW=[{f:N=>1*M2.sFN(N,p0),col:"--line",lab:"P₀·FN",op:.4},{f:N=>Pl*M2.sFN(N,p1),col:"--line",lab:"P·FN final"}];
    if(mod==="nmk"||mod==="keynes")cW.push({f:()=>W0,col:"--bad",lab:mod==="nmk"?"W̄ (salario mínimo)":"W fijo"});
    if(mod==="clasico"||mod==="nmc"||mod==="nmk")cW.push({f:supW(p0,1,1),col:"--branch",lab:mod==="nmc"?"Pᵉ₀·G":"P₀·G",op:.4,at:"start"});
    if(mod==="clasico")cW.push({f:supW(p1,Pl,Pl),col:"--branch",lab:"P·G final",at:"start"});
    if(mod==="nmc")cW.push({f:supW(p1,Pl,Pl),col:"--branch",lab:"Pᵉ·G final",at:"start"});
    const g2=gplot({W:300,H:230,xr:nr,yr:wr,curves:cW,points:lbl.map(q=>({x:q.N,y:q.W,lab:q.lab,col:q.col})),xl:"N",yl:"W",label:"Mercado de trabajo nominal"});
    // (Y,P)
    const daP=p=>{const pts=[];for(let k=0;k<=80;k++){const P=pr[0]+(pr[1]-pr[0])*k/80;pts.push([M2.sDA(p,P),P])}return pts.sort((a,b)=>a[0]-b[0])};
    const cP=[{pts:daP(p0),col:"--line",lab:"DA₀",op:.4},{pts:daP(p1),col:"--line",lab:"DA₁"}];
    const saPts=(p,fn)=>{const pts=[];for(let k=0;k<=80;k++){const P=pr[0]+(pr[1]-pr[0])*k/80;pts.push([fn(p,P),P])}return pts.sort((a,b)=>a[0]-b[0])};
    if(mod==="clasico"){cP.push({vx:st[0].ybar,col:"--branch",lab:"SA₀",op:.4},{vx:last.ybar,col:"--branch",lab:"SA"})}
    if(mod==="nmc"){cP.push({pts:saPts(p0,(p,P)=>M2.sState("nmc",p,P,{Pe:1}).Y),col:"--branch",lab:"SA(Pᵉ₀)",op:.4,at:"start"});if(st.length>3)cP.push({pts:saPts(p1,(p,P)=>M2.sState("nmc",p,P,{Pe:st[2].P}).Y),col:"--branch",lab:"SA(Pᵉ₀) tras el choque",dash:"6 4",at:"start"},{pts:saPts(p1,(p,P)=>M2.sState("nmc",p,P,{Pe:Pl}).Y),col:"--branch",lab:"SA(Pᵉ₁)",at:"start"});cP.push({vx:last.ybar,col:"--muted",lab:"Ȳ",dash:"2 4"})}
    if(mod==="nmk"){cP.push({pts:saPts(p0,(p,P)=>M2.sState("nmk",p,P,{W:W0}).Y),col:"--branch",lab:"SA(W̄)₀",op:.4,at:"start"},{pts:saPts(p1,(p,P)=>M2.sState("nmk",p,P,{W:W0}).Y),col:"--branch",lab:"SA(W̄)",at:"start"},{vx:st[0].ybar,col:"--muted",lab:"Ȳ",dash:"2 4"})}
    if(mod==="keynes"){cP.push({f:()=>1,col:"--branch",lab:"SA(P̄₀)",op:.4},{f:()=>Pl,col:"--branch",lab:"SA(P̄)"})}
    const g3=gplot({W:300,H:230,xr:yr_,yr:pr,curves:cP,points:lbl.map(q=>({x:q.x,y:q.P,lab:q.lab,col:q.col})),xl:"Y",yl:"P",label:"Oferta y demanda agregada"});
    // (N,W/P)
    const cR=same(p0.cw,p1.cw)?[{f:N=>M2.sFN(N,p0),col:"--line",lab:"FN"}]:[{f:N=>M2.sFN(N,p0),col:"--line",lab:"FN₀",op:.4},{f:N=>M2.sFN(N,p1),col:"--line",lab:"FN₁"}];cR.push({f:N=>p0.g*N,col:"--branch",lab:"G(N)",at:"start"});
    if(mod==="nmk")cR.push({f:()=>W0/Pl,col:"--bad",lab:"W̄/P final"},{f:()=>W0,col:"--bad",lab:"W̄/P₀",op:.4});
    const g4=gplot({W:300,H:230,xr:nr,yr:rr,curves:cR,points:lbl.map(q=>({x:q.N,y:q.wr,lab:q.lab,col:q.col})),xl:"N",yl:"W/P",label:"Mercado de trabajo real"});
    const ar=(a,b)=>{const d=b-a;return Math.abs(d)<1e-6?"0":d>0?"∆+":"∆-"};
    const tab=`<div class="tbl"><table><tr><th>Etapa</th><th>Y</th><th>i</th><th>P</th><th>W</th><th>W/P</th><th>N</th></tr>${st.map((x,k)=>`<tr><td>${k} · ${x.lab}</td><td class="num">${f1(x.Y)}${k?` <small>${ar(st[k-1].Y,x.Y)}</small>`:""}</td><td class="num">${f2(x.i)}${k?` <small>${ar(st[k-1].i,x.i)}</small>`:""}</td><td class="num">${fmt(x.P,3)}${k?` <small>${ar(st[k-1].P,x.P)}</small>`:""}</td><td class="num">${f2(x.W)}${k?` <small>${ar(st[k-1].W,x.W)}</small>`:""}</td><td class="num">${f2(x.wr)}${k?` <small>${ar(st[k-1].wr,x.wr)}</small>`:""}</td><td class="num">${f1(x.N)}${k?` <small>${ar(st[k-1].N,x.N)}</small>`:""}</td></tr>`).join("")}</table></div>`;
    $("sd-out").innerHTML=`<div class="g4">${g1}${g2}${g3}${g4}</div><p class="hint">Arriba: mercados de bienes y activos (Y, i) y mercado de trabajo nominal (N, W). Abajo: oferta y demanda agregada (Y, P) y mercado de trabajo real (N, W/P). Curvas tenues: iniciales.</p>${tab}<div class="stepc">${sadaTexto(r)}</div>`};
  bindSeg("sd-m",v=>{mod=v;run()});$("sd-sh").onchange=e=>{shock=e.target.value;run()};run()};
function sadaTexto(r){const st=r.st,k=r.shock,m=r.mod,last=st[st.length-1],ini=st[0];const dY=last.Y-ini.Y,dP=last.P-ini.P,dN=last.N-ini.N;
  const dem={Mup:`${D(1,"M")} → ${D(1,"(M/P)")} /dado L → EOM → ${D(-1,"i")} → ${D(1,"I")} → ${D(1,"A")} → ${D(1,"DA")} → ${D(1,"Y")}`,Mdn:`${D(-1,"M")} → ${D(-1,"(M/P)")} /dado L → EDM → ${D(1,"i")} → ${D(-1,"I")} → ${D(-1,"DA")} → ${D(-1,"Y")}`,
    Gup:`${D(1,"G")} → ${D(1,"A")} → ${D(1,"DA")} → ${D(1,"Y")}`,Cdn:`${D(-1,"C")} → ${D(-1,"A")} → ${D(-1,"DA")} → ${D(-1,"Y")}`,Tup:`${D(1,"T")} → ${D(-1,"Yd")} → ${D(-1,"C")} → ${D(-1,"DA")} → ${D(-1,"Y")}`,
    oil:`${D(1,"PIQ")} (insumo importado) → ${D(1,"Q")} en valor → ${D(-1,"XN")} → EDD → ${D(1,"E")} → ${D(1,"TCR")} → ${D(1,"DA")}; y al mismo tiempo ${D(1,"PIQ")} → ${D(1,"costos de producción")} → la SA se contrae`,
    oilDn:`${D(-1,"PIQ")} → ${D(-1,"costos de producción")} → la SA se expande; la apreciación (${D(-1,"E")}) contrae un poco la DA`}[k];
  let h=`<p><b>Efecto impacto.</b></p>${chain(dem)}`;
  if(m==="clasico")h+=`<p><b>Ajuste.</b> Con información completa y salarios flexibles, ${Math.abs(st[1].Y-ini.Y)>1e-6&&!k.startsWith("oil")?`el ${st[1].Y>ini.Y?"exceso de demanda agregada (EDA) sube los precios":"exceso de oferta agregada baja los precios"}: ${D(sg(dP),"P")} → ${D(-sg(dP),"(M/P)")} /dado L → ${dP>0?"EDM":"EOM"} → ${D(sg(dP),"i")} → ${D(-sg(dP),"DA")}, y la economía vuelve a Ȳ.`:""} En el mercado de trabajo, ${D(sg(dP),"P")} → ${D(sg(last.W-ini.W),"W")} en la misma proporción: el salario real ${Math.abs(last.wr-ini.wr)<1e-3?"no cambia":"cambia por el choque de costos"}. ${k.startsWith("oil")?"El choque de costos reduce la demanda de trabajo y el empleo de pleno empleo: la SA vertical se desplaza a la izquierda (estanflación).":"Se verifica la neutralidad: a largo plazo solo cambian las variables nominales."}</p>`;
  if(m==="nmc")h+=`<p><b>Corto plazo.</b> Los precios ${dP>=0?"suben":"bajan"} y los trabajadores no lo perciben (Pᵉ dado): ${D(sg(st[2].P-1),"P")} /dado Pᵉ → ${D(-sg(st[2].P-1),"(W/P)")} como costo → ${D(sg(st[2].P-1),"demanda de trabajo")} → ${D(sg(st[2].N-ini.N),"N")} → ${D(sg(st[2].Y-ini.Y),"Y")}. Es la <b>asimetría de información</b>: hay efectos reales transitorios.</p><p><b>Largo plazo.</b> Cuando los trabajadores corrigen sus expectativas (Pᵉ = P), exigen ${D(sg(dP),"W")}: la SA de corto plazo se desplaza y la economía vuelve a Ȳ con precios ${dP>=0?"más altos":"más bajos"}.</p>`;
  if(m==="keynes")h+=`<p><b>Efecto final.</b> Con precios fijos y capacidad ociosa, la DA determina el producto: ${D(sg(dY),"Y")} → ${D(sg(dN),"N")} sin cambio en salarios. ${k.startsWith("oil")?"El choque de costos sube el nivel de precios fijado (la SA horizontal se desplaza hacia arriba), los saldos reales caen y la producción baja.":""}</p>`;
  if(m==="nmk")h+=`<p><b>Ajuste.</b> El salario mínimo nominal (W̄) no cambia. ${D(sg(dP),"P")} /dado W̄ → ${D(-sg(dP),"(W̄/P)")} → ${D(sg(dP),"demanda de trabajo")} → ${D(sg(dN),"N")} → ${D(sg(dY),"Y")}. Como hay exceso de oferta de trabajo, la oferta laboral no limita el empleo y el efecto real <b>persiste</b>: no hay fuerza que lleve la economía al pleno empleo.</p>`;
  h+=`<div class="verdict ${dY>=0?"acc":"warnv"}">Resultado: Y ${flechaV(dY)} (${dY>=0?"+":""}${f1(dY)}), P ${flechaV(dP)} (${dP>=0?"+":""}${fmt(dP*100,1)} %), N ${flechaV(dN)} (${dN>=0?"+":""}${f1(dN)}).</div>`;return h}

// ====================================================================
// 7. Equilibrio interno y externo en el SA-DA sin capitales con tipo de cambio fijo
SIMS.regiones=function(){let reg="E4";
  const R={E1:{t:"Desempleo con déficit en BP",y:"Y˂Ȳ",bp:"BP˂0",pol:"∆+A: [∆+M] o [∆+G y/o ∆-T] → ∆+DA → ∆+Y",fin:"el ∆+Y → ∆+Q /dado X → agrava el déficit en BP",ok:false,mix:"Devaluación (∆+E) para corregir el déficit, acompañada del control del gasto para que ∆E > ∆P. La devaluación también expande la DA y reduce el desempleo."},
    E2:{t:"Desempleo con superávit en BP",y:"Y˂Ȳ",bp:"BP>0",pol:"∆+A: [∆+M] o [∆+G y/o ∆-T] → ∆+DA → ∆+Y",fin:"el ∆+Y → ∆+Q /dado X → reduce el superávit: se logran ambos equilibrios",ok:true},
    E3:{t:"Sobreempleo con déficit en BP",y:"Y>Ȳ",bp:"BP˂0",pol:"∆-A: [∆-M] o [∆-G y/o ∆+T] → ∆-DA → ∆-Y",fin:"la ∆-Y → ∆-Q /dado X → reduce el déficit: se logran ambos equilibrios",ok:true},
    E4:{t:"Sobreempleo con superávit en BP",y:"Y>Ȳ",bp:"BP>0",pol:"∆-A: [∆-M] o [∆-G y/o ∆+T] → ∆-DA → ∆-Y",fin:"la ∆-Y → ∆-Q /dado X → agrava el superávit en BP",ok:false,mix:"Revaluación (∆-E) para corregir el superávit, combinada con la reducción del gasto interno: una política fiscal (o monetaria) junto con una política cambiaria."}};
  const pos={E1:[880,1.32],E2:[880,0.9],E3:[1120,1.12],E4:[1120,0.68]};
  $("sim").innerHTML=`${seg("rg-r","Región",Object.keys(R).map(k=>[k,`${k}: ${R[k].t}`]),reg)}<div id="rg-out" class="slv-out"></div>`;
  const run=()=>{const x=R[reg],bp=Y=>1+(1000-Y)/600;
    const g=gplot({xr:[750,1250],yr:[0.55,1.45],curves:[{vx:1000,col:"--branch",lab:"Ȳ (equilibrio interno)"},{f:bp,col:"--exam",lab:"BP = 0 [TCR; Y*]"}],points:Object.keys(pos).map(k=>({x:pos[k][0],y:pos[k][1],lab:k,col:k===reg?"--bad":"--muted"})).concat([{x:1000,y:1,lab:"EPE",col:"--good"}]),xl:"Y",yl:"P",label:"Regiones de desequilibrio interno y externo"});
    $("rg-out").innerHTML=`${g}<div class="tbl"><table><tr><th>Región</th><th>Interno</th><th>Externo</th><th>Política de gasto interno (A)</th><th>Efecto</th></tr><tr><td>${reg}</td><td>${x.y}</td><td>${x.bp}</td><td>${x.pol}</td><td>${x.fin}</td></tr></table></div>
    <div class="verdict ${x.ok?"acc":"warnv"}">${x.ok?"La política de gasto interno corrige los dos desequilibrios y lleva al equilibrio simultáneo (EPE).":"Dilema de política: con un solo instrumento se corrige un desequilibrio pero se agudiza el otro."}</div>${x.mix?`<p><b>Solución:</b> ${x.mix}</p>`:""}
    <p class="hint">A la derecha de Ȳ hay sobreempleo (los precios tienden a subir); a la izquierda, desempleo. Sin movilidad del capital, la BP=0 tiene pendiente negativa en (Y, P): por encima o a la derecha hay déficit (∆P abarata las importaciones y ∆Y las aumenta), por debajo o a la izquierda hay superávit.</p>`};
  bindSeg("rg-r",v=>{reg=v;run()});run()};

// ====================================================================
// 8. Modelo (i, P) con y sin esterilización
SIMS.ip=function(){let shock="G",dir=1;
  $("sim").innerHTML=`<div class="row slv-top"><label class="selw" for="ip-sh">Choque<select id="ip-sh">${Object.keys(M2.ISHOCK).map(k=>`<option value="${k}">${M2.ISHOCK[k].t}</option>`).join("")}</select></label>${seg("ip-dir","Sentido",[["1","Como dice el choque"],["-1","Al contrario"]],"1")}</div><div id="ip-out" class="slv-out"></div>`;
  const run=()=>{const r=M2.ip(shock,dir),p0=r.p0,p1=r.p1,e0=r.e0,S=r.S,N=r.N;const Ps=[e0.P,S.P,N.P],is_=[e0.i,S.i,N.i];
    const xr=[Math.min(...Ps)*0.8,Math.max(...Ps)*1.2],yr=[Math.min(...is_)-1.5,Math.max(...is_)+1.5];
    const cu=[{f:P=>M2.iEMB(p0,P),col:"--line",lab:"EMB₀",op:.4},{f:P=>M2.iEMFS(p0,P),col:"--branch",lab:"EMFˢ₀",op:.4,at:"start"},{f:P=>M2.iEMFN(p0,P),col:"--exam",lab:"EMFᴺ₀",op:.4,at:"start"}];
    if(["G","T","X"].includes(shock))cu.push({f:P=>M2.iEMB(p1,P),col:"--line",lab:"EMB₁"});
    if(shock==="M")cu.push({f:P=>M2.iEMFS(p1,P),col:"--branch",lab:"EMFˢ₁",at:"start"},{f:P=>M2.iEMFN(p1,P),col:"--exam",lab:"EMFᴺ₁",at:"start"});
    if(shock==="is")cu.push({f:P=>M2.iEMFN(p1,P),col:"--exam",lab:"EMFᴺ₁",at:"start"});
    const g=gplot({xr,yr,curves:cu,points:[{x:e0.P,y:e0.i,lab:"0",col:"--muted"},{x:S.P,y:S.i,lab:"A (esterilizada)",col:"--branch"},{x:N.P,y:N.i,lab:"B (no esterilizada)",col:"--exam",dy:16}],xl:"P",yl:"i",label:"Modelo i-P"});
    const k=shock,s=dir,mech={G:`${D(s,"G")} → ${D(s,"A")} → ${D(s,"DA")} → ${D(s,"P")} (Y = Ȳ) → ${D(-s,"(M/P)")} /dado L → ${s>0?"EDM":"EOM"} → ${D(s,"i")} → ${s>0?"entrada":"salida"} de capitales → ${s>0?"EOD":"EDD"} → el BC ${s>0?"compra":"vende"} US (${s>0?"∆+R*":"∆-R*"}) → ${D(s,"M")}`,
      T:`${D(s,"T")} → ${D(-s,"Yd")} → ${D(-s,"DA")} → ${D(-s,"P")} → ${D(s,"(M/P)")} /dado L → ${s>0?"EOM":"EDM"} → ${D(-s,"i")} → ${s>0?"salida":"entrada"} de capitales → ${s>0?"EDD":"EOD"} → el BC ${s>0?"vende":"compra"} US (${s>0?"∆-R*":"∆+R*"}) → ${D(-s,"M")}`,
      X:`${D(s,"X")} → ${D(s,"DA")} → ${D(s,"P")} → ${D(-s,"(M/P)")} → ${D(s,"i")} → ${s>0?"entrada":"salida"} de capitales → el BC ${s>0?"compra":"vende"} US → ${D(s,"M")}`,
      M:`${D(s,"M")} → ${D(-s,"i")} → ${D(s,"DA")} → ${D(s,"P")}; la ${D(-s,"i")} → ${s>0?"salida":"entrada"} de capitales → el BC ${s>0?"vende":"compra"} US (${s>0?"∆-R*":"∆+R*"}) → ${D(-s,"M")} que contrarresta parte de la expansión`,
      is:`${D(s,"i*")} → ${s>0?"salida":"entrada"} de capitales → el BC ${s>0?"vende":"compra"} US → ${D(-s,"M")}`}[k];
    $("ip-out").innerHTML=`${legend2([["--line","EMB"],["--branch","EMF con esterilización"],["--exam","EMF sin esterilización"]])}${g}<div class="stepc">${chain(mech)}
      <p><b>Con esterilización</b> (punto A): el BC neutraliza el efecto monetario de la intervención con la operación contraria en crédito primario o pasivos no monetarios (${k==="T"||(k==="M"&&s>0)||(k==="is"&&s>0)?"∆+CP o ∆-PNM":"∆-CP o ∆+PNM"}), y M se queda donde estaba: la EMFˢ es más inclinada.</p>
      <p><b>Sin esterilización</b> (punto B): prevalece el efecto monetario de las reservas, M ${N.M>p1.M0?"aumenta":N.M<p1.M0?"disminuye":"no cambia"} (de ${f1(p1.M0)} a ${f1(N.M)}) y la EMFᴺ es más plana.</p>
      <div class="tbl"><table><tr><th></th><th>0 · inicial</th><th>A · con esterilización</th><th>B · sin esterilización</th></tr><tr><td>Tasa de interés i (%)</td><td class="num">${f2(e0.i)}</td><td class="num">${f2(S.i)}</td><td class="num">${f2(N.i)}</td></tr><tr><td>Nivel de precios P</td><td class="num">${fmt(e0.P,3)}</td><td class="num">${fmt(S.P,3)}</td><td class="num">${fmt(N.P,3)}</td></tr><tr><td>Oferta monetaria M</td><td class="num">${f1(p0.M0)}</td><td class="num">${f1(p1.M0)}</td><td class="num">${f1(N.M)}</td></tr></table></div>
      <p>${Math.abs(S.i-e0.i)>Math.abs(N.i-e0.i)?"El cambio en la tasa de interés es mayor cuando se esteriliza":"El cambio en la tasa de interés es menor cuando se esteriliza"}, y ${Math.abs(S.P-e0.P)<Math.abs(N.P-e0.P)?"el cambio en los precios es menor cuando se esteriliza":"el cambio en los precios es mayor cuando se esteriliza"}. ${["G","T","X"].includes(k)?"Con esterilización el ajuste recae más en la inversión (vía i); sin ella, más en los precios y la producción de transables (vía TCR).":""}</p></div>`};
  bindSeg("ip-dir",v=>{dir=+v;run()});$("ip-sh").onchange=e=>{shock=e.target.value;run()};run()};

// ====================================================================
// 9. Transables y no transables: curvas TT y NN
SIMS.tn=function(opt){opt=opt||{};let shock=opt.shock||"remDn";
  $("sim").innerHTML=`<div class="row slv-top"><label class="selw" for="tn-sh">Choque o política<select id="tn-sh">${Object.keys(M2.TSHOCK).map(k=>`<option value="${k}"${k===shock?" selected":""}>${M2.TSHOCK[k].t}</option>`).join("")}</select></label></div><div id="tn-out" class="slv-out"></div>`;
  const run=()=>{const r=M2.tn(shock),p0=r.p0,p1=r.p1,e0=r.e0,e1=r.e1,o=r.obs,sh=r.sh;
    const cu=[{f:Z=>M2.tTT(p0,Z),col:"--exam",lab:"TT₀",op:.4,at:"start"},{f:Z=>M2.tNN(p0,Z),col:"--branch",lab:"NN₀",op:.4,at:"start"}];
    const moveTT=sh.TR||sh.YTx||sh.a1;if(moveTT)cu.push({f:Z=>M2.tTT(p1,Z),col:"--exam",lab:"TT₁",at:"start"});
    const pts=[{x:e0.Z,y:e0.TCR,lab:"0 (TCRE₀)",col:"--muted"}];if(Math.abs(o.Z-e0.Z)>1e-6||Math.abs(o.TCR-e0.TCR)>1e-6)pts.push({x:o.Z,y:o.TCR,lab:"A (situación tras el choque)",col:"--bad",dy:16});if(moveTT)pts.push({x:e1.Z,y:e1.TCR,lab:"1 (TCRE₁)",col:"--good"});
    const g=gplot({xr:[50,160],yr:[0.6,1.4],curves:cu,points:pts,xl:"Z (gasto interno)",yl:"TCR = PT/PN",label:"Modelo de transables y no transables"});
    const txt={remUp:"Las remesas son transferencias corrientes: entran divisas y sube el ingreso disponible y el gasto (∆+Z). Con más divisas, el equilibrio externo admite más gasto a cada TCR: la TT se desplaza a la derecha. El mayor gasto también recae en no transables (∆+DN → ∆+PN), lo que baja PT/PN. El TCR de equilibrio cae: <b>revaluación real</b> (enfermedad holandesa).",
      remDn:"Una caída de las remesas reduce las divisas y el ingreso disponible: cae el gasto interno (∆-Z) y la TT se desplaza a la izquierda, porque ahora hace falta menos gasto en transables para no tener déficit. La menor demanda por no transables baja PN y sube PT/PN: el TCR de equilibrio sube (<b>devaluación real</b>). Mientras PN no se ajuste, la economía tiene desempleo en el sector no transable.",
      boom:"El boom petrolero aumenta la oferta de divisas y el ingreso: la TT se desplaza a la derecha y el gasto sube. El TCR de equilibrio cae: revaluación real que desestimula los demás transables (enfermedad holandesa).",
      gasto:"Más gasto interno (∆+Z) con el TCR dado lleva la economía a la derecha de las dos curvas: exceso de demanda de transables (déficit comercial, EDT) y de no transables (sobreempleo, EDN). El TCR de equilibrio no cambia; la economía está desalineada.",
      prod:"Más productividad en transables aumenta YT a cada precio relativo: la TT se aplana y se desplaza hacia abajo. El TCR de equilibrio cae (efecto Balassa-Samuelson): el país puede sostener un peso más apreciado.",
      tiUp:"Mejores términos de intercambio elevan el valor de las exportaciones: más divisas y más ingreso. La TT se desplaza a la derecha y el TCR de equilibrio cae.",
      deval:"Una devaluación nominal sube el TCR observado por encima del de equilibrio (punto A): superávit comercial y sobreempleo, que presionan los precios internos. Sin control del gasto, la inflación (∆+PN) devuelve el TCR a su nivel de equilibrio: la devaluación sola no tiene efecto real de largo plazo.",
      ajuste:"Reducir el gasto interno con el TCR dado mueve la economía a la izquierda: superávit comercial pero desempleo (EON). Para llegar al TCRE sin desempleo, la reducción del gasto debe combinarse con una devaluación."}[shock];
    $("tn-out").innerHTML=`${legend2([["--exam","TT: equilibrio externo (YT = DT)"],["--branch","NN: equilibrio interno (YN = DN)"]])}${g}<div class="stepc"><p>${txt}</p>
      <div class="res">${tiles([["TCRE inicial",fmt(e0.TCR,3)],["TCRE final",fmt(e1.TCR,3)],["Externo en A",r.zona.ext],["Interno en A",r.zona.int]])}</div>
      <p class="hint">Por encima de la TT hay superávit comercial (exceso de oferta de transables, EOT); por debajo, déficit (EDT). Por encima de la NN hay sobreempleo (EDN); por debajo, desempleo (EON). El TCRE es el que logra al tiempo el equilibrio interno y el externo.</p></div>`};
  $("tn-sh").onchange=e=>{shock=e.target.value;run()};run()};

// ====================================================================
// 10. Financiamiento del déficit fiscal
SIMS.def=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("df-d","Déficit fiscal real (miles de millones de $)",1,60,1,20)}${ctl("df-m","Saldos reales M/P (miles de millones de $)",50,500,5,200)}${ctl("df-e","Tipo de cambio (E)",1000,6000,50,4000)}</div><div class="res" id="df-res"></div><div id="df-txt"></div>`;
  const run=()=>{const d=V("df-d"),mp=V("df-m"),E=V("df-e");if(!(d>0&&mp>d)){$("df-res").innerHTML=err("el déficit debe ser positivo y menor que los saldos reales.");$("df-txt").innerHTML="";return}
    const r=M2.impInfl(d,mp);
    $("df-res").innerHTML=tiles([["Inflación necesaria ρ",fmt(r.rho*100,2)+" %"],["Tasa del impuesto ρ/(1+ρ)",fmt(r.tasa*100,2)+" %"],["Con tipo de cambio fijo: pérdida de reservas",fmt(-M2.defFijo(d,E)*1000,2)+" millones de US$"]]);
    $("df-txt").innerHTML=`<p><b>Tipo de cambio flexible:</b> sin reservas ni crédito, el déficit se financia con emisión, y la inflación actúa como un impuesto sobre los saldos reales:</p><div class="mj">\\[DEF=\\frac{\\rho}{1+\\rho}\\,\\frac{M}{P}\\;\\Rightarrow\\;\\rho=\\frac{DEF}{M/P-DEF}=\\frac{${fm(d)}}{${fm(mp)}-${fm(d)}}=${fmt(r.rho*100,2)}\\%\\]</div>
      <p><b>Tipo de cambio fijo:</b> la emisión baja la tasa de interés y presiona la devaluación; el BC vende divisas y la oferta monetaria vuelve a su nivel. Al final \\(PDEF=-E\\,\\Delta RI\\): el déficit se paga con reservas internacionales.</p>`;typeset($("df-txt"))};
  bindCtl(["df-d","df-m","df-e"],run);run()};

// presets para las estaciones
SIMS.mfm=()=>SIMS.mf({shock:"M"});SIMS.mfz=()=>SIMS.mf({zonas:true,mob:"none",shock:"G"});SIMS.mff=()=>SIMS.mf({shock:"G",reg:"flexible"});SIMS.mftaller=()=>SIMS.mf({mob:"perfect",shock:"is"});
SIMS.sadanmk=()=>SIMS.sada({mod:"nmk",shock:"Cdn"});SIMS.sadaoil=()=>SIMS.sada({mod:"clasico",shock:"oil"});

// Visuales de cambios de Macroeconomía 2 (usa el motor comun/visual.js)
// =====================================================================
// 1. Mercado de divisas (enfoque real): oferta X y demanda Q de dólares
VIS.add("divisas",{t:"Mercado de divisas: oferta (X) y demanda (Q) de dólares",
  hint:"Arrastra la oferta de dólares (X) o la demanda (Q). Con tipo de cambio fijo, el banco central cubre el exceso al tipo de cambio Ē.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"flex"}],p0:{X:0,Q:0},lim:{X:[-30,30],Q:[-30,30]},probe0:{k:0,x:22,y:4600},
  presets:[["Cae el petróleo",{X:-16}],["Suben las remesas",{X:14}],["Suben los aranceles",{Q:-14}],["La FED sube i*",{Q:14}],["Sube Y (más importaciones)",{Q:10}],["Sube la inflación de Colombia",{X:-8,Q:8}]],
  fit:{X:(q,E)=>q-(E-3000)/20,Q:(q,E)=>q-(5000-E)/20},
  compute(st){const{X,Q}=st.p,fijo=st.o.reg==="fijo",fX=o=>q=>3000+20*(q-o),fQ=o=>q=>5000-20*(q-o),mX=!VIS.near(X),mQ=!VIS.near(Q);
    const q1=50+(X+Q)/2,E1=4000+10*(Q-X),gap=X-Q;
    const curves=[{sh:VIS.fx(fX(0)),col:"--line",dash:1,op:.55,lab:mX?"X":""},{sh:VIS.fx(fQ(0)),col:"--branch",dash:1,op:.55,lab:mQ?"Q":""},
      {sh:VIS.fx(fX(X)),col:"--line",lab:mX?"X’":"X (oferta)"},{sh:VIS.fx(fQ(Q)),col:"--branch",lab:mQ?"Q’":"Q (demanda)"}];
    const segs=[],pts=[{x:50,y:4000,lab:"0"}];
    if(fijo){curves.push({sh:VIS.hy(4000),col:"--muted",dash:2,lab:"Ē",lo:-2});
      if(Math.abs(gap)>0.3){segs.push({x1:50+Q,y1:4000,x2:50+X,y2:4000,col:"--bad",w:4,lab:gap>0?"EOD":"EDD"});
        curves.push(gap>0?{sh:VIS.fx(fQ(Q+gap)),col:"--good",dash:1,lab:"Q + compras del BC"}:{sh:VIS.fx(fX(X-gap)),col:"--good",dash:1,lab:"X + ventas del BC"});
        pts.push({x:50+Math.max(X,Q),y:4000,lab:"1",col:"--good"})}}
    else if(mX||mQ)pts.push({x:q1,y:E1,lab:"1",col:"--good"});
    const hX=VIS.clamp(X+75,5,95),hQ=VIS.clamp(Q+25,5,95);
    let probeTxt="";const pr=st.probe;if(pr){const qx=50+X+(pr.y-4000)/20,qq=50+Q-(pr.y-4000)/20,ex=qx-qq;segs.push({x1:qq,y1:pr.y,x2:qx,y2:pr.y,col:"--exam",dash:1,w:1.5});
      probeTxt=`<p><b>Punto de prueba</b> (E = ${VIS.n(pr.y,0)}): ${Math.abs(ex)<0.5?"oferta = demanda de dólares, no hay presión.":ex>0?`se ofrecen ${VIS.n(ex,1)} millones de US$ más de los que se piden: <b>EOD</b>, presión a que E baje.`:`se piden ${VIS.n(-ex,1)} millones de US$ más de los que se ofrecen: <b>EDD</b>, presión a que E suba.`}</p>`}
    const P={cap:"Mercado de divisas",xr:[0,100],yr:[3000,5000],xl:"Cantidad de dólares (millones de US$)",yl:"E ($/US$)",fy:v=>VIS.n(v,0),curves,segs,pts,probe:pr,
      handles:[{c:"X",x:hX,y:fX(X)(hX),col:"--line",name:"la oferta X"},{c:"Q",x:hQ,y:fQ(Q)(hQ),col:"--branch",name:"la demanda Q"}]};
    let h="";const mv=[];if(mX)mv.push(`La oferta de dólares (X) se desplazó <b>${X>0?"a la derecha":"a la izquierda"}</b>: a cada tipo de cambio se ofrecen ${VIS.n(Math.abs(X),1)} millones de US$ ${X>0?"más":"menos"}.`);
    if(mQ)mv.push(`La demanda de dólares (Q) se desplazó <b>${Q>0?"a la derecha":"a la izquierda"}</b>: a cada tipo de cambio se piden ${VIS.n(Math.abs(Q),1)} millones de US$ ${Q>0?"más":"menos"}.`);
    if(!mv.length)h=`<p>Todavía no hay cambios: arrastra una curva o prueba un choque. El equilibrio inicial es E₀ = 4.000 con 50 millones de US$ transados.</p>`;
    else{h+=VIS.sec("Qué cambió",VIS.list(mv));const cs=[];
      if(mX)cs.push(X>0?"<b>Más oferta de dólares:</b> ∆+Y* (más exportaciones), ∆+precio del petróleo o mejores términos de intercambio, más remesas o turismo receptivo, más IED o IEC, entrada de capitales por ∆+i o ∆-i*, ∆+π* (Colombia gana competitividad).":"<b>Menos oferta de dólares:</b> ∆-precio del petróleo, ∆-Y*, caen las remesas o el turismo, menos IED, entra menos capital (∆-i o ∆+i*), ∆+π de Colombia (se exporta menos).");
      if(mQ)cs.push(Q>0?"<b>Más demanda de dólares:</b> ∆+Y (más importaciones), ∆+π de Colombia (lo importado se abarata), ∆+ICE (colombianos invierten afuera), salida de capitales por ∆+i* o ∆-i, ∆+Eᵉ (conviene comprar hoy), aranceles más bajos.":"<b>Menos demanda de dólares:</b> ∆+aranceles, ∆-Y, ∆+π* (lo importado se encarece), ∆-ICE, ∆-i* o ∆+i, ∆-Eᵉ.");
      h+=VIS.sec("Qué pudo haberlo causado",VIS.list(cs));
      if(!fijo){const ex=gap;h+=VIS.sec("Mecanismo",`<p>${Math.abs(ex)<0.3?"Al tipo de cambio inicial no queda exceso: los dos desplazamientos se compensan en precio y solo cambia la cantidad transada.":`A E₀ = 4.000 ahora hay <b>${ex>0?"EOD":"EDD"}</b> de ${VIS.n(Math.abs(ex),1)} millones de US$ → ${ex>0?"∆-E: el dólar se abarata (el peso se aprecia)":"∆+E: el dólar se encarece (el peso se deprecia)"}. Al ${ex>0?"bajar":"subir"} E ${ex>0?"cae":"sube"} el TCR: se exporta ${ex>0?"menos":"más"} y se importa ${ex>0?"más":"menos"} (movimiento a lo largo de las curvas) hasta cerrar el exceso en el punto 1.`}</p>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tipo de cambio E",4000,E1,0),VIS.tile("Dólares transados",50,q1,1)])}</div><p>${VIS.near(E1-4000)?"E no cambia.":E1>4000?`Depreciación del peso de ${VIS.n((E1/4000-1)*100,1)} %.`:`Apreciación del peso de ${VIS.n((1-E1/4000)*100,1)} %.`}</p>`)}
      else{const c=gap>0;h+=VIS.sec("Mecanismo (tipo de cambio fijo)",Math.abs(gap)<0.3?"<p>Al tipo de cambio fijo no hay exceso: el banco central no tiene que intervenir.</p>":`<p>El banco central no deja mover E. A Ē = 4.000 hay <b>${c?"EOD":"EDD"}</b> de ${VIS.n(Math.abs(gap),1)} millones de US$, así que ${c?"compra":"vende"} esos dólares (la curva verde):</p><div class="eq al chain">${c?"EOD → el BC compra → ∆+RI ⟺ ∆+M (expansión, con costo cuasifiscal) → ∆-i → ∆+I → ∆+A → ∆+DA → ∆+Y → ∆+P":"EDD → el BC vende → ∆-RI ⟺ ∆-M → ∆+i → ∆-I → ∆-A → ∆-DA → ∆-Y → ∆-P"}</div>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([["Tipo de cambio","4.000 (fijo)"],["Reservas",(gap>0?"+":"−")+VIS.n(Math.abs(gap),1)+" millones de US$",gap>0?"okt":"badt"],["Oferta monetaria",Math.abs(gap)<0.3?"igual":gap>0?"sube":"baja"]])}</div><p>Con tipo fijo, las reservas y la oferta monetaria se vuelven endógenas: el banco renuncia a controlar M para controlar E.</p>`)}}
    return{panels:[P],text:h+probeTxt}}});

// =====================================================================
// 2. Enfoque de activos: mercado monetario + paridad de intereses en (i, E)
VIS.EE0=4000*1.06/1.04;
VIS.add("activos",{t:"Enfoque de activos: dinero y paridad de intereses",panels:2,
  hint:"Arrastra la oferta monetaria (M/P) o la demanda de dinero (L) en el panel izquierdo, o la rentabilidad externa (RE) en el derecho. La RI es la tasa que sale del mercado monetario.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"flex"}],p0:{MS:5,L:0,Ee:VIS.EE0},lim:{MS:[3,7],L:[-2,2],Ee:[3900,4250]},
  presets:[["El BR expande M",{MS:6.5}],["El BR sube su tasa (∆-M)",{MS:3.8}],["La FED sube i*",{Ee:VIS.EE0*1.035}],["Sube Eᵉ (más riesgo país)",{Ee:VIS.EE0*1.05}],["Sube y (más demanda de dinero)",{L:1.2}]],
  fit:{MS:x=>x,L:(m,i)=>m-5-(6-i)/1.2,Ee:(r,E)=>E*(1+r/100)/1.04},
  compute(st){const{MS,L,Ee}=st.p,fijo=st.o.reg==="fijo",Lf=l=>m=>6-1.2*(m-5-l),REf=ee=>r=>1.04*ee/(1+r/100);
    let i1,E1,MSf=MS;if(!fijo){i1=Lf(L)(MS);E1=REf(Ee)(i1)}else{E1=4000;i1=(1.04*Ee/4000-1)*100;MSf=5+L+(6-i1)/1.2}
    const mM=!VIS.near(MS-5),mL=!VIS.near(L),mE=Math.abs(Ee-VIS.EE0)>2,auto=fijo&&!VIS.near(MSf-MS);
    const c1=[{sh:VIS.vx(5),col:"--line",dash:1,op:.55,lab:mM?"M/P":""},{sh:VIS.fx(Lf(0)),col:"--branch",dash:1,op:.55,lab:mL?"L":""},
      {sh:VIS.vx(MS),col:"--line",lab:mM?"M/P’":"M/P (oferta)",op:auto?.5:1},{sh:VIS.fx(Lf(L)),col:"--branch",lab:mL?"L’":"L(y, i)"}];
    const s1=[];if(auto){c1.push({sh:VIS.vx(MSf),col:"--good",lab:"M/P final",lo:16});s1.push({x1:MS,y1:11,x2:MSf,y2:11,col:"--good",arrow:1,lab:MSf>MS?"el BC compra US$":"el BC vende US$"})}
    const mL0=VIS.clamp(5+L+(6-2.4)/1.2,0.3,9.7);
    const P1={cap:"Mercado monetario",xr:[0,10],yr:[0,12],xl:"Saldos reales M/P",yl:"i (%)",curves:c1,segs:s1,pts:[{x:5,y:6,lab:"0"},...((mM||mL||auto)?[{x:MSf,y:i1,lab:"1",col:"--good"}]:[])],
      handles:[{c:"MS",x:MS,y:10.3,col:"--line",name:"la oferta monetaria"},{c:"L",x:mL0,y:Lf(L)(mL0),col:"--branch",name:"la demanda de dinero"}]};
    const c2=[{sh:VIS.vx(6),col:"--line",dash:1,op:.55,lab:VIS.near(i1-6)?"":"RI"},{sh:VIS.fx(REf(VIS.EE0)),col:"--branch",dash:1,op:.55,lab:mE?"RE":""},
      {sh:VIS.vx(i1),col:"--line",lab:VIS.near(i1-6)?"RI = 1 + i":"RI’"},{sh:VIS.fx(REf(Ee)),col:"--branch",lab:mE?"RE’":"RE = (1+i*)Eᵉ/E"}];
    const P2={cap:"Mercado de divisas en (i, E)",xr:[0,12],yr:[3500,4500],xl:"Rentabilidad (%)",yl:"E ($/US$)",fy:v=>VIS.n(v,0),curves:c2,pts:[{x:6,y:4000,lab:"0"},...((!VIS.near(i1-6)||!VIS.near(E1-4000))?[{x:i1,y:E1,lab:"1",col:"--good"}]:[])],
      handles:[{c:"Ee",x:8.5,y:REf(Ee)(8.5),col:"--branch",name:"la rentabilidad externa"}]};
    let h="";const mv=[],cs=[];
    if(mM){mv.push(`La oferta de saldos reales se desplazó <b>${MS>5?"a la derecha":"a la izquierda"}</b>.`);cs.push(MS>5?"<b>Más M/P:</b> el BR expande la oferta monetaria (compra bonos, baja su tasa) o bajan los precios (∆-P).":"<b>Menos M/P:</b> el BR contrae la oferta monetaria (sube su tasa) o suben los precios (∆+P).")}
    if(mL){mv.push(`La demanda de dinero se desplazó <b>${L>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(L>0?"<b>Más demanda de dinero:</b> ∆+y (más producción exige más dinero para transacciones) o un cambio de preferencias hacia la liquidez.":"<b>Menos demanda de dinero:</b> ∆-y o menor preferencia por la liquidez.")}
    if(mE){mv.push(`La rentabilidad externa (RE) se desplazó <b>${Ee>VIS.EE0?"a la derecha":"a la izquierda"}</b>.`);cs.push(Ee>VIS.EE0?"<b>Más RE:</b> ∆+Eᵉ (se espera un dólar más caro: más riesgo país, más inflación esperada), ∆+i* (la FED sube su tasa) o ∆+EMBI.":"<b>Menos RE:</b> ∆-Eᵉ, ∆-i* o menos riesgo país.")}
    if(!mv.length)h="<p>Todavía no hay cambios. En el punto 0 la tasa es 6 %,  RI = RE y E₀ = 4.000. Arrastra una curva o prueba un choque.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));const ch=[];
      if(!fijo){const di=i1-6;if(mM)ch.push(MS>5?"∆+M/P frente a L̄ → EOM → ∆-i":"∆-M/P frente a L̄ → EDM → ∆+i");if(mL)ch.push(L>0?"∆+L frente a M̄/P̄ → EDM → ∆+i":"∆-L frente a M̄/P̄ → EOM → ∆-i");
        if(!VIS.near(di))ch.push(di>0?"∆+i → ∆+RI / R̄E → DR > 0 → ∆+F (entra capital) → EOD → ∆-E":"∆-i → ∆-RI / R̄E → DR < 0 → ∆-F (sale capital) → EDD → ∆+E");
        if(mE)ch.push(Ee>VIS.EE0?"∆+RE / R̄I → DR < 0 → ∆-F → EDD → ∆+E":"∆-RE / R̄I → DR > 0 → ∆+F → EOD → ∆-E");
        h+=VIS.sec("Mecanismo",`<div class="eq al chain">${ch.join("<br>")}</div><p>Al moverse E con Eᵉ dado cambia la ganancia cambiaria esperada (Eᵉ/E) y con ella la RE, hasta que DR = 0 en el punto 1.${mM?" Esto es el corto plazo con P fijo: a mediano plazo suben (bajan) los precios, se corrige M/P, la tasa vuelve y E se devuelve en parte (overshooting).":""}</p>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tasa i (%)",6,i1,2),VIS.tile("Tipo de cambio E",4000,E1,0)])}</div>`)}
      else{const sube=MSf>MS;h+=VIS.sec("Mecanismo (tipo de cambio fijo)",`<p>Con Ē = 4.000 la tasa tiene que ser la que exige la paridad: i = ${VIS.n(i1,2)} %. ${auto?`Para lograrlo el banco central ${sube?"compra":"vende"} dólares: ${sube?"∆+RI ⟺ ∆+M":"∆-RI ⟺ ∆-M"} y la oferta monetaria termina en M/P = ${VIS.n(MSf,2)} (verde).`:"No hace falta intervenir."}${mM&&!mL&&!mE?" La política monetaria es <b>inefectiva</b>: la tasa vuelve a 6 % y solo cambian las reservas.":""} «Entre i y E no hay relación» porque E no se mueve.</p>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tasa i (%)",6,i1,2),["Tipo de cambio","4.000 (fijo)"],VIS.tile("M/P final",5,MSf,2)])}</div>`)}}
    return{panels:[P1,P2],text:h}}});

// =====================================================================
// 3. Krugman: EMB (DD) y EMA (AA) en (y, E)
VIS.add("krugman",{t:"Modelo Krugman: EMB y EMA en (y, E)",
  hint:"Arrastra la EMB (mercado de bienes) o la EMA (mercado de activos). Con tipo de cambio fijo la EMA es vertical y la mueven las reservas. El punto 0’ es el efecto impacto.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"flex"}],p0:{B:0,A:0},lim:{B:[-3,3],A:[-3,3]},probe0:{k:0,x:2.2,y:7.6},
  presets:[["Política monetaria expansiva (∆+M)",{A:1.6}],["Política fiscal expansiva (∆+G)",{B:1.6}],["Sube i* (FED)",{A:1.3}],["Cae Y* (recesión mundial)",{B:-1.4}],["Cae P (mueve las dos)",{B:1.1,A:1.1}],["El BR sube su tasa",{A:-1.4}]],
  fit:{B:(y,E)=>y-5-(E-5),A:(y,E,st)=>st.o.reg==="fijo"?y-5:y-5+(E-5)/0.8},
  compute(st){const{B,A}=st.p,fijo=st.o.reg==="fijo",mB=!VIS.near(B),mA=!VIS.near(A),EMB=b=>y=>5+(y-5-b),EMA=a=>y=>5-0.8*(y-5-a);
    let y1,E1,yf;const curves=[{sh:VIS.fx(EMB(0)),col:"--branch",dash:1,op:.55,lab:mB?"EMB":""}],pts=[{x:5,y:5,lab:"0"}],segs=[];
    if(!fijo){y1=5+(B+0.8*A)/1.8;E1=EMB(B)(y1);curves.push({sh:VIS.fx(EMA(0)),col:"--line",dash:1,op:.55,lab:mA?"EMA":""},{sh:VIS.fx(EMB(B)),col:"--branch",lab:mB?"EMB’":"EMB (bienes)"},{sh:VIS.fx(EMA(A)),col:"--line",lab:mA?"EMA’":"EMA (activos)"});
      if(mA&&!mB)pts.push({x:5,y:EMA(A)(5),lab:"0’",col:"--muted"});if(mB&&!mA)pts.push({x:5+B,y:5,lab:"0’",col:"--muted"});
      if(mA!==mB){const p=pts[pts.length-1];segs.push({x1:p.x,y1:p.y,x2:y1,y2:E1,col:"--muted",dash:1,w:1.5,arrow:1})}
      if(mA||mB)pts.push({x:y1,y:E1,lab:"1",col:"--good"})}
    else{yf=5+B;y1=yf;E1=5;curves.push({sh:VIS.vx(5),col:"--line",dash:1,op:.55,lab:(mA||!VIS.near(yf-5))?"EMA":""},{sh:VIS.hy(5),col:"--muted",dash:2,lab:"Ē"},{sh:VIS.fx(EMB(B)),col:"--branch",lab:mB?"EMB’":"EMB (bienes)"});
      const yu=5+A;curves.push({sh:VIS.vx(yu),col:"--line",lab:mA?"EMA’ (tu cambio)":"EMA (vertical)",op:VIS.near(yu-yf)?1:.5,lo:mA?18:0});
      if(!VIS.near(yu-yf)){curves.push({sh:VIS.vx(yf),col:"--good",lab:"EMA final",lo:36});segs.push({x1:yu,y1:8.6,x2:yf,y2:8.6,col:"--good",arrow:1,lab:yf>yu?"el BC compra US$":"el BC vende US$"})}
      if(mA||mB)pts.push({x:yf,y:5,lab:"1",col:"--good"})}
    const hb=VIS.clamp(7.6+B,1,9.2),ha=VIS.clamp(2.6+A,0.5,9);
    const handles=[{c:"B",x:hb,y:EMB(B)(hb),col:"--branch",name:"la EMB"},fijo?{c:"A",x:5+A,y:2,col:"--line",name:"la EMA"}:{c:"A",x:ha,y:EMA(A)(ha),col:"--line",name:"la EMA"}];
    let probeTxt="";const pr=st.probe;if(pr){const ab=pr.y>EMB(B)(pr.x),aa=fijo?pr.x<5+A:pr.y>EMA(A)(pr.x);
      probeTxt=`<p><b>Punto de prueba:</b> ${ab?"por encima o a la izquierda de la EMB hay <b>EDB</b> (la producción tiende a subir)":"por debajo o a la derecha de la EMB hay <b>EOB</b> (la producción tiende a bajar)"}; ${fijo?(aa?"a la izquierda de la EMA vertical sobra dinero: <b>EOM</b>, presión a que salga capital (EDD) y el BC venda dólares":"a la derecha de la EMA vertical falta dinero: <b>EDM</b>, entra capital (EOD) y el BC compra dólares"):(aa?"por encima de la EMA hay <b>EOD / EDM</b> (E tiende a bajar)":"por debajo de la EMA hay <b>EDD / EOM</b> (E tiende a subir)")}.</p>`}
    const P={cap:"Equilibrio macroeconómico en (y, E)",xr:[0,10],yr:[0,10],xl:"Producción y",yl:"Tipo de cambio E",curves,segs,pts,probe:pr,handles};
    let h="";const mv=[],cs=[];
    if(mB){mv.push(`La EMB se desplazó <b>${B>0?"a la derecha (abajo)":"a la izquierda (arriba)"}</b>.`);cs.push(B>0?"<b>EMB a la derecha:</b> ∆+G, ∆-T, ∆+Y*, ∆+TCR por ∆+P* o ∆-P, aranceles, ∆+consumo o inversión autónomos.":"<b>EMB a la izquierda:</b> ∆-G, ∆+T, ∆-Y* (recesión mundial), ∆-precio del petróleo, ∆-TCR por ∆+P, ∆-consumo o inversión autónomos.")}
    if(mA){mv.push(`La EMA se desplazó <b>${A>0?"a la derecha (arriba)":"a la izquierda (abajo)"}</b>.`);cs.push(A>0?"<b>EMA a la derecha:</b> ∆+M, ∆-P (más saldos reales), ∆+i*, ∆+Eᵉ, ∆+riesgo país, menor demanda de dinero.":"<b>EMA a la izquierda:</b> ∆-M (el BR sube su tasa), ∆+P, ∆-i*, ∆-Eᵉ, mayor demanda de dinero.")}
    if(!mv.length)h="<p>Todavía no hay cambios: el equilibrio 0 es el cruce de la EMB (pendiente positiva) y la EMA (pendiente negativa; vertical con tipo fijo). Arrastra una curva o prueba un choque.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));let m="";
      if(!fijo){if(mA&&!mB){const s=A>0;m=`<p><b>(1) Impacto en activos</b> (punto 0’, y₀ fijo): ${s?"∆+M/P → EOM → ∆-i → DR < 0 → ∆-F → EDD → E salta hacia arriba":"∆-M/P → EDM → ∆+i → DR > 0 → ∆+F → EOD → E salta hacia abajo"}.</p><p><b>(2) Ajuste en bienes:</b> ${s?"∆+TCR → ∆+XN → EDB → ∆+y → ∆+L → EDM → ∆+i → EOD → E baja en parte":"∆-TCR → ∆-XN → EOB → ∆-y → ∆-L → EOM → ∆-i → EDD → E sube en parte"}, a lo largo de la EMA’.</p><p><b>(3) Final</b> (punto 1): ${s?"suben E y y: la política monetaria es efectiva con flexible":"bajan E y y"}.</p>`}
        else if(mB&&!mA){const s=B>0;m=`<p><b>(1) Impacto en bienes</b> (punto 0’, E₀ fijo): ${s?"∆+DA → EDB → ∆+y":"∆-DA → EOB → ∆-y"}.</p><p><b>(2) Ajuste en activos:</b> ${s?"∆+y → ∆+L frente a M̄/P̄ → EDM → ∆+i → DR > 0 → ∆+F → EOD → ∆-E → ∆-TCR → ∆-XN":"∆-y → ∆-L → EOM → ∆-i → DR < 0 → ∆-F → EDD → ∆+E → ∆+TCR → ∆+XN"}, a lo largo de la EMA.</p><p><b>(3) Final</b> (punto 1): ${s?"la producción sube menos que en 0’ porque la apreciación quita exportaciones netas (desplazamiento parcial)":"la producción cae menos que en 0’ porque la depreciación amortigua"}.</p>`}
        else{const dEb=-(B)*0.8/1.8,dEa=0.8*A/1.8;m=`<p>Se movieron las dos curvas. Sobre la producción ${Math.sign(B)===Math.sign(A)?"los dos efectos van en la misma dirección":"los efectos se oponen"}; sobre E, la EMB aporta ${VIS.n(dEb,2)} y la EMA ${VIS.n(dEa,2)}: ${Math.sign(dEb)!==Math.sign(dEa)?"el efecto sobre E es <b>ambiguo en teoría</b> y aquí domina "+(Math.abs(dEa)>Math.abs(dEb)?"la EMA":"la EMB")+".":"van en la misma dirección."}${B>0&&A>0?" Es el caso de una caída de precios (Parcial 1, pregunta 15): sube y y E depende de qué desplazamiento es mayor.":""}</p>`}}
      else{const dB=B,dA=A;m=mB?`<p>${dB>0?"∆+DA → ∆+y → ∆+L → EDM → ∆+i → DR > 0 → EOD → presión a la baja de E":"∆-DA → ∆-y → ∆-L → EOM → ∆-i → DR < 0 → EDD → presión al alza de E"}. El BC ${dB>0?"compra dólares → ∆+RI ⟺ ∆+M":"vende dólares → ∆-RI ⟺ ∆-M"}: la EMA vertical acompaña hasta y₁ = ${VIS.n(yf,2)}. ${dB>0?"La política fiscal es <b>efectiva</b> con tipo fijo: la producción sube por completo.":"La caída de la producción se amplifica (M15 del Parcial 1)."}</p>`:"";
        if(mA)m+=`<p>${dA>0?"∆+M → EOM → ∆-i → DR < 0 → EDD → presión al alza de E → el BC vende dólares → ∆-RI ⟺ ∆-M":"∆-M → EDM → ∆+i → DR > 0 → EOD → presión a la baja → el BC compra dólares → ∆+RI ⟺ ∆+M"}: la EMA vuelve a su sitio. La política monetaria es <b>inefectiva</b> con tipo fijo; solo cambian las reservas.</p>`}
      h+=VIS.sec("Mecanismo",m);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producción y",5,y1,2),fijo?["Tipo de cambio","5 (fijo)"]:VIS.tile("Tipo de cambio E",5,E1,2),...(fijo?[["Reservas",VIS.near(yf-5-A)?"igual":yf>5+A?"suben":"bajan"]]:[])])}</div>`)}
    return{panels:[P],text:h+probeTxt}}});

// =====================================================================
// 4. Mundell-Fleming: EMB (IS), EMM (LM) y EMD (BP = 0) en (y, i)
VIS.MOB={none:{t:"Sin movilidad"},low:{t:"Imperfecta (EMD más inclinada que la EMM)",s:2},high:{t:"Imperfecta (EMD menos inclinada)",s:0.3},perf:{t:"Perfecta"}};
VIS.add("mf",{t:"Modelo Mundell-Fleming: EMB, EMM y EMD en (y, i)",
  hint:"Arrastra la EMB, la EMM o la EMD. El punto 1 es el equilibrio interno tras tu cambio; el punto 2, el final después del ajuste del régimen cambiario.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"fijo"},{id:"mob",lab:"Movilidad",ch:[["none","Sin"],["low","Baja"],["high","Alta"],["perf","Perfecta"]],v:"high"}],
  p0:{B:0,M:0,D:0,I:0},lim:{B:[-3,3],M:[-3,3],D:[-3,3],I:[-2.5,2.5]},probe0:{k:0,x:2,y:8},
  presets:[["Política fiscal expansiva",{B:1.5}],["Política monetaria expansiva",{M:1.5}],["Caen las exportaciones",{B:-1.2,D:-1.2}],["Sube i* (movilidad perfecta)",{I:1.2},{mob:"perf"}],["Suben los impuestos",{B:-1.4}]],
  fit:{B:(y,i)=>y-5+(i-5),M:(y,i)=>y-5-(i-5),D:(y,i,st)=>{const m=st.o.mob;return m==="none"?y-5:y-5-(i-5)/VIS.MOB[m].s},I:(y,i)=>i-5},
  compute(st){const{B,M,D,I}=st.p,fijo=st.o.reg==="fijo",mob=st.o.mob,s=VIS.MOB[mob].s;
    const fB=(b,e)=>y=>5-(y-5-b-0.8*e),fM=m=>y=>5+(y-5-m),dD=(d,e)=>mob==="perf"?VIS.hy(5+I):mob==="none"?VIS.vx(5+d+2*e):VIS.fx(y=>5+s*(y-5-d-2*e));
    const Y1=(B+M)/2,I1=(B-M)/2;let sup;if(mob==="perf")sup=I1-I;else if(mob==="none")sup=D-Y1;else sup=I1-s*(Y1-D);
    let Y2,I2,e=0,Mf=M;
    if(fijo){if(mob==="perf"){I2=I;Y2=B-I}else if(mob==="none"){Y2=D;I2=-D+B}else{Y2=(B+s*D)/(1+s);I2=-Y2+B}Mf=Y2-I2}
    else{if(mob==="perf"){I2=I;Y2=I+M;e=(I2+Y2-B)/0.8}else if(mob==="none"){Y2=(5*M+5*B-D)/9;e=(2*Y2-M-B)/0.8}else{Y2=(M+s*(5*M+5*B-D))/(1+9*s);e=(2*Y2-M-B)/0.8}I2=Y2-M}
    const mB=!VIS.near(B),mM=!VIS.near(M),mD=mob==="perf"?!VIS.near(I):!VIS.near(D),moved=mB||mM||mD;
    const curves=[{sh:VIS.fx(fB(0,0)),col:"--branch",dash:1,op:.5},{sh:VIS.fx(fM(0)),col:"--line",dash:1,op:.5},{sh:dD(0,0),col:"--good",dash:1,op:.5}];
    const adjB=!fijo&&!VIS.near(e),adjM=fijo&&!VIS.near(Mf-M),adjD=!fijo&&!VIS.near(e)&&mob!=="perf";
    curves.push({sh:VIS.fx(fB(B,0)),col:"--branch",lab:adjB?"EMB₁":mB?"EMB’":"EMB",op:adjB?.45:1,dash:adjB?2:0,w:adjB?2:0});
    curves.push({sh:VIS.fx(fM(M)),col:"--line",lab:adjM?"EMM₁":mM?"EMM’":"EMM",op:adjM?.45:1,dash:adjM?2:0,w:adjM?2:0});
    curves.push({sh:dD(D,0),col:"--good",lab:adjD?"EMD₁":mD?"EMD’":"EMD (BP = 0)",op:adjD?.45:1,dash:adjD?2:0,w:adjD?2:0,lo:mob==="none"?34:0});
    if(adjB)curves.push({sh:VIS.fx(fB(B,e)),col:"--branch",lab:"EMB₂"});if(adjM)curves.push({sh:VIS.fx(fM(Mf)),col:"--line",lab:"EMM₂"});if(adjD)curves.push({sh:dD(D,e),col:"--good",lab:"EMD₂",lo:mob==="none"?50:0});
    const pts=[{x:5,y:5,lab:"0"}];if(moved){pts.push({x:5+Y1,y:5+I1,lab:"1",col:"--muted"});pts.push({x:5+Y2,y:5+I2,lab:"2",col:"--good"})}
    const hb=VIS.clamp(7.4+B,1,9.2),hm=VIS.clamp(7.6+M,1,9.2),handles=[{c:"B",x:hb,y:fB(B,0)(hb),col:"--branch",name:"la EMB"},{c:"M",x:hm,y:fM(M)(hm),col:"--line",name:"la EMM"}];
    if(mob==="perf")handles.push({c:"I",x:1.2,y:5+I,col:"--good",name:"la EMD"});else if(mob==="none")handles.push({c:"D",x:5+D,y:1.3,col:"--good",name:"la EMD"});else{const hd=VIS.clamp(mob==="low"?6.6+D:8+D,0.8,9.2);handles.push({c:"D",x:hd,y:5+s*(hd-5-D),col:"--good",name:"la EMD"})}
    let probeTxt="";const pr=st.probe;if(pr){const Y=pr.x-5,Ii=pr.y-5;const ab=Ii>-(Y-B),am=Ii>Y-M;let bp;if(mob==="perf")bp=Ii-I;else if(mob==="none")bp=D-Y;else bp=Ii-s*(Y-D);
      probeTxt=`<p><b>Punto de prueba:</b> ${ab?"por encima de la EMB hay <b>EOB</b>":"por debajo de la EMB hay <b>EDB</b>"}; ${am?"por encima de la EMM hay <b>EOM</b>":"por debajo de la EMM hay <b>EDM</b>"}; ${Math.abs(bp)<0.02?"sobre la EMD la BP está en equilibrio":bp>0?"por encima (a la izquierda) de la EMD hay <b>superávit en BP (EOD)</b>":"por debajo (a la derecha) de la EMD hay <b>déficit en BP (EDD)</b>"}.</p>`}
    const P={cap:"Equilibrio en (y, i) · "+VIS.MOB[mob].t,xr:[0,10],yr:[0,10],xl:"Producción y",yl:"Tasa de interés i",curves,pts,probe:pr,handles};
    let h="";const mv=[],cs=[];
    if(mB){mv.push(`La EMB se desplazó <b>${B>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(B>0?"<b>EMB a la derecha:</b> ∆+G, ∆-T, ∆+consumo o inversión autónomos, ∆+exportaciones exógenas (∆+Y*).":"<b>EMB a la izquierda:</b> ∆-G, ∆+T, caen el consumo, la inversión o las exportaciones.")}
    if(mM){mv.push(`La EMM se desplazó <b>${M>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(M>0?"<b>EMM a la derecha:</b> ∆+M (política monetaria expansiva), ∆-P o menor demanda de dinero.":"<b>EMM a la izquierda:</b> ∆-M, ∆+P o mayor demanda de dinero.")}
    if(mD){if(mob==="perf"){mv.push(`La EMD (horizontal en i = i*) se desplazó <b>${I>0?"hacia arriba":"hacia abajo"}</b>.`);cs.push(I>0?"<b>EMD arriba:</b> ∆+i* (la FED sube su tasa) o ∆+riesgo país.":"<b>EMD abajo:</b> ∆-i* o menos riesgo país.")}
      else{mv.push(`La EMD se desplazó <b>${D>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(D>0?"<b>EMD a la derecha:</b> mejora exógena de la balanza comercial (∆+Y*, más demanda de exportaciones) o de los flujos de capital (∆-i*, menos riesgo, ∆-Eᵉ).":"<b>EMD a la izquierda:</b> caen las exportaciones exógenas, ∆+i*, ∆+riesgo país o ∆+Eᵉ.")}}
    if(!moved)h="<p>Todavía no hay cambios: en 0 se cruzan la EMB, la EMM y la EMD (equilibrio interno y externo). Arrastra una curva o prueba un choque.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));
      const bal=Math.abs(sup)<0.02?"equilibrio":sup>0?"sup":"def";
      let m=`<p><b>(1) Efecto impacto:</b> el nuevo equilibrio interno (EMB = EMM) es el punto 1. Allí ${bal==="equilibrio"?"la BP queda en equilibrio y no hace falta más ajuste.":bal==="sup"?"hay <b>superávit en BP (EOD)</b>: el punto queda por encima de la EMD.":"hay <b>déficit en BP (EDD)</b>: el punto queda por debajo de la EMD."}${mob!=="perf"&&bal!=="equilibrio"?" (∆y mueve la balanza comercial y ∆i la cuenta financiera.)":""}</p>`;
      if(bal!=="equilibrio")m+=fijo?`<p><b>(2) Tipo de cambio fijo:</b> ${bal==="sup"?"el BC compra divisas → ∆+RI → ∆+M: la EMM se desplaza a la derecha":"el BC vende divisas → ∆-RI → ∆-M: la EMM se desplaza a la izquierda"} hasta el punto 2, donde se cruzan las tres curvas. La EMM se endogeniza.</p>`
        :`<p><b>(2) Tipo de cambio flexible:</b> ${bal==="sup"?"EOD → ∆-E → ∆-TCR → ∆-X / ∆+Q → ∆-XN: la EMB se desplaza a la izquierda"+(mob!=="perf"?" y la EMD también":""):"EDD → ∆+E → ∆+TCR → ∆+X / ∆-Q → ∆+XN: la EMB se desplaza a la derecha"+(mob!=="perf"?" y la EMD también":"")} hasta el punto 2. La oferta monetaria no cambia.</p>`;
      h+=VIS.sec("Mecanismo",m);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producción y",5,5+Y2,2),VIS.tile("Tasa i",5,5+I2,2),fijo?["Reservas y M",VIS.near(Mf-M)?"sin intervención":Mf>M?"suben":"bajan"]:["Tipo de cambio",VIS.near(e)?"igual":e>0?"se deprecia":"se aprecia",VIS.near(e)?"":e>0?"badt":"okt"]])}</div>${mob==="perf"&&mM&&fijo&&!mB?"<p>Con movilidad perfecta y tipo fijo la política monetaria es inefectiva: el punto 2 es el mismo 0.</p>":""}${mob==="perf"&&mB&&!fijo&&!mM?"<p>Con movilidad perfecta y tipo flexible la política fiscal es inefectiva: la apreciación devuelve la EMB a su lugar.</p>":""}`)}
    return{panels:[P],text:h+probeTxt}}});

// =====================================================================
// 5. SA-DA en (Y, P)
VIS.SAM={clasico:"Clásico tradicional",nmc:"Nueva macro clásica",keynes:"Keynesiano tradicional",nmk:"Nueva macro keynesiana"};
VIS.add("sada",{t:"Oferta y demanda agregada en (Y, P)",
  hint:"Arrastra la DA, la SA de corto plazo o la de largo plazo (Ȳ). El punto 1 es el corto plazo; el 2, el largo plazo cuando las expectativas se ajustan.",
  opts:[{id:"mod",lab:"Modelo",ch:[["clasico","Clásico"],["nmc","NMC"],["keynes","Keynesiano"],["nmk","NMK"]],v:"nmc"}],
  p0:{D:0,S:0,Lr:0},lim:{D:[-3,3],S:[-3,3],Lr:[-2.5,2.5]},
  presets:[["Expansión de la DA (∆+M o ∆+G)",{D:1.5}],["Choque petrolero (costos)",{S:-1.4}],["Caída del consumo",{D:-1.3}],["Más productividad (Ȳ)",{Lr:1.2,S:1.2}]],
  fit:{D:(Y,P)=>Y-5+(P-5),S:(Y,P,st)=>st.o.mod==="keynes"?5-P:Y-5-(P-5)/0.8,Lr:Y=>Y-5},
  compute(st){const{D,S,Lr}=st.p,mod=st.o.mod,fD=d=>Y=>5-(Y-5-d),fS=s=>mod==="keynes"?VIS.hy(5-s):VIS.fx(Y=>5+0.8*(Y-5-s));
    let Y1,P1,Y2=null,P2=null,Sf=null;
    if(mod==="clasico"){Y1=5+Lr;P1=fD(D)(Y1)}else if(mod==="keynes"){P1=5-S;Y1=5+D+S}else{Y1=5+(D+0.8*S)/1.8;P1=fD(D)(Y1)}
    if(mod==="nmc"&&!VIS.near(Y1-5-Lr)){Y2=5+Lr;P2=fD(D)(Y2);Sf=Lr-(P2-5)/0.8}
    const mD=!VIS.near(D),mS=mod!=="clasico"&&!VIS.near(S),mL=!VIS.near(Lr),moved=mD||mS||mL;
    const curves=[{sh:VIS.fx(fD(0)),col:"--branch",dash:1,op:.5},{sh:VIS.vx(5),col:"--muted",dash:1,op:.5}];
    if(mod!=="clasico")curves.push({sh:fS(0),col:"--line",dash:1,op:.5});
    curves.push({sh:VIS.fx(fD(D)),col:"--branch",lab:mD?"DA’":"DA"},{sh:VIS.vx(5+Lr),col:mod==="clasico"?"--line":"--muted",lab:mod==="clasico"?(mL?"SA’ = Ȳ’":"SA = Ȳ"):(mL?"Ȳ’ (SA de largo plazo)":"Ȳ (SA de largo plazo)"),w:mod==="clasico"?2.6:1.8});
    if(mod!=="clasico")curves.push({sh:fS(S),col:"--line",lab:mS?"SA’ (corto plazo)":"SA (corto plazo)",op:Sf!==null?.5:1});
    const segs=[];if(Sf!==null){curves.push({sh:fS(Sf),col:"--good",dash:1,lab:"SA con Pᵉ ajustada"});segs.push({x1:Y1,y1:P1,x2:Y2,y2:P2,col:"--muted",dash:1,w:1.5,arrow:1})}
    const pts=[{x:5,y:5,lab:"0"}];if(moved){pts.push({x:Y1,y:P1,lab:"1",col:Y2===null?"--good":"--muted"});if(Y2!==null)pts.push({x:Y2,y:P2,lab:"2",col:"--good"})}
    const hd=VIS.clamp(7.6+D,1,9.2),handles=[{c:"D",x:hd,y:fD(D)(hd),col:"--branch",name:"la DA"},{c:"Lr",x:5+Lr,y:9.3,col:mod==="clasico"?"--line":"--muted",name:"la SA de largo plazo"}];
    if(mod==="keynes")handles.push({c:"S",x:1.5,y:5-S,col:"--line",name:"la SA"});else if(mod!=="clasico"){const hs=VIS.clamp(7.4+S,1,9.2);handles.push({c:"S",x:hs,y:5+0.8*(hs-5-S),col:"--line",name:"la SA de corto plazo"})}
    const P={cap:"SA-DA · "+VIS.SAM[mod],xr:[0,10],yr:[0,10],xl:"Producción Y",yl:"Nivel de precios P",curves,segs,pts,handles};
    let h="";const mv=[],cs=[];
    if(mD){mv.push(`La DA se desplazó <b>${D>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(D>0?"<b>DA a la derecha:</b> ∆+M (efectiva con tipo flexible), ∆+G o ∆-T (con tipo fijo), ∆+X exógenas (con fijo), ∆+i* (con flexible, por la depreciación), entrada de capitales (con fijo).":"<b>DA a la izquierda:</b> ∆-M, ∆-G o ∆+T, cae el consumo, caen las exportaciones (con fijo), salida de capitales (con fijo).")}
    if(mS){mv.push(`La SA de corto plazo se desplazó <b>${S>0?"a la derecha (abajo)":"a la izquierda (arriba)"}</b>.`);cs.push(S>0?"<b>SA a la derecha:</b> abaratamiento de insumos importados, ∆-salario mínimo o ∆-contribuciones a la nómina, ∆-Pᵉ (NMC), más productividad.":"<b>SA a la izquierda:</b> ∆+precio del petróleo u otro insumo importado, ∆+salario mínimo (NMK), ∆+contribuciones a la nómina, ∆+Pᵉ (NMC).")}
    if(mL){mv.push(`La producción de pleno empleo Ȳ se desplazó <b>${Lr>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(Lr>0?"<b>Ȳ a la derecha:</b> más productividad, más capital o más población activa.":"<b>Ȳ a la izquierda:</b> un choque de oferta permanente (por ejemplo, costos más altos que reducen el empleo de pleno empleo).")}
    if(!moved)h="<p>Todavía no hay cambios: en 0 la economía está en pleno empleo. Arrastra una curva o prueba un choque, y cambia de modelo para comparar.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));let m="";
      if(mod==="clasico")m=`<p>Con información completa la SA es vertical en Ȳ: ${mD&&!mL?"un cambio de la DA solo mueve los precios (el dinero es neutral); el salario nominal se ajusta en la misma proporción.":"la producción la fija Ȳ y los precios se ajustan para que la DA la compre."}</p>`;
      else if(mod==="keynes")m="<p>Con precios fijos y capacidad ociosa, la DA determina la producción: los cambios de la DA mueven Y y el empleo sin mover P.</p>";
      else if(mod==="nmc")m=`<p><b>Corto plazo</b> (punto 1): con Pᵉ dada, ${P1>5?"el alza de precios baja el salario real como costo y sube el empleo y la producción":"la caída de precios sube el salario real como costo y baja el empleo"}${mS&&!mD?" (aquí el choque es de costos: suben los precios y cae la producción, estanflación)":""}.</p>${Y2!==null?`<p><b>Largo plazo</b> (punto 2): los trabajadores corrigen sus expectativas, la SA de corto plazo se desplaza (verde) y la economía vuelve a Ȳ con precios ${P2>5?"más altos":"más bajos"}.</p>`:""}`;
      else m=`<p>Con salario mínimo rígido, ${P1>5?"el alza de precios baja W̄/P y sube el empleo y la producción":"la caída de precios sube W̄/P y baja el empleo y la producción"}${mS&&!mD?" (con el choque de costos suben los precios y cae el empleo)":""}. El efecto <b>persiste</b>: no hay ajuste automático de vuelta a Ȳ.</p>`;
      h+=VIS.sec("Mecanismo",m);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producción (corto plazo)",5,Y1,2),VIS.tile("Precios (corto plazo)",5,P1,2),...(Y2!==null?[VIS.tile("Producción (largo plazo)",5,Y2,2),VIS.tile("Precios (largo plazo)",5,P2,2)]:[])])}</div>`)}
    return{panels:[P],text:h}}});
