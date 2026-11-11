
// ===================== LABORATORIO DE DATOS: subir una base, crear variables, estimar y probar =====================
// Todo se calcula en el navegador; los datos no salen del equipo. Usa CE (ejercicios_labs.js) y estadistica.js.
const DL={data:null,cols:[],name:"",model:null};
DL.XLSX_URL="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
DL.loadXLSX=()=>new Promise((ok,ko)=>{if(window.XLSX)return ok();const s=document.createElement("script");s.src=DL.XLSX_URL;s.onload=()=>ok();s.onerror=()=>ko(new Error("no se pudo cargar el lector de Excel (revisa la conexión)."));document.head.appendChild(s)});
DL.clean=s=>{let t=String(s==null?"":s).trim().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9_]+/g,"_").replace(/^_+|_+$/g,"");if(!t)t="v";if(/^\d/.test(t))t="v"+t;return t};
DL.num=v=>{if(typeof v==="number")return v;if(v==null)return NaN;let s=String(v).trim();if(s===""||/^(na|nan|null|\.|-)$/i.test(s))return NaN;
  if(/^-?[\d.]+,\d+$/.test(s))s=s.replace(/\./g,"").replace(",",".");else if(/^-?\d+,\d+$/.test(s))s=s.replace(",",".");else s=s.replace(/,(?=\d{3}(\D|$))/g,"");const x=Number(s);return isFinite(x)?x:NaN};
// matriz de texto → base {cols, data: {col: Float64[]}}
DL.fromRows=function(rows){rows=rows.filter(r=>r.some(c=>String(c==null?"":c).trim()!==""));if(rows.length<2)throw new Error("la base necesita al menos una fila de encabezados y una de datos.");
  const w=Math.max(...rows.map(r=>r.length)),first=rows[0],hasHead=first.some(c=>String(c).trim()!==""&&!isFinite(DL.num(c)));
  let heads=hasHead?first.map((c,j)=>DL.clean(c||("v"+(j+1)))):Array.from({length:w},(_,j)=>"v"+(j+1));const seen={};heads=heads.map(h=>{seen[h]=(seen[h]||0)+1;return seen[h]>1?h+"_"+seen[h]:h});
  const body=hasHead?rows.slice(1):rows,data={},cols=[],text={};
  for(let j=0;j<w;j++){const raw=body.map(r=>r[j]),nums=raw.map(DL.num),ok=nums.filter(isFinite).length;const h=heads[j]||("v"+(j+1));
    if(ok>=Math.max(1,0.6*raw.filter(x=>String(x==null?"":x).trim()!=="").length)){data[h]=nums;cols.push(h)}else{text[h]=raw.map(x=>String(x==null?"":x))}}
  // columnas de texto con pocas categorías → dummies
  Object.entries(text).forEach(([h,vals])=>{const lv=[...new Set(vals.filter(v=>v.trim()!==""))];if(lv.length>=2&&lv.length<=12){lv.slice(1).forEach(l=>{const nm=DL.clean(h+"_"+l);data[nm]=vals.map(v=>v===l?1:v.trim()===""?NaN:0);cols.push(nm)})}});
  if(!cols.length)throw new Error("no se encontraron columnas numéricas.");return{cols,data,n:body.length,text:Object.keys(text)}};
DL.parseText=function(t){const lines=t.replace(/\r/g,"").split("\n").filter(l=>l.trim()!=="");if(!lines.length)throw new Error("no hay datos.");
  const cand=["\t",";",","],cnt=d=>lines.slice(0,10).map(l=>l.split(d).length),d=cand.find(c=>{const k=cnt(c);return k[0]>1&&k.every(x=>x===k[0])})||(lines[0].includes("\t")?"\t":/\s{1,}/);
  const split=l=>{if(d===","){const o=[];let cur="",q=false;for(const ch of l){if(ch==='"'){q=!q;continue}if(ch===","&&!q){o.push(cur);cur=""}else cur+=ch}o.push(cur);return o}return typeof d==="string"?l.split(d).map(s=>s.replace(/^"|"$/g,"")):l.trim().split(d)};
  return DL.fromRows(lines.map(split))};
// ---------- estadística
DL.stats=v=>{const x=v.filter(isFinite),n=x.length;if(!n)return{n:0};const m=x.reduce((a,b)=>a+b,0)/n,s=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/Math.max(1,n-1)),o=[...x].sort((a,b)=>a-b);return{n,m,s,min:o[0],max:o[n-1],med:n%2?o[(n-1)/2]:(o[n/2-1]+o[n/2])/2,miss:v.length-n}};
DL.pt=(t,v)=>2*(1-tcdf(Math.abs(t),v));
DL.fit=function(yName,xNames,opt){const D=DL.data.data,N=DL.data.n,a=Math.max(1,opt.from||1)-1,b=Math.min(N,opt.to||N);const rows=[];
  for(let i=a;i<b;i++){const y=D[yName][i],xs=xNames.map(x=>D[x][i]);if(isFinite(y)&&xs.every(isFinite))rows.push(i)}
  const y=rows.map(i=>D[yName][i]),X=rows.map(i=>[...(opt.cte?[1]:[]),...xNames.map(x=>D[x][i])]),names=[...(opt.cte?["(Intercepto)"]:[]),...xNames];
  if(rows.length<=names.length)throw new Error(`hay ${rows.length} observaciones completas y ${names.length} parámetros: se necesitan más observaciones que parámetros.`);
  const R=CE.ols(X,y);if(!R)throw new Error("X′X no es invertible: hay colinealidad perfecta (una variable es combinación exacta de otras, o constante junto con el intercepto).");
  const n=y.length,k=names.length,yh=X.map(r=>r.reduce((s,v,j)=>s+v*R.b[j],0)),ym=y.reduce((s,v)=>s+v,0)/n,tssC=y.reduce((s,v)=>s+(v-ym)**2,0),tss=opt.cte?tssC:y.reduce((s,v)=>s+v*v,0);
  const r2=1-R.rss/tss,r2a=1-(1-r2)*(n-(opt.cte?1:0))/(n-k),ll=-n/2*(Math.log(2*Math.PI)+Math.log(R.rss/n)+1);
  // errores robustos HC1
  const meat=Array.from({length:k},()=>Array(k).fill(0));X.forEach((r,i)=>{const e2=R.e[i]**2;for(let p=0;p<k;p++)for(let q=0;q<k;q++)meat[p][q]+=e2*r[p]*r[q]});
  const Vr=CE.mm(CE.mm(R.I,meat),R.I).map(r=>r.map(v=>v*n/(n-k)));
  const q=opt.cte?k-1:k,F=q>0?((tss-R.rss)/q)/(R.rss/(n-k)):NaN;
  return{...R,y,X,yh,rows,names,n,k,r2,r2a,ll,aic:-2*ll+2*(k+1),bic:-2*ll+(k+1)*Math.log(n),seR:Vr.map((r,i)=>Math.sqrt(r[i])),Vr,F,qF:q,tss,yName,xNames,opt}};
