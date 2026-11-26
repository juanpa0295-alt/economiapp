// Economiapp · motor de los «árboles de fórmulas»: árbol del algoritmo, hoja seleccionable, micropasos y escenas 3D.
// Cada materia aporta su archivo de datos con AF.iniciar(fabrica): la fábrica recibe las utilidades y devuelve
// {NODES, TREE, GL, CS, DOC, SC, inicio, clave}. Ver fuente/arbol/LEEME.md.
window.AF={iniciar(fab){
/* ---------- utilidades numéricas ---------- */
const lg=z=>{const c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];if(z<0.5)return Math.log(Math.PI/Math.sin(Math.PI*z))-lg(1-z);z-=1;let x=c[0];for(let i=1;i<9;i++)x+=c[i]/(z+i);const t=z+7.5;return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x)};
function bcf(a,b,x){const T=1e-300;let qab=a+b,qap=a+1,qam=a-1,c=1,d=1-qab*x/qap;if(Math.abs(d)<T)d=T;d=1/d;let h=d;for(let m=1;m<=300;m++){const m2=2*m;let aa=m*(b-m)*x/((qam+m2)*(a+m2));d=1+aa*d;if(Math.abs(d)<T)d=T;c=1+aa/c;if(Math.abs(c)<T)c=T;d=1/d;h*=d*c;aa=-(a+m)*(qab+m)*x/((a+m2)*(qap+m2));d=1+aa*d;if(Math.abs(d)<T)d=T;c=1+aa/c;if(Math.abs(c)<T)c=T;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<3e-14)break}return h}
const ibeta=(x,a,b)=>{if(x<=0)return 0;if(x>=1)return 1;const bt=Math.exp(lg(a+b)-lg(a)-lg(b)+a*Math.log(x)+b*Math.log(1-x));return x<(a+1)/(a+b+2)?bt*bcf(a,b,x)/a:1-bt*bcf(b,a,1-x)/b};
function gincP(a,x){if(x<=0)return 0;if(x<a+1){let s=1/a,t=s;for(let n=1;n<500;n++){t*=x/(a+n);s+=t;if(Math.abs(t)<Math.abs(s)*1e-15)break}return s*Math.exp(-x+a*Math.log(x)-lg(a))}let b=x+1-a,c=1e300,d=1/b,h=d;for(let i=1;i<500;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const del=d*c;h*=del;if(Math.abs(del-1)<1e-15)break}return 1-Math.exp(-x+a*Math.log(x)-lg(a))*h}
const cdf=(t,x,d1,d2)=>t==='F'?ibeta(d1*x/(d1*x+d2),d1/2,d2/2):gincP(d1/2,x/2);
const pdf=(t,x,d1,d2)=>{if(x<=0)return 0;return t==='F'?Math.exp(lg((d1+d2)/2)-lg(d1/2)-lg(d2/2)+(d1/2)*Math.log(d1/d2)+(d1/2-1)*Math.log(x)-((d1+d2)/2)*Math.log(1+d1*x/d2)):Math.exp((d1/2-1)*Math.log(x)-x/2-(d1/2)*Math.log(2)-lg(d1/2))};
const qnt=(t,p,d1,d2)=>{let lo=0,hi=1;while(cdf(t,hi,d1,d2)<p)hi*=2;for(let i=0;i<80;i++){const m=(lo+hi)/2;cdf(t,m,d1,d2)<p?lo=m:hi=m}return(lo+hi)/2};
function inv(A){const n=A.length,M=A.map((r,i)=>[...r,...A.map((_,j)=>i===j?1:0)]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];const v=M[c][c];for(let j=0;j<2*n;j++)M[c][j]/=v;for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];for(let j=0;j<2*n;j++)M[r][j]-=f*M[c][j]}}return M.map(r=>r.slice(n))}
function lsq(X,y){const k=X[0].length,A=[...Array(k)].map(()=>Array(k).fill(0)),v=Array(k).fill(0);X.forEach((r,i)=>{for(let a=0;a<k;a++){v[a]+=r[a]*y[i];for(let b=0;b<k;b++)A[a][b]+=r[a]*r[b]}});const I=inv(A),b=I.map(r=>r.reduce((s,x,j)=>s+x*v[j],0));let rss=0;X.forEach((r,i)=>{const e=y[i]-r.reduce((s,x,j)=>s+x*b[j],0);rss+=e*e});return{b,rss,I,A,n:X.length,k}}
let seed=11;const rnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const rn=()=>Math.sqrt(-2*Math.log(rnd()+1e-12))*Math.cos(2*Math.PI*rnd());
const fm=(x,d=2)=>!isFinite(x)?'—':Math.abs(x)>=1e5||(Math.abs(x)<1e-3&&x!==0)?x.toExponential(2).replace('.',','):x.toLocaleString('es-CO',{maximumFractionDigits:d,minimumFractionDigits:0});
const fp=p=>p<1e-4?'< 0,0001':fm(p,4);


