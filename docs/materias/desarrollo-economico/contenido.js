// Desarrollo Económico · contenido de la ruta (programa 1503714)
// =====================================================================
// CONTENIDO: Desarrollo Económico (1503714, U. de Antioquia).
// Bibliografía del programa: Ray (1998), Weil (2006), Sala i Martin (2000), Todaro y Smith, Sen (2000),
// Hirschman (1958), Lewis (1954), Prebisch, North (1993), Acemoglu et al. (2005), Krugman (1997), Porter.
// =====================================================================
const GUIA_ID="de";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Visión panorámica",2:"Unidad 2 · Crecimiento económico",3:"Unidad 3 · Enfoques tradicionales",4:"Unidad 4 · Debates recientes",5:"Unidad 5 · Perspectivas heterodoxas"};
const P1="Unidad 1 · Desarrollo económico: una visión panorámica",P2="Unidad 2 · El crecimiento económico",P3="Unidad 3 · Los enfoques tradicionales del desarrollo",P4="Unidad 4 · Debates recientes en torno al crecimiento y el desarrollo",P5="Unidad 5 · Perspectivas heterodoxas del desarrollo";
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"panorama", parte:P1, u:1, t:"Crecimiento, desarrollo y su medición", sim:"idh", html:String.raw`
<section><h3>Crecimiento no es lo mismo que desarrollo</h3><p class="lead">El <b>crecimiento</b> es el aumento sostenido del ingreso por habitante. El <b>desarrollo</b> es más amplio: incluye salud, educación, reducción de la pobreza y la desigualdad, y lo que Amartya Sen llama la expansión de las <b>capacidades</b> y libertades reales de las personas. Un país puede crecer sin que la mayoría mejore (crecimiento sin desarrollo), y puede mejorar indicadores sociales con crecimiento modesto.</p>
<p>La economía del desarrollo nace como subdisciplina después de la Segunda Guerra Mundial (descolonización, Plan Marshall, creación del Banco Mundial y de la CEPAL), con la pregunta de por qué unos países son ricos y otros pobres y qué pueden hacer los gobiernos al respecto.</p></section>
<section><h3>Medir el desarrollo</h3><ul><li><b>PIB per cápita</b> en paridad de poder adquisitivo (PPA): mide el ingreso promedio; no dice nada de su distribución ni de lo que no pasa por el mercado.</li><li><b>Índice de Desarrollo Humano</b> (PNUD, desde 1990): combina salud (esperanza de vida), educación (años esperados y promedio de escolaridad) e ingreso (logaritmo del INB per cápita). Desde 2010 se agrega con una <b>media geométrica</b>, de modo que un mal desempeño en una dimensión no se compensa del todo con otra.</li><li>Medidas complementarias: IDH ajustado por desigualdad, índice de pobreza multidimensional, medidas de calidad de vida y felicidad (Lora, 2008).</li></ul>
<div class="mj">\[I_{\text{salud}}=\frac{EV-20}{85-20}\qquad I_{\text{educ}}=\frac{1}{2}\left(\frac{AME}{15}+\frac{AEE}{18}\right)\qquad I_{\text{ingreso}}=\frac{\ln INB-\ln100}{\ln75\,000-\ln100}\]</div>
<div class="mj">\[IDH=\left(I_{\text{salud}}\cdot I_{\text{educ}}\cdot I_{\text{ingreso}}\right)^{1/3}\]</div>
<p class="hint">El logaritmo en el ingreso refleja rendimientos decrecientes: un dólar adicional vale más para un país pobre que para uno rico.</p></section>
${LAB}`},

{id:"pobreza", parte:P1, u:1, t:"Pobreza: conceptos y medición", sim:"fgt", html:String.raw`
<section><h3>Pobreza absoluta y relativa</h3><p class="lead">Medir la pobreza exige dos pasos (Sen): <b>identificar</b> a los pobres con una línea de pobreza \(z\) y <b>agregar</b> su situación en un índice. La línea puede ser <b>absoluta</b> (costo de una canasta básica de alimentos y otros bienes; la línea internacional del Banco Mundial en dólares PPA diarios) o <b>relativa</b> (por ejemplo, 50 % o 60 % de la mediana del ingreso).</p>
<p>Enfoques alternativos: necesidades básicas insatisfechas (NBI), pobreza multidimensional (Alkire-Foster: privaciones simultáneas en educación, salud, vivienda, trabajo) y el enfoque de capacidades.</p></section>
<section><h3>La familia Foster-Greer-Thorbecke (1984)</h3>
<div class="mj">\[P_\alpha=\frac1n\sum_{y_i&lt;z}\left(\frac{z-y_i}{z}\right)^\alpha\]</div>
<ul><li>\(P_0\): <b>incidencia</b> (proporción de pobres). No cambia si un pobre se empobrece más.</li><li>\(P_1\): <b>brecha</b>. \(P_1\cdot z\cdot n\) es el costo mínimo de eliminar la pobreza con transferencias perfectamente focalizadas.</li><li>\(P_2\): <b>severidad</b>. Pondera más a los más pobres: es sensible a la desigualdad entre los pobres y cumple el axioma de transferencia.</li></ul></section>
<section><h3>Desnutrición y trampas</h3><p>Ray (cap. 8 y 13) muestra cómo la relación entre nutrición y capacidad de trabajo puede generar trampas: quien está mal nutrido produce poco, gana poco y sigue mal nutrido. La pobreza no es solo falta de ingreso sino una restricción que se reproduce.</p></section>
${LAB}`},

{id:"desigualdad", parte:P1, u:1, t:"La desigualdad y su relación con el crecimiento", sim:"gini", html:String.raw`
<section><h3>Medir la desigualdad</h3><p class="lead">Un buen índice de desigualdad cumple cuatro principios (Ray, cap. 6): anonimato, independencia de la población, independencia de la escala del ingreso y el <b>principio de transferencias de Pigou-Dalton</b> (pasar ingreso de un rico a un pobre, sin invertir su orden, reduce la desigualdad).</p>
<ul><li><b>Curva de Lorenz</b>: porcentaje acumulado del ingreso frente al porcentaje acumulado de la población, ordenada de menor a mayor ingreso. La diagonal es la igualdad perfecta.</li><li><b>Coeficiente de Gini</b>: el doble del área entre la diagonal y la curva de Lorenz; va de 0 (igualdad) a 1.</li><li><b>Theil</b>: \(T=\frac1n\sum\frac{y_i}{\mu}\ln\frac{y_i}{\mu}\); se descompone entre grupos y dentro de ellos.</li><li><b>Atkinson</b> con aversión a la desigualdad \(\varepsilon\): \(A=1-y_{EDE}/\mu\), donde \(y_{EDE}\) es el ingreso equivalente igualmente distribuido.</li><li>Razones de cuantiles: 20/20 y el <b>índice de Palma</b> (ingreso del 10 % más rico sobre el del 40 % más pobre).</li></ul>
<p>Si dos curvas de Lorenz se cruzan, distintos índices pueden ordenar las distribuciones de forma distinta.</p></section>
<section><h3>Desigualdad, ingreso y crecimiento</h3><p><b>Hipótesis de Kuznets (1955)</b>: la desigualdad sube en las primeras etapas del desarrollo (paso de la agricultura a la industria) y luego baja: una U invertida. La evidencia de corte transversal la apoya débilmente y en buena parte se debe a América Latina, región de ingreso medio y alta desigualdad.</p><p>En sentido contrario, la desigualdad puede afectar el crecimiento: si los mercados de crédito son imperfectos, los pobres no pueden invertir en educación o en negocios (canal de imperfecciones de capital); la desigualdad también genera presión redistributiva e inestabilidad política.</p></section>
${LAB}`},

