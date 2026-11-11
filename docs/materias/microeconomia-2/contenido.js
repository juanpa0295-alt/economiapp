// Microeconomía II · contenido de la ruta
// =====================================================================
// CONTENIDO: Microeconomía II (1503703, U. de Antioquia).
// Equilibrio general, elección social, externalidades, bienes públicos, incertidumbre e información asimétrica (Varian, 9.ª ed.; Nicholson).
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"general", parte:"Unidad 1 · Equilibrio general", t:"Equilibrio parcial frente a equilibrio general", html:String.raw`
<section><h3>La idea</h3><p class="lead">El equilibrio parcial estudia un mercado suponiendo que los demás no cambian. El equilibrio general estudia todos los mercados a la vez: un cambio en uno (por ejemplo, un impuesto al café) mueve precios e ingresos en los otros, y esos cambios vuelven al primero.</p></section>
<section><h3>Supuestos del modelo</h3>
<ul><li>Competencia perfecta en todos los mercados: todos son precio-aceptantes.</li><li>Preferencias y tecnologías dadas, con curvas de indiferencia e isocuantas convexas.</li><li>Derechos de propiedad bien definidos sobre las dotaciones y las empresas.</li><li>Sin externalidades, bienes públicos ni información asimétrica (esos son los fallos que se estudian después).</li></ul></section>
<section><h3>La ley de Walras</h3>
<p>Como cada consumidor gasta exactamente su ingreso, el valor de los excesos de demanda suma cero para <b>cualquier</b> vector de precios:</p>
<div class="mj">\[\sum_{j}p_j\,z_j(p)=0\]</div>
<p>Consecuencias: si \(n-1\) mercados están en equilibrio, el último también lo está; y solo se pueden determinar los <b>precios relativos</b>, así que se fija un numerario (por ejemplo, \(p_2=1\)).</p></section>
<section><h3>Existencia, unicidad y estabilidad</h3><p>Arrow y Debreu (1954) probaron que, con preferencias continuas y convexas y sin rendimientos crecientes, existe un vector de precios que vacía todos los mercados. La unicidad y la estabilidad (el tanteo walrasiano: subir el precio si hay exceso de demanda) requieren supuestos adicionales, como que los bienes sean sustitutos brutos.</p></section>
<section><h3>Mapa de la unidad</h3><ol><li><b>Economía de intercambio</b> (caja de Edgeworth): dotaciones, curva de contrato, equilibrio walrasiano.</li><li><b>Eficiencia de Pareto y teoremas del bienestar.</b></li><li><b>Economía con producción</b> (Robinson Crusoe) y su análisis de bienestar.</li></ol></section>`,
qs:[{q:"En una economía con 3 bienes, si los mercados 1 y 2 están en equilibrio, ¿qué pasa con el 3?",a:"También está en equilibrio, por la ley de Walras: p₃z₃ = −(p₁z₁ + p₂z₂) = 0."}]},

