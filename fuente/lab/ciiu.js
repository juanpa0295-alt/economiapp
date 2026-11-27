// ===================== BUSCADOR DE CÓDIGOS CIIU (Rev. 4 A.C., DANE) =====================
(function(){
const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9ñ ]+/g," ").replace(/\s+/g," ").trim();
const STOP=new Set(["de","del","la","las","el","los","y","en","a","al","por","para","con","o","u","e","un","una","sus","otros","otras","n","c","p"]);
const CLS=Object.entries(CIIU_CLS).map(([c,t])=>{const d=c.slice(0,2),g=c.slice(0,3),dv=CIIU_DIV[d]||["",""],s=dv[0];
  return{c,t,d,g,s,dt:dv[1],gt:CIIU_GRP[g]||"",st:CIIU_SEC[s]||"",nt:norm(t),wt:norm(t).split(" "),wc:norm((CIIU_GRP[g]||"")+" "+dv[1]).split(" ")}});
const hasW=(ws,st)=>ws.some(w=>w.startsWith(st));
const SIN=Object.entries(CIIU_SIN).map(([k,c])=>[norm(k),c]);
function buscar(q,sec){const nq=norm(q);let res=[];
  if(/^\d{1,4}$/.test(nq)){res=CLS.filter(x=>x.c.startsWith(nq)).map(x=>({x,sc:100-x.c.length}))}
  else if(nq){const ws=nq.split(" ").filter(w=>w.length>1&&!STOP.has(w));
    const pad=" "+nq+" ",sinHit=new Set(SIN.filter(([k])=>pad.includes(" "+k+" ")).map(([,c])=>c));
    res=CLS.map(x=>{let sc=0;if(sinHit.has(x.c))sc+=50;let all=ws.length>0;
      for(const w of ws){const st=w.length>4?w.slice(0,w.length-1):w;// tolera plurales simples
        if(hasW(x.wt,st))sc+=10;else if(hasW(x.wc,st))sc+=3;else all=false}
      if(all&&ws.length)sc+=15;return{x,sc}}).filter(z=>z.sc>0)}
  else res=CLS.map(x=>({x,sc:0}));
  if(sec)res=res.filter(z=>z.x.s===sec);
  return res.sort((a,b)=>b.sc-a.sc||a.x.c.localeCompare(b.x.c))}
const hiL=(t,q)=>{const ws=norm(q).split(" ").filter(w=>w.length>2&&!STOP.has(w));if(!ws.length)return t;
  return t.split(/(\s+)/).map(tok=>{const n=norm(tok);return ws.some(w=>n.startsWith(w.length>4?w.slice(0,-1):w))&&n?`<mark>${tok}</mark>`:tok}).join("")};
