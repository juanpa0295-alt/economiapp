// =====================================================================
// CONTENIDO: Macroeconomía 2 (economía abierta), con la notación del curso del profesor Ramón Javier Mesa Callejas
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"glosario", t:"Cómo leer el curso: siglas, flechas y método", nuevo:true, html:String.raw`
<section><h3>La idea</h3><p class="lead">Casi todas las preguntas del curso piden llevar un choque, con flechas, hasta el tipo de cambio, la producción y la balanza de pagos. Antes de los modelos conviene dominar el idioma de las cadenas.</p></section>
<section><h3>Signos de las flechas</h3><div class="tbl"><table><tr><th>Signo</th><th>Se lee</th><th>Ejemplo</th></tr>
<tr><td>∆+ (Δ⁺)</td><td>aumenta</td><td>∆+i: sube la tasa de interés</td></tr>
<tr><td>∆- (∇, Δ⁻)</td><td>disminuye</td><td>∆-E: baja el tipo de cambio (el dólar se abarata)</td></tr>
<tr><td>→</td><td>lleva a, causa</td><td>∆+i → ∆+RI</td></tr>
<tr><td>⟺, ⟹</td><td>equivale a, implica</td><td>∆+RI ⟺ ∆+M (más reservas es más dinero, con tipo fijo)</td></tr>
<tr><td>Barra encima (Ē, P̄, M̄)</td><td>constante (ceteris paribus)</td><td>Ēᵉ: tipo de cambio esperado constante</td></tr>
<tr><td>/ dentro de una cadena</td><td>frente a, dado que lo otro está fijo</td><td>∆+RI / R̄E: sube la rentabilidad interna frente a una externa constante</td></tr>
<tr><td>* (i*, P*, Y*)</td><td>del exterior</td><td>i*: tasa de interés externa</td></tr>
<tr><td>Superíndice e</td><td>esperado</td><td>Eᵉₜ₊₁: lo que se cree que valdrá el dólar</td></tr>
<tr><td>Subíndices 0, 1, 2 y prima</td><td>inicial, impacto, final; curva desplazada</td><td>E₀, E₁; EMA’</td></tr></table></div></section>
<section><h3>Excesos y equilibrios</h3><div class="tbl"><table><tr><th>Sigla</th><th>Nombre</th><th>Qué provoca</th></tr>
<tr><td>EOD / EDD</td><td>Exceso de oferta / demanda de divisas</td><td>Baja E (aprecia) / sube E (deprecia)</td></tr>
<tr><td>EOM / EDM</td><td>Exceso de oferta / demanda de dinero</td><td>Baja i / sube i</td></tr>
<tr><td>EOB / EDB</td><td>Exceso de oferta / demanda de bienes</td><td>Baja y / sube y</td></tr>
<tr><td>EDA</td><td>Exceso de demanda agregada</td><td>Sube P</td></tr>
<tr><td>EMB</td><td>Equilibrio en el mercado de bienes</td><td>DD en Krugman (y, E); IS en Mundell-Fleming (y, i)</td></tr>
<tr><td>EMA</td><td>Equilibrio en el mercado de activos</td><td>AA en Krugman; vertical con tipo de cambio fijo</td></tr>
<tr><td>EMM / EMD</td><td>Equilibrio en el mercado monetario / de divisas</td><td>LM y BP = 0 en Mundell-Fleming</td></tr></table></div></section>
<section><h3>Letras con dos significados</h3><ul><li><b>RI</b>: rentabilidad interna \(1+i\) (paridad de intereses) o reservas internacionales (BdeP, intervención).</li><li><b>F</b>: flujos de capital (∆+F entra, ∆-F sale) o \(F_t\), el tipo de cambio forward.</li><li><b>B</b>: balanza comercial (exportaciones netas) o nivel de activos acumulados en el modelo intertemporal.</li><li><b>BC</b>: balanza comercial o banco central.</li><li><b>X y Q</b>: exportaciones (oferta de divisas) e importaciones (demanda de divisas). En este curso M es la oferta monetaria, no las importaciones.</li></ul></section>
<section><h3>Método en ocho pasos</h3><ol class="steps"><li>Identifica el choque y su dirección.</li><li>¿Qué variable cambia directamente?</li><li>¿Qué ecuación la conecta? (PPC, PNCI, \(M/P=L\), \(y=DA\)).</li><li>Signo del efecto.</li><li>Consecuencia intermedia: ¿EOD o EDD? ¿EOM o EDM? ¿EOB o EDB?</li><li>Qué pasa en los otros mercados.</li><li>Resultado final en E, y, P y la CC.</li><li>¿Es coherente con los supuestos? (precios fijos, régimen cambiario, ceteris paribus).</li></ol>
<p><b>Regla de oro:</b> cada flecha debe responder «¿por qué?» con un precio relativo, una rentabilidad, un incentivo o una identidad. Y la gráfica y el texto deben decir lo mismo.</p></section>
<p class="warn"><b>Error común:</b> leer al revés la cotización. E son pesos por dólar: si E sube, el peso pierde valor. «El dólar sube» y «el peso se aprecia» nunca van juntos.</p>`,
qs:[{q:"¿Cómo se lee la cadena ∆+i → ∆+RI / R̄E → DR > 0 → ∆+F → EOD → ∆-E?",a:"Sube la tasa de interés local; con la rentabilidad externa constante, la rentabilidad interna supera a la externa (DR > 0), entra capital, sobran dólares y baja el tipo de cambio: el peso se aprecia."},
 {q:"¿Qué significa RI en «∆+RI ⟺ ∆+M»?",a:"Reservas internacionales: con tipo de cambio fijo, cuando el banco central compra dólares aumentan las reservas y, como paga con pesos, aumenta la oferta monetaria. No es la rentabilidad interna."}]},

