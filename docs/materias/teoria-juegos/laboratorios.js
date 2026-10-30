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
 ej18:{t:"Ej. 18 · Penal (portero contra pateador)",zs:true,R:["I","D"],C:["I","D"],cells:[["1","-1"],["-1","1"]]},
 c3:{t:"Taller 2 · Ej. 2 · Cournot con q ∈ {1, 2, 3}",R:["1","2","3"],C:["1","2","3"],cells:[["4, 4","3, 6","2, 6"],["6, 3","4, 4","2, 3"],["6, 2","3, 2","0, 0"]]},
 c6:{t:"Taller 2 · Ej. 6 · Cournot finito (a − c = 12)",R:["qm/2","qc"],C:["qm/2","qc"],cells:[["18, 18","15, 20"],["20, 15","16, 16"]]},
 hr:{t:"Taller 2 · Ej. 13 · Harrison y Rutström (1991), Tabla I",R:["K","A"],C:["K","A"],p1:"EE. UU.",p2:"CE",cells:[["0, 0","0.85, -3.85"],["-3.31, 1.06","1.46, 0.62"]]}};
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
SIMS.apl=()=>solverUI($("sim"),{id:"sa",preset:"c3",sections:["forma","elim","nash"],presets:["c3","c6","hr"]});
SIMS.full=()=>solverUI($("sim"),{id:"sf",preset:"tabla2",sections:["forma","elim","nash","mixtas","maximin"]});

// ---------- Forma extensiva: editor de árboles, forma estratégica y equilibrio perfecto en subjuegos
const EXTP={
 ent:{t:"Ej. 1 · Entrada al mercado",x:`# La firma 1 entra (E) o no (NE); si entra, la 2 pelea (P) o concede (C)
1
  E: 2
    P: -1, -1
    C: 1, 1
  NE: 0, 2`},
 bosSeq:{t:"Ej. 3b · Batalla de los sexos secuencial",x:`# B observa lo que hizo G antes de elegir
G
  B: B
    B: 3, 2
    S: 1, 1
  S: B
    B: 0, 0
    S: 2, 3`},
 bosSim:{t:"Ej. 3a · Batalla de los sexos simultánea",x:`# Igual que la secuencial, pero B no sabe qué hizo G:
# sus dos nodos van en el mismo conjunto de información [h]
G
  B: B [h]
    B: 3, 2
    S: 1, 1
  S: B [h]
    B: 0, 0
    S: 2, 3`},
 fig1:{t:"Ej. 2 · Figura 1",x:`# El 2 no distingue si el 1 jugó Z o X: conjunto [h]
# El 1 vuelve a mover después de X y L
1
  Z: 2 [h]
    R: 1, 1
    L: 0, 0
  X: 2 [h]
    R: 0, 0
    L: 1
      B: 3, 2
      A: 1, 2
  Y: 2
    R: 2, 2
    L: 2, 3`},
 t5:{t:"Ej. 7 · Tabla 5 jugada en secuencia",x:`1
  A: 2
    I: 1, 9
    D: 1, 9
  B: 2
    I: 0, 0
    D: 2, 1`},
 fig2:{t:"Ej. 10 · Figura 2",x:`# El 2 no sabe si el 1 jugó A o B: conjunto [h]
# Después de A y X, el 1 vuelve a mover
1
  A: 2 [h]
    X: 1
      C: 1, 0
      D: 2, 10
    Y: 5, 5
  B: 2 [h]
    X: 8, 3
    Y: 3, 8`},
 fig3:{t:"Ej. 12 · Figura 3 (tres jugadores)",x:`# El 3 no sabe si llegó por B o por (C, B')
1
  C: 2
    C': 1, 1, 1
    B': 3 [h]
      I: 4, 4, 0
      D: 0, 0, 1
  B: 3 [h]
    I: 3, 2, 2
    D: 0, 0, 0`},
 fig4:{t:"Ej. 13 · Figura 4 (tres jugadores)",x:`# El 3 no sabe si el 2 jugó X o Y
1
  A: 2
    X: 3 [h]
      C: 2, 2, 2
      D: 0, 2, 0
    Y: 3 [h]
      C: 0, 1, 0
      D: 2, 1, 2
  B: 1, 0, 3`},
 app:{t:"Ejemplo de Economiapp (secuencial 2×2)",x:`1
  Arriba: 2
    Izq: 3, 2
    Der: 0, 1
  Abajo: 2
    Izq: 0, 0
    Der: 1, 3`},
 cien:{t:"Ciempiés (cuatro etapas)",x:`# En cada nodo: seguir (S) o terminar (T)
1
  T: 1, 0
  S: 2
    T: 0, 2
    S: 1
      T: 3, 1
      S: 2
        T: 2, 4
        S: 5, 3`},
 azar:{t:"Con azar: el tipo del jugador 1",x:`# La naturaleza decide si el 1 es fuerte (1/3) o débil (2/3).
# El 1 conoce su tipo; el 2 solo ve si el 1 pelea.
Azar
  Fuerte (1/3): 1
    Pelea: 2 [v]
      Cede: 2, 0
      Lucha: 1, -1
    Huye: 0, 1
  Debil (2/3): 1
    Pelea: 2 [v]
      Cede: 2, 0
      Lucha: -1, 1
    Huye: 0, 1`}};

// Dibujo del árbol (de arriba hacia abajo, como en el taller)
function extTree(T,{behav,reach,subs}={}){const leaves=[],pay=n=>`(${n.pay.map(qs_).join(", ")})`;
  const lw=Math.max(58,...T.nodes.filter(n=>n.kind==="t").map(n=>pay(n).length*7.6+16));
  const maxD=Math.max(...T.nodes.map(n=>n.depth)),dy=maxD>4?70:84,top=34;const pos=new Map();
  const place=n=>{if(n.kind==="t"){const x=20+lw/2+leaves.length*lw;leaves.push(n);pos.set(n.id,{x,y:top+n.depth*dy});return x}
    const xs=n.acts.map(a=>place(a.child)),x=(xs[0]+xs[xs.length-1])/2;pos.set(n.id,{x,y:top+n.depth*dy});return x};
  place(T.root);const W=Math.max(320,leaves.length*lw+40),H=top+maxD*dy+44;
  let edges="",labs="",nodesS="",hs="";
  T.nodes.forEach(n=>{if(n.kind==="t")return;const P=pos.get(n.id);
    n.acts.forEach(a=>{const C=pos.get(a.child.id);const pr=n.kind==="c"?a.p:(behav&&behav[n.h.key]?behav[n.h.key][a.k]:null);
      const chosen=pr&&!pr.z()&&n.kind==="d",onPath=reach&&chosen&&reach.get(n.id)&&!reach.get(n.id).z();
      const col=onPath?"var(--exam)":chosen?"var(--line)":"var(--rule)",sw=chosen?(pr.eq(1)?3.6:2.6):1.8;
      edges+=`<line x1="${P.x}" y1="${P.y}" x2="${C.x}" y2="${C.y}" stroke="${behav?col:"var(--muted)"}" stroke-width="${behav?sw:1.6}" ${behav&&chosen&&!pr.eq(1)?'stroke-dasharray="7 4"':""} stroke-linecap="round"/>`;
      const mx=(P.x+C.x)/2,my=(P.y+C.y)/2,side=C.x<P.x-1?-1:C.x>P.x+1?1:1,anc=side<0?"end":"start";
      const extra=n.kind==="c"?` (${a.p.s()})`:(behav&&pr&&!pr.z()&&!pr.eq(1)?` · ${pr.s()}`:"");
      labs+=`<text x="${mx+side*7}" y="${my-3}" text-anchor="${anc}" font-size="12.5" font-weight="600" fill="${behav&&chosen?(onPath?"var(--exam)":"var(--line)"):"var(--ink)"}" paint-order="stroke" stroke="var(--card)" stroke-width="4" stroke-linejoin="round">${a.a}${extra}</text>`});
    const isSub=subs&&n.sub&&n!==T.root;
    if(isSub)nodesS+=`<circle cx="${P.x}" cy="${P.y}" r="12" fill="none" stroke="var(--branch)" stroke-width="1.6"/>`;
    nodesS+=n.kind==="c"?`<circle cx="${P.x}" cy="${P.y}" r="7" fill="var(--card)" stroke="var(--ink)" stroke-width="1.8"/><text x="${P.x}" y="${P.y-14}" text-anchor="middle" font-size="12" fill="var(--muted)">Azar</text>`
      :`<circle cx="${P.x}" cy="${P.y}" r="6.5" fill="var(--ink)"/><text x="${P.x}" y="${P.y-15}" text-anchor="middle" font-size="13.5" font-weight="700" fill="var(--line)" font-family="var(--f-display)">${n.pl}</text>`});
  T.nodes.filter(n=>n.kind==="t").forEach(n=>{const P=pos.get(n.id),on=reach&&reach.get(n.id)&&!reach.get(n.id).z();
    nodesS+=`<circle cx="${P.x}" cy="${P.y}" r="3" fill="${on?"var(--exam)":"var(--muted)"}"/><text x="${P.x}" y="${P.y+19}" text-anchor="middle" font-size="12.5" font-family="var(--f-mono)" fill="${on?"var(--exam)":"var(--ink)"}" font-weight="${on?600:400}">${pay(n)}</text>`});
  T.H.filter(h=>h.nodes.length>1).forEach(h=>{const ps=h.nodes.map(n=>pos.get(n.id)).sort((a,b)=>a.x-b.x);
    for(let k=0;k+1<ps.length;k++)hs+=`<line x1="${ps[k].x+9}" y1="${ps[k].y}" x2="${ps[k+1].x-9}" y2="${ps[k+1].y}" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="2 5" stroke-linecap="round"/>`;
    const a=ps[0],b=ps[ps.length-1];hs+=`<text x="${(a.x+b.x)/2}" y="${(a.y+b.y)/2+16}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${h.lab}</text>`});
  return `<div class="plot ext-tree"><svg viewBox="0 0 ${W} ${H}" style="min-width:${Math.min(W,Math.max(320,W*0.72))}px" role="img" aria-label="Árbol del juego en forma extensiva">${edges}${hs}${labs}${nodesS}</svg></div>`}

