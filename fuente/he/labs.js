
// ===================== LABORATORIOS DE HISTORIA ECONÓMICA =====================
// PIB per cápita en dólares internacionales de 1990 (Geary-Khamis). Maddison (2001), The World Economy: a Millennial Perspective, cuadro B-21.
const MY=[1,1000,1500,1600,1700,1820,1870,1913,1950,1973,1998];
const MD={
 "Mundo":[445,436,566,596,615,667,873,1525,2111,4091,5709],
 "Europa occidental":[450,400,774,894,1024,1232,1974,3473,4594,11534,17921],
 "Reino Unido":[null,null,714,974,1250,1706,3191,4921,6939,12025,18714],
 "Estados Unidos":[null,null,400,400,527,1257,2445,5301,9561,16689,27331],
 "Japón":[400,425,500,520,570,669,737,1387,1921,11439,20413],
 "China":[450,450,600,600,600,600,530,552,439,839,3117],
 "India":[450,450,550,550,550,533,533,673,619,853,1746],
 "América Latina":[400,400,416,438,527,692,681,1481,2506,4531,5795],
 "África":[430,425,400,400,400,420,500,637,894,1410,1368],
 "Antigua URSS":[null,null,500,553,611,688,943,1488,2841,6059,3893]};
const MCOL={"Mundo":"--ink","Europa occidental":"--line","Reino Unido":"--exam","Estados Unidos":"--good","Japón":"--bad","China":"--muted","India":"--line","América Latina":"--exam","África":"--good","Antigua URSS":"--bad"};
const MDASH={"India":"6 4","América Latina":"6 4","África":"6 4","Antigua URSS":"6 4","China":"2 3"};
const yrs=h=>h.replace(/(text-anchor="middle"[^>]*>)(\d)\.(\d{3})</g,"$1$2$3<");
const tasa=(a,b,n)=>Math.pow(b/a,1/n)-1;
const pct=(v,d=2)=>fmt(v*100,d).replace(/^-/,"−")+" %";

SIMS.madd=function(){
  const def={"tendencias":["Mundo","Europa occidental","China","América Latina","África"],"eeuu":["Reino Unido","Estados Unidos","Europa occidental","Mundo"],"regiones":["Europa occidental","Estados Unidos","Japón","China","India","América Latina","África"]};
  const id=decodeURIComponent(location.hash.slice(1));let sel=new Set(def[id]||def.tendencias),modo="niv";
  $("sim").innerHTML=`<p class="hint">PIB per cápita en dólares internacionales de 1990, según Maddison (2001). Las cifras anteriores a 1820 son estimaciones gruesas.</p>
  <div class="chips pre" id="md-r"><span class="lbl">Regiones</span>${Object.keys(MD).map(k=>`<button type="button" data-k="${k}">${k}</button>`).join("")}</div>
  <div style="margin:8px 0">${seg("md-m","Ver",[["niv","Nivel"],["rel","Relativo al mundo"]],"niv")}</div>
  <div class="calcf"><label for="md-a">Desde<select id="md-a">${MY.map(y=>`<option${y===1500?" selected":""}>${y}</option>`).join("")}</select></label><label for="md-b">Hasta<select id="md-b">${MY.map(y=>`<option${y===1998?" selected":""}>${y}</option>`).join("")}</select></label></div>
  <div id="md-g"></div><div id="md-o"></div>`;
  const run=()=>{document.querySelectorAll("#md-r button").forEach(b=>b.setAttribute("aria-pressed",sel.has(b.dataset.k)));
    const a=+$("md-a").value,b=+$("md-b").value;if(b<=a){$("md-o").innerHTML=err("el año final debe ser posterior al inicial.");return}
    const ia=MY.indexOf(a),ib=MY.indexOf(b),ks=[...sel],val=(k,i)=>{const v=MD[k][i];return v==null?null:modo==="rel"?v/MD["Mundo"][i]:v};
    const ys=ks.flatMap(k=>MY.slice(ia,ib+1).map((_,j)=>val(k,ia+j))).filter(v=>v!=null);if(!ks.length){$("md-g").innerHTML="";$("md-o").innerHTML=`<p class="hint">Elige al menos una región.</p>`;return}
    $("md-g").innerHTML=yrs(plotXY({xr:[a,b],yr:[0,Math.max(...ys)*1.08],series:ks.map(k=>({pts:MY.slice(ia,ib+1).map((y,j)=>[y,val(k,ia+j)]).filter(p=>p[1]!=null),col:MCOL[k],dash:MDASH[k],w:2.4,dots:true})),hlines:modo==="rel"?[{y:1,col:"--muted"}]:[],xl:"año",yl:modo==="rel"?"veces el promedio mundial":"dólares de 1990",label:"PIB per cápita de largo plazo"}))+legend(ks.map(k=>[MCOL[k],k,!!MDASH[k]]));
    const rows=ks.map(k=>{const x=MD[k][ia],y=MD[k][ib];return[k,x,y,x&&y?tasa(x,y,b-a):null]});const ok=rows.filter(r=>r[3]!=null),mx=ok.length?ok.reduce((p,c)=>c[2]>p[2]?c:p):null,mn=ok.length?ok.reduce((p,c)=>c[2]<p[2]?c:p):null;
    $("md-o").innerHTML=stp(1,`Crecimiento anual compuesto entre ${a} y ${b}`,`<div class="tbl"><table><tr><th>Región</th><th>${a}</th><th>${b}</th><th>Veces</th><th>Tasa anual</th><th>Años para duplicar</th></tr>${rows.map(([k,x,y,g])=>`<tr><td>${k}</td><td>${x??"—"}</td><td>${y??"—"}</td><td>${x&&y?fmt(y/x,2):"—"}</td><td>${g!=null?pct(g):"—"}</td><td>${g>0?fmt(Math.log(2)/Math.log(1+g),0):"—"}</td></tr>`).join("")}</table></div><p class="hint">Tasa = (valor final / valor inicial)^(1/${b-a}) − 1.</p>`)
      +(mx&&mn&&mx!==mn?stp(2,"Brecha",`<p>En ${a} la relación entre ${mx[0]} y ${mn[0]} era ${fmt(mx[1]/mn[1],2)} a 1; en ${b} es ${fmt(mx[2]/mn[2],2)} a 1. ${mx[2]/mn[2]>mx[1]/mn[1]?"La brecha se amplió: divergencia.":"La brecha se cerró: convergencia."}</p>`):"")};
  $("md-r").addEventListener("click",e=>{const b=e.target.closest("button[data-k]");if(!b)return;const k=b.dataset.k;sel.has(k)?sel.delete(k):sel.add(k);run()});
  bindSeg("md-m",v=>{modo=v;run()});$("md-a").onchange=run;$("md-b").onchange=run;run()};

