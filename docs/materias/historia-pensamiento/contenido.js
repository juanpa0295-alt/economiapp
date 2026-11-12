// Historia del Pensamiento Económico · contenido de la ruta (libro de Tobón, 2023, y programa del curso)
// =====================================================================
// CONTENIDO: Historia del Pensamiento Económico (U. de Antioquia, curso 1503723)
// Texto base: Tobón Arias, A. (2023). La génesis de la teoría económica contemporánea. Editorial UdeA.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const WSBOX=`<div class="sim" id="sim"></div>`;
const PARA=(conceptos,pasos)=>`<section><h3>Para el parcial</h3><p><b>Conceptos que te pueden pedir definir:</b> ${conceptos}.</p><p><b>Si te piden «explique la teoría…»:</b></p><ol class="steps">${pasos.map(p=>`<li>${p}</li>`).join("")}</ol></section>`;

// Glosario: [concepto, definición, capítulo, unidad]. Lo usan la rama de conceptos y el laboratorio de repaso.
const GLOS=[
["Sistema económico","Forma histórica de organizar la producción, la propiedad de los medios de producción y la mediación entre los individuos (cómo se relacionan para obtener lo que necesitan). El libro distingue cinco: comunidad primitiva, esclavitud, feudalismo, capitalismo y socialismo.",1,1],
["Capitalismo","Sistema en el que los medios de producción son propiedad privada, la producción se organiza con trabajo asalariado para obtener un beneficio y la mediación entre los individuos se hace por el mercado y el dinero.",1,1],
["Etapas del capitalismo","Mercantil proteccionista (s. XIII–1789), liberal (1789–finales del s. XIX), regulado (finales del s. XIX–1973) y neoliberal (desde 1973). Cada etapa tiene su doctrina dominante y su crítica.",1,1],
["Burguesía","Clase que surge de los «desarraigados» del feudalismo (artesanos, comerciantes y banqueros que no pertenecían al feudo) y que se convierte en la clase capitalista.",1,1],
["Consenso de Washington","Decálogo de reformas de mercado (disciplina fiscal, liberalización comercial y financiera, privatización, desregulación, entre otras) que guía la etapa neoliberal en América Latina.",1,1],
["Paradigma","Pregunta fundamental que una teoría se propone responder y que define su programa de investigación. En el curso hay dos: el de Smith (coordinación por los precios) y el de Keynes (determinación del nivel de empleo).",2,1],
["Mercantilismo monetario","Doctrina según la cual la riqueza son los metales preciosos (oro y plata) de valor intrínseco. Un país se enriquece con una balanza comercial positiva (Mun) que atrae metal.",2,1],
["Mercantilismo del valor","Corriente de Petty, Cantillon y Steuart que busca la fuente de la riqueza en la producción (tierra y trabajo) y distingue un precio corriente de un precio especial: precio natural (Petty), valor intrínseco (Cantillon) o valor adecuado (Steuart).",2,1],
["Teoría cuantitativa del dinero","Relación entre la cantidad de dinero y el nivel de precios: más metal en circulación eleva los precios. Aparece con Bodin y la usa Hume en el mecanismo precio-flujo de especie.",2,1],
["Mecanismo precio-flujo (Hume)","Si un país acumula oro con una balanza positiva, sus precios suben, sus exportaciones se encarecen y el oro vuelve a salir: la balanza positiva permanente es imposible. Es la crítica central al mercantilismo monetario.",2,1],
["Fisiocracia","Escuela francesa (Quesnay, Mirabeau, Turgot) para la cual solo la agricultura genera producto neto. Propone el laissez faire, un impuesto único sobre la renta de la tierra y la idea de un orden natural.",2,1],
["Producto neto (fisiocracia)","Excedente agrícola que queda después de reponer los adelantos de la clase productiva; lo reciben los terratenientes como renta.",2,1],
["Tableau économique","Cuadro de Quesnay (1766) que muestra cómo circula el producto entre tres clases: terratenientes, clase productiva (agricultores) y clase estéril (artesanos y comerciantes).",2,1],
["Clase estéril","Para los fisiócratas, artesanos y comerciantes: transforman o intercambian, pero no crean producto neto.",2,1],
["Adelantos","Lo que el agricultor anticipa para producir (semillas, herramientas, sustento). Para los fisiócratas no son capital, porque no reciben un beneficio: no existe todavía el beneficio capitalista.",2,1],
["Laissez faire","Dejar hacer, dejar pasar (Gournay): eliminar las restricciones a la producción y al comercio.",2,1],
["Filosofía moral","Disciplina de la que nace la economía con Smith: estudia cómo se justifica el comportamiento individual (ambición, simpatía, interés propio) en una sociedad de individuos libres.",2,1],
["Riqueza (Smith)","El ingreso per cápita: la cantidad de bienes que produce el trabajo de una nación dividida por su población, Y/L. Depende de la división del trabajo y de la proporción de trabajo productivo.",2,1],
["Trabajo productivo","El que se fija en una mercancía vendible y genera un excedente (el del obrero manufacturero), a diferencia del improductivo (sirvientes, funcionarios), que no reproduce su valor.",2,1],
["Paradigma de Smith","Explicar cómo individuos descentralizados, libres y anónimos, que solo buscan su interés, logran coordinar sus decisiones gracias a un sistema de precios, sin que nadie lo planee. La solución es un equilibrio.",2,1],
["Mano invisible","Metáfora de Smith según la cual el interés individual, a través del mercado, promueve un fin social que nadie busca. Hahn y Tobin la ven como la pregunta central de la teoría; Blaug sugiere que Smith la usó con ironía.",2,1],
["Equilibrio económico","Constelación de variables ajustadas entre sí sin tendencia al cambio: la «coexistencia pacífica» de Machlup. En el equilibrio cada individuo logra lo que planeó.",2,1],
["Dicotomía real-monetaria","Separación entre la teoría de los precios relativos (sin dinero) y la teoría del nivel de precios (con dinero). Es consecuencia de que el paradigma de Smith se resuelva en una economía de trueque.",2,1],
["Precio de producción","Precio que permite reponer los medios de producción, pagar los salarios y remunerar el capital a una tasa de beneficio uniforme (Sraffa).",3,2],
["Excedente social","Producto que sobra después de reponer lo que la economía usó como insumos y como canasta salarial. Si es positivo, la tasa de beneficio es positiva.",3,2],
["Canasta de subsistencia","Bienes que recibe cada trabajador como salario, s. En Sraffa el salario se mide en bienes: w = Σ sⱼ pⱼ.",3,2],
["Teorema de Perron-Frobenius","Si la matriz B es no negativa e irreducible, tiene un valor propio dominante λ entre 0 y 1 asociado a un vector de precios positivo. En Sraffa garantiza que los precios y la tasa de beneficio sean positivos: λ = 1/(1 + r).",3,2],
["Bien básico","Bien que entra directa o indirectamente en la producción de todos los demás. Con todos los bienes básicos, la matriz es irreducible.",3,2],
["Numerario","Bien cuyo precio se fija en 1 para medir los demás. Es necesario porque el sistema solo determina precios relativos.",3,2],
["Trabajo comandado (Smith)","El valor de un bien medido por la cantidad de trabajo que puede comprar: P/w. Sraffa muestra que equivale a L(1 + r), así que depende de la distribución y no sirve de medida invariable.",3,2],
["Trabajo incorporado (Ricardo)","Cantidad de trabajo directa e indirectamente necesaria para producir un bien. Solo determina los precios relativos si la composición del capital es igual en todos los sectores.",3,2],
["Composición del capital (q)","Relación entre el valor de los medios de producción y los salarios de un sector: q = Σ aᵢⱼ pⱼ / (lᵢ w).",3,2],
["Mercancía patrón","Mercancía compuesta construida por Sraffa cuya razón entre producto neto y medios de producción es igual a la máxima tasa de beneficio. Medida en ella, la relación salario–beneficio es lineal: r = R(1 − w).",3,2],
["Gravitación","Proceso por el cual los precios de mercado tienden hacia los precios de producción cuando los capitalistas desplazan su capital hacia los sectores más rentables.",3,2],
["Regla Cantillon-Smith","El precio de mercado es el valor de la demanda dividido por la cantidad ofrecida: pᵢₜ = Xᵢ pᵢ*/Yᵢₜ. Si la oferta es escasa, el precio sube por encima del natural.",3,2],
["Holismo","Método que parte de la sociedad como un todo (clases, relaciones sociales) y no de los individuos. Es el de Marx; se opone al individualismo metodológico.",4,2],
["Trabajo abstracto","Trabajo humano en general, sin tener en cuenta su forma concreta. Para Marx es la sustancia del valor de las mercancías.",4,2],
["Valor-trabajo socialmente necesario","Tiempo de trabajo que requiere producir una mercancía en las condiciones normales de la sociedad, directa e indirectamente: λ = Aλ + L, de donde λ = (I − A)⁻¹L.",4,2],
["Fuerza de trabajo","La capacidad de trabajar, que el obrero vende al capitalista. Su valor es el de los bienes de subsistencia; su uso crea más valor del que cuesta.",4,2],
["Plusvalía (S)","Diferencia entre el valor que crea la fuerza de trabajo y su propio valor. Es la fuente del beneficio capitalista (D–M–D′, con D′ > D).",4,2],
["Capital constante (C)","Parte del capital invertida en medios de producción; transfiere su valor al producto sin aumentarlo.",4,2],
["Capital variable (V)","Parte del capital invertida en fuerza de trabajo; es la única que crea valor nuevo.",4,2],
["Tasa de explotación (e)","e = S/V: plusvalía por cada unidad de capital variable.",4,2],
["Tasa de ganancia (Marx)","r = S/(C + V). En el ejemplo del libro: 30/(150 + 30) = 16,6 %.",4,2],
["Problema de la transformación","Mostrar que los precios de producción (con tasa de beneficio uniforme) se derivan de los valores-trabajo conservando sus propiedades, por ejemplo que el beneficio total sea igual a la plusvalía total.",4,2],
["Teorema de Okishio","Si una innovación reduce costos a los precios vigentes y el salario real no cambia, la tasa de beneficio de equilibrio no baja: contradice la ley de la baja tendencial de la tasa de ganancia.",4,2],
["Crítica de Steedman","Los precios y la tasa de beneficio se pueden calcular directamente con Sraffa (técnica y salario real) sin pasar por los valores: el valor-trabajo es redundante.",4,2],
["Individualismo metodológico","Método que explica los fenómenos sociales a partir de las decisiones de individuos racionales. Es la base neoclásica.",5,2],
["Homo economicus","Individuo racional que maximiza su utilidad (consumidor) o su beneficio (empresa) dadas sus restricciones.",5,2],
["Utilidad marginal","Satisfacción adicional por una unidad más de un bien. En el óptimo del consumidor: TMS = UMgᵢ/UMgₘ = pᵢ/pₘ.",5,2],
["Productividad marginal","Producto adicional por una unidad más de un factor. La empresa contrata hasta PMgK = r/p y PMgN = w/p.",5,2],
["Equilibrio general","Vector de precios que iguala oferta y demanda en todos los mercados a la vez (Walras 1874; existencia demostrada por Arrow y Debreu en 1954 con teoremas de punto fijo).",5,2],
["Ley de Walras","El valor de las demandas excedentes suma cero: Σ pᵢ Zᵢ = 0. Si n − 1 mercados están en equilibrio, el último también.",5,2],
["Demanda excedente","Zᵢ(p) = demanda − oferta del bien i a los precios p.",5,2],
["Tanteo (tâtonnement)","Proceso ficticio en el que un subastador anuncia precios, sube los de los bienes con demanda excedente y baja los de oferta excedente (dp/dt = ϑZ), sin intercambios fuera del equilibrio.",5,2],
["Subastador","Agente ficticio que centraliza la formación de precios en el tanteo. Su existencia contradice la idea de una economía descentralizada.",5,2],
["Sustituibilidad bruta","Si sube el precio de un bien, la demanda excedente de los demás aumenta. Con ella el tanteo es estable (Arrow-Hurwicz).",5,2],
["Teorema de Sonnenschein-Mantel-Debreu","Las funciones de demanda excedente agregadas pueden tener casi cualquier forma: no hay garantía general de unicidad ni de estabilidad del equilibrio.",5,2],
["Óptimo de Pareto","Asignación en la que no se puede mejorar a nadie sin empeorar a otro.",5,2],
["Teoremas del bienestar","Primero: todo equilibrio competitivo es un óptimo de Pareto. Segundo: todo óptimo de Pareto puede alcanzarse como equilibrio con una redistribución adecuada de las dotaciones.",5,2],
["Fallo de mercado","Situación en la que el equilibrio de mercado no es un óptimo de Pareto porque falla alguna hipótesis: información, externalidades, competencia.",6,2],
["Información asimétrica","Una parte del intercambio sabe más que la otra. Arrow (1963) la usa para explicar el mercado de la salud.",6,2],
["Riesgo moral","Cambio de conducta después de firmar un contrato porque la otra parte no puede observarla (el asegurado se cuida menos).",6,2],
["Selección adversa","Antes del contrato, la parte desinformada atrae a los de mayor riesgo (al seguro llegan sobre todo los enfermos).",6,2],
["Externalidad","Efecto de una decisión sobre otros que no pasa por los precios (contaminación).",6,2],
["Tragedia de los comunes","Sobreexplotación de un recurso de acceso libre porque cada uno ignora el costo que impone a los demás.",6,2],
["Teorema de Coase","Con derechos de propiedad bien definidos y sin costos de transacción, la negociación privada lleva a la asignación eficiente sin importar a quién se asignen los derechos.",6,2],
["Polizón (free rider)","Quien se beneficia de un bien sin pagar por él, lo que impide que el mercado lo provea.",6,2],
["Equilibrio de Nash","Combinación de estrategias en la que nadie gana cambiando la suya si los demás no cambian. En el duopolio de Cournot del libro: 40 y 40.",6,2],
["Ley de Say","La oferta crea su propia demanda: todo lo producido se vende, así que no puede haber exceso general de oferta y hay pleno empleo.",7,3],
["Teoría Clásica (Keynes)","Nombre que da Keynes a la teoría de Pigou y los neoclásicos: equilibrio general walrasiano con el corto plazo de Marshall, en la que el empleo se determina en el mercado de trabajo.",7,3],
["Primer postulado clásico","El salario real es igual a la productividad marginal del trabajo (demanda de trabajo). Keynes lo acepta.",7,3],
["Segundo postulado clásico","La utilidad del salario real es igual a la desutilidad marginal del trabajo (oferta de trabajo). Keynes lo rechaza.",7,3],
["Desempleo voluntario","Personas que no trabajan porque no aceptan el salario real vigente.",7,3],
["Desempleo involuntario","Personas que quieren trabajar al salario vigente y no encuentran empleo. Para Pigou se debe a salarios rígidos por fallos (sindicatos, salario mínimo); para Keynes, a una demanda efectiva insuficiente.",7,3],
["Paradigma de Keynes","Construir una teoría general del nivel de empleo en la que el pleno empleo sea un caso particular y el desempleo involuntario una posibilidad de equilibrio.",7,3],
["Demanda efectiva","Punto en el que la función de demanda agregada D corta la de oferta agregada Z: determina el nivel de empleo N**, que puede ser menor que el pleno empleo.",8,3],
["Función de oferta agregada (Z)","Precio de oferta agregado: ingreso que los empresarios necesitan esperar para contratar N trabajadores, Z = φ(N).",8,3],
["Función de demanda agregada (D)","Ingreso que los empresarios esperan recibir si contratan N: consumo más inversión, D = D(N).",8,3],
["Eficiencia marginal del capital","Tasa de descuento e que iguala el valor presente de los rendimientos esperados de un bien de capital con su costo: V₀ = Σ πₜ/(1 + e)ᵗ. Se invierte mientras e > i.",8,3],
["Propensión marginal a consumir","Fracción de un aumento del ingreso que se consume. Es menor que 1, por eso la demanda crece menos que la oferta cuando sube el empleo.",8,3],
["Preferencia por la liquidez","Demanda de dinero por los motivos transacción, precaución y especulación. Hace que la tasa de interés sea un fenómeno monetario.",9,3],
["Neutralidad del dinero","El dinero solo afecta los precios nominales, no las variables reales. Es el segundo «caballo de batalla» entre keynesianos y no keynesianos.",9,3],
["Efecto Pigou","Si los precios bajan, aumenta el valor real de los saldos monetarios, la riqueza y el consumo, lo que restablece el pleno empleo.",9,3],
["Trampa de la liquidez","Tasa de interés tan baja que la demanda de dinero es infinitamente elástica: más dinero no baja la tasa y la política monetaria pierde efecto (teoría especial de Keynes según Hicks).",10,3],
["Síntesis neoclásica","Interpretación de Keynes de Hicks, Modigliani y Patinkin con el modelo IS-LM: el desempleo se debe a rigideces de salarios o precios.",10,3],
["Decisión dual (Clower)","Si el hogar no logra vender todo el trabajo que quiere, su demanda efectiva de bienes depende del ingreso realizado y no de la nocional: la ley de Walras falla en desequilibrio.",10,3],
["Racionamiento (Barro-Grossman)","Equilibrios con precios fijos en los que algunos agentes no pueden vender o comprar lo que desean. Malinvaud distingue desempleo keynesiano y clásico.",10,3],
["Nuevo keynesianismo","Explica las rigideces con microfundamentos: contratos implícitos (Azariadis), salarios de eficiencia (Shapiro-Stiglitz), racionamiento del crédito (Stiglitz-Weiss) y costos de menú.",10,3],
["Curva de Phillips","Relación inversa entre inflación (o salarios nominales) y desempleo. Samuelson y Solow la presentan como un menú de política.",11,3],
["Monetarismo","Escuela de Friedman: nueva teoría cuantitativa, demanda de dinero estable y política monetaria con regla fija.",11,3],
["Expectativas adaptativas","La inflación esperada se corrige con una fracción del error pasado: πᵉₜ = πᵉₜ₋₁ + γ(πₜ₋₁ − πᵉₜ₋₁).",11,3],
["Tasa natural de desempleo","Desempleo compatible con una inflación estable, determinado por factores reales. Para Friedman es voluntario.",11,3],
["Expectativas racionales","Los agentes usan toda la información disponible y el modelo correcto: no cometen errores sistemáticos (Muth, Lucas).",11,3],
["Crítica de Lucas","Los parámetros de los modelos econométricos cambian cuando cambia la política, porque los agentes ajustan sus expectativas: no se pueden usar para evaluar políticas.",11,3],
["Superneutralidad","Con expectativas racionales, ni siquiera a corto plazo la política monetaria anticipada afecta el producto o el empleo.",11,3],
["Ciclos reales (RBC)","Las fluctuaciones son respuestas óptimas a choques reales de productividad; el desempleo es siempre voluntario.",11,3]
];

