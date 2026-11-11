// Visuales de cambios de Historia del Pensamiento Económico, unidad 3 (usa el motor comun/visual.js)

// 1. Mercado de trabajo de la teoría Clásica (Pigou): Nᵈ = PMgN, Nˢ = desutilidad marginal, salario real rígido
VIS.add("pigou",{t:"Pigou: mercado de trabajo y salario real rígido",
  hint:"Arrastra la demanda de trabajo (productividad) o la oferta (preferencia por el ocio). Con «Salario real rígido» aparece una línea de salario que puedes subir o bajar.",
  opts:[{id:"w",lab:"Salario real",ch:[["flex","Flexible"],["rigido","Rígido"]],v:"flex",reset:false}],
  p0:{A:1,s:0,wr:1.6},lim:{A:[0.6,1.6],s:[-0.6,0.8],wr:[0.5,2.8]},
  presets:[["Salario mínimo alto",{wr:1.8},{w:"rigido"}],["Cae la productividad (salario flexible)",{A:0.8},{w:"flex"}],["Cae la productividad con salario rígido",{A:0.8,wr:1.26},{w:"rigido"}],["Más preferencia por el ocio",{s:0.4},{w:"flex"}],["Receta de Pigou: bajar el salario",{wr:1.3},{w:"rigido"}]],
  fit:{A:(x,y)=>y*Math.sqrt(Math.max(x,1))/10,s:(x,y)=>y-0.02*x,wr:(x,y)=>y},
  compute(st){const{A,s,wr}=st.p,rig=st.o.w==="rigido",Nd=a=>N=>a*10/Math.sqrt(N),Ns=z=>N=>0.02*N+z;
    const eq=(a,z)=>{let lo=0.5,hi=150;for(let k=0;k<80;k++){const m=(lo+hi)/2;if(Nd(a)(m)>Ns(z)(m))lo=m;else hi=m}const N=(lo+hi)/2;return{N,w:Ns(z)(N)}};
    const E0=eq(1,0),E1=eq(A,s),mA=Math.abs(A-1)>0.01,mS=Math.abs(s)>0.01;
    let Nemp=E1.N,wp=E1.w,U=0,Nsup=E1.N;
    if(rig&&wr>E1.w+1e-6){Nemp=(10*A/wr)**2;Nsup=(wr-s)/0.02;U=Nsup-Nemp;wp=wr}
    else if(rig){wp=wr;Nemp=Math.min((10*A/wr)**2,150);Nsup=(wr-s)/0.02}
    const curves=[{sh:VIS.fx(Nd(1)),col:"--line",dash:1,op:.55,lab:mA?"Nᵈ":""},{sh:VIS.fx(Ns(0)),col:"--branch",dash:1,op:.55,lab:mS?"Nˢ":""},
      {sh:VIS.fx(Nd(A)),col:"--line",lab:mA?"Nᵈ’":"Nᵈ = PMgN"},{sh:VIS.fx(Ns(s)),col:"--branch",lab:mS?"Nˢ’":"Nˢ = TMS"}];
    if(rig)curves.push({sh:VIS.hy(wr),col:"--exam",lab:"salario real rígido"});
    const pts=[{x:E0.N,y:E0.w,lab:"E₀"}];if(mA||mS)pts.push({x:E1.N,y:E1.w,lab:"E₁",col:"--good"});
    const segs=[];if(U>0.5){pts.push({x:Nemp,y:wr,lab:"Nᵈ",col:"--bad"},{x:Nsup,y:wr,lab:"Nˢ",col:"--bad"});segs.push({x1:Nemp,y1:wr-0.12,x2:Nsup,y2:wr-0.12,col:"--bad",w:3,lab:"desempleo involuntario"})}
    const handles=[{c:"A",x:20,y:Nd(A)(20),col:"--line",name:"la demanda de trabajo"},{c:"s",x:105,y:Ns(s)(105),col:"--branch",name:"la oferta de trabajo"}];
    if(rig)handles.push({c:"wr",x:8,y:wr,col:"--exam",name:"el salario real rígido"});
    const P={cap:"Mercado de trabajo de la teoría Clásica",xr:[0,120],yr:[0,3],xl:"Empleo N",yl:"Salario real w/p",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,2),curves,segs,pts,handles};
    let h;
    if(!mA&&!mS&&!(rig&&Math.abs(wr-E0.w)>0.02)){h=`<p>Todavía no hay cambios. Con salario flexible el mercado se equilibra en E₀: N = ${VIS.n(E0.N,1)} y w/p = ${VIS.n(E0.w,2)}. Quien no trabaja es porque no acepta ese salario real: el desempleo es <b>voluntario</b>. Elige «Rígido» o un choque.</p>`}
    else{const mv=[],cs=[];
      if(mA){mv.push(`La demanda de trabajo se desplazó <b>${A>1?"a la derecha":"a la izquierda"}</b>: la productividad marginal ${A>1?"subió":"bajó"}.`);cs.push(A>1?"Mejora técnica o más capital por trabajador (primer postulado: las empresas contratan hasta w/p = PMgN).":"Caída de la productividad o del capital (un choque de oferta).")}
      if(mS){mv.push(`La oferta de trabajo se desplazó <b>${s>0?"hacia arriba":"hacia abajo"}</b>.`);cs.push(s>0?"Los hogares valoran más el ocio: exigen un salario real mayor por cada hora (segundo postulado).":"Los hogares valoran menos el ocio o necesitan más ingreso.")}
      if(rig){mv.push(`El salario real está fijo en ${VIS.n(wr,2)}${wr>E1.w+0.01?`, por encima del de equilibrio (${VIS.n(E1.w,2)})`:wr<E1.w-0.01?`, por debajo del de equilibrio (${VIS.n(E1.w,2)})`:", igual al de equilibrio"}.`);cs.push(wr>E1.w?"Sindicatos que negocian salarios altos o un salario mínimo legal: los <b>fallos</b> del mercado de trabajo que señala Pigou.":"Un salario real fijado por debajo del equilibrio: las empresas quieren contratar más de lo que los trabajadores ofrecen.")}
      let m;
      if(U>0.5)m=`<p>Al salario ${VIS.n(wr,2)} las empresas solo contratan ${VIS.n(Nemp,1)} (donde la PMgN iguala al salario), mientras que ${VIS.n(Nsup,1)} personas quieren trabajar. La diferencia, <b>${VIS.n(U,1)}</b>, es desempleo involuntario. Como el salario no baja, el mercado no se equilibra.</p><p><b>Receta de Pigou:</b> flexibilizar el salario. Si baja hasta ${VIS.n(E1.w,2)}, el empleo sube a ${VIS.n(E1.N,1)} y el desempleo involuntario desaparece. <b>Keynes</b> responde que los trabajadores negocian salarios monetarios, no reales, y que una baja de salarios puede reducir la demanda y el empleo.</p>`;
      else if(rig&&wr<E1.w-0.01)m=`<p>Con el salario por debajo del equilibrio, las empresas quieren contratar más, pero solo se ofrecen ${VIS.n(Nsup,1)} trabajadores: el empleo lo limita la oferta y hay escasez de trabajo, no desempleo.</p>`;
      else m=`<p>Con salario flexible, el salario real se ajusta hasta igualar oferta y demanda en E₁: N = ${VIS.n(E1.N,1)} y w/p = ${VIS.n(E1.w,2)}. ${E1.N<E0.N?"El empleo baja, pero todo el desempleo adicional es <b>voluntario</b>: quien sale no acepta el nuevo salario.":"El empleo sube."} Es el pleno empleo de la teoría Clásica, garantizado por la ley de Say.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mv))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)+VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Empleo N",E0.N,Math.min(Nemp,Nsup),1),VIS.tile("Salario real w/p",E0.w,wp,2),["Desempleo involuntario",U>0.5?VIS.n(U,1):"0"]])}</div>`)}
    return{panels:[P],text:h}}});

