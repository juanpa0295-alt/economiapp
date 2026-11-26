// ===================== LABORATORIOS: CASOS REALES (Macroeconomía II) =====================
const LABORATORIOS=[
{id:"lab-forward",t:"Cubrir un pago en dólares con un forward: la paridad cubierta en la práctica",sector:"Importadores · riesgo cambiario",links:["paridades","divisas"],sim:"m2Forward",
 caso:{hDatos:"Los datos",hPaso:"De la teoría a la decisión",rt:"Hazlo a mano",
 sit:String.raw`<p>Un importador compra maquinaria por <b>US$50.000</b> que paga dentro de 6 meses. Ya la vendió a un cliente local por $230 millones, precio fijo en pesos. Si el dólar sube, su margen desaparece.</p>`,
 preg:String.raw`<p>¿Cuánto cuesta asegurar hoy el tipo de cambio y cuánto podría perder si no lo asegura?</p>`,
 datos:String.raw`<ul><li>Tipo de cambio de contado \(E=4.000\) pesos por dólar (supuesto).</li>
<li>Tasa en pesos \(i=9\,\%\) EA y en dólares \(i^*=4{,}5\,\%\) EA (supuestos).</li>
<li>Volatilidad anual del tipo de cambio: 15 % (supuesto razonable para el peso).</li></ul>`,
 paso:String.raw`<ol><li><b>Paridad cubierta de intereses:</b> el banco no adivina el dólar futuro; arma el forward pidiendo prestado en pesos, comprando dólares hoy y depositándolos. Por eso \(F=E\left(\dfrac{1+i}{1+i^*}\right)^{t}\).</li>
<li>Con \(t=0{,}5\) años: \(F=4.000\times(1{,}09/1{,}045)^{0{,}5}=4.085{,}2\).</li>
<li><b>Costo cubierto:</b> \(50.000\times4.085{,}2=$204{,}26\) millones. Margen asegurado: \(230-204{,}26=$25{,}74\) millones.</li>
<li><b>Sin cubrir:</b> en 6 meses la desviación del tipo de cambio es \(15\,\%\times\sqrt{0{,}5}=10{,}6\,\%\). En un escenario malo (5 % de probabilidad) el dólar llega a \(4.085\times(1+1{,}645\times0{,}106)=4.798\).</li>
<li>En ese escenario el pago cuesta $239,9 millones y el margen es <b>−$9,9 millones</b>.</li></ol>`,
 simh:"Cambia el monto, las tasas, el plazo y la volatilidad. La curva muestra los posibles costos sin cubrir; la línea verde es el costo cubierto.",
 benef:String.raw`<p>El forward no es una apuesta: fija el costo en $204,26 millones y garantiza $25,7 millones de margen. Sin cubrir, el importador gana más si el dólar baja, pero con 5 % de probabilidad pierde casi $10 millones en una venta ya pactada. Para una empresa pequeña esa pérdida puede ser la diferencia entre pagar la nómina o no. <b>Regla práctica:</b> cubre lo que ya vendiste en pesos.</p>`,
 limite:String.raw`<ul><li>El forward obliga: si la compra se cae, igual hay que cumplirlo (o liquidarlo con ganancia o pérdida).</li>
<li>El banco cobra un diferencial sobre el \(F\) teórico; pide varias cotizaciones.</li>
<li>Si el precio de venta también está en dólares, el riesgo se compensa solo y cubrir puede no hacer falta.</li></ul>`,
 r:String.raw`F       = E·((1 + i)/(1 + i*))^t = 4.000·(1,09/1,045)^0,5 = 4.085,2
Costo   = 50.000·4.085,2 = $204,26 millones  → margen 230 − 204,26 = 25,74
σ(6 m)  = 0,15·√0,5 = 0,106
E malo  = 4.085,2·(1 + 1,645·0,106) = 4.798 → costo 239,9 → margen −9,9`}},
{id:"lab-exportador",t:"Exportar con un dólar quieto y una inflación que sube: el tipo de cambio real del exportador",sector:"Exportadores · competitividad",links:["paridades","tcr"],sim:"m2Exportador",
 caso:{hDatos:"Los datos",hPaso:"De la teoría a la decisión",rt:"Hazlo a mano",
 sit:String.raw`<p>Una confección exporta camisetas a EE. UU. a <b>US$12</b> la unidad. Sus costos son en pesos: $38.000 por unidad. El dueño mira la tasa de cambio todos los días y, como el dólar está en 4.000 desde hace un año, cree que nada cambió.</p>`,
 preg:String.raw`<p>¿Qué pasa con el margen si el dólar no se mueve pero la inflación de Colombia es mayor que la de EE. UU.? ¿Con qué tipo de cambio deja de ser rentable?</p>`,
 datos:String.raw`<ul><li>\(E=4.000\), precio en dólares \(P^*=12\), costo unitario \(C=38.000\) (supuestos).</li>
<li>Inflación en un año: Colombia \(\pi=5\,\%\), EE. UU. \(\pi^*=2{,}5\,\%\) (supuestos).</li></ul>`,
 paso:String.raw`<ol><li><b>Margen hoy:</b> \(E\cdot P^*-C=48.000-38.000=10.000\) por unidad (20,8 %). Tipo de cambio de equilibrio: \(C/P^*=3.167\).</li>
<li><b>Un año después</b>, con \(E\) igual: el costo sube con la inflación local a \(38.000\times1{,}05=39.900\) y el precio en dólares sube con la de EE. UU. a \(12\times1{,}025=12{,}30\).</li>
<li><b>Margen nuevo:</b> \(4.000\times12{,}30-39.900=9.300\). Bajó 7 % sin que el dólar se moviera.</li>
<li><b>El tipo de cambio real</b> \(TCR=EP^*/P\) explica por qué: \(\dfrac{\Delta TCR}{TCR}\approx\dfrac{\Delta E}{E}+\pi^*-\pi=0+2{,}5-5=-2{,}5\,\%\). Hubo una <b>apreciación real</b>, aunque el nominal estuvo quieto.</li>
<li>El tipo de cambio de equilibrio sube a \(39.900/12{,}30=3.244\).</li></ol>`,
 simh:"Cambia la devaluación nominal y las inflaciones. El simulador separa lo que viene del dólar y lo que viene de la inflación.",
 benef:String.raw`<p>El exportador que mira el TCR ve venir la pérdida de margen y actúa a tiempo: renegocia el precio en dólares (subirlo 2,4 % devuelve el margen en términos reales), busca eficiencias que bajen el costo, o cubre parte de sus ventas futuras. Con 100.000 unidades al año, la erosión del ejemplo son $70 millones que no aparecen mirando solo la tasa de cambio nominal.</p>`,
 limite:String.raw`<ul><li>Usa la inflación general como si fuera la de tus costos. Si tus insumos son importados, parte del costo sube con el dólar y el efecto es menor.</li>
<li>El ITCR del Banco de la República pondera muchos socios; para una empresa importa el país al que le vende.</li>
<li>Subir el precio en dólares depende de la competencia: si el cliente tiene proveedores en otros países, la elasticidad manda.</li></ul>`,
 r:String.raw`Margen hoy     = 4.000·12 − 38.000 = 10.000
Costo en 1 año = 38.000·1,05 = 39.900
Precio US$     = 12·1,025 = 12,30
Margen nuevo   = 4.000·12,30 − 39.900 = 9.300
ΔTCR/TCR ≈ ΔE/E + π* − π = 0 + 2,5 % − 5 % = −2,5 %
E de equilibrio = 39.900/12,30 = 3.244`}},
{id:"lab-carry",t:"¿Invertir en TES en pesos o en bonos en dólares? Paridad descubierta y devaluación de equilibrio",sector:"Inversión · portafolio",links:["paridades","divisas"],sim:"m2Carry",
 caso:{hDatos:"Los datos",hPaso:"De la teoría a la decisión",rt:"Hazlo a mano",
 sit:String.raw`<p>Un inversionista tiene ahorros en dólares y ve que los bonos del gobierno colombiano pagan mucho más que los de EE. UU. Piensa pasar su plata a pesos un año y volver.</p>`,
 preg:String.raw`<p>¿Hasta cuánto puede devaluarse el peso antes de que la operación pierda frente a quedarse en dólares?</p>`,
 datos:String.raw`<ul><li>Tasa en pesos \(i=10\,\%\) EA; tasa en dólares \(i^*=4{,}5\,\%\) EA (supuestos).</li>
<li>\(E_0\) hoy y \(E_1\) en un año; devaluación \(d=E_1/E_0-1\).</li></ul>`,
 paso:String.raw`<ol><li><b>Rentabilidad en dólares de invertir en pesos:</b> cambia 1 dólar a \(E_0\) pesos, gana \(i\) y vuelve a \(E_1\): \(\dfrac{(1+i)E_0}{E_1}-1=\dfrac{1+i}{1+d}-1\).</li>
<li><b>Devaluación de equilibrio:</b> igualando con \(i^*\): \(d^*=\dfrac{1+i}{1+i^*}-1=\dfrac{1{,}10}{1{,}045}-1=5{,}26\,\%\). Es la versión exacta de la paridad descubierta \(i=i^*+\dfrac{E^e-E}{E}\).</li>
<li>Si el peso se devalúa 3 %, la operación rinde 6,8 % en dólares; si se devalúa 12 %, pierde 1,8 %.</li>
<li><b>La diferencia de tasas no es regalo:</b> recoge la devaluación esperada y la prima de riesgo país. Si el mercado espera 4 % de devaluación, la prima es cerca de 1,2 puntos.</li></ol>`,
 simh:"Cambia las tasas, la devaluación que esperas y la volatilidad. Verás la rentabilidad en dólares y la probabilidad de perder frente a quedarse en dólares.",
 benef:String.raw`<p>El cálculo convierte una corazonada («los TES pagan más») en un número para comparar: la operación gana solo si el peso se devalúa menos de 5,26 % en el año. El inversionista compara ese umbral con lo que espera del dólar y con su tolerancia a perder; el simulador le dice la probabilidad de quedar por debajo de \(i^*\).</p>`,
 limite:String.raw`<ul><li>Las devaluaciones grandes llegan de golpe (crisis): la distribución tiene colas más pesadas que la normal del simulador.</li>
<li>Los TES cambian de precio si suben las tasas; venderlos antes del vencimiento agrega riesgo de mercado.</li>
<li>Impuestos y comisiones de cambio reducen la rentabilidad de ambos lados.</li></ul>`,
 r:String.raw`Rentabilidad en US$ = (1 + i)/(1 + d) − 1
d* = (1 + i)/(1 + i*) − 1 = 1,10/1,045 − 1 = 5,26 %
d = 3 %  → 1,10/1,03 − 1 = 6,8 %
d = 12 % → 1,10/1,12 − 1 = −1,8 %`}}
];
