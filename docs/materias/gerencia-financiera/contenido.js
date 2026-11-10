// Gerencia Financiera I · contenido de la ruta (notación y casos del prof. Luis Fernando Vásquez Villa)
// =====================================================================
// CONTENIDO: Gerencia Financiera I (U. de Antioquia), con la notación y los casos del profesor Luis Fernando Vásquez Villa
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const WSBOX=`<div class="sim" id="sim"></div>`;
const XL=(rows)=>`<div class="tbl"><table><tr><th>Qué calcula</th><th>Fórmula matemática</th><th>Excel</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td><code>${r[2]}</code></td></tr>`).join("")}</table></div>`;

const TRUNK=[
{id:"metodo", t:"El método del curso y el formato del parcial", nuevo:true, html:String.raw`
<section><h3>Los cuatro pasos</h3>
<p class="lead">El profesor adapta el método de cuatro pasos para resolver problemas: todo ejercicio de valor del dinero en el tiempo se resuelve siempre igual, y el parcial califica cada paso por separado.</p>
<ol class="steps"><li><b>Entender:</b> leer el enunciado completo e identificar los datos. Herramienta: el <b>flujo de caja gráfico</b> (línea de tiempo con flechas hacia arriba para ingresos y hacia abajo para egresos).</li>
<li><b>Plantear:</b> escribir las variables con su valor, identificar la incógnita y armar la <b>ecuación de valor</b> en una fecha focal.</li>
<li><b>Resolver:</b> hacer las operaciones con las funciones financieras de Excel.</li>
<li><b>Interpretar:</b> responder la pregunta y explicar qué significa el resultado.</li></ol></section>
<section><h3>Variables y su denominación</h3>
<div class="tbl"><table><tr><th>Símbolo</th><th>Nombre</th><th>Argumento en Excel</th></tr>
<tr><td>\(P\)</td><td>Valor presente</td><td><code>VA</code> (valor actual)</td></tr>
<tr><td>\(F\)</td><td>Valor futuro</td><td><code>VF</code></td></tr>
<tr><td>\(i\)</td><td>Tasa de interés del período</td><td><code>Tasa</code></td></tr>
<tr><td>\(n\)</td><td>Número de períodos (plazo)</td><td><code>Nper</code></td></tr>
<tr><td>\(A\)</td><td>Cuota o pago periódico (anualidad)</td><td><code>Pago</code></td></tr>
<tr><td>\(G\), \(g\)</td><td>Gradiente aritmético (pesos) o geométrico (%)</td><td>Se arma la tabla de flujos</td></tr>
<tr><td>\(j\), \(m\)</td><td>Tasa nominal y número de capitalizaciones al año</td><td><code>TASA.NOMINAL</code>, <code>INT.EFECTIVO</code></td></tr></table></div>
<p class="warn"><b>Signos en Excel:</b> las funciones financieras tratan el dinero que sale y el que entra con signos opuestos. Si pones el depósito positivo, <code>VF</code> da negativo. Escribe <code>=VF(i;n;0;-P)</code> para obtener un valor positivo.</p>
<p class="hint">El Excel de la sala usa punto y coma (;) para separar los argumentos y coma decimal, como en Colombia.</p></section>
<section><h3>Cómo se califica el parcial</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Peso por literal</th><th>Qué debe quedar</th></tr>
<tr><td>Plantear</td><td class="num">20 %</td><td>Variables con su valor y la fórmula matemática, pegadas en el Word</td></tr>
<tr><td>Resolver: funciones</td><td class="num">40 %</td><td>Funciones financieras y fórmulas visibles y enlazadas en el Excel (incluidas las tablas)</td></tr>
<tr><td>Resolver: resultado</td><td class="num">30 %</td><td>Valor correcto, copiado del Excel al Word</td></tr>
<tr><td>Interpretar</td><td class="num">10 %</td><td>Significado financiero del resultado</td></tr></table></div>
<ul><li>Si pegas valores en el Excel sin fórmulas, el literal vale máximo 60 %.</li>
<li>Sin variables, fórmulas o resultado en el Word no se acredita plantear ni el resultado, aunque el Excel esté bien.</li>
<li>Word y Excel deben coincidir (tolerancia ±2 %). Tasas con al menos cuatro decimales y pesos con dos.</li>
<li>Convenciones: mes = 30 días, año = 12 meses, la DTF se expresa como N.A.T.A.</li>
<li>Una hoja por ejercicio (EJ1, EJ2…) y una hoja CONCEPTOS. No ocultes ni protejas hojas.</li></ul></section>
<section><h3>Plantilla sugerida para cada hoja</h3>
<div class="tbl"><table><tr><th>Celda</th><th>Contenido</th></tr>
<tr><td>A1:B1</td><td>Título del ejercicio</td></tr>
<tr><td>A3:B6</td><td>Variables: símbolo y nombre en A, valor en B (por ejemplo, A3 «P: valor presente», B3 250000000)</td></tr>
<tr><td>A8:B10</td><td>Resultados con su función (B8 <code>=VF(B4;B5;0;-B3)</code>)</td></tr>
<tr><td>A12 en adelante</td><td>Tabla con fórmulas en la primera fila que se arrastran hacia abajo</td></tr></table></div>
<p>Con esta estructura, copiar al Word es rápido: la tabla de variables, la fórmula que muestra la barra de fórmulas y el resultado. Usa referencias absolutas (<code>$B$4</code>) para las variables y relativas para la fila anterior, así la tabla se llena arrastrando.</p></section>`,
qs:[{q:"¿Por qué no basta con escribir el resultado correcto en el Word?",a:"Porque el resultado vale solo el 30 % del literal. Plantear (variables y fórmula) vale 20 % y las funciones visibles en Excel 40 %; si pegas valores, el literal queda en máximo 60 %."}]},

// ======================= UNIDAD I =======================
{id:"vdt", t:"Valor del dinero en el tiempo: interés simple y compuesto", sim:"cap", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Pepito Pérez dice que le da igual recibir $100.000 hoy o dentro de tres meses. No es así: el dinero de hoy se puede invertir y ganar intereses, y la inflación le quita poder de compra al dinero futuro. Por eso un peso hoy vale más que un peso mañana.</p>
<p>Los parámetros del valor del dinero en el tiempo son la tasa de interés, el período de tiempo, los flujos de efectivo y las equivalencias financieras.</p></section>
<section><h3>Interés simple</h3>
<p>Los intereses se calculan siempre sobre el capital inicial: no se reinvierten.</p>
<div class="mj">\[I=P\cdot i\cdot n,\qquad F=P(1+i\cdot n)\]</div>
<p><b>Ejemplo de clase:</b> Pepito deposita $300.000 al 10 % anual durante tres años. Cada año gana $30.000, en total $90.000, y acumula $390.000.</p></section>
<section><h3>Interés compuesto</h3>
<p>Los intereses de cada período se suman al capital y ganan intereses en el siguiente.</p>
<div class="mj">\[F=P(1+i)^n,\qquad I=F-P\]</div>
<p><b>Mismo ejemplo:</b> 330.000, 363.000 y 399.300. Los intereses son $99.300, más que con interés simple, porque los intereses ganan intereses.</p>
${XL([["Valor futuro","\\(F=P(1+i)^n\\)","=VF(i;n;0;-P)"],["Intereses de una fila","\\(I_k=C_{k}\\cdot i\\)","=B13*$B$4"],["Capital final de una fila","\\(C_k+I_k\\)","=B13+C13"],["Total de intereses","\\(F-P\\)","=SUMA(D13:D18)"]])}
<p>Así se pide en el ejercicio 1 del parcial de práctica: la tabla de capitalización (capital inicial, tasa, intereses, capital final) y el valor final con <code>VF</code>.</p></section>
${LAB}`,
qs:[{q:"¿Con $250.000.000 al 2,8 % mensual, cuánto se acumula en 6 meses?",a:"F = 250.000.000·1,028⁶ = $295.052.090,90, con =VF(2,8%;6;0;-250000000). Los intereses son $45.052.090,90."}]},

