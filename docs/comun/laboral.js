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
LAB.prorrogas=function(inicio,meses,corte){
  const ref=LAB.cmp(inicio,LAB.parse(LEY.reforma))<0?LAB.parse(LEY.reforma):inicio,tope=LAB.addDays(LAB.endOf(ref,48),0);
  const per=[];let s=inicio,n=0,conv=null;
  while(per.length<60){if(LAB.cmp(s,tope)>0){conv=s;break}const dur=n===0?meses:(meses<12&&n>=4?12:meses),e=LAB.endOf(s,dur);
    const p={n,inicio:s,fin:e,meses:dur,preaviso:LAB.addDays(e,-30),excede:LAB.cmp(e,tope)>0};
    if(p.excede){conv=LAB.addDays(tope,1);p.fin=tope;p.recortado=true;per.push(p);break}
    per.push(p);
    s=LAB.addDays(e,1);n++}
  const actual=corte?per.find(p=>LAB.cmp(p.inicio,corte)<=0&&LAB.cmp(corte,p.fin)<=0)||null:null;
  return{periodos:per,ref,tope,conversion:conv,actual,antesReforma:LAB.cmp(inicio,LAB.parse(LEY.reforma))<0,indefinidoEnCorte:conv&&corte&&LAB.cmp(corte,conv)>=0}};

// ---------- art. 64: indemnización por despido sin justa causa
LAB.indemnizacion=function({tipo,salario,inicio,despido,finPactado,smmlv}){
  const diario=salario/30;
  if(tipo==="fijo"||tipo==="obra"){const falta=Math.max(0,LAB.days360(despido,finPactado)),dias=tipo==="obra"?Math.max(15,falta):falta;
    return{diario,falta,dias,valor:dias*diario,minimo15:tipo==="obra"&&falta<15}}
  const servicio=LAB.days360(inicio,despido)+1,anios=servicio/360,alto=salario>=10*smmlv,p1=alto?20:30,pn=alto?15:20;
  const dias=anios<=1?p1:p1+pn*(anios-1);
  return{diario,servicio,anios,alto,p1,pn,dias,valor:dias*diario}};
// ---------- art. 65: indemnización moratoria
LAB.moratoria=function({salario,diasRetardo,smmlv}){const diario=salario/30,minimo=salario<=smmlv,tope=minimo?Infinity:720,dias=Math.min(diasRetardo,tope);
  return{diario,minimo,dias,valor:dias*diario,intereses:!minimo&&diasRetardo>720,diasInteres:Math.max(0,diasRetardo-720)}};

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
