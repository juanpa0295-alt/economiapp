// =====================================================================
// CONTENIDO: Macroeconomía III (1503713, U. de Antioquia): problemas de la política macroeconómica
// y finanzas públicas (teoría de la tributación). Bibliografía: Argandoña et al.; Carlin y Soskice; De Gregorio;
// Romer; Albi et al.; Gruber; Rosen; Fergusson y Suárez.
// =====================================================================
const GUIA_ID="m3";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Política macroeconómica",2:"Unidad 2 · Finanzas públicas"};
const U1="Unidad 1 · Los problemas de la política macroeconómica",U2="Unidad 2 · Finanzas públicas: teoría de la tributación";
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"estado", parte:U1, u:1, t:"El papel del Estado en la economía", sim:"tarjetas", html:String.raw`
<section><h3>Por qué existe el Estado</h3><p class="lead">Desde la economía, el Estado puede verse como una <b>mejora paretiana</b>: hay bienes y reglas (seguridad, contratos, derechos de propiedad, bienes públicos) que los individuos no producen bien por sí solos por problemas de acción colectiva, y un poder común que los provea puede mejorar a todos.</p>
<p>Musgrave clasificó sus funciones en tres: <b>asignación</b> (corregir fallas de mercado: bienes públicos, externalidades, monopolio natural, información), <b>distribución</b> (redistribuir ingreso y riqueza) y <b>estabilización</b> (suavizar el ciclo y mantener precios estables).</p></section>
<section><h3>El tamaño del Estado y sus determinantes</h3><p>El gasto público como proporción del PIB creció mucho en el siglo XX en casi todos los países. Hipótesis:</p><ul>
<li><b>Ley de Wagner</b> (demanda): al crecer el ingreso, la demanda de servicios públicos (educación, salud, regulación) crece más que proporcionalmente.</li>
<li><b>Efecto Baumol</b> (oferta): los servicios públicos son intensivos en trabajo y su productividad crece poco, así que su costo relativo sube.</li>
<li><b>Efecto desplazamiento</b> (Peacock y Wiseman): guerras y crisis elevan el gasto, que luego no vuelve al nivel previo.</li>
<li><b>Economía política</b>: grupos de interés, burocracias que maximizan presupuesto (Niskanen), votante mediano con ingreso menor al promedio que pide redistribución (Meltzer y Richard).</li></ul>
<p>La pregunta normativa (¿qué debe hacer el Estado?) no tiene un consenso: va desde el Estado mínimo hasta el Estado de bienestar. La escuela de la elección pública (Buchanan) añade que el gobierno no es un ente benévolo: también tiene <b>fallas de gobierno</b>.</p></section>
${LAB}`,
qs:[{q:"¿Cuáles son las tres funciones del Estado según Musgrave?",a:"Asignación, distribución y estabilización."}]},

{id:"reglas", parte:U1, u:1, t:"Reglas frente a discreción y la regla de Taylor", sim:"taylor", html:String.raw`
<section><h3>Dos concepciones de la política económica</h3><p class="lead">La concepción tradicional (Tinbergen) ve al gobierno como un planificador que elige instrumentos para alcanzar objetivos: <b>política discrecional</b>, decidida periodo a periodo. Desde los setenta ganó fuerza la idea de seguir <b>reglas</b> anunciadas.</p>
<div class="tbl"><table><tr><th></th><th>Ventajas</th><th>Inconvenientes</th></tr><tr><td>Discreción</td><td>Flexibilidad ante choques imprevistos</td><td>Sesgo inflacionario y deficitario, rezagos, presiones políticas</td></tr><tr><td>Reglas</td><td>Credibilidad, ancla expectativas, transparencia</td><td>Rigidez ante choques; tentación de abandonarlas</td></tr></table></div>
<p>Argumentos a favor de las reglas: los <b>rezagos</b> largos y variables de la política (Friedman), la <b>crítica de Lucas</b> (los parámetros cambian cuando cambia la política) y la <b>inconsistencia dinámica</b> (Kydland y Prescott).</p></section>
<section><h3>Reglas monetarias y fiscales</h3><ul><li><b>Regla de Friedman:</b> crecimiento constante de la cantidad de dinero.</li><li><b>Regla de Taylor (1993):</b> \(i_t=r^*+\pi_t+a(\pi_t-\pi^*)+b(y_t-y^*)\), con \(a=b=0{,}5\) en la versión original. El <b>principio de Taylor</b> pide que la tasa nominal suba más que uno a uno con la inflación (\(1+a>1\)) para que la tasa real suba.</li><li><b>Metas de inflación:</b> una «discreción restringida»; Colombia la adoptó en 1999-2000, con meta de largo plazo de 3 %.</li><li><b>Reglas fiscales:</b> de balance estructural, de deuda o de gasto. Colombia tiene regla fiscal desde la Ley 1473 de 2011, modificada por la Ley 2155 de 2021 (ancla de deuda neta).</li></ul></section>
${LAB}`,
qs:[{q:"Con r* = 2 %, π* = 3 %, π = 5 % y brecha del producto 1 %, ¿qué tasa da la regla de Taylor original?",a:"i = 2 + 5 + 0,5(5 − 3) + 0,5(1) = 8,5 %."}]},

