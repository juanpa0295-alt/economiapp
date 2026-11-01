// Economiapp · cálculos de Macroeconomía 2 (economía abierta) como funciones puras.
// Economiapp · Macroeconomía 2 (economía abierta) como funciones puras. Notación del curso (prof. Ramón Javier Mesa).
const M2={};
// ---------- utilidades
M2.solve2=(a,b,c,d,e,f)=>{const D=a*d-b*c;if(Math.abs(D)<1e-12)return null;return[(e*d-b*f)/D,(a*f-e*c)/D]}; // a x + b y = e ; c x + d y = f
M2.solve3=(A,B)=>{const M=A.map((r,i)=>r.concat([B[i]]));for(let c=0;c<3;c++){let p=c;for(let r=c+1;r<3;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];if(Math.abs(M[c][c])<1e-12)return null;
  for(let r=0;r<3;r++)if(r!==c){const f=M[r][c]/M[c][c];for(let k=c;k<4;k++)M[r][k]-=f*M[c][k]}}return M.map((r,i)=>r[3]/r[i])};
M2.bisect=(f,a,b,n=200)=>{let fa=f(a);for(let k=0;k<n;k++){const m=(a+b)/2,fm=f(m);if(fa*fm<=0)b=m;else{a=m;fa=fm}}return(a+b)/2};
M2.sg=x=>Math.abs(x)<1e-9?0:x>0?1:-1;

// ---------- Unidad 1: paridades
M2.ppcAbs=(pLocal,pUS,eMerc)=>{const e=pLocal/pUS,des=(e/eMerc-1)*100;return{e,des,estado:des<-1e-9?"subvaluado":des>1e-9?"sobrevaluado":"en paridad"}};
M2.ppcRel=(e0,pi,piE)=>e0*(1+pi)/(1+piE);                // E_t = E_{t-1}(1+Π)/(1+Π*)
M2.ppcSpot=(eEsp,piE,pi)=>eEsp*(1+piE)/(1+pi);            // E_t = E^e_{t+1}(1+Π^e*)/(1+Π^e)
M2.pci=(s,i,iE)=>s*(1+i)/(1+iE);                          // F = S(1+i)/(1+i*)
M2.pnci=(s,i,iE,mu=0)=>s*(1+i)/((1+iE)*(1+mu));           // E^e = S(1+i)/[(1+i*)(1+μ)]
M2.tcr=(e,pE,p)=>e*pE/p;
M2.devReal=(dE,piE,pi)=>dE+piE-pi;                        // aproximación: ΔTCR/TCR = ΔE/E + Π* − Π
// ITCR con varios países: filas {pais, pi, tcn0, tcn1, w}; col = {pi, tcn0, tcn1} (pesos por dólar)
M2.itcr=function(col,rows){const sw=rows.reduce((s,r)=>s+r.w,0),icol=col.tcn1/col.tcn0;
  const det=rows.map(r=>{const itcn=r.tcn1/r.tcn0,itca=icol/itcn,ipx=1+r.pi,wn=r.w/sw;return{...r,itcn,itca,ipx,wn,prod:wn*ipx*itca}});
  const num=det.reduce((s,r)=>s+r.prod,0),ipc=1+col.pi;return{det,num,ipc,itcr:num/ipc,icol}};

