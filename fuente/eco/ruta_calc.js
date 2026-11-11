
// ===================== MODO PRÁCTICA: RUTA DE CÁLCULOS CON PASOS BLOQUEADOS =====================
// Cada paso dice qué se calcula, para qué sirve, qué necesita antes y con qué fórmula. Se desbloquea
// solo cuando todos los pasos de los que depende están resueltos (o revelados).
const RC={};
RC.parse=s=>{s=String(s==null?"":s).trim().replace(/\s/g,"");if(s==="")return NaN;if(/^-?[\d.]+,\d+$/.test(s))s=s.replace(/\./g,"").replace(",",".");else s=s.replace(",",".");const v=Number(s);return isFinite(v)?v:NaN};
RC.decs=s=>{const m=String(s).trim().match(/[.,](\d+)$/);return m?m[1].length:0};
RC.close=(raw,v)=>{const a=RC.parse(raw);if(!isFinite(a))return false;if(Math.abs(a-v)<=0.005*Math.abs(v)+1e-12)return true;const d=RC.decs(raw);return d>=2&&Math.abs(a-v)<=0.6*10**-d&&Math.abs(v)>=10**(1-d)};
RC.fmtV=(v,dec)=>Array.isArray(v)?(Array.isArray(v[0])?"["+v.map(r=>r.map(x=>fmt(x,dec)).join("  ")).join(" ; ")+"]":"["+v.map(x=>fmt(x,dec)).join(" ; ")+"]"):typeof v==="string"?v:fmt(v,dec);
// steps: [{id,t,why,f,deps:[],val,shape:"n"|"v"|"m"|"c",labels,choices,dec,hint(),done(),tool}]
RC.mount=function(el,title,intro,steps){const st={},by={};steps.forEach(s=>{st[s.id]="lock";by[s.id]=s});const uid="rc"+Math.random().toString(36).slice(2,7);
  const ready=s=>(s.deps||[]).every(d=>st[d]==="ok"||st[d]==="rev");
  const refresh=()=>{steps.forEach(s=>{if(st[s.id]==="lock"&&ready(s))st[s.id]="open"});
    const ok=steps.filter(s=>st[s.id]==="ok").length,rev=steps.filter(s=>st[s.id]==="rev").length;
    el.querySelector(".rc-prog").innerHTML=`<div class="bar"><i style="width:${(ok+rev)/steps.length*100}%"></i></div><span>${ok} resueltos${rev?` · ${rev} revelados`:""} de ${steps.length}</span>`;
    el.querySelector(".rc-map").innerHTML=steps.map((s,i)=>`<button type="button" class="rc-chip ${st[s.id]}" data-rcgo="${uid}-${s.id}" title="${esc(s.t)}"><span>${st[s.id]==="ok"?"✓":st[s.id]==="rev"?"👁":st[s.id]==="lock"?"🔒":i+1}</span> ${s.short||s.t}</button>`).join("");
    steps.forEach(s=>{const c=el.querySelector(`[data-s="${s.id}"]`);c.className="rc-step "+st[s.id];const need=(s.deps||[]).filter(d=>!(st[d]==="ok"||st[d]==="rev"));
      c.querySelector(".rc-need").innerHTML=(s.deps||[]).length?`<b>Necesita:</b> ${s.deps.map(d=>`<span class="rc-dep ${st[d]==="ok"||st[d]==="rev"?"ok":""}">${by[d].short||by[d].t}</span>`).join(" ")}`:"<b>No necesita nada antes:</b> es un punto de partida.";
      c.querySelector(".rc-body").hidden=st[s.id]==="lock";c.querySelector(".rc-lock").hidden=st[s.id]!=="lock";
      c.querySelector(".rc-lock").innerHTML=`🔒 Bloqueado: primero resuelve ${need.map(d=>`<b>${by[d].short||by[d].t}</b>`).join(", ")}.`;
      const inp=c.querySelectorAll("input,select");inp.forEach(x=>x.disabled=st[s.id]==="ok"||st[s.id]==="rev");
      c.querySelector(".rc-act").hidden=st[s.id]==="ok"||st[s.id]==="rev"});
    if(steps.every(s=>st[s.id]==="ok"||st[s.id]==="rev"))el.querySelector(".rc-end").innerHTML=`<p class="verdict ok">Terminaste la ruta${rev?` (revelaste ${rev} paso${rev>1?"s":""}: repítela sin revelar para comprobar que ya lo dominas)`:" sin revelar ningún paso"}. Compara con el resultado completo del resolvedor.</p>`;else el.querySelector(".rc-end").innerHTML=""};
  const inputs=s=>{if(s.shape==="c")return`<select class="rc-in"><option value="">— escoge —</option>${s.choices.map(c=>`<option>${c}</option>`).join("")}</select>`;
    if(s.shape==="n")return`<input class="rc-in" type="text" inputmode="decimal" placeholder="tu resultado">`;
    if(s.shape==="v")return`<div class="rc-vec">${s.val.map((_,i)=>`<label>${s.labels?s.labels[i]:"["+(i+1)+"]"}<input class="rc-in" type="text" inputmode="decimal"></label>`).join("")}</div>`;
    return`<div class="rc-mat" style="grid-template-columns:repeat(${s.val[0].length},minmax(70px,1fr))">${s.val.flat().map(()=>`<input class="rc-in" type="text" inputmode="decimal">`).join("")}</div>`};
  el.innerHTML=`<div class="rc"><h4 class="subh">${title}</h4>${intro?`<p class="hint">${intro}</p>`:""}<div class="prog rc-prog"></div><div class="rc-map"></div>
    <p class="hint">Escribe cada resultado con al menos 4 cifras significativas (coma o punto decimal). Se acepta un error de redondeo de hasta 0,5 %.</p>
    ${steps.map((s,i)=>`<div class="rc-step" id="${uid}-${s.id}" data-s="${s.id}"><div class="rc-h"><span class="n">${i+1}</span><b>${s.t}</b></div><p class="rc-why">${s.why}</p><p class="rc-need"></p><p class="rc-lock"></p>
      <div class="rc-body"><div class="eq al">${s.f}</div>${s.tool?`<p class="hint">${s.tool}</p>`:""}${inputs(s)}<div class="chips pre rc-act"><button type="button" class="btn solid" data-a="chk">Comprobar</button><button type="button" class="btn" data-a="hint">Pista</button><button type="button" class="btn" data-a="rev">Revelar</button></div><div class="rc-msg"></div></div></div>`).join("")}
    <div class="rc-end"></div></div>`;
  el.querySelector(".rc-map").addEventListener("click",e=>{const b=e.target.closest("[data-rcgo]");if(!b)return;const t=document.getElementById(b.dataset.rcgo);if(t)t.scrollIntoView({behavior:"smooth",block:"center"})},true);
  steps.forEach(s=>{const c=el.querySelector(`[data-s="${s.id}"]`),msg=c.querySelector(".rc-msg"),ins=[...c.querySelectorAll(".rc-in")];
    const solved=how=>{st[s.id]=how;msg.innerHTML=`<p class="verdict ${how==="ok"?"ok":"warnv"}">${how==="ok"?"¡Correcto!":"Respuesta"}: <b>${RC.fmtV(s.val,(s.dec??4))}</b>. ${s.done?s.done():""}</p>`;refresh()};
    c.querySelector('[data-a="chk"]').onclick=()=>{let good;
      if(s.shape==="c")good=ins[0].value===s.val;else if(s.shape==="n")good=RC.close(ins[0].value,s.val);else{const flat=s.shape==="v"?s.val:s.val.flat();const res=flat.map((v,i)=>RC.close(ins[i].value,v));ins.forEach((x,i)=>x.classList.toggle("bad",!res[i]));good=res.every(Boolean)}
      if(good)solved("ok");else msg.innerHTML=`<p class="verdict bad">Todavía no. ${s.shape==="v"||s.shape==="m"?"Las casillas en rojo no coinciden. ":""}Revisa la fórmula o pide una pista.</p>`};
    c.querySelector('[data-a="hint"]').onclick=()=>{msg.innerHTML=`<p class="link"><b>Pista:</b> ${s.hint?s.hint():"usa la fórmula de arriba con los resultados de los pasos que necesita."}</p>`};
    c.querySelector('[data-a="rev"]').onclick=()=>{if(s.shape==="c")ins[0].value=s.val;else if(s.shape==="n")ins[0].value=fmt(s.val,(s.dec??4));else(s.shape==="v"?s.val:s.val.flat()).forEach((v,i)=>{ins[i].value=fmt(v,(s.dec??4));ins[i].classList.remove("bad")});solved("rev")}});
  refresh()};

