// Teoría de Juegos · resolvedor y laboratorios
// ===================== LABORATORIOS DE TEORÍA DE JUEGOS =====================
const SIMS={};
const sb=(t)=>`<sub>${t}</sub>`;
const PI=i=>`π${sb(i)}`,SG=x=>`σ${sb(x)}`;
const qs_=x=>{const s=x.s();return s.replace("-","−")};
const setS=a=>`{${a.join(", ")}}`;
// a + b·v con fracciones, escrito como en los apuntes
function lin(k,m,v){const t=[];if(!k.z())t.push(qs_(k));
  if(!m.z()){const a=m.n<0?m.neg():m,c=a.eq(1)?"":(a.d===1?a.s():`(${a.s()})`);const term=c+v;
    t.push(t.length?(m.n<0?"− ":"+ ")+term:(m.n<0?"−":"")+term)}
  return t.length?t.join(" "):"0"}
const coefP=c=>c.n<0?`(${qs_(c)})`:qs_(c);
const PRESETS={
 tabla1:{t:"Ej. 3 · Batalla de los sexos (Tabla 1)",R:["B","S"],C:["B","S"],p1:"G",p2:"B",cells:[["3, 2","1, 1"],["0, 0","2, 3"]]},
 app:{t:"Ejemplo de Economiapp (mixtas 2×2)",R:["Arriba","Abajo"],C:["Izq","Der"],cells:[["3, 2","0, 1"],["0, 0","1, 3"]]},
 ej1:{t:"Ej. 1 · Entrada al mercado",R:["E","NE"],C:["P","C"],cells:[["-1, -1","1, 1"],["0, 2","0, 2"]]},
 ej2:{t:"Ej. 2 · Figura 1 en forma estratégica",R:["ZB","ZA","XB","XA","YB","YA"],C:["RR","RL","LR","LL"],cells:[["1, 1","1, 1","0, 0","0, 0"],["1, 1","1, 1","0, 0","0, 0"],["0, 0","0, 0","3, 2","3, 2"],["0, 0","0, 0","1, 2","1, 2"],["2, 2","2, 3","2, 2","2, 3"],["2, 2","2, 3","2, 2","2, 3"]]},
 ej3b:{t:"Ej. 3b · Batalla de los sexos secuencial",R:["B","S"],C:["BB","BS","SB","SS"],p1:"G",p2:"B",cells:[["3, 2","3, 2","1, 1","1, 1"],["0, 0","2, 3","0, 0","2, 3"]]},
 tabla2:{t:"Ej. 4 · Tabla 2",R:["A","B","C"],C:["R","S","T"],cells:[["3, 0","2, 2","1, 1"],["4, 4","0, 3","2, 2"],["1, 3","1, 0","0, 2"]]},
 tabla3:{t:"Ej. 5 · Tabla 3",R:["A","M","B"],C:["I","C","D"],cells:[["2, 0","1, 1","4, 2"],["3, 4","1, 2","2, 3"],["1, 3","0, 2","3, 0"]]},
 ej6:{t:"Ej. 6 · Juegos o Macro",R:["J","M"],C:["J","M"],cells:[["2, 1","0, 0"],["0, 0","1, 2"]]},
 tabla5:{t:"Ej. 7 · Tabla 5",R:["A","B"],C:["I","D"],cells:[["1, 9","1, 9"],["0, 0","2, 1"]]},
 ej10:{t:"Ej. 10 · Figura 2 en forma estratégica",R:["AC","AD","BC","BD"],C:["X","Y"],cells:[["1, 0","5, 5"],["2, 10","5, 5"],["8, 3","3, 8"],["8, 3","3, 8"]]},
 tabla4:{t:"Ej. 15 · Tabla 4 (racionalizables)",R:["A","B","C"],C:["I","C","D"],cells:[["1, 0","1, 2","0, 1"],["0, 3","0, 1","3, 0"],["0, 1","0, 1","1, 1"]]},
 tabla6:{t:"Ej. 16 · Tabla 6 (reparto de 10 US$)",R:["A","B","C"],C:["A","B","C"],cells:[["9, 1","1, 9","2, 8"],["6, 4","5, 5","4, 6"],["7, 3","8, 2","3, 7"]]},
 ej17a:{t:"Ej. 17 · Suma cero, primera matriz",zs:true,R:["1","2"],C:["1","2"],cells:[["1","0"],["0","1"]]},
 ej17b:{t:"Ej. 17 · Suma cero, segunda matriz",zs:true,R:["1","2","3"],C:["1","2"],cells:[["2","3"],["1","0"],["2","3"]]},
 ej18:{t:"Ej. 18 · Penal (portero contra pateador)",zs:true,R:["I","D"],C:["I","D"],cells:[["1","-1"],["-1","1"]]}};
const ALPH=["A","B","C","D","E","F"],ALPH2=["R","S","T","U","V","W"];

// ---------- Presentación de una bimatriz con mejores respuestas subrayadas
function matHTML(G,{br,ne,I,J,zs,p1="1",p2="2"}={}){const rows=I||G.R.map((_,i)=>i),cols=J||G.C.map((_,j)=>j);
  let h=`<div class="tbl gm"><table><tr><th class="pl" rowspan="2">${p1}</th><th></th><th class="pl" colspan="${cols.length}">${p2}</th></tr><tr><th></th>${cols.map(j=>`<th>${G.C[j]}</th>`).join("")}</tr>`;
  rows.forEach(i=>{h+=`<tr><th></th><th>${G.R[i]}</th>`+cols.map(j=>{const isNE=ne&&ne.some(([a,b])=>a===i&&b===j);
    const u1=br&&br.r1[j].includes(i),u2=br&&br.r2[i].includes(j);
    return `<td class="${isNE?"ne":""}"><span class="${u1?"u":""}">${qs_(G.A[i][j])}</span>${zs?"":`, <span class="${u2?"u":""}">${qs_(G.B[i][j])}</span>`}</td>`}).join("")+"</tr>"});
  return h+"</table></div>"}
// restringe las mejores respuestas a un subjuego para subrayar
function brOn(G,I,J){const S=GT.sub(G,I,J),b=GT.bestResponses(S),r1={},r2={};J.forEach((j,k)=>r1[j]=b.r1[k].map(x=>I[x]));I.forEach((i,k)=>r2[i]=b.r2[k].map(x=>J[x]));
  return{br:{r1,r2},ne:b.ne.map(([a,c])=>[I[a],J[c]])}}