SIMS.ciiu=function(){const box=$("sim");
  box.innerHTML=`<div class="ciiu">
   <div class="ciiu-q"><label for="ci-q">Busca por actividad o por código</label><input id="ci-q" type="search" autocomplete="off" placeholder="Ej.: confección, tienda de barrio, software, 4791, 14" aria-describedby="ci-h">
   <label for="ci-s">Sección</label><select id="ci-s"><option value="">Todas las secciones</option>${Object.entries(CIIU_SEC).map(([k,v])=>`<option value="${k}">${k} · ${v}</option>`).join("")}</select></div>
   <p class="hint" id="ci-h">Escribe palabras de lo que haces (no hace falta tilde) o los primeros dígitos del código: 2 dígitos es la división, 3 el grupo y 4 la clase, que es el código que va en el RUT y en el registro mercantil.</p>
   <div id="ci-n" class="hint" aria-live="polite"></div><div id="ci-r" class="ciiu-r"></div>
   <details class="ciiu-dian"><summary>Códigos especiales de la DIAN (no son CIIU)</summary><p class="hint">La DIAN los creó para personas naturales sin actividad económica empresarial. Se usan en el RUT.</p><ul>${Object.entries(CIIU_DIAN).map(([c,t])=>`<li><b class="ciiu-c">${c}</b> ${t}</li>`).join("")}</ul></details></div>`;
  const q=$("ci-q"),s=$("ci-s");let lim=40;
  const ficha=x=>`<div class="ciiu-f"><p class="ciiu-br">Sección ${x.s} · ${x.st} › División ${x.d} · ${x.dt} › Grupo ${x.g} · ${x.gt}</p>
    <p><b>Para qué sirve este código:</b> se escribe en la casilla de actividad económica del RUT (DIAN) y en el formulario del registro mercantil (cámara de comercio). Con él el municipio define la tarifa del impuesto de industria y comercio (ICA), y la DIAN y las autoridades lo usan para obligaciones y estadísticas. Puedes tener una actividad principal y hasta tres secundarias.</p>
    <p class="hint">Confirma la descripción completa en las notas explicativas del DANE si la actividad es dudosa: lo que manda es lo que realmente haces, no el nombre del negocio.</p></div>`;
  const run=()=>{const r=buscar(q.value,s.value),show=r.slice(0,lim);
    $("ci-n").textContent=q.value.trim()||s.value?`${r.length} clase${r.length===1?"":"s"} encontrada${r.length===1?"":"s"}${r.length>lim?`; se muestran las ${lim} más parecidas`:""}.`:`${CLS.length} clases en total. Escribe para buscar.`;
    $("ci-r").innerHTML=show.length?show.map(({x})=>`<details class="ciiu-i"><summary><b class="ciiu-c">${x.c}</b><span>${hiL(x.t,q.value)}${norm(x.gt)!==x.nt?`<small>${x.gt}</small>`:""}</span></summary>${ficha(x)}</details>`).join("")+(r.length>lim?`<button class="btn" type="button" id="ci-more">Ver más resultados</button>`:""):
      `<p>No encontré esa actividad. Prueba con otra palabra (por ejemplo «venta» en vez de «tienda», o el producto que vendes) o busca por sección.</p>`;
    const m=$("ci-more");if(m)m.onclick=()=>{lim+=60;run()}};
  q.addEventListener("input",()=>{lim=40;run()});s.onchange=()=>{lim=40;run()};run()};
})();

