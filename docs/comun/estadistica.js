// Economiapp · distribuciones (reemplazan a scipy.stats) y cálculos de Estadística 2, como funciones puras.
// ===================== NÚCLEO NUMÉRICO =====================
// Mismas fórmulas que pages/4_Estadistica_2.py; las distribuciones reemplazan a scipy.stats.
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function normals(R,n){const o=new Float64Array(n);for(let i=0;i<n;i++){const u1=R()||1e-12,u2=R();o[i]=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2)}return o}
function gln(z){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.1208650973866179e-2,-.5395239384953e-5];
  let x=z,y=z,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(const ci of c)s+=ci/++y;return -t+Math.log(2.5066282746310005*s/x)}
function bcf(a,b,x){const F=1e-300;let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<F)d=F;d=1/d;let h=d;
  for(let m=1;m<=400;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<F)d=F;c=1+aa/c;if(Math.abs(c)<F)c=F;d=1/d;h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<F)d=F;c=1+aa/c;if(Math.abs(c)<F)c=F;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-14)break}return h}
function ibeta(a,b,x){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(gln(a+b)-gln(a)-gln(b)+a*Math.log(x)+b*Math.log(1-x));
  return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b}
function gammq(a,x){if(x<=0)return 1;const lg=-x+a*Math.log(x)-gln(a);
  if(x<a+1){let ap=a,sum=1/a,del=sum;for(let i=0;i<800;i++){ap++;del*=x/ap;sum+=del;if(Math.abs(del)<Math.abs(sum)*1e-15)break}return Math.max(0,1-sum*Math.exp(lg))}
  let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<800;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break}return Math.exp(lg)*h}
// erfc de alta precisión (W. J. Cody, vía la función complementaria con fracción continua para |x| grande)
function erfc(x){const z=Math.abs(x);let r;
  if(z<0.5){// serie de erf
    let s=z,t=z,n=0;const z2=z*z;do{n++;t*=-z2/n;s+=t/(2*n+1)}while(Math.abs(t/(2*n+1))>1e-17*Math.abs(s));r=1-2/Math.sqrt(Math.PI)*s}
  else if(z<6){r=gammq(0.5,z*z)}
  else{let f=0;for(let k=60;k>=1;k--)f=k/2/(z+f);r=Math.exp(-z*z)/Math.sqrt(Math.PI)/(z+f)}
  return x>=0?r:2-r}