const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=id=>document.getElementById(id);

let HUD={chips:[],bars:null};
const A_=(k,a)=>i=>i<k?1:i===k?a:0,ch=(l,v,x)=>[l,v,x];
/* ---------- motor 3D ---------- */
const cv=$('cv'),cx=cv.getContext('2d');const V={yaw:-0.72,pitch:0.42,zoom:1,W:0,H:0,sc:1};
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
function fit(){const r=cv.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);V.W=r.width;V.H=r.height;cv.width=r.width*d;cv.height=r.height*d;cx.setTransform(d,0,0,d,0,0);V.sc=Math.min(V.W,V.H*1.1)*0.27*V.zoom;kick()}
const roV=new ResizeObserver(fit);roV.observe(cv);
function P(p){const c=Math.cos(V.yaw),s=Math.sin(V.yaw),cp=Math.cos(V.pitch),sp=Math.sin(V.pitch);const x1=p[0]*c-p[1]*s,y1=p[0]*s+p[1]*c;const up=p[2]*cp+y1*sp,dep=y1*cp-p[2]*sp;const k=V.sc*4.6/(4.6+dep);return[V.W/2+x1*k,V.H*0.52-up*k,dep]}
let DL=[],TL=[];const C={};
function theme(){const r=document.documentElement,t=r.dataset.theme,dk=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches);Object.assign(C,dk?{ink:'#e6eef7',soft:'#8aa2bb',grid:'rgba(159,179,200,.22)',bg:'#0d2139',blue:'#4fb3e8',or:'#ff8a33',pu:'#a78bfa',gn:'#34c77b',gray:'#9fb3c8',red:'#ff5a5a'}:{ink:'#10223a',soft:'#5d7088',grid:'rgba(16,34,58,.13)',bg:'#e9f5fd',blue:'#1f8fd6',or:'#ff7a1a',pu:'#7c3aed',gn:'#1a9e5a',gray:'#7d8fa3',red:'#e0393e'})}
const rgba=(h,a)=>{const n=parseInt(h.slice(1),16);return`rgba(${n>>16},${n>>8&255},${n&255},${Math.max(0,Math.min(1,a))})`};
function L(a,b,col,w=2,al=1,dash){if(al<=0)return;const A=P(a),B=P(b);DL.push({d:(A[2]+B[2])/2,f(){cx.strokeStyle=rgba(col,al);cx.lineWidth=w;cx.setLineDash(dash||[]);cx.beginPath();cx.moveTo(A[0],A[1]);cx.lineTo(B[0],B[1]);cx.stroke();cx.setLineDash([])}})}
function PL(pts,col,w=2,al=1,dash){for(let i=1;i<pts.length;i++)L(pts[i-1],pts[i],col,w,al,dash)}
function Q(pts,fill,al,stroke,sal=0){if(al<=0&&sal<=0)return;const S=pts.map(P);DL.push({d:S.reduce((s,p)=>s+p[2],0)/S.length,f(){cx.beginPath();S.forEach((p,i)=>i?cx.lineTo(p[0],p[1]):cx.moveTo(p[0],p[1]));cx.closePath();if(al>0){cx.fillStyle=rgba(fill,al);cx.fill()}if(sal>0){cx.strokeStyle=rgba(stroke||fill,sal);cx.lineWidth=1;cx.stroke()}}})}
function Pt(p,col,r=4.5,al=1,hollow){if(al<=0)return;const A=P(p);DL.push({d:A[2]-0.01,f(){cx.beginPath();cx.arc(A[0],A[1],r,0,7);if(hollow){cx.strokeStyle=rgba(col,al);cx.lineWidth=2.2;cx.stroke()}else{cx.fillStyle=rgba(col,al);cx.fill();cx.strokeStyle=rgba(C.bg,al*.9);cx.lineWidth=1.2;cx.stroke()}}})}
function T(p,s,col,al=1,o={}){if(al<=0)return;const A=P(p);TL.push(()=>{cx.font=`${o.b?600:500} ${o.sz||13}px Inter,sans-serif`;cx.textAlign=o.al||'center';cx.textBaseline='middle';cx.lineWidth=4;cx.strokeStyle=rgba(C.bg,al*.92);cx.strokeText(s,A[0]+(o.dx||0),A[1]+(o.dy||0));cx.fillStyle=rgba(col,al);cx.fillText(s,A[0]+(o.dx||0),A[1]+(o.dy||0))})}
function Ar(a,b,col,w=2.6,al=1){if(al<=0)return;L(a,b,col,w,al);const A=P(a),B=P(b);DL.push({d:B[2]-0.02,f(){const an=Math.atan2(B[1]-A[1],B[0]-A[0]),h=10;cx.fillStyle=rgba(col,al);cx.beginPath();cx.moveTo(B[0],B[1]);cx.lineTo(B[0]-h*Math.cos(an-.4),B[1]-h*Math.sin(an-.4));cx.lineTo(B[0]-h*Math.cos(an+.4),B[1]-h*Math.sin(an+.4));cx.closePath();cx.fill()}})}
function flush(){DL.sort((a,b)=>b.d-a.d);DL.forEach(x=>x.f());TL.forEach(f=>f());DL=[];TL=[]}
const lerp=(a,b,t)=>a+(b-a)*t,ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2;
function box(lab){const g=C.grid;for(let i=-1;i<=1.001;i+=.5){L([i,-1,-1],[i,1,-1],g,1);L([-1,i,-1],[1,i,-1],g,1)}L([-1,-1,-1],[1.15,-1,-1],C.soft,1.6);L([-1,-1,-1],[-1,1.15,-1],C.soft,1.6);L([-1,-1,-1],[-1,-1,1.15],C.soft,1.6);T([1.27,-1,-1],lab[0],C.soft,1,{b:1});T([-1,1.27,-1],lab[1],C.soft,1,{b:1});T([-1,-1,1.27],lab[2],C.soft,1,{b:1})}

