// =====================================================================
// CONTENIDO: Principios de Macroeconomía (1503710, U. de Antioquia).
// Sigue el programa del curso: Preliminares, Largo plazo y Corto plazo, con la notación de Jones (Macroeconomics).
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const NOT=String.raw`<p class="hint">Notación del curso (Jones): una barra encima, como \(\bar s\) o \(\bar A\), indica un parámetro que el modelo toma como dado (exógeno). Una tilde, como \(\tilde Y_t\), indica la brecha del producto.</p>`;
// Estaciones originales de la app (modelo keynesiano, dinero e IS-LM): ahora son ramas
const CLASICO=[
{id:"pib", t:"Modelo keynesiano y multiplicador", sim:"pib", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Por el enfoque del gasto, el PIB es la suma de lo que se gasta en bienes y servicios finales. En el modelo keynesiano simple, la producción se ajusta a ese gasto, y como el consumo depende del ingreso, cada peso de gasto autónomo se multiplica.</p>
<div class="mj">\[Y=C+I+G,\qquad C=C_0+c_1(Y-T)\]</div></section>
<section><h3>Equilibrio</h3>
<p>Reemplazando el consumo y despejando \(Y\):</p>
<div class="mj">\[Y=C_0+c_1(Y-T)+I+G\;\Longrightarrow\;Y^*=\underbrace{\frac{1}{1-c_1}}_{\text{multiplicador}}\big[\underbrace{C_0-c_1T+I+G}_{\text{gasto autónomo}}\big]\]</div>
<p>Con \(c_1=0{,}8\) el multiplicador es 5: un aumento de 1 en el gasto público eleva el PIB en 5, porque genera ingreso que se vuelve a gastar en rondas sucesivas \(1+0{,}8+0{,}8^2+\dots=\frac{1}{1-0{,}8}\).</p></section>
<section><h3>Multiplicadores</h3>
<div class="tbl"><table><tr><th>Cambio</th><th>Efecto sobre Y</th><th>Con c₁ = 0,8</th></tr>
<tr><td>Gasto público \(G\) o inversión \(I\)</td><td>\(\frac{\partial Y}{\partial G}=\frac{1}{1-c_1}\)</td><td class="num">5</td></tr>
<tr><td>Impuestos \(T\)</td><td>\(\frac{\partial Y}{\partial T}=-\frac{c_1}{1-c_1}\)</td><td class="num">−4</td></tr>
<tr><td>Propensión a consumir \(c_1\)</td><td>\(\frac{\partial Y}{\partial c_1}=\frac{C_0-T+I+G}{(1-c_1)^2}\)</td><td>Depende del nivel de gasto</td></tr></table></div>
<p>El multiplicador de los impuestos es menor en valor absoluto porque una parte de la rebaja de impuestos se ahorra.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="keynes"></div></section>
${LAB}`,
deep:[
{k:"Derivada",t:"∂Y/∂G",html:String.raw`<div class="mj">\[\frac{\partial Y}{\partial G}=\frac{1}{1-c_1}\cdot\frac{\partial}{\partial G}\big[C_0-c_1T+I+G\big]=\frac{1}{1-c_1}(0-0+0+1)=\frac{1}{1-c_1}\]</div>`},
{k:"Derivada",t:"∂Y/∂T",html:String.raw`<div class="mj">\[\frac{\partial Y}{\partial T}=\frac{1}{1-c_1}\cdot(-c_1)=-\frac{c_1}{1-c_1}\]</div>`},
{k:"Derivada",t:"∂Y/∂c₁ (regla del cociente)",html:String.raw`<p>Con \(u=C_0-c_1T+I+G\) y \(v=1-c_1\): \(u'=-T\), \(v'=-1\).</p><div class="mj">\[\frac{\partial Y}{\partial c_1}=\frac{u'v-uv'}{v^2}=\frac{-T(1-c_1)+(C_0-c_1T+I+G)}{(1-c_1)^2}=\frac{C_0-T+I+G}{(1-c_1)^2}\]</div><p>La app solo mostraba el resultado que daba SymPy; aquí está el desarrollo completo.</p>`}],
py:`def pib_equilibrio(C0, c1, T, I, G):
    """Módulo «PIB (enfoque gasto)» de Economiapp."""
    multiplicador = 1 / (1 - c1)
    gasto_autonomo = C0 - c1 * T + I + G
    Y = multiplicador * gasto_autonomo
    C = C0 + c1 * (Y - T)
    return {"multiplicador": multiplicador, "Y": Y, "C": C,
            "dY_dG": multiplicador, "dY_dT": -c1 * multiplicador}`,
qs:[{q:"Con c₁ = 0,75, ¿cuánto sube el PIB si el gobierno gasta 100 más?",a:String.raw`El multiplicador es \(1/(1-0{,}75)=4\): el PIB sube 400.`},
 {q:"¿Por qué el multiplicador de los impuestos es menor que el del gasto?",a:"Porque el gasto público entra completo a la demanda, mientras que una baja de impuestos aumenta el ingreso disponible y de eso solo se consume la fracción c₁."}]},

{id:"dinero", t:"Mercado de dinero", sim:"din", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La tasa de interés es el precio que equilibra la oferta de dinero, que controla el banco central, con la demanda de dinero de la gente.</p>
<div class="mj">\[\underbrace{\frac{M}{P}}_{\text{oferta real}}=\underbrace{kY-hr}_{\text{demanda }L(r,Y)}\;\Longrightarrow\;r^*=\frac{kY-M/P}{h}\]</div></section>
<section><h3>Los dos motivos de la demanda de dinero</h3>
<div class="tbl"><table><tr><th>Parámetro</th><th>Motivo</th><th>Lectura</th></tr>
<tr><td>\(k\)</td><td>Transacción</td><td>Con más ingreso se hacen más compras y se necesita más dinero</td></tr>
<tr><td>\(h\)</td><td>Especulación</td><td>Con tasas altas conviene tener bonos en vez de dinero</td></tr></table></div></section>
<section><h3>La curva LM</h3>
<p>Las combinaciones de \(Y\) y \(r\) que equilibran el mercado de dinero forman la curva LM. Su pendiente es</p>
<div class="mj">\[\frac{\partial r}{\partial Y}=\frac{k}{h}>0\]</div>
<p>Si el ingreso sube, la gente demanda más dinero; con la oferta fija, la tasa debe subir para reducir la demanda especulativa.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="dinero"></div></section>
${LAB}
<p class="link"><b>Política monetaria:</b> si el banco central aumenta \(M\), la tasa baja: \(\frac{\partial r}{\partial M}=-\frac{1}{Ph}\).</p>`,
deep:[{k:"Revisión",n:true,t:"Las unidades de la tasa de interés",html:String.raw`<p>Con los valores del JSON de Economiapp (\(k=0{,}5\), \(Y=3.000.000\), \(M=500.000\), \(h=20.000\)) la tasa de equilibrio da \(r^*=50\). La app la mostraba como «5.000 %», que no tiene sentido económico. El problema está en la escala de \(h\): para que \(r\) quede como una fracción razonable (por ejemplo 0,05), \(h\) tendría que ser del orden de veinte millones. Aquí \(r\) se muestra tal como sale de la fórmula, sin convertirla a porcentaje.</p>`}],
py:`def mercado_dinero(M, P, Y, k, h):
    """Módulo «Mercado de dinero» de Economiapp."""
    oferta_real = M / P
    r = (k * Y - oferta_real) / h
    return {"oferta_real": oferta_real, "r": r,
            "pendiente_LM": k / h, "dr_dM": -1 / (P * h)}`,
qs:[{q:"Si los precios suben y el banco central no cambia M, ¿qué pasa con la tasa de interés?",a:String.raw`La oferta real \(M/P\) cae, así que \(r^*\) sube: es como una contracción monetaria.`}]},

{id:"islm", t:"Modelo IS-LM", sim:"islm", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El modelo IS-LM junta el mercado de bienes y el de dinero. La curva IS reúne las combinaciones de \(Y\) y \(r\) que equilibran el mercado de bienes; la LM, las que equilibran el de dinero. Donde se cruzan, los dos mercados están en equilibrio a la vez.</p></section>
<section><h3>Las dos curvas</h3>
<div class="mj">\[\text{IS:}\;Y=C_0+c_1(Y-T)+I_0-br+G\qquad\qquad\text{LM:}\;\frac{M}{P}=kY-hr\]</div>
<p>La inversión cae con la tasa de interés (\(I=I_0-br\)), por eso la IS tiene pendiente negativa.</p></section>
<section><h3>Equilibrio</h3>
<p>Resolviendo el sistema de dos ecuaciones:</p>
<div class="mj">\[Y^*=\frac{h\,(C_0-c_1T+I_0+G)+b\,\frac{M}{P}}{h(1-c_1)+bk},\qquad r^*=\frac{kY^*-M/P}{h}\]</div></section>
<section><h3>Multiplicadores de política</h3>
<div class="mj">\[\frac{\partial Y}{\partial G}=\frac{h}{h(1-c_1)+bk}\qquad\frac{\partial Y}{\partial M}=\frac{b/P}{h(1-c_1)+bk}\qquad\frac{\partial Y}{\partial T}=-\frac{c_1h}{h(1-c_1)+bk}\]</div>
<p>El multiplicador fiscal es menor que el keynesiano \(\frac{1}{1-c_1}\): al subir el gasto sube la demanda de dinero, la tasa de interés aumenta y la inversión privada cae. Eso es el <b>efecto expulsión</b> (crowding out).</p></section>
<section><h3>Visual de cambios</h3><div data-vis="islm"></div></section>
${LAB}`,
deep:[{k:"Revisión",n:true,t:"Mismo problema de unidades",html:String.raw`<p>Con los valores del JSON, \(r^*\approx135{,}6\): igual que en el mercado de dinero, la escala de \(h\) y \(b\) no corresponde a una tasa en porcentaje. Los multiplicadores sí son razonables (\(\partial Y/\partial G\approx2{,}22\) frente a 5 del modelo keynesiano simple).</p>`}],
py:`def is_lm(C0, c1, T, I0, b, G, M, P, k, h):
    """Módulo «Modelo IS-LM» de Economiapp (solución cerrada del sistema)."""
    gasto_autonomo = C0 - c1 * T + I0 + G
    den = h * (1 - c1) + b * k
    Y = (h * gasto_autonomo + b * M / P) / den
    r = (k * Y - M / P) / h
    return {"Y": Y, "r": r,
            "mult_G": h / den, "mult_M": (b / P) / den, "mult_T": -c1 * h / den}`,
qs:[{q:"Si la demanda de dinero no depende de la tasa (h → 0), ¿qué efecto tiene la política fiscal?",a:String.raw`\(\partial Y/\partial G=h/(h(1-c_1)+bk)\to0\): la LM es vertical y el gasto público expulsa completamente a la inversión privada.`}]}
];
const TRUNK=[
// ===================== PRELIMINARES =====================
{id:"intro", parte:"Preliminares", t:"¿Qué es la macroeconomía?", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La macroeconomía estudia la economía como un todo: cuánto produce un país, por qué unos países son mucho más ricos que otros, por qué hay años de auge y años de crisis, y qué pueden hacer el gobierno y el banco central al respecto.</p>
<p>El curso se organiza alrededor de dos preguntas, que corresponden a dos horizontes de tiempo:</p>
<div class="tbl"><table><tr><th>Horizonte</th><th>Pregunta</th><th>Herramientas del curso</th></tr>
<tr><td><b>Largo plazo</b></td><td>¿Por qué crecen las economías? ¿Por qué Colombia es más pobre que Estados Unidos?</td><td>Modelo de producción, modelo de Solow, mercado laboral, inflación</td></tr>
<tr><td><b>Corto plazo</b></td><td>¿Por qué la producción se aleja de su potencial? ¿Qué causa las recesiones y cómo se combaten?</td><td>Curva IS, política monetaria (MP), curva de Phillips, OA-DA</td></tr></table></div></section>
<section><h3>Crecimiento y ciclos</h3>
<p>Si se grafica el PIB real per cápita de un país a lo largo de un siglo, se ven dos cosas a la vez: una <b>tendencia</b> que sube de forma sostenida (el crecimiento económico) y <b>fluctuaciones</b> alrededor de esa tendencia (los ciclos económicos). La macroeconomía las separa:</p>
<div class="mj">\[Y_t=\underbrace{\bar Y_t}_{\text{producto potencial (largo plazo)}}+\underbrace{(Y_t-\bar Y_t)}_{\text{fluctuación (corto plazo)}}\]</div>
<p>El largo plazo explica \(\bar Y_t\); el corto plazo explica por qué \(Y_t\) se aparta de \(\bar Y_t\).</p></section>
<section><h3>Cómo funcionan los modelos</h3>
<p>Un modelo económico es una representación matemática simplificada de la economía. Tiene tres partes:</p>
<ul><li><b>Variables endógenas:</b> las que el modelo determina (por ejemplo, la producción \(Y\) o la inflación \(\pi\)).</li>
<li><b>Variables exógenas o parámetros:</b> las que se toman como dadas (por ejemplo, la tasa de ahorro \(\bar s\)). En Jones llevan una barra.</li>
<li><b>Ecuaciones:</b> relaciones de comportamiento (cómo deciden las empresas y los hogares), identidades contables y condiciones de equilibrio.</li></ul>
<p><b>Resolver</b> un modelo es expresar cada endógena solo en función de las exógenas. Después se hacen <b>ejercicios de estática comparativa</b>: se cambia una exógena y se mira cómo cambian las endógenas. Casi todos los ejercicios del curso son de este tipo.</p>
<div class="callout"><b>Ejemplo mínimo.</b> Oferta \(Q^s=\bar a\,P\) y demanda \(Q^d=\bar b-P\). Igualando: \(P^*=\dfrac{\bar b}{1+\bar a}\) y \(Q^*=\dfrac{\bar a\bar b}{1+\bar a}\). Si sube \(\bar b\) (más demanda), suben el precio y la cantidad.</div></section>
<section><h3>El mapa del curso</h3>
<ol><li><b>Preliminares:</b> medir la economía (PIB, precios, empleo) y medir los ciclos.</li>
<li><b>Largo plazo:</b> hechos del crecimiento → modelo de producción → Solow → mercado laboral → inflación.</li>
<li><b>Corto plazo:</b> brecha del producto, Okun y Phillips → Gran Recesión → IS → MP y Phillips → OA-DA.</li></ol>
<p>Los temas del modelo keynesiano clásico (multiplicador, mercado de dinero e IS-LM) siguen disponibles como ramas, porque aparecen en otros cursos.</p></section>`,
qs:[{q:"En el modelo de Solow, ¿la tasa de ahorro es endógena o exógena?",a:String.raw`Exógena: es un parámetro \(\bar s\). El modelo determina el capital, la producción y el consumo a partir de ella.`},
 {q:"¿Qué diferencia hay entre el largo y el corto plazo en este curso?",a:String.raw`El largo plazo estudia el producto potencial \(\bar Y_t\) y su crecimiento; el corto plazo estudia las desviaciones \(Y_t-\bar Y_t\) (recesiones y auges).`}]},

{id:"medicion", parte:"Preliminares", t:"Medición: PIB, precios y empleo", sim:"medir", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El PIB es el valor de mercado de todos los bienes y servicios <b>finales</b> producidos dentro de un país en un período. Se puede medir de tres maneras que, bien hechas, dan el mismo número.</p></section>
<section><h3>Los tres enfoques</h3>
<div class="tbl"><table><tr><th>Enfoque</th><th>Qué suma</th></tr>
<tr><td><b>Gasto</b></td><td>\(Y=C+I+G+X-M\): consumo, inversión, gasto del gobierno y exportaciones netas</td></tr>
<tr><td><b>Producción</b></td><td>El <b>valor agregado</b> de cada empresa: ventas menos bienes intermedios comprados</td></tr>
<tr><td><b>Ingreso</b></td><td>Salarios + rentas del capital (intereses, utilidades, arriendos) + impuestos indirectos netos</td></tr></table></div>
<p>Se suman solo bienes finales (o valores agregados) para no contar dos veces: si se sumara la harina y también el pan, la harina se contaría dos veces.</p>
<div class="callout"><b>PIB y PNB.</b> El PIB mide lo producido <i>dentro</i> del país; el PNB (o ingreso nacional bruto), lo producido por los <i>factores nacionales</i>, estén donde estén: \(\text{PNB}=\text{PIB}+\text{ingresos netos de factores del exterior}\). En Colombia el PNB es menor que el PIB porque las empresas extranjeras giran utilidades al exterior.</div></section>
<section><h3>PIB nominal, real y deflactor</h3>
<p>El PIB nominal valora la producción a los precios de cada año; el real, a precios constantes de un año base. Así el PIB real solo cambia si cambian las cantidades.</p>
<div class="mj">\[\text{PIB nominal}_t=\sum_i p_{i,t}\,q_{i,t}\qquad\text{PIB real}_t=\sum_i p_{i,\text{base}}\,q_{i,t}\qquad\text{Deflactor}_t=100\cdot\frac{\text{PIB nominal}_t}{\text{PIB real}_t}\]</div>
<p>El problema: el crecimiento real depende del año base que se escoja. Por eso hoy se usa el <b>índice encadenado</b> (de Fisher), que promedia los dos:</p>
<div class="mj">\[1+g_{\text{encadenado}}=\sqrt{\underbrace{\frac{\sum p_{t-1}q_t}{\sum p_{t-1}q_{t-1}}}_{\text{precios del año anterior}}\times\underbrace{\frac{\sum p_t q_t}{\sum p_t q_{t-1}}}_{\text{precios del año corriente}}}\]</div></section>
<section><h3>Índices de precios e inflación</h3>
<p>El <b>IPC</b> mide el costo de una canasta fija de consumo (la del año base); el <b>deflactor</b> usa la producción del año corriente. La inflación es la tasa de crecimiento del nivel de precios:</p>
<div class="mj">\[\text{IPC}_t=100\cdot\frac{\sum_i p_{i,t}\,q_{i,\text{base}}}{\sum_i p_{i,\text{base}}\,q_{i,\text{base}}}\qquad\qquad \pi_t=\frac{P_t-P_{t-1}}{P_{t-1}}\]</div>
<p>Como el IPC deja fija la canasta, tiende a sobrestimar la inflación: no recoge que la gente sustituye hacia los bienes que se abaratan (sesgo de sustitución), ni las mejoras de calidad ni los bienes nuevos.</p></section>
<section><h3>Ejemplo resuelto</h3>
<p>Dos bienes. Año 0: naranjas a 1 (100 unidades) y computadores a 10 (20 unidades). Año 1: naranjas a 1,2 (110) y computadores a 9 (30).</p>
<div class="tbl"><table><tr><th>Medida</th><th>Cálculo</th><th>Resultado</th></tr>
<tr><td>PIB nominal año 0</td><td>1·100 + 10·20</td><td class="num">300</td></tr>
<tr><td>PIB nominal año 1</td><td>1,2·110 + 9·30</td><td class="num">402</td></tr>
<tr><td>PIB real año 1 (precios del año 0)</td><td>1·110 + 10·30</td><td class="num">410</td></tr>
<tr><td>Crecimiento real con precios del año 0</td><td>410/300 − 1</td><td class="num">36,67 %</td></tr>
<tr><td>Crecimiento real con precios del año 1</td><td>402/(1,2·100 + 9·20) − 1 = 402/300 − 1</td><td class="num">34,00 %</td></tr>
<tr><td>Crecimiento encadenado (Fisher)</td><td>√(1,3667 × 1,34) − 1</td><td class="num">35,33 %</td></tr>
<tr><td>Deflactor año 1</td><td>100 · 402/410</td><td class="num">98,05</td></tr>
<tr><td>IPC año 1 (canasta del año 0)</td><td>100 · (1,2·100 + 9·20)/300</td><td class="num">100,00</td></tr></table></div>
<p>El deflactor dice que los precios bajaron 1,95 %, y el IPC, que no cambiaron. Ninguno está mal: el deflactor pesa más los computadores (cuya producción creció y cuyo precio bajó), y el IPC usa la canasta vieja.</p></section>
<section><h3>Indicadores del mercado laboral</h3>
<p>Con las definiciones del DANE (desde 2021 la población en edad de trabajar es la de 15 años o más):</p>
<div class="tbl"><table><tr><th>Sigla</th><th>Nombre</th><th>Fórmula</th></tr>
<tr><td>PET</td><td>Población en edad de trabajar</td><td>15 años o más</td></tr>
<tr><td>FT</td><td>Fuerza de trabajo (antes PEA)</td><td>Ocupados + desocupados</td></tr>
<tr><td>TGP</td><td>Tasa global de participación</td><td>FT / PET</td></tr>
<tr><td>TO</td><td>Tasa de ocupación</td><td>Ocupados / PET</td></tr>
<tr><td>TD</td><td>Tasa de desempleo</td><td>Desocupados / FT</td></tr></table></div>
<p>Un desocupado es quien no trabaja, buscó empleo y está disponible. Quien deja de buscar porque se desanimó sale de la fuerza de trabajo: la tasa de desempleo <i>baja</i> aunque nadie haya conseguido trabajo.</p></section>
${LAB}`,
deep:[{k:"Detalle",t:"Por qué los tres enfoques dan lo mismo",html:String.raw`<p>Lo que un comprador gasta en un bien final es lo que recibe quien lo vende. Ese ingreso se reparte entre los proveedores de insumos (que a su vez lo reparten), los trabajadores y los dueños del capital. Sumando a lo largo de toda la cadena, el gasto final es igual a la suma de los valores agregados, y esta es igual a la suma de los ingresos de los factores. En la práctica hay una pequeña <b>discrepancia estadística</b> porque las fuentes de datos son distintas.</p>`}],
qs:[{q:"Una panadería compra harina por 40 y vende pan por 100. El molino compró trigo por 10 a un agricultor que no usó insumos. ¿Cuánto aporta la cadena al PIB?",a:"100: es el valor del bien final. Por valor agregado: 10 (agricultor) + 30 (molino) + 60 (panadería) = 100."},
 {q:"Si el PIB nominal crece 8 % y el deflactor 5 %, ¿cuánto crece aproximadamente el PIB real?",a:String.raw`Cerca de 3 %: \(g_{\text{real}}\approx g_{\text{nominal}}-\pi\). Exactamente: \(1{,}08/1{,}05-1=2{,}86\,\%\).`},
 {q:"¿Qué pasa con la tasa de desempleo si 100.000 desocupados dejan de buscar trabajo?",a:"Baja, porque salen de los desocupados y de la fuerza de trabajo. La tasa de ocupación no cambia."}]},

{id:"ciclos", parte:"Preliminares", t:"Ciclos económicos: medición y regularidades", sim:"ciclo", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Un ciclo económico es la desviación de la producción respecto a su tendencia. Para medirlo hay que separar la serie en dos partes: una tendencia suave y un componente cíclico que sube en los auges y cae en las recesiones.</p>
<div class="mj">\[\ln Y_t=\underbrace{\tau_t}_{\text{tendencia}}+\underbrace{c_t}_{\text{ciclo}}\qquad\Longrightarrow\qquad c_t\approx\frac{Y_t-e^{\tau_t}}{e^{\tau_t}}\]</div>
<p>Se trabaja con logaritmos para que el ciclo quede en porcentaje: \(100\,c_t=2\) quiere decir que la producción está 2 % por encima de su tendencia.</p></section>
<section><h3>El filtro de Hodrick-Prescott</h3>
<p>La forma más usada de obtener la tendencia es el filtro HP. Escoge la tendencia \(\tau_t\) que resuelve</p>
<div class="mj">\[\min_{\{\tau_t\}}\;\sum_{t=1}^{T}(\ln Y_t-\tau_t)^2+\lambda\sum_{t=2}^{T-1}\big[(\tau_{t+1}-\tau_t)-(\tau_t-\tau_{t-1})\big]^2\]</div>
<p>El primer término pide que la tendencia se parezca a la serie; el segundo castiga los cambios en su pendiente. Con \(\lambda=0\) la tendencia es la serie misma; con \(\lambda\to\infty\) es una línea recta. Los valores usuales son \(\lambda=1.600\) para datos trimestrales y \(\lambda=100\) para anuales.</p></section>
<section><h3>Cómo se describe un ciclo</h3>
<div class="tbl"><table><tr><th>Concepto</th><th>Definición</th></tr>
<tr><td>Pico y valle</td><td>Máximo y mínimo locales del componente cíclico</td></tr>
<tr><td>Recesión</td><td>Tramo del pico al valle; expansión, del valle al pico</td></tr>
<tr><td>Amplitud</td><td>Qué tan grandes son las desviaciones: se mide con la desviación estándar del ciclo</td></tr>
<tr><td>Persistencia</td><td>Si una desviación tiende a durar: correlación del ciclo con su propio rezago</td></tr></table></div></section>
<section><h3>Co-movimientos: procíclica, contracíclica, adelantada, rezagada</h3>
<p>Para cada variable \(x\) se calcula la correlación de su ciclo con el del PIB, \(\rho(x_{t+j},Y_t)\), para varios rezagos \(j\):</p>
<ul><li><b>Procíclica</b> si la correlación contemporánea es positiva (sube en los auges): consumo, inversión, empleo.</li>
<li><b>Contracíclica</b> si es negativa: el desempleo.</li>
<li><b>Acíclica</b> si es cercana a cero.</li>
<li><b>Adelantada</b> si la correlación más alta en valor absoluto ocurre con \(j<0\) (la variable se mueve antes que el PIB), <b>rezagada</b> si ocurre con \(j>0\) y <b>coincidente</b> si ocurre en \(j=0\).</li></ul></section>
<section><h3>Las regularidades del ciclo</h3>
<p>En casi todos los países se observan los mismos hechos (Williamson, cap. 3):</p>
<ul><li>El consumo es procíclico y <b>menos</b> volátil que el PIB: los hogares suavizan el consumo.</li>
<li>La inversión es procíclica y <b>mucho más</b> volátil que el PIB (dos o tres veces).</li>
<li>El empleo es procíclico y algo rezagado; el desempleo es contracíclico.</li>
<li>La productividad del trabajo es procíclica.</li>
<li>Los precios tienden a ser contracíclicos en los datos de posguerra, y la inflación, procíclica y rezagada.</li></ul></section>
${LAB}`,
deep:[{k:"Detalle",t:"Cómo se resuelve el filtro HP",html:String.raw`<p>Derivando la función objetivo respecto a cada \(\tau_t\) e igualando a cero se obtiene un sistema lineal \((I+\lambda D'D)\,\tau=\ln Y\), donde \(D\) es la matriz de segundas diferencias de tamaño \((T-2)\times T\). La matriz \(I+\lambda D'D\) solo tiene cinco diagonales con valores distintos de cero, así que el sistema se resuelve rápido. El laboratorio lo hace así y da los mismos números que <code>hpfilter</code> de R o de Python.</p>`},
 {k:"Advertencia",t:"El problema de los extremos",html:"<p>Cerca del inicio y del final de la muestra, el filtro HP tiene menos datos para «anclar» la tendencia, y esta se pega a la serie. Por eso el ciclo de los últimos trimestres se revisa mucho cuando llegan datos nuevos. No conviene sacar conclusiones fuertes sobre el ciclo actual solo con el filtro HP.</p>"}],
qs:[{q:"Si la desviación estándar del ciclo de la inversión es 6 % y la del PIB 2 %, ¿qué dice eso?",a:"Que la inversión es tres veces más volátil que el PIB, una de las regularidades del ciclo."},
 {q:"La correlación más alta del ciclo de una variable con el PIB se da en j = −2. ¿Es adelantada o rezagada?",a:String.raw`Adelantada: \(\rho(x_{t-2},Y_t)\) alta quiere decir que lo que hace la variable hoy anticipa lo que hará el PIB dos períodos después.`}]},

// ===================== LARGO PLAZO =====================
{id:"crecimiento", parte:"Largo plazo", t:"Panorama del crecimiento económico", sim:"crec", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Pequeñas diferencias en la tasa de crecimiento, sostenidas durante décadas, producen diferencias enormes en el nivel de vida. Por eso el crecimiento es, quizá, la pregunta más importante de la macroeconomía.</p></section>
<section><h3>Crecimiento compuesto y regla del 70</h3>
<p>Si el ingreso per cápita crece a una tasa constante \(\bar g\):</p>
<div class="mj">\[y_t=y_0(1+\bar g)^t\qquad\Longrightarrow\qquad t_{\text{duplicar}}=\frac{\ln 2}{\ln(1+\bar g)}\approx\frac{70}{100\cdot\bar g}\]</div>
<p>Esa es la <b>regla del 70</b>: creciendo 2 % por año, el ingreso se duplica en unos 35 años; creciendo 7 %, en unos 10. Al revés, la tasa media de crecimiento entre dos años se calcula con</p>
<div class="mj">\[\bar g=\left(\frac{y_T}{y_0}\right)^{1/T}-1\]</div></section>
<section><h3>Escala logarítmica</h3>
<p>Una serie que crece a tasa constante es una curva exponencial, pero su logaritmo es una <b>línea recta</b> con pendiente \(\ln(1+\bar g)\approx\bar g\): \(\ln y_t=\ln y_0+t\ln(1+\bar g)\). Por eso los datos de crecimiento se grafican en escala logarítmica: la pendiente de la línea es la tasa de crecimiento, y una línea más empinada es un crecimiento más rápido.</p></section>
<section><h3>Los hechos del crecimiento</h3>
<ol><li><b>Antes de la Revolución Industrial</b> el ingreso per cápita casi no crecía. El crecimiento sostenido es un fenómeno de los últimos 200 años.</li>
<li><b>Estados Unidos</b> creció cerca de 2 % por año por persona durante más de un siglo, con una regularidad notable.</li>
<li><b>Diferencias enormes entre países:</b> el ingreso per cápita de los países más ricos es más de 50 veces el de los más pobres.</li>
<li><b>Las tasas de crecimiento también difieren mucho:</b> hay «milagros» (Corea del Sur, China, que crecieron más de 5 % por año durante décadas) y «desastres» (países que se estancaron o retrocedieron).</li>
<li><b>Convergencia condicional:</b> entre países parecidos (los de la OCDE), los que eran más pobres crecieron más rápido. En el mundo entero no se observa convergencia absoluta.</li></ol>
<p>Los modelos de las próximas estaciones intentan explicar estos hechos: el de producción explica las diferencias de <i>niveles</i>, y el de Solow, la dinámica y por qué el capital solo no basta para crecer siempre.</p></section>
<section><h3>Ejemplo</h3>
<p>Un país con ingreso per cápita igual a la cuarta parte del de otro crece 5 % por año, y el rico crece 2 %. ¿Cuándo lo alcanza?</p>
<div class="mj">\[1{,}05^t=4\cdot1{,}02^t\;\Longrightarrow\;t=\frac{\ln 4}{\ln(1{,}05/1{,}02)}=\frac{1{,}3863}{0{,}02899}\approx47{,}8\text{ años}\]</div></section>
${LAB}`,
qs:[{q:"Con la regla del 70, ¿cuántos años tarda en duplicarse el ingreso si crece 3,5 % por año?",a:"70/3,5 = 20 años."},
 {q:"El ingreso per cápita pasó de 1.000 a 8.000 en 70 años. ¿Cuál fue la tasa media de crecimiento?",a:String.raw`\(\bar g=8^{1/70}-1\approx3{,}02\,\%\) por año. Con la regla del 70: se duplicó tres veces, una vez cada 23,3 años, así que \(\bar g\approx70/23{,}3=3\,\%\).`}]},

{id:"produccion", parte:"Largo plazo", t:"Un modelo de producción", sim:"prod", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">¿Por qué unos países son más ricos que otros? El modelo de producción responde: porque tienen más capital por trabajador o porque usan sus recursos con más eficiencia (productividad total de los factores). Los datos dicen que lo segundo pesa más.</p>
${NOT}</section>
<section><h3>El modelo</h3>
<p>Una empresa representativa produce con capital \(K\) y trabajo \(L\) con una función Cobb-Douglas de rendimientos constantes a escala:</p>
<div class="mj">\[Y=\bar A\,K^{1/3}L^{2/3}\]</div>
<p>\(\bar A\) es la <b>productividad total de los factores</b> (PTF). Los exponentes suman 1: si se duplican \(K\) y \(L\), se duplica \(Y\). El modelo tiene cinco ecuaciones y cinco endógenas (\(Y,K,L,w,r\)):</p>
<div class="tbl"><table><tr><th>Ecuación</th><th>Significado</th></tr>
<tr><td>\(Y=\bar AK^{1/3}L^{2/3}\)</td><td>Función de producción</td></tr>
<tr><td>\(w=\frac{2}{3}\frac{Y}{L}\)</td><td>La empresa contrata trabajo hasta que el salario iguala el producto marginal del trabajo</td></tr>
<tr><td>\(r=\frac{1}{3}\frac{Y}{K}\)</td><td>Contrata capital hasta que el alquiler iguala el producto marginal del capital</td></tr>
<tr><td>\(K=\bar K\), \(L=\bar L\)</td><td>La oferta de factores es fija</td></tr></table></div></section>
<section><h3>Solución y participaciones</h3>
<div class="mj">\[Y^*=\bar A\bar K^{1/3}\bar L^{2/3},\qquad w^*=\frac{2}{3}\frac{Y^*}{\bar L},\qquad r^*=\frac{1}{3}\frac{Y^*}{\bar K}\]</div>
<p>Los salarios se llevan \(w^*\bar L=\frac23Y^*\) y el capital \(r^*\bar K=\frac13Y^*\): las participaciones son constantes e iguales a los exponentes, y no queda ganancia económica (suma \(Y^*\) exacto). Esto encaja con un hecho de los datos: la participación del trabajo es estable, cerca de dos tercios.</p></section>
<section><h3>Por trabajador y contabilidad del desarrollo</h3>
<p>Dividiendo por \(L\), con \(y=Y/L\) y \(k=K/L\):</p>
<div class="mj">\[y^*=\bar A\,k^{*\,1/3}\qquad\Longrightarrow\qquad \frac{y_{\text{país}}}{y_{\text{EE.UU.}}}=\frac{\bar A_{\text{país}}}{\bar A_{\text{EE.UU.}}}\left(\frac{k_{\text{país}}}{k_{\text{EE.UU.}}}\right)^{1/3}\]</div>
<p>Con datos de \(y\) y \(k\), el modelo «predice» el ingreso que tendría cada país si su PTF fuera igual a la de EE. UU.; la diferencia con el ingreso real es la <b>PTF implícita</b>, que se obtiene como un residuo.</p>
<div class="callout"><b>Ejemplo.</b> Un país tiene 30 % del capital por trabajador de EE. UU. y 25 % del ingreso. Con la misma PTF, el modelo predice \(0{,}30^{1/3}=0{,}669\): ese país tendría 67 % del ingreso. Como tiene 25 %, la PTF implícita es \(0{,}25/0{,}669=0{,}373\). La brecha total de 4 veces se descompone en \(1/0{,}669=1{,}49\) veces por capital y \(1/0{,}373=2{,}68\) veces por productividad.</div>
<p>Esta es la conclusión de Jones: el capital explica una parte pequeña de las diferencias de ingreso. La mayor parte es PTF: instituciones, tecnología, capital humano, mala asignación de recursos.</p></section>
<section><h3>Rendimientos decrecientes</h3>
<p>El producto marginal del capital, \(\frac{1}{3}\bar A(L/K)^{2/3}\), cae a medida que \(K\) crece: cada máquina adicional aporta menos que la anterior. Este hecho es el corazón del modelo de Solow.</p></section>
${LAB}`,
deep:[{k:"Derivada",t:"Producto marginal del trabajo",html:String.raw`<div class="mj">\[\frac{\partial Y}{\partial L}=\bar AK^{1/3}\cdot\frac23L^{-1/3}=\frac23\cdot\frac{\bar AK^{1/3}L^{2/3}}{L}=\frac23\frac{Y}{L}\]</div><p>Igual para el capital: \(\frac{\partial Y}{\partial K}=\frac13\frac{Y}{K}\). En una Cobb-Douglas, el producto marginal es el exponente por el producto medio.</p>`}],
qs:[{q:"Con Ā = 1, K = 1.000 y L = 100, ¿cuánto vale Y, el salario y el alquiler del capital?",a:String.raw`\(Y=1000^{1/3}\cdot100^{2/3}=10\cdot21{,}54=215{,}44\). \(w=\frac23\cdot215{,}44/100=1{,}436\) y \(r=\frac13\cdot215{,}44/1000=0{,}0718\).`},
 {q:"Si un país duplica su capital por trabajador, ¿cuánto sube su ingreso por trabajador?",a:String.raw`\(2^{1/3}=1{,}26\): solo 26 %, por los rendimientos decrecientes del capital.`}]},

{id:"solow", parte:"Largo plazo", t:"El modelo de Solow", sim:"solow", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Solow vuelve endógeno el capital: la economía ahorra una fracción de lo que produce y la invierte, y el capital se deprecia. Como el capital tiene rendimientos decrecientes, acumularlo no basta para crecer para siempre: la economía llega a un <b>estado estacionario</b>.</p>
${NOT}</section>
<section><h3>Las ecuaciones</h3>
<div class="tbl"><table><tr><th>Ecuación</th><th>Significado</th></tr>
<tr><td>\(Y_t=\bar AK_t^{1/3}\bar L^{2/3}\)</td><td>Producción</td></tr>
<tr><td>\(\Delta K_{t+1}=I_t-\bar dK_t\)</td><td>Acumulación de capital: inversión menos depreciación</td></tr>
<tr><td>\(I_t=\bar sY_t\)</td><td>Se invierte (ahorra) una fracción fija de la producción</td></tr>
<tr><td>\(C_t+I_t=Y_t\)</td><td>Restricción de recursos</td></tr></table></div>
<p>Juntando: \(\Delta K_{t+1}=\bar s\bar AK_t^{1/3}\bar L^{2/3}-\bar dK_t\). El capital crece mientras la inversión supere a la depreciación.</p></section>
<section><h3>Diagrama de Solow y estado estacionario</h3>
<p>En el diagrama se grafican la inversión \(\bar sY\) (cóncava, por los rendimientos decrecientes) y la depreciación \(\bar dK\) (una recta). Donde se cortan, \(\Delta K=0\):</p>
<div class="mj">\[\bar s\bar AK^{*1/3}\bar L^{2/3}=\bar dK^*\;\Longrightarrow\;K^*=\left(\frac{\bar s\bar A}{\bar d}\right)^{3/2}\bar L\]</div>
<div class="mj">\[Y^*=\bar A^{3/2}\left(\frac{\bar s}{\bar d}\right)^{1/2}\bar L\qquad\Longrightarrow\qquad y^*=\frac{Y^*}{\bar L}=\bar A^{3/2}\left(\frac{\bar s}{\bar d}\right)^{1/2}\]</div>
<p>Si \(K<K^*\), la inversión supera a la depreciación y el capital crece; si \(K>K^*\), decrece. Cualquiera que sea el punto de partida, la economía converge a \(K^*\).</p></section>
<section><h3>Lecciones del modelo</h3>
<ol><li><b>No hay crecimiento de largo plazo</b> por acumulación de capital: en el estado estacionario \(y\) es constante.</li>
<li><b>Diferencias de ingreso:</b> los países con más ahorro y menos depreciación son más ricos, pero con exponente \(1/2\): duplicar \(\bar s\) eleva \(y^*\) solo en \(\sqrt2=1{,}41\) veces.</li>
<li><b>La PTF pesa más en Solow</b> que en el modelo de producción: el exponente pasa de 1 a \(3/2\), porque más PTF produce más, y más producción se traduce en más capital.</li>
<li><b>Principio de la dinámica de transición:</b> cuanto más lejos está una economía <i>por debajo</i> de su estado estacionario, más rápido crece. Esto explica la convergencia condicional y los milagros de posguerra de Alemania y Japón.</li></ol></section>
<section><h3>Ejemplo resuelto</h3>
<p>Con \(\bar s=0{,}2\), \(\bar d=0{,}1\), \(\bar A=1\), \(\bar L=100\):</p>
<div class="mj">\[K^*=\left(\frac{0{,}2}{0{,}1}\right)^{3/2}\cdot100=282{,}84\qquad Y^*=\left(\frac{0{,}2}{0{,}1}\right)^{1/2}\cdot100=141{,}42\qquad C^*=0{,}8\cdot141{,}42=113{,}14\]</div>
<p>Si la tasa de ahorro sube a 0,3: \(K^*=3^{3/2}\cdot100=519{,}62\) y \(Y^*=\sqrt3\cdot100=173{,}21\). La producción crece rápido al principio y cada vez más despacio, hasta el nuevo estado estacionario.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="solow"></div></section>
${LAB}`,
deep:[{k:"Derivación",t:"Del estado estacionario a y*",html:String.raw`<p>De \(\bar s\bar AK^{1/3}\bar L^{2/3}=\bar dK\), dividiendo entre \(K^{1/3}\): \(\bar s\bar A\bar L^{2/3}=\bar dK^{2/3}\), así que \(K^{2/3}=\frac{\bar s\bar A}{\bar d}\bar L^{2/3}\) y, elevando a \(3/2\), \(K^*=\left(\frac{\bar s\bar A}{\bar d}\right)^{3/2}\bar L\). Reemplazando en la función de producción:</p>
<div class="mj">\[Y^*=\bar A\left(\frac{\bar s\bar A}{\bar d}\right)^{1/2}\bar L^{1/3}\bar L^{2/3}=\bar A^{3/2}\left(\frac{\bar s}{\bar d}\right)^{1/2}\bar L\]</div>`},
 {k:"General",t:"Con un exponente α cualquiera",html:String.raw`<p>Con \(Y=\bar AK^{\alpha}L^{1-\alpha}\): \(K^*=\left(\frac{\bar s\bar A}{\bar d}\right)^{\frac{1}{1-\alpha}}\bar L\) y \(y^*=\bar A^{\frac{1}{1-\alpha}}\left(\frac{\bar s}{\bar d}\right)^{\frac{\alpha}{1-\alpha}}\). Con \(\alpha=1/3\) se recuperan los exponentes \(3/2\) y \(1/2\). El laboratorio deja cambiar α.</p>`}],
qs:[{q:"¿Por qué en Solow no hay crecimiento de largo plazo?",a:"Porque el capital tiene rendimientos decrecientes: cada unidad nueva produce menos, así que la inversión crece menos que la depreciación hasta igualarla. Ahí el capital y la producción dejan de crecer."},
 {q:"Dos países solo difieren en la tasa de ahorro: 0,1 y 0,4. ¿Cuántas veces más rico es el segundo en estado estacionario?",a:String.raw`\(y_2^*/y_1^*=(0{,}4/0{,}1)^{1/2}=2\): el doble.`},
 {q:"Una guerra destruye la mitad del capital. ¿Qué predice Solow?",a:"La producción cae, pero como la economía queda lejos por debajo de su estado estacionario, crece muy rápido después (dinámica de transición) y vuelve al mismo estado estacionario."}]},

{id:"trabajo", parte:"Largo plazo", t:"Mercado laboral, salarios y desempleo", sim:"trab", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El salario se determina por la oferta y la demanda de trabajo, y en el largo plazo crece con la productividad. El desempleo nunca es cero: siempre hay gente que pierde su empleo y gente que encuentra uno. La tasa natural de desempleo resulta del balance entre esos dos flujos.</p></section>
<section><h3>Oferta y demanda de trabajo</h3>
<p>La demanda de trabajo sale de la condición de la empresa \(w=\text{PMgL}=\frac23\frac{Y}{L}\): con más trabajadores, el producto marginal cae, así que la curva tiene pendiente negativa. La oferta depende de cuánto quiere trabajar la gente a cada salario. En el equilibrio, el salario real crece cuando sube la PTF o el capital por trabajador.</p>
<ul><li><b>Salario mínimo</b> por encima del de equilibrio: la cantidad ofrecida supera a la demandada, y la diferencia es desempleo.</li>
<li><b>Costos de despido</b> altos: las empresas contratan menos en los auges y despiden menos en las recesiones; el efecto neto sobre el desempleo es ambiguo, pero alarga su duración.</li>
<li><b>Choques de oferta o demanda laboral:</b> mueven el salario y el empleo según cuál curva se desplace.</li></ul></section>
<section><h3>Dinámica del desempleo: el modelo de la bañera</h3>
<p>Con una fuerza de trabajo \(\bar L=E_t+U_t\), en cada período una fracción \(\bar s\) de los empleados pierde su empleo (tasa de separación) y una fracción \(\bar f\) de los desempleados encuentra uno (tasa de colocación):</p>
<div class="mj">\[\Delta U_{t+1}=\bar sE_t-\bar fU_t\]</div>
<p>En estado estacionario \(\Delta U=0\), así que \(\bar sE^*=\bar fU^*\). Dividiendo por \(\bar L\):</p>
<div class="mj">\[u^*=\frac{\bar s}{\bar s+\bar f}\]</div>
<p>Con \(\bar s=1\,\%\) y \(\bar f=20\,\%\) mensuales, \(u^*=0{,}01/0{,}21=4{,}76\,\%\). Es como una bañera: el agua (desempleados) entra por la llave (separaciones) y sale por el desagüe (colocaciones); el nivel se estabiliza donde ambos flujos se igualan.</p></section>
<section><h3>Tipos de desempleo</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Causa</th></tr>
<tr><td>Friccional</td><td>Toma tiempo encontrar el empleo adecuado; existe aun con la economía sana</td></tr>
<tr><td>Estructural</td><td>Desajuste entre las habilidades o la ubicación de los trabajadores y las vacantes; salarios por encima del equilibrio</td></tr>
<tr><td>Cíclico</td><td>Las recesiones: es la diferencia \(u_t-\bar u\) que se estudia en el corto plazo</td></tr></table></div>
<p>La tasa natural \(\bar u\) es la suma del friccional y el estructural.</p></section>
<section><h3>El valor del capital humano</h3>
<p>¿Por qué estudiar? Porque eleva el ingreso a lo largo de toda la vida. Se compara en valor presente: un salario anual \(w\) durante \(n\) años, descontado a la tasa \(R\), vale</p>
<div class="mj">\[\text{VPD}=w\left[1+\frac{1}{1+R}+\frac{1}{(1+R)^2}+\dots+\frac{1}{(1+R)^{n-1}}\right]\]</div>
<p>Si el VPD con estudios menos el costo de estudiar supera al VPD sin estudios, la educación es una buena inversión. La prima salarial de los universitarios ha crecido en las últimas décadas, por el cambio tecnológico que favorece las habilidades.</p></section>
${LAB}`,
qs:[{q:"Si la tasa de separación es 2 % y la de colocación 18 %, ¿cuál es la tasa natural de desempleo?",a:"u* = 0,02/(0,02 + 0,18) = 10 %."},
 {q:"¿Qué efecto tiene un salario mínimo por encima del de equilibrio?",a:"La cantidad de trabajo ofrecida supera a la demandada: hay desempleo igual a esa diferencia, y el empleo cae respecto al equilibrio."}]},

{id:"inflacion", parte:"Largo plazo", t:"Inflación", sim:"infl", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En el largo plazo, la inflación es un fenómeno monetario: si la cantidad de dinero crece más rápido que la producción, los precios suben. Las hiperinflaciones siempre van acompañadas de una emisión desbordada para financiar al gobierno.</p></section>
<section><h3>La teoría cuantitativa del dinero</h3>
<p>La ecuación de cambio relaciona el dinero \(M\), la velocidad de circulación \(V\), los precios \(P\) y la producción real \(Y\):</p>
<div class="mj">\[M_tV_t=P_tY_t\]</div>
<p>Es una identidad, porque así se define \(V\). Se vuelve teoría con dos supuestos: la velocidad es constante (\(V_t=\bar V\)) y la producción real la determinan los factores reales del largo plazo (\(Y_t=\bar Y_t\)). Entonces el nivel de precios queda determinado por el dinero: \(P_t=M_t\bar V/\bar Y_t\). En tasas de crecimiento:</p>
<div class="mj">\[g_M+g_V=\pi+g_Y\qquad\Longrightarrow\qquad\pi=\bar g_M-\bar g_Y\]</div>
<p>Si el dinero crece 10 % y la producción 3 %, la inflación es 7 %.</p>
<div class="callout"><b>Dicotomía clásica.</b> En el largo plazo, las variables reales (producción, empleo, salario real) se determinan sin el dinero, y el dinero solo determina las variables nominales. Se dice que el dinero es <b>neutral</b> en el largo plazo.</div></section>
<section><h3>Tasas de interés reales y nominales</h3>
<p>La <b>ecuación de Fisher</b> separa la tasa nominal \(i_t\) en la tasa real \(R_t\) y la inflación:</p>
<div class="mj">\[i_t=R_t+\pi_t\]</div>
<p>En el largo plazo la tasa real la fija el producto marginal del capital, así que más inflación se traduce uno a uno en tasas nominales más altas (efecto Fisher).</p></section>
<section><h3>Costos de la inflación y señoreaje</h3>
<ul><li><b>Redistribución:</b> la inflación no anticipada transfiere riqueza de los acreedores a los deudores.</li>
<li><b>Distorsiones:</b> impuestos sobre ganancias nominales, costos de cambiar precios (costos de menú), señales de precios más confusas.</li>
<li><b>Impuesto inflacionario:</b> cuando el gobierno emite para financiarse, obtiene <b>señoreaje</b>, y quien tiene el dinero pierde poder adquisitivo.</li></ul>
<p>Las hiperinflaciones (Alemania 1923, Zimbabue 2008, Venezuela desde 2017) empiezan cuando un gobierno con grandes déficits no puede endeudarse y recurre al banco central.</p></section>
${LAB}`,
qs:[{q:"El dinero crece 15 %, la producción 4 % y la velocidad es constante. ¿Cuál es la inflación?",a:"π = 15 % − 4 % = 11 %."},
 {q:"La tasa nominal es 12 % y la inflación 9 %. ¿Cuál es la tasa real?",a:"R = i − π = 3 %."}]},

// ===================== CORTO PLAZO =====================
{id:"cortoplazo", parte:"Corto plazo", t:"Introducción al corto plazo", sim:"okun", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En el corto plazo la producción se aleja de su potencial: en las recesiones cae por debajo, y en los auges lo supera. Ese alejamiento mueve el desempleo (ley de Okun) y la inflación (curva de Phillips).</p>
${NOT}</section>
<section><h3>La brecha del producto</h3>
<p>El producto potencial \(\bar Y_t\) es lo que se produciría si todos los recursos se usaran a su tasa normal: es lo que explican los modelos de largo plazo. La brecha del producto es la desviación porcentual:</p>
<div class="mj">\[\tilde Y_t=\frac{Y_t-\bar Y_t}{\bar Y_t}\]</div>
<p>\(\tilde Y_t=-3\,\%\) quiere decir que la economía produce 3 % menos que su potencial. Las fluctuaciones de corto plazo son las fluctuaciones de \(\tilde Y_t\).</p></section>
<section><h3>Ley de Okun</h3>
<p>Cuando la producción cae por debajo del potencial, las empresas despiden trabajadores. Empíricamente, en EE. UU., cada punto de brecha negativa sube el desempleo en medio punto:</p>
<div class="mj">\[u_t-\bar u=-\frac12\,\tilde Y_t\]</div>
<p>Con \(\tilde Y_t=-4\,\%\), el desempleo queda 2 puntos por encima de su tasa natural.</p></section>
<section><h3>Curva de Phillips</h3>
<p>Cuando la economía produce por encima de su potencial, las empresas trabajan a presión, los costos suben y aumentan los precios más de lo esperado. La versión de Jones (con expectativas adaptativas, \(\pi^e_t=\pi_{t-1}\)) es</p>
<div class="mj">\[\pi_t=\pi_{t-1}+\bar\nu\,\tilde Y_t+\bar o\qquad\Longleftrightarrow\qquad\Delta\pi_t=\bar\nu\,\tilde Y_t+\bar o\]</div>
<p>\(\bar\nu\) mide qué tanto reacciona la inflación a la brecha, y \(\bar o\) es un choque de precios (por ejemplo, del petróleo). Lo importante: una brecha positiva no produce inflación alta, sino inflación <b>creciente</b>. Para bajar la inflación hay que pasar por un período con \(\tilde Y_t<0\): una recesión.</p></section>
<section><h3>Ejemplo resuelto</h3>
<p>El potencial es 100, la producción 97, \(\bar u=5\,\%\), \(\bar\nu=0{,}5\) y la inflación pasada fue 4 %.</p>
<div class="mj">\[\tilde Y=\frac{97-100}{100}=-3\,\%\qquad u=5-\tfrac12(-3)=6{,}5\,\%\qquad\pi=4+0{,}5(-3)=2{,}5\,\%\]</div></section>
<section><h3>El modelo completo de corto plazo</h3>
<p>Las próximas estaciones arman la cadena: el banco central fija la tasa de interés real \(R_t\) (<b>MP</b>), la tasa determina la brecha \(\tilde Y_t\) (<b>IS</b>), y la brecha mueve la inflación (<b>Phillips</b>). Okun traduce la brecha a desempleo.</p>
<div class="eq al chain">R<sub>t</sub> → (IS) → Ỹ<sub>t</sub> → (Phillips) → Δπ<sub>t</sub> &nbsp;&nbsp;·&nbsp;&nbsp; Ỹ<sub>t</sub> → (Okun) → u<sub>t</sub></div></section>
${LAB}`,
qs:[{q:"Con brecha de +2 % y ν̄ = 0,4, ¿cuánto cambia la inflación?",a:"Δπ = 0,4 · 2 = 0,8 puntos: sube de, por ejemplo, 3 % a 3,8 %."},
 {q:"El desempleo está en 9 % y la tasa natural es 6 %. Según Okun, ¿cuál es la brecha?",a:String.raw`\(\tilde Y=-2(u-\bar u)=-2\cdot3=-6\,\%\).`}]},

{id:"recesion", parte:"Corto plazo", t:"La Gran Recesión", sim:"apal", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La crisis financiera de 2007-2009 fue la recesión más profunda en EE. UU. desde la Gran Depresión. Empezó con la caída del precio de la vivienda y se convirtió en crisis financiera por el alto apalancamiento de los bancos.</p></section>
<section><h3>Cronología</h3>
<div class="tbl"><table><tr><th>Fecha</th><th>Hecho</th></tr>
<tr><td>2006</td><td>Los precios de la vivienda en EE. UU. tocan su máximo después de una burbuja alimentada por créditos hipotecarios de alto riesgo (subprime)</td></tr>
<tr><td>Dic. 2007</td><td>Empieza la recesión, según el NBER</td></tr>
<tr><td>Sep. 2008</td><td>Quiebra Lehman Brothers; pánico financiero y congelamiento del crédito</td></tr>
<tr><td>Oct.–Dic. 2008</td><td>Rescate bancario (TARP); la Reserva Federal baja su tasa a casi cero</td></tr>
<tr><td>Feb. 2009</td><td>Estímulo fiscal (ARRA)</td></tr>
<tr><td>Jun. 2009</td><td>Termina oficialmente la recesión; el desempleo llega a 10 % en octubre</td></tr></table></div></section>
<section><h3>El mecanismo: hojas de balance y apalancamiento</h3>
<p>Un banco financia sus activos (préstamos, hipotecas) con deuda y con capital propio (patrimonio): \(\text{Activos}=\text{Pasivos}+\text{Patrimonio}\). El <b>apalancamiento</b> es la razón activos/patrimonio. Toda pérdida en los activos la absorbe el patrimonio, así que:</p>
<div class="mj">\[\%\Delta\,\text{Patrimonio}=\text{Apalancamiento}\times\%\Delta\,\text{Activos}\]</div>
<p>Con un apalancamiento de 25, una caída de 4 % en los activos borra todo el patrimonio: el banco queda insolvente. Antes de la crisis, varios bancos de inversión tenían apalancamientos de 30 o más.</p>
<p>Para recuperar su capital, los bancos venden activos (lo que baja más sus precios) y prestan menos. Eso es un <b>credit crunch</b>.</p></section>
<section><h3>Cómo se ve en el modelo de corto plazo</h3>
<ul><li>El pánico eleva el <b>diferencial de riesgo</b>: aunque la Reserva Federal baje su tasa, la tasa a la que se endeudan empresas y hogares sube. En la IS, \(R_t\) aumenta.</li>
<li>La caída de la riqueza (vivienda, acciones) reduce el consumo, y la incertidumbre, la inversión: \(\bar a\) cae. La IS se desplaza a la izquierda.</li>
<li>Con la tasa nominal en cero, la política monetaria convencional se agota (<b>límite inferior cero</b>) y aparecen la política fiscal y la flexibilización cuantitativa.</li></ul></section>
<section><h3>Otros choques del período</h3>
<p>El alza del petróleo de 2007-2008 (un \(\bar o>0\) en la curva de Phillips) y la crisis de deuda de la zona del euro (2010-2012) complicaron la recuperación. En Colombia la crisis llegó por la caída de las exportaciones y de los flujos de capital, pero el sistema financiero, con menos exposición a hipotecas riesgosas, no colapsó.</p></section>
${LAB}`,
qs:[{q:"Un banco tiene activos por 200 y patrimonio de 10. Si sus activos pierden 3 % de su valor, ¿cuánto cae el patrimonio?",a:"El apalancamiento es 20, así que el patrimonio cae 20 × 3 % = 60 %: pasa de 10 a 4."},
 {q:"¿Por qué bajar la tasa de la Reserva Federal no bastó para reducir el R de la curva IS?",a:"Porque el diferencial de riesgo subió: la tasa que pagan empresas y hogares es la del banco central más una prima de riesgo, y la prima subió más de lo que bajó la tasa oficial."}]},

{id:"is", parte:"Corto plazo", t:"La curva IS", sim:"is", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La curva IS dice cómo la tasa de interés real afecta la producción de corto plazo: cuando la tasa sube, invertir sale más caro, cae la inversión y cae la producción.</p>
${NOT}</section>
<section><h3>Construcción</h3>
<p>Parte de la identidad del gasto, dividida por el producto potencial:</p>
<div class="mj">\[\frac{Y_t}{\bar Y_t}=\frac{C_t}{\bar Y_t}+\frac{I_t}{\bar Y_t}+\frac{G_t}{\bar Y_t}+\frac{EX_t}{\bar Y_t}-\frac{IM_t}{\bar Y_t}\]</div>
<p>Cada componente se modela como una fracción del potencial. Solo la inversión depende de la tasa de interés real:</p>
<div class="mj">\[\frac{C_t}{\bar Y_t}=\bar a_c,\quad\frac{G_t}{\bar Y_t}=\bar a_g,\quad\frac{EX_t}{\bar Y_t}=\bar a_{ex},\quad\frac{IM_t}{\bar Y_t}=\bar a_{im},\quad\frac{I_t}{\bar Y_t}=\bar a_i-\bar b\,(R_t-\bar r)\]</div>
<p>Restando 1 a los dos lados (\(\tilde Y_t=Y_t/\bar Y_t-1\)):</p>
<div class="mj">\[\boxed{\tilde Y_t=\bar a-\bar b\,(R_t-\bar r)}\qquad\text{con}\qquad\bar a=\bar a_c+\bar a_i+\bar a_g+\bar a_{ex}-\bar a_{im}-1\]</div></section>
<section><h3>Lectura</h3>
<ul><li>\(\bar r\) es el producto marginal del capital: la tasa real de largo plazo. Si \(R_t=\bar r\) y \(\bar a=0\), la economía está en su potencial.</li>
<li>\(\bar b\) mide qué tanto reacciona la inversión a la tasa: es la pendiente (en valor absoluto) de la IS.</li>
<li>\(\bar a\) es el <b>choque de demanda agregada</b>. Si los hogares consumen más, el gobierno gasta más o suben las exportaciones, \(\bar a>0\) y la IS se desplaza a la derecha.</li></ul>
<p>En el plano \((\tilde Y,R)\) la IS tiene pendiente negativa. Un cambio de \(R_t\) es un movimiento <i>a lo largo</i> de la curva; un cambio de \(\bar a\), un <i>desplazamiento</i>.</p></section>
<section><h3>Ejemplo</h3>
<p>Con \(\bar a=0\), \(\bar b=0{,}5\) y \(\bar r=2\,\%\): si el banco central sube \(R\) a 5 %, la brecha es \(\tilde Y=0-0{,}5\,(5-2)=-1{,}5\,\%\). Si además el gobierno sube su gasto en 1 % del potencial (\(\Delta\bar a_g=1\)), la brecha queda en \(-0{,}5\,\%\).</p></section>
<section><h3>El multiplicador en la IS</h3>
<p>Si el consumo también depende de la brecha, \(\frac{C_t}{\bar Y_t}=\bar a_c+\bar x\,\tilde Y_t\), al despejar aparece un multiplicador como el keynesiano:</p>
<div class="mj">\[\tilde Y_t=\frac{1}{1-\bar x}\big[\bar a-\bar b\,(R_t-\bar r)\big]\]</div>
<p>Jones considera que \(\bar x\) es pequeño (el consumo responde poco a ingresos transitorios, por la teoría del ingreso permanente), y por eso trabaja con el multiplicador igual a 1. La rama «Modelo keynesiano y multiplicador» desarrolla el caso clásico.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="ismp"></div></section>
${LAB}`,
deep:[{k:"Consumo",t:"Ingreso permanente y ciclo de vida",html:"<p>Friedman (ingreso permanente) y Modigliani (ciclo de vida) argumentaron que el consumo depende del ingreso de toda la vida, no del de este año. Un aumento transitorio del ingreso se reparte en muchos años de consumo, así que la propensión a consumir de un ingreso transitorio es baja. Por eso en la IS de Jones el consumo es una fracción fija del potencial y el multiplicador es cercano a 1.</p>"}],
qs:[{q:"Con b̄ = 0,5 y r̄ = 2 %, ¿qué tasa real lleva la brecha a −2 % si ā = 0?",a:String.raw`\(-2=-0{,}5\,(R-2)\Rightarrow R=6\,\%\).`},
 {q:"Una caída de la confianza de los consumidores, ¿mueve la economía a lo largo de la IS o la desplaza?",a:String.raw`La desplaza a la izquierda: baja \(\bar a_c\) y con él \(\bar a\).`}]},

{id:"mp", parte:"Corto plazo", t:"Política monetaria y la curva de Phillips", sim:"ismp", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El banco central fija la tasa de interés nominal. Como la inflación se mueve despacio, eso le permite fijar también la tasa real de corto plazo, y con ella la brecha del producto y la inflación. Este es el modelo IS-MP-Phillips.</p>
${NOT}</section>
<section><h3>La curva MP</h3>
<p>El banco central (en Colombia, el Banco de la República; en EE. UU., la Reserva Federal) fija la tasa nominal \(i_t\) comprando y vendiendo bonos. Por Fisher, \(R_t=i_t-\pi_t\). Como la inflación es rígida en el corto plazo, al mover \(i_t\) mueve \(R_t\) uno a uno. La curva MP es una <b>recta horizontal</b> en el nivel que escoja el banco central:</p>
<div class="mj">\[\text{MP:}\quad R_t=\text{lo que escoja el banco central}\]</div>
<p>En el largo plazo, en cambio, la tasa real la fija la economía real: \(R=\bar r\).</p></section>
<section><h3>El modelo IS-MP-Phillips</h3>
<div class="tbl"><table><tr><th>Curva</th><th>Ecuación</th><th>Determina</th></tr>
<tr><td>MP</td><td>\(R_t\) fijada por el banco central</td><td>La tasa real</td></tr>
<tr><td>IS</td><td>\(\tilde Y_t=\bar a-\bar b\,(R_t-\bar r)\)</td><td>La brecha del producto</td></tr>
<tr><td>Phillips</td><td>\(\Delta\pi_t=\bar\nu\,\tilde Y_t+\bar o\)</td><td>El cambio en la inflación</td></tr></table></div>
<p>El orden de lectura es siempre el mismo: MP → IS → Phillips.</p></section>
<section><h3>Ejemplo: la desinflación de Volcker</h3>
<p>A finales de los setenta la inflación en EE. UU. superaba 10 %. Paul Volcker, presidente de la Reserva Federal desde 1979, subió las tasas con fuerza. En el modelo: \(R_t\) sube por encima de \(\bar r\), la IS lleva a \(\tilde Y_t<0\) (la recesión de 1981-1982, con desempleo cercano a 11 %) y la curva de Phillips hace caer la inflación, que bajó a cerca de 4 % hacia 1983.</p>
<p>Con \(\bar a=0\), \(\bar b=0{,}5\), \(\bar\nu=0{,}5\) y la tasa 3 puntos por encima de \(\bar r\) durante 3 años:</p>
<div class="mj">\[\tilde Y=-0{,}5\cdot3=-1{,}5\,\%\quad\text{cada año}\qquad\Delta\pi=0{,}5\cdot(-1{,}5)=-0{,}75\text{ puntos por año}\]</div>
<p>Después de tres años, la inflación bajó 2,25 puntos. Cuando la tasa vuelve a \(\bar r\), la brecha se cierra y la inflación se queda en su nuevo nivel, más bajo.</p></section>
<section><h3>Choques y respuestas</h3>
<div class="tbl"><table><tr><th>Choque</th><th>Sin respuesta del banco central</th><th>Respuesta posible</th></tr>
<tr><td>Demanda: \(\bar a>0\)</td><td>\(\tilde Y>0\) e inflación creciente</td><td>Subir \(R\) en \(\bar a/\bar b\) y estabilizar todo</td></tr>
<tr><td>Inflación: \(\bar o>0\) (petróleo)</td><td>La inflación sube y se queda alta</td><td>Dilema: subir \(R\) baja la inflación pero causa recesión</td></tr>
<tr><td>Financiero: sube la prima de riesgo</td><td>\(R\) efectiva sube, \(\tilde Y<0\)</td><td>Bajar la tasa oficial para compensar</td></tr></table></div>
<p>Los choques de demanda no crean dilema; los de oferta sí: el banco central debe elegir entre estabilizar la producción o la inflación.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="ismp"></div></section>
${LAB}`,
deep:[{k:"Detalle",t:"Cómo fija el banco central la tasa nominal",html:String.raw`<p>El banco central es el único que puede crear dinero base. Si quiere bajar la tasa, compra bonos (inyecta dinero) hasta que la tasa de mercado baje al nivel deseado; si quiere subirla, vende bonos. En la práctica fija una tasa de referencia para los préstamos de muy corto plazo a los bancos, y las demás tasas se mueven con ella. La rama «Mercado de dinero» muestra este mecanismo con la oferta y la demanda de dinero.</p>`},
 {k:"Colombia",t:"El esquema de inflación objetivo",html:"<p>El Banco de la República tiene una meta de inflación de 3 % con un rango de ±1 punto. Su Junta Directiva sube la tasa de política cuando espera que la inflación supere la meta, y la baja cuando espera que quede por debajo y la economía tiene holgura (brecha negativa). Es exactamente el razonamiento del modelo IS-MP-Phillips.</p>"}],
qs:[{q:"Con b̄ = 0,5, si ā sube 1 punto, ¿cuánto debe subir R el banco central para mantener la brecha en cero?",a:String.raw`\(\Delta R=\bar a/\bar b=1/0{,}5=2\) puntos.`},
 {q:"¿Por qué un choque petrolero crea un dilema y un choque de demanda no?",a:"El de demanda mueve la producción y la inflación en la misma dirección, así que una sola herramienta los corrige a la vez. El petrolero sube la inflación sin subir la brecha: para bajar la inflación hay que crear una recesión."}]},

{id:"oada", parte:"Corto plazo", t:"Política de estabilización y OA-DA", sim:"oada", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Si el banco central sigue una regla (sube la tasa real cuando la inflación supera su meta), el modelo IS-MP-Phillips se resume en dos curvas en el plano (\(\tilde Y,\pi\)): la demanda agregada (DA) y la oferta agregada (OA). Con ellas se analizan todos los choques y la política de estabilización.</p>
${NOT}</section>
<section><h3>La regla de política y la DA</h3>
<p>El banco central sigue la regla</p>
<div class="mj">\[R_t-\bar r=\bar m\,(\pi_t-\bar\pi)\]</div>
<p>donde \(\bar\pi\) es la meta de inflación y \(\bar m\) mide qué tan agresivo es. Reemplazando en la IS:</p>
<div class="mj">\[\text{DA:}\qquad\tilde Y_t=\bar a-\bar b\bar m\,(\pi_t-\bar\pi)\]</div>
<p>La DA tiene pendiente negativa en (\(\tilde Y,\pi\)): con más inflación, el banco central sube la tasa y la producción cae. Se desplaza con \(\bar a\) (choques de demanda) y con \(\bar\pi\) (cambio de meta).</p></section>
<section><h3>La OA</h3>
<p>Es la curva de Phillips:</p>
<div class="mj">\[\text{OA:}\qquad\pi_t=\pi_{t-1}+\bar\nu\,\tilde Y_t+\bar o\]</div>
<p>Tiene pendiente positiva y pasa por \((0,\pi_{t-1})\) si \(\bar o=0\). Cada período se desplaza con la inflación del período anterior y con los choques \(\bar o\).</p></section>
<section><h3>Equilibrio y dinámica</h3>
<p>Igualando las dos curvas en cada período:</p>
<div class="mj">\[\pi_t=\frac{\pi_{t-1}+\bar\nu\,\bar a+\bar\nu\bar b\bar m\,\bar\pi+\bar o}{1+\bar\nu\bar b\bar m},\qquad\tilde Y_t=\bar a-\bar b\bar m\,(\pi_t-\bar\pi)\]</div>
<p>El <b>estado estacionario</b> es \(\tilde Y=0\) y \(\pi=\bar\pi\) (cuando \(\bar a=0\) y \(\bar o=0\)). Si la inflación empieza por encima de la meta, la economía pasa por una recesión mientras la OA baja período a período hasta \(\bar\pi\).</p></section>
<section><h3>Los cuatro ejercicios típicos</h3>
<div class="tbl"><table><tr><th>Choque</th><th>Impacto</th><th>Dinámica</th></tr>
<tr><td>Inflación \(\bar o>0\) por un período</td><td>OA sube: \(\pi\uparrow\), \(\tilde Y<0\) (estanflación)</td><td>La OA baja poco a poco; se vuelve al estado estacionario</td></tr>
<tr><td>Demanda \(\bar a>0\) temporal</td><td>DA a la derecha: \(\tilde Y>0\), \(\pi\uparrow\)</td><td>Al terminar, \(\pi\) queda alta y hace falta una recesión para bajarla</td></tr>
<tr><td>Demanda \(\bar a>0\) permanente</td><td>Igual al inicio</td><td>La inflación sube hasta que el banco central lleva \(\tilde Y\) a cero con una tasa más alta: \(\pi=\bar\pi+\bar a/(\bar b\bar m)\)</td></tr>
<tr><td>Desinflación: baja \(\bar\pi\)</td><td>DA a la izquierda: \(\tilde Y<0\)</td><td>Recesión mientras la inflación baja a la nueva meta</td></tr></table></div></section>
<section><h3>Ejemplo resuelto</h3>
<p>Con \(\bar b=\bar m=\bar\nu=0{,}5\), \(\bar\pi=2\,\%\), \(\pi_0=2\,\%\) y un choque \(\bar o=1\) en el período 1:</p>
<div class="mj">\[\pi_1=\frac{2+0+0{,}125\cdot2+1}{1{,}125}=2{,}889\,\%\qquad\tilde Y_1=-0{,}25\,(2{,}889-2)=-0{,}222\,\%\]</div>
<p>En el período 2, sin choque: \(\pi_2=\frac{2{,}889+0{,}25}{1{,}125}=2{,}790\,\%\) y \(\tilde Y_2=-0{,}198\,\%\). La inflación vuelve a 2 % despacio, con una recesión leve todo el camino.</p></section>
<section><h3>Expectativas y credibilidad</h3>
<p>Con expectativas adaptativas, bajar la inflación cuesta una recesión. Si el banco central es creíble y la gente ajusta sus expectativas a la nueva meta de inmediato, la OA baja sola y la desinflación cuesta mucho menos. Por eso los bancos centrales cuidan su credibilidad y su independencia.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="oada"></div></section>
${LAB}`,
deep:[{k:"Derivación",t:"Despejar π de la OA y la DA",html:String.raw`<p>Reemplazando la DA en la OA: \(\pi_t=\pi_{t-1}+\bar\nu\big[\bar a-\bar b\bar m(\pi_t-\bar\pi)\big]+\bar o\). Pasando los términos con \(\pi_t\) a la izquierda: \(\pi_t(1+\bar\nu\bar b\bar m)=\pi_{t-1}+\bar\nu\bar a+\bar\nu\bar b\bar m\bar\pi+\bar o\). De ahí sale la fórmula del equilibrio.</p>`},
 {k:"Regla de Taylor",t:"La regla con brecha",html:String.raw`<p>Taylor (1993) propuso que el banco central responda también a la brecha: \(R_t-\bar r=\bar m(\pi_t-\bar\pi)+\bar n\,\tilde Y_t\). Con esa regla, la DA queda \(\tilde Y_t=\frac{\bar a-\bar b\bar m(\pi_t-\bar\pi)}{1+\bar b\bar n}\): más plana, así que los choques de demanda mueven menos la producción.</p>`}],
qs:[{q:"Si ā = 1 permanente, b̄ = m̄ = 0,5 y π̄ = 2 %, ¿en qué inflación se estabiliza la economía?",a:String.raw`En la que hace \(\tilde Y=0\): \(\pi=\bar\pi+\bar a/(\bar b\bar m)=2+1/0{,}25=6\,\%\). Para volver a 2 % el banco central tendría que cambiar \(\bar r\) en su regla.`},
 {q:"¿Por qué un choque de oferta negativo se llama estanflación?",a:"Porque sube la inflación y a la vez cae la producción por debajo del potencial (estancamiento + inflación)."}]}
];

