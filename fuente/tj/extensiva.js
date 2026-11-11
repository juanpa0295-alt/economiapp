// Economiapp · juegos en forma extensiva (árboles) con fracciones exactas.
// Necesita juegos.js cargado antes (Q, parseQ, bestResponses, supportEnum).
//
// Formato de texto del árbol (una línea por nodo, la sangría indica quién cuelga de quién):
//
//   jugadores: 1, 2          ← opcional; fija el orden de los pagos
//   1                        ← raíz: el jugador que mueve primero
//     E: 2                   ← acción E lleva a un nodo del jugador 2
//       P: -1, -1            ← acción P termina con pagos (π1, π2)
//       C: 1, 1
//     NE: 0, 2
//
//   · Conjuntos de información: misma etiqueta entre corchetes, p. ej. «Z: 2 [h]» y «X: 2 [h]».
//   · Azar (naturaleza): el jugador «Azar» y la probabilidad junto a cada acción: «Alta (1/3): 2».
//   · Un nodo terminal lleva una coma o paréntesis: «(3, 2)» o «3, 2».
// =====================================================================================

const EXT_CHANCE=/^(azar|naturaleza|nature|chance)$/i;

function extParse(text){
  const lines=String(text).replace(/\t/g,"  ").split(/\r?\n/);
  let header=null,root=null,id=0;const stack=[],nodes=[];
  const fail=(ln,msg)=>{throw new Error(`línea ${ln}: ${msg}`)};
  const spec=(s,ln)=>{s=s.trim();if(!s)fail(ln,"falta indicar a dónde lleva la acción (un jugador o unos pagos).");
    if(s.includes(",")||/^\(.*\)$/.test(s)){const raw=s.replace(/^\(|\)$/g,"").split(/[;,]/).map(x=>x.trim()).filter(Boolean);
      let pay;try{pay=raw.map(parseQ)}catch(e){fail(ln,`los pagos «${s}» no son números (${e.message}).`)}
      return{kind:"t",pay}}
    const m=s.match(/^([^\s\[\]()]+)\s*(?:\[\s*([^\]]+?)\s*\])?$/);
    if(!m)fail(ln,`«${s}» no es ni un jugador ni unos pagos. Un jugador es un nombre sin espacios (1, 2, G…), opcionalmente con su conjunto de información entre corchetes: 2 [h].`);
    if(EXT_CHANCE.test(m[1])){if(m[2])fail(ln,"el azar no tiene conjuntos de información.");return{kind:"c",pl:"Azar",acts:[]}}
    return{kind:"d",pl:m[1],lab:m[2]||null,acts:[]}};
  lines.forEach((raw,k)=>{const ln=k+1,line=raw.replace(/\s+#.*$|^\s*#.*$/,"");if(!line.trim())return;
    const ind=line.match(/^ */)[0].length,body=line.trim();
    const hm=body.match(/^jugadores\s*:\s*(.+)$/i);
    if(hm&&!root){header=hm[1].split(/[,;]/).map(s=>s.trim()).filter(Boolean);if(new Set(header).size!==header.length)fail(ln,"hay jugadores repetidos en la lista.");return}
    if(!root){if(/:/.test(body))fail(ln,"la primera línea es la raíz: solo el jugador que mueve primero (por ejemplo «1»), sin acción.");
      const n=spec(body,ln);if(n.kind==="t")fail(ln,"la raíz no puede ser un nodo terminal.");
      root=Object.assign(n,{id:id++,ln,depth:0,hist:[],parent:null});nodes.push(root);stack.push({ind,node:root});return}
    while(stack.length&&stack[stack.length-1].ind>=ind)stack.pop();
    if(!stack.length)fail(ln,"esta línea tiene la misma sangría que la raíz. Todo lo que cuelga de la raíz debe ir más adentro.");
    const par=stack[stack.length-1].node;
    const am=body.match(/^([^:()]+?)\s*(?:\(\s*([^)]+?)\s*\))?\s*:\s*(.*)$/);
    if(!am)fail(ln,`falta la acción. Escribe «acción: destino», por ejemplo «E: 2» o «P: -1, -1».`);
    const act=am[1].trim();let prob=null;
    if(am[2]!==undefined){if(par.kind!=="c")fail(ln,`solo las acciones del azar llevan probabilidad (la acción «${act}» es del jugador ${par.pl}).`);
      try{prob=parseQ(am[2])}catch(e){fail(ln,`la probabilidad «${am[2]}» no es un número.`)}
      if(prob.lt(0)||prob.gt(1))fail(ln,"una probabilidad debe estar entre 0 y 1.")}
    else if(par.kind==="c")fail(ln,`la acción «${act}» sale del azar y necesita su probabilidad: «${act} (1/2): …».`);
    if(par.acts.some(a=>a.a===act))fail(ln,`el nodo de la línea ${par.ln} ya tiene una acción llamada «${act}».`);
    const n=spec(am[3],ln);Object.assign(n,{id:id++,ln,depth:par.depth+1,hist:[...par.hist,act],parent:par,from:act});
    par.acts.push({a:act,p:prob,child:n});nodes.push(n);
    if(n.kind!=="t")stack.push({ind,node:n})});
  if(!root)throw new Error("el árbol está vacío. Empieza con el jugador que mueve primero.");
  // validaciones
  nodes.forEach(n=>{if(n.kind!=="t"&&!n.acts.length)fail(n.ln,`el nodo de ${n.kind==="c"?"azar":"jugador "+n.pl} no tiene acciones. Escríbelas debajo, con más sangría.`);
    if(n.kind==="c"){const s=n.acts.reduce((t,a)=>t.add(a.p),new Q(0));if(!s.eq(1))fail(n.ln,`las probabilidades del azar suman ${s.s()} y deben sumar 1.`)}});
  // jugadores y orden de los pagos
  const seen=[];nodes.forEach(n=>{if(n.kind==="d"&&!seen.includes(n.pl))seen.push(n.pl)});
  let players;if(header){const miss=seen.filter(p=>!header.includes(p));if(miss.length)throw new Error(`el jugador ${miss[0]} mueve en el árbol pero no está en la lista «jugadores:».`);players=header}
  else players=seen.every(p=>/^\d+$/.test(p))?seen.slice().sort((a,b)=>a-b):seen;
  if(!players.length)throw new Error("ningún jugador toma decisiones en el árbol.");
  nodes.forEach(n=>{if(n.kind==="t"&&n.pay.length!==players.length)fail(n.ln,`hay ${players.length} jugador${players.length>1?"es":""} (${players.join(", ")}), así que cada nodo terminal necesita ${players.length} pago${players.length>1?"s":""}; este tiene ${n.pay.length}.`);
    if(n.kind==="d")n.p=players.indexOf(n.pl)});
  // conjuntos de información
  const H=[],byKey={};
  nodes.filter(n=>n.kind==="d").forEach(n=>{const key=n.lab?`${n.pl}|${n.lab}`:`#${n.id}`;
    if(!byKey[key]){byKey[key]={key,lab:n.lab,p:n.p,pl:n.pl,nodes:[],acts:n.acts.map(a=>a.a)};H.push(byKey[key])}
    const h=byKey[key];
    if(h.nodes.length){const a=n.acts.map(x=>x.a);if(a.length!==h.acts.length||a.some(x=>!h.acts.includes(x)))fail(n.ln,`este nodo está en el conjunto de información [${n.lab}] junto con el de la línea ${h.nodes[0].ln}, así que debe tener las mismas acciones (${h.acts.join(", ")}). El jugador no puede distinguir los nodos, y por eso tampoco sus acciones.`)}
    h.nodes.push(n);n.h=h});
  H.forEach(h=>{for(const a of h.nodes)for(const b of h.nodes)if(a!==b){let x=b.parent;while(x){if(x===a)fail(b.ln,`este nodo y el de la línea ${a.ln} están en el mismo conjunto de información [${h.lab}], pero uno viene después del otro. Un jugador siempre sabe que ya movió.`);x=x.parent}}});
  // índice de cada conjunto por jugador (orden de aparición, como se leen las estrategias en clase)
  players.forEach((_,p)=>H.filter(h=>h.p===p).forEach((h,k)=>{h.k=k}));
  // acción → índice dentro del conjunto (las acciones de cada nodo se ordenan como en su conjunto)
  nodes.filter(n=>n.kind==="d").forEach(n=>{n.acts.forEach(a=>{a.k=n.h.acts.indexOf(a.a)})});
  return{root,nodes,players,H,perfect:H.every(h=>h.nodes.length===1)}}

