
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
<h5>Para qué sirve</h5><p>Con normalidad, \(\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/\sigma^2\sim\chi^2(n_2)\). Al reemplazar σ² por \(s_1^2=RSS_1/(n_1-k)\) sale el estadístico (9) del curso, \(F=\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/(n_2s_1^2)\sim F(n_2,n_1-k)\), que da el mismo número que la forma (8) con las RSS.</p>`,
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
<li>Para probar las dos cosas a la vez (δ₁ = δ₂ = 0, cambio estructural completo) hace falta una F conjunta o las RSS de los dos modelos. Dos pruebas t por separado no bastan, porque los estimadores están correlacionados.</li></ol>`,
res:String.raw`<p>Hombres: \(\hat Y=186{,}47+0{,}23X\); mujeres: \(\hat Y=60{,}47+0{,}10X\). La diferencia con la misma renta es \(-126-0{,}13X\). Al 5 %, la propensión marginal no difiere por género (t = −1,30) y el consumo autónomo sí (t = −2,21).</p>`},

{id:"ep3-3", n:"3", t:"Educación urbana y rural: estimar, R², cambio estructural y pronóstico", tipo:"Cálculo con datos", temas:["mco-matricial","dicotomicas","chow"], ej:"mco-matricial", tool:{id:"t-datos",pre:"educacion",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Años de educación (Y) y renta familiar (X) de 8 jóvenes: urbanos (16, 8), (18, 13), (14, 9), (18, 12) y rurales (12, 7), (10, 3), (11, 6), (14, 10). Se propone \(Y_i=\beta_1D_{1i}+\beta_2D_{1i}X_i+\beta_3D_{2i}+\beta_4D_{2i}X_i+\mu_i\), con D₁ = 1 en la zona urbana y D₂ = 1 en la rural.</p><p><b>a)</b> Interprete los coeficientes y su signo esperado. <b>b)</b> Estime el modelo y explique el R². <b>c)</b> Con normalidad, contraste el cambio estructural entre zonas. <b>d)</b> Pronostique puntualmente y por intervalos los años de educación de un joven urbano con renta 10,5.</p>`,
saber:[String.raw`<b>Sin intercepto común:</b> como \(D_1+D_2=1\), el modelo ya tiene un intercepto por zona. Agregar β₀ causaría multicolinealidad perfecta.`,
String.raw`<b>X′X por bloques:</b> las columnas de una zona valen 0 en la otra, así que X′X es diagonal por bloques y MCO equivale a estimar <b>una regresión simple por zona</b>.`,
String.raw`<b>Regresión simple:</b> \(b=\dfrac{n\sum xy-\sum x\sum y}{n\sum x^2-(\sum x)^2}\), \(a=\bar y-b\bar x\), y \(RSS=\left(\sum y^2-n\bar y^2\right)-b^2\left(\sum x^2-n\bar x^2\right)\).`,
String.raw`<b>R² centrado:</b> \(R^2=1-RSS/TSS\), con \(TSS=\sum(y-\bar y)^2\). Se usa el centrado porque el modelo tiene intercepto implícito.`,
String.raw`<b>Chow:</b> el restringido es una sola recta para todos: \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\), con q = 2 y k = 4.`,
String.raw`<b>Pronóstico:</b> \(\hat y_0=\mathbf x_0'\mathbf b\); \(ee(\text{media})=\sqrt{s^2\mathbf x_0'(X'X)^{-1}\mathbf x_0}\) y \(ee(\text{individual})=\sqrt{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}\).`],
sol:String.raw`<h5>a) Significado y signos</h5><p>Y son los años de educación y X la renta familiar. β₁ y β₃ son los interceptos: los años de educación esperados de un joven urbano y de uno rural cuando la renta es 0. β₂ y β₄ son las pendientes, los coeficientes que acompañan a la renta X: cuántos años <b>de educación</b> más se esperan cuando la renta familiar sube una unidad, β₂ en la zona urbana y β₄ en la rural. Signos esperados: positivos, porque más renta permite estudiar más. Se espera además β₁ &gt; β₃, por el mejor acceso a la educación en la ciudad.</p>
<h5>b) Estimación</h5><ol class="steps">
<li><b>Urbana</b> (n = 4): Σx = 42, Σy = 66, Σx² = 458, Σxy = 704. Promedios: \(\bar x_U=42/4=10{,}5\) (renta media urbana) y \(\bar y_U=66/4=16{,}5\) (educación media urbana).<br>Pendiente: \(\hat\beta_2=\dfrac{4(704)-42(66)}{4(458)-42^2}=\dfrac{44}{68}=0{,}6471\).<br>Intercepto: \(\hat\beta_1=\bar y_U-\hat\beta_2\bar x_U=16{,}5-0{,}6471(10{,}5)=9{,}7059\).</li>
<li><b>Rural</b> (n = 4): Σx = 26, Σy = 47, Σx² = 194, Σxy = 320. Promedios: \(\bar x_R=26/4=6{,}5\) y \(\bar y_R=47/4=11{,}75\).<br>Pendiente: \(\hat\beta_4=\dfrac{4(320)-26(47)}{4(194)-26^2}=\dfrac{58}{100}=0{,}58\).<br>Intercepto: \(\hat\beta_3=\bar y_R-\hat\beta_4\bar x_R=11{,}75-0{,}58(6{,}5)=7{,}98\).</li>
<li>Modelo estimado: \(\hat Y=9{,}706D_1+0{,}647D_1X+7{,}980D_2+0{,}580D_2X\).</li>
<li><b>RSS de cada zona</b> con \(RSS=\left(\sum y^2-n\bar y^2\right)-b^2\left(\sum x^2-n\bar x^2\right)\): la variación total de Y menos la parte que explica la recta.<br>
<b>Urbana:</b> \(\sum y^2=16^2+18^2+14^2+18^2=1100\), así que \(\sum y^2-n\bar y^2=1100-4(16{,}5)^2=11\); \(\sum x^2-n\bar x^2=458-4(10{,}5)^2=17\). \(RSS_U=11-0{,}6471^2(17)=11-7{,}1176=3{,}8824\).<br>
<b>Rural:</b> \(\sum y^2=12^2+10^2+11^2+14^2=561\), así que \(561-4(11{,}75)^2=8{,}75\); \(194-4(6{,}5)^2=25\). \(RSS_R=8{,}75-0{,}58^2(25)=8{,}75-8{,}41=0{,}34\).</li>
<li><b>Comprobación con los errores</b> \(e=Y-\hat Y\), que es la definición \(RSS=\sum e^2\):
<div class="tbl"><table><tr><th>Zona</th><th>X</th><th>Y</th><th>Ŷ</th><th>e</th><th>e²</th></tr>
<tr><td>Urbana</td><td>8</td><td>16</td><td>14,882</td><td>1,118</td><td>1,2491</td></tr>
<tr><td>Urbana</td><td>13</td><td>18</td><td>18,118</td><td>−0,118</td><td>0,0138</td></tr>
<tr><td>Urbana</td><td>9</td><td>14</td><td>15,529</td><td>−1,529</td><td>2,3391</td></tr>
<tr><td>Urbana</td><td>12</td><td>18</td><td>17,471</td><td>0,529</td><td>0,2803</td></tr>
<tr><th colspan="5">Suma urbana</th><th>3,8824</th></tr>
<tr><td>Rural</td><td>7</td><td>12</td><td>12,04</td><td>−0,04</td><td>0,0016</td></tr>
<tr><td>Rural</td><td>3</td><td>10</td><td>9,72</td><td>0,28</td><td>0,0784</td></tr>
<tr><td>Rural</td><td>6</td><td>11</td><td>11,46</td><td>−0,46</td><td>0,2116</td></tr>
<tr><td>Rural</td><td>10</td><td>14</td><td>13,78</td><td>0,22</td><td>0,0484</td></tr>
<tr><th colspan="5">Suma rural</th><th>0,3400</th></tr></table></div></li>
<li>El RSS del modelo completo (no restringido) es la suma de los dos: \(RSS_{NR}=3{,}8824+0{,}34=4{,}2222\), y \(s^2=4{,}2222/(8-4)=1{,}0556\).</li>
<li>Con los 8 jóvenes, \(\sum y^2=1661\) y el promedio general es \(\bar y=113/8=14{,}125\). \(TSS=\sum y^2-n\bar y^2=1661-8(14{,}125)^2=64{,}875\), y \(R^2=1-4{,}2222/64{,}875=0{,}935\).</li>
<li><b>Errores estándar.</b> Miden qué tan preciso es cada coeficiente: \(S_{b_j}=\sqrt{s^2\,c_{jj}}\), donde \(c_{jj}\) es el elemento j de la diagonal de \((X'X)^{-1}\). Se usa la misma \(s^2=1{,}0556\) para las dos zonas, porque es un solo modelo con una sola varianza del error.<br>
Como X′X es diagonal por bloques, se invierte cada bloque 2 × 2 por separado:<br>
<b>Urbana:</b> \(\begin{bmatrix}n&\sum x\\\sum x&\sum x^2\end{bmatrix}^{-1}=\begin{bmatrix}4&42\\42&458\end{bmatrix}^{-1}=\dfrac1{68}\begin{bmatrix}458&-42\\-42&4\end{bmatrix}\), con diagonal \(458/68=6{,}7353\) y \(4/68=0{,}0588\).<br>
<b>Rural:</b> \(\begin{bmatrix}4&26\\26&194\end{bmatrix}^{-1}=\dfrac1{100}\begin{bmatrix}194&-26\\-26&4\end{bmatrix}\), con diagonal \(1{,}94\) y \(0{,}04\).
<div class="tbl"><table><tr><th>Coeficiente</th><th>c<sub>jj</sub></th><th>Varianza = s²·c<sub>jj</sub></th><th>Error estándar</th></tr>
<tr><td>β₁ (intercepto urbano)</td><td>6,7353</td><td>1,0556 × 6,7353 = 7,1095</td><td>√7,1095 = 2,666</td></tr>
<tr><td>β₂ (pendiente urbana)</td><td>0,0588</td><td>1,0556 × 0,0588 = 0,0621</td><td>√0,0621 = 0,249</td></tr>
<tr><td>β₃ (intercepto rural)</td><td>1,94</td><td>1,0556 × 1,94 = 2,0478</td><td>√2,0478 = 1,431</td></tr>
<tr><td>β₄ (pendiente rural)</td><td>0,04</td><td>1,0556 × 0,04 = 0,0422</td><td>√0,0422 = 0,205</td></tr></table></div>
Es lo mismo que las fórmulas de la regresión simple: para la pendiente, \(S_b=\sqrt{s^2/S_{XX}}\) (urbana: \(\sqrt{1{,}0556/17}=0{,}249\)), y para el intercepto, \(S_a=\sqrt{s^2\sum x^2/(n\,S_{XX})}\) (urbana: \(\sqrt{1{,}0556(458)/(4\cdot17)}=2{,}666\)), con \(S_{XX}=\sum x^2-n\bar x^2\).<br>
<b>Para qué sirven:</b> con ellos se arma la prueba t, \(t=b_j/S_{b_j}\). Por ejemplo, para la pendiente urbana \(t=0{,}6471/0{,}249=2{,}60\) y para la rural \(t=0{,}58/0{,}205=2{,}82\); el crítico es \(t_{0{,}025}(4)=2{,}776\).</li></ol>
<p><b>Lectura del R²:</b> la renta y la zona explican el 93,5 % de la variación de los años de educación.</p>
<h5>c) Cambio estructural</h5><ol class="steps">
<li>H₀: β₁ = β₃ y β₂ = β₄ (una sola recta) frente a H₁: al menos una diferencia. Son q = 2 restricciones.</li>
<li>Restringido \(Y=\alpha+\beta X\) con los 8 datos: Σx = 68, Σy = 113, Σx² = 652, Σxy = 1024. \(\hat\beta=\dfrac{8(1024)-68(113)}{8(652)-68^2}=\dfrac{508}{592}=0{,}8581\) y, con los promedios generales \(\bar x=68/8=8{,}5\) y \(\bar y=113/8=14{,}125\), \(\hat\alpha=14{,}125-0{,}8581(8{,}5)=6{,}831\). Con la misma fórmula: \(\sum y^2-n\bar y^2=1661-8(14{,}125)^2=64{,}875\) y \(\sum x^2-n\bar x^2=652-8(8{,}5)^2=74\), así que \(RSS_R=64{,}875-0{,}8581^2(74)=64{,}875-54{,}490=10{,}3851\).</li>
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
String.raw`<b>Varianza de los estimadores:</b> \(\widehat{\operatorname{var}}(\mathbf b)=s^2(X'X)^{-1}\) con \(s^2=RSS/(n-k)\).`,
String.raw`<b>Descomposición:</b> \(TSS=ESS+RSS\) y \(R^2=ESS/TSS\).`],
sol:String.raw`<h5>a) La demostración</h5><ol class="steps">
<li>\(X'X=\begin{bmatrix}n&n_L\\n_L&n_L\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}\sum W\\ \sum_L W\end{bmatrix}=\begin{bmatrix}n_L\bar W_L+n_A\bar W_A\\ n_L\bar W_L\end{bmatrix}\).</li>
<li>Segunda ecuación normal: \(n_L\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L\), así que \(\hat\beta_1+\hat\beta_2=\bar W_L\).</li>
<li>Primera: \(n\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L+n_A\bar W_A\). Escribe \(n=n_A+n_L\): \(n_A\hat\beta_1+n_L(\hat\beta_1+\hat\beta_2)=n_L\bar W_L+n_A\bar W_A\). Con el paso anterior queda \(n_A\hat\beta_1=n_A\bar W_A\), es decir \(\hat\beta_1=\bar W_A\).</li></ol>
<h5>b) Estimación</h5><p>\(\hat\beta_1=150\) y \(\hat\beta_2=250-150=100\), así que \(\hat W=150+100D\). El salario medio general es \(\bar W=(300\cdot250+200\cdot150)/500=210\).</p>
<h5>c) Errores estándar</h5><ol class="steps">
<li>Los residuos son las desviaciones de cada salario respecto a la media de su grupo. Con la desviación típica muestral (divisor n − 1): \(RSS=(n_L-1)s_L^2+(n_A-1)s_A^2=299(50^2)+199(30^2)=926.600\).</li>
<li>\(s^2=RSS/(n-k)=926.600/498=1.860{,}64\).</li>
<li>\((X'X)^{-1}=\dfrac{1}{n\,n_L-n_L^2}\begin{bmatrix}n_L&-n_L\\-n_L&n\end{bmatrix}=\dfrac{1}{n_Ln_A}\begin{bmatrix}n_L&-n_L\\-n_L&n\end{bmatrix}\).</li>
<li>\(ee(\hat\beta_1)=\sqrt{s^2/n_A}=\sqrt{1.860{,}64/200}=3{,}050\).<br>\(ee(\hat\beta_2)=\sqrt{s^2\left(\tfrac1{n_L}+\tfrac1{n_A}\right)}=\sqrt{1.860{,}64\left(\tfrac1{300}+\tfrac1{200}\right)}=3{,}938\).</li></ol>
<p class="hint">Si la desviación típica se define con divisor n, entonces RSS = 300(2.500) + 200(900) = 930.000 y los errores estándar cambian un poco (3,056 y 3,945).</p>
<h5>d) R²</h5><p>\(ESS=\sum(\hat W-\bar W)^2=300(250-210)^2+200(150-210)^2=480.000+720.000=1.200.000\), y \(TSS=ESS+RSS=2.126.600\). Por tanto \(R^2=1.200.000/2.126.600=0{,}564\).</p>
<h5>e) Contraste</h5><p>H₀: β₂ = 0 (sin diferencia salarial) frente a H₁: β₂ ≠ 0 (o β₂ &gt; 0 si se quiere probar que los licenciados ganan más). \(t=100/3{,}938=25{,}40\sim t(498)\), y \(t_{0{,}025}\approx1{,}965\). Se rechaza H₀ con mucha holgura (p ≈ 0): hay diferencia salarial. Esta prueba t es la misma que la de diferencia de medias con varianza combinada.</p>`,
res:String.raw`<p>\(\hat W=150+100D\), con ee de 3,050 y 3,938, y R² = 0,564. Contraste t = 25,4: los licenciados ganan en promedio 100 mil pesetas más al mes.</p>`},

{id:"ep3-5", n:"5", t:"Salarios y experiencia por género: ¿es distinta la ecuación?", tipo:"Prueba de Chow con datos", temas:["dicotomicas","chow"], tool:{id:"t-datos",pre:"salarios",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Hay 17 personas: 9 hombres y 8 mujeres, con su sueldo W y sus años de experiencia X (los datos están en el taller). El modelo es \(W_i=\beta_1D_{1i}+\beta_2X_{1i}+\beta_1'D_{2i}+\beta_2'X_{2i}+\mu_i\), con D₁ = 1 para los hombres, D₂ = 1 para las mujeres y \(X_{ji}=D_{ji}X_i\).</p><p><b>a)</b> Interprete y estime los coeficientes. <b>b)</b> ¿Es el género significativo? Plantee la hipótesis y haga la prueba.</p>`,
saber:[String.raw`Es el mismo diseño del punto 3: un intercepto y una pendiente por grupo sin intercepto común. MCO equivale a una regresión simple por grupo, y \(RSS_{NR}=RSS_H+RSS_M\).`,
String.raw`<b>Chow:</b> H₀: \(\beta_1=\beta_1'\) y \(\beta_2=\beta_2'\), con q = 2, k = 4 y \(F\sim F(2,\,n-4)\).`],
sol:String.raw`<h5>a) Estimación e interpretación</h5><ol class="steps">
<li><b>Hombres</b> (n = 9): Σx = 117, Σw = 24,06, Σx² = 2491, Σxw = 377,25. \(\hat\beta_2=\dfrac{9(377{,}25)-117(24{,}06)}{9(2491)-117^2}=\dfrac{580{,}23}{8730}=0{,}06646\) y \(\hat\beta_1=2{,}6733-0{,}06646(13)=1{,}8093\).</li>
<li><b>Mujeres</b> (n = 8): Σx = 130, Σw = 23,96, Σx² = 2574, Σxw = 425,25. \(\hat\beta_2'=\dfrac{8(425{,}25)-130(23{,}96)}{8(2574)-130^2}=\dfrac{287{,}2}{3692}=0{,}07779\) y \(\hat\beta_1'=2{,}995-0{,}07779(16{,}25)=1{,}7309\).</li>
<li>β₁ = 1,809 y β′₁ = 1,731 son el sueldo de entrada (sin experiencia) de hombres y mujeres. β₂ = 0,0665 y β′₂ = 0,0778 son lo que aumenta el sueldo por cada año de experiencia.</li></ol>
<h5>b) ¿Es significativo el género?</h5><ol class="steps">
<li>H₀: β₁ = β′₁ y β₂ = β′₂ (la misma ecuación para los dos) frente a H₁: al menos uno distinto.</li>
<li>\(RSS_{NR}=RSS_H+RSS_M=0{,}80627+0{,}32615=1{,}13242\), con n − k = 17 − 4 = 13.</li>
<li>Restringido, una sola recta: Σx = 247, Σw = 48,02, Σx² = 5065, Σxw = 802,5. Da \(\hat W=1{,}7933+0{,}0710X\) y \(RSS_R=1{,}20866\).</li>
<li>\(F=\dfrac{(1{,}20866-1{,}13242)/2}{1{,}13242/13}=\dfrac{0{,}03812}{0{,}08711}=0{,}438\sim F(2,13)\).</li>
<li>\(F_{0{,}05}(2,13)=3{,}806\) y p = 0,655, así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>Hombres: \(\hat W=1{,}809+0{,}0665X\); mujeres: \(\hat W=1{,}731+0{,}0778X\). F = 0,438 &lt; 3,806 (p = 0,65): el género no es significativo, y una sola ecuación de salario sirve para los dos.</p>`},

{id:"ep3-6", n:"6", t:"Función de consumo en tres periodos", tipo:"Chow con m submuestras", temas:["chow"], tool:{id:"t-calc",pre:"rss:e6",lbl:"Abrir en la Calculadora (RSS o R²)"},
enun:String.raw`<p>Una función keynesiana \(C=\beta_1+\beta_2R\) se estimó en 1964-1971 (\(\hat\beta_2=0{,}3663\)), 1972-1983 (0,8846), 1984-1990 (1,6069) y en todo 1964-1990 (\(\hat C=202{,}23+0{,}895R\), R² = 0,9974). Además, TSS = 6.403.270, RSS₁ = 2.379,315, RSS₂ = 3.679,020 y RSS₃ = 1.295,861.</p><p><b>a)</b> Explique el concepto de cambio estructural. <b>b)</b> Contraste la consistencia de los parámetros en los tres periodos.</p>`,
saber:[String.raw`<b>Chow con m submuestras:</b> \(F=\dfrac{(RSS_R-\sum_jSCR_j)/[(m-1)k]}{\sum_jSCR_j/(n-mk)}\sim F((m-1)k,\,n-mk)\).`,
String.raw`<b>RSS a partir de R²:</b> \(R^2=1-RSS/TSS\), así que \(RSS=(1-R^2)\,TSS\).`,
String.raw`Años de cada periodo: 1964-1971 son 8, 1972-1983 son 12 y 1984-1990 son 7, en total n = 27.`],
sol:String.raw`<h5>a) Concepto</h5><p>Hay cambio estructural cuando los parámetros de la relación no son los mismos en todo el periodo de la muestra. Un evento, como una crisis, un cambio de política o una reforma, modifica el consumo autónomo, la propensión marginal a consumir o ambos. Si existe y se estima una sola ecuación, los coeficientes son un promedio engañoso de relaciones distintas.</p>
<h5>b) La prueba</h5><ol class="steps">
<li>H₀: \(\boldsymbol\beta^{(1)}=\boldsymbol\beta^{(2)}=\boldsymbol\beta^{(3)}\) (parámetros constantes) frente a H₁: al menos uno cambia. Son q = (m − 1)k = 2·2 = 4 restricciones.</li>
<li>\(RSS_R=(1-0{,}9974)(6.403.270)=16.648{,}50\).</li>
<li>\(RSS_{NR}=2.379{,}315+3.679{,}020+1.295{,}861=7.354{,}196\).</li>
<li>Grados de libertad del denominador: n − mk = 27 − 6 = 21.</li>
<li>\(F=\dfrac{(16.648{,}50-7.354{,}20)/4}{7.354{,}20/21}=\dfrac{2.323{,}58}{350{,}20}=6{,}635\sim F(4,21)\).</li>
<li>\(F_{0{,}05}(4,21)=2{,}840\) y p = 0,0013, así que se rechaza H₀.</li></ol>
<p class="hint">El R² viene redondeado a cuatro decimales, y RSS_R es sensible a eso: con R² entre 0,99735 y 0,99745 la F va de 6,41 a 6,86. La conclusión no cambia.</p>`,
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
saber:[String.raw`<b>No restringido:</b> \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\), con D = 1 en la paz. Estimarlo equivale a estimar cada periodo por separado (ecuación 27), y \(RSS_{NR}=RSS_1+RSS_2\) (ecuación 28).`,
String.raw`<b>Restringido:</b> \(Y_t=\beta_1+\beta_2X_t+\mu_t\) con todas las observaciones.`,
String.raw`<b>Estadístico de Chow:</b> \(F=\dfrac{(RSS_R-RSS_1-RSS_2)/k}{(RSS_1+RSS_2)/(n-2k)}\sim F(k,\,n-2k)\), con k = 2.`,
String.raw`<b>RSS de una regresión simple sin calcular residuos:</b> \(RSS=S_{yy}-\hat\beta_2^2S_{xx}\), con \(S_{yy}=\sum y^2-n\bar y^2\) y \(S_{xx}=\sum x^2-n\bar x^2\).`],
sol:String.raw`<ol class="steps">
<li><b>Hipótesis.</b> H₀: δ₁ = δ₂ = 0 (la misma función en la guerra y en la paz) frente a H₁: δ₁ ≠ 0 o δ₂ ≠ 0.</li>
<li><b>Guerra</b> (n₁ = 5): Σx = 35, Σy = 15, Σx² = 325, Σxy = 140, Σy² = 61. \(\hat\beta_2=\dfrac{5(140)-35(15)}{5(325)-35^2}=\dfrac{175}{400}=0{,}4375\) y \(\hat\beta_1=3-0{,}4375(7)=-0{,}0625\). Con \(S_{yy}=61-45=16\) y \(S_{xx}=325-245=80\): \(RSS_1=16-0{,}4375^2(80)=0{,}6875\).</li>
<li><b>Paz</b> (n₂ = 10): Σx = 110, Σy = 60, Σx² = 1540, Σxy = 828, Σy² = 448. \(\hat\beta_2=\dfrac{10(828)-110(60)}{10(1540)-110^2}=\dfrac{1680}{3300}=0{,}5091\) y \(\hat\beta_1=6-0{,}5091(11)=0{,}4000\). \(RSS_2=88-0{,}5091^2(330)=2{,}4727\).</li>
<li><b>Restringido</b> (n = 15): Σx = 145, Σy = 75, Σx² = 1865, Σxy = 968, Σy² = 509. \(\hat\beta_2=\dfrac{15(968)-145(75)}{15(1865)-145^2}=\dfrac{3645}{6950}=0{,}5245\) y \(\hat\beta_1=-0{,}0698\). \(RSS_R=134-0{,}5245^2(463{,}33)=6{,}5561\).</li>
<li><b>Verificación con dummies:</b> \(\hat Y=-0{,}0625+0{,}4625D+0{,}4375X+0{,}0716DX\). Los β son los de la guerra, y β + δ dan los de la paz: −0,0625 + 0,4625 = 0,4 y 0,4375 + 0,0716 = 0,5091. Además \(RSS_{NR}=3{,}1602=0{,}6875+2{,}4727\).</li>
<li>\(F=\dfrac{(6{,}5561-3{,}1602)/2}{3{,}1602/11}=\dfrac{1{,}6980}{0{,}2873}=5{,}910\sim F(2,11)\).</li>
<li>\(F_{0{,}05}(2,11)=3{,}982\) y p = 0,018, así que se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 5,910 &gt; 3,982 (p = 0,018): hay cambio estructural, y la función de consumo es distinta en la guerra y en la paz. En la paz la propensión marginal a consumir es mayor (0,509 frente a 0,438), lo que es coherente con el racionamiento y el ahorro forzoso de la guerra.</p>`},
]});
TALLERES[0].puntos.push(
{id:"ep3-9", n:"9", t:"El modelo con dummies en forma matricial: X, β, R y r", tipo:"Forma matricial", temas:["ce-dummies","inferencia"], ej:"ce-dummies",
enun:String.raw`<p>El modelo no restringido es \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\beta_kX_{kt}+\delta_kD_tX_{kt}+\mu_t\), con \(D_t=0\) para \(t=1,\dots,n_1\) y \(D_t=1\) para \(t=n_1+1,\dots,n\). <b>a)</b> Escríbalo como \(\mathbf y=X_{NR\_D}\boldsymbol\beta_{NR\_D}+\boldsymbol\mu\), especificando la matriz y el vector. <b>b)</b> La prueba \(H_0:\delta_1=\dots=\delta_k=0\) frente a \(H_1\): algún \(\delta_j\neq0\), escríbala como \(H_0:R\boldsymbol\beta_{NR\_D}=\mathbf r\), especificando R y r.</p>`,
saber:[String.raw`<b>Forma matricial:</b> cada fila de X tiene los regresores de una observación en el mismo orden que el vector de parámetros.`,
String.raw`<b>Restricciones lineales:</b> \(R\boldsymbol\beta=\mathbf r\). R tiene una fila por restricción (q filas) y una columna por parámetro. Cada fila "escoge" con un 1 el parámetro restringido.`,
String.raw`<b>Estadístico:</b> \(F=\dfrac{(R\mathbf b-\mathbf r)'[R(X'X)^{-1}R']^{-1}(R\mathbf b-\mathbf r)}{q\,s^2}\sim F(q,\,n-2k)\). Da lo mismo que la F con las RSS.`],
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
<div class="mj">\[\widehat{\ln Y}=\underset{(1{,}96)}{-4{,}93}+\underset{(0{,}11)}{0{,}94}\ln X+\underset{(0{,}23)}{0{,}31}\ln P_1-\underset{(0{,}29)}{0{,}26}\ln P_2+\underset{(0{,}07)}{0{,}44}\ln P_3,\qquad RSS=0{,}336\]</div>
<p>Modelo 2, con la restricción β₃ + β₄ + β₅ = 1:</p>
<div class="mj">\[\widehat{\ln(Y/P_3)}=\underset{(0{,}16)}{-6{,}55}+\underset{(0{,}11)}{0{,}91}\ln X+\underset{(0{,}19)}{0{,}51}\ln(P_1/P_3)+\underset{(0{,}016)}{0{,}09}\ln(P_2/P_3),\qquad RSS=0{,}364\]</div>
<p><b>a)</b> Interprete los resultados. <b>b)</b> ¿Cómo averiguaría si la restricción es válida? Haga las pruebas LR, Wald y LM.</p>`,
saber:[String.raw`<b>Modelo log-log:</b> cada coeficiente es una elasticidad: β₂ = %Δcosto / %Δproducto.`,
String.raw`<b>Homogeneidad de grado 1 en precios:</b> si todos los precios suben 1 %, el costo sube 1 %. Eso exige β₃ + β₄ + β₅ = 1.`,
String.raw`<b>Pruebas asintóticas</b> con q restricciones, ~χ²(q): \(W=n\dfrac{RSS_R-RSS_{NR}}{RSS_{NR}}\), \(LR=n\ln\dfrac{RSS_R}{RSS_{NR}}\) y \(LM=n\dfrac{RSS_R-RSS_{NR}}{RSS_R}\). Siempre se cumple W ≥ LR ≥ LM.`,
String.raw`<b>F exacta:</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\), con k = 5.`],
sol:String.raw`<h5>a) Interpretación</h5><ol class="steps">
<li><b>Modelo 1.</b> Elasticidad costo-producto 0,94 (t = 8,5): si la producción sube 1 %, el costo sube 0,94 %. Como es menor que 1, hay rendimientos crecientes a escala leves (1/0,94 ≈ 1,06).</li>
<li>Elasticidades precio: trabajo 0,31 (t = 1,35, no significativa), capital −0,26 (signo contrario al esperado, pero t = −0,90, no significativa) y combustible 0,44 (t = 6,3). Suman 0,49, lejos de 1 en apariencia.</li>
<li><b>Modelo 2.</b> Al imponer la homogeneidad, la elasticidad al producto es 0,91. Las de precio son 0,51 (trabajo), 0,09 (capital, ahora con el signo correcto) y, por la restricción, 1 − 0,51 − 0,09 = 0,40 (combustible).</li></ol>
<h5>b) ¿Es válida la restricción?</h5><ol class="steps">
<li>H₀: β₃ + β₄ + β₅ = 1 frente a H₁: β₃ + β₄ + β₅ ≠ 1, con q = 1, n = 29, \(RSS_R=0{,}364\) (modelo 2) y \(RSS_{NR}=0{,}336\) (modelo 1).</li>
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
saber:[String.raw`\(\mathbf b=(X'X)^{-1}X'\mathbf y\), \(RSS=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y\) y \(s^2=RSS/(n-k)\).`,
String.raw`<b>Inversa 2 × 2:</b> \(\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\dfrac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\).`,
String.raw`<b>Cómo se arman \(y_0\) y \(\mathbf x_0\) (la observación nueva):</b>
<ul style="margin:4px 0 0;padding-left:18px">
<li>\(y_0\) es el valor <b>observado</b> de Y en la observación nueva. Es un número (escalar): aquí \(y_0=4\).</li>
<li>\(\mathbf x_0'\) es la <b>fila</b> que esa observación tendría en la matriz X: lleva un 1 en la columna del intercepto y luego el valor de cada regresora. Con regresión simple, \(\mathbf x_0'=[1\;\;X_0]=[1\;\;2]\), de tamaño 1 × k (aquí 1 × 2).</li>
<li>\(\mathbf x_0\) es esa misma fila puesta como <b>columna</b> (k × 1): \(\mathbf x_0=\begin{bmatrix}1\\2\end{bmatrix}\).</li>
<li>Con ellos: el pronóstico es \(\hat y_0=\mathbf x_0'\mathbf b\) (1 × k por k × 1 = un número), el error de pronóstico es \(d=y_0-\hat y_0\), y la varianza del error usa \(\mathbf x_0'(X'X)^{-1}\mathbf x_0\) (1 × k por k × k por k × 1 = un número).</li>
<li>Si el modelo tuviera más regresoras, por ejemplo \(Y=\beta_1+\beta_2X_2+\beta_3X_3\), sería \(\mathbf x_0'=[1\;\;X_{20}\;\;X_{30}]\).</li></ul>`,
String.raw`<b>Pronósticos de Chow con n₂ = 1:</b> \(F=\dfrac{d^2}{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}\sim F(1,\,n-k)\), con \(d=y_0-\mathbf x_0'\mathbf b\) (punto 1 de los Ejercicios propuestos 3).`],
sol:String.raw`<ol class="steps">
<li>\(\det(X'X)=20(30)-10(10)=500\), así que \((X'X)^{-1}=\dfrac1{500}\begin{bmatrix}30&-10\\-10&20\end{bmatrix}\).</li>
<li>\(\mathbf b=\dfrac1{500}\begin{bmatrix}30(30)-10(40)\\-10(30)+20(40)\end{bmatrix}=\dfrac1{500}\begin{bmatrix}500\\500\end{bmatrix}=\begin{bmatrix}1\\1\end{bmatrix}\), es decir \(\hat Y=1+X\).</li>
<li>\(RSS=75-(1\cdot30+1\cdot40)=5\) y \(s^2=5/(20-2)=0{,}2778\).</li>
<li><b>Pronóstico para la observación nueva.</b> La recta estimada es \(\hat Y=b_1+b_2X\), con \(b_1=1\) (intercepto) y \(b_2=1\) (pendiente), es decir \(\hat Y=1+1\cdot X\). La observación nueva trae X = 2, así que se reemplaza X por 2: \(\hat y_0=1+1(2)=3\).<br>
En forma matricial es lo mismo: la fila de la nueva observación es \(\mathbf x_0'=[1\;\;2]\) (el 1 acompaña al intercepto y el 2 es el valor de X), y \(\hat y_0=\mathbf x_0'\mathbf b=[1\;\;2]\begin{bmatrix}1\\1\end{bmatrix}=1(1)+2(1)=3\).<br>
El error de pronóstico es lo observado menos lo pronosticado: \(d=y_0-\hat y_0=4-3=1\).</li>
<li>Con el mismo \(\mathbf x_0=(1;\,2)\): \(\mathbf x_0'(X'X)^{-1}\mathbf x_0=\dfrac1{500}[1\;\;2]\begin{bmatrix}30&-10\\-10&20\end{bmatrix}\begin{bmatrix}1\\2\end{bmatrix}=\dfrac{30(1)^2-2(10)(1)(2)+20(2)^2}{500}=\dfrac{30-40+80}{500}=\dfrac{70}{500}=0{,}14\), y el factor es 1 + 0,14 = 1,14.</li>
<li>\(F=\dfrac{1^2}{0{,}2778(1{,}14)}=3{,}158\sim F(1,18)\). Equivale a t = 1,777.</li>
<li>\(F_{0{,}05}(1,18)=4{,}414\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 3,158 &lt; 4,414: la observación nueva es compatible con la relación estimada \(\hat Y=1+X\). No hay evidencia de cambio en los parámetros.</p>`},