const BRANCHES=[
{g:"Producción y crecimiento", from:"produccion", items:[
 {id:"contab", t:"Contabilidad del crecimiento", nuevo:true, sim:"contab", html:String.raw`
<section><h3>La idea</h3><p class="lead">¿Cuánto del crecimiento de un país se debe a acumular capital y cuánto a mejorar la productividad? Tomando tasas de crecimiento en la función de producción por trabajador \(y=\bar Ak^{1/3}\):</p>
<div class="mj">\[g_y=g_A+\frac13\,g_k\qquad\Longrightarrow\qquad g_A=g_y-\frac13\,g_k\]</div>
<p>La PTF se calcula como residuo (el «residuo de Solow»): es la parte del crecimiento que no explican los factores.</p></section>
<section><h3>Ejemplo</h3><p>Si \(y\) creció 2 % por año y \(k\) 2,4 %: el capital aporta \(\frac13\cdot2{,}4=0{,}8\) puntos (40 %) y la PTF \(2-0{,}8=1{,}2\) puntos (60 %).</p></section>
${LAB}`,
 qs:[{q:"Si g_y = 3 % y g_k = 6 %, ¿cuánto crece la PTF?",a:"g_A = 3 − 6/3 = 1 %."}]}]},
{g:"Crecimiento: extensiones", from:"solow", items:[
 {id:"oro", t:"Regla de oro del capital", nuevo:true, sim:"oro", html:String.raw`
<section><h3>La idea</h3><p class="lead">Más ahorro da más producción en el estado estacionario, pero no necesariamente más consumo: si se ahorra todo, no se consume nada. La tasa de ahorro que maximiza el consumo de estado estacionario es la <b>regla de oro</b>.</p>
<div class="mj">\[c^*(\bar s)=(1-\bar s)\,y^*(\bar s)=(1-\bar s)\,\bar A^{\frac{1}{1-\alpha}}\left(\frac{\bar s}{\bar d}\right)^{\frac{\alpha}{1-\alpha}}\]</div>
<p>Derivando e igualando a cero se obtiene \(\bar s_{\text{oro}}=\alpha\): con \(\alpha=1/3\), la tasa de ahorro de oro es 33 %. Si un país ahorra más, podría consumir más en todos los períodos ahorrando menos (está dinámicamente ineficiente).</p></section>
${LAB}`,
 qs:[{q:"¿Cuál es la tasa de ahorro de la regla de oro si α = 0,4?",a:"s = α = 40 %."}]}]},
{g:"Modelo keynesiano clásico", from:"is", items:[CLASICO[0],
 {id:"equilibrado", t:"Multiplicador del presupuesto equilibrado", nuevo:true, sim:"equi", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si el gobierno sube el gasto y lo financia subiendo los impuestos en la misma cantidad, el déficit no cambia, pero el PIB sí: sube exactamente lo mismo que el gasto.</p>
<div class="mj">\[\Delta Y=\frac{1}{1-c_1}\Delta G-\frac{c_1}{1-c_1}\Delta T\;\overset{\Delta G=\Delta T}{=}\;\frac{1-c_1}{1-c_1}\Delta G=\Delta G\]</div></section><section><h3>Visual: prueba «∆G = ∆T = +50»</h3><div data-vis="keynes"></div></section>
${LAB}`,
 qs:[{q:"¿Depende el multiplicador del presupuesto equilibrado de c₁?",a:"No, siempre vale 1 en el modelo keynesiano simple, sea cual sea la propensión a consumir."}]}]},
{g:"Dinero e IS-LM", from:"mp", items:[CLASICO[1],CLASICO[2],
 {id:"expulsion", t:"Política fiscal y monetaria: efecto expulsión", nuevo:true, sim:"expu", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un aumento del gasto desplaza la IS a la derecha: sube el PIB, pero también la tasa de interés, y eso reduce la inversión. Un aumento de la oferta monetaria desplaza la LM a la derecha: baja la tasa, sube la inversión y sube el PIB.</p>
<div class="mj">\[\text{Expulsión}=\Delta I=-b\,\Delta r\]</div>
<p class="hint">En el modelo IS-MP de Jones no hay expulsión si el banco central mantiene fija la tasa: la MP es horizontal. En IS-LM, con la oferta de dinero fija, la tasa sube sola.</p></section><section><h3>Visual: mira el efecto expulsión</h3><div data-vis="islm"></div></section>
${LAB}`}]},
{g:"Visuales", from:"intro", items:[
 {id:"visuales", t:"Visuales de cambios: todos los gráficos", html:String.raw`
<section><h3>Para qué sirve</h3><p class="lead">Los gráficos del curso en los que se estudian desplazamientos, juntos. Mueve una curva y el texto de abajo te dice qué cambió, qué pudo haberlo causado, el mecanismo y el resultado.</p>
<ul><li><b>Línea punteada:</b> posición inicial; <b>sólida:</b> posición actual.</li><li><b>Círculos:</b> arrástralos (o usa las flechas del teclado) para mover la curva.</li><li><b>Choques de ejemplo:</b> cargan casos típicos; después puedes seguir moviendo a mano.</li></ul></section>
<section><h3>Gráficos</h3><div data-vis="*"></div></section>`}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"oada",links:["medicion","solow","trabajo","inflacion","cortoplazo","is","mp","oada"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del parcial."}
];
const ALIAS={};
