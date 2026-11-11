
// ===================== LABORATORIOS DE ECONOMETRÍA II =====================
const rbox=code=>`<details class="pdet"><summary><b>Código en R</b></summary><pre class="code"><code>${code.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</code></pre></details>`;
const z0=v=>Math.abs(v)<5e-5?0:v,f4=v=>isFinite(v)?fmt(z0(v),4).replace(/^-/,"−"):"—",f3=v=>isFinite(v)?fmt(Math.abs(v)<5e-4?0:v,3).replace(/^-/,"−"):"—",pv=p=>!isFinite(p)?"—":p<1e-4?"< 0,0001":fmt(p,4);
const fail=(p,m)=>{$(p+"-res").innerHTML=err(m);["-g","-o"].forEach(x=>{const e=document.getElementById(p+x);if(e)e.innerHTML=""})};
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));
const PROC={ruido:"Ruido blanco",ar1:"AR(1)",ar2:"AR(2)",ma1:"MA(1)",arma11:"ARMA(1,1)",rw:"Paseo aleatorio",rwd:"Paseo aleatorio con deriva",ts:"Tendencia determinística + AR(1)"};
// ---------- Fuente de datos univariada: simular o pegar
const fuente=(p,def)=>{def=Object.assign({proc:"ar1",phi1:0.6,phi2:-0.2,th1:0.5,T:200,seed:1},def||{});return`<div class="fuente"><div style="margin-bottom:8px">${seg(p+"-src","Datos",[["sim","Simular"],["peg","Pegar mi serie"]],"sim")}</div>
 <div id="${p}-simbox" class="calcf"><label for="${p}-proc">Proceso<select id="${p}-proc">${Object.entries(PROC).map(([k,v])=>`<option value="${k}"${k===def.proc?" selected":""}>${v}</option>`).join("")}</select></label>${nin(p+"-phi1","φ₁",def.phi1,"0.05")}${nin(p+"-phi2","φ₂",def.phi2,"0.05")}${nin(p+"-th1","θ₁",def.th1,"0.05")}${nin(p+"-T","Observaciones T",def.T,"10")}${nin(p+"-seed","Semilla",def.seed,"1")}</div>
 <div id="${p}-pegbox" hidden><label for="${p}-txt">Pega los datos (uno por línea o separados por espacios; la coma decimal funciona)<textarea id="${p}-txt" rows="4" style="width:100%" placeholder="102,3&#10;104,1&#10;103,8"></textarea></label></div></div>`};
const fuenteGet=p=>{const src=$(p+"-simbox").hidden?"peg":"sim";if(src==="peg"){const y=TS.leer($(p+"-txt").value);if(!y||y.length<20)return{err:"pega al menos 20 datos numéricos."};return{y,nombre:"tu serie",R:`y <- scan()   # pega los datos y deja una línea en blanco\ny <- ts(y)`}}
  const pr=$(p+"-proc").value,f1=N(p+"-phi1"),f2=N(p+"-phi2"),t1=N(p+"-th1"),T=Math.max(30,Math.min(5000,Math.round(N(p+"-T")||200))),seed=Math.round(N(p+"-seed")||1);
  const o={seed},m={ruido:{},ar1:{phi:[f1]},ar2:{phi:[f1,f2]},ma1:{theta:[t1]},arma11:{phi:[f1],theta:[t1]},rw:{rw:true},rwd:{rw:true,drift:0.2},ts:{phi:[f1],trend:0.05}}[pr];
  const y=TS.arma(T,Object.assign({},o,m)),R={ruido:`y <- rnorm(${T})`,ar1:`y <- arima.sim(list(ar = ${f1}), n = ${T})`,ar2:`y <- arima.sim(list(ar = c(${f1}, ${f2})), n = ${T})`,ma1:`y <- arima.sim(list(ma = ${t1}), n = ${T})`,arma11:`y <- arima.sim(list(ar = ${f1}, ma = ${t1}), n = ${T})`,rw:`y <- cumsum(rnorm(${T}))`,rwd:`y <- cumsum(0.2 + rnorm(${T}))`,ts:`y <- 0.05 * (1:${T}) + arima.sim(list(ar = ${f1}), n = ${T})`}[pr];
  return{y,nombre:PROC[pr],R:`set.seed(${seed})   # R usa otro generador: la serie será distinta, pero del mismo tipo\n${R}`}};
const bindFuente=(p,run)=>{bindSeg(p+"-src",v=>{$(p+"-simbox").hidden=v!=="sim";$(p+"-pegbox").hidden=v!=="peg";run()});onIn([p+"-proc",p+"-phi1",p+"-phi2",p+"-th1",p+"-T",p+"-seed",p+"-txt"],run)};
// ---------- Gráficos
const linea=(ys,{label="Serie",col="--line",extra=[],yl="y",x0=1}={})=>{const all=[ys,...extra.map(e=>e.ys)].flat().filter(isFinite),lo=Math.min(...all),hi=Math.max(...all),pad=(hi-lo||1)*.08;
  return plotXY({xr:[x0,x0+ys.length-1],yr:[lo-pad,hi+pad],series:[{pts:ys.map((v,i)=>[x0+i,v]),col,w:1.6},...extra.map(e=>({pts:e.ys.map((v,i)=>[(e.x0??x0)+i,v]),col:e.col,w:e.w||1.6,dash:e.dash}))],xl:"t",yl,label})};
const barras=(r,n,label)=>{const teo=!n,b=teo?0:1.96/Math.sqrt(n),m=Math.max(b,...r.map(Math.abs))*1.15||1;return `<div><p class="lbl" style="margin:0 0 -4px">${label}</p>`+plotXY({xr:[0,r.length+.5],yr:[-m,m],series:r.map((v,k)=>({pts:[[k+1,0],[k+1,v]],col:!teo&&Math.abs(v)>b?"--exam":"--line",w:5})),hlines:[...(teo?[]:[{y:b,col:"--muted"},{y:-b,col:"--muted"}]),{y:0,col:"--ink",dash:"0"}],xl:"rezago",yl:"",label,H:220})+"</div>"};
const coefTab=(names,r)=>`<div class="tbl"><table><tr><th>Variable</th><th>Coeficiente</th><th>Error estándar</th><th>t</th><th>p-valor</th></tr>${names.map((nm,i)=>`<tr><td>${nm}</td><td>${f4(r.b[i])}</td><td>${f4(r.se[i])}</td><td>${f3(r.t[i])}</td><td>${pv(TS.pt2(r.t[i],r.n-r.k))}</td></tr>`).join("")}</table></div>`;

// ---------- 1. Estacionariedad
SIMS.proc=function(){
  $("sim").innerHTML=fuente("pr",{proc:"rw"})+`<div class="res" id="pr-res"></div><div id="pr-g"></div><div id="pr-o"></div>`;
  const run=()=>{const F=fuenteGet("pr");if(F.err){fail("pr",F.err);return}const y=F.y,n=y.length,h=Math.floor(n/2),a=y.slice(0,h),b=y.slice(h),va=x=>{const m=TS.mean(x);return x.reduce((s,v)=>s+(v-m)**2,0)/(x.length-1)};
    const w=Math.max(10,Math.floor(n/8)),rm=y.map((_,i)=>i+1<w?NaN:TS.mean(y.slice(i+1-w,i+1)));
    $("pr-res").innerHTML=tl([["Media 1.ª mitad",f3(TS.mean(a))],["Media 2.ª mitad",f3(TS.mean(b))],["Varianza 1.ª mitad",f3(va(a))],["Varianza 2.ª mitad",f3(va(b))]]);
    $("pr-g").innerHTML=linea(y,{label:F.nombre,extra:[{ys:rm,col:"--exam",w:2.2}]})+legend([["--line",F.nombre],["--exam",`Media móvil de ${w} periodos`]]);
    const pr=$("pr-simbox").hidden?"":$("pr-proc").value,f1=N("pr-phi1"),t1=N("pr-th1");
    const teo={ruido:"Estacionario: media 0, varianza 1 y autocorrelaciones nulas.",ar1:Math.abs(f1)<1?`Estacionario (|φ₁| = ${fm(Math.abs(f1))} < 1): media 0, varianza σ²/(1 − φ₁²) = ${f3(1/(1-f1*f1))}.`:`No estacionario: |φ₁| ≥ 1.`,ar2:"Estacionario si se cumplen φ₁ + φ₂ < 1, φ₂ − φ₁ < 1 y |φ₂| < 1 (revísalo en la estación de procesos ARMA).",ma1:`Siempre estacionario: varianza (1 + θ₁²)σ² = ${f3(1+t1*t1)}.`,arma11:Math.abs(f1)<1?"Estacionario porque |φ₁| < 1.":"No estacionario: |φ₁| ≥ 1.",rw:"No estacionario: la varianza crece con t (tσ²) y la media móvil deambula sin volver a un nivel.",rwd:"No estacionario: media y varianza crecen con t.",ts:"No estacionario en media (tendencia), pero estacionario alrededor de la tendencia."}[pr]||"Compara las medias y varianzas de las dos mitades: diferencias grandes sugieren que la serie no es estacionaria.";
    $("pr-o").innerHTML=stp(1,"¿Estacionario?",`<p>${teo}</p><p class="hint">Comparar mitades es una inspección informal; la prueba formal está en la estación de raíces unitarias.</p>`)+rbox(`${F.R}\nplot.ts(y)\nmean(y[1:${h}]); mean(y[${h+1}:${n}])\nvar(y[1:${h}]);  var(y[${h+1}:${n}])`)};
  bindFuente("pr",run);run()};