DL.restr=(M,keep)=>{const X=M.X.map(r=>r.filter((_,j)=>keep.includes(j)));return keep.length?CE.ols(X,M.y):{rss:M.opt.cte?M.y.reduce((s,v)=>s+v*v,0):M.y.reduce((s,v)=>s+v*v,0)}};
// ---------- gráficos
DL.scatter=function({x,y,line,xl,yl,H=280,hz}){const W=600,xs=x.filter(isFinite),ys=[...y,...(line?line.map(p=>p[1]):[])].filter(isFinite);if(!xs.length)return"";let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  if(x0===x1){x0-=1;x1+=1}if(y0===y1){y0-=1;y1+=1}const px=(x1-x0)*.05,py=(y1-y0)*.08;x0-=px;x1+=px;y0-=py;y1+=py;const f=frame(W,H,[x0,x1],[y0,y1],ticks(x0,x1,nice((x1-x0)/5)),ticks(y0,y1,nice((y1-y0)/4)),xl,yl);
  let g="";if(hz!=null)g+=`<line x1="${f.sx(x0)}" x2="${f.sx(x1)}" y1="${f.sy(hz)}" y2="${f.sy(hz)}" stroke="var(--muted)" stroke-dasharray="4 4"/>`;
  const step=Math.max(1,Math.floor(x.length/1500));for(let i=0;i<x.length;i+=step)if(isFinite(x[i])&&isFinite(y[i]))g+=`<circle cx="${f.sx(x[i]).toFixed(1)}" cy="${f.sy(y[i]).toFixed(1)}" r="3" fill="var(--line)" opacity=".65"/>`;
  if(line)g+=`<path d="${line.map((p,i)=>(i?"L":"M")+f.sx(p[0]).toFixed(1)+","+f.sy(p[1]).toFixed(1)).join("")}" fill="none" stroke="var(--exam)" stroke-width="2.4"/>`;
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${yl} frente a ${xl}">${f.g}${g}</svg></div>`};
DL.hist=function(v,xl){const x=v.filter(isFinite);if(x.length<3)return"";const W=600,H=230,n=x.length,k=Math.min(30,Math.max(5,Math.round(Math.sqrt(n)))),lo=Math.min(...x),hi=Math.max(...x),w=(hi-lo)/k||1,c=Array(k).fill(0);x.forEach(v=>c[Math.min(k-1,Math.floor((v-lo)/w))]++);
  const mx=Math.max(...c),f=frame(W,H,[lo,hi],[0,mx*1.1],ticks(lo,hi,nice((hi-lo)/5)),ticks(0,mx*1.1,nice(mx/4)),xl,"frecuencia");let g="";c.forEach((h,i)=>{g+=`<rect x="${f.sx(lo+i*w)+1}" y="${f.sy(h)}" width="${Math.max(1,f.sx(lo+(i+1)*w)-f.sx(lo+i*w)-2)}" height="${f.sy(0)-f.sy(h)}" fill="var(--line)" opacity=".75"/>`});
  const m=x.reduce((a,b)=>a+b,0)/n,s=Math.sqrt(x.reduce((a,b)=>a+(b-m)**2,0)/(n-1));if(s>0){let d="";for(let i=0;i<=80;i++){const t=lo+(hi-lo)*i/80,yv=n*w*Math.exp(-(((t-m)/s)**2)/2)/(s*Math.sqrt(2*Math.PI));d+=(i?"L":"M")+f.sx(t).toFixed(1)+","+f.sy(yv).toFixed(1)}g+=`<path d="${d}" fill="none" stroke="var(--exam)" stroke-width="2"/>`}
  return`<div class="plot"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Histograma">${f.g}${g}</svg></div>`};
// ---------- variables nuevas con una expresión segura
DL.mk=(n,e)=>{const nm=DL.newVar(n,e);DL.created=(DL.created||[]).filter(x=>x[0]!==nm).concat([[nm,e]]);return nm};
DL.isIndex=c=>{const v=DL.data.data[c];if(/^(t|obs|id|n|trimestre|periodo|time|tiempo|indice|index)$/i.test(c))return true;return v.length>2&&v.every((x,i)=>x===v[0]+i)};
DL.guessY=C=>C.find(c=>/^(y|consumo|c|gasto|salario|wage|ventas|demanda)$/i.test(c))||C.find(c=>!DL.isIndex(c))||C[0];
DL.expr=c=>{const r=(DL.created||[]).find(x=>x[0]===c);return r?r[1]:null};
DL.isDummy=c=>{const v=DL.data.data[c].filter(isFinite);return v.length>0&&v.every(x=>x===0||x===1)};
DL.describe=function(c){const e=DL.expr(c),st=DL.stats(DL.data.data[c]);let m;
  if(e){if((m=e.match(/^obs\s*>=\s*(\d+)$/)))return`Dummy de quiebre: 0 hasta la fila ${m[1]-1} y 1 desde la fila ${m[1]}. Su coeficiente mide el cambio del intercepto.`;
    if((m=e.match(/^([A-Za-z_]\w*)\s*\*\s*([A-Za-z_]\w*)$/))&&DL.data.data[m[1]]&&DL.isDummy(m[1]))return`Interacción: vale ${m[2]} cuando ${m[1]} = 1 y 0 en otro caso. Su coeficiente mide el cambio de la pendiente de ${m[2]}.`;
    if((m=e.match(/^\(obs [+-] \d+\) % (\d+) \+ 1 == (\d+)$/)))return`Dummy ${m[1]==="4"?"del trimestre":"del mes"} ${m[2]}: 1 en ese periodo y 0 en los demás.`;
    if((m=e.match(/^log\(\s*(\w+)\s*\)$/)))return`Logaritmo natural de ${m[1]}. Con logaritmos, los coeficientes se leen en porcentajes (elasticidades).`;
    if((m=e.match(/^lag\(\s*(\w+)\s*,\s*(\d+)\s*\)$/)))return`${m[1]} de ${m[2]==="1"?"la fila anterior":m[2]+" filas atrás"} (rezago). Las primeras filas quedan vacías.`;
    if((m=e.match(/^dif\(\s*(\w+)\s*\)$/)))return`Cambio de ${m[1]} respecto a la fila anterior (primera diferencia).`;
    if(e==="obs")return"Tendencia lineal: 1, 2, 3, … Controla el crecimiento en el tiempo.";if(e==="obs^2")return"Tendencia al cuadrado: permite que el crecimiento se acelere o se frene.";
    if((m=e.match(/^(\w+)\^2$/)))return`${m[1]} al cuadrado: permite un efecto no lineal de ${m[1]}.`;
    return`Creada con «${e}».`}
  if(DL.isIndex(c))return`Número de fila (1, 2, 3, …). No es una variable económica: como X solo agrega una tendencia; no la uses como Y.`;
  if(DL.isDummy(c))return`Dummy (0/1): vale 1 en ${DL.data.data[c].filter(x=>x===1).length} de ${st.n} filas.`;
  return`Columna de la base · media ${fmt(st.m,3)} · de ${fm(st.min)} a ${fm(st.max)}${st.miss?` · ${st.miss} vacías`:""}.`};
// ---- significado de cada coeficiente
DL.interp=function(M,j){const nm=M.names[j],y=M.yName,xs=M.xNames,dum=xs.filter(x=>DL.isDummy(x)),e=DL.expr(nm);let m;
  const logY=/^ln_|^l(og)?_?/i.test(y)&&DL.expr(y)&&/^log\(/.test(DL.expr(y));
  if(nm==="(Intercepto)"){const d=dum.filter(x=>/^obs\s*>=/.test(DL.expr(x)||""));return d.length?`Valor esperado de ${y} cuando las X valen 0, en el periodo base (${d.join(", ")} = 0).`:`Valor esperado de ${y} cuando todas las X valen 0. A veces no tiene lectura económica directa.`}
  if(e&&(m=e.match(/^obs\s*>=\s*(\d+)$/)))return`Cambio del intercepto desde la fila ${m[1]}: intercepto del segundo periodo = β₁ ${M.b[j]<0?"−":"+"} ${f4(Math.abs(M.b[j]))}.`;
  if(e&&(m=e.match(/^([A-Za-z_]\w*)\s*\*\s*([A-Za-z_]\w*)$/))&&DL.data.data[m[1]]&&DL.isDummy(m[1])){const k=M.names.indexOf(m[2]);return`Cambio de la pendiente de ${m[2]} cuando ${m[1]} = 1${k>=0?`: pendiente del segundo periodo = ${f4(M.b[k])} ${M.b[j]<0?"−":"+"} ${f4(Math.abs(M.b[j]))} = ${f4(M.b[k]+M.b[j])}`:""}.`}
  if(DL.isDummy(nm))return`Diferencia promedio de ${y} cuando ${nm} = 1 frente a ${nm} = 0, con lo demás constante.`;
  const lx=e&&/^log\(/.test(e);
  if(logY&&lx)return`Elasticidad: si ${nm.replace(/^ln_/,"")} sube 1 %, ${y.replace(/^ln_/,"")} cambia ${f4(M.b[j])} %.`;
  if(logY)return`Si ${nm} sube 1 unidad, ${y.replace(/^ln_/,"")} cambia aproximadamente ${fmt(100*M.b[j],2)} %.`;
  if(lx)return`Si ${nm.replace(/^ln_/,"")} sube 1 %, ${y} cambia ${fmt(M.b[j]/100,4)} unidades.`;
  if(DL.isIndex(nm))return`Tendencia: cada fila (periodo) ${y} cambia ${f4(M.b[j])}, con lo demás constante.`;
  return`Si ${nm} aumenta 1 unidad, ${y} cambia ${f4(M.b[j])} unidades, con las demás X constantes (efecto marginal).`};
DL.FUN=["log","ln","exp","sqrt","abs","lag","dif","obs","si"];
DL.newVar=function(name,expr){const D=DL.data;name=DL.clean(name);if(!name)throw new Error("ponle un nombre a la variable.");
  const toks=expr.match(/\s+|[A-Za-z_][A-Za-z0-9_]*|\d+(?:[.,]\d+)?(?:e[+-]?\d+)?|>=|<=|==|!=|&&|\|\||[-+*/^(),<>!%]/gi);if(!toks||toks.join("")!==expr)throw new Error("la expresión tiene caracteres no permitidos.");
  let js="";for(let t=0;t<toks.length;t++){const k=toks[t];if(/^\s+$/.test(k))continue;
    if(/^[A-Za-z_]/.test(k)){if(D.data[k]){js+=`C(i,"${k}")`;continue}const lk=k.toLowerCase();
      if(lk==="lag"||lk==="dif"){const m=expr.slice(toks.slice(0,t).join("").length).match(/^(lag|dif)\s*\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*(?:,\s*(\d+))?\s*\)/i);if(!m||!D.data[m[2]])throw new Error(`${lk}() recibe el nombre de una variable, por ejemplo ${lk}(x) o lag(x, 2).`);
        const p=+(m[3]||1);js+=lk==="lag"?`C(i-${p},"${m[2]}")`:`(C(i,"${m[2]}")-C(i-${p},"${m[2]}"))`;let consumed=m[0].length,acc=0;while(acc<consumed){acc+=toks[t].length;t++}t--;continue}
      if(lk==="obs"){js+="(i+1)";continue}if(lk==="log"||lk==="ln"){js+="Math.log";continue}if(lk==="si"){js+="SI";continue}if(["exp","sqrt","abs"].includes(lk)){js+="Math."+lk;continue}
      throw new Error(`«${k}» no es una variable de la base ni una función permitida.`)}
    if(k==="^"){js+="**";continue}if(/^\d/.test(k)){js+=k.replace(",",".");continue}js+=k}
  let f;try{f=new Function("C","SI","i",`return (${js});`)}catch(e){throw new Error("la expresión está incompleta o mal escrita.")}
  const C=(i,c)=>i<0||i>=D.n?NaN:D.data[c][i],SI=(c,a,b)=>c?a:b,v=Array.from({length:D.n},(_,i)=>{const r=f(C,SI,i);return typeof r==="boolean"?(r?1:0):(isFinite(r)?r:NaN)});
  if(v.every(x=>!isFinite(x)))throw new Error("la variable nueva no tiene ningún valor válido (¿logaritmo de valores no positivos?).");
  if(!D.data[name])D.cols.push(name);D.data[name]=v;return name};
// ---------- ejemplos
DL.EJ={consumo:{t:"Ej. propuestos 3, punto 8: guerra y paz",txt:"t\tY\tX\tpaz\n1\t1\t2\t0\n2\t2\t4\t0\n3\t2\t6\t0\n4\t4\t10\t0\n5\t6\t13\t0\n6\t1\t2\t1\n7\t3\t4\t1\n8\t3\t6\t1\n9\t5\t8\t1\n10\t6\t10\t1\n11\t6\t12\t1\n12\t7\t14\t1\n13\t9\t16\t1\n14\t9\t18\t1\n15\t11\t20\t1"},
 salarios:{t:"Ej. propuestos 3, punto 5: salarios por género",txt:"sueldo\texper\tmujer\n3.14\t13\t0\n3.32\t16\t0\n3.61\t30\t0\n1.65\t2\t0\n2.64\t8\t0\n3.64\t31\t0\n2.46\t10\t0\n1.69\t1\t0\n1.91\t6\t0\n3.10\t15\t1\n1.98\t4\t1\n2.14\t7\t1\n2.61\t13\t1\n3.60\t27\t1\n3.38\t19\t1\n3.50\t25\t1\n3.65\t20\t1"},
 educacion:{t:"Ej. propuestos 3, punto 3: educación urbana y rural",txt:"anos\trenta\turbana\n16\t8\t1\n18\t13\t1\n14\t9\t1\n18\t12\t1\n12\t7\t0\n10\t3\t0\n11\t6\t0\n14\t10\t0"},
 lectura:{t:"Ej. propuestos 3, punto 7c: horas de lectura",txt:"horas\tE2\tE3\tS1\n8\t0\t0\t1\n10\t0\t0\t1\n12\t0\t0\t1\n12\t1\t0\t1\n14\t1\t0\t1\n20\t0\t1\t1\n5\t0\t0\t0\n6\t0\t0\t0\n10\t1\t0\t0\n20\t0\t1\t0"},
 familias:{t:"Dinardo 4.7: familias con aumento de ingreso",txt:"Y,X,aumento\n70,80,0\n76,95,1\n91,105,0\n100,115,0\n105,125,1\n113,135,1\n122,145,0\n120,155,0\n146,165,1\n135,175,1\n147,185,1\n155,200,1"}};

SIMS.datos=function(){
  $("sim").innerHTML=`<div class="dl-load"><p class="hint">Sube un archivo <b>.csv</b>, <b>.txt</b>, <b>.xlsx</b> o <b>.xls</b>, o pega la tabla copiada de Excel con los nombres de las variables en la primera fila. Los datos se procesan solo en tu navegador: no se suben a ningún servidor.</p>
  <div class="calcf"><label>Archivo<input type="file" id="dl-file" accept=".csv,.txt,.tsv,.xlsx,.xls"></label><label id="dl-sheetw" hidden>Hoja<select id="dl-sheet"></select></label></div>
  <details class="dp-lite"><summary>Pegar datos o cargar una base de los talleres</summary><div class="chips pre" id="dl-ej" style="margin:8px 0">${Object.entries(DL.EJ).map(([k,v])=>`<button type="button" data-k="${k}">${v.t}</button>`).join("")}</div><textarea id="dl-paste" rows="6" class="ce-ta" spellcheck="false" placeholder="Y&#9;X1&#9;X2&#10;10&#9;3&#9;1&#10;…"></textarea><div class="chips pre" style="margin-top:6px"><button type="button" class="btn" id="dl-go">Cargar lo pegado</button></div></details>
  <div id="dl-msg"></div></div><div id="dl-main"></div>`;
  let wb=null;
  const msg=h=>$("dl-msg").innerHTML=h;
  const setData=(B,name)=>{DL.data=B;DL.name=name;DL.model=null;msg(`<p class="verdict ok">Base cargada: <b>${name}</b> · ${B.n} observaciones · ${B.cols.length} variables numéricas${B.text.length?` · columnas de texto convertidas en dummies o ignoradas: ${B.text.join(", ")}`:""}.</p>`);main()};
  const readSheet=nm=>{const ws=wb.Sheets[nm],rows=XLSX.utils.sheet_to_json(ws,{header:1,raw:true,defval:""});setData(DL.fromRows(rows),DL.fileName+" · "+nm)};
  $("dl-file").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;DL.fileName=f.name;msg(`<p class="hint">Leyendo ${f.name}…</p>`);$("dl-sheetw").hidden=true;
    try{if(/\.(xlsx|xls)$/i.test(f.name)){await DL.loadXLSX();wb=XLSX.read(await f.arrayBuffer(),{type:"array"});const sh=wb.SheetNames;$("dl-sheet").innerHTML=sh.map(s=>`<option>${esc(s)}</option>`).join("");$("dl-sheetw").hidden=sh.length<2;readSheet(sh[0])}
      else setData(DL.parseText(await f.text()),f.name)}catch(err2){msg(err(err2.message))}});
  $("dl-sheet").addEventListener("change",()=>{try{readSheet($("dl-sheet").value)}catch(e2){msg(err(e2.message))}});
  $("dl-go").onclick=()=>{try{setData(DL.parseText($("dl-paste").value),"datos pegados")}catch(e2){msg(err(e2.message))}};
  const loadEJ=k=>{$("dl-paste").value=DL.EJ[k].txt;try{setData(DL.parseText(DL.EJ[k].txt),DL.EJ[k].t)}catch(e2){msg(err(e2.message))}};
  $("dl-ej").addEventListener("click",e=>{const b=e.target.closest("button");if(b)loadEJ(b.dataset.k)});
  setTimeout(()=>{const pre=window.TOOL_PRE;window.TOOL_PRE=null;if(pre&&DL.EJ[pre])loadEJ(pre)},0);

  function main(){const B=DL.data,C=B.cols;
    $("dl-main").innerHTML=`${DL.GUIA}${seg("dl-tab","Sección",[["base","1. La base"],["var","2. Crear variables"],["mod","3. Estimar"],["prue","4. Pruebas"],["dem","5. Demostraciones"],["graf","6. Gráficos"],["r","7. Código R"]],"base")}
    <div id="dl-base"></div><div id="dl-var" hidden></div><div id="dl-mod" hidden></div><div id="dl-prue" hidden></div><div id="dl-dem" hidden></div><div id="dl-graf" hidden></div><div id="dl-r" hidden></div>`;
    const tabs=["base","var","mod","prue","dem","graf","r"];let cur="base";
    bindSeg("dl-tab",v=>{cur=v;tabs.forEach(t=>$("dl-"+t).hidden=t!==v);render(v)});
    const sel=(id,lab,opts,v)=>`<label>${lab}<select id="${id}">${opts.map(o=>`<option value="${o}" ${o===v?"selected":""}>${o}</option>`).join("")}</select></label>`;
    function needModel(){if(!DL.model){return`<p class="warn"><b>Primero estima un modelo</b> en la sección 3.</p>`}return""}
    function render(v){
      if(v==="base"){const st=C.map(c=>[c,DL.stats(B.data[c])]);
        $("dl-base").innerHTML=`<h4 class="subh">Primeras filas</h4><div class="tbl"><table><tr><th>#</th>${C.map(c=>`<th class="num">${c}</th>`).join("")}</tr>${Array.from({length:Math.min(8,B.n)},(_,i)=>`<tr><td>${i+1}</td>${C.map(c=>`<td class="num">${isFinite(B.data[c][i])?fm(B.data[c][i]):"NA"}</td>`).join("")}</tr>`).join("")}</table></div>
        <h4 class="subh">Estadísticas descriptivas</h4><div class="tbl"><table><tr><th>Variable</th><th class="num">n</th><th class="num">Media</th><th class="num">Desv. est.</th><th class="num">Mín.</th><th class="num">Mediana</th><th class="num">Máx.</th><th class="num">Faltantes</th></tr>${st.map(([c,s])=>`<tr><td>${c}</td><td class="num">${s.n}</td><td class="num">${f4(s.m)}</td><td class="num">${f4(s.s)}</td><td class="num">${fm(s.min)}</td><td class="num">${fm(s.med)}</td><td class="num">${fm(s.max)}</td><td class="num">${s.miss}</td></tr>`).join("")}</table></div>
        ${C.length<=12?`<h4 class="subh">Matriz de correlaciones</h4><div class="tbl"><table><tr><th></th>${C.map(c=>`<th class="num">${c}</th>`).join("")}</tr>${C.map(a=>`<tr><td>${a}</td>${C.map(b=>{const ok=B.data[a].map((v,i)=>isFinite(v)&&isFinite(B.data[b][i])?i:-1).filter(i=>i>=0),x=ok.map(i=>B.data[a][i]),y=ok.map(i=>B.data[b][i]),mx=x.reduce((s,v)=>s+v,0)/x.length,my=y.reduce((s,v)=>s+v,0)/y.length;let sxy=0,sxx=0,syy=0;x.forEach((v,i)=>{sxy+=(v-mx)*(y[i]-my);sxx+=(v-mx)**2;syy+=(y[i]-my)**2});return`<td class="num">${fmt(sxy/Math.sqrt(sxx*syy),3)}</td>`}).join("")}</tr>`).join("")}</table></div>`:""}`}
      if(v==="var"){$("dl-var").innerHTML=DL.recetasHTML(C)+`<h4 class="subh">O escribe tu propia expresión</h4>
        <div class="calcf">${txt("dv-n","Nombre","lny")}${txt("dv-e","Expresión",`log(${C[0]})`)}</div><div class="chips pre" style="margin:6px 0"><button type="button" class="btn" id="dv-go">Crear variable</button></div><div id="dv-out"></div>
        <details class="dp-lite"><summary>Qué se puede escribir</summary><div class="tbl"><table><tr><th>Escribe</th><th>Obtienes</th></tr><tr><td><code>log(x)</code></td><td>logaritmo natural</td></tr><tr><td><code>x^2</code>, <code>x*z</code></td><td>cuadrado e interacción</td></tr><tr><td><code>lag(x)</code>, <code>lag(x, 4)</code>, <code>dif(x)</code></td><td>rezago y primera diferencia</td></tr><tr><td><code>obs</code></td><td>número de la observación (tendencia)</td></tr><tr><td><code>obs &gt;= 13</code></td><td>dummy de quiebre: 1 desde la observación 13</td></tr><tr><td><code>(x &gt; 100)*1</code>, <code>si(x &gt; 100, 1, 0)</code></td><td>dummy por condición</td></tr><tr><td><code>D*x</code></td><td>interacción de una dummy con x (cambio de pendiente)</td></tr><tr><td><code>(obs - 1) % 4 + 1 == 2</code></td><td>dummy del segundo trimestre (si la base empieza en el primero)</td></tr></table></div></details>
        <p class="hint">Las variables creadas viven mientras la página esté abierta; el código R de la sección 7 las vuelve a crear.</p>`;
        DL.recetasBind(C,()=>render("var"));
        $("dv-go").onclick=()=>{try{const nm=DL.mk($("dv-n").value,$("dv-e").value),s2=DL.stats(B.data[nm]);$("dv-out").innerHTML=`<p class="verdict ok">Variable <b>${nm}</b> creada: ${s2.n} valores válidos, media ${f4(s2.m)}. En R: <code>datos$${nm} &lt;- ${DL.rExpr($("dv-e").value)}</code></p>`}catch(e2){$("dv-out").innerHTML=err(e2.message)}}}
      if(v==="mod"){const M=DL.model,isIdx=c=>DL.isIndex(c),created=new Set((DL.created||[]).map(x=>x[0])),y0=M?M.yName:DL.guessY(C);
        const xs0=M?M.xNames:C.filter(c=>c!==y0&&!isIdx(c)&&!created.has(c)).slice(0,1);
        const box=c=>`<label class="dm-x vcard${isIdx(c)?" idx":""}" data-c="${c}" title="${esc(DL.describe(c))}"><input type="checkbox" value="${c}" ${xs0.includes(c)?"checked":""}><span class="vc-b"><span class="vc-n">${c}${isIdx(c)?' <span class="tag br">índice</span>':""}${created.has(c)?' <span class="tag nw">creada</span>':""}${DL.isDummy(c)?' <span class="tag">0/1</span>':""}</span><span class="vc-d">${DL.describe(c)}</span></span></label>`;
        const orig=C.filter(c=>!created.has(c)),cre=C.filter(c=>created.has(c)),hasD=cre.filter(c=>/^D(_|$)/.test(c));
        $("dl-mod").innerHTML=`<div class="stepc"><h4><span class="n">1</span>¿Qué quieres explicar? (variable dependiente Y)</h4><div class="calcf"><label>Y<select id="dm-y">${C.filter(c=>!isIdx(c)||c===y0).map(c=>`<option value="${c}" ${c===y0?"selected":""}>${c}</option>`).join("")}</select></label></div><p class="hint" id="dm-yd" style="margin:6px 0 0"></p><p class="warn" id="dm-yw" hidden></p></div>
        <div class="stepc"><h4><span class="n">2</span>¿Con qué la explicas? (variables explicativas X)</h4>
          <p class="hint" style="margin:0 0 6px">De la base</p><div class="vcards" id="dm-x">${orig.filter(c=>!isIdx(c)).map(box).join("")}</div>
          ${orig.some(isIdx)?`<details class="dp-lite" style="margin-top:8px" ${xs0.some(isIdx)?"open":""}><summary>Mostrar índices de tiempo (${orig.filter(isIdx).join(", ")}), para usarlos como tendencia</summary><p class="hint" style="margin:6px 0">Son números de fila o de periodo (1, 2, 3, …). No van en la mayoría de los modelos; márcalos solo si quieres controlar por una tendencia lineal.</p><div class="vcards">${orig.filter(isIdx).map(box).join("")}</div></details>`:""}
          ${cre.length?`<p class="hint" style="margin:10px 0 6px">Creadas por ti</p><div class="vcards" id="dm-x2">${cre.map(box).join("")}</div>`:`<p class="hint" style="margin:8px 0 0">¿Necesitas una dummy, un logaritmo o una interacción? Créala en <b>2. Crear variables</b> y aparecerá aquí.</p>`}
          ${hasD.length?`<div class="chips pre" style="margin-top:10px"><button type="button" class="btn" id="dm-dq">Modelo con dummies de quiebre: X + ${hasD.join(" + ")}</button><button type="button" class="btn" id="dm-r0">Modelo restringido: solo X</button></div>`:""}
          <p class="hint" id="dm-tw" hidden></p></div>
        <div class="stepc"><h4><span class="n">3</span>¿Con qué observaciones?</h4><div class="calcf">${num("dm-a","Desde la fila",M?M.opt.from:1,1)}${num("dm-b","Hasta la fila",M?M.opt.to:B.n,1)}</div><p class="hint" style="margin:6px 0 0">Toda la muestra es de la fila 1 a la ${B.n}. Para estimar un solo periodo (por ejemplo, antes del quiebre) cambia el rango.</p></div>
        <div class="stepc"><h4><span class="n">4</span>Opciones</h4><div class="chips"><label class="chkl"><input type="checkbox" id="dm-c" ${!M||M.opt.cte?"checked":""}> Con intercepto (β₁)</label><label class="chkl"><input type="checkbox" id="dm-r" ${M&&M.opt.rob?"checked":""}> Errores estándar robustos (HC1), si hay heterocedasticidad</label></div></div>
        <div class="eq" id="dm-eq"></div><div class="chips pre" style="margin:10px 0"><button type="button" class="btn solid" id="dm-go">Estimar por MCO</button></div><div id="dm-out"></div>`;
        const xsSel=()=>[...$("dl-mod").querySelectorAll(".dm-x input:checked")].map(i=>i.value);
        const upd=()=>{const y=$("dm-y").value;$("dl-mod").querySelectorAll(".dm-x").forEach(l=>{const me=l.dataset.c===y;l.hidden=me;if(me)l.querySelector("input").checked=false});
          $("dm-yd").textContent=DL.describe(y);const yw=$("dm-yw");yw.hidden=!isIdx(y);yw.innerHTML=`<b>${y}</b> parece un número de observación o de periodo (1, 2, 3, …). Normalmente no es lo que se quiere explicar: escoge la variable de interés (por ejemplo, el consumo).`;
          const xs=xsSel(),tw=$("dm-tw"),ti=xs.filter(isIdx);tw.hidden=!ti.length;tw.innerHTML=`Marcaste <b>${ti.join(", ")}</b>, que es un índice de tiempo: el modelo incluirá una tendencia lineal. Déjalo solo si quieres controlar por tendencia.`;
          const c=$("dm-c").checked,a=V("dm-a"),b=V("dm-b");let k=0;const terms=[...(c?["β₁"]:[]),...xs.map(x=>`β${SB((c?2:1)+(k++))}·${x}`)];
          $("dm-eq").innerHTML=`<b>Modelo:</b> ${y} = ${terms.length?terms.join(" + "):"0"} + u &nbsp; · &nbsp; filas ${fm(a)} a ${fm(b)}${xs.length?"":` <span class="hint">(marca al menos una X${c?" o deja solo el intercepto":""})</span>`}`};
        $("dl-mod").querySelectorAll("select,input").forEach(el=>el.addEventListener("input",upd));$("dl-mod").addEventListener("change",upd);
        const setX=list=>{$("dl-mod").querySelectorAll(".dm-x input").forEach(i=>i.checked=list.includes(i.value));upd()};
        const baseX=()=>xsSel().filter(x=>!created.has(x)&&!isIdx(x));
        if($("dm-dq"))$("dm-dq").onclick=()=>setX([...(baseX().length?baseX():orig.filter(c=>c!==$("dm-y").value&&!isIdx(c)).slice(0,1)),...hasD]);
        if($("dm-r0"))$("dm-r0").onclick=()=>setX(baseX().length?baseX():orig.filter(c=>c!==$("dm-y").value&&!isIdx(c)).slice(0,1));
        upd();
        const go=()=>{const y=$("dm-y").value,xs=xsSel().filter(x=>x!==y);
          try{DL.model=DL.fit(y,xs,{cte:$("dm-c").checked,rob:$("dm-r").checked,from:V("dm-a"),to:V("dm-b")});{const M2=DL.model;RC.wrap($("dm-out"),DL.out(M2)+`<p class="hint">Siguiente paso: <b>4. Pruebas</b> para contrastar hipótesis sobre este modelo.</p>`,"calcula tú esta estimación",box=>RC.mco(box,M2))}}catch(e2){DL.model=null;$("dm-out").innerHTML=err(e2.message)}};
        $("dm-go").onclick=go;if(M)$("dm-out").innerHTML=DL.out(M)}
      if(v==="prue"){const M=DL.model;if(!M){$("dl-prue").innerHTML=needModel();return}
        $("dl-prue").innerHTML=`${seg("dp-t","Prueba",[["f","F de restricciones"],["chow","Cambio estructural"],["rec","Recursivos y CUSUM"],["het","Heterocedasticidad"],["aut","Autocorrelación"],["norm","Normalidad"],["esp","Especificación"],["pron","Pronóstico"]],"f")}<div id="dp-out"></div>`;
        const show=t=>{$("dp-out").innerHTML=DL.test(M,t);if(t==="f"){const run=()=>{const sel2=[...$("dpf-c").querySelectorAll("input:checked")].map(i=>+i.value);$("dpf-o").innerHTML=DL.ftest(M,sel2)};$("dpf-c").addEventListener("change",run);run()}
          if(t==="pron"){const run=()=>{$("dpp-o").innerHTML=DL.pron(M)};$("dpp-x").addEventListener("input",run);run()}
          if(t==="chow"){const run=()=>{const by=$("dpc-by").value;$("dpc-nw").hidden=by!=="";const sN=by?{dum:by}:Math.round(V("dpc-n")),html=DL.chow(M,sN),cm=DL._chowM;if(cm&&cm.n1)RC.wrap($("dpc-o"),html,"calcula tú la prueba de Chow",box=>RC.chow(box,cm.M.X,cm.M.y,cm.n1,cm.M.names));else $("dpc-o").innerHTML=html};$("dpc-n").addEventListener("input",run);$("dpc-by").addEventListener("change",run);run()}
          if(t==="rec"){const run=()=>{$("dpr-o").innerHTML=DL.recur(M,+$("dpr-c").value)};$("dpr-c").addEventListener("change",run);run()}};
        bindSeg("dp-t",show);show("f")}
      if(v==="dem"){$("dl-dem").innerHTML=DL.model?DL.demo(DL.model):needModel();if(DL.model){const run=()=>{$("dd-fwl").innerHTML=DL.fwl(DL.model,+$("dd-x").value)};$("dd-x").addEventListener("change",run);run()}}
      if(v==="graf"){const M=DL.model;$("dl-graf").innerHTML=`<div class="calcf">${sel("dg-x","Eje X",C,M&&M.xNames[0]||C[1]||C[0])}${sel("dg-y","Eje Y",C,M?M.yName:C[0])}</div><div id="dg-o"></div>${M?`<h4 class="subh">Residuos frente a valores ajustados</h4>${DL.scatter({x:M.yh,y:M.e,xl:"Ŷ",yl:"residuo",hz:0})}<h4 class="subh">Residuos en el orden de la base</h4>${DL.scatter({x:M.rows.map(i=>i+1),y:M.e,xl:"observación",yl:"residuo",hz:0})}<h4 class="subh">Histograma de los residuos con la normal</h4>${DL.hist(M.e,"residuo")}`:needModel()}`;
        const run=()=>{const xa=$("dg-x").value,ya=$("dg-y").value,x=B.data[xa],y=B.data[ya],ok=x.map((v,i)=>isFinite(v)&&isFinite(y[i])?i:-1).filter(i=>i>=0);let line=null,txt2="";
          if(ok.length>2){const R=CE.ols(ok.map(i=>[1,x[i]]),ok.map(i=>y[i]));if(R){const lo=Math.min(...ok.map(i=>x[i])),hi=Math.max(...ok.map(i=>x[i]));line=[[lo,R.b[0]+R.b[1]*lo],[hi,R.b[0]+R.b[1]*hi]];txt2=`<p class="hint">Recta de MCO simple: ${ya} = ${f4(R.b[0])} ${R.b[1]<0?"−":"+"} ${f4(Math.abs(R.b[1]))}·${xa} · R² = ${f4(R.r2)}</p>`}}
          $("dg-o").innerHTML=DL.scatter({x,y,line,xl:xa,yl:ya})+txt2};$("dg-x").addEventListener("change",run);$("dg-y").addEventListener("change",run);run()}
      if(v==="r"){$("dl-r").innerHTML=DL.rcode();if(typeof prettyCode==="function")prettyCode($("dl-r"))}}
    render(cur)}};

