// Economiapp · motor de Teoría de Juegos con fracciones exactas.
// ===================== MOTOR DE TEORÍA DE JUEGOS (fracciones exactas) =====================
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1}
class Q{constructor(n,d=1){if(d===0)throw new Error("división por cero");if(d<0){n=-n;d=-d}const g=gcd(n,d);this.n=n/g;this.d=d/g}
  add(o){o=q(o);return new Q(this.n*o.d+o.n*this.d,this.d*o.d)} sub(o){o=q(o);return new Q(this.n*o.d-o.n*this.d,this.d*o.d)}
  mul(o){o=q(o);return new Q(this.n*o.n,this.d*o.d)} div(o){o=q(o);return new Q(this.n*o.d,this.d*o.n)} neg(){return new Q(-this.n,this.d)}
  cmp(o){o=q(o);const x=this.n*o.d-o.n*this.d;return x>0?1:x<0?-1:0} eq(o){return this.cmp(o)===0} gt(o){return this.cmp(o)>0} lt(o){return this.cmp(o)<0}
  ge(o){return this.cmp(o)>=0} le(o){return this.cmp(o)<=0} z(){return this.n===0} sgn(){return Math.sign(this.n)} num(){return this.n/this.d}
  s(){return this.d===1?String(this.n):`${this.n}/${this.d}`}}
const q=x=>x instanceof Q?x:new Q(x);
const Z0=new Q(0),O1=new Q(1);
function parseQ(t){t=String(t).trim().replace("−","-");if(t==="")throw new Error("vacío");
  if(/^[-+]?\d+\/\d+$/.test(t)){const[a,b]=t.split("/");return new Q(+a,+b)}
  if(/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)){const k=(t.split(".")[1]||"").length,m=10**k;return new Q(Math.round(parseFloat(t)*m),m)}
  throw new Error(`«${t}» no es un número`)}
const maxQ=a=>a.reduce((m,x)=>x.gt(m)?x:m);
const minQ=a=>a.reduce((m,x)=>x.lt(m)?x:m);
// Resolver M x = b con fracciones (devuelve null si es singular)
function solve(M,b){const n=M.length,A=M.map((r,i)=>[...r,b[i]]);
  for(let c=0;c<n;c++){let p=-1;for(let r=c;r<n;r++)if(!A[r][c].z()){p=r;break}if(p<0)return null;[A[c],A[p]]=[A[p],A[c]];
    for(let r=0;r<n;r++)if(r!==c&&!A[r][c].z()){const f=A[r][c].div(A[c][c]);for(let k=c;k<=n;k++)A[r][k]=A[r][k].sub(f.mul(A[c][k]))}}
  return A.map((r,i)=>r[n].div(r[i]))}
function subsets(n,k){const o=[];const rec=(s,a)=>{if(a.length===k){o.push(a.slice());return}for(let i=s;i<n;i++){a.push(i);rec(i+1,a);a.pop()}};rec(0,[]);return o}

// ---------- Juego de dos jugadores: G = {R (filas), C (columnas), A (pagos de 1), B (pagos de 2)}
function sub(G,I,J){return{R:I.map(i=>G.R[i]),C:J.map(j=>G.C[j]),A:I.map(i=>J.map(j=>G.A[i][j])),B:I.map(i=>J.map(j=>G.B[i][j])),I,J}}
// Mejores respuestas en puras
function bestResponses(G){const m=G.R.length,n=G.C.length;
  const r1=G.C.map((_,j)=>{const mx=maxQ(G.A.map(r=>r[j]));return G.R.map((_,i)=>i).filter(i=>G.A[i][j].eq(mx))});
  const r2=G.R.map((_,i)=>{const mx=maxQ(G.B[i]);return G.C.map((_,j)=>j).filter(j=>G.B[i][j].eq(mx))});
  const ne=[];for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(r1[j].includes(i)&&r2[i].includes(j))ne.push([i,j]);
  return{r1,r2,ne}}
