// Principios de Microeconomía · contenido de la ruta (programa 1503701)
// =====================================================================
// CONTENIDO: Principios de Microeconomía (1503701, U. de Antioquia).
// Sigue el programa del curso: introducción y herramientas, consumidor, productor y equilibrio competitivo.
// Notación de Varian para el consumidor (x1, x2, p1, p2, m) y de Nicholson para el productor (L, K, w, r, q).
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"intro", parte:"Unidad 1 · Introducción", t:"¿Qué es la microeconomía? Supuestos y mercado", sim:"aptos", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La microeconomía estudia cómo deciden los agentes individuales (consumidores y empresas) y cómo sus decisiones se coordinan en los mercados a través de los precios. El curso construye el modelo de <b>competencia perfecta</b>, el punto de partida para estudiar después los mercados imperfectos y los problemas de bienestar.</p></section>
<section><h3>Los supuestos del modelo competitivo</h3>
<div class="tbl"><table><tr><th>Supuesto</th><th>Qué quiere decir</th></tr>
<tr><td><b>Racionalidad</b></td><td>Cada agente escoge lo mejor que puede entre lo que puede: el consumidor maximiza su utilidad y la empresa su beneficio.</td></tr>
<tr><td><b>Información perfecta</b></td><td>Todos conocen los precios y las características de los bienes.</td></tr>
<tr><td><b>Competencia perfecta</b></td><td>Muchos compradores y vendedores, bien homogéneo, libre entrada y salida: nadie puede influir en el precio (todos son <i>precio-aceptantes</i>).</td></tr>
<tr><td><b>Derechos de propiedad</b></td><td>Están bien definidos y se cumplen: lo que se compra se puede usar y lo que se vende se transfiere.</td></tr></table></div>
<p>El intercambio voluntario solo ocurre si ambas partes ganan. El precio cumple dos funciones: <b>informa</b> (qué tan escaso es un bien) e <b>incentiva</b> (a producir más lo que vale más y a consumir menos lo escaso).</p></section>
<section><h3>Cómo se hace un modelo</h3>
<p>Varian empieza con el mercado de apartamentos de una ciudad universitaria. Dos principios guían todo el curso:</p>
<ul><li><b>Principio de optimización:</b> cada persona escoge el mejor patrón de consumo que puede pagar.</li>
<li><b>Principio de equilibrio:</b> los precios se ajustan hasta que la cantidad demandada es igual a la ofrecida.</li></ul>
<p>Cada persona tiene un <b>precio de reserva</b>: lo máximo que está dispuesta a pagar. Ordenando los precios de reserva de mayor a menor se obtiene la curva de demanda (escalonada). Si hay \(S\) apartamentos, el precio de equilibrio deja exactamente \(S\) personas con precio de reserva mayor o igual: es el precio de reserva de la persona número \(S+1\) (la primera que se queda sin apartamento).</p>
<p>La estática comparativa pregunta qué pasa si cambia algo: más apartamentos bajan el precio; un impuesto a los arrendadores, con oferta fija, no cambia el precio (lo pagan los dueños).</p></section>
<section><h3>Etapas de la microeconomía</h3>
<p>De la teoría clásica del valor (Smith, Ricardo) se pasó con la revolución marginalista (Jevons, Menger, Walras, hacia 1870) a explicar los precios por la utilidad marginal y la escasez. Marshall (1890) unió oferta y demanda en el equilibrio parcial; Hicks, Samuelson y Arrow-Debreu formalizaron la teoría con matemáticas. Después vinieron los mercados imperfectos, la información asimétrica y la teoría de juegos.</p></section>
${LAB}`,
qs:[{q:"¿Qué quiere decir que una empresa sea precio-aceptante?",a:"Que es tan pequeña frente al mercado que no puede cambiar el precio: toma el precio de mercado como dado y solo decide cuánto vender."},
 {q:"Hay 3 apartamentos y 5 personas con precios de reserva 500, 450, 400, 350 y 300. ¿Cuál es el precio de equilibrio?",a:"El de la cuarta persona, 350: a ese precio (o un poco más) solo los tres primeros quieren un apartamento."}]},

{id:"matematicas", parte:"Unidad 1 · Introducción", t:"Herramientas matemáticas", sim:"mate", html:String.raw`
<section><h3>La idea</h3><p class="lead">Casi todo el curso es un problema de optimización: maximizar utilidad o beneficio, o minimizar costos, con o sin restricciones. Estas son las herramientas.</p></section>
<section><h3>Optimización sin restricciones</h3>
<p>Para \(f(x)\): la <b>condición de primer orden</b> (CPO) es \(f'(x^*)=0\); la de <b>segundo orden</b> (CSO) para un máximo es \(f''(x^*)<0\). Con dos variables, \(f_x=f_y=0\) y, para un máximo, \(f_{xx}<0\) y \(f_{xx}f_{yy}-f_{xy}^2>0\) (hessiana definida negativa).</p></section>
<section><h3>Optimización con restricciones: Lagrange</h3>
<p>Para maximizar \(f(x,y)\) sujeto a \(g(x,y)=c\), se arma el lagrangiano y se derivan las CPO:</p>
<div class="mj">\[\mathcal L=f(x,y)+\lambda\,[c-g(x,y)]\qquad f_x=\lambda g_x,\quad f_y=\lambda g_y,\quad g(x,y)=c\]</div>
<p>Dividiendo las dos primeras: \(\dfrac{f_x}{f_y}=\dfrac{g_x}{g_y}\): en el óptimo, la curva de nivel de \(f\) es tangente a la restricción. El multiplicador \(\lambda\) mide cuánto sube el valor óptimo si la restricción se relaja en una unidad: en el consumidor, es la utilidad marginal del ingreso.</p></section>
<section><h3>Teorema de la envolvente</h3>
<p>Si \(V(a)=\max_x f(x,a)\), el efecto de un parámetro sobre el valor óptimo es solo el efecto <b>directo</b>: \(\dfrac{dV}{da}=\dfrac{\partial f}{\partial a}\Big|_{x=x^*(a)}\). Con restricción, \(\dfrac{dV}{da}=\dfrac{\partial\mathcal L}{\partial a}\). Por eso \(\partial V/\partial m=\lambda\) y, más adelante, el lema de Shephard y la identidad de Roy.</p></section>
<section><h3>Tipos de funciones</h3>
<div class="tbl"><table><tr><th>Propiedad</th><th>Definición</th><th>Para qué sirve</th></tr>
<tr><td>Cóncava</td><td>\(f(tx+(1-t)y)\ge tf(x)+(1-t)f(y)\); con dos variables, hessiana semidefinida negativa</td><td>Garantiza que la CPO da un máximo global</td></tr>
<tr><td>Cuasicóncava</td><td>Los conjuntos de nivel superior \(\{x:f(x)\ge k\}\) son convexos</td><td>Curvas de indiferencia convexas: la tangencia es un máximo</td></tr>
<tr><td>Homogénea de grado \(k\)</td><td>\(f(tx,ty)=t^kf(x,y)\)</td><td>Rendimientos a escala: \(k>1\) crecientes, \(k=1\) constantes, \(k<1\) decrecientes</td></tr>
<tr><td>Homotética</td><td>Transformación creciente de una función homogénea</td><td>La TMS solo depende de la proporción \(y/x\): las sendas de expansión son rectas</td></tr></table></div>
<p><b>Teorema de Euler:</b> si \(f\) es homogénea de grado \(k\), \(x f_x+y f_y=k\,f\). Con \(k=1\), pagar a cada factor su producto marginal agota el producto.</p></section>
${LAB}`,
qs:[{q:"¿De qué grado es homogénea f(x, y) = x^0,3 y^0,5?",a:"De grado 0,3 + 0,5 = 0,8: rendimientos decrecientes a escala."},
 {q:"¿Qué mide el multiplicador de Lagrange en el problema del consumidor?",a:"La utilidad marginal del ingreso: cuánto sube la utilidad máxima si el ingreso aumenta en una unidad."}]},

// ===================== UNIDAD 2 =====================
{id:"presupuesto", parte:"Unidad 2 · Teoría del consumidor", t:"La restricción presupuestaria", sim:"pres", html:String.raw`
<section><h3>La idea</h3><p class="lead">El consumidor no puede gastar más de lo que tiene. Con dos bienes, las canastas que puede comprar forman el <b>conjunto presupuestario</b>, cuya frontera es la recta presupuestaria.</p>
<div class="mj">\[p_1x_1+p_2x_2\le m\qquad\Longrightarrow\qquad x_2=\frac{m}{p_2}-\frac{p_1}{p_2}\,x_1\]</div>
<p>El intercepto vertical \(m/p_2\) es lo máximo de \(x_2\) que puede comprar; el horizontal, \(m/p_1\). La <b>pendiente</b> \(-p_1/p_2\) es el costo de oportunidad: para consumir una unidad más de \(x_1\) hay que renunciar a \(p_1/p_2\) unidades de \(x_2\).</p></section>
<section><h3>Cambios en la recta</h3>
<ul><li><b>Sube \(m\):</b> desplazamiento paralelo hacia afuera.</li>
<li><b>Sube \(p_1\):</b> la recta gira sobre el intercepto vertical y se vuelve más empinada.</li>
<li><b>Todos los precios y el ingreso se multiplican por \(t\):</b> la recta no cambia (la inflación pura no afecta el conjunto presupuestario).</li>
<li><b>Bien numerario:</b> si \(p_2=1\), \(m\) se mide en unidades de \(x_2\).</li></ul></section>
<section><h3>Impuestos, subsidios y racionamiento</h3>
<div class="tbl"><table><tr><th>Política</th><th>Efecto en la recta</th></tr>
<tr><td>Impuesto por unidad \(t\) sobre \(x_1\)</td><td>El precio pasa a \(p_1+t\): la recta gira y se vuelve más empinada</td></tr>
<tr><td>Impuesto ad valorem \(\tau\)</td><td>El precio pasa a \((1+\tau)p_1\)</td></tr>
<tr><td>Subsidio por unidad \(s\)</td><td>El precio pasa a \(p_1-s\): la recta se aplana</td></tr>
<tr><td>Impuesto o subsidio de suma fija</td><td>Cambia \(m\): desplazamiento paralelo</td></tr>
<tr><td>Racionamiento \(x_1\le\bar x_1\)</td><td>El conjunto se corta con una recta vertical en \(\bar x_1\)</td></tr></table></div>
<p>Si el impuesto solo se cobra a partir de cierta cantidad, la recta tiene un quiebre: más empinada después de ese punto.</p></section>
<section><h3>Ejemplo</h3><p>Con \(p_1=2\), \(p_2=4\) y \(m=100\): interceptos 50 (de \(x_1\)) y 25 (de \(x_2\)), pendiente \(-0{,}5\). Un impuesto de 1 por unidad de \(x_1\) lleva el precio a 3 y el intercepto horizontal a 33,3; un subsidio de 1 lo lleva a 100.</p></section>
${LAB}`,
qs:[{q:"Si se duplican los dos precios y el ingreso, ¿qué pasa con la recta presupuestaria?",a:"Nada: los interceptos y la pendiente quedan iguales."},
 {q:"¿Qué diferencia hay entre un impuesto por unidad y uno de suma fija en la recta?",a:"El impuesto por unidad cambia el precio relativo (la recta gira); el de suma fija solo reduce el ingreso (desplazamiento paralelo)."}]},

{id:"preferencias", parte:"Unidad 2 · Teoría del consumidor", t:"Preferencias y utilidad", sim:"pref", html:String.raw`
<section><h3>La idea</h3><p class="lead">Las preferencias ordenan las canastas de la mejor a la peor. La utilidad es solo una forma de ponerles un número a ese orden.</p></section>
<section><h3>Axiomas</h3>
<ul><li><b>Completas:</b> cualquier par de canastas se puede comparar.</li><li><b>Reflexivas:</b> toda canasta es al menos tan buena como sí misma.</li><li><b>Transitivas:</b> si \(X\succeq Y\) y \(Y\succeq Z\), entonces \(X\succeq Z\).</li></ul>
<p>Se suelen suponer además <b>monotonía</b> (más es mejor: curvas con pendiente negativa) y <b>convexidad</b> (los promedios son preferidos a los extremos: curvas convexas hacia el origen).</p></section>
<section><h3>La relación marginal de sustitución</h3>
<p>La TMS es la pendiente de la curva de indiferencia (en valor absoluto): cuántas unidades de \(x_2\) está dispuesto a entregar el consumidor por una unidad más de \(x_1\), quedando igual de bien. Con una función de utilidad:</p>
<div class="mj">\[\text{TMS}=\frac{UMg_1}{UMg_2}=\frac{\partial u/\partial x_1}{\partial u/\partial x_2}\]</div>
<p>Con preferencias convexas la TMS es <b>decreciente</b>: cuanto más \(x_1\) tiene, menos \(x_2\) entrega por una unidad adicional.</p></section>
<section><h3>Tipos de preferencias</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Utilidad</th><th>Curvas de indiferencia</th><th>TMS</th></tr>
<tr><td>Cobb-Douglas</td><td>\(x_1^ax_2^b\)</td><td>Convexas, sin tocar los ejes</td><td>\(\frac{a\,x_2}{b\,x_1}\)</td></tr>
<tr><td>Sustitutos perfectos</td><td>\(ax_1+bx_2\)</td><td>Rectas</td><td>\(a/b\), constante</td></tr>
<tr><td>Complementarios perfectos</td><td>\(\min\{ax_1,bx_2\}\)</td><td>En forma de L</td><td>No definida en el vértice</td></tr>
<tr><td>Cuasilineales</td><td>\(a\ln x_1+x_2\)</td><td>Paralelas verticalmente</td><td>\(a/x_1\), no depende de \(x_2\)</td></tr>
<tr><td>CES</td><td>\((ax_1^\rho+bx_2^\rho)^{1/\rho}\)</td><td>Entre rectas (\(\rho\to1\)) y L (\(\rho\to-\infty\))</td><td>\(\frac ab\left(\frac{x_1}{x_2}\right)^{\rho-1}\)</td></tr></table></div>
<p>También hay <b>males</b> (bienes que disgustan: curvas con pendiente positiva), <b>neutrales</b> (al consumidor le da igual: curvas verticales) y <b>saciedad</b> (un punto de máxima felicidad).</p></section>
<section><h3>Utilidad ordinal</h3>
<p>Solo importa el orden: cualquier transformación monótona creciente de \(u\) (por ejemplo \(\ln u\) o \(u^2\)) representa las mismas preferencias y tiene la misma TMS. Por eso \(x_1^{1/2}x_2^{1/2}\) y \(\tfrac12\ln x_1+\tfrac12\ln x_2\) son equivalentes.</p></section>
${LAB}`,
qs:[{q:"Calcula la TMS de u = x1² x2 en (2, 4).",a:String.raw`\(\text{TMS}=\frac{2x_1x_2}{x_1^2}=\frac{2x_2}{x_1}=\frac{2\cdot4}{2}=4\).`},
 {q:"¿Por qué u = x1 x2 y v = ln x1 + ln x2 representan las mismas preferencias?",a:"Porque v = ln u es una transformación monótona creciente: ordena igual las canastas y tiene la misma TMS, x2/x1."}]},

{id:"eleccion", parte:"Unidad 2 · Teoría del consumidor", t:"La elección óptima y la demanda", sim:"elec", html:String.raw`
<section><h3>La idea</h3><p class="lead">El consumidor escoge la canasta que le da más utilidad dentro de su conjunto presupuestario. En una solución interior, la curva de indiferencia es tangente a la recta:</p>
<div class="mj">\[\text{TMS}=\frac{UMg_1}{UMg_2}=\frac{p_1}{p_2}\qquad\Longleftrightarrow\qquad\frac{UMg_1}{p_1}=\frac{UMg_2}{p_2}\]</div>
<p>La última unidad de dinero gastada en cada bien debe dar la misma utilidad.</p></section>
<section><h3>Con Lagrange (Cobb-Douglas)</h3>
<p>\(\max x_1^ax_2^b\) sujeto a \(p_1x_1+p_2x_2=m\). De la tangencia \(\frac{a x_2}{b x_1}=\frac{p_1}{p_2}\) se obtiene \(p_2x_2=\frac ba p_1x_1\); reemplazando en la restricción:</p>
<div class="mj">\[x_1^*=\frac{a}{a+b}\,\frac{m}{p_1},\qquad x_2^*=\frac{b}{a+b}\,\frac{m}{p_2}\]</div>
<p>El consumidor gasta siempre la fracción \(a/(a+b)\) de su ingreso en el bien 1.</p></section>
<section><h3>Esquinas y otros casos</h3>
<ul><li><b>Sustitutos perfectos:</b> compra solo el bien con mayor utilidad marginal por peso: si \(p_1/p_2<a/b\), todo en \(x_1\) (\(x_1=m/p_1\)).</li>
<li><b>Complementarios perfectos:</b> consume en el vértice, \(ax_1=bx_2\): \(x_1=\frac{bm}{bp_1+ap_2}\).</li>
<li><b>Cuasilineales:</b> \(x_1=a\,p_2/p_1\) no depende del ingreso (si alcanza); si \(m<a\,p_2\), solución de esquina con \(x_2=0\).</li></ul>
<p>En una esquina no se cumple la tangencia: \(\text{TMS}\ne p_1/p_2\).</p></section>
<section><h3>Dualidad: minimizar el gasto</h3>
<p>El problema dual es gastar lo menos posible para alcanzar una utilidad \(\bar u\). Su solución son las <b>demandas hicksianas</b> (compensadas) \(h_i(p_1,p_2,\bar u)\) y la <b>función de gasto</b> \(e(p_1,p_2,\bar u)\). Las demandas marshallianas \(x_i(p,m)\) y la <b>función de utilidad indirecta</b> \(v(p,m)\) resuelven el problema original. Se cumple \(e(p,v(p,m))=m\) y \(h_i(p,\bar u)=x_i(p,e(p,\bar u))\). Lema de Shephard: \(\partial e/\partial p_i=h_i\).</p></section>
<section><h3>Ejemplo</h3><p>Con \(u=x_1x_2\), \(p_1=2\), \(p_2=4\), \(m=100\): \(x_1=50/2=25\), \(x_2=50/4=12{,}5\), \(u=312{,}5\). Comprobación: \(\text{TMS}=x_2/x_1=0{,}5=p_1/p_2\). Si fueran sustitutos perfectos \(u=x_1+x_2\), compraría solo \(x_1=50\), porque es más barato.</p></section>
${LAB}`,
qs:[{q:"Con u = x1^0,25 x2^0,75 y m = 200, ¿cuánto gasta en el bien 1?",a:"La fracción 0,25/(0,25 + 0,75) = 25 %: gasta 50."},
 {q:"Con u = min(x1, 2x2), p1 = 1, p2 = 2, m = 80, ¿cuál es la canasta óptima?",a:String.raw`En el vértice \(x_1=2x_2\): \(1\cdot2x_2+2x_2=80\Rightarrow x_2=20,\ x_1=40\).`}]},

{id:"slutsky", parte:"Unidad 2 · Teoría del consumidor", t:"Efecto sustitución, efecto renta y Slutsky", sim:"slut", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando sube el precio de un bien pasan dos cosas: el bien se vuelve <b>relativamente más caro</b> (efecto sustitución) y el consumidor queda <b>más pobre</b> (efecto renta). La ecuación de Slutsky separa los dos.</p></section>
<section><h3>La descomposición de Slutsky</h3>
<p>Sea \(A\) la canasta inicial. Se gira la recta al nuevo precio pero dándole al consumidor el ingreso justo para comprar \(A\): \(m'=m+\Delta p_1\,x_1^A\). La elección con ese ingreso es \(B\).</p>
<div class="mj">\[\underbrace{x_1(p_1',m)-x_1(p_1,m)}_{\text{efecto total}}=\underbrace{x_1(p_1',m')-x_1(p_1,m)}_{\text{sustitución (A→B)}}+\underbrace{x_1(p_1',m)-x_1(p_1',m')}_{\text{renta (B→C)}}\]</div>
<p>El efecto sustitución siempre va en contra del precio. El efecto renta depende del bien: si es <b>normal</b> refuerza la caída; si es <b>inferior</b> la contrarresta. Si el efecto renta de un bien inferior supera al de sustitución, la demanda sube con el precio: es un <b>bien Giffen</b>.</p>
<p>En tasas de cambio: \(\dfrac{\partial x_1}{\partial p_1}=\dfrac{\partial x_1^s}{\partial p_1}-x_1\dfrac{\partial x_1}{\partial m}\).</p></section>
<section><h3>La versión de Hicks</h3>
<p>En vez de mantener el poder de compra, se mantiene la <b>utilidad</b>: el ingreso compensado es \(e(p_1',p_2,u^A)\). Con cambios pequeños, las dos versiones coinciden.</p></section>
<section><h3>Ejemplo</h3>
<p>Con \(u=x_1x_2\), \(p_2=4\), \(m=100\), el precio \(p_1\) sube de 2 a 4. Inicial: \(x_1=25\). Final: \(x_1=12{,}5\).</p>
<div class="eq al">Slutsky: m′ = 100 + (4 − 2) · 25 = 150 ⟹ x₁(4, 150) = 75/4 = 18,75<br>Sustitución: 18,75 − 25 = −6,25 · Renta: 12,5 − 18,75 = −6,25<br>Hicks: e(4, 4, 312,5) = 141,42 ⟹ x₁ = 17,68 · Sustitución −7,32 · Renta −5,18</div></section>
${LAB}`,
qs:[{q:"¿Por qué el efecto sustitución nunca tiene el mismo signo que el cambio del precio?",a:"Porque, con el poder de compra compensado, la canasta anterior sigue alcanzable; si se escogiera más del bien encarecido, se violaría la preferencia revelada (o, con Hicks, la convexidad)."},
 {q:"¿Todo bien Giffen es inferior?",a:"Sí: para que la demanda suba con el precio, el efecto renta debe ir en contra del de sustitución y ser mayor, y eso solo ocurre con bienes inferiores."}]},