const FD=(k,a,s)=>{const W=V.W,H=V.H,x0=48,x1=W-24,y0=H-58,y1=140;
 const xmax=Math.max(qnt(s.t,.995,s.d1,s.d2),s.c*1.6),inView=s.x<=xmax,X=x=>x0+(x1-x0)*x/xmax;
 let ym=0;const pts=[];for(let i=1;i<=240;i++){const x=xmax*i/240,p=pdf(s.t,x,s.d1,s.d2);pts.push([x,p]);if(p>ym&&isFinite(p))ym=p}ym=Math.min(ym,2.2*pdf(s.t,Math.max(.3,s.d1>2?(s.d1-2)/s.d1*s.d2/(s.d2+2):.5),s.d1,s.d2)||ym);
 const Yp=p=>y0-(y0-y1)*Math.min(1,p/ym);
 TL.push(()=>{cx.strokeStyle=C.soft;cx.lineWidth=1.4;cx.beginPath();cx.moveTo(x0,y0);cx.lineTo(x1,y0);cx.stroke();cx.fillStyle=C.soft;cx.font='500 12px Inter,sans-serif';cx.textAlign='center';cx.textBaseline='top';const st=xmax>12?Math.ceil(xmax/6):xmax>4?1:.5;for(let x=0;x<=xmax;x+=st)cx.fillText(fm(x,1),X(x),y0+5);
  const area=(from,col,al)=>{cx.fillStyle=rgba(col,al);cx.beginPath();cx.moveTo(X(from),y0);pts.filter(p=>p[0]>=from).forEach(p=>cx.lineTo(X(p[0]),Yp(p[1])));cx.lineTo(X(xmax),y0);cx.closePath();cx.fill()};
  const al=A_(k,a);if(k>=1)area(s.c,C.red,.28*al(1));if(k>=2&&inView)area(s.x,C.pu,.35*al(2));
  cx.strokeStyle=C.blue;cx.lineWidth=2.6;cx.beginPath();pts.forEach((p,i)=>i?cx.lineTo(X(p[0]),Yp(p[1])):cx.moveTo(X(p[0]),Yp(p[1])));cx.stroke();
  cx.textBaseline='middle';cx.font='600 13px Inter,sans-serif';cx.fillStyle=C.blue;cx.textAlign='left';cx.fillText((s.t==='F'?'F(':'χ²(')+s.d1+(s.t==='F'?', '+s.d2:'')+')  bajo H₀',x0+6,y1-26);
  if(k>=1){cx.globalAlpha=al(1);cx.strokeStyle=C.red;cx.lineWidth=2;cx.setLineDash([5,4]);cx.beginPath();cx.moveTo(X(s.c),y0);cx.lineTo(X(s.c),y1-6);cx.stroke();cx.setLineDash([]);cx.fillStyle=C.red;cx.textAlign='center';cx.fillText('crítico 5 % = '+fm(s.c),X(s.c),y1-14);cx.globalAlpha=1}
  if(k>=2){cx.globalAlpha=al(2);const xx=inView?X(s.x):x1-6;cx.strokeStyle=C.or;cx.lineWidth=3;cx.beginPath();cx.moveTo(xx,y0);cx.lineTo(xx,y0-46);cx.stroke();cx.fillStyle=C.or;cx.beginPath();cx.arc(xx,y0,6,0,7);cx.fill();cx.textAlign=inView&&xx<x1-90?'left':'right';cx.fillText((inView?'':'→ ')+s.lab+' = '+fm(s.x)+'   p = '+fp(s.p),xx+(cx.textAlign==='left'?8:-8),y0-56);cx.globalAlpha=1}});
 const rej=s.x>s.c;return{chips:[ch('gl',s.t==='F'?s.d1+', '+s.d2:s.d1)].concat(k>=1?[ch('crítico',fm(s.c))]:[]).concat(k>=2?[ch(s.lab,fm(s.x)),ch('p-valor',fp(s.p))]:[]).concat(k>=3?[ch(rej?'p < 0,05 ⇒ rechaza H₀':'p ≥ 0,05 ⇒ no rechaza H₀','',1)]:[]),bars:null}};

