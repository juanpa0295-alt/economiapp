// Economía Ambiental · contenido de la ruta (programa 1503807)
// =====================================================================
// CONTENIDO: Opción I · Economía Ambiental (1503807, U. de Antioquia).
// Bibliografía del programa: Azqueta (2007, 1994), Alviar (1997), Dasgupta y Mäler, Bateman et al. (2003),
// Field y Field, Tietenberg, Perman et al.
// =====================================================================
const GUIA_ID="ea";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Módulo 1 · Introducción",2:"Módulo 2 · Cambios en el bienestar",3:"Módulo 3 · Recursos no renovables",4:"Módulo 4 · Recursos renovables",5:"Módulo 5 · Fallas del mercado",6:"Módulo 6 · Valoración"};
const P1="Módulo 1 · Introducción",P2="Módulo 2 · Cambios en el bienestar",P3="Módulo 3 · Los recursos no renovables",P4="Módulo 4 · Los recursos renovables",P5="Módulo 5 · Fallas del mercado",P6="Módulo 6 · Valoración económica de la calidad ambiental";
const TRUNK=[
{id:"intro", parte:P1, u:1, t:"Economía ambiental, sostenibilidad y cambio climático", sim:"tiempo", html:String.raw`
<section><h3>¿Qué estudia?</h3><p class="lead">La economía ambiental estudia cómo asignar el medio ambiente, que provee recursos, absorbe residuos y ofrece servicios directos (paisaje, biodiversidad, regulación del clima), cuando el mercado no le pone precio. Se distingue de la <b>economía ecológica</b>, que ve la economía como un subsistema de la biosfera sujeto a límites físicos (leyes de la termodinámica), y de la <b>economía de los recursos naturales</b>, centrada en la explotación óptima en el tiempo.</p></section>
<section><h3>Sostenibilidad débil y fuerte</h3><ul><li><b>Débil</b> (Solow, Hartwick): basta con mantener el capital total (producido, humano y natural); el capital natural se puede sustituir. Regla de Hartwick: invertir las rentas de los recursos no renovables en capital producido.</li><li><b>Fuerte</b> (Daly): ciertos capitales naturales críticos no son sustituibles y deben conservarse por sí mismos.</li></ul><p>La <b>economía circular</b> busca cerrar los ciclos de materiales: reducir, reutilizar, reparar, reciclar, y diseñar productos pensando en su fin de vida, frente a la economía lineal de extraer, producir y desechar.</p></section>
<section><h3>Cambio climático</h3><p>El clima de la Tierra cambia por causas naturales: variaciones en la radiación solar y en la órbita terrestre (ciclos de Milankovitch, que explican las glaciaciones), erupciones volcánicas y oscilaciones de las corrientes oceánicas (El Niño y La Niña). El calentamiento observado desde el siglo XX se atribuye principalmente al aumento de los gases de efecto invernadero de origen humano, según el IPCC. Económicamente es la mayor externalidad global: los emisores no pagan el daño, que recae sobre otros países y generaciones futuras. Los acuerdos (Protocolo de Kioto 1997, Acuerdo de París 2015) enfrentan el problema del polizón.</p></section>
${LAB}`},

{id:"bienestar", parte:P2, u:2, t:"Medir los cambios en el bienestar y el análisis costo-beneficio", sim:"acb", html:String.raw`
<section><h3>Medidas de bienestar</h3><p class="lead">Un cambio ambiental modifica el bienestar de las personas. Se mide en dinero con:</p><ul><li><b>Excedente del consumidor</b> (marshalliano): área bajo la demanda; aproximación práctica.</li><li><b>Variación compensatoria (VC)</b>: cuánto habría que quitarle (o darle) a la persona después del cambio para que quede con su utilidad inicial. Para una mejora es la <b>disposición a pagar</b> (DAP).</li><li><b>Variación equivalente (VE)</b>: cuánto habría que darle sin el cambio para que alcance la utilidad que tendría con él. Para una mejora es la <b>disposición a aceptar</b> (DAA) por renunciar a ella.</li></ul><p>Con efecto ingreso pequeño las tres medidas casi coinciden (Willig). En la práctica la DAA suele superar mucho a la DAP en los bienes ambientales, por la falta de sustitutos y la aversión a las pérdidas.</p></section>
<section><h3>Del individuo a la sociedad y el papel del gobierno</h3><p>El criterio de <b>Kaldor-Hicks</b>: un proyecto mejora el bienestar si los ganadores podrían compensar a los perdedores. El <b>análisis costo-beneficio</b> suma beneficios y costos de todos los afectados en el tiempo:</p>
<div class="mj">\[VPN=\sum_{t=0}^{T}\frac{B_t-C_t}{(1+r)^t}\]</div>
<p>La <b>tasa de descuento</b> es decisiva cuando los efectos son de largo plazo: con 5 %, un daño de 1 millón dentro de 100 años vale hoy unos 7 600 pesos; con 1,4 % (Stern, 2006) vale unos 250 000. La regla de Ramsey \(r=\rho+\eta g\) separa la impaciencia pura (\(\rho\)) del efecto de ser más ricos en el futuro.</p></section>
${LAB}`},

{id:"norenovables", parte:P3, u:3, t:"Recursos no renovables: la regla de Hotelling", sim:"hotelling", html:String.raw`
<section><h3>El principio fundamental</h3><p class="lead">Extraer una unidad hoy tiene un <b>costo de oportunidad</b>: esa unidad ya no estará disponible mañana. El precio de un recurso agotable debe cubrir el costo marginal de extracción más una <b>renta de escasez</b> (costo de uso marginal).</p></section>
<section><h3>Eficiencia estática y dinámica</h3><p>La <b>eficiencia estática</b> iguala precio y costo marginal en un periodo. La <b>dinámica</b> maximiza el valor presente del excedente en todos los periodos: el valor presente de la renta marginal debe ser igual en todos los periodos. Así se obtiene la <b>regla de Hotelling (1931)</b>:</p>
<div class="mj">\[\frac{P_{t+1}-c}{P_t-c}=1+r\]</div>
<p>La renta de escasez crece a la tasa de interés. Si creciera menos, convendría extraer todo hoy y poner el dinero en el banco; si creciera más, convendría dejarlo bajo tierra. El precio sube hasta alcanzar el precio de la <b>tecnología sustituta</b> (backstop), momento en que el recurso se agota.</p></section>
<section><h3>Monopolio y duopolio</h3><p>Un monopolista iguala el valor presente del <b>ingreso</b> marginal neto en todos los periodos: con demanda lineal extrae más despacio que la competencia, y el recurso dura más («el monopolista es amigo del conservacionista»). Con duopolio el resultado queda entre los dos.</p></section>
${LAB}`},

{id:"pesca", parte:P4, u:4, t:"Recursos renovables: pesca", sim:"pesca", html:String.raw`
<section><h3>La regla fundamental de los renovables</h3><p class="lead">Un recurso renovable crece: la población de peces o el volumen de un bosque. Conservar una unidad rinde su crecimiento marginal \(G'(S)\) (más el efecto del stock sobre los costos), y la explotación es óptima cuando ese rendimiento iguala la tasa de interés.</p></section>
<section><h3>El modelo de Gordon-Schaefer</h3><p>Crecimiento logístico \(G(S)=gS(1-S/K)\) y captura \(H=qES\), con esfuerzo \(E\) a un costo \(w\) por unidad y precio \(p\).</p><ul><li><b>Rendimiento máximo sostenible</b> (RMS): \(S=K/2\), captura \(gK/4\). Es un criterio biológico, no económico.</li><li><b>Rendimiento económico máximo</b> (REM): maximiza la renta \(pH-wE\) en estado estacionario; requiere menos esfuerzo que el RMS.</li><li><b>Libre acceso</b>: los pescadores entran mientras haya renta, hasta que \(pH=wE\). La renta se disipa y el esfuerzo es el doble del REM: es la <b>tragedia de los comunes</b> (Hardin, 1968). Si el precio es alto respecto al costo, el libre acceso puede llevar a la extinción.</li></ul><p>Instrumentos: cuotas individuales transferibles, licencias, vedas, impuestos al esfuerzo y manejo comunitario (Ostrom).</p></section>
${LAB}`},

{id:"bosques", parte:P4, u:4, t:"Bosques, suelo y especies", sim:"bosque", html:String.raw`
<section><h3>Economía forestal</h3><p class="lead">¿Cuándo cortar un árbol? Si solo hay una rotación (regla de Wicksell), se corta cuando la tasa de crecimiento del valor de la madera iguala la tasa de interés: \(pV'(T)/pV(T)=r\). Con rotaciones sucesivas a perpetuidad, la <b>regla de Faustmann (1849)</b> también cuenta el costo de oportunidad del suelo (retrasar la siguiente rotación):</p>
<div class="mj">\[\frac{pV'(T)}{pV(T)-c}=\frac{r}{1-e^{-rT}}\]</div>
<p>La rotación de Faustmann es más corta que la de Wicksell y más corta que la del máximo rendimiento sostenido. Si el bosque presta servicios adicionales mientras está en pie (agua, carbono, biodiversidad), la rotación óptima se alarga (Hartman).</p></section>
<section><h3>Suelo, preservación y extinción</h3><p>El uso del suelo compite entre agricultura, ganadería, bosque y urbanización; la deforestación avanza cuando la renta agropecuaria privada supera la del bosque, que no cobra sus servicios ambientales (de ahí los pagos por servicios ambientales). El <b>valor de preservación</b> incluye el valor de opción (conservar la posibilidad de uso futuro), el de existencia y el de legado. Una especie puede extinguirse si su tasa de crecimiento es menor que la tasa de interés y su acceso es libre (Clark): «liquidar» el stock resulta más rentable que conservarlo.</p></section>
${LAB}`},

{id:"externalidades", parte:P5, u:5, t:"Externalidades y nivel óptimo de contaminación", sim:"contam", html:String.raw`
<section><h3>Fallas del mercado</h3><p class="lead">El ambiente se sobreexplota porque sus servicios no tienen precio: <b>externalidades</b> (el contaminador no paga el daño), <b>bienes públicos</b> (aire limpio: no rival y no excluible, con polizones), <b>recursos de libre acceso</b> y derechos de propiedad mal definidos.</p></section>
<section><h3>La contaminación óptima no es cero</h3><p>Reducir emisiones tiene un <b>costo marginal de abatimiento</b> (CMgA) creciente, y las emisiones causan un <b>daño marginal</b> (DMg) creciente. El nivel eficiente está donde CMgA = DMg: más reducción costaría más de lo que evita.</p></section>
<section><h3>Coase</h3><p>Si los derechos de propiedad están definidos y los costos de transacción son bajos, la negociación entre las partes lleva al resultado eficiente sin importar a quién se asigne el derecho (Coase, 1960). Con muchos afectados y altos costos de transacción, se necesita intervención.</p></section>
<section><h3>La curva de Kuznets ambiental</h3><p>Grossman y Krueger (1995): algunos contaminantes locales (SO₂, partículas) suben con el ingreso y después bajan. No ocurre con el CO₂ ni con la biodiversidad, y parte de la mejora de los países ricos se explica por trasladar la producción contaminante a otros países.</p></section>
${LAB}`},

{id:"instrumentos", parte:P5, u:5, t:"Impuestos, estándares y permisos negociables", sim:"instr", html:String.raw`
<section><h3>Tres instrumentos</h3><ul><li><b>Estándar</b> (comando y control): un límite de emisiones igual para todos. Es simple de fiscalizar pero no aprovecha las diferencias de costo entre empresas.</li><li><b>Impuesto pigouviano</b>: un precio por unidad emitida igual al daño marginal en el óptimo. Cada empresa reduce hasta que su CMgA iguala el impuesto: se igualan los costos marginales y la reducción total se logra al menor costo. Incentiva innovar en descontaminación.</li><li><b>Permisos negociables</b> (Dales, Montgomery): se fija la cantidad total y se reparten permisos que se pueden vender; el mercado iguala los CMgA al precio del permiso. Fija la cantidad con certeza; el impuesto fija el precio.</li></ul><p>Con incertidumbre sobre los costos (Weitzman, 1974), conviene el impuesto si la curva de daño marginal es relativamente plana, y los permisos si el daño marginal es muy empinado (umbrales ecológicos). En Colombia existen las tasas retributivas por vertimientos, las tasas por uso del agua y el impuesto al carbono (2016).</p></section>
${LAB}`},

{id:"valoracion", parte:P6, u:6, t:"Métodos de valoración: costos evitados, costo de viaje y contingente", sim:"valor", html:String.raw`
<section><h3>Valor económico total</h3><p class="lead">Valor de uso (directo, indirecto, de opción) más valores de no uso (existencia y legado). Los métodos se clasifican en:</p><ul><li><b>Preferencias reveladas</b> (comportamiento observado en mercados relacionados): costos evitados o defensivos, costo de viaje, precios hedónicos.</li><li><b>Preferencias declaradas</b> (encuestas): valoración contingente y experimentos de elección. Son los únicos que captan valores de no uso.</li></ul></section>
<section><h3>Costos evitados</h3><p>Valora una mejora por lo que se ahorra en gastos defensivos o daños: purificadores de agua, gastos médicos por contaminación del aire, dragado de embalses por erosión. Da un límite inferior del valor.</p></section>
<section><h3>Costo de viaje</h3><p>El costo de llegar a un sitio (transporte y tiempo) funciona como un precio. Con datos por zonas de origen se estima la demanda de visitas \(V_z/N_z=a-bC_z\) y el excedente del consumidor bajo esa curva es el valor recreativo del sitio.</p></section>
<section><h3>Valoración contingente</h3><p>Se pregunta directamente la disposición a pagar en un mercado hipotético bien descrito. El formato de <b>referéndum</b> (¿pagaría X pesos? sí o no) se analiza con un logit: \(P(\text{sí})=\Lambda(\alpha-\beta X)\), y la DAP media es \(\alpha/\beta\). Riesgos: sesgo hipotético, estratégico, de información, de anclaje en el precio de partida y de alcance (que la DAP no cambie con la cantidad del bien). El panel de la NOAA (Arrow y Solow, 1993) fijó buenas prácticas.</p></section>
${LAB}`}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"intro",links:["intro","norenovables","externalidades"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"valoracion",links:["norenovables","pesca","instrumentos","valoracion"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"valoracion",links:["intro","instrumentos","valoracion"],sim:"abiertas",html:WSBOX,d:"Preguntas para el proyecto y el examen."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"valoracion",links:["norenovables","pesca","bosques","instrumentos"],sim:"hoja",html:WSBOX,d:"Reglas y fórmulas del curso."}];
const ALIAS={};
const GL=[
{u:1,t:"Economía ecológica",d:"Enfoque que ve la economía como subsistema de la biosfera, sujeta a límites físicos."},
{u:1,t:"Sostenibilidad débil",d:"Mantener el capital total permitiendo sustituir capital natural por producido."},
{u:1,t:"Sostenibilidad fuerte",d:"Conservar el capital natural crítico, que no es sustituible."},
{u:1,t:"Regla de Hartwick",d:"Invertir las rentas de los recursos agotables en capital reproducible para mantener el consumo."},
{u:1,t:"Economía circular",d:"Sistema que mantiene los materiales en uso cerrando los ciclos de producción y consumo."},
{u:1,t:"Ciclos de Milankovitch",d:"Variaciones de la órbita y la inclinación terrestres que alteran la radiación recibida y explican las glaciaciones."},
{u:2,t:"Variación compensatoria",d:"Pago que deja a la persona con su utilidad inicial después del cambio; para una mejora, la DAP."},
{u:2,t:"Variación equivalente",d:"Pago sin el cambio que da la utilidad que se tendría con él; para una mejora, la DAA por renunciar."},
{u:2,t:"Criterio de Kaldor-Hicks",d:"Hay mejora si los ganadores podrían compensar a los perdedores."},
{u:2,t:"Regla de Ramsey",d:"Tasa social de descuento r = ρ + ηg."},
{u:3,t:"Renta de escasez",d:"Diferencia entre el precio y el costo marginal de extracción de un recurso agotable."},
{u:3,t:"Regla de Hotelling",d:"La renta de escasez crece a la tasa de interés."},
{u:3,t:"Tecnología sustituta (backstop)",d:"Alternativa ilimitada a un costo dado que pone techo al precio del recurso."},
{u:4,t:"Rendimiento máximo sostenible",d:"Mayor captura que se puede mantener indefinidamente; en el modelo logístico, con S = K/2."},
{u:4,t:"Rendimiento económico máximo",d:"Esfuerzo que maximiza la renta del recurso en estado estacionario."},
{u:4,t:"Libre acceso",d:"Sin restricciones de entrada: la renta se disipa."},
{u:4,t:"Tragedia de los comunes",d:"Sobreexplotación de un recurso de uso común sin reglas de acceso."},
{u:4,t:"Regla de Faustmann",d:"Rotación forestal óptima con rotaciones sucesivas, que incluye el costo de oportunidad del suelo."},
{u:4,t:"Valor de opción",d:"Valor de conservar la posibilidad de usar el recurso en el futuro."},
{u:4,t:"Valor de existencia",d:"Valor de saber que algo existe, sin intención de usarlo."},
{u:5,t:"Externalidad",d:"Efecto de una actividad sobre terceros que no se refleja en los precios."},
{u:5,t:"Costo marginal de abatimiento",d:"Costo de reducir una unidad más de emisiones."},
{u:5,t:"Teorema de Coase",d:"Con derechos definidos y costos de transacción bajos, la negociación lleva a la eficiencia."},
{u:5,t:"Impuesto pigouviano",d:"Impuesto por unidad igual al daño marginal en el nivel óptimo."},
{u:5,t:"Permisos negociables",d:"Derechos de emisión transferibles con un total fijo."},
{u:5,t:"Costo-efectividad",d:"Lograr una meta ambiental al menor costo: se igualan los costos marginales de abatimiento."},
{u:5,t:"Curva de Kuznets ambiental",d:"Contaminación que sube y luego baja con el ingreso per cápita."},
{u:6,t:"Valor económico total",d:"Suma de valores de uso y de no uso."},
{u:6,t:"Costos evitados",d:"Valoración por los gastos defensivos o daños que una mejora ahorra."},
{u:6,t:"Costo de viaje",d:"Método que usa el costo de visitar un sitio como precio para estimar su demanda recreativa."},
{u:6,t:"Precios hedónicos",d:"Método que infiere el valor ambiental de las diferencias de precio de las viviendas."},
{u:6,t:"Valoración contingente",d:"Encuesta que pregunta la disposición a pagar en un mercado hipotético."},
{u:6,t:"Sesgo de alcance",d:"Cuando la DAP declarada no cambia con la cantidad del bien ofrecido."}];
const MCQ=[
{u:1,q:"La sostenibilidad débil supone que:",o:["El capital natural no se puede sustituir","Se mantiene el capital total y el natural es sustituible","Hay que detener el crecimiento","Solo importa el capital humano"],ok:1,e:"Solow y Hartwick."},
{u:1,q:"Las glaciaciones se explican principalmente por:",o:["Gases de efecto invernadero humanos","Ciclos orbitales de Milankovitch","El fenómeno de El Niño","La deforestación"],ok:1,e:"Variaciones de la radiación recibida."},
{u:2,q:"Para una mejora ambiental, la variación compensatoria es:",o:["La disposición a aceptar","La disposición a pagar","El excedente del productor","El costo del proyecto"],ok:1,e:"Lo que se quitaría para volver a la utilidad inicial."},
{u:2,q:"Una tasa de descuento más baja en el análisis del cambio climático:",o:["Reduce el valor de los daños futuros","Aumenta el valor presente de los daños futuros","No importa","Elimina los costos"],ok:1,e:"Debate Stern-Nordhaus."},
{u:3,q:"Según Hotelling, en competencia la renta de escasez:",o:["Es constante","Crece a la tasa de interés","Cae con el tiempo","Es cero"],ok:1,e:"(P − c) crece a r."},
{u:3,q:"Un monopolista de un recurso agotable con demanda lineal, frente a la competencia:",o:["Extrae más rápido","Extrae más despacio","Extrae igual","No extrae"],ok:1,e:"El monopolista es amigo del conservacionista."},
{u:3,q:"Si aparece una tecnología sustituta más barata, el recurso:",o:["Dura más","Se agota antes y su precio inicial baja","No cambia","Sube de precio"],ok:1,e:"El techo de precio es más bajo."},
{u:4,q:"En el modelo logístico, el rendimiento máximo sostenible se alcanza con un stock de:",o:["K","K/2","K/4","0"],ok:1,e:"G(S) es máximo en K/2."},
{u:4,q:"En libre acceso, el esfuerzo pesquero es:",o:["Igual al del REM","El doble del REM","La mitad del REM","Cero"],ok:1,e:"Con costos lineales y Schaefer."},
{u:4,q:"La rotación de Faustmann, frente a la de Wicksell (una sola rotación), es:",o:["Más larga","Más corta","Igual","Infinita"],ok:1,e:"Cuenta el costo de oportunidad del suelo."},
{u:4,q:"Si un bosque presta servicios ambientales mientras está en pie, la rotación óptima:",o:["Se acorta","Se alarga","No cambia","Es cero"],ok:1,e:"Modelo de Hartman."},
{u:5,q:"El nivel óptimo de contaminación está donde:",o:["Las emisiones son cero","El costo marginal de abatimiento iguala el daño marginal","El daño total es mínimo","El costo de abatimiento es cero"],ok:1,e:"Eficiencia económica."},
{u:5,q:"Un impuesto pigouviano logra la reducción al menor costo porque:",o:["Todas las empresas reducen lo mismo","Iguala los costos marginales de abatimiento","Prohíbe contaminar","Subsidia a los contaminadores"],ok:1,e:"Costo-efectividad."},
{u:5,q:"Los permisos negociables fijan con certeza:",o:["El precio de las emisiones","La cantidad total de emisiones","El costo de cada empresa","El daño marginal"],ok:1,e:"El impuesto fija el precio."},
{u:5,q:"Según Weitzman, si el daño marginal es muy empinado conviene:",o:["Un impuesto","Permisos o un límite de cantidad","No regular","Subsidios"],ok:1,e:"Evita errores grandes en cantidad."},
{u:5,q:"El teorema de Coase requiere:",o:["Intervención estatal","Derechos definidos y bajos costos de transacción","Muchos afectados","Información asimétrica"],ok:1,e:"Entonces la negociación es eficiente."},
{u:6,q:"El único tipo de método que capta valores de no uso es:",o:["Costo de viaje","Precios hedónicos","Preferencias declaradas","Costos evitados"],ok:2,e:"Valoración contingente y experimentos de elección."},
{u:6,q:"En referéndum con logit P(sí) = Λ(α − βX), la DAP media es:",o:["α·β","α/β","β/α","α − β"],ok:1,e:"Donde la probabilidad es 50 %."},
{u:6,q:"El método de costos evitados da:",o:["Un límite superior","Un límite inferior del valor","El valor de existencia","La DAA"],ok:1,e:"Solo cuenta lo que se ahorra."}];
const ABIERTAS=[
{u:1,q:"Compare la sostenibilidad débil y la fuerte con un ejemplo colombiano (minería, páramos, agua).",a:["Definiciones y autores.","Regla de Hartwick.","Capital natural crítico.","Ejemplo y posición argumentada."]},
{u:3,q:"Explique la regla de Hotelling y por qué los precios reales de muchos minerales no han subido como predice.",a:["Renta de escasez y tasa de interés.","Progreso técnico que baja costos de extracción.","Descubrimientos de nuevas reservas.","Tecnologías sustitutas y estructura de mercado."]},
{u:4,q:"Analice la sobrepesca con el modelo de Gordon-Schaefer y proponga instrumentos.",a:["RMS, REM y libre acceso.","Disipación de la renta.","Cuotas transferibles, licencias, vedas.","Manejo comunitario (Ostrom)."]},
{u:5,q:"Para reducir la contaminación de un río en Antioquia, ¿qué instrumento recomendaría? Compare estándar, tasa retributiva y permisos.",a:["Óptimo CMgA = DMg.","Costo-efectividad.","Incertidumbre (Weitzman).","Fiscalización e institucionalidad."]},
{u:6,q:"Diseñe un estudio de valoración contingente para un parque natural: pregunta, formato, sesgos y análisis.",a:["Descripción del bien y del vehículo de pago.","Formato referéndum y precios ofrecidos.","Sesgos y cómo controlarlos.","Logit y DAP media."]}];
const TL=[
{u:1,a:"1798",t:"Malthus",d:"La población frente a los límites de los alimentos."},
{u:1,a:"1849",t:"Faustmann",d:"Valor del suelo forestal y rotación óptima."},
{u:5,a:"1920",t:"Pigou, La economía del bienestar",d:"Externalidades e impuestos correctivos."},
{u:3,a:"1931",t:"Hotelling",d:"La economía de los recursos agotables."},
{u:4,a:"1954",t:"Gordon",d:"Teoría económica de un recurso de propiedad común: la pesca."},
{u:5,a:"1960",t:"Coase, El problema del costo social",d:"Negociación y derechos de propiedad."},
{u:1,a:"1962",t:"Carson, Primavera silenciosa",d:"Los pesticidas y el nacimiento del ambientalismo moderno."},
{u:4,a:"1968",t:"Hardin, La tragedia de los comunes",d:"Sobreexplotación de los recursos de libre acceso."},
{u:5,a:"1968",t:"Dales",d:"Propuesta de derechos de contaminación negociables."},
{u:1,a:"1972",t:"Los límites del crecimiento (Meadows et al.)",d:"Informe al Club de Roma; Conferencia de Estocolmo."},
{u:5,a:"1974",t:"Weitzman",d:"Precios frente a cantidades con incertidumbre."},
{u:1,a:"1977",t:"Hartwick",d:"Regla de inversión de las rentas de los recursos."},
{u:1,a:"1987",t:"Informe Brundtland",d:"Definición de desarrollo sostenible."},
{u:4,a:"1990",t:"Ostrom, El gobierno de los bienes comunes",d:"Manejo comunitario exitoso de recursos."},
{u:1,a:"1992",t:"Cumbre de la Tierra en Río",d:"Convención de cambio climático y de diversidad biológica."},
{u:6,a:"1993",t:"Panel de la NOAA",d:"Guía para la valoración contingente (Arrow, Solow y otros)."},
{u:5,a:"1995",t:"Grossman y Krueger",d:"Crecimiento económico y medio ambiente: la curva de Kuznets ambiental."},
{u:1,a:"1997",t:"Protocolo de Kioto",d:"Metas de emisión para países desarrollados y mercados de carbono."},
{u:2,a:"2006",t:"Informe Stern",d:"La economía del cambio climático con una tasa de descuento baja."},
{u:1,a:"2015",t:"Acuerdo de París",d:"Contribuciones nacionales para limitar el calentamiento muy por debajo de 2 °C."},
{u:5,a:"2016",t:"Impuesto al carbono en Colombia",d:"Ley 1819 de 2016 sobre combustibles fósiles."}];
