// Estadística I · laboratorios interactivos
// ===================== AYUDAS COMUNES DE LOS LABORATORIOS DE MICROECONOMÍA =====================
const SIMS={};
let CLIP=0;
function plotXY({xr,yr,series=[],points=[],vlines=[],hlines=[],xl,yl,H=300,label,areas=[]}){
  const W=600,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/5)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl),id="cp"+(++CLIP);
  let b="";
  areas.forEach(a=>{const d=a.pts.map(([x,y],i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(y).toFixed(1)).join("")+"Z";b+=`<path d="${d}" fill="var(${a.col})" fill-opacity="${a.op||.22}" stroke="none"/>`});
  series.forEach(s=>{const pts=s.pts||[...Array(241)].map((_,i)=>{const x=xr[0]+(xr[1]-xr[0])*i/240;const y=s.f(x);return[x,y==null?NaN:y]});
    let d="",pen=false;pts.forEach(([x,y])=>{if(!isFinite(y)){pen=false;return}d+=(pen?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(Math.max(yr[0]-(yr[1]-yr[0]),Math.min(yr[1]+(yr[1]-yr[0]),y))).toFixed(1);pen=true});
    b+=`<path d="${d}" fill="none" stroke="var(${s.col||"--ink"})" stroke-width="${s.w||2.5}" ${s.dash?`stroke-dasharray="${s.dash}"`:""}/>`});
  vlines.forEach(v=>b+=`<line x1="${f.sx(v.x)}" x2="${f.sx(v.x)}" y1="${f.sy(yr[0])}" y2="${f.sy(yr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  hlines.forEach(v=>b+=`<line y1="${f.sy(v.y)}" y2="${f.sy(v.y)}" x1="${f.sx(xr[0])}" x2="${f.sx(xr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  let p="";points.forEach(q=>{if(!isFinite(q.x)||!isFinite(q.y))return;const x=f.sx(q.x),y=f.sy(q.y),anc=x>W*.7?"end":"start";
    p+=`<circle cx="${x}" cy="${y}" r="6" fill="var(${q.col||"--ink"})" stroke="var(--card)" stroke-width="2"/>${q.label?`<text x="${x+(anc==="end"?-9:9)}" y="${y-9}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${q.col||"--ink"})">${q.label}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfico"}"><defs><clipPath id="${id}"><rect x="${f.L}" y="${f.T}" width="${W-f.L-f.R}" height="${H-f.T-f.B}"/></clipPath></defs>${f.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const legend=items=>`<div class="legend">${items.map(([c,t,d])=>`<span><i style="background:var(${c})${d?";opacity:.55":""}"></i>${t}</span>`).join("")}</div>`;
const okAll=a=>a.every(x=>isFinite(x)),n2=v=>fmt(v,2),n4=v=>fmt(v,4);
const tabsBox=(id,opts)=>`<div style="margin-bottom:10px">${seg(id,"Herramienta",opts,opts[0][0])}</div><div id="${id}-b"></div>`;
function tabsRun(id,M){const go=k=>M[k]();bindSeg(id,go);go(Object.keys(M)[0])}
const nin=(id,l,v,st)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" ${st?`step="${st}"`:""} inputmode="decimal"></label>`;
const N=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",",".")):NaN};
const onIn=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});