{id:"excedentes", parte:"Unidad 2 · Teoría del consumidor", t:"Excedente del consumidor, variación compensatoria y equivalente", sim:"exc", html:String.raw`
<section><h3>La idea</h3><p class="lead">¿Cuánto pierde un consumidor cuando sube un precio? Hay tres medidas en dinero, y coinciden solo cuando las preferencias son cuasilineales.</p></section>
<section><h3>Las tres medidas</h3>
<div class="tbl"><table><tr><th>Medida</th><th>Pregunta</th><th>Fórmula</th></tr>
<tr><td>Cambio en el excedente del consumidor</td><td>Área a la izquierda de la demanda entre los dos precios</td><td>\(\Delta EC=-\int_{p_1}^{p_1'}x_1(p,m)\,dp\)</td></tr>
<tr><td>Variación compensatoria (VC)</td><td>¿Cuánto dinero hay que darle <b>después</b> del cambio para que vuelva a su utilidad inicial?</td><td>\(VC=e(p',u^0)-m\)</td></tr>
<tr><td>Variación equivalente (VE)</td><td>¿Cuánto dinero habría que quitarle <b>antes</b> del cambio para dejarlo tan mal como queda después?</td><td>\(VE=m-e(p,u^1)\)</td></tr></table></div>
<p>Para un bien normal y un alza de precio: \(VE\le|\Delta EC|\le VC\). Con utilidad cuasilineal no hay efecto renta sobre \(x_1\) y las tres son iguales.</p></section>
<section><h3>Precio de reserva y excedente</h3>
<p>Con bienes discretos, el precio de reserva \(r_n\) es lo máximo que pagaría por la unidad \(n\). El <b>excedente bruto</b> es la suma de los precios de reserva de lo que compra (\(r_1+\dots+r_n\)); el <b>neto</b> le resta lo que paga: \(EC=\sum_{i\le n}r_i-p\,n\).</p></section>
<section><h3>Ejemplo</h3><p>Con \(u=x_1x_2\), \(m=100\), \(p_2=4\), si \(p_1\) sube de 2 a 4: \(VC=141{,}42-100=41{,}42\); \(VE=100-70{,}71=29{,}29\); \(\Delta EC=-\int_2^4 \frac{50}{p}\,dp=-50\ln2=-34{,}66\).</p></section>
${LAB}`,
qs:[{q:"¿En qué caso VC, VE y el cambio en el excedente coinciden?",a:"Con preferencias cuasilineales: la demanda del bien no depende del ingreso y no hay efecto renta."},
 {q:"Precios de reserva 10, 8, 6 y 4; el precio es 5. ¿Cuál es el excedente neto?",a:"Compra 3 unidades: (10 + 8 + 6) − 3 × 5 = 9."}]},

