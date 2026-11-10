// Economiapp · álgebra lineal con fracciones exactas (BigInt)
// Economiapp · álgebra lineal exacta con fracciones (BigInt) para Métodos Lineales.
const LA={};
// ---------- racionales
const bgcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a};
LA.q=(n,d=1n)=>{n=BigInt(n);d=BigInt(d);if(d===0n)throw new Error("división por cero");if(d<0n){n=-n;d=-d}const g=bgcd(n,d)||1n;return{n:n/g,d:d/g}};
LA.Z=LA.q(0);LA.U=LA.q(1);
LA.add=(a,b)=>LA.q(a.n*b.d+b.n*a.d,a.d*b.d);LA.sub=(a,b)=>LA.q(a.n*b.d-b.n*a.d,a.d*b.d);LA.mul=(a,b)=>LA.q(a.n*b.n,a.d*b.d);LA.div=(a,b)=>LA.q(a.n*b.d,a.d*b.n);
LA.neg=a=>({n:-a.n,d:a.d});LA.z=a=>a.n===0n;LA.eq=(a,b)=>a.n===b.n&&a.d===b.d;LA.num=a=>Number(a.n)/Number(a.d);LA.sgn=a=>a.n>0n?1:a.n<0n?-1:0;
LA.str=a=>a.d===1n?a.n.toString().replace("-","−"):`${a.n<0n?"−":""}${(a.n<0n?-a.n:a.n)}/${a.d}`;
LA.parse=t=>{t=String(t).trim().replace(/−/g,"-").replace(",",".");if(!t)return null;let m=/^(-?\d+)\s*\/\s*(\d+)$/.exec(t);if(m)return LA.q(m[1],m[2]);m=/^(-?)(\d*)\.(\d+)$/.exec(t);if(m){const d=10n**BigInt(m[3].length);return LA.q(BigInt(m[1]+(m[2]||"0")+m[3]),d)}m=/^-?\d+$/.exec(t);if(m)return LA.q(t);return null};
// matriz desde texto: filas por línea o «;», entradas por espacios
LA.leer=txt=>{const filas=txt.split(/\n|;/).map(r=>r.trim()).filter(Boolean).map(r=>r.split(/[\s\t]+|,(?=\s)/).filter(Boolean).map(LA.parse));if(!filas.length)return{err:"escribe la matriz"};
  const c=filas[0].length;if(filas.some(r=>r.length!==c))return{err:"todas las filas deben tener el mismo número de entradas"};if(filas.some(r=>r.some(v=>v===null)))return{err:"hay una entrada que no es un número (usa enteros, decimales o fracciones como 3/4)"};return{M:filas}};
LA.copia=M=>M.map(r=>r.slice());
LA.id=n=>[...Array(n)].map((_,i)=>[...Array(n)].map((_,j)=>i===j?LA.U:LA.Z));
LA.T=M=>M[0].map((_,j)=>M.map(r=>r[j]));
LA.suma=(A,B)=>A.map((r,i)=>r.map((v,j)=>LA.add(v,B[i][j])));
LA.esc=(k,A)=>A.map(r=>r.map(v=>LA.mul(k,v)));
LA.prod=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>LA.add(s,LA.mul(v,B[k][j])),LA.Z)));
LA.igual=(A,B)=>A.length===B.length&&A[0].length===B[0].length&&A.every((r,i)=>r.every((v,j)=>LA.eq(v,B[i][j])));
LA.num2=M=>M.map(r=>r.map(LA.num));