// ---------- Unidad 1: registro en la balanza de pagos (partida doble)
M2.BPT={
 flores:{t:"Exportadores envían flores por US$10.000 y reciben un depósito en un banco de EE. UU.",v:10000,e:[["CC","Bienes: exportaciones","C"],["CF","Otra inversión: activos (depósitos en el exterior)","D"]],x:"La exportación es un crédito en la cuenta corriente. El depósito en EE. UU. es un aumento de activos externos de residentes, que se registra como débito en la cuenta financiera."},
 remesa:{t:"Un colombiano en España envía US$1.000 mensuales a su familia por transferencia bancaria.",v:1000,e:[["CC","Ingreso secundario: remesas de trabajadores","C"],["CF","Otra inversión o reservas: aumento de activos en divisas","D"]],x:"La remesa es una transferencia corriente recibida: crédito en la cuenta corriente (ingreso secundario). Las divisas que entran aumentan los activos externos del banco o del Banco de la República: débito en la cuenta financiera o en reservas."},
 prestamo:{t:"El Gobierno recibe un préstamo de US$100 millones de un banco internacional, a 5 años.",v:100e6,e:[["CF","Otra inversión: pasivos (préstamo de largo plazo al Gobierno)","C"],["CF","Otra inversión o reservas: aumento de activos (depósitos del Gobierno)","D"]],x:"Las dos partidas están en la cuenta financiera: aumenta un pasivo externo (crédito) y aumentan los activos en divisas mientras se gastan (débito). No toca la cuenta corriente hasta que se paguen intereses."},
 maquina:{t:"Una empresa importa maquinaria de Alemania por 3 millones de euros y paga por transferencia.",v:3e6,e:[["CC","Bienes: importaciones","D"],["CF","Otra inversión: disminución de activos (depósitos en el exterior)","C"]],x:"La importación es un débito en la cuenta corriente. El pago reduce los depósitos en el exterior: una disminución de activos externos es un crédito en la cuenta financiera."},
 condona:{t:"Un gobierno extranjero condona una deuda del Gobierno colombiano.",v:0,e:[["CK","Cuenta de capital: transferencias de capital recibidas","C"],["CF","Otra inversión: disminución de pasivos (la deuda condonada)","D"]],x:"La condonación es una transferencia de capital: va en la cuenta de capital como crédito. La deuda que desaparece es una disminución de pasivos: débito en la cuenta financiera."},
 remesaEnv:{t:"Un trabajador extranjero en Colombia envía remesas a su país.",v:0,e:[["CC","Ingreso secundario: remesas enviadas","D"],["CF","Otra inversión: disminución de activos en divisas","C"]],x:"Es una transferencia corriente pagada: débito en la cuenta corriente. Salen divisas: disminución de activos, crédito en la cuenta financiera."},
 ied:{t:"Una multinacional invierte US$50 millones en una planta en Colombia.",v:50e6,e:[["CF","Inversión directa: pasivos (IED en Colombia)","C"],["CF","Otra inversión o reservas: aumento de activos en divisas","D"]],x:"La IED en Colombia aumenta los pasivos externos del país: crédito. Las divisas que entran aumentan los activos: débito."},
 dividendos:{t:"Una filial gira dividendos a su casa matriz en el exterior.",v:0,e:[["CC","Ingreso primario: renta de la inversión pagada","D"],["CF","Otra inversión: disminución de activos en divisas","C"]],x:"Los dividendos pagados a no residentes son ingreso primario pagado: débito en la cuenta corriente."},
 intereses:{t:"El Gobierno paga intereses de su deuda externa.",v:0,e:[["CC","Ingreso primario: intereses pagados","D"],["CF","Otra inversión o reservas: disminución de activos","C"]],x:"Los intereses son renta de la inversión: ingreso primario pagado (débito en la cuenta corriente)."},
 turista:{t:"Turistas extranjeros gastan en hoteles colombianos y pagan con tarjeta.",v:0,e:[["CC","Servicios: viajes (exportación de servicios)","C"],["CF","Otra inversión: aumento de activos en divisas","D"]],x:"El gasto de no residentes en Colombia es una exportación de servicios (viajes): crédito en la cuenta corriente."},
 bonos:{t:"Inversionistas extranjeros compran TES colombianos.",v:0,e:[["CF","Inversión de cartera: pasivos (TES en manos de no residentes)","C"],["CF","Otra inversión o reservas: aumento de activos en divisas","D"]],x:"Es inversión de cartera: aumentan los pasivos de Colombia con el exterior (crédito)."},
 banrep:{t:"El Banco de la República compra dólares en el mercado cambiario.",v:0,e:[["RI","Activos de reserva: aumento de reservas internacionales","D"],["CF","Otra inversión: disminución de activos en divisas de los bancos","C"]],x:"Un aumento de reservas es un débito (aumento de activos externos del Banco Central). Los bancos que le venden los dólares reducen sus activos externos: crédito."},
 donacion:{t:"Colombia recibe una donación en alimentos de un organismo internacional.",v:0,e:[["CC","Bienes: importaciones (los alimentos que entran)","D"],["CC","Ingreso secundario: transferencias corrientes recibidas","C"]],x:"Los bienes que entran son una importación (débito) y, como no se pagan, la contrapartida es una transferencia corriente recibida (crédito). Ambas partidas en la cuenta corriente."},
 cafe:{t:"Se exporta café por US$5 millones y los exportadores venden los dólares al Banco de la República.",v:5e6,e:[["CC","Bienes: exportaciones","C"],["RI","Activos de reserva: aumento de reservas","D"]],x:"La exportación es crédito en la cuenta corriente; el aumento de reservas internacionales es débito."}};