// ---------- Gráfico de correspondencias de mejor respuesta (eje x: σ de la columna 1, eje y: σ de la fila 1)
function brGraph(M,xl,yl){const W=320,H=300,L=46,R=16,T=16,B=40,sx=x=>L+x*(W-L-R),sy=y=>T+(1-y)*(H-T-B);
  let g=`<rect x="${sx(0)}" y="${sy(1)}" width="${sx(1)-sx(0)}" height="${sy(0)-sy(1)}" fill="none" stroke="var(--rule)"/>`;
  const tk=(v,ax)=>ax==="x"?`<text x="${sx(v)}" y="${H-22}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${v.s?v.s():v}</text>`:`<text x="${L-6}" y="${sy(v.num?v.num():v)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${v.s?v.s():v}</text>`;
  g+=tk(0,"x")+tk(1,"x")+tk(0,"y")+tk(1,"y");
  if(M.t1&&M.t1.gt(0)&&M.t1.lt(1))g+=`<text x="${sx(M.t1.num())}" y="${H-22}" text-anchor="middle" font-size="11" fill="var(--line)" font-family="var(--f-mono)">${M.t1.s()}</text>`;
  if(M.t2&&M.t2.gt(0)&&M.t2.lt(1))g+=`<text x="${L-6}" y="${sy(M.t2.num())+4}" text-anchor="end" font-size="11" fill="var(--branch)" font-family="var(--f-mono)">${M.t2.s()}</text>`;
  g+=`<text x="${W-R}" y="${H-4}" text-anchor="end" font-size="12" fill="var(--muted)">${xl}</text><text x="${L+4}" y="${T-4}" font-size="12" fill="var(--muted)">${yl}</text>`;
  // ρ1: y en función de x
  const seg=(ts,sg,draw)=>{const bp=[0];const t=ts;if(t&&t.gt(0)&&t.lt(1))bp.push(t.num());bp.push(1);let d="";
    for(let k=0;k+1<bp.length;k++){const m=(bp[k]+bp[k+1])/2,s=sg(new GT.Q(Math.round(m*1e6),1e6));d+=draw(bp[k],bp[k+1],s,k)}return d};
  const p1=seg(M.t1,M.s1,(a,b,s)=>s===0?`<rect x="${sx(a)}" y="${sy(1)}" width="${sx(b)-sx(a)}" height="${sy(0)-sy(1)}" fill="var(--line)" fill-opacity=".18"/>`:`<line x1="${sx(a)}" x2="${sx(b)}" y1="${sy(s>0?1:0)}" y2="${sy(s>0?1:0)}" stroke="var(--line)" stroke-width="4" stroke-linecap="round"/>`);
  const p2=seg(M.t2,M.s2,(a,b,s)=>s===0?`<rect x="${sx(0)}" y="${sy(b)}" width="${sx(1)-sx(0)}" height="${sy(a)-sy(b)}" fill="var(--branch)" fill-opacity=".18"/>`:`<line y1="${sy(a)}" y2="${sy(b)}" x1="${sx(s>0?1:0)}" x2="${sx(s>0?1:0)}" stroke="var(--branch)" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 7"/>`);
  let v="";if(M.t1&&M.t1.ge(0)&&M.t1.le(1))v+=`<line x1="${sx(M.t1.num())}" x2="${sx(M.t1.num())}" y1="${sy(0)}" y2="${sy(1)}" stroke="var(--line)" stroke-width="4"/>`;
  if(M.t2&&M.t2.ge(0)&&M.t2.le(1))v+=`<line y1="${sy(M.t2.num())}" y2="${sy(M.t2.num())}" x1="${sx(0)}" x2="${sx(1)}" stroke="var(--branch)" stroke-width="4" stroke-dasharray="1 7" stroke-linecap="round"/>`;
  let e=M.segs.map(s=>Array.isArray(s.x)?`<line x1="${sx(s.x[0].num())}" x2="${sx(s.x[1].num())}" y1="${sy(s.p.num())}" y2="${sy(s.p.num())}" stroke="var(--exam)" stroke-width="6" stroke-opacity=".75"/>`:`<line y1="${sy(s.p[0].num())}" y2="${sy(s.p[1].num())}" x1="${sx(s.x.num())}" x2="${sx(s.x.num())}" stroke="var(--exam)" stroke-width="6" stroke-opacity=".75"/>`).join("");
  e+=M.pts.map(([p,x])=>`<circle cx="${sx(x.num())}" cy="${sy(p.num())}" r="7" fill="var(--exam)" stroke="var(--card)" stroke-width="2"/>`).join("");
  return `<div class="plot brg"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Correspondencias de mejor respuesta y equilibrios">${g}${p1}${p2}${v}${e}</svg></div>`}
const cases=(lhs,rows)=>`<div class="cases"><span>${lhs} =</span><span class="brace">${rows.map(r=>`<span>${r}</span>`).join("")}</span></div>`;