{id:"demografia", parte:P1, u:1, t:"Demografía y desarrollo", sim:"malthus", html:String.raw`
<section><h3>La transición demográfica</h3><p class="lead">Las sociedades pasan por fases: (1) natalidad y mortalidad altas, crecimiento lento; (2) la mortalidad cae (salud pública, alimentación) y la población crece rápido; (3) la natalidad cae con la urbanización, la educación de las mujeres y la menor mortalidad infantil; (4) ambas bajas y crecimiento lento o nulo. En la fase 3 aparece el <b>bono demográfico</b>: más personas en edad de trabajar por cada dependiente.</p></section>
<section><h3>La trampa malthusiana</h3><p>Malthus (1798): con tierra fija y rendimientos decrecientes, si el ingreso supera la subsistencia la población crece, el ingreso por persona vuelve a caer y el mejoramiento técnico se traduce en <b>más población, no en más bienestar</b>. Este modelo describe razonablemente el mundo preindustrial. La Revolución Industrial rompió la trampa porque el progreso técnico se aceleró y la fecundidad cayó.</p>
<div class="mj">\[y_t=A\,N_t^{\beta-1}\quad(\beta<1)\qquad \frac{N_{t+1}-N_t}{N_t}=\theta\,(y_t-\bar y)\]</div>
<p>Desde el punto de vista del hogar, la fecundidad responde a costos y beneficios de los hijos (seguro para la vejez, mano de obra familiar, costo de oportunidad del tiempo de la madre).</p></section>
${LAB}`},

// ===================== UNIDAD 2 =====================
{id:"harrod", parte:P2, u:2, t:"Teorías clásicas y el modelo Harrod-Domar", sim:"hd", html:String.raw`
<section><h3>De los clásicos a Harrod-Domar</h3><p class="lead">Smith atribuía el crecimiento a la división del trabajo y la acumulación; Ricardo, a la acumulación limitada por los rendimientos decrecientes de la tierra; Marx, a la reinversión de la plusvalía. El modelo de <b>Harrod (1939) y Domar (1946)</b> formaliza la idea de que el ahorro financia la inversión y la inversión hace crecer el capital.</p></section>
<section><h3>El modelo</h3><p>Con una relación capital-producto fija \(v=K/Y\), ahorro \(S=sY\) y depreciación \(\delta\):</p>
<div class="mj">\[g=\frac{s}{v}-\delta\qquad\text{y por persona}\qquad g_y\approx\frac{s}{v}-\delta-n\]</div>
<p>Implicaciones: para crecer más hay que ahorrar más o usar el capital más eficientemente. Fue la base del <b>modelo de brecha de financiamiento</b>: si un país quiere crecer a una tasa objetivo y su ahorro no alcanza, la ayuda externa llena la diferencia \(s^{req}=v(g^*+\delta)\).</p></section>
<section><h3>Más allá de Harrod-Domar</h3><p>Problemas: la relación capital-producto no es fija (hay sustitución entre factores), el ahorro y la tasa de crecimiento de la población son endógenos al desarrollo, y la evidencia no muestra que la ayuda se convierta uno a uno en inversión ni la inversión en crecimiento (Easterly, 2001, cap. 2 y 3). Además, Harrod señaló la inestabilidad del equilibrio: la tasa garantizada \(s/v\) solo por casualidad coincide con la natural \(n\) (el «filo de la navaja»).</p></section>
${LAB}`},

{id:"solow", parte:P2, u:2, t:"El modelo de Solow", sim:"solow", html:String.raw`
<section><h3>Supuestos</h3><p class="lead">Solow (1956) permite sustituir capital por trabajo con rendimientos decrecientes de cada factor. Con \(y=k^\alpha\) (producto por trabajador efectivo), ahorro \(s\), crecimiento de la población \(n\), progreso técnico \(g\) y depreciación \(\delta\):</p>
<div class="mj">\[\dot k=s\,k^\alpha-(n+g+\delta)\,k\qquad k^*=\left(\frac{s}{n+g+\delta}\right)^{\frac1{1-\alpha}}\qquad y^*=\left(\frac{s}{n+g+\delta}\right)^{\frac\alpha{1-\alpha}}\]</div></section>
<section><h3>Lecciones</h3><ul><li>Un ahorro mayor eleva el <b>nivel</b> del ingreso de largo plazo, pero no su tasa de crecimiento: en el estado estacionario el ingreso por trabajador crece a la tasa \(g\) del progreso técnico, que es exógena.</li><li>Una población que crece más rápido reduce el ingreso de estado estacionario.</li><li><b>Regla de oro</b>: el consumo de estado estacionario es máximo cuando \(s=\alpha\).</li><li>Los países más lejos de su estado estacionario crecen más rápido: convergencia (condicional a sus parámetros).</li><li>Velocidad de convergencia cerca del estado estacionario: \(\lambda=(1-\alpha)(n+g+\delta)\); vida media \(\ln 2/\lambda\).</li></ul>
<p class="hint">Con \(\alpha\) ≈ 1/3 el modelo predice una convergencia de alrededor de 4 % al año, más rápida que el 2 % observado; con un capital ampliado que incluya capital humano (Mankiw, Romer y Weil, 1992), \(\alpha\) es mayor y la predicción se acerca a los datos.</p></section>
${LAB}`},