// ---------- eliminación de Gauss-Jordan con pasos. nc = columnas de coeficientes (el resto es aumentada)
LA.rref=(M0,nc,completa=true)=>{const M=LA.copia(M0),m=M.length,n=nc??M[0].length,pasos=[],piv=[];let r=0;
  for(let c=0;c<n&&r<m;c++){let p=-1;for(let i=r;i<m;i++)if(!LA.z(M[i][c])){p=i;break}if(p<0)continue;
    if(p!==r){[M[p],M[r]]=[M[r],M[p]];pasos.push({op:`F${r+1} ↔ F${p+1}`,M:LA.copia(M)})}
    const pv=M[r][c];if(!LA.eq(pv,LA.U)){M[r]=M[r].map(v=>LA.div(v,pv));pasos.push({op:`F${r+1} → F${r+1} · ${LA.str(LA.div(LA.U,pv))}`,M:LA.copia(M)})}
    for(let i=completa?0:r+1;i<m;i++){if(i===r||LA.z(M[i][c]))continue;const f=M[i][c];M[i]=M[i].map((v,j)=>LA.sub(v,LA.mul(f,M[r][j])));pasos.push({op:`F${i+1} → F${i+1} − (${LA.str(f)})·F${r+1}`,M:LA.copia(M)})}
    piv.push(c);r++}
  return{M,pasos,piv,rango:piv.length}};
LA.rango=M=>LA.rref(M).rango;
// sistema Ax = b: clasifica y da la solución general
LA.sistema=(A,b)=>{const n=A[0].length,Ab=A.map((r,i)=>[...r,b[i]]),R=LA.rref(Ab,n),rA=R.rango,rAb=LA.rref(Ab).rango;
  if(rAb>rA)return{R,tipo:"inconsistente",rA,rAb,n};const libres=[...Array(n).keys()].filter(j=>!R.piv.includes(j));
  const part=Array(n).fill(LA.Z);R.piv.forEach((c,i)=>part[c]=R.M[i][n]);const dirs=libres.map(f=>{const v=Array(n).fill(LA.Z);v[f]=LA.U;R.piv.forEach((c,i)=>v[c]=LA.neg(R.M[i][f]));return{f,v}});
  return{R,tipo:libres.length?"infinitas":"única",rA,rAb,n,libres,part,dirs}};
LA.inversa=A=>{const n=A.length;if(A[0].length!==n)return{err:"la matriz debe ser cuadrada"};const R=LA.rref(A.map((r,i)=>[...r,...LA.id(n)[i]]),n);if(R.rango<n)return{R,singular:true};return{R,inv:R.M.map(r=>r.slice(n))}};
// ---------- determinantes
LA.menor=(A,i,j)=>A.filter((_,k)=>k!==i).map(r=>r.filter((_,l)=>l!==j));
LA.det=A=>{const n=A.length;if(n===1)return A[0][0];if(n===2)return LA.sub(LA.mul(A[0][0],A[1][1]),LA.mul(A[0][1],A[1][0]));let s=LA.Z;for(let j=0;j<n;j++){if(LA.z(A[0][j]))continue;const t=LA.mul(A[0][j],LA.det(LA.menor(A,0,j)));s=j%2?LA.sub(s,t):LA.add(s,t)}return s};
LA.cof=(A,i,j)=>{const d=LA.det(LA.menor(A,i,j));return(i+j)%2?LA.neg(d):d};
// determinante por triangulación con pasos
LA.detTri=A0=>{const A=LA.copia(A0),n=A.length,pasos=[];let sig=1;for(let c=0;c<n;c++){let p=-1;for(let i=c;i<n;i++)if(!LA.z(A[i][c])){p=i;break}if(p<0)return{det:LA.Z,pasos,A};
  if(p!==c){[A[p],A[c]]=[A[c],A[p]];sig=-sig;pasos.push({op:`F${c+1} ↔ F${p+1} (cambia el signo)`,M:LA.copia(A)})}for(let i=c+1;i<n;i++){if(LA.z(A[i][c]))continue;const f=LA.div(A[i][c],A[c][c]);A[i]=A[i].map((v,j)=>LA.sub(v,LA.mul(f,A[c][j])));pasos.push({op:`F${i+1} → F${i+1} − (${LA.str(f)})·F${c+1}`,M:LA.copia(A)})}}
  let d=sig<0?LA.neg(LA.U):LA.U;for(let i=0;i<n;i++)d=LA.mul(d,A[i][i]);return{det:d,pasos,A,sig}};