// Temas de ensayo con estructura sugerida (para el laboratorio de ensayo)
const ENSAYOS=[
{id:"merc",u:1,t:"¿Qué es la riqueza? Del mercantilismo a Smith",obj:"comparar las respuestas del mercantilismo monetario, el mercantilismo del valor, la fisiocracia y Smith a la pregunta por la naturaleza de la riqueza",sec:["La riqueza como metal precioso: Mun, la balanza comercial y la crítica de Hume","La búsqueda de la fuente de la riqueza: Petty, Cantillon y la fisiocracia","Smith: la riqueza como ingreso per cápita y el trabajo productivo"],con:"La pregunta pasa de qué es la riqueza a cómo se produce y se distribuye; Smith cambia el objeto de estudio al problema de la coordinación por los precios."},
{id:"smith",u:1,t:"El paradigma de Smith y la mano invisible",obj:"explicar por qué el problema de la coordinación de las decisiones por medio de los precios es el paradigma de la economía como ciencia",sec:["De la filosofía moral a la economía política: la ambición y el interés propio","El sistema de precios y el equilibrio: la «coexistencia pacífica»","Las consecuencias: una economía sin Estado y sin dinero, y la lectura de la mano invisible"],con:"El paradigma se resuelve con un equilibrio de trueque; queda abierta la pregunta por la estabilidad, que heredan Sraffa y Walras."},
{id:"sraffa",u:2,t:"Sraffa: precios sin valor-trabajo",obj:"mostrar cómo Sraffa determina los precios de producción y la tasa de beneficio a partir de la técnica y de la canasta salarial",sec:["Las cuatro hipótesis y el sistema Bp(1 + r) = p","El rechazo del trabajo comandado y los límites del trabajo incorporado","La gravitación: ¿convergen los precios de mercado a los de producción?"],con:"Sraffa resuelve la existencia del equilibrio clásico, pero la estabilidad depende de modelos de gravitación sin un resultado general."},
{id:"marx",u:2,t:"El problema de la transformación en Marx",obj:"evaluar si los precios de producción pueden derivarse de los valores-trabajo conservando sus propiedades",sec:["Valor, plusvalía y tasa de ganancia en la sociedad capitalista","La solución de Bortkiewicz y las invariancias","Las críticas: Okishio, Steedman y la gravitación marxiana"],con:"La transformación es coherente con una normalización, pero no conserva a la vez todas las igualdades; Steedman concluye que el valor-trabajo es redundante."},
{id:"walras",u:2,t:"Walras: existencia y estabilidad del equilibrio general",obj:"analizar la arquitectura del equilibrio general y los problemas del tanteo",sec:["Datos, supuestos e hipótesis del modelo","Existencia: ley de Walras, numerario y teoremas de punto fijo","Estabilidad: el subastador, la sustituibilidad bruta y Sonnenschein-Mantel-Debreu"],con:"Arrow y Debreu prueban la existencia, pero la estabilidad requiere hipótesis muy fuertes y un subastador ajeno a la descentralización."},
{id:"comp",u:2,t:"Clásicos contra neoclásicos: dos soluciones al paradigma de Smith",obj:"comparar las teorías de Sraffa y de Walras como respuestas al problema de la coordinación",sec:["El punto de partida: excedente y holismo frente a escasez e individualismo","Los precios: costos de reproducción frente a utilidad y productividad marginal","La estabilidad: gravitación frente a tanteo"],con:"Ambas resuelven la existencia en una economía de trueque y ambas fallan en mostrar una estabilidad general."},
{id:"fallos",u:2,t:"Los fallos de mercado y el método normativo",obj:"explicar cómo la teoría neoclásica usa el óptimo de Pareto como norma para analizar mercados reales",sec:["Del primer teorema del bienestar a la economía normativa (Friedman y Arrow)","Información asimétrica: el mercado de la salud","Externalidades y competencia imperfecta: Coase y Cournot"],con:"Los fallos se definen como desviaciones de un modelo ideal; las políticas buscan restaurar sus hipótesis."},
{id:"keynes",u:3,t:"Pigou y Keynes: dos explicaciones del desempleo",obj:"contrastar la teoría Clásica del empleo de Pigou con la teoría de la demanda efectiva de Keynes",sec:["La teoría Clásica: los dos postulados y la ley de Say","La crítica de Keynes: el rechazo del segundo postulado","La demanda efectiva y el desempleo involuntario de equilibrio"],con:"Para Pigou el desempleo es un fallo del mercado de trabajo; para Keynes es un resultado del funcionamiento normal de una economía monetaria."},
{id:"macro",u:3,t:"De Hicks a Lucas: el ascenso y la caída de la síntesis",obj:"reconstruir la historia de la antigua macroeconomía alrededor de la flexibilidad de los precios y la neutralidad del dinero",sec:["Hicks y la síntesis neoclásica: IS-LM y rigideces","La contrarrevolución: Clower, Barro-Grossman y el nuevo keynesianismo","Friedman y Lucas: tasa natural, expectativas y neutralidad"],con:"La discusión termina en los DSGE, que combinan microfundamentos de los nuevos clásicos con rigideces nuevas keynesianas."}
];