// ---------- 2. FAS y FAP
SIMS.acf=function(){
  $("sim").innerHTML=fuente("ac",{proc:"ar1"})+`<div class="calcf">${nin("ac-K","Rezagos",20,"1")}</div><div class="res" id="ac-res"></div><div id="ac-g"></div><div id="ac-o"></div>`;
  const run=()=>{const F=fuenteGet("ac");if(F.err){fail("ac",F.err);return}const y=F.y,n=y.length,K=Math.max(2,Math.min(Math.floor(n/3),Math.round(N("ac-K")||20))),r=TS.acf(y,K),pk=TS.pacf(r),b=1.96/Math.sqrt(n);
    const lb=[5,10,15].filter(m=>m<=K).map(m=>[m,TS.ljung(y,m)]);
    $("ac-res").innerHTML=tl([["Banda ±1,96/√T",f3(b)],["FAS fuera de la banda",String(r.filter(v=>Math.abs(v)>b).length)],["FAP fuera de la banda",String(pk.filter(v=>Math.abs(v)>b).length)]]);
    $("ac-g").innerHTML=`<div class="grid2">${barras(r,n,"FAS")}${barras(pk,n,"FAP")}</div><p class="hint">Izquierda: autocorrelación simple. Derecha: parcial. Las barras rosadas superan la banda del 5 %.</p>`;
    $("ac-o").innerHTML=stp(1,"Primeros valores",`<div class="tbl"><table><tr><th>k</th>${r.slice(0,8).map((_,k)=>`<th>${k+1}</th>`).join("")}</tr><tr><td>FAS</td>${r.slice(0,8).map(v=>`<td>${f3(v)}</td>`).join("")}</tr><tr><td>FAP</td>${pk.slice(0,8).map(v=>`<td>${f3(v)}</td>`).join("")}</tr></table></div>`)
      +stp(2,"Ljung-Box",`<div class="tbl"><table><tr><th>m</th><th>Q</th><th>gl</th><th>p-valor</th><th>Conclusión al 5 %</th></tr>${lb.map(([m,L])=>`<tr><td>${m}</td><td>${f3(L.Q)}</td><td>${L.df}</td><td>${pv(L.p)}</td><td>${L.p<.05?"Hay autocorrelación":"Compatible con ruido blanco"}</td></tr>`).join("")}</table></div>`)
      +rbox(`${F.R}\nacf(y, lag.max = ${K})\npacf(y, lag.max = ${K})\nBox.test(y, lag = 10, type = "Ljung-Box")`)};
  bindFuente("ac",run);onIn(["ac-K"],run);run()};

