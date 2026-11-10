// Economiapp · cálculos de Derecho Laboral (CST). Actualiza la tabla LEY cada año.
// Economiapp · cálculos de Derecho Laboral (Código Sustantivo del Trabajo) como funciones puras.
// Los valores que cambian con el tiempo están en LEY: actualízalos cada año.
const LEY={
  smmlv:[["2025-01-01",1423500,200000],["2026-01-01",1750905,249095]],        // [desde, salario mínimo, auxilio de transporte]
  jornada:[["2023-07-15",47],["2024-07-15",46],["2025-07-15",44],["2026-07-15",42]], // Ley 2101 de 2021
  dominical:[["2000-01-01",0.75],["2025-07-01",0.80],["2026-07-01",0.90],["2027-07-01",1.00]], // art. 179 CST (Ley 2466)
  nocturno:[["2000-01-01",21],["2025-12-25",19]],                              // hora de inicio de la jornada nocturna (art. 160)
  reforma:"2025-06-25",                                                        // vigencia de la Ley 2466 de 2025
  pct:{extraD:0.25,extraN:0.75,recN:0.35},
  fsp:[[4,0.01],[16,0.012],[17,0.014],[18,0.016],[19,0.018],[20,0.02]]          // fondo de solidaridad pensional, desde x SMMLV
};
const LAB={};
// ---------- fechas
LAB.parse=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s||"").trim());if(!m)return null;const d={y:+m[1],m:+m[2],d:+m[3]};
  const t=new Date(Date.UTC(d.y,d.m-1,d.d));return t.getUTCMonth()===d.m-1?d:null};
LAB.iso=d=>`${d.y}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`;
LAB.fromUTC=t=>({y:t.getUTCFullYear(),m:t.getUTCMonth()+1,d:t.getUTCDate()});
LAB.addDays=(d,n)=>LAB.fromUTC(new Date(Date.UTC(d.y,d.m-1,d.d+n)));
LAB.cmp=(a,b)=>a.y-b.y||a.m-b.m||a.d-b.d;
LAB.lastDay=(y,m)=>new Date(Date.UTC(y,m,0)).getUTCDate();
// suma meses a una fecha de inicio y devuelve el último día del período (inicio + n meses − 1 día)
LAB.endOf=(start,months)=>{const t=start.m-1+months,y=start.y+Math.floor(t/12),m=t%12+1,L=LAB.lastDay(y,m);return start.d>L?{y,m,d:L}:LAB.addDays({y,m,d:start.d},-1)};
// días con año comercial de 360 días (método europeo, el usado en nómina)
LAB.days360=(a,b)=>{const ad=a.d===31||(a.m===2&&a.d===LAB.lastDay(a.y,2))?30:a.d,bd=b.d===31||(b.m===2&&b.d===LAB.lastDay(b.y,2))?30:b.d;
  return (b.y-a.y)*360+(b.m-a.m)*30+(bd-ad)};
LAB.fmtFecha=d=>{const M=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];return `${d.d} de ${M[d.m-1]} de ${d.y}`};
// valor vigente de una tabla [[desde, ...valores]] en una fecha
LAB.at=(tabla,fecha)=>{const s=LAB.iso(fecha);let r=tabla[0];for(const row of tabla)if(row[0]<=s)r=row;return r};
LAB.valores=fecha=>{const [,sm,aux]=LAB.at(LEY.smmlv,fecha),[,jor]=LAB.at(LEY.jornada,fecha),[,dom]=LAB.at(LEY.dominical,fecha),[,noc]=LAB.at(LEY.nocturno,fecha);
  return{smmlv:sm,aux,jornada:jor,horasMes:jor/6*30,dominical:dom,nocturno:noc,anioSM:LAB.at(LEY.smmlv,fecha)[0].slice(0,4)}};

