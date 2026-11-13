// Estadística II · laboratorios interactivos
const SIMS={};

// ---- Estimadores: una muestra y 1.000 repeticiones
SIMS.estim=function(){
  let seed=20261029;
  $("sim").innerHTML=`<p>Define la población y extrae muestras, como en el botón de Economiapp. Además se repite el muestreo 1.000 veces para ver las propiedades en acción.</p>
  <div class="ctr">${ctl("e-mu","Media poblacional (μ)",0,100,0.5,50)}${ctl("e-sg","Desviación estándar (σ)",1,30,0.5,10)}${ctl("e-n","Tamaño de muestra (n)",2,200,1,30)}</div>
  <div class="row"><button class="btn solid" type="button" id="e-new">Extraer nueva muestra</button></div>
  <h4 class="subh">Tu muestra</h4><div class="res" id="e-one"></div>
  <h4 class="subh">Si repites el muestreo 1.000 veces</h4>
  <div class="legend"><span><i style="background:var(--line);height:10px;opacity:.5"></i>Medias muestrales obtenidas</span><span><i style="background:var(--ink)"></i>Normal(μ, σ²/n) de la teoría</span></div>
  <div class="plot" id="e-plot"></div><div class="res" id="e-many"></div><div class="verdict acc" id="e-ver"></div>`;
  const run=()=>{const mu=V("e-mu"),sg=V("e-sg"),n=Math.round(V("e-n"));
    if(!(sg>0)||!(n>=2)||!isFinite(mu)){$("e-one").innerHTML=err("σ debe ser positiva y n al menos 2.");return}
    const K=1000,R=rng(seed),Z=normals(R,K*n),means=new Float64Array(K);let sS=0,sB=0;
    for(let k=0;k<K;k++){const x=Array.from(Z.subarray(k*n,(k+1)*n),z=>mu+sg*z),r=CALC.muestra(x,mu);means[k]=r.media_muestral;sS+=r.var_insesgada;sB+=r.var_sesgada;
      if(k===0)$("e-one").innerHTML=tiles([["Media muestral x̄",fmt(r.media_muestral)],["Error |x̄ − μ|",fmt(r.error_media)],["S² (divide por n − 1)",fmt(r.var_insesgada),"okt"],["σ̂² (divide por n)",fmt(r.var_sesgada),"badt"]])}
    let m=0;for(const v of means)m+=v;m/=K;let vm=0;for(const v of means)vm+=(v-m)**2;vm/=K-1;
    const se=sg/Math.sqrt(n),lo=mu-4*se,hi=mu+4*se,B=32,w=(hi-lo)/B,cnt=new Array(B).fill(0);
    for(const v of means){const j=Math.floor((v-lo)/w);if(j>=0&&j<B)cnt[j]++}
    const ym=Math.max(...cnt,K*w*npdf(0)/se)*1.15;
    const f=frame(600,250,[lo,hi],[0,ym],ticks(lo,hi,nice((hi-lo)/6)),ticks(0,ym,nice(ym/4)),"x̄","frecuencia");
    let b=cnt.map((c,j)=>`<rect x="${f.sx(lo+j*w)+1}" y="${f.sy(c)}" width="${Math.max(0,f.sx(lo+w)-f.sx(lo)-2)}" height="${f.sy(0)-f.sy(c)}" fill="var(--line)" fill-opacity=".45"/>`).join("");
    let d="";for(let i=0;i<=160;i++){const x=lo+(hi-lo)*i/160;d+=(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(K*w*npdf((x-mu)/se)/se).toFixed(1)}
    b+=`<path d="${d}" fill="none" stroke="var(--ink)" stroke-width="2"/><line x1="${f.sx(mu)}" x2="${f.sx(mu)}" y1="${f.sy(ym)}" y2="${f.sy(0)}" stroke="var(--bad)" stroke-dasharray="5 4" stroke-width="1.5"/><text x="${f.sx(mu)+5}" y="${f.sy(ym)+12}" font-size="11.5" fill="var(--bad)">μ = ${fm(mu)}</text>`;
    $("e-plot").innerHTML=`<svg viewBox="0 0 600 250" role="img" aria-label="Histograma de 1.000 medias muestrales con la normal teórica">${f.g}${b}</svg>`;
    const s2=sg*sg;
    $("e-many").innerHTML=tiles([["Promedio de x̄ (μ = "+fm(mu)+")",fmt(m)],["Varianza de x̄ (σ²/n = "+fmt(s2/n,3)+")",fmt(vm,3)],["Promedio de S²",fmt(sS/K)],["Promedio de σ̂²",fmt(sB/K)],["σ² verdadera",fmt(s2)]]);
    $("e-ver").innerHTML=`En promedio S² = ${fmt(sS/K)} queda junto a σ² = ${fmt(s2)}: es insesgado. σ̂² = ${fmt(sB/K)} la subestima; la teoría predice (n − 1)/n · σ² = ${fmt(s2*(n-1)/n)}. Sube n y verás que las medias se concentran alrededor de μ (consistencia) y que el sesgo de σ̂² desaparece.`};
  bindCtl(["e-mu","e-sg","e-n"],run);
  $("e-new").onclick=()=>{seed=(seed*1103515245+12345)>>>0;run()};
  run();
};

// ---- Máxima verosimilitud: curva de ln L(μ)
SIMS.mle=function(){
  const R=rng(12),X=Array.from(normals(R,12),z=>+(50+10*z).toFixed(1)),n=X.length,sg=10,xb=X.reduce((a,b)=>a+b)/n;
  const lnL=mu=>-n/2*Math.log(2*Math.PI*sg*sg)-X.reduce((s,x)=>s+(x-mu)**2,0)/(2*sg*sg);
  $("sim").innerHTML=`<p>Una muestra fija de 12 datos de una normal con σ = 10 conocida: <span class="mono">${X.map(v=>fmt(v,1)).join(" · ")}</span>. Mueve la μ candidata y mira cómo cambia la log-verosimilitud.</p>
  <div class="ctr">${ctl("m-mu","μ candidata",35,65,0.1,44)}</div>
  <div class="plot" id="m-plot"></div><div class="res" id="m-res"></div>
  <div class="row"><button class="btn solid" type="button" id="m-max">Ir al máximo</button><span id="m-msg" class="hint"></span></div>`;
  const run=()=>{const mu=V("m-mu");if(!isFinite(mu))return;const lo=35,hi=65,ys=[];for(let i=0;i<=150;i++)ys.push(lnL(lo+(hi-lo)*i/150));
    const y0=Math.min(...ys),y1=lnL(xb),pad=(y1-y0)*.12;const f=frame(600,260,[lo,hi],[y0-pad,y1+pad],ticks(lo,hi,5),ticks(y0-pad,y1+pad,nice((y1-y0)/4)),"μ","ln L(μ)");
    let b=`<path d="${ys.map((y,i)=>(i?"L":"M")+f.sx(lo+(hi-lo)*i/150).toFixed(1)+","+f.sy(y).toFixed(1)).join("")}" fill="none" stroke="var(--line)" stroke-width="2.5"/>`;
    b+=`<line x1="${f.sx(xb)}" x2="${f.sx(xb)}" y1="${f.sy(y1+pad)}" y2="${f.sy(y0-pad)}" stroke="var(--muted)" stroke-dasharray="5 4"/><text x="${f.sx(xb)+5}" y="${f.sy(y1+pad)+12}" font-size="11.5" fill="var(--muted)">x̄ = ${fm(xb)}</text>`;
    const m=Math.max(lo,Math.min(hi,mu)),sl=X.reduce((s,x)=>s+(x-m),0)/(sg*sg),yv=lnL(m),dx=2.5;
    b+=`<line x1="${f.sx(m-dx)}" y1="${f.sy(yv-sl*dx)}" x2="${f.sx(m+dx)}" y2="${f.sy(yv+sl*dx)}" stroke="var(--ink)" stroke-width="1.5"/><circle cx="${f.sx(m)}" cy="${f.sy(yv)}" r="6" fill="var(--ink)"/>`;
    $("m-plot").innerHTML=`<svg viewBox="0 0 600 260" role="img" aria-label="Log-verosimilitud en función de μ">${f.g}${b}</svg>`;
    $("m-res").innerHTML=tiles([["ln L en la candidata",fmt(yv,3)],["ln L máxima",fmt(y1,3)],["Pendiente ∂ln L/∂μ",fmt(sl,3)],["μ̂ MV = x̄",fmt(xb,3)]]);
    $("m-msg").textContent=Math.abs(m-xb)<0.05?"La pendiente es cero: llegaste al máximo, que es x̄.":sl>0?"Pendiente positiva: subir μ aumenta la verosimilitud.":"Pendiente negativa: bajar μ aumenta la verosimilitud."};
  bindCtl(["m-mu"],run);$("m-max").onclick=()=>{$("m-mu").value=+xb.toFixed(2);$("m-mu-r").value=xb;run()};run();
};

// ---- Intervalos y tamaño de muestra (módulo de Economiapp)
SIMS.ic=function(){
  const NIV={"90":1.645,"95":1.96,"99":2.576};let nv="95";
  $("sim").innerHTML=`<div class="lbl">Nivel de confianza (1 − α)</div>${seg("i-nv","Nivel de confianza",[["90","90 % (Z = 1,645)"],["95","95 % (Z = 1,960)"],["99","99 % (Z = 2,576)"]],nv)}
  <div class="ctr">${ctl("i-xb","Media muestral (x̄)",0,300,0.5,105)}${ctl("i-sg","Desviación estándar (σ)",0.5,60,0.5,15)}${ctl("i-n","Tamaño de muestra actual (n)",2,1000,1,100)}${ctl("i-E","Margen de error deseado (E)",0.25,30,0.25,5)}</div>
  <h4 class="subh">Intervalo de confianza</h4><div class="res" id="i-res"></div><div class="plot" id="i-plot"></div><p id="i-int" style="margin:0"></p>
  <h4 class="subh">Tamaño de muestra requerido</h4><div id="i-n2"></div>`;
  const run=()=>{const Z=NIV[nv],v={x_bar:V("i-xb"),sigma:V("i-sg"),n_actual:Math.round(V("i-n")),E:V("i-E"),Z};
    if(!(v.sigma>0)||!(v.n_actual>=1)||!(v.E>0)||!isFinite(v.x_bar)){$("i-res").innerHTML=err("σ y E deben ser positivos y n al menos 1.");return}
    const r=CALC.intervalo(v),se=r.error_estandar;
    $("i-res").innerHTML=tiles([["Límite inferior",fmt(r.lim_inf)],["Media puntual x̄",fmt(v.x_bar)],["Límite superior",fmt(r.lim_sup)],["Error estándar σ/√n",fmt(se,3)],["Margen Z·σ/√n",fmt(r.margen_error_actual,3)]]);
    const pdf=x=>npdf((x-v.x_bar)/se)/se;
    $("i-plot").innerHTML=curvePlot({lo:v.x_bar-4*se,hi:v.x_bar+4*se,curves:[{f:pdf}],areas:[{f:pdf,a:r.lim_inf,b:r.lim_sup,col:"--line",op:.3}],
      marks:[{x:r.lim_inf,label:fmt(r.lim_inf),col:"--line",dash:1},{x:r.lim_sup,label:fmt(r.lim_sup),col:"--line",dash:1}],xl:"medias muestrales",label:"Distribución de las medias muestrales con el intervalo sombreado"});
    $("i-int").innerHTML=`<b>Interpretación:</b> con el procedimiento al ${nv} %, el intervalo para la media poblacional va de <b>${fmt(r.lim_inf)}</b> a <b>${fmt(r.lim_sup)}</b>. El área sombreada equivale al ${nv} % de las medias muestrales posibles.`;
    const nr=r.n_requerido,raw=((Z*v.sigma)/v.E)**2;
    $("i-n2").innerHTML=`<div class="eq">n = (${fr(`${fm(Z)} · ${fm(v.sigma)}`,fm(v.E))})² = ${fmt(raw,2)} &nbsp;→&nbsp; <b>${nr.toLocaleString("es-CO")}</b><span class="note">Si quieres que la estimación no falle por más de ±${fm(v.E)} con ${nv} % de confianza, se redondea hacia arriba.</span></div>`+
      (nr>v.n_actual?`<div class="verdict warnv">Te faltan ${(nr-v.n_actual).toLocaleString("es-CO")} observaciones para alcanzar esa precisión.</div>`:`<div class="verdict acc">Tu muestra actual (${v.n_actual.toLocaleString("es-CO")}) ya es suficiente para ese margen de error.</div>`)};
  bindCtl(["i-xb","i-sg","i-n","i-E"],run);bindSeg("i-nv",x=>{nv=x;run()});run();
};

// ---- Cobertura: 50 intervalos
SIMS.cob=function(){
  const NIV={"90":1.645,"95":1.96,"99":2.576};let nv="95",seed=7,acc=[0,0];
  $("sim").innerHTML=`${seg("c-nv","Nivel de confianza",[["90","90 %"],["95","95 %"],["99","99 %"]],nv)}
  <div class="ctr">${ctl("c-n","Tamaño de cada muestra (n)",5,200,1,25)}</div>
  <div class="row"><button class="btn solid" type="button" id="c-new">Sacar 50 muestras nuevas</button></div>
  <div class="legend"><span><i style="background:var(--line)"></i>Contiene a μ</span><span><i style="background:var(--bad)"></i>No contiene a μ</span></div>
  <div class="plot" id="c-plot"></div><div class="res" id="c-res"></div>`;
  const mu=100,sg=15;
  const run=(add)=>{const n=Math.round(V("c-n"));if(!(n>=2))return;const Z=NIV[nv],se=sg/Math.sqrt(n),R=rng(seed),K=50,E=normals(R,K*n);
    const iv=[];let hit=0;for(let k=0;k<K;k++){let s=0;for(let i=0;i<n;i++)s+=mu+sg*E[k*n+i];const xb=s/n,ok=Math.abs(xb-mu)<=Z*se;hit+=ok;iv.push([xb-Z*se,xb+Z*se,ok])}
    if(add){acc[0]+=hit;acc[1]+=K}
    const H=K*7+48,lo=mu-6*se,hi=mu+6*se,f=frame(600,H,[lo,hi],[0,K+1],ticks(lo,hi,nice((hi-lo)/6)),[],"valor de la media","");
    let b=`<line x1="${f.sx(mu)}" x2="${f.sx(mu)}" y1="${f.T}" y2="${f.sy(0)}" stroke="var(--ink)" stroke-width="1.5"/><text x="${f.sx(mu)+5}" y="${f.T+9}" font-size="11.5" fill="var(--ink)">μ = 100</text>`;
    iv.forEach(([a,c,ok],k)=>{const y=f.sy(K-k);b+=`<line x1="${f.sx(Math.max(lo,a))}" x2="${f.sx(Math.min(hi,c))}" y1="${y}" y2="${y}" stroke="var(${ok?"--line":"--bad"})" stroke-width="${ok?2:3}" stroke-linecap="round"/>`});
    $("c-plot").innerHTML=`<svg viewBox="0 0 600 ${H}" role="img" aria-label="Cincuenta intervalos de confianza y la media verdadera">${f.g}${b}</svg>`;
    $("c-res").innerHTML=tiles([["Contienen a μ",`${hit} de ${K}`],["Proporción",fmt(hit/K*100,0)+" %"],["Se esperaba",nv+" %"],["Acumulado",acc[1]?`${fmt(acc[0]/acc[1]*100,1)} % de ${acc[1].toLocaleString("es-CO")}`:"—"]])};
  bindCtl(["c-n"],()=>{acc=[0,0];run(true)});
  bindSeg("c-nv",x=>{nv=x;acc=[0,0];run(true)});
  $("c-new").onclick=()=>{seed=(seed*1664525+1013904223)>>>0;run(true)};run(true);
};

// ---- Pruebas de hipótesis (módulo de Economiapp)
SIMS.prueba=function(){
  const CFG={
    z:[["mu_0","Media hipotética (μ₀)",0,200,0.5,50],["x_bar","Media muestral (x̄)",0,200,0.5,52],["sigma","Desv. est. poblacional (σ)",0.1,50,0.1,5],["n","Tamaño muestral (n)",2,500,1,30],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    t:[["mu_0","Media hipotética (μ₀)",0,200,0.5,50],["x_bar","Media muestral (x̄)",0,200,0.5,52],["s","Desv. est. muestral (s)",0.1,50,0.1,5.5],["n","Tamaño muestral (n)",2,500,1,20],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    p:[["p_0","Prop. hipotética (p₀)",0.01,0.99,0.01,0.5],["p_hat","Prop. muestral (p̂)",0,1,0.01,0.6],["n","Tamaño muestral (n)",2,2000,1,100],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]]};
  const mem={z:{},t:{},p:{}};let tipo="z",cola="dos";
  $("sim").innerHTML=`<div class="lbl">Parámetro y estadístico</div>${seg("h-tipo","Parámetro y estadístico",[["z","Media, σ conocida (Z)"],["t","Media, σ desconocida (t)"],["p","Proporción (Z)"]],tipo)}
  <div class="lbl">Hipótesis alternativa</div>${seg("h-cola","Tipo de prueba",COLAS,cola)}
  <div class="ctr" id="h-in"></div><div id="h-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const build=()=>{$("h-in").innerHTML=CFG[tipo].map(([k,l,a,b,s,d])=>ctl(`h${tipo}-${k}`,l,a,b,s,mem[tipo][k]??d)).join("");bindCtl(CFG[tipo].map(c=>`h${tipo}-${c[0]}`),run)};
  const run=()=>{const v={};CFG[tipo].forEach(([k])=>{v[k]=V(`h${tipo}-${k}`);mem[tipo][k]=v[k]});v.n=Math.round(v.n);
    const bad=!(v.n>=2)||!(v.alpha>0&&v.alpha<1)||(tipo==="p"?!(v.p_0>0&&v.p_0<1&&v.p_hat>=0&&v.p_hat<=1):!(isFinite(v.mu_0)&&isFinite(v.x_bar)&&(tipo==="z"?v.sigma>0:v.s>0)));
    if(bad){$("h-out").innerHTML=err(tipo==="p"?"p₀ debe estar entre 0 y 1, p̂ entre 0 y 1, n ≥ 2 y 0 < α < 1.":"la desviación debe ser positiva, n ≥ 2 y 0 < α < 1.");return}
    const r=CALC.prueba(tipo,cola,v),par=tipo==="p"?"p":"μ",nm=tipo==="t"?"T":"Z",[o0,o1]=OPS[cola];
    const sub=tipo==="p"?`Z = ${fr("p̂ − p₀",rt(fr("p₀(1 − p₀)","n")))} = ${fr(`${fm(v.p_hat)} − ${fm(v.p_0)}`,rt(fr(`${fm(v.p_0)}(1 − ${fm(v.p_0)})`,fm(v.n))))} = <b>${fmt(r.stat,3)}</b>`
      :`${nm} = ${fr("x̄ − μ₀",`${tipo==="t"?"s":"σ"} / √n`)} = ${fr(`${fm(v.x_bar)} − ${fm(v.mu_0)}`,`${fm(tipo==="t"?v.s:v.sigma)} / √${fm(v.n)}`)} = <b>${fmt(r.stat,3)}</b>`;
    const crit=cola==="dos"?`±${fmt(r.critico,3)}`:fmt(r.critico,3),rej=r.rechaza_por_p;
    const desc={dos:"diferente de",der:"mayor que",izq:"menor que"}[cola];
    let h=`<div class="hyp"><span>H₀: ${par} ${o0} ${fm(r.valor_hip)}</span><span>H₁: ${par} ${o1} ${fm(r.valor_hip)}</span></div>`;
    h+=stp(1,`Estadístico de prueba (${nm}<sub>calc</sub>)`,`<div class="eq">${sub}<span class="note">Error estándar: ${fmt(r.error_estandar,4)} · Distribución: ${distOf(r.dist)}</span></div>`);
    h+=stp(2,"Valor crítico, p-valor y veredicto",`<div class="res">${tiles([["Valor crítico",crit],["p-valor",pf(r.p_valor)],["α",fm(v.alpha)]])}</div>${rejPlot(r.dist,cola,[r.critico],r.stat,nm)}`+
      verdict(rej,`Como p-valor (${pf(r.p_valor)}) &lt; α (${fm(v.alpha)}), se rechaza H₀. Hay evidencia estadística suficiente para afirmar que ${par} es ${desc} ${fm(r.valor_hip)}.`,
        `Como p-valor (${pf(r.p_valor)}) ≥ α (${fm(v.alpha)}), no se rechaza H₀. La diferencia entre tu muestra (${fm(r.valor_mue)}) y la hipótesis (${fm(r.valor_hip)}) no es estadísticamente significativa; puede deberse al azar del muestreo.`));
    h+=stp(3,"Dualidad con el intervalo de confianza",cola==="dos"
      ?`<div class="eq">IC<sub>${fmt((1-v.alpha)*100,1)} %</sub> = [ ${fmt(r.ic_inf,4)} ; ${fmt(r.ic_sup,4)} ]</div><p>${r.dentro?`El valor hipotético ${par}₀ = ${fm(r.valor_hip)} <b>está dentro</b> del intervalo: es un valor razonable, así que no se rechaza H₀.`:`El valor hipotético ${par}₀ = ${fm(r.valor_hip)} <b>cae afuera</b> del intervalo: es muy improbable que sea el verdadero valor, así que se rechaza H₀.`}${tipo==="p"?" En proporciones el intervalo usa p̂ en el error estándar, así que la equivalencia es aproximada.":""}</p>`
      :`<p class="hint" style="margin:0">La equivalencia exacta con los intervalos de confianza estándar se ve en las pruebas de dos colas. Estás usando una prueba de una cola.</p>`);
    $("h-out").innerHTML=h};
  bindSeg("h-tipo",x=>{tipo=x;build();run()});bindSeg("h-cola",x=>{cola=x;run()});build();run();
};

// ---- Potencia (rama nueva)
SIMS.pot=function(){
  let cola="der";const mu0=50;
  $("sim").innerHTML=`${seg("p-cola","Tipo de prueba",[["der","Cola derecha (>)"],["dos","Dos colas (≠)"]],cola)}
  <div class="ctr">${ctl("p-mu1","Media verdadera (μ₁)",40,65,0.1,53)}${ctl("p-sg","Desviación estándar (σ)",1,20,0.1,5)}${ctl("p-n","Tamaño de muestra (n)",2,300,1,30)}${ctl("p-al","Significancia (α)",0.001,0.2,0.001,0.05)}</div>
  <div class="legend"><span><i style="background:var(--muted)"></i>x̄ si H₀ es cierta (μ₀ = 50)</span><span><i style="background:var(--line)"></i>x̄ si la media es μ₁</span><span><i style="background:var(--bad);height:8px;opacity:.4"></i>α</span><span><i style="background:var(--branch);height:8px;opacity:.5"></i>β</span></div>
  <div id="p-plot"></div><div class="res" id="p-res"></div><div class="verdict" id="p-ver"></div>`;
  const run=()=>{const v={mu0,mu1:V("p-mu1"),sigma:V("p-sg"),n:Math.round(V("p-n")),alpha:V("p-al"),cola};
    if(!(v.sigma>0)||!(v.n>=2)||!(v.alpha>0&&v.alpha<1)||!isFinite(v.mu1)){$("p-res").innerHTML=err("σ positiva, n ≥ 2 y 0 < α < 1.");return}
    const r=CALC.potencia(v),se=r.se,f0=x=>npdf((x-mu0)/se)/se,f1=x=>npdf((x-v.mu1)/se)/se,lo=Math.min(mu0,v.mu1)-4.2*se,hi=Math.max(mu0,v.mu1)+4.2*se;
    const areas=cola==="der"?[{f:f0,a:r.c[0],b:hi,col:"--bad",op:.35},{f:f1,a:lo,b:r.c[0],col:"--branch",op:.4}]
      :[{f:f0,a:lo,b:r.c[0],col:"--bad",op:.35},{f:f0,a:r.c[1],b:hi,col:"--bad",op:.35},{f:f1,a:r.c[0],b:r.c[1],col:"--branch",op:.4}];
    $("p-plot").innerHTML=curvePlot({lo,hi,curves:[{f:f0,col:"--muted"},{f:f1,col:"--line",w:2.5}],areas,marks:r.c.map(c=>({x:c,label:`crítico x̄ = ${fm(c)}`,col:"--ink",dash:1})),xl:"x̄",H:250,label:"Distribuciones de la media bajo H₀ y bajo H₁ con las áreas α y β"});
    const pw=r.potencia;
    $("p-res").innerHTML=tiles([["Error estándar",fmt(se,3)],[cola==="der"?"Valor crítico de x̄":"Valores críticos de x̄",r.c.map(c=>fmt(c,2)).join(" y ")],["β (error tipo II)",fmt(1-pw,3)],["Potencia 1 − β",fmt(pw,3)]]);
    const ve=$("p-ver");ve.className="verdict "+(pw>=.8?"acc":"warnv");
    ve.textContent=Math.abs(v.mu1-mu0)<1e-9?`Si μ₁ = μ₀, H₀ es cierta y la probabilidad de rechazar es α = ${fm(v.alpha)}.`
      :`Si la media verdadera es ${fm(v.mu1)}, la prueba la detecta el ${fmt(pw*100,1)} % de las veces.${pw<.8?" Por debajo del 80 % que se suele exigir: prueba subiendo n.":""}`};
  bindCtl(["p-mu1","p-sg","p-n","p-al"],run);bindSeg("p-cola",x=>{cola=x;run()});run();
};

// ---- Pruebas avanzadas (módulo de Economiapp)
SIMS.avanz=function(){
  const CFG={
    difp:[["x1","Éxitos muestra 1 (x₁)",0,1000,1,45],["n1","Tamaño muestra 1 (n₁)",1,1000,1,100],["x2","Éxitos muestra 2 (x₂)",0,1000,1,30],["n2","Tamaño muestra 2 (n₂)",1,1000,1,80],["d0","Diferencia hipotética (d₀)",-1,1,0.01,0],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    var:[["n","Tamaño muestral (n)",2,500,1,30],["s2","Varianza muestral (S²)",0.1,100,0.1,12.5],["sigma2_0","Varianza hipotética (σ²₀)",0.1,100,0.1,10],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]],
    cov:[["n1","Tamaño muestra 1 (n₁)",2,500,1,25],["s2_1","Varianza muestral 1 (S²₁)",0.1,100,0.1,15],["n2","Tamaño muestra 2 (n₂)",2,500,1,20],["s2_2","Varianza muestral 2 (S²₂)",0.1,100,0.1,10],["alpha","Significancia (α)",0.001,0.2,0.001,0.05]]};
  const mem={difp:{},var:{},cov:{}};let tipo="difp",cola="dos";
  $("sim").innerHTML=`<div class="lbl">Prueba</div>${seg("a-tipo","Prueba a realizar",[["difp","Diferencia de proporciones"],["var","Una varianza"],["cov","Cociente de varianzas"]],tipo)}
  <div class="lbl">Hipótesis alternativa</div>${seg("a-cola","Tipo de prueba",COLAS,cola)}
  <div class="ctr" id="a-in"></div><div id="a-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const build=()=>{$("a-in").innerHTML=CFG[tipo].map(([k,l,a,b,s,d])=>ctl(`a${tipo}-${k}`,l,a,b,s,mem[tipo][k]??d)).join("");bindCtl(CFG[tipo].map(c=>`a${tipo}-${c[0]}`),run)};
  const run=()=>{const v={};CFG[tipo].forEach(([k])=>{v[k]=V(`a${tipo}-${k}`);mem[tipo][k]=v[k]});["n","n1","n2","x1","x2"].forEach(k=>{if(k in v)v[k]=Math.round(v[k])});
    let msg="";if(!(v.alpha>0&&v.alpha<1))msg="0 < α < 1.";
    if(tipo==="difp"){if(!(v.n1>=1&&v.n2>=1&&v.x1>=0&&v.x2>=0&&v.x1<=v.n1&&v.x2<=v.n2))msg="los éxitos no pueden superar el tamaño de cada muestra.";else if(v.x1+v.x2===0||v.x1+v.x2===v.n1+v.n2)msg="p* queda en 0 o 1 y el error estándar se anula.";}
    if(tipo==="var"&&!(v.n>=2&&v.s2>0&&v.sigma2_0>0))msg="n ≥ 2 y varianzas positivas.";
    if(tipo==="cov"&&!(v.n1>=2&&v.n2>=2&&v.s2_1>0&&v.s2_2>0))msg="n ≥ 2 en cada muestra y varianzas positivas.";
    if(msg){$("a-out").innerHTML=err(msg);return}
    const r=CALC.avanzada(tipo,cola,v),[o0,o1]=OPS[cola];let hyp,s1,lbl;
    if(tipo==="difp"){hyp=[`H₀: p₁ − p₂ ${o0} ${fm(v.d0)}`,`H₁: p₁ − p₂ ${o1} ${fm(v.d0)}`];lbl="Z";
      s1=`<div class="eq">p̂₁ = ${fr(fm(v.x1),fm(v.n1))} = ${fmt(r.p_hat1,4)} &nbsp; p̂₂ = ${fr(fm(v.x2),fm(v.n2))} = ${fmt(r.p_hat2,4)} &nbsp; p* = ${fr(`${fm(v.x1)} + ${fm(v.x2)}`,`${fm(v.n1)} + ${fm(v.n2)}`)} = ${fmt(r.p_star,4)}</div>
      <div class="eq">Z<sub>c</sub> = ${fr(`(p̂₁ − p̂₂) − d₀`,rt(`${fr("p*(1 − p*)","n₁")} + ${fr("p*(1 − p*)","n₂")}`))} = ${fr(`(${fmt(r.p_hat1,4)} − ${fmt(r.p_hat2,4)}) − ${fm(v.d0)}`,rt(`${fr(`${fmt(r.p_star,4)}(1 − ${fmt(r.p_star,4)})`,fm(v.n1))} + ${fr(`${fmt(r.p_star,4)}(1 − ${fmt(r.p_star,4)})`,fm(v.n2))}`))} = <b>${fmt(r.stat,4)}</b></div>`}
    else if(tipo==="var"){hyp=[`H₀: σ² ${o0} ${fm(v.sigma2_0)}`,`H₁: σ² ${o1} ${fm(v.sigma2_0)}`];lbl="χ²";
      s1=`<div class="eq">χ²<sub>c</sub> = ${fr("(n − 1) S²","σ²₀")} = ${fr(`(${fm(v.n)} − 1) · ${fm(v.s2)}`,fm(v.sigma2_0))} = <b>${fmt(r.stat,4)}</b><span class="note">Distribución: ${distOf(r.dist)}</span></div>`}
    else{hyp=[`H₀: σ₁² ${o0} σ₂²`,`H₁: σ₁² ${o1} σ₂²`];lbl="F";
      s1=`<div class="eq">F<sub>c</sub> = ${fr("S²₁","S²₂")} = ${fr(fm(v.s2_1),fm(v.s2_2))} = <b>${fmt(r.stat,4)}</b><span class="note">Distribución: ${distOf(r.dist)}</span></div>`}
    const crit=r.criticos.map(c=>fmt(c,3)).join(" y "),rej=r.rechaza_por_p;
    let h=`<div class="hyp"><span>${hyp[0]}</span><span>${hyp[1]}</span></div>`;
    h+=stp(1,`Estadístico de prueba (${lbl}<sub>c</sub>)`,s1);
    h+=stp(2,"p-valor y veredicto",`<div class="res">${tiles([["p-valor",pf(r.p_valor)],["α",fm(v.alpha)],[r.criticos.length>1?"Valores críticos":"Valor crítico",crit]])}</div>
      <p class="hint" style="margin:0">${NW} Economiapp decide solo con el p-valor; los valores críticos se agregan para leerlo también con la tabla.</p>${rejPlot(r.dist,cola,r.criticos,r.stat,lbl)}`+
      verdict(rej,`Como p-valor (${pf(r.p_valor)}) &lt; α (${fm(v.alpha)}), se rechaza H₀.`,`Como p-valor (${pf(r.p_valor)}) ≥ α (${fm(v.alpha)}), no se rechaza H₀.`));
    $("a-out").innerHTML=h};
  bindSeg("a-tipo",x=>{tipo=x;build();run()});bindSeg("a-cola",x=>{cola=x;run()});build();run();
};

// ---- Diferencia de medias, Welch (rama nueva)
SIMS.welch=function(){
  let cola="dos";
  $("sim").innerHTML=`<div class="lbl">Hipótesis alternativa</div>${seg("w-cola","Tipo de prueba",COLAS,cola)}
  <div class="ctr">${ctl("w-x1","Media muestra 1 (x̄₁)",0,200,0.5,72)}${ctl("w-s1","Varianza muestra 1 (S²₁)",0.1,500,0.1,64)}${ctl("w-n1","Tamaño muestra 1 (n₁)",2,500,1,40)}
  ${ctl("w-x2","Media muestra 2 (x̄₂)",0,200,0.5,68)}${ctl("w-s2","Varianza muestra 2 (S²₂)",0.1,500,0.1,100)}${ctl("w-n2","Tamaño muestra 2 (n₂)",2,500,1,45)}
  ${ctl("w-d0","Diferencia hipotética (μ₁ − μ₂)",-50,50,0.5,0)}${ctl("w-al","Significancia (α)",0.001,0.2,0.001,0.05)}</div><div id="w-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const run=()=>{const v={x1:V("w-x1"),s2_1:V("w-s1"),n1:Math.round(V("w-n1")),x2:V("w-x2"),s2_2:V("w-s2"),n2:Math.round(V("w-n2")),d0:V("w-d0"),alpha:V("w-al"),cola};
    if(!(v.s2_1>0&&v.s2_2>0&&v.n1>=2&&v.n2>=2&&v.alpha>0&&v.alpha<1)||![v.x1,v.x2,v.d0].every(isFinite)){$("w-out").innerHTML=err("varianzas positivas, n ≥ 2 en cada muestra y 0 < α < 1.");return}
    const r=CALC.welch(v),[o0,o1]=OPS[cola],d=r.dist,cr=cola==="dos"?[d.ppf(v.alpha/2),d.ppf(1-v.alpha/2)]:cola==="der"?[d.ppf(1-v.alpha)]:[d.ppf(v.alpha)];
    let h=`<div class="hyp"><span>H₀: μ₁ − μ₂ ${o0} ${fm(v.d0)}</span><span>H₁: μ₁ − μ₂ ${o1} ${fm(v.d0)}</span></div>`;
    h+=stp(1,"Estadístico de prueba",`<div class="eq">t = ${fr(`(${fm(v.x1)} − ${fm(v.x2)}) − ${fm(v.d0)}`,rt(`${fr(fm(v.s2_1),fm(v.n1))} + ${fr(fm(v.s2_2),fm(v.n2))}`))} = ${fr(fmt(v.x1-v.x2-v.d0,2),fmt(r.error_estandar,4))} = <b>${fmt(r.stat,4)}</b><span class="note">Grados de libertad de Welch: ${fmt(r.gl,2)}</span></div>`);
    h+=stp(2,"p-valor y veredicto",`<div class="res">${tiles([["p-valor",pf(r.p_valor)],["α",fm(v.alpha)],[cr.length>1?"Valores críticos":"Valor crítico",cr.map(c=>fmt(c,3)).join(" y ")]])}</div>${rejPlot(d,cola,cr,r.stat,"t")}`+
      verdict(r.rechaza_por_p,`Como p-valor (${pf(r.p_valor)}) &lt; α (${fm(v.alpha)}), se rechaza H₀: las medias de los dos grupos difieren ${cola==="dos"?"":"en la dirección planteada "}de forma significativa.`,`Como p-valor (${pf(r.p_valor)}) ≥ α (${fm(v.alpha)}), no se rechaza H₀: la diferencia observada puede deberse al azar.`));
    $("w-out").innerHTML=h};
  bindCtl(["w-x1","w-s1","w-n1","w-x2","w-s2","w-n2","w-d0","w-al"],run);bindSeg("w-cola",x=>{cola=x;run()});run();
};

// ---- Taller: tablas de distribuciones
SIMS.tab=function(){
  let dn="t",cola="dos";
  $("sim").innerHTML=`<div class="lbl">Distribución</div>${seg("t-d","Distribución",[["norm","Normal Z"],["t","t de Student"],["chi2","Ji cuadrado"],["f","F de Fisher"]],dn)}
  <div class="lbl">Cola</div>${seg("t-c","Cola",COLAS,cola)}
  <div class="calcf"><label for="t-g1" id="t-l1">Grados de libertad<input id="t-g1" type="number" value="20" min="1" step="1" inputmode="numeric"></label>
  <label for="t-g2" id="t-l2">gl del denominador<input id="t-g2" type="number" value="15" min="1" step="1" inputmode="numeric"></label>
  <label for="t-a">Significancia (α)<input id="t-a" type="number" value="0.05" min="0.0001" max="0.5" step="0.005" inputmode="decimal"></label>
  <label for="t-s">Tu estadístico (opcional)<input id="t-s" type="number" step="0.01" placeholder="Para el p-valor" inputmode="decimal"></label></div>
  <div id="t-out" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const run=()=>{const g1=+$("t-g1").value,g2=+$("t-g2").value,a=+$("t-a").value,sv=$("t-s").value.trim(),s=sv===""?null:+sv;
    $("t-l1").hidden=dn==="norm";$("t-l2").hidden=dn!=="f";$("t-l1").firstChild.textContent=dn==="f"?"gl del numerador":"Grados de libertad";
    if((dn!=="norm"&&!(g1>0))||(dn==="f"&&!(g2>0))||!(a>0&&a<1)||(s!==null&&!isFinite(s))){$("t-out").innerHTML=err("los grados de libertad deben ser positivos y 0 < α < 1.");return}
    const d=dn==="norm"?DIST.norm():dn==="t"?DIST.t(g1):dn==="chi2"?DIST.chi2(g1):DIST.f(g1,g2);
    const sym=dn==="norm"||dn==="t",cr=cola==="dos"?[d.ppf(a/2),d.ppf(1-a/2)]:cola==="der"?[d.ppf(1-a)]:[d.ppf(a)];
    const nm={norm:"Z",t:"t",chi2:"χ²",f:"F"}[dn];let p=null;
    if(s!==null){const c=d.cdf(s);p=cola==="dos"?(sym?2*(1-d.cdf(Math.abs(s))):Math.min(2*c,2*(1-c))):cola==="der"?1-c:c}
    let h=`<div class="res">${tiles([[cr.length>1?"Valores críticos":"Valor crítico",cr.map(c=>fmt(c,4)).join(" y ")],["Distribución",distOf(d)],["p-valor",p===null?"Escribe un estadístico":pf(p)]])}</div>`;
    h+=rejPlot(d,cola,cr,s===null?NaN:s,nm);
    if(p!==null)h+=verdict(p<a,`Con α = ${fm(a)} se rechaza H₀: el estadístico cae en la región de rechazo.`,`Con α = ${fm(a)} no se rechaza H₀.`);
    h+=`<p class="hint" style="margin:0">${sym&&cola==="dos"?"En distribuciones simétricas los dos críticos son iguales en valor absoluto.":dn==="chi2"||dn==="f"?"En χ² y F el p-valor de dos colas es min{2F(x), 2[1 − F(x)]}, como en Economiapp.":"Una cola: toda el área α queda de un solo lado."}</p>`;
    $("t-out").innerHTML=h};
  ["t-g1","t-g2","t-a","t-s"].forEach(i=>$(i).addEventListener("input",run));
  bindSeg("t-d",x=>{dn=x;run()});bindSeg("t-c",x=>{cola=x;run()});run();
};

// ===================== LABORATORIOS DEL PROGRAMA 1504109 =====================
const n4=v=>fmt(v,4),n6=v=>fmt(v,6);
const rbox=code=>`<details class="pdet"><summary><b>Código en R</b></summary><pre class="code"><code>${code.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</code></pre></details>`;
const numIn=(id,l,v)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" step="any" inputmode="decimal"></label>`;
const NV=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",",".")):NaN};
const onInput=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});
const leg2=items=>`<div class="legend">${items.map(([c,t])=>`<span><i style="background:var(${c})"></i>${t}</span>`).join("")}</div>`;
let SEED=20261110;const newR=()=>rng(SEED++);
// generadores
const GEN={unif:(R,a,b)=>a+(b-a)*R(),expo:(R,l)=>-Math.log(1-R())/l,bern:(R,p)=>R()<p?1:0,
  pois:(R,l)=>{const L=Math.exp(-l);let k=0,p=1;do{k++;p*=R()}while(p>L);return k-1},
  norm:(R,m,s)=>{const u=R()||1e-12,v=R();return m+s*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}};
