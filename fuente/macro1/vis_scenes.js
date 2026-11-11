// Visuales de cambios de Macroeconomía 1 (usa el motor comun/visual.js)

// 1. Consumo intertemporal: restricción C1 + C2/(1+r) = Y1 + Y2/(1+r), utilidad ln C1 + ln C2/(1+ρ)
VIS.add("inter",{t:"Consumo intertemporal: restricción y canasta óptima",
  hint:"Arrastra la dotación E = (Y₁, Y₂) para cambiar el ingreso de cada período, o el círculo sobre la restricción para girarla alrededor de la dotación (cambia la tasa r).",
  opts:[{id:"rho",lab:"Tasa de descuento ρ",ch:[["0","0 %"],["0.05","5 %"],["0.2","20 %"]],v:"0.05"}],
  p0:{Y1:60,Y2:60,r:0.1},lim:{Y1:[15,110],r:[-0.3,0.8]},
  presets:[["Sube r (10 % → 30 %)",{r:0.3}],["Baja r (10 % → 0 %)",{r:0}],["Bonificación transitoria (∆Y₁)",{Y1:80}],["Aumento permanente (Y₁ y Y₂)",{Y1:75,Y2:75}],["Ingreso futuro esperado (∆Y₂)",{Y2:85}]],
  fit:{Y1:(x,y,st)=>{st.p.Y2=VIS.clamp(y,15,110);return x},r:(x,y,st)=>{const{Y1,Y2}=st.p;if(Math.abs(Y1-x)<3)return st.p.r;return (y-Y2)/(Y1-x)-1}},
  compute(st){const rho=+st.o.rho,{Y1,Y2,r}=st.p,b=1/(1+rho);
    const opt=(y1,y2,rr)=>{const W=y1+y2/(1+rr),C1=W/(1+b),C2=C1*(1+rr)*b;return{W,C1,C2,u:Math.log(C1)+b*Math.log(C2)}};
    const o0=opt(60,60,0.1),o1=opt(Y1,Y2,r),BL=(y1,y2,rr)=>c1=>y2+(1+rr)*(y1-c1),IC=u=>c1=>c1>0?Math.exp((u-Math.log(c1))/b):NaN;
    const mv=Math.abs(Y1-60)>0.5||Math.abs(Y2-60)>0.5||Math.abs(r-0.1)>0.004;
    const curves=[{sh:VIS.fx(BL(60,60,0.1)),col:"--line",dash:1,op:.55,lab:""},{sh:VIS.fx(IC(o0.u)),col:"--branch",dash:1,op:.45},
      {sh:VIS.fx(BL(Y1,Y2,r)),col:"--line",lab:"restricción"},{sh:VIS.fx(IC(o1.u)),col:"--branch",lab:"indiferencia"}];
    const pts=[{x:60,y:60,lab:"E₀",col:"--muted"},{x:o0.C1,y:o0.C2,lab:"0"}];if(mv)pts.push({x:o1.C1,y:o1.C2,lab:"1",col:"--good"});
    const segs=[{x1:Y1,y1:0,x2:Y1,y2:Y2,col:"--muted",dash:1,w:1},{x1:0,y1:Y2,x2:Y1,y2:Y2,col:"--muted",dash:1,w:1}];
    const hx=Math.max(4,Y1*0.35),P={cap:"Plano (C₁, C₂) · ρ = "+VIS.n(rho*100,0)+" %",xr:[0,160],yr:[0,160],xl:"Consumo hoy C₁",yl:"Consumo mañana C₂",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"Y1",x:Y1,y:Y2,col:"--exam",name:"la dotación (Y₁, Y₂)"},{c:"r",x:hx,y:BL(Y1,Y2,r)(hx),col:"--line",name:"la restricción (tasa r)"}]};
    const S0=60-o0.C1,S1=Y1-o1.C1;let h;
    if(!mv)h=`<p>Todavía no hay cambios. Con Y₁ = Y₂ = 60 y r = 10 %, la riqueza es W = ${VIS.n(o0.W,1)} y el óptimo es C₁ = ${VIS.n(o0.C1,1)}, C₂ = ${VIS.n(o0.C2,1)}: el hogar ${S0>0?"ahorra":"se endeuda"} ${VIS.n(Math.abs(S0),1)} hoy. Arrastra la dotación o gira la restricción.</p>`;
    else{const mvl=[],cs=[];const dY1=Y1-60,dY2=Y2-60,dr=r-0.1;
      if(Math.abs(dr)>0.004){mvl.push(`La restricción <b>giró</b> alrededor de la dotación: r pasó de 10 % a ${VIS.n(r*100,1)} % (pendiente −(1 + r)).`);cs.push(dr>0?"Sube la tasa de interés: el banco central la sube o hay más demanda de crédito.":"Baja la tasa de interés.")}
      if(Math.abs(dY1)>0.5||Math.abs(dY2)>0.5){mvl.push(`La dotación se movió a (${VIS.n(Y1,1)}, ${VIS.n(Y2,1)}): la restricción se desplazó en paralelo si r no cambió.`);
        cs.push(Math.abs(dY1)>0.5&&Math.abs(dY2)>0.5&&Math.sign(dY1)===Math.sign(dY2)?"Cambio <b>permanente</b> del ingreso (afecta los dos períodos).":Math.abs(dY1)>0.5&&Math.abs(dY2)<=0.5?"Cambio <b>transitorio</b> del ingreso de hoy (bonificación, desempleo temporal).":"Cambio del ingreso <b>futuro esperado</b> (un ascenso, una pensión).")}
      let m=`<p>El hogar iguala la tasa marginal de sustitución con 1 + r (ecuación de Euler): C₂ = C₁·(1 + r)/(1 + ρ). Con utilidad logarítmica, C₁ = W/(1 + 1/(1 + ρ)): consume hoy una fracción fija de la riqueza.</p>`;
      if(Math.abs(dr)>0.004)m+=`<p><b>Efecto sustitución:</b> ${dr>0?"consumir hoy se vuelve más caro en términos de mañana: se pospone consumo":"consumir hoy se abarata: se adelanta consumo"}. <b>Efecto ingreso:</b> ${S0>0?(dr>0?"como el hogar era ahorrador, la subida de r lo hace más rico y empuja C₁ hacia arriba":"como era ahorrador, la baja de r lo empobrece"):(dr>0?"como era deudor, la subida de r lo empobrece y reduce C₁":"como era deudor, la baja de r lo enriquece")}. <b>Efecto riqueza humana:</b> el ingreso futuro vale ${dr>0?"menos":"más"} en valor presente. Aquí C₁ ${o1.C1>o0.C1?"sube":"baja"}.</p>`;
      if(Math.abs(dY1)>0.5||Math.abs(dY2)>0.5)m+=`<p>La riqueza pasa de ${VIS.n(o0.W,1)} a ${VIS.n(o1.W,1)}. El hogar <b>suaviza</b> el consumo: reparte el cambio entre los dos períodos${Math.abs(dY1)>0.5&&Math.abs(dY2)<=0.5?", así que ahorra la mayor parte de un ingreso transitorio":""}.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Riqueza W",o0.W,o1.W,1),VIS.tile("Consumo hoy C₁",o0.C1,o1.C1,1),VIS.tile("Consumo mañana C₂",o0.C2,o1.C2,1),VIS.tile("Ahorro hoy S₁",S0,S1,1)])}</div><p>${S1>0.05?"El hogar es <b>prestamista</b> (ahorra hoy).":S1<-0.05?"El hogar es <b>prestatario</b> (se endeuda hoy).":"El hogar consume justo su ingreso."}</p>`)}
    return{panels:[P],text:h}}});