// ---------- piezas comunes
RC.mtx=A=>`<span class="rc-mx">[${A.map(r=>r.map(x=>fm(+x.toPrecision(6))).join("  ")).join(" ; ")}]</span>`;
RC.sums=(X,y)=>({XtX:CE.mm(CE.T(X),X),Xty:CE.mv(CE.T(X),y),yty:y.reduce((a,v)=>a+v*v,0)});
RC.regSteps=function(pre,lab,X,y,names,opt){opt=opt||{};const S=RC.sums(X,y),I=CE.inv(S.XtX);if(!I)return null;const b=CE.mv(I,S.Xty),btXy=b.reduce((a,v,i)=>a+v*S.Xty[i],0),scr=S.yty-btXy,k=X[0].length;
  const P=pre?pre+"-":"",nm=names,sh=s=>`${s}${lab?" ("+lab+")":""}`,steps=[];
  if(!opt.given){steps.push({id:P+"xtx",t:sh("Matriz X′X"),short:sh("X′X"),why:"Resume las regresoras: en la diagonal están las sumas de cuadrados y fuera de ella los productos cruzados. Sin ella no se puede despejar b.",deps:opt.deps||[],f:`X′X = Σ xᵢxᵢ′ &nbsp; (orden: ${nm.join(", ")})`,shape:"m",val:S.XtX,dec:4,tool:"En Excel: =MMULT(TRANSPONER(X);X). En R: t(X) %*% X.",hint:()=>`la posición (1,1) es n = ${y.length}; la (1,2) es la suma de ${nm[1]||"X"}; la (2,2) es la suma de ${nm[1]||"X"}².`},
      {id:P+"xty",t:sh("Vector X′y"),short:sh("X′y"),why:"Junta la información de Y con cada regresora. Es el otro ingrediente de las ecuaciones normales X′Xb = X′y.",deps:opt.deps||[],f:"X′y = Σ xᵢyᵢ",shape:"v",labels:nm,val:S.Xty,dec:4,tool:"En R: t(X) %*% y.",hint:()=>`el primer elemento es Σy = ${fmt(S.Xty[0],4)}; los demás son Σ(x·y) para cada regresora.`},
      {id:P+"yty",t:sh("Escalar y′y"),short:sh("y′y"),why:"Es la suma de los cuadrados de Y. Se necesita para la SCR sin calcular residuo por residuo.",deps:opt.deps||[],f:"y′y = Σ yᵢ²",shape:"n",val:S.yty,dec:4,tool:"En Excel: =SUMAPRODUCTO(Y;Y). En R: sum(y^2).",hint:()=>`eleva al cuadrado cada valor de Y y súmalos (hay ${y.length}).`})}
  const d0=opt.given?(opt.deps||[]):[P+"xtx",P+"xty"];
  steps.push({id:P+"b",t:sh("Coeficientes b = (X′X)⁻¹X′y"),short:sh("b"),why:"Son los estimadores de MCO: la solución de las ecuaciones normales.",deps:d0,f:`b = (X′X)⁻¹X′y${opt.given?` con X′X = ${RC.mtx(S.XtX)} y X′y = [${S.Xty.map(v=>fm(+v.toPrecision(6))).join("; ")}]`:""}`,shape:"v",labels:nm,val:b,dec:4,
    tool:"En Excel: =MMULT(MINVERSA(XtX);Xty). En R: solve(XtX, Xty).",hint:()=>k===2?`con 2×2: (X′X)⁻¹ = (1/det)·[d −b; −c a], det = ${fmt(S.XtX[0][0]*S.XtX[1][1]-S.XtX[0][1]*S.XtX[1][0],4)}.`:`(X′X)⁻¹ = ${RC.mtx(I)}; multiplícala por X′y.`,done:()=>`Ŷ = ${b.map((v,i)=>(i?(v<0?" − ":" + "):"")+fmt(i?Math.abs(v):v,4)+(i?"·"+nm[i]:"")).join("")}.`});
  steps.push({id:P+"scr",t:sh("Suma de cuadrados de los residuos SCR"),short:sh("SCR"),why:"Mide lo que el modelo no explica. Es el número que comparan todas las pruebas F y de Chow.",deps:[P+"b",...(opt.given?[]:[P+"yty"])],f:`SCR = y′y − b′X′y${opt.given?` con y′y = ${fm(+S.yty.toPrecision(8))}`:""}`,shape:"n",val:scr,dec:6,hint:()=>`b′X′y = ${b.map((v,i)=>fmt(v,4)+"·"+fmt(S.Xty[i],4)).join(" + ")} = ${fmt(btXy,4)}.`,done:()=>`Comprobación: es la suma de los residuos al cuadrado.`});
  return{steps,b,scr,S,I}};
