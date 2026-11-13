
// ===================== LABORATORIOS DE MATEMÁTICAS PARA EL ANÁLISIS ECONÓMICO =====================
const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r])),T=ME.txt,f4=v=>fm(Math.abs(v)<1e-10?0:v).replace(/^-/,"−"),lin=(t,k)=>{let o="";t.forEach(([c,v])=>{if(Math.abs(c)<1e-12)return;const a=Math.abs(c),co=(a===1&&v?"":f4(a))+v;o+=o?(c<0?" − ":" + ")+co:(c<0?"−":"")+co});return(o||"0")+" = "+f4(k)},sg=v=>v>1e-10?"+":v<-1e-10?"−":"0";
const tin=(id,l,v)=>`<label for="${id}">${l}<input id="${id}" value="${v}" spellcheck="false" autocomplete="off" style="font-family:var(--f-mono)"></label>`;
const vals=(ids)=>ids.map(N);
const rng=(lo,hi,yv,pad=.1)=>{const a=Math.min(lo,...yv.filter(isFinite)),b=Math.max(hi,...yv.filter(isFinite));const d=(b-a)||1;return[a-d*pad,b+d*pad]};
const ex=(id,lista,run)=>`<div class="chips pre" id="${id}"><span class="lbl">Ejemplos</span>${lista.map((e,i)=>`<button type="button" data-i="${i}">${e[0]}</button>`).join("")}</div>`;
const bindEx=(id,lista,run)=>$(id).addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;Object.entries(lista[+b.dataset.i][1]).forEach(([k,v])=>$(k).value=v);run()});
const mtx=M=>`<span class="mx" style="grid-template-columns:repeat(${M[0].length},auto)">${M.flat().map(v=>`<span>${typeof v==="number"?f4(v):v}</span>`).join("")}</span>`;
const pathPlot=(ys,xl,yl,ref,label)=>{const yr=rng(ref??ys[0],ref??ys[0],ys);return plotXY({xr:[0,ys.length-1],yr,series:[{pts:ys.map((y,t)=>[t,y]),col:"--line",w:2}],points:ys.map((y,t)=>({x:t,y,col:"--line"})).filter((_,t)=>ys.length<=31||t%2===0),hlines:isFinite(ref)?[{y:ref,col:"--good"}]:[],xl,yl,label})};

// ---------- 1. Modelos de equilibrio
SIMS.ecm=function(){
  $("sim").innerHTML=tabsBox("em",[["merc","Mercado lineal"],["ing","Ingreso nacional"]]);const B=$("em-b");
  tabsRun("em",{
   merc(){B.innerHTML=`<p class="hint">Q<sub>d</sub> = a − bP · Q<sub>s</sub> = −c + dP</p><div class="calcf">${nin("mk-a","a",24)}${nin("mk-b","b",2,"0.1")}${nin("mk-c","c",6)}${nin("mk-d","d",3,"0.1")}${nin("mk-da","Cambio en a (Δa)",5)}</div><div class="res" id="mk-res"></div><div id="mk-g"></div><div id="mk-o"></div>`;
    const run=()=>{const[a,b,c,d,da]=vals(["mk-a","mk-b","mk-c","mk-d","mk-da"]);if(!okAll([a,b,c,d,da])||b+d<=0){$("mk-res").innerHTML=err("b + d debe ser positivo.");return}
      const P=(a+c)/(b+d),Q=(a*d-b*c)/(b+d),P2=(a+da+c)/(b+d),Q2=((a+da)*d-b*c)/(b+d),D=[["∂P*/∂a","1/(b + d)",1/(b+d)],["∂P*/∂b","−(a + c)/(b + d)²",-(a+c)/(b+d)**2],["∂P*/∂c","1/(b + d)",1/(b+d)],["∂P*/∂d","−(a + c)/(b + d)²",-(a+c)/(b+d)**2],["∂Q*/∂a","d/(b + d)",d/(b+d)],["∂Q*/∂b","−d(a + c)/(b + d)²",-d*(a+c)/(b+d)**2],["∂Q*/∂c","−b/(b + d)",-b/(b+d)],["∂Q*/∂d","b(a + c)/(b + d)²",b*(a+c)/(b+d)**2]];
      $("mk-res").innerHTML=tl([["P*",f4(P),"okt"],["Q*",f4(Q),"okt"],["Elasticidad de Q* respecto a a",f4(d/(b+d)*a/Q)],[`Nuevo equilibrio (a + ${fm(da)})`,`P = ${f4(P2)} · Q = ${f4(Q2)}`]]);
      const qm=Math.max(a,Q2,Q)*1.15,pm=Math.max(a/b,(a+da)/b,P2)*1.1;
      $("mk-g").innerHTML=plotXY({xr:[0,qm],yr:[0,pm],series:[{f:q=>(a-q)/b,col:"--line"},{f:q=>(a+da-q)/b,col:"--line",dash:"6 4",w:2},{f:q=>(q+c)/d,col:"--exam"}],points:[{x:Q,y:P,label:"E₀"},{x:Q2,y:P2,label:"E₁",col:"--good"}],xl:"Q",yl:"P",label:"Mercado"})+legend([["--line","Demanda"],["--line","Demanda con a + Δa",1],["--exam","Oferta"]]);
      $("mk-o").innerHTML=stp(1,"Forma reducida",`<div class="eq al">P* = (a + c)/(b + d) = (${fm(a)} + ${fm(c)})/(${fm(b)} + ${fm(d)}) = <b>${f4(P)}</b><br>Q* = (ad − bc)/(b + d) = (${fm(a)}·${fm(d)} − ${fm(b)}·${fm(c)})/${fm(b+d)} = <b>${f4(Q)}</b></div>`)
        +stp(2,"Estática comparativa",`<div class="tbl"><table><tr><th>Derivada</th><th>Fórmula</th><th>Valor</th><th>Signo</th></tr>${D.map(([n,fo,v])=>`<tr><td>${n}</td><td class="mono">${fo}</td><td>${f4(v)}</td><td>${sg(v)}</td></tr>`).join("")}</table></div><p class="hint">Como el modelo es lineal, la derivada predice exactamente el cambio: ΔP* = ${f4(1/(b+d))}·${fm(da)} = ${f4(da/(b+d))} = ${f4(P2)} − ${f4(P)}.</p>`)};
    onIn(["mk-a","mk-b","mk-c","mk-d","mk-da"],run);run()},
   ing(){B.innerHTML=`<p class="hint">Y = C + I₀ + G₀ · C = α + β(Y − T) · T = γ + δY</p><div class="calcf">${nin("ni-a","α",100)}${nin("ni-b","β",0.8,"0.01")}${nin("ni-g","γ",50)}${nin("ni-d","δ",0.25,"0.01")}${nin("ni-i","I₀",200)}${nin("ni-G","G₀",300)}</div><div class="res" id="ni-res"></div><div id="ni-o"></div>`;
    const run=()=>{const[al,be,ga,de,I,G]=vals(["ni-a","ni-b","ni-g","ni-d","ni-i","ni-G"]);const den=1-be+be*de;if(!okAll([al,be,ga,de,I,G])||Math.abs(den)<1e-12){$("ni-res").innerHTML=err("revisa β y δ.");return}
      const Y=(al-be*ga+I+G)/den,Tt=ga+de*Y,C=al+be*(Y-Tt);
      $("ni-res").innerHTML=tl([["Y*",f4(Y),"okt"],["C*",f4(C)],["T*",f4(Tt)],["Multiplicador ∂Y*/∂G₀",f4(1/den)]]);
      $("ni-o").innerHTML=stp(1,"Forma reducida",`<div class="eq al">Y* = (α − βγ + I₀ + G₀)/(1 − β + βδ) = (${fm(al)} − ${fm(be)}·${fm(ga)} + ${fm(I)} + ${fm(G)})/${f4(den)} = <b>${f4(Y)}</b></div>`)
        +stp(2,"Estática comparativa",`<div class="tbl"><table><tr><th>Derivada</th><th>Fórmula</th><th>Valor</th></tr><tr><td>∂Y*/∂G₀ = ∂Y*/∂I₀</td><td class="mono">1/(1 − β + βδ)</td><td>${f4(1/den)}</td></tr><tr><td>∂Y*/∂γ</td><td class="mono">−β/(1 − β + βδ)</td><td>${f4(-be/den)}</td></tr><tr><td>∂Y*/∂δ</td><td class="mono">−βY*/(1 − β + βδ)</td><td>${f4(-be*Y/den)}</td></tr><tr><td>∂Y*/∂β</td><td class="mono">(α − γ + (1 − δ)Y*)/(1 − β + βδ)</td><td>${f4((al-ga+(1-de)*Y)/den)}</td></tr></table></div><p class="hint">Un peso más de gasto sube el ingreso en ${f4(1/den)}; un peso más de impuesto autónomo lo baja en ${f4(be/den)}. Si ambos suben a la vez (presupuesto equilibrado con δ = 0) el efecto neto es 1.</p>`)};
    onIn(["ni-a","ni-b","ni-g","ni-d","ni-i","ni-G"],run);run()}})};

