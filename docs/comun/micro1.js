// Economiapp · cálculos de Microeconomía I (competencia imperfecta) como funciones puras.
// Demanda inversa lineal P = a − bQ; costos C(q) = F + c·q + d·q².
const M1={};
M1.bis=(f,a,b,it=200)=>{let fa=f(a);for(let i=0;i<it;i++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0)b=m;else{a=m;fa=fm}}return(a+b)/2};
M1.W=(a,b,c,d,Q)=>(a-c)*Q-(b/2+d)*Q*Q;                  // excedente total (EC + EP sin costo fijo) hasta Q
// ---------- costos y escala
M1.costos=({F,c,d},q)=>{const CT=F+c*q+d*q*q,CMg=c+2*d*q,CMe=q>0?CT/q:Infinity;return{CT,CMg,CMe,S:CMe/CMg}};
M1.minCMe=({F,d})=>d>0?Math.sqrt(F/d):Infinity;
// ---------- monopolio
M1.monopolio=({a,b,F=0,c,d=0})=>{const Q=Math.max(0,(a-c)/(2*b+2*d)),P=a-b*Q,CMg=c+2*d*Q,pi=P*Q-(F+c*Q+d*Q*Q),Qc=Math.max(0,(a-c)/(b+2*d)),Pc=a-b*Qc;
  const EC=b*Q*Q/2,EP=P*Q-c*Q-d*Q*Q,Wm=M1.W(a,b,c,d,Q),Wc=M1.W(a,b,c,d,Qc);return{Q,P,IMg:a-2*b*Q,CMg,pi,lerner:(P-CMg)/P,eps:-P/(b*Q),Qc,Pc,EC,EP,ECc:b*Qc*Qc/2,EPc:Pc*Qc-c*Qc-d*Qc*Qc,PIE:Wc-Wm,Wm,Wc}};
M1.markup=(cmg,eps)=>Math.abs(eps)>1?cmg/(1-1/Math.abs(eps)):NaN;
// ---------- monopolista multiplanta: plantas [{c,d,F}], IMg = CMg1 = CMg2
M1.multiplanta=({a,b,plantas})=>{const qOf=l=>plantas.map(p=>p.d>0?Math.max(0,(l-p.c)/(2*p.d)):0),Q=l=>qOf(l).reduce((s,x)=>s+x,0);
  const lam=M1.bis(l=>a-2*b*Q(l)-l,Math.min(...plantas.map(p=>p.c)),a),qs=qOf(lam),Qt=Q(lam),P=a-b*Qt,CT=plantas.reduce((s,p,i)=>s+p.F+p.c*qs[i]+p.d*qs[i]*qs[i],0);return{lam,qs,Q:Qt,P,CT,pi:P*Qt-CT}};
// ---------- monopolio natural: C = F + cQ
M1.natural=({a,b,F,c})=>{const m=M1.monopolio({a,b,F,c}),Q1=(a-c)/b,disc=(a-c)*(a-c)-4*b*F,Q2=disc>=0?((a-c)+Math.sqrt(disc))/(2*b):NaN;
  return{m,primer:{Q:Q1,P:c,pi:-F,subsidio:F,W:M1.W(a,b,c,0,Q1)-F},segundo:{Q:Q2,P:a-b*Q2,pi:0,W:M1.W(a,b,c,0,Q2)-F,viable:disc>=0},Wm:m.Wm-F}};
// ---------- precio límite (Bain, Sylos-Labini)
M1.limite=({a,b,cI,cE,FE})=>{const QL=(a-cE-2*Math.sqrt(b*FE))/b,PL=a-b*QL,Qm=(a-cI)/(2*b),Pm=a-b*Qm,piM=(Pm-cI)*Qm,piL=(PL-cI)*QL;
  const qI=(a+cE-2*cI)/(2*b),qE=Math.max(0,(a-cE-b*qI)/(2*b)),Ps=a-b*(qI+qE),piS=(Ps-cI)*qI,piE=(Ps-cE)*qE-FE;
  let tipo;if(Qm>=QL)tipo="bloqueada";else if(piL>=piS||piE<0)tipo="disuadida";else tipo="acomodada";return{QL,PL,Qm,Pm,piM,piL,qI,qE,Ps,piS,piE,tipo}};