{id:"d-42", n:"4.2", t:"Estacionalidad y estabilidad con sumas de cuadrados", tipo:"Pruebas F con RSS", temas:["chow","dicotomicas","series"], tool:{id:"t-calc",pre:"rss:d42",lbl:"Abrir la parte de estabilidad en la Calculadora"},
enun:String.raw`<p>Con datos trimestrales 1958-1976 se estimó \(\hat Y=2{,}20+0{,}104X_2-3{,}48X_3+0{,}34X_4\), con ESS = 109,6 y RSS = 18,48. Al agregar tres dummies estacionales, la ESS sube a 114,8. Pruebe si hay estacionalidad. Las regresiones de los subperiodos 1958.1-1968.4 y 1969.1-1976.4 dan RSS de 9,32 y 7,46. Pruebe la constancia de la relación entre los dos subperiodos.</p>`,
saber:[String.raw`n = 19 años × 4 = 76 trimestres; subperiodos de 44 y 32. El modelo base tiene k = 4.`,
String.raw`<b>Con la misma variable dependiente, la TSS no cambia:</b> TSS = ESS + RSS = 128,08, así que si la ESS sube, la RSS baja lo mismo.`,
String.raw`<b>F de restricciones:</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k_{NR})}\). <b>Chow:</b> \(F=\dfrac{(RSS_R-RSS_1-RSS_2)/k}{(RSS_1+RSS_2)/(n-2k)}\).`],
sol:String.raw`<h5>Estacionalidad</h5><ol class="steps">
<li>H₀: los coeficientes de las tres dummies estacionales valen 0, con q = 3.</li>
<li>TSS = 109,6 + 18,48 = 128,08. Con las dummies, \(RSS_{NR}=128{,}08-114{,}8=13{,}28\) y \(k_{NR}=7\).</li>
<li>\(F=\dfrac{(18{,}48-13{,}28)/3}{13{,}28/(76-7)}=\dfrac{1{,}7333}{0{,}1925}=9{,}01\sim F(3,69)\).</li>
<li>\(F_{0{,}05}(3,69)=2{,}74\), así que se rechaza H₀: hay estacionalidad.</li></ol>
<h5>Estabilidad entre subperiodos</h5><ol class="steps">
<li>H₀: los cuatro coeficientes son iguales en los dos subperiodos, con q = k = 4.</li>
<li>\(RSS_R=18{,}48\) (modelo original) y \(RSS_1+RSS_2=9{,}32+7{,}46=16{,}78\).</li>
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
<li>Sin aumento (n = 5): \(\hat Y=16{,}762+0{,}6986X\) y RSS = 57,193. Con aumento (n = 7): \(\hat Y=10{,}306+0{,}7452X\) y RSS = 247,900. \(RSS_{NR}=305{,}094\).</li>
<li>Restringido: \(\hat Y=13{,}013+0{,}7285X\) y \(RSS_R=310{,}969\).</li>
<li>\(F=\dfrac{(310{,}969-305{,}094)/2}{305{,}094/8}=\dfrac{2{,}938}{38{,}137}=0{,}077\sim F(2,8)\), con crítico 4,459 y p = 0,93. No se rechaza H₀.</li>
<li>Solo intercepto distinto: \(\hat Y=12{,}892-0{,}374D+0{,}731X\), RSS = 310,653 y \(F=\dfrac{(310{,}969-310{,}653)/1}{310{,}653/9}=0{,}009<F(1,9)=5{,}117\).</li></ol>`,
res:String.raw`<p>F = 0,077 (p = 0,93): las familias que tuvieron aumento de ingreso no se comportan distinto. Tampoco difiere el consumo autónomo (F = 0,009).</p>`},

{id:"d-48", n:"4.8", t:"Función de producción: estabilidad entre 1929-1948 y 1949-1967", tipo:"Chow con s", temas:["chow"], tool:{id:"t-calc",pre:"rss:d48",lbl:"Abrir en la Calculadora (RSS o s)"},
enun:String.raw`<p>Con datos anuales 1929-1967 (n = 39), \(\widehat{\log Q}=-3{,}8766+1{,}4106\log L+0{,}4162\log K\), con R² = 0,9937 y s = 0,03755. En 1929-1948: \(-4{,}0576+1{,}6167\log L+0{,}2197\log K\), con s = 0,04573. En 1949-1967: \(-1{,}9564+0{,}8336\log L+0{,}6631\log K\), con s = 0,02185. Pruebe la estabilidad de la función de producción entre los dos subperiodos.</p>`,
saber:[String.raw`<b>RSS a partir de s:</b> \(s^2=RSS/(n-k)\), así que \(RSS=s^2(n-k)\). Aquí k = 3.`,
String.raw`n₁ = 20 (1929-1948) y n₂ = 19 (1949-1967).`],
sol:String.raw`<ol class="steps">
<li>\(RSS_R=0{,}03755^2(39-3)=0{,}050760\).</li>
<li>\(RSS_1=0{,}04573^2(20-3)=0{,}035551\) y \(RSS_2=0{,}02185^2(19-3)=0{,}007639\). En total, \(RSS_{NR}=0{,}043190\).</li>
<li>\(F=\dfrac{(0{,}050760-0{,}043190)/3}{0{,}043190/(39-6)}=\dfrac{0{,}002523}{0{,}001309}=1{,}93\sim F(3,33)\).</li>
<li>\(F_{0{,}05}(3,33)=2{,}89\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 1,93 &lt; 2,89: la función de producción es estable entre los dos subperiodos, aunque las elasticidades puntuales parezcan distintas.</p>`},

{id:"d-49", n:"4.9", t:"Urbano y rural con información resumida", tipo:"Chow con matrices", temas:["chow","matrices"], tool:{id:"t-calc",pre:"mat:d49",lbl:"Abrir en la Calculadora (matrices)"},
enun:String.raw`<p>Hay 10 observaciones urbanas con \(X'X=\begin{bmatrix}20&20\\20&25\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}10\\20\end{bmatrix}\) y \(\mathbf y'\mathbf y=30\), y 10 rurales con \(X'X=\begin{bmatrix}10&10\\10&20\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}8\\20\end{bmatrix}\) y \(\mathbf y'\mathbf y=24\). Pruebe que la misma relación vale en las dos áreas.</p>`,
saber:[String.raw`<b>Las matrices de momentos se suman:</b> si se apilan las muestras, \(X'X=X_1'X_1+X_2'X_2\), \(X'\mathbf y=X_1'\mathbf y_1+X_2'\mathbf y_2\) y \(\mathbf y'\mathbf y=\mathbf y_1'\mathbf y_1+\mathbf y_2'\mathbf y_2\). Así se obtiene el restringido sin los datos.`,
String.raw`\(RSS=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y\) en cada muestra.`],
sol:String.raw`<ol class="steps">
<li><b>Urbano:</b> \(\det=20(25)-20(20)=100\), así que \(\mathbf b_1=\dfrac1{100}\begin{bmatrix}25&-20\\-20&20\end{bmatrix}\begin{bmatrix}10\\20\end{bmatrix}=\begin{bmatrix}-1{,}5\\2\end{bmatrix}\). \(RSS_1=30-(-1{,}5\cdot10+2\cdot20)=5\).</li>
<li><b>Rural:</b> \(\det=100\), así que \(\mathbf b_2=\dfrac1{100}\begin{bmatrix}20&-10\\-10&10\end{bmatrix}\begin{bmatrix}8\\20\end{bmatrix}=\begin{bmatrix}-0{,}4\\1{,}2\end{bmatrix}\). \(RSS_2=24-(-3{,}2+24)=3{,}2\).</li>
<li><b>Restringido:</b> \(X'X=\begin{bmatrix}30&30\\30&45\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}18\\40\end{bmatrix}\) y \(\mathbf y'\mathbf y=54\). \(\mathbf b=(-0{,}8667;\;1{,}4667)\) y \(RSS_R=54-(-15{,}6+58{,}667)=10{,}933\).</li>
<li>\(F=\dfrac{(10{,}933-8{,}2)/2}{8{,}2/16}=\dfrac{1{,}367}{0{,}5125}=2{,}667\sim F(2,16)\).</li>
<li>\(F_{0{,}05}(2,16)=3{,}63\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 2,667 &lt; 3,63: la misma relación vale en las áreas urbana y rural.</p>`},

{id:"d-410", n:"4.10", t:"Gasto en vacaciones por grupos de ingreso y elasticidad común", tipo:"Chow con varianzas y prueba t", temas:["chow","inferencia"], tool:{id:"t-calc",pre:"rss:d410",lbl:"Abrir en la Calculadora (RSS o varianzas)"},
enun:String.raw`<p>En 256 hogares, las regresiones log-log de gasto en vacaciones sobre ingreso dan: ingreso bajo, pendiente 0,02, varianza residual 0,26 y 102 hogares; medio, 0,09, 0,42 y 102; alto, 0,14, 0,30 y 52; todos, 0,07, 0,38 y 256. Pruebe si la función de gasto es la misma en todos los grupos. ¿Qué información adicional necesitaría para probar si la elasticidad es la misma? Si la varianza del log del ingreso en la muestra completa es 24, pruebe que la elasticidad para todos los hogares es 0,10.</p>`,
saber:[String.raw`<b>RSS a partir de la varianza residual:</b> \(RSS=s^2(n-2)\) en cada regresión simple.`,
String.raw`<b>Chow con m = 3:</b> \(F\sim F((m-1)k,\,n-mk)=F(4,250)\).`,
String.raw`<b>Error estándar de la pendiente:</b> \(ee(b)=\sqrt{s^2/\sum(x-\bar x)^2}\), con \(\sum(x-\bar x)^2=n\operatorname{var}(x)\).`],
sol:String.raw`<h5>¿La misma función?</h5><ol class="steps">
<li>RSS por grupo: 0,26(100) = 26, 0,42(100) = 42 y 0,30(50) = 15, que suman \(RSS_{NR}=83\).</li>
<li>\(RSS_R=0{,}38(254)=96{,}52\).</li>
<li>\(F=\dfrac{(96{,}52-83)/4}{83/250}=\dfrac{3{,}38}{0{,}332}=10{,}18\sim F(4,250)\), con crítico 2,41. Se rechaza H₀: la función no es la misma.</li></ol>
<h5>¿La misma elasticidad?</h5><p>Hace falta el error estándar de cada pendiente, es decir, la varianza (o la suma de cuadrados) del log del ingreso dentro de cada grupo. También se podría estimar un modelo con interceptos distintos y pendiente común y compararlo por F con el no restringido.</p>
<h5>Elasticidad igual a 0,10</h5><ol class="steps">
<li>\(\sum(x-\bar x)^2=256(24)=6.144\), así que \(ee(b)=\sqrt{0{,}38/6.144}=0{,}00786\).</li>
<li>H₀: β = 0,10. \(t=\dfrac{0{,}07-0{,}10}{0{,}00786}=-3{,}81\), y \(|t|>1{,}97\), así que se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 10,18 &gt; 2,41: la función de gasto difiere entre grupos de ingreso. La elasticidad conjunta 0,07 es significativamente distinta de 0,10 (t = −3,81).</p>`}]});

// ---------- Asesoría del parcial 1 y Taller 2 (regresión múltiple): los ejercicios que el profesor resolvió en su notebook de R
TALLERES.push({id:"tl-p1", t:"Asesoría del parcial 1 y Taller 2", sub:"Regresión de k variables e inferencia: Dinardo 3.9, 3.10, 3.13, 3.20 y los puntos 1, 4, 7 y 8 del Taller 2", anchor:"inferencia",
intro:`Los ocho ejercicios que el profesor resolvió en su notebook de R de la asesoría del parcial 1, con el <b>paso a paso</b> y las ecuaciones por su número: F (56) general, F (58) y t (59) individuales, F (60) de una restricción lineal, F (61) de la regresión y F (64) con las RSS. Los números se verificaron en R. Donde el notebook tiene un descuido (un p-valor sin <code>lower.tail = F</code>, un comentario cruzado) aparece una nota «Ojo».`,
puntos:[
{id:"p1-39", n:"D 3.9", t:"Todo en desviaciones: estimar y probar cinco hipótesis", tipo:"Modelo en desviaciones", temas:["inferencia","mco-matricial"],
enun:String.raw`<p>Con n = 24 observaciones de un modelo con k = 4 (intercepto y tres regresoras) se tienen, en desviaciones a la media:</p>
<div class="mj">\[X_*'X_*=\begin{bmatrix}10&10&5\\10&30&15\\5&15&20\end{bmatrix},\qquad X_*'\mathbf y_*=\begin{bmatrix}7\\-7\\-26\end{bmatrix},\qquad TSS=\mathbf y_*'\mathbf y_*=60\]</div>
<p><b>a)</b> Pruebe por separado β₂ = 1, β₃ = 1 y β₄ = −2. <b>b)</b> Pruebe β₂ + β₃ + β₄ = 0. <b>c)</b> Pruebe conjuntamente β₂ = 1, β₃ = 1 y β₄ = −2.</p>`,
saber:[String.raw`<b>Modelo en desviaciones:</b> \(\mathbf b_2=(X_*'X_*)^{-1}X_*'\mathbf y_*\), \(ESS=\mathbf b_2'X_*'X_*\mathbf b_2\), \(RSS=TSS-ESS\) y \(S^2=RSS/(n-k)\), con k contando el intercepto.`,
String.raw`<b>Un coeficiente contra un valor:</b> \(F=\dfrac{(b_j-\beta_j^0)^2}{S^2_{b_j}}\sim F(1,n-k)\).`,
String.raw`<b>Una restricción lineal, ecuación (60):</b> \(F=\dfrac{(a_2b_2+a_3b_3+a_4b_4-a)^2}{\operatorname{var}(a_2b_2+a_3b_3+a_4b_4)}\), y la varianza de una suma incluye dos veces cada covarianza.`,
String.raw`<b>Conjunta, ecuación (56) con R = I:</b> \(F=\dfrac{(\mathbf b_2-\mathbf r)'X_*'X_*(\mathbf b_2-\mathbf r)/q}{S^2}\sim F(q,n-k)\).`],
sol:String.raw`<ol class="steps">
<li>\((X_*'X_*)^{-1}=\begin{bmatrix}0{,}15&-0{,}05&0\\-0{,}05&0{,}07&-0{,}04\\0&-0{,}04&0{,}08\end{bmatrix}\) y \(\mathbf b_2=(1{,}4;\;0{,}2;\;-1{,}8)\).</li>
<li>\(ESS=1{,}4(7)+0{,}2(-7)-1{,}8(-26)=55{,}2\), \(RSS=60-55{,}2=4{,}8\), \(S^2=4{,}8/20=0{,}24\) y R² = 0,92.</li>
<li>\(\operatorname{var}(\mathbf b_2)=0{,}24(X_*'X_*)^{-1}\): varianzas 0,036, 0,0168 y 0,0192; covarianzas −0,012, 0 y −0,0096.</li>
<li><b>a)</b> β₂ = 1: \(F=(1{,}4-1)^2/0{,}036=4{,}444\), p = 0,048. β₃ = 1: \(F=(0{,}2-1)^2/0{,}0168=38{,}10\), p ≈ 0. β₄ = −2: \(F=(-1{,}8+2)^2/0{,}0192=2{,}083\), p = 0,164. El crítico es \(F_{0{,}05}(1,20)=4{,}351\).</li>
<li><b>b)</b> \(b_2+b_3+b_4=-0{,}2\) y la varianza de la suma es la suma de todos los elementos de var(b₂): 0,0288. \(F=0{,}04/0{,}0288=1{,}389\), p = 0,252.</li>
<li><b>c)</b> \(\mathbf b_2-\mathbf r=(0{,}4;\,-0{,}8;\,0{,}2)\), \((\mathbf b_2-\mathbf r)'X_*'X_*(\mathbf b_2-\mathbf r)=11{,}2\) y \(F=(11{,}2/3)/0{,}24=15{,}56\), contra \(F_{0{,}05}(3,20)=3{,}098\).</li></ol>
<pre class="code"><code>n=24; k=4
XatXa=matrix(nrow=3, ncol=3, byrow=T, c(10,10,5, 10,30,15, 5,15,20))
Xatya=cbind(c(7,-7,-26)); XatXa_inv=solve(XatXa)
(b2v=XatXa_inv%*%Xatya)
TSS=60; (ESS=(t(b2v)%*%XatXa%*%b2v)[1]); (RSS=TSS-ESS); (S2=RSS/(n-k))
(var_b2=S2*XatXa_inv)
(Fc_b2=((b2v[1]-1)^2)/var_b2[1,1]); pf(Fc_b2, df1=1, df2=n-k, lower.tail=F)
r=cbind(c(1,1,-2))
(Fc=(((t(b2v-r)%*%XatXa%*%(b2v-r))[1])/3)/S2); pf(Fc, df1=3, df2=n-k, lower.tail=F)</code></pre>`,
res:String.raw`<p>Al 5 % se rechazan β₂ = 1 (por poco: p = 0,048) y β₃ = 1; no se rechazan β₄ = −2 ni β₂ + β₃ + β₄ = 0. La conjunta se rechaza (F = 15,56 &gt; 3,098): aunque β₄ = −2 sea compatible con los datos, las tres igualdades a la vez no lo son.</p>`},

{id:"p1-310", n:"D 3.10", t:"De X′X y X′y al estimador y a la significancia de β₂", tipo:"Estimación con matrices", temas:["mco-matricial","inferencia","matrices"],
enun:String.raw`<p>Con n = 10 observaciones y k = 3 se tiene:</p>
<div class="mj">\[X'X=\begin{bmatrix}10&30&40\\30&92&119\\40&119&163\end{bmatrix},\qquad X'\mathbf y=\begin{bmatrix}20\\59\\88\end{bmatrix},\qquad \mathbf y'\mathbf y=88{,}2\]</div>
<p>Estime el modelo, obtenga las sumas de cuadrados y pruebe la significancia de β₂.</p>`,
saber:[String.raw`La primera fila de X′X y de X′y da n, las sumas de las X y \(\sum Y\): aquí \(\bar Y=20/10=2\).`,
String.raw`\(TSS=\mathbf y'\mathbf y-n\bar Y^2\), \(ESS=\mathbf b'X'X\mathbf b-n\bar Y^2\) y \(RSS=TSS-ESS\).`,
String.raw`<b>Prueba t, ecuación (59):</b> \(t=b_j/S_{b_j}\sim t(n-k)\), con p-valor \(2P(t_{n-k}>|t_c|)\).`],
sol:String.raw`<ol class="steps">
<li>\(\det(X'X)=50\) y \((X'X)^{-1}=\begin{bmatrix}16{,}7&-2{,}6&-2{,}2\\-2{,}6&0{,}6&0{,}2\\-2{,}2&0{,}2&0{,}4\end{bmatrix}\).</li>
<li>\(\mathbf b=(X'X)^{-1}X'\mathbf y=(-13;\;1;\;3)\).</li>
<li>\(TSS=88{,}2-10(2^2)=48{,}2\); \(\mathbf b'X'X\mathbf b=\mathbf b'X'\mathbf y=-13(20)+59+3(88)=63\), así que \(ESS=63-40=23\) y \(RSS=25{,}2\). R² = 0,477.</li>
<li>\(S^2=25{,}2/7=3{,}6\), \(S^2_{b_2}=3{,}6(0{,}6)=2{,}16\) y \(S_{b_2}=1{,}470\).</li>
<li>\(t=1/1{,}470=0{,}680\), con p-valor 0,518; el crítico es \(t_{0{,}025}(7)=2{,}365\).</li></ol>
<pre class="code"><code>k=3; n=10
(XtX=matrix(nrow=3, ncol=3, c(10,30,40, 30,92,119, 40,119,163)))
(Xty=cbind(c(20,59,88)))
(XtX_inv=solve(XtX)); (b=XtX_inv%*%Xty)
yb=20/n; (TSS=88.2-n*yb^2); (ESS=(t(b)%*%XtX%*%b)[1]-n*yb^2); (RSS=TSS-ESS)
(S2=RSS/(n-k)); (var_b=S2*XtX_inv); (Sb2=sqrt(var_b[2,2]))
(tb2=b[2]/Sb2); (pb2=2*pt(abs(tb2), df=n-k, lower.tail=F))</code></pre>`,
res:String.raw`<p>Ŷ = −13 + X₂ + 3X₃, con R² = 0,477. Para β₂, t = 0,68 (p = 0,52): X₂ no es significativa. (Para β₃, t = 3/1,2 = 2,5 con p = 0,041: X₃ sí lo es.)</p>`},

{id:"p1-313", n:"D 3.13", t:"Hipótesis conjunta sobre intercepto y pendiente", tipo:"F general (56)", temas:["inferencia"],
enun:String.raw`<p>Una regresión simple con n = 30 observaciones da \(\mathbf b=(0{,}24;\;0{,}94)'\), RSS = 28,56 y \(X'X=\begin{bmatrix}30&300\\300&3052\end{bmatrix}\). Pruebe la hipótesis conjunta H₀: β₁ = 0 y β₂ = 1.</p>`,
saber:[String.raw`<b>F general (56) con R = I₂:</b> \(F=\dfrac{(\mathbf b-\mathbf r)'X'X(\mathbf b-\mathbf r)/q}{S^2}\sim F(q,\,n-k)\), con q = 2 y \(\mathbf r=(0;1)'\).`,
String.raw`\(S^2=RSS/(n-k)\). En regresión simple con intercepto, k = 2.`],
sol:String.raw`<ol class="steps">
<li>\(\mathbf b-\mathbf r=(0{,}24;\,-0{,}06)\).</li>
<li>\((\mathbf b-\mathbf r)'X'X(\mathbf b-\mathbf r)=30(0{,}24^2)+2(300)(0{,}24)(-0{,}06)+3052(0{,}06^2)=1{,}728-8{,}64+10{,}987=4{,}075\).</li>
<li>\(S^2=28{,}56/28=1{,}02\) y \(F=(4{,}075/2)/1{,}02=1{,}998\sim F(2,28)\), con p-valor 0,155; el crítico es 3,340.</li></ol>
<div class="warn"><b>Ojo con el notebook:</b> en la asesoría el código tiene <code>k=0</code>, así que divide por n = 30: S² = 0,952 y F = 2,140 (p = 0,135). La conclusión es la misma, pero con intercepto y pendiente estimados lo usual es k = 2 y 28 grados de libertad. Confirma con el profesor cuál pide.</div>
<pre class="code"><code>b=cbind(c(0.24,0.94)); r=cbind(c(0,1)); k=2; q=2; n=30
RSS=28.56; (S2=RSS/(n-k))
(XtX=matrix(nrow=2, ncol=2, c(30,300,300,3052)))
(Fc=((t(b-r)%*%XtX%*%(b-r))[1]/q)/S2)
(pv=pf(Fc, df1=q, df2=n-k, lower.tail=F))</code></pre>`,
res:String.raw`<p>F = 2,00 &lt; 3,34 (p = 0,155): no se rechaza H₀. Los datos son compatibles con intercepto 0 y pendiente 1.</p>`},

{id:"p1-320", n:"D 3.20", t:"Estimar, R², significancia de β₂ y modelo restringido", tipo:"F (58) y F (64)", temas:["inferencia","mco-matricial"],
enun:String.raw`<p>Con n = 33 observaciones y k = 3 se tiene:</p>
<div class="mj">\[X'X=\begin{bmatrix}33&0&0\\0&40&20\\0&20&60\end{bmatrix},\qquad X'\mathbf y=\begin{bmatrix}132\\24\\92\end{bmatrix},\qquad TSS=150\]</div>
<p>Estime el modelo, calcule R², pruebe la significancia de β₂ y verifique el resultado estimando el modelo restringido sin X₂.</p>`,
saber:[String.raw`Como \(\sum X_2=\sum X_3=0\), las regresoras ya están en desviaciones y X′X es diagonal por bloques: \(b_1=\bar Y=132/33=4\).`,
String.raw`<b>F (58):</b> \(F=b_j^2/S^2_{b_j}\sim F(1,n-k)\). <b>F (64):</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\). Para la misma hipótesis dan el mismo valor.`],
sol:String.raw`<ol class="steps">
<li>Bloque de las pendientes: \(\begin{bmatrix}40&20\\20&60\end{bmatrix}^{-1}=\dfrac1{2000}\begin{bmatrix}60&-20\\-20&40\end{bmatrix}=\begin{bmatrix}0{,}03&-0{,}01\\-0{,}01&0{,}02\end{bmatrix}\).</li>
<li>\(\mathbf b=(4;\;-0{,}2;\;1{,}6)\): \(b_2=0{,}03(24)-0{,}01(92)=-0{,}2\) y \(b_3=-0{,}01(24)+0{,}02(92)=1{,}6\).</li>
<li>\(ESS=\mathbf b'X'\mathbf y-n\bar Y^2=[4(132)-0{,}2(24)+1{,}6(92)]-33(16)=142{,}4\); \(RSS=7{,}6\); R² = 0,949; \(S^2=7{,}6/30=0{,}2533\).</li>
<li>\(S^2_{b_2}=0{,}2533(0{,}03)=0{,}0076\) y \(F=(-0{,}2)^2/0{,}0076=5{,}263\), con p-valor 0,029; el crítico es \(F_{0{,}05}(1,30)=4{,}171\).</li>
<li><b>Restringido</b> (sin X₂): \(X'X=\operatorname{diag}(33,60)\), \(\mathbf b_R=(4;\;92/60)=(4;\;1{,}5333)\), \(ESS_R=92^2/60=141{,}07\) y \(RSS_R=8{,}933\).</li>
<li>\(F=\dfrac{(8{,}933-7{,}6)/1}{7{,}6/30}=5{,}263\): igual que la F (58).</li></ol>
<pre class="code"><code>k=3; n=33
(XtX=matrix(nrow=k, ncol=k, c(33,0,0, 0,40,20, 0,20,60))); (Xty=cbind(c(132,24,92))); (Yb=132/n)
(XtX_inv=solve(XtX)); (b=XtX_inv%*%Xty)
TSS=150; (ESS=(t(b)%*%XtX%*%b)[1]-n*Yb^2); (RSS=TSS-ESS); (R2=ESS/TSS); (S2=RSS/(n-k))
(var_b=S2*XtX_inv); (Fc=b[2]^2/var_b[2,2]); pf(Fc, df1=1, df2=n-k, lower.tail=F)
XtX_r=diag(c(33,60)); Xty_r=cbind(c(132,92)); (br=solve(XtX_r)%*%Xty_r)
(ESSR=(t(br)%*%XtX_r%*%br)[1]-n*Yb^2); (RSSr=TSS-ESSR)
(Fc_64=(RSSr-RSS)/(RSS/(n-k)))</code></pre>`,
res:String.raw`<p>Ŷ = 4 − 0,2X₂ + 1,6X₃, con R² = 0,949. F = 5,263 &gt; 4,171 (p = 0,029): β₂ es significativo al 5 %, y el modelo restringido confirma el mismo valor de F.</p>`},

{id:"p1-t21", n:"T2-1", t:"Demanda de cerveza: elasticidades y tres restricciones", tipo:"F (58), F (60) y F (64)", temas:["inferencia","variables"],
enun:String.raw`<p>Con datos de 1960 a 2011 (n = 52) se estima \(\ln Y_t=\beta_1+\beta_2\ln X_{2t}+\beta_3\ln X_{3t}+\beta_4\ln X_{4t}+\beta_5\ln X_{5t}+\mu_t\), donde Y es la cantidad de cerveza, X₂ su precio, X₃ el precio de otros licores, X₄ el precio de otros bienes y X₅ el ingreso.</p>
<div class="tbl"><table><tr><th></th><th>b</th><th>Error estándar</th></tr><tr><td>Intercepto</td><td>−2,3232</td><td>3,0481</td></tr><tr><td>ln X₂</td><td>−0,9821</td><td>0,2454</td></tr><tr><td>ln X₃</td><td>−0,4702</td><td>0,5342</td></tr><tr><td>ln X₄</td><td>0,1663</td><td>0,0879</td></tr><tr><td>ln X₅</td><td>0,8079</td><td>0,3215</td></tr></table></div>
<p>Error estándar de la regresión S = 0,0696, R² = 0,725. De var(b): var(b₂) = 0,06021, var(b₄) = 0,00773 y cov(b₂, b₄) = 0,00405. RSS de los modelos restringidos: con β₂ + 4β₄ = 0, 0,23; con β₂ + β₃ + β₄ + β₅ = 0, 0,24; con β₃ = β₄ = 0, 0,24096.</p>
<p><b>c)</b> ¿Se acepta que la elasticidad precio es −1,6? <b>d)</b> Pruebe β₂ + 4β₄ = 0 con la F (56) y con la F (64). <b>e)</b> ¿La suma de las elasticidades es cero? <b>f)</b> Pruebe β₃ = β₄ = 0.</p>`,
saber:[String.raw`En un modelo log-log cada β es una elasticidad.`,
String.raw`<b>RSS a partir de S:</b> \(RSS_{NR}=(n-k)S^2\).`,
String.raw`<b>F (60):</b> para β₂ + 4β₄ = 0, \(\operatorname{var}(b_2+4b_4)=\operatorname{var}(b_2)+16\operatorname{var}(b_4)+8\operatorname{cov}(b_2,b_4)\).`,
String.raw`<b>F (64):</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\sim F(q,n-k)\); el denominador es S².`],
sol:String.raw`<ol class="steps">
<li>\(S^2=0{,}0696^2=0{,}004844\) y \(RSS_{NR}=47(0{,}004844)=0{,}2277\).</li>
<li><b>c)</b> \(F=\dfrac{(-0{,}9821+1{,}6)^2}{0{,}06021}=6{,}341\sim F(1,47)\), con p-valor 0,015 &lt; 0,05: se rechaza β₂ = −1,6.</li>
<li><b>d)</b> De la (56) con R = [0 1 0 4 0]: \(F=\dfrac{(b_2+4b_4)^2}{\operatorname{var}(b_2+4b_4)}=\dfrac{(-0{,}3169)^2}{0{,}06021+16(0{,}00773)+8(0{,}00405)}=\dfrac{0{,}1004}{0{,}2163}=0{,}464\). El modelo restringido es \(\ln Y_t=\beta_1+\beta_3\ln X_{3t}+\beta_4(\ln X_{4t}-4\ln X_{2t})+\beta_5\ln X_{5t}+\mu_t\). Con la (64): \(F=(0{,}23-0{,}2277)/0{,}004844=0{,}480\), p = 0,49. La pequeña diferencia es redondeo del RSS.</li>
<li><b>e)</b> Con la (64) y el modelo 3: \(F=(0{,}24-0{,}2277)/0{,}004844=2{,}544\), p = 0,117. Con la F de una restricción: \(\sum b=-0{,}4781\), var = 0,0931 (suma de todo el bloque de var(b)) y F = 2,455, p = 0,124.</li>
<li><b>f)</b> q = 2, \(R=\begin{bmatrix}0&0&1&0&0\\0&0&0&1&0\end{bmatrix}\), r = 0: \(F=\dfrac{(0{,}24096-0{,}2277)/2}{0{,}004844}=1{,}371\), p = 0,264; el crítico es \(F_{0{,}05}(2,47)=3{,}195\).</li></ol>
<div class="warn"><b>Ojo con el notebook:</b> en d), e) y f) el p-valor está escrito <code>pf(Fc, df1, df2)</code> sin <code>lower.tail = F</code>, y eso da la probabilidad acumulada (1 − p). El p-valor correcto es <code>pf(Fc, df1, df2, lower.tail = F)</code>. En e) además usa <code>df1 = qd</code> en vez de <code>qe</code> (ambos valen 1).</div>
<pre class="code"><code>n=52; k=5; alpha=0.05
S=0.0696; S2=S^2; (RSSNR=(n-k)*S2)
RSSR_M2=0.23; RSSR_M3=0.24; RSSR_M4=0.24096
(Fc_58_c=((-0.9821-(-1.6))^2)/0.06021); pf(Fc_58_c, df1=1, df2=n-k, lower.tail=F)
(Fc_d=((RSSR_M2-RSSNR)/1)/S2); pf(Fc_d, df1=1, df2=n-k, lower.tail=F)
(Fc_e=((RSSR_M3-RSSNR)/1)/S2); pf(Fc_e, df1=1, df2=n-k, lower.tail=F)
(Fc_f=((RSSR_M4-RSSNR)/2)/S2); pf(Fc_f, df1=2, df2=n-k, lower.tail=F)</code></pre>`,
res:String.raw`<p>La elasticidad precio no es −1,6 (p = 0,015). No se rechazan β₂ + 4β₄ = 0 (F ≈ 0,47), ni que las elasticidades sumen cero (F ≈ 2,5; p ≈ 0,12), ni β₃ = β₄ = 0 (F = 1,37; p = 0,26): los precios de otros licores y de otros bienes no son conjuntamente significativos.</p>`},

{id:"p1-t24", n:"T2-4", t:"Demanda de televisores: intervalos y β₂ + β₃ = 0", tipo:"Intervalos, F (60) y F (64)", temas:["inferencia","mco-matricial"], tool:{id:"t-datos",pre:"tv",lbl:"Abrir la base de TV en el Laboratorio de datos"},
enun:String.raw`<p>Con los 48 meses de demanda de televisores Yt, precio X2t y publicidad X3t (la base del Ejemplo 1) se estiman el modelo (1) \(Y_t=\beta_1+\beta_2X_{2t}+\beta_3X_{3t}+\mu_t\) y el modelo (2), con la restricción β₃ = −β₂. Se tiene b = (10,3017274; −0,0059941; 0,0051071), con errores estándar 0,2440101, 0,0001610 y 0,0008146, cov(b₂, b₃) = 5,399229·10⁻⁸, RSS<sub>NR</sub> = 1,21268 y RSS<sub>R</sub> = 1,239267.</p>
<p><b>b)</b> Intervalos de confianza del 95 %. <b>c)</b> Pruebe β₂ + β₃ = 0 por todas las formas posibles.</p>`,
saber:[String.raw`<b>Intervalo:</b> \(b_j\pm t_{\alpha/2}(n-k)\,S_{b_j}\), con \(t_{0{,}025}(45)=2{,}0141\).`,
String.raw`<b>F (60)</b> con la varianza de b₂ + b₃ y <b>F (64)</b> con las RSS: prueban lo mismo y dan igual.`],
sol:String.raw`<ol class="steps">
<li><b>b)</b> β₁: 10,3017 ± 2,0141(0,2440) = [9,8103; 10,7932]. β₂: [−0,006318; −0,005670]. β₃: [0,003466; 0,006748]. Ninguno contiene el cero.</li>
<li><b>c)</b> R = [0 1 1], r = 0, q = 1. \(F_{60}=\dfrac{(-0{,}0059941+0{,}0051071)^2}{0{,}0001610^2+0{,}0008146^2+2(5{,}399229\cdot10^{-8})}=0{,}9866\).</li>
<li>\(F_{64}=\dfrac{1{,}239267-1{,}21268}{1{,}21268/45}=0{,}9866\sim F(1,45)\), con p-valor 0,326; el crítico es 4,057.</li></ol>
<pre class="code"><code>(ta2=qt(0.025, df=45, lower.tail=F))
b1=10.3017274; sb1=0.2440101; c(b1-sb1*ta2, b1+sb1*ta2)
b2=-0.0059941; sb2=0.0001610; b3=0.0051071; sb3=0.0008146; Sb2b3=5.399229*10^(-8)
RSSR=1.239267; RSSNR=1.21268
(F_60=((b2+b3)^2)/(sb2^2+sb3^2+2*Sb2b3))
(F_64=(RSSR-RSSNR)/(RSSNR/45))
(pv=pf(F_64, df1=1, df2=45, lower.tail=F))</code></pre>`,
res:String.raw`<p>Los tres coeficientes son significativos y con el signo esperado (precio negativo, publicidad positiva). F = 0,987 (p = 0,33): no se rechaza β₂ + β₃ = 0, es decir, un aumento de una unidad en la publicidad compensa el de una unidad en el precio.</p>`},

{id:"p1-t27", n:"T2-7", t:"Importaciones de EE. UU.: β₂ + β₃ = 1 con F, Wald, LR y LM", tipo:"Restricción lineal", temas:["inferencia","mv-pruebas"],
enun:String.raw`<p>Con datos de 1975 a 2005 (n = 31) se estima \(\ln Y_t=\beta_1+\beta_2\ln X_{2t}+\beta_3\ln X_{3t}+\mu_t\), con Y las importaciones, X₂ el PIB y X₃ el IPC: b = (1,4376; 1,8301; −0,8433), con errores estándar 0,2696, 0,1822 y 0,2838; var(b₂) = 0,03319016, var(b₃) = 0,08053829, cov(b₂, b₃) = −0,05132072; RSS<sub>NR</sub> = 0,1408056. El modelo restringido con β₂ + β₃ = 1 da RSS<sub>R</sub> = 0,1408846.</p>
<p><b>b)</b> Intervalos de confianza del 95 %. <b>c)</b> Pruebe H₀: β₂ + β₃ = 1 con la F y con las pruebas de Wald, LR y LM.</p>`,
saber:[String.raw`<b>F (60) con a = 1:</b> \(F=\dfrac{(b_2+b_3-1)^2}{\operatorname{var}(b_2)+\operatorname{var}(b_3)+2\operatorname{cov}(b_2,b_3)}\sim F(1,n-k)\).`,
String.raw`<b>Con las RSS:</b> \(W=\dfrac{n(RSS_R-RSS_{NR})}{RSS_{NR}}\), \(LR=n\ln\dfrac{RSS_R}{RSS_{NR}}\), \(LM=\dfrac{n(RSS_R-RSS_{NR})}{RSS_R}\), las tres \(\chi^2(q)\) y con W ≥ LR ≥ LM.`],
sol:String.raw`<ol class="steps">
<li><b>b)</b> \(t_{0{,}025}(28)=2{,}0484\). β₁: [0,885; 1,990]. β₂: [1,457; 2,203]. β₃: [−1,425; −0,262].</li>
<li><b>c)</b> \(b_2+b_3-1=-0{,}0132\) y la varianza de la suma es \(0{,}03319+0{,}08054-2(0{,}05132)=0{,}011087\). \(F=0{,}0132^2/0{,}011087=0{,}0157\), con p-valor 0,90.</li>
<li>\(F_{64}=\dfrac{0{,}1408846-0{,}1408056}{0{,}1408056/28}=0{,}0157\): el mismo valor.</li>
<li>\(W=31(0{,}000079)/0{,}1408056=0{,}01739\), \(LR=31\ln(0{,}1408846/0{,}1408056)=0{,}01739\) y \(LM=31(0{,}000079)/0{,}1408846=0{,}01738\), todas muy por debajo de \(\chi^2_{0{,}05}(1)=3{,}841\).</li></ol>
<div class="warn"><b>Ojo con el notebook:</b> el comentario dice «Probar Beta2+Beta3=0», pero el código calcula \((b_2+b_3-1)^2\): la hipótesis es β₂ + β₃ = 1, como en el enunciado.</div>
<pre class="code"><code>n=31; k=3; a=0.05
b2=1.8301; S2b2=0.03319016; b3=-0.8433; S2b3=0.08053829; Sb2b3=-0.05132072
RSS_NR=0.1408056; RSS_R=0.1408846
(Fc_E7=((b2+b3-1)^2)/(S2b2+S2b3+2*Sb2b3))
(pv_E7=pf(Fc_E7, df1=1, df2=n-k, lower.tail=F))
(Fc_E7_RSS=(RSS_R-RSS_NR)/(RSS_NR/(n-k)))
(W=n*(RSS_R-RSS_NR)/RSS_NR); (LR=n*log(RSS_R/RSS_NR)); (LM=n*(RSS_R-RSS_NR)/RSS_R)
qchisq(0.95, 1)</code></pre>`,
res:String.raw`<p>F = 0,016 (p = 0,90) y W ≈ LR ≈ LM ≈ 0,017 &lt; 3,841: no se rechaza β₂ + β₃ = 1. La elasticidad de las importaciones al PIB es 1,83 y al IPC −0,84, las dos significativas.</p>`},

{id:"p1-t28", n:"T2-8", t:"Demanda de un artículo: intervalos y β₂ + 3β₃ = 0", tipo:"Intervalos, F (60) y F (64)", temas:["inferencia"],
enun:String.raw`<p>Con datos de 1971 a 2005 (n = 35) se estima \(Y_t=\beta_1+\beta_2X_{2t}+\beta_3X_{3t}+\beta_4X_{4t}+\mu_t\), con Y la demanda, X₂ el precio, X₃ el ingreso y X₄ el precio de un sustituto: b = (72,2928; −5,8139; 1,6672; 1,5408), con errores estándar 6,9550, 0,4970, 0,7148 y 0,5542; S = 3,531 con 31 grados de libertad y R² = 0,9742. De var(b): var(b₂) = 0,24705304, var(b₃) = 0,51093128 y cov(b₂, b₃) = 0,09828469. El modelo restringido con β₂ + 3β₃ = 0 da \(\mathbf b_R=(72{,}195361;\,-5{,}732889;\,1{,}910963;\,1{,}396949)\), ESS<sub>R</sub> = 14.619,98 y TSS = 15.008.</p>
<p><b>b)</b> Intervalos de confianza del 95 %. <b>d)</b> Escriba H₀: β₂ + 3β₃ = 0 como Rβ = r, verifique que b<sub>R</sub> cumple la restricción y haga la prueba por todas las formas posibles.</p>`,
saber:[String.raw`<b>F (60) con pesos:</b> \(\operatorname{var}(b_2+3b_3)=\operatorname{var}(b_2)+9\operatorname{var}(b_3)+6\operatorname{cov}(b_2,b_3)\).`,
String.raw`\(RSS_R=TSS-ESS_R\) y \(RSS_{NR}=(n-k)S^2\).`],
sol:String.raw`<ol class="steps">
<li><b>b)</b> \(t_{0{,}025}(31)=2{,}0395\). β₁: [58,108; 86,478]. β₂: [−6,828; −4,800]. β₃: [0,209; 3,125]. β₄: [0,411; 2,671]. Ninguno contiene el cero y los signos son los esperados: precio negativo, ingreso y precio del sustituto positivos.</li>
<li><b>d)</b> R = [0 1 3 0], r = 0, q = 1. Verificación: \(-5{,}732889+3(1{,}910963)=0\), b<sub>R</sub> cumple la restricción.</li>
<li>\(b_2+3b_3=-5{,}8139+3(1{,}6672)=-0{,}8123\) y \(\operatorname{var}=0{,}24705+9(0{,}51093)+6(0{,}09828)=5{,}4351\). \(F_{60}=0{,}8123^2/5{,}4351=0{,}1214\).</li>
<li>\(RSS_R=15.008-14.619{,}98=388{,}02\) y \(RSS_{NR}=31(3{,}531^2)=386{,}507\). \(F_{64}=\dfrac{388{,}02-386{,}507}{386{,}507/31}=0{,}1214\sim F(1,31)\), con p-valor 0,730; el crítico es 4,160.</li></ol>
<pre class="code"><code>n=35; k=4; a=0.05
(ta2=qt(a/2, df=n-k, lower.tail=F))
b2=-5.8139; se_b2=0.4970; c(b2-se_b2*ta2, b2+se_b2*ta2)
b3=1.6672; S2_b2=0.24705304; S2_b3=0.51093128; Sb2b3=0.09828469
(FC=((b2+3*b3)^2)/(S2_b2+9*S2_b3+6*Sb2b3)); (pv=pf(FC, df1=1, df2=n-k, lower.tail=F))
TSS=15008; ESS_R=14619.98; (RSS_R=TSS-ESS_R)
S=3.531; (RSS_NR=(n-k)*(S^2))
(FC_1=((RSS_R-RSS_NR)/(RSS_NR/(n-k))))</code></pre>`,
res:String.raw`<p>F = 0,121 (p = 0,73): no se rechaza β₂ + 3β₃ = 0. Las dos formas de la prueba coinciden.</p>`}]});

