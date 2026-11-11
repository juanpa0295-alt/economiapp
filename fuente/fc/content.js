// =====================================================================
// CONTENIDO: Finanzas Corporativas (1501802, U. de Antioquia).
// Bibliografía: Brigham; Moyer et al.; Emery y Finnerty; Mascareñas; García (Valoración de empresas, gerencia del valor y EVA).
// =====================================================================
const GUIA_ID="fc";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Objetivo financiero",2:"Unidad 2 · Capital de trabajo",3:"Unidad 3 · Costo de capital",4:"Unidad 4 · Creación de valor",5:"Unidad 5 · Dividendos",6:"Unidad 6 · Fusiones"};
const P1="Unidad 1 · Función y objetivo de la administración financiera",P2="Unidad 2 · Administración del capital de trabajo",P3="Unidad 3 · Costo de capital",P4="Unidad 4 · Creación de valor y valoración",P5="Unidad 5 · Política de dividendos",P6="Unidad 6 · Fusiones y adquisiciones";
const TRUNK=[
{id:"objetivo", parte:P1, u:1, t:"El objetivo financiero y la teoría de agencia", sim:"agencia", html:String.raw`
<section><h3>Maximizar el valor</h3><p class="lead">El objetivo financiero de la empresa es <b>maximizar el valor para los propietarios</b>, no las utilidades contables: el valor incorpora el tiempo, el riesgo y la capacidad de generar flujo de caja en el futuro. La dirección financiera toma tres decisiones: <b>inversión</b> (en qué activos), <b>financiación</b> (con qué mezcla de deuda y patrimonio) y <b>distribución</b> (cuánto repartir como dividendos).</p></section>
<section><h3>Teoría de agencia (Jensen y Meckling, 1976)</h3><p>Una relación de agencia existe cuando el principal (accionista) delega decisiones en un agente (gerente) que tiene sus propios intereses e información privada. Conflictos típicos: accionistas frente a gerentes (consumo de beneficios privados, construcción de imperios, aversión al riesgo del gerente) y accionistas frente a acreedores (sustitución de activos hacia proyectos más riesgosos, subinversión, dilución de la deuda).</p>
<p>Los <b>costos de agencia</b> son la suma de los costos de supervisión del principal, los costos de vinculación (garantías) del agente y la pérdida residual. Cuando el gerente vende parte de la propiedad, solo soporta una fracción del costo de sus beneficios privados: la <b>dilución</b> aumenta el problema.</p></section>
<section><h3>Gobierno corporativo y ética</h3><p>Mecanismos para alinear intereses: juntas directivas independientes, remuneración con acciones u opciones, mercado de control corporativo (adquisiciones hostiles), deuda (disciplina el flujo de caja libre), transparencia y revelación de información. En Colombia, el Código País de la Superintendencia Financiera recoge recomendaciones de buen gobierno para emisores de valores.</p></section>
${LAB}`,
qs:[{q:"¿Por qué maximizar utilidades no es el objetivo correcto?",a:"Porque ignora el momento en que llegan los flujos, el riesgo y la inversión necesaria para obtenerlos; el valor sí los incorpora."}]},

{id:"ciclo", parte:P2, u:2, t:"Capital de trabajo y ciclo de conversión del efectivo", sim:"ccc", html:String.raw`
<section><h3>Conceptos</h3><p class="lead">El <b>capital de trabajo neto operativo</b> (KTNO) es la inversión que la empresa mantiene en cuentas por cobrar e inventarios, menos lo que financian los proveedores:</p>
<div class="mj">\[KTNO=\text{Cartera}+\text{Inventarios}-\text{Proveedores}\]</div>
<p>El <b>ciclo de conversión del efectivo</b> mide cuántos días pasan entre el pago a los proveedores y el cobro a los clientes:</p>
<div class="mj">\[CCE=\underbrace{\frac{\text{Inventario}}{\text{Costo de ventas}}365}_{\text{días de inventario}}+\underbrace{\frac{\text{Cartera}}{\text{Ventas}}365}_{\text{días de cartera}}-\underbrace{\frac{\text{Proveedores}}{\text{Compras}}365}_{\text{días de proveedores}}\]</div></section>
<section><h3>Productividad del capital de trabajo y palanca de crecimiento</h3><p>García (2003) propone dos indicadores muy usados en Colombia:</p><ul><li><b>Productividad del capital de trabajo</b> PKT = KTNO / Ventas: centavos de capital de trabajo que se necesitan por cada peso vendido. Menor es mejor.</li><li><b>Palanca de crecimiento</b> PDC = Margen EBITDA / PKT. Si PDC &gt; 1, el crecimiento genera caja; si PDC &lt; 1, crecer <b>demanda</b> caja y la empresa puede quedarse ilíquida aunque sea rentable.</li></ul></section>
${LAB}`,
qs:[{q:"Una empresa tiene 60 días de inventario, 45 de cartera y 30 de proveedores. ¿Cuál es su ciclo de efectivo?",a:"60 + 45 − 30 = 75 días."}]},

{id:"politica-kt", parte:P2, u:2, t:"Política y financiamiento del capital de trabajo", sim:"credito", html:String.raw`
<section><h3>Políticas de inversión y financiación</h3><p class="lead">Los activos corrientes tienen una parte <b>permanente</b> (el mínimo que siempre se necesita) y una <b>temporal</b> (picos estacionales).</p><ul>
<li><b>Política de calce (moderada):</b> lo permanente con fuentes de largo plazo y lo temporal con crédito de corto plazo.</li><li><b>Conservadora:</b> parte de lo temporal también con largo plazo; menor riesgo de liquidez, mayor costo.</li><li><b>Agresiva:</b> parte de lo permanente con corto plazo; más barata en general, pero con riesgo de refinanciación y de tasa.</li></ul></section>
<section><h3>Fuentes de corto plazo</h3><p>Crédito de proveedores, sobregiros y créditos bancarios, factoring (venta de cartera), confirming, papeles comerciales. El crédito comercial parece gratis, pero <b>no tomar un descuento por pronto pago</b> tiene un costo implícito muy alto:</p>
<div class="mj">\[\text{Costo nominal}=\frac{d}{1-d}\cdot\frac{365}{N-DP}\qquad \text{Costo efectivo}=\left(1+\frac{d}{1-d}\right)^{365/(N-DP)}-1\]</div>
<p>Con condiciones 2/10 neto 30 (2 % de descuento si se paga en 10 días; plazo de 30), el costo efectivo de no tomar el descuento supera el 40 % anual.</p>
<p>La administración del efectivo y de los inventarios también tiene modelos clásicos: el <b>lote económico</b> \(Q^*=\sqrt{2DS/H}\) y el <b>modelo de Baumol</b> para el saldo de efectivo \(C^*=\sqrt{2bT/i}\).</p></section>
${LAB}`,
qs:[{q:"¿Qué política de financiación usa deuda de corto plazo para parte de los activos permanentes?",a:"La agresiva."}]},

{id:"apalancamiento", parte:P3, u:3, t:"Apalancamiento operativo y financiero", sim:"apal", html:String.raw`
<section><h3>Grados de apalancamiento</h3><p class="lead">El apalancamiento mide cómo los costos fijos amplifican los cambios en las ventas.</p>
<div class="mj">\[GAO=\frac{\%\Delta UAII}{\%\Delta\text{Ventas}}=\frac{MC}{UAII}\qquad GAF=\frac{\%\Delta UPA}{\%\Delta UAII}=\frac{UAII}{UAII-I}\qquad GAT=GAO\cdot GAF\]</div>
<p>\(MC\) es el margen de contribución (ventas menos costos variables), \(UAII\) la utilidad operativa e \(I\) los intereses. Más costos fijos operativos o más deuda elevan el riesgo: una caída de ventas se traduce en una caída mayor de la utilidad por acción.</p></section>
<section><h3>Análisis UAII-UPA</h3><p>Para elegir entre financiarse con deuda o con acciones se busca la <b>UAII de indiferencia</b>, donde ambas dan la misma UPA:</p><div class="mj">\[\frac{(UAII-I_1)(1-t)}{N_1}=\frac{(UAII-I_2)(1-t)}{N_2}\]</div>
<p>Por encima de ese punto conviene la deuda (apalancamiento favorable); por debajo, las acciones.</p></section>
${LAB}`,
qs:[{q:"Si el GAO es 3 y las ventas suben 10 %, ¿cuánto sube la UAII?",a:"30 %."}]},

{id:"costo-fuentes", parte:P3, u:3, t:"Costo de las fuentes: CAPM, dividendos y deuda", sim:"ke", html:String.raw`
<section><h3>Costo del patrimonio</h3><ul><li><b>CAPM:</b> \(K_e=r_f+\beta(R_m-r_f)\), con prima de riesgo país en mercados emergentes: \(K_e=r_f+\beta(R_m-r_f)+RP\).</li><li><b>Modelo de dividendos descontados (Gordon):</b> \(P_0=\dfrac{D_1}{K_e-g}\Rightarrow K_e=\dfrac{D_1}{P_0}+g\).</li><li><b>PER:</b> en una empresa sin crecimiento que reparte todo, \(K_e\approx 1/PER\).</li></ul>
<p>La <b>beta</b> mide el riesgo sistemático. Con deuda, el patrimonio es más riesgoso; la fórmula de Hamada ajusta la beta: \(\beta_L=\beta_U[1+(1-t)D/E]\). Para empresas sin cotización se usan betas de empresas comparables, desapalancadas y reapalancadas con la estructura propia.</p></section>
<section><h3>Costo de la deuda y de las acciones preferentes</h3><p>\(K_d\) es la tasa efectiva de los créditos o la TIR de los bonos; como los intereses son deducibles, el costo relevante es \(K_d(1-t)\). Las acciones preferentes cuestan \(K_p=D_p/P_p\) (sin escudo fiscal).</p></section>
${LAB}`,
qs:[{q:"Con rf = 5 %, β = 1,2 y prima de mercado de 6 %, ¿cuánto vale Ke según el CAPM?",a:"5 + 1,2 × 6 = 12,2 %."}]},

{id:"wacc", parte:P3, u:3, t:"Costo promedio ponderado de capital y estructura de capital", sim:"wacc", html:String.raw`
<section><h3>WACC</h3><div class="mj">\[WACC=\frac{E}{V}K_e+\frac{D}{V}K_d(1-t)+\frac{P}{V}K_p\]</div>
<p>Las ponderaciones deben ser a <b>valor de mercado</b> (o a la estructura objetivo), no en libros. El WACC es la tasa a la que se descuentan los flujos de caja libre de la empresa y la rentabilidad mínima que deben generar sus activos.</p></section>
<section><h3>Estructura de capital</h3><ul><li><b>Modigliani y Miller (1958), sin impuestos:</b> el valor no depende de la estructura; \(K_e\) sube linealmente con D/E y el WACC es constante.</li><li><b>MM con impuestos (1963):</b> \(V_L=V_U+tD\): el escudo fiscal hace que la deuda cree valor, y el WACC cae con más deuda.</li><li><b>Teoría del equilibrio (trade-off):</b> los costos de quiebra y de agencia crecen con la deuda; existe una estructura óptima donde el WACC es mínimo.</li><li><b>Jerarquía de preferencias</b> (Myers y Majluf): por asimetría de información, las empresas prefieren fondos internos, luego deuda y al final emitir acciones.</li></ul></section>
${LAB}`,
qs:[{q:"E = 600, D = 400, Ke = 15 %, Kd = 10 %, t = 35 %. ¿WACC?",a:"0,6 × 15 + 0,4 × 10 × 0,65 = 9 + 2,6 = 11,6 %."}]},

{id:"valor", parte:P4, u:4, t:"Creación de valor: EVA y rentabilidad del activo", sim:"eva", html:String.raw`
<section><h3>¿Cuándo se crea valor?</h3><p class="lead">Una empresa crea valor cuando la rentabilidad de su capital operativo (ROIC o RAN, rentabilidad del activo neto) supera su costo de capital. El <b>valor económico agregado</b> (EVA) de Stern Stewart lo mide en pesos:</p>
<div class="mj">\[EVA=UODI-WACC\cdot\text{Capital}=(ROIC-WACC)\cdot\text{Capital}\]</div>
<p>UODI (utilidad operativa después de impuestos, NOPAT) = UAII(1 − t). El capital es el activo neto operativo (KTNO + activos fijos). El <b>valor de mercado agregado</b> (MVA) es el valor presente de los EVA futuros: lo que la empresa vale por encima del capital invertido.</p></section>
<section><h3>Inductores de valor</h3><p>García organiza la gerencia del valor en <b>inductores</b>: margen EBITDA, productividad del capital de trabajo, productividad del activo fijo, palanca de crecimiento, y el diferencial ROIC − WACC. Crecer solo crea valor si ese diferencial es positivo: crecer con ROIC menor que el WACC destruye valor.</p></section>
${LAB}`,
qs:[{q:"Capital 1.000, ROIC 14 %, WACC 11 %. ¿EVA?",a:"(0,14 − 0,11) × 1.000 = 30."}]},

{id:"valoracion", parte:P4, u:4, t:"Valoración de empresas: flujo de caja descontado y múltiplos", sim:"dcf", html:String.raw`
<section><h3>Métodos</h3><ul><li><b>Basados en el balance:</b> valor en libros, valor de liquidación. No miran el futuro.</li><li><b>Múltiplos:</b> PER, valor empresa/EBITDA, precio/valor en libros de empresas comparables. Rápidos, pero dependen de la comparabilidad.</li><li><b>Flujo de caja descontado (FCD):</b> el más consistente con la teoría.</li></ul></section>
<section><h3>Flujo de caja libre descontado</h3><div class="mj">\[FCL_t=UODI_t+\text{Depreciación}_t-\text{Inversión en activos fijos}_t-\Delta KTNO_t\]</div>
<div class="mj">\[VE=\sum_{t=1}^{n}\frac{FCL_t}{(1+WACC)^t}+\frac{VT}{(1+WACC)^n},\qquad VT=\frac{FCL_{n+1}}{WACC-g}\]</div>
<p>El valor del patrimonio es el valor de la empresa menos la deuda financiera neta. El <b>valor terminal</b> suele pesar más del 60 % del total: la tasa de crecimiento de largo plazo \(g\) debe ser moderada (no mayor que el crecimiento nominal de la economía).</p></section>
${LAB}`,
qs:[{q:"Si el FCL del año 6 es 110, el WACC 12 % y g 4 %, ¿cuál es el valor terminal al final del año 5?",a:"110/(0,12 − 0,04) = 1.375."}]},

{id:"dividendos", parte:P5, u:5, t:"Política de dividendos", sim:"div", html:String.raw`
<section><h3>Cómo se pagan</h3><p class="lead">Dividendos en efectivo (ordinarios o extraordinarios), en acciones, y recompra de acciones. Fechas: decreto (asamblea), ex-dividendo (desde ahí la acción se negocia sin derecho), registro y pago. En Colombia la asamblea decide la distribución de utilidades.</p></section>
<section><h3>Teorías</h3><ul><li><b>Irrelevancia (Miller y Modigliani, 1961):</b> en mercados perfectos, el valor depende de la política de inversión, no de la de dividendos; el accionista puede fabricar su propio dividendo vendiendo acciones.</li><li><b>«Pájaro en mano»</b> (Gordon, Lintner): los inversionistas valoran más el dividendo cierto que la ganancia de capital incierta.</li><li><b>Efecto impuestos:</b> si los dividendos tributan más que las ganancias de capital, conviene recomprar.</li><li><b>Contenido informativo (señalización):</b> los aumentos de dividendos señalan confianza de la gerencia; los recortes, problemas.</li><li><b>Agencia:</b> pagar dividendos reduce el flujo de caja libre que los gerentes podrían desperdiciar (Jensen).</li><li><b>Efecto clientela:</b> cada política atrae a inversionistas con preferencias afines.</li></ul></section>
<section><h3>Modelo de Lintner (1956)</h3><div class="mj">\[D_t-D_{t-1}=c\,(pE_t-D_{t-1})\]</div><p>Las empresas tienen una razón de pago objetivo \(p\) y ajustan el dividendo solo una fracción \(c\) hacia ella cada año: los dividendos son más estables que las utilidades.</p></section>
${LAB}`,
qs:[{q:"Según MM (1961), ¿qué determina el valor de la empresa?",a:"Su política de inversión (los flujos que generan sus activos), no cómo los reparte."}]},

{id:"fusiones", parte:P6, u:6, t:"Fusiones y adquisiciones", sim:"fus", html:String.raw`
<section><h3>Tipos y motivos</h3><p class="lead">Fusiones horizontales (mismo sector), verticales (proveedor o cliente) y conglomerados. Motivos válidos: <b>sinergias</b> operativas (economías de escala y alcance, poder de mercado) y financieras (escudos fiscales, menor costo de capital), reemplazo de una gerencia ineficiente. Motivos dudosos: diversificar (el accionista puede hacerlo solo) o aumentar la UPA por «efecto arranque».</p></section>
<section><h3>¿Crea valor la adquisición?</h3><div class="mj">\[\text{Sinergia}=V_{AB}-(V_A+V_B)\qquad VPN_{comprador}=\text{Sinergia}-\text{Prima pagada}\]</div>
<p>Si se paga en efectivo, la prima es el precio pagado menos el valor de la empresa objetivo. Si se paga en acciones, los accionistas de la objetivo reciben una fracción de la empresa combinada y <b>comparten la sinergia</b>. La evidencia empírica muestra que casi toda la ganancia la capturan los accionistas de la empresa adquirida; los compradores, en promedio, apenas ganan o pierden.</p></section>
<section><h3>Reestructuración</h3><p>Escisiones, ventas de unidades, compras apalancadas (LBO) y cambios en la estructura societaria. En Colombia, las integraciones empresariales que superan ciertos umbrales requieren aviso o autorización de la Superintendencia de Industria y Comercio.</p></section>
${LAB}`,
qs:[{q:"VA = 500, VB = 200, VAB = 780 y se paga 250 en efectivo por B. ¿VPN para A?",a:"Sinergia 80, prima 50: VPN = 30."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"objetivo",links:["objetivo","wacc","dividendos"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"fusiones",links:["ciclo","wacc","valoracion"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"fusiones",links:["ciclo","costo-fuentes","wacc","valoracion"],sim:"hoja",html:WSBOX,d:"Las fórmulas del curso con su versión en Excel."}];
const ALIAS={};
const GL=[
{u:1,t:"Objetivo financiero",d:"Maximizar el valor de la empresa para sus propietarios."},
{u:1,t:"Relación de agencia",d:"Un principal delega decisiones en un agente con intereses propios e información privada."},
{u:1,t:"Costos de agencia",d:"Costos de supervisión más costos de vinculación más pérdida residual."},
{u:1,t:"Gobierno corporativo",d:"Reglas y órganos que protegen a accionistas y acreedores y alinean los intereses de la gerencia."},
{u:2,t:"KTNO",d:"Cartera más inventarios menos proveedores."},
{u:2,t:"Ciclo de conversión del efectivo",d:"Días de inventario más días de cartera menos días de proveedores."},
{u:2,t:"Productividad del capital de trabajo (PKT)",d:"KTNO dividido por ventas: capital de trabajo por peso vendido."},
{u:2,t:"Palanca de crecimiento",d:"Margen EBITDA dividido por PKT; si es menor que 1, crecer consume caja."},
{u:2,t:"Política agresiva",d:"Financiar parte de los activos permanentes con deuda de corto plazo."},
{u:2,t:"Factoring",d:"Venta de cartera a una entidad financiera para obtener liquidez."},
{u:2,t:"Lote económico (EOQ)",d:"Cantidad de pedido que minimiza los costos de pedir y mantener inventario: √(2DS/H)."},
{u:3,t:"Grado de apalancamiento operativo",d:"Margen de contribución dividido por UAII."},
{u:3,t:"Grado de apalancamiento financiero",d:"UAII dividido por UAII menos intereses."},
{u:3,t:"UAII de indiferencia",d:"Utilidad operativa a la que dos alternativas de financiación dan la misma UPA."},
{u:3,t:"CAPM",d:"Ke = rf + β(Rm − rf): el costo del patrimonio depende del riesgo sistemático."},
{u:3,t:"Beta apalancada (Hamada)",d:"βL = βU[1 + (1 − t)D/E]."},
{u:3,t:"Escudo fiscal",d:"Ahorro de impuestos por la deducibilidad de los intereses: t·D en MM con impuestos."},
{u:3,t:"WACC",d:"Costo promedio ponderado de las fuentes de financiación, con la deuda después de impuestos."},
{u:3,t:"Jerarquía de preferencias",d:"Se prefiere financiar con fondos internos, luego deuda y al final acciones (Myers y Majluf)."},
{u:4,t:"UODI (NOPAT)",d:"Utilidad operativa después de impuestos: UAII(1 − t)."},
{u:4,t:"EVA",d:"UODI menos el cargo por el capital: (ROIC − WACC)·Capital."},
{u:4,t:"MVA",d:"Valor presente de los EVA futuros."},
{u:4,t:"Flujo de caja libre",d:"UODI + depreciación − inversión en activos fijos − aumento del KTNO."},
{u:4,t:"Valor terminal",d:"Valor de los flujos posteriores al horizonte explícito: FCL(n+1)/(WACC − g)."},
{u:4,t:"Múltiplo EV/EBITDA",d:"Valor de la empresa dividido por el EBITDA; se usa con empresas comparables."},
{u:5,t:"Fecha ex-dividendo",d:"Desde ese día la acción se negocia sin derecho al dividendo decretado."},
{u:5,t:"Irrelevancia de los dividendos",d:"En mercados perfectos, la política de dividendos no cambia el valor (MM, 1961)."},
{u:5,t:"Modelo de Lintner",d:"El dividendo se ajusta gradualmente hacia una razón de pago objetivo."},
{u:5,t:"Señalización",d:"Cambios en dividendos transmiten información privada de la gerencia sobre las utilidades futuras."},
{u:6,t:"Sinergia",d:"Valor de la empresa combinada menos la suma de los valores separados."},
{u:6,t:"Prima de adquisición",d:"Precio pagado por la empresa objetivo menos su valor independiente."},
{u:6,t:"Compra apalancada (LBO)",d:"Adquisición financiada en su mayor parte con deuda garantizada por los activos de la empresa comprada."}];
const MCQ=[
{u:1,q:"El objetivo financiero de la empresa es:",o:["Maximizar las utilidades contables","Maximizar las ventas","Maximizar el valor para los propietarios","Minimizar los costos"],ok:2,e:"El valor incorpora tiempo, riesgo e inversión."},
{u:1,q:"Si el gerente pasa a tener menos acciones de la empresa, según Jensen y Meckling sus beneficios privados:",o:["Disminuyen","Aumentan","No cambian","Desaparecen"],ok:1,e:"Soporta una fracción menor de su costo."},
{u:2,q:"Días de inventario 50, de cartera 40 y de proveedores 35. El ciclo de efectivo es:",o:["125","55","25","90"],ok:1,e:"50 + 40 − 35 = 55."},
{u:2,q:"Si la palanca de crecimiento es 0,7, al crecer la empresa:",o:["Genera caja","Demanda caja","No cambia su caja","Crea valor siempre"],ok:1,e:"PDC < 1: el margen EBITDA no alcanza a financiar el capital de trabajo adicional."},
{u:2,q:"El costo efectivo anual de no tomar un descuento 2/10 neto 30 es aproximadamente:",o:["2 %","24 %","45 %","10 %"],ok:2,e:"(1 + 0,02/0,98)^(365/20) − 1 ≈ 44,6 %."},
{u:3,q:"Con GAO = 2 y GAF = 1,5, si las ventas caen 10 % la UPA cae:",o:["10 %","20 %","30 %","15 %"],ok:2,e:"GAT = 3: 3 × 10 % = 30 %."},
{u:3,q:"Según MM con impuestos, el valor de la empresa apalancada es:",o:["VU","VU + tD","VU − tD","VU·(1 − t)"],ok:1,e:"El escudo fiscal de la deuda vale tD."},
{u:3,q:"Al aumentar la deuda, la beta del patrimonio:",o:["Baja","Sube","No cambia","Se vuelve cero"],ok:1,e:"Hamada: βL = βU[1 + (1 − t)D/E]."},
{u:3,q:"En el WACC, el costo de la deuda se toma:",o:["Antes de impuestos","Después de impuestos","Como la tasa libre de riesgo","Igual al Ke"],ok:1,e:"Los intereses son deducibles: Kd(1 − t)."},
{u:3,q:"Una acción paga un dividendo esperado de 300, vale 5.000 y crece al 4 %. Su Ke según Gordon es:",o:["6 %","10 %","4 %","8 %"],ok:1,e:"300/5.000 + 4 % = 10 %."},
{u:4,q:"Una empresa crea valor cuando:",o:["Tiene utilidad neta positiva","Su ROIC supera su WACC","Crece en ventas","Paga dividendos"],ok:1,e:"El diferencial ROIC − WACC positivo da EVA positivo."},
{u:4,q:"El flujo de caja libre NO resta:",o:["La inversión en activos fijos","El aumento del KTNO","Los intereses","Los impuestos operativos"],ok:2,e:"El FCL es antes de financiación; los intereses se reflejan en el WACC."},
{u:4,q:"Si g se acerca al WACC, el valor terminal:",o:["Tiende a cero","Se dispara","No cambia","Se vuelve negativo"],ok:1,e:"El denominador WACC − g tiende a cero."},
{u:5,q:"Según la teoría de la señalización, un aumento inesperado del dividendo:",o:["Baja el precio","Sube el precio","No afecta","Aumenta la deuda"],ok:1,e:"Transmite confianza en las utilidades futuras."},
{u:5,q:"En el modelo de Lintner, un c bajo significa que los dividendos:",o:["Se ajustan rápido","Son muy estables","Son cero","Siguen exactamente a las utilidades"],ok:1,e:"Se ajustan lentamente hacia el objetivo."},
{u:6,q:"Si se paga una adquisición con acciones, la sinergia:",o:["Queda toda para el comprador","Se comparte con los accionistas de la adquirida","Desaparece","Se convierte en deuda"],ok:1,e:"Los accionistas de la objetivo reciben parte de la empresa combinada."},
{u:6,q:"La evidencia muestra que las ganancias de las fusiones las capturan sobre todo:",o:["Los compradores","Los accionistas de la empresa adquirida","Los bancos","El Estado"],ok:1,e:"Por la prima de adquisición."}];
const ABIERTAS=[
{u:1,q:"Explica los conflictos de agencia entre accionistas y acreedores y cómo se mitigan.",a:["Sustitución de activos hacia proyectos riesgosos; subinversión; dilución con nueva deuda.","Mitigación: cláusulas contractuales (covenants), garantías, deuda de corto plazo, convertibles."]},
{u:3,q:"¿Existe una estructura de capital óptima? Compara MM con la teoría del equilibrio y la jerarquía de preferencias.",a:["MM sin impuestos: irrelevancia; con impuestos: 100 % deuda.","Equilibrio: escudo fiscal frente a costos de quiebra y agencia ⟹ óptimo interior.","Jerarquía: no hay óptimo; la deuda refleja la necesidad de fondos externos.","Evidencia y ejemplos colombianos."]},
{u:4,q:"¿Por qué una empresa rentable puede destruir valor al crecer?",a:["Si ROIC < WACC, cada peso invertido tiene EVA negativo.","Si PDC < 1, crecer consume caja y obliga a endeudarse.","Inductores: margen EBITDA, PKT, productividad del activo fijo."]},
{u:5,q:"Discute la relevancia de la política de dividendos.",a:["MM: irrelevancia bajo mercados perfectos.","Imperfecciones: impuestos, costos de emisión, asimetría de información, agencia, clientela.","Evidencia: estabilidad (Lintner), reacción del precio a los anuncios.","Recompras como alternativa."]}];