// Texto de una estrategia de comportamiento
function extBehavText(T,p,behav,{detail}={}){const Hs=T.H.filter(h=>h.p===p);
  const parts=Hs.map(h=>{const v=behav[h.key],i=v.findIndex(x=>x.eq(1));return i>=0?{pure:true,a:h.acts[i]}:{pure:false,a:v.map((x,k)=>x.z()?null:`${x.s()}·${h.acts[k]}`).filter(Boolean).join(" + ")}});
  if(parts.every(x=>x.pure)&&!detail)return GT.extJoin(T,p,parts.map(x=>x.a));
  return parts.map((x,k)=>Hs.length>1?`${x.pure?x.a:`(${x.a})`} ${extWhere(Hs[k])}`:(x.pure?x.a:`(${x.a})`)).join("; ")}
function extWhere(h){const hs=h.nodes.map(GT.extHistory);return hs[0]==="inicio"?"al inicio":`tras ${hs.join(" o ")}`}

function extUI(root,preset){const P=`x${Math.random().toString(36).slice(2,7)}`;let practice=false,sel=0,last=null,timer=null;
  root.innerHTML=`<div class="row slv-top"><label class="selw" for="${P}-pre">Ejercicio<select id="${P}-pre">${Object.keys(EXTP).map(k=>`<option value="${k}" ${k===preset?"selected":""}>${EXTP[k].t}</option>`).join("")}</select></label>
    <label class="chkl" for="${P}-pr"><input type="checkbox" id="${P}-pr"> Modo práctica: ocultar la solución</label></div>
    <div class="ext-ed"><label class="selw" for="${P}-tx">Árbol del juego<textarea id="${P}-tx" spellcheck="false" autocapitalize="off" autocomplete="off" rows="12"></textarea></label>
    <details class="ext-help"><summary>Cómo escribir el árbol</summary>
      <ul><li>La primera línea es el jugador que mueve primero, por ejemplo <code>1</code>.</li>
      <li>Debajo, con más sangría (dos espacios), cada acción: <code>acción: destino</code>. El destino es otro jugador (<code>E: 2</code>) o los pagos de un nodo terminal (<code>P: -1, -1</code>).</li>
      <li>Los pagos van en el orden de los jugadores: 1, 2, 3… Con nombres como G y B, en el orden en que aparecen, o fíjalo con una primera línea <code>jugadores: G, B</code>.</li>
      <li><b>Conjunto de información:</b> pon la misma etiqueta entre corchetes en los nodos que el jugador no distingue: <code>Z: 2 [h]</code> y <code>X: 2 [h]</code>. Deben tener las mismas acciones.</li>
      <li><b>Azar:</b> usa el jugador <code>Azar</code> y la probabilidad de cada rama: <code>Alta (1/3): 2</code>.</li>
      <li>Se aceptan negativos, decimales con punto y fracciones (<code>1/2</code>). Lo que va después de <code>#</code> es un comentario.</li></ul></details></div>
    <div id="${P}-out" class="slv-out"></div>`;
  const tx=$(`${P}-tx`);
  const card=(n,t,body)=>`<div class="stepc"><h4><span class="n">${n}</span>${t}</h4>${practice?`<button class="btn reveal" type="button" data-reveal>Ver la solución de este paso</button><div hidden>${body}</div>`:`<div>${body}</div>`}</div>`;
  const run=()=>{let T;const out=$(`${P}-out`);
    try{T=GT.extParse(tx.value)}catch(e){out.innerHTML=`<p class="err">Revisa el árbol: ${e.message}</p>`;return}
    const N=GT.extNormal(T),R=GT.extSPE(T),pl=T.players,np=pl.length;last={T,N,R};if(sel>=R.spe.length)sel=0;
    const spe=R.spe[sel],reach=spe?GT.extReach(T,spe.behav):null;
    const pS=p=>`S${sb(pl[p])}`,piS=p=>`π${sb(pl[p])}`;
    let h="",k=1;
    // 1. árbol
    h+=`<div class="stepc"><h4><span class="n">${k++}</span>Forma extensiva</h4>${extTree(T,{behav:practice?null:spe&&spe.behav,reach:practice?null:reach,subs:true})}
      <div class="legend">${practice?"":`<span><i style="background:var(--exam)"></i>Camino del equilibrio</span><span><i style="background:var(--line)"></i>Lo que se haría fuera del camino</span>`}<span><i style="background:transparent;border:1.6px solid var(--branch);border-radius:50%;width:12px;height:12px"></i>Inicio de un subjuego propio</span><span><i style="background:transparent;border-top:2px dotted var(--ink);height:0"></i>Conjunto de información</span></div>
      ${!practice&&R.spe.length>1?`<label class="selw" for="${P}-sel" style="max-width:420px">Equilibrio resaltado<select id="${P}-sel">${R.spe.map((s,i)=>`<option value="${i}" ${i===sel?"selected":""}>${i+1}. ${pl.map((_,p)=>extBehavText(T,p,s.behav)).join(", ")}</option>`).join("")}</select></label>`:""}</div>`;
    // 2. elementos
    const Hp=p=>T.H.filter(x=>x.p===p);
    h+=card(k++,"Jugadores y conjuntos de información",`<div class="eq al" style="text-align:left">N = ${setS(pl)}${T.nodes.some(n=>n.kind==="c")?" &nbsp;(más el azar, que no es jugador: solo mueve con probabilidades fijas)":""}</div>
      <ul>${pl.map((_,p)=>`<li><b>Jugador ${pl[p]}</b>: ${Hp(p).length} conjunto${Hp(p).length>1?"s":""} de información. ${Hp(p).map((x,i)=>`h${sb(`${pl[p]}${Hp(p).length>1?","+(i+1):""}`)} = {${x.nodes.map(GT.extHistory).join("; ")}} con acciones ${setS(x.acts)}`).join(" · ")}</li>`).join("")}</ul>
      <p>${T.perfect?"Todos los conjuntos tienen un solo nodo: el juego es de <b>información perfecta</b> (cada jugador sabe todo lo que pasó antes de mover).":"Hay conjuntos con varios nodos (unidos con línea punteada): el juego es de <b>información imperfecta</b>. El jugador no sabe en cuál de esos nodos está, así que elige la misma acción en todos."}</p>`);
    // 3. estrategias
    const sz=N.S.map(s=>s?s.length:null);
    h+=card(k++,"Estrategias: planes completos",`<p>Una estrategia dice qué hacer en <b>cada</b> conjunto de información del jugador, incluso en los que no se alcanzan.</p>
      <div class="eq al" style="text-align:left">${pl.map((_,p)=>{const Hs=Hp(p),prod=Hs.map(x=>setS(x.acts)).join(" × "),cnt=Hs.map(x=>x.acts.length);
        return `${pS(p)} = ${prod}${N.S[p]&&N.S[p].length<=24?` = ${setS(N.S[p].map(s=>s.name))}`:""} &nbsp;→&nbsp; |${pS(p)}| = ${cnt.length>1?cnt.join(" × ")+" = ":""}${cnt.reduce((a,b)=>a*b,1)}`}).join("<br>")}</div>
      ${pl.map((_,p)=>Hp(p).length>1?`<p class="hint" style="margin:0">Jugador ${pl[p]}: ${Hp(p).map((x,i)=>`la ${["primera","segunda","tercera","cuarta","quinta","sexta"][i]||`${i+1}.ª`} parte es lo que hace ${extWhere(x)}`).join("; ")}.</p>`:"").join("")}`);
    // 4. forma estratégica
    if(N.tooBig)h+=card(k++,"Forma estratégica",`<p>La tabla tendría ${N.total?N.total.toLocaleString("es-CO"):"demasiados"} perfiles, demasiado grande para mostrarla. Los equilibrios perfectos en subjuegos sí se calculan abajo.</p>`);
    else{let b=`<div class="eq al" style="text-align:left">G(Γ) = {N, S${sb("i")}, π${sb("i")}} con ${pl.map((_,p)=>`${pS(p)} = ${setS(N.S[p].map(s=>s.name))}`).join(", ")}</div>`;
      const neN=N.ne.map(idx=>`(${idx.map((i,p)=>N.S[p][i].name).join(", ")})`);
      if(np===2){const br=GT.bestResponses(N.G);b+=`<p>Cada celda se obtiene recorriendo el árbol con las dos estrategias. Subrayados, los mejores pagos de cada jugador.</p>${matHTML(N.G,{br,ne:br.ne,p1:pl[0],p2:pl[1]})}`}
      else if(np===3)b+=`<p>Una tabla por cada estrategia del jugador ${pl[2]}; cada celda es (${pl.map((_,p)=>piS(p)).join(", ")}).</p><div class="t3grid">${N.S[2].map((s3,c)=>`<div class="tbl gm"><table><tr><th>${pS(2)} = ${s3.name}</th>${N.S[1].map(s=>`<th>${s.name}</th>`).join("")}</tr>${N.S[0].map((s1,a)=>`<tr><th>${s1.name}</th>${N.S[1].map((_,bb)=>{const ne=N.ne.some(x=>x[0]===a&&x[1]===bb&&x[2]===c);return `<td class="${ne?"ne":""}">${N.payOf([a,bb,c]).map(qs_).join(", ")}</td>`}).join("")}</tr>`).join("")}</table></div>`).join("")}</div>`;
      b+=`<div class="eq al" style="text-align:left"><b>EN (puras) = ${neN.length?`{ ${neN.join(", ")} }`:"∅"}</b></div>`;
      if(np===2&&N.S[0].length>1&&N.S[1].length>1){const se=supportEnum(N.G).eq.filter(e=>e.I.length>1||e.J.length>1);if(se.length)b+=`<p class="hint" style="margin:0">En mixtas la tabla tiene además ${se.length===1?"un equilibrio":`${se.length} equilibrios`}; para el detalle, copia la tabla en el resolvedor paso a paso.</p>`}
      h+=card(k++,"Forma estratégica y equilibrios de Nash",b)}
    // 5. subjuegos
    const subs=R.subs,prop=subs.filter(n=>n!==T.root);
    h+=card(k++,"Subjuegos",`<p>Un subjuego empieza en un nodo que es por sí solo un conjunto de información y contiene <b>completos</b> todos los conjuntos de información que toca. ${prop.length?`Además del juego completo hay ${prop.length} subjuego${prop.length>1?"s":""} propio${prop.length>1?"s":""} (marcados con un círculo en el árbol):`:"Este juego no tiene subjuegos propios: el único subjuego es el juego completo, así que todo equilibrio de Nash es perfecto en subjuegos."}</p>
      ${prop.length?`<ul>${prop.map(n=>`<li>El que empieza ${n.hist.length?`después de <b>${n.hist.join(", ")}</b>`:"al inicio"} (mueve ${n.kind==="c"?"el azar":"el jugador "+n.pl}).</li>`).join("")}</ul>`:""}
      ${T.H.some(x=>x.nodes.length>1)?`<p class="hint" style="margin:0">Un nodo que está en un conjunto de información con otros nodos nunca inicia un subjuego: quien mueve allí no sabe dónde está.</p>`:""}`);
    // 6. EPS paso a paso
    let b="";const seenX=new Map();
    R.steps.forEach(st=>{const x=st.x,isRoot=x===T.root,cnt=(seenX.get(x.id)||0)+1;seenX.set(x.id,cnt);
      const title=isRoot?(prop.length?"Juego completo, con los subjuegos ya resueltos":"Juego completo"):`Subjuego que empieza después de ${x.hist.join(", ")}`;
      let s=`<div class="ext-step"><p><b>${title}</b>${cnt>1?` · caso ${cnt}`:""}</p>`;
      if(st.kids.length)s+=`<p>Se reemplaza cada subjuego ya resuelto por los pagos de su equilibrio: ${st.kids.map((kd,i)=>`después de ${kd.hist.join(", ")} → (${st.combo[i].pay.map(qs_).join(", ")})`).join("; ")}.</p>`;
      const single=st.act.length===1&&st.Hs.length===1&&st.Hs[0].nodes.length===1;
      if(!st.act.length)s+=`<p>Solo mueve el azar: el pago esperado es (${st.found[0].pay.map(qs_).join(", ")}).</p>`;
      else if(single){const p=st.act[0],hh=st.Hs[0];const vals=hh.acts.map((a,i)=>({a,v:st.payOf([i])[p]}));const mx=vals.reduce((m,o)=>o.v.gt(m)?o.v:m,vals[0].v);
        s+=`<div class="eq al" style="text-align:left">Jugador ${pl[p]}: ${vals.map(o=>`${o.a} → ${piS(p)} = ${qs_(o.v)}`).join(", ")} &nbsp;⇒&nbsp; elige <b>${vals.filter(o=>o.v.eq(mx)).map(o=>o.a).join(" o ")}</b></div>`;
        if(vals.filter(o=>o.v.eq(mx)).length>1)s+=`<p class="hint" style="margin:0">Hay empate: cada opción da un equilibrio distinto y se siguen todas hacia arriba.</p>`}
      else if(st.act.length===1){const p=st.act[0];s+=`<div class="eq al" style="text-align:left">Solo decide el jugador ${pl[p]}, con varios conjuntos: ${st.S[0].map((sg,i)=>`${sg.name} → ${qs_(st.payOf([i])[p])}`).join(", ")} &nbsp;⇒&nbsp; elige <b>${st.ne.map(i=>st.S[0][i[0]].name).join(" o ")}</b></div>`}
      else if(st.G2){const G2=st.G2,br=GT.bestResponses(G2),p1=pl[G2.act[0]],p2=pl[G2.act[1]];
        s+=`<p>Aquí deciden los jugadores ${p1} y ${p2} sin saber todo lo que hizo el otro, así que se resuelve como un juego en forma estratégica:</p>${matHTML(G2,{br,ne:br.ne,p1,p2})}
          <div class="eq al" style="text-align:left">EN en puras = ${br.ne.length?`{ ${br.ne.map(([i,j])=>`(${G2.R[i]}, ${G2.C[j]})`).join(", ")} }`:"∅"}</div>`;
        if(G2.R.length===2&&G2.C.length===2&&(st.mixed.length||!br.ne.length))s+=`<p>${br.ne.length?"Además hay un equilibrio en mixtas:":"No hay equilibrio en puras, así que se busca en mixtas:"}</p>${mixedHTML(G2,p1,p2)}`;
        else if(st.mixed.length)s+=`<div class="eq al" style="text-align:left">${st.mixed.map(m=>`En mixtas: σ${sb(p1)} = (${m.mix[0].map(t=>t.s()).join(", ")}) sobre ${setS(G2.R)}, σ${sb(p2)} = (${m.mix[1].map(t=>t.s()).join(", ")}) sobre ${setS(G2.C)} · pagos (${m.pay.map(qs_).join(", ")})`).join("<br>")}</div>`;
        if(G2.degenerate)s+=`<p class="hint" style="margin:0">Hay empates en los pagos: puede haber tramos con infinitos equilibrios además de los que se listan.</p>`}
      else{s+=`<p>Deciden ${st.act.length} jugadores a la vez. Equilibrios de Nash en puras de este juego: ${st.ne.length?st.ne.map(idx=>`(${idx.map((i,t)=>st.S[t][i].name).join(", ")})`).join(", "):"ninguno"}.</p>`;
        if(!st.ne.length)s+=`<p class="hint" style="margin:0">Con tres o más jugadores el resolvedor solo busca equilibrios en puras.</p>`}
      b+=s+"</div>"});
    if(R.truncated)b+=`<p class="hint" style="margin:0">Hay muchos empates; se muestran los primeros casos.</p>`;
    const speTxt=R.spe.map(s=>`(${pl.map((_,p)=>extBehavText(T,p,s.behav)).join(", ")})`);
    const pureSpe=R.spe.filter(s=>pl.every((_,p)=>T.H.filter(x=>x.p===p).every(x=>s.behav[x.key].some(v=>v.eq(1)))));
    const pathOf=s=>{const r=GT.extReach(T,s.behav),o=[];const go=n=>{if(n.kind==="t")return;const as=n.acts.filter(a=>!r.get(a.child.id).z());if(n.kind==="d"&&as.length===1){o.push(`${n.pl} juega ${as[0].a}`);go(as[0].child)}}; go(T.root);return o.join(", luego ")};
    b+=R.spe.length?`<div class="verdict acc">EPS = { ${speTxt.join("; ")} }</div>
      <ul>${R.spe.map((s,i)=>{const pth=pathOf(s);return `<li>${speTxt[i]}: ${pth?`en el camino, ${pth}; `:""}pagos esperados (${s.pay.map(qs_).join(", ")}).</li>`}).join("")}</ul>`
      :`<div class="verdict warnv">No se encontró un equilibrio en puras en algún subjuego con tres o más jugadores; puede existir en mixtas.</div>`;
    if(R.spe.some(s=>!pureSpe.includes(s))&&np>0)b+=`<p class="hint" style="margin:0">Las expresiones como (1/4·X + 3/4·Y) son estrategias de comportamiento: la probabilidad con la que el jugador elige cada acción en ese conjunto de información.</p>`;
    if(!N.tooBig&&N.ne){const name=idx=>`(${idx.map((i,p)=>N.S[p][i].name).join(", ")})`,speN=new Set(pureSpe.map(s=>`(${pl.map((_,p)=>extBehavText(T,p,s.behav)).join(", ")})`));
      const notSpe=N.ne.map(name).filter(x=>!speN.has(x));
      if(notSpe.length)b+=`<p>Los equilibrios de Nash ${notSpe.join(", ")} no son perfectos en subjuegos: piden jugar algo que no es óptimo en un subjuego que no se alcanza. Son <b>amenazas no creíbles</b>; cuando llega el momento, al jugador no le conviene cumplirlas.</p>`;
      else if(pureSpe.length)b+=`<p>Todos los equilibrios de Nash en puras son también perfectos en subjuegos.</p>`}
    h+=card(k++,`Equilibrio perfecto en subjuegos (${T.perfect?"inducción hacia atrás":"inducción hacia atrás por subjuegos"})`,`<p>${T.perfect?"Se resuelve desde el final: en cada nodo, quien mueve elige lo mejor para él sabiendo lo que pasará después.":"Se resuelven primero los subjuegos más pequeños, se reemplaza cada uno por los pagos de su equilibrio y se sigue hacia arriba. Donde un jugador no sabe lo que hizo el otro, ese pedazo se resuelve como un juego simultáneo (Nash, en puras o mixtas)."}</p>${b}`);
    out.innerHTML=h;
    const s2=$(`${P}-sel`);if(s2)s2.onchange=e=>{sel=+e.target.value;run()}};
  const load=key=>{tx.value=EXTP[key].x;sel=0;run()};
  $(`${P}-pre`).onchange=e=>load(e.target.value);
  tx.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(()=>{sel=0;run()},250)});
  tx.addEventListener("keydown",e=>{if(e.key==="Tab"){e.preventDefault();const a=tx.selectionStart,z=tx.selectionEnd;tx.value=tx.value.slice(0,a)+"  "+tx.value.slice(z);tx.selectionStart=tx.selectionEnd=a+2;tx.dispatchEvent(new Event("input"))}
    if(e.key==="Enter"){const a=tx.selectionStart,ls=tx.value.lastIndexOf("\n",a-1)+1,ind=tx.value.slice(ls,a).match(/^ */)[0],prev=tx.value.slice(ls,a).trim(),dest=prev.includes(":")?prev.slice(prev.indexOf(":")+1).trim():prev,opens=dest&&!dest.includes(",")&&dest[0]!=="("&&dest[0]!=="#"&&!/^jugadores/i.test(prev),extra=opens?"  ":"";
      e.preventDefault();const ins="\n"+ind+extra;tx.value=tx.value.slice(0,a)+ins+tx.value.slice(tx.selectionEnd);tx.selectionStart=tx.selectionEnd=a+ins.length;tx.dispatchEvent(new Event("input"))}});
  $(`${P}-pr`).onchange=e=>{practice=e.target.checked;run()};
  root.addEventListener("click",e=>{const b=e.target.closest("[data-reveal]");if(b){b.nextElementSibling.hidden=false;b.remove()}});
  load(preset)}