// Nombre de una estrategia: las letras pegadas si todas las acciones del jugador son de una letra (ZB, RL), si no con «·»
function extJoin(T,p,acts){const Hs=T.H.filter(h=>h.p===p);if(Hs.length===1)return acts[0];
  const short=Hs.every(h=>h.acts.every(a=>a.length===1));return acts.join(short?"":"·")}
function extHistory(n){return n.hist.length?n.hist.join(", "):"inicio"}

// Producto cartesiano limitado
function extProduct(lists,cap=200000){let out=[[]];for(const L of lists){const nx=[];for(const o of out)for(const x of L){nx.push([...o,x]);if(nx.length>cap)return null}out=nx}return out}

// Estrategias puras de un jugador sobre una lista de conjuntos de información
function extStrats(T,p,Hs){Hs=Hs||T.H.filter(h=>h.p===p);const combos=extProduct(Hs.map(h=>h.acts.map((_,i)=>i)),4096);
  if(!combos)return null;return combos.map(c=>({c,H:Hs,name:Hs.length?extJoin(T,p,c.map((i,k)=>Hs[k].acts[i])):"—"}))}

// Pagos esperados: behav[h.key] = array de probabilidades por acción; stop = Map(nodeId → pagos) para subárboles reemplazados
function extEval(T,node,behav,stop){if(stop&&stop.has(node.id))return stop.get(node.id);
  if(node.kind==="t")return node.pay;
  const tot=T.players.map(()=>new Q(0));
  node.acts.forEach(a=>{const pr=node.kind==="c"?a.p:behav[node.h.key][a.k];if(pr.z())return;const v=extEval(T,a.child,behav,stop);v.forEach((x,i)=>{tot[i]=tot[i].add(pr.mul(x))})});
  return tot}
