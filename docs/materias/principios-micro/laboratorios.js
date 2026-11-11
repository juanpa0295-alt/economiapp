// Principios de Microeconomía · laboratorios interactivos
// ===================== LABORATORIOS DE PRINCIPIOS DE MICROECONOMÍA =====================
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

// ---------- utilidad compartida por las herramientas del consumidor
const UT=[["cd","Cobb-Douglas"],["sust","Sustitutos perfectos"],["comp","Complementarios"],["quasi","Cuasilineal"],["ces","CES"]];
const UFORM={cd:u=>`u = x₁<sup>${fm(u.a)}</sup> x₂<sup>${fm(u.b)}</sup>`,sust:u=>`u = ${fm(u.a)}x₁ + ${fm(u.b)}x₂`,comp:u=>`u = mín{${fm(u.a)}x₁, ${fm(u.b)}x₂}`,quasi:u=>`u = ${fm(u.a)} ln x₁ + x₂`,ces:u=>`u = (${fm(u.a)}x₁<sup>${fm(u.rho)}</sup> + ${fm(u.b)}x₂<sup>${fm(u.rho)}</sup>)<sup>1/${fm(u.rho)}</sup>`};
function utilBox(p,def="cd"){return`<div style="margin:4px 0 8px">${seg(p+"-t","Preferencias",UT,def)}</div><div class="ctr">${ctl(p+"-a","a",0.1,20,0.1,1)}${ctl(p+"-b","b",0.1,20,0.1,1)}<span id="${p}-wr">${ctl(p+"-r","ρ (CES, menor que 1 y distinto de 0)",-5,0.95,0.05,0.5)}</span></div>`}
function utilRead(p,st){const u={tipo:st.t,a:V(p+"-a"),b:V(p+"-b"),rho:V(p+"-r")};if(u.tipo==="ces"&&Math.abs(u.rho)<0.02)u.rho=0.02;$(p+"-wr").hidden=u.tipo!=="ces";return u}
function utilBind(p,st,run){bindSeg(p+"-t",v=>{st.t=v;if(v==="quasi"&&V(p+"-a")<5){$(p+"-a").value=10;$(p+"-a-r").value=10}run()});bindCtl([p+"-a",p+"-b",p+"-r"],run)}
// curva de indiferencia lista para plotXY
function indSeries(u,v,xmax,ymax,col,dash){if(u.tipo==="comp"){const x0=v/u.a,y0=v/u.b;return{pts:[[x0,ymax*3],[x0,y0],[xmax*3,y0]],col,dash,w:2}}return{f:x=>MI.ind(u,v,x),col,dash,w:2}}

// ---------- 1. Mercado de apartamentos (Varian, cap. 1)
SIMS.aptos=function(){
  $("sim").innerHTML=`<div class="calcf"><label for="ap-r">Precios de reserva (uno por persona)<input id="ap-r" value="500, 480, 450, 420, 400, 380, 350, 300"></label>${nin("ap-s","Apartamentos disponibles (oferta fija)",5)}${nin("ap-c","Precio máximo (control de alquileres, 0 = sin control)",0)}</div>
  <div class="res" id="ap-res"></div>${legend([["--line","Demanda (precios de reserva)"],["--branch","Oferta fija"]])}<div id="ap-p"></div><div id="ap-st"></div>`;
  const run=()=>{const r=($("ap-r").value.match(/\d+(?:[.,]\d+)?/g)||[]).map(x=>+x.replace(",",".")).filter(x=>x>0).sort((a,b)=>b-a),S=Math.round(N("ap-s")),C=N("ap-c")||0;
    if(r.length<2||!(S>=1)){$("ap-res").innerHTML=err("escribe al menos dos precios de reserva y una oferta de 1 o más.");return}
    const n=r.length,pe=S<n?r[S]:0,quien=r.slice(0,Math.min(S,n));let mono={p:0,n:0,I:0};for(let k=1;k<=Math.min(S,n);k++){const I=r[k-1]*k;if(I>mono.I)mono={p:r[k-1],n:k,I}}
    const ctrl=C>0&&C<pe?{dem:r.filter(x=>x>=C).length}:null;
    $("ap-res").innerHTML=tiles([["Precio de equilibrio",S<n?`${fm(pe)} (o apenas más)`:"0: sobran apartamentos"],["Alquilan",String(quien.length)],["Monopolista: precio",`${fm(mono.p)} (alquila ${mono.n})`],...(ctrl?[["Con el control",`${ctrl.dem} quieren, ${S} consiguen`,"badt"]]:[])]);
    const ymax=r[0]*1.15,pts=[];r.forEach((v,i)=>{pts.push([i,v],[i+1,v])});pts.push([n,0]);
    $("ap-p").innerHTML=plotXY({xr:[0,n+1],yr:[0,ymax],series:[{pts,col:"--line"},{pts:[[S,0],[S,ymax*2]],col:"--branch"}],hlines:[{y:pe},...(ctrl?[{y:C,col:"--bad",dash:"0"}]:[])],points:S<n?[{x:S,y:pe,label:"E"}]:[],xl:"cantidad de apartamentos",yl:"precio",label:"Mercado de apartamentos"});
    $("ap-st").innerHTML=stp(1,"Cómo se lee",`<p>Ordenados de mayor a menor: ${r.map((v,i)=>i<S?`<b>${fm(v)}</b>`:fm(v)).join(", ")}. Con ${S} apartamentos, el precio de equilibrio es el precio de reserva de la persona ${S+1} (${S<n?fm(pe):"no existe"}): a ese precio solo ${Math.min(S,n)} personas quieren alquilar, las de los precios en negrita.</p><p><b>Monopolista ordinario</b> (un solo dueño que cobra a todos lo mismo): escoge el precio que maximiza el ingreso entre los precios de reserva: ${r.slice(0,Math.min(S,n)).map((v,i)=>`${fm(v)} × ${i+1} = ${fm(v*(i+1))}`).join("; ")}. Le conviene ${fm(mono.p)}${mono.n<S?` y dejar ${S-mono.n} apartamentos vacíos`:""}.</p>${ctrl?`<p><b>Control de alquileres</b> a ${fm(C)}: ${ctrl.dem} personas quieren apartamento y solo hay ${S}; quién lo consigue ya no depende de cuánto lo valora, así que el resultado deja de ser eficiente.</p>`:""}`)};
  onIn(["ap-r","ap-s","ap-c"],run);run()};

// ---------- 2. Herramientas matemáticas
SIMS.mate=function(){
  $("sim").innerHTML=tabsBox("ma",[["clas","Clasificador de funciones"],["lag","Lagrange paso a paso"]]);const B=$("ma-b");
  tabsRun("ma",{
   clas(){B.innerHTML=`<div style="margin-bottom:8px">${seg("mc-t","Función",[["cd","A·x^a·y^b"],["ces","CES"],["lin","Lineal"],["leon","Leontief"],["quasi","a ln x + y"]],"cd")}</div><div class="ctr">${ctl("mc-A","A",0.1,10,0.1,1)}${ctl("mc-a","a",0.05,3,0.05,0.5)}${ctl("mc-b","b",0.05,3,0.05,0.5)}${ctl("mc-r","ρ (CES)",-5,0.95,0.05,0.5)}${ctl("mc-h","Grado h (CES: (·)^(h/ρ))",0.2,3,0.1,1)}</div><div id="mc-o"></div>`;
    let t="cd";const run=()=>{const A=V("mc-A"),a=V("mc-a"),b=V("mc-b"),r=Math.abs(V("mc-r"))<0.02?0.02:V("mc-r"),h=V("mc-h");let rows;
      if(t==="cd")rows=[["Función",`f = ${fm(A)}·x<sup>${fm(a)}</sup>y<sup>${fm(b)}</sup>`],["Homogénea",`sí, de grado a + b = <b>${fm(a+b)}</b> (${a+b>1?"rendimientos crecientes":a+b<1?"decrecientes":"constantes"})`],["Homotética","sí"],["Cóncava",a+b<=1?"sí (a + b ≤ 1)":"no (a + b > 1)"],["Cuasicóncava","sí (a, b > 0)"],["Tasa de sustitución",`f<sub>x</sub>/f<sub>y</sub> = ${fm(a)}y/(${fm(b)}x): depende solo de y/x`],["Euler",`x f<sub>x</sub> + y f<sub>y</sub> = (a + b) f = ${fm(a+b)} f`]];
      else if(t==="ces")rows=[["Función",`f = ${fm(A)}(${fm(a)}x<sup>${fm(r)}</sup> + ${fm(b)}y<sup>${fm(r)}</sup>)<sup>${fm(h)}/${fm(r)}</sup>`],["Homogénea",`sí, de grado <b>${fm(h)}</b>`],["Homotética","sí"],["Cóncava",h<=1?"sí (h ≤ 1 y ρ ≤ 1)":"no (h > 1)"],["Cuasicóncava","sí (ρ ≤ 1)"],["Elasticidad de sustitución",`σ = 1/(1 − ρ) = <b>${fmt(1/(1-r),3)}</b>`],["Tasa de sustitución",`(${fm(a)}/${fm(b)})(x/y)<sup>ρ−1</sup>`]];
      else if(t==="lin")rows=[["Función",`f = ${fm(A)}(${fm(a)}x + ${fm(b)}y)`],["Homogénea","sí, de grado 1"],["Homotética","sí"],["Cóncava","sí (y convexa: es lineal)"],["Cuasicóncava","sí"],["Tasa de sustitución",`${fm(a)}/${fm(b)}, constante (σ = ∞)`]];
      else if(t==="leon")rows=[["Función",`f = ${fm(A)}·mín{x/${fm(a)}, y/${fm(b)}}`],["Homogénea","sí, de grado 1"],["Homotética","sí"],["Cóncava","sí"],["Cuasicóncava","sí"],["Tasa de sustitución","no está definida en el vértice (σ = 0)"]];
      else rows=[["Función",`f = ${fm(a)} ln x + y`],["Homogénea","no"],["Homotética","no: la tasa de sustitución a/x no depende de y/x"],["Cóncava","sí (a > 0)"],["Cuasicóncava","sí"],["Tasa de sustitución",`${fm(a)}/x`]];
      $("mc-o").innerHTML=`<div class="tbl"><table>${rows.map(([k,v])=>`<tr><td><b>${k}</b></td><td>${v}</td></tr>`).join("")}</table></div><p class="hint">Prueba de homogeneidad: se multiplica cada variable por t y se ve si sale t<sup>k</sup> como factor. Por ejemplo f(2x, 2y) = 2<sup>${t==="cd"?fm(a+b):t==="ces"?fm(h):"1"}</sup>·f(x, y)${t==="quasi"?" no se cumple aquí: a ln(2x) + 2y no es un múltiplo de f":""}.</p>`};
    bindSeg("mc-t",v=>{t=v;run()});bindCtl(["mc-A","mc-a","mc-b","mc-r","mc-h"],run);run()},
   lag(){B.innerHTML=`<p class="hint">Máx f = x<sup>a</sup>y<sup>b</sup> sujeto a p<sub>x</sub>x + p<sub>y</sub>y = m. Comprueba el teorema de la envolvente: λ es la derivada del valor óptimo respecto a m.</p><div class="ctr">${ctl("ml-a","a",0.1,3,0.05,0.5)}${ctl("ml-b","b",0.1,3,0.05,0.5)}${ctl("ml-px","pₓ",0.5,20,0.5,2)}${ctl("ml-py","p_y",0.5,20,0.5,4)}${ctl("ml-m","m",10,1000,10,100)}</div><div class="res" id="ml-res"></div><div id="ml-st"></div>`;
    const run=()=>{const a=V("ml-a"),b=V("ml-b"),px=V("ml-px"),py=V("ml-py"),m=V("ml-m");if(!okAll([a,b,px,py,m]))return;const u={tipo:"cd",a,b},d=MI.dem(u,px,py,m),Vm=MI.U(u,d.x1,d.x2),lam=a*Vm/(d.x1*px),h=0.01,dV=(MI.V(u,px,py,m+h)-MI.V(u,px,py,m-h))/(2*h);
      $("ml-res").innerHTML=tiles([["x*",n4(d.x1)],["y*",n4(d.x2)],["f máximo",n4(Vm)],["λ",n4(lam)]]);
      $("ml-st").innerHTML=stp(1,"Lagrangiano y CPO",`<div class="eq al">ℒ = x<sup>${fm(a)}</sup>y<sup>${fm(b)}</sup> + λ(${fm(m)} − ${fm(px)}x − ${fm(py)}y)<br>∂ℒ/∂x: ${fm(a)}x<sup>${fm(a-1)}</sup>y<sup>${fm(b)}</sup> = ${fm(px)}λ<br>∂ℒ/∂y: ${fm(b)}x<sup>${fm(a)}</sup>y<sup>${fm(b-1)}</sup> = ${fm(py)}λ<br>∂ℒ/∂λ: ${fm(px)}x + ${fm(py)}y = ${fm(m)}</div>`)
        +stp(2,"Solución",`<div class="eq al">Dividiendo las dos primeras: ${fm(a)}y/(${fm(b)}x) = ${fm(px)}/${fm(py)} ⟹ ${fm(py)}y = ${fmt(b/a,4)}·${fm(px)}x<br>En la restricción: x* = ${fr(fm(a),fm(a)+" + "+fm(b))}·${fr(fm(m),fm(px))} = <b>${n4(d.x1)}</b>, y* = ${fr(fm(b),fm(a)+" + "+fm(b))}·${fr(fm(m),fm(py))} = <b>${n4(d.x2)}</b><br>λ = ${fm(a)}·f/(x·p<sub>x</sub>) = <b>${n4(lam)}</b></div>`)
        +stp(3,"Envolvente",`<div class="eq al">dV/dm (numérica) = [V(m + 0,01) − V(m − 0,01)]/0,02 = <b>${n4(dV)}</b> ≈ λ = ${n4(lam)}</div><p class="hint">El valor óptimo sube λ por cada unidad adicional de ingreso. ${Math.abs(a+b-1)<1e-9?"Con a + b = 1, λ = f/m.":""}</p>`)};
    bindCtl(["ml-a","ml-b","ml-px","ml-py","ml-m"],run);run()}})};