function histPlot(xs,{lo,hi,bins=40,curves=[],marks=[],xl,label,H=250}){
  const W=600,w=(hi-lo)/bins,c=new Array(bins).fill(0);let n=0;
  for(const x of xs){if(!isFinite(x))continue;n++;const k=Math.floor((x-lo)/w);if(k>=0&&k<bins)c[k]++}
  const d=c.map(v=>v/((n||1)*w));let ym=Math.max(...d);
  curves.forEach(cv=>{for(let i=0;i<=120;i++){const y=cv.f(lo+(hi-lo)*(i+.5)/121);if(isFinite(y))ym=Math.max(ym,y)}});ym=(ym||1)*1.15;
  const f=frame(W,H,[lo,hi],[0,ym],ticks(lo,hi,nice((hi-lo)/6)),ticks(0,ym,nice(ym/4)),xl,"densidad");
  let b=d.map((v,i)=>`<rect x="${(f.sx(lo+i*w)+0.5).toFixed(1)}" y="${f.sy(v).toFixed(1)}" width="${Math.max(0.5,f.sx(lo+w)-f.sx(lo)-1).toFixed(1)}" height="${(f.sy(0)-f.sy(v)).toFixed(1)}" fill="var(--line)" fill-opacity=".45"/>`).join("");
  curves.forEach(cv=>{let p="";for(let i=0;i<=240;i++){const x=lo+(hi-lo)*i/240;let y=cv.f(x);y=isFinite(y)?Math.min(y,ym):ym;p+=(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(y).toFixed(1)}b+=`<path d="${p}" fill="none" stroke="var(${cv.col||"--exam"})" stroke-width="2.5"/>`});
  marks.forEach(m=>{const x=f.sx(Math.max(lo,Math.min(hi,m.x)));b+=`<line x1="${x}" x2="${x}" y1="${f.sy(ym)}" y2="${f.sy(0)}" stroke="var(${m.col||"--bad"})" stroke-width="1.5" stroke-dasharray="5 4"/>`});
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${f.g}${b}</svg></div>`}
function linePlot({xr,yr,series=[],hlines=[],points=[],xl,yl,label,H=240}){
  const W=600,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl),cl=y=>Math.max(yr[0],Math.min(yr[1],y));
  let b=hlines.map(h=>`<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(h.y)}" y2="${f.sy(h.y)}" stroke="var(${h.col||"--bad"})" stroke-dasharray="5 4" stroke-width="1.5"/>`).join("");
  series.forEach(s=>{b+=`<path d="${s.pts.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(cl(p[1])).toFixed(1)).join("")}" fill="none" stroke="var(${s.col||"--line"})" stroke-width="${s.w||2}"/>`});
  points.forEach(p=>{b+=`<circle cx="${f.sx(p[0]).toFixed(1)}" cy="${f.sy(cl(p[1])).toFixed(1)}" r="3.5" fill="var(${p[2]||"--line"})" fill-opacity=".8"/>`});
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${f.g}${b}</svg></div>`}
const mean=a=>{let s=0;for(const v of a)s+=v;return s/a.length};
const vari=a=>{const m=mean(a);let s=0;for(const v of a)s+=(v-m)**2;return s/(a.length-1)};
const pTail=(d,st,cola)=>cola==="dos"?2*(1-d.cdf(Math.abs(st))):cola==="der"?1-d.cdf(st):d.cdf(st);
const btnNew=id=>`<button type="button" class="btn" id="${id}">Nueva simulación</button>`;

// ---------- Unidad 1: distribuciones de muestreo
SIMS.dmuestral=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("dm-s","Estadístico",[["media","Media muestral"],["var","(n − 1)S²/σ²"],["t","Estadístico t"],["f","Cociente S₁²/S₂²"]],"media")}</div>
  <div class="ctr">${ctl("dm-n","Tamaño de muestra n",2,100,1,5)}${ctl("dm-m","Media poblacional μ",-100,100,1,50)}${ctl("dm-sg","Desviación poblacional σ",0.5,40,0.5,10)}${ctl("dm-n2","n₂ (para el cociente F)",2,100,1,8)}</div>
  <p>${btnNew("dm-go")} Se extraen 3.000 muestras de una población normal y se calcula el estadístico en cada una.</p>
  <div class="res" id="dm-res"></div>${leg2([["--line","Simulación (histograma)"],["--exam","Distribución teórica"]])}<div id="dm-pl"></div><div id="dm-st"></div>`;
  let s="media",R=newR();
  const run=()=>{const n=Math.round(V("dm-n")),mu=V("dm-m"),sg=V("dm-sg"),n2=Math.round(V("dm-n2"));
    if(!(n>=2&&sg>0&&n2>=2)){$("dm-res").innerHTML=err("n ≥ 2 y σ > 0.");return}
    const R2=rng(SEED),sims=[],B=3000;
    for(let r=0;r<B;r++){const x=[];for(let i=0;i<n;i++)x.push(GEN.norm(R2,mu,sg));const m=mean(x),v=vari(x);
      if(s==="media")sims.push(m);else if(s==="var")sims.push((n-1)*v/(sg*sg));else if(s==="t")sims.push((m-mu)/Math.sqrt(v/n));
      else{const y=[];for(let i=0;i<n2;i++)y.push(GEN.norm(R2,mu,sg));sims.push(v/vari(y))}}
    let D,lo,hi,Em,Ev,name,rc;
    if(s==="media"){const se=sg/Math.sqrt(n);D={pdf:x=>npdf((x-mu)/se)/se};lo=mu-4*se;hi=mu+4*se;Em=mu;Ev=se*se;name=`N(μ = ${fm(mu)}, σ/√n = ${fm(se)})`;rc=`medias <- replicate(3000, mean(rnorm(${n}, ${mu}, ${sg})))\nhist(medias, freq = FALSE)\ncurve(dnorm(x, ${mu}, ${sg}/sqrt(${n})), add = TRUE)`}
    else if(s==="var"){const k=n-1;D=DIST.chi2(k);lo=0;hi=k+5*Math.sqrt(2*k);Em=k;Ev=2*k;name=`χ² con ${k} gl`;rc=`q <- replicate(3000, {x <- rnorm(${n}, ${mu}, ${sg}); (${n}-1)*var(x)/${sg}^2})\nhist(q, freq = FALSE)\ncurve(dchisq(x, ${k}), add = TRUE)`}
    else if(s==="t"){const k=n-1;D=DIST.t(k);lo=-5;hi=5;Em=k>1?0:NaN;Ev=k>2?k/(k-2):NaN;name=`t de Student con ${k} gl`;rc=`tt <- replicate(3000, {x <- rnorm(${n}, ${mu}, ${sg}); (mean(x)-${mu})/(sd(x)/sqrt(${n}))})\nhist(tt, freq = FALSE)\ncurve(dt(x, ${k}), add = TRUE)`}
    else{const a=n-1,b=n2-1;D=DIST.f(a,b);lo=0;hi=Math.min(D.ppf(0.99)*1.2,30);Em=b>2?b/(b-2):NaN;Ev=b>4?2*b*b*(a+b-2)/(a*(b-2)**2*(b-4)):NaN;name=`F con (${a}, ${b}) gl`;rc=`f <- replicate(3000, var(rnorm(${n}, ${mu}, ${sg})) / var(rnorm(${n2}, ${mu}, ${sg})))\nhist(f, freq = FALSE)\ncurve(df(x, ${a}, ${b}), add = TRUE)`}
    $("dm-res").innerHTML=tiles([["Distribución teórica",name],["Media simulada",n4(mean(sims))],["Media teórica",isFinite(Em)?n4(Em):"no existe"],["Varianza simulada",n4(vari(sims))],["Varianza teórica",isFinite(Ev)?n4(Ev):"no existe"]]);
    $("dm-pl").innerHTML=histPlot(sims,{lo,hi,bins:45,curves:[{f:D.pdf}],xl:"valor del estadístico",label:"Histograma de 3.000 estadísticos con su densidad teórica"});
    const why={media:"Si X ~ N(μ, σ), la media de n observaciones independientes es normal con media μ y varianza σ²/n.",var:"Si X ~ N(μ, σ), (n − 1)S²/σ² es una suma de n − 1 cuadrados de normales estándar independientes: χ² con n − 1 gl. Además x̄ y S² son independientes.",
      t:"Z = (x̄ − μ)/(σ/√n) es N(0, 1) y (n − 1)S²/σ² es χ²(n − 1), independientes. Su cociente Z/√(χ²/(n − 1)) es t con n − 1 gl. Con n pequeño tiene colas más pesadas que la normal.",
      f:"El cociente de dos ji cuadrado independientes divididas por sus gl es F. Con varianzas poblacionales iguales, S₁²/S₂² = [χ²₁/(n₁ − 1)]/[χ²₂/(n₂ − 1)] ~ F(n₁ − 1, n₂ − 1)."};
    $("dm-st").innerHTML=stp(1,"Por qué",`<p>${why[s]}</p>`)+rbox(rc)};
  bindSeg("dm-s",v=>{s=v;run()});bindCtl(["dm-n","dm-m","dm-sg","dm-n2"],run);$("dm-go").addEventListener("click",()=>{SEED++;run()});run()};