// ---------- 2. Implícitas y jacobiano
SIMS.jac=function(){
  $("sim").innerHTML=tabsBox("jc",[["imp","Función implícita"],["jac","Jacobiano"]]);const B=$("jc-b");
  tabsRun("jc",{
   imp(){const EJ=[["Círculo",{"im-f":"x^2 + y^2 - 25","im-x":"3","im-y":"4"}],["Curva de indiferencia",{"im-f":"x^0.5*y^0.5 - 10","im-x":"4","im-y":"25"}],["Chiang 8.5",{"im-f":"x^2 + x*y + y^2 - 7","im-x":"1","im-y":"2"}]];
    B.innerHTML=`${ex("im-ej",EJ)}<div class="calcf">${tin("im-f","F(x, y) = 0","x^2 + x*y + y^2 - 7")}${tin("im-x","x₀","1")}${tin("im-y","y₀","2")}</div><div class="res" id="im-res"></div><div id="im-o"></div>`;
    const run=()=>{const F=ME.fun($("im-f").value,["x","y"]),x=N("im-x"),y=N("im-y");if(F.err||!okAll([x,y])){$("im-res").innerHTML=err(F.err||"el punto no es numérico.");$("im-o").innerHTML="";return}
      const Fx=ME.d(F.node,"x"),Fy=ME.d(F.node,"y"),vx=ME.comp(Fx,["x","y"])(x,y),vy=ME.comp(Fy,["x","y"])(x,y),v=F.f(x,y),dy=-vx/vy;
      $("im-res").innerHTML=tl([["F(x₀, y₀)",f4(v),Math.abs(v)<1e-6?"okt":"badt"],["F_x",f4(vx)],["F_y",f4(vy)],["dy/dx",Math.abs(vy)<1e-12?"no existe (F_y = 0)":f4(dy),"okt"]]);
      $("im-o").innerHTML=(Math.abs(v)>1e-6?`<p class="err">El punto no está sobre la curva F = 0 (F vale ${f4(v)}); la derivada se calcula igual, pero corresponde a la curva de nivel F = ${f4(v)}.</p>`:"")
        +stp(1,"Derivadas parciales",`<div class="eq al">F_x = ${T(Fx)} = ${f4(vx)}<br>F_y = ${T(Fy)} = ${f4(vy)}</div>`)
        +stp(2,"Teorema de la función implícita",Math.abs(vy)<1e-12?`<p>F_y = 0: el teorema no garantiza que la ecuación defina y como función de x en este punto.</p>`:`<div class="eq al">dy/dx = −F_x/F_y = −(${f4(vx)})/(${f4(vy)}) = <b>${f4(dy)}</b></div><p class="hint">Recta tangente: y = ${f4(y)} ${dy<0?"−":"+"} ${f4(Math.abs(dy))}(x − ${f4(x)}).</p>`)};
    onIn(["im-f","im-x","im-y"],run);bindEx("im-ej",EJ,run);run()},
   jac(){const EJ=[["Dependientes (Chiang)",{"jb-1":"2*x1 + 3*x2","jb-2":"4*x1^2 + 12*x1*x2 + 9*x2^2","jb-x":"1","jb-y":"1"}],["Independientes",{"jb-1":"x1^2 + x2","jb-2":"x1*x2","jb-x":"1","jb-y":"2"}]];
    B.innerHTML=`${ex("jb-ej",EJ)}<div class="calcf">${tin("jb-1","y₁(x1, x2)","2*x1 + 3*x2")}${tin("jb-2","y₂(x1, x2)","4*x1^2 + 12*x1*x2 + 9*x2^2")}${tin("jb-x","x1 en el punto","1")}${tin("jb-y","x2 en el punto","1")}</div><div class="res" id="jb-res"></div><div id="jb-o"></div>`;
    const run=()=>{const v=["x1","x2"],A=ME.fun($("jb-1").value,v),Bf=ME.fun($("jb-2").value,v),p=[N("jb-x"),N("jb-y")];if(A.err||Bf.err||!okAll(p)){$("jb-res").innerHTML=err(A.err||Bf.err||"el punto no es numérico.");return}
      const J=[A,Bf].map(F=>v.map(x=>ME.d(F.node,x))),Jf=J.map(r=>r.map(n=>ME.comp(n,v))),Jp=Jf.map(r=>r.map(f=>f(...p))),d=ME.det(Jp);
      const pr=[[0.3,1.7],[2.1,-0.4],[-1.3,0.9],[1.1,2.6],[-0.7,-1.9]],cero=pr.every(q=>Math.abs(ME.det(Jf.map(r=>r.map(f=>f(...q)))))<1e-8);
      $("jb-res").innerHTML=tl([["|J| en el punto",f4(d)],["¿|J| ≡ 0?",cero?"sí: funciones dependientes":"no: independientes",cero?"badt":"okt"]]);
      $("jb-o").innerHTML=stp(1,"Matriz jacobiana",`<p>J = ${mtx(J.map(r=>r.map(n=>T(n))))} ⟹ en (${fm(p[0])}, ${fm(p[1])}): ${mtx(Jp)}</p>`)+stp(2,"Determinante",`<div class="eq al">|J| = (${f4(Jp[0][0])})(${f4(Jp[1][1])}) − (${f4(Jp[0][1])})(${f4(Jp[1][0])}) = <b>${f4(d)}</b></div><p>${cero?"El jacobiano vale cero en todos los puntos probados: hay una relación funcional entre y₁ y y₂.":"El jacobiano no es idénticamente cero: las funciones son funcionalmente independientes y, donde |J| ≠ 0, el sistema se puede invertir localmente."}</p>`)};
    onIn(["jb-1","jb-2","jb-x","jb-y"],run);bindEx("jb-ej",EJ,run);run()}})};

// ---------- 3. IS-LM
SIMS.islm=function(){
  $("sim").innerHTML=`<div style="margin-bottom:10px">${seg("il-t","Economía",[["c","Cerrada"],["a","Abierta"]],"c")}</div><div class="calcf">${nin("il-c0","c₀",100)}${nin("il-c1","c₁ (PMgC)",0.75,"0.01")}${nin("il-T","T",100)}${nin("il-i0","i₀",300)}${nin("il-i1","i₁ (sensibilidad de I a r)",25)}${nin("il-G","G",250)}${nin("il-k","k",0.5,"0.01")}${nin("il-h","h",50)}${nin("il-M","Mˢ",500)}${nin("il-P","P",1,"0.1")}${nin("il-X","X (exportaciones)",100)}${nin("il-m","m (PMg a importar)",0.1,"0.01")}${nin("il-dG","ΔG para la gráfica",50)}</div><div class="res" id="il-res"></div><div id="il-g"></div><div id="il-o"></div>`;
  let ab=false;
  const run=()=>{const[c0,c1,Tx,i0,i1,G,k,h,M,P,X0,m0,dG]=vals(["il-c0","il-c1","il-T","il-i0","il-i1","il-G","il-k","il-h","il-M","il-P","il-X","il-m","il-dG"]);const X=ab?X0:0,m=ab?m0:0;
    if(!okAll([c0,c1,Tx,i0,i1,G,k,h,M,P,X,m,dG])||P<=0){$("il-res").innerHTML=err("faltan datos.");return}
    const s=1-c1+m,A=c0-c1*Tx+i0+G+X,J=[[s,i1],[k,-h]],dJ=-s*h-i1*k,Y=(A*(-h)-i1*M/P)/dJ,r=(s*M/P-k*A)/dJ;
    const mG=-h/dJ,rG=-k/dJ,mM=-i1/(P*dJ),rM=s/(P*dJ);
    $("il-res").innerHTML=tl([["Y*",f4(Y),"okt"],["r*",f4(r),"okt"],["|J|",f4(dJ)],["∂Y*/∂G",f4(mG)],["∂r*/∂G",f4(rG)],["∂Y*/∂Mˢ",f4(mM)],["∂r*/∂Mˢ",f4(rM)]]);
    const IS=(y,g)=>(A+g-s*y)/i1,LM=y=>(k*y-M/P)/h,Y2=Y+mG*dG,r2=r+rG*dG,xr=[Math.max(0,Math.min(Y,Y2)*0.6),Math.max(Y,Y2)*1.3],ys=[IS(xr[0],0),IS(xr[1],dG),LM(xr[0]),LM(xr[1])];
    $("il-g").innerHTML=plotXY({xr,yr:rng(Math.min(r,r2),Math.max(r,r2),ys,.05),series:[{f:y=>IS(y,0),col:"--line"},{f:y=>IS(y,dG),col:"--line",dash:"6 4",w:2},{f:LM,col:"--exam"}],points:[{x:Y,y:r,label:"E₀"},{x:Y2,y:r2,label:"E₁",col:"--good"}],xl:"Y",yl:"r",label:"IS-LM"})+legend([["--line","IS"],["--line",`IS con G + ${fm(dG)}`,1],["--exam","LM"]]);
    $("il-o").innerHTML=stp(1,"Sistema en forma matricial",`<p>${mtx(J)} ${mtx([["Y"],["r"]])} = ${mtx([[A],[M/P]])}</p><p class="hint">Fila 1 (IS): (1 − c₁${ab?" + m":""})Y + i₁r = c₀ − c₁T + i₀ + G${ab?" + X":""}. Fila 2 (LM): kY − hr = Mˢ/P.</p>`)
      +stp(2,"Jacobiano y Cramer",`<div class="eq al">|J| = −(1 − c₁${ab?" + m":""})h − i₁k = −(${f4(s)})(${fm(h)}) − (${fm(i1)})(${fm(k)}) = <b>${f4(dJ)}</b><br>Y* = ${fm(A)}·(−${fm(h)}) − ${fm(i1)}·${f4(M/P)} / ${f4(dJ)} = <b>${f4(Y)}</b> · r* = (${f4(s)}·${f4(M/P)} − ${fm(k)}·${fm(A)}) / ${f4(dJ)} = <b>${f4(r)}</b></div>`)
      +stp(3,"Multiplicadores",`<div class="eq al">∂Y*/∂G = −h/|J| = ${f4(mG)} · ∂r*/∂G = −k/|J| = ${f4(rG)}<br>∂Y*/∂Mˢ = −i₁/(P|J|) = ${f4(mM)} · ∂r*/∂Mˢ = (1 − c₁${ab?" + m":""})/(P|J|) = ${f4(rM)}</div><p class="hint">Con ΔG = ${fm(dG)}: ΔY* = ${f4(mG*dG)} y Δr* = ${f4(rG*dG)}. El multiplicador simple 1/(1 − c₁${ab?" + m":""}) = ${f4(1/s)} es mayor porque ignora el desplazamiento de la inversión por la subida de r (efecto expulsión).</p>`)};
  bindSeg("il-t",v=>{ab=v==="a";run()});onIn(["il-c0","il-c1","il-T","il-i0","il-i1","il-G","il-k","il-h","il-M","il-P","il-X","il-m","il-dG"],run);run()};

