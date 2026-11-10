// Economiapp · series de tiempo y panel
// Economiapp · Econometría II: series de tiempo y datos de panel (cálculo numérico en el navegador).
const TS={};
// ---------- Números aleatorios reproducibles
TS.rng=seed=>{let a=seed>>>0||1;const u=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  let sp=null;const n=()=>{if(sp!==null){const v=sp;sp=null;return v}let x,y,r;do{x=2*u()-1;y=2*u()-1;r=x*x+y*y}while(r>=1||r===0);const f=Math.sqrt(-2*Math.log(r)/r);sp=y*f;return x*f};return{u,n}};
// ---------- Utilidades
TS.mean=x=>x.reduce((s,v)=>s+v,0)/x.length;
TS.diff=(x,d=1)=>x.slice(d).map((v,i)=>v-x[i]);
TS.leer=txt=>{const v=String(txt).replace(/;/g," ").split(/[\s\t\n]+/).filter(Boolean).map(s=>{s=s.trim();if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s))s=s.replace(/\./g,"").replace(",",".");else s=s.replace(",",".");return parseFloat(s)});return v.every(isFinite)?v:null};
TS.inv=A=>{const n=A.length,M=A.map((r,i)=>[...r,...r.map((_,j)=>i===j?1:0)]);for(let c=0;c<n;c++){let p=c;for(let i=c+1;i<n;i++)if(Math.abs(M[i][c])>Math.abs(M[p][c]))p=i;if(Math.abs(M[p][c])<1e-14)return null;[M[c],M[p]]=[M[p],M[c]];const d=M[c][c];for(let k=0;k<2*n;k++)M[c][k]/=d;
  for(let i=0;i<n;i++)if(i!==c){const f=M[i][c];if(f)for(let k=0;k<2*n;k++)M[i][k]-=f*M[c][k]}}return M.map(r=>r.slice(n))};
TS.mm=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,k)=>s+v*B[k][j],0)));
TS.tr=A=>A[0].map((_,j)=>A.map(r=>r[j]));
TS.det=A=>{const n=A.length,M=A.map(r=>r.slice());let d=1;for(let c=0;c<n;c++){let p=c;for(let i=c+1;i<n;i++)if(Math.abs(M[i][c])>Math.abs(M[p][c]))p=i;if(Math.abs(M[p][c])<1e-300)return 0;if(p!==c){[M[c],M[p]]=[M[p],M[c]];d=-d}d*=M[c][c];for(let i=c+1;i<n;i++){const f=M[i][c]/M[c][c];for(let k=c;k<n;k++)M[i][k]-=f*M[c][k]}}return d};
// ---------- MCO
TS.ols=(X,y)=>{const n=y.length,k=X[0].length,Xt=TS.tr(X),XtXi=TS.inv(TS.mm(Xt,X));if(!XtXi)return null;const b=TS.mm(XtXi,TS.mm(Xt,y.map(v=>[v]))).map(r=>r[0]);
  const fit=X.map(r=>r.reduce((s,v,j)=>s+v*b[j],0)),e=y.map((v,i)=>v-fit[i]),ssr=e.reduce((s,v)=>s+v*v,0),s2=ssr/(n-k),se=XtXi.map((r,i)=>Math.sqrt(s2*r[i])),my=TS.mean(y),sst=y.reduce((s,v)=>s+(v-my)**2,0);
  return{b,se,t:b.map((v,i)=>v/se[i]),e,fit,ssr,s2,n,k,r2:1-ssr/sst,XtXi,V:XtXi.map(r=>r.map(v=>v*s2))}};
// ---------- Distribuciones
TS.lgam=x=>{const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.1208650973866179e-2,-.5395239384953e-5];let y=x,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(const v of c)s+=v/++y;return-t+Math.log(2.5066282746310005*s/x)};
TS.gammaP=(a,x)=>{if(x<=0)return 0;if(x<a+1){let s=1/a,d=s,ap=a;for(let i=0;i<500;i++){ap++;d*=x/ap;s+=d;if(Math.abs(d)<Math.abs(s)*1e-15)break}return s*Math.exp(-x+a*Math.log(x)-TS.lgam(a))}
  let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const de=d*c;h*=de;if(Math.abs(de-1)<1e-15)break}return 1-Math.exp(-x+a*Math.log(x)-TS.lgam(a))*h};