{id:"intercambio", parte:"Unidad 1 · Equilibrio general", t:"Economía de dotaciones: la caja de Edgeworth", sim:"edge", html:String.raw`
<section><h3>La idea</h3><p class="lead">Dos consumidores, A y B, y dos bienes, sin producción. Cada uno tiene una dotación inicial. La caja de Edgeworth muestra todas las formas de repartir el total: A mide desde la esquina inferior izquierda y B desde la superior derecha.</p></section>
<section><h3>Intercambio y curva de contrato</h3>
<p>Si en la dotación las curvas de indiferencia se cortan, hay una lente de asignaciones que mejoran a ambos: conviene intercambiar. Las asignaciones donde ya no se puede mejorar a uno sin empeorar al otro son las de tangencia:</p>
<div class="mj">\[TMS_A=TMS_B\]</div>
<p>Su lugar geométrico es la <b>curva de contrato</b>. El tramo de la curva dentro de la lente es el <b>núcleo</b>: las asignaciones que ningún consumidor rechazaría frente a quedarse con su dotación.</p></section>
<section><h3>Equilibrio walrasiano</h3>
<p>Con precios \(p_1,p_2\), cada consumidor vende su dotación y escoge su mejor canasta: \(p_1x_1^i+p_2x_2^i=p_1\omega_1^i+p_2\omega_2^i\). El equilibrio es el precio relativo con el que las demandas suman las dotaciones. Con Cobb-Douglas \(u_A=x^{\alpha}y^{1-\alpha}\), \(u_B=x^{\beta}y^{1-\beta}\) y \(p_y=1\):</p>
<div class="mj">\[p^*=\frac{p_x}{p_y}=\frac{\alpha\,\omega^A_y+\beta\,\omega^B_y}{(1-\alpha)\,\omega^A_x+(1-\beta)\,\omega^B_x}\]</div>
<p>En el equilibrio las dos curvas son tangentes a la misma recta de precios: \(TMS_A=TMS_B=p_x/p_y\). Por eso es eficiente.</p></section>
<section><h3>Ejemplo</h3><p>\(u_A=u_B=\sqrt{xy}\), \(\omega^A=(8,2)\), \(\omega^B=(2,8)\): \(p^*=(0{,}5\cdot2+0{,}5\cdot8)/(0{,}5\cdot8+0{,}5\cdot2)=1\). Ingresos: 10 cada uno, así que cada uno consume (5, 5). A vende 3 de \(x\) y compra 3 de \(y\). La utilidad pasa de 4 a 5 para ambos. El núcleo va de \(x_A=4\) a \(x_A=6\) sobre la diagonal.</p></section>
${LAB}`,
qs:[{q:"¿Por qué el equilibrio walrasiano está sobre la curva de contrato?",a:"Porque cada consumidor iguala su TMS al mismo precio relativo; entonces las TMS son iguales entre sí, que es la condición de la curva de contrato."}]},

{id:"pareto", parte:"Unidad 1 · Equilibrio general", t:"Eficiencia de Pareto y teoremas del bienestar", sim:"segundo", html:String.raw`
<section><h3>Eficiencia de Pareto</h3><p>Una asignación es <b>eficiente en el sentido de Pareto</b> si no existe otra que mejore a alguien sin empeorar a nadie. No dice nada sobre la equidad: dar todo a un solo consumidor también es eficiente.</p></section>
<section><h3>Primer teorema del bienestar</h3><p>Todo equilibrio competitivo es eficiente en el sentido de Pareto (si no hay externalidades y las preferencias son localmente no saciadas). Es la versión formal de la mano invisible: los mercados agotan las ganancias del comercio sin que nadie lo planee.</p></section>
<section><h3>Segundo teorema del bienestar</h3><p>Si las preferencias (y tecnologías) son convexas, <b>toda</b> asignación eficiente se puede alcanzar como equilibrio competitivo, redistribuyendo antes las dotaciones con transferencias de suma fija. Lección: la eficiencia y la distribución se pueden separar; para cambiar la distribución no hace falta tocar los precios, basta con redistribuir la riqueza. En la práctica, las transferencias de suma fija son difíciles: los impuestos reales distorsionan, y aparece la disyuntiva entre <b>eficiencia y equidad</b>.</p></section>
<section><h3>Ejemplo</h3><p>En la economía anterior, para llegar a \((7,7)\) para A (sobre la curva de contrato), el precio de apoyo es \(p=TMS=1\) y A necesita una riqueza de 14. Su dotación vale 10: hay que transferirle 4 unidades de \(y\) (o su equivalente) desde B.</p></section>
${LAB}`,
qs:[{q:"¿Qué dice el segundo teorema del bienestar y qué supuesto clave necesita?",a:"Que cualquier asignación eficiente puede ser un equilibrio competitivo con la redistribución adecuada de dotaciones; necesita preferencias convexas (y transferencias de suma fija)."}]},

