// Macroeconomía 2 · contenido de la ruta (notación del curso, prof. Ramón Javier Mesa)
// =====================================================================
// CONTENIDO: Macroeconomía 2 (economía abierta), con la notación del curso del profesor Ramón Javier Mesa Callejas
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"bp", t:"Balanza de pagos", nuevo:true, sim:"bp", html:String.raw`
<section><h3>La idea</h3><p class="lead">La balanza de pagos (BdeP) agrupa las transacciones económicas entre residentes y no residentes. Se registra por <b>partida doble</b>: cada transacción va una vez como crédito y otra como débito, así que el total siempre está en equilibrio contable.</p></section>
<section><h3>Matriz de clasificación</h3><div class="tbl"><table><tr><th>Balanza de pagos</th><th>Crédito (+)</th><th>Débito (−)</th></tr>
<tr><td>Transacciones reales (cuenta corriente)</td><td>Exportaciones de bienes y servicios; ingresos recibidos; transferencias recibidas</td><td>Importaciones de bienes y servicios; ingresos pagados; transferencias enviadas</td></tr>
<tr><td>Transacciones financieras (cuenta de capital y financiera)</td><td>Disminución de activos financieros externos; aumento de pasivos externos</td><td>Aumento de activos financieros externos; disminución de pasivos externos</td></tr>
<tr><td>Transacciones compensatorias (reservas internacionales)</td><td>Disminución de reservas</td><td>Aumento de reservas</td></tr></table></div>
<p>La <b>cuenta corriente</b> tiene la balanza comercial (bienes), la de servicios (viajes, transporte, seguros…), el ingreso primario (intereses, dividendos, utilidades) y el ingreso secundario (remesas y otras transferencias). La <b>cuenta de capital</b> recoge transferencias de capital, como una condonación de deuda. La <b>cuenta financiera</b> recoge inversión directa, de cartera y otra inversión (préstamos, depósitos).</p></section>
<section><h3>La cuenta corriente vista desde la macroeconomía</h3>
<div class="mj">\[PNB=PIB+YNF+TNE=A+CC\quad\Rightarrow\quad CC=PNB-A=S-I\]</div>
<p>Con \(A=C+I+G\) el gasto de absorción. Un superávit en CC es capacidad de prestar al resto del mundo (acumulación de activos externos, \(CC=B-B_{-1}\)); un déficit es necesidad de financiamiento externo. Separando el sector público:</p>
<div class="mj">\[CC=(A_p-I_p)+(T-C_g-I_g)\quad\Rightarrow\quad\text{si }A_p=I_p:\ \ DEF=-CC\ \text{(déficits mellizos)}\]</div>
<p>Y con la restricción presupuestaria del gobierno, \(D-D_{-1}=(G+I_g-T)+rD_{-1}\): para que la deuda no crezca hace falta un superávit primario que cubra los intereses, \(T-(G+I_g)=rD_{-1}\).</p></section>
<section><h3>Determinantes de las exportaciones e importaciones</h3><p>Exportaciones: tipo de cambio real, ingreso del resto del mundo (\(Y^*\)), subsidios y otros factores de competitividad. Importaciones: tipo de cambio real, ingreso doméstico (\(Y\)) y aranceles. Un superávit (déficit) en CC es un exceso de oferta (demanda) de divisas que aumenta (disminuye) las reservas internacionales.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> pensar que «crédito» significa préstamo. En la BdeP, crédito es cualquier partida que trae un pago al país o reduce los activos externos o aumenta los pasivos externos; débito, lo contrario.</p>`,
qs:[{q:"¿Por qué una exportación pagada con un depósito en el exterior no cambia el saldo total de la BdeP?",a:"Porque se registra dos veces: crédito en la cuenta corriente (exportación) y débito en la cuenta financiera (aumento de activos externos). La suma de créditos y débitos es cero."},
 {q:"Si el ahorro privado es igual a la inversión privada y el Gobierno tiene un déficit de 3 % del PIB, ¿cuánto es la cuenta corriente?",a:"Un déficit de 3 % del PIB: CC = (Ap − Ip) + (T − G − Ig) = 0 − 3 %. Son los déficits mellizos."}]},

{id:"paridades", t:"Paridades y tipo de cambio real", nuevo:true, sim:"par", html:String.raw`
<section><h3>Paridad del poder de compra (PPC)</h3><p class="lead">Una canasta debe costar lo mismo en dos países cuando se expresa en la misma moneda.</p>
<div class="mj">\[TCN\cdot P^E_{us}=P_\$\quad\Rightarrow\quad TCN_{PPC}=\frac{P_\$}{P^E_{us}}\]</div>
<p><b>Versión absoluta:</b> \(TCN\cdot P^E=P\), con \(TCR=1\). <b>Versión relativa:</b> el TCR puede ser distinto de 1 y lo que se cumple es la relación entre variaciones:</p>
<div class="mj">\[\frac{E_t}{E_{t-1}}=\frac{1+\Pi}{1+\Pi^*}\qquad\qquad \frac{dTCN}{TCN}=\Pi-\Pi^*\]</div>
<p>Con inflaciones esperadas (metas): \(E^e_{t+1}=E_t\,\frac{1+\Pi^e}{1+\Pi^{e*}}\) y, despejando, \(E_t=E^e_{t+1}\,\frac{1+\Pi^{e*}}{1+\Pi^e}\).</p>
<p><b>Índice Big Mac:</b> \(\%\ \text{subvaluación}=\left[\dfrac{TCN_{PPC}}{TCN_{mercado}}-1\right]\times100\). Si es negativo, el peso está <b>subvaluado</b> (depreciado): las exportaciones colombianas son baratas en dólares. Si es positivo, está <b>sobrevaluado</b> (apreciado): se abaratan las importaciones.</p></section>
<section><h3>Tipo de cambio real</h3><div class="mj">\[TCR=\frac{E\,P^*}{P}\qquad\qquad \frac{\Delta TCR}{TCR}\approx\frac{\Delta E}{E}+\Pi^*-\Pi\]</div>
<p>Es el índice de competitividad-precio. Si sube (<b>devaluación real</b>), los bienes externos se encarecen frente a los nacionales: suben las exportaciones y bajan las importaciones. Si baja (<b>revaluación real</b>), ocurre lo contrario. Con varios socios: \(ITCR=\dfrac{\sum_j W_j\,IPX_j\,ITCA_j}{IPC}\).</p></section>
<section><h3>Paridad de intereses</h3>
<p><b>No cubierta (PNCI):</b> la rentabilidad interna en pesos debe igualar la externa en pesos.</p>
<div class="mj">\[(1+i)=(1+i^*)\frac{E^e_{t+1}}{E_t}\;\Rightarrow\;i\approx i^*+e^e\qquad\text{con riesgo país: } i=i^*+e^e+\mu\]</div>
<p>Despejando: \(E_t=E^e_{t+1}\,\frac{1+i^*}{1+i}\). Si \(i>i^*+e^e\) entran capitales: baja \(i\) o se aprecia el peso hasta recuperar la paridad. Con tipo de cambio fijo y creíble, todo el ajuste es en la tasa de interés.</p>
<p><b>Cubierta (PCI):</b> el inversionista asegura hoy el tipo de cambio futuro con un forward \(F_t\). Siempre se cumple por arbitraje:</p>
<div class="mj">\[1+i=(1+i^*)\frac{F_t}{E}\;\Rightarrow\;F_t=E\,\frac{1+i}{1+i^*}\]</div>
<p>Ejemplo de clase: US$1 = 2.000, \(i=7\%\), \(i^*=3\%\) → \(F=2.000\times1{,}07/1{,}03=2.078\).</p></section>
${LAB}
<p class="warn"><b>Error común:</b> confundir subvaluado con apreciado. Un peso subvaluado frente a la PPC necesita <b>más</b> pesos por dólar de los que indica la paridad: está depreciado y favorece a los exportadores.</p>`,
deep:[{k:"Determinantes",t:"El tipo de cambio según la PPC y la PNCI",html:String.raw`<p>Según la PPC: \(E_t=E_t[E^e_{t+1}(+);\ \Pi^{e*}(+);\ \Pi^e(-)]\). Según la PNCI: \(E_t=E_t[E^e_{t+1}(+);\ i^*(+);\ i(-)]\). Por ejemplo, un alza de la tasa de la FED (\(\Delta i^*\)) dado \(i\) estimula la salida de capitales y deprecia el peso; un alza de la tasa del Banco de la República lo aprecia.</p>`}],
qs:[{q:"Una Big Mac vale US$2,50 en EE. UU. y $15.000 en Colombia; el mercado está a $8.500. ¿Qué indica la PPC?",a:"TCN_PPC = 15.000/2,5 = 6.000. Desalineamiento = (6.000/8.500 − 1) × 100 = −29,4 %: el peso está subvaluado (depreciado) 29,4 %, lo que abarata las exportaciones colombianas en dólares y mejora la competitividad-precio."},
 {q:"Spot 3.980, i = 2 % trimestral en Colombia, i* = 0,5 % trimestral en EE. UU. ¿Cuál es el forward a 3 meses?",a:"F = 3.980 × 1,02/1,005 = 4.039,40 pesos por dólar."}]},

