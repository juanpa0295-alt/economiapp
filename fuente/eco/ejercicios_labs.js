// ===================== RESOLVEDOR DE CAMBIO ESTRUCTURAL Y VARIABLES DICÓTOMAS =====================
// Usa comun/estadistica.js (fcdf, tcdf, chi2cdf) y las utilidades del motor común.
const CE={};
const SB=n=>String(n).replace(/\d/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const num=(id,label,val,step)=>`<label>${label}<input type="number" id="${id}" value="${val}" step="${step||"any"}" inputmode="decimal"></label>`;
const txt=(id,label,val)=>`<label>${label}<input type="text" id="${id}" value="${val}" spellcheck="false"></label>`;
CE.T=A=>A[0].map((_,j)=>A.map(r=>r[j]));
CE.mm=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,a,k)=>s+a*B[k][j],0)));
CE.mv=(A,v)=>A.map(r=>r.reduce((s,a,j)=>s+a*v[j],0));
CE.inv=function(M){const n=M.length,A=M.map((r,i)=>[...r,...Array.from({length:n},(_,j)=>i===j?1:0)]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;if(Math.abs(A[p][c])<1e-12)return null;[A[c],A[p]]=[A[p],A[c]];
    const d=A[c][c];for(let j=0;j<2*n;j++)A[c][j]/=d;for(let r=0;r<n;r++)if(r!==c){const f=A[r][c];for(let j=0;j<2*n;j++)A[r][j]-=f*A[c][j]}}return A.map(r=>r.slice(n))};
CE.ols=function(X,y){const XtX=CE.mm(CE.T(X),X),Xty=CE.mv(CE.T(X),y),I=CE.inv(XtX);if(!I)return null;const b=CE.mv(I,Xty),e=y.map((v,i)=>v-X[i].reduce((s,a,j)=>s+a*b[j],0));
  const n=y.length,k=b.length,rss=e.reduce((s,v)=>s+v*v,0),yb=y.reduce((a,c)=>a+c,0)/n,tss=y.reduce((s,v)=>s+(v-yb)**2,0),s2=n>k?rss/(n-k):NaN;
  return{b,e,rss,tss,r2:1-rss/tss,s2,se:I.map((r,i)=>Math.sqrt(s2*r[i])),I,XtX,Xty,n,k}};