const TRUNK=[
{id:"mapa", t:"Mapa del curso y formato del parcial", nuevo:true, sim:"glos", html:String.raw`
<section><h3>De qué trata el curso</h3>
<p class="lead">El curso no es una lista de autores en orden cronológico. Sigue dos preguntas, que el libro de Tobón llama <b>paradigmas</b>: cómo individuos libres coordinan sus decisiones por medio de los precios (Smith) y qué determina el nivel de empleo (Keynes). Cada teoría se estudia como una respuesta a una de esas preguntas.</p>
<div class="tbl"><table><tr><th>Unidad</th><th>Pregunta</th><th>Estaciones</th><th>Libro</th></tr>
<tr><td>1. Introducción a las teorías económicas</td><td>¿Qué es la riqueza y cómo nace la economía como ciencia?</td><td>Sistemas económicos, mercantilismo, fisiocracia, Smith</td><td>Caps. 1 y 2</td></tr>
<tr><td>2. La coordinación por medio de los precios</td><td>¿Existe un sistema de precios que coordine las decisiones, y es estable?</td><td>Sraffa, Marx, Walras, fallos de mercado</td><td>Caps. 3 a 6</td></tr>
<tr><td>3. La determinación del nivel de empleo</td><td>¿Por qué hay desempleo involuntario?</td><td>Pigou, Keynes, de Hicks a Lucas</td><td>Caps. 7 a 11</td></tr></table></div>
<p>Evaluación del programa: tres parciales (20 %, 20 % y 30 %) y un final (30 %). Curso 1503723, 4 créditos, prerrequisito Microeconomía II.</p></section>
<section><h3>El formato del parcial</h3>
<p>Los parciales tienen siempre la misma estructura. Las ramas «Preparar el parcial» trabajan cada parte.</p>
<div class="tbl"><table><tr><th>Punto</th><th>Qué piden</th><th>Peso</th><th>Cómo prepararlo</th></tr>
<tr><td>1</td><td>Definir conceptos del área de estudio (a veces, resumir un video)</td><td class="num">10 %</td><td>Glosario y repaso de abajo: una definición de dos líneas con el autor y la idea clave</td></tr>
<tr><td>2</td><td>«Explique la teoría…»</td><td class="num">20 %</td><td>La guía de cinco pasos de cada estación: pregunta, hipótesis, mecanismo, resultado y crítica</td></tr>
<tr><td>3</td><td>Tabla de tres diferencias entre teorías</td><td class="num">20 %</td><td>Tablas comparativas ya armadas: cada fila es un criterio, no una frase suelta</td></tr>
<tr><td>4</td><td>Ensayo: título, introducción con objetivo, al menos tres secciones y conclusión</td><td class="num">50 %</td><td>Laboratorio de ensayo con estructura sugerida y lista de chequeo</td></tr></table></div>
<p class="warn"><b>El ensayo vale la mitad.</b> Un ensayo con objetivo explícito («El objetivo de este ensayo es…»), tres secciones con título y una conclusión que responda al objetivo suma más que uno largo sin estructura.</p></section>
<section><h3>Repaso de conceptos</h3><p>Filtra por unidad, lee el concepto, intenta definirlo y luego revela la definición del libro.</p></section>
${LAB}`,
qs:[{q:"¿Cuáles son los dos paradigmas alrededor de los que se organiza el curso?",a:"El de Smith: cómo se coordinan por medio de los precios las decisiones de individuos libres y descentralizados. El de Keynes: qué determina el nivel de empleo, de modo que el pleno empleo sea un caso particular y el desempleo involuntario sea posible."}]},

// ======================= UNIDAD 1 =======================
{id:"sistemas", t:"Sistemas económicos y etapas del capitalismo", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Antes de las teorías, el libro ubica el objeto de estudio: el capitalismo como un sistema económico histórico. Un sistema económico se define por tres aspectos.</p>
<div class="tbl"><table><tr><th>Aspecto</th><th>Pregunta</th><th>En el capitalismo</th></tr>
<tr><td>Producción</td><td>¿Cómo se organiza el trabajo?</td><td>Trabajo asalariado libre, bajo la dirección del capitalista</td></tr>
<tr><td>Propiedad</td><td>¿Quién es dueño de los medios de producción?</td><td>Propiedad privada</td></tr>
<tr><td>Mediación</td><td>¿Cómo se relacionan los individuos para obtener lo que necesitan?</td><td>El mercado y el dinero</td></tr></table></div>
<p>Los cinco sistemas del capítulo 1 son la comunidad primitiva, la esclavitud, el feudalismo, el capitalismo y el socialismo.</p></section>
<section><h3>Del feudalismo al capitalismo</h3>
<p>En el feudo, el siervo trabaja la tierra del señor y le entrega una parte de lo producido. Fuera del feudo quedan los <b>desarraigados</b>: artesanos, comerciantes y banqueros que viven en los burgos. De ellos nace la <b>burguesía</b>, que acumula riqueza con el comercio y termina convertida en la clase capitalista.</p></section>
<section><h3>Las cuatro etapas del capitalismo</h3>
<div class="tbl"><table><tr><th>Etapa</th><th>Periodo</th><th>Rasgos</th><th>Pensamiento asociado</th></tr>
<tr><td>Mercantil proteccionista</td><td>s. XIII – 1789</td><td>Estados absolutistas, compañías de las Indias, búsqueda de oro y plata, protección del comercio</td><td>Mercantilismo; la crítica de los fisiócratas y de Smith</td></tr>
<tr><td>Liberal</td><td>1789 – finales del s. XIX</td><td>Revolución francesa, primera Revolución Industrial, libre comercio, trabajo asalariado masivo</td><td>Smith, Ricardo; la crítica de Marx</td></tr>
<tr><td>Regulado</td><td>finales del s. XIX – 1973</td><td>Crisis de 1929, New Deal, Bretton Woods, Estado de bienestar, «treinta años gloriosos»</td><td>Keynes; la crítica de Hayek</td></tr>
<tr><td>Neoliberal</td><td>1973 en adelante</td><td>Fin de Bretton Woods, crisis del petróleo, giro del Reino Unido en 1976, Consenso de Washington, crisis de 2008 y de la covid, ascenso de los BRICS</td><td>Friedman, Lucas; las críticas heterodoxas</td></tr></table></div>
<p>El socialismo aparece con Marx y Engels, se realiza en la URSS y hoy se discute el «socialismo con características chinas». Schumpeter sostuvo que el capitalismo, por su propio éxito, terminaría transformándose en socialismo.</p></section>
${PARA("sistema económico, capitalismo, burguesía, etapas del capitalismo, Consenso de Washington",["Define sistema económico por sus tres aspectos: producción, propiedad y mediación.","Ubica el capitalismo frente a los otros cuatro sistemas.","Explica el paso del feudalismo al capitalismo con los desarraigados y la burguesía.","Recorre las cuatro etapas con su periodo, sus hechos y su teoría dominante.","Cierra con la crítica que acompaña cada etapa (Smith, Marx, Hayek, heterodoxos)."])}`,
qs:[{q:"¿Qué tres aspectos definen un sistema económico según el libro?",a:"La producción (cómo se organiza el trabajo), la propiedad (de quién son los medios de producción) y la mediación (cómo se relacionan los individuos para obtener lo que necesitan)."},
 {q:"¿Por qué la etapa regulada termina en 1973?",a:"Por el fin del sistema de Bretton Woods y la crisis del petróleo, que abren paso a la etapa neoliberal."}]},

{id:"mercantilismo", t:"La riqueza: mercantilismo monetario y del valor", sim:"merc", html:String.raw`
<section><h3>Cómo nace el pensamiento económico</h3>
<p class="lead">Para Weber, la Reforma protestante legitima el enriquecimiento como proyecto de vida digno. La Revolución Científica (Bacon, Galileo, Descartes) y el método de Locke y Newton dan la idea de que la sociedad, como la naturaleza, sigue leyes que la razón puede descubrir.</p>
<p>Los primeros escritos económicos giran alrededor de cuatro preguntas sobre la riqueza:</p>
<ol class="steps"><li>¿Qué es la riqueza?</li><li>¿Cómo se mide?</li><li>¿Para qué sirve?</li><li>¿Quién puede ser rico?</li></ol></section>
<section><h3>Mercantilismo monetario</h3>
<p>La riqueza son el oro y la plata, que tienen <b>valor intrínseco</b>. El rey fija el contenido metálico de la moneda (por ejemplo, 1 libra = 30 g de oro). Un país solo se enriquece si entra más metal del que sale, así que Thomas Mun recomienda una <b>balanza comercial positiva</b>: exportar más de lo que se importa.</p>
<p><b>Devaluación (ejemplo del libro).</b> Si 1 £ = 3 francos y el rey baja el contenido de la libra para que 1 £ = 2 francos, una bufanda inglesa de 4 £ que antes contenía 120 g de oro ahora contiene 80 g. Para el comprador francés la bufanda pasa de 12 a 8 francos: Inglaterra exporta más.</p>
<p><b>Las críticas.</b> Bodin observa que la llegada de metales de América eleva los precios (teoría cuantitativa). Hume lo convierte en el <b>mecanismo precio-flujo</b>: el oro que entra eleva los precios internos, las exportaciones se encarecen, las importaciones se abaratan y el oro vuelve a salir. Una balanza positiva permanente es imposible.</p></section>
<section><h3>Mercantilismo del valor</h3>
<p>Petty, Cantillon y Steuart buscan la riqueza en la producción y distinguen dos precios: el corriente (de mercado) y uno especial, que más tarde se llamará precio de equilibrio.</p>
<div class="tbl"><table><tr><th>Autor</th><th>Precio especial</th><th>Idea</th></tr>
<tr><td>Petty (1690)</td><td>Precio natural</td><td>La renta natural de la tierra: el excedente agrícola en valor después de reponer los costos</td></tr>
<tr><td>Cantillon</td><td>Valor intrínseco</td><td>Se mide por la tierra y el trabajo que entran en la producción</td></tr>
<tr><td>Steuart (1767)</td><td>Valor adecuado</td><td>El costo de producción o «valor real»</td></tr></table></div>
<p>Cartelier (1981) formaliza a Petty con dos bienes, uno agrícola y uno no agrícola: dos ecuaciones de producción determinan el precio relativo y con él el producto neto. El fracaso del mercantilismo del valor es que confunde la riqueza, su fuente (tierra y trabajo) y su medida, y no tiene una idea clara de equilibrio.</p></section>
${PARA("mercantilismo monetario, mercantilismo del valor, balanza comercial, teoría cuantitativa, mecanismo precio-flujo, precio natural, valor intrínseco",["Plantea las cuatro preguntas sobre la riqueza.","Expón la respuesta monetaria: riqueza = metal, balanza positiva (Mun), devaluación.","Presenta la crítica: teoría cuantitativa (Bodin) y precio-flujo (Hume).","Expón la respuesta del valor: el precio natural de Petty, el valor intrínseco de Cantillon y el valor adecuado de Steuart.","Cierra con su límite: confunden riqueza, fuente y medida, y no definen el equilibrio."])}
${LAB}`,
qs:[{q:"¿Por qué el mecanismo de Hume destruye la recomendación de Mun?",a:"Porque el oro que entra con una balanza positiva eleva los precios internos; las exportaciones se encarecen, las importaciones se abaratan, la balanza se vuelve negativa y el oro sale. La acumulación permanente de metal es imposible."},
 {q:"Con 1 £ = 30 g y un franco de 10 g, ¿qué pasa con una mercancía de 4 £ si la libra baja a 20 g?",a:"Antes contenía 120 g (12 francos); ahora 80 g (8 francos). Para el extranjero se abarata un tercio y las exportaciones aumentan."}]},

{id:"fisiocracia", t:"La fisiocracia: producto neto y orden natural", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Para los fisiócratas (Quesnay, Mirabeau, Turgot como disidente) la riqueza nace de la tierra: solo la agricultura produce más de lo que consume. Su obra central es el <i>Análisis de la fórmula aritmética del Tableau économique</i> de Quesnay (1766).</p></section>
<section><h3>Las tres clases</h3>
<div class="tbl"><table><tr><th>Clase</th><th>Quiénes</th><th>Papel</th></tr>
<tr><td>Productiva</td><td>Agricultores arrendatarios</td><td>Producen el producto neto con sus adelantos</td></tr>
<tr><td>Terratenientes</td><td>Rey, nobleza y clero</td><td>Reciben el producto neto como renta (tributo señorial o diezmo)</td></tr>
<tr><td>Estéril</td><td>Artesanos y comerciantes</td><td>Transforman o intercambian, pero solo reponen lo que consumen</td></tr></table></div>
<p>El <b>producto neto</b> es lo que sobra de la cosecha después de reponer los adelantos de la clase productiva. El Tableau muestra cómo circula entre las clases para que la economía se reproduzca año tras año.</p>
<p class="warn"><b>Ojo:</b> los adelantos no son capital y no hay beneficio capitalista. El excedente es un don de la naturaleza que va a los terratenientes, no la remuneración de un capital.</p></section>
<section><h3>La doctrina</h3>
<p>Las cuatro políticas que proponen durante el reinado de Luis XV, contra el colbertismo:</p>
<ol class="steps"><li>Reducir los incentivos a las actividades de los financistas.</li><li>Eliminar los privilegios monopólicos en la producción artesanal y el comercio de lujo.</li><li>Simplificar los impuestos y crear un <b>impuesto único sobre la renta de la tierra</b>, porque es el único excedente.</li><li>Eliminar las restricciones a la producción y al comercio: <i>laissez faire, laissez passer</i> (Gournay).</li></ol>
<p>Lo justifican con la idea de un <b>orden natural</b>: la sociedad sigue leyes físicas inmutables, como la gravedad, y el gobernante debe respetarlas, no inventarlas.</p></section>
<section><h3>Comparación con el mercantilismo</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Mercantilismo monetario</th><th>Fisiocracia</th></tr>
<tr><td>Qué es la riqueza</td><td>El metal precioso</td><td>El producto agrícola</td></tr>
<tr><td>De dónde viene</td><td>Del comercio exterior (balanza positiva)</td><td>De la tierra (producto neto)</td></tr>
<tr><td>Política</td><td>Proteccionismo, intervención del Estado</td><td>Laissez faire, impuesto único</td></tr></table></div></section>
${PARA("fisiocracia, producto neto, Tableau économique, clase estéril, adelantos, laissez faire, orden natural",["Presenta la escuela y su obra: Quesnay y el Tableau (1766).","Define las tres clases y el producto neto.","Explica por qué solo la agricultura es productiva y por qué no hay beneficio capitalista.","Expón las cuatro políticas y el orden natural.","Compara con el mercantilismo y anuncia a Smith, que extiende el excedente a la industria."])}`,
qs:[{q:"¿Por qué la clase estéril se llama así si los artesanos trabajan?",a:"Porque para los fisiócratas solo reponen el valor de lo que consumen (materias primas y subsistencia): no generan producto neto. Solo la tierra da un excedente."},
 {q:"¿Por qué proponen un impuesto único sobre la renta de la tierra?",a:"Porque la renta es el único excedente de la economía. Gravar otras actividades solo trasladaría el impuesto, que al final recaería sobre el producto neto."}]},

{id:"smith", t:"Smith: el nacimiento de la economía como ciencia", sim:"smith", html:String.raw`
<section><h3>De la filosofía moral a la economía política</h3>
<p class="lead">Smith escribe dentro de la filosofía moral (Hobbes, Rousseau, Hume, Hutcheson, Mandeville). En la <i>Teoría de los sentimientos morales</i> (1759) justifica el enriquecimiento: la parábola del joven pobre ambicioso que admira al rico y dedica su vida a la riqueza muestra que la ambición mueve la industria de la sociedad. Aquí aparece por primera vez la <b>mano invisible</b>.</p></section>
<section><h3>La riqueza de las naciones (1776)</h3>
<p>Smith distingue dos sociedades: una de <b>artesanos</b> independientes (el herrero que produce y vende sus herramientas) y una <b>capitalista</b>, en la que unos son dueños de los medios de producción y otros venden su trabajo. Define la riqueza como el ingreso per cápita:</p>
<div class="mj">\[\frac{Y}{L}=\frac{q\cdot N}{L}\]</div>
<p>donde \(q\) es la productividad del trabajo, \(N\) el número de trabajadores productivos y \(L\) la población. La riqueza crece con la <b>división del trabajo</b> (que eleva \(q\)) y con la proporción de <b>trabajo productivo</b>. Además impone una norma de distribución: el beneficio es el ingreso específico del capital, junto al salario y la renta.</p></section>
<section><h3>El paradigma de Smith</h3>
<p>La pregunta que funda la ciencia económica es: <b>¿cómo logran coordinarse individuos descentralizados, libres y anónimos, que solo buscan su interés, sin que nadie lo planee?</b> La respuesta es un <b>sistema de precios</b>.</p>
<p class="link">«No es la benevolencia del carnicero, del cervecero o del panadero lo que nos procura nuestra cena, sino el cuidado que ponen en su propio interés.»</p>
<p>La solución es un <b>equilibrio</b>, que Machlup define como una «coexistencia pacífica» de variables ajustadas entre sí, sin tendencia al cambio. El equilibrio no es justo ni injusto: los precios solo asignan la riqueza disponible. El juicio ético lo emite un observador externo (ejemplo del vino y el queso, en el laboratorio).</p></section>
<section><h3>Las consecuencias</h3>
<ul><li><b>Sin dinero:</b> los precios del paradigma son relativos, de trueque. De ahí la dicotomía real-monetaria que hereda la teoría.</li>
<li><b>Sin Estado:</b> la coordinación no necesita un planificador. Smith deja al Estado tres funciones: defensa, justicia y obras públicas.</li>
<li><b>La mano invisible:</b> Hahn, Patinkin y Tobin la ven como la gran pregunta de la teoría económica; Blaug sostiene que Smith la usó con ironía.</li></ul>
<p>El problema queda planteado en dos partes: la <b>existencia</b> de un sistema de precios de equilibrio y su <b>estabilidad</b>. Toda la unidad 2 trabaja sobre ellas.</p></section>
${PARA("filosofía moral, riqueza según Smith, trabajo productivo, división del trabajo, paradigma de Smith, mano invisible, equilibrio, dicotomía real-monetaria",["Ubica a Smith en la filosofía moral y la Teoría de los sentimientos morales.","Define la riqueza como ingreso per cápita y explica sus dos determinantes.","Formula el paradigma: coordinación descentralizada por los precios.","Explica la solución (el equilibrio de Machlup) y que no implica juicio ético.","Cierra con las consecuencias: sin Estado, sin dinero, y el doble problema de existencia y estabilidad."])}
${LAB}`,
qs:[{q:"¿Por qué se dice que el paradigma de Smith se resuelve en una economía sin dinero?",a:"Porque la coordinación se explica con precios relativos de equilibrio (de trueque). El dinero no cumple ningún papel esencial, de ahí la dicotomía entre la teoría de los precios relativos y la del nivel de precios."},
 {q:"En el ejemplo del vino y el queso, ¿el equilibrio es injusto?",a:"No para la teoría: ambos individuos obtienen lo que buscaban, así que es un equilibrio. Que A termine «mejor» que B es un juicio ético de un observador externo, no una propiedad del equilibrio."}]},

// ======================= UNIDAD 2 =======================
{id:"sraffa", t:"Sraffa: la teoría clásica de los precios de producción", sim:"sraffa", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Sraffa (1960) responde al paradigma de Smith desde la tradición clásica: los precios son los que permiten reproducir la economía, pagando los insumos y los salarios y remunerando el capital a una tasa de beneficio uniforme. No necesita utilidades ni valores-trabajo.</p></section>
<section><h3>Del sistema general al sistema de Sraffa</h3>
<p>Cada capitalista \(i\) usa \(a_{ij}\) unidades del bien \(j\) y \(l_i\) horas de trabajo por unidad de su bien. La ecuación de producción es</p>
<div class="mj">\[(a_{i1}p_1+\dots+a_{in}p_n+l_iw_i)(1+r_i)=p_i\qquad(3.1)\]</div>
<p>Hay \(n\) ecuaciones y \(3n\) incógnitas (precios, salarios y tasas). Cuatro hipótesis cierran el sistema:</p>
<div class="tbl"><table><tr><th>Hipótesis</th><th>Contenido</th><th>Efecto</th></tr>
<tr><td>A</td><td>Salario único: \(w_i=w\)</td><td>Competencia entre trabajadores</td></tr>
<tr><td>B</td><td>Salario en bienes: \(w=\sum_j s_jp_j\), con canasta \(s\) dada</td><td>Se integra al insumo: \(b_{ij}=a_{ij}+l_is_j\)</td></tr>
<tr><td>C</td><td>Tasa de beneficio uniforme: \(r_i=r\)</td><td>Competencia entre capitalistas</td></tr>
<tr><td>D</td><td>Numerario: un precio igual a 1</td><td>Solo hay precios relativos (no hay dinero)</td></tr></table></div>
<div class="mj">\[Bp\,(1+r)=p\quad\Longleftrightarrow\quad Bp=\lambda p,\qquad \lambda=\frac{1}{1+r}\]</div>
<p>Si la economía genera un <b>excedente social</b> y todos los bienes son básicos (matriz irreducible), el <b>teorema de Perron-Frobenius</b> garantiza un valor propio dominante \(0&lt;\lambda&lt;1\) con un vector de precios positivo. Ese es el equilibrio clásico: dada la técnica y la canasta salarial, existen precios relativos y una tasa de beneficio positiva. No es un óptimo de Pareto: es un equilibrio de reproducción.</p></section>
<section><h3>Trabajo comandado y trabajo incorporado</h3>
<p><b>Smith (trabajo comandado).</b> Si el valor de un bien es el trabajo que compra, \(P/w\), con Sraffa se obtiene \(P/w=L(1+r)\): depende de la tasa de beneficio, así que no es una medida invariable. Se rechaza.</p>
<p><b>Ricardo (trabajo incorporado).</b> Los precios relativos son iguales a los cocientes de trabajo solo si la <b>composición del capital</b> \(q_i=\sum_j a_{ij}p_j/(l_iw)\) es igual en todos los sectores. En general no lo es. Ricardo buscó una medida invariable (el modelo trigo-trigo) y Sraffa la construyó: la <b>mercancía patrón</b>, con la que la relación salario-beneficio es lineal.</p></section>
<section><h3>La gravitación</h3>
<p>Con los precios de producción se resuelve la existencia. La estabilidad se estudia con la <b>gravitación</b>: si un sector es más rentable, los capitalistas le llevan capital, aumenta su oferta y baja su precio. La rama «Gravitación» tiene el modelo de Boggio y un simulador.</p></section>
${PARA("precio de producción, excedente social, canasta de subsistencia, Perron-Frobenius, numerario, trabajo comandado, trabajo incorporado, composición del capital, mercancía patrón, gravitación",["Pregunta: ¿qué precios permiten reproducir una economía capitalista?","Hipótesis A a D y el sistema \\(Bp(1+r)=p\\).","Resultado: Perron-Frobenius da precios positivos y \\(r>0\\) si hay excedente.","Consecuencias: se rechaza el trabajo comandado; el incorporado solo vale con igual composición.","Límite: la estabilidad depende de modelos de gravitación sin resultado general."])}
${LAB}`,
deep:[{k:"Matrices",t:"Por qué el sistema solo determina precios relativos",html:String.raw`<p>Si \(p\) resuelve \(Bp(1+r)=p\), también lo resuelve \(2p\) o \(100p\): multiplicar todos los precios por un número no cambia la ecuación. Por eso se fija un numerario. El sistema tiene \(n\) ecuaciones y \(n\) incógnitas: \(n-1\) precios relativos más la tasa \(r\).</p>`}],
qs:[{q:"¿Qué garantiza el teorema de Perron-Frobenius en Sraffa?",a:"Que si B es no negativa e irreducible, su valor propio dominante λ está asociado a un vector de precios estrictamente positivo; si además hay excedente, 0 < λ < 1 y la tasa de beneficio r = 1/λ − 1 es positiva."},
 {q:"¿Cuándo coinciden los precios de Sraffa con el trabajo incorporado?",a:"Cuando la composición del capital (medios de producción sobre salarios) es igual en todos los sectores. Pruébalo en el laboratorio con el ejemplo «Composición igual»."}]},

{id:"marx", t:"Marx: valores-trabajo y transformación en precios", sim:"marx", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Marx critica a los clásicos desde el <b>holismo</b>: parte de las relaciones sociales y no de los individuos (rechaza las «robinsonadas»). Explica de dónde sale el beneficio con la teoría del valor-trabajo y la plusvalía, y luego intenta mostrar que los precios de producción se derivan de los valores: es el <b>problema de la transformación</b>.</p></section>
<section><h3>El valor en una sociedad de artesanos</h3>
<p>El valor de una mercancía es el trabajo <b>abstracto socialmente necesario</b>, directo e indirecto (Morishima):</p>
<div class="mj">\[\lambda=A\lambda+L\quad\Longrightarrow\quad \lambda=(I-A)^{-1}L\]</div></section>
<section><h3>El capital y la plusvalía</h3>
<p>En la sociedad capitalista el dinero se convierte en capital: D – M – D′, con D′ &gt; D. El capitalista compra medios de producción (capital constante \(C\)) y <b>fuerza de trabajo</b> (capital variable \(V\)). La fuerza de trabajo crea más valor del que cuesta: la diferencia es la <b>plusvalía</b> \(S\).</p>
<div class="mj">\[Y=C+V+S,\qquad e=\frac{S}{V},\qquad r=\frac{S}{C+V}\]</div>
<p><b>Ejemplo del libro.</b> El capitalista adelanta 150 £ en medios de producción y 30 £ en fuerza de trabajo; con una tasa de explotación del 100 %, \(S=30\) £, \(Y=210\) £ y \(r=30/180=16{,}6\,\%\).</p></section>
<section><h3>La transformación (Bortkiewicz-Sweezy)</h3>
<p>Si la composición del capital difiere entre sectores, una tasa de explotación uniforme da tasas de ganancia distintas en valor; la competencia exige una tasa uniforme en precios. Con tres sectores (medios de producción, bienes salariales y bienes de lujo) en reproducción simple, se buscan transformadores \(x\), \(y\), \(z\) tales que</p>
<div class="mj">\[(xC_i+yV_i)(1+r)=\begin{cases}xY_1&i=1\\ yY_2&i=2\\ zY_3&i=3\end{cases},\qquad z=1\]</div>
<p>El sistema tiene solución, pero en general no se conservan a la vez las dos igualdades de Marx (valor total = precio total y plusvalía total = beneficio total). El resultado depende de la normalización.</p></section>
<section><h3>Las críticas</h3>
<ul><li><b>Okishio:</b> una innovación que reduce costos con salario real dado no baja la tasa de beneficio, contra la ley de la baja tendencial.</li>
<li><b>Steedman:</b> los precios y la tasa se obtienen directamente de la técnica y del salario real con Sraffa. Los valores son redundantes y propone abandonarlos. Shaikh defiende la transformación iterativa.</li>
<li><b>Gravitación marxiana:</b> la competencia intersectorial e intrasectorial no garantiza la estabilidad. Benetti y Cartelier proponen un enfoque monetario.</li></ul></section>
${PARA("holismo, trabajo abstracto, valor-trabajo socialmente necesario, fuerza de trabajo, plusvalía, capital constante, capital variable, tasa de explotación, tasa de ganancia, transformación, Okishio, Steedman",["Pregunta: ¿de dónde sale el beneficio y cómo se relacionan valores y precios?","Método holista y crítica a los clásicos (trabajo concreto y abstracto).","Valor y plusvalía: \\(Y=C+V+S\\), \\(e\\) y \\(r\\), con el ejemplo 150 + 30.","La transformación de Bortkiewicz con \\(z=1\\) y sus invariancias.","Las críticas: Okishio, Steedman, gravitación marxiana."])}
${LAB}`,
qs:[{q:"Con C = 150, V = 30 y e = 100 %, ¿cuánto valen S, Y y r?",a:"S = e·V = 30, Y = C + V + S = 210, r = S/(C + V) = 30/180 = 16,6 %."},
 {q:"En el ejemplo de Bortkiewicz, ¿qué igualdad se conserva y cuál no?",a:"Con z = 1 se conserva plusvalía total = beneficio total (200), pero el precio total (1.000) no es igual al valor total (875)."}]},

{id:"walras", t:"Walras: el equilibrio general neoclásico", sim:"walras", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La respuesta neoclásica al paradigma de Smith parte de individuos racionales (individualismo metodológico) y del valor subjetivo: los precios reflejan utilidades y productividades marginales. Walras (<i>Elementos</i>, 1874) plantea el equilibrio de todos los mercados a la vez; Arrow y Debreu (1954) demuestran su existencia.</p></section>
<section><h3>Los pilares</h3>
<p><b>Empresa:</b> \(\max\; p\,f(K,N)-rK-wN\Rightarrow PMg_K=r/p,\ PMg_N=w/p\). Con rendimientos constantes el beneficio es cero (rompecabezas que Samuelson explica con la libre entrada).</p>
<p><b>Consumidor:</b> \(TMS=\dfrac{UMg_i}{UMg_m}=\dfrac{p_i}{p_m}\).</p></section>
<section><h3>La arquitectura del modelo</h3>
<p>Datos (preferencias, técnicas, dotaciones), supuestos y diez hipótesis: propiedad privada sin Estado, competencia perfecta, precios semipositivos, no hay intercambios en desequilibrio, flexibilidad de precios, sin costos de transacción (trueque), sin externalidades, un solo período, mercados completos e información perfecta.</p>
<p>Las decisiones dan funciones de <b>demanda excedente</b> \(Z_i(p)\). Por las restricciones presupuestarias se cumple la <b>ley de Walras</b>:</p>
<div class="mj">\[\sum_{i=1}^{n}p_iZ_i(p)=0\]</div>
<p>Si \(n-1\) mercados están en equilibrio, el último también: hay \(n-1\) ecuaciones independientes y se fija un numerario. La existencia se prueba con teoremas de punto fijo (Brouwer, Kakutani).</p></section>
<section><h3>La estabilidad: el tanteo</h3>
<p>Un <b>subastador</b> anuncia precios, mide las demandas excedentes y corrige: \(dp_i/dt=\vartheta Z_i(p)\). No hay intercambios hasta llegar al equilibrio. Con <b>sustituibilidad bruta</b>, el proceso es estable (Arrow-Hurwicz).</p>
<p>Las críticas: el subastador es un planificador central en una teoría de la descentralización (Benetti); Scarf construyó economías en las que el tanteo no converge; el teorema de <b>Sonnenschein-Mantel-Debreu</b> muestra que la demanda excedente agregada puede tener casi cualquier forma, así que no hay estabilidad general. Ostroy y Starr muestran que el intercambio descentralizado necesita dinero.</p></section>
<section><h3>Bienestar</h3>
<p>Primer teorema: todo equilibrio competitivo es un óptimo de Pareto. Segundo: todo óptimo puede alcanzarse con una redistribución de dotaciones. Aumann relaciona el equilibrio con el núcleo. Hahn evalúa la teoría como un punto de referencia para saber qué hace falta para que el mercado funcione, más que como una descripción.</p></section>
${PARA("individualismo metodológico, homo economicus, utilidad marginal, productividad marginal, equilibrio general, ley de Walras, demanda excedente, tanteo, subastador, sustituibilidad bruta, Sonnenschein-Mantel-Debreu, óptimo de Pareto",["Pregunta: ¿existe un vector de precios que equilibre todos los mercados, y es estable?","Pilares: maximización del consumidor y de la empresa.","Arquitectura: hipótesis, demandas excedentes, ley de Walras, numerario, punto fijo.","Estabilidad: el tanteo con subastador y sustituibilidad bruta.","Críticas: Scarf, SMD, el subastador; y la lectura de bienestar."])}
${LAB}`,
qs:[{q:"¿Por qué en el equilibrio general solo hay n − 1 ecuaciones independientes?",a:"Por la ley de Walras: Σ pᵢZᵢ = 0. Si n − 1 mercados tienen demanda excedente nula, el valor del último también es cero. Por eso se fija un numerario."},
 {q:"¿Qué dice el teorema de Sonnenschein-Mantel-Debreu sobre el tanteo?",a:"Que las hipótesis sobre los individuos no restringen la forma de la demanda excedente agregada (salvo continuidad, homogeneidad y ley de Walras), así que no se puede garantizar en general ni la unicidad ni la estabilidad del equilibrio."}]},

{id:"fallos", t:"Fallos de mercado: la economía normativa", sim:"cournot", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Si el equilibrio competitivo es un óptimo de Pareto (primer teorema), cualquier mercado real que se aleje de las hipótesis puede analizarse como un <b>fallo</b>. Koopmans llama a ese criterio «eficiencia»; el segundo teorema justifica redistribuir sin intervenir los precios.</p></section>
<section><h3>El método</h3>
<p><b>Friedman (1953):</b> el realismo de los supuestos no importa; importa que la teoría prediga bien. <b>Arrow:</b> el «método normativo de la economía positiva» tiene cuatro etapas: se toma el modelo competitivo como norma, se identifica qué hipótesis falla en el mercado real, se explica la institución existente como respuesta al fallo y se evalúan las políticas que acercan el mercado a la norma.</p></section>
<section><h3>Tres mercados</h3>
<div class="tbl"><table><tr><th>Mercado</th><th>Hipótesis que falla</th><th>Problemas</th><th>Respuesta</th></tr>
<tr><td>Salud (Arrow 1963)</td><td>Información perfecta</td><td>Información asimétrica, riesgo moral, selección adversa</td><td>Seguro médico, ética profesional, regulación (segundo mejor)</td></tr>
<tr><td>Ambiente</td><td>Sin externalidades</td><td>Contaminación, polizón, tragedia de los comunes</td><td>Impuestos, derechos de propiedad (Coase)</td></tr>
<tr><td>Industria</td><td>Competencia perfecta</td><td>Oligopolio: equilibrio de Nash ineficiente</td><td>Política de competencia</td></tr></table></div>
<p><b>Coase:</b> con derechos de propiedad definidos y sin costos de transacción, la negociación lleva al óptimo sin importar a quién se asignan los derechos. Las críticas señalan que los costos de transacción casi nunca son nulos y que la asignación de derechos sí afecta la distribución.</p></section>
<section><h3>El duopolio de Cournot del libro</h3>
<p>Demanda \(p=120-(Y_A+Y_B)\) y costo fijo de 200. En el equilibrio de Nash cada empresa produce 40 y gana 1.400. Si forman un cartel y producen 30 cada una, ganan 1.600. Pero si una produce 40 mientras la otra cumple con 30, gana 1.800 y la otra 1.300. Por eso el cartel no se sostiene: el equilibrio de Nash no es un óptimo de Pareto (para las empresas).</p></section>
${PARA("fallo de mercado, información asimétrica, riesgo moral, selección adversa, externalidad, tragedia de los comunes, teorema de Coase, polizón, equilibrio de Nash",["Pregunta: ¿qué pasa cuando falla alguna hipótesis del equilibrio general?","Fundamento normativo: primer y segundo teorema, Koopmans.","Método: Friedman y las cuatro etapas de Arrow.","Aplicaciones: salud, ambiente (Coase), industria (Cournot).","Límite: el fallo se define respecto a un ideal; Coase depende de costos de transacción nulos."])}
${LAB}`,
qs:[{q:"En el ejemplo de Cournot, ¿por qué el cartel 30-30 no es un equilibrio?",a:"Porque si la otra produce 30, a cada empresa le conviene producir más: con 40 gana 1.800 en vez de 1.600. Las dos tienen incentivos a desviarse y terminan en el equilibrio de Nash 40-40, con 1.400 cada una."}]},

// ======================= UNIDAD 3 =======================
{id:"pigou", t:"Pigou: la teoría Clásica del empleo", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Keynes llama «teoría Clásica» a la de Pigou y los neoclásicos: el equilibrio general walrasiano con el corto plazo de Marshall. El empleo se determina en el mercado de trabajo y, gracias a la <b>ley de Say</b> (la oferta crea su propia demanda), hay pleno empleo.</p></section>
<section><h3>Los dos postulados</h3>
<p><b>Primer postulado (demanda de trabajo).</b> Con \(y=N^a\), la empresa contrata hasta que el salario real iguala la productividad marginal:</p>
<div class="mj">\[\frac{w}{p}=PMg_N=aN^{a-1}\]</div>
<p><b>Segundo postulado (oferta de trabajo).</b> El hogar con utilidad \(U=x^a(\bar N-N^s)^{1-a}\) ofrece trabajo hasta que el salario real iguala la tasa marginal de sustitución entre ocio y consumo: la utilidad del salario iguala la desutilidad marginal del trabajo.</p>
<p>La ley de Walras y la ley de Say son equivalentes en este marco (Patinkin precisa cuándo).</p></section>
<section><h3>El desempleo en la teoría Clásica</h3>
<p>Si el salario real es flexible, el mercado de trabajo se equilibra y todo desempleo es <b>voluntario</b> (quien no trabaja no acepta el salario vigente) o friccional. El desempleo involuntario solo aparece si el salario real queda <b>rígido por encima del equilibrio</b>: la oferta \(N^s\) supera a la demanda \(N^d\) (figura 7.1). La causa son fallos del mercado: sindicatos, salario mínimo. El remedio: bajar los salarios.</p>
<div data-vis="pigou"></div></section>
<section><h3>La crítica de Keynes</h3>
<p>Keynes construye su paradigma contra esta teoría: quiere una teoría <b>general</b> en la que el pleno empleo sea un caso particular. Rechaza que los trabajadores puedan fijar su salario real (negocian salarios monetarios) y sostiene que una baja de salarios puede empeorar el desempleo al reducir la demanda.</p></section>
${PARA("ley de Say, teoría Clásica, primer postulado, segundo postulado, desempleo voluntario, desempleo involuntario, paradigma de Keynes",["Pregunta: ¿qué determina el nivel de empleo?","Marco: equilibrio general walrasiano más el corto plazo de Marshall, ley de Say.","Mecanismo: los dos postulados determinan N y w/p en el mercado de trabajo.","Resultado: pleno empleo; el desempleo involuntario solo con salario real rígido (fallos).","Crítica de Keynes: rechaza el segundo postulado y la ley de Say."])}`,
qs:[{q:"Según la teoría Clásica, ¿de dónde viene el desempleo involuntario?",a:"De un salario real rígido por encima del de equilibrio, por sindicatos o salario mínimo. A ese salario la oferta de trabajo supera a la demanda y la diferencia Nˢ − Nᵈ es el desempleo involuntario."}]},

{id:"keynes", t:"Keynes: la demanda efectiva", sim:"emk", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En la <i>Teoría general</i> (1936), el empleo no se decide en un mercado de trabajo: Keynes acepta el primer postulado y rechaza el segundo, lo que equivale a la «inexistencia» del mercado de trabajo. El empleo lo fija la <b>demanda efectiva</b>.</p></section>
<section><h3>Las siete hipótesis</h3>
<ol class="steps"><li>Economía monetaria (hay dinero).</li><li>Competencia perfecta.</li><li>El salario monetario \(w\) es exógeno.</li><li>Corto plazo (capital y técnica dados).</li><li>Precios flexibles.</li><li>Información imperfecta: las decisiones dependen de anticipaciones.</li><li>Un bien global: \(Y=PQ\).</li></ol></section>
<section><h3>El principio de la demanda efectiva</h3>
<p>Siguiendo el diagrama de Weintraub, hay dos funciones del empleo \(N\):</p>
<div class="mj">\[Z=\varphi(N)\ \text{(precio de oferta agregado)},\qquad D=D(N)=C(N)+I\ \text{(precio de demanda agregado)}\]</div>
<p>\(Z\) es el ingreso que los empresarios necesitan esperar para contratar \(N\); \(D\) es el que esperan recibir. Como la propensión marginal a consumir es menor que 1, \(D\) crece menos que \(Z\). El corte \(E^{**}\) da el empleo \(N^{**}\), que puede estar por debajo del pleno empleo \(N^*\): <b>desempleo involuntario de equilibrio</b>. Es la «antiley de Say»: la demanda determina la producción.</p>
<div data-vis="zd"></div>
<p>La ley de Walras no se cumple: con desempleo involuntario, la suma de las demandas excedentes en valor es negativa.</p></section>
<section><h3>La inversión y la política</h3>
<p>La <b>eficiencia marginal del capital</b> \(e\) es la tasa que iguala el costo de un bien de capital con el valor presente de sus rendimientos esperados:</p>
<div class="mj">\[V_0=\sum_{t=1}^{n}\frac{\pi_t}{(1+e)^t}\]</div>
<p>Se invierte si \(e&gt;i\). Bajar la tasa de interés no basta cuando las expectativas son pesimistas: el Estado debe cooperar con la inversión (gasto público). El laboratorio calcula \(e\).</p></section>
${PARA("demanda efectiva, función de oferta agregada Z, función de demanda agregada D, propensión marginal a consumir, eficiencia marginal del capital, desempleo involuntario",["Pregunta: ¿qué determina el empleo si no hay un mercado de trabajo que se equilibre?","Hipótesis 1 a 7 y el rechazo del segundo postulado.","Mecanismo: Z = φ(N) y D = D(N); el corte da N**.","Resultado: N** < N* es un equilibrio con desempleo involuntario; la ley de Walras falla.","Política: eficiencia marginal del capital, límites de la política monetaria, papel del Estado."])}
${LAB}`,
qs:[{q:"¿Por qué una baja del salario monetario no elimina el desempleo en Keynes?",a:"Porque el empleo depende de la demanda efectiva. Medidas en unidades de salario, Z y D no cambian si solo baja w; y si la baja reduce el consumo, empeora las expectativas o aumenta el peso real de las deudas, la demanda y el empleo pueden caer."},
 {q:"¿Cuándo se invierte según Keynes?",a:"Cuando la eficiencia marginal del capital (la tasa de rendimiento esperada) supera a la tasa de interés."}]},

{id:"hicks", t:"Keynesianismo neoclásico: de Hicks a los nuevos keynesianos", html:String.raw`
<section><h3>Dos caballos de batalla</h3>
<p class="lead">La macroeconomía posterior a Keynes se divide entre keynesianos (poskeynesianos heterodoxos y keynesianos neoclásicos) y no keynesianos. La discusión gira alrededor de dos preguntas: <b>(1)</b> ¿los precios y salarios son flexibles o rígidos? <b>(2)</b> ¿es eficaz la política monetaria o el dinero es neutral?</p>
<p>Del lado clásico está la teoría cuantitativa de Cambridge \(M=kY\) y el efecto Pigou; del lado keynesiano, la preferencia por la liquidez (motivos transacción y especulación), que hace que el dinero no sea neutral: \(\varepsilon=\frac{dP}{dM}\frac{M}{P}&lt;1\).</p></section>
<section><h3>Hicks (1937): cuatro modelos</h3>
<div class="tbl"><table><tr><th>Modelo</th><th>Dinero</th><th>Inversión</th><th>Ahorro</th><th>Lectura</th></tr>
<tr><td>I. Clásico</td><td>\(M=kY\)</td><td>\(I=f(i)\)</td><td>\(S=g(Y,i)\)</td><td>LM vertical: la monetaria mueve Y, la fiscal solo sube i</td></tr>
<tr><td>II. Teoría especial</td><td>\(M=L(i)\)</td><td>—</td><td>\(S=s(Y)\)</td><td>Trampa de la liquidez: LM horizontal, la monetaria no sirve</td></tr>
<tr><td>III. Teoría general de Keynes</td><td>\(M=L(Y,i)\)</td><td>\(I=f(i)\)</td><td>\(S=s(Y)\)</td><td>LM con pendiente positiva</td></tr>
<tr><td>IV. IS-LM generalizado</td><td>\(M=L(Y,i)\)</td><td>\(I=f(Y,i)\)</td><td>\(S=g(Y,i)\)</td><td>El caso general de la síntesis</td></tr></table></div>
<div data-vis="hicks"></div></section>
<section><h3>La síntesis y la contrarrevolución</h3>
<ul><li><b>Modigliani:</b> la oferta de trabajo tiene un tramo perfectamente elástico al salario \(w_0\): el desempleo se debe a la rigidez del salario monetario.</li>
<li><b>Patinkin:</b> el desempleo es un fenómeno de desequilibrio por la lentitud (viscosidad) del tanteo.</li>
<li><b>Clower (decisión dual):</b> si el hogar no vende todo su trabajo, demanda bienes según su ingreso efectivo, no el nocional. La ley de Walras falla en desequilibrio.</li>
<li><b>Barro y Grossman:</b> equilibrios con racionamiento; Malinvaud distingue desempleo keynesiano (falta demanda) y clásico (salario real alto).</li>
<li><b>Nuevos keynesianos:</b> microfundamentos de la rigidez: contratos implícitos (Azariadis), salarios de eficiencia (Shapiro-Stiglitz), racionamiento del crédito (Stiglitz-Weiss), costos de menú (Blanchard-Kiyotaki). Responden a la crítica de Lucas.</li></ul></section>
${PARA("preferencia por la liquidez, neutralidad del dinero, efecto Pigou, trampa de la liquidez, síntesis neoclásica, decisión dual, racionamiento, nuevo keynesianismo",["Pregunta: ¿cómo se integra Keynes con la teoría neoclásica?","Los dos caballos de batalla: rigidez de precios y eficacia monetaria.","Hicks: los cuatro modelos y el IS-LM.","Síntesis (Modigliani, Patinkin) y contrarrevolución (Clower, Barro-Grossman).","Nuevo keynesianismo: rigideces con microfundamentos."])}`,
qs:[{q:"En el modelo de Hicks, ¿por qué la política monetaria no funciona en la teoría especial?",a:"Porque con la trampa de la liquidez la demanda de dinero es infinitamente elástica a la tasa de interés: el dinero adicional se atesora, la tasa no baja y la inversión no aumenta (LM horizontal)."}]},

{id:"lucas", t:"No keynesianismo: Friedman, Lucas y los nuevos clásicos", sim:"phillips", html:String.raw`
<section><h3>La curva de Phillips</h3>
<p class="lead">Phillips (1958) encuentra una relación inversa entre salarios nominales y desempleo. Samuelson y Solow la presentan como un menú: menos desempleo a cambio de más inflación.</p></section>
<section><h3>Friedman y el monetarismo</h3>
<p>La <b>nueva teoría cuantitativa</b>: la demanda de dinero es una función estable, \(M=P\cdot F(Q,k(z))\). Con <b>expectativas adaptativas</b></p>
<div class="mj">\[\pi^e_t=\pi^e_{t-1}+\gamma(\pi_{t-1}-\pi^e_{t-1})\]</div>
<p>la curva de Phillips depende de la inflación esperada: \(\pi_t=\pi^e_t-h(U_t-U_n)\). Una política expansiva baja el desempleo solo mientras los trabajadores se equivocan; cuando corrigen sus expectativas, el desempleo vuelve a la <b>tasa natural</b> con más inflación. A largo plazo la curva es vertical y el desempleo natural es voluntario.</p></section>
<section><h3>Los nuevos clásicos</h3>
<p>Lucas, Sargent y Wallace introducen las <b>expectativas racionales</b>: los agentes usan el modelo correcto y no cometen errores sistemáticos. La oferta de Lucas es</p>
<div class="mj">\[y_t=y_n+h\mu\,(p_t-p^e_t)+\varepsilon_t\]</div>
<p>Solo las sorpresas mueven el producto. Una política anunciada no tiene efectos reales ni a corto plazo (<b>superneutralidad</b>): la curva de Phillips es vertical y el desempleo es siempre voluntario. La <b>crítica de Lucas</b> invalida los modelos econométricos keynesianos para evaluar políticas. Después vienen los ciclos reales (RBC).</p></section>
<section><h3>Críticas y cierre</h3>
<p>Hahn señala que con expectativas racionales puede haber múltiples equilibrios, así que la hipótesis no cierra el modelo. La macroeconomía actual (DSGE, regla de Taylor) combina los microfundamentos de los nuevos clásicos con las rigideces de los nuevos keynesianos.</p>
<div data-vis="phillips"></div></section>
${PARA("curva de Phillips, monetarismo, expectativas adaptativas, tasa natural de desempleo, expectativas racionales, crítica de Lucas, superneutralidad, ciclos reales",["Pregunta: ¿puede la política monetaria reducir el desempleo?","Phillips y el menú de Samuelson-Solow.","Friedman: expectativas adaptativas, tasa natural, curva vertical a largo plazo.","Lucas: expectativas racionales, solo cuentan las sorpresas, superneutralidad, crítica de Lucas.","Críticas (Hahn) y síntesis actual (DSGE)."])}
${LAB}`,
qs:[{q:"¿Qué diferencia hay entre la curva de Phillips de largo plazo de Friedman y la de Lucas?",a:"Para Friedman es vertical a largo plazo, pero a corto plazo la política puede reducir el desempleo mientras las expectativas adaptativas se corrigen. Para Lucas, con expectativas racionales, una política anunciada no reduce el desempleo ni siquiera a corto plazo: solo las sorpresas tienen efecto."}]}
];