// Intervalo de λ en (0,1) para el que λ·a + (1−λ)·b > c componente a componente
function lambdaInterval(a,b,c){let lo=Z0,hi=O1,loOpen=true,hiOpen=true;
  for(let k=0;k<a.length;k++){const coef=a[k].sub(b[k]),rhs=c[k].sub(b[k]);// λ·coef > rhs
    if(coef.z()){if(!Z0.gt(rhs))return null;continue}
    const t=rhs.div(coef);if(coef.sgn()>0){if(t.ge(lo)){lo=t}}else{if(t.le(hi)){hi=t}}}
  if(!lo.lt(hi))return null;let lam=lo.add(hi).div(2);const h=new Q(1,2);if(h.gt(lo)&&h.lt(hi))lam=h;return{lo,hi,lam}}
// Eliminación iterativa de estrategias estrictamente dominadas. mixed: también por mezclas de dos estrategias
function iterElim(G,mixed){let I=G.R.map((_,i)=>i),J=G.C.map((_,j)=>j);const steps=[];let player=1,fails=0,qn=1;
  const find=(pl)=>{if(pl===1){if(I.length<2)return null;
      for(const s of I){const cs=J.map(j=>G.A[s][j]);for(const d of I){if(d===s)continue;const ds=J.map(j=>G.A[d][j]);if(ds.every((v,k)=>v.gt(cs[k])))return{pl,s,dom:[d],vals:J.map((j,k)=>[ds[k],cs[k]])}}}
      if(mixed&&I.length>=3)for(const s of I){const cs=J.map(j=>G.A[s][j]),o=I.filter(x=>x!==s);for(let x=0;x<o.length;x++)for(let y=x+1;y<o.length;y++){
        const L=lambdaInterval(J.map(j=>G.A[o[x]][j]),J.map(j=>G.A[o[y]][j]),cs);if(L)return{pl,s,dom:[o[x],o[y]],L,vals:J.map((j,k)=>[L.lam.mul(G.A[o[x]][j]).add(O1.sub(L.lam).mul(G.A[o[y]][j])),cs[k]])}}}
      return null}
    if(J.length<2)return null;
    for(const s of J){const cs=I.map(i=>G.B[i][s]);for(const d of J){if(d===s)continue;const ds=I.map(i=>G.B[i][d]);if(ds.every((v,k)=>v.gt(cs[k])))return{pl,s,dom:[d],vals:I.map((i,k)=>[ds[k],cs[k]])}}}
    if(mixed&&J.length>=3)for(const s of J){const cs=I.map(i=>G.B[i][s]),o=J.filter(x=>x!==s);for(let x=0;x<o.length;x++)for(let y=x+1;y<o.length;y++){
      const L=lambdaInterval(I.map(i=>G.B[i][o[x]]),I.map(i=>G.B[i][o[y]]),cs);if(L)return{pl,s,dom:[o[x],o[y]],L,vals:I.map((i,k)=>[L.lam.mul(G.B[i][o[x]]).add(O1.sub(L.lam).mul(G.B[i][o[y]])),cs[k]])}}}
    return null};
  while(fails<2){const f=find(player);
    if(f){f.q=qn++;f.against=player===1?J.slice():I.slice();if(player===1)I=I.filter(x=>x!==f.s);else J=J.filter(x=>x!==f.s);f.left=[I.slice(),J.slice()];steps.push(f);fails=0}else fails++;
    player=3-player}
  return{steps,I,J}}
