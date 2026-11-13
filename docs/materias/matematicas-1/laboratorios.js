// Matemáticas I · calculadoras (SymPy con Pyodide y respaldo numérico)
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

// ---------- Tooltips: qué significa cada variable de los laboratorios
(function(){const T={
 "g-a":"<b>Exponente de x</b> en f = xᵃ·yᵇ.","g-b":"<b>Exponente de y</b> en f = xᵃ·yᵇ.","g-px":"<b>Precio de x</b> en la restricción pₓx + p_y·y = m.","g-py":"<b>Precio de y.</b>","g-m":"<b>Ingreso</b>: lado derecho de la restricción. El multiplicador λ mide cuánto sube el óptimo si m sube en 1.",
 "e-A":"<b>Demanda máxima</b>: lo que se compra con precio cero.","e-b":"<b>Pendiente de la demanda.</b>","e-P":"<b>Precio</b> en el que se calcula la elasticidad ε = −b·P/Q. En la demanda lineal, la elasticidad cambia a lo largo de la recta.",
 "x-a":"<b>Intercepto de la demanda</b> P = a − bQ: el precio máximo que alguien pagaría.","x-b":"<b>Pendiente de la demanda.</b>","x-c":"<b>Intercepto de la oferta</b> P = c + dQ: el precio mínimo al que alguien vende.","x-d":"<b>Pendiente de la oferta.</b> Los excedentes son áreas (integrales) entre estas curvas y el precio de equilibrio.",
 "tr-a":"<b>Estiramiento vertical</b> en a·f(b(x − h)) + k: si |a| > 1 estira, si |a| < 1 aplana, si a < 0 refleja.","tr-bb":"<b>Compresión horizontal</b>: si |b| > 1 comprime hacia el eje y.","tr-h":"<b>Traslación horizontal</b>: h > 0 mueve la gráfica a la derecha.","tr-k":"<b>Traslación vertical</b>: k > 0 la sube.",
 "tc-t":"<b>Ángulo en grados</b> sobre el círculo unitario: el coseno es la coordenada x y el seno la y.","cc-A":"<b>Amplitud</b>: qué tan grande es la oscilación (picos y valles).","cc-p":"<b>Período</b>: cada cuánto se repite el ciclo.","cc-f":"<b>Fase</b>: desplaza el ciclo en el tiempo.","cc-c":"<b>Nivel</b> alrededor del cual oscila.",
 "ta-h":"<b>Distancia h</b> entre los dos puntos de la secante. Cuando h → 0, la secante se convierte en la tangente: su pendiente es la derivada.",
 "rm-n":"<b>Número de rectángulos.</b> Con más rectángulos, la suma de Riemann se acerca a la integral.","ni-n":"<b>Número de subintervalos.</b> Simpson exige que sea par y converge más rápido que los trapecios.",
 "cr-k":"<b>Tasa de crecimiento</b> continua por período en y = y₀·e^(kt). Negativa, decrecimiento.","ty-n":"<b>Grado del polinomio de Taylor.</b> Más grado, mejor aproximación cerca del punto."};
 window.CTL_TIPS=Object.assign(window.CTL_TIPS||{},T)})();


// ===================== HERRAMIENTAS COMUNES DE MATEMÁTICAS I, II Y III =====================
const okAll=a=>a.every(x=>isFinite(x)),n2=v=>fmt(v,2),n4=v=>fmt(v,4);
const tabsBox=(id,opts)=>`<div style="margin-bottom:10px">${seg(id,"Herramienta",opts,opts[0][0])}</div><div id="${id}-b"></div>`;
function tabsRun(id,M){const go=k=>M[k]();bindSeg(id,go);go(Object.keys(M)[0])}
const nin=(id,l,v,st)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" ${st?`step="${st}"`:""} inputmode="decimal"></label>`;
const N=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",",".")):NaN};
const onIn=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});

