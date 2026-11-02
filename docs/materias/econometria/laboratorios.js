// Econometría · laboratorios y talleres. Sus utilidades numéricas y de gráficos viven dentro de esta función
// para no chocar con las del motor común.
const SIMS={};
(function(){
// ===== utilidades numéricas =====
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function normals(R,n){const o=[];for(let i=0;i<n;i++){const u1=R()||1e-9,u2=R();o.push(Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2))}return o}
function ols(x,y){const n=x.length,mx=x.reduce((a,b)=>a+b)/n,my=y.reduce((a,b)=>a+b)/n;let sxy=0,sxx=0,sct=0;
  for(let i=0;i<n;i++){sxy+=(x[i]-mx)*(y[i]-my);sxx+=(x[i]-mx)**2;sct+=(y[i]-my)**2}const b1=sxy/sxx,b0=my-b1*mx;let scr=0;
  for(let i=0;i<n;i++)scr+=(y[i]-b0-b1*x[i])**2;return{b0,b1,scr,r2:1-scr/sct}}
function gln(z){const c=[76.18009172947146,-86.50532032941677,24.01409824083091,-1.231739572450155,.1208650973866179e-2,-.5395239384953e-5];
  let x=z,y=z,t=x+5.5;t-=(x+.5)*Math.log(t);let s=1.000000000190015;for(const ci of c)s+=ci/++y;return -t+Math.log(2.5066282746310005*s/x)}
function bcf(a,b,x){const F=1e-300;let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<F)d=F;d=1/d;let h=d;
  for(let m=1;m<=300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<F)d=F;c=1+aa/c;if(Math.abs(c)<F)c=F;d=1/d;h*=d*c;
    aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<F)d=F;c=1+aa/c;if(Math.abs(c)<F)c=F;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-12)break}return h}
function ibeta(a,b,x){if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(gln(a+b)-gln(a)-gln(b)+a*Math.log(x)+b*Math.log(1-x));
  return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b}
function fp(F,d1,d2){return F<=0?1:ibeta(d2/2,d1/2,d2/(d2+d1*F))}
function fcrit(d1,d2,al=.05){let lo=0,hi=8000;for(let i=0;i<100;i++){const m=(lo+hi)/2;fp(m,d1,d2)>al?lo=m:hi=m}return(lo+hi)/2}
function erfc(x){const z=Math.abs(x),t=1/(1+.5*z);const r=t*Math.exp(-z*z-1.26551223+t*(1.00002368+t*(.37409196+t*(.09678418+t*(-.18628806+t*(.27886807+t*(-1.13520398+t*(1.48851587+t*(-.82215223+t*.17087277)))))))));return x>=0?r:2-r}
const fmt=(v,d=2)=>v.toLocaleString("es-CO",{minimumFractionDigits:d,maximumFractionDigits:d});
const $=id=>document.getElementById(id);

// marco de gráfico
function frame(W,H,xr,yr,xt,yt,xl,yl){
  const L=46,R=12,T=12,B=36; const sx=x=>L+(x-xr[0])/(xr[1]-xr[0])*(W-L-R), sy=y=>T+(yr[1]-y)/(yr[1]-yr[0])*(H-T-B);
  let g="";
  yt.forEach(v=>g+=`<line x1="${L}" x2="${W-R}" y1="${sy(v)}" y2="${sy(v)}" stroke="var(--rule)"/><text x="${L-6}" y="${sy(v)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${typeof v==="number"&&!Number.isInteger(v)?fmt(v,1):v}</text>`);
  xt.forEach(v=>g+=`<text x="${sx(v)}" y="${H-18}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${v}</text>`);
  g+=`<text x="${W-R}" y="${H-3}" text-anchor="end" font-size="11" fill="var(--muted)">${xl}</text><text x="${L}" y="${T-2}" font-size="11" fill="var(--muted)" dy="10" dx="4">${yl}</text>`;
  return{sx,sy,g,W,H};
}
const svg=(f,body,label)=>`<svg viewBox="0 0 ${f.W} ${f.H}" role="img" aria-label="${label}">${f.g}${body}</svg>`;
function ticks(a,b,step){const o=[];for(let v=Math.ceil(a/step)*step;v<=b+1e-9;v+=step)o.push(+v.toFixed(6));return o}
function slider(id,label,min,max,step,val){return `<label for="${id}"><span>${label} <output id="o-${id}"></output></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`}



// ---- MCO simple: intenta ganarle a MCO
SIMS.mco=function(){
  const R=rng(4), E=normals(R,20), X=[], Y=[];
  for(let i=0;i<20;i++){const x=+(0.5+R()*9.5).toFixed(2);X.push(x);Y.push(7+2.5*x+3*E[i])}
  const best=ols(X,Y);
  $("sim").innerHTML=`<p>Mueve la recta candidata. Los segmentos rojos son los residuos. MCO es la única recta con la SCR más baja posible.</p>
  <div class="ctr">${slider("cb0","Intercepto candidato",-5,20,"any",3)}${slider("cb1","Pendiente candidata",0,5,"any",3.5)}</div>
  <div class="plot" id="plot"></div><div class="res" id="res"></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn solid" type="button" id="fit">Ajustar por MCO</button><span id="msg" style="align-self:center;font-weight:600"></span></div>`;
  const run=()=>{const b0=+$("cb0").value,b1=+$("cb1").value;$("o-cb0").textContent=fmt(b0);$("o-cb1").textContent=fmt(b1);
    let scr=0;X.forEach((x,i)=>scr+=(Y[i]-b0-b1*x)**2);
    const f=frame(600,320,[0,10],[0,40],ticks(0,10,2),ticks(0,40,10),"x (publicidad)","y (ventas)");
    let b="";X.forEach((x,i)=>{const yh=b0+b1*x;b+=`<line x1="${f.sx(x)}" x2="${f.sx(x)}" y1="${f.sy(Math.max(-5,Math.min(45,yh)))}" y2="${f.sy(Y[i])}" stroke="var(--bad)" stroke-width="1.5" stroke-opacity=".7"/>`});
    X.forEach((x,i)=>b+=`<circle cx="${f.sx(x)}" cy="${f.sy(Y[i])}" r="4.5" fill="var(--line)"/>`);
    const cl=(v)=>Math.max(-5,Math.min(45,v));
    b+=`<line x1="${f.sx(0)}" y1="${f.sy(cl(best.b0))}" x2="${f.sx(10)}" y2="${f.sy(cl(best.b0+best.b1*10))}" stroke="var(--muted)" stroke-dasharray="5 5" stroke-width="1.5"/>`;
    b+=`<line x1="${f.sx(0)}" y1="${f.sy(cl(b0))}" x2="${f.sx(10)}" y2="${f.sy(cl(b0+b1*10))}" stroke="var(--ink)" stroke-width="2.5"/>`;
    $("plot").innerHTML=`<svg viewBox="0 0 600 320" role="img" aria-label="Datos, recta candidata y residuos"><defs><clipPath id="cp"><rect x="46" y="12" width="542" height="272"/></clipPath></defs>${f.g}<g clip-path="url(#cp)">${b}</g></svg>`;
    $("res").innerHTML=[["SCR de tu recta",fmt(scr,1)],["SCR de MCO",fmt(best.scr,1)],["β̂₀ MCO",fmt(best.b0)],["β̂₁ MCO",fmt(best.b1)],["R² MCO",fmt(best.r2,3)]].map(([s,v])=>`<div><small>${s}</small><b>${v}</b></div>`).join("");
    const gap=scr/best.scr-1; $("msg").textContent=gap<0.005?"Llegaste al mínimo: esta es la recta de MCO.":`Tu SCR es ${fmt(gap*100,1)} % mayor que la de MCO.`;
    $("msg").style.color=gap<0.005?"var(--good)":"var(--muted)";};
  ["cb0","cb1"].forEach(i=>$(i).addEventListener("input",run));
  $("fit").onclick=()=>{$("cb0").value=best.b0;$("cb1").value=best.b1;run()};
  run();
};

// ---- Chow
SIMS.chow=function(){
  const N=60,R=rng(20261028),XS=[];for(let i=0;i<N;i++)XS.push(10+R()*40);const ES=normals(R,N);
  $("sim").innerHTML=`<p>60 observaciones ordenadas en el tiempo. Las primeras forman el periodo 1 y el resto el periodo 2. Tú decides cuánto cambia la relación en el periodo 2.</p>
  <div class="ctr">${slider("s-nb","Observaciones en el periodo 1",15,45,1,30)}${slider("s-di","Cambio en el intercepto (δ₀)",-15,15,0.5,0)}${slider("s-ds","Cambio en la pendiente (δ₁)",-0.6,0.6,0.02,0.3)}${slider("s-sg","Ruido (σ)",1,12,0.5,4)}</div>
  <div class="legend"><span><i style="background:var(--line)"></i>Periodo 1</span><span><i style="background:var(--branch)"></i>Periodo 2</span><span><i style="background:var(--muted);height:2px"></i>Modelo restringido</span></div>
  <div class="plot" id="plot"></div><div class="res" id="res"></div><div class="verdict" id="ver"></div>`;
  const run=()=>{const nb=+$("s-nb").value,di=+$("s-di").value,ds=+$("s-ds").value,sg=+$("s-sg").value;
    $("o-s-nb").textContent=nb;$("o-s-di").textContent=fmt(di,1);$("o-s-ds").textContent=fmt(ds,2);$("o-s-sg").textContent=fmt(sg,1);
    const Y=XS.map((x,i)=>5+0.8*x+(i>=nb?di+ds*x:0)+sg*ES[i]);
    const p=ols(XS,Y),a=ols(XS.slice(0,nb),Y.slice(0,nb)),b=ols(XS.slice(nb),Y.slice(nb));
    const k=2,d2=N-2*k,nr=a.scr+b.scr,F=((p.scr-nr)/k)/(nr/d2),pv=fp(F,k,d2),fc=fcrit(k,d2);
    const ymin=Math.min(...Y),ymax=Math.max(...Y),pad=(ymax-ymin)*.08,y0=Math.floor((ymin-pad)/10)*10,y1=Math.ceil((ymax+pad)/10)*10;
    const f=frame(600,320,[10,50],[y0,y1],ticks(10,50,10),ticks(y0,y1,(y1-y0)>80?20:10),"x","y");
    const ln=(m,c,d)=>`<line x1="${f.sx(10)}" y1="${f.sy(m.b0+m.b1*10)}" x2="${f.sx(50)}" y2="${f.sy(m.b0+m.b1*50)}" stroke="${c}" stroke-width="${d?2:2.5}" ${d?'stroke-dasharray="6 5"':""}/>`;
    let pts="";XS.forEach((x,i)=>pts+=`<circle cx="${f.sx(x).toFixed(1)}" cy="${f.sy(Y[i]).toFixed(1)}" r="4" fill="${i<nb?"var(--line)":"var(--branch)"}" fill-opacity=".75"/>`);
    $("plot").innerHTML=svg(f,pts+ln(p,"var(--muted)",1)+ln(a,"var(--line)")+ln(b,"var(--branch)"),"Dispersión de los dos periodos con sus rectas");
    $("res").innerHTML=[["SCR restringida",fmt(p.scr,1)],["SCR₁",fmt(a.scr,1)],["SCR₂",fmt(b.scr,1)],["F de Chow",fmt(F)],[`F crítico (${k}, ${d2})`,fmt(fc)],["p-valor",pv<1e-4?"< 0,0001":fmt(pv,4)]].map(([s,v])=>`<div><small>${s}</small><b>${v}</b></div>`).join("");
    const ver=$("ver");
    if(pv<.05){ver.className="verdict rej";ver.textContent=`F = ${fmt(F)} > ${fmt(fc)}: se rechaza H₀ al 5 %. Hay evidencia de cambio estructural.`}
    else{ver.className="verdict acc";ver.textContent=`F = ${fmt(F)} ≤ ${fmt(fc)}: no se rechaza H₀ al 5 %. Los datos son compatibles con una sola relación.`}};
  ["s-nb","s-di","s-ds","s-sg"].forEach(i=>$(i).addEventListener("input",run));run();
};

// ---- Heterocedasticidad
SIMS.hetero=function(){
  const N=80,R=rng(77),X=[];for(let i=0;i<N;i++)X.push(1+R()*49);const E=normals(R,N);
  $("sim").innerHTML=`<p>Gasto en ocio (y) contra ingreso (x). Aumenta el grado de heterocedasticidad y observa cómo los puntos se abren en abanico y la prueba de Breusch-Pagan lo detecta.</p>
  <div class="ctr">${slider("hg","Grado de heterocedasticidad (γ)",0,3,0.1,1.5)}</div>
  <div class="plot" id="plot"></div><div class="res" id="res"></div><div class="verdict" id="ver"></div>`;
  const run=()=>{const g=+$("hg").value;$("o-hg").textContent=fmt(g,1);
    const Y=X.map((x,i)=>10+0.6*x+2.5*(1+g*x/25)*E[i]);
    const m=ols(X,Y),u2=X.map((x,i)=>(Y[i]-m.b0-m.b1*x)**2),aux=ols(X,u2),LM=N*aux.r2,p=erfc(Math.sqrt(LM/2));
    const f=frame(600,320,[0,50],[-30,90],ticks(0,50,10),ticks(-30,90,30),"x (ingreso)","y");
    let b="";
    // banda ±2σ(x)
    const top=[],bot=[];for(let x=0;x<=50;x+=2){const s=2*2.5*(1+g*x/25);top.push(`${f.sx(x)},${f.sy(Math.min(90,m.b0+m.b1*x+s))}`);bot.unshift(`${f.sx(x)},${f.sy(Math.max(-30,m.b0+m.b1*x-s))}`)}
    b+=`<polygon points="${top.concat(bot).join(" ")}" fill="var(--branch)" fill-opacity=".15"/>`;
    X.forEach((x,i)=>{if(Y[i]>-30&&Y[i]<90)b+=`<circle cx="${f.sx(x)}" cy="${f.sy(Y[i])}" r="4" fill="var(--line)" fill-opacity=".75"/>`});
    b+=`<line x1="${f.sx(0)}" y1="${f.sy(m.b0)}" x2="${f.sx(50)}" y2="${f.sy(m.b0+m.b1*50)}" stroke="var(--ink)" stroke-width="2.5"/>`;
    $("plot").innerHTML=svg(f,b,"Dispersión con banda de dos desviaciones del error");
    $("res").innerHTML=[["β̂₁ (verdadero 0,6)",fmt(m.b1,3)],["R² auxiliar",fmt(aux.r2,3)],["LM = n·R²",fmt(LM)],["χ²(1) crítico 5 %","3,84"],["p-valor",p<1e-4?"< 0,0001":fmt(p,4)]].map(([s,v])=>`<div><small>${s}</small><b>${v}</b></div>`).join("");
    const ver=$("ver");
    if(p<.05){ver.className="verdict rej";ver.textContent="Se rechaza la homocedasticidad. Fíjate que β̂₁ sigue cerca de 0,6: el problema no es el coeficiente sino sus errores estándar."}
    else{ver.className="verdict acc";ver.textContent="No se rechaza la homocedasticidad: la varianza del error parece constante."}};
  $("hg").addEventListener("input",run);run();
};

// ---- Logit vs MPL
SIMS.logit=function(){
  const N=120,R=rng(9),X=[],U=[];for(let i=0;i<N;i++){X.push(R()*10);U.push(R())}
  $("sim").innerHTML=`<p>Probabilidad de comprar un producto (y = 1) según el ingreso (x). La recta es el MPL; la curva es el logit, ambos estimados con los mismos datos. Elige dónde evaluar el efecto marginal.</p>
  <div class="ctr">${slider("lb","Fuerza de la relación verdadera",0.3,2,0.05,0.9)}${slider("lx","Evaluar efecto marginal en x =",0,10,0.5,5)}</div>
  <div class="legend"><span><i style="background:var(--line)"></i>Logit</span><span><i style="background:var(--branch)"></i>MPL</span></div>
  <div class="plot" id="plot"></div><div class="res" id="res"></div>`;
  const run=()=>{const tb=+$("lb").value,xe=+$("lx").value;$("o-lb").textContent=fmt(tb);$("o-lx").textContent=fmt(xe,1);
    const Y=X.map((x,i)=>U[i]<1/(1+Math.exp(-(tb*(x-5))))?1:0);
    // logit por Newton-Raphson
    let b0=0,b1=0;for(let it=0;it<40;it++){let g0=0,g1=0,h00=0,h01=0,h11=0;
      for(let i=0;i<N;i++){const p=1/(1+Math.exp(-(b0+b1*X[i]))),w=p*(1-p);g0+=Y[i]-p;g1+=(Y[i]-p)*X[i];h00+=w;h01+=w*X[i];h11+=w*X[i]*X[i]}
      const det=h00*h11-h01*h01;if(!isFinite(det)||Math.abs(det)<1e-12)break;const d0=(h11*g0-h01*g1)/det,d1=(-h01*g0+h00*g1)/det;b0+=d0;b1+=d1;if(Math.abs(d0)+Math.abs(d1)<1e-9)break;if(Math.abs(b1)>50)break}
    const lp=ols(X,Y),P=x=>1/(1+Math.exp(-(b0+b1*x)));
    const f=frame(600,320,[0,10],[-0.2,1.2],ticks(0,10,2),[-0.2,0,0.2,0.4,0.6,0.8,1,1.2],"x (ingreso)","P(y = 1)");
    let b=`<rect x="${f.sx(0)}" y="${f.sy(1.2)}" width="${f.sx(10)-f.sx(0)}" height="${f.sy(1)-f.sy(1.2)}" fill="var(--bad)" fill-opacity=".08"/><rect x="${f.sx(0)}" y="${f.sy(0)}" width="${f.sx(10)-f.sx(0)}" height="${f.sy(-0.2)-f.sy(0)}" fill="var(--bad)" fill-opacity=".08"/>`;
    X.forEach((x,i)=>b+=`<circle cx="${f.sx(x)}" cy="${f.sy(Y[i]?1-0.03*U[i]:0.03*U[i])}" r="3.5" fill="var(--muted)" fill-opacity=".55"/>`);
    let path="";for(let x=0;x<=10.001;x+=0.1)path+=(path?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(P(x)).toFixed(1);
    const cl=v=>Math.max(-0.2,Math.min(1.2,v));
    b+=`<line x1="${f.sx(0)}" y1="${f.sy(cl(lp.b0))}" x2="${f.sx(10)}" y2="${f.sy(cl(lp.b0+lp.b1*10))}" stroke="var(--branch)" stroke-width="2.5"/>`;
    b+=`<path d="${path}" fill="none" stroke="var(--line)" stroke-width="2.5"/>`;
    const pe=P(xe),me=pe*(1-pe)*b1,tx=1.2;
    b+=`<line x1="${f.sx(Math.max(0,xe-tx))}" y1="${f.sy(cl(pe-me*Math.min(tx,xe)))}" x2="${f.sx(Math.min(10,xe+tx))}" y2="${f.sy(cl(pe+me*Math.min(tx,10-xe)))}" stroke="var(--ink)" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="${f.sx(xe)}" cy="${f.sy(pe)}" r="6" fill="var(--ink)"/>`;
    b+=`<text x="${f.sx(0.15)}" y="${f.sy(1.12)}" font-size="11" fill="var(--bad)">Zona imposible: P &gt; 1</text>`;
    $("plot").innerHTML=svg(f,b,"Datos binarios, recta del MPL y curva logit");
    $("res").innerHTML=[["Logit: P̂ en x",fmt(pe,3)],["Efecto marginal logit",fmt(me,3)],["Efecto marginal MPL",fmt(lp.b1,3)],["β̂₁ logit",fmt(b1,3)],["MPL predice en x = 10",fmt(lp.b0+lp.b1*10,3)]].map(([s,v])=>`<div><small>${s}</small><b>${v}</b></div>`).join("");};
  ["lb","lx"].forEach(i=>$(i).addEventListener("input",run));run();
};

// ===================== TALLERES =====================
const TR=A=>A[0].map((_,j)=>A.map(r=>r[j]));
const MM=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,v,q)=>s+v*B[q][j],0)));
const EYE=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>+(i===j)));
const SUB=(A,B)=>A.map((r,i)=>r.map((v,j)=>v-B[i][j]));
const colv=v=>v.map(x=>[x]);
function INV(A){const n=A.length,mx=Math.max(...A.flat().map(Math.abs))||1;const M=A.map((r,i)=>[...r,...A.map((_,j)=>+(i===j))]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    if(Math.abs(M[p][c])<1e-10*mx)return null;[M[c],M[p]]=[M[p],M[c]];const d=M[c][c];for(let j=0;j<2*n;j++)M[c][j]/=d;
    for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];if(f)for(let j=0;j<2*n;j++)M[r][j]-=f*M[c][j]}}
  return M.map(r=>r.slice(n))}
function DET3(m){return m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0])}
function OLSM(X,y){const XtX=MM(TR(X),X),inv=INV(XtX);if(!inv)return null;const Xty=MM(TR(X),colv(y));const b=MM(inv,Xty).map(r=>r[0]);
  const yh=X.map(r=>r.reduce((s,v,q)=>s+v*b[q],0)),u=y.map((v,i)=>v-yh[i]);return{XtX,inv,Xty,b,yh,u,scr:u.reduce((s,v)=>s+v*v,0)}}
function fm(v){if(!isFinite(v))return"—";if(Math.abs(v)<5e-10)return"0";const a=Math.abs(v);
  if(Math.abs(v-Math.round(v))<1e-9)return Math.round(v).toLocaleString("es-CO");
  const d=a>=1000?1:a>=10?2:a>=1?3:a>=0.01?4:6;return(+v.toFixed(d)).toLocaleString("es-CO",{maximumFractionDigits:d})}
