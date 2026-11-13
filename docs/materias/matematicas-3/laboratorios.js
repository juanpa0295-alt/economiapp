// Matemáticas III · calculadoras (SymPy con Pyodide y respaldo numérico)
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
