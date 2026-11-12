// Historia del Pensamiento Económico · laboratorios interactivos
// ===================== LABORATORIOS DE HISTORIA DEL PENSAMIENTO ECONÓMICO =====================
const SIMS={};
let CLIP=0;
function plotXY({xr,yr,series=[],points=[],vlines=[],hlines=[],xl,yl,H=280,label}){
  const W=600,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/5)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl),id="hp"+(++CLIP);
  let b="";
  series.forEach(s=>{const pts=s.pts||[...Array(161)].map((_,i)=>{const x=xr[0]+(xr[1]-xr[0])*i/160;return[x,s.f(x)]});
    const d=pts.filter(([,y])=>isFinite(y)).map(([x,y],i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(Math.max(yr[0]-(yr[1]-yr[0]),Math.min(yr[1]+(yr[1]-yr[0]),y))).toFixed(1)).join("");
    b+=`<path d="${d}" fill="none" stroke="var(${s.col||"--ink"})" stroke-width="${s.w||2.5}" ${s.dash?`stroke-dasharray="${s.dash}"`:""}/>`;
    if(s.dots)pts.forEach(([x,y])=>{if(isFinite(y))b+=`<circle cx="${f.sx(x).toFixed(1)}" cy="${f.sy(y).toFixed(1)}" r="3" fill="var(${s.col||"--ink"})"/>`})});
  vlines.forEach(v=>b+=`<line x1="${f.sx(v.x)}" x2="${f.sx(v.x)}" y1="${f.sy(yr[0])}" y2="${f.sy(yr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  hlines.forEach(v=>b+=`<line y1="${f.sy(v.y)}" y2="${f.sy(v.y)}" x1="${f.sx(xr[0])}" x2="${f.sx(xr[1])}" stroke="var(${v.col||"--muted"})" stroke-width="${v.w||1.5}" stroke-dasharray="${v.dash||"5 4"}"/>`);
  let p="";points.forEach(q=>{if(!isFinite(q.x)||!isFinite(q.y))return;const x=f.sx(q.x),y=f.sy(q.y),anc=x>W*.7?"end":"start";
    p+=`<circle cx="${x}" cy="${y}" r="6" fill="var(${q.col||"--ink"})" stroke="var(--card)" stroke-width="2"/>${q.label?`<text x="${x+(anc==="end"?-9:9)}" y="${y-9}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${q.col||"--ink"})">${q.label}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfico"}"><defs><clipPath id="${id}"><rect x="${f.L}" y="${f.T}" width="${W-f.L-f.R}" height="${H-f.T-f.B}"/></clipPath></defs>${f.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const legend=items=>`<div class="legend">${items.map(([c,t,d])=>`<span><i style="background:var(${c})${d?";opacity:.55":""}"></i>${t}</span>`).join("")}</div>`;
const n0=v=>fmt(v,0),n2=v=>fmt(v,2),n3=v=>fmt(v,3),pc=v=>fmt(v*100,2)+" %";
const num=(id,label,val,step)=>`<label>${label}<input type="number" id="${id}" value="${val}" step="${step||"any"}" inputmode="decimal"></label>`;
const vals=ids=>ids.map(id=>parseFloat($(id).value));
const onAll=(root,run)=>{root.querySelectorAll("input,select,textarea").forEach(el=>el.addEventListener("input",run))};
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

// ---------- Repaso de conceptos (glosario y tarjetas)
SIMS.glos=function(){
  const lista=document.getElementById("glos-lista");
  if(lista){const caps=[...new Set(GLOS.map(g=>g[2]))];
    lista.innerHTML=caps.map(c=>`<details class="dp-lite"><summary><b>Capítulo ${c}</b> · ${GLOS.filter(g=>g[2]===c).length} conceptos</summary><dl class="glos">${GLOS.filter(g=>g[2]===c).map(g=>`<dt>${g[0]}</dt><dd>${g[1]}</dd>`).join("")}</dl></details>`).join("")}
  let u="0",ord=[],k=0,show=false;
  $("sim").innerHTML=`${seg("g-u","Unidad",[["0","Todas"],["1","Unidad 1"],["2","Unidad 2"],["3","Unidad 3"]],"0")}
  <div class="card-q" id="g-card" aria-live="polite"></div>
  <div class="chips pre"><button type="button" class="btn" id="g-rev">Revelar definición</button><button type="button" class="btn" id="g-next">Siguiente concepto</button></div>
  <p class="hint" id="g-pos"></p>`;
  const pool=()=>GLOS.filter(g=>u==="0"||String(g[3])===u);
  const shuffle=()=>{ord=pool().map((_,i)=>i);for(let i=ord.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ord[i],ord[j]]=[ord[j],ord[i]]}k=0;show=false};
  const draw=()=>{const P=pool(),g=P[ord[k]];$("g-card").innerHTML=`<p class="lbl">Capítulo ${g[2]} · Unidad ${g[3]}</p><p class="gq">${g[0]}</p>${show?`<p>${g[1]}</p>`:`<p class="hint">Escribe o di tu definición en dos líneas y luego revela la del libro.</p>`}`;
    $("g-pos").textContent=`Concepto ${k+1} de ${P.length}`;$("g-rev").disabled=show};
  bindSeg("g-u",v=>{u=v;shuffle();draw()});
  $("g-rev").onclick=()=>{show=true;draw()};
  $("g-next").onclick=()=>{k=(k+1)%ord.length;if(k===0)shuffle();show=false;draw()};
  shuffle();draw()};

// ---------- Mercantilismo: devaluación y mecanismo precio-flujo de Hume
SIMS.merc=function(){
  $("sim").innerHTML=`${seg("m-mode","Modo",[["dev","Devaluación (ejemplo del libro)"],["hume","Precio-flujo de Hume"]],"dev")}<div id="m-dev"></div><div id="m-hume" hidden></div>`;
  $("m-dev").innerHTML=`<div class="calcf">${num("m-g0","Gramos de oro por libra, antes",30)}${num("m-g1","Gramos de oro por libra, después",20)}${num("m-gf","Gramos de oro por franco",10)}${num("m-pb","Precio de la bufanda en libras",4)}</div><div class="res" id="m-res"></div><div id="m-txt"></div>`;
  $("m-hume").innerHTML=`<p class="hint">Dos países con la misma cantidad de oro al inicio. Inglaterra aplica la receta de Mun y arranca con una balanza positiva. Cada período: P = M·V/Q (teoría cuantitativa), la balanza depende del precio relativo y el saldo se paga con oro.</p>
  <div class="calcf">${num("h-m0","Oro inicial de Inglaterra",120)}${num("h-mf","Oro inicial de Francia",80)}${num("h-k","Sensibilidad de la balanza al precio relativo",40)}${num("h-T","Períodos",12,1)}</div><div id="h-plot"></div><div id="h-tab"></div><div id="h-txt"></div>`;
  const dev=()=>{const[g0,g1,gf,pb]=vals(["m-g0","m-g1","m-gf","m-pb"]);
    if(!(g0>0&&g1>0&&gf>0&&pb>0)){$("m-res").innerHTML="";$("m-txt").innerHTML=err("Todos los valores deben ser positivos.");return}
    const e0=g0/gf,e1=g1/gf,o0=pb*g0,o1=pb*g1,f0=pb*e0,f1=pb*e1,ch=(f1/f0-1)*100;
    $("m-res").innerHTML=tiles([["Tipo de cambio",`1 £ = ${fm(e0)} → ${fm(e1)} Fr`],["Oro en la bufanda",`${fm(o0)} g → ${fm(o1)} g`],["Precio para el francés",`${fm(f0)} → ${fm(f1)} Fr`],["Cambio para el extranjero",fmt(ch,1)+" %"]]);
    $("m-txt").innerHTML=`<div class="eq al chain">Tipo de cambio = ${fr("gramos por libra","gramos por franco")}: ${fr(fm(g0),fm(gf))} = ${fm(e0)} Fr antes y ${fr(fm(g1),fm(gf))} = ${fm(e1)} Fr después<br>Oro en la bufanda = ${fm(pb)} £ × gramos por libra = ${fm(o0)} g → ${fm(o1)} g</div>
    <p>${g1<g0?`El rey <b>devalúa</b> la libra: cada libra contiene menos oro. La bufanda sigue costando ${fm(pb)} £ en Inglaterra, pero para el comprador francés baja de ${fm(f0)} a ${fm(f1)} francos. Las exportaciones inglesas se abaratan y, según Mun, la balanza comercial mejora y entra oro.`:g1>g0?`El rey <b>revalúa</b> la libra: cada libra contiene más oro y las mercancías inglesas se encarecen para el extranjero. Las exportaciones caen.`:"Sin cambio en el contenido metálico."}</p>
    <p class="hint">Lo que Mun no ve: si entra oro, la cantidad de dinero aumenta y los precios internos suben (Bodin, Hume). Mira el modo «Precio-flujo de Hume».</p>`};
  const hume=()=>{const[m0,mf,k,T]=vals(["h-m0","h-mf","h-k","h-T"]);
    if(!(m0>0&&mf>0&&k>=0&&T>=1&&T<=60)){$("h-plot").innerHTML="";$("h-tab").innerHTML="";$("h-txt").innerHTML=err("El oro debe ser positivo, la sensibilidad no negativa y los períodos entre 1 y 60.");return}
    let Mi=m0,Mf=mf;const rows=[],tot=m0+mf;
    for(let t=0;t<=T;t++){const Pi=Mi/100,Pf=Mf/100,bc=Math.max(-Mi*0.9,Math.min(Mf*0.9,k*(Pf/Pi-1)));rows.push({t,Mi,Mf,Pi,Pf,bc});Mi+=bc;Mf-=bc}
    $("h-plot").innerHTML=plotXY({xr:[0,T],yr:[0,tot],xl:"Período",yl:"Oro",series:[{pts:rows.map(r=>[r.t,r.Mi]),col:"--line",dots:1},{pts:rows.map(r=>[r.t,r.Mf]),col:"--branch",dots:1}],label:"Oro de cada país"})+legend([["--line","Oro de Inglaterra"],["--branch","Oro de Francia"]]);
    $("h-tab").innerHTML=`<div class="tbl"><table><tr><th>t</th><th>Oro Inglaterra</th><th>Precios Inglaterra</th><th>Precios Francia</th><th>Balanza de Inglaterra</th></tr>${rows.slice(0,8).map(r=>`<tr><td>${r.t}</td><td class="num">${n2(r.Mi)}</td><td class="num">${n3(r.Pi)}</td><td class="num">${n3(r.Pf)}</td><td class="num">${n2(r.bc)}</td></tr>`).join("")}</table></div>`;
    const last=rows[rows.length-1];
    $("h-txt").innerHTML=`<p>${m0>mf?`Inglaterra empieza con más oro, así que sus precios son más altos (${n3(rows[0].Pi)} frente a ${n3(rows[0].Pf)}). Sus exportaciones son caras, la balanza es negativa y el oro sale hacia Francia.`:m0<mf?`Inglaterra empieza con menos oro y precios más bajos: exporta más, la balanza es positiva y entra oro. Pero con el oro suben sus precios.`:"Con el mismo oro y los mismos precios, la balanza está equilibrada."} Al final del período ${T} el oro se reparte ${n2(last.Mi)} y ${n2(last.Mf)}: los precios se igualan y la balanza tiende a cero.</p><p><b>Conclusión de Hume:</b> una balanza comercial positiva permanente es imposible, porque el mismo oro que entra eleva los precios y corrige el saldo. La política de Mun se derrota a sí misma.</p>`};
  bindSeg("m-mode",v=>{$("m-dev").hidden=v!=="dev";$("m-hume").hidden=v!=="hume"});
  onAll($("m-dev"),dev);onAll($("m-hume"),hume);dev();hume()};

// ---------- Smith: el ejemplo del vino y el queso
SIMS.smith=function(){
  $("sim").innerHTML=`<p class="hint">A tiene botellas de vino y B tiene quesos. Cada uno decide cuánto pone en venta; el precio se forma con lo que cada uno ofrece.</p>
  <div class="calcf">${num("s-wa","Botellas de vino de A",6,1)}${num("s-qb","Quesos de B",6,1)}${num("s-ow","Botellas que A pone en venta",2,1)}${num("s-oq","Quesos que B pone en venta",4,1)}</div><div class="res" id="s-res"></div><div id="s-txt"></div>`;
  const run=()=>{const[wa,qb,ow,oq]=vals(["s-wa","s-qb","s-ow","s-oq"]);
    if(!(ow>0&&oq>0&&ow<=wa&&oq<=qb)){$("s-res").innerHTML="";$("s-txt").innerHTML=err("Cada uno debe ofrecer una cantidad positiva y no mayor que lo que tiene.");return}
    const p=oq/ow,A=[wa-ow,oq],B=[ow,qb-oq];
    $("s-res").innerHTML=tiles([["Precio de equilibrio",`1 botella = ${fm(p)} quesos`],["A termina con",`${fm(A[0])} vinos y ${fm(A[1])} quesos`],["B termina con",`${fm(B[0])} vinos y ${fm(B[1])} quesos`]]);
    const tA=A[0]+A[1]/p,tB=B[0]+B[1]/p;
    $("s-txt").innerHTML=`<p>Es un <b>equilibrio</b>: cada uno entrega lo que quería entregar y recibe lo que buscaba. Ningún individuo tiene motivo para cambiar, la «coexistencia pacífica» de Machlup. Medido en botellas al precio formado, A tiene una riqueza de ${fm(tA)} y B de ${fm(tB)}.</p>
    <p>${Math.abs(ow-oq)>1e-9?`Un observador externo podría decir que el intercambio fue «injusto» porque los dos no pusieron en venta la misma cantidad; con ${fm(Math.min(ow,oq))} y ${fm(Math.min(ow,oq))} el precio habría sido 1 por 1. Pero ese es un <b>juicio ético</b> del investigador, no una propiedad del equilibrio: los precios solo asignan la riqueza disponible.`:"Los dos ofrecen lo mismo y el precio es 1 por 1: el caso que un observador llamaría «justo». Para la teoría, este equilibrio no es mejor ni peor que otro."}</p>`};
  onAll($("sim"),run);run()};

// ---------- Sraffa: precios de producción
const SR_PRE={
  dos:{n:2,A:[[0.2,0.3],[0.1,0.4]],l:[0.5,0.4],s:[0.3,0.2],nom:["Trigo","Hierro"]},
  tres:{n:3,A:[[0.2,0.1,0.1],[0.1,0.3,0.1],[0.1,0.1,0.2]],l:[0.6,0.4,0.5],s:[0.4,0.1,0.1],nom:["Trigo","Hierro","Carbón"]},
  igual:{n:2,A:[[0.3,0.4],[0.1,0.3]],l:[1,0.5],s:[0.2,0.3],nom:["Trigo","Hierro"]},
  sin:{n:2,A:[[0.5,0.3],[0.3,0.5]],l:[0.5,0.5],s:[0.3,0.2],nom:["Trigo","Hierro"]}};
SIMS.sraffa=function(){let pre="dos",cur=JSON.parse(JSON.stringify(SR_PRE.dos));
  $("sim").innerHTML=`<div class="chips pre" id="sr-pre">${[["dos","2 bienes"],["tres","3 bienes"],["igual","Composición igual (Ricardo)"],["sin","Sin excedente"]].map(([k,t])=>`<button type="button" data-k="${k}" aria-pressed="${k==="dos"}">${t}</button>`).join("")}</div><div id="sr-in"></div><div id="sr-out"></div>`;
  const build=()=>{const n=cur.n,ix=[...Array(n).keys()];
    $("sr-in").innerHTML=`<p class="hint">Cada fila es un sector: cuánto usa de cada bien y de trabajo por unidad producida. La canasta salarial es lo que recibe cada trabajador.</p>
    <div class="tbl"><table><tr><th>Sector</th>${ix.map(j=>`<th>usa ${cur.nom[j]} (a<sub>i${j+1}</sub>)</th>`).join("")}<th>Trabajo l<sub>i</sub></th></tr>
    ${ix.map(i=>`<tr><td>${cur.nom[i]}</td>${ix.map(j=>`<td><input class="cell" type="number" step="0.01" id="sr-a${i}${j}" value="${cur.A[i][j]}" aria-label="a${i+1}${j+1}"></td>`).join("")}<td><input class="cell" type="number" step="0.01" id="sr-l${i}" value="${cur.l[i]}" aria-label="l${i+1}"></td></tr>`).join("")}
    <tr><td><b>Canasta s</b></td>${ix.map(j=>`<td><input class="cell" type="number" step="0.01" id="sr-s${j}" value="${cur.s[j]}" aria-label="s${j+1}"></td>`).join("")}<td></td></tr></table></div>
    <div class="calcf"><label>Numerario<select id="sr-num">${ix.map(j=>`<option value="${j}" ${j===n-1?"selected":""}>${cur.nom[j]}</option>`).join("")}</select></label></div>`;
    onAll($("sr-in"),run);run()};
  const run=()=>{const n=cur.n,ix=[...Array(n).keys()];
    const A=ix.map(i=>ix.map(j=>parseFloat($(`sr-a${i}${j}`).value))),l=ix.map(i=>parseFloat($(`sr-l${i}`).value)),s=ix.map(j=>parseFloat($(`sr-s${j}`).value)),nm=+$("sr-num").value;
    if([...A.flat(),...l,...s].some(v=>!isFinite(v))){$("sr-out").innerHTML=err("Completa todas las celdas con números.");return}
    const R=HPE.sraffa(A,l,s,nm);
    const Bt=R.B?`<p><b>Paso 1. Matriz aumentada</b> B = A + l·s (insumos más la canasta salarial de los trabajadores):</p><div class="tbl"><table>${R.B.map((r,i)=>`<tr><td>${cur.nom[i]}</td>${r.map(v=>`<td class="num">${fmt(v,4)}</td>`).join("")}</tr>`).join("")}</table></div>`:"";
    if(R.err){$("sr-out").innerHTML=Bt+(R.lam>=1?`<p class="warn"><b>Sin excedente social.</b> El valor propio dominante de B es ${fmt(R.lam,4)}, mayor o igual que 1: la técnica y la canasta salarial consumen todo lo que se produce (o más). No existe una tasa de beneficio positiva; es la «economía de subsistencia» que el libro excluye. Baja algún coeficiente o la canasta para que haya excedente.</p>`:err(R.err));return}
    const V=HPE.valores(A,l),lam=V.lam,rel=ix.map(i=>R.p[i]/R.p[nm]),lrel=ix.map(i=>lam[i]/lam[nm]);
    const qEq=Math.max(...R.q)-Math.min(...R.q)<1e-6;
    // relación salario-beneficio: escalar la canasta por σ
    const curve=[];for(let k=0;k<=40;k++){const sg=k/40*2.5,Rk=HPE.sraffa(A,l,s.map(x=>x*sg),nm);if(!Rk.err)curve.push([sg,Rk.r*100])}
    const rmax=HPE.sraffa(A,l,s.map(()=>0),nm);
    $("sr-out").innerHTML=Bt+stp(2,"Valor propio dominante y tasa de beneficio",`<div class="eq al chain">λ* = ${fmt(R.lam,4)} &nbsp;(Perron-Frobenius: 0 &lt; λ* &lt; 1)<br>1 + r = 1/λ* ⇒ r = ${fr("1",fmt(R.lam,4))} − 1 = <b>${pc(R.r)}</b></div>`)
    +stp(3,"Precios relativos (vector propio)",`<div class="res">${tiles(ix.map(i=>[`p de ${cur.nom[i]}`,fmt(R.p[i],4)+(i===nm?" (numerario)":"")]))}${tiles([["Salario w = Σ sⱼpⱼ",fmt(R.w,4)]])}</div>`)
    +stp(4,"Comprobación: costo × (1 + r) = precio",`<div class="tbl"><table><tr><th>Sector</th><th>Insumos Σaᵢⱼpⱼ</th><th>Salarios lᵢw</th><th>Costo</th><th>Beneficio r·costo</th><th>Precio</th><th>Composición q</th></tr>${ix.map(i=>{const ins=R.costo[i]-l[i]*R.w;return`<tr><td>${cur.nom[i]}</td><td class="num">${fmt(ins,4)}</td><td class="num">${fmt(l[i]*R.w,4)}</td><td class="num">${fmt(R.costo[i],4)}</td><td class="num">${fmt(R.benef[i],4)}</td><td class="num">${fmt(R.p[i],4)}</td><td class="num">${fmt(R.q[i],3)}</td></tr>`}).join("")}</table></div>`)
    +stp(5,"¿Coinciden con el trabajo incorporado (Ricardo)?",V.err?err(V.err):`<p>Valores-trabajo λ = (I − A)⁻¹l: ${ix.map(i=>`${cur.nom[i]} ${fmt(lam[i],4)}`).join(", ")}.</p><div class="tbl"><table><tr><th>Bien</th><th>Precio relativo</th><th>Trabajo relativo</th></tr>${ix.map(i=>`<tr><td>${cur.nom[i]}</td><td class="num">${fmt(rel[i],4)}</td><td class="num">${fmt(lrel[i],4)}</td></tr>`).join("")}</table></div>
      <p>${qEq?`La composición del capital q es <b>igual</b> en todos los sectores (${fmt(R.q[0],3)}): los precios relativos son iguales a los cocientes de trabajo incorporado. Es el caso especial en que la teoría de Ricardo funciona.`:`La composición del capital q es <b>distinta</b> entre sectores, así que los precios relativos se apartan del trabajo incorporado: el sector con más medios de producción por trabajador necesita un precio mayor para pagar la misma tasa de beneficio sobre más capital. Por eso el trabajo incorporado no explica los precios en general.`}</p>`)
    +stp(6,"Relación salario-beneficio",`<p>Si la canasta salarial se multiplica por σ, la tasa de beneficio cambia: el conflicto distributivo clásico. Con salario cero la tasa es la máxima R = ${rmax.err?"—":pc(rmax.r)}.</p>${plotXY({xr:[0,2.5],yr:[0,Math.max(10,(rmax.err?50:rmax.r*100)*1.1)],xl:"Canasta salarial (× σ)",yl:"r (%)",series:[{pts:curve,col:"--line"}],points:[{x:1,y:R.r*100,label:"canasta actual",col:"--exam"}],label:"Relación salario-beneficio"})}<p class="hint">Si sube el salario real, baja la tasa de beneficio. La distribución es exógena: el sistema la toma como dato.</p>`)};
  $("sr-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;pre=b.dataset.k;cur=JSON.parse(JSON.stringify(SR_PRE[pre]));$("sr-pre").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));build()});
  build()};

// ---------- Gravitación (Boggio)
SIMS.grav=function(){
  $("sim").innerHTML=`<div class="calcf">${num("g-ps","Precio de producción p*",10)}${num("g-X","Demanda efectiva X",100)}${num("g-Y0","Oferta inicial Y₀ (tras el choque)",70)}${num("g-b","β (sensibilidad del precio)",0.1)}${num("g-mu","μ (velocidad del capital)",5)}${num("g-dt","Paso de ajuste Δt",0.5)}</div><div class="res" id="g-res"></div><div id="g-plot"></div><div id="g-txt"></div>`;
  const run=()=>{const[ps,X,Y0,b,mu,dt]=vals(["g-ps","g-X","g-Y0","g-b","g-mu","g-dt"]);
    if(!(ps>0&&X>0&&Y0>0&&b>0&&mu>0&&dt>0&&dt<=5)){$("g-res").innerHTML="";$("g-plot").innerHTML="";$("g-txt").innerHTML=err("Usa valores positivos y un paso Δt entre 0 y 5.");return}
    const T=Math.min(40,60*dt),out=HPE.gravitacion(ps,X,Y0,b,mu,T,dt),k=mu*b*dt,last=out[out.length-1];
    const ymin=Math.min(...out.map(o=>o.p),ps)-1,ymax=Math.max(...out.map(o=>o.p),ps)+1;
    $("g-res").innerHTML=tiles([["Factor de ajuste μβΔt",fmt(k,3)],["Precio inicial",fmt(out[0].p,3)],["Precio final",fmt(last.p,3)],["Oferta final",fmt(last.Y,2)]]);
    $("g-plot").innerHTML=plotXY({xr:[0,T],yr:[Math.max(-50,ymin),Math.min(ymax,ps*6)],xl:"Tiempo",yl:"Precio de mercado",series:[{pts:out.map(o=>[o.t,o.p]),col:"--line",dots:dt>=0.5}],hlines:[{y:ps,col:"--good"}],label:"Gravitación del precio de mercado"})+legend([["--line","Precio de mercado pₜ"],["--good","Precio de producción p*"]]);
    const verd=k<1?`El factor de ajuste es menor que 1: la oferta se acerca a la demanda sin pasarse y el precio converge <b>sin oscilar</b> al precio de producción. Es la estabilidad que busca la teoría clásica.`:k<2?`El factor está entre 1 y 2: el capital reacciona tanto que la oferta se pasa de la demanda. El precio <b>oscila</b> alrededor de p* pero converge.`:`El factor es mayor o igual que 2: el ajuste es tan brusco que las oscilaciones crecen y el precio <b>diverge</b>. La gravitación no garantiza la estabilidad.`;
    $("g-txt").innerHTML=`<div class="eq al chain">pₜ − p* = β(X − Yₜ) &nbsp;&nbsp; Yₜ₊Δₜ = Yₜ + μΔt(pₜ − p*) &nbsp;⇒&nbsp; X − Yₜ₊Δₜ = (1 − μβΔt)(X − Yₜ)</div><p>${Y0<X?"Tras el choque la oferta es escasa: el precio de mercado supera al de producción, el sector rinde más que el promedio y atrae capital.":Y0>X?"Tras el choque sobra oferta: el precio cae por debajo del de producción, el sector rinde menos y el capital sale.":"La oferta ya es igual a la demanda: no hay nada que ajustar."}</p><p>${verd}</p>`};
  onAll($("sim"),run);run()};

// ---------- Marx
SIMS.marx=function(){
  $("sim").innerHTML=`${seg("mx-mode","Modo",[["val","Valorización"],["lam","Valores-trabajo"],["tr","Transformación"]],"val")}<div id="mx-val"></div><div id="mx-lam" hidden></div><div id="mx-tr" hidden></div>`;
  $("mx-val").innerHTML=`<div class="calcf">${num("mv-C","Capital constante C (£)",150)}${num("mv-V","Capital variable V (£)",30)}${num("mv-e","Tasa de explotación e (%)",100)}</div><div class="res" id="mv-res"></div><div id="mv-txt"></div>`;
  $("mx-lam").innerHTML=`<p class="hint">Sociedad de artesanos con dos bienes: aᵢⱼ es lo que usa el bien i del bien j y Lᵢ el trabajo directo.</p><div class="calcf">${num("ml-a11","a₁₁",0.2)}${num("ml-a12","a₁₂",0.3)}${num("ml-a21","a₂₁",0.1)}${num("ml-a22","a₂₂",0.4)}${num("ml-L1","L₁ (horas)",0.5)}${num("ml-L2","L₂ (horas)",0.4)}</div><div id="ml-out"></div>`;
  $("mx-tr").innerHTML=`<div class="chips pre" id="mt-pre"><button type="button" data-k="bk">Bortkiewicz (225/90/60…)</button><button type="button" data-k="ue">Tasas de explotación distintas</button></div>
  <div class="tbl"><table><tr><th>Sector</th><th>C</th><th>V</th><th>S</th></tr>${["I. Medios de producción","II. Bienes salariales","III. Bienes de lujo (oro)"].map((t,i)=>`<tr><td>${t}</td>${["C","V","S"].map(k=>`<td><input class="cell" type="number" id="mt-${k}${i}" aria-label="${k}${i+1}"></td>`).join("")}</tr>`).join("")}</table></div><div id="mt-out"></div>`;
  const PRE={bk:[[225,100,50],[90,120,90],[60,80,60]],ue:[[225,100,50],[90,120,90],[60,60,80]]};
  const setPre=k=>{const[C,V,S]=PRE[k];[0,1,2].forEach(i=>{$(`mt-C${i}`).value=C[i];$(`mt-V${i}`).value=V[i];$(`mt-S${i}`).value=S[i]});tr()};
  const val=()=>{const[C,V,e]=vals(["mv-C","mv-V","mv-e"]);if(!(C>=0&&V>0&&e>=0)){$("mv-res").innerHTML="";$("mv-txt").innerHTML=err("C no negativo, V positivo y e no negativa.");return}
    const R=HPE.valorizacion(C,V,e/100);
    $("mv-res").innerHTML=tiles([["Plusvalía S = e·V",fm(R.S)+" £"],["Valor Y = C + V + S",fm(R.Y)+" £"],["Tasa de ganancia",fmt(R.r*100,2)+" %"],["Composición orgánica C/V",fm(C/V)]]);
    $("mv-txt").innerHTML=`<div class="eq al chain">D = C + V = ${fm(C)} + ${fm(V)} = ${fm(R.D)} £ &nbsp;→&nbsp; D′ = ${fm(R.Dp)} £<br>r = ${fr("S","C + V")} = ${fr(fm(R.S),fm(R.D))} = ${fmt(R.r*100,2)} %</div><p>El capitalista adelanta ${fm(R.D)} £ y recupera ${fm(R.Dp)} £: el ciclo D – M – D′. La diferencia la crea la fuerza de trabajo, que trabaja más horas de las necesarias para reproducir su propio valor. Fíjate que con la misma e, un sector con más capital constante tiene menor tasa de ganancia en valor: ese es el origen del problema de la transformación.</p>`};
  const lamf=()=>{const[a11,a12,a21,a22,L1,L2]=vals(["ml-a11","ml-a12","ml-a21","ml-a22","ml-L1","ml-L2"]);const R=HPE.valores([[a11,a12],[a21,a22]],[L1,L2]);
    if(R.err||!R.ok){$("ml-out").innerHTML=err(R.err||"Algún valor sale negativo: la técnica no es productiva (usa más de lo que produce).");return}
    const M=R.M;$("ml-out").innerHTML=`<div class="eq al chain">λ = Aλ + L &nbsp;⇒&nbsp; λ = (I − A)⁻¹L<br>(I − A)⁻¹ = [${fmt(M[0][0],4)}, ${fmt(M[0][1],4)}; ${fmt(M[1][0],4)}, ${fmt(M[1][1],4)}]<br>λ₁ = ${fmt(M[0][0],4)}·${fm(L1)} + ${fmt(M[0][1],4)}·${fm(L2)} = <b>${fmt(R.lam[0],4)}</b> horas<br>λ₂ = ${fmt(M[1][0],4)}·${fm(L1)} + ${fmt(M[1][1],4)}·${fm(L2)} = <b>${fmt(R.lam[1],4)}</b> horas</div><p>Cada unidad del bien 1 contiene ${fmt(R.lam[0],4)} horas de trabajo socialmente necesario: ${fm(L1)} directas y ${fmt(R.lam[0]-L1,4)} indirectas, incorporadas en los medios de producción. En la sociedad de artesanos los bienes se intercambian según estos valores: ${fmt(R.lam[0]/R.lam[1],4)} unidades del bien 2 por una del bien 1.</p>`};
  const tr=()=>{const C=[0,1,2].map(i=>parseFloat($(`mt-C${i}`).value)),V=[0,1,2].map(i=>parseFloat($(`mt-V${i}`).value)),S=[0,1,2].map(i=>parseFloat($(`mt-S${i}`).value));
    if([...C,...V,...S].some(v=>!(v>0))){$("mt-out").innerHTML=err("Todas las celdas deben ser positivas.");return}
    const R=HPE.transformacion(C,V,S);const e=S.map((s,i)=>s/V[i]),ue=Math.max(...e)-Math.min(...e)>1e-9;
    let warn="";if(ue)warn+=`<p class="warn"><b>Tasas de explotación distintas</b> (${e.map(x=>fmt(x*100,1)+" %").join(", ")}): la teoría supone e uniforme porque los trabajadores se mueven entre sectores. El cálculo sigue, pero no es el caso de Marx.</p>`;
    const Y=C.map((c,i)=>c+V[i]+S[i]);if(!(R.repro&&R.repro.c&&R.repro.v))warn+=`<p class="warn"><b>No hay reproducción simple:</b> la suma de C (${fm(C[0]+C[1]+C[2])}) debería ser igual al valor del sector I (${fm(Y[0])}) y la de V (${fm(V[0]+V[1]+V[2])}) al del sector II (${fm(Y[1])}).</p>`;
    if(R.err){$("mt-out").innerHTML=warn+err(R.err);return}
    const tv=Y[0]+Y[1]+Y[2];
    $("mt-out").innerHTML=warn+stp(1,"En valores: tasas de ganancia distintas",`<div class="tbl"><table><tr><th>Sector</th><th>Valor Y</th><th>e = S/V</th><th>S/(C + V)</th></tr>${[0,1,2].map(i=>`<tr><td>${["I","II","III"][i]}</td><td class="num">${fm(Y[i])}</td><td class="num">${fmt(e[i]*100,1)} %</td><td class="num">${fmt(R.rv[i]*100,2)} %</td></tr>`).join("")}</table></div><p>Con la misma tasa de explotación, las tasas de ganancia en valor difieren porque la composición C/V difiere. La competencia exige una tasa uniforme: hay que transformar.</p>`)
    +stp(2,"Transformadores (z = 1)",`<div class="eq al chain">(x·C₁ + y·V₁)(1 + r) = x·Y₁ &nbsp; (x·C₂ + y·V₂)(1 + r) = y·Y₂ &nbsp; (x·C₃ + y·V₃)(1 + r) = Y₃</div><div class="res">${tiles([["x (medios de producción)",fmt(R.x,4)],["y (bienes salariales)",fmt(R.y,4)],["z (lujo, numerario)","1"],["Tasa de beneficio uniforme",pc(R.r)]])}</div>`)
    +stp(3,"En precios de producción",`<div class="tbl"><table><tr><th>Sector</th><th>Costo x·C</th><th>Costo y·V</th><th>Beneficio</th><th>Precio</th><th>Valor</th></tr>${[0,1,2].map(i=>`<tr><td>${["I","II","III"][i]}</td><td class="num">${fm(R.PK[i])}</td><td class="num">${fm(R.PC[i])}</td><td class="num">${fm(R.B[i])}</td><td class="num">${fm(R.P[i])}</td><td class="num">${fm(Y[i])}</td></tr>`).join("")}<tr><td><b>Total</b></td><td></td><td></td><td class="num"><b>${fm(R.totB)}</b></td><td class="num"><b>${fm(R.totP)}</b></td><td class="num"><b>${fm(tv)}</b></td></tr></table></div>`)
    +stp(4,"Las dos igualdades de Marx",`<div class="res">${tiles([["Precio total = valor total",Math.abs(R.totP-tv)<1e-6?"Se cumple":`No: ${fm(R.totP)} ≠ ${fm(tv)}`],["Beneficio total = plusvalía total",Math.abs(R.totB-R.totS)<1e-6?"Se cumple":`No: ${fm(R.totB)} ≠ ${fm(R.totS)}`]])}</div><p>Con z = 1 el sector de lujo tiene precio igual a valor. Si se normalizara para igualar el precio total al valor total, se perdería la igualdad entre beneficio y plusvalía (salvo casos especiales). Esa es la conclusión del debate: la transformación existe, pero no conserva a la vez todas las propiedades del valor.</p>`)};
  bindSeg("mx-mode",v=>{$("mx-val").hidden=v!=="val";$("mx-lam").hidden=v!=="lam";$("mx-tr").hidden=v!=="tr"});
  $("mt-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setPre(b.dataset.k)});
  onAll($("mx-val"),val);onAll($("mx-lam"),lamf);onAll($("mx-tr"),tr);val();lamf();setPre("bk")};

// ---------- Walras: tanteo en una economía de intercambio
SIMS.walras=function(){
  $("sim").innerHTML=`<p class="hint">Dos consumidores con utilidad Cobb-Douglas U = x₁^α·x₂^(1−α) y dotaciones de los dos bienes. El bien 2 es el numerario (p₂ = 1). El subastador anuncia p₁, mide Z₁ y corrige: p₁ ← p₁ + k·Z₁.</p>
  <div class="calcf">${num("w-aA","α de A",0.5)}${num("w-aB","α de B",0.3)}${num("w-1A","Dotación de A en bien 1",10)}${num("w-2A","Dotación de A en bien 2",2)}${num("w-1B","Dotación de B en bien 1",2)}${num("w-2B","Dotación de B en bien 2",10)}${num("w-p0","Precio inicial anunciado p₁",3)}${num("w-k","Velocidad del subastador k",0.1)}</div>
  <div class="res" id="w-res"></div><div id="w-plot"></div><div id="w-tab"></div><div id="w-txt"></div>`;
  const run=()=>{const[aA,aB,x1A,x2A,x1B,x2B,p0,k]=vals(["w-aA","w-aB","w-1A","w-2A","w-1B","w-2B","w-p0","w-k"]);
    if(!(aA>0&&aA<1&&aB>0&&aB<1&&x1A>=0&&x2A>=0&&x1B>=0&&x2B>=0&&x1A+x1B>0&&x2A+x2B>0&&p0>0&&k>0)){["w-res","w-plot","w-tab"].forEach(i=>$(i).innerHTML="");$("w-txt").innerHTML=err("α entre 0 y 1, dotaciones no negativas (con algo de cada bien), p₁ y k positivos.");return}
    const W=HPE.walras([aA,aB],[x1A,x1B],[x2A,x2B]),path=HPE.tanteo(W.Z1,p0,k,25),last=path[path.length-1],ps=W.ps;
    const conv=Math.abs(last.p-ps)<0.01*ps,pmax=Math.max(ps*3,p0*1.3);
    $("w-res").innerHTML=tiles([["Precio de equilibrio p₁*",fmt(ps,4)],["A consume",`(${fmt(W.asign[0].x1,2)}, ${fmt(W.asign[0].x2,2)})`],["B consume",`(${fmt(W.asign[1].x1,2)}, ${fmt(W.asign[1].x2,2)})`],["Tanteo tras 25 rondas",fmt(last.p,4)+(conv?" ✓":"")]]);
    $("w-plot").innerHTML=plotXY({xr:[0,pmax],yr:[-Math.min(30,Math.abs(W.Z1(pmax))*1.5+2),Math.min(30,Math.abs(W.Z1(ps/3))+2)],xl:"Precio del bien 1 (p₁)",yl:"Z₁(p₁)",series:[{f:p=>p>0.02?W.Z1(p):NaN,col:"--line"}],hlines:[{y:0,col:"--muted",dash:"0"}],points:[{x:ps,y:0,label:"p*",col:"--good"},...path.slice(0,6).map((o,i)=>({x:o.p,y:o.z,label:i===0?"p₀":"",col:"--exam"}))],label:"Demanda excedente del bien 1"})+legend([["--line","Demanda excedente Z₁(p₁)"],["--exam","Rondas del subastador"]]);
    $("w-tab").innerHTML=`<div class="tbl"><table><tr><th>Ronda</th><th>p₁ anunciado</th><th>Z₁</th><th>Z₂</th><th>p₁Z₁ + Z₂ (ley de Walras)</th></tr>${path.slice(0,7).map(o=>{const z2=W.Z2(o.p);return`<tr><td>${o.t}</td><td class="num">${fmt(o.p,4)}</td><td class="num">${fmt(o.z,4)}</td><td class="num">${fmt(z2,4)}</td><td class="num">${fmt(o.p*o.z+z2,6)}</td></tr>`}).join("")}</table></div>`;
    $("w-txt").innerHTML=`<p>En cada ronda la última columna da cero: es la <b>ley de Walras</b>. Si el mercado del bien 1 se equilibra, el del bien 2 también, así que basta una ecuación para un precio relativo.</p><p>${p0>ps?"El precio anunciado es mayor que el de equilibrio: hay oferta excedente del bien 1 (Z₁ < 0) y el subastador lo baja.":p0<ps?"El precio anunciado es menor que el de equilibrio: hay demanda excedente del bien 1 (Z₁ > 0) y el subastador lo sube.":"El precio anunciado ya es el de equilibrio."} ${conv?"Con Cobb-Douglas los bienes son sustitutos brutos y el tanteo converge.":"Con esta velocidad el subastador todavía no llega: sube k o mira más rondas. Si k es muy grande, el ajuste discreto puede saltar de un lado al otro."}</p><p class="hint">Recuerda las críticas: nadie intercambia hasta que el subastador encuentra p*, y Scarf y Sonnenschein-Mantel-Debreu muestran economías en las que el tanteo no converge.</p>`};
  onAll($("sim"),run);run()};

// ---------- Cournot
SIMS.cournot=function(){
  $("sim").innerHTML=`<div class="calcf">${num("c-a","Intercepto de la demanda a",120)}${num("c-c","Costo marginal c",0)}${num("c-F","Costo fijo",200)}${num("c-q","Cuota del cartel por empresa",30)}</div><div id="c-out"></div>`;
  const run=()=>{const[a,c,F,qc]=vals(["c-a","c-c","c-F","c-q"]);if(!(a>c&&c>=0&&F>=0&&qc>0&&2*qc<a-c)){$("c-out").innerHTML=err("Se necesita a > c ≥ 0, costo fijo no negativo y una cuota positiva con 2·cuota < a − c.");return}
    const R=HPE.cournot(a,F,c,qc),pd=a-qc-R.qn,piD=(pd-c)*R.qn-F,piR=(pd-c)*qc-F,qm=(a-c)/2,pdB=a-qc-R.br(qc),piBR=(pdB-c)*R.br(qc)-F;
    $("c-out").innerHTML=stp(1,"Equilibrio de Nash (Cournot)",`<div class="eq al chain">Beneficio de A: (a − Y<sub>A</sub> − Y<sub>B</sub> − c)Y<sub>A</sub> − F &nbsp;⇒&nbsp; Y<sub>A</sub> = ${fr("a − c − Y<sub>B</sub>","2")} (función de reacción)<br>Por simetría: Y* = ${fr("a − c","3")} = <b>${fm(R.qn)}</b>, p = ${fm(R.pn)}, beneficio = <b>${fm(R.pin)}</b></div>`)
    +stp(2,"Cartel",`<p>Si cada empresa produce ${fm(qc)}, p = ${fm(R.pc)} y cada una gana <b>${fm(R.pic)}</b>${Math.abs(2*qc-qm)<1e-9?" (es la producción de monopolio repartida)":""}.</p>`)
    +stp(3,"El dilema",`<div class="tbl"><table><tr><th>A \\ B</th><th>Cumple (${fm(qc)})</th><th>Se desvía (${fm(R.qn)})</th></tr><tr><td>Cumple (${fm(qc)})</td><td class="num">${fm(R.pic)} ; ${fm(R.pic)}</td><td class="num">${fm(piR)} ; ${fm(piD)}</td></tr><tr><td>Se desvía (${fm(R.qn)})</td><td class="num">${fm(piD)} ; ${fm(piR)}</td><td class="num"><b>${fm(R.pin)} ; ${fm(R.pin)}</b></td></tr></table></div>
     <p>${piD>R.pic?`Desviarse es mejor para cada una, haga lo que haga la otra (${fm(piD)} > ${fm(R.pic)} y ${fm(R.pin)} > ${fm(piR)}): el resultado es el equilibrio de Nash, con ${fm(R.pin)} cada una, aunque las dos estarían mejor en el cartel. El equilibrio no es un óptimo de Pareto para las empresas.`:"Con esta cuota no hay incentivo a desviarse."} La mejor respuesta exacta a ${fm(qc)} es ${fm(R.br(qc))}, con un beneficio de ${fm(piBR)}.</p>`)
    +plotXY({xr:[0,a-c],yr:[0,a-c],xl:"Y_A",yl:"Y_B",series:[{f:x=>a-c-2*x,col:"--line"},{f:x=>R.br(x),col:"--branch"}],points:[{x:R.qn,y:R.qn,label:"Nash",col:"--exam"},{x:qc,y:qc,label:"Cartel",col:"--good"}],label:"Funciones de reacción"})+legend([["--line","Reacción de A"],["--branch","Reacción de B"]])};
  onAll($("sim"),run);run()};

// ---------- Keynes: eficiencia marginal del capital
SIMS.emk=function(){
  $("sim").innerHTML=`<div class="calcf">${num("k-V","Precio de oferta del bien de capital V₀",1000)}${num("k-pi","Rendimiento esperado por año π",250)}${num("k-n","Años de vida útil n",5,1)}${num("k-i","Tasa de interés i (%)",6)}</div><div class="res" id="k-res"></div><div id="k-plot"></div><div id="k-txt"></div>`;
  const pv=(pi,n,e)=>{let s=0;for(let t=1;t<=n;t++)s+=pi/(1+e)**t;return s};
  const run=()=>{const[V,pi,n,i]=vals(["k-V","k-pi","k-n","k-i"]);if(!(V>0&&pi>0&&n>=1&&n<=60&&Number.isInteger(n)&&i>-100)){$("k-res").innerHTML="";$("k-plot").innerHTML="";$("k-txt").innerHTML=err("V₀ y π positivos, n entero entre 1 y 60.");return}
    if(pi*n<=V){$("k-res").innerHTML="";$("k-plot").innerHTML="";$("k-txt").innerHTML=err(`Los rendimientos sin descontar (${fm(pi*n)}) no alcanzan a cubrir el costo: la eficiencia marginal es negativa y nadie invierte.`);return}
    let lo=0,hi=10;for(let k=0;k<200;k++){const m=(lo+hi)/2;if(pv(pi,n,m)>V)lo=m;else hi=m}const e=(lo+hi)/2,inv=e>i/100;
    $("k-res").innerHTML=tiles([["Eficiencia marginal e",pc(e)],["Tasa de interés i",fmt(i,2)+" %"],["Valor presente a la tasa i",fm(Math.round(pv(pi,n,i/100)))],["Decisión",inv?"Invertir":"No invertir"]]);
    $("k-plot").innerHTML=plotXY({xr:[0,Math.max(0.3,e*1.6)],yr:[0,pi*n*1.05],xl:"Tasa de descuento",yl:"Valor presente",series:[{f:r=>pv(pi,n,r),col:"--line"}],hlines:[{y:V,col:"--bad"}],vlines:[{x:i/100,col:"--branch"}],points:[{x:e,y:V,label:"e",col:"--good"}],label:"Eficiencia marginal del capital"})+legend([["--line","Σ π/(1 + r)ᵗ"],["--bad","Costo V₀"],["--branch","Tasa de interés"]]);
    $("k-txt").innerHTML=`<div class="eq al chain">${fm(V)} = ${[...Array(Math.min(n,3))].map((_,t)=>fr(fm(pi),`(1 + e)<sup>${t+1}</sup>`)).join(" + ")}${n>3?" + …":""} &nbsp;⇒&nbsp; e = ${pc(e)}</div><p>${inv?`Como e = ${pc(e)} supera a i = ${fmt(i,2)} %, el bien de capital rinde más que prestar el dinero: el empresario invierte.`:`Como e = ${pc(e)} no supera a i = ${fmt(i,2)} %, conviene más prestar el dinero: no se invierte.`}</p><p>Para Keynes, π son <b>expectativas</b>. Si los empresarios se vuelven pesimistas (baja π), e cae y la inversión se frena aunque el banco central baje i. Por eso la política monetaria puede no bastar y el Estado debe cooperar con la inversión.</p>`};
  onAll($("sim"),run);run()};

// ---------- Curva de Phillips: Friedman frente a Lucas
SIMS.phillips=function(){
  $("sim").innerHTML=`${seg("p-reg","Expectativas",[["adapt","Adaptativas (Friedman)"],["racional","Racionales (Lucas)"]],"adapt")}
  <div class="calcf">${num("p-Un","Tasa natural Uₙ (%)",5)}${num("p-h","Pendiente h",2)}${num("p-g","Corrección γ",0.5)}${num("p-pi0","Inflación inicial y esperada (%)",2)}${num("p-pit","Inflación que busca el banco central (%)",6)}${num("p-T","Períodos",8,1)}</div>
  <div id="p-plot"></div><div id="p-tab"></div><div id="p-txt"></div>`;
  let reg="adapt";
  const run=()=>{const[Un,h,g,pi0,pit,T]=vals(["p-Un","p-h","p-g","p-pi0","p-pit","p-T"]);if(!(Un>0&&h>0&&g>0&&g<=1&&T>=2&&T<=30)){["p-plot","p-tab"].forEach(i=>$(i).innerHTML="");$("p-txt").innerHTML=err("Uₙ y h positivos, γ entre 0 y 1 y entre 2 y 30 períodos.");return}
    const out=HPE.phillips({Un,h,gamma:g,pi0,piTarget:pit,T,regla:reg}),pmin=Math.min(0,pi0,pit)-1,pmax=Math.max(pi0,pit)+3,umin=Math.min(...out.map(o=>o.U),Un)-1,umax=Math.max(Un+4,...out.map(o=>o.U));
    const sr=pe=>({f:U=>pe-h*(U-Un),col:"--line",w:1.4,dash:"5 4"});
    $("p-plot").innerHTML=plotXY({xr:[Math.max(-2,umin),umax],yr:[pmin,pmax],xl:"Desempleo U (%)",yl:"Inflación π (%)",series:[sr(pi0),...(reg==="adapt"?[sr(out[out.length-1].pe)]:[]),{pts:out.map(o=>[o.U,o.pi]),col:"--exam",dots:1}],vlines:[{x:Un,col:"--good",dash:"0",w:2}],points:[{x:out[0].U,y:out[0].pi,label:"t = 0",col:"--exam"}],label:"Curva de Phillips"})+legend([["--line","Curvas de corto plazo"],["--good","Curva de largo plazo (vertical en Uₙ)"],["--exam","Trayectoria de la economía"]]);
    $("p-tab").innerHTML=`<div class="tbl"><table><tr><th>t</th><th>π esperada</th><th>π</th><th>U</th></tr>${out.map(o=>`<tr><td>${o.t}</td><td class="num">${fmt(o.pe,2)}</td><td class="num">${fmt(o.pi,2)}</td><td class="num">${fmt(o.U,2)}</td></tr>`).join("")}</table></div>`;
    $("p-txt").innerHTML=`<div class="eq al chain">πₜ = πᵉₜ − h(Uₜ − Uₙ)${reg==="adapt"?" &nbsp;&nbsp; πᵉₜ₊₁ = πᵉₜ + γ(πₜ − πᵉₜ)":" &nbsp;&nbsp; πᵉₜ = πₜ (política anunciada)"}</div>`+
      (reg==="adapt"?`<p>El banco central sube la inflación de ${fm(pi0)} % a ${fm(pit)} %. Al principio los trabajadores esperan ${fm(pi0)} %: el salario real cae, las empresas contratan más y el desempleo baja a ${fmt(out[0].U,2)} %. Cada período corrigen una fracción γ del error, la curva de corto plazo sube y el desempleo vuelve hacia la tasa natural de ${fm(Un)} %. <b>Friedman:</b> la política solo funciona mientras engaña; a largo plazo queda más inflación con el mismo desempleo.</p>`:`<p>Con expectativas racionales y una política anunciada, los agentes esperan desde el inicio ${fm(pit)} %. No hay error de expectativas, el salario real no cambia y el desempleo se queda en ${fm(Un)} %: la economía sube por la vertical. <b>Lucas:</b> solo una sorpresa monetaria movería el desempleo, y no de forma sistemática (superneutralidad).</p>`)};
  bindSeg("p-reg",v=>{reg=v;run()});onAll($("sim"),run);run()};

// ---------- Ensayo: estructura sugerida, borrador y lista de chequeo
SIMS.ensayo=function(){
  const K="hpe-ensayo-";let cur=ENSAYOS[0].id;
  $("sim").innerHTML=`<div class="calcf"><label>Tema<select id="e-tema">${ENSAYOS.map(e=>`<option value="${e.id}">Unidad ${e.u} · ${e.t}</option>`).join("")}</select></label></div>
  <div id="e-guia"></div>
  <div class="calcf e-form"><label>Título<input type="text" id="e-tit" spellcheck="true"></label>
  <label>Introducción (contexto + «El objetivo de este ensayo es…» + orden de las secciones)<textarea id="e-int" rows="5"></textarea></label>
  ${[1,2,3].map(k=>`<label>Sección ${k} (subtítulo en la primera línea)<textarea id="e-s${k}" rows="6"></textarea></label>`).join("")}
  <label>Conclusión<textarea id="e-con" rows="4"></textarea></label></div>
  <div class="chips pre"><button type="button" class="btn" id="e-plant">Llenar con la estructura sugerida</button><button type="button" class="btn" id="e-cp">Copiar ensayo</button></div>
  <div id="e-chk" aria-live="polite"></div>`;
  const F=["tit","int","s1","s2","s3","con"];
  const load=()=>{const raw=store.get(K+cur);let d={};try{d=raw?JSON.parse(raw):{}}catch(e){}F.forEach(f=>$("e-"+f).value=d[f]||"")};
  const save=()=>{const d={};F.forEach(f=>d[f]=$("e-"+f).value);store.set(K+cur,JSON.stringify(d))};
  const E=()=>ENSAYOS.find(e=>e.id===cur);
  const guia=()=>{const e=E();$("e-guia").innerHTML=`<div class="stepc"><h4>Estructura sugerida</h4><p><b>Título:</b> ${e.t}</p><p><b>Objetivo:</b> El objetivo de este ensayo es ${e.obj}.</p><ol>${e.sec.map(s=>`<li>${s}</li>`).join("")}</ol><p><b>Idea para la conclusión:</b> ${e.con}</p></div>`};
  const words=t=>(t.trim().match(/\S+/g)||[]).length;
  const check=()=>{const v=Object.fromEntries(F.map(f=>[f,$("e-"+f).value]));const tot=F.reduce((s,f)=>s+words(v[f]),0);
    const items=[[v.tit.trim().length>=8,"Tiene un título de al menos 8 caracteres"],[/objetivo/i.test(v.int),"La introducción enuncia el objetivo (usa la palabra «objetivo»)"],[words(v.int)>=40,"La introducción tiene al menos 40 palabras"],
      ...[1,2,3].map(k=>[words(v["s"+k])>=60&&v["s"+k].includes("\n"),`La sección ${k} tiene subtítulo y al menos 60 palabras`]),[words(v.con)>=30,"La conclusión tiene al menos 30 palabras"],[/objetivo|se mostró|se concluye|en conclusión|en síntesis/i.test(v.con),"La conclusión vuelve sobre el objetivo"]];
    const ok=items.filter(x=>x[0]).length;
    $("e-chk").innerHTML=`<h4 class="subh">Lista de chequeo · ${ok} de ${items.length} · ${tot} palabras</h4><ul class="chk">${items.map(([b,t])=>`<li>${b?"✓":"○"} ${t}</li>`).join("")}</ul>`};
  const text=()=>{const v=Object.fromEntries(F.map(f=>[f,$("e-"+f).value.trim()]));return[v.tit,"",v.int,"",v.s1,"",v.s2,"",v.s3,"","Conclusión",v.con].join("\n")};
  $("e-tema").onchange=()=>{cur=$("e-tema").value;guia();load();check()};
  $("e-plant").onclick=()=>{const e=E();if(!$("e-tit").value)$("e-tit").value=e.t;if(!$("e-int").value)$("e-int").value=`[Contexto en dos frases.] El objetivo de este ensayo es ${e.obj}. Para ello, primero se presenta… luego… y por último…`;
    [1,2,3].forEach(k=>{if(!$("e-s"+k).value)$("e-s"+k).value=`${k}. ${e.sec[k-1]}\n`});if(!$("e-con").value)$("e-con").value=`En conclusión, … ${e.con}`;save();check()};
  $("e-cp").onclick=()=>{const t=text();if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>{$("e-cp").textContent="Copiado"},()=>{});setTimeout(()=>{const b=$("e-cp");if(b)b.textContent="Copiar ensayo"},1500)};
  F.forEach(f=>$("e-"+f).addEventListener("input",()=>{save();check()}));
  guia();load();check()};

// Visuales de cambios de Historia del Pensamiento Económico, unidad 3 (usa el motor comun/visual.js)

// 1. Mercado de trabajo de la teoría Clásica (Pigou): Nᵈ = PMgN, Nˢ = desutilidad marginal, salario real rígido
VIS.add("pigou",{t:"Pigou: mercado de trabajo y salario real rígido",
  hint:"Arrastra la demanda de trabajo (productividad) o la oferta (preferencia por el ocio). Con «Salario real rígido» aparece una línea de salario que puedes subir o bajar.",
  opts:[{id:"w",lab:"Salario real",ch:[["flex","Flexible"],["rigido","Rígido"]],v:"flex",reset:false}],
  p0:{A:1,s:0,wr:1.6},lim:{A:[0.6,1.6],s:[-0.6,0.8],wr:[0.5,2.8]},
  presets:[["Salario mínimo alto",{wr:1.8},{w:"rigido"}],["Cae la productividad (salario flexible)",{A:0.8},{w:"flex"}],["Cae la productividad con salario rígido",{A:0.8,wr:1.26},{w:"rigido"}],["Más preferencia por el ocio",{s:0.4},{w:"flex"}],["Receta de Pigou: bajar el salario",{wr:1.3},{w:"rigido"}]],
  fit:{A:(x,y)=>y*Math.sqrt(Math.max(x,1))/10,s:(x,y)=>y-0.02*x,wr:(x,y)=>y},
  compute(st){const{A,s,wr}=st.p,rig=st.o.w==="rigido",Nd=a=>N=>a*10/Math.sqrt(N),Ns=z=>N=>0.02*N+z;
    const eq=(a,z)=>{let lo=0.5,hi=150;for(let k=0;k<80;k++){const m=(lo+hi)/2;if(Nd(a)(m)>Ns(z)(m))lo=m;else hi=m}const N=(lo+hi)/2;return{N,w:Ns(z)(N)}};
    const E0=eq(1,0),E1=eq(A,s),mA=Math.abs(A-1)>0.01,mS=Math.abs(s)>0.01;
    let Nemp=E1.N,wp=E1.w,U=0,Nsup=E1.N;
    if(rig&&wr>E1.w+1e-6){Nemp=(10*A/wr)**2;Nsup=(wr-s)/0.02;U=Nsup-Nemp;wp=wr}
    else if(rig){wp=wr;Nemp=Math.min((10*A/wr)**2,150);Nsup=(wr-s)/0.02}
    const curves=[{sh:VIS.fx(Nd(1)),col:"--line",dash:1,op:.55,lab:mA?"Nᵈ":""},{sh:VIS.fx(Ns(0)),col:"--branch",dash:1,op:.55,lab:mS?"Nˢ":""},
      {sh:VIS.fx(Nd(A)),col:"--line",lab:mA?"Nᵈ’":"Nᵈ = PMgN"},{sh:VIS.fx(Ns(s)),col:"--branch",lab:mS?"Nˢ’":"Nˢ = TMS"}];
    if(rig)curves.push({sh:VIS.hy(wr),col:"--exam",lab:"salario real rígido"});
    const pts=[{x:E0.N,y:E0.w,lab:"E₀"}];if(mA||mS)pts.push({x:E1.N,y:E1.w,lab:"E₁",col:"--good"});
    const segs=[];if(U>0.5){pts.push({x:Nemp,y:wr,lab:"Nᵈ",col:"--bad"},{x:Nsup,y:wr,lab:"Nˢ",col:"--bad"});segs.push({x1:Nemp,y1:wr-0.12,x2:Nsup,y2:wr-0.12,col:"--bad",w:3,lab:"desempleo involuntario"})}
    const handles=[{c:"A",x:20,y:Nd(A)(20),col:"--line",name:"la demanda de trabajo"},{c:"s",x:105,y:Ns(s)(105),col:"--branch",name:"la oferta de trabajo"}];
    if(rig)handles.push({c:"wr",x:8,y:wr,col:"--exam",name:"el salario real rígido"});
    const P={cap:"Mercado de trabajo de la teoría Clásica",xr:[0,120],yr:[0,3],xl:"Empleo N",yl:"Salario real w/p",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,2),curves,segs,pts,handles};
    let h;
    if(!mA&&!mS&&!(rig&&Math.abs(wr-E0.w)>0.02)){h=`<p>Todavía no hay cambios. Con salario flexible el mercado se equilibra en E₀: N = ${VIS.n(E0.N,1)} y w/p = ${VIS.n(E0.w,2)}. Quien no trabaja es porque no acepta ese salario real: el desempleo es <b>voluntario</b>. Elige «Rígido» o un choque.</p>`}
    else{const mv=[],cs=[];
      if(mA){mv.push(`La demanda de trabajo se desplazó <b>${A>1?"a la derecha":"a la izquierda"}</b>: la productividad marginal ${A>1?"subió":"bajó"}.`);cs.push(A>1?"Mejora técnica o más capital por trabajador (primer postulado: las empresas contratan hasta w/p = PMgN).":"Caída de la productividad o del capital (un choque de oferta).")}
      if(mS){mv.push(`La oferta de trabajo se desplazó <b>${s>0?"hacia arriba":"hacia abajo"}</b>.`);cs.push(s>0?"Los hogares valoran más el ocio: exigen un salario real mayor por cada hora (segundo postulado).":"Los hogares valoran menos el ocio o necesitan más ingreso.")}
      if(rig){mv.push(`El salario real está fijo en ${VIS.n(wr,2)}${wr>E1.w+0.01?`, por encima del de equilibrio (${VIS.n(E1.w,2)})`:wr<E1.w-0.01?`, por debajo del de equilibrio (${VIS.n(E1.w,2)})`:", igual al de equilibrio"}.`);cs.push(wr>E1.w?"Sindicatos que negocian salarios altos o un salario mínimo legal: los <b>fallos</b> del mercado de trabajo que señala Pigou.":"Un salario real fijado por debajo del equilibrio: las empresas quieren contratar más de lo que los trabajadores ofrecen.")}
      let m;
      if(U>0.5)m=`<p>Al salario ${VIS.n(wr,2)} las empresas solo contratan ${VIS.n(Nemp,1)} (donde la PMgN iguala al salario), mientras que ${VIS.n(Nsup,1)} personas quieren trabajar. La diferencia, <b>${VIS.n(U,1)}</b>, es desempleo involuntario. Como el salario no baja, el mercado no se equilibra.</p><p><b>Receta de Pigou:</b> flexibilizar el salario. Si baja hasta ${VIS.n(E1.w,2)}, el empleo sube a ${VIS.n(E1.N,1)} y el desempleo involuntario desaparece. <b>Keynes</b> responde que los trabajadores negocian salarios monetarios, no reales, y que una baja de salarios puede reducir la demanda y el empleo.</p>`;
      else if(rig&&wr<E1.w-0.01)m=`<p>Con el salario por debajo del equilibrio, las empresas quieren contratar más, pero solo se ofrecen ${VIS.n(Nsup,1)} trabajadores: el empleo lo limita la oferta y hay escasez de trabajo, no desempleo.</p>`;
      else m=`<p>Con salario flexible, el salario real se ajusta hasta igualar oferta y demanda en E₁: N = ${VIS.n(E1.N,1)} y w/p = ${VIS.n(E1.w,2)}. ${E1.N<E0.N?"El empleo baja, pero todo el desempleo adicional es <b>voluntario</b>: quien sale no acepta el nuevo salario.":"El empleo sube."} Es el pleno empleo de la teoría Clásica, garantizado por la ley de Say.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Empleo N",E0.N,Math.min(Nemp,Nsup),1),VIS.tile("Salario real w/p",E0.w,wp,2),["Desempleo involuntario",U>0.5?VIS.n(U,1):"0"]])}</div>`)}
    return{panels:[P],text:h}}});