{id:"demanda", parte:"Unidad 2 · Teoría del consumidor", t:"La demanda de mercado y las elasticidades", sim:"dmer", html:String.raw`
<section><h3>La idea</h3><p class="lead">La demanda de mercado es la suma <b>horizontal</b> de las demandas individuales: a cada precio, se suman las cantidades. Las elasticidades miden qué tan sensible es esa cantidad.</p></section>
<section><h3>Elasticidades</h3>
<div class="tbl"><table><tr><th>Elasticidad</th><th>Fórmula</th><th>Lectura</th></tr>
<tr><td>Precio</td><td>\(\varepsilon=\frac{\partial q}{\partial p}\frac{p}{q}\)</td><td>\(|\varepsilon|>1\) elástica, \(<1\) inelástica, \(=1\) unitaria</td></tr>
<tr><td>Renta</td><td>\(\eta=\frac{\partial q}{\partial m}\frac{m}{q}\)</td><td>\(\eta>0\) normal (\(>1\) de lujo), \(\eta<0\) inferior</td></tr>
<tr><td>Cruzada</td><td>\(\varepsilon_{12}=\frac{\partial q_1}{\partial p_2}\frac{p_2}{q_1}\)</td><td>\(>0\) sustitutos, \(<0\) complementarios</td></tr></table></div>
<p>Con una demanda lineal \(q=a-bp\), la elasticidad cambia a lo largo de la curva: \(\varepsilon=-bp/q\). Es unitaria en el punto medio \(p=a/(2b)\), elástica arriba e inelástica abajo.</p></section>
<section><h3>Gasto total e ingreso marginal</h3>
<p>El gasto (ingreso de los vendedores) es \(I=pq\). Su cambio con la cantidad es el ingreso marginal:</p>
<div class="mj">\[IMg=\frac{dI}{dq}=p\left(1+\frac1\varepsilon\right)=p\left(1-\frac1{|\varepsilon|}\right)\]</div>
<p>Si la demanda es elástica, bajar el precio aumenta el gasto; si es inelástica, lo reduce. El gasto es máximo donde \(|\varepsilon|=1\).</p></section>
<section><h3>Ejemplo</h3><p>Dos consumidores: \(q_A=20-2p\) y \(q_B=10-p\). Para \(p\ge10\) solo compra A; para \(p<10\), \(Q=30-3p\). La demanda de mercado tiene un quiebre en \(p=10\).</p></section>
${LAB}`,
qs:[{q:"Con q = 100 − 2p, ¿en qué precio la elasticidad es unitaria?",a:"En p = 100/(2 · 2) = 25 (q = 50)."},
 {q:"Si la elasticidad precio es −0,5 y la empresa sube el precio, ¿qué pasa con su ingreso?",a:"Aumenta: la demanda es inelástica, así que la cantidad cae proporcionalmente menos de lo que sube el precio."}]},