// ---------- Ejercicios propuestos 4: estimación MLE y pruebas LR, Wald y LM (Dinardo, capítulo 5)
TALLERES.push({id:"tl-ep4", t:"Ejercicios propuestos 4", sub:"Estimación MLE y pruebas de Wald, LR y LM (Dinardo, capítulo 5)", anchor:"mv-pruebas",
intro:`Los diez ejercicios del profesor sobre máxima verosimilitud. Los puntos 1 a 4 y 7 son de estimación (verosimilitud, score, MLE, Hessiana, información y varianza); los puntos 5, 6, 8, 9 y 10 aplican las pruebas LR, Wald y LM «en todas las versiones posibles». Los resultados numéricos se verificaron en R. La teoría está en las estaciones <a href="#mv-estimacion">Máxima verosimilitud</a> y <a href="#mv-pruebas">Pruebas LR, Wald y LM</a>.`,
puntos:[
{id:"ep4-1", n:"1", t:"Exponencial: MLE, score, Hessiana e información", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>Sea \(X_1,\dots,X_n\) una m.a. de \(X\sim\exp(\theta)\), con \(f(x)=\frac1\theta e^{-x/\theta}\), x &gt; 0, \(E(X)=\theta\), \(\operatorname{var}(X)=\theta^2\) y mediana \(\theta\ln2\). Encuentre: <b>a)</b> \(L(\theta)\) y \(l(\theta)\); <b>b)</b> el score y \(\hat\theta_{MLE}\); <b>c)</b> pruebe que \(E[s(\theta)]=0\); <b>d)</b> la Hessiana y \(\mathbf H_1\); <b>e)</b> la información y verifique \(E(\mathbf H_1)=-E(\mathbf H)\); <b>f)</b> \(\operatorname{var}(\hat\theta_{MLE})\); <b>g)</b> el MLE de \(\sigma^2=\operatorname{var}(X)\) y de la mediana.</p>`,
saber:[String.raw`\(E\left(\sum X_i\right)=n\theta\) y \(\operatorname{var}\left(\sum X_i\right)=n\theta^2\) (independencia).`,String.raw`<b>Invarianza:</b> el MLE de \(g(\theta)\) es \(g(\hat\theta)\).`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(L(\theta)=\prod\frac1\theta e^{-x_i/\theta}=\theta^{-n}e^{-\sum x_i/\theta}\) y \(l(\theta)=-n\ln\theta-\dfrac{\sum x_i}{\theta}\).</li>
<li><b>b)</b> \(s(\theta)=-\dfrac n\theta+\dfrac{\sum x_i}{\theta^2}\). Igualando a cero: \(n\theta=\sum x_i\Rightarrow\hat\theta_{MLE}=\bar x\).</li>
<li><b>c)</b> \(E[s]=-\dfrac n\theta+\dfrac{E(\sum X_i)}{\theta^2}=-\dfrac n\theta+\dfrac{n\theta}{\theta^2}=0\).</li>
<li><b>d)</b> \(\mathbf H=\dfrac{\partial^2l}{\partial\theta^2}=\dfrac n{\theta^2}-\dfrac{2\sum x_i}{\theta^3}\) y \(\mathbf H_1=s^2=\left(-\dfrac n\theta+\dfrac{\sum x_i}{\theta^2}\right)^2\).</li>
<li><b>e)</b> \(E(\mathbf H)=\dfrac n{\theta^2}-\dfrac{2n\theta}{\theta^3}=-\dfrac n{\theta^2}\), así que \(\mathbf I(\theta)=\dfrac n{\theta^2}\). Como \(E[s]=0\), \(E(\mathbf H_1)=\operatorname{var}(s)=\dfrac{\operatorname{var}(\sum X_i)}{\theta^4}=\dfrac{n\theta^2}{\theta^4}=\dfrac n{\theta^2}=-E(\mathbf H)\). ✓</li>
<li><b>f)</b> \(\operatorname{var}(\hat\theta_{MLE})=\mathbf I(\theta)^{-1}=\dfrac{\theta^2}{n}\) (coincide con \(\operatorname{var}(\bar x)\)).</li>
<li><b>g)</b> Por invarianza: \(\hat\sigma^2=\hat\theta^2=\bar x^2\) y \(\tilde\mu=\hat\theta\ln2=\bar x\ln2\approx0{,}6931\,\bar x\).</li></ol>`,
res:String.raw`<p>\(\hat\theta=\bar x\), \(\mathbf I(\theta)=n/\theta^2\), \(\operatorname{var}(\hat\theta)=\theta^2/n\), \(\hat\sigma^2=\bar x^2\) y mediana \(\bar x\ln2\).</p>`},

{id:"ep4-2", n:"2", t:"Poisson: MLE de λ y de σ", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>Sea \(X_1,\dots,X_n\) una m.a. de \(X\sim\text{Poisson}(\lambda)\), con \(f(x)=\dfrac{e^{-\lambda}\lambda^x}{x!}\), x = 0, 1, 2, …, \(E(X)=\operatorname{var}(X)=\lambda\). Encuentre los literales a) a f) del punto 1 y <b>g)</b> el MLE de \(\sigma=sd(X)\).</p>`,
saber:[String.raw`\(E(\sum X_i)=\operatorname{var}(\sum X_i)=n\lambda\).`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(L(\lambda)=\dfrac{e^{-n\lambda}\lambda^{\sum x_i}}{\prod x_i!}\) y \(l(\lambda)=-n\lambda+\sum x_i\ln\lambda-\sum\ln x_i!\).</li>
<li><b>b)</b> \(s(\lambda)=-n+\dfrac{\sum x_i}{\lambda}=0\Rightarrow\hat\lambda_{MLE}=\bar x\).</li>
<li><b>c)</b> \(E[s]=-n+\dfrac{n\lambda}{\lambda}=0\).</li>
<li><b>d)</b> \(\mathbf H=-\dfrac{\sum x_i}{\lambda^2}\) y \(\mathbf H_1=\left(-n+\dfrac{\sum x_i}{\lambda}\right)^2\).</li>
<li><b>e)</b> \(-E(\mathbf H)=\dfrac{n\lambda}{\lambda^2}=\dfrac n\lambda=\mathbf I(\lambda)\). \(E(\mathbf H_1)=\operatorname{var}(s)=\dfrac{\operatorname{var}(\sum X_i)}{\lambda^2}=\dfrac{n\lambda}{\lambda^2}=\dfrac n\lambda\). ✓</li>
<li><b>f)</b> \(\operatorname{var}(\hat\lambda)=\dfrac\lambda n\).</li>
<li><b>g)</b> \(\sigma=\sqrt\lambda\Rightarrow\hat\sigma=\sqrt{\bar x}\) (invarianza).</li></ol>`,
res:String.raw`<p>\(\hat\lambda=\bar x\), \(\mathbf I(\lambda)=n/\lambda\), \(\operatorname{var}(\hat\lambda)=\lambda/n\) y \(\hat\sigma=\sqrt{\bar x}\).</p>`},

{id:"ep4-3", n:"3", t:"Normal con media y varianza desconocidas", tipo:"Estimación MLE con dos parámetros", temas:["mv-estimacion"],
enun:String.raw`<p>Sea \(X_1,\dots,X_n\) una m.a. de \(X\sim N(\mu,\sigma^2)\). Encuentre: <b>a)</b> \(L\), \(l\), el score y el MLE de \(\theta=(\mu;\sigma^2)\); <b>b)</b> pruebe \(E[s]=0\); <b>c)</b> la Hessiana y la información; <b>d)</b> \(\operatorname{var}(\hat\theta_{MLE})\).</p>`,
saber:[String.raw`\(E(X_i-\mu)=0\) y \(E(X_i-\mu)^2=\sigma^2\).`,String.raw`Con dos parámetros el score es un vector 2 × 1 y la Hessiana una matriz 2 × 2.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(L=(2\pi\sigma^2)^{-n/2}\exp\left[-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}\right]\) y \(l=-\dfrac n2\ln2\pi-\dfrac n2\ln\sigma^2-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}\).</li>
<li>Score: \(s(\theta)=\begin{bmatrix}\partial l/\partial\mu\\\partial l/\partial\sigma^2\end{bmatrix}=\begin{bmatrix}\dfrac{\sum(x_i-\mu)}{\sigma^2}\\-\dfrac n{2\sigma^2}+\dfrac{\sum(x_i-\mu)^2}{2\sigma^4}\end{bmatrix}\). Igualando a cero: \(\hat\mu=\bar x\) y \(\hat\sigma^2=\dfrac{\sum(x_i-\bar x)^2}{n}\).</li>
<li><b>b)</b> \(E\left[\dfrac{\sum(X_i-\mu)}{\sigma^2}\right]=0\) y \(E\left[-\dfrac n{2\sigma^2}+\dfrac{\sum(X_i-\mu)^2}{2\sigma^4}\right]=-\dfrac n{2\sigma^2}+\dfrac{n\sigma^2}{2\sigma^4}=0\).</li>
<li><b>c)</b> \(\mathbf H=\begin{bmatrix}-\dfrac n{\sigma^2}&-\dfrac{\sum(x_i-\mu)}{\sigma^4}\\-\dfrac{\sum(x_i-\mu)}{\sigma^4}&\dfrac n{2\sigma^4}-\dfrac{\sum(x_i-\mu)^2}{\sigma^6}\end{bmatrix}\). Su esperanza: la diagonal fuera de la principal vale 0 y \(\dfrac n{2\sigma^4}-\dfrac{n\sigma^2}{\sigma^6}=-\dfrac n{2\sigma^4}\). Entonces \(\mathbf I(\theta)=\begin{bmatrix}n/\sigma^2&0\\0&n/(2\sigma^4)\end{bmatrix}\).</li>
<li><b>d)</b> \(\operatorname{var}(\hat\theta)=\mathbf I^{-1}=\begin{bmatrix}\sigma^2/n&0\\0&2\sigma^4/n\end{bmatrix}\): \(\hat\mu\) y \(\hat\sigma^2\) son asintóticamente independientes.</li></ol>`,
res:String.raw`<p>\(\hat\mu=\bar x\), \(\hat\sigma^2=\sum(x_i-\bar x)^2/n\) (sesgado; \(E(\hat\sigma^2)=\frac{n-1}n\sigma^2\)), con varianzas asintóticas \(\sigma^2/n\) y \(2\sigma^4/n\).</p>`},

{id:"ep4-4", n:"4", t:"Geométrica: MLE e igualdad de la información", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>Sea \(X_1,\dots,X_n\) una m.a. de \(X\sim\text{geométrica}(\theta)\), con \(f(x;\theta)=\theta(1-\theta)^{x-1}\), x = 1, 2, 3, …, \(E(X)=1/\theta\) y \(\operatorname{var}(X)=(1-\theta)/\theta^2\). Encuentre <b>a)</b> \(L\), \(l\), el score y el MLE; <b>b)</b> pruebe \(E[s]=0\); <b>c)</b> la Hessiana, la información y la varianza asintótica de \(\hat\theta\); <b>d)</b> \(\mathbf H_1\) y verifique \(E(\mathbf H_1)=-E(\mathbf H)\).</p>`,
saber:[String.raw`\(E(\sum X_i)=n/\theta\) y \(\operatorname{var}(\sum X_i)=n(1-\theta)/\theta^2\).`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(L=\theta^n(1-\theta)^{\sum x_i-n}\), \(l=n\ln\theta+\left(\sum x_i-n\right)\ln(1-\theta)\) y \(s(\theta)=\dfrac n\theta-\dfrac{\sum x_i-n}{1-\theta}\). Igualando a cero: \(n(1-\theta)=\theta(\sum x_i-n)\Rightarrow n=\theta\sum x_i\Rightarrow\hat\theta_{MLE}=\dfrac{n}{\sum x_i}=\dfrac1{\bar x}\).</li>
<li><b>b)</b> \(E[s]=\dfrac n\theta-\dfrac{n/\theta-n}{1-\theta}=\dfrac n\theta-\dfrac{n(1-\theta)/\theta}{1-\theta}=\dfrac n\theta-\dfrac n\theta=0\).</li>
<li><b>c)</b> \(\mathbf H=-\dfrac n{\theta^2}-\dfrac{\sum x_i-n}{(1-\theta)^2}\). \(E(\mathbf H)=-\dfrac n{\theta^2}-\dfrac{n(1-\theta)/\theta}{(1-\theta)^2}=-\dfrac n{\theta^2}-\dfrac n{\theta(1-\theta)}=-\dfrac{n}{\theta^2(1-\theta)}\). Información: \(\mathbf I(\theta)=\dfrac n{\theta^2(1-\theta)}\) y varianza asintótica \(\dfrac{\theta^2(1-\theta)}{n}\).</li>
<li><b>d)</b> \(\mathbf H_1=s^2\). Escribiendo el score con denominador común, \(s=\dfrac{n-\theta\sum x_i}{\theta(1-\theta)}\), así que \(E(\mathbf H_1)=\operatorname{var}(s)=\dfrac{\theta^2\operatorname{var}(\sum X_i)}{\theta^2(1-\theta)^2}=\dfrac{n(1-\theta)/\theta^2}{(1-\theta)^2}=\dfrac{n}{\theta^2(1-\theta)}=-E(\mathbf H)\). ✓</li></ol>
<p class="hint">El literal e) del enunciado viene vacío en el documento del profesor.</p>`,
res:String.raw`<p>\(\hat\theta=1/\bar x\) con varianza asintótica \(\theta^2(1-\theta)/n\).</p>`},

