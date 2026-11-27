// ---------- Figuras de los talleres: árboles y juegos de señalización dibujados desde los mismos datos de los resolvedores
// En el HTML de un punto:  <div class="tjfig" data-ext="f1" data-hl="r=A,z=D" data-cap="..."></div>   (árbol del resolvedor)
//                          <div class="tjfig" data-sg="f1" data-hl="t1=D,t2=I,I=a,D=a" data-cap="..."></div> (señalización)
function sgFig(g,hl){hl=hl||{};const W=660,H=330,cx=330,yT=70,yB=260,xL=170,xR=490,T=g.T,M=g.M,R=g.R;
  const on=(k,v)=>hl[k]===v,col=b=>b?"var(--exam)":"var(--line)",sw=b=>b?3.4:1.6,mu=["μ","μ′"];let e="",t="";
  const txt=(x,y,s,o={})=>`<text x="${x}" y="${y}" font-size="${o.fs||13}" text-anchor="${o.a||"middle"}" fill="${o.c||"var(--ink)"}" font-weight="${o.w||500}" ${o.mono?'font-family="var(--f-mono)"':""}>${s}</text>`;
  // naturaleza y tipos
  e+=`<line x1="${cx}" y1="${yT}" x2="${cx}" y2="${yB}" stroke="var(--line)" stroke-width="1.6"/>`;
  t+=`<circle cx="${cx}" cy="${(yT+yB)/2}" r="6" fill="var(--card)" stroke="var(--ink)" stroke-width="1.8"/>`+txt(cx+12,(yT+yB)/2+5,"N",{a:"start",c:"var(--muted)"});
  t+=txt(cx+8,(yT+(yT+yB)/2)/2+4,qs_(T[0].p),{a:"start",fs:12,c:"var(--muted)"})+txt(cx+8,((yT+yB)/2+yB)/2+4,qs_(T[1].p),{a:"start",fs:12,c:"var(--muted)"});
  [[yT,0],[yB,1]].forEach(([y,ti])=>{
    [[xL,0],[xR,1]].forEach(([x,mi])=>{const b=on(T[ti].n,M[mi]);e+=`<line x1="${cx}" y1="${y}" x2="${x}" y2="${y}" stroke="${col(b)}" stroke-width="${sw(b)}"/>`;t+=txt((cx+x)/2,y-8,M[mi],{w:b?700:500});
      // respuestas del receptor
      const dir=mi===0?-1:1;[0,1].forEach(ri=>{const yy=y+(ri===0?-34:34),xx=x+dir*100,bb=on(M[mi],R[ri]);e+=`<line x1="${x}" y1="${y}" x2="${xx}" y2="${yy}" stroke="${col(bb)}" stroke-width="${sw(bb)}"/>`;
        t+=txt(x+dir*42,(y+yy)/2+(ri===0?-4:14),R[ri],{fs:12,w:bb?700:500})+txt(xx+dir*6,yy+4,`(${SGN.u(g,ti,mi,ri).map(qs_).join(", ")})`,{a:mi===0?"end":"start",fs:12.5,mono:true})});
      t+=`<circle cx="${x}" cy="${y}" r="5.5" fill="var(--ink)"/>`+txt(x+(mi===0?8:-8),y+(ti===0?20:-12),ti===0?mu[mi]:"1 − "+mu[mi],{a:mi===0?"start":"end",fs:12,c:"var(--exam)",w:600})});
    t+=`<circle cx="${cx}" cy="${y}" r="5.5" fill="var(--ink)"/>`+txt(cx,y+(ti===0?-12:22),T[ti].n,{w:600})});
  [xL,xR].forEach(x=>{e+=`<line x1="${x}" y1="${yT}" x2="${x}" y2="${yB}" stroke="var(--muted)" stroke-width="1.6" stroke-dasharray="6 4"/>`;t+=txt(x+(x===xL?-10:10),(yT+yB)/2+4,"2",{a:x===xL?"end":"start",c:"var(--muted)"})});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" style="max-width:${W}px" role="img" aria-label="Juego de señalización en forma extensiva">${e}${t}</svg></div>`}
function tjFigs(root){if(!root)return;
  root.querySelectorAll(".tjfig").forEach(el=>{if(el.dataset.done)return;el.dataset.done="1";
    const hl={};(el.dataset.hl||"").split(",").map(s=>s.trim()).filter(Boolean).forEach(p=>{const [k,v]=p.split("=").map(s=>s.trim());hl[k]=v});
    let svg="";try{
      if(el.dataset.sg){svg=sgFig(SGN.parse(SGP[el.dataset.sg].x),hl)}
      else if(el.dataset.ext){const g=EXT.parse(EXP[el.dataset.ext].x);let A=null,path=null;
        if(Object.keys(hl).length){A={};for(const [nd,ac] of Object.entries(hl)){const n=g.nodes[nd];if(n&&!n.leaf)A[n.si]=n.acts.indexOf(ac)}
          path=[g.root];let id=g.root;while(!g.nodes[id].leaf){const n=g.nodes[id],a=A[n.si];if(a==null||a<0)break;id=n.ch[a];path.push(id)}}
        svg=arbTree(g,A,path)}
    }catch(err){svg=`<p class="err">No se pudo dibujar la figura: ${err.message}</p>`}
    el.innerHTML=svg+(el.dataset.cap?`<p class="hint">${el.dataset.cap}</p>`:"")})}
window.FIGS=tjFigs;
