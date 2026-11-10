// Microeconomía I · contenido de la ruta
// =====================================================================
// CONTENIDO: Microeconomía I (1503702, U. de Antioquia): competencia imperfecta.
// Demanda inversa lineal P = a − bQ y costos C(q) = F + cq + dq² en los ejemplos.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"repaso", parte:"Unidad 1 · Repaso: producción y costos", t:"Excedentes, costos, rendimientos y competencia perfecta", sim:"escala", html:String.raw`
<section><h3>La idea</h3><p class="lead">El curso estudia los mercados en los que el precio se aparta del costo marginal. Para medir cuánto se apartan y qué se pierde, primero se repasa el punto de referencia: la competencia perfecta y su eficiencia.</p></section>
<section><h3>Excedentes</h3><p>El <b>excedente del consumidor</b> es lo que los compradores estarían dispuestos a pagar menos lo que pagan: el área entre la demanda y el precio. El <b>del productor</b> es el ingreso menos el costo variable: el área entre el precio y el costo marginal. El excedente total \(W=EC+EP\) se maximiza donde \(P=CMg\).</p></section>
<section><h3>Funciones de costos y escala</h3>
<p>Con \(C(q)=F+cq+dq^2\): \(CMg=c+2dq\), \(CMe=F/q+c+dq\), mínimo del costo medio en \(q=\sqrt{F/d}\).</p>
<p>El <b>índice de economías de escala</b> es \(S=\dfrac{CMe}{CMg}\): si \(S>1\), el costo medio baja con la producción (economías de escala); si \(S<1\), sube (deseconomías). Con una sola tecnología homogénea de grado \(k\), \(S=k\): rendimientos crecientes equivalen a economías de escala.</p>
<p>Una función de costos es <b>subaditiva</b> en \(Q\) si producir todo en una empresa cuesta menos que repartirlo: \(C(Q)<C(q_1)+C(q_2)\) con \(q_1+q_2=Q\). Es la definición moderna de monopolio natural.</p></section>
<section><h3>Competencia perfecta y eficiencia de Pareto</h3>
<p>Supuestos: muchas empresas precio-aceptantes, bien homogéneo, información perfecta, libre entrada y salida, sin externalidades. Conclusiones: en el corto plazo \(P=CMg\); en el largo plazo \(P=CMg=\min CMe\) y beneficio cero. La asignación es <b>eficiente en el sentido de Pareto</b>: no se puede mejorar a nadie sin empeorar a otro. Cada estructura de mercado del curso se compara con este punto.</p></section>
${LAB}`,
qs:[{q:"Con C = 100 + 10q + q², ¿dónde es mínimo el costo medio y cuánto vale?",a:"En q = √(100/1) = 10; CMe = 10 + 10 + 10 = 30, igual al CMg (10 + 20 = 30)."},
 {q:"Si CMe = 20 y CMg = 15, ¿hay economías o deseconomías de escala?",a:"Economías: S = 20/15 = 1,33 > 1, el costo medio baja al producir más."}]},

// ===================== UNIDAD 2 =====================
{id:"empresa", parte:"Unidad 2 · La naturaleza de la empresa", t:"¿Por qué existen las empresas?", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si el mercado coordina tan bien, ¿por qué hay empresas, donde las decisiones se toman por orden y no por precios? Coase (1937) respondió: porque usar el mercado cuesta.</p></section>
<section><h3>Coase y los costos de transacción</h3>
<p>Buscar proveedores, negociar, redactar y hacer cumplir contratos tiene <b>costos de transacción</b>. Dentro de la empresa esas transacciones se reemplazan por la autoridad del empresario. La empresa crece hasta el punto en que organizar una transacción adicional dentro cuesta lo mismo que hacerla en el mercado. Williamson agregó la especificidad de los activos y el oportunismo: cuando una inversión solo sirve para una relación, conviene integrarla verticalmente.</p></section>
<section><h3>Objetivos de la empresa</h3><p>El supuesto clásico es la maximización del beneficio. Las teorías gerenciales (Baumol: maximizar ventas con un beneficio mínimo; Williamson: utilidad de los gerentes) y conductuales (Cyert y March: la empresa como coalición que busca metas satisfactorias) muestran que, cuando la propiedad está separada del control, pueden aparecer otros objetivos.</p></section>
<section><h3>Los temas de la unidad</h3>
<div class="tbl"><table><tr><th>Tema</th><th>Pregunta</th><th>Estación</th></tr>
<tr><td>Regulación</td><td>¿Cómo controlar el poder de mercado de un monopolio natural?</td><td>Monopolio natural · Regulación</td></tr>
<tr><td>Discriminación de precios</td><td>¿Cómo captura una empresa más excedente cobrando precios distintos?</td><td>Discriminación de precios</td></tr>
<tr><td>Disuasión de entrada</td><td>¿Cómo impide una empresa establecida que entren competidores?</td><td>Disuasión de entrada y mercados contestables</td></tr></table></div></section>`,
qs:[{q:"Según Coase, ¿qué determina el tamaño de una empresa?",a:"El punto en que el costo de organizar una transacción más dentro de la empresa iguala el costo de hacerla en el mercado."}]},