DL.out=function(M){const se=M.opt.rob?M.seR:M.se,gl=M.n-M.k,tc=CE.tcrit(gl,0.05),pF=CE.fp(M.F,M.qF,gl);
  const eq=`${M.yName} = ${M.b.map((b,j)=>`${j?(b<0?"− ":"+ "):b<0?"−":""}${f4(Math.abs(b))}${M.names[j]==="(Intercepto)"?"":"·"+M.names[j]}`).join(" ")}`;
  const rows=M.b.map((b,j)=>{const t=b/se[j],p=DL.pt(t,gl);return{b,t,p,se:se[j]}});
  const brk=M.xNames.filter(x=>/^obs\s*>=\s*\d+$/.test(DL.expr(x)||""));let per="";
  if(brk.length===1&&M.opt.cte){const D=brk[0],ia=M.names.indexOf(D),parts=[0,1].map(d=>{let txt2=`${M.yName} = ${f4(M.b[0]+(d?M.b[ia]:0))}`;M.names.forEach((nm,j)=>{if(j===0||nm===D)return;const e=DL.expr(nm),mm=e&&e.match(/^([A-Za-z_]\w*)\s*\*\s*([A-Za-z_]\w*)$/);if(mm&&mm[1]===D)return;const ji=M.names.findIndex(q=>{const e2=DL.expr(q),m2=e2&&e2.match(/^([A-Za-z_]\w*)\s*\*\s*([A-Za-z_]\w*)$/);return m2&&m2[1]===D&&m2[2]===nm}),v=M.b[j]+(d&&ji>=0?M.b[ji]:0);txt2+=` ${v<0?"−":"+"} ${f4(Math.abs(v))}·${nm}`});return txt2});
    per=`<div class="link"><b>Las dos ecuaciones que salen de este modelo:</b><br>Antes del quiebre (${D} = 0): ${parts[0]}<br>Desde el quiebre (${D} = 1): ${parts[1]}</div>`}
  const sig=rows.filter((r,j)=>M.names[j]!=="(Intercepto)"&&r.p<0.05).map((_,j)=>j),sigN=M.names.filter((nm,j)=>nm!=="(Intercepto)"&&rows[j].p<0.05),noN=M.names.filter((nm,j)=>nm!=="(Intercepto)"&&rows[j].p>=0.05);
  return`<div class="eq">${eq}</div>
  <div class="tbl"><table><tr><th>Variable</th><th class="num" title="Estimación MCO del coeficiente">Coeficiente</th><th class="num" title="Precisión de la estimación: cuanto menor, más precisa">Error est.${M.opt.rob?" (robusto)":""}</th><th class="num" title="t = coeficiente / error estándar. Si |t| > ${f4(tc)}, es significativo al 5 %">t</th><th class="num" title="Probabilidad de obtener un t así de grande si el coeficiente verdadero fuera 0">p-valor</th><th class="num" title="Rango de valores plausibles para el coeficiente con 95 % de confianza">IC 95 %</th><th>Qué significa</th></tr>
  ${rows.map((r,j)=>`<tr><td><b>${M.names[j]}</b></td><td class="num">${f4(r.b)}</td><td class="num">${f4(r.se)}</td><td class="num">${fmt(r.t,3)}</td><td class="num">${p4(r.p)}${r.p<0.01?" ***":r.p<0.05?" **":r.p<0.1?" *":""}</td><td class="num">[${f4(r.b-tc*r.se)}; ${f4(r.b+tc*r.se)}]</td><td class="dl-mean">${DL.interp(M,j)} <span class="${r.p<0.05?"dl-si":"dl-no"}">${r.p<0.05?"Significativo al 5 %.":"No significativo al 5 %."}</span></td></tr>`).join("")}</table></div>
  ${per}
  <div class="res">${tiles([["n · observaciones",String(M.n)],["k · parámetros",String(M.k)],["R²",f4(M.r2)],["R² ajustado",f4(M.r2a)],["s · error est. de la regresión",f4(Math.sqrt(M.s2))],["SCR · suma de cuadrados de residuos",f4(M.rss)],[`F global (${M.qF}, ${gl})`,isFinite(M.F)?`${f4(M.F)} · p ${p4(pF)}`:"—"],["AIC / BIC",`${fmt(M.aic,2)} / ${fmt(M.bic,2)}`]])}</div>
  <div class="stepc"><h4>Lectura de los resultados</h4><ul>
   <li><b>Ajuste:</b> el modelo explica el ${fmt(100*M.r2,1)} % de la variación de ${M.yName} (R²)${M.k>2?`; ajustado por el número de variables, ${fmt(100*M.r2a,1)} %`:""}.</li>
   ${isFinite(M.F)?`<li><b>Significancia conjunta:</b> F = ${f4(M.F)} con p ${p4(pF)}: ${pF<0.05?"las X, en conjunto, sí explican a "+M.yName+" (se rechaza que todas las pendientes sean 0).":"no hay evidencia de que las X, en conjunto, expliquen a "+M.yName+"."}</li>`:""}
   <li><b>Individualmente:</b> ${sigN.length?`son significativas al 5 % ${sigN.join(", ")}`:"ninguna X es significativa al 5 %"}${noN.length?`; no lo son ${noN.join(", ")}`:""}.</li>
   <li><b>Error típico:</b> en promedio, los valores observados de ${M.yName} se alejan unos ${f4(Math.sqrt(M.s2))} de la recta estimada (s).</li>
   <li><b>SCR = ${f4(M.rss)}:</b> es el número que usan las pruebas F y de Chow (restringido frente a no restringido).</li></ul></div>
  <details class="dp-lite"><summary>¿Qué es cada número?</summary><div class="tbl"><table>
   <tr><td><b>Coeficiente</b></td><td>Estimación por MCO del efecto de cada variable; la columna «Qué significa» lo traduce.</td></tr>
   <tr><td><b>Error estándar</b></td><td>Cuánto variaría el coeficiente de una muestra a otra. Se usa para la prueba t y el intervalo.</td></tr>
   <tr><td><b>t y p-valor</b></td><td>Prueba H₀: coeficiente = 0. Si p &lt; 0,05 (o |t| &gt; ${f4(tc)} con ${gl} gl), la variable es significativa al 5 %. *** p &lt; 0,01 · ** p &lt; 0,05 · * p &lt; 0,1.</td></tr>
   <tr><td><b>IC 95 %</b></td><td>Valores plausibles del coeficiente; si no incluye el 0, es significativo al 5 %.</td></tr>
   <tr><td><b>R² y R² ajustado</b></td><td>Proporción de la variación de Y que explica el modelo; el ajustado penaliza agregar variables.${M.opt.cte?"":" Sin intercepto el R² se calcula sin centrar."}</td></tr>
   <tr><td><b>F global</b></td><td>Prueba que todas las pendientes son 0 a la vez.</td></tr>
   <tr><td><b>s y SCR</b></td><td>Tamaño típico de los residuos y su suma de cuadrados (base de las pruebas de restricciones).</td></tr>
   <tr><td><b>AIC / BIC</b></td><td>Para comparar modelos con la misma Y: menor es mejor.</td></tr></table></div></details>
  ${M.k<=6?`<details class="dp-lite"><summary>Ver las matrices: X′X, X′y y (X′X)⁻¹</summary>${[["X′X",M.XtX],["(X′X)⁻¹",M.I]].map(([t,A])=>`<p><b>${t}</b> (filas y columnas en el orden ${M.names.join(", ")})</p><div class="tbl"><table>${A.map(r=>`<tr>${r.map(v=>`<td class="num">${fmt(v,6)}</td>`).join("")}</tr>`).join("")}</table></div>`).join("")}<p><b>X′y</b> = [${M.Xty.map(v=>fmt(v,4)).join("; ")}] → b = (X′X)⁻¹X′y = [${M.b.map(f4).join("; ")}]</p></details>`:""}`};
