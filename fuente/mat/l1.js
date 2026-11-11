
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