{id:"divisas", t:"Mercado de divisas y enfoque de activos", nuevo:true, html:String.raw`
<section><h3>Enfoque del equilibrio en el mercado de divisas</h3><p class="lead">El tipo de cambio es el precio de la divisa: lo determinan la oferta (X: exportaciones, IED, préstamos) y la demanda (Q: importaciones, inversión en el exterior, pago de deuda).</p>
<div class="mj">\[E_t=\text{paridades}[E^e_{t+1};\Pi^{e*};\Pi^e;E_{t-1};\Pi;i;i^*]\qquad E_t=\text{BdeP}[Y;Y^*;TCR]\]</div>
<p>A un tipo de cambio por encima del equilibrio hay <b>exceso de oferta de divisas (EOD)</b> y el precio baja (\(\Delta^-E\)); por debajo hay <b>exceso de demanda (EDD)</b> y sube (\(\Delta^+E\)).</p>
<div class="tbl"><table><tr><th>Choque</th><th>Mecanismo</th><th>Flexible</th><th>Fijo</th></tr>
<tr><td>\(\Delta^+Y\) (gasto interno)</td><td>\(\Delta Y\to\Delta Q\) → más demanda de US → EDD</td><td>\(\Delta^+E\)</td><td>BC vende US: \(\Delta^-RI\to\Delta^-M\)</td></tr>
<tr><td>\(\Delta^+i\)</td><td>\(\Delta RI\) dada RE → DR > 0 → entrada de capitales → EOD</td><td>\(\Delta^-E\)</td><td>BC compra US: \(\Delta^+RI\to\Delta^+M\)</td></tr>
<tr><td>\(\Delta^-Y^*\)</td><td>\(\Delta^-X\) → menos oferta de US → EDD</td><td>\(\Delta^+E\)</td><td>BC vende US</td></tr>
<tr><td>\(\Delta^+\) remesas</td><td>más oferta de US → EOD</td><td>\(\Delta^-E\)</td><td>BC compra US</td></tr></table></div>
<p>Cuando el BC compra divisas para que el tipo de cambio no baje, aumenta las reservas y la oferta monetaria (\(\Delta^+M\)); cuando vende, la contrae (\(\Delta^-M\)).</p></section>
<section><h3>Enfoque de activos (PNCI)</h3><p>Se mira solo el lado financiero: la rentabilidad interna \(RI=i\) es una recta vertical en el plano \((i,E)\) y la rentabilidad externa en pesos \(RE=i^*+(E^e_{t+1}-E_t)/E_t\) tiene pendiente negativa. El equilibrio es donde \(RI=RE\) (DR = 0).</p>
<ul><li>A un \(E_1\) mayor que el de equilibrio, \(RI>RE\): DR > 0, entran capitales, EOD y \(\Delta^-E\).</li><li>\(\Delta i^*\) desplaza RE a la derecha: en el E inicial DR ˂ 0, salen capitales (EDD) y el peso se deprecia.</li></ul>
<p>Con el mercado de dinero \((M/P=L(Y,i))\): un \(\Delta^+M\) → EOM → \(\Delta^-i\) (efecto liquidez) → \(\Delta^-RI\) dada la RE → DR ˂ 0 → salida de capitales → EDD → \(\Delta^+E\).</p></section>
<section><h3>Overshooting</h3><p>Tras una expansión monetaria, a corto plazo el tipo de cambio se deprecia de \(E_0\) a \(E_1\). A mediano plazo suben los precios, caen los saldos reales y sube \(i\): el peso se aprecia de \(E_1\) a \(E_2\). A largo plazo queda depreciado frente a \(E_0\), pero menos que en el corto plazo: \(\Delta^+E_{CP}>\Delta^+E_{LP}\).</p>
<div class="tbl"><table><tr><th>Ajuste</th><th>M</th><th>i</th><th>E</th><th>P</th></tr><tr><td>Corto plazo</td><td>∆+</td><td>∆-</td><td>∆+</td><td>0</td></tr><tr><td>Mediano plazo</td><td>0</td><td>∆+</td><td>∆-</td><td>∆+</td></tr><tr><td>Largo plazo</td><td>0</td><td>∆-/∆+</td><td>∆-/∆+</td><td>∆+</td></tr></table></div></section>
<section><h3>Regímenes cambiarios extremos</h3><p><b>Fijo (hard pegs):</b> el BC fija el precio de la divisa y lo defiende con reservas; la política monetaria se endogeniza a las intervenciones y la devaluación se vuelve un instrumento. <b>Flotante:</b> el mercado determina E; el objetivo es el equilibrio externo y el mercado de bienes se endogeniza a las variaciones del TCR.</p></section>`,
qs:[{q:"Si cae la tasa de interés local, ¿qué pasa en el mercado de divisas con tipo de cambio fijo?",a:"Baja la RI dada la RE: DR ˂ 0, salen capitales y hay EDD. Para que E no suba, el BC vende dólares (∆-RI), lo que contrae la oferta monetaria (∆-M) y tiende a devolver la tasa de interés a su nivel."}]},