// ---------- 4. Optimización libre
SIMS.hes=function(){
  const EJ=[["Silla y mínimo",{"hs-f":"x^3 - 3*x + y^2 - 4*y"}],["Chiang 11.4",{"hs-f":"8*x^3 + 2*x*y - 3*x^2 + y^2 + 1"}],["Beneficio cóncavo",{"hs-f":"-x^2 + x*y - 2*y^2 + 3*x + 6*y"}],["Silla de montar",{"hs-f":"x^2 - y^2"}]];
  $("sim").innerHTML=`${ex("hs-ej",EJ)}<div class="calcf">${tin("hs-f","f(x, y)","x^3 - 3*x + y^2 - 4*y")}${nin("hs-r","Buscar puntos críticos en |x|, |y| ≤",10)}</div><div class="res" id="hs-res"></div><div id="hs-o"></div>`;
  const run=()=>{const R=N("hs-r")||10,C=ME.criticos($("hs-f").value,["x","y"],[-R,R]);if(C.err){$("hs-res").innerHTML=err(C.err);$("hs-o").innerHTML="";return}
    $("hs-res").innerHTML=tl([["Puntos críticos",String(C.pts.length)],...C.pts.slice(0,4).map(p=>[`(${f4(p.x[0])}, ${f4(p.x[1])})`,p.tipo,p.tipo.startsWith("m")?"okt":""])]);
    $("hs-o").innerHTML=stp(1,"Condiciones de primer orden",`<div class="eq al">f_x = ${T(C.g[0])} = 0<br>f_y = ${T(C.g[1])} = 0</div>`)
      +stp(2,"Hessiano",`<p>H = ${mtx(C.H.map(r=>r.map(T)))}</p>`)
      +stp(3,"Clasificación",C.pts.length?`<div class="tbl"><table><tr><th>Punto</th><th>f</th><th>H en el punto</th><th>|H₁|</th><th>|H₂|</th><th>Tipo</th></tr>${C.pts.map(p=>`<tr><td>(${f4(p.x[0])}, ${f4(p.x[1])})</td><td>${f4(p.f)}</td><td>${mtx(p.Hx)}</td><td>${f4(p.D[0])}</td><td>${f4(p.D[1])}</td><td><b>${p.tipo}</b></td></tr>`).join("")}</table></div>`:`<p>No se encontraron puntos críticos en la región buscada.</p>`)};
  onIn(["hs-f","hs-r"],run);bindEx("hs-ej",EJ,run);run()};

// ---------- 5. Aplicaciones
SIMS.apl=function(){
  $("sim").innerHTML=tabsBox("ap",[["mp","Multiproducto"],["dp","Discriminación"],["in","Insumos"]]);const B=$("ap-b");
  tabsRun("ap",{
   mp(){B.innerHTML=`<p class="hint">π = P₁Q₁ + P₂Q₂ − 2Q₁² − Q₁Q₂ − 2Q₂²</p><div class="calcf">${nin("mp-1","P₁",12)}${nin("mp-2","P₂",18)}</div><div class="res" id="mp-res"></div><div id="mp-o"></div>`;
    const run=()=>{const[P1,P2]=vals(["mp-1","mp-2"]);if(!okAll([P1,P2]))return;const Q1=(4*P1-P2)/15,Q2=(4*P2-P1)/15,pi=P1*Q1+P2*Q2-2*Q1*Q1-Q1*Q2-2*Q2*Q2;
      $("mp-res").innerHTML=tl([["Q₁*",f4(Q1),"okt"],["Q₂*",f4(Q2),"okt"],["π*",f4(pi)]]);
      $("mp-o").innerHTML=(Q1<0||Q2<0?`<p class="err">Una cantidad sale negativa: con estos precios la empresa no produciría ese bien (habría que imponer Q ≥ 0, como en Kuhn-Tucker).</p>`:"")
        +stp(1,"Primer orden",`<div class="eq al">π₁ = ${fm(P1)} − 4Q₁ − Q₂ = 0<br>π₂ = ${fm(P2)} − Q₁ − 4Q₂ = 0</div><p>Por Cramer: Q₁* = (4·${fm(P1)} − ${fm(P2)})/15 = <b>${f4(Q1)}</b>, Q₂* = (4·${fm(P2)} − ${fm(P1)})/15 = <b>${f4(Q2)}</b>.</p>`)
        +stp(2,"Segundo orden",`<p>H = ${mtx([[-4,-1],[-1,-4]])}: |H₁| = −4 < 0, |H₂| = 16 − 1 = 15 > 0 ⟹ definida negativa, máximo. π* = <b>${f4(pi)}</b>.</p>`)};
    onIn(["mp-1","mp-2"],run);run()},
   dp(){B.innerHTML=`<p class="hint">Q₁ = a₁ − b₁P₁ · Q₂ = a₂ − b₂P₂ · C = F + cQ, con Q = Q₁ + Q₂. Datos de Chiang: Q₁ = 21 − 0,1P₁, Q₂ = 50 − 0,4P₂, C = 2000 + 10Q.</p><div class="calcf">${nin("dp-a1","a₁",21)}${nin("dp-b1","b₁",0.1,"0.01")}${nin("dp-a2","a₂",50)}${nin("dp-b2","b₂",0.4,"0.01")}${nin("dp-F","F",2000)}${nin("dp-c","c (costo marginal)",10)}</div><div class="res" id="dp-res"></div><div id="dp-o"></div>`;
    const run=()=>{const[a1,b1,a2,b2,F,c]=vals(["dp-a1","dp-b1","dp-a2","dp-b2","dp-F","dp-c"]);if(!okAll([a1,b1,a2,b2,F,c])||b1<=0||b2<=0){$("dp-res").innerHTML=err("b₁ y b₂ deben ser positivos.");return}
      const Q1=(a1-b1*c)/2,Q2=(a2-b2*c)/2,P1=(a1-Q1)/b1,P2=(a2-Q2)/b2,e1=b1*P1/Q1,e2=b2*P2/Q2,pi=P1*Q1+P2*Q2-F-c*(Q1+Q2);
      const A=a1+a2,Bb=b1+b2,Qu=(A-Bb*c)/2,Pu=(A-Qu)/Bb,ok=a1-b1*Pu>=0&&a2-b2*Pu>=0,piu=Pu*Qu-F-c*Qu;
      if(Q1<=0||Q2<=0){$("dp-res").innerHTML=err("en uno de los mercados el costo marginal supera el precio máximo: no conviene vender allí.");$("dp-o").innerHTML="";return}
      $("dp-res").innerHTML=tl([["P₁*",f4(P1),"okt"],["P₂*",f4(P2),"okt"],["Q₁*",f4(Q1)],["Q₂*",f4(Q2)],["|ε₁|",f4(e1)],["|ε₂|",f4(e2)],["π* con discriminación",f4(pi)],["π con precio único",ok?f4(piu):"—"]]);
      $("dp-o").innerHTML=stp(1,"IMg₁ = IMg₂ = CMg",`<div class="eq al">P₁ = (a₁ − Q₁)/b₁ ⟹ IMg₁ = (a₁ − 2Q₁)/b₁ = ${fm(c)} ⟹ Q₁ = (${fm(a1)} − ${fm(b1)}·${fm(c)})/2 = <b>${f4(Q1)}</b>, P₁ = <b>${f4(P1)}</b><br>IMg₂ = (a₂ − 2Q₂)/b₂ = ${fm(c)} ⟹ Q₂ = (${fm(a2)} − ${fm(b2)}·${fm(c)})/2 = <b>${f4(Q2)}</b>, P₂ = <b>${f4(P2)}</b></div>`)
        +stp(2,"Elasticidades",`<div class="eq al">|ε₁| = b₁P₁/Q₁ = ${f4(e1)} · |ε₂| = b₂P₂/Q₂ = ${f4(e2)}<br>Comprobación: P₁(1 − 1/|ε₁|) = ${f4(P1*(1-1/e1))} = P₂(1 − 1/|ε₂|) = ${f4(P2*(1-1/e2))} = CMg</div><p>El precio más alto está en el mercado ${e1<e2?"1":"2"}, el de demanda menos elástica.</p>`)
        +stp(3,"Segundo orden y comparación",`<p>π₁₁ = −2/b₁ < 0, π₂₂ = −2/b₂ < 0, π₁₂ = 0 ⟹ |H₂| = 4/(b₁b₂) > 0: máximo.</p><p>${ok?`Con un precio único (demanda agregada Q = ${fm(A)} − ${fm(Bb)}P): P = ${f4(Pu)}, Q = ${f4(Qu)}, π = ${f4(piu)}. Discriminar aumenta el beneficio en ${f4(pi-piu)}.`:"Con un precio único uno de los mercados quedaría sin ventas; la comparación directa no aplica."}</p>`)};
    onIn(["dp-a1","dp-b1","dp-a2","dp-b2","dp-F","dp-c"],run);run()},
   in(){B.innerHTML=`<p class="hint">Q = A·L^α·K^β con α + β &lt; 1 · π = PQ − wL − rK</p><div class="calcf">${nin("in-P","P",10)}${nin("in-A","A",1)}${nin("in-a","α",0.4,"0.05")}${nin("in-b","β",0.4,"0.05")}${nin("in-w","w",2)}${nin("in-r","r",4)}</div><div class="res" id="in-res"></div><div id="in-o"></div>`;
    const run=()=>{const[P,A,a,b,w,r]=vals(["in-P","in-A","in-a","in-b","in-w","in-r"]);const s=1-a-b;if(!okAll([P,A,a,b,w,r])||s<=0||a<=0||b<=0||w<=0||r<=0){$("in-res").innerHTML=err("necesitas α, β > 0 con α + β < 1 y precios positivos.");$("in-o").innerHTML="";return}
      const L=Math.pow(P*A*Math.pow(a/w,1-b)*Math.pow(b/r,b),1/s),K=Math.pow(P*A*Math.pow(a/w,a)*Math.pow(b/r,1-a),1/s),Q=A*L**a*K**b,pi=P*Q-w*L-r*K;
      const H=[[P*a*(a-1)*Q/L**2,P*a*b*Q/(L*K)],[P*a*b*Q/(L*K),P*b*(b-1)*Q/K**2]];
      $("in-res").innerHTML=tl([["L*",f4(L),"okt"],["K*",f4(K),"okt"],["Q*",f4(Q)],["π*",f4(pi)]]);
      $("in-o").innerHTML=stp(1,"Primer orden",`<div class="eq al">P·PMg_L = PαQ/L = w · P·PMg_K = PβQ/K = r ⟹ K/L = (β/α)(w/r) = ${f4(b*w/(a*r))}</div><div class="eq al">L* = [PA(α/w)^(1−β)(β/r)^β]^(1/(1−α−β)) = <b>${f4(L)}</b><br>K* = [PA(α/w)^α(β/r)^(1−α)]^(1/(1−α−β)) = <b>${f4(K)}</b></div><p class="hint">Comprobación: P·PMg_L = ${f4(P*a*Q/L)} = w, P·PMg_K = ${f4(P*b*Q/K)} = r.</p>`)
        +stp(2,"Segundo orden",`<p>H = ${mtx(H)}: |H₁| = ${f4(H[0][0])} < 0, |H₂| = ${f4(ME.det(H))} > 0 ⟹ máximo (gracias a α + β = ${fm(a+b)} < 1).</p><p class="hint">Participaciones: wL*/PQ* = ${f4(w*L/(P*Q))} = α y rK*/PQ* = ${f4(r*K/(P*Q))} = β; el resto, ${f4(pi/(P*Q))} = 1 − α − β, es el beneficio.</p>`)};
    onIn(["in-P","in-A","in-a","in-b","in-w","in-r"],run);run()}})};