// ---------- Unidad 2B: Mundell-Fleming (EMB-EMM-BP) con números
// EMB: Y = C0 + c(Y−T) + I0 − b·i + G + XN ;  XN = x0 + v·R + z·Y* − m·Y ;  R = E·P*/P
// EMM: M/P = L0 + k·Y − h·i ;  BP = XN + F·(i − i* − ee) + fa
M2.MFBASE={C0:100,c:0.75,T:200,I0:300,b:20,G:100,x0:0,v:100,z:0.1,Ys:1000,m:0.2,k:0.5,h:50,L0:0,M:250,P:1,is:5,ee:0,fa:0,E:1,Ps:1,F:{none:0,steep:5,flat:100,perfect:Infinity}};
M2.MFSHOCK={
  G:{t:"Gasto público (G)",k:"G",d:45,g:"emb"}, T:{t:"Impuestos (T)",k:"T",d:40,g:"emb"}, C0:{t:"Consumo autónomo (C)",k:"C0",d:30,g:"emb"}, I0:{t:"Inversión autónoma (I)",k:"I0",d:30,g:"emb"},
  M:{t:"Oferta monetaria (M)",k:"M",d:50,g:"emm"}, L0:{t:"Demanda de dinero (L)",k:"L0",d:25,g:"emm"},
  x0:{t:"Exportaciones autónomas (X*)",k:"x0",d:20,g:"ext"}, q0:{t:"Importaciones autónomas (Q*)",k:"x0",d:-20,g:"ext"}, Ys:{t:"Renta mundial (Y*)",k:"Ys",d:200,g:"ext"}, Ps:{t:"Precios internacionales (P*)",k:"Ps",d:0.1,g:"ext"},
  is:{t:"Tasa de interés mundial (i*)",k:"is",d:1,g:"bp"}, ee:{t:"Expectativas de devaluación",k:"ee",d:1,g:"bp"}, fa:{t:"Flujos de capital autónomos (entrada)",k:"fa",d:20,g:"bp"},
  E:{t:"Devaluación decretada (E), solo con tipo de cambio fijo",k:"E",d:0.1,g:"cam"}};
