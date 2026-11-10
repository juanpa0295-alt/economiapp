// Economiapp · cálculos de Microeconomía II (equilibrio general, bienestar, fallos de mercado, incertidumbre e información) como funciones puras.
const M2={};
M2.bis=(f,a,b,it=200)=>{let fa=f(a);for(let i=0;i<it;i++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0)b=m;else{a=m;fa=fm}}return(a+b)/2};
// ---------- caja de Edgeworth con Cobb-Douglas: uA = x^α y^(1−α), uB = x^β y^(1−β); p = px/py con py = 1
M2.uCD=(al,x,y)=>Math.pow(Math.max(x,0),al)*Math.pow(Math.max(y,0),1-al);
M2.edgeworth=({al,be,wAx,wAy,wBx,wBy})=>{const X=wAx+wBx,Y=wAy+wBy,p=(al*wAy+be*wBy)/((1-al)*wAx+(1-be)*wBx),mA=p*wAx+wAy,mB=p*wBx+wBy;
  const xA=al*mA/p,yA=(1-al)*mA,xB=be*mB/p,yB=(1-be)*mB;return{X,Y,p,mA,mB,xA,yA,xB,yB,uA:M2.uCD(al,xA,yA),uB:M2.uCD(be,xB,yB),uA0:M2.uCD(al,wAx,wAy),uB0:M2.uCD(be,wBx,wBy),
    exA:{x:xA-wAx,y:yA-wAy},walras:p*(xA+xB-X)+(yA+yB-Y)}};
M2.contrato=({al,be,X,Y},xA)=>{const kA=al/(1-al),kB=be/(1-be);return kB*xA*Y/(kA*(X-xA)+kB*xA)};
// núcleo: tramo de la curva de contrato que deja a ambos al menos como en la dotación
M2.nucleo=(P)=>{const E=M2.edgeworth(P),X=E.X,Y=E.Y,cc=x=>M2.contrato({...P,X,Y},x),fA=x=>M2.uCD(P.al,x,cc(x))-E.uA0,fB=x=>M2.uCD(P.be,X-x,Y-cc(x))-E.uB0;
  const lo=M2.bis(fA,1e-9,X-1e-9),hi=M2.bis(fB,1e-9,X-1e-9);return{lo,hi}};
// segundo teorema: precio y transferencia (en unidades de y) para llegar a un punto de la curva de contrato
M2.segundo=(P,xA)=>{const X=P.wAx+P.wBx,Y=P.wAy+P.wBy,yA=M2.contrato({...P,X,Y},xA),p=(P.al/(1-P.al))*yA/xA,mA=p*xA+yA,T=mA-(p*P.wAx+P.wAy);return{xA,yA,p,T}};
// ---------- Robinson Crusoe: u = c^a (T − L)^(1−a), c = A L^γ
M2.crusoe=({a,A,g,T})=>{const L=a*g*T/(a*g+1-a),c=A*Math.pow(L,g),w=g*A*Math.pow(L,g-1);return{L,ocio:T-L,c,w,pi:c-w*L,u:Math.pow(c,a)*Math.pow(T-L,1-a)}};
// ---------- elección social: perfil = [{orden:["A","B","C"], n}]
M2.votacion=perfil=>{const alts=[...new Set(perfil.flatMap(r=>r.orden))],k=alts.length,pos=(r,x)=>r.orden.indexOf(x),tot=perfil.reduce((s,r)=>s+r.n,0);
  const M={};alts.forEach(x=>{M[x]={};alts.forEach(y=>{if(x!==y)M[x][y]=perfil.reduce((s,r)=>s+(pos(r,x)<pos(r,y)?r.n:0),0)})});
  const gana=(x,y)=>M[x][y]>M[y][x],cond=alts.find(x=>alts.every(y=>y===x||gana(x,y)))||null;
  const borda={};alts.forEach(x=>borda[x]=perfil.reduce((s,r)=>s+r.n*(k-1-pos(r,x)),0));const plur={};alts.forEach(x=>plur[x]=perfil.reduce((s,r)=>s+(r.orden[0]===x?r.n:0),0));
  const agenda=ord=>{let w=ord[0];for(let i=1;i<ord.length;i++)if(!gana(w,ord[i]))w=ord[i];return w};
  const perms=a=>a.length<=1?[a]:a.flatMap((x,i)=>perms([...a.slice(0,i),...a.slice(i+1)]).map(p=>[x,...p]));
  const agendas=perms(alts).map(o=>({o,w:agenda(o)}));return{alts,M,tot,cond,borda,plur,agendas,ciclo:!cond&&agendas.some(a=>a.w!==agendas[0].w)}};
