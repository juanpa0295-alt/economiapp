// Economiapp · cálculos de Estadística I (descriptiva, probabilidad y distribuciones) como funciones puras.
const E1={};
// ---------- funciones especiales
E1.lgam=x=>{const g=7,c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
  if(x<0.5)return Math.log(Math.PI/Math.sin(Math.PI*x))-E1.lgam(1-x);x-=1;let a=c[0];const t=x+g+0.5;for(let i=1;i<9;i++)a+=c[i]/(x+i);return 0.5*Math.log(2*Math.PI)+(x+0.5)*Math.log(t)-t+Math.log(a)};
E1.lfact=n=>E1.lgam(n+1);
E1.comb=(n,k)=>k<0||k>n?0:Math.round(Math.exp(E1.lfact(n)-E1.lfact(k)-E1.lfact(n-k)));
E1.lcomb=(n,k)=>k<0||k>n?-Infinity:E1.lfact(n)-E1.lfact(k)-E1.lfact(n-k);
E1.fact=n=>{let r=1;for(let i=2;i<=n;i++)r*=i;return r};
E1.perm=(n,k)=>k<0||k>n?0:Math.round(Math.exp(E1.lfact(n)-E1.lfact(n-k)));
E1.erf=x=>{const s=x<0?-1:1;x=Math.abs(x);if(x<3){let sum=x,term=x;for(let n=1;n<200;n++){term*=-x*x/n;const add=term/(2*n+1);sum+=add;if(Math.abs(add)<1e-17)break}return s*2/Math.sqrt(Math.PI)*sum}
  let f=0;for(let n=60;n>=1;n--)f=n/2/(x+f);return s*(1-Math.exp(-x*x)/Math.sqrt(Math.PI)/(x+f))};
E1.Phi=z=>0.5*(1+E1.erf(z/Math.SQRT2));
E1.phi=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
E1.bis=(f,a,b,it=200)=>{let fa=f(a);for(let i=0;i<it;i++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0)b=m;else{a=m;fa=fm}}return(a+b)/2};
E1.zq=p=>E1.bis(z=>E1.Phi(z)-p,-40,40);
// gamma incompleta regularizada P(a, x)
E1.gammaP=(a,x)=>{if(x<=0)return 0;if(x<a+1){let s=1/a,t=1/a;for(let n=1;n<500;n++){t*=x/(a+n);s+=t;if(t<s*1e-15)break}return s*Math.exp(-x+a*Math.log(x)-E1.lgam(a))}
  let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break}
  return 1-Math.exp(-x+a*Math.log(x)-E1.lgam(a))*h};

// ---------- estadística descriptiva (cuantiles tipo 7, el predeterminado de R)
E1.cuantil=(s,p)=>{const n=s.length,h=(n-1)*p,lo=Math.floor(h);return lo+1<n?s[lo]+(h-lo)*(s[lo+1]-s[lo]):s[n-1]};
E1.describir=x=>{const n=x.length,s=[...x].sort((a,b)=>a-b),m=x.reduce((a,b)=>a+b,0)/n,dev=k=>x.reduce((a,v)=>a+Math.pow(v-m,k),0)/n,ss=x.reduce((a,v)=>a+(v-m)**2,0);
  const v=ss/(n-1),sd=Math.sqrt(v),med=E1.cuantil(s,0.5),q1=E1.cuantil(s,0.25),q3=E1.cuantil(s,0.75),cnt={};x.forEach(t=>cnt[t]=(cnt[t]||0)+1);
  const mx=Math.max(...Object.values(cnt)),modas=mx>1?Object.keys(cnt).filter(k=>cnt[k]===mx).map(Number):[],ric=q3-q1,k=Math.floor(0.1*n),rec=s.slice(k,n-k);
  return{n,s,media:m,mediana:med,modas,q1,q3,ric,min:s[0],max:s[n-1],rango:s[n-1]-s[0],var:v,sd,varP:ss/n,cv:sd/m,g1:dev(3)/Math.pow(dev(2),1.5),g2:dev(4)/dev(2)**2-3,pearson:3*(m-med)/sd,
    recortada:rec.reduce((a,b)=>a+b,0)/rec.length,cercas:[q1-1.5*ric,q3+1.5*ric],atipicos:s.filter(t=>t<q1-1.5*ric||t>q3+1.5*ric)}};
