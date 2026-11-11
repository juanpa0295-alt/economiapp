// Economiapp · cálculos de Principios de Microeconomía como funciones puras (notación de Varian: x1, x2, p1, p2, m).
const MI={};
MI.bis=(f,a,b,it=200)=>{let fa=f(a);for(let i=0;i<it;i++){const c=(a+b)/2,fc=f(c);if(fa*fc<=0)b=c;else{a=c;fa=fc}}return(a+b)/2};
MI.integ=(f,a,b,n=400)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3};

// ---------- Utilidad. U = {tipo, a, b, rho}
// cd: x1^a x2^b · sust: a x1 + b x2 · comp: min(a x1, b x2) · quasi: a ln x1 + x2 · ces: (a x1^ρ + b x2^ρ)^(1/ρ)
MI.U=(u,x,y)=>{const{tipo,a,b,rho}=u;if(tipo==="cd")return Math.pow(Math.max(x,0),a)*Math.pow(Math.max(y,0),b);if(tipo==="sust")return a*x+b*y;if(tipo==="comp")return Math.min(a*x,b*y);
  if(tipo==="quasi")return x>0?a*Math.log(x)+y:-Infinity;if(tipo==="ces")return Math.pow(a*Math.pow(Math.max(x,1e-12),rho)+b*Math.pow(Math.max(y,1e-12),rho),1/rho);return NaN};
MI.UMg=(u,x,y)=>{const h=1e-6*Math.max(1,x,y);return[(MI.U(u,x+h,y)-MI.U(u,x-h,y))/(2*h),(MI.U(u,x,y+h)-MI.U(u,x,y-h))/(2*h)]};
MI.TMS=(u,x,y)=>{const{tipo,a,b,rho}=u;if(tipo==="cd")return a*y/(b*x);if(tipo==="sust")return a/b;if(tipo==="quasi")return a/x;if(tipo==="ces")return(a/b)*Math.pow(x/y,rho-1);return NaN};
// curva de indiferencia: x2 en función de x1 para un nivel v (null si no existe)
MI.ind=(u,v,x)=>{const{tipo,a,b,rho}=u;if(x<=0)return null;if(tipo==="cd")return Math.pow(v/Math.pow(x,a),1/b);if(tipo==="sust"){const y=(v-a*x)/b;return y>=0?y:null}
  if(tipo==="quasi")return v-a*Math.log(x);if(tipo==="comp")return a*x>=v?v/b:null;if(tipo==="ces"){const t=(Math.pow(v,rho)-a*Math.pow(x,rho))/b;return t>0?Math.pow(t,1/rho):null}return null};
// demanda marshalliana
MI.dem=(u,p1,p2,m)=>{const{tipo,a,b,rho}=u;
  if(tipo==="cd")return{x1:a/(a+b)*m/p1,x2:b/(a+b)*m/p2,esq:false};
  if(tipo==="sust"){const r=p1/p2,t=a/b;if(Math.abs(r-t)<1e-12)return{x1:m/(2*p1),x2:m/(2*p2),esq:false,indif:true};return r<t?{x1:m/p1,x2:0,esq:true}:{x1:0,x2:m/p2,esq:true}}
  if(tipo==="comp"){const x1=m*b/(b*p1+a*p2);return{x1,x2:a*x1/b,esq:false}}
  if(tipo==="quasi"){const x1=a*p2/p1;if(p1*x1>=m)return{x1:m/p1,x2:0,esq:true};return{x1,x2:(m-p1*x1)/p2,esq:false}}
  if(tipo==="ces"){const s=1/(1-rho),D=Math.pow(a,s)*Math.pow(p1,1-s)+Math.pow(b,s)*Math.pow(p2,1-s);return{x1:m*Math.pow(a,s)*Math.pow(p1,-s)/D,x2:m*Math.pow(b,s)*Math.pow(p2,-s)/D,esq:false}}};
MI.V=(u,p1,p2,m)=>{const d=MI.dem(u,p1,p2,m);return MI.U(u,d.x1,d.x2)};
// función de gasto: el ingreso mínimo para alcanzar el nivel v
MI.gasto=(u,p1,p2,v)=>{let hi=1;while(MI.V(u,p1,p2,hi)<v&&hi<1e15)hi*=2;return MI.bis(m=>MI.V(u,p1,p2,m)-v,0,hi,120)};
MI.hicks=(u,p1,p2,v)=>{const e=MI.gasto(u,p1,p2,v);return Object.assign({e},MI.dem(u,p1,p2,e))};
// Slutsky y Hicks: cambio de p1 de p1a a p1b
MI.slutsky=(u,p1a,p1b,p2,m)=>{const A=MI.dem(u,p1a,p2,m),C=MI.dem(u,p1b,p2,m),mS=m+(p1b-p1a)*A.x1,B=MI.dem(u,p1b,p2,mS),uA=MI.U(u,A.x1,A.x2),H=MI.hicks(u,p1b,p2,uA);
  return{A,B,C,H,mS,mH:H.e,uA,uC:MI.U(u,C.x1,C.x2),esS:B.x1-A.x1,erS:C.x1-B.x1,esH:H.x1-A.x1,erH:C.x1-H.x1,total:C.x1-A.x1}};
