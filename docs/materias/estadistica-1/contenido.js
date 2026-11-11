// Estadística I · contenido de la ruta (programa 1504108)
// =====================================================================
// CONTENIDO: Estadística I (1504108, U. de Antioquia): descriptiva, probabilidad y distribuciones.
// Bibliografía del curso: Wackerly, Mendenhall y Scheaffer; Canavos; Devore; Wasserman. Aplicaciones en R.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"descriptiva", parte:"Unidad 1 · Estadística descriptiva", t:"Datos, medidas de localización, variabilidad y asimetría", sim:"desc", html:String.raw`
<section><h3>La idea</h3><p class="lead">La estadística descriptiva resume un conjunto de datos con unos pocos números y gráficos: dónde está el centro, qué tan dispersos están los datos y qué forma tiene su distribución.</p></section>
<section><h3>Tipos de datos</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Escala</th><th>Ejemplo</th></tr>
<tr><td>Cualitativo nominal</td><td>Categorías sin orden</td><td>Sexo, ciudad, sector económico</td></tr>
<tr><td>Cualitativo ordinal</td><td>Categorías con orden</td><td>Estrato, nivel educativo</td></tr>
<tr><td>Cuantitativo discreto</td><td>Conteos</td><td>Número de hijos, empleados</td></tr>
<tr><td>Cuantitativo continuo</td><td>Mediciones (intervalo o razón)</td><td>Ingreso, estatura, tiempo</td></tr></table></div>
<p>Población: todos los elementos de interés (sus medidas se llaman <b>parámetros</b>: \(\mu,\sigma^2\)). Muestra: una parte de ella (sus medidas son <b>estadísticos</b>: \(\bar x,s^2\)).</p></section>
<section><h3>Medidas de localización</h3>
<div class="mj">\[\bar x=\frac1n\sum_{i=1}^nx_i\qquad\text{mediana: el valor central de los datos ordenados}\qquad\text{moda: el más frecuente}\]</div>
<p>Los <b>percentiles</b> y <b>cuartiles</b> dividen los datos ordenados: \(Q_1\) deja el 25 % por debajo y \(Q_3\) el 75 %. Hay varias formas de calcularlos; R usa por defecto (tipo 7) la posición \(h=(n-1)p+1\) con interpolación lineal. La <b>media recortada</b> al 10 % quita el 10 % más bajo y el 10 % más alto antes de promediar: es resistente a valores atípicos, como la mediana.</p></section>
<section><h3>Medidas de variabilidad</h3>
<div class="mj">\[s^2=\frac{1}{n-1}\sum_{i=1}^n(x_i-\bar x)^2\qquad s=\sqrt{s^2}\qquad CV=\frac{s}{\bar x}\qquad RIC=Q_3-Q_1\]</div>
<p>Se divide por \(n-1\) (y no por \(n\)) para que \(s^2\) sea un estimador insesgado de \(\sigma^2\) (se ve en Estadística II). El coeficiente de variación compara la dispersión de variables con unidades o medias distintas. Regla de valores atípicos del diagrama de caja: los que caen fuera de \([Q_1-1{,}5\,RIC,\;Q_3+1{,}5\,RIC]\).</p></section>
<section><h3>Asimetría y curtosis</h3>
<div class="mj">\[g_1=\frac{m_3}{m_2^{3/2}}\qquad g_2=\frac{m_4}{m_2^2}-3\qquad m_k=\frac1n\sum(x_i-\bar x)^k\qquad\text{Pearson: }\frac{3(\bar x-\text{mediana})}{s}\]</div>
<p>Asimetría positiva (cola a la derecha): la media supera a la mediana, como en el ingreso. Negativa: al revés. La curtosis \(g_2\) compara las colas con las de la normal (0 en la normal).</p></section>
<section><h3>Métodos gráficos y tabulares</h3>
<p><b>Tabla de frecuencias:</b> con la regla de Sturges, \(k=1+3{,}322\log_{10}n\) clases de amplitud \(w=\text{rango}/k\); se reportan frecuencia absoluta \(f_i\), relativa \(f_i/n\) y acumuladas. <b>Histograma</b> (variables continuas), <b>diagrama de barras</b> y <b>de sectores</b> (cualitativas), <b>diagrama de caja</b> (cuartiles y atípicos), <b>tallo y hojas</b>.</p>
<p>Con <b>datos agrupados</b> se usa la marca de clase \(m_i\): \(\bar x=\frac{\sum f_im_i}{n}\), mediana \(=L+\frac{n/2-F_{i-1}}{f_i}\,w\), moda \(=L+\frac{d_1}{d_1+d_2}\,w\).</p></section>
${LAB}`,
qs:[{q:"Datos: 2, 4, 4, 5, 10. ¿Media, mediana y moda?",a:"Media 5, mediana 4, moda 4. La media es mayor porque el 10 la jala hacia arriba (asimetría positiva)."},
 {q:"¿Por qué la varianza muestral divide por n − 1?",a:"Para que sea un estimador insesgado de la varianza poblacional: con n tendería a subestimarla, porque las desviaciones se miden respecto a la media muestral."}]},

// ===================== UNIDAD 2 =====================
{id:"conteo", parte:"Unidad 2 · Probabilidad", t:"Técnicas de conteo", sim:"cont", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con resultados igualmente probables, \(P(A)=\frac{\#A}{\#S}\). Para contar sin enumerar se usan estas reglas.</p></section>
<section><h3>Reglas</h3>
<div class="tbl"><table><tr><th>Situación</th><th>¿Importa el orden?</th><th>¿Hay repetición?</th><th>Fórmula</th></tr>
<tr><td>Principio multiplicativo: \(k\) etapas con \(n_1,\dots,n_k\) opciones</td><td></td><td></td><td>\(n_1n_2\cdots n_k\)</td></tr>
<tr><td>Permutaciones de \(n\) en \(r\)</td><td>Sí</td><td>No</td><td>\(P^n_r=\frac{n!}{(n-r)!}\)</td></tr>
<tr><td>Variaciones con repetición</td><td>Sí</td><td>Sí</td><td>\(n^r\)</td></tr>
<tr><td>Combinaciones</td><td>No</td><td>No</td><td>\(\binom nr=\frac{n!}{r!(n-r)!}\)</td></tr>
<tr><td>Combinaciones con repetición</td><td>No</td><td>Sí</td><td>\(\binom{n+r-1}{r}\)</td></tr>
<tr><td>Permutaciones con objetos repetidos</td><td>Sí</td><td>Grupos iguales</td><td>\(\frac{n!}{n_1!n_2!\cdots n_k!}\)</td></tr>
<tr><td>Permutaciones circulares</td><td>Sí</td><td>No</td><td>\((n-1)!\)</td></tr></table></div></section>
<section><h3>Ejemplos</h3><ul><li>Placas con 3 letras (26) y 3 dígitos: \(26^3\cdot10^3=17.576.000\).</li><li>Comités de 3 entre 10 personas: \(\binom{10}3=120\). Presidente, secretario y tesorero: \(P^{10}_3=720\).</li><li>Anagramas de ECONOMIA (8 letras, la O dos veces): \(8!/2!=20.160\).</li><li>Probabilidad de que en un comité de 3 entre 6 mujeres y 4 hombres haya exactamente 2 mujeres: \(\binom62\binom41/\binom{10}3=60/120=0{,}5\).</li></ul></section>
${LAB}`,
qs:[{q:"¿De cuántas formas se pueden ordenar 5 libros en un estante?",a:"5! = 120."},{q:"¿Cuántas manos de 5 cartas hay en una baraja de 52?",a:"C(52, 5) = 2.598.960."}]},

