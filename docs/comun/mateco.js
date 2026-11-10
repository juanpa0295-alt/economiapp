// Economiapp · Matemáticas para el análisis económico: derivación simbólica (mathjs) y métodos numéricos.
const ME={};
ME.norm=s=>String(s).replace(/·|×/g,"*").replace(/−/g,"-").replace(/²/g,"^2").replace(/³/g,"^3").replace(/,/g,".").replace(/\bln\(/g,"log(");
ME.CONST=["e","pi"];
// Compila una expresión en las variables dadas; devuelve {node,f,err}
ME.fun=(expr,vars)=>{let node;try{node=math.parse(ME.norm(expr))}catch(e){return{err:"no se entiende la expresión «"+expr+"»"}}
  const libres=[];node.traverse((n,path,parent)=>{if(n.isSymbolNode&&!(parent&&parent.isFunctionNode&&parent.fn===n)&&!vars.includes(n.name)&&!ME.CONST.includes(n.name)&&!libres.includes(n.name))libres.push(n.name)});
  if(libres.length)return{err:`la expresión usa ${libres.join(", ")}, pero las variables son ${vars.join(", ")}`};
  const c=node.compile();return{node,vars,f:(...x)=>{const o={};vars.forEach((v,i)=>o[v]=x[i]);const r=c.evaluate(o);return typeof r==="number"?r:NaN}}};
ME.d=(node,v)=>{try{return math.simplify(math.derivative(node,v))}catch(e){return math.derivative(node,v)}};
ME.txt=n=>{let s=(typeof n==="string"?n:n.toString({parenthesis:"auto",implicit:"hide"}));return s.replace(/ \^ /g,"^").replace(/\s*\*\s*/g,"·").replace(/\^2(?![\d.])/g,"²").replace(/\^3(?![\d.])/g,"³").replace(/-/g,"−").replace(/\blog\(/g,"ln(").replace(/\blambda\b/g,"λ")};
ME.comp=(node,vars)=>{const c=node.compile();return(...x)=>{const o={};vars.forEach((v,i)=>o[v]=x[i]);const r=c.evaluate(o);return typeof r==="number"?r:NaN}};
ME.grad=(node,vars)=>vars.map(v=>ME.d(node,v));
ME.hess=(node,vars)=>{const g=ME.grad(node,vars);return g.map(gi=>vars.map(v=>ME.d(gi,v)))};
// Álgebra lineal numérica
ME.solve=(A,b)=>{const n=A.length,M=A.map((r,i)=>[...r,b[i]]);for(let c=0;c<n;c++){let p=c;for(let i=c+1;i<n;i++)if(Math.abs(M[i][c])>Math.abs(M[p][c]))p=i;if(Math.abs(M[p][c])<1e-13)return null;[M[c],M[p]]=[M[p],M[c]];
  for(let i=0;i<n;i++)if(i!==c){const f=M[i][c]/M[c][c];for(let k=c;k<=n;k++)M[i][k]-=f*M[c][k]}}return M.map((r,i)=>r[n]/r[i])};
ME.det=A=>{const n=A.length;if(n===1)return A[0][0];if(n===2)return A[0][0]*A[1][1]-A[0][1]*A[1][0];let s=0;for(let j=0;j<n;j++){const m=A.slice(1).map(r=>r.filter((_,k)=>k!==j));s+=(j%2?-1:1)*A[0][j]*ME.det(m)}return s};
// Newton multivariable: F lista de funciones, J matriz de funciones
ME.newton=(F,J,x0,it=80)=>{let x=x0.slice();for(let k=0;k<it;k++){const fx=F.map(f=>f(...x));if(!fx.every(isFinite))return null;if(Math.max(...fx.map(Math.abs))<1e-12)return x;const Jx=J.map(r=>r.map(f=>f(...x)));const d=ME.solve(Jx,fx.map(v=>-v));if(!d||!d.every(isFinite))return null;x=x.map((v,i)=>v+d[i]);if(Math.max(...d.map(Math.abs))<1e-13)break}
  const fx=F.map(f=>f(...x));return fx.every(v=>isFinite(v)&&Math.abs(v)<1e-8)?x:null};
ME.multi=(F,J,box,n)=>{const sol=[],[lo,hi]=box,k=7;const pts=[];const rec=(p)=>{if(p.length===n){pts.push(p);return}for(let i=0;i<k;i++)rec([...p,lo+(hi-lo)*(i+.37)/k])};rec([]);
  pts.forEach(p=>{const x=ME.newton(F,J,p);if(x&&!sol.some(s=>s.every((v,i)=>Math.abs(v-x[i])<1e-6*(1+Math.abs(v)))))sol.push(x.map(v=>Math.abs(v)<1e-10?0:v))});return sol};
// Optimización libre en n variables
ME.criticos=(expr,vars,box=[-10,10])=>{const F=ME.fun(expr,vars);if(F.err)return F;const g=ME.grad(F.node,vars),H=g.map(gi=>vars.map(v=>ME.d(gi,v)));
  const gf=g.map(n=>ME.comp(n,vars)),Hf=H.map(r=>r.map(n=>ME.comp(n,vars)));const pts=ME.multi(gf,Hf,box,vars.length).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  return{F,g,H,pts:pts.map(x=>{const Hx=Hf.map(r=>r.map(f=>f(...x))),D=Hx.map((_,k)=>ME.det(Hx.slice(0,k+1).map(r=>r.slice(0,k+1))));
    const tipo=D.every(d=>d>1e-10)?"mínimo local":D.every((d,k)=>k%2?d>1e-10:d<-1e-10)?"máximo local":Math.abs(D[D.length-1])<1e-10?"no concluyente":(vars.length===2&&D[1]<0)?"punto de silla":"punto de silla";return{x,f:F.f(...x),Hx,D,tipo}})}};
// Lagrange con una restricción g = c
ME.lagrange=(fe,ge,c,vars,box=[-20,40])=>{const F=ME.fun(fe,vars),G=ME.fun(ge,vars);if(F.err||G.err)return{err:F.err||G.err};const n=vars.length,all=[...vars,"lambda"];
  const Lnode=math.parse(`(${F.node.toString()}) + lambda*((${c}) - (${G.node.toString()}))`);const Lg=all.map(v=>ME.d(Lnode,v)),LH=Lg.map(gi=>all.map(v=>ME.d(gi,v)));
  const gf=Lg.map(nd=>ME.comp(nd,all)),Hf=LH.map(r=>r.map(nd=>ME.comp(nd,all)));const pts=ME.multi(gf,Hf,box,n+1);
  const gg=ME.grad(G.node,vars).map(nd=>ME.comp(nd,vars)),fg=ME.grad(F.node,vars);
  return{F,G,Lnode,Lg,fg,gder:ME.grad(G.node,vars),pts:pts.map(p=>{const x=p.slice(0,n),lam=p[n],gv=gg.map(f=>f(...x)),Lxx=vars.map((_,i)=>vars.map((_,j)=>Hf[i][j](...p)));
    const B=[[0,...gv],...vars.map((_,i)=>[gv[i],...Lxx[i]])],dB=ME.det(B);const tipo=n===2?(dB>1e-10?"máximo":dB<-1e-10?"mínimo":"no concluyente"):(()=>{const ds=[];for(let k=3;k<=n+1;k++)ds.push(ME.det(B.slice(0,k).map(r=>r.slice(0,k))));return ds.every(d=>d<-1e-10)?"mínimo":ds.every((d,i)=>i%2?d<-1e-10:d>1e-10)?"máximo":"no concluyente"})();
    return{x,lam,f:F.f(...x),B,dB,tipo}}).sort((a,b)=>b.f-a.f)}};
// Ecuaciones diferenciales
ME.edo1=(a,b,y0)=>{if(Math.abs(a)<1e-12)return{tipo:"lineal",yp:NaN,A:y0,f:t=>y0+b*t};const yp=b/a,A=y0-yp;return{tipo:a>0?"converge":"diverge",yp,A,f:t=>A*Math.exp(-a*t)+yp}};
ME.edo2=(a1,a2,b,y0,v0)=>{const yp=Math.abs(a2)>1e-12?b/a2:NaN,D=a1*a1-4*a2,c0=y0-(isFinite(yp)?yp:0);
  if(!isFinite(yp))return{caso:"a₂ = 0",D};
  if(D>1e-12){const r1=(-a1+Math.sqrt(D))/2,r2=(-a1-Math.sqrt(D))/2,A2=(v0-r1*c0)/(r2-r1),A1=c0-A2;return{caso:"raíces reales distintas",D,r1,r2,A1,A2,yp,f:t=>A1*Math.exp(r1*t)+A2*Math.exp(r2*t)+yp,estable:r1<0&&r2<0}}
  if(Math.abs(D)<=1e-12){const r=-a1/2,A3=c0,A4=v0-r*c0;return{caso:"raíz real repetida",D,r1:r,r2:r,A3,A4,yp,f:t=>(A3+A4*t)*Math.exp(r*t)+yp,estable:r<0}}
  const h=-a1/2,v=Math.sqrt(-D)/2,A5=c0,A6=(v0-h*c0)/v;return{caso:"raíces complejas",D,h,v,A5,A6,yp,f:t=>Math.exp(h*t)*(A5*Math.cos(v*t)+A6*Math.sin(v*t))+yp,estable:h<0}};
ME.fase=(A,b)=>{const eq=ME.solve(A,b.map(v=>-v)),tr=A[0][0]+A[1][1],dt=ME.det(A),D=tr*tr-4*dt;let tipo,est;
  if(Math.abs(dt)<1e-12){tipo="degenerado (det = 0)";est="—"}else if(dt<0){tipo="punto de silla";est="inestable (silla)"}
  else if(D>=0){tipo=Math.abs(D)<1e-12?"nodo impropio":"nodo";est=tr<0?"estable":"inestable"}else{tipo=Math.abs(tr)<1e-12?"centro":"foco (espiral)";est=Math.abs(tr)<1e-12?"neutral (órbitas cerradas)":tr<0?"estable":"inestable"}
  const l=D>=0?[(tr+Math.sqrt(D))/2,(tr-Math.sqrt(D))/2]:[{re:tr/2,im:Math.sqrt(-D)/2}];return{eq,tr,dt,D,tipo,est,l}};
ME.rk4=(fx,fy,x,y,h,n)=>{const P=[[x,y]];for(let i=0;i<n;i++){const k1=[fx(x,y),fy(x,y)],k2=[fx(x+h/2*k1[0],y+h/2*k1[1]),fy(x+h/2*k1[0],y+h/2*k1[1])],k3=[fx(x+h/2*k2[0],y+h/2*k2[1]),fy(x+h/2*k2[0],y+h/2*k2[1])],k4=[fx(x+h*k3[0],y+h*k3[1]),fy(x+h*k3[0],y+h*k3[1])];
  x+=h/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);y+=h/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);if(!isFinite(x)||!isFinite(y)||Math.abs(x)>1e6||Math.abs(y)>1e6)break;P.push([x,y])}return P};