// tabla de frecuencias con la regla de Sturges
E1.frecuencias=(x,kOpt)=>{const s=[...x].sort((a,b)=>a-b),n=s.length,k=kOpt||Math.ceil(1+3.322*Math.log10(n)),lo=s[0],hi=s[n-1],w=(hi-lo)/k||1,cl=[];let F=0;
  for(let i=0;i<k;i++){const a=lo+i*w,b=lo+(i+1)*w,f=s.filter(v=>v>=a&&(i===k-1?v<=b:v<b)).length;F+=f;cl.push({a,b,m:(a+b)/2,f,fr:f/n,F,Fr:F/n})}return{k,w,cl,n}};
// datos agrupados: clases [{a, b, f}]
E1.agrupados=cl=>{const n=cl.reduce((s,c)=>s+c.f,0),m=cl.reduce((s,c)=>s+c.f*(c.a+c.b)/2,0)/n,v=cl.reduce((s,c)=>s+c.f*((c.a+c.b)/2-m)**2,0)/(n-1);let F=0,med=NaN,iM=0;
  for(const c of cl){if(F+c.f>=n/2&&isNaN(med))med=c.a+(n/2-F)/c.f*(c.b-c.a);F+=c.f}cl.forEach((c,i)=>{if(c.f>cl[iM].f)iM=i});const c=cl[iM],d1=c.f-(iM?cl[iM-1].f:0),d2=c.f-(iM<cl.length-1?cl[iM+1].f:0);
  return{n,media:m,var:v,sd:Math.sqrt(v),mediana:med,moda:c.a+(d1+d2?d1/(d1+d2):0.5)*(c.b-c.a),claseModal:iM}};

// ---------- probabilidad
E1.dosEventos=({pA,pB,pAB})=>({union:pA+pB-pAB,AdadoB:pB>0?pAB/pB:NaN,BdadoA:pA>0?pAB/pA:NaN,soloA:pA-pAB,soloB:pB-pAB,ninguno:1-(pA+pB-pAB),indep:Math.abs(pAB-pA*pB)<1e-9,excl:pAB<1e-12,valido:pAB<=Math.min(pA,pB)+1e-12&&pA+pB-pAB<=1+1e-12});
E1.bayes=({prior,lik})=>{const j=prior.map((p,i)=>p*lik[i]),tot=j.reduce((a,b)=>a+b,0);return{j,tot,post:j.map(v=>v/tot)}};