TS.pchi=(x,k)=>1-TS.gammaP(k/2,x/2);
TS.betacf=(a,b,x)=>{let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<1e-300)d=1e-300;d=1/d;let h=d;for(let m=1;m<300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;h*=d*c;aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const de=d*c;h*=de;if(Math.abs(de-1)<3e-15)break}return h};
TS.ibeta=(a,b,x)=>{if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(TS.lgam(a+b)-TS.lgam(a)-TS.lgam(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*TS.betacf(a,b,x)/a:1-bt*TS.betacf(b,a,1-x)/b};
TS.pF=(f,d1,d2)=>f<=0?1:1-TS.ibeta(d1/2,d2/2,d1*f/(d1*f+d2));
TS.pt2=(t,df)=>TS.ibeta(df/2,.5,df/(df+t*t));
// ---------- Simulación de procesos
TS.arma=(n,{c=0,phi=[],theta=[],sigma=1,seed=1,burn=200,trend=0,rw=false,drift=0})=>{const R=TS.rng(seed),N=n+burn,y=[],e=[];
  for(let t=0;t<N;t++){const et=sigma*R.n();e.push(et);if(rw){y.push((t?y[t-1]:0)+drift+et);continue}let v=c+et;phi.forEach((p,i)=>{if(t-i-1>=0)v+=p*y[t-i-1]});theta.forEach((q,i)=>{if(t-i-1>=0)v+=q*e[t-i-1]});y.push(v)}
  const out=y.slice(burn);return trend?out.map((v,t)=>v+trend*(t+1)):out};
TS.garch=(n,{omega=.1,alpha=.1,beta=.8,seed=1,burn=300})=>{const R=TS.rng(seed),e=[],s2=[];let sp=omega/Math.max(1e-6,1-alpha-beta);for(let t=0;t<n+burn;t++){const st=t?omega+alpha*e[t-1]**2+beta*s2[t-1]:sp;s2.push(st);e.push(Math.sqrt(st)*R.n())}return{e:e.slice(burn),s2:s2.slice(burn)}};
// ---------- Autocorrelaciones
TS.acf=(x,K)=>{const m=TS.mean(x),d=x.map(v=>v-m),g0=d.reduce((s,v)=>s+v*v,0);return[...Array(K)].map((_,k)=>{let s=0;for(let t=0;t<x.length-k-1;t++)s+=d[t]*d[t+k+1];return s/g0})};
TS.pacf=r=>{const K=r.length,out=[];let phi=[];for(let k=1;k<=K;k++){let pk;if(k===1){pk=r[0];phi=[pk]}else{let num=r[k-1],den=1;for(let j=1;j<k;j++){num-=phi[j-1]*r[k-j-1];den-=phi[j-1]*r[j-1]}pk=num/den;phi=[...phi.map((v,j)=>v-pk*phi[k-j-2]),pk]}out.push(pk)}return out};
TS.acfTeo=(phi,theta,K)=>{const x=TS.arma(20000,{phi,theta,seed:7,burn:500});return TS.acf(x,K)};
TS.psiWeights=(phi,theta,H)=>{const psi=[1];for(let j=1;j<=H;j++){let v=j<=theta.length?theta[j-1]:0;phi.forEach((p,i)=>{if(j-i-1>=0)v+=p*psi[j-i-1]});psi.push(v)}return psi};
TS.acfExact=(phi,theta,K)=>{const psi=TS.psiWeights(phi,theta,3000),g=k=>{let s=0;for(let j=0;j+k<psi.length;j++)s+=psi[j]*psi[j+k];return s},g0=g(0);return[...Array(K)].map((_,k)=>g(k+1)/g0)};
// ---------- Raíces de polinomios (Durand-Kerner) y raíces del polinomio característico
TS.roots=c=>{const n=c.length-1;if(n<1)return[];const a=c.map(v=>v/c[0]);let z=[...Array(n)].map((_,i)=>({re:Math.cos(2*Math.PI*i/n+.4)*.9,im:Math.sin(2*Math.PI*i/n+.4)*.9}));
  const mul=(p,q)=>({re:p.re*q.re-p.im*q.im,im:p.re*q.im+p.im*q.re}),sub=(p,q)=>({re:p.re-q.re,im:p.im-q.im}),div=(p,q)=>{const d=q.re*q.re+q.im*q.im;return{re:(p.re*q.re+p.im*q.im)/d,im:(p.im*q.re-p.re*q.im)/d}};
  for(let it=0;it<500;it++){let mv=0;z=z.map((zi,i)=>{const p=a.reduce((acc,ck)=>({re:acc.re*zi.re-acc.im*zi.im+ck,im:acc.re*zi.im+acc.im*zi.re}),{re:0,im:0});let d={re:1,im:0};z.forEach((zj,j)=>{if(j!==i)d=mul(d,sub(zi,zj))});const w=div(p,d);mv=Math.max(mv,Math.hypot(w.re,w.im));return sub(zi,w)});if(mv<1e-14)break}
  return z.map(v=>({re:Math.abs(v.re)<1e-12?0:v.re,im:Math.abs(v.im)<1e-10?0:v.im,mod:Math.hypot(v.re,v.im)}))};
// raíces inversas de 1 − φ1 L − … − φp L^p  ⇔ raíces de z^p − φ1 z^(p−1) − … − φp
TS.invRoots=phi=>phi.length?TS.roots([1,...phi.map(v=>-v)]):[];
TS.charpoly=A=>{const n=A.length;let M=A.map(r=>r.map(()=>0));const c=[1];for(let k=1;k<=n;k++){const AM=TS.mm(A,M.map((r,i)=>r.map((v,j)=>v+(i===j?c[k-1]:0))));M=AM.map(r=>r.slice());const tr=AM.reduce((s,r,i)=>s+r[i],0);c.push(-tr/k)}return c};
TS.eig=A=>TS.roots(TS.charpoly(A));
// ---------- Ajuste AR(p) por MCO con muestra común
TS.lagMat=(y,p,start)=>{const X=[],Y=[];for(let t=start;t<y.length;t++){X.push([1,...[...Array(p)].map((_,i)=>y[t-i-1])]);Y.push(y[t])}return{X,Y}};
TS.arFit=(y,p,start)=>{const{X,Y}=TS.lagMat(y,p,start??p),r=TS.ols(X,Y);if(!r)return null;const n=Y.length,k=p+1,ll=-n/2*(Math.log(2*Math.PI*r.ssr/n)+1);return{...r,p,aic:-2*ll+2*(k+1),bic:-2*ll+Math.log(n)*(k+1),aicT:Math.log(r.ssr/n)+2*k/n,bicT:Math.log(r.ssr/n)+Math.log(n)*k/n}};
TS.ljung=(e,K,fitdf=0)=>{const r=TS.acf(e,K),n=e.length,Q=n*(n+2)*r.reduce((s,v,k)=>s+v*v/(n-k-1),0),df=K-fitdf;return{Q,df,p:df>0?TS.pchi(Q,df):NaN}};
TS.forecast=(y,fit,H)=>{const p=fit.p,b=fit.b,ext=y.slice(),out=[];for(let h=1;h<=H;h++){let v=b[0];for(let i=1;i<=p;i++)v+=b[i]*ext[ext.length-i];ext.push(v);out.push(v)}
  const psi=TS.psiWeights(b.slice(1),[],H),s=Math.sqrt(fit.s2);let acc=0;return out.map((v,h)=>{acc+=psi[h]**2;const se=s*Math.sqrt(acc);return{h:h+1,f:v,se,lo:v-1.96*se,hi:v+1.96*se}})};
// ---------- Pruebas de raíz unitaria
// Coeficientes de superficie de respuesta de MacKinnon (2010): c(T) = b0 + b1/T + b2/T² + b3/T³
TS.MK={nc:{1:[-2.56574,-2.2358,-3.627,0],5:[-1.941,-.2686,-3.365,31.223],10:[-1.61682,.2656,-2.714,25.364]},
  c:{1:[-3.43035,-6.5393,-16.786,-79.433],5:[-2.86154,-2.8903,-4.234,-40.04],10:[-2.56677,-1.5384,-2.809,0]},
  ct:{1:[-3.95877,-9.0531,-28.428,-134.155],5:[-3.41049,-4.3904,-9.036,-45.374],10:[-3.12705,-2.5856,-3.925,-22.38]},
  eg2:{1:[-3.89644,-10.9519,-22.527,0],5:[-3.33613,-6.1101,-6.823,0],10:[-3.04445,-4.2412,-2.72,0]}};
TS.crit=(tipo,T)=>Object.fromEntries([1,5,10].map(a=>{const b=TS.MK[tipo][a];return[a,b[0]+b[1]/T+b[2]/T**2+b[3]/T**3]}));
TS.adfReg=(y,tipo,k)=>{const dy=TS.diff(y),X=[],Y=[];for(let t=k;t<dy.length;t++){const row=[];if(tipo!=="nc")row.push(1);if(tipo==="ct")row.push(t+2);row.push(y[t]);for(let i=1;i<=k;i++)row.push(dy[t-i]);X.push(row);Y.push(dy[t])}
  const r=TS.ols(X,Y),j=tipo==="nc"?0:tipo==="c"?1:2;return r?{...r,g:r.b[j],tstat:r.t[j],j,k,tipo}:null};
TS.adf=(y,tipo="c",k=null,kmax=null)=>{let sel=null;if(k===null){kmax=kmax??Math.floor(12*Math.pow(y.length/100,.25));let best=null;
    for(let kk=0;kk<=kmax;kk++){const dy=TS.diff(y),X=[],Y=[];for(let t=kmax;t<dy.length;t++){const row=[];if(tipo!=="nc")row.push(1);if(tipo==="ct")row.push(t+2);row.push(y[t]);for(let i=1;i<=kk;i++)row.push(dy[t-i]);X.push(row);Y.push(dy[t])}
      const r=TS.ols(X,Y);if(!r)continue;const n=Y.length,aic=n*Math.log(r.ssr/n)+2*r.k;if(!best||aic<best.aic)best={k:kk,aic}}k=best?best.k:0;sel="AIC"}
  const r=TS.adfReg(y,tipo,k);if(!r)return null;return{...r,crit:TS.crit(tipo,r.n),sel}};
TS.nwVar=(e,l)=>{const n=e.length;let s=e.reduce((a,v)=>a+v*v,0)/n;for(let j=1;j<=l;j++){let g=0;for(let t=j;t<n;t++)g+=e[t]*e[t-j];s+=2*(1-j/(l+1))*g/n}return s};
TS.kpss=(y,tipo="c",corto=true)=>{const n=y.length,X=y.map((_,t)=>tipo==="ct"?[1,t+1]:[1]),r=TS.ols(X,y),e=r.e;let S=0,sum=0;e.forEach(v=>{S+=v;sum+=S*S});const l=corto?Math.trunc(4*Math.pow(n/100,.25)):Math.trunc(12*Math.pow(n/100,.25)),s2=TS.nwVar(e,l);
  return{stat:sum/(n*n*s2),l,crit:tipo==="ct"?{10:.119,5:.146,2.5:.176,1:.216}:{10:.347,5:.463,2.5:.574,1:.739}}};
TS.pp=(y,tipo="c",corto=true)=>{const r=TS.adfReg(y,tipo,0),n=r.n,l=corto?Math.trunc(4*Math.pow(n/100,.25)):Math.trunc(12*Math.pow(n/100,.25)),g0=r.ssr/n,lam2=TS.nwVar(r.e,l),s=Math.sqrt(r.s2),se=r.se[r.j];
  const Z=Math.sqrt(g0/lam2)*r.tstat-.5*(lam2-g0)/Math.sqrt(lam2)*(n*se/s);return{stat:Z,l,t:r.tstat,crit:TS.crit(tipo,n),n}};
// ---------- ARCH
TS.archLM=(e,q)=>{const e2=e.map(v=>v*v),X=[],Y=[];for(let t=q;t<e2.length;t++){X.push([1,...[...Array(q)].map((_,i)=>e2[t-i-1])]);Y.push(e2[t])}const r=TS.ols(X,Y),LM=Y.length*r.r2;return{LM,df:q,p:TS.pchi(LM,q),r}};
// ---------- VAR
TS.varData=(Y,p,start)=>{const T=Y.length,K=Y[0].length,X=[],Z=[];for(let t=start;t<T;t++){const row=[1];for(let i=1;i<=p;i++)row.push(...Y[t-i]);X.push(row);Z.push(Y[t])}return{X,Z,K}};
TS.varFit=(Y,p,start)=>{const{X,Z,K}=TS.varData(Y,p,start??p),eqs=[...Array(K)].map((_,j)=>TS.ols(X,Z.map(r=>r[j])));if(eqs.some(e=>!e))return null;const T=Z.length,U=eqs.map(e=>e.e),Sig=U.map(a=>U.map(b=>a.reduce((s,v,i)=>s+v*b[i],0)/T)),ld=Math.log(TS.det(Sig)),np=p*K*K;
  const A=[...Array(p)].map((_,i)=>[...Array(K)].map((_,r)=>[...Array(K)].map((_,c)=>eqs[r].b[1+i*K+c])));const comp=[...Array(K*p)].map((_,r)=>[...Array(K*p)].map((_,c)=>r<K?A[Math.floor(c/K)][r][c%K]:(c===r-K?1:0)));
  return{eqs,A,c:eqs.map(e=>e.b[0]),Sig,T,K,p,aic:ld+2*np/T,hq:ld+2*Math.log(Math.log(T))*np/T,sc:ld+Math.log(T)*np/T,comp,mods:TS.eig(comp).map(z=>z.mod)}};
TS.chol=S=>{const n=S.length,L=S.map(r=>r.map(()=>0));for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let s=S[i][j];for(let k=0;k<j;k++)s-=L[i][k]*L[j][k];L[i][j]=i===j?Math.sqrt(Math.max(s,0)):s/L[j][j]}return L};
TS.irf=(fit,H,orto=true)=>{const K=fit.K,p=fit.p,P=orto?TS.chol(fit.Sig):fit.Sig.map((r,i)=>r.map((_,j)=>i===j?1:0));let Phi=[fit.comp.map((r,i)=>r.map((_,j)=>i===j?1:0))],out=[];
  let M=Phi[0];for(let h=0;h<=H;h++){const Ph=M.slice(0,K).map(r=>r.slice(0,K));out.push(TS.mm(Ph,P));M=TS.mm(fit.comp,M)}return out};
TS.granger=(Y,p,causa,efecto)=>{const{X,Z,K}=TS.varData(Y,p,p),y=Z.map(r=>r[efecto]),u=TS.ols(X,y),keep=X[0].map((_,j)=>j===0||((j-1)%K)!==causa),Xr=X.map(r=>r.filter((_,j)=>keep[j])),rr=TS.ols(Xr,y),df2=y.length-X[0].length,F=((rr.ssr-u.ssr)/p)/(u.ssr/df2);return{F,df1:p,df2,p:TS.pF(F,p,df2)}};
// ---------- Cointegración
TS.engleGranger=(y,x,k=null)=>{const r=TS.ols(x.map(v=>[1,v]),y),a=TS.adf(r.e,"nc",k);return{reg:r,adf:a,crit:TS.crit("eg2",a.n)}};
TS.johansen=(Y,k=2)=>{const T0=Y.length,K=Y[0].length,dY=Y.slice(1).map((r,i)=>r.map((v,j)=>v-Y[i][j])),Z0=[],Z1=[],Z2=[];
  for(let t=k;t<T0;t++){Z0.push(dY[t-1]);Z1.push(Y[t-1]);const z=[1];for(let i=1;i<k;i++)z.push(...dY[t-1-i]);Z2.push(z)}
  const res=Zm=>Zm[0].map((_,j)=>TS.ols(Z2,Zm.map(r=>r[j])).e),R0=res(Z0),R1=res(Z1),T=Z0.length,S=(A,B)=>A.map(a=>B.map(b=>a.reduce((s,v,i)=>s+v*b[i],0)/T));
  const S00=S(R0,R0),S11=S(R1,R1),S01=S(R0,R1),S10=TS.tr(S01),M=TS.mm(TS.mm(TS.inv(S11),S10),TS.mm(TS.inv(S00),S01)),lam=TS.eig(M).map(z=>z.re).sort((a,b)=>b-a);
  const vec=lam.map(l=>{const B=M.map((r,i)=>r.map((v,j)=>v-(i===j?l:0)));let v=K===2?(Math.abs(B[0][1])>1e-12||Math.abs(B[0][0])>1e-12?[-B[0][1],B[0][0]]:[-B[1][1],B[1][0]]):null;if(!v)return null;const n=v[0];return v.map(x=>x/n)});
  const trace=lam.map((_,r)=>-T*lam.slice(r).reduce((s,l)=>s+Math.log(1-l),0)),maxe=lam.map(l=>-T*Math.log(1-l));
  const beta=vec[0],alpha=beta?S01.map(r=>r.reduce((s,v,i)=>s+v*beta[i],0)/beta.reduce((s,v,i)=>s+v*S11[i].reduce((t,w,j)=>t+w*beta[j],0),0)):null;
  return{lam,trace,maxe,beta,alpha,T,K,
    cv:{trace:[[15.66,17.95,23.52],[6.5,8.18,11.65]],maxe:[[12.91,14.9,19.19],[6.5,8.18,11.65]]}}};
// ---------- Panel balanceado: id, t, y, X (lista de regresores)
TS.panel=(d)=>{const ids=[...new Set(d.map(r=>r.id))],N=ids.length,T=d.length/N,K=d[0].x.length,NT=d.length;
  const by=ids.map(i=>d.filter(r=>r.id===i)),my=by.map(g=>TS.mean(g.map(r=>r.y))),mx=by.map(g=>[...Array(K)].map((_,j)=>TS.mean(g.map(r=>r.x[j]))));
  const pool=TS.ols(d.map(r=>[1,...r.x]),d.map(r=>r.y));
  const wi=[],wy=[];by.forEach((g,i)=>g.forEach(r=>{wi.push(r.x.map((v,j)=>v-mx[i][j]));wy.push(r.y-my[i])}));const fe0=TS.ols(wi,wy),dfw=NT-N-K,s2e=fe0.ssr/dfw,feV=fe0.XtXi.map(r=>r.map(v=>v*s2e)),fe={b:fe0.b,se:feV.map((r,i)=>Math.sqrt(r[i])),V:feV,ssr:fe0.ssr,s2:s2e,df:dfw};fe.t=fe.b.map((v,i)=>v/fe.se[i]);
  const bt=TS.ols(mx.map(x=>[1,...x]),my),s21=T*bt.ssr/(N-K-1),theta=s21>s2e?1-Math.sqrt(s2e/s21):0,s2u=Math.max(0,(s21-s2e)/T);
  const re0=TS.ols(d.map((r,ii)=>{const i=ids.indexOf(r.id);return[1-theta,...r.x.map((v,j)=>v-theta*mx[i][j])]}),d.map(r=>{const i=ids.indexOf(r.id);return r.y-theta*my[i]}));
  const nb=fe.b.length,bRE=re0.b.slice(1),VRE=re0.V.slice(1).map(r=>r.slice(1)),dif=fe.b.map((v,i)=>v-bRE[i]),Vd=fe.V.map((r,i)=>r.map((v,j)=>v-VRE[i][j])),Vdi=TS.inv(Vd);
  const H=Vdi?dif.reduce((s,v,i)=>s+v*Vdi[i].reduce((a,w,j)=>a+w*dif[j],0),0):NaN;
  const Ff=((pool.ssr-fe.ssr)/(N-1))/(fe.ssr/dfw);const eP=pool.e;let num=0;by.forEach((g,i)=>{let s=0;g.forEach(r=>{s+=eP[d.indexOf(r)]});num+=s*s});const den=eP.reduce((s,v)=>s+v*v,0),LM=NT/(2*(T-1))*(num/den-1)**2;
  return{N,T,K,NT,pool,fe,re:{b:re0.b,se:re0.se,t:re0.t,theta,s2u,s2e},haus:{H:Math.abs(H),neg:H<0,df:nb,p:isFinite(H)?TS.pchi(Math.abs(H),nb):NaN},fF:{F:Ff,df1:N-1,df2:dfw,p:TS.pF(Ff,N-1,dfw)},bp:{LM,p:TS.pchi(LM,1)},alpha:by.map((g,i)=>my[i]-mx[i].reduce((s,v,j)=>s+v*fe.b[j],0))}};
TS.simPanel=({N=30,T=8,beta=1.5,rho=0.6,su=1,se=1,seed=3})=>{const R=TS.rng(seed),d=[];for(let i=0;i<N;i++){const a=su*R.n();for(let t=0;t<T;t++){const x=rho*a+R.n()*1;d.push({id:i+1,t:t+1,x:[x],y:2+beta*x+a+se*R.n()})}}return d};