SIMS.orden=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("or-p","Población",[["unif","Uniforme(0, θ)"],["expo","Exponencial(λ)"]],"unif")}</div>
  <div class="ctr">${ctl("or-n","Tamaño de muestra n",1,50,1,5)}${ctl("or-k","Estadística de orden k",1,50,1,5)}${ctl("or-th","θ (uniforme)",0.5,100,0.5,10)}${ctl("or-l","λ (exponencial)",0.05,5,0.05,1)}</div>
  <p>${btnNew("or-go")}</p><div class="res" id="or-res"></div>${leg2([["--line","Simulación"],["--exam","Densidad de X₍ₖ₎"]])}<div id="or-pl"></div><div id="or-st"></div>`;
  let p="unif";
  const run=()=>{const n=Math.round(V("or-n"));let k=Math.round(V("or-k"));if(k>n){k=n;$("or-k").value=n;$("or-k-r").value=n}
    const th=V("or-th"),l=V("or-l");if(!(th>0&&l>0&&n>=1)){$("or-res").innerHTML=err("parámetros positivos.");return}
    const F=p==="unif"?x=>x<=0?0:x>=th?1:x/th:x=>x<=0?0:1-Math.exp(-l*x),f=p==="unif"?x=>x>0&&x<th?1/th:0:x=>x<0?0:l*Math.exp(-l*x);
    const lc=gln(n+1)-gln(k)-gln(n-k+1),fk=x=>{const Fx=F(x),fx=f(x);if(fx<=0||Fx<=0&&k>1||Fx>=1&&k<n)return 0;return Math.exp(lc+(k-1)*Math.log(Math.max(Fx,1e-300))+(n-k)*Math.log(Math.max(1-Fx,1e-300)))*fx};
    const R2=rng(SEED),sims=[];for(let r=0;r<3000;r++){const x=[];for(let i=0;i<n;i++)x.push(p==="unif"?GEN.unif(R2,0,th):GEN.expo(R2,l));x.sort((a,b)=>a-b);sims.push(x[k-1])}
    let Ek=0;if(p==="unif")Ek=k*th/(n+1);else for(let i=n-k+1;i<=n;i++)Ek+=1/(i*l);
    const hi=p==="unif"?th:Math.max(...sims.slice().sort((a,b)=>a-b).slice(0,Math.floor(sims.length*0.995)))*1.05;
    $("or-res").innerHTML=tiles([[`<span class="nt">E[X₍${k}₎] teórica</span>`,n4(Ek)],["Media simulada",n4(mean(sims))],["Caso",k===1?"mínimo":k===n?"máximo":k+"-ésimo de "+n]]);
    $("or-pl").innerHTML=histPlot(sims,{lo:0,hi,bins:40,curves:[{f:fk}],xl:"x₍"+k+"₎",label:"Densidad de la estadística de orden"});
    $("or-st").innerHTML=stp(1,"Fórmula",`<div class="eq al">f<sub>(k)</sub>(x) = n!/[(k − 1)!(n − k)!] · F(x)<sup>k−1</sup> · [1 − F(x)]<sup>n−k</sup> · f(x)<br>Mínimo: f<sub>(1)</sub>(x) = n[1 − F(x)]<sup>n−1</sup>f(x) · Máximo: f<sub>(n)</sub>(x) = n F(x)<sup>n−1</sup>f(x)<br>${p==="unif"?`Uniforme: E[X₍ₖ₎] = kθ/(n + 1) = ${k}·${fm(th)}/${n+1} = <b>${n4(Ek)}</b>`:`Exponencial: el mínimo es Exp(nλ) = Exp(${fm(n*l)}); E[X₍ₖ₎] = Σ 1/(iλ) para i = n − k + 1, …, n = <b>${n4(Ek)}</b>`}</div>`)+
      rbox(`ok <- replicate(3000, sort(${p==="unif"?`runif(${n}, 0, ${th})`:`rexp(${n}, ${l})`})[${k}])\nmean(ok)\nhist(ok, freq = FALSE)`)};
  bindSeg("or-p",v=>{p=v;run()});bindCtl(["or-n","or-k","or-th","or-l"],run);$("or-go").addEventListener("click",()=>{SEED++;run()});run()};

// ---------- Unidad 2: convergencia
const POB={unif:{t:"Uniforme(0, 1)",m:0.5,v:1/12,g:R=>R(),r:"runif(n)"},expo:{t:"Exponencial(1), muy asimétrica",m:1,v:1,g:R=>GEN.expo(R,1),r:"rexp(n, 1)"},bern:{t:"Bernoulli(0,2)",m:0.2,v:0.16,g:R=>GEN.bern(R,0.2),r:"rbinom(n, 1, 0.2)"},pois:{t:"Poisson(2)",m:2,v:2,g:R=>GEN.pois(R,2),r:"rpois(n, 2)"}};
SIMS.tlc=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("tl-p","Población",Object.entries(POB).map(([k,v])=>[k,v.t]),"expo")}</div>
  <div class="ctr">${ctl("tl-n","Tamaño de muestra n",1,300,1,5)}${ctl("tl-e","ε para la ley de los grandes números",0.01,1,0.01,0.1)}</div><p>${btnNew("tl-go")}</p>
  <h4 class="subh">Teorema del límite central</h4><div class="res" id="tl-res"></div>${leg2([["--line","Medias estandarizadas (3.000 muestras)"],["--exam","N(0, 1)"]])}<div id="tl-pl"></div>
  <h4 class="subh">Ley de los grandes números</h4><div id="tl-lgn"></div><div id="tl-st"></div>`;
  let p="expo";
  const run=()=>{const P=POB[p],n=Math.round(V("tl-n")),eps=V("tl-e"),R2=rng(SEED),z=[];let far=0;
    for(let r=0;r<3000;r++){let s=0;for(let i=0;i<n;i++)s+=P.g(R2);const m=s/n;if(Math.abs(m-P.m)>eps)far++;z.push((m-P.m)/Math.sqrt(P.v/n))}
    const out=z.filter(v=>Math.abs(v)>1.96).length/z.length,sk=(()=>{const m=mean(z);let a=0,b=0;for(const v of z){a+=(v-m)**3;b+=(v-m)**2}return(a/z.length)/Math.pow(b/z.length,1.5)})();
    $("tl-res").innerHTML=tiles([[`<span class="nt">P(|Z| > 1,96) simulada</span>`,n4(out),Math.abs(out-0.05)<0.012?"okt":"badt"],["Normal estándar","0,0500"],["Asimetría de las medias",n4(sk)],[`<span class="nt">P(|x̄ − μ| > ${fm(eps)})</span>`,n4(far/3000)]]);
    $("tl-pl").innerHTML=histPlot(z,{lo:-4.5,hi:4.5,bins:45,curves:[{f:npdf}],xl:"(x̄ − μ)/(σ/√n)",label:"Teorema del límite central"});
    const R3=rng(SEED+7),pts=[];let s=0;for(let i=1;i<=2000;i++){s+=P.g(R3);if(i%5===0||i<50)pts.push([i,s/i])}
    const sd=Math.sqrt(P.v);$("tl-lgn").innerHTML=linePlot({xr:[0,2000],yr:[P.m-2*sd,P.m+2*sd],series:[{pts}],hlines:[{y:P.m,col:"--exam"},{y:P.m+eps},{y:P.m-eps}],xl:"número de observaciones",yl:"media acumulada",label:"Media acumulada que converge a μ"});
    $("tl-st").innerHTML=stp(1,"Lectura",`<p>${P.t}: μ = ${fm(P.m)}, σ² = ${fm(P.v)}. Con n = ${n}, la distribución de las medias estandarizadas ${n<10&&p!=="unif"?"todavía conserva la asimetría de la población":"ya se parece a la normal"}; sube n y mira cómo la asimetría tiende a cero (TLC: convergencia en distribución). La media acumulada de una sola sucesión se queda dentro de la banda μ ± ε (LGN: convergencia en probabilidad). La fracción de muestras con |x̄ − μ| > ε baja hacia 0 al crecer n.</p>`)+
      rbox(`n <- ${n}\nz <- replicate(3000, (mean(${P.r}) - ${P.m}) / sqrt(${fm(P.v).replace(",",".")}/n))\nhist(z, freq = FALSE); curve(dnorm(x), add = TRUE)\nmean(abs(z) > 1.96)\n# Ley de los grandes números\nx <- ${P.r.replace("n","2000")}\nplot(cumsum(x)/seq_along(x), type = "l"); abline(h = ${P.m})`)};
  bindSeg("tl-p",v=>{p=v;run()});bindCtl(["tl-n","tl-e"],run);$("tl-go").addEventListener("click",()=>{SEED++;run()});run()};