// ---------- variables aleatorias
E1.discreta=(xs,ps)=>{const m=xs.reduce((s,x,i)=>s+x*ps[i],0),e2=xs.reduce((s,x,i)=>s+x*x*ps[i],0);let F=0;return{suma:ps.reduce((a,b)=>a+b,0),media:m,e2,var:e2-m*m,sd:Math.sqrt(e2-m*m),F:ps.map(p=>F+=p)}};
// densidad f(x) = k·x^m en [a, b] con a ≥ 0
E1.potencia=({m,a,b})=>{const I=(p,lo,hi)=>(Math.pow(hi,p+1)-Math.pow(lo,p+1))/(p+1),k=1/I(m,a,b),E=k*I(m+1,a,b),E2=k*I(m+2,a,b),F=x=>x<=a?0:x>=b?1:k*I(m,a,x);return{k,E,E2,var:E2-E*E,F,f:x=>x>=a&&x<=b?k*Math.pow(x,m):0}};
// distribución conjunta discreta: tabla p[i][j] con valores xs (filas) y ys (columnas)
E1.conjunta=(xs,ys,p)=>{const px=p.map(r=>r.reduce((a,b)=>a+b,0)),py=ys.map((_,j)=>p.reduce((a,r)=>a+r[j],0)),tot=px.reduce((a,b)=>a+b,0),EX=xs.reduce((s,x,i)=>s+x*px[i],0),EY=ys.reduce((s,y,j)=>s+y*py[j],0);
  let EXY=0;p.forEach((r,i)=>r.forEach((v,j)=>EXY+=xs[i]*ys[j]*v));const VX=xs.reduce((s,x,i)=>s+x*x*px[i],0)-EX*EX,VY=ys.reduce((s,y,j)=>s+y*y*py[j],0)-EY*EY,cov=EXY-EX*EY;
  const indep=p.every((r,i)=>r.every((v,j)=>Math.abs(v-px[i]*py[j])<1e-9));return{px,py,tot,EX,EY,EXY,VX,VY,cov,rho:cov/Math.sqrt(VX*VY),indep}};
E1.lineal=({a,b,c,mx,my,sx,sy,rho})=>{const cov=rho*sx*sy;return{E:a*mx+b*my+c,V:a*a*sx*sx+b*b*sy*sy+2*a*b*cov,cov}};
E1.chebyshev=k=>1-1/(k*k);

// ---------- distribuciones discretas: pmf, soporte, media y varianza
E1.DISC={
  unif:{pmf:(x,{a,b})=>x>=a&&x<=b&&Number.isInteger(x)?1/(b-a+1):0,sop:({a,b})=>[a,b],m:({a,b})=>(a+b)/2,v:({a,b})=>((b-a+1)**2-1)/12},
  bern:{pmf:(x,{p})=>x===1?p:x===0?1-p:0,sop:()=>[0,1],m:({p})=>p,v:({p})=>p*(1-p)},
  binom:{pmf:(x,{n,p})=>x<0||x>n?0:Math.exp(E1.lcomb(n,x)+x*Math.log(p)+(n-x)*Math.log(1-p)),sop:({n})=>[0,n],m:({n,p})=>n*p,v:({n,p})=>n*p*(1-p)},
  hiper:{pmf:(x,{N,K,n})=>Math.exp(E1.lcomb(K,x)+E1.lcomb(N-K,n-x)-E1.lcomb(N,n))||0,sop:({N,K,n})=>[Math.max(0,n-(N-K)),Math.min(n,K)],m:({N,K,n})=>n*K/N,v:({N,K,n})=>n*K/N*(1-K/N)*(N-n)/(N-1)},
  geom:{pmf:(x,{p})=>x<1?0:Math.pow(1-p,x-1)*p,sop:({p})=>[1,Math.max(10,Math.ceil(Math.log(1e-4)/Math.log(1-p)))],m:({p})=>1/p,v:({p})=>(1-p)/(p*p)},
  nbin:{pmf:(x,{r,p})=>x<r?0:Math.exp(E1.lcomb(x-1,r-1)+r*Math.log(p)+(x-r)*Math.log(1-p)),sop:({r,p})=>[r,Math.ceil(r/p+6*Math.sqrt(r*(1-p))/p+5)],m:({r,p})=>r/p,v:({r,p})=>r*(1-p)/(p*p)},
  pois:{pmf:(x,{lam})=>x<0?0:Math.exp(-lam+x*Math.log(lam)-E1.lfact(x)),sop:({lam})=>[0,Math.ceil(lam+6*Math.sqrt(lam)+5)],m:({lam})=>lam,v:({lam})=>lam}};
E1.cdfD=(d,x,P)=>{const D=E1.DISC[d],[lo]=D.sop(P);let s=0;for(let k=lo;k<=Math.floor(x);k++)s+=D.pmf(k,P);return Math.min(1,s)};

