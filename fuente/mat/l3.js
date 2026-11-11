
// ===================== LABORATORIOS DE MATEMÁTICAS III =====================
// ---------- L'Hôpital
SIMS.lhop=function(){
  const P=[["(eˣ − 1 − x)/x² en 0","(exp(x)-1-x)/x^2","0"],["sen x / x en 0","sin(x)/x","0"],["ln x / x en ∞","ln(x)/x","oo"],["x²/eˣ en ∞","x^2/exp(x)","oo"],["(1 − cos x)/x² en 0","(1-cos(x))/x^2","0"]];
  $("sim").innerHTML=`${casBox()}${presets("lh-pre",P)}<div class="calcf">${inp("lh-f","f(x)/g(x)","(exp(x)-1-x)/x^2",1)}${inp("lh-a","x tiende a","0",1)}</div><div id="lh-o" class="slv-out"></div>`;
  const run=()=>{const E=exact("lhopital",ival("lh-f"),ival("lh-a"));if(!E){$("lh-o").innerHTML=espera();return}if(!E.ok){$("lh-o").innerHTML=casErr(E);return}
    $("lh-o").innerHTML=stc(1,"Aplicaciones de la regla",`<ol class="steps">${E.pasos.map((p,i)=>`<li>${TX(`${i?"\\text{Derivando: }":""}\\lim_{x\\to ${E.t}}\\frac{${p.num}}{${p.den}}`)}<p>Numerador → ${tx(p.ln)}, denominador → ${tx(p.ld)}: ${p.forma?`forma ${p.forma}, se deriva arriba y abajo por separado.`:"ya no es indeterminado."}</p></li>`).join("")}</ol>`)+stc(2,"Resultado",TX(`\\lim_{x\\to ${E.t}}${E.f}=${E.L}`));typeset($("lh-o"))};
  const d=debounce(run,400);["lh-f","lh-a"].forEach(i=>$(i).addEventListener("input",d));bindPresets("lh-pre",P,p=>{$("lh-f").value=p[1];$("lh-a").value=p[2];run()});start(run)};

// ---------- Integrales impropias
SIMS.impr=function(){
  const P=[["1/x² en [1, ∞)","1/x^2","1","oo"],["1/x en [1, ∞) (diverge)","1/x","1","oo"],["Perpetuidad 100e^(−0,05t)","100 exp(-0.05x)","0","oo"],["1/√x en [0, 1]","1/sqrt(x)","0","1"],["Densidad exponencial 2e^(−2x)","2 exp(-2x)","0","oo"]];
  $("sim").innerHTML=`${casBox()}${presets("ip-pre",P)}<div class="calcf">${inp("ip-f","f(x)","1/x^2",1)}${inp("ip-a","a","1",1)}${inp("ip-b","b (oo = infinito)","oo",1)}</div><div id="ip-o" class="slv-out"></div>`;
  const run=()=>{const fs=ival("ip-f"),a=ival("ip-a"),b=ival("ip-b"),E=exact("integral",fs,a,b),f=pfa(fs);let h="";
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else{const conv=E.vn!=null;h=stc(1,"Planteamiento",`${TX(`\\int_{${E.a}}^{${E.b}}${E.f}\\,dx=${/oo|inf/.test(b)?`\\lim_{t\\to\\infty}\\int_{${E.a}}^{t}${E.f}\\,dx`:"\\lim_{\\varepsilon\\to0^+}\\int\\dots"}`)}${E.F?TX(`F(x)=${E.F}`):""}`)+stc(2,"Resultado",`${TX(`=${E.v}`)}${verdict(!conv,"La integral diverge: el límite es infinito o no existe.",`La integral converge${E.vn!=null?` a ${fx(E.vn)}`:""}.`)}`)}
    if(f){const A=Number(a)||0,Bv=/oo|inf/.test(b)?A+20:Number(b);h+=plotFns({fs:[f],xr:[Math.max(A-0.5,A===0?0.001:A-0.5),Bv],label:"Área bajo la curva",yr:null})}
    $("ip-o").innerHTML=h;typeset($("ip-o"))};
  const d=debounce(run,450);["ip-f","ip-a","ip-b"].forEach(i=>$(i).addEventListener("input",d));bindPresets("ip-pre",P,p=>{$("ip-f").value=p[1];$("ip-a").value=p[2];$("ip-b").value=p[3];run()});start(run)};