{id:"ep4-5", n:"5", t:"Consumo en guerra y paz: cambio estructural con LR, W y LM", tipo:"Pruebas LR, W y LM", temas:["mv-pruebas","chow"],
enun:String.raw`<p>Modelo \(Y_t=\beta_1+\beta_2X_t+\mu_t\), con Y el consumo y X la renta disponible. Las primeras 5 observaciones son de guerra y las 10 siguientes de paz:</p>
<div class="tbl"><table><tr><th></th><th>Y</th><th>X</th></tr><tr><td>Guerra (t = 1 a 5)</td><td>1, 2, 2, 4, 6</td><td>2, 4, 6, 10, 13</td></tr><tr><td>Paz (t = 6 a 15)</td><td>1, 3, 3, 5, 6, 6, 7, 9, 9, 11</td><td>2, 4, 6, 8, 10, 12, 14, 16, 18, 20</td></tr></table></div>
<p>Use las pruebas LR, Wald y LM para determinar si hay cambio estructural. Especifique los modelos no restringido y restringido y las hipótesis.</p>`,
saber:[String.raw`<b>No restringido:</b> una recta para cada período, o en una sola ecuación con la dicótoma D = 1 en guerra: \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2(D_tX_t)+\mu_t\), k = 4. \(RSS_{NR}=RSS_{guerra}+RSS_{paz}\).`,
String.raw`<b>Restringido:</b> una sola recta para los 15 años. H₀: \(\delta_1=\delta_2=0\) (no hay cambio estructural), q = 2.`,
String.raw`\(l=-\frac n2\left[1+\ln2\pi+\ln(RSS/n)\right]\).`],
sol:String.raw`<ol class="steps">
<li><b>Guerra</b> (n₁ = 5): Σx = 35, Σy = 15, Σx² = 325, Σxy = 140, Σy² = 61. \(b_2=\dfrac{5(140)-35(15)}{5(325)-35^2}=\dfrac{175}{400}=0{,}4375\), \(b_1=3-0{,}4375(7)=-0{,}0625\). \(RSS_1=(61-5\cdot3^2)-0{,}4375^2(325-5\cdot7^2)=16-15{,}3125=0{,}6875\).</li>
<li><b>Paz</b> (n₂ = 10): Σx = 110, Σy = 60, Σx² = 1540, Σxy = 828, Σy² = 448. \(b_2=\dfrac{1680}{3300}=0{,}50909\), \(b_1=6-0{,}50909(11)=0{,}4\). \(RSS_2=88-0{,}50909^2(330)=2{,}47273\).</li>
<li>\(RSS_{NR}=0{,}6875+2{,}47273=3{,}16023\).</li>
<li><b>Restringido</b> (n = 15): Σx = 145, Σy = 75, Σx² = 1865, Σxy = 968, Σy² = 509. \(S_{XY}=968-145(75)/15=243\), \(S_{XX}=1865-145^2/15=463{,}333\), \(b_2=0{,}52446\), \(b_1=-0{,}06978\). \(RSS_R=134-0{,}52446^2(463{,}333)=6{,}55612\).</li>
<li>Log-verosimilitudes: \(l_{NR}=-7{,}5[1+\ln2\pi+\ln(3{,}16023/15)]=-9{,}6035\) y \(l_R=-15{,}0767\).</li>
<li><b>LR</b> \(=2(-9{,}6035+15{,}0767)=10{,}946\), igual a \(15\ln(6{,}55612/3{,}16023)=10{,}946\).</li>
<li><b>W</b> \(=15\,\dfrac{6{,}55612-3{,}16023}{3{,}16023}=16{,}119\).</li>
<li><b>LM</b> \(=15\,\dfrac{6{,}55612-3{,}16023}{6{,}55612}=7{,}770\). Con la regresión auxiliar de los errores del restringido contra 1, D, X y DX: \(R^2_{aux}=0{,}51797\) y \(nR^2=7{,}770\).</li>
<li>Valor crítico \(\chi^2_{0{,}05}(2)=5{,}991\). Se cumple \(W\ge LR\ge LM\). Como contraste exacto, la F de Chow: \(F=\dfrac{(6{,}55612-3{,}16023)/2}{3{,}16023/11}=5{,}910\) contra \(F_{0{,}05}(2,11)=3{,}982\) (p = 0,018).</li></ol>
<pre class="code"><code>Y = c(1,2,2,4,6, 1,3,3,5,6,6,7,9,9,11); X = c(2,4,6,10,13, 2,4,6,8,10,12,14,16,18,20)
D = c(rep(1,5), rep(0,10)); n = 15; q = 2
eq_nr = lm(Y ~ D + X + I(D*X)); eq_r = lm(Y ~ X)
RSS_NR = deviance(eq_nr); RSS_R = deviance(eq_r)
(LR = 2*(logLik(eq_nr) - logLik(eq_r))); (W = n*(RSS_R-RSS_NR)/RSS_NR); (LM = n*(RSS_R-RSS_NR)/RSS_R)
er = resid(eq_r); n * summary(lm(er ~ D + X + I(D*X)))$r.squared   # LM = nR2
qchisq(0.95, q)</code></pre>`,
res:String.raw`<p>LR = 10,95, W = 16,12 y LM = 7,77, las tres mayores que 5,991: se rechaza H₀. Hay cambio estructural: la función de consumo no es la misma en guerra y en paz (en guerra la propensión marginal a consumir es 0,44 y en paz 0,51).</p>`},

{id:"ep4-6", n:"6", t:"Función de producción: rendimientos constantes β₂ + β₃ = 1", tipo:"Pruebas LR, W y LM", temas:["mv-pruebas","inferencia"],
enun:String.raw`<p>Para 1961-2010 (n = 50) se estima \(Y_t=\beta_1+\beta_2X_{2t}+\beta_3X_{3t}+\mu_t\), con Y el producto, X₂ el capital y X₃ el trabajo: b = (−61,95519; 0,90783; 0,18000), errores estándar 53,75724, 0,11360 y 0,08364, R² = 0,9035, \(RSS_{NR}=92.605{,}07\), \(l_{NR}=-259{,}0488\), var(b₂) = 0,012904310, var(b₃) = 0,006995666, cov(b₂, b₃) = −0,008366772, Jarque-Bera = 7,4879 (p = 0,0235). El modelo restringido con β₂ + β₃ = 1 da b<sub>R</sub> = (−62,66675; 0,78197; 0,21803), \(RSS_R=97.405{,}13\) y \(l_R=-260{,}3122\).</p>
<p><b>a)</b> Interprete. <b>b)</b> Prueba LR con las dos alternativas. <b>c)</b> Wald usando solo el modelo sin restricción. <b>d)</b> ¿Se puede hacer la LM usando únicamente el modelo restringido?</p>`,
saber:[String.raw`<b>Wald solo con el NR:</b> \(W=\dfrac{(b_2+b_3-1)^2}{\hat\sigma^2_{MLE}\,[\text{elemento de }(X'X)^{-1}]}=F\cdot\dfrac{n}{n-k}\) para q = 1.`,String.raw`<code>vcov()</code> usa \(S^2=RSS/(n-k)\); la versión MLE multiplica por \((n-k)/n\).`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> El capital y el trabajo son significativos al 5 % (t = 7,99 y 2,15); el intercepto no (p = 0,25). Un aumento de una unidad de capital eleva el producto en 0,91 y una de trabajo en 0,18. El modelo explica el 90,35 % de la variación del producto. <b>Ojo:</b> Jarque-Bera tiene p = 0,0235 &lt; 0,05, así que se rechaza la normalidad de los errores. La verosimilitud del modelo supone errores normales, de modo que las pruebas LR, W y LM de este punto hay que leerlas con cautela.</li>
<li><b>b)</b> H₀: β₂ + β₃ = 1 contra H₁: β₂ + β₃ ≠ 1, q = 1. Con las log-verosimilitudes: \(LR=2(-259{,}0488+260{,}3122)=2{,}527\). Con las RSS: \(LR=50\ln\dfrac{97.405{,}13}{92.605{,}07}=2{,}527\).</li>
<li><b>c)</b> \(b_2+b_3-1=0{,}08783\). \(\operatorname{var}(b_2+b_3)=0{,}0129043+0{,}0069957-2(0{,}0083668)=0{,}0031664\). La F (60) es \(0{,}08783^2/0{,}0031664=2{,}436\) y el Wald asintótico \(W=2{,}436\cdot\dfrac{50}{47}=2{,}592\). Con las RSS da lo mismo: \(50\,\dfrac{4.800{,}06}{92.605{,}07}=2{,}592\).</li>
<li><b>d)</b> La LM «solo con el restringido» es la versión \(nR^2_{aux}\): regresar los errores del modelo restringido contra 1, X₂ y X₃. Esos errores no vienen en la información, así que <b>no se puede</b> hacer así. Sí se puede con las dos RSS: \(LM=50\,\dfrac{4.800{,}06}{97.405{,}13}=2{,}464\).</li>
<li>Valor crítico \(\chi^2_{0{,}05}(1)=3{,}841\); p-valores 0,112 (LR), 0,107 (W) y 0,116 (LM). Se cumple \(W\ge LR\ge LM\).</li></ol>
<p class="hint">El profesor calcula \(RSS_R=S^2_R\,(n-(k-1))=2.029{,}273\times48\) porque <code>restriktor</code> divide la RSS por \(n-k+q\).</p>`,
res:String.raw`<p>W = 2,59, LR = 2,53 y LM = 2,46, todas menores que 3,841: no se rechaza H₀. Los datos son compatibles con rendimientos constantes a escala.</p>`},

{id:"ep4-7", n:"7", t:"Normal con varianza conocida", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>Para una población normal con μ desconocida y σ² conocida, encuentre el MLE de μ, la Hessiana, la información y la varianza del estimador.</p>`,
saber:[String.raw`Es el punto 3 con un solo parámetro: σ² es una constante.`],
sol:String.raw`<ol class="steps">
<li>\(l(\mu)=-\dfrac n2\ln(2\pi\sigma^2)-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}\).</li>
<li>Score: \(s(\mu)=\dfrac{\sum(x_i-\mu)}{\sigma^2}=0\Rightarrow\hat\mu_{MLE}=\bar x\).</li>
<li>Hessiana: \(\mathbf H=-\dfrac n{\sigma^2}\) (no depende de los datos, así que \(E(\mathbf H)=\mathbf H\)).</li>
<li>Información: \(\mathbf I(\mu)=\dfrac n{\sigma^2}\) y \(\operatorname{var}(\hat\mu)=\dfrac{\sigma^2}{n}\).</li></ol>`,
res:String.raw`<p>\(\hat\mu=\bar x\) con varianza \(\sigma^2/n\), que alcanza la cota de Cramér-Rao.</p>`},

{id:"ep4-8", n:"8", t:"Costos de Nerlove: suma de elasticidades precio igual a 1", tipo:"F, LR, W y LM con las RSS", temas:["mv-pruebas","inferencia"],
enun:String.raw`<p>Con 29 empresas, Nerlove estimó \(\ln Y=\ln A+\beta_2\ln X+\beta_3\ln P_1+\beta_4\ln P_2+\beta_5\ln P_3+\mu\), con Y el costo total, X el producto en kWh y P₁, P₂, P₃ los precios del trabajo, del capital y del combustible.</p>
<p><b>Modelo 1:</b> \(\widehat{\ln Y}=-4{,}93+0{,}94\ln X+0{,}31\ln P_1-0{,}26\ln P_2+0{,}44\ln P_3\), con errores estándar (1,96) (0,11) (0,23) (0,29) (0,07) y RSS = 0,336.</p>
<p><b>Modelo 2</b> (con \(\beta_3+\beta_4+\beta_5=1\)): \(\widehat{\ln(Y/P_3)}=-6{,}55+0{,}91\ln X+0{,}51\ln(P_1/P_3)+0{,}09\ln(P_2/P_3)\), con RSS = 0,364.</p>
<p><b>a)</b> Interprete. <b>b)</b> ¿Cómo averiguaría si la restricción es válida?</p>`,
saber:[String.raw`En un modelo log-log cada coeficiente es una elasticidad.`,String.raw`n = 29, k = 5, q = 1.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> En el modelo 1, el costo sube 0,94 % por cada 1 % más de producto (economías de escala leves) y es significativo; también lo es el precio del combustible (0,44). Los precios del trabajo y del capital no son significativos y el del capital tiene signo negativo, contrario a lo esperado. En el modelo 2 la elasticidad del producto es 0,91 y la del combustible se obtiene por diferencia: \(1-0{,}51-0{,}09=0{,}40\).</li>
<li><b>b)</b> H₀: \(\beta_3+\beta_4+\beta_5=1\). F (64): \(F=\dfrac{(0{,}364-0{,}336)/1}{0{,}336/24}=2{,}00\) contra \(F_{0{,}05}(1,24)=4{,}26\) (p = 0,170).</li>
<li>\(W=29\,\dfrac{0{,}028}{0{,}336}=2{,}417\), \(LR=29\ln\dfrac{0{,}364}{0{,}336}=2{,}321\) y \(LM=29\,\dfrac{0{,}028}{0{,}364}=2{,}231\), contra \(\chi^2_{0{,}05}(1)=3{,}841\).</li>
<li>También se puede con la t de \(b_3+b_4+b_5-1\), pero para eso hace falta la covarianza de los coeficientes, que no viene en el enunciado.</li></ol>`,
res:String.raw`<p>F = 2,00; W = 2,42; LR = 2,32 y LM = 2,23: no se rechaza que las elasticidades precio sumen 1 (homogeneidad de grado uno en precios).</p>`},

{id:"ep4-9", n:"9", t:"Mortalidad infantil: incluir TFT y probar β₄ + 6β₃ = 0", tipo:"Pruebas LR, W y LM en todas sus versiones", temas:["mv-pruebas","inferencia"], tool:{id:"t-datos",pre:"mi",lbl:"Abrir la base de mortalidad infantil en el Laboratorio de datos"},
enun:String.raw`<p>Con 64 países se estiman (1) \(MI=\beta_1+\beta_2PIBPC+\beta_3TAF+\mu\) y (2) \(MI=\beta_1+\beta_2PIBPC+\beta_3TAF+\beta_4TFT+\mu\).</p>
<p><b>Modelo (1):</b> b = (263,641586; −0,005647; −2,231586), R² = 0,7077, \(RSS_1=106.315{,}6\), \(l_1=-328{,}1012\), Jarque-Bera = 0,5594 (p = 0,736). <b>Modelo (2):</b> b = (168,306690; −0,005511; −1,768029; 12,868636), errores estándar 32,89, 0,001878, 0,248017 y 4,190533, R² = 0,7474, \(RSS_2=91.875{,}38\), \(l_2=-323{,}4298\); var(b₃) = 0,0615124, var(b₄) = 17,56056, cov(b₃, b₄) = 0,63257. Regresión auxiliar de los errores del modelo (1) contra PIBPC, TAF y TFT: \(R^2_{aux}=0{,}1358243\).</p>
<p>Con la restricción \(\beta_4+6\beta_3=0\): \(RSS_{R1}=92.161{,}3\), \(l_R=-323{,}5293\), y la regresión auxiliar de sus errores da \(R^2_{aux1}=0{,}003102305\).</p>
<p><b>a)</b> Interprete. <b>b)</b> Pruebe si se justifica incluir TFT con W, LR y LM en todas sus versiones. <b>c)</b> Haga lo mismo para \(\beta_4+6\beta_3=0\).</p>`,
saber:[String.raw`Para b), el modelo restringido es el (1) y el no restringido el (2). H₀: β₄ = 0, q = 1.`,String.raw`La regresión auxiliar de los errores del restringido contra todas las regresoras es la LM: \(LM=nR^2_{aux}\).`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> En el modelo (1), un dólar más de PIB per cápita reduce la mortalidad en 0,0056 por mil, y un punto más de alfabetismo femenino la reduce en 2,23; ambos significativos, R² = 0,71 y errores normales. En el modelo (2), un hijo más por mujer (TFT) aumenta la mortalidad en 12,87 por mil: el signo positivo es el esperado, porque más hijos se asocian con menos cuidado por niño y peores condiciones. La regresión auxiliar es significativa (F = 3,14, p = 0,032), así que TFT explica lo que el modelo (1) deja en los errores: no conviene excluirla.</li>
<li><b>b)</b> \(LR=2(-323{,}4298+328{,}1012)=9{,}343\), o \(64\ln\dfrac{106.315{,}6}{91.875{,}38}=9{,}343\).</li>
<li>\(W=64\,\dfrac{14.440{,}22}{91.875{,}38}=10{,}059\). Solo con el modelo (2): \(t=12{,}868636/4{,}190533=3{,}071\), \(F=t^2=9{,}430\) y \(W=9{,}430\cdot\dfrac{64}{60}=10{,}059\).</li>
<li>\(LM=64\,\dfrac{14.440{,}22}{106.315{,}6}=8{,}693\), igual a \(nR^2_{aux}=64(0{,}1358243)=8{,}693\).</li>
<li>Las tres superan \(\chi^2_{0{,}05}(1)=3{,}841\): se rechaza β₄ = 0. Otras pruebas: la t (59) (t = 3,07, p = 0,003) y la F (64) (F = 9,43).</li>
<li><b>c)</b> H₀: \(\beta_4+6\beta_3=0\). \(b_4+6b_3=12{,}868636-10{,}608174=2{,}260462\) y \(\operatorname{var}(b_4+6b_3)=17{,}56056+36(0{,}0615124)+12(0{,}63257)=27{,}36585\). F (60) = \(2{,}260462^2/27{,}36585=0{,}1867\) y \(W=0{,}1867\cdot\dfrac{64}{60}=0{,}1992\), igual a \(64\,\dfrac{285{,}92}{91.875{,}38}=0{,}1992\).</li>
<li>\(LR=2(-323{,}4298+323{,}5293)=0{,}199\), o \(64\ln\dfrac{92.161{,}3}{91.875{,}38}=0{,}1989\). \(LM=64\,\dfrac{285{,}92}{92.161{,}3}=0{,}1986=nR^2_{aux1}=64(0{,}003102305)\).</li></ol>`,
res:String.raw`<p>b) W = 10,06, LR = 9,34 y LM = 8,69 &gt; 3,841: se justifica incluir TFT. c) W = 0,199, LR = 0,199 y LM = 0,199 &lt; 3,841: no se rechaza \(\beta_4+6\beta_3=0\). La regresión auxiliar no significativa (F = 0,06, p = 0,98) dice lo mismo: los errores del modelo restringido no tienen nada que las regresoras puedan explicar, así que imponer la restricción no le quita ajuste al modelo.</p>`},

{id:"ep4-10", n:"10", t:"Demanda de un artículo: β₂ + 3β₃ = 0 con LR, W y LM", tipo:"Pruebas LR, W y LM", temas:["mv-pruebas","inferencia"],
enun:String.raw`<p>Con datos de 1971 a 2005 (n = 35) se estima \(Y_t=\beta_1+\beta_2X_{2t}+\beta_3X_{3t}+\beta_4X_{4t}+\mu_t\) (demanda, precio, ingreso y precio del sustituto): b = (72,2928; −5,8139; 1,6672; 1,5408), \(RSS_{NR}=386{,}5032\); var(b₂) = 0,24705304, var(b₃) = 0,51093128, cov(b₂, b₃) = 0,09828469. El modelo restringido con β₂ + 3β₃ = 0 da \(RSS_R=388{,}017\), y la regresión auxiliar de sus errores contra X₂, X₃ y X₄ da \(R^2_{aux}=0{,}003901352\) (F = 0,04, p = 0,989).</p>
<p>Interprete la regresión auxiliar y úsela para decidir sobre H₀. Haga las pruebas LR, Wald y LM en todas las versiones posibles.</p>`,
saber:[String.raw`n = 35, k = 4, q = 1; \(\chi^2_{0{,}05}(1)=3{,}841\).`],
sol:String.raw`<ol class="steps">
<li><b>Regresión auxiliar:</b> ningún coeficiente es significativo y R² = 0,0039: los errores del modelo restringido no se pueden explicar con las regresoras, así que la restricción no le quita información al modelo. \(LM=nR^2_{aux}=35(0{,}003901352)=0{,}1365\).</li>
<li><b>LM</b> con las RSS: \(35\,\dfrac{388{,}017-386{,}5032}{388{,}017}=0{,}1365\).</li>
<li><b>LR</b> \(=35\ln\dfrac{388{,}017}{386{,}5032}=0{,}1368\). (No se dan las log-verosimilitudes, pero daría lo mismo.)</li>
<li><b>W</b> con las RSS: \(35\,\dfrac{1{,}5138}{386{,}5032}=0{,}1371\). Solo con el NR: \(b_2+3b_3=-0{,}8123\), \(\operatorname{var}=0{,}24705+9(0{,}51093)+6(0{,}09828)=5{,}43514\), F (60) = 0,1214 y \(W=0{,}1214\cdot\dfrac{35}{31}=0{,}1371\).</li></ol>`,
res:String.raw`<p>W = 0,137 ≥ LR = 0,137 ≥ LM = 0,137, todas muy por debajo de 3,841: no se rechaza β₂ + 3β₃ = 0, lo mismo que concluye la regresión auxiliar y la F = 0,121 del Taller 2.</p>`}]});

// ---------- Dinardo, capítulo 5 (problemas 5.1, 5.2, 5.3, 5.4, 5.7 y 5.8) y micropasos de Ejercicios propuestos 4
(function(){
// mp: lista de micropasos. Cada paso es [expresión, por qué]
const mp=a=>`<ol class="mp">${a.map(([e,w])=>`<li><div class="mp-e">${e}</div>${w?`<div class="por">${w}</div>`:""}</li>`).join("")}</ol>`;
const h=t=>`<h5>${t}</h5>`;

TALLERES.push({id:"tl-dinardo5", t:"Dinardo, capítulo 5", nl:"problema", sub:"Problemas 5.1, 5.2, 5.3, 5.4, 5.7 y 5.8 (Johnston y Dinardo): MLE y pruebas LR, W y LM", anchor:"mv-estimacion",
intro:String.raw`Los problemas del capítulo 5 del texto guía que pide el profesor en el punto 11 de los Ejercicios propuestos 4. Los problemas 5.7 y 5.8 usan los datos del Ejemplo 3.3 del libro (n = 5). Cada punto tiene el paso a paso y, debajo, un desplegable de <b>micropasos</b> con cada cálculo, cambio de forma y propiedad usada. Los números se verificaron en R.`,
puntos:[
{id:"d5-1", n:"5.1", t:"Bernoulli: media, varianza, MLE y varianza por las dos expresiones de la información", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>La variable y toma los valores 0 o 1 con \(f(y)=\theta^y(1-\theta)^{1-y}\), \(0\le\theta\le1\). Así, \(f(1)=\theta\) (éxito) y \(f(0)=1-\theta\) (fracaso). Verifique que \(E(y)=\theta\) y \(\operatorname{var}(y)=\theta(1-\theta)\). Con una muestra aleatoria de n observaciones, encuentre el MLE de θ y la varianza de su distribución muestral. Encuentre la varianza asintótica del MLE con cada una de las dos expresiones de la matriz de información de la ecuación (5.3).</p>`,
saber:[String.raw`Ecuación (5.3): \(\mathbf I(\theta)=E\left[\left(\dfrac{\partial l}{\partial\theta}\right)\left(\dfrac{\partial l}{\partial\theta}\right)'\right]=-E\left[\dfrac{\partial^2l}{\partial\theta\,\partial\theta'}\right]\).`,String.raw`Llame \(s=\sum y_i\) al número de éxitos; \(E(s)=n\theta\) y \(\operatorname{var}(s)=n\theta(1-\theta)\).`],
sol:String.raw`<ol class="steps">
<li>\(E(y)=0(1-\theta)+1(\theta)=\theta\); \(E(y^2)=\theta\), así que \(\operatorname{var}(y)=\theta-\theta^2=\theta(1-\theta)\).</li>
<li>\(L=\theta^{s}(1-\theta)^{n-s}\) y \(l=s\ln\theta+(n-s)\ln(1-\theta)\).</li>
<li>\(\dfrac{\partial l}{\partial\theta}=\dfrac s\theta-\dfrac{n-s}{1-\theta}=0\Rightarrow\hat\theta=\dfrac sn=\bar y=p\), la proporción muestral de éxitos.</li>
<li>Varianza de la distribución muestral: \(\operatorname{var}(p)=\dfrac{\theta(1-\theta)}{n}\).</li>
<li>Con la Hessiana: \(-E\left[\dfrac{\partial^2l}{\partial\theta^2}\right]=\dfrac{n}{\theta(1-\theta)}\). Con el score al cuadrado: \(E\left[\left(\dfrac{\partial l}{\partial\theta}\right)^2\right]=\dfrac{n}{\theta(1-\theta)}\). Las dos dan la misma información y la varianza asintótica \(\dfrac{\theta(1-\theta)}{n}\).</li></ol>`,
res:String.raw`<p>\(\hat\theta=p=s/n\), con \(\operatorname{var}(p)=\theta(1-\theta)/n\); las dos expresiones de la información dan \(n/[\theta(1-\theta)]\), y en este caso la varianza asintótica coincide con la exacta.</p>`,
micro:h("Media y varianza de y")+mp([
[String.raw`\(E(y)=\sum_y y\,f(y)=0\cdot f(0)+1\cdot f(1)\)`,"Definición de esperanza de una variable discreta: suma de cada valor por su probabilidad."],
[String.raw`\(=0\cdot(1-\theta)+1\cdot\theta=\theta\)`,"Se reemplaza f(0) = 1 − θ y f(1) = θ."],
[String.raw`\(E(y^2)=0^2(1-\theta)+1^2\theta=\theta\)`,"Misma definición aplicada a y². Como y solo vale 0 o 1, y² = y."],
[String.raw`\(\operatorname{var}(y)=E(y^2)-[E(y)]^2=\theta-\theta^2\)`,"Fórmula corta de la varianza: var(y) = E(y²) − [E(y)]²."],
[String.raw`\(=\theta(1-\theta)\)`,"Factor común θ."]])+
h("Verosimilitud y log-verosimilitud")+mp([
[String.raw`\(L(\theta)=\prod_{i=1}^n\theta^{y_i}(1-\theta)^{1-y_i}\)`,"Muestra aleatoria: las observaciones son independientes, así que la densidad conjunta es el producto de las marginales."],
[String.raw`\(=\theta^{\sum y_i}(1-\theta)^{\sum(1-y_i)}\)`,String.raw`Producto de potencias de la misma base: se suman los exponentes, \(a^m a^n=a^{m+n}\).`],
[String.raw`\(=\theta^{s}(1-\theta)^{n-s}\)`,String.raw`Se llama \(s=\sum y_i\); y \(\sum(1-y_i)=n-\sum y_i=n-s\).`],
[String.raw`\(l(\theta)=\ln\theta^s+\ln(1-\theta)^{n-s}\)`,String.raw`Logaritmo de un producto: \(\ln(ab)=\ln a+\ln b\).`],
[String.raw`\(=s\ln\theta+(n-s)\ln(1-\theta)\)`,String.raw`Logaritmo de una potencia: \(\ln a^k=k\ln a\).`]])+
h("Score y MLE")+mp([
[String.raw`\(\dfrac{\partial}{\partial\theta}\,s\ln\theta=\dfrac s\theta\)`,String.raw`Derivada del logaritmo: \(\frac{d}{d\theta}\ln\theta=\frac1\theta\); s es constante respecto a θ.`],
[String.raw`\(\dfrac{\partial}{\partial\theta}(n-s)\ln(1-\theta)=(n-s)\cdot\dfrac{1}{1-\theta}\cdot(-1)=-\dfrac{n-s}{1-\theta}\)`,"Regla de la cadena: la derivada de ln(u) es u′/u, con u = 1 − θ y u′ = −1."],
[String.raw`\(\dfrac s\theta-\dfrac{n-s}{1-\theta}=0\)`,"Condición de primer orden: el score se iguala a cero en el máximo."],
[String.raw`\(s(1-\theta)=\theta(n-s)\)`,"Se multiplican los dos lados por θ(1 − θ) > 0 (se quitan los denominadores)."],
[String.raw`\(s-s\theta=n\theta-s\theta\)`,"Se distribuye en los dos lados."],
[String.raw`\(s=n\theta\Rightarrow\hat\theta=\dfrac sn\)`,"El término −sθ aparece en los dos lados y se cancela; se despeja θ."],
[String.raw`\(\dfrac{\partial^2l}{\partial\theta^2}=-\dfrac s{\theta^2}-\dfrac{n-s}{(1-\theta)^2}<0\)`,"Condición de segundo orden: la segunda derivada es negativa (suma de dos términos negativos), así que es un máximo."]])+
h("Varianza de la distribución muestral")+mp([
[String.raw`\(\operatorname{var}(p)=\operatorname{var}\left(\dfrac sn\right)=\dfrac{1}{n^2}\operatorname{var}(s)\)`,String.raw`Propiedad: \(\operatorname{var}(aX)=a^2\operatorname{var}(X)\), con a = 1/n.`],
[String.raw`\(\operatorname{var}(s)=\sum\operatorname{var}(y_i)=n\theta(1-\theta)\)`,"Por independencia, la varianza de una suma es la suma de las varianzas; cada una vale θ(1 − θ)."],
[String.raw`\(\operatorname{var}(p)=\dfrac{n\theta(1-\theta)}{n^2}=\dfrac{\theta(1-\theta)}{n}\)`,"Se simplifica una n."]])+
h("Información con la Hessiana (segunda expresión)")+mp([
[String.raw`\(E\left[\dfrac{\partial^2l}{\partial\theta^2}\right]=-\dfrac{E(s)}{\theta^2}-\dfrac{n-E(s)}{(1-\theta)^2}\)`,"La esperanza es lineal y θ es una constante: solo s es aleatoria."],
[String.raw`\(=-\dfrac{n\theta}{\theta^2}-\dfrac{n-n\theta}{(1-\theta)^2}=-\dfrac n\theta-\dfrac{n}{1-\theta}\)`,"E(s) = nθ; se simplifica θ en el primero y (1 − θ) en el segundo, porque n − nθ = n(1 − θ)."],
[String.raw`\(=-\dfrac{n(1-\theta)+n\theta}{\theta(1-\theta)}=-\dfrac{n}{\theta(1-\theta)}\)`,"Denominador común θ(1 − θ); en el numerador, −nθ + nθ se cancela."],
[String.raw`\(\mathbf I(\theta)=\dfrac{n}{\theta(1-\theta)}\)`,"La información es menos la esperanza de la Hessiana."]])+
h("Información con el score al cuadrado (primera expresión)")+mp([
[String.raw`\(\dfrac{\partial l}{\partial\theta}=\dfrac{s(1-\theta)-\theta(n-s)}{\theta(1-\theta)}=\dfrac{s-n\theta}{\theta(1-\theta)}\)`,"Denominador común; en el numerador, −sθ + sθ se cancela."],
[String.raw`\(E\left[\left(\dfrac{\partial l}{\partial\theta}\right)^2\right]=\dfrac{E[(s-n\theta)^2]}{\theta^2(1-\theta)^2}\)`,"El denominador es constante y sale de la esperanza."],
[String.raw`\(E[(s-n\theta)^2]=\operatorname{var}(s)=n\theta(1-\theta)\)`,"Como E(s) = nθ, la esperanza del cuadrado de la desviación es la varianza de s."],
[String.raw`\(=\dfrac{n\theta(1-\theta)}{\theta^2(1-\theta)^2}=\dfrac{n}{\theta(1-\theta)}\)`,"Se simplifican θ y (1 − θ). Da lo mismo que con la Hessiana: es la igualdad de la información."],
[String.raw`\(\operatorname{var}_a(\hat\theta)=\mathbf I(\theta)^{-1}=\dfrac{\theta(1-\theta)}{n}\)`,"La varianza asintótica es la inversa de la información."]])},