{id:"produccion", parte:"Unidad 1 · Equilibrio general", t:"Economía con producción (Robinson Crusoe)", sim:"crusoe", html:String.raw`
<section><h3>La idea</h3><p class="lead">Robinson es a la vez consumidor y productor: reparte su tiempo \(T\) entre trabajar \(L\) (para producir cocos \(c=f(L)\)) y descansar \(R=T-L\). Su óptimo iguala la tasa a la que está dispuesto a cambiar ocio por cocos con la tasa a la que puede transformarlos:</p>
<div class="mj">\[\frac{UMg_R}{UMg_c}=PMg_L\qquad(TMS=TMT)\]</div></section>
<section><h3>Descentralización</h3><p>El mismo óptimo se alcanza con mercados: "Robinson empresa" maximiza su beneficio a un salario \(w\) (contrata hasta \(PMg_L=w\)) y "Robinson consumidor" vende trabajo, recibe el salario y el beneficio de su empresa, y elige consumo y ocio con \(TMS=w\). Con el salario correcto, ambas decisiones coinciden: es el primer teorema con producción. Si hay rendimientos crecientes, el óptimo no puede sostenerse con precios (no hay un máximo del beneficio).</p></section>
<section><h3>Producción con dos bienes</h3><p>Con dos bienes, las asignaciones eficientes de factores forman la <b>frontera de posibilidades de producción</b>; su pendiente es la tasa marginal de transformación \(TMT=CMg_x/CMg_y\). La eficiencia global exige \(TMS=TMT\): la economía produce la mezcla que los consumidores valoran, y en competencia ambas son iguales a \(p_x/p_y\).</p></section>
<section><h3>Ejemplo</h3><p>\(u=c^{0,5}R^{0,5}\), \(c=10\sqrt L\), \(T=24\): \(L=\frac{a\gamma T}{a\gamma+1-a}=\frac{0{,}25\cdot24}{0{,}75}=8\) horas, \(c=28{,}28\), salario \(w=PMg_L=1{,}77\), beneficio \(c-wL=14{,}14\).</p></section>
${LAB}`,
qs:[{q:"¿Qué condición de eficiencia combina consumo y producción?",a:"TMS = TMT: la tasa a la que los consumidores cambian un bien por otro debe ser igual a la tasa a la que la economía puede transformarlos."}]},

// ===================== UNIDAD 2 =====================
{id:"social", parte:"Unidad 2 · Elección social y bienestar", t:"Agregación de preferencias y teorema de Arrow", sim:"voto", html:String.raw`
<section><h3>La idea</h3><p class="lead">Las sociedades deben escoger entre alternativas (políticas, proyectos) a partir de las preferencias de sus miembros. ¿Hay una forma razonable de convertir preferencias individuales en un orden social?</p></section>
<section><h3>Mecanismos de agregación</h3>
<div class="tbl"><table><tr><th>Mecanismo</th><th>Cómo funciona</th><th>Problema</th></tr>
<tr><td>Mayoría por pares</td><td>Gana la alternativa que vence a cada una de las demás (ganador de Condorcet)</td><td>Puede haber ciclos: A > B > C > A (paradoja de Condorcet); el resultado depende de la agenda</td></tr>
<tr><td>Pluralidad</td><td>Gana la más votada en primer lugar</td><td>Ignora el resto del orden</td></tr>
<tr><td>Recuento de Borda</td><td>Con \(k\) alternativas, \(k-1\) puntos al primer lugar, \(k-2\) al segundo...</td><td>Depende de alternativas irrelevantes; invita al voto estratégico</td></tr></table></div></section>
<section><h3>Condiciones de Arrow</h3>
<ol><li><b>Dominio universal:</b> funciona con cualquier combinación de preferencias individuales.</li><li><b>Transitividad</b> del orden social.</li><li><b>Pareto:</b> si todos prefieren A a B, la sociedad también.</li><li><b>Independencia de alternativas irrelevantes:</b> el orden social entre A y B solo depende de cómo ordena cada uno A y B.</li><li><b>No dictadura.</b></li></ol>
<p><b>Teorema de imposibilidad de Arrow (1951):</b> con tres o más alternativas, ninguna regla cumple las cinco condiciones a la vez. Una salida es restringir el dominio: con preferencias <b>unimodales</b> (de un solo pico), la mayoría es transitiva y gana la alternativa preferida del votante mediano.</p></section>
${LAB}`,
qs:[{q:"Tres votantes: A>B>C, B>C>A y C>A>B. ¿Hay ganador de Condorcet?",a:"No: A vence a B, B vence a C y C vence a A (cada uno 2 a 1). Es un ciclo, la paradoja de Condorcet."}]},

