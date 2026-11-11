// =====================================================================
// CONTENIDO: Estadística II (1504109, U. de Antioquia): distribuciones de muestreo, convergencia,
// estimación puntual e intervalos, pruebas de hipótesis y regresión lineal múltiple. Aplicaciones en R.
// Campos: id, parte, t, html, qs [{q,a}], deep [{k,t,html}], py (código Python equivalente), sim (laboratorio)
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"muestreo", parte:"Unidad 1 · Distribuciones de muestreo", t:"Muestras aleatorias y distribuciones muestrales", sim:"dmuestral", html:String.raw`
<section><h3>La idea</h3><p class="lead">Una <b>muestra aleatoria</b> es un conjunto de variables \(X_1,\dots,X_n\) independientes y con la misma distribución que la población. Un <b>estadístico</b> es cualquier función de la muestra que no depende de parámetros desconocidos (\(\bar X\), \(S^2\), el máximo). Como la muestra es aleatoria, el estadístico también lo es: su distribución se llama <b>distribución muestral</b>.</p></section>
<section><h3>Propiedades de la media y la varianza muestrales</h3>
<div class="mj">\[E(\bar X)=\mu\qquad V(\bar X)=\frac{\sigma^2}{n}\qquad E(S^2)=\sigma^2,\quad S^2=\frac{1}{n-1}\sum_{i=1}^n(X_i-\bar X)^2\]</div>
<p>Estas tres igualdades valen para cualquier población con varianza finita. Si además la población es normal, \(\bar X\) y \(S^2\) son <b>independientes</b> y sus distribuciones se conocen exactamente.</p></section>
<section><h3>Distribuciones relacionadas con la normal</h3>
<div class="tbl"><table><tr><th>Distribución</th><th>Cómo se construye</th><th>Media y varianza</th><th>Uso en el curso</th></tr>
<tr><td>\(\chi^2_k\)</td><td>\(Z_1^2+\dots+Z_k^2\), con \(Z_i\sim N(0,1)\) independientes</td><td>\(k\); \(2k\)</td><td>\(\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}\): intervalos y pruebas para \(\sigma^2\), tablas de contingencia</td></tr>
<tr><td>\(t_k\)</td><td>\(\dfrac{Z}{\sqrt{\chi^2_k/k}}\), independientes</td><td>\(0\) (si \(k>1\)); \(\frac{k}{k-2}\) (si \(k>2\))</td><td>\(\frac{\bar X-\mu}{S/\sqrt n}\sim t_{n-1}\): medias con \(\sigma\) desconocida, coeficientes de regresión</td></tr>
<tr><td>\(F_{a,b}\)</td><td>\(\dfrac{\chi^2_a/a}{\chi^2_b/b}\), independientes</td><td>\(\frac{b}{b-2}\) (si \(b>2\))</td><td>\(\frac{S_1^2/\sigma_1^2}{S_2^2/\sigma_2^2}\sim F_{n_1-1,n_2-1}\): cociente de varianzas, ANOVA, prueba F de la regresión</td></tr></table></div>
<p>Relaciones útiles: \(t_k^2=F_{1,k}\); cuando \(k\to\infty\), \(t_k\to N(0,1)\); y \(\chi^2_k/k\to 1\). Por eso con muestras grandes las tablas t y normal casi coinciden.</p></section>
<section><h3>Demostración: por qué \((n-1)S^2/\sigma^2\) tiene \(n-1\) grados de libertad</h3>
<p>Se parte de la identidad \(\sum (X_i-\mu)^2=\sum(X_i-\bar X)^2+n(\bar X-\mu)^2\). Dividiendo por \(\sigma^2\):</p>
<div class="mj">\[\underbrace{\sum_{i=1}^n\left(\frac{X_i-\mu}{\sigma}\right)^2}_{\chi^2_n}=\frac{(n-1)S^2}{\sigma^2}+\underbrace{\left(\frac{\bar X-\mu}{\sigma/\sqrt n}\right)^2}_{\chi^2_1}\]</div>
<p>Como los dos sumandos de la derecha son independientes, sus funciones generadoras se multiplican: \((1-2t)^{-n/2}=M(t)\,(1-2t)^{-1/2}\), de donde \(M(t)=(1-2t)^{-(n-1)/2}\), que es la FGM de una \(\chi^2_{n-1}\). Se «pierde» un grado de libertad por estimar \(\mu\) con \(\bar X\).</p></section>
${LAB}`,
qs:[{q:"Si X ~ N(20, 4) y n = 16, ¿cuál es la distribución de x̄ y cuánto vale P(x̄ > 22)?",a:"x̄ ~ N(20, 4/√16 = 1). P(x̄ > 22) = P(Z > 2) = 0,0228."},{q:"¿Qué distribución tiene T² si T ~ t con 12 gl?",a:"F con (1, 12) grados de libertad."}]},

{id:"orden", parte:"Unidad 1 · Distribuciones de muestreo", t:"Estadísticas de orden", sim:"orden", html:String.raw`
<section><h3>La idea</h3><p class="lead">Al ordenar la muestra de menor a mayor se obtienen las <b>estadísticas de orden</b> \(X_{(1)}\le X_{(2)}\le\dots\le X_{(n)}\). El mínimo \(X_{(1)}\), el máximo \(X_{(n)}\), la mediana y el rango \(X_{(n)}-X_{(1)}\) son estadísticas de orden o funciones de ellas.</p></section>
<section><h3>Distribución del máximo y del mínimo</h3>
<p>El máximo es menor que \(x\) solo si <i>todas</i> las observaciones lo son; el mínimo es mayor que \(x\) solo si todas lo son:</p>
<div class="mj">\[F_{(n)}(x)=[F(x)]^n\qquad F_{(1)}(x)=1-[1-F(x)]^n\]</div>
<div class="mj">\[f_{(n)}(x)=n[F(x)]^{n-1}f(x)\qquad f_{(1)}(x)=n[1-F(x)]^{n-1}f(x)\]</div></section>
<section><h3>La \(k\)-ésima estadística de orden</h3>
<div class="mj">\[f_{(k)}(x)=\frac{n!}{(k-1)!\,(n-k)!}\,[F(x)]^{k-1}\,[1-F(x)]^{n-k}\,f(x)\]</div>
<p>Interpretación: \(k-1\) observaciones caen por debajo de \(x\), una cae en \(x\) y \(n-k\) por encima; el coeficiente multinomial cuenta las formas de asignarlas.</p></section>
<section><h3>Ejemplos</h3><ul>
<li><b>Uniforme(0, θ):</b> \(X_{(k)}/\theta\sim\text{Beta}(k,\,n-k+1)\), así que \(E[X_{(k)}]=\frac{k\theta}{n+1}\). El máximo \(X_{(n)}\) es el EMV de \(\theta\) y \(\frac{n+1}{n}X_{(n)}\) es insesgado.</li>
<li><b>Exponencial(λ):</b> el mínimo de \(n\) exponenciales independientes es exponencial con tasa \(n\lambda\): el primer fallo en un sistema de \(n\) componentes llega \(n\) veces más rápido.</li></ul>
<p class="link">En economía: el precio ganador de una subasta de segundo precio es la segunda estadística de orden de las valoraciones; los ingresos del decil más alto y los percentiles de una encuesta también lo son.</p></section>
${LAB}`,
qs:[{q:"Con 5 observaciones de U(0, 10), ¿cuál es la esperanza del máximo?",a:"E[X₍₅₎] = 5·10/6 = 8,33."},{q:"Una máquina tiene 4 componentes con vida Exp(λ = 0,5) por año y falla cuando falla el primero. ¿Vida esperada?",a:"El mínimo es Exp(4·0,5 = 2): vida esperada 1/2 = 0,5 años."}]},