{id:"krugman", t:"Modelo Krugman: equilibrio de activos y de bienes", nuevo:true, sim:"krug", html:String.raw`
<section><h3>La idea</h3><p class="lead">El modelo de Krugman y Obstfeld (AA-DD) determina la renta y el tipo de cambio \((Y,E)\) con precios fijos y movilidad perfecta del capital. La curva <b>EMA</b> (AA) es el equilibrio del mercado de activos y la <b>EMB</b> (DD) el del mercado de bienes.</p></section>
<section><h3>Curva EMA (pendiente negativa)</h3><p>Combina la PNCI y el mercado de dinero: \((1+i)=(1+i^*)E^e/E\) y \(M/P=L(i,Y)\). Un \(\Delta^+Y\) → \(\Delta L\) dado (M/P) → EDM → \(\Delta^+i\) → DR > 0 → entrada de capitales → EOD → \(\Delta^-E\).</p>
<div class="mj">\[\frac{\partial E}{\partial Y}=-\frac{L_Y}{L_i\,i_E}<0\]</div>
<p>Se desplaza arriba y a la derecha con \(\Delta i^*\), \(\Delta E^e_{t+1}\), \(\Delta M\) o \(\Delta^-P\). Por encima de la EMA hay EOD; por debajo, EDD.</p></section>
<section><h3>Curva EMB (pendiente positiva)</h3><p>\(Y=DA=(\hat A-bi)+\nu E+(\dot c-m)Y\). Un \(\Delta E\) dado P y P* → \(\Delta TCR\) → \(\Delta X/\Delta^-Q\) → \(\Delta XN\) → \(\Delta DA\) → \(\Delta Y\).</p>
<div class="mj">\[\frac{\partial E}{\partial Y}=\frac{1-A_Y-B_Y}{B_E}>0\]</div>
<p>Se desplaza a la derecha con política fiscal expansiva (\(\Delta G\), \(\Delta^-T\)), \(\Delta Y^*\) o \(\Delta TCR\). Por encima de la EMB hay EDB; a la derecha, EOB.</p></section>
<section><h3>Política económica</h3><div class="tbl"><table><tr><th></th><th>Monetaria expansiva</th><th>Fiscal expansiva</th></tr>
<tr><td>Flexible</td><td>EMA a la derecha: \(\Delta^+E\) con overshooting y \(\Delta^+Y\). Eficaz para crecer, ineficaz para la inflación.</td><td>EMB a la derecha: \(\Delta Y\) menor por la apreciación (\(\Delta^-E\)). Ineficaz para crecer, eficaz para la inflación.</td></tr>
<tr><td>Fijo</td><td>Presión a devaluar → el BC vende US (\(\Delta^-M\)): la EMA regresa y \(Y_1=Y_0\). Ineficaz.</td><td>Presión a apreciar → el BC compra US (\(\Delta^+M\)): la EMA acompaña y el \(\Delta Y\) es máximo. Eficaz.</td></tr></table></div>
<p>Con tipo de cambio fijo, \(E=\tilde E=\tilde E^e_{t+1}\) y la PNCI se reduce a \((1+i)=(1+i^*)\): la EMA se vuelve una recta que se mueve con las reservas.</p></section>
${LAB}`,
qs:[{q:"Con tipo de cambio flexible, ¿qué efecto tiene un aumento de la demanda de dinero en el modelo de Krugman?",a:"∆L dado (M/P) → EDM → ∆i → DR > 0 → entrada de capitales → EOD → ∆-E: la EMA se desplaza abajo y a la izquierda. La apreciación reduce las XN y la renta cae. Con tipo de cambio fijo, el BC compra dólares (∆M) y la EMA regresa: la renta no cambia."}]},

{id:"mundell", t:"Modelo Mundell-Fleming", nuevo:true, sim:"mf", html:String.raw`
<section><h3>La idea</h3><p class="lead">Extiende el IS-LM a la economía abierta: determina \((Y,i)\) con precios fijos a partir de tres mercados, con distintos grados de movilidad del capital y con tipo de cambio fijo o flexible.</p>
<div class="tbl"><table><tr><th>Mercado</th><th>Curva</th><th>Ecuación</th></tr>
<tr><td>Bienes</td><td>EMB (IS), pendiente negativa</td><td>\(Y=A(Y;i;\hat A)+XN(TCR;Y;Y^*)\)</td></tr>
<tr><td>Dinero</td><td>EMM (LM), pendiente positiva</td><td>\(M/P=L(Y;i)\), \(\ \partial i/\partial Y=-L_Y/L_i\)</td></tr>
<tr><td>Divisas</td><td>BP = 0, pendiente \(-B_Y/F_i\)</td><td>\(BP=B(TCR;Y;Y^*)+F(i;i^*;E^e_{t+1}/E_t)=0\)</td></tr></table></div>
<p>Hay tres equilibrios: <b>interno</b> (EMB = EMM), <b>externo</b> (BP = 0) y <b>macroeconómico</b> (EMB = EMM = BP).</p></section>
<section><h3>Movilidad del capital</h3><ul><li><b>Sin movilidad</b> (\(F_i=0\)): BP vertical; solo cuenta la balanza comercial.</li><li><b>Imperfecta:</b> BP con pendiente positiva. Caso I: más inclinada que la EMM (pesa más la renta); caso II: menos inclinada (pesa más la tasa de interés).</li><li><b>Perfecta</b> (\(F_i\to\infty\)): BP horizontal en \(i=i^*\); no depende de la balanza comercial.</li></ul></section>
<section><h3>Zonas de desequilibrio</h3><div class="tbl"><table><tr><th>Curva</th><th>Arriba / izquierda</th><th>Abajo / derecha</th></tr>
<tr><td>EMB</td><td>Arriba y a la derecha: EOB (Y > DA)</td><td>Abajo y a la izquierda: EDB</td></tr>
<tr><td>EMM</td><td>Arriba y a la izquierda: EOM</td><td>Abajo y a la derecha: EDM</td></tr>
<tr><td>BP = 0</td><td>Arriba y a la izquierda: superávit (EOD)</td><td>Abajo y a la derecha: déficit (EDD)</td></tr></table></div></section>
<section><h3>El proceso de ajuste</h3><ol class="steps"><li><b>Efecto impacto:</b> el choque mueve la EMB o la EMM y la economía llega a un nuevo equilibrio interno (punto 1).</li><li><b>Saldo de la BP en el punto 1:</b> \(\Delta Y\to\Delta Q\) mueve la balanza comercial y \(\Delta i\) mueve la cuenta financiera.</li><li><b>Tipo de cambio fijo:</b> el BC compra o vende reservas: la EMM se endogeniza (\(\Delta RI\to\Delta M\)).</li><li><b>Tipo de cambio flexible:</b> el EDD o EOD mueve E: se endogenizan la EMB y la BP vía TCR.</li></ol></section>
<section><h3>Resumen con movilidad perfecta</h3><div class="tbl"><table><tr><th></th><th>Monetaria expansiva</th><th>Fiscal expansiva</th></tr><tr><td>Fijo</td><td>Ineficaz: el BC vende reservas</td><td>Máximo efecto: el BC compra reservas</td></tr><tr><td>Flexible</td><td>Máximo efecto: la depreciación refuerza</td><td>Ineficaz: la apreciación desplaza las XN</td></tr></table></div></section>
${LAB}
<p class="warn"><b>Error común:</b> en tipo de cambio flexible, mover la EMM durante el ajuste. La oferta monetaria no cambia: lo que se mueve con el tipo de cambio son la EMB y la BP.</p>`,
qs:[{q:"Con movilidad imperfecta (BP menos inclinada que la EMM) y tipo de cambio fijo, ¿qué hace el BC si caen las exportaciones?",a:"Las exportaciones caen: la EMB y la BP se desplazan a la izquierda. En el nuevo equilibrio interno, la caída de i saca capitales y la BP queda en déficit (EDD). Para defender el tipo de cambio, el BC vende reservas internacionales (respuesta b). Compruébalo en el laboratorio."},
 {q:"¿Qué es un punto a la derecha de la BP en el modelo sin movilidad del capital?",a:"Un déficit en BP (exceso de demanda de divisas): la renta es mayor que la que equilibra la balanza comercial, y las importaciones superan a las exportaciones."}]},