const curId=()=>{try{return decodeURIComponent(location.hash.slice(1))||TRUNK[0].id}catch(e){return""}};
const espera=()=>CAS.state==="error"?`<p class="hint">Este cálculo necesita el motor exacto (SymPy), que no se pudo cargar en esta vista. En el sitio publicado funciona.</p>`:`<p class="hint">Calculando con el motor exacto… la primera vez tarda unos segundos.</p>`;
const casErr=E=>`<p class="err">SymPy no pudo con esta expresión: ${esc(E.error||"")}. Revisa la escritura: usa * o espacios para multiplicar y ^ para potencias.</p>`;
const inp=(id,l,v,w)=>`<label for="${id}">${l}<input id="${id}" value="${v}" autocomplete="off" spellcheck="false"${w?` style="font-family:var(--f-mono)"`:""}></label>`;
const ival=id=>$(id).value.trim();
const pfx=s=>{try{return NUM.parse(s).f}catch(e){return null}};
const stc=(k,t,b)=>`<div class="stepc"><h4><span class="n">${k}</span>${t}</h4>${b}</div>`;
const fx=v=>fN(v);
// varias funciones en un mismo gráfico
function plotFns({fs,xr,yr=null,marks=[],extra=[],xl="x",yl="y",H=280,label,cols}){
  const W=600,N=400,all=[];const xs=[...Array(N+1)].map((_,i)=>xr[0]+(xr[1]-xr[0])*i/N);const Y=fs.map(f=>xs.map(x=>{const v=f(x);if(isFinite(v))all.push(v);return v}));
  let lo,hi;if(yr){[lo,hi]=yr}else{const s=all.slice().sort((a,b)=>a-b);lo=s.length?s[Math.floor(s.length*.03)]:-1;hi=s.length?s[Math.floor(s.length*.97)]:1;lo=Math.min(lo,0);hi=Math.max(hi,0);const p=(hi-lo||1)*.12;lo-=p;hi+=p}
  const fr=frame(W,H,xr,[lo,hi],ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(lo,hi,nice((hi-lo)/4)),xl,yl),id="mx"+(++CLIP);let b=extra.map(e=>typeof e==="function"?e(fr):e).join("");
  b+=`<line x1="${fr.L}" x2="${W-fr.R}" y1="${fr.sy(0)}" y2="${fr.sy(0)}" stroke="var(--muted)" stroke-width="1"/>`;if(xr[0]<0&&xr[1]>0)b+=`<line y1="${fr.T}" y2="${H-fr.B}" x1="${fr.sx(0)}" x2="${fr.sx(0)}" stroke="var(--muted)" stroke-width="1"/>`;
  const C=cols||["--line","--exam","--good","--branch","--ink"];
  Y.forEach((ys,k)=>{let d="",pen=false;xs.forEach((x,i)=>{const v=ys[i];if(!isFinite(v)||v<lo-(hi-lo)*3||v>hi+(hi-lo)*3){pen=false;return}if(pen&&Math.abs(v-ys[i-1])>(hi-lo)*1.5)pen=false;d+=(pen?"L":"M")+fr.sx(x).toFixed(1)+","+fr.sy(v).toFixed(1);pen=true});
    b+=`<path d="${d}" fill="none" stroke="var(${C[k%C.length]})" stroke-width="2.4"/>`});
  let p="";marks.forEach(m=>{if(!isFinite(m.x)||!isFinite(m.y))return;const x=fr.sx(m.x),y=fr.sy(m.y),anc=x>W*.7?"end":"start";p+=`<circle cx="${x}" cy="${y}" r="5" fill="${m.hollow?"var(--card)":`var(${m.col||"--ink"})`}" stroke="var(${m.col||"--ink"})" stroke-width="2.2"/>${m.label?`<text x="${x+(anc==="end"?-8:8)}" y="${y-9}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${m.col||"--ink"})">${esc(m.label)}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfica"}"><defs><clipPath id="${id}"><rect x="${fr.L}" y="${fr.T}" width="${W-fr.L-fr.R}" height="${H-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const leg=it=>`<div class="legend">${it.map(([c,t])=>`<span><i style="background:var(${c})"></i>${t}</span>`).join("")}</div>`;
// presets por estación
const presetsFor=(map,def)=>map[curId()]||map[def];
// Hoja de fórmulas común
SIMS.hojaf=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: cadena"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=FORMULAS.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Regla</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
// curvas de nivel G(x,y) = c por cuadrados marchantes
function contour(G,xr,yr,level,fr,col="--line",w=2.2,Nx=110,Ny=90){const dx=(xr[1]-xr[0])/Nx,dy=(yr[1]-yr[0])/Ny,v=[];for(let j=0;j<=Ny;j++){const r=[];for(let i=0;i<=Nx;i++){const z=G(xr[0]+i*dx,yr[0]+j*dy);r.push(isFinite(z)?z-level:NaN)}v.push(r)}
  let d="";const P=(x,y)=>`${fr.sx(x).toFixed(1)},${fr.sy(y).toFixed(1)}`;
  for(let j=0;j<Ny;j++)for(let i=0;i<Nx;i++){const a=v[j][i],b=v[j][i+1],c=v[j+1][i+1],e=v[j+1][i];if([a,b,c,e].some(isNaN))continue;const x0=xr[0]+i*dx,y0=yr[0]+j*dy,pts=[];
    const ed=(p,q,xa,ya,xb,yb)=>{if((p<0)!==(q<0)){const t=p/(p-q);pts.push([xa+t*(xb-xa),ya+t*(yb-ya)])}};ed(a,b,x0,y0,x0+dx,y0);ed(b,c,x0+dx,y0,x0+dx,y0+dy);ed(c,e,x0+dx,y0+dy,x0,y0+dy);ed(e,a,x0,y0+dy,x0,y0);
    for(let k=0;k+1<pts.length;k+=2)d+=`M${P(...pts[k])}L${P(...pts[k+1])}`}
  return `<path d="${d}" fill="none" stroke="var(${col})" stroke-width="${w}" stroke-linecap="round"/>`}
function plotXYc({xr,yr,draw,label,xl="x",yl="y",H=320,marks=[]}){const W=600,fr=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/5)),xl,yl),id="mc"+(++CLIP);
  let b=`<line x1="${fr.L}" x2="${W-fr.R}" y1="${fr.sy(0)}" y2="${fr.sy(0)}" stroke="var(--muted)" stroke-width="1"/>`;if(xr[0]<0&&xr[1]>0)b+=`<line y1="${fr.T}" y2="${H-fr.B}" x1="${fr.sx(0)}" x2="${fr.sx(0)}" stroke="var(--muted)" stroke-width="1"/>`;b+=draw(fr);
  let p="";marks.forEach(m=>{if(!isFinite(m.x)||!isFinite(m.y))return;const x=fr.sx(m.x),y=fr.sy(m.y);p+=`<circle cx="${x}" cy="${y}" r="5" fill="var(${m.col||"--ink"})"/>${m.label?`<text x="${x+8}" y="${y-8}" font-size="12" font-weight="600" fill="var(${m.col||"--ink"})">${esc(m.label)}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfica"}"><defs><clipPath id="${id}"><rect x="${fr.L}" y="${fr.T}" width="${W-fr.L-fr.R}" height="${H-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const pf2=s=>{try{const c=math.parse(NUM.src(s)).compile();return(x,y)=>{try{const v=c.evaluate({x,y});return typeof v==="number"?v:NaN}catch(e){return NaN}}}catch(e){return null}};


// ===================== LABORATORIOS DE MATEMÁTICAS I =====================
const absify=s=>{s=String(s);for(let i=0;i<4;i++){const t=s.replace(/\|([^|]+)\|/g,"abs($1)");if(t===s)break;s=t}return s.replace(/sen\(/g,"sin(").replace(/\bAbs\(/g,"abs(").replace(/−/g,"-")};
const pfa=s=>pfx(absify(s));

// ---------- Tablas de verdad
SIMS.verdad=function(){MAT_RUN=null;
  const EJ=[["Modus ponens","(p ∧ (p → q)) → q"],["De Morgan","¬(p ∧ q) ↔ (¬p ∨ ¬q)"],["Contradicción","p ∧ ¬p"],["Contrarrecíproca","(p → q) ↔ (¬q → ¬p)"],["Tres variables","(p ∨ q) ∧ ¬r"]];
  $("sim").innerHTML=`${presets("tv-pre",EJ)}<div class="calcf"><label for="tv-f">Fórmula (usa p, q, r, s; ¬ ∧ ∨ → ↔ o también ~ &amp; | -&gt; &lt;-&gt;)<input id="tv-f" value="(p ∧ (p → q)) → q" autocomplete="off" spellcheck="false" style="font-family:var(--f-mono)"></label></div><div class="chips pre" id="tv-k"><span class="lbl">Insertar</span>${["¬","∧","∨","→","↔","(",")","p","q","r"].map(c=>`<button type="button" data-c="${c}">${c}</button>`).join("")}</div><div class="res" id="tv-res"></div><div id="tv-o"></div>`;
  const tok=s=>{s=s.replace(/<->|<=>/g,"↔").replace(/->|=>/g,"→").replace(/[~!]/g,"¬").replace(/&/g,"∧").replace(/\|/g,"∨").replace(/\bno\b/g,"¬").replace(/\by\b/g,"∧").replace(/\bo\b/g,"∨");const t=[];for(const ch of s){if(/\s/.test(ch))continue;if(/[pqrs¬∧∨→↔()]/.test(ch))t.push(ch);else throw new Error(`símbolo no reconocido «${ch}»`)}return t};
  const parse=t=>{let i=0;const pk=()=>t[i],nx=()=>t[i++];
    const prim=()=>{const c=nx();if(c==="¬")return{op:"¬",a:prim()};if(c==="("){const e=bic();if(nx()!==")")throw new Error("falta un paréntesis");return e}if(/[pqrs]/.test(c||""))return{v:c};throw new Error("fórmula incompleta")};
    const and=()=>{let e=prim();while(pk()==="∧"){nx();e={op:"∧",a:e,b:prim()}}return e};const or=()=>{let e=and();while(pk()==="∨"){nx();e={op:"∨",a:e,b:and()}}return e};
    const imp=()=>{const e=or();if(pk()==="→"){nx();return{op:"→",a:e,b:imp()}}return e};const bic=()=>{let e=imp();while(pk()==="↔"){nx();e={op:"↔",a:e,b:imp()}}return e};
    const r=bic();if(i<t.length)throw new Error("sobran símbolos");return r};
  const ev=(e,s)=>e.v?s[e.v]:e.op==="¬"?!ev(e.a,s):e.op==="∧"?ev(e.a,s)&&ev(e.b,s):e.op==="∨"?ev(e.a,s)||ev(e.b,s):e.op==="→"?!ev(e.a,s)||ev(e.b,s):ev(e.a,s)===ev(e.b,s);
  const str=e=>e.v?e.v:e.op==="¬"?"¬"+str(e.a):`(${str(e.a)} ${e.op} ${str(e.b)})`;
  const subs=(e,acc=[])=>{if(e.v)return acc;subs(e.a,acc);if(e.b)subs(e.b,acc);acc.push(e);return acc};
  const run=()=>{let E;try{E=parse(tok($("tv-f").value))}catch(e){$("tv-res").innerHTML=err(e.message);$("tv-o").innerHTML="";return}
    const vars=[..."pqrs"].filter(v=>$("tv-f").value.includes(v)||JSON.stringify(E).includes(`"${v}"`)),S=subs(E),rows=[];
    for(let m=(1<<vars.length)-1;m>=0;m--){const s={};vars.forEach((v,i)=>s[v]=!!(m>>(vars.length-1-i)&1));rows.push({s,vals:S.map(e=>ev(e,s))})}
    const fin=rows.map(r=>r.vals[r.vals.length-1]),tipo=fin.every(Boolean)?"tautología":fin.every(v=>!v)?"contradicción":"contingencia";
    $("tv-res").innerHTML=tiles([["Variables",vars.join(", ")],["Filas",String(rows.length)],["Clasificación",tipo,tipo==="tautología"?"okt":tipo==="contradicción"?"badt":""]]);
    const V=b=>b?"V":"F";$("tv-o").innerHTML=stc(1,"Tabla de verdad",`<div class="tbl"><table><tr>${vars.map(v=>`<th>${v}</th>`).join("")}${S.map((e,i)=>`<th style="${i===S.length-1?"background:var(--hl)":""}">${str(e).replace(/^\((.*)\)$/,"$1")}</th>`).join("")}</tr>${rows.map(r=>`<tr>${vars.map(v=>`<td>${V(r.s[v])}</td>`).join("")}${r.vals.map((b,i)=>`<td style="${i===S.length-1?"font-weight:700":""}">${V(b)}</td>`).join("")}</tr>`).join("")}</table></div><p class="hint">Se evalúa de adentro hacia afuera: primero ¬, luego ∧, ∨, → y ↔.</p>`)};
  $("tv-f").addEventListener("input",run);$("tv-k").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const el=$("tv-f"),p=el.selectionStart??el.value.length;el.value=el.value.slice(0,p)+b.dataset.c+el.value.slice(el.selectionEnd??p);el.focus();run()});
  bindPresets("tv-pre",EJ,p=>{$("tv-f").value=p[1];run()});run()};

// ---------- Conjuntos
SIMS.conj=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="calcf">${inp("cj-u","Universo U (elementos separados por coma; también 1..20)","1..15")}${inp("cj-a","A","1, 2, 3, 4, 5, 6")}${inp("cj-b","B","4, 5, 6, 7, 8")}${inp("cj-c","C (opcional)","2, 4, 6, 8, 10, 12")}</div><div class="res" id="cj-res"></div><div id="cj-g"></div><div id="cj-o"></div>`;
  const rd=s=>{s=s.trim();const m=s.match(/^(-?\d+)\s*\.\.\s*(-?\d+)$/);if(m){const a=+m[1],b=+m[2];return[...Array(Math.max(0,b-a+1))].map((_,i)=>String(a+i))}return[...new Set(s.split(/[,;]/).map(x=>x.trim()).filter(Boolean))]};
  const run=()=>{const U=rd(ival("cj-u")),A=rd(ival("cj-a")),B=rd(ival("cj-b")),C=rd(ival("cj-c")),hc=C.length>0;const fuera=[...A,...B,...C].filter(x=>!U.includes(x));
    const has=(S,x)=>S.includes(x),un=(X,Y)=>[...new Set([...X,...Y])],it=(X,Y)=>X.filter(x=>Y.includes(x)),df=(X,Y)=>X.filter(x=>!Y.includes(x)),co=X=>U.filter(x=>!X.includes(x)),sh=X=>X.length?`{${X.join(", ")}}`:"∅";
    $("cj-res").innerHTML=fuera.length?err(`hay elementos fuera del universo: ${fuera.join(", ")}`):tiles([["|A|",String(A.length)],["|B|",String(B.length)],["|A ∪ B|",String(un(A,B).length)],["|A ∩ B|",String(it(A,B).length)]]);
    const ops=[["A ∪ B",un(A,B)],["A ∩ B",it(A,B)],["A − B",df(A,B)],["B − A",df(B,A)],["Aᶜ",co(A)],["(A ∪ B)ᶜ",co(un(A,B))],["Aᶜ ∩ Bᶜ",it(co(A),co(B))],...(hc?[["A ∩ B ∩ C",it(it(A,B),C)],["A ∪ B ∪ C",un(un(A,B),C)],["(A ∩ B) − C",df(it(A,B),C)]]:[])];
    // diagrama de Venn
    const W=600,H=340,cs=hc?[[245,125,"A"],[355,125,"B"],[300,212,"C"]]:[[250,170,"A"],[350,170,"B"]],r=hc?86:110,reg=x=>[has(A,x),has(B,x),hc&&has(C,x)];
    const pos={"100":hc?[205,105]:[200,170],"010":hc?[395,105]:[400,170],"001":[300,270],"110":hc?[300,100]:[300,170],"101":[255,195],"011":[345,195],"111":[300,162],"000":[60,40]};
    const grp={};U.forEach(x=>{const k=reg(x).map(b=>b?1:0).join("");(grp[k]=grp[k]||[]).push(x)});
    const svg=`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Diagrama de Venn"><rect x="10" y="10" width="${W-20}" height="${H-20}" rx="12" fill="none" stroke="var(--muted)"/><text x="24" y="32" font-size="13" fill="var(--muted)">U</text>${cs.map(([x,y,l],i)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="var(${["--line","--exam","--good"][i]})" fill-opacity=".14" stroke="var(${["--line","--exam","--good"][i]})" stroke-width="2"/><text x="${x+(i===0?-r+10:i===1?r-24:-5)}" y="${y+(i===2?r-8:-r+22)}" font-size="15" font-weight="700" fill="var(${["--line","--exam","--good"][i]})">${l}</text>`).join("")}${Object.entries(grp).map(([k,v])=>{const p=pos[hc?k:k.slice(0,2)+"0"];if(!p)return"";return`<text x="${p[0]}" y="${p[1]}" font-size="12.5" text-anchor="${k==="000"?"start":"middle"}" fill="var(--ink)">${esc(v.slice(0,8).join(", ")+(v.length>8?"…":""))}</text>`}).join("")}</svg></div>`;
    $("cj-g").innerHTML=fuera.length?"":svg;
    $("cj-o").innerHTML=stc(1,"Operaciones",`<div class="tbl"><table><tr><th>Operación</th><th>Resultado</th><th>Cardinal</th></tr>${ops.map(([n,S])=>`<tr><td>${n}</td><td>${sh(S)}</td><td>${S.length}</td></tr>`).join("")}</table></div><p class="hint">Comprueba De Morgan: (A ∪ B)ᶜ y Aᶜ ∩ Bᶜ dan lo mismo. Principio de inclusión-exclusión: |A ∪ B| = |A| + |B| − |A ∩ B| = ${A.length} + ${B.length} − ${it(A,B).length} = ${un(A,B).length}.</p>`)};
  onIn(["cj-u","cj-a","cj-b","cj-c"],run);run()};

// ---------- Álgebra con SymPy
SIMS.alg=function(){
  const OPS=[["factorizar","Factorizar"],["expandir","Expandir"],["simplificar","Simplificar"],["dividir","Dividir polinomios"],["residuo","Residuo y factor"],["parciales","Fracciones parciales"]];
  const P={factorizar:["x^3 - 6x^2 + 11x - 6","x^4 - 16","6x^2 + x - 2","x^3 + 8"],expandir:["(2x - 3)^3","(x + 1)(x - 1)(x^2 + 1)"],simplificar:["(x^2 - 9)/(x^2 + 6x + 9)","(x^(1/2) x^(3/2))/x"],dividir:["2x^3 - 3x^2 + x - 5"],residuo:["x^3 - 6x^2 + 11x - 6"],parciales:["(3x + 5)/((x - 1)(x + 2))","(x + 2)/(x^2 (x - 1))","1/(x (x^2 + 1))"]};
  let op="factorizar";
  $("sim").innerHTML=`${casBox()}<div style="margin:8px 0">${seg("al-op","Operación",OPS,"factorizar")}</div><div id="al-pre"></div><div class="calcf">${inp("al-f","Expresión en x","x^3 - 6x^2 + 11x - 6",1)}<span id="al-gbox" hidden>${inp("al-g","Divisor","x - 2",1)}</span><span id="al-abox" hidden>${inp("al-a","Valor a (divisor x − a)","2",1)}</span></div><div id="al-o" class="slv-out"></div>`;
  const pres=()=>{$("al-pre").innerHTML=`<div class="chips pre" id="al-ch"><span class="lbl">Ejemplos</span>${P[op].map((p,i)=>`<button type="button" data-i="${i}">${esc(p)}</button>`).join("")}</div>`;$("al-ch").addEventListener("click",e=>{const b=e.target.closest("button");if(b){$("al-f").value=P[op][+b.dataset.i];run()}})};
  const sint=(fs,a)=>{try{const R=math.rationalize(NUM.src(fs),{},true),c=R.coefficients.slice().reverse();if(!c.length)return"";const q=[c[0]];for(let i=1;i<c.length;i++)q.push(c[i]+a*q[i-1]);const r=q.pop();
    return stc(3,"División sintética entre x − ("+fx(a)+")",`<div class="tbl"><table><tr><td>${fx(a)}</td>${c.map(v=>`<td>${fx(v)}</td>`).join("")}</tr><tr><td></td><td></td>${q.map(v=>`<td>${fx(v*a)}</td>`).join("")}</tr><tr><td></td>${q.map(v=>`<td><b>${fx(v)}</b></td>`).join("")}<td><b>${fx(r)}</b></td></tr></table></div><p class="hint">Se baja el primer coeficiente, se multiplica por a y se suma al siguiente. La última fila da los coeficientes del cociente y el residuo (${fx(r)}).</p>`)}catch(e){return""}};
  const run=()=>{$("al-gbox").hidden=op!=="dividir";$("al-abox").hidden=op!=="residuo";const fs=ival("al-f"),E=exact("algebra",op,fs,ival("al-g"),ival("al-a"));
    if(!E){$("al-o").innerHTML=espera();typeset($("al-o"));return}if(!E.ok){$("al-o").innerHTML=casErr(E);return}let h="";
    if(op==="dividir")h=stc(1,"División",`${TX(`\\frac{${E.f}}{${E.g}}=${E.q}+\\frac{${E.r}}{${E.g}}`)}<p>Cociente: ${tx(E.q)}; residuo: ${tx(E.r)}. ${E.rz?"El divisor es factor del polinomio.":""}</p>`)+(/^x\s*[-+]\s*[\d.]+$/.test(ival("al-g").replace(/\s/g,""))?sint(fs,-Number(ival("al-g").replace(/\s/g,"").replace(/^x/,""))):"");
    else if(op==="residuo")h=stc(1,"Teorema del residuo",`${TX(`P(${E.a})=${E.v}`)}<p>${E.cero?`P(${tx(E.a)}) = 0, así que (x − ${tx(E.a)}) es un factor.`:`El residuo de dividir entre x − ${tx(E.a)} es ${tx(E.v)}: no es factor.`}</p>`)+stc(2,"Raíces racionales y factorización",`<p>Raíces racionales: ${E.raices.length?E.raices.map(tx).join(", "):"ninguna"}.</p>${TX(`P(x)=${E.fac}`)}<p class="hint">Teorema de la raíz racional: los candidatos son ±(divisores del término independiente)/(divisores del coeficiente principal).</p>`)+sint(fs,Number(ival("al-a")));
    else h=stc(1,OPS.find(o=>o[0]===op)[1],`${TX(`${E.f}\\;=\\;${E.r}`)}${op==="parciales"?`<p class="hint">Cada factor lineal (x − a) del denominador aporta un término A/(x − a); uno repetido aporta A/(x − a) + B/(x − a)²; uno cuadrático irreducible aporta (Ax + B)/(x² + …).</p>`:""}`);
    $("al-o").innerHTML=h;typeset($("al-o"))};
  bindSeg("al-op",v=>{op=v;$("al-f").value=P[v][0];pres();run()});const d=debounce(run,400);["al-f","al-g","al-a"].forEach(i=>$(i).addEventListener("input",d));pres();start(run)};

// ---------- Geometría analítica
SIMS.geo=function(){MAT_RUN=null;
  $("sim").innerHTML=tabsBox("ge",[["pt","Puntos y rectas"],["con","Cónicas"]]);const B=$("ge-b");
  tabsRun("ge",{
   pt(){B.innerHTML=`<div class="calcf">${nin("gp-x1","x₁",1)}${nin("gp-y1","y₁",2)}${nin("gp-x2","x₂",5)}${nin("gp-y2","y₂",8)}</div><div class="res" id="gp-res"></div><div id="gp-g"></div><div id="gp-o"></div>`;
    const run=()=>{const[x1,y1,x2,y2]=["gp-x1","gp-y1","gp-x2","gp-y2"].map(N);if(![x1,y1,x2,y2].every(isFinite))return;const d=Math.hypot(x2-x1,y2-y1),mx=(x1+x2)/2,my=(y1+y2)/2,vert=Math.abs(x2-x1)<1e-12,m=vert?NaN:(y2-y1)/(x2-x1),b=y1-m*x1,mp=vert?0:m===0?NaN:-1/m;
      $("gp-res").innerHTML=tiles([["Distancia",fx(d)],["Punto medio",`(${fx(mx)}, ${fx(my)})`],["Pendiente",vert?"no definida":fx(m)],["Recta",vert?`x = ${fx(x1)}`:`y = ${fx(m)}x ${b<0?"−":"+"} ${fx(Math.abs(b))}`,"okt"]]);
      const lo=Math.min(x1,x2)-3,hi=Math.max(x1,x2)+3;
      $("gp-g").innerHTML=plotFns({fs:[x=>vert?NaN:m*x+b,x=>vert?my:isFinite(mp)?my+mp*(x-mx):NaN],xr:[lo,hi],marks:[{x:x1,y:y1,label:"P₁"},{x:x2,y:y2,label:"P₂"},{x:mx,y:my,label:"M",col:"--good"}],label:"Recta y perpendicular por el punto medio"})+leg([["--line","Recta por P₁ y P₂"],["--exam","Mediatriz (perpendicular por M)"]]);
      $("gp-o").innerHTML=stc(1,"Cálculos",`<div class="eq al">d = √((${fx(x2)} − ${fx(x1)})² + (${fx(y2)} − ${fx(y1)})²) = ${fx(d)}<br>m = (${fx(y2)} − ${fx(y1)})/(${fx(x2)} − ${fx(x1)}) = ${vert?"no definida":fx(m)}<br>${vert?"":`y − ${fx(y1)} = ${fx(m)}(x − ${fx(x1)}) ⟹ y = ${fx(m)}x ${b<0?"−":"+"} ${fx(Math.abs(b))}<br>Perpendicular: m₂ = −1/m = ${isFinite(mp)?fx(mp):"no definida (recta vertical)"}`}</div>`)};
    onIn(["gp-x1","gp-y1","gp-x2","gp-y2"],run);run()},
   con(){B.innerHTML=`<p class="hint">Ax² + Cy² + Dx + Ey + F = 0</p><div class="calcf">${nin("gc-a","A",1)}${nin("gc-c","C",1)}${nin("gc-d","D",-4)}${nin("gc-e","E",6)}${nin("gc-f","F",-3)}</div><div class="res" id="gc-res"></div><div id="gc-g"></div><div id="gc-o"></div>`;
    const run=()=>{const[A,C,D,E,F]=["gc-a","gc-c","gc-d","gc-e","gc-f"].map(N);if(![A,C,D,E,F].every(isFinite))return;let tipo,info="",h=0,k=0;
      if(A&&C){h=-D/(2*A);k=-E/(2*C);const R=-F+A*h*h+C*k*k;if(A===C){tipo=R>0?"circunferencia":R===0?"un punto":"sin gráfica real";info=R>0?`(x − ${fx(h)})² + (y − ${fx(k)})² = ${fx(R/A)}: centro (${fx(h)}, ${fx(k)}), radio ${fx(Math.sqrt(R/A))}`:""}
        else if(A*C>0){tipo=R/A>0?"elipse":"sin gráfica real";info=`${fx(A)}(x − ${fx(h)})² + ${fx(C)}(y − ${fx(k)})² = ${fx(R)}: centro (${fx(h)}, ${fx(k)}), semiejes ${fx(Math.sqrt(Math.abs(R/A)))} y ${fx(Math.sqrt(Math.abs(R/C)))}`}
        else{tipo="hipérbola";info=`${fx(A)}(x − ${fx(h)})² + ${fx(C)}(y − ${fx(k)})² = ${fx(R)}: centro (${fx(h)}, ${fx(k)})`}}
      else if(A||C){tipo="parábola";if(A){h=-D/(2*A);info=E?`eje vertical x = ${fx(h)}`:"degenerada (rectas)"}else{k=-E/(2*C);info=D?`eje horizontal y = ${fx(k)}`:"degenerada (rectas)"}}else tipo="recta";
      $("gc-res").innerHTML=tiles([["Tipo",tipo,"okt"],["A·C",fx(A*C)]]);const G=(x,y)=>A*x*x+C*y*y+D*x+E*y+F,s=8;
      $("gc-g").innerHTML=plotXYc({xr:[h-s,h+s],yr:[k-s*.62,k+s*.62],draw:fr=>contour(G,[h-s,h+s],[k-s*.62,k+s*.62],0,fr),marks:[{x:h,y:k,label:"centro",col:"--exam"}],label:"Cónica"});
      $("gc-o").innerHTML=stc(1,"Completando cuadrados",`<p>${info||"—"}</p><p class="hint">Regla rápida: A = C circunferencia; A·C &gt; 0 elipse; A·C &lt; 0 hipérbola; A = 0 o C = 0 parábola.</p>`)};
    onIn(["gc-a","gc-c","gc-d","gc-e","gc-f"],run);run()}})};

// ---------- Sistemas 2×2
SIMS.sis=function(){MAT_RUN=null;
  $("sim").innerHTML=`<p class="hint">a₁x + b₁y = c₁ · a₂x + b₂y = c₂</p><div class="calcf">${nin("ss-a1","a₁",2)}${nin("ss-b1","b₁",3)}${nin("ss-c1","c₁",12)}${nin("ss-a2","a₂",1)}${nin("ss-b2","b₂",-1)}${nin("ss-c2","c₂",1)}</div><div style="margin:8px 0">${seg("ss-m","Método",[["red","Reducción"],["sus","Sustitución"],["igu","Igualación"]],"red")}</div><div class="res" id="ss-res"></div><div id="ss-g"></div><div id="ss-o"></div>`;
  let mt="red";const run=()=>{const[a1,b1,c1,a2,b2,c2]=["ss-a1","ss-b1","ss-c1","ss-a2","ss-b2","ss-c2"].map(N);if(![a1,b1,c1,a2,b2,c2].every(isFinite))return;const D=a1*b2-a2*b1;
    if(Math.abs(D)<1e-12){const inc=Math.abs(a1*c2-a2*c1)>1e-12||Math.abs(b1*c2-b2*c1)>1e-12;$("ss-res").innerHTML=tiles([["Solución",inc?"ninguna (rectas paralelas)":"infinitas (la misma recta)",inc?"badt":""]]);$("ss-o").innerHTML="";$("ss-g").innerHTML="";return}
    const x=(c1*b2-c2*b1)/D,y=(a1*c2-a2*c1)/D;$("ss-res").innerHTML=tiles([["x",fx(x),"okt"],["y",fx(y),"okt"]]);
    $("ss-g").innerHTML=plotFns({fs:[t=>b1?(c1-a1*t)/b1:NaN,t=>b2?(c2-a2*t)/b2:NaN],xr:[x-6,x+6],marks:[{x,y,label:`(${fx(x)}, ${fx(y)})`}],label:"Las dos rectas"});let s="";
    if(mt==="red"){const k1=a2,k2=a1;s=`<div class="eq al">Multiplicar la ecuación 1 por ${fx(k1)} y la 2 por ${fx(k2)}:<br>${fx(a1*k1)}x + ${fx(b1*k1)}y = ${fx(c1*k1)}<br>${fx(a2*k2)}x + ${fx(b2*k2)}y = ${fx(c2*k2)}<br>Restar: ${fx(b1*k1-b2*k2)}y = ${fx(c1*k1-c2*k2)} ⟹ y = ${fx(y)}<br>Reemplazar en la ecuación 1: ${fx(a1)}x + ${fx(b1)}(${fx(y)}) = ${fx(c1)} ⟹ x = ${fx(x)}</div>`}
    else if(mt==="sus"){if(Math.abs(b1)>1e-12)s=`<div class="eq al">De la ecuación 1: y = (${fx(c1)} − ${fx(a1)}x)/${fx(b1)}<br>En la 2: ${fx(a2)}x + ${fx(b2)}·(${fx(c1)} − ${fx(a1)}x)/${fx(b1)} = ${fx(c2)}<br>⟹ x(${fx(a2)} − ${fx(b2*a1/b1)}) = ${fx(c2-b2*c1/b1)} ⟹ x = ${fx(x)}<br>y = (${fx(c1)} − ${fx(a1)}·${fx(x)})/${fx(b1)} = ${fx(y)}</div>`;else s=`<div class="eq al">De la ecuación 1: x = ${fx(c1/a1)}; en la 2: y = (${fx(c2)} − ${fx(a2)}·${fx(x)})/${fx(b2)} = ${fx(y)}</div>`}
    else{if(Math.abs(b1)>1e-12&&Math.abs(b2)>1e-12)s=`<div class="eq al">y = (${fx(c1)} − ${fx(a1)}x)/${fx(b1)} y y = (${fx(c2)} − ${fx(a2)}x)/${fx(b2)}<br>Igualar: (${fx(c1)} − ${fx(a1)}x)/${fx(b1)} = (${fx(c2)} − ${fx(a2)}x)/${fx(b2)} ⟹ x = ${fx(x)}, y = ${fx(y)}</div>`;else s=`<p>Una ecuación no tiene y: despeja x directamente (x = ${fx(x)}) y reemplaza.</p>`}
    $("ss-o").innerHTML=stc(1,"Paso a paso",s+`<p class="hint">Verificación: ${fx(a1)}·${fx(x)} + ${fx(b1)}·${fx(y)} = ${fx(a1*x+b1*y)} y ${fx(a2)}·${fx(x)} + ${fx(b2)}·${fx(y)} = ${fx(a2*x+b2*y)}.</p>`)};
  bindSeg("ss-m",v=>{mt=v;run()});onIn(["ss-a1","ss-b1","ss-c1","ss-a2","ss-b2","ss-c2"],run);run()};

// ---------- Desigualdades
SIMS.des=function(){
  const P=[["|x − 3| < 2","|x-3| < 2"],["Cuadrática","x^2 - x - 6 > 0"],["Racional","(x-1)/(x+2) >= 0"],["Cúbica","x^3 - 4x <= 0"],["|2x + 1| ≥ 5","|2x+1| >= 5"]];
  $("sim").innerHTML=`${casBox()}${presets("de-pre",P)}<div class="calcf">${inp("de-f","Desigualdad","|x-3| < 2",1)}</div><div id="de-o" class="slv-out"></div>`;
  const run=()=>{const E=exact("desigualdad",ival("de-f"));if(!E){$("de-o").innerHTML=espera();return}if(!E.ok){$("de-o").innerHTML=casErr(E);return}
    const g=pfa(E.g),pts=[...E.critn,...E.singn].sort((a,b)=>a-b),cuts=[-Infinity,...pts,Infinity],row=[];
    for(let i=0;i+1<cuts.length;i++){const a=cuts[i],b=cuts[i+1],t=!isFinite(a)?b-1:!isFinite(b)?a+1:(a+b)/2,v=g?g(t):NaN;row.push({a,b,t,v})}
    const lo=pts.length?Math.min(...pts)-3:-5,hi=pts.length?Math.max(...pts)+3:5;
    $("de-o").innerHTML=stc(1,"Solución",`${TX(E.rel)}${TX(`x\\in ${E.S}`)}`)+stc(2,"Tabla de signos de "+tx("g(x)=\\text{lado izquierdo}-\\text{lado derecho}"),`<p>Puntos críticos (g = 0): ${E.crit.length?E.crit.map(tx).join(", "):"ninguno"}${E.sing.length?`; donde g no está definida: ${E.sing.map(tx).join(", ")}`:""}.</p><div class="tbl"><table><tr><th>Intervalo</th><th>Punto de prueba</th><th>Signo de g</th></tr>${row.map(r=>`<tr><td>(${fx(r.a)}, ${fx(r.b)})</td><td>${fx(r.t)}</td><td>${isFinite(r.v)?(r.v>0?"+":r.v<0?"−":"0"):"—"}</td></tr>`).join("")}</table></div>`)
      +(g?plotFns({fs:[g],xr:[lo,hi],marks:pts.map(p=>({x:p,y:0,col:"--exam"})),label:"g(x)"}):"");typeset($("de-o"))};
  const d=debounce(run,400);$("de-f").addEventListener("input",d);bindPresets("de-pre",P,p=>{$("de-f").value=p[1];run()});start(run)};

// ---------- Funciones
SIMS.fun=function(){
  $("sim").innerHTML=`${casBox()}`+tabsBox("fu",[["an","Análisis"],["co","Composición"]]);const B=$("fu-b");
  tabsRun("fu",{
   an(){const P=[["Racional","(x^2-1)/(x-2)"],["Raíz","sqrt(4-x^2)"],["Logaritmo","ln(x-1)"],["Impar","x^3 - x"],["Demanda","100/(x+1)"]];
    B.innerHTML=`${presets("fa-pre",P)}<div class="calcf">${inp("fa-f","f(x)","(x^2-1)/(x-2)",1)}</div><div id="fa-o" class="slv-out"></div>`;
    const run=()=>{const fs=ival("fa-f"),f=pfa(fs),E=exact("funcion",fs);let h="";
      if(!E)h=espera();else if(!E.ok)h=casErr(E);else h=stc(1,"Dominio, rango y simetría",`${TX(`f(x)=${E.f}`)}<div class="tbl"><table><tr><td>Dominio</td><td>${tx(E.dom)}</td></tr><tr><td>Rango</td><td>${E.ran?tx(E.ran):"SymPy no lo pudo calcular"}</td></tr><tr><td>Paridad</td><td>${E.par==="par"?"par: f(−x) = f(x)":E.par==="impar"?"impar: f(−x) = −f(x)":"ni par ni impar"}</td></tr><tr><td>Ceros</td><td>${E.ceros?tx(E.ceros):"—"}</td></tr><tr><td>Corte con el eje y</td><td>${E.yi?tx(E.yi):"no existe (0 fuera del dominio)"}</td></tr><tr><td>Asíntotas verticales</td><td>${E.av.length?E.av.map(a=>tx("x="+a)).join(", "):"ninguna"}</td></tr><tr><td>Asíntotas horizontales</td><td>${E.ah.length?E.ah.map(a=>tx("y="+a)).join(", "):"ninguna"}</td></tr><tr><td>Inversa</td><td>${E.inv==="varias"?"no es inyectiva en todo el dominio (al despejar salen varias ramas)":E.inv?tx("f^{-1}(x)="+E.inv):"—"}</td></tr></table></div>`);
      if(f)h+=plotFns({fs:[f],xr:[-6,6],label:"f(x)"});$("fa-o").innerHTML=h;typeset($("fa-o"))};
    const d=debounce(run,400);$("fa-f").addEventListener("input",d);bindPresets("fa-pre",P,p=>{$("fa-f").value=p[1];run()});start(run)},
   co(){B.innerHTML=`<div class="calcf">${inp("fc-f","f(x)","sqrt(x)",1)}${inp("fc-g","g(x)","x^2 + 1",1)}</div><div id="fc-o" class="slv-out"></div>`;
    const run=()=>{const E=exact("componer",ival("fc-f"),ival("fc-g"));if(!E){$("fc-o").innerHTML=espera();return}if(!E.ok){$("fc-o").innerHTML=casErr(E);return}
      $("fc-o").innerHTML=stc(1,"Composición",`${TX(`(f\\circ g)(x)=f(g(x))=${E.fg}`)}${TX(`(g\\circ f)(x)=g(f(x))=${E.gf}`)}<p class="hint">En general f ∘ g ≠ g ∘ f. Para el dominio de f ∘ g se piden x en el dominio de g con g(x) en el dominio de f.</p>`);typeset($("fc-o"))};
    const d=debounce(run,400);["fc-f","fc-g"].forEach(i=>$(i).addEventListener("input",d));start(run)}})};

// ---------- Transformaciones
SIMS.transf=function(){MAT_RUN=null;
  const BASE={"x²":x=>x*x,"|x|":Math.abs,"√x":x=>x>=0?Math.sqrt(x):NaN,"1/x":x=>1/x,"x³":x=>x**3,"sen x":Math.sin,"eˣ":Math.exp,"ln x":x=>x>0?Math.log(x):NaN};
  $("sim").innerHTML=`<div style="margin-bottom:8px">${seg("tr-b","Función base",Object.keys(BASE).map(k=>[k,k]),"x²")}</div>${ctl("tr-a","a (estiramiento vertical)",-3,3,0.1,1)}${ctl("tr-bb","b (compresión horizontal)",-3,3,0.1,1)}${ctl("tr-h","h (traslación horizontal)",-5,5,0.5,0)}${ctl("tr-k","k (traslación vertical)",-5,5,0.5,0)}<div class="res" id="tr-res"></div><div id="tr-g"></div>`;
  let b0="x²";const run=()=>{const a=V("tr-a"),b=V("tr-bb"),h=V("tr-h"),k=V("tr-k"),f=BASE[b0],g=x=>a*f(b*(x-h))+k,c=[];
    if(h)c.push(`traslación ${h>0?"a la derecha":"a la izquierda"} ${fx(Math.abs(h))}`);if(k)c.push(`${k>0?"hacia arriba":"hacia abajo"} ${fx(Math.abs(k))}`);if(Math.abs(a)!==1&&a)c.push(`${Math.abs(a)>1?"estiramiento":"compresión"} vertical ×${fx(Math.abs(a))}`);if(a<0)c.push("reflexión respecto al eje x");if(Math.abs(b)!==1&&b)c.push(`${Math.abs(b)>1?"compresión":"estiramiento"} horizontal ×${fx(1/Math.abs(b))}`);if(b<0)c.push("reflexión respecto al eje y");
    $("tr-res").innerHTML=tiles([["g(x)",`${fx(a)}·f(${fx(b)}(x − ${fx(h)})) + ${fx(k)}`,"okt"],["Cambios",c.join("; ")||"ninguno"]]);
    $("tr-g").innerHTML=plotFns({fs:[f,g],xr:[-8,8],yr:[-8,8],label:"Transformación"})+leg([["--line","f(x) base"],["--exam","g(x) transformada"]])};
  bindSeg("tr-b",v=>{b0=v;run()});bindCtl(["tr-a","tr-bb","tr-h","tr-k"],run);run()};

// ---------- Trigonometría
SIMS.trig=function(){
  $("sim").innerHTML=`${casBox()}`+tabsBox("tg",[["cir","Círculo unitario"],["id","Identidades"],["ci","Ciclos"]]);const B=$("tg-b");
  tabsRun("tg",{
   cir(){MAT_RUN=null;B.innerHTML=`${ctl("tc-t","Ángulo θ (grados)",0,360,5,30)}<div class="res" id="tc-res"></div><div id="tc-g"></div>`;
    const run=()=>{const d=V("tc-t"),t=d*Math.PI/180,c=Math.cos(t),s=Math.sin(t),W=600,H=300,R=110,cx=150,cy=150;const z=v=>Math.abs(v)<1e-12?0:v;
      $("tc-res").innerHTML=tiles([["θ en radianes",fx(t)+" ≈ "+fx(d/180)+"π"],["cos θ",fx(z(c))],["sen θ",fx(z(s))],["tan θ",Math.abs(c)<1e-12?"no definida":fx(z(s/c))]]);
      const sx=x=>330+x/(2*Math.PI)*250,sy=y=>150-y*R;let path="";for(let i=0;i<=200;i++){const a=2*Math.PI*i/200;path+=(i?"L":"M")+sx(a).toFixed(1)+","+sy(Math.sin(a)).toFixed(1)}
      $("tc-g").innerHTML=`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Círculo unitario"><circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--muted)"/><line x1="${cx-R-10}" x2="${cx+R+10}" y1="${cy}" y2="${cy}" stroke="var(--muted)"/><line x1="${cx}" x2="${cx}" y1="${cy-R-10}" y2="${cy+R+10}" stroke="var(--muted)"/><line x1="${cx}" y1="${cy}" x2="${cx+R*c}" y2="${cy-R*s}" stroke="var(--ink)" stroke-width="2"/><line x1="${cx+R*c}" y1="${cy}" x2="${cx+R*c}" y2="${cy-R*s}" stroke="var(--exam)" stroke-width="3"/><line x1="${cx}" y1="${cy}" x2="${cx+R*c}" y2="${cy}" stroke="var(--line)" stroke-width="3"/><circle cx="${cx+R*c}" cy="${cy-R*s}" r="5" fill="var(--ink)"/><text x="${cx+R*c+8}" y="${cy-R*s-8}" font-size="12">(cos θ, sen θ)</text>
        <line x1="${sx(0)}" x2="${sx(2*Math.PI)}" y1="150" y2="150" stroke="var(--muted)"/><path d="${path}" fill="none" stroke="var(--exam)" stroke-width="2"/><circle cx="${sx(t)}" cy="${sy(s)}" r="5" fill="var(--exam)"/><line x1="${cx+R*c}" y1="${cy-R*s}" x2="${sx(t)}" y2="${sy(s)}" stroke="var(--exam)" stroke-dasharray="4 4"/><text x="${sx(2*Math.PI)}" y="168" font-size="11" text-anchor="end" fill="var(--muted)">2π</text></svg></div>`+leg([["--line","cos θ"],["--exam","sen θ"]])};
    bindCtl(["tc-t"],run);run()},
   id(){const P=[["sen²/(1 − cos)","sin(x)^2/(1-cos(x))","1+cos(x)"],["Ángulo doble","sin(2x)","2 sin(x) cos(x)"],["Pitagórica","1+tan(x)^2","1/cos(x)^2"],["Falsa","sin(x)+cos(x)","1"]];
    B.innerHTML=`${presets("ti-pre",P)}<div class="calcf">${inp("ti-a","Lado izquierdo","sin(x)^2/(1-cos(x))",1)}${inp("ti-b","Lado derecho","1+cos(x)",1)}</div><div id="ti-o" class="slv-out"></div>`;
    const run=()=>{const E=exact("identidad",ival("ti-a"),ival("ti-b"));if(!E){$("ti-o").innerHTML=espera();return}if(!E.ok){$("ti-o").innerHTML=casErr(E);return}
      $("ti-o").innerHTML=stc(1,"¿Es identidad?",`${TX(`${E.a}\\;\\overset{?}{=}\\;${E.b}`)}${verdict(!E.es,`No es una identidad: la diferencia simplificada es ${tx(E.d)}.`,"Sí: la diferencia se simplifica a 0 para todo x del dominio.")}<p class="hint">Estrategia a mano: llevar todo a senos y cosenos, usar sen² + cos² = 1 y factorizar. Por ejemplo, sen²x = 1 − cos²x = (1 − cos x)(1 + cos x).</p>`);typeset($("ti-o"))};
    const d=debounce(run,400);["ti-a","ti-b"].forEach(i=>$(i).addEventListener("input",d));bindPresets("ti-pre",P,p=>{$("ti-a").value=p[1];$("ti-b").value=p[2];run()});start(run)},
   ci(){MAT_RUN=null;B.innerHTML=`<p class="hint">y(t) = A·sen(ωt + φ) + c, por ejemplo ventas mensuales con estacionalidad.</p>${ctl("cc-A","Amplitud A",0,10,0.5,3)}${ctl("cc-p","Periodo (meses)",2,24,1,12)}${ctl("cc-f","Fase φ (radianes)",-3.14,3.14,0.1,0)}${ctl("cc-c","Nivel c",0,20,1,10)}<div class="res" id="cc-res"></div><div id="cc-g"></div>`;
    const run=()=>{const A=V("cc-A"),P=V("cc-p"),f=V("cc-f"),c=V("cc-c"),w=2*Math.PI/P;$("cc-res").innerHTML=tiles([["ω = 2π/periodo",fx(w)],["Máximo",fx(c+A)],["Mínimo",fx(c-A)]]);$("cc-g").innerHTML=plotFns({fs:[t=>A*Math.sin(w*t+f)+c],xr:[0,36],label:"Ciclo",xl:"t (meses)"})};
    bindCtl(["cc-A","cc-p","cc-f","cc-c"],run);run()}})};

// ---------- Exponenciales y logaritmos
SIMS.explog=function(){
  $("sim").innerHTML=`${casBox()}`+tabsBox("el",[["ec","Ecuaciones"],["in","Interés y crecimiento"]]);const B=$("el-b");
  tabsRun("el",{
   ec(){const P=[["2^(x+1) = 16","2^(x+1) = 16"],["e^(2x) = 5","exp(2x) = 5"],["log(x) + log(x − 3) = log(10)","ln(x) + ln(x-3) = ln(10)"],["3^x = 2^(x+1)","3^x = 2^(x+1)"],["ln(x) = 2","ln(x) = 2"]];
    B.innerHTML=`${presets("ee-pre",P)}<div class="calcf">${inp("ee-f","Ecuación en x","2^(x+1) = 16",1)}</div><div id="ee-o" class="slv-out"></div>`;
    const run=()=>{const s=ival("ee-f"),E=exact("ecuacion",s);if(!E){$("ee-o").innerHTML=espera();return}if(!E.ok){$("ee-o").innerHTML=casErr(E);return}const[l,r]=s.includes("=")?s.split("="):[s,"0"],fl=pfa(l),fr2=pfa(r);
      $("ee-o").innerHTML=stc(1,"Solución",`${TX(E.eq)}<p>${E.sols.length?E.sols.map(q=>tx("x="+q.v)+(q.n!=null&&!/^-?\d+(\.\d+)?$/.test(q.v)?` ≈ ${fx(q.n)}`:"")).join(", "):"No hay soluciones reales."}</p>${E.desc&&E.desc.length?`<p class="warn">Se descartan ${E.desc.map(q=>tx(q.v)).join(", ")}: no están en el dominio (logaritmo de un número no positivo).</p>`:""}<p class="hint">Estrategia: igualar bases (aˣ = aʸ ⟹ x = y), aplicar logaritmo a ambos lados, o juntar logaritmos con sus propiedades y pasar a la forma exponencial.</p>`)
        +(fl&&fr2?plotFns({fs:[fl,fr2],xr:[-4,8],marks:E.sols.filter(q=>q.n!=null).map(q=>({x:q.n,y:fl(q.n),col:"--good"})),label:"Ambos lados"})+leg([["--line","Lado izquierdo"],["--exam","Lado derecho"]]):"");typeset($("ee-o"))};
    const d=debounce(run,400);$("ee-f").addEventListener("input",d);bindPresets("ee-pre",P,p=>{$("ee-f").value=p[1];run()});start(run)},
   in(){MAT_RUN=null;B.innerHTML=`<div class="calcf">${nin("ei-p","Capital P",1000000)}${nin("ei-r","Tasa nominal anual r (%)",12,"0.5")}${nin("ei-m","Capitalizaciones por año m",12,"1")}${nin("ei-t","Años t",5,"1")}</div><div class="res" id="ei-res"></div><div id="ei-g"></div>`;
    const run=()=>{const[P,r0,m,t]=["ei-p","ei-r","ei-m","ei-t"].map(N),r=r0/100;if(!(P>0&&m>0&&t>=0))return;const A=P*Math.pow(1+r/m,m*t),Ac=P*Math.exp(r*t);
      $("ei-res").innerHTML=tiles([["Compuesto m veces",fmt(A,2)],["Continuo Pe^(rt)",fmt(Ac,2)],["Tasa efectiva anual",fmt((Math.pow(1+r/m,m)-1)*100,3)+" %"],["Años para duplicar (continuo)",fx(Math.log(2)/r)]]);
      $("ei-g").innerHTML=plotFns({fs:[x=>P*Math.pow(1+r/m,m*x),x=>P*Math.exp(r*x)],xr:[0,Math.max(1,t*2)],label:"Crecimiento del capital",xl:"años"})+leg([["--line","Compuesto"],["--exam","Continuo"]])+`<p class="hint">t para duplicar con capitalización continua: e^(rt) = 2 ⟹ t = ln 2 / r. Es el origen de la regla del 70.</p>`};
    onIn(["ei-p","ei-r","ei-m","ei-t"],run);run()}})};

// ---------- Continuidad y asíntotas
SIMS.cont=function(){
  $("sim").innerHTML=`${casBox()}`+tabsBox("ct",[["pz","Función por tramos"],["as","Asíntotas"]]);const B=$("ct-b");
  tabsRun("ct",{
   pz(){B.innerHTML=`<p class="hint">f(x) = f₁(x) si x &lt; a; f₂(x) si x ≥ a. Puedes usar un parámetro k para hallar el valor que la hace continua.</p><div class="calcf">${inp("cz-1","f₁(x)","x^2 + k",1)}${inp("cz-2","f₂(x)","3x - 1",1)}${inp("cz-a","a","2",1)}${inp("cz-k","k (si lo usas)","1",1)}</div><div id="cz-o" class="slv-out"></div>`;
    const run=()=>{const a=Number(ival("cz-a")),k=ival("cz-k"),s1=ival("cz-1"),s2=ival("cz-2"),sub=(s,kv)=>absify(s).replace(/\bk\b/g,"("+kv+")"),f1=pfx(sub(s1,k||"0")),f2=pfx(sub(s2,k||"0"));if(!f1||!f2||!isFinite(a)){$("cz-o").innerHTML=err("revisa las expresiones.");return}
      const L1=f1(a-1e-9),L2=f2(a),cont=Math.abs(L1-L2)<1e-6*Math.max(1,Math.abs(L2));let h=stc(1,"Condiciones de continuidad en x = "+fx(a),`<div class="tbl"><table><tr><td>Límite por la izquierda (f₁)</td><td>${fx(L1)}</td></tr><tr><td>f(a) = límite por la derecha (f₂)</td><td>${fx(L2)}</td></tr></table></div>${verdict(!cont,`No es continua: hay un salto de ${fx(L2-L1)}.`,"Es continua en x = a: los límites laterales y f(a) coinciden.")}`);
      if(/\bk\b/.test(s1+s2)){const eq=`${s1.replace(/\bx\b/g,"("+a+")").replace(/\bk\b/g,"x")} = ${s2.replace(/\bx\b/g,"("+a+")").replace(/\bk\b/g,"x")}`,E=exact("ecuacion",eq);h+=stc(2,"Valor de k que la hace continua",E&&E.ok?`<p>Se iguala f₁(${fx(a)}) = f₂(${fx(a)}) y se despeja k: ${E.sols.length?E.sols.map(q=>tx("k="+q.v)).join(", "):"no hay solución"}.</p>`:espera())}
      h+=plotFns({fs:[x=>x<a?f1(x):NaN,x=>x>=a?f2(x):NaN],xr:[a-5,a+5],marks:[{x:a,y:L1,hollow:true,col:"--line"},{x:a,y:L2,col:"--exam"}],label:"Función por tramos"});$("cz-o").innerHTML=h;typeset($("cz-o"))};
    const d=debounce(run,400);["cz-1","cz-2","cz-a","cz-k"].forEach(i=>$(i).addEventListener("input",d));start(run)},
   as(){const P=[["(2x² + 3)/(x² − 1)","(2x^2+3)/(x^2-1)"],["1/(x − 2)","1/(x-2)"],["e^(−x) + 1","exp(-x)+1"],["(x² − 1)/(x − 1)","(x^2-1)/(x-1)"]];
    B.innerHTML=`${presets("ca-pre",P)}<div class="calcf">${inp("ca-f","f(x)","(2x^2+3)/(x^2-1)",1)}</div><div id="ca-o" class="slv-out"></div>`;
    const run=()=>{const fs=ival("ca-f"),f=pfa(fs),E=exact("funcion",fs);let h="";if(!E)h=espera();else if(!E.ok)h=casErr(E);else h=stc(1,"Asíntotas y dominio",`${TX(`f(x)=${E.f}`)}<p>Dominio: ${tx(E.dom)}. Verticales: ${E.av.length?E.av.map(a=>tx("x="+a)).join(", "):"ninguna"}. Horizontales: ${E.ah.length?E.ah.map(a=>tx("y="+a)).join(", "):"ninguna"}.</p><p class="hint">Si el denominador se anula pero el factor se cancela con el numerador, no hay asíntota sino un hueco (discontinuidad removible).</p>`);
      if(f)h+=plotFns({fs:[f],xr:[-6,6],label:"f(x)"});$("ca-o").innerHTML=h;typeset($("ca-o"))};
    const d=debounce(run,400);$("ca-f").addEventListener("input",d);bindPresets("ca-pre",P,p=>{$("ca-f").value=p[1];run()});start(run)}})};

// ---------- Recta tangente
SIMS.tang=function(){
  $("sim").innerHTML=`${casBox()}<div class="calcf">${inp("ta-f","f(x)","x^2 + 10x",1)}${inp("ta-a","Punto a","5",1)}</div>${ctl("ta-h","h",0.01,3,0.01,1.5)}<div class="res" id="ta-res"></div><div id="ta-g"></div><div id="ta-o" class="slv-out"></div>`;
  const run=()=>{const fs=ival("ta-f"),f=pfa(fs),a=Number(ival("ta-a")),h=V("ta-h");if(!f||!isFinite(a)){$("ta-res").innerHTML=err("revisa la función y el punto.");return}const fa=f(a),sec=(f(a+h)-fa)/h,e=1e-5,d=(f(a+e)-f(a-e))/(2*e),E=exact("derivada",fs);
    $("ta-res").innerHTML=tiles([["f(a)",fx(fa)],["Pendiente de la secante",fx(sec)],["f′(a) (tangente)",fx(d),"okt"],["Recta tangente",`y = ${fx(fa)} + ${fx(d)}(x − ${fx(a)})`]]);
    $("ta-g").innerHTML=plotFns({fs:[f,x=>fa+sec*(x-a),x=>fa+d*(x-a)],xr:[a-4,a+4],marks:[{x:a,y:fa,label:"a"},{x:a+h,y:f(a+h),col:"--exam",label:"a + h"}],label:"Secante y tangente"})+leg([["--line","f(x)"],["--exam","Secante"],["--good","Tangente"]]);
    $("ta-o").innerHTML=stc(1,"De la secante a la tangente",`<div class="tbl"><table><tr><th>h</th>${[1,0.5,0.1,0.01,0.001].map(k=>`<th>${fx(k)}</th>`).join("")}</tr><tr><td>[f(a + h) − f(a)]/h</td>${[1,0.5,0.1,0.01,0.001].map(k=>`<td>${fx((f(a+k)-fa)/k)}</td>`).join("")}</tr></table></div><p>Las pendientes de las secantes se acercan a f′(${fx(a)}) = ${fx(d)} cuando h → 0.</p>${E&&E.ok?TX(`f'(x)=${E.ds}`):""}`);typeset($("ta-o"))};
  const d=debounce(run,350);["ta-f","ta-a"].forEach(i=>$(i).addEventListener("input",d));bindCtl(["ta-h"],run);start(run)};

// ---------- Reglas de derivación
SIMS.deriv=function(){
  $("sim").innerHTML=`${casBox()}`+tabsBox("dr",[["ex","Derivada explícita"],["im","Derivación implícita"]]);const B=$("dr-b");
  tabsRun("dr",{
   ex(){const P=[["Producto","x^2 sin(3x)"],["Cociente","ln(x^2+1)/x"],["Cadena","(3x^2 + 1)^5"],["Exponencial","exp(-x^2)"],["Base a","2^(3x)"],["Costo","0.01x^3 - 0.5x^2 + 30x + 500"]];
    B.innerHTML=`${presets("dx-pre",P)}<div class="calcf">${inp("dx-f","f(x)","x^2 sin(3x)",1)}${nin("dx-k","Orden más alto a mostrar",2,"1")}</div><div id="dx-o" class="slv-out"></div>`;
    const run=()=>{const fs=ival("dx-f"),E=exact("derivada",fs,String(N("dx-k")||1)),f=pfa(fs);let h="";
      if(!E)h=espera();else if(!E.ok)h=casErr(E);else{h=stc(1,"Reglas aplicadas",E.pasos.length?`<ol class="steps">${E.pasos.map(p=>`<li><b>${p.r}:</b> ${tx("\\frac{d}{dx}\\left("+p.de+"\\right)="+p.es)}</li>`).join("")}</ol>`:"<p>Derivada directa.</p>")+stc(2,"Resultado",`${TX(`f'(x)=${E.d}`)}${E.ds!==E.d?TX(`=${E.ds}`):""}${E.dk.slice(1).map((d,i)=>TX(`f^{(${i+2})}(x)=${d}`)).join("")}`);
        const g=pfa(E.dstr);if(f&&g)h+=plotFns({fs:[f,g],xr:[-4,4],label:"f y f′"})+leg([["--line","f(x)"],["--exam","f′(x)"]])}
      $("dx-o").innerHTML=h;typeset($("dx-o"))};
    const d=debounce(run,400);["dx-f","dx-k"].forEach(i=>$(i).addEventListener("input",d));bindPresets("dx-pre",P,p=>{$("dx-f").value=p[1];run()});start(run)},
   im(){B.innerHTML=`<div class="calcf">${inp("di-f","Ecuación F(x, y) = 0 (o con =)","x^2 + x y + y^2 = 7",1)}${inp("di-x","x₀","1",1)}${inp("di-y","y₀","2",1)}</div><div id="di-o" class="slv-out"></div>`;
    const run=()=>{const E=exact("implicita",ival("di-f"));if(!E){$("di-o").innerHTML=espera();return}if(!E.ok){$("di-o").innerHTML=casErr(E);return}
      const s=ival("di-f"),[l,r]=s.includes("=")?s.split("="):[s,"0"],G=pf2(absify(`(${l})-(${r})`)),x0=Number(ival("di-x")),y0=Number(ival("di-y")),e=1e-6,Fx=G?(G(x0+e,y0)-G(x0-e,y0))/(2*e):NaN,Fy=G?(G(x0,y0+e)-G(x0,y0-e))/(2*e):NaN,m=-Fx/Fy;
      $("di-o").innerHTML=stc(1,"Derivada implícita",`${TX(`F(x,y)=${E.F}`)}${TX(`\\frac{dy}{dx}=-\\frac{F_x}{F_y}=-\\frac{${E.Fx}}{${E.Fy}}=${E.dy}`)}<p>En (${fx(x0)}, ${fx(y0)}): dy/dx = ${fx(m)}${G&&Math.abs(G(x0,y0))>1e-6?" (el punto no está sobre la curva)":""}.</p>`)+(G?plotXYc({xr:[-5,5],yr:[-4,4],draw:fr=>contour(G,[-5,5],[-4,4],0,fr)+(isFinite(m)?`<line x1="${fr.sx(x0-3)}" y1="${fr.sy(y0-3*m)}" x2="${fr.sx(x0+3)}" y2="${fr.sy(y0+3*m)}" stroke="var(--exam)" stroke-width="2"/>`:""),marks:[{x:x0,y:y0,col:"--exam"}],label:"Curva y tangente"}):"");typeset($("di-o"))};
    const d=debounce(run,400);["di-f","di-x","di-y"].forEach(i=>$(i).addEventListener("input",d));start(run)}})};