{id:"endogeno", parte:P2, u:2, t:"Nuevas teorías del crecimiento", sim:"ak", html:String.raw`
<section><h3>Endogenizar el progreso técnico</h3><p class="lead">En Solow el crecimiento de largo plazo depende de un progreso técnico que cae del cielo. Las teorías del <b>crecimiento endógeno</b> (Romer, 1986 y 1990; Lucas, 1988; Rebelo, 1991) lo explican dentro del modelo, de modo que la política puede afectar la tasa de crecimiento y no solo el nivel.</p></section>
<section><h3>Tres mecanismos</h3><ul><li><b>Modelo AK</b>: si el capital, entendido en sentido amplio (físico, humano, conocimiento), no tiene rendimientos decrecientes, \(Y=AK\) y \(g=sA-\delta-n\): el ahorro afecta el crecimiento permanentemente y no hay convergencia.</li><li><b>Externalidades y rendimientos crecientes</b> (Romer, 1986): cada empresa enfrenta rendimientos decrecientes, pero la inversión de todas genera conocimiento que se derrama; en el agregado los rendimientos son constantes o crecientes.</li><li><b>Inversión deliberada en ideas</b> (Romer, 1990): las ideas son <b>no rivales</b> y parcialmente excluibles; se producen con investigadores: \(\dot A=\delta L_A A\). El crecimiento depende del número de investigadores y de los incentivos (patentes, poder de mercado temporal).</li><li><b>Capital humano</b> (Lucas, 1988): la educación aumenta la productividad propia y la de otros; el tiempo dedicado a acumularlo determina el crecimiento.</li></ul></section>
<section><h3>Implicaciones de política</h3><p>Subsidios a la investigación, protección de la propiedad intelectual, educación, apertura para importar ideas. Pero los modelos de escala predicen que países más grandes crecen más rápido, algo que los datos no confirman (Jones, 1995), lo que llevó a modelos «semiendógenos».</p></section>
${LAB}`},

{id:"convergencia", parte:P2, u:2, t:"El problema de la convergencia", sim:"conv", html:String.raw`
<section><h3>Tres conceptos</h3><ul><li><b>Convergencia β absoluta</b>: los países pobres crecen más rápido que los ricos sin importar sus características. Se prueba con la regresión \(g_i=a+\beta\ln y_{i0}+u_i\) y se espera \(\beta<0\).</li><li><b>Convergencia β condicional</b>: los países convergen a sus propios estados estacionarios. Se controla por ahorro, población, capital humano e instituciones: \(g_i=a+\beta\ln y_{i0}+\gamma'X_i+u_i\).</li><li><b>Convergencia σ</b>: la dispersión del ingreso (desviación estándar del logaritmo) cae en el tiempo. La convergencia β es necesaria, pero no suficiente, para la σ.</li></ul></section>
<section><h3>Evidencia</h3><p>Entre los estados de EE. UU., las regiones europeas y los países de la OCDE hay convergencia absoluta a una velocidad cercana al 2 % anual (Barro y Sala i Martin). En una muestra amplia de países no la hay: los pobres no crecen más rápido en promedio. Sí aparece convergencia condicional. Pritchett (1997) habla de «divergencia, a lo grande» en los dos últimos siglos.</p>
<p>De la pendiente se recupera la velocidad: si \(g\) es el crecimiento promedio anual en \(T\) años, \(\beta=-(1-e^{-\lambda T})/T\), es decir \(\lambda=-\ln(1+\beta T)/T\).</p></section>
${LAB}`},

// ===================== UNIDAD 3 =====================
{id:"etapas", parte:P3, u:3, t:"Rostow, Big Push y encadenamientos de Hirschman", sim:"encad", html:String.raw`
<section><h3>Las etapas de Rostow (1960)</h3><p class="lead">Sociedad tradicional, condiciones previas para el despegue, <b>despegue</b> (la inversión pasa de 5 % a más de 10 % del ingreso y aparecen sectores líderes), marcha hacia la madurez y era del consumo masivo. Crítica: es una descripción de la experiencia británica más que una teoría; no todos los países siguen la misma secuencia.</p></section>
<section><h3>Crecimiento equilibrado: el Big Push</h3><p>Rosenstein-Rodan (1943): una fábrica aislada no es rentable porque sus trabajadores no gastan todo su salario en lo que ella produce; si muchas industrias se instalan a la vez, cada una crea demanda para las otras. Hay <b>complementariedades</b> y, por tanto, <b>equilibrios múltiples</b>: todos tradicionales o todos industrializados. Se necesita un empujón coordinado (planificación, inversión pública). Murphy, Shleifer y Vishny (1989) lo formalizaron; Nurkse habló del «círculo vicioso de la pobreza».</p></section>
<section><h3>Crecimiento desequilibrado: Hirschman (1958)</h3><p>Los recursos escasos no son el capital sino la <b>capacidad de tomar decisiones de inversión</b>. Conviene crear desequilibrios que obliguen a invertir: promover sectores con fuertes <b>encadenamientos</b> hacia atrás (demandan insumos de muchos sectores) y hacia adelante (sus productos son insumo de otros). Con la matriz insumo-producto se miden con los índices de Rasmussen sobre la inversa de Leontief.</p>
<p>Perroux complementa con los <b>polos de desarrollo</b>: industrias motrices que arrastran a su región. Myrdal describe la <b>causación circular acumulativa</b>: las regiones exitosas atraen recursos y las rezagadas los pierden (efectos de retroceso frente a efectos de difusión).</p></section>
${LAB}`},

{id:"lewis", parte:P3, u:3, t:"Economías duales: el modelo de Lewis", sim:"lewis", html:String.raw`
<section><h3>Dos sectores</h3><p class="lead">Lewis (1954): una economía con un sector <b>tradicional</b> (agricultura de subsistencia, con excedente de mano de obra cuyo producto marginal es casi nulo) y un sector <b>moderno</b> (capitalista, que reinvierte sus ganancias). El sector moderno contrata a un salario constante \(\bar w\), algo por encima del ingreso de subsistencia, y la oferta de trabajo es <b>ilimitada</b> a ese salario.</p></section>
<section><h3>La dinámica</h3><p>El sector moderno emplea hasta donde el producto marginal iguala \(\bar w\). Como el salario no sube, toda la ganancia de productividad va a utilidades, que se reinvierten: el capital crece, la demanda de trabajo se desplaza y el sector absorbe más trabajadores del tradicional. El ahorro como proporción del ingreso sube, que es lo que Lewis quería explicar.</p><p>Cuando se agota el excedente (el <b>punto de inflexión de Lewis</b>), el salario empieza a subir y la economía entra a una fase neoclásica.</p></section>
<section><h3>Críticas y extensiones</h3><p>Ranis y Fei agregaron la necesidad de que la productividad agrícola crezca para evitar que suba el precio de los alimentos. Harris y Todaro (1970) explican el <b>desempleo urbano</b>: los migrantes comparan el salario urbano esperado (salario por probabilidad de empleo) con el rural, y la migración continúa aunque haya desempleo en la ciudad. Esto genera el sector informal.</p></section>
${LAB}`},