RC.critStep=(id,deps,q,g,lab)=>({id,t:`Valor crítico F(${q}, ${g}) al 5 %${lab?" · "+lab:""}`,short:`F crítico${lab?" "+lab:""}`,why:"Es el umbral de la tabla F: si el estadístico lo supera, se rechaza H₀.",deps,f:`F<sub>0,05</sub>(${q}, ${g})`,shape:"n",val:CE.fcrit(q,g,0.05),dec:4,tool:"En Excel: =INV.F.CD(0,05;gl1;gl2). En R: qf(0.95, gl1, gl2).",hint:()=>`busca en la tabla F la columna ${q} (numerador) y la fila ${g} (denominador), al 5 %.`});
RC.decStep=(id,deps,F,cr,yes,no)=>({id,t:"Decisión",short:"Decisión",why:"Compara el estadístico con el valor crítico y traduce el resultado a la pregunta del ejercicio.",deps,f:`Si F &gt; F crítico se rechaza H₀`,shape:"c",choices:["Se rechaza H₀","No se rechaza H₀"],val:F>cr?"Se rechaza H₀":"No se rechaza H₀",hint:()=>`compara ${fmt(F,4)} con ${fmt(cr,4)}.`,done:()=>F>cr?yes:no});

// ---------- ruta de la prueba de Chow (y de pronósticos) a partir de los datos
RC.chow=function(el,X,y,n1,names){const n=y.length,k=X[0].length,n2=n-n1;
  if(n1<=k||n2<=k){el.innerHTML=err(`para la ruta completa cada periodo necesita más de ${k} observaciones (n₁ = ${n1}, n₂ = ${n2}).`);return}
  const T=RC.regSteps("t","toda la muestra",X,y,names,{deps:["cnt"]}),A=RC.regSteps("p1","periodo 1",X.slice(0,n1),y.slice(0,n1),names,{deps:["cnt"]}),Bq=RC.regSteps("p2","periodo 2",X.slice(n1),y.slice(n1),names,{deps:["cnt"]});
  if(!T||!A||!Bq){el.innerHTML=err("alguna matriz X′X no es invertible.");return}
  const nr=A.scr+Bq.scr,F=((T.scr-nr)/k)/(nr/(n-2*k)),cr=CE.fcrit(k,n-2*k,0.05),Fp=((T.scr-A.scr)/n2)/(A.scr/(n1-k)),crp=CE.fcrit(n2,n1-k,0.05);
  const steps=[{id:"cnt",t:"Tamaños: n, n₁, n₂ y k",short:"n, n₁, n₂, k",why:"Todo lo demás depende de cuántas observaciones hay en cada periodo y de cuántos parámetros tiene el modelo (k incluye el intercepto).",deps:[],f:"n = n₁ + n₂ · k = número de columnas de X",shape:"v",labels:["n","n₁","n₂","k"],val:[n,n1,n2,k],dec:0,hint:()=>`el periodo 1 va hasta la fila ${n1}.`},
    ...T.steps,...A.steps,...Bq.steps,
    {id:"nr",t:"SCR del modelo no restringido",short:"SCR_NR",why:"El modelo no restringido deja que los coeficientes cambien entre periodos; su SCR es la suma de las de cada periodo (ecuación 28).",deps:["p1-scr","p2-scr"],f:"SCR<sub>NR</sub> = SCR₁ + SCR₂",shape:"n",val:nr,dec:6,hint:()=>"suma las SCR de los periodos 1 y 2."},
    {id:"gl",t:"Grados de libertad de la F",short:"gl",why:"El numerador cuenta las restricciones (k igualdades) y el denominador los grados de libertad del no restringido.",deps:["cnt"],f:"gl₁ = k · gl₂ = n − 2k",shape:"v",labels:["gl₁","gl₂"],val:[k,n-2*k],dec:0,hint:()=>`n − 2k = ${n} − 2·${k}.`},
    {id:"F",t:"Estadístico F de Chow",short:"F de Chow",why:"Compara cuánto empeora el ajuste al obligar a que los coeficientes sean iguales en los dos periodos.",deps:["t-scr","nr","gl"],f:"F = [(SCR<sub>R</sub> − SCR<sub>NR</sub>)/k] / [SCR<sub>NR</sub>/(n − 2k)]",shape:"n",val:F,dec:4,hint:()=>`[(${fmt(T.scr,6)} − ${fmt(nr,6)})/${k}] / [${fmt(nr,6)}/${n-2*k}].`},
    RC.critStep("cr",["gl"],k,n-2*k,"Chow"),
    RC.decStep("dec",["F","cr"],F,cr,"Hay cambio estructural: la función no es la misma en los dos periodos.","No hay evidencia de cambio estructural."),
    {id:"Fp",t:"Estadístico de pronósticos de Chow (ecuación 8)",short:"F pronósticos",why:"Pregunta si el modelo estimado con el periodo 1 predice bien el periodo 2. Usa la SCR del restringido y la del periodo 1.",deps:["t-scr","p1-scr","cnt"],f:"F = [(SCR<sub>R</sub> − SCR₁)/n₂] / [SCR₁/(n₁ − k)]",shape:"n",val:Fp,dec:4,hint:()=>`[(${fmt(T.scr,6)} − ${fmt(A.scr,6)})/${n2}] / [${fmt(A.scr,6)}/${n1-k}].`},
    RC.critStep("crp",["cnt"],n2,n1-k,"pronósticos"),
    RC.decStep("decp",["Fp","crp"],Fp,crp,"El modelo del periodo 1 no pronostica bien el periodo 2: hay cambio.","Los pronósticos son compatibles con el modelo del periodo 1.")];
  RC.mount(el,"Ruta de la prueba de Chow","Tres regresiones (toda la muestra y cada periodo), sus SCR y después las F. Haz los cálculos en tu calculadora, Excel o R y escribe el resultado: el paso siguiente se abre cuando aciertas.",steps)};