// ---------- Mixtas 2x2 escritas como en los apuntes
function mixedHTML(G2,p1n="1",p2n="2"){const M=GT.mixed2x2(G2),[r0,r1]=G2.R,[c0,c1]=G2.C,A=G2.A,B=G2.B;
  const clash=G2.R.some(r=>G2.C.includes(r)),x=SG(clash?(p2n==="2"?"2":p2n)+c0:c0),y=SG(clash?(p1n==="1"?"1":p1n)+r0:r0),X1=`(${x}, 1 − ${x})`,Y1=`(${y}, 1 − ${y})`;
  let h=`<div class="eq">σ = (σ${sb(1)}, σ${sb(2)}) = [ ${Y1} ; ${X1} ]<span class="note">${y} es la probabilidad de que ${p1n} juegue ${r0}; ${x}, la de que ${p2n} juegue ${c0}.</span></div>`;
  const e1=i=>lin(A[i][1],A[i][0].sub(A[i][1]),x),e2=j=>lin(B[1][j],B[0][j].sub(B[1][j]),y);
  h+=`<p><b>Jugador ${p1n}.</b> Pago esperado de cada estrategia pura contra la mezcla del otro:</p><div class="eq al">${PI(1)}[${r0}, ${X1}] = ${coefP(A[0][0])}${x} + ${coefP(A[0][1])}(1 − ${x}) = ${e1(0)}<br>${PI(1)}[${r1}, ${X1}] = ${coefP(A[1][0])}${x} + ${coefP(A[1][1])}(1 − ${x}) = ${e1(1)}</div>`;
  const ineq=(k,m,v,l,r,lhs,rhs,x0,x1)=>{if(m.z())return `<p>${lhs} − ${rhs} = ${qs_(k)} para cualquier ${v}: ${k.gt(0)?`${l} siempre es mejor respuesta.`:k.lt(0)?`${r} siempre es mejor respuesta.`:"el jugador siempre está indiferente."}</p>`;
    const t=k.neg().div(m);return `<div class="eq al">${lhs} ≥ ${rhs} ⇔ ${x0} ≥ ${x1}${x1==="0"?"":` ⇔ ${lin(k,m,v)} ≥ 0`} ⇔ ${v} ${m.gt(0)?"≥":"≤"} ${qs_(t)}</div>`};
  h+=ineq(M.k1,M.m1,x,r0,r1,`${PI(1)}(${r0}, σ${sb(2)})`,`${PI(1)}(${r1}, σ${sb(2)})`,e1(0),e1(1));
  const rho=(k,m,v,who)=>{if(m.z())return k.gt(0)?["1 para todo "+v]:k.lt(0)?["0 para todo "+v]:["[0, 1] para todo "+v];
    const t=k.neg().div(m),up=m.gt(0);if(t.le(0)||t.ge(1)){const s=k.add(m.mul(new GT.Q(1,2))).sgn();return[(s>0?"1":"0")+` para todo ${v}`+(t.eq(0)||t.eq(1)?` (salvo ${v} = ${t.s()}, donde da [0, 1])`:"")]}
    return[`${up?0:1} si ${v} &lt; ${t.s()}`,`[0, 1] si ${v} = ${t.s()}`,`${up?1:0} si ${v} &gt; ${t.s()}`]};
  h+=cases(`${y} ∈ ρ${sb(1)}(${x})`,rho(M.k1,M.m1,x));
  h+=`<p><b>Jugador ${p2n}.</b></p><div class="eq al">${PI(2)}[${Y1}, ${c0}] = ${coefP(B[0][0])}${y} + ${coefP(B[1][0])}(1 − ${y}) = ${e2(0)}<br>${PI(2)}[${Y1}, ${c1}] = ${coefP(B[0][1])}${y} + ${coefP(B[1][1])}(1 − ${y}) = ${e2(1)}</div>`;
  h+=ineq(M.k2,M.m2,y,c0,c1,`${PI(2)}(σ${sb(1)}, ${c0})`,`${PI(2)}(σ${sb(1)}, ${c1})`,e2(0),e2(1));
  h+=cases(`${x} ∈ ρ${sb(2)}(${y})`,rho(M.k2,M.m2,y));
  h+=`<div class="legend"><span><i style="background:var(--line)"></i>ρ${sb(1)}</span><span><i style="background:var(--branch)"></i>ρ${sb(2)}</span><span><i style="background:var(--exam);height:8px;border-radius:4px"></i>Equilibrios</span></div>${brGraph(M,x,y)}`;
  // lista de equilibrios
  const onSeg=([p,xx])=>M.segs.some(s=>Array.isArray(s.x)?s.p.eq(p)&&xx.ge(s.x[0])&&xx.le(s.x[1]):s.x.eq(xx)&&p.ge(s.p[0])&&p.le(s.p[1]));
  const items=[];M.pts.filter(pt=>!onSeg(pt)).forEach(([p,xx])=>{const pure=(p.eq(0)||p.eq(1))&&(xx.eq(0)||xx.eq(1));
    const v1=p.mul(xx.mul(A[0][0]).add(GT.q(1).sub(xx).mul(A[0][1]))).add(GT.q(1).sub(p).mul(xx.mul(A[1][0]).add(GT.q(1).sub(xx).mul(A[1][1]))));
    const v2=p.mul(xx.mul(B[0][0]).add(GT.q(1).sub(xx).mul(B[0][1]))).add(GT.q(1).sub(p).mul(xx.mul(B[1][0]).add(GT.q(1).sub(xx).mul(B[1][1]))));
    items.push(`[ (${p.s()}, ${GT.q(1).sub(p).s()}) ; (${xx.s()}, ${GT.q(1).sub(xx).s()}) ]${pure?` → en puras (${p.eq(1)?r0:r1}, ${xx.eq(1)?c0:c1})`:` → mixto, pagos esperados (${qs_(v1)}, ${qs_(v2)})`}`)});
  const segL=[];M.segs.forEach(s=>{if(Array.isArray(s.x)){const k=segL.find(z=>z.t==="h"&&z.p.eq(s.p));if(k&&k.b.eq(s.x[0]))k.b=s.x[1];else segL.push({t:"h",p:s.p,a:s.x[0],b:s.x[1]})}
    else{const k=segL.find(z=>z.t==="v"&&z.x.eq(s.x));if(k&&k.b.eq(s.p[0]))k.b=s.p[1];else segL.push({t:"v",x:s.x,a:s.p[0],b:s.p[1]})}});
  const pureEnds=(z)=>{const o=[];[z.a,z.b].forEach(e=>{const pp=z.t==="h"?z.p:z.x,ee=e;if((ee.eq(0)||ee.eq(1))&&(pp.eq(0)||pp.eq(1))){const p=z.t==="h"?pp:ee,xx=z.t==="h"?ee:pp;o.push(`(${p.eq(1)?r0:r1}, ${xx.eq(1)?c0:c1})`)}});return o.length?`; incluye ${o.join(" y ")} en puras`:""};
  segL.forEach(z=>items.push(z.t==="h"?`[ (${z.p.s()}, ${GT.q(1).sub(z.p).s()}) ; (${x}, 1 − ${x}) ] con ${x} ∈ [${z.a.s()}, ${z.b.s()}] → infinitos equilibrios${pureEnds(z)}`:`[ (${y}, 1 − ${y}) ; (${z.x.s()}, ${GT.q(1).sub(z.x).s()}) ] con ${y} ∈ [${z.a.s()}, ${z.b.s()}] → infinitos equilibrios${pureEnds(z)}`));
  h+=`<div class="eq al" style="text-align:left">σ* = (σ${sb(1)}*, σ${sb(2)}*) ∈ { ${items.join(" ;<br>")} }</div>`;
  if(segL.length)h+=`<p class="hint" style="margin:0">Hay un tramo entero de equilibrios porque un jugador queda indiferente para un rango de mezclas del otro (juego degenerado).</p>`;
  return h}