// ---------- 3. AR, MA y ARMA teóricos
SIMS.arma=function(){
  const EJ=[["AR(1) φ = 0,8",[0.8,0,0,0]],["AR(1) φ = −0,7",[-0.7,0,0,0]],["AR(2) cíclico",[1.2,-0.5,0,0]],["MA(1) θ = 0,7",[0,0,0.7,0]],["MA(2)",[0,0,0.6,0.3]],["ARMA(1,1)",[0.7,0,0.4,0]],["No estacionario",[0.6,0.5,0,0]]];
  $("sim").innerHTML=`<div class="chips pre" id="am-ej"><span class="lbl">Ejemplos</span>${EJ.map((e,i)=>`<button type="button" data-i="${i}">${e[0]}</button>`).join("")}</div><div class="calcf">${nin("am-p1","φ₁",0.8,"0.05")}${nin("am-p2","φ₂",0,"0.05")}${nin("am-t1","θ₁",0,"0.05")}${nin("am-t2","θ₂",0,"0.05")}</div><div class="res" id="am-res"></div><div id="am-g"></div><div id="am-o"></div>`;
  const run=()=>{const[p1,p2,t1,t2]=["am-p1","am-p2","am-t1","am-t2"].map(N);if(![p1,p2,t1,t2].every(isFinite))return;const phi=[p1,p2],th=[t1,t2];while(phi.length&&phi[phi.length-1]===0)phi.pop();while(th.length&&th[th.length-1]===0)th.pop();
    const ra=TS.invRoots(phi),rm=TS.invRoots(th.map(v=>-v)),est=ra.every(z=>z.mod<1-1e-9),inv=rm.every(z=>z.mod<1-1e-9),p=phi.length,q=th.length,nom=p&&q?`ARMA(${p},${q})`:p?`AR(${p})`:q?`MA(${q})`:"Ruido blanco";
    $("am-res").innerHTML=tl([["Modelo",nom,"okt"],["¿Estacionario?",p?(est?"sí":"no"):"sí (sin parte AR)",est?"okt":"badt"],["¿Invertible?",q?(inv?"sí":"no"):"sí (sin parte MA)",inv?"okt":"badt"]]);
    const rz=(L,t)=>L.length?L.map(z=>z.im?`${f3(z.re)} ± ${f3(Math.abs(z.im))}i (módulo ${f3(z.mod)})`:`${f3(z.re)} (módulo ${f3(z.mod)})`).filter((s,i,a)=>a.indexOf(s)===i).join("; "):`no hay parte ${t}`;
    if(!est){$("am-g").innerHTML="";$("am-o").innerHTML=stp(1,"Raíces inversas",`<p>AR: ${rz(ra,"AR")}. Hay una raíz inversa con módulo ≥ 1: el proceso no es estacionario y no tiene FAS teórica.</p>`);return}
    const r=TS.acfExact(phi,th,15),pk=TS.pacf(r);$("am-g").innerHTML=`<div class="grid2">${barras(r,0,"FAS teórica")}${barras(pk,0,"FAP teórica")}</div>`;
    const pista=p&&!q?`La FAP se corta en el rezago ${p} y la FAS decae${p===2&&ra[0].im?" de forma sinusoidal (raíces complejas)":""}${p===1&&p1<0?" alternando signo":""}.`:q&&!p?`La FAS se corta en el rezago ${q} y la FAP decae.`:p&&q?"Ambas decaen: patrón de un ARMA mixto.":"Todas las autocorrelaciones son cero.";
    $("am-o").innerHTML=stp(1,"Raíces inversas",`<p>Parte AR (1 − φ₁L − φ₂L²): ${rz(ra,"AR")}.<br>Parte MA (1 + θ₁L + θ₂L²): ${rz(rm,"MA")}.</p><p class="hint">Estacionario si todas las raíces inversas del AR tienen módulo menor que 1; invertible si lo cumplen las del MA.</p>`)
      +stp(2,"Patrón para identificar",`<p>${pista}</p><div class="tbl"><table><tr><th>k</th>${r.slice(0,6).map((_,k)=>`<th>${k+1}</th>`).join("")}</tr><tr><td>ρ_k</td>${r.slice(0,6).map(v=>`<td>${f3(v)}</td>`).join("")}</tr><tr><td>φ_kk</td>${pk.slice(0,6).map(v=>`<td>${f3(v)}</td>`).join("")}</tr></table></div>`)
      +rbox(`ARMAacf(ar = c(${phi.join(", ")||0}), ma = c(${th.join(", ")||0}), lag.max = 15)\nARMAacf(ar = c(${phi.join(", ")||0}), ma = c(${th.join(", ")||0}), lag.max = 15, pacf = TRUE)\nMod(polyroot(c(1, ${phi.map(v=>-v).join(", ")||0})))   # raíces de φ(z): deben ser > 1`)};
  $("am-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;EJ[+b.dataset.i][1].forEach((v,i)=>$(["am-p1","am-p2","am-t1","am-t2"][i]).value=v);run()});onIn(["am-p1","am-p2","am-t1","am-t2"],run);run()};

// ---------- 4. Estimación y diagnóstico
SIMS.est=function(){
  $("sim").innerHTML=fuente("es",{proc:"ar2",phi1:0.6,phi2:-0.3})+`<div class="calcf">${nin("es-pm","Orden máximo a comparar",6,"1")}</div><div class="res" id="es-res"></div><div id="es-o"></div>`;
  const run=()=>{const F=fuenteGet("es");if(F.err){fail("es",F.err);return}const y=F.y,pm=Math.max(1,Math.min(10,Math.round(N("es-pm")||6)));
    const fits=[...Array(pm+1)].map((_,p)=>TS.arFit(y,p,pm)),ba=fits.reduce((a,f)=>f.aic<a.aic?f:a),bb=fits.reduce((a,f)=>f.bic<a.bic?f:a),best=TS.arFit(y,bb.p),lb=TS.ljung(best.e,10,best.p),lb2=TS.ljung(best.e,20,best.p);
    $("es-res").innerHTML=tl([["Orden por AIC",String(ba.p)],["Orden por BIC",String(bb.p),"okt"],["σ² estimada",f4(best.s2)],["Ljung-Box (10) p",pv(lb.p),lb.p<.05?"badt":"okt"]]);
    $("es-o").innerHTML=stp(1,"Comparación de órdenes (muestra común)",`<div class="tbl"><table><tr><th>p</th><th>SSR</th><th>AIC</th><th>BIC</th></tr>${fits.map(f=>`<tr${f.p===bb.p?' class="hl"':""}><td>${f.p}</td><td>${f3(f.ssr)}</td><td>${f3(f.aic)}${f===ba?" ◀":""}</td><td>${f3(f.bic)}${f===bb?" ◀":""}</td></tr>`).join("")}</table></div><p class="hint">Todos los modelos usan las observaciones desde t = ${pm+1} para que los criterios sean comparables.</p>`)
      +stp(2,`AR(${bb.p}) estimado por MCO con toda la muestra`,coefTab(["Constante",...[...Array(bb.p)].map((_,i)=>`y(t−${i+1})`)],best)+(bb.p?`<p class="hint">Media implícita: c/(1 − Σφ) = ${f4(best.b[0]/(1-best.b.slice(1).reduce((s,v)=>s+v,0)))}. Raíces inversas: ${TS.invRoots(best.b.slice(1)).map(z=>f3(z.mod)).join(", ")} (módulos).</p>`:""))
      +stp(3,"Diagnóstico de residuos",`<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>gl</th><th>p-valor</th></tr><tr><td>Ljung-Box m = 10</td><td>${f3(lb.Q)}</td><td>${lb.df}</td><td>${pv(lb.p)}</td></tr><tr><td>Ljung-Box m = 20</td><td>${f3(lb2.Q)}</td><td>${lb2.df}</td><td>${pv(lb2.p)}</td></tr></table></div><p>${lb.p<.05?"Los residuos tienen autocorrelación: el modelo no captura toda la dinámica.":"Los residuos son compatibles con ruido blanco: el modelo es adecuado."}</p>${barras(TS.acf(best.e,15),best.e.length,"FAS de los residuos")}`)
      +rbox(`${F.R}\nlibrary(forecast)\nfit <- Arima(y, order = c(${bb.p}, 0, 0), method = "CSS")   # MCO condicional\nsummary(fit)\nauto.arima(y, d = 0, max.q = 0, ic = "bic")\nBox.test(residuals(fit), lag = 10, type = "Ljung-Box", fitdf = ${bb.p})`)};
  bindFuente("es",run);onIn(["es-pm"],run);run()};

// ---------- 5. Tendencias y regresión espuria
SIMS.tend=function(){
  $("sim").innerHTML=tabsBox("td",[["ts","TS frente a DS"],["esp","Regresión espuria"]]);const B=$("td-b");
  tabsRun("td",{
   ts(){B.innerHTML=`<div class="calcf">${nin("tt-T","T",200,"10")}${nin("tt-b","Pendiente β",0.1,"0.01")}${nin("tt-s","Semilla",3,"1")}</div><div id="tt-g"></div><div id="tt-o"></div>`;
    const run=()=>{const T=Math.round(N("tt-T")||200),b=N("tt-b"),R=TS.rng(Math.round(N("tt-s")||1)),e=[...Array(T)].map(()=>R.n());e[Math.floor(T/2)]+=8;
      const ts=e.map((v,t)=>b*(t+1)+v),ds=[];e.forEach((v,t)=>ds.push((t?ds[t-1]:0)+b+v));
      $("tt-g").innerHTML=linea(ts,{label:"TS y DS",extra:[{ys:ds,col:"--exam"},{ys:ts.map((_,t)=>b*(t+1)),col:"--muted",dash:"5 4",w:1.2}]})+legend([["--line","TS: tendencia + ruido"],["--exam","DS: paseo con deriva"],["--muted","Tendencia βt",1]]);
      $("tt-o").innerHTML=stp(1,"Choque en la mitad de la muestra",`<p>Ambas series reciben los mismos choques, incluido uno grande (+8) en t = ${Math.floor(T/2)}. La TS vuelve a la recta al periodo siguiente; la DS queda desplazada para siempre: el choque es permanente.</p>`)+rbox(`e <- rnorm(${T}); e[${Math.floor(T/2)}] <- e[${Math.floor(T/2)}] + 8\nts_ <- ${b} * (1:${T}) + e\nds_ <- cumsum(${b} + e)\nts.plot(ts_, ds_, col = 1:2)`)};
    onIn(["tt-T","tt-b","tt-s"],run);run()},
   esp(){B.innerHTML=`<div class="calcf">${nin("sp-T","T",100,"10")}${nin("sp-R","Repeticiones Monte Carlo",300,"50")}${nin("sp-s","Semilla",1,"1")}</div><div class="res" id="sp-res"></div><div id="sp-g"></div><div id="sp-o"></div>`;
    const run=()=>{const T=Math.max(20,Math.round(N("sp-T")||100)),Rn=Math.max(20,Math.min(2000,Math.round(N("sp-R")||300))),s=Math.round(N("sp-s")||1);
      const one=k=>{const y=TS.arma(T,{rw:true,seed:s*7919+2*k}),x=TS.arma(T,{rw:true,seed:s*7919+2*k+1}),r=TS.ols(x.map(v=>[1,v]),y),dw=r.e.slice(1).reduce((a,v,i)=>a+(v-r.e[i])**2,0)/r.ssr;return{y,x,r,dw}};
      const o=one(0);let rej=0,r2=0;for(let k=0;k<Rn;k++){const q=one(k);if(Math.abs(q.r.t[1])>1.96)rej++;r2+=q.r.r2}
      $("sp-res").innerHTML=tl([["t de la pendiente (una muestra)",f3(o.r.t[1])],["R² (una muestra)",f3(o.r.r2)],["Durbin-Watson",f3(o.dw),o.dw<o.r.r2?"badt":""],["% de rechazos al 5 %",fmt(rej/Rn*100,1)+" %","badt"],["R² promedio",f3(r2/Rn)]]);
      $("sp-g").innerHTML=linea(o.y,{label:"Dos paseos independientes",extra:[{ys:o.x,col:"--exam"}]})+legend([["--line","y"],["--exam","x (independiente de y)"]]);
      $("sp-o").innerHTML=stp(1,"Lectura",`<p>Las series son independientes, así que la prueba t debería rechazar solo el 5 % de las veces. Con paseos aleatorios rechaza el ${fmt(rej/Rn*100,1)} %: es la regresión espuria de Granger y Newbold. ${o.dw<o.r.r2?"En esta muestra R² > DW, la señal de alarma clásica.":""}</p>`)+rbox(`res <- replicate(${Rn}, { y <- cumsum(rnorm(${T})); x <- cumsum(rnorm(${T}))\n  abs(summary(lm(y ~ x))$coef[2, 3]) > 1.96 })\nmean(res)   # proporción de rechazos`)};
    onIn(["sp-T","sp-R","sp-s"],run);run()}})};

// ---------- 6. Estacionalidad
SIMS.seas=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("se-s","Frecuencia",[["4","Trimestral (s = 4)"],["12","Mensual (s = 12)"]],"12")}</div><div style="margin-bottom:8px">${seg("se-k","Estacionalidad",[["det","Determinística"],["est","Estocástica"]],"est")}</div><div class="calcf">${nin("se-T","Años",10,"1")}${nin("se-sd","Semilla",2,"1")}</div><div id="se-g"></div><div id="se-o"></div>`;
  let s=12,k="est";const run=()=>{const yrs=Math.max(4,Math.min(40,Math.round(N("se-T")||10))),T=yrs*s,R=TS.rng(Math.round(N("se-sd")||1)),pat=[...Array(s)].map((_,j)=>3*Math.sin(2*Math.PI*j/s)+(j===s-1?2:0)),y=[];
    for(let t=0;t<T;t++){const e=R.n();y.push(k==="det"?pat[t%s]+0.05*t+e:(t>=s?y[t-s]:pat[t%s])+0.05+e)}
    const d1=TS.diff(y),ds=y.slice(s).map((v,i)=>v-y[i]),K=Math.min(3*s,Math.floor(T/3));
    $("se-g").innerHTML=linea(y,{label:"Serie estacional"})+`<div class="grid2">${barras(TS.acf(y,K),T,"FAS de y")}${barras(TS.acf(ds,K),ds.length,"FAS de Δₛy")}</div>`;
    $("se-o").innerHTML=stp(1,"Lectura",`<p>${k==="det"?`Con estacionalidad determinística, las medias por ${s===12?"mes":"trimestre"} son fijas: se modela con variables dicótomas estacionales. La FAS de y muestra picos en ${s}, ${2*s}, …`:`Con estacionalidad estocástica (y_t = y_(t−${s}) + ε_t), la FAS de y decae muy lento en los rezagos ${s}, ${2*s}, …: hay una raíz unitaria estacional. La diferencia estacional Δ${s===12?"₁₂":"₄"} la elimina.`}</p>`)
      +rbox(`library(forecast)\ny <- ts(y, frequency = ${s})\nggseasonplot(y)\nacf(diff(y, lag = ${s}))\nfit <- auto.arima(y)   # elige un SARIMA\nnsdiffs(y)              # ¿cuántas diferencias estacionales?`)};
  bindSeg("se-s",v=>{s=+v;run()});bindSeg("se-k",v=>{k=v;run()});onIn(["se-T","se-sd"],run);run()};

