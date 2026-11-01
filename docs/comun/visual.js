// Economiapp · visuales de cambios: curvas que se arrastran con una lectura en texto del cambio.
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
    g+=`<text x="${sx(xv)}" y="${H-B+16}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${fx(xv)}</text>`}
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

// =====================================================================
// 1. Mercado de divisas (enfoque real): oferta X y demanda Q de dólares
VIS.add("divisas",{t:"Mercado de divisas: oferta (X) y demanda (Q) de dólares",
  hint:"Arrastra la oferta de dólares (X) o la demanda (Q). Con tipo de cambio fijo, el banco central cubre el exceso al tipo de cambio Ē.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"flex"}],p0:{X:0,Q:0},lim:{X:[-30,30],Q:[-30,30]},probe0:{k:0,x:22,y:4600},
  presets:[["Cae el petróleo",{X:-16}],["Suben las remesas",{X:14}],["Suben los aranceles",{Q:-14}],["La FED sube i*",{Q:14}],["Sube Y (más importaciones)",{Q:10}],["Sube la inflación de Colombia",{X:-8,Q:8}]],
  fit:{X:(q,E)=>q-(E-3000)/20,Q:(q,E)=>q-(5000-E)/20},
  compute(st){const{X,Q}=st.p,fijo=st.o.reg==="fijo",fX=o=>q=>3000+20*(q-o),fQ=o=>q=>5000-20*(q-o),mX=!VIS.near(X),mQ=!VIS.near(Q);
    const q1=50+(X+Q)/2,E1=4000+10*(Q-X),gap=X-Q;
    const curves=[{sh:VIS.fx(fX(0)),col:"--line",dash:1,op:.55,lab:mX?"X":""},{sh:VIS.fx(fQ(0)),col:"--branch",dash:1,op:.55,lab:mQ?"Q":""},
      {sh:VIS.fx(fX(X)),col:"--line",lab:mX?"X’":"X (oferta)"},{sh:VIS.fx(fQ(Q)),col:"--branch",lab:mQ?"Q’":"Q (demanda)"}];
    const segs=[],pts=[{x:50,y:4000,lab:"0"}];
    if(fijo){curves.push({sh:VIS.hy(4000),col:"--muted",dash:2,lab:"Ē",lo:-2});
      if(Math.abs(gap)>0.3){segs.push({x1:50+Q,y1:4000,x2:50+X,y2:4000,col:"--bad",w:4,lab:gap>0?"EOD":"EDD"});
        curves.push(gap>0?{sh:VIS.fx(fQ(Q+gap)),col:"--good",dash:1,lab:"Q + compras del BC"}:{sh:VIS.fx(fX(X-gap)),col:"--good",dash:1,lab:"X + ventas del BC"});
        pts.push({x:50+Math.max(X,Q),y:4000,lab:"1",col:"--good"})}}
    else if(mX||mQ)pts.push({x:q1,y:E1,lab:"1",col:"--good"});
    const hX=VIS.clamp(X+75,5,95),hQ=VIS.clamp(Q+25,5,95);
    let probeTxt="";const pr=st.probe;if(pr){const qx=50+X+(pr.y-4000)/20,qq=50+Q-(pr.y-4000)/20,ex=qx-qq;segs.push({x1:qq,y1:pr.y,x2:qx,y2:pr.y,col:"--exam",dash:1,w:1.5});
      probeTxt=`<p><b>Punto de prueba</b> (E = ${VIS.n(pr.y,0)}): ${Math.abs(ex)<0.5?"oferta = demanda de dólares, no hay presión.":ex>0?`se ofrecen ${VIS.n(ex,1)} millones de US$ más de los que se piden: <b>EOD</b>, presión a que E baje.`:`se piden ${VIS.n(-ex,1)} millones de US$ más de los que se ofrecen: <b>EDD</b>, presión a que E suba.`}</p>`}
    const P={cap:"Mercado de divisas",xr:[0,100],yr:[3000,5000],xl:"Cantidad de dólares (millones de US$)",yl:"E ($/US$)",fy:v=>VIS.n(v,0),curves,segs,pts,probe:pr,
      handles:[{c:"X",x:hX,y:fX(X)(hX),col:"--line",name:"la oferta X"},{c:"Q",x:hQ,y:fQ(Q)(hQ),col:"--branch",name:"la demanda Q"}]};
    let h="";const mv=[];if(mX)mv.push(`La oferta de dólares (X) se desplazó <b>${X>0?"a la derecha":"a la izquierda"}</b>: a cada tipo de cambio se ofrecen ${VIS.n(Math.abs(X),1)} millones de US$ ${X>0?"más":"menos"}.`);
    if(mQ)mv.push(`La demanda de dólares (Q) se desplazó <b>${Q>0?"a la derecha":"a la izquierda"}</b>: a cada tipo de cambio se piden ${VIS.n(Math.abs(Q),1)} millones de US$ ${Q>0?"más":"menos"}.`);
    if(!mv.length)h=`<p>Todavía no hay cambios: arrastra una curva o prueba un choque. El equilibrio inicial es E₀ = 4.000 con 50 millones de US$ transados.</p>`;
    else{h+=VIS.sec("Qué cambió",VIS.list(mv));const cs=[];
      if(mX)cs.push(X>0?"<b>Más oferta de dólares:</b> ∆+Y* (más exportaciones), ∆+precio del petróleo o mejores términos de intercambio, más remesas o turismo receptivo, más IED o IEC, entrada de capitales por ∆+i o ∆-i*, ∆+π* (Colombia gana competitividad).":"<b>Menos oferta de dólares:</b> ∆-precio del petróleo, ∆-Y*, caen las remesas o el turismo, menos IED, entra menos capital (∆-i o ∆+i*), ∆+π de Colombia (se exporta menos).");
      if(mQ)cs.push(Q>0?"<b>Más demanda de dólares:</b> ∆+Y (más importaciones), ∆+π de Colombia (lo importado se abarata), ∆+ICE (colombianos invierten afuera), salida de capitales por ∆+i* o ∆-i, ∆+Eᵉ (conviene comprar hoy), aranceles más bajos.":"<b>Menos demanda de dólares:</b> ∆+aranceles, ∆-Y, ∆+π* (lo importado se encarece), ∆-ICE, ∆-i* o ∆+i, ∆-Eᵉ.");
      h+=VIS.sec("Qué pudo haberlo causado",VIS.list(cs));
      if(!fijo){const ex=gap;h+=VIS.sec("Mecanismo",`<p>${Math.abs(ex)<0.3?"Al tipo de cambio inicial no queda exceso: los dos desplazamientos se compensan en precio y solo cambia la cantidad transada.":`A E₀ = 4.000 ahora hay <b>${ex>0?"EOD":"EDD"}</b> de ${VIS.n(Math.abs(ex),1)} millones de US$ → ${ex>0?"∆-E: el dólar se abarata (el peso se aprecia)":"∆+E: el dólar se encarece (el peso se deprecia)"}. Al ${ex>0?"bajar":"subir"} E ${ex>0?"cae":"sube"} el TCR: se exporta ${ex>0?"menos":"más"} y se importa ${ex>0?"más":"menos"} (movimiento a lo largo de las curvas) hasta cerrar el exceso en el punto 1.`}</p>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tipo de cambio E",4000,E1,0),VIS.tile("Dólares transados",50,q1,1)])}</div><p>${VIS.near(E1-4000)?"E no cambia.":E1>4000?`Depreciación del peso de ${VIS.n((E1/4000-1)*100,1)} %.`:`Apreciación del peso de ${VIS.n((1-E1/4000)*100,1)} %.`}</p>`)}
      else{const c=gap>0;h+=VIS.sec("Mecanismo (tipo de cambio fijo)",Math.abs(gap)<0.3?"<p>Al tipo de cambio fijo no hay exceso: el banco central no tiene que intervenir.</p>":`<p>El banco central no deja mover E. A Ē = 4.000 hay <b>${c?"EOD":"EDD"}</b> de ${VIS.n(Math.abs(gap),1)} millones de US$, así que ${c?"compra":"vende"} esos dólares (la curva verde):</p><div class="eq al chain">${c?"EOD → el BC compra → ∆+RI ⟺ ∆+M (expansión, con costo cuasifiscal) → ∆-i → ∆+I → ∆+A → ∆+DA → ∆+Y → ∆+P":"EDD → el BC vende → ∆-RI ⟺ ∆-M → ∆+i → ∆-I → ∆-A → ∆-DA → ∆-Y → ∆-P"}</div>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([["Tipo de cambio","4.000 (fijo)"],["Reservas",(gap>0?"+":"−")+VIS.n(Math.abs(gap),1)+" millones de US$",gap>0?"okt":"badt"],["Oferta monetaria",Math.abs(gap)<0.3?"igual":gap>0?"sube":"baja"]])}</div><p>Con tipo fijo, las reservas y la oferta monetaria se vuelven endógenas: el banco renuncia a controlar M para controlar E.</p>`)}}
    return{panels:[P],text:h+probeTxt}}});