// ---------- discriminación de precios: mercados [{a,b}], costo marginal constante c
M1.tercer=({mercados,c})=>{const seg=mercados.map(m=>{const Q=Math.max(0,(m.a-c)/(2*m.b)),P=m.a-m.b*Q;return{Q,P,pi:(P-c)*Q,eps:-P/(m.b*Q),EC:m.b*Q*Q/2}});
  const Qd=p=>mercados.reduce((s,m)=>s+Math.max(0,(m.a-p)/m.b),0);let best={p:c,pi:0};const top=Math.max(...mercados.map(m=>m.a));for(let i=0;i<=4000;i++){const p=c+(top-c)*i/4000,pi=(p-c)*Qd(p);if(pi>best.pi)best={p,pi}}
  const uni={P:best.p,Q:Qd(best.p),pi:best.pi,qs:mercados.map(m=>Math.max(0,(m.a-best.p)/m.b))};
  const primer=mercados.map(m=>{const Q=(m.a-c)/m.b;return{Q,pi:(m.a-c)*Q/2}});return{seg,piD:seg.reduce((s,x)=>s+x.pi,0),uni,primer,piP:primer.reduce((s,x)=>s+x.pi,0)}};
M1.dosPartes=({A,B,c,n})=>{const q=Math.max(0,(A-c)/B),T=(A-c)*q/2;return{p:c,q,T,pi:n*T}};
// ---------- competencia monopolística: demanda de cada empresa P = A − bq, C = F + cq + dq²
M1.chamberlin=({A,b,F,c,d})=>{const q=Math.max(0,(A-c)/(2*(b+d))),P=A-b*q,pi=P*q-(F+c*q+d*q*q),ALP=c+2*Math.sqrt((b+d)*F),qL=(ALP-c)/(2*(b+d)),PL=ALP-b*qL,qMin=M1.minCMe({F,d});return{q,P,pi,ALP,qL,PL,qMin,capOciosa:qMin-qL}};
// ---------- precios de Ramsey: productos [{al,be,c}] con q = al − be·p, costo fijo F
M1.ramsey=({prods,F})=>{const pr=k=>prods.map(x=>(x.c+k*x.al/x.be)/(1+k)),pi=k=>pr(k).reduce((s,p,i)=>s+(p-prods[i].c)*(prods[i].al-prods[i].be*p),0),piMax=pi(1);
  if(piMax<F)return{viable:false,piMax};const k=M1.bis(k=>pi(k)-F,0,1),ps=pr(k);
  return{viable:true,k,piMax,ps,qs:ps.map((p,i)=>prods[i].al-prods[i].be*p),eps:ps.map((p,i)=>-prods[i].be*p/(prods[i].al-prods[i].be*p)),mk:ps.map((p,i)=>(p-prods[i].c)/p)}};
// ---------- mercado de factores: oferta w = e + fL, ingreso del producto marginal IPMg = g − hL
M1.monopsonio=({e,f,g,h,wmin})=>{const Lc=(g-e)/(f+h),wc=e+f*Lc,Lm=(g-e)/(2*f+h),wm=e+f*Lm,Lu=(g-e)/(2*h+f),wu=g-h*Lu;let Lw=null;
  if(wmin>0){Lw=wmin<=wc?Math.min((wmin-e)/f,(g-wmin)/h):(g-wmin)/h;if(wmin<wm)Lw=Lm}return{Lc,wc,Lm,wm,IPMg_m:g-h*Lm,Lu,wu,Lw}};
