
// =====================================================================
// CAMBIO ESTRUCTURAL A FONDO: solo teoría. Los ejercicios viven en eco/talleres.js y
// cada lección muestra sola los puntos de su tema (bloque «En los talleres»).
// =====================================================================
BRANCHES.push({g:"Cambio estructural a fondo", from:"chow", items:[
{id:"ce-metodo", t:"Cómo reconocer qué prueba pide un ejercicio", html:String.raw`
<section><h3>Primero: ¿qué te da el enunciado?</h3>
<p class="lead">Todos los ejercicios de cambio estructural se resuelven con la misma prueba F; lo que cambia es cómo se obtienen las SCR. Mira qué trae el enunciado y usa la herramienta que corresponde.</p>
<div class="tbl"><table><tr><th>El ejercicio da…</th><th>Qué haces</th><th>Herramienta</th></tr>
<tr><td>La tabla de datos o un archivo</td><td>Estimas el restringido, cada submuestra y el modelo con dummies</td><td><button class="btn" type="button" data-go="t-datos">Laboratorio de datos</button></td></tr>
<tr><td>X′X, X′y y y′y</td><td>b = (X′X)⁻¹X′y y SCR = y′y − b′X′y en cada muestra; para el restringido se suman las matrices</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · X′X, X′y, y′y</td></tr>
<tr><td>Las SCR, o s, o R² con la STC</td><td>SCR = s²(n − k) o (1 − R²)·STC, y la F con m submuestras</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · SCR, s o R²</td></tr>
<tr><td>Un modelo con dummies ya estimado</td><td>Escribes una ecuación por grupo, interpretas los δ y haces las pruebas t</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · Modelo estimado</td></tr>
<tr><td>Un modelo restringido y uno no restringido</td><td>W, LR y LM con las dos SCR</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · Wald, LR y LM</td></tr>
<tr><td>Solo hay que plantear, interpretar o demostrar</td><td>Defines la dummy, escribes la ecuación de cada grupo o desarrollas el álgebra</td><td>Lápiz y papel; mira el punto parecido del taller</td></tr></table></div></section>
<section><h3>Las fórmulas que usa el curso</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Distribución</th></tr>
<tr><td>Chow (dos submuestras)</td><td>\(F=\dfrac{(SCR_R-SCR_1-SCR_2)/k}{(SCR_1+SCR_2)/(n-2k)}\)</td><td>\(F(k,\,n-2k)\)</td></tr>
<tr><td>Chow con m submuestras</td><td>\(F=\dfrac{(SCR_R-\sum SCR_j)/[(m-1)k]}{\sum SCR_j/(n-mk)}\)</td><td>\(F((m-1)k,\,n-mk)\)</td></tr>
<tr><td>Pronósticos de Chow</td><td>\(F=\dfrac{(SCR_R-SCR_1)/n_2}{SCR_1/(n_1-k)}\)</td><td>\(F(n_2,\,n_1-k)\)</td></tr>
<tr><td>Con R² (misma Y)</td><td>\(F=\dfrac{(R^2_{NR}-R^2_R)/q}{(1-R^2_{NR})/(n-k_{NR})}\)</td><td>\(F(q,\,n-k_{NR})\)</td></tr>
<tr><td>Forma matricial</td><td>\(F=\dfrac{(R\mathbf b-\mathbf r)'[R(X'X)^{-1}R']^{-1}(R\mathbf b-\mathbf r)}{q\,s^2}\)</td><td>\(F(q,\,n-k_{NR})\)</td></tr></table></div>
<p class="warn"><b>k cuenta el intercepto.</b> En un modelo simple k = 2, así que con dos submuestras los grados de libertad son (2, n − 4).</p></section>
<section><h3>La redacción que piden</h3>
<ol class="steps"><li><b>Modelo no restringido</b> (con dummies o una ecuación por submuestra) y <b>restringido</b> (una sola ecuación).</li><li><b>Hipótesis:</b> H₀: δ₁ = δ₂ = 0 (no hay cambio estructural) frente a H₁: algún δ ≠ 0.</li><li><b>Estadístico</b> con los números sustituidos y su distribución.</li><li><b>Valor crítico</b> o p-valor al nivel pedido.</li><li><b>Decisión y lectura económica:</b> qué significa que la función cambie (o no) entre periodos o grupos.</li></ol></section>`},
{id:"ce-pronosticos", t:"Prueba de pronósticos de Chow", html:String.raw`
<section><h3>Cuándo se usa</h3>
<p class="lead">Cuando la segunda submuestra es muy pequeña para estimarla por separado (n₂ ≤ k), o cuando la pregunta es si el modelo estimado con los datos anteriores <b>pronostica bien</b> los posteriores.</p></section>
<section><h3>La idea</h3>
<p>Se estima el modelo solo con la muestra 1, \(\mathbf b_1=(X_1'X_1)^{-1}X_1'\mathbf y_1\), y se pronostica la muestra 2 con esos coeficientes. El vector de errores de pronóstico es \(\mathbf d=\mathbf y_2-X_2\mathbf b_1\). Si los parámetros no cambiaron, d tiene media cero y varianza \(\sigma^2[I+X_2(X_1'X_1)^{-1}X_2']\): errores grandes indican cambio.</p></section>
<section><h3>Las dos formas del estadístico</h3>
<div class="mj">\[(8)\quad F=\frac{(SCR_R-SCR_1)/n_2}{SCR_1/(n_1-k)}\qquad\qquad(9)\quad F=\frac{\mathbf d'\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]^{-1}\mathbf d}{n_2\,s_1^2}\]</div>
<p>Las dos se distribuyen \(F(n_2,\,n_1-k)\) y dan el mismo número. La (8) solo necesita dos regresiones: toda la muestra y la muestra 1. La (9) muestra de dónde sale la prueba y con n₂ = 1 se reduce a \(d^2/\{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]\}\).</p>
<p class="link">El ejemplo resuelto de abajo es la demostración de la media y la varianza de d (punto 1 de los Ejercicios propuestos 3).</p></section>`},
{id:"ce-recursivos", t:"Coeficientes recursivos, errores un paso adelante y CUSUM", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En vez de escoger un punto de quiebre, se estima el modelo una y otra vez agregando una observación cada vez: con las primeras k + 1, luego k + 2, y así hasta n. Si los coeficientes cambian, se nota en la trayectoria.</p></section>
<section><h3>Los tres gráficos</h3>
<ol class="steps"><li><b>Coeficientes recursivos:</b> \(\mathbf b_t=(X_t'X_t)^{-1}X_t'\mathbf y_t\) con las primeras t observaciones, con bandas de ±2 errores estándar. Un salto fuera de la banda indica cambio.</li>
<li><b>Errores de predicción un paso adelante:</b> \(e_{t+1}=y_{t+1}-\mathbf x_{t+1}'\mathbf b_t\), con varianza \(\sigma^2[1+\mathbf x_{t+1}'(X_t'X_t)^{-1}\mathbf x_{t+1}]\). Si un error queda fuera de ±2 desviaciones, el modelo no anticipó esa observación.</li>
<li><b>Residuos recursivos y CUSUM:</b> \(w_t=e_t/\sqrt{1+\mathbf x_t'(X_{t-1}'X_{t-1})^{-1}\mathbf x_t}\). La suma acumulada \(W_t=\sum w_j/\hat\sigma\) debe quedar dentro de las bandas \(\pm0{,}948\sqrt{T}\,(1+2t/T)\) al 5 %.</li></ol>
<p>El <button class="btn" type="button" data-go="t-datos">Laboratorio de datos</button> dibuja los tres gráficos con tu base (sección 4, Recursivos).</p></section>
<section><h3>En R</h3>
<pre class="ce-code">library(readxl); library(strucchange)
datos &lt;- read_excel("mis_datos.xlsx")   # o read.csv("mis_datos.csv")
m &lt;- lm(Y ~ X, data = datos)
n &lt;- nrow(datos); k &lt;- 2
# coeficientes recursivos con bandas de ±2 errores estándar
b  &lt;- t(sapply((k + 1):n, function(t) coef(lm(Y ~ X, data = datos[1:t, ]))))
se &lt;- t(sapply((k + 1):n, function(t) coef(summary(lm(Y ~ X, data = datos[1:t, ])))[, 2]))
plot((k + 1):n, b[, 2], type = "b", ylim = range(b[, 2] - 2 * se[, 2], b[, 2] + 2 * se[, 2]))
lines((k + 1):n, b[, 2] + 2 * se[, 2], lty = 2); lines((k + 1):n, b[, 2] - 2 * se[, 2], lty = 2)
rr &lt;- recresid(m)                                   # residuos recursivos
plot(efp(Y ~ X, data = datos, type = "Rec-CUSUM"))    # CUSUM con bandas
sctest(efp(Y ~ X, data = datos, type = "Rec-CUSUM"))</pre></section>`},
{id:"ce-dummies", t:"Forma matricial del cambio estructural y ecuaciones (27) y (28)", html:String.raw`
<section><h3>El modelo con dummies en matrices</h3>
<p>Con \(D_t=0\) en las primeras \(n_1\) observaciones y 1 en las demás, el modelo no restringido \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\mu_t\) en bloques es</p>
<div class="mj">\[\mathbf y=\begin{bmatrix}X_1&\mathbf 0\\X_2&X_2\end{bmatrix}\begin{bmatrix}\boldsymbol\beta\\ \boldsymbol\delta\end{bmatrix}+\boldsymbol\mu,\qquad H_0:\boldsymbol\delta=\mathbf 0\iff R=[\,0_{k\times k}\;|\;I_k\,],\;\mathbf r=\mathbf 0\]</div>
<p>Solo intercepto: R escoge δ₁ (q = 1). Solo pendientes: R escoge δ₂, …, δ_k (q = k − 1). Los puntos 9 a 11 de los Ejercicios propuestos 3 piden escribir esto con todos los elementos.</p></section>
<section><h3>Por qué SCR_NR = SCR₁ + SCR₂ (ecuaciones 27 y 28)</h3>
<p>El modelo con todas las interacciones permite un intercepto y unas pendientes distintos en cada grupo: para D = 0 la ecuación es \(\beta_1+\beta_2X\) y para D = 1 es \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\). Como ningún parámetro se comparte, minimizar la SCR total equivale a minimizar por separado la de cada grupo. Por eso los β son los de la regresión del grupo 1 (27), los β + δ los del grupo 2, y la SCR es la suma (28).</p>
<p>En matrices: \(X'X=\begin{bmatrix}X_1'X_1+X_2'X_2&X_2'X_2\\X_2'X_2&X_2'X_2\end{bmatrix}\). Al resolver las ecuaciones normales se obtiene \(\mathbf b_\beta=(X_1'X_1)^{-1}X_1'\mathbf y_1\) y \(\mathbf b_\beta+\mathbf b_\delta=(X_2'X_2)^{-1}X_2'\mathbf y_2\).</p></section>`}]});

// ---------- Herramientas: dos para resolver y tres para entender
WORKSHOPS.push({id:"t-datos",t:"Laboratorio de datos",anchor:"mco-matricial",links:["datos","mco-matricial","inferencia","chow","hetero","autocorr"],sim:"datos",html:`<div class="sim" id="sim"></div>`,d:""});
WORKSHOPS.splice(0,WORKSHOPS.length,...(function(){
  const by=id=>WORKSHOPS.find(w=>w.id===id), out=[];
  const calc=Object.assign(by("t-calc"),{t:"Calculadora de ejercicios",anchor:"chow",sim:"calc",html:`<div class="sim" id="sim"></div>`,
    links:["inferencia","chow","ce-metodo","ce-pronosticos","dicotomicas"],
    d:"Para los enunciados que no traen la tabla de datos sino resultados: matrices X′X, X′y y y′y, sumas de cuadrados, s o R², un modelo con dummies ya estimado, o un modelo restringido y otro no restringido. Da el procedimiento completo con los números sustituidos, el valor crítico, el p-valor y la decisión: Chow con dos o más submuestras, pronósticos de Chow, pruebas t de dummies, Wald, LR y LM, F general, igualdad de varianzas, Breusch-Pagan y Durbin-Watson."});
  out.push(by("t-datos"),calc);
  ["t-matrices","t-geometria","t-plano"].forEach(id=>{const w=by(id);if(w){w.grp="ver";out.push(w)}});
  return out})());
Object.assign(WORKSHOPS.find(w=>w.id==="t-datos"),{t:"Laboratorio de datos",
  d:"Para los ejercicios que traen una tabla de datos o un archivo (CSV o Excel). Estadísticas y correlaciones, variables nuevas (logaritmos, rezagos, dummies de quiebre, interacciones), MCO con errores robustos y pronóstico con intervalos, y pruebas: F, Chow por fila o por grupo con todas sus alternativas y los pronósticos de Chow, coeficientes recursivos y CUSUM, heterocedasticidad, autocorrelación, normalidad, RESET y VIF. También las demostraciones con tus números y el código R. Trae cargadas las bases de los talleres, y los datos no salen de tu navegador."});
// Enlaces viejos que apuntaban a lo que se reorganizó
const ALIAS={"t-cambio":"t-calc","ce-resueltos":"tl-ep3","ce-interpretar":"tl-ep3","tl-t1":"tl-ep3"};
