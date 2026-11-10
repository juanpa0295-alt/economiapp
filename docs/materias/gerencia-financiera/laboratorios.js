// Gerencia Financiera I · laboratorios con fórmulas de Excel
// ===================== LABORATORIOS DE GERENCIA FINANCIERA I =====================
const SIMS={};
const num=(id,label,val,step)=>`<label>${label}<input type="number" id="${id}" value="${val}" step="${step||"any"}" inputmode="decimal"></label>`;
const txt=(id,label,val)=>`<label>${label}<input type="text" id="${id}" value="${val}" spellcheck="false"></label>`;
const vals=ids=>ids.map(id=>parseFloat($(id).value));
const onAll=(root,run)=>{root.querySelectorAll("input,select").forEach(el=>el.addEventListener("input",run))};
const $$=v=>"$"+fmt(v,2),pc4=v=>fmt(v*100,4)+" %",pc2=v=>fmt(v*100,2)+" %";
const xl=s=>`<code class="xlf">${s}</code>`;
const xlnum=v=>String(+v.toFixed(10)).replace(".",",");
const xlpc=v=>xlnum(+(v*100).toFixed(8))+"%";
const vars=rows=>`<h4 class="subh">Variables del ejercicio (para copiar al Word)</h4><div class="tbl"><table><tr><th>Variable (símbolo y nombre)</th><th>Valor</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td class="num">${r[1]}</td></tr>`).join("")}</table></div>`;
// Línea de tiempo: flujos [{t,v}] (v > 0 flecha arriba, v < 0 flecha abajo), N períodos, fecha focal opcional
function timeline(fl,N,focal,unit){const W=600,H=190,L=34,R=42,mid=100,sx=t=>L+(W-L-R)*t/Math.max(N,1);const mx=Math.max(...fl.map(f=>Math.abs(f.v)),1);
  let g=`<line x1="${L}" x2="${W-R}" y1="${mid}" y2="${mid}" stroke="var(--ink)" stroke-width="1.5"/>`;const step=N>24?Math.ceil(N/12):N>12?2:1;
  for(let t=0;t<=N;t++){g+=`<line x1="${sx(t)}" x2="${sx(t)}" y1="${mid-4}" y2="${mid+4}" stroke="var(--ink)"/>`;if(t%step===0||t===N)g+=`<text x="${sx(t)}" y="${mid+18}" font-size="11" text-anchor="middle" fill="var(--muted)" font-family="var(--f-mono)">${t}</text>`}
  if(focal!=null&&focal>=0&&focal<=N)g+=`<line x1="${sx(focal)}" x2="${sx(focal)}" y1="14" y2="${H-24}" stroke="var(--exam)" stroke-dasharray="5 4" stroke-width="2"/><text x="${sx(focal)}" y="${H-8}" font-size="11.5" text-anchor="middle" fill="var(--exam)" font-weight="600">fecha focal</text>`;
  fl.forEach(f=>{if(!isFinite(f.v)||f.v===0||f.t<0||f.t>N)return;const len=18+62*Math.abs(f.v)/mx,up=f.v>0,x=sx(f.t),y2=up?mid-len:mid+len,c=up?"--good":"--bad";
    g+=`<line x1="${x}" x2="${x}" y1="${mid}" y2="${y2}" stroke="var(${c})" stroke-width="2.4"/><path d="M${x-5},${y2+(up?7:-7)}L${x},${y2}L${x+5},${y2+(up?7:-7)}" fill="none" stroke="var(${c})" stroke-width="2.4"/><text x="${x}" y="${up?y2-5:y2+13}" font-size="10.5" text-anchor="middle" fill="var(${c})" font-family="var(--f-mono)">${f.lab!=null?f.lab:fm(Math.round(Math.abs(f.v)))}</text>`});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Flujo de caja gráfico">${g}<text x="${W-R}" y="${mid+34}" font-size="11" text-anchor="end" fill="var(--muted)">${unit||"períodos"}</text></svg></div><p class="hint">Flechas hacia arriba: ingresos (o lo que se debe); hacia abajo: egresos (o pagos).</p>`}