const GD={log:{t:"g(x) = ln x",g:Math.log,d:x=>1/x,dt:m=>`1/μ = ${fm(1/m)}`,r:m=>`log(${m})`},inv:{t:"g(x) = 1/x",g:x=>1/x,d:x=>-1/(x*x),dt:m=>`−1/μ² = ${fm(-1/(m*m))}`,r:m=>`1/${m}`},sq:{t:"g(x) = x²",g:x=>x*x,d:x=>2*x,dt:m=>`2μ = ${fm(2*m)}`,r:m=>`${m}^2`},sqrt:{t:"g(x) = √x",g:Math.sqrt,d:x=>0.5/Math.sqrt(x),dt:m=>`1/(2√μ) = ${fm(0.5/Math.sqrt(m))}`,r:m=>`sqrt(${m})`}};
SIMS.delta=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("dl-g","Transformación",Object.entries(GD).map(([k,v])=>[k,v.t]),"log")}</div>
  <div class="ctr">${ctl("dl-m","μ de la población",1,100,0.5,10)}${ctl("dl-s","σ de la población",0.5,40,0.5,4)}${ctl("dl-n","n",2,500,1,30)}</div><p>${btnNew("dl-go")}</p>
  <div class="res" id="dl-res"></div>${leg2([["--line","g(x̄) simulada"],["--exam","Aproximación del método delta"]])}<div id="dl-pl"></div><div id="dl-st"></div>`;
  let g="log";
  const run=()=>{const G=GD[g],mu=V("dl-m"),s=V("dl-s"),n=Math.round(V("dl-n"));if(!(mu>0&&s>0&&n>=2)){$("dl-res").innerHTML=err("μ y σ positivos.");return}
    const R2=rng(SEED),v=[];let bad=0;for(let r=0;r<4000;r++){let a=0;for(let i=0;i<n;i++)a+=GEN.norm(R2,mu,s);const m=a/n;if(m<=0&&g!=="sq"){bad++;continue}v.push(G.g(m))}
    const sdD=Math.abs(G.d(mu))*s/Math.sqrt(n),sdS=Math.sqrt(vari(v)),c=G.g(mu);
    $("dl-res").innerHTML=tiles([[`<span class="nt">g(μ)</span>`,n4(c)],[`<span class="nt">Media simulada de g(x̄)</span>`,n4(mean(v))],[`<span class="nt">Desv. delta</span>`,n4(sdD),"okt"],["Desv. simulada",n4(sdS)],["Error relativo",fmt(100*Math.abs(sdS-sdD)/sdS,1)+" %"]]);
    $("dl-pl").innerHTML=histPlot(v,{lo:c-4.5*sdD,hi:c+4.5*sdD,bins:45,curves:[{f:x=>npdf((x-c)/sdD)/sdD}],xl:"g(x̄)",label:"Método delta"});
    $("dl-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">√n [g(x̄) − g(μ)] → N(0, [g′(μ)]²σ²)<br>g′(μ) = ${G.dt(mu)}<br>Desv. aproximada de g(x̄) = |g′(μ)|·σ/√n = ${n4(Math.abs(G.d(mu)))} · ${fm(s)}/√${n} = <b>${n4(sdD)}</b></div>${bad?`<p class="warn">${bad} muestras dieron x̄ ≤ 0 y se descartaron: con μ cerca de 0 la aproximación falla.</p>`:""}<p>La aproximación mejora cuando n crece o cuando σ/√n es pequeño frente a μ, porque la expansión de Taylor de primer orden alrededor de μ se vuelve más precisa.</p>`)+
      rbox(`gx <- replicate(4000, ${G.r(`mean(rnorm(${n}, ${mu}, ${s}))`)})\nsd(gx)                       # simulada\n${fmt(Math.abs(G.d(mu)),6).replace(",",".")} * ${s} / sqrt(${n})   # método delta`)};
  bindSeg("dl-g",v=>{g=v;run()});bindCtl(["dl-m","dl-s","dl-n"],run);$("dl-go").addEventListener("click",()=>{SEED++;run()});run()};

