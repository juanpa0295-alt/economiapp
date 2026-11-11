
// ===================== HERRAMIENTAS COMUNES DE MATEMÁTICAS I, II Y III =====================
const okAll=a=>a.every(x=>isFinite(x)),n2=v=>fmt(v,2),n4=v=>fmt(v,4);
const tabsBox=(id,opts)=>`<div style="margin-bottom:10px">${seg(id,"Herramienta",opts,opts[0][0])}</div><div id="${id}-b"></div>`;
function tabsRun(id,M){const go=k=>M[k]();bindSeg(id,go);go(Object.keys(M)[0])}
const nin=(id,l,v,st)=>`<label for="${id}">${l}<input type="number" id="${id}" value="${v}" ${st?`step="${st}"`:""} inputmode="decimal"></label>`;
const N=id=>{const e=$(id);return e?parseFloat(String(e.value).replace(",",".")):NaN};
const onIn=(ids,run)=>ids.forEach(id=>{const e=$(id);if(e)e.addEventListener("input",run)});

const curId=()=>{try{return decodeURIComponent(location.hash.slice(1))||TRUNK[0].id}catch(e){return""}};
const espera=()=>CAS.state==="error"?`<p class="hint">Este cálculo necesita el motor exacto (SymPy), que no se pudo cargar en esta vista. En el sitio publicado funciona.</p>`:`<p class="hint">Calculando con el motor exacto… la primera vez tarda unos segundos.</p>`;
const casErr=E=>`<p class="err">SymPy no pudo con esta expresión: ${esc(E.error||"")}. Revisa la escritura: usa * o espacios para multiplicar y ^ para potencias.</p>`;
const inp=(id,l,v,w)=>`<label for="${id}">${l}<input id="${id}" value="${v}" autocomplete="off" spellcheck="false"${w?` style="font-family:var(--f-mono)"`:""}></label>`;
const ival=id=>$(id).value.trim();
const pfx=s=>{try{return NUM.parse(s).f}catch(e){return null}};
const stc=(k,t,b)=>`<div class="stepc"><h4><span class="n">${k}</span>${t}</h4>${b}</div>`;
const fx=v=>fN(v);
// varias funciones en un mismo gráfico
function plotFns({fs,xr,yr=null,marks=[],extra=[],xl="x",yl="y",H=280,label,cols}){
  const W=600,N=400,all=[];const xs=[...Array(N+1)].map((_,i)=>xr[0]+(xr[1]-xr[0])*i/N);const Y=fs.map(f=>xs.map(x=>{const v=f(x);if(isFinite(v))all.push(v);return v}));
  let lo,hi;if(yr){[lo,hi]=yr}else{const s=all.slice().sort((a,b)=>a-b);lo=s.length?s[Math.floor(s.length*.03)]:-1;hi=s.length?s[Math.floor(s.length*.97)]:1;lo=Math.min(lo,0);hi=Math.max(hi,0);const p=(hi-lo||1)*.12;lo-=p;hi+=p}
  const fr=frame(W,H,xr,[lo,hi],ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(lo,hi,nice((hi-lo)/4)),xl,yl),id="mx"+(++CLIP);let b=extra.map(e=>typeof e==="function"?e(fr):e).join("");
  b+=`<line x1="${fr.L}" x2="${W-fr.R}" y1="${fr.sy(0)}" y2="${fr.sy(0)}" stroke="var(--muted)" stroke-width="1"/>`;if(xr[0]<0&&xr[1]>0)b+=`<line y1="${fr.T}" y2="${H-fr.B}" x1="${fr.sx(0)}" x2="${fr.sx(0)}" stroke="var(--muted)" stroke-width="1"/>`;
  const C=cols||["--line","--exam","--good","--branch","--ink"];
  Y.forEach((ys,k)=>{let d="",pen=false;xs.forEach((x,i)=>{const v=ys[i];if(!isFinite(v)||v<lo-(hi-lo)*3||v>hi+(hi-lo)*3){pen=false;return}if(pen&&Math.abs(v-ys[i-1])>(hi-lo)*1.5)pen=false;d+=(pen?"L":"M")+fr.sx(x).toFixed(1)+","+fr.sy(v).toFixed(1);pen=true});
    b+=`<path d="${d}" fill="none" stroke="var(${C[k%C.length]})" stroke-width="2.4"/>`});
  let p="";marks.forEach(m=>{if(!isFinite(m.x)||!isFinite(m.y))return;const x=fr.sx(m.x),y=fr.sy(m.y),anc=x>W*.7?"end":"start";p+=`<circle cx="${x}" cy="${y}" r="5" fill="${m.hollow?"var(--card)":`var(${m.col||"--ink"})`}" stroke="var(${m.col||"--ink"})" stroke-width="2.2"/>${m.label?`<text x="${x+(anc==="end"?-8:8)}" y="${y-9}" font-size="12" font-weight="600" text-anchor="${anc}" fill="var(${m.col||"--ink"})">${esc(m.label)}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfica"}"><defs><clipPath id="${id}"><rect x="${fr.L}" y="${fr.T}" width="${W-fr.L-fr.R}" height="${H-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const leg=it=>`<div class="legend">${it.map(([c,t])=>`<span><i style="background:var(${c})"></i>${t}</span>`).join("")}</div>`;
// presets por estación
const presetsFor=(map,def)=>map[curId()]||map[def];
// Hoja de fórmulas común
SIMS.hojaf=function(){MAT_RUN=null;
  $("sim").innerHTML=`<div class="calcf"><label for="h-q">Buscar fórmula<input id="h-q" type="search" placeholder="Por ejemplo: cadena"></label></div><div class="tbl"><table id="h-t"></table></div>`;
  const nz=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
  const run=()=>{const q=nz($("h-q").value.trim()),rows=FORMULAS.filter(f=>!q||nz(f.join(" ")).includes(q));$("h-t").innerHTML=`<tr><th>Tema</th><th>Regla</th><th>Fórmula</th></tr>`+(rows.length?rows.map(([a,b,c])=>`<tr><td>${a}</td><td>${b}</td><td class="mono">${c}</td></tr>`).join(""):`<tr><td colspan="3">No hay fórmulas con esa palabra.</td></tr>`)};
  $("h-q").addEventListener("input",run);run()};
// curvas de nivel G(x,y) = c por cuadrados marchantes
function contour(G,xr,yr,level,fr,col="--line",w=2.2,Nx=110,Ny=90){const dx=(xr[1]-xr[0])/Nx,dy=(yr[1]-yr[0])/Ny,v=[];for(let j=0;j<=Ny;j++){const r=[];for(let i=0;i<=Nx;i++){const z=G(xr[0]+i*dx,yr[0]+j*dy);r.push(isFinite(z)?z-level:NaN)}v.push(r)}
  let d="";const P=(x,y)=>`${fr.sx(x).toFixed(1)},${fr.sy(y).toFixed(1)}`;
  for(let j=0;j<Ny;j++)for(let i=0;i<Nx;i++){const a=v[j][i],b=v[j][i+1],c=v[j+1][i+1],e=v[j+1][i];if([a,b,c,e].some(isNaN))continue;const x0=xr[0]+i*dx,y0=yr[0]+j*dy,pts=[];
    const ed=(p,q,xa,ya,xb,yb)=>{if((p<0)!==(q<0)){const t=p/(p-q);pts.push([xa+t*(xb-xa),ya+t*(yb-ya)])}};ed(a,b,x0,y0,x0+dx,y0);ed(b,c,x0+dx,y0,x0+dx,y0+dy);ed(c,e,x0+dx,y0+dy,x0,y0+dy);ed(e,a,x0,y0+dy,x0,y0);
    for(let k=0;k+1<pts.length;k+=2)d+=`M${P(...pts[k])}L${P(...pts[k+1])}`}
  return `<path d="${d}" fill="none" stroke="var(${col})" stroke-width="${w}" stroke-linecap="round"/>`}
function plotXYc({xr,yr,draw,label,xl="x",yl="y",H=320,marks=[]}){const W=600,fr=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/5)),xl,yl),id="mc"+(++CLIP);
  let b=`<line x1="${fr.L}" x2="${W-fr.R}" y1="${fr.sy(0)}" y2="${fr.sy(0)}" stroke="var(--muted)" stroke-width="1"/>`;if(xr[0]<0&&xr[1]>0)b+=`<line y1="${fr.T}" y2="${H-fr.B}" x1="${fr.sx(0)}" x2="${fr.sx(0)}" stroke="var(--muted)" stroke-width="1"/>`;b+=draw(fr);
  let p="";marks.forEach(m=>{if(!isFinite(m.x)||!isFinite(m.y))return;const x=fr.sx(m.x),y=fr.sy(m.y);p+=`<circle cx="${x}" cy="${y}" r="5" fill="var(${m.col||"--ink"})"/>${m.label?`<text x="${x+8}" y="${y-8}" font-size="12" font-weight="600" fill="var(${m.col||"--ink"})">${esc(m.label)}</text>`:""}`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label||"Gráfica"}"><defs><clipPath id="${id}"><rect x="${fr.L}" y="${fr.T}" width="${W-fr.L-fr.R}" height="${H-fr.T-fr.B}"/></clipPath></defs>${fr.g}<g clip-path="url(#${id})">${b}</g>${p}</svg></div>`}
const pf2=s=>{try{const c=math.parse(NUM.src(s)).compile();return(x,y)=>{try{const v=c.evaluate({x,y});return typeof v==="number"?v:NaN}catch(e){return NaN}}}catch(e){return null}};