// ---------- 7. Raíces unitarias
SIMS.adf=function(){
  $("sim").innerHTML=fuente("ad",{proc:"rw"})+`<div style="margin:8px 0">${seg("ad-tp","Especificación",[["nc","Sin constante"],["c","Constante"],["ct","Constante y tendencia"]],"c")}</div><div style="margin:8px 0">${seg("ad-d","Aplicar a",[["0","Nivel"],["1","Primera diferencia"]],"0")}</div><div class="calcf">${nin("ad-k","Rezagos (vacío = elegir por AIC)","","1")}</div><div class="res" id="ad-res"></div><div id="ad-o"></div>`;
  let tp="c",dd=0;const run=()=>{const F=fuenteGet("ad");if(F.err){fail("ad",F.err);return}const y=dd?TS.diff(F.y):F.y,kv=$("ad-k").value.trim(),k=kv===""?null:Math.max(0,Math.round(N("ad-k")));
    const A=TS.adf(y,tp,k),P=TS.pp(y,tp==="nc"?"c":tp),Kp=TS.kpss(y,tp==="ct"?"ct":"c"),rejA=A.tstat<A.crit[5],rejP=P.stat<P.crit[5],rejK=Kp.stat>Kp.crit[5];
    const concl=rejA&&!rejK?"estacionaria":!rejA&&rejK?"raíz unitaria":"mixta";
    $("ad-res").innerHTML=tl([["τ ADF",f3(A.tstat),rejA?"okt":"badt"],["Crítico 5 %",f3(A.crit[5])],["Z(t) Phillips-Perron",f3(P.stat),rejP?"okt":"badt"],["KPSS",f3(Kp.stat),rejK?"badt":"okt"],["Conclusión",concl,concl==="mixta"?"":"okt"]]);
    const nm=["Constante","Tendencia"].slice(0,tp==="nc"?0:tp==="c"?1:2).concat(["y(t−1)"],[...Array(A.k)].map((_,i)=>`Δy(t−${i+1})`));
    $("ad-o").innerHTML=stp(1,"Regresión ADF",`<div class="eq al">Δy_t = ${tp==="nc"?"":tp==="c"?"α + ":"α + βt + "}γ·y_(t−1)${A.k?` + Σ δᵢΔy_(t−i) con k = ${A.k}${A.sel?" (elegido por AIC)":""}`:""} + ε_t</div>${coefTab(nm,A)}<p class="hint">El p-valor de la tabla para y(t−1) no sirve: la distribución bajo H₀ es la de Dickey-Fuller, no la t.</p>`)
      +stp(2,"Decisión con los críticos de MacKinnon",`<div class="tbl"><table><tr><th>Prueba</th><th>H₀</th><th>Estadístico</th><th>1 %</th><th>5 %</th><th>10 %</th><th>Decisión 5 %</th></tr>
        <tr><td>ADF</td><td>Raíz unitaria</td><td>${f3(A.tstat)}</td><td>${f3(A.crit[1])}</td><td>${f3(A.crit[5])}</td><td>${f3(A.crit[10])}</td><td>${rejA?"Se rechaza: estacionaria":"No se rechaza"}</td></tr>
        <tr><td>Phillips-Perron (l = ${P.l})</td><td>Raíz unitaria</td><td>${f3(P.stat)}</td><td>${f3(P.crit[1])}</td><td>${f3(P.crit[5])}</td><td>${f3(P.crit[10])}</td><td>${rejP?"Se rechaza":"No se rechaza"}</td></tr>
        <tr><td>KPSS ${tp==="ct"?"tendencia":"nivel"} (l = ${Kp.l})</td><td>Estacionariedad</td><td>${f3(Kp.stat)}</td><td>${f3(Kp.crit[1])}</td><td>${f3(Kp.crit[5])}</td><td>${f3(Kp.crit[10])}</td><td>${rejK?"Se rechaza: no estacionaria":"No se rechaza"}</td></tr></table></div>
        <p>${concl==="mixta"?"Las pruebas no coinciden: revisa la especificación (constante o tendencia) y el número de rezagos. ":""}ADF y PP rechazan si el estadístico es <b>menor</b> que el crítico; KPSS rechaza si es <b>mayor</b>. ${dd?"Se aplicó a la primera diferencia: si ahora es estacionaria y en nivel no lo era, la serie es I(1).":"Si no rechazas en nivel, prueba la primera diferencia para saber si es I(1)."}</p>`)
      +rbox(`${F.R}\nlibrary(urca); library(tseries)\n${dd?"y <- diff(y)\n":""}summary(ur.df(y, type = "${{nc:"none",c:"drift",ct:"trend"}[tp]}", ${k===null?`selectlags = "AIC", lags = ${Math.floor(12*Math.pow(y.length/100,.25))}`:`lags = ${A.k}`}))\nsummary(ur.pp(y, type = "Z-tau", model = "${tp==="ct"?"trend":"constant"}", lags = "short"))\nkpss.test(y, null = "${tp==="ct"?"Trend":"Level"}")`)};
  bindFuente("ad",run);bindSeg("ad-tp",v=>{tp=v;run()});bindSeg("ad-d",v=>{dd=+v;run()});onIn(["ad-k"],run);run()};

