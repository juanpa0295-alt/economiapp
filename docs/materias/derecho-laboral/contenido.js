// Derecho Laboral y Comercial · contenido de la ruta
// =====================================================================
// CONTENIDO: Derecho Laboral y Comercial. Temas del curso: prórrogas, indemnizaciones, nómina/horas extras y prima de servicios (CST).
// Normas verificadas a octubre de 2026: CST con la Ley 2466 de 2025, Ley 2101 de 2021, Decretos 1469 y 1470 de 2025.
// =====================================================================
const LAB_=`<section><h3>Calculadora</h3><div class="sim" id="sim"></div></section>`;
const AVISO=`<p class="hint">Herramienta de estudio, no asesoría legal. Las normas y los valores cambian: los de esta página están vigentes a octubre de 2026.</p>`;
const TRUNK=[
{id:"fundamentos", t:"Fundamentos: Constitución y contrato de trabajo", html:String.raw`
<section><h3>La idea</h3><p class="lead">El derecho laboral parte de que el trabajador es la parte débil de la relación. Por eso la Constitución fija unos mínimos que ningún contrato puede desmejorar, y el Código Sustantivo del Trabajo (CST) los desarrolla.</p></section>
<section><h3>Bases constitucionales</h3><div class="tbl"><table><tr><th>Norma</th><th>Qué dice</th></tr>
<tr><td>Art. 25 C.P.</td><td>El trabajo es un derecho y una obligación social, y goza de especial protección del Estado.</td></tr>
<tr><td>Art. 53 C.P.</td><td>Principios mínimos: igualdad de oportunidades, remuneración mínima vital y móvil, estabilidad en el empleo, <b>irrenunciabilidad</b> de los beneficios mínimos, <b>favorabilidad</b> (en caso de duda se aplica la norma más favorable al trabajador) y <b>primacía de la realidad</b> sobre las formalidades.</td></tr>
<tr><td>Art. 13 CST</td><td>Lo que dice el Código es el mínimo de derechos; cualquier pacto que lo desmejore no produce efecto.</td></tr></table></div></section>
<section><h3>El contrato de trabajo</h3>
<p>Según el art. 23 del CST hay contrato de trabajo cuando concurren tres elementos, sin importar el nombre que le den las partes:</p>
<ol class="steps"><li><b>Actividad personal</b> del trabajador.</li><li><b>Subordinación</b>: el empleador puede dar órdenes sobre modo, tiempo y cantidad de trabajo.</li><li><b>Salario</b> como retribución del servicio.</li></ol>
<p>Si se dan los tres, el contrato es laboral aunque se haya firmado como «prestación de servicios»: es la primacía de la realidad.</p></section>
<section><h3>Clases de contrato por duración</h3><div class="tbl"><table><tr><th>Tipo</th><th>Artículo</th><th>Regla</th></tr>
<tr><td>Término indefinido</td><td>Art. 47</td><td>Es la regla general desde la Ley 2466 de 2025.</td></tr>
<tr><td>Término fijo</td><td>Art. 46</td><td>Por escrito y por máximo 4 años, incluidas las prórrogas.</td></tr>
<tr><td>Obra o labor</td><td>Art. 45</td><td>Dura lo que dure la obra; si el trabajador sigue después, pasa a indefinido.</td></tr>
<tr><td>Ocasional</td><td>Art. 6</td><td>Labores de corta duración, no mayores a un mes, distintas a las actividades normales del empleador.</td></tr></table></div></section>${AVISO}`,
qs:[{q:"Una empresa firma un «contrato de prestación de servicios» con alguien que cumple horario, recibe órdenes diarias y cobra cada mes. ¿Qué contrato hay?",a:"Un contrato de trabajo, por primacía de la realidad (art. 53 C.P. y art. 23 CST): están la actividad personal, la subordinación y el salario."},
 {q:"¿Puede un trabajador renunciar por escrito a sus vacaciones a cambio de un bono?",a:"No a las vacaciones mínimas: son un beneficio irrenunciable (art. 53 C.P., art. 14 CST). Solo se permite compensar en dinero hasta la mitad, en los casos que autoriza la ley."}]},

{id:"prorrogas", t:"Prórrogas del contrato a término fijo", sim:"pro", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un contrato a término fijo se renueva solo si ninguna de las partes avisa, con 30 días de anticipación, que no quiere continuar. La Ley 2466 de 2025 añadió un tope: el contrato a término fijo no puede pasar de 4 años sumando el período inicial y las prórrogas.</p></section>
<section><h3>Reglas del art. 46 del CST (texto vigente)</h3><ol class="steps">
<li><b>Forma y duración:</b> por escrito y por un término no mayor a 4 años. Si no cumple esto, se entiende a término indefinido desde el inicio.</li>
<li><b>Preaviso:</b> si ninguna parte avisa por escrito su intención de terminarlo con al menos <b>30 días</b> antes del vencimiento, se prorroga por un período igual al pactado.</li>
<li><b>Contratos de menos de un año:</b> las tres primeras prórrogas automáticas son por el mismo término; <b>la cuarta prórroga automática es por un año</b>, y así en adelante.</li>
<li><b>Tope de 4 años:</b> incluye el período inicial y todas las prórrogas. Si el contrato lo supera, se convierte en contrato a término indefinido.</li>
<li><b>Prórrogas pactadas:</b> las partes pueden acordar por escrito prórrogas por otros plazos, pero después de la cuarta no puede renovarse por menos de un año.</li></ol></section>
<section><h3>Ejemplo</h3>
<p>Contrato de 3 meses desde el 1 de enero de 2026, sin preaviso:</p>
<div class="tbl"><table><tr><th>Período</th><th>Desde</th><th>Hasta</th><th>Duración</th><th>Último día para avisar</th></tr>
<tr><td>Inicial</td><td>1 ene 2026</td><td>31 mar 2026</td><td>3 meses</td><td>1 mar 2026</td></tr>
<tr><td>1.ª prórroga</td><td>1 abr 2026</td><td>30 jun 2026</td><td>3 meses</td><td>31 may 2026</td></tr>
<tr><td>2.ª prórroga</td><td>1 jul 2026</td><td>30 sep 2026</td><td>3 meses</td><td>31 ago 2026</td></tr>
<tr><td>3.ª prórroga</td><td>1 oct 2026</td><td>31 dic 2026</td><td>3 meses</td><td>1 dic 2026</td></tr>
<tr><td><b>4.ª prórroga</b></td><td>1 ene 2027</td><td>31 dic 2027</td><td><b>1 año</b></td><td>1 dic 2027</td></tr></table></div>
<p>El tope de 4 años se cumple el 31 de diciembre de 2029; si sigue trabajando desde el 1 de enero de 2030, el contrato es indefinido.</p></section>
${LAB_}
<p class="warn"><b>Error común:</b> creer que el preaviso de 30 días obliga a indemnizar. Avisar a tiempo que no se renueva es una forma legal de terminar el contrato por vencimiento del plazo, sin indemnización. Lo que genera indemnización es terminarlo antes del vencimiento sin justa causa.</p>${AVISO}`,
deep:[{k:"Transición",t:"Contratos firmados antes de la reforma",html:String.raw`<p>Para los contratos a término fijo que ya existían el <b>25 de junio de 2025</b>, el tope de 4 años se cuenta desde esa fecha, no desde el inicio del contrato (art. 46, Ley 2466). Así lo entendió también el Ministerio del Trabajo en el Concepto 6157 de 2026: la conversión a indefinido no es retroactiva, y los primeros contratos llegarán al tope el 25 de junio de 2029.</p><p>El concepto agrega que, cuando el contrato pasa a indefinido, no hay que liquidarlo en ese momento: la liquidación se hace al terminar la relación laboral.</p>`},
 {k:"Interpretación",t:"¿Desde qué día es indefinido?",html:String.raw`<p>La ley dice que ninguna prórroga puede superar los 4 años y que, si el contrato los supera, se convierte en indefinido. La calculadora toma como fecha de conversión el día siguiente a cumplir los 4 años. Si tu profesor usa otra interpretación (por ejemplo, desde el inicio de la prórroga que ya no cabía completa en los 4 años), sigue la de clase.</p>`}],
qs:[{q:"Un contrato de 6 meses empezó el 1 de febrero de 2026. ¿Hasta cuándo puede el empleador avisar que no lo renovará?",a:"Vence el 31 de julio de 2026, así que el aviso debe darse a más tardar el 1 de julio de 2026 (30 días antes)."},
 {q:"Un contrato de 2 meses ya tuvo 3 prórrogas automáticas. ¿Por cuánto se renueva la siguiente?",a:"Por un año: la cuarta prórroga automática de un contrato menor a un año es de un año (art. 46 CST)."},
 {q:"Un contrato a término fijo de un año se firmó en marzo de 2023 y se ha renovado cada año. ¿Cuándo pasa a indefinido?",a:"El tope se cuenta desde el 25 de junio de 2025 por ser anterior a la reforma: pasa a indefinido si sigue después del 24 de junio de 2029. Puedes comprobarlo en la calculadora."}]},

{id:"indemnizaciones", t:"Terminación del contrato e indemnizaciones", sim:"ind", html:String.raw`
<section><h3>La idea</h3><p class="lead">El empleador puede terminar el contrato con justa causa (art. 62) sin pagar indemnización. Si lo termina sin justa causa, debe indemnizar al trabajador según el art. 64, y el monto depende del tipo de contrato.</p></section>
<section><h3>Indemnización por despido sin justa causa (art. 64 CST)</h3><div class="tbl"><table><tr><th>Contrato</th><th>Indemnización</th></tr>
<tr><td>Término fijo</td><td>Los salarios del tiempo que falte para cumplir el plazo pactado (o de la prórroga en curso).</td></tr>
<tr><td>Obra o labor</td><td>Los salarios del tiempo que falte para terminar la obra, <b>mínimo 15 días</b>.</td></tr>
<tr><td>Indefinido, salario menor a 10 SMMLV</td><td><b>30 días</b> por el primer año y <b>20 días</b> por cada año siguiente, proporcional por fracción.</td></tr>
<tr><td>Indefinido, salario de 10 SMMLV o más</td><td><b>20 días</b> por el primer año y <b>15 días</b> por cada año siguiente, proporcional por fracción.</td></tr></table></div>
<p>La Ley 2466 de 2025 no modificó este artículo.</p></section>
<section><h3>Cómo se calcula a mano (indefinido)</h3><ol class="steps">
<li>Cuenta los días de servicio con año de 360 días (cada mes vale 30): \(\text{días}=\text{días360}(\text{inicio},\text{despido})+1\).</li>
<li>Separa los años completos y los días que sobran (la fracción): 490 días son 1 año y 130 días.</li>
<li>Si trabajó un año o menos, le corresponden 30 días completos (20 si gana 10 SMMLV o más).</li>
<li>Si trabajó más: 30 días por el primer año, 20 por cada año completo siguiente y, por la fracción, \(20\times\text{días que sobran}/360\). <b>Los días no llevan decimales</b>: ese resultado se redondea al entero.</li>
<li>Multiplica por el salario diario: \(\text{salario}/30\).</li></ol>
<p><b>Ejemplo:</b> salario de $3.000.000, del 1 de enero de 2025 al 10 de mayo de 2026: 490 días = 1 año y 130 días. Fracción: \(20\times130/360=7{,}22\), que se redondea a 7 días. Indemnización: \((30+7)=37\) días \(\times\$100.000=\$3.700.000\).</p></section>
<section><h3>Cuándo aplica</h3><ul><li>Despido sin justa causa.</li><li>Renuncia del trabajador por una justa causa imputable al empleador (art. 62, literal B), el llamado despido indirecto.</li></ul>
<p>No aplica cuando el contrato a término fijo termina por vencimiento del plazo con preaviso, ni cuando el trabajador renuncia voluntariamente.</p></section>
${LAB_}${AVISO}`,
deep:[{k:"Base",t:"Qué salario se usa",html:String.raw`<p>Se usa el último salario. Si el salario es variable, se toma el promedio de lo devengado en el último año de servicio, o en todo el tiempo si trabajó menos de un año. El auxilio de transporte no forma parte del salario para esta indemnización.</p>`}],
qs:[{q:"Despiden sin justa causa a una persona con contrato a término fijo que vencía en 4 meses y gana $2.400.000. ¿Cuánto le deben?",a:"Los salarios de los 4 meses que faltan: 4 × $2.400.000 = $9.600.000."},
 {q:"Un trabajador con contrato indefinido gana 12 SMMLV y trabajó exactamente 3 años. ¿Cuántos días de indemnización le corresponden?",a:"20 por el primer año y 15 por cada uno de los otros dos: 20 + 30 = 50 días de salario."}]},

{id:"jornada", t:"Jornada, recargos y horas extras", sim:"horas", html:String.raw`
<section><h3>La idea</h3><p class="lead">El salario mensual paga la jornada ordinaria diurna. Todo lo que se trabaje de noche, en domingo o festivo, o por encima de la jornada, se paga con un recargo sobre el valor de la hora ordinaria.</p></section>
<section><h3>Jornada máxima y valor de la hora</h3>
<p>La Ley 2101 de 2021 redujo la jornada gradualmente: 44 horas semanales desde el 15 de julio de 2025 y <b>42 horas desde el 15 de julio de 2026</b>.</p>
<div class="mj">\[\text{horas al mes}=\frac{\text{jornada semanal}}{6}\times30\qquad\qquad\text{hora ordinaria}=\frac{\text{salario mensual}}{\text{horas al mes}}\]</div>
<p>Con 42 horas: 210 horas al mes. Con el salario mínimo de 2026: \(1.750.905/210=\$8.338\) por hora.</p></section>
<section><h3>Diurno y nocturno (art. 160)</h3><p>Desde el 25 de diciembre de 2025, el trabajo <b>nocturno va de 7:00 p. m. a 6:00 a. m.</b> (antes empezaba a las 9:00 p. m.). El diurno va de 6:00 a. m. a 7:00 p. m.</p></section>
<section><h3>Recargos vigentes</h3><div class="tbl"><table><tr><th>Concepto</th><th>Recargo</th><th>Factor sobre la hora ordinaria</th></tr>
<tr><td>Recargo nocturno (hora ordinaria de noche)</td><td>35 %</td><td class="num">0,35 (solo el recargo)</td></tr>
<tr><td>Hora extra diurna</td><td>25 %</td><td class="num">1,25</td></tr>
<tr><td>Hora extra nocturna</td><td>75 %</td><td class="num">1,75</td></tr>
<tr><td>Hora dominical o festiva diurna</td><td>90 %</td><td class="num">1,90</td></tr>
<tr><td>Hora dominical o festiva nocturna</td><td>90 % + 35 %</td><td class="num">2,25</td></tr>
<tr><td>Extra diurna dominical o festiva</td><td>90 % + 25 %</td><td class="num">2,15</td></tr>
<tr><td>Extra nocturna dominical o festiva</td><td>90 % + 75 %</td><td class="num">2,65</td></tr></table></div>
<p>El recargo dominical y festivo (art. 179, Ley 2466) sube por etapas: <b>80 %</b> desde el 1 de julio de 2025, <b>90 %</b> desde el 1 de julio de 2026 y <b>100 %</b> desde el 1 de julio de 2027. Los recargos se suman.</p></section>
<section><h3>Límites de las horas extra</h3><p>Máximo <b>2 horas extra al día y 12 a la semana</b>. Desde la Ley 2466 ya no se necesita autorización del Ministerio del Trabajo, pero el empleador debe llevar un registro de las horas.</p></section>
${LAB_}
<p class="warn"><b>Error común:</b> pagar la hora nocturna ordinaria a 1,35. Esa hora ya está pagada en el salario mensual; lo que se agrega es solo el recargo del 35 %. En cambio, la hora extra sí se paga completa con su recargo (1,25 o 1,75).</p>${AVISO}`,
deep:[{k:"Domingos",t:"Trabajo dominical habitual u ocasional",html:String.raw`<p>El trabajo dominical es <b>habitual</b> cuando se trabajan tres o más domingos en el mes calendario, y <b>ocasional</b> cuando son dos o menos. En el habitual, el trabajador tiene derecho además a un día de descanso compensatorio remunerado; en el ocasional puede elegir entre el descanso compensatorio o el pago del recargo.</p>`},
 {k:"Convención",t:"Por qué la hora dominical va a 1,90",html:String.raw`<p>La tabla sigue la práctica usual de nómina: la hora trabajada en domingo o festivo se paga completa con su recargo (\(1+0{,}90\)), porque el salario mensual remunera el descanso dominical, no el trabajo de ese día. Algunos textos solo agregan el recargo. Si tu profesor usa otra convención, aplícala.</p>`}],
qs:[{q:"Con un salario de $2.100.000 y jornada de 42 horas, ¿cuánto vale una hora extra nocturna?",a:"Hora ordinaria: 2.100.000/210 = $10.000. Hora extra nocturna: 10.000 × 1,75 = $17.500."},
 {q:"Un trabajador con jornada de 8 horas entra a las 2:00 p. m. y sale a las 11:00 p. m. un martes. ¿Cómo se clasifican sus horas?",a:"De 2 a 7 p. m.: 5 horas ordinarias diurnas. De 7 a 10 p. m.: 3 horas ordinarias nocturnas (recargo del 35 %). De 10 a 11 p. m.: 1 hora extra nocturna (1,75). Compruébalo en la calculadora."}]},

{id:"nomina", t:"Nómina mensual", sim:"nom", html:String.raw`
<section><h3>La idea</h3><p class="lead">La nómina reúne lo que el trabajador gana en el mes (devengados), lo que se le descuenta (deducciones) y lo que recibe al final (neto).</p></section>
<section><h3>Devengados</h3><ul><li><b>Salario básico</b> proporcional a los días trabajados: \(\frac{\text{salario}}{30}\times\text{días}\).</li><li><b>Horas extra y recargos</b>, calculados como en la estación anterior.</li><li><b>Auxilio de transporte</b> ($249.095 en 2026) para quienes devengan hasta 2 SMMLV, proporcional a los días trabajados. No es salario: no entra en la base de aportes.</li></ul></section>
<section><h3>Deducciones del trabajador</h3><div class="tbl"><table><tr><th>Concepto</th><th>Porcentaje del IBC</th></tr>
<tr><td>Salud</td><td class="num">4 %</td></tr><tr><td>Pensión</td><td class="num">4 %</td></tr>
<tr><td>Fondo de solidaridad pensional (desde 4 SMMLV)</td><td class="num">1 % a 2 %</td></tr></table></div>
<p>El IBC (ingreso base de cotización) es el salario más los pagos salariales del mes, como horas extra y recargos, sin el auxilio de transporte. La retención en la fuente no se incluye aquí.</p></section>
<section><h3>Neto a pagar</h3><div class="mj">\[\text{Neto}=\underbrace{\text{básico}+\text{extras}+\text{auxilio}}_{\text{devengado}}-\underbrace{(\text{salud}+\text{pensión}+\text{FSP})}_{\text{deducciones}}\]</div></section>
${LAB_}${AVISO}`,
deep:[{k:"Empleador",t:"Lo que paga el empleador además del salario",html:String.raw`<div class="tbl"><table><tr><th>Concepto</th><th>Porcentaje</th></tr><tr><td>Pensión</td><td class="num">12 % del IBC</td></tr><tr><td>Caja de compensación</td><td class="num">4 % del IBC</td></tr><tr><td>ARL (riesgo I)</td><td class="num">0,522 % del IBC</td></tr><tr><td>Salud, ICBF y SENA</td><td>8,5 %, 3 % y 2 %; el empleador está exonerado por los trabajadores que ganan menos de 10 SMMLV</td></tr><tr><td>Cesantías y prima</td><td class="num">8,33 % cada una</td></tr><tr><td>Intereses sobre cesantías</td><td class="num">12 % anual de las cesantías</td></tr><tr><td>Vacaciones</td><td class="num">4,17 % del salario básico</td></tr></table></div><p>Las cesantías, la prima y sus intereses se calculan incluyendo el auxilio de transporte; las vacaciones, no.</p>`}],
qs:[{q:"Un trabajador gana el salario mínimo de 2026 y trabajó el mes completo sin extras. ¿Cuál es su neto?",a:"Devengado: 1.750.905 + 249.095 = $2.000.000. Deducciones: 8 % de 1.750.905 = $140.072,40. Neto: $1.859.927,60."}]},
{id:"prima", t:"Prima de servicios", sim:"prima", html:String.raw`
<section><h3>La idea</h3><p class="lead">La prima de servicios es una prestación social: <b>un mes de salario por cada año trabajado</b> (30 días), que se paga en dos mitades, una por semestre (art. 306 del CST, modificado por la Ley 1788 de 2016). Si se trabajó solo una parte del semestre, se paga en proporción a los días.</p></section>
<section><h3>Los dos pagos</h3><div class="tbl"><table><tr><th>Pago</th><th>Periodo que cubre</th><th>Valor (semestre completo)</th><th>Plazo</th><th>Mora desde</th></tr>
<tr><td>Prima 1</td><td>1 de enero a 30 de junio</td><td>15 días de salario</td><td>30 de junio</td><td>1 de julio</td></tr>
<tr><td>Prima 2</td><td>1 de julio a 31 de diciembre</td><td>15 días de salario</td><td>20 de diciembre</td><td>21 de diciembre</td></tr></table></div>
<p>Si el contrato termina antes, la prima del semestre en curso se paga proporcional con la liquidación final.</p></section>
<section><h3>La base: ¿qué salario se usa?</h3><ol class="steps">
<li><b>Salario devengado:</b> el salario más lo que se paga como retribución del trabajo, como horas extra, recargos y comisiones.</li>
<li><b>Si los últimos tres meses del semestre son iguales</b> (abril, mayo y junio en la prima 1; octubre, noviembre y diciembre en la prima 2), la base es el salario actual.</li>
<li><b>Si no son iguales</b> (hubo horas extra, comisiones o un aumento), la base es el <b>promedio</b> de lo devengado en el semestre (enero a junio, o julio a diciembre).</li>
<li>A la base se le suma el <b>auxilio de transporte</b> ($249.095 en 2026), para quienes ganan hasta 2 SMMLV. Para las prestaciones sociales, el auxilio se trata como salario (art. 7 de la Ley 1 de 1963).</li></ol></section>
<section><h3>La fórmula</h3>
<div class="mj">\[\text{Prima}=\frac{(\text{salario base}+\text{auxilio de transporte})\times\text{días laborados}}{360}\]</div>
<p>Los días se cuentan con el año comercial: cada mes tiene 30 días y el semestre completo, 180. Se descuentan los días no laborados que suspenden el contrato, como las licencias no remuneradas y las sanciones (art. 51). Con el semestre completo, la prima es la mitad de la base.</p></section>
<section><h3>Mora en el pago</h3><p>Si el empleador no paga a tiempo, desde el día siguiente al plazo (1 de julio o 21 de diciembre) y hasta que pague, debe <b>un día de salario por cada día de retraso</b>. Ese día se calcula con el <b>salario básico, sin el auxilio de transporte</b>:</p>
<div class="mj">\[\text{Mora}=\frac{\text{salario básico}}{30}\times\text{días de retraso}\]</div>
<p class="hint">Así se vio en clase. Ten en cuenta que el artículo 65 del CST prevé esta sanción cuando, <b>al terminar el contrato</b>, no se pagan salarios y prestaciones, y que la Corte Suprema exige analizar si el empleador actuó de buena fe. Mientras el contrato sigue vigente, el retraso también puede reclamarse ante el Ministerio de Trabajo, que puede imponer multas.</p></section>
<section><h3>Ejemplos resueltos (2026)</h3>
<div class="tbl"><table><tr><th>Caso</th><th>Base</th><th class="num">Días</th><th class="num">Prima</th></tr>
<tr><td>Salario mínimo, prima 1 completa</td><td>1.750.905 + 249.095 = 2.000.000</td><td class="num">180</td><td class="num">$1.000.000</td></tr>
<tr><td>Salario de $2.500.000, ingresó el 15 de marzo</td><td>2.500.000 + 249.095 = 2.749.095</td><td class="num">106</td><td class="num">$809.456</td></tr>
<tr><td>Básico de $2.000.000 con horas extra: devengó 2,0; 2,0; 2,0; 2,2; 2,35 y 2,15 millones</td><td>Abril, mayo y junio difieren: promedio 2.116.667 + 249.095 = 2.365.762</td><td class="num">180</td><td class="num">$1.182.881</td></tr>
<tr><td>Salario mínimo con 10 días de licencia no remunerada</td><td>2.000.000</td><td class="num">170</td><td class="num">$944.444</td></tr>
<tr><td>Salario de $4.000.000 (más de 2 SMMLV, sin auxilio)</td><td>4.000.000</td><td class="num">180</td><td class="num">$2.000.000</td></tr></table></div>
<p><b>Días del segundo caso:</b> del 15 de marzo al 30 de junio son (6 − 3) × 30 + (30 − 15) + 1 = 106 días.</p>
<p class="link">Para liquidar todas las primas de un contrato, con sus moras, en el formato del tablero, usa la <button class="btn" type="button" data-go="liquidacion">Liquidación de prestaciones (formato de clase)</button>.</p>
<p><b>Mora:</b> si al trabajador de salario mínimo le pagan la prima de junio el 15 de julio, son 15 días de mora: 1.750.905 / 30 × 15 = <b>$875.452,50</b>. Si le pagan la de diciembre el 28, son 8 días: <b>$466.908</b>.</p></section>
${LAB_}${AVISO}`,
deep:[{k:"Quién",t:"Quién tiene derecho y quién no",html:String.raw`<ul><li><b>Sí:</b> todos los trabajadores con contrato de trabajo, sin importar el tipo de contrato (término fijo, indefinido, obra o labor), incluidos, desde la Ley 1788 de 2016, los trabajadores del servicio doméstico, los choferes de servicio familiar y los trabajadores por días.</li><li><b>No:</b> quien gana salario integral, porque su factor prestacional ya incluye la prima (art. 132); los aprendices SENA, porque el contrato de aprendizaje no es un contrato de trabajo; y los contratistas por prestación de servicios.</li><li>La prima no es salario: no entra en la base de aportes a salud y pensión.</li></ul>`},
 {k:"Excel",t:"Cómo montarla en una hoja de cálculo",html:String.raw`<ol><li>En B2:G2, el salario devengado de cada mes.</li><li>¿Son iguales los últimos tres? <code>=Y(E2=F2;F2=G2)</code>.</li><li>Base: <code>=SI(Y(E2=F2;F2=G2);G2;PROMEDIO(B2:G2))+auxilio</code>.</li><li>Días: <code>=DIAS360(ingreso;fin;VERDADERO)+1-ausencias</code>. El VERDADERO usa el método europeo, que cuenta cada mes como 30 días.</li><li>Prima: <code>=base*días/360</code>.</li></ol>`}],
qs:[{q:"Un trabajador gana $1.750.905 y trabajó todo el primer semestre de 2026. ¿Cuánto le corresponde y hasta cuándo se paga?",a:"(1.750.905 + 249.095) × 180 / 360 = $1.000.000, a más tardar el 30 de junio."},
 {q:"¿Por qué en un caso se usa el salario actual y en otro el promedio?",a:"Si los últimos tres meses del semestre son iguales, el salario actual representa bien lo devengado. Si cambió (horas extra, comisiones, aumento), se usa el promedio del semestre."},
 {q:"La prima de diciembre se pagó el 23 de diciembre a quien gana $3.000.000. ¿Cuánto es la mora?",a:"La mora corre desde el 21 de diciembre: 3 días × 3.000.000 / 30 = $300.000, con el salario básico sin auxilio de transporte."}]},
{id:"cesantias", t:"Cesantías e intereses sobre las cesantías", html:String.raw`
<section><h3>La idea</h3><p class="lead">Las cesantías son un ahorro obligatorio para cuando el trabajador quede cesante: <b>un mes de salario por cada año trabajado</b>, del 1 de enero al 31 de diciembre, y proporcional si trabajó menos (art. 249 del CST). Sobre ese saldo, el empleador paga además unos <b>intereses del 12 % anual</b> (Ley 52 de 1975).</p></section>
<section><h3>Los dos regímenes</h3><div class="tbl"><table><tr><th>Régimen</th><th>A quién aplica</th><th>Cómo funciona</th></tr>
<tr><td>Tradicional (retroactivo)</td><td>Contratos anteriores a la Ley 50 de 1990 que no se cambiaron al nuevo régimen</td><td>Las guarda el empleador y se liquidan al final con el último salario, por todo el tiempo servido.</td></tr>
<tr><td>Liquidación anual (Ley 50 de 1990)</td><td>Contratos firmados desde el 1 de enero de 1991</td><td>Se liquidan cada 31 de diciembre y se consignan en el <b>fondo de cesantías</b> que elija el trabajador a más tardar el <b>14 de febrero</b> del año siguiente.</td></tr></table></div></section>
<section><h3>Plazos y sanciones</h3><div class="tbl"><table><tr><th>Qué</th><th>A quién se paga</th><th>Plazo</th><th>Si no se paga</th></tr>
<tr><td>Cesantías del año</td><td>Al fondo</td><td>14 de febrero del año siguiente</td><td>Desde el <b>15 de febrero</b>, un día de salario por cada día de retraso (art. 99 de la Ley 50 de 1990)</td></tr>
<tr><td>Intereses sobre las cesantías</td><td>Directamente al trabajador</td><td>31 de enero del año siguiente</td><td>Un valor adicional igual a los intereses: se pagan dobles (Ley 52 de 1975)</td></tr>
<tr><td>Cesantías e intereses del año del retiro</td><td>Directamente al trabajador</td><td>Con la liquidación final</td><td>Indemnización moratoria (art. 65)</td></tr></table></div></section>
<section><h3>La base y las fórmulas</h3><p>La base es la misma de la prima: si el salario devengado de los últimos tres meses es igual, el salario actual; si no, el promedio de todos los meses del año (o de lo trabajado, si es menos), contando como 0 los meses suspendidos, como lo hace la profesora. Se le suma el auxilio de transporte para quienes ganan hasta 2 SMMLV, y se restan los días de suspensión del artículo 51.</p>
<div class="mj">\[\text{Cesantías}=\frac{(\text{salario}+\text{auxilio})\times(\text{días}-\text{días art. 51})}{360}\qquad\qquad\text{Intereses}=\frac{\text{cesantías}\times\text{días}\times12\,\%}{360}\]</div>
<p>Con el año completo, las cesantías son un mes de base y los intereses el 12 % de ellas.</p></section>
<section><h3>Salario integral</h3><p>Quien gana salario integral <b>no tiene derecho</b> a cesantías ni a prima (art. 132). Del 100 % del salario integral, el 70 % es la base de la seguridad social (IBC) y el 30 % es el factor prestacional que ya paga esas prestaciones.</p></section>
<section><h3>¿Cuándo se pueden retirar?</h3><ul><li>Al terminar el contrato.</li><li>Para comprar vivienda.</li><li>Para reformar o mejorar la vivienda.</li><li>Para pagar estudios del trabajador, su cónyuge o sus hijos.</li></ul></section>
<section><h3>El ejercicio de clase</h3><p>Ingresó el 20 de septiembre de 2025 con $2.000.000 (auxilio 2025: $200.000). En 2026 gana $2.900.000 (auxilio $249.095); en mayo estuvo suspendido 30 días (art. 51), en julio devengó $2.950.000 con horas extra y de agosto a octubre $3.300.000 con recargos. Se retiró el 3 de noviembre de 2026.</p>
<div class="eq al">2025: 20/9/25 – 31/12/25 = 101<br>(2.000.000 + 200.000) × (101 − 0) / 360 = <b>617.222</b><br>Mora: 15/2/26 – 3/11/26 = 259 × 66.666 = <b>17.266.494</b><br><br>2026: 1/1/26 – 3/11/26 = 303<br>(3.300.000 + 249.095) × (303 − 30) / 360 = <b>2.691.397</b></div>
<ol class="steps"><li><b>Cesantías de 2025:</b> 101 días con el año de 360 (del 20 de septiembre al 30 de diciembre son 100, más el día de inicio). Los tres últimos meses son iguales, así que la base es 2.000.000 más el auxilio de 2025.</li>
<li><b>Mora:</b> no se consignaron el 14 de febrero de 2026, así que desde el 15 de febrero hasta el retiro corre un día de salario por día. 2.000.000 / 30 = 66.666 (truncado), por 259 días.</li>
<li><b>Cesantías de 2026:</b> se pagan en la liquidación. Los últimos tres meses (agosto a octubre) son iguales, así que la base es 3.300.000 más el auxilio de 2026, y se restan los 30 días de mayo.</li>
<li><b>Intereses:</b> 617.222 × 101 × 12 % / 360 = 20.780 por 2025, que debían pagarse el 31 de enero; como no se pagaron, la sanción es otro tanto. Por 2026: 2.691.397 × 273 × 12 % / 360 = 244.917, con la liquidación.</li></ol>
<p>La <button class="btn" type="button" data-go="liquidacion">Liquidación de prestaciones (formato de clase)</button> trae este ejercicio cargado, con las primas, las cesantías, los intereses y todas las moras, escrito como en el tablero.</p>
<p class="hint">Como en clase, el salario diario de la mora se trunca a pesos y se toma el básico del año que se debe. Algunas sentencias liquidan la mora del artículo 99 con el salario vigente en cada año de retraso.</p>
${AVISO}`,
qs:[{q:"Un trabajador con salario mínimo de 2026 trabaja todo el año. ¿Cuánto son sus cesantías y sus intereses, y cuándo se pagan?",a:"Cesantías: 2.000.000 × 360 / 360 = $2.000.000, al fondo a más tardar el 14 de febrero de 2027. Intereses: 2.000.000 × 360 × 12 % / 360 = $240.000, al trabajador a más tardar el 31 de enero de 2027."},
 {q:"Si el empleador no paga los intereses a tiempo, ¿cuál es la sanción?",a:"Un valor adicional igual a los intereses: los paga dobles."},
 {q:"¿Por qué en 2026 se resta 30 a los 303 días?",a:"Porque en mayo hubo una suspensión del contrato de 30 días (art. 51): esos días no cuentan para las prestaciones."}]},
{id:"vacaciones", t:"Vacaciones", nuevo:true, sim:"vac", html:String.raw`
<section><h3>La idea</h3><p class="lead">Por cada año de servicio, el trabajador tiene derecho a <b>15 días hábiles consecutivos de vacaciones remuneradas</b> (art. 186 del CST). Si el contrato termina sin que las haya disfrutado, se le pagan en dinero, en proporción al tiempo trabajado (art. 189).</p>
<p>Las vacaciones <b>no son una prestación social</b>: son un descanso remunerado. Por eso no llevan auxilio de transporte y no aparecen en la liquidación de primas y cesantías; se suman aparte en la liquidación final.</p></section>
<section><h3>Las reglas</h3><div class="tbl"><table><tr><th>Tema</th><th>Regla</th><th>Artículo</th></tr>
<tr><td>Derecho</td><td>15 días hábiles por año de servicio; los proporcionales se causan día a día</td><td>186</td></tr>
<tr><td>Época</td><td>La señala el empleador dentro del año siguiente, avisando con 15 días de anticipación</td><td>187</td></tr>
<tr><td>Interrupción</td><td>Si se interrumpen (por ejemplo, por incapacidad), el trabajador conserva el derecho a reanudarlas</td><td>188</td></tr>
<tr><td>Compensación en dinero</td><td>Durante el contrato, hasta la mitad, por acuerdo escrito. Al terminar, las no disfrutadas se pagan por año cumplido y proporcionalmente por la fracción</td><td>189</td></tr>
<tr><td>Acumulación</td><td>Se disfrutan al menos 6 días hábiles continuos por año; el resto puede acumularse hasta por 2 años (4 para técnicos, especializados y extranjeros)</td><td>190</td></tr>
<tr><td>Salario base</td><td>El ordinario que devenga el día en que salen a vacaciones (o al retiro). No incluye horas extra ni el trabajo en dominicales y festivos. Si el salario es variable, el promedio del último año</td><td>192</td></tr>
<tr><td>Suspensiones</td><td>Los días de suspensión del art. 51 (licencias no remuneradas, sanciones, suspensión de actividades) se descuentan</td><td>53</td></tr>
<tr><td>Pago</td><td>Se pagan por anticipado, antes de empezar el descanso</td><td>192</td></tr></table></div></section>
<section><h3>Las fórmulas</h3>
<div class="mj">\[\text{Días de vacaciones}=\frac{\text{días trabajados}\times15}{360}\qquad\qquad\text{Vacaciones}=\frac{\text{salario}\times\text{días trabajados}}{720}\]</div>
<p>Las dos dan lo mismo: \(\frac{\text{salario}}{30}\times\frac{\text{días}\times15}{360}=\frac{\text{salario}\times\text{días}}{720}\). Los días trabajados se cuentan con el año de 360, contando el primero y el último, y se les restan las suspensiones del artículo 51.</p>
<p><b>Días hábiles:</b> no cuentan los domingos ni los festivos. El sábado cuenta si el trabajador labora ese día. Por eso 15 días hábiles suelen ser unos 18 días calendario, y el trabajador regresa el día hábil siguiente al último día de vacaciones.</p></section>
<section><h3>Ejemplos</h3>
<p><b>Un año completo:</b> salario de $2.000.000, del 1 de enero al 31 de diciembre de 2025 sin suspensiones: 360 días ⇒ 15 días hábiles ⇒ 2.000.000 × 360 / 720 = <b>$1.000.000</b>.</p>
<p><b>Mariana (taller):</b> si las vacaciones se deben desde el 1 de enero de 2025, igual que las prestaciones:</p>
<div class="eq al">Días: 1/1/25 – 31/10/26 = 660<br>Menos art. 51: 660 − 30 (mayo de 2025) − 90 (abril a junio de 2026) − 2 (licencia del 30 y 31 de octubre) = <b>538</b><br>Días de vacaciones: 538 × 15 / 360 = 22,42 días hábiles<br>Vacaciones: 4.950.000 × 538 / 720 = <b>$3.698.750</b></div>
<p class="hint">La base es el salario básico de 4.950.000: los recargos nocturnos de octubre son de un solo mes y las horas extra de 2025 no cuentan (art. 192). Si nunca tomó vacaciones desde el ingreso (8 de noviembre de 2023): 1.073 − 122 = 951 días ⇒ 4.950.000 × 951 / 720 = $6.538.125.</p></section>
${LAB_}${AVISO}`,
qs:[{q:"Un trabajador con salario de $3.000.000 trabajó 200 días y renuncia sin haber salido a vacaciones. ¿Cuánto le deben?",a:"3.000.000 × 200 / 720 = $833.333 (8,33 días hábiles)."},
 {q:"¿Se incluye el auxilio de transporte en las vacaciones?",a:"No: las vacaciones son descanso remunerado y el auxilio solo se paga por los días trabajados."},
 {q:"Un trabajador estuvo 30 días en licencia no remunerada. ¿Afecta sus vacaciones?",a:"Sí: es una suspensión del art. 51 y, según el art. 53, esos días se descuentan del tiempo para las vacaciones."}]}
];

const BRANCHES=[
{g:"Después del despido", from:"indemnizaciones", items:[
 {id:"moratoria", t:"Indemnización moratoria (art. 65)", sim:"mora", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si al terminar el contrato el empleador no paga los salarios y prestaciones que debe, tiene que pagar además un día de salario por cada día de retardo.</p>
<div class="mj">\[\text{Moratoria}=\frac{\text{último salario}}{30}\times\text{días de retardo}\]</div>
<ul><li>Para quienes ganan <b>más de un SMMLV</b>, corre hasta por <b>24 meses</b>. Desde el mes 25 se deben intereses moratorios sobre lo adeudado, a la tasa máxima de créditos de libre asignación.</li><li>Para quienes ganan <b>un SMMLV o menos</b>, sigue el régimen anterior: un día de salario por cada día de retardo, sin el límite de 24 meses.</li><li>Si hay desacuerdo sobre el monto, el empleador puede consignar ante el juez lo que reconoce deber para evitar la sanción.</li></ul>
<p>La jurisprudencia exige revisar la buena fe del empleador: la moratoria no es automática.</p></section>${LAB_}${AVISO}`,
 qs:[{q:"A un trabajador que ganaba $3.000.000 le pagan la liquidación con 45 días de retraso. ¿Cuánto vale la moratoria?",a:"45 × 100.000 = $4.500.000, si no hay buena fe del empleador."}]}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"liquidacion",t:"Liquidación de prestaciones (formato de clase)",anchor:"cesantias",links:["prima","cesantias","moratoria"],sim:"liq",html:String.raw`
<details class="pdet"><summary><b>Reglas que aplica (las de clase)</b></summary><ol class="steps">
<li><b>Días:</b> año comercial de 360 días, contando el primer y el último día. Se restan los días de suspensión del artículo 51.</li>
<li><b>Base:</b> si los tres últimos meses del periodo (sin contar los suspendidos) son iguales, el salario de ese mes; si no, el promedio de lo devengado en el periodo. Más el auxilio de transporte del año, si el básico es de hasta 2 SMMLV.</li>
<li><b>Primas:</b> por semestre; plazo el 30 de junio y el 20 de diciembre; mora desde el 1 de julio y el 21 de diciembre.</li>
<li><b>Cesantías:</b> por año calendario; consignación hasta el 14 de febrero; mora desde el 15 de febrero.</li>
<li><b>Intereses:</b> 12 % anual proporcional a los días; se pagan al trabajador hasta el 31 de enero; si no, se pagan dobles.</li>
<li><b>Mora:</b> hasta la fecha de retiro, con el salario básico del periodo que se debe / 30, truncado a pesos. Lo del periodo del retiro se paga con la liquidación.</li></ol></details>
<details class="pdet"><summary><b>Ejercicio completo: de la nómina a la liquidación</b></summary><ol class="steps">
<li><b>Los meses con novedades</b> (horas extras, recargos, festivos, licencias): calcúlalos uno por uno en la <button class="btn" type="button" data-go="planilla">Resolvedor de horas extras</button> (día por día, con la tabla de la profesora) o en la <button class="btn" type="button" data-go="nomina">Nómina mensual</button> (si el ejercicio da las horas totales). Escribe el <b>mes y año</b> y toca <b>«Enviar este mes a la liquidación»</b>. Repite con cada mes.</li>
<li><b>Aquí</b>: pon la fecha de inicio y la de retiro. Los meses enviados aparecen en su renglón, con el devengado (básico + extras) y los días del art. 51. Los demás meses escríbelos a mano.</li>
<li>Marca si las primas, las cesantías o los intereses <b>se pagaron a tiempo</b>; si no, salen las moras y la sanción.</li>
<li>Copia cada bloque al taller: la fórmula, la sustitución y la nota de por qué se usó el promedio o el salario actual. Si la indemnización también se pide, va en la calculadora de <button class="btn" type="button" data-go="indemnizaciones">Indemnizaciones</button>.</li>
<li>Con «💾 Guardar» conservas la liquidación completa para volver a verla después.</li></ol></details>
<div class="sim" id="sim"></div>`,
  d:"Escribe la fecha de inicio, la de retiro y el salario de cada mes (con extras y días del artículo 51). Calcula las primas, las cesantías y sus intereses de todo el contrato, con las moras y sanciones si no se pagaron, escrito como en el tablero. Trae cargado el ejercicio de clase."},
 {id:"planilla",t:"Resolvedor del taller de horas extras",anchor:"jornada",links:["jornada","nomina"],sim:"planilla",html:String.raw`
<details class="pdet" open><summary><b>Reglas que aplica el resolvedor</b></summary>
<ol class="steps">
<li><b>Valor de la hora.</b> Salario / (jornada diaria × 30). Con 7 horas de lunes a sábado: salario / 210. En la planilla todo se paga por horas: el salario del mes es la suma de 7 horas por cada uno de los 30 días.</li>
<li><b>Cada día paga su jornada.</b> Los días hábiles, con las horas ordinarias que se trabajan (HD, HN). Los domingos y festivos, con 7 HD de descanso remunerado, se trabajen o no; si se trabajan, sus horas se suman aparte en R o en H.</li>
<li><b>Turnos.</b> Cada turno va en la fila del día en que empieza. Las primeras 7 horas del turno son ordinarias y las demás son extra; las extra siempre se pagan completas (HED, HEN, HEDD, HEND). La noche va de 7:00 p. m. a 6:00 a. m. (art. 160).</li>
<li><b>Turnos que cruzan la medianoche.</b> Cada franja se clasifica por el día en que cae. <b>Sábado → domingo:</b> lo que pasa de las 12 es dominical y se paga completo (HND o HDD), porque la base es la del sábado. <b>Domingo → lunes:</b> lo del lunes ya no es dominical; va en H (HN) o en R (RN) según la regla del domingo trabajado.</li>
<li><b>Domingo: siempre suma sus 7 HD de descanso</b> (si las ganó en la semana, ver abajo). <b>Si además lo trabaja, ¿descansa en la semana siguiente?</b> Si descansa un día entre el lunes y el sábado siguientes, las horas ordinarias del domingo llevan <b>solo el recargo del 90 %</b>: columnas R (RDD de día, RND de noche), y ese día de descanso también se paga con 7 HD (todo descanso es remunerado). Si no descansa, las horas van <b>completas con el recargo del 90 %</b>: columnas H (HDD, HND).</li>
<li><b>Festivo.</b> Siempre se pagan 7 h (art. 177). Si además lo trabaja, sus horas van en H: 7 h + 90 % (HDD, HND).</li>
<li><b>Día 31.</b> El salario cubre 30 días: las ordinarias diurnas no suman, las nocturnas llevan solo el recargo (RN o RND) y las extra se pagan completas. Un descanso o permiso el 31 no suma, y una sanción o licencia el 31 resta 7 h (art. 51).</li>
<li><b>Las 7 HD del domingo (art. 172 y 173).</b> Completas si en la semana de lunes a sábado trabajó o faltó con justa causa; los festivos cuentan como trabajados. Si ingresó a mitad de semana, se paga proporcional a las horas: si por 42 horas se pagan 7, con \(h\) horas se pagan \(7\times h/42\). Cuentan las horas ordinarias de lunes a sábado (máximo 7 por día, sin las extra) y 7 por cada festivo, permiso o descanso remunerado. En el ejercicio 1: \(7\times28/42=4{,}67\) h. También se puede elegir la proporción por días. Se pierde si faltó por culpa suya: sanción o licencia no remunerada (art. 51). Si faltó por culpa del empleador, se paga proporcional.</li>
<li><b>Novedades.</b> Descanso: todo descanso es remunerado (compensatorio), 7 HD. Permiso remunerado: 7 HD. Incapacidad por enfermedad general: los dos primeros días los paga el empleador a 2/3 del salario (art. 227), es decir 4,67 h, y nunca menos del mínimo. Sanción disciplinaria y licencia no remunerada: suspensión del contrato (art. 51); se resta el día, 0 h. Un festivo anterior al ingreso no se paga.</li>
</ol>
<p class="hint">Si tu profesor usa otra convención en algún punto (por ejemplo, que la sanción no quite el dominical o que la incapacidad se pague completa), cámbiala en los datos del mes.</p></details>
<div class="sim" id="sim"></div>`,
  d:"Escribe los turnos y las novedades del mes como vienen en el enunciado. El resolvedor llena la planilla del taller día por día (HD, HN, RN, HED, HEN, HDD, RDD, HND, RND, HEDD, HEND), dice cuándo solo se pagan los recargos, separa lo que pasa de medianoche a un domingo o festivo, y paga las dos quincenas. Trae cargados los dos ejercicios del taller."},
 {id:"caso",t:"Seguimiento de un caso (expediente)",anchor:"liquidacion",links:["prorrogas","planilla","liquidacion","vacaciones","indemnizaciones","moratoria"],sim:"caso",html:String.raw`
<details class="pdet" open><summary><b>Cómo funciona</b></summary><ol class="steps">
<li><b>Crea el caso</b> (o carga el de un taller) y escribe una sola vez los datos del trabajador: contrato, ingreso, retiro, duración pactada y salario.</li>
<li>En cada herramienta aparece arriba la barra <b>📁 Caso</b>: «Usar los datos del caso» llena el formulario y «Guardar este resultado en el caso» lo deja en el expediente.</li>
<li>La <b>planilla</b> de un mes con novedades, al guardarse, actualiza el renglón de ese mes; la <b>liquidación</b> guarda todos los meses; las <b>vacaciones</b> toman los días del art. 51 de esos meses; la <b>indemnización</b> toma el vencimiento del período que corría al retiro.</li>
<li>Al final, el <b>resumen</b> junta todos los resultados con su total. Cada herramienta sigue mostrando el paso a paso de sus cálculos.</li></ol></details>
<div class="sim" id="sim"></div>`,
  d:"Escribe una vez los datos del trabajador y síguelo por todas las herramientas: prórrogas, salario del mes, prestaciones, vacaciones e indemnización, con un resumen final. Trae los casos de Mariana y de Pedro."},
 {id:"valores",t:"Valores y porcentajes por fecha",anchor:"jornada",links:["prorrogas","indemnizaciones","jornada","nomina"],sim:"val",html:WSBOX,
  d:"El salario mínimo, el auxilio de transporte, la jornada máxima, el recargo dominical y la hora nocturna que aplican en cualquier fecha desde 2025."}
];


