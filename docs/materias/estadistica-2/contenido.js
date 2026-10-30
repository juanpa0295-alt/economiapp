// Estadística 2 · contenido de la ruta (módulos de Economiapp + ramas nuevas)
// =====================================================================
// CONTENIDO. El tronco son los cuatro módulos de Economiapp, en el mismo orden.
// Campos: id, t (título), html, qs [{q,a}], deep [{k,t,html,n}], py (código de la app), sim (laboratorio), nuevo
// n:true o nuevo:true marca material que no estaba en Economiapp.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"estimadores", t:"Estimadores y sus propiedades", sim:"estim", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Un <b>estimador</b> es una regla que convierte una muestra en un número para aproximar un parámetro desconocido \(\theta\) de la población. La media muestral \(\bar{x}\) es un estimador de \(\mu\); el número que sale con tus datos, por ejemplo 48,5, es la <b>estimación</b>. Como la muestra es aleatoria, el estimador \(\hat\theta\) también es una variable aleatoria: cambia de una muestra a otra y tiene su propia distribución.</p></section>
<p class="link"><b>Propiedades frente a métodos.</b> La insesgadez y la consistencia son <i>propiedades</i> que miden la calidad de un estimador. El método de momentos y la máxima verosimilitud son <i>métodos</i> para encontrarlo; están en las ramas de esta estación.</p>
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

{id:"intervalos", t:"Intervalos y tamaño de muestra", sim:"ic", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Una estimación puntual casi nunca es exacta. Un <b>intervalo de confianza</b> le agrega un margen de error: un rango construido de forma que, en el \((1-\alpha)\) de las muestras posibles, contenga el verdadero parámetro. El <b>tamaño de muestra</b> responde la pregunta inversa: cuántos datos necesito para que el margen no pase de un valor \(E\).</p></section>
<section><h3>Los dos modelos</h3>
<div class="mj">\[IC = \bar{x} \pm Z_{\alpha/2}\,\frac{\sigma}{\sqrt{n}} \qquad\qquad n = \left(\frac{Z_{\alpha/2} \cdot \sigma}{E}\right)^2\]</div>
<div class="tbl"><table><tr><th>Confianza</th><th>α</th><th>\(Z_{\alpha/2}\)</th></tr>
<tr><td>90 %</td><td class="num">0,10</td><td class="num">1,645</td></tr><tr><td>95 %</td><td class="num">0,05</td><td class="num">1,960</td></tr><tr><td>99 %</td><td class="num">0,01</td><td class="num">2,576</td></tr></table></div>
<p>El tamaño de muestra se redondea siempre hacia arriba: 34,6 observaciones son 35.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> decir que hay 95 % de probabilidad de que \(\mu\) esté en el intervalo que calculaste. \(\mu\) es fijo; lo aleatorio es el intervalo. El 95 % describe el procedimiento: de cada 100 muestras, unas 95 producen intervalos que contienen a \(\mu\). La rama «Qué significa 95 % de confianza» lo muestra con una simulación.</p>`,
deep:[
{k:"Derivación",t:"De dónde sale la fórmula de n",html:String.raw`<p>El margen de error es la mitad del ancho del intervalo. Se iguala al margen deseado y se despeja \(n\):</p><div class="mj">\[E = Z_{\alpha/2}\frac{\sigma}{\sqrt n}\;\Longrightarrow\;\sqrt n=\frac{Z_{\alpha/2}\,\sigma}{E}\;\Longrightarrow\; n=\left(\frac{Z_{\alpha/2}\,\sigma}{E}\right)^2\]</div><p>Como \(n\) depende de \(1/E^2\), reducir el margen a la mitad exige cuatro veces más datos.</p>`},
{k:"Ampliación",n:true,t:"Si σ es desconocida: t de Student",html:String.raw`<p>Cuando no conoces \(\sigma\) la reemplazas por la desviación muestral \(s\), y la normal por una t con \(n-1\) grados de libertad, que tiene colas más gruesas:</p><div class="mj">\[IC = \bar{x} \pm t_{\alpha/2,\,n-1}\,\frac{s}{\sqrt{n}}\]</div><div class="tbl"><table><tr><th>n</th><th>\(t_{0{,}025}\)</th><th>Frente a Z = 1,960</th></tr><tr><td class="num">10</td><td class="num">2,262</td><td>15 % más ancho</td></tr><tr><td class="num">30</td><td class="num">2,045</td><td>4 % más ancho</td></tr><tr><td class="num">100</td><td class="num">1,984</td><td>Casi igual</td></tr></table></div><p>Por eso con muestras grandes se suele usar Z aunque \(\sigma\) sea desconocida.</p>`},
{k:"Ampliación",n:true,t:"Intervalo y tamaño de muestra para una proporción",html:String.raw`<div class="mj">\[IC = \hat p \pm Z_{\alpha/2}\sqrt{\frac{\hat p(1-\hat p)}{n}} \qquad\qquad n=\frac{Z_{\alpha/2}^2\,p(1-p)}{E^2}\]</div><p>Si no tienes idea de \(p\), usa \(p=0{,}5\), que da el \(n\) más grande posible. Ejemplo de encuesta al 95 % con margen de 3 puntos: \(n=1{,}96^2\cdot 0{,}25/0{,}03^2=1.067{,}1\), es decir, 1.068 personas.</p>`}],
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

{id:"pruebas", t:"Pruebas de hipótesis", sim:"prueba", html:String.raw`
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
{k:"Ampliación",n:true,t:"Errores tipo I y tipo II",html:String.raw`<div class="tbl"><table><tr><th></th><th>\(H_0\) es cierta</th><th>\(H_0\) es falsa</th></tr><tr><td>Rechazas \(H_0\)</td><td class="bad">Error tipo I (prob. \(\alpha\))</td><td class="ok">Acierto (potencia \(1-\beta\))</td></tr><tr><td>No rechazas \(H_0\)</td><td class="ok">Acierto</td><td class="bad">Error tipo II (prob. \(\beta\))</td></tr></table></div><p>Bajar \(\alpha\) hace más difícil rechazar, y eso aumenta \(\beta\). La única forma de bajar los dos a la vez es aumentar \(n\). La rama «Potencia de una prueba» lo muestra.</p>`},
{k:"Detalle",n:true,t:"Por qué la proporción usa p₀ en la prueba y p̂ en el intervalo",html:String.raw`<p>En la prueba se supone que \(H_0\) es cierta, así que la varianza de \(\hat p\) se calcula con el valor hipotético: \(p_0(1-p_0)/n\). En el intervalo no hay hipótesis, así que se usa lo observado: \(\hat p(1-\hat p)/n\). Tu código hace exactamente eso, y por eso la dualidad con el intervalo en proporciones es aproximada.</p>`}],
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

