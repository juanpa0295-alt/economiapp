
// ===================== LABORATORIOS DE MÉTODOS LINEALES =====================
const S=LA.str;const tl=a=>tiles(a.map(([s,...r])=>[`<span class="nt">${s}</span>`,...r]));const fq=(x,d)=>fmt(x,d).replace(/^-/,"−");
const mx=(M,aug)=>`<span class="mx" style="grid-template-columns:repeat(${M[0].length},auto)">${M.map(r=>r.map((v,j)=>`<span${aug&&j===aug?' class="mx-aug"':""}>${typeof v==="string"?v:S(v)}</span>`).join("")).join("")}</span>`;
const vc=v=>mx(v.map(x=>[x]));
const tx=(id,l,v,rows=3)=>`<label for="${id}">${l}<textarea id="${id}" rows="${rows}" spellcheck="false" style="width:100%;font-family:var(--f-mono)">${v}</textarea></label>`;
const leerM=id=>LA.leer($(id).value);
const leerV=id=>{const r=LA.leer($(id).value.replace(/\n/g," "));return r.err?r:{v:r.M[0]}};
const pasosHTML=(P,aug,max=40)=>P.length?`<details class="pdet"${P.length<=8?" open":""}><summary><b>${P.length} operaciones por filas</b> (clic para ${P.length<=8?"ocultar":"ver"})</summary><ol class="steps mxsteps">${P.slice(0,max).map(p=>`<li><code>${p.op}</code><br>${mx(p.M,aug)}</li>`).join("")}${P.length>max?`<li>… ${P.length-max} pasos más</li>`:""}</ol></details>`:`<p class="hint">No hizo falta ninguna operación.</p>`;
const ej=(id,lista)=>`<div class="chips pre" id="${id}"><span class="lbl">Ejemplos</span>${lista.map((e,i)=>`<button type="button" data-i="${i}">${e[0]}</button>`).join("")}</div>`;
const bindEj=(id,lista,run)=>$(id).addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const E=lista[+b.dataset.i][1];Object.entries(E).forEach(([k,v])=>$(k).value=v);run()});

// ---------- 1. Operaciones
SIMS.ops=function(){
  const EJ=[["Producto no conmutativo",{"op-a":"1 2\n3 4","op-b":"0 1\n1 0","op-k":"2"}],["Idempotente",{"op-a":"1 0\n0 0","op-b":"2 1\n1 2","op-k":"3"}],["2×3 por 3×2",{"op-a":"1 2 0\n0 1 -1","op-b":"1 0\n2 1\n-1 3","op-k":"1/2"}]];
  $("sim").innerHTML=`${ej("op-ej",EJ)}<div class="calcf">${tx("op-a","Matriz A","1 2\n3 4")}${tx("op-b","Matriz B","0 1\n1 0")}<label for="op-k">Escalar k<input id="op-k" value="2"></label></div><div id="op-o"></div>`;
  const run=()=>{const A=leerM("op-a"),B=leerM("op-b"),k=LA.parse($("op-k").value);if(A.err||B.err||!k){$("op-o").innerHTML=err(A.err||B.err||"el escalar no es un número.");return}const a=A.M,b=B.M,m=a.length,n=a[0].length,p=b.length,q=b[0].length,out=[];
    out.push(stp(1,"Tamaños",`<p>A es ${m}×${n} y B es ${p}×${q}.</p>`));
    out.push(stp(2,"A + B y kA",(m===p&&n===q?`<p>A + B = ${mx(LA.suma(a,b))}</p>`:`<p>A + B no existe: tamaños distintos.</p>`)+`<p>${S(k)}·A = ${mx(LA.esc(k,a))}</p>`));
    if(n===p){const AB=LA.prod(a,b),det=AB.map((r,i)=>r.map((v,j)=>a[i].map((x,t)=>`${S(x)}·${S(b[t][j])}`).join(" + ")));out.push(stp(3,"AB (fila por columna)",`<p>AB = ${mx(AB)}</p><details class="pdet"><summary>Ver cada entrada</summary><div class="eq al">${det.map((r,i)=>r.map((s,j)=>`(AB)<sub>${i+1}${j+1}</sub> = ${s} = <b>${S(AB[i][j])}</b>`).join("<br>")).join("<br>")}</div></details>`))}
    else out.push(stp(3,"AB",`<p>No existe: A tiene ${n} columnas y B ${p} filas.</p>`));
    if(q===m){const BA=LA.prod(b,a);out.push(stp(4,"BA",`<p>BA = ${mx(BA)} ${n===p&&LA.igual(LA.prod(a,b),BA)?"= AB (estas dos matrices conmutan)":n===p&&m===n?"≠ AB: el producto no es conmutativo":""}</p>`))}
    const sq=m===n,AT=LA.T(a),props=[];if(sq){props.push(LA.igual(a,AT)?"simétrica":LA.igual(a,LA.esc(LA.q(-1),AT))?"antisimétrica":"no simétrica");props.push(LA.igual(LA.prod(a,a),a)?"idempotente (A² = A)":"no idempotente");if(a.every((r,i)=>r.every((v,j)=>i===j||LA.z(v))))props.push("diagonal");else if(a.every((r,i)=>r.every((v,j)=>j>=i||LA.z(v))))props.push("triangular superior");else if(a.every((r,i)=>r.every((v,j)=>j<=i||LA.z(v))))props.push("triangular inferior")}
    out.push(stp(5,"Traspuesta y tipo de A",`<p>Aᵀ = ${mx(AT)}</p>${sq?`<p>A es ${props.join(", ")}.</p><p>Parte simétrica (A + Aᵀ)/2 = ${mx(LA.esc(LA.q(1,2),LA.suma(a,AT)))} · parte antisimétrica (A − Aᵀ)/2 = ${mx(LA.esc(LA.q(1,2),LA.suma(a,LA.esc(LA.q(-1),AT))))}</p>`:""}`));
    $("op-o").innerHTML=out.join("")};
  onIn(["op-a","op-b","op-k"],run);bindEj("op-ej",EJ,run);run()};