// =====================================================================
// TALLERES DE DERECHO LABORAL: cada punto se escribe una vez; los botones abren la herramienta con los datos cargados.
// =====================================================================
const TALLERES=[];
TALLERES.push({id:"tl-lab-2026-2",t:"Taller 2026-2: el caso de Pedro",sub:"Salario con recargos, liquidación de prestaciones e indemnización",anchor:"liquidacion",
intro:`Pedro ingresó el 8 de mayo de 2021 con contrato indefinido y fue despedido sin justa causa con efectos al 31 de agosto de 2026; le deben todas las prestaciones desde 2025. Cada punto trae el procedimiento con las convenciones de clase (días de 360, salario diario truncado, días del art. 51 descontados) y un botón que abre la herramienta con los datos de Pedro ya cargados.`,
puntos:[
{id:"lab26-1",n:"1",t:"Salario de junio de 2026 (turno de 2 pm a 10 pm)",tipo:"Planilla de horas",temas:["jornada","nomina"],tool:{id:"planilla",pre:"pedro",lbl:"Abrir junio en el Resolvedor de horas extras"},
enun:String.raw`<p>En junio de 2026 el horario de Pedro cambió a 2:00 pm – 10:00 pm de lunes a sábado, <b>incluidos los festivos</b>; descansa los domingos. Tuvo licencia no remunerada los días 12, 13 y 14. Su salario es $4.250.000. ¿Cuál es el salario que le corresponde por junio?</p>`,
saber:[String.raw`<b>Calendario del taller:</b> el 1 de junio cae <b>martes</b> (así viene en la hoja del taller). Domingos: 6, 13, 20 y 27. Festivos: 8 (Corpus Christi), 15 (Sagrado Corazón) y 29 (San Pedro y San Pablo), las fechas legales de 2026; en este calendario caen martes. La licencia cae sábado 12, domingo 13 y lunes 14.`,
String.raw`<b>Tabla del taller:</b> HN 1,35 · RN 0,35 · HED 1,25 · HEN 1,75 · HDD 1,75 · RD 0,75 · HND 2,10 · RND 1,10 · HEDD 2 · HEND 2,50. Usa un recargo dominical del <b>75 %</b>.`,
String.raw`<b>Jornada:</b> 7 horas diarias, como en el taller de horas extras; lo que pase de 7 es extra. <b>Nocturna:</b> desde las 7:00 pm (Ley 2466 de 2025, vigente desde el 25 de diciembre de 2025).`,
String.raw`<b>Valor de la hora:</b> \(4.250.000/(7\times30)=20.238{,}10\). La licencia no remunerada suspende el contrato (art. 51): esos días no se pagan.`,
String.raw`<b>Dominical (art. 173):</b> el descanso del domingo se paga si trabajó toda la semana. La licencia del lunes 14 cae en la semana del domingo 20, así que pierde ese dominical (como en el taller de horas extras).`],
sol:String.raw`<ol class="steps"><li><b>Un día normal</b> (2 pm – 10 pm, 8 horas): de 2 a 7 pm son 5 HD; de 7 a 9 pm, 2 horas ordinarias nocturnas (HN); de 9 a 10 pm se pasa de 7 horas, así que es 1 HEN.</li>
<li><b>Un festivo trabajado</b> (8, 15 y 29): el festivo ya se paga como descanso (7 HD, art. 177) y además las horas trabajadas se pagan con el recargo: 5 HDD, 2 HND y 1 HEND.</li>
<li><b>Domingos 6 y 27:</b> descanso remunerado, 7 HD cada uno, porque cumplió la semana. <b>Domingo 20:</b> no se paga, por la licencia del lunes 14. <b>Días 12, 13 y 14:</b> licencia, no suman.</li>
<li><b>Totales del mes</b> (21 días normales trabajados, 3 festivos trabajados, 2 domingos de descanso):
<div class="tbl"><table><tr><th>Columna</th><th class="num">Horas</th><th class="num">Factor</th><th class="num">Valor</th></tr>
<tr><td>HD</td><td class="num">140</td><td class="num">1</td><td class="num">2.833.333,33</td></tr>
<tr><td>HN</td><td class="num">42</td><td class="num">1,35</td><td class="num">1.147.500,00</td></tr>
<tr><td>HEN</td><td class="num">21</td><td class="num">1,75</td><td class="num">743.750,00</td></tr>
<tr><td>HDD</td><td class="num">15</td><td class="num">1,75</td><td class="num">531.250,00</td></tr>
<tr><td>HND</td><td class="num">6</td><td class="num">2,10</td><td class="num">255.000,00</td></tr>
<tr><td>HEND</td><td class="num">3</td><td class="num">2,50</td><td class="num">151.785,71</td></tr>
<tr><td><b>Total</b></td><td></td><td></td><td class="num"><b>5.662.619,05</b></td></tr></table></div></li>
<li><b>Comprobación:</b> las horas base son 140 HD + 42 HN = 182 = 26 días × 7 (los 30 días menos los 3 de licencia y el domingo 20). Sin recargos ni extras habría ganado 4.250.000 × 26/30 = 3.683.333,33.</li></ol>
<p class="hint"><b>Ojo:</b> en la solución de clase junio vale <b>$5.448.094</b> (se deduce de sus promedios del punto 2), $214.525 menos que aquí. El supuesto que más se acerca en el resolvedor es la nocturna desde las 9 pm sin perder el domingo 20 ($5.440.674,60). La liquidación del punto 2 usa el valor de clase. Si la licencia no le quitara el dominical, el domingo 20 se pagaría proporcional (5,83 h) y el mes daría $5.780.674,60. Si en clase se toma la jornada legal de junio de 2026 (44 horas semanales, 7,33 diarias, hasta el 14 de julio) o la nocturna desde las 9 pm, el resultado cambia. En el resolvedor puedes cambiar esos datos y ver el efecto al instante.</p>`,
res:String.raw`<p>Salario de junio de 2026: <b>$5.662.619,05</b>, con el recargo del 75 % de la tabla del taller, jornada de 7 horas y nocturna desde las 7 pm. Pedro no tiene auxilio de transporte porque gana más de 2 SMMLV.</p>`},

{id:"lab26-2",n:"2",t:"Liquidación de las prestaciones sociales desde 2025",tipo:"Liquidación",temas:["prima","cesantias","liquidacion"],tool:{id:"liquidacion",pre:"pedro",lbl:"Abrir la liquidación de Pedro"},
enun:String.raw`<p>Liquide las prestaciones sociales a que tiene derecho Pedro, teniendo en cuenta que al momento del retiro le adeudan todas las prestaciones desde 2025.</p>`,
saber:[String.raw`<b>Base (como en clase):</b> si los tres últimos meses del periodo son iguales, el salario de ese mes; si no, el <b>promedio de todos los meses del periodo</b>, y los meses suspendidos todo el mes cuentan como <b>0</b>. Más el auxilio de transporte si el básico es de hasta 2 SMMLV.`,
String.raw`<b>Fórmulas:</b> prima y cesantías = base × (días − días art. 51) / 360; intereses = cesantías × días × 12 % / 360.`,
String.raw`<b>Moras (convención de clase):</b> un día de salario básico (truncado) por cada día de retraso hasta el retiro. Prima: desde el 1 de julio y el 21 de diciembre. Cesantías: desde el 15 de febrero. Intereses no pagados al 31 de enero: se pagan dobles.`,
String.raw`<b>Datos:</b> 2025, básico 1.835.000 (auxilio 200.000); devengó 3.835.000 de enero a abril y de agosto a diciembre, 5.835.000 en mayo; suspendido junio y julio. 2026, básico 4.250.000 (sin auxilio, porque supera 2 SMMLV); suspendido abril; junio, <b>5.448.094</b> con 3 días de licencia (el valor de la solución de clase); licencia todo agosto.`],
sol:String.raw`<h5>2025</h5><ol class="steps">
<li><b>Prima 1:</b> 1/1/25 – 30/6/25 = 180 − 30 (junio) = 150 días. Abril, mayo y junio no son iguales (junio vale 0), así que la base es el promedio de los seis meses: (4 × 3.835.000 + 5.835.000 + 0)/6 = 3.529.166,67, más 200.000. \((3.529.166{,}67+200.000)\times150/360=\) <b>1.553.819</b>. Mora: 1/7/25 – 31/8/26 = 420 × 61.166 = <b>25.689.720</b>.</li>
<li><b>Prima 2:</b> 1/7/25 – 31/12/25 = 180 − 30 (julio) = 150. Octubre a diciembre son iguales: \((3.835.000+200.000)\times150/360=\) <b>1.681.250</b>. Mora: 21/12/25 – 31/8/26 = 250 × 61.166 = <b>15.291.500</b>.</li>
<li><b>Cesantías:</b> 1/1/25 – 31/12/25 = 360 − 60 = 300. Octubre a diciembre son iguales: \((3.835.000+200.000)\times300/360=\) <b>3.362.500</b>. No se consignaron: mora 15/2/26 – 31/8/26 = 196 × 61.166 = <b>11.988.536</b>.</li>
<li><b>Intereses:</b> 3.362.500 × 300 × 12 % / 360 = <b>336.250</b>; como no se pagaron al 31 de enero de 2026, la sanción es otro tanto: <b>336.250</b>.</li></ol>
<h5>2026 (como en el tablero)</h5><ol class="steps">
<li><b>Prima 1:</b> 1/1/26 – 30/6/26 = 180 días. Base: (4 × 4.250.000 + 0 (abril) + 5.448.094)/6 = 3.741.349. \(3.741.349\times(180-33)/360=\) <b>1.527.718</b>. Mora: 1/7/26 – 31/8/26 = 60 × 141.666 = <b>8.499.960</b> (en el tablero, 8.500.000 con 141.666,67).</li>
<li><b>Prima 2:</b> 1/7/26 – 31/8/26 = 60 días. Base: (4.250.000 + 0 (agosto))/2 = 2.125.000. \(2.125.000\times(60-30)/360=\) <b>177.083</b>, con la liquidación.</li>
<li><b>Cesantías:</b> 1/1/26 – 31/8/26 = 240 días. Base: (5 × 4.250.000 + 0 + 5.448.094 + 0)/8 = 3.337.262. \(3.337.262\times(240-63)/360=\) <b>1.640.820</b>, con la liquidación.</li>
<li><b>Intereses:</b> 1.640.820 × (240 − 63) × 0,12 / 360 = <b>96.808</b>, con la liquidación.</li></ol>
<h5>Resumen</h5><div class="tbl"><table><tr><th>Concepto</th><th class="num">Valor</th></tr>
<tr><td>Primas (cuatro semestres)</td><td class="num">4.939.870</td></tr><tr><td>Cesantías 2025 y 2026</td><td class="num">5.003.320</td></tr><tr><td>Intereses sobre cesantías</td><td class="num">433.058</td></tr>
<tr><td><b>Prestaciones sociales</b></td><td class="num"><b>10.376.248</b></td></tr>
<tr><td>Mora de las primas</td><td class="num">49.481.180</td></tr><tr><td>Mora por no consignar las cesantías de 2025</td><td class="num">11.988.536</td></tr><tr><td>Sanción por no pagar los intereses de 2025</td><td class="num">336.250</td></tr>
<tr><td><b>Total con moras y sanciones</b></td><td class="num"><b>72.182.214</b></td></tr></table></div>
<p class="hint">La base cuenta los meses suspendidos como 0 y, además, se restan sus días: así lo resolvió la profesora. Las vacaciones no son una prestación social, por eso no están aquí. Después del retiro corre la indemnización moratoria del art. 65.</p>`,
res:String.raw`<p>Prestaciones adeudadas: <b>$10.376.248</b> (primas 4.939.870, cesantías 5.003.320 e intereses 433.058). Con las moras y la sanción por intereses, el total es <b>$72.182.214</b>. Los valores de 2026 coinciden con el tablero.</p>`},

{id:"lab26-3",n:"3",t:"Indemnización por despido sin justa causa",tipo:"Indemnización (art. 64)",temas:["indemnizaciones"],tool:{id:"indemnizaciones",pre:"pedro",lbl:"Abrir la indemnización de Pedro"},
enun:String.raw`<p>El 25 de agosto le notifican a Pedro que desde el 1 de septiembre ya no trabajará porque el cargo se lo darán a otra persona. Realice la indemnización a que tiene derecho.</p>`,
saber:[String.raw`Darle el cargo a otra persona no es una justa causa (art. 62): es despido sin justa causa, y en el contrato indefinido no hace falta preaviso.`,
String.raw`<b>Art. 64, contrato indefinido, salario menor de 10 SMMLV:</b> 30 días por el primer año, 20 por cada año siguiente y, por la fracción, 20 × días sobrantes / 360, redondeado al día entero.`,
String.raw`Según el art. 53, las suspensiones del art. 51 se descuentan para vacaciones, cesantías y pensión; el artículo no menciona la indemnización. Si en clase se descuentan, la calculadora tiene el campo «Días de suspensión a descontar (art. 51)».`],
sol:String.raw`<ol class="steps"><li><b>Tiempo de servicio:</b> del 8/5/2021 al 31/8/2026 = (2026 − 2021) × 360 + (8 − 5) × 30 + (30 − 8) + 1 = <b>1.913 días</b> = 5 años y 113 días.</li>
<li><b>Días de indemnización:</b> primer año 30; cuatro años siguientes 20 × 4 = 80; fracción 20 × 113/360 = 6,28, que se redondea a 6. Total: 30 + 80 + 6 = <b>116 días</b>.</li>
<li><b>Salario diario:</b> 4.250.000 / 30 = 141.666,67.</li>
<li><b>Indemnización:</b> 116 × 141.666,67 = <b>$16.433.333</b>.</li></ol>
<h5>Si se descuentan las suspensiones</h5><p>Pedro tuvo 123 días del art. 51 (junio y julio de 2025: 60; abril de 2026: 30; licencia de junio: 3; agosto: 30). Servicio: 1.913 − 123 = 1.790 días = 4 años y 350 días. Días: 30 + 20 × 3 + 20 × 350/360 (19,44, que se redondea a 19) = 109. Indemnización: 109 × 141.666,67 = <b>$15.441.667</b>. <button class="btn" type="button" data-tool="indemnizaciones" data-pre="pedro51">Abrir con los 123 días descontados</button></p>`,
res:String.raw`<p>Indemnización por despido sin justa causa: <b>$16.433.333</b> (116 días de salario). Si se descuentan los 123 días de suspensión: <b>$15.441.667</b> (109 días).</p>`}]});

