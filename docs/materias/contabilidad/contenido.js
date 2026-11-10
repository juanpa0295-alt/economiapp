// Contabilidad y Análisis Financiero · contenido de la ruta (programa 1501874)
// =====================================================================
// CONTENIDO: Contabilidad y Análisis Financiero (1501874, U. de Antioquia).
// Bibliografía del programa: Meigs et al. (2000), Sinisterra (2001), Guajardo, Carvalho (2004),
// García (1999), Ortiz (2002), Correa (Análisis financiero); marco normativo colombiano.
// =====================================================================
const GUIA_ID="cy";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · La normatividad",2:"Unidad 2 · Elementos introductorios",3:"Unidad 3 · Información económica y financiera",4:"Unidad 4 · Análisis e interpretación"};
const P1="Unidad 1 · La normatividad",P2="Unidad 2 · Elementos introductorios",P3="Unidad 3 · Información económica y financiera",P4="Unidad 4 · Análisis e interpretación de la situación financiera";
const TRUNK=[
{id:"normas", parte:P1, u:1, t:"Las normas que rigen la contabilidad en Colombia", sim:"tarjetas", html:String.raw`
<section><h3>Cuatro tipos de norma</h3><ul><li><b>Comercial</b> (Código de Comercio, 1971): obliga a los comerciantes a llevar contabilidad, registrar libros, conservar los soportes y presentar estados financieros.</li><li><b>Societaria</b>: tipos de sociedad (anónima, limitada, en comandita, colectiva y, desde la Ley 1258 de 2008, la sociedad por acciones simplificada, S.A.S.), aportes, reservas, reparto de utilidades y la supervisión de la Superintendencia de Sociedades.</li><li><b>Fiscal</b> (Estatuto Tributario): reglas para determinar la base de los impuestos (renta, IVA, retención en la fuente). Lo fiscal y lo contable pueden diferir, lo que genera <b>diferencias temporarias</b> e impuesto diferido.</li><li><b>Contable</b>: los principios para reconocer, medir, presentar y revelar los hechos económicos.</li></ul></section>
<section><h3>De los decretos de 1993 a las NIIF</h3><p class="lead">El programa del curso cita el <b>Decreto 2649 de 1993</b> (principios de contabilidad generalmente aceptados en Colombia) y el <b>Decreto 2650 de 1993</b> (Plan Único de Cuentas, PUC). Con la <b>Ley 1314 de 2009</b> Colombia convergió a los estándares internacionales, y el <b>Decreto 2420 de 2015</b> (decreto único reglamentario) recoge hoy las normas de información financiera por grupos:</p><ul><li><b>Grupo 1</b>: NIIF plenas (emisores de valores, entidades de interés público, empresas grandes).</li><li><b>Grupo 2</b>: NIIF para las pymes.</li><li><b>Grupo 3</b>: contabilidad simplificada para microempresas.</li></ul><p>El PUC sigue usándose como catálogo de cuentas para organizar los registros, aunque los estados financieros se preparan con el marco que corresponda.</p></section>
<section><h3>La estructura del catálogo de cuentas (PUC)</h3><div class="tbl"><table><tr><th>Clase</th><th>Nombre</th><th>Naturaleza</th></tr><tr><td>1</td><td>Activo</td><td>Débito</td></tr><tr><td>2</td><td>Pasivo</td><td>Crédito</td></tr><tr><td>3</td><td>Patrimonio</td><td>Crédito</td></tr><tr><td>4</td><td>Ingresos</td><td>Crédito</td></tr><tr><td>5</td><td>Gastos</td><td>Débito</td></tr><tr><td>6</td><td>Costos de ventas</td><td>Débito</td></tr><tr><td>7</td><td>Costos de producción</td><td>Débito</td></tr></table></div><p>El código crece de izquierda a derecha: clase (1 dígito), grupo (2), cuenta (4) y subcuenta (6). Por ejemplo, 1 activo, 11 disponible, 1105 caja, 110505 caja general.</p></section>
${LAB}`},

{id:"ecuacion", parte:P2, u:2, t:"La ecuación contable y la partida doble", sim:"partida", html:String.raw`
<section><h3>Contabilidad y finanzas</h3><p class="lead">La contabilidad es el sistema que <b>registra</b>, clasifica y resume los hechos económicos de una entidad para producir información útil. Las finanzas <b>usan</b> esa información para decidir (invertir, financiarse, repartir). Un buen análisis financiero empieza por entender cómo se construyen las cifras.</p></section>
<section><h3>La ecuación contable</h3><div class="mj">\[\text{Activo}=\text{Pasivo}+\text{Patrimonio}\]</div><p>Los activos son los recursos que controla la entidad; los pasivos, las obligaciones con terceros; el patrimonio, la parte residual de los dueños. Los ingresos aumentan el patrimonio y los gastos lo disminuyen, por lo que durante el periodo: \(A=P+Pt+I-G\).</p></section>
<section><h3>Partida doble</h3><p>Todo hecho económico afecta al menos dos cuentas, y la suma de los <b>débitos</b> es igual a la de los <b>créditos</b>. Debitar es registrar en la columna izquierda de la cuenta; acreditar, en la derecha. Las cuentas de naturaleza débito (activos, gastos, costos) aumentan con débitos; las de naturaleza crédito (pasivos, patrimonio, ingresos) aumentan con créditos.</p>
<div class="tbl"><table><tr><th>Hecho</th><th>Débito</th><th>Crédito</th></tr><tr><td>Los socios aportan 50 millones en efectivo</td><td>Bancos</td><td>Capital social</td></tr><tr><td>Compra de mercancía a crédito</td><td>Inventarios</td><td>Proveedores</td></tr><tr><td>Venta de contado</td><td>Caja</td><td>Ingresos por ventas</td></tr><tr><td>Pago de arriendo</td><td>Gasto de arrendamientos</td><td>Bancos</td></tr></table></div></section>
<section><h3>Del diario a los estados financieros</h3><p>El <b>libro diario</b> registra los asientos en orden cronológico; el <b>libro mayor</b> los agrupa por cuenta («cuentas T»); el <b>balance de prueba</b> lista los saldos para comprobar que débitos = créditos; tras los <b>ajustes</b> y el <b>cierre</b> de las cuentas de resultado contra la utilidad del ejercicio, se preparan los estados financieros.</p></section>
${LAB}`},

{id:"ajustes", parte:P2, u:2, t:"Ajustes: depreciación y causaciones", sim:"depre", html:String.raw`
<section><h3>Base de acumulación (causación)</h3><p class="lead">Los ingresos y gastos se reconocen cuando ocurren, no cuando se cobran o se pagan. Al cierre del periodo se hacen <b>ajustes</b>: gastos causados por pagar (servicios, intereses, nómina y prestaciones), ingresos causados por cobrar, gastos pagados por anticipado que se amortizan, ingresos recibidos por anticipado, deterioro de cartera y depreciación.</p></section>
<section><h3>Depreciación</h3><p>Reparte el costo de un activo de propiedad, planta y equipo entre los periodos que lo usa. Se registra con un débito al gasto de depreciación y un crédito a la depreciación acumulada (que resta del activo). Base depreciable = costo − valor residual.</p><ul><li><b>Línea recta</b>: igual cada año, base/vida útil.</li><li><b>Suma de los dígitos de los años</b>: acelerada; en el año \(t\) se deprecia \(\frac{n-t+1}{n(n+1)/2}\) de la base.</li><li><b>Reducción de saldos</b>: una tasa fija sobre el valor en libros; con tasa \(1-(VR/C)^{1/n}\) termina en el valor residual.</li><li><b>Unidades de producción</b>: según el uso.</li></ul><p>El método debe reflejar el patrón de consumo de los beneficios del activo. Para efectos fiscales, el Estatuto Tributario fija tasas máximas anuales.</p></section>
${LAB}`},

{id:"inventarios", parte:P2, u:2, t:"Inventarios y costo de ventas", sim:"kardex", html:String.raw`
<section><h3>Sistemas de inventario</h3><p class="lead">En el <b>sistema permanente</b> cada compra y venta se registra en la tarjeta de <b>kárdex</b>, y el costo de ventas se conoce en cada venta. En el <b>periódico</b>, el costo de ventas se calcula al final: inventario inicial + compras − inventario final.</p></section>
<section><h3>Métodos de valoración</h3><ul><li><b>Promedio ponderado</b>: cada salida se valora al costo promedio vigente, que se recalcula con cada entrada.</li><li><b>PEPS</b> (primeras en entrar, primeras en salir): las salidas se valoran con los lotes más antiguos; el inventario final queda a los costos más recientes.</li><li><b>UEPS</b> (últimas en entrar, primeras en salir): no se permite bajo NIIF.</li></ul><p>Con precios crecientes, PEPS da menor costo de ventas, mayor utilidad y mayor inventario final que el promedio. Bajo NIIF los inventarios se miden al menor entre el costo y el valor neto realizable.</p></section>
${LAB}`},

{id:"estados", parte:P3, u:3, t:"Los estados financieros", sim:"resultados", html:String.raw`
<section><h3>Estados de propósito general</h3><p class="lead">Un juego completo comprende:</p><ol><li><b>Estado de situación financiera</b> (balance general): activos, pasivos y patrimonio en una fecha. Los activos y pasivos se clasifican en corrientes (se realizan en el ciclo de operación o en 12 meses) y no corrientes.</li><li><b>Estado de resultados</b> (y otro resultado integral): ingresos, costos y gastos de un periodo.</li><li><b>Estado de cambios en el patrimonio</b>.</li><li><b>Estado de flujos de efectivo</b>.</li><li><b>Notas</b>: políticas contables y revelaciones.</li></ol><p>Los de <b>propósito especial</b> se preparan para usuarios concretos: estados de liquidación, de inventario, presentados a entidades de crédito o al Estado. Otros informes: proyectados, consolidados, por segmentos.</p></section>
<section><h3>La estructura del estado de resultados</h3><div class="eq al">Ventas netas − costo de ventas = <b>utilidad bruta</b><br>− gastos de administración y de ventas = <b>utilidad operacional</b> (UAII)<br>+ otros ingresos − gastos financieros y otros = <b>utilidad antes de impuestos</b><br>− impuesto de renta = <b>utilidad neta</b></div><p>El <b>EBITDA</b> es la utilidad operacional antes de depreciaciones y amortizaciones: aproxima la caja que genera la operación.</p></section>
${LAB}`},

{id:"flujo", parte:P3, u:3, t:"El estado de flujos de efectivo", sim:"efectivo", html:String.raw`
<section><h3>Por qué utilidad no es caja</h3><p class="lead">Una empresa puede tener utilidades y quedarse sin efectivo: vende a crédito, acumula inventarios o invierte en activos. El estado de flujos de efectivo explica el cambio del efectivo en tres actividades:</p><ul><li><b>Operación</b>: el efectivo de la actividad principal.</li><li><b>Inversión</b>: compra y venta de activos de largo plazo.</li><li><b>Financiación</b>: préstamos, pagos de deuda, aportes de capital y dividendos.</li></ul></section>
<section><h3>Método indirecto</h3><div class="eq al">Utilidad neta<br>+ depreciaciones y amortizaciones (no son salida de efectivo)<br>− aumento de cuentas por cobrar y de inventarios (+ si disminuyen)<br>+ aumento de proveedores y cuentas por pagar (− si disminuyen)<br>= flujo de efectivo de operación</div><p>La suma de los tres flujos debe igualar el cambio del efectivo entre los dos balances. Esa comprobación es la mejor forma de detectar errores.</p></section>
${LAB}`},

{id:"vertical", parte:P4, u:4, t:"Análisis vertical y horizontal", sim:"vh", html:String.raw`
<section><h3>Objetivos y usuarios</h3><p class="lead">El análisis financiero convierte las cifras en juicios: ¿la empresa puede pagar sus deudas?, ¿es rentable?, ¿cómo se financia?, ¿genera efectivo? Lo usan los dueños, la gerencia, los acreedores, el Estado y los inversionistas, cada uno con su pregunta.</p></section>
<section><h3>Vertical y horizontal</h3><ul><li><b>Análisis vertical</b>: cada partida como porcentaje de una base del mismo periodo (el activo total en el balance, las ventas en el estado de resultados). Muestra la estructura.</li><li><b>Análisis horizontal</b>: variación absoluta y relativa de cada partida entre periodos. Muestra la tendencia.</li></ul><p>Se leen juntos: si las ventas crecen 10 % y la cartera 30 %, la empresa está financiando a sus clientes. Para comparar años con inflación alta conviene deflactar.</p></section>
${LAB}`},

{id:"indicadores", parte:P4, u:4, t:"Liquidez, actividad, endeudamiento y rentabilidad", sim:"razones", html:String.raw`
<section><h3>Las cuatro familias de indicadores</h3><div class="tbl"><table><tr><th>Familia</th><th>Indicador</th><th>Fórmula</th></tr>
<tr><td rowspan="3">Liquidez</td><td>Razón corriente</td><td>Activo corriente / pasivo corriente</td></tr><tr><td>Prueba ácida</td><td>(Activo corriente − inventarios) / pasivo corriente</td></tr><tr><td>Capital de trabajo neto</td><td>Activo corriente − pasivo corriente</td></tr>
<tr><td rowspan="4">Actividad</td><td>Rotación de cartera</td><td>Ventas a crédito / cuentas por cobrar promedio; días = 360/rotación</td></tr><tr><td>Rotación de inventarios</td><td>Costo de ventas / inventario promedio</td></tr><tr><td>Rotación de proveedores</td><td>Compras / proveedores promedio</td></tr><tr><td>Ciclo de efectivo</td><td>Días de cartera + días de inventario − días de proveedores</td></tr>
<tr><td rowspan="3">Endeudamiento</td><td>Nivel de endeudamiento</td><td>Pasivo total / activo total</td></tr><tr><td>Apalancamiento</td><td>Pasivo total / patrimonio</td></tr><tr><td>Cobertura de intereses</td><td>UAII (o EBITDA) / gastos financieros</td></tr>
<tr><td rowspan="4">Rentabilidad</td><td>Margen bruto, operacional y neto</td><td>Utilidad / ventas</td></tr><tr><td>ROA (rentabilidad del activo)</td><td>UAII / activo o utilidad neta / activo</td></tr><tr><td>ROE (rentabilidad del patrimonio)</td><td>Utilidad neta / patrimonio</td></tr><tr><td>Du Pont</td><td>ROE = margen neto × rotación del activo × multiplicador del capital</td></tr></table></div></section>
<section><h3>Cómo interpretarlos</h3><p>Ningún indicador es bueno o malo en abstracto: se compara con la historia de la empresa, con el sector y con su estrategia. Una razón corriente muy alta puede indicar exceso de recursos ociosos; un endeudamiento alto es aceptable si la rentabilidad del activo supera el costo de la deuda. El <b>informe gerencial</b> integra los indicadores en un diagnóstico breve: qué pasó, por qué y qué hacer.</p><p>Con la visión de García (1999): la productividad del capital de trabajo (KTNO/ventas) y la del activo fijo explican si el crecimiento genera o consume caja.</p></section>
${LAB}`}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"normas",links:["normas","ecuacion","estados"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"indicadores",links:["ecuacion","inventarios","flujo","indicadores"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"indicadores",links:["estados","vertical","indicadores"],sim:"abiertas",html:WSBOX,d:"Preguntas de análisis con esquema de respuesta."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"indicadores",links:["ajustes","inventarios","flujo","indicadores"],sim:"hoja",html:WSBOX,d:"Fórmulas e indicadores del curso."}];
const ALIAS={};
const GL=[
{u:1,t:"Ley 1314 de 2009",d:"Ley que ordenó la convergencia de la contabilidad colombiana hacia estándares internacionales."},
{u:1,t:"Decreto 2420 de 2015",d:"Decreto único reglamentario de las normas de contabilidad, información financiera y aseguramiento."},
{u:1,t:"Decreto 2649 de 1993",d:"Antiguo reglamento de los principios de contabilidad en Colombia, citado en el programa."},
{u:1,t:"PUC",d:"Plan Único de Cuentas (Decreto 2650 de 1993): catálogo de cuentas por clase, grupo, cuenta y subcuenta."},
{u:1,t:"NIIF para pymes",d:"Marco técnico del grupo 2."},
{u:1,t:"Diferencia temporaria",d:"Diferencia entre el valor contable y el fiscal de un activo o pasivo que se revierte en el tiempo."},
{u:2,t:"Activo",d:"Recurso controlado por la entidad, del que se esperan beneficios económicos."},
{u:2,t:"Pasivo",d:"Obligación presente que se espera liquidar con salida de recursos."},
{u:2,t:"Patrimonio",d:"Parte residual de los activos tras deducir los pasivos."},
{u:2,t:"Partida doble",d:"Cada hecho afecta al menos dos cuentas y los débitos igualan a los créditos."},
{u:2,t:"Naturaleza de una cuenta",d:"Lado en que aumenta: débito para activos, gastos y costos; crédito para pasivos, patrimonio e ingresos."},
{u:2,t:"Balance de prueba",d:"Lista de saldos de las cuentas para comprobar que débitos y créditos son iguales."},
{u:2,t:"Causación",d:"Reconocer ingresos y gastos cuando ocurren, no cuando se cobran o pagan."},
{u:2,t:"Depreciación",d:"Distribución sistemática del costo de un activo durante su vida útil."},
{u:2,t:"Valor residual",d:"Valor que se espera obtener del activo al final de su vida útil."},
{u:2,t:"Kárdex",d:"Tarjeta de control de entradas, salidas y saldos de un inventario."},
{u:2,t:"PEPS",d:"Las primeras unidades en entrar son las primeras en salir."},
{u:2,t:"Promedio ponderado",d:"Las salidas se valoran al costo promedio de las unidades disponibles."},
{u:2,t:"Valor neto realizable",d:"Precio estimado de venta menos los costos para terminar y vender."},
{u:3,t:"Estado de situación financiera",d:"Activos, pasivos y patrimonio en una fecha."},
{u:3,t:"Estado de resultados",d:"Ingresos, costos y gastos de un periodo."},
{u:3,t:"Utilidad operacional",d:"Utilidad bruta menos gastos de administración y ventas (UAII)."},
{u:3,t:"EBITDA",d:"Utilidad operacional antes de depreciaciones y amortizaciones."},
{u:3,t:"Flujo de efectivo de operación",d:"Efectivo generado por la actividad principal."},
{u:3,t:"Método indirecto",d:"Parte de la utilidad neta y la ajusta por partidas que no son efectivo y por cambios en el capital de trabajo."},
{u:3,t:"Notas a los estados financieros",d:"Políticas contables y revelaciones que explican las cifras."},
{u:4,t:"Análisis vertical",d:"Cada partida como porcentaje de una base del mismo periodo."},
{u:4,t:"Análisis horizontal",d:"Variación de cada partida entre periodos."},
{u:4,t:"Razón corriente",d:"Activo corriente / pasivo corriente."},
{u:4,t:"Prueba ácida",d:"(Activo corriente − inventarios) / pasivo corriente."},
{u:4,t:"Ciclo de efectivo",d:"Días de cartera + días de inventario − días de proveedores."},
{u:4,t:"Endeudamiento",d:"Pasivo total / activo total."},
{u:4,t:"ROE",d:"Utilidad neta / patrimonio."},
{u:4,t:"Du Pont",d:"ROE = margen neto × rotación del activo × multiplicador del capital."},
{u:4,t:"KTNO",d:"Capital de trabajo neto operativo: cartera + inventarios − proveedores."}];
const MCQ=[
{u:1,q:"La ley que ordenó la convergencia a estándares internacionales en Colombia es:",o:["Ley 1258 de 2008","Ley 1314 de 2009","Decreto 2649 de 1993","Ley 100 de 1993"],ok:1,e:"La 1258 creó la S.A.S."},
{u:1,q:"En el PUC, la clase 4 corresponde a:",o:["Gastos","Ingresos","Pasivos","Costos de ventas"],ok:1,e:"1 activo, 2 pasivo, 3 patrimonio, 4 ingresos, 5 gastos, 6 costos de ventas."},
{u:1,q:"Una microempresa del grupo 3 aplica:",o:["NIIF plenas","NIIF para pymes","Contabilidad simplificada","Ninguna norma"],ok:2,e:"Marco del grupo 3."},
{u:2,q:"La compra de mercancía a crédito:",o:["Aumenta activos y patrimonio","Aumenta activos y pasivos","Disminuye activos","Aumenta ingresos"],ok:1,e:"Débito inventarios, crédito proveedores."},
{u:2,q:"Las cuentas de pasivo aumentan con:",o:["Débitos","Créditos","Ambos","Ninguno"],ok:1,e:"Su naturaleza es crédito."},
{u:2,q:"El pago de un gasto de arriendo se registra con:",o:["Débito bancos, crédito gasto","Débito gasto, crédito bancos","Débito gasto, crédito capital","Débito capital, crédito bancos"],ok:1,e:"El gasto aumenta y el efectivo disminuye."},
{u:2,q:"Un activo de 10 millones, valor residual 1 millón y 5 años de vida, por línea recta se deprecia cada año:",o:["2 millones","1,8 millones","2,2 millones","1 millón"],ok:1,e:"(10 − 1)/5 = 1,8."},
{u:2,q:"Con suma de dígitos y n = 4, el primer año se deprecia:",o:["1/4 de la base","4/10 de la base","1/10 de la base","3/10 de la base"],ok:1,e:"La suma de dígitos es 10."},
{u:2,q:"Con precios crecientes, PEPS frente al promedio ponderado da:",o:["Mayor costo de ventas","Menor utilidad","Mayor inventario final","Igual resultado"],ok:2,e:"El inventario queda a los costos recientes."},
{u:2,q:"Bajo NIIF, el método UEPS:",o:["Es obligatorio","Está permitido","No está permitido","Solo para pymes"],ok:2,e:"La NIC 2 lo prohibió."},
{u:3,q:"La utilidad operacional es:",o:["Ventas − costo de ventas","Utilidad bruta − gastos de administración y ventas","Utilidad neta + impuestos","EBITDA − intereses"],ok:1,e:"También se llama UAII."},
{u:3,q:"En el método indirecto, un aumento de cuentas por cobrar:",o:["Se suma a la utilidad","Se resta de la utilidad","No afecta","Va en financiación"],ok:1,e:"Ventas que no se han cobrado."},
{u:3,q:"El pago de dividendos es una actividad de:",o:["Operación","Inversión","Financiación","Ninguna"],ok:2,e:"Relación con los dueños."},
{u:3,q:"La depreciación se suma en el flujo de operación porque:",o:["Es un ingreso","No implica salida de efectivo","Es un activo","Es un impuesto"],ok:1,e:"Ya se restó en la utilidad sin mover caja."},
{u:4,q:"Una razón corriente de 0,8 indica:",o:["Holgura de liquidez","Que los activos corrientes no cubren los pasivos corrientes","Alta rentabilidad","Bajo endeudamiento"],ok:1,e:"Capital de trabajo negativo."},
{u:4,q:"Si las ventas suben 10 % y la cartera 30 %, probablemente:",o:["Mejoró el cobro","La empresa está financiando más a sus clientes","Bajó el inventario","Subió la rentabilidad"],ok:1,e:"Aumentan los días de cartera."},
{u:4,q:"Con margen neto 5 %, rotación del activo 2 y multiplicador 1,5, el ROE es:",o:["8,5 %","15 %","10 %","3,3 %"],ok:1,e:"0,05 × 2 × 1,5 = 15 %."},
{u:4,q:"El ciclo de efectivo con 45 días de cartera, 60 de inventario y 30 de proveedores es:",o:["135 días","75 días","105 días","15 días"],ok:1,e:"45 + 60 − 30 = 75."},
{u:4,q:"El análisis vertical del balance usa como base:",o:["Las ventas","El activo total","El patrimonio","La utilidad neta"],ok:1,e:"En el estado de resultados, las ventas."},
{u:4,q:"El endeudamiento alto es aceptable cuando:",o:["La rentabilidad del activo supera el costo de la deuda","Las ventas caen","No hay utilidades","El patrimonio es negativo"],ok:0,e:"Apalancamiento favorable."}];
const ABIERTAS=[
{u:1,q:"Explique la relación entre la norma contable y la norma fiscal y por qué sus resultados pueden diferir.",a:["Objetivos distintos: información útil frente a recaudo.","Ejemplos: depreciación, deterioro, provisiones.","Diferencias temporarias e impuesto diferido.","Conciliación fiscal."]},
{u:2,q:"Registre por partida doble cinco transacciones de una empresa nueva y muestre que se cumple la ecuación contable.",a:["Asientos con débitos y créditos.","Cuentas T.","Balance de prueba.","A = P + Pt + I − G."]},
{u:3,q:"Una empresa con utilidades se quedó sin efectivo. Explique las causas posibles usando el estado de flujos de efectivo.",a:["Cartera e inventarios crecientes.","Inversiones en activos fijos.","Pago de deudas o dividendos.","Diferencia entre causación y caja."]},
{u:4,q:"Elabore un informe gerencial breve a partir de los indicadores de una empresa: diagnóstico, causas y recomendaciones.",a:["Liquidez y ciclo de efectivo.","Endeudamiento y cobertura.","Rentabilidad con Du Pont.","Recomendaciones concretas."]}];
const TL=[];