// ---------- 8. Pronósticos
SIMS.fc=function(){
  $("sim").innerHTML=fuente("fc",{proc:"ar1",phi1:0.7,T:120})+`<div class="calcf">${nin("fc-p","Orden p del AR",1,"1")}${nin("fc-H","Horizonte H",12,"1")}</div><div class="res" id="fc-res"></div><div id="fc-g"></div><div id="fc-o"></div>`;
  const run=()=>{const F=fuenteGet("fc");if(F.err){fail("fc",F.err);return}const y=F.y,p=Math.max(0,Math.min(8,Math.round(N("fc-p")))),H=Math.max(1,Math.min(60,Math.round(N("fc-H")||12))),fit=TS.arFit(y,p),fc=TS.forecast(y,fit,H),n=y.length,show=Math.min(n,60);
    const mu=p?fit.b[0]/(1-fit.b.slice(1).reduce((s,v)=>s+v,0)):fit.b[0];
    $("fc-res").innerHTML=tl([["Pronóstico a 1 paso",f3(fc[0].f)],[`Pronóstico a ${H} pasos`,f3(fc[H-1].f)],["Media de largo plazo",f3(mu)],["Error estándar a 1 paso",f3(fc[0].se)]]);
    const hist=y.slice(n-show),x0=n-show+1,all=[...hist,...fc.map(f=>f.lo),...fc.map(f=>f.hi)],lo=Math.min(...all),hi=Math.max(...all),pad=(hi-lo)*.08;
    $("fc-g").innerHTML=plotXY({xr:[x0,n+H],yr:[lo-pad,hi+pad],areas:[{pts:[...fc.map(f=>[n+f.h,f.hi]),...fc.slice().reverse().map(f=>[n+f.h,f.lo])],col:"--exam",op:.15}],series:[{pts:hist.map((v,i)=>[x0+i,v]),col:"--line",w:1.6},{pts:[[n,y[n-1]],...fc.map(f=>[n+f.h,f.f])],col:"--exam",w:2.2}],vlines:[{x:n,col:"--muted"}],hlines:[{y:mu,col:"--muted"}],xl:"t",yl:"y",label:"Pronóstico"})+legend([["--line","Datos"],["--exam","Pronóstico e intervalo del 95 %"]]);
    $("fc-o").innerHTML=stp(1,"Tabla de pronósticos",`<div class="tbl"><table><tr><th>h</th><th>Pronóstico</th><th>Error estándar</th><th>Límite inferior</th><th>Límite superior</th></tr>${fc.map(f=>`<tr><td>${f.h}</td><td>${f3(f.f)}</td><td>${f3(f.se)}</td><td>${f3(f.lo)}</td><td>${f3(f.hi)}</td></tr>`).join("")}</table></div><p class="hint">Var(e_(T+h)) = σ²(1 + ψ₁² + … + ψ²_(h−1)). ${p&&TS.invRoots(fit.b.slice(1)).every(z=>z.mod<1)?"Como el AR estimado es estacionario, el pronóstico converge a la media y el intervalo a un ancho fijo.":""}</p>`)
      +rbox(`${F.R}\nlibrary(forecast)\nfit <- Arima(y, order = c(${p}, 0, 0), method = "CSS")\nfc <- forecast(fit, h = ${H}, level = 95)\nfc; autoplot(fc)`)};
  bindFuente("fc",run);onIn(["fc-p","fc-H"],run);run()};

// ---------- 9. GARCH
SIMS.garch=function(){
  $("sim").innerHTML=`${ctl("ga-w","ω",0.01,1,0.01,0.1)}${ctl("ga-a","α",0,0.5,0.01,0.12)}${ctl("ga-b","β",0,0.98,0.01,0.85)}<div class="calcf">${nin("ga-T","T",1000,"100")}${nin("ga-s","Semilla",4,"1")}${nin("ga-q","Rezagos de la prueba ARCH",5,"1")}</div><div class="res" id="ga-res"></div><div id="ga-g"></div><div id="ga-o"></div>`;
  const run=()=>{const w=V("ga-w"),a=V("ga-a"),b=V("ga-b"),T=Math.max(100,Math.min(5000,Math.round(N("ga-T")||1000))),q=Math.max(1,Math.min(20,Math.round(N("ga-q")||5)));if(a+b>=1){fail("ga","α + β debe ser menor que 1 para que exista la varianza incondicional.");return}
    const G=TS.garch(T,{omega:w,alpha:a,beta:b,seed:Math.round(N("ga-s")||1)}),L=TS.archLM(G.e,q),e2=G.e.map(v=>v*v),k4=TS.mean(e2.map(v=>v*v))/TS.mean(e2)**2;
    $("ga-res").innerHTML=tl([["Varianza incondicional ω/(1 − α − β)",f4(w/(1-a-b))],["Varianza muestral",f4(TS.mean(e2))],["Persistencia α + β",f3(a+b)],["Vida media de un choque",a+b>0?fmt(Math.log(.5)/Math.log(a+b),1)+" periodos":"—"],["Curtosis",f3(k4),k4>3?"okt":""],[`ARCH-LM(${q}) p`,pv(L.p),L.p<.05?"okt":""]]);
    $("ga-g").innerHTML=linea(G.e,{label:"Rendimientos simulados",extra:[{ys:G.s2.map(Math.sqrt),col:"--exam",w:1.8},{ys:G.s2.map(v=>-Math.sqrt(v)),col:"--exam",w:1.8}]})+legend([["--line","ε_t"],["--exam","± σ_t"]])+`<div class="grid2">${barras(TS.acf(G.e,20),T,"FAS de ε")}${barras(TS.acf(e2,20),T,"FAS de ε²")}</div>`;
    $("ga-o").innerHTML=stp(1,"Prueba ARCH-LM",`<div class="eq al">ε̂²_t = a₀ + a₁ε̂²_(t−1) + … + a_${q}ε̂²_(t−${q}) ⟹ R² = ${f4(L.r.r2)} ⟹ LM = T·R² = ${L.r.n}·${f4(L.r.r2)} = <b>${f3(L.LM)}</b> ~ χ²(${q}), p = ${pv(L.p)}</div><p>${L.p<.05?"Se rechaza la homocedasticidad condicional: hay efectos ARCH.":"No se detectan efectos ARCH."} La FAS de ε casi no tiene barras significativas, pero la de ε² sí: la volatilidad se agrupa aunque los rendimientos no sean predecibles.${k4>3?" La curtosis mayor que 3 refleja colas pesadas.":""}</p>`)
      +rbox(`library(fGarch)\nsim <- garchSim(garchSpec(model = list(omega = ${w}, alpha = ${a}, beta = ${b})), n = ${T})\ne <- as.numeric(sim)\nlibrary(FinTS); ArchTest(e, lags = ${q})   # prueba ARCH-LM\nfit <- garchFit(~ garch(1, 1), data = e, trace = FALSE, cond.dist = "norm")   # ML; usa "QMLE" para robustez\nsummary(fit)`)};
  bindCtl(["ga-w","ga-a","ga-b"],run);onIn(["ga-T","ga-s","ga-q"],run);run()};

// ---------- Fuente bivariada
const fuente2=(p,def)=>{def=Object.assign({},def);return`<div style="margin-bottom:8px">${seg(p+"-src","Datos",[["sim","Simular"],["peg","Pegar dos columnas"]],"sim")}</div><div id="${p}-simbox">${def.html}</div><div id="${p}-pegbox" hidden><label for="${p}-txt">Pega dos columnas (y₁ y₂ por fila; separadas por espacio, tabulación o punto y coma)<textarea id="${p}-txt" rows="5" style="width:100%" placeholder="1,02  3,4&#10;1,10  3,6"></textarea></label></div>`};
const leer2=txt=>{const rows=String(txt).trim().split(/\n+/).map(l=>l.trim().split(/[\s;\t]+/).filter(Boolean).map(s=>parseFloat(s.replace(",","."))));const ok=rows.filter(r=>r.length>=2&&isFinite(r[0])&&isFinite(r[1]));return ok.length>=30?ok.map(r=>[r[0],r[1]]):null};
const pegado=p=>!$(p+"-pegbox").hidden;