// ---------- Unidad 3: Cramér-Rao y eficiencia
const CRM={bern:{t:"Bernoulli(p)",par:"p",lo:0.01,hi:0.99,st:0.01,v:0.3,I:p=>1/(p*(1-p)),mle:"p̂ = x̄",g:(R,p)=>GEN.bern(R,p),est:x=>mean(x),varx:(p,n)=>p*(1-p)/n,suf:"Σxᵢ (número de éxitos)",r:(n,p)=>`rbinom(${n}, 1, ${p})`},
  pois:{t:"Poisson(λ)",par:"λ",lo:0.2,hi:20,st:0.1,v:3,I:l=>1/l,mle:"λ̂ = x̄",g:(R,l)=>GEN.pois(R,l),est:x=>mean(x),varx:(l,n)=>l/n,suf:"Σxᵢ",r:(n,l)=>`rpois(${n}, ${l})`},
  norm:{t:"Normal(μ, σ = 2 conocida)",par:"μ",lo:-20,hi:20,st:0.5,v:5,I:()=>1/4,mle:"μ̂ = x̄",g:(R,m)=>GEN.norm(R,m,2),est:x=>mean(x),varx:(m,n)=>4/n,suf:"Σxᵢ",r:(n,m)=>`rnorm(${n}, ${m}, 2)`},
  expo:{t:"Exponencial(λ), tasa",par:"λ",lo:0.1,hi:5,st:0.1,v:1,I:l=>1/(l*l),mle:"λ̂ = 1/x̄",g:(R,l)=>GEN.expo(R,l),est:x=>1/mean(x),varx:(l,n)=>n>2?l*l*n*n/((n-1)**2*(n-2)):NaN,suf:"Σxᵢ",r:(n,l)=>`rexp(${n}, ${l})`}};
SIMS.cr=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("cr-d","Modelo",Object.entries(CRM).map(([k,v])=>[k,v.t]),"bern")}</div><div class="ctr" id="cr-c"></div><p>${btnNew("cr-go")}</p><div class="res" id="cr-res"></div><div id="cr-pl"></div><div id="cr-st"></div>`;
  let d="bern";
  const build=()=>{const M=CRM[d];$("cr-c").innerHTML=ctl("cr-t",`Parámetro ${M.par}`,M.lo,M.hi,M.st,M.v)+ctl("cr-n","n",3,500,1,20);bindCtl(["cr-t","cr-n"],run);run()};
  const run=()=>{const M=CRM[d],th=V("cr-t"),n=Math.round(V("cr-n"));if(!(th>=M.lo&&th<=M.hi&&n>=3)){$("cr-res").innerHTML=err(`${M.par} entre ${fm(M.lo)} y ${fm(M.hi)}, n ≥ 3.`);return}
    const I=M.I(th),cr=1/(n*I),R2=rng(SEED),e=[];for(let r=0;r<3000;r++){const x=[];for(let i=0;i<n;i++)x.push(M.g(R2,th));const v=M.est(x);if(isFinite(v))e.push(v)}
    const vs=vari(e),vt=M.varx(th,n),bias=mean(e)-th,sd=Math.sqrt(cr);
    $("cr-res").innerHTML=tiles([[`<span class="nt">I(θ) por observación</span>`,n4(I)],[`<span class="nt">Cota de Cramér-Rao 1/(nI)</span>`,n6(cr),"okt"],["Var. teórica del EMV",isFinite(vt)?n6(vt):"—"],["Var. simulada",n6(vs)],["Eficiencia CR/Var",fmt(cr/vs,3)],["Sesgo simulado",n4(bias)]]);
    $("cr-pl").innerHTML=histPlot(e,{lo:th-4.5*sd,hi:th+4.5*sd,bins:40,curves:[{f:x=>npdf((x-th)/sd)/sd}],marks:[{x:th,col:"--exam"}],xl:"estimaciones de "+M.par,label:"Distribución del estimador de máxima verosimilitud"});
    $("cr-st").innerHTML=stp(1,"Información de Fisher y cota",`<div class="eq al">I(θ) = −E[∂² ln f(X; θ)/∂θ²] = ${n4(I)}<br>Para cualquier estimador insesgado: Var(θ̂) ≥ 1/[n I(θ)] = <b>${n6(cr)}</b><br>EMV: ${M.mle}${d==="expo"?` · es sesgado en muestras pequeñas: E(λ̂) = nλ/(n − 1) = ${n4(n*th/(n-1))}`:""}</div><p>${d==="expo"?"El EMV de la exponencial no alcanza la cota en muestras finitas (además es sesgado), pero es <b>asintóticamente eficiente</b>: con n grande su varianza se acerca a la cota. Sube n para verlo.":"Aquí el EMV es insesgado y su varianza es exactamente la cota: es <b>eficiente</b> (estimador insesgado de varianza mínima uniforme)."}</p>`)+
      stp(2,"Suficiencia",`<p>Por el teorema de factorización, f(x₁, …, xₙ; θ) = g(T(x), θ)·h(x) con T = ${M.suf}: el estadístico suficiente resume toda la información de la muestra sobre ${M.par}, y el EMV es función de él.</p>`)+
      rbox(`est <- replicate(3000, ${d==="expo"?"1/":""}mean(${M.r(n,th)}))\nvar(est)          # simulada\n1 / (${n} * ${+I.toFixed(6)})   # cota de Cramér-Rao`)};
  bindSeg("cr-d",v=>{d=v;build()});$("cr-go").addEventListener("click",()=>{SEED++;run()});build()};

// ---------- Intervalos de confianza generales
const ICT={mz:{t:"Media (σ conocida)",f:[["xb","x̄",52.3],["s","σ",8],["n","n",36]]},mt:{t:"Media (σ desconocida)",f:[["xb","x̄",52.3],["s","s",8.4],["n","n",15]]},
  dm:{t:"Diferencia de medias",f:[["x1","x̄₁",74.5],["s1","s₁",8.2],["n1","n₁",25],["x2","x̄₂",69.1],["s2","s₂",10.5],["n2","n₂",30]]},
  p:{t:"Proporción",f:[["x","Éxitos x",132],["n","n",400]]},dp:{t:"Diferencia de proporciones",f:[["x1","x₁",132],["n1","n₁",400],["x2","x₂",98],["n2","n₂",380]]},
  v:{t:"Varianza",f:[["s2","s²",16.4],["n","n",20]]},fv:{t:"Cociente de varianzas",f:[["s1","s₁²",16.4],["n1","n₁",20],["s2","s₂²",9.8],["n2","n₂",25]]}};
