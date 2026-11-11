// Visuales de cambios de Principios de Macroeconomía (usa el motor comun/visual.js)
// Parámetros base: C0 = 100, T = 100, I0 = 200, G = 100, b = 10, k = 0,5, h = 25, M/P = 300.

// 1. Cruz keynesiana: DA = gasto autónomo + c1·Y contra la recta de 45°
VIS.add("keynes",{t:"Cruz keynesiana: demanda agregada y recta de 45°",
  hint:"Arrastra la DA hacia arriba o hacia abajo (cambio del gasto autónomo). Cambia c₁ para ver cómo cambia el multiplicador.",
  opts:[{id:"c1",lab:"Propensión a consumir c₁",ch:[["0.6","0,6"],["0.75","0,75"],["0.8","0,8"]],v:"0.8"}],
  p0:{dA:0},lim:{dA:[-120,120]},
  presets:[["∆G = +40",{dA:40}],["∆T = +50",{dA:-1}],["∆I = −30",{dA:-30}],["∆G = ∆T = +50",{dA:0.001}]],
  fit:{dA:(Y,D,st)=>{const c=+st.o.c1,A0=100-c*100+200+100;return D-c*Y-A0}},
  compute(st){const c=+st.o.c1,A0=100-c*100+200+100,m=1/(1-c);let dA=st.p.dA,nota="";
    if(Math.abs(dA+1)<1e-9){dA=-c*50;nota="Una subida de impuestos de 50 reduce el ingreso disponible en 50 y el consumo en c₁·50 = "+VIS.n(c*50,1)+": la DA baja ese monto, no los 50 completos."}
    if(Math.abs(dA-0.001)<1e-9){dA=50-c*50;nota="Con ∆G = ∆T = 50 la DA sube 50 por el gasto y baja c₁·50 por los impuestos: neto, sube (1 − c₁)·50 = "+VIS.n(50-c*50,1)+". Multiplicado por 1/(1 − c₁), el PIB sube exactamente 50: el multiplicador del presupuesto equilibrado es 1."}
    const A=A0+dA,Y0=A0*m,Y1=A*m,DA=a=>Y=>a+c*Y,mv=Math.abs(dA)>0.5;
    const curves=[{sh:VIS.fx(Y=>Y),col:"--muted",w:1.6,lab:"45°: DA = Y"},{sh:VIS.fx(DA(A0)),col:"--line",dash:1,op:.55,lab:mv?"DA":""},{sh:VIS.fx(DA(A)),col:"--line",lab:mv?"DA’":"DA = C + I + G"}];
    const pts=[{x:Y0,y:Y0,lab:"0"}],segs=[];if(mv){pts.push({x:Y1,y:Y1,lab:"1",col:"--good"});segs.push({x1:Y0,y1:Y0,x2:Y0,y2:DA(A)(Y0),col:"--bad",w:3,lab:dA>0?"DA > Y":"DA < Y"});segs.push({x1:Y0,y1:120,x2:Y1,y2:120,col:"--good",arrow:1,lab:"∆Y"})}
    const hx=1700,P={cap:"Cruz keynesiana · c₁ = "+VIS.n(c,2),xr:[0,2400],yr:[0,2400],xl:"Ingreso Y",yl:"Demanda agregada DA",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,handles:[{c:"dA",x:hx,y:DA(A)(hx),col:"--line",name:"la DA"}]};
    let h;if(!mv)h=`<p>Todavía no hay cambios. El equilibrio está donde la DA corta la recta de 45°: Y* = gasto autónomo × multiplicador = ${VIS.n(A0,0)} × ${VIS.n(m,2)} = ${VIS.n(Y0,0)}. Arrastra la DA o prueba un choque.</p>`;
    else{h=VIS.sec("Qué cambió",VIS.list([`La DA se desplazó <b>${dA>0?"hacia arriba":"hacia abajo"}</b> en ${VIS.n(Math.abs(dA),1)}: el gasto autónomo pasó de ${VIS.n(A0,0)} a ${VIS.n(A,0)}.`]));
      h+=VIS.sec("Qué pudo haberlo causado",(nota?`<p>${nota}</p>`:"")+VIS.list([dA>0?"∆+G o ∆+I (entran completos a la DA), ∆+C₀ (más consumo autónomo) o ∆-T (sube la DA en c₁·∆T).":"∆-G o ∆-I, ∆-C₀ o ∆+T (baja la DA en c₁·∆T)."]));
      h+=VIS.sec("Mecanismo",`<p>Al ingreso inicial ${VIS.n(Y0,0)} ahora ${dA>0?"la demanda supera a la producción: se desacumulan inventarios y las empresas producen más":"la producción supera a la demanda: se acumulan inventarios y las empresas producen menos"}. El nuevo ingreso genera más (menos) consumo, y así en rondas: ${VIS.n(Math.abs(dA),1)} × (1 + ${VIS.n(c,2)} + ${VIS.n(c,2)}² + …) = ${VIS.n(Math.abs(dA),1)} × ${VIS.n(m,2)}.</p><div class="eq al chain">∆Y = ∆A / (1 − c₁) = ${VIS.n(dA,1)} / ${VIS.n(1-c,2)} = ${VIS.n(Y1-Y0,1)}</div>`);
      h+=VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Ingreso Y*",Y0,Y1,0),["Multiplicador",VIS.n(m,2)],VIS.tile("Consumo C",100+c*(Y0-100),100+c*(Y1-100),0)])}</div>`)}
    return{panels:[P],text:h}}});

// 2. Mercado de dinero en (M/P, r): oferta vertical, demanda L = kY − hr
VIS.add("dinero",{t:"Mercado de dinero: oferta real y demanda L(r, Y)",
  hint:"Arrastra la oferta monetaria real (vertical) o la demanda de dinero (cambia con el ingreso Y).",
  p0:{M:300,Y:1100},lim:{M:[150,450],Y:[800,1400]},
  presets:[["El banco central expande M",{M:375}],["Sube el ingreso Y",{Y:1300}],["Suben los precios P",{M:240}]],
  fit:{M:x=>x,Y:(m,r)=>(m+25*r)/0.5},
  compute(st){const{M,Y}=st.p,L=y=>m=>(0.5*y-m)/25,r0=L(1100)(300),r1=L(Y)(M),mM=Math.abs(M-300)>1,mY=Math.abs(Y-1100)>2;
    const curves=[{sh:VIS.vx(300),col:"--line",dash:1,op:.55,lab:mM?"M/P":""},{sh:VIS.fx(L(1100)),col:"--branch",dash:1,op:.55,lab:mY?"L":""},{sh:VIS.vx(M),col:"--line",lab:mM?"M/P’":"M/P (oferta)"},{sh:VIS.fx(L(Y)),col:"--branch",lab:mY?"L’ = kY’ − hr":"L = kY − hr"}];
    const pts=[{x:300,y:r0,lab:"0"}];if(mM||mY)pts.push({x:M,y:r1,lab:"1",col:"--good"});
    const hx=VIS.clamp(0.5*Y-25*4,20,580),P={cap:"Mercado de dinero",xr:[0,600],yr:[0,20],xl:"Saldos reales M/P",yl:"Tasa de interés r (%)",fx:v=>VIS.n(v,0),curves,pts,handles:[{c:"M",x:M,y:18,col:"--line",name:"la oferta monetaria"},{c:"Y",x:hx,y:L(Y)(hx),col:"--branch",name:"la demanda de dinero"}]};
    let h;if(!mM&&!mY)h=`<p>Todavía no hay cambios: r* = (kY − M/P)/h = (0,5·1.100 − 300)/25 = ${VIS.n(r0,1)} %. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mM){mv.push(`La oferta real se desplazó <b>${M>300?"a la derecha":"a la izquierda"}</b> (M/P = ${VIS.n(M,0)}).`);cs.push(M>300?"El banco central aumenta M (compra bonos) o bajan los precios P.":"El banco central reduce M (vende bonos) o suben los precios P.")}
      if(mY){mv.push(`La demanda de dinero se desplazó <b>${Y>1100?"a la derecha":"a la izquierda"}</b> (Y = ${VIS.n(Y,0)}).`);cs.push(Y>1100?"Sube el ingreso: se necesitan más saldos para transacciones (motivo transacción, kY).":"Baja el ingreso: se necesita menos dinero para transacciones.")}
      const dr=r1-r0;h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",`<p>A la tasa inicial de ${VIS.n(r0,1)} % hay ${dr<0?"<b>exceso de oferta de dinero</b>: la gente compra bonos, su precio sube y la tasa baja":"<b>exceso de demanda de dinero</b>: la gente vende bonos, su precio baja y la tasa sube"} hasta ${VIS.n(r1,1)} %, donde el público quiere tener justo el dinero que hay.</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Tasa r (%)",r0,r1,2)])}</div>`)}
    return{panels:[P],text:h}}});

// 3. IS-LM en (Y, r)
VIS.add("islm",{t:"Modelo IS-LM",
  hint:"Arrastra la IS (política fiscal o gasto autónomo) o la LM (política monetaria). La línea punteada horizontal muestra cuánto subiría Y si la tasa no cambiara: la diferencia es el efecto expulsión.",
  p0:{dA:0,M:300},lim:{dA:[-100,100],M:[180,420]},
  presets:[["∆G = +40",{dA:40}],["∆M/P = +60",{M:360}],["∆T = +50",{dA:-40}],["Política mixta: ∆G y ∆M",{dA:40,M:350}]],
  fit:{dA:(Y,r)=>0.2*Y+10*r-320,M:(Y,r)=>0.5*Y-25*r},
  compute(st){const{dA,M}=st.p,A=320+dA,IS=a=>Y=>(a-0.2*Y)/10,LM=m=>Y=>(0.5*Y-m)/25,solve=(a,m)=>{const Y=(25*a+10*m)/(25*0.2+10*0.5);return{Y,r:(0.5*Y-m)/25}};
    const e0=solve(320,300),e1=solve(A,M),mI=Math.abs(dA)>0.5,mL=Math.abs(M-300)>1;
    const curves=[{sh:VIS.fx(IS(320)),col:"--branch",dash:1,op:.55,lab:mI?"IS":""},{sh:VIS.fx(LM(300)),col:"--line",dash:1,op:.55,lab:mL?"LM":""},{sh:VIS.fx(IS(A)),col:"--branch",lab:mI?"IS’":"IS"},{sh:VIS.fx(LM(M)),col:"--line",lab:mL?"LM’":"LM"}];
    const pts=[{x:e0.Y,y:e0.r,lab:"0"}],segs=[];let Yk=null;
    if(mI||mL)pts.push({x:e1.Y,y:e1.r,lab:"1",col:"--good"});
    if(mI&&!mL){Yk=(A-10*e0.r)/0.2;segs.push({x1:e0.Y,y1:e0.r,x2:Yk,y2:e0.r,col:"--muted",dash:1,w:1.5,arrow:1});pts.push({x:Yk,y:e0.r,lab:"sin expulsión",col:"--muted"})}
    const hi=1450,hl=VIS.clamp(800+2*(M-300),300,1900),P={cap:"Equilibrio IS-LM",xr:[0,2200],yr:[0,25],xl:"Ingreso Y",yl:"Tasa de interés r (%)",fx:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"dA",x:hi,y:IS(A)(hi),col:"--branch",name:"la IS"},{c:"M",x:hl,y:LM(M)(hl),col:"--line",name:"la LM"}]};
    let h;if(!mI&&!mL)h=`<p>Todavía no hay cambios. En 0 se cruzan la IS (bienes) y la LM (dinero): Y* = ${VIS.n(e0.Y,0)}, r* = ${VIS.n(e0.r,1)} %. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mI){mv.push(`La IS se desplazó <b>${dA>0?"a la derecha":"a la izquierda"}</b>: el gasto autónomo cambió en ${VIS.n(dA,1)}.`);cs.push(dA>0?"∆+G, ∆+I₀, ∆+C₀ o ∆-T (política fiscal expansiva).":"∆-G, ∆-I₀, ∆-C₀ o ∆+T (política fiscal contractiva).")}
      if(mL){mv.push(`La LM se desplazó <b>${M>300?"a la derecha":"a la izquierda"}</b>: M/P = ${VIS.n(M,0)}.`);cs.push(M>300?"∆+M (política monetaria expansiva) o ∆-P.":"∆-M (política monetaria contractiva) o ∆+P.")}
      let m="";if(mI)m+=`<p><b>Fiscal:</b> ${dA>0?"∆+G → ∆+DA → ∆+Y → ∆+L (más dinero para transacciones) → ∆+r → ∆-I":"∆-G → ∆-DA → ∆-Y → ∆-L → ∆-r → ∆+I"}.${Yk!==null?` Con la tasa fija, Y llegaría a ${VIS.n(Yk,0)} (multiplicador simple); con la subida de r llega solo a ${VIS.n(e1.Y,0)}. La diferencia es el <b>efecto expulsión</b>: ∆I = −b·∆r = −10 × ${VIS.n(e1.r-e0.r,2)} = ${VIS.n(-10*(e1.r-e0.r),1)}.`:""}</p>`;
      if(mL)m+=`<p><b>Monetaria:</b> ${M>300?"∆+M/P → exceso de oferta de dinero → ∆-r → ∆+I → ∆+DA → ∆+Y":"∆-M/P → exceso de demanda de dinero → ∆+r → ∆-I → ∆-DA → ∆-Y"}.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Ingreso Y",e0.Y,e1.Y,0),VIS.tile("Tasa r (%)",e0.r,e1.r,2),VIS.tile("Inversión I",200-10*e0.r,200-10*e1.r,1)])}</div>`)}
    return{panels:[P],text:h}}});