{id:"convergencia", parte:"Unidad 2 · Convergencia estocástica", t:"Ley de los grandes números y teorema del límite central", sim:"tlc", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando la muestra crece, los estadísticos se estabilizan. La convergencia estocástica precisa en qué sentido: si el estadístico se acerca al parámetro (<b>en probabilidad</b>) o si su distribución se acerca a otra (<b>en distribución</b>).</p></section>
<section><h3>Tipos de convergencia</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Definición</th><th>Notación</th></tr>
<tr><td>Casi segura</td><td>\(P\big(\lim_{n\to\infty}X_n=X\big)=1\)</td><td>\(X_n\xrightarrow{c.s.}X\)</td></tr>
<tr><td>En media cuadrática</td><td>\(E[(X_n-X)^2]\to 0\)</td><td>\(X_n\xrightarrow{m.c.}X\)</td></tr>
<tr><td>En probabilidad</td><td>\(P(|X_n-X|>\varepsilon)\to 0\) para todo \(\varepsilon>0\)</td><td>\(X_n\xrightarrow{p}X\), \(\text{plim}\,X_n=X\)</td></tr>
<tr><td>En distribución</td><td>\(F_{X_n}(x)\to F_X(x)\) en los puntos de continuidad</td><td>\(X_n\xrightarrow{d}X\)</td></tr></table></div>
<p>Casi segura y en media cuadrática implican en probabilidad, y esta implica en distribución. Las recíprocas no valen en general.</p></section>
<section><h3>Ley (débil) de los grandes números</h3>
<p>Si \(X_1,\dots,X_n\) son independientes con media \(\mu\) y varianza \(\sigma^2\) finita, por la desigualdad de Chebyshev:</p>
<div class="mj">\[P(|\bar X_n-\mu|>\varepsilon)\le\frac{V(\bar X_n)}{\varepsilon^2}=\frac{\sigma^2}{n\varepsilon^2}\;\longrightarrow\;0\qquad\Rightarrow\qquad\bar X_n\xrightarrow{p}\mu\]</div>
<p>Es la base de la <b>consistencia</b>: un estimador es consistente si converge en probabilidad al parámetro. El teorema de Slutsky permite combinar límites: si \(X_n\xrightarrow{p}a\) y \(g\) es continua, \(g(X_n)\xrightarrow{p}g(a)\); si \(Y_n\xrightarrow{d}Y\) y \(X_n\xrightarrow{p}a\), entonces \(X_nY_n\xrightarrow{d}aY\).</p></section>
<section><h3>Teorema del límite central</h3>
<div class="mj">\[\frac{\bar X_n-\mu}{\sigma/\sqrt n}=\frac{\sqrt n(\bar X_n-\mu)}{\sigma}\xrightarrow{d}N(0,1)\]</div>
<p>No importa la forma de la población (solo que tenga varianza finita): la media estandarizada se vuelve normal. La velocidad depende de la asimetría de la población: con una uniforme basta \(n\approx 5\); con una exponencial o una Bernoulli con \(p\) pequeño se necesita bastante más. Por Slutsky, el resultado sigue valiendo si se reemplaza \(\sigma\) por \(S\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué el TLC justifica usar la normal para una proporción muestral?",a:"Porque p̂ es la media de variables Bernoulli: por el TLC, (p̂ − p)/√(p(1 − p)/n) converge a N(0, 1)."},{q:"¿La LGN dice que x̄ = μ cuando n es grande?",a:"No. Dice que la probabilidad de que x̄ se aleje de μ más que cualquier ε fijo tiende a cero."}]},

{id:"delta", parte:"Unidad 2 · Convergencia estocástica", t:"Método delta", sim:"delta", html:String.raw`
<section><h3>La idea</h3><p class="lead">A veces no interesa \(\bar X\) sino una función de ella: un logaritmo, una tasa \(1/\bar X\), una elasticidad. El <b>método delta</b> da la distribución aproximada de \(g(\bar X)\) usando una expansión de Taylor de primer orden alrededor de \(\mu\).</p></section>
<section><h3>El resultado</h3>
<div class="mj">\[g(\bar X)\approx g(\mu)+g'(\mu)(\bar X-\mu)\qquad\Longrightarrow\qquad\sqrt n\,[g(\bar X_n)-g(\mu)]\xrightarrow{d}N\big(0,\;[g'(\mu)]^2\sigma^2\big)\]</div>
<p>Requiere que \(g\) sea derivable en \(\mu\) y \(g'(\mu)\ne 0\). En la práctica: \(\text{ee}[g(\hat\theta)]\approx|g'(\hat\theta)|\cdot\text{ee}(\hat\theta)\).</p></section>
<section><h3>Ejemplos</h3><ol>
<li><b>Logaritmo:</b> \(g(x)=\ln x\), \(g'(\mu)=1/\mu\): \(V(\ln\bar X)\approx\frac{\sigma^2}{n\mu^2}\), el cuadrado del coeficiente de variación de \(\bar X\).</li>
<li><b>Tasa de una exponencial:</b> \(\hat\lambda=1/\bar X\), con \(\mu=1/\lambda\) y \(\sigma^2=1/\lambda^2\): \(g'(\mu)=-1/\mu^2=-\lambda^2\), así que \(V(\hat\lambda)\approx\lambda^4\cdot\frac{1}{n\lambda^2}=\frac{\lambda^2}{n}\), que es la cota de Cramér-Rao.</li>
<li><b>Odds:</b> \(g(p)=\frac{p}{1-p}\), \(g'(p)=\frac{1}{(1-p)^2}\): \(V\big(\frac{\hat p}{1-\hat p}\big)\approx\frac{p}{n(1-p)^3}\).</li></ol>
<p class="link">Versión multivariada: si \(\sqrt n(\hat\theta-\theta)\xrightarrow{d}N(0,\Sigma)\), entonces \(\sqrt n[g(\hat\theta)-g(\theta)]\xrightarrow{d}N(0,\nabla g'\Sigma\nabla g)\). Se usa en Econometría para errores estándar de elasticidades y de combinaciones no lineales de coeficientes.</p></section>
${LAB}`,
qs:[{q:"Si x̄ = 50, s = 10 y n = 100, ¿cuál es el error estándar aproximado de ln x̄?",a:"ee(x̄) = 10/√100 = 1; g′(50) = 1/50; ee(ln x̄) ≈ 1/50 = 0,02."}]},

{id:"estimadores", parte:"Unidad 3 · Estimación puntual", t:"Estimadores y sus propiedades", sim:"estim", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Un <b>estimador</b> es una regla que convierte una muestra en un número para aproximar un parámetro desconocido \(\theta\) de la población. La media muestral \(\bar{x}\) es un estimador de \(\mu\); el número que sale con tus datos, por ejemplo 48,5, es la <b>estimación</b>. Como la muestra es aleatoria, el estimador \(\hat\theta\) también es una variable aleatoria: cambia de una muestra a otra y tiene su propia distribución.</p></section>
<p class="link"><b>Propiedades frente a métodos.</b> La insesgadez y la consistencia son <i>propiedades</i> que miden la calidad de un estimador. El método de momentos y la máxima verosimilitud son <i>métodos</i> para encontrarlo; son las estaciones siguientes de esta unidad.</p>
<section><h3>Las cuatro propiedades</h3>
<div class="tbl"><table><tr><th>Propiedad</th><th>Qué exige</th><th>Ejemplo</th></tr>
<tr><td>Insesgadez</td><td>\(E[\hat\theta]=\theta\)</td><td>\(\bar x\) para \(\mu\); \(S^2\) para \(\sigma^2\)</td></tr>
<tr><td>Eficiencia</td><td>La menor varianza entre los insesgados</td><td>En la normal, \(\bar x\) varía menos que la mediana</td></tr>
<tr><td>Consistencia</td><td>\(\hat\theta\to\theta\) cuando \(n\to\infty\)</td><td>\(\bar x\), porque \(V(\bar x)=\sigma^2/n\to 0\)</td></tr>
<tr><td>Suficiencia</td><td>Resume toda la información de la muestra sobre \(\theta\)</td><td>\(\sum x_i\) para \(\mu\) en la normal</td></tr></table></div></section>
<section><h3>Error cuadrático medio</h3>
<p>Para comparar estimadores que pueden tener sesgo se usa el ECM, que suma la varianza y el sesgo al cuadrado:</p>
<div class="mj">\[ECM(\hat{\theta}) = Var(\hat{\theta}) + Sesgo(\hat{\theta})^2,\qquad Sesgo(\hat\theta)=E[\hat\theta]-\theta\]</div>
<p>Un estimador con algo de sesgo pero mucha menos varianza puede tener un ECM menor que uno insesgado.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> confundir el sesgo con el error de una estimación. Que una muestra dé \(\bar x = 48{,}5\) cuando \(\mu = 50\) no significa que \(\bar x\) sea sesgado. El sesgo es el promedio del error sobre todas las muestras posibles.</p>`,
deep:[
{k:"Demostración",t:"Insesgadez de la media",html:String.raw`<p><b>Objetivo:</b> demostrar que \(E[\bar{x}] = \mu\). Se usa que la esperanza es lineal.</p><div class="mj">\[E[\bar{x}] = E\left[ \frac{1}{n} \sum_{i=1}^{n} x_i \right] = \frac{1}{n} \sum_{i=1}^{n} E[x_i] = \frac{1}{n} (n \cdot \mu) = \mu \quad \blacksquare\]</div>`},
{k:"Demostración",t:"Varianza de la media y consistencia",html:String.raw`<p><b>Objetivo:</b> encontrar \(V(\bar{x})\). Como las observaciones son independientes, las covarianzas son cero y la varianza de la suma es la suma de varianzas.</p><div class="mj">\[V(\bar{x}) = V\left( \frac{1}{n} \sum_{i=1}^{n} x_i \right) = \frac{1}{n^2} \sum_{i=1}^{n} V(x_i) = \frac{1}{n^2} (n \cdot \sigma^2) = \frac{\sigma^2}{n} \quad \blacksquare\]</div><p>Como \(\bar x\) es insesgado y su varianza tiende a cero cuando \(n\) crece, \(\bar x\) converge en probabilidad a \(\mu\): es <b>consistente</b>.</p>`},
{k:"Demostración",t:"Por qué S² divide por n − 1",html:String.raw`<p>Sumando y restando \(\mu\) dentro del cuadrado se llega a la identidad:</p><div class="mj">\[\sum (x_i-\bar x)^2 = \sum (x_i-\mu)^2 - n(\bar x-\mu)^2\]</div><p>Al tomar esperanzas, \(E\left[\sum (x_i-\mu)^2\right]=n\sigma^2\) y \(E\left[n(\bar x-\mu)^2\right]=n\cdot\frac{\sigma^2}{n}=\sigma^2\). Entonces:</p><div class="mj">\[E\left[ \sum (x_i - \bar{x})^2 \right] = (n-1)\sigma^2 \implies E\left[ \frac{\sum (x_i - \bar{x})^2}{n-1} \right] = \sigma^2 \quad \blacksquare\]</div><p>Intuición: los datos quedan más cerca de \(\bar x\) que de \(\mu\), porque \(\bar x\) se calculó con esos mismos datos. Dividir por \(n-1\) compensa ese grado de libertad perdido.</p>`}],
py:`import numpy as np

def extraer_muestra(mu, sigma, n):
    """Lo mismo que hace el botón «Extraer nueva muestra»."""
    muestra = np.random.normal(loc=mu, scale=sigma, size=n)
    media_muestral = np.mean(muestra)
    return {
        "media_muestral": media_muestral,
        "error_media": abs(media_muestral - mu),
        "var_insesgada": np.var(muestra, ddof=1),  # divide por n - 1
        "var_sesgada": np.var(muestra, ddof=0),    # divide por n
    }`,
qs:[{q:"¿Un estimador sesgado puede ser consistente?",a:String.raw`Sí. \(\hat\sigma^2=\frac1n\sum(x_i-\bar x)^2\) tiene sesgo \(-\sigma^2/n\), que desaparece cuando \(n\) crece, y su varianza también tiende a cero. Es sesgado pero consistente.`},
 {q:"Con n = 5, ¿cuánto subestima en promedio σ̂² (dividido por n) a σ²?",a:String.raw`\(E[\hat\sigma^2]=\frac{n-1}{n}\sigma^2=0{,}8\,\sigma^2\): la subestima en un 20 %. Con \(n=100\) la subestimación es apenas del 1 %. Puedes comprobarlo en el laboratorio.`}]},

{id:"cramer", parte:"Unidad 3 · Estimación puntual", t:"Cramér-Rao, suficiencia y consistencia", sim:"cr", html:String.raw`
<section><h3>La idea</h3><p class="lead">Entre los estimadores insesgados, ¿hay uno con la menor varianza posible? La <b>desigualdad de Cramér-Rao</b> fija un piso a esa varianza; si un estimador lo alcanza, es el de <b>varianza mínima uniforme</b> (MVUE).</p></section>
<section><h3>Información de Fisher y la cota</h3>
<div class="mj">\[I(\theta)=E\left[\left(\frac{\partial\ln f(X;\theta)}{\partial\theta}\right)^2\right]=-E\left[\frac{\partial^2\ln f(X;\theta)}{\partial\theta^2}\right]\qquad V(\hat\theta)\ge\frac{1}{n\,I(\theta)}\]</div>
<p>La cota vale para estimadores insesgados de modelos «regulares» (el soporte no depende de \(\theta\)). La <b>eficiencia</b> de un estimador insesgado es \(\frac{1/(nI)}{V(\hat\theta)}\le 1\).</p>
<div class="tbl"><table><tr><th>Modelo</th><th>\(I(\theta)\)</th><th>Cota</th><th>¿Quién la alcanza?</th></tr>
<tr><td>Bernoulli(\(p\))</td><td>\(\frac{1}{p(1-p)}\)</td><td>\(\frac{p(1-p)}{n}\)</td><td>\(\hat p=\bar X\)</td></tr>
<tr><td>Poisson(\(\lambda\))</td><td>\(\frac1\lambda\)</td><td>\(\frac\lambda n\)</td><td>\(\bar X\)</td></tr>
<tr><td>Normal(\(\mu\), \(\sigma\) conocida)</td><td>\(\frac1{\sigma^2}\)</td><td>\(\frac{\sigma^2}{n}\)</td><td>\(\bar X\)</td></tr>
<tr><td>Exponencial(\(\lambda\))</td><td>\(\frac1{\lambda^2}\)</td><td>\(\frac{\lambda^2}{n}\)</td><td>Nadie en muestras finitas; el EMV \(1/\bar X\) asintóticamente</td></tr></table></div></section>
<section><h3>Suficiencia</h3>
<p>Un estadístico \(T(X)\) es <b>suficiente</b> para \(\theta\) si, conocido \(T\), la muestra no aporta más información sobre \(\theta\). <b>Teorema de factorización (Fisher-Neyman):</b> \(T\) es suficiente si y solo si</p>
<div class="mj">\[f(x_1,\dots,x_n;\theta)=g\big(T(x),\theta\big)\cdot h(x_1,\dots,x_n)\]</div>
<p>Ejemplo Poisson: \(\prod\frac{e^{-\lambda}\lambda^{x_i}}{x_i!}=\underbrace{e^{-n\lambda}\lambda^{\sum x_i}}_{g(\sum x_i,\lambda)}\cdot\underbrace{\tfrac{1}{\prod x_i!}}_{h(x)}\): \(\sum X_i\) es suficiente. Por el teorema de <b>Rao-Blackwell</b>, condicionar un estimador insesgado en un estadístico suficiente nunca aumenta su varianza; por eso los buenos estimadores dependen de los datos solo a través de estadísticos suficientes.</p></section>
<section><h3>Consistencia</h3>
<p>\(\hat\theta_n\) es consistente si \(\hat\theta_n\xrightarrow{p}\theta\). Condición suficiente: \(E(\hat\theta_n)\to\theta\) y \(V(\hat\theta_n)\to 0\) (convergencia en media cuadrática, pues \(ECM=V+\text{sesgo}^2\to 0\)). Así, \(S^2\) y también el estimador sesgado \(\frac{n-1}{n}S^2\) son consistentes para \(\sigma^2\).</p></section>
${LAB}`,
qs:[{q:"¿Puede un estimador sesgado tener varianza menor que la cota de Cramér-Rao?",a:"Sí: la cota solo aplica a estimadores insesgados. Por ejemplo, el estimador constante θ̂ = 5 tiene varianza cero, aunque es un pésimo estimador."},{q:"En una muestra Bernoulli, ¿qué estadístico es suficiente para p?",a:"El número de éxitos Σxᵢ (o, equivalentemente, la proporción muestral)."}]},

{id:"momentos", parte:"Unidad 3 · Estimación puntual", t:"Método de momentos", html:String.raw`
<section><h3>La idea</h3><p class="lead">Igualar los momentos teóricos de la población con los momentos de la muestra, y despejar los parámetros desconocidos.</p>
<div class="mj">\[M_k=\frac1n\sum_{i=1}^n X_i^k\quad\text{(momento muestral de orden }k)\]</div></section>
<section><h3>Demostración para la distribución normal</h3><ol class="steps">
<li><b>Primer momento, para hallar \(\mu\).</b> Se iguala \(E[X]\) con \(M_1\):<div class="mj">\[E[X] = \mu \quad \text{y} \quad M_1 = \frac{1}{n} \sum_{i=1}^n X_i \;\Longrightarrow\; \hat{\mu}_{MM} = \bar{X}\]</div></li>
<li><b>Segundo momento, para hallar \(\sigma^2\).</b> Por definición \(V(X) = E[X^2] - (E[X])^2\), así que \(E[X^2] = \sigma^2 + \mu^2\). Se iguala con \(M_2\):<div class="mj">\[\sigma^2 + \mu^2 = \frac{1}{n} \sum_{i=1}^n X_i^2\]</div></li>
<li><b>Despejar.</b> Se reemplaza \(\mu\) por el estimador que ya se encontró:<div class="mj">\[\hat{\sigma}^2_{MM} = \left( \frac{1}{n} \sum_{i=1}^n X_i^2 \right) - \bar{X}^2 = \frac{1}{n} \sum_{i=1}^n (X_i - \bar{X})^2 \quad \blacksquare\]</div></li></ol>
<p class="warn"><b>Ojo:</b> el método de momentos entrega el estimador <b>sesgado</b> de la varianza, porque divide por \(n\) y no por \(n-1\).</p></section>
<section><h3>Otro ejemplo: uniforme en \([0,\theta]\)</h3>
<p>Como \(E[X]=\theta/2\), igualar con \(\bar X\) da \(\hat\theta_{MM}=2\bar X\). Es insesgado, pero puede dar absurdos: con la muestra 1, 2 y 9, \(\hat\theta=8\), menor que el 9 que sí se observó. Máxima verosimilitud usa \(\hat\theta=\max X_i\) y nunca cae en eso.</p></section>`,
 qs:[{q:"Si X sigue una Poisson(λ), ¿cuál es el estimador de λ por momentos?",a:String.raw`Como \(E[X]=\lambda\), se iguala con el primer momento muestral: \(\hat\lambda_{MM}=\bar X\).`}]},

{id:"verosimilitud", parte:"Unidad 3 · Estimación puntual", t:"Máxima verosimilitud", sim:"mle", html:String.raw`
<section><h3>La idea</h3><p class="lead">Buscar los valores de los parámetros que hacen más probable haber obtenido exactamente la muestra que observamos.</p></section>
<section><h3>Demostración para la distribución normal</h3><ol class="steps">
<li><b>Función de verosimilitud.</b> Como las observaciones son independientes, la probabilidad conjunta es el producto de las densidades:<div class="mj">\[L(\mu, \sigma^2) = \prod_{i=1}^n \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x_i - \mu)^2}{2\sigma^2}} = (2\pi\sigma^2)^{-n/2} \, e^{-\frac{1}{2\sigma^2} \sum_{i=1}^n (x_i - \mu)^2}\]</div></li>
<li><b>Log-verosimilitud.</b> Maximizar \(L\) es lo mismo que maximizar \(\ln L\), y el logaritmo convierte el producto en una suma fácil de derivar:<div class="mj">\[\ln L = -\frac{n}{2} \ln(2\pi) - \frac{n}{2} \ln(\sigma^2) - \frac{1}{2\sigma^2} \sum_{i=1}^n (x_i - \mu)^2\]</div></li>
<li><b>Maximizar respecto a \(\mu\).</b> Condición de primer orden:<div class="mj">\[\frac{\partial \ln L}{\partial \mu} = \frac{1}{\sigma^2} \sum_{i=1}^n (x_i - \mu) = 0 \;\Longrightarrow\; \hat{\mu}_{MLE} = \frac{\sum x_i}{n} = \bar{x}\]</div></li>
<li><b>Maximizar respecto a \(\sigma^2\).</b> Se trata \(\sigma^2\) como una sola variable:<div class="mj">\[\frac{\partial \ln L}{\partial \sigma^2} = -\frac{n}{2\sigma^2} + \frac{1}{2(\sigma^2)^2} \sum_{i=1}^n (x_i - \mu)^2 = 0 \;\Longrightarrow\; \hat{\sigma}^2_{MLE} = \frac{1}{n} \sum_{i=1}^n (x_i - \bar{x})^2 \quad\blacksquare\]</div><p>Igual que momentos, máxima verosimilitud entrega el estimador <b>sesgado</b> de la varianza.</p></li></ol></section>
${LAB}`,
 deep:[{k:"Comparación",t:"Momentos frente a máxima verosimilitud",html:String.raw`<div class="tbl"><table><tr><th></th><th>Momentos</th><th>Máxima verosimilitud</th></tr><tr><td>Qué necesita</td><td>Solo los momentos teóricos</td><td>La distribución completa</td></tr><tr><td>Cálculo</td><td>Casi siempre fácil</td><td>A veces requiere métodos numéricos</td></tr><tr><td>En muestras grandes</td><td>Consistente</td><td>Consistente y con la menor varianza posible</td></tr><tr><td>En la normal</td><td colspan="2">Coinciden: \(\bar x\) y \(\frac1n\sum(x_i-\bar x)^2\)</td></tr></table></div>`}],
 qs:[{q:"¿Por qué se maximiza ln L y no directamente L?",a:"El logaritmo es una función creciente, así que el máximo está en el mismo punto. Además convierte el producto en una suma, que es mucho más fácil de derivar."}]},

{id:"intervalos", parte:"Unidad 3 · Estimación puntual", t:"Intervalos y tamaño de muestra", sim:"ic", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Una estimación puntual casi nunca es exacta. Un <b>intervalo de confianza</b> le agrega un margen de error: un rango construido de forma que, en el \((1-\alpha)\) de las muestras posibles, contenga el verdadero parámetro. El <b>tamaño de muestra</b> responde la pregunta inversa: cuántos datos necesito para que el margen no pase de un valor \(E\).</p></section>
<section><h3>Los dos modelos</h3>
<div class="mj">\[IC = \bar{x} \pm Z_{\alpha/2}\,\frac{\sigma}{\sqrt{n}} \qquad\qquad n = \left(\frac{Z_{\alpha/2} \cdot \sigma}{E}\right)^2\]</div>
<div class="tbl"><table><tr><th>Confianza</th><th>α</th><th>\(Z_{\alpha/2}\)</th></tr>
<tr><td>90 %</td><td class="num">0,10</td><td class="num">1,645</td></tr><tr><td>95 %</td><td class="num">0,05</td><td class="num">1,960</td></tr><tr><td>99 %</td><td class="num">0,01</td><td class="num">2,576</td></tr></table></div>
<p>El tamaño de muestra se redondea siempre hacia arriba: 34,6 observaciones son 35.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> decir que hay 95 % de probabilidad de que \(\mu\) esté en el intervalo que calculaste. \(\mu\) es fijo; lo aleatorio es el intervalo. El 95 % describe el procedimiento: de cada 100 muestras, unas 95 producen intervalos que contienen a \(\mu\). La estación «Qué significa 95 % de confianza» lo muestra con una simulación.</p>`,
deep:[
{k:"Derivación",t:"De dónde sale la fórmula de n",html:String.raw`<p>El margen de error es la mitad del ancho del intervalo. Se iguala al margen deseado y se despeja \(n\):</p><div class="mj">\[E = Z_{\alpha/2}\frac{\sigma}{\sqrt n}\;\Longrightarrow\;\sqrt n=\frac{Z_{\alpha/2}\,\sigma}{E}\;\Longrightarrow\; n=\left(\frac{Z_{\alpha/2}\,\sigma}{E}\right)^2\]</div><p>Como \(n\) depende de \(1/E^2\), reducir el margen a la mitad exige cuatro veces más datos.</p>`},
{k:"Ampliación",t:"Si σ es desconocida: t de Student",html:String.raw`<p>Cuando no conoces \(\sigma\) la reemplazas por la desviación muestral \(s\), y la normal por una t con \(n-1\) grados de libertad, que tiene colas más gruesas:</p><div class="mj">\[IC = \bar{x} \pm t_{\alpha/2,\,n-1}\,\frac{s}{\sqrt{n}}\]</div><div class="tbl"><table><tr><th>n</th><th>\(t_{0{,}025}\)</th><th>Frente a Z = 1,960</th></tr><tr><td class="num">10</td><td class="num">2,262</td><td>15 % más ancho</td></tr><tr><td class="num">30</td><td class="num">2,045</td><td>4 % más ancho</td></tr><tr><td class="num">100</td><td class="num">1,984</td><td>Casi igual</td></tr></table></div><p>Por eso con muestras grandes se suele usar Z aunque \(\sigma\) sea desconocida.</p>`},
{k:"Ampliación",t:"Intervalo y tamaño de muestra para una proporción",html:String.raw`<div class="mj">\[IC = \hat p \pm Z_{\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}} \qquad\qquad n=\frac{Z_{\alpha/2}^2\,p(1-p)}{E^2}\]</div><p>Si no tienes idea de \(p\), usa \(p=0{,}5\), que da el \(n\) más grande posible. Ejemplo de encuesta al 95 % con margen de 3 puntos: \(n=1{,}96^2\cdot 0{,}25/0{,}03^2=1.067{,}1\), es decir, 1.068 personas.</p>`}],
py:`import math
import numpy as np

def intervalo_y_tamano(x_bar, sigma, n_actual, E, Z):
    """Z = 1.645 (90 %), 1.96 (95 %) o 2.576 (99 %)."""
    error_estandar = sigma / np.sqrt(n_actual)
    margen_error_actual = Z * error_estandar
    return {
        "lim_inf": x_bar - margen_error_actual,
        "lim_sup": x_bar + margen_error_actual,
        "n_requerido": math.ceil(((Z * sigma) / E) ** 2),
    }`,