{id:"dotaciones", parte:"Unidad 2 · Teoría del consumidor", t:"Elección con dotaciones", sim:"dota", html:String.raw`
<section><h3>La idea</h3><p class="lead">A veces el consumidor no tiene dinero sino una <b>dotación</b> de bienes \((\omega_1,\omega_2)\) que puede vender o cambiar. Su ingreso es el valor de esa dotación, y cambia cuando cambian los precios.</p>
<div class="mj">\[p_1x_1+p_2x_2=p_1\omega_1+p_2\omega_2\]</div>
<p>La recta siempre pasa por la dotación. Las <b>demandas brutas</b> son \(x_i\); las <b>netas</b>, \(x_i-\omega_i\): si son positivas compra, si son negativas vende (es oferente neto).</p></section>
<section><h3>Slutsky con dotaciones</h3>
<p>Cuando sube \(p_1\), aparece un tercer efecto: el valor de la dotación sube. Varian (cap. 9) descompone:</p>
<div class="mj">\[\Delta x_1=\underbrace{\Delta x_1^{s}}_{\text{sustitución}}+\underbrace{\Delta x_1^{m}}_{\text{renta ordinario}}+\underbrace{\Delta x_1^{w}}_{\text{renta-dotación}}\qquad \frac{dx_1}{dp_1}=\frac{\partial x_1^s}{\partial p_1}+(\omega_1-x_1)\frac{\partial x_1}{\partial m}\]</div>
<p>Si el consumidor es vendedor neto del bien (\(\omega_1>x_1\)) y el bien es normal, el alza del precio lo enriquece y puede terminar demandando más.</p></section>
<section><h3>Aplicación: oferta de trabajo</h3><p>El tiempo es una dotación: \(\bar L\) horas que se reparten entre ocio y trabajo, con el salario como precio del ocio. Un alza del salario tiene efecto sustitución (trabajar más) y efecto renta-dotación (con más ingreso, más ocio): la oferta de trabajo puede volverse hacia atrás.</p></section>
<section><h3>Ejemplo</h3><p>Con \(u=x_1x_2\), dotación (10, 10), \(p_2=1\), \(p_1\) sube de 1 a 2. Inicial: ingreso 20, \(x_1=10\). Final: ingreso 30, \(x_1=7{,}5\) (vende 2,5). Sustitución: −2,5; renta ordinario: −2,5; renta-dotación: +2,5; total: −2,5.</p></section>
${LAB}`,
qs:[{q:"Si un agricultor que vende café ve subir su precio, ¿por qué puede consumir más café?",a:"Porque es vendedor neto: la subida aumenta el valor de su dotación (efecto renta-dotación), y si el café es normal ese efecto puede superar al de sustitución."}]},