// ---------- art. 46: prórrogas del contrato a término fijo
// inicio: fecha; meses: duración inicial; corte: fecha de consulta. Devuelve los períodos y la fecha de conversión a indefinido.
// fin de un período de n días contados con el año de 360 (el primer día cuenta): el primer día en que días360 + 1 llega a n
LAB.add360=(start,n)=>{let d=start;for(let k=0;k<4000;k++){if(LAB.days360(start,d)+1>=n)return d;d=LAB.addDays(d,1)}return d};
// fin de un período de «meses y días»: calendario (meses del calendario + días corridos) o año de 360 (30 días por mes)
LAB.finPeriodo=(start,meses,dias,modo)=>modo==="360"?LAB.add360(start,meses*30+dias):(dias?LAB.addDays(LAB.endOf(start,meses),dias):LAB.endOf(start,meses));
LAB.prorrogas=function(inicio,meses,corte,opt={}){const dias0=opt.dias||0,modo=opt.modo||"cal",corta=meses*30+dias0<360;
  const ref=LAB.cmp(inicio,LAB.parse(LEY.reforma))<0?LAB.parse(LEY.reforma):inicio,tope=LAB.addDays(LAB.endOf(ref,48),0);
  const per=[];let s=inicio,n=0,conv=null;
  while(per.length<60){if(LAB.cmp(s,tope)>0){conv=s;break}const anual=corta&&n>=4,dur=n===0||!anual?meses:12,dd=anual?0:dias0,e=LAB.finPeriodo(s,dur,dd,modo);
    const p={n,inicio:s,fin:e,meses:dur,dias:dd,anual,preaviso:LAB.addDays(e,-30),excede:LAB.cmp(e,tope)>0};
    if(p.excede){conv=LAB.addDays(tope,1);p.fin=tope;p.recortado=true;per.push(p);break}
    per.push(p);
    s=LAB.addDays(e,1);n++}
  const actual=corte?per.find(p=>LAB.cmp(p.inicio,corte)<=0&&LAB.cmp(corte,p.fin)<=0)||null:null;
  return{periodos:per,ref,tope,conversion:conv,actual,antesReforma:LAB.cmp(inicio,LAB.parse(LEY.reforma))<0,indefinidoEnCorte:conv&&corte&&LAB.cmp(corte,conv)>=0}};

// ---------- festivos de Colombia (Ley 51 de 1983: los movibles pasan al lunes siguiente)
LAB.pascua=y=>{const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31),da=(h+l-7*m+114)%31+1;return{y,m:mo,d:da}};
LAB.festivos=function(y){const lunes=d=>{const w=new Date(Date.UTC(d.y,d.m-1,d.d)).getUTCDay();return w===1?d:LAB.addDays(d,(8-w)%7)},P=LAB.pascua(y),f=[];
  const fijo=(m,d,n)=>f.push({f:{y,m,d},n}),mov=(m,d,n)=>f.push({f:lunes({y,m,d}),n}),pas=(k,n,mv)=>{const d=LAB.addDays(P,k);f.push({f:mv?lunes(d):d,n})};
  fijo(1,1,"Año Nuevo");mov(1,6,"Reyes Magos");mov(3,19,"San José");pas(-3,"Jueves Santo");pas(-2,"Viernes Santo");fijo(5,1,"Día del Trabajo");pas(39,"Ascensión del Señor",1);pas(60,"Corpus Christi",1);pas(68,"Sagrado Corazón",1);
  mov(6,29,"San Pedro y San Pablo");fijo(7,20,"Independencia");fijo(8,7,"Batalla de Boyacá");mov(8,15,"Asunción de la Virgen");mov(10,12,"Día de la Raza");mov(11,1,"Todos los Santos");mov(11,11,"Independencia de Cartagena");fijo(12,8,"Inmaculada Concepción");fijo(12,25,"Navidad");
  return f.sort((a,b)=>LAB.cmp(a.f,b.f))};
LAB.esFestivo=d=>LAB.festivos(d.y).find(x=>LAB.cmp(x.f,d)===0)||null;

// ---------- vacaciones (arts. 186 a 192): 15 días hábiles por año; al terminar, compensación proporcional
// inicio: desde cuándo se deben; servicio en días de 360 menos suspensiones (art. 53); salario: el ordinario (sin horas extra ni dominicales trabajados)
LAB.vacaciones=function({inicio,retiro,salario,art51=0,disfrutados=0}){const total=LAB.days360(inicio,retiro)+1,dias=Math.max(0,total-Math.max(0,Math.round(art51))),
  causados=dias*15/360,pend=Math.max(0,causados-disfrutados),diario=salario/30,valor=diario*pend;
  return{total,art51:total-dias,dias,causados,disfrutados,pend,diario,valor,valor720:salario*dias/720}};