const extPure=(h,i)=>h.acts.map((_,k)=>new Q(k===i?1:0));

// Forma estratégica completa (todas las estrategias puras de todos los jugadores)
function extNormal(T){const S=T.players.map((_,p)=>extStrats(T,p));
  if(S.some(s=>!s))return{tooBig:true,S};
  const sizes=S.map(s=>s.length),total=sizes.reduce((a,b)=>a*b,1);if(total>20000)return{tooBig:true,S,total};
  const payOf=idx=>{const behav={};idx.forEach((si,p)=>{const s=S[p][si];s.H.forEach((h,k)=>{behav[h.key]=extPure(h,s.c[k])})});return extEval(T,T.root,behav)};
  const out={S,sizes,total,payOf};
  if(T.players.length===2){const A=[],B=[];S[0].forEach((_,i)=>{A.push([]);B.push([]);S[1].forEach((_,j)=>{const v=payOf([i,j]);A[i].push(v[0]);B[i].push(v[1])})});
    out.G={R:S[0].map(s=>s.name),C:S[1].map(s=>s.name),A,B}}
  out.ne=extPureNE(sizes,payOf);return out}

// Equilibrios de Nash en puras para n jugadores (enumeración de perfiles)
function extPureNE(sizes,payOf,who){who=who||sizes.map((_,p)=>p);const all=extProduct(sizes.map(n=>[...Array(n).keys()]),50000);if(!all)return null;
  const cache=new Map(),pay=idx=>{const k=idx.join();if(!cache.has(k))cache.set(k,payOf(idx));return cache.get(k)};
  return all.filter(idx=>{const v=pay(idx);return sizes.every((n,p)=>{for(let s=0;s<n;s++){if(s===idx[p])continue;const d=idx.slice();d[p]=s;if(pay(d)[who[p]].gt(v[who[p]]))return false}return true})})}

// ---------- Subjuegos: x inicia un subjuego si todo conjunto de información que toca su subárbol queda completo dentro de él
function extSubgames(T){const desc=n=>{const o=[n];n.acts&&n.acts.forEach(a=>o.push(...desc(a.child)));return o};
  T.nodes.forEach(n=>{n.sub=false;if(n.kind==="t")return;const D=new Set(desc(n));
    n.sub=D.size>0&&[...D].every(m=>m.kind!=="d"||m.h.nodes.every(z=>D.has(z)))});
  return T.nodes.filter(n=>n.sub)}