{id:"intertemporal", parte:"Unidad 2 · Teoría del consumidor", t:"Elección intertemporal", sim:"inter", html:String.raw`
<section><h3>La idea</h3><p class="lead">El consumidor reparte su consumo entre hoy y mañana. Puede ahorrar o endeudarse a la tasa de interés \(r\), que es el precio relativo del consumo presente.</p></section>
<section><h3>La restricción intertemporal</h3>
<div class="mj">\[c_1+\frac{c_2}{1+r}=m_1+\frac{m_2}{1+r}\qquad\text{(valor presente)}\qquad\Longleftrightarrow\qquad(1+r)c_1+c_2=(1+r)m_1+m_2\quad\text{(valor futuro)}\]</div>
<p>La recta pasa por la dotación \((m_1,m_2)\) y tiene pendiente \(-(1+r)\). Si \(c_1<m_1\) el consumidor es <b>prestamista</b> (ahorra); si \(c_1>m_1\), <b>prestatario</b>.</p></section>
<section><h3>Estática comparativa</h3>
<ul><li>Si sube \(r\), un prestamista sigue siendo prestamista (y queda mejor); un prestatario puede cambiar a prestamista o quedar peor.</li>
<li>Slutsky intertemporal: el efecto sustitución reduce \(c_1\); el efecto renta depende de si es prestamista (\(m_1-c_1>0\): sube \(c_1\)) o prestatario.</li>
<li><b>Tasa real:</b> con inflación \(\pi\), \(1+\rho=\frac{1+r}{1+\pi}\), es decir \(\rho\approx r-\pi\).</li></ul></section>
<section><h3>Ejemplo</h3><p>Con \(u=c_1c_2\), \(m_1=50\), \(m_2=165\), \(r=10\,\%\): riqueza \(W=50+165/1{,}1=200\); \(c_1=100\), \(c_2=110\). Pide prestados 50 hoy y paga 55 mañana.</p></section>
${LAB}`,
qs:[{q:"¿Cuál es el valor presente de recibir 110 dentro de un año si r = 10 %?",a:"110/1,1 = 100."},
 {q:"Si la tasa nominal es 12 % y la inflación 5 %, ¿cuál es la tasa real?",a:"1,12/1,05 − 1 = 6,67 % (aproximadamente 7 %)."}]},