{id:"d5-2", n:"5.2", t:"Uniforme en (0, α): un MLE que no sale de derivar", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>La densidad de la distribución uniforme es \(f(x\mid\alpha)=\dfrac1\alpha\), \(0&lt;x&lt;\alpha\). Encuentre el MLE de α.</p>`,
saber:[String.raw`Cuando el soporte (los valores posibles de x) depende del parámetro, el máximo puede estar en un extremo y no donde la derivada vale cero.`],
sol:String.raw`<ol class="steps">
<li>\(L(\alpha)=\alpha^{-n}\) si todas las observaciones cumplen \(x_i&lt;\alpha\), es decir si \(\alpha&gt;\max x_i\); y \(L(\alpha)=0\) si alguna \(x_i\ge\alpha\).</li>
<li>El score \(-n/\alpha\) nunca vale cero: no hay punto donde la derivada se anule.</li>
<li>Para \(\alpha&gt;\max x_i\), \(\alpha^{-n}\) es decreciente: la verosimilitud es más grande cuanto más pequeño sea α. El valor más pequeño compatible con los datos es el máximo de la muestra.</li></ol>`,
res:String.raw`<p>\(\hat\alpha_{MLE}=\max(x_1,\dots,x_n)=x_{(n)}\). Es sesgado hacia abajo (\(E(x_{(n)})=\frac{n}{n+1}\alpha\)), pero consistente. Es un caso donde no se cumplen las condiciones de regularidad, porque el soporte depende de α.</p>`,
micro:mp([
[String.raw`\(f(x_i\mid\alpha)=\dfrac1\alpha\cdot\mathbf 1(0<x_i<\alpha)\)`,"La función indicadora 𝟏(·) vale 1 si se cumple la condición y 0 si no: la densidad es cero fuera de (0, α)."],
[String.raw`\(L(\alpha)=\prod\dfrac1\alpha\mathbf 1(0<x_i<\alpha)=\alpha^{-n}\prod\mathbf 1(x_i<\alpha)\)`,String.raw`Independencia: producto de las densidades. El producto de n veces 1/α es \(\alpha^{-n}\).`],
[String.raw`\(\prod\mathbf 1(x_i<\alpha)=\mathbf 1(\max x_i<\alpha)\)`,"Todas las x son menores que α si y solo si la más grande lo es. Si una sola falla, el producto vale 0."],
[String.raw`\(\dfrac{d}{d\alpha}\ln\alpha^{-n}=\dfrac{d}{d\alpha}(-n\ln\alpha)=-\dfrac n\alpha\neq0\)`,"El score nunca se anula: igualar a cero no sirve aquí."],
[String.raw`\(\alpha_1<\alpha_2\Rightarrow\alpha_1^{-n}>\alpha_2^{-n}\)`,"Con potencia negativa, a mayor α menor valor: L decrece en α dentro de la zona permitida."],
[String.raw`\(\hat\alpha=\max x_i\)`,"Se escoge el α más pequeño que no hace cero la verosimilitud. (Con desigualdades estrictas el máximo se alcanza en el límite; en la práctica se toma el máximo muestral.)"],
[String.raw`\(E(x_{(n)})=\dfrac{n}{n+1}\alpha<\alpha\)`,"El máximo de n uniformes en (0, α) tiene esa media: subestima α, pero el sesgo desaparece cuando n crece."]])},

{id:"d5-3", n:"5.3", t:"Estimador alternativo p* = (s + 1)/(n + 2): media, varianza y consistencia", tipo:"Propiedades de estimadores", temas:["mv-estimacion"],
enun:String.raw`<p>Cuando ocurren s éxitos en n ensayos independientes con probabilidad de éxito θ, la proporción muestral \(p=s/n\) es el MLE de θ (problema 5.1). Considere el estimador alternativo \(p^*=\dfrac{s+1}{n+2}\). Encuentre la media y la varianza de \(p^*\) en términos de la media y la varianza de p. ¿Es \(p^*\) un estimador consistente de θ?</p>`,
saber:[String.raw`\(E(p)=\theta\), \(\operatorname{var}(p)=\theta(1-\theta)/n\).`,String.raw`Si el sesgo y la varianza tienden a cero cuando n → ∞, el estimador es consistente (converge en media cuadrática).`],
sol:String.raw`<ol class="steps">
<li>Como \(s=np\): \(p^*=\dfrac{np+1}{n+2}\).</li>
<li>\(E(p^*)=\dfrac{nE(p)+1}{n+2}=\dfrac{n\theta+1}{n+2}\).</li>
<li>\(\operatorname{var}(p^*)=\left(\dfrac{n}{n+2}\right)^2\operatorname{var}(p)=\dfrac{n\theta(1-\theta)}{(n+2)^2}\).</li>
<li>Sesgo: \(E(p^*)-\theta=\dfrac{1-2\theta}{n+2}\to0\), y la varianza \(\to0\). Es consistente.</li></ol>`,
res:String.raw`<p>\(E(p^*)=\dfrac{nE(p)+1}{n+2}\) y \(\operatorname{var}(p^*)=\left(\dfrac n{n+2}\right)^2\operatorname{var}(p)\). Es sesgado (salvo si θ = 1/2), pero consistente. Tiene menor varianza que p.</p>`,
micro:mp([
[String.raw`\(s=np\)`,"Despejando s de p = s/n."],
[String.raw`\(p^*=\dfrac{np+1}{n+2}=\dfrac{n}{n+2}\,p+\dfrac{1}{n+2}\)`,"Se separa la fracción: p* es una función lineal de p, de la forma a·p + c."],
[String.raw`\(E(p^*)=\dfrac{n}{n+2}E(p)+\dfrac1{n+2}\)`,"Linealidad de la esperanza: E(a·p + c) = a·E(p) + c."],
[String.raw`\(=\dfrac{n\theta+1}{n+2}\)`,"E(p) = θ, porque p es insesgado."],
[String.raw`\(\operatorname{var}(p^*)=\left(\dfrac n{n+2}\right)^2\operatorname{var}(p)\)`,"var(a·p + c) = a²·var(p): la constante c no cambia la dispersión."],
[String.raw`\(=\dfrac{n^2}{(n+2)^2}\cdot\dfrac{\theta(1-\theta)}{n}=\dfrac{n\theta(1-\theta)}{(n+2)^2}\)`,"Se reemplaza var(p) y se simplifica una n."],
[String.raw`\(\text{sesgo}=\dfrac{n\theta+1}{n+2}-\theta=\dfrac{n\theta+1-\theta(n+2)}{n+2}=\dfrac{1-2\theta}{n+2}\)`,"Se resta θ con denominador común; nθ − nθ se cancela."],
[String.raw`\(\lim_{n\to\infty}\dfrac{1-2\theta}{n+2}=0,\qquad\lim_{n\to\infty}\dfrac{n\theta(1-\theta)}{(n+2)^2}=0\)`,"El numerador queda fijo (o crece como n) y el denominador crece como n o como n²."],
[String.raw`\(ECM(p^*)=\text{sesgo}^2+\operatorname{var}(p^*)\to0\Rightarrow p^*\xrightarrow{p}\theta\)`,"Si el error cuadrático medio tiende a cero, el estimador converge en probabilidad: es consistente."],
[String.raw`\(\operatorname{var}(p^*)/\operatorname{var}(p)=\left(\dfrac{n}{n+2}\right)^2<1\)`,"p* es menos variable que p: cambia algo de sesgo por menos varianza."]])},

{id:"d5-4", n:"5.4", t:"Exponencial con la muestra 1, 2, 3: estimador y estimación", tipo:"Estimación MLE", temas:["mv-estimacion"],
enun:String.raw`<p>Se toma una muestra de tres valores x = 1, 2, 3 de la distribución exponencial \(f(x)=\dfrac1\theta e^{-x/\theta}\). Derive el <b>estimador</b> MV de θ y calcule la <b>estimación</b> MV para estos valores.</p>`,
saber:[String.raw`El <b>estimador</b> es la fórmula (una variable aleatoria); la <b>estimación</b> es el número que da con una muestra concreta.`],
sol:String.raw`<ol class="steps">
<li>\(l(\theta)=-n\ln\theta-\dfrac{\sum x_i}{\theta}\) y \(\dfrac{dl}{d\theta}=-\dfrac n\theta+\dfrac{\sum x_i}{\theta^2}=0\Rightarrow\hat\theta=\bar x\) (estimador).</li>
<li>Con la muestra: \(\sum x_i=6\), n = 3, \(\hat\theta=6/3=2\) (estimación).</li>
<li>Verificación: \(l(\theta)=-3\ln\theta-6/\theta\); en θ = 2 el score vale \(-3/2+6/4=0\) y la segunda derivada \(3/4-12/8=-0{,}75&lt;0\).</li></ol>`,
res:String.raw`<p>Estimador \(\hat\theta=\bar x\); estimación \(\hat\theta=2\). La varianza estimada es \(\hat\theta^2/n=4/3\).</p>`,
micro:mp([
[String.raw`\(L(\theta)=\prod_{i=1}^3\dfrac1\theta e^{-x_i/\theta}=\theta^{-3}e^{-(x_1+x_2+x_3)/\theta}\)`,String.raw`Independencia (producto). \((1/\theta)^3=\theta^{-3}\) y \(e^ae^be^c=e^{a+b+c}\).`],
[String.raw`\(l(\theta)=-3\ln\theta-\dfrac{\sum x_i}{\theta}\)`,String.raw`\(\ln\theta^{-3}=-3\ln\theta\) y \(\ln e^{c}=c\).`],
[String.raw`\(\dfrac{dl}{d\theta}=-\dfrac3\theta+\dfrac{\sum x_i}{\theta^2}\)`,String.raw`\(\frac{d}{d\theta}\ln\theta=\frac1\theta\); \(\frac{d}{d\theta}\theta^{-1}=-\theta^{-2}\), y el signo menos de adelante lo vuelve positivo.`],
[String.raw`\(-3\theta+\sum x_i=0\Rightarrow\hat\theta=\dfrac{\sum x_i}{3}=\bar x\)`,"Se iguala a cero y se multiplica por θ² > 0."],
[String.raw`\(\sum x_i=1+2+3=6\Rightarrow\hat\theta=2\)`,"Se reemplazan los datos."],
[String.raw`\(\dfrac{d^2l}{d\theta^2}=\dfrac{3}{\theta^2}-\dfrac{2\sum x_i}{\theta^3}=\dfrac34-\dfrac{12}{8}=-0{,}75\)`,"Segunda derivada evaluada en θ = 2: negativa, es un máximo."]])},

{id:"d5-7", n:"5.7", t:"Ejemplo 3.3: LR, W y LM para H₀: β₃ = −1 y la regresión auxiliar", tipo:"Pruebas LR, W y LM", temas:["mv-pruebas"],
enun:String.raw`<p>Con los datos del Ejemplo 3.3 calcule los estadísticos LR, W y LM para H₀: β₃ = −1. Verifique el LM calculando el error de la regresión restringida y regresándolo contra X₂ y X₃.</p>
<div class="tbl"><table><tr><th>Y</th><td>3</td><td>1</td><td>8</td><td>3</td><td>5</td></tr><tr><th>X₂</th><td>3</td><td>1</td><td>5</td><td>2</td><td>4</td></tr><tr><th>X₃</th><td>5</td><td>4</td><td>6</td><td>4</td><td>6</td></tr></table></div>`,
saber:[String.raw`Del Ejemplo 3.3: \(\hat Y=4+2{,}5X_2-1{,}5X_3\) y \(\mathbf e'\mathbf e=1{,}5\) (n = 5).`,String.raw`\(W=n\dfrac{RSS_R-RSS_{NR}}{RSS_{NR}}\), \(LR=n\ln\dfrac{RSS_R}{RSS_{NR}}\), \(LM=n\dfrac{RSS_R-RSS_{NR}}{RSS_R}=nR^2_{aux}\) (ecuaciones 5.15, 5.12 y 5.18).`],
sol:String.raw`<ol class="steps">
<li>Restringido: con β₃ = −1, \(Y=\beta_1+\beta_2X_2-X_3+u\), o sea \(Y+X_3=\beta_1+\beta_2X_2+u\). Con \(W=Y+X_3=(8,5,14,7,11)\): \(b_2=2{,}2\), \(b_1=2{,}4\).</li>
<li>Errores restringidos: \(\mathbf e_*=(-1;\;0{,}4;\;0{,}6;\;0{,}2;\;-0{,}2)\) y \(\mathbf e_*'\mathbf e_*=1{,}6\).</li>
<li>\(W=5(1{,}6-1{,}5)/1{,}5=0{,}333\); \(LR=5\ln(1{,}6/1{,}5)=0{,}323\); \(LM=5(0{,}1)/1{,}6=0{,}3125\).</li>
<li>Regresión auxiliar: \(\hat e_*=1{,}6+0{,}3X_2-0{,}5X_3\), con RSS = 1,5 y \(R^2=1-1{,}5/1{,}6=0{,}0625\). \(nR^2=0{,}3125=LM\). ✓</li></ol>`,
res:String.raw`<p>W = 0,333 ≥ LR = 0,323 ≥ LM = 0,3125, todas menores que \(\chi^2_{0{,}05}(1)=3{,}841\): no se rechaza β₃ = −1.</p>`,
micro:h("Modelo restringido")+mp([
[String.raw`\(Y=\beta_1+\beta_2X_2+\beta_3X_3+u\) con \(\beta_3=-1\)`,"Se reemplaza la restricción en el modelo."],
[String.raw`\(Y=\beta_1+\beta_2X_2-X_3+u\Rightarrow Y+X_3=\beta_1+\beta_2X_2+u\)`,"El término −X₃ ya no tiene parámetro: se pasa a la izquierda sumando. Queda una regresión simple de W = Y + X₃ contra X₂."],
[String.raw`\(W=(3+5,\;1+4,\;8+6,\;3+4,\;5+6)=(8,5,14,7,11)\)`,"Suma fila por fila."],
[String.raw`\(\sum X_2=15,\ \sum X_2^2=55,\ \sum W=45,\ \sum X_2W=3(8)+1(5)+5(14)+2(7)+4(11)=157\)`,"Las sumas que pide la fórmula de la pendiente."],
[String.raw`\(b_2=\dfrac{n\sum X_2W-\sum X_2\sum W}{n\sum X_2^2-(\sum X_2)^2}=\dfrac{5(157)-15(45)}{5(55)-15^2}=\dfrac{110}{50}=2{,}2\)`,"Fórmula de la pendiente de MCO en regresión simple."],
[String.raw`\(b_1=\bar W-b_2\bar X_2=9-2{,}2(3)=2{,}4\)`,String.raw`La recta pasa por el punto de medias: \(\bar W=45/5=9\), \(\bar X_2=15/5=3\).`],
[String.raw`\(\hat W=2{,}4+2{,}2X_2=(9;\;4{,}6;\;13{,}4;\;6{,}8;\;11{,}2)\)`,"Se evalúa la recta en cada X₂."],
[String.raw`\(\mathbf e_*=W-\hat W=(-1;\;0{,}4;\;0{,}6;\;0{,}2;\;-0{,}2)\)`,"Error = observado menos estimado. (Es lo mismo que Y − Ŷ del modelo restringido, porque X₃ se suma a los dos lados.)"],
[String.raw`\(\mathbf e_*'\mathbf e_*=1+0{,}16+0{,}36+0{,}04+0{,}04=1{,}6\)`,"Suma de los errores al cuadrado."]])+
h("Los tres estadísticos")+mp([
[String.raw`\(RSS_R-RSS_{NR}=1{,}6-1{,}5=0{,}1\)`,"Cuánto empeora el ajuste al imponer la restricción."],
[String.raw`\(W=5\cdot\dfrac{0{,}1}{1{,}5}=0{,}3333\)`,"Wald: divide entre el RSS no restringido."],
[String.raw`\(LR=5\ln\dfrac{1{,}6}{1{,}5}=5\ln(1{,}0667)=5(0{,}06454)=0{,}3227\)`,"Razón de verosimilitud con las RSS."],
[String.raw`\(LM=5\cdot\dfrac{0{,}1}{1{,}6}=0{,}3125\)`,"Multiplicadores de Lagrange: divide entre el RSS restringido, que es mayor; por eso LM es el más pequeño."],
[String.raw`\(W=\dfrac{(b_3+1)^2}{\hat\sigma^2_{MLE}\,c_{33}}=\dfrac{(-1{,}5+1)^2}{0{,}3(2{,}5)}=\dfrac{0{,}25}{0{,}75}=0{,}3333\)`,String.raw`Versión matricial con solo el NR: \(\hat\sigma^2_{MLE}=1{,}5/5=0{,}3\) y \(c_{33}=2{,}5\) es el elemento (3,3) de \((X'X)^{-1}=\frac1{10}\begin{bmatrix}267&45&-80\\45&10&-15\\-80&-15&25\end{bmatrix}\).`]])+
h("Verificación del LM con la regresión auxiliar")+mp([
[String.raw`\(\mathbf e_*=a_1+a_2X_2+a_3X_3+v\)`,"Se regresa el error restringido contra todas las regresoras del modelo no restringido."],
[String.raw`\(\hat{\mathbf e}_*=1{,}6+0{,}3X_2-0{,}5X_3,\quad RSS_{aux}=1{,}5\)`,"El RSS de la auxiliar es el RSS no restringido: ajustar e* con X₂ y X₃ equivale a volver al modelo completo."],
[String.raw`\(TSS_{aux}=\sum(e_{*i}-\bar e_*)^2=\sum e_{*i}^2=1{,}6\)`,"La media de e* es cero (la restricción no toca el intercepto), así que su TSS es su suma de cuadrados."],
[String.raw`\(R^2_{aux}=1-\dfrac{1{,}5}{1{,}6}=0{,}0625\)`,"Definición de R²."],
[String.raw`\(nR^2_{aux}=5(0{,}0625)=0{,}3125=LM\)`,String.raw`Coincide con el LM por las RSS, porque \(R^2_{aux}=(RSS_R-RSS_{NR})/RSS_R\).`]])},

{id:"d5-8", n:"5.8", t:"Ejemplo 3.3: LR, W y LM para H₀: β₂ + β₃ = 0", tipo:"Pruebas LR, W y LM", temas:["mv-pruebas"],
enun:String.raw`<p>Repita el problema 5.7 para H₀: β₂ + β₃ = 0.</p>`,
saber:[String.raw`Con β₃ = −β₂ el modelo queda en función de \(Z=X_2-X_3\).`],
sol:String.raw`<ol class="steps">
<li>Restringido: \(Y=\beta_1+\beta_2(X_2-X_3)+u\), con \(Z=(-2,-3,-1,-2,-2)\): \(b_2=3{,}5\), \(b_1=11\).</li>
<li>\(\mathbf e_*=(-1;\;0{,}5;\;0{,}5;\;-1;\;1)\) y \(\mathbf e_*'\mathbf e_*=3{,}5\).</li>
<li>\(W=5(2)/1{,}5=6{,}667\); \(LR=5\ln(3{,}5/1{,}5)=4{,}236\); \(LM=5(2)/3{,}5=2{,}857\).</li>
<li>Regresión auxiliar: \(\hat e_*=-7-X_2+2X_3\), RSS = 1,5, \(R^2=1-1{,}5/3{,}5=0{,}5714\) y \(nR^2=2{,}857=LM\). ✓</li></ol>`,
res:String.raw`<p>W = 6,67 y LR = 4,24 superan 3,841 (rechazan H₀), pero LM = 2,86 no. Es el orden \(W\ge LR\ge LM\) en acción: con n = 5 las pruebas asintóticas pueden contradecirse. La F exacta, \(F=\dfrac{2/1}{1{,}5/2}=2{,}67\) contra \(F_{0{,}05}(1,2)=18{,}51\), no rechaza.</p>`,
micro:h("Modelo restringido")+mp([
[String.raw`\(\beta_2+\beta_3=0\Rightarrow\beta_3=-\beta_2\)`,"Se despeja un parámetro en función del otro."],
[String.raw`\(Y=\beta_1+\beta_2X_2-\beta_2X_3+u=\beta_1+\beta_2(X_2-X_3)+u\)`,"Se reemplaza β₃ y se saca β₂ como factor común."],
[String.raw`\(Z=X_2-X_3=(3-5,\;1-4,\;5-6,\;2-4,\;4-6)=(-2,-3,-1,-2,-2)\)`,"Nueva regresora, fila por fila."],
[String.raw`\(\sum Z=-10,\ \sum Z^2=22,\ \sum ZY=-6-3-8-6-10=-33,\ \sum Y=20\)`,"Sumas para la fórmula de la pendiente."],
[String.raw`\(b_2=\dfrac{5(-33)-(-10)(20)}{5(22)-(-10)^2}=\dfrac{-165+200}{110-100}=\dfrac{35}{10}=3{,}5\)`,"Fórmula de la pendiente. Ojo con los signos: menos por menos es más."],
[String.raw`\(b_1=\bar Y-b_2\bar Z=4-3{,}5(-2)=11\)`,String.raw`Punto de medias: \(\bar Y=4\), \(\bar Z=-2\).`],
[String.raw`\(\hat Y=11+3{,}5Z=(4;\;0{,}5;\;7{,}5;\;4;\;4)\)`,"Se evalúa en cada Z."],
[String.raw`\(\mathbf e_*=(3-4,\;1-0{,}5,\;8-7{,}5,\;3-4,\;5-4)=(-1;\;0{,}5;\;0{,}5;\;-1;\;1)\)`,"Observado menos estimado."],
[String.raw`\(\mathbf e_*'\mathbf e_*=1+0{,}25+0{,}25+1+1=3{,}5\)`,"Suma de cuadrados."]])+
h("Los tres estadísticos")+mp([
[String.raw`\(RSS_R-RSS_{NR}=3{,}5-1{,}5=2\)`,"La restricción empeora mucho el ajuste."],
[String.raw`\(W=5\cdot\dfrac{2}{1{,}5}=6{,}667\)`,"Wald con las RSS."],
[String.raw`\(LR=5\ln\dfrac{3{,}5}{1{,}5}=5\ln(2{,}3333)=5(0{,}8473)=4{,}236\)`,"Razón de verosimilitud."],
[String.raw`\(LM=5\cdot\dfrac{2}{3{,}5}=2{,}857\)`,"Multiplicadores de Lagrange."],
[String.raw`\(R(X'X)^{-1}R'=c_{22}+c_{33}+2c_{23}=1+2{,}5+2(-1{,}5)=0{,}5\)`,"Con R = [0 1 1]: la varianza de b₂ + b₃ (sin σ²) suma las dos varianzas y dos veces la covarianza."],
[String.raw`\(W=\dfrac{(b_2+b_3)^2}{\hat\sigma^2_{MLE}(0{,}5)}=\dfrac{(2{,}5-1{,}5)^2}{0{,}3(0{,}5)}=\dfrac{1}{0{,}15}=6{,}667\)`,"Versión matricial: da lo mismo que con las RSS."]])+
h("Regresión auxiliar y decisión")+mp([
[String.raw`\(\hat e_*=-7-X_2+2X_3,\quad RSS_{aux}=1{,}5,\quad TSS_{aux}=3{,}5\)`,"Como en 5.7: el RSS de la auxiliar es el no restringido y su TSS es el restringido."],
[String.raw`\(R^2_{aux}=1-\dfrac{1{,}5}{3{,}5}=0{,}5714,\qquad nR^2=2{,}857\)`,"Coincide con el LM."],
[String.raw`\(\chi^2_{0{,}05}(1)=3{,}841:\quad W=6{,}67>3{,}84,\ LR=4{,}24>3{,}84,\ LM=2{,}86<3{,}84\)`,"Se compara cada estadístico con el valor crítico: dos rechazan y uno no."],
[String.raw`\(F=\dfrac{(3{,}5-1{,}5)/1}{1{,}5/(5-3)}=2{,}667<F_{0{,}05}(1,2)=18{,}51\)`,"La F es exacta en muestras pequeñas con errores normales; con solo 2 grados de libertad en el denominador, no rechaza."]])}]});