const BRANCHES=[
{g:"Preparar el parcial", from:"mapa", items:[
 {id:"conceptos", t:"Punto 1: glosario de conceptos por capítulo", sim:"glos", html:String.raw`
<section><h3>Cómo definir un concepto en el parcial</h3>
<p class="lead">Una buena definición tiene tres partes: <b>qué es</b>, <b>de quién o de qué teoría es</b> y <b>para qué sirve en el argumento</b>. Dos o tres líneas bastan.</p>
<p class="link"><b>Ejemplo.</b> <i>Ley de Walras:</i> en el equilibrio general de Walras, el valor de las demandas excedentes de todos los mercados suma cero (Σ pᵢZᵢ = 0), por las restricciones presupuestarias. Implica que si n − 1 mercados están en equilibrio, el último también, y por eso se fija un numerario.</p>
<p>Si el punto pide resumir un video, sigue la misma lógica: idea central, autor o teoría, y la relación con un concepto del curso.</p></section>
<section><h3>Todos los conceptos</h3><div id="glos-lista"></div></section>
<section><h3>Repaso con tarjetas</h3>${WSBOX}</section>`},
 {id:"explique", t:"Punto 2: cómo responder «explique la teoría…»", html:String.raw`
<section><h3>La estructura en cinco pasos</h3>
<p class="lead">El profesor evalúa si entiendes la estructura analítica de la teoría, no si recuerdas fechas. Sigue siempre este orden:</p>
<ol class="steps"><li><b>Pregunta:</b> qué problema resuelve la teoría (paradigma de Smith o de Keynes).</li><li><b>Hipótesis:</b> los supuestos que la definen (las cuatro de Sraffa, las siete de Keynes, las diez de Walras).</li><li><b>Mecanismo:</b> cómo funciona el modelo (las ecuaciones o el razonamiento central).</li><li><b>Resultado:</b> qué demuestra (existencia de precios, desempleo de equilibrio).</li><li><b>Crítica o alcance:</b> qué queda sin resolver o quién la critica.</li></ol></section>
<section><h3>Respuestas modelo</h3>
<p><b>Explique la teoría de los precios de producción de Sraffa.</b> Sraffa responde al paradigma de Smith desde la tradición clásica: busca los precios que permiten reproducir una economía capitalista. Con cuatro hipótesis (salario único, salario en una canasta de bienes, tasa de beneficio uniforme y numerario), el sistema de producción se escribe Bp(1 + r) = p. Si la economía genera un excedente social y todos los bienes son básicos, el teorema de Perron-Frobenius garantiza un vector de precios positivo y una tasa de beneficio positiva. Así se demuestra la existencia del equilibrio clásico sin recurrir al valor-trabajo; de hecho, el trabajo comandado de Smith se rechaza y el incorporado de Ricardo solo vale con igual composición del capital. Queda abierta la estabilidad, que se estudia con modelos de gravitación sin un resultado general.</p>
<p><b>Explique la teoría de la demanda efectiva de Keynes.</b> Keynes busca una teoría general del empleo en la que el pleno empleo sea un caso particular. Acepta el primer postulado clásico y rechaza el segundo: los trabajadores no fijan su salario real, así que no hay un mercado de trabajo que determine el empleo. En una economía monetaria, con salario monetario exógeno y decisiones basadas en anticipaciones, el empleo se determina donde la demanda agregada esperada D(N) corta la función de oferta agregada Z(N). Como la propensión a consumir es menor que 1, ese punto puede estar por debajo del pleno empleo: hay desempleo involuntario de equilibrio y la ley de Walras no se cumple. La inversión depende de la eficiencia marginal del capital frente a la tasa de interés, y cuando las expectativas son malas la política monetaria no basta y el Estado debe intervenir.</p>
<p><b>Explique la teoría Clásica del empleo de Pigou.</b> Es el equilibrio general walrasiano aplicado al corto plazo marshalliano, con la ley de Say. La demanda de trabajo sale del primer postulado (w/p = PMgN) y la oferta del segundo (w/p = TMS ocio-consumo). Con salarios flexibles, el mercado de trabajo se equilibra en pleno empleo y todo desempleo es voluntario o friccional. El desempleo involuntario solo existe si el salario real queda rígido por encima del equilibrio por sindicatos o salario mínimo, y el remedio es flexibilizar los salarios. Keynes la critica por no ser general.</p></section>`},
 {id:"diferencias", t:"Punto 3: tablas de tres diferencias", html:String.raw`
<section><h3>Cómo armar la tabla</h3>
<p class="lead">Cada fila debe ser un <b>criterio de comparación</b> (método, hipótesis, resultado), y cada celda una afirmación concreta. Evita filas como «uno es mejor»: compara lo mismo en las dos columnas.</p></section>
<section><h3>Sraffa frente a Walras</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Sraffa (clásico)</th><th>Walras (neoclásico)</th></tr>
<tr><td>Punto de partida</td><td>Excedente social y clases (técnica y canasta salarial dadas)</td><td>Escasez e individuos racionales (preferencias, técnicas y dotaciones)</td></tr>
<tr><td>Determinación de los precios</td><td>Costos de reproducción con tasa de beneficio uniforme: Bp(1 + r) = p</td><td>Oferta y demanda: demandas excedentes nulas, Z(p) = 0</td></tr>
<tr><td>Distribución</td><td>Exógena (salario dado) y en conflicto: si sube w baja r</td><td>Endógena: cada factor recibe su productividad marginal</td></tr>
<tr><td>Estabilidad</td><td>Gravitación por movilidad del capital</td><td>Tanteo con subastador</td></tr></table></div></section>
<section><h3>Sraffa frente a Marx</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Sraffa</th><th>Marx</th></tr>
<tr><td>Valor-trabajo</td><td>Innecesario: los precios salen de la técnica y del salario</td><td>Fundamento: el valor es trabajo abstracto socialmente necesario</td></tr>
<tr><td>Origen del beneficio</td><td>El excedente físico</td><td>La plusvalía: explotación de la fuerza de trabajo</td></tr>
<tr><td>Precios de producción</td><td>Se calculan directamente</td><td>Se obtienen transformando los valores</td></tr></table></div></section>
<section><h3>Marx frente a Walras</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Marx</th><th>Walras</th></tr>
<tr><td>Método</td><td>Holismo</td><td>Individualismo metodológico</td></tr>
<tr><td>Valor</td><td>Objetivo (trabajo)</td><td>Subjetivo (utilidad marginal)</td></tr>
<tr><td>Dinero</td><td>Esencial: D – M – D′</td><td>No es necesario (numerario, trueque)</td></tr></table></div></section>
<section><h3>Pigou frente a Keynes</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Pigou (Clásico)</th><th>Keynes</th></tr>
<tr><td>Dónde se determina el empleo</td><td>En el mercado de trabajo (los dos postulados)</td><td>En el mercado de bienes: demanda efectiva</td></tr>
<tr><td>Ley de Say y ley de Walras</td><td>Se cumplen</td><td>No se cumplen</td></tr>
<tr><td>Desempleo involuntario</td><td>Desequilibrio por salario real rígido (fallo)</td><td>Equilibrio por demanda insuficiente</td></tr>
<tr><td>Política</td><td>Flexibilizar los salarios</td><td>Estimular la demanda (inversión pública)</td></tr></table></div></section>
<section><h3>Friedman frente a Lucas</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Friedman</th><th>Lucas</th></tr>
<tr><td>Expectativas</td><td>Adaptativas</td><td>Racionales</td></tr>
<tr><td>Curva de Phillips a corto plazo</td><td>Con pendiente negativa: la política tiene efectos transitorios</td><td>Vertical para la política anunciada: solo las sorpresas cuentan</td></tr>
<tr><td>Método</td><td>Positivo: importan las predicciones</td><td>Microfundamentos y equilibrio continuo; crítica de Lucas</td></tr></table></div></section>
<section><h3>Mercantilismo frente a Smith</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Mercantilismo monetario</th><th>Smith</th></tr>
<tr><td>Riqueza</td><td>Metales preciosos</td><td>Ingreso per cápita</td></tr>
<tr><td>Fuente</td><td>Balanza comercial positiva</td><td>División del trabajo y trabajo productivo</td></tr>
<tr><td>Estado</td><td>Interventor y proteccionista</td><td>Tres funciones: defensa, justicia, obras públicas</td></tr></table></div></section>
<section><h3>Hicks frente a Keynes</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Hicks (síntesis)</th><th>Keynes</th></tr>
<tr><td>Causa del desempleo</td><td>Rigideces (trampa de la liquidez, salarios)</td><td>Demanda efectiva, incluso con precios flexibles</td></tr>
<tr><td>Marco</td><td>Equilibrio general con IS-LM</td><td>Economía monetaria con anticipaciones</td></tr>
<tr><td>Relación con los clásicos</td><td>Keynes es un caso especial</td><td>Los clásicos son un caso especial</td></tr></table></div></section>`},
 {id:"ensayo", t:"Punto 4: el ensayo paso a paso", sim:"ensayo", html:String.raw`
<section><h3>Qué piden</h3>
<p class="lead">Título, introducción con objetivo, al menos tres secciones y conclusión. Vale el 50 % del parcial.</p>
<ol class="steps"><li><b>Título:</b> una tesis o una pregunta, no solo el tema. «Sraffa: precios sin valor-trabajo» es mejor que «Sraffa».</li><li><b>Introducción:</b> contexto en dos frases, el objetivo explícito («El objetivo de este ensayo es…») y el orden de las secciones.</li><li><b>Tres secciones con subtítulo:</b> cada una con una idea, desarrollada con hipótesis, mecanismo y un ejemplo o ecuación del libro.</li><li><b>Conclusión:</b> responde al objetivo, sin ideas nuevas, y señala el límite o la crítica.</li></ol>
<p class="hint">Escoge un tema para ver una estructura sugerida. El borrador se guarda en este navegador.</p></section>
${WSBOX}`},
 {id:"visuales", t:"Visuales: los gráficos de la unidad 3", html:String.raw`
<section><h3>Para qué sirve</h3><p class="lead">Los gráficos en los que se estudian cambios: el mercado de trabajo de Pigou, la demanda efectiva de Keynes, el IS-LM de Hicks y la curva de Phillips. Arrastra las curvas y lee qué cambió, qué pudo causarlo, el mecanismo y el resultado.</p>
<p class="hint">Los números son ilustrativos: sirven para ver direcciones, no para calcular.</p></section>
<section><h3>Gráficos</h3><div data-vis="*"></div></section>`}]},
{g:"Smith y los clásicos", from:"smith", items:[
 {id:"riqueza-tabla", t:"Las cuatro preguntas sobre la riqueza", html:String.raw`
<section><h3>Respuestas comparadas</h3>
<div class="tbl"><table><tr><th>Pregunta</th><th>Mercantilismo monetario</th><th>Mercantilismo del valor</th><th>Fisiocracia</th><th>Smith</th></tr>
<tr><td>¿Qué es?</td><td>Oro y plata</td><td>El producto neto en valor</td><td>El producto agrícola</td><td>Los bienes que produce el trabajo</td></tr>
<tr><td>¿Cómo se mide?</td><td>Por el peso del metal</td><td>Por la tierra y el trabajo (Petty, Cantillon)</td><td>Por el producto neto</td><td>Ingreso per cápita, Y/L</td></tr>
<tr><td>¿Para qué sirve?</td><td>Poder del rey y del Estado</td><td>Orientar la política del Estado</td><td>Sostener la renta y el impuesto único</td><td>El bienestar de la nación</td></tr>
<tr><td>¿Quién puede ser rico?</td><td>El Estado y los comerciantes</td><td>Los propietarios de tierra y trabajo</td><td>Los terratenientes</td><td>Cualquiera, por su trabajo (el joven pobre ambicioso)</td></tr></table></div></section>`}]},
{g:"Sraffa", from:"sraffa", items:[
 {id:"gravitacion", t:"Gravitación: el modelo de Boggio", sim:"grav", html:String.raw`
<section><h3>El mecanismo</h3>
<p class="lead">Si un choque saca a la economía del equilibrio, las tasas de beneficio difieren y los capitalistas buscan el sector más rentable. El movimiento del capital cambia la oferta y los precios de mercado.</p>
<p><b>Regla Cantillon-Smith:</b> el precio de mercado es el valor de la demanda sobre la oferta, \(p_{it}=X_ip_i^*/Y_{it}\). Linealizada:</p>
<div class="mj">\[p_{it}-p_i^*=\beta\,(X_i-Y_{it}),\qquad \frac{dY_{it}}{dt}=\mu\,(p_{it}-p_i^*)\]</div>
<p>Si el precio está por encima del de producción, el sector es más rentable, entra capital y aumenta la oferta. En tiempo continuo, \(dY/dt=\mu\beta(X-Y)\): la oferta converge a la demanda y el precio al de producción. Es la estabilidad global del equilibrio clásico en este modelo.</p></section>
<section><h3>Los límites</h3>
<ul><li>Supone que la tasa de beneficio de cada sector es información pública, cuando es «el secreto mejor guardado» de cada capitalista.</li><li>Con varios sectores interdependientes o ajustes discretos y bruscos, la convergencia no está garantizada: puede haber oscilaciones o divergencia. Pruébalo con la velocidad de ajuste.</li><li>No hay un modelo de referencia: Egidi (1975) y las propuestas francesas e italianas de los ochenta llegan a resultados distintos.</li></ul></section>
<section><h3>Simulador</h3>${WSBOX}</section>`}]},
{g:"Marx", from:"marx", items:[
 {id:"transf-debate", t:"El debate de la transformación", html:String.raw`
<section><h3>Línea de tiempo</h3>
<ol class="steps"><li><b>Marx (tomo 3 de <i>El capital</i>):</b> transforma los valores del producto pero deja los insumos en valores; afirma que valor total = precio total y plusvalía total = beneficio total.</li><li><b>Böhm-Bawerk (1896):</b> hay una contradicción entre el tomo 1 (valores) y el tomo 3 (precios).</li><li><b>Bortkiewicz (1907) y Sweezy:</b> transforman también los insumos con tres sectores; el sistema tiene solución, pero solo se conserva una invariancia, según la normalización.</li><li><b>Samuelson (1971):</b> la transformación es un rodeo innecesario.</li><li><b>Steedman (1977):</b> los precios salen directamente de Sraffa; propone abandonar el valor-trabajo.</li><li><b>Shaikh, Pasinetti y Garbellini (2015):</b> nuevas soluciones iterativas e interpretaciones.</li></ol></section>
<section><h3>Por qué no se conservan las dos igualdades</h3>
<p>Con \(z=1\), el sector de lujo (que en Bortkiewicz produce el oro, el numerario) tiene precio igual a valor. En el ejemplo clásico (225, 90, 60; 100, 120, 80; 50, 90, 60), la tasa es 25 %, \(x=1{,}28\) y \(y=1{,}067\): el beneficio total es 200, igual a la plusvalía, pero el precio total es 1.000 frente a un valor de 875. Si se normaliza para igualar los totales, se pierde la otra igualdad.</p></section>`}]},
{g:"Walras", from:"walras", items:[
 {id:"hipotesis-walras", t:"Las diez hipótesis y lo que cuestan", html:String.raw`
<section><h3>Hipótesis y crítica</h3>
<div class="tbl"><table><tr><th>#</th><th>Hipótesis</th><th>Qué permite</th><th>Problema</th></tr>
<tr><td>1</td><td>Propiedad privada, sin Estado</td><td>Decisiones individuales</td><td>Las instituciones quedan fuera</td></tr>
<tr><td>2</td><td>Competencia perfecta</td><td>Precios dados para todos</td><td>¿Quién fija los precios? El subastador</td></tr>
<tr><td>3</td><td>Precios semipositivos</td><td>Bienes libres con precio cero</td><td>—</td></tr>
<tr><td>4</td><td>Sin intercambios en desequilibrio</td><td>El tanteo no altera las dotaciones</td><td>Irreal: en la práctica se comercia a precios falsos</td></tr>
<tr><td>5</td><td>Flexibilidad de precios</td><td>Ajuste por el tanteo</td><td>Rigideces (nuevo keynesianismo)</td></tr>
<tr><td>6</td><td>Sin costos de transacción (trueque)</td><td>No se necesita dinero</td><td>Ostroy-Starr: el intercambio descentralizado requiere dinero</td></tr>
<tr><td>7</td><td>Sin externalidades</td><td>Primer teorema del bienestar</td><td>Fallos de mercado</td></tr>
<tr><td>8</td><td>Un solo período</td><td>Modelo estático</td><td>Arrow-Debreu fecha los bienes</td></tr>
<tr><td>9</td><td>Mercados completos</td><td>Todo se puede intercambiar</td><td>Faltan mercados de futuros y de riesgo</td></tr>
<tr><td>10</td><td>Información perfecta</td><td>Decisiones óptimas</td><td>Información asimétrica (Arrow 1963)</td></tr></table></div></section>`}]},
{g:"Keynes", from:"keynes", items:[
 {id:"say-walras", t:"Ley de Say, ley de Walras y desempleo", html:String.raw`
<section><h3>Tres afirmaciones que no hay que confundir</h3>
<div class="tbl"><table><tr><th>Ley</th><th>Enunciado</th><th>Consecuencia</th></tr>
<tr><td>Ley de Say</td><td>La oferta crea su propia demanda</td><td>No hay exceso general de oferta: pleno empleo</td></tr>
<tr><td>Ley de Walras</td><td>\(\sum p_iZ_i=0\) por las restricciones presupuestarias</td><td>Si todos los mercados menos uno se equilibran, el último también</td></tr>
<tr><td>Antiley de Say (Keynes)</td><td>La demanda efectiva determina la producción</td><td>Puede haber desempleo involuntario de equilibrio</td></tr></table></div>
<p>Con desempleo involuntario el mercado de trabajo tiene oferta excedente; si los demás mercados están equilibrados, la suma de demandas excedentes en valor es negativa. Clower lo explica: los hogares racionados demandan según su ingreso efectivo, así que la ley de Walras solo vale con las demandas nocionales.</p></section>`}]}
];