DL.test=function(M,t){const ix=M.names.map((n,j)=>[n,j]);
  if(t==="f")return`<p>Marca los coeficientes que quieres probar conjuntamente iguales a cero (H₀: todos = 0).</p><div class="chips" id="dpf-c">${ix.map(([n,j])=>`<label class="chkl"><input type="checkbox" value="${j}" ${n!=="(Intercepto)"?"checked":""}> ${n}</label>`).join("")}</div><div id="dpf-o"></div>`;
  if(t==="rec")return`<p>Se estima el modelo con las primeras t observaciones, para t = k + 1, …, n, y se predice la siguiente. Si la estructura es estable, los coeficientes se mantienen dentro de su banda y los errores de predicción dentro de ±2 desviaciones.</p><div class="calcf"><label>Coeficiente a seguir<select id="dpr-c">${M.names.map((nm,j)=>`<option value="${j}" ${j===(M.opt.cte&&M.k>1?1:0)?"selected":""}>${nm}</option>`).join("")}</select></label></div><div id="dpr-o"></div>`;
  if(t==="chow"){const dums=DL.data.cols.filter(c=>DL.isDummy(c)&&!DL.isBreakVar(c));
    return`<div class="calcf"><label>Cómo se separan los dos periodos o grupos<select id="dpc-by"><option value="">Por fila: un periodo antes y otro después</option>${dums.map(c=>`<option value="${c}">Por la variable ${c} (0 = grupo 1, 1 = grupo 2)</option>`).join("")}</select></label><span id="dpc-nw">${num("dpc-n","El segundo periodo empieza en la fila (observación del modelo)",Math.floor(M.n/2)+1,1)}</span></div><div id="dpc-o"></div>`}
  if(t==="pron")return`<p>Valor esperado de ${M.yName} para unos valores dados de las X, con intervalos del 95 %. Para la media: ŷ₀ ± t·s·√(x₀′(X′X)⁻¹x₀). Para una observación individual: ŷ₀ ± t·s·√(1 + x₀′(X′X)⁻¹x₀). Los valores iniciales son las medias de la muestra.</p><div class="calcf" id="dpp-x">${M.names.map((nm,j)=>nm==="(Intercepto)"?"":num("dpp-"+j,nm,+(M.X.reduce((a,r)=>a+r[j],0)/M.n).toFixed(4))).join("")}</div><div id="dpp-o"></div>`;
  const n=M.n,k=M.k,e=M.e,a=0.05;
  if(t==="het"){const e2=e.map(v=>v*v),Z=M.X,Rb=CE.ols(Z,e2),bp=n*Rb.r2,qb=k-(M.opt.cte?1:0);
    const xs=M.X.map(r=>r.slice(M.opt.cte?1:0)),m=xs[0].length;let wh="";if(m>=1&&m<=4){const pairs=[];for(let i=0;i<m;i++)for(let j=i;j<m;j++){const col=xs.map(r=>r[i]*r[j]);if(!(i===j&&xs.every((r,q)=>Math.abs(col[q]-r[i])<1e-12)))pairs.push(col)}const W2=xs.map((r,q)=>[1,...r,...pairs.map(c=>c[q])]),Rw=CE.ols(W2,e2);if(Rw){const qw=W2[0].length-1,lm=n*Rw.r2;wh=`<tr><td>White (niveles, cuadrados y productos cruzados)</td><td class="num">${f4(lm)}</td><td class="num">χ²(${qw}) = ${f4(CE.ccrit(qw,a))}</td><td class="num">${p4(1-chi2cdf(lm,qw))}</td></tr>`}}
    return`<p>H₀: varianza constante (homocedasticidad). Se regresa e² sobre las variables y LM = n·R² de esa regresión auxiliar.</p><div class="tbl"><table><tr><th>Prueba</th><th>LM</th><th>Crítico al 5 %</th><th>p-valor</th></tr><tr><td>Breusch-Pagan (sobre las X del modelo)</td><td class="num">${f4(bp)}</td><td class="num">χ²(${qb}) = ${f4(CE.ccrit(qb,a))}</td><td class="num">${p4(1-chi2cdf(bp,qb))}</td></tr>${wh}</table></div><p>Si se rechaza H₀, los errores estándar de MCO no son válidos: usa errores robustos (HC1) en la sección 3.</p>`}
  if(t==="aut"){let num2=0;for(let i=1;i<n;i++)num2+=(e[i]-e[i-1])**2;const dw=num2/M.rss,X1=M.X.map((r,i)=>[...r,i?e[i-1]:0]),Rg=CE.ols(X1,e),bg=Rg?n*Rg.r2:NaN;
    return`<p>Tiene sentido con datos ordenados en el tiempo. H₀: no hay autocorrelación de orden 1.</p><div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Lectura</th></tr><tr><td>Durbin-Watson</td><td class="num">${f4(dw)}</td><td>${dw<1.5?"Cerca de 0: autocorrelación positiva probable":dw>2.5?"Cerca de 4: autocorrelación negativa probable":"Cerca de 2: sin evidencia fuerte"} (compara con d<sub>L</sub> y d<sub>U</sub> de la tabla para n = ${n} y k′ = ${k-(M.opt.cte?1:0)})</td></tr><tr><td>Breusch-Godfrey (orden 1)</td><td class="num">LM = ${f4(bg)}</td><td>χ²(1) = 3,8415 · p = ${p4(1-chi2cdf(bg,1))}</td></tr></table></div><p>ρ̂ ≈ 1 − DW/2 = ${f4(1-dw/2)}.</p>`}
  if(t==="norm"){const m3=e.reduce((s,v)=>s+v**3,0)/n,m2=M.rss/n,m4=e.reduce((s,v)=>s+v**4,0)/n,S=m3/m2**1.5,K=m4/m2**2,jb=n/6*(S*S+(K-3)**2/4);
    return`<p>H₀: los errores son normales. JB = n/6·[S² + (K − 3)²/4].</p><div class="res">${tiles([["Asimetría S",f4(S)],["Curtosis K",f4(K)],["Jarque-Bera",f4(jb)],["p-valor",p4(1-chi2cdf(jb,2))]])}</div><p>${jb>5.991?"Se rechaza la normalidad al 5 %: con muestras pequeñas, las pruebas t y F son solo aproximadas.":"No se rechaza la normalidad al 5 %."}</p>${DL.hist(e,"residuo")}`}
  if(t==="esp"){const X2=M.X.map((r,i)=>[...r,M.yh[i]**2,M.yh[i]**3]),R2=CE.ols(X2,M.y);let reset="";if(R2){const F=((M.rss-R2.rss)/2)/(R2.rss/(n-k-2));reset=`<tr><td>RESET de Ramsey (Ŷ² y Ŷ³)</td><td class="num">F = ${f4(F)}</td><td class="num">F(2, ${n-k-2}) = ${f4(CE.fcrit(2,n-k-2,a))} · p = ${p4(CE.fp(F,2,n-k-2))}</td></tr>`}
    const xs=M.names.map((nm,j)=>[nm,j]).filter(([nm])=>nm!=="(Intercepto)");let vif="";if(xs.length>=2){vif=xs.map(([nm,j])=>{const others=M.X.map(r=>r.filter((_,q)=>q!==j)),Rv=CE.ols(others.map(r=>M.opt.cte?r:[1,...r]),M.X.map(r=>r[j]));const v=Rv?1/(1-Rv.r2):NaN;return`<tr><td>${nm}</td><td class="num">${fmt(v,3)}</td><td>${v>10?"Multicolinealidad alta":v>5?"Moderada":"Baja"}</td></tr>`}).join("")}
    return`<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Crítico y p</th></tr>${reset}</table></div><p>H₀ de RESET: la forma funcional es correcta. Si se rechaza, prueba logaritmos, cuadrados o interacciones.</p>${vif?`<h4 class="subh">Factor de inflación de la varianza (VIF)</h4><div class="tbl"><table><tr><th>Variable</th><th>VIF</th><th>Lectura</th></tr>${vif}</table></div>`:""}`}
  return""};