{id:"probabilidad", parte:"Unidad 2 · Probabilidad", t:"Probabilidad, condicional, independencia y Bayes", sim:"prob", html:String.raw`
<section><h3>Espacio muestral, eventos y axiomas</h3><p>El espacio muestral \(S\) reúne todos los resultados posibles de un experimento; un evento es un subconjunto. Axiomas de Kolmogorov: \(P(A)\ge0\), \(P(S)=1\) y, si los eventos son mutuamente excluyentes, \(P(A_1\cup A_2\cup\dots)=\sum P(A_i)\). De ahí: \(P(A^c)=1-P(A)\), \(P(\varnothing)=0\).</p></section>
<section><h3>Reglas aditivas</h3>
<div class="mj">\[P(A\cup B)=P(A)+P(B)-P(A\cap B)\]</div><p>Si \(A\) y \(B\) son mutuamente excluyentes, \(P(A\cap B)=0\). Con tres eventos se suman los tres, se restan las tres intersecciones dobles y se suma la triple.</p></section>
<section><h3>Probabilidad condicional, independencia y regla del producto</h3>
<div class="mj">\[P(A\mid B)=\frac{P(A\cap B)}{P(B)}\qquad P(A\cap B)=P(B)\,P(A\mid B)\qquad A,B\text{ independientes}\iff P(A\cap B)=P(A)P(B)\]</div>
<p>Independientes no es lo mismo que excluyentes: dos eventos excluyentes con probabilidad positiva son <b>dependientes</b> (si pasa uno, el otro no puede pasar).</p></section>
<section><h3>Probabilidad total y regla de Bayes</h3>
<p>Si \(B_1,\dots,B_k\) forman una partición de \(S\):</p>
<div class="mj">\[P(A)=\sum_iP(B_i)P(A\mid B_i)\qquad\qquad P(B_r\mid A)=\frac{P(B_r)P(A\mid B_r)}{\sum_iP(B_i)P(A\mid B_i)}\]</div>
<p>Bayes "invierte" la condición: de la probabilidad del síntoma dado el estado, a la del estado dado el síntoma.</p></section>
<section><h3>Ejemplo</h3><p>Tres máquinas producen 50 %, 30 % y 20 % de las piezas, con 2 %, 3 % y 5 % de defectuosas. \(P(D)=0{,}5\cdot0{,}02+0{,}3\cdot0{,}03+0{,}2\cdot0{,}05=0{,}029\). Si una pieza es defectuosa, la probabilidad de que venga de la máquina 3 es \(0{,}010/0{,}029=0{,}345\).</p></section>
${LAB}`,
qs:[{q:"P(A) = 0,4, P(B) = 0,5 y P(A ∩ B) = 0,2. ¿Son independientes?",a:"Sí: P(A)P(B) = 0,2 = P(A ∩ B)."},
 {q:"Una prueba detecta una enfermedad (prevalencia 1 %) con sensibilidad 95 % y falsos positivos del 5 %. Si da positivo, ¿qué tan probable es estar enfermo?",a:"0,01·0,95/(0,01·0,95 + 0,99·0,05) = 0,0095/0,059 = 16,1 %."}]},