TALLERES.push({id:"tl-lab-mariana",t:"Taller: el caso de Mariana",sub:"Salario con turno nocturno, prestaciones adeudadas desde 2025 e indemnización de un contrato a término fijo",anchor:"liquidacion",
intro:`Mariana ingresó el 8 de noviembre de 2023 con un contrato a término fijo de 8 meses y 15 días y fue despedida sin justa causa el 31 de octubre de 2026 (trabajó hasta ese día). Le deben todas las prestaciones desde 2025. Cada punto se resuelve con las convenciones de clase (días de 360 contando ambos extremos, salario diario truncado, días del art. 51 descontados) y trae un botón que abre la herramienta con el caso de Mariana cargado. El <button class="btn" type="button" data-tool="caso" data-pre="mariana">expediente del caso</button> junta todos los resultados.`,
puntos:[
{id:"mar-1",n:"1",t:"Salario de octubre de 2026 (turno de 10 pm a 6 am)",tipo:"Planilla de horas",temas:["jornada","nomina"],tool:{id:"planilla",pre:"mariana",lbl:"Abrir octubre en el Resolvedor de horas extras"},
enun:String.raw`<p>En octubre de 2026 Mariana laboró de 10 pm a 6 am de lunes a viernes y los sábados de 10 pm a 5 am; descansaba los domingos y festivos. El 30 y el 31 de octubre pidió licencia no remunerada. Su salario es $4.950.000. ¿Cuál es el salario que le corresponde por octubre?</p>`,
saber:[String.raw`<b>Calendario del taller:</b> el 1 de octubre cae <b>martes</b>. Domingos: 6, 13, 20 y 27. Festivo: <b>lunes 7</b> (así viene marcado en la hoja). El 30 es miércoles y el 31 jueves.`,
String.raw`<b>Jornada:</b> 7 horas diarias (42 semanales desde el 15 de julio de 2026); lo que pase de 7 horas en el turno es extra. <b>Nocturna:</b> de 7:00 pm a 6:00 am, así que todo el turno es nocturno.`,
String.raw`<b>Tabla del taller:</b> HN 1,35 · RN 0,35 · HED 1,25 · HEN 1,75 · HDD 1,90 · RD 0,90 · HND 2,25 · RND 1,25 · HEDD 2,15 · HEND 2,65. Es el recargo dominical del <b>90 %</b>, el legal desde el 1 de julio de 2026.`,
String.raw`<b>Valor de la hora:</b> 4.950.000 / (7 × 30) = 23.571,43.`,
String.raw`<b>Turno del sábado:</b> de 10 pm a 12 am es sábado (HN); de 12 am a 5 am ya es domingo: horas <b>nocturnas dominicales completas</b> (HND), porque la base del turno es la del sábado.`,
String.raw`<b>Licencia no remunerada (art. 51):</b> suspende el contrato. El día 30 no se paga; el 31 <b>resta 7 horas</b>, porque el salario mensual ya lo incluía. No afecta ningún domingo del mes.`],
sol:String.raw`<ol class="steps"><li><b>Lunes a viernes</b> (10 pm – 6 am, 8 horas): las primeras 7 son nocturnas ordinarias (7 HN) y la última, de 5 a 6 am, es extra nocturna (1 HEN). Son 20 turnos: días 1–4, 8–11, 14–18, 21–25, 28 y 29.</li>
<li><b>Sábados</b> 5, 12, 19 y 26 (10 pm – 5 am, 7 horas, sin extras): 2 HN del sábado y 5 HND del domingo. Por los cuatro sábados: 8 HN y 20 HND.</li>
<li><b>Domingos 6, 13, 20 y 27:</b> descanso dominical remunerado, 7 HD cada uno, porque cumplió cada semana (el festivo del lunes 7 cuenta como día trabajado). <b>Festivo lunes 7:</b> 7 HD (art. 177). Total descansos: 35 HD.</li>
<li><b>Licencia 30 y 31:</b> el 30 no suma y el 31 resta 7 HD: 35 − 7 = <b>28 HD</b>.</li>
<li><b>Totales del mes:</b>
<div class="tbl"><table><tr><th>Columna</th><th class="num">Horas</th><th class="num">Factor</th><th class="num">Valor</th></tr>
<tr><td>HD</td><td class="num">28</td><td class="num">1</td><td class="num">660.000,00</td></tr>
<tr><td>HN</td><td class="num">148</td><td class="num">1,35</td><td class="num">4.709.571,43</td></tr>
<tr><td>HEN</td><td class="num">20</td><td class="num">1,75</td><td class="num">825.000,00</td></tr>
<tr><td>HND</td><td class="num">20</td><td class="num">2,25</td><td class="num">1.060.714,29</td></tr>
<tr><td><b>Total</b></td><td></td><td></td><td class="num"><b>7.255.285,71</b></td></tr></table></div></li>
<li><b>Comprobación:</b> las horas base son 28 HD + 148 HN + 20 HND = 196 = 28 días × 7 (los 30 días del mes menos los 2 de licencia). Sin recargos ni extras habría ganado 4.950.000 × 28/30 = 4.620.000.</li></ol>
<p class="hint">No tiene auxilio de transporte: gana más de 2 SMMLV. Con la tabla del 75 % (la del taller de Pedro), el total sería $7.184.571,43. En el resolvedor puedes ver la planilla por quincenas o por el mes completo. El calendario real de 2026 es distinto (el 1 de octubre es jueves y el festivo es el 12); se usa el de la hoja del taller.</p>`,
res:String.raw`<p>Salario de octubre de 2026: <b>$7.255.285,71</b> (28 HD, 148 HN, 20 HEN y 20 HND), con la tabla del examen (90 %), jornada de 7 horas y nocturna desde las 7 pm.</p>`},

{id:"mar-2",n:"2",t:"Liquidación de las prestaciones sociales desde 2025",tipo:"Liquidación",temas:["prima","cesantias","liquidacion"],tool:{id:"liquidacion",pre:"mariana",lbl:"Abrir la liquidación de Mariana"},
enun:String.raw`<p>Liquide las prestaciones sociales a que tiene derecho Mariana, teniendo en cuenta que al momento de su retiro le adeudan todas las prestaciones desde 2025.</p>`,
saber:[String.raw`<b>Datos de 2025:</b> básico 3.725.000; devengó 3.725.000 de enero a abril y de junio a agosto; <b>mayo suspendida</b> por sanción (30 días); de septiembre a diciembre 3.900.000 por horas extras.`,
String.raw`<b>Datos de 2026:</b> básico 4.950.000; enero a marzo 4.950.000; <b>abril a junio suspendida</b> por razones técnicas (90 días); julio a septiembre 4.950.000; octubre <b>7.255.285,71</b> (punto 1) con 2 días de licencia.`,
String.raw`<b>Sin auxilio de transporte:</b> en 2025 y 2026 su básico supera 2 SMMLV (2.847.000 y 3.501.810).`,
String.raw`<b>Base (como en clase):</b> si los tres últimos meses del periodo son iguales, el salario de ese mes; si no, el promedio de todos los meses del periodo, con los meses suspendidos en 0. Si alguno de los tres últimos está suspendido, ya no son iguales.`,
String.raw`<b>Fórmulas:</b> prima y cesantías = base × (días − días art. 51) / 360; intereses = cesantías × días × 12 % / 360. <b>Moras:</b> un día de salario básico del periodo (truncado) por cada día de retraso hasta el retiro: primas desde el 1 de julio y el 21 de diciembre, cesantías desde el 15 de febrero; intereses no pagados al 31 de enero se pagan dobles.`],
sol:String.raw`<h5>2025 (básico 3.725.000 → diario 124.166)</h5><ol class="steps">
<li><b>Prima 1:</b> 1/1/25 – 30/6/25 = 180 − 30 (mayo) = 150 días. Abril, mayo y junio no son iguales (mayo vale 0): base = (5 × 3.725.000 + 0)/6 = 3.104.166,67. 3.104.166,67 × 150/360 = <b>1.293.403</b>. Mora: 1/7/25 – 31/10/26 = 480 × 124.166 = <b>59.599.680</b>.</li>
<li><b>Prima 2:</b> 1/7/25 – 31/12/25 = 180 días. Octubre a diciembre son iguales: 3.900.000 × 180/360 = <b>1.950.000</b>. Mora: 21/12/25 – 31/10/26 = 310 × 124.166 = <b>38.491.460</b>. <i>La base de la prima es 3.900.000 porque incluye las horas extra, pero la mora se calcula con el salario básico, 3.725.000 / 30 = 124.166, sin las extras.</i></li>
<li><b>Cesantías:</b> 1/1/25 – 31/12/25 = 360 − 30 = 330 días. Base 3.900.000: 3.900.000 × 330/360 = <b>3.575.000</b>. No se consignaron: mora 15/2/26 – 31/10/26 = 256 × 124.166 = <b>31.786.496</b> (también con el básico, no con los 3.900.000).</li>
<li><b>Intereses:</b> 3.575.000 × 330 × 12 % / 360 = <b>393.250</b>; no se pagaron al 31 de enero de 2026, así que la sanción es otro tanto: <b>393.250</b>.</li></ol>
<h5>2026 (básico 4.950.000 → diario 165.000)</h5><ol class="steps">
<li><b>Prima 1:</b> 1/1/26 – 30/6/26 = 180 − 90 = 90 días. Abril a junio están suspendidos: base = (3 × 4.950.000 + 0 + 0 + 0)/6 = 2.475.000. 2.475.000 × 90/360 = <b>618.750</b>. Mora: 1/7/26 – 31/10/26 = 120 × 165.000 = <b>19.800.000</b>.</li>
<li><b>Prima 2:</b> 1/7/26 – 31/10/26 = 120 − 2 = 118 días. Base = (3 × 4.950.000 + 7.255.285,71)/4 = 5.526.321,43. 5.526.321,43 × 118/360 = <b>1.811.405</b>, con la liquidación.</li>
<li><b>Cesantías:</b> 1/1/26 – 31/10/26 = 300 − 92 = 208 días. Base = (6 × 4.950.000 + 3 × 0 + 7.255.285,71)/10 = 3.695.528,57. 3.695.528,57 × 208/360 = <b>2.135.194</b>, con la liquidación.</li>
<li><b>Intereses:</b> 2.135.194 × 208 × 12 % / 360 = <b>148.040</b>, con la liquidación.</li></ol>
<h5>Resumen</h5><div class="tbl"><table><tr><th>Concepto</th><th class="num">Valor</th></tr>
<tr><td>Primas (cuatro semestres)</td><td class="num">5.673.558</td></tr><tr><td>Cesantías 2025 y 2026</td><td class="num">5.710.194</td></tr><tr><td>Intereses sobre cesantías</td><td class="num">541.290</td></tr>
<tr><td><b>Prestaciones sociales</b></td><td class="num"><b>11.925.042</b></td></tr>
<tr><td>Mora de las primas</td><td class="num">117.891.140</td></tr><tr><td>Mora por no consignar las cesantías de 2025</td><td class="num">31.786.496</td></tr><tr><td>Sanción por no pagar los intereses de 2025</td><td class="num">393.250</td></tr>
<tr><td><b>Total con moras y sanciones</b></td><td class="num"><b>161.995.928</b></td></tr></table></div>
<p class="hint"><b>Supuestos que conviene confirmar con la profesora:</b> (1) en la prima 1 de 2026 los tres últimos meses están suspendidos; aquí se usa el promedio con ceros, como hizo ella con Pedro. Si se tomara el salario de 4.950.000, la prima daría 1.237.500. (2) La licencia del 30 y el 31 se cuenta como 2 días del art. 51. (3) La mora se liquida con el básico del año que se debe. Las vacaciones no son prestación social: van aparte (punto extra).</p>`,
res:String.raw`<p>Prestaciones adeudadas: <b>$11.925.042</b> (primas 5.673.558, cesantías 5.710.194 e intereses 541.290). Con las moras y la sanción por intereses, el total es <b>$161.995.928</b>.</p>`},

{id:"mar-3",n:"3",t:"Indemnización por despido sin justa causa (contrato a término fijo)",tipo:"Prórrogas e indemnización",temas:["prorrogas","indemnizaciones"],tool:{id:"indemnizaciones",pre:"mariana",lbl:"Abrir la indemnización de Mariana"},
enun:String.raw`<p>Realice la indemnización por despido sin justa causa a que tiene derecho Mariana.</p>`,
saber:[String.raw`Pedir una licencia no remunerada no es una justa causa (art. 62): el despido es <b>sin justa causa</b>.`,
String.raw`<b>Art. 64, término fijo:</b> se paga el salario del tiempo que falte para que venza el período (o la prórroga) que estaba corriendo.`,
String.raw`<b>Art. 46:</b> un contrato de menos de un año se prorroga hasta tres veces por el mismo tiempo; desde la cuarta prórroga, cada renovación es de un año.`,
String.raw`<b>Duración con el año de 360:</b> 8 meses y 15 días = 8 × 30 + 15 = 255 días.`],
sol:String.raw`<ol class="steps"><li><b>Períodos del contrato</b> (255 días cada uno, contando el primero):
<div class="tbl"><table><tr><th>Período</th><th>Desde</th><th>Hasta</th></tr>
<tr><td>Inicial</td><td>8/11/2023</td><td>22/7/2024</td></tr><tr><td>1.ª prórroga</td><td>23/7/2024</td><td>7/4/2025</td></tr><tr><td>2.ª prórroga</td><td>8/4/2025</td><td>22/12/2025</td></tr><tr><td>3.ª prórroga</td><td>23/12/2025</td><td>7/9/2026</td></tr><tr><td><b>4.ª prórroga (1 año)</b></td><td>8/9/2026</td><td><b>7/9/2027</b></td></tr></table></div></li>
<li><b>Al despido</b> (31/10/2026) corría la 4.ª prórroga, que vencía el 7 de septiembre de 2027.</li>
<li><b>Días que faltaban:</b> del 1/11/2026 al 7/9/2027 = días360(31/10/26, 7/9/27) = 360 − 30 − 23 = <b>307 días</b>.</li>
<li><b>Salario diario:</b> 4.950.000 / 30 = 165.000.</li>
<li><b>Indemnización:</b> 307 × 165.000 = <b>$50.655.000</b>.</li></ol>
<p class="hint">Si los períodos se cuentan con el calendario (8 meses del calendario y 15 días corridos), la 4.ª prórroga vence el 5/9/2027: 305 días × 165.000 = $50.325.000. Las suspensiones no alargan el plazo del contrato. <button class="btn" type="button" data-tool="prorrogas" data-pre="mariana">Ver las prórrogas de Mariana</button></p>`,
res:String.raw`<p>Indemnización por despido sin justa causa: <b>$50.655.000</b> (307 días de salario que faltaban para el 7 de septiembre de 2027).</p>`},

{id:"mar-4",n:"4",t:"Vacaciones adeudadas desde el inicio del contrato",tipo:"Vacaciones",temas:["vacaciones"],tool:{id:"vacaciones",pre:"mariana",lbl:"Abrir las vacaciones de Mariana"},
enun:String.raw`<p>Las vacaciones se le adeudan desde el inicio del contrato. ¿Cuánto se le paga al terminar? Evalúe tres escenarios: (1) nunca ha salido a vacaciones, (2) le dieron 2 períodos, (3) le dieron todos los períodos.</p>`,
saber:[String.raw`15 días hábiles por año de servicio; al terminar, las no disfrutadas se compensan en dinero proporcionalmente (art. 189). Se descuentan las suspensiones del art. 51 (art. 53).`,String.raw`Fórmula de clase: vacaciones = salario × (días − días del art. 51) / 720, con el último salario devengado: el de octubre de 2026, $7.255.285,71 (salario diario $241.842,86).`],
sol:String.raw`<ol class="steps"><li><b>Días del contrato:</b> días360(8/11/23, 31/10/26) + 1 = 1.073. Menos 122 del art. 51 (30 + 90 + 2) = <b>951 días trabajados</b>, que dan 951 × 15 / 360 = 39,625 días hábiles.</li>
<li><b>Escenario 1 (nunca salió):</b> 7.255.285,71 × (1.073 − 122) / 720 = 7.255.285,71 × 951 / 720 = <b>$9.583.023</b>.</li>
<li><b>Escenario 2 (disfrutó 2 períodos):</b> cada período son 360 días trabajados (15 días hábiles). Queda 951 − 720 = 231: 7.255.285,71 × 231 / 720 = <b>$2.327.737</b> (o 9,625 días × 241.842,86).</li>
<li><b>Escenario 3 (todos los períodos):</b> con 951 días solo completó 2 períodos. Si «todos» son los períodos completos, se debe la misma fracción del escenario 2 ($2.327.737); si también disfrutó la fracción del tercer año, no se debe nada.</li></ol>`,
res:String.raw`<p>Escenario 1: <b>$9.583.023</b>. Escenario 2: <b>$2.327.737</b>. Escenario 3: la fracción pendiente ($2.327.737) o $0 si también la disfrutó.</p>`}]});


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
