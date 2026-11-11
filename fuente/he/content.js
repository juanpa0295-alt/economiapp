// =====================================================================
// CONTENIDO: Historia Económica (1503722, U. de Antioquia). Resumen y guía de estudio.
// Bibliografía del programa: Rondo Cameron, Historia económica mundial; Fazio, La globalización en su historia;
// Maddison, The World Economy: a Millennial Perspective.
// =====================================================================
const GUIA_ID="he";
const LAB=`<section><h3>Practica</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Introducción",2:"Unidad 2 · Siglos XV a XVII",3:"Unidad 3 · Siglos XVIII y XIX",4:"Unidad 4 · Siglo XX"};
const U1=UNIDADES[1],U2=UNIDADES[2],U3=UNIDADES[3],U4=UNIDADES[4];
const CLAVE=(xs)=>`<section class="clave"><h3>Para el examen</h3><ul>${xs.map(x=>`<li>${x}</li>`).join("")}</ul></section>`;
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"que-estudia", parte:U1, u:1, t:"¿Qué estudia la historia económica?", sim:"tarjetas", html:String.raw`
<section><h3>Objeto y método</h3><p class="lead">La historia económica estudia cómo las sociedades han producido, distribuido y consumido a lo largo del tiempo, y por qué algunas crecieron y otras no. Está en la frontera entre la economía, que aporta conceptos y modelos, y la historia, que aporta el contexto, las fuentes y la sensibilidad por el cambio.</p>
<p>El curso busca una <b>visión de largo plazo sobre la formación del capitalismo y el crecimiento económico mundial</b>. Las preguntas que lo organizan son: ¿por qué Europa occidental se adelantó a regiones que en el siglo XV eran tan o más ricas? ¿Qué papel jugaron la población, los factores de producción, la tecnología y las instituciones? ¿Cómo se formó una economía mundial integrada?</p></section>
<section><h3>Las cuatro fuerzas que se repiten en todo el curso</h3><ul>
<li><b>Demografía:</b> la población determina la oferta de trabajo y la presión sobre la tierra. Antes de la Revolución Industrial, más población solía significar salarios más bajos (la «trampa maltusiana»).</li>
<li><b>Recursos y factores de producción:</b> tierra, trabajo y capital, y cómo se combinan.</li>
<li><b>Tecnología:</b> los cambios en la forma de producir, que permiten romper los límites de los recursos.</li>
<li><b>Instituciones:</b> las reglas de juego (derechos de propiedad, Estado, mercados, sistema financiero) que incentivan o frenan la inversión y la innovación.</li></ul>
<p>Rondo Cameron insiste en que ninguna explica sola el desarrollo: lo decisivo es su interacción.</p></section>
<section><h3>Fuentes cuantitativas</h3><p>La historia económica usa cada vez más datos. Los más citados en el curso son las series de Angus Maddison (PIB y población desde el año 1, en dólares internacionales de 1990), el Maddison Project que las actualiza, las Penn World Tables (desde 1950) y bases de precios y salarios históricos. Las cifras antiguas son estimaciones con márgenes amplios: sirven para ver órdenes de magnitud y tendencias, no décimas.</p></section>
${CLAVE(["Define historia económica y di qué la diferencia de la historia del pensamiento económico (hechos frente a ideas).","Nombra las cuatro fuerzas (demografía, recursos, tecnología, instituciones) y da un ejemplo de cada una.","Explica qué mide el PIB per cápita de Maddison y por qué las cifras anteriores a 1820 son aproximadas."])}
${LAB}`,
qs:[{q:"¿Qué es la trampa maltusiana?",a:"La situación preindustrial en la que los aumentos de producción se traducían en más población y no en más ingreso por persona, de modo que el nivel de vida volvía a la subsistencia."}]},

{id:"ciclos", parte:U1, u:1, t:"Ciclos largos de acumulación y globalización", sim:"tiempo", html:String.raw`
<section><h3>Ciclos largos de acumulación</h3><p class="lead">El curso organiza cinco siglos en tres <b>ciclos de acumulación</b>: periodos largos en los que un centro económico, un tipo de comercio y una forma de organizar la producción dominan la economía mundial, hasta que se agotan y otro centro toma el relevo.</p>
<div class="tbl"><table><tr><th>Ciclo</th><th>Periodo</th><th>Centro</th><th>Motor</th></tr>
<tr><td>Primero</td><td>Siglos XV a XVII</td><td>Península ibérica, luego Países Bajos</td><td>Expansión ultramarina, metales americanos, comercio a larga distancia, mercantilismo</td></tr>
<tr><td>Segundo</td><td>Siglos XVIII y XIX</td><td>Gran Bretaña</td><td>Revolución Industrial, carbón y vapor, libre comercio, patrón oro</td></tr>
<tr><td>Tercero</td><td>Siglo XX</td><td>Estados Unidos</td><td>Producción en masa, gran empresa, petróleo y electricidad, dólar</td></tr></table></div>
<p>Autores como Giovanni Arrighi hablan de «ciclos sistémicos de acumulación» (genovés, holandés, británico y estadounidense), y Kondratiev de ondas largas de unos 50 años. El esquema del curso es una forma de ordenar, no una ley.</p></section>
<section><h3>Las olas de globalización</h3><p>Fazio muestra que la globalización tiene historia: no empezó en 1990.</p><ul>
<li><b>Desde 1492:</b> la conexión de América, Europa, África y Asia (intercambio colombino, plata hacia China, comercio de esclavos).</li>
<li><b>1870-1914:</b> la primera gran globalización: caída del costo del transporte (vapor, ferrocarril, canal de Suez en 1869), patrón oro, migraciones masivas y flujos de capital.</li>
<li><b>1914-1945:</b> desglobalización: guerras, proteccionismo y colapso del comercio en la Gran Depresión.</li>
<li><b>Desde 1945, y sobre todo desde 1980:</b> reconstrucción del comercio (GATT), liberalización financiera, cadenas globales de valor.</li></ul></section>
${CLAVE(["Asocia cada ciclo con su centro y su motor.","Explica por qué 1870-1914 se llama la primera globalización y qué la interrumpió.","Distingue entre globalización comercial, financiera y migratoria."])}
${LAB}`,
qs:[{q:"¿Qué interrumpió la primera globalización?",a:"La Primera Guerra Mundial (1914) y después la Gran Depresión, con proteccionismo y abandono del patrón oro."}]},

{id:"tendencias", parte:U1, u:1, t:"Tendencias de largo plazo por regiones", sim:"madd", html:String.raw`
<section><h3>Lo que muestran los datos de Maddison</h3><p class="lead">Durante la mayor parte de la historia el ingreso por persona casi no creció: entre el año 1 y el año 1000 el promedio mundial se mantuvo cerca de 450 dólares de 1990. El despegue sostenido empieza en Europa occidental y sus «ramificaciones» (Estados Unidos, Canadá, Australia, Nueva Zelanda) después de 1820.</p>
<ul><li><b>Crecimiento moderno:</b> entre 1820 y 1998 el PIB per cápita mundial se multiplicó más de 8 veces, algo sin precedentes.</li>
<li><b>Divergencia:</b> en 1820 la región más rica tenía unas 3 veces el ingreso de la más pobre; a fines del siglo XX la distancia era cercana a 19 veces.</li>
<li><b>Convergencia parcial después de 1950:</b> Japón primero, luego Asia oriental y desde los años ochenta China e India, crecen más rápido que los países ricos.</li></ul></section>
<section><h3>Cómo leer una serie larga</h3><p>Para comparar periodos de distinta duración se usa la <b>tasa de crecimiento anual compuesta</b>: g = (Y_final / Y_inicial)^(1/años) − 1. Con g = 1 % el ingreso se duplica en unos 70 años; con g = 3 %, en unos 23 (regla del 70: años para duplicar ≈ 70 / g en porcentaje). Pequeñas diferencias de tasa, sostenidas por siglos, producen las enormes brechas actuales.</p></section>
${CLAVE(["Explica la diferencia entre crecimiento extensivo (más población y producción total) e intensivo (más producción por persona).","Calcula una tasa anual compuesta entre dos años y úsala para comparar regiones.","Describe la divergencia del siglo XIX y la convergencia de Asia en el XX."])}
${LAB}`,
qs:[{q:"Si el PIB per cápita pasa de 1.000 a 4.000 en 140 años, ¿a qué tasa creció?",a:"4^(1/140) − 1 ≈ 1 % anual: se duplicó dos veces en unos 70 años cada una."}]},

// ===================== UNIDAD 2 =====================
{id:"siglo-xv", parte:U2, u:2, t:"La economía mundial en el siglo XV y la gran divergencia", sim:"crec", html:String.raw`
<section><h3>Un mundo sin un centro único</h3><p class="lead">Hacia 1500 Europa no era la región más avanzada. China (dinastía Ming) tenía la mayor población, un Estado burocrático, grandes ciudades y técnicas como el papel, la imprenta, la pólvora y la brújula; el Imperio otomano controlaba las rutas entre el Mediterráneo y Asia; India era un gran productor textil; y en América existían los imperios azteca e inca. Cameron describe estas economías no occidentales «en vísperas de la expansión occidental».</p>
<p>Las expediciones de Zheng He (1405-1433) llegaron hasta África oriental con flotas mayores que las europeas, pero la corte Ming las suspendió: un ejemplo de cómo una decisión política puede cerrar una trayectoria.</p></section>
<section><h3>La gran divergencia</h3><p>Se llama <b>gran divergencia</b> al proceso por el cual Europa occidental (y luego sus ramificaciones) se separó del resto del mundo en ingreso y poder. Hay dos grandes posiciones sobre su origen:</p><ul>
<li><b>Divergencia temprana:</b> Europa ya llevaba ventaja antes de 1800 por sus instituciones (competencia entre Estados, derechos de propiedad, ciudades autónomas), su ciencia y su cultura comercial (Landes, North).</li>
<li><b>Divergencia tardía:</b> hasta cerca de 1750-1800 las regiones más avanzadas de China y Europa eran comparables; la diferencia la hicieron el carbón accesible y los recursos de América (Pomeranz, 2000).</li></ul>
<p>Diamond (Armas, gérmenes y acero) añade una explicación de muy largo plazo: la geografía, la domesticación de plantas y animales y las enfermedades dieron ventaja a Eurasia sobre América.</p></section>
${CLAVE(["Describe tres economías no europeas hacia 1500 y qué tenían de avanzado.","Contrasta la tesis de la divergencia temprana con la tardía (Pomeranz).","Resume el argumento de Diamond sobre geografía y enfermedades."])}
${LAB}`,
qs:[{q:"Según Pomeranz, ¿qué dos factores explican la divergencia?",a:"El carbón cerca de los centros industriales británicos y los recursos de las colonias americanas, que liberaron a Europa de la restricción de tierra."}]},

{id:"expansion", parte:U2, u:2, t:"La expansión de Europa: tecnología, ilustración y Estado-nación", sim:"tiempo", html:String.raw`
<section><h3>Por qué Europa salió al mundo</h3><p class="lead">La expansión ultramarina combinó técnica, incentivos económicos y competencia política. La carabela, el timón de codaste, la vela latina, la brújula y la cartografía permitieron navegar el Atlántico; la búsqueda de especias y oro sin pasar por intermediarios otomanos y venecianos dio el motivo; y la rivalidad entre monarquías dio el impulso.</p>
<ul><li><b>Portugal:</b> rodea África (Bartolomé Díaz, 1488; Vasco da Gama llega a la India en 1498) y crea una red de factorías comerciales.</li>
<li><b>Castilla:</b> Colón llega a América en 1492; conquista de México (1521) y Perú (1532); explotación de plata (Potosí, 1545; Zacatecas).</li>
<li><b>Países Bajos e Inglaterra:</b> en el siglo XVII desplazan a los ibéricos con compañías por acciones (Compañía de las Indias Orientales inglesa, 1600; holandesa, VOC, 1602) y finanzas más desarrolladas (Banco de Ámsterdam, 1609).</li></ul></section>
<section><h3>Ilustración y Estado-nación</h3><p>La revolución científica (Copérnico, Galileo, Newton) y la Ilustración del siglo XVIII difundieron una visión del mundo basada en la razón y la experimentación, que favoreció la innovación técnica. Al mismo tiempo se formaron <b>Estados nacionales</b> centralizados, con ejércitos permanentes, burocracias y sistemas fiscales: necesitaban ingresos y por eso promovieron el comercio y las manufacturas. Cameron llama a esta etapa la «segunda logística» de Europa: una fase de expansión de población y producción entre 1450 y 1650, seguida por la crisis del siglo XVII.</p></section>
${CLAVE(["Ordena cronológicamente los viajes y conquistas de 1488 a 1545.","Explica por qué las compañías por acciones dieron ventaja a holandeses e ingleses.","Relaciona la formación del Estado-nación con el mercantilismo."])}
${LAB}`,
qs:[{q:"¿Qué innovación institucional distinguió a la VOC?",a:"Era una compañía por acciones permanente, con capital transferible y responsabilidad limitada de hecho, que reunía grandes sumas para el comercio a larga distancia."}]},

{id:"colonialismo", parte:U2, u:2, t:"Colonialismo en América, mercantilismo y comercio transatlántico", sim:"quiz", html:String.raw`
<section><h3>La economía colonial americana</h3><p class="lead">La colonización transformó América en proveedora de metales preciosos y productos tropicales. En Hispanoamérica dominaron la <b>minería de plata</b> (Potosí, Zacatecas) y el trabajo forzado indígena (encomienda, mita); en el Caribe y Brasil, la <b>plantación azucarera</b> con trabajo esclavo africano. La conquista trajo además un colapso demográfico: las epidemias (viruela, sarampión) redujeron la población indígena en una proporción enorme durante el primer siglo.</p></section>
<section><h3>Mercantilismo</h3><p>El mercantilismo fue la política económica de los Estados europeos entre los siglos XVI y XVIII. Sus rasgos: identificar la riqueza con los metales preciosos, buscar una <b>balanza comercial favorable</b> (exportar más de lo que se importa), proteger las manufacturas nacionales, conceder monopolios comerciales y usar las colonias como mercados cautivos y fuentes de materias primas (pacto colonial). Las Leyes de Navegación inglesas (1651) y el colbertismo francés son ejemplos.</p>
<p>La llegada masiva de plata americana contribuyó a la <b>revolución de los precios</b> del siglo XVI en Europa, y buena parte de esa plata terminó en Asia, sobre todo en China, que la demandaba para su sistema monetario.</p></section>
<section><h3>El comercio triangular</h3><p>En el Atlántico se formó un circuito: manufacturas europeas hacia África, esclavos africanos hacia América (más de 12 millones de personas embarcadas entre los siglos XVI y XIX) y azúcar, tabaco, algodón y metales hacia Europa. Este comercio es central en el debate sobre cuánto contribuyeron las colonias a la acumulación europea (Eric Williams sostuvo que financió la industrialización británica; otros autores le dan un peso menor).</p></section>
${CLAVE(["Diferencia la economía minera hispanoamericana de la economía de plantación.","Enumera cuatro rasgos del mercantilismo.","Explica la revolución de los precios y el destino asiático de la plata."])}
${LAB}`,
qs:[{q:"¿Qué es el pacto colonial?",a:"La regla mercantilista según la cual la colonia solo comercia con su metrópoli: le vende materias primas y le compra manufacturas."}]},

// ===================== UNIDAD 3 =====================
{id:"revolucion", parte:U3, u:3, t:"La Revolución Industrial en Gran Bretaña", sim:"tarjetas", html:String.raw`
<section><h3>Qué cambió</h3><p class="lead">Entre 1760 y 1840, aproximadamente, Gran Bretaña pasó de una economía agraria y artesanal a una basada en la fábrica, la máquina y la energía mineral. El cambio decisivo fue que el <b>crecimiento de la productividad se volvió sostenido</b>: por primera vez el ingreso por persona subió de forma continua junto con la población.</p>
<ul><li><b>Algodón:</b> lanzadera volante (Kay, 1733), hiladora jenny (Hargreaves, c. 1765), máquina hidráulica (Arkwright, 1769), mule (Crompton, 1779) y telar mecánico (Cartwright, 1785).</li>
<li><b>Energía:</b> la máquina de vapor de Watt (patente de 1769) aplicó el carbón a la industria y luego al transporte.</li>
<li><b>Hierro:</b> fundición con coque (Darby, 1709) y pudelado (Cort, 1784).</li>
<li><b>Transporte:</b> canales y, desde 1825-1830, ferrocarril (Stockton-Darlington, Liverpool-Manchester).</li></ul></section>
<section><h3>Por qué en Gran Bretaña</h3><p>Se combinan varias explicaciones: carbón abundante y barato; salarios altos en relación con el precio de la energía y del capital, que hacían rentable mecanizar (Robert Allen); un mercado interno integrado y un imperio comercial; instituciones favorables tras la Revolución Gloriosa (1688), con un Parlamento que limitaba al rey y protegía la propiedad (North y Weingast); una agricultura más productiva y cercamientos que liberaron mano de obra; y una cultura de ingenieros y artesanos hábiles.</p></section>
<section><h3>El costo social</h3><p>Las primeras décadas trajeron jornadas largas, trabajo infantil y ciudades insalubres; las novelas de Dickens (Tiempos difíciles, 1854) retratan ese mundo. Hay un debate sobre si el nivel de vida obrero subió o bajó antes de 1850 (optimistas frente a pesimistas); hoy se acepta que los salarios reales crecieron lento hasta mediados del siglo XIX y luego más rápido.</p></section>
${CLAVE(["Asocia cada invento con su sector y su década.","Da tres explicaciones de por qué la revolución empezó en Gran Bretaña (Allen, North, carbón).","Explica el debate sobre el nivel de vida durante la industrialización."])}
${LAB}`,
qs:[{q:"¿Cuál es el argumento de Robert Allen?",a:"Gran Bretaña tenía salarios altos y energía barata (carbón), así que convenía inventar máquinas que ahorraran trabajo usando carbón; en otros países no era rentable."}]},

{id:"division", parte:U3, u:3, t:"División internacional del trabajo: centro, semiperiferia y periferia", sim:"tiempo", html:String.raw`
<section><h3>La difusión de la industrialización</h3><p class="lead">En el siglo XIX la industria se extendió desde Gran Bretaña a Bélgica, Francia, Alemania, Estados Unidos y, al final del siglo, a Japón (restauración Meiji, 1868) y Rusia. Cameron estudia distintos «modelos de crecimiento»: los países que llegaron después no copiaron a Gran Bretaña, sino que usaron <b>sustitutos</b> (Gerschenkron): bancos de inversión en Alemania, el Estado en Rusia y Japón.</p>
<p>Los <b>sectores estratégicos</b> de la segunda revolución industrial (desde 1870) fueron el acero (proceso Bessemer, 1856), la química, la electricidad y el motor de combustión.</p></section>
<section><h3>Centros, semiperiferias y periferias</h3><p>Con la caída de los costos de transporte se formó una división internacional del trabajo: el <b>centro</b> (Europa noroccidental y Estados Unidos) exportaba manufacturas y capital; la <b>periferia</b> (América Latina, Asia, África) exportaba alimentos y materias primas; la <b>semiperiferia</b> (sur y este de Europa, Rusia) ocupaba una posición intermedia. Es el esquema de Wallerstein (sistema-mundo) y, en América Latina, el punto de partida de Prebisch y la CEPAL.</p></section>
<section><h3>El nuevo imperialismo</h3><p>Entre 1870 y 1914 las potencias se repartieron África (Conferencia de Berlín, 1884-1885) y gran parte de Asia. Las explicaciones económicas (búsqueda de mercados, materias primas y destinos para el capital, según Hobson y Lenin) conviven con las políticas y estratégicas.</p></section>
${CLAVE(["Explica la tesis de Gerschenkron sobre el atraso relativo.","Describe el papel de cada zona en la división internacional del trabajo.","Da causas económicas y políticas del reparto de África."])}
${LAB}`,
qs:[{q:"¿Qué sustitutos usaron Alemania y Rusia según Gerschenkron?",a:"En Alemania, los grandes bancos de inversión que financiaron la industria pesada; en Rusia, el propio Estado."}]},

{id:"estado-finanzas", parte:U3, u:3, t:"El papel del Estado y el sistema financiero", sim:"abiertas", html:String.raw`
<section><h3>Finanzas y crecimiento</h3><p class="lead">Niall Ferguson (El ascenso del dinero) muestra que las innovaciones financieras acompañaron cada etapa: la banca italiana, los bonos públicos holandeses e ingleses, las sociedades anónimas, las bolsas y los seguros. Un sistema financiero desarrollado moviliza el ahorro hacia la inversión y permite al Estado endeudarse a bajo costo.</p>
<ul><li><b>Banco de Inglaterra (1694):</b> creado para financiar al Estado; con la deuda pública británica creíble, Inglaterra pudo financiar sus guerras más barato que Francia.</li>
<li><b>Patrón oro:</b> Gran Bretaña lo adopta de hecho en 1821, y entre 1870 y 1880 se generaliza (Alemania 1871-1873, Estados Unidos de hecho en 1879). Fijaba los tipos de cambio y daba confianza a los flujos de capital; su costo era la deflación y el ajuste vía desempleo en los países con déficit.</li>
<li><b>Exportación de capital:</b> Londres financió ferrocarriles y gobiernos en todo el mundo; Gran Bretaña llegó a invertir en el exterior una proporción muy alta de su ahorro antes de 1914.</li></ul></section>
<section><h3>El Estado en la industrialización</h3><p>Incluso en la Gran Bretaña «liberal», el Estado definió derechos de propiedad, protegió el comercio con su marina y aplicó aranceles hasta la abolición de las Leyes del Grano (1846). Los países tardíos usaron más el Estado: aranceles (Alemania de Bismarck, Estados Unidos), ferrocarriles estatales, educación técnica. El debate libre comercio frente a protección (Friedrich List, 1841) es de este periodo.</p></section>
${CLAVE(["Explica cómo funcionaba el patrón oro y por qué daba estabilidad y a la vez rigidez.","Relaciona la deuda pública inglesa con su poder militar.","Contrasta el libre comercio británico con el proteccionismo de los países tardíos (List)."])}
${LAB}`,
qs:[{q:"¿Qué ventaja dio el Banco de Inglaterra al Estado británico?",a:"Le permitió endeudarse de forma creíble y barata, y así financiar guerras y el imperio mejor que sus rivales."}]},

// ===================== UNIDAD 4 =====================
{id:"eeuu", parte:U4, u:4, t:"El ascenso de Estados Unidos", sim:"madd", html:String.raw`
<section><h3>De ramificación europea a primera potencia</h3><p class="lead">Hacia 1870 Estados Unidos alcanzó a Gran Bretaña en PIB total, a fines del siglo XIX se convirtió en la mayor economía del mundo y antes de 1914 ya la superaba en ingreso por persona. Sus ventajas: un mercado interno enorme e integrado por el ferrocarril (transcontinental en 1869), abundancia de tierra y recursos naturales, inmigración masiva, alta escolaridad y aranceles que protegieron la industria.</p>
<ul><li><b>Producción en masa:</b> el «sistema americano» de piezas intercambiables y, desde 1913, la línea de ensamblaje de Ford.</li>
<li><b>La gran empresa:</b> corporaciones gigantes en ferrocarriles, acero (Carnegie, US Steel), petróleo (Standard Oil) y la respuesta antimonopolio (Ley Sherman, 1890).</li>
<li><b>Hegemonía financiera:</b> después de la Primera Guerra Mundial pasó de deudor a acreedor del mundo; tras 1945 el dólar se volvió la moneda central del sistema.</li></ul></section>
${CLAVE(["Enumera cinco factores del ascenso estadounidense.","Explica qué es la producción en masa y por qué encajaba con el mercado de Estados Unidos.","Señala cuándo Estados Unidos pasó de deudor a acreedor internacional."])}
${LAB}`,
qs:[{q:"¿Por qué la producción en masa se desarrolló primero en Estados Unidos?",a:"Por su mercado interno grande y homogéneo, la escasez relativa de mano de obra calificada y la abundancia de recursos, que favorecían productos estandarizados hechos con máquinas."}]},

{id:"entreguerras", parte:U4, u:4, t:"Primera Guerra Mundial, revolución rusa y la crisis de 1929", sim:"tiempo", html:String.raw`
<section><h3>La desintegración de la economía internacional</h3><p class="lead">La Primera Guerra Mundial (1914-1918) rompió la economía mundial del siglo XIX: suspendió el patrón oro, destruyó capital, endeudó a los aliados con Estados Unidos e impuso a Alemania reparaciones enormes (Tratado de Versalles, 1919; Keynes criticó sus «consecuencias económicas de la paz»). Alemania sufrió la hiperinflación de 1923.</p>
<p>La <b>revolución rusa (1917)</b> creó la primera economía planificada: tras el comunismo de guerra y la Nueva Política Económica (NEP, 1921), Stalin impuso desde 1928 los planes quinquenales y la colectivización agraria, con industrialización acelerada y enormes costos humanos.</p></section>
<section><h3>La Gran Depresión</h3><p>Tras el auge de los años veinte, la bolsa de Nueva York se desplomó en octubre de 1929. La crisis se volvió mundial por la combinación de quiebras bancarias en cadena, una política monetaria contractiva atada al patrón oro, la caída de los precios agrícolas y el proteccionismo (arancel Smoot-Hawley, 1930). Entre 1929 y 1932-1933 la producción industrial de Estados Unidos cayó casi a la mitad, el desempleo superó el 20 % y el comercio mundial se redujo en dos tercios en valor.</p>
<p>Los países que <b>abandonaron antes el patrón oro</b> (Gran Bretaña en 1931) se recuperaron antes (Eichengreen). Las respuestas fueron el New Deal de Roosevelt (1933), el rearme en Alemania y, en América Latina, la industrialización por sustitución de importaciones.</p></section>
${CLAVE(["Describe tres efectos económicos de la Primera Guerra Mundial.","Explica cómo el patrón oro transmitió y profundizó la Gran Depresión.","Caracteriza la economía soviética: NEP, planes quinquenales y colectivización."])}
${LAB}`,
qs:[{q:"¿Por qué se recuperaron antes los países que dejaron el patrón oro?",a:"Porque pudieron devaluar y expandir la oferta monetaria, frenando la deflación, mientras los que lo mantuvieron debían seguir contrayendo."}]},

{id:"edad-oro", parte:U4, u:4, t:"Segunda Guerra Mundial, bloque soviético y la edad de oro", sim:"quiz", html:String.raw`
<section><h3>La reconstrucción del orden económico</h3><p class="lead">Tras la Segunda Guerra Mundial (1939-1945) los aliados diseñaron instituciones para evitar los errores de entreguerras. En <b>Bretton Woods (1944)</b> se crearon el Fondo Monetario Internacional y el Banco Mundial y un sistema de tipos de cambio fijos pero ajustables, con el dólar convertible en oro a 35 dólares la onza. El GATT (1947) inició la reducción negociada de aranceles, y el Plan Marshall (1948-1952) financió la reconstrucción europea.</p></section>
<section><h3>La edad de oro (1950-1973)</h3><p>Fue el periodo de mayor crecimiento de la historia en Europa occidental y Japón: reconstrucción, convergencia tecnológica hacia Estados Unidos, traslado de trabajadores del campo a la industria, energía barata, Estado de bienestar y acuerdos entre empresas, sindicatos y Estado. Se inició la integración europea (Tratado de Roma, 1957).</p>
<p>Al mismo tiempo, la Unión Soviética y Europa del Este formaron un <b>bloque de planificación central</b> (CAME, 1949), que creció rápido en los cincuenta con industria pesada pero se estancó desde los setenta por problemas de incentivos e innovación, hasta su colapso en 1989-1991.</p></section>
<section><h3>El fin de la edad de oro</h3><p>En 1971 Estados Unidos suspendió la convertibilidad del dólar en oro (Nixon) y en 1973 terminó el sistema de tipos fijos. Las crisis del petróleo (1973 y 1979) trajeron estanflación: inflación alta con estancamiento.</p></section>
${CLAVE(["Nombra las instituciones de Bretton Woods y la función de cada una.","Explica las causas del crecimiento excepcional de 1950-1973.","Describe el fin de Bretton Woods y la estanflación de los setenta."])}
${LAB}`,
qs:[{q:"¿Qué fijaba el sistema de Bretton Woods?",a:"Tipos de cambio fijos pero ajustables frente al dólar, y el dólar convertible en oro a 35 dólares la onza para los bancos centrales."}]},

{id:"debates", parte:U4, u:4, t:"Intervencionismo frente a libre mercado", sim:"abiertas", html:String.raw`
<section><h3>El péndulo de la política económica</h3><p class="lead">El siglo XX alternó entre confianza en el mercado y confianza en el Estado, según las crisis de cada época.</p>
<div class="tbl"><table><tr><th>Etapa</th><th>Idea dominante</th><th>Contexto</th></tr>
<tr><td>Hasta 1914</td><td>Liberalismo: libre comercio, patrón oro, Estado pequeño</td><td>Primera globalización</td></tr>
<tr><td>1930-1970</td><td>Intervencionismo: Keynes, Estado de bienestar, planificación indicativa, sustitución de importaciones</td><td>Gran Depresión, guerra, edad de oro</td></tr>
<tr><td>1980-2007</td><td>Neoliberalismo: privatización, desregulación, apertura, independencia de los bancos centrales (Consenso de Washington, 1989)</td><td>Estanflación, crisis de la deuda latinoamericana (1982), colapso soviético</td></tr>
<tr><td>Desde 2008</td><td>Retorno parcial del Estado: rescates, regulación financiera, política industrial</td><td>Crisis financiera global</td></tr></table></div></section>
<section><h3>Argumentos de cada lado</h3><p>A favor del mercado: asigna recursos con información descentralizada, premia la innovación y limita la captura del poder (Hayek, Friedman). A favor de la intervención: los mercados fallan (desempleo involuntario, externalidades, inestabilidad financiera) y el desarrollo tardío necesitó al Estado (Keynes, Gerschenkron, la experiencia de Asia oriental). La historia económica sugiere que el resultado depende de la calidad de las instituciones más que de la cantidad de Estado.</p></section>
${CLAVE(["Ubica cada etapa del péndulo con un hecho que la desencadenó.","Expón el mejor argumento de cada lado con un ejemplo histórico.","Explica qué fue el Consenso de Washington."])}
${LAB}`,
qs:[{q:"¿Qué hecho de 1982 marcó el giro de América Latina hacia el ajuste?",a:"La crisis de la deuda, iniciada con la moratoria de México."}]},

{id:"regiones", parte:U4, u:4, t:"El crecimiento por regiones en el siglo XX", sim:"madd", html:String.raw`
<section><h3>Trayectorias regionales</h3><ul>
<li><b>Unión Europea:</b> reconstrucción, mercado común y moneda única (euro, 1999); convergencia del sur y del este.</li>
<li><b>Norteamérica:</b> liderazgo tecnológico de Estados Unidos; integración con el TLCAN (1994).</li>
<li><b>América Latina:</b> crecimiento con sustitución de importaciones hasta 1980, «década perdida» con la crisis de la deuda, apertura en los noventa; la brecha con los países ricos casi no se cerró.</li>
<li><b>Asia:</b> el «milagro» de Japón y luego de Corea del Sur, Taiwán, Hong Kong y Singapur, con exportaciones manufactureras, alta inversión y educación; China crece desde las reformas de Deng Xiaoping (1978) y la India desde la liberalización de 1991.</li>
<li><b>África:</b> independencias en los sesenta; estancamiento en los ochenta y noventa por conflictos, dependencia de materias primas e instituciones débiles; recuperación parcial en el siglo XXI.</li>
<li><b>Medio Oriente:</b> economías ligadas al petróleo, con alta volatilidad (OPEP, 1960; choques de 1973 y 1979).</li></ul></section>
<section><h3>¿Por qué unas convergen y otras no?</h3><p>Los casos de convergencia exitosa combinan alta inversión y ahorro, educación, estabilidad macroeconómica, integración al comercio mundial con política industrial y Estados capaces. Los fracasos suelen asociarse con conflictos, instituciones extractivas (Acemoglu y Robinson) y dependencia de unos pocos productos primarios.</p></section>
${CLAVE(["Compara la trayectoria de América Latina con la de Asia oriental desde 1950.","Explica qué fue la década perdida.","Da tres condiciones comunes en los casos de convergencia."])}
${LAB}`,
qs:[{q:"¿Qué hecho de 1978 inició el crecimiento rápido de China?",a:"Las reformas de mercado de Deng Xiaoping: responsabilidad familiar en el campo, zonas económicas especiales y apertura a la inversión extranjera."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"glosario",t:"Tarjetas de conceptos",anchor:"que-estudia",links:["que-estudia","revolucion"],sim:"tarjetas",html:WSBOX,d:"Todos los conceptos del curso en tarjetas, por unidad."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"debates",links:["colonialismo","edad-oro"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación. El parcial evalúa las unidades 1 y 2; el final, la 3 y la 4."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"debates",links:["estado-finanzas","debates"],sim:"abiertas",html:WSBOX,d:"Preguntas de desarrollo con esquema de respuesta para comparar."},
 {id:"cronologia",t:"Línea de tiempo",anchor:"entreguerras",links:["ciclos","expansion","entreguerras"],sim:"tiempo",html:WSBOX,d:"Los hechos del curso en orden, con buscador."}];
const ALIAS={};

// ---------- Datos de estudio
const GL=[
{u:1,t:"Historia económica",d:"Estudio de cómo las sociedades han producido, distribuido y consumido a lo largo del tiempo y de las causas del crecimiento y el atraso."},
{u:1,t:"Trampa maltusiana",d:"Situación preindustrial en la que los aumentos de producción elevaban la población y no el ingreso por persona."},
{u:1,t:"Crecimiento extensivo",d:"Aumento de la producción total por más población o más recursos, sin que suba la producción por persona."},
{u:1,t:"Crecimiento intensivo",d:"Aumento sostenido de la producción por persona, gracias a la productividad."},
{u:1,t:"Ciclo de acumulación",d:"Periodo largo en el que un centro económico y un tipo de comercio y producción dominan la economía mundial."},
{u:1,t:"Globalización",d:"Integración de mercados de bienes, capital y trabajo entre regiones del mundo; ha tenido olas de avance y retroceso."},
{u:1,t:"Dólar internacional de 1990 (Geary-Khamis)",d:"Unidad de Maddison que corrige por paridad de poder adquisitivo para comparar ingresos entre países y épocas."},
{u:1,t:"Regla del 70",d:"Años necesarios para duplicar una magnitud ≈ 70 dividido por su tasa de crecimiento en porcentaje."},
{u:2,t:"Gran divergencia",d:"Separación de Europa occidental y sus ramificaciones del resto del mundo en ingreso y poder desde el siglo XVIII-XIX."},
{u:2,t:"Mercantilismo",d:"Política económica de los siglos XVI-XVIII que buscaba acumular metales mediante una balanza comercial favorable, protección y monopolios."},
{u:2,t:"Pacto colonial",d:"Regla por la cual la colonia comerciaba solo con su metrópoli: materias primas a cambio de manufacturas."},
{u:2,t:"Revolución de los precios",d:"Alza general de precios en Europa en el siglo XVI, asociada con la llegada de plata americana y el crecimiento de la población."},
{u:2,t:"Comercio triangular",d:"Circuito atlántico de manufacturas hacia África, esclavos hacia América y productos coloniales hacia Europa."},
{u:2,t:"Mita",d:"Sistema de trabajo forzado rotativo indígena usado en la minería andina, en especial en Potosí."},
{u:2,t:"Compañía por acciones",d:"Empresa con capital dividido en acciones transferibles, como la VOC (1602), que reunía grandes sumas para el comercio lejano."},
{u:2,t:"Estado-nación",d:"Estado centralizado con territorio, ejército, burocracia y fisco propios, que se consolida en Europa en la Edad Moderna."},
{u:3,t:"Revolución Industrial",d:"Transformación iniciada en Gran Bretaña hacia 1760 que hizo sostenido el crecimiento de la productividad gracias a máquinas, fábrica y energía mineral."},
{u:3,t:"Sistema fabril",d:"Organización de la producción en un lugar centralizado con máquinas, trabajadores asalariados y disciplina horaria."},
{u:3,t:"Cercamientos",d:"Cierre y privatización de tierras comunales en Inglaterra, que aumentó la productividad agrícola y liberó mano de obra."},
{u:3,t:"Atraso relativo (Gerschenkron)",d:"Idea de que los países que se industrializan tarde usan sustitutos, como bancos de inversión o el Estado, para los requisitos que faltan."},
{u:3,t:"Segunda revolución industrial",d:"Ola de innovaciones desde 1870 en acero, química, electricidad y motor de combustión."},
{u:3,t:"Centro y periferia",d:"División entre países que exportan manufacturas y capital (centro) y los que exportan productos primarios (periferia)."},
{u:3,t:"Patrón oro",d:"Sistema en el que cada moneda se define en oro y es convertible, lo que fija los tipos de cambio entre países."},
{u:3,t:"Nuevo imperialismo",d:"Expansión colonial de las potencias entre 1870 y 1914, en especial el reparto de África."},
{u:4,t:"Producción en masa",d:"Fabricación de grandes volúmenes de productos estandarizados con piezas intercambiables y línea de ensamblaje."},
{u:4,t:"Gran Depresión",d:"Crisis mundial iniciada en 1929 con caída de la producción, el comercio y los precios, y desempleo masivo."},
{u:4,t:"Planificación central",d:"Sistema en el que el Estado decide qué, cuánto y cómo producir mediante planes, como los planes quinquenales soviéticos."},
{u:4,t:"Bretton Woods",d:"Sistema monetario de 1944 con tipos de cambio fijos frente al dólar, convertible en oro, y creación del FMI y el Banco Mundial."},
{u:4,t:"Edad de oro del capitalismo",d:"Periodo 1950-1973 de crecimiento excepcional en Europa occidental y Japón."},
{u:4,t:"Estanflación",d:"Combinación de inflación alta con estancamiento y desempleo, típica de los años setenta."},
{u:4,t:"Sustitución de importaciones",d:"Estrategia de industrialización que protege la industria nacional para producir lo que antes se importaba."},
{u:4,t:"Consenso de Washington",d:"Conjunto de reformas promovidas desde 1989: disciplina fiscal, apertura, privatización y desregulación."},
{u:4,t:"Década perdida",d:"Los años ochenta en América Latina, con crisis de deuda, inflación alta y caída del ingreso por persona."}];

const MCQ=[
{u:1,q:"Según los datos de Maddison, ¿desde cuándo el PIB per cápita mundial crece de forma sostenida?",o:["Desde el año 1000","Desde alrededor de 1820","Desde 1950","Desde 1500"],ok:1,e:"Antes de 1820 el crecimiento por persona fue casi nulo; desde entonces es sostenido."},
{u:1,q:"¿Cuál de estas NO es una de las fuerzas que el curso usa para explicar el desarrollo?",o:["Demografía","Tecnología","Instituciones","Astrología"],ok:3,e:"Las cuatro fuerzas son demografía, recursos, tecnología e instituciones."},
{u:1,q:"La primera gran globalización moderna se ubica entre:",o:["1492 y 1550","1870 y 1914","1918 y 1939","1945 y 1971"],ok:1,e:"Caída de costos de transporte, patrón oro, migraciones y flujos de capital entre 1870 y 1914."},
{u:1,q:"Si un ingreso crece al 2 % anual, ¿en cuántos años se duplica aproximadamente?",o:["14","35","50","70"],ok:1,e:"Regla del 70: 70 / 2 = 35 años."},
{u:2,q:"¿Quién llegó a la India por mar rodeando África en 1498?",o:["Cristóbal Colón","Vasco da Gama","Bartolomé Díaz","Fernando de Magallanes"],ok:1,e:"Díaz rodeó el cabo en 1488; Vasco da Gama llegó a la India en 1498."},
{u:2,q:"El objetivo central del mercantilismo era:",o:["El libre comercio","Una balanza comercial favorable para acumular metales","La abolición de los monopolios","La reducción del Estado"],ok:1,e:"Exportar más de lo importado para acumular oro y plata."},
{u:2,q:"La tesis de la «divergencia tardía» se asocia con:",o:["David Landes","Kenneth Pomeranz","Adam Smith","Douglass North"],ok:1,e:"Pomeranz (2000) sostiene que China y Europa eran comparables hasta cerca de 1800."},
{u:2,q:"¿Adónde fue a parar buena parte de la plata americana?",o:["A África","A China y Asia","Se quedó en América","A Rusia"],ok:1,e:"China demandaba plata para su sistema monetario y fiscal."},
{u:2,q:"La VOC holandesa (1602) fue importante porque:",o:["Era un banco central","Era una compañía por acciones permanente para el comercio con Asia","Abolió la esclavitud","Inventó la carabela"],ok:1,e:"Reunía capital transferible a gran escala para el comercio a larga distancia."},
{u:2,q:"El sistema de trabajo forzado usado en las minas de Potosí se llamaba:",o:["Mita","Hacienda","Concertaje","Resguardo"],ok:0,e:"La mita andina, heredada y transformada del sistema inca."},
{u:3,q:"¿Qué invento aplicó el carbón como fuente de energía para la industria?",o:["El telar mecánico","La máquina de vapor de Watt","La lanzadera volante","El proceso Bessemer"],ok:1,e:"Watt patentó su máquina en 1769."},
{u:3,q:"Según Robert Allen, la Revolución Industrial empezó en Gran Bretaña porque:",o:["Tenía salarios bajos","Tenía salarios altos y energía barata","Era la más poblada","Tenía más oro"],ok:1,e:"Convenía sustituir trabajo caro por máquinas que usaban carbón barato."},
{u:3,q:"Para Gerschenkron, en Alemania el sustituto del atraso fue:",o:["El Estado zarista","Los bancos de inversión","Las colonias","La agricultura"],ok:1,e:"Los grandes bancos financiaron la industria pesada alemana."},
{u:3,q:"La Conferencia de Berlín (1884-1885) se relaciona con:",o:["El patrón oro","El reparto de África","La unificación alemana","El fin de la esclavitud"],ok:1,e:"Fijó reglas para la ocupación de África por las potencias europeas."},
{u:3,q:"¿Qué país adoptó primero, de hecho, el patrón oro en el siglo XIX?",o:["Estados Unidos","Francia","Gran Bretaña","Alemania"],ok:2,e:"Gran Bretaña desde 1821; los demás se sumaron hacia 1870-1880."},
{u:3,q:"La abolición de las Leyes del Grano (1846) significó para Gran Bretaña:",o:["Más protección agrícola","El giro hacia el libre comercio","La adopción del patrón oro","La creación del Banco de Inglaterra"],ok:1,e:"Eliminó los aranceles a los cereales importados."},
{u:4,q:"¿Qué arancel estadounidense de 1930 agravó la caída del comercio mundial?",o:["McKinley","Smoot-Hawley","Fordney","Sherman"],ok:1,e:"El arancel Smoot-Hawley provocó represalias de otros países."},
{u:4,q:"Según Eichengreen, se recuperaron antes de la Gran Depresión los países que:",o:["Mantuvieron el patrón oro","Abandonaron antes el patrón oro","Subieron más los aranceles","Redujeron el gasto público"],ok:1,e:"Al devaluar pudieron expandir la oferta monetaria y frenar la deflación."},
{u:4,q:"En Bretton Woods el dólar era convertible en oro a:",o:["20 dólares la onza","35 dólares la onza","50 dólares la onza","No era convertible"],ok:1,e:"35 dólares por onza para los bancos centrales, hasta 1971."},
{u:4,q:"La edad de oro del capitalismo corresponde a:",o:["1870-1914","1919-1939","1950-1973","1980-2007"],ok:2,e:"Crecimiento excepcional de Europa occidental y Japón."},
{u:4,q:"La Nueva Política Económica (NEP) soviética:",o:["Colectivizó toda la tierra","Permitió mercados privados limitados","Fue el primer plan quinquenal","Abolió el rublo"],ok:1,e:"Desde 1921, permitió pequeño comercio y venta de excedentes campesinos."},
{u:4,q:"¿Qué hecho terminó la convertibilidad del dólar en oro?",o:["La crisis de 1929","La decisión de Nixon en 1971","El Plan Marshall","La crisis de 2008"],ok:1,e:"En agosto de 1971 Estados Unidos suspendió la convertibilidad."},
{u:4,q:"La «década perdida» de América Latina fue:",o:["Los años treinta","Los años cincuenta","Los años ochenta","Los años 2000"],ok:2,e:"La crisis de la deuda de 1982 abrió una década de estancamiento."},
{u:4,q:"Las reformas de mercado de China empezaron en:",o:["1949","1966","1978","1991"],ok:2,e:"Con Deng Xiaoping, desde 1978."}];

const ABIERTAS=[
{u:1,q:"¿Por qué la historia económica necesita a la vez de la economía y de la historia? Ilustra con un ejemplo.",a:["La economía aporta conceptos (productividad, precios, incentivos) y modelos para explicar.","La historia aporta fuentes, cronología y contexto: las mismas causas no operan igual en todas las épocas.","Ejemplo: explicar la Revolución Industrial requiere un argumento económico (precios relativos de Allen) y uno histórico (instituciones tras 1688, carbón, imperio)."]},
{u:1,q:"Explica la diferencia entre la economía anterior y posterior a 1820 usando los datos de Maddison.",a:["Antes: crecimiento por persona casi nulo; las mejoras se traducían en más población (trampa maltusiana).","Después: crecimiento intensivo sostenido, primero en Europa occidental y sus ramificaciones.","Consecuencia: divergencia entre regiones, de cerca de 3 veces a cerca de 19 veces entre extremos.","Usar tasas compuestas y la regla del 70 para mostrar la magnitud."]},
{u:2,q:"¿Por qué fue Europa, y no China, la que se expandió por el mundo a partir del siglo XV?",a:["China tenía la capacidad técnica (Zheng He), pero la corte Ming suspendió las expediciones.","En Europa la competencia entre Estados empujaba la búsqueda de rutas, oro y especias.","Innovaciones náuticas (carabela, brújula, cartografía) y financieras.","Matizar con Pomeranz: la ventaja en ingreso llegó después, hacia 1800."]},
{u:2,q:"Explica el mercantilismo y su relación con el sistema colonial americano.",a:["Riqueza = metales; balanza comercial favorable; protección y monopolios.","Colonias como fuente de metales y materias primas y mercado cautivo (pacto colonial).","Plata americana: revolución de los precios en Europa y flujo hacia Asia.","Ejemplos: Leyes de Navegación inglesas, colbertismo, monopolio de Sevilla."]},
{u:3,q:"¿Por qué la Revolución Industrial empezó en Gran Bretaña?",a:["Precios relativos: salarios altos y carbón barato hacían rentable mecanizar (Allen).","Instituciones: Parlamento y protección de la propiedad tras 1688 (North y Weingast).","Mercado interno integrado, imperio y comercio exterior.","Agricultura productiva y cercamientos; artesanos e ingenieros hábiles.","Concluir que fue la combinación, no un solo factor."]},
{u:3,q:"Describe la división internacional del trabajo del siglo XIX y sus consecuencias para América Latina.",a:["Centro exporta manufacturas y capital; periferia, productos primarios.","Caída del costo del transporte y patrón oro integraron los mercados.","América Latina se especializó en materias primas (café, minerales, carne) con auges y caídas según los precios externos.","Base del pensamiento de Prebisch y la CEPAL sobre el deterioro de los términos de intercambio."]},
{u:3,q:"¿Qué papel tuvo el sistema financiero en el ascenso británico?",a:["Banco de Inglaterra (1694) y deuda pública creíble.","Financiación barata de guerras e imperio.","Patrón oro desde 1821 y Londres como centro financiero mundial.","Exportación de capital antes de 1914 (ferrocarriles, gobiernos)."]},
{u:4,q:"Explica las causas de la Gran Depresión y por qué fue tan profunda y mundial.",a:["Auge especulativo y caída de la bolsa en 1929.","Quiebras bancarias y contracción monetaria.","El patrón oro obligó a deflación y transmitió la crisis.","Proteccionismo (Smoot-Hawley) y caída del comercio.","Recuperación más rápida de quienes dejaron el oro; New Deal."]},
{u:4,q:"¿Por qué 1950-1973 fue una edad de oro y por qué terminó?",a:["Reconstrucción, convergencia tecnológica, migración campo-ciudad, energía barata.","Instituciones: Bretton Woods, GATT, Plan Marshall, integración europea, Estado de bienestar.","Fin: agotamiento de la convergencia, inflación, fin de la convertibilidad (1971) y choques del petróleo (1973, 1979)."]},
{u:4,q:"Compara las trayectorias de América Latina y Asia oriental desde 1950.",a:["Ambas usaron al Estado, pero Asia orientó la industria a exportar y la sometió a metas de desempeño.","Asia: alta inversión y ahorro, educación, estabilidad macroeconómica.","América Latina: sustitución de importaciones con mercados pequeños, inflación, crisis de deuda en 1982.","Resultado: Asia oriental convergió; América Latina mantuvo la brecha."]}];

const TL=[
{u:2,a:"1405-1433",t:"Expediciones de Zheng He",d:"Flotas chinas llegan hasta África oriental; luego la corte Ming las suspende."},
{u:2,a:"1453",t:"Caída de Constantinopla",d:"Los otomanos controlan las rutas entre Europa y Asia."},
{u:2,a:"1488",t:"Bartolomé Díaz dobla el cabo de Buena Esperanza",d:"Abre la ruta marítima portuguesa hacia el Índico."},
{u:2,a:"1492",t:"Colón llega a América",d:"Inicio del intercambio colombino y de la conexión atlántica."},
{u:2,a:"1498",t:"Vasco da Gama llega a la India",d:"Portugal accede directamente a las especias."},
{u:2,a:"1521 y 1532",t:"Conquista de México y del Perú",d:"Castilla incorpora los imperios azteca e inca."},
{u:2,a:"1545",t:"Descubrimiento de Potosí",d:"La plata andina alimenta la revolución de los precios y el comercio con Asia."},
{u:2,a:"1600 y 1602",t:"Compañías inglesa y holandesa de las Indias Orientales",d:"Compañías por acciones para el comercio con Asia."},
{u:2,a:"1651",t:"Leyes de Navegación inglesas",d:"Política mercantilista: el comercio colonial en barcos ingleses."},
{u:3,a:"1688",t:"Revolución Gloriosa",d:"El Parlamento limita a la monarquía inglesa; mayor seguridad de la propiedad."},
{u:3,a:"1694",t:"Fundación del Banco de Inglaterra",d:"Base de una deuda pública creíble."},
{u:3,a:"1709",t:"Darby funde hierro con coque",d:"El carbón entra en la siderurgia."},
{u:3,a:"1769",t:"Máquina de vapor de Watt y máquina hidráulica de Arkwright",d:"Energía mineral y mecanización del algodón."},
{u:3,a:"1776",t:"La riqueza de las naciones",d:"Adam Smith critica el mercantilismo."},
{u:3,a:"1821",t:"Gran Bretaña adopta de hecho el patrón oro",d:"Convertibilidad de la libra."},
{u:3,a:"1830",t:"Ferrocarril Liverpool-Manchester",d:"Comienza la era del ferrocarril."},
{u:3,a:"1846",t:"Abolición de las Leyes del Grano",d:"Gran Bretaña se vuelve al libre comercio."},
{u:3,a:"1856",t:"Proceso Bessemer",d:"Acero barato: base de la segunda revolución industrial."},
{u:3,a:"1868",t:"Restauración Meiji",d:"Japón inicia su industrialización dirigida por el Estado."},
{u:3,a:"1869",t:"Canal de Suez y ferrocarril transcontinental de Estados Unidos",d:"Caen los costos del transporte mundial."},
{u:3,a:"1884-1885",t:"Conferencia de Berlín",d:"Reparto de África entre las potencias europeas."},
{u:4,a:"1913",t:"Línea de ensamblaje de Ford",d:"Producción en masa."},
{u:4,a:"1914-1918",t:"Primera Guerra Mundial",d:"Fin de la primera globalización; suspensión del patrón oro."},
{u:4,a:"1917",t:"Revolución rusa",d:"Nace la primera economía socialista."},
{u:4,a:"1919",t:"Tratado de Versalles",d:"Reparaciones alemanas; crítica de Keynes."},
{u:4,a:"1923",t:"Hiperinflación alemana",d:"Colapso del marco."},
{u:4,a:"1928",t:"Primer plan quinquenal soviético",d:"Planificación central y colectivización."},
{u:4,a:"1929",t:"Caída de la bolsa de Nueva York",d:"Inicio de la Gran Depresión."},
{u:4,a:"1930",t:"Arancel Smoot-Hawley",d:"Escalada proteccionista."},
{u:4,a:"1931",t:"Gran Bretaña abandona el patrón oro",d:"Inicio de su recuperación."},
{u:4,a:"1933",t:"New Deal",d:"Intervención estatal de Roosevelt."},
{u:4,a:"1944",t:"Conferencia de Bretton Woods",d:"FMI, Banco Mundial y tipos de cambio fijos frente al dólar."},
{u:4,a:"1947",t:"GATT",d:"Comienza la reducción negociada de aranceles."},
{u:4,a:"1948",t:"Plan Marshall",d:"Ayuda de Estados Unidos para la reconstrucción europea."},
{u:4,a:"1957",t:"Tratado de Roma",d:"Nace la Comunidad Económica Europea."},
{u:4,a:"1971",t:"Fin de la convertibilidad del dólar",d:"Nixon suspende el cambio de dólares por oro."},
{u:4,a:"1973 y 1979",t:"Choques del petróleo",d:"Estanflación en los países industriales."},
{u:4,a:"1978",t:"Reformas de Deng Xiaoping",d:"Comienza la apertura de China."},
{u:4,a:"1982",t:"Crisis de la deuda latinoamericana",d:"Moratoria de México; inicia la década perdida."},
{u:4,a:"1989",t:"Caída del muro de Berlín y Consenso de Washington",d:"Fin del bloque soviético y auge de las reformas de mercado."},
{u:4,a:"1999",t:"Nace el euro",d:"Unión monetaria europea."}];