// ===================== UNIDAD 3 =====================
{id:"monopolio", parte:"Unidad 3 · Monopolio", t:"Equilibrio del monopolio y poder de mercado", sim:"mono", html:String.raw`
<section><h3>La idea</h3><p class="lead">El monopolista es el único vendedor: enfrenta toda la demanda del mercado y escoge el precio (o la cantidad). Vender una unidad más le obliga a bajar el precio de todas, así que su ingreso marginal es menor que el precio.</p></section>
<section><h3>Beneficio e ingreso marginal</h3>
<div class="mj">\[\pi(Q)=P(Q)\,Q-C(Q)\qquad\Longrightarrow\qquad IMg=P+Q\frac{dP}{dQ}=P\left(1-\frac1{|\varepsilon|}\right)=CMg\]</div>
<p>Con demanda lineal \(P=a-bQ\): \(IMg=a-2bQ\), con el doble de pendiente. El monopolista nunca produce en el tramo inelástico (\(|\varepsilon|<1\)), porque ahí el ingreso marginal es negativo.</p></section>
<section><h3>Poder de mercado: el índice de Lerner</h3>
<div class="mj">\[L=\frac{P-CMg}{P}=\frac1{|\varepsilon|}\qquad\Longleftrightarrow\qquad P=\frac{CMg}{1-1/|\varepsilon|}\]</div>
<p>Cuanto menos elástica es la demanda, mayor el margen. En competencia perfecta \(L=0\).</p></section>
<section><h3>Ineficiencia y beneficios extraordinarios</h3>
<p>El monopolista produce menos y cobra más que un mercado competitivo con los mismos costos. Parte del excedente del consumidor pasa al monopolista (transferencia) y otra se pierde: la <b>pérdida irrecuperable de eficiencia</b>, el triángulo entre la demanda y el costo marginal entre \(Q_m\) y \(Q_c\). Como hay barreras a la entrada, los beneficios extraordinarios persisten en el largo plazo. Además, puede haber gastos para conseguir o defender el monopolio (búsqueda de rentas, Posner) que aumentan el costo social.</p></section>
<section><h3>Ejemplo</h3><p>Con \(P=100-Q\) y \(CMg=20\): \(100-2Q=20\Rightarrow Q_m=40\), \(P_m=60\), \(\pi=1.600\), \(L=40/60=0{,}67\) y \(|\varepsilon|=60/40=1{,}5\). En competencia: \(Q_c=80\), \(P_c=20\). PIE \(=\tfrac12(80-40)(60-20)=800\).</p></section>
${LAB}`,
qs:[{q:"Si la elasticidad de la demanda es −4 y el CMg es 30, ¿qué precio cobra el monopolista?",a:"P = 30/(1 − 1/4) = 40. Lerner = 10/40 = 0,25 = 1/4."},
 {q:"¿Por qué el monopolista no tiene curva de oferta?",a:"Porque la cantidad que ofrece a un precio depende de la forma de la demanda (de su elasticidad), no solo del precio: no hay una relación única precio-cantidad."}]},