// ---------- Ecuaciones diferenciales: solución exacta, campo de direcciones y Euler
SIMS.edo=function(){
  const P=[["Logística y′ = 0,5y(1 − y/100)","0.5*y*(1-y/100)","0","10"],["Separable y′ = 2xy","2*x*y","0","1"],["Lineal y′ = x + y","x + y","0","1"],["Decaimiento y′ = −0,3y","-0.3*y","0","50"]];
  $("sim").innerHTML=`${casBox()}${presets("ed-pre",P)}<div class="calcf">${inp("ed-f","y′ = f(x, y)","0.5*y*(1-y/100)",1)}${inp("ed-x","x₀","0",1)}${inp("ed-y","y(x₀)","10",1)}${nin("ed-h","Paso de Euler h",1,"0.1")}${nin("ed-X","Hasta x =",15,"1")}</div><div id="ed-o" class="slv-out"></div>`;
  const run=()=>{const fs=ival("ed-f"),x0=Number(ival("ed-x")),y0=Number(ival("ed-y")),h=N("ed-h"),X=N("ed-X"),F=pf2(absify(fs)),E=exact("edo",fs,ival("ed-x"),ival("ed-y"));let o="";
    if(!F||!(h>0)||!(X>x0)){$("ed-o").innerHTML=err("revisa f, h > 0 y que el final sea mayor que x₀.");return}
    const eu=[[x0,y0]];let x=x0,y=y0;while(x<X-1e-12&&eu.length<2000){y=y+h*F(x,y);x=x+h;eu.push([x,y])}
    const ex=E&&E.ok&&E.ystr?pfa(E.ystr):null;
    if(!E)o+=espera();else if(!E.ok)o+=casErr(E);else o+=stc(1,"Solución exacta",`${TX(E.eq)}${TX(E.sol)}<p>Tipo: ${E.tipos.join(", ")||"general"}.</p>`);
    const ys=eu.map(p=>p[1]).filter(isFinite),lo=Math.min(...ys,ex?ex(x0):y0),hi=Math.max(...ys,ex?ex(X):y0),pad=(hi-lo||1)*.15,yr=[lo-pad,hi+pad];
    const field=fr=>{let s="";for(let i=0;i<=18;i++)for(let j=0;j<=12;j++){const xx=x0+(X-x0)*i/18,yy=yr[0]+(yr[1]-yr[0])*j/12,m=F(xx,yy);if(!isFinite(m))continue;const dx=(X-x0)/40,dy=m*dx,px=fr.sx(xx),py=fr.sy(yy),qx=fr.sx(xx+dx)-px,qy=fr.sy(yy+dy)-py,L=Math.hypot(qx,qy)||1,k=9/L;s+=`<line x1="${px-qx*k}" y1="${py-qy*k}" x2="${px+qx*k}" y2="${py+qy*k}" stroke="var(--muted)" stroke-width="1"/>`}
      s+=`<path d="${eu.map(([a,b],i)=>(i?"L":"M")+fr.sx(a).toFixed(1)+","+fr.sy(b).toFixed(1)).join("")}" fill="none" stroke="var(--exam)" stroke-width="2" stroke-dasharray="5 3"/>`;return s};
    o+=plotFns({fs:ex?[ex]:[],xr:[x0,X],yr,extra:[field],marks:eu.length<=40?eu.map(([a,b])=>({x:a,y:b,col:"--exam"})):[],label:"Campo de direcciones, Euler y solución"})+leg([["--line","Solución exacta"],["--exam","Euler"],["--muted","Campo de direcciones"]]);
    o+=stc(2,"Método de Euler",`<div class="tbl"><table><tr><th>n</th><th>xₙ</th><th>yₙ</th>${ex?"<th>Exacta</th><th>Error</th>":""}</tr>${eu.slice(0,12).map(([a,b],i)=>`<tr><td>${i}</td><td>${fx(a)}</td><td>${fx(b)}</td>${ex?`<td>${fx(ex(a))}</td><td>${fx(b-ex(a))}</td>`:""}</tr>`).join("")}${eu.length>12?`<tr><td colspan="5">… ${eu.length-12} pasos más</td></tr>`:""}</table></div><p class="hint">yₙ₊₁ = yₙ + h·f(xₙ, yₙ). Reduce h y el error baja aproximadamente en la misma proporción.</p>`);
    $("ed-o").innerHTML=o;typeset($("ed-o"))};
  const d=debounce(run,450);["ed-f","ed-x","ed-y","ed-h","ed-X"].forEach(i=>$(i).addEventListener("input",d));bindPresets("ed-pre",P,p=>{$("ed-f").value=p[1];$("ed-x").value=p[2];$("ed-y").value=p[3];run()});start(run)};