{id:"cepal", parte:P3, u:3, t:"CEPAL, estructuralismo y estrategias comerciales", sim:"thirlwall", html:String.raw`
<section><h3>Centro y periferia</h3><p class="lead">Prebisch (1949) y Singer (1950): la economía mundial se divide en un <b>centro</b> industrial y una <b>periferia</b> exportadora de materias primas. Por la baja elasticidad ingreso de la demanda de bienes primarios, la mayor productividad y el poder de los sindicatos y empresas del centro, los <b>términos de intercambio</b> de la periferia tienden a deteriorarse: necesita exportar cada vez más para importar lo mismo.</p></section>
<section><h3>Industrialización por sustitución de importaciones</h3><p>La respuesta fue producir internamente lo que se importaba, protegido con aranceles, cuotas y tipo de cambio sobrevaluado. Funcionó en una primera etapa (bienes de consumo), pero tropezó con mercados internos pequeños, dependencia de bienes de capital importados, ineficiencia y crisis de balanza de pagos. El argumento de la <b>industria naciente</b> justifica una protección temporal si hay aprendizaje y si se retira a tiempo.</p></section>
<section><h3>Asia frente a América Latina</h3><p>Corea del Sur y Taiwán combinaron intervención estatal con <b>promoción de exportaciones</b>: el apoyo se condicionaba al desempeño en mercados externos, lo que disciplinaba a las empresas. Además invirtieron fuerte en educación y tenían menos desigualdad. Es el contraste clásico del curso.</p></section>
<section><h3>La ley de Thirlwall</h3><p>En la tradición estructuralista, el crecimiento de largo plazo está restringido por la balanza de pagos: un país no puede crecer de forma sostenida más de lo que le permiten sus exportaciones:</p>
<div class="mj">\[g_B=\frac{\varepsilon\,z}{\pi}\]</div>
<p>donde \(\varepsilon\) es la elasticidad ingreso de las exportaciones, \(z\) el crecimiento mundial y \(\pi\) la elasticidad ingreso de las importaciones. Cambiar la estructura productiva hacia bienes con mayor \(\varepsilon\) es la forma de crecer más.</p></section>
${LAB}`},

// ===================== UNIDAD 4 =====================
{id:"trampas", parte:P4, u:4, t:"Determinantes últimos: el debate Sachs-Collier-Easterly", sim:"trampa", html:String.raw`
<section><h3>Tres visiones</h3><ul><li><b>Sachs</b> (El fin de la pobreza; Economía para un planeta abarrotado): los países más pobres están en una <b>trampa de pobreza</b> por geografía, enfermedad y falta de infraestructura; un gran aumento de la ayuda, bien coordinado, puede sacarlos (una versión moderna del Big Push).</li><li><b>Collier</b> (El club de la miseria): «el millardo de abajo» está atrapado por cuatro trampas: conflicto, recursos naturales, mal gobierno y estar sin salida al mar con malos vecinos. Propone ayuda, intervenciones de seguridad, leyes y comercio.</li><li><b>Easterly</b> (En busca del crecimiento; La carga del hombre blanco): los grandes planes desde arriba fracasan; las personas responden a incentivos y el desarrollo viene de «buscadores» que experimentan desde abajo.</li></ul></section>
<section><h3>¿Qué es una trampa de pobreza?</h3><p>Una situación con <b>equilibrios múltiples</b>: si el capital por trabajador es bajo, la economía cae a un equilibrio de pobreza; si supera un umbral, converge a uno alto. Aparece si la función de producción o el ahorro tienen un tramo convexo (por ejemplo, el ahorro solo es posible por encima de la subsistencia, o hay un tamaño mínimo para que la inversión sea productiva). Una transferencia que cruce el umbral tiene efecto permanente; una que no lo cruce se disipa.</p></section>
${LAB}`},

{id:"instituciones", parte:P4, u:4, t:"Instituciones, cultura y capital social", sim:"tarjetas", html:String.raw`
<section><h3>North: las reglas del juego</h3><p class="lead">Douglass North (1990) define las <b>instituciones</b> como las restricciones creadas por los humanos que estructuran la interacción: <b>formales</b> (constituciones, leyes, derechos de propiedad), <b>informales</b> (costumbres, normas, códigos de conducta) y sus <b>mecanismos de cumplimiento</b>. Reducen la incertidumbre y los costos de transacción. El cambio institucional es incremental y depende de la trayectoria (path dependence).</p></section>
<section><h3>Acemoglu, Johnson y Robinson</h3><p>Las instituciones son la causa fundamental del crecimiento de largo plazo. Para aislar su efecto usan la mortalidad de los colonos europeos como instrumento: donde los colonos morían, crearon <b>instituciones extractivas</b>; donde se asentaron, <b>inclusivas</b>. La «reversión de la fortuna»: las colonias más ricas en 1500 son hoy más pobres. Rodrik, Subramanian y Trebbi (2004) concluyen que las instituciones «gobiernan» sobre la geografía y la integración comercial.</p></section>
<section><h3>Propiedad, democracia y cultura</h3><ul><li><b>Hernando de Soto</b> (El misterio del capital): los pobres tienen activos pero sin títulos formales; es «capital muerto» que no sirve como garantía. La formalización de la propiedad permitiría convertirlo en capital.</li><li><b>Democracia y desarrollo</b>: la relación es compleja; la democracia limita la expropiación pero puede generar presiones redistributivas; la evidencia sugiere que la democracia favorece el crecimiento en el largo plazo y reduce la volatilidad.</li><li><b>Weber</b>: la ética protestante y el espíritu del capitalismo. La cultura es difícil de abordar desde la economía y existe el riesgo de explicaciones circulares.</li><li><b>Capital social</b> (Putnam, Coleman): redes, normas de reciprocidad y confianza que facilitan la cooperación; se asocia con mejor gobierno y mayor crecimiento.</li></ul></section>
<section><h3>¿Cómo medir las instituciones?</h3><p>Indicadores de gobernanza del Banco Mundial (voz y rendición de cuentas, estabilidad política, efectividad del gobierno, calidad regulatoria, estado de derecho, control de la corrupción), protección contra la expropiación, restricciones al ejecutivo (Polity), Doing Business. Todos son percepciones o medidas de facto con problemas de endogeneidad.</p></section>
${LAB}`},

