// ---------- Visuales de cambios: gráficos con curvas que se arrastran y una lectura en texto del cambio
// Uso en el contenido: <div data-vis="krugman"></div>  (o data-vis="*" para un selector con todos)
const VIS={SC:{},ORDER:[]};
VIS.fx=f=>({t:"fx",f});VIS.vx=x=>({t:"vx",x});VIS.hy=y=>({t:"hy",y});
VIS.near=v=>Math.abs(v)<0.04;
VIS.D=v=>v>0?"∆+":"∆-";
VIS.n=(v,d=2)=>fmt(v,d);
VIS.chg=(a,b,d=2,u="")=>{const df=b-a;return VIS.near(df)?`${VIS.n(a,d)}${u} (sin cambio)`:`${VIS.n(a,d)}${u} → ${VIS.n(b,d)}${u} (${df>0?"sube":"baja"})`};
VIS.tile=(lab,a,b,d=2,u="")=>{const df=b-a,z=Math.abs(df)<Math.pow(10,-d)/2;return[lab,z?VIS.n(b,d)+u+" (igual)":`${VIS.n(a,d)} → ${VIS.n(b,d)}${u}`]};
VIS.list=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join("")}</ul>`;
VIS.sec=(t,h)=>`<div class="vis-s"><p class="vis-h">${t}</p>${h}</div>`;
VIS.clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

// ---------- dibujo de un panel
VIS.draw=function(P,uid){const W=P.W||560,H=P.H||340,L=W<420?46:56,R=14,T=30,B=46,[x0,x1]=P.xr,[y0,y1]=P.yr;
  const sx=x=>L+(x-x0)/(x1-x0)*(W-L-R),sy=y=>T+(y1-y)/(y1-y0)*(H-T-B),inb=(x,y)=>x>=x0-1e-9&&x<=x1+1e-9&&y>=y0-1e-9&&y<=y1+1e-9;
  P._m={W,H,L,R,T,B};const fx=P.fx||(v=>fm(v)),fy=P.fy||(v=>fm(v));
  let g=`<defs><clipPath id="${uid}c"><rect x="${L}" y="${T}" width="${W-L-R}" height="${H-T-B}"/></clipPath><marker id="${uid}m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--ink)"/></marker></defs>`;
  for(let k=0;k<=4;k++){const xv=x0+k*(x1-x0)/4,yv=y0+k*(y1-y0)/4;
    g+=`<line x1="${L}" x2="${W-R}" y1="${sy(yv)}" y2="${sy(yv)}" stroke="var(--rule)" stroke-width="1"/><text x="${L-6}" y="${sy(yv)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${fy(yv)}</text>`;
    g+=`<text x="${sx(xv)+(k===4?4:0)}" y="${H-B+16}" text-anchor="${k===4?"end":"middle"}" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${fx(xv)}</text>`}
  g+=`<line x1="${L}" x2="${L}" y1="${T}" y2="${H-B}" stroke="var(--ink)" stroke-width="1.2"/><line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="var(--ink)" stroke-width="1.2"/>`;
  g+=`<text x="${W-R}" y="${H-9}" text-anchor="end" font-size="12" fill="var(--ink)">${P.xl}</text><text x="${L-4}" y="${T-12}" font-size="12" fill="var(--ink)">${P.yl}</text>`;
  const labs=[];
  g+=`<g clip-path="url(#${uid}c)">`;
  const key=s=>s.t==="fx"?[x0,(x0+x1)/2,x1].map(x=>s.f(x).toFixed(3)).join():s.t+(s.x!==undefined?s.x:s.y).toFixed(3);const solid=new Set((P.curves||[]).filter(c=>!c.dash).map(c=>key(c.sh)));
  for(const c of P.curves||[]){if(c.dash&&solid.has(key(c.sh)))continue;const s=c.sh,st=`stroke="var(${c.col})" stroke-width="${c.w||(c.dash?1.8:2.6)}" fill="none" ${c.dash?`stroke-dasharray="${c.dash===2?"2 4":"7 5"}"`:""} opacity="${c.op||1}"`;let lp=null;
    if(s.t==="fx"){let d="",N=90,last=null;for(let k=0;k<=N;k++){const x=x0+k*(x1-x0)/N,y=s.f(x);if(!isFinite(y))continue;d+=(d?"L":"M")+sx(x).toFixed(1)+","+sy(VIS.clamp(y,y0-(y1-y0),y1+(y1-y0))).toFixed(1);if(inb(x,y))last=[x,y]}
      g+=`<path d="${d}" ${st}/>`;if(last)lp=[sx(last[0])-4,sy(last[1])-8,"end"]}
    else if(s.t==="vx"){g+=`<line x1="${sx(s.x)}" x2="${sx(s.x)}" y1="${T}" y2="${H-B}" ${st}/>`;if(s.x>=x0&&s.x<=x1)lp=[sx(s.x)+5,T+13+(c.lo||0),"start"]}
    else{g+=`<line x1="${L}" x2="${W-R}" y1="${sy(s.y)}" y2="${sy(s.y)}" ${st}/>`;if(s.y>=y0&&s.y<=y1)lp=[W-R-4,sy(s.y)-6+(c.lo||0),"end"]}
    if(c.lab&&lp)labs.push(`<text x="${lp[0]}" y="${lp[1]}" text-anchor="${lp[2]}" font-size="12.5" font-weight="${c.dash?400:700}" fill="var(${c.col})" opacity="${c.dash?.85:1}" paint-order="stroke" stroke="var(--card)" stroke-width="3">${c.lab}</text>`)}
  for(const s of P.segs||[]){g+=`<line x1="${sx(s.x1)}" y1="${sy(s.y1)}" x2="${sx(s.x2)}" y2="${sy(s.y2)}" stroke="var(${s.col||"--ink"})" stroke-width="${s.w||2}" ${s.dash?'stroke-dasharray="4 4"':""} ${s.arrow?`marker-end="url(#${uid}m)"`:""}/>`;
    if(s.lab)labs.push(`<text x="${(sx(s.x1)+sx(s.x2))/2}" y="${(sy(s.y1)+sy(s.y2))/2-7}" text-anchor="middle" font-size="12" font-weight="600" fill="var(${s.col||"--ink"})" paint-order="stroke" stroke="var(--card)" stroke-width="3">${s.lab}</text>`)}
  g+=`</g>`+labs.join("");
  const pts=[];for(const p of P.pts||[]){if(!inb(p.x,p.y))continue;const q=pts.find(z=>Math.hypot(sx(z.x)-sx(p.x),sy(z.y)-sy(p.y))<9);if(q)q.lab+=" = "+p.lab;else pts.push({...p})}
  for(const p of pts)g+=`<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="5" fill="var(${p.col||"--ink"})"/><text x="${sx(p.x)+8}" y="${sy(p.y)+16}" font-size="12.5" font-weight="700" fill="var(--ink)" paint-order="stroke" stroke="var(--card)" stroke-width="3">${p.lab}</text>`;
  if(P.probe){const p=P.probe,X=sx(p.x),Y=sy(p.y);g+=`<g class="vh vprobe" data-c="__probe" tabindex="0" role="button" aria-label="Punto de prueba: usa las flechas para moverlo"><rect x="${X-7}" y="${Y-7}" width="14" height="14" transform="rotate(45 ${X} ${Y})" fill="var(--card)" stroke="var(--exam)" stroke-width="2.5"/><text x="${X+11}" y="${Y-9}" font-size="11.5" fill="var(--exam)" font-weight="600">prueba</text></g>`}
  for(const h of P.handles||[]){if(!inb(h.x,h.y))continue;g+=`<g class="vh" data-c="${h.c}" tabindex="0" role="button" aria-label="Mover ${h.name}: arrastra o usa las flechas"><circle cx="${sx(h.x)}" cy="${sy(h.y)}" r="15" fill="transparent"/><circle cx="${sx(h.x)}" cy="${sy(h.y)}" r="9" fill="var(--card)" stroke="var(${h.col})" stroke-width="3"/><path d="M${sx(h.x)-4},${sy(h.y)}h8M${sx(h.x)},${sy(h.y)-4}v8" stroke="var(${h.col})" stroke-width="1.6"/></g>`}
  return g};

