// ===================== DERECHO COMERCIAL AMPLIADO =====================
// Nueve estaciones nuevas o reescritas, el buscador CIIU y el glosario de normas. Se agrupan en tres partes.
(function(){
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
const del=id=>{const i=TRUNK.findIndex(t=>t.id===id);if(i>=0)TRUNK.splice(i,1)};
const soc=TRUNK.find(t=>t.id==="sociedades");
del("bienes");del("sociedades");
const NOTA=`<p class="hint">Contenido de estudio con base en la norma citada; no reemplaza la asesoría de un abogado para un caso concreto. Revisado a noviembre de 2026.</p>`;

ins("registro",[
{id:"formalizar", t:"Formalizar un negocio: persona natural o sociedad, RUT, CIIU y tamaño de empresa", html:String.raw`
<section><h3>Las dos formas de ser empresario</h3>
<div class="tbl"><table><tr><th></th><th>Persona natural comerciante</th><th>Sociedad (por ejemplo, SAS)</th></tr>
<tr><td>Quién responde por las deudas</td><td>La persona, con todo su patrimonio</td><td>La sociedad; los socios hasta el monto de sus aportes (salvo fraude, deudas tributarias en algunos tipos o garantías personales)</td></tr>
<tr><td>Cómo se crea</td><td>Matrícula mercantil en la cámara de comercio</td><td>Documento de constitución (privado en la SAS) inscrito en la cámara</td></tr>
<tr><td>Costo y trámites</td><td>Menores</td><td>Mayores: estatutos, libros de actas y de accionistas, contabilidad completa</td></tr>
<tr><td>Socios e inversión</td><td>No admite socios</td><td>Admite socios e inversionistas; se pueden vender acciones</td></tr>
<tr><td>Continuidad</td><td>Depende de la persona</td><td>La sociedad sigue aunque cambien los socios</td></tr></table></div>
<p>El comerciante matriculado debe matricular también cada <b>establecimiento de comercio</b> que abra, y renovar las dos matrículas cada año entre el 1 de enero y el 31 de marzo (art. 33 C. Co.). Quien no renueva puede recibir multas de la Superintendencia de Sociedades, y las matrículas que llevan cinco años sin renovarse se cancelan (Ley 1727 de 2014).</p></section>
<section><h3>La ruta para formalizarse</h3><ol class="steps">
<li><b>Consultar el nombre</b> en el RUES (Registro Único Empresarial y Social): no puede repetir uno ya matriculado (homonimia).</li>
<li><b>Escoger la actividad (código CIIU):</b> la principal y hasta tres más. <button class="btn" type="button" data-go="ciiu">Abrir el buscador CIIU →</button></li>
<li><b>Matricularse en la cámara de comercio</b> del domicilio: formulario RUES, documento de constitución si es sociedad y pago de los derechos de matrícula e impuesto de registro.</li>
<li><b>RUT (DIAN):</b> la cámara tramita el pre-RUT y la DIAN asigna el NIT. Ahí quedan las responsabilidades tributarias (renta, IVA, retención, régimen simple…).</li>
<li><b>Facturación electrónica</b> si se está obligado a facturar, habilitándose en la DIAN.</li>
<li><b>Registro de industria y comercio (ICA)</b> en la secretaría de hacienda del municipio, que fija la tarifa según la actividad.</li>
<li><b>Requisitos de funcionamiento</b> del establecimiento: uso del suelo permitido, condiciones sanitarias y de seguridad, y pagos por derechos de autor si se pone música (Ley 232 de 1995 y Decreto 1879 de 2008).</li>
<li><b>Seguridad social y nómina</b> si contrata trabajadores (es lo que se estudia en la parte laboral).</li></ol></section>
<section><h3>Tamaño de la empresa (Decreto 957 de 2019)</h3>
<p>Desde el 5 de diciembre de 2019 el tamaño se mide con un solo criterio: los <b>ingresos por actividades ordinarias anuales</b>, en UVT, según el sector.</p>
<div class="tbl"><table><tr><th>Tamaño</th><th>Manufactura</th><th>Servicios</th><th>Comercio</th></tr>
<tr><td>Micro</td><td>hasta 23.563 UVT</td><td>hasta 32.988 UVT</td><td>hasta 44.769 UVT</td></tr>
<tr><td>Pequeña</td><td>hasta 204.995 UVT</td><td>hasta 131.951 UVT</td><td>hasta 431.196 UVT</td></tr>
<tr><td>Mediana</td><td>hasta 1.736.565 UVT</td><td>hasta 483.034 UVT</td><td>hasta 2.160.692 UVT</td></tr>
<tr><td>Grande</td><td colspan="3">por encima del tope de mediana</td></tr></table></div>
<p>Si la actividad principal no es de esos tres sectores se usan los rangos de manufactura. El tamaño importa para beneficios de la Ley 2069 de 2020 (emprendimiento), tarifas diferenciales de registro, compras públicas y programas de apoyo.</p></section>
<section><h3>El régimen simple de tributación</h3><p>Es un régimen <b>opcional</b> del impuesto de renta (arts. 903 y siguientes del Estatuto Tributario) que unifica en un pago la renta, el impuesto al consumo de restaurantes y el ICA municipal, con tarifas por grupo de actividad. Pueden acogerse personas naturales y sociedades con ingresos brutos del año anterior menores a 100.000 UVT, entre otros requisitos. Las tarifas y requisitos cambian con las reformas tributarias: se revisan en la DIAN antes de escoger.</p></section>
${NOTA}`,
 qs:[{q:"Juan tiene un taller de corte con su padre y quiere que, si el negocio quiebra, no respondan con la casa familiar. ¿Persona natural comerciante o sociedad?",a:"Una sociedad (normalmente SAS): la responsabilidad de los socios queda limitada a sus aportes. Como persona natural comerciante respondería con todo su patrimonio."},{q:"¿Con qué criterio se clasifica hoy una empresa como micro, pequeña o mediana?",a:"Solo por los ingresos por actividades ordinarias anuales en UVT, con rangos distintos para manufactura, servicios y comercio (Decreto 957 de 2019)."}]},
Object.assign(soc,{t:"Las sociedades comerciales: tipos, constitución, órganos y disolución",html:String.raw`
<section><h3>El contrato de sociedad (art. 98 C. Co.)</h3>
<p class="lead">Dos o más personas se obligan a hacer un aporte en dinero, trabajo u otros bienes apreciables en dinero, con el fin de repartirse las utilidades. Una vez constituida, la sociedad es una <b>persona jurídica distinta</b> de los socios. La SAS (Ley 1258 de 2008) y la empresa unipersonal (Ley 222 de 1995) permiten un solo dueño.</p>
<p><b>Elementos:</b> pluralidad de socios (salvo las excepciones), aportes, ánimo de lucro (reparto de utilidades) y <i>affectio societatis</i> (la voluntad de asociarse y colaborar).</p></section>
<section><h3>Tipos</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Socios</th><th>Responsabilidad</th><th>Capital</th></tr>
<tr><td>Colectiva</td><td>2 o más</td><td>Solidaria e ilimitada</td><td>Partes de interés</td></tr>
<tr><td>Comandita simple</td><td>Gestores y comanditarios</td><td>Gestores: ilimitada; comanditarios: hasta sus aportes</td><td>Partes de interés</td></tr>
<tr><td>Comandita por acciones</td><td>Gestores y al menos 5 comanditarios</td><td>Igual que la anterior</td><td>Acciones</td></tr>
<tr><td>Limitada</td><td>2 a 25 (art. 356)</td><td>Hasta sus aportes; los socios responden solidariamente por los impuestos de la sociedad (art. 794 E.T.)</td><td>Cuotas, pagadas totalmente al constituir (art. 354)</td></tr>
<tr><td>Anónima</td><td>5 o más (art. 374)</td><td>Hasta sus aportes</td><td>Acciones; al constituir se paga al menos un tercio del capital suscrito (art. 376)</td></tr>
<tr><td>Por acciones simplificada (SAS)</td><td>1 o más</td><td>Hasta sus aportes (art. 1, Ley 1258)</td><td>Acciones; el capital suscrito se paga en un plazo de hasta dos años (art. 9)</td></tr></table></div>
<p>La SAS es hoy casi la única forma que se usa para empresas nuevas en Colombia: se crea por <b>documento privado</b> inscrito en la cámara de comercio, puede tener <b>objeto indeterminado</b> (cualquier actividad lícita) y <b>duración indefinida</b>, no está obligada a tener junta directiva y solo necesita revisor fiscal si la ley lo exige por su tamaño.</p></section>
<section><h3>Constitución</h3><ul>
<li><b>Sociedades del Código:</b> escritura pública con los requisitos del art. 110: socios, tipo, domicilio, objeto, capital y aportes, administración, fechas de reuniones, causales de disolución, liquidación, entre otros.</li>
<li><b>SAS:</b> documento privado con el contenido del art. 5 de la Ley 1258; se inscribe en el registro mercantil y desde ahí nace la persona jurídica.</li>
<li><b>Sociedad de hecho:</b> la que no se constituye por escritura; no es persona jurídica y los socios responden solidaria e ilimitadamente (arts. 498 a 506).</li></ul></section>
<section><h3>Órganos</h3><div class="tbl"><table><tr><th>Órgano</th><th>Qué hace</th></tr>
<tr><td>Asamblea de accionistas o junta de socios</td><td>Máximo órgano: aprueba estados financieros, reparte utilidades, reforma estatutos y elige administradores. Reunión ordinaria al menos una vez al año, en los tres primeros meses (art. 422).</td></tr>
<tr><td>Junta directiva</td><td>Obligatoria en la anónima; en la SAS es opcional.</td></tr>
<tr><td>Representante legal (gerente)</td><td>Administra y representa a la sociedad frente a terceros.</td></tr>
<tr><td>Revisor fiscal</td><td>Obligatorio en la anónima y en cualquier sociedad con activos brutos de 5.000 SMMLV o más, o ingresos brutos de 3.000 SMMLV o más (art. 13, Ley 43 de 1990).</td></tr></table></div>
<p><b>Deberes de los administradores</b> (art. 23, Ley 222 de 1995): obrar de buena fe, con lealtad y con la diligencia de un buen hombre de negocios. Responden solidaria e ilimitadamente por los perjuicios que causen con dolo o culpa (art. 24).</p></section>
<section><h3>Reformas, disolución y liquidación</h3><ul>
<li><b>Reformas estatutarias:</b> se aprueban en el máximo órgano con la mayoría de los estatutos o de la ley y se inscriben en la cámara. Las <b>transformaciones</b> (cambiar de tipo), <b>fusiones</b> y <b>escisiones</b> son reformas especiales.</li>
<li><b>Causales de disolución</b> (art. 218 C. Co. y art. 34 Ley 1258): vencimiento del término, imposibilidad de desarrollar el objeto, reducción de socios por debajo del mínimo, decisión de los socios, orden de autoridad, liquidación judicial, entre otras.</li>
<li><b>Negocio en marcha:</b> desde la Ley 2069 de 2020 (art. 4) la vieja causal por pérdidas fue derogada y la reemplazó el <b>no cumplimiento de la hipótesis de negocio en marcha</b> al cierre del ejercicio. Los administradores deben avisar al máximo órgano apenas la detecten y abstenerse de iniciar operaciones nuevas distintas al giro ordinario.</li>
<li><b>Liquidación:</b> disuelta la sociedad, un liquidador paga las deudas en el orden legal y reparte el remanente entre los socios.</li></ul></section>
<section><h3>Levantamiento del velo corporativo</h3><p>Si la sociedad se usa para defraudar a la ley o a terceros, el juez puede desconocer la separación de patrimonios y hacer responder a los socios y administradores que participaron (art. 42 de la Ley 1258; acción de desestimación ante la Superintendencia de Sociedades).</p></section>
<section><h3>Actualidad</h3><p>En el Congreso cursa desde 2025 un proyecto de reforma del Código de Comercio en materia de comerciantes y sociedades (entre otras cosas, permitiría a la persona natural comerciante limitar su responsabilidad a un patrimonio inscrito y digitalizaría el registro). Mientras no sea ley, rige lo explicado arriba. Además, por la emergencia económica del terremoto de 2026, el Decreto Legislativo 1418 de 2026 flexibilizó temporalmente algunas reglas societarias para sociedades domiciliadas en los municipios afectados.</p></section>
${LAB_}${NOTA}`,
 qs:[{q:"Dos hermanos quieren formalizar el taller familiar sin arriesgar su patrimonio personal y con reglas flexibles. ¿Qué tipo les conviene?",a:"Una SAS: admite uno o más accionistas, responsabilidad hasta el monto de los aportes y se constituye por documento privado."},{q:"¿Una sociedad sigue entrando en causal de disolución cuando las pérdidas bajan el patrimonio por debajo del 50 % del capital?",a:"No. La Ley 2069 de 2020 derogó esa causal y la reemplazó por el no cumplimiento de la hipótesis de negocio en marcha al cierre del ejercicio."},{q:"Una SAS tuvo ingresos brutos de 3.500 SMMLV el año pasado. ¿Debe tener revisor fiscal?",a:"Sí: la Ley 43 de 1990 (art. 13, par. 2) lo exige a las sociedades con ingresos brutos de 3.000 SMMLV o más, o activos brutos de 5.000 SMMLV o más."}]}),
{id:"establecimiento", t:"El establecimiento de comercio y el local comercial", html:String.raw`
<section><h3>Qué es (art. 515 C. Co.)</h3><p class="lead">El conjunto de bienes organizados por el empresario para realizar los fines de la empresa. Una persona puede tener varios establecimientos y un establecimiento puede pertenecer a varias personas. Es un <b>bien mueble</b> que se puede vender, arrendar o dar en prenda como una unidad.</p></section>
<section><h3>Lo que lo compone (art. 516)</h3><ul>
<li>La enseña o nombre comercial y las marcas.</li><li>Los derechos del empresario sobre el local (por ejemplo, el arrendamiento).</li><li>Las mercancías en almacén o en proceso, y los créditos del negocio.</li>
<li>El mobiliario y las instalaciones.</li><li>Los contratos de arrendamiento y la protección legal del local, y los demás contratos de la explotación, salvo los personales.</li>
<li>El derecho a impedir la desviación desleal de la clientela y la protección de la fama comercial.</li></ul></section>
<section><h3>Venta del establecimiento (arts. 525 a 531)</h3><ul>
<li>Se presume que se vende como unidad, con todos sus elementos, salvo pacto en contrario.</li>
<li>Debe hacerse por escritura pública o documento privado reconocido, que se <b>inscribe</b> en el registro mercantil para que produzca efectos frente a terceros (art. 526).</li>
<li>El comprador y el vendedor responden <b>solidariamente</b> por las obligaciones del negocio, a menos que se haya informado a los acreedores y estos no se opongan en el plazo legal (arts. 527 a 529). Por eso, antes de comprar un negocio se piden sus deudas y se publica la venta.</li></ul></section>
<section><h3>El local arrendado y el derecho de renovación (arts. 518 a 524)</h3><ul>
<li>Quien ha ocupado un local <b>dos años consecutivos</b> con un mismo establecimiento tiene derecho a renovar el arriendo al vencerse el contrato (art. 518).</li>
<li>El arrendador solo puede negarse si el arrendatario incumplió, si necesita el local para su propia habitación o un negocio distinto, o si el inmueble debe reconstruirse o repararse de forma que no pueda seguir ocupado.</li>
<li>Debe avisar (desahucio) con al menos <b>seis meses</b> de anticipación (art. 520). Si recupera el local para esas causas y no lo usa así, debe indemnizar (art. 522).</li>
<li>Si se reconstruye, el anterior arrendatario tiene <b>derecho de preferencia</b> para volver a arrendarlo (art. 521).</li></ul></section>
${NOTA}`,
 qs:[{q:"Una panadería lleva tres años en el mismo local arrendado y el contrato se vence. El dueño quiere sacarla para arrendarle a otro que paga más. ¿Puede?",a:"No por esa razón: con dos años consecutivos la panadería tiene derecho a la renovación (art. 518). Solo cabe negarla por incumplimiento, necesidad propia o reconstrucción, con desahucio de seis meses."}]},
{id:"obligaciones", t:"Obligaciones y contratos mercantiles", html:String.raw`
<section><h3>Reglas propias de las obligaciones mercantiles</h3>
<div class="tbl"><table><tr><th>Regla</th><th>Artículo</th><th>Qué dice</th></tr>
<tr><td>Se aplica el derecho civil en lo no regulado</td><td>822</td><td>Los principios civiles de los contratos rigen los actos mercantiles salvo norma especial.</td></tr>
<tr><td>Solidaridad presunta</td><td>825</td><td>Si varios deudores se obligan en un negocio mercantil, se presume que son solidarios (en lo civil es al revés).</td></tr>
<tr><td>Onerosidad</td><td>Varios</td><td>Los actos de comercio se presumen remunerados: el silencio no significa gratis.</td></tr>
<tr><td>Buena fe</td><td>871</td><td>Los contratos obligan a lo pactado y a lo que corresponde a su naturaleza según la ley, la costumbre o la equidad.</td></tr>
<tr><td>Abuso del derecho</td><td>830</td><td>Quien abuse de sus derechos indemniza los perjuicios.</td></tr>
<tr><td>Imprevisión</td><td>868</td><td>Si hechos extraordinarios e imprevisibles hacen excesivamente onerosa una prestación futura, se puede pedir revisarla.</td></tr>
<tr><td>Intereses</td><td>884</td><td>Si no se pactan, el remuneratorio es el bancario corriente; el moratorio es <b>una y media veces</b> el bancario corriente, que certifica la Superintendencia Financiera. Cobrar por encima es usura (delito, art. 305 del Código Penal).</td></tr></table></div></section>
<section><h3>Los contratos mercantiles más usados</h3>
<div class="tbl"><table><tr><th>Contrato</th><th>Artículo</th><th>En qué consiste</th></tr>
<tr><td>Compraventa</td><td>905</td><td>Uno se obliga a transmitir la propiedad de una cosa y el otro a pagarla en dinero.</td></tr>
<tr><td>Suministro</td><td>968</td><td>Prestaciones periódicas o continuas de cosas o servicios a cambio de un precio (proveedores).</td></tr>
<tr><td>Transporte</td><td>981</td><td>Llevar personas o cosas de un lugar a otro por un precio.</td></tr>
<tr><td>Seguro</td><td>1036</td><td>Se traslada un riesgo a una aseguradora a cambio de una prima.</td></tr>
<tr><td>Fiducia mercantil</td><td>1226</td><td>Se entregan bienes a una fiduciaria para que los administre con una finalidad.</td></tr>
<tr><td>Mandato</td><td>1262</td><td>Uno se obliga a celebrar actos de comercio por cuenta de otro.</td></tr>
<tr><td>Comisión</td><td>1287</td><td>Mandato en que el comisionista actúa en nombre propio por cuenta ajena.</td></tr>
<tr><td>Agencia comercial</td><td>1317</td><td>Un comerciante promueve o explota de forma estable los negocios de otro en una zona. Al terminar, el agente recibe la <b>cesantía comercial</b>: una doceava parte del promedio de la comisión de los últimos tres años por cada año (art. 1324).</td></tr>
<tr><td>Preposición</td><td>1332</td><td>Se encarga a alguien la administración de un establecimiento o una parte de él.</td></tr>
<tr><td>Corretaje</td><td>1340</td><td>Un experto pone en contacto a dos partes para que celebren un negocio, a cambio de una comisión.</td></tr>
<tr><td>Arrendamiento de local comercial</td><td>518</td><td>Con derecho de renovación (ver la estación del establecimiento).</td></tr>
<tr><td>Franquicia, leasing, factoring, distribución</td><td>Atípicos</td><td>No tienen regulación completa en el Código; se rigen por lo pactado, la costumbre y las normas generales.</td></tr></table></div></section>
<section><h3>Cuándo se perfecciona un contrato (arts. 845 a 864)</h3><p>La <b>oferta</b> debe contener los elementos esenciales del negocio y comunicarse al destinatario; es irrevocable una vez comunicada, salvo pacto. La <b>aceptación</b> debe llegar en el plazo: si la oferta es verbal, en el acto; si es escrita, en seis días si se vive en el mismo lugar (más el término de la distancia si no). El contrato se celebra en el lugar de residencia de quien hizo la oferta y en el momento en que recibe la aceptación.</p></section>
${NOTA}`,
 qs:[{q:"Dos socios firman un pagaré mercantil sin decir nada sobre cómo responden. ¿El acreedor puede cobrarle todo a uno solo?",a:"Sí: en materia mercantil la solidaridad se presume (art. 825), así que puede exigirle el total a cualquiera de los dos."},{q:"Un proveedor y un cliente no pactaron intereses de mora. ¿Cuánto puede cobrar el proveedor si el cliente paga tarde?",a:"Una y media veces el interés bancario corriente certificado por la Superintendencia Financiera (art. 884)."}]},
{id:"titulos", t:"Títulos valores: letra, pagaré, cheque y factura electrónica", sim:"titulos", html:String.raw`
<section><h3>Qué son (art. 619 C. Co.)</h3><p class="lead">Documentos necesarios para legitimar el ejercicio del derecho literal y autónomo que en ellos se incorpora.</p>
<ul><li><b>Incorporación:</b> el derecho va unido al documento; sin él no se puede cobrar.</li><li><b>Literalidad:</b> el derecho es el que dice el texto, ni más ni menos.</li>
<li><b>Legitimación:</b> lo ejerce el tenedor legítimo (quien lo tiene conforme a su ley de circulación).</li><li><b>Autonomía:</b> cada tenedor adquiere un derecho propio; al tercero de buena fe no se le pueden oponer las excepciones que había contra los anteriores.</li></ul>
<p><b>Requisitos comunes</b> (art. 621): la mención del derecho incorporado y la firma de quien lo crea. Si falta la fecha de vencimiento se entiende a la vista; si falta el lugar de pago, el del domicilio del creador.</p></section>
<section><h3>Clasificación</h3><div class="tbl"><table><tr><th>Por el contenido</th><th>Ejemplos</th></tr>
<tr><td>De contenido crediticio (pago de dinero)</td><td>Letra de cambio, pagaré, cheque, factura</td></tr>
<tr><td>Corporativos o de participación</td><td>Acciones, bonos</td></tr>
<tr><td>Representativos de mercancías</td><td>Certificado de depósito, bono de prenda, carta de porte, conocimiento de embarque</td></tr></table></div>
<p><b>Por su circulación:</b> <i>nominativos</i> (se inscriben en un registro del creador), <i>a la orden</i> (se transmiten por endoso y entrega) y <i>al portador</i> (basta la entrega).</p></section>
<section><h3>Los cuatro títulos más usados</h3><div class="tbl"><table><tr><th>Título</th><th>Artículos</th><th>Qué es y requisitos propios</th></tr>
<tr><td>Letra de cambio</td><td>671 a 708</td><td>Orden incondicional de pagar una suma de dinero: el <b>girador</b> ordena al <b>girado</b> pagar al <b>beneficiario</b>. Requisitos: la orden, el nombre del girado, la forma de vencimiento y si es a la orden o al portador. El girado se obliga cuando la <b>acepta</b>.</td></tr>
<tr><td>Pagaré</td><td>709 a 711</td><td>Promesa incondicional de pagar una suma de dinero: el <b>otorgante</b> promete pagar al beneficiario. Requisitos: la promesa, el nombre de a quién se paga, la forma de vencimiento y si es a la orden o al portador.</td></tr>
<tr><td>Cheque</td><td>712 a 745</td><td>Orden de pago que solo puede girarse contra un banco donde el girador tenga fondos. Debe presentarse dentro de 15 días si es pagadero en la misma plaza, un mes si es en otro lugar del país y tres meses si es en el exterior (art. 718). Si se devuelve por falta de fondos, el girador paga una sanción del <b>20 %</b> del cheque (art. 731).</td></tr>
<tr><td>Factura electrónica de venta</td><td>772 a 779; Ley 1231 de 2008</td><td>Título valor que el vendedor o prestador del servicio libra y entrega o remite al comprador. Se entiende <b>aceptada</b> si el comprador no la rechaza dentro de los tres días hábiles siguientes a recibir la mercancía o el servicio. Circula en el registro RADIAN de la DIAN (Decreto 1154 de 2020), lo que permite venderla (factoring).</td></tr></table></div></section>
<section><h3>Endoso, aval y acciones cambiarias</h3><ul>
<li><b>Endoso:</b> la firma con que se transmite un título a la orden. Puede ser <i>en propiedad</i>, <i>en procuración</i> (para cobrarlo) o <i>en garantía</i> (art. 654 y siguientes).</li>
<li><b>Aval:</b> garantía de pago de un título que da un tercero; el avalista responde como el avalado (arts. 633 a 639).</li>
<li><b>Acción cambiaria</b> (art. 780): se ejerce si el título no se acepta o no se paga. Es <b>directa</b> contra el aceptante o el otorgante y sus avalistas, y <b>de regreso</b> contra los demás (girador, endosantes).</li>
<li><b>Prescripción:</b> la acción directa prescribe en <b>tres años</b> desde el vencimiento (art. 789); la de regreso, en <b>un año</b> (art. 790). Las acciones del cheque prescriben en <b>seis meses</b> desde la presentación (art. 730).</li></ul></section>
${LAB_}${NOTA}`,
 qs:[{q:"Un pagaré se venció el 10 de marzo de 2023 y el acreedor no lo cobró. ¿Hasta cuándo puede ejercer la acción cambiaria directa?",a:"Tres años desde el vencimiento (art. 789): hasta el 10 de marzo de 2026. Después prescribe, salvo que se haya interrumpido."},{q:"¿Qué principio impide que el deudor de un pagaré le oponga a un tercero de buena fe las excepciones que tenía contra el primer acreedor?",a:"La autonomía: cada tenedor adquiere un derecho propio."},{q:"Un cliente recibe una factura electrónica y no dice nada durante una semana después de recibir la mercancía. ¿Qué pasa?",a:"Se entiende aceptada tácitamente: pasaron más de tres días hábiles sin rechazarla, así que la factura queda como título valor ejecutable."}]},
{id:"propiedad", t:"Propiedad intelectual: marcas, patentes, diseños, secretos y derecho de autor", html:String.raw`
<section><h3>Dos grandes ramas</h3><p><b>Propiedad industrial</b> (Decisión 486 de 2000 de la Comunidad Andina; en Colombia la registra la <b>SIC</b>) y <b>derecho de autor</b> (Ley 23 de 1982 y Decisión 351 de 1993; lo administra la <b>DNDA</b>, Dirección Nacional de Derecho de Autor).</p></section>
<section><h3>Propiedad industrial</h3><div class="tbl"><table><tr><th>Figura</th><th>Qué protege</th><th>Duración</th></tr>
<tr><td>Patente de invención</td><td>Invenciones nuevas, con nivel inventivo y aplicación industrial</td><td>20 años desde la solicitud (art. 50); no se renueva</td></tr>
<tr><td>Modelo de utilidad</td><td>Nueva forma de un objeto que mejora su funcionamiento o utilidad</td><td>10 años (art. 84)</td></tr>
<tr><td>Diseño industrial</td><td>La apariencia de un producto (forma, líneas, colores)</td><td>10 años (art. 128)</td></tr>
<tr><td>Marca</td><td>Un signo que distingue productos o servicios en el mercado</td><td>10 años renovables indefinidamente (art. 152); se renueva dentro de los seis meses anteriores al vencimiento, con seis meses de gracia (art. 153)</td></tr>
<tr><td>Nombre comercial y enseña</td><td>El nombre que identifica a la empresa o al establecimiento</td><td>Se protege por el <b>uso</b>; el depósito es opcional</td></tr>
<tr><td>Secreto empresarial</td><td>Información no divulgada con valor comercial (fórmulas, listas de clientes, procesos)</td><td>Mientras se mantenga en secreto (art. 260)</td></tr>
<tr><td>Denominación de origen</td><td>Productos cuya calidad se debe a su origen geográfico (por ejemplo, Café de Colombia)</td><td>Mientras se mantengan las condiciones</td></tr></table></div>
<p>Una marca se puede <b>cancelar por no uso</b> si no se usa durante tres años consecutivos (art. 165). Registrar la marca antes de invertir en publicidad evita que otro la registre primero: en la Comunidad Andina el derecho nace del <b>registro</b>, no del uso.</p></section>
<section><h3>Derecho de autor</h3><ul>
<li>Protege obras literarias, artísticas y científicas, incluido el <b>software</b> y las bases de datos, desde su creación; el registro ante la DNDA es declarativo (sirve de prueba).</li>
<li><b>Derechos morales:</b> paternidad, integridad, inédito, modificación y retiro; son perpetuos e irrenunciables.</li>
<li><b>Derechos patrimoniales:</b> reproducción, comunicación pública, distribución y transformación; duran la vida del autor y 80 años más.</li>
<li>Poner música en un establecimiento abierto al público es comunicación pública: se pagan derechos a las sociedades de gestión colectiva.</li></ul></section>
${NOTA}`,
 qs:[{q:"Una emprendedora usa hace dos años el nombre «Tripydelly» para sus productos, pero nunca lo registró. Otra persona lo registra como marca en la SIC. ¿Quién tiene mejor derecho?",a:"En principio quien lo registró: en la Comunidad Andina el derecho exclusivo sobre la marca nace del registro. La primera podría oponerse u ofrecer pruebas de mala fe, pero por eso conviene registrar antes de invertir en la marca."}]}
]);

ins("propiedad",[
{id:"contabilidad", t:"Libros, contabilidad, revisor fiscal y beneficiario final", html:String.raw`
<section><h3>Llevar contabilidad es un deber del comerciante (art. 19, num. 3)</h3><p class="lead">Los libros de comercio son prueba en los procesos entre comerciantes y muestran la verdad financiera de la empresa. Se rigen por los arts. 48 a 74 del Código de Comercio y por la Ley 1314 de 2009 (normas internacionales, NIIF).</p></section>
<section><h3>Los tres grupos de contabilidad (Decreto 2420 de 2015)</h3><div class="tbl"><table><tr><th>Grupo</th><th>Quiénes</th><th>Marco</th></tr>
<tr><td>1</td><td>Emisores de valores, entidades de interés público y grandes empresas que cumplen ciertos requisitos</td><td>NIIF plenas</td></tr>
<tr><td>2</td><td>Empresas medianas y pequeñas que no están en los grupos 1 ni 3</td><td>NIIF para pymes</td></tr>
<tr><td>3</td><td>Microempresas</td><td>Contabilidad simplificada</td></tr></table></div></section>
<section><h3>Libros y documentos</h3><ul>
<li><b>Libros de contabilidad</b> (diario, mayor, inventarios y balances): se llevan en papel o en medios electrónicos y ya no se registran en la cámara de comercio (Decreto Ley 019 de 2012).</li>
<li><b>Libro de actas</b> del máximo órgano y <b>libro de registro de socios o accionistas</b>: estos sí se inscriben en la cámara.</li>
<li><b>Conservación:</b> libros, papeles y comprobantes se guardan por <b>diez años</b> desde el último asiento o documento (art. 60, modificado por la Ley 962 de 2005); se pueden conservar en medios electrónicos que garanticen su reproducción exacta.</li>
<li><b>Prohibiciones</b> (art. 57): alterar el orden de los asientos, dejar espacios para intercalar, tachar, borrar o arrancar hojas.</li>
<li>La contabilidad que se lleva en debida forma hace prueba a favor del comerciante en sus litigios con otros comerciantes (art. 68).</li></ul></section>
<section><h3>Revisor fiscal</h3><p>Obligatorio en las sociedades anónimas, en las sucursales de sociedades extranjeras y en cualquier sociedad con activos brutos de <b>5.000 SMMLV</b> o más o ingresos brutos de <b>3.000 SMMLV</b> o más al 31 de diciembre del año anterior (art. 13, par. 2, Ley 43 de 1990). Debe ser contador público y dictamina los estados financieros (arts. 203 a 217 C. Co.).</p></section>
<section><h3>Beneficiario final (RUB)</h3><p>Las sociedades y otras estructuras deben identificar a las <b>personas naturales</b> que finalmente las poseen o controlan y reportarlas en el Registro Único de Beneficiarios Finales de la DIAN (Ley 2155 de 2021 y Resolución DIAN 164 de 2021), como medida contra la evasión y el lavado de activos.</p></section>
${NOTA}`,
 qs:[{q:"¿Cuánto tiempo debe guardar un comerciante los comprobantes de su contabilidad?",a:"Diez años desde la fecha del último asiento, documento o comprobante (art. 60 C. Co., modificado por la Ley 962 de 2005)."}]},
{id:"competencia", t:"Reglas del mercado: competencia desleal, libre competencia y consumidor", html:String.raw`
<section><h3>Tres regímenes distintos</h3><div class="tbl"><table><tr><th>Régimen</th><th>Protege</th><th>Norma</th><th>Autoridad</th></tr>
<tr><td>Competencia desleal</td><td>A los competidores frente a conductas contrarias a la buena fe comercial</td><td>Ley 256 de 1996</td><td>SIC (funciones de juez) y jueces civiles</td></tr>
<tr><td>Libre competencia (prácticas restrictivas)</td><td>Al mercado: que haya competencia</td><td>Ley 155 de 1959, Decreto 2153 de 1992, Ley 1340 de 2009</td><td>SIC</td></tr>
<tr><td>Protección al consumidor</td><td>Al consumidor final</td><td>Ley 1480 de 2011 (Estatuto del Consumidor)</td><td>SIC, alcaldías y jueces</td></tr></table></div></section>
<section><h3>Actos de competencia desleal (Ley 256 de 1996, arts. 8 a 19)</h3><ul>
<li><b>Desviación de la clientela</b> y <b>desorganización</b> de la empresa ajena por medios desleales.</li>
<li><b>Confusión</b> con la actividad, prestaciones o establecimiento de otro.</li><li><b>Engaño</b>: inducir al público a error sobre la actividad o los productos.</li>
<li><b>Descrédito</b>: afirmaciones falsas que desacrediten a otro. <b>Comparación</b> engañosa.</li><li><b>Imitación</b> que genere confusión o aproveche el esfuerzo ajeno, y <b>explotación de la reputación ajena</b>.</li>
<li><b>Violación de secretos</b>, <b>inducción a la ruptura contractual</b>, <b>violación de normas</b> que dé ventaja competitiva y ciertos <b>pactos de exclusividad</b>.</li></ul>
<p><b>Acciones:</b> declarativa y de condena (para que se declare ilegal, cese y se indemnice) y preventiva. Prescriben en dos años desde que se conoció el acto y, en todo caso, en tres años desde que se realizó (art. 23).</p></section>
<section><h3>Prácticas restrictivas de la competencia</h3><ul>
<li><b>Acuerdos</b> entre competidores para fijar precios, repartir mercados, limitar la producción o coludir en licitaciones (art. 47, Decreto 2153).</li>
<li><b>Actos</b> como influir en otra empresa para que suba precios o no baje los suyos (art. 48).</li>
<li><b>Abuso de posición dominante</b>: precios predatorios, discriminación, ventas atadas, obstruir el acceso al mercado (art. 50).</li>
<li><b>Integraciones empresariales</b> (fusiones, adquisiciones) por encima de ciertos umbrales deben informarse o pedir autorización previa a la SIC.</li>
<li><b>Multas</b> (Ley 1340, art. 25): a la empresa, hasta 100.000 SMMLV o hasta el 150 % de la utilidad derivada de la conducta, la cifra mayor; a las personas que colaboren o toleren, hasta 2.000 SMMLV. Existe un <b>programa de beneficios por colaboración</b> (delación) para quien confiese y entregue pruebas.</li></ul></section>
<section><h3>Estatuto del Consumidor (Ley 1480 de 2011)</h3><ul>
<li><b>Garantía legal</b> (arts. 7 a 17): todo producto debe tener calidad, idoneidad y seguridad. El término lo fija el productor o proveedor; si no lo dice, es de <b>un año</b> para productos nuevos. Si falla, se repara gratis y, si se repite la falla, se cambia o se devuelve el dinero.</li>
<li><b>Información y publicidad:</b> la información debe ser clara, veraz y suficiente; la publicidad engañosa genera responsabilidad.</li>
<li><b>Derecho de retracto</b> (art. 47): en ventas a distancia, por internet, a domicilio o con financiación del vendedor, el consumidor puede devolver el producto dentro de los <b>cinco días hábiles</b> siguientes a la entrega y recibir el dinero.</li>
<li><b>Reversión del pago</b> (art. 51): si se pagó con tarjeta u otro medio electrónico en ventas no presenciales y hubo fraude, el producto no llegó, no es el pedido o es defectuoso.</li>
<li><b>Cláusulas abusivas</b> (arts. 42 y 43): son ineficaces las que limitan la responsabilidad del productor o impiden reclamar.</li>
<li><b>Datos personales:</b> la Ley 1581 de 2012 exige autorización para tratarlos y una política de tratamiento.</li></ul></section>
${NOTA}`,
 qs:[{q:"Una tienda en línea se niega a devolver el dinero de un pantalón que el cliente devolvió en buen estado al tercer día hábil. ¿Tiene derecho?",a:"No: en ventas por internet el consumidor tiene derecho de retracto dentro de los cinco días hábiles siguientes a la entrega (art. 47, Ley 1480)."},{q:"Dos distribuidores de tela se ponen de acuerdo para no vender por debajo de cierto precio en Medellín. ¿Qué norma violan?",a:"Las de libre competencia: es un acuerdo de fijación de precios prohibido (art. 47 del Decreto 2153 de 1992), sancionable por la SIC con multas de la Ley 1340 de 2009."}]},
{id:"insolvencia", t:"Crisis de la empresa: reorganización, liquidación e insolvencia de la persona natural", html:String.raw`
<section><h3>Para qué sirve el régimen de insolvencia</h3><p class="lead">Busca proteger el crédito y, si la empresa es viable, conservarla como fuente de empleo y riqueza mediante un acuerdo con los acreedores; si no lo es, liquidarla de forma ordenada (art. 1, Ley 1116 de 2006).</p></section>
<section><h3>Las normas</h3><div class="tbl"><table><tr><th>Norma</th><th>Qué regula</th></tr>
<tr><td>Ley 1116 de 2006</td><td>Régimen general de insolvencia empresarial: procesos de reorganización y de liquidación judicial. Lo conduce la Superintendencia de Sociedades (o el juez civil del circuito en ciertos casos).</td></tr>
<tr><td>Decretos Legislativos 560 y 772 de 2020</td><td>Herramientas temporales de la pandemia: negociación de emergencia, procesos abreviados y de pequeñas insolvencias.</td></tr>
<tr><td>Ley 2437 de 2024 (12 de diciembre)</td><td>Volvió permanentes buena parte de esas herramientas y reformó la Ley 1116: mecanismos de recuperación más rápidos y procesos para pequeñas insolvencias.</td></tr>
<tr><td>Código General del Proceso (arts. 531 y siguientes), reformado por la Ley 2445 de 2025</td><td>Insolvencia de la persona natural no comerciante: negociación de deudas en centros de conciliación o notarías, convalidación de acuerdos y liquidación patrimonial. Desde 2025 también pueden usarla los <b>pequeños comerciantes</b> personas naturales con activos menores a 1.000 SMMLV (sin contar la vivienda familiar ni el vehículo de trabajo).</td></tr></table></div></section>
<section><h3>Reorganización y liquidación</h3><ul>
<li><b>Cuándo se pide la reorganización:</b> por <b>cesación de pagos</b> (incumplir por más de 90 días dos o más obligaciones que sumen al menos el 10 % del pasivo) o por <b>incapacidad de pago inminente</b>.</li>
<li><b>Efectos:</b> se suspenden los procesos ejecutivos contra el deudor, los acreedores se agrupan por clases y se vota un acuerdo de pago con un plazo y unas condiciones.</li>
<li><b>Orden de pago (prelación de créditos):</b> primero los gastos de administración del proceso, luego las obligaciones laborales y fiscales de primera clase, después los créditos con garantía y al final los quirografarios (sin garantía).</li>
<li><b>Liquidación judicial:</b> si no hay acuerdo o se incumple, se venden los bienes y se paga en ese orden; la sociedad se extingue.</li>
<li><b>Responsabilidad:</b> los administradores y socios que causaron la insolvencia con dolo o culpa pueden responder con su patrimonio.</li></ul></section>
${NOTA}`,
 qs:[{q:"Una pequeña comerciante persona natural, con activos de 300 SMMLV, no puede pagar sus deudas. ¿Qué procedimiento puede usar desde 2025?",a:"El de insolvencia de la persona natural no comerciante del Código General del Proceso: la Ley 2445 de 2025 lo abrió a los pequeños comerciantes con activos menores a 1.000 SMMLV (sin contar vivienda familiar ni vehículo de trabajo)."}]}
]);

// partes del derecho comercial
const PART={costumbre:"Comercial · Fuentes, comerciante y registro",comerciante:"Comercial · Fuentes, comerciante y registro",actos:"Comercial · Fuentes, comerciante y registro",registro:"Comercial · Fuentes, comerciante y registro",formalizar:"Comercial · Fuentes, comerciante y registro",
  sociedades:"Comercial · La empresa: sociedades, bienes y contratos",establecimiento:"Comercial · La empresa: sociedades, bienes y contratos",obligaciones:"Comercial · La empresa: sociedades, bienes y contratos",titulos:"Comercial · La empresa: sociedades, bienes y contratos",propiedad:"Comercial · La empresa: sociedades, bienes y contratos",
  contabilidad:"Comercial · Reglas del mercado: contabilidad, competencia y crisis",competencia:"Comercial · Reglas del mercado: contabilidad, competencia y crisis",insolvencia:"Comercial · Reglas del mercado: contabilidad, competencia y crisis"};
TRUNK.forEach(t=>{if(PART[t.id])t.parte=PART[t.id]});
})();