// ---------- Sucesiones
SIMS.suc=function(){
  const P=[["(1 + 1/n)ⁿ","(1+1/n)^n"],["n/(n + 1)","n/(n+1)"],["(−1)ⁿ","(-1)^n"],["ln(n)/n","ln(n)/n"],["n!/nⁿ (aprox.)","factorial(n)/n^n"]];
  $("sim").innerHTML=`${casBox()}${presets("sc-pre",P)}<div class="calcf">${inp("sc-f","aₙ (usa n)","(1+1/n)^n",1)}</div><div id="sc-o" class="slv-out"></div>`;
  const run=()=>{const s=ival("sc-f"),E=exact("sucesion",s);let h="";const f=pfa(s.replace(/\bn\b/g,"x")),T=f?[...Array(30)].map((_,i)=>f(i+1)):[];
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else h=stc(1,"Límite",`${TX(`\\lim_{n\\to\\infty}${E.a}=${E.L}`)}${verdict(!E.conv,"La sucesión diverge (u oscila).",`Converge a ${tx(E.L)}${E.Ln!=null&&!/^-?\d+$/.test(E.L)?` ≈ ${fx(E.Ln)}`:""}.`)}`);
    if(T.some(isFinite))h+=plotFns({fs:[],xr:[0,31],yr:(()=>{const v=T.filter(isFinite);const lo=Math.min(...v),hi=Math.max(...v),p=(hi-lo||1)*.15;return[lo-p,hi+p]})(),marks:T.map((v,i)=>({x:i+1,y:v,col:"--line"})),label:"Primeros 30 términos",xl:"n",yl:"aₙ"})+`<p class="hint">a₁ = ${fx(T[0])}, a₁₀ = ${fx(T[9])}, a₃₀ = ${fx(T[29])}.</p>`;
    $("sc-o").innerHTML=h;typeset($("sc-o"))};
  const d=debounce(run,450);$("sc-f").addEventListener("input",d);bindPresets("sc-pre",P,p=>{$("sc-f").value=p[1];run()});start(run)};