qs:[{q:"Si quieres reducir el margen de error a la mitad, ¿cuánto debe crecer n?",a:String.raw`Cuatro veces, porque \(n\) depende de \(1/E^2\).`},
 {q:"¿Qué pasa con el ancho del intervalo si pasas de 95 % a 99 % de confianza?",a:String.raw`Se multiplica por \(2{,}576/1{,}960 = 1{,}31\): es 31 % más ancho. Más confianza cuesta precisión.`}]},

{id:"icgen", parte:"Unidad 3 · Estimación puntual", t:"Intervalos para medias, proporciones y varianzas", sim:"icg", html:String.raw`
<section><h3>El método del pivote</h3><p class="lead">Un intervalo de confianza se construye con un <b>pivote</b>: una función de la muestra y del parámetro cuya distribución no depende del parámetro. Se encierra el pivote entre dos cuantiles y se despeja el parámetro.</p>
<div class="mj">\[P\left(-t_{\alpha/2}\le\frac{\bar X-\mu}{S/\sqrt n}\le t_{\alpha/2}\right)=1-\alpha\quad\Longrightarrow\quad\bar X\pm t_{\alpha/2,\,n-1}\frac{S}{\sqrt n}\]</div></section>
<section><h3>Los intervalos del programa</h3>
<div class="tbl"><table><tr><th>Parámetro</th><th>Pivote</th><th>Intervalo</th></tr>
<tr><td>\(\mu\), \(\sigma\) conocida</td><td>\(\frac{\bar X-\mu}{\sigma/\sqrt n}\sim N(0,1)\)</td><td>\(\bar x\pm z_{\alpha/2}\frac{\sigma}{\sqrt n}\)</td></tr>
<tr><td>\(\mu\), \(\sigma\) desconocida</td><td>\(\frac{\bar X-\mu}{S/\sqrt n}\sim t_{n-1}\)</td><td>\(\bar x\pm t_{\alpha/2}\frac{s}{\sqrt n}\)</td></tr>
<tr><td>\(\mu_1-\mu_2\)</td><td>\(t\) de Welch o con varianza agrupada</td><td>\((\bar x_1-\bar x_2)\pm t_{\alpha/2}\sqrt{\frac{s_1^2}{n_1}+\frac{s_2^2}{n_2}}\)</td></tr>
<tr><td>\(p\)</td><td>\(\frac{\hat p-p}{\sqrt{p(1-p)/n}}\approx N(0,1)\)</td><td>\(\hat p\pm z_{\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}}\)</td></tr>
<tr><td>\(p_1-p_2\)</td><td>Normal aproximada</td><td>\((\hat p_1-\hat p_2)\pm z_{\alpha/2}\sqrt{\frac{\hat p_1(1-\hat p_1)}{n_1}+\frac{\hat p_2(1-\hat p_2)}{n_2}}\)</td></tr>
<tr><td>\(\sigma^2\)</td><td>\(\frac{(n-1)S^2}{\sigma^2}\sim\chi^2_{n-1}\)</td><td>\(\left[\frac{(n-1)s^2}{\chi^2_{1-\alpha/2}},\;\frac{(n-1)s^2}{\chi^2_{\alpha/2}}\right]\)</td></tr>
<tr><td>\(\sigma_1^2/\sigma_2^2\)</td><td>\(\frac{S_1^2/\sigma_1^2}{S_2^2/\sigma_2^2}\sim F\)</td><td>\(\left[\frac{s_1^2/s_2^2}{F_{\alpha/2}(n_1-1,n_2-1)},\;\frac{s_1^2}{s_2^2}F_{\alpha/2}(n_2-1,n_1-1)\right]\)</td></tr></table></div>
<p>Aquí \(\chi^2_{q}\) y \(F_{\alpha/2}\) denotan cuantiles: \(\chi^2_{\alpha/2}\) deja \(\alpha/2\) a la izquierda y \(F_{\alpha/2}\) deja \(\alpha/2\) a la derecha. Los intervalos para varianzas <b>no son simétricos</b> y son muy sensibles a la falta de normalidad.</p></section>
${LAB}`,
qs:[{q:"Con n = 20 y s² = 16,4, ¿cuál es el intervalo del 95 % para σ²?",a:"[19·16,4/32,852; 19·16,4/8,907] = [9,49; 34,99]."},{q:"Si el intervalo para σ₁²/σ₂² es [0,62; 2,10], ¿hay evidencia de varianzas distintas al 5 %?",a:"No, porque el intervalo contiene a 1."}]},

