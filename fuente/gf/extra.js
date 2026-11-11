
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
