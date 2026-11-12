
// ===================== AJUSTE AL PROGRAMA 1504110 =====================
// Agrupa la ruta en las seis unidades del programa, sube al tronco las ramas que el programa evalúa
// y agrega las estaciones que faltaban: pruebas LR, Wald y LM; diagnóstico; MCG; GMM.
(function(){
const LABX=t=>`<section><h3>Laboratorio${t?": "+t:""}</h3><div class="sim" id="sim"></div></section>`;
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
const take=id=>{for(const g of BRANCHES){const k=(g.items||[]).findIndex(x=>x.id===id);if(k>=0)return g.items.splice(k,1)[0]}return null};
ins("inferencia",[
{id:"mv-pruebas", t:"Máxima verosimilitud y las pruebas LR, Wald y LM", sim:"mvtest", html:String.raw`
<section><h3>Estimación por máxima verosimilitud</h3><p class="lead">Con \(u\sim N(0,\sigma^2I)\), la log-verosimilitud del modelo lineal es</p>
<div class="mj">\[\ln L(\beta,\sigma^2)=-\frac n2\ln(2\pi)-\frac n2\ln\sigma^2-\frac{(y-X\beta)'(y-X\beta)}{2\sigma^2}\]</div>
<p>y sus estimadores son \(\hat\beta_{MV}=(X'X)^{-1}X'y\) (igual a MCO) y \(\hat\sigma^2_{MV}=e'e/n\) (sesgado pero consistente). El EMV es consistente, asintóticamente normal y eficiente: su varianza asintótica es la inversa de la matriz de información, \(I(\theta)^{-1}\).</p></section>
<section><h3>Tres formas de probar restricciones \(R\beta=r\)</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>Qué estima</th><th>Idea</th><th>En el modelo lineal</th></tr>
<tr><td>Razón de verosimilitud (LR)</td><td>Los dos modelos</td><td>¿Cuánto cae \(\ln L\) al imponer la restricción?</td><td>\(LR=n\ln\frac{SCR_R}{SCR_{NR}}\)</td></tr>
<tr><td>Wald (W)</td><td>Solo el no restringido</td><td>¿Qué tan lejos está \(R\hat\beta\) de \(r\)?</td><td>\(W=n\frac{SCR_R-SCR_{NR}}{SCR_{NR}}\)</td></tr>
<tr><td>Multiplicadores de Lagrange (LM)</td><td>Solo el restringido</td><td>¿Qué tan empinada es \(\ln L\) en la restricción?</td><td>\(LM=n\frac{SCR_R-SCR_{NR}}{SCR_R}=nR^2_{aux}\)</td></tr></table></div>
<p>Las tres son asintóticamente \(\chi^2_q\) bajo \(H_0\) y en muestras finitas cumplen \(W\ge LR\ge LM\). La prueba \(F\) es la versión exacta (con normalidad) de Wald: \(W=qF\cdot\frac{n}{n-k}\).</p></section>
<section><h3>Regresión restringida</h3><p>Minimizar \(e'e\) sujeto a \(R\beta=r\) da \(\hat\beta_R=\hat\beta-(X'X)^{-1}R'[R(X'X)^{-1}R']^{-1}(R\hat\beta-r)\). Ejemplos: rendimientos constantes a escala en una Cobb-Douglas (\(\beta_K+\beta_L=1\)), igualdad de coeficientes.</p></section>
${LABX("las tres pruebas con los mismos datos")}`,
qs:[{q:"Con n = 50, SCR_R = 120 y SCR_NR = 100, calcule W, LR y LM.",a:"W = 50·20/100 = 10; LR = 50·ln(1,2) = 9,12; LM = 50·20/120 = 8,33. Se cumple W ≥ LR ≥ LM."}]}]);
const B2=["multicol","hetero","autocorr","especificacion"].map(take).filter(Boolean),B4=["vi","simultaneas"].map(take).filter(Boolean),B6=["discreta"].map(take).filter(Boolean);
ins("chow",[
{id:"diagnostico", t:"Diagnóstico: residuos, normalidad, no linealidad y observaciones influyentes", sim:"diag", html:String.raw`
<section><h3>Selección de variables y bondad de ajuste</h3><p class="lead">Antes de interpretar coeficientes hay que verificar que el modelo cumpla los supuestos. La selección de regresores combina teoría y criterios: \(\bar R^2\), Akaike (AIC) y Schwarz (BIC), pruebas F de variables omitidas o redundantes.</p></section>
<section><h3>Normalidad</h3><ul><li><b>Jarque-Bera:</b> \(JB=n\left[\frac{S^2}{6}+\frac{(K-3)^2}{24}\right]\sim\chi^2_2\), con la asimetría \(S\) y la curtosis \(K\) de los residuos.</li><li><b>Shapiro-Wilk:</b> compara los residuos ordenados con los cuantiles normales; potente en muestras pequeñas.</li><li><b>Gráfico QQ:</b> los puntos deben caer sobre la recta.</li></ul></section>
<section><h3>No linealidad y estabilidad</h3><ul><li><b>RESET de Ramsey:</b> agrega \(\hat y^2,\hat y^3\) y prueba si son significativos.</li><li><b>Rainbow (Utts):</b> compara el ajuste del centro de la muestra con el de toda la muestra.</li><li><b>Chow, Hansen, CUSUM y CUSUMQ, estimación recursiva:</b> estabilidad de los parámetros (ver «Cambio estructural a fondo»).</li></ul></section>
<section><h3>Observaciones influyentes</h3>
<div class="mj">\[h_{ii}=x_i'(X'X)^{-1}x_i\qquad r_i=\frac{e_i}{s\sqrt{1-h_{ii}}}\qquad D_i=\frac{r_i^2}{k}\cdot\frac{h_{ii}}{1-h_{ii}}\]</div>
<p>El <b>apalancamiento</b> \(h_{ii}\) mide qué tan atípicas son las \(x\) de la observación (alerta si \(h_{ii}>2k/n\)); el <b>residuo estudentizado</b> \(r_i\), qué tan mal se ajusta su \(y\) (alerta si \(|r_i|>2\)); la <b>distancia de Cook</b> \(D_i\) combina ambas y mide cuánto cambiarían todos los coeficientes si se elimina (alerta si \(D_i>4/n\) o \(>1\)). En R: <code>hatvalues(m)</code>, <code>rstandard(m)</code>, <code>cooks.distance(m)</code>, <code>jarque.bera.test(resid(m))</code> (paquete tseries), <code>resettest(m)</code> y <code>raintest(m)</code> (lmtest).</p></section>
${LABX("encuentra la observación que manda")}`,
qs:[{q:"Una observación tiene h = 0,45 con n = 20 y k = 3. ¿Es de alto apalancamiento?",a:"Sí: 2k/n = 0,30 y h = 0,45 la supera."}]},...B2]);
ins(B2.length?B2[B2.length-1].id:"diagnostico",[
{id:"mcg", t:"El modelo lineal generalizado: MCG (Aitken)", sim:"mcg", html:String.raw`
<section><h3>Perturbaciones no esféricas</h3><p class="lead">Si \(V(u\mid X)=\sigma^2\Omega\) con \(\Omega\ne I\) (heterocedasticidad o autocorrelación), MCO sigue siendo insesgado y consistente, pero <b>deja de ser eficiente</b> y la fórmula usual \(s^2(X'X)^{-1}\) de su varianza es incorrecta: las pruebas t y F no son válidas.</p>
<div class="mj">\[V(\hat\beta_{MCO})=\sigma^2(X'X)^{-1}X'\Omega X(X'X)^{-1}\]</div></section>
<section><h3>El estimador de Aitken</h3>
<p>Si se encuentra una matriz \(P\) con \(P\Omega P'=I\) (abajo se explica cómo), transformar el modelo con \(P\) devuelve perturbaciones esféricas, y aplicar MCO al modelo transformado da</p>
<div class="mj">\[\hat\beta_{MCG}=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\qquad V(\hat\beta_{MCG})=\sigma^2(X'\Omega^{-1}X)^{-1}\]</div>
<p>Por el teorema de Aitken, MCG es MELI en el modelo generalizado; con normalidad coincide con el estimador de máxima verosimilitud. Casos: <b>mínimos cuadrados ponderados</b> (\(\Omega\) diagonal, se divide cada observación por \(\sigma_i\)) y la transformación de <b>Cochrane-Orcutt o Prais-Winsten</b> con autocorrelación AR(1).</p>
<p>En la práctica \(\Omega\) es desconocida: <b>MCG factibles</b> la estiman en una primera etapa. La alternativa es mantener MCO y usar errores estándar robustos (White, Newey-West).</p></section>
<section><h3>Por qué funciona: la matriz de transformación P</h3>
<p>Como \(\Omega\) es simétrica y definida positiva, existe una matriz \(P\) (\(n\times n\)) tal que \(P\Omega P'=I_n\), y por lo tanto \(\Omega^{-1}=P'P\). Se multiplica todo el modelo por \(P\):</p>
<div class="mj">\[\underbrace{Py}_{y^*}=\underbrace{PX}_{X^*}\beta+\underbrace{Pu}_{u^*}\qquad V(u^*)=P\,V(u)\,P'=\sigma^2P\Omega P'=\sigma^2I_n\]</div>
<p>El modelo transformado cumple todos los supuestos clásicos, así que MCO aplicado a él es MELI (Gauss-Markov). Ese MCO es justamente MCG:</p>
<div class="mj">\[\hat\beta=(X^{*\prime}X^*)^{-1}X^{*\prime}y^*=(X'P'PX)^{-1}X'P'Py=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\]</div>
<p>Esa es la prueba del <b>teorema de Aitken</b>: MCG es «MCO sobre los datos bien ponderados». Dos detalles que preguntan en el parcial:</p>
<ul><li><b>\(\sigma^2\) no hace falta para estimar \(\beta\)</b>: si \(V(u)=\sigma^2\Omega\), el \(\sigma^2\) se cancela en \((X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\). Solo hace falta conocer \(\Omega\) <i>salvo una constante</i>.</li>
<li><b>\(\sigma^2\) se estima con los residuos ponderados</b>: \(\hat\sigma^2=\dfrac{e'\Omega^{-1}e}{n-k}=\dfrac{e^{*\prime}e^*}{n-k}\), con \(e=y-X\hat\beta_{MCG}\).</li></ul></section>

<section><h3>Ejemplo resuelto: ventas y publicidad (Ejemplo 3 de clase)</h3>
<p class="lead">\(Y_t\) = volumen de ventas, \(X_t\) = gasto en publicidad. Modelo \(Y_t=\beta_1+\beta_2X_t+u_t\), \(t=1,\dots,6\), con \(E[u_t]=0\), \(\operatorname{cov}(u_t,u_s)=0\ \forall t\ne s\) y \(\operatorname{var}(u_t)=\sigma^2X_t\). Es decir, <b>no hay autocorrelación pero sí heterocedasticidad</b>: la varianza del error crece con el gasto en publicidad.</p>
<div class="tbl"><table><tr><th>\(t\)</th><th>\(Y_t\)</th><th>\(X_t\)</th><th>\(X_t^2\)</th><th>\(X_tY_t\)</th><th>\(1/X_t\)</th><th>\(Y_t/X_t\)</th></tr>
<tr><td>1</td><td>120</td><td>4</td><td>16</td><td>480</td><td>0,250000</td><td>30,000000</td></tr>
<tr><td>2</td><td>130</td><td>25</td><td>625</td><td>3.250</td><td>0,040000</td><td>5,200000</td></tr>
<tr><td>3</td><td>150</td><td>30</td><td>900</td><td>4.500</td><td>0,033333</td><td>5,000000</td></tr>
<tr><td>4</td><td>160</td><td>36</td><td>1.296</td><td>5.760</td><td>0,027778</td><td>4,444444</td></tr>
<tr><td>5</td><td>180</td><td>40</td><td>1.600</td><td>7.200</td><td>0,025000</td><td>4,500000</td></tr>
<tr><td>6</td><td>200</td><td>49</td><td>2.401</td><td>9.800</td><td>0,020408</td><td>4,081633</td></tr>
<tr><th>Σ</th><th>940</th><th>184</th><th>6.838</th><th>30.990</th><th>0,396519</th><th>53,226077</th></tr></table></div>
<p>Con esta tabla se resuelve todo el ejercicio: las tres primeras columnas de sumas sirven para MCO y las dos últimas para MCG.</p>

<h4>a. Obtener \(\operatorname{Var}(u)\)</h4>
<p>En la diagonal van las varianzas \(\sigma_t^2=\operatorname{var}(u_t)=\sigma^2X_t\); fuera de la diagonal, las covarianzas \(\sigma_{ij}=\operatorname{cov}(u_i,u_j)=0\). Se saca \(\sigma^2\) como factor común:</p>
<div class="mj">\[\operatorname{Var}(u)=\begin{bmatrix}\sigma^2X_1&0&\cdots&0\\0&\sigma^2X_2&\cdots&0\\\vdots&&\ddots&\vdots\\0&0&\cdots&\sigma^2X_6\end{bmatrix}=\sigma^2\,\Omega,\qquad\Omega=\operatorname{diag}(4,\,25,\,30,\,36,\,40,\,49)\ne I_6\]</div>
<p>Como \(\Omega\ne I\), las perturbaciones son <b>no esféricas</b>: MCO sigue siendo insesgado, pero ya no es el de mínima varianza.</p>

<h4>a. (cont.) Estimar por MCO</h4>
<div class="mj">\[b_{MCO}=(X'X)^{-1}X'y=\begin{bmatrix}n&\sum X_t\\\sum X_t&\sum X_t^2\end{bmatrix}^{-1}\begin{bmatrix}\sum Y_t\\\sum X_tY_t\end{bmatrix}=\begin{bmatrix}6&184\\184&6838\end{bmatrix}^{-1}\begin{bmatrix}940\\30990\end{bmatrix}\]</div>
<p>Inversa de una 2×2: se intercambia la diagonal, se cambia el signo de lo de afuera y se divide por el determinante, \(|X'X|=6\cdot6838-184^2=41028-33856=7172\):</p>
<div class="mj">\[(X'X)^{-1}=\frac1{7172}\begin{bmatrix}6838&-184\\-184&6\end{bmatrix}=\begin{bmatrix}0{,}9534300&-0{,}0256553\\-0{,}0256553&0{,}0008366\end{bmatrix}\]</div>
<div class="mj">\[b_{MCO}=\begin{bmatrix}0{,}9534300\cdot940-0{,}0256553\cdot30990\\-0{,}0256553\cdot940+0{,}0008366\cdot30990\end{bmatrix}=\begin{bmatrix}101{,}1656\\1{,}8098\end{bmatrix}\]</div>
<p>\(\hat Y_t=101{,}17+1{,}81X_t\): cada unidad adicional de publicidad se asocia con 1,81 unidades más de ventas.</p>

<h4>b. Estimar por MCG</h4>
<p><b>Paso 1. Invertir \(\Omega\).</b> Como es diagonal, basta invertir cada elemento: \(\Omega^{-1}=\operatorname{diag}\left(\frac1{X_1},\dots,\frac1{X_6}\right)\).</p>
<p><b>Paso 2. Calcular \(\Omega^{-1}X\) y \(\Omega^{-1}y\)</b> (lo que el profesor escribe en el tablero). Multiplicar por \(\Omega^{-1}\) divide cada fila por \(X_t\):</p>
<div class="mj">\[\Omega^{-1}X=\begin{bmatrix}1/X_1&X_1/X_1\\\vdots&\vdots\\1/X_6&X_6/X_6\end{bmatrix}=\begin{bmatrix}1/X_1&1\\\vdots&\vdots\\1/X_6&1\end{bmatrix}\qquad\Omega^{-1}y=\begin{bmatrix}Y_1/X_1\\\vdots\\Y_6/X_6\end{bmatrix}\]</div>
<p><b>Paso 3. Premultiplicar por \(X'\)</b> (filas: unos y \(X_t\)):</p>
<div class="mj">\[X'\Omega^{-1}X=\begin{bmatrix}\sum\frac1{X_t}&n\\n&\sum X_t\end{bmatrix}=\begin{bmatrix}0{,}396519&6\\6&184\end{bmatrix}\qquad X'\Omega^{-1}y=\begin{bmatrix}\sum\frac{Y_t}{X_t}\\\sum Y_t\end{bmatrix}=\begin{bmatrix}53{,}226077\\940\end{bmatrix}\]</div>
<p>Fíjate en el patrón: con \(\operatorname{var}(u_t)=\sigma^2X_t\), las sumas «suben un escalón»: donde MCO tenía \(n\), \(\sum X_t\), \(\sum X_t^2\), MCG tiene \(\sum 1/X_t\), \(n\), \(\sum X_t\).</p>
<p><b>Paso 4. Invertir.</b> \(|X'\Omega^{-1}X|=0{,}396519\cdot184-6^2=72{,}959546-36=36{,}959546\):</p>
<div class="mj">\[(X'\Omega^{-1}X)^{-1}=\frac1{36{,}959546}\begin{bmatrix}184&-6\\-6&0{,}396519\end{bmatrix}=\begin{bmatrix}4{,}9784161&-0{,}1623397\\-0{,}1623397&0{,}0107285\end{bmatrix}\]</div>
<p><b>Paso 5. Multiplicar.</b></p>
<div class="mj">\[b_{MCG}=\begin{bmatrix}4{,}9784161\cdot53{,}226077-0{,}1623397\cdot940\\-0{,}1623397\cdot53{,}226077+0{,}0107285\cdot940\end{bmatrix}=\begin{bmatrix}264{,}9816-152{,}5993\\-8{,}6407+10{,}0848\end{bmatrix}=\begin{bmatrix}112{,}3823\\1{,}4441\end{bmatrix}\]</div>
<p>\(\hat Y_t=112{,}38+1{,}44X_t\). Ojo con el redondeo: si usas la inversa con solo seis decimales (0,010728), la pendiente sale 1,4436 en vez de 1,4441. Conserva siete cifras o usa la calculadora del laboratorio.</p>

<h4>c. Errores estándar: ¿qué se gana?</h4>
<p>Residuos de MCG \(e_t=Y_t-112{,}3823-1{,}4441X_t\): 1,84; −18,48; −5,70; −4,37; 9,86; 16,86. La suma ponderada es \(\sum e_t^2/X_t=24{,}357\), así que \(\hat\sigma^2=24{,}357/(6-2)=6{,}0892\).</p>
<div class="tbl"><table><tr><th></th><th>\(\hat\beta_1\)</th><th>\(\hat\beta_2\)</th><th>e.e. de \(\hat\beta_2\)</th><th>Comentario</th></tr>
<tr><td>MCG</td><td>112,38</td><td>1,444</td><td>0,256</td><td>\(\sqrt{\hat\sigma^2\cdot0{,}0107285}\): el correcto y el menor</td></tr>
<tr><td>MCO, varianza correcta</td><td>101,17</td><td>1,810</td><td>0,324</td><td>\(\hat\sigma^2(X'X)^{-1}X'\Omega X(X'X)^{-1}\)</td></tr>
<tr><td>MCO, fórmula usual</td><td>101,17</td><td>1,810</td><td>0,360</td><td>\(s^2(X'X)^{-1}\) con \(s^2=618{,}10/4\): <b>no es válida</b> aquí</td></tr></table></div>
<p>La varianza de \(\hat\beta_2\) por MCG es el 62 % de la de MCO (0,0653 frente a 0,1050). <b>¿Por qué cambian los coeficientes?</b> MCG le da peso \(1/X_t\) a cada observación: la primera (\(X=4\)) pesa 12 veces más que la última (\(X=49\)), porque su error tiene mucha menos varianza y por lo tanto informa más. MCO trata a todas por igual y se deja jalar por las observaciones ruidosas de gasto alto.</p></section>

<section><h3>d. Sumas de cuadrados por MCG</h3>
<p class="lead">En MCG las sumas de cuadrados se definen con la misma ponderación \(\Omega^{-1}\) que el estimador: son las sumas de cuadrados de MCO, pero sobre los datos transformados \(y^*=Py\), \(X^*=PX\).</p>
<div class="tbl"><table><tr><th>Suma</th><th>MCO</th><th>MCG</th></tr>
<tr><td>Total (sin centrar)</td><td>\(y'y\)</td><td>\(y'\Omega^{-1}y=\sum Y_t^2/X_t\)</td></tr>
<tr><td>Explicada (sin centrar)</td><td>\(b'X'y\)</td><td>\(b_{MCG}'X'\Omega^{-1}y\)</td></tr>
<tr><td>Residual</td><td>\(e'e=y'y-b'X'y\)</td><td>\(e'\Omega^{-1}e=y'\Omega^{-1}y-b_{MCG}'X'\Omega^{-1}y\)</td></tr>
<tr><td>Corrección por la media</td><td>\(n\bar y^2\)</td><td>\(\dfrac{(\iota'\Omega^{-1}y)^2}{\iota'\Omega^{-1}\iota}=\dfrac{(\sum Y_t/X_t)^2}{\sum 1/X_t}\)</td></tr></table></div>
<p>Las versiones centradas restan la corrección: \(SCT=y'\Omega^{-1}y-\frac{(\iota'\Omega^{-1}y)^2}{\iota'\Omega^{-1}\iota}\) y \(SCE=b_{MCG}'X'\Omega^{-1}y-\frac{(\iota'\Omega^{-1}y)^2}{\iota'\Omega^{-1}\iota}\). El papel de \(\bar y\) lo hace la <b>media ponderada</b> \(\bar y_\omega=\frac{\sum Y_t/X_t}{\sum 1/X_t}\). La descomposición \(SCT=SCE+SCR\) se cumple porque la primera ecuación normal de MCG dice \(\iota'\Omega^{-1}e=\sum e_t/X_t=0\): los residuos <i>ponderados</i> suman cero.</p>
<h4>Con los datos del ejemplo</h4>
<p>Falta una columna en la tabla: \(Y_t^2/X_t\) = 3.600; 676; 750; 711,1111; 810; 816,3265, que suman \(y'\Omega^{-1}y=7.363{,}4376\).</p>
<div class="mj">\[b_{MCG}'X'\Omega^{-1}y=112{,}38228\cdot53{,}226077+1{,}444056\cdot940=5.981{,}6684+1.357{,}4126=7.339{,}0807\]</div>
<div class="mj">\[SCR_{MCG}=e'\Omega^{-1}e=7.363{,}4376-7.339{,}0807=24{,}3570\]</div>
<div class="mj">\[\frac{(\sum Y_t/X_t)^2}{\sum 1/X_t}=\frac{53{,}226077^2}{0{,}396519}=7.144{,}7101\qquad(\bar y_\omega=134{,}23)\]</div>
<div class="mj">\[SCT_{MCG}=7.363{,}4376-7.144{,}7101=218{,}7275\qquad SCE_{MCG}=7.339{,}0807-7.144{,}7101=194{,}3705\]</div>
<p>Comprobación: 194,3705 + 24,3570 = 218,7275. Con estas sumas:</p>
<ul><li>\(\hat\sigma^2=SCR/(n-k)=24{,}3570/4=6{,}0892\) (el mismo del punto c).</li>
<li>\(R^2_{MCG}=SCE/SCT=0{,}8886\) y \(\bar R^2=1-\frac{SCR/(n-k)}{SCT/(n-1)}=0{,}8608\).</li>
<li>\(F=\frac{SCE/(k-1)}{SCR/(n-k)}=\frac{194{,}3705}{6{,}0892}=31{,}92\), frente a \(F_{0{,}05}(1,4)=7{,}71\): la publicidad es significativa.</li></ul>
<p class="hint">Otra convención que aparece en algunos textos centra con la media simple del modelo transformado, \(\bar y^*=\frac1n\sum Y_t/\sqrt{X_t}=32{,}85\): da \(SCT^*=889{,}71\) y \(R^2=0{,}973\). La \(SCR\) es la misma en las dos; el \(R^2\) cambia según la definición y ninguno se compara con el \(R^2\) de MCO (0,864). Usa la que defina tu profesor.</p></section>
<section><h3>Atajo equivalente: el modelo transformado (MCP)</h3>
<p>Con \(\Omega=\operatorname{diag}(X_t)\), la matriz de transformación es \(P=\operatorname{diag}(1/\sqrt{X_t})\). Se divide toda la ecuación por \(\sqrt{X_t}\):</p>
<div class="mj">\[\frac{Y_t}{\sqrt{X_t}}=\beta_1\frac1{\sqrt{X_t}}+\beta_2\sqrt{X_t}+\frac{u_t}{\sqrt{X_t}},\qquad\operatorname{var}\!\left(\frac{u_t}{\sqrt{X_t}}\right)=\frac{\sigma^2X_t}{X_t}=\sigma^2\]</div>
<p>Se estima por MCO <b>sin intercepto</b> (la columna de unos se convirtió en \(1/\sqrt{X_t}\)) y sale exactamente \(\hat\beta_1=112{,}38\), \(\hat\beta_2=1{,}444\). Es la misma cuenta que el paso 3: \(X^{*\prime}X^*=X'P'PX=X'\Omega^{-1}X\).</p>
<div class="tbl"><table><tr><th>Si \(\operatorname{var}(u_t)=\)</th><th>\(\Omega\)</th><th>Se divide por</th><th>Modelo transformado</th></tr>
<tr><td>\(\sigma^2X_t\)</td><td>\(\operatorname{diag}(X_t)\)</td><td>\(\sqrt{X_t}\)</td><td>\(Y_t/\sqrt{X_t}=\beta_1/\sqrt{X_t}+\beta_2\sqrt{X_t}+v_t\)</td></tr>
<tr><td>\(\sigma^2X_t^2\)</td><td>\(\operatorname{diag}(X_t^2)\)</td><td>\(X_t\)</td><td>\(Y_t/X_t=\beta_2+\beta_1(1/X_t)+v_t\): el intercepto y la pendiente cambian de papel</td></tr>
<tr><td>\(\sigma_t^2\) conocidas</td><td>\(\operatorname{diag}(\sigma_t^2)\)</td><td>\(\sigma_t\)</td><td>Cada observación con peso \(1/\sigma_t^2\)</td></tr>
<tr><td>\(\sigma^2\) y AR(1) con \(\rho\)</td><td>\(\frac1{1-\rho^2}[\rho^{|t-s|}]\)</td><td>Cuasi-diferencias</td><td>\(Y_t-\rho Y_{t-1}=\beta_1(1-\rho)+\beta_2(X_t-\rho X_{t-1})+\varepsilon_t\) (Prais-Winsten conserva la 1.ª obs. multiplicada por \(\sqrt{1-\rho^2}\))</td></tr></table></div></section>

<section><h3>Errores típicos en el parcial</h3>
<ul><li><b>Dividir por \(X_t\) cuando la varianza es \(\sigma^2X_t\)</b>. Se divide por la <i>desviación estándar</i>, \(\sqrt{X_t}\). En la fórmula matricial, en cambio, \(\Omega^{-1}\) sí lleva \(1/X_t\): son la misma cosa porque \(P'P=\Omega^{-1}\).</li>
<li><b>Dejar un intercepto en el modelo transformado.</b> La constante original se convierte en el regresor \(1/\sqrt{X_t}\).</li>
<li><b>Calcular \(\hat\sigma^2\) con los residuos sin ponderar</b>: se usa \(e'\Omega^{-1}e/(n-k)\).</li>
<li><b>Comparar el \(R^2\)</b> del modelo transformado con el de MCO: están en variables distintas y no son comparables.</li>
<li><b>Redondear la inversa a dos decimales</b>: con elementos como 0,0107285 el error se dispara al multiplicar por sumas grandes (940). Conserva al menos seis cifras significativas en cada elemento (0,0107285, no 0,010728).</li></ul></section>

<section><h3>Verificación en R</h3>
<pre class="code"><code>y &lt;- c(120, 130, 150, 160, 180, 200)
x &lt;- c(4, 25, 30, 36, 40, 49)
X &lt;- cbind(1, x);  Oi &lt;- diag(1/x)          # Omega^-1
b_mco &lt;- solve(t(X) %*% X) %*% t(X) %*% y     # 101.17 y 1.81
b_mcg &lt;- solve(t(X) %*% Oi %*% X) %*% t(X) %*% Oi %*% y   # 112.38 y 1.44
summary(lm(y ~ x, weights = 1/x))             # MCP: mismos coeficientes y e.e.
summary(lm(I(y/sqrt(x)) ~ 0 + I(1/sqrt(x)) + sqrt(x)))   # modelo transformado</code></pre>
<p class="hint">En <code>lm</code>, <code>weights</code> es el inverso de la varianza: \(1/X_t\), no \(1/\sqrt{X_t}\).</p></section>
${LABX("¿cuánto gana MCG? y calculadora del ejemplo")}`,
qs:[{q:"Si Var(uᵢ) = σ²xᵢ², ¿qué transformación aplica MCP?",a:"Dividir toda la ecuación por xᵢ: la nueva perturbación uᵢ/xᵢ tiene varianza constante σ²."},
{q:"Con var(uₜ) = σ²Xₜ, escriba X′Ω⁻¹X y X′Ω⁻¹y para el modelo Yₜ = β₁ + β₂Xₜ + uₜ.",a:"X′Ω⁻¹X = [Σ1/Xₜ, n; n, ΣXₜ] y X′Ω⁻¹y = [ΣYₜ/Xₜ; ΣYₜ]."},
{q:"En el ejemplo de ventas y publicidad, ¿por qué la pendiente baja de 1,81 (MCO) a 1,44 (MCG)?",a:"MCG pondera cada observación por 1/Xₜ. Las observaciones con gasto alto tienen errores más variables y pesan menos; MCO las trata igual que las demás y se deja influir por su ruido."},
{q:"Con var(uₜ) = σ²Xₜ, ¿cómo se calcula la SCR por MCG sin calcular cada residuo?",a:"SCR = y′Ω⁻¹y − b′X′Ω⁻¹y = ΣYₜ²/Xₜ − (b₁ΣYₜ/Xₜ + b₂ΣYₜ). En el ejemplo: 7.363,4376 − 7.339,0807 = 24,357."},
{q:"¿Por qué no hace falta conocer σ² para calcular b_MCG?",a:"Porque Var(u) = σ²Ω y en (X′(σ²Ω)⁻¹X)⁻¹X′(σ²Ω)⁻¹y el factor σ² se cancela. Solo se necesita Ω hasta una constante."},
{q:"¿Qué condición debe cumplir la matriz P que transforma el modelo?",a:"PΩP′ = I, lo que equivale a P′P = Ω⁻¹. Con Ω diagonal, P = diag(1/√ωₜ)."}]}]);
ins("mcg",B4);
ins(B4.length?B4[B4.length-1].id:"mcg",[
{id:"gmm", t:"Método generalizado de los momentos (GMM)", sim:"gmm", html:String.raw`
<section><h3>Motivación</h3><p class="lead">Muchos modelos económicos implican condiciones de momentos \(E[g(w_i,\theta)]=0\) (ecuaciones de Euler, exogeneidad de instrumentos) sin especificar toda la distribución. GMM elige \(\theta\) para que los momentos muestrales se acerquen a cero.</p></section>
<section><h3>El estimador</h3>
<div class="mj">\[\bar g(\theta)=\frac1n\sum_{i=1}^n g(w_i,\theta)\qquad\hat\theta_{GMM}=\arg\min_\theta\ \bar g(\theta)'\,W\,\bar g(\theta)\]</div>
<p>Si hay tantos momentos como parámetros (exactamente identificado), se resuelve \(\bar g(\hat\theta)=0\) y \(W\) no importa. Con más momentos (sobreidentificado), la matriz de ponderación eficiente es \(W=S^{-1}\), la inversa de la varianza de los momentos; se estima en dos etapas.</p>
<p>En el modelo lineal con instrumentos \(Z\), \(g_i=z_i(y_i-x_i'\beta)\):</p>
<div class="mj">\[\hat\beta_{GMM}=(X'ZWZ'X)^{-1}X'ZWZ'y\qquad W=(Z'Z)^{-1}\Rightarrow\text{MC2E}\]</div></section>
<section><h3>Propiedades y pruebas</h3><ul><li>Consistente y asintóticamente normal; con \(W\) eficiente, el de menor varianza entre los GMM con esos momentos.</li><li><b>Prueba de sobreidentificación de Hansen:</b> \(J=n\,\bar g(\hat\theta)'\hat S^{-1}\bar g(\hat\theta)\sim\chi^2_{m-k}\); si se rechaza, algún instrumento no es válido.</li><li><b>Casos particulares:</b> MCO (\(z=x\)), VI y MC2E (momentos de exogeneidad), máxima verosimilitud (la condición de puntaje \(E[\partial\ln f/\partial\theta]=0\)).</li></ul>
<p>En R: <code>gmm(y ~ x, ~ z1 + z2)</code> (paquete gmm) o <code>ivreg</code> con <code>summary(..., diagnostics = TRUE)</code>.</p></section>
${LABX("MC2E frente a GMM eficiente")}`,
qs:[{q:"Con 3 instrumentos para 1 regresor endógeno (más la constante), ¿cuántos grados de libertad tiene la J de Hansen?",a:"Momentos m = 4 (constante y 3 instrumentos), parámetros k = 2: gl = m − k = 2."}]},...B6]);
const P={"r-cero":"Herramientas: R, datos y matrices","mco-simple":"Unidad 1 · El modelo de regresión lineal múltiple (repaso)",diagnostico:"Unidad 2 · Pruebas de diagnóstico",mcg:"Unidad 3 · El modelo lineal generalizado (MCG)",vi:"Unidad 4 · Variables instrumentales",gmm:"Unidad 5 · Método generalizado de los momentos",discreta:"Unidad 6 · Variable dependiente discreta"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
for(let i=BRANCHES.length-1;i>=0;i--)if(BRANCHES[i].items&&!BRANCHES[i].items.length)BRANCHES.splice(i,1);
})();
