
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
<p>Si \(\Omega=PP'\), transformar el modelo con \(P^{-1}\) devuelve perturbaciones esféricas, y aplicar MCO al modelo transformado da</p>
<div class="mj">\[\hat\beta_{MCG}=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\qquad V(\hat\beta_{MCG})=\sigma^2(X'\Omega^{-1}X)^{-1}\]</div>
<p>Por el teorema de Aitken, MCG es MELI en el modelo generalizado; con normalidad coincide con el estimador de máxima verosimilitud. Casos: <b>mínimos cuadrados ponderados</b> (\(\Omega\) diagonal, se divide cada observación por \(\sigma_i\)) y la transformación de <b>Cochrane-Orcutt o Prais-Winsten</b> con autocorrelación AR(1).</p>
<p>En la práctica \(\Omega\) es desconocida: <b>MCG factibles</b> la estiman en una primera etapa. La alternativa es mantener MCO y usar errores estándar robustos (White, Newey-West).</p></section>
${LABX("¿cuánto gana MCG?")}`,
qs:[{q:"Si Var(uᵢ) = σ²xᵢ², ¿qué transformación aplica MCP?",a:"Dividir toda la ecuación por xᵢ: la nueva perturbación uᵢ/xᵢ tiene varianza constante σ²."}]}]);
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
