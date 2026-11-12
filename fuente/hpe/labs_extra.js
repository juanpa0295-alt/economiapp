
// ===================== TALLER: POSTULADOS DE TODAS LAS ESCUELAS =====================
SIMS.postulados=function(){
  const E=Object.entries(POSTULADOS),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  $("sim").innerHTML=`<div style="margin-bottom:10px">${seg("po-m","Modo",[["ver","Ver por escuela"],["cmp","Comparar dos escuelas"],["quiz","¿De qué escuela es?"]],"ver")}</div><div id="po-o"></div>`;
  const sel=(id,v)=>`<select id="${id}" style="font:inherit;padding:6px 10px;border-radius:8px;max-width:100%">${E.map(([k,P])=>`<option value="${k}"${k===v?" selected":""}>${esc(P.esc)}</option>`).join("")}</select>`;
  const lista=k=>{const P=POSTULADOS[k];return`<h4 style="margin:8px 0 2px">${esc(P.esc)}</h4><p class="hint" style="margin:0 0 8px">${esc(P.obra)}</p><ol style="padding-left:1.3em;margin:0">${P.p.map(([n,d])=>`<li style="margin-bottom:6px"><b>${esc(n)}.</b> ${esc(d)}</li>`).join("")}</ol>${P.h?`<p class="hint" style="margin:8px 0 4px">Además (no son postulados):</p><ul style="padding-left:1.3em;margin:0">${P.h.map(([n,d])=>`<li style="margin-bottom:6px"><b>${esc(n)}.</b> ${esc(d)}</li>`).join("")}</ul>`:""}`};
  let score=0,tot=0,cur=null;
  const M={
    ver(){$("po-o").innerHTML=`<label>Escuela: ${sel("po-a","smith")}</label><div id="po-l"></div>`;const r=()=>$("po-l").innerHTML=lista($("po-a").value);$("po-a").onchange=r;r()},
    cmp(){$("po-o").innerHTML=`<div class="calcf"><label>Escuela A ${sel("po-a","pigou")}</label><label>Escuela B ${sel("po-b","keynes")}</label></div><div class="grid2" id="po-l"></div><p class="hint">Para la tabla de tres diferencias del parcial: elige un criterio (qué es la riqueza o el valor, cómo se determina el empleo, papel del Estado, del dinero o de la competencia) y compara el postulado de cada escuela sobre ese criterio, no frases sueltas.</p>`;
      const r=()=>$("po-l").innerHTML=`<div>${lista($("po-a").value)}</div><div>${lista($("po-b").value)}</div>`;$("po-a").onchange=r;$("po-b").onchange=r;r()},
    quiz(){score=0;tot=0;$("po-o").innerHTML=`<div class="res" id="po-s"></div><div id="po-q"></div>`;nueva()}};
  const nueva=()=>{const all=E.flatMap(([k,P])=>P.p.map(p=>({k,n:p[0],d:p[1]})));let q;do{q=all[Math.floor(Math.random()*all.length)]}while(cur&&q.n===cur.n);cur=q;
    const otras=E.map(e=>e[0]).filter(k=>k!==q.k).sort(()=>Math.random()-.5).slice(0,3),ops=[q.k,...otras].sort(()=>Math.random()-.5);
    $("po-s").innerHTML=tiles([["Aciertos",`${score} de ${tot}`]]);
    $("po-q").innerHTML=`<p style="font-size:1.05em"><b>«${esc(q.n.replace(/^([A-D]|Postulado \d) · /,""))}»</b><br>${esc(q.d)}</p><div class="chips" id="po-c">${ops.map(k=>`<button type="button" data-k="${k}">${esc(POSTULADOS[k].esc)}</button>`).join("")}</div><div id="po-f"></div>`;
    $("po-c").onclick=e=>{const b=e.target.closest("button");if(!b||$("po-c").dataset.done)return;$("po-c").dataset.done=1;tot++;const ok=b.dataset.k===q.k;if(ok)score++;
      $("po-c").querySelectorAll("button").forEach(x=>{if(x.dataset.k===q.k)x.setAttribute("aria-pressed","true")});
      $("po-s").innerHTML=tiles([["Aciertos",`${score} de ${tot}`,ok?"okt":"badt"]]);
      $("po-f").innerHTML=`<p>${ok?"<b>¡Correcto!</b>":`<b>No.</b> Es de ${esc(POSTULADOS[q.k].esc)}.`} <span class="hint">${esc(POSTULADOS[q.k].obra)}</span></p><button type="button" class="btn" id="po-n">Siguiente</button>`;$("po-n").onclick=nueva}};
  bindSeg("po-m",k=>M[k]());M.ver()};