// ---------- Series
SIMS.serie=function(){
  const P=[["Σ 1/n²","1/n^2","1"],["Armónica Σ 1/n","1/n","1"],["Geométrica Σ (1/2)ⁿ","(1/2)^n","0"],["Alternada Σ (−1)ⁿ/n","(-1)^n/n","1"],["Σ n/2ⁿ","n/2^n","1"],["Telescópica Σ 1/(n(n+1))","1/(n*(n+1))","1"],["Σ n!/10ⁿ","factorial(n)/10^n","1"]];
  $("sim").innerHTML=`${casBox()}${presets("se-pre",P)}<div class="calcf">${inp("se-f","Término general aₙ (usa n)","1/n^2",1)}${inp("se-n","Desde n =","1",1)}</div><div id="se-o" class="slv-out"></div>`;
  const run=()=>{const E=exact("serie",ival("se-f"),ival("se-n"));if(!E){$("se-o").innerHTML=espera();return}if(!E.ok){$("se-o").innerHTML=casErr(E);return}
    const crit=[];if(E.term!=null)crit.push(["Término n-ésimo",`lím aₙ = ${tx(E.term)}`,E.termn!==0&&E.termn!=null?"diverge":"no decide (es necesario, no suficiente)"]);
    if(E.razon!=null)crit.push(["Cociente",`L = ${tx(E.razon)}`,E.razonn==null?"—":E.razonn<1?"converge absolutamente":E.razonn>1?"diverge":"no decide"]);
    if(E.raiz!=null)crit.push(["Raíz",`L = ${tx(E.raiz)}`,E.raizn==null?"—":E.raizn<1?"converge absolutamente":E.raizn>1?"diverge":"no decide"]);
    const S=E.parciales;
    $("se-o").innerHTML=stc(1,"Serie",`${TX(`\\sum_{n=${E.n0}}^{\\infty}${E.a}`)}${verdict(!E.conv,E.conv===null?"SymPy no pudo decidir la convergencia.":"La serie diverge.",`La serie converge${E.abs===false?" condicionalmente (no absolutamente)":E.abs?" absolutamente":""}${E.suma?` y su suma es ${tx(E.suma)}${E.suman!=null?` ≈ ${fx(E.suman)}`:""}`:""}.`)}`)
      +stc(2,"Criterios",`<div class="tbl"><table><tr><th>Criterio</th><th>Cálculo</th><th>Conclusión</th></tr>${crit.map(c=>`<tr><td>${c[0]}</td><td>${c[1]}</td><td>${c[2]}</td></tr>`).join("")}</table></div><p class="hint">Si el cociente y la raíz dan 1, se usan comparación, la integral (serie p) o Leibniz para alternadas.</p>`)
      +(S.length?plotFns({fs:[],xr:[0,S.length+1],yr:(()=>{const lo=Math.min(...S),hi=Math.max(...S),p=(hi-lo||1)*.15;return[lo-p,hi+p]})(),marks:S.map((v,i)=>({x:i+1,y:v,col:"--line"})),label:"Sumas parciales",xl:"número de términos",yl:"Sₙ"}):"");typeset($("se-o"))};
  const d=debounce(run,450);["se-f","se-n"].forEach(i=>$(i).addEventListener("input",d));bindPresets("se-pre",P,p=>{$("se-f").value=p[1];$("se-n").value=p[2];run()});start(run)};

// ---------- Series de potencias
SIMS.pot=function(){
  const P=[["Σ xⁿ/(n·2ⁿ)","1/(n*2^n)","0"],["Σ xⁿ/n!","1/factorial(n)","0"],["Σ n!xⁿ","factorial(n)","0"],["Σ (x − 3)ⁿ/n²","1/n^2","3"]];
  $("sim").innerHTML=`${casBox()}${presets("po-pre",P)}<div class="calcf">${inp("po-c","Coeficiente cₙ (usa n)","1/(n*2^n)",1)}${inp("po-a","Centro a","0",1)}</div><div id="po-o" class="slv-out"></div>`;
  const run=()=>{const E=exact("potencias",ival("po-c"),ival("po-a"));if(!E){$("po-o").innerHTML=espera();return}if(!E.ok){$("po-o").innerHTML=casErr(E);return}
    let h=stc(1,"Radio de convergencia",`${TX(`\\sum c_n(x-${E.centro})^n,\\quad c_n=${E.c}`)}${TX(`R=\\lim_{n\\to\\infty}\\left|\\frac{c_n}{c_{n+1}}\\right|=${E.R}`)}`);
    if(E.inf)h+=stc(2,"Intervalo",`<p>R = ∞: la serie converge para todo x real.</p>`);else if(E.Rn===0)h+=stc(2,"Intervalo",`<p>R = 0: solo converge en x = ${tx(E.centro)}.</p>`);
    else if(E.ext){const[l,r]=E.ext;h+=stc(2,"Extremos e intervalo",`<div class="tbl"><table><tr><th>Extremo</th><th>Serie que resulta</th><th>¿Converge?</th></tr>${E.ext.map(e=>`<tr><td>${tx("x="+e.x)}</td><td>${tx("\\sum "+e.serie)}</td><td>${e.conv===null?"no decidido":e.conv?"sí":"no"}</td></tr>`).join("")}</table></div><p>Intervalo de convergencia: ${tx(`${l.conv?"[":"("}${l.x},\\;${r.x}${r.conv?"]":")"}`)}.</p>`)}
    $("po-o").innerHTML=h;typeset($("po-o"))};
  const d=debounce(run,450);["po-c","po-a"].forEach(i=>$(i).addEventListener("input",d));bindPresets("po-pre",P,p=>{$("po-c").value=p[1];$("po-a").value=p[2];run()});start(run)};

