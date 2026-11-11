// Econometría II · contenido de la ruta (programa 1504111)
// =====================================================================
// CONTENIDO: Econometría II (1504111, U. de Antioquia): series de tiempo univariadas,
// multivariadas y datos de panel. Bibliografía: Johnston y DiNardo; Kirchgässner y Wolters; Lütkepohl y Krätzig.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const U1="Unidad 1 · Series de tiempo univariadas",U2="Unidad 2 · Series de tiempo multivariadas",U3="Unidad 3 · Datos de panel";
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"estacionariedad", parte:U1, t:"Estacionariedad y ruido blanco", sim:"proc", html:String.raw`
<section><h3>Procesos estocásticos</h3><p class="lead">Una serie de tiempo \(y_1,\dots,y_T\) es una realización de un <b>proceso estocástico</b>: una sucesión de variables aleatorias indexadas por el tiempo. Como solo observamos una realización, necesitamos supuestos que permitan aprender del pasado: el principal es la <b>estacionariedad</b>.</p></section>
<section><h3>Estacionariedad débil (en covarianza)</h3><div class="mj">\[E(y_t)=\mu\qquad Var(y_t)=\gamma_0<\infty\qquad Cov(y_t,y_{t-k})=\gamma_k\ \text{(solo depende de }k)\]</div>
<p>Media y varianza constantes, y covarianzas que dependen solo de la distancia entre periodos. La estacionariedad <b>estricta</b> exige que toda la distribución conjunta sea invariante en el tiempo.</p></section>
<section><h3>Ruido blanco</h3><p>\(\varepsilon_t\) es ruido blanco si \(E(\varepsilon_t)=0\), \(Var(\varepsilon_t)=\sigma^2\) y \(Cov(\varepsilon_t,\varepsilon_s)=0\) para \(t\ne s\). Es el bloque con el que se construyen todos los modelos ARMA; si además es normal, es <b>ruido blanco gaussiano</b> (independiente).</p></section>
<section><h3>Lo que no es estacionario</h3><ul><li><b>Paseo aleatorio:</b> \(y_t=y_{t-1}+\varepsilon_t\). Su varianza \(t\sigma^2\) crece con el tiempo.</li><li><b>Tendencia determinística:</b> \(y_t=\alpha+\beta t+\varepsilon_t\). La media cambia con \(t\).</li></ul></section>
${LAB}`,
qs:[{q:"¿Es estacionario y_t = y_(t−1) + ε_t?",a:"No: Var(y_t) = Var(y_0) + tσ², que crece con t."}]},

{id:"acf", parte:U1, t:"Funciones de autocorrelación simple y parcial", sim:"acf", html:String.raw`
<section><h3>Autocorrelación simple (FAS o ACF)</h3><div class="mj">\[\rho_k=\frac{\gamma_k}{\gamma_0}\qquad \hat\rho_k=\frac{\sum_{t=k+1}^{T}(y_t-\bar y)(y_{t-k}-\bar y)}{\sum_{t=1}^{T}(y_t-\bar y)^2}\]</div>
<p>Mide la correlación entre \(y_t\) y \(y_{t-k}\) incluyendo los efectos que pasan por los rezagos intermedios.</p></section>
<section><h3>Autocorrelación parcial (FAP o PACF)</h3><p>\(\phi_{kk}\) es el último coeficiente de la regresión de \(y_t\) sobre \(y_{t-1},\dots,y_{t-k}\): la correlación entre \(y_t\) y \(y_{t-k}\) <b>descontando</b> los rezagos intermedios. Se calcula con la recursión de Durbin-Levinson.</p></section>
<section><h3>Bandas y pruebas conjuntas</h3><p>Si la serie es ruido blanco, \(\hat\rho_k\approx N(0,1/T)\): las barras fuera de \(\pm1{,}96/\sqrt T\) son significativas al 5 %. Para probar varias a la vez se usa Ljung-Box:</p>
<div class="mj">\[Q=T(T+2)\sum_{k=1}^{m}\frac{\hat\rho_k^2}{T-k}\ \sim\ \chi^2_{m}\]</div></section>
${LAB}`,
qs:[{q:"Con T = 100, ¿desde qué valor es significativa una autocorrelación al 5 %?",a:"1,96/√100 = 0,196 en valor absoluto."}]},