{id:"da", t:"Demanda agregada en la economía abierta", nuevo:true, html:String.raw`
<section><h3>La idea</h3><p class="lead">La DA son las combinaciones \((P,Y)\) que equilibran los mercados de bienes y activos. En la economía abierta, una caída de precios actúa por dos vías.</p>
<div class="eq al chain">(i) ∆-P → ∆+(M/P) /dado L → EOM → ∆-i → ∆I → ∆A → ∆DA → ∆Y &nbsp; (se mueve la EMM)<br>(ii) ∆-P → ∆TCR → ∆X/∆-Q → ∆XN → ∆DA → ∆Y &nbsp; (se mueven la EMB y la BP)</div>
<div class="mj">\[\frac{\partial P}{\partial Y}=\frac{1-A_Y-B_Y}{A_i\,i_P+A_P+B_P}<0\]</div>
<p>Si la caída de precios deja un superávit en BP, con tipo de cambio fijo el BC compra US (\(\Delta M\)) y la DA se desplaza aún más; con flexible, el peso se aprecia y parte del efecto se revierte.</p></section>
<section><h3>Choques que desplazan la DA</h3><div class="tbl"><table><tr><th>Choque</th><th>Tipo de cambio fijo</th><th>Tipo de cambio flexible</th></tr>
<tr><td>Aumento exógeno de las exportaciones (X*)</td><td>DA a la derecha</td><td>Ningún efecto</td></tr>
<tr><td>Alza de la tasa de interés mundial</td><td>DA a la izquierda</td><td>DA a la derecha</td></tr>
<tr><td>Aumento exógeno de las importaciones (Q*)</td><td>DA a la izquierda</td><td>Ningún efecto</td></tr>
<tr><td>Política monetaria expansiva</td><td>Ningún efecto</td><td>DA a la derecha</td></tr>
<tr><td>Política fiscal expansiva</td><td>DA a la derecha</td><td>Poco efecto (depende de la movilidad)</td></tr>
<tr><td>Mayor entrada de capitales de corto plazo</td><td>DA a la derecha</td><td>DA a la izquierda</td></tr></table></div>
<p>Cualquier choque del comercio exterior o de la cuenta corriente afecta la DA con tipo de cambio fijo, pero no con flexible (Appleyard y Field, 2014).</p></section>`,
qs:[{q:"¿Por qué un alza de i* desplaza la DA a la derecha con tipo de cambio flexible?",a:"El alza de i* genera salida de capitales y déficit en BP; el peso se deprecia, sube el TCR y con él las XN y la DA."}]},

{id:"sa", t:"Oferta agregada: clásicos y keynesianos", nuevo:true, html:String.raw`
<section><h3>Mercado de trabajo y SA</h3><p class="lead">La producción depende del empleo, \(Y=f(N;K)\). La demanda de trabajo es \(W=P\cdot F_N(N;K)\) (el salario como costo) y la oferta \(W=P\cdot G(N;T)\) (el salario como ingreso). La forma de la SA depende de cómo se determinan los salarios.</p></section>
<section><h3>Los cuatro modelos</h3><div class="tbl"><table><tr><th>Modelo</th><th>Supuestos</th><th>SA</th></tr>
<tr><td>Clásico tradicional</td><td>Información completa y perfecta, pleno empleo, precios y salarios flexibles</td><td>Vertical en \(\bar Y\): \(\partial N/\partial P=0\). Un \(\Delta P\) sube W en la misma proporción y W/P no cambia</td></tr>
<tr><td>Nueva macroeconomía clásica</td><td>Asimetrías de información: los trabajadores ofrecen trabajo según el salario real esperado \(W/P^E\); expectativas (Friedman, Lucas)</td><td>Positiva mientras \(P^E\) no se ajuste (\(h'(P)<1\)); vertical cuando \(P^E=P\)</td></tr>
<tr><td>Keynesiana tradicional</td><td>Precios y salarios fijos, capacidad ociosa; la DA determina Y</td><td>Horizontal en \(\dot P\)</td></tr>
<tr><td>Nueva macroeconomía keynesiana</td><td>Precios y salarios rígidos, salario mínimo \(\ddot W\), exceso de oferta de trabajo; la demanda de trabajo determina el empleo</td><td>Positiva: \(\Delta P\) dado \(\ddot W\) → \(\Delta^-(\ddot W/P)\) → \(\Delta N\) → \(\Delta Y\)</td></tr></table></div>
<div class="mj">\[\text{NMC: }\frac{\partial N}{\partial P}=\frac{F_N-G\,h'(P)}{h(P)G_N-PF_{NN}}\qquad\text{NMK: }\frac{\partial P}{\partial Y}=\frac{P\,F_{NN}}{-F_N^2}>0\]</div></section>
<section><h3>Política fiscal de oferta</h3><p>Los impuestos a la nómina (\(C_{ssp}\)) encarecen el trabajo: \(W(1+C_{ssp})=P\,F_N\). Las contribuciones y la retención de los trabajadores reducen el salario neto: \(W(1-C_{sst}-rf)=P\,G\). Reducirlos aumenta el empleo y desplaza la SA a la derecha.</p></section>`,
qs:[{q:"¿Por qué en el modelo clásico tradicional un aumento de precios no cambia el empleo?",a:"Con información completa, ∆P reduce el salario real como costo (sube la demanda de trabajo) y como ingreso (baja la oferta). El efecto neto es solo un ∆W en la misma proporción que P: W/P y N no cambian."}]},