DL.ftest=function(M,sel){if(!sel.length)return`<p class="hint">Marca al menos un coeficiente.</p>`;const keep=M.names.map((_,j)=>j).filter(j=>!sel.includes(j)),q=sel.length,n=M.n,k=M.k,a=0.05;
  const Xr=M.X.map(r=>keep.map(j=>r[j])),rssR=keep.length?CE.ols(Xr,M.y).rss:M.y.reduce((s,v)=>s+v*v,0),F=((rssR-M.rss)/q)/(M.rss/(n-k)),cr=CE.fcrit(q,n-k,a),p=CE.fp(F,q,n-k);
  const Rm=sel.map(j=>M.names.map((_,c)=>c===j?1:0)),Rb=sel.map(j=>M.b[j]),Vu=CE.inv(CE.mm(CE.mm(Rm,M.opt.rob?M.Vr.map(r=>r.map(v=>v/M.s2)):M.I),CE.T(Rm))),Fw=Rb.reduce((s,v,i)=>s+v*Vu[i].reduce((t,mm,j)=>t+mm*Rb[j],0),0)/(q*M.s2);
  const W=n*(rssR-M.rss)/M.rss,LR=n*Math.log(rssR/M.rss),LM=n*(rssR-M.rss)/rssR;
  return`<div class="eq">H₀: ${sel.map(j=>`β(${M.names[j]})`).join(" = ")} = 0</div><div class="eq al chain">F = [(SCR_R − SCR_NR)/q] / [SCR_NR/(n − k)] = [(${f4(rssR)} − ${f4(M.rss)})/${q}] / [${f4(M.rss)}/${n-k}] = <b>${f4(F)}</b><br>Forma matricial (Rb)′[R(X′X)⁻¹R′]⁻¹(Rb)/(q·s²) = ${f4(Fw)}${M.opt.rob?" (con la matriz robusta)":""}</div>
  <div class="res">${tiles([["F",f4(F)],[`F crítico (${q}, ${n-k})`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["las variables marcadas no son conjuntamente significativas.","al menos una de las variables marcadas es significativa."])}
  <p>Asintóticas: W = ${f4(W)}, LR = ${f4(LR)}, LM = ${f4(LM)} frente a χ²(${q}) = ${f4(CE.ccrit(q,a))}.</p>`};
DL.isBreakVar=x=>{const e=DL.expr(x)||"";if(/^obs\s*>=\s*\d+$/.test(e))return true;const m=e.match(/^([A-Za-z_]\w*)\s*\*\s*([A-Za-z_]\w*)$/);return!!(m&&/^obs\s*>=\s*\d+$/.test(DL.expr(m[1])||""))};
DL.pron=function(M){const x0=M.names.map((nm,j)=>nm==="(Intercepto)"?1:V("dpp-"+j));if(x0.some(v=>!isFinite(v)))return err("escribe un valor para cada X.");
  const yh=x0.reduce((a,v,j)=>a+v*M.b[j],0),h=x0.reduce((a,v,i)=>a+v*M.I[i].reduce((u,mm,j)=>u+mm*x0[j],0),0),gl=M.n-M.k,tc=CE.tcrit(gl,0.05),sm=Math.sqrt(M.s2*h),si=Math.sqrt(M.s2*(1+h));
  return`<div class="eq al chain">ŷ₀ = x₀′b = ${M.names.map((nm,j)=>`${f4(M.b[j])}·${fm(x0[j])}`).join(" + ")} = <b>${f4(yh)}</b><br>x₀′(X′X)⁻¹x₀ = ${f4(h)} &nbsp; s² = ${f4(M.s2)} &nbsp; t<sub>0,025</sub>(${gl}) = ${f4(tc)}<br>ee(media) = √(s²·${f4(h)}) = ${f4(sm)} &nbsp; ee(individual) = √(s²·(1 + ${f4(h)})) = ${f4(si)}</div>
  <div class="tbl"><table><tr><th>Intervalo del 95 %</th><th class="num">Inferior</th><th class="num">Superior</th></tr><tr><td>Para la media E(${M.yName} | x₀)</td><td class="num">${f4(yh-tc*sm)}</td><td class="num">${f4(yh+tc*sm)}</td></tr><tr><td>Para una observación individual</td><td class="num">${f4(yh-tc*si)}</td><td class="num">${f4(yh+tc*si)}</td></tr></table></div>${M.opt.rob?'<p class="hint">Los intervalos usan s²(X′X)⁻¹, la fórmula del curso, aunque marcaste errores robustos.</p>':""}`};
