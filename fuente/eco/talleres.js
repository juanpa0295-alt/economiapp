
// =====================================================================
// TALLERES DE ECONOMETRÍA I (prof. Sergio Iván Restrepo): cada punto se escribe una sola vez aquí.
// La página del taller lo muestra completo y cada lección de la teoría lista los puntos de su tema
// (campo temas) y muestra como ejemplo resuelto el punto cuyo campo ej es esa lección.
// Notación del curso: β₁ es el intercepto y k cuenta el intercepto.
// =====================================================================
const TALLERES=[];
TALLERES.push({id:"tl-ep3", t:"Ejercicios propuestos 3", sub:"Cambio estructural y variables dicótomas", anchor:"chow",
intro:`Los 16 puntos del taller con la solución completa. Cada uno trae <b>lo que necesitas saber</b> (propiedades y fórmulas), el <b>paso a paso</b> con los números sustituidos y una <b>respuesta</b> lista para el informe. Los números se verificaron en R.`,
puntos:[
{id:"ep3-1", n:"1", t:"Prueba de pronósticos de Chow: media y varianza del error de pronóstico", tipo:"Demostración", temas:["ce-pronosticos","supuestos"], ej:"ce-pronosticos",
enun:String.raw`<p>En la prueba de pronósticos de Chow el vector de errores de pronóstico viene dado como</p>
<div class="mj">\[\mathbf d=\mathbf y_2-\hat{\mathbf y}_2=X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\]</div>
<p>donde \(\hat{\mathbf y}_2=X_2\mathbf b_1\), con \(\mathbf b_1=(X_1'X_1)^{-1}X_1'\mathbf y_1\sim N\!\left(\boldsymbol\beta,\sigma^2(X_1'X_1)^{-1}\right)\), y \(\mathbf y_2=X_2\boldsymbol\beta+\boldsymbol\mu_2\), con \(\boldsymbol\mu_2\sim N(\mathbf 0,\sigma^2I_{n_2})\). Muestre que <b>a)</b> \(E(\mathbf d)=\mathbf 0_{n_2\times1}\) y <b>b)</b> \(\operatorname{var}(\mathbf d)=\sigma^2\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]\).</p>
<div class="warn"><b>¿Está bien planteado «d = y₂ − ŷ₂»?</b> Sí, siempre que se lea bien qué es \(\hat{\mathbf y}_2\):
<ul><li>\(\hat{\mathbf y}_2=X_2\mathbf b_1\) es el <b>pronóstico</b> de la muestra 2 hecho con los coeficientes de la <b>muestra 1</b>. No es el valor ajustado de una regresión con la muestra 2.</li>
<li>Si fuera el ajustado de la muestra 2 (\(X_2\mathbf b_2\)), d sería el vector de residuos \(\mathbf e_2\). Su media también es cero, pero su varianza es \(\sigma^2[I-X_2(X_2'X_2)^{-1}X_2']\), con signo menos y la matriz de la muestra 2. Por eso el resultado b) solo sale con \(\mathbf b_1\).</li>
<li>La igualdad \(X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\) es correcta: solo se agrupan los términos con X₂.</li>
<li>Lo que el enunciado no dice explícitamente, y hace falta para b), es que los errores de las dos muestras son independientes, \(E(\boldsymbol\mu_1\boldsymbol\mu_2')=0\). Está implícito en el modelo clásico, que supone \(\boldsymbol\mu\sim N(\mathbf 0,\sigma^2I_n)\) para toda la muestra, pero conviene escribirlo al demostrar.</li></ul>
<p style="margin:6px 0 0">Es la misma expresión de Johnston y Dinardo, cap. 4: \(\mathbf d=\mathbf y_2-X_2\mathbf b_1\).</p></div>`,
saber:[String.raw`<b>Error de muestreo de MCO:</b> como \(\mathbf y_1=X_1\boldsymbol\beta+\boldsymbol\mu_1\), se tiene \(\mathbf b_1=\boldsymbol\beta+(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\), es decir \(\mathbf b_1-\boldsymbol\beta=(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\).`,
String.raw`<b>Supuestos:</b> X no es aleatoria; \(E(\boldsymbol\mu_j)=\mathbf 0\); \(E(\boldsymbol\mu_j\boldsymbol\mu_j')=\sigma^2I\) (homocedasticidad y no autocorrelación); los errores de las dos muestras no están correlacionados: \(E(\boldsymbol\mu_1\boldsymbol\mu_2')=0\).`,
String.raw`<b>Linealidad de la esperanza:</b> \(E(A\mathbf z)=A\,E(\mathbf z)\) si A no es aleatoria.`,
String.raw`<b>Varianza de un vector de media cero:</b> \(\operatorname{var}(\mathbf d)=E(\mathbf d\mathbf d')\). <b>Transpuesta de un producto:</b> \((AB)'=B'A'\); \((X_1'X_1)^{-1}\) es simétrica.`],
sol:String.raw`<h5>a) La media</h5><ol class="steps">
<li>Sustituye \(\mathbf y_2\) en d: \(\mathbf d=X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\).</li>
<li>Usa el error de muestreo: \(\mathbf d=\boldsymbol\mu_2-X_2(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\). Así d queda escrito solo con los errores.</li>
<li>Toma esperanza (las X son fijas): \(E(\mathbf d)=E(\boldsymbol\mu_2)-X_2(X_1'X_1)^{-1}X_1'E(\boldsymbol\mu_1)=\mathbf 0-\mathbf 0=\mathbf 0_{n_2\times1}\).</li></ol>
<h5>b) La varianza</h5><ol class="steps">
<li>Como \(E(\mathbf d)=\mathbf 0\), \(\operatorname{var}(\mathbf d)=E(\mathbf d\mathbf d')\). Llama \(A=X_2(X_1'X_1)^{-1}X_1'\), de modo que \(\mathbf d=\boldsymbol\mu_2-A\boldsymbol\mu_1\) y \(\mathbf d'=\boldsymbol\mu_2'-\boldsymbol\mu_1'A'\), con \(A'=X_1(X_1'X_1)^{-1}X_2'\).</li>
<li>Multiplica y distribuye la esperanza:
<div class="mj">\[E(\mathbf d\mathbf d')=E(\boldsymbol\mu_2\boldsymbol\mu_2')-E(\boldsymbol\mu_2\boldsymbol\mu_1')A'-A\,E(\boldsymbol\mu_1\boldsymbol\mu_2')+A\,E(\boldsymbol\mu_1\boldsymbol\mu_1')A'\]</div></li>
<li>Los dos términos cruzados son cero porque los errores de las dos muestras no están correlacionados.</li>
<li>Con \(E(\boldsymbol\mu_j\boldsymbol\mu_j')=\sigma^2I\): \(\operatorname{var}(\mathbf d)=\sigma^2I_{n_2}+\sigma^2AA'\).</li>
<li>Simplifica \(AA'=X_2(X_1'X_1)^{-1}\underbrace{X_1'X_1(X_1'X_1)^{-1}}_{I}X_2'=X_2(X_1'X_1)^{-1}X_2'\). Por tanto
<div class="mj">\[\operatorname{var}(\mathbf d)=\sigma^2\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]\]</div></li></ol>
<h5>La comparación con los residuos</h5><p>Si alguien toma \(\hat{\mathbf y}_2=X_2\mathbf b_2\) (la regresión de la muestra 2), entonces \(\mathbf d=\mathbf e_2=M_2\boldsymbol\mu_2\), con \(M_2=I-X_2(X_2'X_2)^{-1}X_2'\). Su media es cero, pero \(\operatorname{var}(\mathbf e_2)=\sigma^2M_2\) es <i>menor</i> que \(\sigma^2I\), mientras que la de b) es <i>mayor</i>: el pronóstico fuera de la muestra acumula el error de haber estimado β con otros datos. Además, con n₂ ≤ k los residuos de la muestra 2 serían todos cero, y la prueba de pronósticos existe justamente para ese caso.</p>
<h5>Para qué sirve</h5><p>Con normalidad, \(\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/\sigma^2\sim\chi^2(n_2)\). Al reemplazar σ² por \(s_1^2=SCR_1/(n_1-k)\) sale el estadístico (9) del curso, \(F=\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/(n_2s_1^2)\sim F(n_2,n_1-k)\), que da el mismo número que la forma (8) con las SCR.</p>`,
res:String.raw`<p>\(E(\mathbf d)=\mathbf 0\): el pronóstico es insesgado si los parámetros no cambian. La varianza tiene dos partes: \(\sigma^2I\), por los errores nuevos, y \(\sigma^2X_2(X_1'X_1)^{-1}X_2'\), porque β se estimó con la muestra 1. Si \(n_2=1\), se obtiene la varianza del error de predicción individual, \(\sigma^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]\).</p>`},

{id:"ep3-2", n:"2", t:"Consumo de cerveza por género: interpretar y contrastar", tipo:"Interpretación y pruebas t", temas:["dicotomicas","inferencia"], ej:"dicotomicas", tool:{id:"t-calc",pre:"coef:e2",lbl:"Abrir en la Calculadora (modelo ya estimado)"},
enun:String.raw`<p>Con n = 34, el modelo \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\) (Y: consumo de cerveza, X: renta, D = 1 si es mujer) se estimó así, con errores estándar entre paréntesis:</p>
<div class="mj">\[\hat Y_t=\underset{(45{,}67)}{186{,}47}-\underset{(57{,}01)}{126{,}00}D_t+\underset{(0{,}09)}{0{,}23}X_t-\underset{(0{,}10)}{0{,}13}D_tX_t,\qquad R^2=0{,}5055\]</div>
<p><b>a)</b> Interprete los coeficientes. <b>b)</b> ¿Cuál es la diferencia de consumo medio entre hombres y mujeres con la misma renta? <b>c)</b> Con perturbaciones normales, contraste: a. no hay diferencia en la propensión marginal a consumir; b. no hay diferencia en el consumo autónomo.</p>`,
saber:[String.raw`<b>Grupo base:</b> el grupo con D = 0 (hombres). β₁ y β₂ son su intercepto y su pendiente.`,
String.raw`<b>Diferenciales:</b> δ₁ cambia el intercepto y δ₂ cambia la pendiente del grupo D = 1. La ecuación de las mujeres es \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\).`,
String.raw`<b>Diferencia entre grupos para la misma X:</b> \(E(Y\mid D=1,X)-E(Y\mid D=0,X)=\delta_1+\delta_2X\).`,
String.raw`<b>Prueba t:</b> \(t=\hat\beta_j/ee(\hat\beta_j)\sim t(n-k)\). Aquí k = 4, así que hay 34 − 4 = 30 gl y \(t_{0{,}025}(30)=2{,}042\) a dos colas.`],
sol:String.raw`<h5>a) Interpretación</h5><ol class="steps">
<li>Escribe una ecuación por grupo. Para los hombres (D = 0): \(\hat Y=186{,}47+0{,}23X\). Para las mujeres (D = 1): \(\hat Y=(186{,}47-126)+(0{,}23-0{,}13)X=60{,}47+0{,}10X\).</li>
<li><b>β₁ = 186,47:</b> consumo autónomo de cerveza de un hombre, es decir, el consumo esperado con renta 0.</li>
<li><b>δ₁ = −126:</b> el consumo autónomo de las mujeres es 126 unidades menor que el de los hombres.</li>
<li><b>β₂ = 0,23:</b> propensión marginal a consumir cerveza de los hombres: por cada unidad adicional de renta consumen 0,23 unidades más.</li>
<li><b>δ₂ = −0,13:</b> la propensión marginal de las mujeres es 0,13 menor, o sea 0,10.</li>
<li>R² = 0,5055: el modelo explica el 50,6 % de la variación del consumo de cerveza.</li></ol>
<h5>b) Diferencia con la misma renta</h5><p>\(\hat Y_M-\hat Y_H=\delta_1+\delta_2X=-126-0{,}13X\). Las mujeres consumen menos, y la brecha crece con la renta. Por ejemplo, con X = 100 la diferencia es −139. No hay un único número porque las pendientes son distintas.</p>
<h5>c) Contrastes</h5><ol class="steps">
<li><b>a. Propensión marginal:</b> H₀: δ₂ = 0 frente a H₁: δ₂ ≠ 0. \(t=-0{,}13/0{,}10=-1{,}30\). Como \(|{-1{,}30}|<2{,}042\) (p = 0,204), no se rechaza H₀: no hay evidencia de que la propensión marginal difiera por género.</li>
<li><b>b. Consumo autónomo:</b> H₀: δ₁ = 0 frente a H₁: δ₁ ≠ 0. \(t=-126/57{,}01=-2{,}21\). Como \(|{-2{,}21}|>2{,}042\) (p = 0,035), se rechaza H₀ al 5 %: el consumo autónomo de las mujeres es menor.</li>
<li>Para probar las dos cosas a la vez (δ₁ = δ₂ = 0, cambio estructural completo) hace falta una F conjunta o las SCR de los dos modelos. Dos pruebas t por separado no bastan, porque los estimadores están correlacionados.</li></ol>`,
res:String.raw`<p>Hombres: \(\hat Y=186{,}47+0{,}23X\); mujeres: \(\hat Y=60{,}47+0{,}10X\). La diferencia con la misma renta es \(-126-0{,}13X\). Al 5 %, la propensión marginal no difiere por género (t = −1,30) y el consumo autónomo sí (t = −2,21).</p>`},

{id:"ep3-3", n:"3", t:"Educación urbana y rural: estimar, R², cambio estructural y pronóstico", tipo:"Cálculo con datos", temas:["mco-matricial","dicotomicas","chow"], ej:"mco-matricial", tool:{id:"t-datos",pre:"educacion",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Años de educación (Y) y renta familiar (X) de 8 jóvenes: urbanos (16, 8), (18, 13), (14, 9), (18, 12) y rurales (12, 7), (10, 3), (11, 6), (14, 10). Se propone \(Y_i=\beta_1D_{1i}+\beta_2D_{1i}X_i+\beta_3D_{2i}+\beta_4D_{2i}X_i+\mu_i\), con D₁ = 1 en la zona urbana y D₂ = 1 en la rural.</p><p><b>a)</b> Interprete los coeficientes y su signo esperado. <b>b)</b> Estime el modelo y explique el R². <b>c)</b> Con normalidad, contraste el cambio estructural entre zonas. <b>d)</b> Pronostique puntualmente y por intervalos los años de educación de un joven urbano con renta 10,5.</p>`,
saber:[String.raw`<b>Sin intercepto común:</b> como \(D_1+D_2=1\), el modelo ya tiene un intercepto por zona. Agregar β₀ causaría multicolinealidad perfecta.`,
String.raw`<b>X′X por bloques:</b> las columnas de una zona valen 0 en la otra, así que X′X es diagonal por bloques y MCO equivale a estimar <b>una regresión simple por zona</b>.`,
String.raw`<b>Regresión simple:</b> \(b=\dfrac{n\sum xy-\sum x\sum y}{n\sum x^2-(\sum x)^2}\), \(a=\bar y-b\bar x\), y \(SCR=\left(\sum y^2-n\bar y^2\right)-b^2\left(\sum x^2-n\bar x^2\right)\).`,
String.raw`<b>R² centrado:</b> \(R^2=1-SCR/STC\), con \(STC=\sum(y-\bar y)^2\). Se usa el centrado porque el modelo tiene intercepto implícito.`,
String.raw`<b>Chow:</b> el restringido es una sola recta para todos: \(F=\dfrac{(SCR_R-SCR_{NR})/q}{SCR_{NR}/(n-k)}\), con q = 2 y k = 4.`,
String.raw`<b>Pronóstico:</b> \(\hat y_0=\mathbf x_0'\mathbf b\); \(ee(\text{media})=\sqrt{s^2\mathbf x_0'(X'X)^{-1}\mathbf x_0}\) y \(ee(\text{individual})=\sqrt{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}\).`],
sol:String.raw`<h5>a) Significado y signos</h5><p>β₁ y β₃ son los años de educación esperados de un joven urbano y de uno rural con renta 0. β₂ y β₄ son los años adicionales por cada unidad de renta en cada zona. Signos esperados: positivos, porque más renta permite estudiar más. Se espera además β₁ &gt; β₃, por el mejor acceso a la educación en la ciudad.</p>
<h5>b) Estimación</h5><ol class="steps">
<li><b>Urbana</b> (n = 4): Σx = 42, Σy = 66, Σx² = 458, Σxy = 704. \(\hat\beta_2=\dfrac{4(704)-42(66)}{4(458)-42^2}=\dfrac{44}{68}=0{,}6471\) y \(\hat\beta_1=16{,}5-0{,}6471(10{,}5)=9{,}7059\).</li>
<li><b>Rural</b> (n = 4): Σx = 26, Σy = 47, Σx² = 194, Σxy = 320. \(\hat\beta_4=\dfrac{4(320)-26(47)}{4(194)-26^2}=\dfrac{58}{100}=0{,}58\) y \(\hat\beta_3=11{,}75-0{,}58(6{,}5)=7{,}98\).</li>
<li>Modelo estimado: \(\hat Y=9{,}706D_1+0{,}647D_1X+7{,}980D_2+0{,}580D_2X\).</li>
<li>SCR por zona: urbana 3,8824 y rural 0,34, así que \(SCR_{NR}=4{,}2222\) y \(s^2=4{,}2222/(8-4)=1{,}0556\).</li>
<li>\(STC=\sum y^2-n\bar y^2=1661-8(14{,}125)^2=64{,}875\), y \(R^2=1-4{,}2222/64{,}875=0{,}935\).</li>
<li>Errores estándar \(\sqrt{s^2[(X'X)^{-1}]_{jj}}\): 2,666; 0,249; 1,431 y 0,205.</li></ol>
<p><b>Lectura del R²:</b> la renta y la zona explican el 93,5 % de la variación de los años de educación.</p>
<h5>c) Cambio estructural</h5><ol class="steps">
<li>H₀: β₁ = β₃ y β₂ = β₄ (una sola recta) frente a H₁: al menos una diferencia. Son q = 2 restricciones.</li>
<li>Restringido \(Y=\alpha+\beta X\) con los 8 datos: Σx = 68, Σy = 113, Σx² = 652, Σxy = 1024. \(\hat\beta=\dfrac{8(1024)-68(113)}{8(652)-68^2}=\dfrac{508}{592}=0{,}8581\) y \(\hat\alpha=6{,}831\). \(SCR_R=10{,}3851\).</li>
<li>\(F=\dfrac{(10{,}3851-4{,}2222)/2}{4{,}2222/4}=\dfrac{3{,}0815}{1{,}0556}=2{,}919\sim F(2,4)\).</li>
<li>\(F_{0{,}05}(2,4)=6{,}944\) y p = 0,165, así que no se rechaza H₀.</li></ol>
<p><b>Lectura:</b> con estos datos no hay evidencia de que la relación educación-renta difiera entre zonas. Con solo 8 observaciones la prueba tiene poco poder.</p>
<h5>d) Pronóstico para un joven urbano con renta 10,5</h5><ol class="steps">
<li>\(\mathbf x_0=(1;\,10{,}5;\,0;\,0)\), así que \(\hat y_0=9{,}7059+0{,}6471(10{,}5)=16{,}5\) años.</li>
<li>10,5 es justo la renta media urbana, y en la media \(\mathbf x_0'(X'X)^{-1}\mathbf x_0=1/n_U=1/4\). Por tanto \(ee(\text{media})=\sqrt{1{,}0556/4}=0{,}5137\) y \(ee(\text{individual})=\sqrt{1{,}0556(1+1/4)}=1{,}1487\).</li>
<li>Con \(t_{0{,}025}(4)=2{,}776\):<br>IC del 95 % para la media: \(16{,}5\pm2{,}776(0{,}5137)=[15{,}07;\;17{,}93]\).<br>IC para un joven individual: \(16{,}5\pm2{,}776(1{,}1487)=[13{,}31;\;19{,}69]\).</li></ol>`,
res:String.raw`<p>\(\hat Y=9{,}706D_1+0{,}647D_1X+7{,}980D_2+0{,}580D_2X\), con R² = 0,935. Chow: F = 2,919 &lt; 6,944, así que no hay cambio estructural entre zonas. Pronóstico urbano con X = 10,5: 16,5 años; IC del 95 % para la media [15,07; 17,93] y para un individuo [13,31; 19,69].</p>`},

{id:"ep3-4", n:"4", t:"Salarios por titulación: la dummy y la diferencia de medias", tipo:"Demostración y cálculo", temas:["mco-simple","dicotomicas","inferencia"], ej:"mco-simple",
enun:String.raw`<p>Hay 500 empleados: 300 licenciados en empresariales (D = 1) con salario medio 250 y 200 administrativos (D = 0) con salario medio 150. El modelo es \(W_i=\beta_1+\beta_2D_i+\mu_i\).</p><p><b>a)</b> Muestre que \(\hat\beta_1=\bar W_A\) y \(\hat\beta_1+\hat\beta_2=\bar W_L\). <b>b)</b> Estime el modelo. <b>c)</b> Si las desviaciones típicas muestrales son 50 (licenciados) y 30 (administrativos), obtenga los errores estándar de \(\hat\beta_1\) y \(\hat\beta_2\). <b>d)</b> Halle el R². <b>e)</b> ¿Cómo contrastaría que hay diferencia salarial?</p>`,
saber:[String.raw`<b>Ecuaciones normales:</b> \(X'X\mathbf b=X'\mathbf y\). Con una dummy, \(\sum D=n_L\) y \(\sum D^2=n_L\).`,
String.raw`<b>Con una sola dummy, MCO da medias de grupo:</b> los residuos suman cero dentro de cada grupo, así que el ajuste de cada grupo es su media.`,
String.raw`<b>Varianza de los estimadores:</b> \(\widehat{\operatorname{var}}(\mathbf b)=s^2(X'X)^{-1}\) con \(s^2=SCR/(n-k)\).`,
String.raw`<b>Descomposición:</b> \(STC=SCE+SCR\) y \(R^2=SCE/STC\).`],
sol:String.raw`<h5>a) La demostración</h5><ol class="steps">
<li>\(X'X=\begin{bmatrix}n&n_L\\n_L&n_L\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}\sum W\\ \sum_L W\end{bmatrix}=\begin{bmatrix}n_L\bar W_L+n_A\bar W_A\\ n_L\bar W_L\end{bmatrix}\).</li>
<li>Segunda ecuación normal: \(n_L\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L\), así que \(\hat\beta_1+\hat\beta_2=\bar W_L\).</li>
<li>Primera: \(n\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L+n_A\bar W_A\). Escribe \(n=n_A+n_L\): \(n_A\hat\beta_1+n_L(\hat\beta_1+\hat\beta_2)=n_L\bar W_L+n_A\bar W_A\). Con el paso anterior queda \(n_A\hat\beta_1=n_A\bar W_A\), es decir \(\hat\beta_1=\bar W_A\).</li></ol>
<h5>b) Estimación</h5><p>\(\hat\beta_1=150\) y \(\hat\beta_2=250-150=100\), así que \(\hat W=150+100D\). El salario medio general es \(\bar W=(300\cdot250+200\cdot150)/500=210\).</p>
<h5>c) Errores estándar</h5><ol class="steps">
<li>Los residuos son las desviaciones de cada salario respecto a la media de su grupo. Con la desviación típica muestral (divisor n − 1): \(SCR=(n_L-1)s_L^2+(n_A-1)s_A^2=299(50^2)+199(30^2)=926.600\).</li>
<li>\(s^2=SCR/(n-k)=926.600/498=1.860{,}64\).</li>
<li>\((X'X)^{-1}=\dfrac{1}{n\,n_L-n_L^2}\begin{bmatrix}n_L&-n_L\\-n_L&n\end{bmatrix}=\dfrac{1}{n_Ln_A}\begin{bmatrix}n_L&-n_L\\-n_L&n\end{bmatrix}\).</li>
<li>\(ee(\hat\beta_1)=\sqrt{s^2/n_A}=\sqrt{1.860{,}64/200}=3{,}050\).<br>\(ee(\hat\beta_2)=\sqrt{s^2\left(\tfrac1{n_L}+\tfrac1{n_A}\right)}=\sqrt{1.860{,}64\left(\tfrac1{300}+\tfrac1{200}\right)}=3{,}938\).</li></ol>
<p class="hint">Si la desviación típica se define con divisor n, entonces SCR = 300(2.500) + 200(900) = 930.000 y los errores estándar cambian un poco (3,056 y 3,945).</p>
<h5>d) R²</h5><p>\(SCE=\sum(\hat W-\bar W)^2=300(250-210)^2+200(150-210)^2=480.000+720.000=1.200.000\), y \(STC=SCE+SCR=2.126.600\). Por tanto \(R^2=1.200.000/2.126.600=0{,}564\).</p>
<h5>e) Contraste</h5><p>H₀: β₂ = 0 (sin diferencia salarial) frente a H₁: β₂ ≠ 0 (o β₂ &gt; 0 si se quiere probar que los licenciados ganan más). \(t=100/3{,}938=25{,}40\sim t(498)\), y \(t_{0{,}025}\approx1{,}965\). Se rechaza H₀ con mucha holgura (p ≈ 0): hay diferencia salarial. Esta prueba t es la misma que la de diferencia de medias con varianza combinada.</p>`,
res:String.raw`<p>\(\hat W=150+100D\), con ee de 3,050 y 3,938, y R² = 0,564. Contraste t = 25,4: los licenciados ganan en promedio 100 mil pesetas más al mes.</p>`},

{id:"ep3-5", n:"5", t:"Salarios y experiencia por género: ¿es distinta la ecuación?", tipo:"Prueba de Chow con datos", temas:["dicotomicas","chow"], tool:{id:"t-datos",pre:"salarios",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Hay 17 personas: 9 hombres y 8 mujeres, con su sueldo W y sus años de experiencia X (los datos están en el taller). El modelo es \(W_i=\beta_1D_{1i}+\beta_2X_{1i}+\beta_1'D_{2i}+\beta_2'X_{2i}+\mu_i\), con D₁ = 1 para los hombres, D₂ = 1 para las mujeres y \(X_{ji}=D_{ji}X_i\).</p><p><b>a)</b> Interprete y estime los coeficientes. <b>b)</b> ¿Es el género significativo? Plantee la hipótesis y haga la prueba.</p>`,
saber:[String.raw`Es el mismo diseño del punto 3: un intercepto y una pendiente por grupo sin intercepto común. MCO equivale a una regresión simple por grupo, y \(SCR_{NR}=SCR_H+SCR_M\).`,
String.raw`<b>Chow:</b> H₀: \(\beta_1=\beta_1'\) y \(\beta_2=\beta_2'\), con q = 2, k = 4 y \(F\sim F(2,\,n-4)\).`],
sol:String.raw`<h5>a) Estimación e interpretación</h5><ol class="steps">
<li><b>Hombres</b> (n = 9): Σx = 117, Σw = 24,06, Σx² = 2491, Σxw = 377,25. \(\hat\beta_2=\dfrac{9(377{,}25)-117(24{,}06)}{9(2491)-117^2}=\dfrac{580{,}23}{8730}=0{,}06646\) y \(\hat\beta_1=2{,}6733-0{,}06646(13)=1{,}8093\).</li>
<li><b>Mujeres</b> (n = 8): Σx = 130, Σw = 23,96, Σx² = 2574, Σxw = 425,25. \(\hat\beta_2'=\dfrac{8(425{,}25)-130(23{,}96)}{8(2574)-130^2}=\dfrac{287{,}2}{3692}=0{,}07779\) y \(\hat\beta_1'=2{,}995-0{,}07779(16{,}25)=1{,}7309\).</li>
<li>β₁ = 1,809 y β′₁ = 1,731 son el sueldo de entrada (sin experiencia) de hombres y mujeres. β₂ = 0,0665 y β′₂ = 0,0778 son lo que aumenta el sueldo por cada año de experiencia.</li></ol>
<h5>b) ¿Es significativo el género?</h5><ol class="steps">
<li>H₀: β₁ = β′₁ y β₂ = β′₂ (la misma ecuación para los dos) frente a H₁: al menos uno distinto.</li>
<li>\(SCR_{NR}=SCR_H+SCR_M=0{,}80627+0{,}32615=1{,}13242\), con n − k = 17 − 4 = 13.</li>
<li>Restringido, una sola recta: Σx = 247, Σw = 48,02, Σx² = 5065, Σxw = 802,5. Da \(\hat W=1{,}7933+0{,}0710X\) y \(SCR_R=1{,}20866\).</li>
<li>\(F=\dfrac{(1{,}20866-1{,}13242)/2}{1{,}13242/13}=\dfrac{0{,}03812}{0{,}08711}=0{,}438\sim F(2,13)\).</li>
<li>\(F_{0{,}05}(2,13)=3{,}806\) y p = 0,655, así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>Hombres: \(\hat W=1{,}809+0{,}0665X\); mujeres: \(\hat W=1{,}731+0{,}0778X\). F = 0,438 &lt; 3,806 (p = 0,65): el género no es significativo, y una sola ecuación de salario sirve para los dos.</p>`},

{id:"ep3-6", n:"6", t:"Función de consumo en tres periodos", tipo:"Chow con m submuestras", temas:["chow"], tool:{id:"t-calc",pre:"rss:e6",lbl:"Abrir en la Calculadora (SCR o R²)"},
enun:String.raw`<p>Una función keynesiana \(C=\beta_1+\beta_2R\) se estimó en 1964-1971 (\(\hat\beta_2=0{,}3663\)), 1972-1983 (0,8846), 1984-1990 (1,6069) y en todo 1964-1990 (\(\hat C=202{,}23+0{,}895R\), R² = 0,9974). Además, STC = 6.403.270, SCR₁ = 2.379,315, SCR₂ = 3.679,020 y SCR₃ = 1.295,861.</p><p><b>a)</b> Explique el concepto de cambio estructural. <b>b)</b> Contraste la consistencia de los parámetros en los tres periodos.</p>`,
saber:[String.raw`<b>Chow con m submuestras:</b> \(F=\dfrac{(SCR_R-\sum_jSCR_j)/[(m-1)k]}{\sum_jSCR_j/(n-mk)}\sim F((m-1)k,\,n-mk)\).`,
String.raw`<b>SCR a partir de R²:</b> \(R^2=1-SCR/STC\), así que \(SCR=(1-R^2)\,STC\).`,
String.raw`Años de cada periodo: 1964-1971 son 8, 1972-1983 son 12 y 1984-1990 son 7, en total n = 27.`],
sol:String.raw`<h5>a) Concepto</h5><p>Hay cambio estructural cuando los parámetros de la relación no son los mismos en todo el periodo de la muestra. Un evento, como una crisis, un cambio de política o una reforma, modifica el consumo autónomo, la propensión marginal a consumir o ambos. Si existe y se estima una sola ecuación, los coeficientes son un promedio engañoso de relaciones distintas.</p>
<h5>b) La prueba</h5><ol class="steps">
<li>H₀: \(\boldsymbol\beta^{(1)}=\boldsymbol\beta^{(2)}=\boldsymbol\beta^{(3)}\) (parámetros constantes) frente a H₁: al menos uno cambia. Son q = (m − 1)k = 2·2 = 4 restricciones.</li>
<li>\(SCR_R=(1-0{,}9974)(6.403.270)=16.648{,}50\).</li>
<li>\(SCR_{NR}=2.379{,}315+3.679{,}020+1.295{,}861=7.354{,}196\).</li>
<li>Grados de libertad del denominador: n − mk = 27 − 6 = 21.</li>
<li>\(F=\dfrac{(16.648{,}50-7.354{,}20)/4}{7.354{,}20/21}=\dfrac{2.323{,}58}{350{,}20}=6{,}635\sim F(4,21)\).</li>
<li>\(F_{0{,}05}(4,21)=2{,}840\) y p = 0,0013, así que se rechaza H₀.</li></ol>
<p class="hint">El R² viene redondeado a cuatro decimales, y SCR_R es sensible a eso: con R² entre 0,99735 y 0,99745 la F va de 6,41 a 6,86. La conclusión no cambia.</p>`,
res:String.raw`<p>F = 6,635 &gt; F(4, 21) = 2,84: se rechaza la consistencia de los parámetros. La función de consumo cambió entre los tres periodos. La propensión marginal pasa de 0,37 a 0,88 y a 1,61; una propensión mayor que 1 en el último periodo es económicamente rara y merece comentarse.</p>`},

{id:"ep3-7", n:"7", t:"Horas de lectura: dummies de clase y la trampa de las dicótomas", tipo:"Demostración y cálculo", temas:["matrices","dicotomicas"], ej:"matrices", tool:{id:"t-datos",pre:"lectura",lbl:"Cargar el literal c en el Laboratorio"},
enun:String.raw`<p>Las horas de lectura Y se relacionan con tres clases de educación: superior (E₁), media (E₂) y media incompleta (E₃). <b>a)</b> En \(Y_i=\delta_1E_{1i}+\delta_2E_{2i}+\delta_3E_{3i}+\mu_i\), pruebe que \(\hat\delta_j=\bar Y_j\). <b>b)</b> En \(Y_i=\beta_1+\beta_2E_{2i}+\beta_3E_{3i}+v_i\), pruebe que \(\hat\beta_1=\bar Y_1\), \(\hat\beta_2=\bar Y_2-\bar Y_1\) y \(\hat\beta_3=\bar Y_3-\bar Y_1\). <b>c)</b> Con \(S_1\) = 1 si es mujer y los datos (mujer: superiores 8, 10, 12; media 12, 14; incompleta 20; hombre: superiores 5, 6; media 10; incompleta 20), estime \(Y_i=\beta_1+\beta_2E_{2i}+\beta_3E_{3i}+\beta_4S_{1i}+v_i\) y calcule las horas estimadas por clase y género.</p>`,
saber:[String.raw`<b>Productos de dummies excluyentes:</b> \(E_jE_l=0\) si j ≠ l y \(E_j^2=E_j\). Por eso \(\sum E_j=n_j\), \(\sum E_jE_l=0\) y \(\sum E_jY=\) suma de Y en la clase j.`,
String.raw`<b>Trampa de las dicótomas:</b> \(E_1+E_2+E_3=1\). Con intercepto, se incluyen m − 1 dummies; sin intercepto, las m.`,
String.raw`<b>Reparametrización:</b> dos modelos cuyas X generan el mismo espacio de columnas dan los mismos valores ajustados. Por eso sus coeficientes se relacionan como los parámetros.`],
sol:String.raw`<h5>a) Sin intercepto</h5><ol class="steps">
<li>\(X=[E_1\;E_2\;E_3]\), así que \(X'X=\operatorname{diag}(n_1,n_2,n_3)\), porque las dummies no se superponen.</li>
<li>\(X'\mathbf y=\left(\sum_{1}Y,\;\sum_{2}Y,\;\sum_{3}Y\right)'\).</li>
<li>\(\mathbf b=(X'X)^{-1}X'\mathbf y\) divide cada suma por su tamaño: \(\hat\delta_j=\sum_jY/n_j=\bar Y_j\).</li></ol>
<h5>b) Con intercepto y la clase 1 como base</h5><ol class="steps">
<li>Para una persona de la clase 1, \(E(Y)=\beta_1\); de la clase 2, \(\beta_1+\beta_2\); de la clase 3, \(\beta_1+\beta_3\). Es el modelo de a) reparametrizado: \(\delta_1=\beta_1\), \(\delta_2=\beta_1+\beta_2\) y \(\delta_3=\beta_1+\beta_3\).</li>
<li>Las columnas \([1,E_2,E_3]\) generan el mismo espacio que \([E_1,E_2,E_3]\), porque \(1=E_1+E_2+E_3\). Así que los valores ajustados son los mismos: \(\bar Y_1\), \(\bar Y_2\) y \(\bar Y_3\).</li>
<li>Despeja: \(\hat\beta_1=\bar Y_1\), \(\hat\beta_2=\bar Y_2-\bar Y_1\) y \(\hat\beta_3=\bar Y_3-\bar Y_1\). También se puede resolver directamente \(X'X\mathbf b=X'\mathbf y\) con \(X'X=\begin{bmatrix}n&n_2&n_3\\n_2&n_2&0\\n_3&0&n_3\end{bmatrix}\).</li></ol>
<h5>c) Con género</h5><ol class="steps">
<li>Con los 10 datos: \(X'X=\begin{bmatrix}10&3&2&6\\3&3&0&2\\2&0&2&1\\6&2&1&6\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}117\\36\\40\\76\end{bmatrix}\).</li>
<li>\(\mathbf b=(X'X)^{-1}X'\mathbf y\), así que \(\hat Y=6{,}324+3{,}592E_2+12{,}113E_3+3{,}127S_1\).</li>
<li>Horas estimadas (intercepto + clase + género):
<div class="tbl"><table><tr><th></th><th class="num">Superiores</th><th class="num">Media</th><th class="num">Media incompleta</th></tr><tr><td>Hombre</td><td class="num">6,32</td><td class="num">9,92</td><td class="num">18,44</td></tr><tr><td>Mujer</td><td class="num">9,45</td><td class="num">13,04</td><td class="num">21,56</td></tr></table></div></li>
<li>Sin interacciones el modelo impone la misma brecha de género (3,13 horas) en todas las clases. Por eso los ajustes no coinciden con las medias de cada celda; las mujeres con estudios superiores, por ejemplo, promedian 10.</li></ol>`,
res:String.raw`<p>a) \(\hat\delta_j=\bar Y_j\). b) El intercepto es la media de la clase base y cada coeficiente la diferencia de medias. c) \(\hat Y=6{,}324+3{,}592E_2+12{,}113E_3+3{,}127S_1\): las mujeres leen 3,13 horas más en cada clase, y la media incompleta es la clase que más lee.</p>`},

{id:"ep3-8", n:"8", t:"Guerra y paz: ¿cambió la función de consumo?", tipo:"Prueba de Chow con datos", temas:["chow","ce-dummies"], ej:"chow", tool:{id:"t-datos",pre:"consumo",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Se tienen 15 años de consumo (Y) y renta disponible (X): los 5 primeros de guerra y los 10 últimos de paz (los datos están en el taller). Con \(Y_t=\beta_1+\beta_2X_t+\mu_t\), determine si hay cambio estructural en la función de consumo entre la guerra y la paz. Especifique el modelo restringido y el no restringido y las hipótesis nula y alternativa.</p>`,
saber:[String.raw`<b>No restringido:</b> \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\), con D = 1 en la paz. Estimarlo equivale a estimar cada periodo por separado (ecuación 27), y \(SCR_{NR}=SCR_1+SCR_2\) (ecuación 28).`,
String.raw`<b>Restringido:</b> \(Y_t=\beta_1+\beta_2X_t+\mu_t\) con todas las observaciones.`,
String.raw`<b>Estadístico de Chow:</b> \(F=\dfrac{(SCR_R-SCR_1-SCR_2)/k}{(SCR_1+SCR_2)/(n-2k)}\sim F(k,\,n-2k)\), con k = 2.`,
String.raw`<b>SCR de una regresión simple sin calcular residuos:</b> \(SCR=S_{yy}-\hat\beta_2^2S_{xx}\), con \(S_{yy}=\sum y^2-n\bar y^2\) y \(S_{xx}=\sum x^2-n\bar x^2\).`],
sol:String.raw`<ol class="steps">
<li><b>Hipótesis.</b> H₀: δ₁ = δ₂ = 0 (la misma función en la guerra y en la paz) frente a H₁: δ₁ ≠ 0 o δ₂ ≠ 0.</li>
<li><b>Guerra</b> (n₁ = 5): Σx = 35, Σy = 15, Σx² = 325, Σxy = 140, Σy² = 61. \(\hat\beta_2=\dfrac{5(140)-35(15)}{5(325)-35^2}=\dfrac{175}{400}=0{,}4375\) y \(\hat\beta_1=3-0{,}4375(7)=-0{,}0625\). Con \(S_{yy}=61-45=16\) y \(S_{xx}=325-245=80\): \(SCR_1=16-0{,}4375^2(80)=0{,}6875\).</li>
<li><b>Paz</b> (n₂ = 10): Σx = 110, Σy = 60, Σx² = 1540, Σxy = 828, Σy² = 448. \(\hat\beta_2=\dfrac{10(828)-110(60)}{10(1540)-110^2}=\dfrac{1680}{3300}=0{,}5091\) y \(\hat\beta_1=6-0{,}5091(11)=0{,}4000\). \(SCR_2=88-0{,}5091^2(330)=2{,}4727\).</li>
<li><b>Restringido</b> (n = 15): Σx = 145, Σy = 75, Σx² = 1865, Σxy = 968, Σy² = 509. \(\hat\beta_2=\dfrac{15(968)-145(75)}{15(1865)-145^2}=\dfrac{3645}{6950}=0{,}5245\) y \(\hat\beta_1=-0{,}0698\). \(SCR_R=134-0{,}5245^2(463{,}33)=6{,}5561\).</li>
<li><b>Verificación con dummies:</b> \(\hat Y=-0{,}0625+0{,}4625D+0{,}4375X+0{,}0716DX\). Los β son los de la guerra, y β + δ dan los de la paz: −0,0625 + 0,4625 = 0,4 y 0,4375 + 0,0716 = 0,5091. Además \(SCR_{NR}=3{,}1602=0{,}6875+2{,}4727\).</li>
<li>\(F=\dfrac{(6{,}5561-3{,}1602)/2}{3{,}1602/11}=\dfrac{1{,}6980}{0{,}2873}=5{,}910\sim F(2,11)\).</li>
<li>\(F_{0{,}05}(2,11)=3{,}982\) y p = 0,018, así que se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 5,910 &gt; 3,982 (p = 0,018): hay cambio estructural, y la función de consumo es distinta en la guerra y en la paz. En la paz la propensión marginal a consumir es mayor (0,509 frente a 0,438), lo que es coherente con el racionamiento y el ahorro forzoso de la guerra.</p>`},
]});
TALLERES[0].puntos.push(
{id:"ep3-9", n:"9", t:"El modelo con dummies en forma matricial: X, β, R y r", tipo:"Forma matricial", temas:["ce-dummies","inferencia"], ej:"ce-dummies",
enun:String.raw`<p>El modelo no restringido es \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\beta_kX_{kt}+\delta_kD_tX_{kt}+\mu_t\), con \(D_t=0\) para \(t=1,\dots,n_1\) y \(D_t=1\) para \(t=n_1+1,\dots,n\). <b>a)</b> Escríbalo como \(\mathbf y=X_{NR\_D}\boldsymbol\beta_{NR\_D}+\boldsymbol\mu\), especificando la matriz y el vector. <b>b)</b> La prueba \(H_0:\delta_1=\dots=\delta_k=0\) frente a \(H_1\): algún \(\delta_j\neq0\), escríbala como \(H_0:R\boldsymbol\beta_{NR\_D}=\mathbf r\), especificando R y r.</p>`,
saber:[String.raw`<b>Forma matricial:</b> cada fila de X tiene los regresores de una observación en el mismo orden que el vector de parámetros.`,
String.raw`<b>Restricciones lineales:</b> \(R\boldsymbol\beta=\mathbf r\). R tiene una fila por restricción (q filas) y una columna por parámetro. Cada fila "escoge" con un 1 el parámetro restringido.`,
String.raw`<b>Estadístico:</b> \(F=\dfrac{(R\mathbf b-\mathbf r)'[R(X'X)^{-1}R']^{-1}(R\mathbf b-\mathbf r)}{q\,s^2}\sim F(q,\,n-2k)\). Da lo mismo que la F con las SCR.`],
sol:String.raw`<h5>a) La matriz y el vector</h5><ol class="steps">
<li>Ordena los parámetros por pares: \(\boldsymbol\beta_{NR\_D}=(\beta_1,\delta_1,\beta_2,\delta_2,\dots,\beta_k,\delta_k)'\), de orden 2k × 1.</li>
<li>Cada fila de X lleva \((1,\;D_t,\;X_{2t},\;D_tX_{2t},\dots,X_{kt},\;D_tX_{kt})\). En las primeras n₁ filas D = 0, así que las columnas con D son cero; en las últimas n₂, D = 1 y esas columnas repiten las X:
<div class="mj">\[X_{NR\_D}=\begin{bmatrix}1&0&X_{2,1}&0&\cdots&X_{k,1}&0\\ \vdots&&&&&&\vdots\\ 1&0&X_{2,n_1}&0&\cdots&X_{k,n_1}&0\\ 1&1&X_{2,n_1+1}&X_{2,n_1+1}&\cdots&X_{k,n_1+1}&X_{k,n_1+1}\\ \vdots&&&&&&\vdots\\ 1&1&X_{2,n}&X_{2,n}&\cdots&X_{k,n}&X_{k,n}\end{bmatrix}_{n\times2k}\]</div></li>
<li>En bloques: \(X_{NR\_D}=\begin{bmatrix}X_1&\mathbf 0\\X_2&X_2\end{bmatrix}\) si se ordenan los parámetros como \((\beta_1,\dots,\beta_k,\delta_1,\dots,\delta_k)\), donde X₁ y X₂ son las matrices de cada periodo (con la columna de unos).</li></ol>
<h5>b) R y r</h5><ol class="steps">
<li>Hay q = k restricciones (una por cada δ), así que R es de orden k × 2k y r = 0 de orden k × 1.</li>
<li>Con el orden por pares, los δ están en las posiciones pares 2, 4, …, 2k:
<div class="mj">\[R=\begin{bmatrix}0&1&0&0&\cdots&0&0\\0&0&0&1&\cdots&0&0\\ \vdots&&&&\ddots&&\vdots\\0&0&0&0&\cdots&0&1\end{bmatrix}_{k\times2k},\qquad \mathbf r=\begin{bmatrix}0\\0\\ \vdots\\0\end{bmatrix}_{k\times1}\]</div></li>
<li>Comprueba: \(R\boldsymbol\beta_{NR\_D}=(\delta_1,\delta_2,\dots,\delta_k)'\), así que \(R\boldsymbol\beta=\mathbf r\) dice que todos los δ son cero.</li>
<li>Con el orden por bloques, \(R=[\,0_{k\times k}\;|\;I_k\,]\).</li>
<li><b>Ejemplo con k = 2</b> (modelo simple): \(R=\begin{bmatrix}0&1&0&0\\0&0&0&1\end{bmatrix}\) y \(\mathbf r=\begin{bmatrix}0\\0\end{bmatrix}\), es decir H₀: δ₁ = δ₂ = 0.</li></ol>`,
res:String.raw`<p>\(\mathbf y=X_{NR\_D}\boldsymbol\beta_{NR\_D}+\boldsymbol\mu\), con filas \((1,D_t,X_{2t},D_tX_{2t},\dots)\) y \(\boldsymbol\beta=(\beta_1,\delta_1,\dots,\beta_k,\delta_k)'\). H₀: Rβ = r, con R de orden k × 2k que tiene un 1 en la posición de cada δ, y r = 0.</p>`},

{id:"ep3-10", n:"10", t:"Solo cambia el intercepto (pendientes comunes)", tipo:"Forma matricial", temas:["ce-dummies"],
enun:String.raw`<p>Repita el ejercicio 9 para la prueba de cambio estructural en la que solo cambia el intercepto, con pendientes comunes.</p>`,
saber:[String.raw`El modelo de la alternativa tiene una sola dummy en el intercepto: \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\dots+\beta_kX_{kt}+\mu_t\).`,
String.raw`Es una sola restricción (q = 1), así que la F es el cuadrado de la t de δ₁.`],
sol:String.raw`<ol class="steps">
<li><b>Parámetros:</b> \(\boldsymbol\beta_{NR\_D}=(\beta_1,\delta_1,\beta_2,\dots,\beta_k)'\), de orden (k + 1) × 1.</li>
<li><b>Matriz:</b> cada fila es \((1,\;D_t,\;X_{2t},\dots,X_{kt})\):
<div class="mj">\[X_{NR\_D}=\begin{bmatrix}1&0&X_{2,1}&\cdots&X_{k,1}\\ \vdots&\vdots&&&\vdots\\1&0&X_{2,n_1}&\cdots&X_{k,n_1}\\1&1&X_{2,n_1+1}&\cdots&X_{k,n_1+1}\\ \vdots&\vdots&&&\vdots\\1&1&X_{2,n}&\cdots&X_{k,n}\end{bmatrix}_{n\times(k+1)}\]</div></li>
<li><b>Hipótesis:</b> H₀: δ₁ = 0 frente a H₁: δ₁ ≠ 0. \(R=[\,0\;\;1\;\;0\;\cdots\;0\,]_{1\times(k+1)}\) y r = 0, de modo que Rβ = δ₁.</li>
<li><b>Estadístico:</b> \(F=\dfrac{\hat\delta_1^2}{s^2[(X'X)^{-1}]_{22}}=t_{\delta_1}^2\sim F(1,\,n-k-1)\).</li>
<li><b>Variante:</b> si se parte del modelo completo del ejercicio 9 y se prueba solo δ₁ = 0, entonces R = [0 1 0 0 … 0] de orden 1 × 2k y los gl son (1, n − 2k).</li></ol>`,
res:String.raw`<p>Con \(\boldsymbol\beta=(\beta_1,\delta_1,\beta_2,\dots,\beta_k)'\) y filas \((1,D_t,X_{2t},\dots,X_{kt})\): R = [0 1 0 … 0], r = 0. Las rectas son paralelas y H₀ dice que además coinciden.</p>`},

{id:"ep3-11", n:"11", t:"Solo cambian las pendientes (intercepto común)", tipo:"Forma matricial", temas:["ce-dummies"],
enun:String.raw`<p>Repita el ejercicio 9 para la prueba de cambio estructural en la que solo cambian los coeficientes de las pendientes, con intercepto común.</p>`,
saber:[String.raw`El modelo de la alternativa interactúa D solo con las X: \(Y_t=\beta_1+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\beta_kX_{kt}+\delta_kD_tX_{kt}+\mu_t\).`,
String.raw`Son k − 1 restricciones, una por cada pendiente.`],
sol:String.raw`<ol class="steps">
<li><b>Parámetros:</b> \(\boldsymbol\beta_{NR\_D}=(\beta_1,\beta_2,\delta_2,\dots,\beta_k,\delta_k)'\), de orden (2k − 1) × 1.</li>
<li><b>Matriz:</b> cada fila es \((1,\;X_{2t},\;D_tX_{2t},\dots,X_{kt},\;D_tX_{kt})\). En las primeras n₁ filas las columnas \(D_tX_{jt}\) valen 0 y en las últimas n₂ repiten las X.</li>
<li><b>Hipótesis:</b> H₀: δ₂ = … = δ_k = 0 frente a H₁: algún δ_j ≠ 0. R es de orden (k − 1) × (2k − 1), con un 1 en la posición de cada δ, y r = 0 de orden (k − 1) × 1.</li>
<li><b>Ejemplo con k = 2:</b> \(\boldsymbol\beta=(\beta_1,\beta_2,\delta_2)'\), R = [0 0 1] y r = 0, es decir H₀: δ₂ = 0.</li>
<li><b>Estadístico:</b> \(F\sim F(k-1,\,n-2k+1)\). Partiendo del modelo completo del ejercicio 9, son las filas de R que escogen δ₂, …, δ_k, con gl (k − 1, n − 2k).</li></ol>`,
res:String.raw`<p>Con filas \((1,X_{2t},D_tX_{2t},\dots)\): H₀: δ₂ = … = δ_k = 0, con R de orden (k − 1) × (2k − 1) y r = 0. Las rectas parten del mismo intercepto y H₀ dice que tienen la misma pendiente.</p>`},

{id:"ep3-12", n:"12", t:"Nerlove: homogeneidad en precios con las pruebas W, LR y LM", tipo:"Restricciones lineales", temas:["inferencia","especificacion"], ej:"inferencia", tool:{id:"t-calc",pre:"wlm:e12",lbl:"Abrir en la Calculadora (Wald, LR y LM)"},
enun:String.raw`<p>Nerlove estimó la función de costos \(Y=AX^{\beta_2}P_1^{\beta_3}P_2^{\beta_4}P_3^{\beta_5}\mu\) con 29 empresas. Modelo 1 (en logaritmos):</p>
<div class="mj">\[\widehat{\ln Y}=\underset{(1{,}96)}{-4{,}93}+\underset{(0{,}11)}{0{,}94}\ln X+\underset{(0{,}23)}{0{,}31}\ln P_1-\underset{(0{,}29)}{0{,}26}\ln P_2+\underset{(0{,}07)}{0{,}44}\ln P_3,\qquad SCR=0{,}336\]</div>
<p>Modelo 2, con la restricción β₃ + β₄ + β₅ = 1:</p>
<div class="mj">\[\widehat{\ln(Y/P_3)}=\underset{(0{,}16)}{-6{,}55}+\underset{(0{,}11)}{0{,}91}\ln X+\underset{(0{,}19)}{0{,}51}\ln(P_1/P_3)+\underset{(0{,}016)}{0{,}09}\ln(P_2/P_3),\qquad SCR=0{,}364\]</div>
<p><b>a)</b> Interprete los resultados. <b>b)</b> ¿Cómo averiguaría si la restricción es válida? Haga las pruebas LR, Wald y LM.</p>`,
saber:[String.raw`<b>Modelo log-log:</b> cada coeficiente es una elasticidad: β₂ = %Δcosto / %Δproducto.`,
String.raw`<b>Homogeneidad de grado 1 en precios:</b> si todos los precios suben 1 %, el costo sube 1 %. Eso exige β₃ + β₄ + β₅ = 1.`,
String.raw`<b>Pruebas asintóticas</b> con q restricciones, ~χ²(q): \(W=n\dfrac{SCR_R-SCR_{NR}}{SCR_{NR}}\), \(LR=n\ln\dfrac{SCR_R}{SCR_{NR}}\) y \(LM=n\dfrac{SCR_R-SCR_{NR}}{SCR_R}\). Siempre se cumple W ≥ LR ≥ LM.`,
String.raw`<b>F exacta:</b> \(F=\dfrac{(SCR_R-SCR_{NR})/q}{SCR_{NR}/(n-k)}\), con k = 5.`],
sol:String.raw`<h5>a) Interpretación</h5><ol class="steps">
<li><b>Modelo 1.</b> Elasticidad costo-producto 0,94 (t = 8,5): si la producción sube 1 %, el costo sube 0,94 %. Como es menor que 1, hay rendimientos crecientes a escala leves (1/0,94 ≈ 1,06).</li>
<li>Elasticidades precio: trabajo 0,31 (t = 1,35, no significativa), capital −0,26 (signo contrario al esperado, pero t = −0,90, no significativa) y combustible 0,44 (t = 6,3). Suman 0,49, lejos de 1 en apariencia.</li>
<li><b>Modelo 2.</b> Al imponer la homogeneidad, la elasticidad al producto es 0,91. Las de precio son 0,51 (trabajo), 0,09 (capital, ahora con el signo correcto) y, por la restricción, 1 − 0,51 − 0,09 = 0,40 (combustible).</li></ol>
<h5>b) ¿Es válida la restricción?</h5><ol class="steps">
<li>H₀: β₃ + β₄ + β₅ = 1 frente a H₁: β₃ + β₄ + β₅ ≠ 1, con q = 1, n = 29, \(SCR_R=0{,}364\) (modelo 2) y \(SCR_{NR}=0{,}336\) (modelo 1).</li>
<li>\(W=29\,\dfrac{0{,}364-0{,}336}{0{,}336}=2{,}417\).</li>
<li>\(LR=29\ln\dfrac{0{,}364}{0{,}336}=2{,}321\).</li>
<li>\(LM=29\,\dfrac{0{,}364-0{,}336}{0{,}364}=2{,}231\).</li>
<li>\(\chi^2_{0{,}05}(1)=3{,}841\). Las tres son menores, así que no se rechaza H₀. Se cumple W ≥ LR ≥ LM.</li>
<li>F exacta: \(F=\dfrac{0{,}028/1}{0{,}336/24}=2{,}00<F_{0{,}05}(1,24)=4{,}26\). La misma conclusión.</li></ol>`,
res:String.raw`<p>W = 2,417, LR = 2,321 y LM = 2,231, todos menores que χ²(1) = 3,84 (y F = 2,0 &lt; 4,26). No se rechaza la homogeneidad de grado uno en precios, así que el modelo 2 es aceptable y corrige el signo del precio del capital.</p>`},

{id:"ep3-13", n:"13", t:"Reforma laboral de 2020: dummy en el intercepto", tipo:"Planteamiento", temas:["dicotomicas"],
enun:String.raw`<p>Con datos anuales 1990-2025, el modelo es \(Y_t=\beta_1+\beta_2X_t+\mu_t\) (Y: salario, X: experiencia). En 2020 hubo una reforma laboral. <b>a)</b> Defina una dummy para este hecho. <b>b)</b> Escriba un modelo que permita un cambio en el intercepto. <b>c)</b> Explique el coeficiente de la dummy.</p>`,
saber:[String.raw`Una dummy de quiebre vale 0 antes del evento y 1 desde el evento. Si solo multiplica al intercepto, desplaza la recta en paralelo.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(D_t=\begin{cases}1 & t\ge2020\\0 & t<2020\end{cases}\)</li>
<li><b>b)</b> \(Y_t=\beta_1+\delta D_t+\beta_2X_t+\mu_t\).</li>
<li><b>c)</b> Antes de la reforma, \(E(Y_t)=\beta_1+\beta_2X_t\); después, \((\beta_1+\delta)+\beta_2X_t\). δ es el cambio en el salario esperado después de la reforma <b>para un mismo nivel de experiencia</b>. Si δ &gt; 0, la reforma subió los salarios; el efecto de la experiencia (β₂) no cambia.</li>
<li>Para saber si el efecto existe: t de δ, con H₀: δ = 0 y n − 3 gl.</li></ol>`,
res:String.raw`<p>D = 1 desde 2020. Con \(Y=\beta_1+\delta D+\beta_2X+\mu\), δ es el desplazamiento del salario medio después de la reforma, con la misma experiencia.</p>`},

{id:"ep3-14", n:"14", t:"Cambio después de un evento: intercepto y pendiente", tipo:"Planteamiento", temas:["dicotomicas","chow"],
enun:String.raw`<p>En \(Y_t=\beta_1+\beta_2X_t+\mu_t\) (Y: salario, X: ingreso) se sospecha que después de un evento ocurrido en el año t* (por ejemplo, una crisis) cambia el modelo. <b>a)</b> Defina una dummy. <b>b)</b> Escriba un modelo con la dummy que permita identificar el cambio. <b>c)</b> Explique sus coeficientes.</p>`,
saber:[String.raw`Para que cambie todo el modelo, la dummy entra sola (intercepto) y multiplicando a X (pendiente). Probar que ambos δ son cero es la prueba de Chow.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(D_t=1\) si \(t\ge t^*\) y 0 antes.</li>
<li><b>b)</b> \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\).</li>
<li><b>c)</b> Antes: \(\beta_1+\beta_2X\). Después: \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\).<br>β₁ y β₂ son el intercepto y el efecto marginal del ingreso antes del evento. δ₁ es el cambio del intercepto y δ₂ el cambio del efecto marginal después del evento.</li>
<li>Pruebas: δ₁ = 0 (t), δ₂ = 0 (t) y δ₁ = δ₂ = 0 (F con q = 2, igual a la F de Chow).</li></ol>`,
res:String.raw`<p>\(Y=\beta_1+\delta_1D+\beta_2X+\delta_2DX+\mu\), con D = 1 desde t*: δ₁ cambia el intercepto y δ₂ la pendiente. H₀: δ₁ = δ₂ = 0 es la prueba de Chow.</p>`},

{id:"ep3-15", n:"15", t:"Consumo antes y después de una reforma", tipo:"Interpretación", temas:["dicotomicas"], tool:{id:"t-calc",pre:"coef:e15",lbl:"Abrir en la Calculadora (modelo ya estimado)"},
enun:String.raw`<p>\(\hat Y_t=2+0{,}5X_t+2{,}5D_t-0{,}25(D_tX_t)\), con D = 1 después de una reforma, Y el consumo y X la renta. <b>a)</b> Interprete los coeficientes. <b>b)</b> Escriba la ecuación antes y después. <b>c)</b> ¿Cómo cambia el intercepto? <b>d)</b> ¿Y la pendiente? <b>e)</b> Dé una interpretación económica.</p>`,
saber:[String.raw`La regla de siempre: D = 0 es el grupo base; el coeficiente de D cambia el intercepto y el de D·X cambia la pendiente.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> 2 es el consumo autónomo antes de la reforma; 0,5 la propensión marginal a consumir antes; 2,5 el aumento del consumo autónomo con la reforma; −0,25 la disminución de la propensión marginal con la reforma.</li>
<li><b>b)</b> Antes (D = 0): \(\hat Y=2+0{,}5X\). Después (D = 1): \(\hat Y=(2+2{,}5)+(0{,}5-0{,}25)X=4{,}5+0{,}25X\).</li>
<li><b>c)</b> El intercepto sube 2,5, de 2 a 4,5.</li>
<li><b>d)</b> La pendiente baja 0,25, de 0,5 a 0,25: la propensión marginal se reduce a la mitad.</li>
<li><b>e)</b> Las rectas se cruzan donde \(2+0{,}5X=4{,}5+0{,}25X\), es decir en X = 10. Con rentas menores que 10, el consumo es mayor después de la reforma; con rentas mayores, es menor. La reforma hace el consumo menos sensible a la renta, como lo haría, por ejemplo, un impuesto progresivo con transferencias a los hogares de menor renta.</li></ol>`,
res:String.raw`<p>Antes: \(\hat Y=2+0{,}5X\). Después: \(\hat Y=4{,}5+0{,}25X\). El consumo autónomo sube 2,5, la propensión marginal cae a la mitad y las rectas se cruzan en X = 10.</p>`},

{id:"ep3-16", n:"16", t:"Dummies estacionales trimestrales", tipo:"Interpretación", temas:["dicotomicas","series"], ej:"series",
enun:String.raw`<p>Con datos trimestrales 1998-2008 de demanda Y e ingreso X, y \(S_{jt}=1\) si t está en el trimestre j, se estiman:</p>
<div class="mj">\[(1)\;Y_t=\delta_1S_{1t}+\delta_2S_{2t}+\delta_3S_{3t}+\delta_4S_{4t}+\mu_t\qquad(2)\;Y_t=\beta_1+\theta_2S_{2t}+\theta_3S_{3t}+\theta_4S_{4t}+\mu_t\]\[(3)\;Y_t=\beta_1+\theta_1(S_{1t}X_t)+\theta_2(S_{2t}X_t)+\theta_3(S_{3t}X_t)+\theta_4(S_{4t}X_t)+\mu_t\]</div>
<p><b>a)</b> Interprete (1) y explique por qué no lleva intercepto. <b>b)</b> ¿Cómo se relacionan los coeficientes de (1) y (2)? <b>c)</b> Interprete (3) y explique por qué no se puede incluir \(X_t\).</p>`,
saber:[String.raw`\(S_1+S_2+S_3+S_4=1\) en cada trimestre: las cuatro dummies suman la columna de unos.`,
String.raw`Con solo dummies como regresores, cada coeficiente es una media de grupo (punto 7).`,
String.raw`<b>Multicolinealidad perfecta:</b> si una columna es combinación lineal exacta de otras, X′X no es invertible.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> δⱼ es la demanda media del trimestre j: \(\hat\delta_j=\bar Y_j\). No lleva intercepto porque \(S_1+S_2+S_3+S_4=1\). Con intercepto, la columna de unos sería la suma de las cuatro dummies (trampa de las dicótomas) y X′X no tendría inversa.</li>
<li><b>b)</b> En (2) el trimestre 1 es la base: \(\beta_1=\delta_1\) y \(\theta_j=\delta_j-\delta_1\) para j = 2, 3, 4. θⱼ es cuánto más (o menos) se demanda en el trimestre j que en el primero. Los dos modelos dan los mismos valores ajustados.</li>
<li><b>c)</b> En (3) el intercepto β₁ es común y θⱼ es el efecto marginal del ingreso en el trimestre j: la sensibilidad de la demanda al ingreso cambia con la estación. No se puede incluir \(X_t\) porque \(S_1X+S_2X+S_3X+S_4X=X\): la columna X sería la suma de las cuatro interacciones.</li></ol>`,
res:String.raw`<p>(1): δⱼ es la media del trimestre j, sin intercepto para evitar la trampa de las dicótomas. (2): β₁ = δ₁ y θⱼ = δⱼ − δ₁. (3): una pendiente del ingreso por trimestre; X no entra porque es la suma de las interacciones.</p>`});
TALLERES.push({id:"tl-dinardo", t:"Dinardo, capítulo 4", nl:"problema", sub:"Problemas 4.1 a 4.10 (Johnston y Dinardo)", anchor:"chow",
intro:`Los diez problemas del capítulo 4 que pide el taller. Los problemas 4.5 y 4.6 usan la tabla 4.4 del libro, que no viene en el taller: se deja el método para aplicarlo cuando tengas los datos.`,
puntos:[
{id:"d-41", n:"4.1", t:"Prueba de pronósticos con una observación nueva", tipo:"Pronósticos de Chow con matrices", temas:["ce-pronosticos","matrices"], tool:{id:"t-calc",pre:"mat:d41",lbl:"Abrir en la Calculadora (matrices)"},
enun:String.raw`<p>Una regresión simple con 20 observaciones da \(X'X=\begin{bmatrix}20&10\\10&30\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}30\\40\end{bmatrix}\) y \(\mathbf y'\mathbf y=75\). Llega una observación nueva con X = 2 y Y = 4. Haga una prueba de Chow de constancia de los parámetros.</p>`,
saber:[String.raw`\(\mathbf b=(X'X)^{-1}X'\mathbf y\), \(SCR=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y\) y \(s^2=SCR/(n-k)\).`,
String.raw`<b>Inversa 2 × 2:</b> \(\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\dfrac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\).`,
String.raw`<b>Pronósticos de Chow con n₂ = 1:</b> \(F=\dfrac{d^2}{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}\sim F(1,\,n-k)\), con \(d=y_0-\mathbf x_0'\mathbf b\) (punto 1 de los Ejercicios propuestos 3).`],
sol:String.raw`<ol class="steps">
<li>\(\det(X'X)=20(30)-10(10)=500\), así que \((X'X)^{-1}=\dfrac1{500}\begin{bmatrix}30&-10\\-10&20\end{bmatrix}\).</li>
<li>\(\mathbf b=\dfrac1{500}\begin{bmatrix}30(30)-10(40)\\-10(30)+20(40)\end{bmatrix}=\dfrac1{500}\begin{bmatrix}500\\500\end{bmatrix}=\begin{bmatrix}1\\1\end{bmatrix}\), es decir \(\hat Y=1+X\).</li>
<li>\(SCR=75-(1\cdot30+1\cdot40)=5\) y \(s^2=5/(20-2)=0{,}2778\).</li>
<li>Pronóstico: \(\hat y_0=1+1(2)=3\), así que el error es d = 4 − 3 = 1.</li>
<li>\(\mathbf x_0'(X'X)^{-1}\mathbf x_0=\dfrac{30(1)-2(10)(1)(2)+20(2^2)}{500}=\dfrac{70}{500}=0{,}14\), y el factor es 1,14.</li>
<li>\(F=\dfrac{1^2}{0{,}2778(1{,}14)}=3{,}158\sim F(1,18)\). Equivale a t = 1,777.</li>
<li>\(F_{0{,}05}(1,18)=4{,}414\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 3,158 &lt; 4,414: la observación nueva es compatible con la relación estimada \(\hat Y=1+X\). No hay evidencia de cambio en los parámetros.</p>`},

{id:"d-42", n:"4.2", t:"Estacionalidad y estabilidad con sumas de cuadrados", tipo:"Pruebas F con SCR", temas:["chow","dicotomicas","series"], tool:{id:"t-calc",pre:"rss:d42",lbl:"Abrir la parte de estabilidad en la Calculadora"},
enun:String.raw`<p>Con datos trimestrales 1958-1976 se estimó \(\hat Y=2{,}20+0{,}104X_2-3{,}48X_3+0{,}34X_4\), con SCE = 109,6 y SCR = 18,48. Al agregar tres dummies estacionales, la SCE sube a 114,8. Pruebe si hay estacionalidad. Las regresiones de los subperiodos 1958.1-1968.4 y 1969.1-1976.4 dan SCR de 9,32 y 7,46. Pruebe la constancia de la relación entre los dos subperiodos.</p>`,
saber:[String.raw`n = 19 años × 4 = 76 trimestres; subperiodos de 44 y 32. El modelo base tiene k = 4.`,
String.raw`<b>Con la misma variable dependiente, la STC no cambia:</b> STC = SCE + SCR = 128,08, así que si la SCE sube, la SCR baja lo mismo.`,
String.raw`<b>F de restricciones:</b> \(F=\dfrac{(SCR_R-SCR_{NR})/q}{SCR_{NR}/(n-k_{NR})}\). <b>Chow:</b> \(F=\dfrac{(SCR_R-SCR_1-SCR_2)/k}{(SCR_1+SCR_2)/(n-2k)}\).`],
sol:String.raw`<h5>Estacionalidad</h5><ol class="steps">
<li>H₀: los coeficientes de las tres dummies estacionales valen 0, con q = 3.</li>
<li>STC = 109,6 + 18,48 = 128,08. Con las dummies, \(SCR_{NR}=128{,}08-114{,}8=13{,}28\) y \(k_{NR}=7\).</li>
<li>\(F=\dfrac{(18{,}48-13{,}28)/3}{13{,}28/(76-7)}=\dfrac{1{,}7333}{0{,}1925}=9{,}01\sim F(3,69)\).</li>
<li>\(F_{0{,}05}(3,69)=2{,}74\), así que se rechaza H₀: hay estacionalidad.</li></ol>
<h5>Estabilidad entre subperiodos</h5><ol class="steps">
<li>H₀: los cuatro coeficientes son iguales en los dos subperiodos, con q = k = 4.</li>
<li>\(SCR_R=18{,}48\) (modelo original) y \(SCR_1+SCR_2=9{,}32+7{,}46=16{,}78\).</li>
<li>\(F=\dfrac{(18{,}48-16{,}78)/4}{16{,}78/(76-8)}=\dfrac{0{,}425}{0{,}2468}=1{,}72\sim F(4,68)\).</li>
<li>\(F_{0{,}05}(4,68)=2{,}51\), así que no se rechaza H₀: la relación es estable.</li></ol>`,
res:String.raw`<p>Estacionalidad: F = 9,01 &gt; 2,74, así que sí hay estacionalidad. Estabilidad: F = 1,72 &lt; 2,51, así que la relación es la misma en los dos subperiodos.</p>`},

{id:"d-43", n:"4.3", t:"Ventas de gasolina con dummies estacionales", tipo:"Interpretación y predicción", temas:["dicotomicas","series"],
enun:String.raw`<p>\(\hat Q=70-0{,}01P+0{,}2Y-1{,}5S_1+3{,}6S_2+4{,}7S_3\). Para el año siguiente, P = 110, 116, 122, 114 y Y = 100, 102, 104, 103 en los trimestres 1 a 4. Calcule las ventas esperadas de cada trimestre. ¿Qué ecuación obtendría otra investigadora que use \(S_2,S_3,S_4\)? ¿Y otro que suprima el intercepto y use las cuatro dummies?</p>`,
saber:[String.raw`El trimestre omitido (aquí el 4) es la base: su intercepto es 70. El de cada trimestre j es 70 + coeficiente de Sⱼ.`,
String.raw`Cambiar la base o quitar el intercepto es una reparametrización: las predicciones no cambian.`],
sol:String.raw`<ol class="steps">
<li>Interceptos por trimestre: T1 = 70 − 1,5 = 68,5; T2 = 73,6; T3 = 74,7; T4 = 70.</li>
<li>Predicciones:<br>T1: 68,5 − 0,01(110) + 0,2(100) = 87,40<br>T2: 73,6 − 1,16 + 20,4 = 92,84<br>T3: 74,7 − 1,22 + 20,8 = 94,28<br>T4: 70 − 1,14 + 20,6 = 89,46</li>
<li>Con base en el trimestre 1, cada coeficiente es la diferencia con 68,5: \(\hat Q=68{,}5-0{,}01P+0{,}2Y+5{,}1S_2+6{,}2S_3+1{,}5S_4\).</li>
<li>Sin intercepto y con las cuatro: \(\hat Q=-0{,}01P+0{,}2Y+68{,}5S_1+73{,}6S_2+74{,}7S_3+70S_4\).</li></ol>`,
res:String.raw`<p>Ventas esperadas: 87,40; 92,84; 94,28 y 89,46. Las tres versiones dan las mismas predicciones; solo cambia cómo se lee cada coeficiente.</p>`},

{id:"d-44", n:"4.4", t:"Dummies de clase: el intercepto es la media de la base", tipo:"Demostración", temas:["dicotomicas"],
enun:String.raw`<p>El modelo \(Y=\alpha_1+\gamma_2E_2+\gamma_3E_3+u\) se estima por MCO, con E₂ y E₃ dummies de las clases educativas 2 y 3. Muestre que \(\hat\alpha_1=\bar Y_1\), \(\hat\gamma_2=\bar Y_2-\bar Y_1\) y \(\hat\gamma_3=\bar Y_3-\bar Y_1\).</p>`,
saber:[String.raw`Es el literal b del punto 7 de los Ejercicios propuestos 3. Se usan las sumas de dummies excluyentes: \(\sum E_j=n_j\), \(\sum E_2E_3=0\) y \(\sum E_jY=n_j\bar Y_j\).`],
sol:String.raw`<ol class="steps">
<li>\(X'X=\begin{bmatrix}n&n_2&n_3\\n_2&n_2&0\\n_3&0&n_3\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}n_1\bar Y_1+n_2\bar Y_2+n_3\bar Y_3\\n_2\bar Y_2\\n_3\bar Y_3\end{bmatrix}\).</li>
<li>Filas 2 y 3: \(\hat\alpha_1+\hat\gamma_2=\bar Y_2\) y \(\hat\alpha_1+\hat\gamma_3=\bar Y_3\).</li>
<li>Fila 1: \(n\hat\alpha_1+n_2\hat\gamma_2+n_3\hat\gamma_3=\sum Y\). Sustituye las filas 2 y 3: \(n\hat\alpha_1+n_2(\bar Y_2-\hat\alpha_1)+n_3(\bar Y_3-\hat\alpha_1)=n_1\bar Y_1+n_2\bar Y_2+n_3\bar Y_3\).</li>
<li>Simplifica con \(n-n_2-n_3=n_1\): \(n_1\hat\alpha_1=n_1\bar Y_1\), así que \(\hat\alpha_1=\bar Y_1\). Luego \(\hat\gamma_j=\bar Y_j-\bar Y_1\).</li></ol>`,
res:String.raw`<p>El intercepto es la media de la clase omitida y cada γ la diferencia de medias con ella.</p>`},

{id:"d-45", n:"4.5", t:"Tabla 4.4: medias por educación y sexo", tipo:"Necesita la tabla 4.4 del libro", temas:["dicotomicas"], tool:{id:"t-datos",lbl:"Abrir el Laboratorio para cargar la tabla 4.4"},
enun:String.raw`<p>Con los datos de la tabla 4.4, estime \(Y=\alpha_1E_1+\alpha_2E_2+\alpha_3E_3+\beta_2S_2+u\) y calcule las medias resultantes de la tabla 4.5. Compárelas con las del texto y comente. Repita con \(Y=\mu+\alpha_1E_1+\alpha_2E_2+\beta_2S_2+u\).</p>`,
saber:[String.raw`Primera especificación: sin intercepto y con las tres dummies de educación, así que cada αⱼ es el intercepto de la clase j para el sexo base (S₂ = 0), y β₂ es la diferencia por sexo, igual en todas las clases.`,
String.raw`Segunda especificación: con intercepto μ, la clase 3 es la base: μ = α₃ de la primera, y los α son diferencias frente a la clase 3.`],
sol:String.raw`<ol class="steps">
<li>Carga la tabla 4.4 en el Laboratorio: Y, una columna por clase educativa (0/1) y la de sexo.</li>
<li>Estima la primera especificación quitando el intercepto (opción «Con intercepto» desmarcada) con E₁, E₂, E₃ y S₂.</li>
<li>Media estimada de cada celda: \(\hat\alpha_j\) para S₂ = 0 y \(\hat\alpha_j+\hat\beta_2\) para S₂ = 1. Arma la tabla 2 × 3 y compárala con la del texto.</li>
<li>Las medias estimadas no coinciden exactamente con las observadas de cada celda: el modelo impone la misma brecha por sexo en todas las clases (sin interacción), como en el literal c del punto 7.</li>
<li>Segunda especificación: \(\hat\mu=\hat\alpha_3\), y los nuevos coeficientes de E₁ y E₂ son \(\hat\alpha_1-\hat\alpha_3\) y \(\hat\alpha_2-\hat\alpha_3\). Las medias estimadas son idénticas.</li></ol>`,
res:String.raw`<p>Las dos especificaciones dan las mismas medias estimadas. Difieren de las observadas porque el modelo no tiene interacción entre educación y sexo. Los números exactos requieren la tabla 4.4 del libro.</p>`},

{id:"d-46", n:"4.6", t:"Tabla 4.4 con interacciones y sin constante", tipo:"Necesita la tabla 4.4 del libro", temas:["dicotomicas"], tool:{id:"t-datos",lbl:"Abrir el Laboratorio para cargar la tabla 4.4"},
enun:String.raw`<p>Con los datos de la tabla 4.4, estime una especificación sin término constante, con dummies que permitan efectos de interacción. Calcule la versión resultante de la tabla 4.6 y compárela con la del texto.</p>`,
saber:[String.raw`Con una dummy por cada celda (clase × sexo) y sin intercepto, cada coeficiente es la media de su celda (como en el punto 7a, ahora con 6 grupos).`],
sol:String.raw`<ol class="steps">
<li>Crea en el Laboratorio las 6 interacciones \(E_j\cdot S_1\) y \(E_j\cdot S_2\), con j = 1, 2, 3 (sección «2. Crear variables», por ejemplo <code>E1*S2</code>).</li>
<li>Estima Y sobre las 6 interacciones sin intercepto. X′X es diagonal con el tamaño de cada celda, así que cada coeficiente es la media observada de la celda.</li>
<li>La tabla 4.6 resultante coincide con las medias observadas por celda. Ahora la brecha por sexo puede ser distinta en cada clase educativa.</li>
<li>Para probar si hace falta la interacción, compara este modelo (no restringido) con el del problema 4.5 (restringido) mediante una F con q = 2.</li></ol>`,
res:String.raw`<p>Con interacciones completas y sin constante, cada coeficiente es la media de su celda. Los números requieren la tabla 4.4 del libro.</p>`},

{id:"d-47", n:"4.7", t:"Familias con aumento de ingreso: ¿consumen distinto?", tipo:"Prueba de Chow con datos", temas:["chow","dicotomicas"], tool:{id:"t-datos",pre:"familias",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Hay 12 familias con su consumo semanal Y y su ingreso X: (70, 80), (76, 95*), (91, 105), (100, 115), (105, 125*), (113, 135*), (122, 145), (120, 155), (146, 165*), (135, 175*), (147, 185*), (155, 200*). El asterisco indica que la familia tuvo un aumento de ingreso. Con una función de consumo lineal, pruebe si el comportamiento de las familias con aumento difiere del de las demás.</p>`,
saber:[String.raw`Los grupos no están ordenados: se define D = 1 para las familias con aumento y se usa el modelo con dummies, o se estima cada grupo por separado.`,
String.raw`<b>Chow:</b> k = 2 y n − 2k = 8 gl. Para probar solo un intercepto distinto, q = 1 en el modelo con D sin interacción.`],
sol:String.raw`<ol class="steps">
<li>H₀: δ₁ = δ₂ = 0 en \(Y=\beta_1+\delta_1D+\beta_2X+\delta_2DX+u\) (el mismo comportamiento) frente a H₁: alguna diferencia.</li>
<li>Sin aumento (n = 5): \(\hat Y=16{,}762+0{,}6986X\) y SCR = 57,193. Con aumento (n = 7): \(\hat Y=10{,}306+0{,}7452X\) y SCR = 247,900. \(SCR_{NR}=305{,}094\).</li>
<li>Restringido: \(\hat Y=13{,}013+0{,}7285X\) y \(SCR_R=310{,}969\).</li>
<li>\(F=\dfrac{(310{,}969-305{,}094)/2}{305{,}094/8}=\dfrac{2{,}938}{38{,}137}=0{,}077\sim F(2,8)\), con crítico 4,459 y p = 0,93. No se rechaza H₀.</li>
<li>Solo intercepto distinto: \(\hat Y=12{,}892-0{,}374D+0{,}731X\), SCR = 310,653 y \(F=\dfrac{(310{,}969-310{,}653)/1}{310{,}653/9}=0{,}009<F(1,9)=5{,}117\).</li></ol>`,
res:String.raw`<p>F = 0,077 (p = 0,93): las familias que tuvieron aumento de ingreso no se comportan distinto. Tampoco difiere el consumo autónomo (F = 0,009).</p>`},

{id:"d-48", n:"4.8", t:"Función de producción: estabilidad entre 1929-1948 y 1949-1967", tipo:"Chow con s", temas:["chow"], tool:{id:"t-calc",pre:"rss:d48",lbl:"Abrir en la Calculadora (SCR o s)"},
enun:String.raw`<p>Con datos anuales 1929-1967 (n = 39), \(\widehat{\log Q}=-3{,}8766+1{,}4106\log L+0{,}4162\log K\), con R² = 0,9937 y s = 0,03755. En 1929-1948: \(-4{,}0576+1{,}6167\log L+0{,}2197\log K\), con s = 0,04573. En 1949-1967: \(-1{,}9564+0{,}8336\log L+0{,}6631\log K\), con s = 0,02185. Pruebe la estabilidad de la función de producción entre los dos subperiodos.</p>`,
saber:[String.raw`<b>SCR a partir de s:</b> \(s^2=SCR/(n-k)\), así que \(SCR=s^2(n-k)\). Aquí k = 3.`,
String.raw`n₁ = 20 (1929-1948) y n₂ = 19 (1949-1967).`],
sol:String.raw`<ol class="steps">
<li>\(SCR_R=0{,}03755^2(39-3)=0{,}050760\).</li>
<li>\(SCR_1=0{,}04573^2(20-3)=0{,}035551\) y \(SCR_2=0{,}02185^2(19-3)=0{,}007639\). En total, \(SCR_{NR}=0{,}043190\).</li>
<li>\(F=\dfrac{(0{,}050760-0{,}043190)/3}{0{,}043190/(39-6)}=\dfrac{0{,}002523}{0{,}001309}=1{,}93\sim F(3,33)\).</li>
<li>\(F_{0{,}05}(3,33)=2{,}89\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 1,93 &lt; 2,89: la función de producción es estable entre los dos subperiodos, aunque las elasticidades puntuales parezcan distintas.</p>`},

{id:"d-49", n:"4.9", t:"Urbano y rural con información resumida", tipo:"Chow con matrices", temas:["chow","matrices"], tool:{id:"t-calc",pre:"mat:d49",lbl:"Abrir en la Calculadora (matrices)"},
enun:String.raw`<p>Hay 10 observaciones urbanas con \(X'X=\begin{bmatrix}20&20\\20&25\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}10\\20\end{bmatrix}\) y \(\mathbf y'\mathbf y=30\), y 10 rurales con \(X'X=\begin{bmatrix}10&10\\10&20\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}8\\20\end{bmatrix}\) y \(\mathbf y'\mathbf y=24\). Pruebe que la misma relación vale en las dos áreas.</p>`,
saber:[String.raw`<b>Las matrices de momentos se suman:</b> si se apilan las muestras, \(X'X=X_1'X_1+X_2'X_2\), \(X'\mathbf y=X_1'\mathbf y_1+X_2'\mathbf y_2\) y \(\mathbf y'\mathbf y=\mathbf y_1'\mathbf y_1+\mathbf y_2'\mathbf y_2\). Así se obtiene el restringido sin los datos.`,
String.raw`\(SCR=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y\) en cada muestra.`],
sol:String.raw`<ol class="steps">
<li><b>Urbano:</b> \(\det=20(25)-20(20)=100\), así que \(\mathbf b_1=\dfrac1{100}\begin{bmatrix}25&-20\\-20&20\end{bmatrix}\begin{bmatrix}10\\20\end{bmatrix}=\begin{bmatrix}-1{,}5\\2\end{bmatrix}\). \(SCR_1=30-(-1{,}5\cdot10+2\cdot20)=5\).</li>
<li><b>Rural:</b> \(\det=100\), así que \(\mathbf b_2=\dfrac1{100}\begin{bmatrix}20&-10\\-10&10\end{bmatrix}\begin{bmatrix}8\\20\end{bmatrix}=\begin{bmatrix}-0{,}4\\1{,}2\end{bmatrix}\). \(SCR_2=24-(-3{,}2+24)=3{,}2\).</li>
<li><b>Restringido:</b> \(X'X=\begin{bmatrix}30&30\\30&45\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}18\\40\end{bmatrix}\) y \(\mathbf y'\mathbf y=54\). \(\mathbf b=(-0{,}8667;\;1{,}4667)\) y \(SCR_R=54-(-15{,}6+58{,}667)=10{,}933\).</li>
<li>\(F=\dfrac{(10{,}933-8{,}2)/2}{8{,}2/16}=\dfrac{1{,}367}{0{,}5125}=2{,}667\sim F(2,16)\).</li>
<li>\(F_{0{,}05}(2,16)=3{,}63\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 2,667 &lt; 3,63: la misma relación vale en las áreas urbana y rural.</p>`},

{id:"d-410", n:"4.10", t:"Gasto en vacaciones por grupos de ingreso y elasticidad común", tipo:"Chow con varianzas y prueba t", temas:["chow","inferencia"], tool:{id:"t-calc",pre:"rss:d410",lbl:"Abrir en la Calculadora (SCR o varianzas)"},
enun:String.raw`<p>En 256 hogares, las regresiones log-log de gasto en vacaciones sobre ingreso dan: ingreso bajo, pendiente 0,02, varianza residual 0,26 y 102 hogares; medio, 0,09, 0,42 y 102; alto, 0,14, 0,30 y 52; todos, 0,07, 0,38 y 256. Pruebe si la función de gasto es la misma en todos los grupos. ¿Qué información adicional necesitaría para probar si la elasticidad es la misma? Si la varianza del log del ingreso en la muestra completa es 24, pruebe que la elasticidad para todos los hogares es 0,10.</p>`,
saber:[String.raw`<b>SCR a partir de la varianza residual:</b> \(SCR=s^2(n-2)\) en cada regresión simple.`,
String.raw`<b>Chow con m = 3:</b> \(F\sim F((m-1)k,\,n-mk)=F(4,250)\).`,
String.raw`<b>Error estándar de la pendiente:</b> \(ee(b)=\sqrt{s^2/\sum(x-\bar x)^2}\), con \(\sum(x-\bar x)^2=n\operatorname{var}(x)\).`],
sol:String.raw`<h5>¿La misma función?</h5><ol class="steps">
<li>SCR por grupo: 0,26(100) = 26, 0,42(100) = 42 y 0,30(50) = 15, que suman \(SCR_{NR}=83\).</li>
<li>\(SCR_R=0{,}38(254)=96{,}52\).</li>
<li>\(F=\dfrac{(96{,}52-83)/4}{83/250}=\dfrac{3{,}38}{0{,}332}=10{,}18\sim F(4,250)\), con crítico 2,41. Se rechaza H₀: la función no es la misma.</li></ol>
<h5>¿La misma elasticidad?</h5><p>Hace falta el error estándar de cada pendiente, es decir, la varianza (o la suma de cuadrados) del log del ingreso dentro de cada grupo. También se podría estimar un modelo con interceptos distintos y pendiente común y compararlo por F con el no restringido.</p>
<h5>Elasticidad igual a 0,10</h5><ol class="steps">
<li>\(\sum(x-\bar x)^2=256(24)=6.144\), así que \(ee(b)=\sqrt{0{,}38/6.144}=0{,}00786\).</li>
<li>H₀: β = 0,10. \(t=\dfrac{0{,}07-0{,}10}{0{,}00786}=-3{,}81\), y \(|t|>1{,}97\), así que se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 10,18 &gt; 2,41: la función de gasto difiere entre grupos de ingreso. La elasticidad conjunta 0,07 es significativamente distinta de 0,10 (t = −3,81).</p>`}]});