{id:"arma", parte:U1, t:"Procesos AR, MA y ARMA", sim:"arma", html:String.raw`
<section><h3>Definiciones</h3><div class="mj">\[\text{AR}(p):\ y_t=c+\phi_1y_{t-1}+\dots+\phi_py_{t-p}+\varepsilon_t\qquad \text{MA}(q):\ y_t=\mu+\varepsilon_t+\theta_1\varepsilon_{t-1}+\dots+\theta_q\varepsilon_{t-q}\]</div>
<p>Con el operador de rezagos \(L\) (\(Ly_t=y_{t-1}\)): \(\phi(L)y_t=c+\theta(L)\varepsilon_t\), que es un ARMA(p, q).</p></section>
<section><h3>Estacionariedad e invertibilidad</h3><ul><li>Un AR es <b>estacionario</b> si las raíces de \(\phi(z)=0\) están fuera del círculo unitario (equivalente: las raíces inversas tienen módulo menor que 1). AR(1): \(|\phi_1|<1\). AR(2): \(\phi_1+\phi_2<1\), \(\phi_2-\phi_1<1\), \(|\phi_2|<1\).</li><li>Un MA siempre es estacionario; es <b>invertible</b> (se puede escribir como AR(∞)) si las raíces de \(\theta(z)=0\) están fuera del círculo unitario.</li></ul></section>
<section><h3>Patrones para identificar</h3><div class="tbl"><table><tr><th>Modelo</th><th>FAS</th><th>FAP</th></tr><tr><td>AR(p)</td><td>Decae (exponencial o sinusoidal)</td><td>Se corta después del rezago p</td></tr><tr><td>MA(q)</td><td>Se corta después del rezago q</td><td>Decae</td></tr><tr><td>ARMA(p, q)</td><td>Decae desde el rezago q</td><td>Decae desde el rezago p</td></tr></table></div>
<p>Momentos útiles: AR(1): \(\mu=c/(1-\phi)\), \(\gamma_0=\sigma^2/(1-\phi^2)\), \(\rho_k=\phi^k\). MA(1): \(\rho_1=\theta/(1+\theta^2)\), \(\rho_k=0\) para \(k\ge2\).</p></section>
${LAB}`,
qs:[{q:"¿Es estacionario y_t = 1,2y_(t−1) − 0,5y_(t−2) + ε_t?",a:"φ₁ + φ₂ = 0,7 < 1, φ₂ − φ₁ = −1,7 < 1, |φ₂| = 0,5 < 1: sí. Las raíces inversas son complejas con módulo √0,5 ≈ 0,71."}]},

{id:"estimacion", parte:U1, t:"Estimación, identificación y diagnóstico", sim:"est", html:String.raw`
<section><h3>Metodología de Box-Jenkins</h3><ol><li><b>Identificación:</b> transformar la serie hasta hacerla estacionaria (logaritmos, diferencias) y proponer órdenes \(p,q\) con la FAS y la FAP.</li><li><b>Estimación:</b> un AR puro se estima por MCO; con componente MA se usa máxima verosimilitud.</li><li><b>Diagnóstico:</b> los residuos deben ser ruido blanco (Ljung-Box con \(m-p-q\) grados de libertad), con varianza constante y, idealmente, normales (Jarque-Bera).</li><li><b>Pronóstico.</b></li></ol></section>
<section><h3>Criterios de información</h3><div class="mj">\[AIC=-2\ln L+2k\qquad BIC=-2\ln L+k\ln T\]</div><p>Se elige el modelo con menor criterio, comparando todos con la <b>misma muestra</b>. El BIC penaliza más los parámetros y tiende a elegir modelos más pequeños; el AIC tiende a sobreparametrizar pero predice bien.</p></section>
${LAB}`,
qs:[{q:"Si los residuos de un AR(1) tienen Ljung-Box con p-valor 0,001, ¿qué haces?",a:"Los residuos no son ruido blanco: falta dinámica. Se prueba un orden mayor o un componente MA."}]},