// ---------- monopolio en cadena (doble marginalización)
M1.cadena=({a,b,c,cd})=>{const w=(a-cd+c)/2,Q=Math.max(0,(a-w-cd)/(2*b)),P=a-b*Q,QI=(a-c-cd)/(2*b),PI=a-b*QI;return{w,Q,P,piU:(w-c)*Q,piD:(P-w-cd)*Q,QI,PI,piI:(PI-c-cd)*QI}};
// ---------- oligopolio con cantidades
M1.cournot=({a,b,c1,c2})=>{let q1=(a-2*c1+c2)/(3*b),q2=(a-2*c2+c1)/(3*b);if(q2<0){q2=0;q1=(a-c1)/(2*b)}if(q1<0){q1=0;q2=(a-c2)/(2*b)}const Q=q1+q2,P=a-b*Q;return{q1,q2,Q,P,pi1:(P-c1)*q1,pi2:(P-c2)*q2}};
M1.stackelberg=({a,b,c1,c2})=>{let q1=(a-2*c1+c2)/(2*b),q2=Math.max(0,(a-c2-b*q1)/(2*b));if(q2===0)q1=Math.max(q1,(a-c1)/(2*b));const Q=q1+q2,P=a-b*Q;return{q1,q2,Q,P,pi1:(P-c1)*q1,pi2:(P-c2)*q2}};
M1.colusion=({a,b,c1,c2})=>{const c=Math.min(c1,c2),Q=(a-c)/(2*b),P=a-b*Q,pi=(P-c)*Q,q1=c1<c2?Q:c1>c2?0:Q/2,q2=Q-q1;return{q1,q2,Q,P,pi,pi1:(P-c1)*q1,pi2:(P-c2)*q2}};
M1.trampa=({a,b,c})=>{const Qm=(a-c)/(2*b),q=Qm/2,qd=(a-c-b*q)/(2*b),Pd=a-b*(q+qd);return{qCartel:q,piCartel:(a-b*Qm-c)*q,qd,piDesv:(Pd-c)*qd,piOtra:(Pd-c)*q}};
M1.bertrandHom=({a,b,c1,c2})=>{if(Math.abs(c1-c2)<1e-12){const Q=(a-c1)/b;return{P:c1,q1:Q/2,q2:Q/2,pi1:0,pi2:0}}const lo=Math.min(c1,c2),hi=Math.max(c1,c2),Pm=(a+lo)/2,P=Math.min(hi,Pm),Q=(a-P)/b;
  return c1<c2?{P,q1:Q,q2:0,pi1:(P-c1)*Q,pi2:0}:{P,q1:0,q2:Q,pi1:0,pi2:(P-c2)*Q}};
M1.cournotN=({a,b,c,n})=>{const q=(a-c)/(b*(n+1)),Q=n*q,P=a-b*Q;return{q,Q,P,pi:(P-c)*q,lerner:(P-c)/P}};
// ---------- oligopolio con precios
M1.bertrandDif=({al,be,ga,c1,c2})=>{const D=4*be*be-ga*ga,k1=al+be*c1,k2=al+be*c2,p1=(2*be*k1+ga*k2)/D,p2=(2*be*k2+ga*k1)/D,q1=al-be*p1+ga*p2,q2=al-be*p2+ga*p1;return{p1,p2,q1,q2,pi1:(p1-c1)*q1,pi2:(p2-c2)*q2}};
M1.dominante=({A,B,s,c})=>{const p=(A/(B+s)+c)/2,Qr=A-(B+s)*p,fr=s*p,Q=A-B*p;return{p,Qd:Qr,franja:fr,Q,pi:(p-c)*Qr,cuota:Qr/Q}};
M1.quebrada=({P0,Q0,b1,b2})=>{const a1=P0+b1*Q0,a2=P0+b2*Q0;return{IMgArriba:a1-2*b1*Q0,IMgAbajo:a2-2*b2*Q0}};
// ---------- juego cooperativo de 3 jugadores: v = {1,2,3,12,13,23,123}
M1.shapley=v=>{const V=s=>s.length?v[s.slice().sort().join("")]||0:0,ords=[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]],phi={1:0,2:0,3:0},tabla=[];
  ords.forEach(o=>{const row={o};let pre=[];o.forEach(i=>{const mc=V([...pre,i])-V(pre);phi[i]+=mc/6;row[i]=mc;pre=[...pre,i]});tabla.push(row)});
  const enCore=x=>x[1]>=V([1])-1e-9&&x[2]>=V([2])-1e-9&&x[3]>=V([3])-1e-9&&x[1]+x[2]>=V([1,2])-1e-9&&x[1]+x[3]>=V([1,3])-1e-9&&x[2]+x[3]>=V([2,3])-1e-9;
  return{phi,tabla,coreVacio:V([1,2])+V([1,3])+V([2,3])>2*V([1,2,3])+1e-9,shapleyEnCore:enCore(phi)}};