{id:"cobertura", parte:"Unidad 3 · Estimación puntual", t:"Qué significa 95 % de confianza", sim:"cob", html:String.raw`
<section><h3>La idea</h3><p class="lead">La confianza no es una propiedad de un intervalo, sino del procedimiento. Si repites el muestreo muchas veces, el \((1-\alpha)\) de los intervalos contendrá a \(\mu\) y el resto no, aunque nunca sabrás cuál de los dos te tocó.</p></section>
${LAB}
<p>Cada línea es el intervalo de una muestra distinta de la misma población, con \(\mu = 100\) y \(\sigma = 15\). Las rojas no contienen a \(\mu\). Cambia el nivel de confianza y mira cómo se alargan los intervalos y cuántos fallan.</p>`,
 qs:[{q:"Si construyes 200 intervalos al 90 %, ¿cuántos esperas que no contengan a μ?",a:"Alrededor de 20, el 10 %. En cada repetición el número exacto varía."}]},

{id:"pruebas", parte:"Unidad 4 · Prueba de hipótesis", t:"Pruebas de hipótesis", sim:"prueba", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La prueba de hipótesis es el método formal para decidir si la muestra trae suficiente evidencia para desmentir una creencia previa, el <b>statu quo</b>. Ese statu quo es la hipótesis nula \(H_0\); lo que se quiere demostrar va en la alternativa \(H_1\).</p></section>
<section><h3>El procedimiento</h3><ol class="steps">
<li>Plantear \(H_0\) y \(H_1\) a partir de la pregunta.</li>
<li>Fijar el nivel de significancia \(\alpha\): el riesgo de rechazar \(H_0\) siendo cierta que estás dispuesto a correr.</li>
<li>Calcular el estadístico de prueba con los datos.</li>
<li>Compararlo con el valor crítico, o comparar el p-valor con \(\alpha\). Las dos rutas dan la misma decisión.</li>
<li>Concluir en el lenguaje del problema, no solo «se rechaza».</li></ol></section>
<section><h3>Los tres estadísticos</h3>
<div class="tbl"><table><tr><th>Parámetro</th><th>Estadístico</th><th>Distribución</th></tr>
<tr><td>Media, \(\sigma\) conocida</td><td>\(Z=\dfrac{\bar x-\mu_0}{\sigma/\sqrt n}\)</td><td>Normal estándar</td></tr>
<tr><td>Media, \(\sigma\) desconocida</td><td>\(T=\dfrac{\bar x-\mu_0}{s/\sqrt n}\)</td><td>t con \(n-1\) gl</td></tr>
<tr><td>Proporción</td><td>\(Z=\dfrac{\hat p-p_0}{\sqrt{p_0(1-p_0)/n}}\)</td><td>Normal estándar</td></tr></table></div></section>
<section><h3>Las tres colas</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>\(H_0\)</th><th>\(H_1\)</th><th>p-valor</th><th>Se rechaza si</th></tr>
<tr><td>Dos colas</td><td>\(=\)</td><td>\(\neq\)</td><td>\(2\,[1-F(|z|)]\)</td><td>\(|z|>\) crítico de \(1-\alpha/2\)</td></tr>
<tr><td>Cola derecha</td><td>\(\le\)</td><td>\(>\)</td><td>\(1-F(z)\)</td><td>\(z>\) crítico de \(1-\alpha\)</td></tr>
<tr><td>Cola izquierda</td><td>\(\ge\)</td><td>\(<\)</td><td>\(F(z)\)</td><td>\(z<\) crítico de \(\alpha\)</td></tr></table></div></section>
${LAB}
<p class="link"><b>¿Qué es el p-valor?</b> La probabilidad de obtener una muestra tan extrema como la tuya, o más, si \(H_0\) fuera cierta. Si es menor que \(\alpha\), el statu quo es insostenible.</p>
<p class="warn"><b>Error común:</b> concluir que \(H_0\) es cierta porque no se rechazó. No rechazar solo dice que la muestra no alcanza para descartarla; con más datos podría rechazarse.</p>`,
deep:[
{k:"Intuición",t:"Dualidad con los intervalos de confianza",html:String.raw`<p>Toda prueba de dos colas con significancia \(\alpha\) equivale a construir un intervalo de confianza al \(1-\alpha\). Si el valor hipotético cae <b>dentro</b> del intervalo, es un valor razonable y no se rechaza \(H_0\). Si cae <b>afuera</b>, se rechaza. El laboratorio muestra este intervalo cuando eliges dos colas.</p>`},
{k:"Ampliación",t:"Errores tipo I y tipo II",html:String.raw`<div class="tbl"><table><tr><th></th><th>\(H_0\) es cierta</th><th>\(H_0\) es falsa</th></tr><tr><td>Rechazas \(H_0\)</td><td class="bad">Error tipo I (prob. \(\alpha\))</td><td class="ok">Acierto (potencia \(1-\beta\))</td></tr><tr><td>No rechazas \(H_0\)</td><td class="ok">Acierto</td><td class="bad">Error tipo II (prob. \(\beta\))</td></tr></table></div><p>Bajar \(\alpha\) hace más difícil rechazar, y eso aumenta \(\beta\). La única forma de bajar los dos a la vez es aumentar \(n\). La estación «Potencia de una prueba» lo muestra.</p>`},
{k:"Detalle",t:"Por qué la proporción usa p₀ en la prueba y p̂ en el intervalo",html:String.raw`<p>En la prueba se supone que \(H_0\) es cierta, así que la varianza de \(\hat p\) se calcula con el valor hipotético: \(p_0(1-p_0)/n\). En el intervalo no hay hipótesis, así que se usa lo observado: \(\hat p(1-\hat p)/n\). Tu código hace exactamente eso, y por eso la dualidad con el intervalo en proporciones es aproximada.</p>`}],
py:`import math
import scipy.stats as stats

def prueba_hipotesis(tipo, cola, alpha, n, mu_0=None, x_bar=None,
                     sigma=None, s=None, p_0=None, p_hat=None):
    """tipo: "z", "t" o "p".  cola: "dos", "der" o "izq"."""
    if tipo == "p":
        error_estandar = math.sqrt((p_0 * (1 - p_0)) / n)   # usa p_0
        stat_calc = (p_hat - p_0) / error_estandar
        dist = stats.norm
    elif tipo == "t":
        error_estandar = s / math.sqrt(n)
        stat_calc = (x_bar - mu_0) / error_estandar
        dist = stats.t(n - 1)
    else:
        error_estandar = sigma / math.sqrt(n)
        stat_calc = (x_bar - mu_0) / error_estandar
        dist = stats.norm

    if cola == "dos":
        p_valor = 2 * (1 - dist.cdf(abs(stat_calc)))
        stat_critico = dist.ppf(1 - alpha / 2)
    elif cola == "der":
        p_valor = 1 - dist.cdf(stat_calc)
        stat_critico = dist.ppf(1 - alpha)
    else:
        p_valor = dist.cdf(stat_calc)
        stat_critico = dist.ppf(alpha)

    return {"stat": stat_calc, "p_valor": p_valor,
            "critico": stat_critico, "rechaza_h0": p_valor < alpha}`,
qs:[{q:"Con p-valor = 0,03, ¿rechazas H₀ al 5 %? ¿Y al 1 %?",a:"Al 5 % sí, porque 0,03 &lt; 0,05. Al 1 % no, porque 0,03 &gt; 0,01. El p-valor es el α más pequeño con el que todavía rechazarías."},
 {q:"Una prueba de dos colas al 5 % no rechaza H₀: μ = 50. ¿El 50 queda dentro o fuera del intervalo al 95 %?",a:"Dentro. Por la dualidad, no rechazar en dos colas equivale a que el valor hipotético esté dentro del intervalo de confianza del mismo nivel."}]},

{id:"potencia", parte:"Unidad 4 · Prueba de hipótesis", t:"Potencia de una prueba", sim:"pot", html:String.raw`
<section><h3>La idea</h3><p class="lead">La potencia es la probabilidad de rechazar \(H_0\) cuando de verdad es falsa: \(1-\beta\). Una prueba con poca potencia casi nunca detecta diferencias, aunque existan.</p>
<div class="mj">\[\text{Cola derecha:}\quad 1-\beta = 1-\Phi\!\left(\frac{c-\mu_1}{\sigma/\sqrt n}\right),\qquad c=\mu_0+Z_{1-\alpha}\frac{\sigma}{\sqrt n}\]</div></section>
${LAB}
<p>La curva gris es la distribución de \(\bar x\) si \(H_0\) es cierta (\(\mu_0 = 50\)); la de color, si la media verdadera es \(\mu_1\). El área roja es \(\alpha\) y la ámbar es \(\beta\).</p>`,
 qs:[{q:"¿Qué aumenta la potencia de una prueba?",a:String.raw`Cuatro cosas: más observaciones \(n\), una diferencia mayor entre \(\mu_1\) y \(\mu_0\), menos dispersión \(\sigma\) y un \(\alpha\) más grande. Solo las dos primeras dependen del diseño del estudio sin aceptar más error tipo I.`}]},

{id:"neyman", parte:"Unidad 4 · Prueba de hipótesis", t:"Neyman-Pearson y razón de verosimilitud", sim:"lrt", html:String.raw`
<section><h3>Formulación del problema</h3><p class="lead">Una prueba divide el espacio muestral en una <b>región de rechazo</b> \(C\) y su complemento. Su tamaño es \(\alpha=P(X\in C\mid H_0)\) y su potencia, \(1-\beta=P(X\in C\mid H_1)\). Entre todas las pruebas de tamaño \(\alpha\) se busca la de mayor potencia.</p></section>
<section><h3>Lema de Neyman-Pearson</h3>
<p>Para hipótesis simples \(H_0:\theta=\theta_0\) frente a \(H_1:\theta=\theta_1\), la prueba más potente de tamaño \(\alpha\) rechaza cuando la razón de verosimilitudes es grande:</p>
<div class="mj">\[\frac{L(\theta_1;x)}{L(\theta_0;x)}>k,\qquad\text{con }k\text{ tal que }P(\text{rechazar}\mid H_0)=\alpha\]</div>
<p><b>Ejemplo (normal, \(\sigma\) conocida, \(\mu_1>\mu_0\)):</b></p>
<div class="mj">\[\frac{L(\mu_1)}{L(\mu_0)}=\exp\left\{\frac{n(\mu_1-\mu_0)}{\sigma^2}\bar x-\frac{n(\mu_1^2-\mu_0^2)}{2\sigma^2}\right\}>k\iff\bar x>c=\mu_0+z_{1-\alpha}\frac{\sigma}{\sqrt n}\]</div>
<p>La región no depende de \(\mu_1\) (solo de que sea mayor que \(\mu_0\)): la prueba Z de cola derecha es <b>uniformemente más potente</b> para \(H_1:\mu>\mu_0\).</p></section>
<section><h3>Prueba de razón de verosimilitud generalizada</h3>
<div class="mj">\[\Lambda=\frac{\max_{\theta\in\Theta_0}L(\theta)}{\max_{\theta\in\Theta}L(\theta)}\in(0,1]\qquad -2\ln\Lambda\xrightarrow{d}\chi^2_r\ \text{(teorema de Wilks)}\]</div>
<p>\(r\) es el número de restricciones de \(H_0\). Se rechaza si \(-2\ln\Lambda>\chi^2_{r,1-\alpha}\). Las pruebas de <b>Wald</b> (compara \(\hat\theta\) con \(\theta_0\)) y de <b>multiplicadores de Lagrange</b> (mira la pendiente de \(\ln L\) en \(\theta_0\)) son asintóticamente equivalentes a la LR.</p></section>
<section><h3>El p-valor</h3><p>Es la probabilidad, bajo \(H_0\), de obtener un estadístico al menos tan extremo como el observado. Se rechaza \(H_0\) si p-valor \(<\alpha\). No es la probabilidad de que \(H_0\) sea cierta.</p></section>
${LAB}`,
qs:[{q:"En 200 lanzamientos salen 118 caras. ¿Es la moneda justa (prueba LR, α = 5 %)?",a:"p̂ = 0,59; −2 ln Λ ≈ 6,52 > 3,84: se rechaza que p = 0,5 (p-valor ≈ 0,011)."}]},

{id:"avanzadas", parte:"Unidad 4 · Prueba de hipótesis", t:"Pruebas de hipótesis avanzadas", sim:"avanz", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Las mismas reglas de decisión sirven para comparar dos poblaciones o para hacer preguntas sobre la dispersión en vez del promedio. Lo que cambia es el estadístico y su distribución: normal, ji cuadrado o F de Fisher.</p></section>
<section><h3>Las tres pruebas</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Distribución</th></tr>
<tr><td>Diferencia de proporciones</td><td>\(Z_c=\dfrac{(\hat p_1-\hat p_2)-d_0}{\sqrt{\frac{p^*(1-p^*)}{n_1}+\frac{p^*(1-p^*)}{n_2}}}\), con \(p^*=\dfrac{x_1+x_2}{n_1+n_2}\)</td><td>Normal estándar</td></tr>
<tr><td>Una varianza</td><td>\(\chi^2_c=\dfrac{(n-1)S^2}{\sigma_0^2}\)</td><td>\(\chi^2\) con \(n-1\) gl</td></tr>
<tr><td>Cociente de varianzas</td><td>\(F_c=\dfrac{S_1^2}{S_2^2}\)</td><td>F con \((n_1-1,\;n_2-1)\) gl</td></tr></table></div></section>
<section><h3>Dos colas en distribuciones asimétricas</h3>
<p>La \(\chi^2\) y la F no son simétricas, así que en dos colas hay dos valores críticos que no son uno el negativo del otro, y el p-valor se calcula con la cola más cercana:</p>
<div class="mj">\[p\text{-valor}=\min\{\,2F(x_c),\; 2[1-F(x_c)]\,\}\]</div></section>
${LAB}
<p class="warn"><b>Ojo:</b> las pruebas \(\chi^2\) y F suponen que las poblaciones son normales y son muy sensibles a que no lo sean. Con datos sesgados o con valores atípicos pueden rechazar por la forma de la distribución y no por la varianza.</p>`,
deep:[
{k:"Intuición",t:"Por qué se agrupa p*",html:String.raw`<p>Con \(d_0=0\), \(H_0\) dice que \(p_1=p_2\). Si las dos proporciones son iguales, la mejor estimación de ese valor común junta los éxitos de ambas muestras: eso es \(p^*\).</p><p>Si usas \(d_0\neq 0\), \(H_0\) ya no dice que las proporciones sean iguales, y lo usual es no agrupar: \(\sqrt{\hat p_1(1-\hat p_1)/n_1+\hat p_2(1-\hat p_2)/n_2}\). El laboratorio conserva la versión agrupada de Economiapp.</p>`},
{k:"Práctica",t:"Leer la tabla F por la cola izquierda",html:String.raw`<p>Muchas tablas F solo traen la cola derecha. El valor crítico de la izquierda sale invirtiendo los grados de libertad:</p><div class="mj">\[F_{\alpha}(a,b)=\frac{1}{F_{1-\alpha}(b,a)}\]</div><p>Por eso es común poner arriba la varianza más grande: así el estadístico queda mayor que 1 y basta la cola derecha.</p>`}],
py:`import math
import scipy.stats as stats

def p_valor_por_cola(cdf_val, cola):
    if cola == "dos":
        return min(2 * cdf_val, 2 * (1 - cdf_val))
    return 1 - cdf_val if cola == "der" else cdf_val

def diferencia_proporciones(x1, n1, x2, n2, d0, cola):
    p_hat1, p_hat2 = x1 / n1, x2 / n2
    p_star = (x1 + x2) / (n1 + n2)
    den = math.sqrt(p_star * (1 - p_star) / n1 + p_star * (1 - p_star) / n2)
    z = ((p_hat1 - p_hat2) - d0) / den
    if cola == "dos":
        return z, 2 * (1 - stats.norm.cdf(abs(z)))
    return z, (1 - stats.norm.cdf(z)) if cola == "der" else stats.norm.cdf(z)

def una_varianza(n, s2, sigma2_0, cola):
    chi2_c = (n - 1) * s2 / sigma2_0
    return chi2_c, p_valor_por_cola(stats.chi2.cdf(chi2_c, n - 1), cola)

def cociente_varianzas(n1, s2_1, n2, s2_2, cola):
    f_c = s2_1 / s2_2
    return f_c, p_valor_por_cola(stats.f.cdf(f_c, n1 - 1, n2 - 1), cola)`,
qs:[{q:"Con n = 30, S² = 12,5 y σ₀² = 10, ¿cuánto vale χ²c?",a:String.raw`\(\chi^2_c = 29\cdot 12{,}5/10 = 36{,}25\), con 29 grados de libertad. Es el caso que trae el laboratorio por defecto.`},
 {q:"En el cociente de varianzas, ¿cambia la decisión de dos colas si inviertes qué muestra va arriba?",a:String.raw`No. El estadístico pasa a ser \(1/F_c\) y los grados de libertad se invierten, pero el p-valor de dos colas es el mismo. Cambia solo cuál cola usas.`}]},