// ---------- Equilibrio perfecto en subjuegos (inducción hacia atrás generalizada)
// Resuelve primero los subjuegos más pequeños, reemplaza cada uno por los pagos de su equilibrio y sigue hacia arriba.
// En cada juego truncado busca los EN en puras y, si quedan dos jugadores activos, también los mixtos (soportes).
function extSPE(T,opt={}){extSubgames(T);const steps=[],CAP=opt.cap||40;let truncated=false;
  const tops=x=>{const o=[];const go=n=>{n.acts.forEach(a=>{const c=a.child;if(c.kind==="t")return;if(c.sub)o.push(c);else go(c)})};go(x);return o};
  const memo=new Map();
  const solve=x=>{if(memo.has(x.id))return memo.get(x.id);
    const kids=tops(x),solsK=kids.map(solve);let combos=extProduct(solsK,CAP);if(!combos){combos=extProduct(solsK.map(s=>s.slice(0,1)));truncated=true}
    const res=[];
    combos.forEach(combo=>{const stop=new Map();kids.forEach((k,i)=>stop.set(k.id,combo[i].pay));
      // conjuntos de información que quedan en el juego truncado
      const Hs=[],seenH=new Set();const walk=n=>{if(stop.has(n.id)||n.kind==="t")return;if(n.kind==="d"&&!seenH.has(n.h.key)){seenH.add(n.h.key);Hs.push(n.h)}n.acts.forEach(a=>walk(a.child))};walk(x);
      const act=T.players.map((_,p)=>p).filter(p=>Hs.some(h=>h.p===p));
      const S=act.map(p=>extStrats(T,p,Hs.filter(h=>h.p===p)));
      if(S.some(s=>!s)){truncated=true;return}
      const base={};combo.forEach(s=>Object.assign(base,s.behav));
      const behavOf=idx=>{const b=Object.assign({},base);idx.forEach((si,k)=>{const s=S[k][si];s.H.forEach((h,t)=>{b[h.key]=extPure(h,s.c[t])})});return b};
      const payOf=idx=>extEval(T,x,behavOf(idx),stop);
      const ne=extPureNE(S.map(s=>s.length),payOf,act);if(!ne){truncated=true;return}
      const found=ne.map(idx=>({behav:behavOf(idx),pay:payOf(idx),pure:true,prof:idx.map((si,k)=>({p:act[k],name:S[k][si].name}))}));
      let G2=null,mixed=[];
      if(act.length===2&&S[0].length>1&&S[1].length>1){const A=[],B=[],Vs=[];
        S[0].forEach((_,i)=>{A.push([]);B.push([]);Vs.push([]);S[1].forEach((_,j)=>{const v=payOf([i,j]);A[i].push(v[act[0]]);B[i].push(v[act[1]]);Vs[i].push(v)})});
        G2={R:S[0].map(s=>s.name),C:S[1].map(s=>s.name),A,B,act};
        const se=supportEnum(G2);G2.degenerate=se.degenerate;
        se.eq.filter(e=>e.I.length>1||e.J.length>1).forEach(e=>{const b=Object.assign({},base);
          [[0,e.P],[1,e.X]].forEach(([k,pr])=>{S[k][0].H.forEach((h,t)=>{const v=h.acts.map(()=>new Q(0));S[k].forEach((s,si)=>{v[s.c[t]]=v[s.c[t]].add(pr[si])});b[h.key]=v})});
          const pay=T.players.map(()=>new Q(0));e.P.forEach((pi,i)=>e.X.forEach((xj,j)=>{if(pi.z()||xj.z())return;Vs[i][j].forEach((v,t)=>{pay[t]=pay[t].add(pi.mul(xj).mul(v))})}));
          const m={behav:b,pay,pure:false,mix:[e.P,e.X],prof:[0,1].map(k=>({p:act[k],name:null}))};mixed.push(m)});
        found.push(...mixed)}
      if(steps.length<CAP)steps.push({x,kids,combo,stop,Hs,act,S,ne,G2,mixed,found,payOf});
      found.forEach(f=>{const behav=Object.assign({},base,f.behav);res.push({behav,pay:f.pay,pure:f.pure&&combo.every(c=>c.pure)})})});
    // sin repetidos
    const uniq=[];res.forEach(r=>{const key=Object.keys(r.behav).sort().map(k=>k+":"+r.behav[k].map(v=>v.s()).join("/")).join("|");if(!uniq.some(u=>u.key===key))uniq.push(Object.assign(r,{key}))});
    const out=uniq.slice(0,CAP);if(uniq.length>CAP)truncated=true;memo.set(x.id,out);return out};
  const spe=solve(T.root);
  return{spe,steps,truncated,subs:T.nodes.filter(n=>n.sub)}}

// Probabilidad de llegar a cada nodo con un perfil de comportamiento
function extReach(T,behav){const r=new Map();const go=(n,pr)=>{r.set(n.id,pr);if(n.kind==="t")return;n.acts.forEach(a=>{const p=n.kind==="c"?a.p:(behav[n.h.key]?behav[n.h.key][a.k]:new Q(0));go(a.child,pr.mul(p))})};go(T.root,new Q(1));return r}

Object.assign(GT,{extParse,extStrats,extNormal,extPureNE,extSubgames,extSPE,extEval,extReach,extHistory,extJoin});