const pf=p=>p<1e-4?"&lt; 0,0001":fmt(p,4);
const sgn=v=>v<0?"−":"+";
function nice(v){const p=10**Math.floor(Math.log10(v)),m=v/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
function mat(M,cap,o={}){const r=M.length,c=M[0].length;let cells="";
  for(let i=0;i<r;i++)for(let j=0;j<c;j++){const cl=(o.cls?o.cls(i,j):"")+(o.click?" cl":"");
    cells+=`<span class="${cl}"${o.click?` data-cell="${o.click}" data-i="${i}" data-j="${j}"`:""}>${fm(M[i][j])}</span>`}
  return `<div class="mx"><div class="cap">${cap}${o.sub?`<small>${o.sub}</small>`:""}</div><div class="mg" style="grid-template-columns:repeat(${c},auto)">${cells}</div></div>`}
let CALC_PREFILL=null;
const SING=`<p class="warn"><b>X′X no tiene inversa.</b> Alguna columna es combinación lineal exacta de otras (por ejemplo, una variable constante o proporcional a otra). Es multicolinealidad perfecta: cambia algún dato.</p>`;

// ---------- motor 3D mínimo en canvas ----------
function hx(c){c=(c||"").trim();if(/^#[0-9a-f]{6}$/i.test(c))return[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));return[120,120,140]}
function Scene3D(cv){
  const S={yaw:-0.85,pitch:0.42,scale:1,auto:false,center:[0,0,0],items:[],onStop:null};
  const ctx=cv.getContext("2d");let W=0,H=0,dpr=1,dirty=true,drag=null;
  const P=p=>{const x=p[0]-S.center[0],y=p[1]-S.center[1],z=p[2]-S.center[2];
    const cy=Math.cos(S.yaw),sy=Math.sin(S.yaw),cp=Math.cos(S.pitch),sp=Math.sin(S.pitch);
    const X=x*cy-y*sy,Y=x*sy+y*cy,up=z*cp+Y*sp,dep=Y*cp-z*sp,f=3.6/(3.6+dep),k=Math.min(W,H)*0.3*S.scale;
    return[W/2+X*f*k,H/2-up*f*k,dep]};
  function draw(){
    if(!cv.clientWidth)return;
    if(cv.clientWidth!==W||cv.clientHeight!==H){dpr=window.devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    const css=getComputedStyle(document.documentElement),col=n=>n.startsWith("--")?css.getPropertyValue(n).trim():n,font=css.getPropertyValue("--f-body");
    const A=hx(col("--line")),B=hx(col("--branch"));
    const L=S.items.map(it=>{let pts;if(it.type==="pt"||it.type==="txt")pts=[P(it.p)];else if(it.type==="ln"||it.type==="arr")pts=[P(it.a),P(it.b)];else pts=it.pts.map(P);
      return{it,pts,d:pts.reduce((s,q)=>s+q[2],0)/pts.length+(it.bias||0)}});
    L.sort((a,b)=>b.d-a.d);
    for(const{it,pts}of L){
      let c=it.mix!=null?`rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*it.mix)).join(",")})`:col(it.c||"--ink");
      ctx.globalAlpha=it.op??1;
      if(it.type==="poly"){ctx.beginPath();pts.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.fillStyle=c;ctx.fill();
        if(it.stroke){ctx.globalAlpha=it.sa??.5;ctx.strokeStyle=col(it.stroke);ctx.lineWidth=.7;ctx.stroke()}}
      else if(it.type==="ln"||it.type==="arr"){const[a,b]=pts;ctx.beginPath();ctx.setLineDash(it.dash||[]);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle=c;ctx.lineWidth=it.w||1.5;ctx.stroke();ctx.setLineDash([]);
        if(it.type==="arr"){const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l,h=Math.min(12,l*.35);
          ctx.beginPath();ctx.moveTo(b[0],b[1]);ctx.lineTo(b[0]-ux*h-uy*h*.45,b[1]-uy*h+ux*h*.45);ctx.lineTo(b[0]-ux*h+uy*h*.45,b[1]-uy*h-ux*h*.45);ctx.closePath();ctx.fillStyle=c;ctx.fill()}}
      else if(it.type==="pt"){ctx.beginPath();ctx.arc(pts[0][0],pts[0][1],it.r||3.5,0,7);ctx.fillStyle=c;ctx.fill()}
      else if(it.type==="txt"){ctx.font=`${it.bold?"600 ":""}${it.s||12}px ${font}`;ctx.fillStyle=c;ctx.textAlign=it.align||"center";ctx.textBaseline="middle";ctx.fillText(it.t,pts[0][0]+(it.dx||0),pts[0][1]+(it.dy||0))}
    }
    ctx.globalAlpha=1}
  const mo=new MutationObserver(()=>dirty=true);mo.observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  const mq=window.matchMedia("(prefers-color-scheme: dark)"),mqf=()=>dirty=true;if(mq.addEventListener)mq.addEventListener("change",mqf);
  function loop(){if(!cv.isConnected){mo.disconnect();if(mq.removeEventListener)mq.removeEventListener("change",mqf);return}
    if(S.auto){S.yaw+=.005;dirty=true}if(dirty){dirty=false;draw()}requestAnimationFrame(loop)}
  S.set=it=>{S.items=it;dirty=true};
  S.stop=()=>{if(S.auto){S.auto=false;S.onStop&&S.onStop()}};
  S.tween=d=>{let best=null;for(const s of[1,-1]){const e=d.map(v=>v*s),p=Math.asin(Math.max(-1,Math.min(1,-e[2]))),yw=Math.atan2(e[0],e[1]),sc=Math.abs(p-.4);if(!best||sc<best.sc)best={p,yw,sc}}
    S.stop();const p0=S.pitch,y0=S.yaw;let dy=best.yw-y0;dy=((dy+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;const p1=Math.max(-.3,Math.min(1.45,best.p));
    const t0=performance.now(),D=reduce?1:750;const st=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);S.yaw=y0+dy*e;S.pitch=p0+(p1-p0)*e;dirty=true;if(k<1&&cv.isConnected)requestAnimationFrame(st)};requestAnimationFrame(st)};
  cv.addEventListener("pointerdown",e=>{drag=[e.clientX,e.clientY];try{cv.setPointerCapture(e.pointerId)}catch(_){}S.stop()});
  cv.addEventListener("pointermove",e=>{if(!drag)return;S.yaw+=(e.clientX-drag[0])*.01;S.pitch=Math.max(-.3,Math.min(1.45,S.pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];dirty=true});
  const up=()=>drag=null;cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
  cv.addEventListener("wheel",e=>{e.preventDefault();S.scale=Math.max(.5,Math.min(2.4,S.scale*(e.deltaY<0?1.08:.93)));dirty=true},{passive:false});
  requestAnimationFrame(loop);return S}
function boxItems(){const o=[],c=[-1,1];for(const a of c)for(const b of c){o.push({type:"ln",a:[-1,a,b],b:[1,a,b],c:"--rule",w:1,bias:80});o.push({type:"ln",a:[a,-1,b],b:[a,1,b],c:"--rule",w:1,bias:80});o.push({type:"ln",a:[a,b,-1],b:[a,b,1],c:"--rule",w:1,bias:80})}return o}
const txt=(p,t,o={})=>Object.assign({type:"txt",p,t,c:"--muted",s:11,bias:-60},o);
function rotBtn(sc){const b=$("rot");b.onclick=()=>{if(sc.auto)sc.stop();else{sc.auto=true;b.textContent="Detener giro"}};sc.onStop=()=>b.textContent="Girar solo"}

// ---------- Taller 1: matrices paso a paso y partición ----------
SIMS.wsMat=function(){
  const EX={x1:[2,3,5,6,4,7,8,5,9,6],x2:[10,9,9,8,10,7,6,8,6,7],y:[12,15,20,22,16,25,29,19,33,23]};
  const fresh=()=>EX.y.map((_,i)=>({x1:EX.x1[i],x2:EX.x2[i],y:EX.y[i]}));
  let D=fresh(),view="pasos",step=1,shown=0,k1=1,rs=5,jump=false;const mem={};
  const ws=$("ws");
  ws.innerHTML=`<div class="sim"><p>Ventas (y), publicidad (x₁) y precio (x₂) de 10 meses. Cambia cualquier número y todo se recalcula.</p>
    <div class="tbl dtable"><table id="dt"></table></div>
    <div class="row"><button class="btn" type="button" id="addr">+ Fila</button><button class="btn" type="button" id="delr">− Fila</button><button class="btn" type="button" id="rst">Restaurar ejemplo</button></div></div>
    <div class="seg" role="group" aria-label="Vista" id="vseg"><button type="button" data-v="pasos" aria-pressed="true">Paso a paso</button><button type="button" data-v="cols" aria-pressed="false">Partición por columnas</button><button type="button" data-v="filas" aria-pressed="false">Partición por filas</button></div>
    <div id="wsv" style="display:flex;flex-direction:column;gap:14px"></div>`;
  const drawTable=()=>{$("dt").innerHTML=`<tr><th>Mes</th><th>x₁ publicidad</th><th>x₂ precio</th><th>y ventas</th></tr>`+D.map((d,i)=>`<tr><td class="num">${i+1}</td>${["x1","x2","y"].map(k=>`<td><input type="text" inputmode="decimal" id="d-${i}-${k}" data-i="${i}" data-k="${k}" value="${String(d[k]).replace(".",",")}" aria-label="${k} mes ${i+1}"></td>`).join("")}</tr>`).join("")};
  $("dt").addEventListener("input",e=>{const t=e.target;if(!t.dataset.k)return;const v=parseFloat(t.value.replace(",","."));if(isFinite(v)){D[+t.dataset.i][t.dataset.k]=v;t.style.borderColor="";render()}else t.style.borderColor="var(--bad)"});
  $("addr").onclick=()=>{if(D.length>=14)return;D.push({...D[D.length-1]});drawTable();render()};
  $("delr").onclick=()=>{if(D.length<=4)return;D.pop();drawTable();render()};
  $("rst").onclick=()=>{D=fresh();drawTable();render()};
  $("vseg").onclick=e=>{const b=e.target.closest("[data-v]");if(!b)return;view=b.dataset.v;$("vseg").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));shown=0;render()};
  ws.addEventListener("click",e=>{
    const c=e.target.closest("[data-cell]");
    if(c){const i=+c.dataset.i,j=+c.dataset.j,X=mem.X,kind=c.dataset.cell;ws.querySelectorAll(".mg span.hl").forEach(s=>s.classList.remove("hl"));c.classList.add("hl");
      const a=X.map(r=>r[i]),b=kind==="xtx"?X.map(r=>r[j]):mem.y,s=a.reduce((S,v,t)=>S+v*b[t],0),terms=a.map((v,t)=>`${fm(v)}·${fm(b[t])}`).join(" + "),nm=["1","x₁","x₂"];
      $("ex-"+kind).innerHTML=kind==="xtx"?`Celda (${i+1}, ${j+1}) = Σ ${nm[i]}·${nm[j]} = ${terms} = <b>${fm(s)}</b>`:`Fila ${i+1} = Σ ${nm[i]}·y = ${terms} = <b>${fm(s)}</b>`;return}
    const b=e.target.closest("[data-act]");if(!b)return;const a=b.dataset.act;
    if(a==="next"&&step<7){step++;jump=true}if(a==="all"){step=7;jump=true}if(a==="reset"){step=1;shown=0}
    if(a==="k1")k1=+b.dataset.val;
    if(a==="calc"){CALC_PREFILL=mem.chow;location.hash="t-calc";return}
    render()});
  ws.addEventListener("input",e=>{if(e.target.id==="rsl"){rs=+e.target.value;render()}});
  drawTable();render();

  function render(){
    const X=D.map(d=>[1,d.x1,d.x2]),y=D.map(d=>d.y),n=D.length,k=3;mem.X=X;mem.y=y;
    const XtX=MM(TR(X),X),Xty=MM(TR(X),colv(y)),r=OLSM(X,y),v=$("wsv");
    if(view==="pasos"){
      let s7=SING;
      if(r){const s2=r.scr/(n-k),ee=r.inv.map((q,i)=>Math.sqrt(s2*q[i])),my=y.reduce((a,b)=>a+b)/n,sct=y.reduce((a,b)=>a+(b-my)**2,0);
        s7=`<div class="tbl"><table><tr><th>Mes</th><th>y</th><th>ŷ = Xβ̂</th><th>û = y − ŷ</th><th>û²</th></tr>${y.map((v,i)=>`<tr><td class="num">${i+1}</td><td class="num">${fm(v)}</td><td class="num">${fm(r.yh[i])}</td><td class="num">${fm(r.u[i])}</td><td class="num">${fm(r.u[i]**2)}</td></tr>`).join("")}<tr><td colspan="4"><b>SCR = Σû²</b></td><td class="num"><b>${fm(r.scr)}</b></td></tr></table></div>
        <div class="res"><div><small>σ̂² = SCR/(n − k)</small><b>${fm(s2)}</b></div><div><small>ee(β̂₀)</small><b>${fm(ee[0])}</b></div><div><small>ee(β̂₁)</small><b>${fm(ee[1])}</b></div><div><small>ee(β̂₂)</small><b>${fm(ee[2])}</b></div><div><small>R²</small><b>${fmt(1-r.scr/sct,3)}</b></div></div>
        <p>Los errores estándar son la raíz de la diagonal de σ̂²(X′X)⁻¹. Con ellos se arman las pruebas t.</p>`}
      const st=[
        ["Arma la matriz X y el vector y",`<div class="mscroll"><div class="mrow">${mat(X,"X",{sub:n+"×3",cls:(i,j)=>j===0?"b3":""})}${mat(colv(y),"y",{sub:n+"×1"})}</div></div><p>La columna de unos (resaltada) acompaña al intercepto β₀. Cada fila es un mes y cada columna, una variable.</p>`],
        ["Transpón X",`<div class="mscroll">${mat(TR(X),"X′",{sub:"3×"+n})}</div><p>Las filas de X pasan a ser columnas. Como X′ es 3×${n} y X es ${n}×3, el producto X′X será 3×3.</p>`],
        ["Multiplica X′X",`<div class="mscroll"><div class="mrow">${mat(XtX,"X′X",{sub:"3×3",click:"xtx"})}</div></div><div class="expl" id="ex-xtx">Toca cualquier celda de X′X para ver la cuenta.</div><p>La celda (1, 1) es n = ${n}. El resto de la primera fila son Σx₁ y Σx₂, y la diagonal tiene las sumas de cuadrados. La matriz es simétrica.</p>`],
        ["Invierte X′X",r?`<div class="mscroll"><div class="mrow">${mat(r.inv,"(X′X)⁻¹")}<span class="op">→</span>${mat(MM(XtX,r.inv),"(X′X)(X′X)⁻¹",{sub:"= I"})}</div></div><p>El determinante de X′X es <b>${fm(DET3(XtX))}</b>. Si fuera cero, no habría inversa. Al multiplicar X′X por su inversa sale la identidad, y así se comprueba.</p>`:SING],
        ["Multiplica X′y",`<div class="mscroll"><div class="mrow">${mat(Xty,"X′y",{sub:"3×1",click:"xty"})}</div></div><div class="expl" id="ex-xty">Toca una celda de X′y para ver la cuenta.</div>`],
        ["Obtén β̂ = (X′X)⁻¹X′y",r?`<div class="mscroll"><div class="mrow">${mat(r.inv,"(X′X)⁻¹")}<span class="op">·</span>${mat(Xty,"X′y")}<span class="op">=</span>${mat(colv(r.b),"β̂",{cls:()=>"b1"})}</div></div><div class="eq">ŷ = ${fm(r.b[0])} ${sgn(r.b[1])} ${fm(Math.abs(r.b[1]))}·x₁ ${sgn(r.b[2])} ${fm(Math.abs(r.b[2]))}·x₂</div><p>Con el precio constante, una unidad más de publicidad se asocia con ${fm(Math.abs(r.b[1]))} unidades ${r.b[1]>=0?"más":"menos"} de ventas. Con la publicidad constante, una unidad más de precio se asocia con ${fm(Math.abs(r.b[2]))} unidades ${r.b[2]>=0?"más":"menos"}.</p>`:SING],
        ["Residuos, SCR y errores estándar",s7]];
      let h=st.slice(0,step).map(([t,b],i)=>`<div class="stepc${i>=shown?" fresh":""}"><h4><span class="n">${i+1}</span>${t}</h4>${b}</div>`).join("");
      h+=`<div class="row">${step<7?`<button class="btn solid" type="button" data-act="next">Siguiente paso (${step+1} de 7)</button><button class="btn" type="button" data-act="all">Ver todos</button>`:""}${step>1?`<button class="btn" type="button" data-act="reset">Empezar de nuevo</button>`:""}</div>`;
      v.innerHTML=h;shown=step;
      if(jump){jump=false;const f=v.querySelectorAll(".stepc.fresh");if(f.length)f[0].scrollIntoView({behavior:reduce?"auto":"smooth",block:"nearest"})}
      return}
    if(view==="cols"){
      const segK=`<div class="seg" role="group" aria-label="Partición"><button type="button" data-act="k1" data-val="1" aria-pressed="${k1===1}">X₁ = [1] · X₂ = [x₁ x₂]</button><button type="button" data-act="k1" data-val="2" aria-pressed="${k1===2}">X₁ = [1 x₁] · X₂ = [x₂]</button></div>`;
      const X1=X.map(q=>q.slice(0,k1)),X2=X.map(q=>q.slice(k1)),inv1=INV(MM(TR(X1),X1));
      if(!r||!inv1){v.innerHTML=segK+SING;return}
      const M1=SUB(EYE(n),MM(MM(X1,inv1),TR(X1))),X2t=MM(M1,X2),yt=MM(M1,colv(y)).map(q=>q[0]),A=INV(MM(TR(X2t),X2t));
      if(!A){v.innerHTML=segK+SING;return}
      const b2=MM(A,MM(TR(X2t),colv(yt))).map(q=>q[0]),ok=b2.every((b,i)=>Math.abs(b-r.b[k1+i])<1e-7*(1+Math.abs(b)));
      const blk=(i,j)=>i<k1&&j<k1?"b1":i>=k1&&j>=k1?"b2":"b3",invBlk=r.inv.slice(k1).map(q=>q.slice(k1));
      let sc="";
      if(k1===2){const xs=X2t.map(q=>q[0]),ex=Math.max(...xs.map(Math.abs))*1.2||1,ey=Math.max(...yt.map(Math.abs))*1.2||1;
        const f=frame(600,300,[-ex,ex],[-ey,ey],ticks(-ex,ex,nice(ex/2)),ticks(-ey,ey,nice(ey/2)),"x̃₂: precio sin lo que explica la publicidad","ỹ");
        let b=`<line x1="${f.sx(0)}" x2="${f.sx(0)}" y1="${f.sy(-ey)}" y2="${f.sy(ey)}" stroke="var(--rule)"/>`;
        xs.forEach((x,i)=>b+=`<circle cx="${f.sx(x).toFixed(1)}" cy="${f.sy(yt[i]).toFixed(1)}" r="5" fill="var(--branch)"/>`);
        b+=`<line x1="${f.sx(-ex)}" y1="${f.sy(-ex*b2[0])}" x2="${f.sx(ex)}" y2="${f.sy(ex*b2[0])}" stroke="var(--line)" stroke-width="2.5"/>`;
        sc=`<p>La pendiente de esta nube, sin intercepto, es exactamente β̂₂ = ${fm(b2[0])}. Cada punto es un mes con la publicidad ya descontada.</p><div class="plot"><svg viewBox="0 0 600 300" role="img" aria-label="Residuos de y contra residuos de x2"><defs><clipPath id="cpw"><rect x="46" y="12" width="542" height="252"/></clipPath></defs>${f.g}<g clip-path="url(#cpw)">${b}</g></svg></div>`}
      v.innerHTML=segK+`
      <div class="stepc"><h4><span class="n">1</span>La partición</h4><div class="eq">X = [ X₁ | X₂ ] &nbsp;⇒&nbsp; X′X = [ X₁′X₁ &nbsp; X₁′X₂ ; X₂′X₁ &nbsp; X₂′X₂ ]</div>
        <div class="mscroll"><div class="mrow">${mat(X,"X",{cls:(i,j)=>j<k1?"b1":"b2"})}${mat(XtX,"X′X",{cls:blk})}</div></div>
        <div class="legend"><span><i style="background:var(--line-soft);height:10px"></i>X₁ y su bloque X₁′X₁</span><span><i style="background:var(--branch-soft);height:10px"></i>X₂ y su bloque X₂′X₂</span><span><i style="background:var(--exam-soft);height:10px"></i>Bloques cruzados X₁′X₂ y X₂′X₁</span></div>
        <p>Si los bloques cruzados fueran cero (X₁ y X₂ ortogonales), cada grupo de coeficientes se podría estimar por separado. Como no lo son, hay que limpiar X₂ de lo que comparte con X₁.</p></div>
      <div class="stepc"><h4><span class="n">2</span>Limpiar con M₁</h4><div class="eq">M₁ = I − X₁(X₁′X₁)⁻¹X₁′ &nbsp;&nbsp; X̃₂ = M₁X₂ &nbsp;&nbsp; ỹ = M₁y</div>
        <div class="mscroll"><div class="mrow">${mat(M1,"M₁",{sub:n+"×"+n})}</div></div>
        <div class="mscroll"><div class="mrow">${mat(X2t,"X̃₂ = M₁X₂",{cls:()=>"b2"})}${mat(colv(yt),"ỹ = M₁y")}</div></div>
        <p>${k1===1?"Con X₁ = [1], M₁ solo le resta la media a cada columna. Por eso las fórmulas de la regresión simple se escriben con desviaciones respecto a la media.":"X̃₂ son los residuos de regresar el precio sobre una constante y la publicidad: la parte del precio que la publicidad no explica."} M₁ es simétrica e idempotente (M₁M₁ = M₁).</p></div>
      <div class="stepc"><h4><span class="n">3</span>Mismo resultado por dos caminos</h4><div class="eq">β̂₂ = (X̃₂′X̃₂)⁻¹X̃₂′ỹ</div>
        <div class="mscroll"><div class="mrow">${mat(colv(b2),"β̂₂ por FWL",{cls:()=>"b2"})}<span class="op">=</span>${mat(colv(r.b),"β̂ completo",{cls:i=>i>=k1?"b2":""})}</div></div>
        <p class="${ok?"ok":"bad"}">${ok?"✓ Coinciden: es el teorema de Frisch-Waugh-Lovell.":"No coinciden: revisa los datos."}</p>
        <div class="mscroll"><div class="mrow">${mat(invBlk,"Bloque de X₂ en (X′X)⁻¹")}<span class="op">=</span>${mat(A,"(X̃₂′X̃₂)⁻¹")}</div></div>
        <p>La inversa de una matriz partida cumple que el bloque de X₂ en (X′X)⁻¹ es (X₂′M₁X₂)⁻¹. De ahí sale Var(β̂₂) = σ²(X₂′M₁X₂)⁻¹: cuanto más se parece X₂ a X₁, más pequeño es X₂′M₁X₂ y mayor la varianza.</p>${sc}</div>`;
      return}
    // filas
    rs=Math.max(1,Math.min(rs,n-1));
    if(!$("rsl")||$("rsl").max!==String(n-1))v.innerHTML=`<div class="sim"><div class="ctr"><label for="rsl"><span>Meses en el periodo 1 <output id="o-rsl"></output></span><input type="range" id="rsl" min="1" max="${n-1}" step="1" value="${rs}"></label></div><p>Parte las filas en dos periodos, como en la prueba de Chow. Se necesitan al menos k + 1 = 4 meses en una parte para estimarla sola.</p></div><div id="fv" style="display:flex;flex-direction:column;gap:14px"></div>`;
    $("o-rsl").textContent=rs;
    const Xa=X.slice(0,rs),Xb=X.slice(rs),ya=y.slice(0,rs),yb=y.slice(rs),A1=MM(TR(Xa),Xa),A2=MM(TR(Xb),Xb);
    const ra=rs>k?OLSM(Xa,ya):null,rb=n-rs>k?OLSM(Xb,yb):null,rc=(i)=>i<rs?"b1":"b2";
    const row=(nm,m,res)=>`<tr><td>${nm}</td><td class="num">${m}</td>${res?res.b.map(b=>`<td class="num">${fm(b)}</td>`).join("")+`<td class="num">${fm(res.scr)}</td>`:`<td colspan="4" style="color:var(--muted)">No se puede estimar: ${m} ≤ k</td>`}</tr>`;
    let ch="";
    if(!r)ch=SING;
    else if(ra&&rb){const nr=ra.scr+rb.scr,d2=n-2*k;
      if(nr<1e-12)ch=`<p class="warn"><b>SCR₁ + SCR₂ = 0.</b> Cada periodo se ajusta perfecto; agrega meses o cambia el punto de corte.</p>`;
      else{const F=((r.scr-nr)/k)/(nr/d2),c=fcrit(k,d2),p=fp(F,k,d2);mem.chow={scrR:r.scr,scr1:ra.scr,scr2:rb.scr,n,k};
        ch=`<div class="eq">F = <span class="frac"><span>(${fm(r.scr)} − ${fm(nr)}) / ${k}</span><span>${fm(nr)} / ${d2}</span></span> = ${fm(F)} &nbsp;&nbsp; F crítico 5 % (${k}, ${d2}) = ${fm(c)}</div>
        <div class="verdict ${p<.05?"rej":"acc"}">${p<.05?`Se rechaza H₀ (p = ${pf(p)}): hay evidencia de cambio estructural entre los dos periodos.`:`No se rechaza H₀ (p = ${pf(p)}): no hay evidencia de cambio estructural.`}</div>
        <div class="row"><button class="btn solid" type="button" data-act="calc">Ver el procedimiento en la calculadora →</button></div>`}}
    else if(r&&(ra||rb)){const big=ra?{res:ra,m:rs}:{res:rb,m:n-rs},ns=n-big.m,d2=big.m-k;
      if(big.res.scr<1e-12)ch=`<p class="warn"><b>La parte grande se ajusta perfecto</b> (SCR = 0); agrega meses.</p>`;
      else{const F=((r.scr-big.res.scr)/ns)/(big.res.scr/d2),c=fcrit(ns,d2),p=fp(F,ns,d2);
        ch=`<p>Una parte tiene solo ${ns} ${ns===1?"mes":"meses"}, menos de los k + 1 = 4 necesarios para estimarla sola. Se usa la <b>Chow predictiva</b>:</p><div class="eq">F = <span class="frac"><span>(SCR<sub>R</sub> − SCR<sub>grande</sub>) / n<sub>pequeña</sub></span><span>SCR<sub>grande</sub> / (n<sub>grande</sub> − k)</span></span> = <span class="frac"><span>(${fm(r.scr)} − ${fm(big.res.scr)}) / ${ns}</span><span>${fm(big.res.scr)} / ${d2}</span></span> = ${fm(F)}</div><div class="verdict ${p<.05?"rej":"acc"}">F crítico 5 % (${ns}, ${d2}) = ${fm(c)}. ${p<.05?"Se rechaza H₀: los meses de la parte pequeña no se ajustan a la relación de la grande.":"No se rechaza H₀: la parte pequeña es compatible con la relación estimada en la grande."}</div>`}}
    else ch=`<p class="warn"><b>Ninguna parte tiene suficientes meses.</b> Con k = 3 parámetros cada periodo necesita al menos 4 observaciones para estimarse solo.</p>`;
    $("fv").innerHTML=`<div class="stepc"><h4><span class="n">1</span>Partir por filas</h4><div class="eq">X = [ X⁽¹⁾ ; X⁽²⁾ ] &nbsp;&nbsp; y = [ y⁽¹⁾ ; y⁽²⁾ ]</div>
      <div class="mscroll"><div class="mrow">${mat(X,"X",{cls:rc})}${mat(colv(y),"y",{cls:rc})}</div></div></div>
    <div class="stepc"><h4><span class="n">2</span>X′X es la suma de los dos periodos</h4><div class="eq">X′X = X⁽¹⁾′X⁽¹⁾ + X⁽²⁾′X⁽²⁾</div>
      <div class="mscroll"><div class="mrow">${mat(A1,"X⁽¹⁾′X⁽¹⁾",{cls:()=>"b1"})}<span class="op">+</span>${mat(A2,"X⁽²⁾′X⁽²⁾",{cls:()=>"b2"})}<span class="op">=</span>${mat(XtX,"X′X")}</div></div>
      <p>Partir por filas no cambia X′X: lo descompone en la información de cada periodo. Lo mismo ocurre con X′y. El modelo restringido usa la suma (un solo β̂); el no restringido usa cada parte por separado (un β̂ por periodo).</p></div>
    <div class="stepc"><h4><span class="n">3</span>Tres regresiones y la prueba de Chow</h4>
      <div class="tbl"><table><tr><th>Modelo</th><th>n</th><th>β̂₀</th><th>β̂₁</th><th>β̂₂</th><th>SCR</th></tr>${row("Toda la muestra (restringido)",n,r)}${row("Periodo 1",rs,ra)}${row("Periodo 2",n-rs,rb)}</table></div>${ch}</div>`;
  }
};

// ---------- Taller 2: geometría de MCO ----------
SIMS.wsGeo=function(){
  const ws=$("ws");
  ws.innerHTML=`<div class="sim">
    <canvas class="c3" id="c3" role="img" aria-label="Vista 3D: proyección del vector y sobre el plano de las columnas de X"></canvas>
    <div class="row"><span class="hint">Arrastra para girar · rueda para acercar</span><button class="btn" type="button" id="rot">Girar solo</button><button class="btn solid" type="button" id="edge">Ver el ángulo recto</button></div>
    <div class="legend"><span><i style="background:var(--ink)"></i>y (datos)</span><span><i style="background:var(--line)"></i>ŷ = Py</span><span><i style="background:var(--bad)"></i>û = y − ŷ</span><span><i style="background:var(--muted)"></i>columna de unos</span><span><i style="background:var(--branch)"></i>columna x</span><span><i style="background:var(--line-soft);height:10px"></i>plano de X</span></div>
    <p>Datos: y = (y₁, y₂, y₃) y la regresora x = (x₁, x₂, x₃). Si las tres x son iguales, x es proporcional al vector de unos y el plano colapsa en una recta.</p>
    <div class="ctr">${slider("gy1","y₁",0,6,0.25,2)}${slider("gy2","y₂",0,6,0.25,5)}${slider("gy3","y₃",0,6,0.25,3.5)}${slider("gx1","x₁",0,6,0.25,1)}${slider("gx2","x₂",0,6,0.25,2)}${slider("gx3","x₃",0,6,0.25,4)}</div>
    <div class="verdict rej" id="gver" hidden></div>
    <div class="res" id="res"></div></div>
  <div class="stepc"><h4>Las matrices de proyección</h4><div class="eq">P = X(X′X)⁻¹X′ &nbsp;&nbsp; ŷ = Py &nbsp;&nbsp; M = I − P &nbsp;&nbsp; û = My</div><div class="mscroll"><div class="mrow" id="gpm"></div></div><div id="gchk"></div></div>
  <div class="stepc"><h4>Cómo leer el dibujo</h4><p>Cada eje es una observación, así que un punto del espacio es una columna completa de datos. Toda combinación β₀·1 + β₁·x vive en el plano azul. MCO elige la combinación más cercana a y, y esa es ŷ. La distancia más corta de un punto a un plano es la perpendicular, por eso û forma un ángulo recto con el plano. Esa perpendicularidad es la condición X′û = 0 de las ecuaciones normales, y ‖û‖² es la SCR.</p></div>`;
  const sc=Scene3D($("c3"));sc.center=[.35,.35,.35];rotBtn(sc);
  const ids=["gy1","gy2","gy3","gx1","gx2","gx3"];ids.forEach(i=>$(i).addEventListener("input",upd));
  let dir=null;$("edge").onclick=()=>{if(dir)sc.tween(dir)};
  const dot=(a,c)=>a[0]*c[0]+a[1]*c[1]+a[2]*c[2],scl=(a,s)=>a.map(v=>v*s),add=(a,c)=>a.map((v,i)=>v+c[i]),sub=(a,c)=>a.map((v,i)=>v-c[i]),nrm=a=>Math.hypot(...a),unit=a=>scl(a,1/(nrm(a)||1)),cross=(a,c)=>[a[1]*c[2]-a[2]*c[1],a[2]*c[0]-a[0]*c[2],a[0]*c[1]-a[1]*c[0]];
  const vec=a=>`(${a.map(fm).join("; ")})`;
  upd();
  function upd(){
    const g=ids.map(i=>+$(i).value);ids.forEach((i,j)=>$("o-"+i).textContent=fmt(g[j],2));
    const y=g.slice(0,3),x=g.slice(3),one=[1,1,1],X=[[1,x[0]],[1,x[1]],[1,x[2]]],inv=INV(MM(TR(X),X));
    const S=Math.max(nrm(y),nrm(x),nrm(one))/1.1,w=a=>scl(a,1/S),items=[];
    [[1.3,0,0],[0,1.3,0],[0,0,1.3]].forEach((a,i)=>{items.push({type:"ln",a:[0,0,0],b:a,c:"--muted",w:1,op:.55,bias:120});items.push(txt(scl(a,1.1),"obs "+(i+1)))});
    const ON=w(one),XX=w(x),Y=w(y);
    items.push({type:"arr",a:[0,0,0],b:ON,c:"--muted",w:2},txt(scl(ON,1.12),"1",{c:"--muted",s:13,bold:1}),{type:"arr",a:[0,0,0],b:XX,c:"--branch",w:2},txt(scl(XX,1.1),"x",{c:"--branch",s:13,bold:1}),{type:"arr",a:[0,0,0],b:Y,c:"--ink",w:2.8},txt(scl(Y,1.08),"y",{c:"--ink",s:14,bold:1}));
    if(!inv){$("gver").hidden=false;$("gver").textContent="Las dos columnas de X son colineales: generan una recta, no un plano. X′X no tiene inversa y MCO no puede separar β₀ de β₁ (multicolinealidad perfecta).";
      items.push({type:"ln",a:scl(unit(one),-1.2),b:scl(unit(one),1.6),c:"--line",w:3,op:.35,bias:100});sc.set(items);$("res").innerHTML="";$("gpm").innerHTML="";$("gchk").innerHTML="";dir=null;return}
    $("gver").hidden=true;
    const b=MM(inv,MM(TR(X),colv(y))).map(q=>q[0]),yh=X.map(q=>q[0]*b[0]+q[1]*b[1]),u=sub(y,yh),YH=w(yh);
    const u1=unit(one),u2=unit(sub(x,scl(u1,dot(x,u1)))),R=1.2,cr=(s,t)=>add(scl(u1,s*R),scl(u2,t*R));
    items.push({type:"poly",pts:[cr(-1,-1),cr(1,-1),cr(1,1),cr(-1,1)],c:"--line",op:.11,bias:100});
    for(let t=-1;t<=1.001;t+=1/3){items.push({type:"ln",a:cr(-1,t),b:cr(1,t),c:"--line",op:.3,w:.8,bias:90},{type:"ln",a:cr(t,-1),b:cr(t,1),c:"--line",op:.3,w:.8,bias:90})}
    items.push({type:"arr",a:[0,0,0],b:YH,c:"--line",w:2.8},txt(add(YH,scl(unit(YH),.1)),"ŷ",{c:"--line",s:14,bold:1}));
    if(nrm(u)>1e-6){items.push({type:"arr",a:YH,b:Y,c:"--bad",w:2.2},txt(add(YH,scl(sub(Y,YH),.5)),"û",{c:"--bad",s:14,bold:1,dx:12}));
      if(nrm(yh)>1e-6){const e1=scl(unit(sub(Y,YH)),.07),e2=scl(unit(YH),-.07);items.push({type:"ln",a:add(YH,e1),b:add(add(YH,e1),e2),c:"--bad",w:1.3},{type:"ln",a:add(add(YH,e1),e2),b:add(YH,e2),c:"--bad",w:1.3})}}
    sc.set(items);
    const nv=cross(u1,u2);dir=nrm(yh)>1e-6?unit(cross(nv,unit(yh))):u2;
    const Pm=MM(MM(X,inv),TR(X)),Mm=SUB(EYE(3),Pm),xu=MM(TR(X),colv(u)).map(q=>q[0]),ny=dot(y,y),nh=dot(yh,yh),nu=dot(u,u);
    $("res").innerHTML=[["β̂₀",fm(b[0])],["β̂₁",fm(b[1])],["ŷ",vec(yh)],["û",vec(u)],["SCR = ‖û‖²",fm(nu)]].map(([s,v])=>`<div><small>${s}</small><b>${v}</b></div>`).join("");
    $("gpm").innerHTML=mat(Pm,"P",{cls:()=>"b1"})+mat(Mm,"M = I − P",{cls:()=>"b3"});
    $("gchk").innerHTML=`<div class="res"><div><small>X′û</small><b>${vec(xu)}</b></div><div><small>traza(P)</small><b>${fm(Pm[0][0]+Pm[1][1]+Pm[2][2])}</b></div><div><small>‖y‖²</small><b>${fm(ny)}</b></div><div><small>‖ŷ‖² + ‖û‖²</small><b>${fm(nh)} + ${fm(nu)}</b></div></div><p>X′û = 0: el residuo es perpendicular a las dos columnas de X. La traza de P es 2, el número de parámetros. Y se cumple Pitágoras: ‖y‖² = ‖ŷ‖² + ‖û‖². P y M son simétricas e idempotentes: proyectar dos veces es lo mismo que proyectar una.</p>`;
  }
};

// ---------- Taller 3: plano de regresión y superficie de la SCR ----------
SIMS.wsPlane=function(){
  let seed=11,view="plano";const ws=$("ws");
  ws.innerHTML=`<div class="sim">
    <div class="seg" role="group" aria-label="Vista" id="pv"><button type="button" data-pv="plano" aria-pressed="true">Datos y plano</button><button type="button" data-pv="scr" aria-pressed="false">Superficie de la SCR</button></div>
    <canvas class="c3" id="c3" role="img" aria-label="Vista 3D del plano de regresión o de la superficie de la SCR"></canvas>
    <div class="row"><span class="hint">Arrastra para girar · rueda para acercar</span><button class="btn" type="button" id="rot">Girar solo</button><button class="btn" type="button" id="pnew">Nueva muestra</button></div>
    <div class="legend" id="plg"></div>
    <p>50 observaciones simuladas con y = 2 + β₁x₁ + β₂x₂ + u.</p>
    <div class="ctr">${slider("pb1","β₁ verdadero",-2,3,0.1,1.5)}${slider("pb2","β₂ verdadero",-2,3,0.1,-1)}${slider("prho","Correlación entre x₁ y x₂ (ρ)",0,0.98,0.02,0.3)}${slider("psg","Ruido (σ)",0.5,6,0.25,2)}</div>
    <div class="res" id="res"></div></div><p class="link" id="pnote"></p>`;
  const sc=Scene3D($("c3"));rotBtn(sc);
  let Z1,Z2,E;const gen=()=>{const R=rng(seed);Z1=normals(R,50);Z2=normals(R,50);E=normals(R,50)};gen();
  ["pb1","pb2","prho","psg"].forEach(i=>$(i).addEventListener("input",upd));
  $("pnew").onclick=()=>{seed++;gen();upd()};
  $("pv").onclick=e=>{const b=e.target.closest("[data-pv]");if(!b)return;view=b.dataset.pv;$("pv").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));sc.tween(view==="scr"?[.64,.64,-.42]:[-.69,.6,-.41]);upd()};
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
  upd();
  function upd(){
    const B1=+$("pb1").value,B2=+$("pb2").value,rho=+$("prho").value,sg=+$("psg").value;
    $("o-pb1").textContent=fmt(B1,1);$("o-pb2").textContent=fmt(B2,1);$("o-prho").textContent=fmt(rho,2);$("o-psg").textContent=fmt(sg,2);
    const n=50,x1=Z1.map(z=>5+2*z),x2=Z1.map((z,i)=>5+2*(rho*z+Math.sqrt(1-rho*rho)*Z2[i])),y=x1.map((v,i)=>2+B1*v+B2*x2[i]+sg*E[i]);
    const X=x1.map((v,i)=>[1,v,x2[i]]),r=OLSM(X,y),s2=r.scr/(n-3),ee=[1,2].map(j=>Math.sqrt(s2*r.inv[j][j]));
    const m1=mean(x1),m2=mean(x2),my=mean(y);let S11=0,S22=0,S12=0,S1y=0,S2y=0,Syy=0;
    for(let i=0;i<n;i++){const a=x1[i]-m1,b=x2[i]-m2,c=y[i]-my;S11+=a*a;S22+=b*b;S12+=a*b;S1y+=a*c;S2y+=b*c;Syy+=c*c}
    const rr=S12/Math.sqrt(S11*S22),items=boxItems();
    if(view==="plano"){
      $("plg").innerHTML=`<span><i style="background:var(--line)"></i>Punto sobre el plano (û &gt; 0)</span><span><i style="background:var(--branch)"></i>Punto bajo el plano (û &lt; 0)</span><span><i style="background:var(--muted);height:1px"></i>Residuo</span>`;
      $("pnote").textContent="Sube ρ cerca de 0,95 y presiona «Nueva muestra» varias veces. Con multicolinealidad el plano cambia de inclinación en cada muestra, aunque el modelo verdadero sea el mismo: eso son errores estándar grandes vistos en 3D.";
      const ext=a=>{const lo=Math.min(...a),hi=Math.max(...a),p=(hi-lo)*.06||1;return[lo-p,hi+p]};
      const[a1,c1]=ext(x1),[a2,c2]=ext(x2),pz=(u,v)=>r.b[0]+r.b[1]*u+r.b[2]*v;
      const[ay,cy]=ext(y.concat([[a1,a2],[c1,a2],[c1,c2],[a1,c2]].map(([u,v])=>pz(u,v))));
      const N=(v,a,c)=>-1+2*(v-a)/(c-a),Wp=(u,v,z)=>[N(u,a1,c1),N(v,a2,c2),N(z,ay,cy)];
      items.push({type:"poly",pts:[[a1,a2],[c1,a2],[c1,c2],[a1,c2]].map(([u,v])=>Wp(u,v,pz(u,v))),c:"--line",op:.16,bias:60});
      for(let t=0;t<=6;t++){const u=a1+(c1-a1)*t/6,v=a2+(c2-a2)*t/6;items.push({type:"ln",a:Wp(u,a2,pz(u,a2)),b:Wp(u,c2,pz(u,c2)),c:"--line",op:.32,w:.8,bias:55},{type:"ln",a:Wp(a1,v,pz(a1,v)),b:Wp(c1,v,pz(c1,v)),c:"--line",op:.32,w:.8,bias:55})}
      for(let i=0;i<n;i++){const p=Wp(x1[i],x2[i],y[i]),q=Wp(x1[i],x2[i],r.yh[i]);items.push({type:"ln",a:p,b:q,c:"--muted",op:.55,w:1},{type:"pt",p,r:3.6,c:r.u[i]>0?"--line":"--branch"})}
      items.push(txt([0,-1.3,-1],"x₁",{s:13,c:"--ink",bold:1}),txt([1.3,0,-1],"x₂",{s:13,c:"--ink",bold:1}),txt([-1,-1,1.2],"y",{s:13,c:"--ink",bold:1}),
        txt([-1,-1.15,-1.08],fmt(a1,1)),txt([1,-1.15,-1.08],fmt(c1,1)),txt([1.15,-1,-1.08],fmt(a2,1)),txt([1.15,1,-1.08],fmt(c2,1)),txt([-1.12,-1.12,-1],fmt(ay,1)),txt([-1.12,-1.12,1],fmt(cy,1)));
    }else{
      $("plg").innerHTML=`<span><i style="background:var(--line)"></i>SCR baja</span><span><i style="background:var(--branch)"></i>SCR alta</span><span><i style="background:var(--ink);height:9px;width:9px;border-radius:50%"></i>Mínimo: β̂ de MCO</span><span><i style="background:var(--good);height:9px;width:9px;border-radius:50%"></i>Valor verdadero</span>`;
      $("pnote").textContent="Con ρ cerca de 0 la superficie es un tazón con un mínimo claro. Con ρ alto se vuelve un valle alargado: muchas combinaciones de β₁ y β₂ dan casi la misma SCR, y por eso los errores estándar crecen. Para cada par (β₁, β₂) se usa el β₀ óptimo.";
      const f=(u,v)=>Syy-2*u*S1y-2*v*S2y+u*u*S11+2*u*v*S12+v*v*S22,Wd=2,G=22,u0=r.b[1]-Wd,v0=r.b[2]-Wd,h=2*Wd/G;
      const grid=[];let mx=-Infinity;for(let i=0;i<=G;i++){grid.push([]);for(let j=0;j<=G;j++){const z=f(u0+i*h,v0+j*h);grid[i].push(z);mx=Math.max(mx,z)}}
      const mn=r.scr,Z=z=>-1+2*(z-mn)/(mx-mn),Nu=u=>-1+2*(u-u0)/(2*Wd),Nv=v=>-1+2*(v-v0)/(2*Wd);
      for(let i=0;i<G;i++)for(let j=0;j<G;j++){const zs=[grid[i][j],grid[i+1][j],grid[i+1][j+1],grid[i][j+1]],t=(zs.reduce((a,b)=>a+b)/4-mn)/(mx-mn);
        items.push({type:"poly",pts:[[Nu(u0+i*h),Nv(v0+j*h),Z(zs[0])],[Nu(u0+(i+1)*h),Nv(v0+j*h),Z(zs[1])],[Nu(u0+(i+1)*h),Nv(v0+(j+1)*h),Z(zs[2])],[Nu(u0+i*h),Nv(v0+(j+1)*h),Z(zs[3])]],mix:Math.sqrt(t),op:.93,stroke:"--card",sa:.45})}
      items.push({type:"pt",p:[0,0,-1],r:5.5,c:"--ink",bias:-30},txt([0,0,-1],"β̂",{c:"--ink",s:13,bold:1,dy:-14,bias:-70}));
      if(Math.abs(B1-r.b[1])<Wd&&Math.abs(B2-r.b[2])<Wd)items.push({type:"pt",p:[Nu(B1),Nv(B2),Z(f(B1,B2))],r:5.5,c:"--good",bias:-30});
      items.push(txt([0,-1.3,-1],"β₁",{s:13,c:"--ink",bold:1}),txt([1.3,0,-1],"β₂",{s:13,c:"--ink",bold:1}),txt([-1,-1,1.2],"SCR",{s:13,c:"--ink",bold:1}),
        txt([-1,-1.15,-1.08],fmt(u0,1)),txt([1,-1.15,-1.08],fmt(u0+2*Wd,1)),txt([1.15,-1,-1.08],fmt(v0,1)),txt([1.15,1,-1.08],fmt(v0+2*Wd,1)));
    }
    sc.set(items);
    $("res").innerHTML=[["β̂₁ (ee)",`${fmt(r.b[1],2)} (${fmt(ee[0],2)})`],["β̂₂ (ee)",`${fmt(r.b[2],2)} (${fmt(ee[1],2)})`],["Corr(x₁, x₂)",fmt(rr,3)],["VIF",fmt(1/(1-rr*rr),2)],["R²",fmt(1-r.scr/Syy,3)],["SCR",fmt(r.scr,1)]].map(([s,v])=>`<div><small>${s}</small><b>${v}</b></div>`).join("");
  }
};

// ---------- Taller 4: calculadora de pruebas ----------
function gammq(a,x){if(x<=0)return 1;const lg=-x+a*Math.log(x)-gln(a);
  if(x<a+1){let ap=a,sum=1/a,del=sum;for(let i=0;i<600;i++){ap++;del*=x/ap;sum+=del;if(Math.abs(del)<Math.abs(sum)*1e-14)break}return Math.max(0,1-sum*Math.exp(lg))}
  let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<600;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-14)break}return Math.exp(lg)*h}