M2.mfParts=p=>{const R=p.E*p.Ps/p.P,s=1-p.c+p.m,A0=p.C0-p.c*p.T+p.I0+p.G+p.x0+p.z*p.Ys;return{R,s,A0}};
M2.mfIS=(p,Y)=>{const{R,s,A0}=M2.mfParts(p);return(A0+p.v*R-s*Y)/p.b};          // i sobre la EMB
M2.mfLM=(p,Y)=>(p.L0+p.k*Y-p.M/p.P)/p.h;                                          // i sobre la EMM
M2.mfXN=(p,Y)=>{const{R}=M2.mfParts(p);return p.x0+p.v*R+p.z*p.Ys-p.m*Y};
M2.mfBPline=(p,F,Y)=>F===Infinity?p.is+p.ee:F===0?null:p.is+p.ee-(M2.mfXN(p,Y)+p.fa)/F;  // i sobre la BP=0
M2.mfBPY=(p)=>{const{R}=M2.mfParts(p);return(p.x0+p.v*R+p.z*p.Ys)/p.m};          // BP vertical (sin capitales)
M2.mfBP=(p,F,Y,i)=>{const xn=M2.mfXN(p,Y),gap=i-p.is-p.ee;if(F===Infinity)return{xn,fc:gap>1e-9?Infinity:gap<-1e-9?-Infinity:0,bp:Math.abs(gap)>1e-9?(gap>0?Infinity:-Infinity):xn+p.fa};const fc=F*gap+(F>0?p.fa:0);return{xn,fc,bp:xn+fc}};
M2.mfInternal=p=>{const{R,s,A0}=M2.mfParts(p);const r=M2.solve2(s,p.b,p.k,-p.h,A0+p.v*R,p.M/p.P-p.L0);return{Y:r[0],i:r[1]}};
M2.mfFixed=(p,F)=>{const{R,s,A0}=M2.mfParts(p);let Y,i;
  if(F===Infinity){i=p.is+p.ee;Y=(A0+p.v*R-p.b*i)/s}
  else if(F===0){Y=M2.mfBPY(p);i=(A0+p.v*R-s*Y)/p.b}
  else{const r=M2.solve2(s,p.b,-p.m,F,A0+p.v*R,-(p.x0+p.v*R+p.z*p.Ys+p.fa)+F*(p.is+p.ee));Y=r[0];i=r[1]}
  const M=p.P*(p.L0+p.k*Y-p.h*i);return{Y,i,M,E:p.E}};
M2.mfFlex=(p,F)=>{const{s,A0}=M2.mfParts(p),a0=A0;let Y,i,R;
  if(F===Infinity){i=p.is+p.ee;Y=(p.M/p.P-p.L0+p.h*i)/p.k;R=(s*Y+p.b*i-a0)/p.v}
  else{const r=M2.solve3([[s,p.b,-p.v],[p.k,-p.h,0],[-p.m,F,p.v]],[a0,p.M/p.P-p.L0,-(p.x0+p.z*p.Ys+(F>0?p.fa:0))+F*(p.is+p.ee)]);Y=r[0];i=r[1];R=r[2]}
  return{Y,i,R,E:R*p.P/p.Ps,M:p.M}};
// escenario completo: mob ∈ none|steep|flat|perfect; reg ∈ fijo|flexible; dir = +1 aumento, −1 disminución
M2.mf=function(mob,reg,shock,dir){const B=M2.MFBASE,F=B.F[mob],sh=M2.MFSHOCK[shock];
  const p0={...B};delete p0.F;const p1={...p0};
  const delta=sh.d*dir;if(sh.k==="Ps"||sh.k==="E")p1[sh.k]=p0[sh.k]*(1+delta);else p1[sh.k]=p0[sh.k]+delta;
  const e0={Y:1000,i:5,E:1,M:p0.M};
  // punto 1: efecto impacto (equilibrio interno EMB=EMM con E y M dados). Una devaluación decretada mueve EMB por el TCR.
  const q1=M2.mfInternal(p1);const bp1=M2.mfBP(p1,F,q1.Y,q1.i);
  let e2,p2={...p1};
  if(reg==="fijo"){e2=M2.mfFixed(p1,F);p2.M=e2.M}else{if(shock==="E"){e2=M2.mfFlex(p0,F)}else{e2=M2.mfFlex(p1,F)};p2.E=e2.E}
  if(reg!=="fijo"&&shock==="E")p2=p0;
  const bp0=M2.mfBP(p0,F,e0.Y,e0.i),bp2=M2.mfBP(p2,F,e2.Y,e2.i);
  // descomposición del saldo en el punto 1
  const dXN=M2.mfXN(p1,q1.Y)-M2.mfXN(p0,e0.Y),dTradeExo=M2.mfXN(p1,e0.Y)-M2.mfXN(p0,e0.Y),dTradeY=-p0.m*(q1.Y-e0.Y);
  return{F,mob,reg,shock,dir,sh,p0,p1,p2,e0,q1:{...q1,E:p1.E,M:p1.M},e2,bp0,bp1,bp2,dXN,dTradeExo,dTradeY,dRI:reg==="fijo"?(e2.M-p1.M):0}};
