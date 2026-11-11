// Economiapp · cálculos de Principios de Macroeconomía como funciones puras.
// Notación del programa del curso (Jones, Macroeconomics): barras para parámetros, Ỹ para la brecha del producto.
const PM={};

// ---------- 1. Medición
// Canasta: [{n, p0, q0, p1, q1}] para el año base (0) y el año corriente (1)
PM.pibReal=function(B){const S=f=>B.reduce((a,b)=>a+f(b),0);
  const N0=S(b=>b.p0*b.q0),N1=S(b=>b.p1*b.q1),R1b0=S(b=>b.p0*b.q1),R0b1=S(b=>b.p1*b.q0);
  const gL=R1b0/N0,gP=N1/R0b1,gF=Math.sqrt(gL*gP);
  return{N0,N1,real1:R1b0,real0b1:R0b1,gNom:N1/N0-1,gLasp:gL-1,gPaa:gP-1,gFisher:gF-1,realEnc:N0*gF,
    defl0:100,defl1:N1/R1b0*100,deflEnc:N1/(N0*gF)*100,ipc1:R0b1/N0*100,inflDef:N1/R1b0-1,inflIPC:R0b1/N0-1}};
// Mercado laboral con las siglas del DANE
PM.laboral=function({PET,O,D}){const FT=O+D,FFT=PET-FT;return{FT,FFT,TGP:FT/PET,TO:O/PET,TD:D/FT}};
// Valor agregado por etapas y PNB
PM.valorAgregado=function(ventas){let prev=0;return ventas.map(v=>{const va=v-prev;prev=v;return va})};

// ---------- 2. Ciclos: filtro de Hodrick-Prescott
PM.hp=function(y,lam){const n=y.length;if(n<4)return null;
  const A=Array.from({length:n},()=>new Float64Array(n));
  for(let i=0;i<n;i++)A[i][i]=1;
  for(let t=0;t<n-2;t++){const d=[t,t+1,t+2],c=[1,-2,1];for(let a=0;a<3;a++)for(let b=0;b<3;b++)A[d[a]][d[b]]+=lam*c[a]*c[b]}
  // Matriz de banda 5: eliminación gaussiana sin pivoteo (es simétrica definida positiva)
  const x=Float64Array.from(y);
  for(let k=0;k<n;k++){for(let i=k+1;i<Math.min(n,k+3);i++){const f=A[i][k]/A[k][k];if(!f)continue;for(let j=k;j<Math.min(n,k+3);j++)A[i][j]-=f*A[k][j];x[i]-=f*x[k]}}
  const t=new Float64Array(n);for(let i=n-1;i>=0;i--){let s=x[i];for(let j=i+1;j<Math.min(n,i+3);j++)s-=A[i][j]*t[j];t[i]=s/A[i][i]}
  return Array.from(t)};
PM.media=a=>a.reduce((s,v)=>s+v,0)/a.length;
PM.desv=a=>{const m=PM.media(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1))};
PM.corr=(a,b)=>{const ma=PM.media(a),mb=PM.media(b);let sab=0,sa=0,sb=0;for(let i=0;i<a.length;i++){sab+=(a[i]-ma)*(b[i]-mb);sa+=(a[i]-ma)**2;sb+=(b[i]-mb)**2}return sab/Math.sqrt(sa*sb)};
// Componente cíclico en % (100·[ln x − tendencia de ln x]) y correlaciones con rezagos: corr(x_{t+j}, y_t)
PM.ciclo=function(x,lam){const lx=x.map(Math.log),tr=PM.hp(lx,lam);return{tend:tr.map(Math.exp),c:lx.map((v,i)=>100*(v-tr[i]))}};
PM.corrRez=function(cx,cy,j){const a=[],b=[];for(let t=0;t<cy.length;t++){const s=t+j;if(s<0||s>=cx.length)continue;a.push(cx[s]);b.push(cy[t])}return PM.corr(a,b)};

// ---------- 3. Crecimiento
PM.crec=function({y0,g,t}){return{yt:y0*Math.pow(1+g,t),duplica:Math.log(2)/Math.log(1+g),regla70:70/(100*g)}};
PM.tasaMedia=(y0,yT,T)=>Math.pow(yT/y0,1/T)-1;
// Años para que un país pobre (y1, g1) alcance a uno rico (y2, g2)
PM.alcance=(y1,g1,y2,g2)=>g1<=g2?Infinity:Math.log(y2/y1)/Math.log((1+g1)/(1+g2));

// ---------- 4. Modelo de producción: Y = A K^α L^(1−α)
PM.prod=function({A,K,L,al}){const Y=A*K**al*L**(1-al);return{Y,y:Y/L,k:K/L,w:(1-al)*Y/L,r:al*Y/K,masaW:(1-al)*Y,masaR:al*Y}};
// Contabilidad del desarrollo: y_i/y_EEUU = (A_i/A_EEUU)(k_i/k_EEUU)^α
PM.desarrollo=function({y,k,al}){const pred=k**al,A=y/pred;return{pred,A,brecha:1/y,porK:1/pred,porA:1/A}};
// Contabilidad del crecimiento (por trabajador): g_y = g_A + α g_k
PM.contab=function({gy,gk,al}){const ck=al*gk,gA=gy-ck;return{ck,gA,partK:ck/gy,partA:gA/gy}};