{id:"bienestar", parte:"Unidad 2 · Elección social y bienestar", t:"Funciones de bienestar social y desigualdad", sim:"desig", html:String.raw`
<section><h3>Funciones de bienestar social</h3><p>Una función de bienestar social \(W(u_1,\dots,u_n)\) ordena las asignaciones según las utilidades de todos. El óptimo social es el punto de la <b>frontera de posibilidades de utilidad</b> que maximiza \(W\): siempre es eficiente en el sentido de Pareto.</p>
<div class="tbl"><table><tr><th>Criterio</th><th>Función</th><th>Juicio</th></tr>
<tr><td>Utilitarista (Bentham)</td><td>\(W=\sum u_i\)</td><td>Solo importa el total, no su reparto</td></tr>
<tr><td>Rawlsiano (maximin)</td><td>\(W=\min\{u_i\}\)</td><td>Solo importa el que está peor</td></tr>
<tr><td>Nash</td><td>\(W=\prod u_i\)</td><td>Intermedio</td></tr>
<tr><td>Bergson-Samuelson / Atkinson</td><td>\(W=\sum\frac{u_i^{1-\varepsilon}}{1-\varepsilon}\)</td><td>\(\varepsilon\) mide la aversión a la desigualdad: 0 utilitarista, ∞ rawlsiano</td></tr></table></div></section>
<section><h3>Medir la desigualdad</h3>
<p><b>Coeficiente de Gini:</b> la mitad de la diferencia media entre todos los pares de ingresos, dividida por la media: 0 si todos ganan igual, cercano a 1 si uno tiene todo. Gráficamente, el área entre la curva de Lorenz y la diagonal.</p>
<p><b>Índice de Atkinson:</b> \(A_\varepsilon=1-\dfrac{y_{ede}}{\bar y}\), donde \(y_{ede}\) es el <b>ingreso equivalente igualmente distribuido</b>: el ingreso que, dado a todos por igual, daría el mismo bienestar. Dice qué fracción del ingreso total la sociedad estaría dispuesta a sacrificar para eliminar la desigualdad.</p></section>
${LAB}`,
qs:[{q:"Con ingresos 10 y 30, ¿qué ingreso prefiere un rawlsiano: (10, 30) o (15, 20)?",a:"(15, 20), porque el que está peor tiene 15 > 10, aunque el total sea menor."}]},

// ===================== UNIDAD 3 =====================
{id:"externalidades", parte:"Unidad 3 · Externalidades", t:"Externalidades: Pigou, Coase e instrumentos", sim:"extern", html:String.raw`
<section><h3>La idea</h3><p class="lead">Hay externalidad cuando la acción de un agente afecta el bienestar de otro sin pasar por el mercado (contaminación, ruido, vacunas). El mercado ignora ese costo o beneficio y la asignación deja de ser eficiente.</p></section>
<section><h3>Asignación eficiente</h3>
<p>Con una externalidad negativa en la producción, el costo marginal social es el privado más el daño marginal: \(CMgS=CMgP+DMg\). El mercado produce donde \(P=CMgP\) (demasiado); lo eficiente es \(P=CMgS\). La pérdida irrecuperable es el triángulo entre ambos niveles. Con externalidades positivas pasa lo contrario: se produce muy poco.</p></section>
<section><h3>Soluciones</h3>
<div class="tbl"><table><tr><th>Solución</th><th>Idea</th></tr>
<tr><td><b>Fusión o internalización</b></td><td>Si el que causa y el que sufre son la misma empresa, el daño entra en su cálculo</td></tr>
<tr><td><b>Impuesto pigouviano</b></td><td>Cobrar por unidad el daño marginal en el óptimo: \(t=DMg(Q^*)\). El mercado llega solo a \(Q^*\)</td></tr>
<tr><td><b>Teorema de Coase</b></td><td>Si los derechos de propiedad están definidos y negociar no cuesta, las partes llegan a la asignación eficiente <b>sin importar a quién se le den los derechos</b>; el reparto del excedente sí cambia</td></tr>
<tr><td><b>Permisos negociables</b></td><td>Se fija el total de emisiones y se reparten permisos que se compran y venden: el precio iguala el costo marginal de reducir de todos, así que se reduce al menor costo</td></tr>
<tr><td><b>Normas (estándares)</b></td><td>Límite igual para todos: fácil de vigilar, pero más costoso si los costos de reducir difieren</td></tr></table></div>
<p>Aplicaciones conductuales: información comparativa (facturas que muestran el consumo de los vecinos), opciones por defecto y normas sociales también reducen externalidades.</p></section>
<section><h3>Ejemplo</h3><p>\(P=100-Q\), \(CMgP=10+Q\), daño marginal 10. Mercado: \(Q=45\). Óptimo: \(100-Q=20+Q\Rightarrow Q=40\). Impuesto pigouviano \(t=10\). PIE \(=\tfrac12\cdot5\cdot10=25\).</p></section>
${LAB}`,
qs:[{q:"Según Coase, ¿por qué no importa a quién se le asignen los derechos?",a:"Porque, sin costos de negociación, las partes negocian hasta aprovechar todas las ganancias: el nivel de la actividad es el eficiente en ambos casos; solo cambia quién le paga a quién."},
 {q:"¿Por qué los permisos negociables reducen la contaminación al menor costo?",a:"Porque las empresas que reducen barato venden permisos a las que reducen caro, hasta que todas tienen el mismo costo marginal de reducir (igual al precio del permiso)."}]},