{id:"welch", parte:"Unidad 4 · Prueba de hipótesis", t:"Diferencia de medias (Welch)", sim:"welch", html:String.raw`
<section><h3>La idea</h3><p class="lead">Sirve para comparar los promedios de dos grupos independientes cuando las varianzas son desconocidas y posiblemente distintas.</p>
<div class="mj">\[t = \frac{(\bar{x}_1 - \bar{x}_2) - (\mu_1 - \mu_2)}{\sqrt{\frac{S_1^2}{n_1} + \frac{S_2^2}{n_2}}}\]</div>
<p>Los grados de libertad salen de la aproximación de Welch-Satterthwaite y casi nunca son enteros:</p>
<div class="mj">\[gl=\frac{\left(\frac{S_1^2}{n_1}+\frac{S_2^2}{n_2}\right)^2}{\frac{(S_1^2/n_1)^2}{n_1-1}+\frac{(S_2^2/n_2)^2}{n_2-1}}\]</div></section>
${LAB}
`,
 qs:[{q:"¿Cuándo conviene la versión con varianza agrupada en lugar de Welch?",a:"Solo si tienes buenas razones para creer que las varianzas son iguales, por ejemplo porque la prueba F del cociente no la rechaza. Welch funciona bien en los dos casos, por eso hoy es la opción por defecto."}]},