DL.chow=function(M0,s){let M=M0,note="",col=null,gname="";
  if(s&&typeof s==="object"){gname=s.dum;col=DL.data.data[gname];if(!col)return err(`no encuentro la variable ${gname}.`);const g=M0.rows.map(r=>col[r]);if(g.some(v=>v!==0&&v!==1))return err(`${gname} debe valer 0 o 1 en todas las observaciones del modelo.`);s=g.filter(v=>v===0).length+1}
  const P=Mx=>{if(!col)return Mx;const g=Mx.rows.map(r=>col[r]),idx=g.map((_,i)=>i).sort((a,b)=>g[a]-g[b]||a-b),pk=v=>v&&idx.map(i=>v[i]);return Object.assign({},Mx,{X:pk(Mx.X),y:pk(Mx.y),rows:pk(Mx.rows),e:pk(Mx.e),yh:pk(Mx.yh)})};
  M=P(M0);const MP=M;
  if(M0.opt.cte&&s>1&&s<=M0.n){const n1=s-1,drop=M0.xNames.filter((x,q)=>{const j=M0.names.indexOf(x),c1=MP.X.slice(0,n1).map(r=>r[j]),c2=MP.X.slice(n1).map(r=>r[j]),cst=v=>v.length>0&&v.every(z=>Math.abs(z-v[0])<1e-12);return DL.isBreakVar(x)||cst(c1)||cst(c2)});
    if(drop.length){const keep=M0.xNames.filter(x=>!drop.includes(x));if(!keep.length)return err(`al quitar ${drop.join(", ")} no queda ninguna X para la prueba.`);
      try{M=P(DL.fit(M0.yName,keep,M0.opt))}catch(e){return err(e.message)}
      note=`<p class="warn"><b>Se quitó ${drop.join(" y ")} para esta prueba.</b> ${drop.length>1?"Son variables":"Es una variable"} constante${drop.length>1?"s":""} dentro de alguno de los dos periodos (como la dummy de quiebre y su interacción, que valen 0 antes del quiebre). La prueba de Chow parte del modelo sin dummies (${M.yName} ~ ${keep.join(" + ")}) y ella misma construye el modelo con dummies en el paso 2. Tu modelo con ${drop.join(" y ")} es justamente el no restringido: su F de restricciones sobre ${drop.join(" y ")} da el mismo resultado que el paso 3.</p>`}}
  DL._chowM=null;const n=M.n,k=M.k,a=0.05;if(!(s>k+1&&s<=n-k)){return err(`el quiebre debe dejar más de ${k} observaciones en cada periodo (entre ${k+2} y ${n-k}).`)}
  if(!M.opt.cte)return err("para la prueba de Chow estima el modelo con intercepto.");
  DL._chowM={M,n1:s-1};const n1=s-1,n2=n-n1,X1=M.X.slice(0,n1),X2=M.X.slice(n1),y1=M.y.slice(0,n1),y2=M.y.slice(n1),R1=CE.ols(X1,y1),R2=CE.ols(X2,y2);if(!R1||!R2)return err("alguno de los periodos tiene X′X no invertible (por ejemplo, una dummy constante dentro del periodo). Quita esa variable del modelo para esta prueba.");
  const xn=M.names.slice(1),D=M.y.map((_,i)=>i>=n1?1:0),XU=M.X.map((r,i)=>[...r,...r.map(v=>v*D[i])]),RU=CE.ols(XU,M.y),rssNR=R1.rss+R2.rss;
  const F=((M.rss-rssNR)/k)/(rssNR/(n-2*k)),cr=CE.fcrit(k,n-2*k,a),p=CE.fp(F,k,n-2*k);
  const r2R=M.r2,r2U=RU?1-RU.rss/M.tss:NaN,Fr2=((r2U-r2R)/k)/((1-r2U)/(n-2*k));
  let Fw=NaN;if(RU){const Rm=Array.from({length:k},(_,i)=>Array.from({length:2*k},(_,j)=>j===k+i?1:0)),Rb=CE.mv(Rm,RU.b),Mi=CE.inv(CE.mm(CE.mm(Rm,RU.I),CE.T(Rm)));Fw=Rb.reduce((s2,v,i)=>s2+v*Mi[i].reduce((t,mm,j)=>t+mm*Rb[j],0),0)/(k*RU.s2)}
  const Fp=((M.rss-R1.rss)/n2)/(R1.rss/(n1-k)),crp=CE.fcrit(n2,n1-k,a),pp=CE.fp(Fp,n2,n1-k),dd=y2.map((v,i)=>v-X2[i].reduce((s2,x,j)=>s2+x*R1.b[j],0));
  const Vd=X2.map((r,i)=>X2.map((r2,j)=>(i===j?1:0)+r.reduce((s2,v,q)=>s2+v*R1.I[q].reduce((t,mm,w)=>t+mm*r2[w],0),0))),Vi=CE.inv(Vd),Fd=Vi?dd.reduce((s2,v,i)=>s2+v*Vi[i].reduce((t,mm,j)=>t+mm*dd[j],0),0)/(n2*R1.s2):NaN;
  const ok=RU&&RU.b.slice(0,k).every((b,j)=>Math.abs(b-R1.b[j])<1e-6*Math.max(1,Math.abs(b)))&&RU.b.slice(k).every((d,j)=>Math.abs(RU.b[j]+d-R2.b[j])<1e-6*Math.max(1,Math.abs(R2.b[j])));
  const sub=(idx,lab)=>{const Xr=XU.map(r=>r.filter((_,j)=>!idx.includes(j))),Rr=CE.ols(Xr,M.y);if(!Rr)return"";const qq=idx.length,FF=((Rr.rss-RU.rss)/qq)/(RU.rss/(n-2*k)),cc=CE.fcrit(qq,n-2*k,a),pq=CE.fp(FF,qq,n-2*k);return`<tr><td>${lab}</td><td class="num">${qq}</td><td class="num">${f4(FF)}</td><td class="num">${f4(cc)}</td><td class="num">${p4(pq)}</td><td>${FF>cc?"Rechaza":"No rechaza"}</td></tr>`};
  return`${note}${col?`<p>Grupo 1 (${gname} = 0): ${n1} observaciones (filas ${M.rows.slice(0,n1).map(r=>r+1).join(", ")}). Grupo 2 (${gname} = 1): ${n2} observaciones (filas ${M.rows.slice(n1).map(r=>r+1).join(", ")}). Se reordenan para que el grupo 1 quede primero; en las tablas, «periodo» quiere decir «grupo».</p>`:`<p>Periodo 1: observaciones 1 a ${n1} del modelo (filas ${M.rows[0]+1} a ${M.rows[n1-1]+1} de la base). Periodo 2: ${n2} observaciones (filas ${M.rows[n1]+1} a ${M.rows[n-1]+1}).</p>`}
  ${stp(1,"Las tres regresiones",`<div class="tbl"><table><tr><th>Modelo</th><th>n</th><th>Coeficientes (${M.names.join(", ")})</th><th class="num">SCR</th></tr><tr><td>Restringido: toda la muestra</td><td>${n}</td><td>${M.b.map(f4).join("; ")}</td><td class="num">${f4(M.rss)}</td></tr><tr><td>Periodo 1</td><td>${n1}</td><td>${R1.b.map(f4).join("; ")}</td><td class="num">${f4(R1.rss)}</td></tr><tr><td>Periodo 2</td><td>${n2}</td><td>${R2.b.map(f4).join("; ")}</td><td class="num">${f4(R2.rss)}</td></tr></table></div>`)}
  ${RU?stp(2,"Modelo no restringido con dummies y verificación (ecuaciones 27 y 28)",`<div class="eq">${M.yName} = β₁ + δ₁D + ${xn.map((x,j)=>`β${SB(j+2)}${x} + δ${SB(j+2)}D·${x}`).join(" + ")} + u, &nbsp; ${col?`D = ${gname}`:`D = 1 desde la fila ${M.rows[n1]+1}`}</div>
    <div class="tbl"><table><tr><th>Coeficiente</th><th class="num">Estimación</th><th>Comprobación</th></tr>${M.names.map((nm,j)=>`<tr><td>β${SB(j+1)} (${nm})</td><td class="num">${f4(RU.b[j])}</td><td>= periodo 1: ${f4(R1.b[j])}</td></tr>`).join("")}${M.names.map((nm,j)=>`<tr><td>δ${SB(j+1)} (D${j?"·"+nm:""})</td><td class="num">${f4(RU.b[k+j])}</td><td>β + δ = ${f4(RU.b[j]+RU.b[k+j])} = periodo 2: ${f4(R2.b[j])}</td></tr>`).join("")}</table></div>
    <p class="link"><b>${ok?"Se verifica":"Revisa"}:</b> estimar el modelo con dummies equivale a estimar cada periodo por separado (27), y SCR<sub>NR</sub> = ${f4(RU.rss)} = SCR₁ + SCR₂ = ${f4(R1.rss)} + ${f4(R2.rss)} = ${f4(rssNR)} (28).</p>`):""}
  ${stp(3,"Prueba de cambio estructural: todas las alternativas",`<div class="eq">H₀: δ₁ = ${xn.map((_,j)=>"δ"+SB(j+2)).join(" = ")} = 0 (la función es la misma en los dos periodos)</div><div class="tbl"><table><tr><th>Alternativa</th><th>Cálculo</th><th class="num">F</th></tr>
    <tr><td>a) Con las SCR (Chow)</td><td>[(SCR_R − SCR₁ − SCR₂)/k] / [(SCR₁ + SCR₂)/(n − 2k)] = [(${f4(M.rss)} − ${f4(rssNR)})/${k}] / [${f4(rssNR)}/${n-2*k}]</td><td class="num">${f4(F)}</td></tr>
    <tr><td>b) Con los R²</td><td>[(R²_NR − R²_R)/k] / [(1 − R²_NR)/(n − 2k)] = [(${f4(r2U)} − ${f4(r2R)})/${k}] / [(1 − ${f4(r2U)})/${n-2*k}]</td><td class="num">${f4(Fr2)}</td></tr>
    <tr><td>c) Con dummies</td><td>F conjunta de δ₁ = … = δ${SB(k)} = 0 en el modelo no restringido</td><td class="num">${f4(RU?((M.rss-RU.rss)/k)/(RU.rss/(n-2*k)):NaN)}</td></tr>
    <tr><td>d) Wald matricial</td><td>(Rb − r)′[R(X′X)⁻¹R′]⁻¹(Rb − r)/(k·s²), con R = [0 | I<sub>${k}</sub>] y r = 0</td><td class="num">${f4(Fw)}</td></tr></table></div>
    <div class="res">${tiles([["F",f4(F)],[`F crítico (${k}, ${n-2*k}) al 5 %`,f4(cr)],["p-valor",p4(p)]])}</div>${veredicto(F,cr,p,a,["no hay evidencia de cambio estructural en ese punto: una sola función describe los dos periodos.","hay cambio estructural: la función no es la misma en los dos periodos."])}
    ${RU?`<h4 class="subh">¿Dónde está el cambio?</h4><div class="tbl"><table><tr><th>H₀</th><th class="num">q</th><th class="num">F</th><th class="num">F crítico</th><th class="num">p</th><th>Decisión</th></tr>${sub([k],"Solo cambia el intercepto (δ₁ = 0)")}${k>1?sub(xn.map((_,j)=>k+1+j),"Solo cambian las pendientes ("+xn.map((_,j)=>"δ"+SB(j+2)).join(" = ")+" = 0)"):""}</table></div>`:""}`)}
  ${stp(4,"Prueba de pronósticos de Chow (ecuaciones 8 y 9)",`<p>Se estima con el periodo 1 y se pronostica el periodo 2 con esos coeficientes.</p><div class="eq al chain">(8) F = [(SCR_R − SCR₁)/n₂] / [SCR₁/(n₁ − k)] = [(${f4(M.rss)} − ${f4(R1.rss)})/${n2}] / [${f4(R1.rss)}/${n1-k}] = <b>${f4(Fp)}</b><br>(9) F = d′[I + X₂(X₁′X₁)⁻¹X₂′]⁻¹d / (n₂·s₁²) = <b>${f4(Fd)}</b>, con d = y₂ − X₂b₁</div>
    <div class="tbl"><table><tr><th>Fila</th><th class="num">${M.yName} observado</th><th class="num">Pronóstico con b₁</th><th class="num">Error d</th></tr>${dd.map((v,i)=>`<tr><td>${M.rows[n1+i]+1}</td><td class="num">${f4(y2[i])}</td><td class="num">${f4(y2[i]-v)}</td><td class="num">${f4(v)}</td></tr>`).join("")}</table></div>
    <div class="res">${tiles([["F",f4(Fp)],[`F crítico (${n2}, ${n1-k})`,f4(crp)],["p-valor",p4(pp)]])}</div>${veredicto(Fp,crp,pp,a,["el modelo del periodo 1 pronostica bien el periodo 2: no hay evidencia de cambio.","el modelo del periodo 1 no pronostica bien el periodo 2: hay evidencia de cambio estructural."])}`)}`};
DL.recur=function(M0,cj){let M=M0,note="";const drop=M0.xNames.filter(DL.isBreakVar);
  if(drop.length){const keep=M0.xNames.filter(x=>!drop.includes(x));try{M=DL.fit(M0.yName,keep,M0.opt)}catch(e){return err(e.message)}const nm=M0.names[cj];cj=Math.max(0,M.names.indexOf(nm));
    note=`<p class="warn"><b>Se quitó ${drop.join(" y ")}:</b> las pruebas recursivas buscan el cambio sin decirle al modelo dónde está, así que se hacen sobre el modelo sin dummies de quiebre (${M.yName} ~ ${keep.join(" + ")||"1"}).</p>`}
  return note+DL.recur0(M,cj)};