// 2. Keynes: demanda efectiva con el diagrama de Weintraub, en unidades de salario
VIS.add("zd",{t:"Keynes: demanda efectiva (Z y D)",
  hint:"Arrastra la demanda agregada D (inversión esperada) o la oferta agregada Z (costos y productividad). Cambia la propensión a consumir.",
  opts:[{id:"c",lab:"Propensión marginal a consumir",ch:[["0.6","0,6"],["0.7","0,7"],["0.8","0,8"]],v:"0.7",reset:false}],
  p0:{I:20,k:0.006,w:1},lim:{I:[2,50],k:[0.002,0.015]},
  presets:[["Inversión pública (∆+I)",{I:30}],["Pesimismo empresarial (∆-I)",{I:12}],["Más ahorro: c = 0,6",{},{c:"0.6"}],["Baja del salario monetario",{w:0.8},{c:"0.7"}]],
  fit:{I:(x,y,st)=>y-(+st.o.c)*x,k:(x,y)=>(y-x)/(x*x)},
  compute(st){const c=+st.o.c,{I,k,w}=st.p,Ns=60,Z=kk=>N=>N+kk*N*N,D=(cc,ii)=>N=>cc*N+ii;
    const sol=(cc,ii,kk)=>(-(1-cc)+Math.sqrt((1-cc)**2+4*kk*ii))/(2*kk);
    const N0=sol(0.7,20,0.006),N1=sol(c,I,k),mI=Math.abs(I-20)>0.3,mK=Math.abs(k-0.006)>0.0002,mC=Math.abs(c-0.7)>0.01,mW=Math.abs(w-1)>0.01,mv=mI||mK||mC;
    const Ne=Math.min(N1,Ns);
    const curves=[{sh:VIS.fx(Z(0.006)),col:"--branch",dash:1,op:.55,lab:mK?"Z":""},{sh:VIS.fx(D(0.7,20)),col:"--line",dash:1,op:.55,lab:(mI||mC)?"D":""},
      {sh:VIS.fx(Z(k)),col:"--branch",lab:mK?"Z’ = φ(N)":"Z = φ(N)"},{sh:VIS.fx(D(c,I)),col:"--line",lab:(mI||mC)?"D’ = C(N) + I":"D = C(N) + I"},{sh:VIS.vx(Ns),col:"--good",lab:"N* pleno empleo",w:1.6}];
    const pts=[{x:N0,y:Z(0.006)(N0),lab:"E**"}];if(mv)pts.push({x:N1,y:Z(k)(N1),lab:"E**’",col:"--exam"});
    const segs=[];if(Ne<Ns-0.5)segs.push({x1:Ne,y1:6,x2:Ns,y2:6,col:"--bad",w:3,lab:"desempleo involuntario"});
    const P={cap:"Diagrama de Weintraub (en unidades de salario)",xr:[0,80],yr:[0,120],xl:"Empleo N",yl:"Z, D",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"I",x:72,y:D(c,I)(72),col:"--line",name:"la demanda agregada"},{c:"k",x:45,y:Z(k)(45),col:"--branch",name:"la oferta agregada"}]};
    let h;
    if(!mv&&!mW)h=`<p>Todavía no hay cambios. La demanda efectiva está en E**, con N** = ${VIS.n(N0,1)}, por debajo del pleno empleo N* = ${Ns}. Hay ${VIS.n(Ns-N0,1)} de desempleo involuntario <b>en equilibrio</b>: los empresarios no tienen razón para contratar más porque no esperan vender más. Arrastra D o prueba un choque.</p>`;
    else if(mW&&!mv)h=VIS.sec("Qué cambió",VIS.list([`El salario monetario bajó ${VIS.n((1-w)*100,0)} %.`]))+VIS.sec("Qué pudo haberlo causado",VIS.list(["Desempleo alto que presiona los salarios a la baja, o una política de flexibilización: la receta de Pigou."]))
      +VIS.sec("Mecanismo",`<p>Medidas en unidades de salario, como en la <i>Teoría general</i>, Z y D <b>no se mueven</b>: los costos bajan, pero el ingreso de los trabajadores y su consumo también, y los precios caen en proporción. El empleo sigue en N** = ${VIS.n(N0,1)}.</p><p>La baja de salarios solo ayudaría si cambia otra cosa: si baja la tasa de interés (más dinero real) y sube la inversión. Pero también puede empeorar las expectativas o aumentar el peso real de las deudas, y entonces D cae. Por eso Keynes rechaza la flexibilidad salarial como remedio.</p>`)
      +VIS.sec("Resultado",`<div class="res">${tiles([["Empleo N**",VIS.n(N0,1)+" (igual)"],["Desempleo involuntario",VIS.n(Ns-N0,1)+" (igual)"]])}</div>`);
    else{const mvl=[],cs=[];
      if(mI){mvl.push(`La demanda agregada se desplazó <b>${I>20?"hacia arriba":"hacia abajo"}</b>: la inversión esperada pasó de 20 a ${VIS.n(I,1)}.`);cs.push(I>20?"Más inversión pública o privada: el Estado coopera con la inversión, o mejora la eficiencia marginal del capital.":"Expectativas pesimistas: la eficiencia marginal del capital cae por debajo de la tasa de interés.")}
      if(mC){mvl.push(`La pendiente de D cambió: la propensión marginal a consumir es ${VIS.n(c,1)}.`);cs.push(c<0.7?"Los hogares ahorran una fracción mayor de su ingreso (la paradoja del ahorro).":"Los hogares consumen una fracción mayor de su ingreso.")}
      if(mK){mvl.push(`La oferta agregada se desplazó <b>${k>0.006?"hacia arriba":"hacia abajo"}</b>.`);cs.push(k>0.006?"Los rendimientos decrecientes se vuelven más fuertes: cada trabajador adicional produce menos y los empresarios necesitan esperar más ingreso para contratarlo.":"Mejora la productividad: se necesita menos ingreso esperado para contratar.")}
      const gap=N1>Ns;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))
        +VIS.sec("Mecanismo",`<p>En el empleo inicial ${VIS.n(N0,1)}, ahora D ${D(c,I)(N0)>Z(k)(N0)?"supera a":"queda por debajo de"} Z: los empresarios esperan vender ${D(c,I)(N0)>Z(k)(N0)?"más":"menos"} de lo que necesitan para cubrir costos y ${D(c,I)(N0)>Z(k)(N0)?"contratan más":"despiden"} trabajadores. Como la propensión a consumir es menor que 1, D crece más despacio que Z y el ajuste se detiene en el nuevo corte. ${gap?`La demanda alcanza para más que el pleno empleo: el empleo queda en N* y el exceso presiona los precios.`:`La demanda determina la producción: la antiley de Say.`}</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Empleo N**",N0,Ne,1),VIS.tile("Desempleo involuntario",Ns-N0,Math.max(0,Ns-N1),1)])}</div><p>${Ne<Ns-0.5?"Sigue habiendo desempleo involuntario de equilibrio: nada en el mercado lo corrige por sí solo.":"Se alcanza el pleno empleo: el caso particular de la teoría general."}</p>`)}
    return{panels:[P],text:h}}});