// Ecuaciones en diferencias
ME.dif1=(a,c,y0)=>{if(Math.abs(1+a)<1e-12)return{yp:NaN,f:t=>y0+c*t,b:1,tipo:"sin equilibrio (a = −1)"};const yp=c/(1+a),b=-a,A=y0-yp;return{yp,A,b,f:t=>A*Math.pow(b,t)+yp,tipo:(Math.abs(b)<1?"converge":Math.abs(b)>1?"diverge":"oscila sin amortiguarse")+(b<0?" con oscilación":" sin oscilación")}};
ME.dif2=(a1,a2,c,y0,y1)=>{const yp=Math.abs(1+a1+a2)>1e-12?c/(1+a1+a2):NaN,D=a1*a1-4*a2;const ys=[y0,y1];for(let t=2;t<=60;t++)ys.push(c-a1*ys[t-1]-a2*ys[t-2]);
  let caso,mod;if(D>1e-12){const b1=(-a1+Math.sqrt(D))/2,b2=(-a1-Math.sqrt(D))/2;caso="raíces reales distintas";mod=Math.max(Math.abs(b1),Math.abs(b2));return{yp,D,caso,b1,b2,mod,ys,estable:mod<1}}
  if(Math.abs(D)<=1e-12){const b=-a1/2;return{yp,D,caso:"raíz real repetida",b1:b,b2:b,mod:Math.abs(b),ys,estable:Math.abs(b)<1}}
  const R=Math.sqrt(a2),th=Math.acos(Math.max(-1,Math.min(1,-a1/(2*R))));return{yp,D,caso:"raíces complejas",h:-a1/2,v:Math.sqrt(-D)/2,R,th,mod:R,ys,estable:R<1}};