// ===================== UNIDAD 4 =====================
{id:"publicos", parte:"Unidad 4 · Bienes públicos", t:"Bienes públicos: Samuelson, Lindahl y votante mediano", sim:"public", html:String.raw`
<section><h3>Atributos y tipología</h3>
<div class="tbl"><table><tr><th></th><th>Excluible</th><th>No excluible</th></tr>
<tr><td><b>Rival</b></td><td>Bienes privados (ropa, comida)</td><td>Recursos comunes (pesca, agua subterránea)</td></tr>
<tr><td><b>No rival</b></td><td>Bienes de club (TV por suscripción, peajes)</td><td>Bienes públicos puros (defensa, alumbrado, faros)</td></tr></table></div></section>
<section><h3>El comportamiento oportunista (free rider)</h3><p>Como nadie puede ser excluido, cada uno espera que otros paguen. En la provisión voluntaria, cada persona aporta solo hasta que su <b>propio</b> beneficio marginal iguala el costo, ignorando el beneficio de los demás: se provee muy poco o nada.</p></section>
<section><h3>Regla de Samuelson</h3>
<p>Como todos consumen la misma cantidad \(G\), el beneficio marginal social es la <b>suma vertical</b> de los beneficios marginales individuales. Provisión eficiente:</p>
<div class="mj">\[\sum_{i=1}^n BMg_i(G)=CMg(G)\qquad\Longleftrightarrow\qquad\sum_iTMS_i=TMT\]</div></section>
<section><h3>Cómo decidir cuánto proveer</h3>
<ul><li><b>Lindahl:</b> a cada persona se le cobra una fracción del costo igual a su beneficio marginal en el óptimo; así todos quieren la misma cantidad, la eficiente. Problema: cada uno tiene incentivo a ocultar su verdadera valoración.</li>
<li><b>Votante mediano:</b> si cada uno paga una cuota igual y las preferencias son unimodales, gana la cantidad preferida por el votante mediano. Es eficiente solo si el beneficio del mediano coincide con el promedio.</li>
<li><b>Tiebout:</b> si hay muchas jurisdicciones, la gente "vota con los pies" y se agrupa según el paquete de bienes públicos e impuestos que prefiere.</li>
<li><b>Contribuciones voluntarias:</b> en el juego de bienes públicos, aportar nada es una estrategia dominante aunque todos ganarían aportando todo; en los experimentos la gente aporta al principio y el aporte cae con las rondas.</li></ul></section>
<section><h3>Ejemplo</h3><p>Tres vecinos con \(BMg=10-G\), \(8-G\) y \(6-G\); costo 12 por unidad. Samuelson: \(24-3G=12\Rightarrow G^*=4\). Nadie lo provee solo (cada \(a_i<12\)). Lindahl: pagan 6/12, 4/12 y 2/12 del costo. Con cuota igual de 4, prefieren 6, 4 y 2: el mediano elige 4.</p></section>
${LAB}`,
qs:[{q:"¿Por qué para un bien público se suman verticalmente los beneficios marginales?",a:"Porque todos consumen la misma cantidad: una unidad más beneficia a todos a la vez, así que su valor social es la suma de lo que vale para cada uno."}]},