// fecha de regreso: cuenta días hábiles desde el inicio del disfrute (no cuentan domingos ni festivos; el sábado cuenta si se trabaja ese día)
LAB.disfrute=function(inicio,habiles,sabado){const lista=[],no=[];let d=inicio,k=0;
  while(lista.length<habiles&&k<400){const w=new Date(Date.UTC(d.y,d.m-1,d.d)).getUTCDay(),fe=LAB.esFestivo(d);
    if(w===0||fe||(w===6&&!sabado))no.push({f:d,por:fe?fe.n:w===0?"domingo":"sábado (no laborable)"});else lista.push(d);d=LAB.addDays(d,1);k++}
  let reg=d;for(let j=0;j<20;j++){const w=new Date(Date.UTC(reg.y,reg.m-1,reg.d)).getUTCDay();if(w===0||LAB.esFestivo(reg)||(w===6&&!sabado))reg=LAB.addDays(reg,1);else break}
  return{habiles:lista,no,ultimo:lista[lista.length-1],regreso:reg,calendario:LAB.diasCal(inicio,reg)}};

// ---------- art. 64: indemnización por despido sin justa causa
LAB.indemnizacion=function({tipo,salario,inicio,despido,finPactado,smmlv,art51=0}){
  const diario=salario/30;
  if(tipo==="fijo"||tipo==="obra"){const falta=Math.max(0,LAB.days360(despido,finPactado)),dias=tipo==="obra"?Math.max(15,falta):falta;
    return{diario,falta,dias,valor:dias*diario,minimo15:tipo==="obra"&&falta<15}}
  const servicioTotal=LAB.days360(inicio,despido)+1,servicio=Math.max(0,servicioTotal-Math.max(0,Math.round(art51||0))),anios=servicio/360,alto=salario>=10*smmlv,p1=alto?20:30,pn=alto?15:20;
  // en derecho los días no llevan decimales: la fracción de año da días proporcionales redondeados al entero
  const completos=Math.floor(servicio/360),frac=servicio-360*completos,fracExacta=pn*frac/360,diasFrac=Math.round(fracExacta);
  const dias=servicio<=360?p1:p1+pn*(completos-1)+diasFrac;
  return{diario,servicio,servicioTotal,art51:servicioTotal-servicio,anios,alto,p1,pn,completos,frac,fracExacta,diasFrac,dias,valor:dias*diario}};
// ---------- art. 65: indemnización moratoria
LAB.moratoria=function({salario,diasRetardo,smmlv}){const diario=salario/30,minimo=salario<=smmlv,tope=minimo?Infinity:720,dias=Math.min(diasRetardo,tope);
  return{diario,minimo,dias,valor:dias*diario,intereses:!minimo&&diasRetardo>720,diasInteres:Math.max(0,diasRetardo-720)}};

// ---------- art. 306: prima de servicios (30 días de salario por año, la mitad por semestre)
LAB.semestre=(anio,sem)=>sem===1?{ini:{y:anio,m:1,d:1},fin:{y:anio,m:6,d:30},limite:{y:anio,m:6,d:30},m0:1}:{ini:{y:anio,m:7,d:1},fin:{y:anio,m:12,d:31},limite:{y:anio,m:12,d:20},m0:7};
LAB.diasCal=(a,b)=>Math.round((Date.UTC(b.y,b.m-1,b.d)-Date.UTC(a.y,a.m-1,a.d))/864e5);
// meses: salario devengado de cada mes del semestre (6 valores); aux: true/false/"auto"; ausencias: días no laborados (licencias no remuneradas, suspensiones)
LAB.prima=function({anio,sem,ingreso,retiro,meses,aux="auto",ausencias=0,pago,basicoMora}){
  const S=LAB.semestre(anio,sem),a=ingreso&&LAB.cmp(ingreso,S.ini)>0?ingreso:S.ini,b=retiro&&LAB.cmp(retiro,S.fin)<0?retiro:S.fin;
  if(LAB.cmp(a,b)>0)return{error:"el trabajador no laboró en este semestre (revisa las fechas de ingreso y retiro)."};
  const diasPer=LAB.days360(a,b)+1,dias=Math.max(0,diasPer-ausencias),idx=[];for(let m=a.m;m<=b.m;m++)idx.push(m-S.m0);
  const sal=idx.map(i=>meses[i]),ult=sal.slice(-3),iguales=ult.every(v=>Math.abs(v-ult[0])<0.5),promedio=sal.reduce((x,v)=>x+v,0)/sal.length;
  const V=LAB.valores(b),basico=iguales?sal[sal.length-1]:promedio,recibeAux=aux==="auto"?sal[sal.length-1]<=2*V.smmlv:!!aux,auxV=recibeAux?V.aux:0;
  const base=basico+auxV,valor=base*dias/360,retiroAntes=retiro&&LAB.cmp(retiro,S.fin)<0;
  let mora=null;if(pago&&!retiroAntes){const d=Math.max(0,LAB.diasCal(S.limite,pago)),bm=basicoMora>0?basicoMora:sal[sal.length-1];mora={dias:d,diario:bm/30,valor:d*bm/30,basico:bm,desde:LAB.addDays(S.limite,1)}}
  return{S,a,b,diasPer,dias,ausencias,idx,sal,ult,iguales,promedio,basico,recibeAux,auxV,smmlv:V.smmlv,base,valor,retiroAntes,mora}};