// 2. Keynes: demanda efectiva con el diagrama de Weintraub, en unidades de salario
VIS.add("zd",{t:"Keynes: demanda efectiva (Z y D)",
  hint:"Arrastra la demanda agregada D (inversión esperada) o la oferta agregada Z (costos y productividad). Cambia la propensión a consumir.",
  opts:[{id:"c",lab:"Propensión marginal a consumir",ch:[["0.6","0,6"],["0.7","0,7"],["0.8","0,8"]],v:"0.7",reset:false}],
  p0:{I:20,k:0.006,w:1},lim:{I:[2,50],k:[0.002,0.015]},
  presets:[["Inversión pública (∆+I)",{I:30}],["Pesimismo empresarial (∆-I)",{I:12}],["Más ahorro: c = 0,6",{},{c:"0.6"}],["Baja del salario monetario",{w:0.8},{c:"0.7"}]],
  fit:{I:(x,y,st)=>y-(+st.o.c)*x,k:(x,y)=>(y-x)/(x*x)},
  compute(st){const c=+st.o.c,{I,k,w}=st.p,Ns=60,Z=kk=>N=>N+kk*N*N,D=(cc,ii)=>N=>cc*N+ii;
    const sol=(cc,ii,kk)=>(-(1-cc)+Math.sqrt((1-cc)**2+4*kk*ii))/(2*kk);
    const N0=sol(0.7,20,0.006),N1=sol(c,I,k),mI=Math.abs(I-20)>0.3,mK=Math.abs(k-0.006)>0.0002,mC=Math.abs(c-0.7)>0.01,mW=Math.abs(w-1)>0.01,mv=mI||mK||mC;
    const Ne=Math.min(N1,Ns);
    const curves=[{sh:VIS.fx(Z(0.006)),col:"--branch",dash:1,op:.55,lab:mK?"Z":""},{sh:VIS.fx(D(0.7,20)),col:"--line",dash:1,op:.55,lab:(mI||mC)?"D":""},
      {sh:VIS.fx(Z(k)),col:"--branch",lab:mK?"Z’ = φ(N)":"Z = φ(N)"},{sh:VIS.fx(D(c,I)),col:"--line",lab:(mI||mC)?"D’ = C(N) + I":"D = C(N) + I"},{sh:VIS.vx(Ns),col:"--good",lab:"N* pleno empleo",w:1.6}];
    const pts=[{x:N0,y:Z(0.006)(N0),lab:"E**"}];if(mv)pts.push({x:N1,y:Z(k)(N1),lab:"E**’",col:"--exam"});
    const segs=[];if(Ne<Ns-0.5)segs.push({x1:Ne,y1:6,x2:Ns,y2:6,col:"--bad",w:3,lab:"desempleo involuntario"});
    const P={cap:"Diagrama de Weintraub (en unidades de salario)",xr:[0,80],yr:[0,120],xl:"Empleo N",yl:"Z, D",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"I",x:72,y:D(c,I)(72),col:"--line",name:"la demanda agregada"},{c:"k",x:45,y:Z(k)(45),col:"--branch",name:"la oferta agregada"}]};
    let h;
    if(!mv&&!mW)h=`<p>Todavía no hay cambios. La demanda efectiva está en E**, con N** = ${VIS.n(N0,1)}, por debajo del pleno empleo N* = ${Ns}. Hay ${VIS.n(Ns-N0,1)} de desempleo involuntario <b>en equilibrio</b>: los empresarios no tienen razón para contratar más porque no esperan vender más. Arrastra D o prueba un choque.</p>`;
    else if(mW&&!mv)h=VIS.sec("Qué cambió",VIS.list([`El salario monetario bajó ${VIS.n((1-w)*100,0)} %.`]))+VIS.sec("Qué pudo haberlo causado",VIS.list(["Desempleo alto que presiona los salarios a la baja, o una política de flexibilización: la receta de Pigou."]))
      +VIS.sec("Mecanismo",`<p>Medidas en unidades de salario, como en la <i>Teoría general</i>, Z y D <b>no se mueven</b>: los costos bajan, pero el ingreso de los trabajadores y su consumo también, y los precios caen en proporción. El empleo sigue en N** = ${VIS.n(N0,1)}.</p><p>La baja de salarios solo ayudaría si cambia otra cosa: si baja la tasa de interés (más dinero real) y sube la inversión. Pero también puede empeorar las expectativas o aumentar el peso real de las deudas, y entonces D cae. Por eso Keynes rechaza la flexibilidad salarial como remedio.</p>`)
      +VIS.sec("Resultado",`<div class="res">${tiles([["Empleo N**",VIS.n(N0,1)+" (igual)"],["Desempleo involuntario",VIS.n(Ns-N0,1)+" (igual)"]])}</div>`);
    else{const mvl=[],cs=[];
      if(mI){mvl.push(`La demanda agregada se desplazó <b>${I>20?"hacia arriba":"hacia abajo"}</b>: la inversión esperada pasó de 20 a ${VIS.n(I,1)}.`);cs.push(I>20?"Más inversión pública o privada: el Estado coopera con la inversión, o mejora la eficiencia marginal del capital.":"Expectativas pesimistas: la eficiencia marginal del capital cae por debajo de la tasa de interés.")}
      if(mC){mvl.push(`La pendiente de D cambió: la propensión marginal a consumir es ${VIS.n(c,1)}.`);cs.push(c<0.7?"Los hogares ahorran una fracción mayor de su ingreso (la paradoja del ahorro).":"Los hogares consumen una fracción mayor de su ingreso.")}
      if(mK){mvl.push(`La oferta agregada se desplazó <b>${k>0.006?"hacia arriba":"hacia abajo"}</b>.`);cs.push(k>0.006?"Los rendimientos decrecientes se vuelven más fuertes: cada trabajador adicional produce menos y los empresarios necesitan esperar más ingreso para contratarlo.":"Mejora la productividad: se necesita menos ingreso esperado para contratar.")}
      const gap=N1>Ns;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))
        +VIS.sec("Mecanismo",`<p>En el empleo inicial ${VIS.n(N0,1)}, ahora D ${D(c,I)(N0)>Z(k)(N0)?"supera a":"queda por debajo de"} Z: los empresarios esperan vender ${D(c,I)(N0)>Z(k)(N0)?"más":"menos"} de lo que necesitan para cubrir costos y ${D(c,I)(N0)>Z(k)(N0)?"contratan más":"despiden"} trabajadores. Como la propensión a consumir es menor que 1, D crece más despacio que Z y el ajuste se detiene en el nuevo corte. ${gap?`La demanda alcanza para más que el pleno empleo: el empleo queda en N* y el exceso presiona los precios.`:`La demanda determina la producción: la antiley de Say.`}</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Empleo N**",N0,Ne,1),VIS.tile("Desempleo involuntario",Ns-N0,Math.max(0,Ns-N1),1)])}</div><p>${Ne<Ns-0.5?"Sigue habiendo desempleo involuntario de equilibrio: nada en el mercado lo corrige por sí solo.":"Se alcanza el pleno empleo: el caso particular de la teoría general."}</p>`)}
    return{panels:[P],text:h}}});