{id:"multiplanta", parte:"Unidad 3 · Monopolio", t:"Monopolista multiplanta", sim:"multi", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si el monopolista tiene varias plantas, debe decidir cuánto producir en total y cómo repartirlo. Regla: igualar el costo marginal de todas las plantas y ese costo marginal común al ingreso marginal.</p>
<div class="mj">\[IMg(Q)=CMg_1(q_1)=CMg_2(q_2)\qquad Q=q_1+q_2\]</div>
<p>Si una planta tuviera un costo marginal mayor, convendría pasar producción a la otra. Gráficamente se suma <b>horizontalmente</b> los costos marginales de las plantas y se corta con el ingreso marginal.</p></section>
<section><h3>Ejemplo</h3><p>\(P=100-Q\), \(CMg_1=10+2q_1\), \(CMg_2=20+q_2\). Con un costo marginal común \(\lambda\): \(q_1=(\lambda-10)/2\), \(q_2=\lambda-20\), así que \(Q=1{,}5\lambda-25\). Igualando \(100-2Q=\lambda\): \(\lambda=37{,}5\), \(q_1=13{,}75\), \(q_2=17{,}5\), \(Q=31{,}25\), \(P=68{,}75\).</p></section>
${LAB}`,
qs:[{q:"Una planta tiene CMg = 15 y otra CMg = 20 en el nivel actual. ¿Qué debería hacer la empresa?",a:"Pasar producción de la planta 2 a la 1 hasta igualar los costos marginales: produce lo mismo a menor costo."}]},

{id:"natural", parte:"Unidad 3 · Monopolio", t:"Monopolio natural", sim:"natural", html:String.raw`
<section><h3>La idea</h3><p class="lead">Hay industrias (acueducto, redes eléctricas, gas) en las que una sola empresa produce más barato que varias, porque el costo fijo es enorme y el costo marginal bajo. Es un monopolio natural: la competencia duplicaría costos.</p></section>
<section><h3>El problema de la regulación</h3>
<p>Con \(C=F+cQ\), el costo medio siempre baja y está por encima del marginal. Tres opciones:</p>
<div class="tbl"><table><tr><th>Regla</th><th>Precio</th><th>Resultado</th></tr>
<tr><td>Sin regulación</td><td>\(IMg=CMg\)</td><td>Beneficio extraordinario y pérdida de eficiencia</td></tr>
<tr><td><b>Primer óptimo</b></td><td>\(P=CMg\)</td><td>Eficiente, pero la empresa pierde \(F\): necesita un subsidio</td></tr>
<tr><td><b>Óptimo subsidiario</b> (segundo óptimo)</td><td>\(P=CMe\)</td><td>Beneficio cero, sin subsidio; queda algo de pérdida de eficiencia</td></tr></table></div>
<p>Otras soluciones: tarifas en dos partes (cargo fijo para cubrir \(F\) y \(P=CMg\)), precios de Ramsey si es multiproducto, o empresa pública.</p></section>
<section><h3>Ejemplo</h3><p>\(P=100-Q\), \(C=1.000+20Q\). Sin regular: \(Q=40\), \(P=60\), \(\pi=600\). Primer óptimo: \(P=20\), \(Q=80\), pérdida de 1.000. Segundo óptimo: \(100-Q=20+1.000/Q\Rightarrow Q^2-80Q+1.000=0\Rightarrow Q=64{,}49\), \(P=35{,}51\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué el primer óptimo requiere un subsidio en un monopolio natural?",a:"Porque el costo marginal está por debajo del costo medio: si P = CMg, el ingreso no alcanza a cubrir el costo fijo."}]},

{id:"disuasion", parte:"Unidad 3 · Monopolio", t:"Monopolio sostenible, disuasión de entrada y mercados contestables", sim:"limite", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un monopolio solo dura si nadie entra. La empresa establecida puede fijar un precio o una producción que haga no rentable la entrada, aunque eso le cueste parte del beneficio de monopolio.</p></section>
<section><h3>El precio límite (Bain, Sylos-Labini)</h3>
<p>Postulado de Sylos-Labini: el entrante cree que la establecida mantendrá su producción \(Q_I\). Entonces enfrenta la demanda residual \(P=a-bQ_I-bq_E\) y entra si gana algo después de su costo fijo \(F_E\). La producción límite deja al entrante con beneficio cero:</p>
<div class="mj">\[\pi_E^{\max}=\frac{(a-bQ_I-c_E)^2}{4b}-F_E=0\qquad\Longrightarrow\qquad Q_L=\frac{a-c_E-2\sqrt{bF_E}}{b},\quad P_L=a-bQ_L\]</div>
<p>Bain clasifica la entrada: <b>bloqueada</b> si el monopolio puro ya deja sin espacio al entrante (\(Q_m\ge Q_L\)); <b>disuadida</b> si a la establecida le conviene producir \(Q_L\); <b>acomodada</b> si le conviene más dejarlo entrar y actuar como líder de Stackelberg.</p></section>
<section><h3>Compromisos creíbles</h3><p>La amenaza de producir mucho solo disuade si es creíble: una vez que el rival entra, a la establecida le podría convenir acomodarse. Por eso importan los compromisos irreversibles, como invertir en capacidad (Dixit): la capacidad ya instalada baja el costo marginal de producir mucho y hace creíble la amenaza.</p></section>
<section><h3>Mercados contestables (Baumol, Panzar y Willig)</h3><p>Si la entrada y la salida son libres y sin costos hundidos, un monopolio no puede cobrar más que el costo medio: cualquier beneficio atraería una entrada "golpe y huida". Un <b>monopolio sostenible</b> es el que fija un precio que cubre sus costos y no deja espacio a un entrante rentable. Con mercados contestables, el número de empresas no indica el poder de mercado.</p></section>
<section><h3>Ejemplo</h3><p>\(P=100-Q\), costos marginales de 20 para ambas, \(F_E=100\): \(Q_L=(80-20)/1=60\), \(P_L=40\). Disuadir da \(\pi=20\cdot60=1.200\); acomodar como líder (40 unidades, el entrante 20) da 800. La entrada queda <b>disuadida</b>.</p></section>
${LAB}`,
qs:[{q:"¿Qué hace falta para que un mercado sea perfectamente contestable?",a:"Entrada y salida libres y sin costos hundidos, con acceso a la misma tecnología que la empresa establecida."}]},

{id:"discriminacion", parte:"Unidad 3 · Monopolio", t:"Discriminación de precios", sim:"discr", html:String.raw`
<section><h3>La idea</h3><p class="lead">Discriminar es vender el mismo bien a precios distintos que no se explican por diferencias de costo. Requiere poder de mercado, poder separar a los compradores e impedir la reventa.</p></section>
<section><h3>Los tres grados (Pigou)</h3>
<div class="tbl"><table><tr><th>Grado</th><th>Cómo funciona</th><th>Resultado</th></tr>
<tr><td><b>Primero</b> (perfecta)</td><td>Cobra a cada unidad su precio de reserva</td><td>Produce la cantidad competitiva: eficiente, pero todo el excedente es del vendedor</td></tr>
<tr><td><b>Segundo</b></td><td>Precios distintos según la cantidad (bloques, descuentos por volumen, tarifas en dos partes); el cliente se autoselecciona</td><td>Captura parte del excedente</td></tr>
<tr><td><b>Tercero</b></td><td>Precios distintos por grupos identificables (estudiantes, regiones)</td><td>\(IMg_1=IMg_2=CMg\): precio más alto donde la demanda es menos elástica</td></tr></table></div>
<div class="mj">\[\text{Tercer grado:}\qquad P_1\left(1-\frac1{|\varepsilon_1|}\right)=P_2\left(1-\frac1{|\varepsilon_2|}\right)=CMg\]</div></section>
<section><h3>Tarifa en dos partes</h3><p>Con consumidores iguales: cobrar \(p=CMg\) por unidad y una cuota fija igual al excedente de cada uno, \(T=EC(p)\). Así se obtiene el resultado de la discriminación de primer grado (clubes, parques de diversiones, telefonía).</p></section>
<section><h3>Ejemplo</h3><p>Dos mercados \(P_1=100-Q_1\) y \(P_2=60-Q_2\), \(CMg=20\). Discriminando: \(Q_1=40\), \(P_1=60\); \(Q_2=20\), \(P_2=40\); beneficio 2.000. Con precio único, el mejor es 50 (vende 60 unidades) y gana 1.800. Con discriminación perfecta gana 4.000.</p></section>
${LAB}`,
qs:[{q:"¿En qué mercado cobra más precio un discriminador de tercer grado?",a:"En el de demanda menos elástica: el margen (P − CMg)/P = 1/|ε| es mayor ahí."}]},

{id:"compmono", parte:"Unidad 3 · Monopolio", t:"Competencia monopolística", sim:"chamb", html:String.raw`
<section><h3>La idea</h3><p class="lead">Muchas empresas, libre entrada, pero cada una vende un producto <b>diferenciado</b> (restaurantes, ropa, peluquerías). Cada una tiene una pequeña demanda con pendiente negativa: algo de poder de mercado (Chamberlin, 1933).</p></section>
<section><h3>Corto y largo plazo</h3>
<ul><li><b>Corto plazo:</b> cada empresa actúa como un monopolio frente a su demanda: \(IMg=CMg\). Puede tener beneficios.</li>
<li><b>Largo plazo:</b> los beneficios atraen nuevas marcas, que le quitan clientes a cada empresa: su demanda se desplaza a la izquierda hasta quedar <b>tangente</b> al costo medio. Beneficio cero, pero \(P=CMe>CMg\).</li></ul>
<p>Como la tangencia ocurre en el tramo decreciente del costo medio, cada empresa produce menos que el mínimo del costo medio: <b>exceso de capacidad</b>. Es el costo de la variedad.</p></section>
<section><h3>Ejemplo</h3><p>Demanda de una empresa \(P=A-q\) y \(C=100+10q+0{,}25q^2\). Con \(A=50\): \(q=16\), \(P=34\), \(\pi=220\). En el largo plazo la tangencia exige \(A=10+2\sqrt{1{,}25\cdot100}=32{,}36\): \(q=8{,}94\), \(P=23{,}42=CMe\). El mínimo del costo medio está en \(q=20\): capacidad ociosa de 11,06 unidades.</p></section>
${LAB}`,
qs:[{q:"¿Por qué en competencia monopolística hay exceso de capacidad?",a:"Porque en el equilibrio de largo plazo la demanda de cada empresa es tangente al costo medio en su tramo decreciente, antes del mínimo."}]},

// ===================== UNIDAD 4 =====================
{id:"regulacion", parte:"Unidad 4 · Instituciones y regulación", t:"Regulación: Ramsey, tasa de ganancia y precio tope", sim:"ramsey", html:String.raw`
<section><h3>La idea</h3><p class="lead">El regulador quiere precios cercanos al costo marginal sin quebrar a la empresa. Las reglas difieren en la información que necesitan y en los incentivos que dan.</p></section>
<section><h3>Precios de Ramsey (empresa multiproducto)</h3>
<p>Si la empresa produce varios bienes y tiene un costo fijo común \(F\), el precio que maximiza el bienestar sujeto a que la empresa no pierda cumple la <b>regla de la elasticidad inversa</b>:</p>
<div class="mj">\[\frac{P_i-CMg_i}{P_i}=\frac{k}{|\varepsilon_i|},\qquad 0\le k\le1\]</div>
<p>El margen es mayor en los bienes de demanda menos elástica, porque ahí subir el precio reduce poco la cantidad y genera poca pérdida de eficiencia. Con \(k=0\) es el primer óptimo; con \(k=1\), los precios de monopolio. Críticas: cobra más a quienes no tienen alternativa (equidad).</p></section>
<section><h3>Primer óptimo y óptimo subsidiario</h3><p>\(P=CMg\) con subsidio para cubrir el costo fijo (primer óptimo), o \(P=CMe\) sin subsidio (óptimo subsidiario o segundo óptimo). Ver la estación de monopolio natural.</p></section>
<section><h3>Regulación por la tasa de ganancia</h3><p>El regulador permite una rentabilidad máxima sobre el capital invertido: \((PQ-wL)/K\le s\). Efecto <b>Averch-Johnson</b>: si \(s\) supera el costo del capital, la empresa sobreinvierte en capital (agranda la base sobre la que gana) y produce con una combinación ineficiente de factores. Además, como los costos se trasladan al precio, hay poco incentivo a reducirlos.</p></section>
<section><h3>Regulación por participación en el precio (precio tope, RPI − X)</h3><p>Se fija un tope que se ajusta con la inflación menos un factor de productividad: \(P_t=P_{t-1}(1+\text{IPC}-X)\). Si la empresa reduce costos más que \(X\), se queda con la ganancia: incentiva la eficiencia. El riesgo es que \(X\) quede mal calculado o que se descuide la calidad. En Colombia, las comisiones de regulación (CREG, CRA, CRC) usan variantes de estos esquemas.</p></section>
${LAB}`,
qs:[{q:"Según Ramsey, ¿qué servicio de una empresa regulada debe tener un margen mayor?",a:"El de demanda menos elástica: el margen es inversamente proporcional a la elasticidad."},
 {q:"¿Qué es el efecto Averch-Johnson?",a:"La sobreinversión en capital que provoca la regulación por tasa de ganancia cuando la tasa permitida supera el costo del capital."}]},

// ===================== UNIDAD 5 =====================
{id:"monopsonio", parte:"Unidad 5 · Mercado de factores", t:"Monopsonio, demanda de factores y monopolio bilateral", sim:"monops", html:String.raw`
<section><h3>La idea</h3><p class="lead">El monopsonista es el único comprador de un factor (por ejemplo, la única empresa que contrata en un pueblo). Para contratar un trabajador más debe subir el salario de todos, así que el costo marginal del factor es mayor que el salario.</p></section>
<section><h3>Demanda de factores</h3><p>Una empresa contrata hasta que el ingreso que genera el último trabajador iguala lo que le cuesta. Ese ingreso es el <b>ingreso del producto marginal</b>: \(IPMg_L=IMg\cdot PMg_L\). En competencia en el producto, \(IMg=P\) y es el valor del producto marginal \(P\cdot PMg_L\). Un monopolista en el producto contrata menos, porque \(IMg<P\).</p></section>
<section><h3>Monopsonio</h3>
<p>Con oferta de trabajo \(w=e+fL\), el gasto es \(wL\) y el <b>costo marginal del factor</b> es \(CMF=e+2fL\). El monopsonista contrata donde \(CMF=IPMg\) y paga el salario de la oferta en ese punto:</p>
<div class="mj">\[e+2fL=IPMg(L)\qquad w_m=e+fL_m<IPMg(L_m)\]</div>
<p>Contrata menos y paga menos que en competencia. Un <b>salario mínimo</b> entre \(w_m\) y el salario competitivo puede <i>aumentar</i> el empleo, porque aplana el costo marginal del factor.</p></section>
<section><h3>Monopolio bilateral</h3><p>Si frente al monopsonista hay un sindicato que actúa como monopolista del trabajo, el sindicato querría el salario donde el ingreso marginal de la demanda de trabajo iguala la oferta (salario alto) y la empresa el de monopsonio (salario bajo). El resultado queda <b>indeterminado</b> entre ambos y depende del poder de negociación.</p></section>
<section><h3>Ejemplo</h3><p>Oferta \(w=10+L\) e \(IPMg=100-L\). Competencia: \(L=45\), \(w=55\). Monopsonio: \(10+2L=100-L\Rightarrow L=30\), \(w=40\) (aunque el trabajador 30 produce 70). Sindicato: \(100-2L=10+L\Rightarrow L=30\), \(w=70\). El salario negociado queda entre 40 y 70.</p></section>
${LAB}`,
qs:[{q:"¿Por qué un salario mínimo puede aumentar el empleo en un monopsonio?",a:"Porque hasta ese salario el costo marginal de contratar es el salario mínimo (constante), menor que el CMF del monopsonista; la empresa contrata más, hasta que el salario iguala el IPMg o la oferta."}]},

{id:"cadena", parte:"Unidad 5 · Mercado de factores", t:"Monopolio en cadena (doble marginalización)", sim:"cadena", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un monopolista produce un insumo y se lo vende a otro monopolista que lo transforma en el bien final. Cada uno pone su propio margen sobre el costo: la cantidad final es menor y el precio mayor que si estuvieran integrados.</p></section>
<section><h3>El modelo</h3>
<p>Demanda final \(P=a-bQ\), una unidad de insumo por unidad de producto, costo del productor del insumo \(c\) y precio del insumo \(w\).</p>
<ul><li><b>Distribuidor</b> (aguas abajo): \(IMg=a-2bQ=w\Rightarrow Q=(a-w)/(2b)\). Esa es la demanda que enfrenta el productor del insumo.</li>
<li><b>Productor</b> (aguas arriba): maximiza \((w-c)\frac{a-w}{2b}\Rightarrow w=\frac{a+c}{2}\), así que \(Q=\frac{a-c}{4b}\).</li>
<li><b>Integrados:</b> \(Q=\frac{a-c}{2b}\), el doble.</li></ul>
<p>La integración vertical sube los beneficios conjuntos y <b>beneficia a los consumidores</b>. Alternativas sin integrarse: tarifa en dos partes (vender el insumo a \(c\) y cobrar una cuota fija) o fijar un precio máximo de reventa.</p></section>
<section><h3>Ejemplo</h3><p>\(P=100-Q\), \(c=20\): \(w=60\), \(Q=20\), \(P=80\); beneficios 800 + 400 = 1.200. Integrados: \(Q=40\), \(P=60\), beneficio 1.600.</p></section>
${LAB}`,
qs:[{q:"¿Por qué la doble marginalización perjudica también a las empresas?",a:"Porque cada una ignora que su margen reduce las ventas de la otra; integradas ganan más (1.600 frente a 1.200 en el ejemplo)."}]},

// ===================== UNIDAD 6 =====================
{id:"cournot", parte:"Unidad 6 · Oligopolio", t:"Oligopolio en cantidades: Cournot, colusión, Stackelberg y cartel", sim:"olig", html:String.raw`
<section><h3>La idea</h3><p class="lead">En un oligopolio hay pocas empresas y cada una sabe que su beneficio depende de lo que hagan las otras: hay <b>interdependencia estratégica</b>. Cada modelo hace un supuesto distinto sobre cómo reaccionan las rivales.</p></section>
<section><h3>Cournot (simultáneo, cantidades)</h3>
<p>Cada empresa escoge su cantidad tomando la de la otra como dada. Con \(P=a-b(q_1+q_2)\) y costos marginales \(c_i\), la <b>función de reacción</b> de la empresa 1 es</p>
<div class="mj">\[q_1=\frac{a-c_1-bq_2}{2b}\qquad\Longrightarrow\qquad q_1^*=\frac{a-2c_1+c_2}{3b},\quad q_2^*=\frac{a-2c_2+c_1}{3b}\]</div>
<p>El equilibrio está donde se cortan las dos funciones de reacción (equilibrio de Nash). Con \(n\) empresas iguales: \(q=\frac{a-c}{b(n+1)}\) y \(P=\frac{a+nc}{n+1}\): al crecer \(n\), el precio tiende al costo marginal.</p></section>
<section><h3>Colusión y cartel</h3><p>Si las empresas actúan juntas maximizan el beneficio conjunto como un monopolio: \(Q=(a-c)/(2b)\). Pero el acuerdo es inestable: dada la cuota de la otra, a cada una le conviene producir más (su función de reacción). Es un dilema del prisionero. Un <b>cartel</b> (la OPEP) asigna cuotas para igualar costos marginales y necesita vigilar y castigar a quien hace trampa.</p></section>
<section><h3>Stackelberg (secuencial, cantidades)</h3><p>Una empresa líder escoge primero sabiendo cómo reaccionará la seguidora. Reemplaza la función de reacción de la seguidora en su beneficio: \(q_1=\frac{a-2c_1+c_2}{2b}\). La líder produce y gana más que en Cournot (ventaja del primero en mover); la seguidora, menos.</p></section>
<section><h3>Comparación (P = 100 − Q, CMg = 10)</h3>
<div class="tbl"><table><tr><th>Modelo</th><th class="num">Q</th><th class="num">P</th><th class="num">Beneficio total</th></tr>
<tr><td>Colusión</td><td class="num">45</td><td class="num">55</td><td class="num">2.025</td></tr><tr><td>Cournot</td><td class="num">60</td><td class="num">40</td><td class="num">1.800</td></tr>
<tr><td>Stackelberg</td><td class="num">67,5</td><td class="num">32,5</td><td class="num">1.518,75</td></tr><tr><td>Bertrand (homogéneo)</td><td class="num">90</td><td class="num">10</td><td class="num">0</td></tr></table></div>
<p>Si una empresa del cartel hace trampa (la otra produce 22,5), produce 33,75 y gana 1.139 en vez de 1.012,5.</p></section>
${LAB}`,
qs:[{q:"Con P = 120 − Q y CMg = 0 para dos empresas, ¿cuál es el equilibrio de Cournot?",a:"q = 120/3 = 40 cada una, Q = 80, P = 40, beneficio 1.600 cada una."},
 {q:"¿Por qué es inestable la colusión?",a:"Porque, dada la cuota de la rival, la mejor respuesta de cada empresa es producir más que su cuota: cada una tiene incentivo a hacer trampa."}]},

{id:"precios", parte:"Unidad 6 · Oligopolio", t:"Oligopolio en precios: Bertrand, liderazgo de precios y demanda quebrada", sim:"oligp", html:String.raw`
<section><h3>Bertrand</h3>
<p>Si las empresas compiten en precios y el producto es <b>homogéneo</b>, quien cobra menos se lleva todo el mercado. Con costos iguales, el único equilibrio es \(P=CMg\) y beneficio cero, aunque solo haya dos empresas: es la <b>paradoja de Bertrand</b>. Con costos distintos, la más eficiente cobra apenas menos que el costo de la otra. La paradoja se resuelve con restricciones de capacidad (Edgeworth), competencia repetida o diferenciación.</p></section>
<section><h3>Bertrand con productos diferenciados</h3>
<p>Con \(q_i=\alpha-\beta p_i+\gamma p_j\) (\(\gamma>0\): sustitutos), la función de reacción en precios es</p>
<div class="mj">\[p_i=\frac{\alpha+\beta c_i+\gamma p_j}{2\beta}\]</div>
<p>Las funciones de reacción tienen pendiente positiva (los precios son complementos estratégicos): si la rival sube su precio, me conviene subir el mío. El precio de equilibrio queda por encima del costo marginal.</p></section>
<section><h3>Liderazgo de precios (empresa dominante)</h3><p>Una empresa grande fija el precio y un grupo de empresas pequeñas (la franja competitiva) lo toma como dado y vende lo que su oferta indique. La dominante enfrenta la <b>demanda residual</b> \(D_r(p)=D(p)-S_f(p)\) y escoge el precio donde su ingreso marginal residual iguala su costo marginal.</p></section>
<section><h3>Curva de demanda quebrada (Sweezy)</h3><p>Si una empresa sube el precio, las demás no la siguen (demanda elástica arriba del precio actual); si lo baja, todas la siguen (demanda inelástica abajo). La demanda tiene un quiebre y el ingreso marginal una <b>discontinuidad</b>: el costo marginal puede moverse dentro de ese salto sin que cambie el precio. Explica la rigidez de precios, pero no cómo se llegó al precio inicial.</p></section>
<section><h3>Ejemplo</h3><p>Diferenciados: \(q_i=100-2p_i+p_j\), \(c=10\): \(p=(100+20+p)/4\Rightarrow p=40\), \(q=60\), \(\pi=1.800\). Dominante: \(Q=200-2p\), franja \(S=2p\), \(c=10\): residual \(200-4p\), \(p=(50+10)/2=30\); la dominante vende 80 y la franja 60.</p></section>
${LAB}`,
qs:[{q:"¿Qué es la paradoja de Bertrand?",a:"Que con dos empresas, producto homogéneo, costos iguales y competencia en precios, el precio cae al costo marginal: el mismo resultado que en competencia perfecta."}]},

{id:"cooperativo", parte:"Unidad 6 · Oligopolio", t:"Teoría de juegos: cooperativos y no cooperativos", sim:"shapley", html:String.raw`
<section><h3>La idea</h3><p class="lead">La teoría de juegos formaliza la interdependencia. En los juegos <b>no cooperativos</b> cada jugador decide por su cuenta y no hay acuerdos vinculantes (Cournot, Bertrand y Stackelberg son ejemplos). En los <b>cooperativos</b>, los jugadores pueden formar coaliciones con acuerdos que se cumplen, y la pregunta es cómo repartir lo que ganan juntos.</p></section>
<section><h3>Juegos no cooperativos: breve introducción</h3><p>Elementos: jugadores, estrategias y pagos. Un <b>equilibrio de Nash</b> es una combinación de estrategias en la que nadie gana cambiando la suya si los demás no cambian. El <b>dilema del prisionero</b> muestra que el equilibrio puede ser peor para todos que la cooperación, como en el cartel. El módulo de Teoría de Juegos de Economiapp tiene los resolvedores de tablas y de árboles.</p></section>
<section><h3>Juegos cooperativos</h3>
<p>Un juego en forma de coalición asigna a cada coalición \(S\) su valor \(v(S)\). Dos soluciones:</p>
<ul><li><b>Núcleo:</b> repartos \(x\) con \(\sum_{i\in N}x_i=v(N)\) que ninguna coalición puede mejorar por su cuenta: \(\sum_{i\in S}x_i\ge v(S)\) para toda \(S\). Puede estar vacío.</li>
<li><b>Valor de Shapley:</b> cada jugador recibe su contribución marginal promedio sobre todos los órdenes posibles de llegada:</li></ul>
<div class="mj">\[\phi_i=\sum_{S\subseteq N\setminus\{i\}}\frac{|S|!\,(n-|S|-1)!}{n!}\,\big[v(S\cup\{i\})-v(S)\big]\]</div>
<p>Con tres jugadores, el núcleo existe si \(v(12)+v(13)+v(23)\le2\,v(123)\) (en juegos superaditivos y con \(v(i)=0\)).</p></section>
${LAB}`,
qs:[{q:"En un juego simétrico de 3 jugadores con v(N) = 90, ¿cuál es el valor de Shapley?",a:"30 para cada uno: por simetría reciben lo mismo y el reparto suma v(N)."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"cournot",links:["monopolio","discriminacion","regulacion","monopsonio","cournot","precios"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del parcial."}
];
const ALIAS={};