const D=fab({L,PL,Q,Pt,T,Ar,box,rgba,lerp,ease,A_,ch,fm,fp,esc,C,V,lsq,inv,cdf,pdf,qnt,rnd,rn});
const {NODES,TREE,GL,DOC}=D,CS=D.CS||{},SC=Object.assign({},D.SC,{fd:FD}),PRE='ruta-af-'+(D.clave||'x')+'-';
const ORDER=[],PATH={};
(function walk(arr,anc){for(const x of arr){if(typeof x==='string'){ORDER.push(x);PATH[x]=anc}else walk(x.c,[...anc,x])}})(TREE,[]);
ORDER.forEach((id,i)=>NODES[id].i=i+1);
let last=null;for(const id of ORDER){for(const s of NODES[id].st){if(s.sc){last=s}else if(last){s.sc=last.sc;s.k=last.k;s.p=last.p;s.c=s.c||last.c}}}
for(const id of ORDER)for(const s of NODES[id].st)if(!s.c){const prev=NODES[id].st.filter(x=>x.c&&x.sc===s.sc&&x.k===s.k)[0];s.c=prev?prev.c:''}


const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[₀-₉]/g,c=>'0123456789'['₀₁₂₃₄₅₆₇₈₉'.indexOf(c)]).replace(/²/g,'2').replace(/⁻¹/g,'-1').replace(/[′‘’]/g,"'").replace(/[″“”]/g,'"').replace(/[−–]/g,'-').replace(/[\s_]/g,'').toLowerCase();
const GI=[];GL.forEach(g=>g[2].forEach(a=>GI.push([norm(a),g])));
function findTerm(raw){const t=raw.trim();if(!t)return null;if(t.length===1&&CS[t])return GL.find(g=>g[0]===CS[t]);const s=norm(t);let best=null;for(const[a,g]of GI){if(a===s)return g;if(a.length>=3&&s.includes(a)&&(!best||a.length>best[0].length))best=[a,g]}return best&&s.length<40?best[1]:null}