{id:"avanzadas", t:"Pruebas de hipótesis avanzadas", sim:"avanz", html:String.raw`
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
{k:"Intuición",t:"Por qué se agrupa p*",html:String.raw`<p>Con \(d_0=0\), \(H_0\) dice que \(p_1=p_2\). Si las dos proporciones son iguales, la mejor estimación de ese valor común junta los éxitos de ambas muestras: eso es \(p^*\).</p><p><span class="tag nw">Nuevo</span> Si usas \(d_0\neq 0\), \(H_0\) ya no dice que las proporciones sean iguales, y lo usual es no agrupar: \(\sqrt{\hat p_1(1-\hat p_1)/n_1+\hat p_2(1-\hat p_2)/n_2}\). El laboratorio conserva la versión agrupada de Economiapp.</p>`},
{k:"Práctica",n:true,t:"Leer la tabla F por la cola izquierda",html:String.raw`<p>Muchas tablas F solo traen la cola derecha. El valor crítico de la izquierda sale invirtiendo los grados de libertad:</p><div class="mj">\[F_{\alpha}(a,b)=\frac{1}{F_{1-\alpha}(b,a)}\]</div><p>Por eso es común poner arriba la varianza más grande: así el estadístico queda mayor que 1 y basta la cola derecha.</p>`}],
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
 {q:"En el cociente de varianzas, ¿cambia la decisión de dos colas si inviertes qué muestra va arriba?",a:String.raw`No. El estadístico pasa a ser \(1/F_c\) y los grados de libertad se invierten, pero el p-valor de dos colas es el mismo. Cambia solo cuál cola usas.`}]}
];

const BRANCHES=[
{g:"Métodos de estimación", from:"estimadores", items:[
 {id:"momentos", t:"Método de momentos", html:String.raw`
<section><h3>La idea</h3><p class="lead">Igualar los momentos teóricos de la población con los momentos de la muestra, y despejar los parámetros desconocidos.</p>
<div class="mj">\[M_k=\frac1n\sum_{i=1}^n X_i^k\quad\text{(momento muestral de orden }k)\]</div></section>
<section><h3>Demostración para la distribución normal</h3><ol class="steps">
<li><b>Primer momento, para hallar \(\mu\).</b> Se iguala \(E[X]\) con \(M_1\):<div class="mj">\[E[X] = \mu \quad \text{y} \quad M_1 = \frac{1}{n} \sum_{i=1}^n X_i \;\Longrightarrow\; \hat{\mu}_{MM} = \bar{X}\]</div></li>
<li><b>Segundo momento, para hallar \(\sigma^2\).</b> Por definición \(V(X) = E[X^2] - (E[X])^2\), así que \(E[X^2] = \sigma^2 + \mu^2\). Se iguala con \(M_2\):<div class="mj">\[\sigma^2 + \mu^2 = \frac{1}{n} \sum_{i=1}^n X_i^2\]</div></li>
<li><b>Despejar.</b> Se reemplaza \(\mu\) por el estimador que ya se encontró:<div class="mj">\[\hat{\sigma}^2_{MM} = \left( \frac{1}{n} \sum_{i=1}^n X_i^2 \right) - \bar{X}^2 = \frac{1}{n} \sum_{i=1}^n (X_i - \bar{X})^2 \quad \blacksquare\]</div></li></ol>
<p class="warn"><b>Ojo:</b> el método de momentos entrega el estimador <b>sesgado</b> de la varianza, porque divide por \(n\) y no por \(n-1\).</p></section>
<section><h3>Otro ejemplo: uniforme en \([0,\theta]\) <span class="tag nw">Nuevo</span></h3>
<p>Como \(E[X]=\theta/2\), igualar con \(\bar X\) da \(\hat\theta_{MM}=2\bar X\). Es insesgado, pero puede dar absurdos: con la muestra 1, 2 y 9, \(\hat\theta=8\), menor que el 9 que sí se observó. Máxima verosimilitud usa \(\hat\theta=\max X_i\) y nunca cae en eso.</p></section>`,
 qs:[{q:"Si X sigue una Poisson(λ), ¿cuál es el estimador de λ por momentos?",a:String.raw`Como \(E[X]=\lambda\), se iguala con el primer momento muestral: \(\hat\lambda_{MM}=\bar X\).`}]},
 {id:"verosimilitud", t:"Máxima verosimilitud", sim:"mle", html:String.raw`
<section><h3>La idea</h3><p class="lead">Buscar los valores de los parámetros que hacen más probable haber obtenido exactamente la muestra que observamos.</p></section>
<section><h3>Demostración para la distribución normal</h3><ol class="steps">
<li><b>Función de verosimilitud.</b> Como las observaciones son independientes, la probabilidad conjunta es el producto de las densidades:<div class="mj">\[L(\mu, \sigma^2) = \prod_{i=1}^n \frac{1}{\sqrt{2\pi\sigma^2}} e^{-\frac{(x_i - \mu)^2}{2\sigma^2}} = (2\pi\sigma^2)^{-n/2} \, e^{-\frac{1}{2\sigma^2} \sum_{i=1}^n (x_i - \mu)^2}\]</div></li>
<li><b>Log-verosimilitud.</b> Maximizar \(L\) es lo mismo que maximizar \(\ln L\), y el logaritmo convierte el producto en una suma fácil de derivar:<div class="mj">\[\ln L = -\frac{n}{2} \ln(2\pi) - \frac{n}{2} \ln(\sigma^2) - \frac{1}{2\sigma^2} \sum_{i=1}^n (x_i - \mu)^2\]</div></li>
<li><b>Maximizar respecto a \(\mu\).</b> Condición de primer orden:<div class="mj">\[\frac{\partial \ln L}{\partial \mu} = \frac{1}{\sigma^2} \sum_{i=1}^n (x_i - \mu) = 0 \;\Longrightarrow\; \hat{\mu}_{MLE} = \frac{\sum x_i}{n} = \bar{x}\]</div></li>
<li><b>Maximizar respecto a \(\sigma^2\).</b> Se trata \(\sigma^2\) como una sola variable:<div class="mj">\[\frac{\partial \ln L}{\partial \sigma^2} = -\frac{n}{2\sigma^2} + \frac{1}{2(\sigma^2)^2} \sum_{i=1}^n (x_i - \mu)^2 = 0 \;\Longrightarrow\; \hat{\sigma}^2_{MLE} = \frac{1}{n} \sum_{i=1}^n (x_i - \bar{x})^2 \quad\blacksquare\]</div><p>Igual que momentos, máxima verosimilitud entrega el estimador <b>sesgado</b> de la varianza.</p></li></ol></section>
${LAB}`,
 deep:[{k:"Comparación",n:true,t:"Momentos frente a máxima verosimilitud",html:String.raw`<div class="tbl"><table><tr><th></th><th>Momentos</th><th>Máxima verosimilitud</th></tr><tr><td>Qué necesita</td><td>Solo los momentos teóricos</td><td>La distribución completa</td></tr><tr><td>Cálculo</td><td>Casi siempre fácil</td><td>A veces requiere métodos numéricos</td></tr><tr><td>En muestras grandes</td><td>Consistente</td><td>Consistente y con la menor varianza posible</td></tr><tr><td>En la normal</td><td colspan="2">Coinciden: \(\bar x\) y \(\frac1n\sum(x_i-\bar x)^2\)</td></tr></table></div>`}],
 qs:[{q:"¿Por qué se maximiza ln L y no directamente L?",a:"El logaritmo es una función creciente, así que el máximo está en el mismo punto. Además convierte el producto en una suma, que es mucho más fácil de derivar."}]}]},
{g:"Confianza", from:"intervalos", items:[
 {id:"cobertura", t:"Qué significa 95 % de confianza", nuevo:true, sim:"cob", html:String.raw`
<section><h3>La idea</h3><p class="lead">La confianza no es una propiedad de un intervalo, sino del procedimiento. Si repites el muestreo muchas veces, el \((1-\alpha)\) de los intervalos contendrá a \(\mu\) y el resto no, aunque nunca sabrás cuál de los dos te tocó.</p></section>
${LAB}
<p>Cada línea es el intervalo de una muestra distinta de la misma población, con \(\mu = 100\) y \(\sigma = 15\). Las rojas no contienen a \(\mu\). Cambia el nivel de confianza y mira cómo se alargan los intervalos y cuántos fallan.</p>`,
 qs:[{q:"Si construyes 200 intervalos al 90 %, ¿cuántos esperas que no contengan a μ?",a:"Alrededor de 20, el 10 %. En cada repetición el número exacto varía."}]}]},
{g:"Más allá del p-valor", from:"pruebas", items:[
 {id:"potencia", t:"Potencia de una prueba", nuevo:true, sim:"pot", html:String.raw`
<section><h3>La idea</h3><p class="lead">La potencia es la probabilidad de rechazar \(H_0\) cuando de verdad es falsa: \(1-\beta\). Una prueba con poca potencia casi nunca detecta diferencias, aunque existan.</p>
<div class="mj">\[\text{Cola derecha:}\quad 1-\beta = 1-\Phi\!\left(\frac{c-\mu_1}{\sigma/\sqrt n}\right),\qquad c=\mu_0+Z_{1-\alpha}\frac{\sigma}{\sqrt n}\]</div></section>
${LAB}
<p>La curva gris es la distribución de \(\bar x\) si \(H_0\) es cierta (\(\mu_0 = 50\)); la de color, si la media verdadera es \(\mu_1\). El área roja es \(\alpha\) y la ámbar es \(\beta\).</p>`,
 qs:[{q:"¿Qué aumenta la potencia de una prueba?",a:String.raw`Cuatro cosas: más observaciones \(n\), una diferencia mayor entre \(\mu_1\) y \(\mu_0\), menos dispersión \(\sigma\) y un \(\alpha\) más grande. Solo las dos primeras dependen del diseño del estudio sin aceptar más error tipo I.`}]}]},
{g:"Dos poblaciones", from:"avanzadas", items:[
 {id:"welch", t:"Diferencia de medias (Welch)", nuevo:true, sim:"welch", html:String.raw`
<section><h3>La idea</h3><p class="lead">Es la fórmula general que ya trae el JSON de este módulo en Economiapp, pero que la app no calculaba: comparar los promedios de dos grupos independientes cuando las varianzas son desconocidas y posiblemente distintas.</p>
<div class="mj">\[t = \frac{(\bar{x}_1 - \bar{x}_2) - (\mu_1 - \mu_2)}{\sqrt{\frac{S_1^2}{n_1} + \frac{S_2^2}{n_2}}}\]</div>
<p>Los grados de libertad salen de la aproximación de Welch-Satterthwaite y casi nunca son enteros:</p>
<div class="mj">\[gl=\frac{\left(\frac{S_1^2}{n_1}+\frac{S_2^2}{n_2}\right)^2}{\frac{(S_1^2/n_1)^2}{n_1-1}+\frac{(S_2^2/n_2)^2}{n_2-1}}\]</div></section>
${LAB}
<p class="link">Los tamaños de muestra por defecto, 40 y 45, son los del JSON de Economiapp. Las medias y varianzas son un ejemplo.</p>`,
 qs:[{q:"¿Cuándo conviene la versión con varianza agrupada en lugar de Welch?",a:"Solo si tienes buenas razones para creer que las varianzas son iguales, por ejemplo porque la prueba F del cociente no la rechaza. Welch funciona bien en los dos casos, por eso hoy es la opción por defecto."}]}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"tablas",t:"Tablas de distribuciones",anchor:"pruebas",links:["pruebas","avanzadas","intervalos"],sim:"tab",html:WSBOX,
  d:"Reemplaza las tablas impresas: valores críticos y p-valores de la normal, la t, la ji cuadrado y la F para cualquier nivel de significancia y grados de libertad."}
];