// ---------- micropasos de Ejercicios propuestos 4
const M={
"ep4-1":h("a) Verosimilitud y log-verosimilitud")+mp([
[String.raw`\(f(x_i;\theta)=\theta^{-1}e^{-x_i/\theta}\)`,"Se escribe 1/θ como θ⁻¹ (exponente negativo) para derivar más fácil."],
[String.raw`\(L(\theta)=\prod_{i=1}^n\theta^{-1}e^{-x_i/\theta}=\left(\theta^{-1}\right)^n\prod e^{-x_i/\theta}\)`,"Muestra aleatoria: la conjunta es el producto. Una constante multiplicada n veces es una potencia."],
[String.raw`\(=\theta^{-n}e^{-\sum x_i/\theta}\)`,String.raw`\((a^m)^n=a^{mn}\) y \(e^{a}e^{b}=e^{a+b}\): el producto de exponenciales suma los exponentes.`],
[String.raw`\(l(\theta)=\ln\theta^{-n}+\ln e^{-\sum x_i/\theta}\)`,String.raw`\(\ln(ab)=\ln a+\ln b\).`],
[String.raw`\(=-n\ln\theta-\dfrac{\sum x_i}{\theta}\)`,String.raw`\(\ln a^k=k\ln a\) y \(\ln e^c=c\).`]])+
h("b) Score y MLE")+mp([
[String.raw`\(\dfrac{d}{d\theta}(-n\ln\theta)=-\dfrac n\theta\)`,String.raw`\(\frac{d}{d\theta}\ln\theta=\frac1\theta\).`],
[String.raw`\(\dfrac{d}{d\theta}\left(-\sum x_i\,\theta^{-1}\right)=-\sum x_i\cdot(-1)\theta^{-2}=\dfrac{\sum x_i}{\theta^2}\)`,String.raw`Regla de la potencia \(\frac{d}{d\theta}\theta^k=k\theta^{k-1}\) con k = −1. Σxᵢ es constante respecto a θ.`],
[String.raw`\(-\dfrac n\theta+\dfrac{\sum x_i}{\theta^2}=0\)`,"Condición de primer orden."],
[String.raw`\(-n\theta+\sum x_i=0\)`,"Se multiplica todo por θ² > 0."],
[String.raw`\(\hat\theta=\dfrac{\sum x_i}{n}=\bar x\)`,"Se despeja θ."],
[String.raw`\(\mathbf H(\hat\theta)=\dfrac{n}{\bar x^2}-\dfrac{2n\bar x}{\bar x^3}=-\dfrac{n}{\bar x^2}<0\)`,"Segunda derivada en θ̂ (con Σxᵢ = n x̄): negativa, es un máximo."]])+
h("c) La esperanza del score es cero")+mp([
[String.raw`\(E[s(\theta)]=-\dfrac n\theta+\dfrac{E\left(\sum X_i\right)}{\theta^2}\)`,"Linealidad de la esperanza: los términos sin X salen tal cual."],
[String.raw`\(E\left(\sum X_i\right)=\sum E(X_i)=n\theta\)`,"La esperanza de una suma es la suma de esperanzas, y cada E(Xᵢ) = θ."],
[String.raw`\(=-\dfrac n\theta+\dfrac{n\theta}{\theta^2}=-\dfrac n\theta+\dfrac n\theta=0\)`,"Se simplifica θ."]])+
h("d) Hessiana y H₁")+mp([
[String.raw`\(\dfrac{d}{d\theta}\left(-n\theta^{-1}\right)=n\theta^{-2}\)`,String.raw`Regla de la potencia: \(-n\cdot(-1)\theta^{-2}\).`],
[String.raw`\(\dfrac{d}{d\theta}\left(\sum x_i\,\theta^{-2}\right)=-2\sum x_i\,\theta^{-3}\)`,"Regla de la potencia con k = −2."],
[String.raw`\(\mathbf H=\dfrac n{\theta^2}-\dfrac{2\sum x_i}{\theta^3},\qquad\mathbf H_1=s(\theta)^2\)`,"Con un solo parámetro, el producto exterior del score es su cuadrado."]])+
h("e) Información e igualdad de la información")+mp([
[String.raw`\(E(\mathbf H)=\dfrac n{\theta^2}-\dfrac{2n\theta}{\theta^3}=\dfrac n{\theta^2}-\dfrac{2n}{\theta^2}=-\dfrac n{\theta^2}\)`,"Linealidad y E(ΣXᵢ) = nθ; se simplifica θ."],
[String.raw`\(\mathbf I(\theta)=-E(\mathbf H)=\dfrac n{\theta^2}\)`,"Definición de la información."],
[String.raw`\(E(\mathbf H_1)=E(s^2)=\operatorname{var}(s)+[E(s)]^2=\operatorname{var}(s)\)`,String.raw`\(\operatorname{var}(Y)=E(Y^2)-[E(Y)]^2\), y E(s) = 0 por el literal c).`],
[String.raw`\(\operatorname{var}(s)=\operatorname{var}\left(-\dfrac n\theta+\dfrac{\sum X_i}{\theta^2}\right)=\dfrac{1}{\theta^4}\operatorname{var}\left(\sum X_i\right)\)`,String.raw`\(\operatorname{var}(a+bY)=b^2\operatorname{var}(Y)\): la constante −n/θ no aporta varianza.`],
[String.raw`\(\operatorname{var}\left(\sum X_i\right)=\sum\operatorname{var}(X_i)=n\theta^2\)`,"Por independencia, la varianza de la suma es la suma de las varianzas."],
[String.raw`\(E(\mathbf H_1)=\dfrac{n\theta^2}{\theta^4}=\dfrac n{\theta^2}=-E(\mathbf H)\)`,"Se cumple la igualdad de la información."]])+
h("f) y g) Varianza e invarianza")+mp([
[String.raw`\(\operatorname{var}(\hat\theta)=\mathbf I(\theta)^{-1}=\dfrac{\theta^2}{n}\)`,"La varianza asintótica del MLE es la inversa de la información (cota de Cramér-Rao)."],
[String.raw`\(\operatorname{var}(\bar x)=\dfrac{\operatorname{var}(\sum X_i)}{n^2}=\dfrac{n\theta^2}{n^2}=\dfrac{\theta^2}{n}\)`,"Comprobación exacta: coincide."],
[String.raw`\(\sigma^2=\theta^2\Rightarrow\hat\sigma^2=\hat\theta^2=\bar x^2\)`,"Invarianza: el MLE de g(θ) es g(θ̂)."],
[String.raw`\(F(m)=1-e^{-m/\theta}=\tfrac12\Rightarrow e^{-m/\theta}=\tfrac12\Rightarrow-\dfrac m\theta=\ln\tfrac12=-\ln2\Rightarrow m=\theta\ln2\)`,String.raw`De dónde sale la mediana: la acumulada vale 1/2. Se toma logaritmo y \(\ln(1/2)=-\ln2\).`],
[String.raw`\(\tilde\mu=\hat\theta\ln2=\bar x\ln2\)`,"Invarianza otra vez."]]),

"ep4-2":h("a) y b) Verosimilitud, score y MLE")+mp([
[String.raw`\(L(\lambda)=\prod\dfrac{e^{-\lambda}\lambda^{x_i}}{x_i!}=\dfrac{e^{-n\lambda}\lambda^{\sum x_i}}{\prod x_i!}\)`,String.raw`Producto: \(e^{-\lambda}\) n veces da \(e^{-n\lambda}\) y \(\lambda^{x_1}\cdots\lambda^{x_n}=\lambda^{\sum x_i}\).`],
[String.raw`\(l(\lambda)=-n\lambda+\sum x_i\ln\lambda-\sum\ln x_i!\)`,String.raw`\(\ln(a/b)=\ln a-\ln b\), \(\ln e^{c}=c\), \(\ln a^k=k\ln a\) y el logaritmo de un producto es la suma de logaritmos.`],
[String.raw`\(s(\lambda)=-n+\dfrac{\sum x_i}{\lambda}\)`,String.raw`\(\frac{d}{d\lambda}(-n\lambda)=-n\); \(\frac{d}{d\lambda}\ln\lambda=\frac1\lambda\); \(\sum\ln x_i!\) no depende de λ y su derivada es 0.`],
[String.raw`\(-n+\dfrac{\sum x_i}{\lambda}=0\Rightarrow\hat\lambda=\dfrac{\sum x_i}{n}=\bar x\)`,"Se iguala a cero y se multiplica por λ."]])+
h("c) a f) Esperanza del score, Hessiana e información")+mp([
[String.raw`\(E[s]=-n+\dfrac{E(\sum X_i)}{\lambda}=-n+\dfrac{n\lambda}{\lambda}=0\)`,"Linealidad de la esperanza y E(Xᵢ) = λ."],
[String.raw`\(\mathbf H=\dfrac{d}{d\lambda}\left(\sum x_i\,\lambda^{-1}\right)=-\dfrac{\sum x_i}{\lambda^2}\)`,"Regla de la potencia con k = −1; la derivada de −n es 0."],
[String.raw`\(-E(\mathbf H)=\dfrac{n\lambda}{\lambda^2}=\dfrac n\lambda\)`,"E(ΣXᵢ) = nλ."],
[String.raw`\(E(\mathbf H_1)=\operatorname{var}(s)=\dfrac{\operatorname{var}(\sum X_i)}{\lambda^2}=\dfrac{n\lambda}{\lambda^2}=\dfrac n\lambda\)`,"var(a + bY) = b²var(Y) con b = 1/λ; en la Poisson var(X) = λ, y la varianza de la suma es nλ."],
[String.raw`\(\operatorname{var}(\hat\lambda)=\dfrac{\lambda}{n},\qquad\hat\sigma=\sqrt{\bar x}\)`,String.raw`Inversa de la información; e invarianza con \(\sigma=\sqrt{\operatorname{var}(X)}=\sqrt\lambda\).`]]),

"ep4-3":h("a) Log-verosimilitud y score")+mp([
[String.raw`\(f(x_i)=(2\pi\sigma^2)^{-1/2}\exp\left[-\dfrac{(x_i-\mu)^2}{2\sigma^2}\right]\)`,String.raw`Densidad normal, con \(1/\sqrt{a}=a^{-1/2}\).`],
[String.raw`\(L=(2\pi\sigma^2)^{-n/2}\exp\left[-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}\right]\)`,"Producto de n densidades: potencias que se suman y exponentes que se suman."],
[String.raw`\(l=-\dfrac n2\ln(2\pi\sigma^2)-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}=-\dfrac n2\ln2\pi-\dfrac n2\ln\sigma^2-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}\)`,String.raw`\(\ln a^k=k\ln a\), \(\ln e^c=c\) y \(\ln(2\pi\sigma^2)=\ln2\pi+\ln\sigma^2\).`],
[String.raw`\(\dfrac{\partial}{\partial\mu}(x_i-\mu)^2=2(x_i-\mu)(-1)\)`,"Regla de la cadena: la derivada interna de (xᵢ − μ) respecto a μ es −1."],
[String.raw`\(\dfrac{\partial l}{\partial\mu}=-\dfrac{\sum2(x_i-\mu)(-1)}{2\sigma^2}=\dfrac{\sum(x_i-\mu)}{\sigma^2}\)`,"Los dos signos menos se cancelan y el 2 se simplifica."],
[String.raw`\(\dfrac{\partial l}{\partial\sigma^2}=-\dfrac{n}{2\sigma^2}+\dfrac{\sum(x_i-\mu)^2}{2\sigma^4}\)`,String.raw`Se trata σ² como una sola variable v: \(\frac{d}{dv}\ln v=\frac1v\) y \(\frac{d}{dv}v^{-1}=-v^{-2}\).`],
[String.raw`\(\sum(x_i-\mu)=0\Rightarrow\sum x_i-n\mu=0\Rightarrow\hat\mu=\bar x\)`,"La suma de una constante n veces es n veces la constante."],
[String.raw`\(-n\sigma^2+\sum(x_i-\hat\mu)^2=0\Rightarrow\hat\sigma^2=\dfrac{\sum(x_i-\bar x)^2}{n}\)`,"Se multiplica la segunda ecuación por 2σ⁴ y se reemplaza μ por μ̂."]])+
h("b) Esperanza del score")+mp([
[String.raw`\(E\left[\sum(X_i-\mu)\right]=\sum[E(X_i)-\mu]=\sum(\mu-\mu)=0\)`,"Linealidad de la esperanza."],
[String.raw`\(E\left[\sum(X_i-\mu)^2\right]=\sum E(X_i-\mu)^2=n\sigma^2\)`,String.raw`Definición de varianza: \(E(X-\mu)^2=\sigma^2\).`],
[String.raw`\(-\dfrac n{2\sigma^2}+\dfrac{n\sigma^2}{2\sigma^4}=-\dfrac n{2\sigma^2}+\dfrac n{2\sigma^2}=0\)`,"Se simplifica σ²."]])+
h("c) y d) Hessiana, información y varianza")+mp([
[String.raw`\(\dfrac{\partial^2l}{\partial\mu^2}=\dfrac{\sum(-1)}{\sigma^2}=-\dfrac n{\sigma^2}\)`,String.raw`Se deriva \(\sum(x_i-\mu)\) respecto a μ: cada término da −1.`],
[String.raw`\(\dfrac{\partial^2l}{\partial\mu\,\partial\sigma^2}=\sum(x_i-\mu)\cdot\dfrac{d}{dv}v^{-1}=-\dfrac{\sum(x_i-\mu)}{\sigma^4}\)`,"Derivada cruzada: se deriva el score de μ respecto a v = σ²."],
[String.raw`\(\dfrac{\partial^2l}{\partial(\sigma^2)^2}=\dfrac{n}{2\sigma^4}-\dfrac{2\sum(x_i-\mu)^2}{2\sigma^6}=\dfrac{n}{2\sigma^4}-\dfrac{\sum(x_i-\mu)^2}{\sigma^6}\)`,String.raw`\(\frac{d}{dv}(-\frac{n}{2}v^{-1})=\frac n2v^{-2}\) y \(\frac{d}{dv}v^{-2}=-2v^{-3}\).`],
[String.raw`\(E\left[-\dfrac{\sum(X_i-\mu)}{\sigma^4}\right]=0,\qquad E\left[\dfrac n{2\sigma^4}-\dfrac{\sum(X_i-\mu)^2}{\sigma^6}\right]=\dfrac n{2\sigma^4}-\dfrac{n\sigma^2}{\sigma^6}=-\dfrac n{2\sigma^4}\)`,"Mismas esperanzas del literal b)."],
[String.raw`\(\mathbf I=\begin{bmatrix}n/\sigma^2&0\\0&n/(2\sigma^4)\end{bmatrix}\Rightarrow\mathbf I^{-1}=\begin{bmatrix}\sigma^2/n&0\\0&2\sigma^4/n\end{bmatrix}\)`,"La inversa de una matriz diagonal invierte cada elemento de la diagonal."],
[String.raw`\(E\left[\sum(X_i-\bar X)^2\right]=(n-1)\sigma^2\Rightarrow E(\hat\sigma^2)=\dfrac{n-1}{n}\sigma^2\)`,"Por qué el MLE de σ² es sesgado: se divide por n y no por n − 1."]]),

"ep4-4":h("a) Verosimilitud, score y MLE")+mp([
[String.raw`\(L=\prod\theta(1-\theta)^{x_i-1}=\theta^n(1-\theta)^{\sum(x_i-1)}\)`,"θ multiplicado n veces es θⁿ; potencias de la misma base suman exponentes."],
[String.raw`\(\sum(x_i-1)=\sum x_i-n\)`,"La suma de n unos es n."],
[String.raw`\(l=n\ln\theta+\left(\sum x_i-n\right)\ln(1-\theta)\)`,"Logaritmo del producto y de las potencias."],
[String.raw`\(\dfrac{d}{d\theta}\ln(1-\theta)=\dfrac{-1}{1-\theta}\)`,"Regla de la cadena: u = 1 − θ, u′ = −1."],
[String.raw`\(s=\dfrac n\theta-\dfrac{\sum x_i-n}{1-\theta}=0\)`,"Score igualado a cero."],
[String.raw`\(n(1-\theta)=\theta\left(\sum x_i-n\right)\)`,"Se multiplica por θ(1 − θ)."],
[String.raw`\(n-n\theta=\theta\sum x_i-n\theta\Rightarrow n=\theta\sum x_i\)`,"Se distribuye; −nθ se cancela en los dos lados."],
[String.raw`\(\hat\theta=\dfrac{n}{\sum x_i}=\dfrac1{\bar x}\)`,String.raw`Se despeja θ y se usa \(\sum x_i=n\bar x\).`]])+
h("b) Esperanza del score")+mp([
[String.raw`\(E\left(\sum X_i-n\right)=\dfrac n\theta-n=\dfrac{n(1-\theta)}{\theta}\)`,"E(Xᵢ) = 1/θ y factor común n."],
[String.raw`\(E[s]=\dfrac n\theta-\dfrac{n(1-\theta)/\theta}{1-\theta}=\dfrac n\theta-\dfrac n\theta=0\)`,"(1 − θ) se simplifica."]])+
h("c) y d) Hessiana, información y H₁")+mp([
[String.raw`\(\dfrac{d}{d\theta}\dfrac n\theta=-\dfrac n{\theta^2}\)`,"Regla de la potencia."],
[String.raw`\(\dfrac{d}{d\theta}(1-\theta)^{-1}=(-1)(1-\theta)^{-2}(-1)=(1-\theta)^{-2}\)`,"Regla de la cadena: dos signos menos se cancelan."],
[String.raw`\(\mathbf H=-\dfrac n{\theta^2}-\dfrac{\sum x_i-n}{(1-\theta)^2}\)`,"Se deriva cada término del score."],
[String.raw`\(E(\mathbf H)=-\dfrac n{\theta^2}-\dfrac{n(1-\theta)/\theta}{(1-\theta)^2}=-\dfrac n{\theta^2}-\dfrac n{\theta(1-\theta)}\)`,"Se reemplaza la esperanza del literal b) y se simplifica un (1 − θ)."],
[String.raw`\(=-\dfrac{n(1-\theta)+n\theta}{\theta^2(1-\theta)}=-\dfrac n{\theta^2(1-\theta)}\)`,"Denominador común θ²(1 − θ); −nθ + nθ se cancela."],
[String.raw`\(s=\dfrac{n(1-\theta)-\theta(\sum x_i-n)}{\theta(1-\theta)}=\dfrac{n-\theta\sum x_i}{\theta(1-\theta)}\)`,"Score con denominador común."],
[String.raw`\(E(\mathbf H_1)=\operatorname{var}(s)=\dfrac{\theta^2\operatorname{var}(\sum X_i)}{\theta^2(1-\theta)^2}\)`,"var(a + bY) = b²var(Y) con b = −θ/[θ(1 − θ)]."],
[String.raw`\(=\dfrac{n(1-\theta)/\theta^2}{(1-\theta)^2}=\dfrac{n}{\theta^2(1-\theta)}\)`,"var(ΣXᵢ) = n(1 − θ)/θ²; se simplifica (1 − θ). Coincide con −E(H)."]]),

"ep4-7":mp([
[String.raw`\(l(\mu)=-\dfrac n2\ln(2\pi\sigma^2)-\dfrac{\sum(x_i-\mu)^2}{2\sigma^2}\)`,"Igual que el punto 3, pero σ² es un número conocido: el primer término es constante."],
[String.raw`\(\dfrac{dl}{d\mu}=\dfrac{\sum(x_i-\mu)}{\sigma^2}\)`,"Regla de la cadena sobre (xᵢ − μ)²; la constante tiene derivada cero."],
[String.raw`\(\sum x_i-n\mu=0\Rightarrow\hat\mu=\bar x\)`,"Se iguala a cero y se despeja."],
[String.raw`\(\mathbf H=\dfrac{d}{d\mu}\dfrac{\sum(x_i-\mu)}{\sigma^2}=-\dfrac n{\sigma^2}\)`,"Cada término da −1/σ²."],
[String.raw`\(\mathbf I=-E(\mathbf H)=\dfrac n{\sigma^2},\qquad\operatorname{var}(\hat\mu)=\dfrac{\sigma^2}{n}\)`,"La Hessiana no depende de los datos: su esperanza es ella misma."]]),

"ep4-5":h("Pendiente, intercepto y RSS de cada período")+mp([
[String.raw`\(b_2=\dfrac{n\sum xy-\sum x\sum y}{n\sum x^2-(\sum x)^2}\)`,"Fórmula de la pendiente de MCO en regresión simple."],
[String.raw`\(\text{Guerra: }b_2=\dfrac{5(140)-35(15)}{5(325)-35^2}=\dfrac{700-525}{1625-1225}=\dfrac{175}{400}=0{,}4375\)`,"Se reemplazan las sumas."],
[String.raw`\(b_1=\bar y-b_2\bar x=\dfrac{15}5-0{,}4375\cdot\dfrac{35}5=3-3{,}0625=-0{,}0625\)`,"La recta pasa por el punto de medias."],
[String.raw`\(RSS=S_{YY}-b_2^2S_{XX},\quad S_{YY}=\sum y^2-n\bar y^2,\quad S_{XX}=\sum x^2-n\bar x^2\)`,"La RSS es la variación total de Y menos la explicada (ESS = b₂²S_XX)."],
[String.raw`\(RSS_1=(61-5\cdot9)-0{,}4375^2(325-5\cdot49)=16-0{,}19141(80)=16-15{,}3125=0{,}6875\)`,"Guerra."],
[String.raw`\(\text{Paz: }b_2=\dfrac{10(828)-110(60)}{10(1540)-110^2}=\dfrac{1680}{3300}=0{,}50909,\quad b_1=6-0{,}50909(11)=0{,}4\)`,"Mismas fórmulas con n = 10."],
[String.raw`\(RSS_2=(448-360)-0{,}50909^2(1540-1210)=88-85{,}527=2{,}4727\)`,"Paz."],
[String.raw`\(RSS_{NR}=RSS_1+RSS_2=3{,}1602\)`,"El modelo con D y D·X equivale a dos rectas separadas, así que su RSS es la suma."]])+
h("Modelo restringido y log-verosimilitudes")+mp([
[String.raw`\(S_{XY}=968-\dfrac{145(75)}{15}=243,\quad S_{XX}=1865-\dfrac{145^2}{15}=463{,}333\)`,"Sumas en desviaciones con los 15 datos."],
[String.raw`\(b_2=\dfrac{243}{463{,}333}=0{,}52446,\quad b_1=5-0{,}52446(9{,}6667)=-0{,}0698\)`,"Pendiente e intercepto de la recta común."],
[String.raw`\(RSS_R=(509-15\cdot25)-0{,}52446(243)=134-127{,}444=6{,}5561\)`,"ESS = b₂·S_XY = b₂²·S_XX."],
[String.raw`\(l=-\dfrac n2\left[1+\ln2\pi+\ln\dfrac{RSS}{n}\right]\)`,"Log-verosimilitud del modelo lineal en el máximo, con σ̂² = RSS/n."],
[String.raw`\(l_{NR}=-7{,}5\,[1+1{,}83788+\ln(0{,}21068)]=-7{,}5\,(2{,}83788-1{,}55742)=-9{,}6035\)`,"n/2 = 7,5; ln 2π = 1,83788."],
[String.raw`\(l_R=-7{,}5\,[2{,}83788+\ln(0{,}43707)]=-7{,}5\,(2{,}83788-0{,}82766)=-15{,}0767\)`,"Igual con el restringido."]])+
h("Estadísticos")+mp([
[String.raw`\(LR=2(l_{NR}-l_R)=2(-9{,}6035+15{,}0767)=2(5{,}4732)=10{,}946\)`,"Versión con log-verosimilitudes."],
[String.raw`\(LR=15\ln\dfrac{6{,}5561}{3{,}1602}=15\ln(2{,}0746)=15(0{,}72975)=10{,}946\)`,"Versión con las RSS: es la misma porque las l dependen de ln(RSS/n)."],
[String.raw`\(RSS_R-RSS_{NR}=6{,}5561-3{,}1602=3{,}3959\)`,"Pérdida de ajuste."],
[String.raw`\(W=15\cdot\dfrac{3{,}3959}{3{,}1602}=15(1{,}07457)=16{,}119\)`,"Wald."],
[String.raw`\(LM=15\cdot\dfrac{3{,}3959}{6{,}5561}=15(0{,}51797)=7{,}770\)`,"Multiplicadores de Lagrange."],
[String.raw`\(R^2_{aux}=1-\dfrac{RSS_{NR}}{RSS_R}=\dfrac{RSS_R-RSS_{NR}}{RSS_R}=0{,}51797\Rightarrow nR^2=7{,}770\)`,"En la auxiliar, el RSS es el no restringido y el TSS es el restringido (los errores restringidos tienen media cero)."],
[String.raw`\(\chi^2_{0{,}05}(2)=5{,}991\)`,"q = 2 restricciones (δ₁ = 0 y δ₂ = 0)."]]),

"ep4-6":mp([
[String.raw`\(LR=2(l_{NR}-l_R)=2(-259{,}0488+260{,}3122)=2(1{,}2634)=2{,}5268\)`,"Restar un número negativo es sumar: −259,0488 + 260,3122."],
[String.raw`\(LR=50\ln\dfrac{97.405{,}13}{92.605{,}07}=50\ln(1{,}051834)=50(0{,}050535)=2{,}5267\)`,"Versión con las RSS."],
[String.raw`\(b_2+b_3-1=0{,}90783+0{,}18000-1=0{,}08783\)`,String.raw`Cuánto se aleja la estimación de la restricción: \(R\mathbf b-r\) con R = [0 1 1], r = 1.`],
[String.raw`\(\operatorname{var}(b_2+b_3)=\operatorname{var}(b_2)+\operatorname{var}(b_3)+2\operatorname{cov}(b_2,b_3)\)`,"Varianza de una suma de variables correlacionadas."],
[String.raw`\(=0{,}0129043+0{,}0069957+2(-0{,}0083668)=0{,}0199-0{,}0167336=0{,}0031664\)`,"La covarianza negativa reduce la varianza de la suma."],
[String.raw`\(F=\dfrac{0{,}08783^2}{0{,}0031664}=\dfrac{0{,}0077141}{0{,}0031664}=2{,}4362\)`,"F (60): usa la varianza de vcov(), que tiene S² = RSS/(n − k)."],
[String.raw`\(S^2=\dfrac{92.605{,}07}{47}=1.970{,}32,\qquad\hat\sigma^2_{MLE}=\dfrac{92.605{,}07}{50}=1.852{,}10\)`,"Las dos varianzas del error: dividen por n − k y por n."],
[String.raw`\(W=F\cdot\dfrac{S^2}{\hat\sigma^2_{MLE}}=F\cdot\dfrac{n}{n-k}=2{,}4362\cdot\dfrac{50}{47}=2{,}5917\)`,"Wald asintótico: cambiar S² por σ̂²_MLE multiplica por n/(n − k)."],
[String.raw`\(RSS_R-RSS_{NR}=97.405{,}13-92.605{,}07=4.800{,}06\)`,"Pérdida de ajuste."],
[String.raw`\(W=50\cdot\dfrac{4.800{,}06}{92.605{,}07}=2{,}5917,\qquad LM=50\cdot\dfrac{4.800{,}06}{97.405{,}13}=2{,}4640\)`,"Versiones con las RSS."],
[String.raw`\(RSS_R=S^2_R\,(n-k+q)=2.029{,}273\times48=97.405{,}1\)`,"Por qué el profesor multiplica por 48: restriktor divide la RSS restringida por n − k + q = 50 − 3 + 1."]]),

"ep4-8":mp([
[String.raw`\(\beta_5=1-\beta_3-\beta_4\)`,"Se despeja un coeficiente de la restricción."],
[String.raw`\(\ln Y=\ln A+\beta_2\ln X+\beta_3\ln P_1+\beta_4\ln P_2+(1-\beta_3-\beta_4)\ln P_3\)`,"Se reemplaza en el modelo."],
[String.raw`\(\ln Y-\ln P_3=\ln A+\beta_2\ln X+\beta_3(\ln P_1-\ln P_3)+\beta_4(\ln P_2-\ln P_3)\)`,String.raw`Se pasa \(\ln P_3\) a la izquierda y se agrupan los términos de β₃ y β₄.`],
[String.raw`\(\ln\dfrac{Y}{P_3}=\ln A+\beta_2\ln X+\beta_3\ln\dfrac{P_1}{P_3}+\beta_4\ln\dfrac{P_2}{P_3}\)`,String.raw`\(\ln a-\ln b=\ln(a/b)\): de ahí sale el modelo 2.`],
[String.raw`\(F=\dfrac{(0{,}364-0{,}336)/1}{0{,}336/(29-5)}=\dfrac{0{,}028}{0{,}014}=2{,}00\)`,"F (64) con q = 1 y n − k = 24."],
[String.raw`\(W=29\cdot\dfrac{0{,}028}{0{,}336}=29(0{,}08333)=2{,}417\)`,"Wald con las RSS."],
[String.raw`\(LR=29\ln\dfrac{0{,}364}{0{,}336}=29\ln(1{,}08333)=29(0{,}08004)=2{,}321\)`,"Razón de verosimilitud."],
[String.raw`\(LM=29\cdot\dfrac{0{,}028}{0{,}364}=29(0{,}07692)=2{,}231\)`,"Multiplicadores de Lagrange."],
[String.raw`\(\hat\beta_5=1-0{,}51-0{,}09=0{,}40\)`,"Elasticidad del combustible en el modelo restringido, por la restricción."]]),

"ep4-9":h("b) Incluir TFT (H₀: β₄ = 0)")+mp([
[String.raw`\(RSS_R-RSS_{NR}=106.315{,}6-91.875{,}38=14.440{,}22\)`,"El restringido es el modelo (1), sin TFT."],
[String.raw`\(LR=2(-323{,}4298+328{,}1012)=2(4{,}6714)=9{,}343\)`,"Con las log-verosimilitudes."],
[String.raw`\(LR=64\ln\dfrac{106.315{,}6}{91.875{,}38}=64\ln(1{,}15717)=64(0{,}14598)=9{,}343\)`,"Con las RSS."],
[String.raw`\(W=64\cdot\dfrac{14.440{,}22}{91.875{,}38}=64(0{,}15717)=10{,}059\)`,"Wald con las RSS."],
[String.raw`\(t=\dfrac{12{,}868636}{4{,}190533}=3{,}0709,\quad F=t^2=9{,}4303,\quad W=9{,}4303\cdot\dfrac{64}{60}=10{,}059\)`,"Wald solo con el modelo (2): para una restricción, F = t², y W = F·n/(n − k)."],
[String.raw`\(LM=64\cdot\dfrac{14.440{,}22}{106.315{,}6}=64(0{,}135824)=8{,}693=64\,R^2_{aux}\)`,"La regresión auxiliar del enunciado (errores del modelo 1 contra PIBPC, TAF y TFT) da exactamente ese R²."]])+
h("c) H₀: β₄ + 6β₃ = 0")+mp([
[String.raw`\(R=[0\;\;0\;\;6\;\;1],\quad r=0\)`,"La restricción escrita como Rβ = r."],
[String.raw`\(b_4+6b_3=12{,}868636+6(-1{,}768029)=12{,}868636-10{,}608174=2{,}260462\)`,"Se reemplazan los coeficientes del modelo (2)."],
[String.raw`\(\operatorname{var}(6b_3+b_4)=6^2\operatorname{var}(b_3)+\operatorname{var}(b_4)+2(6)(1)\operatorname{cov}(b_3,b_4)\)`,String.raw`\(\operatorname{var}(aX+bY)=a^2\operatorname{var}X+b^2\operatorname{var}Y+2ab\operatorname{cov}(X,Y)\).`],
[String.raw`\(=36(0{,}0615124)+17{,}56056+12(0{,}63257)=2{,}21445+17{,}56056+7{,}59084=27{,}36585\)`,"Se reemplazan los valores de var(b)."],
[String.raw`\(F=\dfrac{2{,}260462^2}{27{,}36585}=\dfrac{5{,}10969}{27{,}36585}=0{,}18672,\quad W=0{,}18672\cdot\dfrac{64}{60}=0{,}19917\)`,"F (60) y su versión asintótica."],
[String.raw`\(RSS_{R1}-RSS_{NR}=92.161{,}3-91.875{,}38=285{,}92\)`,"Pérdida de ajuste con la restricción."],
[String.raw`\(W=64\cdot\dfrac{285{,}92}{91.875{,}38}=0{,}1992,\quad LM=64\cdot\dfrac{285{,}92}{92.161{,}3}=0{,}1986=64(0{,}003102305)\)`,"Versiones con las RSS y la auxiliar."],
[String.raw`\(LR=2(-323{,}4298+323{,}5293)=2(0{,}0995)=0{,}199\)`,"Con las log-verosimilitudes."]]),

"ep4-10":mp([
[String.raw`\(b_2+3b_3=-5{,}8139+3(1{,}6672)=-5{,}8139+5{,}0016=-0{,}8123\)`,"Rb − r con R = [0 1 3 0] y r = 0."],
[String.raw`\(\operatorname{var}(b_2+3b_3)=\operatorname{var}(b_2)+9\operatorname{var}(b_3)+2(1)(3)\operatorname{cov}(b_2,b_3)\)`,String.raw`\(\operatorname{var}(aX+bY)\) con a = 1, b = 3.`],
[String.raw`\(=0{,}24705+9(0{,}51093)+6(0{,}09828)=0{,}24705+4{,}59838+0{,}58971=5{,}43514\)`,"Se reemplazan los valores."],
[String.raw`\(F=\dfrac{(-0{,}8123)^2}{5{,}43514}=\dfrac{0{,}65983}{5{,}43514}=0{,}1214,\quad W=0{,}1214\cdot\dfrac{35}{31}=0{,}1371\)`,"F (60) y Wald asintótico, con n = 35 y n − k = 31."],
[String.raw`\(RSS_R-RSS_{NR}=388{,}017-386{,}5032=1{,}5138\)`,"Pérdida de ajuste."],
[String.raw`\(W=35\cdot\dfrac{1{,}5138}{386{,}5032}=0{,}1371,\quad LR=35\ln(1{,}003917)=35(0{,}003909)=0{,}1368\)`,"Versiones con las RSS."],
[String.raw`\(LM=35\cdot\dfrac{1{,}5138}{388{,}017}=0{,}1365=35(0{,}003901352)=nR^2_{aux}\)`,"La regresión auxiliar del enunciado da el mismo LM."]])};
for(const tl of TALLERES)for(const p of (tl.puntos||[]))if(M[p.id])p.micro=M[p.id];
})();

(function(){const mp=a=>`<ol class="mp">${a.map(([e,w])=>`<li><div class="mp-e">${e}</div>${w?`<div class="por">${w}</div>`:""}</li>`).join("")}</ol>`,h=t=>`<h5>${t}</h5>`;
const M={"d-41":h("Lo que se lee del enunciado")+mp([
[String.raw`\(X'X=\begin{bmatrix}n&\sum X\\\sum X&\sum X^2\end{bmatrix}=\begin{bmatrix}20&10\\10&30\end{bmatrix}\)`,String.raw`En regresión simple, X′X tiene n en la esquina, ΣX fuera de la diagonal y ΣX² abajo: n = 20, ΣX = 10, ΣX² = 30.`],
[String.raw`\(X'\mathbf y=\begin{bmatrix}\sum Y\\\sum XY\end{bmatrix}=\begin{bmatrix}30\\40\end{bmatrix}\)`,String.raw`ΣY = 30 y ΣXY = 40. Y \(\mathbf y'\mathbf y=\sum Y^2=75\).`],
[String.raw`\(y_0=4,\qquad\mathbf x_0'=[1\;\;2],\qquad\mathbf x_0=\begin{bmatrix}1\\2\end{bmatrix}\)`,String.raw`La observación nueva: y₀ es su Y observado; x₀′ es su fila de la matriz X (1 del intercepto y X = 2).`]])+
h("Estimador y RSS")+mp([
[String.raw`\(\det(X'X)=20\cdot30-10\cdot10=600-100=500\)`,String.raw`Determinante 2 × 2: ad − bc.`],
[String.raw`\((X'X)^{-1}=\dfrac1{500}\begin{bmatrix}30&-10\\-10&20\end{bmatrix}\)`,String.raw`Inversa 2 × 2: se intercambian los de la diagonal, se cambia el signo de los de afuera y se divide por el determinante.`],
[String.raw`\(\mathbf b=\dfrac1{500}\begin{bmatrix}30\cdot30+(-10)\cdot40\\-10\cdot30+20\cdot40\end{bmatrix}=\dfrac1{500}\begin{bmatrix}900-400\\-300+800\end{bmatrix}=\dfrac1{500}\begin{bmatrix}500\\500\end{bmatrix}=\begin{bmatrix}1\\1\end{bmatrix}\)`,String.raw`Producto matriz por vector: cada fila de la inversa por la columna X′y.`],
[String.raw`\(\mathbf b'X'\mathbf y=[1\;\;1]\begin{bmatrix}30\\40\end{bmatrix}=30+40=70\)`,String.raw`Fila por columna: da un número. Es \(\mathbf b'X'X\mathbf b\), porque por las ecuaciones normales \(X'X\mathbf b=X'\mathbf y\).`],
[String.raw`\(RSS=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y=75-70=5\)`,String.raw`Se parte de \(RSS=\mathbf e'\mathbf e=(\mathbf y-X\mathbf b)'(\mathbf y-X\mathbf b)\) y se simplifica con las ecuaciones normales.`],
[String.raw`\(s^2=\dfrac{RSS}{n-k}=\dfrac{5}{20-2}=\dfrac5{18}=0{,}2778\)`,String.raw`k = 2 parámetros (intercepto y pendiente).`]])+
h("Pronóstico y su error")+mp([
[String.raw`\(\hat y_0=\mathbf x_0'\mathbf b=[1\;\;2]\begin{bmatrix}1\\1\end{bmatrix}=1\cdot1+2\cdot1=3\)`,String.raw`Fila (1 × 2) por columna (2 × 1) = un número. Es lo mismo que reemplazar X = 2 en \(\hat Y=1+1\cdot X\).`],
[String.raw`\(d=y_0-\hat y_0=4-3=1\)`,String.raw`Error de pronóstico: observado menos pronosticado.`],
[String.raw`\((X'X)^{-1}\mathbf x_0=\dfrac1{500}\begin{bmatrix}30\cdot1+(-10)\cdot2\\-10\cdot1+20\cdot2\end{bmatrix}=\dfrac1{500}\begin{bmatrix}10\\30\end{bmatrix}\)`,String.raw`Primero la matriz por la columna x₀ (2 × 2 por 2 × 1 = 2 × 1).`],
[String.raw`\(\mathbf x_0'(X'X)^{-1}\mathbf x_0=\dfrac1{500}[1\;\;2]\begin{bmatrix}10\\30\end{bmatrix}=\dfrac{10+60}{500}=\dfrac{70}{500}=0{,}14\)`,String.raw`Luego la fila x₀′ por ese resultado (1 × 2 por 2 × 1 = un número). La constante 1/500 sale del producto.`],
[String.raw`\(\operatorname{var}(d)=\sigma^2\left[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0\right]\approx s^2(1+0{,}14)=0{,}2778(1{,}14)=0{,}3167\)`,String.raw`El 1 es la varianza del error nuevo μ₀; el 0,14 es la incertidumbre por estimar b. Se cambia σ² por s².`]])+
h("Estadístico y decisión")+mp([
[String.raw`\(F=\dfrac{d^2}{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}=\dfrac{1^2}{0{,}3167}=3{,}158\)`,String.raw`Con una sola observación nueva (n₂ = 1), d es un número y la F de pronósticos se reduce a d² sobre su varianza estimada.`],
[String.raw`\(t=\sqrt{F}=\sqrt{3{,}158}=1{,}777\)`,String.raw`Con 1 grado de libertad en el numerador, F = t².`],
[String.raw`\(F_{0{,}05}(1,18)=4{,}414>3{,}158\)`,String.raw`Grados de libertad: 1 (una observación nueva) y n − k = 18. No se rechaza la estabilidad de los parámetros.`]])};
for(const tl of TALLERES)for(const p of (tl.puntos||[]))if(M[p.id])p.micro=M[p.id];})();