// ---------- Taylor
SIMS.taylor=function(){
  const P=[["eˣ en 0","exp(x)","0"],["sen x en 0","sin(x)","0"],["ln(1 + x) en 0","ln(1+x)","0"],["√x en 4","sqrt(x)","4"],["1/(1 − x) en 0","1/(1-x)","0"]];
  $("sim").innerHTML=`${casBox()}${presets("ty-pre",P)}<div class="calcf">${inp("ty-f","f(x)","exp(x)",1)}${inp("ty-a","Centro a","0",1)}</div>${ctl("ty-n","Grado n",1,10,1,3)}<div id="ty-o" class="slv-out"></div>`;
  const run=()=>{const fs=ival("ty-f"),a=ival("ty-a"),n=V("ty-n"),E=exact("taylor",fs,a,String(n)),f=pfa(fs);let h="";
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else{const p=pfa(E.pstr),A=Number(a)||0;h=stc(1,"Polinomio de Taylor",`${TX(`P_{${n}}(x)=${E.p}`)}<div class="tbl"><table><tr><th>k</th>${E.coef.map((_,k)=>`<th>${k}</th>`).join("")}</tr><tr><td>f⁽ᵏ⁾(a)/k!</td>${E.coef.map(c=>`<td>${tx(c)}</td>`).join("")}</tr></table></div>`);
      if(f&&p){const x1=A+1;h+=plotFns({fs:[f,p],xr:[A-4,A+4],label:"f y su polinomio de Taylor"})+leg([["--line","f(x)"],["--exam",`P${n}(x)`]])+`<p class="hint">En x = ${fx(x1)}: f = ${fx(f(x1))}, P = ${fx(p(x1))}, error = ${fx(f(x1)-p(x1))}. Sube el grado y la aproximación mejora cerca de a.</p>`}}
    $("ty-o").innerHTML=h;typeset($("ty-o"))};
  const d=debounce(run,450);["ty-f","ty-a"].forEach(i=>$(i).addEventListener("input",d));bindCtl(["ty-n"],run);bindPresets("ty-pre",P,p=>{$("ty-f").value=p[1];$("ty-a").value=p[2];run()});start(run)};