SIMS.ext=()=>extUI($("sim"),"fig1");
SIMS.seq=()=>extUI($("sim"),"ent");
SIMS.sub=()=>extUI($("sim"),"fig2");

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
    $("ar-res").innerHTML=tiles([["Oferta de los trabajadores",fmt(wg)],["Oferta de la empresa",fmt(wf)],["Brecha entre ofertas",fmt(wg-wf)]]);
    const pdf=x=>Math.exp(-0.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
    $("ar-plot").innerHTML=curvePlot({lo:m-4*s,hi:m+4*s,curves:[{f:pdf}],areas:[{f:pdf,a:m-4*s,b:m,col:"--bad",op:.15},{f:pdf,a:m,b:m+4*s,col:"--line",op:.15}],marks:[{x:wf,label:`w*f = ${fmt(wf)}`,col:"--bad",dash:1},{x:wg,label:`w*g = ${fmt(wg)}`,col:"--line",dash:1,row:1},{x:m,label:`m = ${fm(m)}`,col:"--muted",dash:1,row:2}],xl:"salario que el árbitro considera justo (x)",label:"Distribución del salario justo según el árbitro"});
    $("ar-txt").innerHTML=`Cada parte gana el arbitraje con probabilidad 1/2, porque el punto medio de las ofertas coincide con m. Si σ sube, la brecha crece: con más incertidumbre sobre el árbitro, las ofertas pueden ser más agresivas.`};
  bindCtl(["ar-m","ar-s"],run);run();
};