{id:"contingencia", parte:"Unidad 4 · Prueba de hipótesis", t:"Tablas de contingencia y bondad de ajuste", sim:"chi", html:String.raw`
<section><h3>La idea</h3><p class="lead">Las pruebas ji cuadrado comparan frecuencias <b>observadas</b> con las <b>esperadas</b> bajo \(H_0\). Si las diferencias son grandes, se rechaza.</p>
<div class="mj">\[\chi^2=\sum\frac{(O-E)^2}{E}\;\approx\;\chi^2_{gl}\]</div></section>
<section><h3>Bondad de ajuste</h3>
<p>\(H_0\): los datos siguen una distribución dada (uniforme, Poisson, normal…). Con \(k\) categorías, \(E_i=n\,p_i\) y \(gl=k-1-m\), donde \(m\) es el número de parámetros estimados con los mismos datos (por ejemplo, \(m=1\) si se estima \(\lambda\) de una Poisson con \(\bar x\)).</p></section>
<section><h3>Independencia en tablas de contingencia</h3>
<p>\(H_0\): las dos variables categóricas son independientes. Con \(r\) filas y \(c\) columnas:</p>
<div class="mj">\[E_{ij}=\frac{(\text{total fila }i)(\text{total columna }j)}{n}\qquad gl=(r-1)(c-1)\]</div>
<p>La razón: bajo independencia, \(P(A_i\cap B_j)=P(A_i)P(B_j)\), estimadas con las proporciones marginales. La <b>V de Cramér</b>, \(\sqrt{\chi^2/[n(\min(r,c)-1)]}\), mide la fuerza de la asociación.</p></section>
<section><h3>Condiciones</h3><ul><li>Frecuencias esperadas de al menos 5 en cada celda (o en el 80 % y ninguna menor que 1). Si no, se agrupan categorías o se usa la prueba exacta de Fisher.</li><li>Observaciones independientes; cada unidad cuenta en una sola celda.</li><li>Se trabaja con frecuencias, nunca con porcentajes.</li></ul></section>
${LAB}`,
qs:[{q:"Una tabla de 3 × 4 da χ² = 14,2. ¿Se rechaza la independencia al 5 %?",a:"gl = 2·3 = 6 y el crítico es 12,59: como 14,2 > 12,59, se rechaza la independencia."}]},

