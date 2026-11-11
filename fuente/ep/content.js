// =====================================================================
// CONTENIDO: Evaluación de Proyectos (1503750, U. de Antioquia).
// Bibliografía del programa: Sapag (2004), Mokate (1998), Miranda (2003), Ortegón et al. (ILPES, 2005),
// Cohen y Franco (1997), Rosillo (2008), Arboleda (2003), Coss Bu (2000), metodología MGA del DNP.
// =====================================================================
const GUIA_ID="ep";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Generalidades y marco lógico",2:"Unidad 2 · Mercado y sector",3:"Unidad 3 · Estudio técnico",4:"Unidad 4 · Administrativo, legal y ambiental",5:"Unidad 5 · Financiero y riesgo"};
const P1="Unidad 1 · Introducción y generalidades del proyecto",P2="Unidad 2 · Estudios del mercado y del sector",P3="Unidad 3 · Estudio técnico",P4="Unidad 4 · Estudios administrativo, legal y ambiental",P5="Unidad 5 · Estudio financiero y de riesgo";
const TRUNK=[
{id:"ciclo", parte:P1, u:1, t:"El proyecto y su ciclo", sim:"tarjetas", html:String.raw`
<section><h3>¿Qué es un proyecto?</h3><p class="lead">Un proyecto de inversión es un conjunto de actividades con un objetivo definido, recursos limitados y un horizonte de tiempo, que busca resolver un problema o aprovechar una oportunidad. Se <b>evalúa</b> comparando la situación <b>con</b> proyecto y <b>sin</b> proyecto: solo cuentan los flujos incrementales.</p>
<p>Clasificación: según el sector (agropecuario, industrial, servicios, infraestructura social), según quién invierte (privado o público), según su objetivo (creación de una empresa, ampliación, reemplazo, modernización, abandono) y según su naturaleza (productivos, de infraestructura, sociales).</p></section>
<section><h3>El ciclo del proyecto</h3><ol><li><b>Preinversión</b>: identificación de la idea, perfil, prefactibilidad y factibilidad. Cada nivel profundiza los estudios y reduce la incertidumbre; en cada uno se decide si seguir, reformular o abandonar.</li><li><b>Inversión</b> o ejecución: diseño definitivo, financiación, construcción y puesta en marcha.</li><li><b>Operación</b>: el proyecto genera los bienes o servicios y los beneficios previstos.</li><li><b>Evaluación ex post</b>: se mide si se lograron los objetivos y qué se aprendió.</li></ol>
<p>Los estudios de la formulación son: mercado, técnico, administrativo y legal, ambiental, y financiero, que los integra en flujos de caja para la evaluación.</p></section>
<section><h3>Metodologías oficiales</h3><p>En Colombia, los proyectos de inversión pública se formulan con la <b>Metodología General Ajustada (MGA)</b> del Departamento Nacional de Planeación y se registran en el <b>Banco de Programas y Proyectos de Inversión Nacional (BPIN)</b>. La MGA sigue la lógica del marco lógico: identificación del problema, preparación de alternativas, evaluación y programación.</p></section>
${LAB}`},

{id:"marco", parte:P1, u:1, t:"La metodología del marco lógico", sim:"mlog", html:String.raw`
<section><h3>Cinco pasos</h3><ol><li><b>Análisis de participantes</b> (involucrados): quiénes son afectados o pueden afectar el proyecto, sus intereses, recursos y mandatos.</li><li><b>Análisis de problemas</b>: se identifica el problema central y se construye el <b>árbol de problemas</b>, con las causas como raíces y los efectos como ramas.</li><li><b>Análisis de objetivos</b>: el árbol de problemas se convierte en <b>árbol de objetivos</b> redactando cada situación negativa como una positiva alcanzada: las causas pasan a ser medios y los efectos, fines.</li><li><b>Análisis de alternativas</b>: se agrupan los medios en estrategias y se eligen con criterios (costo, viabilidad técnica, impacto, riesgo).</li><li><b>Matriz de planificación</b> (matriz de marco lógico).</li></ol></section>
<section><h3>La matriz de marco lógico</h3><p>Cuatro filas (Fin, Propósito, Componentes, Actividades) y cuatro columnas (resumen narrativo, indicadores, medios de verificación y supuestos).</p><ul><li><b>Lógica vertical</b>: si se realizan las actividades y se cumplen sus supuestos, se producen los componentes; si se producen los componentes y se cumplen sus supuestos, se logra el propósito; y el propósito contribuye al fin.</li><li><b>Lógica horizontal</b>: cada objetivo tiene indicadores medibles (cantidad, calidad, tiempo, lugar) y medios de verificación para comprobarlos.</li><li>Los <b>supuestos</b> son condiciones fuera del control del proyecto que deben cumplirse para que funcione.</li></ul></section>
${LAB}`},

{id:"mercado", parte:P2, u:2, t:"Entorno, sector y estudio de mercado", sim:"demanda", html:String.raw`
<section><h3>Análisis del entorno y del sector</h3><p class="lead">El análisis <b>PESTEL</b> revisa factores políticos, económicos, sociales, tecnológicos, ecológicos y legales. El análisis <b>estructural del sector</b> de Porter estudia las cinco fuerzas competitivas: rivalidad entre competidores, amenaza de entrantes, amenaza de sustitutos, poder de negociación de los clientes y de los proveedores.</p></section>
<section><h3>Estudio de mercado</h3><ul><li><b>Producto</b>: clasificación del bien (consumo, intermedio, de capital; durable o no) y etapa del ciclo de vida (introducción, crecimiento, madurez, declive).</li><li><b>Demanda</b>: quién compra, cuánto, a qué precio; elasticidades precio, ingreso y cruzada. Métodos de estimación: series de tiempo (tendencia lineal, exponencial, promedios móviles), modelos causales (regresión con variables como ingreso y precio), métodos cualitativos (Delphi, encuestas, consenso de expertos).</li><li><b>Oferta</b>: competidores, capacidad instalada, importaciones. La <b>demanda insatisfecha</b> es la diferencia proyectada entre demanda y oferta.</li><li><b>Precios</b>: fijación con base en costos (costo más margen), en la competencia o en el valor percibido; política de precios.</li><li><b>Comercialización</b>: canales de distribución, intensidad (intensiva, selectiva, exclusiva), promoción y publicidad, y el presupuesto de la mezcla de mercadeo.</li></ul></section>
<section><h3>Proyección con tendencia</h3><div class="mj">\[\hat Q_t=a+bt\qquad b=\frac{n\sum tQ-\sum t\sum Q}{n\sum t^2-(\sum t)^2}\qquad a=\bar Q-b\bar t\]</div><p>Una tendencia exponencial \(Q_t=Ae^{rt}\) se estima con la misma regresión sobre \(\ln Q\). Se elige el ajuste con mejor \(R^2\) y sentido económico, y la proyección se hace con prudencia: más lejos, más incertidumbre.</p></section>
${LAB}`},

{id:"tecnico", parte:P3, u:3, t:"Tamaño, localización y costos", sim:"loc", html:String.raw`
<section><h3>Ingeniería del proyecto</h3><p class="lead">Define el proceso productivo, la tecnología, los equipos, las instalaciones, las materias primas y el personal. De ahí salen las inversiones fijas y los costos de operación.</p></section>
<section><h3>Tamaño</h3><p>El tamaño es la capacidad de producción en un periodo. Lo condicionan la demanda, la disponibilidad de insumos, la tecnología (tamaños mínimos), la financiación y las economías de escala. Una relación útil es la de Lange: la inversión crece menos que proporcionalmente con la capacidad, \(I_1=I_0\,(T_1/T_0)^\alpha\) con \(\alpha<1\) (a menudo cerca de 0,6).</p></section>
<section><h3>Localización</h3><p>Macrolocalización (región) y microlocalización (sitio). Factores: cercanía al mercado y a las materias primas, transporte, mano de obra, servicios públicos, impuestos y normas, clima. Métodos: <b>cualitativo por puntos</b> (factores con pesos que suman 1 y calificaciones; se elige la mayor suma ponderada), Brown-Gibson (combina factores objetivos de costo y subjetivos) y centro de gravedad.</p></section>
<section><h3>Costos y punto de equilibrio</h3><p>Costos fijos (no varían con la producción en el corto plazo) y variables. El <b>punto de equilibrio</b> es el volumen en el que los ingresos cubren todos los costos:</p>
<div class="mj">\[Q_{PE}=\frac{CF}{P-CVu}\qquad \text{en pesos: }\ \frac{CF}{1-CVu/P}\]</div>
<p>Con varios productos se usa el <b>margen de contribución ponderado</b> por la mezcla de ventas: \(Q_{PE}=CF/\sum_i w_i(P_i-CVu_i)\), y luego se reparte según la mezcla.</p></section>
${LAB}`},

{id:"pe", parte:P3, u:3, t:"Puntos de equilibrio con uno y varios productos", sim:"pe", html:String.raw`
<section><h3>Margen de contribución</h3><p class="lead">El margen de contribución unitario \(P-CVu\) es lo que cada unidad aporta para cubrir los costos fijos. La razón de contribución \(1-CVu/P\) es la proporción de cada peso de ventas que queda para cubrir los costos fijos.</p></section>
<section><h3>Margen de seguridad y apalancamiento</h3><p>El <b>margen de seguridad</b> es cuánto pueden caer las ventas antes de llegar al punto de equilibrio: \((Q-Q_{PE})/Q\). El <b>grado de apalancamiento operativo</b>, \(GAO=\frac{Q(P-CVu)}{Q(P-CVu)-CF}\), indica cuánto cambia porcentualmente la utilidad operativa por cada 1 % de cambio en las ventas; es el inverso del margen de seguridad.</p></section>
<section><h3>Por líneas de producto</h3><p>Cuando hay costos fijos propios de cada línea y costos fijos comunes, se calcula primero el equilibrio de cada línea con sus fijos directos y después el de la empresa con los comunes. Con una mezcla de ventas fija, el equilibrio en unidades se reparte según las proporciones de la mezcla.</p></section>
${LAB}`},

{id:"ambiental", parte:P4, u:4, t:"Estudios administrativo, legal y ambiental", sim:"conesa", html:String.raw`
<section><h3>Estudio legal</h3><p class="lead">Revisa la forma jurídica (sociedad por acciones simplificada, limitada, anónima, cooperativa), la legislación comercial, laboral (costos de nómina y prestaciones, ver Derecho Laboral), tributaria (renta, IVA, industria y comercio), ambiental, de contratación y de uso del suelo (POT).</p></section>
<section><h3>Estudio administrativo</h3><p>Estructura organizacional para la ejecución (gerencia del proyecto, interventoría) y para la operación (organigrama, cargos, perfiles, salarios). Gestiones para la sostenibilidad: alianzas con otras entidades y tipos de contratos para ejecutar (llave en mano, administración delegada, precios unitarios, concesión).</p></section>
<section><h3>Estudio ambiental</h3><p>Diagnóstico de la línea base, identificación de impactos (matriz de Leopold: acciones del proyecto frente a componentes ambientales), evaluación y calificación de los impactos, y plan de manejo (prevención, mitigación, corrección, compensación) con seguimiento y control. En Colombia, ciertos proyectos requieren licencia ambiental.</p><p>La <b>metodología de Conesa</b> califica la importancia de cada impacto:</p>
<div class="mj">\[I=\pm\,(3\,IN+2\,EX+MO+PE+RV+SI+AC+EF+PR+MC)\]</div>
<p>IN: intensidad; EX: extensión; MO: momento; PE: persistencia; RV: reversibilidad; SI: sinergia; AC: acumulación; EF: efecto; PR: periodicidad; MC: recuperabilidad. Con valores entre 13 y 100: menor que 25 irrelevante, de 25 a 50 moderado, de 50 a 75 severo y mayor que 75 crítico.</p></section>
${LAB}`},

{id:"riesgo", parte:P5, u:5, t:"Administración del riesgo", sim:"matriz", html:String.raw`
<section><h3>El proceso</h3><p class="lead">La administración del riesgo (Mejía, 2006; norma ISO 31000) tiene cinco pasos: <b>identificar</b> los riesgos (de mercado, técnicos, financieros, legales, ambientales, sociales), <b>calificarlos</b> por probabilidad e impacto, <b>evaluarlos</b> en un mapa de calor, <b>tratarlos</b> (evitar, reducir, transferir con seguros o contratos, retener) y <b>monitorearlos</b> con responsables y acciones de control.</p></section>
<section><h3>Mapa de riesgos</h3><p>El nivel de riesgo es probabilidad × impacto (cada uno en una escala de 1 a 5). Los riesgos se ubican en zonas: baja (aceptar), moderada (reducir o vigilar), alta (reducir o transferir) y extrema (evitar o tratar de inmediato). El <b>riesgo residual</b> es el que queda después de los controles.</p></section>
${LAB}`},

{id:"financiero", parte:P5, u:5, t:"Estudio financiero y flujos de caja", sim:"flujo", html:String.raw`
<section><h3>Presupuestos</h3><p class="lead">El estudio financiero ordena la información de los demás estudios: proyección de ventas, presupuesto de costos y gastos, presupuesto de inversiones (activos fijos, diferidos y <b>capital de trabajo</b>), plan de financiación y estados financieros proyectados.</p></section>
<section><h3>Flujo de caja libre del proyecto</h3><p>Mide la capacidad del proyecto de generar efectivo, sin importar cómo se financia:</p>
<div class="mj">\[FCL=\text{UAII}\,(1-t)+\text{depreciación}-\text{inversión en activos}-\Delta KT+\text{valor de salvamento}\]</div>
<p>Se descuenta con el costo de capital del proyecto (el WACC si mantiene la estructura de financiación de la empresa).</p></section>
<section><h3>Flujo de caja del inversionista (del patrimonio)</h3><p>Agrega la financiación: se suma el préstamo recibido, se restan los intereses (con su ahorro de impuestos) y las amortizaciones de capital. Se descuenta con el costo del patrimonio. La diferencia entre el VPN del inversionista y el del proyecto es el valor que crea el apalancamiento.</p></section>
<section><h3>Criterios de evaluación</h3><ul><li><b>VPN</b> > 0: el proyecto rinde más que la tasa de descuento.</li><li><b>TIR</b>: tasa que hace el VPN igual a 0; puede no ser única si los flujos cambian de signo más de una vez.</li><li><b>TIRM</b>: reinvierte los flujos positivos a una tasa de reinversión y financia los negativos a otra; evita TIR múltiples.</li><li><b>Relación beneficio/costo</b>: VP de beneficios / VP de costos.</li><li><b>Periodo de recuperación descontado (PRI)</b>.</li><li><b>Costo anual equivalente (CAE)</b>: para comparar alternativas de vidas distintas.</li></ul></section>
${LAB}`},

{id:"varianza", parte:P5, u:5, t:"Riesgo en el VPN: media y varianza", sim:"hillier", html:String.raw`
<section><h3>El VPN como variable aleatoria</h3><p class="lead">Si los flujos son inciertos, el VPN también lo es. Con flujos de valor esperado \(\mu_t\) y desviación \(\sigma_t\):</p>
<div class="mj">\[E[VPN]=\sum_{t=0}^{n}\frac{\mu_t}{(1+i)^t}\]</div>
<div class="mj">\[\text{flujos independientes: }\ \sigma^2_{VPN}=\sum_{t=0}^{n}\frac{\sigma_t^2}{(1+i)^{2t}}\qquad\text{perfectamente correlacionados: }\ \sigma_{VPN}=\sum_{t=0}^{n}\frac{\sigma_t}{(1+i)^t}\]</div>
<p>Con el teorema central del límite (Hillier), el VPN se aproxima a una normal, y se puede calcular la probabilidad de que sea negativo: \(P(VPN<0)=\Phi(-E[VPN]/\sigma_{VPN})\). La <b>simulación de Monte Carlo</b> generaliza esto: se sortean las variables de entrada (precio, cantidad, costos) de sus distribuciones y se obtiene la distribución del VPN.</p></section>
<section><h3>Sensibilidad y escenarios</h3><p>El <b>análisis de sensibilidad</b> cambia una variable a la vez para ver cuánto mueve el VPN y encontrar su valor crítico (el que hace VPN = 0). El de <b>escenarios</b> cambia varias a la vez (pesimista, probable, optimista).</p></section>
${LAB}`},

{id:"social", parte:P5, u:5, t:"Evaluación económica y social", sim:"social", html:String.raw`
<section><h3>Tres evaluaciones</h3><ul><li><b>Financiera (privada)</b>: flujos a precios de mercado desde el punto de vista del inversionista.</li><li><b>Económica</b>: costos y beneficios para toda la sociedad, a <b>precios sombra</b> o de cuenta, que corrigen distorsiones (impuestos, subsidios, aranceles, salario mínimo por encima del costo de oportunidad, tipo de cambio). Los impuestos y subsidios son transferencias, no costos para la sociedad.</li><li><b>Social</b>: además pondera la distribución (quién gana y quién pierde) y los efectos no mercantiles (externalidades, tiempo ahorrado, vidas, medio ambiente).</li></ul></section>
<section><h3>Razones precio cuenta</h3><p>El precio de cuenta de cada partida es su precio de mercado multiplicado por una <b>razón precio cuenta</b> (RPC). Ejemplos típicos: mano de obra no calificada con RPC menor que 1 (su costo de oportunidad es menor que el salario si hay desempleo), divisas con RPC mayor que 1 si el tipo de cambio está subvaluado por aranceles. El flujo económico se descuenta con la <b>tasa social de descuento</b>, que fija el DNP para los proyectos públicos colombianos.</p>
<p>Un proyecto puede ser malo financieramente y bueno socialmente (una vía rural) o al revés (un negocio protegido por aranceles).</p></section>
${LAB}`}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"ciclo",links:["ciclo","marco","financiero"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"social",links:["marco","tecnico","financiero","social"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"social",links:["marco","mercado","financiero"],sim:"abiertas",html:WSBOX,d:"Preguntas de desarrollo con esquema de respuesta."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"social",links:["tecnico","pe","financiero","varianza"],sim:"hoja",html:WSBOX,d:"Fórmulas del curso con su versión en Excel."}];
const ALIAS={};
const GL=[
{u:1,t:"Proyecto de inversión",d:"Conjunto de actividades con objetivo, recursos y plazo definidos para resolver un problema o aprovechar una oportunidad."},
{u:1,t:"Situación sin proyecto",d:"Lo que pasaría si no se ejecuta; la base para medir los flujos incrementales."},
{u:1,t:"Preinversión",d:"Etapa de estudios (perfil, prefactibilidad, factibilidad) antes de comprometer la inversión."},
{u:1,t:"MGA",d:"Metodología General Ajustada del DNP para formular proyectos de inversión pública."},
{u:1,t:"BPIN",d:"Banco de Programas y Proyectos de Inversión Nacional."},
{u:1,t:"Árbol de problemas",d:"Diagrama con el problema central, sus causas (raíces) y sus efectos (ramas)."},
{u:1,t:"Árbol de objetivos",d:"El árbol de problemas redactado en positivo: medios y fines."},
{u:1,t:"Lógica vertical",d:"Actividades → componentes → propósito → fin, cada paso con sus supuestos."},
{u:1,t:"Lógica horizontal",d:"Cada objetivo con indicadores medibles y medios de verificación."},
{u:1,t:"Supuestos",d:"Condiciones fuera del control del proyecto que deben cumplirse para su éxito."},
{u:2,t:"PESTEL",d:"Análisis del entorno: político, económico, social, tecnológico, ecológico y legal."},
{u:2,t:"Cinco fuerzas de Porter",d:"Rivalidad, entrantes, sustitutos, poder de clientes y de proveedores."},
{u:2,t:"Demanda insatisfecha",d:"Demanda proyectada que la oferta existente no cubre."},
{u:2,t:"Ciclo de vida del producto",d:"Introducción, crecimiento, madurez y declive."},
{u:2,t:"Método Delphi",d:"Consulta iterativa y anónima a expertos hasta lograr consenso."},
{u:3,t:"Tamaño",d:"Capacidad de producción del proyecto en un periodo."},
{u:3,t:"Factor de escala (Lange)",d:"Exponente α < 1 en I₁ = I₀(T₁/T₀)^α."},
{u:3,t:"Método cualitativo por puntos",d:"Localización elegida por la mayor suma ponderada de calificaciones de factores."},
{u:3,t:"Punto de equilibrio",d:"Volumen en que los ingresos igualan los costos totales: Q = CF/(P − CVu)."},
{u:3,t:"Margen de contribución",d:"Precio menos costo variable unitario."},
{u:3,t:"Margen de seguridad",d:"Proporción en que pueden caer las ventas antes del punto de equilibrio."},
{u:4,t:"Matriz de Leopold",d:"Cruce de acciones del proyecto con componentes ambientales para identificar impactos."},
{u:4,t:"Importancia del impacto (Conesa)",d:"I = ±(3IN + 2EX + MO + PE + RV + SI + AC + EF + PR + MC)."},
{u:4,t:"Plan de manejo ambiental",d:"Medidas de prevención, mitigación, corrección y compensación con seguimiento."},
{u:5,t:"Riesgo residual",d:"Riesgo que permanece después de aplicar los controles."},
{u:5,t:"Capital de trabajo",d:"Recursos para operar el ciclo productivo; se invierte al inicio y se recupera al final."},
{u:5,t:"Valor de salvamento",d:"Valor de los activos al final del horizonte de evaluación."},
{u:5,t:"Flujo de caja libre",d:"UAII(1 − t) + depreciación − inversiones − ΔKT."},
{u:5,t:"Flujo del inversionista",d:"FCL más préstamo menos intereses netos de impuestos y amortizaciones."},
{u:5,t:"TIRM",d:"TIR modificada con tasas explícitas de reinversión y financiación."},
{u:5,t:"CAE",d:"Costo anual equivalente: VP de costos convertido en una anualidad."},
{u:5,t:"Valor crítico",d:"Valor de una variable que hace el VPN igual a cero."},
{u:5,t:"Precio sombra",d:"Valor de un bien o factor para la sociedad, corregido por distorsiones."},
{u:5,t:"Razón precio cuenta",d:"Factor que convierte un precio de mercado en precio de cuenta."},
{u:5,t:"Tasa social de descuento",d:"Tasa con la que se descuentan los flujos económicos de los proyectos públicos."}];
const MCQ=[
{u:1,q:"Para evaluar un proyecto se comparan:",o:["Ingresos y egresos totales de la empresa","Las situaciones con proyecto y sin proyecto","El año de inicio y el final","Los presupuestos de dos áreas"],ok:1,e:"Solo los flujos incrementales importan."},
{u:1,q:"En el árbol de objetivos, las causas del árbol de problemas se convierten en:",o:["Fines","Medios","Supuestos","Indicadores"],ok:1,e:"Los efectos pasan a ser fines."},
{u:1,q:"En la matriz de marco lógico, los supuestos son:",o:["Metas del proyecto","Condiciones fuera del control del proyecto","Indicadores de impacto","Costos ocultos"],ok:1,e:"Se ubican en la cuarta columna."},
{u:1,q:"El orden de la lógica vertical, de abajo hacia arriba, es:",o:["Fin, propósito, componentes, actividades","Actividades, componentes, propósito, fin","Componentes, actividades, fin, propósito","Propósito, fin, actividades, componentes"],ok:1,e:"Cada nivel produce el siguiente."},
{u:2,q:"La demanda insatisfecha es:",o:["La demanda total proyectada","La diferencia entre demanda y oferta proyectadas","La demanda de los no clientes","Las ventas perdidas por precio"],ok:1,e:"Es el mercado potencial del proyecto."},
{u:2,q:"¿Cuál NO es una de las cinco fuerzas de Porter?",o:["Amenaza de sustitutos","Poder de los proveedores","Tasa de interés","Rivalidad entre competidores"],ok:2,e:"La tasa de interés es un factor del entorno."},
{u:3,q:"Con CF = 50 000, P = 30 y CVu = 20, el punto de equilibrio es:",o:["1 667 unidades","2 500 unidades","5 000 unidades","50 000 unidades"],ok:2,e:"50 000/(30 − 20) = 5 000."},
{u:3,q:"Si la inversión de una planta de 1 000 unidades es 400 y el factor de escala es 0,6, una de 2 000 unidades cuesta aproximadamente:",o:["800","606","400","1 000"],ok:1,e:"400·2^0,6 ≈ 606."},
{u:3,q:"En el método cualitativo por puntos se elige el sitio con:",o:["Menor costo de transporte","Mayor suma ponderada de calificaciones","Mayor número de factores","Menor puntaje"],ok:1,e:"Los pesos suman 1."},
{u:3,q:"Un GAO de 4 significa que si las ventas suben 10 %, la utilidad operativa:",o:["Sube 4 %","Sube 40 %","Sube 2,5 %","No cambia"],ok:1,e:"GAO × cambio de ventas."},
{u:4,q:"En la metodología de Conesa, un impacto con importancia 60 es:",o:["Irrelevante","Moderado","Severo","Crítico"],ok:2,e:"Entre 50 y 75."},
{u:4,q:"La matriz de Leopold sirve para:",o:["Calcular el VPN","Identificar impactos cruzando acciones y componentes ambientales","Elegir la localización","Estimar la demanda"],ok:1,e:"Es una matriz causa-efecto."},
{u:5,q:"En el flujo de caja libre NO se incluyen:",o:["La depreciación","Los intereses de la deuda","La inversión en capital de trabajo","El valor de salvamento"],ok:1,e:"La financiación va en el flujo del inversionista."},
{u:5,q:"La depreciación se suma en el flujo de caja porque:",o:["Es un ingreso","No es un desembolso, pero reduce los impuestos","Es una inversión","La exige la ley"],ok:1,e:"Escudo fiscal."},
{u:5,q:"El capital de trabajo invertido al inicio:",o:["Se pierde","Se recupera al final del horizonte","Se deprecia","Se paga como dividendo"],ok:1,e:"Se suma en el último periodo."},
{u:5,q:"Para comparar dos máquinas con vidas distintas conviene usar:",o:["TIR","CAE","PRI","B/C"],ok:1,e:"Lleva los costos a anualidades comparables."},
{u:5,q:"Con flujos independientes, la varianza del VPN es:",o:["Σσₜ/(1+i)ᵗ","Σσₜ²/(1+i)²ᵗ","(Σσₜ)²","Σσₜ²"],ok:1,e:"Suma de varianzas descontadas al cuadrado."},
{u:5,q:"En la evaluación económica, los impuestos que paga el proyecto son:",o:["Un costo para la sociedad","Una transferencia que no se cuenta como costo","Un beneficio","Un costo de oportunidad"],ok:1,e:"Pasan de un agente a otro."},
{u:5,q:"Si hay desempleo, la RPC de la mano de obra no calificada suele ser:",o:["Mayor que 1","Igual a 1","Menor que 1","Cero siempre"],ok:2,e:"Su costo de oportunidad es menor que el salario."},
{u:5,q:"Transferir un riesgo significa:",o:["Eliminar la actividad","Pasarlo a otro con seguros o contratos","Aceptarlo","Ignorarlo"],ok:1,e:"Una de las cuatro estrategias."}];
const ABIERTAS=[
{u:1,q:"Construya el árbol de problemas y la matriz de marco lógico para un proyecto de su interés.",a:["Problema central redactado como situación negativa, no como falta de una solución.","Tres causas y tres efectos.","Árbol de objetivos y alternativa elegida.","Matriz con fin, propósito, componentes, actividades, indicadores, medios y supuestos."]},
{u:2,q:"Explique cómo estimaría la demanda de un producto nuevo para el que no hay datos históricos.",a:["Métodos cualitativos: encuestas, Delphi, grupos focales.","Analogía con productos similares.","Variables causales: población objetivo, ingreso, precio.","Demanda insatisfecha frente a la oferta."]},
{u:3,q:"¿Qué factores determinan el tamaño óptimo de un proyecto y cómo se relacionan con la localización?",a:["Demanda, insumos, tecnología, financiación, economías de escala.","Factor de escala de la inversión.","Costos de transporte y su efecto en el tamaño.","Métodos de localización."]},
{u:5,q:"Explique la diferencia entre el flujo de caja del proyecto y el del inversionista, y con qué tasa se descuenta cada uno.",a:["FCL: sin financiación, con WACC o costo del proyecto.","Flujo del inversionista: préstamo, intereses netos y amortizaciones, con costo del patrimonio.","Escudo fiscal de los intereses.","Valor del apalancamiento."]},
{u:5,q:"¿Por qué un proyecto puede ser rentable financieramente pero no socialmente, y al revés? Dé ejemplos.",a:["Precios de mercado frente a precios sombra.","Transferencias (impuestos, subsidios, aranceles).","Externalidades.","Ejemplos: vía rural, industria protegida."]}];
const TL=[];