// ---------- Forma extensiva general: árbol, forma estratégica, EN, EPS y EBP (motor EXT)
const EXP={
  eps1:{t:"EPS · Ejemplo 1 (amenaza no creíble)",x:"r 1: A>n2 B>(0,2)\nn2 2: a>(-1,-1) b>(1,1)"},
  eps2:{t:"EPS · Ejemplo 2",x:"r 1: A>n2 D>(2,0)\nn2 2: B>n3 E>(1,1)\nn3 1: C>(0,2) F>(3,0)"},
  damme:{t:"EPS · Ejemplo 3 (van Damme, 1987)",x:"r 1: A>n2 B>(1,1)\nn2 2: a>n3 b>(2,2)\nn3 1: C>(0,3) D>(-1,-1)"},
  ent:{t:"Taller 3 · Ej. 1 · Entrada al mercado (millones US$)",x:"r 1: E>n2 NE>(0,2)\nn2 2: P>(-1,-1) C>(1,1)"},
  ns:{t:"Taller 3 · Ej. 2 · Norte o Sur en secuencia",x:"r 1: N>a S>b\na 2: N>(4,3) S>(2,2)\nb 2: N>(1,1) S>(3,4)"},
  f1:{t:"Taller 3 · Ej. 3 · Figura 1",x:"r 1: A>x B>y\nx 2 h: X>z Y>(5,5)\ny 2 h: X>(8,3) Y>(3,8)\nz 1: C>(1,0) D>(2,10)"},
  f2:{t:"Taller 3 · Ej. 4 · Figura 2",x:"r 1: C>(3,2) B>x A>y\nx 2 h: b>(3,1) a>(0,2)\ny 2 h: b>(0,0) a>(3,1)"},
  f3:{t:"Taller 3 · Ej. 5 · Figura 3",x:"r 1: A>(1,3) B>x C>y\nx 2 h: a>(0,1) b>(0,2)\ny 2 h: a>(0,0) b>(2,1)"},
  f4:{t:"Taller 3 · Ej. 6 · Figura 4 (tres jugadores)",x:"r 1: C>x B>y\nx 2: C'>(1,1,1) B'>z\ny 3 h: I>(3,2,2) D>(0,0,0)\nz 3 h: I>(4,4,0) D>(0,0,1)"},
  f5:{t:"Taller 3 · Ej. 6 · Figura 5",x:"r 1: A>x B>(1,0)\nx 2: a>y b>w\ny 1 h: C>(3,-1) D>(1,-2)\nw 1 h: C>(0,-3) D>(0,0)"},
  f6:{t:"Taller 3 · Ej. 9 · Figura 6",x:"r 1: Z>x X>y Y>w\nx 2 h: R>(1,1) L>(0,0)\ny 2 h: R>(0,0) L>v\nv 1: B>(3,2) A>(1,2)\nw 2 k: R>(2,2) L>(2,3)"},
  ebp1:{t:"EBP · Ejemplo 1",x:"r 1: A>(0,2) B>x C>y\nx 2 h: a>(2,1) b>(-1,-1)\ny 2 h: a>(1,1) b>(-2,0)"},
  ebp2:{t:"EBP · Ejemplo 2",x:"r 1: D>(1,3) C>x I>y\nx 2 h: a>(0,1) b>(0,2)\ny 2 h: a>(0,0) b>(2,1)"},
  tres:{t:"EBP · Tres jugadores (requisito 4)",x:"r 1: A>x B>(1,0,3)\nx 2: X>y Y>z\ny 3 h: C>(2,2,2) D>(0,2,0)\nz 3 h*: C>(0,1,0) D>(2,1,2)"},
  req5:{t:"EBP · Requisito 5 (estrategias dominadas)",x:"r 1: D>(2,2) C>x I>y\nx 2 h: a>(0,1) b>(1,0)\ny 2 h*: a>(0,0) b>(3,1)"}};