// ===================== UNIDAD 3 =====================
{id:"tecnologia", parte:"Unidad 3 · Teoría del productor", t:"Tecnología y producción", sim:"tec", html:String.raw`
<section><h3>La idea</h3><p class="lead">La función de producción \(q=f(L,K)\) dice cuánto se puede producir como máximo con cada combinación de trabajo y capital. En el <b>corto plazo</b> algún factor está fijo; en el <b>largo plazo</b> todos son variables.</p></section>
<section><h3>Corto plazo: producto medio y marginal</h3>
<div class="mj">\[PMe_L=\frac{q}{L}\qquad PMg_L=\frac{\partial q}{\partial L}\]</div>
<p><b>Ley de los rendimientos decrecientes:</b> si se agregan unidades de un factor manteniendo los demás fijos, tarde o temprano el producto marginal disminuye. Relación media-marginal: si \(PMg>PMe\), el medio sube; si \(PMg<PMe\), baja; el marginal corta al medio en su máximo.</p>
<p>Con \(q=6L^2-0{,}2L^3\): \(PMg=12L-0{,}6L^2\) es máximo en \(L=10\); \(PMe=6L-0{,}2L^2\) es máximo en \(L=15\) (ahí \(PMg=PMe=45\)); el producto total es máximo en \(L=20\), donde \(PMg=0\). Una empresa racional produce en la etapa II (entre \(L=15\) y \(L=20\)).</p></section>
<section><h3>Largo plazo: isocuantas</h3>
<p>Una isocuanta reúne las combinaciones de \(L\) y \(K\) que producen lo mismo. Su pendiente es la <b>relación marginal de sustitución técnica</b>:</p>
<div class="mj">\[RMST=\frac{PMg_L}{PMg_K}\qquad\qquad\sigma=\frac{d\ln(K/L)}{d\ln RMST}\]</div>
<p>La <b>elasticidad de sustitución</b> \(\sigma\) mide qué tan fácil es reemplazar un factor por otro: 0 en Leontief, 1 en Cobb-Douglas, \(1/(1-\rho)\) en CES, infinita en la lineal.</p></section>
<section><h3>Rendimientos a escala</h3>
<p>Si \(f\) es homogénea de grado \(k\): \(f(tL,tK)=t^kf(L,K)\). Rendimientos crecientes si \(k>1\), constantes si \(k=1\), decrecientes si \(k<1\). En la Cobb-Douglas \(AL^\alpha K^\beta\), \(k=\alpha+\beta\). Los rendimientos a escala (todos los factores) son distintos de los rendimientos decrecientes de un factor.</p></section>
${LAB}`,
qs:[{q:"Con q = L^0,5 K^0,5, ¿cuál es la RMST en L = 4, K = 16?",a:"RMST = (0,5 K)/(0,5 L) = K/L = 4."},
 {q:"¿Puede una tecnología tener rendimientos constantes a escala y rendimientos decrecientes en cada factor?",a:"Sí: la Cobb-Douglas L^0,5 K^0,5 tiene rendimientos constantes (0,5 + 0,5 = 1) y producto marginal decreciente en L y en K."}]},