// ---------- liquidación de prestaciones con el formato de clase: primas, cesantías (art. 249, Ley 50 de 1990) e intereses (Ley 52 de 1975)
// meses: [{y,m,basico,extra,art51}] desde el mes de ingreso hasta el de retiro. pagos: {prima,ces,int} = true si se pagaron a tiempo.
// Convenciones de clase: días de 360 contando ambos extremos, salario diario truncado a pesos, mora con el salario básico.
// Como en clase: los meses suspendidos todo el mes (art. 51) cuentan con devengado 0 en el promedio; si uno de los tres últimos meses está suspendido, ya no son «iguales»
LAB.basePeriodo=function(meses,fin){if(!meses.length)return null;const dev=r=>r.art51>=30?0:r.basico+r.extra,ult=meses.slice(-3);
  const iguales=ult.every(r=>r.art51<30&&Math.abs(dev(r)-dev(ult[0]))<0.5),prom=meses.reduce((x,r)=>x+dev(r),0)/meses.length;
  const V=LAB.valores(fin),ultimo=meses[meses.length-1],aux=ultimo.basico<=2*V.smmlv?V.aux:0,sal=iguales?dev(ultimo):prom;
  return{vivos:meses,ult,iguales,prom,sal,aux,base:sal+aux,basico:ultimo.basico,diario:Math.floor(ultimo.basico/30),devs:meses.map(dev),susp:meses.filter(r=>r.art51>=30).length}};
LAB.liquidacion=function({inicio,retiro,meses,pagos={}}){
  const key=(y,m)=>y*12+m,get=(a,b)=>meses.filter(r=>key(r.y,r.m)>=key(a.y,a.m)&&key(r.y,r.m)<=key(b.y,b.m));
  const per=(a,b,lim,moraDesde,pagado,tipo)=>{const ini=LAB.cmp(inicio,a)>0?inicio:a,fin=LAB.cmp(retiro,b)<0?retiro:b;if(LAB.cmp(ini,fin)>0)return null;
    const ms=get(ini,fin),aus=ms.reduce((x,r)=>x+Math.min(30,r.art51||0),0),dias360=LAB.days360(ini,fin)+1,dias=Math.max(0,dias360-aus),B=LAB.basePeriodo(ms,fin);if(!B)return null;
    const valor=Math.round(B.base*dias/360),cierra=LAB.cmp(retiro,b)>=0&&LAB.cmp(retiro,moraDesde)>=0;
    let mora=null;if(cierra&&!pagado){const d=LAB.days360(moraDesde,retiro)+1;mora={desde:moraDesde,dias:d,diario:B.diario,valor:d*B.diario}}
    return{tipo,ini,fin,dias360,aus,dias,B,valor,limite:lim,enLiquidacion:!cierra,mora}};
  const primas=[],ces=[],ints=[];
  for(let y=inicio.y;y<=retiro.y;y++){
    const p1=per({y,m:1,d:1},{y,m:6,d:30},{y,m:6,d:30},{y,m:7,d:1},pagos.prima,"prima");if(p1)primas.push(Object.assign(p1,{nombre:`Prima 1 de ${y}`}));
    const p2=per({y,m:7,d:1},{y,m:12,d:31},{y,m:12,d:20},{y,m:12,d:21},pagos.prima,"prima");if(p2)primas.push(Object.assign(p2,{nombre:`Prima 2 de ${y}`}));
    const c=per({y,m:1,d:1},{y,m:12,d:31},{y:y+1,m:2,d:14},{y:y+1,m:2,d:15},pagos.ces,"ces");
    if(c){ces.push(Object.assign(c,{nombre:`Cesantías de ${y}`}));const iv=Math.round(c.valor*c.dias*0.12/360),cerrado=!c.enLiquidacion,limI={y:y+1,m:1,d:31};
      ints.push({nombre:`Intereses de ${y}`,ces:c.valor,dias:c.dias,valor:iv,limite:limI,enLiquidacion:c.enLiquidacion,sancion:cerrado&&!pagos.int&&LAB.cmp(retiro,limI)>0?iv:0})}}
  const sum=a=>a.reduce((x,v)=>x+v,0),deb=(arr,pag)=>sum(arr.filter(r=>r.enLiquidacion||!pag).map(r=>r.valor));
  const tot={primas:deb(primas,pagos.prima),moraPrimas:sum(primas.map(r=>r.mora?r.mora.valor:0)),ces:deb(ces,pagos.ces),moraCes:sum(ces.map(r=>r.mora?r.mora.valor:0)),
    ints:deb(ints,pagos.int),sancionInt:sum(ints.map(r=>r.sancion))};tot.total=Object.values(tot).reduce((x,v)=>x+v,0);
  return{primas,ces,ints,tot}};