{id:"bp", t:"Balanza de pagos", nuevo:true, sim:"bp", html:String.raw`
<section><h3>La idea</h3><p class="lead">La balanza de pagos (BdeP) agrupa las transacciones económicas entre residentes y no residentes. Se registra por <b>partida doble</b>: cada transacción va una vez como crédito y otra como débito, así que el total siempre está en equilibrio contable.</p></section>
<section><h3>Matriz de clasificación</h3><div class="tbl"><table><tr><th>Balanza de pagos</th><th>Crédito (+)</th><th>Débito (−)</th></tr>
<tr><td>Transacciones reales (cuenta corriente)</td><td>Exportaciones de bienes y servicios; ingresos recibidos; transferencias recibidas</td><td>Importaciones de bienes y servicios; ingresos pagados; transferencias enviadas</td></tr>
<tr><td>Transacciones financieras (cuenta de capital y financiera)</td><td>Disminución de activos financieros externos; aumento de pasivos externos</td><td>Aumento de activos financieros externos; disminución de pasivos externos</td></tr>
<tr><td>Transacciones compensatorias (reservas internacionales)</td><td>Disminución de reservas</td><td>Aumento de reservas</td></tr></table></div>
<p>La <b>cuenta corriente</b> tiene la balanza comercial (bienes), la de servicios (viajes, transporte, seguros…), el ingreso primario (intereses, dividendos, utilidades) y el ingreso secundario (remesas y otras transferencias). La <b>cuenta de capital</b> recoge transferencias de capital, como una condonación de deuda. La <b>cuenta financiera</b> recoge inversión directa, de cartera y otra inversión (préstamos, depósitos).</p></section>
<section><h3>La estructura y la convención de clase</h3><div class="tbl"><table><tr><th>Cuenta</th><th>Qué registra</th></tr>
<tr><td>I. Cuenta corriente (CC): A. balanza comercial (BC), B. balanza de servicios (BS), C. transferencias (T)</td><td>Bienes; fletes, seguros, turismo y <b>servicios financieros (intereses y utilidades)</b>; remesas y donaciones</td></tr>
<tr><td>II. Cuenta financiera (CF)</td><td>Activos y pasivos con el exterior, en cuatro columnas: activo (débito | crédito) y pasivo (débito | crédito)</td></tr>
<tr><td>III. Variación de reservas (RI)</td><td>Divisas que entran (débito) o salen (crédito) del banco central</td></tr>
<tr><td>Errores y omisiones (EyO)</td><td>Partida de cuadre estadístico</td></tr></table></div>
<p><b>Crédito:</b> lo que trae divisas o crea un derecho del exterior sobre nosotros (exportaciones, turismo receptivo, remesas y utilidades recibidas, aumento de pasivos como la IED en Colombia, disminución de activos externos). <b>Débito:</b> lo que usa divisas (importaciones, intereses pagados, turismo emisor, aumento de activos externos, aumento de reservas).</p>
<p><b>Truco de registro:</b> en cada transacción pregunta «¿qué entra o sale de bienes o servicios?» (lado corriente) y «¿cómo se pagó?»: con reservas si fue al contado en divisas; en la CF si fue a crédito o con un depósito externo.</p>
<p class="hint">Diferencia con el manual: el profesor registra intereses y utilidades en la balanza de servicios; el MBP6 del FMI los llama ingreso primario. En el examen usa la versión de clase (así se calificó el parcial). Una participación de 10 % o más es IED, no cartera, y los fletes y seguros de una importación van en servicios, no en la balanza comercial.</p></section>
<section><h3>Ejemplo de clase (27-08-26)</h3><div class="tbl"><table><tr><th>Transacción</th><th>Débito</th><th>Crédito</th></tr>
<tr><td>Exportación de café / depósitos en el exterior (aumenta un activo de la CF)</td><td>5.000 (CF)</td><td>5.000 (BC)</td></tr>
<tr><td>Importación de maquinaria / depósitos en el exterior (disminuye un activo)</td><td>3.000 (BC)</td><td>3.000 (CF)</td></tr>
<tr><td>Remesas recibidas / divisas</td><td>1.000 (RI)</td><td>1.000 (T)</td></tr>
<tr><td>Intereses de la deuda / divisas</td><td>500 (BS)</td><td>500 (RI)</td></tr>
<tr><td>IED (pasivo de la CF) / divisas</td><td>2.000 (RI)</td><td>2.000 (CF)</td></tr></table></div>
<p>CC = 6.000 − 3.500 = +2.500; CF = 0 (activos netos 2.000 frente a 2.000 de pasivos); variación de RI = 3.000 − 500 = 2.500 de acumulación. El profesor lo escribe «2.500 = −2.500»: el saldo crédito de la CC iguala el saldo débito de RI. Está precargado en el laboratorio, en «Libro registro completo».</p></section>
<section><h3>La cuenta corriente vista desde la macroeconomía</h3>
<div class="mj">\[PNB=PIB+YNF+TNE=A+CC\quad\Rightarrow\quad CC=PNB-A=S-I\]</div>
<p>Con \(A=C+I+G\) el gasto de absorción. Un superávit en CC es capacidad de prestar al resto del mundo (acumulación de activos externos, \(CC=B-B_{-1}\)); un déficit es necesidad de financiamiento externo. Separando el sector público:</p>
<div class="mj">\[CC=(A_p-I_p)+(T-C_g-I_g)\quad\Rightarrow\quad\text{si }A_p=I_p:\ \ DEF=-CC\ \text{(déficits mellizos)}\]</div>
<p><b>Las tres brechas de clase.</b> (1) Producto–gasto: \(CC=PNB-A\). (2) Ahorro–inversión: \(S-I=CC=(S_p-I_p)+(S_g-I_g)\). (3) Cuenta corriente, financiera y reservas: \(CC+CF=\Delta RI\), con la CF medida como entrada neta de capital; en la forma del profesor, saldo CC = saldo CF ± variación de RI ± EyO. Ejemplo: si \(S=20\) e \(I=25\) (% del PIB), \(CC=-5\); si entra capital por 7, las reservas suben 2. Ojo: son identidades contables, no dicen qué causa qué.</p>
<p><b>Déficits gemelos (canal de transmisión).</b> Sin financiamiento: ∆+G / ∆-T → ∆+DA frente a la oferta → EDA → ∆+P → bienes nacionales más caros → ∆+Q → CC más negativa. Con deuda (TES) en el mercado local: ∆+i frente a i* → DR > 0 → ∆+F; con deuda externa entran los dólares directamente. En ambos casos → EOD → revaluación (∆-E) → ∆-TCR → ∆-X, ∆+Q → CC más negativa. Al revés, un déficit externo por caída de exportaciones (petróleo) reduce regalías e impuestos, y la depreciación encarece el servicio de la deuda: se abre el déficit fiscal.</p>
<p><b>CC intertemporal.</b> \(B_t=Y_t+rB_{t-1}+B_{t-1}-A_t\). Con «nace sin nada, se va sin nada» y dos períodos: \(CC_0=-CC_1/(1+r)\). Si hoy hay déficit, mañana hay que generar superávit en valor presente; con n períodos, \(\sum CC_t/(1+r)^t=0\).</p>
<p><b>Movilidad del capital.</b> Perfecta: activos locales y externos son sustitutos, \(Bp\approx Fc\) (supuesto de Krugman). Imperfecta (riesgo país, controles): \(Bp=B+Fc\). Sin capitales: \(Bp=B\).</p>
<p>Y con la restricción presupuestaria del gobierno, \(D-D_{-1}=(G+I_g-T)+rD_{-1}\): para que la deuda no crezca hace falta un superávit primario que cubra los intereses, \(T-(G+I_g)=rD_{-1}\).</p></section>
<section><h3>Determinantes de las exportaciones e importaciones</h3><p>Exportaciones: tipo de cambio real, ingreso del resto del mundo (\(Y^*\)), subsidios y otros factores de competitividad. Importaciones: tipo de cambio real, ingreso doméstico (\(Y\)) y aranceles. Un superávit (déficit) en CC es un exceso de oferta (demanda) de divisas que aumenta (disminuye) las reservas internacionales.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> pensar que «crédito» significa préstamo. En la BdeP, crédito es cualquier partida que trae un pago al país o reduce los activos externos o aumenta los pasivos externos; débito, lo contrario.</p>`,
qs:[{q:"Supletorio 2025-2: importación de maquinaria por US$15.000 (60 % al contado, 40 % a crédito), fletes de US$400, café por US$10.000 (80 % cobrado), turismo receptivo 2.500 y emisor 1.500, y compra del 15 % de una empresa por US$5.000. ¿CC, CF y ΔRI?",a:"CC = 12.500 − 16.900 = −4.400; CF = (6.000 + 5.000) − 2.000 = +9.000; ΔRI = 15.500 − 10.900 = +4.600 de acumulación. Verificación: −4.400 + 9.000 = 4.600. El 15 % es IED (≥ 10 %) y los fletes van en servicios. Míralo en el laboratorio."},
 {q:"Un superávit en CC, ¿con qué se compensa?",a:"Con un déficit en la CF (salida neta de capital), con aumento de reservas o con ambos, porque CC + CF = ΔRI (Parcial 1, pregunta 8: «todas las anteriores»)."},
 {q:"¿Por qué una exportación pagada con un depósito en el exterior no cambia el saldo total de la BdeP?",a:"Porque se registra dos veces: crédito en la cuenta corriente (exportación) y débito en la cuenta financiera (aumento de activos externos). La suma de créditos y débitos es cero."},
 {q:"Si el ahorro privado es igual a la inversión privada y el Gobierno tiene un déficit de 3 % del PIB, ¿cuánto es la cuenta corriente?",a:"Un déficit de 3 % del PIB: CC = (Ap − Ip) + (T − G − Ig) = 0 − 3 %. Son los déficits mellizos."}]},