// ---------- 6. Lagrange
SIMS.lag=function(){
  const EJ=[["Chiang 12.2",{"lg-f":"x*y + 2*x","lg-g":"4*x + 2*y","lg-c":"60","lg-lo":"-20","lg-hi":"60"}],["Consumidor Cobb-Douglas",{"lg-f":"x^0.5*y^0.5","lg-g":"2*x + 3*y","lg-c":"120","lg-lo":"0.5","lg-hi":"80"}],["Minimizar costo",{"lg-f":"4*L + 8*K","lg-g":"L^0.5*K^0.5","lg-c":"20","lg-lo":"0.5","lg-hi":"80"}],["Mínimo",{"lg-f":"x^2 + y^2","lg-g":"x + y","lg-c":"10","lg-lo":"-20","lg-hi":"40"}]];
  $("sim").innerHTML=`${ex("lg-ej",EJ)}<div class="calcf">${tin("lg-f","Función objetivo f","x*y + 2*x")}${tin("lg-g","Restricción g","4*x + 2*y")}${tin("lg-c","= c","60")}${tin("lg-lo","Buscar desde","-20")}${tin("lg-hi","hasta","60")}</div><div class="res" id="lg-res"></div><div id="lg-o"></div>`;
  const run=()=>{const fe=$("lg-f").value,ge=$("lg-g").value,c=N("lg-c"),lo=N("lg-lo"),hi=N("lg-hi");const vs=/\b[LK]\b/.test(fe+ge)?["L","K"]:["x","y"];
    if(!okAll([c,lo,hi])){$("lg-res").innerHTML=err("c y el rango deben ser números.");return}const R=ME.lagrange(fe,ge,c,vs,[lo,hi]);if(R.err){$("lg-res").innerHTML=err(R.err);$("lg-o").innerHTML="";return}
    if(!R.pts.length){$("lg-res").innerHTML=err("no se encontró un punto que cumpla las condiciones de primer orden en ese rango.");$("lg-o").innerHTML="";return}
    const p=R.pts[0],h=1e-4,R2=ME.lagrange(fe,ge,c+h,vs,[lo,hi]),q=R2.pts&&R2.pts.find(z=>z.x.every((v,i)=>Math.abs(v-p.x[i])<0.01*(1+Math.abs(v)))),dz=q?(q.f-p.f)/h:NaN;
    $("lg-res").innerHTML=tl([[vs[0]+"*",f4(p.x[0]),"okt"],[vs[1]+"*",f4(p.x[1]),"okt"],["λ*",f4(p.lam)],["f*",f4(p.f)],["|H̄|",f4(p.dB)],["Tipo",p.tipo,"okt"]]);
    $("lg-o").innerHTML=stp(1,"Lagrangiano",`<div class="eq al">ℒ = ${T(R.F.node)} + λ[${fm(c)} − (${T(R.G.node)})]</div>`)
      +stp(2,"Condiciones de primer orden",`<div class="eq al">ℒ_${vs[0]} = ${T(R.Lg[0])} = 0<br>ℒ_${vs[1]} = ${T(R.Lg[1])} = 0<br>ℒ_λ = ${T(R.Lg[2])} = 0</div><p>Solución${R.pts.length>1?"es":""}: ${R.pts.map(z=>`(${vs[0]}, ${vs[1]}, λ) = (${f4(z.x[0])}, ${f4(z.x[1])}, ${f4(z.lam)}) con f = ${f4(z.f)}`).join("; ")}.</p>`)
      +stp(3,"Hessiano orlado",R.pts.map(z=>`<p>En (${f4(z.x[0])}, ${f4(z.x[1])}): |H̄| = ${mtx(z.B)} = <b>${f4(z.dB)}</b> ⟹ <b>${z.tipo}</b>.</p>`).join(""))
      +stp(4,"Interpretación de λ",`<p>λ* = ${f4(p.lam)}: si c sube a ${fm(c)} + 0,0001, el valor óptimo cambia en ${isFinite(dz)?f4(dz):"—"} por unidad, que coincide con λ*. ${vs[0]==="L"?"En la minimización de costos, λ es el costo marginal de producir una unidad más.":"Si f es una utilidad y g el gasto, λ es la utilidad marginal del ingreso."}</p>`)};
  onIn(["lg-f","lg-g","lg-c","lg-lo","lg-hi"],run);bindEx("lg-ej",EJ,run);run()};

// ---------- 7. Homogeneidad y CES
SIMS.ces=function(){
  $("sim").innerHTML=`<p class="hint">Q = A[δK^(−ρ) + (1 − δ)L^(−ρ)]^(−r/ρ). Con ρ = 0 se usa la Cobb-Douglas límite Q = A·K^(rδ)·L^(r(1−δ)).</p>${ctl("ce-A","A",0.5,5,0.1,1)}${ctl("ce-d","δ",0.05,0.95,0.05,0.5)}${ctl("ce-p","ρ",-0.9,5,0.1,0.5)}${ctl("ce-r","r (grado de homogeneidad)",0.3,2,0.1,1)}${ctl("ce-K","K",1,20,1,8)}${ctl("ce-L","L",1,20,1,4)}<div class="res" id="ce-res"></div><div id="ce-g"></div><div id="ce-o"></div>`;
  const run=()=>{const A=V("ce-A"),d=V("ce-d"),p=V("ce-p"),r=V("ce-r"),K0=V("ce-K"),L0=V("ce-L");if(!okAll([A,d,p,r,K0,L0])||K0<=0||L0<=0)return;const cd=Math.abs(p)<1e-9;
    const Q=(K,L)=>cd?A*K**(r*d)*L**(r*(1-d)):A*Math.pow(d*K**-p+(1-d)*L**-p,-r/p),h=1e-5;
    const QK=(Q(K0*(1+h),L0)-Q(K0*(1-h),L0))/(2*K0*h),QL=(Q(K0,L0*(1+h))-Q(K0,L0*(1-h)))/(2*L0*h),q0=Q(K0,L0),eu=K0*QK+L0*QL;
    const e=1e-3,QKK=(Q(K0+e,L0)-2*q0+Q(K0-e,L0))/e**2,QLL=(Q(K0,L0+e)-2*q0+Q(K0,L0-e))/e**2,QKL=(Q(K0+e,L0+e)-Q(K0+e,L0-e)-Q(K0-e,L0+e)+Q(K0-e,L0-e))/(4*e*e),B2=ME.det([[0,QK,QL],[QK,QKK,QKL],[QL,QKL,QLL]]),sig=1/(1+p);
    const iso=lev=>L=>{if(cd)return Math.pow(lev/(A*L**(r*(1-d))),1/(r*d));const t=(Math.pow(lev/A,-p/r)-(1-d)*L**-p)/d;return t>0?Math.pow(t,-1/p):(p<0?NaN:NaN)};
    $("ce-res").innerHTML=tl([["Q",f4(q0),"okt"],["PMg_K",f4(QK)],["PMg_L",f4(QL)],["RMST = PMg_L/PMg_K",f4(QL/QK)],["σ = 1/(1 + ρ)",p>-1?f4(sig):"∞"],["Rendimientos",r>1.0001?"crecientes":r<0.9999?"decrecientes":"constantes"]]);
    const lv=[0.5,1,1.6].map(k=>k*q0),xm=Math.max(L0,K0)*2.5;
    $("ce-g").innerHTML=plotXY({xr:[0,xm],yr:[0,xm],series:lv.map((l,i)=>({f:iso(l),col:["--muted","--line","--exam"][i],w:i===1?2.8:2})),points:[{x:L0,y:K0,label:"(L, K)"}],xl:"L",yl:"K",label:"Isocuantas"})+legend([["--muted","Q × 0,5"],["--line","Q actual"],["--exam","Q × 1,6"]]);
    $("ce-o").innerHTML=stp(1,"Homogeneidad",`<div class="eq al">Q(2K, 2L) = ${f4(Q(2*K0,2*L0))} = 2^${fm(r)}·Q(K, L) = ${f4(2**r*q0)}</div>`)
      +stp(2,"Teorema de Euler",`<div class="eq al">K·Q_K + L·Q_L = ${fm(K0)}·${f4(QK)} + ${fm(L0)}·${f4(QL)} = ${f4(eu)} = r·Q = ${fm(r)}·${f4(q0)} = ${f4(r*q0)}</div><p class="hint">${Math.abs(r-1)<1e-9?"Con rendimientos constantes, pagar a cada factor su producto marginal agota exactamente el producto.":r>1?"Con rendimientos crecientes, pagar los productos marginales costaría más que el producto.":"Con rendimientos decrecientes, sobra un residuo después de pagar los productos marginales."}</p>`)
      +stp(3,"Cuasiconcavidad y sustitución",`<div class="eq al">|B₂| = ${mtx([[0,QK,QL],[QK,QKK,QKL],[QL,QKL,QLL]])} = ${f4(B2)}</div><p>${B2>0?"|B₂| > 0: la función es cuasicóncava en el punto (isocuantas convexas al origen).":"|B₂| ≤ 0: no se cumple la condición suficiente de cuasiconcavidad en el punto."} σ = ${p>-1?f4(sig):"∞"}: ${cd?"caso Cobb-Douglas":p<0?"más sustituibles que en la Cobb-Douglas (las isocuantas tocan los ejes)":p>2?"cerca de la Leontief (isocuantas casi en L)":"menos sustituibles que en la Cobb-Douglas"}.</p>`)};
  bindCtl(["ce-A","ce-d","ce-p","ce-r","ce-K","ce-L"],run);run()};