{id:"eficacia", parte:U1, u:1, t:"Eficacia de la política de estabilización", sim:"lucas", html:String.raw`
<section><h3>Información imperfecta: la curva de Lucas</h3><p class="lead">En el modelo de islas de Lucas, los productores no distinguen si un aumento de su precio es relativo o general. La oferta agregada responde solo a la parte <b>no anticipada</b> del nivel de precios:</p>
<div class="mj">\[y_t=y^*+b\,(p_t-E_{t-1}p_t)\]</div>
<p>Con expectativas racionales, la política monetaria anticipada solo mueve precios (proposición de inefectividad de Sargent y Wallace); únicamente las sorpresas mueven el producto, y no de forma sistemática.</p></section>
<section><h3>Rigideces nominales</h3><p>Si los precios o salarios se fijan por adelantado (contratos de Fischer y Taylor, costos de menú, precios escalonados de Calvo), incluso la política anticipada tiene efectos reales en el corto plazo, porque parte de los precios no puede ajustarse. Es la base de los modelos neokeynesianos.</p></section>
<section><h3>Economía abierta: Mundell-Fleming</h3><p>Con movilidad perfecta de capitales, la política monetaria es eficaz con <b>tipo de cambio flexible</b> (actúa vía depreciación) e ineficaz con tipo fijo; la fiscal es eficaz con tipo fijo y se anula con tipo flexible (la apreciación desplaza exportaciones netas). Es la «trinidad imposible»: no se pueden tener a la vez tipo de cambio fijo, libre movilidad de capitales y política monetaria autónoma.</p></section>
${LAB}`,
qs:[{q:"Según Sargent y Wallace, ¿qué efecto tiene una expansión monetaria anunciada?",a:"Ninguno sobre el producto: solo sube el nivel de precios, porque está incorporada en las expectativas."}]},

{id:"deuda", parte:U1, u:1, t:"Déficit, restricción intertemporal y sostenibilidad de la deuda", sim:"deuda", html:String.raw`
<section><h3>La restricción presupuestaria del gobierno</h3><div class="mj">\[B_{t}=(1+i)B_{t-1}+G_t-T_t-\Delta M_t\]</div>
<p>El déficit total se financia con deuda o con emisión. Si se excluyen los intereses se habla de <b>balance primario</b>. Iterando hacia adelante se obtiene la <b>restricción intertemporal</b>: el valor presente de los superávits primarios futuros debe cubrir la deuda actual (condición de no-Ponzi).</p></section>
<section><h3>Dinámica de la razón deuda/PIB</h3><div class="mj">\[d_t=\frac{1+r}{1+g}\,d_{t-1}-s_t\qquad\Rightarrow\qquad \Delta d_t\approx(r-g)\,d_{t-1}-s_t\]</div>
<p>\(d\) es deuda/PIB, \(r\) la tasa de interés real, \(g\) el crecimiento real y \(s\) el superávit primario en % del PIB. Para <b>estabilizar</b> la deuda en \(d\):</p><div class="mj">\[s^*=\frac{r-g}{1+g}\,d\]</div>
<p>Si \(r>g\), hace falta un superávit primario; si \(r<g\), la deuda puede estabilizarse incluso con déficit primario. El «efecto bola de nieve» es el término \((r-g)d\). La deuda es <b>sostenible</b> si el superávit requerido es política y económicamente factible.</p></section>
${LAB}`,
qs:[{q:"Con d = 60 %, r = 4 % y g = 2 %, ¿qué superávit primario estabiliza la deuda?",a:"s* = (0,04 − 0,02)/1,02 × 60 ≈ 1,18 % del PIB."}]},

{id:"senoreaje", parte:U1, u:1, t:"Señoreaje e impuesto inflacionario", sim:"senor", html:String.raw`
<section><h3>Financiar el déficit con emisión</h3><p class="lead">El <b>señoreaje</b> es el ingreso real que obtiene el gobierno al emitir dinero: \(S=\Delta M/P=\mu\,(M/P)\). En estado estacionario la inflación iguala la tasa de crecimiento del dinero (menos el crecimiento del producto), y el señoreaje se convierte en un <b>impuesto inflacionario</b> \(\pi\cdot m\): la inflación reduce el valor real de los saldos que tiene el público.</p></section>
<section><h3>La curva de Laffer del señoreaje (Cagan)</h3><div class="mj">\[m=\frac{M}{P}=A\,e^{-\alpha\pi}\qquad S(\pi)=\pi A e^{-\alpha\pi}\qquad \pi_{max}=\frac1\alpha\]</div>
<p>Al subir la inflación, el público reduce sus saldos reales y la base del impuesto se achica: el señoreaje tiene un máximo. Si el gobierno necesita financiar un déficit mayor que el señoreaje máximo, la inflación se dispara: así se explican las <b>hiperinflaciones</b> (Cagan, 1956).</p><p>Sargent y Wallace («aritmética monetarista desagradable»): si la política fiscal es dominante y no ajusta, el banco central termina monetizando, de modo que una política monetaria restrictiva hoy puede traer más inflación mañana.</p></section>
${LAB}`,
qs:[{q:"Con α = 2 (π en tanto por uno), ¿qué inflación maximiza el señoreaje?",a:"π = 1/α = 0,5, es decir 50 % por periodo."}]},