// ---------- Resolvedor completo
function solverUI(root,opt){const pfx=opt.id,secs=opt.sections,list=opt.presets||Object.keys(PRESETS);let st=JSON.parse(JSON.stringify(PRESETS[opt.preset]));let practice=false;
  root.innerHTML=`<div class="row slv-top"><label class="selw" for="${pfx}-pre">Ejercicio<select id="${pfx}-pre">${list.map(k=>`<option value="${k}" ${k===opt.preset?"selected":""}>${PRESETS[k].t}</option>`).join("")}<option value="_r2">Juego aleatorio 2×2 para practicar</option><option value="_r3">Juego aleatorio 3×3 para practicar</option></select></label>
    <label class="selw" for="${pfx}-m">Filas<select id="${pfx}-m">${[2,3,4,5,6].map(v=>`<option>${v}</option>`).join("")}</select></label>
    <label class="selw" for="${pfx}-n">Columnas<select id="${pfx}-n">${[2,3,4,5,6].map(v=>`<option>${v}</option>`).join("")}</select></label></div>
    <div class="row"><label class="chkl" for="${pfx}-zs"><input type="checkbox" id="${pfx}-zs"> Suma cero: escribo solo los pagos del jugador 1</label>${opt.noPractice?"":`<label class="chkl" for="${pfx}-pr"><input type="checkbox" id="${pfx}-pr"> Modo práctica: ocultar la solución</label>`}</div>
    <div id="${pfx}-grid"></div><p class="hint" style="margin:0" id="${pfx}-hint"></p><div id="${pfx}-out" class="slv-out"></div>`;
  const grid=()=>{const m=st.R.length,n=st.C.length;$(`${pfx}-m`).value=m;$(`${pfx}-n`).value=n;$(`${pfx}-zs`).checked=!!st.zs;
    $(`${pfx}-hint`).textContent=st.zs?"Cada celda es el pago del jugador 1; el del jugador 2 es el mismo con signo contrario.":"Escribe cada celda como «pago de 1, pago de 2», por ejemplo 3, 2. Se aceptan negativos, decimales con punto y fracciones como 1/2. Los nombres de las estrategias también se pueden editar.";
    let h=`<div class="tbl gin"><table><tr><th>${st.p1||"1"} \\ ${st.p2||"2"}</th>${st.C.map((c,j)=>`<th><input id="${pfx}-c${j}" value="${c}" aria-label="Estrategia ${j+1} del jugador 2"></th>`).join("")}</tr>`;
    st.R.forEach((r,i)=>{h+=`<tr><th><input id="${pfx}-r${i}" value="${r}" aria-label="Estrategia ${i+1} del jugador 1"></th>${st.C.map((_,j)=>`<td><input id="${pfx}-x${i}-${j}" value="${st.cells[i][j]}" inputmode="text" aria-label="Pagos de ${r} contra ${st.C[j]}"></td>`).join("")}</tr>`});
    $(`${pfx}-grid`).innerHTML=h+"</table></div>";
    $(`${pfx}-grid`).querySelectorAll("input").forEach(el=>el.addEventListener("input",()=>{read();run()}))};
  const read=()=>{st.R=st.R.map((_,i)=>$(`${pfx}-r${i}`).value.trim()||ALPH[i]);st.C=st.C.map((_,j)=>$(`${pfx}-c${j}`).value.trim()||ALPH2[j]);st.cells=st.R.map((_,i)=>st.C.map((_,j)=>$(`${pfx}-x${i}-${j}`).value))};
  const resize=()=>{const m=+$(`${pfx}-m`).value,n=+$(`${pfx}-n`).value;
    st.R=[...Array(m)].map((_,i)=>st.R[i]||ALPH[i]);st.C=[...Array(n)].map((_,j)=>st.C[j]||ALPH2[j]);
    st.cells=[...Array(m)].map((_,i)=>[...Array(n)].map((_,j)=>(st.cells[i]&&st.cells[i][j]!==undefined)?st.cells[i][j]:(st.zs?"0":"0, 0")));grid();run()};
  const parse=()=>{const A=[],B=[];for(let i=0;i<st.R.length;i++){A.push([]);B.push([]);for(let j=0;j<st.C.length;j++){const raw=String(st.cells[i][j]).trim();
      const parts=st.zs?[raw]:raw.split(/[;,]\s*|\s+/).filter(Boolean);if(parts.length!==(st.zs?1:2))throw new Error(`la celda (${st.R[i]}, ${st.C[j]}) necesita ${st.zs?"un número":"dos números separados por coma"}.`);
      const a=GT.parseQ(parts[0]);A[i].push(a);B[i].push(st.zs?a.neg():GT.parseQ(parts[1]))}}
    const dup=a=>new Set(a).size!==a.length;if(dup(st.R)||dup(st.C))throw new Error("cada estrategia necesita un nombre distinto.");
    return{R:st.R.slice(),C:st.C.slice(),A,B}};
  const card=(n,t,body)=>`<div class="stepc"><h4><span class="n">${n}</span>${t}</h4>${practice?`<button class="btn reveal" type="button" data-reveal>Ver la solución de este paso</button><div hidden>${body}</div>`:`<div>${body}</div>`}</div>`;
  const run=()=>{let G;try{G=parse()}catch(e){$(`${pfx}-out`).innerHTML=`<p class="err">Revisa los datos: ${e.message}</p>`;return}
    const p1=st.p1||"1",p2=st.p2||"2",br=GT.bestResponses(G),el=GT.iterElim(G,true);let out="",n=1;
    if(secs.includes("forma")){out+=card(n++,"Forma estratégica",`<div class="eq al" style="text-align:left">G(Γ) = {N, S${sb("i")}, π${sb("i")}} &nbsp; con &nbsp; N = {1, 2}, &nbsp; S${sb(1)} = ${setS(G.R)}, &nbsp; S${sb(2)} = ${setS(G.C)}</div>${matHTML(G,{zs:st.zs,p1,p2})}<p class="hint" style="margin:0">${st.zs?"En un juego de suma cero basta con los pagos del jugador 1: π₂ = −π₁.":"En cada celda va (π₁, π₂): el primer número es el pago del jugador de filas."}</p>`)}
    if(secs.includes("elim")){let b="";
      if(!el.steps.length)b=`<p>Ninguna estrategia está estrictamente dominada, ni por otra estrategia pura ni por una mezcla de dos. Sobreviven todas: S${sb(1)} = ${setS(G.R)}, S${sb(2)} = ${setS(G.C)}.</p>`;
      else{b=el.steps.map(s=>{const pl=s.pl,name=k=>pl===1?G.R[k]:G.C[k],dn=s.dom.length===1?name(s.dom[0]):`λ${name(s.dom[0])} + (1 − λ)${name(s.dom[1])}`;
          const vs=s.vals.map(([a,c])=>`${qs_(a)} &gt; ${qs_(c)}`).join(", ");
          const quant=pl===1?`∀s${sb(2)} ∈ S${sb(2)}: ${PI(1)}(${dn}, s${sb(2)}) &gt; ${PI(1)}(${name(s.s)}, s${sb(2)})`:`∀s${sb(1)} ∈ S${sb(1)}: ${PI(2)}(s${sb(1)}, ${dn}) &gt; ${PI(2)}(s${sb(1)}, ${name(s.s)})`;
          const lam=s.L?`<span class="note">Sirve cualquier λ ∈ (${s.L.lo.s()}, ${s.L.hi.s()}); con λ = ${s.L.lam.s()} los pagos de la mezcla son los de la izquierda.</span>`:"";
          return `<div class="eq al" style="text-align:left"><b>q = ${s.q}</b> · Jugador ${pl}: ${quant}<br>(${vs}) &nbsp;⇒&nbsp; S${sb(pl)} = ${setS((pl===1?s.left[0]:s.left[1]).map(name))}${lam}</div>`}).join("");
        b+=`<p>No quedan estrategias estrictamente dominadas. Sobreviven S${sb(1)} = ${setS(el.I.map(i=>G.R[i]))} y S${sb(2)} = ${setS(el.J.map(j=>G.C[j]))}.</p>${matHTML(G,{I:el.I,J:el.J,zs:st.zs,p1,p2})}`;
        if(el.I.length===1&&el.J.length===1)b+=`<div class="verdict acc">El juego es soluble por dominancia: el único perfil que sobrevive es (${G.R[el.I[0]]}, ${G.C[el.J[0]]}), y por eso es el único equilibrio de Nash.</div>`;
        if(el.steps.some(s=>s.L))b+=`<p class="hint" style="margin:0">Algunas eliminaciones usan una estrategia mixta. Las estrategias que sobreviven a este proceso son las racionalizables (en juegos de dos jugadores).</p>`}
      out+=card(n++,"Eliminación iterativa de estrategias estrictamente dominadas",b)}
    if(secs.includes("nash")){const lr1=G.C.map((c,j)=>`${br.r1[j].map(i=>G.R[i]).join(", ")} = r${sb(1)}(${c})`).join("; "),lr2=G.R.map((r,i)=>`${br.r2[i].map(j=>G.C[j]).join(", ")} = r${sb(2)}(${r})`).join("; ");
      const neS=br.ne.map(([i,j])=>`(${G.R[i]}, ${G.C[j]})`);
      out+=card(n++,"Mejores respuestas y equilibrios de Nash en puras",`<p>Para cada estrategia del rival se marca el mejor pago propio (subrayado). Las celdas con los dos pagos subrayados son equilibrios.</p>${matHTML(G,{br,ne:br.ne,zs:st.zs,p1,p2})}
        <div class="eq al" style="text-align:left">s${sb(1)} ∈ r${sb(1)} = { ${lr1} }<br>s${sb(2)} ∈ r${sb(2)} = { ${lr2} }<br><b>EN = r${sb(1)} ∩ r${sb(2)} = ${neS.length?`{ ${neS.join(", ")} }`:"∅"}</b></div>
        ${neS.length?"":`<div class="verdict warnv">No hay equilibrio de Nash en estrategias puras. Por el teorema de Nash, existe al menos uno en estrategias mixtas.</div>`}`)}
    if(secs.includes("mixtas")){let b="";const I=el.I,J=el.J;
      if(I.length<G.R.length||J.length<G.C.length)b+=`<p>Primero se trabaja con el juego que sobrevive a la eliminación: las estrategias eliminadas se juegan con probabilidad 0 en cualquier equilibrio.</p>`;
      if(I.length===1||J.length===1){b+=`<p>Uno de los jugadores tiene una sola estrategia que sobrevive, así que no hay mezcla posible para él: los equilibrios son los de puras de la tabla reducida.</p>${matHTML(G,{...brOn(G,I,J),I,J,zs:st.zs,p1,p2})}`}
      else if(I.length===2&&J.length===2){const G2=GT.sub(G,I,J);if(I.length<G.R.length||J.length<G.C.length)b+=matHTML(G2,{zs:st.zs,p1,p2});b+=mixedHTML(G2,p1,p2)}
      else{const S=GT.sub(G,I,J),se=GT.supportEnum(S);
        b+=`<p>El juego reducido es de ${I.length}×${J.length}, así que no basta una sola ecuación. Se prueban los soportes posibles: para cada par de conjuntos de estrategias que se juegan con probabilidad positiva, cada jugador mezcla para dejar indiferente al otro entre las estrategias de su soporte, y se verifica que ninguna estrategia fuera del soporte pague más.</p>`;
        b+=`<div class="eq al" style="text-align:left">${se.eq.map(e=>{const pure=e.I.length===1;const sI=e.I.map(i=>S.R[i]),sJ=e.J.map(j=>S.C[j]);
          return `${pure?"Puro":"Soporte "+setS(sI)+" × "+setS(sJ)}: σ${sb(1)} = (${e.P.map(t=>t.s()).join(", ")}), σ${sb(2)} = (${e.X.map(t=>t.s()).join(", ")}) · pagos (${qs_(e.v1)}, ${qs_(e.v2)})${pure?"":`<span class="note">${sI.map(s=>`${PI(1)}(${s}, σ${sb(2)})`).join(" = ")} = ${qs_(e.v1)} y ${sJ.map(s=>`${PI(2)}(σ${sb(1)}, ${s})`).join(" = ")} = ${qs_(e.v2)}</span>`}`}).join("<br>")}</div>
          <p class="hint" style="margin:0">El orden de las probabilidades es S${sb(1)} = ${setS(S.R)} y S${sb(2)} = ${setS(S.C)}.</p>${se.degenerate?`<p class="hint" style="margin:0">El juego tiene empates en algunos pagos (es degenerado): además de estos puede haber tramos con infinitos equilibrios.</p>`:""}`}
      out+=card(n++,"Equilibrios en estrategias mixtas",b)}
    if(secs.includes("maximin")){const s=GT.security(G);
      let b=`<p><b>Jugador 1.</b> Peor pago de cada fila: ${G.R.map((r,i)=>`${r} → ${qs_(s.rmin[i])}`).join(", ")}. Maximin = max{${s.rmin.map(qs_).join(", ")}} = <b>${qs_(s.mm1)}</b> con ${G.R.filter((_,i)=>s.rmin[i].eq(s.mm1)).join(" o ")}.</p>`;
      b+=`<p><b>Jugador 2.</b> Peor pago de cada columna: ${G.C.map((c,j)=>`${c} → ${qs_(s.cmin[j])}`).join(", ")}. Maximin = max{${s.cmin.map(qs_).join(", ")}} = <b>${qs_(s.mm2)}</b> con ${G.C.filter((_,j)=>s.cmin[j].eq(s.mm2)).join(" o ")}.</p>`;
      if(s.zs){b+=`<p>${s.c.z()?"Es un juego de suma cero":`Es un juego de suma constante (π₁ + π₂ = ${qs_(s.c)}), que se resuelve igual que uno de suma cero`}. Minimax para el jugador 1: lo máximo que le puede sacar el 2 en cada columna es ${G.C.map((c,j)=>`${c} → ${qs_(s.cmax[j])}`).join(", ")}, así que minimax = min{${s.cmax.map(qs_).join(", ")}} = <b>${qs_(s.minimax1)}</b>.</p>`;
        if(s.saddle)b+=`<div class="verdict acc">Maximin = minimax = ${qs_(s.mm1)}: hay punto de silla. El valor del juego para el jugador 1 es v = ${qs_(s.mm1)} y se alcanza en estrategias puras.</div>`;
        else{const z=s.z1;b+=`<div class="verdict warnv">Maximin (${qs_(s.mm1)}) &lt; minimax (${qs_(s.minimax1)}): no hay punto de silla. Por el teorema minimax, en estrategias mixtas los dos valores coinciden.</div>`;
          if(z)b+=`<div class="eq al" style="text-align:left">σ${sb(1)}* = (${z.P.map(t=>t.s()).join(", ")}) sobre ${setS(G.R)} &nbsp; σ${sb(2)}* = (${z.X.map(t=>t.s()).join(", ")}) sobre ${setS(G.C)}<br><b>Valor del juego para el jugador 1: v = ${qs_(z.v1)}</b></div>`}}
      else{b+=`<p>No es de suma cero, así que maximin no es una predicción de equilibrio: es el pago que cada jugador se asegura pase lo que pase.</p>`;
        if(s.z1&&s.z2)b+=`<div class="eq al" style="text-align:left">Maximin en mixtas · jugador 1: σ${sb(1)} = (${s.z1.P.map(t=>t.s()).join(", ")}), se asegura ${qs_(s.z1.v1)}<br>Maximin en mixtas · jugador 2: σ${sb(2)} = (${s.z2.P.map(t=>t.s()).join(", ")}), se asegura ${qs_(s.z2.v1)}</div>`}
      out+=card(n++,"Maximin, minimax y valor del juego",b)}
    $(`${pfx}-out`).innerHTML=out};
  $(`${pfx}-pre`).onchange=e=>{const v=e.target.value;
    if(v[0]==="_"){const k=v==="_r2"?2:3,r=()=>Math.floor(Math.random()*6);st={t:"",R:ALPH.slice(0,k),C:ALPH2.slice(0,k),cells:[...Array(k)].map(()=>[...Array(k)].map(()=>`${r()}, ${r()}`))};
      if(!opt.noPractice){practice=true;$(`${pfx}-pr`).checked=true}}
    else st=JSON.parse(JSON.stringify(PRESETS[v]));grid();run()};
  $(`${pfx}-m`).onchange=resize;$(`${pfx}-n`).onchange=resize;
  $(`${pfx}-zs`).onchange=e=>{read();st.zs=e.target.checked;st.cells=st.cells.map(r=>r.map(c=>{const p=String(c).split(/[;,]\s*|\s+/).filter(Boolean);return st.zs?(p[0]||"0"):(p.length===1?`${p[0]}, ${p[0].startsWith("-")?p[0].slice(1):"-"+p[0]}`:c)}));grid();run()};
  if(!opt.noPractice)$(`${pfx}-pr`).onchange=e=>{practice=e.target.checked;run()};
  root.addEventListener("click",e=>{const b=e.target.closest("[data-reveal]");if(b){b.nextElementSibling.hidden=false;b.remove()}});
  grid();run()}