// ---------- 10. VAR
SIMS.var=function(){
  $("sim").innerHTML=fuente2("va",{html:`<p class="hint">y_t = c + A₁y_(t−1) + u_t con dos variables.</p><div class="calcf">${nin("va-11","a₁₁",0.5,"0.05")}${nin("va-12","a₁₂",0.3,"0.05")}${nin("va-21","a₂₁",0,"0.05")}${nin("va-22","a₂₂",0.4,"0.05")}${nin("va-r","Correlación de los choques",0.3,"0.1")}${nin("va-T","T",200,"10")}${nin("va-s","Semilla",2,"1")}</div>`})+`<div class="calcf">${nin("va-pm","Rezago máximo a comparar",4,"1")}${nin("va-H","Horizonte del impulso-respuesta",10,"1")}</div><div style="margin:8px 0">${seg("va-ord","Orden de Cholesky",[["12","y₁ primero"],["21","y₂ primero"]],"12")}</div><div class="res" id="va-res"></div><div id="va-o"></div>`;
  let ord="12";const run=()=>{let Y;if(pegado("va")){Y=leer2($("va-txt").value);if(!Y){fail("va","pega al menos 30 filas con dos números.");return}}
    else{const A=[[N("va-11"),N("va-12")],[N("va-21"),N("va-22")]],rho=Math.max(-.95,Math.min(.95,N("va-r"))),T=Math.max(50,Math.min(3000,Math.round(N("va-T")||200))),R=TS.rng(Math.round(N("va-s")||1));Y=[[0,0]];
      if(TS.eig(A).some(z=>z.mod>=1)){fail("va","la matriz A₁ elegida no es estable (algún valor propio con módulo ≥ 1).");return}
      for(let t=1;t<T+100;t++){const z1=R.n(),z2=rho*z1+Math.sqrt(1-rho*rho)*R.n(),p=Y[t-1];Y.push([0.5+A[0][0]*p[0]+A[0][1]*p[1]+z1,1+A[1][0]*p[0]+A[1][1]*p[1]+z2])}Y=Y.slice(100)}
    if(ord==="21")Y=Y.map(r=>[r[1],r[0]]);const nm=ord==="21"?["y₂","y₁"]:["y₁","y₂"],pm=Math.max(1,Math.min(8,Math.round(N("va-pm")||4))),H=Math.max(2,Math.min(30,Math.round(N("va-H")||10)));
    const sel=[...Array(pm)].map((_,i)=>TS.varFit(Y,i+1,pm)),bA=sel.reduce((a,f)=>f.aic<a.aic?f:a),bS=sel.reduce((a,f)=>f.sc<a.sc?f:a),bH=sel.reduce((a,f)=>f.hq<a.hq?f:a),fit=TS.varFit(Y,bS.p),est=fit.mods.every(m=>m<1);
    const g12=TS.granger(Y,fit.p,0,1),g21=TS.granger(Y,fit.p,1,0),irf=TS.irf(fit,H);
    $("va-res").innerHTML=tl([["p por AIC",String(bA.p)],["p por SC (BIC)",String(bS.p),"okt"],["p por HQ",String(bH.p)],["¿Estable?",est?"sí":"no",est?"okt":"badt"]]);
    const cn=["Constante",...[...Array(fit.p)].flatMap((_,i)=>nm.map(v=>`${v}(t−${i+1})`))];
    const ip=(j,k)=>{const v=irf.map(M=>M[j][k]),m=Math.max(...v.map(Math.abs))*1.15||1;return `<div><p class="lbl" style="margin:0 0 -4px">Respuesta de ${nm[j]} a un choque en ${nm[k]}</p>`+plotXY({xr:[0,H],yr:[Math.min(0,...v)-m*.1,Math.max(0,...v)+m*.1],series:[{pts:v.map((x,h)=>[h,x]),col:"--line",w:2.2}],hlines:[{y:0,col:"--muted"}],xl:"h",yl:"",label:`Respuesta de ${nm[j]} a un choque en ${nm[k]}`,H:200})+"</div>"};
    $("va-o").innerHTML=stp(1,"Selección del rezago",`<div class="tbl"><table><tr><th>p</th><th>AIC</th><th>HQ</th><th>SC</th></tr>${sel.map(f=>`<tr${f.p===bS.p?' class="hl"':""}><td>${f.p}</td><td>${f4(f.aic)}${f===bA?" ◀":""}</td><td>${f4(f.hq)}${f===bH?" ◀":""}</td><td>${f4(f.sc)}${f===bS?" ◀":""}</td></tr>`).join("")}</table></div><p class="hint">Criterio = ln|Σ̂_u| + penalización·pK²/T, con la misma muestra para todos.</p>`)
      +stp(2,`VAR(${fit.p}) estimado por MCO ecuación por ecuación`,fit.eqs.map((e,j)=>`<p><b>Ecuación de ${nm[j]}</b></p>${coefTab(cn,e)}`).join("")+`<p>Módulos de los valores propios de la matriz compañera: ${fit.mods.map(f3).join(", ")}. ${est?"Todos menores que 1: el VAR es estable.":"Alguno ≥ 1: el VAR no es estable."}</p>`)
      +stp(3,"Causalidad de Granger",`<div class="tbl"><table><tr><th>H₀</th><th>F</th><th>gl</th><th>p-valor</th><th>Decisión 5 %</th></tr><tr><td>${nm[0]} no causa a ${nm[1]}</td><td>${f3(g12.F)}</td><td>${g12.df1}, ${g12.df2}</td><td>${pv(g12.p)}</td><td>${g12.p<.05?"Se rechaza":"No se rechaza"}</td></tr><tr><td>${nm[1]} no causa a ${nm[0]}</td><td>${f3(g21.F)}</td><td>${g21.df1}, ${g21.df2}</td><td>${pv(g21.p)}</td><td>${g21.p<.05?"Se rechaza":"No se rechaza"}</td></tr></table></div>`)
      +stp(4,"Impulso-respuesta ortogonalizado (Cholesky)",`<div class="grid2">${ip(0,0)}${ip(0,1)}${ip(1,0)}${ip(1,1)}</div><p class="hint">Con ${nm[0]} primero, un choque en ${nm[1]} no afecta a ${nm[0]} en h = 0: por eso la respuesta de ${nm[0]} a ${nm[1]} empieza en cero. Cambia el orden para ver el efecto.</p>`)
      +rbox(`library(vars)\nY <- cbind(${nm[0].replace(/[₁₂]/g,m=>m==="₁"?"y1":"y2")}, ${nm[1].replace(/[₁₂]/g,m=>m==="₁"?"y1":"y2")})\nVARselect(Y, lag.max = ${pm}, type = "const")\nm <- VAR(Y, p = ${fit.p}, type = "const")\nsummary(m); roots(m)\ncausality(m, cause = "${nm[0].replace(/[₁₂]/g,m=>m==="₁"?"y1":"y2")}")\nplot(irf(m, n.ahead = ${H}, ortho = TRUE))`)};
  bindSeg("va-src",v=>{$("va-simbox").hidden=v!=="sim";$("va-pegbox").hidden=v!=="peg";run()});bindSeg("va-ord",v=>{ord=v;run()});onIn(["va-11","va-12","va-21","va-22","va-r","va-T","va-s","va-pm","va-H","va-txt"],run);run()};

// ---------- Pareja cointegrada simulada
const parCoint=(p)=>{const T=Math.max(50,Math.min(3000,Math.round(N(p+"-T")||200))),a=N(p+"-a"),b=N(p+"-b"),rho=Math.max(0,Math.min(1,N(p+"-rho"))),R=TS.rng(Math.round(N(p+"-s")||1)),x=[],u=[];
  for(let t=0;t<T;t++){x.push((t?x[t-1]:0)+R.n());u.push((t?rho*u[t-1]:0)+R.n())}return{x,y:x.map((v,t)=>a+b*v+u[t]),rho}};
const parHTML=p=>`<p class="hint">x_t es un paseo aleatorio; y_t = a + b·x_t + u_t con u_t = ρu_(t−1) + e_t. Si ρ &lt; 1 hay cointegración; si ρ = 1 no.</p><div class="calcf">${nin(p+"-a","a",2,"0.5")}${nin(p+"-b","b",0.8,"0.1")}${nin(p+"-rho","ρ",0.5,"0.05")}${nin(p+"-T","T",200,"10")}${nin(p+"-s","Semilla",5,"1")}</div>`;