// zona de un punto (Y, i) en cada mercado
M2.mfZona=(p,F,Y,i)=>{const{R,s,A0}=M2.mfParts(p),da=A0+p.v*R+(1-s)*Y-p.b*i,gB=da-Y,gM=(p.L0+p.k*Y-p.h*i)-p.M/p.P,b=M2.mfBP(p,F,Y,i).bp;
  return{bienes:Math.abs(gB)<1e-6?"equilibrio":gB>0?"EDB":"EOB",dinero:Math.abs(gM)<1e-6?"equilibrio":gM>0?"EDM":"EOM",bp:Math.abs(b)<1e-6?"equilibrio":b>0?"superávit (EOD)":"déficit (EDD)"}};

// ---------- Unidad 2A: modelo Krugman EMA–EMB en el plano (Y, E)
// EMB: s·Y = D0 + v·E·P*/P  (inversión dada) ;  EMA: M/P = L0 + kY − h·i  con  i = i* + θ·(Ee − E)/E  (PNCI, i en %)
M2.KBASE={D0:50,s:0.45,v:400,Ps:1,P:1,k:0.5,h:50,L0:0,M:250,is:5,Ee:1,E:1,th:10};
M2.KSHOCK={M:{t:"Oferta monetaria (M)",k:"M",d:50,g:"ema"},L0:{t:"Demanda de dinero (L)",k:"L0",d:25,g:"ema"},is:{t:"Tasa de interés mundial (i*)",k:"is",d:1,g:"ema"},Ee:{t:"Tipo de cambio esperado (Eᵉ)",k:"Ee",d:0.05,g:"ema"},
  G:{t:"Gasto público (G)",k:"D0",d:45,g:"emb"},T:{t:"Impuestos (T)",k:"D0",d:-30,g:"emb"},X:{t:"Demanda externa (X*, Y*)",k:"D0",d:20,g:"emb"}};
M2.kEMB=(p,Y)=>(p.s*Y-p.D0)/(p.v*p.Ps/p.P);                                // E sobre la EMB
M2.kI=(p,Y)=>(p.L0+p.k*Y-p.M/p.P)/p.h;
M2.kEMA=(p,Y)=>p.Ee/(1+(M2.kI(p,Y)-p.is)/p.th);                             // E sobre la EMA
M2.kEq=p=>{const Y=M2.bisect(y=>M2.kEMB(p,y)-M2.kEMA(p,y),300,3000);return{Y,E:M2.kEMA(p,Y),i:M2.kI(p,Y)}};
M2.krug=function(reg,shock,dir){const p0={...M2.KBASE},sh=M2.KSHOCK[shock],p1={...p0};p1[sh.k]=p0[sh.k]+sh.d*dir;
  const e0=M2.kEq(p0);let A,e2,p2={...p1};
  if(reg==="flexible"){
    // impacto: el mercado de activos se ajusta de inmediato (punto A sobre la nueva EMA con Y dado) o el de bienes (Y sobre la nueva EMB con E dado)
    A=sh.g==="ema"?{Y:e0.Y,E:M2.kEMA(p1,e0.Y)}:{Y:(p1.D0+p1.v*e0.E)/p1.s,E:e0.E};e2=M2.kEq(p1)}
  else{ // fijo: E = Ē; el BC compra o vende divisas (∆M) hasta que la EMA pase por el nuevo equilibrio
    const Ebar=p0.E;const Yf=(p1.D0+p1.v*Ebar*p1.Ps/p1.P)/p1.s;
    // punto imaginario A: donde la nueva EMA corta Ē (choques de activos) o donde la nueva EMB corta Ē
    if(sh.g==="ema"){const ya=M2.bisect(y=>M2.kEMA(p1,y)-Ebar,100,5000);A={Y:ya,E:Ebar}}else A={Y:Yf,E:Ebar};
    const iNeed=p1.is+p1.th*(p1.Ee-Ebar)/Ebar;p2.M=p1.P*(p1.L0+p1.k*Yf-p1.h*iNeed);e2={Y:Yf,E:Ebar,i:iNeed}}
  return{reg,shock,dir,sh,p0,p1,p2,e0,A,e2,dM:p2.M-p1.M}};