SIMS.dom=()=>solverUI($("sim"),{id:"sd",preset:"tabla2",sections:["forma","elim"],presets:["tabla2","tabla3","tabla4","tabla6","ej2","tabla5"]});
SIMS.nash=()=>solverUI($("sim"),{id:"sn",preset:"tabla1",sections:["forma","nash"],presets:["tabla1","tabla2","tabla3","ej6","tabla5","ej1","ej2","ej10","tabla6"]});
SIMS.mix=()=>solverUI($("sim"),{id:"sm",preset:"app",sections:["nash","mixtas"],presets:["app","tabla1","ej6","tabla2","tabla3","tabla5","ej1","ej18"]});
SIMS.rac=()=>solverUI($("sim"),{id:"sr",preset:"tabla4",sections:["forma","elim"],presets:["tabla4","tabla3","tabla2"]});
SIMS.mm=()=>solverUI($("sim"),{id:"sx",preset:"ej18",sections:["forma","maximin"],presets:["ej18","ej17a","ej17b","tabla6","tabla1"]});
SIMS.full=()=>solverUI($("sim"),{id:"sf",preset:"tabla2",sections:["forma","elim","nash","mixtas","maximin"]});

// ---------- Juego secuencial (módulo «Forma extensiva» de Economiapp, generalizado)
const SEQP={
  app:{t:"Ejemplo de Economiapp",a1:["Arriba","Abajo"],a2:["Izquierda","Derecha"],L:[["3, 2","0, 1"],["0, 0","1, 3"]]},
  bos:{t:"Ej. 3b · Batalla de los sexos secuencial",a1:["B","S"],a2:["B","S"],L:[["3, 2","1, 1"],["0, 0","2, 3"]]},
  ent:{t:"Ej. 1 · Entrada (si no entra, el 2 no mueve: repite los pagos)",a1:["E","NE"],a2:["P","C"],L:[["-1, -1","1, 1"],["0, 2","0, 2"]]},
  t5:{t:"Ej. 7 · Tabla 5 jugada en secuencia",a1:["A","B"],a2:["I","D"],L:[["1, 9","1, 9"],["0, 0","2, 1"]]}};