SIMS.icg=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("ig-t","Parámetro",Object.entries(ICT).map(([k,v])=>[k,v.t]),"mz")}</div><div class="ctr">${ctl("ig-c","Nivel de confianza (%)",80,99.9,0.1,95)}</div><div class="calcf" id="ig-f"></div><div class="res" id="ig-res"></div><div id="ig-st"></div>`;
  let t="mz";
  const build=()=>{$("ig-f").innerHTML=ICT[t].f.map(([k,l,v])=>numIn("ig-"+k,l,v)).join("");onInput(ICT[t].f.map(f=>"ig-"+f[0]),run);run()};
  const run=()=>{const g={};ICT[t].f.forEach(([k])=>g[k]=NV("ig-"+k));const c=V("ig-c")/100,a=1-c;
    if(Object.values(g).some(v=>!isFinite(v))||!(c>0&&c<1)){$("ig-res").innerHTML=err("completa todos los campos.");return}
    let lo,hi,pt,steps,rc,lab;const Z=PhiInv(1-a/2);
    try{
    if(t==="mz"){if(!(g.s>0&&g.n>=1))throw"σ > 0";const se=g.s/Math.sqrt(g.n);pt=g.xb;lo=pt-Z*se;hi=pt+Z*se;lab="μ";steps=`x̄ ± z<sub>α/2</sub>·σ/√n = ${fm(g.xb)} ± ${n4(Z)}·${fm(g.s)}/√${g.n} = ${fm(g.xb)} ± ${n4(Z*se)}`;rc=`xb <- ${g.xb}; s <- ${g.s}; n <- ${g.n}\nxb + c(-1, 1) * qnorm(${1-a/2}) * s / sqrt(n)`}
    else if(t==="mt"){if(!(g.s>0&&g.n>=2))throw"s > 0 y n ≥ 2";const tq=DIST.t(g.n-1).ppf(1-a/2),se=g.s/Math.sqrt(g.n);pt=g.xb;lo=pt-tq*se;hi=pt+tq*se;lab="μ";steps=`x̄ ± t<sub>α/2, n−1</sub>·s/√n = ${fm(g.xb)} ± ${n4(tq)}·${fm(g.s)}/√${g.n} = ${fm(g.xb)} ± ${n4(tq*se)}`;rc=`xb <- ${g.xb}; s <- ${g.s}; n <- ${g.n}\nxb + c(-1, 1) * qt(${1-a/2}, n - 1) * s / sqrt(n)\n# con los datos: t.test(x, conf.level = ${c})$conf.int`}
    else if(t==="dm"){if(!(g.s1>0&&g.s2>0&&g.n1>=2&&g.n2>=2))throw"desviaciones positivas";const A=g.s1**2/g.n1,B=g.s2**2/g.n2,se=Math.sqrt(A+B),gl=(A+B)**2/(A*A/(g.n1-1)+B*B/(g.n2-1)),tq=DIST.t(gl).ppf(1-a/2);pt=g.x1-g.x2;lo=pt-tq*se;hi=pt+tq*se;lab="μ₁ − μ₂";
      const sp2=((g.n1-1)*g.s1**2+(g.n2-1)*g.s2**2)/(g.n1+g.n2-2),sep=Math.sqrt(sp2*(1/g.n1+1/g.n2)),tp=DIST.t(g.n1+g.n2-2).ppf(1-a/2);
      steps=`Welch: (x̄₁ − x̄₂) ± t<sub>α/2, gl</sub>·√(s₁²/n₁ + s₂²/n₂) con gl = ${fmt(gl,2)}: ${n4(pt)} ± ${n4(tq)}·${n4(se)}<br>Varianza agrupada (si σ₁ = σ₂): s<sub>p</sub>² = ${n4(sp2)}, intervalo ${n4(pt-tp*sep)} a ${n4(pt+tp*sep)} con ${g.n1+g.n2-2} gl`;rc=`# con los datos: t.test(x1, x2, conf.level = ${c})              # Welch\n#                t.test(x1, x2, var.equal = TRUE, conf.level = ${c})`}
    else if(t==="p"){if(!(g.n>=1&&g.x>=0&&g.x<=g.n))throw"0 ≤ x ≤ n";const ph=g.x/g.n,se=Math.sqrt(ph*(1-ph)/g.n);pt=ph;lo=ph-Z*se;hi=ph+Z*se;lab="p";steps=`p̂ ± z<sub>α/2</sub>·√(p̂(1 − p̂)/n) = ${n4(ph)} ± ${n4(Z)}·${n4(se)}${g.n*ph<5||g.n*(1-ph)<5?'<br><span class="warn">np̂ o n(1 − p̂) menor que 5: la aproximación normal no es confiable.</span>':""}`;rc=`x <- ${g.x}; n <- ${g.n}; ph <- x/n\nph + c(-1, 1) * qnorm(${1-a/2}) * sqrt(ph*(1-ph)/n)\nprop.test(x, n, conf.level = ${c}, correct = FALSE)$conf.int   # Wilson`}
    else if(t==="dp"){if(!(g.x1<=g.n1&&g.x2<=g.n2&&g.n1>0&&g.n2>0))throw"x ≤ n";const p1=g.x1/g.n1,p2=g.x2/g.n2,se=Math.sqrt(p1*(1-p1)/g.n1+p2*(1-p2)/g.n2);pt=p1-p2;lo=pt-Z*se;hi=pt+Z*se;lab="p₁ − p₂";steps=`(p̂₁ − p̂₂) ± z<sub>α/2</sub>·√(p̂₁(1 − p̂₁)/n₁ + p̂₂(1 − p̂₂)/n₂) = (${n4(p1)} − ${n4(p2)}) ± ${n4(Z)}·${n4(se)}`;rc=`p1 <- ${g.x1}/${g.n1}; p2 <- ${g.x2}/${g.n2}\n(p1 - p2) + c(-1, 1) * qnorm(${1-a/2}) * sqrt(p1*(1-p1)/${g.n1} + p2*(1-p2)/${g.n2})`}
    else if(t==="v"){if(!(g.s2>0&&g.n>=2))throw"s² > 0";const D=DIST.chi2(g.n-1),q1=D.ppf(1-a/2),q0=D.ppf(a/2);pt=g.s2;lo=(g.n-1)*g.s2/q1;hi=(g.n-1)*g.s2/q0;lab="σ²";steps=`[(n − 1)s²/χ²<sub>1−α/2</sub>, (n − 1)s²/χ²<sub>α/2</sub>] = [${g.n-1}·${fm(g.s2)}/${n4(q1)}, ${g.n-1}·${fm(g.s2)}/${n4(q0)}]<br>Para σ: [${n4(Math.sqrt(lo))}, ${n4(Math.sqrt(hi))}]. El intervalo no es simétrico alrededor de s².`;rc=`s2 <- ${g.s2}; n <- ${g.n}\n(n - 1) * s2 / qchisq(c(${1-a/2}, ${a/2}), n - 1)`}
    else{if(!(g.s1>0&&g.s2>0&&g.n1>=2&&g.n2>=2))throw"varianzas positivas";const r=g.s1/g.s2,F1=DIST.f(g.n1-1,g.n2-1).ppf(1-a/2),F2=DIST.f(g.n2-1,g.n1-1).ppf(1-a/2);pt=r;lo=r/F1;hi=r*F2;lab="σ₁²/σ₂²";steps=`[(s₁²/s₂²)/F<sub>α/2</sub>(n₁ − 1, n₂ − 1), (s₁²/s₂²)·F<sub>α/2</sub>(n₂ − 1, n₁ − 1)] = [${n4(r)}/${n4(F1)}, ${n4(r)}·${n4(F2)}]<br>Si el intervalo contiene a 1, no hay evidencia de varianzas distintas.`;rc=`r <- ${g.s1}/${g.s2}\nc(r / qf(${1-a/2}, ${g.n1-1}, ${g.n2-1}), r * qf(${1-a/2}, ${g.n2-1}, ${g.n1-1}))\n# con los datos: var.test(x1, x2, conf.level = ${c})$conf.int`}
    }catch(e){$("ig-res").innerHTML=err(e);$("ig-st").innerHTML="";return}
    $("ig-res").innerHTML=tiles([["Estimación puntual",n4(pt)],["Límite inferior",n4(lo),"okt"],["Límite superior",n4(hi),"okt"],["Amplitud",n4(hi-lo)]]);
    $("ig-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">${steps}</div><p>Con un procedimiento que acierta el ${fmt(100*c,1)} % de las veces, ${lab} está entre <b>${n4(lo)}</b> y <b>${n4(hi)}</b>.</p>`)+rbox(rc)};
  bindSeg("ig-t",v=>{t=v;build()});bindCtl(["ig-c"],run);build()};

// ---------- Unidad 4: razón de verosimilitud
const LRM={bern:{t:"Bernoulli (proporción)",f:[["n","n",200],["x","Éxitos x",118],["t0","p₀",0.5]],
    ok:g=>g.n>0&&g.x>=0&&g.x<=g.n&&g.t0>0&&g.t0<1,hat:g=>g.x/g.n,l:(p,g)=>(g.x?g.x*Math.log(p):0)+(g.n-g.x?(g.n-g.x)*Math.log(1-p):0),I:p=>1/(p*(1-p)),par:"p",r:g=>`x <- ${g.x}; n <- ${g.n}; p0 <- ${g.t0}\nph <- x/n\nG <- 2*(dbinom(x, n, ph, log = TRUE) - dbinom(x, n, p0, log = TRUE))\npchisq(G, 1, lower.tail = FALSE)`},
  pois:{t:"Poisson (tasa)",f:[["n","n",40],["xb","x̄",3.6],["t0","λ₀",3]],ok:g=>g.n>0&&g.xb>0&&g.t0>0,hat:g=>g.xb,l:(l,g)=>g.n*g.xb*Math.log(l)-g.n*l,I:l=>1/l,par:"λ",r:g=>`S <- ${g.n}*${g.xb}; n <- ${g.n}; l0 <- ${g.t0}\nG <- 2*(S*log(S/n) - S - (S*log(l0) - n*l0))\npchisq(G, 1, lower.tail = FALSE)`},
  norm:{t:"Normal (σ conocida)",f:[["n","n",25],["xb","x̄",103.2],["sg","σ",10],["t0","μ₀",100]],ok:g=>g.n>0&&g.sg>0,hat:g=>g.xb,l:(m,g)=>-g.n*(g.xb-m)**2/(2*g.sg*g.sg),I:(m,g)=>1/(g.sg*g.sg),par:"μ",r:g=>`G <- ${g.n}*(${g.xb} - ${g.t0})^2 / ${g.sg}^2   # = z²\npchisq(G, 1, lower.tail = FALSE)`},
  expo:{t:"Exponencial (tasa)",f:[["n","n",30],["xb","x̄",2.4],["t0","λ₀",0.5]],ok:g=>g.n>0&&g.xb>0&&g.t0>0,hat:g=>1/g.xb,l:(l,g)=>g.n*Math.log(l)-l*g.n*g.xb,I:l=>1/(l*l),par:"λ",r:g=>`n <- ${g.n}; xb <- ${g.xb}; l0 <- ${g.t0}\nG <- 2*((n*log(1/xb) - n) - (n*log(l0) - l0*n*xb))\npchisq(G, 1, lower.tail = FALSE)`}};