// ===================== UNIDAD 3 =====================
{id:"variables", parte:"Unidad 3 · Variables aleatorias", t:"Variables aleatorias discretas y continuas", sim:"va", html:String.raw`
<section><h3>La idea</h3><p class="lead">Una variable aleatoria \(X\) asigna un número a cada resultado del experimento. Es <b>discreta</b> si toma valores contables, y <b>continua</b> si toma valores en un intervalo.</p></section>
<section><h3>Discretas</h3><p>Función de probabilidad \(p(x)=P(X=x)\), con \(p(x)\ge0\) y \(\sum_xp(x)=1\). Función de distribución acumulada \(F(x)=P(X\le x)=\sum_{t\le x}p(t)\): escalonada, no decreciente, de 0 a 1.</p></section>
<section><h3>Continuas</h3>
<p>Función de densidad \(f(x)\ge0\) con \(\int_{-\infty}^{\infty}f(x)\,dx=1\). Las probabilidades son áreas:</p>
<div class="mj">\[P(a&lt;X&lt;b)=\int_a^bf(x)\,dx=F(b)-F(a)\qquad F(x)=\int_{-\infty}^xf(t)\,dt\qquad f(x)=F'(x)\]</div>
<p>Para una continua, \(P(X=a)=0\), así que da igual escribir \(<\) o \(\le\). La densidad no es una probabilidad: puede ser mayor que 1.</p></section>
<section><h3>Ejemplo</h3><p>\(f(x)=kx^2\) en \([0,3]\): \(\int_0^3kx^2dx=9k=1\Rightarrow k=1/9\). \(F(x)=x^3/27\). \(P(1&lt;X<2)=(8-1)/27=0{,}259\). \(E(X)=\int_0^3x\cdot\frac{x^2}9dx=\frac{81}{36}=2{,}25\).</p></section>
${LAB}`,
qs:[{q:"Si F(x) = 1 − e^(−2x) para x ≥ 0, ¿cuál es la densidad?",a:"f(x) = F′(x) = 2e^(−2x) para x ≥ 0: una exponencial con λ = 2."}]},