{id:"sada", t:"Modelo SA-DA de los cuatro planos", nuevo:true, sim:"sada", html:String.raw`
<section><h3>La idea</h3><p class="lead">El modelo completo determina \(Y,i,P,W,W/P\) y \(N\) en cuatro planos: bienes y activos \((Y,i)\), trabajo nominal \((N,W)\), oferta y demanda agregada \((Y,P)\) y trabajo real \((N,W/P)\). La dinámica se lee en etapas: impacto, corto, mediano y largo plazo.</p></section>
<section><h3>Expansión monetaria</h3><div class="tbl"><table><tr><th>Modelo</th><th>Resultado</th></tr>
<tr><td>Clásico tradicional</td><td>Impacto: \(\Delta^+Y\), \(\Delta^-i\). Mediano plazo: \(\Delta^+P\) devuelve Y a \(\bar Y\). Largo plazo: \(\Delta^+W\). El dinero es neutral.</td></tr>
<tr><td>Nueva macroeconomía clásica</td><td>Con \(P^E\) dado, \(\Delta^+P\) baja W/P como costo: \(\Delta^+N\), \(\Delta^+Y\) transitorios. Cuando se corrigen las expectativas, vuelve a \(\bar Y\) con más precios.</td></tr>
<tr><td>Keynesiana tradicional</td><td>\(\Delta^+Y\) y \(\Delta^+N\) con precios fijos.</td></tr>
<tr><td>Nueva macroeconomía keynesiana</td><td>\(\Delta^+P\) con \(\ddot W\) fijo: \(\Delta^-(\ddot W/P)\) → \(\Delta^+N\) → \(\Delta^+Y\). El efecto real persiste.</td></tr></table></div></section>
<section><h3>Choque petrolero (insumo importado) con tipo de cambio flexible</h3><p>(i) \(\Delta^+P_{IQ}\) → \(\Delta^+Q\) en valor → \(\Delta^-XN\) → déficit en BP → EDD → \(\Delta^+E\) → \(\Delta^+TCR\) → \(\Delta^+DA\). (ii) \(\Delta^+P_{IQ}\) eleva los costos de producción: la SA de corto y de largo plazo se desplazan a la izquierda. El resultado es <b>estanflación</b>: inflación con recesión.</p></section>
${LAB}`,
qs:[{q:"¿Qué efecto tiene una caída del consumo nacional en la nueva macroeconomía keynesiana?",a:"∆-C → ∆-DA: la DA se desplaza a la izquierda, bajan los precios y, con el salario mínimo fijo, sube el salario real como costo (∆+W̄/P). Cae la demanda de trabajo, el empleo y la producción. Como hay rigidez salarial, el efecto persiste."},
 {q:"¿Y una política monetaria expansiva en la nueva macroeconomía clásica?",a:"Impacto: ∆M → EOM → ∆-i → ∆DA → ∆Y. Corto plazo: suben los precios y, con Pᵉ dado, cae el salario real como costo; las empresas contratan más (∆N, ∆Y). Largo plazo: los trabajadores corrigen expectativas y exigen ∆W; la economía vuelve a Ȳ con precios más altos."}]},

{id:"ajuste", t:"Equilibrio interno y externo: políticas de ajuste", nuevo:true, sim:"regiones", html:String.raw`
<section><h3>Dos objetivos y dos instrumentos</h3><p class="lead">El <b>equilibrio interno</b> es el pleno empleo \((Y=\bar Y)\); el <b>externo</b>, BP = 0. En el modelo SA-DA sin capitales y con tipo de cambio fijo, la BP=0 tiene pendiente negativa en \((Y,P)\): \(\partial P/\partial Y=-B_Y/B_P<0\).</p>
<ul><li><b>Instrumento para el equilibrio interno:</b> ampliación o reducción del gasto interno (A), con política monetaria o fiscal.</li><li><b>Instrumento para el equilibrio externo:</b> desviación del gasto, con la política cambiaria (devaluación o revaluación) y, en menor medida, la arancelaria.</li></ul></section>
<section><h3>Regiones y dilemas</h3><div class="tbl"><table><tr><th>Región</th><th>Situación</th><th>Política de gasto</th><th>¿Logra el EPE?</th></tr>
<tr><td>E1</td><td>Desempleo y déficit en BP</td><td>∆+A agrava el déficit</td><td>No: dilema</td></tr>
<tr><td>E2</td><td>Desempleo y superávit</td><td>∆+A</td><td>Sí</td></tr>
<tr><td>E3</td><td>Sobreempleo y déficit</td><td>∆-A</td><td>Sí</td></tr>
<tr><td>E4</td><td>Sobreempleo y superávit</td><td>∆-A agrava el superávit</td><td>No: dilema</td></tr></table></div>
<p>En E1 y E4 hay dos objetivos y un solo instrumento. Hace falta combinar la política de gasto con la cambiaria: en E1, devaluar y controlar el gasto; en E4, reducir el gasto y revaluar.</p></section>
<section><h3>Ajuste en E1 (desempleo con déficit)</h3><p><b>1. Mecanismo automático clásico:</b> el BC defiende el tipo de cambio vendiendo divisas: \(\Delta^-RI\to\Delta^-M\to\) EDM → \(\Delta^+i\to\Delta^-DA\to\Delta^-Y\) (más recesión). A mediano plazo bajan el empleo, los salarios y los precios; a largo plazo la \(\Delta^-P\) mejora la competitividad (\(\Delta^+TCR\)) y se llega al EPE.</p>
<p><b>2. Política de choque:</b> el BC decreta una devaluación (\(\Delta^+E\)) acompañada de reducción del gasto para que \(\Delta^+E>\Delta^+P\): \(\Delta^+TCR\to\Delta^+XN\), que elimina el déficit y, vía \(\Delta^+DA\), el desempleo.</p>
<p>La devaluación es inflacionaria (costos de importación, canasta familiar, deuda externa). Por eso solo es eficaz si va acompañada del control del gasto.</p></section>
${LAB}`,
qs:[{q:"Sobreempleo con superávit en BP, tipo de cambio fijo y sin capitales: ¿qué política se debe aplicar?",a:"Es la región E4, un dilema: reducir el gasto corrige el sobreempleo pero agranda el superávit. Se debe usar una política fiscal (contractiva) junto con una política cambiaria (revaluación). Respuesta b."}]},

