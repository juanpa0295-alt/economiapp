// Derecho Laboral y Constitucional · contenido de la ruta
// =====================================================================
// CONTENIDO: Derecho Laboral y Constitucional. Temas del curso: prórrogas, indemnizaciones y nómina/horas extras (CST).
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
<li>Pasa a años: \(\text{años}=\text{días}/360\).</li>
<li>Si trabajó un año o menos, le corresponden 30 días completos (20 si gana 10 SMMLV o más).</li>
<li>Si trabajó más: \(\text{días de indemnización}=30+20\,(\text{años}-1)\).</li>
<li>Multiplica por el salario diario: \(\text{salario}/30\).</li></ol>
<p><b>Ejemplo:</b> salario de $3.000.000, del 1 de enero de 2025 al 10 de mayo de 2026: 490 días = 1,361 años. Indemnización: \(30+20\cdot0{,}361=37{,}22\) días \(\times\$100.000=\$3.722.222\).</p></section>
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
qs:[{q:"Un trabajador gana el salario mínimo de 2026 y trabajó el mes completo sin extras. ¿Cuál es su neto?",a:"Devengado: 1.750.905 + 249.095 = $2.000.000. Deducciones: 8 % de 1.750.905 = $140.072,40. Neto: $1.859.927,60."}]}
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
 {id:"planilla",t:"Resolvedor del taller de horas extras",anchor:"jornada",links:["jornada","nomina"],sim:"planilla",html:String.raw`
<details class="pdet" open><summary><b>Reglas que aplica el resolvedor</b></summary>
<ol class="steps">
<li><b>Valor de la hora.</b> Salario / (jornada diaria × 30). Con 7 horas de lunes a sábado: salario / 210. En la planilla todo se paga por horas: el salario del mes es la suma de 7 horas por cada uno de los 30 días.</li>
<li><b>Cada día paga su jornada una sola vez.</b> O con las horas ordinarias que se trabajan ese día (HD, HN, HDD, HND), o con el descanso remunerado (7 HD).</li>
<li><b>Turnos.</b> Cada turno va en la fila del día en que empieza. Las primeras 7 horas del turno son ordinarias y las demás son extra; las extra siempre se pagan completas (HED, HEN, HEDD, HEND). La noche va de 7:00 p. m. a 6:00 a. m. (art. 160).</li>
<li><b>Turnos que cruzan la medianoche.</b> Cada franja se clasifica por el día en que cae. <b>Sábado → domingo:</b> lo que pasa de las 12 es dominical y se paga completo (HND o HDD), porque la base es la del sábado. <b>Domingo → lunes:</b> lo del lunes ya no es dominical; como la base de ese turno la pagó el descanso del domingo, las ordinarias del lunes llevan solo el recargo nocturno (RN), o nada si son de día.</li>
<li><b>Domingo o festivo trabajado con descanso pagado.</b> Se pagan 7 HD por el descanso y las horas ordinarias trabajadas llevan <b>solo el recargo</b>: RDD (0,90) de día y RND (1,25) de noche. Las extra van completas.</li>
<li><b>Domingo sin derecho a descanso</b> (sanción o licencia no remunerada en la semana): no hay 7 HD y las ordinarias trabajadas se pagan completas (HDD, HND).</li>
<li><b>Día 31.</b> El salario cubre 30 días: las ordinarias diurnas no suman, las nocturnas llevan solo el recargo (RN o RND) y las extra se pagan completas. Un descanso o una novedad el 31 no suma.</li>
<li><b>Descanso dominical (art. 172 y 173).</b> 7 HD si en la semana de lunes a sábado trabajó o faltó con justa causa; los festivos cuentan como trabajados. Si ingresó a mitad de semana, se paga proporcional a las horas: si por 42 horas se pagan 7, con \(h\) horas se pagan \(7\times h/42\). Cuentan las horas ordinarias de lunes a sábado (máximo 7 por día, sin las extra) y 7 por cada festivo, permiso o descanso remunerado. En el ejercicio 1: \(7\times28/42=4{,}67\) h. También se puede elegir la proporción por días. Se pierde si faltó por sanción o licencia no remunerada.</li>
<li><b>Novedades.</b> Descanso: todo descanso es remunerado (compensatorio), 7 HD. Permiso remunerado: 7 HD. Incapacidad por enfermedad general: los dos primeros días los paga el empleador a 2/3 del salario (art. 227), es decir 4,67 h, y nunca menos del mínimo. Sanción disciplinaria y licencia no remunerada: suspensión del contrato (art. 51); se resta el día, 0 h. Un festivo anterior al ingreso no se paga.</li>
</ol>
<p class="hint">Si tu profesor usa otra convención en algún punto (por ejemplo, que la sanción no quite el dominical o que la incapacidad se pague completa), cámbiala en los datos del mes.</p></details>
<div class="sim" id="sim"></div>`,
  d:"Escribe los turnos y las novedades del mes como vienen en el enunciado. El resolvedor llena la planilla del taller día por día (HD, HN, RN, HED, HEN, HDD, RDD, HND, RND, HEDD, HEND), dice cuándo solo se pagan los recargos, separa lo que pasa de medianoche a un domingo o festivo, y paga las dos quincenas. Trae cargados los dos ejercicios del taller."},
 {id:"valores",t:"Valores y porcentajes por fecha",anchor:"jornada",links:["prorrogas","indemnizaciones","jornada","nomina"],sim:"val",html:WSBOX,
  d:"El salario mínimo, el auxilio de transporte, la jornada máxima, el recargo dominical y la hora nocturna que aplican en cualquier fecha desde 2025."}
];