{id:"conjunta", parte:"Unidad 3 · Variables aleatorias", t:"Distribuciones conjuntas, marginales y condicionales", sim:"conj", html:String.raw`
<section><h3>Distribución conjunta</h3><p>Con dos variables discretas, \(p(x,y)=P(X=x,Y=y)\), con suma total 1. Con continuas, una densidad \(f(x,y)\) cuya integral doble es 1.</p></section>
<section><h3>Marginales y condicionales</h3>
<div class="mj">\[p_X(x)=\sum_yp(x,y)\qquad p_Y(y)=\sum_xp(x,y)\qquad p(y\mid x)=\frac{p(x,y)}{p_X(x)}\]</div>
<p>(Con continuas, se integra en vez de sumar.) Las marginales son los totales de las filas y columnas de la tabla.</p></section>
<section><h3>Independencia, covarianza y correlación</h3>
<div class="mj">\[X,Y\text{ independientes}\iff p(x,y)=p_X(x)\,p_Y(y)\ \text{para todo }(x,y)\]</div>
<div class="mj">\[\text{Cov}(X,Y)=E(XY)-E(X)E(Y)\qquad\rho=\frac{\text{Cov}(X,Y)}{\sigma_X\sigma_Y}\in[-1,1]\]</div>
<p>Independencia implica covarianza cero, pero no al revés: \(\rho=0\) solo descarta relación <i>lineal</i>.</p></section>
${LAB}`,
qs:[{q:"Si Cov(X, Y) = 0, ¿X y Y son independientes?",a:"No necesariamente: covarianza cero solo descarta una relación lineal. Por ejemplo, X uniforme en {−1, 0, 1} y Y = X² tienen covarianza 0 y son dependientes."}]},

// ===================== UNIDAD 4 =====================
{id:"esperanza", parte:"Unidad 4 · Esperanza matemática", t:"Media, varianza, combinaciones lineales y Chebyshev", sim:"esp", html:String.raw`
<section><h3>Media y varianza</h3>
<div class="mj">\[E(X)=\sum_xx\,p(x)\ \text{ o }\int x\,f(x)\,dx\qquad E[g(X)]=\sum_xg(x)p(x)\qquad V(X)=E[(X-\mu)^2]=E(X^2)-\mu^2\]</div></section>
<section><h3>Propiedades</h3>
<div class="mj">\[E(aX+bY+c)=aE(X)+bE(Y)+c\]</div>
<div class="mj">\[V(aX+bY+c)=a^2V(X)+b^2V(Y)+2ab\,\text{Cov}(X,Y)\]</div>
<p>La constante \(c\) no cambia la varianza. Si son independientes, la covarianza es cero y las varianzas se suman (también cuando se restan: \(V(X-Y)=V(X)+V(Y)\)). Para \(n\) variables: \(V(\sum a_iX_i)=\sum a_i^2V(X_i)+2\sum_{i&lt;j}a_ia_j\text{Cov}(X_i,X_j)\). Aplicación: la varianza de un portafolio.</p></section>
<section><h3>Teorema de Chebyshev</h3>
<div class="mj">\[P(|X-\mu|&lt;k\sigma)\ge1-\frac1{k^2}\]</div>
<p>Vale para <b>cualquier</b> distribución con varianza finita: al menos 75 % de la probabilidad está a menos de 2 desviaciones de la media, y al menos 88,9 % a menos de 3. Es una cota conservadora: en la normal esas probabilidades son 95,4 % y 99,7 %.</p></section>
${LAB}`,
qs:[{q:"X y Y independientes con V(X) = 4 y V(Y) = 9. ¿V(2X − Y)?",a:"4·4 + 9 = 25."},{q:"Según Chebyshev, ¿qué fracción mínima está a menos de 4 desviaciones de la media?",a:"1 − 1/16 = 93,75 %."}]},