{id:"noestacionarios", parte:U1, t:"Tendencias determinísticas y estocásticas", sim:"tend", html:String.raw`
<section><h3>Dos tipos de no estacionariedad</h3><div class="mj">\[\text{TS:}\ y_t=\alpha+\beta t+u_t\qquad\qquad \text{DS:}\ y_t=\beta+y_{t-1}+\varepsilon_t=y_0+\beta t+\sum_{s=1}^{t}\varepsilon_s\]</div>
<p>En la <b>tendencia determinística</b> (estacionaria en tendencia, TS) los choques son transitorios: la serie vuelve a la recta. En la <b>tendencia estocástica</b> (estacionaria en diferencias, DS: paseo aleatorio con deriva) cada choque es permanente. Se elimina la primera restando la tendencia y la segunda diferenciando: aplicar el tratamiento equivocado deja problemas (diferenciar una TS crea un MA no invertible; quitar la tendencia a una DS deja una raíz unitaria).</p></section>
<section><h3>Integración y ARIMA</h3><p>Una serie es <b>integrada de orden d</b>, I(d), si hay que diferenciarla d veces para que sea estacionaria. Si \(\Delta^d y_t\) es ARMA(p, q), entonces \(y_t\) es ARIMA(p, d, q).</p></section>
<section><h3>Regresión espuria</h3><p>Granger y Newbold (1974): al regresar un paseo aleatorio sobre otro <b>independiente</b>, el \(R^2\) suele ser alto y el estadístico t rechaza casi siempre. La señal de alarma es un \(R^2\) mayor que el Durbin-Watson. La solución es diferenciar o comprobar si hay cointegración (Unidad 2).</p></section>
${LAB}`,
qs:[{q:"¿Qué tipo de tendencia implica que un choque tenga efecto permanente?",a:"La estocástica (raíz unitaria)."}]},

{id:"estacionales", parte:U1, t:"Procesos estacionales", sim:"seas", html:String.raw`
<section><h3>Estacionalidad</h3><p class="lead">Muchas series (ventas, turismo, producción agrícola) repiten un patrón cada \(s\) periodos: \(s=12\) en datos mensuales, \(s=4\) trimestrales. En la FAS aparecen picos en los rezagos \(s,2s,3s,\dots\)</p>
<ul><li><b>Determinística:</b> medias distintas por estación; se modela con variables dicótomas estacionales.</li><li><b>Estocástica:</b> se elimina con la <b>diferencia estacional</b> \(\Delta_s y_t=y_t-y_{t-s}=(1-L^s)y_t\).</li></ul></section>
<section><h3>SARIMA</h3><div class="mj">\[\text{ARIMA}(p,d,q)\times(P,D,Q)_s:\quad \phi(L)\Phi(L^s)\Delta^d\Delta_s^D y_t=\theta(L)\Theta(L^s)\varepsilon_t\]</div>
<p>El modelo «aerolínea» ARIMA(0,1,1)×(0,1,1)\(_{12}\) es el clásico para series mensuales con tendencia y estacionalidad. Para probar raíces unitarias estacionales se usa la prueba HEGY.</p></section>
${LAB}`,
qs:[{q:"¿Qué operador elimina una estacionalidad estocástica trimestral?",a:"Δ₄ = 1 − L⁴: y_t − y_(t−4)."}]},

{id:"raices", parte:U1, t:"Raíces unitarias: Dickey-Fuller, Phillips-Perron y KPSS", sim:"adf", html:String.raw`
<section><h3>Dickey-Fuller aumentada (ADF)</h3><div class="mj">\[\Delta y_t=\alpha+\beta t+\gamma y_{t-1}+\sum_{i=1}^{k}\delta_i\Delta y_{t-i}+\varepsilon_t\qquad H_0:\gamma=0\ (\text{raíz unitaria})\quad H_1:\gamma<0\]</div>
<p>El estadístico \(\tau=\hat\gamma/se(\hat\gamma)\) <b>no sigue una t</b> bajo \(H_0\): se compara con los valores críticos de Dickey-Fuller (MacKinnon), que dependen de si se incluye constante, constante y tendencia, o nada. Se rechaza la raíz unitaria si \(\tau\) es <b>más negativo</b> que el crítico. Los rezagos \(\Delta y_{t-i}\) limpian la autocorrelación; se eligen con AIC o BIC.</p>
<div class="tbl"><table><tr><th>Especificación</th><th>Crítico 5 % (T grande)</th><th>Cuándo usarla</th></tr><tr><td>Sin constante</td><td>−1,94</td><td>Series sin media (residuos)</td></tr><tr><td>Constante</td><td>−2,86</td><td>Series sin tendencia</td></tr><tr><td>Constante y tendencia</td><td>−3,41</td><td>Series con tendencia</td></tr></table></div></section>
<section><h3>Phillips-Perron (PP)</h3><p>Usa la regresión DF sin rezagos y corrige el estadístico de forma no paramétrica por autocorrelación y heterocedasticidad (varianza de largo plazo de Newey-West). Mismos valores críticos que la ADF.</p></section>
<section><h3>KPSS</h3><p>Invierte las hipótesis: \(H_0\) es <b>estacionariedad</b> (en nivel o en tendencia). Se rechaza si el estadístico supera el crítico (0,463 al 5 % en nivel; 0,146 en tendencia). Usar ADF y KPSS juntas: si ADF no rechaza y KPSS rechaza, hay evidencia clara de raíz unitaria.</p></section>
${LAB}`,
qs:[{q:"ADF con constante da τ = −2,1. ¿Hay raíz unitaria al 5 %?",a:"No se rechaza H₀: −2,1 > −2,86. La serie se trata como I(1)."}]},