// ---------- 8. Kuhn-Tucker
SIMS.kt=function(){
  $("sim").innerHTML=`<p class="hint">Max U = xy sujeto a pₓx + p_y y ≤ B (presupuesto) y x ≤ X̄ (racionamiento), con x, y ≥ 0.</p><div class="calcf">${nin("kt-px","pₓ",1,"0.1")}${nin("kt-py","p_y",1,"0.1")}${nin("kt-B","B",100)}${nin("kt-X","X̄",40)}</div><div class="res" id="kt-res"></div><div id="kt-g"></div><div id="kt-o"></div>`;
  const run=()=>{const[px,py,B,X]=vals(["kt-px","kt-py","kt-B","kt-X"]);if(!okAll([px,py,B,X])||px<=0||py<=0||B<=0||X<0){$("kt-res").innerHTML=err("precios e ingreso positivos.");return}
    const x1=B/(2*px),y1=B/(2*py),l1=x1/py,c1ok=x1<=X+1e-12;const x2=X,y2=(B-px*X)/py,l1b=X/py,l2=y2-l1b*px,c2ok=y2>=0&&l2>=-1e-12;
    const cases=[["Ninguna activa (λ₁ = λ₂ = 0)","y = 0 y x = 0 por ℒ_x = y, ℒ_y = x","x = y = 0, U = 0","Cumple las condiciones, pero hay holgura en el presupuesto: no es un máximo (siempre conviene gastar más)",false],
      ["Solo presupuesto (λ₂ = 0)",`x = B/(2pₓ) = ${f4(x1)}, y = B/(2p_y) = ${f4(y1)}, λ₁ = x/p_y = ${f4(l1)}`,`U = ${f4(x1*y1)}`,c1ok?"Cumple x ≤ X̄: es la solución":`Viola x ≤ X̄ (${f4(x1)} > ${fm(X)}): se descarta`,c1ok],
      ["Solo racionamiento (λ₁ = 0)","ℒ_y = x − λ₁p_y = 0 ⟹ x = 0, contradice x = X̄","—",X>0?"Inconsistente: se descarta":"Solo posible con X̄ = 0",false],
      ["Ambas activas",`x = X̄ = ${fm(X)}, y = (B − pₓX̄)/p_y = ${f4(y2)}, λ₁ = X̄/p_y = ${f4(l1b)}, λ₂ = y − λ₁pₓ = ${f4(l2)}`,`U = ${f4(x2*y2)}`,!c1ok&&c2ok?"λ₂ ≥ 0 y y ≥ 0: es la solución":c2ok?"Cumple, pero coincide con el anterior solo si λ₂ = 0":`${y2<0?"y < 0":"λ₂ < 0"}: se descarta`,!c1ok&&c2ok]];
    const sol=c1ok?[x1,y1,l1,0]:c2ok?[x2,y2,l1b,l2]:null;
    $("kt-res").innerHTML=sol?tl([["x*",f4(sol[0]),"okt"],["y*",f4(sol[1]),"okt"],["λ₁*",f4(sol[2])],["λ₂*",f4(sol[3])],["U*",f4(sol[0]*sol[1])],["Racionamiento",c1ok?"no restringe":"activo"]]):err("no hay solución factible (pₓX̄ > B no es el problema: revisa los datos).");
    if(sol){const xm=Math.max(B/px,X)*1.15,ym=B/py*1.15,U=sol[0]*sol[1];const fe=[[0,0],[Math.min(X,B/px),0],[Math.min(X,B/px),(B-px*Math.min(X,B/px))/py],[0,B/py]];
      $("kt-g").innerHTML=plotXY({xr:[0,xm],yr:[0,ym],areas:[{pts:fe,col:"--good",op:.15}],series:[{f:x=>(B-px*x)/py,col:"--ink"},{f:x=>x>0?U/x:NaN,col:"--line"}],vlines:[{x:X,col:"--bad"}],points:[{x:sol[0],y:sol[1],label:"óptimo"},...(!c1ok?[{x:x1,y:y1,label:"sin racionamiento",col:"--muted"}]:[])],xl:"x",yl:"y",label:"Kuhn-Tucker"})+legend([["--ink","Presupuesto"],["--bad","x = X̄"],["--line","Curva de indiferencia"],["--good","Región factible"]])}
    $("kt-o").innerHTML=stp(1,"Lagrangiano y condiciones",`<div class="eq al">ℒ = xy + λ₁(${fm(B)} − ${px===1?"":fm(px)}x − ${py===1?"":fm(py)}y) + λ₂(${fm(X)} − x)<br>ℒ_x = y − ${px===1?"":fm(px)}λ₁ − λ₂ ≤ 0, x·ℒ_x = 0 · ℒ_y = x − ${py===1?"":fm(py)}λ₁ ≤ 0, y·ℒ_y = 0<br>λ₁ ≥ 0, λ₁(B − pₓx − p_y y) = 0 · λ₂ ≥ 0, λ₂(X̄ − x) = 0</div>`)
      +stp(2,"Prueba de casos",`<div class="tbl"><table><tr><th>Caso</th><th>Solución del sistema</th><th>Valor</th><th>Verificación</th></tr>${cases.map(c=>`<tr${c[4]?' class="hl"':""}><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td><td>${c[4]?"<b>"+c[3]+"</b>":c[3]}</td></tr>`).join("")}</table></div>`)
      +(sol&&!c1ok?stp(3,"Interpretación",`<p>λ₂* = ${f4(sol[3])}: si se permitiera una unidad más de x, la utilidad subiría unas ${f4(sol[3])} unidades. λ₁* = ${f4(sol[2])} es la utilidad marginal del ingreso.</p>`):"")};
  onIn(["kt-px","kt-py","kt-B","kt-X"],run);run()};

// ---------- 9. Envolvente
SIMS.env=function(){
  $("sim").innerHTML=`<p class="hint">Empresa competitiva con Q = A·L^a: π(L; w) = P·A·L^a − wL. La envolvente π*(w) se compara con las rectas π(L fijo; w).</p>${ctl("en-P","P",1,20,0.5,10)}${ctl("en-A","A",0.5,5,0.1,2)}${ctl("en-a","a",0.1,0.9,0.05,0.5)}${ctl("en-w","w",0.5,10,0.1,2)}<div class="res" id="en-res"></div><div id="en-g"></div><div id="en-o"></div>`;
  const run=()=>{const P=V("en-P"),A=V("en-A"),a=V("en-a"),w0=V("en-w");if(!okAll([P,A,a,w0]))return;const Ls=w=>Math.pow(a*A*P/w,1/(1-a)),pis=w=>P*A*Ls(w)**a-w*Ls(w),h=1e-5;
    const L0=Ls(w0),d=(pis(w0+h)-pis(w0-h))/(2*h),dP=(()=>{const f=p=>{const L=Math.pow(a*A*p/w0,1/(1-a));return p*A*L**a-w0*L};return(f(P+h)-f(P-h))/(2*h)})();
    $("en-res").innerHTML=tl([["L*(w)",f4(L0),"okt"],["π*(w)",f4(pis(w0))],["dπ*/dw (numérica)",f4(d)],["−L*",f4(-L0),"okt"],["dπ*/dP",f4(dP)],["Q* = A·L*^a",f4(A*L0**a)]]);
    const wr=[Math.max(0.2,w0*0.3),w0*2.2],ws=[0.5,0.75,1,1.4,2].map(k=>k*w0),ym=pis(wr[0])*1.05;
    $("en-g").innerHTML=plotXY({xr:wr,yr:[0,ym],series:[...ws.map(wk=>{const L=Ls(wk);return{f:w=>P*A*L**a-w*L,col:wk===w0?"--exam":"--muted",w:wk===w0?2.4:1.4,dash:wk===w0?"":"5 4"}}),{f:pis,col:"--line",w:3}],points:[{x:w0,y:pis(w0),label:"tangencia"}],xl:"w",yl:"π",label:"Envolvente"})+legend([["--line","π*(w): envolvente"],["--exam","π con L fijo en L*(w₀)"],["--muted","π con otros L fijos",1]]);
    $("en-o").innerHTML=stp(1,"Óptimo",`<div class="eq al">π_L = aPA·L^(a−1) − w = 0 ⟹ L*(w) = (aAP/w)^(1/(1−a)) = <b>${f4(L0)}</b><br>π*(w) = PA·L*^a − wL* = ${f4(pis(w0))}</div>`)
      +stp(2,"Teorema de la envolvente",`<div class="eq al">dπ*/dw = ∂π/∂w |_(L = L*) = −L* = <b>${f4(-L0)}</b> (derivada numérica de π*: ${f4(d)})<br>dπ*/dP = ∂π/∂P |_(L = L*) = A·L*^a = Q* = <b>${f4(A*L0**a)}</b> (numérica: ${f4(dP)})</div><p>Esto es el lema de Hotelling. En la gráfica, cada recta es el beneficio con L fijo; la curva π*(w) las envuelve por arriba y toca a cada una en el salario para el que ese L es óptimo. Por eso su pendiente en w₀ es la de la recta tangente: −L*(w₀).</p>`)};
  bindCtl(["en-P","en-A","en-a","en-w"],run);run()};