// ---------- 3. Restricción presupuestaria
SIMS.pres=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("pr-p1","Precio del bien 1 (p₁)",0.5,20,0.5,2)}${ctl("pr-p2","Precio del bien 2 (p₂)",0.5,20,0.5,4)}${ctl("pr-m","Ingreso (m)",10,500,5,100)}</div>
  <div style="margin:6px 0">${seg("pr-pol","Política sobre el bien 1",[["no","Ninguna"],["tc","Impuesto por unidad"],["tv","Impuesto ad valorem"],["sub","Subsidio por unidad"],["tl","Impuesto de suma fija"],["rac","Racionamiento"]],"no")}</div><div class="ctr" id="pr-wv">${ctl("pr-v","Valor de la política",0,100,0.5,1)}</div>
  <div class="res" id="pr-res"></div>${legend([["--muted","Recta inicial",1],["--line","Recta con la política"]])}<div id="pr-p"></div><div id="pr-st"></div>`;
  let pol="no";const run=()=>{const p1=V("pr-p1"),p2=V("pr-p2"),m=V("pr-m"),v=V("pr-v");$("pr-wv").hidden=pol==="no";if(!okAll([p1,p2,m,v]))return;
    const o={p1,p2,m};if(pol==="tc")o.tc=v;if(pol==="tv")o.tv=v/100;if(pol==="sub")o.sub=v;if(pol==="tl")o.tl=v;if(pol==="rac")o.rac=v;const B0=MI.presupuesto({p1,p2,m}),B=MI.presupuesto(o);
    $("pr-res").innerHTML=tiles([["Máximo de x₁",n2(B.x1max)],["Máximo de x₂",n2(B.x2max)],["Pendiente",n4(B.pend)],["Precio efectivo de x₁",n2(B.p1e)]]);
    const xm=Math.max(B0.x1max,B.me/B.p1e)*1.15,ym=Math.max(B0.x2max,B.x2max)*1.15,line=(pp,mm,cap)=>x=>x<=(cap??Infinity)?(mm-pp*x)/p2:NaN;
    $("pr-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:line(p1,m),col:"--muted",dash:"6 5",w:2},{f:line(B.p1e,B.me,pol==="rac"?v:null),col:"--line"},...(pol==="rac"&&v<B.me/B.p1e?[{pts:[[v,0],[v,(B.me-B.p1e*v)/p2]],col:"--line"}]:[])],xl:"x₁",yl:"x₂",label:"Recta presupuestaria"});
    const lbl={no:"Sin política",tc:`Impuesto de ${fm(v)} por unidad: p₁ pasa a ${fm(p1)} + ${fm(v)} = ${n2(B.p1e)}. La recta gira sobre el intercepto vertical.`,tv:`Impuesto ad valorem de ${fm(v)} %: p₁ pasa a ${fm(p1)} × ${fmt(1+v/100,2)} = ${n2(B.p1e)}.`,sub:`Subsidio de ${fm(v)} por unidad: p₁ pasa a ${n2(B.p1e)}. La recta se aplana.`,tl:`Impuesto de suma fija de ${fm(v)}: el ingreso pasa a ${n2(B.me)}. Desplazamiento paralelo.`,rac:`Racionamiento: no se pueden comprar más de ${fm(v)} unidades de x₁. El conjunto se corta con una vertical.`}[pol];
    $("pr-st").innerHTML=stp(1,"Recta",`<div class="eq al">${n2(B.p1e)}x₁ + ${fm(p2)}x₂ = ${n2(B.me)} ⟹ x₂ = ${n2(B.me/p2)} − ${n4(B.p1e/p2)}x₁</div><p>${lbl}</p><p class="hint">Costo de oportunidad: una unidad más de x₁ cuesta ${n4(B.p1e/p2)} unidades de x₂.</p>`)};
  bindCtl(["pr-p1","pr-p2","pr-m","pr-v"],run);bindSeg("pr-pol",x=>{pol=x;run()});run()};

// ---------- 4. Preferencias
SIMS.pref=function(){
  $("sim").innerHTML=`${utilBox("pf")}<div class="ctr">${ctl("pf-x","Canasta: x₁",0.5,30,0.5,5)}${ctl("pf-y","Canasta: x₂",0.5,30,0.5,5)}</div><div class="res" id="pf-res"></div>${legend([["--line","Curva de la canasta"],["--muted","Otras curvas de indiferencia"]])}<div id="pf-p"></div><div id="pf-st"></div>`;
  const st={t:"cd"};const run=()=>{const u=utilRead("pf",st),x=V("pf-x"),y=V("pf-y");if(!okAll([u.a,u.b,x,y]))return;const v=MI.U(u,x,y),[u1,u2]=MI.UMg(u,x,y),T=MI.TMS(u,x,y);
    $("pf-res").innerHTML=tiles([["Utilidad",n4(v)],["UMg₁",n4(u1)],["UMg₂",n4(u2)],["TMS = UMg₁/UMg₂",u.tipo==="comp"?(Math.abs(u.a*x-u.b*y)<1e-9?"no definida (vértice)":u.a*x<u.b*y?"∞ (tramo vertical)":"0 (tramo horizontal)"):n4(T)]]);
    const xm=Math.max(30,x*2),ym=Math.max(30,y*2),lv=[0.5,1.5,2].map(k=>u.tipo==="quasi"?v+(k-1)*u.a:u.tipo==="cd"?v*Math.pow(k,u.a+u.b):v*k);
    $("pf-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[...lv.map(l=>indSeries(u,l,xm,ym,"--muted","5 4")),indSeries(u,v,xm,ym,"--line")],points:[{x,y,label:"A"}],xl:"x₁",yl:"x₂",label:"Mapa de curvas de indiferencia"});
    const expl={cd:`TMS = (a x₂)/(b x₁) = (${fm(u.a)}·${fm(y)})/(${fm(u.b)}·${fm(x)}) = ${n4(T)}: decreciente a lo largo de la curva (preferencias convexas).`,sust:`TMS = a/b = ${n4(T)}, constante: siempre cambia ${fm(u.a)} de x₂ por ${fm(u.b)} de x₁... es decir, una unidad de x₁ vale ${n4(T)} de x₂.`,comp:`Solo sirven juntos en la proporción ${fm(u.a)}x₁ = ${fm(u.b)}x₂; lo que sobra de un bien no aumenta la utilidad.`,quasi:`TMS = a/x₁ = ${n4(T)}: no depende de x₂, por eso las curvas son traslados verticales unas de otras.`,ces:`TMS = (a/b)(x₁/x₂)<sup>ρ−1</sup> = ${n4(T)}; elasticidad de sustitución σ = 1/(1 − ρ) = ${fmt(1/(1-u.rho),3)}.`}[u.tipo];
    $("pf-st").innerHTML=stp(1,"Lectura",`<p>${UFORM[u.tipo](u)}. ${expl}</p><p class="hint">Si se le da una unidad más de x₁, para quedar igual tendría que entregar unas ${u.tipo==="comp"?"0 (o infinitas)":n4(T)} unidades de x₂.</p>`)};
  utilBind("pf",st,run);bindCtl(["pf-x","pf-y"],run);run()};

// ---------- 5. Elección óptima
function consumoPlot(u,p1,p2,m,extra={}){const d=MI.dem(u,p1,p2,m),v=MI.U(u,d.x1,d.x2),xm=Math.max(m/p1,extra.xm||0)*1.2,ym=Math.max(m/p2,extra.ym||0)*1.2;
  return{d,v,html:plotXY({xr:[0,xm],yr:[0,ym],series:[...(extra.series||[]),{f:x=>(m-p1*x)/p2,col:"--branch"},indSeries(u,v,xm,ym,"--line")],points:[{x:d.x1,y:d.x2,label:extra.lab||"óptimo"},...(extra.points||[])],xl:"x₁",yl:"x₂",label:"Elección óptima"})}}
SIMS.elec=function(){
  $("sim").innerHTML=`${utilBox("el")}<div class="ctr">${ctl("el-p1","p₁",0.5,20,0.5,2)}${ctl("el-p2","p₂",0.5,20,0.5,4)}${ctl("el-m","m",10,500,5,100)}</div><div class="res" id="el-res"></div>${legend([["--branch","Recta presupuestaria"],["--line","Curva de indiferencia más alta"]])}<div id="el-p"></div><div id="el-st"></div>`;
  const st={t:"cd"};const run=()=>{const u=utilRead("el",st),p1=V("el-p1"),p2=V("el-p2"),m=V("el-m");if(!okAll([u.a,u.b,p1,p2,m]))return;const P=consumoPlot(u,p1,p2,m),d=P.d;
    $("el-res").innerHTML=tiles([["x₁*",n4(d.x1)],["x₂*",n4(d.x2)],["Utilidad",n4(P.v)],["Gasto en x₁",fmt(100*p1*d.x1/m,1)+" %"]]);$("el-p").innerHTML=P.html;
    const s={cd:`Tangencia: (${fm(u.a)}x₂)/(${fm(u.b)}x₁) = ${fm(p1)}/${fm(p2)}<br>x₁* = ${fr(fm(u.a),fm(u.a)+" + "+fm(u.b))}·${fr(fm(m),fm(p1))} = <b>${n4(d.x1)}</b> · x₂* = ${fr(fm(u.b),fm(u.a)+" + "+fm(u.b))}·${fr(fm(m),fm(p2))} = <b>${n4(d.x2)}</b>`,
      sust:`Utilidad por peso: a/p₁ = ${n4(u.a/p1)} y b/p₂ = ${n4(u.b/p2)}<br>${d.indif?"Son iguales: cualquier canasta de la recta es óptima (se muestra el punto medio).":u.a/p1>u.b/p2?`Rinde más x₁: todo el ingreso en x₁ ⟹ x₁* = ${fm(m)}/${fm(p1)} = <b>${n4(d.x1)}</b>, x₂* = 0 (esquina)`:`Rinde más x₂: x₂* = ${fm(m)}/${fm(p2)} = <b>${n4(d.x2)}</b>, x₁* = 0 (esquina)`}`,
      comp:`Vértice: ${fm(u.a)}x₁ = ${fm(u.b)}x₂ ⟹ x₂ = ${n4(u.a/u.b)}x₁<br>${fm(p1)}x₁ + ${fm(p2)}·${n4(u.a/u.b)}x₁ = ${fm(m)} ⟹ x₁* = <b>${n4(d.x1)}</b>, x₂* = <b>${n4(d.x2)}</b>`,
      quasi:d.esq?`a p₂/p₁ = ${n4(u.a*p2/p1)} cuesta ${n2(u.a*p2)}, más que el ingreso: esquina con x₁* = m/p₁ = <b>${n4(d.x1)}</b> y x₂* = 0`:`Tangencia: ${fm(u.a)}/x₁ = ${fm(p1)}/${fm(p2)} ⟹ x₁* = ${fm(u.a)}·${fm(p2)}/${fm(p1)} = <b>${n4(d.x1)}</b> (no depende de m)<br>x₂* = (${fm(m)} − ${fm(p1)}·${n4(d.x1)})/${fm(p2)} = <b>${n4(d.x2)}</b>`,
      ces:`σ = 1/(1 − ρ) = ${fmt(1/(1-u.rho),3)}<br>x₁* = m·a<sup>σ</sup>p₁<sup>−σ</sup>/(a<sup>σ</sup>p₁<sup>1−σ</sup> + b<sup>σ</sup>p₂<sup>1−σ</sup>) = <b>${n4(d.x1)}</b> · x₂* = <b>${n4(d.x2)}</b>`}[u.tipo];
    const T=MI.TMS(u,d.x1,d.x2);
    $("el-st").innerHTML=stp(1,"Solución",`<div class="eq al">${UFORM[u.tipo](u)} · ${fm(p1)}x₁ + ${fm(p2)}x₂ = ${fm(m)}<br>${s}</div>${!d.esq&&isFinite(T)?`<p class="hint">Comprobación: TMS = ${n4(T)} = p₁/p₂ = ${n4(p1/p2)}.</p>`:d.esq?`<p class="hint">Solución de esquina: no se cumple la tangencia.</p>`:""}`)
      +stp(2,"Funciones duales",`<div class="eq al">Utilidad indirecta v(p₁, p₂, m) = ${n4(P.v)}<br>Gasto mínimo para esa utilidad: e = ${n4(MI.gasto(u,p1,p2,P.v))} = m</div>`)};
  utilBind("el",st,run);bindCtl(["el-p1","el-p2","el-m"],run);run()};

// ---------- 6. Slutsky
SIMS.slut=function(){
  $("sim").innerHTML=`${utilBox("sl")}<div class="ctr">${ctl("sl-pa","p₁ inicial",0.5,20,0.5,2)}${ctl("sl-pb","p₁ final",0.5,20,0.5,4)}${ctl("sl-p2","p₂",0.5,20,0.5,4)}${ctl("sl-m","m",10,500,5,100)}</div><div style="margin:6px 0">${seg("sl-v","Versión",[["s","Slutsky (poder de compra)"],["h","Hicks (utilidad)"]],"s")}</div>
  <div class="res" id="sl-res"></div>${legend([["--branch","Recta inicial"],["--exam","Recta final"],["--muted","Recta compensada"]])}<div id="sl-p"></div><div id="sl-st"></div>`;
  const st={t:"cd"};let ver="s";const run=()=>{const u=utilRead("sl",st),pa=V("sl-pa"),pb=V("sl-pb"),p2=V("sl-p2"),m=V("sl-m");if(!okAll([u.a,u.b,pa,pb,p2,m]))return;const S=MI.slutsky(u,pa,pb,p2,m),Bc=ver==="s"?S.B:S.H,mc=ver==="s"?S.mS:S.mH,es=ver==="s"?S.esS:S.esH,er=ver==="s"?S.erS:S.erH;
    $("sl-res").innerHTML=tiles([["Efecto total",n4(S.total)],["Efecto sustitución",n4(es)],["Efecto renta",n4(er)],["Ingreso compensado",n2(mc)]]);
    const xm=Math.max(m/pa,m/pb,mc/pb)*1.15,ym=Math.max(m,mc)/p2*1.15,uA=S.uA,uB=MI.U(u,Bc.x1,Bc.x2);
    $("sl-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:x=>(m-pa*x)/p2,col:"--branch"},{f:x=>(m-pb*x)/p2,col:"--exam"},{f:x=>(mc-pb*x)/p2,col:"--muted",dash:"6 5"},indSeries(u,uA,xm,ym,"--line"),indSeries(u,S.uC,xm,ym,"--line","4 4"),...(ver==="s"?[indSeries(u,uB,xm,ym,"--muted","2 4")]:[])],
      points:[{x:S.A.x1,y:S.A.x2,label:"A"},{x:Bc.x1,y:Bc.x2,label:ver==="s"?"B":"H",col:"--muted"},{x:S.C.x1,y:S.C.x2,label:"C",col:"--exam"}],xl:"x₁",yl:"x₂",label:"Descomposición del cambio de precio"});
    const tipoB=er*(pb-pa)<0?"normal (el efecto renta refuerza)":Math.abs(er)<1e-9?"sin efecto renta":"inferior (el efecto renta va en contra)";
    $("sl-st").innerHTML=stp(1,"Canastas",`<div class="eq al">A (inicial): x₁ = ${n4(S.A.x1)}<br>${ver==="s"?`Ingreso que permite comprar A con el nuevo precio: m′ = ${fm(m)} + (${fm(pb)} − ${fm(pa)})·${n4(S.A.x1)} = <b>${n2(S.mS)}</b><br>B = x₁(${fm(pb)}, ${n2(S.mS)}) = ${n4(S.B.x1)}`:`Ingreso que da la utilidad inicial (${n4(uA)}) con el nuevo precio: e = <b>${n2(S.mH)}</b><br>H = x₁(${fm(pb)}, ${n2(S.mH)}) = ${n4(S.H.x1)}`}<br>C (final): x₁ = ${n4(S.C.x1)}</div>`)
      +stp(2,"Descomposición",`<div class="eq al">Sustitución = ${ver==="s"?"B":"H"} − A = ${n4(Bc.x1)} − ${n4(S.A.x1)} = <b>${n4(es)}</b><br>Renta = C − ${ver==="s"?"B":"H"} = ${n4(S.C.x1)} − ${n4(Bc.x1)} = <b>${n4(er)}</b><br>Total = ${n4(S.total)}</div><p>El bien 1 se comporta como ${tipoB}${S.total*(pb-pa)>0?". La demanda subió con el precio: bien Giffen.":"."}</p>`)};
  utilBind("sl",st,run);bindCtl(["sl-pa","sl-pb","sl-p2","sl-m"],run);bindSeg("sl-v",v=>{ver=v;run()});run()};

// ---------- 7. Excedentes
SIMS.exc=function(){
  $("sim").innerHTML=tabsBox("ex",[["vc","VC, VE y excedente"],["res","Precios de reserva"]]);const B=$("ex-b");
  tabsRun("ex",{
   vc(){B.innerHTML=`${utilBox("ec")}<div class="ctr">${ctl("ec-pa","p₁ inicial",0.5,20,0.5,2)}${ctl("ec-pb","p₁ final",0.5,20,0.5,4)}${ctl("ec-p2","p₂",0.5,20,0.5,4)}${ctl("ec-m","m",10,500,5,100)}</div><div class="res" id="ec-res"></div>${legend([["--line","Demanda de x₁"],["--good","Cambio en el excedente"]])}<div id="ec-p"></div><div id="ec-st"></div>`;
    const st={t:"cd"};const run=()=>{const u=utilRead("ec",st),pa=V("ec-pa"),pb=V("ec-pb"),p2=V("ec-p2"),m=V("ec-m");if(!okAll([u.a,u.b,pa,pb,p2,m]))return;const W=MI.bienestar(u,pa,pb,p2,m);
      $("ec-res").innerHTML=tiles([["Variación compensatoria",n2(W.VC)],["Variación equivalente",n2(W.VE)],["Cambio en el EC",n2(W.dEC)]]);
      const pm=Math.max(pa,pb)*1.6,dq=p=>MI.dem(u,p,p2,m).x1,lo=Math.min(pa,pb),hi=Math.max(pa,pb),qm=Math.min(dq(lo*0.5)||0,m/(lo*0.5))*1.05||10,ar=[];for(let i=0;i<=40;i++){const p=lo+(hi-lo)*i/40;ar.push([dq(p),p])}ar.push([0,hi],[0,lo]);
      $("ec-p").innerHTML=plotXY({xr:[0,Math.max(qm,dq(lo)*1.2)],yr:[0,pm],areas:[{pts:ar,col:"--good"}],series:[{pts:[...Array(121)].map((_,i)=>{const p=0.05*pm+(pm*0.95)*i/120;return[dq(p),p]}),col:"--line"}],hlines:[{y:pa},{y:pb}],xl:"x₁",yl:"p₁",label:"Demanda y excedente"});
      $("ec-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">Utilidad antes: u⁰ = ${n4(W.uA)} · después: u¹ = ${n4(W.uB)}<br>VC = e(p₁ = ${fm(pb)}, u⁰) − m = ${n2(W.VC+m)} − ${fm(m)} = <b>${n2(W.VC)}</b><br>VE = m − e(p₁ = ${fm(pa)}, u¹) = ${fm(m)} − ${n2(m-W.VE)} = <b>${n2(W.VE)}</b><br>ΔEC = −∫ x₁(p) dp entre ${fm(pa)} y ${fm(pb)} = <b>${n2(W.dEC)}</b></div><p class="hint">${u.tipo==="quasi"?"Con utilidad cuasilineal las tres medidas coinciden.":"En general difieren: la VC usa los precios nuevos y la VE los viejos."}</p>`)};
    utilBind("ec",st,run);bindCtl(["ec-pa","ec-pb","ec-p2","ec-m"],run);run()},
   res(){B.innerHTML=`<div class="calcf"><label for="er-r">Precios de reserva de cada unidad<input id="er-r" value="10, 8, 6, 4, 2"></label>${nin("er-p","Precio de mercado",5,"0.5")}</div><div id="er-o"></div>`;
    const run=()=>{const r=($("er-r").value.match(/\d+(?:[.,]\d+)?/g)||[]).map(x=>+x.replace(",",".")).sort((a,b)=>b-a),p=N("er-p");if(!r.length||!isFinite(p))return;const n=r.filter(x=>x>=p).length,bruto=r.slice(0,n).reduce((a,b)=>a+b,0);
      $("er-o").innerHTML=`<div class="res">${tiles([["Unidades compradas",String(n)],["Excedente bruto",n2(bruto)],["Excedente neto",n2(bruto-p*n),"okt"]])}</div><div class="eq al">Compra las unidades cuyo precio de reserva es al menos ${fm(p)}: ${r.slice(0,n).join(", ")||"ninguna"}<br>Bruto = ${r.slice(0,n).join(" + ")||"0"} = ${n2(bruto)} · Neto = ${n2(bruto)} − ${fm(p)} × ${n} = <b>${n2(bruto-p*n)}</b></div>`};
    onIn(["er-r","er-p"],run);run()}})};