// 3. Hicks (1937): IS-LM con la LM clásica, la trampa de la liquidez y el caso general
VIS.add("hicks",{t:"Hicks: IS-LM, caso clásico, trampa de la liquidez y caso general",
  hint:"Escoge el modelo de Hicks y arrastra la IS (gasto autónomo) o la LM (cantidad de dinero) para ver qué política funciona en cada uno.",
  opts:[{id:"lm",lab:"Modelo de Hicks",ch:[["clasico","I. Clásico (M = kY)"],["trampa","II. Teoría especial (trampa)"],["general","III-IV. General"]],v:"general"}],
  p0:{dA:0,dM:0},lim:{dA:[-100,100],dM:[-150,150]},
  presets:[["Expansión fiscal (∆+G)",{dA:40}],["Expansión monetaria (∆+M)",{dM:80}],["Cae la inversión (pesimismo)",{dA:-50}]],
  fit:{dA:(x,y)=>(x+40*y-1000)/4,dM:(x,y,st)=>st.o.lm==="clasico"?0.5*x-400:st.o.lm==="trampa"?0.5*x-20*y-340:0.5*x-20*y-300},
  compute(st){const md=st.o.lm,{dA,dM}=st.p,IS=a=>Y=>(1000+4*a-Y)/40;
    const LMf=m=>md==="general"?(Y=>(0.5*Y-300-m)/20):md==="trampa"?(Y=>Math.max(5,(0.5*Y-340-m)/20)):null;
    const eq=(a,m)=>{if(md==="clasico"){const Y=800+2*m;return{Y,i:IS(a)(Y)}}
      if(md==="general"){const Y=800+2*a+m;return{Y,i:IS(a)(Y)}}
      const Yf=800+4*a;if(Yf<=880+2*m)return{Y:Yf,i:5};const Y=840+2*a+m;return{Y,i:IS(a)(Y)}};
    const E0=eq(0,0),E1=eq(dA,dM),mF=Math.abs(dA)>0.5,mM=Math.abs(dM)>0.5,mv=mF||mM;
    const lmSh=m=>md==="clasico"?VIS.vx(800+2*m):VIS.fx(LMf(m));
    const curves=[{sh:VIS.fx(IS(0)),col:"--line",dash:1,op:.55,lab:mF?"IS":""},{sh:lmSh(0),col:"--branch",dash:1,op:.55,lab:mM?"LM":""},{sh:VIS.fx(IS(dA)),col:"--line",lab:mF?"IS’":"IS"},{sh:lmSh(dM),col:"--branch",lab:mM?"LM’":"LM"}];
    const pts=[{x:E0.Y,y:E0.i,lab:"0"}];if(mv)pts.push({x:E1.Y,y:E1.i,lab:"1",col:"--good"});
    const hLM=md==="clasico"?{x:800+2*dM,y:9}:md==="trampa"?{x:1000,y:LMf(dM)(1000)}:{x:950,y:LMf(dM)(950)};
    const P={cap:{clasico:"Modelo I (clásico): LM vertical",trampa:"Modelo II (teoría especial): trampa de la liquidez",general:"Modelos III y IV: LM con pendiente positiva"}[md],xr:[400,1200],yr:[0,12],xl:"Producto Y",yl:"Tasa de interés i (%)",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,pts,
      handles:[{c:"dA",x:600+4*dA,y:10,col:"--line",name:"la IS"},{c:"dM",x:hLM.x,y:hLM.y,col:"--branch",name:"la LM"}]};
    const lect={clasico:"La demanda de dinero solo depende del ingreso (M = kY, teoría cuantitativa de Cambridge). El producto lo fija el dinero: la política monetaria mueve Y y la fiscal solo sube la tasa de interés (desplazamiento total de la inversión privada).",
      trampa:"Con la tasa en su mínimo, la gente atesora todo el dinero adicional (M = L(i) infinitamente elástica). La política monetaria no baja la tasa ni mueve Y; la fiscal tiene todo el multiplicador, sin desplazamiento. Es lo que Hicks llama la teoría «especial» de Keynes.",
      general:"La demanda de dinero depende del ingreso y de la tasa: las dos políticas mueven Y, la fiscal con desplazamiento parcial de la inversión. Es el modelo de la síntesis neoclásica."}[md];
    let h;if(!mv)h=`<p>Todavía no hay cambios. ${lect} Equilibrio inicial: Y = ${VIS.n(E0.Y,0)}, i = ${VIS.n(E0.i,1)} %. Arrastra una curva o prueba un choque.</p>`;
    else{const mvl=[],cs=[];if(mF){mvl.push(`La IS se desplazó <b>${dA>0?"a la derecha":"a la izquierda"}</b> (gasto autónomo ${dA>0?"+":"−"}${VIS.n(Math.abs(dA),0)}).`);cs.push(dA>0?"Más gasto público o menos impuestos (política fiscal expansiva), o más inversión autónoma.":"Cae la inversión por expectativas pesimistas, o política fiscal contractiva.")}
      if(mM){mvl.push(`La LM se desplazó <b>${dM>0?"a la derecha":"a la izquierda"}</b> (cantidad de dinero ${dM>0?"+":"−"}${VIS.n(Math.abs(dM),0)}).`);cs.push(dM>0?"El banco central aumenta la oferta monetaria.":"El banco central reduce la oferta monetaria.")}
      const dY=E1.Y-E0.Y;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",`<p>${lect}</p><p>${mF&&!mM?(Math.abs(dY)<1?"El cambio del gasto no mueve el producto: toda la expansión se va en la tasa de interés.":`Con el multiplicador simple (4) el producto cambiaría ${VIS.n(4*dA,0)}; aquí cambia ${VIS.n(dY,0)}${Math.abs(dY-4*dA)>1?" porque la tasa de interés sube y desplaza parte de la inversión":" porque la tasa no se mueve"}.`):mM&&!mF?(Math.abs(dY)<1?"El dinero adicional no mueve el producto: la tasa no puede bajar más.":`La tasa de interés ${E1.i<E0.i?"baja":"sube"}, la inversión ${E1.i<E0.i?"aumenta":"cae"} y el producto cambia ${VIS.n(dY,0)}.`):`El producto cambia ${VIS.n(dY,0)} en total.`}</p>`)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Producto Y",E0.Y,E1.Y,0),VIS.tile("Tasa de interés i",E0.i,E1.i,1," %")])}</div>`)}
    return{panels:[P],text:h}}});

// 4. Curva de Phillips: Samuelson-Solow, Friedman y Lucas
VIS.add("phillips",{t:"Curva de Phillips: Samuelson-Solow, Friedman y Lucas",
  hint:"Arrastra el punto de la economía a lo largo de la curva de corto plazo, o desplaza la curva entera (inflación esperada). Cambia la lectura teórica.",
  opts:[{id:"reg",lab:"Lectura",ch:[["ss","Samuelson-Solow"],["fr","Friedman"],["lu","Lucas"]],v:"fr",reset:false}],
  p0:{pe:2,U:5},lim:{pe:[-2,8],U:[1,10]},
  presets:[["Expansión monetaria: U baja a 3 %",{U:3}],["Las expectativas se ajustan",{U:5,pe:4}],["Estanflación (choque de oferta)",{pe:6,U:7}],["Desinflación: U sube a 7 %",{U:7}]],
  fit:{U:(x)=>x,pe:(x,y)=>y+(x-5)},
  compute(st){const r=st.o.reg,{pe,U}=st.p,Un=5,SR=e=>u=>e-(u-Un),pi=SR(pe)(U),mP=Math.abs(pe-2)>0.05,mU=Math.abs(U-Un)>0.05,mv=mP||mU;
    const curves=[{sh:VIS.fx(SR(2)),col:"--line",dash:1,op:.55,lab:mP?"CP (πᵉ = 2 %)":""},{sh:VIS.fx(SR(pe)),col:"--line",lab:r==="ss"?"curva de Phillips":`CP corto plazo (πᵉ = ${VIS.n(pe,1)} %)`}];
    if(r!=="ss")curves.push({sh:VIS.vx(Un),col:"--good",lab:"largo plazo (Uₙ)",w:2});
    const pts=[{x:Un,y:2,lab:"0"}];if(mv)pts.push({x:U,y:pi,lab:"1",col:"--exam"});if(r==="fr"&&mU)pts.push({x:Un,y:pi,lab:"2",col:"--good"});
    const segs=[];if(r==="fr"&&mU)segs.push({x1:U,y1:pi,x2:Un,y2:pi,col:"--muted",dash:1,arrow:1});
    const P={cap:"Inflación y desempleo",xr:[0,10],yr:[-4,12],xl:"Desempleo U (%)",yl:"Inflación π (%)",fx:v=>VIS.n(v,0),fy:v=>VIS.n(v,0),curves,segs,pts,
      handles:[{c:"U",x:U,y:pi,col:"--exam",name:"la posición de la economía"},{c:"pe",x:1,y:SR(pe)(1),col:"--line",name:"la curva de corto plazo"}]};
    let h;
    if(!mv)h=`<p>Todavía no hay cambios. La economía está en la tasa natural Uₙ = ${Un} % con inflación de 2 %, igual a la esperada. ${r==="ss"?"Para Samuelson y Solow la curva es un menú estable: se puede escoger otro punto.":r==="fr"?"Para Friedman, a corto plazo hay una curva para cada inflación esperada; a largo plazo la curva es vertical en Uₙ.":"Para Lucas, con expectativas racionales solo las sorpresas sacan a la economía de Uₙ."}</p>`;
    else{const mvl=[],cs=[];
      if(mU)mvl.push(`La economía se movió a lo largo de la curva: U = ${VIS.n(U,1)} % y π = ${VIS.n(pi,1)} %.`);
      if(mP)mvl.push(`La curva de corto plazo se desplazó <b>${pe>2?"hacia arriba":"hacia abajo"}</b>: la inflación esperada es ${VIS.n(pe,1)} %.`);
      if(mU)cs.push(U<Un?"Una política monetaria o fiscal expansiva aumenta la demanda.":"Una política contractiva (desinflación) reduce la demanda.");
      if(mP)cs.push(pe>2?"Los agentes esperan más inflación: por experiencia pasada (adaptativas) o por un choque de oferta como el del petróleo en los setenta.":"Los agentes esperan menos inflación: el banco central ganó credibilidad.");
      let m;
      if(r==="ss")m=`<p>La curva es un <b>menú de política</b>: menos desempleo a cambio de más inflación. ${mP?"Un desplazamiento de la curva no tiene lugar en esta lectura: la estanflación de los setenta, con más inflación y más desempleo a la vez, fue justamente lo que la derrumbó.":"El gobierno puede quedarse en el punto 1 de forma permanente."}</p>`;
      else if(r==="fr")m=mU&&pi>pe?`<p>La inflación (${VIS.n(pi,1)} %) supera a la esperada (${VIS.n(pe,1)} %): los trabajadores aceptan un salario real menor sin saberlo y las empresas contratan más. Con <b>expectativas adaptativas</b> corrigen el error: πᵉ sube, la curva de corto plazo se desplaza hacia arriba y el desempleo vuelve a ${Un} % (punto 2) con una inflación de ${VIS.n(pi,1)} %. Mantener U por debajo de Uₙ exige inflación cada vez mayor (aceleracionismo).</p>`
        :mU&&pi<pe?`<p>La inflación (${VIS.n(pi,1)} %) es menor que la esperada (${VIS.n(pe,1)} %): el salario real sube sin que nadie lo planee y el desempleo aumenta. Cuando las expectativas bajan, la curva desciende y el desempleo vuelve a ${Un} % con menos inflación: es el costo transitorio de la desinflación.</p>`
        :`<p>La inflación es igual a la esperada: la economía está sobre la vertical de largo plazo. ${mP?"Con más inflación esperada, el mismo desempleo natural convive con más inflación.":""}</p>`;
      else m=mU?`<p>Con <b>expectativas racionales</b>, una política anunciada se anticipa: los agentes elevan πᵉ en la misma medida y la economía sube por la vertical sin moverse de Uₙ. Llegar al punto 1 (U = ${VIS.n(U,1)} %) solo es posible con una <b>sorpresa</b> de ${VIS.n(pi-pe,1)} puntos, que no se puede repetir de forma sistemática: es la superneutralidad. Por la crítica de Lucas, la pendiente estimada de esta curva cambiaría con la política.</p>`:`<p>La curva de corto plazo se movió con las expectativas y la economía se quedó en Uₙ: la política anticipada solo cambia la inflación.</p>`;
      h=VIS.sec("Qué cambió",VIS.list(mvl))+VIS.sec("Qué pudo haberlo causado",VIS.list(cs))+VIS.sec("Mecanismo",m)
        +VIS.sec("Resultado",`<div class="res">${tiles([VIS.tile("Desempleo U",Un,U,1," %"),VIS.tile("Inflación π",2,pi,1," %"),VIS.tile("Inflación esperada",2,pe,1," %")])}</div>`)}
    return{panels:[P],text:h}}});