{id:"paridades", t:"Paridades y tipo de cambio real", nuevo:true, sim:"par", html:String.raw`
<section><h3>Paridad del poder de compra (PPC)</h3><p class="lead">Una canasta debe costar lo mismo en dos países cuando se expresa en la misma moneda.</p>
<div class="mj">\[TCN\cdot P^E_{us}=P_\$\quad\Rightarrow\quad TCN_{PPC}=\frac{P_\$}{P^E_{us}}\]</div>
<p><b>Versión absoluta:</b> \(TCN\cdot P^E=P\), con \(TCR=1\). <b>Versión relativa:</b> el TCR puede ser distinto de 1 y lo que se cumple es la relación entre variaciones:</p>
<div class="mj">\[\frac{E_t}{E_{t-1}}=\frac{1+\Pi}{1+\Pi^*}\qquad\qquad \frac{dTCN}{TCN}=\Pi-\Pi^*\]</div>
<p>Con inflaciones esperadas (metas): \(E^e_{t+1}=E_t\,\frac{1+\Pi^e}{1+\Pi^{e*}}\) y, despejando, \(E_t=E^e_{t+1}\,\frac{1+\Pi^{e*}}{1+\Pi^e}\). En clase se usan las metas: Colombia 3 %, EE. UU. 2 % → el dólar sube cerca de 1 % al año (03-09: \(3.156\times1{,}03/1{,}02=3.187\)).</p>
<p><b>Variación causada:</b> \(\%\Delta E=(E_t/E_{t-1}-1)\times100\). De 4.200 a 3.050 es −27,4 % (apreciación); de 3.050 a 4.200 es +37,7 % (depreciación). La misma distancia da porcentajes distintos porque cambia la base: divide siempre por el período anterior. Si lo decide el mercado es depreciación o apreciación; si lo decide el banco central con tipo fijo, devaluación o revaluación.</p>
<p><b>Ejemplo de clase (hamburguesa):</b> \(P=24.000\), \(P^*=6\), \(E_{PPC}=4.000\), \(E_{spot}=3.050\): \((4.000/3.050-1)\times100=31{,}1\%\). El dólar de mercado está por debajo del de paridad: el peso está <b>sobrevaluado</b>, se abaratan las importaciones, se encarecen las exportaciones y la balanza comercial se deteriora. Recuperar la paridad exige devaluar 31,1 %; el BR podría comprar dólares. Con \(E_{spot}\): \(TCR=6\times3.050/24.000=0{,}762<1\), pierde competitividad.</p>
<p><b>Índice Big Mac:</b> \(\%\ \text{subvaluación}=\left[\dfrac{TCN_{PPC}}{TCN_{mercado}}-1\right]\times100\). Si es negativo, el peso está <b>subvaluado</b> (depreciado): las exportaciones colombianas son baratas en dólares. Si es positivo, está <b>sobrevaluado</b> (apreciado): se abaratan las importaciones.</p></section>
<section><h3>Tipo de cambio real</h3><div class="mj">\[TCR=\frac{E\,P^*}{P}\qquad\qquad \frac{\Delta TCR}{TCR}\approx\frac{\Delta E}{E}+\Pi^*-\Pi\]</div>
<p>Es el índice de competitividad-precio. Si sube (<b>devaluación real</b>), los bienes externos se encarecen frente a los nacionales: suben las exportaciones y bajan las importaciones. Si baja (<b>revaluación real</b>), ocurre lo contrario. Con varios socios: \(ITCR=\dfrac{\sum_j W_j\,IPX_j\,ITCA_j}{IPC}\).</p></section>
<section><h3>Paridad de intereses</h3>
<p><b>No cubierta (PNCI):</b> la rentabilidad interna en pesos debe igualar la externa en pesos.</p>
<div class="mj">\[(1+i)=(1+i^*)\frac{E^e_{t+1}}{E_t}\;\Rightarrow\;i\approx i^*+e^e\qquad\text{con riesgo país: } i=i^*+e^e+\mu\]</div>
<p>En clase: \(RI=1+i\) y \(RE=(1+i^*)E^e_{t+1}/E_t\), con \(DR=RI-RE\). Si DR > 0 entra capital (EOD, baja E); si DR ˂ 0 sale (EDD, sube E). El país con la tasa más alta debe tener una moneda que se espera que se deprecie. Ejemplo de clase: IBR 11,2 %, Libor 5 %, \(E_t=3.139\): la paridad exige \(E^e=3.139\times1{,}112/1{,}05=3.324\). Si el mercado espera 3.800, \(RE=1{,}05\times1{,}211=1{,}272>1{,}112\): salen capitales y sube el dólar.</p>
<p><b>Riesgo país (EMBI):</b> diferencial entre la tasa de los TES y la de los bonos del Tesoro de EE. UU. del mismo plazo (Colombia 893 pb = 8,93 % en clase). Entra como \((1+i)=(1+i^*)(E^e/E)(1+EMBI)\): con más riesgo, Colombia necesita una tasa más alta para atraer el mismo capital. <b>Tasa real:</b> \(i_{real}=i_N-\pi^e\) (12 % − 6 % = 6 %).</p>
<p>Despejando: \(E_t=E^e_{t+1}\,\frac{1+i^*}{1+i}\). Si \(i>i^*+e^e\) entran capitales: baja \(i\) o se aprecia el peso hasta recuperar la paridad. Con tipo de cambio fijo y creíble, todo el ajuste es en la tasa de interés.</p>
<p><b>Cubierta (PCI):</b> el inversionista asegura hoy el tipo de cambio futuro con un forward \(F_t\). Siempre se cumple por arbitraje:</p>
<div class="mj">\[1+i=(1+i^*)\frac{F_t}{E}\;\Rightarrow\;F_t=E\,\frac{1+i}{1+i^*}\]</div>
<p>Ejemplo de clase: US$1 = 2.000, \(i=7\%\), \(i^*=3\%\) → \(F=2.000\times1{,}07/1{,}03=2.078\).</p>
<p>\(F_t/E_t>1\) es <b>prima cambiaria</b>: se pacta un dólar futuro más caro, hay devaluación esperada del peso y conviene tener activos en dólares (Parcial 1, pregunta 19). \(F_t/E_t<1\) es descuento cambiario: revaluación esperada.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> mezclar tasas mensuales y anuales en la PNCI (supletorio 2.2: 0,67 % mensual frente a 3 % anual): llévalas al mismo período antes de calcular.</p>
<p class="warn"><b>Error común:</b> confundir subvaluado con apreciado. Un peso subvaluado frente a la PPC necesita <b>más</b> pesos por dólar de los que indica la paridad: está depreciado y favorece a los exportadores.</p>`,
deep:[{k:"Determinantes",t:"El tipo de cambio según la PPC y la PNCI",html:String.raw`<p>Según la PPC: \(E_t=E_t[E^e_{t+1}(+);\ \Pi^{e*}(+);\ \Pi^e(-)]\). Según la PNCI: \(E_t=E_t[E^e_{t+1}(+);\ i^*(+);\ i(-)]\). Por ejemplo, un alza de la tasa de la FED (\(\Delta i^*\)) dado \(i\) estimula la salida de capitales y deprecia el peso; un alza de la tasa del Banco de la República lo aprecia.</p><p>Los signos de \(\Pi^e\) y \(\Pi^{e*}\) solo valen con \(E^e_{t+1}\) fijo. En la realidad, una mayor inflación esperada en Colombia suele subir también \(E^e\), y ese efecto domina: si el ejercicio no dice que \(E^e\) está fijo, menciona los dos canales.</p>`}],
qs:[{q:"i = 9,25 %, i* = 4,5 %, Eₜ = 3.900. ¿Qué Eᵉ cumple la PNCI? Si el mercado espera 4.100, ¿qué pasa?",a:"Eᵉ = 3.900 × 1,0925/1,045 = 4.077,3. Con 4.100: RE = 1,045 × 4.100/3.900 = 1,0986 > RI = 1,0925, DR ˂ 0 y salen capitales. Eₜ sube hasta 4.100 × 1,045/1,0925 = 3.921,7, donde se restablece la paridad."},
 {q:"E = 3.950, F = 4.050 a un año, i = 9 %, i* = 4,5 %. ¿Dónde conviene invertir con cobertura?",a:"F/E = 1,0253: prima cambiaria de 2,53 %. Afuera con cobertura: 1,045 × 1,0253 = 1,0715; en Colombia: 1,09. Conviene Colombia. Para que hubiera PCI, F debería ser 3.950 × 1,09/1,045 = 4.120."},
 {q:"Una Big Mac vale US$2,50 en EE. UU. y $15.000 en Colombia; el mercado está a $8.500. ¿Qué indica la PPC?",a:"TCN_PPC = 15.000/2,5 = 6.000. Desalineamiento = (6.000/8.500 − 1) × 100 = −29,4 %: el peso está subvaluado (depreciado) 29,4 %, lo que abarata las exportaciones colombianas en dólares y mejora la competitividad-precio."},
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
<section><h3>Determinantes con su signo (notas de clase)</h3><div class="tbl"><table><tr><th>Bloque</th><th>Sube E (+)</th><th>Baja E (−)</th></tr>
<tr><td>PPC</td><td>\(E^e_{t+1}\), \(E_{t-1}\) (inercia), \(\Pi_{col}\), \(\Pi^{e*}\)</td><td>\(\Pi^*\), \(\Pi^e_{col}\) (con \(E^e\) fijo)</td></tr>
<tr><td>Paridad de intereses</td><td>\(i^*\), \(F_t\)</td><td>\(i\)</td></tr>
<tr><td>BdeP (CC + CF)</td><td>ICE (inversión colombiana afuera), Y (más importaciones)</td><td>Precio del petróleo, superávit en BC y BS, turismo, remesas, IEC, Y*, mejores términos de intercambio</td></tr>
<tr><td>Competitividad</td><td>Caída del TCR (P*/P baja)</td><td>Alza del TCR (P*/P sube)</td></tr></table></div>
<p class="hint">Las cadenas completas de cada determinante están en la rama «Diez cadenas del tipo de cambio».</p></section>
<section><h3>Visual de cambios: oferta y demanda de dólares</h3><div data-vis="divisas"></div></section>
<section><h3>Intervención con tipo de cambio fijo</h3><div class="tbl"><table><tr><th>E fijo por encima del equilibrio</th><th>E fijo por debajo del equilibrio</th></tr>
<tr><td>\(X_1>Q_1\): EOD → el BC compra el exceso de dólares → ∆+RI ⟺ ∆+M (política monetaria expansiva, con costo cuasifiscal) → ∆-i → ∆+I → ∆+A → ∆+DA → ∆+Y → ∆+P</td><td>\(Q_1>X_1\): EDD → el BC vende dólares → ∆-RI ⟺ ∆-M → ∆+i → ∆-I → ∆-A → ∆-DA → ∆-Y → ∆-P</td></tr></table></div>
<p>Con tipo fijo, las reservas y la oferta monetaria se vuelven endógenas: el banco renuncia a controlar M para controlar E. «TC fijo: intervenciones cambiarias → RI ⟹ M»; «TC flexible: el mercado de divisas determina E y TCR = TCR(E)».</p>
<p><b>Política de contracción de la absorción:</b> ∆-G / ∆+T → ∆-Yd → ∆-C → ∆-A → ∆-DA → ∆-Y → ∆-Q frente a X̄ → ∆+XN → EOD → ∆-E.</p>
<p><b>Estabilidad:</b> si las importaciones son inelásticas (complementarias, se necesitan sí o sí), el dólar sube y las importaciones no reaccionan: el déficit en CC persiste, sigue el EDD y E sigue subiendo; puede aparecer especulación desestabilizadora.</p></section>
<section><h3>Enfoque de activos (PNCI)</h3><p>Se mira solo el lado financiero: la rentabilidad interna \(RI=i\) es una recta vertical en el plano \((i,E)\) y la rentabilidad externa en pesos \(RE=i^*+(E^e_{t+1}-E_t)/E_t\) tiene pendiente negativa. El equilibrio es donde \(RI=RE\) (DR = 0).</p>
<ul><li>A un \(E_1\) mayor que el de equilibrio, \(RI>RE\): DR > 0, entran capitales, EOD y \(\Delta^-E\).</li><li>\(\Delta i^*\) desplaza RE a la derecha: en el E inicial DR ˂ 0, salen capitales (EDD) y el peso se deprecia.</li></ul>
<p>Con el mercado de dinero \((M/P=L(Y,i))\): un \(\Delta^+M\) → EOM → \(\Delta^-i\) (efecto liquidez) → \(\Delta^-RI\) dada la RE → DR ˂ 0 → salida de capitales → EDD → \(\Delta^+E\).</p></section>
<section><h3>Visual de cambios: dinero y paridad de intereses</h3><div data-vis="activos"></div></section>
<section><h3>Overshooting</h3><p>Tras una expansión monetaria, a corto plazo el tipo de cambio se deprecia de \(E_0\) a \(E_1\). A mediano plazo suben los precios, caen los saldos reales y sube \(i\): el peso se aprecia de \(E_1\) a \(E_2\). A largo plazo queda depreciado frente a \(E_0\), pero menos que en el corto plazo: \(\Delta^+E_{CP}>\Delta^+E_{LP}\).</p>
<p>Ocurre porque los precios son rígidos y los activos no: todo el ajuste inicial recae en E. En clase: <b>overshooting</b> = la devaluación del corto plazo supera a la del largo plazo; <b>undershooting</b> = la revaluación del corto plazo supera a la del largo. En la literatura (Dornbusch, Krugman) overshooting es que la respuesta de corto plazo supere a la de largo en cualquier dirección, y undershooting que sea menor; usa la de clase y menciona la diferencia si preguntan por una revaluación excesiva.</p>
<div class="tbl"><table><tr><th>Ajuste</th><th>M</th><th>i</th><th>E</th><th>P</th></tr><tr><td>Corto plazo</td><td>∆+</td><td>∆-</td><td>∆+</td><td>0</td></tr><tr><td>Mediano plazo</td><td>0</td><td>∆+</td><td>∆-</td><td>∆+</td></tr><tr><td>Largo plazo</td><td>0</td><td>∆-/∆+</td><td>∆-/∆+</td><td>∆+</td></tr></table></div></section>
<section><h3>Clasificación de choques</h3><p><b>Financieros</b> (desplazan la EMA): política monetaria local y externa (M, i*), expectativas \(E^e\), nivel de precios P, preferencias por activos. <b>Reales</b> (desplazan la EMB): G, T, P*, P, TCR, Y*, precio del petróleo, aranceles.</p></section>
<section><h3>Regímenes cambiarios extremos</h3><p>El FMI (informe AREAER) clasifica diez arreglos: sin moneda propia (dolarización), caja de conversión, paridad convencional, arreglo estabilizado, paridad móvil, arreglo similar a la paridad móvil, bandas horizontales, otros arreglos administrados, flotación y libre flotación. Colombia tiene flotación con intervenciones ocasionales del BR.</p><p><b>Fijo (hard pegs):</b> el BC fija el precio de la divisa y lo defiende con reservas; la política monetaria se endogeniza a las intervenciones y la devaluación se vuelve un instrumento. <b>Flotante:</b> el mercado determina E; el objetivo es el equilibrio externo y el mercado de bienes se endogeniza a las variaciones del TCR.</p></section>`,
qs:[{q:"Supletorio 2025-2: cae el precio del petróleo. ¿Qué curva se mueve y qué pasa con E?",a:"Colombia exporta petróleo: por los mismos barriles entran menos dólares, la oferta X se desplaza a la izquierda, hay EDD en E₀ y sube E (depreciación). Además cae la IED petrolera y los ingresos fiscales, y sube el riesgo país. Al estudiante le descontaron por dibujar bien la gráfica y concluir apreciación en el texto."},
 {q:"Suben los aranceles. ¿Qué pasa con E?",a:"Lo importado se encarece, cae Q, la curva de demanda de dólares se desplaza a la izquierda: EOD y baja E (apreciación). Segunda ronda: la apreciación baja el TCR y resta exportaciones, así que el proteccionismo compensa en parte su propio efecto."},
 {q:"Si cae la tasa de interés local, ¿qué pasa en el mercado de divisas con tipo de cambio fijo?",a:"Baja la RI dada la RE: DR ˂ 0, salen capitales y hay EDD. Para que E no suba, el BC vende dólares (∆-RI), lo que contrae la oferta monetaria (∆-M) y tiende a devolver la tasa de interés a su nivel."}]},

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
<p>Con tipo de cambio fijo, \(E=\tilde E=\tilde E^e_{t+1}\) y la PNCI se reduce a \((1+i)=(1+i^*)\): \(i_E=0\), la pendiente es infinita y en las notas la EMA se dibuja <b>vertical</b>; su posición la fija M, que depende de las reservas, y se desplaza cuando el banco compra o vende dólares. (Krugman dibuja la AA con pendiente y la desplaza con las intervenciones.)</p></section>
<section><h3>Zonas de desequilibrio y tres fases</h3><div class="tbl"><table><tr><th>Zona respecto al cruce</th><th>Bienes</th><th>Activos</th></tr>
<tr><td>Arriba</td><td>EDB</td><td>EOD</td></tr><tr><td>Derecha</td><td>EOB</td><td>EOD / EDM</td></tr><tr><td>Abajo</td><td>EOB</td><td>EDD / EOM</td></tr><tr><td>Izquierda</td><td>EDB</td><td>EDD / EOM</td></tr></table></div>
<p>Cada choque se cuenta en tres fases: (1) <b>impacto</b>, un solo mercado se desequilibra; (2) <b>ajuste</b>; (3) <b>efecto final</b>. Si no se quiere modificar ni y ni E, se vuelve al equilibrio desplazando una curva con política.</p>
<p><b>Truco del gráfico de cuatro cuadrantes (29-09):</b> el panel izquierdo está en espejo (y crece hacia la izquierda), por eso la EMA parece tener pendiente positiva allí. En el plano normal es negativa.</p></section>
<section><h3>Caída de precios: se mueven las dos curvas</h3><p>P está en el TCR (EMB) y en M/P (EMA). ∆-P → ∆+TCR → ∆+XN → EDB: la EMB baja a la derecha. ∆-P → ∆+M/P → EOM → ∆-i → DR ˂ 0 → EDD: la EMA sube a la derecha. La producción sube con seguridad; E es ambiguo. Por eso la respuesta de la pregunta 15 del Parcial 1 es la gráfica que desplaza ambas curvas.</p></section>
<section><h3>Pleno empleo y brechas (13-10)</h3><p>\(\bar y-y_0>0\): desempleo (la SA supera a la DA), hace falta política expansiva. \(y_0-\bar y>0\): sobreempleo. Con tipo flexible se puede llegar a \(\bar y\) por dos caminos: con política monetaria la EMA sube y E termina mayor (depreciación, más exportaciones); con política fiscal la EMB baja a la derecha y E termina menor (apreciación, más gasto interno). Misma producción, distinto tipo de cambio y distinta composición de la demanda.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="krugman"></div></section>
${LAB}`,
qs:[{q:"Sube la tasa de la FED. ¿Qué régimen protege mejor los precios? (Parcial 1, punto 4)",a:"Flexible: DR ˂ 0 → EDD → sube E → ∆+TCR → ∆+XN → ∆+y, pero entra inflación importada. Fijo: el BC vende divisas → ∆-RIN → ∆-M → EDM → sube i hasta i*: E y P quedan estables a costa de menos producción y menos reservas. El profesor pidió mostrar los dos regímenes con gráficas antes de elegir."},
 {q:"Con tipo de cambio flexible, ¿qué efecto tiene un aumento de la demanda de dinero en el modelo de Krugman?",a:"∆L dado (M/P) → EDM → ∆i → DR > 0 → entrada de capitales → EOD → ∆-E: la EMA se desplaza abajo y a la izquierda. La apreciación reduce las XN y la renta cae. Con tipo de cambio fijo, el BC compra dólares (∆M) y la EMA regresa: la renta no cambia."}]},

{id:"mundell", t:"Modelo Mundell-Fleming", nuevo:true, sim:"mf", html:String.raw`
<section><h3>La idea</h3><p class="lead">Extiende el IS-LM a la economía abierta: determina \((Y,i)\) con precios fijos a partir de tres mercados, con distintos grados de movilidad del capital y con tipo de cambio fijo o flexible.</p>
<div class="tbl"><table><tr><th>Mercado</th><th>Curva</th><th>Ecuación</th></tr>
<tr><td>Bienes</td><td>EMB (IS), pendiente negativa</td><td>\(Y=A(Y;i;\hat A)+XN(TCR;Y;Y^*)\)</td></tr>
<tr><td>Dinero</td><td>EMM (LM), pendiente positiva</td><td>\(M/P=L(Y;i)\), \(\ \partial i/\partial Y=-L_Y/L_i\)</td></tr>
<tr><td>Divisas</td><td>EMD (BP = 0), pendiente \(-B_Y/F_i\)</td><td>\(BP=B(TCR;Y;Y^*)+F(i;i^*;E^e_{t+1}/E_t)=0\)</td></tr></table></div>
<p class="hint">En las notas de clase la curva de divisas se llama EMD (equilibrio en el mercado de divisas) y se escribe \(Bp=B(y)+F(i)=0\): si y sube empeora la balanza comercial (\(B_y<0\)) y hace falta una tasa mayor para atraer capital (\(F_i>0\)). A diferencia de Krugman, Mundell-Fleming trabaja en (y, i) y admite distintos grados de movilidad.</p>
<p>Hay tres equilibrios: <b>interno</b> (EMB = EMM), <b>externo</b> (BP = 0) y <b>macroeconómico</b> (EMB = EMM = BP).</p></section>
<section><h3>Movilidad del capital</h3><ul><li><b>Sin movilidad</b> (\(F_i=0\)): BP vertical; solo cuenta la balanza comercial.</li><li><b>Imperfecta:</b> BP con pendiente positiva. Caso I: más inclinada que la EMM (pesa más la renta); caso II: menos inclinada (pesa más la tasa de interés).</li><li><b>Perfecta</b> (\(F_i\to\infty\)): BP horizontal en \(i=i^*\); no depende de la balanza comercial.</li></ul></section>
<section><h3>Zonas de desequilibrio</h3><div class="tbl"><table><tr><th>Curva</th><th>Arriba / izquierda</th><th>Abajo / derecha</th></tr>
<tr><td>EMB</td><td>Arriba y a la derecha: EOB (Y > DA)</td><td>Abajo y a la izquierda: EDB</td></tr>
<tr><td>EMM</td><td>Arriba y a la izquierda: EOM</td><td>Abajo y a la derecha: EDM</td></tr>
<tr><td>BP = 0</td><td>Arriba y a la izquierda: superávit (EOD)</td><td>Abajo y a la derecha: déficit (EDD)</td></tr></table></div></section>
<section><h3>El proceso de ajuste</h3><ol class="steps"><li><b>Efecto impacto:</b> el choque mueve la EMB o la EMM y la economía llega a un nuevo equilibrio interno (punto 1).</li><li><b>Saldo de la BP en el punto 1:</b> \(\Delta Y\to\Delta Q\) mueve la balanza comercial y \(\Delta i\) mueve la cuenta financiera.</li><li><b>Tipo de cambio fijo:</b> el BC compra o vende reservas: la EMM se endogeniza (\(\Delta RI\to\Delta M\)).</li><li><b>Tipo de cambio flexible:</b> el EDD o EOD mueve E: se endogenizan la EMB y la BP vía TCR.</li></ol></section>
<section><h3>Resumen con movilidad perfecta</h3><div class="tbl"><table><tr><th></th><th>Monetaria expansiva</th><th>Fiscal expansiva</th></tr><tr><td>Fijo</td><td>Ineficaz: el BC vende reservas</td><td>Máximo efecto: el BC compra reservas</td></tr><tr><td>Flexible</td><td>Máximo efecto: la depreciación refuerza</td><td>Ineficaz: la apreciación desplaza las XN</td></tr></table></div></section>
<section><h3>Visual de cambios</h3><div data-vis="mf"></div></section>
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
<p>Cualquier choque del comercio exterior o de la cuenta corriente afecta la DA con tipo de cambio fijo, pero no con flexible (Appleyard y Field, 2014).</p></section>
<section><h3>Visual de cambios: desplaza la DA</h3><div data-vis="sada"></div></section>`,
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
<section><h3>Visual de cambios</h3><div data-vis="sada"></div></section>
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
{g:"Visuales y repaso", from:"glosario", items:[
 {id:"visuales", t:"Visuales de cambios: todos los gráficos", html:String.raw`
<section><h3>Para qué sirve</h3><p class="lead">Aquí están juntos los gráficos del curso en los que se estudian desplazamientos. Mueve una curva y el texto de abajo te dice qué cambió, qué pudo haberlo causado, el mecanismo con flechas y el resultado.</p>
<ul><li><b>Línea punteada:</b> dónde estaba la curva al inicio. <b>Línea sólida:</b> dónde está ahora.</li><li><b>Punto 0:</b> equilibrio inicial; <b>0’:</b> efecto impacto; <b>1 y 2:</b> equilibrios tras el choque y tras el ajuste.</li><li><b>Rombo:</b> punto de prueba. Muévelo fuera del equilibrio para ver qué excesos hay (EOD, EDD, EOM, EDM, EOB, EDB).</li><li>Los choques de ejemplo cargan casos de los talleres; después puedes seguir moviendo las curvas a mano.</li></ul>
<p class="hint">Los números son ilustrativos: sirven para ver direcciones y magnitudes relativas, no para calcular un ejercicio. Cada gráfico también aparece dentro de su estación.</p></section>
<section><h3>Gráficos</h3><div data-vis="*"></div></section>`},
 {id:"errores", t:"Errores frecuentes y dudas de las notas", html:String.raw`
<section><h3>Quince errores que cuestan puntos</h3><ol class="steps">
<li><b>Leer al revés la cotización.</b> Si E sube, el peso se deprecia.</li>
<li><b>Cambiar la base del porcentaje.</b> De 4.200 a 3.050 es −27,4 %; de 3.050 a 4.200 es +37,7 %.</li>
<li><b>Confundir observado con esperado.</b> \(E_t\) y \(E_{t-1}\) son datos; \(E^e_{t+1}\) es una expectativa. En el supletorio 2.1, el 3.655,64 es \(E^e_{t+1}\), aunque se haya escrito «\(E_t\) = …».</li>
<li><b>Invertir una flecha.</b> Revisa siempre con la intuición del precio relativo.</li>
<li><b>Usar una letra con dos significados:</b> RI (rentabilidad o reservas), F (flujos o forward), B (balanza comercial o activos), BC (balanza comercial o banco central).</li>
<li><b>Tratar una identidad como causa.</b> \(CC=S-I\) no dice que el ahorro cause la CC.</li>
<li><b>Olvidar los supuestos.</b> El signo − de \(\Pi^e_{col}\) sobre E solo vale con \(E^e\) fijo; «la política monetaria es inefectiva» solo vale con E fijo y movilidad perfecta.</li>
<li><b>Confundir efecto directo e indirecto.</b> El arancel aprecia el peso (directo) y esa apreciación reduce exportaciones (segunda ronda).</li>
<li><b>Olvidar que dos canales operan a la vez.</b> Una caída de precios mueve la EMB y la EMA (Parcial 1, pregunta 15).</li>
<li><b>Contradecir la gráfica con el texto.</b> Supletorio 3.3: gráfica con depreciación y texto con apreciación, 0,3/0,6.</li>
<li><b>Mezclar tasas mensuales y anuales</b> en la PNCI.</li>
<li><b>«Aumenta en 8 %».</b> Puede ser 8 puntos (24 % → 32 %) o 8 % relativo (24 % → 25,92 %). Di cuál usas; en el Parcial 1 se aceptó 32 %.</li>
<li><b>Clasificar mal en la BdeP.</b> 10 % o más es IED; intereses y utilidades van en servicios (convención de clase); fletes y seguros de una importación, en servicios.</li>
<li><b>Leer mal el gráfico en espejo</b> de cuatro cuadrantes (29-09).</li>
<li><b>Dibujar la EMA con pendiente negativa en tipo fijo.</b> En las notas es vertical y se desplaza con las reservas.</li></ol></section>
<section><h3>Puntos de las notas para confirmar con el profesor</h3><div class="tbl"><table><tr><th>Dónde</th><th>Qué dice</th><th>Lectura más probable</th></tr>
<tr><td>Lista del 22-09 (sub y sobrevaluado)</td><td>Subvaluado → ∆+Q, ∆-X</td><td>Flechas invertidas: usa la versión de la hamburguesa</td></tr>
<tr><td>Encabezado de PPC</td><td>\(\partial E/\partial\Pi^*_{us}>0\)</td><td>El signo es negativo</td></tr>
<tr><td>Ejemplo del 03-09</td><td>3.156 × 1,0098 = 3.180</td><td>3.187</td></tr>
<tr><td>Hamburguesa</td><td>31 % y «31,7 %»</td><td>31,1 %</td></tr>
<tr><td>Carry trade</td><td>310.000.000/3.000 = 110.000</td><td>103.333 (sin intereses)</td></tr>
<tr><td>Paridad de intereses</td><td>RE = (1,05)(1,112)</td><td>(1,05)(1,211) = 1,272</td></tr>
<tr><td>EMBI</td><td>«Mayor EMBI, mayor probabilidad de pago»</td><td>Menor EMBI, mayor probabilidad de pago</td></tr>
<tr><td>Financiamiento con el banco central</td><td>Flecha hacia la subida de la tasa</td><td>La emisión baja i y genera inflación</td></tr>
<tr><td>ITCR de clase</td><td>0,86 («nosotros»)</td><td>≈ 0,787; el término de Perú es 0,198, no 0,278</td></tr>
<tr><td>Parcial 1, pregunta 2</td><td>Clave no visible</td><td>Probablemente a (d como alternativa)</td></tr></table></div></section>
<section><h3>Repaso rápido antes del examen</h3><ul><li>E = pesos por dólar; \(TCR=EP^*/P\): mayor que 1, Colombia es competitiva.</li><li>PPC: el país con más inflación se deprecia. PNCI: el país con más tasa debe tener depreciación esperada.</li><li>DR > 0: entra capital y baja E. DR ˂ 0: sale capital y sube E.</li><li>X ofrece dólares, Q los demanda. EOD baja E; EDD sube E. EOM baja i; EDM la sube.</li><li>EMB: pendiente +. EMA: pendiente −, vertical con E fijo.</li><li>Flexible: monetaria efectiva, fiscal parcial. Fijo: fiscal efectiva, monetaria inefectiva; RI ⟺ M.</li><li>BdeP: crédito trae divisas o crea un pasivo; débito usa divisas o crea un activo; \(CC+CF=\Delta RI\).</li><li>Siempre: choque → precio relativo o rentabilidad → decisión → mercado → resultado.</li></ul></section>`}]},
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
<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`},
 {id:"riesgo", t:"Riesgo país, tasa real y carry trade", sim:"parcarry", html:String.raw`
<section><h3>Riesgo país (EMBI)</h3><p class="lead">Los activos colombianos no son sustitutos perfectos de los de EE. UU.: hay una prima de riesgo. El EMBI es el diferencial entre la tasa de los TES y la de la deuda de EE. UU. del mismo plazo.</p>
<div class="mj">\[EMBI_{col}=i_{TES}-i^*_{FED}\qquad (1+i)=(1+i^*)\,\frac{E^e_{t+1}}{E_t}\,(1+EMBI)\]</div>
<p>En clase: Colombia 893 pb = 8,93 % (o 14 % − 5 % = 9 %); Chile 88 pb; Brasil 174 pb. A mayor EMBI, mayor riesgo y menor probabilidad de pago: Colombia paga más para que el mercado secundario le compre la deuda. El precio de un bono es rendimientos / i: si sube i, baja el precio del bono.</p>
<p><b>Sube el EMBI:</b> a la misma i los inversionistas exigen más → DR ˂ 0 → salida de capital → EDD → ∆+E. Para restablecer la paridad, o sube E hoy o el BR sube i; además suele subir \(E^e\). Por eso una subida de i que se lee como señal de crisis puede no apreciar el peso.</p></section>
<section><h3>Tasa de interés real</h3><p>\(i_{real}=i_N-\pi^e\). Ejemplo de clase: 12 % − 6 % = 6 %.</p></section>
<section><h3>Carry trade (operación de diferencial de tasas)</h3><p>Un fondo se endeuda en dólares barato y lo invierte en pesos caro. Clase: US$100.000 al 5 % (debe 105.000) → a 3.100 son $310.000.000 → al 12 % son $347.200.000 → sale a 3.000 con US$115.733 → ganancia ≈ US$10.733, por el diferencial de tasas y la apreciación del peso.</p>
<p>En la BdeP la inversión entra a la CF como pasivo (crédito) y los intereses que paga Colombia son un débito en servicios financieros. Para frenar la entrada especulativa: bajar i, exigir un tiempo mínimo de permanencia o gravar los rendimientos.</p></section>
<section><h3>Laboratorio</h3><p>Cambia el tipo de cambio de salida para ver cuándo la depreciación borra el diferencial de tasas. La pestaña «RI frente a RE» incluye el EMBI.</p><div class="sim" id="sim"></div></section>`}]},
{g:"Mercado de divisas", from:"divisas", items:[
 {id:"mecanismos", t:"Diez cadenas del tipo de cambio", sim:"pardr", html:String.raw`
<section><h3>Cómo usarlas</h3><p class="lead">Cada cadena parte de un choque y termina en el mercado de divisas (curva X de oferta y Q de demanda de dólares). No se memorizan: se reconstruyen con el método de ocho pasos.</p></section>
<section><h3>Las cadenas</h3><div class="tbl"><table><tr><th>N.º</th><th>Choque</th><th>Cadena</th><th>E</th></tr>
<tr><td>M1</td><td>∆+π col (dados Ē y P̄*)</td><td>∆+P → E·P* menor que P → ∆-TCR → bienes extranjeros más baratos → ∆+Q → EDD</td><td>∆+</td></tr>
<tr><td>M2</td><td>∆+π* (dados Ē y P̄)</td><td>∆+P* → ∆+TCR → ∆+X, ∆-Q → EOD</td><td>∆-</td></tr>
<tr><td>M3</td><td>∆+Eᵉ</td><td>Si se espera un dólar más caro, conviene comprarlo hoy → más demanda de dólares (también ∆+RE)</td><td>∆+</td></tr>
<tr><td>M4</td><td>∆+i (dados ī* y Ēᵉ)</td><td>∆+RI / R̄E → DR > 0 → ∆+F → EOD; al bajar E sube Eᵉ/E y la RE hasta DR = 0</td><td>∆-</td></tr>
<tr><td>M5</td><td>∆+i* (dados ī y Ēᵉ)</td><td>∆+RE / R̄I → DR ˂ 0 → ∆-F → EDD; la RE se desplaza a la derecha en (i, E)</td><td>∆+</td></tr>
<tr><td>M6</td><td>∆+Y*</td><td>∆+X dada Q̄ → ∆+XN → BC > 0, CC > 0 → más oferta de dólares</td><td>∆-</td></tr>
<tr><td>M7</td><td>∆+Y</td><td>∆+Q dada X̄ → ∆-XN → CC ˂ 0 → más demanda de dólares (enfoque real)</td><td>∆+</td></tr>
<tr><td>M8</td><td>∆-precio del petróleo</td><td>Menos dólares por los mismos barriles → X a la izquierda → EDD; además ∆-IED, ∆-ingresos fiscales, ∆+riesgo país → ∆+Eᵉ</td><td>∆+</td></tr>
<tr><td>M9</td><td>∆+aranceles</td><td>Importados más caros → ∆-Q dada X̄ → Q a la izquierda → EOD; segunda ronda: ∆-TCR → ∆-X</td><td>∆-</td></tr>
<tr><td>M10</td><td>∆+remesas, turismo, IEC (o ∆+ICE)</td><td>Entran dólares → EOD (salen dólares → EDD)</td><td>∆- (∆+)</td></tr></table></div></section>
<section><h3>Dos canales para el ingreso</h3><p>En M7 un aumento de y deprecia el peso por la vía comercial (más importaciones). En el enfoque de activos (la pendiente de la EMA) lo aprecia: ∆+y → ∆+L frente a M̄/P̄ → EDM → ∆+i → DR > 0 → EOD → ∆-E. Con movilidad perfecta, el canal financiero suele dominar en el corto plazo.</p>
<p><b>Expectativas de inflación (M3):</b> de \(E_t=E^e_{t+1}(1+\pi^{e*})/(1+\pi^e_{col})\), con \(E^e\) fijo, ∆+π*ᵉ sube E y ∆+πᵉ col lo baja. Si \(E^e\) se ajusta, una mayor inflación esperada en Colombia termina subiendo E.</p></section>
<section><h3>Visual: prueba las cadenas en el gráfico</h3><div data-vis="divisas"></div></section>
<section><h3>Laboratorio</h3><p>Prueba M4, M5 y M3 con la PNCI: cambia i, i* o el Eᵉ del mercado y mira el signo de DR.</p><div class="sim" id="sim"></div></section>`}]},
{g:"Krugman", from:"krugman", items:[
 {id:"politicas", t:"Política y choques en EMB–EMA", sim:"krug", html:String.raw`
<section><h3>Tres fases</h3><p class="lead">(1) Impacto: un solo mercado se desequilibra. (2) Ajuste. (3) Efecto final. Estas son las cadenas de las notas del 10-09 al 13-10.</p></section>
<section><h3>Política monetaria</h3><p><b>M11, dos canales desde la tasa:</b> ∆+M frente a L̄ → EOM → ∆-i (dados ī* y Ēᵉ). Canal del gasto: ∆+I → ∆+A → ∆+DA → ∆+Y. Canal cambiario: DR ˂ 0 → ∆-F → EDD → ∆+E.</p>
<p><b>M12, expansión con flexible:</b> impacto en activos: ∆+M/P → EOM → ∆-i → DR ˂ 0 → EDD → E salta a E₀’ con y₀ fijo. Ajuste en bienes: ∆+TCR → ∆+XN → EDB → ∆+y → ∆+L → EDM → ∆+i → DR > 0 → EOD → E baja en parte. Final: \(E_0<E_1<E_0'\) y \(y_1>y_0\). Efectiva.</p>
<p><b>M13, expansión con fijo:</b> … EDD → presión para que suba E → el BC vende dólares → ∆-RI ⟺ ∆-M → la EMA vuelve a su sitio. y y E sin cambio, menos reservas. Inefectiva: el banco deshace con la mano izquierda lo que hizo con la derecha.</p>
<p><b>M18, el BR sube su tasa:</b> ∆-M → EDM → ∆+i → DR > 0 → EOD → ∆-E → ∆-TCR → ∆-XN; además ∆-I → ∆-A. Cae la DA: bajan y y P (control de la inflación). Con tipo fijo, el EOD obligaría a comprar dólares y anularía la subida.</p></section>
<section><h3>Política fiscal</h3><p><b>M14, ∆+G:</b> ∆+A → ∆+DA → ∆+y → ∆+L frente a M̄/P̄ → EDM → ∆+i → DR > 0 → EOD. <i>Flexible:</i> baja E → ∆-TCR → ∆-XN: la producción crece menos (desplazamiento parcial vía tipo de cambio). <i>Fijo:</i> el BC compra dólares → ∆+RI → ∆+M → la EMA se desplaza a la derecha: la producción sube por completo.</p>
<p><b>M15, ∇G con tipo fijo (Parcial 1, punto 1):</b> ∆-A → ∆-DA → ∆-y → EOM → ∆-i → DR ˂ 0 → EDD → el BC vende divisas → ∆-RIN → ∆-M: la EMB sube a la izquierda y la EMA vertical se desplaza a la izquierda hasta cortarla en E₀. La producción cae aún más y se pierden reservas (1,0/1,0 en el parcial).</p>
<p><b>M16, financiamiento del déficit:</b> con deuda interna (TES) sube la tasa → DR > 0 → ∆+F; con deuda externa o privatización entran dólares directamente. En todos los casos EOD y baja E. Financiar con emisión del banco central aumenta M, baja i y genera inflación (sube E).</p></section>
<section><h3>Choques externos y precios</h3><p><b>M17, ∆+i*:</b> DR ˂ 0 → ∆-F → EDD. Flexible: la EMA sube, ∆+E → ∆+TCR → ∆+XN → ∆+y, con inflación importada. Fijo: el BC vende divisas → ∆-M → EDM → i sube hasta i*: E constante, baja la producción y los precios quedan estables.</p>
<p><b>M19, ∇P:</b> mueve las dos curvas (EMB por el TCR, EMA por M/P). Sube y; E ambiguo.</p>
<p><b>M20, ∆+Y* (Parcial 1, pregunta 3):</b> ∆+X → ∆+XN → ∆+DA → ∆+L → EDM → ∆+i → DR > 0 → EOD → baja E. Con fijo: el BC compra dólares → ∆+RIN → ∆+M.</p></section>
<section><h3>Mecanismos parecidos, resultados distintos</h3><div class="tbl"><table><tr><th>Se parecen</th><th>Difieren porque</th><th>Resultado</th></tr>
<tr><td>∆+M con flexible (M12) y con fijo (M13)</td><td>Con fijo el BC defiende E vendiendo reservas</td><td>Efectiva frente a inefectiva</td></tr>
<tr><td>∆+G con flexible y con fijo (M14)</td><td>Con fijo el BC compra los dólares que sobran y expande M</td><td>Parcial frente a completa</td></tr>
<tr><td>∆+i por política monetaria (M18) y por fiscal (M14)</td><td>En M18 cae la DA; en M14 la DA sube y la tasa sube como consecuencia</td><td>Ambos aprecian; y baja en M18 y sube en M14</td></tr>
<tr><td>∆+M en el corto y en el largo plazo</td><td>En el largo plazo suben los precios y la tasa regresa</td><td>E sube mucho y luego baja un poco (overshooting)</td></tr></table></div></section>
<section><h3>Visual: prueba las cadenas en el gráfico</h3><div data-vis="krugman"></div></section>
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
<li><b>Remesa de US$1.000 desde España:</b> crédito en la cuenta corriente, ingreso secundario (en clase, balanza de transferencias); débito en la cuenta financiera o en reservas, por el aumento de activos en divisas.</li>
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
  d:"El taller del tercer parcial resuelto: dilemas de política, caída del consumo en la NMK, expansión monetaria en la NMC, reforma tributaria con y sin esterilización, trilema y caída de remesas."},
 {id:"supletorio",t:"Supletorio 2025-2 y Parcial 1 (2026-2)",anchor:"divisas",links:["bp","paridades","divisas","politicas","errores"],sim:"bpsupl",html:String.raw`
<section><h3>Supletorio 2025-2</h3><ol class="steps">
<li><b>Balanza de pagos.</b> CC = −4.400 (BC −5.000; BS +600: fletes −400 y viajes +2.500 − 1.500); CF = +9.000 (crédito comercial 6.000 + IED 5.000 − crédito al comprador 2.000); ΔRI = +4.600. Identidad: −4.400 + 9.000 = 4.600; créditos = débitos = 34.400. El déficit viene de la compra de maquinaria (inversión) y se financia con ahorro externo; la entrada neta supera el déficit y el resto se acumula como reservas. Lo que se penalizó: importaciones de 14.600 en lugar de 15.000, la IED sin registrar en la CF y la salida de 400 de reservas por los fletes. (Libro completo en el laboratorio.)</li>
<li><b>PPC relativa:</b> \(E^e_{t+1}=3.617{,}01\times1{,}041/1{,}03=3.655{,}64\): devaluación esperada de 1,07 %, porque Colombia tiene 1,1 puntos más de inflación.</li>
<li><b>PNCI a un mes:</b> primero el mismo período: \(i^*=3\%/12=0{,}25\%\) mensual (o 0,2466 % compuesto). \(E^e=3.800\times1{,}0067/1{,}0025=3.815{,}92\): devaluación esperada de 0,42 % en el mes.</li>
<li><b>Baja la tasa de política:</b> ∆-i → DR ˂ 0 → ∆-F → la curva Q pasa a Q’ → EDD → E sube de E₀ a E₁; la depreciación sube el TCR y estimula la economía (0,6/0,6).</li>
<li><b>Suben los aranceles:</b> ∆-Q dada X̄ → Q a la izquierda → EOD → E baja (apreciación); segunda ronda ∆-TCR → ∆-X (0,6/0,6).</li>
<li><b>Baja el precio del petróleo:</b> X a la izquierda → EDD → E sube; además cae la IED petrolera, los ingresos fiscales y sube el riesgo país. El argumento «petróleo más barato hace más competitivas las exportaciones» solo valdría si fuera un insumo importado: Colombia lo exporta (0,3/0,6 por contradecir la gráfica).</li></ol></section>
<section><h3>Parcial 1 (2026-2): las preguntas que más se fallan</h3><ol class="steps">
<li><b>Pregunta 15 → gráfica A.</b> La caída generalizada de precios mueve las dos curvas: la EMB por el TCR (baja a la derecha) y la EMA por M/P (sube a la derecha), con \(y_2>y_1>y_0\). Elegir una gráfica que solo mueve la EMB es el error.</li>
<li><b>Pregunta 19 → invertir en el exterior.</b> Prima cambiaria positiva = \(F/E>1\) = devaluación esperada del peso: los activos en dólares ganan en pesos. Invertir en el país sería la respuesta con descuento cambiario.</li>
<li><b>Pregunta 2 (tipo fijo, caída de precios) → probablemente a.</b> La b es falsa (con tipo fijo siempre se interviene); la c describe solo el canal de bienes; la d dice que la deflación reduce la DA, lo que contradice el modelo. Confirma la clave con el profesor.</li>
<li><b>Punto 2, PNCI con i = 24 %, i* = 10 %, Eᵉ = 4.612:</b> \(E_t=4.612\times1{,}10/1{,}24=4.091{,}29\); devaluación esperada de 12,73 % (no «moneda revaluada»). Con 24 % + 8 puntos = 32 %: \(E_t=3.843{,}33\) (con 8 % relativo, 25,92 %: 4.028,91).</li>
<li><b>Punto 3, Big Mac en libras:</b> \(TCR=0{,}81\times5{,}81/7=0{,}672<1\): Inglaterra es menos competitiva. \(E_{PPC}=7/5{,}81=1{,}2048\) libras por dólar.</li>
<li><b>Punto 4, alza de i* y estabilidad de precios:</b> hay que mostrar los dos regímenes con gráficas (rama «Política y choques en EMB–EMA», M17): el fijo protege los precios a costa de reservas y producción; el flexible amortigua la producción pero importa inflación.</li></ol>
<p class="hint">Otras claves del parcial: P1 utilidades recibidas en BS (crédito); P9 devaluación real = nominal + π* − π; P16 \(0{,}50\times1{,}10/1{,}20=0{,}458\) dólares por euro; P20 EMB relación directa y EMA inversa entre E e y.</p></section>
<section><h3>Libro registro del supletorio</h3>${WSBOX}</section>`,
  d:"El supletorio 2025-2 resuelto (balanza de pagos, paridades y tres choques en el mercado de divisas) y la clave razonada de las preguntas del Parcial 1 que más se fallan."},
 {id:"practica",t:"Práctica de la guía (E1 a E10)",anchor:"krugman",links:["paridades","riesgo","mecanismos","politicas","bp"],sim:"pardr",html:String.raw`
<section><h3>Ejercicios de mecanismos</h3><ol class="steps">
<li><b>E1, la FED sube su tasa (flexible):</b> ∆+RE → DR ˂ 0 → ∆-F → EDD → ∆+E (la RE se desplaza a la derecha; la EMA sube) → ∆+TCR → ∆+XN → ∆+y → inflación importada. Suben E, y y P; sale capital por la CF y mejora la BC.</li>
<li><b>E2, caen las remesas:</b> menos oferta de dólares → EDD → ∆+E; empeora la CC por transferencias. Segunda ronda: el TCR sube, ∆+X, ∆-Q y la CC se compensa en parte.</li>
<li><b>E3, sube el EMBI:</b> con \((1+i)=(1+i^*)(E^e/E)(1+EMBI)\) los inversionistas exigen más → DR ˂ 0 → salida → EDD → ∆+E. Para restablecer la paridad sube E o el BR sube i; suele subir también \(E^e\).</li>
<li><b>E4, ∆+G con deuda externa (flexible):</b> rama real ∆+A → ∆+DA → ∆+y → ∆+Q; rama de activos ∆+y → EDM → ∆+i → EOD; rama de financiamiento: entran los dólares del crédito → EOD. Baja E → ∆-TCR. Peso apreciado, la producción sube menos y la CC empeora: déficits gemelos.</li>
<li><b>E5, recesión mundial con tipo fijo:</b> ∆-Y* → ∆-X → ∆-DA → ∆-y (la EMB sube a la izquierda); menos dólares y ∆-L → EOM → ∆-i → salida: EDD. El BC vende reservas → ∆-M → la EMA vertical se desplaza a la izquierda. E igual, la producción cae más que con flexible.</li>
<li><b>E6, el BR compra US$1.000 millones (flexible):</b> EDD → ∆+E; paga con pesos: ∆+RI ⟺ ∆+M → EOM → ∆-i → salida → E sube más y ∆+I. En el largo plazo ∆+P → ∆-M/P → ∆+i → E baja en parte (overshooting). Si esteriliza (vende TES), M no cambia y solo queda el efecto directo.</li></ol></section>
<section><h3>Ejercicios de cálculo</h3><ol class="steps">
<li><b>E7, PNCI:</b> i = 9,25 %, i* = 4,5 %, \(E_t=3.900\). a) \(E^e=4.077{,}3\). b) Con 4.100, RE = 1,0986 > RI = 1,0925: salen capitales. c) \(E_t\) sube a 3.921,7. (Precargado con los datos de clase en la calculadora; cámbialos.)</li>
<li><b>E8, Big Mac:</b> $19.900 y US$5,79, E = 3.900. \(E_{PPC}=19.900/5{,}79=3.437\); \(TCR=3.900\times5{,}79/19.900=1{,}135>1\): Colombia es competitiva y el peso está subvaluado. Con la fórmula de clase, \((3.437/3.900-1)\times100=-11{,}9\%\) (habría que revaluar 11,9 % para llegar a la paridad); medido sobre la paridad, el dólar de mercado está 13,5 % por encima.</li>
<li><b>E9, BdeP:</b> CC = 4.000 − 800 + 1.200 = +4.400; CF = 3.000 − 2.000 = +1.000; ΔRI = +5.400. Está en el laboratorio de balanza de pagos.</li>
<li><b>E10, PCI:</b> F/E = 4.050/3.950 = 1,0253 (prima de 2,53 %). Afuera con cobertura: 1,0715; en Colombia: 1,09. Conviene Colombia; la PCI exigiría F = 4.120.</li></ol></section>
<section><h3>Preguntas de comprensión</h3><ul><li><b>¿Por qué hay overshooting?</b> Precios rígidos y activos flexibles. Con precios flexibles, P subiría con M, M/P no cambiaría y E saltaría a su valor de largo plazo.</li><li><b>¿Por qué y aprecia en el enfoque de activos y deprecia en el real?</b> En el real se mira la CC (más importaciones); en el de activos, la CF (más demanda de dinero, más tasa, entra capital).</li><li><b>¿Por qué la fiscal es más efectiva con fijo y la monetaria con flexible?</b> Con fijo la intervención refuerza la fiscal y anula la monetaria; con flexible el tipo de cambio refuerza la monetaria y frena la fiscal.</li><li><b>¿Y M13 sin movilidad de capitales?</b> La baja de i no saca capital, el banco no vende reservas y la monetaria recupera efectividad por la inversión.</li><li><b>¿Importaciones inelásticas?</b> La depreciación no corrige el déficit, el EDD persiste y E sigue subiendo.</li></ul></section>
<section><h3>Calculadora de rentabilidades</h3>${WSBOX}</section>`,
  d:"Los ejercicios del capítulo de preparación de la guía resueltos: seis mecanismos (FED, remesas, EMBI, gasto con deuda externa, recesión mundial con tipo fijo, compra de dólares del BR), cuatro cálculos y preguntas de comprensión."}
];