{id:"pronostico", parte:U1, t:"Pronósticos", sim:"fc", html:String.raw`
<section><h3>Pronóstico óptimo</h3><p>El pronóstico que minimiza el error cuadrático medio es la esperanza condicional \(\hat y_{T+h|T}=E(y_{T+h}\mid y_T,y_{T-1},\dots)\). Para un AR(1): \(\hat y_{T+h}=\mu+\phi^h(y_T-\mu)\), que converge a la media.</p>
<p>El error de pronóstico se escribe con los pesos \(\psi_j\) de la representación MA(∞):</p>
<div class="mj">\[Var(e_{T+h})=\sigma^2\sum_{j=0}^{h-1}\psi_j^2\qquad \text{intervalo 95 \%}:\ \hat y_{T+h}\pm1{,}96\sqrt{Var(e_{T+h})}\]</div>
<p>En una serie estacionaria el intervalo converge a uno de ancho fijo; en un paseo aleatorio crece sin límite. Para evaluar pronósticos fuera de muestra se usan RMSE, MAE y MAPE.</p></section>
${LAB}`,
qs:[{q:"En un AR(1) con μ = 10, φ = 0,5 y y_T = 14, ¿cuánto vale el pronóstico a 2 pasos?",a:"10 + 0,5²·4 = 11."}]},

{id:"arch", parte:U1, t:"Heterocedasticidad condicional: ARCH y GARCH", sim:"garch", html:String.raw`
<section><h3>Volatilidad que se agrupa</h3><p class="lead">En series financieras los periodos de alta volatilidad se agrupan: los residuos no están autocorrelacionados, pero sus <b>cuadrados</b> sí. Engle (1982) propuso modelar la varianza condicional.</p>
<div class="mj">\[\varepsilon_t=\sigma_tz_t,\ z_t\sim N(0,1)\qquad \text{ARCH}(q):\ \sigma_t^2=\omega+\sum_{i=1}^{q}\alpha_i\varepsilon_{t-i}^2\qquad \text{GARCH}(1,1):\ \sigma_t^2=\omega+\alpha\varepsilon_{t-1}^2+\beta\sigma_{t-1}^2\]</div>
<p>Condiciones: \(\omega>0\), \(\alpha,\beta\ge0\) y \(\alpha+\beta<1\) para que la varianza incondicional \(\omega/(1-\alpha-\beta)\) exista. La suma \(\alpha+\beta\) mide la <b>persistencia</b> de la volatilidad.</p></section>
<section><h3>Prueba y estimación</h3><p><b>Prueba ARCH-LM:</b> regresar \(\hat\varepsilon_t^2\) sobre una constante y \(q\) rezagos; \(LM=TR^2\sim\chi^2_q\). La estimación es por máxima verosimilitud (ML); si los errores no son normales, por cuasi máxima verosimilitud (QML) con errores estándar robustos.</p></section>
${LAB}`,
qs:[{q:"Si α = 0,1 y β = 0,85 con ω = 0,05, ¿cuál es la varianza incondicional?",a:"0,05/(1 − 0,95) = 1."}]},

