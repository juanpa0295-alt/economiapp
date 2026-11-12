
// ===================== LABORATORIOS DEL PROGRAMA 1504110 =====================
(function(){
const R0=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const gs=R=>{const u=R()||1e-12,v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const T=A=>A[0].map((_,j)=>A.map(r=>r[j])),MM=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
const INV=A=>{const n=A.length,M=A.map((r,i)=>[...r,...A.map((_,j)=>i===j?1:0)]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];const d=M[c][c];if(Math.abs(d)<1e-14)return null;for(let j=0;j<2*n;j++)M[c][j]/=d;for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];for(let j=0;j<2*n;j++)M[r][j]-=f*M[c][j]}}return M.map(r=>r.slice(n))};
const col=v=>v.map(x=>[x]),mean=a=>a.reduce((s,v)=>s+v,0)/a.length,vr=a=>{const m=mean(a);return a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1)};
const ols=(X,y)=>{const XtXi=INV(MM(T(X),X)),b=MM(XtXi,MM(T(X),col(y))).map(r=>r[0]),e=y.map((v,i)=>v-X[i].reduce((s,x,j)=>s+x*b[j],0));return{b,e,XtXi,scr:e.reduce((s,v)=>s+v*v,0)}};
const chi=(x,k)=>DIST.chi2(k).cdf(x),pf=p=>p<1e-4?"&lt; 0,0001":fmt(p,4);
const sc=({xr,yr,pts,xl,yl,label,hl=[]})=>{const W=600,H=260,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl);
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${f.g}${hl.map(h=>`<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(h)}" y2="${f.sy(h)}" stroke="var(--muted)" stroke-dasharray="5 4"/>`).join("")}${pts.map(p=>`<circle cx="${f.sx(p[0]).toFixed(1)}" cy="${f.sy(Math.max(yr[0],Math.min(yr[1],p[1]))).toFixed(1)}" r="${p[3]||4}" fill="var(${p[2]||"--line"})" fill-opacity=".8"/>`).join("")}</svg></div>`};

SIMS.mvtest=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("mt-n","n",10,500,1,50)}${ctl("mt-k","k (coeficientes del no restringido)",2,10,1,4)}${ctl("mt-q","q (restricciones)",1,5,1,2)}${ctl("mt-u","SCR no restringida",1,500,1,100)}${ctl("mt-r","SCR restringida",1,600,1,120)}</div><div class="res" id="mt-res"></div><div id="mt-st"></div>`;
  const run=()=>{const n=V("mt-n"),k=V("mt-k"),q=V("mt-q"),u=V("mt-u"),r=V("mt-r");if(!(r>=u&&n>k&&q<k)){$("mt-res").innerHTML=err("la SCR restringida no puede ser menor que la no restringida, n > k y q < k.");$("mt-st").innerHTML="";return}
    const W=n*(r-u)/u,LR=n*Math.log(r/u),LM=n*(r-u)/r,F=((r-u)/q)/(u/(n-k)),cr=DIST.chi2(q).ppf(0.95);
    $("mt-res").innerHTML=tiles([["Wald",fmt(W,4)],["LR",fmt(LR,4)],["LM",fmt(LM,4)],["F",fmt(F,4)],["Crítico χ²(q) al 5 %",fmt(cr,4)],["p-valor de F",pf(1-DIST.f(q,n-k).cdf(F))]]);
    $("mt-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">W = n(SCR<sub>R</sub> − SCR<sub>NR</sub>)/SCR<sub>NR</sub> = ${fm(n)}·${fm(r-u)}/${fm(u)} = ${fmt(W,4)} (p = ${pf(1-chi(W,q))})<br>LR = n·ln(SCR<sub>R</sub>/SCR<sub>NR</sub>) = ${fmt(LR,4)} (p = ${pf(1-chi(LR,q))})<br>LM = n(SCR<sub>R</sub> − SCR<sub>NR</sub>)/SCR<sub>R</sub> = ${fmt(LM,4)} (p = ${pf(1-chi(LM,q))})<br>F = [(SCR<sub>R</sub> − SCR<sub>NR</sub>)/q]/[SCR<sub>NR</sub>/(n − k)] = ${fmt(F,4)} con (${q}, ${n-k}) gl</div><p>Se cumple W ≥ LR ≥ LM: con pocos datos pueden dar decisiones distintas; con n grande convergen. En R: <code>lrtest(m0, m)</code>, <code>waldtest(m0, m)</code> (lmtest) y <code>anova(m0, m)</code>.</p>`)};
  bindCtl(["mt-n","mt-k","mt-q","mt-u","mt-r"],run);run()};

SIMS.diag=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("dg-e","Errores",[["norm","Normales"],["t3","t con 3 gl (colas pesadas)"],["exp","Asimétricos"]],"norm")}</div><div class="ctr">${ctl("dg-n","n",15,200,1,40)}${ctl("dg-x","x de la observación atípica",0,40,0.5,25)}${ctl("dg-y","Desviación vertical de la atípica",-30,30,0.5,-12)}</div><div class="res" id="dg-res"></div><div id="dg-pl"></div><div id="dg-t"></div>`;
  let e="norm";
  const run=()=>{const n=Math.round(V("dg-n")),R=R0(11+n),X=[],y=[];for(let i=0;i<n-1;i++){const x=10*R();let u=gs(R);if(e==="t3"){const c=gs(R)**2+gs(R)**2+gs(R)**2;u=gs(R)/Math.sqrt(c/3)}else if(e==="exp")u=-Math.log(1-R())-1;X.push([1,x]);y.push(2+1.5*x+2*u)}
    const xo=V("dg-x");X.push([1,xo]);y.push(2+1.5*xo+V("dg-y"));const k=2,m=ols(X,y),s2=m.scr/(n-k),s=Math.sqrt(s2);
    const h=X.map(r=>r.reduce((a,v,i)=>a+v*r.reduce((b,w,j)=>b+m.XtXi[i][j]*w,0),0)),rs=m.e.map((v,i)=>v/(s*Math.sqrt(1-h[i]))),D=rs.map((r,i)=>r*r/k*h[i]/(1-h[i]));
    const em=mean(m.e),m2=mean(m.e.map(v=>(v-em)**2)),S=mean(m.e.map(v=>(v-em)**3))/Math.pow(m2,1.5),K=mean(m.e.map(v=>(v-em)**4))/(m2*m2),JB=n*(S*S/6+(K-3)**2/24);
    const mc=ols(X.slice(0,-1),y.slice(0,-1));
    $("dg-res").innerHTML=tiles([["Pendiente con la atípica",fmt(m.b[1],4)],["Pendiente sin ella",fmt(mc.b[1],4)],["h de la atípica",fmt(h[n-1],3),h[n-1]>2*k/n?"badt":""],["Cook de la atípica",fmt(D[n-1],3),D[n-1]>4/n?"badt":""],["Jarque-Bera",fmt(JB,3)],["p-valor JB",pf(1-chi(JB,2)),1-chi(JB,2)<0.05?"badt":"okt"]]);
    const xs=X.map(r=>r[1]),lo=Math.min(...y),hi=Math.max(...y),mx=Math.max(...xs,10);
    $("dg-pl").innerHTML=sc({xr:[0,mx*1.05],yr:[lo-2,hi+2],pts:X.map((r,i)=>[r[1],y[i],D[i]>4/n?"--bad":"--line",D[i]>4/n?6:4]),xl:"x",yl:"y",label:"Datos; en rojo, observaciones influyentes"})+`<p class="hint">Recta con todos los datos: ŷ = ${fmt(m.b[0],3)} + ${fmt(m.b[1],3)}x. Sin la atípica: ŷ = ${fmt(mc.b[0],3)} + ${fmt(mc.b[1],3)}x.</p>`;
    const top=D.map((d,i)=>[i,d]).sort((a,b)=>b[1]-a[1]).slice(0,5);
    $("dg-t").innerHTML=`<div class="tbl"><table><tr><th>Obs.</th><th>x</th><th>h</th><th>Residuo estudentizado</th><th>Cook</th></tr>${top.map(([i,d])=>`<tr${d>4/n?' class="hl"':""}><td>${i+1}${i===n-1?" (atípica)":""}</td><td>${fmt(xs[i],2)}</td><td>${fmt(h[i],3)}</td><td>${fmt(rs[i],3)}</td><td>${fmt(d,3)}</td></tr>`).join("")}</table></div><p>Umbrales: h > 2k/n = ${fmt(2*k/n,3)}; |r| > 2; Cook > 4/n = ${fmt(4/n,3)}. Una observación con x lejos del resto (apalancamiento) <i>y</i> mal ajustada (residuo grande) arrastra la recta.</p>`};
  bindSeg("dg-e",v=>{e=v;run()});bindCtl(["dg-n","dg-x","dg-y"],run);run()};

SIMS.mcg=function(){
  $("sim").innerHTML=`<div style="margin-bottom:10px">${seg("mg-m","Modo",[["calc","Calculadora del ejemplo de clase"],["sim","¿Cuánto gana MCG? (simulación)"]],"calc")}</div><div id="mg-box"></div>`;
  const simu=()=>{
  $("mg-box").innerHTML=`<div class="ctr">${ctl("mg-h","Heterocedasticidad: Var(u) = σ²x^h, h =",0,4,0.1,2)}${ctl("mg-n","n",10,200,1,40)}</div><p class="hint">500 muestras de y = 1 + 2x + u con x entre 1 y 10. Se comparan MCO y MCG (mínimos cuadrados ponderados con los pesos verdaderos 1/x^(h/2)).</p><div class="res" id="mg-res"></div><div id="mg-st"></div>`;
  const run=()=>{const h=V("mg-h"),n=Math.round(V("mg-n")),R=R0(99),xs=[...Array(n)].map((_,i)=>1+9*i/(n-1)),bo=[],bg=[],seo=[];
    for(let r=0;r<500;r++){const y=xs.map(x=>1+2*x+Math.pow(x,h/2)*gs(R)),X=xs.map(x=>[1,x]),o=ols(X,y);bo.push(o.b[1]);seo.push(Math.sqrt(o.scr/(n-2)*o.XtXi[1][1]));const w=xs.map(x=>Math.pow(x,-h/2)),g=ols(X.map((r,i)=>r.map(v=>v*w[i])),y.map((v,i)=>v*w[i]));bg.push(g.b[1])}
    const vo=vr(bo),vg=vr(bg),sec=mean(seo);
    $("mg-res").innerHTML=tiles([["Media de β̂ MCO",fmt(mean(bo),4)],["Media de β̂ MCG",fmt(mean(bg),4)],["Desv. real de MCO",fmt(Math.sqrt(vo),4)],["Desv. real de MCG",fmt(Math.sqrt(vg),4),"okt"],["Eficiencia relativa Var(MCG)/Var(MCO)",fmt(vg/vo,3)],["Error estándar MCO reportado (promedio)",fmt(sec,4),Math.abs(sec/Math.sqrt(vo)-1)>0.1?"badt":""]]);
    $("mg-st").innerHTML=stp(1,"Lectura",`<p>Los dos estimadores son insesgados (medias cerca de 2), pero con h = ${fm(h)} la varianza de MCG es el ${fmt(100*vg/vo,1)} % de la de MCO. Además, el error estándar que reporta MCO con la fórmula usual (${fmt(sec,4)}) ${Math.abs(sec/Math.sqrt(vo)-1)>0.1?"se aleja":"se parece"} de su desviación real (${fmt(Math.sqrt(vo),4)}): por eso con heterocedasticidad se usan errores robustos o MCG. Con h = 0 no hay diferencia.</p><pre class="code"><code>m_mco &lt;- lm(y ~ x)\nm_mcp &lt;- lm(y ~ x, weights = 1/x^${fm(h).replace(",",".")})   # MCG con pesos 1/Var(u)\nlibrary(sandwich); lmtest::coeftest(m_mco, vcov = vcovHC(m_mco))</code></pre>`)};
  bindCtl(["mg-h","mg-n"],run);run()};
  const n7=v=>isFinite(v)?v.toLocaleString("es-CO",{maximumSignificantDigits:8}):"—";
  const mat=A=>`<span style="display:inline-grid;grid-template-columns:repeat(${A[0].length},auto);gap:2px 14px;vertical-align:middle;border-left:2px solid currentColor;border-right:2px solid currentColor;border-radius:6px;padding:4px 10px;margin:4px 2px;font-family:var(--f-mono);font-size:13px;text-align:right">${A.flat().map(v=>`<span>${typeof v==="number"?n7(v):v}</span>`).join("")}</span>`;
  const num=t=>t.trim().split(/[\s;]+/).filter(Boolean).map(v=>parseFloat(v.replace(",",".")));
  const calc=()=>{
    $("mg-box").innerHTML=`<div class="calcf"><label>Y (separa con espacios)<input type="text" id="mg-y" value="120 130 150 160 180 200" spellcheck="false"></label><label>X (separa con espacios)<input type="text" id="mg-x" value="4 25 30 36 40 49" spellcheck="false"></label></div>
    <div style="margin:8px 0">${seg("mg-v","var(uₜ)",[["1","σ²·Xₜ"],["2","σ²·Xₜ²"],["0.5","σ²·√Xₜ"],["0","σ² (homocedástico)"]],"1")}</div>
    <p class="hint">Viene cargado el Ejemplo 3 de clase (ventas y publicidad). Cambia los datos o la forma de la varianza y mira cómo cambia cada paso. Se usan decimales con punto o coma.</p><div id="mg-out"></div>`;
    let h=1;
    const run=()=>{const y=num($("mg-y").value),x=num($("mg-x").value),o=$("mg-out");
      if(y.length!==x.length||y.length<3||y.some(isNaN)||x.some(isNaN)){o.innerHTML=err("Y y X deben tener el mismo número de datos (al menos 3) y ser números.");return}
      if(h&&x.some(v=>v<=0)){o.innerHTML=err("con var(uₜ) = σ²·Xₜ^h, todos los X deben ser positivos.");return}
      const n=y.length,k=2,w=x.map(v=>Math.pow(v,-h)),S=f=>x.reduce((s,_,i)=>s+f(i),0);
      const a11=S(i=>w[i]),a12=S(i=>w[i]*x[i]),a22=S(i=>w[i]*x[i]*x[i]),c1=S(i=>w[i]*y[i]),c2=S(i=>w[i]*x[i]*y[i]);
      const d=a11*a22-a12*a12;if(Math.abs(d)<1e-12){o.innerHTML=err("X′Ω⁻¹X no es invertible (¿todos los X iguales?).");return}
      const I=[[a22/d,-a12/d],[-a12/d,a11/d]],b1=I[0][0]*c1+I[0][1]*c2,b2=I[1][0]*c1+I[1][1]*c2;
      const sx=S(i=>x[i]),sxx=S(i=>x[i]*x[i]),sy=S(i=>y[i]),sxy=S(i=>x[i]*y[i]),d0=n*sxx-sx*sx,I0=[[sxx/d0,-sx/d0],[-sx/d0,n/d0]],o1=I0[0][0]*sy+I0[0][1]*sxy,o2=I0[1][0]*sy+I0[1][1]*sxy;
      const yy=S(i=>w[i]*y[i]*y[i]),bxy=b1*c1+b2*c2,cor=c1*c1/a11,e=y.map((v,i)=>v-b1-b2*x[i]),s2=S(i=>w[i]*e[i]*e[i])/(n-k),eo=y.map((v,i)=>v-o1-o2*x[i]),s2o=S(i=>eo[i]*eo[i])/(n-k);
      const om=x.map((_,i)=>1/w[i]),m11=S(i=>om[i]),m12=S(i=>om[i]*x[i]),m22=S(i=>om[i]*x[i]*x[i]);
      const vo22=s2*(I0[1][0]*(I0[1][0]*m11+I0[1][1]*m12)+I0[1][1]*(I0[1][0]*m12+I0[1][1]*m22)),vo11=s2*(I0[0][0]*(I0[0][0]*m11+I0[0][1]*m12)+I0[0][1]*(I0[0][0]*m12+I0[0][1]*m22));
      const hs=h===1?"Xₜ":h===2?"Xₜ²":h===0.5?"√Xₜ":"1",ws=h===0?"1":h===1?"1/Xₜ":h===2?"1/Xₜ²":"1/√Xₜ";
      o.innerHTML=stp(1,"Ω y Ω⁻¹",`<p>var(u) = σ²Ω con Ω = diag(${x.map(v=>n7(Math.pow(v,h))).join("; ")}). Su inversa es diagonal con los recíprocos: el peso de cada observación es ${ws}.</p>`)+
      stp(2,"Tabla de trabajo",`<div class="tbl"><table><tr><th>t</th><th>Yₜ</th><th>Xₜ</th><th>peso ${ws}</th><th>peso·Xₜ</th><th>peso·Xₜ²</th><th>peso·Yₜ</th><th>peso·XₜYₜ</th></tr>${x.map((v,i)=>`<tr><td>${i+1}</td><td>${n7(y[i])}</td><td>${n7(v)}</td><td>${n7(w[i])}</td><td>${n7(w[i]*v)}</td><td>${n7(w[i]*v*v)}</td><td>${n7(w[i]*y[i])}</td><td>${n7(w[i]*v*y[i])}</td></tr>`).join("")}<tr><th>Σ</th><th></th><th></th><th>${n7(a11)}</th><th>${n7(a12)}</th><th>${n7(a22)}</th><th>${n7(c1)}</th><th>${n7(c2)}</th></tr></table></div>`)+
      stp(3,"X′Ω⁻¹X y X′Ω⁻¹y",`<p>X′Ω⁻¹X = ${mat([[a11,a12],[a12,a22]])} &nbsp; X′Ω⁻¹y = ${mat([[c1],[c2]])}</p>`)+
      stp(4,"Inversa",`<p>Determinante = ${n7(a11)}·${n7(a22)} − ${n7(a12)}² = ${n7(d)}</p><p>(X′Ω⁻¹X)⁻¹ = ${mat(I)}</p>`)+
      stp(5,"b_MCG = (X′Ω⁻¹X)⁻¹ X′Ω⁻¹y",`<p>${mat([[b1],[b2]])} → Ŷₜ = ${n7(+b1.toFixed(4))} + ${n7(+b2.toFixed(4))}·Xₜ</p>`)+
      stp(6,"Comparación con MCO",`<div class="res">${tiles([["β̂₁ MCO",fmt(o1,4)],["β̂₂ MCO",fmt(o2,4)],["β̂₁ MCG",fmt(b1,4),"okt"],["β̂₂ MCG",fmt(b2,4),"okt"],["σ̂² con residuos ponderados",fmt(s2,4)],["e.e.(β̂₂) MCG",fmt(Math.sqrt(s2*I[1][1]),4),"okt"],["e.e.(β̂₂) MCO correcto",fmt(Math.sqrt(vo22),4)],["e.e.(β̂₂) MCO fórmula usual",fmt(Math.sqrt(s2o*I0[1][1]),4),h?"badt":""]])}</div>
      <p>${h?`Var(β̂₂) por MCG es el ${fmt(100*s2*I[1][1]/vo22,1)} % de la de MCO. El «e.e. fórmula usual» s²(X′X)⁻¹ no es válido con heterocedasticidad.`:"Con varianza constante (Ω = I), MCG y MCO coinciden."}${h?` Modelo transformado equivalente: dividir todo por √(${hs}) y estimar por MCO sin intercepto.`:""}</p>
      <pre class="code"><code>y &lt;- c(${y.join(", ")}); x &lt;- c(${x.join(", ")})\nsummary(lm(y ~ x, weights = 1/x^${h}))   # MCG con Ω = diag(x^${h})</code></pre>`)+
      stp(7,"Sumas de cuadrados por MCG",`<div class="tbl"><table><tr><th>Término</th><th>Fórmula</th><th>Valor</th></tr><tr><td>y′Ω⁻¹y</td><td>Σ peso·Yₜ²</td><td>${n7(yy)}</td></tr><tr><td>b′X′Ω⁻¹y</td><td>b₁·${n7(c1)} + b₂·${n7(c2)}</td><td>${n7(bxy)}</td></tr><tr><td>Corrección</td><td>(Σ peso·Yₜ)² / Σ peso = ${n7(c1)}² / ${n7(a11)}</td><td>${n7(cor)}</td></tr><tr><th>SCT</th><td>y′Ω⁻¹y − corrección</td><th>${n7(yy-cor)}</th></tr><tr><th>SCE</th><td>b′X′Ω⁻¹y − corrección</td><th>${n7(bxy-cor)}</th></tr><tr><th>SCR</th><td>y′Ω⁻¹y − b′X′Ω⁻¹y = e′Ω⁻¹e</td><th>${n7(yy-bxy)}</th></tr></table></div>
      <div class="res">${tiles([["Media ponderada ȳ",fmt(c1/a11,4)],["R² MCG",fmt((bxy-cor)/(yy-cor),4),"okt"],["R² ajustado",fmt(1-((yy-bxy)/(n-k))/((yy-cor)/(n-1)),4)],["F (1, n−2)",fmt((bxy-cor)/s2,3)]])}</div>`);
    };
    bindSeg("mg-v",v=>{h=+v;run()});$("mg-y").oninput=run;$("mg-x").oninput=run;run()};
  bindSeg("mg-m",m=>m==="sim"?simu():calc());calc()};

SIMS.gmm=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("gm-n","n",50,2000,10,400)}${ctl("gm-e","Endogeneidad: Cov(x, u)",0,0.9,0.05,0.5)}${ctl("gm-z","Fuerza de los instrumentos",0.05,1.5,0.05,0.6)}${ctl("gm-v","Invalidez de z₂: Cov(z₂, u)",0,0.8,0.05,0)}${ctl("gm-h","Heterocedasticidad",0,2,0.1,1)}</div><p class="hint">y = 1 + 2x + u; x es endógena; z₁ y z₂ son instrumentos (sobreidentificado: 3 momentos, 2 parámetros).</p><div class="res" id="gm-res"></div><div id="gm-st"></div>`;
  const run=()=>{const n=Math.round(V("gm-n")),ce=V("gm-e"),pz=V("gm-z"),cv=V("gm-v"),het=V("gm-h"),R=R0(2026),X=[],Z=[],y=[];
    for(let i=0;i<n;i++){const z1=gs(R),z2=gs(R),e=gs(R),v=gs(R),u0=e*Math.exp(het*0.5*z1)/Math.exp(het*het/4),u=u0+cv*z2,x=pz*(z1+z2)+ce*e+Math.sqrt(1-ce*ce)*v;X.push([1,x]);Z.push([1,z1,z2]);y.push(1+2*x+u)}
    const o=ols(X,y),Zt=T(Z),ZX=MM(Zt,X),Zy=MM(Zt,col(y)),est=W=>{const A=MM(MM(T(ZX),W),ZX),b=MM(INV(A),MM(MM(T(ZX),W),Zy)).map(r=>r[0]);return b};
    const W1=INV(MM(Zt,Z)),b1=est(W1),e1=y.map((v,i)=>v-X[i][0]*b1[0]-X[i][1]*b1[1]),S=[0,1,2].map(a=>[0,1,2].map(c=>Z.reduce((s,z,i)=>s+z[a]*z[c]*e1[i]*e1[i],0)/n)),W2=INV(S),b2=est(W2);
    const e2=y.map((v,i)=>v-X[i][0]*b2[0]-X[i][1]*b2[1]),gbar=[0,1,2].map(a=>Z.reduce((s,z,i)=>s+z[a]*e2[i],0)/n),J=n*gbar.reduce((s,ga,a)=>s+ga*gbar.reduce((t,gc,c)=>t+W2[a][c]*gc,0),0),pJ=1-chi(J,1);
    const G=MM(Zt,X).map(r=>r.map(v=>v/n)),Vg=INV(MM(MM(T(G),W2),G)),se2=Math.sqrt(Vg[1][1]/n);
    $("gm-res").innerHTML=tiles([["β MCO (verdadero 2)",fmt(o.b[1],4),Math.abs(o.b[1]-2)>0.1?"badt":""],["β MC2E",fmt(b1[1],4)],["β GMM eficiente",fmt(b2[1],4),"okt"],["ee GMM",fmt(se2,4)],["J de Hansen (1 gl)",fmt(J,3)],["p-valor de J",pf(pJ),pJ<0.05?"badt":"okt"]]);
    $("gm-st").innerHTML=stp(1,"Dos etapas",`<div class="eq al">1. MC2E: W = (Z′Z)⁻¹ ⟹ β̂ = ${fmt(b1[1],4)}<br>2. Con los residuos de la etapa 1: Ŝ = (1/n)Σ zᵢzᵢ′êᵢ² y W = Ŝ⁻¹ ⟹ β̂<sub>GMM</sub> = ${fmt(b2[1],4)}<br>J = n·ḡ′Ŝ⁻¹ḡ = ${fmt(J,3)} ~ χ²(3 − 2 = 1)</div><p>${ce>0?"MCO está sesgado por la endogeneidad; los estimadores con instrumentos lo corrigen. ":""}${cv>0?"Como z₂ está correlacionado con u, la prueba J tiende a rechazar la validez de los instrumentos. ":"Con instrumentos válidos, J no debería rechazar. "}Instrumentos débiles (fuerza baja) vuelven imprecisos y sesgados a MC2E y GMM.</p><pre class="code"><code>library(gmm)\nsummary(gmm(y ~ x, ~ z1 + z2))          # incluye la prueba J\nsummary(AER::ivreg(y ~ x | z1 + z2), diagnostics = TRUE)</code></pre>`)};
  bindCtl(["gm-n","gm-e","gm-z","gm-v","gm-h"],run);run()};
})();
