// =====================================================================
// CONTENIDO: Economía Internacional (1503705, U. de Antioquia).
// Bibliografía del programa: Krugman y Obstfeld, Economía Internacional; Chacholiades (1992);
// Bhagwati (1974); Krugman (1996), Rethinking International Trade; Lindert.
// =====================================================================
const GUIA_ID="ei";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Teoría clásica",2:"Unidad 2 · Teoría neoclásica",3:"Unidad 3 · Nuevas teorías",4:"Unidad 4 · Movilidad de factores",5:"Unidad 5 · Política comercial",6:"Unidad 6 · Economía política",7:"Unidad 7 · Integración",8:"Unidad 8 · Política estratégica"};
const P1="Unidad 1 · Teoría clásica del comercio",P2="Unidad 2 · Teoría neoclásica del comercio",P3="Unidad 3 · Nuevas teorías del comercio",P4="Unidad 4 · Movilidad internacional de factores",P5="Unidad 5 · Política comercial",P6="Unidad 6 · Economía política de la política comercial",P7="Unidad 7 · Los esquemas de integración",P8="Unidad 8 · Política comercial y estrategia";
const TRUNK=[
{id:"ricardo", parte:P1, u:1, t:"El modelo ricardiano", sim:"ricardo", html:String.raw`
<section><h3>Ventaja comparativa</h3><p class="lead">Ricardo (1817): un país tiene <b>ventaja comparativa</b> en un bien si su costo de oportunidad de producirlo, medido en el otro bien, es menor que en el resto del mundo. Aunque un país sea más productivo en todo (ventaja absoluta), ambos ganan si cada uno se especializa según su ventaja comparativa.</p>
<p>Con un solo factor (trabajo) y requerimientos unitarios \(a_{LQ}\), \(a_{LV}\) (horas por unidad de queso y de vino), el precio relativo en autarquía es \(P_Q/P_V=a_{LQ}/a_{LV}\). Local tiene ventaja comparativa en queso si \(\dfrac{a_{LQ}}{a_{LV}}<\dfrac{a^*_{LQ}}{a^*_{LV}}\).</p></section>
<section><h3>Comercio y ganancias</h3><p>Con comercio, el precio relativo mundial queda entre los dos precios de autarquía. Cada país se especializa y consume por fuera de su frontera de posibilidades: es como si tuviera una tecnología indirecta para «producir» el otro bien a través del comercio. Los salarios relativos quedan entre las productividades relativas: el país más productivo paga salarios más altos, lo que desmiente la idea de que el comercio con países de salarios bajos siempre perjudica.</p></section>
${LAB}`},

{id:"dfs", parte:P1, u:1, t:"El continuo de bienes: Dornbusch, Fischer y Samuelson", sim:"dfs", html:String.raw`
<section><h3>Muchos bienes</h3><p class="lead">Dornbusch, Fischer y Samuelson (1977) extienden Ricardo a un continuo de bienes \(z\in[0,1]\), ordenados de modo que la productividad relativa de Local, \(A(z)=a^*(z)/a(z)\), es decreciente. Local produce los bienes en que \(A(z)>\omega\), donde \(\omega=w/w^*\) es el salario relativo.</p>
<p>La demanda (preferencias Cobb-Douglas con participaciones iguales) da una segunda condición: el ingreso de Local debe igualar el gasto mundial en los bienes que produce, \(\omega=B(\tilde z)=\dfrac{\tilde z}{1-\tilde z}\cdot\dfrac{L^*}{L}\).</p>
<div class="mj">\[A(\tilde z)=B(\tilde z)\]</div>
<p>Si Local crece en población, produce menos bienes y su salario relativo baja; si mejora su tecnología, su salario relativo sube y ambos países pueden ganar. Un costo de transporte crea una banda de bienes no transables.</p></section>
${LAB}`},

{id:"especificos", parte:P2, u:2, t:"Factores específicos y distribución del ingreso", sim:"especificos", html:String.raw`
<section><h3>El modelo</h3><p class="lead">Dos sectores: manufactura usa trabajo y capital (específico); alimentos usa trabajo y tierra (específica). El trabajo se mueve entre sectores hasta que el salario es igual: \(P_M\cdot PMgL_M=P_A\cdot PMgL_A=w\).</p></section>
<section><h3>Quién gana con el comercio</h3><p>Si el comercio sube el precio relativo de la manufactura en un \(x\%\), el salario nominal sube menos de \(x\%\): los trabajadores ganan en términos de alimentos y pierden en términos de manufacturas. Los dueños del factor específico del sector que se expande (capital) <b>ganan</b> sin ambigüedad; los del sector que se contrae (tierra) <b>pierden</b>. Las ganancias totales superan las pérdidas, así que los ganadores podrían compensar a los perdedores; si no lo hacen, aparece la oposición política al comercio.</p></section>
${LAB}`},

{id:"ho", parte:P2, u:2, t:"Heckscher-Ohlin: dotaciones de factores", sim:"ho", html:String.raw`
<section><h3>El teorema de Heckscher-Ohlin</h3><p class="lead">Con dos factores (trabajo y capital) móviles entre sectores, tecnologías iguales en los dos países y bienes que difieren en intensidad factorial, un país exporta el bien que usa intensivamente su factor <b>abundante</b>.</p></section>
<section><h3>Tres teoremas asociados</h3><ul><li><b>Stolper-Samuelson</b>: si sube el precio relativo de un bien, sube más que proporcionalmente la remuneración del factor que usa intensivamente y baja la del otro (efecto magnificación).</li><li><b>Rybczynski</b>: a precios constantes, si aumenta la dotación de un factor, crece más que proporcionalmente la producción del bien intensivo en ese factor y cae la del otro.</li><li><b>Igualación del precio de los factores</b>: si los países se diversifican, el libre comercio iguala los precios de los factores sin que estos se muevan.</li></ul><p>Con coeficientes fijos \(a_{ij}\), el pleno empleo y la condición de precio igual a costo dan dos sistemas lineales: \(a_{LX}X+a_{LY}Y=L\), \(a_{KX}X+a_{KY}Y=K\) y \(a_{LX}w+a_{KX}r=P_X\), \(a_{LY}w+a_{KY}r=P_Y\).</p></section>
<section><h3>Evidencia</h3><p>La <b>paradoja de Leontief</b> (1953): las exportaciones de EE. UU., país abundante en capital, eran menos intensivas en capital que sus importaciones. Las explicaciones incluyen el capital humano, las diferencias tecnológicas y el comercio de factores incorporados. El modelo funciona mejor para el comercio Norte-Sur.</p></section>
${LAB}`},

{id:"estandar", parte:P2, u:2, t:"El modelo estándar de comercio", sim:"estandar", html:String.raw`
<section><h3>Oferta y demanda relativas</h3><p class="lead">El modelo estándar resume los anteriores: cada país tiene una frontera de posibilidades curva; la <b>oferta relativa mundial</b> de un bien crece con su precio relativo y la <b>demanda relativa</b> cae. Su cruce determina los <b>términos de intercambio</b>.</p></section>
<section><h3>Crecimiento y términos de intercambio</h3><p>El crecimiento <b>sesgado hacia las exportaciones</b> de un país aumenta la oferta relativa de lo que exporta y empeora sus términos de intercambio; el sesgado hacia las importaciones los mejora. Si el deterioro es suficientemente grande, el país puede quedar peor: el <b>crecimiento empobrecedor</b> de Bhagwati (requiere un país grande con demanda inelástica de sus exportaciones).</p><p>También explica el efecto de los aranceles de un país grande (mejoran sus términos de intercambio) y el problema de las transferencias internacionales.</p></section>
${LAB}`},

{id:"nuevas", parte:P3, u:3, t:"Tecnología, ciclo del producto, Linder y gravedad", sim:"gravedad", html:String.raw`
<section><h3>Teorías basadas en la tecnología y la demanda</h3><ul><li><b>Demora en la imitación</b> (Posner, 1961): el país que innova exporta mientras los demás tardan en imitar; la brecha tecnológica es fuente de comercio.</li><li><b>Ciclo del producto</b> (Vernon, 1966): un producto nuevo se produce y exporta desde el país innovador; al madurar y estandarizarse, la producción se traslada a países con salarios bajos, que terminan exportándolo de vuelta.</li><li><b>Tesis de Linder</b> (1961): un país exporta bienes manufacturados que primero se desarrollaron para su mercado interno; por eso comercia más con países de ingreso per cápita similar (comercio por superposición de demandas).</li></ul></section>
<section><h3>El modelo de gravedad</h3><p>El comercio entre dos países es proporcional al tamaño de sus economías e inversamente proporcional a la distancia:</p>
<div class="mj">\[T_{ij}=A\,\frac{Y_iY_j}{D_{ij}^{\theta}}\qquad \ln T_{ij}=\ln A+\ln Y_i+\ln Y_j-\theta\ln D_{ij}\]</div>
<p>Es una de las relaciones empíricas más robustas de la economía; se amplía con fronteras comunes, idioma, acuerdos comerciales y pasado colonial. Muestra que las fronteras siguen importando: el comercio dentro de un país es mucho mayor que entre países a la misma distancia.</p></section>
${LAB}`},

{id:"krugman", parte:P3, u:3, t:"Economías de escala y competencia monopolística", sim:"cm", html:String.raw`
<section><h3>Comercio sin ventaja comparativa</h3><p class="lead">Krugman (1979, 1980): con economías de escala internas y productos diferenciados, el comercio entre países idénticos es beneficioso porque <b>amplía el mercado</b>: hay más variedades y cada empresa produce más, a menor costo medio.</p></section>
<section><h3>El modelo</h3><p>Con \(n\) empresas simétricas en un mercado de tamaño \(S\), costo fijo \(F\) y marginal \(c\):</p>
<div class="mj">\[CMe=\frac{nF}{S}+c\qquad P=c+\frac{1}{b\,n}\]</div>
<p>La primera curva sube con \(n\) (cada empresa vende menos); la segunda baja (más competencia). Su cruce da el número de empresas y el precio. Al integrar dos mercados, \(S\) aumenta: hay más empresas en total, menor precio y más variedades. Es la explicación del <b>comercio intraindustrial</b>, medido con el índice de Grubel-Lloyd \(GL=1-\dfrac{|X-M|}{X+M}\).</p><p>Con heterogeneidad de empresas (Melitz, 2003), el comercio desplaza producción hacia las empresas más productivas y eleva la productividad promedio.</p></section>
${LAB}`},

{id:"dumping", parte:P3, u:3, t:"Dumping recíproco", sim:"dumping", html:String.raw`
<section><h3>Dumping</h3><p class="lead">Hay <b>dumping</b> cuando una empresa vende en el exterior a un precio menor que en su mercado o por debajo de su costo. Es una forma de discriminación de precios: posible si los mercados están separados y la demanda externa es más elástica.</p></section>
<section><h3>Dumping recíproco (Brander y Krugman, 1983)</h3><p>Dos empresas con poder de mercado, una en cada país, compiten a la Cournot en ambos mercados. Aun con costos de transporte, a cada una le conviene vender algo en el mercado de la otra, porque allí su ingreso marginal es alto (tiene poca participación). Resultado: <b>comercio en dos sentidos del mismo bien</b>, en el que cada empresa recibe en el exterior un precio neto de transporte menor que en casa. El efecto en bienestar es ambiguo: más competencia frente a costos de transporte desperdiciados.</p></section>
${LAB}`},

{id:"factores", parte:P4, u:4, t:"Movilidad internacional de factores", sim:"migracion", html:String.raw`
<section><h3>Migración laboral</h3><p class="lead">Si el trabajo se mueve del país de salario bajo al de salario alto, los salarios convergen. La producción mundial aumenta: el trabajo se reasigna a donde es más productivo. Ganan los migrantes, los trabajadores que se quedan en el país de origen y los dueños de los otros factores en el país de destino; pierden los trabajadores del país de destino.</p></section>
<section><h3>Capital y préstamos internacionales</h3><p>El comercio intertemporal: un país con oportunidades de inversión altas toma prestado (importa consumo presente) y paga después. La inversión extranjera directa ocurre cuando conviene producir en el exterior (localización) y hacerlo dentro de la misma empresa (internalización): el marco OLI de Dunning. Las empresas multinacionales pueden integrarse horizontalmente (producir el mismo bien cerca de los mercados) o verticalmente (fragmentar la cadena de valor).</p></section>
${LAB}`},

{id:"aranceles", parte:P5, u:5, t:"Aranceles, cuotas y subsidios", sim:"arancel", html:String.raw`
<section><h3>Arancel en un país pequeño</h3><p class="lead">Un arancel \(t\) sube el precio interno de \(P_W\) a \(P_W+t\). Los productores ganan (área a), el gobierno recauda (área c), los consumidores pierden (a + b + c + d). La pérdida neta son los dos triángulos: <b>b</b>, distorsión de la producción, y <b>d</b>, distorsión del consumo.</p></section>
<section><h3>País grande</h3><p>Si el país es grande, el arancel baja el precio mundial: parte del arancel lo pagan los extranjeros (área e, ganancia de términos de intercambio). Si e > b + d, el arancel aumenta el bienestar nacional, a costa del resto del mundo; existe un <b>arancel óptimo</b>.</p></section>
<section><h3>Otros instrumentos</h3><ul><li><b>Cuota</b>: limita las importaciones; el área c se convierte en <b>rentas de cuota</b> para quien tenga las licencias.</li><li><b>Subsidio a la exportación</b>: aumenta el precio interno y el costo para el gobierno supera la ganancia de los productores.</li><li><b>Restricción voluntaria de exportaciones</b>: las rentas quedan en manos de los exportadores extranjeros.</li></ul></section>
<section><h3>Protección efectiva</h3><p>Lo que importa al productor es el arancel sobre su <b>valor agregado</b>:</p>
<div class="mj">\[TPE=\frac{t_f-\sum a_i t_i}{1-\sum a_i}\]</div>
<p>donde \(a_i\) es la participación del insumo \(i\) en el valor del bien. Un arancel alto al bien final y bajo a los insumos da una protección efectiva mucho mayor que la nominal (escalonamiento arancelario).</p></section>
${LAB}`},

{id:"politica", parte:P6, u:6, t:"Economía política de la política comercial", sim:"tarjetas", html:String.raw`
<section><h3>Argumentos a favor del libre comercio</h3><p class="lead">Eficiencia (elimina las pérdidas b y d), economías de escala, aprendizaje y competencia, y el argumento político: una regla simple de libre comercio es menos vulnerable a la captura por intereses particulares.</p></section>
<section><h3>Argumentos a favor de la intervención</h3><ul><li><b>Términos de intercambio</b>: el arancel óptimo de un país grande (pero invita a represalias).</li><li><b>Fallas de mercado internas</b>: externalidades, desempleo, mercados de capital imperfectos. El criterio del <b>segundo mejor</b> dice que corregir la distorsión directamente es mejor que usar la política comercial.</li><li><b>Industria naciente</b>.</li></ul></section>
<section><h3>¿Por qué existe la protección?</h3><p>Los beneficios de la protección se concentran en pocos productores bien organizados y sus costos se reparten entre muchos consumidores: el problema de la <b>acción colectiva</b> de Olson. Modelos como el del votante mediano y el de Grossman y Helpman (1994), «la protección en venta», explican por qué los sectores organizados obtienen aranceles. Los acuerdos internacionales (GATT desde 1947, OMC desde 1995) sirven para coordinar reducciones recíprocas y evitar guerras comerciales, con principios de nación más favorecida y trato nacional.</p></section>
${LAB}`},

{id:"integracion", parte:P7, u:7, t:"Los esquemas de integración", sim:"viner", html:String.raw`
<section><h3>Grados de integración (Balassa)</h3><ol><li><b>Área de libre comercio</b>: sin aranceles entre miembros; cada uno mantiene su arancel externo (requiere reglas de origen).</li><li><b>Unión aduanera</b>: además, arancel externo común.</li><li><b>Mercado común</b>: libre movilidad de factores.</li><li><b>Unión económica</b>: coordinación de políticas; con moneda común, unión monetaria.</li></ol><p>Ejemplos que tocan a Colombia: la Comunidad Andina, la Alianza del Pacífico y los tratados de libre comercio con Estados Unidos y la Unión Europea.</p></section>
<section><h3>Creación y desviación de comercio (Viner, 1950)</h3><p>Un acuerdo preferencial es un segundo mejor: <b>crea comercio</b> cuando reemplaza producción nacional costosa por importaciones más baratas del socio, y lo <b>desvía</b> cuando reemplaza importaciones del proveedor más eficiente del mundo por las del socio, que es más caro pero entra sin arancel. Con desviación, el país pierde el arancel que antes cobraba y paga más por el bien. El efecto neto depende de cuál domina.</p></section>
${LAB}`},

{id:"estrategica", parte:P8, u:8, t:"Política comercial estratégica", sim:"airbus", html:String.raw`
<section><h3>Brander y Spencer (1985)</h3><p class="lead">En un mercado con pocas empresas y rentas extraordinarias (aviones, chips), un subsidio puede cambiar el resultado de la competencia a favor de la empresa nacional: si el subsidio hace creíble que producirá, la rival extranjera desiste, y el país captura las rentas.</p></section>
<section><h3>Límites</h3><p>El argumento exige información que los gobiernos rara vez tienen, invita a represalias (si ambos subsidian, pierden los dos), y es muy sensible al tipo de competencia: con competencia en precios (Bertrand) lo óptimo puede ser un impuesto y no un subsidio (Eaton y Grossman). La política industrial moderna se apoya más en externalidades del conocimiento y en la coordinación que en capturar rentas.</p></section>
<section><h3>Estrategia comercial en los países en desarrollo</h3><p>El debate entre sustitución de importaciones y orientación exportadora (ver Desarrollo Económico) y el «nuevo regionalismo»: integración profunda con reglas sobre inversión, servicios y propiedad intelectual.</p></section>
${LAB}`}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"ricardo",links:["ricardo","ho","krugman","aranceles"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"estrategica",links:["ricardo","ho","aranceles","integracion"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"estrategica",links:["especificos","politica","integracion"],sim:"abiertas",html:WSBOX,d:"Preguntas de ensayo con esquema de respuesta."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"estrategica",links:["ricardo","ho","krugman","aranceles"],sim:"hoja",html:WSBOX,d:"Modelos y fórmulas del curso."}];
const ALIAS={};
const GL=[
{u:1,t:"Ventaja absoluta",d:"Producir un bien con menos recursos que otro país."},
{u:1,t:"Ventaja comparativa",d:"Menor costo de oportunidad de producir un bien en términos del otro."},
{u:1,t:"Requerimiento unitario de trabajo",d:"Horas de trabajo necesarias para producir una unidad (a_L)."},
{u:1,t:"Términos de intercambio",d:"Precio de las exportaciones relativo al de las importaciones."},
{u:1,t:"Salario relativo (DFS)",d:"ω = w/w*; determina qué bienes produce cada país en el continuo."},
{u:2,t:"Factor específico",d:"Factor que solo se puede usar en un sector."},
{u:2,t:"Abundancia factorial",d:"Un país es abundante en capital si su K/L es mayor que el del otro."},
{u:2,t:"Intensidad factorial",d:"Un bien es intensivo en capital si usa más K por trabajador que el otro a cualquier precio de los factores."},
{u:2,t:"Teorema de Stolper-Samuelson",d:"Subir el precio de un bien sube más que proporcionalmente el pago del factor que usa intensivamente."},
{u:2,t:"Teorema de Rybczynski",d:"Más dotación de un factor aumenta más que proporcionalmente la producción del bien intensivo en él."},
{u:2,t:"Paradoja de Leontief",d:"Las exportaciones de EE. UU. eran menos intensivas en capital que sus importaciones."},
{u:2,t:"Crecimiento empobrecedor",d:"Crecimiento sesgado a las exportaciones que empeora tanto los términos de intercambio que el país queda peor."},
{u:3,t:"Ciclo del producto",d:"La producción se traslada del país innovador a los de salarios bajos cuando el producto madura (Vernon)."},
{u:3,t:"Tesis de Linder",d:"Se comercian más manufacturas entre países con demandas parecidas."},
{u:3,t:"Modelo de gravedad",d:"El comercio bilateral crece con el tamaño de las economías y cae con la distancia."},
{u:3,t:"Comercio intraindustrial",d:"Exportar e importar bienes de la misma industria."},
{u:3,t:"Índice de Grubel-Lloyd",d:"1 − |X − M|/(X + M); mide el comercio intraindustrial."},
{u:3,t:"Economías de escala internas",d:"El costo medio de la empresa baja al producir más."},
{u:3,t:"Dumping",d:"Vender en el exterior por debajo del precio interno o del costo."},
{u:3,t:"Dumping recíproco",d:"Comercio en dos sentidos del mismo bien por competencia oligopolística (Brander-Krugman)."},
{u:4,t:"Inversión extranjera directa",d:"Inversión que da control sobre una empresa en otro país."},
{u:4,t:"Paradigma OLI",d:"Propiedad, localización e internalización como condiciones de la empresa multinacional (Dunning)."},
{u:5,t:"Arancel ad valorem",d:"Impuesto a las importaciones como porcentaje de su valor."},
{u:5,t:"Pérdida irrecuperable del arancel",d:"Triángulos de distorsión de la producción y del consumo."},
{u:5,t:"Arancel óptimo",d:"Arancel que maximiza el bienestar de un país grande por sus efectos en los términos de intercambio."},
{u:5,t:"Rentas de cuota",d:"Diferencia entre el precio interno y el mundial multiplicada por la cuota."},
{u:5,t:"Tasa de protección efectiva",d:"Aumento porcentual del valor agregado por la estructura arancelaria."},
{u:6,t:"Segundo mejor",d:"Si hay una distorsión, eliminar otra no necesariamente mejora; conviene atacar la distorsión en su origen."},
{u:6,t:"Acción colectiva",d:"Los grupos pequeños con beneficios concentrados se organizan mejor que los grandes con costos dispersos (Olson)."},
{u:6,t:"Nación más favorecida",d:"Principio de la OMC: una concesión a un miembro se extiende a todos."},
{u:7,t:"Área de libre comercio",d:"Sin aranceles entre miembros, con aranceles externos propios."},
{u:7,t:"Unión aduanera",d:"Libre comercio interno y arancel externo común."},
{u:7,t:"Reglas de origen",d:"Requisitos para que un bien se considere originario de un miembro del acuerdo."},
{u:7,t:"Creación de comercio",d:"Reemplazo de producción nacional costosa por importaciones más baratas del socio."},
{u:7,t:"Desviación de comercio",d:"Reemplazo del proveedor mundial más eficiente por un socio más caro."},
{u:8,t:"Política comercial estratégica",d:"Uso de subsidios o aranceles para trasladar rentas oligopolísticas a empresas nacionales."}];
const MCQ=[
{u:1,q:"Local necesita 1 hora por queso y 2 por vino; Extranjero, 6 y 3. Local tiene ventaja comparativa en:",o:["Vino","Queso","Ambos","Ninguno"],ok:1,e:"1/2 < 6/3: el queso le cuesta menos vino a Local."},
{u:1,q:"Con comercio, el precio relativo mundial del queso en ese ejemplo queda entre:",o:["0 y 0,5","0,5 y 2","2 y 6","1 y 6"],ok:1,e:"Entre los precios de autarquía 1/2 y 6/3."},
{u:1,q:"En DFS, si la población de Local aumenta:",o:["Su salario relativo sube","Produce más bienes y su salario relativo baja","No cambia nada","Exporta menos"],ok:1,e:"La curva B se desplaza hacia abajo."},
{u:2,q:"En el modelo de factores específicos, si sube el precio relativo de la manufactura, pierden:",o:["Los dueños del capital","Los dueños de la tierra","Todos","Nadie"],ok:1,e:"El factor específico del sector que se contrae."},
{u:2,q:"Según Heckscher-Ohlin, un país abundante en trabajo exporta:",o:["Bienes intensivos en capital","Bienes intensivos en trabajo","Servicios","Nada"],ok:1,e:"Usa intensivamente su factor abundante."},
{u:2,q:"El teorema de Rybczynski dice que un aumento del capital, a precios constantes:",o:["Aumenta ambas producciones","Aumenta más que proporcionalmente la del bien intensivo en capital y reduce la otra","Reduce el salario","Sube la renta del capital"],ok:1,e:"Efecto magnificación en cantidades."},
{u:2,q:"La paradoja de Leontief contradijo a:",o:["Ricardo","Heckscher-Ohlin","Krugman","Linder"],ok:1,e:"EE. UU. exportaba bienes intensivos en trabajo."},
{u:2,q:"El crecimiento sesgado hacia las exportaciones tiende a:",o:["Mejorar los términos de intercambio","Empeorar los términos de intercambio","No afectarlos","Eliminar el comercio"],ok:1,e:"Aumenta la oferta relativa de lo que exporta."},
{u:3,q:"El modelo de gravedad predice que el comercio entre dos países:",o:["Crece con la distancia","Crece con el tamaño de sus economías y cae con la distancia","No depende del PIB","Depende solo de los aranceles"],ok:1,e:"T = A·Yi·Yj/D^θ."},
{u:3,q:"El comercio intraindustrial se explica mejor con:",o:["Ricardo","Heckscher-Ohlin","Competencia monopolística con economías de escala","Factores específicos"],ok:2,e:"Variedades diferenciadas y mercados más grandes."},
{u:3,q:"Si un país exporta 80 e importa 120 de un bien, su índice de Grubel-Lloyd es:",o:["0,2","0,8","0,4","1"],ok:1,e:"1 − 40/200 = 0,8."},
{u:3,q:"En el dumping recíproco cada empresa vende en el mercado de la otra porque:",o:["Es más eficiente","Su ingreso marginal allí es alto por su baja participación","Recibe subsidios","No hay costos de transporte"],ok:1,e:"Competencia de Cournot en mercados segmentados."},
{u:4,q:"Con migración del país de salarios bajos al de salarios altos, pierden:",o:["Los migrantes","Los trabajadores del país de destino","Los dueños del capital en el destino","Los trabajadores que se quedan en el origen"],ok:1,e:"Su salario baja."},
{u:5,q:"En un país pequeño, la pérdida neta de un arancel es:",o:["El recaudo","Los triángulos de distorsión de producción y consumo","El excedente del productor","Cero"],ok:1,e:"Áreas b + d."},
{u:5,q:"Un arancel de un país grande puede aumentar su bienestar porque:",o:["Sube el precio mundial","Mejora sus términos de intercambio","Aumenta las importaciones","Reduce el recaudo"],ok:1,e:"Parte del arancel lo pagan los extranjeros."},
{u:5,q:"Con arancel final 20 %, insumo con participación 50 % y arancel 0 %, la protección efectiva es:",o:["20 %","40 %","10 %","0 %"],ok:1,e:"(0,20 − 0)/(1 − 0,5) = 40 %."},
{u:5,q:"En una cuota de importación, el área que en el arancel era recaudo se convierte en:",o:["Pérdida","Rentas para los tenedores de licencias","Excedente del consumidor","Términos de intercambio"],ok:1,e:"Rentas de cuota."},
{u:6,q:"Según Olson, la protección persiste porque:",o:["Beneficia a la mayoría","Sus beneficios son concentrados y sus costos dispersos","Es eficiente","Lo exige la OMC"],ok:1,e:"Problema de acción colectiva."},
{u:7,q:"La desviación de comercio ocurre cuando:",o:["Se reemplaza producción nacional costosa","Se reemplaza al proveedor mundial eficiente por un socio más caro","Bajan los precios","Se elimina el arancel externo"],ok:1,e:"Viner, 1950."},
{u:7,q:"La diferencia entre área de libre comercio y unión aduanera es:",o:["La movilidad de factores","El arancel externo común","La moneda común","No hay diferencia"],ok:1,e:"El área requiere reglas de origen."},
{u:8,q:"En Brander-Spencer, un subsidio a la empresa nacional funciona porque:",o:["Baja los costos de todos","Hace creíble que producirá y disuade a la rival","Mejora la calidad","Reduce los impuestos"],ok:1,e:"Traslada rentas oligopolísticas."}];
const ABIERTAS=[
{u:1,q:"Explique por qué un país menos productivo en todos los bienes puede ganar con el comercio. Use un ejemplo numérico.",a:["Ventaja absoluta frente a comparativa.","Costos de oportunidad y precios de autarquía.","Términos de intercambio intermedios.","Salarios relativos entre productividades relativas."]},
{u:2,q:"¿Quién gana y quién pierde con la apertura comercial según el modelo de factores específicos y según Heckscher-Ohlin?",a:["Factores específicos: dueños del factor del sector que crece y del que se contrae; trabajo ambiguo.","H-O: Stolper-Samuelson, el factor abundante gana.","Ganancias totales y compensación.","Implicaciones políticas."]},
{u:3,q:"¿Por qué comercian países con dotaciones y tecnologías parecidas?",a:["Economías de escala y diferenciación (Krugman).","Más variedades y menores precios.","Comercio intraindustrial y Grubel-Lloyd.","Linder y gravedad."]},
{u:6,q:"Evalúe los argumentos a favor de proteger una industria colombiana.",a:["Pérdidas de eficiencia del arancel.","Industria naciente y fallas de mercado; segundo mejor.","Economía política: grupos de interés.","Compromisos internacionales y alternativas."]},
{u:7,q:"¿Un acuerdo de libre comercio siempre mejora el bienestar? Use el análisis de Viner.",a:["Creación de comercio.","Desviación de comercio y pérdida de recaudo.","Condiciones que favorecen la creación.","Ejemplo con costos y aranceles."]}];
const TL=[];