const uS=u=>`(${u.map(qs_).join(", ")})`;
function arbTree(g,A,path){const ids=g.pre,leaves=ids.filter(id=>g.nodes[id].leaf),Y={},dx=150,dy=34;let k=0;
  const place=id=>{const n=g.nodes[id];if(n.leaf){Y[id]=k++*dy;return Y[id]}const ys=n.ch.map(place);Y[id]=(ys[0]+ys[ys.length-1])/2;return Y[id]};place(g.root);
  const md=Math.max(...ids.map(id=>g.nodes[id].depth)),W=40+md*dx+120,H=(leaves.length-1)*dy+56,X=id=>24+g.nodes[id].depth*dx,YY=id=>28+Y[id];
  const onP=new Set(path||[]);let e="",t="";
  ids.forEach(id=>{const n=g.nodes[id];if(n.leaf){t+=`<text x="${X(id)+7}" y="${YY(id)+4}" font-size="12.5" fill="var(--ink)" font-family="var(--f-mono)">${uS(n.u)}</text>`;return}
    n.ch.forEach((c,a)=>{const ch=A&&A[n.si]===a,hot=ch&&onP.has(id)&&onP.has(c);
      e+=`<line x1="${X(id)}" y1="${YY(id)}" x2="${X(c)}" y2="${YY(c)}" stroke="var(${ch?"--exam":"--line"})" stroke-width="${hot?4.5:ch?3:1.6}" stroke-linecap="round"/>`;
      const mx=(X(id)+X(c))/2,my=(YY(id)+YY(c))/2;t+=`<text x="${mx}" y="${my-6}" font-size="12" text-anchor="middle" fill="var(--ink)" font-weight="${ch?700:500}">${n.acts[a]}</text>`});
    t+=`<circle cx="${X(id)}" cy="${YY(id)}" r="5.5" fill="var(--ink)"/><text x="${X(id)-4}" y="${YY(id)-10}" font-size="12" text-anchor="end" fill="var(--muted)">${n.pl}</text>`});
  g.sets.forEach(s=>{if(s.nodes.length<2)return;const ns=s.nodes.slice().sort((a,b)=>Y[a]-Y[b]);
    for(let i=0;i+1<ns.length;i++)e+=`<line x1="${X(ns[i])}" y1="${YY(ns[i])}" x2="${X(ns[i+1])}" y2="${YY(ns[i+1])}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    if(s.nodes.length===2)s.nodes.forEach((id,j)=>t+=`<text x="${X(id)+9}" y="${YY(id)+(Y[id]===Math.min(...s.nodes.map(z=>Y[z]))?16:-9)}" font-size="12" fill="var(--exam)" font-weight="600">${j===s.muIdx?"μ":"1−μ"}</text>`)});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" aria-label="Árbol del juego en forma extensiva">${e}${t}</svg></div>`}
const nodeTxt=(g,id)=>{const p=g.nodes[id].path;if(!p.length)return"la raíz";return "el nodo al que se llega con "+p.map(([x,k])=>g.nodes[x].acts[k]).join(", ")};
const sgTxt=(g,r)=>r===g.root?"el juego completo":"el subjuego que empieza después de "+g.nodes[r].path.map(([x,k])=>g.nodes[x].acts[k]).join(", ");
function arbStrategic(g,sol){const S=sol.S,nm=(p,k)=>EXT.stratName(g,p,S[p][k]),find=pr=>sol.all.find(z=>z.prof.join()===pr.join());
  if(g.n===2){const G={R:S[0].map((_,i)=>nm(0,i)),C:S[1].map((_,j)=>nm(1,j))};G.A=G.R.map((_,i)=>G.C.map((_,j)=>find([i,j]).u[0]));G.B=G.R.map((_,i)=>G.C.map((_,j)=>find([i,j]).u[1]));
    const br=GT.bestResponses(G);return{G,html:matHTML(G,{br,ne:br.ne})}}
  if(g.n===3){let h=`<div class="t3grid">`;S[2].forEach((_,k)=>{h+=`<div class="tbl gm"><table><tr><th>S₃ = ${nm(2,k)}</th>${S[1].map((_,j)=>`<th>${nm(1,j)}</th>`).join("")}</tr>${S[0].map((_,i)=>`<tr><th>${nm(0,i)}</th>${S[1].map((_,j)=>{const z=find([i,j,k]);return `<td class="${sol.ne.includes(z)?"ne":""}">${z.u.map(qs_).join(", ")}</td>`}).join("")}</tr>`).join("")}</table></div>`});return{html:h+"</div>"}}
  return{html:`<p>${sol.all.map(z=>sol.name(z)+" → "+uS(z.u)).join("<br>")}</p>`}}
function arbStep(g,st,n){const who=p=>`jugador ${p}`;let h=`<p><b>${n}. Resolvemos ${sgTxt(g,st.r)}.</b>`;
  if(st.inner.length)h+=` Los subjuegos de adentro ya están resueltos y se reemplazan por sus pagos: ${st.inner.map(o=>`${sgTxt(g,o.x).replace("el subjuego que empieza ","")} → ${uS(o.u)}`).join("; ")}.`;h+="</p>";
  const s=st.strat;
  if(s.length===1&&s[0].os.length===1){const si=s[0].os[0],set=g.sets[si],p=s[0].p;
    h+=`<ul>${st.prof.map(pr=>`<li>Con ${set.acts[s[0].L[pr[0]][0]]}, el ${who(p)} recibe ${qs_(st.val(pr)[p-1])}; pagos ${uS(st.val(pr))}</li>`).join("")}</ul><p>El ${who(p)} elige <b>${st.eqs.map(e=>set.acts[s[0].L[e[0]][0]]).join(" o ")}</b>.</p>`;return h}
  const nmR=(i,k)=>{const a=s[i].os.map((si,j)=>g.sets[si].acts[s[i].L[k][j]]);return a.length===1?a[0]:`(${a.join(", ")})`};
  if(s.length===2){const G={R:s[0].L.map((_,i)=>nmR(0,i)),C:s[1].L.map((_,j)=>nmR(1,j))};G.A=G.R.map((_,i)=>G.C.map((_,j)=>st.val([i,j])[s[0].p-1]));G.B=G.R.map((_,i)=>G.C.map((_,j)=>st.val([i,j])[s[1].p-1]));
    const br=GT.bestResponses(G);h+=`<p>Hay movidas sin información perfecta, así que este subjuego se resuelve como un juego simultáneo (filas: ${who(s[0].p)}; columnas: ${who(s[1].p)}).</p>`+matHTML(G,{br,ne:br.ne,p1:String(s[0].p),p2:String(s[1].p)});
    if(st.mixed){h+=`<p>No hay equilibrio en puras. En mixtas, el ${who(s[0].p)} juega ${G.R[0]} con probabilidad ${qs_(st.p)} para que el otro quede indiferente, y el ${who(s[1].p)} juega ${G.C[0]} con probabilidad ${qs_(st.x)}.</p>`}
    else h+=`<p>Equilibrio${st.eqs.length>1?"s":""} de este subjuego: ${st.eqs.map(e=>`(${nmR(0,e[0])}, ${nmR(1,e[1])})`).join(", ")}.</p>`;return h}
  h+=`<div class="tbl"><table><tr><th>Perfil</th><th>Pagos</th><th>¿Equilibrio?</th></tr>${st.prof.map(pr=>`<tr class="${st.eqs.includes(pr)?"ne":""}"><td>(${pr.map((k,i)=>nmR(i,k)).join(", ")})</td><td class="num">${uS(st.val(pr))}</td><td>${st.eqs.includes(pr)?"✓":""}</td></tr>`).join("")}</table></div>`;return h}
SIMS.arbol=function(opt){opt=opt||{};const pfx=opt.id||"ex",secs=opt.sections||["forma","nash","eps","ebp"],list=opt.presets||Object.keys(EXP);let txt=EXP[opt.preset||list[0]].x,pick=-1;
  $("sim").innerHTML=`<div class="row slv-top"><label class="selw" for="${pfx}-pre">Ejercicio<select id="${pfx}-pre">${list.map(k=>`<option value="${k}"${k===(opt.preset||list[0])?" selected":""}>${EXP[k].t}</option>`).join("")}</select></label></div>
  <details class="exted"><summary>Editar o escribir otro árbol</summary><p class="hint">Una línea por nodo de decisión: <code>nombre jugador conjunto : acción&gt;destino …</code>. El destino es otro nodo o los pagos entre paréntesis. Los nodos con el mismo conjunto (por ejemplo <code>h</code>) están unidos por la línea punteada; si no escribes conjunto, el nodo está solo. Un <code>*</code> después del conjunto (<code>h*</code>) indica a qué nodo se refiere μ.</p><textarea id="${pfx}-tx" rows="6" spellcheck="false" aria-label="Árbol del juego"></textarea></details>
  <div id="${pfx}-out" class="slv-out"></div>`;
  const tx=$(pfx+"-tx");tx.value=txt;
  const run=()=>{let g,sol;try{g=EXT.parse(tx.value);sol=EXT.solve(g)}catch(e){$(pfx+"-out").innerHTML=`<p class="err">Revisa el árbol: ${e.message}</p>`;return}
    const hl=pick>=0&&sol.all[pick]?sol.all[pick]:null,S=sol.S,out=[];let n=0;
    const chips=(arr,lab)=>arr.length?`<div class="chips" role="group" aria-label="${lab}">${arr.map(z=>{const i=sol.all.indexOf(z);return `<button type="button" data-i="${i}" aria-pressed="${i===pick}">${sol.name(z)}</button>`}).join("")}</div>`:"";
    out.push(`<div class="stepc"><h4><span class="n">${++n}</span>Forma extensiva</h4>${arbTree(g,hl&&hl.A,hl&&hl.path)}<p class="hint">${hl?`Resaltado: ${sol.name(hl)}. Las ramas de color son las acciones que el perfil elige en cada nodo; la más gruesa es la trayectoria que se juega.`:"Toca un equilibrio de abajo para ver en el árbol qué elige cada jugador."}</p></div>`);
    if(secs.includes("forma")){const sf=arbStrategic(g,sol);
      out.push(`<div class="stepc"><h4><span class="n">${++n}</span>Forma estratégica</h4><p>Una estrategia es un plan completo: dice qué hace el jugador en <b>cada</b> conjunto de información, aunque no se llegue a él.</p>
      <div class="eq al" style="text-align:left">G(Γ) = {N, S${sb("i")}, π${sb("i")}} con N = {${[...Array(g.n)].map((_,p)=>p+1).join(", ")}}${S.map((s,p)=>`<br>S${sb(p+1)} = ${g.players[p].length>1?g.players[p].map(si=>setS(g.sets[si].acts)).join(" × ")+" = ":""}${setS(s.map(v=>EXT.stratName(g,p,v)))}`).join("")}</div>${sf.html}</div>`)}
    if(secs.includes("nash"))out.push(`<div class="stepc"><h4><span class="n">${++n}</span>Equilibrios de Nash en puras</h4><div class="eq al" style="text-align:left">EN = ${sol.ne.length?`{ ${sol.ne.map(sol.name).join(", ")} }`:"∅"}</div>${chips(sol.ne,"Equilibrios de Nash")}</div>`);
    if(secs.includes("eps")){const roots=sol.roots,bw=EXT.backward(g);
      let h=`<p>Un subjuego empieza en un nodo que está solo en su conjunto de información y no corta ningún conjunto de información. Este juego tiene ${roots.length} subjuego${roots.length>1?"s":""}: ${roots.map(r=>sgTxt(g,r)).join("; ")}.${roots.length===1?" Como no hay subjuegos propios, todo EN es EPS.":""}</p>`;
      if(roots.length>1){const seen=new Set(),byR={};let j=0;
        bw.forEach(b=>b.steps.forEach(st=>{const key=st.r+"|"+JSON.stringify(st.A0);if(seen.has(key))return;seen.add(key);(byR[st.r]=byR[st.r]||[]).push(key);
          const cs=byR[st.r].length>1||bw.some(o=>o.steps.some(t=>t.r===st.r&&JSON.stringify(t.A0)!==JSON.stringify(st.A0)));
          const cap=cs&&Object.keys(st.A0).length?`<p class="hint">Caso en que adentro se juega ${Object.entries(st.A0).map(([si,a])=>`${g.sets[si].acts[a]} (jugador ${g.sets[si].pl})`).join(", ")}:</p>`:"";
          h+=cap+arbStep(g,st,++j)}))}
      bw.slice(0,4).forEach(b=>{
        if(b.mixed){const m=b.mixed;h+=`<div class="verdict warnv">No hay EPS en estrategias puras. El EPS es en mixtas: el jugador ${m.pl[0]} juega ${m.G.R[0]} con probabilidad ${qs_(m.p)} y ${m.G.R[1]} con ${qs_(GT.q(1).sub(m.p))}; el jugador ${m.pl[1]} juega ${m.G.C[0]} con ${qs_(m.x)} y ${m.G.C[1]} con ${qs_(GT.q(1).sub(m.x))}${Object.keys(b.A).length?`; en los demás nodos: ${Object.entries(b.A).map(([si,a])=>`${g.sets[si].acts[a]} (jugador ${g.sets[si].pl})`).join(", ")}`:""}. Pagos esperados: ${uS(m.u)}.</div>`}});
      if(bw.length>4)h+=`<p class="hint">Hay ${bw.length} ramas; se muestran 4.</p>`;
      const noSPE=sol.ne.filter(z=>!z.spe);
      h+=`<div class="verdict ${sol.spe.length?"acc":"warnv"}">EPS en puras = ${sol.spe.length?`{ ${sol.spe.map(sol.name).join(", ")} }`:"∅"}</div>${chips(sol.spe,"Equilibrios perfectos en subjuegos")}`;
      if(noSPE.length)h+=`<p>Los demás EN no son perfectos en subjuegos:</p><ul>${noSPE.map(z=>`<li>${sol.name(z)}: en ${sgTxt(g,z.fail.r)}, el jugador ${z.fail.p+1} gana ${qs_(z.fail.gain)} en vez de ${qs_(z.fail.base)} si en ese subjuego juega ${(()=>{const U=EXT.under(g,z.fail.r),v=S[z.fail.p][z.fail.k],own=g.players[z.fail.p];const a=own.map((si,k)=>g.sets[si].nodes.some(x=>U.has(x))?g.sets[si].acts[v[k]]:null).filter(Boolean);return a.join(", ")})()}. Lo que el perfil dice que haría ahí no es creíble.</li>`).join("")}</ul>`;
      out.push(`<div class="stepc"><h4><span class="n">${++n}</span>Equilibrios perfectos en subjuegos (inducción hacia atrás)</h4>${h}</div>`)}
    if(secs.includes("ebp")){const pb=EXT.pbe(g,sol),multi=g.sets.filter(s=>s.nodes.length>1);
      let h=multi.length?`<p>${multi.map(s=>s.nodes.length===2?`En el conjunto de información del jugador ${s.pl} (${s.nodes.map(x=>nodeTxt(g,x).replace("el nodo al que se llega con ","")).join(" / ")}), μ es la probabilidad que asigna a ${nodeTxt(g,s.nodes[s.muIdx])} y 1 − μ al otro.`:`El conjunto del jugador ${s.pl} tiene ${s.nodes.length} nodos.`).join(" ")}</p>`:`<p>Todos los conjuntos de información tienen un solo nodo: las creencias son triviales y los EBP coinciden con los EPS.</p>`;
      h+=`<ol class="steps"><li><b>Requisito 1:</b> en cada conjunto de información el jugador tiene una creencia μ.</li><li><b>Requisito 2:</b> dada la creencia, su acción es óptima (racionalidad secuencial).</li><li><b>Requisito 3:</b> en la trayectoria de equilibrio, μ sale de la regla de Bayes.</li><li><b>Requisito 4:</b> fuera de la trayectoria, también se usa Bayes donde sea posible (dentro de cada subjuego).</li></ol>`;
      const strong=pb.filter(x=>x.ok),weak=pb.filter(x=>!x.ok&&x.weakOk);
      const muCol=(x,weakMode)=>x.info.filter(i=>!i.single).map(i=>{const fv=weakMode?i.muW:i.muS,txt=fv?`μ = ${fv.s()} (Bayes)`:EXT.muText({free:i.free,multi:i.multi});return `${g.sets[i.si].nodes.length>2?"":""}${txt}${i.r5&&!weakMode?` · con el requisito 5: μ = ${i.r5.mu.s()} ${i.r5.ok?"✓":"✗"}`:""}`}).join("; ")||"—";
      h+=`<div class="tbl"><table><tr><th>Perfil</th><th>Creencias que lo sostienen</th><th>Trayectoria</th></tr>${strong.map(x=>`<tr class="ne"><td>${sol.name(x.z)}</td><td>${muCol(x)}</td><td class="num">${uS(x.z.u)}</td></tr>`).join("")||`<tr><td colspan="3">Ningún perfil en puras cumple los requisitos 1 a 4.</td></tr>`}</table></div>`;
      h+=`<div class="verdict ${strong.length?"acc":"warnv"}">EBP en puras = ${strong.length?`{ ${strong.map(x=>`(${sol.name(x.z)}, ${muCol(x).replace(/ \(Bayes\)/g,"")})`).join("; ")} }`:"∅"}</div>${chips(strong.map(x=>x.z),"Equilibrios bayesianos perfectos")}`;
      const r5bad=strong.filter(x=>!x.r5ok);if(r5bad.length)h+=`<p><b>Requisito 5.</b> Fuera de la trayectoria, la creencia debe dar probabilidad cero a los nodos a los que solo se llega con una estrategia estrictamente dominada. ${r5bad.map(x=>sol.name(x.z)).join(", ")} ${r5bad.length>1?"no lo cumplen":"no lo cumple"}: con esa creencia la acción del jugador deja de ser óptima.</p>`;
      if(weak.length)h+=`<p><b>Solo débil.</b> ${weak.map(x=>`${sol.name(x.z)} con ${muCol(x,true)}`).join("; ")} cumple los requisitos 1 a 3 pero no el 4: la creencia contradice lo que el propio perfil dice que pasa en un subjuego al que no se llega.</p>`;
      const fails=sol.spe.filter(z=>!strong.some(x=>x.z===z));
      if(fails.length)h+=`<p>EPS que no son EBP: ${fails.map(z=>{let why="";for(let si=0;si<g.sets.length;si++){const s=g.sets[si];if(s.nodes.length<2)continue;const p=s.pl-1,a=z.A[si];const anyB=s.nodes.length===2?EXT.interval(s.acts.map((_,b)=>[EXT.cont(g,z.A,s.nodes[s.muIdx],a)[p].sub(EXT.cont(g,z.A,s.nodes[s.muIdx],b)[p]),EXT.cont(g,z.A,s.nodes[1-s.muIdx],a)[p].sub(EXT.cont(g,z.A,s.nodes[1-s.muIdx],b)[p])])):true;
        if(!anyB){why=`la acción ${s.acts[a]} del jugador ${s.pl} no es óptima con ninguna creencia μ (está dominada en ese conjunto de información)`;break}}return `${sol.name(z)}${why?": "+why:""}`}).join("; ")}.</p>`;
      out.push(`<div class="stepc"><h4><span class="n">${++n}</span>Equilibrio bayesiano perfecto</h4>${h}</div>`)}
    $(pfx+"-out").innerHTML=out.join("");
    $(pfx+"-out").querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;pick=pick===i?-1:i;run()})};
  $(pfx+"-pre").onchange=e=>{tx.value=EXP[e.target.value].x;pick=-1;run()};tx.addEventListener("input",()=>{pick=-1;run()});run()};