// excedentes: VC, VE y cambio en el excedente del consumidor
MI.bienestar=(u,p1a,p1b,p2,m)=>{const uA=MI.V(u,p1a,p2,m),uB=MI.V(u,p1b,p2,m),VC=MI.gasto(u,p1b,p2,uA)-m,VE=m-MI.gasto(u,p1a,p2,uB),lo=Math.min(p1a,p1b),hi=Math.max(p1a,p1b);
  const dEC=MI.integ(p=>MI.dem(u,p,p2,m).x1,lo,hi)*(p1b>p1a?-1:1);return{uA,uB,VC,VE,dEC}};
// dotaciones: el ingreso es el valor de la dotación
MI.dotacion=(u,p1a,p1b,p2,w1,w2)=>{const m0=p1a*w1+p2*w2,m1=p1b*w1+p2*w2,A=MI.dem(u,p1a,p2,m0),B=MI.dem(u,p1b,p2,m0+(p1b-p1a)*A.x1),D=MI.dem(u,p1b,p2,m0),C=MI.dem(u,p1b,p2,m1);
  return{m0,m1,A,B,C,D,es:B.x1-A.x1,erOrd:D.x1-B.x1,erDot:C.x1-D.x1,total:C.x1-A.x1,netaA:A.x1-w1,netaC:C.x1-w1}};
// elección intertemporal con U = c1^a c2^b
MI.inter=({m1,m2,r,a,b,pi=0})=>{const W=m1+m2/(1+r),c1=a/(a+b)*W,c2=b/(a+b)*W*(1+r),real=(1+r)/(1+pi)-1;return{W,VF:m1*(1+r)+m2,c1,c2,ahorro:m1-c1,tipo:c1<m1-1e-9?"prestamista":c1>m1+1e-9?"prestatario":"ni presta ni pide",real}};
// preferencias reveladas: obs = [{p1,p2,x1,x2}]
MI.revelado=obs=>{const n=obs.length,c=(i,j)=>obs[i].p1*obs[j].x1+obs[i].p2*obs[j].x2,R=[...Array(n)].map((_,i)=>[...Array(n)].map((_,j)=>i!==j&&c(i,i)>=c(i,j)-1e-9)),igual=(i,j)=>Math.abs(obs[i].x1-obs[j].x1)<1e-9&&Math.abs(obs[i].x2-obs[j].x2)<1e-9;
  const T=R.map(r=>r.slice());for(let k=0;k<n;k++)for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(T[i][k]&&T[k][j]&&i!==j)T[i][j]=true;
  const warp=[],sarp=[];for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){if(igual(i,j))continue;if(R[i][j]&&R[j][i])warp.push([i,j]);if(T[i][j]&&T[j][i])sarp.push([i,j])}
  return{n,c,R,T,warp,sarp}};

// ---------- Restricción presupuestaria con impuestos, subsidios y racionamiento
MI.presupuesto=({p1,p2,m,tc=0,tv=0,sub=0,rac=Infinity,tl=0})=>{const p1e=Math.max(0.0001,p1*(1+tv)+tc-sub),me=m-tl;return{p1e,me,x1max:Math.min(me/p1e,rac),x2max:me/p2,pend:-p1e/p2}};

// ---------- Producción
MI.corto=({a,b,c},L)=>({Q:a*L+b*L*L-c*L*L*L,PMe:a+b*L-c*L*L,PMg:a+2*b*L-3*c*L*L});
MI.cortoPuntos=({a,b,c})=>{const LmaxPMg=b/(3*c),LmaxPMe=b/(2*c),disc=4*b*b+12*a*c,LmaxQ=(2*b+Math.sqrt(disc))/(6*c);return{LmaxPMg,LmaxPMe,LmaxQ}};
// tecnología: {tipo: cd | ces | leon | lin, A, al, be, rho}
MI.f=(t,L,K)=>{const{tipo,A,al,be,rho}=t;if(tipo==="cd")return A*Math.pow(L,al)*Math.pow(K,be);if(tipo==="ces")return A*Math.pow(al*Math.pow(L,rho)+be*Math.pow(K,rho),1/rho);if(tipo==="leon")return A*Math.min(L/al,K/be);if(tipo==="lin")return A*(al*L+be*K);return NaN};
MI.isoq=(t,q,L)=>{const{tipo,A,al,be,rho}=t;if(L<=0)return null;if(tipo==="cd")return Math.pow(q/(A*Math.pow(L,al)),1/be);if(tipo==="ces"){const v=(Math.pow(q/A,rho)-al*Math.pow(L,rho))/be;return v>0?Math.pow(v,1/rho):null}
  if(tipo==="leon")return L/al>=q/A?be*q/A:null;if(tipo==="lin"){const k=(q/A-al*L)/be;return k>=0?k:null}return null};