{id:"regresion", parte:"Unidad 5 · Regresión lineal múltiple", t:"El modelo de regresión múltiple y MCO", sim:"reg", html:String.raw`
<section><h3>Correlación lineal</h3><p class="lead">El coeficiente de correlación \(r=\frac{\sum(x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2\sum(y_i-\bar y)^2}}\in[-1,1]\) mide la fuerza de la relación <i>lineal</i>. Para probar \(H_0:\rho=0\) se usa \(t=\frac{r\sqrt{n-2}}{\sqrt{1-r^2}}\sim t_{n-2}\). Correlación no es causalidad.</p></section>
<section><h3>El modelo y sus supuestos</h3>
<div class="mj">\[y_i=\beta_0+\beta_1x_{i1}+\dots+\beta_{k-1}x_{i,k-1}+u_i\qquad\Longleftrightarrow\qquad y=X\beta+u\]</div>
<ol><li>Linealidad en los parámetros.</li><li>\(X\) de rango completo \(k\) (no hay multicolinealidad perfecta).</li><li>\(E(u\mid X)=0\) (exogeneidad).</li><li>\(V(u\mid X)=\sigma^2I\): homocedasticidad y no autocorrelación.</li><li>(Para inferencia exacta) \(u\sim N(0,\sigma^2I)\).</li></ol></section>
<section><h3>Mínimos cuadrados ordinarios</h3>
<p>Se minimiza la suma de residuos al cuadrado \(S(\beta)=(y-X\beta)'(y-X\beta)\). La condición de primer orden da las <b>ecuaciones normales</b>:</p>
<div class="mj">\[\frac{\partial S}{\partial\beta}=-2X'y+2X'X\beta=0\quad\Longrightarrow\quad X'X\hat\beta=X'y\quad\Longrightarrow\quad\hat\beta=(X'X)^{-1}X'y\]</div></section>
<section><h3>Geometría</h3>
<p>\(\hat y=X\hat\beta=Py\) con \(P=X(X'X)^{-1}X'\) es la <b>proyección ortogonal</b> de \(y\) sobre el espacio columna de \(X\); el residuo \(e=(I-P)y=My\) es perpendicular a ese espacio: \(X'e=0\). Consecuencias: con intercepto, \(\sum e_i=0\) y \(\bar{\hat y}=\bar y\); y \(y'y=\hat y'\hat y+e'e\).</p></section>
<section><h3>Propiedades del estimador</h3>
<div class="mj">\[E(\hat\beta)=\beta\qquad V(\hat\beta)=\sigma^2(X'X)^{-1}\qquad s^2=\frac{e'e}{n-k},\;E(s^2)=\sigma^2\]</div>
<p><b>Teorema de Gauss-Markov:</b> bajo los supuestos 1 a 4, \(\hat\beta\) es el mejor estimador lineal insesgado (MELI): cualquier otro lineal e insesgado tiene una matriz de varianzas mayor. Con normalidad, \(\hat\beta\sim N(\beta,\sigma^2(X'X)^{-1})\) y \(\frac{(n-k)s^2}{\sigma^2}\sim\chi^2_{n-k}\), independientes: de ahí las pruebas t y F.</p></section>
<section><h3>Máxima verosimilitud</h3>
<div class="mj">\[\ln L(\beta,\sigma^2)=-\frac n2\ln(2\pi\sigma^2)-\frac{(y-X\beta)'(y-X\beta)}{2\sigma^2}\;\Rightarrow\;\hat\beta_{MV}=\hat\beta_{MCO},\quad\hat\sigma^2_{MV}=\frac{e'e}{n}\]</div>
<p>El EMV de \(\sigma^2\) es sesgado (divide por \(n\)) pero consistente.</p></section>
${LAB}`,
qs:[{q:"¿Qué supuesto se viola si una variable es combinación lineal exacta de otras?",a:"El de rango completo: X′X no es invertible y β̂ no se puede calcular (multicolinealidad perfecta)."},{q:"¿Por qué con intercepto los residuos suman cero?",a:"Porque X′e = 0 y la primera columna de X es un vector de unos: 1′e = Σeᵢ = 0."}]},