// ---------- 8. Demanda de mercado y elasticidades
SIMS.dmer=function(){
  $("sim").innerHTML=tabsBox("dm",[["sum","Suma de demandas"],["el","Elasticidades"]]);const B=$("dm-b");
  tabsRun("dm",{
   sum(){B.innerHTML=`<p class="hint">Dos consumidores con demandas lineales q = α − βp.</p><div class="ctr">${ctl("ds-a1","α consumidor A",1,200,1,20)}${ctl("ds-b1","β consumidor A",0.1,10,0.1,2)}${ctl("ds-a2","α consumidor B",1,200,1,10)}${ctl("ds-b2","β consumidor B",0.1,10,0.1,1)}${ctl("ds-p","Precio a evaluar",0,50,0.5,6)}</div><div class="res" id="ds-res"></div>${legend([["--line","Consumidor A"],["--branch","Consumidor B"],["--ink","Mercado"]])}<div id="ds-pl"></div><div id="ds-st"></div>`;
    const run=()=>{const a1=V("ds-a1"),b1=V("ds-b1"),a2=V("ds-a2"),b2=V("ds-b2"),p=V("ds-p");if(!okAll([a1,b1,a2,b2,p]))return;const q1=pp=>Math.max(0,a1-b1*pp),q2=pp=>Math.max(0,a2-b2*pp),c1=a1/b1,c2=a2/b2,pm=Math.max(c1,c2)*1.1;
      $("ds-res").innerHTML=tiles([["q de A",n2(q1(p))],["q de B",n2(q2(p))],["Mercado",n2(q1(p)+q2(p))]]);
      const curve=g=>[...Array(201)].map((_,i)=>{const pp=pm*i/200;return[g(pp),pp]});
      $("ds-pl").innerHTML=plotXY({xr:[0,(a1+a2)*1.05],yr:[0,pm],series:[{pts:curve(q1),col:"--line",w:2},{pts:curve(q2),col:"--branch",w:2},{pts:curve(pp=>q1(pp)+q2(pp)),col:"--ink"}],hlines:[{y:p}],xl:"cantidad",yl:"precio",label:"Suma horizontal de demandas"});
      const lo=Math.min(c1,c2),hi=Math.max(c1,c2);
      $("ds-st").innerHTML=stp(1,"Demanda de mercado por tramos",`<div class="eq al">Precio de corte de A: ${n2(c1)} · de B: ${n2(c2)}<br>Si p ≥ ${n2(hi)}: Q = 0<br>Si ${n2(lo)} ≤ p < ${n2(hi)}: solo compra ${c1>c2?"A":"B"}: Q = ${c1>c2?`${fm(a1)} − ${fm(b1)}p`:`${fm(a2)} − ${fm(b2)}p`}<br>Si p < ${n2(lo)}: Q = ${fm(a1+a2)} − ${fm(b1+b2)}p</div><p class="hint">Se suman cantidades (horizontal), nunca precios. El quiebre está en p = ${n2(lo)}.</p>`)};
    bindCtl(["ds-a1","ds-b1","ds-a2","ds-b2","ds-p"],run);run()},
   el(){B.innerHTML=`<p class="hint">Demanda lineal q = α − βp + γp<sub>z</sub> + δm (z es otro bien).</p><div class="ctr">${ctl("de-a","α",0,500,1,100)}${ctl("de-b","β",0.1,20,0.1,2)}${ctl("de-g","γ (signo: sustituto + / complemento −)",-5,5,0.1,0.5)}${ctl("de-d","δ (efecto del ingreso)",-0.5,0.5,0.01,0.02)}${ctl("de-p","Precio p",0.5,100,0.5,20)}${ctl("de-pz","Precio del otro bien p_z",0,100,0.5,10)}${ctl("de-m","Ingreso m",0,5000,10,1000)}</div><div class="res" id="de-res"></div>${legend([["--line","Demanda"],["--exam","Ingreso marginal"]])}<div id="de-p"></div><div id="de-st"></div>`;
    const run=()=>{const a=V("de-a"),b=V("de-b"),g=V("de-g"),d=V("de-d"),p=V("de-p"),pz=V("de-pz"),m=V("de-m");if(!okAll([a,b,g,d,p,pz,m]))return;const A=a+g*pz+d*m,q=A-b*p;if(q<=0){$("de-res").innerHTML=err("a ese precio la cantidad es cero o negativa.");return}
      const ep=-b*p/q,ec=g*pz/q,ei=d*m/q,pu=A/(2*b),IMg=p*(1+1/ep);
      $("de-res").innerHTML=tiles([["Cantidad",n2(q)],["Elasticidad precio",n4(ep),Math.abs(ep)>1?"":"badt"],["Elasticidad cruzada",n4(ec)],["Elasticidad renta",n4(ei)],["Gasto p·q",n2(p*q)],["Ingreso marginal",n2(IMg)]]);
      $("de-p").innerHTML=plotXY({xr:[0,A*1.05],yr:[Math.min(0,-A/b*0.3),A/b*1.05],series:[{f:Q=>(A-Q)/b,col:"--line"},{f:Q=>(A-2*Q)/b,col:"--exam",w:2}],hlines:[{y:0}],vlines:[{x:A/2}],points:[{x:q,y:p,label:"punto"},{x:A/2,y:pu,col:"--muted",label:"|ε| = 1"}],xl:"q",yl:"p",label:"Demanda e ingreso marginal"});
      $("de-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">q = ${fm(a)} − ${fm(b)}·${fm(p)} + ${fm(g)}·${fm(pz)} + ${fm(d)}·${fm(m)} = <b>${n2(q)}</b><br>ε = −β·p/q = −${fm(b)}·${fm(p)}/${n2(q)} = <b>${n4(ep)}</b> (${Math.abs(ep)>1?"elástica":Math.abs(ep)<1?"inelástica":"unitaria"})<br>Cruzada = γ·p<sub>z</sub>/q = ${n4(ec)} (${g>0?"sustitutos":g<0?"complementarios":"independientes"}) · Renta = δ·m/q = ${n4(ei)} (${d>0?(ei>1?"bien de lujo":"bien normal"):d<0?"bien inferior":"neutral"})<br>IMg = p(1 + 1/ε) = ${fm(p)}(1 + 1/${n4(ep)}) = ${n2(IMg)}</div><p class="hint">Elasticidad unitaria en p = ${n2(pu)}: ahí el gasto es máximo (${n2(pu*(A-b*pu))}). ${Math.abs(ep)>1?"Bajar el precio aumentaría el gasto.":"Subir el precio aumentaría el gasto."}</p>`)};
    bindCtl(["de-a","de-b","de-g","de-d","de-p","de-pz","de-m"],run);run()}})};

// ---------- 9. Dotaciones
SIMS.dota=function(){
  $("sim").innerHTML=`${utilBox("do")}<div class="ctr">${ctl("do-w1","Dotación de x₁ (ω₁)",0,50,0.5,10)}${ctl("do-w2","Dotación de x₂ (ω₂)",0,50,0.5,10)}${ctl("do-pa","p₁ inicial",0.5,10,0.1,1)}${ctl("do-pb","p₁ final",0.5,10,0.1,2)}${ctl("do-p2","p₂",0.5,10,0.1,1)}</div>
  <div class="res" id="do-res"></div>${legend([["--branch","Recta inicial"],["--exam","Recta final"]])}<div id="do-p"></div><div id="do-st"></div>`;
  const st={t:"cd"};const run=()=>{const u=utilRead("do",st),w1=V("do-w1"),w2=V("do-w2"),pa=V("do-pa"),pb=V("do-pb"),p2=V("do-p2");if(!okAll([u.a,u.b,w1,w2,pa,pb,p2])||w1+w2<=0)return;const R=MI.dotacion(u,pa,pb,p2,w1,w2);
    $("do-res").innerHTML=tiles([["Demanda neta inicial",n4(R.netaA)],["Demanda neta final",n4(R.netaC)],["Efecto total",n4(R.total)],["Situación",R.netaA<0?"vende x₁":R.netaA>0?"compra x₁":"ni compra ni vende"]]);
    const xm=Math.max(R.m0/pa,R.m1/pb)*1.15,ym=Math.max(R.m0,R.m1)/p2*1.15;
    $("do-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:x=>(R.m0-pa*x)/p2,col:"--branch"},{f:x=>(R.m1-pb*x)/p2,col:"--exam"},indSeries(u,MI.U(u,R.A.x1,R.A.x2),xm,ym,"--line"),indSeries(u,MI.U(u,R.C.x1,R.C.x2),xm,ym,"--line","4 4")],points:[{x:w1,y:w2,label:"ω",col:"--muted"},{x:R.A.x1,y:R.A.x2,label:"A"},{x:R.C.x1,y:R.C.x2,label:"C",col:"--exam"}],xl:"x₁",yl:"x₂",label:"Elección con dotaciones"});
    $("do-st").innerHTML=stp(1,"Ingresos",`<div class="eq al">Antes: m = ${fm(pa)}·${fm(w1)} + ${fm(p2)}·${fm(w2)} = ${n2(R.m0)} ⟹ x₁ = ${n4(R.A.x1)}<br>Después: m = ${fm(pb)}·${fm(w1)} + ${fm(p2)}·${fm(w2)} = ${n2(R.m1)} ⟹ x₁ = ${n4(R.C.x1)}</div>`)
      +stp(2,"Tres efectos (Varian, cap. 9)",`<div class="eq al">Sustitución (poder de compra de A constante): ${n4(R.B.x1)} − ${n4(R.A.x1)} = <b>${n4(R.es)}</b><br>Renta ordinario (ingreso monetario fijo en ${n2(R.m0)}): ${n4(R.D.x1)} − ${n4(R.B.x1)} = <b>${n4(R.erOrd)}</b><br>Renta-dotación (sube el valor de la dotación): ${n4(R.C.x1)} − ${n4(R.D.x1)} = <b>${n4(R.erDot)}</b><br>Total = ${n4(R.total)}</div><p class="hint">${R.netaA<0?"Es vendedor neto de x₁: el alza de su precio lo enriquece.":R.netaA>0?"Es comprador neto: el alza lo empobrece.":"Ni compra ni vende: los efectos renta se cancelan."}</p>`)};
  utilBind("do",st,run);bindCtl(["do-w1","do-w2","do-pa","do-pb","do-p2"],run);run()};

// ---------- 10. Elección intertemporal
SIMS.inter=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("it-m1","Ingreso hoy m₁",0,500,5,50)}${ctl("it-m2","Ingreso mañana m₂",0,500,5,165)}${ctl("it-r","Tasa de interés r (%)",0,50,0.5,10)}${ctl("it-pi","Inflación π (%)",0,50,0.5,0)}${ctl("it-a","Peso del presente a (u = c₁^a c₂^b)",0.1,3,0.05,1)}${ctl("it-b","Peso del futuro b",0.1,3,0.05,1)}</div><div class="res" id="it-res"></div>${legend([["--branch","Restricción intertemporal"],["--line","Curva de indiferencia"]])}<div id="it-p"></div><div id="it-st"></div>`;
  const run=()=>{const m1=V("it-m1"),m2=V("it-m2"),r=V("it-r")/100,pi=V("it-pi")/100,a=V("it-a"),b=V("it-b");if(!okAll([m1,m2,r,pi,a,b])||m1+m2<=0)return;const R=MI.inter({m1,m2,r,a,b,pi}),u={tipo:"cd",a,b};
    $("it-res").innerHTML=tiles([["Consumo hoy c₁",n2(R.c1)],["Consumo mañana c₂",n2(R.c2)],[R.ahorro>=0?"Ahorra hoy":"Pide prestado hoy",n2(Math.abs(R.ahorro))],["Tipo",R.tipo],["Tasa real",fmt(100*R.real,2)+" %"]]);
    const xm=R.W*1.15,ym=R.VF*1.15;
    $("it-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:x=>R.VF-(1+r)*x,col:"--branch"},indSeries(u,MI.U(u,R.c1,R.c2),xm,ym,"--line")],points:[{x:m1,y:m2,label:"dotación",col:"--muted"},{x:R.c1,y:R.c2,label:"óptimo"}],xl:"consumo hoy c₁",yl:"consumo mañana c₂",label:"Elección intertemporal"});
    $("it-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">Riqueza en valor presente: W = ${fm(m1)} + ${fm(m2)}/${fmt(1+r,3)} = <b>${n2(R.W)}</b> · en valor futuro: ${n2(R.VF)}<br>c₁ = ${fr(fm(a),fm(a)+" + "+fm(b))}·W = <b>${n2(R.c1)}</b> · c₂ = ${fr(fm(b),fm(a)+" + "+fm(b))}·W·(1 + r) = <b>${n2(R.c2)}</b><br>${R.ahorro>=0?`Ahorra ${n2(R.ahorro)} y mañana recibe ${n2(R.ahorro*(1+r))}`:`Pide ${n2(-R.ahorro)} y mañana paga ${n2(-R.ahorro*(1+r))}`}<br>Tasa real: (1 + ${fmt(r,3)})/(1 + ${fmt(pi,3)}) − 1 = ${fmt(100*R.real,2)} %</div><p class="hint">Sube r: un ${R.tipo==="prestamista"?"prestamista sigue siéndolo y queda mejor":"prestatario puede quedar peor o pasarse a prestamista"}.</p>`)};
  bindCtl(["it-m1","it-m2","it-r","it-pi","it-a","it-b"],run);run()};

// ---------- 11. Tecnología
SIMS.tec=function(){
  $("sim").innerHTML=tabsBox("te",[["cp","Corto plazo: PT, PMe y PMg"],["lp","Largo plazo: isocuantas"]]);const B=$("te-b");
  tabsRun("te",{
   cp(){B.innerHTML=`<p class="hint">q = αL + βL² − γL³ (capital fijo).</p><div class="ctr">${ctl("tc-a","α",0,50,0.5,0)}${ctl("tc-b","β",0.1,20,0.1,6)}${ctl("tc-c","γ",0.01,2,0.01,0.2)}${ctl("tc-L","L a evaluar",0,60,0.5,12)}</div><div class="res" id="tc-res"></div><h4 class="subh">Producto total</h4><div id="tc-p1"></div>${legend([["--line","Producto medio"],["--exam","Producto marginal"]])}<div id="tc-p2"></div><div id="tc-st"></div>`;
    const run=()=>{const k={a:V("tc-a"),b:V("tc-b"),c:V("tc-c")},L=V("tc-L");if(!okAll([k.a,k.b,k.c,L]))return;const P=MI.cortoPuntos(k),R=MI.corto(k,L),Lm=P.LmaxQ*1.15,E=MI.corto(k,P.LmaxPMe);
      const etapa=L<P.LmaxPMe?"I (PMe creciente: conviene contratar más)":L<=P.LmaxQ?"II (la zona racional)":"III (PMg negativo: sobra trabajo)";
      $("tc-res").innerHTML=tiles([["Producción",n2(R.Q)],["PMe",n2(R.PMe)],["PMg",n2(R.PMg)],["Etapa",etapa.split(" ")[0]]]);
      $("tc-p1").innerHTML=plotXY({xr:[0,Lm],yr:[0,MI.corto(k,P.LmaxQ).Q*1.1],series:[{f:x=>MI.corto(k,x).Q,col:"--ink"}],vlines:[{x:P.LmaxPMg},{x:P.LmaxPMe},{x:P.LmaxQ}],points:[{x:L,y:R.Q,label:"L"}],xl:"trabajo L",yl:"q",H:230,label:"Producto total"});
      $("tc-p2").innerHTML=plotXY({xr:[0,Lm],yr:[Math.min(0,MI.corto(k,Lm).PMg),MI.corto(k,P.LmaxPMg).PMg*1.15],series:[{f:x=>x>0?MI.corto(k,x).PMe:NaN,col:"--line"},{f:x=>MI.corto(k,x).PMg,col:"--exam"}],hlines:[{y:0}],vlines:[{x:P.LmaxPMe}],points:[{x:P.LmaxPMe,y:E.PMe,label:"PMg = PMe",col:"--muted"}],xl:"trabajo L",yl:"producto por trabajador",H:230,label:"Producto medio y marginal"});
      $("tc-st").innerHTML=stp(1,"Puntos clave",`<div class="eq al">PMe = α + βL − γL² · PMg = α + 2βL − 3γL²<br>Máximo del PMg: L = β/(3γ) = <b>${n2(P.LmaxPMg)}</b> (desde ahí, rendimientos decrecientes)<br>Máximo del PMe: L = β/(2γ) = <b>${n2(P.LmaxPMe)}</b>, donde PMg = PMe = ${n2(E.PMe)}<br>Máximo del producto: PMg = 0 en L = <b>${n2(P.LmaxQ)}</b></div><p>Con L = ${fm(L)} la empresa está en la etapa ${etapa}.</p>`)};
    bindCtl(["tc-a","tc-b","tc-c","tc-L"],run);run()},
   lp(){B.innerHTML=`<div style="margin-bottom:8px">${seg("tl-t","Tecnología",[["cd","Cobb-Douglas"],["ces","CES"],["leon","Leontief"],["lin","Lineal"]],"cd")}</div><div class="ctr">${ctl("tl-A","A",0.2,5,0.1,1)}${ctl("tl-al","α",0.05,2,0.05,0.5)}${ctl("tl-be","β",0.05,2,0.05,0.5)}${ctl("tl-r","ρ (CES)",-5,0.95,0.05,0.5)}${ctl("tl-L","L",0.5,50,0.5,4)}${ctl("tl-K","K",0.5,50,0.5,16)}</div><div class="res" id="tl-res"></div>${legend([["--line","Isocuanta del punto"],["--muted","Isocuantas con 2 y 3 veces los factores"]])}<div id="tl-p"></div><div id="tl-st"></div>`;
    let t="cd";const run=()=>{const T={tipo:t,A:V("tl-A"),al:V("tl-al"),be:V("tl-be"),rho:Math.abs(V("tl-r"))<0.02?0.02:V("tl-r")},L=V("tl-L"),K=V("tl-K");if(!okAll([T.A,T.al,T.be,L,K]))return;const q=MI.f(T,L,K),k=MI.escala(T),s=MI.sigma(T),R=MI.RMST(T,L,K);
      $("tl-res").innerHTML=tiles([["Producción",n4(q)],["RMST",isFinite(R)?n4(R):"no definida"],["Elasticidad de sustitución",isFinite(s)?fmt(s,3):"∞"],["Rendimientos a escala",k>1.0001?"crecientes":k<0.9999?"decrecientes":"constantes"]]);
      const xm=Math.max(50,L*3),ym=Math.max(50,K*3),iso=(qq,col,dash)=>t==="leon"?{pts:[[T.al*qq/T.A,ym*3],[T.al*qq/T.A,T.be*qq/T.A],[xm*3,T.be*qq/T.A]],col,dash,w:2}:{f:x=>MI.isoq(T,qq,x),col,dash,w:2};
      $("tl-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[iso(MI.f(T,2*L,2*K),"--muted","5 4"),iso(MI.f(T,3*L,3*K),"--muted","5 4"),iso(q,"--line")],points:[{x:L,y:K,label:"(L, K)"}],xl:"trabajo L",yl:"capital K",label:"Isocuantas"});
      $("tl-st").innerHTML=stp(1,"Lectura",`<p>${{cd:`q = ${fm(T.A)}L<sup>${fm(T.al)}</sup>K<sup>${fm(T.be)}</sup>. RMST = αK/(βL) = ${n4(R)}; σ = 1; grado de homogeneidad α + β = ${fm(k)}.`,ces:`q = ${fm(T.A)}(${fm(T.al)}L<sup>ρ</sup> + ${fm(T.be)}K<sup>ρ</sup>)<sup>1/ρ</sup>. RMST = (α/β)(L/K)<sup>ρ−1</sup> = ${n4(R)}; σ = 1/(1 − ρ) = ${fmt(s,3)}.`,leon:`q = ${fm(T.A)}·mín{L/${fm(T.al)}, K/${fm(T.be)}}: proporciones fijas, σ = 0. En el vértice se usan exactamente K/L = ${fmt(T.be/T.al,3)}.`,lin:`q = ${fm(T.A)}(${fm(T.al)}L + ${fm(T.be)}K): sustitutos perfectos, RMST = α/β = ${n4(R)} constante, σ = ∞.`}[t]}</p><p class="hint">Al duplicar los dos factores, q pasa de ${n4(q)} a ${n4(MI.f(T,2*L,2*K))} (${fmt(MI.f(T,2*L,2*K)/q,3)} veces).</p>`)};
    bindSeg("tl-t",v=>{t=v;run()});bindCtl(["tl-A","tl-al","tl-be","tl-r","tl-L","tl-K"],run);run()}})};

// ---------- 12. Costos
SIMS.cost=function(){
  $("sim").innerHTML=`<p class="hint">q = A·L<sup>α</sup>K<sup>β</sup>, salario w y alquiler del capital r.</p><div class="ctr">${ctl("co-A","A",0.2,5,0.1,1)}${ctl("co-al","α",0.1,1.5,0.05,0.5)}${ctl("co-be","β",0.1,1.5,0.05,0.5)}${ctl("co-w","w",0.5,20,0.5,4)}${ctl("co-r","r",0.5,20,0.5,1)}${ctl("co-q","Producción q",1,100,1,10)}${ctl("co-K","Capital fijo en el corto plazo K̄",1,100,1,25)}</div>
  <div class="res" id="co-res"></div>${legend([["--line","Isocuanta"],["--branch","Isocosto mínima"],["--muted","Senda de expansión"]])}<div id="co-p"></div><h4 class="subh">Curvas de costo</h4>${legend([["--ink","CMe de largo plazo"],["--exam","CMg de largo plazo"],["--line","CMe de corto plazo (K̄)"],["--branch","CMg de corto plazo"]])}<div id="co-p2"></div><div id="co-st"></div>`;
  const run=()=>{const v={A:V("co-A"),al:V("co-al"),be:V("co-be"),w:V("co-w"),r:V("co-r"),q:V("co-q")},Kf=V("co-K");if(!okAll([...Object.values(v),Kf]))return;const R=MI.costoCD(v),S=MI.costoCP({...v,Kf});
    $("co-res").innerHTML=tiles([["L*",n4(R.L)],["K*",n4(R.K)],["Costo mínimo",n2(R.C)],["CMe = CMg·(α+β)",n2(R.CMe)],["Corto plazo con K̄",n2(S.CT)]]);
    const xm=R.L*3,ym=R.K*3,T={tipo:"cd",A:v.A,al:v.al,be:v.be};
    $("co-p").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],series:[{f:x=>MI.isoq(T,v.q,x),col:"--line"},{f:x=>(R.C-v.w*x)/v.r,col:"--branch"},{f:x=>x*R.K/R.L,col:"--muted",dash:"5 4",w:2}],points:[{x:R.L,y:R.K,label:"óptimo"}],xl:"L",yl:"K",label:"Minimización de costos"});
    const qm=v.q*3,CMeL=q=>MI.costoCD({...v,q}).CMe,CMgL=q=>MI.costoCD({...v,q}).CMg,CMeC=q=>MI.costoCP({...v,q,Kf}).CT/q,CMgC=q=>MI.costoCP({...v,q,Kf}).CMg,ys=[CMeL(v.q),CMeC(v.q)],top=Math.max(...ys)*3;
    $("co-p2").innerHTML=plotXY({xr:[0,qm],yr:[0,top],series:[{f:CMeL,col:"--ink"},{f:CMgL,col:"--exam",w:2},{f:CMeC,col:"--line"},{f:CMgC,col:"--branch",w:2}],vlines:[{x:v.q}],xl:"q",yl:"costo por unidad",label:"Costos medios y marginales"});
    const g=R.g;
    $("co-st").innerHTML=stp(1,"Tangencia",`<div class="eq al">RMST = (αK)/(βL) = w/r ⟹ K = ${fr(fm(v.be)+"·"+fm(v.w),fm(v.al)+"·"+fm(v.r))}·L = ${n4(v.be*v.w/(v.al*v.r))}L (senda de expansión)</div>`)
      +stp(2,"Demandas condicionadas y costo",`<div class="eq al">${fm(v.q)} = ${fm(v.A)}·L<sup>${fm(v.al)}</sup>·(${n4(v.be*v.w/(v.al*v.r))}L)<sup>${fm(v.be)}</sup> ⟹ L* = <b>${n4(R.L)}</b>, K* = <b>${n4(R.K)}</b><br>C = wL + rK = ${fm(v.w)}·${n4(R.L)} + ${fm(v.r)}·${n4(R.K)} = <b>${n2(R.C)}</b><br>Rendimientos ${g>1.0001?"crecientes: el costo medio baja con q":g<0.9999?"decrecientes: el costo medio sube con q":"constantes: el costo medio no cambia con q"} (α + β = ${fm(g)})</div>`)
      +stp(3,"Corto plazo con K̄ = "+fm(Kf),`<div class="eq al">L = (q/(A·K̄<sup>β</sup>))<sup>1/α</sup> = ${n4(S.L)} · CF = r·K̄ = ${n2(S.CF)} · CV = w·L = ${n2(S.CV)}<br>CT = ${n2(S.CT)} ${S.CT>R.C+1e-6?`> ${n2(R.C)}: con el capital fijo cuesta más (el largo plazo es la envolvente)`:"= costo de largo plazo: K̄ es justo el óptimo"}</div>`)};
  bindCtl(["co-A","co-al","co-be","co-w","co-r","co-q","co-K"],run);run()};

// ---------- 13. Beneficio
SIMS.benef=function(){
  $("sim").innerHTML=`<p class="hint">CT = CF + a·q − b·q² + c·q³.</p><div class="ctr">${ctl("be-F","Costo fijo CF",0,500,5,50)}${ctl("be-a","a",0.5,50,0.5,10)}${ctl("be-b","b",0,10,0.1,2)}${ctl("be-c","c",0.01,2,0.01,0.2)}${ctl("be-p","Precio de mercado p",0,60,0.5,20)}</div>
  <div class="res" id="be-res"></div>${legend([["--exam","CMg"],["--line","CMe"],["--branch","CVMe"],["--muted","Precio"]])}<div id="be-pl"></div><div id="be-st"></div>`;
  const run=()=>{const k={CF:V("be-F"),a:V("be-a"),b:V("be-b"),c:V("be-c")},p=V("be-p");if(!okAll([...Object.values(k),p]))return;const ci=MI.cubCierre(k),mc=MI.cubMinCMe(k),R=MI.cubBeneficio(k,p);
    $("be-res").innerHTML=tiles([["Producción óptima",n4(R.q)],["Beneficio",n2(R.B),R.B<0?"badt":"okt"],["Excedente del productor",n2(R.EP)],["Punto de cierre",`p = ${n2(ci.p)}`],["Mínimo del CMe",`p = ${n2(mc.p)}`]]);
    const qm=Math.max(mc.q,R.q)*1.6,top=Math.max(p,mc.p)*1.8;
    $("be-pl").innerHTML=plotXY({xr:[0,qm],yr:[0,top],series:[{f:q=>MI.cub(k,q).CMg,col:"--exam"},{f:q=>q>0?MI.cub(k,q).CMe:NaN,col:"--line"},{f:q=>q>0?MI.cub(k,q).CVMe:NaN,col:"--branch"}],hlines:[{y:p,col:"--muted",dash:"0",w:2}],points:[{x:ci.q,y:ci.p,label:"cierre",col:"--branch"},{x:mc.q,y:mc.p,label:"mín CMe",col:"--line"},...(R.q?[{x:R.q,y:p,label:"q*"}]:[])],xl:"q",yl:"pesos por unidad",label:"Costos y precio"});
    const sit=p<ci.p?"El precio no cubre ni el costo variable medio: <b>cierra</b> y pierde solo el costo fijo.":p<mc.p?"Cubre el costo variable pero no el total: <b>produce con pérdidas</b> en el corto plazo (pierde menos que cerrando); en el largo plazo saldría.":"El precio supera el costo medio: <b>gana beneficio económico</b> y en el largo plazo atraerá empresas.";
    $("be-st").innerHTML=stp(1,"Condición p = CMg",`<div class="eq al">CMg = ${fm(k.a)} − ${fm(2*k.b)}q + ${fm(3*k.c)}q² = ${fm(p)}<br>${R.q?`q* = [${fm(2*k.b)} + √(${fm(4*k.b*k.b)} − ${fm(12*k.c)}(${fm(k.a)} − ${fm(p)}))]/${fm(6*k.c)} = <b>${n4(R.q)}</b>`:"No hay producción: el precio está por debajo del punto de cierre."}</div>`)
      +stp(2,"Cierre y resultados",`<div class="eq al">CVMe = ${fm(k.a)} − ${fm(k.b)}q + ${fm(k.c)}q² es mínimo en q = b/(2c) = ${n2(ci.q)}, donde vale <b>${n2(ci.p)}</b><br>Ingreso = ${fm(p)}·${n4(R.q)} = ${n2(R.I)} · CT = ${n2(R.CT)} · Beneficio = <b>${n2(R.B)}</b><br>EP = ingreso − CV = ${n2(R.I)} − ${n2(R.CV)} = ${n2(R.EP)} (= beneficio + CF)</div><p>${sit}</p>`)};
  bindCtl(["be-F","be-a","be-b","be-c","be-p"],run);run()};

// ---------- 14. Oferta de la industria
SIMS.indus=function(){
  $("sim").innerHTML=`<p class="hint">Empresas idénticas con CT = CF + a·q − b·q² + c·q³ y demanda de mercado Q = α − β·p.</p><div class="ctr">${ctl("in-F","CF",0,500,5,50)}${ctl("in-a","a",0.5,50,0.5,10)}${ctl("in-b","b",0,10,0.1,2)}${ctl("in-c","c",0.01,2,0.01,0.2)}${ctl("in-n","Número de empresas (corto plazo)",1,500,1,100)}${ctl("in-A","α (demanda)",100,10000,50,2000)}${ctl("in-B","β (demanda)",1,500,1,50)}</div>
  <div class="res" id="in-res"></div>${legend([["--exam","Oferta de corto plazo"],["--line","Demanda"],["--muted","Oferta de largo plazo (mín CMe)"]])}<div id="in-p"></div><div id="in-st"></div>`;
  const run=()=>{const k={CF:V("in-F"),a:V("in-a"),b:V("in-b"),c:V("in-c")},n=Math.round(V("in-n")),A=V("in-A"),Bd=V("in-B");if(!okAll([...Object.values(k),n,A,Bd]))return;const ci=MI.cubCierre(k),mc=MI.cubMinCMe(k),S=p=>n*MI.cubOferta(k,p),D=p=>Math.max(0,A-Bd*p);
    const pc=MI.bis(p=>S(p)-D(p),0,A/Bd),qc=D(pc),be=MI.cubBeneficio(k,pc),QL=D(mc.p),nL=QL/mc.q;
    $("in-res").innerHTML=tiles([["Precio de corto plazo",n2(pc)],["Cantidad",n2(qc)],["Beneficio por empresa",n2(be.B),be.B<0?"badt":"okt"],["Precio de largo plazo",n2(mc.p)],["Empresas en el largo plazo",fmt(nL,1)]]);
    const top=Math.max(pc,mc.p)*1.8,curve=g=>[...Array(201)].map((_,i)=>{const p=top*i/200;return[g(p),p]});
    $("in-p").innerHTML=plotXY({xr:[0,Math.max(A*0.9,qc*1.4)],yr:[0,top],series:[{pts:curve(S),col:"--exam"},{pts:curve(D),col:"--line"}],hlines:[{y:mc.p}],points:[{x:qc,y:pc,label:"CP"},{x:QL,y:mc.p,col:"--muted",label:"LP"}],xl:"cantidad del mercado",yl:"precio",label:"Oferta de la industria"});
    $("in-st").innerHTML=stp(1,"Corto plazo",`<div class="eq al">Oferta de cada empresa: p = CMg para p ≥ ${n2(ci.p)} (cierre); la industria: Q<sup>s</sup> = ${n}·q*(p)<br>Equilibrio: ${n}·q*(p) = ${fm(A)} − ${fm(Bd)}p ⟹ p = <b>${n2(pc)}</b>, Q = ${n2(qc)}, cada empresa produce ${n4(qc/n)} con beneficio ${n2(be.B)}</div>`)
      +stp(2,"Largo plazo",`<div class="eq al">p = mín CMe = <b>${n2(mc.p)}</b> en q = ${n4(mc.q)} por empresa<br>Cantidad demandada: ${fm(A)} − ${fm(Bd)}·${n2(mc.p)} = ${n2(QL)} ⟹ n = ${n2(QL)}/${n4(mc.q)} = <b>${fmt(nL,1)}</b> empresas</div><p>${be.B>0?`Hoy hay beneficios: entrarán unas ${Math.max(0,Math.round(nL-n))} empresas y el precio bajará a ${n2(mc.p)}.`:be.B<0?`Hoy hay pérdidas: saldrán unas ${Math.max(0,Math.round(n-nL))} empresas y el precio subirá a ${n2(mc.p)}.`:"Ya está en el equilibrio de largo plazo."}</p>`)};
  bindCtl(["in-F","in-a","in-b","in-c","in-n","in-A","in-B"],run);run()};

// ---------- 15. Equilibrio y telaraña
SIMS.eq=function(){
  $("sim").innerHTML=`<p class="hint">Q<sup>d</sup> = a − b·p y Q<sup>s</sup> = c + d·p.</p><div class="ctr">${ctl("eq-a","a",10,500,1,100)}${ctl("eq-b","b",0.1,10,0.1,2)}${ctl("eq-c","c",-100,200,1,10)}${ctl("eq-d","d",0.1,10,0.1,3)}${ctl("eq-da","Choque de demanda (Δa)",-100,100,1,0)}${ctl("eq-dc","Choque de oferta (Δc)",-100,100,1,0)}</div>
  <div class="res" id="eq-res"></div>${legend([["--line","Demanda"],["--branch","Oferta"],["--muted","Antes del choque",1]])}<div id="eq-p"></div><div id="eq-st"></div>
  <h4 class="subh">Telaraña</h4><div class="ctr">${ctl("eq-p0","Precio inicial p₀",0,100,0.5,20)}${ctl("eq-T","Períodos",2,30,1,8)}</div><div id="eq-t"></div>`;
  const run=()=>{const v={a:V("eq-a"),b:V("eq-b"),c:V("eq-c"),d:V("eq-d")},da=V("eq-da"),dc=V("eq-dc");if(!okAll([...Object.values(v),da,dc]))return;const E0=MI.mercado(v),v1={...v,a:v.a+da,c:v.c+dc},E=MI.mercado(v1);
    if(!(E.q>0&&E.p>0)){$("eq-res").innerHTML=err("con estos valores el equilibrio no tiene precio y cantidad positivos.");return}
    $("eq-res").innerHTML=tiles([["Precio de equilibrio",n2(E.p)],["Cantidad",n2(E.q)],["ε de la demanda",n4(E.ed)],["ε de la oferta",n4(E.es)]]);
    const pm=Math.max(v1.a/v.b,E0.p,E.p)*1.1,crv=(f)=>[...Array(161)].map((_,i)=>{const p=pm*i/160;return[f(p),p]});
    $("eq-p").innerHTML=plotXY({xr:[0,Math.max(v.a,v1.a)*1.05],yr:[0,pm],series:[...(da||dc?[{pts:crv(p=>v.a-v.b*p),col:"--line",dash:"6 5",w:1.6},{pts:crv(p=>v.c+v.d*p),col:"--branch",dash:"6 5",w:1.6}]:[]),{pts:crv(p=>v1.a-v.b*p),col:"--line"},{pts:crv(p=>v1.c+v.d*p),col:"--branch"}],points:[...(da||dc?[{x:E0.q,y:E0.p,label:"E₀",col:"--muted"}]:[]),{x:E.q,y:E.p,label:da||dc?"E₁":"E"}],xl:"cantidad",yl:"precio",label:"Equilibrio de mercado"});
    $("eq-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">${fm(v1.a)} − ${fm(v.b)}p = ${fm(v1.c)} + ${fm(v.d)}p ⟹ p* = ${fr(fm(v1.a)+" − "+fm(v1.c),fm(v.b)+" + "+fm(v.d))} = <b>${n2(E.p)}</b>, Q* = <b>${n2(E.q)}</b><br>ε<sub>d</sub> = −b·p/Q = ${n4(E.ed)} · ε<sub>s</sub> = d·p/Q = ${n4(E.es)}</div>${da||dc?`<p>Antes del choque: p = ${n2(E0.p)}, Q = ${n2(E0.q)}. El precio ${E.p>E0.p?"subió":"bajó"} ${n2(Math.abs(E.p-E0.p))} y la cantidad ${E.q>E0.q?"subió":"bajó"} ${n2(Math.abs(E.q-E0.q))}.</p>`:""}`);
    const T=Math.round(V("eq-T")),C=MI.telarana({...v1,p0:V("eq-p0"),T}),conv=v.d<v.b;
    $("eq-t").innerHTML=`<p>${conv?"Como d < b, las oscilaciones se amortiguan: converge al equilibrio.":v.d===v.b?"Con d = b, oscila sin acercarse ni alejarse.":"Como d > b, las oscilaciones crecen: la telaraña diverge."}</p><div class="tbl"><table><tr><th>t</th><th>Precio anterior</th><th>Oferta Q<sup>s</sup> = c + d·p<sub>t−1</sub></th><th>Precio que vacía el mercado</th></tr>${C.map(o=>`<tr><td>${o.t}</td><td class="num">${n2(o.pPrev)}</td><td class="num">${n2(o.q)}</td><td class="num">${n2(o.p)}</td></tr>`).join("")}</table></div>`};
  bindCtl(["eq-a","eq-b","eq-c","eq-d","eq-da","eq-dc","eq-p0","eq-T"],run);run()};

// ---------- 16. Bienestar y políticas
SIMS.bien=function(){
  $("sim").innerHTML=`<p class="hint">Q<sup>d</sup> = a − b·p y Q<sup>s</sup> = c + d·p.</p><div class="ctr">${ctl("bi-a","a",10,500,1,100)}${ctl("bi-b","b",0.1,10,0.1,2)}${ctl("bi-c","c",-100,200,1,10)}${ctl("bi-d","d",0.1,10,0.1,3)}</div>
  <div style="margin:6px 0">${seg("bi-t","Política",[["no","Ninguna"],["imp","Impuesto por unidad"],["sub","Subsidio por unidad"],["max","Precio máximo"],["min","Precio mínimo"]],"imp")}</div><div class="ctr" id="bi-wv">${ctl("bi-v","Valor (impuesto, subsidio o precio)",0,100,0.5,5)}</div>
  <div class="res" id="bi-res"></div>${legend([["--good","Excedente del consumidor"],["--line","Excedente del productor"],["--exam","Recaudo o gasto"],["--bad","Pérdida irrecuperable"]])}<div id="bi-p"></div><div id="bi-st"></div>`;
  let tipo="imp";const run=()=>{const v={a:V("bi-a"),b:V("bi-b"),c:V("bi-c"),d:V("bi-d")},x=V("bi-v");$("bi-wv").hidden=tipo==="no";if(!okAll([...Object.values(v),x]))return;const R=MI.politica({...v,tipo,v:x}),E=R.E;
    if(!(E.q>0&&E.p>0)){$("bi-res").innerHTML=err("el equilibrio sin intervención debe tener precio y cantidad positivos.");return}
    $("bi-res").innerHTML=tiles([["Precio al consumidor",n2(R.pc)],["Precio al vendedor",n2(R.pv)],["Cantidad",n2(R.Q)],["Excedente del consumidor",n2(R.EC)],["Excedente del productor",n2(R.EP)],[tipo==="sub"?"Gasto del gobierno":"Recaudo",n2(tipo==="sub"?R.G:R.T)],["Pérdida irrecuperable",n2(R.PIM),R.PIM>1e-9?"badt":""],...(R.brecha?[[R.nota==="escasez"?"Escasez":"Excedente de producto",n2(R.brecha),"badt"]]:[])]);
    const Pd=q=>(v.a-q)/v.b,Ps=q=>Math.max(0,(q-v.c)/v.d),pmax=v.a/v.b,Q=R.Q,ar=[];
    const pol=(f,a,b2,lo)=>{const pts=[];for(let i=0;i<=30;i++){const q=a+(b2-a)*i/30;pts.push([q,f(q)])}for(let i=30;i>=0;i--){const q=a+(b2-a)*i/30;pts.push([q,lo(q)])}return pts};
    ar.push({pts:pol(Pd,0,Q,()=>R.pc),col:"--good"});ar.push({pts:pol(()=>R.pv,0,Q,Ps),col:"--line"});
    if(tipo==="imp")ar.push({pts:[[0,R.pc],[Q,R.pc],[Q,R.pv],[0,R.pv]],col:"--exam"});if(tipo==="sub")ar.push({pts:[[0,R.pv],[Q,R.pv],[Q,R.pc],[0,R.pc]],col:"--exam",op:.15});
    if(R.PIM>1e-9){const lo=Math.min(Q,E.q),hi=Math.max(Q,E.q);ar.push({pts:pol(Pd,lo,hi,Ps),col:"--bad",op:.35})}
    const crv=f=>[...Array(161)].map((_,i)=>{const q=Math.max(v.a,v.c+v.d*pmax)*i/160;return[q,f(q)]});
    $("bi-p").innerHTML=plotXY({xr:[0,v.a*1.02],yr:[0,pmax*1.05],areas:ar,series:[{pts:crv(Pd),col:"--ink",w:2},{pts:crv(q=>(q-v.c)/v.d),col:"--ink",w:2}],hlines:tipo==="max"||tipo==="min"?[{y:x,col:"--bad",dash:"0",w:2}]:[],points:[{x:E.q,y:E.p,label:"E",col:"--muted"}],xl:"cantidad",yl:"precio",label:"Excedentes y pérdida irrecuperable"});
    const inc=v.d/(v.b+v.d);
    $("bi-st").innerHTML=stp(1,"Sin intervención",`<div class="eq al">p* = ${n2(E.p)}, Q* = ${n2(E.q)} · excedente total = ${n2(R.W0)}</div>`)
      +stp(2,"Con la política",`<div class="eq al">${tipo==="imp"?`p<sub>c</sub> − p<sub>v</sub> = ${fm(x)}: ${fm(v.a)} − ${fm(v.b)}p<sub>c</sub> = ${fm(v.c)} + ${fm(v.d)}(p<sub>c</sub> − ${fm(x)}) ⟹ p<sub>c</sub> = <b>${n2(R.pc)}</b>, p<sub>v</sub> = <b>${n2(R.pv)}</b><br>Carga: consumidores ${n2(R.cargaC)} (${fmt(100*inc,1)} %), productores ${n2(R.cargaP)} (${fmt(100-100*inc,1)} %) · fórmula ε<sub>s</sub>/(ε<sub>s</sub> − ε<sub>d</sub>) = d/(b + d) = ${fmt(inc,4)}<br>Recaudo = ${fm(x)} × ${n2(Q)} = ${n2(R.T)}`:tipo==="sub"?`p<sub>v</sub> − p<sub>c</sub> = ${fm(x)} ⟹ p<sub>c</sub> = <b>${n2(R.pc)}</b>, p<sub>v</sub> = <b>${n2(R.pv)}</b><br>Gasto = ${fm(x)} × ${n2(Q)} = ${n2(R.G)}`:tipo==="max"?(R.nota==="escasez"?`Se transa lo que ofrecen a ${fm(x)}: Q = ${n2(Q)}; demandan ${n2(Q+R.brecha)} ⟹ escasez de <b>${n2(R.brecha)}</b>`:`El precio máximo está por encima del equilibrio: no tiene efecto.`):tipo==="min"?(R.nota==="excedente"?`Se transa lo que demandan a ${fm(x)}: Q = ${n2(Q)}; ofrecen ${n2(Q+R.brecha)} ⟹ sobran <b>${n2(R.brecha)}</b>`:`El precio mínimo está por debajo del equilibrio: no tiene efecto.`):"Sin intervención."}<br>EC = ${n2(R.EC)} · EP = ${n2(R.EP)} · total = ${n2(R.W)} · PIE = ${n2(R.W0)} − ${n2(R.W)} = <b>${n2(R.PIM)}</b></div>${tipo==="imp"||tipo==="sub"?`<p class="hint">PIE = ½ × ${fm(x)} × ${n2(Math.abs(E.q-Q))} = ${n2(0.5*x*Math.abs(E.q-Q))}. Paga más el lado menos elástico.</p>`:R.nota?`<p class="hint">Se supone que el bien llega a quienes más lo valoran${tipo==="min"?" y que producen los vendedores de menor costo":""}; si no, la pérdida es mayor.</p>`:""}`)};
  bindCtl(["bi-a","bi-b","bi-c","bi-d","bi-v"],run);bindSeg("bi-t",t=>{tipo=t;run()});run()};

// ---------- Preferencias reveladas
SIMS.rev=function(){
  const D=[[1,2,4,3],[2,1,3,4],[1,1,5,2],[0,0,0,0]];
  $("sim").innerHTML=`<p class="hint">Escribe hasta 4 observaciones: precios (p₁, p₂) y la canasta comprada (x₁, x₂). Deja en cero las que no uses.</p><div class="tbl"><table><tr><th>Obs.</th><th>p₁</th><th>p₂</th><th>x₁</th><th>x₂</th></tr>${D.map((r,i)=>`<tr><td>${i+1}</td>${r.map((v,j)=>`<td><input type="number" id="rv-${i}-${j}" value="${v}" step="0.5" style="width:5em" aria-label="${["p1","p2","x1","x2"][j]} observación ${i+1}"></td>`).join("")}</tr>`).join("")}</table></div><div id="rv-o"></div>`;
  const run=()=>{const obs=[];for(let i=0;i<4;i++){const v=[0,1,2,3].map(j=>N(`rv-${i}-${j}`));if(v.some(x=>!isFinite(x)))return;if(v.every(x=>x===0))continue;obs.push({p1:v[0],p2:v[1],x1:v[2],x2:v[3],k:i+1})}
    if(obs.length<2){$("rv-o").innerHTML=err("hacen falta al menos dos observaciones.");return}const R=MI.revelado(obs),n=obs.length;
    $("rv-o").innerHTML=stp(1,"Costo de cada canasta con cada sistema de precios",`<div class="tbl"><table><tr><th>Precios de</th>${obs.map(o=>`<th>canasta ${o.k}</th>`).join("")}</tr>${obs.map((o,i)=>`<tr><td>obs. ${o.k}</td>${obs.map((q,j)=>`<td class="num"${i===j?' style="font-weight:700"':""}>${n2(R.c(i,j))}${i!==j&&R.R[i][j]?" ✓":""}</td>`).join("")}</tr>`).join("")}</table></div><p class="hint">✓: con los precios de la fila, la canasta de la columna era alcanzable (costaba lo mismo o menos que la elegida), así que la elegida está revelada preferida.</p>`)
      +stp(2,"Axiomas",`<div class="verdict ${R.warp.length?"warnv":"acc"}">${R.warp.length?`Se viola el axioma débil: ${R.warp.map(([i,j])=>`canastas ${obs[i].k} y ${obs[j].k}`).join("; ")} están reveladas preferidas una a la otra.`:"Cumple el axioma débil de preferencia revelada."}</div><div class="verdict ${R.sarp.length?"warnv":"acc"}" style="margin-top:6px">${R.sarp.length?`Se viola el axioma fuerte (con cadenas indirectas): ${R.sarp.map(([i,j])=>`${obs[i].k} y ${obs[j].k}`).join("; ")}.`:"Cumple el axioma fuerte: existe una utilidad que explica estas compras."}</div>`)};
  $("sim").querySelectorAll("input").forEach(e=>e.addEventListener("input",run));run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Presupuesto","Recta presupuestaria","p₁x₁ + p₂x₂ = m; pendiente −p₁/p₂"],["Preferencias","TMS","UMg₁/UMg₂"],["Elección","Tangencia","TMS = p₁/p₂ ⇔ UMg₁/p₁ = UMg₂/p₂"],["Elección","Cobb-Douglas","x₁ = a/(a+b)·m/p₁; x₂ = b/(a+b)·m/p₂"],["Elección","Complementarios","x₁ = bm/(bp₁ + ap₂) con u = mín{ax₁, bx₂}"],["Elección","Cuasilineal","x₁ = a·p₂/p₁ con u = a ln x₁ + x₂"],["Elección","Dualidad","e(p, v(p, m)) = m; h(p, u) = x(p, e(p, u)); ∂e/∂pᵢ = hᵢ"],
    ["Slutsky","Ingreso compensado","m′ = m + Δp₁·x₁"],["Slutsky","Ecuación","∂x₁/∂p₁ = ∂x₁ˢ/∂p₁ − x₁·∂x₁/∂m"],["Slutsky","Con dotaciones","dx₁/dp₁ = ∂x₁ˢ/∂p₁ + (ω₁ − x₁)·∂x₁/∂m"],["Excedentes","Variación compensatoria","VC = e(p′, u⁰) − m"],["Excedentes","Variación equivalente","VE = m − e(p, u¹)"],["Excedentes","Excedente del consumidor","∫ de la demanda entre los precios"],
    ["Demanda","Elasticidad precio","ε = (∂q/∂p)(p/q); lineal: −bp/q"],["Demanda","Ingreso marginal","IMg = p(1 + 1/ε)"],["Demanda","Elasticidad renta y cruzada","η = (∂q/∂m)(m/q); ε₁₂ = (∂q₁/∂p₂)(p₂/q₁)"],["Intertemporal","Restricción","c₁ + c₂/(1+r) = m₁ + m₂/(1+r)"],["Intertemporal","Tasa real","1 + ρ = (1 + r)/(1 + π)"],
    ["Producción","Medio y marginal","PMe = q/L; PMg = ∂q/∂L"],["Producción","RMST","PMg_L/PMg_K"],["Producción","Elasticidad de sustitución","σ = dln(K/L)/dln(RMST); CES: 1/(1 − ρ)"],["Producción","Homogeneidad","f(tL, tK) = tᵏf(L, K)"],
    ["Costos","Minimización","PMg_L/PMg_K = w/r"],["Costos","Cobb-Douglas","C = (α+β)(q/A)^(1/(α+β))(w/α)^(α/(α+β))(r/β)^(β/(α+β))"],["Costos","Corto plazo","CT = CF + CV; CMg = w/PMg_L; CVMe = w/PMe_L"],
    ["Beneficio","Óptimo","p = CMg (tramo creciente)"],["Beneficio","Cierre","producir si p ≥ mín CVMe"],["Beneficio","Excedente del productor","EP = I − CV = π + CF"],["Beneficio","Hotelling","∂π/∂p = q"],["Industria","Largo plazo","p = mín CMe; n = Qᵈ(p)/q_mínCMe"],
    ["Equilibrio","Lineal","p* = (a − c)/(b + d)"],["Equilibrio","Telaraña","converge si d < b"],["Bienestar","Incidencia","carga del consumidor = εs/(εs − εd) = d/(b + d)"],["Bienestar","Pérdida irrecuperable","½·t·ΔQ"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Slutsky"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
