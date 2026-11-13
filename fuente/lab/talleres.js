
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
saber:[String.raw`15 días hábiles por año de servicio; al terminar, las no disfrutadas se compensan en dinero proporcionalmente (art. 189). Se descuentan las suspensiones del art. 51 (art. 53).`,String.raw`Fórmula de clase: vacaciones = salario × (días − días del art. 51) / 720, con el último salario devengado (octubre de 2026, $7.255.285,71) <b>sin las horas extra</b> (art. 192): se restan las 20 HEN ($825.000); los recargos nocturnos y las horas dominicales sí entran. Base: 660.000 (HD) + 4.709.571,43 (HN) + 1.060.714,29 (HND) = <b>$6.430.285,71</b>; salario diario $214.342,86.`],
sol:String.raw`<ol class="steps"><li><b>Días del contrato:</b> días360(8/11/23, 31/10/26) + 1 = 1.073. Menos 122 del art. 51 (30 + 90 + 2) = <b>951 días trabajados</b>, que dan 951 × 15 / 360 = 39,625 días hábiles.</li>
<li><b>Escenario 1 (nunca salió):</b> 6.430.285,71 × (1.073 − 122) / 720 = 6.430.285,71 × 951 / 720 = <b>$8.493.336</b>.</li>
<li><b>Escenario 2 (disfrutó 2 períodos):</b> cada período son 360 días trabajados (15 días hábiles). Queda 951 − 720 = 231: 6.430.285,71 × 231 / 720 = <b>$2.063.050</b> (o 9,625 días × 214.342,86).</li>
<li><b>Escenario 3 (todos los períodos):</b> con 951 días solo completó 2 períodos. Si «todos» son los períodos completos, se debe la misma fracción del escenario 2 ($2.063.050); si también disfrutó la fracción del tercer año, no se debe nada.</li></ol>`,
res:String.raw`<p>Escenario 1: <b>$8.493.336</b>. Escenario 2: <b>$2.063.050</b>. Escenario 3: la fracción pendiente ($2.063.050) o $0 si también la disfrutó.</p>`}]});