{id:"costos", parte:"Unidad 3 · Teoría del productor", t:"Minimización de costos y funciones de costos", sim:"cost", html:String.raw`
<section><h3>La idea</h3><p class="lead">Para producir \(q\) unidades, la empresa escoge la combinación de factores más barata. La solución es la tangencia entre la isocuanta y una <b>isocosto</b> \(wL+rK=C\).</p>
<div class="mj">\[RMST=\frac{PMg_L}{PMg_K}=\frac wr\qquad\Longleftrightarrow\qquad\frac{PMg_L}{w}=\frac{PMg_K}{r}\]</div></section>
<section><h3>Demandas condicionadas y función de costos</h3>
<p>Con \(q=AL^\alpha K^\beta\), la tangencia da \(K=\frac{\beta w}{\alpha r}L\). Reemplazando en la isocuanta se obtienen las <b>demandas condicionadas</b> \(L^c(w,r,q)\), \(K^c(w,r,q)\) y el costo mínimo:</p>
<div class="mj">\[C(w,r,q)=(\alpha+\beta)\left(\frac qA\right)^{\frac1{\alpha+\beta}}\left(\frac w\alpha\right)^{\frac\alpha{\alpha+\beta}}\left(\frac r\beta\right)^{\frac\beta{\alpha+\beta}}\]</div>
<p>La <b>senda de expansión</b> une las combinaciones óptimas para cada \(q\); con Cobb-Douglas es una recta. Con rendimientos constantes, el costo medio es constante; con crecientes, decreciente.</p></section>
<section><h3>Corto plazo</h3>
<p>Con el capital fijo en \(\bar K\): costo fijo \(CF=r\bar K\), costo variable \(CV=wL(q)\). Se definen \(CMe=CT/q\), \(CVMe=CV/q\), \(CFMe=CF/q\) y \(CMg=dCT/dq\). El <b>costo marginal corta al costo medio y al variable medio en sus mínimos</b>. Además \(CMg=w/PMg_L\) y \(CVMe=w/PMe_L\): las curvas de costos son el reflejo de las de producto.</p>
<p>El costo de largo plazo es la <b>envolvente</b> de los costos de corto plazo: nunca es mayor que ninguno de ellos.</p></section>
<section><h3>Ejemplo</h3><p>Con \(q=L^{0,5}K^{0,5}\), \(w=4\), \(r=1\), \(q=10\): la tangencia da \(K=4L\); \(10=\sqrt{L\cdot4L}=2L\Rightarrow L=5\), \(K=20\), \(C=4\cdot5+20=40\). Si en el corto plazo \(K=25\): \(L=100/25=4\) y \(CT=16+25=41>40\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué el costo marginal corta al costo medio en su mínimo?",a:"Porque si el marginal está por debajo del medio, lo jala hacia abajo, y si está por encima, lo sube: el medio deja de bajar justo cuando se igualan."},
 {q:"Con rendimientos constantes a escala, ¿cómo es el costo medio de largo plazo?",a:"Constante: duplicar la producción duplica el costo."}]},

{id:"beneficio", parte:"Unidad 3 · Teoría del productor", t:"Maximización del beneficio y oferta de la empresa", sim:"benef", html:String.raw`
<section><h3>La idea</h3><p class="lead">Una empresa competitiva toma el precio como dado y escoge la producción que maximiza \(\pi=pq-C(q)\). La condición es producir donde el precio es igual al costo marginal, en el tramo creciente.</p>
<div class="mj">\[\frac{d\pi}{dq}=p-CMg(q)=0\qquad\Longrightarrow\qquad p=CMg(q^*),\quad CMg'(q^*)>0\]</div></section>
<section><h3>¿Producir o cerrar?</h3>
<ul><li><b>Corto plazo:</b> conviene producir si el ingreso cubre al menos el costo variable: \(p\ge\min CVMe\). Si no, cierra y pierde solo el costo fijo. Ese mínimo es el <b>punto de cierre</b>.</li>
<li><b>Largo plazo:</b> no hay costos fijos; la empresa sale si \(p<\min CMe\).</li></ul>
<p>Por eso la <b>curva de oferta de corto plazo</b> es el tramo del costo marginal por encima del mínimo del costo variable medio.</p></section>
<section><h3>Excedente del productor</h3><p>Es el ingreso menos el costo variable, \(EP=pq-CV(q)\): el área entre el precio y la curva de oferta. Es igual al beneficio más el costo fijo. La <b>elasticidad de la oferta</b> es \(\varepsilon_s=\frac{dq}{dp}\frac pq\).</p></section>
<section><h3>Con factores: demandas no condicionadas</h3><p>Maximizando directamente \(pf(L,K)-wL-rK\): \(p\,PMg_L=w\) y \(p\,PMg_K=r\) (el valor del producto marginal igual al precio del factor). De ahí salen las demandas no condicionadas \(L(p,w,r)\), \(K(p,w,r)\), la oferta \(q(p,w,r)\) y la función de beneficios \(\pi(p,w,r)\), con el lema de Hotelling: \(\partial\pi/\partial p=q\). Si hay rendimientos crecientes, no existe un máximo.</p></section>
<section><h3>Ejemplo</h3><p>Con \(CT=50+10q-2q^2+0{,}2q^3\): \(CVMe=10-2q+0{,}2q^2\) es mínimo en \(q=5\), donde vale 5 (punto de cierre). Con \(p=20\): \(20=10-4q+0{,}6q^2\Rightarrow q=8{,}60\); ingreso 172,08, costo total 115,37, beneficio 56,71.</p></section>
${LAB}`,
qs:[{q:"Si el precio está entre el mínimo del CVMe y el mínimo del CMe, ¿qué hace la empresa en el corto plazo?",a:"Produce donde p = CMg aunque tenga pérdidas, porque cubre el costo variable y parte del fijo: pierde menos que cerrando."},
 {q:"¿Qué dice el lema de Hotelling?",a:"Que la derivada de la función de beneficios respecto al precio del producto es la oferta: ∂π/∂p = q."}]},

{id:"industria", parte:"Unidad 3 · Teoría del productor", t:"La oferta de la industria", sim:"indus", html:String.raw`
<section><h3>La idea</h3><p class="lead">La oferta de la industria es la suma horizontal de las ofertas de las empresas. En el largo plazo, la entrada y la salida de empresas llevan el beneficio económico a cero.</p></section>
<section><h3>Corto plazo</h3><p>Con \(n\) empresas idénticas, \(Q^s(p)=n\,q^*(p)\) para \(p\ge\min CVMe\). Con empresas distintas, cada una entra a la suma cuando el precio supera su punto de cierre: la oferta agregada tiene saltos.</p></section>
<section><h3>Largo plazo</h3>
<ul><li>Si hay beneficios (\(p>\min CMe\)), entran empresas, la oferta crece y el precio baja.</li>
<li>Si hay pérdidas, salen empresas y el precio sube.</li>
<li>En el equilibrio de largo plazo: \(p=CMg=\min CMe\), beneficio cero, y el número de empresas es \(n=Q^d(p)/q_{\min CMe}\).</li></ul>
<p>Si todas las empresas tienen el mismo costo y los precios de los factores no cambian (industria de <b>costos constantes</b>), la oferta de largo plazo es horizontal en \(\min CMe\). Con costos crecientes tiene pendiente positiva.</p></section>
<section><h3>Ejemplo</h3><p>Con \(CT=50+10q-2q^2+0{,}2q^3\), \(\min CMe\approx12{,}91\) en \(q\approx7{,}33\). Si la demanda es \(Q=2.000-50p\), a ese precio se demandan 1.354,6 unidades: caben unas 185 empresas.</p></section>
${LAB}`,
qs:[{q:"¿Por qué el beneficio es cero en el largo plazo en competencia perfecta?",a:"Porque cualquier beneficio atrae empresas y cualquier pérdida hace salir algunas, hasta que el precio iguala el mínimo del costo medio."}]},

// ===================== UNIDAD 4 =====================
{id:"equilibrio", parte:"Unidad 4 · Equilibrio de mercado", t:"Equilibrio parcial y estática comparativa", sim:"eq", html:String.raw`
<section><h3>La idea</h3><p class="lead">El equilibrio es el precio al que la cantidad demandada es igual a la ofrecida. Con curvas lineales \(Q^d=a-bp\) y \(Q^s=c+dp\):</p>
<div class="mj">\[p^*=\frac{a-c}{b+d}\qquad Q^*=a-bp^*\]</div>
<p>Si el precio está por encima, hay exceso de oferta y el precio baja; si está por debajo, hay escasez y sube.</p></section>
<section><h3>Estática comparativa</h3>
<div class="tbl"><table><tr><th>Choque</th><th>Precio</th><th>Cantidad</th></tr>
<tr><td>Aumenta la demanda (\(a\uparrow\))</td><td>Sube</td><td>Sube</td></tr>
<tr><td>Aumenta la oferta (\(c\uparrow\))</td><td>Baja</td><td>Sube</td></tr>
<tr><td>Aumentan las dos</td><td>Ambiguo</td><td>Sube</td></tr></table></div>
<p>Qué tanto se mueven precio y cantidad depende de las elasticidades: con oferta muy inelástica, un choque de demanda mueve sobre todo el precio.</p></section>
<section><h3>El teorema de la telaraña</h3>
<p>Si los productores deciden cuánto ofrecer con el precio del período anterior (agricultura), \(Q^s_t=c+dp_{t-1}\) y el precio se ajusta para vender todo: \(p_t=(a-Q^s_t)/b\). El precio oscila alrededor del equilibrio y converge si \(d<b\) (la oferta reacciona menos que la demanda); diverge si \(d>b\).</p></section>
<section><h3>Ejemplo</h3><p>Con \(Q^d=100-2p\) y \(Q^s=10+3p\): \(p^*=90/5=18\), \(Q^*=64\). Elasticidades en el equilibrio: demanda \(-2\cdot18/64=-0{,}56\), oferta \(3\cdot18/64=0{,}84\). Como \(d=3>b=2\), la telaraña diverge.</p></section>
${LAB}`,
qs:[{q:"Con Qd = 120 − 3p y Qs = 4p − 20, ¿cuál es el equilibrio?",a:"120 − 3p = 4p − 20 ⇒ p = 20, Q = 60."}]},

{id:"bienestar", parte:"Unidad 4 · Equilibrio de mercado", t:"Bienestar, controles de precios e impuestos", sim:"bien", html:String.raw`
<section><h3>La idea</h3><p class="lead">El equilibrio competitivo maximiza el excedente total (consumidor + productor): es <b>eficiente</b>. Cualquier intervención que cambie la cantidad transada genera una <b>pérdida irrecuperable de eficiencia</b> (PIE).</p></section>
<section><h3>Excedentes</h3><p>El excedente del consumidor es el área entre la demanda y el precio que paga; el del productor, el área entre el precio que recibe y la oferta. En el equilibrio: \(EC=\tfrac12Q^*(p_{\max}-p^*)\) con demanda lineal.</p></section>
<section><h3>Controles de precios</h3>
<ul><li><b>Precio máximo</b> por debajo del equilibrio: se transa la cantidad ofrecida y aparece una <b>escasez</b> \(Q^d-Q^s\). Pasa excedente de los productores a los consumidores que alcanzan a comprar y se pierde el de las transacciones que dejan de hacerse.</li>
<li><b>Precio mínimo</b> por encima del equilibrio: se transa la cantidad demandada y sobra un <b>excedente</b> de producto.</li></ul></section>
<section><h3>Impuestos e incidencia</h3>
<p>Con un impuesto \(t\) por unidad, el precio que pagan los consumidores \(p_c\) y el que reciben los vendedores \(p_v\) se separan: \(p_c-p_v=t\). No importa a quién se le cobre legalmente: la carga económica se reparte según las elasticidades.</p>
<div class="mj">\[\frac{\text{carga de los consumidores}}{t}=\frac{\varepsilon_s}{\varepsilon_s-\varepsilon_d}=\frac{d}{b+d}\qquad\text{(curvas lineales)}\]</div>
<p>Paga más el lado <b>menos elástico</b>. La PIE es el triángulo \(\tfrac12\,t\,\Delta Q\): crece con el cuadrado del impuesto y con las elasticidades. Un subsidio funciona al revés: \(p_v-p_c=s\), cuesta \(sQ\) y también genera PIE.</p></section>
<section><h3>Ejemplo</h3><p>Con \(Q^d=100-2p\), \(Q^s=10+3p\) y un impuesto de 5: \(p_c=21\), \(p_v=16\), \(Q=58\). Los consumidores cargan 3 (60 %) y los productores 2 (40 %), porque la demanda es menos elástica. Recaudo 290; PIE \(=\tfrac12\cdot5\cdot6=15\). Un precio máximo de 12 deja \(Q=46\), escasez de 30 y PIE de 135.</p></section>
${LAB}`,
qs:[{q:"Si la oferta es perfectamente inelástica, ¿quién paga un impuesto?",a:"Todo lo pagan los productores: el precio al consumidor no cambia y no hay pérdida irrecuperable."},
 {q:"¿Por qué un precio máximo puede perjudicar incluso a los consumidores?",a:"Porque reduce la cantidad transada: los consumidores que se quedan sin comprar pierden todo su excedente, y esa pérdida puede superar lo que ganan los que sí compran más barato."}]}
];

const BRANCHES=[
{g:"Aplicaciones del consumidor", from:"eleccion", items:[
 {id:"revelado", t:"Preferencias reveladas", nuevo:true, sim:"rev", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si con los precios \(p^i\) el consumidor escogió \(x^i\) pudiendo comprar \(x^j\) (porque \(p^i\cdot x^i\ge p^i\cdot x^j\)), entonces \(x^i\) está <b>revelada directamente preferida</b> a \(x^j\).</p>
<ul><li><b>Axioma débil (ADPR):</b> si \(x^i\) está revelada preferida a \(x^j\) y son distintas, \(x^j\) no puede estar revelada preferida a \(x^i\).</li>
<li><b>Axioma fuerte (AFPR):</b> lo mismo, pero con la preferencia revelada indirecta (cadenas \(x^i\to x^k\to x^j\)).</li></ul>
<p>Si los datos cumplen el axioma fuerte, existe una función de utilidad que los explica. Así se prueba la teoría con datos de precios y cantidades, sin conocer la utilidad.</p></section>
${LAB}`,
 qs:[{q:"Con precios (1, 2) compró (4, 3) y con (2, 1) compró (3, 4). ¿Se viola el ADPR?",a:"No: con (1, 2), (4, 3) cuesta 10 y (3, 4) cuesta 11, así que (3, 4) no era alcanzable; con (2, 1), (3, 4) cuesta 10 y (4, 3) cuesta 11. Ninguna se revela preferida a la otra."}]}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"bienestar",links:["eleccion","slutsky","excedentes","demanda","costos","beneficio","bienestar"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del parcial."}
];
const ALIAS={};