// ---------- ruta desde matrices resumidas (Dinardo 4.1 y 4.9)
RC.chowMat=function(el,A1,B1,c1,n1,A2,B2,c2,n2,names){const k=A1.length,mk=(A,B,c,n)=>{const X=null;const I=CE.inv(A),b=CE.mv(I,B),scr=c-b.reduce((s,v,i)=>s+v*B[i],0);return{b,scr,S:{XtX:A,Xty:B,yty:c},I}};
  const reg=(pre,lab,A,B,c)=>{const R=mk(A,B,c);const sh=s=>`${s} (${lab})`;return{R,steps:[{id:pre+"-b",t:sh("Coeficientes b = (X′X)⁻¹X′y"),short:sh("b"),why:"Solución de las ecuaciones normales con las matrices que da el enunciado.",deps:[],f:`b = (X′X)⁻¹X′y, X′X = ${RC.mtx(A)}, X′y = [${B.map(fm).join("; ")}]`,shape:"v",labels:names,val:R.b,dec:4,hint:()=>`(X′X)⁻¹ = ${RC.mtx(R.I)}.`},
    {id:pre+"-scr",t:sh("SCR"),short:sh("SCR"),why:"Lo que el modelo no explica en esta muestra.",deps:[pre+"-b"],f:`SCR = y′y − b′X′y, y′y = ${fm(c)}`,shape:"n",val:R.scr,dec:6,hint:()=>`b′X′y = ${R.b.map((v,i)=>fmt(v,4)+"·"+fm(B[i])).join(" + ")}.`}]}};
  const r1=reg("m1","muestra 1",A1,B1,c1),r2=reg("m2","muestra 2",A2,B2,c2),A=A1.map((r,i)=>r.map((v,j)=>v+A2[i][j])),B=B1.map((v,i)=>v+B2[i]),rT=reg("mt","juntas",A,B,c1+c2);
  const n=n1+n2,nr=r1.R.scr+r2.R.scr,F=((rT.R.scr-nr)/k)/(nr/(n-2*k)),cr=CE.fcrit(k,n-2*k,0.05);
  rT.steps[0].why="Se suman las matrices de las dos muestras: (X′X) = X₁′X₁ + X₂′X₂, (X′y) = X₁′y₁ + X₂′y₂, y′y = y₁′y₁ + y₂′y₂. Es el modelo restringido.";
  RC.mount(el,"Ruta de la prueba de Chow con matrices resumidas","",[...r1.steps,...r2.steps,{id:"sum",t:"Matrices de la muestra completa",short:"Sumar matrices",why:"El modelo restringido usa todas las observaciones: basta sumar los resúmenes de las dos muestras.",deps:[],f:"X′X = X₁′X₁ + X₂′X₂",shape:"m",val:A,dec:4,hint:()=>"suma elemento a elemento las dos matrices X′X."},
    ...rT.steps.map(s=>({...s,deps:[...s.deps,"sum"]})),
    {id:"nr",t:"SCR no restringida",short:"SCR_NR",why:"Suma de las SCR de cada muestra.",deps:["m1-scr","m2-scr"],f:"SCR<sub>NR</sub> = SCR₁ + SCR₂",shape:"n",val:nr,dec:6},
    {id:"F",t:"Estadístico F de Chow",short:"F",why:"Compara el restringido con el no restringido.",deps:["mt-scr","nr"],f:`F = [(SCR<sub>R</sub> − SCR<sub>NR</sub>)/${k}] / [SCR<sub>NR</sub>/${n-2*k}]`,shape:"n",val:F,dec:4,hint:()=>`[(${fmt(rT.R.scr,6)} − ${fmt(nr,6)})/${k}] / [${fmt(nr,6)}/${n-2*k}].`},
    RC.critStep("cr",[],k,n-2*k,""),RC.decStep("dec",["F","cr"],F,cr,"La relación es distinta en las dos muestras.","La misma relación sirve para las dos muestras.")])};