{id:"anovareg", parte:"Unidad 5 · Regresión lineal múltiple", t:"Análisis de varianza, bondad de ajuste y pruebas", sim:"reg", html:String.raw`
<section><h3>Descomposición de la variación</h3>
<div class="mj">\[\underbrace{\sum(y_i-\bar y)^2}_{SCT}=\underbrace{\sum(\hat y_i-\bar y)^2}_{SCE}+\underbrace{\sum e_i^2}_{SCR}\qquad R^2=\frac{SCE}{SCT}=1-\frac{SCR}{SCT}\qquad\bar R^2=1-\frac{SCR/(n-k)}{SCT/(n-1)}\]</div>
<p>\(R^2\) es la fracción de la variación de \(y\) explicada por el modelo; nunca baja al agregar regresores. \(\bar R^2\) penaliza los que no aportan y puede bajar.</p></section>
<section><h3>Tabla ANOVA y prueba F global</h3>
<div class="tbl"><table><tr><th>Fuente</th><th>SC</th><th>gl</th><th>CM</th><th>F</th></tr><tr><td>Regresión</td><td>SCE</td><td>\(k-1\)</td><td>SCE/(k − 1)</td><td>\(\frac{SCE/(k-1)}{SCR/(n-k)}\)</td></tr><tr><td>Residuos</td><td>SCR</td><td>\(n-k\)</td><td>\(s^2\)</td><td></td></tr><tr><td>Total</td><td>SCT</td><td>\(n-1\)</td><td></td><td></td></tr></table></div>
<p>\(H_0:\beta_1=\dots=\beta_{k-1}=0\). Equivalente: \(F=\frac{R^2/(k-1)}{(1-R^2)/(n-k)}\).</p></section>
<section><h3>Pruebas sobre los coeficientes</h3>
<ul><li><b>Individual:</b> \(t=\frac{\hat\beta_j-\beta_j^0}{\text{ee}(\hat\beta_j)}\sim t_{n-k}\), con \(\text{ee}(\hat\beta_j)=\sqrt{s^2[(X'X)^{-1}]_{jj}}\).</li>
<li><b>Restricciones lineales</b> \(R\beta=r\) (\(q\) restricciones): se estima el modelo restringido y \(F=\frac{(SCR_R-SCR_{NR})/q}{SCR_{NR}/(n-k)}\sim F_{q,n-k}\). Con \(q=1\), \(F=t^2\).</li>
<li><b>Intervalo para \(\beta_j\):</b> \(\hat\beta_j\pm t_{\alpha/2,n-k}\,\text{ee}(\hat\beta_j)\).</li></ul>
<p class="link">Econometría I retoma estas pruebas en forma matricial (Wald, LR y LM), con variables dummy, regresión restringida y diagnóstico de los supuestos.</p></section>
${LAB}`,
qs:[{q:"Con n = 30, k = 4 y R² = 0,60, ¿cuánto vale la F global?",a:"F = (0,60/3)/(0,40/26) = 13,0, con (3, 26) gl: muy significativa."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"tablas",t:"Tablas de distribuciones",anchor:"pruebas",links:["muestreo","pruebas","avanzadas","icgen"],sim:"tab",html:WSBOX,
  d:"Reemplaza las tablas impresas: valores críticos y p-valores de la normal, la t, la ji cuadrado y la F para cualquier nivel de significancia y grados de libertad."},
 {id:"formulas",t:"Hoja de fórmulas",anchor:"anovareg",links:["muestreo","convergencia","cramer","icgen","neyman","regresion"],sim:"hoja2",html:WSBOX,
  d:"Todas las fórmulas del programa en una tabla con buscador, para repasar antes de cada parcial."}
];
const ALIAS={};