{id:"ricardiana", parte:U1, u:1, t:"Equivalencia ricardiana y suavización de impuestos", sim:"ricardo", html:String.raw`
<section><h3>Equivalencia ricardiana (Barro, 1974)</h3><p class="lead">Si los hogares son racionales, tienen horizonte infinito (o se preocupan por sus descendientes) y pueden prestar y endeudarse a la misma tasa que el gobierno, una rebaja de impuestos financiada con deuda <b>no cambia el consumo</b>: los hogares ahorran todo el recorte para pagar los impuestos futuros que necesitará el servicio de la deuda.</p>
<div class="mj">\[c_1+\frac{c_2}{1+r}=(y_1-T_1)+\frac{y_2-T_2}{1+r},\qquad \Delta T_1=-\Delta,\ \Delta T_2=(1+r)\Delta\ \Rightarrow\ \text{riqueza sin cambio}\]</div>
<p>Razones por las que falla: restricciones de liquidez, horizontes finitos sin herencias, miopía, impuestos distorsionantes, incertidumbre sobre quién pagará. La evidencia empírica la rechaza en su versión fuerte, pero muestra compensaciones parciales del ahorro privado.</p></section>
<section><h3>Suavización de impuestos (Barro, 1979)</h3><p>Si el costo de eficiencia de los impuestos crece con el cuadrado de la tasa, conviene mantener la tasa <b>constante</b> en el tiempo y absorber los gastos transitorios (guerras, recesiones, desastres) con déficits y superávits. La deuda sirve de amortiguador: es una teoría normativa del déficit.</p></section>
${LAB}`,
qs:[{q:"Si un hogar tiene restricción de liquidez, ¿se cumple la equivalencia ricardiana?",a:"No: el recorte de impuestos le permite consumir más hoy, algo que el mercado de crédito no le permitía."}]},

{id:"multiplicadores", parte:U1, u:1, t:"Multiplicadores fiscales y contracciones expansivas", sim:"mult", html:String.raw`
<section><h3>¿Cuánto vale el multiplicador?</h3><p class="lead">El multiplicador fiscal es el cambio del PIB por cada peso de gasto o de recorte de impuestos. En el modelo keynesiano simple es \(1/(1-c)\), pero en la práctica es mucho menor porque intervienen:</p><ul>
<li><b>Impuestos y filtraciones:</b> \(1/(1-c(1-t)+m)\).</li><li><b>Respuesta monetaria:</b> si el banco central sube tasas, la inversión cae (efecto expulsión).</li><li><b>Tipo de cambio:</b> con tipo flexible y capital móvil el multiplicador es menor.</li><li><b>Expectativas</b> (ricardianas o de mayores impuestos futuros) y nivel de deuda: con deuda alta los multiplicadores son menores.</li></ul>
<p>La literatura reciente (Blanchard y Leigh, 2013; Ilzetzki, Mendoza y Végh) encontró multiplicadores mayores en recesión y con la tasa de interés en su límite inferior, y menores en economías abiertas, con tipo flexible o endeudadas.</p></section>
<section><h3>Contracciones fiscales expansivas</h3><p>Giavazzi y Pagano (1990) estudiaron Dinamarca e Irlanda en los ochenta: ajustes fiscales grandes acompañados de crecimiento. El canal son las <b>expectativas</b>: un ajuste creíble reduce la prima de riesgo y las tasas de interés, y aumenta la riqueza esperada (menos impuestos futuros). Alesina y Ardagna sostuvieron que los ajustes vía gasto son menos recesivos que vía impuestos; el FMI (2010) y otros encontraron que, en promedio, las consolidaciones sí son contractivas en el corto plazo.</p></section>
${LAB}`,
qs:[{q:"¿Cuándo es más probable una contracción fiscal expansiva?",a:"Cuando la deuda es alta y el ajuste es creíble y grande, de modo que caen las tasas de interés y mejoran las expectativas de impuestos futuros."}]},

{id:"inconsistencia", parte:U1, u:1, t:"Inconsistencia dinámica y sesgo inflacionario", sim:"bg", html:String.raw`
<section><h3>El modelo de Barro y Gordon (1983)</h3><p class="lead">El banco central quiere producto por encima del natural (\(k>1\)) y baja inflación. Con una curva de Phillips con expectativas \(y=y^*+b(\pi-\pi^e)\), minimiza</p>
<div class="mj">\[L=\tfrac12(y-ky^*)^2+\tfrac a2\pi^2\]</div>
<p><b>Discreción:</b> tomando \(\pi^e\) como dado, la autoridad tiene incentivo a sorprender. El público lo anticipa y en equilibrio \(\pi=\pi^e\):</p><div class="mj">\[\pi^{D}=\frac{b(k-1)y^*}{a}\qquad y=y^*\]</div>
<p>El resultado es inflación positiva <b>sin ganancia de producto</b>: el sesgo inflacionario. <b>Compromiso (regla):</b> \(\pi=0\) con el mismo producto, menor pérdida. La regla óptima no es creíble: si el público la cree, a la autoridad le conviene incumplirla (Kydland y Prescott, 1977).</p></section>
<section><h3>Soluciones</h3><ul><li><b>Reputación</b> en juegos repetidos: el costo de perder credibilidad sostiene la regla si la autoridad valora lo suficiente el futuro.</li><li><b>Banquero central conservador</b> (Rogoff, 1985): delegar en alguien con mayor peso \(a\) a la inflación reduce el sesgo, a costa de estabilizar menos los choques.</li><li><b>Independencia del banco central</b> (en Colombia, Constitución de 1991), <b>contratos</b> (Walsh) y <b>metas de inflación</b>.</li></ul></section>
${LAB}`,
qs:[{q:"En Barro-Gordon, ¿qué pasa con el sesgo inflacionario si la autoridad da más peso a la inflación (sube a)?",a:"Disminuye: π = b(k − 1)y*/a."}]},