// ---------- montaje e interacción
VIS.mount=function(el,S){const uid="v"+Math.random().toString(36).slice(2,8);
  const st={o:{},p:{...S.p0},probe:S.probe0?{...S.probe0}:null};(S.opts||[]).forEach(o=>st.o[o.id]=o.v);
  el.classList.add("vis");
  el.innerHTML=`${S.hint?`<p class="hint">${S.hint}</p>`:""}
  ${(S.opts||[]).length?`<div class="vis-ctl">${S.opts.map(o=>`<div><span class="lbl">${o.lab}</span> ${seg(uid+o.id,o.lab,o.ch,o.v)}</div>`).join("")}</div>`:""}
  <div class="vis-pp${S.panels>1?" two":""}">${Array.from({length:S.panels||1},(_,k)=>`<figure><figcaption class="lbl" data-cap="${k}"></figcaption><svg viewBox="0 0 560 340" role="img" data-k="${k}"></svg></figure>`).join("")}</div>
  <p class="hint vis-key">Línea punteada: posición inicial. Círculos: arrástralos para desplazar la curva (o usa las flechas del teclado). ${S.probe0?"Rombo: punto de prueba.":""}</p>
  ${S.presets?`<div class="vis-ch"><span class="lbl">Prueba un choque</span><div class="chips pre">${S.presets.map((p,k)=>`<button type="button" data-pre="${k}">${p[0]}</button>`).join("")}</div><button type="button" class="btn" data-reset>Reiniciar</button></div>`:""}
  <div class="vis-txt" aria-live="polite"></div>`;
  const svgs=[...el.querySelectorAll("svg[data-k]")],txt=el.querySelector(".vis-txt");let panels=[],drag=null,focusC=null;
  const render=()=>{const R=S.compute(st);R.panels.forEach((P,k)=>{const sv=svgs[k];if(!sv)return;const cw=sv.parentNode&&sv.parentNode.clientWidth||0;P.W=cw?Math.round(VIS.clamp(cw-12,330,560)):560;P.H=Math.round(P.W*0.56)+30;sv.setAttribute("viewBox",`0 0 ${P.W} ${P.H}`);sv.setAttribute("aria-label",P.cap||"gráfico");sv.innerHTML=VIS.draw(P,uid+k);el.querySelector(`[data-cap="${k}"]`).textContent=P.cap||""});panels=R.panels;
    txt.innerHTML=R.text;if(focusC){const h=el.querySelector(`[data-c="${focusC}"]`);if(h&&h.focus)h.focus({preventScroll:true})}};
  const apply=(c,k,x,y)=>{const P=panels[k];if(c==="__probe"){st.probe={k,x:VIS.clamp(x,P.xr[0],P.xr[1]),y:VIS.clamp(y,P.yr[0],P.yr[1])};return}
    const v=S.fit[c](x,y,st),[a,b]=S.lim[c];if(isFinite(v))st.p[c]=VIS.clamp(v,a,b)};
  const toData=(sv,k,e)=>{const P=panels[k],m=P._m,ctm=sv.getScreenCTM&&sv.getScreenCTM();if(!ctm)return null;const pt=sv.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const q=pt.matrixTransform(ctm.inverse());
    return{x:P.xr[0]+(q.x-m.L)/(m.W-m.L-m.R)*(P.xr[1]-P.xr[0]),y:P.yr[1]-(q.y-m.T)/(m.H-m.T-m.B)*(P.yr[1]-P.yr[0])}};
  svgs.forEach((sv,k)=>{
    sv.addEventListener("pointerdown",e=>{const h=e.target.closest("[data-c]");if(!h)return;drag={c:h.dataset.c,k};focusC=null;try{sv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
    sv.addEventListener("pointermove",e=>{if(!drag||drag.k!==k)return;const d=toData(sv,k,e);if(!d)return;apply(drag.c,k,d.x,d.y);render()});
    const end=()=>{drag=null};sv.addEventListener("pointerup",end);sv.addEventListener("pointercancel",end);
    sv.addEventListener("keydown",e=>{const h=e.target.closest("[data-c]");if(!h)return;const dirs={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};const d=dirs[e.key];if(!d)return;e.preventDefault();
      const P=panels[k],c=h.dataset.c,cur=c==="__probe"?st.probe:(P.handles||[]).find(z=>z.c===c);if(!cur)return;
      apply(c,k,cur.x+d[0]*(P.xr[1]-P.xr[0])/40,cur.y+d[1]*(P.yr[1]-P.yr[0])/40);focusC=c;render()})});
  (S.opts||[]).forEach(o=>bindSeg(uid+o.id,v=>{st.o[o.id]=v;if(o.reset!==false)st.p={...S.p0};render()}));
  el.querySelectorAll("[data-pre]").forEach(b=>b.onclick=()=>{const p=S.presets[+b.dataset.pre];st.p={...S.p0,...p[1]};if(p[2])Object.assign(st.o,p[2]);
    if(p[2])(S.opts||[]).forEach(o=>{const g=document.getElementById(uid+o.id);if(g)g.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===st.o[o.id]))});render()});
  const rs=el.querySelector("[data-reset]");if(rs)rs.onclick=()=>{st.p={...S.p0};st.probe=S.probe0?{...S.probe0}:null;render()};
  let rz=0;const onR=()=>{if(!svgs[0].isConnected){window.removeEventListener("resize",onR);return}clearTimeout(rz);rz=setTimeout(()=>{if(svgs[0].isConnected)render()},120)};window.addEventListener("resize",onR);
  render()};
function VISUAL(el,key){
  if(key==="*"){el.innerHTML=`<div class="calcf"><label>Gráfico<select data-vsel>${VIS.ORDER.map(k=>`<option value="${k}">${VIS.SC[k].t}</option>`).join("")}</select></label></div><div data-vbox></div>`;
    const sel=el.querySelector("[data-vsel]"),box=el.querySelector("[data-vbox]");const go=()=>VIS.mount(box,VIS.SC[sel.value]);sel.onchange=go;go();return}
  const S=VIS.SC[key];if(!S)throw new Error("no existe el visual «"+key+"».");VIS.mount(el,S)}
VIS.add=(k,S)=>{VIS.SC[k]=S;VIS.ORDER.push(k)};
VIS.REG=[["flex","Flexible"],["fijo","Fijo"]];