{id:"pagounico", t:"Pagos únicos: ecuación de valor y fecha focal", sim:"eqv", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Dos sumas de dinero en fechas distintas solo se pueden comparar o sumar si se llevan a la misma fecha, la <b>fecha focal</b>, con la tasa de interés. La ecuación de valor iguala, en esa fecha, lo que se debe con lo que se paga.</p>
<div class="mj">\[F=P(1+i)^n\qquad\Longleftrightarrow\qquad P=\frac{F}{(1+i)^n}\]</div>
<p>Para llevar un valor hacia adelante se multiplica por \((1+i)^n\) (factor F/P); para traerlo hacia atrás se divide (factor P/F).</p></section>
<section><h3>Cuando la tasa cambia</h3>
<p>Si la tasa cambia en un mes \(k\), el valor se mueve por tramos: primero con la tasa nueva hasta el mes \(k\) y luego con la anterior hasta la fecha focal. Nunca se promedian las tasas.</p>
<div class="mj">\[P=\frac{F}{(1+i_1)^{k}(1+i_2)^{n-k}}\]</div></section>
<section><h3>Caso 1 de clase</h3>
<p>Una persona debe pagar $1.000.000 en el mes 6, $1.500.000 en el 12, $2.500.000 en el 18 y $2.500.000 en el 24.</p>
<div class="tbl"><table><tr><th>Variante</th><th>Fecha focal</th><th>Tasa</th><th>Resultado</th></tr>
<tr><td>a</td><td>Hoy</td><td>2 % mensual</td><td class="num">$5.375.413,30</td></tr>
<tr><td>b</td><td>Hoy</td><td>2 % hasta el mes 12, 2,5 % desde el segundo año</td><td class="num">$5.236.220,98</td></tr>
<tr><td>c</td><td>Mes 6</td><td>2 % mensual</td><td class="num">$6.053.588,45</td></tr>
<tr><td>d</td><td>Mes 6</td><td>2 % y 2,5 % desde el segundo año</td><td class="num">$5.896.835,29</td></tr></table></div>
<p>Fíjate que la fecha focal cambia el valor de la respuesta, pero no la equivalencia: el valor en el mes 6 es el de hoy multiplicado por 1,02⁶.</p></section>
<section><h3>Caso 2 de clase</h3>
<p>Deuda hoy de $1.200.000 al 3 % mensual, con pagos de $400.000 (mes 2), $500.000 (mes 6), $100.000 (mes 10) y el resto en el mes 12. Ecuación de valor en el mes 12:</p>
<div class="mj">\[1.200.000(1{,}03)^{12}=400.000(1{,}03)^{10}+500.000(1{,}03)^{6}+100.000(1{,}03)^{2}+X\]</div>
<p>\(X=\$470.230{,}36\). Si se quiere cancelar todo hoy, el saldo equivalente es \(\$329.810{,}12\); en el mes 5, ese saldo por \(1{,}03^5\) menos lo pagado en el mes 2 llevado al mes 5.</p></section>
${XL([["Valor futuro de un pago único","\\(F=P(1+i)^n\\)","=VF(i;n;0;-P)"],["Valor presente","\\(P=F/(1+i)^n\\)","=VA(i;n;0;-F)"],["Varios flujos al presente (mensuales)","\\(\\sum F_t/(1+i)^t\\)","=VNA(i;B2:B25)"]])}
${LAB}`,
qs:[{q:"¿Cuánto hay que depositar hoy al 8 % trimestral para retirar $2.000.000 en 18 meses?",a:"18 meses son 6 trimestres: P = 2.000.000/1,08⁶ = $1.260.339,25, con =VA(8%;6;0;-2000000)."}]},

{id:"nyi", t:"Cálculo del tiempo y de la tasa", sim:"nyi", html:String.raw`
<section><h3>El tiempo: n</h3>
<p class="lead">Si se conocen \(P\), \(F\) e \(i\), el plazo sale de despejar el exponente con logaritmos:</p>
<div class="mj">\[n=\frac{\ln(F/P)}{\ln(1+i)}\]</div>
<p><b>Ejercicio 2 del parcial de práctica:</b> $180.000.000 al 1,8 % mensual se convierten en $276.197.140: \(n=\ln(1{,}53443)/\ln(1{,}018)=24\) meses. La rentabilidad total es 53,44 %.</p>
<p class="warn"><b>Ojo con las unidades:</b> \(n\) sale en la unidad de la tasa. Con una tasa trimestral, \(n\) está en trimestres.</p></section>
<section><h3>La tasa: i</h3>
<div class="mj">\[i=\left(\frac{F}{P}\right)^{1/n}-1\]</div>
<p><b>Ejemplo de clase:</b> ¿a qué tasa mensual se triplica un capital en dos años y medio? \(i=3^{1/30}-1=3{,}73\,\%\). Si hay varios flujos (inversión de $80.000, ingresos de $50.000 en el mes 5 y $65.000 en el 15), la tasa es la que hace cero la ecuación de valor: la TIR, 3,62 % mensual, sea cual sea la fecha focal.</p>
${XL([["Plazo","\\(n=\\ln(F/P)/\\ln(1+i)\\)","=NPER(i;0;-P;F) o =LN(F/P)/LN(1+i)"],["Tasa","\\(i=(F/P)^{1/n}-1\\)","=TASA(n;0;-P;F)"],["Tasa con varios flujos","\\(\\sum F_t/(1+i)^t=0\\)","=TIR(B2:B17)"],["Rentabilidad total","\\(F/P-1\\)","=B2/B1-1"]])}</section>
${LAB}`,
qs:[{q:"¿En cuánto tiempo $1.000.000 se convierte en $2.500.000 al 2,5 % mensual?",a:"n = ln(2,5)/ln(1,025) = 37,11 meses, con =NPER(2,5%;0;-1000000;2500000)."}]},

{id:"tasas", t:"Tasas de interés: nominal, periódica, efectiva, vencida y anticipada", sim:"tasas", html:String.raw`
<section><h3>Las definiciones</h3>
<div class="tbl"><table><tr><th>Tasa</th><th>Qué es</th><th>Ejemplo</th></tr>
<tr><td>Nominal (\(j\))</td><td>Tasa anual «de nombre», de referencia contractual. No considera la capitalización y siempre debe decir cada cuánto capitaliza.</td><td>30 % N.A.M.V.</td></tr>
<tr><td>Periódica (\(ip\))</td><td>La que se aplica en cada período de liquidación. Sale de dividir la nominal por \(m\).</td><td>2,5 % mensual</td></tr>
<tr><td>Efectiva (\(ie\))</td><td>El costo o rendimiento real con capitalización. Es la que exige la Superfinanciera para comparar.</td><td>34,49 % E.A.</td></tr>
<tr><td>Vencida (\(iv\))</td><td>Los intereses se pagan al final del período.</td><td>6 % trimestral vencido</td></tr>
<tr><td>Anticipada (\(ia\))</td><td>Los intereses se descuentan al inicio del período.</td><td>6 % trimestre anticipado</td></tr></table></div>
<p><b>Reglas de la nominal:</b> todas las nominales son anuales; deben indicar el período de capitalización; solo se pueden dividir por el número de capitalizaciones, y al dividirlas se obtiene la efectiva del período.</p></section>
<section><h3>Las fórmulas del profesor</h3>
<div class="mj">\[ip=\frac{j}{m}\qquad ip=(1+i)^{1/n}-1\qquad ie=(1+i)^n-1\qquad iv=\frac{ia}{1-ia}\qquad ia=\frac{iv}{1+iv}\]</div>
<p>donde \(n\) es el número de períodos que caben (por ejemplo, 3 meses en un trimestre, 12 en un año).</p></section>
<section><h3>El procedimiento para cambiar de periodicidad</h3>
<p>Ejemplo de clase: pasar de 36 % NASA (nominal anual semestre anticipado) a NAMA (nominal anual mes anticipado).</p>
<ol class="steps"><li>Dividir por las capitalizaciones: 36 % ÷ 2 = 18 % semestral anticipada.</li>
<li>Pasar a vencida, porque solo con vencidas se cambia de período: 18 %/(1 − 18 %) = 21,95 % semestral.</li>
<li>Pasar al nuevo período: \((1{,}2195)^{1/6}-1=3{,}36\,\%\) mensual.</li>
<li>Pasar a anticipada si se pide: 3,36 %/1,0336 = 3,25 % mensual anticipada.</li>
<li>Multiplicar por las capitalizaciones: 3,25 % × 12 = 39,04 % NAMA.</li></ol></section>
<section><h3>Por qué la anticipada es más cara</h3>
<p>Con una tasa anticipada el banco descuenta los intereses al principio: con un crédito de 100 al 6 % trimestre anticipado recibes 94 y debes 100. Pagas 6 por usar 94, es decir, 6/94 = 6,38 % vencido. Tienes menos dinero disponible por el mismo interés.</p>
${XL([["Efectiva anual desde nominal vencida","\\((1+j/m)^m-1\\)","=INT.EFECTIVO(j;m)"],["Nominal desde efectiva anual","\\(m[(1+ie)^{1/m}-1]\\)","=TASA.NOMINAL(ie;m)"],["Cambio de período","\\((1+i)^{n}-1\\)","=(1+B3)^(3)-1"],["Anticipada a vencida","\\(ia/(1-ia)\\)","=B3/(1-B3)"]])}
<p class="warn"><b>Ojo:</b> <code>INT.EFECTIVO</code> y <code>TASA.NOMINAL</code> solo sirven con tasas vencidas. Una anticipada primero se pasa a vencida.</p></section>
${LAB}`,
qs:[{q:"¿Qué efectiva anual equivale al 24 % N.A.T.A.?",a:"24 %/4 = 6 % trimestral anticipada → 6 %/0,94 = 6,3830 % trimestral vencida → (1,06383)⁴ − 1 = 28,08 % E.A."},
 {q:"Duplicar el capital en dos años y medio o el 8 % trimestral: ¿cuál rinde más?",a:"Duplicar en 10 trimestres equivale a 2^(1/10) − 1 = 7,18 % trimestral, menos que el 8 %: conviene la b."}]},

{id:"indexadas", t:"Tasas combinadas, indexadas, reales y devaluación", sim:"indexada", html:String.raw`
<section><h3>Tasas indexadas (DTF + puntos)</h3>
<p class="lead">Un crédito indexado se pacta como una tasa de referencia más unos puntos, ambos en la misma modalidad. Como la DTF se expresa N.A.T.A., «DTF + 3,5 puntos T.A.» significa sumar las dos nominales trimestre anticipado y luego convertir.</p>
<p><b>Ejercicio 5 del parcial de práctica:</b> DTF 10,05 % N.A.T.A. + 3,5 = 13,55 % N.A.T.A. → 3,3875 % trimestral anticipada → 3,5063 % trimestral vencida → <b>14,78 % E.A.</b> La tasa fija del 14,2 % N.A.M.V. equivale a 15,16 % E.A., así que el crédito indexado es más económico.</p>
<p class="warn"><b>Error común:</b> convertir la DTF a efectiva anual y sumarle los puntos después (da 14,21 %). Los puntos están en la misma modalidad nominal que la DTF; sumarlos a una efectiva mezcla tasas de distinta naturaleza.</p></section>
<section><h3>Tasas combinadas</h3>
<p>Cuando dos tasas actúan a la vez (interés e inflación, interés y devaluación), se componen; no se suman:</p>
<div class="mj">\[(1+i_c)=(1+i_1)(1+i_2)\]</div></section>
<section><h3>Tasa real</h3>
<div class="mj">\[i_r=\frac{1+i_c}{1+\pi}-1\]</div>
<p><b>Ejemplo de clase:</b> para ganar una rentabilidad real del 8 % con inflación del 18 %, hay que invertir a \((1{,}08)(1{,}18)-1=27{,}44\,\%\).</p></section>
<section><h3>Devaluación</h3>
<p>Un artículo fabricado en EE. UU. se vende en Colombia en $50.000 con un tipo de cambio de $2.000 (US$25). Con inflación en EE. UU. del 3 % y devaluación del peso del 18 %, en un año vale US$25,75 allá y \(25{,}75\times2.360=\$60.770\) acá: el precio en pesos sube \((1{,}03)(1{,}18)-1=21{,}54\,\%\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué no se puede convertir la DTF a efectiva y sumar los puntos?",a:"Porque los puntos se pactan en la misma modalidad que la DTF (nominal trimestre anticipado). Primero se suman las nominales y la tasa resultante se convierte a efectiva."}]},

// ======================= UNIDAD II =======================
{id:"anualidades", t:"Series uniformes: anualidades", sim:"anual", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Una anualidad es una serie de pagos iguales \(A\), a intervalos iguales y con la misma tasa. En vez de mover cada pago por separado, se usan los factores de la serie.</p></section>
<section><h3>Vencida (pagos al final de cada período)</h3>
<div class="mj">\[P=A\,\frac{1-(1+i)^{-n}}{i}\qquad F=A\,\frac{(1+i)^n-1}{i}\qquad A=P\,\frac{i}{1-(1+i)^{-n}}\]</div></section>
<section><h3>Anticipada, diferida y perpetua</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Cuándo se paga</th><th>Fórmula</th><th>Excel</th></tr>
<tr><td>Anticipada</td><td>Al inicio de cada período</td><td>\(P=A\frac{1-(1+i)^{-n}}{i}(1+i)\)</td><td><code>=VA(i;n;-A;0;1)</code></td></tr>
<tr><td>Diferida</td><td>Empieza después de \(k\) períodos de gracia</td><td>\(P=A\frac{1-(1+i)^{-n}}{i}(1+i)^{-k}\)</td><td><code>=VA(i;n;-A)/(1+i)^k</code></td></tr>
<tr><td>Perpetua</td><td>Para siempre</td><td>\(P=A/i\)</td><td><code>=A/i</code></td></tr></table></div>
<p class="warn"><b>Requisito:</b> la tasa debe tener la misma periodicidad que los pagos. Con cuotas mensuales y una tasa E.A., primero conviertes a efectiva mensual.</p></section>
${XL([["Cuota","\\(A=P\\,i/[1-(1+i)^{-n}]\\)","=PAGO(i;n;-P)"],["Valor presente de la serie","\\(P=A[1-(1+i)^{-n}]/i\\)","=VA(i;n;-A)"],["Valor futuro de la serie","\\(F=A[(1+i)^n-1]/i\\)","=VF(i;n;-A)"],["Número de cuotas","\\(n=-\\ln(1-Pi/A)/\\ln(1+i)\\)","=NPER(i;-A;P)"],["Tasa de la serie","—","=TASA(n;-A;P)"]])}
${LAB}`,
qs:[{q:"¿Qué cambia en Excel si los pagos son anticipados?",a:"Se agrega el argumento tipo = 1: =PAGO(i;n;-P;0;1), =VA(i;n;-A;0;1). Con tipo 0 (o vacío) los pagos son vencidos."}]},

{id:"amortizacion", t:"Sistemas de amortización: francés, alemán y americano", sim:"amort", html:String.raw`
<section><h3>La tabla de amortización</h3>
<p class="lead">Una tabla de amortización muestra, período por período, cómo se paga un crédito. En el parcial las columnas son siempre: Período, Saldo inicial, Cuota, Intereses, Abono a capital y Saldo final.</p>
<div class="mj">\[\text{Intereses}_k=\text{Saldo inicial}_k\cdot i\qquad \text{Abono}_k=\text{Cuota}_k-\text{Intereses}_k\qquad \text{Saldo final}_k=\text{Saldo inicial}_k-\text{Abono}_k\]</div></section>
<section><h3>Los tres sistemas</h3>
<div class="tbl"><table><tr><th>Sistema</th><th>Qué es constante</th><th>Cuota</th><th>Excel</th></tr>
<tr><td>Francés</td><td>La cuota</td><td>\(A=P\,i/[1-(1+i)^{-n}]\)</td><td><code>=PAGO($B$4;$B$5;-$B$3)</code>; intereses con <code>PAGOINT</code> y abono con <code>PAGO.PRINC</code></td></tr>
<tr><td>Alemán (abono constante)</td><td>El abono a capital</td><td>\(P/n+\text{Saldo}_k\cdot i\), decreciente</td><td><code>=$B$3/$B$5</code> para el abono</td></tr>
<tr><td>Americano</td><td>El saldo (se pagan solo intereses)</td><td>\(P\,i\) cada mes y \(P(1+i)\) en el último</td><td><code>=SI(A13=$B$5;B13;0)</code> para el abono</td></tr></table></div></section>
<section><h3>Comparación con el parcial de práctica</h3>
<p>Crédito de $60.000.000 a 6 meses al 2 % mensual:</p>
<div class="tbl"><table><tr><th>Sistema</th><th>Primera cuota</th><th>Total de intereses</th><th>Posición</th></tr>
<tr><td>Alemán</td><td class="num">$11.200.000,00</td><td class="num">$4.200.000,00</td><td>Más económico</td></tr>
<tr><td>Francés</td><td class="num">$10.711.548,74</td><td class="num">$4.269.292,44</td><td>Intermedio</td></tr>
<tr><td>Americano</td><td class="num">$1.200.000,00</td><td class="num">$7.200.000,00</td><td>Más costoso</td></tr></table></div>
<p>El alemán paga menos intereses porque devuelve capital más rápido al inicio; el americano, más, porque mantiene la deuda completa todo el plazo. A cambio, el americano alivia el flujo de caja mensual y concentra el riesgo en el último pago, y el alemán exige las cuotas más altas al principio.</p>
<p><b>Recomendación típica:</b> con flujo de caja ajustado al inicio, el francés (cuota fija y menor que la primera alemana) o el americano si el problema es solo de corto plazo; con un ingreso extraordinario al final del plazo, el americano.</p></section>
${LAB}`,
qs:[{q:"¿En cuánto supera la primera cuota alemana a la cuota francesa en el parcial de práctica?",a:"11.200.000 − 10.711.548,74 = $488.451,26."}]},

{id:"gradientes", t:"Series variables: gradientes aritméticos y geométricos", sim:"grad", html:String.raw`
<section><h3>Gradiente aritmético</h3>
<p class="lead">Cada flujo aumenta (o disminuye) una cantidad fija \(G\) de pesos: \(A_1, A_1+G, A_1+2G,\dots\)</p>
<div class="mj">\[P=A_1\frac{1-(1+i)^{-n}}{i}+\frac{G}{i}\left[\frac{1-(1+i)^{-n}}{i}-\frac{n}{(1+i)^n}\right]\]</div>
<p>Si es decreciente, \(G\) es negativo.</p></section>
<section><h3>Gradiente geométrico</h3>
<p>Cada flujo crece (o decrece) un porcentaje fijo \(g\): \(A_1, A_1(1+g), A_1(1+g)^2,\dots\)</p>
<div class="mj">\[P=A_1\frac{1-\left(\frac{1+g}{1+i}\right)^{n}}{i-g}\quad(i\ne g),\qquad P=\frac{nA_1}{1+i}\quad(i=g)\]</div></section>
<section><h3>En Excel</h3>
<p>Excel no tiene una función de gradientes. La forma que el profesor acepta como «fórmula visible» es armar la columna de flujos (la primera celda con \(A_1\) y las siguientes con <code>=B13+$B$5</code> o <code>=B13*(1+$B$5)</code>) y traerla a valor presente con <code>=VNA(i;B13:B24)</code>. Luego comprueba con la fórmula cerrada.</p></section>
${LAB}`,
qs:[{q:"¿Qué diferencia hay entre G y g?",a:"G es un aumento fijo en pesos (gradiente aritmético); g es un aumento porcentual (gradiente geométrico)."}]},

// ======================= UNIDAD III =======================
{id:"criterios", t:"Criterios de decisión: VPN, TIR, TIRM, RBC, CAUE y PRI", sim:"vpn", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Para decidir si se hace una inversión, sus flujos se comparan con la <b>tasa de oportunidad</b> (TIO): lo que el inversionista ganaría en su mejor alternativa.</p>
<div class="tbl"><table><tr><th>Criterio</th><th>Fórmula</th><th>Se acepta si</th><th>Excel</th></tr>
<tr><td>VPN</td><td>\(\sum F_t/(1+TIO)^t\)</td><td>VPN &gt; 0</td><td><code>=VNA(TIO;B3:B7)+B2</code></td></tr>
<tr><td>TIR</td><td>Tasa con VPN = 0</td><td>TIR &gt; TIO</td><td><code>=TIR(B2:B7)</code></td></tr>
<tr><td>TIRM</td><td>Reinvierte los flujos a una tasa dada</td><td>TIRM &gt; TIO</td><td><code>=TIRM(B2:B7;financ;reinv)</code></td></tr>
<tr><td>RBC</td><td>VP beneficios / VP costos</td><td>RBC &gt; 1</td><td>Dos <code>VNA</code> divididos</td></tr>
<tr><td>CAUE</td><td>VPN repartido en cuotas iguales</td><td>Para comparar alternativas de distinta vida</td><td><code>=PAGO(TIO;n;-VPN)</code></td></tr>
<tr><td>PRI</td><td>Período en que se recupera la inversión</td><td>Menor que el plazo exigido</td><td>Acumulado de flujos descontados</td></tr></table></div>
<p class="warn"><b>Ojo con VNA:</b> descuenta desde el período 1. La inversión del período 0 se suma aparte: <code>=VNA(TIO;B3:B7)+B2</code>.</p></section>
<section><h3>Concepto del parcial: equivalencia financiera</h3>
<p>Dos flujos son equivalentes cuando, llevados a la misma fecha con la misma tasa, tienen el mismo valor. Por eso no se pueden comparar $100.000.000 hoy y $108.000.000 en un año sin descontar: con TIO del 12 % E.A., \(108.000.000/1{,}12=\$96.428.571{,}43\), menos que $100.000.000. Conviene recibir el dinero hoy.</p></section>
${LAB}`,
qs:[{q:"¿Por qué la TIR y el VPN pueden no coincidir al comparar proyectos?",a:"Porque la TIR supone reinversión a la misma TIR y no considera el tamaño de la inversión. El VPN mide la riqueza generada en pesos a la TIO; ante conflicto, se prefiere el VPN (o la TIRM)."}]}
];

const BRANCHES=[
{g:"Preparar el parcial", from:"metodo", items:[
 {id:"errores", t:"Errores frecuentes (lecciones aprendidas en clase)", html:String.raw`
<section><h3>Lo que más cuesta puntos</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Error</th><th>Cómo evitarlo</th></tr>
<tr><td>Cálculo</td><td>Sumar tasas de diferentes períodos</td><td>Convierte todo a la misma periodicidad antes de operar</td></tr>
<tr><td>Cálculo</td><td>Aplicar la fórmula de interés simple donde va compuesto</td><td>Si los intereses se reinvierten, es compuesto</td></tr>
<tr><td>Procedimiento</td><td>No ver un cambio de tasa en el plazo</td><td>Marca en la línea de tiempo el mes en que cambia y mueve por tramos</td></tr>
<tr><td>Procedimiento</td><td>Calcular mal el número de períodos</td><td>n en la unidad de la tasa: 18 meses con tasa trimestral son 6 períodos</td></tr>
<tr><td>Confusión</td><td>Tasas anticipadas</td><td>Pásalas a vencidas antes de cambiar de período o usar INT.EFECTIVO</td></tr>
<tr><td>Confusión</td><td>Períodos fraccionados</td><td>Un exponente no entero es válido: 1,02^(4,5)</td></tr>
<tr><td>Interpretación</td><td>Confundir valor presente y futuro</td><td>Pregúntate en qué fecha está la respuesta que piden</td></tr>
<tr><td>Método</td><td>No dibujar la línea de tiempo</td><td>Siempre empieza por el flujo de caja gráfico</td></tr>
<tr><td>Práctico</td><td>No verificar si el resultado es razonable</td><td>Un valor futuro debe ser mayor que el presente; una efectiva anual mayor que la nominal</td></tr>
<tr><td>Excel</td><td>Pegar valores</td><td>Todo resultado debe salir de una fórmula enlazada</td></tr></table></div></section>
<section><h3>Los tres aspectos clave según la clase</h3>
<ol class="steps"><li><b>Período de capitalización y periodicidad:</b> distinguir nominal de efectiva y vencida de anticipada.</li><li><b>Fórmulas de conversión y principio de equivalencia:</b> dos flujos son equivalentes cuando tienen el mismo valor en una misma fecha con la misma tasa.</li><li><b>Contexto del problema:</b> condiciones, fechas focales y cambios de tasa.</li></ol></section>`},
 {id:"identificar", t:"Identificar variables y escoger la fórmula", html:String.raw`
<section><h3>Lee el enunciado buscando estas palabras</h3>
<div class="tbl"><table><tr><th>Si el enunciado dice…</th><th>Es</th><th>Usa</th></tr>
<tr><td>«deposita», «invierte», «presta hoy», «precio de contado»</td><td>\(P\)</td><td>—</td></tr>
<tr><td>«acumulado», «retira al final», «dentro de», «valor al final»</td><td>\(F\)</td><td>—</td></tr>
<tr><td>«¿cuánto tiempo?», «¿en cuántos meses?»</td><td>Incógnita \(n\)</td><td><code>NPER</code> o LN</td></tr>
<tr><td>«¿a qué tasa?», «rentabilidad»</td><td>Incógnita \(i\)</td><td><code>TASA</code> o <code>TIR</code></td></tr>
<tr><td>«cuotas iguales», «pagos mensuales fijos»</td><td>\(A\)</td><td><code>PAGO</code>, <code>VA</code>, <code>VF</code></td></tr>
<tr><td>«aumenta $X cada mes»</td><td>Gradiente aritmético \(G\)</td><td>Tabla + <code>VNA</code></td></tr>
<tr><td>«aumenta X % cada período»</td><td>Gradiente geométrico \(g\)</td><td>Tabla + <code>VNA</code></td></tr>
<tr><td>«N.A.M.V.», «nominal», «capitalizable»</td><td>Tasa nominal \(j\) con \(m\)</td><td>Dividir por \(m\)</td></tr>
<tr><td>«anticipada», «A», «descontado al inicio»</td><td>\(ia\)</td><td>\(iv=ia/(1-ia)\)</td></tr>
<tr><td>«E.A.», «efectiva»</td><td>\(ie\)</td><td>Cambio de período \((1+i)^{n}-1\)</td></tr>
<tr><td>«varios pagos en distintas fechas», «reemplazar por un solo pago»</td><td>Ecuación de valor</td><td>Fecha focal</td></tr></table></div></section>
<section><h3>Lista de chequeo antes de calcular</h3>
<ol class="steps"><li>¿La tasa y los períodos están en la misma unidad?</li><li>¿La tasa es vencida? Si es anticipada, conviértela.</li><li>¿Cambia la tasa durante el plazo?</li><li>¿En qué fecha está la respuesta que piden?</li><li>¿Los signos en Excel son opuestos para lo que entra y lo que sale?</li></ol></section>`},
 {id:"casos-clase", t:"Casos de clase resueltos", html:String.raw`
<section><h3>Comparación de alternativas</h3>
<ol class="steps">
<li><b>Triplicar en 2,5 años o 3,5 % mensual:</b> triplicar equivale a 3,73 % mensual, mayor que 3,5 %: conviene triplicar.</li>
<li><b>US$100 por tres años:</b> 4,7 % trimestral da 20,17 % E.A.; 1,55 % mensual da 20,27 % E.A.; 20 % anual. Conviene prestarlos al 1,55 % mensual.</li>
<li><b>29 % N.M. o 30,5 % N.S.:</b> 33,18 % E.A. frente a 32,83 % E.A. Conviene el 29 % nominal mensual.</li>
<li><b>Don Pepe:</b> 21 % N.A.M.A. da 23,60 % E.A.; 29,5 % N.M.V. da 33,83 % E.A.; 31 % N.T.V. da 34,79 % E.A. Conviene el 31 % capitalizable trimestralmente.</li></ol></section>
<section><h3>Conversión de tasas</h3>
<ol class="steps">
<li><b>30 % nominal con distintas capitalizaciones:</b> mensual 2,5 % (34,49 % E.A.), trimestral 7,5 % (33,55 % E.A.), semestral 15 % (32,25 % E.A.), anual 30 %.</li>
<li><b>38 % N.T.V. a N.M.A.:</b> 9,5 % trimestral → 3,0718 % mensual vencida → 2,9803 % mensual anticipada → 35,76 % N.M.A.</li>
<li><b>35 % N.M.A. a N.T.V. (caso 1):</b> 2,9167 % mensual anticipada → 3,0043 % mensual vencida → 9,2864 % trimestral → 37,15 % N.T.V.</li>
<li><b>Tiempo para duplicar al 32 % N.T.:</b> 8 % trimestral → n = ln 2/ln 1,08 = 9,01 trimestres.</li></ol></section>
<section><h3>Ecuaciones de valor</h3>
<ol class="steps">
<li><b>Dos deudas de $25.000 (mes 3) y $40.000 (mes 7) cambiadas por dos pagos iguales en los meses 5 y 12, al 36 % N.M.:</b> con 3 % mensual y fecha focal en 12, X = $35.423,66. Compruébalo en el laboratorio de pagos únicos.</li>
<li><b>Deuda de $3.500.000 con tres pagos iguales (meses 6, 10 y 20) y $1.000.000 en el mes 24, al 1,5 % mensual:</b> X = $1.111.874,58.</li>
<li><b>Proyecto de $80.000 con ingresos de $73.000 (mes 5) y $85.000 (mes 15):</b> TIR = 7,43 % mensual; con inflación anual del 6 % (0,4868 % mensual), rentabilidad real de 6,91 % mensual.</li></ol></section>`}]},
{g:"Tasas", from:"tasas", items:[
 {id:"tabla-tasas", t:"Tabla de equivalencias de una tasa", sim:"tasas", html:String.raw`
<section><h3>Para qué sirve</h3><p class="lead">Escribe una tasa en cualquier modalidad y el laboratorio muestra todas sus equivalentes, con el paso a paso para llegar a la que te pidan.</p></section>${WSBOX}`}]},
{g:"Amortización", from:"amortizacion", items:[
 {id:"excel-amort", t:"Cómo llenar la tabla en Excel arrastrando", html:String.raw`
<section><h3>Estructura</h3>
<p class="lead">Variables en B3 (P = 60.000.000), B4 (i = 2 %) y B5 (n = 6). La tabla empieza en la fila 12 con los títulos y la fila 13 es el período 1.</p>
<div class="tbl"><table><tr><th>Columna</th><th>Fila 13 (período 1)</th><th>Fila 14 (se arrastra hasta la 18)</th></tr>
<tr><td>A Período</td><td><code>1</code></td><td><code>=A13+1</code></td></tr>
<tr><td>B Saldo inicial</td><td><code>=$B$3</code></td><td><code>=F13</code></td></tr>
<tr><td>C Cuota (francés)</td><td><code>=PAGO($B$4;$B$5;-$B$3)</code></td><td>arrastrar</td></tr>
<tr><td>D Intereses</td><td><code>=PAGOINT($B$4;A13;$B$5;-$B$3)</code> o <code>=B13*$B$4</code></td><td>arrastrar</td></tr>
<tr><td>E Abono a capital</td><td><code>=PAGO.PRINC($B$4;A13;$B$5;-$B$3)</code> o <code>=C13-D13</code></td><td>arrastrar</td></tr>
<tr><td>F Saldo final</td><td><code>=B13-E13</code></td><td>arrastrar</td></tr></table></div>
<p><b>Alemán:</b> E13 <code>=$B$3/$B$5</code>, D13 <code>=B13*$B$4</code>, C13 <code>=D13+E13</code>. <b>Americano:</b> D13 <code>=B13*$B$4</code>, E13 <code>=SI(A13=$B$5;B13;0)</code>, C13 <code>=D13+E13</code>.</p>
<p><b>Totales:</b> <code>=SUMA(C13:C18)</code> y lo mismo para intereses y abonos. Comprueba que el saldo final del último período sea 0 y que la suma de abonos sea P.</p>
<p><b>Tabla resumen entre hojas:</b> <code>=EJ6!D19</code>, <code>=EJ7!D19</code>, <code>=EJ8!D19</code>, y para la posición <code>=SI(B2=MIN($B$2:$B$4);"Más económico";SI(B2=MAX($B$2:$B$4);"Más costoso";"Intermedio"))</code>.</p></section>`}]}
];

const WORKSHOPS=[
 {id:"parcial-practica",t:"Parcial 01 de práctica resuelto",anchor:"amortizacion",links:["vdt","nyi","tasas","indexadas","amortizacion","criterios"],sim:"amort",html:String.raw`
<section><h3>Ejercicio 1: tabla de capitalización (P = 250.000.000, i = 2,8 % E.M.)</h3>
<div class="tbl"><table><tr><th>Mes</th><th>Capital inicial</th><th>Tasa</th><th>Intereses</th><th>Capital final</th></tr>
<tr><td>1</td><td class="num">250.000.000,00</td><td>2,8 %</td><td class="num">7.000.000,00</td><td class="num">257.000.000,00</td></tr>
<tr><td>2</td><td class="num">257.000.000,00</td><td>2,8 %</td><td class="num">7.196.000,00</td><td class="num">264.196.000,00</td></tr>
<tr><td>3</td><td class="num">264.196.000,00</td><td>2,8 %</td><td class="num">7.397.488,00</td><td class="num">271.593.488,00</td></tr>
<tr><td>4</td><td class="num">271.593.488,00</td><td>2,8 %</td><td class="num">7.604.617,66</td><td class="num">279.198.105,66</td></tr>
<tr><td>5</td><td class="num">279.198.105,66</td><td>2,8 %</td><td class="num">7.817.546,96</td><td class="num">287.015.652,62</td></tr>
<tr><td>6</td><td class="num">287.015.652,62</td><td>2,8 %</td><td class="num">8.036.438,27</td><td class="num">295.052.090,90</td></tr>
<tr><td colspan="3"><b>Total</b></td><td class="num"><b>45.052.090,90</b></td><td></td></tr></table></div>
<p>b) F = <code>=VF(2,8%;6;0;-250000000)</code> = <b>$295.052.090,90</b>. c) Intereses = F − P = <b>$45.052.090,90</b>. Interpretación: el fondo hace crecer la inversión un 18,02 % en seis meses porque los intereses se reinvierten.</p></section>
<section><h3>Ejercicio 2: período de inversión</h3>
<p>a) <code>=NPER(1,8%;0;-180000000;276197140)</code> = <b>24 meses</b>. b) n = LN(276.197.140/180.000.000)/LN(1,018) = 0,428125/0,017840 = 24. c) Rentabilidad total = 276.197.140/180.000.000 − 1 = <b>53,44 %</b>.</p></section>
<section><h3>Ejercicio 3: 30 % N.A.M.V.</h3>
<p>a) ip = 30 %/12 = <b>2,5000 % E.M.</b> b) (1,025)³ − 1 = <b>7,6891 % E.T.</b> c) (1,025)⁶ − 1 = <b>15,9693 % E.S.</b> d) (1,025)¹² − 1 = <b>34,4889 % E.A.</b>, con <code>=INT.EFECTIVO(30%;12)</code>.</p></section>
<section><h3>Ejercicio 4: 24 % N.A.T.A.</h3>
<p>a) ia = 24 %/4 = <b>6,0000 % trimestral anticipada</b>. b) iv = 0,06/0,94 = <b>6,3830 % E.T.V.</b> c) (1,06383)² − 1 = <b>13,1734 % E.S.V.</b> d) (1,06383)⁴ − 1 = <b>28,0821 % E.A.</b> e) Con la anticipada los intereses se descuentan al inicio: se recibe menos dinero (94 de 100) y se pagan los mismos intereses, así que el costo sobre el dinero realmente usado es mayor.</p></section>
<section><h3>Ejercicio 5: DTF + 3,5 T.A. frente a 14,2 % N.A.M.V.</h3>
<p>a) 10,05 % + 3,5 % = <b>13,55 % N.A.T.A.</b>; trimestral anticipada 3,3875 %. b) iv = 3,5063 % → <b>14,7801 % E.A.</b> c) Fija: (1 + 0,142/12)¹² − 1 = <b>15,1616 % E.A.</b> El indexado es más económico. d) Porque los puntos se pactan en la misma modalidad nominal anticipada de la DTF; sumarlos a una efectiva mezcla tasas distintas y da 14,21 %, subestimando el costo.</p></section>
<section><h3>Ejercicios 6, 7 y 8: $60.000.000, 6 meses, 2 % E.M.</h3>
<p><b>Francés:</b> cuota <code>=PAGO(2%;6;-60000000)</code> = <b>$10.711.548,74</b>; intereses totales <b>$4.269.292,44</b>.</p>
<div class="tbl"><table><tr><th>Mes</th><th>Saldo inicial</th><th>Cuota</th><th>Intereses</th><th>Abono</th><th>Saldo final</th></tr>
<tr><td>1</td><td class="num">60.000.000,00</td><td class="num">10.711.548,74</td><td class="num">1.200.000,00</td><td class="num">9.511.548,74</td><td class="num">50.488.451,26</td></tr>
<tr><td>2</td><td class="num">50.488.451,26</td><td class="num">10.711.548,74</td><td class="num">1.009.769,03</td><td class="num">9.701.779,71</td><td class="num">40.786.671,54</td></tr>
<tr><td>3</td><td class="num">40.786.671,54</td><td class="num">10.711.548,74</td><td class="num">815.733,43</td><td class="num">9.895.815,31</td><td class="num">30.890.856,24</td></tr>
<tr><td>4</td><td class="num">30.890.856,24</td><td class="num">10.711.548,74</td><td class="num">617.817,12</td><td class="num">10.093.731,62</td><td class="num">20.797.124,62</td></tr>
<tr><td>5</td><td class="num">20.797.124,62</td><td class="num">10.711.548,74</td><td class="num">415.942,49</td><td class="num">10.295.606,25</td><td class="num">10.501.518,37</td></tr>
<tr><td>6</td><td class="num">10.501.518,37</td><td class="num">10.711.548,74</td><td class="num">210.030,37</td><td class="num">10.501.518,37</td><td class="num">0,00</td></tr></table></div>
<p><b>Alemán:</b> abono = 60.000.000/6 = <b>$10.000.000</b>; cuotas de 11.200.000 a 10.200.000; intereses totales <b>$4.200.000</b>; la primera cuota supera a la francesa en <b>$488.451,26</b>.</p>
<p><b>Americano:</b> interés mensual = <b>$1.200.000</b>; pago del mes 6 = <b>$61.200.000</b>; intereses totales <b>$7.200.000</b>.</p>
<p><b>Resumen:</b> alemán más económico (4.200.000), francés intermedio (4.269.292,44) y americano más costoso (7.200.000).</p></section>
<section><h3>Sección IV: conceptos</h3>
<p><b>Pregunta 1.</b> Equivalencia financiera: dos sumas en fechas distintas son equivalentes si, llevadas a la misma fecha con la tasa de oportunidad, valen lo mismo; el dinero tiene valor en el tiempo porque puede invertirse. VP de $108.000.000 en un año al 12 % E.A.: <code>=VA(12%;1;0;-108000000)</code> = <b>$96.428.571,43</b> &lt; $100.000.000: prefiere recibir el dinero hoy.</p>
<p><b>Pregunta 2.</b> Francés: cuota fija, intereses intermedios y flujo predecible. Alemán: cuotas altas al inicio que bajan, menor costo y menor riesgo porque reduce rápido la deuda. Americano: cuotas bajas (solo intereses) y un pago grande al final, mayor costo y riesgo de refinanciación. Con flujo ajustado al inicio, el francés (o el americano si el ajuste es temporal y se espera liquidez después); con un ingreso extraordinario al final, el americano.</p></section>
<section><h3>Laboratorio de amortización</h3>${WSBOX}</section>`,
  d:"El parcial de práctica completo: tabla de capitalización, NPER y LN, conversiones nominales y anticipadas, DTF + puntos, los tres sistemas de amortización con sus tablas y las preguntas conceptuales."},
 {id:"taller-tasas",t:"Casos de tasas y equivalencias",anchor:"tasas",links:["pagounico","nyi","tasas","indexadas"],sim:"eqv",html:String.raw`
<section><h3>Casos para resolver con el laboratorio</h3>
<ol class="steps">
<li><b>Fondo para la universidad:</b> 25 millones al 1 % mensual durante 5 años y al 5 % trimestral los siguientes 11 años. F = 25.000.000·1,01⁶⁰·1,05⁴⁴ = <b>$388.643.666,55</b> (60 meses y 44 trimestres).</li>
<li><b>Cuenta de ahorros:</b> $500.000 hoy, $200.000 (mes 6), $300.000 (mes 18) y $200.000 (mes 24), al 12 % semestral; retiro en el mes 36. Con semestres: 500.000·1,12⁶ + 200.000·1,12⁵ + 300.000·1,12³ + 200.000·1,12² = <b>$2.011.738,08</b>.</li>
<li><b>Máquina:</b> precio de contado de pagos de $60.000 (mes 6), $80.000 (mes 8) y $100.000 (mes 12), al 2,5 % mensual los primeros seis meses y 9 % trimestral después (2,9142 % mensual): <b>$189.448,08</b>. Mueve por tramos en el laboratorio.</li>
<li><b>Tres pagarés</b> de $1.000.000 (mes 4), $2.500.000 (mes 12) y $3.000.000 (mes 15) reemplazados por uno en el mes 10 al 2 % mensual: <b>$6.246.276,80</b>.</li></ol>
<p class="hint">Escribe los flujos en el laboratorio: positivos lo que se debe o se deposita, negativos lo que se paga o se retira, y escoge la fecha focal.</p></section>
<section><h3>Laboratorio de ecuación de valor</h3>${WSBOX}</section>`,
  d:"Casos de las diapositivas de clase con su respuesta para comprobar en el laboratorio: fondo con cambio de tasa, cuenta de ahorros, precio de contado y reemplazo de pagarés."}
];


// ===================== AJUSTE AL PROGRAMA 1501798 =====================
(function(){
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
ins("metodo",[
{id:"direccion", t:"La dirección financiera y la creación de valor", html:String.raw`
<section><h3>El objetivo financiero básico</h3><p class="lead">El objetivo financiero de la empresa es <b>maximizar el valor del patrimonio de los propietarios</b>, es decir, el valor presente de los flujos de caja que la empresa les entregará, ajustado por el riesgo. No es maximizar la utilidad contable: la utilidad ignora el momento en que llega el dinero, el riesgo y la inversión necesaria para generarla.</p>
<div class="tbl"><table><tr><th>Objetivo</th><th>Problema</th></tr><tr><td>Maximizar utilidades</td><td>No considera el valor del dinero en el tiempo ni el riesgo; se puede inflar con políticas contables</td></tr><tr><td>Maximizar ventas o participación</td><td>Puede destruir valor si se vende con márgenes que no cubren el costo de capital</td></tr><tr><td>Maximizar el valor de la empresa</td><td>Integra rentabilidad, riesgo y tiempo; es el criterio que justifica el VPN</td></tr></table></div></section>
<section><h3>Modelos de empresa y objetivos organizacionales</h3>
<p>El modelo <b>financiero o de los accionistas</b> pone el valor para los propietarios en el centro; el modelo de los <b>grupos de interés</b> (stakeholders) incluye trabajadores, clientes, proveedores, Estado y comunidad. En la práctica, el objetivo financiero se fija en armonía con los objetivos organizacionales (crecimiento, supervivencia, responsabilidad social): una empresa que maltrata a sus trabajadores o clientes difícilmente crea valor sostenido.</p></section>
<section><h3>La teoría de la agencia (Jensen y Meckling, 1976)</h3>
<p>Cuando la propiedad (principal: los accionistas) está separada del control (agente: la gerencia), el agente puede perseguir sus propios intereses: gastos suntuosos, crecimiento por prestigio, aversión excesiva al riesgo o, al revés, apuestas con el dinero de los acreedores. Los <b>costos de agencia</b> son los de supervisión, los de compromiso del agente y la pérdida residual. Conflictos típicos: accionistas frente a gerentes, accionistas frente a acreedores, mayoritarios frente a minoritarios.</p></section>
<section><h3>Gobierno corporativo</h3>
<p>Es el conjunto de reglas y prácticas que alinean los intereses: juntas directivas con miembros independientes, remuneración ligada al valor (acciones, bonos por desempeño), revelación de información, auditoría externa, protección de minoritarios. En Colombia el Código País de la Superintendencia Financiera recoge las mejores prácticas para los emisores de valores.</p></section>`,
qs:[{q:"¿Por qué maximizar la utilidad no es un buen objetivo financiero?",a:"Porque no considera cuándo llega el dinero ni su riesgo, y no descuenta el costo del capital invertido para obtenerla."},{q:"Un gerente con sueldo fijo rechaza un proyecto con VPN positivo pero riesgoso. ¿Qué problema es?",a:"Un problema de agencia: el gerente evita el riesgo porque no recibe parte de las ganancias pero sí puede perder el empleo si fracasa."}]}]);
ins("indexadas",[
{id:"continua", t:"Tasa compuesta continuamente y créditos en UVR", sim:"uvr", html:String.raw`
<section><h3>Capitalización continua</h3><p class="lead">Si una tasa nominal \(j\) se capitaliza \(m\) veces al año y \(m\to\infty\), la tasa efectiva anual tiende a \(e^{j}-1\).</p>
<div class="mj">\[i_{EA}=\left(1+\frac{j}{m}\right)^m-1\;\xrightarrow{m\to\infty}\;e^{j}-1\qquad F=P\,e^{jn}\qquad j=\ln(1+i_{EA})\]</div>
<p>Es la tasa que usan los modelos de valoración de opciones y las finanzas teóricas. En Excel: <code>=EXP(j)-1</code> y <code>=LN(1+i)</code>.</p></section>
<section><h3>La UVR</h3>
<p>La <b>Unidad de Valor Real</b> es una unidad de cuenta que se reajusta diariamente con la inflación (IPC) y la calcula el Banco de la República. Los créditos de vivienda en UVR fijan la deuda y la cuota en UVR; en pesos, la cuota y el saldo crecen con la inflación. La tasa total en pesos combina la tasa real en UVR con la inflación:</p>
<div class="mj">\[(1+i_{\text{pesos}})=(1+i_{\text{UVR}})(1+\pi)\]</div>
<p>Resultado típico: la cuota inicial en UVR es más baja que en pesos, pero el saldo en pesos puede crecer en los primeros años, porque la amortización real es menor que el reajuste por inflación.</p></section>
${LAB}`,
qs:[{q:"¿Qué tasa efectiva anual equivale a 12 % nominal compuesto continuamente?",a:"e^0,12 − 1 = 12,75 %."}]},
]);
ins("nyi",[
{id:"flujos", t:"Presupuesto de capital y flujos de caja", sim:"fcaja", html:String.raw`
<section><h3>El valor presente neto como principio básico</h3><p class="lead">Una decisión financiera crea valor si el valor presente de lo que recibe supera el de lo que entrega, descontado a la tasa que refleja el costo de oportunidad y el riesgo. Por eso todo proyecto se traduce primero en un <b>flujo de caja</b>.</p></section>
<section><h3>Los tres presupuestos de flujo de caja</h3>
<div class="tbl"><table><tr><th>Flujo</th><th>Qué incluye</th></tr>
<tr><td>De inversión</td><td>Compra de activos fijos, capital de trabajo inicial, valor de salvamento y recuperación del capital de trabajo al final</td></tr>
<tr><td>De operación</td><td>Ingresos − costos y gastos desembolsables − impuestos; la depreciación no es salida de caja, pero reduce impuestos (escudo fiscal)</td></tr>
<tr><td>De financiación</td><td>Desembolsos de préstamos, pagos de intereses (con su ahorro de impuestos) y abonos a capital</td></tr></table></div>
<p><b>Flujo del proyecto</b> = inversión + operación: mide si el proyecto es bueno en sí mismo y se descuenta con el costo de capital. <b>Flujo del inversionista</b> = proyecto + financiación: mide lo que recibe el dueño y se descuenta con su tasa de oportunidad.</p>
<div class="mj">\[FCO=(\text{Ingresos}-\text{Costos}-\text{Depreciación})(1-t)+\text{Depreciación}\]</div></section>
${LAB}`,
qs:[{q:"¿Por qué se suma la depreciación al flujo de operación?",a:"Porque no es una salida de efectivo; se resta solo para calcular los impuestos y luego se devuelve."}]}]);
ins("amortizacion",[]);
ins("criterios",[
{id:"analisis", t:"Análisis financiero: estado de fuentes y usos (EFAF) y estado de flujos de efectivo (EFE)", sim:"efaf", html:String.raw`
<section><h3>Estado de fuentes y aplicaciones de fondos (EFAF)</h3><p class="lead">Compara dos balances y clasifica cada variación: de dónde salieron los recursos (fuentes) y en qué se usaron (aplicaciones).</p>
<div class="tbl"><table><tr><th>Fuentes</th><th>Aplicaciones (usos)</th></tr><tr><td>Disminución de activos</td><td>Aumento de activos</td></tr><tr><td>Aumento de pasivos</td><td>Disminución de pasivos</td></tr><tr><td>Aumento del patrimonio (utilidades, aportes)</td><td>Disminución del patrimonio (pérdidas, dividendos)</td></tr></table></div>
<p>Siempre se cumple que el total de fuentes es igual al total de aplicaciones. Una regla de sana financiación: las inversiones de largo plazo (activos fijos) deben financiarse con fuentes de largo plazo (deuda de largo plazo o patrimonio).</p></section>
<section><h3>Estado de flujos de efectivo (EFE, NIC 7)</h3>
<p>Explica la variación del efectivo en tres actividades: <b>operación</b> (método indirecto: utilidad neta + depreciación ± variaciones del capital de trabajo), <b>inversión</b> (compra y venta de activos fijos) y <b>financiación</b> (préstamos, aportes, dividendos). Muestra si la operación genera la caja suficiente o si la empresa depende de endeudarse.</p></section>
${LAB}`,
qs:[{q:"La cartera (cuentas por cobrar) aumentó 50. ¿Es fuente o uso?",a:"Uso: es un aumento de activo, dinero que quedó en manos de los clientes."}]},
{id:"riesgo", t:"Rentabilidad y riesgo financiero", sim:"rr", html:String.raw`
<section><h3>Medidas de rentabilidad</h3><p class="lead">La rentabilidad relaciona un resultado con los recursos usados para obtenerlo.</p>
<div class="mj">\[\text{Rentabilidad económica (ROA)}=\frac{UAII}{\text{Activo}}\qquad\text{Rentabilidad financiera (ROE)}=\frac{\text{Utilidad neta}}{\text{Patrimonio}}\]</div>
<div class="mj">\[ROE=\big[ROA+(ROA-k_d)\tfrac{D}{P}\big](1-t)\]</div>
<p>Si el activo rinde más que el costo de la deuda (\(ROA>k_d\)), endeudarse aumenta la rentabilidad del patrimonio: <b>apalancamiento financiero favorable</b>. Si rinde menos, la deuda la destruye. Otras medidas: margen operativo y neto, rotación de activos (sistema DuPont: ROA = margen × rotación), EBITDA, EVA = UODI − costo de capital × activos.</p></section>
<section><h3>Medidas de riesgo</h3><ul><li><b>Riesgo económico u operativo:</b> variabilidad de la UAII ante cambios en las ventas; lo mide el grado de apalancamiento operativo GAO = %ΔUAII/%ΔVentas = margen de contribución/UAII. Depende de los costos fijos.</li>
<li><b>Riesgo financiero:</b> variabilidad adicional de la utilidad por acción causada por la deuda; GAF = %ΔUPA/%ΔUAII = UAII/(UAII − intereses).</li>
<li><b>Apalancamiento total:</b> GAT = GAO × GAF.</li>
<li><b>Dispersión de la rentabilidad:</b> desviación estándar y coeficiente de variación de los rendimientos esperados en distintos escenarios.</li></ul></section>
${LAB}`,
qs:[{q:"Con ROA = 15 %, costo de la deuda 10 %, D/P = 1 y t = 35 %, ¿cuánto es el ROE?",a:"[15 + (15 − 10)·1]·0,65 = 13 %."}]}]);
const P={metodo:"Antes de empezar",direccion:"Unidad I · Dirección financiera y creación de valor",vdt:"Unidades II y III · Tasas de interés, descuento y equivalencias",anualidades:"Unidad IV · Series, gradientes y amortización",criterios:"Unidad V · Criterios para la toma de decisiones",analisis:"Unidad VI · Análisis financiero",riesgo:"Unidad VII · Rentabilidad y riesgo financiero"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
})();