SIMS.lrt=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("lr-m","Modelo",Object.entries(LRM).map(([k,v])=>[k,v.t]),"bern")}</div><div class="ctr">${ctl("lr-a","Significancia α",0.001,0.2,0.001,0.05)}</div><div class="calcf" id="lr-f"></div><div class="res" id="lr-res"></div><div id="lr-pl"></div><div id="lr-st"></div>`;
  let m="bern";
  const build=()=>{$("lr-f").innerHTML=LRM[m].f.map(([k,l,v])=>numIn("lr-"+k,l,v)).join("");onInput(LRM[m].f.map(f=>"lr-"+f[0]),run);run()};
  const run=()=>{const M=LRM[m],g={};M.f.forEach(([k])=>g[k]=NV("lr-"+k));const al=V("lr-a");
    if(!M.ok(g)){$("lr-res").innerHTML=err("revisa los valores (n > 0 y parámetros en su rango).");$("lr-st").innerHTML="";$("lr-pl").innerHTML="";return}
    const h=M.hat(g),l1=M.l(h,g),l0=M.l(g.t0,g),G=2*(l1-l0),D=DIST.chi2(1),p=1-D.cdf(G),crit=D.ppf(1-al);
    const W=(h-g.t0)**2*g.n*M.I(h,g),eps=1e-5*Math.max(1,Math.abs(g.t0)),U=(M.l(g.t0+eps,g)-M.l(g.t0-eps,g))/(2*eps),S=U*U/(g.n*M.I(g.t0,g));
    $("lr-res").innerHTML=tiles([[`<span class="nt">${M.par} estimado (EMV)</span>`,n4(h)],["−2 ln Λ",n4(G)],["p-valor",pf(p)],[`<span class="nt">Crítico χ²(1)</span>`,n4(crit)],["Decisión",G>crit?"Rechazar H₀":"No rechazar H₀",G>crit?"badt":"okt"]]);
    $("lr-pl").innerHTML=rejPlot(D,"der",[crit],G,"−2 ln Λ");
    $("lr-st").innerHTML=stp(1,"Razón de verosimilitud",`<div class="eq al">Λ = L(${M.par}₀)/L(${M.par}̂) · ln L(${M.par}̂) = ${n4(l1)} · ln L(${M.par}₀) = ${n4(l0)}<br>−2 ln Λ = 2[ln L(${M.par}̂) − ln L(${M.par}₀)] = <b>${n4(G)}</b><br>Bajo H₀, −2 ln Λ ≈ χ² con 1 gl (teorema de Wilks): p-valor = ${pf(p)}</div>`)+
      stp(2,"Las tres pruebas asintóticas",`<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>p-valor</th></tr><tr><td>Razón de verosimilitud (LR)</td><td>${n4(G)}</td><td>${pf(p)}</td></tr><tr><td>Wald: (θ̂ − θ₀)²·nI(θ̂)</td><td>${n4(W)}</td><td>${pf(1-D.cdf(W))}</td></tr><tr><td>Score o multiplicadores de Lagrange (LM)</td><td>${n4(S)}</td><td>${pf(1-D.cdf(S))}</td></tr></table></div><p>Las tres son asintóticamente equivalentes; difieren en muestras finitas. ${m==="norm"?"En la normal con σ conocida coinciden exactamente con z² de la prueba Z.":"En Econometría I se usan las mismas tres ideas (LR, Wald y LM) para restricciones sobre los coeficientes."}</p>`)+rbox(M.r(g))};
  bindSeg("lr-m",v=>{m=v;build()});bindCtl(["lr-a"],run);build()};

// ---------- Tablas de contingencia y bondad de ajuste
const parseMat=t=>t.trim().split(/\n+/).map(r=>r.trim().split(/[\s;,\t]+/).filter(x=>x!=="").map(Number)).filter(r=>r.length&&r.every(isFinite));
SIMS.chi=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("ch-t","Prueba",[["ind","Independencia (tabla de contingencia)"],["bon","Bondad de ajuste"]],"ind")}</div><div class="ctr">${ctl("ch-a","Significancia α",0.001,0.2,0.001,0.05)}</div><div id="ch-in"></div><div class="res" id="ch-res"></div><div id="ch-tb"></div><div id="ch-st"></div>`;
  let t="ind";
  const build=()=>{$("ch-in").innerHTML=t==="ind"?`<div class="calcf"><label for="ch-m">Frecuencias observadas (una fila por línea; ejemplo: estrato × opinión sobre una reforma)<textarea id="ch-m" rows="4" style="width:100%;font-family:var(--f-mono)">45 30 25\n35 40 25\n20 30 50</textarea></label></div>`
    :`<div class="calcf"><label for="ch-o">Frecuencias observadas<input id="ch-o" value="18 22 25 15 20 20" style="width:100%"></label><label for="ch-p">Probabilidades esperadas (vacío = uniforme)<input id="ch-p" value="" style="width:100%"></label>${numIn("ch-k","Parámetros estimados con los datos",0)}</div>`;
    onInput(["ch-m","ch-o","ch-p","ch-k"],run);run()};
  const run=()=>{const al=V("ch-a");let O,E,gl,rc,extra="";
    if(t==="ind"){O=parseMat($("ch-m").value);const r=O.length,c=O[0]?O[0].length:0;if(r<2||c<2||O.some(x=>x.length!==c)||O.flat().some(v=>v<0)){$("ch-res").innerHTML=err("se necesitan al menos 2 filas y 2 columnas del mismo largo.");$("ch-tb").innerHTML=$("ch-st").innerHTML="";return}
      const R=O.map(x=>x.reduce((a,b)=>a+b,0)),C=O[0].map((_,j)=>O.reduce((a,x)=>a+x[j],0)),N=R.reduce((a,b)=>a+b,0);E=O.map((x,i)=>x.map((_,j)=>R[i]*C[j]/N));gl=(r-1)*(c-1);
      rc=`O <- matrix(c(${O.map(x=>x.join(", ")).join(",\n              ")}), nrow = ${r}, byrow = TRUE)\nchisq.test(O)\nchisq.test(O)$expected`;
      var tbl=`<div class="tbl"><table><tr><th></th>${O[0].map((_,j)=>`<th>Col. ${j+1}</th>`).join("")}<th>Total</th></tr>${O.map((x,i)=>`<tr><th>Fila ${i+1}</th>${x.map((v,j)=>`<td>${fm(v)} <small>(${fmt(E[i][j],2)})</small></td>`).join("")}<td>${fm(R[i])}</td></tr>`).join("")}<tr><th>Total</th>${C.map(v=>`<td>${fm(v)}</td>`).join("")}<td>${fm(N)}</td></tr></table></div><p class="hint">Entre paréntesis, la frecuencia esperada Eᵢⱼ = (total fila × total columna)/n.</p>`;
      var Nn=N,kmin=Math.min(r,c)}
    else{const o=parseMat($("ch-o").value)[0]||[];let p=parseMat($("ch-p").value)[0]||[];const k=Math.max(0,Math.round(NV("ch-k")||0));
      if(o.length<2||o.some(v=>v<0)){$("ch-res").innerHTML=err("al menos dos categorías.");$("ch-tb").innerHTML=$("ch-st").innerHTML="";return}
      if(!p.length)p=o.map(()=>1/o.length);if(p.length!==o.length||Math.abs(p.reduce((a,b)=>a+b,0)-1)>1e-6||p.some(v=>v<=0)){$("ch-res").innerHTML=err("las probabilidades deben ser positivas, una por categoría, y sumar 1.");$("ch-tb").innerHTML=$("ch-st").innerHTML="";return}
      const N=o.reduce((a,b)=>a+b,0);O=[o];E=[p.map(v=>v*N)];gl=o.length-1-k;if(gl<1){$("ch-res").innerHTML=err("los grados de libertad deben ser al menos 1.");return}
      rc=`obs <- c(${o.join(", ")})\np <- c(${p.map(v=>+v.toFixed(6)).join(", ")})\nchisq.test(obs, p = p)${k?`\n# con ${k} parámetro(s) estimado(s), usar gl = ${gl}:\npchisq(chisq.test(obs, p = p)$statistic, ${gl}, lower.tail = FALSE)`:""}`;
      var tbl=`<div class="tbl"><table><tr><th>Categoría</th>${o.map((_,j)=>`<th>${j+1}</th>`).join("")}</tr><tr><th>Observada</th>${o.map(v=>`<td>${fm(v)}</td>`).join("")}</tr><tr><th>Esperada</th>${E[0].map(v=>`<td>${fmt(v,2)}</td>`).join("")}</tr><tr><th>(O − E)²/E</th>${o.map((v,j)=>`<td>${n4((v-E[0][j])**2/E[0][j])}</td>`).join("")}</tr></table></div>`}
    let X=0;O.forEach((x,i)=>x.forEach((v,j)=>X+=(v-E[i][j])**2/E[i][j]));const D=DIST.chi2(gl),p=1-D.cdf(X),cr=D.ppf(1-al),low=E.flat().filter(v=>v<5).length;
    if(t==="ind")extra=`<br>V de Cramér = √(χ²/(n·(min(r, c) − 1))) = <b>${n4(Math.sqrt(X/(Nn*(kmin-1))))}</b> (fuerza de la asociación, de 0 a 1)`;
    $("ch-res").innerHTML=tiles([[`<span class="nt">χ² calculado</span>`,n4(X)],["Grados de libertad",gl],["Crítico",n4(cr)],["p-valor",pf(p)],["Decisión",X>cr?"Rechazar H₀":"No rechazar H₀",X>cr?"badt":"okt"]]);
    $("ch-tb").innerHTML=tbl+rejPlot(D,"der",[cr],X,"χ²");
    $("ch-st").innerHTML=stp(1,"Cálculo",`<div class="eq al">H₀: ${t==="ind"?"las dos variables son independientes":"los datos siguen la distribución propuesta"}<br>χ² = Σ (O − E)²/E = <b>${n4(X)}</b> con gl = ${t==="ind"?"(r − 1)(c − 1)":"k − 1 − parámetros estimados"} = ${gl}${extra}</div>${low?`<p class="warn">${low} celda(s) tienen frecuencia esperada menor que 5: la aproximación χ² puede fallar (agrupa categorías o usa la prueba exacta de Fisher).</p>`:""}`)+rbox(rc)};
  bindSeg("ch-t",v=>{t=v;build()});bindCtl(["ch-a"],run);build()};

// ---------- Unidad 5: regresión lineal múltiple
function solveInv(A){const n=A.length,M=A.map((r,i)=>[...r,...A.map((_,j)=>i===j?1:0)]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;if(Math.abs(M[p][c])<1e-12)return null;[M[c],M[p]]=[M[p],M[c]];
    const d=M[c][c];for(let j=0;j<2*n;j++)M[c][j]/=d;for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];if(f)for(let j=0;j<2*n;j++)M[r][j]-=f*M[c][j]}}
  return M.map(r=>r.slice(n))}
function ols(y,X){const n=y.length,k=X[0].length,XtX=[...Array(k)].map((_,i)=>[...Array(k)].map((_,j)=>X.reduce((s,r)=>s+r[i]*r[j],0))),Xty=[...Array(k)].map((_,i)=>X.reduce((s,r,t)=>s+r[i]*y[t],0)),inv=solveInv(XtX);
  if(!inv)return null;const b=inv.map(r=>r.reduce((s,v,j)=>s+v*Xty[j],0)),yh=X.map(r=>r.reduce((s,v,j)=>s+v*b[j],0)),e=y.map((v,i)=>v-yh[i]),ym=mean(y);
  const SCR=e.reduce((s,v)=>s+v*v,0),SCT=y.reduce((s,v)=>s+(v-ym)**2,0);return{n,k,b,yh,e,SCR,SCT,SCE:SCT-SCR,inv,s2:SCR/(n-k),XtX}}