// ===================== LABORATORIOS DE ESTADÍSTICA I =====================
const n0=v=>fmt(v,0),n6=v=>fmt(v,6);
const parseNums=t=>(t.replace(/,\s+/g," ").match(/-?\d+(?:[.,]\d+)?(?:e-?\d+)?/gi)||[]).map(v=>{let s=v;if(s.includes(",")&&s.includes("."))s=s.replace(/\./g,"").replace(",",".");else s=s.replace(",",".");return+s}).filter(isFinite);
const rbox=code=>`<details class="pdet"><summary><b>Código en R</b></summary><pre class="code"><code>${code.replace(/</g,"&lt;")}</code></pre></details>`;
const barPlot=(xs,ys,{xl,yl,label,hi=()=>false,H=260})=>{const ym=Math.max(...ys)*1.12||1,x0=Math.min(...xs)-0.6,x1=Math.max(...xs)+0.6,W=600,f=frame(W,H,[x0,x1],[0,ym],ticks(x0,x1,nice((x1-x0)/8)).filter(t=>Number.isInteger(t)),ticks(0,ym,nice(ym/4)),xl,yl),bw=Math.max(2,(f.sx(1)-f.sx(0))*0.7);
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${f.g}${xs.map((x,i)=>`<rect x="${f.sx(x)-bw/2}" y="${f.sy(ys[i])}" width="${bw}" height="${f.sy(0)-f.sy(ys[i])}" fill="var(${hi(x)?"--exam":"--line"})" fill-opacity="${hi(x)?.9:.55}"/>`).join("")}</svg></div>`};

// ---------- 1. Estadística descriptiva
const DEMO="2,1 2,8 3,0 3,2 3,4 3,5 3,7 4,0 4,1 4,5 4,8 5,0 5,2 5,9 6,3 7,1 8,4 12,5";
SIMS.desc=function(){
  $("sim").innerHTML=tabsBox("de",[["datos","Datos sin agrupar"],["agr","Datos agrupados"]]);const B=$("de-b");
  tabsRun("de",{
   datos(){B.innerHTML=`<div class="calcf"><label for="ds-x">Datos (separados por espacios, comas o saltos de línea; sirve 4,5 y 4.5)<textarea id="ds-x" rows="4" style="width:100%;font-family:var(--f-mono)">${DEMO}</textarea></label>${nin("ds-k","Número de clases (0 = Sturges)",0)}</div><div class="res" id="ds-res"></div><h4 class="subh">Tabla de frecuencias</h4><div id="ds-t"></div><h4 class="subh">Histograma y diagrama de caja</h4><div id="ds-p"></div><div id="ds-st"></div><div id="ds-r"></div>`;
    const run=()=>{const x=parseNums($("ds-x").value);if(x.length<3){$("ds-res").innerHTML=err("escribe al menos 3 datos.");return}const D=E1.describir(x),T=E1.frecuencias(x,Math.round(N("ds-k"))||0);
      $("ds-res").innerHTML=tiles([["n",String(D.n)],["Media",n4(D.media)],["Mediana",n4(D.mediana)],["Moda",D.modas.length?D.modas.map(n4).join("; "):"no hay"],["Desviación estándar s",n4(D.sd)],["Varianza s²",n4(D.var)],["CV",fmt(100*D.cv,2)+" %"],["Asimetría g₁",n4(D.g1)]]);
      $("ds-t").innerHTML=`<div class="tbl"><table><tr><th>Clase</th><th class="num">Marca</th><th class="num">f</th><th class="num">f relativa</th><th class="num">F</th><th class="num">F relativa</th></tr>${T.cl.map((c,i)=>`<tr><td>[${n2(c.a)}, ${n2(c.b)}${i===T.k-1?"]":")"}</td><td class="num">${n2(c.m)}</td><td class="num">${c.f}</td><td class="num">${n4(c.fr)}</td><td class="num">${c.F}</td><td class="num">${n4(c.Fr)}</td></tr>`).join("")}</table></div><p class="hint">${Math.round(N("ds-k"))?"":`Sturges: k = 1 + 3,322·log₁₀(${D.n}) = ${fmt(1+3.322*Math.log10(D.n),2)} → ${T.k} clases; `}amplitud = rango/k = ${n2(D.rango)}/${T.k} = ${n4(T.w)}.</p>`;
      const W=600,H=300,f=frame(W,H,[D.min,D.max],[0,Math.max(...T.cl.map(c=>c.f))*1.25],ticks(D.min,D.max,nice((D.max-D.min)/6)),ticks(0,Math.max(...T.cl.map(c=>c.f))*1.25,Math.max(1,nice(Math.max(...T.cl.map(c=>c.f))/4))),"valor","frecuencia"),yb=f.sy(Math.max(...T.cl.map(c=>c.f))*1.15);
      const bars=T.cl.map(c=>`<rect x="${f.sx(c.a)}" y="${f.sy(c.f)}" width="${f.sx(c.b)-f.sx(c.a)}" height="${f.sy(0)-f.sy(c.f)}" fill="var(--line)" fill-opacity=".45" stroke="var(--line)"/>`).join(""),bx=k=>f.sx(k).toFixed(1),wl=Math.max(D.min,D.cercas[0]),wh=Math.min(D.max,D.cercas[1]),inn=D.s.filter(v=>v>=D.cercas[0]&&v<=D.cercas[1]);
      const box=`<g stroke="var(--ink)" stroke-width="1.6"><line x1="${bx(inn[0])}" x2="${bx(D.q1)}" y1="${yb}" y2="${yb}"/><line x1="${bx(D.q3)}" x2="${bx(inn[inn.length-1])}" y1="${yb}" y2="${yb}"/><rect x="${bx(D.q1)}" y="${yb-10}" width="${f.sx(D.q3)-f.sx(D.q1)}" height="20" fill="var(--card)"/><line x1="${bx(D.mediana)}" x2="${bx(D.mediana)}" y1="${yb-10}" y2="${yb+10}" stroke="var(--exam)" stroke-width="3"/></g>${D.atipicos.map(a=>`<circle cx="${bx(a)}" cy="${yb}" r="4" fill="var(--bad)"/>`).join("")}`;
      $("ds-p").innerHTML=`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histograma y diagrama de caja">${f.g}${bars}${box}</svg></div>`;
      $("ds-st").innerHTML=stp(1,"Localización",`<div class="eq al">Media = ${n4(D.media*D.n)}/${D.n} = <b>${n4(D.media)}</b> · mediana = <b>${n4(D.mediana)}</b> · media recortada al 10 % = ${n4(D.recortada)}<br>Q₁ = ${n4(D.q1)}, Q₃ = ${n4(D.q3)} (cuantiles tipo 7, como <code>quantile()</code> de R) · mínimo ${n4(D.min)}, máximo ${n4(D.max)}</div>`)
        +stp(2,"Variabilidad",`<div class="eq al">s² = Σ(xᵢ − x̄)²/(n − 1) = ${n4(D.var*(D.n-1))}/${D.n-1} = <b>${n4(D.var)}</b> · s = <b>${n4(D.sd)}</b> (con n: ${n4(D.varP)})<br>Rango = ${n4(D.rango)} · RIC = ${n4(D.ric)} · CV = s/x̄ = ${fmt(100*D.cv,2)} %</div>`)
        +stp(3,"Forma y atípicos",`<div class="eq al">g₁ = m₃/m₂<sup>3/2</sup> = <b>${n4(D.g1)}</b> · Pearson 3(x̄ − mediana)/s = ${n4(D.pearson)} · curtosis g₂ = ${n4(D.g2)}<br>Cercas: Q₁ − 1,5·RIC = ${n4(D.cercas[0])}, Q₃ + 1,5·RIC = ${n4(D.cercas[1])} ⟹ atípicos: ${D.atipicos.length?D.atipicos.map(n4).join(", "):"ninguno"}</div><p>${D.g1>0.5?"Asimetría positiva: cola larga a la derecha (la media supera a la mediana).":D.g1<-0.5?"Asimetría negativa: cola larga a la izquierda.":"Distribución aproximadamente simétrica."}</p>`);
      $("ds-r").innerHTML=rbox(`x <- c(${x.join(", ")})\nmean(x); median(x); var(x); sd(x)\nquantile(x)          # cuartiles tipo 7\nIQR(x); sd(x)/mean(x)\nmean(x, trim = 0.1)  # media recortada\nhist(x, breaks = "Sturges")\nboxplot(x, horizontal = TRUE)\nstem(x)`)};
    onIn(["ds-x","ds-k"],run);run()},
   agr(){const C=[[0,10,5],[10,20,8],[20,30,12],[30,40,5],["","",""]];
    B.innerHTML=`<p class="hint">Escribe los límites de cada clase [L, U) y su frecuencia.</p><div class="tbl"><table><tr><th>L</th><th>U</th><th>f</th></tr>${C.map((r,i)=>`<tr>${r.map((v,j)=>`<td><input type="number" id="ga-${i}-${j}" value="${v}" style="width:6em" aria-label="${["L","U","f"][j]} clase ${i+1}"></td>`).join("")}</tr>`).join("")}</table></div><div class="res" id="ga-res"></div><div id="ga-st"></div>`;
    const run=()=>{const cl=[];for(let i=0;i<C.length;i++){const v=[0,1,2].map(j=>$(`ga-${i}-${j}`).value);if(v.some(s=>s===""))continue;const[a,b,f]=v.map(Number);if(b>a&&f>=0)cl.push({a,b,f})}if(cl.length<2){$("ga-res").innerHTML=err("hacen falta al menos dos clases.");return}const R=E1.agrupados(cl);
      $("ga-res").innerHTML=tiles([["n",String(R.n)],["Media",n4(R.media)],["Mediana",n4(R.mediana)],["Moda",n4(R.moda)],["Desviación estándar",n4(R.sd)]]);
      let F=0;const filas=cl.map(c=>{const m=(c.a+c.b)/2;F+=c.f;return`<tr><td>[${fm(c.a)}, ${fm(c.b)})</td><td class="num">${fm(m)}</td><td class="num">${c.f}</td><td class="num">${F}</td><td class="num">${n2(c.f*m)}</td><td class="num">${n2(c.f*(m-R.media)**2)}</td></tr>`}).join("");
      const c=cl[R.claseModal];
      $("ga-st").innerHTML=`<div class="tbl"><table><tr><th>Clase</th><th class="num">Marca m</th><th class="num">f</th><th class="num">F</th><th class="num">f·m</th><th class="num">f(m − x̄)²</th></tr>${filas}</table></div>`+stp(1,"Fórmulas",`<div class="eq al">x̄ = Σf·m/n = <b>${n4(R.media)}</b> · s² = Σf(m − x̄)²/(n − 1) = ${n4(R.var)}<br>Mediana = L + (n/2 − F<sub>anterior</sub>)/f · w = <b>${n4(R.mediana)}</b><br>Moda (clase modal [${fm(c.a)}, ${fm(c.b)})) = L + d₁/(d₁ + d₂) · w = <b>${n4(R.moda)}</b></div>`)};
    B.querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()}})};

// ---------- 2. Conteo
SIMS.cont=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ct-n","n (elementos disponibles)",1,60,1,10)}${ctl("ct-r","r (elementos que se escogen)",0,60,1,3)}</div><div class="res" id="ct-res"></div><div id="ct-st"></div>
  <h4 class="subh">Permutaciones con objetos repetidos</h4><div class="calcf"><label for="ct-w">Palabra o lista de grupos<input id="ct-w" value="ECONOMIA"></label></div><div id="ct-w2"></div>`;
  const run=()=>{const n=Math.round(V("ct-n")),r=Math.round(V("ct-r"));const big=v=>v>1e15?v.toExponential(4):Math.round(v).toLocaleString("es-CO");
    if(r>n){$("ct-res").innerHTML=tiles([["Variaciones con repetición nʳ",big(Math.pow(n,r))],["Combinaciones con repetición",big(Math.exp(E1.lcomb(n+r-1,r)))]]);$("ct-st").innerHTML=`<p class="hint">Con r > n no hay permutaciones ni combinaciones sin repetición.</p>`;return}
    const P=Math.exp(E1.lfact(n)-E1.lfact(n-r)),Cn=Math.exp(E1.lcomb(n,r));
    $("ct-res").innerHTML=tiles([["Permutaciones P(n, r)",big(P)],["Combinaciones C(n, r)",big(Cn)],["Con repetición, con orden nʳ",big(Math.pow(n,r))],["Con repetición, sin orden",big(Math.exp(E1.lcomb(n+r-1,r)))],["n!",big(Math.exp(E1.lfact(n)))],["Circulares (n − 1)!",big(Math.exp(E1.lfact(n-1)))]]);
    $("ct-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">P(${n}, ${r}) = ${n}!/(${n} − ${r})! = ${n}!/${n-r}! = <b>${big(P)}</b><br>C(${n}, ${r}) = ${n}!/(${r}!·${n-r}!) = P(${n}, ${r})/${r}! = ${big(P)}/${big(Math.exp(E1.lfact(r)))} = <b>${big(Cn)}</b></div><p class="hint">¿Importa el orden? Sí: permutaciones (presidente, secretario…). No: combinaciones (comités, manos de cartas).</p>`)+rbox(`factorial(${n})\nchoose(${n}, ${r})                     # combinaciones\nfactorial(${n}) / factorial(${n - r})  # permutaciones\n${n}^${r}                              # con repetición`)};
  const runW=()=>{const w=$("ct-w").value.replace(/\s+/g,"").toUpperCase();if(!w)return;const cnt={};[...w].forEach(c=>cnt[c]=(cnt[c]||0)+1);const rep=Object.entries(cnt).filter(([,v])=>v>1),tot=Math.exp(E1.lfact(w.length)-Object.values(cnt).reduce((s,v)=>s+E1.lfact(v),0));
    $("ct-w2").innerHTML=`<div class="eq al">${w.length}!${rep.map(([k,v])=>` / ${v}! (${k})`).join("")} = <b>${Math.round(tot).toLocaleString("es-CO")}</b> ordenamientos distintos</div>`};
  bindCtl(["ct-n","ct-r"],run);onIn(["ct-w"],runW);run();runW()};