// ---------- 2. Gauss-Jordan
SIMS.gauss=function(){
  const EJ=[["Solución única",{"ga-a":"2 1 -1\n-3 -1 2\n-2 1 2","ga-b":"8 -11 -3"}],["Infinitas soluciones",{"ga-a":"1 2 3\n2 4 6\n1 1 1","ga-b":"6 12 3"}],["Inconsistente",{"ga-a":"1 1\n2 2","ga-b":"3 7"}],["Homogéneo",{"ga-a":"1 2 -1 3\n2 4 1 0","ga-b":"0 0"}]];
  $("sim").innerHTML=`${ej("ga-ej",EJ)}<div class="calcf">${tx("ga-a","Matriz de coeficientes A","2 1 -1\n-3 -1 2\n-2 1 2")}${tx("ga-b","Términos independientes b (uno por ecuación)","8 -11 -3",1)}</div><div class="res" id="ga-res"></div><div id="ga-o"></div>`;
  const run=()=>{const A=leerM("ga-a"),b=leerV("ga-b");if(A.err||b.err){$("ga-res").innerHTML=err(A.err||b.err);$("ga-o").innerHTML="";return}if(b.v.length!==A.M.length){$("ga-res").innerHTML=err(`b debe tener ${A.M.length} valores, uno por ecuación.`);return}
    const s=LA.sistema(A.M,b.v),n=s.n,nom=j=>n<=4?"xyzw"[j]:`x${j+1}`;
    $("ga-res").innerHTML=tl([["Rango de A",String(s.rA)],["Rango de [A | b]",String(s.rAb)],["Incógnitas",String(n)],["Solución",s.tipo,s.tipo==="inconsistente"?"badt":"okt"]]);
    const Ab=A.M.map((r,i)=>[...r,b.v[i]]);let sol;
    if(s.tipo==="inconsistente")sol=`<p>Aparece una fila 0 = c con c ≠ 0: r(A) = ${s.rA} &lt; r([A | b]) = ${s.rAb}. El sistema no tiene solución.</p>`;
    else if(s.tipo==="única")sol=`<div class="eq al">${s.part.map((v,j)=>`${nom(j)} = <b>${S(v)}</b>`).join(" · ")}</div>`;
    else sol=`<p>r = ${s.rA} &lt; ${n}: hay ${n-s.rA} variable${n-s.rA>1?"s":""} libre${n-s.rA>1?"s":""} (${s.libres.map(j=>nom(j)).join(", ")}).</p><div class="eq al">${s.R.piv.map((c,i)=>`${nom(c)} = ${S(s.R.M[i][n])}${s.libres.map(f=>LA.z(s.R.M[i][f])?"":` ${LA.sgn(s.R.M[i][f])>0?"−":"+"} ${S(LA.q(s.R.M[i][f].n<0n?-s.R.M[i][f].n:s.R.M[i][f].n,s.R.M[i][f].d))}${nom(f)}`).join("")}`).join("<br>")}</div><p>En forma vectorial: x = ${vc(s.part)} ${s.dirs.map(d=>`+ ${nom(d.f)}·${vc(d.v)}`).join(" ")}</p>`;
    $("ga-o").innerHTML=stp(1,"Matriz aumentada",`<p>${mx(Ab,A.M[0].length)}</p>`)+stp(2,"Operaciones por filas (Gauss-Jordan)",pasosHTML(s.R.pasos,A.M[0].length))+stp(3,"Forma escalonada reducida",`<p>${mx(s.R.M,A.M[0].length)}</p><p class="hint">Pivotes en las columnas ${s.R.piv.map(c=>c+1).join(", ")||"ninguna"}.</p>`)+stp(4,"Solución",sol)};
  onIn(["ga-a","ga-b"],run);bindEj("ga-ej",EJ,run);run()};

// ---------- 3. Inversa
SIMS.inv=function(){
  const EJ=[["3×3",{"iv-a":"2 1 -1\n-3 -1 2\n-2 1 2"}],["2×2",{"iv-a":"2 1\n5 3"}],["Singular",{"iv-a":"1 2\n2 4"}]];
  $("sim").innerHTML=`${ej("iv-ej",EJ)}<div class="calcf">${tx("iv-a","Matriz A (cuadrada)","2 1 -1\n-3 -1 2\n-2 1 2")}</div><div class="res" id="iv-res"></div><div id="iv-o"></div>`;
  const run=()=>{const A=leerM("iv-a");if(A.err){$("iv-res").innerHTML=err(A.err);return}const n=A.M.length;if(A.M[0].length!==n){$("iv-res").innerHTML=err("la matriz debe ser cuadrada.");return}const R=LA.inversa(A.M);
    $("iv-res").innerHTML=tl([["¿Invertible?",R.singular?"no (singular)":"sí",R.singular?"badt":"okt"],["Determinante",S(LA.det(A.M))]]);
    $("iv-o").innerHTML=stp(1,"[A | I]",`<p>${mx(A.M.map((r,i)=>[...r,...LA.id(n)[i]]),n)}</p>`)+stp(2,"Gauss-Jordan",pasosHTML(R.R.pasos,n))+stp(3,R.singular?"Resultado":"A⁻¹",R.singular?`<p>A la izquierda quedó una fila de ceros: el rango es ${R.R.rango} &lt; ${n} y A no tiene inversa.</p>`:`<p>A⁻¹ = ${mx(R.inv)}</p><p class="hint">Comprobación: A·A⁻¹ = ${mx(LA.prod(A.M,R.inv))}</p>`)};
  onIn(["iv-a"],run);bindEj("iv-ej",EJ,run);run()};

