// Historia del Pensamiento Económico: cálculos de los modelos del libro de Tobón (2023) como funciones puras.
const HPE={};
// ---------- álgebra mínima
HPE.matVec=(M,v)=>M.map(r=>r.reduce((s,a,j)=>s+a*v[j],0));
HPE.inv=function(M){const n=M.length,A=M.map((r,i)=>[...r,...Array.from({length:n},(_,j)=>i===j?1:0)]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;if(Math.abs(A[p][c])<1e-12)return null;[A[c],A[p]]=[A[p],A[c]];
    const d=A[c][c];for(let j=0;j<2*n;j++)A[c][j]/=d;for(let r=0;r<n;r++)if(r!==c){const f=A[r][c];for(let j=0;j<2*n;j++)A[r][j]-=f*A[c][j]}}
  return A.map(r=>r.slice(n))};
// valor propio dominante y vector propio (Perron-Frobenius) por iteración de potencias
HPE.perron=function(B){const n=B.length;let v=Array(n).fill(1),lam=0;
  for(let k=0;k<2000;k++){const w=HPE.matVec(B,v),s=Math.max(...w.map(Math.abs));if(s<1e-14)return null;const nv=w.map(x=>x/s);
    const diff=Math.max(...nv.map((x,i)=>Math.abs(x-v[i])));v=nv;lam=s;if(diff<1e-13)break}
  return{lam,v}};

// ---------- Capítulo 3. Sraffa: (A p + l w)(1 + r) = p, con w = s·p  ⇒  B p (1 + r) = p, B = A + l s
// A[i][j]: cantidad del bien j por unidad del bien i; l[i]: trabajo por unidad de i; s[j]: canasta salarial por trabajador; num: índice del numerario
HPE.sraffa=function(A,l,s,num){const n=A.length;
  for(const r of A)for(const a of r)if(a<0)return{err:"los coeficientes técnicos no pueden ser negativos."};
  if(l.some(x=>x<0)||s.some(x=>x<0))return{err:"el trabajo y la canasta salarial no pueden ser negativos."};
  const B=A.map((r,i)=>r.map((a,j)=>a+l[i]*s[j]));
  const P=HPE.perron(B);if(!P)return{err:"la matriz B es nula."};
  if(P.lam>=1-1e-12)return{err:`el valor propio dominante de B es ${P.lam.toFixed(4)} ≥ 1: la economía no genera excedente social (la técnica y la canasta salarial consumen todo lo producido), así que no hay una tasa de beneficio positiva.`,B,lam:P.lam};
  if(P.v.some(x=>x<=1e-12))return{err:"algún precio sale nulo: la matriz no es irreducible (hay bienes no básicos). Revisa que cada bien use, directa o indirectamente, todos los demás.",B,lam:P.lam};
  const r=1/P.lam-1,p=P.v.map(x=>x/P.v[num]),w=s.reduce((a,sj,j)=>a+sj*p[j],0);
  const costo=A.map((row,i)=>row.reduce((a,aij,j)=>a+aij*p[j],0)+l[i]*w);
  const q=A.map((row,i)=>row.reduce((a,aij,j)=>a+aij*p[j],0)/(l[i]*w||1));
  return{B,lam:P.lam,r,p,w,costo,benef:costo.map(c=>c*r),q,check:costo.map((c,i)=>c*(1+r)-p[i])}};
// Gravitación (Boggio): p_t − p* = β(X − Y_t),  dY/dt = μ(p_t − p*)
HPE.gravitacion=function(pstar,X,Y0,beta,mu,T,dt){const out=[];let Y=Y0;for(let k=0;k<=T/dt;k++){const t=k*dt,p=pstar+beta*(X-Y);out.push({t,p,Y});Y+=dt*mu*(p-pstar)}return out};

// ---------- Capítulo 4. Marx
// valores-trabajo socialmente necesarios en una sociedad de artesanos: λ = (I − A)⁻¹ L
HPE.valores=function(A,L){const n=A.length,IA=A.map((r,i)=>r.map((a,j)=>(i===j?1:0)-a)),M=HPE.inv(IA);if(!M)return{err:"la matriz (I − A) no es invertible."};
  const lam=HPE.matVec(M,L);return{lam,ok:lam.every(x=>x>0),M}};