// ---------- jornada, recargos y horas extras
// factor del pago ADICIONAL al salario mensual: las horas ordinarias diurnas ya están pagadas (0) y la nocturna ordinaria solo lleva el recargo
LAB.factores=dom=>({ord:0,recN:LEY.pct.recN,extraD:1+LEY.pct.extraD,extraN:1+LEY.pct.extraN,domD:1+dom,domN:1+dom+LEY.pct.recN,extraDomD:1+LEY.pct.extraD+dom,extraDomN:1+LEY.pct.extraN+dom});
LAB.horaOrdinaria=(salario,horasMes)=>salario/horasMes;
// clasifica un turno en franjas de 15 minutos. dia1/dia2: "ord" o "dom" (domingo o festivo). ordH: horas ordinarias del turno.
LAB.turno=function({ini,fin,dia1,dia2,ordH,inicioNoct}){
  const toMin=s=>{const m=/^(\d{1,2}):(\d{2})$/.exec(String(s).trim());if(!m||+m[1]>23||+m[2]>59)return null;return +m[1]*60+ +m[2]};
  let a=toMin(ini),b=toMin(fin);if(a==null||b==null)return null;if(b<=a)b+=1440;
  const H={ord:0,recN:0,domD:0,domN:0,extraD:0,extraN:0,extraDomD:0,extraDomN:0},seg=[];
  for(let t=a;t<b;t+=15){const m=t%1440,dom=(t<1440?dia1:dia2)==="dom",noct=m>=inicioNoct*60||m<360,extra=(t-a)>=ordH*60;
    const k=extra?(dom?(noct?"extraDomN":"extraDomD"):(noct?"extraN":"extraD")):(dom?(noct?"domN":"domD"):(noct?"recN":"ord"));
    H[k]+=0.25;const last=seg[seg.length-1];if(last&&last.k===k)last.b=t+15;else seg.push({k,a:t,b:t+15})}
  return{H,seg,total:(b-a)/60}};
LAB.valorHoras=(H,hora,dom)=>{const f=LAB.factores(dom),items=Object.keys(H).filter(k=>H[k]>0).map(k=>({k,h:H[k],factor:f[k],valor:H[k]*hora*f[k]}));
  return{items,total:items.reduce((s,i)=>s+i.valor,0)}};

// ---------- nómina mensual del trabajador
LAB.nomina=function({salario,dias,extras,smmlv,aux,auxDerecho}){
  const basico=salario/30*dias,auxT=(auxDerecho&&salario<=2*smmlv)?aux/30*dias:0,ibc=basico+extras,veces=ibc/smmlv;
  let fsp=0;for(const [d,p] of LEY.fsp)if(veces>=d)fsp=p;
  const salud=ibc*0.04,pension=ibc*0.04,fspV=ibc*fsp,dev=basico+extras+auxT,ded=salud+pension+fspV;
  return{basico,auxT,ibc,veces,salud,pension,fsp,fspV,dev,ded,neto:dev-ded,
    empleador:{pension:ibc*0.12,arl:ibc*0.00522,caja:ibc*0.04,cesantias:(basico+extras+auxT)*0.0833,intereses:(basico+extras+auxT)*0.0833*0.12,prima:(basico+extras+auxT)*0.0833,vacaciones:basico*0.0417,
      saludEmp:veces>=10?ibc*0.085:0,icbf:veces>=10?ibc*0.03:0,sena:veces>=10?ibc*0.02:0}}};
