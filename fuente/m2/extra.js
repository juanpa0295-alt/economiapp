
// ===================== AJUSTE AL PROGRAMA 1503712 =====================
(function(){
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
ins("divisas",[
{id:"dinero", t:"Creación de dinero y balance del banco central", sim:"multi", html:String.raw`
<section><h3>Base monetaria y balance del banco central</h3><p class="lead">La base monetaria (\(B\)) es el pasivo monetario del banco central: efectivo en manos del público más reservas de los bancos. Su contrapartida en el activo explica de dónde sale el dinero.</p>
<div class="tbl"><table><tr><th>Activo (fuentes de la base)</th><th>Pasivo (usos)</th></tr><tr><td>Reservas internacionales netas</td><td>Efectivo en circulación</td></tr><tr><td>Crédito interno: al gobierno y a los bancos (repos)</td><td>Reservas bancarias (encaje)</td></tr><tr><td>Otros activos netos</td><td>Depósitos del gobierno y otros pasivos</td></tr></table></div>
<div class="mj">\[B=RIN+CI\qquad\Delta B=\Delta RIN+\Delta CI\]</div>
<p>Comprar dólares (acumular reservas) o prestar a los bancos aumenta la base; venderlos o recoger liquidez la reduce. Por eso, con tipo de cambio fijo, la intervención cambiaria cambia la oferta de dinero si no se esteriliza.</p></section>
<section><h3>El multiplicador</h3>
<p>Con \(c=\) efectivo/depósitos y \(r=\) reservas/depósitos (encaje):</p>
<div class="mj">\[M1=C+D=\frac{1+c}{c+r}\,B=m\cdot B\]</div>
<p>Los bancos crean dinero al prestar los depósitos que no guardan como reservas. El multiplicador cae si el público prefiere más efectivo o si los bancos guardan más reservas (por ejemplo, en una crisis de confianza). <b>Endogeneidad de la oferta monetaria:</b> como \(c\) y \(r\) dependen de las tasas de interés y del ciclo, y el banco central fija la tasa de interés y provee la base que se demande a esa tasa, en la práctica la cantidad de dinero es endógena.</p></section>
${LAB}`,
qs:[{q:"Con B = 100, c = 0,25 y r = 0,10, ¿cuánto es M1?",a:"m = 1,25/0,35 = 3,57; M1 = 357."}]}]);
ins("esteril",[
{id:"overshooting", t:"La sobrerreacción del tipo de cambio (Dornbusch)", sim:"over", html:String.raw`
<section><h3>La idea</h3><p class="lead">Dornbusch (1976): si los precios de los bienes se ajustan lento pero los mercados financieros se ajustan al instante, una expansión monetaria hace que el tipo de cambio se deprecie <b>más</b> de lo que se depreciará en el largo plazo, y luego se aprecie gradualmente.</p></section>
<section><h3>El mecanismo</h3><ol>
<li>En el largo plazo el dinero es neutral: si \(M\) sube 10 %, \(P\) y \(E\) suben 10 %.</li>
<li>En el corto plazo \(P\) está fijo: más dinero real baja la tasa de interés doméstica \(i<i^*\).</li>
<li>Por la paridad no cubierta, \(i=i^*+\frac{E^e-E}{E}\): para que los inversionistas acepten un rendimiento menor, deben esperar una <b>apreciación</b>. Eso solo es posible si \(E\) salta hoy por encima de su nuevo valor de largo plazo.</li>
<li>Con el tiempo los precios suben, la tasa de interés vuelve a \(i^*\) y el tipo de cambio se aprecia hasta su nuevo nivel de largo plazo.</li></ol>
<div class="mj">\[\text{Sobrerreacción: }\frac{\Delta e_0}{\Delta m}=1+\frac{1}{\lambda\theta}>1\]</div>
<p>donde \(\lambda\) es la semielasticidad de la demanda de dinero a la tasa de interés y \(\theta\) la velocidad de ajuste de las expectativas (o de los precios). Explica la gran volatilidad de los tipos de cambio flexibles.</p></section>
${LAB}`,
qs:[{q:"¿Por qué el tipo de cambio sobrerreacciona y no los precios?",a:"Porque los precios de los bienes son rígidos en el corto plazo, mientras que el tipo de cambio es un precio de activo que se ajusta al instante para mantener la paridad de intereses."}]}]);
ins("tcr",[
{id:"hbs", t:"El efecto Harrod-Balassa-Samuelson", sim:"hbs", html:String.raw`
<section><h3>La idea</h3><p class="lead">Los países con mayor crecimiento de la productividad en los bienes <b>transables</b> (frente a los no transables) tienden a tener una <b>apreciación real</b> de su moneda.</p></section>
<section><h3>El mecanismo</h3><ol>
<li>El precio de los transables lo fija el mercado mundial (\(P_T=EP_T^*\)).</li>
<li>Si la productividad de los transables crece, crecen los salarios en ese sector y, por movilidad del trabajo, en toda la economía.</li>
<li>En los no transables, donde la productividad crece menos, los salarios más altos se trasladan a precios: sube \(P_N/P_T\).</li>
<li>Como el índice de precios incluye no transables, el nivel de precios sube frente al externo: el tipo de cambio real se aprecia.</li></ol>
<div class="mj">\[\hat q=\hat e+\hat P^*-\hat P\approx-(1-\gamma)\big[(\hat a_T-\hat a_N)-(\hat a_T^*-\hat a_N^*)\big]\]</div>
<p>(\(\gamma\) = peso de los transables en el índice de precios; \(\hat a\) = crecimiento de la productividad). Explica por qué los países ricos tienen niveles de precios más altos (la PPA no se cumple en niveles) y por qué las economías que convergen, como las de Asia del Este, se aprecian en términos reales.</p></section>
${LAB}`,
qs:[{q:"Si Colombia aumenta la productividad de sus transables más que sus socios, ¿qué se espera del TCR?",a:"Una apreciación real (el TCR, definido como EP*/P, baja)."}]}]);
TRUNK.push(
{id:"monetaria", t:"Política monetaria: instrumentos, objetivos y mecanismos de transmisión", sim:"taylor", html:String.raw`
<section><h3>La estructura de la política monetaria</h3>
<div class="tbl"><table><tr><th>Nivel</th><th>Ejemplos</th></tr><tr><td>Instrumentos</td><td>Tasa de interés de política (repos), operaciones de mercado abierto, encaje, intervención cambiaria</td></tr><tr><td>Objetivos operativos</td><td>Tasa interbancaria (IBR), base monetaria</td></tr><tr><td>Objetivos intermedios</td><td>Agregados monetarios (M1, M3), crédito, tipo de cambio (en regímenes fijos)</td></tr><tr><td>Indicadores</td><td>Expectativas de inflación, brecha del producto, tasas de mercado, TES</td></tr><tr><td>Objetivos finales</td><td>Estabilidad de precios; en Colombia, inflación de 3 % con estabilidad del producto (art. 373 de la Constitución)</td></tr></table></div>
<p>Colombia pasó de metas de agregados monetarios (hasta 1999) a <b>inflación objetivo</b> con tipo de cambio flexible desde 2000.</p></section>
<section><h3>Mecanismos de transmisión</h3><ol>
<li><b>Tasa de interés:</b> sube la tasa de política → suben las tasas de mercado → cae la inversión y el consumo durable.</li>
<li><b>Tipo de cambio:</b> mayor tasa → entran capitales → apreciación → caen las exportaciones netas y los precios importados.</li>
<li><b>Crédito:</b> cambia la oferta de préstamos de los bancos (canal del crédito bancario) y el valor de las garantías (hoja de balance).</li>
<li><b>Precios de los activos:</b> acciones y vivienda (efecto riqueza, q de Tobin).</li>
<li><b>Expectativas:</b> la credibilidad del banco central ancla las expectativas de inflación.</li></ol>
<p>La transmisión tarda entre 4 y 8 trimestres hasta la inflación. La regla de Taylor resume cómo responde un banco central a la inflación y a la brecha del producto.</p></section>
${LAB}`,
qs:[{q:"¿Por qué el Banco de la República dejó de fijar metas de M1?",a:"Porque la demanda de dinero se volvió inestable (innovación financiera) y la relación entre agregados e inflación se debilitó; la inflación objetivo usa la tasa de interés y comunica directamente la meta."}]},
{id:"regimenes", t:"Regímenes cambiarios para economías emergentes", sim:"trinidad", html:String.raw`
<section><h3>Del fijo al flexible</h3>
<div class="tbl"><table><tr><th>Régimen</th><th>Ventaja</th><th>Costo</th></tr>
<tr><td>Dolarización (Ecuador, Panamá, El Salvador)</td><td>Elimina el riesgo cambiario y baja la inflación</td><td>Sin política monetaria ni prestamista de última instancia; pérdida del señoreaje</td></tr>
<tr><td>Caja de convertibilidad (Argentina 1991–2001, Hong Kong)</td><td>Credibilidad: la base está respaldada por reservas</td><td>Muy rígida ante choques; su salida suele ser una crisis</td></tr>
<tr><td>Fijo convencional o bandas</td><td>Ancla nominal</td><td>Vulnerable a ataques especulativos</td></tr>
<tr><td>Flotación administrada</td><td>Combina flexibilidad e intervención</td><td>Poco transparente</td></tr>
<tr><td>Flotación (Colombia desde 1999)</td><td>Amortigua choques externos; política monetaria autónoma</td><td>Volatilidad; efectos de hoja de balance con deuda en dólares</td></tr></table></div>
<p>El FMI clasifica los regímenes de facto (lo que el país hace), no de jure (lo que dice). Calvo y Reinhart documentaron el «miedo a flotar»: muchos países que dicen flotar intervienen mucho.</p></section>
<section><h3>La trinidad imposible y la visión bipolar</h3>
<p>Un país no puede tener a la vez <b>tipo de cambio fijo</b>, <b>libre movilidad de capitales</b> y <b>política monetaria autónoma</b>: debe renunciar a uno. La <b>visión bipolar</b> (Fischer, 2001) sostiene que, con capitales móviles, solo son sostenibles los extremos (fijo duro o flotación) y que los regímenes intermedios terminan en crisis.</p></section>
${LAB}`,
qs:[{q:"Un país con libre movilidad de capitales quiere fijar su tipo de cambio. ¿A qué renuncia?",a:"A la autonomía de la política monetaria: su tasa de interés queda atada a la externa."}]},
{id:"crisis", t:"Crisis financieras en las economías emergentes", html:String.raw`
<section><h3>Tipos de crisis</h3><ul>
<li><b>Cambiarias o de balanza de pagos:</b> ataque especulativo que agota las reservas y obliga a devaluar. Modelos de primera generación (Krugman, 1979: déficit fiscal monetizado incompatible con el tipo de cambio fijo), de segunda generación (Obstfeld: equilibrios múltiples y profecías autocumplidas) y de tercera generación (descalce de monedas y fragilidad bancaria).</li>
<li><b>Bancarias:</b> corridas, quiebras e insolvencia del sistema.</li>
<li><b>De deuda:</b> imposibilidad de pagar o refinanciar la deuda externa o pública.</li>
<li><b>Gemelas:</b> cambiaria y bancaria a la vez (Kaminsky y Reinhart, 1999).</li>
<li><b>Frenazo súbito (sudden stop):</b> se cortan los flujos de capital y la cuenta corriente debe ajustarse de golpe (Calvo).</li></ul>
<p>El <b>contagio</b> se transmite por comercio, por vínculos financieros (los mismos acreedores) y por cambios en la percepción de riesgo de toda una región.</p></section>
<section><h3>Cronología</h3>
<div class="tbl"><table><tr><th>Año</th><th>Crisis</th><th>Rasgos</th></tr>
<tr><td>1982–1989</td><td>Deuda latinoamericana</td><td>Alza de tasas en EE. UU., moratoria de México, «década perdida»</td></tr>
<tr><td>1994</td><td>México («efecto tequila»)</td><td>Déficit en cuenta corriente, deuda de corto plazo en dólares (tesobonos), devaluación</td></tr>
<tr><td>1997</td><td>Asia (Tailandia, Corea, Indonesia)</td><td>Auge de crédito, descalce de monedas, crisis gemelas</td></tr>
<tr><td>1998</td><td>Rusia</td><td>Moratoria de deuda; contagio a emergentes, también a Colombia (crisis de 1999)</td></tr>
<tr><td>2001</td><td>Argentina</td><td>Fin de la convertibilidad, «corralito», moratoria</td></tr>
<tr><td>2007–2008</td><td>Hipotecaria de EE. UU.</td><td>Subprime, titularizaciones, quiebra de Lehman Brothers; Gran Recesión</td></tr>
<tr><td>2010–2012</td><td>Deuda de la eurozona</td><td>Grecia, Irlanda, Portugal, España; sin política cambiaria propia</td></tr></table></div>
<p class="link">Lecciones para Colombia: la flotación cambiaria, la regla fiscal, la acumulación de reservas y la línea de crédito flexible con el FMI son defensas construidas después de la crisis de 1999.</p></section>`,
qs:[{q:"¿Qué es el descalce de monedas y por qué agrava una devaluación?",a:"Tener deudas en dólares e ingresos en pesos: la devaluación aumenta el valor en pesos de la deuda y puede quebrar a empresas y bancos."}]});
const P={glosario:"Antes de empezar",bp:"Unidad 1 · Fundamentos de la macroeconomía abierta",dinero:"Unidad 3 · Precios fijos: dinero, activos, Krugman y Mundell-Fleming",da:"Unidad 4 · Precios flexibles: oferta agregada y ajuste",tcr:"Unidad 2 · Enfoque real (en el curso se estudia al final)",monetaria:"Unidad 5 · Política monetaria",regimenes:"Unidades 6 y 7 · Regímenes cambiarios y crisis (transversales)"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
})();