// proceso de valorización: Y = C + V + S, S = e·V, r = S/(C + V)
HPE.valorizacion=(C,V,e)=>{const S=e*V;return{S,Y:C+V+S,r:S/(C+V),D:C+V,Dp:C+V+S}};
// transformación de Bortkiewicz (z = 1): (xC_i + yV_i)(1 + r) = (x, y, z)_i·Y_i
HPE.transformacion=function(C,V,S){const Y=C.map((c,i)=>c+V[i]+S[i]);
  const a=C[1]*V[0]-C[0]*V[1],b=Y[0]*V[1]+Y[1]*C[0],c=-Y[0]*Y[1];let sig;
  if(Math.abs(a)<1e-12)sig=-c/b;else{const D=b*b-4*a*c;if(D<0)return{err:"el sistema no tiene solución real."};const r1=(-b+Math.sqrt(D))/(2*a),r2=(-b-Math.sqrt(D))/(2*a);sig=[r1,r2].filter(x=>x>1-1e-9).sort((u,v)=>u-v)[0];if(sig===undefined)return{err:"no hay una tasa de beneficio positiva con estos datos."}}
  const ratio=V[0]*sig/(Y[0]-C[0]*sig),y=Y[2]/(sig*(ratio*C[2]+V[2])),x=ratio*y,r=sig-1;
  if(!(x>0&&y>0))return{err:"los transformadores salen negativos: revisa los datos (la tasa de explotación debe ser uniforme y positiva)."};
  const PK=C.map(c=>x*c),PC=V.map(v=>y*v),P=[x*Y[0],y*Y[1],Y[2]],B=PK.map((k,i)=>(k+PC[i])*r);
  const e=S.map((s,i)=>s/V[i]),rv=S.map((s,i)=>s/(C[i]+V[i]));
  const repro={c:Math.abs(C[0]+C[1]+C[2]-Y[0])<1e-6,v:Math.abs(V[0]+V[1]+V[2]-Y[1])<1e-6,s:Math.abs(S[0]+S[1]+S[2]-Y[2])<1e-6};
  return{Y,x,y,z:1,r,PK,PC,P,B,e,rv,repro,totV:Y[0]+Y[1]+Y[2],totP:P[0]+P[1]+P[2],totS:S[0]+S[1]+S[2],totB:B[0]+B[1]+B[2]}};

// ---------- Capítulo 5. Walras: economía de intercambio con dos consumidores Cobb-Douglas y numerario p2 = 1
HPE.walras=function(al,w1,w2){// al[h]: peso del bien 1 en la utilidad de h; w1[h], w2[h]: dotaciones
  const Z1=p=>al.reduce((s,a,h)=>s+a*(p*w1[h]+w2[h])/p,0)-w1.reduce((a,b)=>a+b,0);
  const Z2=p=>al.reduce((s,a,h)=>s+(1-a)*(p*w1[h]+w2[h]),0)-w2.reduce((a,b)=>a+b,0);
  const num=al.reduce((s,a,h)=>s+a*w2[h],0),den=al.reduce((s,a,h)=>s+(1-a)*w1[h],0),ps=num/den;
  const asign=al.map((a,h)=>{const I=ps*w1[h]+w2[h];return{x1:a*I/ps,x2:(1-a)*I}});return{Z1,Z2,ps,asign}};
HPE.tanteo=function(Z1,p0,k,T){const out=[];let p=p0;for(let t=0;t<=T;t++){const z=Z1(p);out.push({t,p,z});p=Math.max(1e-4,p+k*z)}return out};

// ---------- Capítulo 6. Duopolio de Cournot del libro: p = a − (YA + YB), costos fijos CF, costo marginal c
HPE.cournot=function(a,CF,c,qcart){c=c||0;const qn=(a-c)/3,pn=a-2*qn,pin=(pn-c)*qn-CF;
  const qc=qcart!=null?qcart:(a-c)/4,pc=a-2*qc,pic=(pc-c)*qc-CF;
  const qd=(a-c-qc)/2;// mejor respuesta a qc (del libro: 40 frente a 30 con a=120)
  const pd=a-qc-qd,piD=(pd-c)*qd-CF,piR=(pd-c)*qc-CF;
  return{qn,pn,pin,qc,pc,pic,qd,pd,piD,piR,br:q=>Math.max(0,(a-c-q)/2)}};

// ---------- Capítulo 11. Curva de Phillips con anticipaciones adaptativas (Friedman) o racionales (Lucas)
// π_t = π^e_t − h(U_t − U_n);  π^e_{t+1} = π^e_t + γ(π_t − π^e_t)
HPE.phillips=function(o){const{Un,h,gamma,U0,pi0,piTarget,T,regla}=o;let pe=pi0;const out=[];
  for(let t=0;t<T;t++){let U,pi;
    if(regla==="racional"){pe=piTarget;pi=piTarget;U=Un}
    else{pi=piTarget;U=Un-(pi-pe)/h;}
    out.push({t,U,pi,pe});if(regla!=="racional")pe=pe+gamma*(pi-pe)}
  return out};
if(typeof module!=="undefined")module.exports=HPE;