SIMS.seq=function(){let st=JSON.parse(JSON.stringify(SEQP.app));
  $("sim").innerHTML=`<p>El jugador 1 mueve primero; el 2 observa esa jugada y luego elige. Escribe los pagos de cada nodo terminal.</p>
  <div class="row slv-top"><label class="selw" for="q-pre">Ejemplo<select id="q-pre">${Object.keys(SEQP).map(k=>`<option value="${k}">${SEQP[k].t}</option>`).join("")}</select></label>
  <label class="selw" for="q-m">Acciones del 1<select id="q-m"><option>2</option><option>3</option></select></label><label class="selw" for="q-n">Acciones del 2<select id="q-n"><option>2</option><option>3</option></select></label></div>
  <div id="q-in"></div><div id="q-out" class="slv-out"></div>`;
  const build=()=>{$("q-m").value=st.a1.length;$("q-n").value=st.a2.length;
    $("q-in").innerHTML=`<div class="calcf">${st.a1.map((a,i)=>`<label for="q-a${i}">Acción ${i+1} del jugador 1<input id="q-a${i}" value="${a}"></label>`).join("")}${st.a2.map((a,j)=>`<label for="q-b${j}">Acción ${j+1} del jugador 2<input id="q-b${j}" value="${a}"></label>`).join("")}</div>
    <div class="tbl gin"><table><tr><th>Si 1 juega…</th>${st.a2.map(b=>`<th>y 2 juega ${b}</th>`).join("")}</tr>${st.a1.map((a,i)=>`<tr><th>${a}</th>${st.a2.map((_,j)=>`<td><input id="q-x${i}-${j}" value="${st.L[i][j]}" aria-label="Pagos si 1 juega ${a} y 2 juega ${st.a2[j]}"></td>`).join("")}</tr>`).join("")}</table></div>`;
    $("q-in").querySelectorAll("input").forEach(el=>el.addEventListener("input",()=>{read();run()}))};
  const read=()=>{st.a1=st.a1.map((_,i)=>$("q-a"+i).value.trim()||ALPH[i]);st.a2=st.a2.map((_,j)=>$("q-b"+j).value.trim()||ALPH2[j]);st.L=st.a1.map((_,i)=>st.a2.map((_,j)=>$(`q-x${i}-${j}`).value))};
  const tree=(L)=>{const m=st.a1.length,n=st.a2.length,W=600,leafH=34,H=m*n*leafH+30,x0=20,x1=230,x2=470;let g="",k=0;
    const ry=H/2;g+=`<circle cx="${x0}" cy="${ry}" r="6" fill="var(--ink)"/><text x="${x0}" y="${ry-12}" font-size="12" text-anchor="middle" fill="var(--ink)">1</text>`;
    st.a1.forEach((a,i)=>{const ny=15+(i*n+(n-1)/2)*leafH+leafH/2;g+=`<line x1="${x0}" y1="${ry}" x2="${x1}" y2="${ny}" stroke="var(--line)" stroke-width="2"/><text x="${(x0+x1)/2}" y="${(ry+ny)/2-6}" font-size="12" text-anchor="middle" fill="var(--ink)" font-weight="600">${a}</text><circle cx="${x1}" cy="${ny}" r="6" fill="var(--ink)"/><text x="${x1}" y="${ny-12}" font-size="12" text-anchor="middle" fill="var(--ink)">2</text>`;
      st.a2.forEach((b,j)=>{const ly=15+k*leafH+leafH/2;k++;g+=`<line x1="${x1}" y1="${ny}" x2="${x2}" y2="${ly}" stroke="var(--branch)" stroke-width="2"/><text x="${(x1+x2)/2}" y="${(ny+ly)/2-5}" font-size="11.5" text-anchor="middle" fill="var(--muted)">${b}</text><text x="${x2+8}" y="${ly+4}" font-size="12.5" fill="var(--ink)" font-family="var(--f-mono)">(${qs_(L[i][j][0])}, ${qs_(L[i][j][1])})</text>`})});
    return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Árbol del juego secuencial">${g}</svg></div>`};
  const run=()=>{let L;try{L=st.L.map(r=>r.map(c=>{const p=String(c).split(/[;,]\s*|\s+/).filter(Boolean);if(p.length!==2)throw new Error("cada nodo terminal necesita dos pagos separados por coma.");return[GT.parseQ(p[0]),GT.parseQ(p[1])]}))}catch(e){$("q-out").innerHTML=`<p class="err">Revisa los datos: ${e.message}</p>`;return}
    if(new Set(st.a1).size!==st.a1.length||new Set(st.a2).size!==st.a2.length){$("q-out").innerHTML=`<p class="err">Revisa los datos: cada acción necesita un nombre distinto.</p>`;return}
    const r=GT.sequential(st.a1,st.a2,L),G=r.G,br=GT.bestResponses(G),m=st.a1.length;
    const expl=`La estrategia ${r.names[0]} significa: ${st.a1.map((a,i)=>`si 1 juega ${a}, el 2 juega ${st.a2[r.strat[0][i]]}`).join("; ")}.`;
    let h=`<div class="stepc"><h4><span class="n">1</span>Forma extensiva</h4>${tree(L)}</div>`;
    h+=`<div class="stepc"><h4><span class="n">2</span>Forma estratégica</h4><p>El jugador 2 tiene ${m} conjuntos de información (uno por cada acción del 1), así que su estrategia es un plan completo: S${sb(2)} = ${st.a1.map(()=>setS(st.a2)).join(" × ")} = ${setS(r.names)}. ${expl}</p>
      <div class="eq al" style="text-align:left">G(Γ) = {N, S${sb("i")}, π${sb("i")}} con N = {1, 2}, S${sb(1)} = ${setS(st.a1)}, S${sb(2)} = ${setS(r.names)}</div>${matHTML(G,{br,ne:br.ne})}
      <div class="eq al" style="text-align:left">EN = r${sb(1)} ∩ r${sb(2)} = ${br.ne.length?`{ ${br.ne.map(([i,j])=>`(${G.R[i]}, ${G.C[j]})`).join(", ")} }`:"∅"}</div></div>`;
    h+=`<div class="stepc"><h4><span class="n">3</span>Inducción hacia atrás</h4><p><b>Paso 1: empezamos por el final.</b> El jugador 2 observa lo que hizo el 1 y elige la rama con mayor pago para él.</p><ul>${st.a1.map((a,i)=>`<li>Si 1 juega <b>${a}</b>, el 2 elige <b>${r.resp[i].map(j=>st.a2[j]).join(" o ")}</b> (${st.a2.map((b,j)=>`${b}: ${qs_(L[i][j][1])}`).join(", ")}).</li>`).join("")}</ul>
      <p><b>Paso 2: la decisión del jugador 1.</b> El 1 anticipa esas respuestas y compara lo que obtiene en cada rama.</p><ul>${st.a1.map((a,i)=>`<li>Con <b>${a}</b> obtiene ${r.resp[i].map(j=>qs_(L[i][j][0])).join(" o ")}.</li>`).join("")}</ul>
      <div class="verdict acc">Equilibrio perfecto en subjuegos: ${[...new Set(r.spe.map(s=>`(${st.a1[s.i]}, ${s.name})`))].join(" y ")}. Resultado del juego: ${[...new Set(r.spe.map(s=>`${st.a1[s.i]} y luego ${st.a2[s.plan[s.i]]}`))].join("; ")}.</div>
      ${br.ne.length>r.spe.length?`<p>Los demás equilibrios de Nash de la tabla (${br.ne.map(([i,j])=>`(${G.R[i]}, ${G.C[j]})`).filter(x=>!r.spe.some(s=>x===`(${st.a1[s.i]}, ${s.name})`)).join(", ")}) se sostienen con amenazas no creíbles: el jugador 2 promete hacer algo que no le conviene cuando le llega el turno.</p>`:""}</div>`;
    $("q-out").innerHTML=h};
  $("q-pre").onchange=e=>{st=JSON.parse(JSON.stringify(SEQP[e.target.value]));build();run()};
  const rs=()=>{read();const m=+$("q-m").value,n=+$("q-n").value;st.a1=[...Array(m)].map((_,i)=>st.a1[i]||ALPH[i]);st.a2=[...Array(n)].map((_,j)=>st.a2[j]||ALPH2[j]);st.L=[...Array(m)].map((_,i)=>[...Array(n)].map((_,j)=>(st.L[i]&&st.L[i][j])||"0, 0"));build();run()};
  $("q-m").onchange=rs;$("q-n").onchange=rs;build();run();
};

// ---------- Tres jugadores en puras (figuras 3 y 4)
const T3P={
  f4:{t:"Ej. 13 · Figura 4",S:[["A","B"],["X","Y"],["C","D"]],P:[[["2, 2, 2","0, 2, 0"],["0, 1, 0","2, 1, 2"]],[["1, 0, 3","1, 0, 3"],["1, 0, 3","1, 0, 3"]]]},
  f3:{t:"Ej. 12 · Figura 3",S:[["C","B"],["C'","B'"],["I","D"]],P:[[["1, 1, 1","1, 1, 1"],["4, 4, 0","0, 0, 1"]],[["3, 2, 2","0, 0, 0"],["3, 2, 2","0, 0, 0"]]]}};
SIMS.tres=function(){let st=JSON.parse(JSON.stringify(T3P.f4));
  $("sim").innerHTML=`<div class="row slv-top"><label class="selw" for="t3-pre">Ejercicio<select id="t3-pre">${Object.keys(T3P).map(k=>`<option value="${k}">${T3P[k].t}</option>`).join("")}</select></label></div>
  <p class="hint" style="margin:0">Como en tus apuntes: una tabla por cada estrategia del jugador 3. Cada celda es «π₁, π₂, π₃».</p><div id="t3-in"></div><div id="t3-out" class="slv-out"></div>`;
  const build=()=>{let h=`<div class="calcf">${[0,1,2].map(p=>st.S[p].map((s,k)=>`<label for="t3-s${p}${k}">Estrategia ${k+1} del jugador ${p+1}<input id="t3-s${p}${k}" value="${s}"></label>`).join("")).join("")}</div><div class="t3grid">`;
    st.S[2].forEach((s3,k)=>{h+=`<div class="tbl gin"><table><tr><th>S₃ = ${s3}</th>${st.S[1].map(s2=>`<th>${s2}</th>`).join("")}</tr>${st.S[0].map((s1,i)=>`<tr><th>${s1}</th>${st.S[1].map((_,j)=>`<td><input id="t3-x${i}${j}${k}" value="${st.P[i][j][k]}" aria-label="Pagos de (${s1}, ${st.S[1][j]}, ${s3})"></td>`).join("")}</tr>`).join("")}</table></div>`});
    $("t3-in").innerHTML=h+"</div>";$("t3-in").querySelectorAll("input").forEach(el=>el.addEventListener("input",()=>{read();run()}))};
  const read=()=>{st.S=st.S.map((a,p)=>a.map((s,k)=>$(`t3-s${p}${k}`).value.trim()||s));st.P=st.P.map((r,i)=>r.map((c,j)=>c.map((_,k)=>$(`t3-x${i}${j}${k}`).value)))};
  const run=()=>{let P;try{P=st.P.map(r=>r.map(c=>c.map(x=>{const p=String(x).split(/[;,]\s*|\s+/).filter(Boolean);if(p.length!==3)throw new Error("cada celda necesita tres pagos separados por coma.");return p.map(GT.parseQ)})))}catch(e){$("t3-out").innerHTML=`<p class="err">Revisa los datos: ${e.message}</p>`;return}
    const r=GT.nash3(st.S,P),S=st.S,nm=(i,j,k)=>`(${S[0][i]}, ${S[1][j]}, ${S[2][k]})`;
    let rows="";for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let k=0;k<2;k++){const ok1=r.r1[j+","+k].includes(i),ok2=r.r2[i+","+k].includes(j),ok3=r.r3[i+","+j].includes(k),all=ok1&&ok2&&ok3;
      rows+=`<tr class="${all?"ne":""}"><td>${nm(i,j,k)}</td><td class="num">${P[i][j][k].map(qs_).join(", ")}</td><td class="${ok1?"ok":"bad"}">${ok1?"✓":`✗ ${S[0][1-i]} da ${qs_(P[1-i][j][k][0])}`}</td><td class="${ok2?"ok":"bad"}">${ok2?"✓":`✗ ${S[1][1-j]} da ${qs_(P[i][1-j][k][1])}`}</td><td class="${ok3?"ok":"bad"}">${ok3?"✓":`✗ ${S[2][1-k]} da ${qs_(P[i][j][1-k][2])}`}</td></tr>`}
    const ls=(rr,o,a,b,pl)=>Object.keys(rr).map(key=>{const[x,y]=key.split(",").map(Number);return `${rr[key].map(z=>S[pl][z]).join(", ")} = r${sb(pl+1)}(${S[a][x]}, ${S[b][y]})`}).join("; ");
    $("t3-out").innerHTML=`<div class="stepc"><h4><span class="n">1</span>Forma estratégica</h4><div class="eq al" style="text-align:left">G(Γ) = {N, S${sb("i")}, π${sb("i")}} con N = {1, 2, 3}, S${sb(1)} = ${setS(S[0])}, S${sb(2)} = ${setS(S[1])}, S${sb(3)} = ${setS(S[2])}</div></div>
    <div class="stepc"><h4><span class="n">2</span>Revisión de cada perfil</h4><p>Un perfil es equilibrio si ningún jugador gana cambiando solo su estrategia. ✓ quiere decir que no le conviene desviarse.</p><div class="tbl"><table><tr><th>Perfil</th><th>Pagos</th><th>¿1 se desvía?</th><th>¿2 se desvía?</th><th>¿3 se desvía?</th></tr>${rows}</table></div></div>
    <div class="stepc"><h4><span class="n">3</span>Mejores respuestas y equilibrios</h4><div class="eq al" style="text-align:left">r${sb(1)}: ${ls(r.r1,0,1,2,0)}<br>r${sb(2)}: ${ls(r.r2,1,0,2,1)}<br>r${sb(3)}: ${ls(r.r3,2,0,1,2)}<br><b>EN = r${sb(1)} ∩ r${sb(2)} ∩ r${sb(3)} = ${r.ne.length?`{ ${r.ne.map(([i,j,k])=>nm(i,j,k)).join(", ")} }`:"∅"}</b></div></div>`};
  $("t3-pre").onchange=e=>{st=JSON.parse(JSON.stringify(T3P[e.target.value]));build();run()};build();run();
};