// ===================== UNIDAD 5 =====================
{id:"incertidumbre", parte:"Unidad 5 · Elección bajo incertidumbre", t:"Valor esperado, utilidad esperada y riesgo", sim:"lote", html:String.raw`
<section><h3>Valor esperado y la paradoja de San Petersburgo</h3><p>El valor esperado de una lotería es \(VE=\sum_s\pi_s x_s\). Bernoulli propuso un juego: se lanza una moneda hasta que salga cara; si sale en el lanzamiento \(k\), se pagan \(2^k\). El valor esperado es \(\sum_k(1/2)^k2^k=1+1+\dots=\infty\), pero nadie pagaría mucho por jugarlo. Su solución: la gente evalúa la utilidad del dinero, no el dinero. Con \(u=\ln x\), la utilidad esperada es \(2\ln2\) y el equivalente cierto apenas 4.</p></section>
<section><h3>Utilidad esperada</h3>
<div class="mj">\[UE=\sum_s\pi_s\,u(x_s)\]</div>
<p>Von Neumann y Morgenstern mostraron que, si las preferencias sobre loterías cumplen ciertos axiomas (en especial el de independencia), se pueden representar con la utilidad esperada. El <b>equivalente cierto</b> \(EC\) es el pago seguro con la misma utilidad: \(u(EC)=UE\). La <b>prima de riesgo</b> es \(VE-EC\).</p></section>
<section><h3>Actitudes y medidas del riesgo</h3>
<div class="tbl"><table><tr><th>Actitud</th><th>Utilidad</th><th>Relación</th></tr><tr><td>Aversión</td><td>Cóncava</td><td>\(EC&lt;VE\), prima positiva</td></tr><tr><td>Neutralidad</td><td>Lineal</td><td>\(EC=VE\)</td></tr><tr><td>Amor al riesgo</td><td>Convexa</td><td>\(EC>VE\)</td></tr></table></div>
<p>Medida de Arrow-Pratt: aversión absoluta \(r(x)=-u''(x)/u'(x)\); relativa \(x\,r(x)\). La varianza y el coeficiente de variación miden la dispersión de la lotería. Un averso al riesgo compra seguro: con un seguro de prima actuarialmente justa (precio por peso asegurado igual a la probabilidad de pérdida), se asegura por completo.</p></section>
<section><h3>Paradojas y teoría prospectiva</h3>
<p><b>Allais:</b> muchas personas prefieren 1 millón seguro a una lotería con 10 % de 5 millones, 89 % de 1 millón y 1 % de nada, pero a la vez prefieren 10 % de 5 millones a 11 % de 1 millón. Esa combinación viola el axioma de independencia. <b>Ellsberg:</b> la gente prefiere apostar con probabilidades conocidas que desconocidas (aversión a la ambigüedad).</p>
<p><b>Teoría prospectiva</b> (Kahneman y Tversky): la gente evalúa ganancias y pérdidas frente a un punto de referencia, las pérdidas pesan más que las ganancias (aversión a la pérdida, \(\lambda\approx2{,}25\)), es aversa al riesgo en ganancias y amante del riesgo en pérdidas, y sobrepondera las probabilidades pequeñas.</p></section>
${LAB}`,
qs:[{q:"Con u = √x y una lotería 50 % de 100 y 50 % de 0, ¿cuál es el equivalente cierto?",a:"UE = 0,5·10 = 5 ⟹ EC = 5² = 25; prima de riesgo 50 − 25 = 25."}]},