// ---------- 4. LU
SIMS.lu=function(){
  const EJ=[["Sin intercambios",{"lu-a":"2 1 -1\n-3 -1 2\n-2 1 2","lu-b":"8 -11 -3"}],["Con intercambio (PA = LU)",{"lu-a":"0 2 1\n1 1 1\n2 1 0","lu-b":"5 6 4"}]];
  $("sim").innerHTML=`${ej("lu-ej",EJ)}<div class="calcf">${tx("lu-a","Matriz A (cuadrada)","2 1 -1\n-3 -1 2\n-2 1 2")}${tx("lu-b","Vector b","8 -11 -3",1)}</div><div id="lu-o"></div>`;
  const run=()=>{const A=leerM("lu-a"),b=leerV("lu-b");if(A.err||b.err){$("lu-o").innerHTML=err(A.err||b.err);return}const n=A.M.length;if(A.M[0].length!==n||b.v.length!==n){$("lu-o").innerHTML=err("A debe ser cuadrada y b tener una entrada por fila.");return}const R=LA.lu(A.M);if(R.singular){$("lu-o").innerHTML=err("la matriz es singular: no tiene factorización LU con pivotes.");return}
    const Pb=R.P.map(i=>b.v[i]),y=LA.sustAdelante(R.L,Pb),x=LA.sustAtras(R.U,y),nom=j=>n<=4?"xyzw"[j]:`x${j+1}`;
    $("lu-o").innerHTML=stp(1,"Eliminación y multiplicadores",pasosHTML(R.pasos))+stp(2,R.cambio?"PA = LU":"A = LU",`<p>${R.cambio?`P permuta las filas en el orden ${R.P.map(i=>i+1).join(", ")}. `:""}L = ${mx(R.L)} U = ${mx(R.U)}</p>`)
      +stp(3,"Ly = "+(R.cambio?"Pb":"b")+" (hacia adelante)",`<div class="eq al">${y.map((v,i)=>`y${i+1} = ${S(Pb[i])}${R.L[i].slice(0,i).map((l,k)=>LA.z(l)?"":` − (${S(l)})·${S(y[k])}`).join("")} = <b>${S(v)}</b>`).join("<br>")}</div>`)
      +stp(4,"Ux = y (hacia atrás)",`<div class="eq al">${x.map((v,i)=>`${nom(i)} = <b>${S(v)}</b>`).join(" · ")}</div>`)};
  onIn(["lu-a","lu-b"],run);bindEj("lu-ej",EJ,run);run()};

// ---------- 5. Modelos económicos
SIMS.econ=function(){
  $("sim").innerHTML=tabsBox("ec",[["leon","Leontief"],["ing","Ingreso nacional"],["merc","Dos mercados"]]);const B=$("ec-b");
  tabsRun("ec",{
   leon(){B.innerHTML=`<div class="calcf">${tx("le-a","Coeficientes técnicos A (aᵢⱼ: insumo de i por peso producido en j)","0.2 0.3 0.2\n0.4 0.1 0.2\n0.1 0.3 0.2")}${tx("le-d","Demanda final d","10 5 6",1)}</div><div class="res" id="le-res"></div><div id="le-o"></div>`;
    const run=()=>{const A=leerM("le-a"),d=leerV("le-d");if(A.err||d.err){$("le-res").innerHTML=err(A.err||d.err);return}const n=A.M.length;if(A.M[0].length!==n||d.v.length!==n){$("le-res").innerHTML=err("A debe ser cuadrada y d tener una entrada por sector.");return}
      const IA=LA.suma(LA.id(n),LA.esc(LA.q(-1),A.M)),R=LA.inversa(IA);if(R.singular){$("le-res").innerHTML=err("I − A es singular.");return}const x=LA.prod(R.inv,d.v.map(v=>[v])).map(r=>r[0]),hs=LA.menores(IA),va=A.M[0].map((_,j)=>LA.sub(LA.U,A.M.reduce((s,r)=>LA.add(s,r[j]),LA.Z)));
      $("le-res").innerHTML=tl([...x.map((v,i)=>[`Producción sector ${i+1}`,fq(LA.num(v),4)]),["Hawkins-Simon",hs.every(v=>LA.sgn(v)>0)?"se cumple":"no se cumple",hs.every(v=>LA.sgn(v)>0)?"okt":"badt"]]);
      $("le-o").innerHTML=stp(1,"Matriz de Leontief I − A",`<p>${mx(IA)}</p><p class="hint">Menores principales: ${hs.map(S).join(", ")} ${hs.every(v=>LA.sgn(v)>0)?"(todos positivos: el sistema es viable)":"(no todos positivos)"}.</p>`)+stp(2,"Multiplicadores (I − A)⁻¹",`<p>${mx(R.inv.map(r=>r.map(v=>fq(LA.num(v),4))))}</p><p class="hint">Columna j: lo que debe producir cada sector por una unidad más de demanda final del sector j.</p>`)
        +stp(3,"x = (I − A)⁻¹ d",`<div class="eq al">${x.map((v,i)=>`x${i+1} = ${R.inv[i].map((c,j)=>`${fq(LA.num(c),4)}·${S(d.v[j])}`).join(" + ")} = <b>${fq(LA.num(v),4)}</b>`).join("<br>")}</div><p class="hint">Valor agregado por peso producido: ${va.map((v,j)=>`sector ${j+1}: ${S(v)}`).join(" · ")}.</p>`)};
    onIn(["le-a","le-d"],run);run()},
   ing(){B.innerHTML=`<div class="calcf">${nin("in-a","a (consumo autónomo)",100)}${nin("in-b","b (propensión marginal a consumir)",0.8,"0.01")}${nin("in-d","d (impuesto autónomo)",50)}${nin("in-t","t (tasa de impuesto)",0.2,"0.01")}${nin("in-i","I₀",200)}${nin("in-g","G₀",300)}</div><div class="res" id="in-res"></div><div id="in-o"></div>`;
    const run=()=>{const v=["a","b","d","t","i","g"].map(k=>LA.parse($("in-"+k).value));if(v.some(x=>!x))return;const[a,b,d,t,I,G]=v,A=[[LA.U,LA.neg(LA.U),LA.Z],[LA.neg(b),LA.U,b],[LA.neg(t),LA.Z,LA.U]],rhs=[LA.add(I,G),a,d],C=LA.cramer(A,rhs);
      if(C.singular){$("in-res").innerHTML=err("el sistema es singular.");return}$("in-res").innerHTML=tl([["Y*",fq(LA.num(C.x[0]),2)],["C*",fq(LA.num(C.x[1]),2)],["T*",fq(LA.num(C.x[2]),2)],["Multiplicador del gasto",fq(1/LA.num(C.D),4)]]);
      $("in-o").innerHTML=stp(1,"Sistema",`<p>${mx(A)} ${vc(["Y","C","T"])} = ${vc(rhs)}</p>`)+stp(2,"Cramer",`<div class="eq al">|A| = 1 − b + bt = <b>${S(C.D)}</b><br>Y* = |A₁|/|A| = ${S(C.Ds[0])}/${S(C.D)} = <b>${fq(LA.num(C.x[0]),4)}</b><br>C* = ${S(C.Ds[1])}/${S(C.D)} = ${fq(LA.num(C.x[1]),4)} · T* = ${S(C.Ds[2])}/${S(C.D)} = ${fq(LA.num(C.x[2]),4)}</div><p class="hint">∂Y*/∂G₀ = 1/(1 − b + bt) = ${fq(1/LA.num(C.D),4)}: cada peso más de gasto público eleva el ingreso en esa cantidad.</p>`)};
    onIn(["in-a","in-b","in-d","in-t","in-i","in-g"],run);run()},
   merc(){B.innerHTML=`<p class="hint">Bien 1: Q<sub>d1</sub> = 10 − 2P₁ + P₂, Q<sub>s1</sub> = −2 + 3P₁. Bien 2: Q<sub>d2</sub> = 15 + P₁ − P₂, Q<sub>s2</sub> = −1 + 2P₂ (Chiang). Igualando oferta y demanda se obtiene el sistema; puedes cambiarlo.</p><div class="calcf">${tx("mk-a","Coeficientes del sistema en P₁, P₂","5 -1\n-1 3")}${tx("mk-b","Lado derecho","12 16",1)}</div><div id="mk-o"></div>`;
    const run=()=>{const A=leerM("mk-a"),b=leerV("mk-b");if(A.err||b.err||A.M.length!==2||A.M[0].length!==2||b.v.length!==2){$("mk-o").innerHTML=err("escribe un sistema 2×2.");return}const C=LA.cramer(A.M,b.v);if(C.singular){$("mk-o").innerHTML=err("el sistema es singular.");return}
      $("mk-o").innerHTML=stp(1,"Cramer",`<div class="eq al">|A| = ${S(C.D)} · P₁* = ${S(C.Ds[0])}/${S(C.D)} = <b>${S(C.x[0])}</b> ≈ ${fq(LA.num(C.x[0]),4)} · P₂* = ${S(C.Ds[1])}/${S(C.D)} = <b>${S(C.x[1])}</b> ≈ ${fq(LA.num(C.x[1]),4)}</div><p class="hint">Con los datos de ejemplo: Q₁* = −2 + 3P₁* = ${fq(-2+3*LA.num(C.x[0]),4)} y Q₂* = −1 + 2P₂* = ${fq(-1+2*LA.num(C.x[1]),4)}.</p>`)};
    onIn(["mk-a","mk-b"],run);run()}})};

