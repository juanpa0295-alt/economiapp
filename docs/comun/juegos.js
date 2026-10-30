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