// ===================== UNIDAD 5 =====================
{id:"discretas", parte:"Unidad 5 · Distribuciones discretas", t:"Uniforme, Bernoulli, binomial, hipergeométrica, geométrica, binomial negativa y Poisson", sim:"disc", html:String.raw`
<section><h3>Resumen</h3>
<div class="tbl"><table><tr><th>Distribución</th><th>Cuenta…</th><th>\(p(x)\)</th><th>Media</th><th>Varianza</th><th>R</th></tr>
<tr><td>Uniforme discreta \(\{a,\dots,b\}\)</td><td>Un valor al azar</td><td>\(\frac1{b-a+1}\)</td><td>\(\frac{a+b}2\)</td><td>\(\frac{(b-a+1)^2-1}{12}\)</td><td></td></tr>
<tr><td>Bernoulli(\(p\))</td><td>Éxito (1) o fracaso (0)</td><td>\(p^x(1-p)^{1-x}\)</td><td>\(p\)</td><td>\(p(1-p)\)</td><td></td></tr>
<tr><td>Binomial(\(n,p\))</td><td>Éxitos en \(n\) ensayos independientes</td><td>\(\binom nxp^x(1-p)^{n-x}\)</td><td>\(np\)</td><td>\(np(1-p)\)</td><td><code>dbinom</code></td></tr>
<tr><td>Hipergeométrica(\(N,K,n\))</td><td>Éxitos en \(n\) extracciones <b>sin reemplazo</b> de \(N\) con \(K\) éxitos</td><td>\(\frac{\binom Kx\binom{N-K}{n-x}}{\binom Nn}\)</td><td>\(n\frac KN\)</td><td>\(n\frac KN\left(1-\frac KN\right)\frac{N-n}{N-1}\)</td><td><code>dhyper</code></td></tr>
<tr><td>Geométrica(\(p\))</td><td>Ensayo del primer éxito</td><td>\((1-p)^{x-1}p\)</td><td>\(\frac1p\)</td><td>\(\frac{1-p}{p^2}\)</td><td><code>dgeom(x−1)</code></td></tr>
<tr><td>Binomial negativa(\(r,p\))</td><td>Ensayo del \(r\)-ésimo éxito</td><td>\(\binom{x-1}{r-1}p^r(1-p)^{x-r}\)</td><td>\(\frac rp\)</td><td>\(\frac{r(1-p)}{p^2}\)</td><td><code>dnbinom(x−r)</code></td></tr>
<tr><td>Poisson(\(\lambda\))</td><td>Eventos en un intervalo con tasa \(\lambda\)</td><td>\(\frac{e^{-\lambda}\lambda^x}{x!}\)</td><td>\(\lambda\)</td><td>\(\lambda\)</td><td><code>dpois</code></td></tr></table></div>
<p class="hint">En R, <code>dgeom</code> y <code>dnbinom</code> cuentan los <i>fracasos</i> antes del éxito, por eso se les pasa x − 1 y x − r. La geométrica no tiene memoria: \(P(X>s+t\mid X>s)=P(X>t)\).</p></section>
<section><h3>Relaciones</h3><ul><li>Si \(N\) es grande frente a \(n\) (\(n/N<0{,}05\)), la hipergeométrica se aproxima con la binomial con \(p=K/N\).</li><li>Si \(n\) es grande y \(p\) pequeño (\(np\) moderado), la binomial se aproxima con la Poisson de \(\lambda=np\).</li><li>La geométrica es la binomial negativa con \(r=1\).</li></ul></section>
<section><h3>Ejemplo</h3><p>10 % de los créditos entra en mora; se revisan 10. \(P(X=2)=\binom{10}2(0{,}1)^2(0{,}9)^8=0{,}1937\); \(P(X\le1)=0{,}7361\). Si llegan en promedio 3 clientes por minuto: \(P(X=0)=e^{-3}=0{,}0498\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué en la hipergeométrica la varianza tiene el factor (N − n)/(N − 1)?",a:"Es la corrección por población finita: al extraer sin reemplazo, cada extracción da información sobre las demás y la variabilidad es menor que en la binomial."}]},

// ===================== UNIDAD 6 =====================
{id:"continuas", parte:"Unidad 6 · Distribuciones continuas", t:"Uniforme, normal, gamma y exponencial", sim:"cont2", html:String.raw`
<section><h3>Resumen</h3>
<div class="tbl"><table><tr><th>Distribución</th><th>\(f(x)\)</th><th>Media</th><th>Varianza</th><th>R</th></tr>
<tr><td>Uniforme(\(a,b\))</td><td>\(\frac1{b-a}\) en \([a,b]\)</td><td>\(\frac{a+b}2\)</td><td>\(\frac{(b-a)^2}{12}\)</td><td><code>punif</code></td></tr>
<tr><td>Normal(\(\mu,\sigma\))</td><td>\(\frac1{\sigma\sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}\)</td><td>\(\mu\)</td><td>\(\sigma^2\)</td><td><code>pnorm</code></td></tr>
<tr><td>Exponencial(\(\lambda\))</td><td>\(\lambda e^{-\lambda x}\), \(x\ge0\)</td><td>\(\frac1\lambda\)</td><td>\(\frac1{\lambda^2}\)</td><td><code>pexp</code></td></tr>
<tr><td>Gamma(\(\alpha,\beta\))</td><td>\(\frac{x^{\alpha-1}e^{-x/\beta}}{\Gamma(\alpha)\beta^\alpha}\), \(x>0\)</td><td>\(\alpha\beta\)</td><td>\(\alpha\beta^2\)</td><td><code>pgamma(shape, scale)</code></td></tr></table></div></section>
<section><h3>La normal</h3>
<p>Simétrica y con forma de campana. Toda normal se lleva a la normal estándar con \(Z=\frac{X-\mu}\sigma\sim N(0,1)\), y las probabilidades se leen en la tabla de \(\Phi(z)=P(Z\le z)\). Regla empírica: 68 %, 95 % y 99,7 % a 1, 2 y 3 desviaciones. Para el valor que deja una probabilidad \(p\) por debajo: \(x=\mu+z_p\sigma\).</p></section>
<section><h3>Gamma y exponencial</h3><p>La exponencial modela tiempos de espera entre eventos de un proceso de Poisson y <b>no tiene memoria</b>: \(P(X>s+t\mid X>s)=P(X>t)\). La gamma con \(\alpha\) entero es el tiempo hasta el \(\alpha\)-ésimo evento (suma de \(\alpha\) exponenciales). Casos especiales: \(\alpha=1\) es la exponencial con \(\lambda=1/\beta\); \(\alpha=\nu/2\), \(\beta=2\) es la ji-cuadrado con \(\nu\) grados de libertad.</p></section>
<section><h3>Ejemplo</h3><p>El ingreso mensual de un grupo es normal con \(\mu=2{,}5\) y \(\sigma=0{,}8\) millones. \(P(X>3{,}5)=1-\Phi(1{,}25)=0{,}1056\). El 10 % más alto gana más de \(2{,}5+1{,}2816\cdot0{,}8=3{,}525\) millones.</p></section>
${LAB}`,
qs:[{q:"Los tiempos entre llamadas son exponenciales con media 4 minutos. ¿Probabilidad de esperar más de 6?",a:"λ = 1/4: P(X > 6) = e^(−6/4) = 0,2231."}]},

{id:"aproximaciones", parte:"Unidad 6 · Distribuciones continuas", t:"Aproximación normal a la binomial y a la Poisson", sim:"aprox", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando \(n\) es grande, la binomial se parece a una normal con la misma media y varianza (es una consecuencia del teorema central del límite). Lo mismo la Poisson cuando \(\lambda\) es grande.</p>
<div class="mj">\[X\sim\text{Bin}(n,p)\approx N\big(np,\ \sqrt{np(1-p)}\big)\quad\text{si }np\ge5\text{ y }n(1-p)\ge5\qquad X\sim\text{Poisson}(\lambda)\approx N(\lambda,\sqrt\lambda)\]</div></section>
<section><h3>Corrección por continuidad</h3><p>Como la binomial es discreta, cada valor \(k\) se representa con el intervalo \([k-0{,}5,\ k+0{,}5]\):</p>
<div class="mj">\[P(a\le X\le b)\approx\Phi\!\left(\frac{b+0{,}5-np}{\sqrt{np(1-p)}}\right)-\Phi\!\left(\frac{a-0{,}5-np}{\sqrt{np(1-p)}}\right)\]</div>
<p>Atención con las desigualdades estrictas: \(P(X<10)=P(X\le9)\), así que se usa 9,5.</p></section>
<section><h3>Ejemplo</h3><p>100 lanzamientos de una moneda: \(P(45\le X\le55)\). Exacta: 0,7287. Normal con corrección: \(\Phi(1{,}1)-\Phi(-1{,}1)=0{,}7287\). Sin corrección: \(\Phi(1)-\Phi(-1)=0{,}6827\): la corrección importa.</p></section>
${LAB}`,
qs:[{q:"Con n = 50 y p = 0,05, ¿conviene aproximar la binomial con la normal?",a:"No: np = 2,5 < 5. Es mejor la aproximación de Poisson con λ = 2,5."}]},