// ---------- 6. Determinantes
SIMS.det=function(){
  const EJ=[["3×3",{"dt-a":"2 -1 3\n1 0 4\n-2 5 1"}],["4×4",{"dt-a":"1 0 2 -1\n3 0 0 5\n2 1 4 -3\n1 0 5 0"}],["Filas proporcionales",{"dt-a":"1 2 3\n2 4 6\n0 1 1"}]];
  $("sim").innerHTML=`${ej("dt-ej",EJ)}<div class="calcf">${tx("dt-a","Matriz A (cuadrada)","2 -1 3\n1 0 4\n-2 5 1")}</div><div class="res" id="dt-res"></div><div id="dt-o"></div>`;
  const run=()=>{const A=leerM("dt-a");if(A.err){$("dt-res").innerHTML=err(A.err);return}const a=A.M,n=a.length;if(a[0].length!==n){$("dt-res").innerHTML=err("la matriz debe ser cuadrada.");return}if(n>6){$("dt-res").innerHTML=err("máximo 6×6.");return}const D=LA.det(a),T=LA.detTri(a);
    $("dt-res").innerHTML=tl([["det A",S(D),"okt"],["¿Invertible?",LA.z(D)?"no":"sí"]]);const out=[];
    if(n===2)out.push(stp(1,"Fórmula 2×2",`<div class="eq al">(${S(a[0][0])})(${S(a[1][1])}) − (${S(a[0][1])})(${S(a[1][0])}) = <b>${S(D)}</b></div>`));
    if(n===3){const p=(i,j,k)=>LA.mul(LA.mul(a[0][i],a[1][j]),a[2][k]),pos=[[0,1,2],[1,2,0],[2,0,1]],neg=[[2,1,0],[0,2,1],[1,0,2]];out.push(stp(1,"Regla de Sarrus",`<div class="eq al">+ ${pos.map(([i,j,k])=>`(${S(a[0][i])})(${S(a[1][j])})(${S(a[2][k])})`).join(" + ")} = ${S(pos.reduce((s,t)=>LA.add(s,p(...t)),LA.Z))}<br>− [${neg.map(([i,j,k])=>`(${S(a[0][i])})(${S(a[1][j])})(${S(a[2][k])})`).join(" + ")}] = −${S(neg.reduce((s,t)=>LA.add(s,p(...t)),LA.Z))}<br>det = <b>${S(D)}</b></div>`))}
    if(n>=3){let best=0,bz=-1;a.forEach((r,i)=>{const z=r.filter(LA.z).length;if(z>bz){bz=z;best=i}});const t=a[best].map((v,j)=>({v,j,C:LA.cof(a,best,j)}));
      out.push(stp(out.length+1,`Cofactores por la fila ${best+1} (la de más ceros)`,`<div class="eq al">det A = ${t.map(x=>`(${S(x.v)})·C<sub>${best+1}${x.j+1}</sub>`).join(" + ")}<br>${t.filter(x=>!LA.z(x.v)).map(x=>`C<sub>${best+1}${x.j+1}</sub> = (−1)<sup>${best+x.j+2}</sup>·${mx(LA.menor(a,best,x.j))} = ${S(x.C)}`).join("<br>")}<br>det A = ${t.map(x=>`(${S(x.v)})(${S(x.C)})`).join(" + ")} = <b>${S(D)}</b></div>`))}
    out.push(stp(out.length+1,"Por triangulación",`${pasosHTML(T.pasos)}<p>Triangular: ${mx(T.A)} ⟹ det = ${T.sig<0?"−":""}${T.A.map((r,i)=>`(${S(r[i])})`).join("·")} = <b>${S(T.det)}</b></p>`));
    $("dt-o").innerHTML=out.join("")};
  onIn(["dt-a"],run);bindEj("dt-ej",EJ,run);run()};

