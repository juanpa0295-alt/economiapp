
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