{id:"esteril", t:"Intervención cambiaria y esterilización", nuevo:true, sim:"ip", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando el BC compra divisas (\(\Delta^+RI\)) aumenta la base y la oferta monetaria. <b>Esterilizar</b> es neutralizar ese efecto monetario con la operación contraria: \(\Delta^-CP\) (crédito primario) o \(\Delta^+PNM\) (pasivos no monetarios).</p>
<div class="mj">\[M=E\,R^*+DC\qquad\text{(ecuación contable del BC)}\]</div>
<p>Con esterilización la oferta monetaria no depende de la tasa de interés; sin ella, se endogeniza (entradas de capital → más dinero). Los límites: pérdidas cuasifiscales y riesgo soberano para las entradas, y agotamiento de reservas para las salidas.</p></section>
<section><h3>Modelo (i, P) con tipo de cambio fijo</h3><p>Con \(Y=\bar Y\), la <b>EMB</b> tiene pendiente negativa en \((P,i)\): \(\Delta^+i\to\Delta^-I\to\) EOB, que se corrige con \(\Delta^-P\) (\(\Delta^+TCR\)). La <b>EMF</b> tiene pendiente positiva: \(\Delta^+P\to\Delta^-(M/P)\to\) EDM → \(\Delta^+i\). Sin esterilización, la entrada de capitales que genera el alza de i obliga a comprar dólares y aumenta M: la <b>EMFᴺ es más plana</b> que la EMFˢ.</p></section>
<section><h3>Choques</h3><div class="tbl"><table><tr><th>Choque</th><th>Con esterilización</th><th>Sin esterilización</th></tr>
<tr><td>Fiscal expansiva (∆G)</td><td>Sube más i, sube menos P (ajusta la inversión)</td><td>Sube más P (ajusta la producción de transables vía TCR)</td></tr>
<tr><td>Monetaria expansiva (∆M)</td><td>Cae más i, sube más P</td><td>La venta de reservas contrarresta parte del ∆M</td></tr>
<tr><td>Aumento de impuestos (∆T)</td><td>Cae más i, cae menos P</td><td>Cae más P, cae menos i</td></tr></table></div></section>
${LAB}`,
deep:[{k:"Trilema",t:"La trinidad imposible",html:String.raw`<p>Un país no puede tener a la vez tipo de cambio fijo, autonomía monetaria y libre movilidad del capital: solo dos de los tres. Con tipo de cambio fijo y capitales libres, la política monetaria se dedica a defender el tipo de cambio. Con capitales libres y autonomía monetaria, la moneda debe flotar. Con tipo de cambio fijo y autonomía monetaria, hace falta controlar los flujos de capital.</p>`}],
qs:[{q:"Una reforma tributaria sube los impuestos. ¿Qué pasa en el modelo i-P con y sin esterilización?",a:"∆T → ∆-DA → ∆-P → ∆(M/P) → EOM → ∆-i → salida de capitales → el BC vende dólares (∆-M). Con esterilización, el BC compensa con más crédito primario y M no cambia: la tasa de interés cae más y los precios caen menos. Sin esterilización, M cae: los precios caen más y la tasa de interés cae menos."}]},

{id:"tcr", t:"Determinantes del TCR: transables y no transables", nuevo:true, sim:"tn", html:String.raw`
<section><h3>La idea</h3><p class="lead">El tipo de cambio real de equilibrio (TCRE) es el que logra al tiempo el pleno empleo y el equilibrio externo. Se mide como el precio relativo de los transables frente a los no transables: \(TCR=P_T/P_N\).</p></section>
<section><h3>Oferta, demanda y curvas</h3><p>Un \(\Delta(P_T/P_N)\) aumenta la producción de transables y reduce la de no transables, y desplaza la demanda hacia los no transables. Con \(Z\) el gasto interno:</p>
<ul><li><b>TT</b> (equilibrio externo, \(Y_T=D_T\)): pendiente positiva, porque más gasto exige un TCR más alto para no tener déficit. Debajo de la TT hay déficit comercial (EDT); encima, superávit (EOT).</li><li><b>NN</b> (equilibrio interno, \(Y_N=D_N\)): pendiente negativa. Encima hay sobreempleo (EDN); debajo, desempleo (EON).</li></ul>
<div class="mj">\[[Y^*-D^*]=(Y_N-D_N)+TCR\,(Y_T-D_T)\]</div></section>
<section><h3>Determinantes</h3><p>Factores reales: gasto público, flujos de capital, productividad relativa entre transables y no transables, choques de ingreso permanente (boom petrolero), términos de intercambio y remesas. La devaluación nominal sin control del gasto solo desvía el TCR de su equilibrio de forma transitoria.</p>
<p><b>Políticas:</b> con un TCR por debajo del de equilibrio y déficit, devaluar lleva al equilibrio externo pero con sobreempleo; reducir el gasto lo lleva con desempleo. Para llegar al TCRE se combinan la devaluación y la reducción del gasto.</p></section>
${LAB}`,
qs:[{q:"¿Qué efecto tiene una disminución de las remesas en el modelo de transables y no transables?",a:"Entran menos divisas y cae el ingreso disponible: el gasto interno baja (∆-Z) y la TT se desplaza a la izquierda. La menor demanda de no transables baja PN: el TCR de equilibrio sube (devaluación real). Mientras PN no se ajusta, hay desempleo en el sector no transable."}]},

{id:"real", t:"Enfoque real: ahorro, inversión y cuenta corriente", nuevo:true, sim:"def", html:String.raw`
<section><h3>La idea</h3><p class="lead">La cuenta corriente es la diferencia entre el ahorro y la inversión: \(CC=A-I\). Su comportamiento depende de si el país es pequeño o grande y de si hay libre movilidad del capital o controles.</p>
<ul><li><b>País pequeño con libre movilidad:</b> \(i=i^*\); un \(\Delta I\) dado el ahorro produce déficit en CC.</li><li><b>País pequeño con control de capitales:</b> el \(\Delta I\) sube la tasa de interés interna hasta que \(A=I\); la CC no cambia.</li><li><b>País grande:</b> cambian a la vez la CC y la tasa de interés mundial.</li></ul></section>
<section><h3>Choques transitorios y permanentes</h3><p>Según la hipótesis del ciclo de vida, un choque transitorio al ingreso cambia el ahorro (y la CC); uno permanente ajusta el consumo y no cambia la CC. Un alza transitoria del gasto público financiada con impuestos reduce el ahorro privado y produce déficit en CC en un país pequeño abierto; si es permanente, no cambia la CC.</p></section>
<section><h3>Financiamiento del déficit fiscal</h3><div class="mj">\[D-D_{-1}=(G+I_g-T)+rD_{-1}=(BM-BM_{-1})-E(RI-RI_{-1})+(DSF-DSF_{-1})\]</div>
<p><b>Tipo de cambio fijo:</b> la emisión baja i, presiona la devaluación y el BC vende divisas: \(PDEF=-E\,\Delta RI\). El déficit se paga con reservas. <b>Tipo de cambio flexible:</b> sin reservas ni crédito, se financia con emisión y la inflación actúa como impuesto:</p>
<div class="mj">\[DEF=\frac{\rho}{1+\rho}\,\frac{M}{P}\]</div>
<p>Mecanismo: \(\Delta DEF\to\Delta M\to\Delta^-i\to\Delta E\to\Delta P\).</p></section>
${LAB}`,
qs:[{q:"¿Cómo se financia en definitiva un déficit fiscal con tipo de cambio fijo y con tipo de cambio flexible?",a:"Con tipo de cambio fijo, con pérdida de reservas internacionales (PDEF = −E·∆RI). Con flexible, con el impuesto inflacionario sobre los saldos reales."}]}
];

const BRANCHES=[
{g:"Balanza de pagos", from:"bp", items:[
 {id:"reservas", t:"Reservas internacionales", html:String.raw`
<section><h3>Qué son y para qué sirven</h3><p class="lead">Las reservas internacionales (RIN) son activos en moneda extranjera en poder del Banco de la República: divisas, oro, depósitos en el exterior y DEG. Su principal fuente de variación son la cuenta corriente y la financiera.</p>
<ul><li>Garantizan que el país puede honrar sus obligaciones y reducen el costo del financiamiento externo.</li><li>Amortiguan choques externos: sin reservas, el ajuste ante un choque negativo sería más fuerte.</li><li>Con tipo de cambio fijo, un choque externo negativo exige generar superávit en BP (contracción del gasto); con flexible, buena parte del ajuste lo hace la devaluación.</li></ul></section>
<section><h3>Indicadores de vulnerabilidad externa</h3><p>Deben ser iguales o mayores que 1: RIN / amortizaciones del año; RIN / servicio de la deuda externa; RIN / (amortizaciones + déficit en CC). La métrica ARA del FMI considera adecuado un nivel entre 1,0 y 1,5 veces la métrica, y se complementa con reservas / dinero amplio, reservas / deuda de corto plazo y reservas / (importaciones / 12).</p></section>`}]},
{g:"Paridades", from:"paridades", items:[
 {id:"itcr", t:"ITCR con varios países", sim:"itcr", html:String.raw`
<section><h3>Metodología</h3><p class="lead">El índice de la tasa de cambio real pondera los socios comerciales:</p>
<div class="mj">\[ITCR=\frac{\sum_j W_j\cdot IPX_j\cdot ITCA_j}{IPC}\]</div>
<p>\(IPX_j\): índice de precios de cada socio; \(IPC\): índice de precios de Colombia; \(W_j\): participación de cada país en el comercio, normalizada; \(ITCA_j\): índice del peso frente al dólar ajustado con el índice de la moneda de cada país frente al dólar.</p></section>
<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`}]},
{g:"Mundell-Fleming", from:"mundell", items:[
 {id:"zonas", t:"Zonas de desequilibrio", sim:"mfz", html:String.raw`
<section><h3>Cómo identificarlas</h3><p class="lead">Para saber qué pasa en un punto fuera de una curva, se usa la ecuación de esa curva y se mueve una sola variable.</p>
<ul><li><b>EMB:</b> \(Y=C+I+G+XN\). Si desde un punto de la curva sube i con Y dado, cae la inversión: \(DA<Y\), exceso de oferta de bienes (EOB). Arriba y a la derecha de la EMB hay EOB.</li><li><b>EMM:</b> \(M/P=L(i,Y)\). Si sube i con Y dado, cae la demanda de dinero: exceso de oferta monetaria (EOM). Arriba y a la izquierda de la EMM hay EOM.</li><li><b>BP:</b> \(B(TCR,Y^*,Y)+F(i,i^*,E^e/E)\). Si sube i, entran capitales: superávit (EOD). Si sube Y, suben las importaciones: déficit (EDD). Arriba y a la izquierda de la BP hay superávit; abajo y a la derecha, déficit. Sin movilidad, a la derecha de la BP vertical hay déficit.</li></ul></section>
<section><h3>Laboratorio</h3><p>Activa «Explorar zonas con un clic» y toca el gráfico.</p><div class="sim" id="sim"></div></section>`}]},
{g:"SA-DA", from:"sada", items:[
 {id:"petroleo", t:"Choque petrolero y estanflación", sim:"sadaoil", html:String.raw`
<section><h3>El mecanismo</h3><p class="lead">Un alza repentina del precio de un insumo importado de demanda inelástica tiene dos efectos: deprecia el tipo de cambio (la DA se desplaza a la derecha si \(\Delta E>\Delta P\)) y eleva los costos (las SA de corto y largo plazo se desplazan a la izquierda). El resultado es inflación con recesión.</p>
<p>En el mercado de trabajo del modelo clásico, el efecto del precio sobre el salario real queda dominado por el alza de los costos totales: cae la demanda de trabajo y el empleo de pleno empleo.</p></section>
<section><h3>Laboratorio</h3><p>Cambia de modelo para comparar el clásico, la NMC y la NMK.</p><div class="sim" id="sim"></div></section>`}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"parcial1",t:"Taller del parcial 1",anchor:"divisas",links:["bp","paridades","divisas","krugman"],sim:"par",html:String.raw`
<section><h3>Balanza de pagos (taller 2025-2)</h3><ol class="steps">
<li><b>¿Qué va en la cuenta de capital?</b> b) La condonación de una deuda por parte de un gobierno extranjero (transferencia de capital). Las remesas van en la cuenta corriente y la importación de maquinaria también.</li>
<li><b>Flores por US$10.000 pagadas con un depósito en EE. UU.:</b> b) crédito en la cuenta corriente (exportación) y débito en la cuenta financiera (aumento de activos externos).</li>
<li><b>Remesa de US$1.000 desde España:</b> crédito en la cuenta corriente, ingreso secundario (transferencia corriente recibida); débito en la cuenta financiera o en reservas, por el aumento de activos en divisas.</li>
<li><b>Préstamo de US$100 millones al Gobierno, a 5 años:</b> crédito en la cuenta financiera (aumento de pasivos externos, otra inversión) y débito en la cuenta financiera o reservas (aumento de activos en divisas). Los intereses irán después a la cuenta corriente.</li>
<li><b>Importación de maquinaria por 3 millones de euros:</b> débito en la cuenta corriente (importación de bienes) y crédito en la cuenta financiera (disminución de depósitos en el exterior).</li></ol></section>
<section><h3>Paridades</h3><ol class="steps">
<li><b>Big Mac:</b> \(TCN_{PPC}=15.000/2{,}5=6.000\). Con el mercado en 8.500: \((6.000/8.500-1)\times100=-29{,}4\%\). El peso está subvaluado (depreciado) 29,4 %: abarata las exportaciones colombianas y encarece las importaciones, así que mejora la competitividad.</li>
<li><b>PPC relativa (2025-1):</b> \(E=4.150\times1{,}065/1{,}032=4.282{,}70\).</li>
<li><b>Tipo de cambio esperado (2025-2):</b> \(E=4.000\times1{,}06/1{,}03=4.116{,}50\) en diciembre de 2023.</li>
<li><b>Forward (PCI):</b> \(F=3.980\times1{,}02/1{,}005=4.039{,}40\).</li></ol></section>
<section><h3>Mecanismos de transmisión</h3>
<p><b>Salida de capitales por una caída de la tasa de interés local.</b> <i>Mercado de divisas:</i> ∆-i → ∆-RI /dada la RE → DR ˂ 0 → salida de capitales → ∆ demanda de US → EDD. Flexible: ∆+E. Fijo: el BC vende US (∆-RI → ∆-M). <i>Enfoque de activos:</i> la RI se desplaza a la izquierda; en el E inicial, RE > RI y el peso se deprecia hasta el nuevo cruce. <i>Bienes y activos (Krugman):</i> equivale a desplazar la EMA a la derecha: con flexible, ∆+E y ∆+Y (con overshooting); con fijo, el BC vende reservas, la EMA regresa y Y no cambia.</p>
<p><b>Caída del ingreso de EE. UU.</b> ∆-Y* → ∆-X → menos oferta de US → EDD. Flexible: ∆+E. Fijo: el BC vende US. En Krugman la EMB se desplaza a la izquierda: con flexible, cae Y y se deprecia el peso, lo que amortigua la caída; con fijo, la caída de Y es mayor y el BC pierde reservas.</p>
<p><b>Krugman: cambios en la demanda de dinero.</b> ∆L → EDM → ∆i → entrada de capitales → EOD → ∆-E: la EMA se desplaza a la izquierda y cae Y (flexible); con fijo el BC compra US (∆M) y Y no cambia. Una disminución de la demanda de dinero tiene los efectos contrarios: con flexible, ∆+E y ∆+Y; con fijo, el BC vende US y Y no cambia. Compruébalo en el laboratorio de la estación del modelo Krugman.</p></section>
<section><h3>Calculadora de paridades</h3>${WSBOX}</section>`,
  d:"Los dos talleres del primer parcial resueltos: registros en la balanza de pagos, Big Mac, PPC relativa, forward y mecanismos de transmisión en el mercado de divisas, el enfoque de activos y el modelo Krugman."},
 {id:"parcial2",t:"Taller del parcial 2",anchor:"mundell",links:["mundell","zonas","sa","sada"],sim:"mftaller",html:String.raw`