// ---------- 7. Cramer y adjunta
SIMS.cram=function(){
  $("sim").innerHTML=`<div class="calcf">${tx("cr-a","Matriz A","2 1 -1\n-3 -1 2\n-2 1 2")}${tx("cr-b","Vector b","8 -11 -3",1)}</div><div class="res" id="cr-res"></div><div id="cr-o"></div>`;
  const run=()=>{const A=leerM("cr-a"),b=leerV("cr-b");if(A.err||b.err){$("cr-res").innerHTML=err(A.err||b.err);return}const n=A.M.length;if(A.M[0].length!==n||b.v.length!==n||n>5){$("cr-res").innerHTML=err("A debe ser cuadrada (hasta 5×5) y b tener una entrada por fila.");return}
    const C=LA.cramer(A.M,b.v),nom=j=>n<=4?"xyzw"[j]:`x${j+1}`;if(C.singular){$("cr-res").innerHTML=err("det A = 0: no se puede aplicar Cramer.");$("cr-o").innerHTML="";return}const Ad=LA.adjunta(A.M);
    $("cr-res").innerHTML=tl([["det A",S(C.D)],...C.x.map((v,j)=>[nom(j),S(v),"okt"])]);
    $("cr-o").innerHTML=stp(1,"Regla de Cramer",`<div class="eq al">${C.x.map((v,j)=>`${nom(j)} = det A<sub>${j+1}</sub>/det A = ${mx(A.M.map((r,i)=>r.map((x,k)=>k===j?b.v[i]:x)))} / ${S(C.D)} = ${S(C.Ds[j])}/${S(C.D)} = <b>${S(v)}</b>`).join("<br>")}</div>`)
      +stp(2,"Inversa por la adjunta",`<p>Cofactores C = ${mx(Ad.C)} adj(A) = Cᵀ = ${mx(Ad.adj)}</p><p>A⁻¹ = (1/${S(C.D)})·adj(A) = ${mx(LA.esc(LA.div(LA.U,C.D),Ad.adj))}</p><p>x = A⁻¹b = ${vc(C.x)}</p>`)};
  onIn(["cr-a","cr-b"],run);run()};

// ---------- 8. Vectores
SIMS.vec=function(){
  $("sim").innerHTML=`<div class="calcf">${tx("ve-u","u","1 2 -1",1)}${tx("ve-v","v","3 -1 1",1)}${tx("ve-w","w (para el volumen, opcional)","0 1 2",1)}</div><div class="res" id="ve-res"></div><div id="ve-o"></div>`;
  const run=()=>{const u=leerV("ve-u"),v=leerV("ve-v"),w=leerV("ve-w");if(u.err||v.err||u.v.length!==v.v.length||u.v.length<2||u.v.length>3){$("ve-res").innerHTML=err("u y v deben tener 2 o 3 componentes cada uno.");return}const a=u.v,b=v.v,dim=a.length,f=x=>fq(x,4);
    const dp=LA.punto(a,b),nu=Math.sqrt(LA.num(LA.norma2(a))),nv=Math.sqrt(LA.num(LA.norma2(b))),cos=LA.num(dp)/(nu*nv),ang=Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI,P=LA.proy(a,b),par=LA.rango([a,b])<2;
    const cz=dim===3?LA.cruz(a,b):null,area=cz?Math.sqrt(LA.num(LA.norma2(cz))):Math.abs(LA.num(LA.sub(LA.mul(a[0],b[1]),LA.mul(a[1],b[0])))),vol=dim===3&&!w.err&&w.v.length===3?LA.punto(w.v,cz):null;
    $("ve-res").innerHTML=tl([["u·v",S(dp)],["‖u‖",f(nu)],["‖v‖",f(nv)],["Ángulo",fq(ang,2)+"°"],["Relación",LA.z(dp)?"perpendiculares":par?"paralelos":"ni paralelos ni perpendiculares"],["Área del paralelogramo",f(area)],...(vol?[["Volumen del paralelepípedo",S(LA.sgn(vol)<0?LA.neg(vol):vol)]]:[])]);
    $("ve-o").innerHTML=stp(1,"Producto punto y ángulo",`<div class="eq al">u·v = ${a.map((x,i)=>`(${S(x)})(${S(b[i])})`).join(" + ")} = <b>${S(dp)}</b><br>cos θ = ${S(dp)}/(${f(nu)}·${f(nv)}) = ${f(cos)} ⟹ θ = ${fq(ang,2)}°<br>Cauchy-Schwarz: |u·v| = ${f(Math.abs(LA.num(dp)))} ≤ ‖u‖‖v‖ = ${f(nu*nv)} · triangular: ‖u + v‖ = ${f(Math.sqrt(LA.num(LA.norma2(a.map((x,i)=>LA.add(x,b[i]))))))} ≤ ${f(nu+nv)}</div>`)
      +stp(2,"Suma, resta y proyección",`<p>u + v = ${vc(a.map((x,i)=>LA.add(x,b[i])))} u − v = ${vc(a.map((x,i)=>LA.sub(x,b[i])))} unitario de u = ${vc(a.map(x=>f(LA.num(x)/nu)))}</p><p>proy<sub>v</sub>u = (u·v/v·v)·v = (${S(dp)}/${S(LA.norma2(b))})·v = ${vc(P.p)}</p>`)
      +(cz?stp(3,"Producto cruz",`<div class="eq al">u × v = (${S(a[1])}·${S(b[2])} − ${S(a[2])}·${S(b[1])}, ${S(a[2])}·${S(b[0])} − ${S(a[0])}·${S(b[2])}, ${S(a[0])}·${S(b[1])} − ${S(a[1])}·${S(b[0])}) = (${cz.map(S).join(", ")})<br>Área = ‖u × v‖ = ${f(area)}${vol?`<br>Volumen = |w·(u × v)| = ${S(LA.sgn(vol)<0?LA.neg(vol):vol)}`:""}</div><p class="hint">Plano que pasa por el origen y contiene a u y v: ${S(cz[0])}x + ${S(cz[1])}y + ${S(cz[2])}z = 0.</p>`):"")};
  onIn(["ve-u","ve-v","ve-w"],run);run()};