{id:"sesgo-deficitario", parte:U1, u:1, t:"Sesgo deficitario: tragedia de los comunes, deuda estratégica y estabilización retardada", sim:"comunes", html:String.raw`
<section><h3>¿Por qué persisten los déficits?</h3><p class="lead">La economía política ofrece tres explicaciones del sesgo hacia el déficit:</p>
<ul><li><b>Tragedia de los comunes del presupuesto</b> (Weingast, Shepsle y Johnsen; Velasco): cada grupo (región, ministerio, partido) recibe todo el beneficio de su gasto pero paga solo una fracción \(1/n\) del costo, financiado con el fondo común de impuestos. El gasto total crece con \(n\) («ley de 1/n»). Solución: reglas fiscales y procesos presupuestarios jerárquicos que centralicen la decisión en el ministerio de Hacienda.</li>
<li><b>Acumulación estratégica de deuda</b> (Persson y Svensson; Alesina y Tabellini): un gobierno que sabe que puede perder las elecciones endeuda al país para limitar el gasto de su sucesor en las prioridades de este. Más polarización y más probabilidad de perder implican más deuda.</li>
<li><b>Estabilización retardada</b> (Alesina y Drazen, 1991): una «guerra de desgaste» entre grupos que no se ponen de acuerdo sobre quién paga el ajuste; cada uno espera que el otro ceda, y el ajuste se pospone aunque todos pierdan con la demora.</li></ul></section>
${LAB}`,
qs:[{q:"Según la ley de 1/n, ¿qué ocurre con el gasto al aumentar el número de grupos que deciden?",a:"Aumenta, porque cada grupo internaliza una fracción menor del costo de financiarlo."}]},

// ===================== UNIDAD 2 =====================
{id:"impuestos", parte:U2, u:2, t:"Ingresos públicos, principios de la imposición y el sistema colombiano", sim:"iva", html:String.raw`
<section><h3>Ingresos y elementos del impuesto</h3><p class="lead">Los ingresos públicos son tributarios (impuestos, tasas, contribuciones) y no tributarios (rentas de empresas públicas, regalías, venta de activos). Un <b>impuesto</b> es un pago obligatorio sin contraprestación directa. Sus elementos: <b>hecho generador</b>, <b>sujeto activo y pasivo</b>, <b>base gravable</b> y <b>tarifa</b>.</p></section>
<section><h3>Principios de un buen sistema tributario</h3><ul><li><b>Eficiencia:</b> distorsionar lo menos posible las decisiones.</li><li><b>Equidad horizontal</b> (iguales pagan igual) y <b>vertical</b> (quien tiene más capacidad paga más).</li><li><b>Simplicidad</b> y bajos costos de administración y cumplimiento.</li><li><b>Flexibilidad</b> ante el ciclo.</li><li><b>Transparencia</b> (responsabilidad política).</li></ul></section>
<section><h3>Estructura en Colombia (nacional)</h3><ul><li><b>Renta de personas naturales:</b> tabla marginal progresiva en UVT (0 % a 39 %, art. 241 del Estatuto Tributario).</li><li><b>Renta de sociedades:</b> tarifa general de 35 %.</li><li><b>IVA:</b> tarifa general de 19 %, diferencial de 5 %, bienes exentos (tarifa 0 con derecho a devolución) y excluidos (fuera del impuesto).</li><li><b>Gravamen a los movimientos financieros</b> (4 por mil), aranceles, impuesto al patrimonio, impuestos al consumo.</li><li>Territoriales: industria y comercio (ICA) y predial en los municipios; licores, cigarrillos y registro en los departamentos.</li></ul>
<p>Las normas cambian con cada reforma: verifica las tarifas vigentes en el Estatuto Tributario. La UVT de 2026 es de 52.374 pesos (Resolución DIAN 000238 de 2025).</p></section>
${LAB}`,
qs:[{q:"¿Qué diferencia hay entre un bien exento y uno excluido de IVA?",a:"El exento está gravado a tarifa 0 y su productor recupera el IVA pagado en insumos; el excluido no es sujeto del impuesto y el IVA de los insumos se vuelve costo."}]},

{id:"exceso-gravamen", parte:U2, u:2, t:"Incidencia y exceso de gravamen", sim:"dwl", html:String.raw`
<section><h3>Incidencia: quién paga realmente</h3><p class="lead">La <b>incidencia legal</b> dice quién entrega el impuesto al Estado; la <b>incidencia económica</b>, quién soporta la carga. En equilibrio parcial competitivo no importa a quién se le cobre: la carga se reparte según las elasticidades.</p>
<div class="mj">\[\text{parte del consumidor}=\frac{\varepsilon_s}{\varepsilon_s+|\varepsilon_d|}\qquad \text{parte del productor}=\frac{|\varepsilon_d|}{\varepsilon_s+|\varepsilon_d|}\]</div>
<p>Paga más el lado <b>menos elástico</b>. En equilibrio general (Harberger, 1962) un impuesto en un sector se traslada a los factores de toda la economía.</p></section>
<section><h3>Exceso de gravamen (pérdida irrecuperable)</h3><p>Un impuesto recauda, pero además distorsiona: la pérdida de excedentes supera el recaudo. Para cambios pequeños (triángulo de Harberger):</p>
<div class="mj">\[EG\approx\frac12\,\frac{\varepsilon_s|\varepsilon_d|}{\varepsilon_s+|\varepsilon_d|}\,t^2\,P\,Q\]</div>
<p>Crece con el <b>cuadrado de la tasa</b> y con las elasticidades. Por eso conviene una base amplia con tasas bajas, y por eso los impuestos que no cambian la conducta (de suma fija) no tienen exceso de gravamen.</p></section>
${LAB}`,
qs:[{q:"Si la tasa de un impuesto se duplica, ¿qué pasa con el exceso de gravamen?",a:"Se multiplica aproximadamente por 4, porque depende de t²."}]},