// ---------- Planilla de horas por día (taller de horas extras): cada hora en su columna
// Columnas de la tabla del curso. Factor sobre el valor de la hora ordinaria (d = recargo dominical).
LAB.COLS=["HD","HN","RN","HED","HEN","HDD","RDD","HND","RND","HEDD","HEND"];
LAB.factCols=d=>({HD:1,HN:1+LEY.pct.recN,RN:LEY.pct.recN,HED:1+LEY.pct.extraD,HEN:1+LEY.pct.extraN,HDD:1+d,RDD:d,HND:1+LEY.pct.recN+d,RND:LEY.pct.recN+d,HEDD:1+LEY.pct.extraD+d,HEND:1+LEY.pct.extraN+d});
LAB.NOMCOL={HD:"hora diurna ordinaria",HN:"hora nocturna ordinaria",RN:"recargo nocturno (solo el 35 %)",HED:"hora extra diurna",HEN:"hora extra nocturna",HDD:"hora diurna dominical o festiva",RDD:"recargo dominical diurno (solo el recargo)",HND:"hora nocturna dominical o festiva",RND:"recargo dominical nocturno (solo el recargo)",HEDD:"hora extra diurna dominical o festiva",HEND:"hora extra nocturna dominical o festiva",D0:"diurna ordinaria ya pagada por el salario"};
// hora: "8am", "8:30 pm", "12m" (mediodía), "10:00p.m.", "14:00"
LAB.hora=function(t){t=String(t).toLowerCase().replace(/\s+/g,"").replace(/\./g,"");if(/^(mediodia|12delmediodia|12m)$/.test(t))return 720;if(/^(medianoche|12delanoche)$/.test(t))return 0;
  const m=/^(\d{1,2})(?::(\d{2}))?(am|pm|m)?$/.exec(t);if(!m)return null;let h=+m[1];const mi=m[2]?+m[2]:0;if(mi>59)return null;
  if(m[3]==="m"){if(h!==12)return null;return 720}if(m[3]==="am"){if(h<1||h>12)return null;h=h%12}else if(m[3]==="pm"){if(h<1||h>12)return null;h=h%12+12}else if(h>24)return null;return(h%24)*60+mi};
LAB.dias=function(t){const out=[];for(const part of String(t).split(/,|\by\b/).map(x=>x.trim()).filter(Boolean)){const m=/^(\d{1,2})\s*(?:-|–|al|a)\s*(\d{1,2})$/.exec(part),n=/^(\d{1,2})$/.exec(part);
  if(m){const a=+m[1],b=+m[2];if(b<a)return null;for(let d=a;d<=b;d++)out.push(d)}else if(n)out.push(+n[1]);else return null}return out};
LAB.NOV=[[/^descans|^compensatorio/,"descanso"],[/^permiso/,"permiso"],[/^incapacidad/,"incapacidad"],[/^sanci/,"sancion"],[/^licencia\s*(no\s*remunerada)?$|^licencia no/,"licencia"],[/^licencia remunerada|^calamidad|^luto/,"permiso"],[/^vacacion/,"vacaciones"]];
LAB.parsePlanilla=function(text,ndias){const rec={},errs=[];
  String(text).split(/\n/).map(l=>l.replace(/#.*$/,"").trim()).filter(Boolean).forEach(ln=>{const m=/^(?:d[ií]as?\s*)?([\d\s,y\-–al]+?)\s*:\s*(.+)$/i.exec(ln);if(!m){errs.push(`no entiendo «${ln}». Usa «días: horario» o «días: novedad».`);return}
    const ds=LAB.dias(m[1]);if(!ds||!ds.length){errs.push(`los días «${m[1]}» no son válidos.`);return}if(ds.some(d=>d<1||d>ndias)){errs.push(`en «${ln}» hay días fuera del mes.`);return}
    const v=m[2].trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");let kind=null;for(const [re,k] of LAB.NOV)if(re.test(v)){kind=k;break}
    let r;if(kind)r={kind};else{const segs=[];for(const sg of v.split(/,|;|\sy\s|\bluego\b/).map(x=>x.replace(/^de\s+/,"").trim()).filter(Boolean)){const p=sg.split(/\s*(?:-|–|\sa\s)\s*/);
        if(p.length!==2){errs.push(`no entiendo el horario «${sg}» (escribe por ejemplo 8am-5pm).`);return}const a=LAB.hora(p[0].replace(/del?mediodia/,"m")),b=LAB.hora(p[1].replace(/del?mediodia/,"m").replace(/^12$/,"12m"));
        if(a==null||b==null){errs.push(`no entiendo la hora en «${sg}».`);return}segs.push([a,b<=a?b+1440:b])}
      if(!segs.length){errs.push(`falta el horario en «${ln}».`);return}r={kind:"trabajo",segs}}
    ds.forEach(d=>{if(rec[d])errs.push(`el día ${d} aparece dos veces.`);rec[d]=r})});
  return{rec,errs}};