// ---------- 10. EDO de primer orden
SIMS.edo1=function(){
  $("sim").innerHTML=tabsBox("e1",[["gen","dy/dt + ay = b"],["mer","Ajuste del precio"]]);const B=$("e1-b");
  const draw=(R,y0,Tm,yl)=>plotXY({xr:[0,Tm],yr:rng(y0,isFinite(R.yp)?R.yp:y0,[...Array(41)].map((_,i)=>R.f(Tm*i/40)).map(v=>Math.max(-1e6,Math.min(1e6,v)))),series:[{f:R.f,col:"--line"}],hlines:isFinite(R.yp)?[{y:R.yp,col:"--good"}]:[],xl:"t",yl,label:"Trayectoria"});
  tabsRun("e1",{
   gen(){B.innerHTML=`${ctl("g1-a","a",-1,3,0.1,2)}${ctl("g1-b","b",-10,20,1,6)}${ctl("g1-y","y(0)",-10,20,1,10)}<div class="res" id="g1-res"></div><div id="g1-g"></div><div id="g1-o"></div>`;
    const run=()=>{const a=V("g1-a"),b=V("g1-b"),y0=V("g1-y");const R=ME.edo1(a,b,y0);
      $("g1-res").innerHTML=tl([["Equilibrio b/a",isFinite(R.yp)?f4(R.yp):"no existe (a = 0)"],["Trayectoria",R.tipo==="converge"?"converge":R.tipo==="diverge"?"diverge":"lineal",R.tipo==="converge"?"okt":"badt"]]);
      $("g1-g").innerHTML=draw(R,y0,a>0?Math.min(5/a,20):3,"y");
      $("g1-o").innerHTML=stp(1,"Solución",isFinite(R.yp)?`<div class="eq al">y_p = b/a = ${fm(b)}/${fm(a)} = ${f4(R.yp)}<br>y_c = A·e^(−${fm(a)}t), con A = y(0) − b/a = ${fm(y0)} − ${f4(R.yp)} = ${f4(R.A)}<br>y(t) = <b>${f4(R.A)}·e^(−${fm(a)}t) ${R.yp<0?"−":"+"} ${f4(Math.abs(R.yp))}</b></div><p>${a>0?"a > 0: la desviación se extingue y y(t) converge al equilibrio.":"a < 0: la desviación crece exponencialmente; el equilibrio es inestable."}</p>`:`<div class="eq al">a = 0 ⟹ dy/dt = b ⟹ y(t) = ${fm(y0)} + ${fm(b)}t</div>`)};
    bindCtl(["g1-a","g1-b","g1-y"],run);run()},
   mer(){B.innerHTML=`<p class="hint">Q<sub>d</sub> = α − βP · Q<sub>s</sub> = −γ + δP · dP/dt = j(Q<sub>d</sub> − Q<sub>s</sub>)</p><div class="calcf">${nin("g2-al","α",20)}${nin("g2-be","β",2,"0.1")}${nin("g2-ga","γ",4)}${nin("g2-de","δ",4,"0.1")}${nin("g2-j","j (velocidad de ajuste)",0.2,"0.05")}${nin("g2-p","P(0)",8)}</div><div class="res" id="g2-res"></div><div id="g2-g"></div><div id="g2-o"></div>`;
    const run=()=>{const[al,be,ga,de,j,P0]=vals(["g2-al","g2-be","g2-ga","g2-de","g2-j","g2-p"]);if(!okAll([al,be,ga,de,j,P0])||j<=0||be+de===0){$("g2-res").innerHTML=err("j > 0 y β + δ ≠ 0.");return}
      const a=j*(be+de),b=j*(al+ga),R=ME.edo1(a,b,P0);
      $("g2-res").innerHTML=tl([["P̄",f4(R.yp),"okt"],["Exponente j(β + δ)",f4(a)],["Vida media de la desviación",a>0?f4(Math.log(2)/a):"—"]]);
      $("g2-g").innerHTML=draw(R,P0,a>0?Math.min(5/a,40):5,"P");
      $("g2-o").innerHTML=stp(1,"Ecuación",`<div class="eq al">dP/dt = j[(α + γ) − (β + δ)P] ⟹ dP/dt + ${f4(a)}P = ${f4(b)}</div>`)+stp(2,"Solución",`<div class="eq al">P(t) = [P(0) − P̄]e^(−j(β + δ)t) + P̄ = (${fm(P0)} − ${f4(R.yp)})e^(−${f4(a)}t) + ${f4(R.yp)}</div><p>${a>0?"Con pendientes normales, el precio converge siempre a P̄; j solo cambia la rapidez.":"β + δ < 0: el precio se aleja del equilibrio."}</p>`)};
    onIn(["g2-al","g2-be","g2-ga","g2-de","g2-j","g2-p"],run);run()}})};

// ---------- 11. EDO de segundo orden
SIMS.edo2=function(){
  const EJ=[["Chiang: reales distintas",{"e2-a1":"1","e2-a2":"-2","e2-b":"-10","e2-y0":"12","e2-v0":"-2"}],["Repetida",{"e2-a1":"6","e2-a2":"9","e2-b":"27","e2-y0":"5","e2-v0":"0"}],["Complejas amortiguadas",{"e2-a1":"2","e2-a2":"17","e2-b":"34","e2-y0":"3","e2-v0":"11"}],["Complejas explosivas",{"e2-a1":"-0.4","e2-a2":"4","e2-b":"8","e2-y0":"3","e2-v0":"0"}]];
  $("sim").innerHTML=`${ex("e2-ej",EJ)}<p class="hint">y'' + a₁y' + a₂y = b</p><div class="calcf">${nin("e2-a1","a₁",1)}${nin("e2-a2","a₂",-2)}${nin("e2-b","b",-10)}${nin("e2-y0","y(0)",12)}${nin("e2-v0","y'(0)",-2)}</div><div class="res" id="e2-res"></div><div id="e2-g"></div><div id="e2-o"></div>`;
  const run=()=>{const[a1,a2,b,y0,v0]=vals(["e2-a1","e2-a2","e2-b","e2-y0","e2-v0"]);if(!okAll([a1,a2,b,y0,v0]))return;const R=ME.edo2(a1,a2,b,y0,v0);if(!R.f){$("e2-res").innerHTML=err("con a₂ = 0 la integral particular es de otra forma (y_p = bt/a₁); usa a₂ ≠ 0.");return}
    const Tm=R.caso.startsWith("raíces c")?Math.min(6*Math.PI/R.v,30):Math.min(8/Math.max(0.3,Math.abs(R.r1),Math.abs(R.r2)),12);
    $("e2-res").innerHTML=tl([["y_p = b/a₂",f4(R.yp)],["Discriminante a₁² − 4a₂",f4(R.D)],["Caso",R.caso],["Estabilidad",R.estable?"converge":"diverge",R.estable?"okt":"badt"]]);
    const ys=[...Array(61)].map((_,i)=>R.f(Tm*i/60));
    $("e2-g").innerHTML=plotXY({xr:[0,Tm],yr:rng(R.yp,R.yp,ys.map(v=>Math.max(-1e5,Math.min(1e5,v))),.08),series:[{f:R.f,col:"--line"}],hlines:[{y:R.yp,col:"--good"}],xl:"t",yl:"y",label:"Trayectoria"});
    let sol;if(R.caso==="raíces reales distintas")sol=`r₁ = ${f4(R.r1)}, r₂ = ${f4(R.r2)}<br>A₁ + A₂ = y(0) − y_p = ${f4(y0-R.yp)} · r₁A₁ + r₂A₂ = y'(0) = ${fm(v0)} ⟹ A₁ = ${f4(R.A1)}, A₂ = ${f4(R.A2)}<br>y(t) = <b>${f4(R.A1)}e^(${f4(R.r1)}t) ${R.A2<0?"−":"+"} ${f4(Math.abs(R.A2))}e^(${f4(R.r2)}t) ${R.yp<0?"−":"+"} ${f4(Math.abs(R.yp))}</b>`;
    else if(R.caso==="raíz real repetida")sol=`r = −a₁/2 = ${f4(R.r1)}<br>A₃ = y(0) − y_p = ${f4(R.A3)} · A₄ = y'(0) − rA₃ = ${f4(R.A4)}<br>y(t) = <b>(${f4(R.A3)} ${R.A4<0?"−":"+"} ${f4(Math.abs(R.A4))}t)e^(${f4(R.r1)}t) ${R.yp<0?"−":"+"} ${f4(Math.abs(R.yp))}</b>`;
    else sol=`r = h ± vi con h = −a₁/2 = ${f4(R.h)}, v = √(4a₂ − a₁²)/2 = ${f4(R.v)}<br>A₅ = y(0) − y_p = ${f4(R.A5)} · A₆ = (y'(0) − hA₅)/v = ${f4(R.A6)}<br>y(t) = <b>e^(${f4(R.h)}t)[${f4(R.A5)}cos(${f4(R.v)}t) ${R.A6<0?"−":"+"} ${f4(Math.abs(R.A6))}sen(${f4(R.v)}t)] ${R.yp<0?"−":"+"} ${f4(Math.abs(R.yp))}</b><br>Periodo de la oscilación: 2π/v = ${f4(2*Math.PI/R.v)}`;
    $("e2-o").innerHTML=stp(1,"Integral particular",`<div class="eq al">y_p = b/a₂ = ${fm(b)}/${fm(a2)} = ${f4(R.yp)}</div>`)+stp(2,"Ecuación característica",`<div class="eq al">r² ${a1<0?"−":"+"} ${fm(Math.abs(a1))}r ${a2<0?"−":"+"} ${fm(Math.abs(a2))} = 0 · a₁² − 4a₂ = ${f4(R.D)} ⟹ ${R.caso}</div>`)+stp(3,"Solución definida",`<div class="eq al">${sol}</div><p>${R.estable?"Todas las raíces tienen parte real negativa: la trayectoria converge a y_p.":"Hay una raíz con parte real no negativa: la trayectoria no converge."}</p>`)};
  onIn(["e2-a1","e2-a2","e2-b","e2-y0","e2-v0"],run);bindEx("e2-ej",EJ,run);run()};