// ---------- Unidades 3 y 4: modelo SA–DA de los cuatro planos
// DA (cerrada): IS  s·Y = A0 − b·i ; LM  M/P = k·Y − h·i.  Oferta: Y = A·√N ; demanda de trabajo W = P·FN = P·A/(2√N) ;
// oferta de trabajo W = Pᵉ·g·N (clásicos) o salario mínimo W̄ (NMK) o P fijo (keynesiano tradicional).
M2.SBASE={A0:1000,s:0.5,b:50,k:0.5,h:25,M:250,Aprod:100,g:0.05,P:1,Pe:1,cw:0};
M2.SMOD={clasico:"Macroeconomía clásica tradicional",nmc:"Nueva macroeconomía clásica",keynes:"Macroeconomía keynesiana tradicional",nmk:"Nueva macroeconomía keynesiana"};
M2.SSHOCK={Mup:{t:"Política monetaria expansiva (∆M)",k:"M",d:50},Mdn:{t:"Política monetaria contractiva (∆−M)",k:"M",d:-50},Gup:{t:"Política fiscal expansiva (∆G)",k:"A0",d:60},
  Cdn:{t:"Caída del consumo nacional (∆−C)",k:"A0",d:-60},Tup:{t:"Aumento de impuestos (∆T)",k:"A0",d:-45},oil:{t:"Alza del precio internacional del petróleo (insumo importado)",k:"cw",d:0.15,da:10},oilDn:{t:"Caída del precio internacional del petróleo",k:"cw",d:-0.1,da:-10}};
M2.sDA=(p,P)=>(p.A0+(p.b/p.h)*p.M/P)/(p.s+p.b*p.k/p.h);                    // Y de la DA dado P
M2.sI=(p,Y,P)=>(p.k*Y-p.M/P)/p.h;
M2.sN=(Y,p)=>(Y/p.Aprod)**2; M2.sY=(N,p)=>p.Aprod*Math.sqrt(N); M2.sFN=(N,p)=>p.Aprod/(2*Math.sqrt(N))/(1+p.cw);  // FN neto del costo del insumo importado (cw)
M2.sNclas=p=>Math.pow(p.Aprod/(2*p.g*(1+p.cw)),2/3);                                 // FN = g·N  (Pᵉ = P)
M2.sNnmc=(p,P,Pe)=>M2.bisect(N=>P*M2.sFN(N,p)-Pe*p.g*N,0.01,10000);          // P·FN = Pᵉ·g·N
M2.sNnmk=(p,P,W)=>Math.pow(p.Aprod*P/(2*W*(1+p.cw)),2);                                // W̄ = P·FN
M2.sState=(mod,p,P,extra)=>{let N,Y,W;
  if(mod==="clasico"){N=M2.sNclas(p);Y=M2.sY(N,p);W=P*M2.sFN(N,p)}
  else if(mod==="nmc"){N=M2.sNnmc(p,P,extra.Pe);Y=M2.sY(N,p);W=P*M2.sFN(N,p)}
  else if(mod==="nmk"){N=M2.sNnmk(p,P,extra.W);Y=M2.sY(N,p);W=extra.W}
  else{Y=M2.sDA(p,P);N=M2.sN(Y,p);W=extra.W}
  return{N,Y,W,P,wr:W/P,i:M2.sI(p,Y,P)}};
// calibración: equilibrio inicial con P = 1 en cada modelo
M2.sInit=mod=>{const p={...M2.SBASE};let W,Pe=1;
  if(mod==="nmk"){W=5.4;const N=M2.sNnmk(p,1,W),Y=M2.sY(N,p);p.A0=Y*(p.s+p.b*p.k/p.h)-(p.b/p.h)*p.M}
  else if(mod==="keynes"){const N=M2.sNclas(p);W=1*M2.sFN(N,p)}
  else{const N=M2.sNclas(p);W=M2.sFN(N,p)}
  return{p,W,Pe}};
