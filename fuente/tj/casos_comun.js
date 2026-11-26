// ===================== LABORATORIOS (casos reales): plantilla y utilidades comunes =====================
const LAB_CASO=(o)=>`<div class="caso">
<div class="paso"><h4>La situación</h4>${o.sit}</div>
<div class="paso"><h4>La pregunta que hay que responder</h4>${o.preg}</div>
<div class="paso"><h4>${o.hDatos||"Los datos y el modelo"}</h4>${o.datos}</div>
<div class="paso"><h4>${o.hPaso||"De la estimación a la decisión"}</h4>${o.paso}</div>
<section><h3>Simulador de la decisión</h3><p class="hint" style="margin:0 0 8px">${o.simh}</p><div class="sim" id="sim"></div></section>
<div class="paso benef"><h4>La decisión y el beneficio</h4>${o.benef}</div>
<div class="paso limite"><h4>Cuándo no funciona</h4>${o.limite}</div>
<div class="paso"><h4>${o.rt||"Hazlo en R con la base del curso"}</h4><div><button class="cp" type="button" data-copy>Copiar</button><pre>${o.r}</pre></div></div>
</div>`;
const labKpi=(v,l)=>`<div class="kpi"><b>${v}</b><span>${l}</span></div>`;
// gráfico de línea con marcas: series [{pts,color,dash}], verticales [{x,color,lbl}], banda [x0,x1]
function labPlot({xr,yr,series,vlines=[],hl=[],band,xl,yl,label}){const W=600,H=250,f=frame(W,H,xr,yr,ticks(xr[0],xr[1],nice((xr[1]-xr[0])/6)),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl);
  const cl=y=>Math.max(yr[0],Math.min(yr[1],y));
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${band?`<rect x="${f.sx(band[0])}" y="${f.T}" width="${Math.max(1,f.sx(band[1])-f.sx(band[0]))}" height="${H-f.T-f.B}" fill="var(--line-soft)" opacity=".7"/>`:""}${f.g}${hl.map(h=>`<line x1="${f.L}" x2="${W-f.R}" y1="${f.sy(h)}" y2="${f.sy(h)}" stroke="var(--bad)" stroke-dasharray="5 4"/>`).join("")}
  ${series.map(s=>`<polyline fill="none" stroke="var(${s.color||"--line"})" stroke-width="2.2" ${s.dash?'stroke-dasharray="6 4"':""} points="${s.pts.map(p=>f.sx(p[0]).toFixed(1)+","+f.sy(cl(p[1])).toFixed(1)).join(" ")}"/>`).join("")}
  ${vlines.map(v=>`<line x1="${f.sx(v.x)}" x2="${f.sx(v.x)}" y1="${f.T}" y2="${H-f.B}" stroke="var(${v.color||"--muted"})" stroke-dasharray="4 3"/>${v.dot!==undefined?`<circle cx="${f.sx(v.x)}" cy="${f.sy(cl(v.dot))}" r="5" fill="var(${v.color||"--line"})"/>`:""}${v.lbl?`<text x="${f.sx(v.x)+4}" y="${f.T+12}" font-size="11" fill="var(--muted)">${v.lbl}</text>`:""}`).join("")}</svg></div>`}