const chip=(x,k)=>gammq(k/2,x/2);
function chicrit(k,al){let lo=0,hi=500;for(let i=0;i<100;i++){const m=(lo+hi)/2;chip(m,k)>al?lo=m:hi=m}return(lo+hi)/2}
function distChart(kind,d1,d2,stat,crit){
  const lB=kind==="F"?gln(d1/2)+gln(d2/2)-gln((d1+d2)/2):0;
  const pdf=kind==="F"?x=>x<=0?0:Math.exp((d1/2)*Math.log(d1/d2)+(d1/2-1)*Math.log(x)-((d1+d2)/2)*Math.log(1+d1*x/d2)-lB):x=>x<=0?0:Math.exp((d1/2-1)*Math.log(x)-x/2-(d1/2)*Math.log(2)-gln(d1/2));
  const base=kind==="F"?Math.max(4,crit*1.6):Math.max(d1+4*Math.sqrt(2*d1),crit*1.5),xmax=Math.max(base,Math.min(stat*1.15,base*4));
  const xs=[],ys=[];for(let i=0;i<=240;i++){const x=xmax*i/240;xs.push(x);ys.push(pdf(x))}
  let ym=0;xs.forEach((x,i)=>{if(x>=xmax*.04&&isFinite(ys[i]))ym=Math.max(ym,ys[i])});ym=ym*1.25||1;
  const f=frame(600,220,[0,xmax],[0,ym],ticks(0,xmax,nice(xmax/5)),[],kind==="F"?"F":"χ²",""),cy=v=>f.sy(Math.min(isFinite(v)?v:ym,ym));
  const path=xs.map((x,i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+cy(ys[i]).toFixed(1)).join("");
  const ax=xs.map((x,i)=>[x,ys[i]]).filter(([x])=>x>=crit);
  const area=ax.length?`M${f.sx(crit)},${f.sy(0)}L${f.sx(crit)},${cy(pdf(crit))}`+ax.map(([x,y])=>`L${f.sx(x).toFixed(1)},${cy(y).toFixed(1)}`).join("")+`L${f.sx(xmax)},${f.sy(0)}Z`:"";
  const xc=f.sx(crit),xsx=f.sx(Math.min(stat,xmax)),top=f.sy(ym),anc=x=>x>430?"end":"start",off=x=>x>430?-6:6;
  return `<div class="plot"><svg viewBox="0 0 600 220" role="img" aria-label="Distribución con región de rechazo y valor del estadístico">${f.g}
    <line x1="46" x2="588" y1="${f.sy(0)}" y2="${f.sy(0)}" stroke="var(--muted)"/>
    <path d="${area}" fill="var(--bad)" fill-opacity=".22"/><path d="${path}" fill="none" stroke="var(--ink)" stroke-width="2"/>
    <line x1="${xc}" x2="${xc}" y1="${top}" y2="${f.sy(0)}" stroke="var(--bad)" stroke-dasharray="5 4" stroke-width="1.5"/>
    <text x="${xc+off(xc)}" y="${top+12}" font-size="11.5" text-anchor="${anc(xc)}" fill="var(--bad)">crítico ${fm(crit)}</text>
    <line x1="${xsx}" x2="${xsx}" y1="${top+18}" y2="${f.sy(0)}" stroke="var(--line)" stroke-width="2.5"/>
    <text x="${xsx+off(xsx)}" y="${top+32}" font-size="11.5" font-weight="600" text-anchor="${anc(xsx)}" fill="var(--line)">${kind==="F"?"F":"LM"} = ${fm(stat)}${stat>xmax?" (fuera de escala)":""}</text>
    <text x="${f.sx(xmax)-4}" y="${f.sy(0)-8}" font-size="11" text-anchor="end" fill="var(--bad)">región de rechazo</text></svg></div>`}
function dwGauge(d,dl,du){const W=600,L=16,R=16,sx=v=>L+Math.max(0,Math.min(4,v))/4*(W-L-R);
  const z=[[0,dl,"--bad","Autocorrelación +"],[dl,du,"--branch","Inconclusa"],[du,4-du,"--good","Sin autocorrelación"],[4-du,4-dl,"--branch","Inconclusa"],[4-dl,4,"--bad","Autocorrelación −"]];
  let b=z.map(([a,c,col,t])=>`<rect x="${sx(a)}" y="34" width="${sx(c)-sx(a)}" height="24" fill="var(${col})" fill-opacity=".3"/>${sx(c)-sx(a)>90?`<text x="${(sx(a)+sx(c))/2}" y="50" text-anchor="middle" font-size="11" fill="var(--ink)">${t}</text>`:""}`).join("");
  [[0,"0"],[dl,"d_L"],[du,"d_U"],[2,"2"],[4-du,"4 − d_U"],[4-dl,"4 − d_L"],[4,"4"]].forEach(([v,t],i)=>b+=`<text x="${sx(v)}" y="${i%2?78:90}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${t}</text>`);
  b+=`<line x1="${sx(d)}" x2="${sx(d)}" y1="24" y2="64" stroke="var(--ink)" stroke-width="2.5"/><circle cx="${sx(d)}" cy="24" r="5" fill="var(--ink)"/><text x="${sx(d)}" y="14" text-anchor="${sx(d)>500?"end":sx(d)<100?"start":"middle"}" font-size="12" font-weight="600" fill="var(--ink)">d = ${fm(d)}</text>`;
  return `<div class="plot"><svg viewBox="0 0 600 96" role="img" aria-label="Zonas de decisión de Durbin-Watson">${b}</svg></div>`}
SIMS.wsCalc=function(){
  const ws=$("ws");
  const TABS={
    chow:{t:"Chow",f:[["scrR","SCR restringida (toda la muestra)",420],["scr1","SCR₁ (submuestra 1)",120],["scr2","SCR₂ (submuestra 2)",150],["n","n total",30],["k","k (parámetros con intercepto)",2]]},
    f:{t:"F general",f:[["scrR","SCR restringida",1250],["scrNR","SCR no restringida",980],["q","q (restricciones)",2],["n","n",60],["k","k (parámetros del no restringido)",4]]},
    vr:{t:"Varianzas iguales",f:[["scr1","SCR₁",120],["n1","n₁",15],["scr2","SCR₂",150],["n2","n₂",15],["k","k (parámetros)",2]]},
    bp:{t:"Breusch-Pagan",f:[["n","n",100],["r2","R² de la regresión auxiliar",0.08],["p","Regresoras en la auxiliar",3]]},
    dw:{t:"Durbin-Watson",f:[["d","Estadístico d",0.6],["dl","d_L (de la tabla)",1.35],["du","d_U (de la tabla)",1.49]]}};
  const vals={};Object.entries(TABS).forEach(([k,o])=>{vals[k]={};o.f.forEach(([id,,v])=>vals[k][id]=v)});
  let tab="chow",al=0.05;
  if(CALC_PREFILL){Object.assign(vals.chow,CALC_PREFILL);CALC_PREFILL=null}
  ws.innerHTML=`<div class="seg" role="group" aria-label="Prueba" id="ctab">${Object.entries(TABS).map(([k,o])=>`<button type="button" data-ct="${k}" aria-pressed="${k===tab}">${o.t}</button>`).join("")}</div>
    <div class="sim"><div class="calcf" id="cf"></div></div><div id="cout" style="display:flex;flex-direction:column;gap:12px"></div>`;
  const shown=v=>String(+(+v).toFixed(6)).replace(".",",");
  const fields=()=>{$("cf").innerHTML=TABS[tab].f.map(([id,lab])=>`<label for="c-${id}">${lab}<input type="text" inputmode="decimal" id="c-${id}" data-f="${id}" value="${shown(vals[tab][id])}"></label>`).join("")+(tab!=="dw"?`<label for="c-al">Nivel de significancia α<select id="c-al"><option value="0.01">1 %</option><option value="0.05">5 %</option><option value="0.1">10 %</option></select></label>`:"");if($("c-al"))$("c-al").value=String(al)};
  const onIn=e=>{if(e.target.id==="c-al"){al=+e.target.value;out();return}if(!e.target.dataset.f)return;const v=parseFloat(e.target.value.replace(",","."));if(!isFinite(v)){e.target.style.borderColor="var(--bad)";return}e.target.style.borderColor="";vals[tab][e.target.dataset.f]=v;out()};
  $("cf").addEventListener("input",onIn);$("cf").addEventListener("change",onIn);
  $("ctab").onclick=e=>{const b=e.target.closest("[data-ct]");if(!b)return;tab=b.dataset.ct;$("ctab").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x===b));fields();out()};
  const err=m=>`<p class="warn"><b>Revisa los datos:</b> ${m}</p>`,verd=(rej,a,b)=>`<div class="verdict ${rej?"rej":"acc"}">${rej?a:b}</div>`,ap=()=>fmt(al*100,0)+" %";
  const stp=(i,t,b)=>`<div class="stepc"><h4><span class="n">${i}</span>${t}</h4>${b}</div>`;
  const RUN={
    chow:v=>{const{scrR,scr1,scr2,n,k}=v,nr=scr1+scr2,d2=n-2*k;
      if(!(k>=1)||!Number.isInteger(k))return err("k debe ser un entero positivo.");
      if(d2<=0)return err(`n − 2k = ${fm(d2)}. Debe ser positivo: cada submuestra necesita más observaciones que parámetros.`);
      if(nr<=0)return err("SCR₁ + SCR₂ debe ser positiva.");
      if(scrR<nr)return err("la SCR restringida no puede ser menor que SCR₁ + SCR₂, porque el modelo restringido nunca ajusta mejor.");
      const F=((scrR-nr)/k)/(nr/d2),c=fcrit(k,d2,al),p=fp(F,k,d2);
      return stp(1,"Hipótesis",`<div class="eq">H₀: los ${fm(k)} coeficientes son iguales en ambas submuestras &nbsp;&nbsp; H₁: al menos uno cambia</div>`)+
        stp(2,"SCR del modelo no restringido",`<div class="eq">SCR<sub>NR</sub> = SCR₁ + SCR₂ = ${fm(scr1)} + ${fm(scr2)} = ${fm(nr)}</div>`)+
        stp(3,"Estadístico F",`<div class="eq">F = <span class="frac"><span>(SCR<sub>R</sub> − SCR<sub>NR</sub>) / k</span><span>SCR<sub>NR</sub> / (n − 2k)</span></span> = <span class="frac"><span>(${fm(scrR)} − ${fm(nr)}) / ${fm(k)}</span><span>${fm(nr)} / (${fm(n)} − 2·${fm(k)})</span></span> = <span class="frac"><span>${fm((scrR-nr)/k)}</span><span>${fm(nr/d2)}</span></span> = ${fm(F)}</div>`)+
        stp(4,"Decisión",`<div class="eq">F crítico: F<sub>${ap()}</sub>(${fm(k)}, ${fm(d2)}) = ${fm(c)} &nbsp;&nbsp; p-valor = ${pf(p)}</div>${distChart("F",k,d2,F,c)}${verd(F>c,`F = ${fm(F)} &gt; ${fm(c)}: se rechaza H₀ al ${ap()}. Hay evidencia de cambio estructural.`,`F = ${fm(F)} ≤ ${fm(c)}: no se rechaza H₀ al ${ap()}. No hay evidencia de cambio estructural.`)}`)},
    f:v=>{const{scrR,scrNR,q,n,k}=v,d2=n-k;
      if(!(q>=1)||!Number.isInteger(q))return err("q debe ser un entero positivo.");
      if(d2<=0)return err("n − k debe ser positivo.");
      if(scrNR<=0||scrR<scrNR)return err("la SCR restringida debe ser mayor o igual que la no restringida, y esta, positiva.");
      const F=((scrR-scrNR)/q)/(scrNR/d2),c=fcrit(q,d2,al),p=fp(F,q,d2);
      return stp(1,"Estadístico F",`<div class="eq">F = <span class="frac"><span>(SCR<sub>R</sub> − SCR<sub>NR</sub>) / q</span><span>SCR<sub>NR</sub> / (n − k)</span></span> = <span class="frac"><span>(${fm(scrR)} − ${fm(scrNR)}) / ${fm(q)}</span><span>${fm(scrNR)} / ${fm(d2)}</span></span> = ${fm(F)}</div>`)+
        stp(2,"Decisión",`<div class="eq">F crítico: F<sub>${ap()}</sub>(${fm(q)}, ${fm(d2)}) = ${fm(c)} &nbsp;&nbsp; p-valor = ${pf(p)}</div>${distChart("F",q,d2,F,c)}${verd(F>c,`Se rechaza H₀ al ${ap()}: las ${fm(q)} restricciones no son compatibles con los datos.`,`No se rechaza H₀ al ${ap()}: las restricciones son compatibles con los datos.`)}`)},
    vr:v=>{const{scr1,n1,scr2,n2,k}=v,d1=n1-k,d2=n2-k;
      if(d1<=0||d2<=0)return err("cada submuestra necesita más observaciones que parámetros.");
      if(scr1<=0||scr2<=0)return err("las SCR deben ser positivas.");
      const s1=scr1/d1,s2=scr2/d2,big=s1>=s2,F=big?s1/s2:s2/s1,a=big?d1:d2,b=big?d2:d1,c=fcrit(a,b,al),p=fp(F,a,b);
      return stp(1,"Varianza estimada en cada submuestra",`<div class="eq">σ̂₁² = <span class="frac"><span>${fm(scr1)}</span><span>${fm(n1)} − ${fm(k)}</span></span> = ${fm(s1)} &nbsp;&nbsp; σ̂₂² = <span class="frac"><span>${fm(scr2)}</span><span>${fm(n2)} − ${fm(k)}</span></span> = ${fm(s2)}</div>`)+
        stp(2,"Estadístico F (la mayor arriba)",`<div class="eq">F = <span class="frac"><span>${fm(big?s1:s2)}</span><span>${fm(big?s2:s1)}</span></span> = ${fm(F)} &nbsp;&nbsp; gl = (${fm(a)}, ${fm(b)})</div>`)+
        stp(3,"Decisión",`<div class="eq">F crítico: F<sub>${ap()}</sub>(${fm(a)}, ${fm(b)}) = ${fm(c)} &nbsp;&nbsp; p-valor = ${pf(p)}</div>${distChart("F",a,b,F,c)}${verd(F>c,"Las varianzas son distintas. La prueba de Chow pierde validez: conviene una versión robusta.","Las varianzas son compatibles. Se puede aplicar la prueba de Chow.")}`)},
    bp:v=>{const{n,r2,p:q}=v;
      if(!(q>=1)||!Number.isInteger(q))return err("el número de regresoras debe ser un entero positivo.");
      if(r2<0||r2>1)return err("el R² debe estar entre 0 y 1.");
      const LM=n*r2,c=chicrit(q,al),p=chip(LM,q);
      return stp(1,"Estadístico LM",`<div class="eq">LM = n·R²<sub>aux</sub> = ${fm(n)} · ${fm(r2)} = ${fm(LM)} &nbsp;~&nbsp; χ²(${fm(q)})</div>`)+
        stp(2,"Decisión",`<div class="eq">Valor crítico: χ²<sub>${ap()}</sub>(${fm(q)}) = ${fm(c)} &nbsp;&nbsp; p-valor = ${pf(p)}</div>${distChart("chi",q,0,LM,c)}${verd(LM>c,`Se rechaza la homocedasticidad al ${ap()}. Usa errores estándar robustos o MCP.`,`No se rechaza la homocedasticidad al ${ap()}.`)}`)},
    dw:v=>{const{d,dl,du}=v;
      if(d<0||d>4)return err("d debe estar entre 0 y 4.");
      if(!(dl>0&&dl<du&&du<=2))return err("se necesita 0 &lt; d_L &lt; d_U ≤ 2 (valores de la tabla de Durbin-Watson).");
      const rho=1-d/2,zone=d<dl?["rej","Hay autocorrelación positiva. Los errores estándar de MCO están subestimados."]:d<du?["","Zona inconclusa: la prueba no permite decidir. Usa Breusch-Godfrey."]:d<=4-du?["acc","No hay evidencia de autocorrelación de primer orden."]:d<=4-dl?["","Zona inconclusa: la prueba no permite decidir. Usa Breusch-Godfrey."]:["rej","Hay autocorrelación negativa."];
      return stp(1,"Coeficiente de autocorrelación aproximado",`<div class="eq">ρ̂ ≈ 1 − d/2 = 1 − ${fm(d)}/2 = ${fm(rho)}</div>`)+
        stp(2,"Zona de decisión",`${dwGauge(d,dl,du)}<div class="verdict ${zone[0]||""}" style="${zone[0]?"":"color:var(--branch);border-color:var(--branch)"}">${zone[1]}</div><p>d_L y d_U dependen de n y del número de regresoras; se buscan en la tabla de Durbin-Watson.</p>`)}};
  const out=()=>{$("cout").innerHTML=RUN[tab](vals[tab])};
  fields();out();
};
})();
// ===================== RESOLVEDOR DE CAMBIO ESTRUCTURAL Y VARIABLES DICÓTOMAS =====================
// Usa comun/estadistica.js (fcdf, tcdf, chi2cdf) y las utilidades del motor común.
const CE={};
const SB=n=>String(n).replace(/\d/g,d=>"₀₁₂₃₄₅₆₇₈₉"[d]);
const num=(id,label,val,step)=>`<label>${label}<input type="number" id="${id}" value="${val}" step="${step||"any"}" inputmode="decimal"></label>`;
const txt=(id,label,val)=>`<label>${label}<input type="text" id="${id}" value="${val}" spellcheck="false"></label>`;
CE.T=A=>A[0].map((_,j)=>A.map(r=>r[j]));
CE.mm=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,a,k)=>s+a*B[k][j],0)));
CE.mv=(A,v)=>A.map(r=>r.reduce((s,a,j)=>s+a*v[j],0));
CE.inv=function(M){const n=M.length,A=M.map((r,i)=>[...r,...Array.from({length:n},(_,j)=>i===j?1:0)]);
  for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(A[r][c])>Math.abs(A[p][c]))p=r;if(Math.abs(A[p][c])<1e-12)return null;[A[c],A[p]]=[A[p],A[c]];
    const d=A[c][c];for(let j=0;j<2*n;j++)A[c][j]/=d;for(let r=0;r<n;r++)if(r!==c){const f=A[r][c];for(let j=0;j<2*n;j++)A[r][j]-=f*A[c][j]}}return A.map(r=>r.slice(n))};