// 3. Hicks (1937): IS-LM con la LM clásica, la trampa de la liquidez y el caso general
VIS.add("hicks",{t:"Hicks: IS-LM, caso clásico, trampa de la liquidez y caso general",
  hint:"Escoge el modelo de Hicks y arrastra la IS (gasto autónomo) o la LM (cantidad de dinero) para ver qué política funciona en cada uno.",
  opts:[{id:"lm",lab:"Modelo de Hicks",ch:[["clasico","I. Clásico (M = kY)"],["trampa","II. Teoría especial (trampa)"],["general","III-IV. General"]],v:"general"}],
  p0:{dA:0,dM:0},lim:{dA:[-100,100],dM:[-150,150]},
  presets:[["Expansión fiscal (∆+G)",{dA:40}],["Expansión monetaria (∆+M)",{dM:80}],["Cae la inversión (pesimismo)",{dA:-50}]],
  fit:{dA:(x,y)=>(x+40*y-1000)/4,dM:(x,y,st)=>st.o.lm==="clasico"?0.5*x-400:st.o.lm==="trampa"?0.5*x-20*y-340:0.5*x-20*y-300},
  compute(st){const md=st.o.lm,{dA,dM}=st.p,IS=a=>Y=>(1000+4*a-Y)/40;
    const LMf=m=>md==="general"?(Y=>(0.5*Y-300-m)/20):md==="trampa"?(Y=>Math.max(5,(0.5*Y-340-m)/20)):null;
    const eq=(a,m)=>{if(md==="clasico"){const Y=800+2*m;return{Y,i:IS(a)(Y)}}
      if(md==="general"){const Y=800+2*a+m;return{Y,i:IS(a)(Y)}}
      const Yf=800+4*a;if(Yf<=880+2*m)return{Y:Yf,i:5};const Y=840+2*a+m;return{Y,i:IS(a)(Y)}};
    const E0=eq(0,0),E1=eq(dA,dM),mF=Math.abs(dA)>0.5,mM=Math.abs(dM)>0.5,mv=mF||mM;
    const lmSh=m=>md==="clasico"?VIS.vx(800+2*m):VIS.fx(LMf(m));
    const curves=[{sh:VIS.fx(IS(0)),col:"--line",dash:1,op:.55,lab:mF?"IS":""},{sh:lmSh(0),col:"--branch",dash:1,op:.55,lab:mM?"LM":""},{sh:VIS.fx(IS(dA)),col:"--line",lab:mF?"IS’":"IS"},{sh:lmSh(dM),col:"--branch",lab:mM?"LM’":"LM"}];
    const pts=[{x:E0.Y,y:E0.i,lab:"0"}];if(mv)pts.push({x:E1.Y,y:E1.i,lab:"1",col:"--good"});
    const hLM=md==="clasico"?{x:800+2*dM,y:9}:md==="trampa"?{x:1000,y:LMf(dM)(1000)}:{x:950,y:LMf(dM)(950)};
    const P={cap:{clasico:"Modelo I (clásico): LM vertical",trampa:"Modelo II (teoría especial): trampa de la liquidez",general:"Modelos III y IV: LM con pendiente positiva"}[md],xr:[400,1200],yr:[0,12],xl:"Producto Y",yl:"Tasa de interés i (%)",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,pts,
      handles:[{c:"dA",x:600+4*dA,y:10,col:"--line",name:"la IS"},{c:"dM",x:hLM.x,y:hLM.y,col:"--branch",name:"la LM"}]};
    const lect={clasico:"La demanda de dinero solo depende del ingreso (M = kY, teoría cuantitativa de Cambridge). El producto lo fija el dinero: la política monetaria mueve Y y la fiscal solo sube la tasa de interés (desplazamiento total de la inversión privada).",
      trampa:"Con la tasa en su mínimo, la gente atesora todo el dinero adicional (M = L(i) infinitamente elástica). La política monetaria no baja la tasa ni mueve Y; la fiscal tiene todo el multiplicador, sin desplazamiento. Es lo que Hicks llama la teoría «especial» de Keynes.",
      general:"La demanda de dinero depende del ingreso y de la tasa: las dos políticas mueven Y, la fiscal con desplazamiento parcial de la inversión. Es el modelo de la síntesis neoclásica."}[md];
    let h;if(!mv)h=`<p>Todavía no hay cambios. ${lect} Equilibrio inicial: Y = ${VIS.n(E0.Y,0)}, i = ${VIS.n(E0.i,1)} %. Arrastra una curva o prueba un choque.</p>`;
    else{const mvl=[],cs=[];if(mF){mvl.push(`La IS se desplazó <b>${dA>0?"a la derecha":"a la izquierda"}</b> (gasto autónomo ${dA>0?"+":"−"}${VIS.n(Math.abs(dA),0)}).`);cs.push(dA>0?"Más gasto público o menos impuestos (política fiscal expansiva), o más inversión autónoma.":"Cae la inversión por expectativas pesimistas, o política fiscal contractiva.")}
      if(mM){mvl.push(`La LM se desplazó <b>${dM>0?"a la derecha":"a la izquierda"}</b> (cantidad de dinero ${dM>0?"+":"−"}${VIS.n(Math.abs(dM),0)}).`);cs.push(dM>0?"El banco central aumenta la oferta monetaria.":"El banco central reduce la oferta monetaria.")}
      const dY=E1.Y-E0.Y;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",`<p>${lect}</p><p>${mF&&!mM?(Math.abs(dY)<1?"El cambio del gasto no mueve el producto: toda la expansión se va en la tasa de interés.":`Con el multiplicador simple (4) el producto cambiaría ${VIS.n(4*dA,0)}; aquí cambia ${VIS.n(dY,0)}${Math.abs(dY-4*dA)>1?" porque la tasa de interés sube y desplaza parte de la inversión":" porque la tasa no se mueve"}.`):mM&&!mF?(Math.abs(dY)<1?"El dinero adicional no mueve el producto: la tasa no puede bajar más.":`La tasa de interés ${E1.i<E0.i?"baja":"sube"}, la inversión ${E1.i<E0.i?"aumenta":"cae"} y el producto cambia ${VIS.n(dY,0)}.`):`El producto cambia ${VIS.n(dY,0)} en total.`}</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producto Y",E0.Y,E1.Y,0),VIS.tile("Tasa de interés i",E0.i,E1.i,1," %")])}</div>`)}
    return{panels:[P],text:h}}});

// 4. Curva de Phillips: Samuelson-Solow, Friedman y Lucas
VIS.add("phillips",{t:"Curva de Phillips: Samuelson-Solow, Friedman y Lucas",
  hint:"Arrastra el punto de la economía a lo largo de la curva de corto plazo, o desplaza la curva entera (inflación esperada). Cambia la lectura teórica.",
  opts:[{id:"reg",lab:"Lectura",ch:[["ss","Samuelson-Solow"],["fr","Friedman"],["lu","Lucas"]],v:"fr",reset:false}],
  p0:{pe:2,U:5},lim:{pe:[-2,8],U:[1,10]},
  presets:[["Expansión monetaria: U baja a 3 %",{U:3}],["Las expectativas se ajustan",{U:5,pe:4}],["Estanflación (choque de oferta)",{pe:6,U:7}],["Desinflación: U sube a 7 %",{U:7}]],
  fit:{U:(x)=>x,pe:(x,y)=>y+(x-5)},
  compute(st){const r=st.o.reg,{pe,U}=st.p,Un=5,SR=e=>u=>e-(u-Un),pi=SR(pe)(U),mP=Math.abs(pe-2)>0.05,mU=Math.abs(U-Un)>0.05,mv=mP||mU;
    const curves=[{sh:VIS.fx(SR(2)),col:"--line",dash:1,op:.55,lab:mP?"CP (πᵉ = 2 %)":""},{sh:VIS.fx(SR(pe)),col:"--line",lab:r==="ss"?"curva de Phillips":`CP corto plazo (πᵉ = ${VIS.n(pe,1)} %)`}];
    if(r!=="ss")curves.push({sh:VIS.vx(Un),col:"--good",lab:"largo plazo (Uₙ)",w:2});
    const pts=[{x:Un,y:2,lab:"0"}];if(mv)pts.push({x:U,y:pi,lab:"1",col:"--exam"});if(r==="fr"&&mU)pts.push({x:Un,y:pi,lab:"2",col:"--good"});
    const segs=[];if(r==="fr"&&mU)segs.push({x1:U,y1:pi,x2:Un,y2:pi,col:"--muted",dash:1,arrow:1});
    const P={cap:"Inflación y desempleo",xr:[0,10],yr:[-4,12],xl:"Desempleo U (%)",yl:"Inflación π (%)",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"U",x:U,y:pi,col:"--exam",name:"la posición de la economía"},{c:"pe",x:1,y:SR(pe)(1),col:"--line",name:"la curva de corto plazo"}]};
    let h;
    if(!mv)h=`<p>Todavía no hay cambios. La economía está en la tasa natural Uₙ = ${Un} % con inflación de 2 %, igual a la esperada. ${r==="ss"?"Para Samuelson y Solow la curva es un menú estable: se puede escoger otro punto.":r==="fr"?"Para Friedman, a corto plazo hay una curva para cada inflación esperada; a largo plazo la curva es vertical en Uₙ.":"Para Lucas, con expectativas racionales solo las sorpresas sacan a la economía de Uₙ."}</p>`;
    else{const mvl=[],cs=[];
      if(mU)mvl.push(`La economía se movió a lo largo de la curva: U = ${VIS.n(U,1)} % y π = ${VIS.n(pi,1)} %.`);
      if(mP)mvl.push(`La curva de corto plazo se desplazó <b>${pe>2?"hacia arriba":"hacia abajo"}</b>: la inflación esperada es ${VIS.n(pe,1)} %.`);
      if(mU)cs.push(U<Un?"Una política monetaria o fiscal expansiva aumenta la demanda.":"Una política contractiva (desinflación) reduce la demanda.");
      if(mP)cs.push(pe>2?"Los agentes esperan más inflación: por experiencia pasada (adaptativas) o por un choque de oferta como el del petróleo en los setenta.":"Los agentes esperan menos inflación: el banco central ganó credibilidad.");
      let m;
      if(r==="ss")m=`<p>La curva es un <b>menú de política</b>: menos desempleo a cambio de más inflación. ${mP?"Un desplazamiento de la curva no tiene lugar en esta lectura: la estanflación de los setenta, con más inflación y más desempleo a la vez, fue justamente lo que la derrumbó.":"El gobierno puede quedarse en el punto 1 de forma permanente."}</p>`;
      else if(r==="fr")m=mU&&pi>pe?`<p>La inflación (${VIS.n(pi,1)} %) supera a la esperada (${VIS.n(pe,1)} %): los trabajadores aceptan un salario real menor sin saberlo y las empresas contratan más. Con <b>expectativas adaptativas</b> corrigen el error: πᵉ sube, la curva de corto plazo se desplaza hacia arriba y el desempleo vuelve a ${Un} % (punto 2) con una inflación de ${VIS.n(pi,1)} %. Mantener U por debajo de Uₙ exige inflación cada vez mayor (aceleracionismo).</p>`
        :mU&&pi<pe?`<p>La inflación (${VIS.n(pi,1)} %) es menor que la esperada (${VIS.n(pe,1)} %): el salario real sube sin que nadie lo planee y el desempleo aumenta. Cuando las expectativas bajan, la curva desciende y el desempleo vuelve a ${Un} % con menos inflación: es el costo transitorio de la desinflación.</p>`
        :`<p>La inflación es igual a la esperada: la economía está sobre la vertical de largo plazo. ${mP?"Con más inflación esperada, el mismo desempleo natural convive con más inflación.":""}</p>`;
      else m=mU?`<p>Con <b>expectativas racionales</b>, una política anunciada se anticipa: los agentes elevan πᵉ en la misma medida y la economía sube por la vertical sin moverse de Uₙ. Llegar al punto 1 (U = ${VIS.n(U,1)} %) solo es posible con una <b>sorpresa</b> de ${VIS.n(pi-pe,1)} puntos, que no se puede repetir de forma sistemática: es la superneutralidad. Por la crítica de Lucas, la pendiente estimada de esta curva cambiaría con la política.</p>`:`<p>La curva de corto plazo se movió con las expectativas y la economía se quedó en Uₙ: la política anticipada solo cambia la inflación.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Desempleo U",Un,U,1," %"),VIS.tile("Inflación π",2,pi,1," %"),VIS.tile("Inflación esperada",2,pe,1," %")])}</div>`)}
    return{panels:[P],text:h}}});


