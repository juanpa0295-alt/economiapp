
// ===================== TALLER: LO ESENCIAL DE CADA ESCUELA (según Tobón) =====================
SIMS.postulados=function(){
  const E=Object.entries(POSTULADOS),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  $("sim").innerHTML=`<div style="margin-bottom:10px">${seg("po-m","Modo",[["ver","Ver por escuela"],["cmp","Comparar dos escuelas"],["quiz","¿De qué escuela es?"]],"ver")}</div><div id="po-o"></div>`;
  const sel=(id,v)=>`<select id="${id}" style="font:inherit;padding:6px 10px;border-radius:8px;max-width:100%">${E.map(([k,P])=>`<option value="${k}"${k===v?" selected":""}>${esc(P.esc)}</option>`).join("")}</select>`;
  const lista=k=>{const P=POSTULADOS[k];let h=`<h4 style="margin:8px 0 2px">${esc(P.esc)}</h4><p class="hint" style="margin:0 0 6px"><b>${esc(P.tipo)}</b> · ${esc(P.obra)}</p>`,open=false;
    P.p.forEach(([n,d])=>{if(n==="§"){if(open)h+="</ol>";h+=`<p style="margin:10px 0 4px;font-weight:600">${esc(d)}</p><ol style="padding-left:1.3em;margin:0">`;open=true}else{if(!open){h+=`<ol style="padding-left:1.3em;margin:0">`;open=true}h+=`<li style="margin-bottom:6px"><b>${esc(n)}.</b> ${esc(d)}</li>`}});
    return h+(open?"</ol>":"")+`<p class="hint" style="margin-top:8px">${esc(P.nota)}</p>`};
  let score=0,tot=0,cur=null;
  const M={
    ver(){$("po-o").innerHTML=`<label>Escuela: ${sel("po-a","walras")}</label><div id="po-l"></div>`;const r=()=>$("po-l").innerHTML=lista($("po-a").value);$("po-a").onchange=r;r()},
    cmp(){$("po-o").innerHTML=`<div class="calcf"><label>Escuela A ${sel("po-a","pigou")}</label><label>Escuela B ${sel("po-b","keynes")}</label></div><div class="grid2" id="po-l"></div><p class="hint">Para la tabla de tres diferencias del parcial: elige un criterio (qué es la riqueza o el valor, cómo se forman los precios, cómo se determina el empleo, papel del dinero o del Estado) y compara lo que dice cada escuela sobre ese criterio.</p>`;
      const r=()=>$("po-l").innerHTML=`<div>${lista($("po-a").value)}</div><div>${lista($("po-b").value)}</div>`;$("po-a").onchange=r;$("po-b").onchange=r;r()},
    quiz(){score=0;tot=0;$("po-o").innerHTML=`<div class="res" id="po-s"></div><div id="po-q"></div>`;nueva()}};
  const nueva=()=>{const all=E.flatMap(([k,P])=>P.p.filter(p=>p[0]!=="§").map(p=>({k,n:p[0],d:p[1]})));let q;do{q=all[Math.floor(Math.random()*all.length)]}while(cur&&q.n===cur.n);cur=q;
    const otras=E.map(e=>e[0]).filter(k=>k!==q.k).sort(()=>Math.random()-.5).slice(0,3),ops=[q.k,...otras].sort(()=>Math.random()-.5);
    $("po-s").innerHTML=tiles([["Aciertos",`${score} de ${tot}`]]);
    $("po-q").innerHTML=`<p style="font-size:1.05em"><b>«${esc(q.n.replace(/^([A-D]|[1-7]) · /,""))}»</b><br>${esc(q.d)}</p><div class="chips" id="po-c">${ops.map(k=>`<button type="button" data-k="${k}">${esc(POSTULADOS[k].esc)}</button>`).join("")}</div><div id="po-f"></div>`;
    $("po-c").onclick=e=>{const b=e.target.closest("button");if(!b||$("po-c").dataset.done)return;$("po-c").dataset.done=1;tot++;const ok=b.dataset.k===q.k;if(ok)score++;
      $("po-c").querySelectorAll("button").forEach(x=>{if(x.dataset.k===q.k)x.setAttribute("aria-pressed","true")});
      $("po-s").innerHTML=tiles([["Aciertos",`${score} de ${tot}`,ok?"okt":"badt"]]);
      $("po-f").innerHTML=`<p>${ok?"<b>¡Correcto!</b>":`<b>No.</b> Es de ${esc(POSTULADOS[q.k].esc)}.`} <span class="hint">${esc(POSTULADOS[q.k].tipo)} · ${esc(POSTULADOS[q.k].obra)}</span></p><button type="button" class="btn" id="po-n">Siguiente</button>`;$("po-n").onclick=nueva}};
  bindSeg("po-m",k=>M[k]());M.ver()};