<section><h3>Respuestas</h3><ol class="steps">
<li><b>Zonas.</b> Sin movilidad, un punto a la derecha de la BP es un <b>déficit en BP</b> (EDD). Arriba y a la derecha de la EMB hay un <b>exceso de oferta de bienes</b>. Con una política monetaria contractiva, en el efecto impacto el equilibrio interno queda en una zona de <b>superávit en BP</b> (la caída de Y mejora la balanza comercial y el alza de i atrae capitales): hay exceso de oferta de divisas, que presiona la apreciación con flexible o hace que el BC compre divisas con fijo.</li>
<li><b>Movilidad.</b> Perfecta: los activos nacionales y externos son sustitutos perfectos, BP horizontal en \(i=i^*\). Imperfecta: no son sustitutos perfectos por el riesgo país y los controles de capital; la BP tiene pendiente positiva, más inclinada que la EMM (pesa la renta) o menos (pesa la tasa de interés).</li>
<li><b>Flexible con el equilibrio interno en zona de déficit:</b> EDD → ∆+E → ∆+TCR → ∆+X/∆-Q → ∆+XN → la EMB se desplaza a la derecha y la BP abajo y a la derecha hasta que las tres curvas se cruzan.</li>
<li><b>Movilidad perfecta, alza de la tasa de EE. UU.:</b> la BP sube a \(i^*_1\) y en el punto inicial hay déficit. Fijo: el BC vende US, ∆-M, la EMM se desplaza a la izquierda: cae Y y \(i=i^*_1\). Flexible: ∆+E, ∆+TCR, ∆+XN: la EMB se desplaza a la derecha y sube Y. (Precargado en el laboratorio.)</li>
<li><b>Aumento de impuestos con flexible:</b> la EMB se desplaza a la izquierda. Sin movilidad o con BP más inclinada: superávit, el peso se aprecia y Y cae aún más. Con BP menos inclinada: déficit, el peso se deprecia y amortigua la caída. Con movilidad perfecta: la depreciación devuelve la EMB a su lugar y Y no cambia.</li>
<li><b>BP menos inclinada que la EMM, fijo, caen las exportaciones:</b> b) la venta de reservas internacionales por el Banco Central.</li>
<li><b>Alza del petróleo:</b> en el clásico tradicional, la SA vertical se desplaza a la izquierda (menor empleo de pleno empleo) y suben los precios; en la NMC, a corto plazo cae el producto con precios más altos y a largo plazo la economía se ubica en el nuevo nivel de pleno empleo; en la NMK, con el salario mínimo fijo, la SA se contrae, suben los precios y cae el empleo de forma persistente.</li></ol>
<p>Revisa cada caso en el laboratorio cambiando movilidad, régimen y choque, y en el de los cuatro planos para la pregunta 8.</p></section>
<section><h3>Laboratorio Mundell-Fleming</h3>${WSBOX}</section>`,
  d:"El taller del segundo parcial resuelto: zonas de desequilibrio, movilidad del capital, ajuste con tipo de cambio flexible, alza de la tasa de EE. UU., impuestos, caída de exportaciones y alza del petróleo en los modelos de oferta."},
 {id:"parcial3",t:"Taller del parcial 3",anchor:"esteril",links:["ajuste","sada","esteril","tcr"],sim:"ip",html:String.raw`