SIMS.crec=function(){
  $("sim").innerHTML=tabsBox("cr",[["tasa","Tasa entre dos datos"],["proy","Proyectar con una tasa"],["div","Divergencia"]]);const B=$("cr-b");
  tabsRun("cr",{
   tasa(){B.innerHTML=`<div class="calcf">${nin("ct-a","Valor inicial",714)}${nin("ct-b","Valor final",1706)}${nin("ct-n","Años transcurridos",320)}</div><div class="res" id="ct-res"></div><div id="ct-o"></div>`;
    const run=()=>{const[a,b,n]=["ct-a","ct-b","ct-n"].map(N);if(!(a>0&&b>0&&n>0)){$("ct-res").innerHTML=err("valores y años positivos.");return}const g=tasa(a,b,n);
      $("ct-res").innerHTML=tiles([["Tasa anual compuesta",pct(g,3),"okt"],["Veces que se multiplicó",fmt(b/a,3)],["Años para duplicar",g>0?fmt(Math.log(2)/Math.log(1+g),1):"—"],["Regla del 70",g>0?fmt(70/(g*100),1):"—"]]);
      $("ct-o").innerHTML=stp(1,"Cálculo",`<div class="eq al">g = (${fm(b)}/${fm(a)})^(1/${fm(n)}) − 1 = ${fmt(b/a,4)}^(${fmt(1/n,5)}) − 1 = <b>${pct(g,3)}</b></div><p class="hint">Ejemplo precargado: Reino Unido entre 1500 (714) y 1820 (1.706). Ni siquiera el país que encabezó la industrialización llegó al 0,3 % anual en la era preindustrial.</p>`)};
    onIn(["ct-a","ct-b","ct-n"],run);run()},
   proy(){B.innerHTML=`${ctl("cp-g","Tasa anual (%)",0,8,0.1,2)}${ctl("cp-n","Años",10,200,5,100)}${nin("cp-a","Valor inicial",1000)}<div class="res" id="cp-res"></div><div id="cp-g2"></div>`;
    const run=()=>{const g=V("cp-g")/100,n=V("cp-n"),a=N("cp-a");if(!(a>0))return;const f=t=>a*Math.pow(1+g,t);
      $("cp-res").innerHTML=tiles([["Valor final",fmt(f(n),0),"okt"],["Veces",fmt(f(n)/a,2)],["Años para duplicar",g>0?fmt(Math.log(2)/Math.log(1+g),1):"—"]]);
      $("cp-g2").innerHTML=plotXY({xr:[0,n],yr:[0,f(n)*1.08],series:[{f,col:"--line"},{f:t=>a*Math.pow(1.01,t),col:"--muted",dash:"5 4",w:1.6}],xl:"años",yl:"valor",label:"Crecimiento compuesto"})+legend([["--line",`${fmt(g*100,1)} % anual`],["--muted","1 % anual",1]])};
    bindCtl(["cp-g","cp-n"],run);onIn(["cp-a"],run);run()},
   div(){B.innerHTML=`<p class="hint">Dos países parten del mismo ingreso y crecen a tasas distintas: así se forman las brechas de la gran divergencia.</p>${ctl("cd-1","Tasa del país A (%)",0,4,0.1,1.5)}${ctl("cd-2","Tasa del país B (%)",0,4,0.1,0.5)}${ctl("cd-n","Años",20,300,10,180)}<div class="res" id="cd-res"></div>`;
    const run=()=>{const a=V("cd-1")/100,b=V("cd-2")/100,n=V("cd-n"),r=Math.pow((1+a)/(1+b),n);
      $("cd-res").innerHTML=tiles([["Ingreso A / B al final",fmt(r,2)+" a 1","okt"],["Diferencia de tasas",fmt((a-b)*100,1)+" puntos"]])+`<p class="hint">Entre 1820 y 1998, Europa occidental creció cerca de 1,5 % anual y África cerca de 0,7 %: unos 0,8 puntos de diferencia durante 178 años bastan para multiplicar la brecha por más de 4.</p>`};
    bindCtl(["cd-1","cd-2","cd-n"],run);run()}})};