// ===================== UNIDAD 7 =====================
{id:"transformaciones", parte:"Unidad 7 · Funciones de variables aleatorias", t:"Transformación de variables aleatorias", sim:"transf", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si \(Y=g(X)\) y se conoce la distribución de \(X\), ¿cuál es la de \(Y\)? Hay dos métodos principales.</p></section>
<section><h3>Método de la función de distribución</h3><p>Se calcula \(F_Y(y)=P(Y\le y)=P(g(X)\le y)\) en términos de \(F_X\) y se deriva. Ejemplo: \(Y=X^2\) con \(X\sim U(0,1)\): \(F_Y(y)=P(X\le\sqrt y)=\sqrt y\), así que \(f_Y(y)=\frac1{2\sqrt y}\) en \((0,1)\).</p></section>
<section><h3>Método de la transformación (cambio de variable)</h3>
<p>Si \(g\) es estrictamente monótona con inversa \(x=g^{-1}(y)\):</p>
<div class="mj">\[f_Y(y)=f_X\big(g^{-1}(y)\big)\left|\frac{dg^{-1}(y)}{dy}\right|\]</div>
<ul><li>\(Y=aX+b\): \(f_Y(y)=\frac1{|a|}f_X\!\left(\frac{y-b}a\right)\). Una normal transformada linealmente sigue siendo normal.</li>
<li>\(Y=-\frac1\lambda\ln X\) con \(X\sim U(0,1)\): \(Y\sim\text{Exp}(\lambda)\). Es el método de la transformada inversa para simular.</li>
<li>\(Y=e^X\) con \(X\sim N(\mu,\sigma)\): \(Y\) es lognormal, \(f_Y(y)=\frac1{y\sigma\sqrt{2\pi}}e^{-(\ln y-\mu)^2/(2\sigma^2)}\).</li></ul></section>
<section><h3>Sumas de variables independientes</h3><p>La distribución de \(X+Y\) se obtiene por convolución, o más fácil con funciones generadoras de momentos (siguiente estación): la suma de normales independientes es normal, la de Poisson es Poisson, la de exponenciales iguales es gamma.</p></section>
${LAB}`,
qs:[{q:"Si X ~ N(10, 2), ¿cómo se distribuye Y = 3X − 5?",a:"Normal con media 3·10 − 5 = 25 y desviación 3·2 = 6."}]},

{id:"fgm", parte:"Unidad 7 · Funciones de variables aleatorias", t:"Momentos y funciones generadoras de momentos", sim:"fgm", html:String.raw`
<section><h3>Momentos</h3><p>El momento de orden \(k\) respecto al origen es \(\mu_k'=E(X^k)\); respecto a la media, \(\mu_k=E[(X-\mu)^k]\). La media es \(\mu_1'\), la varianza \(\mu_2=\mu_2'-(\mu_1')^2\); el tercero y el cuarto central dan la asimetría y la curtosis.</p></section>
<section><h3>Función generadora de momentos</h3>
<div class="mj">\[M_X(t)=E\big(e^{tX}\big)\qquad\Longrightarrow\qquad M_X^{(k)}(0)=E(X^k)\]</div>
<p>Derivando \(k\) veces y evaluando en \(t=0\) se obtiene el momento \(k\). Propiedades clave:</p>
<ul><li><b>Unicidad:</b> si dos variables tienen la misma FGM, tienen la misma distribución.</li><li>\(M_{aX+b}(t)=e^{bt}M_X(at)\).</li><li>Si \(X\) y \(Y\) son independientes, \(M_{X+Y}(t)=M_X(t)M_Y(t)\).</li></ul></section>
<section><h3>FGM de las distribuciones del curso</h3>
<div class="tbl"><table><tr><th>Distribución</th><th>\(M(t)\)</th></tr><tr><td>Binomial(\(n,p\))</td><td>\((1-p+pe^t)^n\)</td></tr><tr><td>Poisson(\(\lambda\))</td><td>\(e^{\lambda(e^t-1)}\)</td></tr><tr><td>Geométrica(\(p\))</td><td>\(\frac{pe^t}{1-(1-p)e^t}\)</td></tr><tr><td>Uniforme(\(a,b\))</td><td>\(\frac{e^{tb}-e^{ta}}{t(b-a)}\)</td></tr><tr><td>Normal(\(\mu,\sigma\))</td><td>\(e^{\mu t+\sigma^2t^2/2}\)</td></tr><tr><td>Exponencial(\(\lambda\))</td><td>\(\frac\lambda{\lambda-t}\), \(t<\lambda\)</td></tr><tr><td>Gamma(\(\alpha,\beta\))</td><td>\((1-\beta t)^{-\alpha}\), \(t<1/\beta\)</td></tr></table></div></section>
<section><h3>Ejemplo</h3><p>Poisson: \(M'(t)=\lambda e^te^{\lambda(e^t-1)}\Rightarrow E(X)=\lambda\). \(M''(0)=\lambda+\lambda^2\Rightarrow V(X)=\lambda\). Si \(X\sim\)Poisson(2) y \(Y\sim\)Poisson(3) son independientes, \(M_{X+Y}=e^{5(e^t-1)}\): \(X+Y\sim\)Poisson(5).</p></section>
${LAB}`,
qs:[{q:"Si M(t) = (0,3 + 0,7e^t)^8, ¿cuál es la distribución?",a:"Binomial con n = 8 y p = 0,7, por la unicidad de la FGM."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"fgm",links:["descriptiva","conteo","probabilidad","esperanza","discretas","continuas"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del parcial."}
];
const ALIAS={};