// ===================== GLOSARIO Y NORMAS DE DERECHO COMERCIAL =====================
(function(){const norm=s=>String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
SIMS.glosCom=function(){const box=$("sim");
  box.innerHTML=`<div class="ciiu"><div class="ciiu-q"><label for="gl-q">Busca un término, una norma o un artículo</label><input id="gl-q" type="search" autocomplete="off" placeholder="Ej.: pagaré, SAS, 884, retracto, Ley 1116"></div>
  <div class="ptabs" role="tablist" style="margin:10px 0"><button type="button" class="on" data-gt="g" aria-selected="true">Definiciones (${GLOS_COM.length})</button><button type="button" data-gt="n" aria-selected="false">Normas (${NORMAS_COM.length})</button></div><div id="gl-r"></div></div>`;
  let tab="g";const q=$("gl-q");
  const run=()=>{const v=norm(q.value.trim());
    if(tab==="g"){const r=GLOS_COM.filter(([t,d,n])=>!v||norm(t+" "+d+" "+n).includes(v));
      $("gl-r").innerHTML=r.length?`<dl class="glos">${r.map(([t,d,n])=>`<dt>${t}</dt><dd>${d} <span class="glos-n">${n}</span></dd>`).join("")}</dl>`:`<p>No hay definiciones con «${q.value}».</p>`}
    else{const r=NORMAS_COM.filter(([n,d])=>!v||norm(n+" "+d).includes(v));
      $("gl-r").innerHTML=r.length?`<div class="tbl"><table><tr><th>Norma</th><th>Qué regula</th></tr>${r.map(([n,d])=>`<tr><td><b>${n}</b></td><td>${d}</td></tr>`).join("")}</table></div>`:`<p>No hay normas con «${q.value}».</p>`}};
  box.querySelectorAll("[data-gt]").forEach(b=>b.onclick=()=>{tab=b.dataset.gt;box.querySelectorAll("[data-gt]").forEach(x=>{x.classList.toggle("on",x===b);x.setAttribute("aria-selected",x===b)});run()});
  q.addEventListener("input",run);run()};

// ===================== PLAZOS DE LOS TÍTULOS VALORES =====================
SIMS.titulos=function(){const box=$("sim");
  box.innerHTML=`<div class="ctr"><label class="selw" for="tv-k">Título<select id="tv-k"><option value="p">Pagaré o letra de cambio</option><option value="c">Cheque</option></select></label>
  <label class="selw" for="tv-f"><span id="tv-fl">Fecha de vencimiento</span><input id="tv-f" type="date"></label>
  <label class="selw" for="tv-l" id="tv-lw">Lugar de pago<select id="tv-l"><option value="0">Misma plaza (15 días)</option><option value="1">Otro lugar del país (1 mes)</option><option value="2">Exterior (3 meses)</option></select></label>
  <label class="selw" for="tv-v" id="tv-vw">Valor del cheque<input id="tv-v" type="number" min="0" step="1000" value="1000000"></label></div><div id="tv-o"></div>`;
  const f=$("tv-f"),d=new Date();f.value=`${d.getFullYear()-1}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const add=(s,y,m,dd)=>{const [Y,M,D]=s.split("-").map(Number);const x=new Date(Y+y,M-1+m,D+dd);return x},fd=x=>x.toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"});
  const run=()=>{const k=$("tv-k").value;$("tv-fl").textContent=k==="c"?"Fecha de creación (giro) del cheque":"Fecha de vencimiento";$("tv-lw").style.display=$("tv-vw").style.display=k==="c"?"":"none";
    if(!f.value){$("tv-o").innerHTML=err("escribe una fecha.");return}const hoy=new Date();hoy.setHours(0,0,0,0);
    const fila=(t,x,a)=>`<tr><td>${t}</td><td><b>${fd(x)}</b></td><td>${x<hoy?'<span class="tag" style="background:var(--bad-soft,#fde2e2)">ya venció</span>':'<span class="tag" style="background:var(--good-soft,#dff3e4)">vigente</span>'}</td><td class="hint">${a}</td></tr>`;
    let rows="";
    if(k==="p"){rows=fila("Acción cambiaria directa (contra el otorgante, el aceptante y sus avalistas)",add(f.value,3,0,0),"Tres años desde el vencimiento (art. 789)")+fila("Acción cambiaria de regreso (contra girador y endosantes)",add(f.value,1,0,0),"Un año desde el vencimiento (art. 790)")}
    else{const L=+$("tv-l").value,pres=L===0?add(f.value,0,0,15):L===1?add(f.value,0,1,0):add(f.value,0,3,0),v=V("tv-v");
      rows=fila("Último día para presentar el cheque al banco",pres,"Art. 718")+fila("Prescripción de las acciones del cheque (si se presenta el último día)",add(pres.toISOString().slice(0,10),0,6,0),"Seis meses desde la presentación (art. 730)");
      rows+=`<tr><td>Sanción si se devuelve por falta de fondos</td><td><b>$${fmt(v*0.2,0)}</b></td><td></td><td class="hint">20 % del valor (art. 731)</td></tr>`}
    $("tv-o").innerHTML=`<div class="tbl"><table><tr><th>Plazo</th><th>Hasta</th><th>Hoy</th><th>Fundamento</th></tr>${rows}</table></div><p class="hint">La prescripción se interrumpe con la demanda presentada a tiempo o con el reconocimiento de la deuda por el deudor. Cuenta en días calendario; si el último día no es hábil, consulta la regla procesal aplicable.</p>`};
  ["tv-k","tv-l"].forEach(id=>$(id).onchange=run);f.oninput=run;$("tv-v").oninput=run;run()};
})();