MI.RMST=(t,L,K)=>{const{tipo,al,be,rho}=t;if(tipo==="cd")return al*K/(be*L);if(tipo==="ces")return(al/be)*Math.pow(L/K,rho-1);if(tipo==="lin")return al/be;return NaN};
MI.escala=t=>t.tipo==="cd"?t.al+t.be:1;
MI.sigma=t=>t.tipo==="cd"?1:t.tipo==="ces"?1/(1-t.rho):t.tipo==="leon"?0:Infinity;
// minimización de costos con Cobb-Douglas
MI.costoCD=({A,al,be,w,r,q})=>{const g=al+be,L=Math.pow(q/A,1/g)*Math.pow(al*r/(be*w),be/g),K=Math.pow(q/A,1/g)*Math.pow(be*w/(al*r),al/g),C=w*L+r*K;return{L,K,C,CMe:C/q,CMg:C/(g*q),g}};
MI.costoCP=({A,al,be,w,r,q,Kf})=>{const L=Math.pow(q/(A*Math.pow(Kf,be)),1/al),CV=w*L,CF=r*Kf;return{L,CV,CF,CT:CV+CF,CMg:w*L/(al*q)}};
// costos cúbicos: CT = CF + a q − b q² + c q³
MI.cub=({CF,a,b,c},q)=>{const CV=a*q-b*q*q+c*q*q*q;return{CT:CF+CV,CV,CMg:a-2*b*q+3*c*q*q,CVMe:q>0?CV/q:a,CMe:q>0?(CF+CV)/q:Infinity}};
MI.cubCierre=({a,b,c})=>({q:b/(2*c),p:a-b*b/(4*c)});
MI.cubMinCMe=k=>{const q=MI.bis(q=>MI.cub(k,q).CMg-MI.cub(k,q).CMe,MI.cubCierre(k).q,1e4);return{q,p:MI.cub(k,q).CMe}};
MI.cubOferta=(k,p)=>{const{a,b,c}=k,ci=MI.cubCierre(k);if(p<ci.p-1e-9)return 0;const disc=4*b*b-12*c*(a-p);return disc<0?0:(2*b+Math.sqrt(disc))/(6*c)};
MI.cubBeneficio=(k,p)=>{const q=MI.cubOferta(k,p),C=MI.cub(k,q),I=p*q;return{q,I,CT:q?C.CT:k.CF,CV:q?C.CV:0,B:I-(q?C.CT:k.CF),EP:I-(q?C.CV:0)}};

// ---------- Mercado lineal: Qd = a − b p, Qs = c + d p
MI.mercado=({a,b,c,d})=>{const p=(a-c)/(b+d),q=a-b*p;return{p,q,ed:-b*p/q,es:d*p/q}};
MI.ecArea=(a,b,Q,pc)=>(a*Q-Q*Q/2)/b-pc*Q;               // ∫0^Q (Pd(q) − pc) dq
MI.psInt=(c,d,Q)=>c<=0?(Q*Q/2-c*Q)/d:Math.pow(Math.max(0,Q-c),2)/(2*d); // ∫0^Q max(0, Ps(q)) dq
MI.politica=({a,b,c,d,tipo,v})=>{const E=MI.mercado({a,b,c,d}),W0=MI.ecArea(a,b,E.q,E.p)+(E.p*E.q-MI.psInt(c,d,E.q));let pc=E.p,pv=E.p,Q=E.q,T=0,G=0,brecha=0,nota="";
  if(tipo==="imp"||tipo==="sub"){const t=tipo==="imp"?v:-v;pc=(a-c+d*t)/(b+d);pv=pc-t;Q=a-b*pc;if(Q<0){Q=0}T=tipo==="imp"?t*Q:0;G=tipo==="sub"?v*Q:0}
  else if(tipo==="max"){if(v<E.p){pc=pv=v;Q=Math.max(0,c+d*v);brecha=(a-b*v)-Q;nota="escasez"}else nota="no obligatorio"}
  else if(tipo==="min"){if(v>E.p){pc=pv=v;Q=Math.max(0,a-b*v);brecha=(c+d*v)-Q;nota="excedente"}else nota="no obligatorio"}
  const EC=MI.ecArea(a,b,Q,pc),EP=pv*Q-MI.psInt(c,d,Q),W=EC+EP+T-G;return{E,W0,pc,pv,Q,T,G,EC,EP,W,PIM:W0-W,brecha,nota,cargaC:pc-E.p,cargaP:E.p-pv}};
MI.telarana=({a,b,c,d,p0,T})=>{const out=[];let p=p0;for(let t=1;t<=T;t++){const qs=c+d*p,pn=(a-qs)/b;out.push({t,pPrev:p,q:qs,p:pn});p=pn}return out};
if(typeof module!=="undefined")module.exports=MI;