// Análisis 2x2 en mixtas con correspondencias de mejor respuesta. p = σ de la fila 0, x = σ de la columna 0
function mixed2x2(G){const[a,b]=G.A,[c,d]=G.B;
  // D1(x) = π1(fila0) − π1(fila1) = k1 + m1·x ;  D2(p) = π2(col0) − π2(col1) = k2 + m2·p
  const k1=a[1].sub(b[1]),m1=a[0].sub(a[1]).sub(b[0]).add(b[1]);
  const k2=d[0].sub(d[1]),m2=c[0].sub(d[0]).sub(c[1]).add(d[1]);
  const th=(k,m)=>m.z()?null:k.neg().div(m);const t1=th(k1,m1),t2=th(k2,m2);
  const s1=x=>k1.add(m1.mul(x)).sgn(),s2=p=>k2.add(m2.mul(p)).sgn();
  const inBR1=(p,x)=>{const s=s1(x);return s>0?p.eq(O1):s<0?p.eq(Z0):true};
  const inBR2=(p,x)=>{const s=s2(p);return s>0?x.eq(O1):s<0?x.eq(Z0):true};
  const ok=(p,x)=>inBR1(p,x)&&inBR2(p,x);
  const cand=(t)=>{const s=[Z0,O1];if(t&&t.gt(Z0)&&t.lt(O1))s.push(t);return s.sort((u,v)=>u.cmp(v))};
  const Xs=cand(t1),Ps=cand(t2),pts=[],segs=[];
  for(const p of Ps)for(const x of Xs)if(ok(p,x))pts.push([p,x]);
  // segmentos: horizontales (x fijo, p varía) y verticales (p fijo, x varía)
  for(const x of Xs)for(let k=0;k+1<Ps.length;k++){const m=Ps[k].add(Ps[k+1]).div(2);if(ok(m,x))segs.push({x,p:[Ps[k],Ps[k+1]]})}
  for(const p of Ps)for(let k=0;k+1<Xs.length;k++){const m=Xs[k].add(Xs[k+1]).div(2);if(ok(p,m))segs.push({p,x:[Xs[k],Xs[k+1]]})}
  return{k1,m1,k2,m2,t1,t2,pts,segs,s1,s2}}
// Enumeración de soportes (equilibrios aislados) para juegos m x n
function supportEnum(G){const m=G.R.length,n=G.C.length,out=[];let degenerate=false;
  for(let k=1;k<=Math.min(m,n);k++)for(const I of subsets(m,k))for(const J of subsets(n,k)){
    // q sobre J: Σ_j A[i][j] q_j − v = 0 (i∈I), Σ q_j = 1
    const M1=I.map(i=>[...J.map(j=>G.A[i][j]),new Q(-1)]);M1.push([...J.map(()=>O1),Z0]);
    const x=solve(M1,[...I.map(()=>Z0),O1]);
    const M2=J.map(j=>[...I.map(i=>G.B[i][j]),new Q(-1)]);M2.push([...I.map(()=>O1),Z0]);
    const y=solve(M2,[...J.map(()=>Z0),O1]);
    if(!x||!y){if(k>1)degenerate=true;continue}
    const qv=x.slice(0,k),v=x[k],pv=y.slice(0,k),w=y[k];
    if(qv.some(t=>t.lt(Z0))||pv.some(t=>t.lt(Z0)))continue;
    const P=G.R.map(()=>Z0),X=G.C.map(()=>Z0);I.forEach((i,t)=>P[i]=pv[t]);J.forEach((j,t)=>X[j]=qv[t]);
    let good=true;for(let i=0;i<m&&good;i++){let s=Z0;for(let j=0;j<n;j++)s=s.add(G.A[i][j].mul(X[j]));if(s.gt(v))good=false}
    for(let j=0;j<n&&good;j++){let s=Z0;for(let i=0;i<m;i++)s=s.add(G.B[i][j].mul(P[i]));if(s.gt(w))good=false}
    if(!good)continue;
    const key=P.map(t=>t.s()).join()+"|"+X.map(t=>t.s()).join();if(out.some(o=>o.key===key))continue;
    out.push({key,P,X,v1:v,v2:w,I,J})}
  return{eq:out,degenerate}}
