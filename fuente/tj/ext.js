// ---------- Juegos en forma extensiva finitos: forma estratégica, EN, EPS y EBP en estrategias puras
// Formato de texto, una línea por nodo de decisión:  nombre jugador [conjunto] : acción>destino acción>destino ...
// El destino es otro nodo o un vector de pagos entre paréntesis. Nodos con el mismo [conjunto] comparten conjunto de información.
// Un * al final del conjunto (h*) marca el nodo al que se refiere la creencia μ.
const EXT={};
EXT.parse=function(text){
  const lines=String(text).split(/\n/).map(l=>l.replace(/#.*$/,"").trim()).filter(Boolean);
  if(!lines.length)throw new Error("escribe al menos un nodo.");
  const nodes={},order=[];let leafN=0,nP=0;
  for(const ln of lines){
    const m=/^(\S+)\s+(?:J|j)?(\d)\s*(\S*?)\s*:\s*(.+)$/.exec(ln);
    if(!m)throw new Error(`no entiendo la línea «${ln}». Usa: nombre jugador conjunto : acción>destino ...`);
    const [,id,pl,setRaw,rest]=m;if(nodes[id])throw new Error(`el nodo ${id} está repetido.`);
    const p=+pl;if(p<1||p>3)throw new Error(`el jugador del nodo ${id} debe ser 1, 2 o 3.`);nP=Math.max(nP,p);
    const acts=[],ch=[];const re=/([^\s>]+)\s*>\s*(\([^)]*\)|[^\s()]+)/g;let a,used=0;
    while((a=re.exec(rest))){acts.push(a[1]);used+=a[0].length;
      if(a[2][0]==="("){const u=a[2].slice(1,-1).split(/[;,]\s*|\s+/).filter(Boolean).map(x=>{try{return GT.parseQ(x)}catch(e){throw new Error(`pago «${x}» no válido en el nodo ${id}.`)}});
        const lid="t"+(++leafN);nodes[lid]={id:lid,leaf:true,u};ch.push(lid)}else ch.push(a[2])}
    if(acts.length<2)throw new Error(`el nodo ${id} necesita al menos dos acciones (acción>destino).`);
    if(new Set(acts).size!==acts.length)throw new Error(`en el nodo ${id} hay acciones repetidas.`);
    let set=setRaw.replace(/[{}\[\]]/g,""),mu=false;if(set.endsWith("*")){mu=true;set=set.slice(0,-1)}
    nodes[id]={id,pl:p,set:set||("·"+id),acts,ch,mu};order.push(id)}
  const leaves=Object.values(nodes).filter(n=>n.leaf);
  leaves.forEach(l=>{if(l.u.length<nP)throw new Error(`el pago (${l.u.map(x=>x.s()).join(", ")}) tiene ${l.u.length} números y hay ${nP} jugadores.`)});
  nP=Math.max(nP,...leaves.map(l=>l.u.length));
  leaves.forEach(l=>{if(l.u.length!==nP)throw new Error(`todos los pagos deben tener ${nP} números.`)});
  const root=order[0],parent={};
  for(const id of order)nodes[id].ch.forEach((c,k)=>{if(!nodes[c])throw new Error(`el destino «${c}» del nodo ${id} no existe.`);
    if(parent[c])throw new Error(`al nodo ${c} se llega desde dos lugares: en un árbol cada nodo tiene un solo antecesor.`);if(c===root)throw new Error("la raíz no puede ser destino de otra acción.");parent[c]={id,k}});
  for(const id of order)if(id!==root&&!parent[id])throw new Error(`el nodo ${id} no está conectado con la raíz.`);
  // profundidad y orden de recorrido
  const pre=[];const walk=(id,d,path)=>{const n=nodes[id];n.depth=d;n.path=path;pre.push(id);if(!n.leaf)n.ch.forEach((c,k)=>walk(c,d+1,path.concat([[id,k]])))};walk(root,0,[]);
  // conjuntos de información
  const sets=[],byName={};
  for(const id of order){const n=nodes[id];let s=byName[n.set];
    if(!s){s={name:n.set,pl:n.pl,acts:n.acts.slice(),nodes:[]};byName[n.set]=s;n.si=sets.length;sets.push(s)}
    else{if(s.pl!==n.pl)throw new Error(`el conjunto ${n.set} mezcla nodos de jugadores distintos.`);
      if(s.acts.join("|")!==n.acts.join("|"))throw new Error(`los nodos del conjunto ${n.set} deben tener las mismas acciones, en el mismo orden.`);n.si=sets.indexOf(s)}
    s.nodes.push(id)}
  sets.forEach(s=>{const k=s.nodes.findIndex(id=>nodes[id].mu);s.muIdx=k<0?0:k;
    if(s.nodes.length>1)for(let a=0;a<s.nodes.length;a++)for(let b=0;b<s.nodes.length;b++)if(a!==b&&nodes[s.nodes[b]].path.some(([x])=>x===s.nodes[a]))throw new Error(`en el conjunto ${s.name} un nodo sigue a otro: el jugador recordaría por dónde pasó.`)});
  const players=[...Array(nP)].map((_,p)=>sets.map((s,i)=>s.pl===p+1?i:-1).filter(i=>i>=0));
  return{nodes,root,order,pre,sets,n:nP,players,parent}};

// todas las estrategias puras de cada jugador: un vector de acciones, una por cada conjunto propio
EXT.strategies=function(g){return g.players.map(own=>{let L=[[]];for(const si of own)L=L.flatMap(v=>g.sets[si].acts.map((_,a)=>v.concat([a])));return L})};
EXT.stratName=function(g,p,v){const own=g.players[p];if(!own.length)return"—";const a=own.map((si,k)=>g.sets[si].acts[v[k]]);return a.length===1?a[0]:`(${a.join(", ")})`};
EXT.assign=function(g,strat){const A=Array(g.sets.length).fill(0);strat.forEach((v,p)=>g.players[p].forEach((si,k)=>A[si]=v[k]));return A};
EXT.play=function(g,A,from){let id=from||g.root;const path=[id];while(!g.nodes[id].leaf){const n=g.nodes[id];id=n.ch[A[n.si]];path.push(id)}return{u:g.nodes[id].u,path,leaf:id}};
EXT.under=function(g,r){const S=new Set();const w=id=>{S.add(id);const n=g.nodes[id];if(!n.leaf)n.ch.forEach(w)};w(r);return S};
// raíces de subjuegos: nodo de conjunto unitario cuyos sucesores no comparten conjunto con nodos de fuera
EXT.subgames=function(g){return g.pre.filter(id=>{const n=g.nodes[id];if(n.leaf)return false;if(g.sets[n.si].nodes.length>1)return false;
  const U=EXT.under(g,id);for(const x of U){const m=g.nodes[x];if(!m.leaf&&g.sets[m.si].nodes.some(y=>!U.has(y)))return false}return true})};
EXT.profiles=function(g){const S=EXT.strategies(g);let tot=S.reduce((a,s)=>a*s.length,1);if(tot>20000)throw new Error("el juego es demasiado grande para listar todas las estrategias (más de 20 000 perfiles).");
  let P=[[]];for(const s of S)P=P.flatMap(v=>s.map((_,k)=>v.concat([k])));return{S,P}};
// ¿es el perfil (índices de estrategia) un EN del juego que empieza en r?
EXT.isNE=function(g,S,prof,r){const A=EXT.assign(g,prof.map((k,p)=>S[p][k])),base=EXT.play(g,A,r).u;
  for(let p=0;p<g.n;p++)for(let k=0;k<S[p].length;k++){if(k===prof[p])continue;const pr=prof.slice();pr[p]=k;const B=EXT.assign(g,pr.map((kk,pp)=>S[pp][kk]));
    if(EXT.play(g,B,r).u[p].gt(base[p]))return{ok:false,p,k,gain:EXT.play(g,B,r).u[p],base:base[p]}}
  return{ok:true}};
EXT.solve=function(g){const{S,P}=EXT.profiles(g),roots=EXT.subgames(g);
  const all=P.map(prof=>{const A=EXT.assign(g,prof.map((k,p)=>S[p][k])),pl=EXT.play(g,A);return{prof,A,u:pl.u,path:pl.path}});
  const ne=all.filter(x=>EXT.isNE(g,S,x.prof).ok);
  const spe=ne.filter(x=>roots.every(r=>EXT.isNE(g,S,x.prof,r).ok)).map(x=>{x.spe=true;return x});
  ne.forEach(x=>{if(!x.spe){for(const r of roots){const t=EXT.isNE(g,S,x.prof,r);if(!t.ok){x.fail={r,...t};break}}}});
  return{S,P,all,ne,spe,roots,name:x=>"("+x.prof.map((k,p)=>EXT.stratName(g,p,S[p][k])).join(", ")+")"}};

// ---------- Inducción hacia atrás por subjuegos (con ramas cuando un subjuego tiene varios equilibrios)
EXT.backward=function(g){const roots=EXT.subgames(g),U={};roots.forEach(r=>U[r]=EXT.under(g,r));
  const inner=r=>roots.filter(x=>x!==r&&U[r].has(x)&&!roots.some(y=>y!==r&&y!==x&&U[r].has(y)&&U[y].has(x)));
  const memo={};
  const solve=r=>{if(memo[r])return memo[r];const ins=inner(r);let combos=[{A:{},steps:[]}];
    for(const x of ins){const sols=solve(x),nc=[];if(sols.some(s=>s.stop))return memo[r]=sols.filter(s=>s.stop);for(const c of combos)for(const s of sols)nc.push({A:{...c.A,...s.A},steps:c.steps.concat(s.steps)});combos=nc.slice(0,64)}
    const innerNodes=new Set();ins.forEach(x=>U[x].forEach(y=>innerNodes.add(y)));
    const own=[...new Set([...U[r]].filter(id=>!g.nodes[id].leaf&&!innerNodes.has(id)).map(id=>g.nodes[id].si))].sort((a,b)=>a-b);
    const out=[];
    for(const c of combos){const pls=[...new Set(own.map(si=>g.sets[si].pl))].sort();
      const strat=pls.map(p=>{let L=[[]];const os=own.filter(si=>g.sets[si].pl===p);for(const si of os)L=L.flatMap(v=>g.sets[si].acts.map((_,a)=>v.concat([a])));return{p,os,L}});
      let prof=[[]];for(const s of strat)prof=prof.flatMap(v=>s.L.map((_,k)=>v.concat([k])));
      const mkA=pr=>{const A=Array(g.sets.length).fill(0);Object.entries(c.A).forEach(([si,a])=>A[si]=a);strat.forEach((s,i)=>s.os.forEach((si,k)=>A[si]=s.L[pr[i]][k]));return A};
      const val=pr=>EXT.play(g,mkA(pr),r).u;
      const eqs=prof.filter(pr=>{const b=val(pr);return strat.every((s,i)=>s.L.every((_,k)=>{if(k===pr[i])return true;const q=pr.slice();q[i]=k;return !val(q)[s.p-1].gt(b[s.p-1])}))});
      const step={r,own,strat,prof,val,eqs,inner:ins.map(x=>({x,u:EXT.play(g,mkA(prof[0]),x).u})),A0:c.A};
      for(const e of eqs){const A=mkA(e),nA={...c.A};own.forEach(si=>nA[si]=A[si]);out.push({A:nA,steps:c.steps.concat([{...step,pick:e,u:val(e)}])})}
      // sin equilibrio en puras: si el juego reducido es 2×2 se resuelve en mixtas
      if(!eqs.length&&strat.length===2&&strat[0].L.length===2&&strat[1].L.length===2&&strat.every(s=>s.os.length===1)){
        const cell=(i,j)=>val([i,j]),G={R:[0,1].map(i=>g.sets[strat[0].os[0]].acts[i]),C:[0,1].map(j=>g.sets[strat[1].os[0]].acts[j]),
          A:[0,1].map(i=>[0,1].map(j=>cell(i,j)[strat[0].p-1])),B:[0,1].map(i=>[0,1].map(j=>cell(i,j)[strat[1].p-1]))};
        const M=GT.mixed2x2(G);const pt=M.pts[0];
        if(pt){const [p,x]=pt,one=GT.q(1),ex=k=>{let s=GT.q(0);[[0,0,p.mul(x)],[0,1,p.mul(one.sub(x))],[1,0,one.sub(p).mul(x)],[1,1,one.sub(p).mul(one.sub(x))]].forEach(([i,j,w])=>s=s.add(w.mul(cell(i,j)[k])));return s};
          out.push({A:{...c.A},mixed:{G,p,x,pl:[strat[0].p,strat[1].p],sets:[strat[0].os[0],strat[1].os[0]],u:[...Array(g.n)].map((_,k)=>ex(k))},stop:r!==g.root,steps:c.steps.concat([{...step,mixed:true,G,p,x}])})}}}
    memo[r]=out;return out};
  return solve(g.root)};

// ---------- Equilibrio bayesiano perfecto en puras
// μ es la probabilidad del nodo marcado (por defecto, el primero) del conjunto de información.
EXT.cont=function(g,A,x,a){const n=g.nodes[x];return EXT.play(g,A,n.ch[a]).u};
EXT.interval=function(rows){// rows: [d1,d2] con condición μ·d1+(1−μ)·d2 ≥ 0 → intervalo [lo,hi] de μ
  let lo=GT.q(0),hi=GT.q(1);for(const [d1,d2] of rows){const k=d1.sub(d2);// d2 + μ k ≥ 0
    if(k.z()){if(d2.lt(0))return null;continue}const t=d2.neg().div(k);if(k.gt(0)){if(t.gt(lo))lo=t}else{if(t.lt(hi))hi=t}}
  return lo.gt(hi)?null:{lo,hi}};
EXT.pbe=function(g,sol){const roots=EXT.subgames(g),U={};roots.forEach(r=>U[r]=EXT.under(g,r));const S=sol.S;
  // estrategias estrictamente dominadas (por otra pura) en la forma estratégica, para el requisito 5
  const dom=g.players.map((_,p)=>S[p].map((_,k)=>S[p].some((__,k2)=>k2!==k&&sol.P.filter(pr=>pr[p]===k).every(pr=>{const q=pr.slice();q[p]=k2;
    const a=sol.all.find(x=>x.prof.join()===pr.join()).u[p],b=sol.all.find(x=>x.prof.join()===q.join()).u[p];return b.gt(a)}))));
  const reachDom=x=>{const node=g.nodes[x];// ¿todo perfil que llega a x usa una estrategia estrictamente dominada de quien mueve antes?
    const movers=new Set(node.path.map(([id])=>g.nodes[id].pl-1));
    const reach=sol.all.filter(z=>z.path.includes(x));if(!reach.length)return false;return reach.every(z=>[...movers].some(p=>dom[p][z.prof[p]]))};
  const res=[];
  for(const z of sol.all){const A=z.A,info=[];let ok=true,weakOk=true,r5ok=true;
    for(let si=0;si<g.sets.length;si++){const s=g.sets[si],p=s.pl-1,a=A[si];
      const best=x=>s.acts.every((_,b)=>!EXT.cont(g,A,x,b)[p].gt(EXT.cont(g,A,x,a)[p]));
      if(s.nodes.length===1){const fine=best(s.nodes[0]);if(!fine){ok=false;weakOk=false;r5ok=false}info.push({si,single:true,ok:fine});continue}
      // creencias forzadas por Bayes: el subjuego más profundo que contiene el conjunto
      const cont=roots.filter(r=>s.nodes.every(x=>U[r].has(x)));const deep=cont[cont.length-1];
      const hit=r=>{const pth=EXT.play(g,A,r).path;return s.nodes.findIndex(x=>pth.includes(x))};
      const fStrong=hit(deep),fWeak=hit(g.root);
      const rows=s.nodes.length===2?s.acts.map((_,b)=>[EXT.cont(g,A,s.nodes[s.muIdx],a)[p].sub(EXT.cont(g,A,s.nodes[s.muIdx],b)[p]),EXT.cont(g,A,s.nodes[1-s.muIdx],a)[p].sub(EXT.cont(g,A,s.nodes[1-s.muIdx],b)[p])]):null;
      const free=rows?EXT.interval(rows):null;
      const gridOK=()=>{if(rows)return !!free;const k=s.nodes.length,N=12;const rec=(i,left,w)=>{if(i===k-1){w=w.concat([left]);return s.acts.every((_,b)=>{let d=GT.q(0);s.nodes.forEach((x,j)=>d=d.add(GT.q(w[j]).mul(EXT.cont(g,A,x,a)[p].sub(EXT.cont(g,A,x,b)[p]))));return d.ge(0)})}
          for(let t=0;t<=left;t++)if(rec(i+1,left-t,w.concat([t])))return true;return false};return rec(0,N,[])};
      const forcedVal=f=>f<0?null:(f===s.muIdx?GT.q(1):GT.q(0));
      const check=f=>{if(f>=0)return best(s.nodes[f]);return gridOK()};
      const okS=check(fStrong),okW=check(fWeak);
      // requisito 5
      let r5=null;if(fStrong<0&&rows){const dn=s.nodes.map(reachDom);if(dn.some(Boolean)&&!dn.every(Boolean)){const keep=dn.findIndex(d=>!d);r5={node:keep,ok:best(s.nodes[keep]),mu:keep===s.muIdx?GT.q(1):GT.q(0)}}}
      if(!okS)ok=false;if(!okW)weakOk=false;if(!okS||(r5&&!r5.ok))r5ok=false;
      info.push({si,fStrong,fWeak,muS:forcedVal(fStrong),muW:forcedVal(fWeak),free,okS,okW,r5,multi:!rows})}
    if(ok||weakOk)res.push({z,ok,weakOk,r5ok,info})}
  return res};
EXT.muText=function(info){if(info.muS)return`μ = ${info.muS.s()}`;if(info.multi)return"alguna creencia";const f=info.free;if(!f)return"ninguna creencia";
  const lo=f.lo,hi=f.hi;if(lo.eq(hi))return`μ = ${lo.s()}`;if(lo.z()&&hi.eq(1))return"cualquier μ ∈ [0, 1]";if(lo.z())return`μ ≤ ${hi.s()}`;if(hi.eq(1))return`μ ≥ ${lo.s()}`;return`${lo.s()} ≤ μ ≤ ${hi.s()}`};
if(typeof module!=="undefined")module.exports={EXT};