// ---------- Funciones de reacción lineales: s1 = α1 + β1·s2, s2 = α2 + β2·s1
function reacPlot({R1,R2,pts=[],xl,yl,max}){const W=420,H=330,f=frame(W,H,[0,max],[0,max],ticks(0,max,nice(max/5)),ticks(0,max,nice(max/5)),xl,yl);let b="";
  const line=(fx,col,dash)=>{const P=[];for(let i=0;i<=80;i++){const t=max*i/80,[x,y]=fx(t);if(x>=-1e-9&&y>=-1e-9&&x<=max*1.0001&&y<=max*1.0001)P.push([x,y])}
    return P.length>1?`<path d="${P.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(${col})" stroke-width="2.5" ${dash?'stroke-dasharray="7 5"':""}/>`:""};
  b+=line(t=>[R1.f(t),t],"--line");b+=line(t=>[t,R2.f(t)],"--branch",1);
  b+=`<text x="${f.W-f.R-4}" y="${f.T+14}" text-anchor="end" font-size="12" fill="var(--line)">${R1.lab}</text><text x="${f.W-f.R-4}" y="${f.T+30}" text-anchor="end" font-size="12" fill="var(--branch)">${R2.lab}</text>`;
  pts.forEach(p=>{if(p.x>max||p.y>max)return;b+=`<circle cx="${f.sx(p.x)}" cy="${f.sy(p.y)}" r="6.5" fill="var(${p.col||"--exam"})" stroke="var(--card)" stroke-width="2"/><text x="${f.sx(p.x)+9}" y="${f.sy(p.y)-8}" font-size="12" fill="var(${p.col||"--exam"})" font-weight="600">${p.lab}</text>`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" style="max-width:${W+60}px" role="img" aria-label="Funciones de mejor respuesta">${f.g}<line x1="${f.L}" x2="${f.W-f.R}" y1="${f.sy(0)}" y2="${f.sy(0)}" stroke="var(--muted)"/><line x1="${f.L}" x2="${f.L}" y1="${f.sy(0)}" y2="${f.T}" stroke="var(--muted)"/>${b}</svg></div>`}
SIMS.reac=function(opt){opt=opt||{};let mod=opt.model||"cournot";
  const M={cournot:{t:"Cournot",c:[["re-a","a (intercepto de la demanda)",10,200,1,100],["re-b","b (pendiente)",0.2,5,0.1,1],["re-c","c (costo marginal)",0,90,1,10],["re-n","N (número de firmas)",1,50,1,2]]},
    bert:{t:"Bertrand diferenciado",c:[["re-a","a (demanda propia)",0,100,1,10],["re-b","b (sustitución, b < 2)",0,1.9,0.05,1],["re-c","c (costo marginal)",0,50,1,4]]},
    esf:{t:"Esfuerzo en la relación",c:[["re-c","c (constante)",0.5,20,0.5,4]]}};
  $("sim").innerHTML=`${seg("re-m","Modelo",Object.keys(M).map(k=>[k,M[k].t]),mod)}<div id="re-box"></div>`;
  const draw=()=>{$("re-box").innerHTML=`<div class="ctr">${M[mod].c.map(a=>ctl(...a)).join("")}</div><div class="res" id="re-res"></div><div id="re-plot"></div><div id="re-txt"></div>`;bindCtl(M[mod].c.map(a=>a[0]),run);run()};
  const run=()=>{const v=id=>V(id);let h="";
    if(mod==="cournot"){const a=v("re-a"),b=v("re-b"),c=v("re-c"),N=Math.max(1,Math.round(v("re-n")));if(!(b>0)||!(a>c)){$("re-res").innerHTML="";$("re-txt").innerHTML=`<p class="err">Hace falta a &gt; c y b &gt; 0.</p>`;$("re-plot").innerHTML="";return}
      const q=(a-c)/((N+1)*b),Q=N*q,P=a-b*Q,pi=(P-c)*q;
      $("re-res").innerHTML=tiles([["Cada firma produce",fm(q)],["Total del mercado",fm(Q)],["Precio",fm(P)],["Beneficio de cada firma",fm(pi)]]);
      const R=t=>Math.max(0,(a-c-b*t)/(2*b)),mx=(a-c)/b;
      $("re-plot").innerHTML=N===2?reacPlot({R1:{f:R,lab:"r₁(q₂)"},R2:{f:R,lab:"r₂(q₁)"},pts:[{x:q,y:q,lab:"EN"}],xl:"q₁",yl:"q₂",max:mx}):"";
      const rows=[1,2,3,5,10,100,1000].map(n=>{const qq=(a-c)/((n+1)*b);return `<tr${n===N?' class="ne"':""}><td>${n}</td><td class="num">${fm(qq)}</td><td class="num">${fm(n*qq)}</td><td class="num">${fm(a-b*n*qq)}</td><td class="num">${fm((a-b*n*qq-c)*qq)}</td></tr>`}).join("");
      h=`<p>Condición de primer orden de la firma i: \\(a-b\\,Q_{-i}-2b\\,q_i-c=0\\Rightarrow r_i(Q_{-i})=\\dfrac{a-c-b\\,Q_{-i}}{2b}\\). Con simetría \\(Q_{-i}=(N-1)q\\):</p>
      <div class="mj">\\[q^*=\\frac{a-c}{(N+1)\\,b}\\qquad Q^*=\\frac{N}{N+1}\\cdot\\frac{a-c}{b}\\qquad P^*=\\frac{a+N c}{N+1}\\]</div>
      <div class="tbl"><table><tr><th>N</th><th>Cada firma</th><th>Total</th><th>Precio</th><th>Beneficio</th></tr>${rows}</table></div><p>Cuando \\(N\\to\\infty\\), \\(P^*\\to c\\) y \\(Q^*\\to(a-c)/b\\): el resultado de competencia perfecta. Con \\(N=1\\) se obtiene el monopolio.</p>`}
    if(mod==="bert"){const a=v("re-a"),b=v("re-b"),c=v("re-c");if(!(b<2)||b<0){$("re-txt").innerHTML=`<p class="err">Hace falta 0 ≤ b &lt; 2.</p>`;return}
      const p=(a+c)/(2-b),q=a-p+b*p,pi=(p-c)*q;
      $("re-res").innerHTML=tiles([["Precio de cada firma",fm(p)],["Cantidad de cada firma",fm(q)],["Beneficio de cada firma",fm(pi)],["Margen sobre el costo",fm(p-c)]]);
      const R=t=>(a+c+b*t)/2,mx=Math.max(p*1.6,R(0)*2.2,1);
      $("re-plot").innerHTML=reacPlot({R1:{f:R,lab:"R₁(p₂)"},R2:{f:R,lab:"R₂(p₁)"},pts:[{x:p,y:p,lab:"EN"}],xl:"p₁",yl:"p₂",max:mx});
      h=`<p>Demanda \\(q_i=a-p_i+b\\,p_j\\). Beneficio \\(\\pi_i=(p_i-c)(a-p_i+b\\,p_j)\\). Condición de primer orden:</p><div class="mj">\\[a-2p_i+b\\,p_j+c=0\;\\Rightarrow\;R_i(p_j)=\\frac{a+c+b\\,p_j}{2}\\qquad p^*=\\frac{a+c}{2-b}\\]</div>
      <p>Las funciones de reacción tienen pendiente positiva: los precios son <b>complementos estratégicos</b>. En el Taller 2, Ej. 12 (\\(b=1\\)): \\(p^*=a+c\\), \\(q^*=a\\), \\(\\pi^*=a^2\\). En el Ej. 5 (\\(F_i=-p_i+p_j\\), es decir \\(a=0,\\ b=1\\)): \\(p^*=c\\) y el beneficio es cero, así que la paradoja de Bertrand se mantiene.</p>`}
    if(mod==="esf"){const c=v("re-c");const e=c,u=c*c;$("re-res").innerHTML=tiles([["Esfuerzo de cada uno",fm(e)],["Bienestar de cada uno",fm(u)],["Bienestar si ambos suben 1",fm((e+1)*c)]]);
      const R=t=>(c+t)/2;$("re-plot").innerHTML=reacPlot({R1:{f:R,lab:"e₁ = r₁(e₂)"},R2:{f:R,lab:"e₂ = r₂(e₁)"},pts:[{x:e,y:e,lab:"EN"}],xl:"e₁",yl:"e₂",max:c*2.2});
      h=`<p>\\(u_1=e_1(c+e_2-e_1)\\). Condición de primer orden: \\(c+e_2-2e_1=0\\), así que</p><div class="mj">\\[r_1(e_2)=\\frac{c+e_2}{2},\\qquad r_2(e_1)=\\frac{c+e_1}{2},\\qquad e_1^*=e_2^*=c,\\qquad u_1^*=u_2^*=c^2\\]</div>
      <p>El esfuerzo del otro aumenta mi bienestar, pero nadie lo tiene en cuenta al elegir el suyo. Si los dos subieran el esfuerzo a la vez a \\(c+k\\), cada uno obtendría \\((c+k)c&gt;c^2\\): el equilibrio es ineficiente, con muy poco esfuerzo.</p>`}
    $("re-txt").innerHTML=h;typeset($("re-txt"))};
  bindSeg("re-m",k=>{mod=k;draw()});draw()};

// ---------- Recursos comunes (pescadores) y bienes públicos: Nash contra óptimo social
SIMS.comunes=function(){let mod="pesca";
  $("sim").innerHTML=`${seg("co-m","Modelo",[["pesca","Pescadores (recurso común)"],["bp","Bien público"]],mod)}<div id="co-box"></div>`;
  const C={pesca:[["co-A","A en ρ(H) = A − bH",10,200,1,100],["co-b","b",0.1,5,0.1,1],["co-k","k en c(h) = k·h²/2",0.1,10,0.1,1],["co-n","n pescadores",1,30,1,5]],bp:[["co-al","α (peso del bien público)",0.1,3,0.1,1],["co-w","w (dotación)",1,200,1,90],["co-n","n agentes",1,30,1,2]]};
  const draw=()=>{$("co-box").innerHTML=`<div class="ctr">${C[mod].map(a=>ctl(...a)).join("")}</div><div class="res" id="co-res"></div><div id="co-txt"></div>`;bindCtl(C[mod].map(a=>a[0]),run);run()};
  const run=()=>{const n=Math.max(1,Math.round(V("co-n")));let h="";
    if(mod==="pesca"){const A=V("co-A"),b=V("co-b"),k=V("co-k");const hN=A/(b*(n+1)+k),hP=A/(2*b*n+k),U=x=>(A-b*n*x)*x-k*x*x/2;
      $("co-res").innerHTML=tiles([["Horas de cada uno, Nash",fm(hN)],["Horas de cada uno, planificador",fm(hP)],["Utilidad de cada uno, Nash",fm(U(hN))],["Utilidad de cada uno, planificador",fm(U(hP))]]);
      h=`<p><b>Planificador:</b> \\(\\max_{h_1,\\dots,h_n}\\sum_i[\\rho(H)h_i-c(h_i)]\\). La condición de primer orden para cada \\(h_i\\) es</p><div class="mj">\\[\\rho(H)+\\rho'(H)\\,H=c'(h_i)\\]</div>
      <p><b>Juego:</b> \\(G(\\Gamma)=\\{N=\\{1,\\dots,n\\},\;S_i=[0,T],\;U_i(h_i,h_{-i})=\\rho(H)h_i-c(h_i)\\}\\). Cada pescador maximiza solo su utilidad:</p><div class="mj">\\[\\rho(H^*)+\\rho'(H^*)\\,h_i^*=c'(h_i^*)\\]</div>
      <p>La diferencia está en \\(\\rho'(H)\\,h_i\\) contra \\(\\rho'(H)\\,H\\): cada pescador solo cuenta cuánto baja el retorno de <b>sus</b> horas. Como \\(\\rho'&lt;0\\), en el EN se trabajan más horas que en el óptimo y todos quedan peor (tragedia de los comunes). Con las formas del laboratorio: \\(h^N=\\dfrac{A}{b(n+1)+k}\\) y \\(h^P=\\dfrac{A}{2bn+k}\\); coinciden solo si \\(n=1\\).</p>`}
    else{const al=V("co-al"),w=V("co-w");const gN=al*w/(n+al),gP=al*w/(1+al),u=g=>al*Math.log(n*g)+Math.log(w-g);
      $("co-res").innerHTML=tiles([["Aporte de cada uno, Nash",fm(gN)],["G de Nash",fm(n*gN)],["Aporte eficiente",fm(gP)],["G eficiente",fm(n*gP)],["Utilidad Nash",fm(u(gN))],["Utilidad eficiente",fm(u(gP))]]);
      h=`<p>Con \\(u_i=\\alpha\\ln G+\\ln x_i\\), \\(x_i=w-g_i\\) y \\(G=\\sum_j g_j\\).</p><p><b>Eficiencia (Lindahl-Bowen-Samuelson):</b> la suma de las tasas marginales de sustitución es igual a la tasa marginal de transformación (aquí 1):</p><div class="mj">\\[\\sum_{i=1}^n \\mathrm{TMS}_i=\\sum_{i=1}^n\\frac{\\partial u_i/\\partial G}{\\partial u_i/\\partial x_i}=\\sum_i\\frac{\\alpha\\,x_i}{G}=1\;\\Rightarrow\;g^P=\\frac{\\alpha w}{1+\\alpha}\\]</div>
      <p><b>Aportes voluntarios (EN):</b> cada uno toma como dado el aporte de los demás e iguala su <b>propia</b> TMS a 1:</p><div class="mj">\\[\\frac{\\alpha\\,x_i}{G}=1\;\\Rightarrow\;g^N=\\frac{\\alpha w}{n+\\alpha}\\]</div><p>Con \\(n&gt;1\\) el bien público queda subprovisto: cada uno ignora el beneficio que su aporte da a los otros (problema del polizón).</p>`}
    $("co-txt").innerHTML=h;typeset($("co-txt"))};
  bindSeg("co-m",k=>{mod=k;draw()});draw()};

// ---------- Stackelberg: líder y seguidora
SIMS.stack=function(){
  $("sim").innerHTML=`<div class="ctr">${ctl("st-M","M (intercepto)",10,200,1,100)}${ctl("st-d","d (pendiente)",0.2,5,0.1,1)}${ctl("st-c","c (costo marginal)",0,90,1,10)}</div><div class="res" id="st-res"></div><div id="st-plot"></div><div class="tbl" id="st-tab"></div>`;
  const run=()=>{const M=V("st-M"),d=V("st-d"),c=V("st-c");if(!(M>c)||!(d>0)){$("st-res").innerHTML=`<p class="err">Hace falta M &gt; c y d &gt; 0.</p>`;return}
    const q1=(M-c)/(2*d),q2=(M-c)/(4*d),qc=(M-c)/(3*d),P=M-d*(q1+q2),Pc=M-2*d*qc;
    $("st-res").innerHTML=tiles([["Líder produce",fm(q1)],["Seguidora produce",fm(q2)],["Precio",fm(P)],["Beneficio líder",fm((P-c)*q1)],["Beneficio seguidora",fm((P-c)*q2)]]);
    const R=t=>Math.max(0,(M-c-d*t)/(2*d));
    $("st-plot").innerHTML=reacPlot({R1:{f:R,lab:"r₁(q₂) (Cournot)"},R2:{f:R,lab:"s̃₂(q₁)"},pts:[{x:qc,y:qc,lab:"Cournot",col:"--muted"},{x:q1,y:q2,lab:"Stackelberg"}],xl:"q₁",yl:"q₂",max:(M-c)/d});
    $("st-tab").innerHTML=`<table><tr><th></th><th>Firma 1</th><th>Firma 2</th><th>Total</th><th>Precio</th><th>Beneficio 1</th><th>Beneficio 2</th></tr><tr class="ne"><td>Stackelberg</td><td class="num">${fm(q1)}</td><td class="num">${fm(q2)}</td><td class="num">${fm(q1+q2)}</td><td class="num">${fm(P)}</td><td class="num">${fm((P-c)*q1)}</td><td class="num">${fm((P-c)*q2)}</td></tr><tr><td>Cournot</td><td class="num">${fm(qc)}</td><td class="num">${fm(qc)}</td><td class="num">${fm(2*qc)}</td><td class="num">${fm(Pc)}</td><td class="num">${fm((Pc-c)*qc)}</td><td class="num">${fm((Pc-c)*qc)}</td></tr></table>`};
  bindCtl(["st-M","st-d","st-c"],run);run()};

// ---------- Negociación de Stahl (1972) y Rubinstein (1982)
SIMS.neg=function(){let rule="exo";
  $("sim").innerHTML=`<div class="ctr">${ctl("ng-d1","δ₁ (paciencia del jugador 1)",0,0.99,0.01,0.9)}${ctl("ng-d2","δ₂ (paciencia del jugador 2)",0,0.99,0.01,0.8)}${ctl("ng-T","T (períodos)",1,40,1,3)}${ctl("ng-s","s (reparto impuesto en T)",0,1,0.05,0.5)}</div>
  ${seg("ng-r","Qué pasa en el último período",[["exo","Se impone (s, 1 − s), como en Gibbons"],["ult","El que propone se queda con todo"]],rule)}<div class="res" id="ng-res"></div><div class="tbl" id="ng-tab"></div><p id="ng-txt"></p>`;
  const run=()=>{const d1=V("ng-d1"),d2=V("ng-d2"),T=Math.max(1,Math.round(V("ng-T"))),s=V("ng-s");if(!(d1>=0&&d1<1&&d2>=0&&d2<1&&s>=0&&s<=1))return;
    const x=Array(T+1);x[T]=rule==="exo"?s:(T%2===1?1:0);const rows=[];
    for(let t=T;t>=1;t--){if(t<T)x[t]=t%2===1?1-d2*(1-x[t+1]):d1*x[t+1];
      rows.push(`<tr${t===1?' class="ne"':""}><td>${t}</td><td>${t===T&&rule==="exo"?"(se impone)":t%2===1?"Jugador 1":"Jugador 2"}</td><td class="num">${fmt(x[t],4)}</td><td class="num">${fmt(1-x[t],4)}</td><td>${t===T?(rule==="exo"?"Reparto dado":"El que responde acepta 0"):t%2===1?`Ofrece al 2 exactamente δ₂·(1 − x${sb(t+1)}) = ${fmt(1-x[t],4)}`:`Ofrece al 1 exactamente δ₁·x${sb(t+1)} = ${fmt(x[t],4)}`}</td></tr>`)}
    const inf=(1-d2)/(1-d1*d2);
    $("ng-res").innerHTML=tiles([["Parte del jugador 1 en t = 1",fmt(x[1],4)],["Parte del jugador 2 en t = 1",fmt(1-x[1],4)],["Rubinstein (T → ∞): jugador 1",fmt(inf,4)]]);
    $("ng-tab").innerHTML=`<table><tr><th>Período</th><th>Propone</th><th>Parte del 1</th><th>Parte del 2</th><th>Razonamiento</th></tr>${rows.join("")}</table>`;
    $("ng-txt").innerHTML=`Se resuelve desde el último período hacia atrás: quien propone le ofrece al otro justo lo que este obtendría esperando un período (descontado), y el otro acepta en el primer período. Con T grande el resultado se acerca a x* = (1 − δ₂)/(1 − δ₁δ₂) = ${fmt(inf,4)}, sin importar la regla del final.`};
  bindCtl(["ng-d1","ng-d2","ng-T","ng-s"],run);bindSeg("ng-r",k=>{rule=k;run()});run()};

SIMS.cour=()=>SIMS.reac({model:"cournot"});SIMS.bertr=()=>SIMS.reac({model:"bert"});SIMS.esf=()=>SIMS.reac({model:"esf"});
SIMS.eps=()=>SIMS.arbol({id:"xe",preset:"eps1",sections:["forma","nash","eps"],presets:["eps1","eps2","damme","ent","ns","f1","f4","f5","f6"]});
SIMS.ebp=()=>SIMS.arbol({id:"xb",preset:"ebp1",sections:["forma","nash","eps","ebp"],presets:["ebp1","ebp2","tres","req5","f2","f3","f4","f5","f6"]});
SIMS.extfull=()=>SIMS.arbol({id:"xf",preset:"f6"});