$('dw').innerHTML=DOC.map(([t,x,n])=>t==='h'?`<h3>${esc(x)}</h3>`:t==='s'?`<h4>${esc(x)}</h4>`:t==='p'?`<p data-n="${n||''}">${esc(x)}</p>`:`<div class="fb" data-n="${x}" tabindex="0" role="button" aria-label="Abrir ${esc(NODES[x].t)}"><span class="tag"><b>Paso ${NODES[x].i}</b> · ${esc(NODES[x].t)}</span>${esc(NODES[x].f)}</div>`).join('');


/* ---------- estado ---------- */
const ls={get(k,d){try{const v=localStorage.getItem(PRE+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(PRE+k,JSON.stringify(v))}catch(e){}}};
let open=new Set(ls.get('open',['fA','fB','fC','fC1']));
const ST={id:D.inicio,k:0,t0:0,g:null,play:null};

/* ---------- árbol ---------- */
function tnode(id,q){const n=NODES[id];let t=esc(n.t);if(q){const i=n.t.toLowerCase().indexOf(q);if(i>=0)t=esc(n.t.slice(0,i))+'<mark>'+esc(n.t.slice(i,i+q.length))+'</mark>'+esc(n.t.slice(i+q.length))}return`<button class="tn${id===ST.id?' on':''}" data-go="${id}"><span class="num">${n.i}</span><span>${t}</span></button>`}
const match=(id,q)=>{if(!q)return true;const n=NODES[id],s=norm(q);return norm(n.t+' '+n.f+' '+n.que).includes(s)};
function tfold(f,q){const kids=f.c.map(x=>typeof x==='string'?(match(x,q)?tnode(x,q):''):tfold(x,q)).join('');if(q&&!kids)return'';const cnt=(function n(x){return x.c.reduce((s,y)=>s+(typeof y==='string'?1:n(y)),0)})(f);const ex=q?true:open.has(f.id);return`<div class="fo"><button class="fh" data-f="${f.id}" aria-expanded="${ex}"><span class="chev"></span><span>${esc(f.t)}</span><span class="cnt">${cnt}</span></button><div class="fc"${ex?'':' hidden'}>${kids}</div></div>`}
function renderTree(){const q=$('q').value.trim().toLowerCase();$('tw').innerHTML=TREE.map(f=>tfold(f,q)).join('')||'<p class="note">Sin resultados. Prueba con otra palabra.</p>'}
$('tw').addEventListener('click',e=>{const f=e.target.closest('[data-f]');if(f){const id=f.dataset.f;open.has(id)?open.delete(id):open.add(id);ls.set('open',[...open]);renderTree();return}const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);$('app').classList.remove('drawer')}});
$('q').addEventListener('input',renderTree);
const allF=[];(function w(a){for(const x of a)if(typeof x!=='string'){allF.push(x.id);w(x.c)}})(TREE);
$('ex').onclick=()=>{open=new Set(allF);ls.set('open',[...open]);renderTree()};
$('co').onclick=()=>{open=new Set();ls.set('open',[]);renderTree()};