// ===================== UNIDAD 6 =====================
{id:"seleccion", parte:"Unidad 6 · Información asimétrica", t:"Selección adversa y señalización", sim:"limon", html:String.raw`
<section><h3>Definiciones</h3><p>Hay información asimétrica cuando una parte sabe algo relevante que la otra no. Si lo oculto es una característica (el tipo), hay <b>selección adversa</b>; si es una acción posterior al contrato, hay <b>riesgo moral</b>.</p></section>
<section><h3>El mercado de los limones (Akerlof, 1970)</h3><p>Los vendedores de carros usados conocen su calidad; los compradores solo el promedio. A un precio dado, solo venden los dueños de carros con calidad menor que ese precio, así que la calidad promedio ofrecida cae, los compradores pagan menos y salen más carros buenos. El mercado puede reducirse a los peores carros o desaparecer, aunque todo intercambio sería beneficioso. Pasa en seguros (los de alto riesgo son los que más compran), crédito y mercado laboral.</p></section>
<section><h3>Soluciones: señales y diseño de incentivos</h3>
<ul><li><b>Señalización (Spence, 1973):</b> la parte informada hace algo costoso que es más barato para el tipo bueno. La educación puede servir de señal aunque no aumente la productividad: hay un equilibrio separador si a los trabajadores de baja productividad no les conviene imitar a los de alta.</li>
<li><b>Filtrado (screening):</b> la parte no informada ofrece un menú de contratos para que cada tipo se autoseleccione (deducibles altos y bajos en los seguros).</li>
<li>Garantías, reputación, certificaciones y seguros obligatorios.</li></ul>
<p>Con educación \(e\) de costo \(c_i\) por unidad y productividades \(a_1&lt;a_2\), un nivel \(e^*\) separa a los tipos si \(\frac{a_2-a_1}{c_1}\le e^*\le\frac{a_2-a_1}{c_2}\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué la educación puede ser una señal aunque no aumente la productividad?",a:"Porque es más costosa para los trabajadores menos productivos; si el costo de imitar supera la ganancia salarial, solo los productivos la adquieren y el empleador puede distinguirlos."}]},

{id:"agente", parte:"Unidad 6 · Información asimétrica", t:"Riesgo moral, principal-agente y emparejamientos", sim:"agente", html:String.raw`
<section><h3>Riesgo moral</h3><p>Después de firmar el contrato, el agente puede cambiar su comportamiento sin que el principal lo observe: el asegurado se cuida menos, el empleado se esfuerza menos. Asegurar por completo elimina los incentivos; no asegurar elimina la protección. El contrato óptimo equilibra ambos.</p></section>
<section><h3>El modelo principal-agente</h3>
<p>El principal (dueño) contrata a un agente (trabajador) cuyo esfuerzo no observa; solo ve el resultado, que depende del esfuerzo y de la suerte. El contrato debe cumplir:</p>
<ul><li><b>Participación:</b> el agente acepta si su utilidad esperada supera su utilidad de reserva \(\bar u\).</li>
<li><b>Compatibilidad de incentivos:</b> al agente le conviene el esfuerzo que el principal quiere.</li></ul>
<p>Si el esfuerzo fuera observable, el principal pagaría un salario fijo que solo compense el esfuerzo. Si no lo es, el pago debe depender del resultado; como el agente es averso al riesgo, hay que pagarle una prima por el riesgo: ese sobrecosto es el <b>costo de agencia</b>. Si el agente fuera neutral al riesgo, lo mejor sería "venderle" el negocio (contrato de alquiler).</p>
<div class="tbl"><table><tr><th>Contrato</th><th>Incentivos</th><th>Riesgo para el agente</th></tr><tr><td>Salario fijo</td><td>Ninguno</td><td>Ninguno</td></tr><tr><td>Alquiler (el agente se queda con todo y paga una renta)</td><td>Máximos</td><td>Todo</td></tr><tr><td>Participación o bonos por resultado</td><td>Intermedios</td><td>Intermedio</td></tr></table></div></section>
<section><h3>Emparejamientos sin mercado (Roth)</h3><p>Hay asignaciones en las que no se usan precios: residentes médicos y hospitales, estudiantes y colegios, donantes de riñón. El algoritmo de <b>aceptación diferida</b> de Gale y Shapley produce un emparejamiento <b>estable</b>: ninguna pareja preferiría estar junta antes que con su pareja asignada. Alvin Roth lo aplicó al diseño de esos mercados (Nobel 2012).</p></section>
${LAB}`,
qs:[{q:"¿Por qué el seguro completo genera riesgo moral?",a:"Porque el asegurado ya no asume ninguna parte de la pérdida, así que tiene menos incentivo a tomar precauciones, que el asegurador no puede observar."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"agente",links:["intercambio","externalidades","publicos","incertidumbre","seleccion"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del parcial."}
];
const ALIAS={};