// ===================== Escenas del programa (Jones) =====================
// 4. Diagrama de Solow. Base: s = 0,2; d = 0,1; Ā = 1; L̄ = 100; α = 1/3
VIS.add("solow",{t:"Modelo de Solow: inversión, depreciación y estado estacionario",panels:2,
  hint:"Arrastra la curva de inversión s̄Y (cambia la tasa de ahorro) o la recta de depreciación d̄K. Abajo, la trayectoria de la producción después del cambio.",
  p0:{s:0.2,d:0.1,A:1},lim:{s:[0.05,0.5],d:[0.04,0.25],A:[0.5,2]},
  presets:[["∆+s̄: ahorro de 20 % a 30 %",{s:0.3}],["∆+d̄: depreciación de 10 % a 15 %",{d:0.15}],["∆+Ā: productividad +20 %",{A:1.2}],["∆-s̄: ahorro a 12 %",{s:0.12}]],
  fit:{s:(K,y,st)=>y/(st.p.A*Math.max(K,1)**(1/3)*100**(2/3)),d:(K,y)=>y/Math.max(K,1)},
  compute(st){const{s,d,A}=st.p,b={s:0.2,d:0.1,A:1,L:100,al:1/3},n={s,d,A,L:100,al:1/3},E0=PM.solowEE(b),E1=PM.solowEE(n);
    const inv=p=>K=>p.s*p.A*Math.max(K,0)**(1/3)*100**(2/3),mv=Math.abs(s-0.2)>0.002||Math.abs(d-0.1)>0.002||Math.abs(A-1)>0.002;
    const curves=[{sh:VIS.fx(inv(b)),col:"--line",dash:1,op:.55,lab:mv?"s̄Y":""},{sh:VIS.fx(K=>0.1*K),col:"--branch",dash:1,op:.55,lab:mv?"d̄K":""},{sh:VIS.fx(inv(n)),col:"--line",lab:mv?"s̄′Y":"inversión s̄Y"},{sh:VIS.fx(K=>d*K),col:"--branch",lab:mv?"d̄′K":"depreciación d̄K"}];
    const pts=[{x:E0.K,y:0.1*E0.K,lab:"K*"}],segs=[];if(mv){pts.push({x:E1.K,y:d*E1.K,lab:"K*′",col:"--good"});segs.push({x1:E0.K,y1:4,x2:E1.K,y2:4,col:"--good",arrow:1,lab:"∆K*"})}
    const P1={cap:"Diagrama de Solow",xr:[0,900],yr:[0,75],xl:"Capital K",yl:"Inversión y depreciación",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"s",x:760,y:inv(n)(760),col:"--line",name:"la curva de inversión"},{c:"d",x:600,y:d*600,col:"--branch",name:"la recta de depreciación"}]};
    const S=PM.solowSim(b,n,3,50),Yat=t=>{const i=Math.max(0,Math.min(50,Math.floor(t))),j=Math.min(50,i+1),w=t-i;return S[i].Y*(1-w)+S[j].Y*w};
    const P2={cap:"Trayectoria de la producción Y",xr:[0,50],yr:[Math.min(E0.Y,E1.Y)*0.85,Math.max(E0.Y,E1.Y)*1.12],xl:"Período",yl:"Y",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),
      curves:[{sh:VIS.hy(E0.Y),col:"--muted",dash:2,lab:"Y*"},...(mv?[{sh:VIS.hy(E1.Y),col:"--good",dash:2,lab:"Y*′"}]:[]),{sh:VIS.fx(Yat),col:"--ink"}]};
    let h;if(!mv)h=`<p>Todavía no hay cambios. El estado estacionario está donde la inversión iguala a la depreciación: K* = (s̄Ā/d̄)<sup>3/2</sup>L̄ = 2<sup>3/2</sup>·100 = ${VIS.n(E0.K,1)} y Y* = ${VIS.n(E0.Y,1)}. Arrastra una curva o prueba un choque.</p>`;
    else{const c=[];if(Math.abs(s-0.2)>0.002)c.push(`la tasa de ahorro ${s>0.2?"subió":"bajó"} a ${VIS.n(100*s,1)} %: la curva de inversión se desplazó ${s>0.2?"hacia arriba":"hacia abajo"}`);if(Math.abs(d-0.1)>0.002)c.push(`la depreciación ${d>0.1?"subió":"bajó"} a ${VIS.n(100*d,1)} %: la recta se hizo ${d>0.1?"más empinada":"más plana"}`);if(Math.abs(A-1)>0.002)c.push(`la productividad Ā pasó a ${VIS.n(A,2)}: la producción y, con ella, la inversión se desplazaron ${A>1?"hacia arriba":"hacia abajo"}`);
      const up=E1.K>E0.K;h=VIS.sec("Qué cambió",VIS.list(c))+VIS.sec("Mecanismo",`<p>En el capital inicial ${VIS.n(E0.K,0)}, ahora la inversión (${VIS.n(inv(n)(E0.K),2)}) ${up?"supera":"es menor que"} la depreciación (${VIS.n(d*E0.K,2)}): el capital ${up?"crece":"cae"}. Por los rendimientos decrecientes, el cambio es rápido al principio y cada vez más lento (<b>dinámica de transición</b>), hasta el nuevo estado estacionario. En el largo plazo la producción vuelve a quedarse quieta: Solow no genera crecimiento permanente.</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Capital K*",E0.K,E1.K,1),VIS.tile("Producción Y*",E0.Y,E1.Y,1),VIS.tile("Consumo C*",E0.C,E1.C,1)])}</div>${Math.abs(A-1)>0.002?`<p>Con Ā la producción de estado estacionario cambia en Ā<sup>3/2</sup> = ${VIS.n(A**1.5,3)} veces: más que el efecto directo, porque más producción también da más capital.</p>`:""}${s>0.2&&s>1/3?`<p class="warn">Con s̄ mayor que α = 1/3, el consumo de estado estacionario ya baja: se pasó de la regla de oro.</p>`:""}`)}
    return{panels:[P1,P2],text:h}}});