// ---------- micropasos de Ejercicios propuestos 3
(function(){const mp=a=>`<ol class="mp">${a.map(([e,w])=>`<li><div class="mp-e">${e}</div>${w?`<div class="por">${w}</div>`:""}</li>`).join("")}</ol>`,h=t=>`<h5>${t}</h5>`;
const M={
"ep3-1":h("a) La media de d")+mp([
[String.raw`\(\mathbf d=\mathbf y_2-X_2\mathbf b_1\)`,String.raw`Definición: lo observado en la muestra 2 menos lo que pronostica la muestra 1.`],
[String.raw`\(\mathbf d=(X_2\boldsymbol\beta+\boldsymbol\mu_2)-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\)`,String.raw`Se reemplaza \(\mathbf y_2=X_2\boldsymbol\beta+\boldsymbol\mu_2\) y se saca \(X_2\) como factor común de \(X_2\boldsymbol\beta-X_2\mathbf b_1\).`],
[String.raw`\(\mathbf b_1=(X_1'X_1)^{-1}X_1'(X_1\boldsymbol\beta+\boldsymbol\mu_1)=\boldsymbol\beta+(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\)`,String.raw`Se reemplaza \(\mathbf y_1\); como \((X_1'X_1)^{-1}X_1'X_1=I\), el primer término queda β.`],
[String.raw`\(\mathbf b_1-\boldsymbol\beta=(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\)`,String.raw`Error de muestreo: lo que se aleja b₁ de β depende solo de los errores de la muestra 1.`],
[String.raw`\(\mathbf d=\boldsymbol\mu_2-X_2(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\)`,String.raw`Se sustituye: d queda escrito solo con los dos vectores de errores.`],
[String.raw`\(E(\mathbf d)=E(\boldsymbol\mu_2)-X_2(X_1'X_1)^{-1}X_1'E(\boldsymbol\mu_1)\)`,String.raw`Linealidad de la esperanza. Las matrices X son fijas (no aleatorias), así que salen de la esperanza.`],
[String.raw`\(=\mathbf 0-X_2(X_1'X_1)^{-1}X_1'\mathbf 0=\mathbf 0_{n_2\times1}\)`,String.raw`Supuesto: \(E(\boldsymbol\mu_1)=E(\boldsymbol\mu_2)=\mathbf 0\).`]])+
h("b) La varianza de d")+mp([
[String.raw`\(\operatorname{var}(\mathbf d)=E[(\mathbf d-E\mathbf d)(\mathbf d-E\mathbf d)']=E(\mathbf d\mathbf d')\)`,String.raw`Definición de matriz de varianzas; como E(d) = 0, se resta cero.`],
[String.raw`\(A=X_2(X_1'X_1)^{-1}X_1'\Rightarrow\mathbf d=\boldsymbol\mu_2-A\boldsymbol\mu_1\)`,String.raw`Se le da nombre a la matriz que multiplica a μ₁ para escribir menos.`],
[String.raw`\(\mathbf d'=\boldsymbol\mu_2'-\boldsymbol\mu_1'A'\)`,String.raw`Transpuesta de una resta y de un producto: \((A\boldsymbol\mu_1)'=\boldsymbol\mu_1'A'\).`],
[String.raw`\(A'=X_1\left[(X_1'X_1)^{-1}\right]'X_2'=X_1(X_1'X_1)^{-1}X_2'\)`,String.raw`\((ABC)'=C'B'A'\), y la inversa de una matriz simétrica es simétrica.`],
[String.raw`\(\mathbf d\mathbf d'=\boldsymbol\mu_2\boldsymbol\mu_2'-\boldsymbol\mu_2\boldsymbol\mu_1'A'-A\boldsymbol\mu_1\boldsymbol\mu_2'+A\boldsymbol\mu_1\boldsymbol\mu_1'A'\)`,String.raw`Se multiplica término a término (como un binomio), respetando el orden porque son matrices.`],
[String.raw`\(E(\boldsymbol\mu_2\boldsymbol\mu_1')=E(\boldsymbol\mu_1\boldsymbol\mu_2')=0\)`,String.raw`Los errores de las dos muestras no están correlacionados: los términos cruzados desaparecen.`],
[String.raw`\(E(\boldsymbol\mu_2\boldsymbol\mu_2')=\sigma^2I_{n_2},\qquad E(\boldsymbol\mu_1\boldsymbol\mu_1')=\sigma^2I_{n_1}\)`,String.raw`Supuesto de varianza constante y sin autocorrelación.`],
[String.raw`\(\operatorname{var}(\mathbf d)=\sigma^2I_{n_2}+A(\sigma^2I)A'=\sigma^2I_{n_2}+\sigma^2AA'\)`,String.raw`σ² es un escalar y sale; \(AIA'=AA'\).`],
[String.raw`\(AA'=X_2(X_1'X_1)^{-1}X_1'X_1(X_1'X_1)^{-1}X_2'=X_2(X_1'X_1)^{-1}X_2'\)`,String.raw`En el medio aparece \(X_1'X_1(X_1'X_1)^{-1}=I\).`],
[String.raw`\(\operatorname{var}(\mathbf d)=\sigma^2\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]\)`,String.raw`Factor común σ².`]]),

"ep3-2":mp([
[String.raw`\(D=0:\ \hat Y=186{,}47-126(0)+0{,}23X-0{,}13(0)X=186{,}47+0{,}23X\)`,String.raw`Ecuación de los hombres: se reemplaza D por 0 y desaparecen los términos con D.`],
[String.raw`\(D=1:\ \hat Y=(186{,}47-126)+(0{,}23-0{,}13)X=60{,}47+0{,}10X\)`,String.raw`Ecuación de las mujeres: con D = 1 se agrupan los términos sin X (intercepto) y los que multiplican a X (pendiente).`],
[String.raw`\(\hat Y_M-\hat Y_H=(60{,}47+0{,}10X)-(186{,}47+0{,}23X)=-126-0{,}13X\)`,String.raw`Resta de las dos ecuaciones con la misma renta X: es δ₁ + δ₂X.`],
[String.raw`\(X=100:\ -126-0{,}13(100)=-139\)`,String.raw`Ejemplo numérico: la brecha depende de X porque las pendientes son distintas.`],
[String.raw`\(gl=n-k=34-4=30,\qquad t_{0{,}025}(30)=2{,}042\)`,String.raw`Cuatro parámetros: β₁, δ₁, β₂ y δ₂.`],
[String.raw`\(t_{\delta_2}=\dfrac{\hat\delta_2-0}{ee(\hat\delta_2)}=\dfrac{-0{,}13}{0{,}10}=-1{,}30\)`,String.raw`Prueba t (59): coeficiente menos el valor de H₀, dividido por su error estándar.`],
[String.raw`\(|-1{,}30|=1{,}30<2{,}042\Rightarrow\text{no se rechaza }\delta_2=0\)`,String.raw`Se compara el valor absoluto con el crítico de dos colas.`],
[String.raw`\(t_{\delta_1}=\dfrac{-126}{57{,}01}=-2{,}21,\qquad|-2{,}21|>2{,}042\)`,String.raw`Se rechaza δ₁ = 0: el consumo autónomo sí difiere.`]]),

"ep3-3":h("b) Estimación por zona")+mp([
[String.raw`\(X'X=\begin{bmatrix}X_U'X_U&0\\0&X_R'X_R\end{bmatrix}\)`,String.raw`Las columnas urbanas valen 0 en las filas rurales y viceversa, así que los productos cruzados son cero: el modelo equivale a dos regresiones simples separadas.`],
[String.raw`\(\hat\beta_2=\dfrac{n\sum xy-\sum x\sum y}{n\sum x^2-(\sum x)^2}=\dfrac{4(704)-42(66)}{4(458)-42^2}=\dfrac{2816-2772}{1832-1764}=\dfrac{44}{68}\)`,String.raw`Fórmula de la pendiente con los 4 jóvenes urbanos.`],
[String.raw`\(\hat\beta_1=\bar y_U-\hat\beta_2\bar x_U=16{,}5-0{,}6471(10{,}5)=16{,}5-6{,}7941=9{,}7059\)`,String.raw`La recta pasa por el punto de medias.`],
[String.raw`\(\hat\beta_4=\dfrac{4(320)-26(47)}{4(194)-26^2}=\dfrac{1280-1222}{776-676}=\dfrac{58}{100}=0{,}58\)`,String.raw`Igual con los 4 rurales.`],
[String.raw`\(\hat\beta_3=11{,}75-0{,}58(6{,}5)=11{,}75-3{,}77=7{,}98\)`,String.raw`Punto de medias rural.`]])+
h("RSS, R² y errores estándar")+mp([
[String.raw`\(RSS=S_{YY}-\hat\beta^2S_{XX}\)`,String.raw`Variación total de Y menos la explicada por la recta (ESS = b²·S_XX).`],
[String.raw`\(RSS_U=11-0{,}6471^2(17)=11-0{,}41875(17)=11-7{,}1176=3{,}8824\)`,String.raw`\(S_{YY}=1100-4(16{,}5)^2=11\) y \(S_{XX}=458-4(10{,}5)^2=17\).`],
[String.raw`\(RSS_R=8{,}75-0{,}58^2(25)=8{,}75-8{,}41=0{,}34\)`,String.raw`\(S_{YY}=561-4(11{,}75)^2=8{,}75\) y \(S_{XX}=194-4(6{,}5)^2=25\).`],
[String.raw`\(RSS_{NR}=3{,}8824+0{,}34=4{,}2222,\qquad s^2=\dfrac{4{,}2222}{8-4}=1{,}0556\)`,String.raw`Un solo modelo con k = 4 parámetros: se suman las RSS y se divide por n − k.`],
[String.raw`\(R^2=1-\dfrac{RSS}{TSS}=1-\dfrac{4{,}2222}{64{,}875}=1-0{,}0651=0{,}935\)`,String.raw`TSS con los 8 datos: \(1661-8(14{,}125)^2=64{,}875\).`],
[String.raw`\(\begin{bmatrix}4&42\\42&458\end{bmatrix}^{-1}=\dfrac{1}{4(458)-42^2}\begin{bmatrix}458&-42\\-42&4\end{bmatrix}=\dfrac1{68}\begin{bmatrix}458&-42\\-42&4\end{bmatrix}\)`,String.raw`Inversa 2 × 2 del bloque urbano.`],
[String.raw`\(ee(\hat\beta_2)=\sqrt{1{,}0556\cdot\dfrac4{68}}=\sqrt{0{,}0621}=0{,}249\)`,String.raw`Raíz de s² por el elemento de la diagonal.`]])+
h("c) Chow y d) pronóstico")+mp([
[String.raw`\(\hat\beta=\dfrac{8(1024)-68(113)}{8(652)-68^2}=\dfrac{8192-7684}{5216-4624}=\dfrac{508}{592}=0{,}8581\)`,String.raw`Recta común (restringida) con los 8 datos.`],
[String.raw`\(RSS_R=64{,}875-0{,}8581^2(74)=64{,}875-54{,}490=10{,}3851\)`,String.raw`\(S_{XX}=652-8(8{,}5)^2=74\).`],
[String.raw`\(F=\dfrac{(10{,}3851-4{,}2222)/2}{4{,}2222/4}=\dfrac{3{,}0815}{1{,}0556}=2{,}919\)`,String.raw`F (64): q = 2 (dos interceptos iguales y dos pendientes iguales) y n − k = 4.`],
[String.raw`\(\hat y_0=9{,}7059+0{,}6471(10{,}5)=16{,}5\)`,String.raw`Se usa la ecuación urbana con X = 10,5.`],
[String.raw`\(\mathbf x_0'(X'X)^{-1}\mathbf x_0=\dfrac1n+\dfrac{(x_0-\bar x)^2}{S_{XX}}=\dfrac14+\dfrac{(10{,}5-10{,}5)^2}{17}=\dfrac14\)`,String.raw`Fórmula de la regresión simple; como 10,5 es la media urbana, el segundo término es cero.`],
[String.raw`\(ee_{media}=\sqrt{1{,}0556/4}=0{,}5137,\qquad ee_{ind}=\sqrt{1{,}0556(1+1/4)}=1{,}1487\)`,String.raw`El individual suma el 1 de la varianza del error nuevo.`],
[String.raw`\(16{,}5\pm2{,}776(0{,}5137)=16{,}5\pm1{,}426\)`,String.raw`Intervalo para la media: [15,07; 17,93]. Con 1,1487 sale el individual: [13,31; 19,69].`]]),

"ep3-4":h("a) Demostración")+mp([
[String.raw`\(X=[\mathbf 1\;\;D]\Rightarrow X'X=\begin{bmatrix}\sum1&\sum D\\\sum D&\sum D^2\end{bmatrix}=\begin{bmatrix}n&n_L\\n_L&n_L\end{bmatrix}\)`,String.raw`ΣD cuenta los licenciados (D = 1), y D² = D porque D solo vale 0 o 1.`],
[String.raw`\(X'\mathbf y=\begin{bmatrix}\sum W\\\sum DW\end{bmatrix}=\begin{bmatrix}n_L\bar W_L+n_A\bar W_A\\n_L\bar W_L\end{bmatrix}\)`,String.raw`ΣDW solo suma los salarios de los licenciados; y la suma de un grupo es su tamaño por su media.`],
[String.raw`\(n_L\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L\Rightarrow\hat\beta_1+\hat\beta_2=\bar W_L\)`,String.raw`Segunda ecuación normal; se divide por n_L.`],
[String.raw`\(n\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L+n_A\bar W_A\)`,String.raw`Primera ecuación normal.`],
[String.raw`\((n_A+n_L)\hat\beta_1+n_L\hat\beta_2=n_A\hat\beta_1+n_L(\hat\beta_1+\hat\beta_2)\)`,String.raw`Se escribe n = n_A + n_L y se agrupan los términos con n_L.`],
[String.raw`\(n_A\hat\beta_1+n_L\bar W_L=n_L\bar W_L+n_A\bar W_A\Rightarrow\hat\beta_1=\bar W_A\)`,String.raw`Se usa el paso anterior, se cancela \(n_L\bar W_L\) y se divide por n_A.`]])+
h("b) a e) Estimación, errores estándar y R²")+mp([
[String.raw`\(\hat\beta_1=150,\quad\hat\beta_2=\bar W_L-\bar W_A=250-150=100\)`,String.raw`Resultado de a).`],
[String.raw`\(RSS=\sum_L(W-\bar W_L)^2+\sum_A(W-\bar W_A)^2\)`,String.raw`Los valores ajustados son las medias de cada grupo, así que los errores son las desviaciones respecto a esa media.`],
[String.raw`\(\sum_L(W-\bar W_L)^2=(n_L-1)s_L^2=299(2500)=747.500\)`,String.raw`Definición de varianza muestral: \(s^2=\sum(W-\bar W)^2/(n-1)\).`],
[String.raw`\(RSS=747.500+199(900)=747.500+179.100=926.600,\quad s^2=\dfrac{926.600}{498}=1.860{,}64\)`,String.raw`n − k = 500 − 2.`],
[String.raw`\(\det(X'X)=n\,n_L-n_L^2=n_L(n-n_L)=n_Ln_A=300(200)=60.000\)`,String.raw`Factor común n_L.`],
[String.raw`\([(X'X)^{-1}]_{11}=\dfrac{n_L}{n_Ln_A}=\dfrac1{n_A},\quad[(X'X)^{-1}]_{22}=\dfrac{n}{n_Ln_A}=\dfrac1{n_L}+\dfrac1{n_A}\)`,String.raw`Inversa 2 × 2; \(\frac{n_L+n_A}{n_Ln_A}=\frac1{n_A}+\frac1{n_L}\).`],
[String.raw`\(ee(\hat\beta_2)=\sqrt{1.860{,}64\left(\tfrac1{300}+\tfrac1{200}\right)}=\sqrt{1.860{,}64(0{,}008333)}=\sqrt{15{,}505}=3{,}938\)`,String.raw`Raíz de s² por el elemento de la diagonal.`],
[String.raw`\(ESS=300(250-210)^2+200(150-210)^2=300(1600)+200(3600)=1.200.000\)`,String.raw`Cada persona aporta (media de su grupo − media general)².`],
[String.raw`\(R^2=\dfrac{1.200.000}{1.200.000+926.600}=0{,}564,\qquad t=\dfrac{100}{3{,}938}=25{,}40\)`,String.raw`TSS = ESS + RSS; y la t de β₂ = 0.`]]),

"ep3-5":mp([
[String.raw`\(\hat\beta_2=\dfrac{9(377{,}25)-117(24{,}06)}{9(2491)-117^2}=\dfrac{3395{,}25-2815{,}02}{22419-13689}=\dfrac{580{,}23}{8730}=0{,}06646\)`,String.raw`Pendiente de los hombres (n = 9).`],
[String.raw`\(\hat\beta_1=\dfrac{24{,}06}{9}-0{,}06646\cdot\dfrac{117}9=2{,}6733-0{,}06646(13)=1{,}8093\)`,String.raw`Punto de medias.`],
[String.raw`\(\hat\beta_2'=\dfrac{8(425{,}25)-130(23{,}96)}{8(2574)-130^2}=\dfrac{3402-3114{,}8}{20592-16900}=\dfrac{287{,}2}{3692}=0{,}07779\)`,String.raw`Pendiente de las mujeres (n = 8).`],
[String.raw`\(\hat\beta_1'=2{,}995-0{,}07779(16{,}25)=1{,}7309\)`,String.raw`\(\bar w=23{,}96/8\), \(\bar x=130/8\).`],
[String.raw`\(RSS_{NR}=RSS_H+RSS_M=0{,}80627+0{,}32615=1{,}13242\)`,String.raw`El modelo con D₁, D₂ y sus interacciones equivale a dos regresiones separadas.`],
[String.raw`\(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}=\dfrac{(1{,}20866-1{,}13242)/2}{1{,}13242/13}\)`,String.raw`F (64): q = 2 (interceptos iguales y pendientes iguales), n − k = 17 − 4 = 13.`],
[String.raw`\(=\dfrac{0{,}03812}{0{,}08711}=0{,}438<F_{0{,}05}(2,13)=3{,}806\)`,String.raw`No se rechaza: una sola ecuación sirve para los dos géneros.`]]),

"ep3-6":mp([
[String.raw`\(R^2=1-\dfrac{RSS}{TSS}\Rightarrow RSS=(1-R^2)\,TSS\)`,String.raw`Se despeja la RSS de la definición de R².`],
[String.raw`\(RSS_R=(1-0{,}9974)(6.403.270)=0{,}0026(6.403.270)=16.648{,}50\)`,String.raw`La regresión de todo el periodo es la restringida (los mismos parámetros siempre).`],
[String.raw`\(RSS_{NR}=2.379{,}315+3.679{,}020+1.295{,}861=7.354{,}196\)`,String.raw`El no restringido son tres regresiones separadas: se suman sus RSS.`],
[String.raw`\(q=(m-1)k=(3-1)(2)=4\)`,String.raw`Igualar tres juegos de 2 parámetros son 4 igualdades.`],
[String.raw`\(n-mk=27-3(2)=21\)`,String.raw`El no restringido estima 6 parámetros con 27 años (1964-1990).`],
[String.raw`\(F=\dfrac{(16.648{,}50-7.354{,}20)/4}{7.354{,}20/21}=\dfrac{9.294{,}30/4}{350{,}20}=\dfrac{2.323{,}58}{350{,}20}=6{,}635\)`,String.raw`F (64).`],
[String.raw`\(6{,}635>F_{0{,}05}(4,21)=2{,}840\)`,String.raw`Se rechaza la estabilidad de los parámetros.`]]),

"ep3-7":h("a) Sin intercepto")+mp([
[String.raw`\(E_1E_2=E_1E_3=E_2E_3=0\)`,String.raw`Una persona está en una sola clase: el producto de dos dummies distintas siempre es cero.`],
[String.raw`\(X'X=\begin{bmatrix}\sum E_1^2&0&0\\0&\sum E_2^2&0\\0&0&\sum E_3^2\end{bmatrix}=\operatorname{diag}(n_1,n_2,n_3)\)`,String.raw`\(E_j^2=E_j\) y su suma cuenta las personas de la clase j.`],
[String.raw`\((X'X)^{-1}=\operatorname{diag}(1/n_1,1/n_2,1/n_3)\)`,String.raw`La inversa de una diagonal invierte cada elemento.`],
[String.raw`\(\hat\delta_j=\dfrac{\sum_jY}{n_j}=\bar Y_j\)`,String.raw`Cada suma de la clase j dividida por su tamaño.`]])+
h("b) Con intercepto")+mp([
[String.raw`\(\mathbf 1=E_1+E_2+E_3\Rightarrow E_1=\mathbf 1-E_2-E_3\)`,String.raw`Toda persona está en alguna clase.`],
[String.raw`\(\delta_1E_1+\delta_2E_2+\delta_3E_3=\delta_1+(\delta_2-\delta_1)E_2+(\delta_3-\delta_1)E_3\)`,String.raw`Se reemplaza E₁ y se agrupan los términos con E₂ y con E₃.`],
[String.raw`\(\beta_1=\delta_1,\quad\beta_2=\delta_2-\delta_1,\quad\beta_3=\delta_3-\delta_1\)`,String.raw`Se comparan los coeficientes de los dos modelos: es el mismo modelo con otra parametrización.`],
[String.raw`\(\hat\beta_1=\bar Y_1,\quad\hat\beta_2=\bar Y_2-\bar Y_1,\quad\hat\beta_3=\bar Y_3-\bar Y_1\)`,String.raw`Se reemplaza \(\hat\delta_j=\bar Y_j\) de a).`]])+
h("c) Con género")+mp([
[String.raw`\(X'X\text{: } n=10,\ \sum E_2=3,\ \sum E_3=2,\ \sum S_1=6,\ \sum E_2S_1=2,\ \sum E_3S_1=1\)`,String.raw`Cada elemento de X′X cuenta personas: por ejemplo, ΣE₂S₁ son las mujeres con educación media (2).`],
[String.raw`\(X'\mathbf y=\left(\sum Y,\ \sum_{E_2}Y,\ \sum_{E_3}Y,\ \sum_{S_1}Y\right)'=(117,\ 36,\ 40,\ 76)'\)`,String.raw`117 = total; 36 = 12 + 14 + 10; 40 = 20 + 20; 76 = horas de las 6 mujeres.`],
[String.raw`\(\mathbf b=(X'X)^{-1}X'\mathbf y=(6{,}324;\;3{,}592;\;12{,}113;\;3{,}127)\)`,String.raw`La inversa 4 × 4 se calcula con R o con la Calculadora de matrices.`],
[String.raw`\(\hat Y_{H,sup}=6{,}324,\quad\hat Y_{H,media}=6{,}324+3{,}592=9{,}916,\quad\hat Y_{H,inc}=6{,}324+12{,}113=18{,}437\)`,String.raw`Hombres (S₁ = 0): intercepto más el coeficiente de su clase.`],
[String.raw`\(\hat Y_{M}=\hat Y_H+3{,}127\Rightarrow 9{,}451;\ 13{,}043;\ 21{,}564\)`,String.raw`Mujeres: se suma 3,127 en cada clase, porque el modelo no tiene interacciones.`]]),

"ep3-8":mp([
[String.raw`\(\text{Guerra: }\hat\beta_2=\dfrac{5(140)-35(15)}{5(325)-35^2}=\dfrac{175}{400}=0{,}4375,\quad\hat\beta_1=3-0{,}4375(7)=-0{,}0625\)`,String.raw`Pendiente y punto de medias con n₁ = 5.`],
[String.raw`\(RSS_1=(61-5\cdot3^2)-0{,}4375^2(325-5\cdot7^2)=16-15{,}3125=0{,}6875\)`,String.raw`RSS = S_YY − b²S_XX.`],
[String.raw`\(\text{Paz: }\hat\beta_2=\dfrac{1680}{3300}=0{,}5091,\quad RSS_2=88-0{,}5091^2(330)=2{,}4727\)`,String.raw`Igual con n₂ = 10: S_YY = 448 − 360, S_XX = 1540 − 1210.`],
[String.raw`\(RSS_{NR}=0{,}6875+2{,}4727=3{,}1602\)`,String.raw`Dos regresiones separadas equivalen al modelo con D y DX.`],
[String.raw`\(\text{Restringido: }\hat\beta_2=\dfrac{15(968)-145(75)}{15(1865)-145^2}=\dfrac{3645}{6950}=0{,}5245\)`,String.raw`Una sola recta con los 15 años.`],
[String.raw`\(RSS_R=(509-15\cdot5^2)-0{,}5245^2\left(1865-\dfrac{145^2}{15}\right)=134-0{,}2751(463{,}33)=6{,}5561\)`,String.raw`S_YY = 134 y S_XX = 463,33.`],
[String.raw`\(\hat\delta_1=0{,}4-(-0{,}0625)=0{,}4625,\quad\hat\delta_2=0{,}5091-0{,}4375=0{,}0716\)`,String.raw`En el modelo con dummies, δ es paz menos guerra.`],
[String.raw`\(F=\dfrac{(6{,}5561-3{,}1602)/2}{3{,}1602/11}=\dfrac{1{,}6980}{0{,}2873}=5{,}910>3{,}982\)`,String.raw`F (64) con q = 2 y n − k = 15 − 4 = 11: se rechaza H₀.`]]),

"ep3-9":mp([
[String.raw`\(Y_t=\beta_1\cdot1+\delta_1\cdot D_t+\beta_2\cdot X_{2t}+\delta_2\cdot D_tX_{2t}+\cdots\)`,String.raw`Cada parámetro multiplica una variable: esas variables son las columnas de X, en el mismo orden que los parámetros.`],
[String.raw`\(t\le n_1:\ (1,\,0,\,X_{2t},\,0,\dots,X_{kt},\,0)\)`,String.raw`En el primer periodo D = 0, así que las columnas con D quedan en cero.`],
[String.raw`\(t>n_1:\ (1,\,1,\,X_{2t},\,X_{2t},\dots,X_{kt},\,X_{kt})\)`,String.raw`En el segundo periodo D = 1: la columna D es de unos y cada D·X repite la X.`],
[String.raw`\(\dim X=n\times2k,\qquad\dim\boldsymbol\beta=2k\times1\)`,String.raw`k parámetros β y k parámetros δ.`],
[String.raw`\(R\boldsymbol\beta=(\delta_1,\dots,\delta_k)'\)`,String.raw`Cada fila de R tiene un solo 1, en la posición de un δ (las posiciones pares 2, 4, …, 2k), y ceros en el resto.`],
[String.raw`\(\dim R=k\times2k,\qquad\mathbf r=\mathbf 0_{k\times1}\)`,String.raw`Una fila por restricción (q = k) y una columna por parámetro.`]]),

"ep3-10":mp([
[String.raw`\(Y_t=\beta_1\cdot1+\delta_1\cdot D_t+\beta_2X_{2t}+\cdots+\beta_kX_{kt}\)`,String.raw`Solo el intercepto cambia: la única dummy es D sola, sin interacciones.`],
[String.raw`\(\dim\boldsymbol\beta=(k+1)\times1\)`,String.raw`Los k parámetros originales más δ₁.`],
[String.raw`\(R=[0\;\;1\;\;0\cdots0],\quad R\boldsymbol\beta=\delta_1\)`,String.raw`Un 1 en la segunda posición, la de δ₁.`],
[String.raw`\(F=t_{\delta_1}^2=\left(\dfrac{\hat\delta_1}{ee(\hat\delta_1)}\right)^2\)`,String.raw`Con una sola restricción, la F es el cuadrado de la t; gl = (1, n − k − 1).`]]),

"ep3-11":mp([
[String.raw`\(Y_t=\beta_1+\beta_2X_{2t}+\delta_2D_tX_{2t}+\cdots+\beta_kX_{kt}+\delta_kD_tX_{kt}\)`,String.raw`Intercepto común: no hay D sola, solo las interacciones con las pendientes.`],
[String.raw`\(\dim\boldsymbol\beta=(2k-1)\times1\)`,String.raw`k parámetros β y k − 1 parámetros δ (uno por pendiente).`],
[String.raw`\(\dim R=(k-1)\times(2k-1),\quad\mathbf r=\mathbf 0\)`,String.raw`Una restricción por cada δ.`],
[String.raw`\(k=2:\ \boldsymbol\beta=(\beta_1,\beta_2,\delta_2)',\ R=[0\;\;0\;\;1]\)`,String.raw`En el modelo simple, solo se prueba δ₂ = 0.`],
[String.raw`\(gl=(k-1,\;n-(2k-1))=(k-1,\;n-2k+1)\)`,String.raw`Numerador: restricciones; denominador: n menos los parámetros del no restringido.`]]),

"ep3-12":mp([
[String.raw`\(t=\dfrac{0{,}94}{0{,}11}=8{,}5;\quad\dfrac{0{,}31}{0{,}23}=1{,}35;\quad\dfrac{-0{,}26}{0{,}29}=-0{,}90;\quad\dfrac{0{,}44}{0{,}07}=6{,}3\)`,String.raw`Cada t es el coeficiente sobre su error estándar.`],
[String.raw`\(\dfrac1{0{,}94}=1{,}06\)`,String.raw`Si el costo crece menos que la producción, hay rendimientos crecientes a escala.`],
[String.raw`\(\beta_5=1-\beta_3-\beta_4\Rightarrow\ln\dfrac{Y}{P_3}=\ln A+\beta_2\ln X+\beta_3\ln\dfrac{P_1}{P_3}+\beta_4\ln\dfrac{P_2}{P_3}\)`,String.raw`Se reemplaza la restricción, se pasa ln P₃ a la izquierda y se usa ln a − ln b = ln(a/b).`],
[String.raw`\(\hat\beta_5=1-0{,}51-0{,}09=0{,}40\)`,String.raw`La elasticidad del combustible sale de la restricción.`],
[String.raw`\(W=29\cdot\dfrac{0{,}028}{0{,}336}=2{,}417;\quad LR=29\ln\dfrac{0{,}364}{0{,}336}=2{,}321;\quad LM=29\cdot\dfrac{0{,}028}{0{,}364}=2{,}231\)`,String.raw`Las tres con las RSS; RSS_R − RSS_NR = 0,364 − 0,336 = 0,028.`],
[String.raw`\(F=\dfrac{0{,}028/1}{0{,}336/24}=\dfrac{0{,}028}{0{,}014}=2{,}00<4{,}26\)`,String.raw`F exacta con n − k = 29 − 5 = 24.`]]),

"ep3-13":mp([
[String.raw`\(D_t=1\text{ si }t\ge2020,\quad D_t=0\text{ si }t<2020\)`,String.raw`La dummy marca los años desde la reforma.`],
[String.raw`\(D=0:\ E(Y_t)=\beta_1+\beta_2X_t\)`,String.raw`Antes de la reforma el término δD desaparece.`],
[String.raw`\(D=1:\ E(Y_t)=(\beta_1+\delta)+\beta_2X_t\)`,String.raw`Después, δ se suma al intercepto; la pendiente no cambia.`],
[String.raw`\(E(Y\mid X,D=1)-E(Y\mid X,D=0)=\delta\)`,String.raw`Con la misma experiencia, δ es la diferencia de salario esperado.`],
[String.raw`\(t=\hat\delta/ee(\hat\delta)\sim t(n-3)\)`,String.raw`Tres parámetros: β₁, δ y β₂.`]]),

"ep3-14":mp([
[String.raw`\(D=0:\ E(Y)=\beta_1+\beta_2X\)`,String.raw`Antes del evento.`],
[String.raw`\(D=1:\ E(Y)=\beta_1+\delta_1+\beta_2X+\delta_2X=(\beta_1+\delta_1)+(\beta_2+\delta_2)X\)`,String.raw`Después: se agrupan los términos sin X y los que multiplican a X.`],
[String.raw`\(\delta_1=\text{cambio del intercepto},\quad\delta_2=\text{cambio de la pendiente}\)`,String.raw`Se comparan las dos ecuaciones.`],
[String.raw`\(H_0:\delta_1=\delta_2=0\Rightarrow F\text{ con }q=2\)`,String.raw`Es la prueba de Chow escrita con dummies.`]]),

"ep3-15":mp([
[String.raw`\(D=0:\ \hat Y=2+0{,}5X\)`,String.raw`Antes de la reforma.`],
[String.raw`\(D=1:\ \hat Y=2+0{,}5X+2{,}5-0{,}25X=(2+2{,}5)+(0{,}5-0{,}25)X=4{,}5+0{,}25X\)`,String.raw`Se agrupan los términos sin X y con X.`],
[String.raw`\(\dfrac{0{,}25}{0{,}5}=\dfrac12\)`,String.raw`La propensión marginal se reduce a la mitad.`],
[String.raw`\(2+0{,}5X=4{,}5+0{,}25X\Rightarrow0{,}25X=2{,}5\Rightarrow X=10\)`,String.raw`Punto de corte: se igualan las dos rectas y se despeja X.`],
[String.raw`\(X=5:\ \text{antes }2+0{,}5(5)=4{,}5;\ \text{después }4{,}5+0{,}25(5)=5{,}75\)`,String.raw`Comprobación con una renta menor que 10: antes 2 + 0,5(5) = 4,5 y después 4,5 + 0,25(5) = 5,75, así que el consumo es mayor después.`]]),

"ep3-16":mp([
[String.raw`\(S_{1t}+S_{2t}+S_{3t}+S_{4t}=1\)`,String.raw`Cada trimestre pertenece a una sola estación.`],
[String.raw`\(\text{con intercepto: columna }\mathbf 1=S_1+S_2+S_3+S_4\Rightarrow\det(X'X)=0\)`,String.raw`Colinealidad perfecta: X′X no tiene inversa (trampa de las dicótomas).`],
[String.raw`\(\hat\delta_j=\bar Y_j\)`,String.raw`Igual que en el ejercicio 7 a): X′X es diagonal con el número de trimestres de cada tipo.`],
[String.raw`\(\delta_1S_1+\cdots+\delta_4S_4=\delta_1+(\delta_2-\delta_1)S_2+(\delta_3-\delta_1)S_3+(\delta_4-\delta_1)S_4\)`,String.raw`Se reemplaza S₁ = 1 − S₂ − S₃ − S₄: de ahí β₁ = δ₁ y θⱼ = δⱼ − δ₁.`],
[String.raw`\(S_1X+S_2X+S_3X+S_4X=(S_1+S_2+S_3+S_4)X=X\)`,String.raw`En (3), X es la suma de las cuatro interacciones: incluirla también sería colinealidad perfecta.`]])};
for(const tl of TALLERES)for(const p of (tl.puntos||[]))if(M[p.id])p.micro=M[p.id];})();