const tabla=(head,rows,foot)=>`<div class="tbl"><table><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map((c,j)=>`<td${j?' class="num"':""}>${c}</td>`).join("")}</tr>`).join("")}${foot?`<tr>${foot.map((c,j)=>`<td${j?' class="num"':""}><b>${c}</b></td>`).join("")}</tr>`:""}</table></div>`;

// ---------- Tabla de capitalización
SIMS.cap=function(){
  $("sim").innerHTML=`${seg("c-mod","Interés",[["comp","Compuesto"],["simp","Simple"]],"comp")}<div class="calcf">${num("c-P","P: valor presente (depósito)",250000000)}${num("c-i","i: tasa por período (%)",2.8)}${num("c-n","n: número de períodos",6,1)}</div><div id="c-out"></div>`;
  let simple=false;
  const run=()=>{const[P,ip,n]=vals(["c-P","c-i","c-n"]),i=ip/100;if(!(P>0&&i>=0&&n>=1&&n<=120&&Number.isInteger(n))){$("c-out").innerHTML=err("P positivo, tasa no negativa y n entero entre 1 y 120.");return}
    const T=GF.tabla(P,i,n,simple),F=T[T.length-1].fin,I=F-P;
    $("c-out").innerHTML=timeline([{t:0,v:-P},{t:n,v:F}],n,null,"períodos")
      +vars([["P: valor presente",$$(P)],["i: tasa efectiva por período",pc4(i)],["n: número de períodos",n],[simple?"I: intereses simples":"F: valor futuro",simple?$$(I):$$(F)]])
      +`<div class="res">${tiles([["Capital final F",$$(F)],["Total de intereses",$$(I)],["Crecimiento",pc2(F/P-1)]])}</div>`
      +tabla(["Período","Capital inicial","Tasa","Intereses","Capital final"],T.slice(0,24).map(r=>[r.k,$$(r.ini),pc2(i),$$(r.it),$$(r.fin)]),["Total","","",$$(I),""])
      +(n>24?`<p class="hint">Se muestran los primeros 24 períodos.</p>`:"")
      +stp(1,"Fórmulas en Excel (variables en B3 = P, B4 = i, B5 = n; tabla desde la fila 13)",
        `<div class="tbl"><table><tr><th>Celda</th><th>Fila 13</th><th>Fila 14 (arrastrar)</th></tr><tr><td>A Período</td><td>${xl("1")}</td><td>${xl("=A13+1")}</td></tr><tr><td>B Capital inicial</td><td>${xl("=$B$3")}</td><td>${xl(simple?"=$B$3":"=E13")}</td></tr><tr><td>C Tasa</td><td>${xl("=$B$4")}</td><td>arrastrar</td></tr><tr><td>D Intereses</td><td>${xl(simple?"=$B$3*C13":"=B13*C13")}</td><td>arrastrar</td></tr><tr><td>E Capital final</td><td>${xl(simple?"=$B$3+D13*A13":"=B13+D13")}</td><td>arrastrar</td></tr></table></div>
        <div class="eq al chain">${simple?`F = P(1 + i·n) = ${$$(P)}·(1 + ${fm(i)}·${n}) = <b>${$$(F)}</b>`:`F = P(1 + i)<sup>n</sup> = ${$$(P)}·(1 + ${fmt(i,4)})<sup>${n}</sup> = <b>${$$(F)}</b>`}</div>
        <p>${simple?`Valor final: ${xl("=B3*(1+B4*B5)")}.`:`Valor final con función financiera: ${xl("=VF(B4;B5;0;-B3)")}. Total de intereses: ${xl("=SUMA(D13:D"+(12+n)+")")} o ${xl("=B8-B3")}.`}</p>`)
      +`<p><b>Interpretación:</b> ${simple?"con interés simple los intereses son iguales cada período porque se calculan sobre el capital inicial.":`los intereses crecen cada período porque se calculan sobre el capital acumulado: los intereses ganan intereses. La inversión crece ${pc2(F/P-1)} en ${n} períodos.`}</p>`};
  bindSeg("c-mod",v=>{simple=v==="simp";run()});onAll($("sim"),run);run()};

// ---------- Ecuación de valor
const EQ_PRE={c1:{fl:"6:1000000; 12:1500000; 18:2500000; 24:2500000",f:0,i1:2,k:0,i2:2.5,x:""},c1b:{fl:"6:1000000; 12:1500000; 18:2500000; 24:2500000",f:6,i1:2,k:12,i2:2.5,x:""},
  c2:{fl:"0:1200000; 2:-400000; 6:-500000; 10:-100000",f:12,i1:3,k:0,i2:3,x:""},dos:{fl:"3:25000; 7:40000",f:12,i1:3,k:0,i2:3,x:"5,12"},
  maq:{fl:"6:60000; 8:80000; 12:100000",f:0,i1:2.5,k:6,i2:2.9142,x:""},pag:{fl:"4:1000000; 12:2500000; 15:3000000",f:10,i1:2,k:0,i2:2,x:""}};
SIMS.eqv=function(){
  $("sim").innerHTML=`<div class="chips pre" id="e-pre">${[["c1","Caso 1a (hoy)"],["c1b","Caso 1d (mes 6, cambio de tasa)"],["c2","Caso 2 (saldo en el mes 12)"],["dos","Dos pagos iguales X"],["maq","Máquina con dos tasas"],["pag","Reemplazar pagarés"]].map(([k,t])=>`<button type="button" data-k="${k}">${t}</button>`).join("")}</div>
  <p class="hint">Escribe los flujos como <b>período:valor</b> separados por punto y coma. Positivo lo que se debe o se deposita; negativo lo que se paga o se retira.</p>
  <div class="calcf">${txt("e-fl","Flujos (período:valor)",EQ_PRE.c1.fl)}${num("e-f","Fecha focal",0,1)}${num("e-i1","i₁: tasa por período (%)",2)}${num("e-k","La tasa cambia desde el período (0 = no cambia)",0,1)}${num("e-i2","i₂: tasa nueva (%)",2.5)}${txt("e-x","Pagos iguales X en los períodos (opcional, ej. 5,12)","")}</div><div id="e-out"></div>`;
  const set=k=>{const p=EQ_PRE[k];$("e-fl").value=p.fl;$("e-f").value=p.f;$("e-i1").value=p.i1;$("e-k").value=p.k;$("e-i2").value=p.i2;$("e-x").value=p.x;run()};
  const run=()=>{const raw=$("e-fl").value.split(/[;\n]+/).map(s=>s.trim()).filter(Boolean),fl=[];let bad=false;
    raw.forEach(s=>{const m=s.split(":");const t=parseInt(m[0],10),v=parseFloat((m[1]||"").replace(/\./g,"").replace(",","."));if(m.length!==2||!Number.isInteger(t)||t<0||t>600||!isFinite(v))bad=true;else fl.push({t,v})});
    const[f,i1p,k,i2p]=vals(["e-f","e-i1","e-k","e-i2"]),xs=$("e-x").value.split(/[,; ]+/).filter(Boolean).map(Number);
    if(bad||!fl.length){$("e-out").innerHTML=err("Escribe los flujos como 6:1000000; 12:1500000 (períodos enteros, valores sin símbolo $).");return}
    if(!(Number.isInteger(f)&&f>=0&&f<=600&&i1p>-100&&i2p>-100&&k>=0&&Number.isInteger(k))||xs.some(x=>!Number.isInteger(x)||x<0||x>600)){$("e-out").innerHTML=err("Fecha focal y períodos enteros no negativos; tasas mayores que −100 %.");return}
    const i1=i1p/100,i2=i2p/100,rate=s=>k>0&&s>k?i2:i1,N=Math.max(f,...fl.map(x=>x.t),...xs,1);
    const fac=t=>GF.factor(rate,f)/GF.factor(rate,t),rows=fl.map(x=>({...x,fa:fac(x.t),vf:x.v*fac(x.t)})),sum=rows.reduce((s,r)=>s+r.vf,0);
    const facTxt=t=>{if(k>0&&Math.max(t,f)>k&&Math.min(t,f)<k){const a=Math.min(t,f),b=Math.max(t,f),e1=k-a,e2=b-k,s=f>=t?"":"−";return`(1+${fm(i1)})<sup>${s}${e1}</sup>(1+${fm(i2)})<sup>${s}${e2}</sup>`}const r=k>0&&Math.min(t,f)>=k?i2:i1;return`(1+${fm(r)})<sup>${f-t}</sup>`};
    let res="",X=null;
    if(xs.length){const fx=xs.reduce((s,t)=>s+fac(t),0);X=sum/fx;res=`<div class="eq al chain">${rows.map(r=>`${fm(r.v)}·${facTxt(r.t)}`).join(" + ")} = X·[${xs.map(t=>facTxt(t)).join(" + ")}]<br>${$$(sum)} = X·${fmt(fx,6)} ⇒ <b>X = ${$$(X)}</b></div>`}
    $("e-out").innerHTML=timeline([...fl.map(x=>({t:x.t,v:x.v})),...xs.map(t=>({t,v:-(X||Math.max(...fl.map(z=>Math.abs(z.v)))/2),lab:"X"}))],N,f,"períodos")
      +stp(1,`Cada flujo llevado a la fecha focal (período ${f})`,tabla(["Período","Valor","Factor","Exponente","Valor en la fecha focal"],rows.map(r=>[r.t,$$(r.v),fmt(r.fa,6),facTxt(r.t),$$(r.vf)]),["Suma","","","",$$(sum)])+(k>0?`<p class="hint">La tasa es ${pc2(i1)} hasta el período ${k} y ${pc2(i2)} después: los valores se mueven por tramos.</p>`:""))
      +(xs.length?stp(2,"Pagos iguales X",res+`<p>Cada pago X llevado a la fecha focal suma ${fmt(xs.reduce((s,t)=>s+fac(t),0),6)} veces X. En Excel deja X en una celda y usa Buscar objetivo, o despeja como arriba.</p>`)
        :stp(2,"Resultado",`<div class="res">${tiles([[`Valor equivalente en el período ${f}`,$$(sum)]])}</div><p>${sum>0?`Es el pago único en el período ${f} que reemplaza (cancela) todos los flujos.`:`El valor es negativo: lo pagado supera a lo debido en esa fecha (hay un saldo a favor).`}</p>`))
      +stp(3,"En Excel",`<p>Por cada flujo: ${k>0?xl("=B2*(1+$i1$)^(exp1)*(1+$i2$)^(exp2)"):xl("=B2*(1+$B$1)^(f−t)")}, o ${xl("=VA(i;t−f;0;-B2)")} para traer y ${xl("=VF(i;f−t;0;-B2)")} para llevar. Luego ${xl("=SUMA(...)")}.</p>`)};
  $("e-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(b)set(b.dataset.k)});
  onAll($("sim"),run);run()};

// ---------- n e i
SIMS.nyi=function(){
  $("sim").innerHTML=`${seg("n-mod","Incógnita",[["n","Tiempo n"],["i","Tasa i"]],"n")}<div class="calcf">${num("n-P","P: valor presente",180000000)}${num("n-F","F: valor futuro",276197140)}<span id="n-in">${num("n-i","i: tasa por período (%)",1.8)}</span><span id="i-in" hidden>${num("n-n","n: períodos",30)}</span></div><div id="n-out"></div>`;
  let md="n";
  const run=()=>{const[P,F,ip,n]=vals(["n-P","n-F","n-i","n-n"]);if(!(P>0&&F>0)){$("n-out").innerHTML=err("P y F deben ser positivos.");return}
    if(md==="n"){const i=ip/100;if(!(i>0)){$("n-out").innerHTML=err("La tasa debe ser positiva.");return}const r=GF.n(P,F,i);
      $("n-out").innerHTML=timeline([{t:0,v:-P},{t:Math.max(1,Math.round(r)),v:F}],Math.max(1,Math.round(r)),null,"períodos")+vars([["P: valor presente",$$(P)],["F: valor futuro",$$(F)],["i: tasa efectiva por período",pc4(i)],["n: períodos (incógnita)",fmt(r,4)]])
        +`<div class="res">${tiles([["n",fmt(r,4)+" períodos"],["Rentabilidad total F/P − 1",pc2(F/P-1)]])}</div>`
        +`<div class="eq al chain">n = ${fr("ln(F/P)","ln(1 + i)")} = ${fr("ln("+fmt(F/P,6)+")","ln("+fmt(1+i,6)+")")} = ${fr(fmt(Math.log(F/P),6),fmt(Math.log(1+i),6))} = <b>${fmt(r,4)}</b></div>
        <p>Función financiera: ${xl(`=NPER(${xlpc(i)};0;-${xlnum(P)};${xlnum(F)})`)}. Demostración con logaritmos: ${xl(`=LN(${xlnum(F)}/${xlnum(P)})/LN(1+${xlpc(i)})`)}. Rentabilidad total: ${xl(`=${xlnum(F)}/${xlnum(P)}-1`)}.</p><p><b>Interpretación:</b> el dinero debe quedar invertido ${fmt(r,2)} períodos (en la unidad de la tasa) para pasar de ${$$(P)} a ${$$(F)}.</p>`}
    else{if(!(n>0)){$("n-out").innerHTML=err("n debe ser positivo.");return}const r=GF.i(P,F,n);
      $("n-out").innerHTML=timeline([{t:0,v:-P},{t:Math.round(n),v:F}],Math.max(1,Math.round(n)),null,"períodos")+vars([["P: valor presente",$$(P)],["F: valor futuro",$$(F)],["n: períodos",fm(n)],["i: tasa por período (incógnita)",pc4(r)]])
        +`<div class="res">${tiles([["i por período",pc4(r)]])}</div><div class="eq al chain">i = (F/P)<sup>1/n</sup> − 1 = (${fmt(F/P,6)})<sup>1/${fm(n)}</sup> − 1 = <b>${pc4(r)}</b></div><p>Función financiera: ${xl(`=TASA(${xlnum(n)};0;-${xlnum(P)};${xlnum(F)})`)}.</p>`}};
  bindSeg("n-mod",v=>{md=v;$("n-in").hidden=v!=="n";$("i-in").hidden=v!=="i";if(v==="i"){$("n-P").value=1;$("n-F").value=3}else{$("n-P").value=180000000;$("n-F").value=276197140}run()});
  onAll($("sim"),run);run()};

// ---------- Conversión de tasas
const PER=[[12,"mensual","M"],[6,"bimestral","B"],[4,"trimestral","T"],[3,"cuatrimestral","C"],[2,"semestral","S"],[1,"anual","A"]];
const perName=m=>(PER.find(p=>p[0]===m)||[0,m+" veces al año"])[1],perL=m=>(PER.find(p=>p[0]===m)||[0,"?","?"])[2];
const tasaName=t=>t.nom?`${pc4(t.v)} N.A.${perL(t.m)}.${t.ant?"A":"V"}.`:`${pc4(t.v)} efectiva ${perName(t.m)} ${t.ant?"anticipada":"vencida"}`;
SIMS.tasas=function(){
  const sel=(id,lab,opts,v)=>`<label>${lab}<select id="${id}">${opts.map(([a,b])=>`<option value="${a}" ${String(a)===String(v)?"selected":""}>${b}</option>`).join("")}</select></label>`;
  const tipo=[["nom","Nominal anual (j)"],["efe","Efectiva del período"]],mod=[["v","Vencida"],["a","Anticipada"]],pers=PER.map(p=>[p[0],p[1]]);
  $("sim").innerHTML=`<div class="chips pre" id="t-pre"><button type="button" data-k="a">36 % NASA → NAMA</button><button type="button" data-k="b">30 % N.A.M.V. → E.A.</button><button type="button" data-k="c">24 % N.A.T.A. → E.A.</button><button type="button" data-k="d">38 % N.T.V. → N.M.A.</button></div>
  <h4 class="subh">Tasa conocida</h4><div class="calcf">${num("t-v","Valor (%)",36)}${sel("t-tipo","Tipo",tipo,"nom")}${sel("t-mod","Modalidad",mod,"a")}${sel("t-m","Período de capitalización",pers,2)}</div>
  <h4 class="subh">Tasa que piden</h4><div class="calcf">${sel("d-tipo","Tipo",tipo,"nom")}${sel("d-mod","Modalidad",mod,"a")}${sel("d-m","Período",pers,12)}</div><div id="t-out"></div>`;
  const PRE={a:[36,"nom","a",2,"nom","a",12],b:[30,"nom","v",12,"efe","v",1],c:[24,"nom","a",4,"efe","v",1],d:[38,"nom","v",4,"nom","a",12]};
  const run=()=>{const o={v:V("t-v")/100,nom:$("t-tipo").value==="nom",ant:$("t-mod").value==="a",m:+$("t-m").value},d={nom:$("d-tipo").value==="nom",ant:$("d-mod").value==="a",m:+$("d-m").value};
    if(!(o.v>0&&o.v<10)){$("t-out").innerHTML=err("Escribe una tasa positiva en porcentaje.");return}
    const ipo=o.nom?o.v/o.m:o.v;if(o.ant&&ipo>=1){$("t-out").innerHTML=err("Una tasa anticipada del período debe ser menor que 100 %.");return}
    const C=GF.convertir(o,d),ipv=C.ip,ipn=Math.pow(1+ipv,o.m/d.m)-1,ipa=ipn/(1+ipn);let k=0;const S=[];
    if(o.nom)S.push([`Dividir por las capitalizaciones (${o.m})`,`${pc4(o.v)} ÷ ${o.m} = ${pc4(ipo)} ${perName(o.m)} ${o.ant?"anticipada":"vencida"}`,`=${xlpc(o.v)}/${o.m}`]);
    if(o.ant)S.push(["Pasar a vencida: iv = ia/(1 − ia)",`${pc4(ipo)}/(1 − ${pc4(ipo)}) = ${pc4(ipv)} ${perName(o.m)} vencida`,`=B2/(1-B2)`]);
    if(o.m!==d.m)S.push([`Cambiar al período ${perName(d.m)}: (1 + i)^(${o.m}/${d.m}) − 1`,`(1 + ${pc4(ipv)})<sup>${fm(o.m/d.m)}</sup> − 1 = ${pc4(ipn)} ${perName(d.m)} vencida`,`=(1+B3)^(${o.m}/${d.m})-1`]);
    if(d.ant)S.push(["Pasar a anticipada: ia = iv/(1 + iv)",`${pc4(ipn)}/(1 + ${pc4(ipn)}) = ${pc4(ipa)} ${perName(d.m)} anticipada`,`=B4/(1+B4)`]);
    if(d.nom)S.push([`Multiplicar por las capitalizaciones (${d.m})`,`${pc4(d.ant?ipa:ipn)} × ${d.m} = ${pc4(C.res)}`,`=B5*${d.m}`]);
    if(!S.length)S.push(["Es la misma tasa",pc4(C.res),"—"]);
    const eq=PER.map(([m])=>{const e=Math.pow(1+ipv,o.m/m)-1;return[perName(m),pc4(e),pc4(e/(1+e)),pc4(e*m),pc4(e/(1+e)*m)]});
    $("t-out").innerHTML=`<div class="res">${tiles([["Tasa conocida",tasaName(o)],["Tasa pedida",tasaName({...d,v:C.res})],["Efectiva anual",pc4(C.ea)]])}</div>`
      +stp(1,"Paso a paso",`<div class="tbl"><table><tr><th>#</th><th>Paso</th><th>Cálculo</th><th>Excel</th></tr>${S.map((s,j)=>`<tr><td>${j+1}</td><td>${s[0]}</td><td>${s[1]}</td><td>${xl(s[2])}</td></tr>`).join("")}</table></div>
        ${!o.ant&&o.nom?`<p>Con funciones: efectiva anual ${xl(`=INT.EFECTIVO(${xlpc(o.v)};${o.m})`)}.</p>`:""}${!d.ant&&d.nom?`<p>Nominal pedida desde la efectiva anual: ${xl(`=TASA.NOMINAL(${xlpc(C.ea)};${d.m})`)}.</p>`:""}
        <p class="hint">Recuerda: el cambio de período solo se hace con tasas vencidas, e INT.EFECTIVO y TASA.NOMINAL solo funcionan con vencidas.</p>`)
      +stp(2,"Todas las equivalentes",tabla(["Período","Efectiva vencida","Efectiva anticipada","Nominal vencida","Nominal anticipada"],eq))
      +`<p><b>Comprobación con $100 millones:</b> en un año, ${$$(1e8)} a ${pc4(ipv)} ${perName(o.m)} durante ${o.m} períodos da ${$$(1e8*Math.pow(1+ipv,o.m))}; con la tasa pedida da lo mismo, por eso son equivalentes.</p>`};
  $("t-pre").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const p=PRE[b.dataset.k];["t-v","t-tipo","t-mod","t-m","d-tipo","d-mod","d-m"].forEach((id,j)=>$(id).value=p[j]);run()});
  onAll($("sim"),run);run()};

// ---------- Indexadas, reales y devaluación
SIMS.indexada=function(){
  $("sim").innerHTML=`${seg("x-mod","Caso",[["dtf","DTF + puntos"],["real","Tasa real"],["dev","Devaluación"]],"dtf")}<div id="x-dtf"></div><div id="x-real" hidden></div><div id="x-dev" hidden></div>`;
  $("x-dtf").innerHTML=`<div class="calcf">${num("x-d","DTF (% N.A.T.A.)",10.05)}${num("x-p","Puntos (T.A.)",3.5)}${num("x-f","Tasa fija de comparación (% N.A.M.V.)",14.2)}</div><div id="x-do"></div>`;
  $("x-real").innerHTML=`${seg("x-rm","Incógnita",[["r","Rentabilidad real"],["c","Tasa a la que hay que invertir"]],"r")}<div class="calcf">${num("x-ic","Tasa corriente / real deseada (%)",27.44)}${num("x-inf","Inflación (%)",18)}</div><div id="x-ro"></div>`;
  $("x-dev").innerHTML=`<div class="calcf">${num("v-p","Precio en Colombia hoy ($)",50000)}${num("v-tc","Tipo de cambio hoy ($/US$)",2000)}${num("v-inf","Inflación de EE. UU. (%)",3)}${num("v-dev","Devaluación del peso (%)",18)}</div><div id="x-vo"></div>`;
  let rm="r";
  const dtf=()=>{const[d,p,f]=vals(["x-d","x-p","x-f"]);if(!(d>0&&p>=0&&f>0)){$("x-do").innerHTML=err("Tasas positivas.");return}
    const j=(d+p)/100,ia=j/4,iv=ia/(1-ia),ea=Math.pow(1+iv,4)-1,fe=Math.pow(1+f/1200,12)-1,dv=d/400/(1-d/400),mal=Math.pow(1+dv,4)-1+p/100;
    $("x-do").innerHTML=vars([["DTF (N.A.T.A.)",pc4(d/100)],["Puntos (T.A.)",pc4(p/100)],["j: tasa nominal combinada (N.A.T.A.)",pc4(j)],["Tasa fija (N.A.M.V.)",pc4(f/100)]])
      +`<div class="eq al chain">j = DTF + puntos = ${pc4(d/100)} + ${pc4(p/100)} = <b>${pc4(j)} N.A.T.A.</b><br>ia = j/4 = <b>${pc4(ia)}</b> trimestral anticipada<br>iv = ia/(1 − ia) = ${pc4(iv)} trimestral vencida<br>ie = (1 + iv)<sup>4</sup> − 1 = <b>${pc4(ea)} E.A.</b> &nbsp; ${xl(`=(1+(${xlpc(j)}/4)/(1-${xlpc(j)}/4))^4-1`)}<br>Fija: (1 + ${fm(f/100)}/12)<sup>12</sup> − 1 = <b>${pc4(fe)} E.A.</b> &nbsp; ${xl(`=INT.EFECTIVO(${xlpc(f/100)};12)`)}</div>
      <p><b>Decisión:</b> el crédito ${ea<fe?"indexado":"de tasa fija"} es más económico (${pc4(Math.min(ea,fe))} frente a ${pc4(Math.max(ea,fe))} E.A.).</p><p class="warn"><b>Así no:</b> convertir la DTF a efectiva (${pc4(Math.pow(1+dv,4)-1)}) y sumar los puntos da ${pc4(mal)}, que no es la tasa del crédito: los puntos están en modalidad nominal trimestre anticipado.</p>`};
  const real=()=>{const[a,inf]=vals(["x-ic","x-inf"]).map(x=>x/100);if(!(a>-1&&inf>-1)){$("x-ro").innerHTML=err("Tasas mayores que −100 %.");return}
    $("x-ro").innerHTML=rm==="r"?`<div class="eq al chain">i<sub>r</sub> = ${fr("1 + i<sub>c</sub>","1 + π")} − 1 = ${fr(fmt(1+a,4),fmt(1+inf,4))} − 1 = <b>${pc4(GF.real(a,inf))}</b></div><p>Excel: ${xl(`=(1+${xlpc(a)})/(1+${xlpc(inf)})-1`)}. La tasa real es lo que crece el poder de compra; no es ${pc2(a-inf)} (restar es un error).</p>`
      :`<div class="eq al chain">i<sub>c</sub> = (1 + i<sub>r</sub>)(1 + π) − 1 = ${fmt(1+a,4)}·${fmt(1+inf,4)} − 1 = <b>${pc4(GF.combinada(a,inf))}</b></div><p>Excel: ${xl(`=(1+${xlpc(a)})*(1+${xlpc(inf)})-1`)}.</p>`};
  const dev=()=>{const[p,tc,inf,dv]=vals(["v-p","v-tc","v-inf","v-dev"]);if(!(p>0&&tc>0)){$("x-vo").innerHTML=err("Precio y tipo de cambio positivos.");return}
    const us=p/tc,us1=us*(1+inf/100),tc1=tc*(1+dv/100),p1=us1*tc1;
    $("x-vo").innerHTML=`<div class="res">${tiles([["Precio en EE. UU. hoy","US$"+fmt(us,2)],["Precio en EE. UU. en un año","US$"+fmt(us1,2)],["Tipo de cambio en un año","$"+fmt(tc1,2)],["Precio en Colombia en un año",$$(p1)]])}</div><p>El precio en pesos sube (1 + ${fm(inf/100)})(1 + ${fm(dv/100)}) − 1 = <b>${pc2(GF.combinada(inf/100,dv/100))}</b>: la inflación externa y la devaluación se componen.</p>`};
  bindSeg("x-mod",v=>{["dtf","real","dev"].forEach(k=>$("x-"+k).hidden=k!==v)});
  bindSeg("x-rm",v=>{rm=v;$("x-ic").value=v==="r"?27.44:8;real()});
  onAll($("x-dtf"),dtf);onAll($("x-real"),real);onAll($("x-dev"),dev);dtf();real();dev()};

// ---------- Anualidades
SIMS.anual=function(){
  $("sim").innerHTML=`${seg("a-tipo","Tipo",[["v","Vencida"],["a","Anticipada"],["d","Diferida"],["p","Perpetua"]],"v")}${seg("a-inc","Incógnita",[["A","Cuota A"],["P","Valor presente P"],["F","Valor futuro F"],["n","Número de cuotas n"],["i","Tasa i"]],"A")}
  <div class="calcf">${num("a-P","P: valor presente",10000000)}${num("a-A","A: cuota",500000)}${num("a-F","F: valor futuro",0)}${num("a-i","i: tasa por período (%)",2)}${num("a-n","n: número de cuotas",24,1)}${num("a-k","k: períodos de gracia (diferida)",3,1)}</div><div id="a-out"></div>`;
  let tp="v",inc="A";
  const run=()=>{const[P,A,F,ip,n,k]=vals(["a-P","a-A","a-F","a-i","a-n","a-k"]),i=ip/100,ant=tp==="a",gr=tp==="d"?Math.max(0,k):0;let r,eq,ex,v=[];
    const ok=x=>isFinite(x)&&x>0;
    if(tp==="p"){if(!(i>0)){$("a-out").innerHTML=err("La tasa debe ser positiva.");return}
      if(inc==="P"||inc==="F"||inc==="n"){r=A/i;eq=`P = A/i = ${$$(A)}/${fmt(i,4)} = <b>${$$(r)}</b>`;ex=`=${xlnum(A)}/${xlpc(i)}`;v=[["A: cuota",$$(A)],["i: tasa",pc4(i)],["P: valor presente (incógnita)",$$(r)]]}
      else if(inc==="A"){r=P*i;eq=`A = P·i = ${$$(P)}·${fmt(i,4)} = <b>${$$(r)}</b>`;ex=`=${xlnum(P)}*${xlpc(i)}`;v=[["P",$$(P)],["i",pc4(i)],["A (incógnita)",$$(r)]]}
      else{r=A/P;eq=`i = A/P = <b>${pc4(r)}</b>`;ex=`=${xlnum(A)}/${xlnum(P)}`;v=[["P",$$(P)],["A",$$(A)],["i (incógnita)",pc4(r)]]}
      $("a-out").innerHTML=vars(v)+`<div class="eq al chain">${eq}</div><p>Excel: ${xl(ex)}. Una perpetuidad no tiene valor futuro ni número de cuotas: los pagos no terminan.</p>`;return}
    if(!(n>=1&&n<=600)||!(i>=0)){$("a-out").innerHTML=err("n entre 1 y 600 y tasa no negativa.");return}
    const fP=(GF.VPa(1,i,n,ant))/Math.pow(1+i,gr),fF=GF.VFa(1,i,n,ant),t=ant?";1":"",gtxt=gr?`·(1 + i)<sup>−${gr}</sup>`:"",fac=`[1 − (1 + i)<sup>−n</sup>]/i${ant?"·(1 + i)":""}${gtxt}`;
    if(inc==="A"){if(ok(P)){r=P/fP;eq=`A = P / {${fac}} = ${$$(P)}/${fmt(fP,6)} = <b>${$$(r)}</b>`;ex=gr?`=PAGO(${xlpc(i)};${n};-${xlnum(P)}*(1+${xlpc(i)})^${gr}${t})`:`=PAGO(${xlpc(i)};${n};-${xlnum(P)}${ant?";0;1":""})`;v=[["P",$$(P)]]}
      else{r=F/fF;eq=`A = F / {[(1 + i)<sup>n</sup> − 1]/i${ant?"·(1 + i)":""}} = ${$$(F)}/${fmt(fF,6)} = <b>${$$(r)}</b>`;ex=`=PAGO(${xlpc(i)};${n};0;-${xlnum(F)}${t})`;v=[["F",$$(F)]]}}
    else if(inc==="P"){r=A*fP;eq=`P = A·${fac} = ${$$(A)}·${fmt(fP,6)} = <b>${$$(r)}</b>`;ex=`=VA(${xlpc(i)};${n};-${xlnum(A)}${ant?";0;1":""})${gr?`/(1+${xlpc(i)})^${gr}`:""}`;v=[["A",$$(A)]]}
    else if(inc==="F"){r=A*fF;eq=`F = A·[(1 + i)<sup>n</sup> − 1]/i${ant?"·(1 + i)":""} = ${$$(A)}·${fmt(fF,6)} = <b>${$$(r)}</b>`;ex=`=VF(${xlpc(i)};${n};-${xlnum(A)}${ant?";0;1":""})`;v=[["A",$$(A)]]}
    else if(inc==="n"){const Pe=P*Math.pow(1+i,gr);r=GF.nA(Pe,A,i,ant);if(!isFinite(r)){$("a-out").innerHTML=err("Con esa cuota nunca se paga la deuda: la cuota no alcanza ni para los intereses.");return}eq=`n = −ln(1 − P·i/A${ant?"′":""})/ln(1 + i) = <b>${fmt(r,4)}</b>`;ex=`=NPER(${xlpc(i)};-${xlnum(A)};${xlnum(Pe)}${ant?";0;1":""})`;v=[["P",$$(P)],["A",$$(A)]]}
    else{const Pe=P*Math.pow(1+i,gr);r=GF.iA(Pe,A,n,ant);if(!isFinite(r)){$("a-out").innerHTML=err("Con estos datos no hay una tasa positiva: la suma de las cuotas no supera a P.");return}eq=`Se busca i tal que P = A·${fac.replace(gtxt,"")} ⇒ <b>i = ${pc4(r)}</b>`;ex=`=TASA(${n};-${xlnum(A)};${xlnum(Pe)}${ant?";0;1":""})`;v=[["P",$$(P)],["A",$$(A)]]}
    const nn=inc==="n"?Math.ceil(r):n,As=inc==="A"?r:A,start=ant?0:1;
    const fl=[...(inc==="F"||(inc==="A"&&!ok(P))?[]:[{t:0,v:inc==="P"?r:P,lab:"P"}]),...Array.from({length:Math.min(nn,60)},(_,j)=>({t:gr+start+j,v:-As,lab:j<2||j===Math.min(nn,60)-1?"A":""}))];
    $("a-out").innerHTML=timeline(fl,Math.min(gr+nn,72),null,"períodos")+vars([...v,["i: tasa por período",pc4(inc==="i"?r:i)],["n: número de cuotas",inc==="n"?fmt(r,4):n],...(gr?[["k: períodos de gracia",gr]]:[]),[`${inc} (incógnita)`,inc==="i"?pc4(r):inc==="n"?fmt(r,4):$$(r)]])
      +`<div class="eq al chain">${eq}</div><p>Excel: ${xl(ex)}${ant?" (el último argumento 1 indica pagos anticipados)":""}.</p>`
      +`<p><b>Interpretación:</b> ${inc==="A"?`hay que pagar ${$$(r)} por período durante ${n} períodos.`:inc==="P"?`la serie de cuotas equivale hoy a ${$$(r)}.`:inc==="F"?`al final se habrán acumulado ${$$(r)}.`:inc==="n"?`se necesitan ${fmt(r,2)} cuotas (${Math.ceil(r)} en la práctica, la última menor).`:`la tasa implícita es ${pc4(r)} por período.`}</p>`};
  bindSeg("a-tipo",v=>{tp=v;run()});bindSeg("a-inc",v=>{inc=v;run()});onAll($("sim"),run);run()};

// ---------- Amortización
SIMS.amort=function(){
  $("sim").innerHTML=`${seg("m-sis","Sistema",[["frances","Francés (cuota fija)"],["aleman","Alemán (abono constante)"],["americano","Americano"],["todos","Comparar los tres"]],"frances")}
  <div class="calcf">${num("m-P","P: monto del crédito",60000000)}${num("m-i","i: tasa efectiva por período (%)",2)}${num("m-n","n: número de cuotas",6,1)}</div><div id="m-out"></div>`;
  let sis="frances";
  const NOM={frances:"Francés",aleman:"Alemán",americano:"Americano"};
  const one=(P,i,n,s)=>{const R=GF.amort(P,i,n,s),last=12+n;
    const f={frances:[["C Cuota","=PAGO($B$4;$B$5;-$B$3)","arrastrar"],["D Intereses","=PAGOINT($B$4;A13;$B$5;-$B$3)","arrastrar (o =B14*$B$4)"],["E Abono a capital","=PAGO.PRINC($B$4;A13;$B$5;-$B$3)","arrastrar (o =C14-D14)"]],
      aleman:[["E Abono a capital","=$B$3/$B$5","arrastrar"],["D Intereses","=B13*$B$4","arrastrar"],["C Cuota","=D13+E13","arrastrar"]],
      americano:[["D Intereses","=B13*$B$4","arrastrar"],["E Abono a capital","=SI(A13=$B$5;B13;0)","arrastrar"],["C Cuota","=D13+E13","arrastrar"]]}[s];
    return{R,html:`<div class="res">${tiles(s==="frances"?[["Cuota fija A",$$(R.A)],["Total de intereses",$$(R.tot.it)],["Total pagado",$$(R.tot.q)]]:s==="aleman"?[["Abono constante",$$(R.ab)],["Primera cuota",$$(R.r[0].q)],["Total de intereses",$$(R.tot.it)]]:[["Interés mensual",$$(P*i)],["Pago del último período",$$(R.r[n-1].q)],["Total de intereses",$$(R.tot.it)]])}</div>`
      +tabla(["Período","Saldo inicial","Cuota","Intereses","Abono a capital","Saldo final"],R.r.map(r=>[r.k,$$(r.ini),$$(r.q),$$(r.it),$$(r.a),$$(Math.abs(r.fin)<0.005?0:r.fin)]),["Total","",$$(R.tot.q),$$(R.tot.it),$$(R.tot.a),""])
      +stp("fx","Fórmulas en Excel (B3 = P, B4 = i, B5 = n; período 1 en la fila 13)",`<div class="tbl"><table><tr><th>Columna</th><th>Fila 13</th><th>Fila 14 hasta ${last}</th></tr><tr><td>A Período</td><td>${xl("1")}</td><td>${xl("=A13+1")}</td></tr><tr><td>B Saldo inicial</td><td>${xl("=$B$3")}</td><td>${xl("=F13")}</td></tr>${f.map(x=>`<tr><td>${x[0]}</td><td>${xl(x[1])}</td><td>${x[2]}</td></tr>`).join("")}<tr><td>F Saldo final</td><td>${xl("=B13-E13")}</td><td>arrastrar</td></tr><tr><td>Totales</td><td colspan="2">${xl(`=SUMA(C13:C${last})`)}, ${xl(`=SUMA(D13:D${last})`)}, ${xl(`=SUMA(E13:E${last})`)}</td></tr></table></div><p>Comprobación: el saldo final del último período es 0 y la suma de abonos es igual a P.</p>`)}};
  const run=()=>{const[P,ip,n]=vals(["m-P","m-i","m-n"]),i=ip/100;if(!(P>0&&i>=0&&Number.isInteger(n)&&n>=1&&n<=120)){$("m-out").innerHTML=err("P positivo, tasa no negativa y n entero entre 1 y 120.");return}
    const head=vars([["P: valor del crédito",$$(P)],["i: tasa efectiva por período",pc4(i)],["n: número de cuotas",n],[sis==="frances"?"A: cuota fija":sis==="aleman"?"Abono constante a capital":sis==="americano"?"Interés por período":"—",sis==="frances"?$$(GF.Ap(P,i,n)):sis==="aleman"?$$(P/n):sis==="americano"?$$(P*i):"—"]]);
    if(sis!=="todos"){$("m-out").innerHTML=head+one(P,i,n,sis).html;return}
    const S=["frances","aleman","americano"].map(s=>({s,R:GF.amort(P,i,n,s)})),its=S.map(x=>x.R.tot.it),mn=Math.min(...its),mx=Math.max(...its);
    $("m-out").innerHTML=tabla(["Sistema","Primera cuota","Última cuota","Total de intereses","Posición"],S.map(x=>[NOM[x.s],$$(x.R.r[0].q),$$(x.R.r[n-1].q),$$(x.R.tot.it),x.R.tot.it===mn?"Más económico":x.R.tot.it===mx?"Más costoso":"Intermedio"]))
      +`<p>La primera cuota alemana supera a la francesa en <b>${$$(S[1].R.r[0].q-S[0].R.A)}</b>.</p>`
      +plotXY({xr:[0.5,n+0.5],yr:[0,Math.max(...S.flatMap(x=>x.R.r.map(r=>r.q)))*1.08],xl:"Período",yl:"Cuota",series:S.map((x,j)=>({pts:x.R.r.map(r=>[r.k,r.q]),col:["--line","--branch","--exam"][j],dots:1})),label:"Cuotas por sistema"})
      +`<div class="legend"><span><i style="background:var(--line)"></i>Francés</span><span><i style="background:var(--branch)"></i>Alemán</span><span><i style="background:var(--exam)"></i>Americano</span></div>`
      +`<p><b>Lectura:</b> el alemán paga menos intereses porque reduce la deuda más rápido, a cambio de cuotas altas al inicio. El americano tiene cuotas bajas pero concentra todo el capital al final: más intereses y más riesgo de no poder pagar o tener que refinanciar. El francés queda en medio con una cuota estable.</p><p>Tabla resumen en Excel: ${xl("=EJ6!D19")}, ${xl("=EJ7!D19")}, ${xl("=EJ8!D19")} y la posición con ${xl('=SI(B2=MIN($B$2:$B$4);"Más económico";SI(B2=MAX($B$2:$B$4);"Más costoso";"Intermedio"))')}.</p>`};
  bindSeg("m-sis",v=>{sis=v;run()});onAll($("sim"),run);run()};
function plotXY({xr,yr,series=[],xl,yl,H=260,label}){const W=600,f=frame(W,H,xr,yr,ticks(Math.ceil(xr[0]),xr[1],1),ticks(yr[0],yr[1],nice((yr[1]-yr[0])/4)),xl,yl);let b="";
  series.forEach(s=>{const d=s.pts.map(([x,y],i)=>(i?"L":"M")+f.sx(x).toFixed(1)+","+f.sy(y).toFixed(1)).join("");b+=`<path d="${d}" fill="none" stroke="var(${s.col})" stroke-width="2.4"/>`;if(s.dots)s.pts.forEach(([x,y])=>b+=`<circle cx="${f.sx(x)}" cy="${f.sy(y)}" r="3.5" fill="var(${s.col})"/>`)});
  return `<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${f.g}${b}</svg></div>`}

// ---------- Gradientes
SIMS.grad=function(){
  $("sim").innerHTML=`${seg("g-t","Gradiente",[["a","Aritmético (G en pesos)"],["g","Geométrico (g en %)"]],"a")}<div class="calcf">${num("g-A","A₁: primer flujo (período 1)",1000000)}${num("g-G","G (pesos) o g (%) por período",50000)}${num("g-i","i: tasa por período (%)",2)}${num("g-n","n: número de flujos",12,1)}</div><div id="g-out"></div>`;
  let tp="a";
  const run=()=>{const[A1,Gv,ip,n]=vals(["g-A","g-G","g-i","g-n"]),i=ip/100;if(!(Number.isInteger(n)&&n>=1&&n<=360&&i>0&&isFinite(A1)&&isFinite(Gv))){$("g-out").innerHTML=err("n entero entre 1 y 360 y tasa positiva.");return}
    const R=tp==="a"?GF.gradA(A1,Gv,i,n):GF.gradG(A1,Gv/100,i,n),last=12+n;
    $("g-out").innerHTML=timeline(R.fl.map((v,k)=>({t:k+1,v,lab:k===0?"A₁":k===n-1?"Aₙ":""})),n,0,"períodos")
      +vars([["A₁: primer flujo",$$(A1)],[tp==="a"?"G: gradiente aritmético":"g: gradiente geométrico",tp==="a"?$$(Gv):pc4(Gv/100)],["i: tasa por período",pc4(i)],["n: número de flujos",n],["P: valor presente",$$(R.P)]])
      +`<div class="res">${tiles([["Valor presente P",$$(R.P)],["Valor futuro F",$$(R.F)],["Último flujo",$$(R.fl[n-1])]])}</div>`
      +`<div class="eq al chain">${tp==="a"?`P = A₁·[1 − (1 + i)<sup>−n</sup>]/i + (G/i)·{[1 − (1 + i)<sup>−n</sup>]/i − n/(1 + i)<sup>n</sup>} = <b>${$$(R.Pf)}</b>`:Math.abs(i-Gv/100)<1e-12?`P = n·A₁/(1 + i) = <b>${$$(R.Pf)}</b>`:`P = A₁·[1 − ((1 + g)/(1 + i))<sup>n</sup>]/(i − g) = <b>${$$(R.Pf)}</b>`}</div>`
      +stp(1,"En Excel",`<p>Flujos en la columna B desde la fila 13: B13 ${xl("=$B$3")}, B14 ${xl(tp==="a"?"=B13+$B$4":"=B13*(1+$B$4)")} y arrastrar hasta B${last}. Valor presente ${xl(`=VNA($B$5;B13:B${last})`)} y valor futuro ${xl(`=VF($B$5;$B$6;0;-B8)`)}. Comprueba con la fórmula cerrada.</p>`)
      +tabla(["Período","Flujo","Valor presente del flujo"],R.fl.slice(0,24).map((v,k)=>[k+1,$$(v),$$(v/Math.pow(1+i,k+1))]),["Total",$$(R.fl.reduce((a,b)=>a+b,0)),$$(R.P)])};
  bindSeg("g-t",v=>{tp=v;$("g-G").value=v==="a"?50000:3;run()});onAll($("sim"),run);run()};

// ---------- Criterios de decisión
SIMS.vpn=function(){
  $("sim").innerHTML=`<div class="calcf">${txt("v-f","Flujos desde el período 0, separados por punto y coma","-80000; 0; 0; 0; 0; 73000; 0; 0; 0; 0; 0; 0; 0; 0; 0; 85000")}${num("v-tio","TIO por período (%)",3)}${num("v-rein","Tasa de reinversión para la TIRM (%)",3)}</div><div id="v-out"></div>`;
  const run=()=>{const f=$("v-f").value.split(/[;\n]+/).map(s=>parseFloat(s.trim().replace(/\./g,"").replace(",","."))).filter(x=>isFinite(x));const[t,rv]=vals(["v-tio","v-rein"]).map(x=>x/100);
    if(f.length<2||!(f.some(x=>x<0)&&f.some(x=>x>0))||!(t>-1)){$("v-out").innerHTML=err("Escribe al menos dos flujos, con algún negativo (inversión) y algún positivo.");return}
    const n=f.length-1,VPN=GF.vpn(f,t),TIR=GF.tir(f),TIRM=GF.tirm(f,t,rv),RBC=GF.rbc(f,t),CAUE=GF.caue(f,t),PRI=GF.pri(f,t);
    $("v-out").innerHTML=timeline(f.map((v,k)=>({t:k,v})),n,0,"períodos")
      +`<div class="res">${tiles([["VPN",$$(VPN)],["TIR",isFinite(TIR)?pc4(TIR):"—"],["TIRM",isFinite(TIRM)?pc4(TIRM):"—"],["RBC",isFinite(RBC)?fmt(RBC,4):"—"],["CAUE",$$(CAUE)],["PRI descontado",isFinite(PRI)?fmt(PRI,2)+" períodos":"No se recupera"]])}</div>`
      +tabla(["Criterio","Excel","Decisión"],[["VPN",xl(`=VNA(${xlpc(t)};B3:B${n+2})+B2`),VPN>0?"Se acepta: genera riqueza por encima de la TIO":"Se rechaza"],["TIR",xl(`=TIR(B2:B${n+2})`),isFinite(TIR)?(TIR>t?"TIR > TIO: se acepta":"TIR < TIO: se rechaza"):"—"],["TIRM",xl(`=TIRM(B2:B${n+2};${xlpc(t)};${xlpc(rv)})`),isFinite(TIRM)?(TIRM>t?"Se acepta":"Se rechaza"):"—"],["RBC","VP de ingresos / VP de egresos",RBC>1?"RBC > 1: se acepta":"Se rechaza"],["CAUE",xl(`=PAGO(${xlpc(t)};${n};-VPN)`),"Equivalente por período del VPN"]])
      +`<p><b>Interpretación:</b> ${VPN>0?`a la TIO de ${pc2(t)} el proyecto deja ${$$(VPN)} de riqueza adicional en pesos de hoy${isFinite(TIR)?` y rinde ${pc2(TIR)} por período`:""}.`:`a la TIO de ${pc2(t)} el proyecto destruye ${$$(-VPN)} en pesos de hoy.`}</p>`};
  onAll($("sim"),run);run()};


// ===================== LABORATORIOS DEL PROGRAMA 1501798 =====================
SIMS.uvr=function(){
  $("sim").innerHTML=`${seg("uv-m","Herramienta",[["cont","Tasa continua"],["uvr","Crédito en UVR"]],"cont")}<div id="uv-b"></div>`;
  const M={cont(){$("uv-b").innerHTML=`<div class="calcf">${num("uv-j","j: tasa nominal anual (%)",12)}${num("uv-P","P: valor presente",10000000)}${num("uv-n","n: años",5)}</div><div class="res" id="uv-r"></div><div id="uv-s"></div>`;
      const run=()=>{const[j,P,n]=[parseFloat($("uv-j").value)/100,parseFloat($("uv-P").value),parseFloat($("uv-n").value)];if(![j,P,n].every(isFinite)){$("uv-r").innerHTML=err("completa los datos.");return}
        const ea=Math.exp(j)-1,rows=[1,2,4,12,365].map(m=>[m===1?"Anual":m===2?"Semestral":m===4?"Trimestral":m===12?"Mensual":"Diaria",pc4(Math.pow(1+j/m,m)-1)]);
        $("uv-r").innerHTML=tiles([["Tasa efectiva anual equivalente",pc4(ea),"okt"],["F = P·e^(jn)",$$(P*Math.exp(j*n))],["F con capitalización mensual",$$(P*Math.pow(1+j/12,12*n))]]);
        $("uv-s").innerHTML=tabla(["Capitalización","Tasa efectiva anual"],rows.concat([["Continua",pc4(ea)]]))+`<p>Excel: ${xl(`=EXP(${xlpc(j)})-1`)} · Valor futuro: ${xl(`=${xlnum(P)}*EXP(${xlpc(j)}*${xlnum(n)})`)} · De efectiva a continua: ${xl(`=LN(1+${xlpc(ea)})`)}</p>`};
      onAll($("uv-b"),run);run()},
    uvr(){$("uv-b").innerHTML=`<div class="calcf">${num("uv-L","Préstamo en pesos",150000000)}${num("uv-u","Valor de la UVR hoy",400)}${num("uv-r2","Tasa real en UVR (% E.A.)",7.5)}${num("uv-pi","Inflación esperada (% anual)",5)}${num("uv-y","Plazo (años)",15)}</div><div class="res" id="uv-r"></div><div id="uv-s"></div>`;
      const run=()=>{const[L,u0,r,pi,y]=["uv-L","uv-u","uv-r2","uv-pi","uv-y"].map(id=>parseFloat($(id).value));if(!(L>0&&u0>0&&y>0)){$("uv-r").innerHTML=err("valores positivos.");return}
        const n=Math.round(y*12),im=Math.pow(1+r/100,1/12)-1,pm=Math.pow(1+pi/100,1/12)-1,D=L/u0,c=im===0?D/n:D*im/(1-Math.pow(1+im,-n)),ip=(1+im)*(1+pm)-1,cp=ip===0?L/n:L*ip/(1-Math.pow(1+ip,-n));
        let s=D,rows=[],maxSaldo=L;for(let k=1;k<=n;k++){const int=s*im;s=s-(c-int);const uv=u0*Math.pow(1+pm,k);if(k%12===0||k===1){rows.push([k,fmt(uv,2),fmt(c,2),$$(c*uv),$$(Math.max(s,0)*uv)])}maxSaldo=Math.max(maxSaldo,s*uv)}
        $("uv-r").innerHTML=tiles([["Deuda en UVR",fmt(D,2)],["Cuota fija en UVR",fmt(c,4)],["Primera cuota en pesos",$$(c*u0*(1+pm)),"okt"],["Cuota fija equivalente en pesos",$$(cp)],["Saldo máximo en pesos",$$(maxSaldo),maxSaldo>L?"badt":""]]);
        $("uv-s").innerHTML=tabla(["Mes","UVR","Cuota (UVR)","Cuota (pesos)","Saldo (pesos)"],rows)+`<p>Tasa mensual en UVR: ${pc4(im)}; en pesos: (1 + ${pc4(im)})(1 + ${pc4(pm)}) − 1 = ${pc4(ip)}. Excel: cuota en UVR ${xl(`=PAGO(${xlpc(im)};${n};-${xlnum(+D.toFixed(4))})`)}.</p><p class="hint">La cuota en pesos arranca más baja que la del crédito en pesos, pero crece con la inflación; ${maxSaldo>L?"el saldo en pesos llega a superar lo prestado en los primeros años.":"con estos datos el saldo en pesos no supera lo prestado."}</p>`};
      onAll($("uv-b"),run);run()}};
  bindSeg("uv-m",k=>M[k]());M.cont()};

SIMS.fcaja=function(){
  $("sim").innerHTML=`<div class="calcf">${num("fc-I","Inversión en activos fijos",100000000)}${num("fc-W","Capital de trabajo inicial",10000000)}${num("fc-V","Ingresos anuales",80000000)}${num("fc-C","Costos y gastos desembolsables anuales",45000000)}${num("fc-n","Vida (años)",5,1)}${num("fc-S","Valor de salvamento",20000000)}${num("fc-t","Impuesto de renta (%)",35)}${num("fc-k","Costo de capital (% E.A.)",14)}${num("fc-L","Préstamo",50000000)}${num("fc-id","Tasa del préstamo (% E.A.)",12)}${num("fc-ke","Tasa de oportunidad del inversionista (% E.A.)",18)}</div><div class="res" id="fc-r"></div><div id="fc-s"></div>`;
  const run=()=>{const g=id=>parseFloat($(id).value),I=g("fc-I"),W=g("fc-W"),V=g("fc-V"),C=g("fc-C"),n=Math.round(g("fc-n")),S=g("fc-S"),t=g("fc-t")/100,k=g("fc-k")/100,L=g("fc-L"),id=g("fc-id")/100,ke=g("fc-ke")/100;
    if(!(n>=1&&n<=30)||![I,W,V,C,S,t,k,L,id,ke].every(isFinite)){$("fc-r").innerHTML=err("revisa los datos (vida entre 1 y 30 años).");return}
    const dep=(I-S)/n,cu=id===0?L/n:L*id/(1-Math.pow(1+id,-n));let s=L;const P=[],F=[],rows=[];
    for(let y=0;y<=n;y++){let inv=0,op=0,fin=0;if(y===0){inv=-I-W;fin=L}else{op=(V-C-dep)*(1-t)+dep;const int=s*id,ab=cu-int;s-=ab;fin=-(cu)+int*t;if(y===n)inv=S+W}
      P.push(inv+op);F.push(inv+op+fin);rows.push([y,$$(inv),$$(op),$$(inv+op),$$(fin),$$(inv+op+fin)])}
    const vpn=(fl,r)=>fl.reduce((a,v,i)=>a+v/Math.pow(1+r,i),0),tir=fl=>{let lo=-0.99,hi=10;if(vpn(fl,lo)*vpn(fl,hi)>0)return NaN;for(let i=0;i<200;i++){const m=(lo+hi)/2;if(vpn(fl,lo)*vpn(fl,m)<=0)hi=m;else lo=m}return(lo+hi)/2};
    const v1=vpn(P,k),v2=vpn(F,ke);
    $("fc-r").innerHTML=tiles([["Depreciación anual (línea recta)",$$(dep)],["VPN del proyecto",$$(v1),v1>=0?"okt":"badt"],["TIR del proyecto",pc2(tir(P))],["VPN del inversionista",$$(v2),v2>=0?"okt":"badt"],["TIR del inversionista",pc2(tir(F))]]);
    $("fc-s").innerHTML=tabla(["Año","Inversión","Operación","Flujo del proyecto","Financiación (neta de impuestos)","Flujo del inversionista"],rows)+
      stp(1,"Cálculo",`<div class="eq al">FCO = (${$$(V)} − ${$$(C)} − ${$$(dep)})(1 − ${fmt(t,2)}) + ${$$(dep)} = <b>${$$(((V-C-dep)*(1-t)+dep))}</b><br>Año ${n}: se recuperan el salvamento y el capital de trabajo<br>Financiación: + préstamo en el año 0; luego − cuota + intereses × t (escudo fiscal de los intereses)</div><p>Excel: ${xl(`=VNA(${xlpc(k)};C2:C${n+1})+C1`)} y ${xl(`=TIR(C1:C${n+1})`)}, con los flujos en la columna C.</p>`)};
  onAll($("sim"),run);run()};

SIMS.efaf=function(){
  const D=`Efectivo;20;35\nCuentas por cobrar;60;85\nInventarios;70;80\nActivos fijos netos;200;240\nObligaciones de corto plazo;-50;-70\nProveedores;-40;-45\nObligaciones de largo plazo;-80;-100\nCapital;-120;-120\nUtilidades retenidas;-60;-105`;
  $("sim").innerHTML=`<div class="calcf"><label for="ef-d" style="grid-column:1/-1">Cuentas del balance: nombre; año 1; año 2 (activos positivos; pasivos y patrimonio negativos)<textarea id="ef-d" rows="9" style="width:100%;font-family:var(--f-mono)">${D}</textarea></label>${num("ef-dep","Depreciación del año 2",25)}${num("ef-div","Dividendos pagados en el año 2",15)}</div><div class="res" id="ef-r"></div><div id="ef-s"></div>`;
  const run=()=>{const rows=$("ef-d").value.trim().split(/\n+/).map(l=>l.split(";").map(x=>x.trim())).filter(r=>r.length>=3&&isFinite(+r[1].replace(",","."))&&isFinite(+r[2].replace(",","."))).map(r=>[r[0],+r[1].replace(",","."),+r[2].replace(",",".")]);
    const dep=parseFloat($("ef-dep").value)||0,div=parseFloat($("ef-div").value)||0;if(rows.length<2){$("ef-r").innerHTML=err("al menos dos cuentas.");return}
    const s1=rows.reduce((a,r)=>a+r[1],0),s2=rows.reduce((a,r)=>a+r[2],0);
    const F=[],U=[];rows.forEach(([n,a,b])=>{const d=b-a;if(!d)return;const act=a>=0&&b>=0;if(act){(d>0?U:F).push([n,Math.abs(d)])}else{(d<0?F:U).push([n,Math.abs(d)])}});
    const tf=F.reduce((a,x)=>a+x[1],0),tu=U.reduce((a,x)=>a+x[1],0);
    const cash=rows.find(r=>/efectivo|caja/i.test(r[0])),ut=rows.find(r=>/utilidad/i.test(r[0])),un=ut?-(ut[2]-ut[1])+div:NaN,af=rows.find(r=>/fijo/i.test(r[0]));
    $("ef-r").innerHTML=tiles([["¿Cuadra el balance? (suma = 0)",Math.abs(s1)<1e-6&&Math.abs(s2)<1e-6?"Sí":"No",Math.abs(s1)<1e-6&&Math.abs(s2)<1e-6?"okt":"badt"],["Total fuentes",fmt(tf,2)],["Total usos",fmt(tu,2)],["Utilidad neta implícita",isFinite(un)?fmt(un,2):"—"]]);
    let efe="";if(cash&&isFinite(un)&&af){const wc=rows.filter(r=>r!==cash&&r!==af&&r!==ut&&!/capital|largo plazo|obligaciones de corto/i.test(r[0])).map(r=>[r[0],-(r[2]-r[1])]),ope=un+dep+wc.reduce((a,x)=>a+x[1],0),inv=-(af[2]-af[1]+dep),fin=rows.filter(r=>/capital|obligaciones/i.test(r[0])).reduce((a,r)=>a-(r[2]-r[1]),0)-div;
      efe=stp(2,"Estado de flujos de efectivo (método indirecto)",tabla(["Concepto","Valor"],[["Utilidad neta",fmt(un,2)],["+ Depreciación",fmt(dep,2)],...wc.map(([n,v])=>["Variación de "+n.toLowerCase(),fmt(v,2)]),["<b>Flujo de operación</b>",fmt(ope,2)],["Compra de activos fijos (variación neta + depreciación)",fmt(inv,2)],["<b>Flujo de inversión</b>",fmt(inv,2)],["Variación de obligaciones y capital − dividendos",fmt(fin,2)],["<b>Flujo de financiación</b>",fmt(fin,2)],["<b>Variación del efectivo</b>",fmt(ope+inv+fin,2)+` (balance: ${fmt(cash[2]-cash[1],2)})`]]))}
    $("ef-s").innerHTML=stp(1,"Estado de fuentes y usos",`<div class="grid2">${tabla(["Fuentes","Valor"],F.map(([n,v])=>[n,fmt(v,2)]),["Total",fmt(tf,2)])}${tabla(["Usos","Valor"],U.map(([n,v])=>[n,fmt(v,2)]),["Total",fmt(tu,2)])}</div><p class="hint">El efectivo aparece como uso cuando aumenta. Las utilidades retenidas cuentan como fuente por la utilidad del año menos los dividendos.</p>`)+efe};
  onAll($("sim"),run);run()};

SIMS.rr=function(){
  $("sim").innerHTML=`<div class="calcf">${num("rr-V","Ventas",1000)}${num("rr-cv","Costos variables (% de ventas)",60)}${num("rr-CF","Costos fijos",200)}${num("rr-A","Activo total",1000)}${num("rr-D","Deuda",500)}${num("rr-kd","Costo de la deuda (%)",10)}${num("rr-t","Impuesto (%)",35)}${num("rr-dV","Cambio en ventas para el escenario (%)",10)}</div><div class="res" id="rr-r"></div><div id="rr-s"></div>`;
  const run=()=>{const g=id=>parseFloat($(id).value),V=g("rr-V"),cv=g("rr-cv")/100,CF=g("rr-CF"),A=g("rr-A"),D=g("rr-D"),kd=g("rr-kd")/100,t=g("rr-t")/100,dV=g("rr-dV")/100;
    if(!(A>0&&D>=0&&D<A&&V>0)){$("rr-r").innerHTML=err("activo positivo y deuda menor que el activo.");return}
    const P=A-D,est=v=>{const MC=v*(1-cv),U=MC-CF,I=D*kd,UN=(U-I)*(1-t);return{MC,U,I,UN}},b=est(V),e=est(V*(1+dV)),roa=b.U/A,roe=b.UN/P,gao=b.MC/b.U,gaf=b.U/(b.U-b.I);
    $("rr-r").innerHTML=tiles([["ROA = UAII/Activo",pc2(roa)],["ROE = UN/Patrimonio",pc2(roe),roe>roa*(1-t)?"okt":"badt"],["GAO",fmt(gao,3)],["GAF",fmt(gaf,3)],["GAT = GAO × GAF",fmt(gao*gaf,3)],["Apalancamiento",roa>kd?"Favorable (ROA > kd)":"Desfavorable (ROA < kd)",roa>kd?"okt":"badt"]]);
    $("rr-s").innerHTML=tabla(["Concepto","Base",`Ventas ${dV>=0?"+":""}${fmt(100*dV,1)} %`,"Cambio %"],[["Ventas",fmt(V,2),fmt(V*(1+dV),2),pc2(dV)],["Margen de contribución",fmt(b.MC,2),fmt(e.MC,2),pc2(e.MC/b.MC-1)],["UAII",fmt(b.U,2),fmt(e.U,2),pc2(e.U/b.U-1)],["Intereses",fmt(b.I,2),fmt(e.I,2),""],["Utilidad neta",fmt(b.UN,2),fmt(e.UN,2),pc2(e.UN/b.UN-1)]])+
      stp(1,"Lectura",`<div class="eq al">ROE = [ROA + (ROA − kd)·D/P](1 − t) = [${pc2(roa)} + (${pc2(roa)} − ${pc2(kd)})·${fmt(D/P,3)}]·${fmt(1-t,2)} = <b>${pc2((roa+(roa-kd)*D/P)*(1-t))}</b><br>Un cambio de ${pc2(dV)} en ventas mueve la UAII ${pc2(dV*gao)} (GAO) y la utilidad neta ${pc2(dV*gao*gaf)} (GAT)</div><p>Los costos fijos amplifican el riesgo económico; la deuda, el financiero. Más deuda sube el ROE esperado solo si el activo rinde más que la deuda, y siempre aumenta la variabilidad de la utilidad.</p>`)};
  onAll($("sim"),run);run()};