DL.recur0=function(M,cj){const n=M.n,k=M.k,X=M.X,y=M.y,ts=[],bs=[],bse=[],pe=[],peb=[],w=[];
  for(let t=k;t<n;t++){const Rt=CE.ols(X.slice(0,t),y.slice(0,t));if(!Rt)continue;const xt=X[t],f=y[t]-xt.reduce((s,v,j)=>s+v*Rt.b[j],0),h2=1+xt.reduce((s,v,i)=>s+v*Rt.I[i].reduce((u,mm,j)=>u+mm*xt[j],0),0);
    ts.push(M.rows[t]+1);w.push(f/Math.sqrt(h2));pe.push(f);peb.push(t>k?2*Math.sqrt(Rt.s2*h2):NaN);const R1=CE.ols(X.slice(0,t+1),y.slice(0,t+1));bs.push(R1?R1.b[cj]:NaN);bse.push(R1&&t+1>k?2*R1.se[cj]:NaN)}
  if(w.length<3)return err("hay muy pocas observaciones para las pruebas recursivas.");
  const T=w.length,mw=w.reduce((s,v)=>s+v,0)/T,sd=Math.sqrt(w.reduce((s,v)=>s+(v-mw)**2,0)/(T-1)),cus=[];let acc=0;w.forEach(v=>{acc+=v/sd;cus.push(acc)});
  const bU=ts.map((_,i)=>0.948*Math.sqrt(T)*(1+2*(i+1)/T)),S=w.reduce((s,v)=>s+v*v,0),css=[];let a2=0;w.forEach(v=>{a2+=v*v;css.push(a2/S)});
  const out1=cus.some((c,i)=>Math.abs(c)>bU[i]),outs=pe.map((v,i)=>isFinite(peb[i])&&Math.abs(v)>peb[i]?ts[i]:null).filter(x=>x!=null);
  const jumps=bs.map((b,i)=>i>0&&isFinite(bse[i-1])&&Math.abs(b-bs[i-1])>bse[i-1]?ts[i]:null).filter(x=>x!=null);
  return`<h4 class="subh">Coeficiente recursivo de ${M.names[cj]} con ±2 errores estándar</h4>${miniPlot({xs:ts,series:[{y:bs,c:"--line"}],band:[bs.map((b,i)=>b+bse[i]),bs.map((b,i)=>b-bse[i])],xl:"fila",yl:M.names[cj]})}
  <p>${jumps.length?`El coeficiente salta fuera de su banda anterior en las filas ${jumps.join(", ")}: al agregar esas observaciones la estimación cambia de forma notable.`:"El coeficiente se mantiene dentro de su banda: no hay saltos notables al agregar observaciones."}</p>
  <h4 class="subh">Errores de predicción un paso adelante con ±2 desviaciones</h4>${miniPlot({xs:ts,series:[{y:pe,c:"--line"}],band:[peb,peb.map(v=>-v)],xl:"fila",yl:"error",zero:1})}
  <p>${outs.length?`Se salen de la banda los errores de las filas ${outs.join(", ")}: el modelo estimado con los datos anteriores no anticipa esas observaciones.`:"Todos los errores quedan dentro de la banda."}</p>
  <h4 class="subh">CUSUM de los residuos recursivos (bandas al 5 %)</h4>${miniPlot({xs:ts,series:[{y:cus,c:"--exam"}],band:[bU,bU.map(v=>-v)],xl:"fila",yl:"CUSUM",zero:1})}
  <p>${out1?"La CUSUM cruza las bandas: hay evidencia de inestabilidad en los coeficientes.":"La CUSUM no cruza las bandas: no hay evidencia de inestabilidad con esta prueba."}</p>
  <h4 class="subh">CUSUM de cuadrados</h4>${miniPlot({xs:ts,series:[{y:css,c:"--branch"},{y:ts.map((_,i)=>(i+1)/T),c:"--muted"}],xl:"fila",yl:"CUSUMSQ"})}
  <p class="hint">La línea gris es el camino esperado si los parámetros y la varianza son estables; desviaciones grandes indican cambio en la varianza o en los coeficientes. En R: <code>recresid(m)</code> y <code>efp(…, type = "Rec-CUSUM")</code> del paquete strucchange.</p>`};
DL.demo=function(M){const n=M.n,se=M.e.reduce((s,v)=>s+v,0),Xe=M.names.map((_,j)=>M.X.reduce((s,r,i)=>s+r[j]*M.e[i],0)),ym=M.y.reduce((s,v)=>s+v,0)/n,yhm=M.yh.reduce((s,v)=>s+v,0)/n;
  const cor=(a,b)=>{const ma=a.reduce((s,v)=>s+v,0)/a.length,mb=b.reduce((s,v)=>s+v,0)/b.length;let sab=0,saa=0,sbb=0;a.forEach((v,i)=>{sab+=(v-ma)*(b[i]-mb);saa+=(v-ma)**2;sbb+=(b[i]-mb)**2});return sab/Math.sqrt(saa*sbb)};
  const sce=M.yh.reduce((s,v)=>s+(v-ym)**2,0),tss=M.y.reduce((s,v)=>s+(v-ym)**2,0),cy=cor(M.y,M.yh),ce=cor(M.yh,M.e),cte=M.opt.cte;
  const xs=M.names.map((nm,j)=>[nm,j]).filter(([nm])=>nm!=="(Intercepto)");
  return`<p class="lead">Propiedades algebraicas de MCO comprobadas con tus datos. Las diferencias del orden de 10⁻¹⁰ son errores de redondeo de la computadora: en teoría son cero.</p>
  <div class="tbl"><table><tr><th>Propiedad</th><th>Por qué se cumple</th><th>Con tus datos</th></tr>
  <tr><td>X′e = 0</td><td>Son las ecuaciones normales: X′(y − Xb) = 0</td><td class="num">${Xe.map(v=>fmt(v,10)).join("; ")}</td></tr>
  <tr><td>Σeᵢ = 0</td><td>${cte?"La primera ecuación normal, porque hay intercepto":"Sin intercepto no tiene por qué cumplirse"}</td><td class="num">${fmt(se,10)}</td></tr>
  <tr><td>Media de Ŷ = media de Y</td><td>${cte?"Porque Σe = 0":"Solo con intercepto"}</td><td class="num">${f4(yhm)} vs ${f4(ym)}</td></tr>
  <tr><td>corr(Ŷ, e) = 0</td><td>Ŷ = Xb es combinación de las X, ortogonales a e</td><td class="num">${fmt(ce,10)}</td></tr>
  <tr><td>STC = SCE + SCR</td><td>${cte?"Descomposición de la varianza con intercepto":"Solo vale con intercepto"}</td><td class="num">${f4(tss)} vs ${f4(sce)} + ${f4(M.rss)} = ${f4(sce+M.rss)}</td></tr>
  <tr><td>R² = corr(Y, Ŷ)²</td><td>${cte?"Con intercepto, R² es la correlación al cuadrado":"Solo con intercepto"}</td><td class="num">${f4(M.r2)} vs ${f4(cy*cy)}</td></tr>
  <tr><td>s² = SCR/(n − k)</td><td>Estimador insesgado de σ²</td><td class="num">${f4(M.rss)}/${n-M.k} = ${f4(M.s2)}</td></tr></table></div>
  ${xs.length>=2?`<h4 class="subh">Teorema de Frisch-Waugh-Lovell</h4><p>El coeficiente de una variable en la regresión múltiple es igual al de regresar los residuos de Y (sobre las demás X) en los residuos de esa variable (sobre las demás X).</p><div class="calcf"><label>Variable<select id="dd-x">${xs.map(([nm,j])=>`<option value="${j}">${nm}</option>`).join("")}</select></label></div><div id="dd-fwl"></div>`:`<p class="hint">Con dos o más variables explicativas aparece aquí la demostración del teorema de Frisch-Waugh-Lovell.</p><select id="dd-x" hidden><option value="0">0</option></select><div id="dd-fwl"></div>`}`};
DL.fwl=function(M,j){if(M.names.length<3||M.names[j]==="(Intercepto)")return"";const others=M.X.map(r=>r.filter((_,q)=>q!==j)),Ry=CE.ols(others,M.y),Rx=CE.ols(others,M.X.map(r=>r[j]));if(!Ry||!Rx)return"";
  const ey=Ry.e,ex=Rx.e,b=ey.reduce((s,v,i)=>s+v*ex[i],0)/ex.reduce((s,v)=>s+v*v,0);
  return`<div class="eq al chain">1) Y sobre las demás X → residuos ẽ<sub>y</sub> &nbsp; 2) ${M.names[j]} sobre las demás X → residuos ẽ<sub>x</sub><br>3) b = Σẽ<sub>x</sub>ẽ<sub>y</sub> / Σẽ<sub>x</sub>² = <b>${fmt(b,6)}</b> &nbsp; frente a la regresión múltiple: <b>${fmt(M.b[j],6)}</b></div><p>Coinciden: el coeficiente mide el efecto de ${M.names[j]} una vez «limpiado» del efecto de las demás variables. Por eso se interpreta como un efecto <i>ceteris paribus</i>.</p>`};