// ---------- 5. Solow
PM.solowEE=function({s,d,A,L,al}){const K=Math.pow(s*A/d,1/(1-al))*L,Y=A*K**al*L**(1-al);return{K,Y,y:Y/L,k:K/L,C:(1-s)*Y,I:s*Y}};
// Simulación: los parámetros pueden cambiar en t0 a los valores de 'nuevo'
PM.solowSim=function(base,nuevo,t0,T,K0){const out=[];let K=K0!==undefined?K0:PM.solowEE(base).K;
  for(let t=0;t<=T;t++){const p=t>=t0?nuevo:base,Y=p.A*K**p.al*p.L**(1-p.al),I=p.s*Y,dep=p.d*K;
    out.push({t,K,Y,y:Y/p.L,I,dep,C:Y-I});K=K+I-dep}
  out.forEach((o,i)=>o.gy=i?o.y/out[i-1].y-1:0);return out};
// Regla de oro: c* = (1 − s) y*(s); máximo en s = α
PM.cEE=(s,{d,A,al})=>(1-s)*Math.pow(A,1/(1-al))*Math.pow(s/d,al/(1-al));

// ---------- 6. Mercado laboral: modelo de la bañera
PM.banera=function({s,f,L,u0,T}){const out=[];let U=u0*L;for(let t=0;t<=T;t++){const E=L-U;out.push({t,U,E,u:U/L});U=U+s*E-f*U}return{ust:s/(s+f),path:out}};
// Oferta y demanda de trabajo lineales: Ld = a − b w, Ls = c + e w
PM.trabajo=function({a,b,c,e,wmin}){const w=(a-c)/(b+e),L=a-b*w;
  if(!(wmin>w))return{w,L,wmin,Ld:L,Ls:L,des:0};const Ld=a-b*wmin,Ls=c+e*wmin;return{w,L,wmin,Ld,Ls,des:Ls-Ld}};
// Valor presente del ingreso laboral
PM.vpd=(x,R,n)=>{let v=0;for(let t=0;t<n;t++)v+=x/Math.pow(1+R,t);return v};

// ---------- 7. Inflación: teoría cuantitativa y Fisher
PM.cuantitativa=function({gM,gV,gY}){return{pi:gM+gV-gY}};
PM.fisher=({R,pi})=>({i:R+pi});
PM.nivelP=({M,V,Y})=>M*V/Y;

// ---------- 8. Corto plazo: brecha, Okun y Phillips
PM.brecha=(Y,Yp)=>(Y-Yp)/Yp;
PM.okun=function({Yt,u_,nu,pi0}){const u=u_-0.5*Yt;return{u,dpi:nu*Yt,pi:pi0+nu*Yt}};
// Apalancamiento
PM.apal=function({A,E,caida}){const lev=A/E,perd=A*caida,E1=E-perd;return{lev,perd,E1,cEq:E1/E-1,A1:A-perd,quiebra:E1<=0}};

// ---------- 9. Curva IS: Ỹ = ā − b̄(R − r̄), con multiplicador 1/(1 − x̄) si el consumo depende de Ỹ
PM.is=function({ac,ai,ag,aex,aim,b,R,r,x}){const a=ac+ai+ag+aex-aim-1,m=1/(1-(x||0));return{a,m,Y:m*(a-b*(R-r))}};

// ---------- 10. IS-MP-Phillips: el banco central fija R_t
// pol: función t -> R_t − r̄; aT, oT: funciones de choque; π_t = π_{t−1} + ν̄Ỹ_t + ō_t
PM.ismpSim=function({b,nu,pi0,T},pol,aT,oT){const out=[];let pi=pi0;
  for(let t=0;t<=T;t++){const g=pol(t),Y=aT(t)-b*g,np=pi+nu*Y+oT(t);out.push({t,R:g,Y,pi:np,dpi:np-pi});pi=np}return out};

// ---------- 11. OA-DA. DA: Ỹ_t = ā − b̄m̄(π_t − π̄); OA: π_t = π_{t−1} + ν̄Ỹ_t + ō_t
PM.oadaPaso=function({a,b,m,pib,nu,o},piPrev){const pi=(piPrev+nu*a+nu*b*m*pib+o)/(1+nu*b*m),Y=a-b*m*(pi-pib);return{pi,Y,R:m*(pi-pib)}};
PM.oadaSim=function({b,m,nu,pi0,T},aT,oT,pibT){const out=[];let pi=pi0;
  for(let t=0;t<=T;t++){const p={a:aT(t),b,m,pib:pibT(t),nu,o:oT(t)},r=PM.oadaPaso(p,pi);out.push(Object.assign({t,piPrev:pi},p,r));pi=r.pi}return out};

// ---------- Modelo keynesiano y IS-LM tradicional (estaciones originales de la app)
PM.pib=function({C0,c1,T,I,G}){if(c1===1)return null;const m=1/(1-c1),A=C0-c1*T+I+G,Y=m*A,C=C0+c1*(Y-T);
  return{mult:m,A,Y,C,dY_dG:m,dY_dT:-c1*m,dY_dc1:(C0-T+I+G)/(1-c1)**2}};
PM.dinero=function({M,P,Y,k,h}){const ms=M/P,r=(k*Y-ms)/h;return{ms,r,dr_dY:k/h,dr_dM:-1/(P*h)}};
PM.islm=function({C0,c1,T,I0,b,G,M,P,k,h}){const A=C0-c1*T+I0+G,den=h*(1-c1)+b*k,Y=(h*A+b*M/P)/den,r=(k*Y-M/P)/h;
  return{A,den,Y,r,I:I0-b*r,mG:h/den,mM:(b/P)/den,mT:-c1*h/den,keynes:1/(1-c1)}};
if(typeof module!=="undefined")module.exports=PM;
