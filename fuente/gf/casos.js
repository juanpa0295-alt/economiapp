// ===================== LABORATORIOS: CASOS REALES (Gerencia Financiera I) =====================
const LABORATORIOS=[
{id:"lab-prontopago",t:"¿Tomar el descuento por pronto pago aunque toque pedir prestado?",sector:"Pyme · capital de trabajo",links:["tasas","pagounico"],sim:"gfProntoPago",
 caso:{hDatos:"Los datos",hPaso:"Del cálculo a la decisión",rt:"Hazlo en Excel",
 sit:String.raw`<p>Un taller compra tela por $20.000.000. El proveedor ofrece <b>2/10 neto 30</b>: 2 % de descuento si paga en 10 días; si no, paga el total el día 30. El taller no tiene la plata el día 10, pero puede usar su cupo de crédito rotativo.</p>`,
 preg:String.raw`<p>¿Conviene endeudarse para tomar el descuento?</p>`,
 datos:String.raw`<ul><li>Factura: \(F=$20.000.000\); descuento \(d=2\,\%\); plazo con descuento 10 días; plazo total 30 días.</li>
<li>Cupo rotativo del banco: 24 % EA (supuesto).</li></ul>`,
 paso:String.raw`<ol><li><b>Lo que realmente cobra el proveedor.</b> No tomar el descuento es pedirle prestado $19.600.000 durante 20 días (del 10 al 30) y devolverle $20.000.000. La tasa del periodo es \(i=d/(1-d)=0{,}02/0{,}98=2{,}041\,\%\) por 20 días. No es 2 %: el descuento se calcula sobre lo que se paga, no sobre la factura.</li>
<li><b>Llevarla a efectiva anual</b> (tasas equivalentes): \(EA=(1+0{,}02041)^{365/20}-1=44{,}6\,\%\). En Excel: <code>=(1+0,02/0,98)^(365/20)-1</code>.</li>
<li><b>Comparar en la misma unidad.</b> El banco cobra 24 % EA, que en 20 días es \((1{,}24)^{20/365}-1=1{,}186\,\%\).</li>
<li><b>Regla:</b> si la EA del proveedor es mayor que la del banco, se toma el descuento con plata del banco.</li></ol>`,
 simh:"Cambia el descuento, los plazos y la tasa del banco. El simulador compara las dos tasas efectivas y calcula la plata que queda.",
 benef:String.raw`<p>Se toma el descuento: el banco cobra $19.600.000 × 1,186 % = $232.391 de intereses por 20 días, y el descuento ahorra $400.000. Quedan <b>$167.609 por cada compra</b>. Si el taller compra así una vez al mes, son unos $2.000.000 al año sin vender una unidad más.</p>`,
 limite:String.raw`<ul><li>Solo vale si el cupo existe y no se necesita para otra cosa más urgente (nómina, por ejemplo).</li>
<li>Si el proveedor en la práctica acepta pagos el día 45 o 60 sin penalidad, la tasa implícita baja y la decisión puede cambiar.</li>
<li>La comparación usa tasas efectivas. Comparar el 2 % contra una tasa mensual del banco es el error más común.</li></ul>`,
 r:String.raw`B1  Factura             20000000
B2  Descuento           0,02
B3  Días con descuento  10
B4  Días totales        30
B5  Tasa banco EA       0,24
B6  i del proveedor     =B2/(1-B2)
B7  EA del proveedor    =(1+B6)^(365/(B4-B3))-1
B8  i banco (periodo)   =(1+B5)^((B4-B3)/365)-1
B9  Intereses banco     =B1*(1-B2)*B8
B10 Ahorro neto         =B1*B2-B9`}},
{id:"lab-maquina",t:"¿Se paga sola la máquina nueva? VPN, TIR y periodo de recuperación",sector:"Industria · presupuesto de capital",links:["criterios","flujos"],sim:"gfMaquina",
 caso:{hDatos:"Los flujos de caja",hPaso:"De los flujos a la decisión",rt:"Hazlo en Excel",
 sit:String.raw`<p>Una empresa de confección evalúa comprar una cortadora automática. Le ahorra mano de obra y desperdicio de tela, y le permite aceptar más pedidos.</p>`,
 preg:String.raw`<p>¿Crea valor la inversión con la TIO de la empresa? ¿Cuánto pueden caer los ahorros antes de que deje de convenir?</p>`,
 datos:String.raw`<ul><li>Inversión en el año 0: $45.000.000.</li>
<li>Ahorro neto anual (más margen de los pedidos nuevos, menos mantenimiento): $12.000.000 durante 6 años.</li>
<li>Valor de salvamento en el año 6: $5.000.000.</li>
<li>TIO: 15 % EA. Todas las cifras son supuestos del caso: cámbialas en el simulador.</li></ul>`,
 paso:String.raw`<ol><li><b>VPN</b> a la TIO: \(VPN=-45+12\cdot\dfrac{1-(1{,}15)^{-6}}{0{,}15}+\dfrac{5}{(1{,}15)^6}=-45+45{,}41+2{,}16=+2{,}58\) millones. En Excel: <code>=VNA(15%;B2:B7)+B1</code>.</li>
<li><b>TIR:</b> la tasa que hace VPN = 0 es 17,0 % EA (<code>=TIR(B1:B7)</code>). Supera la TIO por 2 puntos.</li>
<li><b>Periodo de recuperación descontado:</b> 5,6 años. Recupera la inversión casi al final de su vida útil.</li>
<li><b>Flujo de equilibrio:</b> el ahorro anual que deja VPN = 0 es \(A=\dfrac{45-5(1{,}15)^{-6}}{(1-(1{,}15)^{-6})/0{,}15}=11{,}32\) millones. Con <code>=PAGO(TIO;n;-VPN)</code> se obtiene el mismo margen expresado como cuota.</li></ol>`,
 simh:"Mueve la inversión, el ahorro anual, la vida útil y la TIO. La curva es el perfil del VPN: corta el eje en la TIR.",
 benef:String.raw`<p>La máquina crea valor: $2,58 millones de hoy por encima de lo que exige la TIO. Pero el margen es estrecho: si los ahorros reales son 5,7 % menores que los estimados ($11,32 millones en vez de $12), el proyecto ya no conviene. La decisión práctica es comprarla <b>solo si los $12 millones de ahorro están bien soportados</b> (cotizaciones, tiempos medidos) o negociar un precio menor: cada millón de descuento suma un millón al VPN.</p>`,
 limite:String.raw`<ul><li>VPN y TIR suponen que los flujos se conocen. Si son inciertos, haz el análisis de escenarios de la estación de riesgo.</li>
<li>La TIR supone que los flujos se reinvierten a la TIR; si no es así, usa la TIRM.</li>
<li>Para comparar máquinas con vidas útiles distintas se usa el CAUE, no el VPN directo.</li></ul>`,
 r:String.raw`B1  Año 0   -45000000
B2  Año 1    12000000
...
B7  Año 6    =12000000+5000000
B9  VPN     =VNA(15%;B2:B7)+B1
B10 TIR     =TIR(B1:B7)
B11 Flujo de equilibrio  =(-B1-5000000/(1+15%)^6)/((1-(1+15%)^-6)/15%)`}},
{id:"lab-cartera",t:"¿Vale la pena la compra de cartera? Cuota, comisión y ahorro en valor presente",sector:"Finanzas personales y de la empresa · deuda",links:["anualidades","amortizacion"],sim:"gfCartera",
 caso:{hDatos:"Los datos",hPaso:"Del cálculo a la decisión",rt:"Hazlo en Excel",
 sit:String.raw`<p>Una persona debe $30.000.000 a 36 meses, al 2,2 % mensual. Otro banco le ofrece comprarle la deuda al 1,6 % mensual con el mismo plazo, pero cobra una comisión de 1,5 % del saldo al desembolsar.</p>`,
 preg:String.raw`<p>¿Cuánto se ahorra de verdad, en pesos de hoy, después de la comisión?</p>`,
 datos:String.raw`<ul><li>Saldo \(P=$30.000.000\); \(n=36\) cuotas mensuales vencidas.</li>
<li>Tasa actual \(i_0=2{,}2\,\%\) mensual; tasa nueva \(i_1=1{,}6\,\%\) mensual; comisión 1,5 %.</li></ul>`,
 paso:String.raw`<ol><li><b>Cuota actual</b> (anualidad vencida): \(A_0=P\,i_0/[1-(1+i_0)^{-n}]=$1.215.120\). En Excel: <code>=PAGO(2,2%;36;-30000000)</code>.</li>
<li><b>Cuota nueva:</b> \(A_1=$1.102.717\). Ahorro de $112.404 al mes, $4.046.528 en total, sin descontar.</li>
<li><b>Ahorro en valor presente:</b> la diferencia de cuotas es una anualidad de 36 meses. Descontada al 1,6 % vale $3.058.000 hoy.</li>
<li><b>Restar la comisión:</b> $30.000.000 × 1,5 % = $450.000. Ahorro neto: $2.608.000 de hoy.</li>
<li><b>Comisión de equilibrio:</b> el cambio deja de convenir solo si la comisión supera 10,2 % del saldo.</li></ol>`,
 simh:"Cambia el saldo, las tasas, el plazo y la comisión. Mira cómo se compara el ahorro sumado con el ahorro en valor presente.",
 benef:String.raw`<p>Conviene trasladar la deuda: deja $2,6 millones de hoy. La comisión parece cara, pero es pequeña frente a 0,6 puntos menos de tasa mensual durante 36 meses. Lo que <b>no</b> conviene es aprovechar el traslado para alargar el plazo: con 60 meses la cuota baja más, pero se pagan muchos más intereses.</p>`,
 limite:String.raw`<ul><li>Revisa la tasa efectiva con todos los costos: seguros, estudio de crédito y cuota de manejo. Cambian la cuota real.</li>
<li>Si la deuda vieja tiene penalidad por prepago, súmala a la comisión.</li>
<li>Para descontar se usó la tasa nueva. Si tu TIO es otra, el valor presente cambia, aunque la decisión casi nunca se invierte.</li></ul>`,
 r:String.raw`B1 Saldo        30000000
B2 n            36
B3 i actual     2,2%
B4 i nueva      1,6%
B5 Comisión     1,5%
B6 Cuota actual =PAGO(B3;B2;-B1)
B7 Cuota nueva  =PAGO(B4;B2;-B1)
B8 VP ahorro    =VA(B4;B2;-(B6-B7))
B9 Ahorro neto  =B8-B1*B5`}}
];