/* ---------- detalle ---------- */
function termsOf(id){const n=NODES[id];return GL.filter(g=>g[4].includes(id)).concat(GL.filter(g=>!g[4].includes(id)&&findTermIn(n.f,g))).slice(0,9)}
function findTermIn(text,g){const s=norm(text);return g[2].some(a=>{const x=norm(a);return x.length>=3&&s.includes(x)})}
function renderDet(){const n=NODES[ST.id],path=PATH[ST.id],i=ORDER.indexOf(ST.id),pv=ORDER[i-1],nx=ORDER[i+1];
 const g=ST.g;let gc='';
 if(g)gc=`<div class="gcard"><button class="x" data-gx aria-label="Cerrar">×</button><h3>Término: ${esc(g[1])}</h3><p>${esc(g[3])}</p><div class="links">${g[4].map(id=>`<button data-go="${id}">Paso ${NODES[id].i} · ${esc(NODES[id].t)}</button>`).join('')}</div></div>`;
 $('dc').innerHTML=gc+`<div class="crumb">${path.map(f=>`<span>${esc(f.t)}</span><span>›</span>`).join('')}<b>Paso ${n.i} de ${ORDER.length}</b></div>
 <h2>${esc(n.t)}</h2><div class="big"><button class="cp" data-cp>Copiar</button>${esc(n.f)}</div>
 <div class="sec"><h3>Qué significa</h3><p>${esc(n.que)}</p></div>
 <div class="sec u"><h3>Cuándo se usa y contexto</h3><p>${esc(n.uso)}</p><p class="ctx">${esc(n.ctx)}</p></div>
 <div class="sec m"><h3>Micropasos (álgebra + 3D)</h3><ol class="ms">${n.st.map((s,j)=>`<li data-k="${j}" class="${j===ST.k?'on':''}" tabindex="0"><span>${esc(s.t)}</span>${s.f?`<span class="mf">${esc(s.f)}</span>`:''}${s.c?`<span class="m3">${esc(s.c)}</span>`:''}</li>`).join('')}</ol></div>
 <div class="sec p"><h3>Posición en el algoritmo</h3><div class="path"><button ${pv?`data-go="${pv}"`:'disabled'}><small>← Anterior</small>${pv?esc(NODES[pv].i+'. '+NODES[pv].t):'Inicio'}</button><div><small>Estás aquí</small>${esc(n.i+'. '+n.t)}</div><button ${nx?`data-go="${nx}"`:'disabled'}><small>Siguiente →</small>${nx?esc(NODES[nx].i+'. '+NODES[nx].t):'Fin'}</button></div>
 <p class="mini">Carpeta: ${esc(path.map(f=>f.t).join(' › '))} · ${PATH[ST.id].at(-1).c.length} pasos en esta carpeta</p></div>
 <div class="sec"><h3>Términos de esta fórmula</h3><div class="terms">${termsOf(ST.id).map(g=>`<button data-g="${g[0]}">${esc(g[1])}</button>`).join('')}</div></div>`;
 renderDots()}
function renderDots(){const n=NODES[ST.id];$('dots').innerHTML=n.st.map((_,j)=>`<button class="${j===ST.k?'on':''}" data-k="${j}" aria-label="Micropaso ${j+1}">${j+1}</button>`).join('');
 document.querySelectorAll('.ms li').forEach(li=>li.classList.toggle('on',+li.dataset.k===ST.k));const s=n.st[ST.k];$('cap').innerHTML=`<b>Micropaso ${ST.k+1}/${n.st.length}</b> · ${esc(s.c||s.t)}`}
$('dc').addEventListener('click',e=>{const t=e.target;if(t.closest('[data-gx]')){ST.g=null;renderDet();return}
 if(t.closest('[data-cp]')){const b=t.closest('[data-cp]');try{navigator.clipboard.writeText(NODES[ST.id].f).then(()=>{b.textContent='Copiado'},()=>{b.textContent='No se pudo'})}catch(err){b.textContent='No se pudo'}return}
 const gg=t.closest('[data-g]');if(gg){ST.g=GL.find(x=>x[0]===gg.dataset.g);renderDet();$('det').scrollTo({top:0,behavior:'smooth'});return}
 const g=t.closest('[data-go]');if(g){go(g.dataset.go,0,ST.g);return}
 const li=t.closest('.ms li');if(li&&!String(window.getSelection())){step(+li.dataset.k)}});
$('dc').addEventListener('keydown',e=>{const li=e.target.closest('.ms li');if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();step(+li.dataset.k)}});
$('dots').addEventListener('click',e=>{const b=e.target.closest('[data-k]');if(b)step(+b.dataset.k)});
$('sPrev').onclick=()=>step(ST.k-1);$('sNext').onclick=()=>step(ST.k+1);
$('play').onclick=()=>{if(ST.play){stopPlay();return}$('play').textContent='Pausa';ST.play=setInterval(()=>{if(ST.k>=NODES[ST.id].st.length-1){stopPlay();return}step(ST.k+1)},3400)};
function stopPlay(){clearInterval(ST.play);ST.play=null;$('play').textContent='Reproducir'}
function step(k){const L=NODES[ST.id].st.length;k=Math.max(0,Math.min(L-1,k));const a=NODES[ST.id].st[ST.k],b=NODES[ST.id].st[k];ST.k=k;if(!a||a.sc!==b.sc||a.k!==b.k||a.p!==b.p)ST.t0=performance.now();renderDots();kick()}
function go(id,k=0,g=null){if(!NODES[id])return;stopPlay();const prev=ST.id;ST.id=id;ST.k=k;ST.g=g;ST.t0=performance.now();
 for(const f of PATH[id])open.add(f.id);ls.set('open',[...open]);ls.set('node',id);
 renderTree();renderDet();document.querySelectorAll('.fb').forEach(b=>b.classList.toggle('on',b.dataset.n===id));
 const fb=document.querySelector(`.fb[data-n="${id}"]`);if(fb&&prev!==id&&!$('app').classList.contains('focus')&&innerWidth>760)fb.scrollIntoView({block:'nearest',behavior:'smooth'});
 const tn=document.querySelector(`.tn[data-go="${id}"]`);if(tn)tn.scrollIntoView({block:'nearest'});
 if(innerWidth<=760&&prev!==id)$('det').scrollIntoView({behavior:'smooth'});
 $('det').scrollTo({top:0});if(location.hash!=='#'+id)history.replaceState(null,'','#'+id);kick()}