// ---------- 9. Independencia y bases
SIMS.indep=function(){
  const EJ=[["Dependientes",{"id-v":"1 0 1\n0 1 1\n1 1 2","id-x":"2 3 5"}],["Base de ℝ³",{"id-v":"1 1 0\n1 0 1\n0 1 1","id-x":"2 3 5"}],["Cuatro vectores en ℝ³",{"id-v":"1 2 3\n0 1 1\n2 1 0\n1 1 1","id-x":"1 1 1"}]];
  $("sim").innerHTML=`${ej("id-ej",EJ)}<div class="calcf">${tx("id-v","Vectores (uno por línea)","1 0 1\n0 1 1\n1 1 2")}${tx("id-x","Vector a escribir como combinación (opcional)","2 3 5",1)}</div><div class="res" id="id-res"></div><div id="id-o"></div>`;
  const run=()=>{const V=leerM("id-v");if(V.err){$("id-res").innerHTML=err(V.err);return}const vs=V.M,k=vs.length,n=vs[0].length,A=LA.T(vs),R=LA.rref(A),ind=R.rango===k,N=LA.nulo(A);
    $("id-res").innerHTML=tl([["Vectores",String(k)],["Rango",String(R.rango)],["¿Independientes?",ind?"sí":"no",ind?"okt":"badt"],[`¿Base de ℝ${n===2?"²":n===3?"³":"ⁿ"}?`,ind&&k===n?"sí":"no"],["Dimensión del generado",String(R.rango)]]);
    let comb="";const x=leerV("id-x");if(!x.err&&x.v.length===n){const s=LA.sistema(A,x.v);comb=stp(3,"Combinación lineal",s.tipo==="inconsistente"?`<p>El vector no está en el subespacio generado.</p>`:`<div class="eq al">${vc(x.v)} = ${s.part.map((c,i)=>`(${S(c)})·v${i+1}`).join(" + ")}${s.tipo==="infinitas"?" (una de infinitas formas)":""}</div>`)}
    $("id-o").innerHTML=stp(1,"Vectores como columnas y forma escalonada",`<p>${mx(A)} → ${mx(R.M)}</p><p>Pivotes en las columnas ${R.piv.map(c=>c+1).join(", ")}: ${ind?"cada vector tiene pivote, así que la única combinación que da 0 es la trivial.":`los vectores ${R.piv.map(c=>"v"+(c+1)).join(", ")} forman una base del subespacio generado.`}</p>`)
      +(ind?"":stp(2,"Relación de dependencia",`<div class="eq al">${N.map(v=>v.map((c,i)=>LA.z(c)?"":`(${S(c)})·v${i+1}`).filter(Boolean).join(" + ")+" = 0").join("<br>")}</div>`))+comb};
  onIn(["id-v","id-x"],run);bindEj("id-ej",EJ,run);run()};

// ---------- 10. Cuatro subespacios
SIMS.cuatro=function(){
  $("sim").innerHTML=`<div class="calcf">${tx("cs-a","Matriz A","1 2 0 1\n2 4 1 4\n3 6 1 5")}</div><div class="res" id="cs-res"></div><div id="cs-o"></div>`;
  const run=()=>{const A=leerM("cs-a");if(A.err){$("cs-res").innerHTML=err(A.err);return}const Q=LA.subespacios(A.M),bases=L=>L.length?L.map(v=>vc(v)).join(" "):"{0}";
    $("cs-res").innerHTML=tl([["Tamaño",`${Q.m}×${Q.n}`],["Rango r",String(Q.r)],["dim C(A)",String(Q.r)],["dim C(Aᵀ)",String(Q.r)],["dim N(A)",String(Q.n-Q.r)],["dim N(Aᵀ)",String(Q.m-Q.r)]]);
    const ort=Q.fila.every(f=>Q.nulo.every(z=>LA.z(LA.punto(f,z))));
    $("cs-o").innerHTML=stp(1,"Forma escalonada reducida",`<p>${mx(Q.R.M)} pivotes en las columnas ${Q.R.piv.map(c=>c+1).join(", ")}</p>`)
      +stp(2,"Bases",`<p><b>Espacio columna</b> (columnas pivote de A): ${bases(Q.col)}</p><p><b>Espacio fila</b> (filas no nulas de la reducida): ${bases(Q.fila)}</p><p><b>Espacio nulo</b> (soluciones de Ax = 0): ${bases(Q.nulo)}</p><p><b>Espacio nulo izquierdo</b> (soluciones de Aᵀy = 0): ${bases(Q.nuloIzq)}</p>`)
      +stp(3,"Comprobaciones",`<p>Teorema del rango: r + dim N(A) = ${Q.r} + ${Q.n-Q.r} = ${Q.n} = n. ${ort?"Cada vector de la base del espacio fila es ortogonal a cada vector de la del espacio nulo.":""}</p>`)};
  onIn(["cs-a"],run);run()};

// ---------- 11. Gram-Schmidt y distancias
SIMS.gs=function(){
  $("sim").innerHTML=tabsBox("go",[["gs","Gram-Schmidt"],["dist","Distancias"]]);const B=$("go-b");
  tabsRun("go",{
   gs(){B.innerHTML=`<div class="calcf">${tx("gs-v","Vectores (uno por línea)","1 1 0\n1 0 1\n0 1 1")}</div><div id="gs-o"></div>`;
    const run=()=>{const V=leerM("gs-v");if(V.err){$("gs-o").innerHTML=err(V.err);return}const G=LA.gram(V.M),f=x=>fq(x,4);
      $("gs-o").innerHTML=G.pasos.map(p=>stp(p.k+1,`w${p.k+1}`,`<div class="eq al">w${p.k+1} = v${p.k+1}${p.terms.map((t,j)=>` − (${S(t.k)})·w${j+1}`).join("")} = ${vc(p.w)}${LA.z(LA.norma2(p.w))?" ⟹ v"+(p.k+1)+" depende de los anteriores":""}</div>`)).join("")
        +stp(G.W.length+1,"Base ortonormal",`<p>${G.W.filter(w=>!LA.z(LA.norma2(w))).map((w,i)=>{const n=Math.sqrt(LA.num(LA.norma2(w)));return`q${i+1} = w/‖w‖ = ${vc(w.map(x=>f(LA.num(x)/n)))}`}).join(" ")}</p><p class="hint">Comprobación: ${G.W.map((w,i)=>G.W.slice(i+1).map((z,j)=>`w${i+1}·w${i+j+2} = ${S(LA.punto(w,z))}`).join(", ")).filter(Boolean).join("; ")}.</p>`)};
    onIn(["gs-v"],run);run()},
   dist(){B.innerHTML=`<div class="calcf">${tx("di-p","Punto P (x y z)","1 2 3",1)}${tx("di-pl","Plano a b c d (ax + by + cz = d)","1 1 1 0",1)}${tx("di-r0","Punto de la recta P₀","0 0 0",1)}${tx("di-rv","Dirección de la recta v","1 0 1",1)}</div><div id="di-o"></div>`;
    const run=()=>{const P=leerV("di-p"),pl=leerV("di-pl"),r0=leerV("di-r0"),rv=leerV("di-rv");if([P,pl,r0,rv].some(x=>x.err)||P.v.length!==3||pl.v.length!==4||r0.v.length!==3||rv.v.length!==3){$("di-o").innerHTML=err("el punto y la recta tienen 3 componentes; el plano 4 números a b c d.");return}
      const p=P.v.map(LA.num),[a,b,c,d]=pl.v.map(LA.num),num=Math.abs(a*p[0]+b*p[1]+c*p[2]-d),den=Math.hypot(a,b,c),w=P.v.map((x,i)=>LA.sub(x,r0.v[i])),cr=LA.cruz(w,rv.v),dr=Math.sqrt(LA.num(LA.norma2(cr)))/Math.sqrt(LA.num(LA.norma2(rv.v)));
      $("di-o").innerHTML=stp(1,"Distancia al plano",`<div class="eq al">d = |${fm(a)}·${fm(p[0])} + ${fm(b)}·${fm(p[1])} + ${fm(c)}·${fm(p[2])} − ${fm(d)}|/√(${fm(a)}² + ${fm(b)}² + ${fm(c)}²) = ${fm(num)}/${fq(den,4)} = <b>${fq(num/den,4)}</b></div>`)
        +stp(2,"Distancia a la recta",`<div class="eq al">P − P₀ = (${w.map(S).join(", ")}) · (P − P₀) × v = (${cr.map(S).join(", ")})<br>d = ‖(P − P₀) × v‖/‖v‖ = <b>${fq(dr,4)}</b></div>`)};
    onIn(["di-p","di-pl","di-r0","di-rv"],run);run()}})};