const Phi=z=>0.5*erfc(-z/Math.SQRT2);
const npdf=z=>Math.exp(-z*z/2)/Math.sqrt(2*Math.PI);
function PhiInv(p){if(p<=0)return -Infinity;if(p>=1)return Infinity;
  const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.3577518672690,-30.66479806614716,2.506628277459239],
  b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],
  c=[-0.007784894002430293,-0.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],
  d=[0.007784695709041462,0.3224671290700398,2.445134137142996,3.754408661907416];
  const pl=0.02425;let q,r,x;
  if(p<pl){q=Math.sqrt(-2*Math.log(p));x=(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
  else if(p<=1-pl){q=p-0.5;r=q*q;x=(((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)}
  else{q=Math.sqrt(-2*Math.log(1-p));x=-(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
  for(let k=0;k<2;k++){const e=Phi(x)-p,u=e*Math.sqrt(2*Math.PI)*Math.exp(x*x/2);x=x-u/(1+x*u/2)}return x}
function invert(cdf,p,lo,hi){let k=0;while(cdf(hi)<p&&k++<200)hi=hi>0?hi*2:hi+1;k=0;while(cdf(lo)>p&&k++<200)lo=lo<0?lo*2:lo-1;
  for(let i=0;i<200;i++){const m=(lo+hi)/2;if(cdf(m)<p)lo=m;else hi=m;if(hi-lo<1e-13*Math.max(1,Math.abs(m)))break}return(lo+hi)/2}
const tcdf=(t,v)=>{const x=v/(v+t*t),tail=0.5*ibeta(v/2,0.5,x);return t>0?1-tail:tail};
const tpdf=(t,v)=>Math.exp(gln((v+1)/2)-gln(v/2)-(v+1)/2*Math.log(1+t*t/v))/Math.sqrt(v*Math.PI);
const chi2cdf=(x,k)=>x<=0?0:1-gammq(k/2,x/2);
const chi2pdf=(x,k)=>x<=0?0:Math.exp((k/2-1)*Math.log(x)-x/2-(k/2)*Math.log(2)-gln(k/2));
const fcdf=(x,a,b)=>x<=0?0:ibeta(a/2,b/2,a*x/(a*x+b));
const fpdf=(x,a,b)=>x<=0?0:Math.exp((a/2)*Math.log(a/b)+(a/2-1)*Math.log(x)-((a+b)/2)*Math.log(1+a*x/b)-(gln(a/2)+gln(b/2)-gln((a+b)/2)));
// distribuciones con la misma interfaz que scipy: cdf, ppf, pdf
const DIST={
  norm:()=>({name:"norm",cdf:Phi,ppf:PhiInv,pdf:npdf}),
  t:v=>({name:"t",v,cdf:x=>tcdf(x,v),ppf:p=>invert(x=>tcdf(x,v),p,-10,10),pdf:x=>tpdf(x,v)}),
  chi2:k=>({name:"chi2",k,cdf:x=>chi2cdf(x,k),ppf:p=>invert(x=>chi2cdf(x,k),p,0,k+10),pdf:x=>chi2pdf(x,k)}),
  f:(a,b)=>({name:"f",a,b,cdf:x=>fcdf(x,a,b),ppf:p=>invert(x=>fcdf(x,a,b),p,0,10),pdf:x=>fpdf(x,a,b)})
};

// ===================== CÁLCULOS DE ECONOMIAPP (funciones puras) =====================
const CALC={};
// Módulo «Estimadores»: una muestra (igual al botón «Extraer nueva muestra»)
CALC.muestra=function(x,mu){const n=x.length;let s=0;for(const v of x)s+=v;const m=s/n;let q=0;for(const v of x)q+=(v-m)**2;
  return{media_muestral:m,error_media:Math.abs(m-mu),var_insesgada:q/(n-1),var_sesgada:q/n}};
// Módulo «Intervalos y tamaño de muestra»
CALC.intervalo=function({x_bar,sigma,n_actual,E,Z}){const ee=sigma/Math.sqrt(n_actual),m=Z*ee;
  return{error_estandar:ee,margen_error_actual:m,lim_inf:x_bar-m,lim_sup:x_bar+m,n_requerido:Math.ceil(((Z*sigma)/E)**2)}};
// Módulo «Pruebas de hipótesis». tipo: "z" | "t" | "p"; cola: "dos" | "der" | "izq"
CALC.prueba=function(tipo,cola,v){const n=v.n,alpha=v.alpha;let ee,stat,dist,valor_hip,valor_mue,se_ic;
  if(tipo==="p"){ee=Math.sqrt(v.p_0*(1-v.p_0)/n);stat=(v.p_hat-v.p_0)/ee;dist=DIST.norm();valor_hip=v.p_0;valor_mue=v.p_hat;se_ic=Math.sqrt(v.p_hat*(1-v.p_hat)/n)}
  else if(tipo==="t"){ee=v.s/Math.sqrt(n);stat=(v.x_bar-v.mu_0)/ee;dist=DIST.t(n-1);valor_hip=v.mu_0;valor_mue=v.x_bar;se_ic=ee}
  else{ee=v.sigma/Math.sqrt(n);stat=(v.x_bar-v.mu_0)/ee;dist=DIST.norm();valor_hip=v.mu_0;valor_mue=v.x_bar;se_ic=ee}
  let p_valor,critico,rechazo;
  if(cola==="dos"){p_valor=2*(1-dist.cdf(Math.abs(stat)));critico=dist.ppf(1-alpha/2);rechazo=Math.abs(stat)>critico}
  else if(cola==="der"){p_valor=1-dist.cdf(stat);critico=dist.ppf(1-alpha);rechazo=stat>critico}
  else{p_valor=dist.cdf(stat);critico=dist.ppf(alpha);rechazo=stat<critico}
  const r={error_estandar:ee,stat,p_valor,critico,rechazo,rechaza_por_p:p_valor<alpha,dist,valor_hip,valor_mue};
  if(cola==="dos"){const m=critico*se_ic;r.ic_inf=valor_mue-m;r.ic_sup=valor_mue+m;r.dentro=valor_hip>=r.ic_inf&&valor_hip<=r.ic_sup}
  return r};
// Módulo «Pruebas de hipótesis avanzadas». tipo: "difp" | "var" | "cov"
CALC.avanzada=function(tipo,cola,v){let stat,dist,cdf,p_valor,extra={};
  if(tipo==="difp"){const p1=v.x1/v.n1,p2=v.x2/v.n2,ps=(v.x1+v.x2)/(v.n1+v.n2);
    const num=(p1-p2)-v.d0,den=Math.sqrt(ps*(1-ps)/v.n1+ps*(1-ps)/v.n2);stat=num/den;dist=DIST.norm();
    p_valor=cola==="dos"?2*(1-dist.cdf(Math.abs(stat))):cola==="der"?1-dist.cdf(stat):dist.cdf(stat);extra={p_hat1:p1,p_hat2:p2,p_star:ps}}
  else{if(tipo==="var"){const df=v.n-1;stat=df*v.s2/v.sigma2_0;dist=DIST.chi2(df)}
    else{stat=v.s2_1/v.s2_2;dist=DIST.f(v.n1-1,v.n2-1)}
    cdf=dist.cdf(stat);p_valor=cola==="dos"?Math.min(2*cdf,2*(1-cdf)):cola==="der"?1-cdf:cdf}
  const a=v.alpha,crit=cola==="dos"?[dist.ppf(a/2),dist.ppf(1-a/2)]:cola==="der"?[dist.ppf(1-a)]:[dist.ppf(a)];
  return Object.assign({stat,p_valor,rechaza_por_p:p_valor<a,dist,criticos:crit},extra)};
// Rama nueva «Diferencia de medias» (fórmula general del JSON de Economiapp, con gl de Welch)
CALC.welch=function(v){const a=v.s2_1/v.n1,b=v.s2_2/v.n2,ee=Math.sqrt(a+b),stat=((v.x1-v.x2)-v.d0)/ee;
  const gl=(a+b)**2/(a*a/(v.n1-1)+b*b/(v.n2-1)),dist=DIST.t(gl),cdf=dist.cdf(stat);
  const p_valor=v.cola==="dos"?2*(1-dist.cdf(Math.abs(stat))):v.cola==="der"?1-cdf:cdf;
  return{error_estandar:ee,stat,gl,p_valor,dist,rechaza_por_p:p_valor<v.alpha}};
// Rama nueva «Potencia»: prueba Z sobre la media
CALC.potencia=function({mu0,mu1,sigma,n,alpha,cola}){const se=sigma/Math.sqrt(n);
  if(cola==="der"){const c=mu0+PhiInv(1-alpha)*se;return{se,c:[c],potencia:1-Phi((c-mu1)/se)}}
  const z=PhiInv(1-alpha/2),c1=mu0-z*se,c2=mu0+z*se;return{se,c:[c1,c2],potencia:Phi((c1-mu1)/se)+1-Phi((c2-mu1)/se)}};
