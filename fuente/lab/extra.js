
// ===================== AJUSTE AL PROGRAMA 1501875 =====================
// Agrega las unidades que faltaban (empleador, trabajador, salario, riesgos laborales, sanciones y derecho comercial)
// y agrupa el tronco por unidades del programa.
(function(){
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
ins("fundamentos",[
{id:"contrato", t:"Período de prueba, concurrencia, suspensión y prescripción", sim:"prueba", html:String.raw`
<section><h3>Período de prueba (arts. 76 a 80 CST)</h3><p class="lead">Es la etapa inicial en la que el empleador evalúa las aptitudes del trabajador y este, las condiciones del trabajo. Debe constar <b>por escrito</b>; si no, no existe.</p>
<ul><li>Máximo <b>dos meses</b>.</li><li>En contratos a término fijo menores de un año: no más de la <b>quinta parte</b> del término pactado, sin pasar de dos meses.</li><li>Durante el período de prueba cualquiera de las partes puede terminar el contrato sin previo aviso y sin indemnización, pero el trabajador tiene todas las prestaciones.</li><li>Si hay contratos sucesivos con el mismo empleador, solo el primero puede tener período de prueba.</li></ul></section>
<section><h3>Concurrencia y coexistencia (arts. 25 y 26 CST)</h3>
<p><b>Concurrencia:</b> aunque el contrato de trabajo aparezca mezclado con otro (arrendamiento, sociedad, mandato), conserva su naturaleza y se rige por el CST. <b>Coexistencia:</b> un trabajador puede tener contratos con varios empleadores a la vez, salvo que se haya pactado exclusividad.</p></section>
<section><h3>Suspensión del contrato (arts. 51 a 53 CST)</h3>
<p>Causas: fuerza mayor o caso fortuito; muerte o inhabilidad del empleador persona natural; suspensión de actividades por el empleador hasta 120 días con autorización del Ministerio; licencia o permiso temporal; sanción disciplinaria (hasta 8 días la primera vez, hasta 2 meses en reincidencia); servicio militar; detención preventiva hasta 30 días; huelga. <b>Efecto:</b> se suspenden la obligación de trabajar y la de pagar salario; el tiempo de suspensión puede descontarse para liquidar vacaciones, cesantías y pensión, pero el empleador sigue cotizando a la seguridad social en algunos casos (licencias).</p></section>
<section><h3>Prescripción, conciliación y transacción</h3>
<p>Las acciones laborales <b>prescriben en tres años</b> desde que la obligación se hizo exigible (art. 488 CST y 151 CPTSS). Un reclamo escrito del trabajador interrumpe la prescripción por una sola vez, y el término vuelve a correr por tres años más. La <b>conciliación</b> y la <b>transacción</b> son válidas solo sobre derechos inciertos y discutibles; los derechos ciertos e indiscutibles (salario mínimo, prestaciones causadas) son irrenunciables (art. 53 de la Constitución y art. 14 CST).</p></section>
${LAB_}`,
qs:[{q:"Un contrato a término fijo de 6 meses, ¿cuánto período de prueba puede tener?",a:"La quinta parte de 6 meses: 36 días (aproximadamente 1,2 meses), por escrito."},{q:"¿Puede un trabajador conciliar el pago de cesantías ya causadas y no discutidas?",a:"No: son derechos ciertos e indiscutibles y por tanto irrenunciables."}]}]);
ins("jornada",[
{id:"partes", t:"El empleador y el trabajador: clases, derechos y obligaciones", html:String.raw`
<section><h3>El empleador</h3>
<ul><li><b>Clases:</b> persona natural o jurídica; empresa (unidad de producción); empleador público o privado.</li>
<li><b>Facultades:</b> la subordinación le permite dar órdenes sobre el modo, tiempo y cantidad de trabajo, e imponer reglamentos (art. 23 CST), siempre respetando la dignidad y los derechos del trabajador.</li>
<li><b>Obligaciones (art. 57):</b> dar los instrumentos y lugares adecuados, dar protección y seguridad, prestar primeros auxilios, pagar la remuneración, respetar la dignidad y creencias, conceder licencias (calamidad, sufragio, luto), dar certificado de trabajo y examen médico de egreso, pagar el regreso si el trabajador se trasladó.</li>
<li><b>Prohibiciones (art. 59):</b> deducir o retener salarios sin orden escrita o judicial, exigir dinero por el empleo, limitar el derecho de asociación, imponer obligaciones religiosas o políticas, hacer o autorizar propaganda política en el trabajo, emplear «listas negras».</li>
<li><b>Representantes (art. 32):</b> directores, gerentes, administradores que ejercen dirección; obligan al empleador.</li>
<li><b>Intermediarios (art. 35):</b> quien contrata trabajadores para un empleador. Si no declara esa calidad, responde solidariamente.</li>
<li><b>Contratista independiente (art. 34):</b> ejecuta una obra con sus propios medios y autonomía; el beneficiario responde solidariamente por salarios y prestaciones si la labor pertenece a su giro ordinario. Las empresas de servicios temporales (Ley 50 de 1990) solo pueden enviar trabajadores en misión para labores ocasionales, reemplazos o picos de producción, hasta por seis meses prorrogables por otros seis.</li></ul></section>
<section><h3>El trabajador</h3>
<ul><li><b>Clases:</b> permanente; ocasional o transitorio (labores de corta duración, no mayores a un mes, distintas a las normales, art. 6); de dirección, confianza y manejo; aprendiz (contrato de aprendizaje, Ley 789 de 2002); trabajador del servicio doméstico.</li>
<li><b>Derechos:</b> salario justo, prestaciones, descansos, seguridad social, libertad de asociación y huelga, trato digno, estabilidad reforzada en casos especiales (embarazo, fuero sindical, discapacidad).</li>
<li><b>Obligaciones (art. 58):</b> cumplir el trabajo y las órdenes, guardar reserva sobre información de la empresa, conservar los instrumentos, guardar buena conducta, comunicar observaciones útiles, prestar auxilio en caso de siniestro.</li>
<li><b>Prohibiciones (art. 60):</b> sustraer elementos, presentarse en estado de embriaguez o bajo efecto de drogas, portar armas, faltar sin justa causa, disminuir el ritmo de trabajo, hacer colectas o propaganda en el trabajo.</li></ul>
<p class="link">La violación grave de las obligaciones o prohibiciones es justa causa de terminación (art. 62), lo que conecta con la estación de indemnizaciones.</p></section>`,
qs:[{q:"Una empresa contrata a un contratista para el aseo de sus oficinas y este no paga las prestaciones. ¿Responde la empresa?",a:"Depende de si el aseo es parte del giro ordinario de su actividad. Si lo es, responde solidariamente (art. 34); si es una labor ajena a su actividad, no."}]},
{id:"salario", t:"El salario: elementos, modalidades, pago y embargo", sim:"salario2", html:String.raw`
<section><h3>Qué es salario (arts. 127 y 128 CST)</h3>
<p class="lead">Es todo lo que recibe el trabajador, en dinero o en especie, como <b>contraprestación directa del servicio</b>, sea cual fuere la forma o denominación: salario fijo o variable, horas extras, recargos, comisiones, porcentajes sobre ventas, viáticos permanentes de manutención y alojamiento.</p>
<p><b>No es salario:</b> lo recibido por mera liberalidad y de forma ocasional (bonificaciones esporádicas), lo que se entrega para desempeñar las funciones (viáticos de transporte y representación, herramientas, dotación), las prestaciones sociales y los beneficios que las partes pacten expresamente como no salariales. Según la Ley 1393 de 2010, los pagos no salariales que superen el <b>40 %</b> de la remuneración total entran en la base de cotización.</p></section>
<section><h3>Modalidades</h3><ul><li><b>Fijo o variable</b> (por unidad de obra, a destajo, comisiones).</li><li><b>En especie</b> (alimentación, vivienda): se valora en el contrato y no puede superar el 50 % del total, ni el 30 % si el trabajador gana el mínimo (art. 129).</li><li><b>Salario integral</b> (art. 132): para quien gana al menos 10 SMMLV más un factor prestacional de al menos 30 %, es decir, <b>13 SMMLV</b> o más. Compensa recargos y prestaciones (salvo vacaciones). Los aportes se liquidan sobre el 70 %.</li></ul></section>
<section><h3>Pago, irrenunciabilidad y embargo</h3>
<ul><li>Se paga en los períodos pactados, que no pueden superar una semana para jornales ni un mes para sueldos (art. 134).</li><li>Es irrenunciable y no puede cederse (art. 142).</li><li><b>Embargo (arts. 154 a 156):</b> el salario mínimo es inembargable. Del excedente sobre el mínimo solo es embargable la <b>quinta parte</b>. Excepciones: por pensiones alimenticias y créditos de cooperativas se puede embargar hasta el <b>50 %</b> del salario.</li></ul></section>
${LAB_}`,
qs:[{q:"Un trabajador gana $3.000.000 y tiene un embargo por un crédito bancario. ¿Cuánto se le puede embargar al mes, con el mínimo de 2026?",a:"El excedente sobre el mínimo es 3.000.000 − 1.750.905 = 1.249.095; la quinta parte es $249.819."}]}]);
ins("vacaciones",[
{id:"riesgos", t:"Dotación, accidentes de trabajo y enfermedad laboral", html:String.raw`
<section><h3>Calzado y vestido de labor (arts. 230 a 234 CST)</h3>
<p class="lead">El empleador debe entregar gratuitamente un par de zapatos y un vestido de labor <b>tres veces al año</b> (30 de abril, 31 de agosto y 20 de diciembre) al trabajador que gane hasta <b>2 SMMLV</b> y lleve más de tres meses de servicio. No se puede compensar en dinero y el trabajador debe usarla en el trabajo.</p></section>
<section><h3>Riesgos laborales (Ley 1562 de 2012 y Decreto 1295 de 1994)</h3>
<ul><li><b>Accidente de trabajo:</b> suceso repentino que sobreviene por causa o con ocasión del trabajo y produce una lesión, perturbación funcional, invalidez o muerte; incluye el trayecto cuando el empleador da el transporte y las actividades recreativas o deportivas en representación de la empresa.</li>
<li><b>Enfermedad laboral:</b> la contraída como resultado de la exposición a factores de riesgo propios de la actividad o del medio de trabajo (hay una tabla oficial de enfermedades laborales).</li>
<li>Todo trabajador debe estar afiliado a una <b>ARL</b>; la cotización la paga el empleador según la clase de riesgo, de 0,522 % (riesgo I, oficinas) a 6,96 % (riesgo V, minería, construcción de alturas).</li>
<li><b>Prestaciones:</b> asistenciales (atención médica, medicamentos, rehabilitación) y económicas: incapacidad temporal (100 % del ingreso base), incapacidad permanente parcial (indemnización), pensión de invalidez y de sobrevivientes.</li></ul>
<p>Si el empleador no afilia al trabajador, asume directamente todas esas prestaciones. Si el accidente ocurre por culpa suficientemente comprobada del empleador, este debe la <b>indemnización plena de perjuicios</b> (art. 216 CST), además de lo que pague la ARL.</p></section>`,
qs:[{q:"Una trabajadora gana $2.000.000 en 2026 y lleva cinco meses. ¿Tiene derecho a dotación?",a:"Sí: gana menos de 2 SMMLV (3.501.810) y lleva más de tres meses."}]},
{id:"sanciones", t:"Sanciones por no consignar cesantías y no pagar intereses", sim:"sancion", html:String.raw`
<section><h3>Las tres sanciones del programa</h3>
<div class="tbl"><table><tr><th>Incumplimiento</th><th>Norma</th><th>Sanción</th></tr>
<tr><td>No pagar salarios y prestaciones al terminar el contrato</td><td>Art. 65 CST (moratoria)</td><td>Un día de salario por cada día de retardo hasta 24 meses; después, intereses moratorios (ver la estación «Indemnización moratoria»)</td></tr>
<tr><td>No consignar las cesantías en el fondo a más tardar el <b>14 de febrero</b></td><td>Art. 99 de la Ley 50 de 1990</td><td>Un día de salario por cada día de retardo</td></tr>
<tr><td>No pagar los intereses sobre cesantías antes del <b>31 de enero</b></td><td>Ley 52 de 1975 y Decreto 116 de 1976</td><td>Pagar otra suma igual a los intereses (es decir, el doble)</td></tr></table></div>
<p>La jurisprudencia exige analizar la <b>buena fe</b> del empleador: si demuestra razones serias para no pagar (por ejemplo, una duda razonable sobre la existencia del contrato), el juez puede absolverlo de la sanción moratoria.</p></section>
${LAB_}`,
qs:[{q:"Un empleador consigna las cesantías el 1 de marzo. Si el salario es $2.400.000, ¿cuánto debe por sanción?",a:"Del 15 de febrero al 1 de marzo son 15 días de retardo: 15 × 80.000 = $1.200.000."}]},
{id:"costumbre", t:"Derecho comercial: la costumbre mercantil", html:String.raw`
<section><h3>Qué es</h3>
<p class="lead">La <b>costumbre mercantil</b> es el conjunto de prácticas que un grupo de personas repite y aplica frente a un hecho o tema determinado, y que llega a ser obligatoria siempre que no contradiga la ley y se practique de manera <b>reiterada, pública y uniforme</b>. En el derecho comercial tiene la misma autoridad que la ley mercantil cuando cumple los requisitos (art. 3 C. Co.).</p>
<p>Para Abelardo Torré es «el conjunto de normas jurídicas derivadas de la repetición más o menos constante de actos uniformes». Bonnecase la define como una regla de derecho que resulta de la unión de dos elementos.</p>
<div class="tbl"><table><tr><th>Elemento</th><th>En qué consiste</th></tr>
<tr><td><b>Material</b></td><td>La repetición constante de actos uniformes: la práctica con la que se resuelve, en una época dada, una dificultad jurídica.</td></tr>
<tr><td><b>Espiritual o psicológico</b></td><td>La convicción de que lo que se hace es jurídicamente obligatorio (no una simple cortesía o hábito).</td></tr></table></div></section>

<section><h3>Clasificación</h3>
<div class="tbl"><table><tr><th>Criterio</th><th>Clase</th><th>Qué significa</th></tr>
<tr><td rowspan="2"><b>Según la función</b> que le da la norma escrita</td><td>Normativa</td><td>Tiene validez general y se acata con la convicción de que es obligatoria, sin importar la voluntad de cada persona.</td></tr>
<tr><td>Interpretativa o convencional</td><td>Aclara una declaración de voluntad: fija el alcance de lo que las partes no pactaron expresamente en un contrato (es una forma tácita de consentimiento).</td></tr>
<tr><td rowspan="3"><b>Según su contenido</b></td><td>Según la ley (secundum legem)</td><td>Se practica sin contradecir la ley o ajustándose a su letra.</td></tr>
<tr><td>Más allá de la ley (praeter legem o extralegal)</td><td>Llena los vacíos de la norma escrita: prevé lo que ella no previó.</td></tr>
<tr><td>Contra la ley (contra legem)</td><td>Va en sentido opuesto a la norma escrita; por eso es <b>inadmisible</b>.</td></tr>
<tr><td rowspan="4"><b>Según su ámbito de aplicación</b></td><td>Local</td><td>Rige en un sitio o zona geográfica determinada.</td></tr>
<tr><td>Nacional</td><td>Se observa en todo o gran parte del territorio colombiano.</td></tr>
<tr><td>Internacional</td><td>Nace y se acata en relaciones entre nacionales de distintos Estados.</td></tr>
<tr><td>Extranjera</td><td>Se acata en una localidad o en todo el territorio de un país distinto de Colombia.</td></tr></table></div></section>

<section><h3>Sus tres funciones (José Ignacio Narváez)</h3>
<ol class="steps">
<li><b>Interpretativa:</b> precisa el sentido de las palabras o frases técnicas o usuales del comercio y de los documentos que prueban contratos u obligaciones mercantiles (art. 5 C. Co.).</li>
<li><b>Integrar las normas legales:</b> cuando la misma ley invoca la costumbre y la eleva a precepto obligatorio; la ley dice cuándo la costumbre la complementa (arts. 640, 827 y 842 C. Co., entre otros).</li>
<li><b>Colmar las lagunas de la ley:</b> a falta de norma expresa, de norma aplicable por analogía o de pacto en el contrato, rige la costumbre del lugar donde surgieron las relaciones o donde deben cumplirse las prestaciones.</li></ol></section>

<section><h3>Requisitos para que sea fuente del derecho</h3>
<p>Según el art. 13 de la Ley 153 de 1887 (aplicable a todo el derecho privado) y el art. 3 del Código de Comercio, la costumbre tiene la misma autoridad que la ley comercial si:</p>
<ol class="steps">
<li><b>Es general:</b> su conocimiento, con convicción de obligatoriedad, está generalizado en el país o al menos en el lugar o grupo social donde se consolidó.</li>
<li><b>Es conforme a la moral:</b> la ley dice «moral cristiana», pero la Corte Constitucional (sentencia C-224 de 1994) la entendió como <b>moral general o social</b>: el conjunto de normas de conducta que en una época se tienen por obligatorias para una persona.</li>
<li><b>No contraría la ley mercantil</b>, ni de forma manifiesta ni tácita. Si hay una norma legal aplicable directamente o por analogía, no se puede invocar la costumbre.</li>
<li><b>Sus hechos son públicos, reiterados y uniformes.</b></li>
<li><b>Rige en el lugar</b> donde deben cumplirse las prestaciones o donde surgieron las relaciones que regula.</li></ol></section>

<section><h3>Cómo se prueba</h3>
<div class="tbl"><table><tr><th>Costumbre</th><th>Medios de prueba</th></tr>
<tr><td><b>Local o nacional</b></td><td><ul style="margin:0;padding-left:18px">
<li>Certificado de la <b>cámara de comercio</b> de la jurisdicción donde deben cumplirse las prestaciones o surgieron las relaciones (art. 86 num. 5: las cámaras recopilan las costumbres de su jurisdicción y certifican su existencia). La costumbre nacional la certifica la <b>Confederación de Cámaras de Comercio</b> (Confecámaras, art. 96).</li>
<li>Copia auténtica de <b>dos decisiones judiciales definitivas</b> que la reconozcan, dictadas dentro de los <b>cinco años</b> anteriores a la diferencia.</li>
<li>Testimonio de <b>no menos de cinco comerciantes</b> inscritos en el registro mercantil, idóneos a juicio del juez y con declaraciones responsivas, completas y exactas.</li></ul></td></tr>
<tr><td><b>Extranjera</b> (art. 8)</td><td>Certificado del <b>cónsul colombiano</b> en ese país o, a falta de él, del cónsul de un país con el que Colombia tenga relaciones. El cónsul pide antes constancia a la cámara de comercio local; si no la hay, obtiene el testimonio de <b>dos o más abogados</b> del lugar, especialistas en derecho mercantil.</td></tr>
<tr><td><b>Internacional</b> (art. 9)</td><td>Copia auténtica de una <b>sentencia o laudo</b> de una entidad jurisdiccional internacional que la haya reconocido o aplicado, o certificado autenticado de una <b>entidad internacional idónea</b>. Si el documento viene del exterior, lo autentica el cónsul (con firma abonada por la Cancillería) y, si no está en castellano, se traduce oficialmente.</td></tr></table></div>
<p class="link">Ejemplo (hipotético): supón que en una ciudad los comerciantes de un sector pagan siempre a 30 días y la cámara de comercio lo tiene recopilado. Si un contrato no dice el plazo y ninguna norma lo fija, el juez puede aplicar esa costumbre (función de colmar lagunas), probada con el certificado de la cámara.</p></section>`,
qs:[{q:"Una práctica comercial lleva décadas en un municipio, pero va en contra de una norma del Código de Comercio. ¿Sirve como fuente del derecho?",a:"No. Es costumbre contra la ley (contra legem), que es inadmisible: uno de los requisitos es que no contraríe la ley mercantil."},
{q:"¿Con cuántos testigos se prueba una costumbre local y qué condición deben cumplir?",a:"Con no menos de cinco comerciantes inscritos en el registro mercantil, idóneos a juicio del juez."},
{q:"¿Qué entidad certifica la costumbre mercantil nacional?",a:"La Confederación de Cámaras de Comercio (art. 96 C. Co.). La local la certifica la cámara de comercio de la jurisdicción."}]},

{id:"comerciante", t:"Derecho comercial: el comerciante", html:String.raw`
<section><h3>Quién es comerciante (arts. 10 a 13 C. Co.)</h3>
<p class="lead">Son sujetos del derecho mercantil todas las personas que realizan actos de comercio, pero solo son <b>comerciantes</b> las que hacen de ellos su <b>profesión</b>: quien, con capacidad legal, se ocupa profesionalmente de alguna de las actividades que la ley considera mercantiles, por sí o por medio de otra persona (art. 10).</p>
<ul><li><b>Origen histórico:</b> en el derecho antiguo era comerciante quien estaba afiliado a un gremio e inscrito en la matrícula (el <i>liber mercatorum</i>). El Código de Napoleón cambió al <b>criterio objetivo</b>: es comerciante quien ejecuta actos de comercio y hace de ellos su profesión habitual. Es el criterio del Código colombiano, aunque conserva la matrícula.</li>
<li>La calidad se adquiere aunque la actividad se ejerza por <b>apoderado, intermediario o interpuesta persona</b>: lo que importa es que los actos afecten el patrimonio de la persona o le reporten provecho económico.</li>
<li>Se puede ser comerciante y a la vez ejercer otra profesión u oficio, y no hace falta que el comercio sea la actividad principal.</li></ul>
<p>Los dos elementos esenciales son la <b>capacidad legal</b> y el <b>ejercicio profesional</b> de actos de comercio. Si falta uno, no hay comerciante.</p></section>

<section><h3>Presunciones de la calidad de comerciante (art. 13)</h3>
<p>Para todos los efectos legales se presume que una persona ejerce el comercio cuando:</p>
<div class="tbl"><table><tr><th>Presunción</th><th>Por qué admite prueba en contrario</th></tr>
<tr><td><b>Está inscrita en el registro mercantil</b></td><td>La matrícula se hace a solicitud del interesado y no confiere la calidad de comerciante: es una consecuencia de ella. Se desvirtúa probando que la persona perdió o nunca adquirió esa calidad.</td></tr>
<tr><td><b>Tiene abierto al público un establecimiento de comercio</b></td><td>Es solo una apariencia ante el público: el establecimiento puede estar arrendado y lo explota otro. Se desvirtúa probando que el dueño ejerce otra actividad profesional.</td></tr>
<tr><td><b>Se anuncia al público como comerciante</b> por cualquier medio (circulares, periódicos, carteles)</td><td>Del anuncio no siempre se sigue el ejercicio profesional de actos de comercio.</td></tr></table></div>
<p>Las presunciones son <b>legales</b>: basta probar el hecho (la matrícula, el local, el anuncio) y le toca a quien lo niega probar lo contrario. Para las sociedades basta que se formen para ejecutar actos o empresas mercantiles (art. 100).</p></section>

<section><h3>Capacidad para ejercer el comercio</h3>
<p>La regla general viene del Código Civil, art. 1503: «toda persona es legalmente capaz, excepto aquellas que la ley declara incapaces». Por eso <b>se prueban las incapacidades</b>, no la capacidad. Conviene no confundir cuatro figuras:</p>
<div class="tbl"><table><tr><th>Figura</th><th>A quién protege</th><th>Qué es</th></tr>
<tr><td><b>Incapacidad</b></td><td>Al propio incapaz</td><td>Medida técnica a favor de las personas que la ley declara incapaces.</td></tr>
<tr><td><b>Inhabilidad</b></td><td>A los terceros y al comercio</td><td>Impide ejercer el comercio a quien sí tiene capacidad (art. 14 C. Co.).</td></tr>
<tr><td><b>Incompatibilidad</b></td><td>Al orden general</td><td>Protege el ejercicio de ciertos cargos o funciones públicas.</td></tr>
<tr><td><b>Interdicción</b></td><td>Un orden legal determinado</td><td>Prohibición expresa de la ley o sanción contra quien viola ciertas reglas de conducta comercial.</td></tr></table></div>
<h4>Incapacidades absolutas y relativas (art. 1504 C. C.)</h4>
<div class="tbl"><table><tr><th></th><th>Absoluta</th><th>Relativa</th></tr>
<tr><td>Quiénes (según el material de clase)</td><td>Los dementes, los impúberes y los sordomudos que no pueden darse a entender por escrito.</td><td>Los menores adultos sin habilitación de edad y los disipadores bajo interdicción.</td></tr>
<tr><td>El representante legal…</td><td><b>Suple</b> la voluntad: todo acto se celebra por ministerio del representante.</td><td><b>Completa</b> la voluntad: el incapaz actúa, pero con autorización del representante.</td></tr>
<tr><td>¿Puede ser comerciante?</td><td>No, aunque por medio de su representante puede intervenir en algunos actos mercantiles (una sociedad, un seguro).</td><td>No profesionalmente sin la autorización de su representante.</td></tr>
<tr><td>Sanción del acto</td><td><b>Nulidad absoluta</b> (art. 1741 C. C.), declarada por sentencia; se sanea por prescripción extraordinaria. En el contrato de sociedad se trata como nulidad relativa (art. 108 C. Co.).</td><td><b>Nulidad relativa</b>: solo la declara el juez a petición de parte y se sanea en <b>cuatro años</b> contados desde que cesa la incapacidad.</td></tr></table></div>
<p class="warn"><b>Hoy:</b> la Ley 1996 de 2019 (art. 57) modificó el art. 1504: ahora solo son absolutamente incapaces los <b>impúberes</b>, y relativamente incapaces los <b>menores púberes</b>. Las personas con discapacidad tienen plena capacidad legal (pueden usar apoyos) y ya no se pueden iniciar procesos de interdicción (art. 53). El material de clase recoge la redacción anterior; en el examen, sigue la que pida la profesora y menciona el cambio.</p>
<h4>Inhabilidades (art. 14 C. Co.)</h4>
<p>No pueden ejercer el comercio, directamente ni por interpuesta persona:</p>
<ol class="steps"><li>Los comerciantes declarados en <b>quiebra</b>, mientras no obtengan su rehabilitación (<b>inhabilidad</b>).</li>
<li>Los funcionarios de entidades oficiales y semioficiales, respecto de actividades mercantiles relacionadas con sus funciones (<b>incompatibilidad</b>).</li>
<li>Las demás personas a quienes la ley o una sentencia judicial les prohíba el comercio (<b>interdicción</b>).</li></ol>
<p><b>Sanción:</b> multas sucesivas de hasta cincuenta mil pesos que impone el juez civil del circuito del domicilio del infractor, de oficio o a petición de cualquier persona, sin perjuicio de otras penas. Los actos <b>no son nulos</b>, para no perjudicar a los terceros que contrataron de buena fe: no se trata de proteger al inhábil sino de impedirle comerciar. Además, los actos de disposición del quebrado sobre sus bienes embargables después de la declaración de quiebra son revocables.</p>
<p class="warn"><b>Hoy:</b> la quiebra y el concordato del Código de Comercio fueron reemplazados por el régimen de insolvencia de la Ley 1116 de 2006 (reorganización y liquidación judicial). El art. 14 conserva su texto, pero se lee con ese régimen.</p></section>

<section><h3>Clasificación de los comerciantes</h3>
<p>La calidad de comerciante siempre se adquiere igual (por el ejercicio profesional), pero los comerciantes se clasifican por la forma como ejercen:</p>
<div class="tbl"><table><tr><th>Criterio</th><th>Clases</th></tr>
<tr><td><b>I. Por la naturaleza de la persona</b></td><td><b>Individuales</b> (personas naturales): pueden comerciar en cualquier ramo.<br><b>Colectivos</b> (personas jurídicas, sociedades comerciales): solo dentro de su objeto social (arts. 99 y 196).</td></tr>
<tr><td><b>II. Por el derecho público o privado que rige su estructura</b></td><td><b>Empresas industriales y comerciales del Estado:</b> creadas o autorizadas por ley, con personería, autonomía administrativa y capital público, pero actúan con normas de derecho privado.<br><b>Sometidos a estatuto excepcional:</b> sociedades de particulares en actividades de interés público, con vigilancia más intensa del Estado: bancos, corporaciones financieras, aseguradoras, almacenes generales de depósito, bolsas de valores, entre otras.<br><b>Ordinarios:</b> personas naturales o jurídicas que se rigen por el Código de Comercio y la autonomía de la voluntad.</td></tr>
<tr><td><b>III. Por la capacidad económica</b></td><td><b>Detallistas</b> (minoristas) y <b>mayoristas</b>. No existe en el Código actual (sí en el italiano de 1942); se propone para dar un trato más liviano a los pequeños comerciantes (registro, contabilidad, impuestos).</td></tr>
<tr><td><b>IV. Por la manera de actuar</b></td><td><b>Principales:</b> comercian a nombre y por cuenta propia.<br><b>Auxiliares:</b> comercian a nombre y por cuenta ajena, o a nombre propio y por cuenta de otro, para facilitar los negocios de otros (agentes comerciales, comisionistas, corredores, representantes de firmas). Tienen las obligaciones de todo comerciante y pueden ser declarados en quiebra.</td></tr>
<tr><td><b>V. Por el objeto de su actividad</b></td><td><b>Comerciantes</b> (circulación de bienes) e <b>industriales</b> (producción y transformación). Venía de la legislación anterior y solo servía para elegir juntas de las cámaras de comercio; el Código actual trata igual todas esas operaciones.</td></tr></table></div>
<p class="warn"><b>No confundir:</b> el <b>comerciante auxiliar</b> (un comisionista independiente) es comerciante. El <b>auxiliar del comerciante</b> (un dependiente o vendedor con contrato de trabajo) actúa siempre a nombre y por cuenta del comerciante, sin autonomía; <b>no es comerciante</b> y no puede ser declarado en quiebra.</p></section>

<section><h3>Prueba, pérdida y suspensión de la calidad de comerciante</h3>
<p><b>Prueba:</b> basta probar el ejercicio profesional (habitual) de actos de comercio, porque la capacidad se presume. O se prueba uno de los hechos del art. 13 (matrícula, establecimiento, anuncio).</p>
<p><b>Se pierde o se suspende</b> cuando falta uno de los dos elementos:</p>
<ul><li><b>Por pérdida de la capacidad:</b> la interdicción judicial (en el material: por demencia, absoluta, o por prodigalidad, relativa); la disolución de una sociedad, que es pérdida definitiva del comerciante colectivo; la declaración de quiebra, que inhabilita para comerciar por cuenta propia o ajena; y el ejercicio de ciertas funciones públicas, que es una inhabilidad temporal mientras dure el cargo.</li>
<li><b>Por retiro del comercio:</b> cancelar la matrícula en la cámara de comercio, cerrar los establecimientos abiertos al público y retirar los anuncios como comerciante.</li></ul></section>

<section><h3>Obligaciones profesionales del comerciante (art. 19)</h3>
<div class="tbl"><table><tr><th>Obligación</th><th>Lo que hay que saber</th></tr>
<tr><td><b>1. Matricularse en el registro mercantil e inscribir los actos, libros y documentos que exija la ley</b></td><td>Rige para los comerciantes profesionales y los auxiliares (comisionistas, corredores, agentes). La matrícula no otorga la calidad de comerciante: es consecuencia de ella y sirve de fuente de información pública. Plazo: persona natural, dentro del mes siguiente al inicio de actividades; persona jurídica, dentro del mes siguiente a la escritura de constitución o al permiso de funcionamiento. Se <b>renueva dentro de los tres primeros meses</b> de cada año. Ver la estación del registro mercantil.</td></tr>
<tr><td><b>2. Llevar contabilidad regular</b> conforme a la ley</td><td>Cumple un triple objeto: le muestra al comerciante el estado de sus negocios y le sirve de prueba; le da medios de defensa a quien negocia con él; y le sirve al Estado de base para los impuestos. Quien no la lleva queda en inferioridad probatoria y, en el régimen de quiebra del Código, no podía acceder al concordato y se exponía a pena de prisión si quebraba.</td></tr>
<tr><td><b>3. Conservar la correspondencia y los documentos</b> del negocio</td><td>Complementa la contabilidad, que debe dar «una historia clara, completa y fidedigna» de los negocios.</td></tr>
<tr><td><b>4. Denunciar ante el juez la cesación de pagos</b> (antes, «el estado de quiebra»)</td><td>Protege a los acreedores para que se presenten a tiempo y los bienes se repartan justamente. En el Código, dentro de los <b>15 días</b> siguientes a la cesación de pagos, con balance general, estado de pérdidas y ganancias firmados por contador público e inventario valorado de bienes y deudas.</td></tr>
<tr><td><b>5. Abstenerse de la competencia desleal</b></td><td>Según Roubier: medios que crean confusión con un competidor, que lo desprestigian en forma exagerada, que desorganizan internamente su empresa o que desorganizan el mercado. Hoy la regula la Ley 256 de 1996.</td></tr></table></div>
<p class="link">Ejemplo: un taller familiar de corte textil que recibe tela y entrega piezas cortadas a cambio de un pago ejerce una actividad de transformación (art. 20 num. 12). Si lo hace de forma habitual, sus dueños son comerciantes: deben matricularse, renovar la matrícula cada año antes del 31 de marzo y llevar contabilidad.</p></section>`,
qs:[{q:"Pedro tiene un local abierto al público, pero lo tiene arrendado a otra persona que lo explota. ¿Es comerciante?",a:"Se presume que sí (art. 13), pero la presunción admite prueba en contrario: si prueba que el local lo explota el arrendatario y él no ejerce el comercio, se desvirtúa."},
{q:"Un comerciante en quiebra no rehabilitado vende mercancía. ¿El contrato es nulo?",a:"No. Es una inhabilidad (art. 14): la sanción son multas sucesivas, y los actos no son nulos para no perjudicar a terceros. Además, los actos de disposición posteriores a la declaración de quiebra son revocables."},
{q:"¿Cuál es la diferencia entre un comerciante auxiliar y un auxiliar del comerciante?",a:"El comerciante auxiliar (comisionista, agente, corredor) es comerciante y actúa con autonomía. El auxiliar del comerciante es un dependiente con relación laboral: actúa a nombre y por cuenta del comerciante, no es comerciante y no puede ser declarado en quiebra."},
{q:"¿En qué se diferencia la incapacidad absoluta de la relativa en cuanto al papel del representante?",a:"En la absoluta el representante suple la voluntad del incapaz (actúa por él) y el acto sin él es nulo absolutamente. En la relativa la completa con su autorización, y la sanción es la nulidad relativa."}]},

{id:"actos", t:"Derecho comercial: los actos de comercio", html:String.raw`
<section><h3>Por qué importan</h3>
<p class="lead">El Código de Comercio sigue un <b>criterio objetivo</b>: la ley comercial se aplica a los actos que ella califica como mercantiles, sin importar quién los realiza. Y quien los ejecuta como profesión es comerciante. El art. 20 enumera los actos, operaciones y empresas mercantiles.</p></section>
<section><h3>Artículo 20: actos, operaciones y empresas mercantiles</h3>
<p>Son mercantiles para todos los efectos legales:</p>
<div class="tbl"><table><tr><th>Num.</th><th>Acto u operación</th></tr>
<tr><td>1</td><td>La adquisición de bienes a título oneroso con destino a enajenarlos en igual forma, y la enajenación de los mismos (comprar para revender).</td></tr>
<tr><td>2</td><td>La adquisición a título oneroso de bienes muebles para arrendarlos; el arrendamiento de los mismos; el arrendamiento de toda clase de bienes para subarrendarlos, y el subarrendamiento.</td></tr>
<tr><td>3</td><td>El recibo de dinero en mutuo a interés, con garantía o sin ella, para darlo en préstamo, y los préstamos subsiguientes, así como dar habitualmente dinero en mutuo a interés.</td></tr>
<tr><td>4</td><td>La adquisición o enajenación, a título oneroso, de establecimientos de comercio, y la prenda, arrendamiento, administración y demás operaciones análogas sobre ellos.</td></tr>
<tr><td>5</td><td>La intervención como asociado en la constitución de sociedades comerciales, los actos de administración de las mismas o la negociación a título oneroso de partes de interés, cuotas o acciones.</td></tr>
<tr><td>6</td><td>El giro, otorgamiento, aceptación, garantía o negociación de títulos valores, así como la compra para reventa, permuta, etc., de los mismos.</td></tr>
<tr><td>7</td><td>Las operaciones bancarias, de bolsas o de martillos (subastas).</td></tr>
<tr><td>8</td><td>El corretaje, las agencias de negocios y la representación de firmas nacionales o extranjeras.</td></tr>
<tr><td>9</td><td>La explotación o prestación de servicios de puertos, muelles, puentes, vías y campos de aterrizaje.</td></tr>
<tr><td>10</td><td>Las empresas de seguros y la actividad aseguradora.</td></tr>
<tr><td>11</td><td>Las empresas de transporte de personas o de cosas, a título oneroso, cualquiera que sea la vía y el medio.</td></tr>
<tr><td>12</td><td>Las empresas de fabricación, transformación, manufactura y circulación de bienes.</td></tr>
<tr><td>13</td><td>Las empresas de depósito de mercaderías, provisiones o suministros, espectáculos públicos y expendio de toda clase de bienes.</td></tr>
<tr><td>14</td><td>Las empresas editoriales, litográficas, fotográficas, informativas o de propaganda y las demás destinadas a la prestación de servicios.</td></tr>
<tr><td>15</td><td>Las empresas de obras o construcciones, reparaciones, montajes, instalaciones u ornamentaciones.</td></tr>
<tr><td>16</td><td>Las empresas para el aprovechamiento y explotación mercantil de las fuerzas o recursos de la naturaleza.</td></tr>
<tr><td>17</td><td>Las empresas promotoras de negocios y las de compra, venta, administración, custodia o circulación de toda clase de bienes.</td></tr>
<tr><td>18</td><td>Las empresas de construcción, reparación, compra y venta de vehículos para el transporte por tierra, agua y aire, y sus accesorios.</td></tr>
<tr><td>19</td><td>Los demás actos y contratos regulados por la ley mercantil.</td></tr></table></div>
<p><b>Cómo leer la lista:</b> los numerales 1 a 8 son <b>actos</b> (basta realizarlos, aun una sola vez); del 9 al 18 se habla de <b>empresas</b>, es decir, de actividades organizadas y habituales (art. 25: toda actividad económica organizada para producir, transformar, circular, administrar o custodiar bienes o prestar servicios). La lista es enunciativa: el numeral 19 la abre a los demás actos que regule la ley mercantil.</p></section>
<section><h3>Actos no mercantiles y actos mixtos</h3>
<ul><li><b>No mercantiles (art. 23):</b> comprar bienes para el consumo doméstico o el uso propio, y venderlos después o vender el sobrante; que el agricultor o ganadero venda lo que produce sin transformarlo; los servicios de las profesiones liberales; la producción y venta de obras artísticas por su autor; las actividades de los empleados o funcionarios.</li>
<li><b>Actos mixtos (art. 22):</b> si un acto es mercantil para una de las partes, se rige por la ley comercial para ambas.</li></ul>
<p class="link">Ejemplo: un taller de confecciones que compra tela, la corta y vende las prendas realiza actos de comercio (numerales 1 y 12) y debe matricularse; el agricultor que vende su cosecha sin transformarla no. Si el taller le compra la cosecha de algodón al agricultor, el contrato es mixto y se rige por el Código de Comercio para los dos.</p></section>`,
qs:[{q:"Una persona compra un carro para su uso personal y años después lo vende. ¿Es acto de comercio?",a:"No. Comprar para consumo propio y vender después no es mercantil (art. 23). Sería mercantil si lo comprara con destino a revenderlo (art. 20 num. 1)."},
{q:"¿Es mercantil prestar dinero a interés una sola vez a un amigo?",a:"Por regla general no: el numeral 3 exige recibir dinero a interés para prestarlo, o dar habitualmente dinero en mutuo a interés."},
{q:"¿Es comerciante un médico que atiende en su consultorio?",a:"No: los servicios de las profesiones liberales no son actos de comercio (art. 23). Sí lo sería si organiza una clínica como empresa."}]},

{id:"registro", t:"Derecho comercial: el registro mercantil", html:String.raw`
<section><h3>Qué es</h3>
<p class="lead">Es la anotación que hace una entidad especializada (en Colombia, la <b>cámara de comercio</b>) de los hechos, actos o circunstancias que pueden interesar a terceros, quienes tienen libre acceso a sus archivos y pueden pedir la información. Deben registrarse las personas naturales, sociedades comerciales y civiles, empresas unipersonales, establecimientos de comercio, sucursales y agencias, sucursales de sociedades extranjeras y empresas asociativas de trabajo que ejerzan actividades comerciales (arts. 26 y siguientes C. Co.).</p></section>
<section><h3>Sus funciones</h3>
<div class="tbl"><table><tr><th>Función</th><th>En qué consiste</th></tr>
<tr><td><b>Publicidad</b> (art. 26, inc. 2)</td><td>Es la forma oficial de dar a conocer las personas, los establecimientos y los documentos registrados, para que cualquiera se entere y negocie con más conocimiento y garantías.</td></tr>
<tr><td><b>Protección del nombre comercial</b></td><td>La cámara no puede matricular a un comerciante o establecimiento con el mismo nombre de otro ya inscrito, mientras ese registro no se cancele. Entre personas naturales homónimas se permite si se agrega un distintivo. Así se ampara ese bien incorporal y se evita la competencia desleal por confusión.</td></tr>
<tr><td><b>Probatoria</b></td><td>Las cámaras expiden certificados de lo inscrito. Si un documento registrado se pierde o se destruye, se suple con un certificado de la cámara que inserte el texto conservado.</td></tr></table></div></section>
<section><h3>Las dos ramas: matrícula e inscripción</h3>
<h4>La matrícula</h4>
<p>Se refiere a una <b>persona</b> (el comerciante individual o colectivo) o a un <b>bien</b> (el establecimiento de comercio).</p>
<div class="tbl"><table><tr><th>Por qué es importante</th><th>Qué beneficios trae</th></tr>
<tr><td><ul style="margin:0;padding-left:18px"><li>Facilita la prueba de la propiedad sobre el establecimiento.</li><li>Impide matricular otro establecimiento con el mismo nombre.</li><li>Evita multas.</li><li>Es fuente de información comercial.</li><li>Facilita la celebración de negocios.</li><li>Ingresa al comerciante a la base de datos de la cámara.</li></ul></td>
<td><ul style="margin:0;padding-left:18px"><li>Hace pública la calidad de comerciante.</li><li>Lo hace visible para clientes que consultan el registro.</li><li>Facilita participar en licitaciones e inscribirse en el Registro Único de Proponentes (RUP).</li><li>Facilita obtener créditos.</li><li>Permite afiliarse a la cámara (en Antioquia, la Cámara de Comercio de Medellín para Antioquia) y participar en sus foros, seminarios y cursos.</li></ul></td></tr></table></div>
<ul><li><b>Dónde:</b> en cualquier sede de la cámara de comercio con jurisdicción en el lugar donde está el comerciante.</li>
<li><b>Plazo para matricularse:</b> un mes. Persona natural, sociedad de hecho o irregular o comunidad activa: desde el día en que empezó a ejercer el comercio. Sociedad: desde la fecha de la escritura de constitución.</li>
<li><b>Renovación:</b> dentro de los <b>tres primeros meses</b> de cada año (hasta el 31 de marzo).</li>
<li><b>Cancelación:</b> la persona natural que deja de ejercer el comercio la cancela con solicitud escrita, con firma autenticada ante notario o presentada personalmente, en el formato de la cámara.</li></ul>
<h4>La inscripción</h4>
<p>Es una forma de registro distinta de la matrícula y también cumple una función de publicidad legal. Se refiere a <b>actos y documentos</b>. Beneficios: hace público el acto y lo vuelve <b>oponible a terceros</b>, y lo hace visible para quienes consultan el registro.</p>
<p><b>Qué se inscribe:</b></p>
<ul><li>Escrituras de constitución y reformas de sociedades comerciales y civiles, y su liquidación.</li>
<li>Constitución, reformas y liquidación de empresas asociativas de trabajo y de empresas unipersonales.</li>
<li>Concordatos, liquidación obligatoria y acuerdos de reestructuración (hoy, los procesos de insolvencia).</li>
<li>Nombramientos de juntas directivas, revisores fiscales y representantes legales.</li>
<li>Poderes para administrar establecimientos de comercio o bienes del comerciante.</li>
<li>Embargos y demandas civiles sobre cuotas, partes de interés o establecimientos de comercio.</li>
<li>Contratos de prenda sin tenencia, de compraventa comercial (de establecimientos) y de agencia comercial.</li>
<li>Arrendamiento, usufructo, anticresis y cualquier operación sobre establecimientos de comercio.</li>
<li>Los demás actos y documentos cuya inscripción ordene la ley.</li></ul>
<ul><li><b>Dónde:</b> en la cámara de comercio del lugar donde se celebra el acto o contrato. Las sociedades, en la cámara de su domicilio principal.</li>
<li><b>Cómo:</b> presentando el documento en cualquier sede, pagando los derechos de ley y el impuesto de registro.</li></ul></section>
<section><h3>Diferencias entre matrícula e inscripción</h3>
<div class="tbl"><table><tr><th></th><th>Matrícula</th><th>Inscripción</th></tr>
<tr><td>Recae sobre</td><td>Personas (comerciantes) y establecimientos de comercio</td><td>Actos, contratos y documentos</td></tr>
<tr><td>Si no se hace</td><td>No se pierde la calidad de comerciante ni se afecta la propiedad sobre el establecimiento (pero hay multas)</td><td>El acto es <b>inoponible a terceros</b></td></tr>
<tr><td>Plazo</td><td>Un mes desde que se empieza a ejercer el comercio o desde la escritura de constitución</td><td>No hay plazo fijo, pero mientras no se inscriba el acto no se puede oponer a terceros</td></tr>
<tr><td>Renovación</td><td>Anual, en los tres primeros meses del año</td><td>No se renueva</td></tr></table></div></section>
<section><h3>Entidades que llevan registros</h3>
<ul><li><b>Cámara de comercio</b> del domicilio principal del comerciante: el registro mercantil. Son instituciones de orden legal creadas por el Gobierno Nacional.</li>
<li><b>Superintendencia Bancaria</b> y <b>Superintendencia de Valores</b> (según el material): el registro y los certificados de existencia y representación legal de las entidades que vigilan. <i>Hoy ambas forman la <b>Superintendencia Financiera de Colombia</b>, creada en 2005.</i></li>
<li><b>Superintendencia de Industria y Comercio</b>: el registro de la propiedad industrial (marcas, patentes) y el de calidad e idoneidad de bienes y servicios.</li></ul>
<p class="link">Ejemplo: si los dueños de un taller lo venden a un tercero y no inscriben la venta en la cámara de comercio, para los acreedores del taller el vendedor sigue siendo el dueño: la venta les es inoponible. En cambio, si el taller nunca se matriculó, sus dueños siguen siendo comerciantes y siguen siendo propietarios, aunque se exponen a multas.</p></section>`,
qs:[{q:"¿Qué pasa si una sociedad cambia su representante legal y no inscribe el nombramiento?",a:"El nombramiento es inoponible a terceros: frente a ellos sigue figurando el representante anterior."},
{q:"¿Hasta cuándo se renueva la matrícula mercantil?",a:"Dentro de los tres primeros meses de cada año, es decir, hasta el 31 de marzo."},
{q:"¿Por qué una cámara de comercio puede negar la matrícula de un establecimiento llamado igual que otro ya inscrito?",a:"Por la función de protección del nombre comercial: no puede matricular un nombre igual a otro inscrito mientras ese registro no se cancele, para evitar confusión y competencia desleal."},
{q:"¿Pierde la calidad de comerciante quien no se matricula?",a:"No. La matrícula es consecuencia de la calidad de comerciante, no su causa; su falta genera multas, pero no hace perder esa calidad ni afecta la propiedad sobre el establecimiento."}]},
{id:"bienes", t:"Establecimientos de comercio, títulos valores, marcas y patentes", html:String.raw`
<section><h3>Establecimiento de comercio (arts. 515 a 532)</h3>
<p class="lead">Es el conjunto de bienes organizados por el empresario para realizar los fines de la empresa. Comprende el nombre comercial, las marcas, los derechos sobre el local, los muebles, las mercancías, los créditos y contratos, entre otros (art. 516). Es un bien mueble que se puede vender, arrendar o dar en prenda como una unidad, y su enajenación debe inscribirse en el registro mercantil.</p></section>
<section><h3>Títulos valores (arts. 619 y siguientes)</h3>
<p>Son documentos necesarios para legitimar el ejercicio del derecho literal y autónomo que en ellos se incorpora. Principios: <b>incorporación</b> (el derecho va unido al papel), <b>literalidad</b> (vale lo que dice), <b>legitimación</b> (lo ejerce el tenedor legítimo) y <b>autonomía</b> (cada tenedor tiene un derecho propio, independiente de los anteriores).</p>
<div class="tbl"><table><tr><th>Clase</th><th>Ejemplos</th></tr><tr><td>De contenido crediticio</td><td>Letra de cambio, pagaré, cheque, factura electrónica de venta</td></tr><tr><td>Corporativos o de participación</td><td>Acciones, bonos</td></tr><tr><td>De tradición o representativos de mercancías</td><td>Certificado de depósito, bono de prenda, conocimiento de embarque</td></tr></table></div>
<p>Requisitos comunes (art. 621): la mención del derecho incorporado y la firma de quien lo crea. Se transmiten por endoso (los títulos a la orden) o por entrega (al portador).</p></section>
<section><h3>Propiedad industrial (Decisión 486 de 2000 de la CAN)</h3>
<ul><li><b>Patente de invención:</b> invenciones nuevas, con nivel inventivo y aplicación industrial; protección por 20 años.</li><li><b>Modelo de utilidad:</b> nueva forma de un objeto que mejora su funcionamiento; 10 años.</li><li><b>Marca:</b> signo que distingue productos o servicios; 10 años renovables indefinidamente.</li></ul>
<p>En Colombia los registra la Superintendencia de Industria y Comercio (SIC).</p></section>`,
qs:[{q:"¿Qué principio impide que el deudor de un pagaré le oponga a un tercero de buena fe las excepciones que tenía contra el primer acreedor?",a:"La autonomía: cada tenedor adquiere un derecho propio."}]},
{id:"sociedades", t:"Las sociedades comerciales", sim:"soc", html:String.raw`
<section><h3>El contrato de sociedad (art. 98)</h3>
<p class="lead">Dos o más personas se obligan a hacer un aporte en dinero, trabajo u otros bienes, con el fin de repartirse las utilidades. Una vez constituida, la sociedad es una <b>persona jurídica distinta</b> de los socios. La SAS (Ley 1258 de 2008) y la empresa unipersonal (Ley 222 de 1995) permiten un solo socio.</p></section>
<section><h3>Tipos</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Socios</th><th>Responsabilidad</th><th>Capital</th></tr>
<tr><td>Colectiva</td><td>2 o más</td><td>Solidaria e ilimitada</td><td>Partes de interés</td></tr>
<tr><td>Comandita simple</td><td>Gestores y comanditarios</td><td>Gestores: ilimitada; comanditarios: hasta sus aportes</td><td>Partes de interés</td></tr>
<tr><td>Comandita por acciones</td><td>Gestores y al menos 5 comanditarios</td><td>Igual que la anterior</td><td>Acciones</td></tr>
<tr><td>Limitada</td><td>2 a 25</td><td>Hasta sus aportes (salvo deudas fiscales y laborales en ciertos casos)</td><td>Cuotas, pagadas al constituir</td></tr>
<tr><td>Anónima</td><td>5 o más; ninguno con el 95 %</td><td>Hasta sus aportes</td><td>Acciones; autorizado, suscrito y pagado</td></tr>
<tr><td>Por acciones simplificada (SAS)</td><td>1 o más</td><td>Hasta sus aportes</td><td>Acciones; mucha libertad estatutaria</td></tr></table></div>
<p>La SAS se crea por documento privado inscrito en la cámara de comercio, puede tener objeto indeterminado y es hoy la forma más usada en Colombia para empresas nuevas. Cuando los socios usan la sociedad para defraudar, el juez puede «levantar el velo corporativo» y hacerlos responder personalmente.</p></section>
${LAB_}`,
qs:[{q:"Dos hermanos quieren formalizar el taller familiar sin arriesgar su patrimonio personal y con reglas flexibles. ¿Qué tipo les conviene?",a:"Una SAS: admite uno o más accionistas, responsabilidad hasta el monto de los aportes y se constituye por documento privado."}]}]);
const P={fundamentos:"Laboral · Unidades 1 y 2 · Nociones generales y contrato de trabajo",partes:"Laboral · Unidades 3 y 4 · Empleador y trabajador",salario:"Laboral · Unidad 5 · Salario",
  prima:"Laboral · Unidad 6 · Prestaciones sociales",sanciones:"Laboral · Unidad 7 · Indemnizaciones y sanciones",costumbre:"Derecho comercial"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
// la jornada y la nómina se estudian con el salario
["jornada","nomina"].forEach(id=>{const t=TRUNK.find(x=>x.id===id);if(t)t.parte=id==="jornada"?"Laboral · Unidades 1 y 2 · Nociones generales y contrato de trabajo":"Laboral · Unidad 5 · Salario"});
// orden: nómina después de salario
const iN=TRUNK.findIndex(t=>t.id==="nomina"),nom=TRUNK.splice(iN,1)[0];ins("salario",[nom]);
})();