M2.sada=function(mod,shock){const{p:p0,W:W0,Pe:Pe0}=M2.sInit(mod),sh=M2.SSHOCK[shock],p1={...p0};p1[sh.k]=p0[sh.k]+sh.d;if(sh.da)p1.A0+=sh.da;
  const st=[];const s0=M2.sState(mod,p0,1,{W:W0,Pe:Pe0});st.push({lab:"Equilibrio inicial",...s0,ybar:M2.sY(M2.sNclas(p0),p0)});
  const ybar1=M2.sY(M2.sNclas(p1),p1);
  if(mod==="keynes"){ // precios fijos: un choque de costos sube el nivel de precios fijado; la DA determina Y
    let P1=1;if(sh.k==="cw")P1=(1+p1.cw)/(1+p0.cw);const W1=W0;const s1=M2.sState(mod,p1,P1,{W:W1});st.push({lab:"Efecto final (la DA determina Y)",...s1,ybar:ybar1})}
  else{
    // 1. impacto: precios aún fijos; la DA cambia el producto (el dinero vía i, el gasto vía DA)
    const Yimp=M2.sDA(p1,1);st.push({lab:"Impacto (precios todavía fijos)",Y:Yimp,P:1,i:M2.sI(p1,Yimp,1),N:st[0].N,W:st[0].W,wr:st[0].W,ybar:ybar1,dis:true});
    if(mod==="clasico"){const P2=M2.bisect(P=>M2.sDA(p1,P)-ybar1,0.05,20);const s2=M2.sState(mod,p1,P2,{});st.push({lab:"Ajuste de precios y salarios (pleno empleo)",...s2,ybar:ybar1})}
    else if(mod==="nmc"){const P2=M2.bisect(P=>M2.sDA(p1,P)-M2.sState(mod,p1,P,{Pe:Pe0}).Y,0.05,20);st.push({lab:"Corto plazo: suben los precios con Pᵉ dado (asimetría de información)",...M2.sState(mod,p1,P2,{Pe:Pe0}),ybar:ybar1});
      const P3=M2.bisect(P=>M2.sDA(p1,P)-ybar1,0.05,20);st.push({lab:"Largo plazo: los trabajadores corrigen Pᵉ = P",...M2.sState(mod,p1,P3,{Pe:P3}),ybar:ybar1})}
    else{const P2=M2.bisect(P=>M2.sDA(p1,P)-M2.sState(mod,p1,P,{W:W0}).Y,0.05,20);st.push({lab:"Ajuste con el salario mínimo fijo (W̄)",...M2.sState(mod,p1,P2,{W:W0}),ybar:ybar1})}}
  return{mod,shock,sh,p0,p1,W0,Pe0,st}};

// ---------- Unidad 5: modelo (i, P) con intervención esterilizada y no esterilizada (tipo de cambio fijo, Y = Ȳ)
// EMB: s·Ȳ = A0 − b·i + v·E·P*/P ;  EMF:  M/P = k·Ȳ − h·i ;  sin esterilizar M = M0 + μ·(i − i*)
M2.IBASE={A0:500,s:0.5,Yb:1000,b:20,v:100,E:1,Ps:1,k:0.5,h:50,M0:250,mu:50,is:5};
M2.ISHOCK={G:{t:"Política fiscal expansiva (∆G)",k:"A0",d:40},T:{t:"Aumento de impuestos (∆T)",k:"A0",d:-30},M:{t:"Política monetaria expansiva (∆M)",k:"M0",d:50},is:{t:"Alza de la tasa de interés internacional (∆i*)",k:"is",d:1},X:{t:"Aumento de la demanda por exportaciones",k:"A0",d:30}};
M2.iEMB=(p,P)=>(p.A0+p.v*p.E*p.Ps/P-p.s*p.Yb)/p.b;
M2.iEMFS=(p,P)=>(p.k*p.Yb-p.M0/P)/p.h;
M2.iEMFN=(p,P)=>(p.k*p.Yb-(p.M0-p.mu*p.is)/P)/(p.h+p.mu/P);
M2.iEq=(p,f)=>{const P=M2.bisect(P=>M2.iEMB(p,P)-f(p,P),0.2,10);return{P,i:M2.iEMB(p,P)}};
M2.ip=function(shock,dir){const p0={...M2.IBASE},sh=M2.ISHOCK[shock],p1={...p0};p1[sh.k]=p0[sh.k]+sh.d*dir;
  const e0=M2.iEq(p0,M2.iEMFS),S=M2.iEq(p1,M2.iEMFS),Nn=M2.iEq(p1,M2.iEMFN);
  const Mn=p1.M0+p1.mu*(Nn.i-p1.is);return{shock,dir,sh,p0,p1,e0,S,N:{...Nn,M:Mn}}};