// 2. Capital óptimo: PMgK = αY/K contra el costo de uso uc = r + δ
VIS.add("capital",{t:"Capital óptimo: PMgK y costo de uso",
  hint:"Arrastra la recta del costo de uso (cambia r) o la curva de la productividad marginal del capital (cambia la producción esperada Y).",
  p0:{uc:0.15,Y:300},lim:{uc:[0.06,0.35],Y:[180,450]},
  presets:[["Sube r 5 puntos",{uc:0.2}],["Baja r 5 puntos",{uc:0.1}],["Mejoran las ventas esperadas",{Y:380}],["Recesión esperada",{Y:220}]],
  fit:{uc:(K,u)=>u,Y:(K,u)=>u*K/0.3},
  compute(st){const a=0.3,d=0.1,K0prev=600,{uc,Y}=st.p,PM=y=>K=>a*y/K,K0=a*300/0.15,K1=a*Y/uc,mU=Math.abs(uc-0.15)>0.002,mY=Math.abs(Y-300)>1;
    const curves=[{sh:VIS.hy(0.15),col:"--line",dash:1,op:.55,lab:mU?"uc":""},{sh:VIS.fx(PM(300)),col:"--branch",dash:1,op:.55,lab:mY?"PMgK":""},{sh:VIS.hy(uc),col:"--line",lab:mU?"uc’ = r’ + δ":"uc = r + δ"},{sh:VIS.fx(PM(Y)),col:"--branch",lab:mY?"PMgK’ = αY’/K":"PMgK = αY/K"}];
    const pts=[{x:K0,y:0.15,lab:"K*₀"}];if(mU||mY)pts.push({x:K1,y:uc,lab:"K*₁",col:"--good"});
    const hk=VIS.clamp(a*Y/0.09,150,1350),P={cap:"Capital deseado",xr:[0,1400],yr:[0,0.4],xl:"Capital K",yl:"PMgK, costo de uso",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,2),curves,pts,
      handles:[{c:"uc",x:1250,y:uc,col:"--line",name:"el costo de uso"},{c:"Y",x:hk,y:PM(Y)(hk),col:"--branch",name:"la productividad marginal del capital"}]};
    let h;if(!mU&&!mY)h=`<p>Todavía no hay cambios. La firma acumula capital hasta que PMgK = uc: K* = αY/(r + δ) = 0,3·300/0,15 = ${VIS.n(K0,0)}. Con K₋₁ = ${K0prev}, la inversión neta es ${VIS.n(K0-K0prev,0)} y la bruta ${VIS.n(K0-(1-d)*K0prev,0)}.</p>`;
    else{const mv=[],cs=[];if(mU){mv.push(`El costo de uso pasó de 0,15 a ${VIS.n(uc,3)} (r de 5 % a ${VIS.n((uc-d)*100,1)} %, con δ = 10 %).`);cs.push(uc>0.15?"Sube la tasa de interés (política monetaria contractiva) o el capital se deprecia más rápido.":"Baja la tasa de interés o mejoran las condiciones de crédito.")}
      if(mY){mv.push(`La curva PMgK se desplazó <b>${Y>300?"a la derecha":"a la izquierda"}</b>: producción esperada Y = ${VIS.n(Y,0)}.`);cs.push(Y>300?"Las empresas esperan vender más (expectativas optimistas, más demanda).":"Las empresas esperan vender menos (recesión esperada).")}
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",`<p>Con el capital inicial ${VIS.n(K0,0)}, ahora ${K1>K0?"la PMgK supera al costo de uso: cada unidad adicional de capital rinde más de lo que cuesta, así que la firma invierte":"el costo de uso supera a la PMgK: sobra capital y la firma invierte menos (o deja que se deprecie)"} hasta K* = αY/uc = ${VIS.n(K1,0)}.</p><div class="eq al chain">I neta = K* − K₋₁ = ${VIS.n(K1,0)} − ${K0prev} = ${VIS.n(K1-K0prev,0)}<br>I bruta = K* − (1 − δ)K₋₁ = ${VIS.n(K1-(1-d)*K0prev,0)}</div>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Capital deseado K*",K0,K1,0),VIS.tile("Inversión bruta",K0-(1-d)*K0prev,K1-(1-d)*K0prev,0)])}</div>`)}
    return{panels:[P],text:h}}});
