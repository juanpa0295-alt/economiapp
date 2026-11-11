// ---------- Juegos bayesianos estáticos de dos jugadores: equilibrio Bayes-Nash en estrategias puras
// Tipos independientes con probabilidades conocidas (previa común). Formato de texto:
//   acciones 1: U D
//   acciones 2: L R
//   tipos 1: alto 1/2, bajo 1/2      (opcional: sin esta línea el jugador tiene un solo tipo)
//   tipos 2: -
//   tabla alto, -:                    (una tabla por cada par de tipos; filas = acciones de 1)
//   2,1  0,0
//   0,0  1,2
const BN={};
BN.parse=function(text){
  const L=String(text).split(/\n/).map(l=>l.replace(/#.*$/,"").trim()).filter(Boolean);
  const g={A:[null,null],T:[[{n:"—",p:GT.q(1)}],[{n:"—",p:GT.q(1)}]],U:{}};let cur=null;
  const cellRe=/\(?\s*([-−+]?[\d.\/]+)\s*[,;]\s*([-−+]?[\d.\/]+)\s*\)?/g;
  for(const ln of L){let m;
    if((m=/^acciones\s*([12])\s*:\s*(.+)$/i.exec(ln))){const a=m[2].split(/[\s,]+/).filter(Boolean);if(a.length<2)throw new Error(`el jugador ${m[1]} necesita al menos dos acciones.`);if(new Set(a).size!==a.length)throw new Error(`hay acciones repetidas para el jugador ${m[1]}.`);g.A[+m[1]-1]=a;cur=null;continue}
    if((m=/^tipos\s*([12])\s*:\s*(.*)$/i.exec(ln))){const raw=m[2].trim();if(raw===""||raw==="-"||raw==="—"){g.T[+m[1]-1]=[{n:"—",p:GT.q(1)}];cur=null;continue}
      const ts=raw.split(",").map(x=>x.trim()).filter(Boolean).map(x=>{const k=/^(\S+)\s+(\S+)$/.exec(x);if(!k)throw new Error(`escribe cada tipo como «nombre probabilidad», por ejemplo «alto 1/2». No entiendo «${x}».`);let p;try{p=GT.parseQ(k[2])}catch(e){throw new Error(`la probabilidad «${k[2]}» no es válida.`)}if(p.lt(0))throw new Error("las probabilidades no pueden ser negativas.");return{n:k[1],p}});
      let s=GT.q(0);ts.forEach(t=>s=s.add(t.p));if(!s.eq(1))throw new Error(`las probabilidades de los tipos del jugador ${m[1]} suman ${s.s()}, no 1.`);
      if(new Set(ts.map(t=>t.n)).size!==ts.length)throw new Error(`hay tipos repetidos para el jugador ${m[1]}.`);g.T[+m[1]-1]=ts;cur=null;continue}
    if((m=/^tabla\s+(.+?)\s*:\s*$/i.exec(ln))){const k=m[1].split(",").map(x=>x.trim());if(k.length!==2)throw new Error(`la tabla «${m[1]}» debe indicar el tipo del jugador 1 y el del 2, separados por coma (usa «-» si un jugador tiene un solo tipo).`);
      cur=k.map(x=>x==="-"?"—":x).join("|");g.U[cur]=[];continue}
    if(cur){const cells=[...ln.replace(/−/g,"-").matchAll(cellRe)].map(c=>[GT.parseQ(c[1]),GT.parseQ(c[2])]);if(!cells.length)throw new Error(`no entiendo la fila «${ln}».`);g.U[cur].push(cells);continue}
    throw new Error(`no entiendo la línea «${ln}».`)}
  if(!g.A[0]||!g.A[1])throw new Error("faltan las líneas «acciones 1:» y «acciones 2:».");
  for(const t1 of g.T[0])for(const t2 of g.T[1]){const k=t1.n+"|"+t2.n,M=g.U[k];
    if(!M)throw new Error(`falta la tabla de los tipos (${t1.n}, ${t2.n}).`);
    if(M.length!==g.A[0].length||M.some(r=>r.length!==g.A[1].length))throw new Error(`la tabla (${t1.n}, ${t2.n}) debe tener ${g.A[0].length} filas de ${g.A[1].length} celdas.`)}
  return g};
BN.strats=(g,i)=>{let L=[[]];for(const _ of g.T[i])L=L.flatMap(v=>g.A[i].map((_,a)=>v.concat([a])));return L};
BN.sname=(g,i,v)=>g.T[i].length===1?g.A[i][v[0]]:`(${v.map(a=>g.A[i][a]).join(", ")})`;
BN.u=(g,a1,a2,k1,k2)=>g.U[g.T[0][k1].n+"|"+g.T[1][k2].n][a1][a2];
// pago esperado del tipo k del jugador i al jugar a, dada la estrategia del otro
BN.eu=function(g,i,k,a,sOther){const j=1-i;let s=GT.q(0);g.T[j].forEach((tj,kj)=>{const b=sOther[kj],u=i===0?BN.u(g,a,b,k,kj)[0]:BN.u(g,b,a,kj,k)[1];s=s.add(tj.p.mul(u))});return s};
BN.solve=function(g){const S=[BN.strats(g,0),BN.strats(g,1)];
  const exA=(v1,v2,i)=>{let s=GT.q(0);g.T[0].forEach((t1,k1)=>g.T[1].forEach((t2,k2)=>s=s.add(t1.p.mul(t2.p).mul(BN.u(g,v1[k1],v2[k2],k1,k2)[i]))));return s};
  const G={R:S[0].map(v=>BN.sname(g,0,v)),C:S[1].map(v=>BN.sname(g,1,v))};
  G.A=S[0].map(v1=>S[1].map(v2=>exA(v1,v2,0)));G.B=S[0].map(v1=>S[1].map(v2=>exA(v1,v2,1)));
  const isBR=(i,v,o)=>g.T[i].every((t,k)=>t.p.z()||g.A[i].every((_,a)=>!BN.eu(g,i,k,a,o).gt(BN.eu(g,i,k,v[k],o))));
  const eq=[];S[0].forEach((v1,x)=>S[1].forEach((v2,y)=>{if(isBR(0,v1,v2)&&isBR(1,v2,v1))eq.push([x,y])}));
  return{S,G,eq}};
if(typeof module!=="undefined")module.exports={BN};