{id:"geografia", parte:P4, u:4, t:"Geografía, recursos naturales y nueva geografía económica", sim:"enferm", html:String.raw`
<section><h3>Geografía física</h3><p class="lead">Sachs y Gallup: el clima tropical (enfermedades como la malaria, suelos pobres) y el acceso al mar (costos de transporte) explican parte de las diferencias de ingreso. Acemoglu et al. responden que la geografía actúa sobre todo a través de las instituciones que se crearon.</p></section>
<section><h3>La maldición de los recursos</h3><p>Países con abundantes recursos naturales tienden a crecer menos (Sachs y Warner). Canales:</p><ul><li><b>Enfermedad holandesa</b>: el auge exportador del recurso aprecia la tasa de cambio real y atrae factores hacia el sector de no transables; se contrae la manufactura, que es la que genera aprendizaje.</li><li><b>Volatilidad</b> de los precios de las materias primas.</li><li><b>Economía política</b>: búsqueda de rentas, corrupción, debilitamiento institucional; Collier asocia la dependencia de exportaciones primarias con mayor riesgo de <b>conflicto armado</b> (los recursos financian a los grupos armados).</li></ul></section>
<section><h3>Localización y nueva geografía económica</h3><p>Teorías clásicas de la localización: Von Thünen (anillos de uso del suelo según el costo de transporte al mercado), Weber (localización industrial que minimiza costos de transporte), Christaller y Lösch (lugares centrales). <b>Krugman (1991)</b> explica la aglomeración con rendimientos crecientes, costos de transporte y movilidad de factores: cuando los costos de transporte caen lo suficiente, la industria se concentra en un núcleo y la otra región queda como periferia, aunque partan iguales. Pequeñas diferencias iniciales tienen efectos grandes.</p></section>
${LAB}`},

// ===================== UNIDAD 5 =====================
{id:"heterodoxas", parte:P5, u:5, t:"Globalización, sostenibilidad y desarrollo local", sim:"cluster", html:String.raw`
<section><h3>La globalización y sus críticos</h3><p class="lead">Stiglitz (El malestar en la globalización): la apertura de capitales y las recetas uniformes del Consenso de Washington aplicadas sin secuencia ni redes de protección causaron crisis. <b>Ha-Joon Chang</b> (Retirar la escalera): los países ricos se desarrollaron con protección e intervención, y hoy recomiendan a los pobres lo contrario. Friedman (La tierra es plana) representa la visión optimista.</p></section>
<section><h3>Desarrollo sostenible</h3><p>El informe Brundtland (1987): satisfacer las necesidades del presente sin comprometer las de las generaciones futuras. La <b>curva de Kuznets ambiental</b> plantea que la contaminación sube y luego baja con el ingreso; vale para algunos contaminantes locales, no para el CO₂. Los Objetivos de Desarrollo Sostenible (2015) integran dimensiones económicas, sociales y ambientales.</p></section>
<section><h3>Desarrollo endógeno local</h3><p>El enfoque «de abajo hacia arriba» (Vázquez Barquero, Garofoli): el desarrollo surge de los recursos, empresas e instituciones del territorio. Los <b>distritos industriales italianos</b> son redes de pymes especializadas en una actividad, con cooperación y competencia, conocimiento compartido y confianza. <b>Porter</b> define los <b>clústeres</b> como concentraciones geográficas de empresas e instituciones relacionadas, y explica su competitividad con el «diamante»: condiciones de los factores, de la demanda, industrias relacionadas y de apoyo, y estrategia y rivalidad. Medellín ha aplicado esta idea con su iniciativa de ciudad clúster.</p>
<p>El <b>cociente de localización</b> identifica la especialización de una región: \(CL=\dfrac{e_{ir}/e_r}{E_i/E}\). Si \(CL>1\), la región está más especializada en el sector \(i\) que el país.</p></section>
${LAB}`}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"panorama",links:["panorama","solow","instituciones"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"heterodoxas",links:["pobreza","solow","lewis","instituciones"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"heterodoxas",links:["etapas","cepal","trampas"],sim:"abiertas",html:WSBOX,d:"Preguntas de ensayo con esquema de respuesta."},
 {id:"autores",t:"Línea de tiempo de las ideas",anchor:"heterodoxas",links:["harrod","etapas","cepal","instituciones"],sim:"tiempo",html:WSBOX,d:"Autores y obras en orden cronológico."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"heterodoxas",links:["panorama","desigualdad","solow","convergencia"],sim:"hoja",html:WSBOX,d:"Índices y modelos del curso."}];
