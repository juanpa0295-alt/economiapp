
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
{id:"comerciante", t:"Derecho comercial: el comerciante y los actos de comercio", html:String.raw`
<section><h3>El comerciante (Código de Comercio, arts. 10 a 19)</h3>
<p class="lead">Es comerciante quien <b>profesionalmente</b> se ocupa de alguna de las actividades que la ley considera mercantiles, por sí o por interpuesta persona. Se presume comerciante quien está inscrito en el registro mercantil, tiene un establecimiento de comercio abierto o anuncia al público su calidad de comerciante (art. 13).</p>
<p><b>Deberes (art. 19):</b> matricularse en el registro mercantil de la cámara de comercio; inscribir los actos, libros y documentos que exige la ley; llevar contabilidad regular; conservar la correspondencia y documentos del negocio; denunciar ante el juez la cesación de pagos; abstenerse de la competencia desleal.</p></section>
<section><h3>Actos mercantiles y no mercantiles</h3>
<ul><li><b>Mercantiles (art. 20):</b> la compra de bienes para revenderlos, el giro y negociación de títulos valores, las operaciones bancarias y de bolsa, las empresas de fabricación, transporte, seguros, construcción, depósito, espectáculos, entre otras.</li>
<li><b>No mercantiles (art. 23):</b> comprar para consumo propio; que el agricultor o ganadero venda lo que produce sin transformarlo; los servicios de las profesiones liberales; la producción de obras artísticas; las actividades de los empleados.</li>
<li><b>Actos mixtos (art. 22):</b> si un acto es mercantil para una de las partes, se rige por la ley comercial para ambas.</li></ul>
<p class="link">Ejemplo: un taller de confecciones que compra tela, la corta y vende las prendas realiza actos de comercio (fabricación y venta) y debe matricularse; el agricultor que vende su cosecha sin transformarla no.</p></section>`,
qs:[{q:"¿Es comerciante un médico que atiende en su consultorio?",a:"No: los servicios de las profesiones liberales no son actos de comercio (art. 23). Sí lo sería si organiza una clínica como empresa."}]},
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
  prima:"Laboral · Unidad 6 · Prestaciones sociales",sanciones:"Laboral · Unidad 7 · Indemnizaciones y sanciones",comerciante:"Derecho comercial"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
// la jornada y la nómina se estudian con el salario
["jornada","nomina"].forEach(id=>{const t=TRUNK.find(x=>x.id===id);if(t)t.parte=id==="jornada"?"Laboral · Unidades 1 y 2 · Nociones generales y contrato de trabajo":"Laboral · Unidad 5 · Salario"});
// orden: nómina después de salario
const iN=TRUNK.findIndex(t=>t.id==="nomina"),nom=TRUNK.splice(iN,1)[0];ins("salario",[nom]);
})();