// ===================== TALLER: POSTULADOS DE TODAS LAS ESCUELAS =====================
SIMS.postulados=function(){
  const E=Object.entries(POSTULADOS),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  $("sim").innerHTML=`<div style="margin-bottom:10px">${seg("po-m","Modo",[["ver","Ver por escuela"],["cmp","Comparar dos escuelas"],["quiz","¿De qué escuela es?"]],"ver")}</div><div id="po-o"></div>`;
  const sel=(id,v)=>`<select id="${id}" style="font:inherit;padding:6px 10px;border-radius:8px;max-width:100%">${E.map(([k,P])=>`<option value="${k}"${k===v?" selected":""}>${esc(P.esc)}</option>`).join("")}</select>`;
  const lista=k=>{const P=POSTULADOS[k];return`<h4 style="margin:8px 0 2px">${esc(P.esc)}</h4><p class="hint" style="margin:0 0 8px">${esc(P.obra)}</p><ol style="padding-left:1.3em;margin:0">${P.p.map(([n,d])=>`<li style="margin-bottom:6px"><b>${esc(n)}.</b> ${esc(d)}</li>`).join("")}</ol>${P.h?`<p class="hint" style="margin:8px 0 4px">Además (no son postulados):</p><ul style="padding-left:1.3em;margin:0">${P.h.map(([n,d])=>`<li style="margin-bottom:6px"><b>${esc(n)}.</b> ${esc(d)}</li>`).join("")}</ul>`:""}`};
  let score=0,tot=0,cur=null;
  const M={
    ver(){$("po-o").innerHTML=`<label>Escuela: ${sel("po-a","smith")}</label><div id="po-l"></div>`;const r=()=>$("po-l").innerHTML=lista($("po-a").value);$("po-a").onchange=r;r()},
    cmp(){$("po-o").innerHTML=`<div class="calcf"><label>Escuela A ${sel("po-a","pigou")}</label><label>Escuela B ${sel("po-b","keynes")}</label></div><div class="grid2" id="po-l"></div><p class="hint">Para la tabla de tres diferencias del parcial: elige un criterio (qué es la riqueza o el valor, cómo se determina el empleo, papel del Estado, del dinero o de la competencia) y compara el postulado de cada escuela sobre ese criterio, no frases sueltas.</p>`;
      const r=()=>$("po-l").innerHTML=`<div>${lista($("po-a").value)}</div><div>${lista($("po-b").value)}</div>`;$("po-a").onchange=r;$("po-b").onchange=r;r()},
    quiz(){score=0;tot=0;$("po-o").innerHTML=`<div class="res" id="po-s"></div><div id="po-q"></div>`;nueva()}};
  const nueva=()=>{const all=E.flatMap(([k,P])=>P.p.map(p=>({k,n:p[0],d:p[1]})));let q;do{q=all[Math.floor(Math.random()*all.length)]}while(cur&&q.n===cur.n);cur=q;
    const otras=E.map(e=>e[0]).filter(k=>k!==q.k).sort(()=>Math.random()-.5).slice(0,3),ops=[q.k,...otras].sort(()=>Math.random()-.5);
    $("po-s").innerHTML=tiles([["Aciertos",`${score} de ${tot}`]]);
    $("po-q").innerHTML=`<p style="font-size:1.05em"><b>«${esc(q.n.replace(/^([A-D]|Postulado \d) · /,""))}»</b><br>${esc(q.d)}</p><div class="chips" id="po-c">${ops.map(k=>`<button type="button" data-k="${k}">${esc(POSTULADOS[k].esc)}</button>`).join("")}</div><div id="po-f"></div>`;
    $("po-c").onclick=e=>{const b=e.target.closest("button");if(!b||$("po-c").dataset.done)return;$("po-c").dataset.done=1;tot++;const ok=b.dataset.k===q.k;if(ok)score++;
      $("po-c").querySelectorAll("button").forEach(x=>{if(x.dataset.k===q.k)x.setAttribute("aria-pressed","true")});
      $("po-s").innerHTML=tiles([["Aciertos",`${score} de ${tot}`,ok?"okt":"badt"]]);
      $("po-f").innerHTML=`<p>${ok?"<b>¡Correcto!</b>":`<b>No.</b> Es de ${esc(POSTULADOS[q.k].esc)}.`} <span class="hint">${esc(POSTULADOS[q.k].obra)}</span></p><button type="button" class="btn" id="po-n">Siguiente</button>`;$("po-n").onclick=nueva}};
  bindSeg("po-m",k=>M[k]());M.ver()};