// ---------- 11. Engle-Granger
SIMS.eg=function(){
  $("sim").innerHTML=fuente2("eg",{html:parHTML("eg")})+`<div class="res" id="eg-res"></div><div id="eg-g"></div><div id="eg-o"></div>`;
  const run=()=>{let x,y;if(pegado("eg")){const Y=leer2($("eg-txt").value);if(!Y){fail("eg","pega al menos 30 filas con y y x.");return}y=Y.map(r=>r[0]);x=Y.map(r=>r[1])}else({x,y}=parCoint("eg"));
    const ay=TS.adf(y,"c"),ax=TS.adf(x,"c"),E=TS.engleGranger(y,x),rej=E.adf.tstat<E.crit[5],e=E.reg.e,dy=TS.diff(y),dx=TS.diff(x),ecm=TS.ols(dy.map((_,t)=>[1,e[t],dx[t]]),dy);
    $("eg-res").innerHTML=tl([["β̂ de largo plazo",f4(E.reg.b[1]),"okt"],["τ sobre los residuos",f3(E.adf.tstat)],["Crítico EG 5 %",f3(E.crit[5])],["¿Cointegradas?",rej?"sí":"no",rej?"okt":"badt"],["Velocidad de ajuste α",f4(ecm.b[1])]]);
    $("eg-g").innerHTML=linea(y,{label:"Series",extra:[{ys:x,col:"--exam"}]})+legend([["--line","y"],["--exam","x"]])+linea(e,{label:"Residuos de la relación de largo plazo",col:"--good",yl:"ê"});
    $("eg-o").innerHTML=stp(1,"Paso 0: ¿son I(1)?",`<p>ADF con constante: y → τ = ${f3(ay.tstat)}; x → τ = ${f3(ax.tstat)} (crítico 5 % ≈ ${f3(ay.crit[5])}). ${ay.tstat>ay.crit[5]&&ax.tstat>ax.crit[5]?"Ninguna rechaza la raíz unitaria: ambas se tratan como I(1).":"Alguna parece estacionaria: la cointegración solo tiene sentido entre series I(1)."}</p>`)
      +stp(2,"Paso 1: regresión de largo plazo",`<div class="eq al">ŷ_t = ${f4(E.reg.b[0])} + ${f4(E.reg.b[1])}·x_t · R² = ${f3(E.reg.r2)}</div><p class="hint">Los errores estándar de esta regresión no son válidos para inferencia; β̂ es superconsistente si hay cointegración.</p>`)
      +stp(3,"Paso 2: ADF sobre los residuos",`<div class="eq al">Δê_t = γ·ê_(t−1) + Σ δᵢΔê_(t−i) + ε_t, k = ${E.adf.k} ⟹ τ = <b>${f3(E.adf.tstat)}</b></div><p>Críticos de Engle-Granger (MacKinnon, dos variables con constante): 1 % ${f3(E.crit[1])} · 5 % ${f3(E.crit[5])} · 10 % ${f3(E.crit[10])}. ${rej?"Se rechaza la no cointegración: los residuos son estacionarios y hay una relación de largo plazo.":"No se rechaza: no hay evidencia de cointegración (riesgo de regresión espuria)."}</p>`)
      +stp(4,"Paso 3: modelo de corrección de errores",`${coefTab(["Constante","ê(t−1)","Δx(t)"],ecm)}<p>${ecm.b[1]<0?`α̂ = ${f4(ecm.b[1])}: cada periodo se corrige cerca del ${fmt(Math.abs(ecm.b[1])*100,1)} % del desequilibrio del periodo anterior.`:"α̂ no es negativo: no hay corrección hacia el equilibrio."}</p>`)
      +rbox(`library(urca)\nlr <- lm(y ~ x); e <- residuals(lr)\nsummary(ur.df(e, type = "none", selectlags = "AIC"))   # comparar con críticos de Engle-Granger\ndy <- diff(y); dx <- diff(x); e1 <- e[-length(e)]\nsummary(lm(dy ~ e1 + dx))   # modelo de corrección de errores`)};
  bindSeg("eg-src",v=>{$("eg-simbox").hidden=v!=="sim";$("eg-pegbox").hidden=v!=="peg";run()});onIn(["eg-a","eg-b","eg-rho","eg-T","eg-s","eg-txt"],run);run()};

// ---------- 12. Johansen
SIMS.joh=function(){
  $("sim").innerHTML=fuente2("jo",{html:parHTML("jo")})+`<div class="calcf">${nin("jo-k","Rezagos del VAR en niveles (K)",2,"1")}</div><div class="res" id="jo-res"></div><div id="jo-o"></div>`;
  const run=()=>{let Y;if(pegado("jo")){Y=leer2($("jo-txt").value);if(!Y){fail("jo","pega al menos 30 filas con dos números.");return}}else{const P=parCoint("jo");Y=P.y.map((v,i)=>[v,P.x[i]])}
    const k=Math.max(2,Math.min(8,Math.round(N("jo-k")||2))),J=TS.johansen(Y,k),r0=J.trace[0]>J.cv.trace[0][1],r1=J.trace[1]>J.cv.trace[1][1],r=r0?(r1?2:1):0;
    $("jo-res").innerHTML=tl([["λ̂₁",f4(J.lam[0])],["λ̂₂",f4(J.lam[1])],["Rango de cointegración (traza, 5 %)",String(r),"okt"],...(r===1&&J.beta?[["Vector β (normalizado en y)",`(1; ${f4(J.beta[1])})`]]:[])]);
    const fila=(h,s,c,i)=>`<tr><td>${h}</td><td>${f3(s)}</td><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${s>c[1]?"Se rechaza":"No se rechaza"}</td></tr>`;
    $("jo-o").innerHTML=stp(1,"Estadísticos de la traza y del máximo valor propio",`<div class="tbl"><table><tr><th>H₀</th><th>Traza</th><th>10 %</th><th>5 %</th><th>1 %</th><th>Decisión 5 %</th></tr>${fila("r = 0",J.trace[0],J.cv.trace[0])}${fila("r ≤ 1",J.trace[1],J.cv.trace[1])}</table></div>
      <div class="tbl"><table><tr><th>H₀</th><th>Máx. valor propio</th><th>10 %</th><th>5 %</th><th>1 %</th><th>Decisión 5 %</th></tr>${fila("r = 0",J.maxe[0],J.cv.maxe[0])}${fila("r = 1",J.maxe[1],J.cv.maxe[1])}</table></div>
      <div class="eq al">Traza(0) = −T[ln(1 − λ̂₁) + ln(1 − λ̂₂)] = −${J.T}[ln(${f4(1-J.lam[0])}) + ln(${f4(1-J.lam[1])})] = ${f3(J.trace[0])}</div><p class="hint">Críticos de Osterwald-Lenum con constante no restringida (los mismos que reporta urca con ecdet = "none").</p>`)
      +stp(2,"Interpretación",r===1&&J.beta?`<p>Hay una relación de cointegración: y − (${f4(-J.beta[1])})·x es estacionaria. Coeficientes de ajuste α = (${J.alpha.map(f4).join("; ")}): ${J.alpha[0]<0?"y corrige hacia el equilibrio":"y no corrige"}${J.alpha[1]>0?" y x también se mueve hacia él":""}.</p>`:r===0?`<p>No se rechaza r = 0: no hay cointegración; conviene un VAR en diferencias.</p>`:`<p>Se rechaza también r ≤ 1: ambas series serían estacionarias (rango completo); revisa si de verdad son I(1).</p>`)
      +rbox(`library(urca)\nY <- cbind(y, x)\nj <- ca.jo(Y, type = "trace", ecdet = "none", K = ${k}, spec = "transitory")\nsummary(j)\nsummary(ca.jo(Y, type = "eigen", ecdet = "none", K = ${k}, spec = "transitory"))\ncajorls(j, r = 1)   # VEC restringido a un vector`)};
  bindSeg("jo-src",v=>{$("jo-simbox").hidden=v!=="sim";$("jo-pegbox").hidden=v!=="peg";run()});onIn(["jo-a","jo-b","jo-rho","jo-T","jo-s","jo-k","jo-txt"],run);run()};