// ---------- Glosario y normas de derecho comercial (se consulta con buscador)
const GLOS_COM=[
["Acción cambiaria","La que tiene el tenedor de un título valor para cobrarlo si no se acepta o no se paga. Directa contra el principal obligado; de regreso contra los demás.","Arts. 780 a 790 C. Co."],
["Actos de comercio","Los que la ley califica como mercantiles por su naturaleza, aunque los haga un no comerciante; por ejemplo, adquirir bienes para revenderlos o girar títulos valores.","Art. 20 C. Co."],
["Actos mixtos","Los que son mercantiles para una de las partes y civiles para la otra; se rigen por la ley comercial.","Art. 22 C. Co."],
["Affectio societatis","La voluntad de los socios de asociarse y colaborar en un fin común.","Doctrina; art. 98 C. Co."],
["Agencia comercial","Contrato en que un comerciante promueve de forma estable los negocios de otro en una zona. Da derecho a la cesantía comercial al terminar.","Arts. 1317 a 1331 C. Co."],
["Aval","Garantía que un tercero da sobre el pago de un título valor; el avalista responde igual que el avalado.","Arts. 633 a 639 C. Co."],
["Beneficiario final","Persona natural que finalmente posee o controla una sociedad u otra estructura. Se reporta en el RUB de la DIAN.","Ley 2155 de 2021; Res. DIAN 164 de 2021"],
["Cámara de comercio","Entidad privada que lleva por delegación del Estado el registro mercantil, el de proponentes y el de entidades sin ánimo de lucro.","Arts. 78 a 94 C. Co.; Decreto 1074 de 2015"],
["Cesación de pagos","Incumplir por más de 90 días dos o más obligaciones que representen al menos el 10 % del pasivo. Permite pedir la reorganización.","Art. 9, Ley 1116 de 2006"],
["Cesantía comercial","Prestación que recibe el agente comercial al terminar el contrato: una doceava parte del promedio de la comisión de los últimos tres años por cada año.","Art. 1324 C. Co."],
["Cheque","Orden de pago a cargo de un banco donde el girador tiene fondos. Si se devuelve por falta de fondos, el girador paga el 20 % del cheque como sanción.","Arts. 712 a 745 C. Co."],
["CIIU","Clasificación Industrial Internacional Uniforme adaptada para Colombia (Rev. 4 A.C.) del DANE. El código de cuatro dígitos identifica la actividad en el RUT y en el registro mercantil.","Res. DANE 2306 de 2022; Res. DIAN 114 de 2020"],
["Comerciante","Persona que profesionalmente se ocupa en alguna de las actividades que la ley considera mercantiles.","Art. 10 C. Co."],
["Competencia desleal","Todo acto contrario a la sana costumbre mercantil, a la buena fe comercial o a los usos honestos que afecte la libertad de decisión del comprador o el funcionamiento del mercado.","Ley 256 de 1996, art. 7"],
["Costumbre mercantil","Prácticas uniformes, públicas y reiteradas de los comerciantes que la ley reconoce como fuente del derecho comercial si no contrarían la ley.","Arts. 3 a 9 C. Co."],
["Derecho de retracto","Facultad del consumidor de devolver el producto dentro de los cinco días hábiles siguientes a la entrega en ventas a distancia, a domicilio o financiadas por el vendedor.","Art. 47, Ley 1480 de 2011"],
["Derecho de renovación","Derecho del arrendatario que ocupó un local dos años consecutivos con un mismo establecimiento a que se le renueve el contrato.","Art. 518 C. Co."],
["Disolución","Estado en que la sociedad deja de desarrollar su objeto y entra en liquidación. Tiene causales legales y estatutarias.","Art. 218 C. Co.; art. 34 Ley 1258 de 2008"],
["Endoso","Firma con la que se transmite un título a la orden. Puede ser en propiedad, en procuración o en garantía.","Arts. 654 a 670 C. Co."],
["Escisión","Reforma por la que una sociedad divide su patrimonio y lo transfiere a una o varias sociedades.","Ley 222 de 1995, arts. 3 a 10"],
["Establecimiento de comercio","Conjunto de bienes organizados por el empresario para los fines de la empresa. Es un bien mueble.","Arts. 515 a 553 C. Co."],
["Factura electrónica","Título valor que libra el vendedor o prestador del servicio. Se acepta tácitamente si no se rechaza en tres días hábiles. Circula en RADIAN.","Arts. 772 a 779 C. Co.; Ley 1231 de 2008; Decreto 1154 de 2020"],
["Fusión","Reforma por la que una o más sociedades se disuelven sin liquidarse para ser absorbidas por otra o crear una nueva.","Arts. 172 a 180 C. Co."],
["Hipótesis de negocio en marcha","Supuesto de que la empresa seguirá operando en el futuro previsible. No cumplirla al cierre del ejercicio es causal de disolución.","Art. 4, Ley 2069 de 2020"],
["Homonimia","Prohibición de matricular un nombre igual a otro ya inscrito en el registro mercantil.","Art. 35 C. Co."],
["Imprevisión","Revisión de un contrato de ejecución sucesiva cuando hechos extraordinarios e imprevisibles hacen excesivamente onerosa una prestación.","Art. 868 C. Co."],
["Interés moratorio mercantil","Si no se pactó, una y media veces el interés bancario corriente certificado por la Superintendencia Financiera.","Art. 884 C. Co."],
["Letra de cambio","Orden incondicional de pagar una suma de dinero que el girador da al girado a favor de un beneficiario.","Arts. 671 a 708 C. Co."],
["Levantamiento del velo corporativo","Desconocer la personalidad jurídica de la sociedad cuando se usa para defraudar, y hacer responder a los socios.","Art. 42, Ley 1258 de 2008"],
["Libros de comercio","Los que la ley exige al comerciante para su contabilidad y sus actos. Se conservan diez años.","Arts. 48 a 74 C. Co."],
["Marca","Signo que distingue productos o servicios en el mercado. Se registra en la SIC por 10 años renovables.","Decisión 486 de 2000, arts. 134 y 152"],
["Matrícula mercantil","Inscripción del comerciante y de sus establecimientos en el registro mercantil. Se renueva antes del 31 de marzo de cada año.","Arts. 19, 26 a 33 C. Co."],
["Microempresa","Empresa con ingresos ordinarios anuales hasta 23.563 UVT (manufactura), 32.988 UVT (servicios) o 44.769 UVT (comercio).","Decreto 957 de 2019"],
["Pagaré","Promesa incondicional de pagar una suma de dinero que hace el otorgante a favor de un beneficiario.","Arts. 709 a 711 C. Co."],
["Patente","Derecho exclusivo sobre una invención nueva, con nivel inventivo y aplicación industrial, por 20 años.","Decisión 486 de 2000, arts. 14 y 50"],
["Posición dominante","Posibilidad de determinar, directa o indirectamente, las condiciones de un mercado. Abusar de ella está prohibido.","Decreto 2153 de 1992, arts. 45 y 50"],
["Prelación de créditos","Orden legal en que se pagan las deudas en un concurso: gastos de administración, laborales y fiscales, con garantía y quirografarios.","Código Civil, arts. 2488 a 2511; Ley 1116 de 2006"],
["Registro mercantil","Registro público que llevan las cámaras de comercio para matricular comerciantes y establecimientos e inscribir los actos que la ley exige.","Art. 26 C. Co."],
["Reorganización","Proceso de insolvencia para que el deudor viable celebre un acuerdo de pago con sus acreedores y siga operando.","Ley 1116 de 2006; Ley 2437 de 2024"],
["Revisor fiscal","Contador público que dictamina los estados financieros. Obligatorio en la anónima y en sociedades grandes (5.000 SMMLV de activos o 3.000 SMMLV de ingresos).","Arts. 203 a 217 C. Co.; Ley 43 de 1990, art. 13"],
["RUES","Registro Único Empresarial y Social: integra los registros que llevan las cámaras de comercio.","Ley 590 de 2000, art. 11; Ley 1727 de 2014"],
["RUT","Registro Único Tributario de la DIAN: identifica a los contribuyentes y sus responsabilidades. Asigna el NIT.","Art. 555-2 E.T."],
["SAS","Sociedad por acciones simplificada: uno o más accionistas, responsabilidad hasta los aportes, documento privado y objeto indeterminado.","Ley 1258 de 2008"],
["Secreto empresarial","Información no divulgada que tiene valor comercial por ser secreta y que su dueño protege con medidas razonables.","Decisión 486 de 2000, art. 260"],
["Sociedad de hecho","La que no se constituye por escritura pública. No es persona jurídica y sus socios responden solidaria e ilimitadamente.","Arts. 498 a 506 C. Co."],
["Solidaridad mercantil","En los negocios mercantiles, si hay varios deudores, se presume que responden solidariamente.","Art. 825 C. Co."],
["Superintendencia de Industria y Comercio (SIC)","Autoridad de competencia, protección al consumidor, propiedad industrial, datos personales y metrología legal.","Decreto 4886 de 2011"],
["Superintendencia de Sociedades","Inspecciona, vigila y controla sociedades comerciales; conduce los procesos de insolvencia y resuelve conflictos societarios.","Arts. 82 a 87, Ley 222 de 1995; Ley 1116 de 2006"],
["Título valor","Documento necesario para legitimar el ejercicio del derecho literal y autónomo que en él se incorpora.","Art. 619 C. Co."],
["Transformación","Reforma por la que una sociedad adopta otro tipo societario sin disolverse.","Arts. 167 a 171 C. Co."],
["Usura","Cobrar intereses que superen en la mitad el interés bancario corriente certificado. Es delito.","Art. 305 Código Penal; art. 884 C. Co."]];
const NORMAS_COM=[
["Decreto 410 de 1971","Código de Comercio: comerciantes, actos de comercio, registro, sociedades, bienes mercantiles, títulos valores y contratos."],
["Ley 155 de 1959","Prohíbe acuerdos y prácticas que limiten la libre competencia."],
["Ley 23 de 1982","Derecho de autor."],
["Decreto 2153 de 1992","Conductas restrictivas de la competencia (arts. 45 a 50) y funciones de la SIC."],
["Ley 43 de 1990","Profesión de contador público; casos en que la revisoría fiscal es obligatoria."],
["Decisión 351 de 1993 (CAN)","Régimen común andino sobre derecho de autor."],
["Ley 222 de 1995","Reformas al régimen de sociedades: empresa unipersonal, escisión, grupos empresariales, deberes de los administradores."],
["Ley 232 de 1995","Requisitos para el funcionamiento de establecimientos de comercio."],
["Ley 256 de 1996","Competencia desleal."],
["Decisión 486 de 2000 (CAN)","Régimen común andino de propiedad industrial: patentes, diseños, marcas, secretos."],
["Ley 590 de 2000","Promoción de las mipymes; crea el RUES."],
["Ley 1116 de 2006","Régimen de insolvencia empresarial."],
["Ley 1231 de 2008","Factura como título valor."],
["Ley 1258 de 2008","Sociedad por acciones simplificada (SAS)."],
["Ley 1314 de 2009","Convergencia hacia normas internacionales de contabilidad (NIIF)."],
["Ley 1340 de 2009","Protección de la competencia: multas, integraciones, programa de delación."],
["Decreto 4886 de 2011","Estructura y funciones de la Superintendencia de Industria y Comercio."],
["Ley 1480 de 2011","Estatuto del Consumidor."],
["Ley 1564 de 2012","Código General del Proceso: proceso ejecutivo e insolvencia de la persona natural no comerciante."],
["Ley 1581 de 2012","Protección de datos personales."],
["Decreto Ley 019 de 2012","Supresión de trámites; los libros de contabilidad dejan de registrarse en la cámara."],
["Ley 1727 de 2014","Cámaras de comercio y depuración del RUES (cancelación de matrículas sin renovar)."],
["Decreto 1074 de 2015","Decreto Único Reglamentario del sector Comercio, Industria y Turismo."],
["Decreto 2420 de 2015","Decreto Único Reglamentario de normas de contabilidad, información financiera y aseguramiento."],
["Decreto 957 de 2019","Clasificación del tamaño empresarial por ingresos."],
["Decreto 1154 de 2020","Circulación de la factura electrónica como título valor (RADIAN)."],
["Ley 2069 de 2020","Ley de emprendimiento; causal de disolución por no cumplir la hipótesis de negocio en marcha."],
["Ley 2155 de 2021","Inversión social; base del Registro Único de Beneficiarios Finales."],
["Resolución DANE 2306 de 2022","Actualización 2022 de la CIIU Rev. 4 A.C."],
["Ley 2437 de 2024","Reforma permanente al régimen de insolvencia."],
["Ley 2445 de 2025","Reforma a la insolvencia de la persona natural no comerciante; incluye a pequeños comerciantes."]];
WORKSHOPS.push(
 {id:"ciiu",t:"Buscador de códigos CIIU",anchor:"formalizar",links:["formalizar","registro","comerciante"],sim:"ciiu",nuevo:true,html:`<div class="sim" id="sim"></div>`,
  d:"Las 502 clases de la CIIU Rev. 4 A.C. (actualización 2022 del DANE), con su sección, división y grupo. Busca por palabras de lo que haces o por código; sirve para el RUT, la matrícula mercantil y el ICA."},
 {id:"glosario-com",t:"Glosario y normas de derecho comercial",anchor:"costumbre",links:["costumbre","comerciante","sociedades","titulos"],sim:"glosCom",nuevo:true,uso:"repaso",html:`<div class="sim" id="sim"></div>`,
  d:"Más de 50 definiciones con el artículo o la norma de donde salen, y la lista de las leyes y decretos del derecho comercial colombiano, con buscador."});