// ---------- 12. Valores propios
SIMS.eig=function(){
  const EJ=[["Simétrica 2×2",{"eg-a":"2 1\n1 2"}],["3×3 con λ repetido",{"eg-a":"2 0 0\n1 2 0\n0 0 3"}],["Simétrica 3×3",{"eg-a":"4 1 0\n1 4 1\n0 1 4"}],["Rotación (complejos)",{"eg-a":"0 -1\n1 0"}]];
  $("sim").innerHTML=`${ej("eg-ej",EJ)}<div class="calcf">${tx("eg-a","Matriz A (cuadrada, hasta 4×4)","2 1\n1 2")}</div><div class="res" id="eg-res"></div><div id="eg-o"></div>`;
  const run=()=>{const A=leerM("eg-a");if(A.err){$("eg-res").innerHTML=err(A.err);return}const a=A.M,n=a.length;if(a[0].length!==n||n>4){$("eg-res").innerHTML=err("la matriz debe ser cuadrada, hasta 4×4.");return}const E=LA.propios(a),f=x=>fq(x,4);
    const pol=E.c.map((c,k)=>{const e=n-k;if(LA.z(c))return"";const s=LA.sgn(c)<0?" − ":k?" + ":"",ab=LA.sgn(c)<0?LA.neg(c):c,co=e>0&&LA.eq(ab,LA.U)?"":S(ab);return s+co+(e>1?`λ<sup>${e}</sup>`:e===1?"λ":"")}).join("");
    const reales=E.vals.filter(v=>!v.im),tot=E.vals.reduce((s,v)=>s+(v.ma||1),0),diag=E.vals.every(v=>!v.im&&!v.num)&&E.vals.every(v=>v.mg===v.ma),sim=LA.esSim(a);
    $("eg-res").innerHTML=tl([["Traza = Σλ",S(a.reduce((s,r,i)=>LA.add(s,r[i]),LA.Z))],["det = Πλ",S(LA.det(a))],["¿Simétrica?",sim?"sí":"no"],["¿Diagonalizable (en ℝ)?",E.vals.some(v=>v.im)?"no (valores complejos)":E.vals.some(v=>v.num)?"sí si son distintos":diag?"sí":"no",diag?"okt":""]]);
    $("eg-o").innerHTML=stp(1,"Polinomio característico",`<div class="eq al">det(A − λI) = 0 ⟹ ${pol} = 0</div><p>Valores propios: ${E.vals.map(v=>v.im?`${f(v.re)} ± ${f(Math.abs(v.im))}i`:v.ex?`<b>${S(v.ex)}</b>${v.ma>1?` (multiplicidad ${v.ma})`:""}`:`≈ ${f(v.re)}`).filter((s,i,arr)=>arr.indexOf(s)===i).join(", ")}</p>`)
      +stp(2,"Vectores propios: (A − λI)v = 0",E.vals.filter(v=>v.ex).map(v=>`<p>λ = ${S(v.ex)}: A − λI = ${mx(a.map((r,i)=>r.map((x,j)=>i===j?LA.sub(x,v.ex):x)))} ⟹ ${v.vec.map(vc).join(" ")} (multiplicidad algebraica ${v.ma}, geométrica ${v.mg})</p>`).join("")+(E.vals.some(v=>v.num)?`<p class="hint">Los valores irracionales se muestran aproximados; sus vectores propios se obtienen igual resolviendo (A − λI)v = 0.</p>`:"")+(E.vals.some(v=>v.im)?`<p class="hint">Con valores complejos la matriz no se diagonaliza en los reales (en una rotación ningún vector conserva su dirección).</p>`:""))
      +(diag&&reales.length?stp(3,"Diagonalización A = PDP⁻¹",(()=>{const P=LA.T(E.vals.flatMap(v=>v.vec)),D=E.vals.flatMap(v=>v.vec.map(()=>v.ex));const Dm=D.map((d,i)=>D.map((_,j)=>i===j?d:LA.Z)),Pi=LA.inversa(P).inv;return`<p>P = ${mx(P)} D = ${mx(Dm)} P⁻¹ = ${mx(Pi)}</p><p class="hint">Comprobación: PDP⁻¹ = ${mx(LA.prod(LA.prod(P,Dm),Pi))}${sim?". Como A es simétrica, los vectores propios son ortogonales y P se puede normalizar a una matriz ortogonal Q (A = QDQᵀ).":""}</p>`})()):"")};
  onIn(["eg-a"],run);bindEj("eg-ej",EJ,run);run()};

