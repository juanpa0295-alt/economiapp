// Economiapp · cálculos de Principios de Macroeconomía como funciones puras.
// Economiapp · cálculos de Principios de Macroeconomía como funciones puras (mismas fórmulas que la app)
const PM={};
// Modelo keynesiano simple: Y = C0 + c1(Y − T) + I + G
PM.pib=function({C0,c1,T,I,G}){if(c1===1)return null;const m=1/(1-c1),A=C0-c1*T+I+G,Y=m*A,C=C0+c1*(Y-T);
  return{mult:m,A,Y,C,dY_dG:m,dY_dT:-c1*m,dY_dc1:(C0-T+I+G)/(1-c1)**2}};
// Mercado de dinero: M/P = kY − h r
PM.dinero=function({M,P,Y,k,h}){const ms=M/P,r=(k*Y-ms)/h;return{ms,r,dr_dY:k/h,dr_dM:-1/(P*h)}};
// IS-LM
PM.islm=function({C0,c1,T,I0,b,G,M,P,k,h}){const A=C0-c1*T+I0+G,den=h*(1-c1)+b*k,Y=(h*A+b*M/P)/den,r=(k*Y-M/P)/h;
  return{A,den,Y,r,I:I0-b*r,mG:h/den,mM:(b/P)/den,mT:-c1*h/den,keynes:1/(1-c1)}};