// ---------- 13. Panel
SIMS.panel=function(){
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("pa-src","Datos",[["sim","Simular"],["peg","Pegar mi panel"]],"sim")}</div>
  <div id="pa-simbox"><p class="hint">y_it = 2 + β·x_it + α_i + u_it. Con «correlación» positiva, α_i está correlacionado con x: efectos aleatorios queda sesgado.</p>${ctl("pa-rho","Correlación entre α_i y x",0,1.5,0.1,0.6)}<div class="calcf">${nin("pa-N","Individuos N",30,"1")}${nin("pa-T","Periodos T",8,"1")}${nin("pa-b","β verdadero",1.5,"0.1")}${nin("pa-sa","σ_α",1,"0.1")}${nin("pa-s","Semilla",3,"1")}</div></div>
  <div id="pa-pegbox" hidden><label for="pa-txt">Pega el panel balanceado en columnas: id, periodo, y, x₁ (y más x si quieres), una fila por observación<textarea id="pa-txt" rows="6" style="width:100%" placeholder="1 2020 10,5 3,2&#10;1 2021 11,0 3,5"></textarea></label></div>
  <div class="res" id="pa-res"></div><div id="pa-o"></div>`;
  const run=()=>{let d;if(!$("pa-pegbox").hidden){const rows=$("pa-txt").value.trim().split(/\n+/).map(l=>l.trim().split(/[\s;\t]+/).map(s=>parseFloat(s.replace(",",".")))).filter(r=>r.length>=4&&r.every(isFinite));
      if(rows.length<10){fail("pa","pega al menos 10 filas con id, periodo, y, x.");return}d=rows.sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(r=>({id:r[0],t:r[1],y:r[2],x:r.slice(3)}));
      const ids=[...new Set(d.map(r=>r.id))];if(d.length%ids.length||ids.some(i=>d.filter(r=>r.id===i).length!==d.length/ids.length)){fail("pa","el panel debe estar balanceado: el mismo número de periodos por individuo.");return}}
    else d=TS.simPanel({N:Math.max(5,Math.min(300,Math.round(N("pa-N")||30))),T:Math.max(2,Math.min(40,Math.round(N("pa-T")||8))),beta:N("pa-b"),rho:V("pa-rho"),su:N("pa-sa"),seed:Math.round(N("pa-s")||1)});
    const P=TS.panel(d),K=P.K,xn=[...Array(K)].map((_,j)=>K>1?`x${j+1}`:"x");if(!P.fe||!P.re){fail("pa","no se pudo estimar el panel.");return}
    const dec=P.haus.p<.05?"efectos fijos":"efectos aleatorios";
    $("pa-res").innerHTML=tl([["N × T",`${P.N} × ${P.T} = ${P.NT}`],["β agrupado",f4(P.pool.b[1])],["β efectos fijos",f4(P.fe.b[0]),"okt"],["β efectos aleatorios",f4(P.re.b[1])],["θ (Swamy-Arora)",f4(P.re.theta)],["Hausman p",pv(P.haus.p),P.haus.p<.05?"badt":"okt"],["Modelo sugerido",dec,"okt"]]);
    $("pa-o").innerHTML=stp(1,"Estimaciones",`<div class="tbl"><table><tr><th>Variable</th><th>Agrupado</th><th>Efectos fijos</th><th>Efectos aleatorios</th></tr>${xn.map((n,j)=>`<tr><td>${n}</td><td>${f4(P.pool.b[j+1])} (${f4(P.pool.se[j+1])})</td><td>${f4(P.fe.b[j])} (${f4(P.fe.se[j])})</td><td>${f4(P.re.b[j+1])} (${f4(P.re.se[j+1])})</td></tr>`).join("")}<tr><td>Constante</td><td>${f4(P.pool.b[0])}</td><td>—</td><td>${f4(P.re.b[0])}</td></tr></table></div><p class="hint">Errores estándar entre paréntesis. Componentes de varianza: σ²_u = ${f4(P.re.s2e)}, σ²_α = ${f4(P.re.s2u)} ⟹ θ = 1 − √(σ²_u/(Tσ²_α + σ²_u)) = ${f4(P.re.theta)}.</p>`)
      +stp(2,"Pruebas",`<div class="tbl"><table><tr><th>Prueba</th><th>Compara</th><th>Estadístico</th><th>p-valor</th><th>Decisión 5 %</th></tr>
        <tr><td>F de efectos individuales</td><td>Agrupado vs. fijos</td><td>F(${P.fF.df1}, ${P.fF.df2}) = ${f3(P.fF.F)}</td><td>${pv(P.fF.p)}</td><td>${P.fF.p<.05?"Hay efectos individuales":"Basta MCO agrupado"}</td></tr>
        <tr><td>LM de Breusch-Pagan</td><td>Agrupado vs. aleatorios</td><td>χ²(1) = ${f3(P.bp.LM)}</td><td>${pv(P.bp.p)}</td><td>${P.bp.p<.05?"σ²_α > 0":"Basta MCO agrupado"}</td></tr>
        <tr><td>Hausman</td><td>Fijos vs. aleatorios</td><td>χ²(${P.haus.df}) = ${f3(P.haus.H)}</td><td>${pv(P.haus.p)}</td><td>${P.haus.p<.05?"Usar efectos fijos":"Efectos aleatorios es consistente y más eficiente"}</td></tr></table></div>${P.haus.neg?`<p class="hint">V_FE − V_RE no resultó definida positiva (pasa en muestras finitas); se reporta el valor absoluto, como hace plm.</p>`:""}`)
      +rbox(`library(plm)\npd <- pdata.frame(datos, index = c("id", "t"))\npo <- plm(y ~ ${xn.join(" + ")}, pd, model = "pooling")\nfe <- plm(y ~ ${xn.join(" + ")}, pd, model = "within")\nre <- plm(y ~ ${xn.join(" + ")}, pd, model = "random")   # Swamy-Arora\npFtest(fe, po); plmtest(po, type = "bp"); phtest(fe, re)\nlibrary(lmtest); coeftest(fe, vcov = vcovHC(fe, cluster = "group"))   # errores agrupados`)};
  bindSeg("pa-src",v=>{$("pa-simbox").hidden=v!=="sim";$("pa-pegbox").hidden=v!=="peg";run()});bindCtl(["pa-rho"],run);onIn(["pa-N","pa-T","pa-b","pa-sa","pa-s","pa-txt"],run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Estacionariedad","Débil","E(y_t) = μ; Var(y_t) = γ₀; Cov(y_t, y_(t−k)) = γ_k","—"],["FAS","Autocorrelación","ρ_k = γ_k/γ₀; banda ±1,96/√T","acf()"],["FAS","Ljung-Box","Q = T(T + 2)Σ ρ̂²_k/(T − k) ~ χ²(m − p − q)","Box.test()"],["AR(1)","Momentos","μ = c/(1 − φ); γ₀ = σ²/(1 − φ²); ρ_k = φ^k","ARMAacf()"],["MA(1)","Autocorrelación","ρ₁ = θ/(1 + θ²); ρ_k = 0 para k ≥ 2","ARMAacf()"],["AR(2)","Estacionariedad","φ₁ + φ₂ < 1; φ₂ − φ₁ < 1; |φ₂| < 1","polyroot()"],["Identificación","AR(p)","FAP se corta en p; FAS decae","pacf()"],["Identificación","MA(q)","FAS se corta en q; FAP decae","acf()"],["Selección","Criterios","AIC = −2lnL + 2k; BIC = −2lnL + k·lnT","AIC(), BIC()"],
    ["Raíz unitaria","ADF","Δy_t = α + βt + γy_(t−1) + Σδ_iΔy_(t−i); H₀: γ = 0","ur.df()"],["Raíz unitaria","Críticos 5 %","−1,94 sin constante; −2,86 con constante; −3,41 con tendencia","—"],["Raíz unitaria","KPSS","H₀: estacionaria; crítico 5 % 0,463 (nivel), 0,146 (tendencia)","kpss.test()"],["Pronóstico","Varianza","Var(e_(T+h)) = σ²Σ_(j<h) ψ_j²","forecast()"],["GARCH","(1,1)","σ²_t = ω + αε²_(t−1) + βσ²_(t−1); Var = ω/(1 − α − β)","garchFit()"],["ARCH","Prueba LM","T·R² de ε̂²_t sobre q rezagos ~ χ²(q)","ArchTest()"],
    ["VAR","Criterios","ln|Σ̂_u| + c_T·pK²/T; AIC c = 2, HQ c = 2lnlnT, SC c = lnT","VARselect()"],["VAR","Granger","F de exclusión de los rezagos de x en la ecuación de y","causality()"],["Cointegración","MCE","Δy_t = c + α(y_(t−1) − βx_(t−1)) + … ; α < 0","lm()"],["Cointegración","Engle-Granger","ADF sin constante en ê; crítico 5 % ≈ −3,34 (2 variables)","ur.df()"],["Johansen","Traza","−TΣ_(i>r) ln(1 − λ̂_i)","ca.jo()"],["Johansen","Máximo","−T ln(1 − λ̂_(r+1))","ca.jo()"],
    ["Panel","Within","y_it − ȳ_i = (x_it − x̄_i)'β + (u_it − ū_i)","plm(model = \"within\")"],["Panel","Swamy-Arora","θ = 1 − √(σ²_u/(Tσ²_α + σ²_u))","plm(model = \"random\")"],["Panel","Hausman","(b_FE − b_RE)'[V_FE − V_RE]⁻¹(b_FE − b_RE) ~ χ²_k","phtest()"],["Panel","Breusch-Pagan","LM = NT/(2(T − 1))·[Σ_i(Σ_t ê_it)²/ΣΣê²_it − 1]² ~ χ²(1)","plmtest()"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Johansen"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th><th>En R</th></tr>`+(rows.length?rows.map(([a,b,c,d])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td><td class="mono">${d}</td></tr>`).join(""):`<tr><td colspan="4">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