// ===================== UNIDAD 2 =====================
{id:"var", parte:U2, t:"Modelos VAR", sim:"var", html:String.raw`
<section><h3>El VAR(p)</h3><div class="mj">\[\mathbf y_t=\mathbf c+A_1\mathbf y_{t-1}+\dots+A_p\mathbf y_{t-p}+\mathbf u_t,\qquad E(\mathbf u_t\mathbf u_t')=\Sigma_u\]</div>
<p>Cada variable depende de sus rezagos y de los de las demás. Sims (1980) lo propuso como alternativa a los modelos estructurales. Se estima <b>por MCO ecuación por ecuación</b> (eficiente porque todas tienen los mismos regresores).</p></section>
<section><h3>Propiedades e interpretación</h3><ul><li><b>Estabilidad:</b> todos los valores propios de la matriz compañera con módulo menor que 1.</li><li><b>Longitud del rezago:</b> por AIC, HQ o SC (BIC) sobre una muestra común: \(\ln|\hat\Sigma_u|+\text{penalización}\cdot pK^2/T\).</li><li><b>Causalidad de Granger:</b> \(x\) causa en el sentido de Granger a \(y\) si los rezagos de \(x\) ayudan a predecir \(y\) (prueba F de exclusión).</li><li><b>Funciones impulso-respuesta:</b> efecto de un choque en una variable sobre las demás a lo largo del tiempo. Con choques ortogonalizados por Cholesky, el <b>orden</b> de las variables importa.</li><li><b>Descomposición de varianza:</b> qué parte del error de pronóstico se debe a cada choque.</li></ul></section>
${LAB}`,
qs:[{q:"¿Por qué importa el orden de las variables en el impulso-respuesta de Cholesky?",a:"Porque la primera variable no responde contemporáneamente a los choques de las siguientes; cambiar el orden cambia esa restricción."}]},

{id:"cointegracion", parte:U2, t:"Cointegración y mecanismo de corrección de errores", sim:"eg", html:String.raw`
<section><h3>Definición</h3><p class="lead">Dos series I(1) están <b>cointegradas</b> si existe una combinación lineal \(y_t-\beta x_t\) que es I(0). Económicamente: hay un equilibrio de largo plazo (consumo e ingreso, precios en dos mercados, tasas de interés) del que las series se separan solo de forma transitoria.</p></section>
<section><h3>Teorema de representación de Granger</h3><p>Si las series están cointegradas, existe un <b>modelo de corrección de errores</b> (MCE):</p><div class="mj">\[\Delta y_t=c+\alpha(y_{t-1}-\beta x_{t-1})+\sum\gamma_i\Delta y_{t-i}+\sum\delta_i\Delta x_{t-i}+u_t\]</div>
<p>\(\alpha<0\) es la <b>velocidad de ajuste</b>: qué fracción del desequilibrio se corrige en cada periodo.</p></section>
<section><h3>Método de Engle-Granger en dos etapas</h3><ol><li>Verificar que ambas series sean I(1).</li><li>Estimar por MCO \(y_t=a+\beta x_t+e_t\) (estimador superconsistente).</li><li>Aplicar ADF sin constante a \(\hat e_t\) con los <b>valores críticos de Engle-Granger</b> (5 %: −3,34 con dos variables), más exigentes que los de DF porque \(\hat\beta\) se estimó.</li><li>Si hay cointegración, estimar el MCE usando \(\hat e_{t-1}\).</li></ol></section>
${LAB}`,
qs:[{q:"¿Por qué los críticos de Engle-Granger son más negativos que los de Dickey-Fuller?",a:"Porque MCO elige β para que los residuos parezcan lo más estacionarios posible, lo que sesga la prueba hacia el rechazo."}]},