// ---------- 12. Diagrama de fases
SIMS.fase=function(){
  const EJ=[["Nodo estable",{"fs-11":"-1","fs-12":"0.5","fs-21":"0.5","fs-22":"-1","fs-b1":"1","fs-b2":"1"}],["Punto de silla",{"fs-11":"1","fs-12":"2","fs-21":"2","fs-22":"1","fs-b1":"-3","fs-b2":"-3"}],["Foco estable",{"fs-11":"-0.5","fs-12":"-2","fs-21":"2","fs-22":"-0.5","fs-b1":"2.5","fs-b2":"-1.5"}],["Centro",{"fs-11":"0","fs-12":"1","fs-21":"-1","fs-22":"0","fs-b1":"-1","fs-b2":"1"}]];
  $("sim").innerHTML=`${ex("fs-ej",EJ)}<p class="hint">ẋ = a₁₁x + a₁₂y + b₁ · ẏ = a₂₁x + a₂₂y + b₂</p><div class="calcf">${nin("fs-11","a₁₁",-1)}${nin("fs-12","a₁₂",0.5)}${nin("fs-21","a₂₁",0.5)}${nin("fs-22","a₂₂",-1)}${nin("fs-b1","b₁",1)}${nin("fs-b2","b₂",1)}</div><div class="res" id="fs-res"></div><div id="fs-g"></div><div id="fs-o"></div>`;
  const run=()=>{const[a,b,c,d,b1,b2]=vals(["fs-11","fs-12","fs-21","fs-22","fs-b1","fs-b2"]);if(!okAll([a,b,c,d,b1,b2]))return;const R=ME.fase([[a,b],[c,d]],[b1,b2]);
    $("fs-res").innerHTML=tl([["Equilibrio",R.eq?`(${f4(R.eq[0])}, ${f4(R.eq[1])})`:"no único"],["tr A",f4(R.tr)],["|A|",f4(R.dt)],["tr² − 4|A|",f4(R.D)],["Tipo",R.tipo,"okt"],["Estabilidad",R.est,/^estable/.test(R.est)?"okt":"badt"]]);
    if(!R.eq){$("fs-g").innerHTML="";$("fs-o").innerHTML="";return}
    const[ex0,ey0]=R.eq,s=4,xr=[ex0-s,ex0+s],yr=[ey0-s,ey0+s],fx=(x,y)=>a*x+b*y+b1,fy=(x,y)=>c*x+d*y+b2,W=600,H=420,fr=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice(2*s/5)),ticks(yr[0],yr[1],nice(2*s/4)),"x","y"),id="fp"+(++CLIP);
    let g="";for(let i=0;i<=12;i++)for(let j=0;j<=10;j++){const x=xr[0]+2*s*i/12,y=yr[0]+2*s*j/10,u=fx(x,y),v=fy(x,y),m=Math.hypot(u,v);if(m<1e-9)continue;const L=2*s/30,dx=u/m*L,dy=v/m*L,X1=fr.sx(x),Y1=fr.sy(y),X2=fr.sx(x+dx),Y2=fr.sy(y+dy),ang=Math.atan2(Y2-Y1,X2-X1);
      g+=`<line x1="${X1}" y1="${Y1}" x2="${X2}" y2="${Y2}" stroke="var(--muted)" stroke-width="1"/><path d="M${X2},${Y2}l${(-5*Math.cos(ang-0.45)).toFixed(1)},${(-5*Math.sin(ang-0.45)).toFixed(1)}M${X2},${Y2}l${(-5*Math.cos(ang+0.45)).toFixed(1)},${(-5*Math.sin(ang+0.45)).toFixed(1)}" stroke="var(--muted)" stroke-width="1"/>`}
    const iso=(p,q,r,col)=>{const pts=Math.abs(q)>1e-9?[[xr[0],-(p*xr[0]+r)/q],[xr[1],-(p*xr[1]+r)/q]]:[[-r/p,yr[0]],[-r/p,yr[1]]];return`<line x1="${fr.sx(pts[0][0])}" y1="${fr.sy(pts[0][1])}" x2="${fr.sx(pts[1][0])}" y2="${fr.sy(pts[1][1])}" stroke="var(${col})" stroke-width="2.2"/>`};
    if(Math.abs(a)+Math.abs(b)>1e-9)g+=iso(a,b,b1,"--line");if(Math.abs(c)+Math.abs(d)>1e-9)g+=iso(c,d,b2,"--exam");
    const ini=[[-.9,-.9],[.9,.9],[-.9,.9],[.9,-.9],[0,.95],[.95,0],[0,-.95],[-.95,0]].map(([p,q])=>[ex0+p*s,ey0+q*s]),tm=Math.abs(R.tr)+Math.sqrt(Math.abs(R.dt))||1,hh=Math.min(0.02,0.05/tm);
    ini.forEach(([x,y])=>{const P=ME.rk4(fx,fy,x,y,hh,1500).filter(([u,v])=>u>xr[0]-s&&u<xr[1]+s&&v>yr[0]-s&&v<yr[1]+s);if(P.length<2)return;g+=`<path d="${P.map(([u,v],i)=>(i?"L":"M")+fr.sx(u).toFixed(1)+","+fr.sy(v).toFixed(1)).join("")}" fill="none" stroke="var(--ink)" stroke-width="1.5" opacity=".75"/><circle cx="${fr.sx(x)}" cy="${fr.sy(y)}" r="3" fill="var(--ink)"/>`});
    $("fs-g").innerHTML=`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagrama de fases"><defs><clipPath id="${id}"><rect x="${fr.L}" y="${fr.T}" width="${W-fr.L-fr.R}" height="${H-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#${id})">${g}</g><circle cx="${fr.sx(ex0)}" cy="${fr.sy(ey0)}" r="6" fill="var(--ink)" stroke="var(--card)" stroke-width="2"/></svg></div>`+legend([["--line","Isoclina ẋ = 0"],["--exam","Isoclina ẏ = 0"],["--ink","Trayectorias"],["--muted","Campo de direcciones"]]);
    $("fs-o").innerHTML=stp(1,"Equilibrio",`<div class="eq al">ẋ = 0: ${lin([[a,"x"],[b,"y"]],-b1)} · ẏ = 0: ${lin([[c,"x"],[d,"y"]],-b2)} ⟹ (x̄, ȳ) = (${f4(ex0)}, ${f4(ey0)})</div>`)
      +stp(2,"Raíces características",`<div class="eq al">r² − (tr A)r + |A| = 0 ⟹ r² ${R.tr>0?"−":"+"} ${f4(Math.abs(R.tr))}r ${R.dt<0?"−":"+"} ${f4(Math.abs(R.dt))} = 0<br>${typeof R.l[0]==="number"?`r₁ = ${f4(R.l[0])}, r₂ = ${f4(R.l[1])}`:`r = ${f4(R.l[0].re)} ± ${f4(R.l[0].im)}i`}</div><p>Equilibrio: <b>${R.tipo}</b>, ${R.est}.</p>`)};
  onIn(["fs-11","fs-12","fs-21","fs-22","fs-b1","fs-b2"],run);bindEx("fs-ej",EJ,run);run()};

// ---------- 13. Telaraña
SIMS.tela=function(){
  $("sim").innerHTML=tabsBox("tl",[["web","Telaraña"],["gen","y(t+1) + a·y(t) = c"]]);const B=$("tl-b");
  tabsRun("tl",{
   web(){B.innerHTML=`<p class="hint">Q<sub>dt</sub> = α − βP<sub>t</sub> · Q<sub>st</sub> = −γ + δP<sub>t−1</sub></p>${ctl("tw-al","α",5,40,1,18)}${ctl("tw-be","β",0.5,5,0.1,3)}${ctl("tw-ga","γ",0,10,1,3)}${ctl("tw-de","δ",0.5,5,0.1,2)}${ctl("tw-p","P₀",0,10,0.1,6)}<div class="res" id="tw-res"></div><div id="tw-g"></div><div id="tw-o"></div>`;
    const run=()=>{const al=V("tw-al"),be=V("tw-be"),ga=V("tw-ga"),de=V("tw-de"),P0=V("tw-p");const Pb=(al+ga)/(be+de),k=-de/be,Ps=[P0];for(let t=1;t<=20;t++)Ps.push(Pb+(P0-Pb)*k**t);const Qb=al-be*Pb;
      $("tw-res").innerHTML=tl([["P̄",f4(Pb),"okt"],["Q̄",f4(Qb)],["Base −δ/β",f4(k)],["Trayectoria",Math.abs(k)<1?"oscilación amortiguada":Math.abs(k)>1?"oscilación explosiva":"oscilación uniforme",Math.abs(k)<1?"okt":"badt"]]);
      const pm=Math.max(al/be,Pb*2,P0*1.2),qm=Math.max(al,Qb*2);let web=[];for(let t=1;t<=12;t++){const Pp=Ps[t-1],Q=-ga+de*Pp,P=Ps[t];if(!isFinite(P)||Math.abs(P)>pm*3)break;web.push([Q,Pp],[Q,P])}
      $("tw-g").innerHTML=`<div class="grid2">${plotXY({xr:[0,qm],yr:[0,pm],series:[{f:q=>(al-q)/be,col:"--line"},{f:q=>(q+ga)/de,col:"--exam"},{pts:web,col:"--good",w:1.6}],points:[{x:Qb,y:Pb,label:"E"}],xl:"Q",yl:"P",label:"Telaraña"})}${pathPlot(Ps.slice(0,16).map(v=>Math.max(-pm*3,Math.min(pm*3,v))),"t","P",Pb,"Trayectoria del precio")}</div>`+legend([["--line","Demanda"],["--exam","Oferta (con P del periodo anterior)"],["--good","Telaraña"]]);
      $("tw-o").innerHTML=stp(1,"Ecuación en diferencias",`<div class="eq al">α − βP_t = −γ + δP_(t−1) ⟹ P_t + (δ/β)P_(t−1) = (α + γ)/β ⟹ P_t + ${f4(-k)}P_(t−1) = ${f4((al+ga)/be)}</div>`)+stp(2,"Solución",`<div class="eq al">P_t = (P₀ − P̄)(−δ/β)^t + P̄ = (${fm(P0)} − ${f4(Pb)})(${f4(k)})^t + ${f4(Pb)}<br>P₁ = ${f4(Ps[1])} · P₂ = ${f4(Ps[2])} · P₃ = ${f4(Ps[3])} · P₄ = ${f4(Ps[4])}</div><p>${de<be?"δ < β: la oferta responde menos que la demanda y la telaraña se cierra hacia el equilibrio.":de>be?"δ > β: cada reacción de los productores es más fuerte que la anterior y la telaraña se abre.":"δ = β: el precio oscila sin acercarse ni alejarse."}</p>`)};
    bindCtl(["tw-al","tw-be","tw-ga","tw-de","tw-p"],run);run()},
   gen(){B.innerHTML=`${ctl("tg-a","a",-1.5,1.5,0.05,-0.5)}${ctl("tg-c","c",-10,10,0.5,5)}${ctl("tg-y","y₀",-10,20,0.5,2)}<div class="res" id="tg-res"></div><div id="tg-g"></div><div id="tg-o"></div>`;
    const run=()=>{const a=V("tg-a"),c=V("tg-c"),y0=V("tg-y"),R=ME.dif1(a,c,y0),ys=[...Array(21)].map((_,t)=>R.f(t)).map(v=>Math.max(-1e4,Math.min(1e4,v)));
      $("tg-res").innerHTML=tl([["Equilibrio c/(1 + a)",isFinite(R.yp)?f4(R.yp):"—"],["Base b = −a",f4(R.b)],["Trayectoria",R.tipo]]);
      $("tg-g").innerHTML=pathPlot(ys,"t","y",R.yp,"Trayectoria");
      $("tg-o").innerHTML=stp(1,"Solución",isFinite(R.yp)?`<div class="eq al">y_t = (y₀ − c/(1 + a))(−a)^t + c/(1 + a) = (${fm(y0)} − ${f4(R.yp)})(${f4(R.b)})^t + ${f4(R.yp)}</div><p>|b| ${Math.abs(R.b)<1?"<":">"} 1 ${R.b<0?"y b < 0: la trayectoria oscila alrededor del equilibrio":"y b > 0: la trayectoria es monótona"}.</p>`:`<div class="eq al">a = −1 ⟹ y_t = y₀ + ct</div>`)};
    bindCtl(["tg-a","tg-c","tg-y"],run);run()}})};