// =====================================================================
// 2. Enfoque de activos: mercado monetario + paridad de intereses en (i, E)
VIS.EE0=4000*1.06/1.04;
VIS.add("activos",{t:"Enfoque de activos: dinero y paridad de intereses",panels:2,
  hint:"Arrastra la oferta monetaria (M/P) o la demanda de dinero (L) en el panel izquierdo, o la rentabilidad externa (RE) en el derecho. La RI es la tasa que sale del mercado monetario.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"flex"}],p0:{MS:5,L:0,Ee:VIS.EE0},lim:{MS:[3,7],L:[-2,2],Ee:[3900,4250]},
  presets:[["El BR expande M",{MS:6.5}],["El BR sube su tasa (∆-M)",{MS:3.8}],["La FED sube i*",{Ee:VIS.EE0*1.035}],["Sube Eᵉ (más riesgo país)",{Ee:VIS.EE0*1.05}],["Sube y (más demanda de dinero)",{L:1.2}]],
  fit:{MS:x=>x,L:(m,i)=>m-5-(6-i)/1.2,Ee:(r,E)=>E*(1+r/100)/1.04},
  compute(st){const{MS,L,Ee}=st.p,fijo=st.o.reg==="fijo",Lf=l=>m=>6-1.2*(m-5-l),REf=ee=>r=>1.04*ee/(1+r/100);
    let i1,E1,MSf=MS;if(!fijo){i1=Lf(L)(MS);E1=REf(Ee)(i1)}else{E1=4000;i1=(1.04*Ee/4000-1)*100;MSf=5+L+(6-i1)/1.2}
    const mM=!VIS.near(MS-5),mL=!VIS.near(L),mE=Math.abs(Ee-VIS.EE0)>2,auto=fijo&&!VIS.near(MSf-MS);
    const c1=[{sh:VIS.vx(5),col:"--line",dash:1,op:.55,lab:mM?"M/P":""},{sh:VIS.fx(Lf(0)),col:"--branch",dash:1,op:.55,lab:mL?"L":""},
      {sh:VIS.vx(MS),col:"--line",lab:mM?"M/P’":"M/P (oferta)",op:auto?.5:1},{sh:VIS.fx(Lf(L)),col:"--branch",lab:mL?"L’":"L(y, i)"}];
    const s1=[];if(auto){c1.push({sh:VIS.vx(MSf),col:"--good",lab:"M/P final",lo:16});s1.push({x1:MS,y1:11,x2:MSf,y2:11,col:"--good",arrow:1,lab:MSf>MS?"el BC compra US$":"el BC vende US$"})}
    const mL0=VIS.clamp(5+L+(6-2.4)/1.2,0.3,9.7);
    const P1={cap:"Mercado monetario",xr:[0,10],yr:[0,12],xl:"Saldos reales M/P",yl:"i (%)",curves:c1,segs:s1,pts:[{x:5,y:6,lab:"0"},...((mM||mL||auto)?[{x:MSf,y:i1,lab:"1",col:"--good"}]:[])],
      handles:[{c:"MS",x:MS,y:10.3,col:"--line",name:"la oferta monetaria"},{c:"L",x:mL0,y:Lf(L)(mL0),col:"--branch",name:"la demanda de dinero"}]};
    const c2=[{sh:VIS.vx(6),col:"--line",dash:1,op:.55,lab:VIS.near(i1-6)?"":"RI"},{sh:VIS.fx(REf(VIS.EE0)),col:"--branch",dash:1,op:.55,lab:mE?"RE":""},
      {sh:VIS.vx(i1),col:"--line",lab:VIS.near(i1-6)?"RI = 1 + i":"RI’"},{sh:VIS.fx(REf(Ee)),col:"--branch",lab:mE?"RE’":"RE = (1+i*)Eᵉ/E"}];
    const P2={cap:"Mercado de divisas en (i, E)",xr:[0,12],yr:[3500,4500],xl:"Rentabilidad (%)",yl:"E ($/US$)",fy:v=>VIS.n(v,0),curves:c2,pts:[{x:6,y:4000,lab:"0"},...((!VIS.near(i1-6)||!VIS.near(E1-4000))?[{x:i1,y:E1,lab:"1",col:"--good"}]:[])],
      handles:[{c:"Ee",x:8.5,y:REf(Ee)(8.5),col:"--branch",name:"la rentabilidad externa"}]};
    let h="";const mv=[],cs=[];
    if(mM){mv.push(`La oferta de saldos reales se desplazó <b>${MS>5?"a la derecha":"a la izquierda"}</b>.`);cs.push(MS>5?"<b>Más M/P:</b> el BR expande la oferta monetaria (compra bonos, baja su tasa) o bajan los precios (∆-P).":"<b>Menos M/P:</b> el BR contrae la oferta monetaria (sube su tasa) o suben los precios (∆+P).")}
    if(mL){mv.push(`La demanda de dinero se desplazó <b>${L>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(L>0?"<b>Más demanda de dinero:</b> ∆+y (más producción exige más dinero para transacciones) o un cambio de preferencias hacia la liquidez.":"<b>Menos demanda de dinero:</b> ∆-y o menor preferencia por la liquidez.")}
    if(mE){mv.push(`La rentabilidad externa (RE) se desplazó <b>${Ee>VIS.EE0?"a la derecha":"a la izquierda"}</b>.`);cs.push(Ee>VIS.EE0?"<b>Más RE:</b> ∆+Eᵉ (se espera un dólar más caro: más riesgo país, más inflación esperada), ∆+i* (la FED sube su tasa) o ∆+EMBI.":"<b>Menos RE:</b> ∆-Eᵉ, ∆-i* o menos riesgo país.")}
    if(!mv.length)h="<p>Todavía no hay cambios. En el punto 0 la tasa es 6 %,  RI = RE y E₀ = 4.000. Arrastra una curva o prueba un choque.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));const ch=[];
      if(!fijo){const di=i1-6;if(mM)ch.push(MS>5?"∆+M/P frente a L̄ → EOM → ∆-i":"∆-M/P frente a L̄ → EDM → ∆+i");if(mL)ch.push(L>0?"∆+L frente a M̄/P̄ → EDM → ∆+i":"∆-L frente a M̄/P̄ → EOM → ∆-i");
        if(!VIS.near(di))ch.push(di>0?"∆+i → ∆+RI / R̄E → DR > 0 → ∆+F (entra capital) → EOD → ∆-E":"∆-i → ∆-RI / R̄E → DR < 0 → ∆-F (sale capital) → EDD → ∆+E");
        if(mE)ch.push(Ee>VIS.EE0?"∆+RE / R̄I → DR < 0 → ∆-F → EDD → ∆+E":"∆-RE / R̄I → DR > 0 → ∆+F → EOD → ∆-E");
        h+=VIS.sec("Mecanismo",`<div class="eq al chain">${ch.join("<br>")}</div><p>Al moverse E con Eᵉ dado cambia la ganancia cambiaria esperada (Eᵉ/E) y con ella la RE, hasta que DR = 0 en el punto 1.${mM?" Esto es el corto plazo con P fijo: a mediano plazo suben (bajan) los precios, se corrige M/P, la tasa vuelve y E se devuelve en parte (overshooting).":""}</p>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tasa i (%)",6,i1,2),VIS.tile("Tipo de cambio E",4000,E1,0)])}</div>`)}
      else{const sube=MSf>MS;h+=VIS.sec("Mecanismo (tipo de cambio fijo)",`<p>Con Ē = 4.000 la tasa tiene que ser la que exige la paridad: i = ${VIS.n(i1,2)} %. ${auto?`Para lograrlo el banco central ${sube?"compra":"vende"} dólares: ${sube?"∆+RI ⟺ ∆+M":"∆-RI ⟺ ∆-M"} y la oferta monetaria termina en M/P = ${VIS.n(MSf,2)} (verde).`:"No hace falta intervenir."}${mM&&!mL&&!mE?" La política monetaria es <b>inefectiva</b>: la tasa vuelve a 6 % y solo cambian las reservas.":""} «Entre i y E no hay relación» porque E no se mueve.</p>`);
        h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tasa i (%)",6,i1,2),["Tipo de cambio","4.000 (fijo)"],VIS.tile("M/P final",5,MSf,2)])}</div>`)}}
    return{panels:[P1,P2],text:h}}});

// =====================================================================
// 3. Krugman: EMB (DD) y EMA (AA) en (y, E)
VIS.add("krugman",{t:"Modelo Krugman: EMB y EMA en (y, E)",
  hint:"Arrastra la EMB (mercado de bienes) o la EMA (mercado de activos). Con tipo de cambio fijo la EMA es vertical y la mueven las reservas. El punto 0’ es el efecto impacto.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"flex"}],p0:{B:0,A:0},lim:{B:[-3,3],A:[-3,3]},probe0:{k:0,x:2.2,y:7.6},
  presets:[["Política monetaria expansiva (∆+M)",{A:1.6}],["Política fiscal expansiva (∆+G)",{B:1.6}],["Sube i* (FED)",{A:1.3}],["Cae Y* (recesión mundial)",{B:-1.4}],["Cae P (mueve las dos)",{B:1.1,A:1.1}],["El BR sube su tasa",{A:-1.4}]],
  fit:{B:(y,E)=>y-5-(E-5),A:(y,E,st)=>st.o.reg==="fijo"?y-5:y-5+(E-5)/0.8},
  compute(st){const{B,A}=st.p,fijo=st.o.reg==="fijo",mB=!VIS.near(B),mA=!VIS.near(A),EMB=b=>y=>5+(y-5-b),EMA=a=>y=>5-0.8*(y-5-a);
    let y1,E1,yf;const curves=[{sh:VIS.fx(EMB(0)),col:"--branch",dash:1,op:.55,lab:mB?"EMB":""}],pts=[{x:5,y:5,lab:"0"}],segs=[];
    if(!fijo){y1=5+(B+0.8*A)/1.8;E1=EMB(B)(y1);curves.push({sh:VIS.fx(EMA(0)),col:"--line",dash:1,op:.55,lab:mA?"EMA":""},{sh:VIS.fx(EMB(B)),col:"--branch",lab:mB?"EMB’":"EMB (bienes)"},{sh:VIS.fx(EMA(A)),col:"--line",lab:mA?"EMA’":"EMA (activos)"});
      if(mA&&!mB)pts.push({x:5,y:EMA(A)(5),lab:"0’",col:"--muted"});if(mB&&!mA)pts.push({x:5+B,y:5,lab:"0’",col:"--muted"});
      if(mA!==mB){const p=pts[pts.length-1];segs.push({x1:p.x,y1:p.y,x2:y1,y2:E1,col:"--muted",dash:1,w:1.5,arrow:1})}
      if(mA||mB)pts.push({x:y1,y:E1,lab:"1",col:"--good"})}
    else{yf=5+B;y1=yf;E1=5;curves.push({sh:VIS.vx(5),col:"--line",dash:1,op:.55,lab:(mA||!VIS.near(yf-5))?"EMA":""},{sh:VIS.hy(5),col:"--muted",dash:2,lab:"Ē"},{sh:VIS.fx(EMB(B)),col:"--branch",lab:mB?"EMB’":"EMB (bienes)"});
      const yu=5+A;curves.push({sh:VIS.vx(yu),col:"--line",lab:mA?"EMA’ (tu cambio)":"EMA (vertical)",op:VIS.near(yu-yf)?1:.5,lo:mA?18:0});
      if(!VIS.near(yu-yf)){curves.push({sh:VIS.vx(yf),col:"--good",lab:"EMA final",lo:36});segs.push({x1:yu,y1:8.6,x2:yf,y2:8.6,col:"--good",arrow:1,lab:yf>yu?"el BC compra US$":"el BC vende US$"})}
      if(mA||mB)pts.push({x:yf,y:5,lab:"1",col:"--good"})}
    const hb=VIS.clamp(7.6+B,1,9.2),ha=VIS.clamp(2.6+A,0.5,9);
    const handles=[{c:"B",x:hb,y:EMB(B)(hb),col:"--branch",name:"la EMB"},fijo?{c:"A",x:5+A,y:2,col:"--line",name:"la EMA"}:{c:"A",x:ha,y:EMA(A)(ha),col:"--line",name:"la EMA"}];
    let probeTxt="";const pr=st.probe;if(pr){const ab=pr.y>EMB(B)(pr.x),aa=fijo?pr.x<5+A:pr.y>EMA(A)(pr.x);
      probeTxt=`<p><b>Punto de prueba:</b> ${ab?"por encima o a la izquierda de la EMB hay <b>EDB</b> (la producción tiende a subir)":"por debajo o a la derecha de la EMB hay <b>EOB</b> (la producción tiende a bajar)"}; ${fijo?(aa?"a la izquierda de la EMA vertical sobra dinero: <b>EOM</b>, presión a que salga capital (EDD) y el BC venda dólares":"a la derecha de la EMA vertical falta dinero: <b>EDM</b>, entra capital (EOD) y el BC compra dólares"):(aa?"por encima de la EMA hay <b>EOD / EDM</b> (E tiende a bajar)":"por debajo de la EMA hay <b>EDD / EOM</b> (E tiende a subir)")}.</p>`}
    const P={cap:"Equilibrio macroeconómico en (y, E)",xr:[0,10],yr:[0,10],xl:"Producción y",yl:"Tipo de cambio E",curves,segs,pts,probe:pr,handles};
    let h="";const mv=[],cs=[];
    if(mB){mv.push(`La EMB se desplazó <b>${B>0?"a la derecha (abajo)":"a la izquierda (arriba)"}</b>.`);cs.push(B>0?"<b>EMB a la derecha:</b> ∆+G, ∆-T, ∆+Y*, ∆+TCR por ∆+P* o ∆-P, aranceles, ∆+consumo o inversión autónomos.":"<b>EMB a la izquierda:</b> ∆-G, ∆+T, ∆-Y* (recesión mundial), ∆-precio del petróleo, ∆-TCR por ∆+P, ∆-consumo o inversión autónomos.")}
    if(mA){mv.push(`La EMA se desplazó <b>${A>0?"a la derecha (arriba)":"a la izquierda (abajo)"}</b>.`);cs.push(A>0?"<b>EMA a la derecha:</b> ∆+M, ∆-P (más saldos reales), ∆+i*, ∆+Eᵉ, ∆+riesgo país, menor demanda de dinero.":"<b>EMA a la izquierda:</b> ∆-M (el BR sube su tasa), ∆+P, ∆-i*, ∆-Eᵉ, mayor demanda de dinero.")}
    if(!mv.length)h="<p>Todavía no hay cambios: el equilibrio 0 es el cruce de la EMB (pendiente positiva) y la EMA (pendiente negativa; vertical con tipo fijo). Arrastra una curva o prueba un choque.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));let m="";
      if(!fijo){if(mA&&!mB){const s=A>0;m=`<p><b>(1) Impacto en activos</b> (punto 0’, y₀ fijo): ${s?"∆+M/P → EOM → ∆-i → DR < 0 → ∆-F → EDD → E salta hacia arriba":"∆-M/P → EDM → ∆+i → DR > 0 → ∆+F → EOD → E salta hacia abajo"}.</p><p><b>(2) Ajuste en bienes:</b> ${s?"∆+TCR → ∆+XN → EDB → ∆+y → ∆+L → EDM → ∆+i → EOD → E baja en parte":"∆-TCR → ∆-XN → EOB → ∆-y → ∆-L → EOM → ∆-i → EDD → E sube en parte"}, a lo largo de la EMA’.</p><p><b>(3) Final</b> (punto 1): ${s?"suben E y y: la política monetaria es efectiva con flexible":"bajan E y y"}.</p>`}
        else if(mB&&!mA){const s=B>0;m=`<p><b>(1) Impacto en bienes</b> (punto 0’, E₀ fijo): ${s?"∆+DA → EDB → ∆+y":"∆-DA → EOB → ∆-y"}.</p><p><b>(2) Ajuste en activos:</b> ${s?"∆+y → ∆+L frente a M̄/P̄ → EDM → ∆+i → DR > 0 → ∆+F → EOD → ∆-E → ∆-TCR → ∆-XN":"∆-y → ∆-L → EOM → ∆-i → DR < 0 → ∆-F → EDD → ∆+E → ∆+TCR → ∆+XN"}, a lo largo de la EMA.</p><p><b>(3) Final</b> (punto 1): ${s?"la producción sube menos que en 0’ porque la apreciación quita exportaciones netas (desplazamiento parcial)":"la producción cae menos que en 0’ porque la depreciación amortigua"}.</p>`}
        else{const dEb=-(B)*0.8/1.8,dEa=0.8*A/1.8;m=`<p>Se movieron las dos curvas. Sobre la producción ${Math.sign(B)===Math.sign(A)?"los dos efectos van en la misma dirección":"los efectos se oponen"}; sobre E, la EMB aporta ${VIS.n(dEb,2)} y la EMA ${VIS.n(dEa,2)}: ${Math.sign(dEb)!==Math.sign(dEa)?"el efecto sobre E es <b>ambiguo en teoría</b> y aquí domina "+(Math.abs(dEa)>Math.abs(dEb)?"la EMA":"la EMB")+".":"van en la misma dirección."}${B>0&&A>0?" Es el caso de una caída de precios (Parcial 1, pregunta 15): sube y y E depende de qué desplazamiento es mayor.":""}</p>`}}
      else{const dB=B,dA=A;m=mB?`<p>${dB>0?"∆+DA → ∆+y → ∆+L → EDM → ∆+i → DR > 0 → EOD → presión a la baja de E":"∆-DA → ∆-y → ∆-L → EOM → ∆-i → DR < 0 → EDD → presión al alza de E"}. El BC ${dB>0?"compra dólares → ∆+RI ⟺ ∆+M":"vende dólares → ∆-RI ⟺ ∆-M"}: la EMA vertical acompaña hasta y₁ = ${VIS.n(yf,2)}. ${dB>0?"La política fiscal es <b>efectiva</b> con tipo fijo: la producción sube por completo.":"La caída de la producción se amplifica (M15 del Parcial 1)."}</p>`:"";
        if(mA)m+=`<p>${dA>0?"∆+M → EOM → ∆-i → DR < 0 → EDD → presión al alza de E → el BC vende dólares → ∆-RI ⟺ ∆-M":"∆-M → EDM → ∆+i → DR > 0 → EOD → presión a la baja → el BC compra dólares → ∆+RI ⟺ ∆+M"}: la EMA vuelve a su sitio. La política monetaria es <b>inefectiva</b> con tipo fijo; solo cambian las reservas.</p>`}
      h+=VIS.sec("Mecanismo",m);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producción y",5,y1,2),fijo?["Tipo de cambio","5 (fijo)"]:VIS.tile("Tipo de cambio E",5,E1,2),...(fijo?[["Reservas",VIS.near(yf-5-A)?"igual":yf>5+A?"suben":"bajan"]]:[])])}</div>`)}
    return{panels:[P],text:h+probeTxt}}});

// =====================================================================
// 4. Mundell-Fleming: EMB (IS), EMM (LM) y EMD (BP = 0) en (y, i)
VIS.MOB={none:{t:"Sin movilidad"},low:{t:"Imperfecta (EMD más inclinada que la EMM)",s:2},high:{t:"Imperfecta (EMD menos inclinada)",s:0.3},perf:{t:"Perfecta"}};
VIS.add("mf",{t:"Modelo Mundell-Fleming: EMB, EMM y EMD en (y, i)",
  hint:"Arrastra la EMB, la EMM o la EMD. El punto 1 es el equilibrio interno tras tu cambio; el punto 2, el final después del ajuste del régimen cambiario.",
  opts:[{id:"reg",lab:"Régimen",ch:VIS.REG,v:"fijo"},{id:"mob",lab:"Movilidad",ch:[["none","Sin"],["low","Baja"],["high","Alta"],["perf","Perfecta"]],v:"high"}],
  p0:{B:0,M:0,D:0,I:0},lim:{B:[-3,3],M:[-3,3],D:[-3,3],I:[-2.5,2.5]},probe0:{k:0,x:2,y:8},
  presets:[["Política fiscal expansiva",{B:1.5}],["Política monetaria expansiva",{M:1.5}],["Caen las exportaciones",{B:-1.2,D:-1.2}],["Sube i* (movilidad perfecta)",{I:1.2},{mob:"perf"}],["Suben los impuestos",{B:-1.4}]],
  fit:{B:(y,i)=>y-5+(i-5),M:(y,i)=>y-5-(i-5),D:(y,i,st)=>{const m=st.o.mob;return m==="none"?y-5:y-5-(i-5)/VIS.MOB[m].s},I:(y,i)=>i-5},
  compute(st){const{B,M,D,I}=st.p,fijo=st.o.reg==="fijo",mob=st.o.mob,s=VIS.MOB[mob].s;
    const fB=(b,e)=>y=>5-(y-5-b-0.8*e),fM=m=>y=>5+(y-5-m),dD=(d,e)=>mob==="perf"?VIS.hy(5+I):mob==="none"?VIS.vx(5+d+2*e):VIS.fx(y=>5+s*(y-5-d-2*e));
    const Y1=(B+M)/2,I1=(B-M)/2;let sup;if(mob==="perf")sup=I1-I;else if(mob==="none")sup=D-Y1;else sup=I1-s*(Y1-D);
    let Y2,I2,e=0,Mf=M;
    if(fijo){if(mob==="perf"){I2=I;Y2=B-I}else if(mob==="none"){Y2=D;I2=-D+B}else{Y2=(B+s*D)/(1+s);I2=-Y2+B}Mf=Y2-I2}
    else{if(mob==="perf"){I2=I;Y2=I+M;e=(I2+Y2-B)/0.8}else if(mob==="none"){Y2=(5*M+5*B-D)/9;e=(2*Y2-M-B)/0.8}else{Y2=(M+s*(5*M+5*B-D))/(1+9*s);e=(2*Y2-M-B)/0.8}I2=Y2-M}
    const mB=!VIS.near(B),mM=!VIS.near(M),mD=mob==="perf"?!VIS.near(I):!VIS.near(D),moved=mB||mM||mD;
    const curves=[{sh:VIS.fx(fB(0,0)),col:"--branch",dash:1,op:.5},{sh:VIS.fx(fM(0)),col:"--line",dash:1,op:.5},{sh:dD(0,0),col:"--good",dash:1,op:.5}];
    const adjB=!fijo&&!VIS.near(e),adjM=fijo&&!VIS.near(Mf-M),adjD=!fijo&&!VIS.near(e)&&mob!=="perf";
    curves.push({sh:VIS.fx(fB(B,0)),col:"--branch",lab:adjB?"EMB₁":mB?"EMB’":"EMB",op:adjB?.45:1,dash:adjB?2:0,w:adjB?2:0});
    curves.push({sh:VIS.fx(fM(M)),col:"--line",lab:adjM?"EMM₁":mM?"EMM’":"EMM",op:adjM?.45:1,dash:adjM?2:0,w:adjM?2:0});
    curves.push({sh:dD(D,0),col:"--good",lab:adjD?"EMD₁":mD?"EMD’":"EMD (BP = 0)",op:adjD?.45:1,dash:adjD?2:0,w:adjD?2:0,lo:mob==="none"?34:0});
    if(adjB)curves.push({sh:VIS.fx(fB(B,e)),col:"--branch",lab:"EMB₂"});if(adjM)curves.push({sh:VIS.fx(fM(Mf)),col:"--line",lab:"EMM₂"});if(adjD)curves.push({sh:dD(D,e),col:"--good",lab:"EMD₂",lo:mob==="none"?50:0});
    const pts=[{x:5,y:5,lab:"0"}];if(moved){pts.push({x:5+Y1,y:5+I1,lab:"1",col:"--muted"});pts.push({x:5+Y2,y:5+I2,lab:"2",col:"--good"})}
    const hb=VIS.clamp(7.4+B,1,9.2),hm=VIS.clamp(7.6+M,1,9.2),handles=[{c:"B",x:hb,y:fB(B,0)(hb),col:"--branch",name:"la EMB"},{c:"M",x:hm,y:fM(M)(hm),col:"--line",name:"la EMM"}];
    if(mob==="perf")handles.push({c:"I",x:1.2,y:5+I,col:"--good",name:"la EMD"});else if(mob==="none")handles.push({c:"D",x:5+D,y:1.3,col:"--good",name:"la EMD"});else{const hd=VIS.clamp(mob==="low"?6.6+D:8+D,0.8,9.2);handles.push({c:"D",x:hd,y:5+s*(hd-5-D),col:"--good",name:"la EMD"})}
    let probeTxt="";const pr=st.probe;if(pr){const Y=pr.x-5,Ii=pr.y-5;const ab=Ii>-(Y-B),am=Ii>Y-M;let bp;if(mob==="perf")bp=Ii-I;else if(mob==="none")bp=D-Y;else bp=Ii-s*(Y-D);
      probeTxt=`<p><b>Punto de prueba:</b> ${ab?"por encima de la EMB hay <b>EOB</b>":"por debajo de la EMB hay <b>EDB</b>"}; ${am?"por encima de la EMM hay <b>EOM</b>":"por debajo de la EMM hay <b>EDM</b>"}; ${Math.abs(bp)<0.02?"sobre la EMD la BP está en equilibrio":bp>0?"por encima (a la izquierda) de la EMD hay <b>superávit en BP (EOD)</b>":"por debajo (a la derecha) de la EMD hay <b>déficit en BP (EDD)</b>"}.</p>`}
    const P={cap:"Equilibrio en (y, i) · "+VIS.MOB[mob].t,xr:[0,10],yr:[0,10],xl:"Producción y",yl:"Tasa de interés i",curves,pts,probe:pr,handles};
    let h="";const mv=[],cs=[];
    if(mB){mv.push(`La EMB se desplazó <b>${B>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(B>0?"<b>EMB a la derecha:</b> ∆+G, ∆-T, ∆+consumo o inversión autónomos, ∆+exportaciones exógenas (∆+Y*).":"<b>EMB a la izquierda:</b> ∆-G, ∆+T, caen el consumo, la inversión o las exportaciones.")}
    if(mM){mv.push(`La EMM se desplazó <b>${M>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(M>0?"<b>EMM a la derecha:</b> ∆+M (política monetaria expansiva), ∆-P o menor demanda de dinero.":"<b>EMM a la izquierda:</b> ∆-M, ∆+P o mayor demanda de dinero.")}
    if(mD){if(mob==="perf"){mv.push(`La EMD (horizontal en i = i*) se desplazó <b>${I>0?"hacia arriba":"hacia abajo"}</b>.`);cs.push(I>0?"<b>EMD arriba:</b> ∆+i* (la FED sube su tasa) o ∆+riesgo país.":"<b>EMD abajo:</b> ∆-i* o menos riesgo país.")}
      else{mv.push(`La EMD se desplazó <b>${D>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(D>0?"<b>EMD a la derecha:</b> mejora exógena de la balanza comercial (∆+Y*, más demanda de exportaciones) o de los flujos de capital (∆-i*, menos riesgo, ∆-Eᵉ).":"<b>EMD a la izquierda:</b> caen las exportaciones exógenas, ∆+i*, ∆+riesgo país o ∆+Eᵉ.")}}
    if(!moved)h="<p>Todavía no hay cambios: en 0 se cruzan la EMB, la EMM y la EMD (equilibrio interno y externo). Arrastra una curva o prueba un choque.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));
      const bal=Math.abs(sup)<0.02?"equilibrio":sup>0?"sup":"def";
      let m=`<p><b>(1) Efecto impacto:</b> el nuevo equilibrio interno (EMB = EMM) es el punto 1. Allí ${bal==="equilibrio"?"la BP queda en equilibrio y no hace falta más ajuste.":bal==="sup"?"hay <b>superávit en BP (EOD)</b>: el punto queda por encima de la EMD.":"hay <b>déficit en BP (EDD)</b>: el punto queda por debajo de la EMD."}${mob!=="perf"&&bal!=="equilibrio"?" (∆y mueve la balanza comercial y ∆i la cuenta financiera.)":""}</p>`;
      if(bal!=="equilibrio")m+=fijo?`<p><b>(2) Tipo de cambio fijo:</b> ${bal==="sup"?"el BC compra divisas → ∆+RI → ∆+M: la EMM se desplaza a la derecha":"el BC vende divisas → ∆-RI → ∆-M: la EMM se desplaza a la izquierda"} hasta el punto 2, donde se cruzan las tres curvas. La EMM se endogeniza.</p>`
        :`<p><b>(2) Tipo de cambio flexible:</b> ${bal==="sup"?"EOD → ∆-E → ∆-TCR → ∆-X / ∆+Q → ∆-XN: la EMB se desplaza a la izquierda"+(mob!=="perf"?" y la EMD también":""):"EDD → ∆+E → ∆+TCR → ∆+X / ∆-Q → ∆+XN: la EMB se desplaza a la derecha"+(mob!=="perf"?" y la EMD también":"")} hasta el punto 2. La oferta monetaria no cambia.</p>`;
      h+=VIS.sec("Mecanismo",m);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producción y",5,5+Y2,2),VIS.tile("Tasa i",5,5+I2,2),fijo?["Reservas y M",VIS.near(Mf-M)?"sin intervención":Mf>M?"suben":"bajan"]:["Tipo de cambio",VIS.near(e)?"igual":e>0?"se deprecia":"se aprecia",VIS.near(e)?"":e>0?"badt":"okt"]])}</div>${mob==="perf"&&mM&&fijo&&!mB?"<p>Con movilidad perfecta y tipo fijo la política monetaria es inefectiva: el punto 2 es el mismo 0.</p>":""}${mob==="perf"&&mB&&!fijo&&!mM?"<p>Con movilidad perfecta y tipo flexible la política fiscal es inefectiva: la apreciación devuelve la EMB a su lugar.</p>":""}`)}
    return{panels:[P],text:h+probeTxt}}});

// =====================================================================
// 5. SA-DA en (Y, P)
VIS.SAM={clasico:"Clásico tradicional",nmc:"Nueva macro clásica",keynes:"Keynesiano tradicional",nmk:"Nueva macro keynesiana"};
VIS.add("sada",{t:"Oferta y demanda agregada en (Y, P)",
  hint:"Arrastra la DA, la SA de corto plazo o la de largo plazo (Ȳ). El punto 1 es el corto plazo; el 2, el largo plazo cuando las expectativas se ajustan.",
  opts:[{id:"mod",lab:"Modelo",ch:[["clasico","Clásico"],["nmc","NMC"],["keynes","Keynesiano"],["nmk","NMK"]],v:"nmc"}],
  p0:{D:0,S:0,Lr:0},lim:{D:[-3,3],S:[-3,3],Lr:[-2.5,2.5]},
  presets:[["Expansión de la DA (∆+M o ∆+G)",{D:1.5}],["Choque petrolero (costos)",{S:-1.4}],["Caída del consumo",{D:-1.3}],["Más productividad (Ȳ)",{Lr:1.2,S:1.2}]],
  fit:{D:(Y,P)=>Y-5+(P-5),S:(Y,P,st)=>st.o.mod==="keynes"?5-P:Y-5-(P-5)/0.8,Lr:Y=>Y-5},
  compute(st){const{D,S,Lr}=st.p,mod=st.o.mod,fD=d=>Y=>5-(Y-5-d),fS=s=>mod==="keynes"?VIS.hy(5-s):VIS.fx(Y=>5+0.8*(Y-5-s));
    let Y1,P1,Y2=null,P2=null,Sf=null;
    if(mod==="clasico"){Y1=5+Lr;P1=fD(D)(Y1)}else if(mod==="keynes"){P1=5-S;Y1=5+D+S}else{Y1=5+(D+0.8*S)/1.8;P1=fD(D)(Y1)}
    if(mod==="nmc"&&!VIS.near(Y1-5-Lr)){Y2=5+Lr;P2=fD(D)(Y2);Sf=Lr-(P2-5)/0.8}
    const mD=!VIS.near(D),mS=mod!=="clasico"&&!VIS.near(S),mL=!VIS.near(Lr),moved=mD||mS||mL;
    const curves=[{sh:VIS.fx(fD(0)),col:"--branch",dash:1,op:.5},{sh:VIS.vx(5),col:"--muted",dash:1,op:.5}];
    if(mod!=="clasico")curves.push({sh:fS(0),col:"--line",dash:1,op:.5});
    curves.push({sh:VIS.fx(fD(D)),col:"--branch",lab:mD?"DA’":"DA"},{sh:VIS.vx(5+Lr),col:mod==="clasico"?"--line":"--muted",lab:mod==="clasico"?(mL?"SA’ = Ȳ’":"SA = Ȳ"):(mL?"Ȳ’ (SA de largo plazo)":"Ȳ (SA de largo plazo)"),w:mod==="clasico"?2.6:1.8});
    if(mod!=="clasico")curves.push({sh:fS(S),col:"--line",lab:mS?"SA’ (corto plazo)":"SA (corto plazo)",op:Sf!==null?.5:1});
    const segs=[];if(Sf!==null){curves.push({sh:fS(Sf),col:"--good",dash:1,lab:"SA con Pᵉ ajustada"});segs.push({x1:Y1,y1:P1,x2:Y2,y2:P2,col:"--muted",dash:1,w:1.5,arrow:1})}
    const pts=[{x:5,y:5,lab:"0"}];if(moved){pts.push({x:Y1,y:P1,lab:"1",col:Y2===null?"--good":"--muted"});if(Y2!==null)pts.push({x:Y2,y:P2,lab:"2",col:"--good"})}
    const hd=VIS.clamp(7.6+D,1,9.2),handles=[{c:"D",x:hd,y:fD(D)(hd),col:"--branch",name:"la DA"},{c:"Lr",x:5+Lr,y:9.3,col:mod==="clasico"?"--line":"--muted",name:"la SA de largo plazo"}];
    if(mod==="keynes")handles.push({c:"S",x:1.5,y:5-S,col:"--line",name:"la SA"});else if(mod!=="clasico"){const hs=VIS.clamp(7.4+S,1,9.2);handles.push({c:"S",x:hs,y:5+0.8*(hs-5-S),col:"--line",name:"la SA de corto plazo"})}
    const P={cap:"SA-DA · "+VIS.SAM[mod],xr:[0,10],yr:[0,10],xl:"Producción Y",yl:"Nivel de precios P",curves,segs,pts,handles};
    let h="";const mv=[],cs=[];
    if(mD){mv.push(`La DA se desplazó <b>${D>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(D>0?"<b>DA a la derecha:</b> ∆+M (efectiva con tipo flexible), ∆+G o ∆-T (con tipo fijo), ∆+X exógenas (con fijo), ∆+i* (con flexible, por la depreciación), entrada de capitales (con fijo).":"<b>DA a la izquierda:</b> ∆-M, ∆-G o ∆+T, cae el consumo, caen las exportaciones (con fijo), salida de capitales (con fijo).")}
    if(mS){mv.push(`La SA de corto plazo se desplazó <b>${S>0?"a la derecha (abajo)":"a la izquierda (arriba)"}</b>.`);cs.push(S>0?"<b>SA a la derecha:</b> abaratamiento de insumos importados, ∆-salario mínimo o ∆-contribuciones a la nómina, ∆-Pᵉ (NMC), más productividad.":"<b>SA a la izquierda:</b> ∆+precio del petróleo u otro insumo importado, ∆+salario mínimo (NMK), ∆+contribuciones a la nómina, ∆+Pᵉ (NMC).")}
    if(mL){mv.push(`La producción de pleno empleo Ȳ se desplazó <b>${Lr>0?"a la derecha":"a la izquierda"}</b>.`);cs.push(Lr>0?"<b>Ȳ a la derecha:</b> más productividad, más capital o más población activa.":"<b>Ȳ a la izquierda:</b> un choque de oferta permanente (por ejemplo, costos más altos que reducen el empleo de pleno empleo).")}
    if(!moved)h="<p>Todavía no hay cambios: en 0 la economía está en pleno empleo. Arrastra una curva o prueba un choque, y cambia de modelo para comparar.</p>";
    else{h+=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs));let m="";
      if(mod==="clasico")m=`<p>Con información completa la SA es vertical en Ȳ: ${mD&&!mL?"un cambio de la DA solo mueve los precios (el dinero es neutral); el salario nominal se ajusta en la misma proporción.":"la producción la fija Ȳ y los precios se ajustan para que la DA la compre."}</p>`;
      else if(mod==="keynes")m="<p>Con precios fijos y capacidad ociosa, la DA determina la producción: los cambios de la DA mueven Y y el empleo sin mover P.</p>";
      else if(mod==="nmc")m=`<p><b>Corto plazo</b> (punto 1): con Pᵉ dada, ${P1>5?"el alza de precios baja el salario real como costo y sube el empleo y la producción":"la caída de precios sube el salario real como costo y baja el empleo"}${mS&&!mD?" (aquí el choque es de costos: suben los precios y cae la producción, estanflación)":""}.</p>${Y2!==null?`<p><b>Largo plazo</b> (punto 2): los trabajadores corrigen sus expectativas, la SA de corto plazo se desplaza (verde) y la economía vuelve a Ȳ con precios ${P2>5?"más altos":"más bajos"}.</p>`:""}`;
      else m=`<p>Con salario mínimo rígido, ${P1>5?"el alza de precios baja W̄/P y sube el empleo y la producción":"la caída de precios sube W̄/P y baja el empleo y la producción"}${mS&&!mD?" (con el choque de costos suben los precios y cae el empleo)":""}. El efecto <b>persiste</b>: no hay ajuste automático de vuelta a Ȳ.</p>`;
      h+=VIS.sec("Mecanismo",m);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producción (corto plazo)",5,Y1,2),VIS.tile("Precios (corto plazo)",5,P1,2),...(Y2!==null?[VIS.tile("Producción (largo plazo)",5,Y2,2),VIS.tile("Precios (largo plazo)",5,P2,2)]:[])])}</div>`)}
    return{panels:[P],text:h}}});