// cfg: {domTrab ("auto" | "H" | "R"), propHoras (proporción del dominical por horas: 7 × h/42), ndiasPrev, ndias, dow1 (0 = domingo), festivos[], ingreso (día; 1 si venía laborando), venia, salario, jornada, d, noct, smmlv, pierde (sanción/licencia quitan el dominical), incap (fracción)}
LAB.planilla=function(cfg,rec){const J=cfg.jornada,F=LAB.factCols(cfg.d),N=cfg.ndias,vh=cfg.salario/(J*30);
  const dow=d=>((cfg.dow1+d-1)%7+7)%7,fest=new Set(cfg.festivos),esDom=d=>d<=N?(dow(d)===0||fest.has(d)):(dow(d)===0||(cfg.festSig||[]).includes(d-N));
  const emp=d=>d>=cfg.ingreso,R=d=>rec[d]||null,susp=d=>{const r=R(d);return r&&(r.kind==="sancion"||r.kind==="licencia")};
  const rows=[];for(let d=1;d<=N;d++)rows.push({d,dow:dow(d),dom:esDom(d),fest:fest.has(d),h:Object.fromEntries(LAB.COLS.concat(["D0"]).map(k=>[k,0])),notas:[],detalle:[],tipo:R(d)?R(d).kind:null});
  // descanso remunerado de domingos y festivos
  const pagoDescanso=d=>{if(!emp(d))return{h:0,why:"todavía no trabajaba en la empresa"};if(d===31)return{h:0,why:"el día 31 no se paga: el salario mensual cubre 30 días"};
    const r=R(d);if(r&&r.kind==="incapacidad")return{h:0,why:"ese día recibe el auxilio por incapacidad (art. 173)"};if(susp(d))return{h:0,why:"está suspendido ese día (art. 51)"};
    if(fest.has(d)&&dow(d)!==0)return{h:J,why:"festivo remunerado (art. 177)"};
    // domingo: semana de lunes a sábado anterior
    const fx=x=>(+x.toFixed(2)).toLocaleString("es-CO");
    const ordH=k=>{const rk=R(k);if(!rk)return fest.has(k)?J:0;if(rk.kind==="trabajo"){const m=rk.segs.reduce((t,[a,b])=>t+(b-a),0);return Math.min(J,m/60)}return rk.kind==="sancion"||rk.kind==="licencia"?0:J};
    let cub=0,horas=0,perdio=null;const det=[];for(let k=d-6;k<=d-1;k++){if(k<1){if(cfg.venia){cub++;horas+=J;det.push(`día ${k+cfg.ndiasPrev} del mes anterior: ${J} h`)}continue}if(!emp(k))continue;
      if(susp(k)){perdio=k;continue}const h=ordH(k);if(R(k)||fest.has(k))cub++;horas+=h;if(h)det.push(`día ${k}: ${fx(h)} h`)}
    if(perdio&&cfg.pierde)return{h:0,why:`el día ${perdio} hubo ${R(perdio).kind==="sancion"?"sanción disciplinaria":"licencia no remunerada"}: faltó por culpa o disposición suya, así que pierde el dominical (art. 173)`};
    const total=6;if(cub>=total&&horas>=6*J-1e-9)return{h:J,why:"descanso dominical remunerado (art. 172 y 173): cumplió la semana"};
    if(cfg.propHoras){const v=J*Math.min(horas,6*J)/(6*J);return{h:v,why:`descanso dominical proporcional a las horas de la semana (art. 173, parágrafo): ${J} × ${fx(horas)} / ${6*J} = ${fx(v)} h . Horas que cuentan, de lunes a sábado (ordinarias, máximo ${J} por día, sin las extra; 7 por festivo, permiso o descanso): ${det.join(", ")||"ninguna"}`,prop:true,horas,form:`${J} × ${fx(horas)}/${6*J}`}}
    return{h:J*cub/total,why:`descanso dominical proporcional a los días: ${J} × ${cub}/6 = ${fx(J*cub/total)} h (art. 173, parágrafo)`,prop:true,form:`${J} × ${cub}/6`}};
  rows.forEach(r=>{if(r.dom){const p=pagoDescanso(r.d);r.desc=p}});
  // novedades sin trabajo
  rows.forEach(r=>{const x=R(r.d);if(!x||x.kind==="trabajo")return;
    if(r.d===31){r.notas.push(`${x.kind}: el día 31 no suma (el salario cubre 30 días)`);return}
    if(x.kind==="descanso"){if(!r.dom){r.h.HD+=J;r.notas.push("descanso remunerado: "+J+" h (todo descanso es remunerado)")}}
    else if(x.kind==="permiso"){r.h.HD+=J;r.notas.push("permiso remunerado: "+J+" h")}
    else if(x.kind==="vacaciones"){r.h.HD+=J;r.notas.push("vacaciones: "+J+" h")}
    else if(x.kind==="incapacidad"){const f=Math.max(cfg.incap,cfg.smmlv/cfg.salario);r.h.HD+=J*f;r.notas.push(`incapacidad por enfermedad general: se paga ${f===cfg.incap?"2/3":"el mínimo"} del día (art. 227) = ${(J*f).toFixed(2)} h`)}
    else if(x.kind==="sancion"){r.notas.push("sanción disciplinaria: suspensión, no se paga (art. 51)")}
    else if(x.kind==="licencia"){r.notas.push("licencia no remunerada: suspensión, no se paga (art. 51)")}});
  // domingos trabajados: ¿descansa en la semana siguiente? (compensatorio → solo recargo R; si no → hora completa H)
  const usado=new Set();
  rows.forEach(r=>{const x=R(r.d);if(!x||x.kind!=="trabajo"||r.dow!==0)return;let k=null;
    if(cfg.domTrab==="R")k=-1;else if(cfg.domTrab!=="H")for(let j=r.d+1;j<=Math.min(r.d+6,N);j++){const rj=R(j);if(rj&&rj.kind==="descanso"&&!esDom(j)&&!usado.has(j)){k=j;break}}
    if(k>0){usado.add(k);rows[k-1].compDe=r.d}r.comp=k});
  // turnos
  rows.forEach(r=>{const x=R(r.d);if(!x||x.kind!=="trabajo")return;const d=r.d;
    const base=d===31?"31":(r.dow===0&&r.comp)?"comp":null;
    let ord=0;const segsOut=[];
    for(const [a,b] of x.segs.slice().sort((p,q)=>p[0]-q[0])){for(let t=a;t<b;t+=15){const off=Math.floor(t/1440),sd=d+off,m=t%1440,dom=esDom(sd),noct=m>=cfg.noct*60||m<360,extra=ord>=J*60;
        let k;if(extra)k=dom?(noct?"HEND":"HEDD"):(noct?"HEN":"HED");else{ord+=15;k=base?(dom?(noct?"RND":"RDD"):(noct?"RN":"D0")):(dom?(noct?"HND":"HDD"):(noct?"HN":"HD"))}
        r.h[k]+=0.25;const last=segsOut[segsOut.length-1];if(last&&last.k===k&&last.b===t)last.b=t+15;else segsOut.push({k,a:t,b:t+15,sd,dom,noct,extra})}}
    r.detalle=segsOut;r.base=base;r.trabajo=true});
  // descanso remunerado: domingos y festivos suman sus 7 h (si las ganó); si además los trabaja, las horas van en R o H
  rows.forEach(r=>{if(!(r.dom&&r.desc))return;r.h.HD+=r.desc.h;r.descSum=r.desc.h;
    if(r.trabajo&&r.dow===0)r.notas.push(r.comp>0?`domingo trabajado: descansa el día ${r.comp} en la semana siguiente, así que sus horas llevan solo el recargo del 90 % (R)`:r.comp===-1?"domingo trabajado: sus horas llevan solo el recargo (R)":"domingo trabajado sin descanso en la semana siguiente: sus horas se pagan completas con el recargo del 90 % (H)")});
  rows.forEach(r=>{if(r.compDe)r.notas.unshift(`descanso compensatorio del domingo ${r.compDe}`)});
  // día 31 suspendido: se restan 7 h (art. 51)
  if(N===31){const r31=rows[30],x=R(31);if(x&&(x.kind==="sancion"||x.kind==="licencia")){r31.h.HD-=J;r31.notas=[`${x.kind==="sancion"?"sanción":"licencia no remunerada"} el día 31: se restan ${J} h (art. 51), porque el salario del mes ya lo incluía`]}}
  // completar 30 días si el mes es corto
  const extra30=N<30?(30-N)*J:0;
  const q=[[],[]];rows.forEach(r=>q[r.d<=15?0:1].push(r));
  const tot=q.map(rs=>{const h=Object.fromEntries(LAB.COLS.map(k=>[k,rs.reduce((s,r)=>s+r.h[k],0)]));return{h,val:Object.fromEntries(LAB.COLS.map(k=>[k,h[k]*F[k]*vh])),total:LAB.COLS.reduce((s,k)=>s+h[k]*F[k]*vh,0)}});
  if(extra30){tot[1].h.HD+=extra30;tot[1].val.HD+=extra30*vh;tot[1].total+=extra30*vh}
  return{rows,F,vh,tot,extra30,dow,esDom}};