// ---------- 3. Probabilidad
SIMS.prob=function(){
  $("sim").innerHTML=tabsBox("pb",[["dos","Dos eventos"],["bay","Probabilidad total y Bayes"]]);const B=$("pb-b");
  tabsRun("pb",{
   dos(){B.innerHTML=`<div class="ctr">${ctl("pe-a","P(A)",0,1,0.01,0.4)}${ctl("pe-b","P(B)",0,1,0.01,0.5)}${ctl("pe-ab","P(A ∩ B)",0,1,0.01,0.2)}</div><div class="res" id="pe-res"></div><div id="pe-v"></div><div id="pe-st"></div>`;
    const run=()=>{const v={pA:V("pe-a"),pB:V("pe-b"),pAB:V("pe-ab")},R=E1.dosEventos(v);if(!R.valido){$("pe-res").innerHTML=err("P(A ∩ B) no puede superar P(A) ni P(B), y P(A ∪ B) no puede pasar de 1.");$("pe-v").innerHTML=$("pe-st").innerHTML="";return}
      $("pe-res").innerHTML=tiles([["P(A ∪ B)",n4(R.union)],["P(A | B)",n4(R.AdadoB)],["P(B | A)",n4(R.BdadoA)],["P(ninguno)",n4(R.ninguno)],["¿Independientes?",R.indep?"sí":"no",R.indep?"okt":""],["¿Excluyentes?",R.excl?"sí":"no"]]);
      $("pe-v").innerHTML=`<div class="plot"><svg viewBox="0 0 600 230" role="img" aria-label="Diagrama de Venn"><rect x="10" y="10" width="580" height="210" fill="none" stroke="var(--muted)"/><text x="20" y="30" font-size="13" fill="var(--muted)">S · ninguno ${n4(R.ninguno)}</text><circle cx="250" cy="120" r="85" fill="var(--line)" fill-opacity=".25" stroke="var(--line)"/><circle cx="350" cy="120" r="85" fill="var(--branch)" fill-opacity=".25" stroke="var(--branch)"/><text x="200" y="125" font-size="14" text-anchor="middle" fill="var(--ink)">${n4(R.soloA)}</text><text x="300" y="125" font-size="14" text-anchor="middle" font-weight="700" fill="var(--ink)">${n4(v.pAB)}</text><text x="400" y="125" font-size="14" text-anchor="middle" fill="var(--ink)">${n4(R.soloB)}</text><text x="190" y="50" font-size="15" font-weight="700" fill="var(--line)">A</text><text x="405" y="50" font-size="15" font-weight="700" fill="var(--branch)">B</text></svg></div>`;
      $("pe-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">P(A ∪ B) = ${fm(v.pA)} + ${fm(v.pB)} − ${fm(v.pAB)} = <b>${n4(R.union)}</b><br>P(A | B) = P(A ∩ B)/P(B) = ${fm(v.pAB)}/${fm(v.pB)} = <b>${n4(R.AdadoB)}</b><br>Independencia: P(A)·P(B) = ${n4(v.pA*v.pB)} ${R.indep?"=":"≠"} P(A ∩ B) = ${fm(v.pAB)}</div>`)};
    bindCtl(["pe-a","pe-b","pe-ab"],run);run()},
   bay(){const D=[["Máquina 1",0.5,0.02],["Máquina 2",0.3,0.03],["Máquina 3",0.2,0.05],["",0,0]];
    B.innerHTML=`<p class="hint">Partición B₁ … B₄ con sus probabilidades P(Bᵢ) (deben sumar 1) y la probabilidad del evento A en cada una, P(A | Bᵢ).</p><div class="tbl"><table><tr><th>Evento</th><th>P(Bᵢ)</th><th>P(A | Bᵢ)</th></tr>${D.map((r,i)=>`<tr><td><input id="by-n${i}" value="${r[0]}" style="width:9em" aria-label="Nombre ${i+1}"></td><td><input type="number" id="by-p${i}" value="${r[1]}" step="0.01" style="width:6em" aria-label="P(B${i+1})"></td><td><input type="number" id="by-l${i}" value="${r[2]}" step="0.01" style="width:6em" aria-label="P(A|B${i+1})"></td></tr>`).join("")}</table></div><div class="res" id="by-res"></div><div id="by-st"></div>`;
    const run=()=>{const rows=D.map((_,i)=>({n:$("by-n"+i).value||`B${i+1}`,p:N("by-p"+i),l:N("by-l"+i)})).filter(r=>r.p>0);const sp=rows.reduce((s,r)=>s+r.p,0);
      if(rows.length<2||Math.abs(sp-1)>1e-6||rows.some(r=>!(r.l>=0&&r.l<=1))){$("by-res").innerHTML=err(`las P(Bᵢ) deben sumar 1 (ahora suman ${n4(sp)}) y las condicionales estar entre 0 y 1.`);$("by-st").innerHTML="";return}
      const R=E1.bayes({prior:rows.map(r=>r.p),lik:rows.map(r=>r.l)});
      $("by-res").innerHTML=tiles([["P(A) (probabilidad total)",n4(R.tot)],...rows.map((r,i)=>[`P(${r.n} | A)`,n4(R.post[i])])]);
      $("by-st").innerHTML=stp(1,"Probabilidad total",`<div class="eq al">P(A) = ${rows.map(r=>`${fm(r.p)}·${fm(r.l)}`).join(" + ")} = ${R.j.map(n4).join(" + ")} = <b>${n4(R.tot)}</b></div>`)
        +stp(2,"Bayes",`<div class="tbl"><table><tr><th>Bᵢ</th><th class="num">P(Bᵢ)</th><th class="num">P(A | Bᵢ)</th><th class="num">P(Bᵢ ∩ A)</th><th class="num">P(Bᵢ | A)</th></tr>${rows.map((r,i)=>`<tr><td>${esc(r.n)}</td><td class="num">${fm(r.p)}</td><td class="num">${fm(r.l)}</td><td class="num">${n4(R.j[i])}</td><td class="num"><b>${n4(R.post[i])}</b></td></tr>`).join("")}</table></div><p class="hint">Cada probabilidad a posteriori es su fila de la columna «P(Bᵢ ∩ A)» dividida por el total ${n4(R.tot)}.</p>`)};
    B.querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()}})};

// ---------- 4. Variables aleatorias
SIMS.va=function(){
  $("sim").innerHTML=tabsBox("va",[["disc","Discreta (tabla)"],["cont","Continua f(x) = k·x^m"]]);const B=$("va-b");
  tabsRun("va",{
   disc(){B.innerHTML=`<div class="calcf"><label for="vd-x">Valores de X<input id="vd-x" value="0, 1, 2, 3"></label><label for="vd-p">Probabilidades<input id="vd-p" value="0.1, 0.3, 0.4, 0.2"></label></div><div class="res" id="vd-res"></div><div id="vd-p2"></div><div id="vd-st"></div>`;
    const run=()=>{const x=parseNums($("vd-x").value),p=parseNums($("vd-p").value);if(x.length<1||x.length!==p.length||p.some(v=>v<0)){$("vd-res").innerHTML=err("debe haber tantos valores como probabilidades, todas ≥ 0.");return}const R=E1.discreta(x,p);
      if(Math.abs(R.suma-1)>1e-6){$("vd-res").innerHTML=err(`las probabilidades suman ${n4(R.suma)} y deben sumar 1.`);return}
      $("vd-res").innerHTML=tiles([["E(X)",n4(R.media)],["E(X²)",n4(R.e2)],["V(X)",n4(R.var)],["σ",n4(R.sd)]]);
      $("vd-p2").innerHTML=Number.isInteger(x[0])&&x.every(Number.isInteger)?barPlot(x,p,{xl:"x",yl:"p(x)",label:"Función de probabilidad"}):"";
      $("vd-st").innerHTML=`<div class="tbl"><table><tr><th>x</th><th class="num">p(x)</th><th class="num">F(x)</th><th class="num">x·p(x)</th><th class="num">x²·p(x)</th></tr>${x.map((v,i)=>`<tr><td>${fm(v)}</td><td class="num">${fm(p[i])}</td><td class="num">${n4(R.F[i])}</td><td class="num">${n4(v*p[i])}</td><td class="num">${n4(v*v*p[i])}</td></tr>`).join("")}</table></div>`+stp(1,"Cálculo",`<div class="eq al">E(X) = Σx·p(x) = <b>${n4(R.media)}</b> · V(X) = E(X²) − [E(X)]² = ${n4(R.e2)} − ${n4(R.media)}² = <b>${n4(R.var)}</b></div>`)+rbox(`x <- c(${x.join(", ")}); p <- c(${p.join(", ")})\nsum(x * p)                    # E(X)\nsum(x^2 * p) - sum(x * p)^2   # V(X)\ncumsum(p)                     # F(x)`)};
    onIn(["vd-x","vd-p"],run);run()},
   cont(){B.innerHTML=`<div class="ctr">${ctl("vc-m","Exponente m",0,6,1,2)}${ctl("vc-a","a (inicio, ≥ 0)",0,10,0.5,0)}${ctl("vc-b","b (fin)",0.5,20,0.5,3)}${ctl("vc-l","P(l < X < u): l",0,20,0.1,1)}${ctl("vc-u","u",0,20,0.1,2)}</div><div class="res" id="vc-res"></div><div id="vc-p"></div><div id="vc-st"></div>`;
    const run=()=>{const m=V("vc-m"),a=V("vc-a"),b=V("vc-b"),l=V("vc-l"),u=V("vc-u");if(!(b>a)){$("vc-res").innerHTML=err("b debe ser mayor que a.");return}const R=E1.potencia({m,a,b}),pr=R.F(Math.max(l,a))-R.F(Math.min(u,b));const P=Math.max(0,-pr);
      $("vc-res").innerHTML=tiles([["k",n6(R.k)],[`P(${fm(l)} < X < ${fm(u)})`,n4(P)],["E(X)",n4(R.E)],["V(X)",n4(R.var)]]);
      const ar=[];for(let i=0;i<=40;i++){const x=Math.max(l,a)+(Math.min(u,b)-Math.max(l,a))*i/40;ar.push([x,R.f(x)])}if(u>l)ar.push([Math.min(u,b),0],[Math.max(l,a),0]);
      $("vc-p").innerHTML=plotXY({xr:[Math.max(0,a-(b-a)*0.1),b+(b-a)*0.1],yr:[0,Math.max(R.f(a),R.f(b))*1.15||1],areas:u>l?[{pts:ar,col:"--exam",op:.35}]:[],series:[{f:R.f,col:"--line"}],xl:"x",yl:"f(x)",label:"Densidad"});
      $("vc-st").innerHTML=stp(1,"Constante",`<div class="eq al">∫<sub>${fm(a)}</sub><sup>${fm(b)}</sup> k·x<sup>${fm(m)}</sup> dx = k·(${fm(b)}<sup>${fm(m+1)}</sup> − ${fm(a)}<sup>${fm(m+1)}</sup>)/${fm(m+1)} = 1 ⟹ k = <b>${n6(R.k)}</b></div>`)+stp(2,"Probabilidad y momentos",`<div class="eq al">F(x) = k(x<sup>${fm(m+1)}</sup> − ${fm(a)}<sup>${fm(m+1)}</sup>)/${fm(m+1)} · P = F(${fm(Math.min(u,b))}) − F(${fm(Math.max(l,a))}) = <b>${n4(P)}</b><br>E(X) = ∫x·f(x)dx = ${n4(R.E)} · E(X²) = ${n4(R.E2)} · V(X) = ${n4(R.var)}</div>`)+rbox(`f <- function(x) ${n6(R.k)} * x^${m}\nintegrate(f, ${a}, ${b})                       # debe dar 1\nintegrate(f, ${Math.max(l,a)}, ${Math.min(u,b)})  # probabilidad\nintegrate(function(x) x * f(x), ${a}, ${b})    # E(X)`)};
    bindCtl(["vc-m","vc-a","vc-b","vc-l","vc-u"],run);run()}})};

// ---------- 5. Distribución conjunta
SIMS.conj=function(){
  const X=[0,1,2],Y=[0,1,2],P=[[0.10,0.05,0.05],[0.10,0.20,0.10],[0.05,0.15,0.20]];
  $("sim").innerHTML=`<div class="calcf"><label for="cj-x">Valores de X (filas)<input id="cj-x" value="${X.join(", ")}"></label><label for="cj-y">Valores de Y (columnas)<input id="cj-y" value="${Y.join(", ")}"></label></div><div class="tbl"><table><tr><th>X \\ Y</th>${[0,1,2].map(j=>`<th id="cj-h${j}">${Y[j]}</th>`).join("")}</tr>${[0,1,2].map(i=>`<tr><th id="cj-r${i}">${X[i]}</th>${[0,1,2].map(j=>`<td><input type="number" id="cj-${i}-${j}" value="${P[i][j]}" step="0.01" style="width:5.5em" aria-label="p(${i},${j})"></td>`).join("")}</tr>`).join("")}</table></div><div class="res" id="cj-res"></div><div id="cj-st"></div>`;
  const run=()=>{const xs=parseNums($("cj-x").value).slice(0,3),ys=parseNums($("cj-y").value).slice(0,3);if(xs.length<3||ys.length<3){$("cj-res").innerHTML=err("escribe 3 valores para X y 3 para Y.");return}[0,1,2].forEach(k=>{$("cj-h"+k).textContent=fm(ys[k]);$("cj-r"+k).textContent=fm(xs[k])});
    const p=[0,1,2].map(i=>[0,1,2].map(j=>N(`cj-${i}-${j}`)));if(p.flat().some(v=>!(v>=0))){$("cj-res").innerHTML=err("las probabilidades deben ser ≥ 0.");return}const R=E1.conjunta(xs,ys,p);
    if(Math.abs(R.tot-1)>1e-6){$("cj-res").innerHTML=err(`la tabla suma ${n4(R.tot)}; debe sumar 1.`);$("cj-st").innerHTML="";return}
    $("cj-res").innerHTML=tiles([["E(X)",n4(R.EX)],["E(Y)",n4(R.EY)],["Cov(X, Y)",n4(R.cov)],["ρ",n4(R.rho)],["¿Independientes?",R.indep?"sí":"no",R.indep?"okt":""]]);
    $("cj-st").innerHTML=stp(1,"Marginales",`<div class="tbl"><table><tr><th>X \\ Y</th>${ys.map(y=>`<th class="num">${fm(y)}</th>`).join("")}<th class="num">p<sub>X</sub>(x)</th></tr>${xs.map((x,i)=>`<tr><td>${fm(x)}</td>${p[i].map(v=>`<td class="num">${fm(v)}</td>`).join("")}<td class="num"><b>${n4(R.px[i])}</b></td></tr>`).join("")}<tr><td>p<sub>Y</sub>(y)</td>${R.py.map(v=>`<td class="num"><b>${n4(v)}</b></td>`).join("")}<td class="num">1</td></tr></table></div>`)
      +stp(2,"Condicional de Y dado X",`<div class="tbl"><table><tr><th>Dado X =</th>${ys.map(y=>`<th class="num">P(Y = ${fm(y)} | X)</th>`).join("")}<th class="num">E(Y | X)</th></tr>${xs.map((x,i)=>`<tr><td>${fm(x)}</td>${p[i].map(v=>`<td class="num">${R.px[i]?n4(v/R.px[i]):"—"}</td>`).join("")}<td class="num">${R.px[i]?n4(ys.reduce((s,y,j)=>s+y*p[i][j],0)/R.px[i]):"—"}</td></tr>`).join("")}</table></div>`)
      +stp(3,"Covarianza y correlación",`<div class="eq al">E(XY) = ΣΣ x·y·p(x, y) = ${n4(R.EXY)}<br>Cov = E(XY) − E(X)E(Y) = ${n4(R.EXY)} − ${n4(R.EX)}·${n4(R.EY)} = <b>${n4(R.cov)}</b><br>ρ = Cov/(σ<sub>X</sub>σ<sub>Y</sub>) = ${n4(R.cov)}/(${n4(Math.sqrt(R.VX))}·${n4(Math.sqrt(R.VY))}) = <b>${n4(R.rho)}</b></div><p>${R.indep?"p(x, y) = p_X(x)·p_Y(y) en todas las celdas: son independientes.":"Hay al menos una celda con p(x, y) ≠ p_X(x)·p_Y(y): son dependientes."}</p>`)};
  $("sim").querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()};

// ---------- 6. Esperanza
SIMS.esp=function(){
  $("sim").innerHTML=tabsBox("es",[["lin","Combinación lineal aX + bY + c"],["cheb","Teorema de Chebyshev"]]);const B=$("es-b");
  tabsRun("es",{
   lin(){B.innerHTML=`<div class="ctr">${ctl("el-a","a",-5,5,0.1,2)}${ctl("el-b","b",-5,5,0.1,-1)}${ctl("el-c","c",-50,50,1,0)}${ctl("el-mx","E(X)",-50,50,0.5,10)}${ctl("el-my","E(Y)",-50,50,0.5,5)}${ctl("el-sx","σ_X",0,20,0.1,2)}${ctl("el-sy","σ_Y",0,20,0.1,3)}${ctl("el-r","Correlación ρ",-1,1,0.05,0)}</div><div class="res" id="el-res"></div><div id="el-st"></div>`;
    const run=()=>{const v={a:V("el-a"),b:V("el-b"),c:V("el-c"),mx:V("el-mx"),my:V("el-my"),sx:V("el-sx"),sy:V("el-sy"),rho:V("el-r")},R=E1.lineal(v);
      $("el-res").innerHTML=tiles([["E(W)",n4(R.E)],["V(W)",n4(R.V)],["σ_W",n4(Math.sqrt(Math.max(0,R.V)))],["Cov(X, Y)",n4(R.cov)]]);
      $("el-st").innerHTML=stp(1,"W = aX + bY + c",`<div class="eq al">E(W) = ${fm(v.a)}·${fm(v.mx)} + ${fm(v.b)}·${fm(v.my)} + ${fm(v.c)} = <b>${n4(R.E)}</b><br>Cov = ρσ<sub>X</sub>σ<sub>Y</sub> = ${fm(v.rho)}·${fm(v.sx)}·${fm(v.sy)} = ${n4(R.cov)}<br>V(W) = a²σ²<sub>X</sub> + b²σ²<sub>Y</sub> + 2ab·Cov = ${n4(v.a*v.a*v.sx*v.sx)} + ${n4(v.b*v.b*v.sy*v.sy)} + ${n4(2*v.a*v.b*R.cov)} = <b>${n4(R.V)}</b></div><p class="hint">La constante c no afecta la varianza. Con ρ = 0 (independientes), V(X − Y) = V(X) + V(Y).</p>`)};
    bindCtl(["el-a","el-b","el-c","el-mx","el-my","el-sx","el-sy","el-r"],run);run()},
   cheb(){B.innerHTML=`<div class="ctr">${ctl("ch-k","k (desviaciones estándar)",1,6,0.05,2)}${ctl("ch-m","Media μ",-100,100,1,50)}${ctl("ch-s","σ",0.1,50,0.1,5)}</div><div class="res" id="ch-res"></div><div id="ch-st"></div>`;
    const run=()=>{const k=V("ch-k"),m=V("ch-m"),s=V("ch-s"),cb=E1.chebyshev(k),nor=E1.Phi(k)-E1.Phi(-k);
      $("ch-res").innerHTML=tiles([["Cota de Chebyshev",fmt(100*cb,2)+" %"],["Si fuera normal",fmt(100*nor,2)+" %"],["Intervalo",`(${n2(m-k*s)}, ${n2(m+k*s)})`]]);
      $("ch-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">P(|X − μ| < kσ) ≥ 1 − 1/k² = 1 − 1/${fmt(k*k,4)} = <b>${fmt(100*cb,2)} %</b></div><p>Para <i>cualquier</i> distribución con media ${fm(m)} y σ = ${fm(s)}, al menos el ${fmt(100*cb,2)} % de la probabilidad está entre ${n2(m-k*s)} y ${n2(m+k*s)}. Si además fuera normal, sería el ${fmt(100*nor,2)} %.</p>`)};
    bindCtl(["ch-k","ch-m","ch-s"],run);run()}})};

// ---------- 7. Distribuciones discretas
const DD=[["binom","Binomial"],["pois","Poisson"],["hiper","Hipergeométrica"],["geom","Geométrica"],["nbin","Binomial negativa"],["bern","Bernoulli"],["unif","Uniforme discreta"]];
const DPAR={binom:[["n","n (ensayos)",1,200,1,10],["p","p (éxito)",0.01,0.99,0.01,0.3]],pois:[["lam","λ (tasa)",0.1,60,0.1,3]],hiper:[["N","N (población)",2,500,1,20],["K","K (éxitos en la población)",1,500,1,5],["n","n (muestra)",1,500,1,4]],
  geom:[["p","p",0.01,0.99,0.01,0.3]],nbin:[["r","r (éxitos buscados)",1,50,1,2],["p","p",0.01,0.99,0.01,0.4]],bern:[["p","p",0.01,0.99,0.01,0.3]],unif:[["a","a",-20,50,1,1],["b","b",-20,60,1,6]]};
const DFORM={binom:P=>`C(${P.n}, x)·${fm(P.p)}<sup>x</sup>·${fm(1-P.p)}<sup>${P.n}−x</sup>`,pois:P=>`e<sup>−${fm(P.lam)}</sup>·${fm(P.lam)}<sup>x</sup>/x!`,hiper:P=>`C(${P.K}, x)·C(${P.N-P.K}, ${P.n}−x)/C(${P.N}, ${P.n})`,geom:P=>`${fm(1-P.p)}<sup>x−1</sup>·${fm(P.p)}`,nbin:P=>`C(x−1, ${P.r-1})·${fm(P.p)}<sup>${P.r}</sup>·${fm(1-P.p)}<sup>x−${P.r}</sup>`,bern:P=>`${fm(P.p)}<sup>x</sup>·${fm(1-P.p)}<sup>1−x</sup>`,unif:P=>`1/${P.b-P.a+1}`};
const DR={binom:(P,a,b)=>`dbinom(${a}, ${P.n}, ${P.p})\npbinom(${b}, ${P.n}, ${P.p}) - pbinom(${a-1}, ${P.n}, ${P.p})`,pois:(P,a,b)=>`dpois(${a}, ${P.lam})\nppois(${b}, ${P.lam}) - ppois(${a-1}, ${P.lam})`,hiper:(P,a,b)=>`dhyper(${a}, ${P.K}, ${P.N-P.K}, ${P.n})\nphyper(${b}, ${P.K}, ${P.N-P.K}, ${P.n}) - phyper(${a-1}, ${P.K}, ${P.N-P.K}, ${P.n})`,
  geom:(P,a,b)=>`dgeom(${a} - 1, ${P.p})        # R cuenta fracasos\npgeom(${b} - 1, ${P.p}) - pgeom(${a} - 2, ${P.p})`,nbin:(P,a,b)=>`dnbinom(${a} - ${P.r}, ${P.r}, ${P.p})   # R cuenta fracasos\npnbinom(${b} - ${P.r}, ${P.r}, ${P.p}) - pnbinom(${a} - ${P.r} - 1, ${P.r}, ${P.p})`,bern:(P,a)=>`dbinom(${a}, 1, ${P.p})`,unif:(P,a,b)=>`sum(${a}:${b} %in% ${P.a}:${P.b}) / ${P.b-P.a+1}`};
SIMS.disc=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("dd-t","Distribución",DD,"binom")}</div><div class="ctr" id="dd-par"></div><div class="ctr">${ctl("dd-a","Desde x =",-20,300,1,2)}${ctl("dd-b","Hasta x =",-20,300,1,2)}</div><div class="res" id="dd-res"></div><div id="dd-p"></div><div id="dd-st"></div>`;
  let d="binom";const mk=()=>{$("dd-par").innerHTML=DPAR[d].map(([k,l,a,b,s,v])=>ctl("dp-"+k,l,a,b,s,v)).join("");bindCtl(DPAR[d].map(x=>"dp-"+x[0]),run)};
  const run=()=>{const P={};DPAR[d].forEach(([k])=>P[k]=V("dp-"+k));if(!okAll(Object.values(P)))return;if(d==="hiper"&&(P.K>P.N||P.n>P.N)){$("dd-res").innerHTML=err("K y n no pueden superar N.");return}if(d==="unif"&&P.b<P.a){$("dd-res").innerHTML=err("b debe ser ≥ a.");return}
    const D=E1.DISC[d],[lo,hi]=D.sop(P),a=Math.round(V("dd-a")),b=Math.max(a,Math.round(V("dd-b"))),xs=[],ps=[];for(let x=lo;x<=hi;x++){xs.push(x);ps.push(D.pmf(x,P))}
    const pab=xs.reduce((s,x,i)=>s+(x>=a&&x<=b?ps[i]:0),0),pa=D.pmf(a,P),Fb=E1.cdfD(d,b,P),m=D.m(P),v=D.v(P);
    $("dd-res").innerHTML=tiles([[`P(X = ${a})`,n6(pa)],[`P(X ≤ ${b})`,n6(Fb)],[`P(${a} ≤ X ≤ ${b})`,n6(pab),"okt"],["Media",n4(m)],["Varianza",n4(v)],["Desviación",n4(Math.sqrt(v))]]);
    $("dd-p").innerHTML=barPlot(xs,ps,{xl:"x",yl:"P(X = x)",label:"Función de probabilidad",hi:x=>x>=a&&x<=b});
    $("dd-st").innerHTML=stp(1,"Fórmula",`<div class="eq al">P(X = x) = ${DFORM[d](P)}<br>P(X = ${a}) = <b>${n6(pa)}</b> · P(${a} ≤ X ≤ ${b}) = ${xs.filter(x=>x>=a&&x<=b).slice(0,8).map(x=>`p(${x})`).join(" + ")}${b-a>7?" + …":""} = <b>${n6(pab)}</b></div>`)+rbox(DR[d](P,a,b))};
  bindSeg("dd-t",v=>{d=v;mk();run()});bindCtl(["dd-a","dd-b"],run);mk();run()};

// ---------- 8. Distribuciones continuas
const DC=[["norm","Normal"],["expo","Exponencial"],["gamma","Gamma"],["unif","Uniforme"]];
const CPAR={norm:[["mu","μ",-100,100,0.1,0],["s","σ",0.05,50,0.05,1]],expo:[["lam","λ (tasa)",0.01,10,0.01,0.25]],gamma:[["al","α (forma)",0.1,30,0.1,2],["be","β (escala)",0.1,20,0.1,2]],unif:[["a","a",-50,50,0.5,0],["b","b",-50,100,0.5,10]]};
const CR={norm:(P,a,b,p)=>`pnorm(${b}, ${P.mu}, ${P.s}) - pnorm(${a}, ${P.mu}, ${P.s})\nqnorm(${p}, ${P.mu}, ${P.s})`,expo:(P,a,b,p)=>`pexp(${b}, ${P.lam}) - pexp(${a}, ${P.lam})\nqexp(${p}, ${P.lam})`,gamma:(P,a,b,p)=>`pgamma(${b}, shape = ${P.al}, scale = ${P.be}) - pgamma(${a}, shape = ${P.al}, scale = ${P.be})\nqgamma(${p}, shape = ${P.al}, scale = ${P.be})`,unif:(P,a,b,p)=>`punif(${b}, ${P.a}, ${P.b}) - punif(${a}, ${P.a}, ${P.b})\nqunif(${p}, ${P.a}, ${P.b})`};
SIMS.cont2=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("dc-t","Distribución",DC,"norm")}</div><div class="ctr" id="dc-par"></div><div class="calcf">${nin("dc-a","P(a < X < b): a",-1.96,"0.01")}${nin("dc-b","b",1.96,"0.01")}${nin("dc-p","Cuantil: probabilidad acumulada",0.95,"0.01")}</div><div class="res" id="dc-res"></div><div id="dc-pl"></div><div id="dc-st"></div>`;
  let d="norm";const mk=()=>{$("dc-par").innerHTML=CPAR[d].map(([k,l,a,b,s,v])=>ctl("cp-"+k,l,a,b,s,v)).join("");bindCtl(CPAR[d].map(x=>"cp-"+x[0]),run)};
  const run=()=>{const P={};CPAR[d].forEach(([k])=>P[k]=V("cp-"+k));if(!okAll(Object.values(P)))return;if(d==="unif"&&P.b<=P.a){$("dc-res").innerHTML=err("b debe ser mayor que a.");return}
    const D=E1.CONT[d],a=N("dc-a"),b=N("dc-b"),p=N("dc-p");if(!okAll([a,b,p])||b<a||!(p>0&&p<1)){$("dc-res").innerHTML=err("revisa a ≤ b y que la probabilidad del cuantil esté entre 0 y 1.");return}
    const Fa=D.F(a,P),Fb=D.F(b,P),q=E1.qC(d,p,P),[lo,hi]=D.r(P);
    $("dc-res").innerHTML=tiles([[`P(X < ${fm(a)})`,n6(Fa)],[`P(X > ${fm(b)})`,n6(1-Fb)],[`P(${fm(a)} < X < ${fm(b)})`,n6(Fb-Fa),"okt"],[`Cuantil ${fm(p)}`,n4(q)],["Media",n4(D.m(P))],["Varianza",n4(D.v(P))]]);
    const ar=[],x0=Math.max(a,lo),x1=Math.min(b,hi);for(let i=0;i<=60;i++){const x=x0+(x1-x0)*i/60;ar.push([x,D.f(x,P)])}ar.push([x1,0],[x0,0]);let ym=0;for(let i=0;i<=200;i++)ym=Math.max(ym,D.f(lo+(hi-lo)*i/200,P));
    $("dc-pl").innerHTML=plotXY({xr:[lo,hi],yr:[0,Math.min(ym*1.15,50)],areas:x1>x0?[{pts:ar,col:"--exam",op:.35}]:[],series:[{f:x=>D.f(x,P),col:"--line"}],vlines:[{x:q,col:"--good"}],xl:"x",yl:"f(x)",label:"Densidad"});
    const zs=d==="norm"?`<div class="eq al">Estandarizando: z<sub>a</sub> = (${fm(a)} − ${fm(P.mu)})/${fm(P.s)} = ${n4((a-P.mu)/P.s)}, z<sub>b</sub> = ${n4((b-P.mu)/P.s)}<br>P = Φ(${n4((b-P.mu)/P.s)}) − Φ(${n4((a-P.mu)/P.s)}) = ${n6(Fb)} − ${n6(Fa)} = <b>${n6(Fb-Fa)}</b><br>Cuantil: x = μ + z·σ = ${fm(P.mu)} + ${n4(E1.zq(p))}·${fm(P.s)} = <b>${n4(q)}</b></div>`
      :d==="expo"?`<div class="eq al">F(x) = 1 − e<sup>−λx</sup> ⟹ P = e<sup>−${fm(P.lam)}·${fm(Math.max(a,0))}</sup> − e<sup>−${fm(P.lam)}·${fm(Math.max(b,0))}</sup> = <b>${n6(Fb-Fa)}</b><br>Cuantil: x = −ln(1 − p)/λ = <b>${n4(q)}</b></div>`
      :d==="unif"?`<div class="eq al">P = (mín(b, ${fm(P.b)}) − máx(a, ${fm(P.a)}))/(${fm(P.b)} − ${fm(P.a)}) = <b>${n6(Fb-Fa)}</b> · cuantil = a + p(b − a) = ${n4(q)}</div>`
      :`<div class="eq al">F(x) = P(α, x/β) (gamma incompleta regularizada) ⟹ P = ${n6(Fb)} − ${n6(Fa)} = <b>${n6(Fb-Fa)}</b></div>`;
    $("dc-st").innerHTML=stp(1,"Cálculo",zs)+rbox(CR[d](P,a,b,p))};
  bindSeg("dc-t",v=>{d=v;const def={norm:[-1.96,1.96],expo:[0,4],gamma:[0,4],unif:[2,5]}[v];$("dc-a").value=def[0];$("dc-b").value=def[1];mk();run()});onIn(["dc-a","dc-b","dc-p"],run);mk();run()};

// ---------- 9. Aproximaciones
SIMS.aprox=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("ap-t","Aproximar",[["binom","Binomial"],["pois","Poisson"]],"binom")}</div><div class="ctr">${ctl("ap-n","n",1,1000,1,100)}${ctl("ap-p","p",0.01,0.99,0.01,0.5)}${ctl("ap-l","λ (Poisson)",1,200,0.5,25)}${ctl("ap-a","Desde x =",0,1000,1,45)}${ctl("ap-b","Hasta x =",0,1000,1,55)}</div><div class="res" id="ap-res"></div>${legend([["--line","Probabilidades exactas"],["--exam","Curva normal"]])}<div id="ap-pl"></div><div id="ap-st"></div>`;
  let t="binom";const run=()=>{const a=Math.round(V("ap-a")),b=Math.max(a,Math.round(V("ap-b")));let R,xs=[],ps=[],lab;
    if(t==="binom"){const n=Math.round(V("ap-n")),p=V("ap-p");R=E1.aproxBinom({n,p,a,b});const lo=Math.max(0,Math.floor(R.mu-4*R.s)),hi=Math.min(n,Math.ceil(R.mu+4*R.s));for(let x=lo;x<=hi;x++){xs.push(x);ps.push(E1.DISC.binom.pmf(x,{n,p}))}lab=`Bin(${n}, ${fm(p)})`}
    else{const lam=V("ap-l");R=E1.aproxPois({lam,a,b});R.regla=lam>=10;const lo=Math.max(0,Math.floor(lam-4*Math.sqrt(lam))),hi=Math.ceil(lam+4*Math.sqrt(lam));for(let x=lo;x<=hi;x++){xs.push(x);ps.push(E1.DISC.pois.pmf(x,{lam}))}lab=`Poisson(${fm(lam)})`}
    $("ap-res").innerHTML=tiles([["Exacta",n6(R.ex)],["Normal con corrección",n6(R.ap),"okt"],["Error",n6(R.ap-R.ex)],["¿Se cumple la regla?",R.regla?"sí":"no",R.regla?"":"badt"]]);
    $("ap-pl").innerHTML=barPlot(xs,ps,{xl:"x",yl:"probabilidad",label:"Exacta y normal",hi:x=>x>=a&&x<=b}).replace("</svg>",(()=>{const W=600,H=260,ym=Math.max(...ps)*1.12,x0=Math.min(...xs)-0.6,x1=Math.max(...xs)+0.6,f=frame(W,H,[x0,x1],[0,ym],[],[],"","");let d="";for(let i=0;i<=200;i++){const x=x0+(x1-x0)*i/200;d+=(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(E1.phi((x-R.mu)/R.s)/R.s).toFixed(1)}return`<path d="${d}" fill="none" stroke="var(--exam)" stroke-width="2.5"/></svg>`})());
    $("ap-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">${lab}: μ = ${n4(R.mu)}, σ = ${n4(R.s)}${t==="binom"?` · np = ${n2(R.mu)}, n(1 − p) = ${n2(Math.round(V("ap-n"))*(1-V("ap-p")))}`:""}<br>Con corrección: P(${a} ≤ X ≤ ${b}) ≈ Φ((${b} + 0,5 − ${n2(R.mu)})/${n4(R.s)}) − Φ((${a} − 0,5 − ${n2(R.mu)})/${n4(R.s)}) = Φ(${n4(R.zb)}) − Φ(${n4(R.za)}) = <b>${n6(R.ap)}</b>${t==="binom"?`<br>Sin corrección: ${n6(R.sin)}`:""}<br>Exacta: <b>${n6(R.ex)}</b></div>${R.regla?"":`<p class="warn">${t==="binom"?"np o n(1 − p) es menor que 5: la aproximación normal no es confiable.":"λ es pequeño: la aproximación normal no es confiable."}</p>`}`)+rbox(t==="binom"?`sum(dbinom(${a}:${b}, ${Math.round(V("ap-n"))}, ${V("ap-p")}))          # exacta\npnorm(${b} + 0.5, ${n4(R.mu)}, ${n4(R.s)}) - pnorm(${a} - 0.5, ${n4(R.mu)}, ${n4(R.s)})`:`sum(dpois(${a}:${b}, ${V("ap-l")}))\npnorm(${b} + 0.5, ${V("ap-l")}, sqrt(${V("ap-l")})) - pnorm(${a} - 0.5, ${V("ap-l")}, sqrt(${V("ap-l")}))`)};
  bindSeg("ap-t",v=>{t=v;if(v==="pois"){$("ap-a").value=20;$("ap-b").value=30}else{$("ap-a").value=45;$("ap-b").value=55}run()});bindCtl(["ap-n","ap-p","ap-l","ap-a","ap-b"],run);run()};

// ---------- 10. Transformaciones
const TR={lin:{t:"Y = aX + b, X ~ N(μ, σ)",x:"norm",g:(x,k)=>k.a*x+k.b,f:(y,k)=>E1.phi((y-k.b-k.a*k.mu)/(Math.abs(k.a)*k.s))/(Math.abs(k.a)*k.s),r:k=>{const m=k.a*k.mu+k.b,s=Math.abs(k.a)*k.s;return[m-4*s,m+4*s]},txt:k=>`f<sub>Y</sub>(y) = (1/|a|)·f<sub>X</sub>((y − b)/a): Y ~ N(${n2(k.a*k.mu+k.b)}, ${n2(Math.abs(k.a)*k.s)})`},
  cuad:{t:"Y = X², X ~ U(0, 1)",x:"u",g:x=>x*x,f:y=>y>0&&y<1?1/(2*Math.sqrt(y)):0,r:()=>[0,1],txt:()=>"F<sub>Y</sub>(y) = P(X ≤ √y) = √y ⟹ f<sub>Y</sub>(y) = 1/(2√y) en (0, 1)"},
  inv:{t:"Y = −ln(X)/λ, X ~ U(0, 1)",x:"u",g:(x,k)=>-Math.log(x)/k.lam,f:(y,k)=>y<0?0:k.lam*Math.exp(-k.lam*y),r:k=>[0,6/k.lam],txt:k=>`x = e<sup>−λy</sup>, |dx/dy| = λe<sup>−λy</sup> ⟹ f<sub>Y</sub>(y) = ${fm(k.lam)}e<sup>−${fm(k.lam)}y</sup>: Y ~ Exp(${fm(k.lam)})`},
  exp:{t:"Y = e^X, X ~ N(μ, σ) (lognormal)",x:"norm",g:x=>Math.exp(x),f:(y,k)=>y<=0?0:E1.phi((Math.log(y)-k.mu)/k.s)/(y*k.s),r:k=>[0,Math.exp(k.mu+2.5*k.s)],txt:()=>"x = ln y, |dx/dy| = 1/y ⟹ f<sub>Y</sub>(y) = f<sub>X</sub>(ln y)/y"}};
SIMS.transf=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("tf-t","Transformación",Object.entries(TR).map(([k,v])=>[k,v.t]),"lin")}</div><div class="ctr">${ctl("tf-a","a",-3,3,0.1,2)}${ctl("tf-b","b",-20,20,0.5,1)}${ctl("tf-mu","μ de X",-3,3,0.1,0)}${ctl("tf-s","σ de X",0.1,2,0.05,0.5)}${ctl("tf-l","λ",0.1,5,0.1,1)}</div><div class="res" id="tf-res"></div>${legend([["--line","Histograma de 20.000 simulaciones de Y"],["--exam","Densidad derivada f_Y(y)"]])}<div id="tf-p"></div><div id="tf-st"></div>`;
  let t="lin";const run=()=>{const k={a:V("tf-a")||1,b:V("tf-b"),mu:V("tf-mu"),s:V("tf-s"),lam:V("tf-l")},T=TR[t],rnd=E1.rng(12345),gauss=()=>{const u=rnd()||1e-12,v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
    const ys=[];for(let i=0;i<20000;i++){const x=T.x==="u"?(rnd()||1e-12):k.mu+k.s*gauss();ys.push(T.g(x,k))}const[lo,hi]=T.r(k),nb=40,w=(hi-lo)/nb,cnt=Array(nb).fill(0);ys.forEach(y=>{const i=Math.floor((y-lo)/w);if(i>=0&&i<nb)cnt[i]++});
    const dens=cnt.map(c=>c/(ys.length*w)),m=ys.reduce((s,v)=>s+v,0)/ys.length,v=ys.reduce((s,y)=>s+(y-m)**2,0)/(ys.length-1);let ym=Math.max(...dens);for(let i=1;i<=200;i++)ym=Math.max(ym,Math.min(T.f(lo+(hi-lo)*i/200,k),ym*1.5));
    $("tf-res").innerHTML=tiles([["Media simulada de Y",n4(m)],["Varianza simulada",n4(v)]]);
    const bars=dens.map((d,i)=>({pts:[[lo+i*w,0],[lo+i*w,d],[lo+(i+1)*w,d],[lo+(i+1)*w,0]],col:"--line",op:.3}));
    $("tf-p").innerHTML=plotXY({xr:[lo,hi],yr:[0,ym*1.1],areas:bars,series:[{f:y=>T.f(y,k),col:"--exam"}],xl:"y",yl:"densidad",label:"Transformación"});
    $("tf-st").innerHTML=stp(1,"Densidad de Y",`<div class="eq al">${T.txt(k)}</div><p class="hint">El histograma de las simulaciones coincide con la densidad que da el método del cambio de variable: f<sub>Y</sub>(y) = f<sub>X</sub>(g<sup>−1</sup>(y))·|dg<sup>−1</sup>/dy|.</p>`)+rbox(t==="lin"?`x <- rnorm(20000, ${k.mu}, ${k.s}); y <- ${k.a} * x + ${k.b}\nhist(y, freq = FALSE); curve(dnorm(x, ${n4(k.a*k.mu+k.b)}, ${n4(Math.abs(k.a)*k.s)}), add = TRUE)`:t==="cuad"?`x <- runif(20000); y <- x^2\nhist(y, freq = FALSE, breaks = 40); curve(1 / (2 * sqrt(x)), add = TRUE)`:t==="inv"?`u <- runif(20000); y <- -log(u) / ${k.lam}\nhist(y, freq = FALSE); curve(dexp(x, ${k.lam}), add = TRUE)`:`x <- rnorm(20000, ${k.mu}, ${k.s}); y <- exp(x)\nhist(y, freq = FALSE, breaks = 60); curve(dlnorm(x, ${k.mu}, ${k.s}), add = TRUE)`)};
  bindSeg("tf-t",v=>{t=v;run()});bindCtl(["tf-a","tf-b","tf-mu","tf-s","tf-l"],run);run()};

// ---------- 11. Funciones generadoras de momentos
const FG=[["binom","Binomial"],["pois","Poisson"],["geom","Geométrica"],["unif","Uniforme"],["norm","Normal"],["expo","Exponencial"],["gamma","Gamma"]];
const FPAR={binom:[["n","n",1,100,1,10],["p","p",0.01,0.99,0.01,0.3]],pois:[["lam","λ",0.1,30,0.1,3]],geom:[["p","p",0.05,0.99,0.01,0.3]],unif:[["a","a",-10,10,0.5,0],["b","b",-9,20,0.5,4]],norm:[["mu","μ",-10,10,0.1,2],["s","σ",0.1,10,0.1,1.5]],expo:[["lam","λ",0.1,10,0.1,2]],gamma:[["al","α",0.5,20,0.5,2],["be","β",0.1,10,0.1,3]]};
const FTXT={binom:P=>`(${fm(1-P.p)} + ${fm(P.p)}e<sup>t</sup>)<sup>${P.n}</sup>`,pois:P=>`e<sup>${fm(P.lam)}(e<sup>t</sup> − 1)</sup>`,geom:P=>`${fm(P.p)}e<sup>t</sup>/(1 − ${fm(1-P.p)}e<sup>t</sup>)`,unif:P=>`(e<sup>${fm(P.b)}t</sup> − e<sup>${fm(P.a)}t</sup>)/(${fm(P.b-P.a)}t)`,norm:P=>`e<sup>${fm(P.mu)}t + ${fm(P.s*P.s/2)}t²</sup>`,expo:P=>`${fm(P.lam)}/(${fm(P.lam)} − t)`,gamma:P=>`(1 − ${fm(P.be)}t)<sup>−${fm(P.al)}</sup>`};
const FMV={binom:P=>[P.n*P.p,P.n*P.p*(1-P.p)],pois:P=>[P.lam,P.lam],geom:P=>[1/P.p,(1-P.p)/(P.p*P.p)],unif:P=>[(P.a+P.b)/2,(P.b-P.a)**2/12],norm:P=>[P.mu,P.s*P.s],expo:P=>[1/P.lam,1/(P.lam*P.lam)],gamma:P=>[P.al*P.be,P.al*P.be*P.be]};
SIMS.fgm=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("fg-t","Distribución",FG,"pois")}</div><div class="ctr" id="fg-par"></div><div class="res" id="fg-res"></div><div id="fg-p"></div><div id="fg-st"></div>`;
  let d="pois";const mk=()=>{$("fg-par").innerHTML=FPAR[d].map(([k,l,a,b,s,v])=>ctl("fp-"+k,l,a,b,s,v)).join("");bindCtl(FPAR[d].map(x=>"fp-"+x[0]),run)};
  const run=()=>{const P={};FPAR[d].forEach(([k])=>P[k]=V("fp-"+k));if(!okAll(Object.values(P))||(d==="unif"&&P.b<=P.a))return;const M=E1.FGM[d](P),R=E1.momentosFGM(M),[mt,vt]=FMV[d](P);
    $("fg-res").innerHTML=tiles([["M′(0) = E(X)",n4(R.m1)],["M″(0) = E(X²)",n4(R.m2)],["V(X) = M″(0) − M′(0)²",n4(R.var)],["Fórmula: media y varianza",`${n4(mt)} y ${n4(vt)}`,"okt"]]);
    const lim=d==="expo"?P.lam*0.8:d==="gamma"?0.8/P.be:d==="geom"?-Math.log(1-P.p)*0.8:1;
    $("fg-p").innerHTML=plotXY({xr:[-lim,lim],yr:[0,Math.min(M(lim),50)*1.05],series:[{f:t=>M(t),col:"--line"},{f:t=>1+R.m1*t,col:"--exam",w:2,dash:"6 4"}],vlines:[{x:0}],points:[{x:0,y:1,label:"M(0) = 1"}],xl:"t",yl:"M(t)",label:"Función generadora de momentos"});
    $("fg-st").innerHTML=stp(1,"M(t)",`<div class="eq al">M(t) = E(e<sup>tX</sup>) = ${FTXT[d](P)}</div><p class="hint">La pendiente de M(t) en t = 0 es E(X) (recta punteada); la curvatura da E(X²).</p>`)+stp(2,"Momentos (derivadas numéricas en t = 0)",`<div class="eq al">E(X) = M′(0) ≈ [M(h) − M(−h)]/(2h) = <b>${n4(R.m1)}</b><br>E(X²) = M″(0) ≈ [M(h) − 2M(0) + M(−h)]/h² = <b>${n4(R.m2)}</b><br>V(X) = ${n4(R.m2)} − ${n4(R.m1)}² = <b>${n4(R.var)}</b> (fórmula exacta: ${n4(vt)})</div>`)};
  bindSeg("fg-t",v=>{d=v;mk();run()});mk();run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Descriptiva","Media","x̄ = Σxᵢ/n"],["Descriptiva","Varianza muestral","s² = Σ(xᵢ − x̄)²/(n − 1)"],["Descriptiva","Coeficiente de variación","CV = s/x̄"],["Descriptiva","Rango intercuartílico","RIC = Q₃ − Q₁; atípicos fuera de Q₁ − 1,5RIC y Q₃ + 1,5RIC"],["Descriptiva","Asimetría","g₁ = m₃/m₂^(3/2); Pearson 3(x̄ − Me)/s"],["Descriptiva","Sturges","k = 1 + 3,322 log₁₀ n"],["Descriptiva","Mediana agrupada","L + (n/2 − F)/f · w"],
    ["Conteo","Permutaciones","n!/(n − r)!"],["Conteo","Combinaciones","n!/(r!(n − r)!)"],["Conteo","Con objetos repetidos","n!/(n₁!n₂!…)"],["Conteo","Combinaciones con repetición","C(n + r − 1, r)"],
    ["Probabilidad","Unión","P(A ∪ B) = P(A) + P(B) − P(A ∩ B)"],["Probabilidad","Condicional","P(A | B) = P(A ∩ B)/P(B)"],["Probabilidad","Independencia","P(A ∩ B) = P(A)P(B)"],["Probabilidad","Probabilidad total","P(A) = Σ P(Bᵢ)P(A | Bᵢ)"],["Probabilidad","Bayes","P(Bᵣ | A) = P(Bᵣ)P(A | Bᵣ)/Σ P(Bᵢ)P(A | Bᵢ)"],
    ["Variables aleatorias","Continua","P(a < X < b) = ∫ f(x)dx = F(b) − F(a)"],["Conjunta","Marginal","p_X(x) = Σ_y p(x, y)"],["Conjunta","Covarianza","Cov = E(XY) − E(X)E(Y); ρ = Cov/(σ_X σ_Y)"],
    ["Esperanza","Varianza","V(X) = E(X²) − μ²"],["Esperanza","Combinación lineal","V(aX + bY) = a²V(X) + b²V(Y) + 2ab Cov"],["Esperanza","Chebyshev","P(|X − μ| < kσ) ≥ 1 − 1/k²"],
    ["Discretas","Binomial","C(n, x)pˣ(1 − p)ⁿ⁻ˣ; np; np(1 − p)"],["Discretas","Hipergeométrica","C(K, x)C(N − K, n − x)/C(N, n); nK/N"],["Discretas","Geométrica","(1 − p)ˣ⁻¹p; 1/p; (1 − p)/p²"],["Discretas","Binomial negativa","C(x − 1, r − 1)pʳ(1 − p)ˣ⁻ʳ; r/p"],["Discretas","Poisson","e^(−λ)λˣ/x!; λ; λ"],
    ["Continuas","Uniforme","1/(b − a); (a + b)/2; (b − a)²/12"],["Continuas","Normal","Z = (X − μ)/σ"],["Continuas","Exponencial","λe^(−λx); 1/λ; 1/λ²"],["Continuas","Gamma","αβ; αβ²"],["Aproximaciones","Normal a binomial","N(np, √(np(1 − p))) con corrección ±0,5"],
    ["Transformaciones","Cambio de variable","f_Y(y) = f_X(g⁻¹(y))·|dg⁻¹/dy|"],["Momentos","FGM","M(t) = E(e^(tX)); M⁽ᵏ⁾(0) = E(Xᵏ)"],["Momentos","Suma independiente","M_(X+Y)(t) = M_X(t)M_Y(t)"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Poisson"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
