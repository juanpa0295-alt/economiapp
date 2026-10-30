// Economiapp · cálculos de Macroeconomía 1 como funciones puras.
// Economiapp · cálculos de Macroeconomía 1 como funciones puras (mismas fórmulas que pages/3_Macroeconomia_1.py)
const MAC={};
// Teoría del consumo: C = C0 + c1 (Y − T)
MAC.consumo=function({C0,c1,Y,T}){const Yd=Y-T,ind=c1*Yd,C=C0+ind;
  return{Yd,inducido:ind,C,pmec:Y>0?C/Y:0,ahorro:Yd-C,dC_dY:c1,dC_dT:-c1}};
// Consumo intertemporal, 2 períodos, con Euler CRRA
MAC.intertemporal=function({Y1,Y2,r,rho,theta}){const W=Y1+Y2/(1+r),f=((1+r)/(1+rho))**(1/theta);
  const C1=W/(1+f/(1+r)),C2=C1*f;
  return{W,factor:f,C1,C2,S1:Y1-C1,dW_dr:-Y2/(1+r)**2,dW_dY2:1/(1+r)}};
// Utilidad CRRA consistente con la ecuación de Euler: U = u(C1) + u(C2)/(1+ρ)
MAC.uCRRA=(c,theta)=>Math.abs(theta-1)<1e-9?Math.log(c):(c**(1-theta)-1)/(1-theta);
// N períodos: W = Σ Y_t / (1+r)^(t−1)
MAC.nPeriodos=function(Ys,r){const vp=Ys.map((y,t)=>y/(1+r)**t);
  return{vp,W:vp.reduce((a,b)=>a+b,0),dW_dr:Ys.reduce((s,y,t)=>s-t*y/(1+r)**(t+1),0),dW_dY:Ys.map((_,t)=>1/(1+r)**t)}};
// Inversión neoclásica y q de Tobin
MAC.inversion=function({Y,alpha,r,delta,K_prev,VM,CR,PMK}){const uc=r+delta,K=uc!==0?alpha*Y/uc:0;
  return{uc,K,bruta:K-(1-delta)*K_prev,neta:K-K_prev,q:CR!==0?VM/CR:0,dK_dr:-alpha*Y/uc**2,dK_dY:alpha/uc,reglaPMK:PMK-uc}};
// Gobierno: balance, multiplicador, balance estructural y deuda
MAC.gobierno=function({G,T0,t,Y,Ypot,c,B,r}){const T=T0+t*Y,bal=T-G,BSe=(T0+t*Ypot)-G;
  return{T,balance:bal,mult:1/(1-c*(1-t)),BSe,ciclico:bal-BSe,dBS_dY:t,Bnext:(1+r)*B+G-T,intereses:r*B}};
// Microfundamentos: firma, hogar y equilibrio del mercado laboral
MAC.micro=function({alpha,z,K,w,gamma,h}){const A=(1-alpha)*z*K**alpha;
  const Nd=(A/w)**(1/alpha),Yp=z*K**alpha*Nd**(1-alpha),l=gamma/(1+gamma)*h,Ns=h-l,wEq=A*((1+gamma)/h)**alpha;
  return{A,Nd,Y:Yp,l,Ns,wEq,exceso:Ns-Nd}};
// Equilibrio general dinámico de dos períodos (N2 = 1)
MAC.dinamico=function({alpha,z1,z2,r,delta,K1,gamma,h,beta,tau}){const K2=((alpha*z2)/(r+delta))**(1/(1-alpha));
  return{K2,I1:K2-(1-delta)*K1,w1:(1-alpha)*z1*K1**alpha*((1+gamma)/h)**alpha,Ns:h/(1+gamma),euler:beta*(1+r),
    NsTau:h*(1-tau)/(1+gamma-tau)}};