{id:"optima", parte:U2, u:2, t:"Imposición óptima: eficiencia y equidad", sim:"ramsey", html:String.raw`
<section><h3>Regla de Ramsey (1927)</h3><p class="lead">Para recaudar una suma dada con impuestos sobre bienes minimizando el exceso de gravamen, las tasas deben reducir en la misma proporción la cantidad demandada de cada bien. Con demandas independientes, esto da la <b>regla de la elasticidad inversa</b>:</p>
<div class="mj">\[\frac{t_i}{1+t_i}\propto\frac{1}{|\varepsilon_i|}\qquad\Rightarrow\qquad \frac{t_1}{t_2}\approx\frac{|\varepsilon_2|}{|\varepsilon_1|}\]</div>
<p>Gravar más lo menos elástico es eficiente, pero suele ser regresivo (alimentos, servicios básicos). Corlett y Hague: gravar más los bienes complementarios del ocio.</p></section>
<section><h3>Eficiencia y equidad</h3><p>La imposición óptima del ingreso (Mirrlees, 1971) equilibra redistribución y desincentivos al trabajo: la tasa marginal óptima depende de la elasticidad del ingreso a la tasa, de la forma de la distribución y del peso social de cada grupo. Diamond y Saez (2011) derivan una tasa máxima \(\tau^*=1/(1+a\,e)\), con \(e\) la elasticidad del ingreso gravable y \(a\) el parámetro de Pareto de la cola de la distribución. Atkinson y Stiglitz (1976): con un buen impuesto al ingreso, la imposición diferenciada de bienes no es necesaria para redistribuir.</p></section>
${LAB}`,
qs:[{q:"Si |ε₁| = 0,5 y |ε₂| = 2, según Ramsey ¿qué bien debe tener mayor tasa?",a:"El bien 1, el menos elástico; aproximadamente cuatro veces la tasa del bien 2."}]},

{id:"renta", parte:U2, u:2, t:"Impuesto sobre la renta y progresividad", sim:"renta", html:String.raw`
<section><h3>¿Por qué gravar la renta?</h3><p class="lead">El ingreso es una buena medida de la capacidad de pago. La definición amplia de renta de <b>Haig-Simons</b> es consumo más variación del patrimonio. En la práctica se excluyen ganancias no realizadas, rentas imputadas y muchos beneficios, lo que estrecha la base.</p></section>
<section><h3>Tasa media y marginal; progresividad</h3><p>Un impuesto es <b>progresivo</b> si la tasa media \(T(Y)/Y\) crece con el ingreso, lo que ocurre cuando la tasa marginal supera la media. Medidas de progresividad global:</p><ul>
<li><b>Índice de Kakwani:</b> \(K=C_T-G_X\), diferencia entre el coeficiente de concentración del impuesto y el Gini del ingreso antes de impuestos. \(K>0\): progresivo.</li>
<li><b>Índice de Reynolds-Smolensky:</b> \(RS=G_X-G_{X-T}\): cuánto reduce el impuesto el Gini (efecto redistributivo). Aproximadamente \(RS\approx\frac{t}{1-t}K\), con \(t\) la tasa media: la redistribución depende de la progresividad y del <b>tamaño</b> del recaudo.</li></ul></section>
<section><h3>La tabla colombiana (art. 241 del Estatuto Tributario)</h3><div class="tbl"><table><tr><th>Renta gravable en UVT</th><th>Tarifa marginal</th><th>Impuesto</th></tr><tr><td>0 a 1.090</td><td>0 %</td><td>0</td></tr><tr><td>1.090 a 1.700</td><td>19 %</td><td>(base − 1.090) × 19 %</td></tr><tr><td>1.700 a 4.100</td><td>28 %</td><td>(base − 1.700) × 28 % + 116 UVT</td></tr><tr><td>4.100 a 8.670</td><td>33 %</td><td>(base − 4.100) × 33 % + 788 UVT</td></tr><tr><td>8.670 a 18.970</td><td>35 %</td><td>(base − 8.670) × 35 % + 2.296 UVT</td></tr><tr><td>18.970 a 31.000</td><td>37 %</td><td>(base − 18.970) × 37 % + 5.901 UVT</td></tr><tr><td>Más de 31.000</td><td>39 %</td><td>(base − 31.000) × 39 % + 10.352 UVT</td></tr></table></div>
<p class="hint">Estudios empíricos para Colombia muestran que la renta personal recauda poco y que la mayor parte de la carga cae en asalariados formales; las rentas exentas y deducciones reducen la progresividad efectiva.</p></section>
${LAB}`,
qs:[{q:"Una renta gravable de 2.000 UVT, ¿cuánto paga?",a:"(2.000 − 1.700) × 28 % + 116 = 84 + 116 = 200 UVT: tasa media del 10 %, marginal del 28 %."}]},

