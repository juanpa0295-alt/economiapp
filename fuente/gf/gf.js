// Gerencia Financiera I: matemáticas financieras como funciones puras (notación del curso: P, F, i, n, A, G)
const GF={};
// ---------- pago único
GF.F=(P,i,n)=>P*Math.pow(1+i,n);
GF.P=(F,i,n)=>F/Math.pow(1+i,n);
GF.n=(P,F,i)=>Math.log(F/P)/Math.log(1+i);
GF.i=(P,F,n)=>Math.pow(F/P,1/n)-1;
// tabla de capitalización (simple o compuesta)
GF.tabla=function(P,i,n,simple){const r=[];let c=P;for(let k=1;k<=n;k++){const ini=simple?P+P*i*(k-1):c,it=simple?P*i:c*i,fin=ini+it;r.push({k,ini,it,fin});c=fin}return r};
// ---------- ecuación de valor con tasas por tramos: rate(t) es la tasa del período (t−1, t]
GF.factor=function(rate,t){let d=1;for(let s=1;s<=t;s++)d*=1+rate(s);return d};// acumula de 0 a t
GF.mover=(rate,v,t,f)=>v*GF.factor(rate,f)/GF.factor(rate,t);// lleva v del período t al f
// ---------- conversión de tasas
// una tasa se describe por {v, nom (nominal true/efectiva false), ant (anticipada), m (capitalizaciones por año)}
GF.aPeriodicaVencida=function(t){let ip=t.nom?t.v/t.m:t.v;if(t.ant){if(ip>=1)return NaN;ip=ip/(1-ip)}return ip};
GF.desdePeriodicaVencida=function(ip,m0,dest){// ip vencida de periodicidad m0 → tasa destino
  const ipn=Math.pow(1+ip,m0/dest.m)-1;let x=dest.ant?ipn/(1+ipn):ipn;return dest.nom?x*dest.m:x};
GF.convertir=function(orig,dest){const ip=GF.aPeriodicaVencida(orig);return{ip,ea:Math.pow(1+ip,orig.m)-1,res:GF.desdePeriodicaVencida(ip,orig.m,dest)}};
GF.real=(ic,inf)=>(1+ic)/(1+inf)-1;
GF.combinada=(a,b)=>(1+a)*(1+b)-1;
// ---------- anualidades (A al final de cada período salvo anticipada)
GF.VPa=(A,i,n,ant)=>A*(i===0?n:(1-Math.pow(1+i,-n))/i)*(ant?1+i:1);
GF.VFa=(A,i,n,ant)=>A*(i===0?n:(Math.pow(1+i,n)-1)/i)*(ant?1+i:1);
GF.Ap=(P,i,n,ant)=>P/((i===0?n:(1-Math.pow(1+i,-n))/i)*(ant?1+i:1));
GF.Af=(F,i,n,ant)=>F/((i===0?n:(Math.pow(1+i,n)-1)/i)*(ant?1+i:1));
GF.nA=(P,A,i,ant)=>{const a=ant?A*(1+i):A;const x=1-P*i/a;return x>0?-Math.log(x)/Math.log(1+i):NaN};
GF.iA=function(P,A,n,ant){let lo=1e-9,hi=5;const f=r=>GF.VPa(A,r,n,ant)-P;if(f(lo)<0)return NaN;for(let k=0;k<200;k++){const m=(lo+hi)/2;if(f(m)>0)lo=m;else hi=m}return(lo+hi)/2};
// ---------- amortización
GF.amort=function(P,i,n,sis){const r=[];let s=P;const A=GF.Ap(P,i,n,false),ab=P/n;
  for(let k=1;k<=n;k++){const it=s*i;let a,q;
    if(sis==="frances"){q=A;a=A-it}else if(sis==="aleman"){a=ab;q=a+it}else{a=k===n?P:0;q=it+a}
    r.push({k,ini:s,q,it,a,fin:s-a});s-=a}
  const tot=r.reduce((o,x)=>({q:o.q+x.q,it:o.it+x.it,a:o.a+x.a}),{q:0,it:0,a:0});return{r,tot,A,ab}};
// ---------- gradientes (primer flujo A1 en el período 1)
GF.gradA=function(A1,G,i,n){const fl=[...Array(n)].map((_,k)=>A1+G*k);const P=fl.reduce((s,f,k)=>s+f/Math.pow(1+i,k+1),0);
  const Pf=A1*(1-Math.pow(1+i,-n))/i+(G/i)*((1-Math.pow(1+i,-n))/i-n/Math.pow(1+i,n));return{fl,P,Pf,F:P*Math.pow(1+i,n)}};
GF.gradG=function(A1,g,i,n){const fl=[...Array(n)].map((_,k)=>A1*Math.pow(1+g,k));const P=fl.reduce((s,f,k)=>s+f/Math.pow(1+i,k+1),0);
  const Pf=Math.abs(i-g)<1e-12?A1*n/(1+i):A1*(1-Math.pow((1+g)/(1+i),n))/(i-g);return{fl,P,Pf,F:P*Math.pow(1+i,n)}};
// ---------- criterios de decisión (flujos f[0..n], f[0] normalmente negativo)
GF.vpn=(f,i)=>f.reduce((s,x,t)=>s+x/Math.pow(1+i,t),0);
GF.tir=function(f){let lo=-0.99,hi=10;const v=r=>GF.vpn(f,r);if(v(lo)*v(hi)>0){lo=-0.5;hi=1;if(v(lo)*v(hi)>0)return NaN}
  for(let k=0;k<300;k++){const m=(lo+hi)/2;if(v(lo)*v(m)<=0)hi=m;else lo=m}return(lo+hi)/2};
GF.tirm=function(f,fin,rein){const n=f.length-1;let vpN=0,vfP=0;f.forEach((x,t)=>{if(x<0)vpN+=x/Math.pow(1+fin,t);else vfP+=x*Math.pow(1+rein,n-t)});return vpN<0?Math.pow(vfP/-vpN,1/n)-1:NaN};
GF.rbc=function(f,i){let b=0,c=0;f.forEach((x,t)=>{const v=x/Math.pow(1+i,t);if(x>=0)b+=v;else c-=v});return c>0?b/c:NaN};
GF.caue=(f,i)=>{const n=f.length-1;return GF.vpn(f,i)*i/(1-Math.pow(1+i,-n))};
GF.pri=function(f,i){let acc=0;for(let t=0;t<f.length;t++){const v=f[t]/Math.pow(1+i,t),prev=acc;acc+=v;if(t>0&&prev<0&&acc>=0)return t-1+(-prev)/v}return NaN};
if(typeof module!=="undefined")module.exports=GF;