LA.adjunta=A=>{const n=A.length,C=A.map((r,i)=>r.map((_,j)=>LA.cof(A,i,j)));return{C,adj:LA.T(C)}};
LA.cramer=(A,b)=>{const D=LA.det(A);if(LA.z(D))return{D,singular:true};const Ds=A[0].map((_,j)=>LA.det(A.map((r,i)=>r.map((v,k)=>k===j?b[i]:v))));return{D,Ds,x:Ds.map(d=>LA.div(d,D))}};
// ---------- LU (Doolittle); con intercambio de filas si un pivote es cero (PA = LU)
LA.lu=A0=>{const n=A0.length,A=LA.copia(A0),L=LA.id(n),P=[...Array(n).keys()],pasos=[];let cambio=false;
  for(let c=0;c<n;c++){if(LA.z(A[c][c])){let p=-1;for(let i=c+1;i<n;i++)if(!LA.z(A[i][c])){p=i;break}if(p<0)return{singular:true};[A[p],A[c]]=[A[c],A[p]];[P[p],P[c]]=[P[c],P[p]];for(let k=0;k<c;k++)[L[p][k],L[c][k]]=[L[c][k],L[p][k]];cambio=true;pasos.push({op:`F${c+1} ↔ F${p+1}`,M:LA.copia(A)})}
    for(let i=c+1;i<n;i++){const f=LA.div(A[i][c],A[c][c]);L[i][c]=f;if(LA.z(f))continue;A[i]=A[i].map((v,j)=>LA.sub(v,LA.mul(f,A[c][j])));pasos.push({op:`F${i+1} → F${i+1} − (${LA.str(f)})·F${c+1}  ⟹  l${i+1}${c+1} = ${LA.str(f)}`,M:LA.copia(A)})}}
  return{L,U:A,P,cambio,pasos}};