// ---------- desigualdad y bienestar social
M2.desigualdad=(x,eps)=>{const n=x.length,mu=x.reduce((s,v)=>s+v,0)/n;let g=0;for(const a of x)for(const b of x)g+=Math.abs(a-b);const gini=g/(2*n*n*mu);
  const ede=Math.abs(eps-1)<1e-9?Math.exp(x.reduce((s,v)=>s+Math.log(v),0)/n):Math.pow(x.reduce((s,v)=>s+Math.pow(v,1-eps),0)/n,1/(1-eps));
  return{n,mu,gini,ede,atk:1-ede/mu,util:x.reduce((s,v)=>s+v,0),rawls:Math.min(...x),nash:x.reduce((s,v)=>s+Math.log(v),0)}};
// ---------- externalidades: P = a − bQ, CMg privado = c + dQ, daño marginal = e + fQ
M2.extern=({a,b,c,d,e,f})=>{const Qm=Math.max(0,(a-c)/(b+d)),Qs=Math.max(0,(a-c-e)/(b+d+f)),Pm=a-b*Qm,Ps=a-b*Qs,t=e+f*Qs,PIE=0.5*(Qm-Qs)*((c+d*Qm+e+f*Qm)-(a-b*Qm));
  return{Qm,Pm,Qs,Ps,t,PIE,danoM:e*Qm+f*Qm*Qm/2,danoS:e*Qs+f*Qs*Qs/2,recaudo:t*Qs}};
// Coase: beneficio del contaminador B(x) = αx − βx²/2, daño D(x) = γx²/2
M2.coase=({al,be,ga})=>{const xs=al/(be+ga),xb=al/be,B=x=>al*x-be*x*x/2,D=x=>ga*x*x/2;return{xs,xb,Bs:B(xs),Ds:D(xs),Bb:B(xb),Db:D(xb),
  victima:[D(xs),B(xs)],contaminador:[B(xb)-B(xs),D(xb)-D(xs)],W:B(xs)-D(xs)}};
// permisos negociables: costo marginal de abatir k_i·a_i, emisiones sin control E_i, tope total
M2.permisos=({k1,k2,E1,E2,tope})=>{const A=Math.max(0,E1+E2-tope),a1=A*k2/(k1+k2),a2=A-a1,p=k1*a1,cost=0.5*k1*a1*a1+0.5*k2*a2*a2,costU=0.5*(k1+k2)*(A/2)*(A/2);return{A,a1,a2,p,cost,costU,e1:E1-a1,e2:E2-a2}};
// ---------- bienes públicos: beneficio marginal de i = a_i − b_i·G, costo unitario c
M2.publico=({cons,c})=>{const mb=(i,G)=>Math.max(0,cons[i].a-cons[i].b*G),S=G=>cons.reduce((s,_,i)=>s+mb(i,G),0),top=Math.max(...cons.map(x=>x.a/x.b));
  const Gs=S(0)<=c?0:M2.bis(G=>S(G)-c,0,top),pref=cons.map(x=>Math.max(0,(x.a-c)/x.b)),GN=Math.max(...pref),n=cons.length,cuota=c/n,vot=cons.map(x=>Math.max(0,(x.a-cuota)/x.b)).sort((p,q)=>p-q);
  const med=n%2?vot[(n-1)/2]:(vot[n/2-1]+vot[n/2])/2,lind=cons.map((_,i)=>mb(i,Gs)/c);return{Gs,GN,pref,lind,vot,med,mb:i=>mb(i,Gs)}};
M2.juegoPublico=({n,e,m})=>({nash:e,social:m*n*e,dominante:m<1?"no aportar":"aportar todo",dilema:m<1&&m*n>1});
// ---------- incertidumbre
M2.U={lin:{f:x=>x,inv:u=>u,ap:()=>0},raiz:{f:x=>Math.sqrt(x),inv:u=>u*u,ap:x=>1/(2*x)},ln:{f:x=>Math.log(x),inv:u=>Math.exp(u),ap:x=>1/x},
  cara:{f:(x,r)=>(1-Math.exp(-r*x))/r,inv:(u,r)=>-Math.log(1-r*u)/r,ap:(x,r)=>r},crra:{f:(x,r)=>Math.abs(r-1)<1e-9?Math.log(x):Math.pow(x,1-r)/(1-r),inv:(u,r)=>Math.abs(r-1)<1e-9?Math.exp(u):Math.pow(u*(1-r),1/(1-r)),ap:(x,r)=>r/x}};