// ---------- Arbitraje de oferta final (módulo de Economiapp)
SIMS.arb=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("ar-m","Media del árbitro (m)",50,200,1,110)}${ctl("ar-s","Incertidumbre (σ)",1,40,0.5,10)}</div><div class="res" id="ar-res"></div><div id="ar-plot"></div><p id="ar-txt" style="margin:0"></p>`;
  const run=()=>{const m=V("ar-m"),s=V("ar-s");if(!(s>0)||!isFinite(m))return;const d=Math.sqrt(Math.PI*s*s/2),wf=m-d,wg=m+d;
    $("ar-res").innerHTML=tiles([["Oferta del sindicato w*g",fmt(wg)],["Oferta de la empresa w*f",fmt(wf)],["Brecha w*g − w*f",fmt(wg-wf)]]);
    const pdf=x=>Math.exp(-0.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
    $("ar-plot").innerHTML=curvePlot({lo:m-4*s,hi:m+4*s,curves:[{f:pdf}],areas:[{f:pdf,a:m-4*s,b:m,col:"--bad",op:.15},{f:pdf,a:m,b:m+4*s,col:"--line",op:.15}],marks:[{x:wf,label:`w*f = ${fmt(wf)}`,col:"--bad",dash:1},{x:wg,label:`w*g = ${fmt(wg)}`,col:"--line",dash:1,row:1},{x:m,label:`m = ${fm(m)}`,col:"--muted",dash:1,row:2}],xl:"salario que el árbitro considera justo (x)",label:"Distribución del salario justo según el árbitro"});
    $("ar-txt").innerHTML=`Cada parte gana el arbitraje con probabilidad 1/2, porque el punto medio de las ofertas coincide con m. Si σ sube, la brecha crece: con más incertidumbre sobre el árbitro, las ofertas pueden ser más agresivas.`};
  bindCtl(["ar-m","ar-s"],run);run();
};