// Maximin en puras y, si el juego es de suma constante, valor y estrategias óptimas
function security(G){const m=G.R.length,n=G.C.length;
  const rmin=G.A.map(r=>minQ(r)),mm1=maxQ(rmin),cmin=G.C.map((_,j)=>minQ(G.B.map(r=>r[j]))),mm2=maxQ(cmin);
  const cmax=G.C.map((_,j)=>maxQ(G.A.map(r=>r[j]))),minimax1=minQ(cmax);
  const c=G.A[0][0].add(G.B[0][0]);let zs=true;for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(!G.A[i][j].add(G.B[i][j]).eq(c))zs=false;
  // estrategia maximin mixta de cada jugador: equilibrio del juego de suma cero con sus propios pagos
  const neg=M=>M.map(r=>r.map(x=>x.neg()));
  const z1=supportEnum({R:G.R,C:G.C,A:G.A,B:neg(G.A)}).eq[0];
  const BT=G.C.map((_,j)=>G.R.map((_,i)=>G.B[i][j]));
  const z2=supportEnum({R:G.C,C:G.R,A:BT,B:neg(BT)}).eq[0];
  return{rmin,mm1,cmin,mm2,cmax,minimax1,saddle:mm1.eq(minimax1),zs,c,z1,z2}}
// ---------- Tres jugadores en puras: A[i][j][k] = [π1, π2, π3]
function nash3(S,P){const[n1,n2,n3]=S.map(s=>s.length),ne=[],r1={},r2={},r3={};
  for(let j=0;j<n2;j++)for(let k=0;k<n3;k++){const mx=maxQ([...Array(n1)].map((_,i)=>P[i][j][k][0]));r1[j+","+k]=[...Array(n1).keys()].filter(i=>P[i][j][k][0].eq(mx))}
  for(let i=0;i<n1;i++)for(let k=0;k<n3;k++){const mx=maxQ([...Array(n2)].map((_,j)=>P[i][j][k][1]));r2[i+","+k]=[...Array(n2).keys()].filter(j=>P[i][j][k][1].eq(mx))}
  for(let i=0;i<n1;i++)for(let j=0;j<n2;j++){const mx=maxQ([...Array(n3)].map((_,k)=>P[i][j][k][2]));r3[i+","+j]=[...Array(n3).keys()].filter(k=>P[i][j][k][2].eq(mx))}
  for(let i=0;i<n1;i++)for(let j=0;j<n2;j++)for(let k=0;k<n3;k++)if(r1[j+","+k].includes(i)&&r2[i+","+k].includes(j)&&r3[i+","+j].includes(k))ne.push([i,j,k]);
  return{ne,r1,r2,r3}}
// ---------- Juego secuencial: 1 elige entre a1, 2 observa y elige entre a2. L[i][j] = [u, v]
function sequential(a1,a2,L){const m=a1.length,n=a2.length;
  const strat=[];const rec=(pre)=>{if(pre.length===m){strat.push(pre.slice());return}for(let j=0;j<n;j++){pre.push(j);rec(pre);pre.pop()}};rec([]);
  const names=strat.map(s=>s.map(j=>a2[j]).join(""));
  const G={R:a1.slice(),C:names,A:a1.map((_,i)=>strat.map(s=>L[i][s[i]][0])),B:a1.map((_,i)=>strat.map(s=>L[i][s[i]][1]))};
  const resp=a1.map((_,i)=>{const mx=maxQ(L[i].map(x=>x[1]));return a2.map((_,j)=>j).filter(j=>L[i][j][1].eq(mx))});
  // inducción hacia atrás (todas las combinaciones de desempates del jugador 2)
  const combos=[];const rc=(pre)=>{if(pre.length===m){combos.push(pre.slice());return}for(const j of resp[pre.length]){pre.push(j);rc(pre);pre.pop()}};rc([]);
  const spe=[];for(const c of combos){const vals=a1.map((_,i)=>L[i][c[i]][0]),mx=maxQ(vals);a1.forEach((_,i)=>{if(vals[i].eq(mx))spe.push({i,plan:c,name:c.map(j=>a2[j]).join("")})})}
  return{G,strat,names,resp,spe}}
const GT={Q,q,parseQ,bestResponses,iterElim,mixed2x2,supportEnum,security,nash3,sequential,sub};
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
