// Matemáticas · calculadoras (SymPy con Pyodide y respaldo numérico) y laboratorios
// ===================== LABORATORIOS DE MATEMÁTICAS =====================
const SIMS={};
let MAT_RUN=null,CLIP=0;
CAS.on(()=>{paintCas();if(MAT_RUN&&$("sim"))MAT_RUN()});
function paintCas(){const el=$("cas-st");if(!el)return;const s=CAS.state;
  el.className="cas "+(s==="ready"?"ok":s==="error"?"off":"wait");
  el.innerHTML=s==="ready"?"Motor exacto listo: los resultados son los de SymPy, igual que en la app."
    :s==="error"?"No se pudo cargar el motor exacto (SymPy) en esta vista. Los resultados son aproximaciones numéricas; en el sitio publicado se cargan los exactos."
    :"Cargando el motor exacto (SymPy). La primera vez tarda unos segundos; mientras tanto ves resultados aproximados."}
const dec=s=>String(s).replace(/(\d),(\d)/g,"$1{,}$2"),tx=s=>`\\(${dec(s)}\\)`,TX=s=>`<div class="mj">\\[${dec(s)}\\]</div>`;
function fN(v){if(v===Infinity)return"∞";if(v===-Infinity)return"−∞";if(!isFinite(v))return"no existe";const a=Math.abs(v);return v.toLocaleString("es-CO",{maximumFractionDigits:a>=1000?2:a>=1?4:6})}
const fT=v=>v===Infinity?"\\infty":v===-Infinity?"-\\infty":isFinite(v)?String(+v.toPrecision(8)):"\\text{no existe}";
function debounce(fn,ms){let t;return()=>{clearTimeout(t);t=setTimeout(fn,ms)}}
function presets(id,list){return `<div class="chips pre" id="${id}">${list.map((p,i)=>`<button class="chip ws-chip" type="button" data-i="${i}">${p[0]}</button>`).join("")}</div>`}
function bindPresets(id,list,apply){$(id).addEventListener("click",e=>{const b=e.target.closest("button");if(b)apply(list[+b.dataset.i])})}
// gráfico de una función con cortes en discontinuidades
function plotFn({f,xr,marks=[],shade=null,extra=[],xl="x",yl="f(x)",H=280,label}){
  const W=600,N=500,xs=[...Array(N+1)].map((_,i)=>xr[0]+(xr[1]-xr[0])*i/N),ys=xs.map(f);
  const fin=ys.filter(isFinite).sort((a,b)=>a-b);
  let lo=fin.length?fin[Math.floor(fin.length*0.04)]:-1,hi=fin.length?fin[Math.floor(fin.length*0.96)]:1;
  marks.forEach(m=>{if(isFinite(m.y)){lo=Math.min(lo,m.y);hi=Math.max(hi,m.y)}});lo=Math.min(lo,0);hi=Math.max(hi,0);
  const pad=(hi-lo||1)*0.12;lo-=pad;hi+=pad;
  const fr=frame(W,H,xr,[lo,hi],ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(lo,hi,nice((hi-lo)/4)),xl,yl),id="cq"+(++CLIP);
  let d="",pen=false;xs.forEach((x,i)=>{const y=ys[i];if(!isFinite(y)||y<lo-(hi-lo)*3||y>hi+(hi-lo)*3){pen=false;return}
    if(pen&&Math.abs(y-ys[i-1])>(hi-lo)*1.5)pen=false;d+=(pen?"L":"M")+fr.sx(x).toFixed(1)+","+fr.sy(y).toFixed(1);pen=true});
  let b="";
  if(shade){const n=200;let p=`M${fr.sx(shade[0]).toFixed(1)},${fr.sy(0).toFixed(1)}`;for(let i=0;i<=n;i++){const x=shade[0]+(shade[1]-shade[0])*i/n,y=f(x);if(isFinite(y))p+=`L${fr.sx(x).toFixed(1)},${fr.sy(Math.max(lo,Math.min(hi,y))).toFixed(1)}`}
    p+=`L${fr.sx(shade[1]).toFixed(1)},${fr.sy(0).toFixed(1)}Z`;b+=`<path d="${p}" fill="var(--line)" fill-opacity=".22"/>`}
  b+=extra.join("");
  b+=`<line x1="${fr.L}" x2="${W-fr.R}" y1="${fr.sy(0)}" y2="${fr.sy(0)}" stroke="var(--muted)" stroke-width="1"/>`;
  if(xr[0]<0&&xr[1]>0)b+=`<line y1="${fr.T}" y2="${H-fr.B}" x1="${fr.sx(0)}" x2="${fr.sx(0)}" stroke="var(--muted)" stroke-width="1"/>`;
  b+=`<path d="${d}" fill="none" stroke="var(--line)" stroke-width="2.5"/>`;
  let p="";marks.forEach(m=>{if(!isFinite(m.x)||!isFinite(m.y))return;const x=fr.sx(m.x),y=fr.sy(m.y),anc=x>W*.7?"end":"start";
    p+=`<circle cx="${x}" cy="${y}" r="6" fill="${m.hollow?"var(--card)":`var(${m.col||"--ink"})`}" stroke="var(${m.col||"--ink"})" stroke-width="2.5"/>${m.label?`<text x="${x+(anc==="end"?-9:9)}" y="${y-10}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${m.col||"--ink"})">${m.label}</text>`:""}`});
  return {svg:`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfica de la función"}"><defs><clipPath id="${id}"><rect x="${fr.L}" y="${fr.T}" width="${W-fr.L-fr.R}" height="${H-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`,fr}}