const REGD=`consumo ingreso interes
13.4 20 8
15.3 24 7.5
17.7 28 9
20.3 30 6
24.5 35 7
25.9 38 8.5
28.5 42 6.5
31.1 45 7
34.6 50 5.5
39.6 55 6
39.2 58 7.5
44.9 62 5`;
SIMS.reg=function(){
  $("sim").innerHTML=`<div class="calcf"><label for="rg-d">Datos: la primera fila son los nombres; la primera columna es y (variable dependiente)<textarea id="rg-d" rows="7" style="width:100%;font-family:var(--f-mono)">${REGD}</textarea></label></div>
  <div style="margin:8px 0">${seg("rg-v","Vista",[["est","Estimación"],["anova","ANOVA y bondad de ajuste"],["geo","Geometría y residuos"],["rest","Prueba F de restricciones"]],"est")}</div><div class="res" id="rg-res"></div><div id="rg-o"></div>`;
  let v="est",drop=new Set();
  const run=()=>{const L=$("rg-d").value.trim().split(/\n+/);const nm=L[0].trim().split(/[\s;,\t]+/),rows=parseMat(L.slice(1).join("\n"));
    if(nm.length<2||rows.length<nm.length+1||rows.some(r=>r.length!==nm.length)){$("rg-res").innerHTML=err("cada fila debe tener tantos números como nombres, y n debe superar el número de coeficientes.");$("rg-o").innerHTML="";return}
    const y=rows.map(r=>r[0]),X=rows.map(r=>[1,...r.slice(1)]),names=["(Intercepto)",...nm.slice(1)],R=ols(y,X);
    if(!R){$("rg-res").innerHTML=err("X′X no es invertible: hay multicolinealidad perfecta.");$("rg-o").innerHTML="";return}
    const{n,k,b,e,SCR,SCT,SCE,inv,s2}=R,se=inv.map((r,i)=>Math.sqrt(s2*r[i])),T=DIST.t(n-k),R2=SCE/SCT,R2a=1-(1-R2)*(n-1)/(n-k),F=(SCE/(k-1))/(SCR/(n-k)),pF=1-DIST.f(k-1,n-k).cdf(F),s2ml=SCR/n,ll=-n/2*(Math.log(2*Math.PI*s2ml)+1);
    $("rg-res").innerHTML=tiles([["n",n],["Coeficientes k",k],["R²",n4(R2),"okt"],["R² ajustado",n4(R2a)],["F global",n4(F)],["p-valor de F",pf(pF)]]);
    const rc=`d <- read.table(header = TRUE, text = "\n${$("rg-d").value.trim()}")\nm <- lm(${nm[0]} ~ ${nm.slice(1).join(" + ")}, data = d)\nsummary(m)\nanova(m)\nX <- model.matrix(m); solve(t(X) %*% X) %*% t(X) %*% d$${nm[0]}   # (X'X)^-1 X'y`;
    if(v==="est"){$("rg-o").innerHTML=`<div class="tbl"><table><tr><th>Variable</th><th>β̂</th><th>Error estándar</th><th>t</th><th>p-valor</th></tr>${b.map((bi,i)=>{const t=bi/se[i],p=2*(1-T.cdf(Math.abs(t)));return`<tr${p<0.05?' class="hl"':""}><td>${names[i]}</td><td>${n4(bi)}</td><td>${n4(se[i])}</td><td>${n4(t)}</td><td>${pf(p)}</td></tr>`}).join("")}</table></div>`+
      stp(1,"Mínimos cuadrados ordinarios",`<div class="eq al">β̂ = (X′X)⁻¹X′y · Var(β̂) = σ²(X′X)⁻¹ estimada con s² = SCR/(n − k) = ${n4(SCR)}/${n-k} = <b>${n4(s2)}</b><br>ee(β̂ⱼ) = √(s²·[(X′X)⁻¹]ⱼⱼ) · t = β̂ⱼ/ee(β̂ⱼ) con ${n-k} gl</div><p>Ecuación estimada: ${nm[0]}̂ = ${b.map((bi,i)=>i?`${bi<0?"− ":"+ "}${n4(Math.abs(bi))}·${names[i]}`:n4(bi)).join(" ")}. Las filas resaltadas son significativas al 5 %.</p>`)+
      stp(2,"Máxima verosimilitud",`<p>Con errores normales, el EMV de β es el mismo de MCO, pero el de σ² divide por n: σ̂²<sub>MV</sub> = SCR/n = ${n4(s2ml)} (sesgado) frente a s² = ${n4(s2)} (insesgado). Log-verosimilitud máxima: ln L = −(n/2)[ln(2πσ̂²) + 1] = ${n4(ll)}.</p>`)+rbox(rc)}
    else if(v==="anova"){const r=[[nm.slice(1).join(", ")||"Regresión",SCE,k-1],["Residuos",SCR,n-k],["Total",SCT,n-1]];
      $("rg-o").innerHTML=`<div class="tbl"><table><tr><th>Fuente</th><th>Suma de cuadrados</th><th>gl</th><th>Cuadrado medio</th><th>F</th></tr>${r.map(([a,s,g],i)=>`<tr><td>${a}</td><td>${n4(s)}</td><td>${g}</td><td>${i<2?n4(s/g):""}</td><td>${i===0?n4(F):""}</td></tr>`).join("")}</table></div>`+
      stp(1,"Descomposición",`<div class="eq al">SCT = SCE + SCR: ${n4(SCT)} = ${n4(SCE)} + ${n4(SCR)}<br>R² = SCE/SCT = ${n4(R2)} · R² ajustado = 1 − (1 − R²)(n − 1)/(n − k) = ${n4(R2a)}<br>F = [SCE/(k − 1)]/[SCR/(n − k)] = ${n4(F)} con (${k-1}, ${n-k}) gl, p-valor ${pf(pF)}<br>H₀ de la F global: todos los coeficientes, salvo el intercepto, son cero</div><p>El R² nunca baja al agregar variables; el ajustado penaliza las que no aportan.</p>`)+
      stp(2,"Correlaciones",(()=>{const cols=nm.map((_,j)=>rows.map(r=>r[j])),cor=(a,c)=>{const ma=mean(a),mc=mean(c);let s=0,sa=0,sc=0;a.forEach((v,i)=>{s+=(v-ma)*(c[i]-mc);sa+=(v-ma)**2;sc+=(c[i]-mc)**2});return s/Math.sqrt(sa*sc)};
        return`<div class="tbl"><table><tr><th></th>${nm.map(x=>`<th>${x}</th>`).join("")}</tr>${nm.map((x,i)=>`<tr><th>${x}</th>${nm.map((_,j)=>`<td>${n4(cor(cols[i],cols[j]))}</td>`).join("")}</tr>`).join("")}</table></div><p>Con un solo regresor, R² = r². Correlaciones altas entre los regresores anticipan multicolinealidad (Econometría I).</p>`})())+rbox(rc)}
    else if(v==="geo"){const Xte=[...Array(k)].map((_,j)=>X.reduce((s,r,i)=>s+r[j]*e[i],0)),yhe=R.yh.reduce((s,v,i)=>s+v*e[i],0),lo=Math.min(...R.yh),hi=Math.max(...R.yh),em=Math.max(...e.map(Math.abs))*1.3||1;
      $("rg-o").innerHTML=stp(1,"El residuo es ortogonal a las columnas de X",`<div class="eq al">X′e = (${Xte.map(v=>fmt(v,8)).join("; ")}) ≈ 0 · ŷ′e = ${fmt(yhe,8)} ≈ 0 · Σeᵢ = ${fmt(e.reduce((a,b)=>a+b,0),8)}</div><p>MCO proyecta y sobre el espacio generado por las columnas de X: ŷ = Py con P = X(X′X)⁻¹X′ (matriz de proyección, simétrica e idempotente), y e = (I − P)y queda perpendicular a ese espacio. Por eso y′y = ŷ′ŷ + e′e (Pitágoras) y, con intercepto, la media de ŷ es la de y.</p>`)+
        linePlot({xr:[lo-(hi-lo)*0.05,hi+(hi-lo)*0.05],yr:[-em,em],points:R.yh.map((v,i)=>[v,e[i]]),hlines:[{y:0,col:"--muted"}],xl:"valores ajustados ŷ",yl:"residuos",label:"Residuos frente a ajustados"})+`<p class="hint">Si los supuestos se cumplen, los residuos no muestran patrones (forma de embudo o de curva).</p>`+rbox(rc)}
    else{const vars=nm.slice(1);drop=new Set([...drop].filter(x=>vars.includes(x)));if(!drop.size)drop.add(vars[vars.length-1]);
      const keep=[0,...vars.map((x,j)=>drop.has(x)?-1:j+1).filter(j=>j>0)],Rr=ols(y,X.map(r=>keep.map(j=>r[j]))),q=k-keep.length,Fr=((Rr.SCR-SCR)/q)/(SCR/(n-k)),pr=1-DIST.f(q,n-k).cdf(Fr);
      $("rg-o").innerHTML=`<p>Variables cuyo coeficiente se iguala a cero en H₀:</p><div class="chips" id="rg-ch">${vars.map(x=>`<button type="button" aria-pressed="${drop.has(x)}" data-v="${x}">${x}</button>`).join("")}</div>`+
        stp(1,"Modelo restringido frente a no restringido",`<div class="eq al">SCR no restringido = ${n4(SCR)} · SCR restringido = ${n4(Rr.SCR)} · q = ${q} restricción(es)<br>F = [(SCR<sub>R</sub> − SCR<sub>NR</sub>)/q]/[SCR<sub>NR</sub>/(n − k)] = <b>${n4(Fr)}</b> con (${q}, ${n-k}) gl · p-valor ${pf(pr)}</div>${verdict(pr<0.05,"Al 5 % se rechaza H₀: las variables excluidas sí aportan.","Al 5 % no se rechaza H₀: el modelo restringido es suficiente.")}${q===1?`<p class="hint">Con una sola restricción, F = t² del coeficiente: ${n4(Fr)} = ${n4((b[vars.indexOf([...drop][0])+1]/se[vars.indexOf([...drop][0])+1])**2)}.</p>`:""}`)+
        rbox(`m  <- lm(${nm[0]} ~ ${vars.join(" + ")}, data = d)\nm0 <- lm(${nm[0]} ~ ${vars.filter(x=>!drop.has(x)).join(" + ")||"1"}, data = d)\nanova(m0, m)`);
      $("rg-ch").addEventListener("click",ev=>{const bt=ev.target.closest("button");if(!bt)return;const x=bt.dataset.v;if(drop.has(x)){if(drop.size>1)drop.delete(x)}else drop.add(x);run()})}};
  bindSeg("rg-v",x=>{v=x;run()});onInput(["rg-d"],run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja2=function(){
  const F=[["Muestreo","Media muestral","x̄ ~ N(μ, σ/√n) si X es normal; aproximadamente por el TLC"],["Muestreo","Ji cuadrado","(n − 1)S²/σ² ~ χ²(n − 1)"],["Muestreo","t de Student","(x̄ − μ)/(S/√n) ~ t(n − 1)"],["Muestreo","F","(S₁²/σ₁²)/(S₂²/σ₂²) ~ F(n₁ − 1, n₂ − 1)"],["Muestreo","Estadísticas de orden","f₍ₖ₎(x) = n!/[(k − 1)!(n − k)!]·F^(k−1)(1 − F)^(n−k) f(x)"],
    ["Convergencia","Ley de los grandes números","x̄ →p μ: P(|x̄ − μ| > ε) → 0"],["Convergencia","Límite central","√n(x̄ − μ)/σ →d N(0, 1)"],["Convergencia","Método delta","√n[g(x̄) − g(μ)] →d N(0, g′(μ)²σ²)"],
    ["Estimación","Error cuadrático medio","ECM = Var(θ̂) + sesgo²"],["Estimación","Cramér-Rao","Var(θ̂) ≥ 1/[nI(θ)], I(θ) = −E[∂² ln f/∂θ²]"],["Estimación","Factorización","f(x; θ) = g(T(x), θ)h(x) ⟹ T suficiente"],["Estimación","Momentos","igualar E(Xᵏ) con (1/n)ΣXᵢᵏ"],["Estimación","Máxima verosimilitud","maximizar ln L(θ) = Σ ln f(xᵢ; θ)"],
    ["Intervalos","Media, σ conocida","x̄ ± z·σ/√n"],["Intervalos","Media, σ desconocida","x̄ ± t(n − 1)·s/√n"],["Intervalos","Proporción","p̂ ± z√(p̂(1 − p̂)/n)"],["Intervalos","Varianza","[(n − 1)s²/χ²₁₋α/₂, (n − 1)s²/χ²α/₂]"],["Intervalos","Cociente de varianzas","(s₁²/s₂²)/F y (s₁²/s₂²)·F"],["Intervalos","Tamaño de muestra","n = (zσ/E)²; proporciones n = z²p(1 − p)/E²"],
    ["Pruebas","Neyman-Pearson","rechazar si L(θ₁)/L(θ₀) > k: la prueba más potente de tamaño α"],["Pruebas","Razón de verosimilitud","−2 ln Λ ≈ χ²(r)"],["Pruebas","Diferencia de proporciones","z = (p̂₁ − p̂₂)/√(p̄(1 − p̄)(1/n₁ + 1/n₂))"],["Pruebas","Welch","t = (x̄₁ − x̄₂)/√(s₁²/n₁ + s₂²/n₂)"],["Pruebas","Varianza","χ² = (n − 1)s²/σ₀²"],["Pruebas","Independencia","χ² = Σ(O − E)²/E, gl = (r − 1)(c − 1)"],["Pruebas","Potencia","1 − β = P(rechazar H₀ | H₁)"],
    ["Regresión","MCO","β̂ = (X′X)⁻¹X′y"],["Regresión","Varianza","Var(β̂) = σ²(X′X)⁻¹; s² = SCR/(n − k)"],["Regresión","R²","SCE/SCT = 1 − SCR/SCT; ajustado 1 − (1 − R²)(n − 1)/(n − k)"],["Regresión","F global","[SCE/(k − 1)]/[SCR/(n − k)]"],["Regresión","F de restricciones","[(SCR_R − SCR_NR)/q]/[SCR_NR/(n − k)]"],["Regresión","Proyección","P = X(X′X)⁻¹X′; X′e = 0"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h2-q">Buscar fórmula<input id="h2-q" type="search" placeholder="Por ejemplo: varianza" style="width:100%"></label></div><div class="tbl"><table id="h2-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h2-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h2-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h2-q").addEventListener("input",run);run()};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const n="<b>Tamaño de la muestra.</b> Con n más grande el error estándar baja (como 1/√n).",al="<b>Nivel de significancia</b>: probabilidad de rechazar H₀ siendo verdadera (error tipo I). Si el p-valor es menor que α, se rechaza.",T={
 "dm-n":n,"dm-m":"<b>Media de la población</b> de la que se sacan las muestras.","dm-sg":"<b>Desviación estándar de la población.</b>","dm-n2":"<b>Tamaño de la segunda muestra</b>, para el cociente de varianzas que sigue una F.",
 "or-n":n,"or-k":"<b>Qué estadística de orden se estudia</b>: k = 1 es el mínimo y k = n el máximo.","or-th":"<b>Límite superior θ</b> de la uniforme (0, θ).","or-l":"<b>Tasa λ</b> de la exponencial (media 1/λ).",
 "tl-n":n+" El teorema del límite central dice que la media muestral se vuelve normal.","tl-e":"<b>Tolerancia ε</b>: la ley de los grandes números dice que P(|x̄ − μ| > ε) tiende a 0.",
 "dl-m":"<b>Media de la población.</b>","dl-s":"<b>Desviación estándar de la población.</b>","dl-n":n+" El método delta aproxima la varianza de g(x̄) con g′(μ)²·σ²/n.",
 "e-mu":"<b>Media poblacional</b> verdadera.","e-sg":"<b>Desviación estándar poblacional.</b>","e-n":n,
 "cr-t":"<b>Parámetro verdadero p</b> (Bernoulli).","cr-n":n+" La cota de Cramér-Rao es la menor varianza posible de un estimador insesgado.",
 "m-mu":"<b>Valor candidato de μ.</b> El estimador de máxima verosimilitud es el que hace máxima la verosimilitud (donde la pendiente es cero).",
 "i-xb":"<b>Media de la muestra.</b>","i-sg":"<b>Desviación estándar poblacional</b> (conocida).","i-n":n,"i-E":"<b>Margen de error deseado</b>: con él se calcula el n necesario, n = (z·σ/E)².",
 "ig-c":"<b>Nivel de confianza</b>: proporción de intervalos que, repitiendo el muestreo, contendrían el valor verdadero.","c-n":n,
 "hz-mu_0":"<b>Media bajo la hipótesis nula</b> H₀.","hz-x_bar":"<b>Media de la muestra.</b>","hz-sigma":"<b>Desviación estándar poblacional</b> conocida (prueba z).","hz-n":n,"hz-alpha":al,
 "ht-mu_0":"<b>Media bajo la hipótesis nula.</b>","ht-x_bar":"<b>Media de la muestra.</b>","ht-s":"<b>Desviación estándar de la muestra</b> (σ desconocida: prueba t con n − 1 grados de libertad).","ht-n":n,"ht-alpha":al,
 "hp-p_0":"<b>Proporción bajo la hipótesis nula.</b>","hp-p_hat":"<b>Proporción de la muestra.</b>","hp-n":n,"hp-alpha":al,
 "p-mu1":"<b>Media verdadera</b> bajo la alternativa. Entre más lejos de μ₀, mayor la potencia.","p-sg":"<b>Desviación estándar.</b>","p-n":n+" Más n, más potencia.","p-al":al+" Subirlo aumenta la potencia a costa de más error tipo I.",
 "lr-a":al,
 "adifp-x1":"<b>Éxitos en la muestra 1.</b>","adifp-n1":"<b>Tamaño de la muestra 1.</b>","adifp-x2":"<b>Éxitos en la muestra 2.</b>","adifp-n2":"<b>Tamaño de la muestra 2.</b>","adifp-d0":"<b>Diferencia de proporciones bajo H₀</b> (normalmente 0).","adifp-alpha":al,
 "avar-n":n,"avar-s2":"<b>Varianza de la muestra.</b>","avar-sigma2_0":"<b>Varianza bajo la hipótesis nula.</b> El estadístico (n − 1)S²/σ²₀ sigue una ji cuadrado.","avar-alpha":al,
 "acov-n1":"<b>Tamaño de la muestra 1.</b>","acov-s2_1":"<b>Varianza de la muestra 1.</b>","acov-n2":"<b>Tamaño de la muestra 2.</b>","acov-s2_2":"<b>Varianza de la muestra 2.</b> El cociente S²₁/S²₂ sigue una F bajo H₀: σ²₁ = σ²₂.","acov-alpha":al,
 "w-x1":"<b>Media de la muestra 1.</b>","w-s1":"<b>Varianza de la muestra 1.</b>","w-n1":"<b>Tamaño de la muestra 1.</b>","w-x2":"<b>Media de la muestra 2.</b>","w-s2":"<b>Varianza de la muestra 2.</b> Welch no supone varianzas iguales.","w-n2":"<b>Tamaño de la muestra 2.</b>","w-d0":"<b>Diferencia de medias bajo H₀.</b>","w-al":al,
 "ch-a":al};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
