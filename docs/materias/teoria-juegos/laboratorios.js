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
    $("ar-res").innerHTML=tiles([["Oferta del sindicato w*g",fmt(wg)],["Oferta de la empresa w*f",fmt(wf)],["Brecha w*g − w*f",fmt(wg-wf)]]);
    const pdf=x=>Math.exp(-0.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
    $("ar-plot").innerHTML=curvePlot({lo:m-4*s,hi:m+4*s,curves:[{f:pdf}],areas:[{f:pdf,a:m-4*s,b:m,col:"--bad",op:.15},{f:pdf,a:m,b:m+4*s,col:"--line",op:.15}],marks:[{x:wf,label:`w*f = ${fmt(wf)}`,col:"--bad",dash:1},{x:wg,label:`w*g = ${fmt(wg)}`,col:"--line",dash:1,row:1},{x:m,label:`m = ${fm(m)}`,col:"--muted",dash:1,row:2}],xl:"salario que el árbitro considera justo (x)",label:"Distribución del salario justo según el árbitro"});
    $("ar-txt").innerHTML=`Cada parte gana el arbitraje con probabilidad 1/2, porque el punto medio de las ofertas coincide con m. Si σ sube, la brecha crece: con más incertidumbre sobre el árbitro, las ofertas pueden ser más agresivas.`};
  bindCtl(["ar-m","ar-s"],run);run();
};