// ---------- Unidad 6: transables (T) y no transables (N): curvas TT (equilibrio externo) y NN (equilibrio interno) en (Z, TCR)
// TT: YT = DT − TR  →  (a1+d1)·TCR = d0 + d2·Z − TR − YTx ;  NN: (n1+e1)·TCR = n0 − e2·Z
M2.TBASE={a1:100,d0:100,d1:50,d2:0.5,TR:0,YTx:0,n0:150,n1:50,e1:50,e2:0.5,Z:100,TCR:1};
M2.TSHOCK={remUp:{t:"Aumento de las remesas",TR:20,Z:15},remDn:{t:"Disminución de las remesas",TR:-20,Z:-15},boom:{t:"Boom petrolero (más exportaciones de T)",YTx:25,Z:15},
  gasto:{t:"Aumento del gasto público (Z)",Z:20},prod:{t:"Aumento de la productividad en transables",a1:30},tiUp:{t:"Mejora de los términos de intercambio",YTx:15,Z:8},
  deval:{t:"Devaluación nominal sin control del gasto",TCRobs:0.15},ajuste:{t:"Reducción del gasto interno (∆−Z)",Z:-20}};
M2.tTT=(p,Z)=>(p.d0+p.d2*Z-p.TR-p.YTx)/(p.a1+p.d1);
M2.tNN=(p,Z)=>(p.n0-p.e2*Z)/(p.n1+p.e1);
M2.tEq=p=>{const Z=((p.n0)/(p.n1+p.e1)-(p.d0-p.TR-p.YTx)/(p.a1+p.d1))/(p.d2/(p.a1+p.d1)+p.e2/(p.n1+p.e1));return{Z,TCR:M2.tNN(p,Z)}};
M2.tZona=(p,Z,T)=>({ext:Math.abs(T-M2.tTT(p,Z))<1e-6?"equilibrio externo":T>M2.tTT(p,Z)?"superávit comercial (EOT)":"déficit comercial (EDT)",int:Math.abs(T-M2.tNN(p,Z))<1e-6?"equilibrio interno":T>M2.tNN(p,Z)?"sobreempleo (EDN)":"desempleo (EON)"});
M2.tn=function(shock){const p0={...M2.TBASE},sh=M2.TSHOCK[shock],p1={...p0};
  ["TR","YTx","a1"].forEach(k=>{if(sh[k])p1[k]+=sh[k]});const e0=M2.tEq(p0),e1=M2.tEq(p1);
  const obs={Z:e0.Z+(sh.Z||0),TCR:e0.TCR+(sh.TCRobs||0)};return{shock,sh,p0,p1,e0,e1,obs,zona:M2.tZona(p1,obs.Z,obs.TCR)}};

// ---------- Unidad 7: financiamiento del déficit fiscal
M2.impInfl=(def,mp)=>({rho:def/(mp-def),tasa:def/mp});            // DEF = [ρ/(1+ρ)]·(M/P)  →  ρ = DEF/(M/P − DEF)
M2.defFijo=(pdef,E)=>-pdef/E;                                     // PDEF = −E·∆RI → ∆RI = −PDEF/E