// ---------- micropasos de Dinardo 4 (4.2 a 4.10) y de la Asesoría del parcial 1
(function(){const mp=a=>`<ol class="mp">${a.map(([e,w])=>`<li><div class="mp-e">${e}</div>${w?`<div class="por">${w}</div>`:""}</li>`).join("")}</ol>`,h=t=>`<h5>${t}</h5>`;
const M={
"d-42":h("Estacionalidad")+mp([
[String.raw`\(TSS=ESS+RSS=109{,}6+18{,}48=128{,}08\)`,String.raw`Descomposición de la variación total. La TSS no cambia al agregar regresoras, porque solo depende de Y.`],
[String.raw`\(RSS_{NR}=TSS-ESS_{NR}=128{,}08-114{,}8=13{,}28\)`,String.raw`El modelo con las tres dummies es el no restringido.`],
[String.raw`\(n=19\text{ años}\times4=76,\qquad k_{NR}=4+3=7\)`,String.raw`1958 a 1976 son 19 años de 4 trimestres; los 4 parámetros originales más 3 dummies.`],
[String.raw`\(F=\dfrac{(18{,}48-13{,}28)/3}{13{,}28/69}=\dfrac{5{,}20/3}{0{,}19246}=\dfrac{1{,}7333}{0{,}1925}=9{,}01\)`,String.raw`F (64) con q = 3 (las tres dummies valen cero) y n − k = 69.`]])+
h("Estabilidad entre subperiodos")+mp([
[String.raw`\(RSS_{NR}=RSS_1+RSS_2=9{,}32+7{,}46=16{,}78\)`,String.raw`Dos regresiones separadas: se suman las RSS.`],
[String.raw`\(n-2k=76-8=68,\qquad q=k=4\)`,String.raw`El no restringido estima 4 parámetros en cada subperiodo.`],
[String.raw`\(F=\dfrac{(18{,}48-16{,}78)/4}{16{,}78/68}=\dfrac{0{,}425}{0{,}2468}=1{,}72<2{,}51\)`,String.raw`No se rechaza la estabilidad.`]]),

"d-43":mp([
[String.raw`\(S_1=1:\ 70-1{,}5=68{,}5;\quad S_2=1:\ 70+3{,}6=73{,}6;\quad S_3=1:\ 70+4{,}7=74{,}7;\quad\text{T4}:\ 70\)`,String.raw`Intercepto de cada trimestre: el general más la dummy de ese trimestre. El cuarto es la base (todas las dummies en 0).`],
[String.raw`\(\hat Q_1=68{,}5-0{,}01(110)+0{,}2(100)=68{,}5-1{,}1+20=87{,}40\)`,String.raw`Se reemplazan P y Y del trimestre 1.`],
[String.raw`\(\hat Q_2=73{,}6-0{,}01(116)+0{,}2(102)=73{,}6-1{,}16+20{,}4=92{,}84\)`,String.raw`Trimestre 2.`],
[String.raw`\(\hat Q_3=74{,}7-1{,}22+20{,}8=94{,}28,\qquad\hat Q_4=70-1{,}14+20{,}6=89{,}46\)`,String.raw`Trimestres 3 y 4.`],
[String.raw`\(\text{base T1}:\ 73{,}6-68{,}5=5{,}1;\ 74{,}7-68{,}5=6{,}2;\ 70-68{,}5=1{,}5\)`,String.raw`Con S₂, S₃, S₄, el intercepto es el del trimestre 1 y cada coeficiente es la diferencia con él.`],
[String.raw`\(\text{sin intercepto}:\ \text{coeficiente de }S_j=\text{intercepto del trimestre }j\)`,String.raw`Con las cuatro dummies y sin constante, cada una lleva el intercepto completo de su trimestre.`]]),

"d-44":mp([
[String.raw`\(X=[\mathbf 1\;\;E_2\;\;E_3]\Rightarrow X'X=\begin{bmatrix}n&n_2&n_3\\n_2&n_2&0\\n_3&0&n_3\end{bmatrix}\)`,String.raw`Cada elemento cuenta personas; \(E_2E_3=0\) porque nadie está en dos clases.`],
[String.raw`\(X'\mathbf y=\left(\sum Y,\ \sum_2Y,\ \sum_3Y\right)'=(n_1\bar Y_1+n_2\bar Y_2+n_3\bar Y_3,\ n_2\bar Y_2,\ n_3\bar Y_3)'\)`,String.raw`La suma de cada grupo es su tamaño por su media.`],
[String.raw`\(n_2\hat\alpha_1+n_2\hat\gamma_2=n_2\bar Y_2\Rightarrow\hat\alpha_1+\hat\gamma_2=\bar Y_2\)`,String.raw`Segunda ecuación normal, dividida por n₂.`],
[String.raw`\(\hat\alpha_1+\hat\gamma_3=\bar Y_3\)`,String.raw`Tercera ecuación normal, dividida por n₃.`],
[String.raw`\(n\hat\alpha_1+n_2(\bar Y_2-\hat\alpha_1)+n_3(\bar Y_3-\hat\alpha_1)=n_1\bar Y_1+n_2\bar Y_2+n_3\bar Y_3\)`,String.raw`Primera ecuación con \(\hat\gamma_j=\bar Y_j-\hat\alpha_1\).`],
[String.raw`\((n-n_2-n_3)\hat\alpha_1=n_1\bar Y_1\Rightarrow n_1\hat\alpha_1=n_1\bar Y_1\Rightarrow\hat\alpha_1=\bar Y_1\)`,String.raw`Se cancelan \(n_2\bar Y_2\) y \(n_3\bar Y_3\) en los dos lados; n − n₂ − n₃ = n₁.`]]),

"d-45":mp([
[String.raw`\(E_1+E_2+E_3=1\)`,String.raw`Por eso la primera especificación va sin constante: con las tres clases y un intercepto habría colinealidad perfecta.`],
[String.raw`\(\hat Y(E_j,S_2=0)=\hat\alpha_j,\qquad\hat Y(E_j,S_2=1)=\hat\alpha_j+\hat\beta_2\)`,String.raw`Media estimada de cada celda: se reemplazan las dummies por 0 o 1.`],
[String.raw`\(\mu+\alpha_1E_1+\alpha_2E_2=\alpha_3+(\alpha_1-\alpha_3)E_1+(\alpha_2-\alpha_3)E_2\)`,String.raw`Segunda especificación: la clase 3 es la base, así que el intercepto es α₃ y los demás son diferencias.`],
[String.raw`\(\text{misma brecha }\hat\beta_2\text{ en las tres clases}\)`,String.raw`Sin interacción el modelo impone la misma diferencia por sexo: por eso no reproduce las medias de cada celda.`]]),

"d-46":mp([
[String.raw`\(E_jS_i\cdot E_{j'}S_{i'}=0\ \text{si}\ (j,i)\neq(j',i')\)`,String.raw`Cada persona está en una sola celda (clase × sexo).`],
[String.raw`\(X'X=\operatorname{diag}(n_{11},n_{12},\dots,n_{32})\)`,String.raw`Matriz diagonal con el número de personas de cada una de las 6 celdas.`],
[String.raw`\(\hat\theta_{ji}=\dfrac{\sum_{celda}Y}{n_{ji}}=\bar Y_{ji}\)`,String.raw`Cada coeficiente es la suma de la celda sobre su tamaño: la media observada.`],
[String.raw`\(q=6-4=2\)`,String.raw`Para probar la interacción: el no restringido tiene 6 parámetros y el del 4.5, 4.`]]),

"d-47":mp([
[String.raw`\(\text{Sin aumento }(n=5):\ \hat Y=16{,}762+0{,}6986X,\ RSS=57{,}193\)`,String.raw`Regresión simple con las familias sin asterisco.`],
[String.raw`\(\text{Con aumento }(n=7):\ \hat Y=10{,}306+0{,}7452X,\ RSS=247{,}900\)`,String.raw`Regresión simple con las familias con asterisco.`],
[String.raw`\(RSS_{NR}=57{,}193+247{,}900=305{,}094\)`,String.raw`Dos rectas separadas equivalen al modelo con D y DX.`],
[String.raw`\(RSS_R=310{,}969\)`,String.raw`Una sola recta con las 12 familias.`],
[String.raw`\(F=\dfrac{(310{,}969-305{,}094)/2}{305{,}094/(12-4)}=\dfrac{5{,}875/2}{38{,}137}=\dfrac{2{,}938}{38{,}137}=0{,}077\)`,String.raw`F (64) con q = 2 y n − k = 8.`],
[String.raw`\(F=\dfrac{(310{,}969-310{,}653)/1}{310{,}653/9}=\dfrac{0{,}316}{34{,}517}=0{,}009\)`,String.raw`Solo intercepto distinto: q = 1 y el no restringido tiene 3 parámetros (n − k = 9).`]]),

"d-48":mp([
[String.raw`\(s^2=\dfrac{RSS}{n-k}\Rightarrow RSS=s^2(n-k)\)`,String.raw`Se despeja la RSS del error estándar de la regresión.`],
[String.raw`\(RSS_R=0{,}03755^2(39-3)=0{,}00141(36)=0{,}050760\)`,String.raw`Toda la muestra (restringido).`],
[String.raw`\(RSS_1=0{,}04573^2(17)=0{,}035551,\qquad RSS_2=0{,}02185^2(16)=0{,}007639\)`,String.raw`1929-1948 son 20 años y 1949-1967 son 19; a cada uno se le restan 3 parámetros.`],
[String.raw`\(RSS_{NR}=0{,}035551+0{,}007639=0{,}043190\)`,String.raw`Suma de los dos subperiodos.`],
[String.raw`\(F=\dfrac{(0{,}050760-0{,}043190)/3}{0{,}043190/33}=\dfrac{0{,}002523}{0{,}001309}=1{,}93\)`,String.raw`q = k = 3 y n − 2k = 39 − 6 = 33.`]]),

"d-49":mp([
[String.raw`\(\det\begin{bmatrix}20&20\\20&25\end{bmatrix}=20(25)-20(20)=100\)`,String.raw`Determinante 2 × 2.`],
[String.raw`\(\mathbf b_1=\dfrac1{100}\begin{bmatrix}25(10)-20(20)\\-20(10)+20(20)\end{bmatrix}=\dfrac1{100}\begin{bmatrix}-150\\200\end{bmatrix}=\begin{bmatrix}-1{,}5\\2\end{bmatrix}\)`,String.raw`Inversa 2 × 2 por X′y.`],
[String.raw`\(RSS_1=\mathbf y'\mathbf y-\mathbf b_1'X'\mathbf y=30-(-15+40)=5\)`,String.raw`\(\mathbf b'X'\mathbf y=-1{,}5(10)+2(20)\).`],
[String.raw`\(\mathbf b_2=\dfrac1{100}\begin{bmatrix}20(8)-10(20)\\-10(8)+10(20)\end{bmatrix}=\begin{bmatrix}-0{,}4\\1{,}2\end{bmatrix},\quad RSS_2=24-(-3{,}2+24)=3{,}2\)`,String.raw`Igual con los datos rurales (det = 10·20 − 10·10 = 100).`],
[String.raw`\(X'X_R=\begin{bmatrix}20+10&20+10\\20+10&25+20\end{bmatrix}=\begin{bmatrix}30&30\\30&45\end{bmatrix},\quad X'\mathbf y_R=\begin{bmatrix}18\\40\end{bmatrix},\quad\mathbf y'\mathbf y_R=54\)`,String.raw`Al juntar las dos muestras, las sumas de productos se suman.`],
[String.raw`\(\det=30(45)-30^2=450,\quad\mathbf b=\dfrac1{450}\begin{bmatrix}45(18)-30(40)\\-30(18)+30(40)\end{bmatrix}=\dfrac1{450}\begin{bmatrix}-390\\660\end{bmatrix}\)`,String.raw`b = (−0,8667; 1,4667).`],
[String.raw`\(RSS_R=54-(-0{,}8667(18)+1{,}4667(40))=54-(-15{,}6+58{,}667)=10{,}933\)`,String.raw`Misma fórmula de la RSS.`],
[String.raw`\(F=\dfrac{(10{,}933-8{,}2)/2}{8{,}2/16}=\dfrac{1{,}367}{0{,}5125}=2{,}667\)`,String.raw`q = 2 y n − 2k = 20 − 4 = 16.`]]),

"d-410":mp([
[String.raw`\(RSS_j=s_j^2(n_j-2)\)`,String.raw`La varianza residual es RSS/(n − k), con k = 2 en cada regresión log-log simple.`],
[String.raw`\(26+42+15=83=RSS_{NR}\)`,String.raw`0,26(100), 0,42(100) y 0,30(50).`],
[String.raw`\(RSS_R=0{,}38(256-2)=96{,}52\)`,String.raw`Una sola regresión con los 256 hogares.`],
[String.raw`\(q=(3-1)(2)=4,\qquad n-3k=256-6=250\)`,String.raw`Igualar tres juegos de 2 parámetros.`],
[String.raw`\(F=\dfrac{(96{,}52-83)/4}{83/250}=\dfrac{3{,}38}{0{,}332}=10{,}18\)`,String.raw`F (64).`],
[String.raw`\(\operatorname{var}(\ln X)=24\Rightarrow\sum(x-\bar x)^2=n\cdot24=256(24)=6.144\)`,String.raw`La varianza (con divisor n) por n es la suma de cuadrados en desviaciones.`],
[String.raw`\(ee(b)=\sqrt{\dfrac{s^2}{S_{XX}}}=\sqrt{\dfrac{0{,}38}{6.144}}=\sqrt{0{,}0000618}=0{,}00786\)`,String.raw`Error estándar de la pendiente en regresión simple.`],
[String.raw`\(t=\dfrac{0{,}07-0{,}10}{0{,}00786}=-3{,}81\)`,String.raw`Prueba t contra el valor 0,10 de H₀.`]]),

"p1-39":mp([
[String.raw`\(\det(X_*'X_*)=10(30\cdot20-15^2)-10(10\cdot20-15\cdot5)+5(10\cdot15-30\cdot5)=3750-1250+0=2500\)`,String.raw`Determinante 3 × 3 por la primera fila.`],
[String.raw`\((X_*'X_*)^{-1}=\begin{bmatrix}0{,}15&-0{,}05&0\\-0{,}05&0{,}07&-0{,}04\\0&-0{,}04&0{,}08\end{bmatrix}\)`,String.raw`Adjunta transpuesta dividida por 2500 (por ejemplo, el elemento (1,1) es (30·20 − 15²)/2500 = 375/2500 = 0,15).`],
[String.raw`\(b_2=0{,}15(7)-0{,}05(-7)+0(-26)=1{,}05+0{,}35=1{,}4\)`,String.raw`Primera fila de la inversa por X′y.`],
[String.raw`\(b_3=-0{,}05(7)+0{,}07(-7)-0{,}04(-26)=-0{,}35-0{,}49+1{,}04=0{,}2\)`,String.raw`Segunda fila.`],
[String.raw`\(b_4=0-0{,}04(-7)+0{,}08(-26)=0{,}28-2{,}08=-1{,}8\)`,String.raw`Tercera fila.`],
[String.raw`\(ESS=\mathbf b_2'X_*'\mathbf y_*=1{,}4(7)+0{,}2(-7)-1{,}8(-26)=9{,}8-1{,}4+46{,}8=55{,}2\)`,String.raw`En desviaciones, ESS = b′X*′X*b = b′X*′y* por las ecuaciones normales.`],
[String.raw`\(S^2=\dfrac{60-55{,}2}{24-4}=\dfrac{4{,}8}{20}=0{,}24\)`,String.raw`RSS = TSS − ESS; k = 4 cuenta el intercepto.`],
[String.raw`\(F_{\beta_2=1}=\dfrac{(1{,}4-1)^2}{0{,}24(0{,}15)}=\dfrac{0{,}16}{0{,}036}=4{,}444\)`,String.raw`Coeficiente menos el valor de H₀, al cuadrado, sobre su varianza.`],
[String.raw`\(\operatorname{var}(b_2+b_3+b_4)=0{,}24\,(0{,}15+0{,}07+0{,}08+2(-0{,}05)+2(0)+2(-0{,}04))=0{,}24(0{,}12)=0{,}0288\)`,String.raw`Varianza de una suma: las tres varianzas más dos veces cada covarianza.`],
[String.raw`\(X_*'X_*(\mathbf b-\mathbf r)=\begin{bmatrix}10(0{,}4)+10(-0{,}8)+5(0{,}2)\\10(0{,}4)+30(-0{,}8)+15(0{,}2)\\5(0{,}4)+15(-0{,}8)+20(0{,}2)\end{bmatrix}=\begin{bmatrix}-3\\-17\\-6\end{bmatrix}\)`,String.raw`Con \(\mathbf b-\mathbf r=(1{,}4-1;\;0{,}2-1;\;-1{,}8+2)=(0{,}4;\,-0{,}8;\,0{,}2)\): primero la matriz por el vector.`],
[String.raw`\((\mathbf b-\mathbf r)'X_*'X_*(\mathbf b-\mathbf r)=0{,}4(-3)+(-0{,}8)(-17)+0{,}2(-6)=-1{,}2+13{,}6-1{,}2=11{,}2\)`,String.raw`Luego la fila por la columna: da un número.`],
[String.raw`\(F=\dfrac{11{,}2/3}{0{,}24}=15{,}56\)`,String.raw`F (56) con R = I y q = 3.`]]),

"p1-310":mp([
[String.raw`\(\det(X'X)=10(92\cdot163-119^2)-30(30\cdot163-119\cdot40)+40(30\cdot119-92\cdot40)\)`,String.raw`Determinante 3 × 3 por la primera fila.`],
[String.raw`\(=10(14996-14161)-30(4890-4760)+40(3570-3680)=8350-3900-4400=50\)`,String.raw`Se resuelven los productos de cada menor 2 × 2.`],
[String.raw`\(c_{22}=\dfrac{10(163)-40^2}{50}=\dfrac{1630-1600}{50}=0{,}6\)`,String.raw`Elemento (2,2) de la inversa: su menor (quitando fila 2 y columna 2) sobre el determinante.`],
[String.raw`\(\mathbf b=(X'X)^{-1}X'\mathbf y=(-13;\;1;\;3)\)`,String.raw`Producto de la inversa completa por (20; 59; 88).`],
[String.raw`\(\bar Y=\dfrac{20}{10}=2\)`,String.raw`El primer elemento de X′y es ΣY y el (1,1) de X′X es n.`],
[String.raw`\(TSS=88{,}2-10(2^2)=48{,}2,\qquad\mathbf b'X'\mathbf y=-13(20)+1(59)+3(88)=-260+59+264=63\)`,String.raw`TSS = y′y − nȲ².`],
[String.raw`\(ESS=63-40=23,\quad RSS=48{,}2-23=25{,}2,\quad S^2=\dfrac{25{,}2}{7}=3{,}6\)`,String.raw`ESS = b′X′y − nȲ²; n − k = 10 − 3.`],
[String.raw`\(S_{b_2}=\sqrt{3{,}6(0{,}6)}=\sqrt{2{,}16}=1{,}470,\qquad t=\dfrac{1}{1{,}470}=0{,}680\)`,String.raw`Prueba t (59) de β₂ = 0.`]]),

"p1-313":mp([
[String.raw`\(\mathbf b-\mathbf r=\begin{bmatrix}0{,}24-0\\0{,}94-1\end{bmatrix}=\begin{bmatrix}0{,}24\\-0{,}06\end{bmatrix}\)`,String.raw`Distancia entre la estimación y lo que dice H₀.`],
[String.raw`\(X'X(\mathbf b-\mathbf r)=\begin{bmatrix}30(0{,}24)+300(-0{,}06)\\300(0{,}24)+3052(-0{,}06)\end{bmatrix}=\begin{bmatrix}7{,}2-18\\72-183{,}12\end{bmatrix}=\begin{bmatrix}-10{,}8\\-111{,}12\end{bmatrix}\)`,String.raw`Primero la matriz por el vector.`],
[String.raw`\((\mathbf b-\mathbf r)'X'X(\mathbf b-\mathbf r)=0{,}24(-10{,}8)+(-0{,}06)(-111{,}12)=-2{,}592+6{,}667=4{,}075\)`,String.raw`Luego la fila por la columna: da un número.`],
[String.raw`\(S^2=\dfrac{28{,}56}{30-2}=1{,}02\)`,String.raw`k = 2 en regresión simple con intercepto.`],
[String.raw`\(F=\dfrac{4{,}075/2}{1{,}02}=\dfrac{2{,}0375}{1{,}02}=1{,}998\)`,String.raw`F (56) con q = 2.`]]),

"p1-320":mp([
[String.raw`\(\sum X_2=\sum X_3=0\)`,String.raw`Los ceros de la primera fila de X′X dicen que las regresoras están en desviaciones.`],
[String.raw`\(b_1=\dfrac{132}{33}=4=\bar Y\)`,String.raw`El bloque del intercepto es independiente: 33·b₁ = 132.`],
[String.raw`\(\det\begin{bmatrix}40&20\\20&60\end{bmatrix}=2400-400=2000\)`,String.raw`Bloque de las pendientes.`],
[String.raw`\(b_2=\dfrac{60(24)-20(92)}{2000}=\dfrac{1440-1840}{2000}=-0{,}2,\quad b_3=\dfrac{-20(24)+40(92)}{2000}=\dfrac{3200}{2000}=1{,}6\)`,String.raw`Inversa 2 × 2 por (24; 92).`],
[String.raw`\(\mathbf b'X'\mathbf y=4(132)-0{,}2(24)+1{,}6(92)=528-4{,}8+147{,}2=670{,}4\)`,String.raw`Producto fila por columna.`],
[String.raw`\(ESS=670{,}4-33(4^2)=670{,}4-528=142{,}4,\quad RSS=150-142{,}4=7{,}6\)`,String.raw`ESS = b′X′y − nȲ²; RSS = TSS − ESS.`],
[String.raw`\(S^2_{b_2}=\dfrac{7{,}6}{30}(0{,}03)=0{,}0076,\qquad F=\dfrac{0{,}04}{0{,}0076}=5{,}263\)`,String.raw`F (58): b₂² sobre su varianza.`],
[String.raw`\(ESS_R=\dfrac{92^2}{60}=141{,}07,\qquad RSS_R=150-141{,}07=8{,}933\)`,String.raw`Sin X₂: b₃ = 92/60 y ESS_R = b₃·92.`],
[String.raw`\(F_{64}=\dfrac{8{,}933-7{,}6}{7{,}6/30}=\dfrac{1{,}333}{0{,}2533}=5{,}263\)`,String.raw`Misma F por las RSS.`]]),

"p1-t21":mp([
[String.raw`\(S^2=0{,}0696^2=0{,}004844,\qquad RSS_{NR}=(52-5)(0{,}004844)=0{,}2277\)`,String.raw`El error estándar de la regresión es √(RSS/(n − k)).`],
[String.raw`\(F=\dfrac{(-0{,}9821+1{,}6)^2}{0{,}06021}=\dfrac{0{,}6179^2}{0{,}06021}=\dfrac{0{,}3818}{0{,}06021}=6{,}341\)`,String.raw`c) Un coeficiente contra el valor −1,6.`],
[String.raw`\(\operatorname{var}(b_2+4b_4)=0{,}06021+16(0{,}00773)+2(4)(0{,}00405)=0{,}06021+0{,}12368+0{,}0324=0{,}2163\)`,String.raw`d) \(\operatorname{var}(aX+bY)\) con a = 1 y b = 4.`],
[String.raw`\(b_2+4b_4=-0{,}9821+4(0{,}1663)=-0{,}9821+0{,}6652=-0{,}3169\)`,String.raw`Se reemplazan los coeficientes.`],
[String.raw`\(F=\dfrac{(-0{,}3169)^2}{0{,}2163}=\dfrac{0{,}1004}{0{,}2163}=0{,}464\)`,String.raw`F (60).`],
[String.raw`\(F_{64}=\dfrac{(0{,}23-0{,}2277)/1}{0{,}004844}=\dfrac{0{,}0023}{0{,}004844}=0{,}48\)`,String.raw`Con las RSS: el denominador RSS_NR/(n − k) es S².`],
[String.raw`\(F_f=\dfrac{(0{,}24096-0{,}2277)/2}{0{,}004844}=\dfrac{0{,}01163}{0{,}004844}=1{,}371\)`,String.raw`f) q = 2.`]]),

"p1-t24":mp([
[String.raw`\(t_{0{,}025}(45)=2{,}0141\)`,String.raw`n − k = 48 − 3.`],
[String.raw`\(10{,}3017\pm2{,}0141(0{,}2440)=10{,}3017\pm0{,}4915\)`,String.raw`Intervalo para β₁: [9,8103; 10,7932].`],
[String.raw`\(\operatorname{var}(b_2+b_3)=0{,}0001610^2+0{,}0008146^2+2(5{,}399\cdot10^{-8})=2{,}59\cdot10^{-8}+6{,}636\cdot10^{-7}+1{,}080\cdot10^{-7}=7{,}975\cdot10^{-7}\)`,String.raw`Las varianzas son los errores estándar al cuadrado; más dos veces la covarianza.`],
[String.raw`\((b_2+b_3)^2=(-0{,}0059941+0{,}0051071)^2=(-0{,}000887)^2=7{,}868\cdot10^{-7}\)`,String.raw`Numerador de la F (60).`],
[String.raw`\(F_{60}=\dfrac{7{,}868\cdot10^{-7}}{7{,}975\cdot10^{-7}}=0{,}9866\)`,String.raw`Cociente.`],
[String.raw`\(F_{64}=\dfrac{1{,}239267-1{,}21268}{1{,}21268/45}=\dfrac{0{,}026587}{0{,}026948}=0{,}9866\)`,String.raw`Misma F con las RSS.`]]),

"p1-t27":mp([
[String.raw`\(t_{0{,}025}(28)=2{,}0484,\quad1{,}8301\pm2{,}0484(0{,}1822)=1{,}8301\pm0{,}3732\)`,String.raw`Intervalo para β₂: [1,457; 2,203].`],
[String.raw`\(b_2+b_3-1=1{,}8301-0{,}8433-1=-0{,}0132\)`,String.raw`Distancia a la restricción β₂ + β₃ = 1.`],
[String.raw`\(\operatorname{var}(b_2+b_3)=0{,}03319+0{,}08054+2(-0{,}05132)=0{,}11373-0{,}10264=0{,}011087\)`,String.raw`La covarianza negativa reduce la varianza de la suma.`],
[String.raw`\(F=\dfrac{0{,}0132^2}{0{,}011087}=\dfrac{0{,}000174}{0{,}011087}=0{,}0157\)`,String.raw`F (60).`],
[String.raw`\(RSS_R-RSS_{NR}=0{,}1408846-0{,}1408056=0{,}000079\)`,String.raw`Pérdida de ajuste mínima.`],
[String.raw`\(W=\dfrac{31(0{,}000079)}{0{,}1408056},\quad LR=31\ln\dfrac{0{,}1408846}{0{,}1408056},\quad LM=\dfrac{31(0{,}000079)}{0{,}1408846}\)`,String.raw`Las tres valen ≈ 0,0174; W divide por el RSS no restringido y LM por el restringido.`]]),

"p1-t28":mp([
[String.raw`\(t_{0{,}025}(31)=2{,}0395,\quad-5{,}8139\pm2{,}0395(0{,}4970)=-5{,}8139\pm1{,}0136\)`,String.raw`Intervalo para β₂: [−6,828; −4,800].`],
[String.raw`\(-5{,}732889+3(1{,}910963)=-5{,}732889+5{,}732889=0\)`,String.raw`b_R cumple la restricción β₂ + 3β₃ = 0.`],
[String.raw`\(b_2+3b_3=-5{,}8139+5{,}0016=-0{,}8123\)`,String.raw`Rb − r con R = [0 1 3 0].`],
[String.raw`\(\operatorname{var}=0{,}24705+9(0{,}51093)+6(0{,}09828)=0{,}24705+4{,}59838+0{,}58971=5{,}43514\)`,String.raw`\(\operatorname{var}(aX+bY)\) con a = 1 y b = 3: 9 = 3² y 6 = 2·1·3.`],
[String.raw`\(F_{60}=\dfrac{0{,}65983}{5{,}43514}=0{,}1214\)`,String.raw`Numerador: (−0,8123)².`],
[String.raw`\(RSS_R=15.008-14.619{,}98=388{,}02,\quad RSS_{NR}=31(3{,}531^2)=31(12{,}468)=386{,}51\)`,String.raw`RSS = TSS − ESS en el restringido; RSS = (n − k)S² en el no restringido.`],
[String.raw`\(F_{64}=\dfrac{388{,}02-386{,}51}{386{,}51/31}=\dfrac{1{,}51}{12{,}468}=0{,}121\)`,String.raw`Misma F con las RSS.`]])};
for(const tl of TALLERES)for(const p of (tl.puntos||[]))if(M[p.id])p.micro=M[p.id];})();