$('dw').addEventListener('click',e=>{if(String(window.getSelection()).trim())return;const b=e.target.closest('.fb');if(b)go(b.dataset.n)});
$('dw').addEventListener('keydown',e=>{const b=e.target.closest('.fb');if(b&&(e.key==='Enter'||e.key===' ')){e.preventDefault();go(b.dataset.n)}});
document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.shiftKey?go(ORDER[Math.min(ORDER.length-1,ORDER.indexOf(ST.id)+1)]):step(ST.k+1)}else if(e.key==='ArrowLeft'){e.shiftKey?go(ORDER[Math.max(0,ORDER.indexOf(ST.id)-1)]):step(ST.k-1)}});

/* ---------- selección de texto ---------- */
const chip=$('chip');let pend=null;
function onSel(){const sel=window.getSelection();const txt=String(sel).trim();if(!txt||txt.length>160||!sel.rangeCount){chip.style.display='none';return}
 const rg=sel.getRangeAt(0),el=(rg.startContainer.nodeType===1?rg.startContainer:rg.startContainer.parentElement);if(!el||el.closest('#chip'))return;
 const host=el.closest('[data-n]'),nid=host&&host.dataset.n?host.dataset.n:null,g=findTerm(txt);
 if(!nid&&!g){pend={search:txt};chip.innerHTML=`Buscar «${esc(txt.slice(0,30))}» en el árbol<small>No es un término del glosario</small>`}
 else{pend={nid:nid||g[4][0],g};chip.innerHTML=`Desplegar ▸ ${esc(g?g[1]:NODES[nid].t)}<small>${nid?'Paso '+NODES[nid].i+' · '+esc(NODES[nid].t):'Término del glosario'}</small>`}
 const r=rg.getBoundingClientRect();chip.style.display='block';const cw=chip.offsetWidth;chip.style.left=Math.max(8,Math.min(innerWidth-cw-8,r.left+r.width/2-cw/2))+'px';chip.style.top=(r.bottom+10+chip.offsetHeight>innerHeight?r.top-chip.offsetHeight-10:r.bottom+10)+'px'}
let selT;document.addEventListener('selectionchange',()=>{clearTimeout(selT);selT=setTimeout(onSel,260)});
chip.addEventListener('mousedown',e=>e.preventDefault());
chip.onclick=()=>{chip.style.display='none';if(!pend)return;if(pend.search){$('q').value=pend.search;renderTree();if(innerWidth<=1100)$('app').classList.add('drawer');$('q').focus()}else{const keep=pend.nid===ST.id&&pend.g;keep?(ST.g=pend.g,renderDet()):go(pend.nid,0,pend.g)}try{window.getSelection().removeAllRanges()}catch(e){}};
document.addEventListener('scroll',()=>{chip.style.display='none'},true);

/* ---------- controles de vista ---------- */
$('bTree').onclick=()=>{const a=$('app');if(innerWidth<=1100){a.classList.toggle('drawer');$('bTree').setAttribute('aria-pressed',a.classList.contains('drawer'))}else{a.classList.toggle('notree');$('bTree').setAttribute('aria-pressed',!a.classList.contains('notree'))}setTimeout(fit,30)};
$('bFocus').onclick=()=>{const a=$('app');a.classList.toggle('focus');$('bFocus').setAttribute('aria-pressed',a.classList.contains('focus'));setTimeout(fit,30)};
if(innerWidth<=1100)$('bTree').setAttribute('aria-pressed','false');
document.addEventListener('click',e=>{const a=$('app');if(a.classList.contains('drawer')&&!e.target.closest('#tree')&&!e.target.closest('#bTree')&&!e.target.closest('#chip')){a.classList.remove('drawer');$('bTree').setAttribute('aria-pressed','false')}});