{id:"johansen", parte:U2, t:"VEC y prueba de Johansen", sim:"joh", html:String.raw`
<section><h3>El modelo VEC</h3><div class="mj">\[\Delta\mathbf y_t=\mathbf c+\Pi\mathbf y_{t-1}+\sum_{i=1}^{p-1}\Gamma_i\Delta\mathbf y_{t-i}+\mathbf u_t,\qquad \Pi=\alpha\beta'\]</div>
<p>El <b>rango</b> de \(\Pi\) es el número de relaciones de cointegración \(r\): si \(r=0\), VAR en diferencias; si \(r=K\), las series son estacionarias; si \(0&lt;r&lt;K\), hay \(r\) vectores de cointegración (columnas de \(\beta\)) y \(\alpha\) contiene las velocidades de ajuste.</p></section>
<section><h3>Prueba de Johansen</h3><p>Se estiman por máxima verosimilitud los valores propios \(\hat\lambda_1>\dots>\hat\lambda_K\) de un problema de correlaciones canónicas entre \(\Delta\mathbf y_t\) y \(\mathbf y_{t-1}\):</p>
<div class="mj">\[\lambda_{traza}(r)=-T\sum_{i=r+1}^{K}\ln(1-\hat\lambda_i)\qquad \lambda_{max}(r)=-T\ln(1-\hat\lambda_{r+1})\]</div>
<p>Se prueba secuencialmente \(H_0:r=0\), luego \(r\le1\), … y se detiene en la primera que no se rechaza. Los valores críticos (Osterwald-Lenum) dependen de cómo entran la constante y la tendencia. Ventaja frente a Engle-Granger: detecta varios vectores y no depende de qué variable se normaliza.</p></section>
${LAB}`,
qs:[{q:"Con K = 2, la traza para r = 0 es 30 y para r ≤ 1 es 3. ¿Cuántos vectores hay?",a:"Se rechaza r = 0 (30 > 17,95) y no r ≤ 1 (3 < 8,18): un vector de cointegración."}]},

// ===================== UNIDAD 3 =====================
{id:"panel", parte:U3, t:"Datos de panel: efectos fijos y aleatorios", sim:"panel", html:String.raw`
<section><h3>El modelo</h3><div class="mj">\[y_{it}=\mathbf x_{it}'\beta+\alpha_i+u_{it},\qquad i=1,\dots,N,\ t=1,\dots,T\]</div>
<p>\(\alpha_i\) es la <b>heterogeneidad no observada</b> de cada individuo (habilidad, cultura, geografía), constante en el tiempo. Lo que se suponga sobre ella define el estimador.</p></section>
<section><h3>Estimadores</h3><ul><li><b>MCO agrupado:</b> ignora \(\alpha_i\). Sesgado si \(\alpha_i\) está correlacionado con \(\mathbf x_{it}\).</li><li><b>Efectos fijos (within):</b> resta la media de cada individuo, \(y_{it}-\bar y_i=(\mathbf x_{it}-\bar{\mathbf x}_i)'\beta+(u_{it}-\bar u_i)\), y elimina \(\alpha_i\). Consistente aunque \(\alpha_i\) se correlacione con \(\mathbf x\); no estima efectos de variables constantes en el tiempo. Equivale a MCO con una dicótoma por individuo (LSDV).</li><li><b>Efectos aleatorios:</b> supone \(\alpha_i\) no correlacionado con \(\mathbf x\) y lo trata como parte del error. MCG factibles con cuasi-diferencias \(y_{it}-\theta\bar y_i\), donde \(\theta=1-\sqrt{\sigma_u^2/(T\sigma_\alpha^2+\sigma_u^2)}\) (Swamy-Arora). Más eficiente si el supuesto se cumple.</li></ul></section>
<section><h3>Pruebas</h3><ul><li><b>F de efectos individuales:</b> agrupado frente a efectos fijos.</li><li><b>LM de Breusch-Pagan:</b> agrupado frente a efectos aleatorios (\(H_0:\sigma_\alpha^2=0\)).</li><li><b>Hausman:</b> \(H=(\hat\beta_{FE}-\hat\beta_{RE})'[V_{FE}-V_{RE}]^{-1}(\hat\beta_{FE}-\hat\beta_{RE})\sim\chi^2_k\). Si se rechaza, los efectos aleatorios son inconsistentes y se usan fijos.</li><li>Heterocedasticidad y autocorrelación: pruebas de Wald modificada y de Wooldridge; se corrigen con errores estándar agrupados por individuo (cluster).</li></ul></section>
${LAB}`,
qs:[{q:"Hausman da χ² = 25 con 2 grados de libertad. ¿Qué estimador usas?",a:"Efectos fijos: se rechaza que las diferencias sean solo aleatorias (crítico 5,99), así que efectos aleatorios es inconsistente."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[{id:"formulas",t:"Hoja de fórmulas y código R",anchor:"panel",links:["acf","raices","var","johansen","panel"],sim:"hoja",html:WSBOX,d:"Las fórmulas del curso con la función de R que las calcula."}];
const ALIAS={};