{id:"sociedades", parte:U2, u:2, t:"Impuesto a las sociedades, IVA y riqueza", sim:"quiz", html:String.raw`
<section><h3>Impuesto sobre las sociedades</h3><p class="lead">¿Tiene sentido gravar a las empresas si al final los impuestos los pagan personas? Se justifica como retención anticipada de la renta de los accionistas, por los beneficios de la responsabilidad limitada y para gravar a inversionistas extranjeros. Sus efectos: eleva el <b>costo de uso del capital</b> y reduce la inversión; favorece la <b>deuda</b> sobre el capital propio porque los intereses son deducibles; y se traslada en parte a trabajadores y consumidores.</p></section>
<section><h3>Impuestos al consumo y el IVA</h3><p>Gravar el consumo no distorsiona la decisión de ahorro (a diferencia de la renta, que grava doble el ahorro). El <b>IVA</b> grava en cada etapa solo el valor agregado: cada empresa cobra IVA en sus ventas y descuenta el que pagó en sus compras. Ventajas: autocontrol entre contribuyentes, recaudo amplio y estable, neutralidad respecto a la integración vertical. Inconveniente: es regresivo frente al ingreso corriente si no hay tarifas diferenciadas o compensación (Colombia creó la devolución del IVA a hogares vulnerables, que se empezó a pagar en 2020).</p></section>
<section><h3>Impuestos sobre la riqueza</h3><p>Predial, patrimonio, herencias y ganancias ocasionales. Se justifican por equidad (la riqueza está más concentrada que el ingreso) y porque el predial grava una base inmóvil. Problemas: valoración, liquidez del contribuyente y fuga de capitales.</p></section>
<section><h3>Imposición, oferta de trabajo, ahorro y evasión</h3><p>Un impuesto al salario tiene <b>efecto sustitución</b> (el ocio se abarata: menos trabajo) y <b>efecto ingreso</b> (más pobre: más trabajo); el resultado neto es empírico. La evidencia muestra respuestas pequeñas en horas de hombres en edad prima y mayores en la participación de mujeres y en el ingreso declarado. La <b>evasión</b> (ilegal) y la <b>elusión</b> (legal, aprovechando vacíos) dependen de la probabilidad de detección, las sanciones y la moral tributaria (Allingham y Sandmo, 1972).</p></section>
${LAB}`,
qs:[{q:"¿Por qué el impuesto a la renta de sociedades favorece la deuda?",a:"Porque los intereses son deducibles y los dividendos no, de modo que financiarse con deuda reduce la base gravable."}]},