LA.sustAdelante=(L,b)=>{const y=[];for(let i=0;i<L.length;i++){let s=b[i];for(let k=0;k<i;k++)s=LA.sub(s,LA.mul(L[i][k],y[k]));y.push(LA.div(s,L[i][i]))}return y};
LA.sustAtras=(U,y)=>{const n=U.length,x=Array(n);for(let i=n-1;i>=0;i--){let s=y[i];for(let k=i+1;k<n;k++)s=LA.sub(s,LA.mul(U[i][k],x[k]));x[i]=LA.div(s,U[i][i])}return x};
// ---------- subespacios
LA.nulo=A=>{const n=A[0].length,R=LA.rref(A),libres=[...Array(n).keys()].filter(j=>!R.piv.includes(j));return libres.map(f=>{const v=Array(n).fill(LA.Z);v[f]=LA.U;R.piv.forEach((c,i)=>v[c]=LA.neg(R.M[i][f]));return v})};
LA.subespacios=A=>{const R=LA.rref(A),m=A.length,n=A[0].length;return{R,col:R.piv.map(c=>A.map(r=>r[c])),fila:R.M.slice(0,R.rango),nulo:LA.nulo(A),nuloIzq:LA.nulo(LA.T(A)),r:R.rango,m,n}};
// ---------- vectores
LA.punto=(u,v)=>u.reduce((s,x,i)=>LA.add(s,LA.mul(x,v[i])),LA.Z);
LA.cruz=(u,v)=>[LA.sub(LA.mul(u[1],v[2]),LA.mul(u[2],v[1])),LA.sub(LA.mul(u[2],v[0]),LA.mul(u[0],v[2])),LA.sub(LA.mul(u[0],v[1]),LA.mul(u[1],v[0]))];
LA.norma2=u=>LA.punto(u,u);
LA.proy=(u,v)=>{const k=LA.div(LA.punto(u,v),LA.punto(v,v));return{k,p:v.map(x=>LA.mul(k,x))}};
// Gram-Schmidt sin normalizar (queda exacto); la normalización se hace aparte
LA.gram=V=>{const W=[],pasos=[];V.forEach((v,k)=>{let w=v.slice();const terms=[];W.forEach(u=>{if(LA.z(LA.norma2(u)))return;const P=LA.proy(v,u);terms.push({k:P.k,u});w=w.map((x,i)=>LA.sub(x,P.p[i]))});W.push(w);pasos.push({k,v,terms,w})});return{W,pasos}};
// ---------- valores propios: polinomio característico exacto (Faddeev-LeVerrier) y raíces
LA.charpoly=A=>{const n=A.length;let M=LA.id(n).map(r=>r.map(()=>LA.Z));const c=[LA.U];for(let k=1;k<=n;k++){const AM=LA.prod(A,M.map((r,i)=>r.map((v,j)=>i===j?LA.add(v,c[k-1]):v)));M=AM;let tr=LA.Z;for(let i=0;i<n;i++)tr=LA.add(tr,AM[i][i]);c.push(LA.neg(LA.div(tr,LA.q(k))))}return c}; // λ^n + c1 λ^(n−1) + … + cn
LA.raices=c=>{const n=c.length-1,a=c.map(LA.num);let z=[...Array(n)].map((_,k)=>({re:Math.cos(2*Math.PI*k/n+0.4)*1.5,im:Math.sin(2*Math.PI*k/n+0.4)*1.5}));
  const ev=x=>{let r={re:1,im:0};for(let k=1;k<=n;k++)r={re:r.re*x.re-r.im*x.im+a[k],im:r.re*x.im+r.im*x.re};return r};
  for(let it=0;it<500;it++){z=z.map((zi,i)=>{let d={re:1,im:0};z.forEach((zj,j)=>{if(i!==j){const t={re:zi.re-zj.re,im:zi.im-zj.im};d={re:d.re*t.re-d.im*t.im,im:d.re*t.im+d.im*t.re}}});const p=ev(zi),den=d.re*d.re+d.im*d.im||1e-300;return{re:zi.re-(p.re*d.re+p.im*d.im)/den,im:zi.im-(p.im*d.re-p.re*d.im)/den}})}
  return z.map(r=>({re:Math.abs(r.re)<1e-10?0:r.re,im:Math.abs(r.im)<1e-9?0:r.im})).sort((p,q)=>q.re-p.re||q.im-p.im)};
// raíz racional exacta si existe (prueba candidatos p/q)
LA.racional=(c,x)=>{const cand=LA.q(Math.round(x*720),720);for(const d of [1n,2n,3n,4n,5n,6n,8n,9n,10n,12n]){const r=LA.q(BigInt(Math.round(x*Number(d))),d);let v=LA.U;for(let k=1;k<c.length;k++)v=LA.add(LA.mul(v,r),c[k]);if(LA.z(v))return r}return null};
LA.propios=A=>{const c=LA.charpoly(A),rs=LA.raices(c),out=[];const vistos=[];rs.forEach(r=>{if(r.im!==0){out.push({re:r.re,im:r.im});return}const ex=LA.racional(c,r.re);
  if(ex){if(vistos.some(v=>LA.eq(v,ex)))return;vistos.push(ex);const B=A.map((row,i)=>row.map((v,j)=>i===j?LA.sub(v,ex):v)),N=LA.nulo(B),mult=rs.filter(s=>s.im===0&&Math.abs(s.re-r.re)<1e-6).length;out.push({ex,re:LA.num(ex),vec:N,ma:mult,mg:N.length})}
  else out.push({re:r.re,im:0,num:true})});return{c,rs,vals:out}};
// formas cuadráticas: menores principales dominantes
LA.menores=A=>A.map((_,k)=>LA.det(A.slice(0,k+1).map(r=>r.slice(0,k+1))));
LA.definida=A=>{const D=LA.menores(A).map(LA.sgn),n=D.length;if(D.every(s=>s>0))return"definida positiva";if(D.every((s,k)=>s===(k%2?1:-1)))return"definida negativa";return null};
LA.esSim=A=>A.every((r,i)=>r.every((v,j)=>LA.eq(v,A[j][i])));