const ALIAS={};
const GL=[
{u:1,t:"Desarrollo económico",d:"Mejora sostenida del bienestar: ingreso, salud, educación, menor pobreza y desigualdad, y ampliación de capacidades."},
{u:1,t:"Capacidades (Sen)",d:"Lo que una persona puede efectivamente ser y hacer; el desarrollo es la expansión de esas libertades reales."},
{u:1,t:"Índice de Desarrollo Humano",d:"Media geométrica de índices de salud, educación e ingreso (logaritmo del INB per cápita)."},
{u:1,t:"Paridad de poder adquisitivo",d:"Conversión que iguala el poder de compra entre países; corrige que los no transables son más baratos en países pobres."},
{u:1,t:"Línea de pobreza",d:"Ingreso mínimo para cubrir una canasta básica (absoluta) o una fracción de la mediana (relativa)."},
{u:1,t:"Incidencia (P₀)",d:"Proporción de la población por debajo de la línea de pobreza."},
{u:1,t:"Brecha de pobreza (P₁)",d:"Déficit promedio de ingreso de los pobres respecto a la línea, como proporción de la línea, sobre toda la población."},
{u:1,t:"Severidad (P₂)",d:"Promedio de las brechas al cuadrado; da más peso a los más pobres."},
{u:1,t:"Curva de Lorenz",d:"Proporción acumulada del ingreso frente a la proporción acumulada de la población ordenada de menor a mayor."},
{u:1,t:"Coeficiente de Gini",d:"Doble del área entre la diagonal de igualdad y la curva de Lorenz."},
{u:1,t:"Principio de Pigou-Dalton",d:"Una transferencia de un rico a un pobre que no invierte su orden debe reducir la desigualdad."},
{u:1,t:"Hipótesis de Kuznets",d:"La desigualdad sube y luego baja a medida que aumenta el ingreso per cápita (U invertida)."},
{u:1,t:"Transición demográfica",d:"Paso de natalidad y mortalidad altas a natalidad y mortalidad bajas, con una fase intermedia de crecimiento rápido."},
{u:1,t:"Bono demográfico",d:"Periodo en que la población en edad de trabajar crece más que la dependiente."},
{u:1,t:"Trampa malthusiana",d:"Las mejoras técnicas aumentan la población y no el ingreso por persona, que vuelve a la subsistencia."},
{u:2,t:"Relación capital-producto",d:"Capital necesario por unidad de producto; en Harrod-Domar es fija."},
{u:2,t:"Brecha de financiamiento",d:"Diferencia entre la inversión requerida para un crecimiento objetivo y el ahorro interno."},
{u:2,t:"Estado estacionario",d:"Situación en que el capital por trabajador efectivo no cambia: s·f(k) = (n + g + δ)k."},
{u:2,t:"Regla de oro",d:"Tasa de ahorro que maximiza el consumo de estado estacionario; con Cobb-Douglas, s = α."},
{u:2,t:"Crecimiento endógeno",d:"Teorías en que la tasa de crecimiento de largo plazo se determina dentro del modelo."},
{u:2,t:"Bien no rival",d:"Su uso por uno no impide el uso por otros; las ideas lo son."},
{u:2,t:"Convergencia β",d:"Relación negativa entre el crecimiento y el ingreso inicial."},
{u:2,t:"Convergencia condicional",d:"Convergencia hacia el estado estacionario propio, una vez se controla por sus determinantes."},
{u:2,t:"Convergencia σ",d:"Reducción en el tiempo de la dispersión del logaritmo del ingreso per cápita."},
{u:3,t:"Despegue (Rostow)",d:"Etapa en que la inversión sube a más de 10 % del ingreso y surgen sectores líderes."},
{u:3,t:"Big Push",d:"Inversión coordinada en muchas industrias complementarias para salir de un equilibrio de bajo desarrollo."},
{u:3,t:"Encadenamientos hacia atrás",d:"Demanda de insumos que un sector genera sobre los demás."},
{u:3,t:"Encadenamientos hacia adelante",d:"Uso de la producción de un sector como insumo de otros."},
{u:3,t:"Polo de desarrollo",d:"Industria motriz que arrastra el crecimiento de su región (Perroux)."},
{u:3,t:"Causación circular acumulativa",d:"Las ventajas iniciales se refuerzan: las regiones ricas atraen recursos de las pobres (Myrdal)."},
{u:3,t:"Excedente de mano de obra",d:"Trabajadores del sector tradicional cuyo producto marginal es casi nulo (Lewis)."},
{u:3,t:"Punto de inflexión de Lewis",d:"Momento en que se agota el excedente de trabajo y el salario empieza a subir."},
{u:3,t:"Modelo de Harris-Todaro",d:"La migración depende del salario urbano esperado; explica desempleo urbano persistente."},
{u:3,t:"Términos de intercambio",d:"Relación entre el precio de las exportaciones y el de las importaciones."},
{u:3,t:"Tesis Prebisch-Singer",d:"Tendencia al deterioro de los términos de intercambio de los exportadores de bienes primarios."},
{u:3,t:"Sustitución de importaciones",d:"Estrategia de industrialización que produce internamente lo importado, con protección."},
{u:3,t:"Industria naciente",d:"Argumento para proteger temporalmente una industria mientras aprende y alcanza escala."},
{u:3,t:"Ley de Thirlwall",d:"El crecimiento compatible con la balanza de pagos es εz/π."},
{u:4,t:"Instituciones (North)",d:"Reglas formales e informales y sus mecanismos de cumplimiento que estructuran la interacción humana."},
{u:4,t:"Instituciones extractivas",d:"Concentran el poder y las rentas en una élite y desincentivan la inversión de la mayoría."},
{u:4,t:"Dependencia de la trayectoria",d:"Las decisiones pasadas condicionan las posibles en el presente."},
{u:4,t:"Capital muerto",d:"Activos de los pobres sin título formal, que no pueden usarse como garantía (De Soto)."},
{u:4,t:"Capital social",d:"Redes, normas y confianza que facilitan la cooperación."},
{u:4,t:"Trampa de pobreza",d:"Equilibrio de bajo ingreso del que no se sale sin un impulso que supere un umbral."},
{u:4,t:"Maldición de los recursos",d:"Menor crecimiento en países ricos en recursos naturales."},
{u:4,t:"Enfermedad holandesa",d:"El auge de un recurso aprecia la tasa de cambio real y contrae los otros sectores transables."},
{u:4,t:"Nueva geografía económica",d:"Explica la aglomeración con rendimientos crecientes, costos de transporte y movilidad (Krugman)."},
{u:5,t:"Consenso de Washington",d:"Paquete de reformas de los años noventa: disciplina fiscal, apertura, privatización y desregulación."},
{u:5,t:"Desarrollo sostenible",d:"Satisfacer las necesidades del presente sin comprometer las de las generaciones futuras."},
{u:5,t:"Curva de Kuznets ambiental",d:"La contaminación sube y luego baja con el ingreso per cápita."},
{u:5,t:"Desarrollo endógeno local",d:"Desarrollo impulsado desde el territorio con sus recursos, empresas e instituciones."},
{u:5,t:"Distrito industrial",d:"Red territorial de pymes especializadas con cooperación y competencia."},
{u:5,t:"Clúster",d:"Concentración geográfica de empresas e instituciones relacionadas en un campo (Porter)."},
{u:5,t:"Cociente de localización",d:"Participación de un sector en el empleo regional sobre su participación nacional."}];
const MCQ=[
{u:1,q:"¿Cuál de estos índices NO cambia si un pobre se vuelve aún más pobre sin cruzar la línea?",o:["P₀","P₁","P₂","Índice de Sen"],ok:0,e:"La incidencia solo cuenta cuántos están debajo de la línea."},
{u:1,q:"Desde 2010 el IDH agrega sus tres dimensiones con:",o:["Media aritmética","Media geométrica","Suma ponderada por población","El mínimo de los tres"],ok:1,e:"La media geométrica reduce la sustituibilidad perfecta entre dimensiones."},
{u:1,q:"Un Gini de 0 indica:",o:["Máxima desigualdad","Que todos tienen el mismo ingreso","Que no hay pobres","Que la curva de Lorenz está por debajo de la diagonal"],ok:1,e:"La curva de Lorenz coincide con la diagonal."},
{u:1,q:"La hipótesis de Kuznets plantea que, al crecer el ingreso, la desigualdad:",o:["Siempre baja","Siempre sube","Sube y luego baja","No cambia"],ok:2,e:"U invertida asociada al cambio estructural."},
{u:1,q:"En la trampa malthusiana, un avance técnico produce en el largo plazo:",o:["Mayor ingreso por persona","Mayor población con el mismo ingreso por persona","Menor población","Desempleo"],ok:1,e:"La población crece hasta que el ingreso vuelve a la subsistencia."},
{u:1,q:"¿Qué índice cumple el principio de transferencias entre los pobres?",o:["P₀","P₁","P₂","Ninguno"],ok:2,e:"P₂ eleva al cuadrado las brechas."},
{u:2,q:"En Harrod-Domar, con s = 20 %, v = 4 y δ = 0, el crecimiento es:",o:["2 %","5 %","20 %","80 %"],ok:1,e:"g = s/v = 0,20/4 = 5 %."},
{u:2,q:"En Solow, un aumento permanente de la tasa de ahorro:",o:["Aumenta la tasa de crecimiento de largo plazo","Aumenta el nivel del ingreso de estado estacionario","No tiene efecto","Reduce el ingreso de largo plazo"],ok:1,e:"El crecimiento de largo plazo depende solo de g."},
{u:2,q:"La regla de oro con producción Cobb-Douglas y = k^α se cumple cuando:",o:["s = 1","s = n + δ","s = α","s = 1 − α"],ok:2,e:"Maximiza el consumo de estado estacionario."},
{u:2,q:"En el modelo AK, el crecimiento de largo plazo:",o:["Es cero","Depende de la tasa de ahorro","Solo depende de n","Es igual a g exógeno"],ok:1,e:"g = sA − δ − n."},
{u:2,q:"Las ideas son, según Romer:",o:["Rivales y excluibles","No rivales y parcialmente excluibles","Bienes públicos puros siempre","Rivales y no excluibles"],ok:1,e:"Por eso generan rendimientos crecientes."},
{u:2,q:"La convergencia condicional significa que:",o:["Todos los países llegarán al mismo ingreso","Cada país converge a su propio estado estacionario","Los ricos crecen más rápido","La dispersión cae siempre"],ok:1,e:"Controla por los determinantes del estado estacionario."},
{u:2,q:"En una muestra amplia de países, la evidencia muestra:",o:["Convergencia absoluta fuerte","Convergencia condicional, pero no absoluta","Ni condicional ni absoluta","Solo convergencia σ"],ok:1,e:"Barro, Sala i Martin, Mankiw-Romer-Weil."},
{u:3,q:"El Big Push se justifica por:",o:["Rendimientos decrecientes","Complementariedades de demanda entre industrias","Ventajas comparativas","Inflación baja"],ok:1,e:"Equilibrios múltiples por externalidades de demanda."},
{u:3,q:"Hirschman recomendaba:",o:["Crecimiento equilibrado en todos los sectores","Promover sectores con fuertes encadenamientos","Especializarse en bienes primarios","Abrir completamente la economía"],ok:1,e:"Crecimiento desequilibrado."},
{u:3,q:"En el modelo de Lewis, mientras haya excedente de trabajo, el salario del sector moderno:",o:["Sube con la productividad","Se mantiene constante","Cae","Iguala al producto medio agrícola"],ok:1,e:"La oferta de trabajo es ilimitada a ese salario."},
{u:3,q:"Harris y Todaro explican:",o:["La inflación urbana","El desempleo urbano con migración continua","La tesis Prebisch-Singer","Los polos de desarrollo"],ok:1,e:"Comparación con el salario urbano esperado."},
{u:3,q:"Según Prebisch-Singer, los términos de intercambio de la periferia tienden a:",o:["Mejorar","Deteriorarse","Ser constantes","Oscilar sin tendencia"],ok:1,e:"Baja elasticidad ingreso de los bienes primarios, entre otras razones."},
{u:3,q:"Con ε = 1,5, z = 3 % y π = 2, la ley de Thirlwall da:",o:["2,25 %","4,5 %","1 %","3 %"],ok:0,e:"g = 1,5 × 3/2 = 2,25 %."},
{u:3,q:"La diferencia clave entre Corea y América Latina fue:",o:["Corea no intervino","Corea condicionó el apoyo al desempeño exportador","América Latina exportó más manufacturas","Corea tenía más recursos naturales"],ok:1,e:"Disciplina de mercado externo."},
{u:4,q:"Para North, las instituciones son:",o:["Las organizaciones del Estado","Las reglas del juego formales e informales","Solo las leyes escritas","Los mercados"],ok:1,e:"Las organizaciones son los jugadores."},
{u:4,q:"Acemoglu, Johnson y Robinson usan como instrumento de las instituciones:",o:["La latitud","La mortalidad de los colonos","El idioma","La religión"],ok:1,e:"Determinó el tipo de colonización."},
{u:4,q:"La enfermedad holandesa consiste en:",o:["Una epidemia en Países Bajos","La contracción de otros transables por la apreciación real tras un auge de recursos","El exceso de regulación","La caída de la población"],ok:1,e:"Ocurrió tras el gas en Holanda en los sesenta."},
{u:4,q:"Easterly se diferencia de Sachs en que:",o:["Pide más ayuda","Desconfía de los grandes planes desde arriba","Cree en la geografía","Propone el Big Push"],ok:1,e:"«Buscadores» frente a «planificadores»."},
{u:4,q:"Según De Soto, el capital de los pobres está «muerto» porque:",o:["No existe","No tiene títulos formales","Está en el exterior","Está depreciado"],ok:1,e:"No puede usarse como garantía."},
{u:4,q:"En la nueva geografía económica, la aglomeración surge de:",o:["Diferencias climáticas","Rendimientos crecientes y costos de transporte","Planificación central","Recursos naturales"],ok:1,e:"Krugman, 1991."},
{u:5,q:"Un cociente de localización mayor que 1 indica que la región:",o:["Tiene desempleo","Está más especializada en el sector que el país","Exporta todo","Tiene menos empleo"],ok:1,e:"Participación regional sobre nacional."},
{u:5,q:"«Retirar la escalera» es una crítica de:",o:["Stiglitz","Ha-Joon Chang","Friedman","Porter"],ok:1,e:"Los países ricos usaron protección."},
{u:5,q:"El diamante de Porter NO incluye:",o:["Condiciones de los factores","Condiciones de la demanda","Industrias relacionadas","La tasa de interés internacional"],ok:3,e:"También estrategia y rivalidad, más gobierno y azar."},
{u:5,q:"El desarrollo endógeno local se caracteriza por:",o:["Planificación central","Impulso desde los recursos y actores del territorio","Inversión extranjera exclusivamente","Ayuda internacional"],ok:1,e:"Enfoque de abajo hacia arriba."}];
const ABIERTAS=[
{u:1,q:"Explique la diferencia entre crecimiento y desarrollo económico e ilustre con un ejemplo cómo un país puede crecer sin desarrollarse.",a:["Crecimiento: aumento sostenido del PIB per cápita.","Desarrollo: salud, educación, pobreza, desigualdad, capacidades (Sen).","Ejemplo: crecimiento por un recurso natural concentrado con poca mejora en indicadores sociales.","Por eso existen el IDH y medidas multidimensionales."]},
{u:1,q:"Compare P₀, P₁ y P₂. ¿Por qué un gobierno que solo mira P₀ podría tomar malas decisiones?",a:["Definiciones de incidencia, brecha y severidad.","P₀ premia ayudar a los que están cerca de la línea (los «menos pobres»).","P₁ y P₂ captan la profundidad y la desigualdad entre los pobres.","Implicaciones para la focalización de programas."]},
{u:1,q:"Discuta la relación entre desigualdad y crecimiento en ambos sentidos.",a:["Kuznets: del crecimiento a la desigualdad (U invertida) y su evidencia.","De la desigualdad al crecimiento: mercados de crédito imperfectos, capital humano.","Economía política: redistribución, inestabilidad.","Caso latinoamericano."]},
{u:2,q:"¿Por qué el modelo de Solow predice convergencia condicional y no absoluta? ¿Qué dice la evidencia?",a:["Rendimientos decrecientes del capital.","Cada país tiene su estado estacionario según s, n, δ, g.","Regresión de crecimiento con controles.","Convergencia entre regiones similares, no en el mundo; velocidad cercana al 2 %."]},
{u:2,q:"Compare Harrod-Domar, Solow y el modelo AK respecto al papel del ahorro en el crecimiento.",a:["H-D: g = s/v − δ, el ahorro determina el crecimiento.","Solow: el ahorro afecta el nivel, no la tasa de largo plazo.","AK: el ahorro afecta la tasa de largo plazo.","Implicaciones para la ayuda externa y la política."]},
{u:3,q:"Contraste el crecimiento equilibrado (Rosenstein-Rodan, Nurkse) con el desequilibrado (Hirschman).",a:["Complementariedades y equilibrios múltiples; empujón coordinado.","Hirschman: la escasez es de capacidad de decisión; crear presiones.","Encadenamientos hacia atrás y hacia adelante.","Relevancia para la política industrial; Currie en Colombia."]},
{u:3,q:"Explique el modelo de Lewis y el papel de la reinversión de las utilidades.",a:["Dualismo: sector tradicional con excedente, sector moderno capitalista.","Salario constante, oferta ilimitada.","Reinversión que expande la demanda de trabajo y eleva el ahorro.","Punto de inflexión; extensiones de Ranis-Fei y Harris-Todaro."]},
{u:3,q:"¿Por qué la industrialización por sustitución de importaciones tuvo resultados distintos en América Latina y en el este de Asia?",a:["Tesis de Prebisch-Singer y lógica de la ISI.","Mercados pequeños, protección sin disciplina, crisis de balanza de pagos.","Asia: promoción de exportaciones, condicionalidad, educación, menor desigualdad.","Industria naciente y su retiro."]},
{u:4,q:"Presente el debate Sachs-Collier-Easterly y tome posición.",a:["Sachs: trampas, más ayuda coordinada.","Collier: cuatro trampas del millardo de abajo.","Easterly: incentivos, buscadores frente a planificadores.","Posición argumentada con evidencia."]},
{u:4,q:"¿Instituciones o geografía? Discuta con base en North, Acemoglu et al. y Sachs.",a:["Definición de instituciones y costos de transacción.","AJR: mortalidad de colonos, reversión de la fortuna.","Sachs y Gallup: clima, enfermedad, acceso al mar.","Rodrik et al.: las instituciones gobiernan."]},
{u:5,q:"¿Qué es un clúster y cómo puede contribuir al desarrollo local? Ilustre con Medellín.",a:["Definición de Porter y el diamante.","Distritos italianos y redes.","Cociente de localización como medida.","Ventajas y riesgos; iniciativa de ciudad clúster."]}];
const TL=[
{u:1,a:"1776",t:"Smith, La riqueza de las naciones",d:"La división del trabajo y la extensión del mercado como motores del crecimiento."},
{u:1,a:"1798",t:"Malthus, Ensayo sobre la población",d:"La población crece más rápido que los alimentos: trampa de subsistencia."},
{u:2,a:"1939–1946",t:"Harrod y Domar",d:"Crecimiento con relación capital-producto fija; base de los modelos de brecha."},
{u:3,a:"1943",t:"Rosenstein-Rodan",d:"Industrialización de Europa del Este y del Sudeste: el Big Push."},
{u:3,a:"1949–1950",t:"Prebisch y Singer",d:"Deterioro de los términos de intercambio; nace el estructuralismo de la CEPAL (1948)."},
{u:3,a:"1954",t:"Lewis, desarrollo con oferta ilimitada de trabajo",d:"Economía dual y excedente de mano de obra."},
{u:1,a:"1955",t:"Kuznets",d:"Crecimiento económico y desigualdad: la U invertida."},
{u:2,a:"1956",t:"Solow",d:"Modelo neoclásico de crecimiento con rendimientos decrecientes."},
{u:3,a:"1957",t:"Myrdal",d:"Causación circular acumulativa y regiones subdesarrolladas."},
{u:3,a:"1958",t:"Hirschman, La estrategia del desarrollo económico",d:"Crecimiento desequilibrado y encadenamientos."},
{u:3,a:"1960",t:"Rostow, Las etapas del crecimiento económico",d:"Cinco etapas, del tradicional al consumo masivo."},
{u:3,a:"1970",t:"Harris y Todaro",d:"Migración, desempleo urbano y salario esperado."},
{u:1,a:"1984",t:"Foster, Greer y Thorbecke",d:"Familia de índices de pobreza Pα."},
{u:2,a:"1986–1990",t:"Romer",d:"Externalidades del conocimiento y crecimiento endógeno con ideas."},
{u:5,a:"1987",t:"Informe Brundtland",d:"Definición de desarrollo sostenible."},
{u:2,a:"1988",t:"Lucas",d:"Capital humano y crecimiento endógeno."},
{u:1,a:"1990",t:"Primer Informe de Desarrollo Humano (PNUD)",d:"Nace el IDH, con Mahbub ul Haq y Sen."},
{u:4,a:"1990",t:"North, Instituciones, cambio institucional y desempeño económico",d:"Las instituciones como reglas del juego."},
{u:5,a:"1990",t:"Porter, La ventaja competitiva de las naciones",d:"El diamante y los clústeres."},
{u:4,a:"1991",t:"Krugman, rendimientos crecientes y geografía económica",d:"Modelo centro-periferia."},
{u:2,a:"1992",t:"Mankiw, Romer y Weil",d:"Solow ampliado con capital humano explica gran parte de las diferencias de ingreso."},
{u:4,a:"1995",t:"Sachs y Warner",d:"Abundancia de recursos naturales y crecimiento: la maldición de los recursos."},
{u:1,a:"1999",t:"Sen, Desarrollo y libertad",d:"El desarrollo como expansión de capacidades."},
{u:4,a:"2000",t:"De Soto, El misterio del capital",d:"Capital muerto y formalización de la propiedad."},
{u:4,a:"2001",t:"Acemoglu, Johnson y Robinson",d:"Orígenes coloniales del desarrollo comparado."},
{u:5,a:"2002",t:"Stiglitz y Chang",d:"El malestar en la globalización; Retirar la escalera."},
{u:4,a:"2005–2007",t:"Sachs, Easterly y Collier",d:"El fin de la pobreza, La carga del hombre blanco, El club de la miseria."},
{u:5,a:"2015",t:"Objetivos de Desarrollo Sostenible",d:"Agenda 2030 de las Naciones Unidas."}];
