
// ===================== PRÁCTICA GUIADA: «HAZLO TÚ» =====================
// El estudiante hace cada paso del procedimiento; la app revisa, da pistas y explica el porqué.
// Modos: Nash en una tabla · Mixtas 2×2 · Inducción hacia atrás (EPS) · Creencias (EBP).
(function(){
const Z=()=>GT.q(0),Qs=x=>qs_(x),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rnd=n=>Math.floor(Math.random()*n),pick=a=>a[rnd(a.length)];
const parseIn=v=>{try{const t=String(v).trim().replace(",",".").replace(/−/g,"-");return t?GT.parseQ(t):null}catch(e){return null}};
const ok=m=>`<div class="gu-fb ok"><b>¡Bien!</b> ${m}</div>`,no=m=>`<div class="gu-fb no"><b>Todavía no.</b> ${m}</div>`,info=m=>`<div class="gu-fb">${m}</div>`;
const STY=`<style>
.gu-steps{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 12px}.gu-steps span{font-size:12.5px;padding:3px 10px;border-radius:99px;border:1px solid var(--line);color:var(--muted)}
.gu-steps span.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}.gu-steps span.done{border-color:var(--ok,#2e7d32);color:var(--ok,#2e7d32)}
.gu-q{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:10px 0;background:var(--card,transparent)}
.gu-q h4{margin:0 0 6px;font-size:15px}.gu-why{font-size:14px;color:var(--ink-2,var(--muted));margin:4px 0 8px}
.gu-fb{margin:10px 0 0;padding:9px 12px;border-radius:10px;background:color-mix(in srgb,var(--line) 35%,transparent);font-size:14.5px}
.gu-fb.ok{background:color-mix(in srgb,#2e7d32 14%,transparent)}.gu-fb.no{background:color-mix(in srgb,#c62828 12%,transparent)}
.gu-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}
.gu-t{border-collapse:separate;border-spacing:4px;margin:6px 0}.gu-t th{font-weight:600;padding:4px 8px;text-align:center}
.gu-t td{border:1px solid var(--line);border-radius:8px;padding:6px 8px;text-align:center;white-space:nowrap}
.gu-t td.ne{background:color-mix(in srgb,var(--exam) 22%,transparent);border-color:var(--exam)}.gu-t td.pick{outline:2px solid var(--exam)}
.gu-t td.col{background:color-mix(in srgb,var(--line) 30%,transparent)}
.gu-n{font:inherit;font-family:var(--f-mono);font-size:15px;border:0;background:none;padding:2px 5px;border-radius:6px;color:var(--ink);cursor:default}
.gu-n.act{cursor:pointer;background:color-mix(in srgb,var(--line) 45%,transparent)}.gu-n.act:hover{background:color-mix(in srgb,var(--exam) 25%,transparent)}
.gu-n.sel{background:var(--exam);color:var(--paper)}.gu-n.br{text-decoration:underline;text-decoration-thickness:2.5px;text-underline-offset:4px;font-weight:700}
.gu-n.bad{background:#c62828;color:#fff}
.gu-eq{font-family:var(--f-mono);font-size:14.5px;display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:6px 0}
.gu-eq input{width:4.2em;font:inherit;padding:4px 6px;border-radius:7px;border:1px solid var(--line);text-align:center;background:var(--paper);color:var(--ink)}
.gu-eq input.bad{border-color:#c62828;background:color-mix(in srgb,#c62828 10%,var(--paper))}.gu-eq input.good{border-color:#2e7d32}
.gu-opts{display:flex;flex-direction:column;gap:6px;margin-top:8px}.gu-opts button{text-align:left;font:inherit;padding:8px 12px;border-radius:9px;border:1px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer}
.gu-opts button:hover{border-color:var(--exam)}.gu-opts button.good{border-color:#2e7d32;background:color-mix(in srgb,#2e7d32 12%,var(--paper))}.gu-opts button.badb{border-color:#c62828;background:color-mix(in srgb,#c62828 10%,var(--paper))}
.gu-box select,#gu-box select{max-width:100%}#gu-box .selw{max-width:100%;min-width:0}
.gu-sum{border-left:4px solid var(--exam);padding:8px 12px;margin:12px 0;background:color-mix(in srgb,var(--exam) 8%,transparent);border-radius:0 10px 10px 0}
</style>`;
const bar=(names,k)=>`<div class="gu-steps">${names.map((n,i)=>`<span class="${i<k?"done":i===k?"on":""}">${i<k?"✓ ":""}${i+1}. ${n}</span>`).join("")}</div>`;

// ---------- Banco de ejercicios
const tabla=k=>{const P=PRESETS[k];const A=[],B=[];P.cells.forEach((r,i)=>{A.push([]);B.push([]);r.forEach(c=>{const p=String(c).split(/[;,]\s*|\s+/).filter(Boolean);A[i].push(GT.parseQ(p[0]));B[i].push(GT.parseQ(p[1]))})});return{t:P.t,R:P.R.slice(),C:P.C.slice(),A,B}};
const TAB=Object.keys(PRESETS).filter(k=>!PRESETS[k].zs&&PRESETS[k].R.length<=4&&PRESETS[k].C.length<=4);
const randTab=(m,n)=>{const L="ABCDEF",Rr="ABC".slice(0,m).split(""),Cc="XYZ".slice(0,n).split(""),A=[],B=[];for(let i=0;i<m;i++){A.push([]);B.push([]);for(let j=0;j<n;j++){A[i].push(GT.q(rnd(7)));B[i].push(GT.q(rnd(7)))}}return{t:`Aleatorio ${m}×${n}`,R:Rr,C:Cc,A,B}};
const mix=G=>{if(G.R.length!==2||G.C.length!==2)return null;const A=G.A,B=G.B;
  const dp=B[0][0].sub(B[1][0]).sub(B[0][1]).add(B[1][1]);if(dp.z())return null;const p=B[1][1].sub(B[1][0]).div(dp);
  const dq=A[0][0].sub(A[0][1]).sub(A[1][0]).add(A[1][1]);if(dq.z())return null;const q=A[1][1].sub(A[0][1]).div(dq);
  if(!(p.gt(0)&&p.lt(1)&&q.gt(0)&&q.lt(1)))return null;return{p,q}};
const MIXK=TAB.filter(k=>mix(tabla(k)));
const ARB={eps1:EXP.eps1,eps2:EXP.eps2,damme:EXP.damme,ent:EXP.ent,ns:EXP.ns,
  bseq:{t:"Taller 1 · Batalla de los sexos secuencial",x:EXP.t1bseq.x},
  ciem:{t:"Ciempiés de cuatro etapas",x:"r 1: C>a S>(1,0)\na 2: C>b S>(0,2)\nb 1: C>c S>(3,1)\nc 2: C>(4,4) S>(2,5)"},
  tres:{t:"Tres etapas con amenaza",x:"r 1: I>a D>b\na 2: x>(3,1) y>c\nc 1: L>(0,0) R>(4,2)\nb 2: x>(2,2) y>(1,3)"}};
const EBPK={f2:EXP.f2,f3:EXP.f3,ebp1:EXP.ebp1,ebp2:EXP.ebp2,
  umb:{t:"Creencia con umbral",x:"r 1: A>(2,2) B>x C>y\nx 2 h: a>(3,2) b>(0,0)\ny 2 h: a>(0,0) b>(3,1)"}};
const selEx=(id,O,keys,cur)=>`<label class="selw">Ejercicio <select id="${id}">${keys.map(k=>`<option value="${k}"${k===cur?" selected":""}>${esc(O[k].t||k)}</option>`).join("")}</select></label>`;

// =====================================================================================
// 1) NASH EN UNA TABLA: subrayar mejores respuestas y cruzar
function modoNash(box){let key=TAB.includes("tabla2")?"tabla2":TAB[0],G=tabla(key),k=0,sel=new Set(),done1=new Set(),done2=new Set(),fb="";
  const BR1=()=>{const s=new Set();G.C.forEach((_,j)=>{let m=G.A[0][j];G.R.forEach((_,i)=>{if(G.A[i][j].gt(m))m=G.A[i][j]});G.R.forEach((_,i)=>{if(G.A[i][j].eq(m))s.add(i+","+j)})});return s};
  const BR2=()=>{const s=new Set();G.R.forEach((_,i)=>{let m=G.B[i][0];G.C.forEach((_,j)=>{if(G.B[i][j].gt(m))m=G.B[i][j]});G.C.forEach((_,j)=>{if(G.B[i][j].eq(m))s.add(i+","+j)})});return s};
  const NE=()=>{const a=BR1(),b=BR2();return new Set([...a].filter(x=>b.has(x)))};
  const name=x=>{const[i,j]=x.split(",").map(Number);return`(${G.R[i]}, ${G.C[j]})`};
  const steps=["Mejores respuestas del 1","Mejores respuestas del 2","Equilibrios de Nash"];
  const Q=[
    {h:"Paso 1 · ¿Qué le conviene al jugador 1 en cada columna?",why:`Ponte en los zapatos del jugador 1 (filas). Mira <b>una columna a la vez</b>: si el 2 juega esa columna, ¿qué fila le da más al 1? Toca el <b>primer número</b> más alto de cada columna. Si hay empate, toca todos los empatados.`},
    {h:"Paso 2 · ¿Qué le conviene al jugador 2 en cada fila?",why:`Ahora eres el jugador 2 (columnas). Mira <b>una fila a la vez</b>: si el 1 juega esa fila, ¿qué columna le da más al 2? Toca el <b>segundo número</b> más alto de cada fila.`},
    {h:"Paso 3 · ¿Dónde se cruzan?",why:`Un equilibrio de Nash es una celda con <b>los dos números subrayados</b>: ahí cada uno ya está respondiendo lo mejor a lo que hace el otro, así que nadie se arrepiente. Toca esas celdas. Si no hay ninguna, usa el botón «No hay en puras».`}];
  const draw=()=>{const br1=done1,br2=done2,ne=k>=3?NE():null;
    let t=`<div style="overflow-x:auto"><table class="gu-t"><tr><th>1 \\ 2</th>${G.C.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>`;
    G.R.forEach((r,i)=>{t+=`<tr><th>${esc(r)}</th>`;G.C.forEach((c,j)=>{const id=i+","+j,act1=k===0,act2=k===1;
      const c1=`gu-n${act1?" act":""}${(k===0&&sel.has(id))?" sel":""}${br1.has(id)?" br":""}`,c2=`gu-n${act2?" act":""}${(k===1&&sel.has(id))?" sel":""}${br2.has(id)?" br":""}`;
      t+=`<td data-cell="${id}" class="${ne&&ne.has(id)?"ne":""}${k===2&&sel.has(id)?" pick":""}" style="${k===2?"cursor:pointer":""}"><button type="button" class="${c1}" data-p="1" data-id="${id}">${Qs(G.A[i][j])}</button>,<button type="button" class="${c2}" data-p="2" data-id="${id}">${Qs(G.B[i][j])}</button></td>`});t+="</tr>"});t+="</table></div>";
    let body="";
    if(k<3){body=`<div class="gu-q"><h4>${Q[k].h}</h4><p class="gu-why">${Q[k].why}</p>${t}<div class="gu-row"><button class="btn" type="button" id="gn-chk">Revisar</button>${k===2?`<button class="btn ghost" type="button" id="gn-none">No hay en puras</button>`:""}<button class="btn ghost" type="button" id="gn-hint">Pista</button><button class="btn ghost" type="button" id="gn-sol">Ver la respuesta</button></div>${fb}</div>`}
    else{const n=[...NE()];body=`${t}<div class="gu-sum"><p><b>EN = {${n.map(name).join(", ")||"∅"}}</b></p><p>${n.length?`En ${n.length===1?"esa celda":"esas celdas"} ningún jugador gana cambiando él solo de estrategia: es lo que significa equilibrio de Nash.`:"No hay celda con los dos subrayados: no hay equilibrio en estrategias puras. En un 2×2 eso significa que hay que buscar el equilibrio en <b>estrategias mixtas</b> (pestaña «Mixtas»)."}${n.length>1?" Con varios equilibrios, la teoría no dice cuál se juega: hace falta un criterio extra (coordinación, eficiencia, quién mueve primero…).":""}</p></div><div class="gu-row"><button class="btn" type="button" id="gn-new">Otro ejercicio aleatorio</button></div>`}
    box.innerHTML=`<div class="gu-row" style="margin-top:0">${selEx("gn-ex",Object.fromEntries(TAB.map(x=>[x,PRESETS[x]])),TAB,key)}<button class="btn ghost" type="button" id="gn-rand">Aleatorio</button></div>${bar(steps,k)}${body}`;
    $("gn-ex").onchange=()=>{key=$("gn-ex").value;G=tabla(key);reset()};$("gn-rand").onclick=()=>{key="";G=randTab(2+rnd(2),2+rnd(2));reset()};
    if($("gn-new"))$("gn-new").onclick=()=>{G=randTab(2+rnd(2),2+rnd(2));reset()};
    box.querySelectorAll(".gu-n.act").forEach(b=>b.onclick=()=>{const id=b.dataset.id;sel.has(id)?sel.delete(id):sel.add(id);fb="";draw()});
    if(k===2)box.querySelectorAll("td[data-cell]").forEach(td=>td.onclick=()=>{const id=td.dataset.cell;sel.has(id)?sel.delete(id):sel.add(id);fb="";draw()});
    if($("gn-chk"))$("gn-chk").onclick=()=>check(false);if($("gn-none"))$("gn-none").onclick=()=>{sel.clear();check(false)};
    if($("gn-hint"))$("gn-hint").onclick=hint;if($("gn-sol"))$("gn-sol").onclick=()=>check(true)};
  const target=()=>k===0?BR1():k===1?BR2():NE();
  const check=sol=>{const T=target();if(sol){sel=new Set(T)}
    const miss=[...T].filter(x=>!sel.has(x)),extra=[...sel].filter(x=>!T.has(x));
    if(!miss.length&&!extra.length){if(k===0)done1=new Set(T);if(k===1)done2=new Set(T);
      const msg=k===0?"Esas son las mejores respuestas del 1: quedan subrayadas.":k===1?"Esas son las mejores respuestas del 2: quedan subrayadas.":"";k++;sel=new Set();fb=k<3?ok(msg):"";draw();return}
    const lines=[];
    if(k===0){G.C.forEach((c,j)=>{const col=G.R.map((r,i)=>`${r}: ${Qs(G.A[i][j])}`).join(", ");const want=G.R.filter((_,i)=>T.has(i+","+j)),got=G.R.filter((_,i)=>sel.has(i+","+j));if(want.join()!==got.join())lines.push(`Columna <b>${esc(c)}</b>: los pagos del 1 son ${col}. El más alto está en ${want.join(" y ")}.`)})}
    else if(k===1){G.R.forEach((r,i)=>{const row=G.C.map((c,j)=>`${c}: ${Qs(G.B[i][j])}`).join(", ");const want=G.C.filter((_,j)=>T.has(i+","+j)),got=G.C.filter((_,j)=>sel.has(i+","+j));if(want.join()!==got.join())lines.push(`Fila <b>${esc(r)}</b>: los pagos del 2 son ${row}. El más alto está en ${want.join(" y ")}.`)})}
    else{if(extra.length)lines.push(`${extra.map(name).join(", ")} no ${extra.length>1?"son":"es"} equilibrio: no tiene${extra.length>1?"n":""} los dos números subrayados.`);if(miss.length)lines.push(`Te falta${miss.length>1?"n":""} ${miss.length>1?"celdas":"una celda"} con los dos subrayados.`)}
    fb=no(lines.join("<br>"));draw()};
  const hint=()=>{const T=target();if(k===0){const j=G.C.findIndex((_,j)=>G.R.some((_,i)=>T.has(i+","+j)!==sel.has(i+","+j)));fb=info(`Pista: en la columna <b>${esc(G.C[j>=0?j:0])}</b>, compara solo los primeros números (${G.R.map((_,i)=>Qs(G.A[i][j>=0?j:0])).join(", ")}). ¿Cuál es el mayor?`)}
    else if(k===1){const i=G.R.findIndex((_,i)=>G.C.some((_,j)=>T.has(i+","+j)!==sel.has(i+","+j)));fb=info(`Pista: en la fila <b>${esc(G.R[i>=0?i:0])}</b>, compara solo los segundos números (${G.C.map((_,j)=>Qs(G.B[i>=0?i:0][j])).join(", ")}). ¿Cuál es el mayor?`)}
    else fb=info("Pista: busca las celdas donde el primer número y el segundo están subrayados a la vez.");draw()};
  const reset=()=>{k=0;sel=new Set();done1=new Set();done2=new Set();fb="";draw()};reset()}

// =====================================================================================
// 2) MIXTAS 2×2: indiferencia del otro
function modoMix(box){let key=MIXK.includes("tabla1")?"tabla1":MIXK[0],G=tabla(key),k=0,fb="",vals={};
  const steps=["Pagos del 2 con la mezcla del 1","Despejar σ del 1","Pagos del 1 con la mezcla del 2","Despejar σ del 2"];
  const draw=()=>{const M=mix(G),[r0,r1]=G.R,[c0,c1]=G.C,A=G.A,B=G.B,cl=G.R.some(r=>G.C.includes(r)),p=`σ<sub>${cl?"1":""}${esc(r0)}</sub>`,q=`σ<sub>${cl?"2":""}${esc(c0)}</sub>`;
    const tab=`<div style="overflow-x:auto"><table class="gu-t"><tr><th>1 \\ 2</th><th>${esc(c0)}</th><th>${esc(c1)}</th></tr>${[0,1].map(i=>`<tr><th>${esc(G.R[i])}</th>${[0,1].map(j=>`<td><span class="gu-n">${Qs(A[i][j])}</span>,<span class="gu-n" style="${k<=1?"font-weight:700;color:var(--exam)":""}">${Qs(B[i][j])}</span></td>`).join("")}</tr>`).join("")}</table></div>`;
    const inp=(id,ph)=>`<input id="${id}" inputmode="decimal" placeholder="${ph||"?"}" value="${vals[id]!==undefined?esc(vals[id]):""}">`;
    let body="";
    if(k===0)body=`<div class="gu-q"><h4>Paso 1 · ¿Cuánto espera ganar el 2 con cada columna?</h4><p class="gu-why">La idea clave: <b>el 1 escoge su probabilidad para dejar indiferente al 2</b>. Si el 2 no fuera indiferente, jugaría una sola columna y no habría mezcla. Por eso aquí se usan los <b>pagos del 2</b> (en color). ${p} es la probabilidad de que el 1 juegue ${esc(r0)}.</p>${tab}
      <div class="gu-eq">π<sub>2</sub>(${esc(c0)}) = ${inp("m0")}·${p} + ${inp("m1")}·(1 − ${p})</div><div class="gu-eq">π<sub>2</sub>(${esc(c1)}) = ${inp("m2")}·${p} + ${inp("m3")}·(1 − ${p})</div>`;
    else if(k===1)body=`<div class="gu-q"><h4>Paso 2 · Iguala y despeja ${p}</h4><p class="gu-why">Indiferencia: π<sub>2</sub>(${esc(c0)}) = π<sub>2</sub>(${esc(c1)}).</p>${tab}<div class="gu-eq">${Qs(B[0][0])}·${p} + ${Qs(B[1][0])}·(1 − ${p}) = ${Qs(B[0][1])}·${p} + ${Qs(B[1][1])}·(1 − ${p})</div><div class="gu-eq">${p} = ${inp("pv","ej. 1/3")}</div><p class="hint">Puedes escribir fracciones (2/5) o decimales.</p>`;
    else if(k===2)body=`<div class="gu-q"><h4>Paso 3 · Ahora al revés: ¿cuánto espera ganar el 1 con cada fila?</h4><p class="gu-why">El 2 escoge su probabilidad para dejar indiferente al 1. Se usan los <b>pagos del 1</b> (primer número). ${q} es la probabilidad de que el 2 juegue ${esc(c0)}.</p>${tab.replace(/font-weight:700;color:var\(--exam\)/g,"")}
      <div class="gu-eq">π<sub>1</sub>(${esc(r0)}) = ${inp("m4")}·${q} + ${inp("m5")}·(1 − ${q})</div><div class="gu-eq">π<sub>1</sub>(${esc(r1)}) = ${inp("m6")}·${q} + ${inp("m7")}·(1 − ${q})</div>`;
    else if(k===3)body=`<div class="gu-q"><h4>Paso 4 · Iguala y despeja ${q}</h4>${tab}<div class="gu-eq">${Qs(A[0][0])}·${q} + ${Qs(A[0][1])}·(1 − ${q}) = ${Qs(A[1][0])}·${q} + ${Qs(A[1][1])}·(1 − ${q})</div><div class="gu-eq">${q} = ${inp("qv","ej. 1/2")}</div>`;
    if(k<4)body+=`<div class="gu-row"><button class="btn" type="button" id="gm-chk">Revisar</button><button class="btn ghost" type="button" id="gm-sol">Ver la respuesta</button></div>${fb}</div>`;
    else{const u1=A[0][0].mul(M.q).add(A[0][1].mul(GT.q(1).sub(M.q))),u2=B[0][0].mul(M.p).add(B[1][0].mul(GT.q(1).sub(M.p)));
      body=`${tab}<div class="gu-sum"><p><b>σ = [ (${Qs(M.p)}, ${Qs(GT.q(1).sub(M.p))}) ; (${Qs(M.q)}, ${Qs(GT.q(1).sub(M.q))}) ]</b></p><p>El 1 juega ${esc(r0)} con probabilidad ${Qs(M.p)} y el 2 juega ${esc(c0)} con probabilidad ${Qs(M.q)}. Pagos esperados: π<sub>1</sub> = ${Qs(u1)}, π<sub>2</sub> = ${Qs(u2)}.</p><p><b>Lo que hay que recordar:</b> la probabilidad de cada jugador sale de los pagos <i>del otro</i>. Cada uno mezcla justo para que al rival le dé igual cualquier estrategia.</p></div><div class="gu-row"><button class="btn" type="button" id="gm-new">Otro ejercicio aleatorio</button></div>`}
    box.innerHTML=`<div class="gu-row" style="margin-top:0">${selEx("gm-ex",Object.fromEntries(MIXK.map(x=>[x,PRESETS[x]])),MIXK,key)}<button class="btn ghost" type="button" id="gm-rand">Aleatorio</button></div>${bar(steps,k)}${body}`;
    $("gm-ex").onchange=()=>{key=$("gm-ex").value;G=tabla(key);reset()};$("gm-rand").onclick=()=>{let H;do{H=randTab(2,2)}while(!mix(H));G=H;key="";reset()};
    if($("gm-new"))$("gm-new").onclick=()=>$("gm-rand").onclick();
    box.querySelectorAll(".gu-eq input").forEach(el=>el.oninput=()=>{vals[el.id]=el.value});
    if($("gm-chk"))$("gm-chk").onclick=()=>check(false);if($("gm-sol"))$("gm-sol").onclick=()=>check(true)};
  const check=sol=>{const M=mix(G),A=G.A,B=G.B;
    const want=k===0?{m0:B[0][0],m1:B[1][0],m2:B[0][1],m3:B[1][1]}:k===1?{pv:M.p}:k===2?{m4:A[0][0],m5:A[0][1],m6:A[1][0],m7:A[1][1]}:{qv:M.q};
    if(sol)Object.entries(want).forEach(([id,v])=>vals[id]=Qs(v).replace("−","-"));
    let bad=[];Object.entries(want).forEach(([id,v])=>{const x=parseIn(vals[id]);if(!x||!x.eq(v))bad.push(id)});
    if(!bad.length){const cl=G.R.some(r=>G.C.includes(r)),sp=`σ<sub>${cl?"1":""}${esc(G.R[0])}</sub>`,sq=`σ<sub>${cl?"2":""}${esc(G.C[0])}</sub>`;const msg=k===0?`Así se ve: para el 2, la columna ${esc(G.C[0])} paga ${Qs(B[0][0])} si el 1 juega ${esc(G.R[0])} y ${Qs(B[1][0])} si juega ${esc(G.R[1])}.`:k===1?`${sp} = ${Qs(M.p)}: con esa probabilidad al 2 le da igual ${esc(G.C[0])} o ${esc(G.C[1])}.`:k===2?"Exacto: ahora son los pagos del 1, uno por cada columna.":`${sq} = ${Qs(M.q)}.`;
      k++;fb=k<4?ok(msg):"";draw();return}
    let m="";if(k===0||k===2){const pl=k===0?2:1;m=`Revisa ${bad.length===1?"la casilla marcada":"las casillas marcadas"}. Para π<sub>${pl}</sub>(una ${pl===2?"columna":"fila"}) usa los pagos del jugador ${pl} en esa ${pl===2?"columna":"fila"}: el que acompaña a ${pl===2?"σ":"σ"} es el de ${pl===2?esc(G.R[0]):esc(G.C[0])} y el que acompaña a (1 − σ) es el de ${pl===2?esc(G.R[1]):esc(G.C[1])}.`}
    else{const isP=k===1,L=isP?[B[0][0],B[1][0],B[0][1],B[1][1]]:[A[0][0],A[0][1],A[1][0],A[1][1]];const a=L[0].sub(L[1]),b=L[2].sub(L[3]);
      m=`Abre los paréntesis y agrupa: (${Qs(a)})·σ + ${Qs(L[1])} = (${Qs(b)})·σ + ${Qs(L[3])}. Pasa los σ a un lado y los números al otro, y divide. Revisa los signos.`}
    fb=no(m);draw();bad.forEach(id=>{const el=$(id);if(el)el.classList.add("bad")})};
  const reset=()=>{k=0;fb="";vals={};draw()};reset()}

// =====================================================================================
// árbol con resaltado del nodo actual y valores ya resueltos
function guTree(g,ch,cur,val){const ids=g.pre,leaves=ids.filter(id=>g.nodes[id].leaf),Y={},dx=98,dy=46;let k=0;
  const place=id=>{const n=g.nodes[id];if(n.leaf){Y[id]=k++*dy;return Y[id]}const ys=n.ch.map(place);Y[id]=(ys[0]+ys[ys.length-1])/2;return Y[id]};place(g.root);
  const md=Math.max(...ids.map(id=>g.nodes[id].depth)),W=40+md*dx+112,H=(leaves.length-1)*dy+64,X=id=>24+g.nodes[id].depth*dx,YY=id=>30+Y[id];let e="",t="";
  ids.forEach(id=>{const n=g.nodes[id];if(n.leaf){t+=`<text x="${X(id)+7}" y="${YY(id)+4}" font-size="15" fill="var(--ink)" font-family="var(--f-mono)">(${n.u.map(Qs).join(",")})</text>`;return}
    n.ch.forEach((c,a)=>{const on=ch[id]===a;e+=`<line x1="${X(id)}" y1="${YY(id)}" x2="${X(c)}" y2="${YY(c)}" stroke="var(${on?"--exam":"--line"})" stroke-width="${on?3.4:1.6}" stroke-linecap="round"/>`;
      t+=`<text x="${(X(id)+X(c))/2}" y="${(YY(id)+YY(c))/2-7}" font-size="15" text-anchor="middle" fill="var(--ink)" font-weight="${on?700:500}">${esc(n.acts[a])}</text>`});
    const isC=id===cur;t+=`${isC?`<circle cx="${X(id)}" cy="${YY(id)}" r="11" fill="none" stroke="var(--exam)" stroke-width="2.5"/>`:""}<circle cx="${X(id)}" cy="${YY(id)}" r="5.5" fill="var(${isC?"--exam":"--ink"})"/><text x="${X(id)-4}" y="${YY(id)-11}" font-size="14" font-weight="700" text-anchor="end" fill="var(--muted)">${n.pl}</text>`;
    if(val[id])t+=`<text x="${X(id)+8}" y="${YY(id)+21}" font-size="14" fill="var(--exam)" font-weight="700" font-family="var(--f-mono)">(${val[id].map(Qs).join(",")})</text>`});
  g.sets.forEach(s=>{if(s.nodes.length<2)return;const ns=s.nodes.slice().sort((a,b)=>Y[a]-Y[b]);for(let i=0;i+1<ns.length;i++)e+=`<line x1="${X(ns[i])}" y1="${YY(ns[i])}" x2="${X(ns[i+1])}" y2="${YY(ns[i+1])}" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    if(s.nodes.length===2)s.nodes.forEach((id,j)=>t+=`<text x="${X(id)+9}" y="${YY(id)+(Y[id]===Math.min(...s.nodes.map(z=>Y[z]))?20:-12)}" font-size="14" fill="var(--exam)" font-weight="600">${j===s.muIdx?"μ":"1−μ"}</text>`)});
  return `<div class="plot"><svg style="min-width:0;max-width:${W}px" viewBox="0 0 ${W} ${H}" role="img" aria-label="Árbol del juego">${e}${t}</svg></div>`}
const where=(g,id)=>{const p=g.nodes[id].path;return p.length?"después de "+p.map(([x,k])=>g.nodes[x].acts[k]).join(", "):"al inicio"};

// =====================================================================================
// 3) INDUCCIÓN HACIA ATRÁS (información perfecta)
function modoEPS(box){const keys=Object.keys(ARB);let key="eps2",g,ch,val,cur,fb,phase,opts,picked;
  const load=()=>{g=EXT.parse(ARB[key].x);ch={};val={};fb="";phase=0;picked=null;next()};
  const next=()=>{const ready=g.pre.filter(id=>!g.nodes[id].leaf&&val[id]===undefined&&g.nodes[id].ch.every(c=>g.nodes[c].leaf||val[c]!==undefined));
    cur=ready.length?ready.sort((a,b)=>g.nodes[b].depth-g.nodes[a].depth)[0]:null;if(!cur){phase=1;buildOpts()}draw()};
  const pay=c=>g.nodes[c].leaf?g.nodes[c].u:val[c];
  const strat=(A,p)=>{const own=g.pre.filter(id=>!g.nodes[id].leaf&&g.nodes[id].pl===p);const a=own.map(id=>g.nodes[id].acts[A[id]]);return a.length===1?a[0]:`(${a.join(", ")})`};
  const prof=A=>`(${[...new Set(g.pre.filter(id=>!g.nodes[id].leaf).map(id=>g.nodes[id].pl))].sort().map(p=>strat(A,p)).join(", ")})`;
  const pathA=A=>{const s=new Set();let x=g.root;while(!g.nodes[x].leaf){s.add(x);x=g.nodes[x].ch[A[x]]}return s};
  const buildOpts=()=>{const good=prof(ch),on=pathA(ch),off=g.pre.filter(id=>!g.nodes[id].leaf&&!on.has(id));const o=[{t:good,ok:true}];
    const onlyPath=`(${[...new Set(g.pre.filter(id=>!g.nodes[id].leaf).map(id=>g.nodes[id].pl))].sort().map(p=>{const own=g.pre.filter(id=>!g.nodes[id].leaf&&g.nodes[id].pl===p&&on.has(id));return own.length?own.map(id=>g.nodes[id].acts[ch[id]]).join(", "):"—"}).join(", ")})`;
    if(off.length)o.push({t:onlyPath,ok:false,why:"Eso es solo la trayectoria (lo que pasa en el juego). El EPS es un perfil de <b>estrategias</b>: dice qué haría cada jugador en <b>todos</b> sus nodos, también en los que no se alcanzan."});
    if(off.length){const A2={...ch},x=off[0];A2[x]=(ch[x]+1)%g.nodes[x].acts.length;o.push({t:prof(A2),ok:false,why:`Ahí, ${where(g,x)}, el jugador ${g.nodes[x].pl} jugaría ${esc(g.nodes[x].acts[A2[x]])}, que no es lo que más le conviene en ese nodo: sería una amenaza no creíble.`})}
    else{const x=g.root,A2={...ch};A2[x]=(ch[x]+1)%g.nodes[x].acts.length;o.push({t:prof(A2),ok:false,why:"Ese perfil cambia la jugada del primer jugador por una que le da menos."})}
    opts=o.sort(()=>Math.random()-.5)};
  const draw=()=>{const steps=["Resolver desde el final","Escribir el EPS"];let body="";
    if(phase===0){const n=g.nodes[cur],p=n.pl;const ties=(()=>{const vs=n.ch.map(c=>pay(c)[p-1]);const m=vs.reduce((a,b)=>b.gt(a)?b:a);return vs.filter(v=>v.eq(m)).length>1})();
      body=`<div class="gu-q"><h4>Le toca al jugador ${p} ${where(g,cur)}. ¿Qué elige?</h4><p class="gu-why">Se empieza por <b>el final del árbol</b>: en este nodo ya se sabe qué pasa después de cada acción. El jugador ${p} mira <b>solo su propio pago</b> (el número ${p} de cada vector) y elige el mayor.</p>${guTree(g,ch,cur,val)}
        <div class="gu-opts">${n.acts.map((a,i)=>`<button type="button" data-a="${i}">${esc(a)} → (${pay(n.ch[i]).map(Qs).join(", ")})</button>`).join("")}</div>${fb}${ties?`<p class="hint">Hay empate: cualquiera de las empatadas es correcta y cada una da un EPS distinto.</p>`:""}</div>`}
    else if(phase===1){body=`<div class="gu-q"><h4>Ya llegaste a la raíz. ¿Cuál es el EPS?</h4><p class="gu-why">Las ramas gruesas son lo que elegiste en cada nodo. Escribe el perfil: para cada jugador, su acción en <b>cada uno</b> de sus nodos, en orden de arriba hacia abajo.</p>${guTree(g,ch,null,val)}<div class="gu-opts">${opts.map((o,i)=>`<button type="button" data-o="${i}" class="${picked===i?(o.ok?"good":"badb"):""}">${esc(o.t)}</button>`).join("")}</div>${fb}</div>`}
    else{const on=pathA(ch);body=`${guTree(g,ch,null,val)}<div class="gu-sum"><p><b>EPS = ${esc(prof(ch))}</b>, con resultado (${val[g.root].map(Qs).join(", ")}).</p><p>Trayectoria: ${[...on].map(id=>esc(g.nodes[id].acts[ch[id]])).join(" → ")}. Cada jugador elige lo mejor <b>en cada nodo</b>, incluso fuera de la trayectoria: por eso el EPS descarta las amenazas que nadie cumpliría.</p></div><div class="gu-row"><button class="btn" type="button" id="ge-again">Repetir</button></div>`}
    box.innerHTML=`<div class="gu-row" style="margin-top:0">${selEx("ge-ex",ARB,keys,key)}</div>${bar(steps,phase)}${body}`;
    $("ge-ex").onchange=()=>{key=$("ge-ex").value;load()};if($("ge-again"))$("ge-again").onclick=load;
    box.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{const a=+b.dataset.a,n=g.nodes[cur],p=n.pl,vs=n.ch.map(c=>pay(c)[p-1]),m=vs.reduce((x,y)=>y.gt(x)?y:x);
      if(vs[a].eq(m)){ch[cur]=a;val[cur]=pay(n.ch[a]);fb=ok(`El jugador ${p} gana ${Qs(vs[a])} con ${esc(n.acts[a])}. Ese nodo se reemplaza por (${val[cur].map(Qs).join(", ")}) y subimos.`);const keep=fb;next();if(phase===0){fb=keep;draw()}}
      else{fb=no(`Con ${esc(n.acts[a])} el jugador ${p} recibe ${Qs(vs[a])}, pero con ${n.acts.map((x,i)=>i!==a?`${esc(x)} recibe ${Qs(vs[i])}`:"").filter(Boolean).join(" y ")}. Fíjate solo en el número ${p} de cada vector.`);draw()}});
    box.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{picked=+b.dataset.o;const o=opts[picked];if(o.ok){phase=2;fb=""}else fb=no(o.why);draw()})};
  load()}

// =====================================================================================
// 4) CREENCIAS Y EBP (el 2 no distingue entre dos nodos)
function modoEBP(box){const keys=Object.keys(EBPK);let key="f2",g,k,fb,vals,h,act,res;
  const load=()=>{g=EXT.parse(EBPK[key].x);h=g.sets.find(s=>s.nodes.length===2);k=0;fb="";vals={};act=null;res=null;draw()};
  const U=(x,a)=>g.nodes[g.nodes[x].ch[a]].u[h.pl-1];
  const coef=a=>{const x0=h.nodes[h.muIdx],x1=h.nodes[1-h.muIdx];return[U(x0,a),U(x1,a)]};
  const verdict=()=>{const[a0,a1]=coef(0),[b0,b1]=coef(1),d1=a0.sub(b0),d0=a1.sub(b1);// diferencia π(a)−π(b) con μ=1 y con μ=0
    if(d0.ge(0)&&d1.ge(0))return{t:d0.z()&&d1.z()?"=":"a"};if(d0.le(0)&&d1.le(0))return{t:"b"};const dm=d1.sub(d0);return{t:"dep",th:d0.neg().div(dm),aHigh:dm.gt(0)}};
  const draw=()=>{const A0=h.acts[0],A1=h.acts[1],x0=h.nodes[h.muIdx],x1=h.nodes[1-h.muIdx],p=h.pl,steps=["Pagos esperados con μ","¿Qué le conviene al "+p+"?","Equilibrios"];
    const inp=id=>`<input id="${id}" inputmode="decimal" value="${vals[id]!==undefined?esc(vals[id]):""}">`;let body="";
    const tree=guTree(g,{},null,{});
    if(k===0)body=`<div class="gu-q"><h4>Paso 1 · El jugador ${p} no sabe en qué nodo está: promedia con su creencia μ</h4><p class="gu-why">μ es la probabilidad que el ${p} le asigna a estar en el nodo ${where(g,x0)}; 1 − μ, al nodo ${where(g,x1)}. El pago esperado de cada acción es «pago en el primer nodo × μ + pago en el segundo × (1 − μ)», usando <b>solo los pagos del jugador ${p}</b>.</p>${tree}
      <div class="gu-eq">π<sub>${p}</sub>(${esc(A0)}) = ${inp("e0")}·μ + ${inp("e1")}·(1 − μ)</div><div class="gu-eq">π<sub>${p}</sub>(${esc(A1)}) = ${inp("e2")}·μ + ${inp("e3")}·(1 − μ)</div>`;
    else if(k===1){const[a0,a1]=coef(0),[b0,b1]=coef(1);body=`<div class="gu-q"><h4>Paso 2 · Compara: ¿cuál acción es mejor y para qué creencias?</h4><p class="gu-why">Racionalidad secuencial: en su conjunto de información, el ${p} debe elegir lo mejor <b>dada su creencia</b>. Compara las dos expresiones.</p><div class="gu-eq">π<sub>${p}</sub>(${esc(A0)}) = ${Qs(a0)}μ + ${Qs(a1)}(1 − μ)</div><div class="gu-eq">π<sub>${p}</sub>(${esc(A1)}) = ${Qs(b0)}μ + ${Qs(b1)}(1 − μ)</div>
      <div class="gu-opts"><button type="button" data-v="a">${esc(A0)} es mejor para cualquier μ</button><button type="button" data-v="b">${esc(A1)} es mejor para cualquier μ</button><button type="button" data-v="dep">Depende de μ: hay un umbral</button></div>${act==="dep"?`<div class="gu-eq">${esc(A0)} es mejor si μ ${verdict().aHigh===false?"≤":"≥"} ${inp("th")}</div><div class="gu-row"><button class="btn" type="button" id="gb-th">Revisar el umbral</button></div>`:""}${fb}</div>`}
    else{const sol=EXT.solve(g),pb=EXT.pbe(g,sol).filter(z=>z.ok),name=sol.name,ne=sol.ne;
      const muTxt=z=>{const i=z.info.find(x=>x.si===g.sets.indexOf(h));if(!i)return"";if(i.fStrong>=0)return`μ = ${Qs(i.muS)} (Bayes: el conjunto está en la trayectoria)`;return i.free?(i.free.lo.eq(0)&&i.free.hi.eq(1)?"cualquier μ ∈ [0, 1] (fuera de la trayectoria)":`μ ∈ [${Qs(i.free.lo)}, ${Qs(i.free.hi)}] (fuera de la trayectoria)`):""};
      const out=ne.filter(z=>!pb.some(y=>y.z.prof.join()===z.prof.join()));
      body=`${tree}<div class="gu-sum"><p><b>EN = {${ne.map(name).join(", ")}}</b></p><p><b>EBP:</b></p><ul>${pb.map(z=>`<li>${name(z.z)} con ${muTxt(z)}</li>`).join("")||"<li>ninguno en puras</li>"}</ul>${out.length?`<p>${out.map(name).join(", ")} ${out.length>1?"son EN pero no son EBP":"es EN pero no es EBP"}: le pide${out.length>1?"n":""} al ${p} una acción que no es óptima para ninguna creencia compatible.</p>`:""}<p><b>Cómo leerlo:</b> si el conjunto de información está en la trayectoria, μ sale de la regla de Bayes. Si está fuera, μ puede ser cualquiera que haga óptima la acción del ${p}.</p></div><div class="gu-row"><button class="btn" type="button" id="gb-again">Otro ejercicio</button></div>`}
    if(k===0)body+=`<div class="gu-row"><button class="btn" type="button" id="gb-chk">Revisar</button><button class="btn ghost" type="button" id="gb-sol">Ver la respuesta</button></div>${fb}</div>`;
    box.innerHTML=`<div class="gu-row" style="margin-top:0">${selEx("gb-ex",EBPK,keys,key)}</div>${bar(steps,k)}${body}`;
    $("gb-ex").onchange=()=>{key=$("gb-ex").value;load()};if($("gb-again"))$("gb-again").onclick=()=>{key=keys[(keys.indexOf(key)+1)%keys.length];load()};
    box.querySelectorAll(".gu-eq input").forEach(el=>el.oninput=()=>{vals[el.id]=el.value});
    if($("gb-chk"))$("gb-chk").onclick=()=>chk1(false);if($("gb-sol"))$("gb-sol").onclick=()=>chk1(true);
    box.querySelectorAll("[data-v]").forEach(b=>b.onclick=()=>{const v=verdict(),c=b.dataset.v;act=c;
      if(c==="dep"&&v.t==="dep"){fb=info("Correcto, depende. ¿Dónde está el umbral? Iguala las dos expresiones y despeja μ.");draw();return}
      if(c===v.t){k=2;fb="";draw();return}
      const[a0,a1]=coef(0),[b0,b1]=coef(1);fb=no(v.t==="dep"?`Prueba los extremos: con μ = 1, ${esc(A0)} da ${Qs(a0)} y ${esc(A1)} da ${Qs(b0)}; con μ = 0, ${esc(A0)} da ${Qs(a1)} y ${esc(A1)} da ${Qs(b1)}. Si el mejor cambia, depende de μ.`:`Prueba los extremos: con μ = 1, ${esc(A0)} da ${Qs(a0)} y ${esc(A1)} da ${Qs(b0)}; con μ = 0, ${esc(A0)} da ${Qs(a1)} y ${esc(A1)} da ${Qs(b1)}. ¿Cuál gana en los dos?`);act=null;draw()});
    if($("gb-th"))$("gb-th").onclick=()=>{const v=verdict(),x=parseIn(vals.th);if(x&&x.eq(v.th)){k=2;fb="";draw()}else{fb=no(`Iguala: ${Qs(coef(0)[0])}μ + ${Qs(coef(0)[1])}(1 − μ) = ${Qs(coef(1)[0])}μ + ${Qs(coef(1)[1])}(1 − μ) y despeja μ.`);draw()}}};
  const chk1=sol=>{const[a0,a1]=coef(0),[b0,b1]=coef(1),want={e0:a0,e1:a1,e2:b0,e3:b1};if(sol)Object.entries(want).forEach(([id,v])=>vals[id]=Qs(v).replace("−","-"));
    const bad=Object.entries(want).filter(([id,v])=>{const x=parseIn(vals[id]);return!x||!x.eq(v)}).map(e=>e[0]);
    if(!bad.length){k=1;fb=ok("Esas son las expresiones del pago esperado.");draw();return}
    fb=no(`En cada acción, el número que multiplica a μ es el pago del jugador ${h.pl} en el nodo ${where(g,h.nodes[h.muIdx])}, y el que multiplica a (1 − μ), su pago en el otro nodo.`);draw();bad.forEach(id=>{const el=$(id);if(el)el.classList.add("bad")})};
  load()}

// =====================================================================================
SIMS.guiada=function(){
  $("sim").innerHTML=`${STY}<div style="margin-bottom:6px">${seg("gu-m","Procedimiento",[["nash","Nash en una tabla"],["mix","Mixtas 2×2"],["eps","Hacia atrás (EPS)"],["ebp","Creencias (EBP)"]],"nash")}</div><div id="gu-box"></div>`;
  const M={nash:modoNash,mix:modoMix,eps:modoEPS,ebp:modoEBP};const pre=window.TOOL_PRE;window.TOOL_PRE=null;const m0=M[pre]?pre:"nash";
  bindSeg("gu-m",m=>M[m]($("gu-box")));if(m0!=="nash"){const b=document.querySelector(`#gu-m [data-v="${m0}"]`);if(b)b.click();else M[m0]($("gu-box"))}else M.nash($("gu-box"))};
})();