DL.rExpr=e=>{const r=DL.rExpr0(e);return /[<>]=?|==|!=/.test(e)&&!/^\s*si\(/.test(e)?`as.numeric(${r})`:r};
DL.rExpr0=e=>e.replace(/%/g,"%%").replace(/\bln\(/g,"log(").replace(/\bobs\b/g,"seq_len(nrow(datos))").replace(/\bsi\(/g,"ifelse(").replace(/\bdif\(\s*([A-Za-z_]\w*)\s*\)/g,"c(NA, diff(datos$$$1))").replace(/\blag\(\s*([A-Za-z_]\w*)\s*(?:,\s*(\d+))?\s*\)/g,(m,v,k)=>`dplyr::lag(datos$${v}, ${k||1})`).replace(/\b([A-Za-z_]\w*)\b(?!\s*\()/g,(m,v)=>DL.data&&DL.data.data[v]?`datos$${v}`:m).replace(/datos\$datos\$/g,"datos$");
DL.rcode=function(){const M=DL.model,f=DL.fileName||"mis_datos.csv",xl=/\.(xlsx|xls)$/i.test(f);
  const read=xl?`library(readxl)\ndatos <- read_excel("${f}")`:`datos <- read.csv("${f}")   # si usa ; y coma decimal: read.csv2("${f}")`;
  const nv=(DL.created||[]).map(([n,e])=>`datos$${n} <- ${DL.rExpr(e)}`).join("\n");
  if(!M)return`<pre class="ce-code">${esc(read)}\nnames(datos) &lt;- make.names(names(datos))\nsummary(datos)\n${esc(nv)}</pre><p class="hint">Estima un modelo en la sección 3 y aquí aparece el código completo.</p>`;
  const fx=`${M.yName} ~ ${M.xNames.length?M.xNames.join(" + "):"1"}${M.opt.cte?"":" - 1"}`,sub=(M.opt.from>1||M.opt.to<DL.data.n)?`datos <- datos[${M.opt.from}:${M.opt.to}, ]\n`:"";
  return`<p>Este script reproduce en R lo que hiciste aquí. Guárdalo junto al archivo de datos y ejecútalo en RStudio.</p><pre class="ce-code">${esc(`# Paquetes (una sola vez): install.packages(c("lmtest", "sandwich", "car", "strucchange", "tseries"${xl?', "readxl"':""}))
${read}
names(datos) <- make.names(names(datos))   # nombres sin espacios ni tildes
summary(datos)
${nv?nv+"\n":""}${sub}
m <- lm(${fx}, data = datos)
summary(m)                         # coeficientes, R², F global
confint(m)                         # intervalos al 95 %
library(lmtest); library(sandwich); library(car)
coeftest(m, vcov = vcovHC(m, type = "HC1"))   # errores robustos
linearHypothesis(m, c(${M.names.filter(n=>n!=="(Intercepto)").map(n=>`"${n} = 0"`).join(", ")}))   # F de restricciones
bptest(m)                          # Breusch-Pagan
dwtest(m); bgtest(m, order = 1)    # autocorrelación
tseries::jarque.bera.test(resid(m))
resettest(m, power = 2:3)          # RESET
${M.xNames.length>=2?"vif(m)                             # multicolinealidad\n":""}
# Cambio estructural en la observación n1 + 1
library(strucchange)
n1 <- ${Math.floor(M.n/2)}
sctest(${fx}, data = datos, type = "Chow", point = n1)
plot(efp(${fx}, data = datos, type = "Rec-CUSUM"))

# Gráficos
plot(fitted(m), resid(m)); abline(h = 0, lty = 2)
hist(resid(m), freq = FALSE); curve(dnorm(x, 0, sd(resid(m))), add = TRUE)`)}</pre>`};
// ---------- recetas: qué variables crear según lo que se quiere hacer
DL.REC=[["quiebre","Cambio estructural en una fecha (dummy de quiebre e interacciones)"],["grupo","Comparar grupos (dummy por una condición)"],["estac","Estacionalidad (dummies trimestrales o mensuales)"],["log","Elasticidades (logaritmos)"],["rez","Dinámica (rezagos y diferencias)"],["tend","Tendencia (lineal y cuadrática)"],["nolin","Efecto no lineal o interacción entre dos variables"]];
DL.recetasHTML=C=>`<h4 class="subh">¿Qué quieres hacer?</h4><div class="calcf"><label style="grid-column:1/-1">Objetivo<select id="rc-t">${DL.REC.map(([k,t])=>`<option value="${k}">${t}</option>`).join("")}</select></label></div><div id="rc-f"></div><div class="chips pre" style="margin:8px 0"><button type="button" class="btn solid" id="rc-go">Crear las variables</button></div><div id="rc-o"></div>`;
DL.recetasBind=function(C){const B=DL.data,ck=(id,list,on)=>`<div class="chips" id="${id}">${list.map(c=>`<label class="chkl"><input type="checkbox" value="${c}" ${on.includes(c)?"checked":""}> ${c}</label>`).join("")}</div>`,
  sl=(id,lab,list,v)=>`<label>${lab}<select id="${id}">${list.map(o=>`<option value="${o}" ${o===v?"selected":""}>${o}</option>`).join("")}</select></label>`,guessY=C.find(c=>/^(y|consumo|c)$/i.test(c))||C[0],guessX=C.filter(c=>c!==guessY&&!/^(t|obs|trimestre|periodo|fecha|year|anio|ano)$/i.test(c)).slice(0,1);
  const F={quiebre:()=>`<p>Para probar si la relación cambió a partir de una fecha: una dummy D que vale 0 antes y 1 desde la fila del quiebre, y su interacción con cada X (cambio de pendiente).</p>
      <div class="calcf">${num("rq-k","El segundo periodo empieza en la fila",Math.floor(B.n/2)+1,1)}${txt("rq-n","Nombre de la dummy","D")}</div>
      <details class="dp-lite"><summary>¿En qué fila cae una fecha? (datos trimestrales o mensuales)</summary><div class="calcf">${num("rq-a0","Año de la primera fila",2005,1)}${num("rq-p0","Trimestre o mes de la primera fila",1,1)}${num("rq-a1","Año del quiebre",2008,1)}${num("rq-p1","Trimestre o mes del quiebre",1,1)}<label>Frecuencia<select id="rq-fr"><option value="4">Trimestral</option><option value="12">Mensual</option></select></label></div><p id="rq-fo" class="hint"></p></details>
      <p class="lbl" style="margin:8px 0 4px">Variables X que interactúan con D</p>${ck("rq-x",C,guessX)}`,
    grupo:()=>`<p>Una dummy que vale 1 cuando se cumple una condición (por ejemplo, ingreso alto o un grupo). Las columnas de texto con pocas categorías ya se convirtieron en dummies al cargar la base.</p><div class="calcf">${sl("rg-v","Variable",C,C[0])}<label>Condición<select id="rg-o"><option>&gt;</option><option>&gt;=</option><option>&lt;</option><option>&lt;=</option><option>==</option></select></label>${num("rg-c","Valor",0)}${txt("rg-n","Nombre","grupo")}</div>`,
    estac:()=>`<p>Una dummy por cada trimestre (o mes). En el modelo con intercepto se incluyen todas menos una (la omitida es la base); sin intercepto, todas.</p><div class="calcf"><label>Frecuencia<select id="re-f"><option value="4">Trimestral (S1…S4)</option><option value="12">Mensual (M1…M12)</option></select></label>${num("re-p","Trimestre o mes de la primera fila",1,1)}</div>`,
    log:()=>`<p>Con logaritmos, el coeficiente de ln X en una regresión de ln Y es una elasticidad. Se crea ln_ para cada variable marcada (solo valores positivos).</p>${ck("rl-x",C,[guessY,...guessX])}`,
    rez:()=>`<p>Para modelos dinámicos: el valor del periodo anterior (rezago) o el cambio respecto a él (diferencia).</p><div class="calcf">${sl("rr-v","Variable",C,guessY)}${num("rr-k","Número de rezagos",1,1)}<label class="chkl"><input type="checkbox" id="rr-d" checked> También la primera diferencia</label></div>`,
    tend:()=>`<p>Una tendencia lineal t = 1, 2, …, n y su cuadrado, para controlar el crecimiento en el tiempo.</p>`,
    nolin:()=>`<p>Un cuadrado permite efectos que crecen o decrecen; el producto de dos variables, que el efecto de una dependa del nivel de la otra.</p><div class="calcf">${sl("rn-a","Variable A",C,guessX[0]||C[0])}<label>Variable B (vacía = A al cuadrado)<select id="rn-b"><option value="">—</option>${C.map(c=>`<option>${c}</option>`).join("")}</select></label></div>`};
  const draw=()=>{const t=$("rc-t").value;$("rc-f").innerHTML=F[t]();$("rc-o").innerHTML="";
    if(t==="quiebre"){const f=()=>{const fr=+$("rq-fr").value,row=(V("rq-a1")-V("rq-a0"))*fr+(V("rq-p1")-V("rq-p0"))+1;$("rq-fo").innerHTML=isFinite(row)?`La fecha cae en la fila <b>${row}</b>. <button type="button" class="btn" id="rq-use">Usar esta fila</button>`:"";const u=$("rq-use");if(u)u.onclick=()=>{$("rq-k").value=row}};["rq-a0","rq-p0","rq-a1","rq-p1","rq-fr"].forEach(i=>$(i).addEventListener("input",f));f()}};
  $("rc-t").addEventListener("change",draw);draw();
  $("rc-go").onclick=()=>{const t=$("rc-t").value,made=[],todo=[];
    try{if(t==="quiebre"){const k=Math.round(V("rq-k")),D=DL.clean($("rq-n").value)||"D";if(!(k>1&&k<=B.n))throw new Error(`la fila del quiebre debe estar entre 2 y ${B.n}.`);todo.push([D,`obs >= ${k}`]);[...$("rq-x").querySelectorAll("input:checked")].forEach(i=>todo.push([`${D}_${i.value}`,`${D}*${i.value}`]))}
      if(t==="grupo")todo.push([$("rg-n").value,`(${$("rg-v").value} ${$("rg-o").value} ${V("rg-c")})*1`]);
      if(t==="estac"){const p=+$("re-f").value,s0=Math.round(V("re-p"));if(!(s0>=1&&s0<=p))throw new Error(`el periodo de la primera fila debe estar entre 1 y ${p}.`);for(let j=1;j<=p;j++)todo.push([(p===4?"S":"M")+j,`(obs ${s0>=2?"+":"-"} ${Math.abs(s0-2)}) % ${p} + 1 == ${j}`])}
      if(t==="log")[...$("rl-x").querySelectorAll("input:checked")].forEach(i=>todo.push(["ln_"+i.value,`log(${i.value})`]));
      if(t==="rez"){const v=$("rr-v").value,k=Math.max(1,Math.round(V("rr-k")));for(let j=1;j<=k;j++)todo.push([`${v}_l${j}`,`lag(${v}, ${j})`]);if($("rr-d").checked)todo.push([`d_${v}`,`dif(${v})`])}
      if(t==="tend"){todo.push(["t","obs"]);todo.push(["t2","obs^2"])}
      if(t==="nolin"){const a=$("rn-a").value,b=$("rn-b").value;todo.push(b?[`${a}_${b}`,`${a}*${b}`]:[`${a}_2`,`${a}^2`])}
      if(!todo.length)throw new Error("marca al menos una variable.");
      todo.forEach(([n,e])=>{const nm=DL.mk(n,e);made.push([nm,e])});
      const next={quiebre:()=>`Ahora ve a <b>3. Estimar</b> y marca como X: ${[...$("rq-x").querySelectorAll("input:checked")].map(i=>i.value).join(", ")}, ${made.map(m=>m[0]).join(", ")}. Después, en <b>4. Pruebas → F de restricciones</b>, marca solo ${made.map(m=>m[0]).join(" y ")}: esa F es la prueba de cambio estructural con dummies, igual a la de Chow.`,
        grupo:()=>"Agrégala como X en 3. Estimar: su coeficiente es la diferencia promedio de Y entre el grupo y el resto, con las demás variables constantes.",
        estac:()=>"En 3. Estimar incluye todas menos una (por ejemplo, S2, S3 y S4 con intercepto). Cada coeficiente es la diferencia frente al periodo omitido. Prueba la estacionalidad con la F de restricciones marcando esas dummies.",
        log:()=>"Estima ln_Y sobre ln_X: el coeficiente es la elasticidad (el % que cambia Y cuando X sube 1 %).",
        rez:()=>"Las primeras filas quedan sin valor (NA) y se excluyen solas al estimar.",tend:()=>"Agrega t (y t2 si esperas una curva) como X en 3. Estimar.",nolin:()=>"Agrégala como X junto con las variables originales."}[t]();
      $("rc-o").innerHTML=`<p class="verdict ok">Variables creadas:</p><div class="tbl"><table><tr><th>Variable</th><th>Expresión</th><th>En R</th></tr>${made.map(([n,e])=>`<tr><td><b>${n}</b></td><td><code>${esc(e)}</code></td><td><code>datos$${n} &lt;- ${esc(DL.rExpr(e))}</code></td></tr>`).join("")}</table></div><p>${next}</p>`}
    catch(e2){$("rc-o").innerHTML=err(e2.message)}}};
// ---------- guías paso a paso
DL.GUIA=`<details class="dp-lite dl-guia"><summary><b>Qué puedes hacer en cada pestaña</b></summary><div class="tbl"><table><tr><th>Pestaña</th><th>Para qué sirve</th><th>Qué obtienes</th></tr>
<tr><td><b>1. La base</b></td><td>Revisar que los datos se leyeron bien antes de estimar.</td><td>Nombres de las columnas, primeras filas, estadísticas descriptivas (media, desviación, mínimo, máximo, vacíos) y correlaciones.</td></tr>
<tr><td><b>2. Crear variables</b></td><td>Construir las variables que pide el modelo y que no vienen en la base.</td><td>Dummies de quiebre e interacciones, dummies de grupo o estacionales, logaritmos, rezagos, tendencias; cada una con su expresión en R.</td></tr>
<tr><td><b>3. Estimar</b></td><td>Escoger Y, las X, las filas y estimar por MCO.</td><td>La ecuación estimada, coeficientes con su significado, errores estándar, t, p, intervalos, R², F global y una lectura de los resultados.</td></tr>
<tr><td><b>4. Pruebas</b></td><td>Contrastar hipótesis sobre el modelo estimado en la pestaña 3.</td><td>F de restricciones (y Wald, LR, LM), cambio estructural (Chow y pronósticos), recursivos y CUSUM, heterocedasticidad, autocorrelación, normalidad, RESET y VIF.</td></tr>
<tr><td><b>5. Demostraciones</b></td><td>Comprobar con tus datos las propiedades de MCO que se demuestran en clase.</td><td>X′e = 0, Σe = 0, STC = SCE + SCR, R² = corr(Y, Ŷ)² y el teorema de Frisch-Waugh-Lovell.</td></tr>
<tr><td><b>6. Gráficos</b></td><td>Ver los datos y los residuos.</td><td>Dispersión con la recta de MCO, residuos frente a ajustados y en el tiempo, histograma con la normal.</td></tr>
<tr><td><b>7. Código R</b></td><td>Llevar todo a RStudio para el informe.</td><td>Un script con la lectura de la base, las variables creadas, el modelo y las pruebas.</td></tr></table></div>
<p class="hint">El orden habitual: 1 → 2 (si hace falta) → 3 → 4 → 7. Cada vez que cambies el modelo en la pestaña 3, las pruebas de la 4 se recalculan con el modelo nuevo.</p><p class="hint"><b>✍ Modo práctica:</b> en Estimar y en Pruebas → Cambio estructural hay un botón que oculta la solución y te pide cada cálculo en orden (X′X, X′y, b, SCR, F…). Cada paso dice qué necesita antes y se desbloquea cuando aciertas los anteriores.</p></details>
<details class="dp-lite dl-guia"><summary><b>Guía paso a paso: cambio estructural con una base de datos</b></summary>
<ol class="steps">
<li><b>Revisa la base</b> (pestaña 1): que el número de filas y las columnas sean los esperados y que no haya vacíos. Si hay una columna que solo numera los periodos (t, T, trimestre), no la uses como X.</li>
<li><b>Ubica el quiebre:</b> la fila donde empieza el segundo periodo. Con datos trimestrales o mensuales, el cuadro «¿En qué fila cae una fecha?» de la pestaña 2 te la da. Si los grupos no son periodos sino categorías (hombres y mujeres, urbano y rural), basta una columna 0/1.</li>
<li><b>Estima el modelo restringido</b> (pestaña 3): Y, sus X, toda la muestra, con intercepto. Anota la ecuación, el R² y la SCR (es la SCR<sub>R</sub>).</li>
<li><b>Prueba de Chow</b> (pestaña 4 → Cambio estructural): escoge la fila del quiebre o la variable 0/1. El paso 1 trae las tres regresiones, el paso 2 el modelo con dummies y la verificación SCR<sub>NR</sub> = SCR₁ + SCR₂, y el paso 3 la F por las cuatro alternativas, que deben coincidir, y dónde está el cambio (intercepto o pendiente).</li>
<li><b>Pronósticos de Chow:</b> en la misma pestaña, el paso 4 da la F con las SCR y con el vector d de errores de pronóstico, y la tabla de errores.</li>
<li><b>Recursivos</b> (pestaña 4 → Recursivos y CUSUM): la trayectoria del coeficiente con su banda, los errores un paso adelante con ±2 desviaciones y la CUSUM.</li>
<li><b>Modelo con dummies explícito</b> (opcional): pestaña 2 → «Cambio estructural en una fecha» crea D y D·X. En la pestaña 3, «Modelo con dummies de quiebre» y Estimar; en la 4 → F de restricciones, marca solo las dummies: da la misma F de Chow.</li>
<li><b>El informe:</b> pestaña 7 → copia el script, ejecútalo en RStudio con tu archivo y pega las salidas con tu análisis.</li></ol></details>`;