// 5. IS-MP y curva de Phillips. Base: ā = 0, b̄ = 0,5, r̄ = 2 %, ν̄ = 0,5, ō = 0
VIS.add("ismp",{t:"IS-MP y curva de Phillips",panels:2,
  hint:"Arrastra la recta MP (el banco central fija R), la IS (choque de demanda ā) o la curva de Phillips (choque de inflación ō).",
  p0:{a:0,R:2,o:0},lim:{a:[-3,3],R:[-2,8],o:[-3,3]},
  presets:[["El banco central sube R a 5 %",{R:5}],["Choque de demanda ā = +1",{a:1}],["ā = +1 y el banco central sube R a 4 %",{a:1,R:4}],["Choque petrolero ō = +1",{o:1}],["Crisis: ā = −2 y prima de riesgo +1",{a:-2,R:3}]],
  fit:{a:(x,y)=>x+0.5*(y-2),R:(x,y)=>y,o:(x,y)=>y-0.5*x},
  compute(st){const{a,R,o}=st.p,Y=a-0.5*(R-2),dp=0.5*Y+o,mI=Math.abs(a)>0.02,mM=Math.abs(R-2)>0.02,mO=Math.abs(o)>0.02,any=mI||mM||mO;
    const IS=aa=>x=>2+(aa-x)/0.5;
    const P1={cap:"IS-MP",xr:[-5,5],yr:[-2,8],xl:"Brecha Ỹ (%)",yl:"Tasa real R (%)",fx:v=>VIS.n(v,1),fy:v=>VIS.n(v,1),
      curves:[{sh:VIS.vx(0),col:"--muted",w:1.2},{sh:VIS.fx(IS(0)),col:"--line",dash:1,op:.55,lab:mI?"IS":""},{sh:VIS.hy(2),col:"--branch",dash:1,op:.55,lab:mM?"MP":""},{sh:VIS.fx(IS(a)),col:"--line",lab:mI?"IS’":"IS"},{sh:VIS.hy(R),col:"--branch",lab:mM?"MP’":"MP"}],
      pts:[{x:0,y:2,lab:"0"},...(any?[{x:Y,y:R,lab:"1",col:"--good"}]:[])],handles:[{c:"a",x:a-0.5*(6.5-2),y:6.5,col:"--line",name:"la IS"},{c:"R",x:3.8,y:R,col:"--branch",name:"la MP"}]};
    const P2={cap:"Curva de Phillips",xr:[-5,5],yr:[-4,4],xl:"Brecha Ỹ (%)",yl:"Δπ (pp)",fx:v=>VIS.n(v,1),fy:v=>VIS.n(v,1),
      curves:[{sh:VIS.hy(0),col:"--muted",w:1.2},{sh:VIS.fx(x=>0.5*x),col:"--exam",dash:1,op:.55,lab:mO?"PC":""},{sh:VIS.fx(x=>0.5*x+o),col:"--exam",lab:mO?"PC’":"Phillips"}],
      pts:[{x:0,y:0,lab:"0"},...(any?[{x:Y,y:dp,lab:"1",col:"--good"}]:[])],handles:[{c:"o",x:-3.5,y:-1.75+o,col:"--exam",name:"la curva de Phillips"}]};
    let h;if(!any)h=`<p>Todavía no hay cambios: con ā = 0 y R = r̄ = 2 %, la brecha es cero y la inflación no cambia. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mM){mv.push(`La MP ${R>2?"subió":"bajó"} a R = ${VIS.n(R,1)} %.`);cs.push(R>2?"El banco central sube la tasa nominal (política contractiva), o sube la prima de riesgo de los préstamos.":"El banco central baja la tasa nominal (política expansiva).")}
      if(mI){mv.push(`La IS se desplazó <b>${a>0?"a la derecha":"a la izquierda"}</b>: ā = ${VIS.n(a,1)}.`);cs.push(a>0?"∆+ā: más consumo (confianza, riqueza), más gasto público, más exportaciones o más inversión autónoma.":"∆-ā: caída de la confianza o de la riqueza, recorte del gasto público, caída de las exportaciones.")}
      if(mO){mv.push(`La curva de Phillips se desplazó <b>${o>0?"hacia arriba":"hacia abajo"}</b>: ō = ${VIS.n(o,1)}.`);cs.push(o>0?"Choque de oferta adverso: sube el petróleo, sequía, alza de salarios no ligada a la productividad.":"Choque de oferta favorable: baja el petróleo o mejora la productividad.")}
      const ch=`<div class="eq al chain">${mM?`R ${R>2?"∆+":"∆-"} → `:""}${mI||mM?`Ỹ = ā − b̄(R − r̄) = ${VIS.n(a,1)} − 0,5(${VIS.n(R-2,1)}) = ${VIS.n(Y,2)} % → `:""}Δπ = ν̄Ỹ + ō = 0,5(${VIS.n(Y,2)}) + ${VIS.n(o,1)} = ${VIS.n(dp,2)} pp</div>`;
      let ex="";if(mI&&!mM)ex=`<p>Para neutralizar el choque, el banco central tendría que subir R a r̄ + ā/b̄ = ${VIS.n(2+a/0.5,1)} %. Con un choque de demanda no hay dilema.</p>`;
      if(mO&&Math.abs(Y)<0.02)ex=`<p><b>Dilema:</b> la inflación sube sin que la economía esté recalentada. Si el banco central sube R para frenarla, causa una recesión; si no, la inflación se queda más alta.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",ch+ex)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Brecha Ỹ (%)",0,Y,2),VIS.tile("Cambio de la inflación Δπ",0,dp,2),VIS.tile("Desempleo u − ū (Okun)",0,-Y/2,2)])}</div>`)}
    return{panels:[P1,P2],text:h}}});

// 6. OA-DA. Base: π_{t−1} = π̄ = 2 %, b̄ = m̄ = ν̄ = 0,5
VIS.add("oada",{t:"Oferta y demanda agregadas (OA-DA)",
  hint:"Arrastra la DA (choque de demanda ā) o la OA (choque de inflación ō). El texto muestra el equilibrio del período y qué pasa después.",
  p0:{a:0,o:0,pib:2},lim:{a:[-3,3],o:[-3,3],pib:[0,6]},
  presets:[["Choque de inflación ō = +1",{o:1}],["Choque de demanda ā = +2",{a:2}],["Caída de la demanda ā = −2",{a:-2}],["Desinflación: π̄ baja de 2 % a 0 %",{pib:0}]],
  fit:{a:(x,y,st)=>x+0.25*(y-st.p.pib),o:(x,y)=>y-2-0.5*x},
  compute(st){const{a,o,pib}=st.p,bm=0.25,E=PM.oadaPaso({a,b:0.5,m:0.5,pib,nu:0.5,o},2),N=PM.oadaPaso({a,b:0.5,m:0.5,pib,nu:0.5,o:0},E.pi),N0=PM.oadaPaso({a:0,b:0.5,m:0.5,pib,nu:0.5,o:0},E.pi);
    const mA=Math.abs(a)>0.02,mO=Math.abs(o)>0.02,mP=Math.abs(pib-2)>0.02,any=mA||mO||mP,DA=(aa,pb)=>x=>pb+(aa-x)/bm,OA=(oo)=>x=>2+0.5*x+oo;
    const P={cap:"OA-DA en el período del choque",xr:[-5,5],yr:[-2,8],xl:"Brecha Ỹ (%)",yl:"Inflación π (%)",fx:v=>VIS.n(v,1),fy:v=>VIS.n(v,1),
      curves:[{sh:VIS.vx(0),col:"--muted",w:1.2},{sh:VIS.fx(DA(0,2)),col:"--line",dash:1,op:.55,lab:mA||mP?"DA":""},{sh:VIS.fx(OA(0)),col:"--branch",dash:1,op:.55,lab:mO?"OA":""},{sh:VIS.fx(DA(a,pib)),col:"--line",lab:mA||mP?"DA’":"DA"},{sh:VIS.fx(OA(o)),col:"--branch",lab:mO?"OA’":"OA"}],
      pts:[{x:0,y:2,lab:"0"},...(any?[{x:E.Y,y:E.pi,lab:"1",col:"--good"}]:[])],handles:[{c:"a",x:a-bm*(6.8-pib),y:6.8,col:"--line",name:"la DA"},{c:"o",x:3.6,y:OA(o)(3.6),col:"--branch",name:"la OA"}]};
    let h;if(!any)h=`<p>Todavía no hay cambios: la economía está en su estado estacionario, Ỹ = 0 y π = π̄ = 2 %. Arrastra una curva o prueba un choque.</p>`;
    else{const mv=[],cs=[];if(mA){mv.push(`La DA se desplazó <b>${a>0?"a la derecha":"a la izquierda"}</b> (ā = ${VIS.n(a,1)}).`);cs.push(a>0?"Más gasto (consumo, inversión, gobierno, exportaciones).":"Menos gasto: caída de la confianza, crisis financiera, ajuste fiscal.")}
      if(mP){mv.push(`La meta bajó a π̄ = ${VIS.n(pib,1)} %: la DA se desplazó <b>${pib<2?"a la izquierda":"a la derecha"}</b>.`);cs.push(pib<2?"El banco central decide bajar la inflación: sube R aunque la inflación esté en 2 %.":"El banco central acepta más inflación.")}
      if(mO){mv.push(`La OA se desplazó <b>${o>0?"hacia arriba":"hacia abajo"}</b> (ō = ${VIS.n(o,1)}).`);cs.push(o>0?"Choque de precios adverso (petróleo, alimentos).":"Choque de precios favorable.")}
      const m=`<div class="eq al">π = ${fr(`π<sub>t−1</sub> + ν̄ā + ν̄b̄m̄π̄ + ō`,"1 + ν̄b̄m̄")} = ${fr(`2 + 0,5·${VIS.n(a,1)} + 0,125·${VIS.n(pib,1)} + ${VIS.n(o,1)}`,"1,125")} = ${VIS.n(E.pi,3)} %<br>Ỹ = ā − b̄m̄(π − π̄) = ${VIS.n(a,1)} − 0,25·(${VIS.n(E.pi,3)} − ${VIS.n(pib,1)}) = ${VIS.n(E.Y,3)} %</div>`;
      const next=mA&&!mO?`<p><b>Después:</b> si el choque sigue, la OA sube cada período (π<sub>t−1</sub> más alta) hasta que π = π̄ + ā/(b̄m̄) = ${VIS.n(pib+a/bm,2)} % y Ỹ = 0. Si el choque desaparece, en el período siguiente π = ${VIS.n(N0.pi,3)} % con Ỹ = ${VIS.n(N0.Y,3)} %: la inflación quedó alta y hace falta una recesión para bajarla.</p>`
        :`<p><b>Después:</b> en el período siguiente${mO?", sin el choque de precios,":""} la OA pasa por π<sub>t−1</sub> = ${VIS.n(E.pi,2)} %: π = ${VIS.n((mA?N:N0).pi,3)} % y Ỹ = ${VIS.n((mA?N:N0).Y,3)} %. La economía vuelve poco a poco a ${mP?`la nueva meta de ${VIS.n(pib,1)} %`:"π̄ con Ỹ = 0"}.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Equilibrio del período",m+(mO&&!mA?`<p>Sube la inflación y cae la producción a la vez: <b>estanflación</b>. El banco central, siguiendo su regla, sube R = r̄ + ${VIS.n(E.R,2)} pp.</p>`:""))+VIS.sec("Dinámica",next)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Inflación π (%)",2,E.pi,3),VIS.tile("Brecha Ỹ (%)",0,E.Y,3),VIS.tile("R − r̄ (pp)",0,E.R,3)])}</div>`)}
    return{panels:[P],text:h}}});