// ---------- ruta de la estimación por MCO (laboratorio de datos)
RC.mco=function(el,M){const n=M.n,k=M.k,names=M.names,R=RC.regSteps("","",M.X,M.y,names);if(!R){el.innerHTML=err("X′X no es invertible.");return}
  const s2=R.scr/(n-k),se=R.I.map((r,i)=>Math.sqrt(s2*r[i])),t=R.b.map((v,i)=>v/se[i]),ym=M.y.reduce((a,v)=>a+v,0)/n,stc=R.S.yty-n*ym*ym,r2=1-R.scr/stc,F=M.opt.cte&&k>1?(r2/(k-1))/((1-r2)/(n-k)):NaN;
  const steps=[{id:"cnt",t:"Tamaños: n y k",short:"n, k",why:"n es el número de observaciones usadas y k el de parámetros (con el intercepto).",deps:[],f:"k = columnas de X",shape:"v",labels:["n","k"],val:[n,k],dec:0},
    ...R.steps.map(s=>({...s,deps:s.deps.length?s.deps:["cnt"]})),
    {id:"inv",t:"Matriz (X′X)⁻¹",short:"(X′X)⁻¹",why:"Además de servir para b, su diagonal da las varianzas de los coeficientes.",deps:["xtx"],f:"(X′X)⁻¹",shape:"m",val:R.I,dec:6,tool:"En Excel: =MINVERSA(XtX). En R: solve(XtX)."},
    {id:"s2",t:"Varianza estimada del error s²",short:"s²",why:"Estima σ²; con ella se calculan los errores estándar.",deps:["scr","cnt"],f:"s² = SCR/(n − k)",shape:"n",val:s2,dec:6,hint:()=>`${fmt(R.scr,6)}/${n-k}.`},
    {id:"se",t:"Errores estándar de los coeficientes",short:"e.e.(b)",why:"Miden la precisión de cada coeficiente; son el denominador de las pruebas t.",deps:["s2","inv"],f:"e.e.(b<sub>j</sub>) = √(s²·[(X′X)⁻¹]<sub>jj</sub>)",shape:"v",labels:names,val:se,dec:4,hint:()=>`multiplica s² por cada elemento de la diagonal de (X′X)⁻¹ y saca raíz.`},
    {id:"t",t:"Estadísticos t",short:"t",why:"Prueban H₀: β<sub>j</sub> = 0 para cada variable.",deps:["b","se"],f:"t<sub>j</sub> = b<sub>j</sub>/e.e.(b<sub>j</sub>)",shape:"v",labels:names,val:t,dec:3,done:()=>`Con ${n-k} gl, |t| &gt; ${fmt(CE.tcrit(n-k,0.05),3)} es significativo al 5 %.`},
    {id:"stc",t:"Suma total de cuadrados STC",short:"STC",why:"La variación total de Y alrededor de su media; con la SCR da el R².",deps:["yty","cnt"],f:"STC = y′y − n·ȳ²",shape:"n",val:stc,dec:6,hint:()=>`ȳ = ${fmt(ym,6)}.`},
    {id:"r2",t:"Coeficiente de determinación R²",short:"R²",why:"Qué proporción de la variación de Y explica el modelo.",deps:["scr","stc"],f:"R² = 1 − SCR/STC",shape:"n",val:r2,dec:4}];
  if(isFinite(F))steps.push({id:"F",t:"F global",short:"F global",why:"Prueba que todas las pendientes son cero a la vez.",deps:["r2","cnt"],f:"F = [R²/(k − 1)] / [(1 − R²)/(n − k)]",shape:"n",val:F,dec:4},RC.critStep("cr",["cnt"],k-1,n-k,"global"),RC.decStep("dec",["F","cr"],F,CE.fcrit(k-1,n-k,0.05),"Las X, en conjunto, explican a Y.","No hay evidencia de que las X expliquen a Y."));
  RC.mount(el,`Ruta de la estimación por MCO de ${M.yName}`,"Del resumen de los datos a los coeficientes, sus errores estándar, las t y el R². Cada paso se abre cuando resuelves los que necesita.",steps)};
// ---------- botón «Modo práctica»: oculta la solución y muestra la ruta con pasos bloqueados
RC.wrap=function(out,html,label,mount){out.innerHTML=`<div class="rc-bar"><button type="button" class="btn solid" data-rc="on">✍ Modo práctica: ${label}</button><button type="button" class="btn" data-rc="off" hidden>Ver la solución completa</button><span class="hint">Oculta las respuestas y te pide cada cálculo en orden.</span></div><div class="rc-box" hidden></div><div class="rc-sol">${html}</div>`;
  const on=out.querySelector('[data-rc="on"]'),off=out.querySelector('[data-rc="off"]'),box=out.querySelector(".rc-box"),sol=out.querySelector(".rc-sol");
  on.onclick=()=>{box.hidden=false;sol.hidden=true;on.hidden=true;off.hidden=false;try{mount(box)}catch(e){box.innerHTML=err(e.message)}box.scrollIntoView({behavior:"smooth",block:"start"})};
  off.onclick=()=>{box.hidden=true;sol.hidden=false;on.hidden=false;off.hidden=true};return sol};