const WORKSHOPS=[
 {id:"parcial1",t:"Simulacro del parcial 1 (unidad 1)",anchor:"smith",links:["sistemas","mercantilismo","fisiocracia","smith"],sim:"glos",html:String.raw`
<section><h3>1. Defina (10 %)</h3><ol class="steps">
<li><b>Mercantilismo monetario:</b> doctrina según la cual la riqueza son los metales preciosos de valor intrínseco; un país se enriquece con una balanza comercial positiva (Mun).</li>
<li><b>Producto neto:</b> para la fisiocracia, excedente agrícola después de reponer los adelantos; lo reciben los terratenientes como renta.</li>
<li><b>Paradigma de Smith:</b> explicar cómo individuos libres, descentralizados y anónimos coordinan sus decisiones por medio de un sistema de precios, sin planificador. Su solución es un equilibrio.</li>
<li><b>Trabajo productivo:</b> según Smith, el que se fija en una mercancía vendible y genera un excedente.</li></ol></section>
<section><h3>2. Explique la teoría de la riqueza de Smith (20 %)</h3>
<p>Smith define la riqueza como el ingreso per cápita, Y/L = qN/L. Crece con la división del trabajo, que eleva la productividad q, y con la proporción de trabajadores productivos N/L. En una sociedad capitalista el producto se distribuye en salarios, beneficios y rentas; el beneficio es el ingreso específico del capital. El interés propio de cada individuo (el carnicero, el cervecero y el panadero) se coordina por los precios de mercado, que tienden a los precios naturales: la mano invisible. La consecuencia es una economía sin Estado (salvo defensa, justicia y obras públicas) y sin dinero esencial.</p></section>
<section><h3>3. Tres diferencias entre mercantilismo y fisiocracia (20 %)</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Mercantilismo monetario</th><th>Fisiocracia</th></tr>
<tr><td>Riqueza</td><td>Oro y plata</td><td>Producto agrícola</td></tr>
<tr><td>Fuente</td><td>Comercio exterior con balanza positiva</td><td>La tierra: solo la agricultura da producto neto</td></tr>
<tr><td>Política</td><td>Proteccionismo e intervención</td><td>Laissez faire e impuesto único sobre la renta de la tierra</td></tr></table></div></section>
<section><h3>4. Ensayo (50 %): «¿Qué es la riqueza? Del mercantilismo a Smith»</h3>
<p><b>Introducción.</b> Desde el siglo XVII los pensadores europeos se preguntan qué es la riqueza, cómo se mide, para qué sirve y quién puede ser rico. El objetivo de este ensayo es comparar las respuestas del mercantilismo monetario, el mercantilismo del valor, la fisiocracia y Smith, y mostrar cómo esa pregunta da origen a la economía como ciencia. Primero se presenta la riqueza como metal; luego la búsqueda de su fuente en la producción; por último, la respuesta de Smith.</p>
<p><b>Secciones.</b> (1) La riqueza como metal precioso: Mun, la devaluación y la crítica de Hume. (2) La fuente de la riqueza: el precio natural de Petty, el valor intrínseco de Cantillon y el producto neto fisiocrático. (3) Smith: ingreso per cápita, trabajo productivo y el paradigma de la coordinación por los precios.</p>
<p><b>Conclusión.</b> La pregunta pasa de qué es la riqueza a cómo se produce y se coordina su producción entre individuos libres. Smith la convierte en el problema de un sistema de precios de equilibrio, pero lo resuelve en una economía de trueque y sin Estado, lo que deja abiertas las preguntas de la existencia y la estabilidad.</p></section>
<section><h3>Repaso de conceptos</h3>${WSBOX}</section>`,
  d:"Un parcial de la unidad 1 resuelto con el formato del profesor: cuatro definiciones, «explique la teoría de la riqueza de Smith», tabla de tres diferencias y ensayo con introducción, secciones y conclusión."},
 {id:"parcial2",t:"Simulacro del parcial 2 (unidad 2)",anchor:"walras",links:["sraffa","marx","walras","fallos"],sim:"sraffa",html:String.raw`
<section><h3>1. Defina (10 %)</h3><ol class="steps">
<li><b>Excedente social:</b> producto que sobra después de reponer los insumos y la canasta salarial; si es positivo, la tasa de beneficio de Sraffa es positiva.</li>
<li><b>Plusvalía:</b> diferencia entre el valor que crea la fuerza de trabajo y su propio valor; es el origen del beneficio en Marx.</li>
<li><b>Ley de Walras:</b> Σ pᵢZᵢ = 0; si n − 1 mercados están en equilibrio, el último también.</li>
<li><b>Tanteo:</b> proceso en el que un subastador ajusta los precios según las demandas excedentes, sin intercambios en desequilibrio.</li></ol></section>
<section><h3>2. Explique la teoría de la transformación de Marx (20 %)</h3>
<p>Marx explica el beneficio con la plusvalía: el capitalista adelanta capital constante C y variable V, y la fuerza de trabajo crea un valor mayor, Y = C + V + S. Con tasa de explotación uniforme y composiciones del capital distintas, las tasas de ganancia en valor S/(C + V) difieren entre sectores, pero la competencia exige una tasa uniforme en precios. La transformación busca precios de producción que se deriven de los valores. En la versión de Bortkiewicz, con tres sectores en reproducción simple, los transformadores x, y y z (con z = 1) cumplen (xCᵢ + yVᵢ)(1 + r) = precio del sector i. En el ejemplo clásico, r = 25 %, la plusvalía total es igual al beneficio total, pero el precio total no es igual al valor total. Steedman concluye que los valores son redundantes porque los precios salen directamente de Sraffa.</p></section>
<section><h3>3. Tres diferencias entre Sraffa y Walras (20 %)</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Sraffa</th><th>Walras</th></tr>
<tr><td>Punto de partida</td><td>Excedente y clases</td><td>Escasez e individuos</td></tr>
<tr><td>Precios</td><td>Costos de reproducción: Bp(1 + r) = p</td><td>Demandas excedentes nulas</td></tr>
<tr><td>Estabilidad</td><td>Gravitación</td><td>Tanteo con subastador</td></tr></table></div></section>
<section><h3>4. Ensayo (50 %): «Clásicos contra neoclásicos»</h3>
<p><b>Introducción.</b> Smith planteó cómo se coordinan por medio de los precios las decisiones de individuos libres. El objetivo de este ensayo es comparar las respuestas de Sraffa y de Walras a ese paradigma y evaluar si logran demostrar la existencia y la estabilidad del equilibrio.</p>
<p><b>Secciones.</b> (1) Dos puntos de partida: excedente y holismo frente a escasez e individualismo metodológico. (2) La existencia: Perron-Frobenius frente a la ley de Walras y los teoremas de punto fijo. (3) La estabilidad: gravitación frente a tanteo, y por qué ninguna tiene un resultado general (SMD, Scarf, los límites de Boggio).</p>
<p><b>Conclusión.</b> Ambas teorías demuestran la existencia de precios de equilibrio en una economía de trueque, pero ninguna garantiza la estabilidad en general. El paradigma de Smith sigue abierto.</p></section>
<section><h3>Laboratorio de Sraffa</h3>${WSBOX}</section>`,
  d:"Un parcial de la unidad 2 resuelto: definiciones de excedente, plusvalía, ley de Walras y tanteo; «explique la transformación», tabla Sraffa frente a Walras y ensayo comparativo."},
 {id:"parcial3",t:"Simulacro del parcial 3 y el final (unidad 3)",anchor:"lucas",links:["pigou","keynes","hicks","lucas"],sim:"phillips",html:String.raw`
<section><h3>1. Defina (10 %)</h3><ol class="steps">
<li><b>Ley de Say:</b> la oferta crea su propia demanda; implica pleno empleo.</li>
<li><b>Demanda efectiva:</b> punto en que la demanda agregada esperada corta la función de oferta agregada; determina el empleo N**.</li>
<li><b>Trampa de la liquidez:</b> tasa de interés tan baja que la demanda de dinero es infinitamente elástica; la política monetaria pierde efecto.</li>
<li><b>Tasa natural de desempleo:</b> desempleo compatible con inflación estable; para Friedman es voluntario.</li></ol></section>
<section><h3>2. Explique la teoría monetarista de Friedman (20 %)</h3>
<p>Friedman reformula la teoría cuantitativa como una teoría de la demanda de dinero estable. Con expectativas adaptativas, la curva de Phillips depende de la inflación esperada: una política monetaria expansiva reduce el desempleo por debajo de la tasa natural solo mientras los trabajadores subestiman la inflación. Cuando corrigen sus expectativas, el desempleo vuelve a la tasa natural con una inflación mayor. A largo plazo la curva de Phillips es vertical, el dinero es neutral y el desempleo natural es voluntario, por lo que recomienda una regla monetaria fija.</p></section>
<section><h3>3. Tres diferencias entre Pigou y Keynes (20 %)</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Pigou</th><th>Keynes</th></tr>
<tr><td>Determinación del empleo</td><td>Mercado de trabajo</td><td>Demanda efectiva</td></tr>
<tr><td>Ley de Say</td><td>Se cumple</td><td>Se rechaza</td></tr>
<tr><td>Desempleo involuntario</td><td>Por salario real rígido</td><td>Equilibrio con demanda insuficiente</td></tr></table></div></section>
<section><h3>4. Ensayo (50 %): «De Hicks a Lucas»</h3>
<p><b>Introducción.</b> Después de la <i>Teoría general</i>, la macroeconomía discutió si el desempleo se debe a rigideces y si el dinero es neutral. El objetivo de este ensayo es reconstruir esa historia desde la síntesis de Hicks hasta los nuevos clásicos.</p>
<p><b>Secciones.</b> (1) Hicks y la síntesis: los cuatro modelos, IS-LM, Modigliani y Patinkin. (2) La contrarrevolución: Clower, Barro-Grossman y el nuevo keynesianismo. (3) El no keynesianismo: Friedman, la tasa natural y las expectativas racionales de Lucas.</p>
<p><b>Conclusión.</b> La síntesis redujo a Keynes a un caso de rigideces; Friedman y Lucas mostraron que, sin rigideces, la política monetaria es neutral. La macroeconomía actual combina ambos lados en los modelos DSGE.</p></section>
<section><h3>Simulador de la curva de Phillips</h3>${WSBOX}</section>`,
  d:"Un parcial de la unidad 3 resuelto: ley de Say, demanda efectiva, trampa de la liquidez y tasa natural; «explique el monetarismo», tabla Pigou frente a Keynes y ensayo de Hicks a Lucas."}
];