function exact(fn,...args){if(CAS.state!=="ready")return null;try{return CAS.call(fn,...args)}catch(e){return{ok:false,error:String(e.message||e)}}}
function casBox(){return `<div class="cas" id="cas-st" role="status"></div>`}
function start(run){MAT_RUN=run;paintCas();CAS.load();run()}

// ---- Límites
SIMS.lim=function(){
  const P=[["(x²−1)/(x−1) en 1","(x^2-1)/(x-1)","1"],["1/x en 0","1/x","0"],["|x|/x en 0","abs(x)/x","0"],["(2x²+3)/(x²−1) en ∞","(2x^2+3)/(x^2-1)","oo"],["sin(x)/x en 0","sin(x)/x","0"],["(√(x+4)−2)/x en 0","(sqrt(x+4)-2)/x","0"]];
  $("sim").innerHTML=`${casBox()}${presets("l-pre",P)}<div class="calcf"><label for="l-f">Función f(x)<input id="l-f" value="(x^2-1)/(x-1)" autocomplete="off" spellcheck="false"></label><label for="l-a">x tiende a<input id="l-a" value="1" autocomplete="off"></label></div><div id="l-out" class="slv-out"></div>`;
  const run=()=>{const fs=$("l-f").value,as=$("l-a").value;let n;
    try{n=NUM.limit(fs,as)}catch(e){$("l-out").innerHTML=`<p class="err">Revisa la función: ${esc(String(e.message||e))}. Usa * o espacios para multiplicar si hace falta, y ^ para potencias.</p>`;return}
    const E=exact("limite",fs,as),ok=E&&E.ok,ftex=ok?E.f:n.f,atex=ok?E.t:fT(n.a);
    const Ls=ok?tx(E.L):fN(n.L),Li=ok?tx(E.Li):fN(n.Li),Ld=ok?tx(E.Ld):fN(n.Ld),ex=ok?E.existe:n.existe;
    let h=`<div class="stepc"><h4><span class="n">1</span>Resultado${ok?"":" aproximado"}</h4>${TX(`\\lim_{x\\to ${atex}}\\left(${ftex}\\right)`)}
      <div class="res">${tiles([["Por la izquierda",Li],["Por la derecha",Ld],["Límite",ex?Ls:"no existe"]])}</div>
      ${verdict(!ex,(n.inf?"El límite no existe o no se pudo determinar.":"El límite no existe: los límites laterales son distintos."),`El límite existe y vale ${ok?tx(E.L):fN(n.L)}.`)}</div>`;
    if(ok){let s="";
      if(E.caso==="infinito")s=`<p>Cuando x tiende a infinito no se evalúa directamente: se compara el crecimiento del numerador y del denominador (por ejemplo, dividiendo por la mayor potencia).</p>`;
      else{s=`<p><b>Evaluación directa:</b></p>${TX(`f(${E.t})=\\frac{${E.eval[0]}}{${E.eval[1]}}`)}`;
        if(E.caso==="indeterminado")s+=`<p class="warn"><b>Indeterminación 0/0.</b> Se simplifica la expresión y se vuelve a evaluar.</p>${TX(`f(x)\\;\\rightarrow\\;${E.simp}`)}${TX(`\\lim_{x\\to ${E.t}}${E.simp}=${E.L}`)}${E.simp===E.f?`<p class="hint">SymPy no encontró una forma más simple; el límite sale de otras técnicas (por ejemplo, racionalizar o L'Hôpital).</p>`:""}`;
        else if(E.caso==="asintota")s+=`<p>El denominador es cero pero el numerador no: hay una asíntota vertical y los límites laterales tienden a ±∞.</p>`;
        else s+=`<p>No hay singularidad: el límite se obtiene por evaluación directa.</p>`}
      h+=`<div class="stepc"><h4><span class="n">2</span>Paso a paso</h4>${s}</div>`}
    else if(E&&!E.ok)h+=`<p class="err">SymPy no pudo resolver esta expresión: ${esc(E.error)}</p>`;
    else h+=`<div class="stepc"><h4><span class="n">2</span>Paso a paso</h4><p>Evaluación directa: f(${fN(n.a)}) ${isFinite(n.fa)?`= ${fN(n.fa)}`:"no está definida"}. ${!isFinite(n.fa)&&isFinite(n.L)?"Es una indeterminación que se resuelve simplificando.":""} El paso a paso simbólico aparece cuando carga el motor exacto.</p></div>`;
    const {f}=NUM.parse(fs),a=n.a,xr=isFinite(a)?[a-4,a+4]:a>0?[0,60]:[-60,0];
    h+=plotFn({f,xr,marks:isFinite(a)&&isFinite(n.L)?[{x:a,y:n.L,hollow:!isFinite(n.fa),col:"--exam",label:`L = ${fN(n.L)}`}]:[],label:"Gráfica de la función cerca del punto"}).svg;
    $("l-out").innerHTML=h;typeset($("l-out"))};
  const d=debounce(run,350);["l-f","l-a"].forEach(i=>$(i).addEventListener("input",d));
  bindPresets("l-pre",P,p=>{$("l-f").value=p[1];$("l-a").value=p[2];run()});start(run);
};

// ---- Optimización de una variable
SIMS.opt=function(){
  const P=[["Beneficio −x² + 40x − 100","-x^2 + 40x - 100"],["x³ − 6x² + 9x + 1","x^3 - 6x^2 + 9x + 1"],["x·e^(−x)","x e^(-x)"],["ln(x) − x/10","ln(x) - x/10"],["x⁴ − 8x²","x^4 - 8x^2"],["x³ (no decide)","x^3"]];
  $("sim").innerHTML=`${casBox()}${presets("o-pre",P)}<div class="calcf"><label for="o-f">Función f(x)<input id="o-f" value="-x^2 + 40x - 100" autocomplete="off" spellcheck="false"></label></div><div id="o-out" class="slv-out"></div>`;
  const TIPO={max:"Máximo (cóncava, ∩)",min:"Mínimo (convexa, ∪)",inconcluso:"La CSO no decide"};
  const run=()=>{const fs=$("o-f").value;let n;
    try{n=NUM.optimize(fs)}catch(e){$("o-out").innerHTML=`<p class="err">Revisa la función: ${esc(String(e.message||e))}</p>`;return}
    const E=exact("optimiza",fs),ok=E&&E.ok,pts=ok?E.pts:n.pts;
    let h=`<div class="stepc"><h4><span class="n">1</span>Condición de primer orden${ok?"":" (aproximada)"}</h4>${TX(`f(x)=${ok?E.f:n.f}`)}${TX(`f'(x)=${ok?E.d1:n.d1}=0`)}
      ${pts.length?`<p>Puntos críticos: ${pts.map(p=>ok?tx("x^*="+p.x):"x* ≈ "+fN(p.xn)).join(", ")}.</p>`:`<div class="verdict warnv">No hay puntos críticos reales${ok?"":" en el intervalo revisado (−1.000 a 1.000)"}.</div>`}</div>`;
    if(pts.length)h+=`<div class="stepc"><h4><span class="n">2</span>Condición de segundo orden</h4>${TX(`f''(x)=${ok?E.d2:n.d2}`)}<div class="tbl"><table><tr><th>x*</th><th>f''(x*)</th><th>Tipo</th><th>f(x*)</th></tr>${pts.map(p=>`<tr><td>${ok?tx(p.x):fN(p.xn)}</td><td>${ok?tx(p.f2):fN(p.f2n)}</td><td class="${p.tipo==="max"?"ok":p.tipo==="min"?"":"bad"}">${TIPO[p.tipo]}</td><td>${ok?tx(p.fx):fN(p.fxn)}</td></tr>`).join("")}</table></div>
      ${pts.some(p=>p.tipo==="inconcluso")?`<p class="hint">Cuando f''(x*) = 0, revisa el signo de f'(x) a la izquierda y a la derecha del punto: si cambia de + a −, es máximo; de − a +, mínimo; si no cambia, es un punto de inflexión.</p>`:""}</div>`;
    if(E&&!E.ok)h+=`<p class="err">SymPy no pudo resolver esta expresión: ${esc(E.error)}</p>`;
    const {f}=NUM.parse(fs),c=pts.length?(ok?pts[0].xn:pts[0].xn):0,xs=pts.map(p=>p.xn),span=xs.length>1?Math.max(15,(Math.max(...xs)-Math.min(...xs))*0.8):15;
    const xr=xs.length>1?[Math.min(...xs)-span*0.5,Math.max(...xs)+span*0.5]:[c-span,c+span];
    h+=plotFn({f,xr,marks:pts.map(p=>({x:p.xn,y:p.fxn,col:p.tipo==="max"?"--good":p.tipo==="min"?"--bad":"--exam",label:p.tipo==="max"?"máx.":p.tipo==="min"?"mín.":""})),label:"Gráfica de la función con sus puntos críticos"}).svg;
    $("o-out").innerHTML=h;typeset($("o-out"))};
  const d=debounce(run,350);$("o-f").addEventListener("input",d);
  bindPresets("o-pre",P,p=>{$("o-f").value=p[1];run()});start(run);
};

// ---- Integrales
SIMS.int=function(){
  const P=[["3x² de 0 a 5","3x^2","0","5"],["100 − 2x de 0 a 20","100 - 2x","0","20"],["x·eˣ de 0 a 1","x e^x","0","1"],["1/x de 1 a e","1/x","1","e"],["√x de 0 a 4","sqrt(x)","0","4"],["e^(−x²) de 0 a 1","e^(-x^2)","0","1"]];
  $("sim").innerHTML=`${casBox()}${presets("i-pre",P)}<div class="calcf"><label for="i-f">Función f(x)<input id="i-f" value="3x^2" autocomplete="off" spellcheck="false"></label><label for="i-a">Límite inferior (a)<input id="i-a" value="0" autocomplete="off"></label><label for="i-b">Límite superior (b)<input id="i-b" value="5" autocomplete="off"></label></div><div id="i-out" class="slv-out"></div>`;
  const run=()=>{const fs=$("i-f").value,as=$("i-a").value,bs=$("i-b").value;let n;
    try{n=NUM.integral(fs,as,bs)}catch(e){$("i-out").innerHTML=`<p class="err">Revisa los datos: ${esc(String(e.message||e))}</p>`;return}
    if(!isFinite(n.a)||!isFinite(n.b)){$("i-out").innerHTML=`<p class="err">Los límites de integración deben ser números (puedes usar e o pi).</p>`;return}
    const E=exact("integra",fs,as,bs),ok=E&&E.ok;
    let h=`<div class="stepc"><h4><span class="n">1</span>Resultado${ok?"":" aproximado"}</h4>${TX(`\\int_{${ok?E.a:fT(n.a)}}^{${ok?E.b:fT(n.b)}}\\left(${ok?E.f:n.f}\\right)dx${ok?"="+E.area:""}`)}<div class="res">${tiles([["Área acumulada",fN(ok&&E.arean!=null?E.arean:n.area)]])}</div></div>`;
    if(ok)h+=`<div class="stepc"><h4><span class="n">2</span>Teorema fundamental del cálculo</h4><p><b>Antiderivada:</b> se integra con las reglas de la tabla y se suma la constante C.</p>${TX(`F(x)=\\int ${E.f}\\,dx=${E.F}+C`)}<p><b>Regla de Barrow:</b> F(b) − F(a).</p>${TX(`F(${E.b})=${E.Fb}\\qquad F(${E.a})=${E.Fa}`)}${TX(`\\int_{${E.a}}^{${E.b}}f(x)\\,dx=\\left[${E.Fb}\\right]-\\left[${E.Fa}\\right]=${E.area}`)}</div>`;
    else if(E&&!E.ok)h+=`<p class="err">${esc(E.error)} El área mostrada es una aproximación numérica.</p>`;
    else h+=`<div class="stepc"><h4><span class="n">2</span>Teorema fundamental del cálculo</h4><p>La antiderivada F(x) y la evaluación F(b) − F(a) aparecen cuando carga el motor exacto. El área de arriba se calculó con la regla de Simpson.</p></div>`;
    const {f}=NUM.parse(fs),w=Math.max(1,n.b-n.a);
    h+=plotFn({f,xr:[n.a-w*0.25,n.b+w*0.25],shade:[n.a,n.b],label:"Área bajo la curva entre a y b"}).svg;
    $("i-out").innerHTML=h;typeset($("i-out"))};
  const d=debounce(run,350);["i-f","i-a","i-b"].forEach(i=>$(i).addEventListener("input",d));
  bindPresets("i-pre",P,p=>{$("i-f").value=p[1];$("i-a").value=p[2];$("i-b").value=p[3];run()});start(run);
};

// ---- Lagrange (Cobb-Douglas)
SIMS.lag=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="ctr">${ctl("g-a","Exponente de x (a)",0.05,2,0.05,0.5)}${ctl("g-b","Exponente de y (b)",0.05,2,0.05,0.5)}${ctl("g-px","Precio de x (pₓ)",0.5,20,0.5,2)}${ctl("g-py","Precio de y (p_y)",0.5,20,0.5,4)}${ctl("g-m","Ingreso (m)",10,500,5,100)}</div>
  <div class="res" id="g-res"></div><div class="legend"><span><i style="background:var(--line)"></i>Restricción presupuestaria</span><span><i style="background:var(--branch)"></i>Curva de indiferencia U = U*</span></div><div id="g-plot"></div><div id="g-steps" class="slv-out"></div>`;
  const run=()=>{const a=V("g-a"),b=V("g-b"),px=V("g-px"),py=V("g-py"),m=V("g-m");if(![a,b,px,py,m].every(v=>isFinite(v)&&v>0)){$("g-res").innerHTML=err("todos los valores deben ser positivos.");return}
    const x=a/(a+b)*m/px,y=b/(a+b)*m/py,U=x**a*y**b,lam=a*U/x/px,Lxx=a*(a-1)*U/x**2,Lyy=b*(b-1)*U/y**2,Lxy=a*b*U/(x*y),det=-px*px*Lyy+2*px*py*Lxy-py*py*Lxx;
    const U1=(a/(a+b)*(m+1)/px)**a*(b/(a+b)*(m+1)/py)**b;
    $("g-res").innerHTML=tiles([["x*",fmt(x,3)],["y*",fmt(y,3)],["Utilidad U*",fmt(U,4)],["λ* (precio sombra)",fmt(lam,4)],["|H̄|",fmt(det,4),det>0?"okt":"badt"]]);
    const X=m/px*1.05,Y=m/py*1.05,ic=t=>t>0?(U/t**a)**(1/b):NaN;
    const fr=frame(600,300,[0,X],[0,Y],ticks(0,X,nice(X/5)),ticks(0,Y,nice(Y/4)),"bien x","bien y");
    let d="";for(let i=1;i<=200;i++){const t=X*i/200,v=ic(t);if(isFinite(v)&&v<Y*1.5)d+=(d?"L":"M")+fr.sx(t).toFixed(1)+","+fr.sy(Math.min(v,Y*1.5)).toFixed(1)}
    $("g-plot").innerHTML=`<div class="plot"><svg viewBox="0 0 600 300" role="img" aria-label="Restricción presupuestaria y curva de indiferencia tangente"><defs><clipPath id="gl"><rect x="${fr.L}" y="${fr.T}" width="${600-fr.L-fr.R}" height="${300-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#gl)"><line x1="${fr.sx(0)}" y1="${fr.sy(m/py)}" x2="${fr.sx(m/px)}" y2="${fr.sy(0)}" stroke="var(--line)" stroke-width="2.5"/><path d="${d}" fill="none" stroke="var(--branch)" stroke-width="2.5"/></g><circle cx="${fr.sx(x)}" cy="${fr.sy(y)}" r="6" fill="var(--ink)" stroke="var(--card)" stroke-width="2"/><text x="${fr.sx(x)+9}" y="${fr.sy(y)-10}" font-size="12" font-weight="600" fill="var(--ink)">(${fmt(x,2)}, ${fmt(y,2)})</text></svg></div>`;
    $("g-steps").innerHTML=stp(1,"Lagrangiano y condiciones de primer orden",TX(`\\mathcal L=x^{${fm(a)}}y^{${fm(b)}}-\\lambda\\,(${fm(px)}x+${fm(py)}y-${fm(m)})`)+TX(`\\mathcal L_x=${fm(a)}\\frac{U}{x}-${fm(px)}\\lambda=0\\qquad \\mathcal L_y=${fm(b)}\\frac{U}{y}-${fm(py)}\\lambda=0\\qquad \\mathcal L_\\lambda=${fm(m)}-${fm(px)}x-${fm(py)}y=0`))+
      stp(2,"Igualar la TMS al precio relativo",TX(`\\frac{${fm(a)}\\,y}{${fm(b)}\\,x}=\\frac{${fm(px)}}{${fm(py)}}\\;\\Longrightarrow\\;${fm(py)}y=${fmt(b/a*px,4)}x`)+TX(`x^*=\\frac{${fm(a)}}{${fm(a+b)}}\\cdot\\frac{${fm(m)}}{${fm(px)}}=${fmt(x,4)}\\qquad y^*=\\frac{${fm(b)}}{${fm(a+b)}}\\cdot\\frac{${fm(m)}}{${fm(py)}}=${fmt(y,4)}`))+
      stp(3,"Condición de segundo orden",TX(`|\\bar H|=\\begin{vmatrix}0&${fm(px)}&${fm(py)}\\\\${fm(px)}&${fmt(Lxx,4)}&${fmt(Lxy,4)}\\\\${fm(py)}&${fmt(Lxy,4)}&${fmt(Lyy,4)}\\end{vmatrix}=${fmt(det,4)}`)+verdict(det<=0,"El determinante no es positivo: no se garantiza un máximo.","|H̄| > 0: el punto es un máximo de la utilidad sujeto al presupuesto."))+
      stp(4,"El multiplicador como precio sombra",`<p>Con un peso más de ingreso, la utilidad pasa de ${fmt(U,4)} a ${fmt(U1,4)}: sube ${fmt(U1-U,4)}, casi exactamente λ* = ${fmt(lam,4)}.</p>`);
    typeset($("g-steps"))};
  bindCtl(["g-a","g-b","g-px","g-py","g-m"],run);run();
};

// ---- Elasticidad (demanda lineal)
SIMS.elas=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="ctr">${ctl("e-A","Demanda máxima (A en Q = A − bP)",10,500,5,100)}${ctl("e-b","Pendiente (b)",0.1,10,0.1,2)}${ctl("e-P","Precio (P)",0,250,0.5,20)}</div><div class="res" id="e-res"></div><div id="e-plot"></div><div class="verdict" id="e-ver"></div><div id="e-step"></div>`;
  const run=()=>{const A=V("e-A"),b=V("e-b"),P=V("e-P");if(!(A>0&&b>0&&P>=0)){$("e-res").innerHTML=err("A y b deben ser positivos.");return}
    const Pm=A/b,Pc=Math.min(P,Pm),Q=A-b*Pc,eps=Q>0?-b*Pc/Q:-Infinity,Pu=A/(2*b);
    $("e-res").innerHTML=tiles([["Cantidad Q",fmt(Q,2)],["dQ/dP",fm(-b)],["Elasticidad ε",isFinite(eps)?fmt(eps,3):"−∞"],["Ingreso P·Q",fmt(Pc*Q,2)]]);
    const fr=frame(600,280,[0,A*1.05],[0,Pm*1.08],ticks(0,A*1.05,nice(A/5)),ticks(0,Pm*1.08,nice(Pm/4)),"cantidad (Q)","precio (P)");
    $("e-plot").innerHTML=`<div class="plot"><svg viewBox="0 0 600 280" role="img" aria-label="Curva de demanda con el punto evaluado y el punto de elasticidad unitaria">${fr.g}<line x1="${fr.sx(0)}" y1="${fr.sy(Pm)}" x2="${fr.sx(A)}" y2="${fr.sy(0)}" stroke="var(--line)" stroke-width="2.5"/><line x1="${fr.sx(0)}" x2="${fr.sx(A)}" y1="${fr.sy(Pu)}" y2="${fr.sy(Pu)}" stroke="var(--muted)" stroke-dasharray="5 4"/><text x="${fr.sx(A)-4}" y="${fr.sy(Pu)-6}" text-anchor="end" font-size="11.5" fill="var(--muted)">|ε| = 1 en P = ${fmt(Pu,2)}</text><text x="${fr.sx(A*0.03)}" y="${fr.sy(Pm*0.9)}" font-size="11.5" fill="var(--muted)">elástica (|ε| &gt; 1)</text><text x="${fr.sx(A*0.62)}" y="${fr.sy(Pm*0.12)}" font-size="11.5" fill="var(--muted)">inelástica (|ε| &lt; 1)</text><circle cx="${fr.sx(Q)}" cy="${fr.sy(Pc)}" r="6" fill="var(--ink)" stroke="var(--card)" stroke-width="2"/></svg></div>`;
    const ve=$("e-ver"),ae=Math.abs(eps);ve.className="verdict "+(Math.abs(ae-1)<0.005?"acc":ae>1?"warnv":"acc");
    ve.textContent=Q<=0?"A ese precio la cantidad demandada es cero.":Math.abs(ae-1)<0.005?"Elasticidad unitaria: el ingreso total está en su máximo.":ae>1?"Demanda elástica: si el precio sube 1 %, la cantidad cae más de 1 % y el ingreso total baja.":"Demanda inelástica: si el precio sube 1 %, la cantidad cae menos de 1 % y el ingreso total sube.";
    $("e-step").innerHTML=Q>0?stp(1,"Cálculo",TX(`\\varepsilon=\\frac{dQ}{dP}\\cdot\\frac{P}{Q}=(-${fm(b)})\\cdot\\frac{${fm(Pc)}}{${fmt(Q,2)}}=${fmt(eps,3)}`)):"";typeset($("e-step"))};
  bindCtl(["e-A","e-b","e-P"],run);run();
};

// ---- Excedentes
SIMS.exc=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="ctr">${ctl("x-a","Intercepto de la demanda (a en P = a − bQ)",10,300,1,100)}${ctl("x-b","Pendiente de la demanda (b)",0.1,10,0.1,2)}${ctl("x-c","Intercepto de la oferta (c en P = c + dQ)",0,200,1,10)}${ctl("x-d","Pendiente de la oferta (d)",0.1,10,0.1,1)}</div>
  <div class="res" id="x-res"></div><div class="legend"><span><i style="background:var(--line);opacity:.5;height:10px"></i>Excedente del consumidor</span><span><i style="background:var(--branch);opacity:.5;height:10px"></i>Excedente del productor</span></div><div id="x-plot"></div><div id="x-step"></div>`;
  const run=()=>{const a=V("x-a"),b=V("x-b"),c=V("x-c"),d=V("x-d");if(!(b>0&&d>0)||!(a>c)){$("x-res").innerHTML=err("las pendientes deben ser positivas y el intercepto de la demanda mayor que el de la oferta.");return}
    const Q=(a-c)/(b+d),P=a-b*Q,EC=0.5*(a-P)*Q,EP=0.5*(P-c)*Q;
    $("x-res").innerHTML=tiles([["Q*",fmt(Q,3)],["P*",fmt(P,3)],["Excedente del consumidor",fmt(EC,2)],["Excedente del productor",fmt(EP,2)],["Excedente total",fmt(EC+EP,2)]]);
    const Xm=Math.min(a/b,Q*2)*1.05,Ym=a*1.05,fr=frame(600,300,[0,Xm],[0,Ym],ticks(0,Xm,nice(Xm/5)),ticks(0,Ym,nice(Ym/4)),"cantidad (Q)","precio (P)"),pt=(x,y)=>`${fr.sx(x).toFixed(1)},${fr.sy(y).toFixed(1)}`;
    $("x-plot").innerHTML=`<div class="plot"><svg viewBox="0 0 600 300" role="img" aria-label="Oferta y demanda con los excedentes sombreados"><defs><clipPath id="xl"><rect x="${fr.L}" y="${fr.T}" width="${600-fr.L-fr.R}" height="${300-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#xl)"><polygon points="${pt(0,a)} ${pt(Q,P)} ${pt(0,P)}" fill="var(--line)" fill-opacity=".3"/><polygon points="${pt(0,P)} ${pt(Q,P)} ${pt(0,c)}" fill="var(--branch)" fill-opacity=".35"/><line x1="${fr.sx(0)}" y1="${fr.sy(a)}" x2="${fr.sx(Xm)}" y2="${fr.sy(a-b*Xm)}" stroke="var(--line)" stroke-width="2.5"/><line x1="${fr.sx(0)}" y1="${fr.sy(c)}" x2="${fr.sx(Xm)}" y2="${fr.sy(c+d*Xm)}" stroke="var(--branch)" stroke-width="2.5"/></g><circle cx="${fr.sx(Q)}" cy="${fr.sy(P)}" r="6" fill="var(--ink)" stroke="var(--card)" stroke-width="2"/><text x="${fr.sx(Q)+9}" y="${fr.sy(P)-9}" font-size="12" font-weight="600" fill="var(--ink)">(${fmt(Q,2)}, ${fmt(P,2)})</text></svg></div>`;
    $("x-step").innerHTML=stp(1,"Con integrales",TX(`EC=\\int_0^{${fmt(Q,3)}}\\big(${fm(a)}-${fm(b)}Q-${fmt(P,3)}\\big)dQ=${fmt(EC,2)}`)+TX(`EP=\\int_0^{${fmt(Q,3)}}\\big(${fmt(P,3)}-${fm(c)}-${fm(d)}Q\\big)dQ=${fmt(EP,2)}`)+`<p>Con curvas lineales cada integral es el área de un triángulo: base Q* por altura, dividido entre 2.</p>`);typeset($("x-step"))};
  bindCtl(["x-a","x-b","x-c","x-d"],run);run();
};

// ---- Formulario
SIMS.form=function(){MAT_RUN=null;
  const F=[["Álgebra","Producto de potencias","x^a · x^b = x^(a+b)"],["Álgebra","Cociente de potencias","x^a / x^b = x^(a−b)"],["Álgebra","Potencia de potencia","(x^a)^b = x^(ab)"],["Álgebra","Exponente negativo","x^(−a) = 1/x^a"],["Álgebra","Raíz como exponente","ⁿ√(x^a) = x^(a/n)"],
    ["Logaritmos","Producto","ln(xy) = ln x + ln y"],["Logaritmos","Cociente","ln(x/y) = ln x − ln y"],["Logaritmos","Potencia","ln(x^a) = a ln x"],["Logaritmos","Inversa","ln(e^x) = x"],
    ["Derivadas","Potencia","d/dx xⁿ = n xⁿ⁻¹"],["Derivadas","Exponencial","d/dx eˣ = eˣ"],["Derivadas","Logaritmo","d/dx ln x = 1/x"],["Derivadas","Producto","(fg)' = f'g + fg'"],["Derivadas","Cociente","(f/g)' = (f'g − fg')/g²"],["Derivadas","Cadena","f(g(x))' = f'(g(x)) g'(x)"],
    ["Optimización","Primer orden","f'(x*) = 0"],["Optimización","Segundo orden","f''(x*) < 0 máximo; > 0 mínimo"],["Optimización","Lagrangiano","L = f(x,y) − λ(g(x,y) − c)"],["Optimización","Cobb-Douglas","x* = a/(a+b) · m/pₓ"],
    ["Integrales","Potencia","∫ xⁿ dx = xⁿ⁺¹/(n+1) + C"],["Integrales","Logarítmica","∫ 1/x dx = ln|x| + C"],["Integrales","Exponencial","∫ eˣ dx = eˣ + C"],["Integrales","Barrow","∫ₐᵇ f dx = F(b) − F(a)"],["Integrales","Por partes","∫ u dv = uv − ∫ v du"],["Integrales","Excedente del consumidor","EC = ∫₀^Q* (D(Q) − P*) dQ"],
    ["Elasticidad","Elasticidad precio","ε = (dQ/dP)(P/Q)"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: cadena"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));
    $("h-t").innerHTML=`<tr><th>Tema</th><th>Regla</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run();
};