CE.ols=function(X,y){const XtX=CE.mm(CE.T(X),X),Xty=CE.mv(CE.T(X),y),I=CE.inv(XtX);if(!I)return null;const b=CE.mv(I,Xty),e=y.map((v,i)=>v-X[i].reduce((s,a,j)=>s+a*b[j],0));
  const n=y.length,k=b.length,rss=e.reduce((s,v)=>s+v*v,0),yb=y.reduce((a,c)=>a+c,0)/n,tss=y.reduce((s,v)=>s+(v-yb)**2,0),s2=n>k?rss/(n-k):NaN;
  return{b,e,rss,tss,r2:1-rss/tss,s2,se:I.map((r,i)=>Math.sqrt(s2*r[i])),I,XtX,Xty,n,k}};
CE.fp=(F,a,b)=>1-fcdf(F,a,b);
CE.fcrit=(a,b,al)=>{let lo=0,hi=1;while(CE.fp(hi,a,b)>al&&hi<1e6)hi*=2;for(let k=0;k<100;k++){const m=(lo+hi)/2;if(CE.fp(m,a,b)>al)lo=m;else hi=m}return(lo+hi)/2};
CE.tcrit=(v,al)=>{let lo=0,hi=1;while(2*(1-tcdf(hi,v))>al&&hi<1e6)hi*=2;for(let k=0;k<100;k++){const m=(lo+hi)/2;if(2*(1-tcdf(m,v))>al)lo=m;else hi=m}return(lo+hi)/2};
CE.ccrit=(k,al)=>{let lo=0,hi=1;while(1-chi2cdf(hi,k)>al&&hi<1e6)hi*=2;for(let j=0;j<100;j++){const m=(lo+hi)/2;if(1-chi2cdf(m,k)>al)lo=m;else hi=m}return(lo+hi)/2};
CE.mat=s=>s.trim().split(/\s*;\s*|\n+/).filter(Boolean).map(r=>r.trim().split(/[\s,]+/).map(x=>parseFloat(x)));
const f4=v=>fmt(v,4),f2=v=>fmt(v,2),p4=p=>p<1e-4?"&lt; 0,0001":fmt(p,4);
const veredicto=(F,crit,p,al,h0)=>`<p class="verdict ${F>crit?"bad":"ok"}">${F>crit?`Como ${f4(F)} &gt; ${f4(crit)} (p = ${p4(p)} &lt; ${fmt(al,2)}), se <b>rechaza H₀</b>: ${h0[1]}`:`Como ${f4(F)} ≤ ${f4(crit)} (p = ${p4(p)}), <b>no se rechaza H₀</b>: ${h0[0]}`}</p>`;
const coefTab=(names,R)=>`<div class="tbl"><table><tr><th>Coeficiente</th><th>Estimación</th><th>Error estándar</th><th>t</th></tr>${R.b.map((b,i)=>`<tr><td>${names[i]}</td><td class="num">${f4(b)}</td><td class="num">${isFinite(R.se[i])?f4(R.se[i]):"—"}</td><td class="num">${isFinite(R.se[i])?fmt(b/R.se[i],3):"—"}</td></tr>`).join("")}</table></div>`;
function miniPlot({xs,series,band,xl,yl,H=240,zero}){const W=600,all=[...series.flatMap(s=>s.y),...(band?band.flatMap(b=>b):[])].filter(isFinite);if(!all.length)return"";
  let y0=Math.min(...all,zero?0:Infinity),y1=Math.max(...all,zero?0:-Infinity);if(y0===y1){y0-=1;y1+=1}const pad=(y1-y0)*.08;y0-=pad;y1+=pad;
  const xr=[Math.min(...xs),Math.max(...xs)],f=frame(W,H,xr,[y0,y1],ticks(xr[0],xr[1],nice(Math.max(1,(xr[1]-xr[0])/6))),ticks(y0,y1,nice((y1-y0)/4)),xl,yl);let g="";
  const path=(ys,c,w,d)=>{const pts=xs.map((x,i)=>[x,ys[i]]).filter(p=>isFinite(p[1]));return`<path d="${pts.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(${c})" stroke-width="${w}" ${d?'stroke-dasharray="5 4"':""}/>`};
  if(band)band.forEach(b=>g+=path(b,"--bad",1.6,true));if(zero)g+=`<line x1="${f.sx(xr[0])}" x2="${f.sx(xr[1])}" y1="${f.sy(0)}" y2="${f.sy(0)}" stroke="var(--muted)"/>`;
  series.forEach(s=>{g+=path(s.y,s.c,2.4);xs.forEach((x,i)=>{if(isFinite(s.y[i]))g+=`<circle cx="${f.sx(x)}" cy="${f.sy(s.y[i])}" r="2.8" fill="var(${s.c})"/>`})});
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${yl}">${f.g}${g}</svg></div>`}

// ---------- ejemplos de los ejercicios
const CE_DATA={
 ej8:{t:"Ejercicio 8: guerra y paz",col:"Y X",by:"n1",n1:5,txt:"1 2\n2 4\n2 6\n4 10\n6 13\n1 2\n3 4\n3 6\n5 8\n6 10\n6 12\n7 14\n9 16\n9 18\n11 20",x0:10,g0:1},
 ej3:{t:"Ejercicio 3: educación urbana y rural",col:"Y X",by:"n1",n1:4,txt:"16 8\n18 13\n14 9\n18 12\n12 7\n10 3\n11 6\n14 10",x0:10.5,g0:0,nota:"Aquí el grupo 1 (primeras 4) es la zona urbana. El pronóstico del literal d es para la zona urbana: escoge el grupo 1."},
 ej5:{t:"Ejercicio 5: salarios por género",col:"W X",by:"n1",n1:9,txt:"3.14 13\n3.32 16\n3.61 30\n1.65 2\n2.64 8\n3.64 31\n2.46 10\n1.69 1\n1.91 6\n3.10 15\n1.98 4\n2.14 7\n2.61 13\n3.60 27\n3.38 19\n3.50 25\n3.65 20",x0:10,g0:0},
 d47:{t:"Dinardo 4.7: familias con aumento de ingreso",col:"Y X D",by:"dum",n1:0,txt:"70 80 0\n76 95 1\n91 105 0\n100 115 0\n105 125 1\n113 135 1\n122 145 0\n120 155 0\n146 165 1\n135 175 1\n147 185 1\n155 200 1",x0:150,g0:1}};

SIMS.cambio=function(){
  $("sim").innerHTML=`${seg("ce-m","Qué datos trae el ejercicio",[["datos","Datos (tabla)"],["mat","X′X, X′y, y′y"],["rss","Solo SCR o R²"],["coef","Modelo ya estimado"],["wlm","Wald, LR y LM"]],"datos")}
  <div class="calcf" style="margin-top:8px"><label>Nivel de significancia α<select id="ce-al"><option value="0.01">1 %</option><option value="0.05" selected>5 %</option><option value="0.1">10 %</option></select></label></div>
  <div id="ce-datos"></div><div id="ce-mat" hidden></div><div id="ce-rss" hidden></div><div id="ce-coef" hidden></div><div id="ce-wlm" hidden></div>`;
  const al=()=>+$("ce-al").value;
  // ======== modo datos
  $("ce-datos").innerHTML=`<div class="chips pre" id="cd-pre">${Object.entries(CE_DATA).map(([k,v])=>`<button type="button" data-k="${k}">${v.t}</button>`).join("")}</div>
  <p class="hint">Pega los datos tal como salen de Excel: una fila por observación, primero Y y luego las X (separadas por espacio o tabulación). Si los grupos vienen en una columna 0/1, ponla al final.</p>
  <div class="calcf"><label style="grid-column:1/-1">Datos<textarea id="cd-txt" rows="8" class="ce-ta" spellcheck="false"></textarea></label>
  <label>Cómo se definen los dos grupos<select id="cd-by"><option value="n1">Las primeras n₁ observaciones son el grupo 1</option><option value="dum">La última columna es la dummy (0 = grupo 1, 1 = grupo 2)</option></select></label>
  ${num("cd-n1","n₁: observaciones del grupo 1 (o antes del quiebre)",5)}${num("cd-x0","Pronóstico: valor de X (primera regresora)",10)}<label>Pronóstico para el grupo<select id="cd-g0"><option value="0">Grupo 1 (D = 0)</option><option value="1">Grupo 2 (D = 1)</option></select></label></div>
  <p class="hint" id="cd-nota"></p><div id="cd-out"></div>`;
  const setD=k=>{const d=CE_DATA[k];$("cd-txt").value=d.txt;$("cd-by").value=d.by;$("cd-n1").value=d.n1;$("cd-x0").value=d.x0;$("cd-g0").value=d.g0;$("cd-nota").textContent=d.nota||"";runD()};
  const runD=()=>{const rows=$("cd-txt").value.trim().split(/\n+/).map(r=>r.trim().replace(/,/g,".").split(/[\s;]+/).map(Number)).filter(r=>r.length&&r.every(isFinite));
    const out=$("cd-out");if(rows.length<5){out.innerHTML=err("Pega al menos 5 filas con números.");return}const w=rows[0].length;if(rows.some(r=>r.length!==w)){out.innerHTML=err("Todas las filas deben tener el mismo número de columnas.");return}
    const byD=$("cd-by").value==="dum",n=rows.length,n1i=Math.round(V("cd-n1"));let D;
    if(byD){if(w<3){out.innerHTML=err("Con la dummy en la última columna se necesitan al menos 3 columnas: Y, X y D.");return}D=rows.map(r=>r[w-1]);if(D.some(d=>d!==0&&d!==1)){out.innerHTML=err("La última columna debe tener solo 0 y 1.");return}}
    else{if(!(n1i>=1&&n1i<n)){out.innerHTML=err(`n₁ debe estar entre 1 y ${n-1}.`);return}D=rows.map((_,i)=>i<n1i?0:1)}
    const y=rows.map(r=>r[0]),xs=rows.map(r=>r.slice(1,byD?w-1:w)),m=xs[0].length,k=m+1;if(m<1){out.innerHTML=err("Falta al menos una columna X.");return}
    const xn=m===1?["X"]:xs[0].map((_,j)=>"X"+(j+1)),names=["Intercepto",...xn];
    const X=xs.map(r=>[1,...r]),i1=D.map((d,i)=>d===0?i:-1).filter(i=>i>=0),i2=D.map((d,i)=>d===1?i:-1).filter(i=>i>=0),n1=i1.length,n2=i2.length;
    const R=CE.ols(X,y);if(!R){out.innerHTML=err("X′X no es invertible: revisa que las X no sean constantes ni colineales.");return}
    const R1=n1>k?CE.ols(i1.map(i=>X[i]),i1.map(i=>y[i])):null,R2=n2>k?CE.ols(i2.map(i=>X[i]),i2.map(i=>y[i])):null;
    const XU=X.map((r,i)=>[...r,...r.map(v=>v*D[i])]),RU=CE.ols(XU,y);
    const a=al();let h="";
    h+=stp(1,"Modelo restringido: una sola ecuación para toda la muestra",`<div class="eq">Y<sub>t</sub> = β₁ + ${xn.map((x,j)=>`β${SB(j+2)}${x}<sub>t</sub>`).join(" + ")} + μ<sub>t</sub>, &nbsp; t = 1, …, ${n}</div>${coefTab(names,R)}<div class="res">${tiles([["SCR_R (RSS restringido)",f4(R.rss)],["R²",f4(R.r2)],["n",String(n)],["k (con intercepto)",String(k)]])}</div>`);
    const sep=(lab,Rg,ng)=>Rg?`<p><b>${lab}</b> (n = ${ng}): ${names.map((nm,j)=>`${nm} ${f4(Rg.b[j])}`).join(", ")} · SCR = <b>${f4(Rg.rss)}</b></p>`:`<p><b>${lab}</b> (n = ${ng}): no se puede estimar por separado porque n ≤ k. Usa la prueba de pronósticos de Chow.</p>`;
    h+=stp(2,"Cada submuestra por separado",sep("Grupo 1",R1,n1)+sep("Grupo 2",R2,n2));
    if(RU){const dn=names.map(nm=>"δ: D·"+nm).map((s,j)=>j===0?"δ₁: D (intercepto)":`δ${SB(j+1)}: D·${xn[j-1]}`),un=[...names.map((nm,j)=>j===0?"β₁: intercepto":`β${SB(j+1)}: ${xn[j-1]}`),...dn];
      let ver="";if(R1&&R2){const ok=RU.b.slice(0,k).every((b,j)=>Math.abs(b-R1.b[j])<1e-6*Math.max(1,Math.abs(b)))&&RU.b.slice(k).every((d,j)=>Math.abs(RU.b[j]+d-R2.b[j])<1e-6*Math.max(1,Math.abs(R2.b[j])));
        ver=`<p class="link"><b>Verificación (ecuaciones 27 y 28 del curso):</b> los β del modelo no restringido son los del grupo 1 (${ok?"coinciden":"revisa"}) y β + δ son los del grupo 2. Además SCR<sub>NR</sub> = ${f4(RU.rss)} = SCR₁ + SCR₂ = ${f4(R1.rss)} + ${f4(R2.rss)} = ${f4(R1.rss+R2.rss)}.</p>`}
      h+=stp(3,"Modelo no restringido con dummies (todas las interacciones)",`<div class="eq">Y<sub>t</sub> = β₁ + δ₁D<sub>t</sub> + ${xn.map((x,j)=>`β${SB(j+2)}${x}<sub>t</sub> + δ${SB(j+2)}D<sub>t</sub>${x}<sub>t</sub>`).join(" + ")} + μ<sub>t</sub></div>${coefTab(un,RU)}<div class="res">${tiles([["SCR_NR",f4(RU.rss)],["gl = n − 2k",String(n-2*k)]])}</div>${ver}
        <p>Ecuación del grupo 1 (D = 0): Ŷ = ${f4(RU.b[0])}${xn.map((x,j)=>` ${RU.b[j+1]<0?"−":"+"} ${f4(Math.abs(RU.b[j+1]))}${x}`).join("")}. Grupo 2 (D = 1): Ŷ = ${f4(RU.b[0]+RU.b[k])}${xn.map((x,j)=>{const v=RU.b[j+1]+RU.b[k+j+1];return` ${v<0?"−":"+"} ${f4(Math.abs(v))}${x}`}).join("")}.</p>`);
      if(n-2*k>0){const q=k,F=((R.rss-RU.rss)/q)/(RU.rss/(n-2*k)),cr=CE.fcrit(q,n-2*k,a),p=CE.fp(F,q,n-2*k);
        const Fr2=((RU.r2-R.r2)/q)/((1-RU.r2)/(n-2*k));
        // Wald matricial: R = [0 | I]
        const Rm=Array.from({length:k},(_,i)=>Array.from({length:2*k},(_,j)=>j===k+i?1:0)),Rb=CE.mv(Rm,RU.b),M=CE.inv(CE.mm(CE.mm(Rm,RU.I),CE.T(Rm))),Fw=Rb.reduce((s,v,i)=>s+v*M[i].reduce((t,mm,j)=>t+mm*Rb[j],0),0)/(q*RU.s2);
        const sub=(idx,lab)=>{const Xr=XU.map(r=>r.filter((_,j)=>!idx.includes(j))),Rr=CE.ols(Xr,y),qq=idx.length,FF=((Rr.rss-RU.rss)/qq)/(RU.rss/(n-2*k)),cc=CE.fcrit(qq,n-2*k,a),pp=CE.fp(FF,qq,n-2*k);return`<tr><td>${lab}</td><td class="num">${qq}</td><td class="num">${f4(Rr.rss)}</td><td class="num">${f4(FF)}</td><td class="num">${f4(cc)}</td><td class="num">${p4(pp)}</td><td>${FF>cc?"Rechaza":"No rechaza"}</td></tr>`};
        h+=stp(4,"Prueba de cambio estructural de Chow: todas las alternativas",`<div class="eq">H₀: δ₁ = ${xn.map((_,j)=>"δ"+SB(j+2)).join(" = ")} = 0 (la función es la misma en los dos grupos) &nbsp; vs &nbsp; H₁: algún δ ≠ 0</div>
          <div class="tbl"><table><tr><th>Alternativa</th><th>Cálculo</th><th>F</th></tr>
          <tr><td>a) Con las SCR</td><td>[(SCR_R − SCR_NR)/k] / [SCR_NR/(n − 2k)] = [(${f4(R.rss)} − ${f4(RU.rss)})/${k}] / [${f4(RU.rss)}/${n-2*k}]</td><td class="num">${f4(F)}</td></tr>
          ${R1&&R2?`<tr><td>b) Con las submuestras</td><td>[(SCR_R − SCR₁ − SCR₂)/k] / [(SCR₁ + SCR₂)/(n − 2k)]</td><td class="num">${f4(((R.rss-R1.rss-R2.rss)/k)/((R1.rss+R2.rss)/(n-2*k)))}</td></tr>`:""}
          <tr><td>c) Con los R² (misma Y)</td><td>[(R²_NR − R²_R)/k] / [(1 − R²_NR)/(n − 2k)] = [(${f4(RU.r2)} − ${f4(R.r2)})/${k}] / [(1 − ${f4(RU.r2)})/${n-2*k}]</td><td class="num">${f4(Fr2)}</td></tr>
          <tr><td>d) Wald matricial: Rβ = r</td><td>(Rb − r)′[R(X′X)⁻¹R′]⁻¹(Rb − r) / (q·s²), con R = [0 | I<sub>${k}</sub>] y r = 0</td><td class="num">${f4(Fw)}</td></tr></table></div>
          <div class="res">${tiles([["F",f4(F)],[`F crítico (${k}, ${n-2*k}) al ${a*100} %`,f4(cr)],["p-valor",p4(p)]])}</div>
          ${veredicto(F,cr,p,a,["los datos no muestran cambio estructural; una sola función describe los dos grupos.","hay cambio estructural; la función no es la misma en los dos grupos."])}
          <h4 class="subh">¿Dónde está el cambio?</h4><div class="tbl"><table><tr><th>H₀</th><th>q</th><th>SCR restringida</th><th>F</th><th>F crítico</th><th>p</th><th>Decisión</th></tr>${sub([k],"Solo cambia el intercepto (δ₁ = 0)")}${sub(xn.map((_,j)=>k+1+j),"Solo cambian las pendientes ("+xn.map((_,j)=>"δ"+SB(j+2)).join(" = ")+" = 0)")}</table></div>`);}
      // pronóstico
      const x0=V("cd-x0"),g0=+$("cd-g0").value;if(isFinite(x0)){const xr=[1,x0,...Array(m-1).fill(0)],c=[...xr,...xr.map(v=>v*g0)],yh=c.reduce((s,v,j)=>s+v*RU.b[j],0),q0=c.reduce((s,v,i)=>s+v*RU.I[i].reduce((t,mm,j)=>t+mm*c[j],0),0),tc=CE.tcrit(n-2*k,a);
        if(n-2*k>0)h+=stp(5,`Pronóstico para X = ${fm(x0)} en el grupo ${g0+1}`,`<div class="eq al chain">Ŷ₀ = x₀′b = <b>${f4(yh)}</b><br>Var(Ŷ₀) = s²·x₀′(X′X)⁻¹x₀ = ${f4(RU.s2)}·${f4(q0)} &nbsp;·&nbsp; t(${n-2*k}) = ${f4(tc)}<br>IC para la media: ${f4(yh)} ± ${f4(tc)}·${f4(Math.sqrt(RU.s2*q0))} = [${f4(yh-tc*Math.sqrt(RU.s2*q0))}, ${f4(yh+tc*Math.sqrt(RU.s2*q0))}]<br>IC para un valor individual: ${f4(yh)} ± ${f4(tc)}·${f4(Math.sqrt(RU.s2*(1+q0)))} = [${f4(yh-tc*Math.sqrt(RU.s2*(1+q0)))}, ${f4(yh+tc*Math.sqrt(RU.s2*(1+q0)))}]</div>${m>1?`<p class="hint">Las demás regresoras se toman en 0; para otro punto usa el código R.</p>`:""}`)}}
    // Chow de pronósticos y recursivos (solo si el grupo 1 es el comienzo de la muestra)
    const ordered=D.every((d,i)=>i===0||d>=D[i-1]);
    if(ordered&&n1>k){const X1=X.slice(0,n1),y1=y.slice(0,n1),X2=X.slice(n1),y2=y.slice(n1),Q=CE.ols(X1,y1),dd=y2.map((v,i)=>v-X2[i].reduce((s,a2,j)=>s+a2*Q.b[j],0));
      const Fp=((R.rss-Q.rss)/n2)/(Q.rss/(n1-k)),Vd=X2.map((r,i)=>X2.map((r2,j)=>(i===j?1:0)+r.reduce((s,v,a2)=>s+v*Q.I[a2].reduce((t,mm,b2)=>t+mm*r2[b2],0),0))),Vi=CE.inv(Vd);
      const Fd=Vi?dd.reduce((s,v,i)=>s+v*Vi[i].reduce((t,mm,j)=>t+mm*dd[j],0),0)/(n2*Q.s2):NaN,cr=CE.fcrit(n2,n1-k,a),p=CE.fp(Fp,n2,n1-k);
      h+=stp(6,"Prueba de pronósticos de Chow (estima con el grupo 1 y predice el grupo 2)",`<div class="eq al chain">(8) F = [(SCR_R − SCR₁)/n₂] / [SCR₁/(n₁ − k)] = [(${f4(R.rss)} − ${f4(Q.rss)})/${n2}] / [${f4(Q.rss)}/${n1-k}] = <b>${f4(Fp)}</b><br>(9) F = d′[I + X₂(X₁′X₁)⁻¹X₂′]⁻¹d / (n₂·s₁²) = <b>${f4(Fd)}</b> &nbsp; con d = y₂ − X₂b₁</div>
        <div class="tbl"><table><tr><th>t</th><th>Y observado</th><th>Ŷ con b₁</th><th>Error de pronóstico d</th></tr>${dd.slice(0,15).map((v,i)=>`<tr><td>${n1+i+1}</td><td class="num">${f4(y2[i])}</td><td class="num">${f4(y2[i]-v)}</td><td class="num">${f4(v)}</td></tr>`).join("")}</table></div>
        <div class="res">${tiles([["F",f4(Fp)],[`F crítico (${n2}, ${n1-k})`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(Fp,cr,p,a,["los errores de pronóstico son compatibles con el modelo del grupo 1: no hay evidencia de cambio.","el modelo estimado antes del quiebre no predice bien después: hay evidencia de cambio estructural."])}`)}
    if(ordered&&n>k+2){// residuos recursivos
      const ts=[],w=[],bs=[],bse=[],pe=[],peb=[];for(let t=k;t<n;t++){const Rt=CE.ols(X.slice(0,t),y.slice(0,t));if(!Rt)continue;const xt=X[t],f=y[t]-xt.reduce((s,v,j)=>s+v*Rt.b[j],0),h2=1+xt.reduce((s,v,i)=>s+v*Rt.I[i].reduce((u,mm,j)=>u+mm*xt[j],0),0);
        ts.push(t+1);w.push(f/Math.sqrt(h2));pe.push(f);peb.push(t>k?2*Math.sqrt(Rt.s2*h2):NaN);const Rt1=CE.ols(X.slice(0,t+1),y.slice(0,t+1));bs.push(Rt1?Rt1.b[1]:NaN);bse.push(Rt1&&t+1>k?2*Rt1.se[1]:NaN)}
      const sw=Math.sqrt(w.reduce((s,v)=>s+v*v,0)/(w.length-1)),mw=w.reduce((s,v)=>s+v,0)/w.length,sd=Math.sqrt(w.reduce((s,v)=>s+(v-mw)**2,0)/(w.length-1)),cus=[];let acc=0;w.forEach(v=>{acc+=v/sd;cus.push(acc)});
      const T=w.length,bandU=ts.map((_,i)=>0.948*Math.sqrt(T)*(1+2*(i+1)/T)),bandL=bandU.map(v=>-v),out1=cus.some((c,i)=>Math.abs(c)>bandU[i]),out2=pe.some((v,i)=>isFinite(peb[i])&&Math.abs(v)>peb[i]);
      const css=[];let a2=0;const S=w.reduce((s,v)=>s+v*v,0);w.forEach(v=>{a2+=v*v;css.push(a2/S)});
      h+=stp(7,"Coeficientes recursivos, errores de predicción un paso adelante y CUSUM",`<p>Se estima el modelo con las primeras t observaciones (t = k, k + 1, …) y se predice la siguiente. Si la estructura es estable, los coeficientes recursivos se mantienen dentro de su banda de ±2 errores estándar y los errores de predicción dentro de ±2 desviaciones.</p>
        <h4 class="subh">Pendiente recursiva b₂(t) con ±2 e.e.</h4>${miniPlot({xs:ts,series:[{y:bs,c:"--line"}],band:[bs.map((b,i)=>b+bse[i]),bs.map((b,i)=>b-bse[i])],xl:"t",yl:"b₂"})}
        <h4 class="subh">Errores de predicción un paso adelante con ±2 desviaciones</h4>${miniPlot({xs:ts,series:[{y:pe,c:"--line"}],band:[peb,peb.map(v=>-v)],xl:"t",yl:"error",zero:1})}
        <p>${out2?"Algún error de predicción se sale de la banda: el modelo con los datos anteriores no anticipa esa observación, señal de cambio.":"Todos los errores de predicción quedan dentro de la banda."}</p>
        <h4 class="subh">CUSUM de los residuos recursivos (bandas al 5 %)</h4>${miniPlot({xs:ts,series:[{y:cus,c:"--exam"}],band:[bandU,bandL],xl:"t",yl:"CUSUM",zero:1})}
        <p>${out1?"La CUSUM cruza las bandas: hay evidencia de inestabilidad en los coeficientes.":"La CUSUM no cruza las bandas: no hay evidencia de inestabilidad con esta prueba."}</p><p class="hint">Con pocas observaciones estas pruebas tienen poco poder. En R: <code>rr &lt;- recresid(m)</code>, <code>plot(efp(y ~ x, type = "Rec-CUSUM"))</code> (paquete strucchange).</p>`)}
    // código R
    const cn=["y",...xn.map(x=>x.toLowerCase())],xs2=xn.map(x=>x.toLowerCase());
    h+=stp(8,"El mismo ejercicio en R",`<pre class="ce-code">datos &lt;- read.table(text = "\n${rows.map(r=>r.join(" ")).join("\n")}", col.names = c(${[...cn,...(byD?["D"]:[])].map(c=>`"${c}"`).join(", ")}))
${byD?"":`datos$D &lt;- c(rep(0, ${n1}), rep(1, ${n2}))   # 0 = grupo 1, 1 = grupo 2\n`}k &lt;- ${k}; n &lt;- nrow(datos)
mR  &lt;- lm(y ~ ${xs2.join(" + ")}, data = datos)              # restringido
mNR &lt;- lm(y ~ (${xs2.join(" + ")}) * D, data = datos)        # no restringido (dummies)
m1  &lt;- lm(y ~ ${xs2.join(" + ")}, data = subset(datos, D == 0))
m2  &lt;- lm(y ~ ${xs2.join(" + ")}, data = subset(datos, D == 1))
RSS &lt;- function(m) sum(resid(m)^2)
c(RSS(mNR), RSS(m1) + RSS(m2))                 # deben ser iguales
F &lt;- ((RSS(mR) - RSS(mNR)) / k) / (RSS(mNR) / (n - 2 * k))
c(F = F, p = pf(F, k, n - 2 * k, lower.tail = FALSE))
anova(mR, mNR)                                  # el mismo F
# Chow de pronósticos (estima con el grupo 1)
n1 &lt;- sum(datos$D == 0); n2 &lt;- n - n1
Fp &lt;- ((RSS(mR) - RSS(m1)) / n2) / (RSS(m1) / (n1 - k))
c(Fp = Fp, p = pf(Fp, n2, n1 - k, lower.tail = FALSE))
# recursivos (paquete strucchange)
library(strucchange)
plot(efp(y ~ ${xs2.join(" + ")}, data = datos, type = "Rec-CUSUM"))
sctest(y ~ ${xs2.join(" + ")}, data = datos, type = "Chow", point = n1)</pre>`);
    out.innerHTML=h;if(typeof prettyCode==="function")prettyCode(out)};
  $("cd-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setD(b.dataset.k)});
  $("ce-datos").querySelectorAll("textarea,input,select").forEach(el=>el.addEventListener("input",runD));
  // ======== modo matrices
  $("ce-mat").innerHTML=`<div class="chips pre" id="cm-pre"><button type="button" data-k="d41">Dinardo 4.1 (una observación nueva)</button><button type="button" data-k="d49">Dinardo 4.9 (urbano y rural)</button></div>
  <p class="hint">Escribe las matrices por filas separadas con punto y coma: «20 10; 10 30».</p>
  <div class="calcf"><label>X′X muestra 1<input type="text" id="cm-a1" spellcheck="false"></label><label>X′y muestra 1<input type="text" id="cm-b1" spellcheck="false"></label>${num("cm-c1","y′y muestra 1",75)}${num("cm-n1","n₁",20,1)}
  <label>Segunda parte<select id="cm-tipo"><option value="obs">Observaciones nuevas (prueba de pronósticos)</option><option value="mue">Otra muestra resumida (Chow)</option></select></label>
  <label>Nuevas X (filas; con la columna de unos)<input type="text" id="cm-x2" spellcheck="false"></label><label>Nuevas Y<input type="text" id="cm-y2" spellcheck="false"></label>
  <label>X′X muestra 2<input type="text" id="cm-a2" spellcheck="false"></label><label>X′y muestra 2<input type="text" id="cm-b2" spellcheck="false"></label>${num("cm-c2","y′y muestra 2",24)}${num("cm-n2","n₂",10,1)}</div><div id="cm-out"></div>`;
  const PM={d41:{a1:"20 10; 10 30",b1:"30; 40",c1:75,n1:20,tipo:"obs",x2:"1 2",y2:"4",a2:"",b2:"",c2:0,n2:1},d49:{a1:"20 20; 20 25",b1:"10; 20",c1:30,n1:10,tipo:"mue",x2:"",y2:"",a2:"10 10; 10 20",b2:"8; 20",c2:24,n2:10}};
  const setM=k=>{const p=PM[k];Object.entries(p).forEach(([f,v])=>{$("cm-"+f).value=v});runM()};
  const runM=()=>{const o=$("cm-out"),A1=CE.mat($("cm-a1").value),B1=CE.mat($("cm-b1").value).map(r=>r[0]),c1=V("cm-c1"),n1=V("cm-n1"),k=A1.length,a=al();
    if(!k||A1.some(r=>r.length!==k||r.some(v=>!isFinite(v)))||B1.length!==k||!isFinite(c1)){o.innerHTML=err("X′X debe ser cuadrada y X′y tener tantas filas como X′X.");return}
    const I1=CE.inv(A1);if(!I1){o.innerHTML=err("X′X no es invertible.");return}const b1=CE.mv(I1,B1),rss1=c1-b1.reduce((s,b,i)=>s+b*B1[i],0),s1=rss1/(n1-k);
    let h=stp(1,"Muestra 1",`<div class="eq al chain">b₁ = (X′X)⁻¹X′y = [${b1.map(f4).join("; ")}]<br>SCR₁ = y′y − b₁′X′y = ${fm(c1)} − ${f4(b1.reduce((s,b,i)=>s+b*B1[i],0))} = <b>${f4(rss1)}</b> &nbsp; s₁² = SCR₁/(n₁ − k) = ${f4(s1)}</div>`);
    if($("cm-tipo").value==="obs"){const X2=CE.mat($("cm-x2").value),y2=CE.mat($("cm-y2").value).flat();if(!X2.length||X2.some(r=>r.length!==k)||y2.length!==X2.length){o.innerHTML=h+err(`Cada fila nueva de X debe tener ${k} valores (incluido el 1) y debe haber una Y por fila.`);return}
      const n2=X2.length,d=y2.map((v,i)=>v-X2[i].reduce((s,x,j)=>s+x*b1[j],0)),Vd=X2.map((r,i)=>X2.map((r2,j)=>(i===j?1:0)+r.reduce((s,v,p)=>s+v*I1[p].reduce((t,mm,q)=>t+mm*r2[q],0),0))),Vi=CE.inv(Vd),F=d.reduce((s,v,i)=>s+v*Vi[i].reduce((t,mm,j)=>t+mm*d[j],0),0)/(n2*s1),cr=CE.fcrit(n2,n1-k,a),p=CE.fp(F,n2,n1-k);
      h+=stp(2,"Prueba de pronósticos de Chow",`<div class="eq al chain">Ŷ = X₂b₁ = [${X2.map(r=>f4(r.reduce((s,x,j)=>s+x*b1[j],0))).join("; ")}] &nbsp; d = y₂ − Ŷ = [${d.map(f4).join("; ")}]<br>Var(d) = s²[I + X₂(X₁′X₁)⁻¹X₂′] ⇒ factor = ${Vd.length===1?f4(Vd[0][0]):"matriz"}<br>F = d′[I + X₂(X₁′X₁)⁻¹X₂′]⁻¹d / (n₂ s₁²) = <b>${f4(F)}</b> ~ F(${n2}, ${n1-k})</div><div class="res">${tiles([["F",f4(F)],["F crítico",f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["la observación nueva es compatible con la relación estimada: parámetros constantes.","la observación nueva no se ajusta a la relación estimada: hay evidencia de cambio."])}`)}
    else{const A2=CE.mat($("cm-a2").value),B2=CE.mat($("cm-b2").value).map(r=>r[0]),c2=V("cm-c2"),n2=V("cm-n2");if(A2.length!==k||B2.length!==k){o.innerHTML=h+err("La muestra 2 debe tener las mismas dimensiones.");return}
      const I2=CE.inv(A2),b2=CE.mv(I2,B2),rss2=c2-b2.reduce((s,b,i)=>s+b*B2[i],0),A=A1.map((r,i)=>r.map((v,j)=>v+A2[i][j])),B=B1.map((v,i)=>v+B2[i]),I=CE.inv(A),b=CE.mv(I,B),rssR=c1+c2-b.reduce((s,v,i)=>s+v*B[i],0),n=n1+n2,F=((rssR-rss1-rss2)/k)/((rss1+rss2)/(n-2*k)),cr=CE.fcrit(k,n-2*k,a),p=CE.fp(F,k,n-2*k);
      h+=stp(2,"Muestra 2",`<div class="eq al chain">b₂ = [${b2.map(f4).join("; ")}] &nbsp; SCR₂ = ${fm(c2)} − ${f4(b2.reduce((s,v,i)=>s+v*B2[i],0))} = <b>${f4(rss2)}</b></div>`)
        +stp(3,"Muestra completa (restringido): se suman las matrices",`<div class="eq al chain">X′X = X₁′X₁ + X₂′X₂ = [${A.map(r=>r.map(fm).join(" ")).join("; ")}] &nbsp; X′y = [${B.map(fm).join("; ")}] &nbsp; y′y = ${fm(c1+c2)}<br>b = [${b.map(f4).join("; ")}] &nbsp; SCR_R = <b>${f4(rssR)}</b></div>`)
        +stp(4,"Prueba de Chow",`<div class="eq al chain">F = [(SCR_R − SCR₁ − SCR₂)/k] / [(SCR₁ + SCR₂)/(n − 2k)] = [(${f4(rssR)} − ${f4(rss1+rss2)})/${k}] / [${f4(rss1+rss2)}/${n-2*k}] = <b>${f4(F)}</b></div><div class="res">${tiles([["F",f4(F)],[`F crítico (${k}, ${n-2*k})`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["la misma relación sirve para las dos muestras.","la relación es distinta en las dos muestras."])}`)}
    o.innerHTML=h};
  $("cm-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setM(b.dataset.k)});
  $("ce-mat").querySelectorAll("input,select").forEach(el=>el.addEventListener("input",runM));
  // ======== modo SCR
  $("ce-rss").innerHTML=`<div class="chips pre" id="cr-pre"><button type="button" data-k="e6">Ejercicio 6 (tres periodos)</button><button type="button" data-k="d42">Dinardo 4.2 (estacionalidad y subperiodos)</button><button type="button" data-k="d48">Dinardo 4.8 (función de producción)</button><button type="button" data-k="d410">Dinardo 4.10 (grupos de ingreso)</button></div>
  <p class="hint">Una fila por submuestra: «n, SCR». Si el ejercicio da el error estándar de la regresión s, escribe «n, s=0.0457» y se calcula SCR = s²(n − k); si da la varianza residual, «n, v=0.26».</p>
  <div class="calcf"><label style="grid-column:1/-1">Submuestras<textarea id="cr-sub" rows="3" class="ce-ta" spellcheck="false"></textarea></label>
  <label>Modelo completo: SCR_R, «s=…», «v=…» o «R2=…; TSS=…»<input type="text" id="cr-r" spellcheck="false"></label>${num("cr-k","k: parámetros por ecuación (con intercepto)",2,1)}</div><div id="cr-out"></div>`;
  const PR={e6:{sub:"8, 2379.315\n12, 3679.020\n7, 1295.861",r:"R2=0.9974; TSS=6403270",k:2},d42:{sub:"44, 9.32\n32, 7.46",r:"18.48",k:4},d48:{sub:"20, s=0.04573\n19, s=0.02185",r:"s=0.03755",k:3},d410:{sub:"102, v=0.26\n102, v=0.42\n52, v=0.30",r:"v=0.38",k:2}};
  const setR=k=>{const p=PR[k];$("cr-sub").value=p.sub;$("cr-r").value=p.r;$("cr-k").value=p.k;runR()};
  const toRSS=(s,n,k)=>{s=s.trim();let m;if((m=s.match(/^s\s*=\s*([\d.eE+-]+)/i)))return{v:(+m[1])**2*(n-k),txt:`s²(n − k) = ${m[1]}²·${n-k}`};if((m=s.match(/^v\s*=\s*([\d.eE+-]+)/i)))return{v:(+m[1])*(n-k),txt:`s²(n − k) = ${m[1]}·${n-k}`};
    if((m=s.match(/R2\s*=\s*([\d.eE+-]+)\s*;\s*TSS\s*=\s*([\d.eE+-]+)/i)))return{v:(1-m[1])*m[2],txt:`(1 − R²)·TSS = (1 − ${m[1]})·${m[2]}`};const v=parseFloat(s);return{v,txt:fm(v)}};
  const runR=()=>{const o=$("cr-out"),k=V("cr-k"),a=al(),rows=$("cr-sub").value.trim().split(/\n+/).map(r=>r.split(",")).filter(r=>r.length>=2);
    if(rows.length<2||!(k>=1)){o.innerHTML=err("Escribe al menos dos submuestras y k ≥ 1.");return}
    const subs=rows.map(r=>{const n=parseInt(r[0],10);return{n,...toRSS(r.slice(1).join(","),n,k)}});if(subs.some(s=>!(s.n>k)||!isFinite(s.v))){o.innerHTML=err("Cada submuestra necesita n > k y una SCR válida.");return}
    const m=subs.length,n=subs.reduce((s,x)=>s+x.n,0),R=toRSS($("cr-r").value,n,k);if(!isFinite(R.v)){o.innerHTML=err("Revisa la SCR del modelo completo.");return}
    const nr=subs.reduce((s,x)=>s+x.v,0),q=(m-1)*k,g2=n-m*k,F=((R.v-nr)/q)/(nr/g2),cr=CE.fcrit(q,g2,a),p=CE.fp(F,q,g2);
    o.innerHTML=stp(1,"Las SCR",`<div class="tbl"><table><tr><th>Submuestra</th><th>n</th><th>SCR</th></tr>${subs.map((s,i)=>`<tr><td>${i+1}</td><td class="num">${s.n}</td><td class="num">${s.txt} = ${f4(s.v)}</td></tr>`).join("")}<tr><td><b>Completa (restringido)</b></td><td class="num">${n}</td><td class="num">${R.txt} = ${f4(R.v)}</td></tr></table></div><p>SCR_NR = suma de las SCR de las submuestras = <b>${f4(nr)}</b>.</p>`)
      +stp(2,"Prueba F de estabilidad de los parámetros",`<div class="eq">H₀: β<sup>(1)</sup> = ${m>2?"β<sup>(2)</sup> = … = ":""}β<sup>(${m})</sup> &nbsp; (${q} restricciones: ${m-1} igualdades de ${k} coeficientes)</div>
        <div class="eq al chain">F = [(SCR_R − SCR_NR)/((m − 1)k)] / [SCR_NR/(n − mk)] = [(${f4(R.v)} − ${f4(nr)})/${q}] / [${f4(nr)}/${g2}] = <b>${f4(F)}</b></div><div class="res">${tiles([["F",f4(F)],[`F crítico (${q}, ${g2}) al ${a*100} %`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["los parámetros son estables entre las submuestras.","los parámetros no son los mismos en todas las submuestras: hay cambio estructural."])}`)};
  $("cr-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)setR(b.dataset.k)});
  $("ce-rss").querySelectorAll("textarea,input").forEach(el=>el.addEventListener("input",runR));
  // ======== modo modelo estimado
  $("ce-coef").innerHTML=`<div class="chips pre" id="cc-pre"><button type="button" data-k="e2">Ejercicio 2 (cerveza por género)</button><button type="button" data-k="e15">Ejercicio 15 (reforma)</button></div>
  <p class="hint">Modelo Ŷ = β₁ + δ₁D + β₂X + δ₂DX. Si no hay errores estándar (ejercicio 15), déjalos en 0.</p>
  <div class="calcf">${num("cc-b1","β₁ (intercepto)",186.47)}${num("cc-s1","e.e.(β₁)",45.67)}${num("cc-d1","δ₁ (D)",-126)}${num("cc-sd1","e.e.(δ₁)",57.01)}${num("cc-b2","β₂ (X)",0.23)}${num("cc-s2","e.e.(β₂)",0.09)}${num("cc-d2","δ₂ (D·X)",-0.13)}${num("cc-sd2","e.e.(δ₂)",0.10)}${num("cc-n","n",34,1)}
  ${txt("cc-g0","Grupo D = 0","hombres")}${txt("cc-g1","Grupo D = 1","mujeres")}</div><div id="cc-out"></div>`;
  const PC={e2:[186.47,45.67,-126,57.01,0.23,0.09,-0.13,0.10,34,"hombres","mujeres"],e15:[2,0,2.5,0,0.5,0,-0.25,0,0,"antes de la reforma","después de la reforma"]};
  const ids=["cc-b1","cc-s1","cc-d1","cc-sd1","cc-b2","cc-s2","cc-d2","cc-sd2","cc-n","cc-g0","cc-g1"];
  const runC=()=>{const[b1,s1,d1,sd1,b2,s2,d2,sd2,n]=ids.slice(0,9).map(V),g0=$("cc-g0").value,g1=$("cc-g1").value,a=al(),gl=n-4,tc=gl>0?CE.tcrit(gl,a):NaN;
    const tr=(nm,c,s,lab)=>{if(!(s>0)||!(gl>0))return`<tr><td>${nm}</td><td class="num">${f4(c)}</td><td>—</td><td>—</td><td>${lab}</td></tr>`;const t=c/s,p=2*(1-tcdf(Math.abs(t),gl));return`<tr><td>${nm}</td><td class="num">${f4(c)}</td><td class="num">${fmt(t,3)}</td><td class="num">${p4(p)}</td><td>${lab}${Math.abs(t)>tc?" <b>Significativo</b>":" No significativo"}</td></tr>`};
    $("cc-out").innerHTML=stp(1,"Las dos ecuaciones",`<div class="eq al chain">${g0} (D = 0): Ŷ = ${f4(b1)} ${b2<0?"−":"+"} ${f4(Math.abs(b2))}X<br>${g1} (D = 1): Ŷ = (${f4(b1)} ${d1<0?"−":"+"} ${f4(Math.abs(d1))}) + (${f4(b2)} ${d2<0?"−":"+"} ${f4(Math.abs(d2))})X = ${f4(b1+d1)} ${b2+d2<0?"−":"+"} ${f4(Math.abs(b2+d2))}X</div>
      <ul><li><b>β₁ = ${f4(b1)}:</b> valor esperado de Y para ${g0} cuando X = 0 (intercepto o componente autónomo).</li><li><b>δ₁ = ${f4(d1)}:</b> diferencia en el intercepto de ${g1} frente a ${g0}: el intercepto ${d1<0?"baja":"sube"} ${f4(Math.abs(d1))}.</li><li><b>β₂ = ${f4(b2)}:</b> efecto marginal de X para ${g0}: si X sube 1 unidad, Y cambia ${f4(b2)}.</li><li><b>δ₂ = ${f4(d2)}:</b> diferencia en la pendiente: para ${g1} el efecto marginal es ${f4(b2+d2)}.</li></ul>
      <p>La diferencia en Y entre los grupos para un mismo X es δ₁ + δ₂X = ${f4(d1)} ${d2<0?"−":"+"} ${f4(Math.abs(d2))}X: depende del nivel de X cuando δ₂ ≠ 0.</p>`)
      +(gl>0&&[s1,sd1,s2,sd2].some(v=>v>0)?stp(2,"Pruebas t individuales",`<p>H₀: coeficiente = 0 frente a H₁: ≠ 0, con t(${gl}) crítico = ${f4(tc)} al ${a*100} %.</p><div class="tbl"><table><tr><th>Coeficiente</th><th>Estimación</th><th>t</th><th>p</th><th>Lectura</th></tr>${tr("β₁",b1,s1,"Intercepto de "+g0)}${tr("δ₁",d1,sd1,"¿Distinto intercepto?")}${tr("β₂",b2,s2,"Pendiente de "+g0)}${tr("δ₂",d2,sd2,"¿Distinta pendiente?")}</table></div>
        <p>${sd2>0?(Math.abs(d2/sd2)>tc?`Se rechaza δ₂ = 0: la pendiente es distinta entre ${g0} y ${g1}.`:`No se rechaza δ₂ = 0: no hay evidencia de que la pendiente difiera entre ${g0} y ${g1}.`):""} ${sd1>0?(Math.abs(d1/sd1)>tc?`Se rechaza δ₁ = 0: el intercepto (componente autónomo) es distinto.`:`No se rechaza δ₁ = 0: no hay evidencia de un intercepto distinto.`):""}</p><p class="hint">Para probar δ₁ = δ₂ = 0 a la vez hace falta un F conjunto (o la covarianza entre los estimadores, o las SCR de los dos modelos): las pruebas t por separado no bastan.</p>`):"")};
  $("cc-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;PC[b.dataset.k].forEach((v,i)=>$(ids[i]).value=v);runC()});
  $("ce-coef").querySelectorAll("input").forEach(el=>el.addEventListener("input",runC));
  // ======== modo W, LR, LM
  $("ce-wlm").innerHTML=`<div class="chips pre"><button type="button" id="cw-pre">Ejercicio 12 (Nerlove)</button></div><div class="calcf">${num("cw-n","n",29,1)}${num("cw-rr","SCR restringido",0.364)}${num("cw-ru","SCR no restringido",0.336)}${num("cw-q","q: número de restricciones",1,1)}${num("cw-k","k del no restringido (con intercepto)",5,1)}</div><div id="cw-out"></div>`;
  const runW=()=>{const[n,rr,ru,q,k]=["cw-n","cw-rr","cw-ru","cw-q","cw-k"].map(V),a=al();if(!(n>k&&rr>=ru&&ru>0&&q>=1)){$("cw-out").innerHTML=err("Se necesita n > k, SCR restringido ≥ no restringido > 0 y q ≥ 1.");return}
    const W=n*(rr-ru)/ru,LR=n*Math.log(rr/ru),LM=n*(rr-ru)/rr,F=((rr-ru)/q)/(ru/(n-k)),cc=CE.ccrit(q,a),fc=CE.fcrit(q,n-k,a);
    $("cw-out").innerHTML=`<div class="tbl"><table><tr><th>Prueba</th><th>Fórmula</th><th>Valor</th><th>Crítico</th><th>p</th><th>Decisión</th></tr>
      <tr><td>Wald</td><td>n(SCR_R − SCR_NR)/SCR_NR</td><td class="num">${f4(W)}</td><td class="num">χ²(${q}) = ${f4(cc)}</td><td class="num">${p4(1-chi2cdf(W,q))}</td><td>${W>cc?"Rechaza":"No rechaza"}</td></tr>
      <tr><td>Razón de verosimilitud (LR)</td><td>n·ln(SCR_R/SCR_NR)</td><td class="num">${f4(LR)}</td><td class="num">${f4(cc)}</td><td class="num">${p4(1-chi2cdf(LR,q))}</td><td>${LR>cc?"Rechaza":"No rechaza"}</td></tr>
      <tr><td>Multiplicador de Lagrange (LM)</td><td>n(SCR_R − SCR_NR)/SCR_R</td><td class="num">${f4(LM)}</td><td class="num">${f4(cc)}</td><td class="num">${p4(1-chi2cdf(LM,q))}</td><td>${LM>cc?"Rechaza":"No rechaza"}</td></tr>
      <tr><td>F (muestra finita)</td><td>[(SCR_R − SCR_NR)/q]/[SCR_NR/(n − k)]</td><td class="num">${f4(F)}</td><td class="num">F(${q}, ${n-k}) = ${f4(fc)}</td><td class="num">${p4(CE.fp(F,q,n-k))}</td><td>${F>fc?"Rechaza":"No rechaza"}</td></tr></table></div>
      <p>Se cumple la desigualdad W ≥ LR ≥ LM (${f4(W)} ≥ ${f4(LR)} ≥ ${f4(LM)}): con muestras pequeñas pueden llevar a decisiones distintas, y el Wald es el que más rechaza.</p>`};
  $("cw-pre").onclick=()=>{[["cw-n",29],["cw-rr",0.364],["cw-ru",0.336],["cw-q",1],["cw-k",5]].forEach(([i,v])=>$(i).value=v);runW()};
  $("ce-wlm").querySelectorAll("input").forEach(el=>el.addEventListener("input",runW));
  bindSeg("ce-m",v=>{["datos","mat","rss","coef","wlm"].forEach(k=>$("ce-"+k).hidden=k!==v)});
  $("ce-al").addEventListener("input",()=>{runD();runM();runR();runC();runW()});
  setD("ej8");setM("d41");setR("e6");runC();runW()};

// ===================== LABORATORIO DE DATOS: subir una base, crear variables, estimar y probar =====================
// Todo se calcula en el navegador; los datos no salen del equipo. Usa CE (ejercicios_labs.js) y estadistica.js.
const DL={data:null,cols:[],name:"",model:null};
DL.XLSX_URL="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
DL.loadXLSX=()=>new Promise((ok,ko)=>{if(window.XLSX)return ok();const s=document.createElement("script");s.src=DL.XLSX_URL;s.onload=()=>ok();s.onerror=()=>ko(new Error("no se pudo cargar el lector de Excel (revisa la conexión)."));document.head.appendChild(s)});
DL.clean=s=>{let t=String(s==null?"":s).trim().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9_]+/g,"_").replace(/^_+|_+$/g,"");if(!t)t="v";if(/^\d/.test(t))t="v"+t;return t};
DL.num=v=>{if(typeof v==="number")return v;if(v==null)return NaN;let s=String(v).trim();if(s===""||/^(na|nan|null|\.|-)$/i.test(s))return NaN;
  if(/^-?[\d.]+,\d+$/.test(s))s=s.replace(/\./g,"").replace(",",".");else if(/^-?\d+,\d+$/.test(s))s=s.replace(",",".");else s=s.replace(/,(?=\d{3}(\D|$))/g,"");const x=Number(s);return isFinite(x)?x:NaN};
// matriz de texto → base {cols, data: {col: Float64[]}}
DL.fromRows=function(rows){rows=rows.filter(r=>r.some(c=>String(c==null?"":c).trim()!==""));if(rows.length<2)throw new Error("la base necesita al menos una fila de encabezados y una de datos.");
  const w=Math.max(...rows.map(r=>r.length)),first=rows[0],hasHead=first.some(c=>String(c).trim()!==""&&!isFinite(DL.num(c)));
  let heads=hasHead?first.map((c,j)=>DL.clean(c||("v"+(j+1)))):Array.from({length:w},(_,j)=>"v"+(j+1));const seen={};heads=heads.map(h=>{seen[h]=(seen[h]||0)+1;return seen[h]>1?h+"_"+seen[h]:h});
  const body=hasHead?rows.slice(1):rows,data={},cols=[],text={};
  for(let j=0;j<w;j++){const raw=body.map(r=>r[j]),nums=raw.map(DL.num),ok=nums.filter(isFinite).length;const h=heads[j]||("v"+(j+1));
    if(ok>=Math.max(1,0.6*raw.filter(x=>String(x==null?"":x).trim()!=="").length)){data[h]=nums;cols.push(h)}else{text[h]=raw.map(x=>String(x==null?"":x))}}
  // columnas de texto con pocas categorías → dummies
  Object.entries(text).forEach(([h,vals])=>{const lv=[...new Set(vals.filter(v=>v.trim()!==""))];if(lv.length>=2&&lv.length<=12){lv.slice(1).forEach(l=>{const nm=DL.clean(h+"_"+l);data[nm]=vals.map(v=>v===l?1:v.trim()===""?NaN:0);cols.push(nm)})}});
  if(!cols.length)throw new Error("no se encontraron columnas numéricas.");return{cols,data,n:body.length,text:Object.keys(text)}};
DL.parseText=function(t){const lines=t.replace(/\r/g,"").split("\n").filter(l=>l.trim()!=="");if(!lines.length)throw new Error("no hay datos.");
  const cand=["\t",";",","],cnt=d=>lines.slice(0,10).map(l=>l.split(d).length),d=cand.find(c=>{const k=cnt(c);return k[0]>1&&k.every(x=>x===k[0])})||(lines[0].includes("\t")?"\t":/\s{1,}/);
  const split=l=>{if(d===","){const o=[];let cur="",q=false;for(const ch of l){if(ch==='"'){q=!q;continue}if(ch===","&&!q){o.push(cur);cur=""}else cur+=ch}o.push(cur);return o}return typeof d==="string"?l.split(d).map(s=>s.replace(/^"|"$/g,"")):l.trim().split(d)};
  return DL.fromRows(lines.map(split))};
// ---------- estadística
DL.stats=v=>{const x=v.filter(isFinite),n=x.length;if(!n)return{n:0};const m=x.reduce((a,b)=>a+b,0)/n,s=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/Math.max(1,n-1)),o=[...x].sort((a,b)=>a-b);return{n,m,s,min:o[0],max:o[n-1],med:n%2?o[(n-1)/2]:(o[n/2-1]+o[n/2])/2,miss:v.length-n}};
DL.pt=(t,v)=>2*(1-tcdf(Math.abs(t),v));
DL.fit=function(yName,xNames,opt){const D=DL.data.data,N=DL.data.n,a=Math.max(1,opt.from||1)-1,b=Math.min(N,opt.to||N);const rows=[];
  for(let i=a;i<b;i++){const y=D[yName][i],xs=xNames.map(x=>D[x][i]);if(isFinite(y)&&xs.every(isFinite))rows.push(i)}
  const y=rows.map(i=>D[yName][i]),X=rows.map(i=>[...(opt.cte?[1]:[]),...xNames.map(x=>D[x][i])]),names=[...(opt.cte?["(Intercepto)"]:[]),...xNames];
  if(rows.length<=names.length)throw new Error(`hay ${rows.length} observaciones completas y ${names.length} parámetros: se necesitan más observaciones que parámetros.`);
  const R=CE.ols(X,y);if(!R)throw new Error("X′X no es invertible: hay colinealidad perfecta (una variable es combinación exacta de otras, o constante junto con el intercepto).");
  const n=y.length,k=names.length,yh=X.map(r=>r.reduce((s,v,j)=>s+v*R.b[j],0)),ym=y.reduce((s,v)=>s+v,0)/n,tssC=y.reduce((s,v)=>s+(v-ym)**2,0),tss=opt.cte?tssC:y.reduce((s,v)=>s+v*v,0);
  const r2=1-R.rss/tss,r2a=1-(1-r2)*(n-(opt.cte?1:0))/(n-k),ll=-n/2*(Math.log(2*Math.PI)+Math.log(R.rss/n)+1);
  // errores robustos HC1
  const meat=Array.from({length:k},()=>Array(k).fill(0));X.forEach((r,i)=>{const e2=R.e[i]**2;for(let p=0;p<k;p++)for(let q=0;q<k;q++)meat[p][q]+=e2*r[p]*r[q]});
  const Vr=CE.mm(CE.mm(R.I,meat),R.I).map(r=>r.map(v=>v*n/(n-k)));
  const q=opt.cte?k-1:k,F=q>0?((tss-R.rss)/q)/(R.rss/(n-k)):NaN;
  return{...R,y,X,yh,rows,names,n,k,r2,r2a,ll,aic:-2*ll+2*(k+1),bic:-2*ll+(k+1)*Math.log(n),seR:Vr.map((r,i)=>Math.sqrt(r[i])),Vr,F,qF:q,tss,yName,xNames,opt}};
DL.restr=(M,keep)=>{const X=M.X.map(r=>r.filter((_,j)=>keep.includes(j)));return keep.length?CE.ols(X,M.y):{rss:M.opt.cte?M.y.reduce((s,v)=>s+v*v,0):M.y.reduce((s,v)=>s+v*v,0)}};
// ---------- gráficos
DL.scatter=function({x,y,line,xl,yl,H=280,hz}){const W=600,xs=x.filter(isFinite),ys=[...y,...(line?line.map(p=>p[1]):[])].filter(isFinite);if(!xs.length)return"";let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  if(x0===x1){x0-=1;x1+=1}if(y0===y1){y0-=1;y1+=1}const px=(x1-x0)*.05,py=(y1-y0)*.08;x0-=px;x1+=px;y0-=py;y1+=py;const f=frame(W,H,[x0,x1],[y0,y1],ticks(x0,x1,nice((x1-x0)/5)),ticks(y0,y1,nice((y1-y0)/4)),xl,yl);
  let g="";if(hz!=null)g+=`<line x1="${f.sx(x0)}" x2="${f.sx(x1)}" y1="${f.sy(hz)}" y2="${f.sy(hz)}" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
  const step=Math.max(1,Math.floor(x.length/1500));for(let i=0;i<x.length;i+=step)if(isFinite(x[i])&&isFinite(y[i]))g+=`<circle cx="${f.sx(x[i]).toFixed(1)}" cy="${f.sy(y[i]).toFixed(1)}" r="3" fill="var(--line)" opacity=".65"/>`;
  if(line)g+=`<path d="${line.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(--exam)" stroke-width="2.4"/>`;
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${yl} frente a ${xl}">${f.g}${g}</svg></div>`};
DL.hist=function(v,xl){const x=v.filter(isFinite);if(x.length<3)return"";const W=600,H=230,n=x.length,k=Math.min(30,Math.max(5,Math.round(Math.sqrt(n)))),lo=Math.min(...x),hi=Math.max(...x),w=(hi-lo)/k||1,c=Array(k).fill(0);x.forEach(v=>c[Math.min(k-1,Math.floor((v-lo)/w))]++);
  const mx=Math.max(...c),f=frame(W,H,[lo,hi],[0,mx*1.1],ticks(lo,hi,nice((hi-lo)/5)),ticks(0,mx*1.1,nice(mx/4)),xl,"frecuencia");let g="";c.forEach((h,i)=>{g+=`<rect x="${f.sx(lo+i*w)+1}" y="${f.sy(h)}" width="${Math.max(1,f.sx(lo+(i+1)*w)-f.sx(lo+i*w)-2)}" height="${f.sy(0)-f.sy(h)}" fill="var(--line)" opacity=".75"/>`});
  const m=x.reduce((a,b)=>a+b,0)/n,s=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/(n-1));if(s>0){let d="";for(let i=0;i<=80;i++){const t=lo+(hi-lo)*i/80,yv=n*w*Math.exp(-(((t-m)/s)**2)/2)/(s*Math.sqrt(2*Math.PI));d+=(i?"L":"M")+f.sx(t).toFixed(1)+","+f.sy(yv).toFixed(1)}g+=`<path d="${d}" fill="none" stroke="var(--exam)" stroke-width="2"/>`}
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histograma">${f.g}${g}</svg></div>`};
// ---------- variables nuevas con una expresión segura
DL.FUN=["log","ln","exp","sqrt","abs","lag","dif","obs","si"];
DL.newVar=function(name,expr){const D=DL.data;name=DL.clean(name);if(!name)throw new Error("ponle un nombre a la variable.");
  const toks=expr.match(/\s+|[A-Za-z_][A-Za-z0-9_]*|\d+(?:[.,]\d+)?(?:e[+-]?\d+)?|>=|<=|==|!=|&&|\|\||[-+*/^(),<>!]/gi);if(!toks||toks.join("")!==expr)throw new Error("la expresión tiene caracteres no permitidos.");
  let js="";for(let t=0;t<toks.length;t++){const k=toks[t];if(/^\s+$/.test(k))continue;
    if(/^[A-Za-z_]/.test(k)){if(D.data[k]){js+=`C(i,"${k}")`;continue}const lk=k.toLowerCase();
      if(lk==="lag"||lk==="dif"){const m=expr.slice(toks.slice(0,t).join("").length).match(/^(lag|dif)\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?:,\s*(\d+))?\s*\)/i);if(!m||!D.data[m[2]])throw new Error(`${lk}() recibe el nombre de una variable, por ejemplo ${lk}(x) o lag(x, 2).`);
        const p=+(m[3]||1);js+=lk==="lag"?`C(i-${p},"${m[2]}")`:`(C(i,"${m[2]}")-C(i-${p},"${m[2]}"))`;let consumed=m[0].length,acc=0;while(acc<consumed){acc+=toks[t].length;t++}t--;continue}
      if(lk==="obs"){js+="(i+1)";continue}if(lk==="log"||lk==="ln"){js+="Math.log";continue}if(lk==="si"){js+="SI";continue}if(["exp","sqrt","abs"].includes(lk)){js+="Math."+lk;continue}
      throw new Error(`«${k}» no es una variable de la base ni una función permitida.`)}
    if(k==="^"){js+="**";continue}if(/^\d/.test(k)){js+=k.replace(",",".");continue}js+=k}
  let f;try{f=new Function("C","SI","i",`return (${js});`)}catch(e){throw new Error("la expresión está incompleta o mal escrita.")}
  const C=(i,c)=>i<0||i>=D.n?NaN:D.data[c][i],SI=(c,a,b)=>c?a:b,v=Array.from({length:D.n},(_,i)=>{const r=f(C,SI,i);return typeof r==="boolean"?(r?1:0):(isFinite(r)?r:NaN)});
  if(v.every(x=>!isFinite(x)))throw new Error("la variable nueva no tiene ningún valor válido (¿logaritmo de valores no positivos?).");
  if(!D.data[name])D.cols.push(name);D.data[name]=v;return name};
// ---------- ejemplos
DL.EJ={consumo:{t:"Consumo e ingreso (guerra y paz, ej. 8)",txt:"t\tY\tX\tpaz\n1\t1\t2\t0\n2\t2\t4\t0\n3\t2\t6\t0\n4\t4\t10\t0\n5\t6\t13\t0\n6\t1\t2\t1\n7\t3\t4\t1\n8\t3\t6\t1\n9\t5\t8\t1\n10\t6\t10\t1\n11\t6\t12\t1\n12\t7\t14\t1\n13\t9\t16\t1\n14\t9\t18\t1\n15\t11\t20\t1"},
 salarios:{t:"Salarios y experiencia por género (ej. 5)",txt:"sueldo\texper\tmujer\n3.14\t13\t0\n3.32\t16\t0\n3.61\t30\t0\n1.65\t2\t0\n2.64\t8\t0\n3.64\t31\t0\n2.46\t10\t0\n1.69\t1\t0\n1.91\t6\t0\n3.10\t15\t1\n1.98\t4\t1\n2.14\t7\t1\n2.61\t13\t1\n3.60\t27\t1\n3.38\t19\t1\n3.50\t25\t1\n3.65\t20\t1"},
 familias:{t:"Familias: consumo e ingreso (Dinardo 4.7)",txt:"Y,X,aumento\n70,80,0\n76,95,1\n91,105,0\n100,115,0\n105,125,1\n113,135,1\n122,145,0\n120,155,0\n146,165,1\n135,175,1\n147,185,1\n155,200,1"}};

SIMS.datos=function(){
  $("sim").innerHTML=`<div class="dl-load"><p class="hint">Sube un archivo <b>.csv</b>, <b>.txt</b>, <b>.xlsx</b> o <b>.xls</b>, o pega la tabla copiada de Excel con los nombres de las variables en la primera fila. Los datos se procesan solo en tu navegador: no se suben a ningún servidor.</p>
  <div class="calcf"><label>Archivo<input type="file" id="dl-file" accept=".csv,.txt,.tsv,.xlsx,.xls"></label><label id="dl-sheetw" hidden>Hoja<select id="dl-sheet"></select></label></div>
  <details class="dp-lite"><summary>Pegar datos o usar un ejemplo</summary><div class="chips pre" id="dl-ej" style="margin:8px 0">${Object.entries(DL.EJ).map(([k,v])=>`<button type="button" data-k="${k}">${v.t}</button>`).join("")}</div><textarea id="dl-paste" rows="6" class="ce-ta" spellcheck="false" placeholder="Y&#9;X1&#9;X2&#10;10&#9;3&#9;1&#10;…"></textarea><div class="chips pre" style="margin-top:6px"><button type="button" class="btn" id="dl-go">Cargar lo pegado</button></div></details>
  <div id="dl-msg"></div></div><div id="dl-main"></div>`;
  let wb=null;
  const msg=h=>$("dl-msg").innerHTML=h;
  const setData=(B,name)=>{DL.data=B;DL.name=name;DL.model=null;msg(`<p class="verdict ok">Base cargada: <b>${name}</b> · ${B.n} observaciones · ${B.cols.length} variables numéricas${B.text.length?` · columnas de texto convertidas en dummies o ignoradas: ${B.text.join(", ")}`:""}.</p>`);main()};
  const readSheet=nm=>{const ws=wb.Sheets[nm],rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:""});setData(DL.fromRows(rows),DL.fileName+" · "+nm)};
  $("dl-file").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;DL.fileName=f.name;msg(`<p class="hint">Leyendo ${f.name}…</p>`);$("dl-sheetw").hidden=true;
    try{if(/\.(xlsx|xls)$/i.test(f.name)){await DL.loadXLSX();wb=XLSX.read(await f.arrayBuffer(),{type:"array"});const sh=wb.SheetNames;$("dl-sheet").innerHTML=sh.map(s=>`<option>${esc(s)}</option>`).join("");$("dl-sheetw").hidden=sh.length<2;readSheet(sh[0])}
      else setData(DL.parseText(await f.text()),f.name)}catch(err2){msg(err(err2.message))}});
  $("dl-sheet").addEventListener("change",()=>{try{readSheet($("dl-sheet").value)}catch(e2){msg(err(e2.message))}});
  $("dl-go").onclick=()=>{try{setData(DL.parseText($("dl-paste").value),"datos pegados")}catch(e2){msg(err(e2.message))}};
  $("dl-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;$("dl-paste").value=DL.EJ[b.dataset.k].txt;try{setData(DL.parseText(DL.EJ[b.dataset.k].txt),DL.EJ[b.dataset.k].t)}catch(e2){msg(err(e2.message))}});

  function main(){const B=DL.data,C=B.cols;
    $("dl-main").innerHTML=`${seg("dl-tab","Sección",[["base","1. La base"],["var","2. Crear variables"],["mod","3. Estimar"],["prue","4. Pruebas"],["dem","5. Demostraciones"],["graf","6. Gráficos"],["r","7. Código R"]],"base")}
    <div id="dl-base"></div><div id="dl-var" hidden></div><div id="dl-mod" hidden></div><div id="dl-prue" hidden></div><div id="dl-dem" hidden></div><div id="dl-graf" hidden></div><div id="dl-r" hidden></div>`;
    const tabs=["base","var","mod","prue","dem","graf","r"];let cur="base";
    bindSeg("dl-tab",v=>{cur=v;tabs.forEach(t=>$("dl-"+t).hidden=t!==v);render(v)});
    const sel=(id,lab,opts,v)=>`<label>${lab}<select id="${id}">${opts.map(o=>`<option value="${o}" ${o===v?"selected":""}>${o}</option>`).join("")}</select></label>`;
    function needModel(){if(!DL.model){return`<p class="warn"><b>Primero estima un modelo</b> en la sección 3.</p>`}return""}
    function render(v){
      if(v==="base"){const st=C.map(c=>[c,DL.stats(B.data[c])]);
        $("dl-base").innerHTML=`<h4 class="subh">Primeras filas</h4><div class="tbl"><table><tr><th>#</th>${C.map(c=>`<th>${c}</th>`).join("")}</tr>${Array.from({length:Math.min(8,B.n)},(_,i)=>`<tr><td>${i+1}</td>${C.map(c=>`<td class="num">${isFinite(B.data[c][i])?fm(B.data[c][i]):"NA"}</td>`).join("")}</tr>`).join("")}</table></div>
        <h4 class="subh">Estadísticas descriptivas</h4><div class="tbl"><table><tr><th>Variable</th><th>n</th><th>Media</th><th>Desv. est.</th><th>Mín.</th><th>Mediana</th><th>Máx.</th><th>Faltantes</th></tr>${st.map(([c,s])=>`<tr><td>${c}</td><td class="num">${s.n}</td><td class="num">${f4(s.m)}</td><td class="num">${f4(s.s)}</td><td class="num">${fm(s.min)}</td><td class="num">${fm(s.med)}</td><td class="num">${fm(s.max)}</td><td class="num">${s.miss}</td></tr>`).join("")}</table></div>
        ${C.length<=12?`<h4 class="subh">Matriz de correlaciones</h4><div class="tbl"><table><tr><th></th>${C.map(c=>`<th>${c}</th>`).join("")}</tr>${C.map(a=>`<tr><td>${a}</td>${C.map(b=>{const ok=B.data[a].map((v,i)=>isFinite(v)&&isFinite(B.data[b][i])?i:-1).filter(i=>i>=0),x=ok.map(i=>B.data[a][i]),y=ok.map(i=>B.data[b][i]),mx=x.reduce((s,v)=>s+v,0)/x.length,my=y.reduce((s,v)=>s+v,0)/y.length;let sxy=0,sxx=0,syy=0;x.forEach((v,i)=>{sxy+=(v-mx)*(y[i]-my);sxx+=(v-mx)**2;syy+=(y[i]-my)**2});return`<td class="num">${fmt(sxy/Math.sqrt(sxx*syy),3)}</td>`}).join("")}</tr>`).join("")}</table></div>`:""}`}
      if(v==="var"){$("dl-var").innerHTML=`<p class="lead">Crea variables con una expresión. Usa los nombres de la base tal como aparecen.</p>
        <div class="calcf">${txt("dv-n","Nombre","lny")}${txt("dv-e","Expresión",`log(${C[0]})`)}</div><div class="chips pre" style="margin:6px 0"><button type="button" class="btn" id="dv-go">Crear variable</button></div><div id="dv-out"></div>
        <div class="tbl"><table><tr><th>Escribe</th><th>Obtienes</th></tr><tr><td><code>log(x)</code></td><td>logaritmo natural</td></tr><tr><td><code>x^2</code>, <code>x*z</code></td><td>cuadrado e interacción</td></tr><tr><td><code>lag(x)</code>, <code>lag(x, 4)</code>, <code>dif(x)</code></td><td>rezago y primera diferencia</td></tr><tr><td><code>obs</code></td><td>número de la observación (tendencia)</td></tr><tr><td><code>obs &gt;= 13</code></td><td>dummy de quiebre: 1 desde la observación 13</td></tr><tr><td><code>(x &gt; 100)*1</code>, <code>si(x &gt; 100, 1, 0)</code></td><td>dummy por condición</td></tr><tr><td><code>D*x</code></td><td>interacción de una dummy con x (cambio de pendiente)</td></tr></table></div>
        <p class="hint">Las variables creadas viven mientras la página esté abierta.</p>`;
        $("dv-go").onclick=()=>{try{const nm=DL.newVar($("dv-n").value,$("dv-e").value),s=DL.stats(B.data[nm]);$("dv-out").innerHTML=`<p class="verdict ok">Variable <b>${nm}</b> creada: ${s.n} valores válidos, media ${f4(s.m)}. En R: <code>datos$${nm} &lt;- ${DL.rExpr($("dv-e").value)}</code></p>`;DL.created=(DL.created||[]).filter(x=>x[0]!==nm).concat([[nm,$("dv-e").value]])}catch(e2){$("dv-out").innerHTML=err(e2.message)}}}
      if(v==="mod"){const M=DL.model,y0=M?M.yName:C[0],xs0=M?M.xNames:C.slice(1,Math.min(C.length,3));
        $("dl-mod").innerHTML=`<div class="calcf">${sel("dm-y","Variable dependiente (Y)",C,y0)}${num("dm-a","Desde la observación",M?M.opt.from:1,1)}${num("dm-b","Hasta la observación",M?M.opt.to:B.n,1)}<label class="chkl"><input type="checkbox" id="dm-c" ${!M||M.opt.cte?"checked":""}> Con intercepto</label><label class="chkl"><input type="checkbox" id="dm-r" ${M&&M.opt.rob?"checked":""}> Errores robustos (HC1)</label></div>
        <p class="lbl" style="margin:10px 0 4px">Variables explicativas (X)</p><div class="chips" id="dm-x">${C.map(c=>`<label class="chkl"><input type="checkbox" value="${c}" ${xs0.includes(c)?"checked":""}> ${c}</label>`).join("")}</div>
        <div class="chips pre" style="margin:10px 0"><button type="button" class="btn" id="dm-go">Estimar por MCO</button></div><div id="dm-out"></div>`;
        const go=()=>{const y=$("dm-y").value,xs=[...$("dm-x").querySelectorAll("input:checked")].map(i=>i.value).filter(x=>x!==y);
          try{DL.model=DL.fit(y,xs,{cte:$("dm-c").checked,rob:$("dm-r").checked,from:V("dm-a"),to:V("dm-b")});$("dm-out").innerHTML=DL.out(DL.model)}catch(e2){DL.model=null;$("dm-out").innerHTML=err(e2.message)}};
        $("dm-go").onclick=go;if(M)$("dm-out").innerHTML=DL.out(M)}
      if(v==="prue"){const M=DL.model;if(!M){$("dl-prue").innerHTML=needModel();return}
        $("dl-prue").innerHTML=`${seg("dp-t","Prueba",[["f","F de restricciones"],["chow","Cambio estructural"],["het","Heterocedasticidad"],["aut","Autocorrelación"],["norm","Normalidad"],["esp","Especificación"]],"f")}<div id="dp-out"></div>`;
        const show=t=>{$("dp-out").innerHTML=DL.test(M,t);if(t==="f"){const run=()=>{const sel2=[...$("dpf-c").querySelectorAll("input:checked")].map(i=>+i.value);$("dpf-o").innerHTML=DL.ftest(M,sel2)};$("dpf-c").addEventListener("change",run);run()}
          if(t==="chow"){const run=()=>{$("dpc-o").innerHTML=DL.chow(M,Math.round(V("dpc-n")))};$("dpc-n").addEventListener("input",run);run()}};
        bindSeg("dp-t",show);show("f")}
      if(v==="dem"){$("dl-dem").innerHTML=DL.model?DL.demo(DL.model):needModel();if(DL.model){const run=()=>{$("dd-fwl").innerHTML=DL.fwl(DL.model,+$("dd-x").value)};$("dd-x").addEventListener("change",run);run()}}
      if(v==="graf"){const M=DL.model;$("dl-graf").innerHTML=`<div class="calcf">${sel("dg-x","Eje X",C,M&&M.xNames[0]||C[1]||C[0])}${sel("dg-y","Eje Y",C,M?M.yName:C[0])}</div><div id="dg-o"></div>${M?`<h4 class="subh">Residuos frente a valores ajustados</h4>${DL.scatter({x:M.yh,y:M.e,xl:"Ŷ",yl:"residuo",hz:0})}<h4 class="subh">Residuos en el orden de la base</h4>${DL.scatter({x:M.rows.map(i=>i+1),y:M.e,xl:"observación",yl:"residuo",hz:0})}<h4 class="subh">Histograma de los residuos con la normal</h4>${DL.hist(M.e,"residuo")}`:needModel()}`;
        const run=()=>{const xa=$("dg-x").value,ya=$("dg-y").value,x=B.data[xa],y=B.data[ya],ok=x.map((v,i)=>isFinite(v)&&isFinite(y[i])?i:-1).filter(i=>i>=0);let line=null,txt2="";
          if(ok.length>2){const R=CE.ols(ok.map(i=>[1,x[i]]),ok.map(i=>y[i]));if(R){const lo=Math.min(...ok.map(i=>x[i])),hi=Math.max(...ok.map(i=>x[i]));line=[[lo,R.b[0]+R.b[1]*lo],[hi,R.b[0]+R.b[1]*hi]];txt2=`<p class="hint">Recta de MCO simple: ${ya} = ${f4(R.b[0])} ${R.b[1]<0?"−":"+"} ${f4(Math.abs(R.b[1]))}·${xa} · R² = ${f4(R.r2)}</p>`}}
          $("dg-o").innerHTML=DL.scatter({x,y,line,xl:xa,yl:ya})+txt2};$("dg-x").addEventListener("change",run);$("dg-y").addEventListener("change",run);run()}
      if(v==="r"){$("dl-r").innerHTML=DL.rcode();if(typeof prettyCode==="function")prettyCode($("dl-r"))}}
    render(cur)}};

DL.out=function(M){const se=M.opt.rob?M.seR:M.se,gl=M.n-M.k,tc=CE.tcrit(gl,0.05);
  const eq=`${M.yName} = ${M.b.map((b,j)=>`${j?(b<0?"− ":"+ "):b<0?"−":""}${f4(Math.abs(b))}${M.names[j]==="(Intercepto)"?"":"·"+M.names[j]}`).join(" ")}`;
  return`<div class="eq">${eq}</div><div class="tbl"><table><tr><th>Variable</th><th>Coeficiente</th><th>Error est.${M.opt.rob?" (robusto)":""}</th><th>t</th><th>p-valor</th><th>IC 95 %</th></tr>${M.b.map((b,j)=>{const t=b/se[j],p=DL.pt(t,gl);return`<tr><td>${M.names[j]}</td><td class="num">${f4(b)}</td><td class="num">${f4(se[j])}</td><td class="num">${fmt(t,3)}</td><td class="num">${p4(p)}${p<0.01?" ***":p<0.05?" **":p<0.1?" *":""}</td><td class="num">[${f4(b-tc*se[j])}; ${f4(b+tc*se[j])}]</td></tr>`}).join("")}</table></div>
  <div class="res">${tiles([["n",String(M.n)],["k",String(M.k)],["R²",f4(M.r2)],["R² ajustado",f4(M.r2a)],["s (error est. de la regresión)",f4(Math.sqrt(M.s2))],["SCR",f4(M.rss)],[`F global (${M.qF}, ${gl})`,isFinite(M.F)?`${f4(M.F)} · p ${p4(CE.fp(M.F,M.qF,gl))}`:"—"],["AIC / BIC",`${fmt(M.aic,2)} / ${fmt(M.bic,2)}`]])}</div>
  <p class="hint">*** p &lt; 0,01 · ** p &lt; 0,05 · * p &lt; 0,1. ${M.opt.cte?"":"Sin intercepto el R² se calcula sin centrar."}</p>
  ${M.k<=6?`<details class="dp-lite"><summary>Ver las matrices: X′X, X′y y (X′X)⁻¹</summary>${[["X′X",M.XtX],["(X′X)⁻¹",M.I]].map(([t,A])=>`<p><b>${t}</b></p><div class="tbl"><table>${A.map(r=>`<tr>${r.map(v=>`<td class="num">${fmt(v,6)}</td>`).join("")}</tr>`).join("")}</table></div>`).join("")}<p><b>X′y</b> = [${M.Xty.map(v=>fmt(v,4)).join("; ")}] → b = (X′X)⁻¹X′y = [${M.b.map(f4).join("; ")}]</p></details>`:""}`};
DL.test=function(M,t){const ix=M.names.map((n,j)=>[n,j]);
  if(t==="f")return`<p>Marca los coeficientes que quieres probar conjuntamente iguales a cero (H₀: todos = 0).</p><div class="chips" id="dpf-c">${ix.map(([n,j])=>`<label class="chkl"><input type="checkbox" value="${j}" ${n!=="(Intercepto)"?"checked":""}> ${n}</label>`).join("")}</div><div id="dpf-o"></div>`;
  if(t==="chow")return`<div class="calcf">${num("dpc-n","El segundo periodo empieza en la observación (del modelo)",Math.floor(M.n/2)+1,1)}</div><div id="dpc-o"></div>`;
  const n=M.n,k=M.k,e=M.e,a=0.05;
  if(t==="het"){const e2=e.map(v=>v*v),Z=M.X,Rb=CE.ols(Z,e2),bp=n*Rb.r2,qb=k-(M.opt.cte?1:0);
    const xs=M.X.map(r=>r.slice(M.opt.cte?1:0)),m=xs[0].length;let wh="";if(m>=1&&m<=4){const pairs=[];for(let i=0;i<m;i++)for(let j=i;j<m;j++){const col=xs.map(r=>r[i]*r[j]);if(!(i===j&&xs.every((r,q)=>Math.abs(col[q]-r[i])<1e-12)))pairs.push(col)}const W2=xs.map((r,q)=>[1,...r,...pairs.map(c=>c[q])]),Rw=CE.ols(W2,e2);if(Rw){const qw=W2[0].length-1,lm=n*Rw.r2;wh=`<tr><td>White (niveles, cuadrados y productos cruzados)</td><td class="num">${f4(lm)}</td><td class="num">χ²(${qw}) = ${f4(CE.ccrit(qw,a))}</td><td class="num">${p4(1-chi2cdf(lm,qw))}</td></tr>`}}
    return`<p>H₀: varianza constante (homocedasticidad). Se regresa e² sobre las variables y LM = n·R² de esa regresión auxiliar.</p><div class="tbl"><table><tr><th>Prueba</th><th>LM</th><th>Crítico al 5 %</th><th>p-valor</th></tr><tr><td>Breusch-Pagan (sobre las X del modelo)</td><td class="num">${f4(bp)}</td><td class="num">χ²(${qb}) = ${f4(CE.ccrit(qb,a))}</td><td class="num">${p4(1-chi2cdf(bp,qb))}</td></tr>${wh}</table></div><p>Si se rechaza H₀, los errores estándar de MCO no son válidos: usa errores robustos (HC1) en la sección 3.</p>`}
  if(t==="aut"){let num2=0;for(let i=1;i<n;i++)num2+=(e[i]-e[i-1])**2;const dw=num2/M.rss,X1=M.X.map((r,i)=>[...r,i?e[i-1]:0]),Rg=CE.ols(X1,e),bg=Rg?n*Rg.r2:NaN;
    return`<p>Tiene sentido con datos ordenados en el tiempo. H₀: no hay autocorrelación de orden 1.</p><div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Lectura</th></tr><tr><td>Durbin-Watson</td><td class="num">${f4(dw)}</td><td>${dw<1.5?"Cerca de 0: autocorrelación positiva probable":dw>2.5?"Cerca de 4: autocorrelación negativa probable":"Cerca de 2: sin evidencia fuerte"} (compara con d<sub>L</sub> y d<sub>U</sub> de la tabla para n = ${n} y k′ = ${k-(M.opt.cte?1:0)})</td></tr><tr><td>Breusch-Godfrey (orden 1)</td><td class="num">LM = ${f4(bg)}</td><td>χ²(1) = 3,8415 · p = ${p4(1-chi2cdf(bg,1))}</td></tr></table></div><p>ρ̂ ≈ 1 − DW/2 = ${f4(1-dw/2)}.</p>`}
  if(t==="norm"){const m3=e.reduce((s,v)=>s+v**3,0)/n,m2=M.rss/n,m4=e.reduce((s,v)=>s+v**4,0)/n,S=m3/m2**1.5,K=m4/m2**2,jb=n/6*(S*S+(K-3)**2/4);
    return`<p>H₀: los errores son normales. JB = n/6·[S² + (K − 3)²/4].</p><div class="res">${tiles([["Asimetría S",f4(S)],["Curtosis K",f4(K)],["Jarque-Bera",f4(jb)],["p-valor",p4(1-chi2cdf(jb,2))]])}</div><p>${jb>5.991?"Se rechaza la normalidad al 5 %: con muestras pequeñas, las pruebas t y F son solo aproximadas.":"No se rechaza la normalidad al 5 %."}</p>${DL.hist(e,"residuo")}`}
  if(t==="esp"){const X2=M.X.map((r,i)=>[...r,M.yh[i]**2,M.yh[i]**3]),R2=CE.ols(X2,M.y);let reset="";if(R2){const F=((M.rss-R2.rss)/2)/(R2.rss/(n-k-2));reset=`<tr><td>RESET de Ramsey (Ŷ² y Ŷ³)</td><td class="num">F = ${f4(F)}</td><td class="num">F(2, ${n-k-2}) = ${f4(CE.fcrit(2,n-k-2,a))} · p = ${p4(CE.fp(F,2,n-k-2))}</td></tr>`}
    const xs=M.names.map((nm,j)=>[nm,j]).filter(([nm])=>nm!=="(Intercepto)");let vif="";if(xs.length>=2){vif=xs.map(([nm,j])=>{const others=M.X.map(r=>r.filter((_,q)=>q!==j)),Rv=CE.ols(others.map(r=>M.opt.cte?r:[1,...r]),M.X.map(r=>r[j]));const v=Rv?1/(1-Rv.r2):NaN;return`<tr><td>${nm}</td><td class="num">${fmt(v,3)}</td><td>${v>10?"Multicolinealidad alta":v>5?"Moderada":"Baja"}</td></tr>`}).join("")}
    return`<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Crítico y p</th></tr>${reset}</table></div><p>H₀ de RESET: la forma funcional es correcta. Si se rechaza, prueba logaritmos, cuadrados o interacciones.</p>${vif?`<h4 class="subh">Factor de inflación de la varianza (VIF)</h4><div class="tbl"><table><tr><th>Variable</th><th>VIF</th><th>Lectura</th></tr>${vif}</table></div>`:""}`}
  return""};
DL.ftest=function(M,sel){if(!sel.length)return`<p class="hint">Marca al menos un coeficiente.</p>`;const keep=M.names.map((_,j)=>j).filter(j=>!sel.includes(j)),q=sel.length,n=M.n,k=M.k,a=0.05;
  const Xr=M.X.map(r=>keep.map(j=>r[j])),rssR=keep.length?CE.ols(Xr,M.y).rss:M.y.reduce((s,v)=>s+v*v,0),F=((rssR-M.rss)/q)/(M.rss/(n-k)),cr=CE.fcrit(q,n-k,a),p=CE.fp(F,q,n-k);
  const Rm=sel.map(j=>M.names.map((_,c)=>c===j?1:0)),Rb=sel.map(j=>M.b[j]),Vu=CE.inv(CE.mm(CE.mm(Rm,M.opt.rob?M.Vr.map(r=>r.map(v=>v/M.s2)):M.I),CE.T(Rm))),Fw=Rb.reduce((s,v,i)=>s+v*Vu[i].reduce((t,mm,j)=>t+mm*Rb[j],0),0)/(q*M.s2);
  const W=n*(rssR-M.rss)/M.rss,LR=n*Math.log(rssR/M.rss),LM=n*(rssR-M.rss)/rssR;
  return`<div class="eq">H₀: ${sel.map(j=>`β(${M.names[j]})`).join(" = ")} = 0</div><div class="eq al chain">F = [(SCR_R − SCR_NR)/q] / [SCR_NR/(n − k)] = [(${f4(rssR)} − ${f4(M.rss)})/${q}] / [${f4(M.rss)}/${n-k}] = <b>${f4(F)}</b><br>Forma matricial (Rb)′[R(X′X)⁻¹R′]⁻¹(Rb)/(q·s²) = ${f4(Fw)}${M.opt.rob?" (con la matriz robusta)":""}</div>
  <div class="res">${tiles([["F",f4(F)],[`F crítico (${q}, ${n-k})`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["las variables marcadas no son conjuntamente significativas.","al menos una de las variables marcadas es significativa."])}
  <p>Asintóticas: W = ${f4(W)}, LR = ${f4(LR)}, LM = ${f4(LM)} frente a χ²(${q}) = ${f4(CE.ccrit(q,a))}.</p>`};
DL.chow=function(M,s){const n=M.n,k=M.k,a=0.05;if(!(s>k+1&&s<=n-k)){return err(`el quiebre debe dejar más de ${k} observaciones en cada periodo (entre ${k+2} y ${n-k}).`)}
  const n1=s-1,n2=n-n1,X1=M.X.slice(0,n1),X2=M.X.slice(n1),R1=CE.ols(X1,M.y.slice(0,n1)),R2=CE.ols(X2,M.y.slice(n1));if(!R1||!R2)return err("alguno de los periodos tiene X′X no invertible (por ejemplo, una dummy constante dentro del periodo).");
  const F=((M.rss-R1.rss-R2.rss)/k)/((R1.rss+R2.rss)/(n-2*k)),cr=CE.fcrit(k,n-2*k,a),p=CE.fp(F,k,n-2*k),Fp=((M.rss-R1.rss)/n2)/(R1.rss/(n1-k)),crp=CE.fcrit(n2,n1-k,a),pp=CE.fp(Fp,n2,n1-k);
  return`<p>Periodo 1: observaciones 1 a ${n1} del modelo (fila ${M.rows[0]+1} a ${M.rows[n1-1]+1} de la base). Periodo 2: ${n2} observaciones.</p>
  <div class="tbl"><table><tr><th>Modelo</th><th>Coeficientes</th><th>SCR</th></tr><tr><td>Toda la muestra</td><td>${M.b.map(f4).join("; ")}</td><td class="num">${f4(M.rss)}</td></tr><tr><td>Periodo 1</td><td>${R1.b.map(f4).join("; ")}</td><td class="num">${f4(R1.rss)}</td></tr><tr><td>Periodo 2</td><td>${R2.b.map(f4).join("; ")}</td><td class="num">${f4(R2.rss)}</td></tr></table></div>
  <div class="eq al chain">Chow: F = [(${f4(M.rss)} − ${f4(R1.rss)} − ${f4(R2.rss)})/${k}] / [${f4(R1.rss+R2.rss)}/${n-2*k}] = <b>${f4(F)}</b> &nbsp; F(${k}, ${n-2*k}) = ${f4(cr)} · p = ${p4(p)}<br>Pronósticos de Chow: F = [(${f4(M.rss)} − ${f4(R1.rss)})/${n2}] / [${f4(R1.rss)}/${n1-k}] = <b>${f4(Fp)}</b> &nbsp; F(${n2}, ${n1-k}) = ${f4(crp)} · p = ${p4(pp)}</div>
  ${veredicto(F,cr,p,a,["no hay evidencia de cambio estructural en ese punto.","hay cambio estructural: los coeficientes no son los mismos en los dos periodos."])}
  <p class="hint">Para la versión con dummies, crea en la sección 2 una dummy <code>obs &gt;= ${M.rows[n1]+1}</code> y sus interacciones, y prueba con la F de restricciones que todos sus coeficientes son cero: da el mismo F.</p>`};
DL.demo=function(M){const n=M.n,se=M.e.reduce((s,v)=>s+v,0),Xe=M.names.map((_,j)=>M.X.reduce((s,r,i)=>s+r[j]*M.e[i],0)),ym=M.y.reduce((s,v)=>s+v,0)/n,yhm=M.yh.reduce((s,v)=>s+v,0)/n;
  const cor=(a,b)=>{const ma=a.reduce((s,v)=>s+v,0)/a.length,mb=b.reduce((s,v)=>s+v,0)/b.length;let sab=0,saa=0,sbb=0;a.forEach((v,i)=>{sab+=(v-ma)*(b[i]-mb);saa+=(v-ma)**2;sbb+=(b[i]-mb)**2});return sab/Math.sqrt(saa*sbb)};
  const sce=M.yh.reduce((s,v)=>s+(v-ym)**2,0),tss=M.y.reduce((s,v)=>s+(v-ym)**2,0),cy=cor(M.y,M.yh),ce=cor(M.yh,M.e),cte=M.opt.cte;
  const xs=M.names.map((nm,j)=>[nm,j]).filter(([nm])=>nm!=="(Intercepto)");
  return`<p class="lead">Propiedades algebraicas de MCO comprobadas con tus datos. Las diferencias del orden de 10⁻¹⁰ son errores de redondeo de la computadora: en teoría son cero.</p>
  <div class="tbl"><table><tr><th>Propiedad</th><th>Por qué se cumple</th><th>Con tus datos</th></tr>
  <tr><td>X′e = 0</td><td>Son las ecuaciones normales: X′(y − Xb) = 0</td><td class="num">${Xe.map(v=>fmt(v,10)).join("; ")}</td></tr>
  <tr><td>Σeᵢ = 0</td><td>${cte?"La primera ecuación normal, porque hay intercepto":"Sin intercepto no tiene por qué cumplirse"}</td><td class="num">${fmt(se,10)}</td></tr>
  <tr><td>Media de Ŷ = media de Y</td><td>${cte?"Porque Σe = 0":"Solo con intercepto"}</td><td class="num">${f4(yhm)} vs ${f4(ym)}</td></tr>
  <tr><td>corr(Ŷ, e) = 0</td><td>Ŷ = Xb es combinación de las X, ortogonales a e</td><td class="num">${fmt(ce,10)}</td></tr>
  <tr><td>STC = SCE + SCR</td><td>${cte?"Descomposición de la varianza con intercepto":"Solo vale con intercepto"}</td><td class="num">${f4(tss)} vs ${f4(sce)} + ${f4(M.rss)} = ${f4(sce+M.rss)}</td></tr>
  <tr><td>R² = corr(Y, Ŷ)²</td><td>${cte?"Con intercepto, R² es la correlación al cuadrado":"Solo con intercepto"}</td><td class="num">${f4(M.r2)} vs ${f4(cy*cy)}</td></tr>
  <tr><td>s² = SCR/(n − k)</td><td>Estimador insesgado de σ²</td><td class="num">${f4(M.rss)}/${n-M.k} = ${f4(M.s2)}</td></tr></table></div>
  ${xs.length>=2?`<h4 class="subh">Teorema de Frisch-Waugh-Lovell</h4><p>El coeficiente de una variable en la regresión múltiple es igual al de regresar los residuos de Y (sobre las demás X) en los residuos de esa variable (sobre las demás X).</p><div class="calcf"><label>Variable<select id="dd-x">${xs.map(([nm,j])=>`<option value="${j}">${nm}</option>`).join("")}</select></label></div><div id="dd-fwl"></div>`:`<p class="hint">Con dos o más variables explicativas aparece aquí la demostración del teorema de Frisch-Waugh-Lovell.</p><select id="dd-x" hidden><option value="0">0</option></select><div id="dd-fwl"></div>`}`};
DL.fwl=function(M,j){if(M.names.length<3||M.names[j]==="(Intercepto)")return"";const others=M.X.map(r=>r.filter((_,q)=>q!==j)),Ry=CE.ols(others,M.y),Rx=CE.ols(others,M.X.map(r=>r[j]));if(!Ry||!Rx)return"";
  const ey=Ry.e,ex=Rx.e,b=ey.reduce((s,v,i)=>s+v*ex[i],0)/ex.reduce((s,v)=>s+v*v,0);
  return`<div class="eq al chain">1) Y sobre las demás X → residuos ẽ<sub>y</sub> &nbsp; 2) ${M.names[j]} sobre las demás X → residuos ẽ<sub>x</sub><br>3) b = Σẽ<sub>x</sub>ẽ<sub>y</sub> / Σẽ<sub>x</sub>² = <b>${fmt(b,6)}</b> &nbsp; frente a la regresión múltiple: <b>${fmt(M.b[j],6)}</b></div><p>Coinciden: el coeficiente mide el efecto de ${M.names[j]} una vez «limpiado» del efecto de las demás variables. Por eso se interpreta como un efecto <i>ceteris paribus</i>.</p>`};
DL.rExpr=e=>e.replace(/\bln\(/g,"log(").replace(/\bobs\b/g,"seq_len(nrow(datos))").replace(/\bsi\(/g,"ifelse(").replace(/\bdif\(\s*([A-Za-z_]\w*)\s*\)/g,"c(NA, diff(datos$$$1))").replace(/\blag\(\s*([A-Za-z_]\w*)\s*(?:,\s*(\d+))?\s*\)/g,(m,v,k)=>`dplyr::lag(datos$${v}, ${k||1})`).replace(/\b([A-Za-z_]\w*)\b(?!\s*\()/g,(m,v)=>DL.data&&DL.data.data[v]?`datos$${v}`:m).replace(/datos\$datos\$/g,"datos$");
DL.rcode=function(){const M=DL.model,f=DL.fileName||"mis_datos.csv",xl=/\.(xlsx|xls)$/i.test(f);
  const read=xl?`library(readxl)\ndatos <- read_excel("${f}")`:`datos <- read.csv("${f}")   # si usa ; y coma decimal: read.csv2("${f}")`;
  const nv=(DL.created||[]).map(([n,e])=>`datos$${n} <- ${DL.rExpr(e)}`).join("\n");
  if(!M)return`<pre class="ce-code">${esc(read)}\nnames(datos) &lt;- make.names(names(datos))\nsummary(datos)\n${esc(nv)}</pre><p class="hint">Estima un modelo en la sección 3 y aquí aparece el código completo.</p>`;
  const fx=`${M.yName} ~ ${M.xNames.length?M.xNames.join(" + "):"1"}${M.opt.cte?"":" - 1"}`,sub=(M.opt.from>1||M.opt.to<DL.data.n)?`datos <- datos[${M.opt.from}:${M.opt.to}, ]\n`:"";
  return`<p>Este script reproduce en R lo que hiciste aquí. Guárdalo junto al archivo de datos y ejecútalo en RStudio.</p><pre class="ce-code">${esc(`# Paquetes (una sola vez): install.packages(c("lmtest", "sandwich", "car", "strucchange", "tseries"${xl?', "readxl"':""}))
${read}
names(datos) <- make.names(names(datos))   # nombres sin espacios ni tildes
summary(datos)
${nv?nv+"\n":""}${sub}
m <- lm(${fx}, data = datos)
summary(m)                         # coeficientes, R², F global
confint(m)                         # intervalos al 95 %
library(lmtest); library(sandwich); library(car)
coeftest(m, vcov = vcovHC(m, type = "HC1"))   # errores robustos
linearHypothesis(m, c(${M.names.filter(n=>n!=="(Intercepto)").map(n=>`"${n} = 0"`).join(", ")}))   # F de restricciones
bptest(m)                          # Breusch-Pagan
dwtest(m); bgtest(m, order = 1)    # autocorrelación
tseries::jarque.bera.test(resid(m))
resettest(m, power = 2:3)          # RESET
${M.xNames.length>=2?"vif(m)                             # multicolinealidad\n":""}
# Cambio estructural en la observación n1 + 1
library(strucchange)
n1 <- ${Math.floor(M.n/2)}
sctest(${fx}, data = datos, type = "Chow", point = n1)
plot(efp(${fx}, data = datos, type = "Rec-CUSUM"))

# Gráficos
plot(fitted(m), resid(m)); abline(h = 0, lty = 2)
hist(resid(m), freq = FALSE); curve(dnorm(x, 0, sd(resid(m))), add = TRUE)`)}</pre>`};