// ===================== LO ESENCIAL DE CADA ESCUELA, SEGÚN TOBÓN (2023) =====================
// En el libro, «postulado» tiene un sentido preciso: los dos problemas de optimización de la teoría
// neoclásica (empresas que maximizan el beneficio y consumidores que maximizan la utilidad); la teoría
// Clásica del empleo los traslada al mercado de trabajo. Las demás escuelas se caracterizan por su
// paradigma, sus hipótesis o sus ideas centrales. Cada recuadro usa la categoría que usa el libro.
// Formato de cada elemento: [nombre, explicación]; ["§", "Subtítulo"] abre un grupo.
const POSTULADOS = {
 mercantilismo: {esc: "Mercantilismo", tipo: "Ideas centrales", obra: "Pensamiento económico aún no estructurado (cap. 2)", p: [
  ["§", "Mercantilismo monetario"],
  ["La riqueza es el metal precioso", "La riqueza de la nación es el oro y la plata que acumula."],
  ["Balanza comercial favorable", "Exportar más de lo que se importa para que entre metal; lo que gana una nación lo pierde otra."],
  ["Intervención del Estado", "Proteccionismo y monopolios comerciales al servicio del enriquecimiento del reino."],
  ["§", "Mercantilismo del valor"],
  ["La riqueza es la producción", "La riqueza deja de ser el metal y pasa a ser lo que se produce; el trabajo y la tierra aparecen como sus fuentes."]],
  nota: "El libro las presenta como ideas de un pensamiento económico todavía no estructurado: no hay postulados ni hipótesis formales."},
 fisiocracia: {esc: "Fisiocracia", tipo: "Ideas centrales", obra: "Quesnay, Tableau économique (1758); pensamiento aún no estructurado", p: [
  ["Orden natural", "La economía obedece leyes naturales que el gobierno no debe contrariar."],
  ["Solo la tierra da producto neto", "La agricultura es la única actividad que genera un excedente."],
  ["Tres clases", "Productiva (agricultores), propietaria (terratenientes) y estéril (artesanos y comerciantes)."],
  ["La riqueza circula entre las clases", "El Tableau économique describe la reproducción anual del producto neto."],
  ["Laissez faire y impuesto único", "Libertad económica y un solo impuesto sobre la renta de la tierra."]],
  nota: "Como el mercantilismo, es pensamiento económico no estructurado: ideas y doctrina, no postulados formales."},
 smith: {esc: "Smith", tipo: "El paradigma de Smith", obra: "La riqueza de las naciones (1776); cap. 2", p: [
  ["La pregunta", "¿Cómo es posible que una multitud de individuos propietarios de capital y trabajo, descentralizados, independientes, libres y anónimos, coordinen sus intereses y alcancen un estado de cohesión global?"],
  ["La respuesta", "Acceden voluntariamente al mercado porque allí prevalece un sistema de precios que les permite reproducir medios de producción y bienes de subsistencia (la «mano invisible»)."],
  ["Precisión 1: individuos descentralizados, libres y anónimos", "Estado de naturaleza sin Estado; propiedad privada por apropiación original con el trabajo; cada uno decide sin conocer las decisiones de los demás."],
  ["Precisión 2: el egoísmo, no la benevolencia", "La cohesión social nace del interés propio de cada uno («no de la benevolencia del carnicero…»)."],
  ["Precisión 3: el intercambio por medio de precios", "La cohesión la explican los intercambios voluntarios de riqueza a través de un sistema de precios; si son de equilibrio («naturales»), la sociedad es armónica."]],
  nota: "Para Tobón el paradigma es el punto de partida de toda teoría de los precios: cada escuela posterior es una respuesta distinta a esta pregunta."},
 sraffa: {esc: "Sraffa: teoría clásica de los precios de producción", tipo: "Hipótesis", obra: "Producción de mercancías por medio de mercancías (1960); cap. 3", p: [
  ["§", "Datos"],
  ["Técnica de producción conocida", "Un método invariable por sector; todos los bienes son básicos y se producen por medio de bienes. No se necesita ninguna hipótesis sobre rendimientos de escala."],
  ["§", "Hipótesis que cierran el sistema"],
  ["A · Salario único", "w₁ = w₂ = … = w: competencia entre trabajadores."],
  ["B · Salario en bienes", "El salario es una canasta de subsistencia dada; los trabajadores no ahorran ni sus preferencias cuentan."],
  ["C · Tasa de beneficio uniforme", "r₁ = r₂ = … = r: competencia entre capitalistas."],
  ["D · Numerario", "Un precio igual a 1: solo hay precios relativos."]],
  nota: "Solo las decisiones de los capitalistas tienen impacto económico: es la sociedad de los capitalistas. No hay postulados de optimización."},
 marx: {esc: "Marx: teoría del valor-trabajo", tipo: "Elementos de la teoría", obra: "El capital (1867); cap. 4", p: [
  ["Valor-trabajo socialmente necesario", "El valor de un bien es el tiempo de trabajo socialmente necesario para producirlo; valor y dinero están imbricados."],
  ["La fuerza de trabajo crea el valor", "El capitalista compra fuerza de trabajo con su capital dinero D y vende el producto por D′ > D."],
  ["Explotación y plusvalía", "La relación salarial es institucional, no de mercado; el trabajo no pagado es la plusvalía."],
  ["Valor = c + v + s", "Capital constante (se transmite), capital variable (salarios, crea valor nuevo) y plusvalía; de ahí la cuota de plusvalía y la tasa de ganancia."],
  ["Transformación", "La competencia iguala la tasa de ganancia y los valores se transforman en precios de producción (Bortkiewicz-Sweezy)."]],
  nota: "Según el libro, la versión ortodoxa del valor-trabajo hace de Marx un caso particular de Sraffa; lo original es la relación salarial como relación institucional."},
 walras: {esc: "Teoría neoclásica del equilibrio general (Walras)", tipo: "Arquitectura: datos, supuestos, hipótesis, postulados y condiciones", obra: "Elementos de economía política pura (1874); Arrow-Debreu; cap. 5", p: [
  ["§", "Los dos postulados de la economía neoclásica"],
  ["Primer postulado: el problema de las empresas", "Cada empresa maximiza su beneficio sujeto a la función de producción. De ahí salen la oferta de bienes y la demanda de factores (productividad marginal = precio relativo)."],
  ["Segundo postulado: el problema de los consumidores", "Cada consumidor maximiza su utilidad sujeto a la restricción presupuestal (compra bienes con la venta de sus dotaciones). De ahí salen la demanda de bienes y la oferta de factores."],
  ["§", "Sobre qué se apoyan"],
  ["Datos (3)", "Tecnología de las empresas, preferencias de los consumidores y dotaciones iniciales de factores."],
  ["Supuestos (3)", "Rendimientos decrecientes con costos explícitos y variables; preferencias regulares (curvas de indiferencia convexas); dotaciones que permiten sobrevivir sin intercambiar."],
  ["Hipótesis (10)", "Propiedad privada sin Estado, competencia perfecta, precios semipositivos, no hay intercambios en desequilibrio, flexibilidad de precios, sin costos de transacción, sin externalidades, un solo período, mercados completos e información perfecta."],
  ["Condiciones del equilibrio (3)", "Funciones de exceso de demanda continuas (CN), homogéneas de grado cero (HG) y ley de Walras (LW)."]],
  nota: "El equilibrio general se define cuando, a los precios p* ≥ 0, la oferta iguala la demanda en todos los mercados y, bajo esa condición, empresas y consumidores cumplen sus dos postulados (maximizan beneficio y utilidad)."},
 fallos: {esc: "Teorías neoclásicas con fallos de mercado", tipo: "Método", obra: "Friedman y Arrow: el método normativo de la economía positiva; cap. 6", p: [
  ["Punto de partida", "El equilibrio general es la referencia normativa: con sus hipótesis, el equilibrio es un óptimo de Pareto."],
  ["Un fallo es una hipótesis que no se cumple", "Externalidades, información imperfecta, poder de mercado: el equilibrio deja de ser eficiente."],
  ["Se introducen condiciones", "Se buscan las condiciones (impuestos, derechos, contratos, regulación) que rehabilitan los precios como mecanismo de asignación eficiente: economía de la salud y ambiental."],
  ["Asignación sin precios", "En la economía industrial, la teoría de juegos puede dar asignaciones ineficientes sin hacer intervenir el mecanismo de precios."],
  ["El realismo de las hipótesis no importa (Friedman)", "Una teoría se juzga por sus predicciones, no por el realismo de sus hipótesis."]],
  nota: "Los dos postulados neoclásicos se mantienen; lo que cambia son las hipótesis del modelo."},
 pigou: {esc: "Teoría Clásica de la determinación del nivel de empleo", tipo: "Postulados", obra: "La teoría «Clásica» según Keynes (Pigou); cap. 7", p: [
  ["Primer postulado de la economía Clásica", "El salario real es igual a la productividad marginal del trabajo: la demanda de trabajo de las empresas (el primer postulado neoclásico aplicado al trabajo)."],
  ["Segundo postulado de la economía Clásica", "La utilidad del salario es igual a la desutilidad marginal del trabajo: la oferta de trabajo de los hogares (el segundo postulado neoclásico aplicado al trabajo)."],
  ["§", "Con ellos"],
  ["Ley de Walras (y de Say)", "Si los demás mercados se equilibran, el de trabajo también: pleno empleo."],
  ["Desempleo solo por rigidez", "El desempleo involuntario aparece únicamente si el salario real queda rígido por encima del equilibrio."]],
  nota: "Es el único caso, junto con la teoría neoclásica, en que el libro habla de «postulados»: Keynes acepta el primero y rechaza el segundo."},
 keynes: {esc: "Keynes: el principio de la demanda efectiva", tipo: "Hipótesis", obra: "Teoría general (1936); cap. 8", p: [
  ["§", "Las siete hipótesis"],
  ["1 · Existe el dinero", "Monedas y billetes, en una unidad de cuenta establecida por ley del Estado."],
  ["2 · Competencia perfecta en doble ámbito", "Los precios monetarios de los bienes aparecen «como si» fueran dados; el salario monetario se fija en contratos laborales (no expresan oferta y demanda de trabajo), así que es exógeno: «inexistencia» del mercado de trabajo."],
  ["3 · Multitud de empresas y trabajadores", "Sin mercado de trabajo, las decisiones de los trabajadores no se modelan explícitamente."],
  ["4 · Corto plazo de Marshall", "El trabajo es el factor variable y el capital el fijo."],
  ["5 · Flexibilidad de precios y salarios monetarios", "Pueden subir y bajar; se descarta cualquier rigidez, como el salario mínimo."],
  ["6 · Información imperfecta", "La más importante: incertidumbre sobre el futuro; las empresas forman anticipaciones «convencionales». No es un fallo de mercado."],
  ["7 · Bienes y precios agregados", "Una lista de bienes de consumo e inversión con sus precios; a nivel agregado el valor es PQ."],
  ["§", "Frente a los postulados Clásicos"],
  ["Acepta el primer postulado y rechaza el segundo", "No hay un mercado de trabajo que se equilibre: el empleo lo determina la demanda efectiva."]],
  nota: "Keynes no propone postulados nuevos: su teoría se define por sus hipótesis y por el rechazo del segundo postulado."},
 hicks: {esc: "Keynesianismo neoclásico", tipo: "Los dos «caballos de batalla»", obra: "Hicks, Modigliani, Patinkin, Clower, Barro-Grossman, nuevos keynesianos; caps. 9 y 10", p: [
  ["Primer caballo de batalla", "Determinar el empleo aceptando o rechazando la hipótesis 5 de Keynes (flexibilidad de precios y salarios), es decir, restaurando el segundo postulado Clásico como oferta de trabajo."],
  ["Segundo caballo de batalla", "Discutir si la política monetaria es eficaz para reducir el desempleo: aceptar o rechazar la neutralidad del dinero."],
  ["Nuevos keynesianos", "Construyen fundamentos microeconómicos que rehabilitan plenamente los dos postulados neoclásicos y explican rigideces (contratos implícitos, salarios de eficiencia, racionamiento del crédito, rigidez de precios)."]],
  nota: "Es una síntesis: el lenguaje y los postulados son neoclásicos; lo keynesiano son las rigideces o la no neutralidad del dinero."},
 lucas: {esc: "No keynesianismo neoclásico: Friedman y los nuevos Clásicos", tipo: "Hipótesis", obra: "Friedman (1968), Lucas (1972); cap. 11", p: [
  ["Tasa natural (Friedman)", "La curva de Phillips de largo plazo es vertical; con anticipaciones adaptativas, la política solo engaña transitoriamente."],
  ["Anticipaciones racionales (Lucas)", "Los individuos conocen el «verdadero modelo» y no se equivocan sistemáticamente."],
  ["Fundamento de los dos postulados", "Las anticipaciones racionales sirven de fundamento a los dos postulados neoclásicos: maximización del beneficio de las empresas y de la utilidad de los trabajadores."],
  ["Neutralidad del dinero", "Ninguna política monetaria anticipada reduce el desempleo: pleno empleo."]],
  nota: "Restablecen plenamente los principios neoclásicos y rechazan la pertinencia de Keynes."}
};
(function(){
  const css = `.post{border:1.5px solid var(--line);border-left-width:6px;border-radius:12px;padding:14px 16px;background:var(--card)}
.post h3{margin-top:0}.post .obra{color:var(--muted);font-size:.92em;margin:-4px 0 10px}
.post ol{margin:0 0 4px;padding-left:1.4em}.post li{margin:0 0 8px}.post li b{display:block}
.post h4{margin:12px 0 6px;font-size:.98em}
.post .uso{font-size:.92em;color:var(--muted);margin:10px 0 0}
#po-c button{font-family:inherit;text-align:left}`;
  if (typeof document !== "undefined") { const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); }
  const lista = p => { let h = "", open = false;
    p.forEach(([n, d]) => { if (n === "§") { if (open) h += "</ol>"; h += `<h4>${d}</h4><ol>`; open = true; } else { if (!open) { h += "<ol>"; open = true; } h += `<li><b>${n}</b>${d}</li>`; } });
    return h + (open ? "</ol>" : ""); };
  Object.entries(POSTULADOS).forEach(([id, P]) => {
    const t = TRUNK.find(x => x.id === id); if (!t) return;
    const box = `<section class="post"><h3>${P.tipo}: ${P.esc}</h3><p class="obra">${P.obra}</p>${lista(P.p)}<p class="uso">${P.nota}</p></section>`;
    const i = t.html.indexOf("</section>");
    t.html = i >= 0 ? t.html.slice(0, i + 10) + box + t.html.slice(i + 10) : box + t.html;
  });
  const m = TRUNK.find(x => x.id === "mapa");
  if (m) { const i = m.html.indexOf("</section>"); const nota = `<section class="post"><h3>Postulados, hipótesis y paradigma: no son lo mismo</h3><p>En el libro de Tobón, <b>postulado</b> tiene un sentido preciso: son los <b>dos postulados de la economía neoclásica</b>, el problema de las empresas (maximizar el beneficio sujeto a la función de producción) y el de los consumidores (maximizar la utilidad sujeto a la restricción presupuestal). Su cumplimiento, junto con la igualdad de oferta y demanda en todos los mercados, define el equilibrio general. La teoría Clásica del empleo los traslada al mercado de trabajo (primer y segundo postulado Clásico).</p><p>Las demás escuelas no se definen por postulados: Smith por su <b>paradigma</b>, Sraffa y Keynes por sus <b>hipótesis</b>, el mercantilismo y la fisiocracia por sus <b>ideas</b>. Cada estación abre con un recuadro que usa la categoría del libro; el taller «Lo esencial de cada escuela» los reúne todos.</p></section>`;
    m.html = i >= 0 ? m.html.slice(0, i + 10) + nota + m.html.slice(i + 10) : nota + m.html; }
  WORKSHOPS.push({id: "postulados", t: "Lo esencial de cada escuela", anchor: "lucas", links: Object.keys(POSTULADOS).slice(0, 6), sim: "postulados",
    html: `<div class="sim" id="sim"></div>`, d: "Postulados, hipótesis y paradigmas de cada escuela según el libro: verlos, compararlos y adivinar a qué escuela pertenecen."});
})();
