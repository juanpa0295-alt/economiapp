
// ===================== LABORATORIOS DE MATEMÁTICAS II (y comunes con III) =====================
const absify=s=>{s=String(s);for(let i=0;i<4;i++){const t=s.replace(/\|([^|]+)\|/g,"abs($1)");if(t===s)break;s=t}return s.replace(/sen\(/g,"sin(").replace(/\bAbs\(/g,"abs(").replace(/−/g,"-")};
const pfa=s=>pfx(absify(s));
const deriv=(f,x,e=1e-5)=>(f(x+e)-f(x-e))/(2*e);

// ---------- Newton
SIMS.newton=function(){MAT_RUN=null;
  const P=[["x² − 2","x^2 - 2","1"],["x³ − x − 1","x^3 - x - 1","1.5"],["TIR: −1000 + 300/(1+x) + 400/(1+x)² + 500/(1+x)³","-1000 + 300/(1+x) + 400/(1+x)^2 + 500/(1+x)^3","0.1"],["cos(x) − x","cos(x) - x","1"]];
  $("sim").innerHTML=`${presets("nw-pre",P)}<div class="calcf">${inp("nw-f","f(x)","x^2 - 2",1)}${inp("nw-x","x₀","1",1)}${nin("nw-n","Iteraciones",8,"1")}</div><div class="res" id="nw-res"></div><div id="nw-g"></div><div id="nw-o"></div>`;
  const run=()=>{const f=pfa(ival("nw-f")),x0=Number(ival("nw-x")),K=Math.max(1,Math.min(30,N("nw-n")||8));if(!f||!isFinite(x0)){$("nw-res").innerHTML=err("revisa la función y x₀.");return}
    const it=[];let x=x0;for(let k=0;k<K;k++){const fx0=f(x),d=deriv(f,x);if(!isFinite(fx0)||!isFinite(d)||Math.abs(d)<1e-14){it.push({k,x,fx:fx0,d,nx:NaN});break}const nx=x-fx0/d;it.push({k,x,fx:fx0,d,nx});if(Math.abs(nx-x)<1e-14){x=nx;break}x=nx}
    const last=it[it.length-1],r=isFinite(last.nx)?last.nx:last.x,ok=isFinite(r)&&Math.abs(f(r))<1e-8;
    $("nw-res").innerHTML=tiles([["Raíz aproximada",fx(r),ok?"okt":"badt"],["f(raíz)",fx(f(r))],["Iteraciones",String(it.length)]]);
    const xs=it.map(i=>i.x).filter(isFinite),lo=Math.min(...xs,r)-1.5,hi=Math.max(...xs,r)+1.5;
    $("nw-g").innerHTML=plotFns({fs:[f,...it.slice(0,3).map(i=>t=>i.fx+i.d*(t-i.x))],xr:[lo,hi],marks:it.slice(0,4).map((i,k)=>({x:i.x,y:0,col:"--exam",label:"x"+k})),label:"Tangentes de Newton"})+leg([["--line","f(x)"],["--exam","Tangentes sucesivas"]]);
    $("nw-o").innerHTML=stc(1,"Iteraciones",`<div class="tbl"><table><tr><th>n</th><th>xₙ</th><th>f(xₙ)</th><th>f′(xₙ)</th><th>xₙ₊₁ = xₙ − f/f′</th></tr>${it.map(i=>`<tr><td>${i.k}</td><td>${fx(i.x)}</td><td>${fx(i.fx)}</td><td>${fx(i.d)}</td><td>${fx(i.nx)}</td></tr>`).join("")}</table></div>${ok?"":`<p class="warn">No convergió: prueba otro x₀ (cerca de donde la gráfica corta el eje) o revisa si f′ se anula.</p>`}`)};
  onIn(["nw-f","nw-x","nw-n"],run);bindPresets("nw-pre",P,p=>{$("nw-f").value=p[1];$("nw-x").value=p[2];run()});run()};

// ---------- Análisis de la curva
SIMS.curva=function(){
  const P=[["x³ − 3x en [−2, 3]","x^3 - 3x","-2","3"],["x⁴ − 4x³","x^4 - 4x^3","-1","4"],["x e^(−x)","x exp(-x)","0","5"],["Costo medio 0,1x² − 3x + 50 + 200/x","0.1x^2 - 3x + 50 + 200/x","1","30"]];
  $("sim").innerHTML=`${casBox()}${presets("cv-pre",P)}<div class="calcf">${inp("cv-f","f(x)","x^3 - 3x",1)}${inp("cv-a","a (intervalo, opcional)","-2",1)}${inp("cv-b","b","3",1)}</div><div id="cv-o" class="slv-out"></div>`;
  const run=()=>{const fs=ival("cv-f"),f=pfa(fs),a=ival("cv-a"),b=ival("cv-b"),E=exact("curva",fs,a,b);let h="";
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else{
      h=stc(1,"Derivadas",`${TX(`f(x)=${E.f}`)}${TX(`f'(x)=${E.d1}\\qquad f''(x)=${E.d2}`)}`)
       +stc(2,"Crecimiento y concavidad",`<div class="tbl"><table><tr><td>Crece (f′ &gt; 0)</td><td>${tx(E.inc)}</td></tr><tr><td>Decrece (f′ &lt; 0)</td><td>${tx(E.dec)}</td></tr><tr><td>Cóncava hacia arriba (f″ &gt; 0)</td><td>${tx(E.cu)}</td></tr><tr><td>Cóncava hacia abajo (f″ &lt; 0)</td><td>${tx(E.cd)}</td></tr><tr><td>Puntos de inflexión (candidatos)</td><td>${E.infl.length?E.infl.map(tx).join(", "):"ninguno"}</td></tr></table></div>`)
       +stc(3,"Extremos relativos",E.pts.length?`<div class="tbl"><table><tr><th>x</th><th>f(x)</th><th>f″(x)</th><th>Tipo</th></tr>${E.pts.map(p=>`<tr><td>${tx(p.x)}</td><td>${tx(p.f)}</td><td>${tx(p.d2)}</td><td>${p.tipo==="max"?"máximo relativo":p.tipo==="min"?"mínimo relativo":"revisar con f′"}</td></tr>`).join("")}</table></div>`:"<p>No hay puntos críticos.</p>")
       +(E.ab?stc(4,`Extremos absolutos en [${a}, ${b}]`,`<div class="tbl"><table><tr><th>Candidato</th><th>f</th></tr>${E.ab.tabla.map(r=>`<tr><td>${tx(r.x)}</td><td>${tx(r.f)}</td></tr>`).join("")}</table></div><p>Máximo absoluto: f(${tx(E.ab.max[0])}) = ${tx(E.ab.max[1])}. Mínimo absoluto: f(${tx(E.ab.min[0])}) = ${tx(E.ab.min[1])}.</p>`):"")}
    const A=Number(a),Bv=Number(b),xr=isFinite(A)&&isFinite(Bv)&&Bv>A?[A-(Bv-A)*.2,Bv+(Bv-A)*.2]:[-5,5];
    if(f)h+=plotFns({fs:[f,x=>deriv(f,x)],xr,marks:E&&E.ok?E.pts.filter(p=>p.xn!=null).map(p=>({x:p.xn,y:p.fn,label:p.tipo==="max"?"máx":p.tipo==="min"?"mín":""})):[],label:"f y f′"})+leg([["--line","f(x)"],["--exam","f′(x)"]]);
    $("cv-o").innerHTML=h;typeset($("cv-o"))};
  const d=debounce(run,400);["cv-f","cv-a","cv-b"].forEach(i=>$(i).addEventListener("input",d));bindPresets("cv-pre",P,p=>{$("cv-f").value=p[1];$("cv-a").value=p[2];$("cv-b").value=p[3];run()});start(run)};

// ---------- Teorema del valor medio
SIMS.tvm=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="calcf">${inp("tv-f","f(x)","x^3 - 2x",1)}${inp("tv-a","a","0",1)}${inp("tv-b","b","2",1)}</div><div class="res" id="tv-res"></div><div id="tv-g"></div><div id="tv-o"></div>`;
  const run=()=>{const f=pfa(ival("tv-f")),a=Number(ival("tv-a")),b=Number(ival("tv-b"));if(!f||!(b>a)){$("tv-res").innerHTML=err("revisa f y que b > a.");return}const m=(f(b)-f(a))/(b-a),g=x=>deriv(f,x)-m,cs=[];
    const n=400;for(let i=0;i<n;i++){const x0=a+(b-a)*(i+.5)/n,x1=a+(b-a)*(i+1.5)/n;if(x1>=b)break;const g0=g(x0),g1=g(x1);if(isFinite(g0)&&isFinite(g1)&&g0*g1<=0){let lo=x0,hi=x1;for(let k=0;k<60;k++){const mm=(lo+hi)/2;if(g(lo)*g(mm)<=0)hi=mm;else lo=mm}const c=(lo+hi)/2;if(!cs.some(z=>Math.abs(z-c)<1e-6))cs.push(c)}}
    $("tv-res").innerHTML=tiles([["Pendiente de la secante",fx(m)],["Puntos c",cs.length?cs.map(fx).join(", "):"no se encontraron","okt"],["¿Rolle?",Math.abs(f(a)-f(b))<1e-9?"sí: f(a) = f(b)":"no aplica"]]);
    $("tv-g").innerHTML=plotFns({fs:[f,x=>f(a)+m*(x-a),...cs.slice(0,2).map(c=>x=>f(c)+m*(x-c))],xr:[a-(b-a)*.25,b+(b-a)*.25],marks:[{x:a,y:f(a),label:"a"},{x:b,y:f(b),label:"b"},...cs.map(c=>({x:c,y:f(c),col:"--good",label:"c"}))],label:"Valor medio"})+leg([["--line","f"],["--exam","Secante"],["--good","Tangente paralela en c"]]);
    $("tv-o").innerHTML=stc(1,"Cálculo",`<div class="eq al">[f(b) − f(a)]/(b − a) = (${fx(f(b))} − ${fx(f(a))})/(${fx(b)} − ${fx(a)}) = ${fx(m)}<br>f′(c) = ${fx(m)} ⟹ c = ${cs.map(fx).join(", ")||"—"}</div><p class="hint">Si f no es continua en [a, b] o no es derivable en (a, b), el teorema no garantiza que exista c.</p>`)};
  onIn(["tv-f","tv-a","tv-b"],run);run()};

// ---------- Integral indefinida con pasos (también técnicas de Matemáticas III)
const INTP={antiderivadas:[["Polinomio","3x^2 - 4x + 5"],["Raíces","sqrt(x) + 1/x^2"],["Costo marginal","0.3x^2 - 2x + 15"],["Exponencial","5exp(x) - 2/x"]],
  trascendentes:[["ln|u|","2x/(x^2+1)"],["Exponencial con cadena","x exp(x^2)"],["Arcotangente","1/(4+x^2)"],["Arcoseno","1/sqrt(9-x^2)"],["Base a","2^x"]],
  partes:[["x eˣ","x exp(x)"],["x ln x","x ln(x)"],["x² sen x","x^2 sin(x)"],["eˣ cos x (cíclica)","exp(x) cos(x)"],["ln x","ln(x)"]],
  trigonometricas:[["sen² x","sin(x)^2"],["sen³ x","sin(x)^3"],["sen x cos² x","sin(x) cos(x)^2"],["tan x","tan(x)"],["sec² x","1/cos(x)^2"]],
  "sustitucion-trig":[["√(1 − x²)","sqrt(1-x^2)"],["1/√(4 + x²)","1/sqrt(4+x^2)"],["x²/√(9 − x²)","x^2/sqrt(9-x^2)"]],
  fracciones:[["1/(x² − 1)","1/(x^2-1)"],["(3x + 5)/((x − 1)(x + 2))","(3x+5)/((x-1)(x+2))"],["1/(x(x² + 1))","1/(x (x^2+1))"],["(x + 2)/(x²(x − 1))","(x+2)/(x^2 (x-1))"]]};
SIMS.intind=function(){
  const P=presetsFor(INTP,"antiderivadas");
  $("sim").innerHTML=`${casBox()}${presets("ii-pre",P)}<div class="calcf">${inp("ii-f","f(x) a integrar","",1)}</div><div id="ii-o" class="slv-out"></div>`;$("ii-f").value=P[0][1];
  const run=()=>{const fs=ival("ii-f"),E=exact("integral",fs);let h="";
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else{
      h=stc(1,"Resultado",E.F?TX(`\\int ${E.f}\\,dx=${E.F}+C`):`<p>No hay antiderivada elemental: se resuelve con métodos numéricos o series.</p>`)
       +(E.pasos.length?stc(2,"Reglas aplicadas (en orden)",`<ol class="steps">${E.pasos.map(p=>`<li style="margin-left:${Math.min(p.nivel,6)*12}px"><b>${p.r}</b>: ${tx("\\int "+p.i+"\\,dx")}${p.det?` — ${tx(p.det)}`:""}</li>`).join("")}</ol><p class="hint">Los pasos sangrados son subintegrales que aparecen al aplicar la regla del nivel anterior.</p>`):"")
       +(E.F?stc(3,"Comprobación",`<p>Derivar el resultado devuelve el integrando: ${tx("\\frac{d}{dx}\\left("+E.F+"\\right)="+E.f)}.</p>`):"");
      const f=pfa(fs),F=E.Fstr?pfa(E.Fstr):null;if(f&&F)h+=plotFns({fs:[f,F],xr:[-4,4],label:"f y una antiderivada"})+leg([["--line","f(x)"],["--exam","F(x) (C = 0)"]])}
    $("ii-o").innerHTML=h;typeset($("ii-o"))};
  const d=debounce(run,450);$("ii-f").addEventListener("input",d);bindPresets("ii-pre",P,p=>{$("ii-f").value=p[1];run()});start(run)};

// ---------- Sumas de Riemann
SIMS.riemann=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="calcf">${inp("rm-f","f(x)","x^2",1)}${inp("rm-a","a","0",1)}${inp("rm-b","b","2",1)}</div>${ctl("rm-n","Número de rectángulos n",1,100,1,8)}<div style="margin:8px 0">${seg("rm-t","Punto de evaluación",[["izq","Izquierdo"],["der","Derecho"],["med","Medio"]],"izq")}</div><div class="res" id="rm-res"></div><div id="rm-g"></div>`;
  let tp="izq";const run=()=>{const f=pfa(ival("rm-f")),a=Number(ival("rm-a")),b=Number(ival("rm-b")),n=V("rm-n");if(!f||!(b>a)){$("rm-res").innerHTML=err("revisa f y que b > a.");return}const dx=(b-a)/n,pt=i=>tp==="izq"?a+i*dx:tp==="der"?a+(i+1)*dx:a+(i+.5)*dx;let S=0;for(let i=0;i<n;i++)S+=f(pt(i))*dx;const I=NUM.integral(ival("rm-f"),String(a),String(b)).area;
    $("rm-res").innerHTML=tiles([["Δx",fx(dx)],["Suma de Riemann",fx(S),"okt"],["Integral",fx(I)],["Error",fx(S-I)]]);
    const rects=fr=>[...Array(n)].map((_,i)=>{const x0=a+i*dx,h=f(pt(i));const y0=fr.sy(Math.max(0,h)),y1=fr.sy(Math.min(0,h));return`<rect x="${fr.sx(x0)}" y="${y0}" width="${Math.max(.5,fr.sx(x0+dx)-fr.sx(x0))}" height="${Math.max(0,y1-y0)}" fill="var(--exam)" fill-opacity=".22" stroke="var(--exam)" stroke-width="1"/>`}).join("");
    $("rm-g").innerHTML=plotFns({fs:[f],xr:[a-(b-a)*.1,b+(b-a)*.1],extra:[rects],label:"Rectángulos"})+`<p class="hint">Sube n y la suma se acerca a la integral. Con f creciente, los extremos izquierdos dan una suma menor que la integral y los derechos una mayor.</p>`};
  onIn(["rm-f","rm-a","rm-b"],run);bindCtl(["rm-n"],run);bindSeg("rm-t",v=>{tp=v;run()});run()};

// ---------- Integración numérica
SIMS.numint=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="calcf">${inp("ni-f","f(x)","exp(-x^2)",1)}${inp("ni-a","a","0",1)}${inp("ni-b","b","1",1)}</div>${ctl("ni-n","n (par para Simpson)",2,64,2,4)}<div class="res" id="ni-res"></div><div id="ni-o"></div>`;
  const run=()=>{const f=pfa(ival("ni-f")),a=Number(ival("ni-a")),b=Number(ival("ni-b")),n=V("ni-n");if(!f||!(b>a))return;const dx=(b-a)/n,xs=[...Array(n+1)].map((_,i)=>a+i*dx),ys=xs.map(f);
    const T=dx/2*(ys[0]+2*ys.slice(1,-1).reduce((s,v)=>s+v,0)+ys[n]),S=dx/3*(ys[0]+ys[n]+ys.slice(1,-1).reduce((s,v,i)=>s+(i%2===0?4:2)*v,0)),I=NUM.integral(ival("ni-f"),String(a),String(b)).area;
    $("ni-res").innerHTML=tiles([["Trapecios",fmt(T,6)],["Simpson",fmt(S,6),"okt"],["Valor de referencia",fmt(I,8)],["Error trapecios",fmt(T-I,8)],["Error Simpson",fmt(S-I,10)]]);
    $("ni-o").innerHTML=stc(1,"Tabla",`<div class="tbl"><table><tr><th>i</th><th>xᵢ</th><th>f(xᵢ)</th><th>Peso trapecio</th><th>Peso Simpson</th></tr>${xs.slice(0,17).map((x,i)=>`<tr><td>${i}</td><td>${fx(x)}</td><td>${fmt(ys[i],6)}</td><td>${i===0||i===n?1:2}</td><td>${i===0||i===n?1:i%2?4:2}</td></tr>`).join("")}${n>16?`<tr><td colspan="5">…</td></tr>`:""}</table></div><p class="hint">T = (Δx/2)·Σ pesos·f, S = (Δx/3)·Σ pesos·f, con Δx = ${fx(dx)}. Duplicar n divide el error de los trapecios entre unos 4 y el de Simpson entre unos 16.</p>`)};
  onIn(["ni-f","ni-a","ni-b"],run);bindCtl(["ni-n"],run);run()};

// ---------- Crecimiento y decaimiento
SIMS.crec=function(){MAT_RUN=null;
  $("sim").innerHTML=`${ctl("cr-k","k (por periodo)",-0.5,0.5,0.01,0.07)}<div class="calcf">${nin("cr-y","y₀",1000)}${nin("cr-t","Horizonte",30,"1")}${nin("cr-q","Valor objetivo",2000)}</div><div class="res" id="cr-res"></div><div id="cr-g"></div>`;
  const run=()=>{const k=V("cr-k"),y0=N("cr-y"),T=N("cr-t"),q=N("cr-q");if(!(y0>0&&T>0))return;const tq=k&&q>0?Math.log(q/y0)/k:NaN;
    $("cr-res").innerHTML=tiles([["y(T)",fmt(y0*Math.exp(k*T),2)],[k>0?"Tiempo de duplicación":"Vida media",k?fx(Math.log(2)/Math.abs(k)):"—","okt"],["Tiempo para llegar al objetivo",isFinite(tq)&&tq>=0?fx(tq):"no se alcanza"]]);
    $("cr-g").innerHTML=plotFns({fs:[t=>y0*Math.exp(k*t)],xr:[0,T],label:"y(t) = y₀e^(kt)",xl:"t"})+`<p class="hint">dy/dt = ky ⟹ dy/y = k dt ⟹ ln y = kt + C ⟹ y = y₀e^(kt). Tiempo para llegar a Q: t = ln(Q/y₀)/k.</p>`};
  bindCtl(["cr-k"],run);onIn(["cr-y","cr-t","cr-q"],run);run()};

// ---------- Curvas de nivel
SIMS.nivel=function(){MAT_RUN=null;
  const P=[["Utilidad xy","x*y","0.5","10"],["Cobb-Douglas x^0,3 y^0,7","x^0.3*y^0.7","0.5","10"],["Paraboloide x² + y²","x^2+y^2","-5","5"],["Silla x² − y²","x^2-y^2","-5","5"],["Sustitutos 2x + y","2x+y","0","10"]];
  $("sim").innerHTML=`${presets("nv-pre",P)}<div class="calcf">${inp("nv-f","f(x, y)","x*y",1)}${inp("nv-a","Desde","0.5",1)}${inp("nv-b","Hasta","10",1)}</div><div id="nv-g"></div>`;
  const run=()=>{const G=pf2(absify(ival("nv-f"))),a=Number(ival("nv-a")),b=Number(ival("nv-b"));if(!G||!(b>a)){$("nv-g").innerHTML=err("revisa la función.");return}
    const vals=[];for(let i=1;i<20;i++)for(let j=1;j<20;j++){const v=G(a+(b-a)*i/20,a+(b-a)*j/20);if(isFinite(v))vals.push(v)}vals.sort((p,q)=>p-q);const lv=[.1,.25,.4,.55,.7,.85].map(p=>vals[Math.floor(p*(vals.length-1))]),C=["--line","--exam","--good","--branch","--ink","--muted"];
    $("nv-g").innerHTML=plotXYc({xr:[a,b],yr:[a,b],draw:fr=>lv.map((l,i)=>contour(G,[a,b],[a,b],l,fr,C[i%C.length],2)).join(""),label:"Curvas de nivel",H:400})+leg(lv.map((l,i)=>[C[i%C.length],"f = "+fx(l)]))+`<p class="hint">Cada curva une los puntos donde f toma el mismo valor. Para una utilidad son curvas de indiferencia; para una función de producción, isocuantas.</p>`};
  onIn(["nv-f","nv-a","nv-b"],run);bindPresets("nv-pre",P,p=>{$("nv-f").value=p[1];$("nv-a").value=p[2];$("nv-b").value=p[3];run()});run()};

// ---------- Derivadas parciales
SIMS.parc=function(){
  const P=[["Cobb-Douglas","10 x^0.5 y^0.5","4","9"],["Polinomio","x^2 y + 3x y^2","1","2"],["Exponencial","exp(x y)","1","0"]];
  $("sim").innerHTML=`${casBox()}${presets("pc-pre",P)}<div class="calcf">${inp("pc-f","f(x, y)","10 x^0.5 y^0.5",1)}${inp("pc-x","x₀","4",1)}${inp("pc-y","y₀","9",1)}${nin("pc-t","Dirección (ángulo en grados)",45,"5")}</div><div id="pc-o" class="slv-out"></div>`;
  const run=()=>{const E=exact("parciales",ival("pc-f"),ival("pc-x"),ival("pc-y")),th=(N("pc-t")||0)*Math.PI/180;let h="";
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else{const gx=E.gxn,gy=E.gyn,Du=gx*Math.cos(th)+gy*Math.sin(th),ng=Math.hypot(gx,gy);
      h=stc(1,"Derivadas parciales",`${TX(`f=${E.f}`)}${TX(`f_x=${E.fx}\\qquad f_y=${E.fy}`)}${TX(`f_{xx}=${E.fxx}\\quad f_{yy}=${E.fyy}\\quad f_{xy}=${E.fxy}\\quad f_{yx}=${E.fyx}`)}<p class="hint">f_xy = f_yx (teorema de Schwarz).</p>`)
       +stc(2,"En el punto",`<div class="tbl"><table><tr><td>f(x₀, y₀)</td><td>${tx(E.v)}</td></tr><tr><td>Gradiente ∇f</td><td>${tx(`(${E.gx},\\;${E.gy})`)} ≈ (${fx(gx)}, ${fx(gy)})</td></tr><tr><td>Derivada direccional a ${fx(N("pc-t"))}°</td><td>${fx(Du)}</td></tr><tr><td>Máximo crecimiento ‖∇f‖</td><td>${fx(ng)}</td></tr><tr><td>Pendiente de la curva de nivel −f_x/f_y</td><td>${isFinite(gx/gy)?fx(-gx/gy):"—"}</td></tr></table></div><p class="hint">Si f es una utilidad, −f_x/f_y es la pendiente de la curva de indiferencia y su valor absoluto la relación marginal de sustitución.</p>`)}
    $("pc-o").innerHTML=h;typeset($("pc-o"))};
  const d=debounce(run,400);["pc-f","pc-x","pc-y","pc-t"].forEach(i=>$(i).addEventListener("input",d));bindPresets("pc-pre",P,p=>{$("pc-f").value=p[1];$("pc-x").value=p[2];$("pc-y").value=p[3];run()});start(run)};

// ---------- Extremos en dos variables
SIMS.ext2=function(){
  const P=[["x³ − 3x + y² − 4y","x^3 - 3x + y^2 - 4y"],["Silla x² − y²","x^2 - y^2"],["Beneficio de dos productos","-2x^2 - x y - 2y^2 + 12x + 18y"],["x⁴ + y⁴ − 4xy","x^4 + y^4 - 4x y"]];
  $("sim").innerHTML=`${casBox()}${presets("e2-pre",P)}<div class="calcf">${inp("e2-f","f(x, y)","x^3 - 3x + y^2 - 4y",1)}</div><div id="e2-o" class="slv-out"></div>`;
  const run=()=>{const fs=ival("e2-f"),E=exact("parciales",fs,"",""),G=pf2(absify(fs));let h="";
    if(!E)h=espera();else if(!E.ok)h=casErr(E);else h=stc(1,"Condiciones de primer orden",`${TX(`f_x=${E.fx}=0\\qquad f_y=${E.fy}=0`)}`)+stc(2,"Criterio de las segundas derivadas",`${TX(`D=f_{xx}f_{yy}-f_{xy}^2=(${E.fxx})(${E.fyy})-(${E.fxy})^2`)}${E.pts.length?`<div class="tbl"><table><tr><th>Punto</th><th>D</th><th>f_xx</th><th>f</th><th>Tipo</th></tr>${E.pts.map(p=>`<tr><td>${tx(`(${p.x},\\;${p.y})`)}</td><td>${tx(p.D)}</td><td>${tx(p.fxx)}</td><td>${tx(p.f)}</td><td><b>${p.tipo}</b></td></tr>`).join("")}</table></div>`:"<p>No se encontraron puntos críticos reales.</p>"}`);
    if(G)h+=plotXYc({xr:[-4,4],yr:[-3,5],draw:fr=>{const vals=[];for(let i=0;i<=20;i++)for(let j=0;j<=20;j++){const v=G(-4+8*i/20,-3+8*j/20);if(isFinite(v))vals.push(v)}vals.sort((a,b)=>a-b);return[.08,.2,.35,.5,.65,.8,.92].map((p,i)=>contour(G,[-4,4],[-3,5],vals[Math.floor(p*(vals.length-1))],fr,["--line","--exam","--good","--branch","--ink","--line","--exam"][i],1.6)).join("")},label:"Curvas de nivel",H:360});
    $("e2-o").innerHTML=h;typeset($("e2-o"))};
  const d=debounce(run,400);$("e2-f").addEventListener("input",d);bindPresets("e2-pre",P,p=>{$("e2-f").value=p[1];run()});start(run)};
