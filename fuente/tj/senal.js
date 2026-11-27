// ---------- Juegos de señalización 2 × 2 × 2: equilibrios bayesianos perfectos en estrategias puras
// La naturaleza elige el tipo del emisor (jugador 1); el emisor envía un mensaje; el receptor (jugador 2) lo observa y responde.
// Formato de texto:
//   tipos: t1 1/2, t2 1/2
//   mensajes: I D
//   respuestas: a b
//   t1 I: 1,3  1,0        (una línea por tipo y mensaje: pagos (π1, π2) de cada respuesta, en orden)
const SGN={};
SGN.parse=function(text){
  const L=String(text).split(/\n/).map(l=>l.replace(/#.*$/,"").trim()).filter(Boolean),g={T:null,M:null,R:null,U:{}};
  const cell=/\(?\s*([-−+]?[\d.\/]+)\s*[,;]\s*([-−+]?[\d.\/]+)\s*\)?/g;
  for(const ln of L){let m;
    if((m=/^tipos\s*:\s*(.+)$/i.exec(ln))){g.T=m[1].split(",").map(x=>x.trim()).filter(Boolean).map(x=>{const k=/^(\S+)\s+(\S+)$/.exec(x);if(!k)throw new Error(`escribe cada tipo como «nombre probabilidad», por ejemplo «t1 1/2». No entiendo «${x}».`);return{n:k[1],p:parseQ(k[2])}});continue}
    if((m=/^mensajes\s*:\s*(.+)$/i.exec(ln))){g.M=m[1].split(/[\s,]+/).filter(Boolean);continue}
    if((m=/^respuestas\s*:\s*(.+)$/i.exec(ln))){g.R=m[1].split(/[\s,]+/).filter(Boolean);continue}
    if((m=/^(\S+)\s+(\S+)\s*:\s*(.+)$/.exec(ln))){const cs=[...m[3].matchAll(cell)].map(c=>[parseQ(c[1]),parseQ(c[2])]);g.U[m[1]+"|"+m[2]]=cs;continue}
    throw new Error(`no entiendo la línea «${ln}».`)}
  if(!g.T||g.T.length!==2)throw new Error("hacen falta exactamente dos tipos en la línea «tipos:».");
  if(!g.M||g.M.length!==2)throw new Error("hacen falta exactamente dos mensajes.");
  if(!g.R||g.R.length!==2)throw new Error("hacen falta exactamente dos respuestas.");
  if(!g.T[0].p.add(g.T[1].p).eq(1))throw new Error("las probabilidades de los tipos deben sumar 1.");
  for(const t of g.T)for(const mm of g.M){const c=g.U[t.n+"|"+mm];if(!c||c.length!==2)throw new Error(`falta la línea «${t.n} ${mm}: π1,π2  π1,π2» con los pagos de las dos respuestas.`)}
  return g};
SGN.u=(g,ti,mi,ri)=>g.U[g.T[ti].n+"|"+g.M[mi]][ri];
// creencias μ = P(t1 | m) en que la respuesta ri es óptima: intervalo [lo, hi] o null
SGN.rango=function(g,mi,ri){const d=ti=>SGN.u(g,ti,mi,ri)[1].sub(SGN.u(g,ti,mi,1-ri)[1]);const d1=d(0),d2=d(1);
  // ventaja(μ) = μ·d1 + (1−μ)·d2 ≥ 0
  if(d1.ge(0)&&d2.ge(0))return[Z0,O1];if(d1.lt(0)&&d2.lt(0))return null;
  const s=d2.neg().div(d1.sub(d2));// raíz
  return d1.gt(d2)?[s,O1]:[Z0,s]};
SGN.solve=function(g){const out=[],p=g.T[0].p;
  for(let a=0;a<2;a++)for(let b=0;b<2;b++){const sig=[a,b],cands=[];
    for(let r0=0;r0<2;r0++)for(let r1=0;r1<2;r1++){const rho=[r0,r1],mu=[],ok=[];let fine=true;
      for(let mi=0;mi<2;mi++){const on=sig.filter(x=>x===mi).length,rg=SGN.rango(g,mi,rho[mi]);
        if(on){const m=a===mi&&b===mi?p:a===mi?O1:Z0;mu[mi]={on:true,v:m};if(!rg||m.lt(rg[0])||m.gt(rg[1]))fine=false}
        else{mu[mi]={on:false,rg};if(!rg)fine=false}}
      const send=[0,1].map(ti=>{const own=SGN.u(g,ti,sig[ti],rho[sig[ti]])[0],dev=SGN.u(g,ti,1-sig[ti],rho[1-sig[ti]])[0];return{own,dev,ok:own.ge(dev)}});
      cands.push({rho,mu,recv:fine,send,eq:fine&&send.every(x=>x.ok)})}
    out.push({sig,cands})}
  return out};
const SGP={
  f1:{t:"Taller 4 · Punto 8 · Figura 1",x:"tipos: t1 1/2, t2 1/2\nmensajes: I D\nrespuestas: a b\nt1 I: 1,3  1,0\nt2 I: 2,4  2,1\nt1 D: 2,1  0,0\nt2 D: 1,2  0,1"},
  f2:{t:"Taller 4 · Punto 9 · Figura 2",x:"tipos: t1 1/2, t2 1/2\nmensajes: I D\nrespuestas: a b\nt1 I: 2,4  1,0\nt2 I: 2,4  1,1\nt1 D: 2,1  0,0\nt2 D: 1,0  1,2"},
  bos:{t:"Taller 4 · Punto 5 · Batalla de los sexos con la chica moviendo primero (p = 1/2)",x:"tipos: Tabla1 1/2, Tabla2 1/2\nmensajes: F C\nrespuestas: F C\nTabla1 F: 3,2  2,1\nTabla2 F: 1,2  0,1\nTabla1 C: 0,0  1,3\nTabla2 C: 2,0  3,3"}};
SIMS.senal=function(){const tp=takePre(SGP)||"f1";
  $("sim").innerHTML=`<div class="row slv-top"><label class="selw" for="sg-pre">Ejercicio<select id="sg-pre">${Object.keys(SGP).map(k=>`<option value="${k}" ${k===tp?"selected":""}>${SGP[k].t}</option>`).join("")}</select></label></div>
  <details class="exted"><summary>Editar o escribir otro juego de señalización</summary><p class="hint">Dos tipos del emisor con su probabilidad, dos mensajes y dos respuestas. Luego una línea por tipo y mensaje con los pagos (π₁, π₂) de cada respuesta, en el orden de la línea «respuestas».</p><textarea id="sg-tx" rows="9" spellcheck="false" aria-label="Juego de señalización"></textarea></details><div id="sg-out" class="slv-out"></div>`;
  const tx=$("sg-tx");tx.value=SGP[tp].x;
  const run=()=>{let g,sol;try{g=SGN.parse(tx.value);sol=SGN.solve(g)}catch(e){$("sg-out").innerHTML=`<p class="err">Revisa el juego: ${e.message}</p>`;return}
    const T=g.T,M=g.M,R=g.R,mu=mi=>mi===0?"μ":"μ′",U=(ti,mi,ri)=>`(${SGN.u(g,ti,mi,ri).map(qs_).join(", ")})`;let n=0,h=[];
    h.push(`<div class="stepc"><h4><span class="n">${++n}</span>El juego</h4><p>La naturaleza elige el tipo del emisor: p(${T[0].n}) = ${qs_(T[0].p)} y p(${T[1].n}) = ${qs_(T[1].p)}. El emisor (jugador 1) conoce su tipo y envía ${M[0]} o ${M[1]}. El receptor (jugador 2) ve el mensaje, no el tipo, y responde ${R[0]} o ${R[1]}. Llamamos ${mu(0)} = P(${T[0].n} | ${M[0]}) y ${mu(1)} = P(${T[0].n} | ${M[1]}).</p>
      <div class="tbl"><table><tr><th>Tipo · mensaje</th><th>${R[0]}</th><th>${R[1]}</th></tr>${[0,1].map(mi=>[0,1].map(ti=>`<tr><th>${T[ti].n} · ${M[mi]}</th><td class="num">${U(ti,mi,0)}</td><td class="num">${U(ti,mi,1)}</td></tr>`).join("")).join("")}</table></div></div>`);
    const rtxt=mi=>{const r0=SGN.rango(g,mi,0),r1=SGN.rango(g,mi,1),m=mu(mi),e=ri=>{const v=ti=>coefP(SGN.u(g,ti,mi,ri)[1]);return `${v(0)}·${m} + ${v(1)}·(1 − ${m})`};
      const des=(rg,ri)=>!rg?`nunca`:rg[0].eq(0)&&rg[1].eq(1)?`siempre, para cualquier ${m}`:rg[0].eq(0)?`si ${m} ≤ ${qs_(rg[1])}`:`si ${m} ≥ ${qs_(rg[0])}`;
      return `<li><b>Tras ${M[mi]}:</b> ${R[0]} vale ${e(0)}; ${R[1]} vale ${e(1)}. Conviene ${R[0]} ${des(r0,0)} y ${R[1]} ${des(r1,1)}.</li>`};
    h.push(`<div class="stepc"><h4><span class="n">${++n}</span>Lo que hace el receptor según lo que cree</h4><p>Pago esperado de cada respuesta en cada conjunto de información (racionalidad secuencial):</p><ul>${rtxt(0)}${rtxt(1)}</ul></div>`);
    const sname=s=>s[0]===s[1]?`agrupador en ${M[s[0]]}`:`separador`,sfull=s=>`(${M[s[0]]}, ${M[s[1]]})`,rfull=r=>`(${R[r[0]]}, ${R[r[1]]})`;
    const rngTxt=(mi,rg)=>rg[0].eq(0)&&rg[1].eq(1)?`${mu(mi)} ∈ [0, 1]`:rg[0].eq(rg[1])?`${mu(mi)} = ${qs_(rg[0])}`:rg[0].eq(0)?`${mu(mi)} ≤ ${qs_(rg[1])}`:`${mu(mi)} ≥ ${qs_(rg[0])}`;
    const eqs=[];
    h.push(`<div class="stepc"><h4><span class="n">${++n}</span>Las cuatro estrategias del emisor</h4><p>Se escribe (mensaje de ${T[0].n}, mensaje de ${T[1].n}). Para cada una: creencias por Bayes donde se puede, respuesta óptima del receptor y prueba de que ningún tipo quiere cambiar de mensaje.</p>${sol.map(({sig,cands})=>{
      const c=cands.filter(z=>z.recv);let s=`<p><b>${sfull(sig)}: ${sname(sig)}.</b> `;
      s+=[0,1].map(mi=>{const on=sig.filter(x=>x===mi).length;return on?`${mu(mi)} = ${qs_(sig[0]===mi&&sig[1]===mi?T[0].p:sig[0]===mi?O1:Z0)} (Bayes)`:`${M[mi]} está fuera de la trayectoria: ${mu(mi)} es libre`}).join("; ")+".</p>";
      if(!c.length)return s+`<p>Ninguna respuesta del receptor es óptima con esas creencias.</p>`;
      s+=`<ul>${c.map(z=>{const off=[0,1].filter(mi=>!z.mu[mi].on);const okS=z.send.every(x=>x.ok);if(z.eq)eqs.push({sig,rho:z.rho,beliefs:[0,1].map(mi=>z.mu[mi].on?`${mu(mi)} = ${qs_(z.mu[mi].v)}`:rngTxt(mi,z.mu[mi].rg))});
        return `<li>Receptor ${rfull(z.rho)}${off.length?` (con ${off.map(mi=>rngTxt(mi,z.mu[mi].rg)).join(" y ")})`:""}: ${[0,1].map(ti=>`${T[ti].n} recibe ${qs_(z.send[ti].own)} y cambiando recibiría ${qs_(z.send[ti].dev)}${z.send[ti].ok?" ✓":" ✗"}`).join("; ")}. ${okS?"<b>Es EBP.</b>":"No es EBP."}</li>`}).join("")}</ul>`;return s}).join("")}</div>`);
    h.push(`<div class="stepc"><h4><span class="n">${++n}</span>Resultado</h4><div class="verdict ${eqs.length?"acc":"warnv"}">${eqs.length?`EBP en estrategias puras:<br>${eqs.map(e=>`[ emisor ${sfull(e.sig)}, receptor ${rfull(e.rho)}, ${e.beliefs.join(", ")} ]`).join("<br>")}`:"No hay EBP en estrategias puras."}</div></div>`);
    $("sg-out").innerHTML=h.join("");typeset($("sg-out"))};
  $("sg-pre").onchange=e=>{tx.value=SGP[e.target.value].x;run()};tx.addEventListener("input",run);run()};
