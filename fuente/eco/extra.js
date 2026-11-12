
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
<section><h3>La idea</h3><p class="lead">Si \(V(u)=\sigma^2\Omega\) con \(\Omega\ne I\) (heterocedasticidad o autocorrelación), MCO sigue siendo insesgado, pero <b>deja de ser eficiente</b> y su fórmula usual de varianza es incorrecta. MCG pondera cada observación según su varianza y recupera la eficiencia: por el <b>teorema de Aitken</b>, es MELI.</p>
<div class="tbl"><table><tr><th></th><th>Estimador</th><th>Varianza</th></tr>
<tr><td><b>MCG</b></td><td>\(b_{MCG}=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\)</td><td>\(\sigma^2(X'\Omega^{-1}X)^{-1}\)</td></tr>
<tr><td><b>MCO</b></td><td>\(b_{MCO}=(X'X)^{-1}X'y\)</td><td>\(\sigma^2(X'X)^{-1}X'\Omega X(X'X)^{-1}\)</td></tr></table></div>
<p>Cuando \(\Omega\) es desconocida se estima primero (<b>MCG factibles</b>), o se mantiene MCO con errores robustos (White, Newey-West). Casos particulares: mínimos cuadrados ponderados (\(\Omega\) diagonal) y Cochrane-Orcutt o Prais-Winsten (AR(1)).</p></section>

<section><h3>Ejemplo 3 de clase: ventas y publicidad</h3>
<p>\(Y_t\) = volumen de ventas, \(X_t\) = gasto en publicidad, \(Y_t=\beta_1+\beta_2X_t+u_t\), con \(E[u_t]=0\), \(\operatorname{cov}(u_t,u_s)=0\ \forall t\ne s\) y \(\operatorname{var}(u_t)=\sigma^2X_t\): sin autocorrelación, pero con heterocedasticidad.</p>
<div class="tbl"><table><tr><th>\(Y_t\)</th><td>120</td><td>130</td><td>150</td><td>160</td><td>180</td><td>200</td></tr><tr><th>\(X_t\)</th><td>4</td><td>25</td><td>30</td><td>36</td><td>40</td><td>49</td></tr></table></div>
<p class="hint">Abre cada parte para ver el desarrollo. El resultado está a la vista en el título.</p>
<div class="tl-list">

<details class="pto"><summary><span class="pn">a</span><span class="pt">Var(u) y estimación por MCO<small>\(\Omega=\operatorname{diag}(X_t)\ne I\) · \(b_{MCO}=(101{,}1656;\ 1{,}8098)\)</small></span></summary><div class="pto-b">
<p>En la diagonal van las varianzas \(\sigma^2X_t\); fuera de ella, las covarianzas, que son cero. Se saca \(\sigma^2\) como factor común:</p>
<div class="mj">\[\operatorname{Var}(u)=\sigma^2\begin{bmatrix}X_1&&0\\&\ddots&\\0&&X_6\end{bmatrix}=\sigma^2\Omega,\qquad\Omega=\operatorname{diag}(4,25,30,36,40,49)\ne I_6\]</div>
<p>Sumas para MCO: \(n=6\), \(\sum X_t=184\), \(\sum X_t^2=6.838\), \(\sum Y_t=940\), \(\sum X_tY_t=30.990\).</p>
<div class="mj">\[b_{MCO}=\begin{bmatrix}6&184\\184&6838\end{bmatrix}^{-1}\begin{bmatrix}940\\30990\end{bmatrix}=\begin{bmatrix}0{,}9534300&-0{,}0256553\\-0{,}0256553&0{,}0008366\end{bmatrix}\begin{bmatrix}940\\30990\end{bmatrix}=\begin{bmatrix}101{,}165644\\1{,}809816\end{bmatrix}\]</div>
<p class="hint">Inversa 2×2: se intercambia la diagonal, se cambia el signo de lo de afuera y se divide por el determinante, \(6\cdot6838-184^2=7172\).</p>
</div></details>

<details class="pto"><summary><span class="pn">b</span><span class="pt">Estimación por MCG<small>\(b_{MCG}=(112{,}382282;\ 1{,}444056)\)</small></span></summary><div class="pto-b">
<p><b>1.</b> \(\Omega^{-1}=\operatorname{diag}(1/X_t)\): multiplicar por \(\Omega^{-1}\) divide cada fila por \(X_t\), así que \(\Omega^{-1}X\) tiene columnas \(1/X_t\) y \(1\), y \(\Omega^{-1}y\) tiene \(Y_t/X_t\).</p>
<p><b>2.</b> Las sumas «suben un escalón» respecto a MCO:</p>
<div class="mj">\[X'\Omega^{-1}X=\begin{bmatrix}\sum 1/X_t&n\\n&\sum X_t\end{bmatrix}=\begin{bmatrix}0{,}3965193&6\\6&184\end{bmatrix}\qquad X'\Omega^{-1}y=\begin{bmatrix}\sum Y_t/X_t\\\sum Y_t\end{bmatrix}=\begin{bmatrix}53{,}22608\\940\end{bmatrix}\]</div>
<div class="tbl"><table><tr><th>\(X_t\)</th><td>4</td><td>25</td><td>30</td><td>36</td><td>40</td><td>49</td><th>Σ</th></tr>
<tr><th>\(1/X_t\)</th><td>0,25</td><td>0,04</td><td>0,033333</td><td>0,027778</td><td>0,025</td><td>0,020408</td><th>0,3965193</th></tr>
<tr><th>\(Y_t/X_t\)</th><td>30</td><td>5,2</td><td>5</td><td>4,444444</td><td>4,5</td><td>4,081633</td><th>53,22608</th></tr></table></div>
<p><b>3.</b> Determinante \(0{,}3965193\cdot184-36=36{,}959546\) e inversa:</p>
<div class="mj">\[b_{MCG}=\begin{bmatrix}4{,}9784161&-0{,}16233965\\-0{,}16233965&0{,}010728467\end{bmatrix}\begin{bmatrix}53{,}22608\\940\end{bmatrix}=\begin{bmatrix}112{,}382282\\1{,}444056\end{bmatrix}\]</div>
<p>La pendiente baja de 1,81 a 1,44 porque MCG da peso \(1/X_t\) a cada observación: la de \(X=4\) pesa 12 veces más que la de \(X=49\), cuyo error es mucho más ruidoso.</p>
<p class="hint">No redondees la inversa: con 0,010728 en vez de 0,010728467 la pendiente sale 1,4436.</p>
</div></details>

<details class="pto"><summary><span class="pn">b</span><span class="pt">Sumas de cuadrados por MCG<small>TSS = 889,7064 · ESS = 865,3494 · RSS = 24,35697</small></span></summary><div class="pto-b">
<p>Son las sumas de cuadrados del modelo transformado \(Py\), donde \(P=\operatorname{diag}(1/\sqrt{X_t})\) y \(P'P=\Omega^{-1}\). La media que se resta es la de \(Py\):</p>
<div class="mj">\[\overline{Py}=\frac1n\sum\frac{Y_t}{\sqrt{X_t}}=\frac{60+26+27{,}3861+26{,}6667+28{,}4605+28{,}5714}{6}=32{,}84745\qquad n\,\overline{Py}^{\,2}=6.473{,}7313\]</div>
<div class="tbl"><table><tr><th>Suma</th><th>Definición</th><th>Cálculo</th><th>Valor</th></tr>
<tr><td>\(TSS_{MCG}\)</td><td>\(y'\Omega^{-1}y-n\overline{Py}^{\,2}\)</td><td>7.363,4376 − 6.473,7313</td><th>889,7064</th></tr>
<tr><td>\(ESS_{MCG}\)</td><td>\(b_{MCG}'X'\Omega^{-1}X\,b_{MCG}-n\overline{Py}^{\,2}\)</td><td>7.339,0807 − 6.473,7313</td><th>865,3494</th></tr>
<tr><td>\(RSS_{MCG}\)</td><td>\(e_{MCG}'\Omega^{-1}e_{MCG}=\sum e_t^2/X_t\)</td><td>7.363,4376 − 7.339,0807</td><th>24,35697</th></tr></table></div>
<p>Se verifica \(ESS+RSS=TSS\): 865,3494 + 24,35697 = 889,7064. Aquí \(y'\Omega^{-1}y=\sum Y_t^2/X_t\), y \(b'X'\Omega^{-1}Xb=b'X'\Omega^{-1}y=112{,}382282\cdot53{,}22608+1{,}444056\cdot940\).</p>
<p><b>Dos estimadores de \(\sigma^2\):</b></p>
<div class="mj">\[\hat\sigma^2_{MCG}=\frac{RSS_{MCG}}{n}=\frac{24{,}35697}{6}=4{,}059495\qquad s^2_{MCO\text{-}T}=\frac{RSS_{MCG}}{n-k}=\frac{24{,}35697}{4}=6{,}089242\]</div>
<p>El primero es el de máxima verosimilitud (sesgado); el segundo es el insesgado: es la \(s^2\) de MCO aplicado al modelo transformado. Para errores estándar y pruebas se usa \(s^2\). Si piden \(R^2\): \(ESS/TSS=0{,}9726\).</p>
</div></details>

<details class="pto"><summary><span class="pn">c</span><span class="pt">Varianzas de b<sub>MCG</sub> y b<sub>MCO</sub><small>e.e.(β̂₂): MCG 0,2556 &lt; MCO 0,3240</small></span></summary><div class="pto-b">
<div class="mj">\[\operatorname{Var}(b_{MCG})=\sigma^2(X'\Omega^{-1}X)^{-1}=\sigma^2\begin{bmatrix}4{,}9784161&-0{,}16233965\\-0{,}16233965&0{,}010728467\end{bmatrix}\]</div>
<p>La varianza verdadera de MCO usa la fórmula «sándwich», con \(X'\Omega X=\begin{bmatrix}\sum X_t&\sum X_t^2\\\sum X_t^2&\sum X_t^3\end{bmatrix}=\begin{bmatrix}184&6838\\6838&270994\end{bmatrix}\):</p>
<div class="mj">\[\operatorname{Var}_v(b_{MCO})=\sigma^2(X'X)^{-1}X'\Omega X(X'X)^{-1}=\sigma^2\begin{bmatrix}11{,}1058087&-0{,}36214594\\-0{,}36214594&0{,}01724389\end{bmatrix}\]</div>
<p>Comparando las diagonales, <b>MCG tiene menor varianza en los dos coeficientes</b> (Aitken): 4,978 &lt; 11,106 para \(\beta_1\) y 0,01073 &lt; 0,01724 para \(\beta_2\). La varianza de \(b_2\) por MCG es el 62 % de la de MCO.</p>
<p>Con \(s^2=6{,}089242\):</p>
<div class="tbl"><table><tr><th></th><th>Var(\(b_1\))</th><th>Var(\(b_2\))</th><th>e.e.(\(b_1\))</th><th>e.e.(\(b_2\))</th></tr>
<tr><td>MCG</td><td>30,3148</td><td>0,065328</td><td>5,5059</td><td>0,2556</td></tr>
<tr><td>MCO (verdadera)</td><td>67,6260</td><td>0,105002</td><td>8,2235</td><td>0,3240</td></tr></table></div>
<p class="hint">Error común: usar \(s^2(X'X)^{-1}\) para MCO. Con heterocedasticidad esa fórmula no es válida; da 0,3595 para e.e.(\(b_2\)).</p>
</div></details>

<details class="pto"><summary><span class="pn">d</span><span class="pt">Modelo transformado y estimación por MCO<small>Dividir todo por \(\sqrt{X_t}\) y estimar sin intercepto: da el mismo \(b_{MCG}\)</small></span></summary><div class="pto-b">
<p><b>1. Encontrar \(P\).</b> Se busca \(P\) con \(P'P=\Omega^{-1}\). Como \(\Omega^{-1}=\operatorname{diag}(1/X_t)\), sirve \(P=\operatorname{diag}(1/\sqrt{X_t})\). Comprobación: \(P\Omega P'=\operatorname{diag}\!\left(\frac{X_t}{\sqrt{X_t}\sqrt{X_t}}\right)=I_6\).</p>
<p><b>2. Transformar el modelo.</b> Se premultiplica \(y=X\beta+u\) por \(P\), es decir, se divide cada fila por \(\sqrt{X_t}\):</p>
<div class="mj">\[\underbrace{\frac{Y_t}{\sqrt{X_t}}}_{Y_t^*}=\beta_1\underbrace{\frac1{\sqrt{X_t}}}_{X_{1t}^*}+\beta_2\underbrace{\sqrt{X_t}}_{X_{2t}^*}+\underbrace{\frac{u_t}{\sqrt{X_t}}}_{u_t^*},\qquad\operatorname{var}(u_t^*)=\frac{\sigma^2X_t}{X_t}=\sigma^2\]</div>
<p>El error transformado es homocedástico: el modelo cumple los supuestos clásicos y se puede estimar por MCO. Ojo: <b>no lleva intercepto</b>, porque la columna de unos se volvió \(1/\sqrt{X_t}\).</p>
<p><b>3. Datos transformados.</b></p>
<div class="tbl"><table><tr><th>\(t\)</th><th>\(Y_t^*=Y_t/\sqrt{X_t}\)</th><th>\(X_{1t}^*=1/\sqrt{X_t}\)</th><th>\(X_{2t}^*=\sqrt{X_t}\)</th></tr>
<tr><td>1</td><td>60</td><td>0,5</td><td>2</td></tr>
<tr><td>2</td><td>26</td><td>0,2</td><td>5</td></tr>
<tr><td>3</td><td>27,386128</td><td>0,182574</td><td>5,477226</td></tr>
<tr><td>4</td><td>26,666667</td><td>0,166667</td><td>6</td></tr>
<tr><td>5</td><td>28,460499</td><td>0,158114</td><td>6,324555</td></tr>
<tr><td>6</td><td>28,571429</td><td>0,142857</td><td>7</td></tr></table></div>
<p><b>4. MCO sobre el modelo transformado.</b> Las sumas son \(\sum X_{1t}^{*2}=\sum 1/X_t\), \(\sum X_{1t}^*X_{2t}^*=n\), \(\sum X_{2t}^{*2}=\sum X_t\), \(\sum X_{1t}^*Y_t^*=\sum Y_t/X_t\) y \(\sum X_{2t}^*Y_t^*=\sum Y_t\):</p>
<div class="mj">\[b=(X^{*\prime}X^*)^{-1}X^{*\prime}y^*=\begin{bmatrix}0{,}3965193&6\\6&184\end{bmatrix}^{-1}\begin{bmatrix}53{,}22608\\940\end{bmatrix}=\begin{bmatrix}112{,}382282\\1{,}444056\end{bmatrix}\]</div>
<p>Son exactamente las mismas matrices de la parte b, porque \(X^{*\prime}X^*=X'P'PX=X'\Omega^{-1}X\). <b>MCG = MCO sobre el modelo transformado.</b></p>
<p><b>5. Lo demás también sale del modelo transformado.</b> Los residuos \(e_t^*=e_t/\sqrt{X_t}\) son 0,9207; −3,6967; −1,0414; −0,7280; 1,5583; 2,4084, y su suma de cuadrados es \(RSS=24{,}35697\). La TSS de clase es la TSS usual del modelo transformado, \(\sum Y_t^{*2}-n\bar Y^{*2}=7.363{,}4376-6.473{,}7313=889{,}7064\): por eso se centra con la media de \(Py\). Y \(s^2_{MCO\text{-}T}=RSS/(n-k)=6{,}089242\) es la \(s^2\) de este MCO; de ahí su nombre.</p>
<pre class="code"><code>ys &lt;- y/sqrt(x); x1s &lt;- 1/sqrt(x); x2s &lt;- sqrt(x)
summary(lm(ys ~ 0 + x1s + x2s))   # 0 = sin intercepto: 112.382282 y 1.444056</code></pre>
<p class="hint">Sin intercepto, R reporta un \(R^2\) no centrado; no es el de clase.</p>
</div></details>
</div></section>
${LABX("calculadora del ejemplo y simulación")}`,
deep:[
{k:"Teoría",t:"Por qué funciona: la matriz de transformación P",html:String.raw`<p>Como \(\Omega\) es simétrica y definida positiva, existe \(P\) con \(P\Omega P'=I\), es decir, \(P'P=\Omega^{-1}\). Multiplicando el modelo por \(P\):</p>
<div class="mj">\[y^*=Py,\quad X^*=PX,\quad u^*=Pu,\qquad V(u^*)=\sigma^2P\Omega P'=\sigma^2I\]</div>
<p>El modelo transformado cumple los supuestos clásicos, y su MCO es MCG: \((X^{*\prime}X^*)^{-1}X^{*\prime}y^*=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\). Eso prueba el teorema de Aitken. Además, \(\sigma^2\) se cancela en el estimador: solo hace falta conocer \(\Omega\) salvo una constante.</p>`},
{k:"Tabla",t:"Cómo transformar según la forma de la varianza",html:String.raw`<p>Con \(\operatorname{var}(u_t)=\sigma^2X_t\), \(P=\operatorname{diag}(1/\sqrt{X_t})\): se divide todo por \(\sqrt{X_t}\) y se estima por MCO <b>sin intercepto</b>. Da los mismos 112,38 y 1,444.</p>
<div class="mj">\[\frac{Y_t}{\sqrt{X_t}}=\beta_1\frac1{\sqrt{X_t}}+\beta_2\sqrt{X_t}+\frac{u_t}{\sqrt{X_t}}\]</div>
<div class="tbl"><table><tr><th>Si \(\operatorname{var}(u_t)=\)</th><th>Se divide por</th><th>Modelo transformado</th></tr>
<tr><td>\(\sigma^2X_t\)</td><td>\(\sqrt{X_t}\)</td><td>\(Y_t/\sqrt{X_t}=\beta_1/\sqrt{X_t}+\beta_2\sqrt{X_t}+v_t\)</td></tr>
<tr><td>\(\sigma^2X_t^2\)</td><td>\(X_t\)</td><td>\(Y_t/X_t=\beta_2+\beta_1(1/X_t)+v_t\)</td></tr>
<tr><td>\(\sigma_t^2\) conocidas</td><td>\(\sigma_t\)</td><td>Peso \(1/\sigma_t^2\) en cada observación</td></tr>
<tr><td>AR(1) con \(\rho\)</td><td>Cuasi-diferencias</td><td>\(Y_t-\rho Y_{t-1}=\beta_1(1-\rho)+\beta_2(X_t-\rho X_{t-1})+\varepsilon_t\)</td></tr></table></div>`},
{k:"Parcial",t:"Errores típicos",html:String.raw`<ul><li>Dividir por \(X_t\) cuando la varianza es \(\sigma^2X_t\): se divide por la desviación estándar, \(\sqrt{X_t}\). En la fórmula matricial \(\Omega^{-1}\) sí lleva \(1/X_t\), porque \(P'P=\Omega^{-1}\).</li>
<li>Dejar intercepto en el modelo transformado: la constante se volvió el regresor \(1/\sqrt{X_t}\).</li>
<li>Calcular la RSS con los residuos sin ponderar: es \(\sum e_t^2/X_t\).</li>
<li>Confundir \(\hat\sigma^2=RSS/n\) (máxima verosimilitud) con \(s^2=RSS/(n-k)\) (insesgado).</li>
<li>Comparar el \(R^2\) de MCG con el de MCO: están en variables distintas.</li>
<li>Redondear la inversa a pocos decimales.</li></ul>
<p class="hint">Otra convención, en algunos textos, centra la TSS con la media ponderada \(\sum(Y_t/X_t)/\sum(1/X_t)=134{,}23\): da TSS = 218,73 y ESS = 194,37, con la misma RSS. En el curso se usa la de \(\overline{Py}\).</p>`},
{k:"R",t:"Verificación en R",html:String.raw`<pre class="code"><code>y &lt;- c(120, 130, 150, 160, 180, 200)
x &lt;- c(4, 25, 30, 36, 40, 49)
X &lt;- cbind(1, x);  Oi &lt;- diag(1/x);  O &lt;- diag(x)
A &lt;- solve(t(X) %*% Oi %*% X)                 # (X'Ω⁻¹X)⁻¹
b_mcg &lt;- A %*% t(X) %*% Oi %*% y              # 112.382282  1.444056
e &lt;- y - X %*% b_mcg
RSS &lt;- t(e) %*% Oi %*% e                      # 24.35697
Py &lt;- y / sqrt(x);  TSS &lt;- sum(Py^2) - 6 * mean(Py)^2   # 889.7064
B &lt;- solve(t(X) %*% X)
B %*% t(X) %*% O %*% X %*% B                  # 11.1058087 ... 0.01724389
summary(lm(y ~ x, weights = 1/x))             # MCG directo</code></pre>`}],
qs:[{q:"Con var(uₜ) = σ²Xₜ, escriba X′Ω⁻¹X y X′Ω⁻¹y para Yₜ = β₁ + β₂Xₜ + uₜ.",a:"X′Ω⁻¹X = [Σ1/Xₜ, n; n, ΣXₜ] y X′Ω⁻¹y = [ΣYₜ/Xₜ; ΣYₜ]."},
{q:"¿Cómo se define la TSS por MCG en el curso y cuánto da en el ejemplo?",a:"TSS = y′Ω⁻¹y − n·(media de Py)², con Py = Yₜ/√Xₜ: 7.363,4376 − 6.473,7313 = 889,7064."},
{q:"¿Qué diferencia hay entre σ̂² = RSS/n y s² = RSS/(n − k)?",a:"RSS/n es el estimador de máxima verosimilitud (sesgado): 4,059495. RSS/(n − k) es insesgado y es el que se usa para errores estándar: 6,089242."},
{q:"¿Por qué Var(b_MCO) no es σ²(X′X)⁻¹ en este modelo?",a:"Porque Var(u) = σ²Ω ≠ σ²I. La varianza verdadera es σ²(X′X)⁻¹X′ΩX(X′X)⁻¹."},
{q:"Si Var(uᵢ) = σ²xᵢ², ¿qué transformación aplica MCP?",a:"Dividir toda la ecuación por xᵢ: la nueva perturbación uᵢ/xᵢ tiene varianza constante σ²."}]}]);
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