let lastHud='';
function draw(){theme();cx.clearRect(0,0,V.W,V.H);const n=NODES[ST.id],s=n.st[ST.k]||n.st[0];const t=RM?1:Math.min(1,(performance.now()-ST.t0)/750),a=ease(t);
 try{HUD=SC[s.sc](s.k,a,s.p)||{chips:[],bars:null}}catch(err){DL=[];TL=[];HUD={chips:[],bars:null}}flush();
 cv.style.cursor=s.sc==='fd'?'default':'grab';
 const h=`<div class="chips">${HUD.chips.map(([l,v,x])=>`<span class="${x?'x':''}">${esc(l)}${v!==''?' <b>'+esc(v)+'</b>':''}</span>`).join('')}</div>${HUD.bars?`<div class="bars">${HUD.bars}</div>`:''}`;if(h!==lastHud){$('hud').innerHTML=h;lastHud=h}
 return t<1}
let raf=0,drag=null;function kick(){if(raf)return;raf=requestAnimationFrame(function fr(){raf=0;if(draw()||drag)raf=requestAnimationFrame(fr)})}
const ptrs=new Map();let pinch=0;
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,[e.clientX,e.clientY]);drag=[e.clientX,e.clientY];cv.style.cursor='grabbing'});
cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);if(ptrs.size===2){const[p,q]=[...ptrs.values()],d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(pinch){V.zoom=Math.max(.6,Math.min(2.4,V.zoom*d/pinch));fit()}pinch=d;return}if(!drag)return;V.yaw+=(e.clientX-drag[0])*.01;V.pitch=Math.max(-.15,Math.min(1.45,V.pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];kick()});
const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=0;if(!ptrs.size){drag=null;cv.style.cursor='grab'}};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
cv.addEventListener('wheel',e=>{e.preventDefault();V.zoom=Math.max(.6,Math.min(2.4,V.zoom*Math.exp(-e.deltaY*.0012)));fit()},{passive:false});
$('zIn').onclick=()=>{V.zoom=Math.min(2.4,V.zoom*1.15);fit()};$('zOut').onclick=()=>{V.zoom=Math.max(.6,V.zoom/1.15);fit()};$('rs').onclick=()=>{V.yaw=-.72;V.pitch=.42;V.zoom=1;fit()};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',kick);new MutationObserver(kick).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});


/* ---------- tamaño del visor ---------- */
const vw=document.querySelector('.vw'),setSh=px=>{px=Math.max(150,Math.min(innerHeight*.78,px));document.documentElement.style.setProperty('--sh',px+'px');ls.set('sh',px);fit()};
const sh0=ls.get('sh',0);if(sh0)document.documentElement.style.setProperty('--sh',sh0+'px');
let sd=null;const sp=$('split');
sp.addEventListener('pointerdown',e=>{sp.setPointerCapture(e.pointerId);sd=[e.clientY,$('stage').offsetHeight]});
sp.addEventListener('pointermove',e=>{if(sd)setSh(sd[1]+e.clientY-sd[0])});
sp.addEventListener('pointerup',()=>sd=null);sp.addEventListener('pointercancel',()=>sd=null);
sp.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();setSh($('stage').offsetHeight-30)}if(e.key==='ArrowDown'){e.preventDefault();setSh($('stage').offsetHeight+30)}});
sp.addEventListener('dblclick',()=>setSh(innerHeight*.34));
const setMin=m=>{vw.classList.toggle('min',m);$('vMin').setAttribute('aria-pressed',m);$('vMin').textContent=m?'Mostrar 3D':'Ocultar 3D';ls.set('vmin',m);if(!m)setTimeout(fit,20)};
$('vMin').onclick=()=>setMin(!vw.classList.contains('min'));setMin(ls.get('vmin',false));

/* ---------- arranque ---------- */
const h0=location.hash.slice(1);go(NODES[h0]?h0:(NODES[ls.get('node',D.inicio)]?ls.get('node',D.inicio):D.inicio));
addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(NODES[h]&&h!==ST.id)go(h)});

}};