CE.fp=(F,a,b)=>1-fcdf(F,a,b);
CE.fcrit=(a,b,al)=>{let lo=0,hi=1;while(CE.fp(hi,a,b)>al&&hi<1e6)hi*=2;for(let k=0;k<100;k++){const m=(lo+hi)/2;if(CE.fp(m,a,b)>al)lo=m;else hi=m}return(lo+hi)/2};
CE.tcrit=(v,al)=>{let lo=0,hi=1;while(2*(1-tcdf(hi,v))>al&&hi<1e6)hi*=2;for(let k=0;k<100;k++){const m=(lo+hi)/2;if(2*(1-tcdf(m,v))>al)lo=m;else hi=m}return(lo+hi)/2};
CE.ccrit=(k,al)=>{let lo=0,hi=1;while(1-chi2cdf(hi,k)>al&&hi<1e6)hi*=2;for(let j=0;j<100;j++){const m=(lo+hi)/2;if(1-chi2cdf(m,k)>al)lo=m;else hi=m}return(lo+hi)/2};
CE.mat=s=>s.trim().split(/\s*;\s*|\n+/).filter(Boolean).map(r=>r.trim().split(/[\s,]+/).map(x=>parseFloat(x)));
const f4=v=>fmt(v,4),f2=v=>fmt(v,2),p4=p=>p<1e-4?"&lt; 0,0001":fmt(p,4);
const veredicto=(F,crit,p,al,h0)=>`<p class="verdict ${F>crit?"bad":"ok"}">${F>crit?`Como ${f4(F)} &gt; ${f4(crit)} (p = ${p4(p)} &lt; ${fmt(al,2)}), se <b>rechaza H₀</b>: ${h0[1]}`:`Como ${f4(F)} ≤ ${f4(crit)} (p = ${p4(p)}), <b>no se rechaza H₀</b>: ${h0[0]}`}</p>`;
const coefTab=(names,R)=>`<div class="tbl"><table><tr><th>Coeficiente</th><th>Estimación</th><th>Error estándar</th><th>t</th></tr>${R.b.map((b,i)=>`<tr><td>${names[i]}</td><td class="num">${f4(b)}</td><td class="num">${isFinite(R.se[i])?f4(R.se[i]):"—"}</td><td class="num">${isFinite(R.se[i])?fmt(b/R.se[i],3):"—"}</td></tr>`).join("")}</table></div>`;
function miniPlot({xs,series,band,xl,yl,H=240,zero}){const W=600,all=[...series.flatMap(s=>s.y),...(band?band.flatMap(b=>b):[])].filter(isFinite);if(!all.length)return"";
  let y0=Math.min(...all,zero?0:Infinity),y1=Math.max(...all,zero?0:-Infinity);if(y0===y1){y0-=1;y1+=1}const pad=(y1-y0)*.08;y0-=pad;y1+=pad;
  const xr=[Math.min(...xs),Math.max(...xs)],f=frame(W,H,xr,[y0,y1],ticks(xr[0],xr[1],nice(Math.max(1,(xr[1]-xr[0])/6))),ticks(y0,y1,nice((y1-y0)/4)),xl,yl);let g="";
  const path=(ys,c,w,d)=>{const pts=xs.map((x,i)=>[x,ys[i]]).filter(p=>isFinite(p[1]));return`<path d="${pts.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(${c})" stroke-width="${w}" ${d?'stroke-dasharray="5 4"':""}/>`};
  if(band)band.forEach(b=>g+=path(b,"--bad",1.6,true));if(zero)g+=`<line x1="${f.sx(xr[0])}" x2="${f.sx(xr[1])}" y1="${f.sy(0)}" y2="${f.sy(0)}" stroke="var(--muted)"/>`;
  series.forEach(s=>{g+=path(s.y,s.c,2.4);xs.forEach((x,i)=>{if(isFinite(s.y[i]))g+=`<circle cx="${f.sx(x)}" cy="${f.sy(s.y[i])}" r="2.8" fill="var(${s.c})"/>`})});
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${yl}">${f.g}${g}</svg></div>`}

SIMS.calc=function(){
  $("sim").innerHTML=`<p class="hint" style="margin:0 0 8px">¿El ejercicio trae la tabla de datos? Entonces usa el <button class="btn" type="button" data-go="t-datos">Laboratorio de datos</button>. Aquí van los que traen resultados ya calculados.</p>
  ${seg("ce-m","Qué te da el enunciado",[["mat","X′X, X′y, y′y"],["rss","SCR, s o R²"],["coef","Modelo con dummies estimado"],["wlm","Wald, LR y LM"],["otras","Otras pruebas"]],"mat")}
  <div class="calcf" style="margin-top:8px"><label>Nivel de significancia α<select id="ce-al"><option value="0.01">1 %</option><option value="0.05" selected>5 %</option><option value="0.1">10 %</option></select></label></div>
  <div id="ce-mat"></div><div id="ce-rss" hidden></div><div id="ce-coef" hidden></div><div id="ce-wlm" hidden></div><div id="ce-otras" hidden><p class="hint">F general con SCR, igualdad de varianzas (Goldfeld-Quandt), Breusch-Pagan con el R² de la regresión auxiliar y Durbin-Watson con d<sub>L</sub> y d<sub>U</sub> de la tabla.</p><div id="ws"></div></div>`;
  const al=()=>+$("ce-al").value;
  // ======== modo matrices
  $("ce-mat").innerHTML=`<div class="chips pre" id="cm-pre"><button type="button" data-k="d41">Dinardo 4.1 (una observación nueva)</button><button type="button" data-k="d49">Dinardo 4.9 (urbano y rural)</button></div>
  <p class="hint">Escribe las matrices por filas separadas con punto y coma: «20 10; 10 30».</p>
  <div class="calcf"><label>X′X muestra 1<input type="text" id="cm-a1" spellcheck="false"></label><label>X′y muestra 1<input type="text" id="cm-b1" spellcheck="false"></label>${num("cm-c1","y′y muestra 1",75)}${num("cm-n1","n₁",20,1)}
  <label>Segunda parte<select id="cm-tipo"><option value="obs">Observaciones nuevas (prueba de pronósticos)</option><option value="mue">Otra muestra resumida (Chow)</option></select></label>
  <label>Nuevas X (filas; con la columna de unos)<input type="text" id="cm-x2" spellcheck="false"></label><label>Nuevas Y<input type="text" id="cm-y2" spellcheck="false"></label>
  <label>X′X muestra 2<input type="text" id="cm-a2" spellcheck="false"></label><label>X′y muestra 2<input type="text" id="cm-b2" spellcheck="false"></label>${num("cm-c2","y′y muestra 2",24)}${num("cm-n2","n₂",10,1)}</div><div id="cm-out"></div>`;
  const PM={d41:{a1:"20 10; 10 30",b1:"30; 40",c1:75,n1:20,tipo:"obs",x2:"1 2",y2:"4",a2:"",b2:"",c2:0,n2:1},d49:{a1:"20 20; 20 25",b1:"10; 20",c1:30,n1:10,tipo:"mue",x2:"",y2:"",a2:"10 10; 10 20",b2:"8; 20",c2:24,n2:10}};
  const setM=k=>{const p=PM[k];Object.entries(p).forEach(([f,v])=>{$("cm-"+f).value=v});runM()};
  const runM=()=>{const o=$("cm-out"),A1=CE.mat($("cm-a1").value),B1=CE.mat($("cm-b1").value).map(r=>r[0]),c1=V("cm-c1"),n1=V("cm-n1"),k=A1.length,a=al();
    if(!k||A1.some(r=>r.length!==k||r.some(v=>!isFinite(v)))||B1.length!==k||!isFinite(c1)){o.innerHTML=err("X′X debe ser cuadrada y X′y tener tantas filas como X′X.");return}
    const I1=CE.inv(A1);if(!I1){o.innerHTML=err("X′X no es invertible.");return}const b1=CE.mv(I1,B1),rss1=c1-b1.reduce((s,b,i)=>s+b*B1[i],0),s1=rss1/(n1-k);
    let h=stp(1,"Muestra 1",`<div class="eq al chain">b₁ = (X′X)⁻¹X′y = [${b1.map(f4).join("; ")}]<br>SCR₁ = y′y − b₁′X′y = ${fm(c1)} − ${f4(b1.reduce((s,b,i)=>s+b*B1[i],0))} = <b>${f4(rss1)}</b> &nbsp; s₁² = SCR₁/(n₁ − k) = ${f4(s1)}</div>`);
    if($("cm-tipo").value==="obs"){const X2=CE.mat($("cm-x2").value),y2=CE.mat($("cm-y2").value).flat();if(!X2.length||X2.some(r=>r.length!==k)||y2.length!==X2.length){o.innerHTML=h+err(`Cada fila nueva de X debe tener ${k} valores (incluido el 1) y debe haber una Y por fila.`);return}
      const n2=X2.length,d=y2.map((v,i)=>v-X2[i].reduce((s,x,j)=>s+x*b1[j],0)),Vd=X2.map((r,i)=>X2.map((r2,j)=>(i===j?1:0)+r.reduce((s,v,p)=>s+v*I1[p].reduce((t,mm,q)=>t+mm*r2[q],0),0))),Vi=CE.inv(Vd),F=d.reduce((s,v,i)=>s+v*Vi[i].reduce((t,mm,j)=>t+mm*d[j],0),0)/(n2*s1),cr=CE.fcrit(n2,n1-k,a),p=CE.fp(F,n2,n1-k);
      h+=stp(2,"Prueba de pronósticos de Chow",`<div class="eq al chain">Ŷ = X₂b₁ = [${X2.map(r=>f4(r.reduce((s,x,j)=>s+x*b1[j],0))).join("; ")}] &nbsp; d = y₂ − Ŷ = [${d.map(f4).join("; ")}]<br>Var(d) = s²[I + X₂(X₁′X₁)⁻¹X₂′] ⇒ factor = ${Vd.length===1?f4(Vd[0][0]):"matriz"}<br>F = d′[I + X₂(X₁′X₁)⁻¹X₂′]⁻¹d / (n₂ s₁²) = <b>${f4(F)}</b> ~ F(${n2}, ${n1-k})</div><div class="res">${tiles([["F",f4(F)],["F crítico",f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["la observación nueva es compatible con la relación estimada: parámetros constantes.","la observación nueva no se ajusta a la relación estimada: hay evidencia de cambio."])}`)}
    else{const A2=CE.mat($("cm-a2").value),B2=CE.mat($("cm-b2").value).map(r=>r[0]),c2=V("cm-c2"),n2=V("cm-n2");if(A2.length!==k||B2.length!==k){o.innerHTML=h+err("La muestra 2 debe tener las mismas dimensiones.");return}
      const I2=CE.inv(A2),b2=CE.mv(I2,B2),rss2=c2-b2.reduce((s,b,i)=>s+b*B2[i],0),A=A1.map((r,i)=>r.map((v,j)=>v+A2[i][j])),B=B1.map((v,i)=>v+B2[i]),I=CE.inv(A),b=CE.mv(I,B),rssR=c1+c2-b.reduce((s,v,i)=>s+v*B[i],0),n=n1+n2,F=((rssR-rss1-rss2)/k)/((rss1+rss2)/(n-2*k)),cr=CE.fcrit(k,n-2*k,a),p=CE.fp(F,k,n-2*k);
      h+=stp(2,"Muestra 2",`<div class="eq al chain">b₂ = [${b2.map(f4).join("; ")}] &nbsp; SCR₂ = ${fm(c2)} − ${f4(b2.reduce((s,v,i)=>s+v*B2[i],0))} = <b>${f4(rss2)}</b></div>`)
        +stp(3,"Muestra completa (restringido): se suman las matrices",`<div class="eq al chain">X′X = X₁′X₁ + X₂′X₂ = [${A.map(r=>r.map(fm).join(" ")).join("; ")}] &nbsp; X′y = [${B.map(fm).join("; ")}] &nbsp; y′y = ${fm(c1+c2)}<br>b = [${b.map(f4).join("; ")}] &nbsp; SCR_R = <b>${f4(rssR)}</b></div>`)
        +stp(4,"Prueba de Chow",`<div class="eq al chain">F = [(SCR_R − SCR₁ − SCR₂)/k] / [(SCR₁ + SCR₂)/(n − 2k)] = [(${f4(rssR)} − ${f4(rss1+rss2)})/${k}] / [${f4(rss1+rss2)}/${n-2*k}] = <b>${f4(F)}</b></div><div class="res">${tiles([["F",f4(F)],[`F crítico (${k}, ${n-2*k})`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["la misma relación sirve para las dos muestras.","la relación es distinta en las dos muestras."])}`)}
    if($("cm-tipo").value==="mue"){const A2=CE.mat($("cm-a2").value),B2=CE.mat($("cm-b2").value).map(r=>r[0]),c2=V("cm-c2"),n2=V("cm-n2");if(A2.length===k&&CE.inv(A2)){RC.wrap(o,h,"calcula tú la prueba de Chow",box=>RC.chowMat(box,A1,B1,c1,n1,A2,B2,c2,n2,["Intercepto",...Array.from({length:k-1},(_,i)=>k===2?"X":"X"+(i+1))]));return}}
    o.innerHTML=h};
  $("cm-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setM(b.dataset.k)});
  $("ce-mat").querySelectorAll("input,select").forEach(el=>el.addEventListener("input",runM));
  // ======== modo SCR
  $("ce-rss").innerHTML=`<div class="chips pre" id="cr-pre"><button type="button" data-k="e6">Ejercicio 6 (tres periodos)</button><button type="button" data-k="d42">Dinardo 4.2 (estacionalidad y subperiodos)</button><button type="button" data-k="d48">Dinardo 4.8 (función de producción)</button><button type="button" data-k="d410">Dinardo 4.10 (grupos de ingreso)</button></div>
  <p class="hint">Una fila por submuestra: «n, SCR». Si el ejercicio da el error estándar de la regresión s, escribe «n, s=0.0457» y se calcula SCR = s²(n − k); si da la varianza residual, «n, v=0.26».</p>
  <div class="calcf"><label style="grid-column:1/-1">Submuestras<textarea id="cr-sub" rows="3" class="ce-ta" spellcheck="false"></textarea></label>
  <label>Modelo completo: SCR_R, «s=…», «v=…» o «R2=…; TSS=…»<input type="text" id="cr-r" spellcheck="false"></label>${num("cr-k","k: parámetros por ecuación (con intercepto)",2,1)}</div><div id="cr-out"></div>`;
  const PR={e6:{sub:"8, 2379.315\n12, 3679.020\n7, 1295.861",r:"R2=0.9974; TSS=6403270",k:2},d42:{sub:"44, 9.32\n32, 7.46",r:"18.48",k:4},d48:{sub:"20, s=0.04573\n19, s=0.02185",r:"s=0.03755",k:3},d410:{sub:"102, v=0.26\n102, v=0.42\n52, v=0.30",r:"v=0.38",k:2}};
  const setR=k=>{const p=PR[k];$("cr-sub").value=p.sub;$("cr-r").value=p.r;$("cr-k").value=p.k;runR()};
  const toRSS=(s,n,k)=>{s=s.trim();let m;if((m=s.match(/^s\s*=\s*([\d.eE+-]+)/i)))return{v:(+m[1])**2*(n-k),txt:`s²(n − k) = ${m[1]}²·${n-k}`};if((m=s.match(/^v\s*=\s*([\d.eE+-]+)/i)))return{v:(+m[1])*(n-k),txt:`s²(n − k) = ${m[1]}·${n-k}`};
    if((m=s.match(/R2\s*=\s*([\d.eE+-]+)\s*;\s*TSS\s*=\s*([\d.eE+-]+)/i)))return{v:(1-m[1])*m[2],txt:`(1 − R²)·TSS = (1 − ${m[1]})·${m[2]}`};const v=parseFloat(s);return{v,txt:fm(v)}};
  const runR=()=>{const o=$("cr-out"),k=V("cr-k"),a=al(),rows=$("cr-sub").value.trim().split(/\n+/).map(r=>r.split(",")).filter(r=>r.length>=2);
    if(rows.length<2||!(k>=1)){o.innerHTML=err("Escribe al menos dos submuestras y k ≥ 1.");return}
    const subs=rows.map(r=>{const n=parseInt(r[0],10);return{n,...toRSS(r.slice(1).join(","),n,k)}});if(subs.some(s=>!(s.n>k)||!isFinite(s.v))){o.innerHTML=err("Cada submuestra necesita n > k y una SCR válida.");return}
    const m=subs.length,n=subs.reduce((s,x)=>s+x.n,0),R=toRSS($("cr-r").value,n,k);if(!isFinite(R.v)){o.innerHTML=err("Revisa la SCR del modelo completo.");return}
    const nr=subs.reduce((s,x)=>s+x.v,0),q=(m-1)*k,g2=n-m*k,F=((R.v-nr)/q)/(nr/g2),cr=CE.fcrit(q,g2,a),p=CE.fp(F,q,g2);
    o.innerHTML=stp(1,"Las SCR",`<div class="tbl"><table><tr><th>Submuestra</th><th>n</th><th>SCR</th></tr>${subs.map((s,i)=>`<tr><td>${i+1}</td><td class="num">${s.n}</td><td class="num">${s.txt} = ${f4(s.v)}</td></tr>`).join("")}<tr><td><b>Completa (restringido)</b></td><td class="num">${n}</td><td class="num">${R.txt} = ${f4(R.v)}</td></tr></table></div><p>SCR_NR = suma de las SCR de las submuestras = <b>${f4(nr)}</b>.</p>`)
      +stp(2,"Prueba F de estabilidad de los parámetros",`<div class="eq">H₀: β<sup>(1)</sup> = ${m>2?"β<sup>(2)</sup> = … = ":""}β<sup>(${m})</sup> &nbsp; (${q} restricciones: ${m-1} igualdades de ${k} coeficientes)</div>
        <div class="eq al chain">F = [(SCR_R − SCR_NR)/((m − 1)k)] / [SCR_NR/(n − mk)] = [(${f4(R.v)} − ${f4(nr)})/${q}] / [${f4(nr)}/${g2}] = <b>${f4(F)}</b></div><div class="res">${tiles([["F",f4(F)],[`F crítico (${q}, ${g2}) al ${a*100} %`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["los parámetros son estables entre las submuestras.","los parámetros no son los mismos en todas las submuestras: hay cambio estructural."])}`)};
  $("cr-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setR(b.dataset.k)});
  $("ce-rss").querySelectorAll("textarea,input").forEach(el=>el.addEventListener("input",runR));
  // ======== modo modelo estimado
  $("ce-coef").innerHTML=`<div class="chips pre" id="cc-pre"><button type="button" data-k="e2">Ejercicio 2 (cerveza por género)</button><button type="button" data-k="e15">Ejercicio 15 (reforma)</button></div>
  <p class="hint">Modelo Ŷ = β₁ + δ₁D + β₂X + δ₂DX. Si no hay errores estándar (ejercicio 15), déjalos en 0.</p>
  <div class="calcf">${num("cc-b1","β₁ (intercepto)",186.47)}${num("cc-s1","e.e.(β₁)",45.67)}${num("cc-d1","δ₁ (D)",-126)}${num("cc-sd1","e.e.(δ₁)",57.01)}${num("cc-b2","β₂ (X)",0.23)}${num("cc-s2","e.e.(β₂)",0.09)}${num("cc-d2","δ₂ (D·X)",-0.13)}${num("cc-sd2","e.e.(δ₂)",0.10)}${num("cc-n","n",34,1)}
  ${txt("cc-g0","Grupo D = 0","hombres")}${txt("cc-g1","Grupo D = 1","mujeres")}</div><div id="cc-out"></div>`;
  const PC={e2:[186.47,45.67,-126,57.01,0.23,0.09,-0.13,0.10,34,"hombres","mujeres"],e15:[2,0,2.5,0,0.5,0,-0.25,0,0,"antes de la reforma","después de la reforma"]};
  const ids=["cc-b1","cc-s1","cc-d1","cc-sd1","cc-b2","cc-s2","cc-d2","cc-sd2","cc-n","cc-g0","cc-g1"];
  const runC=()=>{const[b1,s1,d1,sd1,b2,s2,d2,sd2,n]=ids.slice(0,9).map(V),g0=$("cc-g0").value,g1=$("cc-g1").value,a=al(),gl=n-4,tc=gl>0?CE.tcrit(gl,a):NaN;
    const tr=(nm,c,s,lab)=>{if(!(s>0)||!(gl>0))return`<tr><td>${nm}</td><td class="num">${f4(c)}</td><td>—</td><td>—</td><td>${lab}</td></tr>`;const t=c/s,p=2*(1-tcdf(Math.abs(t),gl));return`<tr><td>${nm}</td><td class="num">${f4(c)}</td><td class="num">${fmt(t,3)}</td><td class="num">${p4(p)}</td><td>${lab}${Math.abs(t)>tc?" <b>Significativo</b>":" No significativo"}</td></tr>`};
    $("cc-out").innerHTML=stp(1,"Las dos ecuaciones",`<div class="eq al chain">${g0} (D = 0): Ŷ = ${f4(b1)} ${b2<0?"−":"+"} ${f4(Math.abs(b2))}X<br>${g1} (D = 1): Ŷ = (${f4(b1)} ${d1<0?"−":"+"} ${f4(Math.abs(d1))}) + (${f4(b2)} ${d2<0?"−":"+"} ${f4(Math.abs(d2))})X = ${f4(b1+d1)} ${b2+d2<0?"−":"+"} ${f4(Math.abs(b2+d2))}X</div>
      <ul><li><b>β₁ = ${f4(b1)}:</b> valor esperado de Y para ${g0} cuando X = 0 (intercepto o componente autónomo).</li><li><b>δ₁ = ${f4(d1)}:</b> diferencia en el intercepto de ${g1} frente a ${g0}: el intercepto ${d1<0?"baja":"sube"} ${f4(Math.abs(d1))}.</li><li><b>β₂ = ${f4(b2)}:</b> efecto marginal de X para ${g0}: si X sube 1 unidad, Y cambia ${f4(b2)}.</li><li><b>δ₂ = ${f4(d2)}:</b> diferencia en la pendiente: para ${g1} el efecto marginal es ${f4(b2+d2)}.</li></ul>
      <p>La diferencia en Y entre los grupos para un mismo X es δ₁ + δ₂X = ${f4(d1)} ${d2<0?"−":"+"} ${f4(Math.abs(d2))}X: depende del nivel de X cuando δ₂ ≠ 0.</p>`)
      +(gl>0&&[s1,sd1,s2,sd2].some(v=>v>0)?stp(2,"Pruebas t individuales",`<p>H₀: coeficiente = 0 frente a H₁: ≠ 0, con t(${gl}) crítico = ${f4(tc)} al ${a*100} %.</p><div class="tbl"><table><tr><th>Coeficiente</th><th>Estimación</th><th>t</th><th>p</th><th>Lectura</th></tr>${tr("β₁",b1,s1,"Intercepto de "+g0)}${tr("δ₁",d1,sd1,"¿Distinto intercepto?")}${tr("β₂",b2,s2,"Pendiente de "+g0)}${tr("δ₂",d2,sd2,"¿Distinta pendiente?")}</table></div>
        <p>${sd2>0?(Math.abs(d2/sd2)>tc?`Se rechaza δ₂ = 0: la pendiente es distinta entre ${g0} y ${g1}.`:`No se rechaza δ₂ = 0: no hay evidencia de que la pendiente difiera entre ${g0} y ${g1}.`):""} ${sd1>0?(Math.abs(d1/sd1)>tc?`Se rechaza δ₁ = 0: el intercepto (componente autónomo) es distinto.`:`No se rechaza δ₁ = 0: no hay evidencia de un intercepto distinto.`):""}</p><p class="hint">Para probar δ₁ = δ₂ = 0 a la vez hace falta un F conjunto (o la covarianza entre los estimadores, o las SCR de los dos modelos): las pruebas t por separado no bastan.</p>`):"")};
  $("cc-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;PC[b.dataset.k].forEach((v,i)=>$(ids[i]).value=v);runC()});
  $("ce-coef").querySelectorAll("input").forEach(el=>el.addEventListener("input",runC));
  // ======== modo W, LR, LM
  $("ce-wlm").innerHTML=`<div class="chips pre"><button type="button" id="cw-pre">Ejercicio 12 (Nerlove)</button></div><div class="calcf">${num("cw-n","n",29,1)}${num("cw-rr","SCR restringido",0.364)}${num("cw-ru","SCR no restringido",0.336)}${num("cw-q","q: número de restricciones",1,1)}${num("cw-k","k del no restringido (con intercepto)",5,1)}</div><div id="cw-out"></div>`;
  const runW=()=>{const[n,rr,ru,q,k]=["cw-n","cw-rr","cw-ru","cw-q","cw-k"].map(V),a=al();if(!(n>k&&rr>=ru&&ru>0&&q>=1)){$("cw-out").innerHTML=err("Se necesita n > k, SCR restringido ≥ no restringido > 0 y q ≥ 1.");return}
    const W=n*(rr-ru)/ru,LR=n*Math.log(rr/ru),LM=n*(rr-ru)/rr,F=((rr-ru)/q)/(ru/(n-k)),cc=CE.ccrit(q,a),fc=CE.fcrit(q,n-k,a);
    $("cw-out").innerHTML=`<div class="tbl"><table><tr><th>Prueba</th><th>Fórmula</th><th>Valor</th><th>Crítico</th><th>p</th><th>Decisión</th></tr>
      <tr><td>Wald</td><td>n(SCR_R − SCR_NR)/SCR_NR</td><td class="num">${f4(W)}</td><td class="num">χ²(${q}) = ${f4(cc)}</td><td class="num">${p4(1-chi2cdf(W,q))}</td><td>${W>cc?"Rechaza":"No rechaza"}</td></tr>
      <tr><td>Razón de verosimilitud (LR)</td><td>n·ln(SCR_R/SCR_NR)</td><td class="num">${f4(LR)}</td><td class="num">${f4(cc)}</td><td class="num">${p4(1-chi2cdf(LR,q))}</td><td>${LR>cc?"Rechaza":"No rechaza"}</td></tr>
      <tr><td>Multiplicador de Lagrange (LM)</td><td>n(SCR_R − SCR_NR)/SCR_R</td><td class="num">${f4(LM)}</td><td class="num">${f4(cc)}</td><td class="num">${p4(1-chi2cdf(LM,q))}</td><td>${LM>cc?"Rechaza":"No rechaza"}</td></tr>
      <tr><td>F (muestra finita)</td><td>[(SCR_R − SCR_NR)/q]/[SCR_NR/(n − k)]</td><td class="num">${f4(F)}</td><td class="num">F(${q}, ${n-k}) = ${f4(fc)}</td><td class="num">${p4(CE.fp(F,q,n-k))}</td><td>${F>fc?"Rechaza":"No rechaza"}</td></tr></table></div>
      <p>Se cumple la desigualdad W ≥ LR ≥ LM (${f4(W)} ≥ ${f4(LR)} ≥ ${f4(LM)}): con muestras pequeñas pueden llevar a decisiones distintas, y el Wald es el que más rechaza.</p>`};
  $("cw-pre").onclick=()=>{[["cw-n",29],["cw-rr",0.364],["cw-ru",0.336],["cw-q",1],["cw-k",5]].forEach(([i,v])=>$(i).value=v);runW()};
  $("ce-wlm").querySelectorAll("input").forEach(el=>el.addEventListener("input",runW));
  const MODES=["mat","rss","coef","wlm","otras"],mode=v=>{MODES.forEach(k=>$("ce-"+k).hidden=k!==v);$("ce-m").querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===v))};
  bindSeg("ce-m",mode);
  $("ce-al").addEventListener("input",()=>{runM();runR();runC();runW()});
  // Otras pruebas: la antigua Calculadora de pruebas, sin su pestaña de Chow (Chow está en «SCR, s o R²»)
  const pf0=window.CALC_PRE;window.CALC_PRE=null;
  try{SIMS.wsCalc();const cb=$("ws").querySelector('[data-ct="chow"]');if(cb){cb.remove();const f=$("ws").querySelector('[data-ct="f"]');if(f)f.click()}}catch(e){$("ws").innerHTML=err(e.message)}
  setM("d41");setR("e6");runC();runW();
  // Llegadas con datos: desde un punto de un taller (TOOL_PRE = "modo:ejemplo") o desde las matrices paso a paso
  const pre=window.TOOL_PRE;window.TOOL_PRE=null;
  if(pf0&&isFinite(pf0.scrR)){mode("rss");const n1=pf0.n1||Math.floor(pf0.n/2);$("cr-sub").value=`${n1}, ${+pf0.scr1.toFixed(6)}\n${pf0.n-n1}, ${+pf0.scr2.toFixed(6)}`;$("cr-r").value=String(+pf0.scrR.toFixed(6));$("cr-k").value=pf0.k;runR()}
  else if(pre&&/^\w+:\w+$/.test(pre)){const[m,k]=pre.split(":");if(MODES.includes(m)){mode(m);
    if(m==="mat"&&PM[k])setM(k);if(m==="rss"&&PR[k])setR(k);if(m==="coef"&&PC[k]){PC[k].forEach((v,i)=>$(ids[i]).value=v);runC()}if(m==="wlm")$("cw-pre").click()}}};