<section><h3>Respuestas</h3><ol class="steps">
<li><b>SA-DA fijo sin capitales, sobreempleo con superávit:</b> b) se debe usar una política fiscal junto con una política cambiaria (reducción del gasto y revaluación). Es la región E4, un dilema de política.</li>
<li><b>Caída del consumo en la NMK:</b> la DA se desplaza a la izquierda, bajan los precios, sube el salario real con el salario mínimo fijo, caen el empleo y la producción, y el efecto persiste.</li>
<li><b>Política monetaria expansiva en la NMC:</b> impacto ∆Y con ∆-i; a corto plazo ∆P con Pᵉ dado sube el empleo (asimetría de información); a largo plazo se corrigen las expectativas y la economía vuelve a Ȳ con precios más altos.</li>
<li><b>COVID-19:</b> a) comprar bonos en el mercado financiero para aumentar la liquidez.</li>
<li><b>Reforma tributaria (∆T) en el modelo i-P:</b> ∆T → ∆-DA → ∆-P → EOM → ∆-i → salida de capitales → el BC vende dólares. Con esterilización, M se mantiene: i cae más y P cae menos. Sin esterilización, M cae: P cae más e i cae menos. (Elige «Aumento de impuestos» en el laboratorio.)</li>
<li><b>Trilema:</b> un país no puede tener al tiempo tipo de cambio fijo, autonomía monetaria y libre movilidad del capital; debe escoger dos.</li>
<li><b>Caída de las remesas:</b> cae el gasto interno y la TT se desplaza a la izquierda; el TCR de equilibrio sube (devaluación real) y hay desempleo en no transables mientras PN se ajusta. Está en el laboratorio de la estación de transables y no transables.</li></ol></section>
<section><h3>Laboratorio del modelo i-P</h3>${WSBOX}</section>`,
  d:"El taller del tercer parcial resuelto: dilemas de política, caída del consumo en la NMK, expansión monetaria en la NMC, reforma tributaria con y sin esterilización, trilema y caída de remesas."}
];