// ---------- 13. Formas cuadráticas y hessiano orlado
SIMS.cuad=function(){
  $("sim").innerHTML=tabsBox("fq",[["fc","Forma cuadrática"],["orl","Hessiano orlado"]]);const B=$("fq-b");
  tabsRun("fq",{
   fc(){B.innerHTML=`<div class="calcf">${tx("fc-a","Matriz simétrica A (o hessiano)","2 1\n1 3")}</div><div class="res" id="fc-res"></div><div id="fc-o"></div>`;
    const run=()=>{const A=leerM("fc-a");if(A.err){$("fc-res").innerHTML=err(A.err);return}const a=A.M,n=a.length;if(a[0].length!==n||n>4){$("fc-res").innerHTML=err("matriz cuadrada hasta 4×4.");return}if(!LA.esSim(a)){$("fc-res").innerHTML=err("la matriz de una forma cuadrática debe ser simétrica.");return}
      const D=LA.menores(a),cl=LA.definida(a),E=LA.propios(a),sg=E.vals.map(v=>v.re),cle=sg.every(x=>x>1e-9)?"definida positiva":sg.every(x=>x<-1e-9)?"definida negativa":sg.every(x=>x>-1e-9)?"semidefinida positiva":sg.every(x=>x<1e-9)?"semidefinida negativa":"indefinida",vars=["x","y","z","w"];
      const forma=a.map((r,i)=>r.map((v,j)=>j<i||LA.z(v)?"":j===i?`${S(v)}${vars[i]}²`:`${S(LA.mul(LA.q(2),v))}${vars[i]}${vars[j]}`)).flat().filter(Boolean).join(" + ").replace(/\+ −/g,"− ");
      $("fc-res").innerHTML=tl([["Clasificación",cle,"okt"]]);
      $("fc-o").innerHTML=stp(1,"Forma",`<div class="eq al">Q = ${forma}</div>`)+stp(2,"Menores principales dominantes",`<div class="eq al">${D.map((d,k)=>`D${k+1} = ${S(d)}`).join(" · ")}</div><p>${cl?`Patrón de una forma <b>${cl}</b>.`:"No sigue el patrón de definida positiva ni negativa: es semidefinida o indefinida (para decidir, mira los valores propios o todos los menores principales)."}</p>`)
        +stp(3,"Valores propios",`<div class="eq al">λ = ${sg.map(x=>fq(x,4)).join(", ")} ⟹ <b>${cle}</b></div>`)};
    onIn(["fc-a"],run);run()},
   orl(){B.innerHTML=`<p class="hint">Para max/min de f(x, y) sujeto a g(x, y) = c: escribe las segundas derivadas del lagrangiano en el punto crítico y las primeras de g.</p><div class="calcf">${nin("ho-gx","g_x",1,"any")}${nin("ho-gy","g_y",1,"any")}${nin("ho-xx","L_xx",-2,"any")}${nin("ho-xy","L_xy",1,"any")}${nin("ho-yy","L_yy",-2,"any")}</div><div id="ho-o"></div>`;
    const run=()=>{const v=["gx","gy","xx","xy","yy"].map(k=>LA.parse($("ho-"+k).value));if(v.some(x=>!x))return;const[gx,gy,xx,xy,yy]=v,H=[[LA.Z,gx,gy],[gx,xx,xy],[gy,xy,yy]],d=LA.det(H);
      $("ho-o").innerHTML=stp(1,"Hessiano orlado",`<p>|H̄| = ${mx(H)} = <b>${S(d)}</b></p><p>${LA.sgn(d)>0?"|H̄| > 0: el punto es un <b>máximo</b> restringido.":LA.sgn(d)<0?"|H̄| < 0: el punto es un <b>mínimo</b> restringido.":"|H̄| = 0: la prueba no decide."}</p><p class="hint">Con n variables se revisan los menores orlados |H̄₂|, |H̄₃|, …: alternan de signo empezando en positivo para un máximo, y son todos negativos para un mínimo.</p>`)};
    onIn(["ho-gx","ho-gy","ho-xx","ho-xy","ho-yy"],run);run()}})};

// ---------- Hoja de fórmulas
SIMS.hoja=function(){
  const F=[["Matrices","Producto","(AB)ᵢⱼ = Σₖ aᵢₖbₖⱼ; en general AB ≠ BA"],["Matrices","Traspuesta","(AB)ᵀ = BᵀAᵀ"],["Matrices","Idempotente","A² = A"],["Sistemas","Rouché-Frobenius","r(A) = r([A|b]) = n única; < n infinitas; r(A) < r([A|b]) sin solución"],["Inversa","2×2","[[a, b], [c, d]]⁻¹ = (1/(ad − bc))·[[d, −b], [−c, a]]"],["Inversa","Gauss-Jordan","[A | I] → [I | A⁻¹]"],["Inversa","Propiedades","(AB)⁻¹ = B⁻¹A⁻¹; (Aᵀ)⁻¹ = (A⁻¹)ᵀ"],["LU","Resolver","Ly = b, luego Ux = y"],["Leontief","Producción","x = (I − A)⁻¹d"],["Ingreso nacional","Equilibrio","Y* = (a − bd + I₀ + G₀)/(1 − b + bt)"],
    ["Determinantes","Cofactor","Cᵢⱼ = (−1)^(i+j)Mᵢⱼ; det A = Σⱼ aᵢⱼCᵢⱼ"],["Determinantes","Propiedades","det(AB) = det A det B; det(kA) = kⁿ det A; det Aᵀ = det A"],["Cramer","Regla","xⱼ = det Aⱼ/det A"],["Adjunta","Inversa","A⁻¹ = adj(A)/det A; adj(A) = Cᵀ"],
    ["Vectores","Producto punto","u·v = ‖u‖‖v‖cos θ"],["Vectores","Proyección","proy_v u = (u·v/v·v)v"],["Vectores","Área y volumen","‖u × v‖; |w·(u × v)|"],["Distancias","Punto-plano","|ax₀ + by₀ + cz₀ − d|/√(a² + b² + c²)"],["Distancias","Punto-recta","‖(P − P₀) × v‖/‖v‖"],
    ["Subespacios","Teorema del rango","r + dim N(A) = n"],["Subespacios","Dimensiones","C(A): r; C(Aᵀ): r; N(A): n − r; N(Aᵀ): m − r"],["Gram-Schmidt","Paso","w_k = v_k − Σ (v_k·w_j/w_j·w_j) w_j"],
    ["Valores propios","Ecuación","det(A − λI) = 0; Σλ = tr A; Πλ = det A"],["Diagonalización","Forma","A = PDP⁻¹; Aᵏ = PDᵏP⁻¹"],["Formas cuadráticas","Definida positiva","Todos los Dₖ > 0"],["Formas cuadráticas","Definida negativa","D₁ < 0, D₂ > 0, D₃ < 0, …"],["Hessiano orlado","2 variables","|H̄| > 0 máximo; |H̄| < 0 mínimo"]];
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: Cramer"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=F.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Concepto</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
