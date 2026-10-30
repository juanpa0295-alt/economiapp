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