{id:"equidad", parte:U2, u:2, t:"Equidad, progresividad y límites de la redistribución", sim:"okun", html:String.raw`
<section><h3>Enfoques de justicia distributiva</h3><ul><li><b>Utilitarismo</b> (Bentham): maximizar la suma de utilidades. Con utilidad marginal decreciente, lleva a igualar ingresos si no hay costos de eficiencia.</li><li><b>Rawls:</b> maximizar el bienestar del peor situado (maximin), elegido tras el «velo de la ignorancia».</li><li><b>Libertarismo</b> (Nozick): lo justo es el proceso, no el resultado; redistribuir viola derechos.</li><li><b>Igualdad de oportunidades</b> (Roemer) y enfoque de capacidades (Sen).</li></ul></section>
<section><h3>Eficiencia frente a equidad</h3><p>Okun (1975) lo ilustró con el <b>balde que gotea</b>: al transferir de ricos a pobres, parte del dinero se pierde en costos administrativos y en desincentivos al trabajo y al ahorro. Cuánta gota tolerar depende del juicio de valor sobre la distribución. La progresividad se implementa con tarifas marginales crecientes, mínimos exentos, transferencias focalizadas y gasto social; su límite son los costos de eficiencia y la capacidad administrativa.</p></section>
${LAB}`,
qs:[{q:"Si de cada 100 pesos quitados a un rico llegan 60 al pobre, ¿cuánto «gotea» el balde?",a:"El 40 %."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"estado",links:["estado","inconsistencia","exceso-gravamen"],sim:"tarjetas",html:WSBOX,d:"Los conceptos de las dos unidades en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"equidad",links:["deuda","renta"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas de ensayo",anchor:"equidad",links:["reglas","sesgo-deficitario","optima"],sim:"abiertas",html:WSBOX,d:"Preguntas de desarrollo con esquema de respuesta."}];
const ALIAS={};

const GL=[
{u:1,t:"Funciones del Estado (Musgrave)",d:"Asignación, distribución y estabilización."},
{u:1,t:"Ley de Wagner",d:"El gasto público crece más que proporcionalmente con el ingreso."},
{u:1,t:"Efecto Baumol",d:"Los servicios públicos encarecen relativamente porque su productividad crece poco."},
{u:1,t:"Crítica de Lucas",d:"Los parámetros de los modelos cambian cuando cambia la política, porque las expectativas se ajustan."},
{u:1,t:"Regla de Taylor",d:"i = r* + π + a(π − π*) + b(y − y*): la tasa de interés reacciona a la inflación y a la brecha del producto."},
{u:1,t:"Principio de Taylor",d:"La tasa nominal debe subir más de un punto por cada punto de inflación, para que suba la tasa real."},
{u:1,t:"Proposición de inefectividad",d:"Con expectativas racionales y precios flexibles, la política monetaria anticipada no afecta el producto."},
{u:1,t:"Balance primario",d:"Ingresos menos gastos del gobierno, excluyendo los intereses de la deuda."},
{u:1,t:"Restricción presupuestaria intertemporal",d:"El valor presente de los superávits primarios futuros debe igualar la deuda actual."},
{u:1,t:"Efecto bola de nieve",d:"Aumento automático de la deuda/PIB cuando la tasa de interés supera al crecimiento: (r − g)d."},
{u:1,t:"Señoreaje",d:"Ingreso real del gobierno por emitir dinero: ΔM/P."},
{u:1,t:"Impuesto inflacionario",d:"Pérdida de valor real de los saldos monetarios del público por la inflación: π·m."},
{u:1,t:"Equivalencia ricardiana",d:"Un recorte de impuestos financiado con deuda no cambia el consumo si los hogares anticipan los impuestos futuros."},
{u:1,t:"Suavización de impuestos",d:"Mantener tasas estables y absorber gastos transitorios con deuda minimiza el costo de eficiencia."},
{u:1,t:"Contracción fiscal expansiva",d:"Ajuste fiscal acompañado de crecimiento por el efecto de las expectativas y las tasas de interés."},
{u:1,t:"Inconsistencia dinámica",d:"Una política óptima anunciada hoy deja de ser óptima mañana, así que no es creíble."},
{u:1,t:"Sesgo inflacionario",d:"Inflación positiva sin ganancia de producto que resulta de la discreción (Barro y Gordon)."},
{u:1,t:"Banquero central conservador",d:"Delegar en alguien con más aversión a la inflación reduce el sesgo inflacionario (Rogoff)."},
{u:1,t:"Tragedia de los comunes presupuestaria",d:"Cada grupo paga solo 1/n del costo de su gasto, lo que eleva el gasto total."},
{u:1,t:"Estabilización retardada",d:"Guerra de desgaste entre grupos que posterga un ajuste fiscal necesario (Alesina y Drazen)."},
{u:2,t:"Hecho generador",d:"Situación definida por la ley cuya realización origina la obligación tributaria."},
{u:2,t:"Equidad horizontal y vertical",d:"Iguales pagan igual; quienes tienen más capacidad pagan más."},
{u:2,t:"Incidencia económica",d:"Quién soporta realmente la carga de un impuesto, según las elasticidades."},
{u:2,t:"Exceso de gravamen",d:"Pérdida de bienestar adicional al recaudo, causada por la distorsión del impuesto."},
{u:2,t:"Impuesto de suma fija",d:"Impuesto que no depende de ninguna decisión del contribuyente y por eso no distorsiona."},
{u:2,t:"Regla de Ramsey",d:"Las tasas eficientes son inversamente proporcionales a las elasticidades de demanda."},
{u:2,t:"Renta Haig-Simons",d:"Consumo más variación del patrimonio en el periodo."},
{u:2,t:"Tasa marginal",d:"Impuesto adicional por un peso más de ingreso."},
{u:2,t:"Tasa media",d:"Impuesto total dividido por el ingreso."},
{u:2,t:"Índice de Kakwani",d:"Coeficiente de concentración del impuesto menos el Gini del ingreso: mide la progresividad."},
{u:2,t:"Índice de Reynolds-Smolensky",d:"Gini antes menos Gini después de impuestos: mide el efecto redistributivo."},
{u:2,t:"IVA",d:"Impuesto al consumo que grava en cada etapa el valor agregado, descontando el IVA de las compras."},
{u:2,t:"Bien exento",d:"Gravado a tarifa 0 con derecho a recuperar el IVA de los insumos."},
{u:2,t:"Bien excluido",d:"No sujeto a IVA; el IVA de los insumos se vuelve costo."},
{u:2,t:"Elusión y evasión",d:"Elusión: reducir el impuesto aprovechando la ley; evasión: dejar de pagar ilegalmente."},
{u:2,t:"Balde que gotea (Okun)",d:"Parte de lo que se redistribuye se pierde por costos administrativos y desincentivos."}];
const MCQ=[
{u:1,q:"Según la regla de Taylor original, si la inflación sube 1 punto, la tasa de interés nominal sube:",o:["0,5 puntos","1 punto","1,5 puntos","2 puntos"],ok:2,e:"1 + a = 1,5: la tasa real sube 0,5 puntos."},
{u:1,q:"En el modelo de Barro y Gordon con discreción, el producto de equilibrio es:",o:["Mayor que el natural","Igual al natural","Menor que el natural","k veces el natural"],ok:1,e:"El público anticipa la inflación, así que no hay sorpresa: y = y*."},
{u:1,q:"La deuda/PIB es 50 %, r = 5 % y g = 5 %. ¿Qué balance primario la estabiliza?",o:["Superávit de 2,5 %","Equilibrio (0 %)","Déficit de 2,5 %","Superávit de 5 %"],ok:1,e:"s* = (r − g)d/(1 + g) = 0."},
{u:1,q:"En la curva de Laffer del señoreaje de Cagan, el señoreaje máximo se alcanza con π igual a:",o:["α","1/α","2/α","0"],ok:1,e:"dS/dπ = Ae^(−απ)(1 − απ) = 0 ⟹ π = 1/α."},
{u:1,q:"¿Cuál de estas condiciones hace fallar la equivalencia ricardiana?",o:["Horizonte infinito","Restricciones de liquidez","Impuestos de suma fija","Expectativas racionales"],ok:1,e:"Con restricciones de liquidez, el recorte permite consumir más hoy."},
{u:1,q:"Con capital móvil y tipo de cambio fijo, la política más eficaz es:",o:["La monetaria","La fiscal","Ninguna","Ambas por igual"],ok:1,e:"La monetaria se pierde defendiendo el tipo de cambio; la fiscal se potencia."},
{u:1,q:"La propuesta de Rogoff para reducir el sesgo inflacionario es:",o:["Una regla de dinero constante","Un banquero central conservador","Más discreción","Monetizar el déficit"],ok:1,e:"Más peso a la inflación reduce π = b(k − 1)y*/a."},
{u:1,q:"La «ley de 1/n» se refiere a:",o:["La regla de Taylor","La tragedia de los comunes del presupuesto","El señoreaje","La equivalencia ricardiana"],ok:1,e:"Más grupos decidiendo con un fondo común implica más gasto."},
{u:1,q:"Giavazzi y Pagano estudiaron:",o:["Hiperinflaciones","Contracciones fiscales expansivas","Reglas de Taylor","Impuestos óptimos"],ok:1,e:"Dinamarca e Irlanda en los años ochenta."},
{u:1,q:"Según Barro (1979), un gasto militar transitorio debe financiarse principalmente con:",o:["Un aumento temporal grande de impuestos","Deuda, manteniendo la tasa impositiva estable","Emisión","Recortes de otros gastos"],ok:1,e:"Suavización de impuestos: la deuda amortigua los gastos transitorios."},
{u:2,q:"Un impuesto unitario recae más sobre los consumidores cuando:",o:["La demanda es más elástica que la oferta","La oferta es más elástica que la demanda","Se le cobra al consumidor","Se le cobra al productor"],ok:1,e:"Paga más el lado menos elástico; a quién se cobra no importa."},
{u:2,q:"Si la tasa de un impuesto se triplica, el exceso de gravamen aproximadamente:",o:["Se triplica","Se multiplica por 6","Se multiplica por 9","No cambia"],ok:2,e:"Depende de t²: 3² = 9."},
{u:2,q:"La regla de Ramsey recomienda gravar más:",o:["Los bienes de lujo","Los bienes de demanda inelástica","Los bienes de demanda elástica","Todos por igual"],ok:1,e:"Regla de la elasticidad inversa."},
{u:2,q:"Un impuesto es progresivo cuando:",o:["La tasa marginal es constante","La tasa media crece con el ingreso","Todos pagan lo mismo","La tasa media cae con el ingreso"],ok:1,e:"Progresivo: la tasa media aumenta con el ingreso."},
{u:2,q:"El índice de Reynolds-Smolensky mide:",o:["La evasión","La reducción del Gini por el impuesto","La elasticidad del ingreso gravable","El exceso de gravamen"],ok:1,e:"RS = Gini antes − Gini después."},
{u:2,q:"En el IVA, cada empresa paga al Estado:",o:["El IVA de sus ventas","El IVA de sus ventas menos el de sus compras","El IVA de sus compras","Nada"],ok:1,e:"Así solo se grava el valor agregado en cada etapa."},
{u:2,q:"Con una renta gravable de 1.000 UVT, en Colombia el impuesto de renta es:",o:["0","19 %","28 %","116 UVT"],ok:0,e:"El primer tramo, hasta 1.090 UVT, tiene tarifa 0."},
{u:2,q:"El efecto sustitución de un impuesto al salario tiende a:",o:["Aumentar las horas trabajadas","Reducir las horas trabajadas","No cambiar nada","Aumentar el ahorro"],ok:1,e:"El ocio se abarata en términos relativos."},
{u:2,q:"La tarifa general del IVA en Colombia es:",o:["16 %","19 %","21 %","10 %"],ok:1,e:"19 % desde la reforma de 2016."},
{u:2,q:"El criterio de Rawls busca maximizar:",o:["La suma de utilidades","El bienestar del peor situado","El PIB","La libertad de elección"],ok:1,e:"Maximin."}];
const ABIERTAS=[
{u:1,q:"Explica el problema de inconsistencia dinámica con el modelo de Barro y Gordon y discute dos soluciones.",a:["Objetivos de la autoridad: y > y* (k > 1) y baja inflación; curva de Phillips con expectativas.","Con discreción, incentivo a sorprender; en equilibrio π = b(k − 1)y*/a e y = y*.","La regla π = 0 da menor pérdida pero no es creíble.","Soluciones: reputación, banquero conservador (Rogoff), independencia, metas de inflación; costos de cada una."]},
{u:1,q:"¿Es sostenible una deuda de 60 % del PIB si r = 6 % y g = 3 %? ¿Qué depende de qué?",a:["Fórmula s* = (r − g)d/(1 + g) ≈ 1,75 % del PIB de superávit primario.","Si el gobierno no puede sostener ese superávit, la deuda crece por el efecto bola de nieve.","Factores: credibilidad, prima de riesgo (r depende de d), crecimiento potencial, composición en moneda extranjera.","Relacionarlo con la regla fiscal colombiana."]},
{u:1,q:"Discute si las reglas fiscales resuelven el sesgo deficitario.",a:["Origen del sesgo: tragedia de los comunes, deuda estratégica, guerra de desgaste.","Las reglas limitan la discreción y centralizan decisiones (procesos jerárquicos).","Problemas: rigidez en recesiones, contabilidad creativa, cláusulas de escape, credibilidad.","Ejemplo: Ley 1473 de 2011 y su reforma de 2021 en Colombia."]},
{u:2,q:"¿Por qué el exceso de gravamen crece con el cuadrado de la tasa? ¿Qué implica para el diseño tributario?",a:["Triángulo de Harberger: base y altura crecen ambas con t.","EG ≈ ½ ε t² PQ.","Implicaciones: bases amplias y tasas bajas; evitar tasas muy altas en pocos bienes; suavizar en el tiempo.","Contraste con impuestos de suma fija."]},
{u:2,q:"La regla de Ramsey y la equidad: ¿por qué no se aplica tal cual?",a:["Ramsey: gravar más lo inelástico minimiza el exceso de gravamen.","Los bienes inelásticos suelen ser necesidades, con mayor peso en el gasto de los pobres: resultado regresivo.","Soluciones: combinar con impuesto progresivo a la renta (Atkinson-Stiglitz) y transferencias.","Ejemplo del IVA colombiano y su devolución."]},
{u:2,q:"Evalúa la progresividad del impuesto de renta de personas naturales en Colombia.",a:["Tabla marginal de 0 % a 39 % en UVT: progresiva en la ley.","En la práctica, rentas exentas, deducciones y la concentración en asalariados reducen la progresividad efectiva.","Medidas: Kakwani y Reynolds-Smolensky; efecto redistributivo pequeño por el bajo recaudo.","Propuestas de reforma: ampliar la base, gravar dividendos y rentas de capital."]}];