M2.loteria=({x,p,tipo,r})=>{const U=M2.U[tipo],EV=x.reduce((s,v,i)=>s+v*p[i],0),EU=x.reduce((s,v,i)=>s+U.f(v,r)*p[i],0),CE=U.inv(EU,r),varz=x.reduce((s,v,i)=>s+p[i]*(v-EV)**2,0);
  return{EV,EU,CE,prima:EV-CE,sd:Math.sqrt(varz),cv:Math.sqrt(varz)/EV,ap:U.ap(EV,r),actitud:CE<EV-1e-9?"aversión al riesgo":CE>EV+1e-9?"amor al riesgo":"neutralidad"}};
M2.seguro=({W,L,pi,q,tipo,r})=>{const U=M2.U[tipo],EU=K=>pi*U.f(W-L-q*K+K,r)+(1-pi)*U.f(W-q*K,r);let best={K:0,u:EU(0)};for(let i=0;i<=2000;i++){const K=L*i/2000,u=EU(K);if(u>best.u)best={K,u}}
  return{K:best.K,EU:best.u,EU0:EU(0),prima:q*best.K,justo:Math.abs(q-pi)<1e-9}};
M2.prospecto=({x,p,al=0.88,be=0.88,lam=2.25,ga=0.61,de=0.69})=>{const v=z=>z>=0?Math.pow(z,al):-lam*Math.pow(-z,be),w=(q,g)=>Math.pow(q,g)/Math.pow(Math.pow(q,g)+Math.pow(1-q,g),1/g);
  const V=x.reduce((s,z,i)=>s+w(p[i],z>=0?ga:de)*v(z),0);return{V,EV:x.reduce((s,z,i)=>s+z*p[i],0),pesos:x.map((z,i)=>w(p[i],z>=0?ga:de)),valores:x.map(v)}};
M2.sanPetersburgo=N=>({EV:N,EUln:[...Array(N)].reduce((s,_,i)=>s+Math.pow(0.5,i+1)*Math.log(Math.pow(2,i+1)),0)});
// ---------- información asimétrica
M2.limones=({qmin,qmax,k})=>{if(k*(qmin+qmax)/2>=qmax)return{p:k*(qmin+qmax)/2,frac:1,todos:true};const p=k*qmin/(2-k);if(p<=qmin)return{p:k*qmin,frac:0,colapso:true};return{p,frac:(p-qmin)/(qmax-qmin)}};
M2.spence=({a1,a2,c1,c2,lam})=>{const eMin=(a2-a1)/c1,eMax=(a2-a1)/c2,pool=lam*a2+(1-lam)*a1;return{eMin,eMax,pool,uHsep:a2-c2*eMin,uHpool:pool,uL:a1}};
M2.agente=({xH,xL,pA,pB,cA,cB,ub})=>{const EA=pA*xH+(1-pA)*xL,EB=pB*xH+(1-pB)*xL,wObsA=(ub+cA)**2,wObsB=(ub+cB)**2,D=(cA-cB)/(pA-pB),uL=ub+cA-pA*D,uH=uL+D,ok=uL>=0;
  const EwA=ok?pA*uH*uH+(1-pA)*uL*uL:NaN;return{EA,EB,wObsA,wObsB,obs:{A:EA-wObsA,B:EB-wObsB},uH,uL,wH:uH*uH,wL:uL*uL,EwA,noObs:{A:EA-EwA,B:EB-wObsB},costoAgencia:EwA-wObsA,ok}};
// Gale-Shapley: prefP[i] = lista de receptores en orden; prefR[j] = lista de proponentes
M2.galeShapley=(prefP,prefR)=>{const n=prefP.length,m=prefR.length,next=Array(n).fill(0),pareja=Array(m).fill(-1),libre=[...Array(n).keys()],pasos=[];let it=0;
  while(libre.length&&it<200){it++;const i=libre.shift();if(next[i]>=prefP[i].length)continue;const j=prefP[i][next[i]++],act=pareja[j];
    if(act<0){pareja[j]=i;pasos.push([i,j,"acepta"])}else if(prefR[j].indexOf(i)<prefR[j].indexOf(act)){pareja[j]=i;libre.push(act);pasos.push([i,j,"cambia",act])}else{libre.push(i);pasos.push([i,j,"rechaza"])}}
  return{pareja,pasos}};