// ---------- 14. Samuelson
SIMS.sam=function(){
  $("sim").innerHTML=`<p class="hint">Y<sub>t</sub> = C<sub>t</sub> + I<sub>t</sub> + G₀ · C<sub>t</sub> = γY<sub>t−1</sub> · I<sub>t</sub> = α(C<sub>t</sub> − C<sub>t−1</sub>)</p>${ctl("sm-gm","γ (PMgC)",0.1,0.95,0.05,0.8)}${ctl("sm-a","α (acelerador)",0,5,0.1,1)}${ctl("sm-G","G₀",10,200,10,100)}${ctl("sm-y0","Y₀",0,1000,10,400)}${ctl("sm-y1","Y₁",0,1000,10,450)}<div class="res" id="sm-res"></div><div id="sm-g"></div><div id="sm-o"></div>`;
  const run=()=>{const g=V("sm-gm"),a=V("sm-a"),G=V("sm-G"),y0=V("sm-y0"),y1=V("sm-y1");const a1=-g*(1+a),a2=a*g,R=ME.dif2(a1,a2,G,y0,y1),Yb=G/(1-g),ciclo=g*(1+a)**2<4*a;
    $("sm-res").innerHTML=tl([["Ȳ = G₀/(1 − γ)",f4(Yb),"okt"],["Coeficientes",`a₁ = ${f4(a1)}, a₂ = ${f4(a2)}`],["Caso",R.caso],["Módulo de las raíces",f4(R.mod)],["Ciclos",ciclo?"sí":"no"],["Trayectoria",R.estable?(ciclo?"ciclos amortiguados":"converge sin ciclos"):(ciclo?(Math.abs(R.mod-1)<1e-9?"ciclos uniformes":"ciclos explosivos"):"diverge"),R.estable?"okt":"badt"]]);
    const ys=R.ys.slice(0,41).map(v=>Math.max(-Yb*20,Math.min(Yb*20,v)));
    $("sm-g").innerHTML=`<div class="grid2">${pathPlot(ys,"t","Y",Yb,"Trayectoria del ingreso")}${plotXY({xr:[0,5],yr:[0,1],series:[{f:x=>4*x/(1+x)**2,col:"--line"},{f:x=>x>0?1/x:NaN,col:"--exam"}],points:[{x:Math.min(a,5),y:g,label:"(α, γ)"}],xl:"α",yl:"γ",label:"Regiones de Samuelson"})}</div>`+legend([["--line","γ = 4α/(1 + α)²: frontera de los ciclos"],["--exam","αγ = 1: frontera de la estabilidad"]]);
    $("sm-o").innerHTML=stp(1,"Ecuación del ingreso",`<div class="eq al">Y_t − γ(1 + α)Y_(t−1) + αγY_(t−2) = G₀ ⟹ Y_(t+2) ${a1<0?"−":"+"} ${f4(Math.abs(a1))}Y_(t+1) + ${f4(a2)}Y_t = ${fm(G)}</div>`)
      +stp(2,"Raíces características",`<div class="eq al">b² ${a1<0?"−":"+"} ${f4(Math.abs(a1))}b + ${f4(a2)} = 0 · a₁² − 4a₂ = ${f4(R.D)}<br>${R.caso==="raíces complejas"?`b = ${f4(R.h)} ± ${f4(R.v)}i · R = √a₂ = √(αγ) = ${f4(R.R)} · θ = ${f4(R.th)} rad ⟹ periodo del ciclo 2π/θ = ${f4(2*Math.PI/R.th)} periodos`:`b₁ = ${f4(R.b1)}, b₂ = ${f4(R.b2)}`}</div>`)
      +stp(3,"Diagnóstico",`<p>γ(1 + α)² = ${f4(g*(1+a)**2)} ${ciclo?"<":"≥"} 4α = ${f4(4*a)} ⟹ ${ciclo?"raíces complejas: hay ciclos":"raíces reales: no hay ciclos"}. αγ = ${f4(a*g)} ${a*g<1?"< 1: la trayectoria converge a Ȳ":a*g>1?"> 1: la trayectoria se aleja de Ȳ":"= 1: el límite entre convergencia y divergencia"}.</p><p class="hint">Primeros valores: ${R.ys.slice(0,8).map((v,t)=>`Y${t} = ${fm(v)}`).join(" · ")}</p>`)};
  bindCtl(["sm-gm","sm-a","sm-G","sm-y0","sm-y1"],run);run()};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Estática comparativa","Mercado lineal","P* = (a + c)/(b + d); Q* = (ad − bc)/(b + d)"],["Estática comparativa","Ingreso nacional","Y* = (α − βγ + I₀ + G₀)/(1 − β + βδ)"],["Diferenciales","Diferencial total","dy = f₁dx₁ + … + fₙdxₙ"],["Implícitas","Función implícita","dy/dx = −F_x/F_y (si F_y ≠ 0)"],["Jacobiano","Dependencia","|J| ≡ 0 ⟺ funciones dependientes"],["IS-LM","Jacobiano","|J| = (1 − C′)L_r + I′L_Y < 0"],["IS-LM","Multiplicadores","∂Y*/∂G = L_r/|J|; ∂Y*/∂M = I′/(P|J|)"],
    ["Optimización libre","Primer orden","f_x = f_y = 0"],["Optimización libre","Segundo orden","Máx: |H₁| < 0, |H₂| > 0; Mín: |H₁| > 0, |H₂| > 0"],["Discriminación","Regla","IMg₁ = IMg₂ = CMg; Pᵢ(1 − 1/|εᵢ|) = CMg"],["Lagrange","Lagrangiano","ℒ = f + λ[c − g]"],["Lagrange","Multiplicador","λ* = dz*/dc"],["Lagrange","Hessiano orlado","|H̄| > 0 máximo; |H̄| < 0 mínimo"],
    ["Homogeneidad","Euler","K·f_K + L·f_L = r·f"],["CES","Sustitución","σ = 1/(1 + ρ)"],["Kuhn-Tucker","Holgura complementaria","λ ≥ 0, c − g ≥ 0, λ(c − g) = 0"],["Envolvente","Teorema","dV/dα = ∂f/∂α en x = x*"],["Envolvente","Hotelling","∂π*/∂w = −L*; ∂π*/∂P = Q*"],
    ["EDO 1.er orden","Solución","y = [y(0) − b/a]e^(−at) + b/a"],["EDO 2.º orden","Característica","r² + a₁r + a₂ = 0; y_p = b/a₂"],["EDO 2.º orden","Complejas","e^(ht)(A₅ cos vt + A₆ sen vt), h = −a₁/2"],["Sistemas","Estabilidad","Estable si tr A < 0 y |A| > 0; silla si |A| < 0"],
    ["Diferencias","1.er orden","y_t = (y₀ − c/(1 + a))(−a)^t + c/(1 + a)"],["Telaraña","Convergencia","Converge si δ < β"],["Diferencias","2.º orden complejas","R = √a₂; converge si R < 1"],["Samuelson","Ecuación","Y_t − γ(1 + α)Y_(t−1) + αγY_(t−2) = G₀"],["Samuelson","Ciclos y estabilidad","Ciclos si γ(1 + α)² < 4α; converge si αγ < 1"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Lagrange"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "ce-A":"<b>Parámetro de eficiencia</b>: escala la producción sin cambiar la forma de las isocuantas.","ce-d":"<b>Parámetro de distribución</b>: peso relativo del capital frente al trabajo.","ce-p":"<b>Parámetro de sustitución.</b> La elasticidad de sustitución es σ = 1/(1 + ρ): con ρ = 0 es Cobb-Douglas (σ = 1).","ce-r":"<b>Grado de homogeneidad</b>: r > 1 rendimientos crecientes, r < 1 decrecientes.","ce-K":"<b>Capital</b> en el punto evaluado.","ce-L":"<b>Trabajo</b> en el punto evaluado.",
 "en-P":"<b>Precio del producto.</b>","en-A":"<b>Productividad</b> en Q = A·L^a.","en-a":"<b>Elasticidad del producto respecto al trabajo</b> (a < 1: rendimientos decrecientes).","en-w":"<b>Salario.</b> Teorema de la envolvente: dπ*/dw = −L*, la pendiente de la envolvente es la demanda de trabajo con signo menos.",
 "g1-a":"<b>Coeficiente a</b> en la ecuación diferencial y′ + a·y = b. Si a > 0, la solución converge al equilibrio b/a.","g1-b":"<b>Término constante b.</b>","g1-y":"<b>Condición inicial</b> y(0).",
 "tw-al":"<b>Intercepto de la demanda</b> Qd = α − βP.","tw-be":"<b>Pendiente de la demanda.</b>","tw-ga":"<b>Intercepto de la oferta</b> (Qs = −γ + δP₍t−1₎).","tw-de":"<b>Pendiente de la oferta.</b> La telaraña converge si δ < β y oscila sin parar si δ = β.","tw-p":"<b>Precio inicial.</b>",
 "tg-a":"<b>Coeficiente a</b> en y₍t+1₎ + a·y_t = c. Si |a| < 1 converge; si a > 0 oscila.","tg-c":"<b>Término constante c.</b>","tg-y":"<b>Valor inicial</b> y₀.",
 "sm-gm":"<b>Propensión marginal a consumir</b> en el multiplicador-acelerador de Samuelson.","sm-a":"<b>Acelerador</b>: cuánto invierten las empresas por cada peso que crece el consumo. Según γ y α, el ingreso converge, oscila o explota.","sm-G":"<b>Gasto público</b> constante.","sm-y0":"<b>Ingreso del período 0.</b>","sm-y1":"<b>Ingreso del período 1.</b>"};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();