// ---------- Integrales dobles
SIMS.doble=function(){
  const P=[["xy sobre 0 ≤ y ≤ x², 0 ≤ x ≤ 1","x*y","0","1","0","x^2","dydx"],["Rectángulo: x + y en [0,2]×[0,1]","x+y","0","2","0","1","dydx"],["Disco unitario (área) en polares","1","0","1","0","2*pi","polar"],["Densidad conjunta 6xy² en [0,1]²","6*x*y^2","0","1","0","1","dydx"]];
  $("sim").innerHTML=`${casBox()}${presets("db-pre",P)}<div style="margin:8px 0">${seg("db-o","Orden",[["dydx","dy dx (x exterior)"],["dxdy","dx dy (y exterior)"],["polar","Polares (r, θ)"]],"dydx")}</div><div class="calcf">${inp("db-f","f(x, y)","x*y",1)}<span id="db-l1">${inp("db-xa","x desde","0",1)}${inp("db-xb","x hasta","1",1)}${inp("db-ya","y desde","0",1)}${inp("db-yb","y hasta","x^2",1)}</span></div><p class="hint" id="db-h"></p><div id="db-oo" class="slv-out"></div>`;
  let ord="dydx";const run=()=>{const lab={dydx:["x desde (número)","x hasta (número)","y desde (puede depender de x)","y hasta"],dxdy:["x desde (puede depender de y)","x hasta","y desde (número)","y hasta (número)"],polar:["r desde","r hasta","θ desde","θ hasta"]}[ord];["db-xa","db-xb","db-ya","db-yb"].forEach((id,i)=>$(id).parentElement.firstChild.textContent=lab[i]);
    const E=exact("doble",ival("db-f"),ival("db-xa"),ival("db-xb"),ival("db-ya"),ival("db-yb"),ord);if(!E){$("db-oo").innerHTML=espera();return}if(!E.ok){$("db-oo").innerHTML=casErr(E);return}let h;
    if(ord==="polar")h=stc(1,"En polares",`${TX(`\\iint f\\,dA=\\int_{${ival("db-ya")}}^{${ival("db-yb")}}\\int_{${ival("db-xa")}}^{${ival("db-xb")}}${E.g}\\,dr\\,d\\theta`)}${TX(`\\text{Interior: }${E.inner}`)}${TX(`=${E.v}`)}`);
    else{const[vi,vo]=ord==="dydx"?["y","x"]:["x","y"],[ia,ib,oa,ob]=ord==="dydx"?[ival("db-ya"),ival("db-yb"),ival("db-xa"),ival("db-xb")]:[ival("db-xa"),ival("db-xb"),ival("db-ya"),ival("db-yb")];
      h=stc(1,"Integral iterada",`${TX(`\\int_{${oa}}^{${ob}}\\int_{${ia}}^{${ib}}${E.f}\\,d${vi}\\,d${vo}`)}${TX(`\\text{Interior (respecto a }${vi}\\text{): }${E.inner}`)}${TX(`\\text{Exterior: }\\int_{${oa}}^{${ob}}${E.inner}\\,d${vo}=${E.v}`)}`)}
    h+=`<div class="res">${tiles([["Valor",E.vn!=null?fx(E.vn):"—","okt"]])}</div>`;
    if(ord==="dydx"){const g1=pfa(ival("db-ya")),g2=pfa(ival("db-yb")),a=Number(ival("db-xa")),b=Number(ival("db-xb"));if(g1&&g2&&b>a){h+=plotFns({fs:[g1,g2],xr:[a-(b-a)*.2,b+(b-a)*.2],extra:[fr=>{let p=`M${fr.sx(a)},${fr.sy(g1(a))}`;for(let i=0;i<=60;i++){const x=a+(b-a)*i/60;p+=`L${fr.sx(x).toFixed(1)},${fr.sy(g2(x)).toFixed(1)}`}for(let i=60;i>=0;i--){const x=a+(b-a)*i/60;p+=`L${fr.sx(x).toFixed(1)},${fr.sy(g1(x)).toFixed(1)}`}return`<path d="${p}Z" fill="var(--line)" fill-opacity=".2"/>`}],label:"Región de integración"})}}
    $("db-oo").innerHTML=h;typeset($("db-oo"))};
  const d=debounce(run,450);["db-f","db-xa","db-xb","db-ya","db-yb"].forEach(i=>$(i).addEventListener("input",d));bindSeg("db-o",v=>{ord=v;run()});
  bindPresets("db-pre",P,p=>{$("db-f").value=p[1];$("db-xa").value=p[2];$("db-xb").value=p[3];$("db-ya").value=p[4];$("db-yb").value=p[5];ord=p[6];document.querySelectorAll("#db-o button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.v===ord?"true":"false"));run()});start(run)};