// ---------- distribuciones continuas: densidad, distribución acumulada, media, varianza y rango para graficar
E1.CONT={
  unif:{f:(x,{a,b})=>x>=a&&x<=b?1/(b-a):0,F:(x,{a,b})=>x<=a?0:x>=b?1:(x-a)/(b-a),m:({a,b})=>(a+b)/2,v:({a,b})=>(b-a)**2/12,r:({a,b})=>[a-(b-a)*0.2,b+(b-a)*0.2]},
  norm:{f:(x,{mu,s})=>E1.phi((x-mu)/s)/s,F:(x,{mu,s})=>E1.Phi((x-mu)/s),m:({mu})=>mu,v:({s})=>s*s,r:({mu,s})=>[mu-4*s,mu+4*s]},
  expo:{f:(x,{lam})=>x<0?0:lam*Math.exp(-lam*x),F:(x,{lam})=>x<=0?0:1-Math.exp(-lam*x),m:({lam})=>1/lam,v:({lam})=>1/(lam*lam),r:({lam})=>[0,6/lam]},
  gamma:{f:(x,{al,be})=>x<=0?0:Math.exp((al-1)*Math.log(x)-x/be-E1.lgam(al)-al*Math.log(be)),F:(x,{al,be})=>E1.gammaP(al,Math.max(0,x)/be),m:({al,be})=>al*be,v:({al,be})=>al*be*be,r:({al,be})=>[0,al*be+6*Math.sqrt(al)*be]}};
E1.qC=(d,p,P)=>{const D=E1.CONT[d],[lo,hi]=D.r(P);let a=lo-1e3*(hi-lo),b=hi+1e3*(hi-lo);if(d==="expo"||d==="gamma")a=0;if(d==="unif"){a=P.a;b=P.b}return E1.bis(x=>D.F(x,P)-p,a,b)};
// aproximación normal con corrección por continuidad
E1.aproxBinom=({n,p,a,b})=>{let ex=0;for(let k=a;k<=b;k++)ex+=E1.DISC.binom.pmf(k,{n,p});const mu=n*p,s=Math.sqrt(n*p*(1-p));return{ex,mu,s,za:(a-0.5-mu)/s,zb:(b+0.5-mu)/s,ap:E1.Phi((b+0.5-mu)/s)-E1.Phi((a-0.5-mu)/s),sin:E1.Phi((b-mu)/s)-E1.Phi((a-mu)/s),regla:n*p>=5&&n*(1-p)>=5}};
E1.aproxPois=({lam,a,b})=>{let ex=0;for(let k=a;k<=b;k++)ex+=E1.DISC.pois.pmf(k,{lam});const s=Math.sqrt(lam);return{ex,mu:lam,s,za:(a-0.5-lam)/s,zb:(b+0.5-lam)/s,ap:E1.Phi((b+0.5-lam)/s)-E1.Phi((a-0.5-lam)/s)}};
// funciones generadoras de momentos
E1.FGM={binom:({n,p})=>t=>Math.pow(1-p+p*Math.exp(t),n),pois:({lam})=>t=>Math.exp(lam*(Math.exp(t)-1)),geom:({p})=>t=>p*Math.exp(t)/(1-(1-p)*Math.exp(t)),
  unif:({a,b})=>t=>Math.abs(t)<1e-12?1:(Math.exp(t*b)-Math.exp(t*a))/(t*(b-a)),norm:({mu,s})=>t=>Math.exp(mu*t+s*s*t*t/2),expo:({lam})=>t=>lam/(lam-t),gamma:({al,be})=>t=>Math.pow(1-be*t,-al)};
E1.momentosFGM=M=>{const h=1e-3,d1=(M(h)-M(-h))/(2*h),d2=(M(h)-2*M(0)+M(-h))/(h*h);return{m1:d1,m2:d2,var:d2-d1*d1}};
// generador pseudoaleatorio reproducible
E1.rng=seed=>{let s=seed>>>0||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}};
