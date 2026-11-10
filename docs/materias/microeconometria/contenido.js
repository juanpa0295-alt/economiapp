// Microeconometría · contenido de la ruta (programa 1503810)
// =====================================================================
// CONTENIDO: Opción III · Microeconometría (1503810, U. de Antioquia).
// Referencias estándar: Cameron y Trivedi (2005), Wooldridge (2010), Greene, Hayashi (2000), Baltagi.
// =====================================================================
const GUIA_ID="mi";
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={1:"Unidad 1 · Modelo clásico",2:"Unidad 2 · GMM y variables instrumentales",3:"Unidad 3 · Datos de panel",4:"Unidad 4 · Elección discreta",5:"Unidad 5 · Variable dependiente limitada"};
const P1="Unidad 1 · El modelo clásico de regresión lineal",P2="Unidad 2 · Método generalizado de momentos",P3="Unidad 3 · Modelos para datos de panel",P4="Unidad 4 · Modelos de elección discreta",P5="Unidad 5 · Variable dependiente limitada y duración";
const TRUNK=[
{id:"mco", parte:P1, u:1, t:"El modelo clásico y las propiedades de MCO", sim:"mco", html:String.raw`
<section><h3>Supuestos</h3><p class="lead">\(y=X\beta+\varepsilon\). Supuestos clásicos: (1) linealidad en parámetros; (2) rango completo de \(X\); (3) exogeneidad estricta \(E[\varepsilon|X]=0\); (4) perturbaciones esféricas \(Var[\varepsilon|X]=\sigma^2I\); (5) para inferencia exacta, normalidad.</p>
<div class="mj">\[\hat\beta=(X'X)^{-1}X'y\qquad Var(\hat\beta|X)=\sigma^2(X'X)^{-1}\qquad s^2=\frac{e'e}{n-k}\]</div></section>
<section><h3>Muestras finitas y grandes muestras</h3><ul><li><b>Muestras finitas</b>: con (1)–(3), MCO es insesgado; con (4), es el mejor estimador lineal insesgado (Gauss-Markov); con (5), los estadísticos \(t\) y \(F\) tienen distribución exacta.</li><li><b>Grandes muestras</b>: basta \(E[x_i\varepsilon_i]=0\) para que MCO sea <b>consistente</b>, y por el teorema central del límite \(\sqrt n(\hat\beta-\beta)\) es asintóticamente normal, sin necesidad de normalidad.</li><li>Con <b>heterocedasticidad</b>, MCO sigue siendo consistente pero el error estándar clásico está mal: se usa la matriz robusta de White (sándwich) \((X'X)^{-1}\left(\sum e_i^2x_ix_i'\right)(X'X)^{-1}\).</li></ul></section>
${LAB}`},

{id:"iv", parte:P2, u:2, t:"Endogeneidad, variables instrumentales y MC2E", sim:"iv", html:String.raw`
<section><h3>El método de momentos y el principio de analogía</h3><p class="lead">Un estimador de momentos reemplaza una condición poblacional \(E[g(w_i,\beta)]=0\) por su análogo muestral \(\frac1n\sum g(w_i,\hat\beta)=0\). MCO resuelve \(E[x_i(y_i-x_i'\beta)]=0\).</p></section>
<section><h3>Endogeneidad</h3><p>Si \(E[x_i\varepsilon_i]\neq0\) (variables omitidas, error de medición, simultaneidad), MCO es inconsistente. Un <b>instrumento</b> \(z\) debe ser <b>relevante</b> (\(Cov(z,x)\neq0\)) y <b>exógeno</b> (\(Cov(z,\varepsilon)=0\)). Con un regresor y un instrumento:</p>
<div class="mj">\[\hat\beta_{VI}=\frac{\sum(z_i-\bar z)(y_i-\bar y)}{\sum(z_i-\bar z)(x_i-\bar x)}\]</div>
<p><b>MC2E</b>: primera etapa, regresar \(x\) sobre \(Z\) y obtener \(\hat x\); segunda etapa, regresar \(y\) sobre \(\hat x\): \(\hat\beta_{2SLS}=(X'P_ZX)^{-1}X'P_Zy\). Los errores estándar se calculan con los residuos \(y-X\hat\beta\), no con los de la segunda etapa.</p>
<p><b>Instrumentos débiles</b>: si la primera etapa es débil (estadístico F menor que 10, regla de Staiger y Stock), MC2E está sesgado hacia MCO y su distribución no es normal.</p></section>
${LAB}`},

{id:"gmm", parte:P2, u:2, t:"GMM: formulación general y sobreidentificación", sim:"gmm", html:String.raw`
<section><h3>Formulación general</h3><p class="lead">Con \(L\) condiciones de momento y \(K\) parámetros (\(L\geq K\)), GMM minimiza una forma cuadrática:</p>
<div class="mj">\[\hat\beta_{GMM}=\arg\min\ \bar g(\beta)'\,W\,\bar g(\beta),\qquad \bar g(\beta)=\frac1n\sum z_i(y_i-x_i'\beta)\]</div>
<p>Solución lineal: \(\hat\beta=(X'ZWZ'X)^{-1}X'ZWZ'y\). Con \(W=(Z'Z)^{-1}\) se obtiene MC2E. MCO y MCG son casos particulares.</p></section>
<section><h3>Matriz de ponderación óptima</h3><p>La varianza asintótica es mínima con \(W=S^{-1}\), donde \(S=E[\varepsilon_i^2z_iz_i']\). En dos etapas: estimar por MC2E, calcular \(\hat S=\frac1n\sum e_i^2z_iz_i'\) y volver a estimar. GMM es consistente y asintóticamente normal; con heterocedasticidad es más eficiente que MC2E.</p></section>
<section><h3>Prueba de sobreidentificación</h3><p>Si \(L>K\), sobran condiciones y se puede probar si son compatibles. El estadístico \(J\) de Hansen:</p>
<div class="mj">\[J=n\,\bar g(\hat\beta)'\hat S^{-1}\bar g(\hat\beta)\ \sim\ \chi^2_{L-K}\]</div>
<p>Un \(J\) grande indica que al menos un instrumento no es exógeno (pero no dice cuál). Con homocedasticidad equivale a la prueba de Sargan.</p></section>
${LAB}`},

{id:"panel", parte:P3, u:3, t:"Efectos fijos, efectos aleatorios y Hausman", sim:"panel", html:String.raw`
<section><h3>El modelo</h3><p class="lead">\(y_{it}=x_{it}'\beta+\alpha_i+\varepsilon_{it}\), con \(\alpha_i\) un efecto individual no observado.</p><ul><li><b>MCO agrupado</b>: ignora \(\alpha_i\); inconsistente si \(\alpha_i\) está correlacionado con \(x_{it}\).</li><li><b>Efectos fijos</b> (within): resta las medias de cada individuo y elimina \(\alpha_i\). Consistente aunque \(\alpha_i\) esté correlacionado con \(x\); no estima el efecto de variables constantes en el tiempo.</li><li><b>Efectos aleatorios</b>: supone \(Cov(\alpha_i,x_{it})=0\) y usa MCG con transformación cuasi-media \(y_{it}-\theta\bar y_i\), con \(\theta=1-\sqrt{\sigma^2_\varepsilon/(\sigma^2_\varepsilon+T\sigma^2_\alpha)}\). Es más eficiente si el supuesto se cumple.</li></ul></section>
<section><h3>Pruebas</h3><ul><li><b>F de efectos individuales</b>: agrupado frente a efectos fijos.</li><li><b>LM de Breusch-Pagan</b>: agrupado frente a efectos aleatorios (\(H_0:\sigma^2_\alpha=0\)).</li><li><b>Hausman</b>: \(H=(\hat\beta_{FE}-\hat\beta_{RE})'[V_{FE}-V_{RE}]^{-1}(\hat\beta_{FE}-\hat\beta_{RE})\sim\chi^2_K\). Si se rechaza, los efectos aleatorios son inconsistentes y se prefieren los fijos.</li></ul>
<p><b>Hausman y Taylor</b> (1981) permiten estimar efectos de variables invariantes en el tiempo cuando algunas están correlacionadas con \(\alpha_i\), usando las medias de las exógenas como instrumentos. En <b>paneles no estacionarios</b> (T grande) se aplican pruebas de raíz unitaria de panel (Levin-Lin-Chu, Im-Pesaran-Shin) y de cointegración.</p></section>
${LAB}`},

{id:"dinamico", parte:P3, u:3, t:"Paneles dinámicos y Arellano-Bond", sim:"nickell", html:String.raw`
<section><h3>El sesgo de Nickell</h3><p class="lead">En \(y_{it}=\rho y_{i,t-1}+\alpha_i+\varepsilon_{it}\), el rezago está correlacionado con \(\alpha_i\) (por eso MCO agrupado sobreestima \(\rho\)) y, tras la transformación within, con la media de los errores (por eso efectos fijos subestima \(\rho\)). Con N grande y T fijo, el sesgo de efectos fijos es aproximadamente \(-(1+\rho)/(T-1)\) (Nickell, 1981): grave con T pequeño.</p></section>
<section><h3>Anderson-Hsiao y Arellano-Bond</h3><p>Primeras diferencias eliminan \(\alpha_i\): \(\Delta y_{it}=\rho\Delta y_{i,t-1}+\Delta\varepsilon_{it}\). Como \(\Delta y_{i,t-1}\) está correlacionado con \(\Delta\varepsilon_{it}\), se instrumenta con niveles rezagados: Anderson y Hsiao usan \(y_{i,t-2}\). <b>Arellano y Bond (1991)</b> usan todos los rezagos disponibles \(y_{i,t-2},y_{i,t-3},\dots\) como instrumentos en un GMM en diferencias, que gana eficiencia. Se verifica con la prueba de Sargan/Hansen y con la de autocorrelación de segundo orden en los errores diferenciados (debe no rechazarse). Blundell y Bond (1998) agregan las ecuaciones en niveles (GMM de sistema) cuando \(\rho\) está cerca de 1.</p></section>
${LAB}`},

{id:"binaria", parte:P4, u:4, t:"Elección binaria: lineal, probit y logit", sim:"binaria", html:String.raw`
<section><h3>Tres modelos</h3><p class="lead">\(y_i\in\{0,1\}\). El <b>modelo lineal de probabilidad</b> (MCO) es fácil de interpretar pero puede predecir probabilidades fuera de [0, 1] y es heterocedástico por construcción. Los modelos índice suponen una variable latente \(y^*=x'\beta+\varepsilon\) con \(y=1\) si \(y^*>0\):</p>
<div class="mj">\[P(y=1|x)=F(x'\beta)\qquad \text{probit: }F=\Phi\qquad\text{logit: }F=\Lambda(z)=\frac{e^z}{1+e^z}\]</div>
<p>Se estiman por <b>máxima verosimilitud</b>: \(\ln L=\sum[y_i\ln F_i+(1-y_i)\ln(1-F_i)]\).</p></section>
<section><h3>Interpretación</h3><ul><li>Los coeficientes no son efectos marginales: \(\partial P/\partial x_j=f(x'\beta)\beta_j\). Se reportan el <b>efecto marginal promedio</b> (AME) o en la media.</li><li>Los coeficientes del logit son aproximadamente 1,6 veces los del probit (por las varianzas distintas de los errores); los efectos marginales son parecidos.</li><li>En el logit, \(e^{\beta_j}\) es la razón de odds.</li><li>Bondad de ajuste: pseudo \(R^2\) de McFadden \(1-\ln L/\ln L_0\), porcentaje de aciertos. Pruebas: razón de verosimilitud \(LR=2(\ln L-\ln L_0)\sim\chi^2\).</li></ul><p><b>Panel</b>: el logit de efectos fijos condicional (Chamberlain) elimina \(\alpha_i\); el probit de efectos aleatorios integra sobre \(\alpha_i\). El probit de efectos fijos sufre el problema de los parámetros incidentales.</p></section>
${LAB}`},

{id:"tobit", parte:P5, u:5, t:"Truncamiento y censura: el modelo tobit", sim:"tobit", html:String.raw`
<section><h3>Truncar no es censurar</h3><p class="lead">Con datos <b>truncados</b> solo se observan los individuos con \(y>c\) (por ejemplo, una encuesta solo a quienes compraron). Con datos <b>censurados</b> se observan todos, pero \(y\) se registra como \(c\) cuando cae por debajo (gasto en bienes durables: muchos ceros). En ambos casos MCO está sesgado hacia cero.</p></section>
<section><h3>El tobit (Tobin, 1958)</h3><p>\(y^*=x'\beta+\varepsilon\), \(\varepsilon\sim N(0,\sigma^2)\), \(y=\max(0,y^*)\). La verosimilitud combina una parte probit para los ceros y una normal para los positivos:</p>
<div class="mj">\[\ln L=\sum_{y_i=0}\ln\left[1-\Phi\left(\frac{x_i'\beta}{\sigma}\right)\right]+\sum_{y_i>0}\left[\ln\phi\left(\frac{y_i-x_i'\beta}{\sigma}\right)-\ln\sigma\right]\]</div>
<p>Efectos marginales: sobre la latente es \(\beta_j\); sobre \(E[y|x]\) es \(\Phi(x'\beta/\sigma)\beta_j\). El tobit supone que la misma ecuación decide si se participa y cuánto; si no, se usan modelos de dos partes o de Cragg.</p></section>
${LAB}`},

{id:"heckman", parte:P5, u:5, t:"Selección muestral: el modelo de Heckman", sim:"heckman", html:String.raw`
<section><h3>El problema</h3><p class="lead">El salario solo se observa para quienes trabajan, y la decisión de trabajar depende de factores no observados correlacionados con el salario. La muestra de trabajadores no es aleatoria: MCO sobre ella está sesgado.</p></section>
<section><h3>El modelo y el método en dos etapas (Heckman, 1979)</h3><div class="mj">\[\text{selección: }s_i=1[z_i'\gamma+u_i>0]\qquad\text{resultado: }y_i=x_i'\beta+\varepsilon_i\ \text{ si } s_i=1\]</div><div class="mj">\[E[y_i|x_i,s_i=1]=x_i'\beta+\rho\sigma_\varepsilon\,\lambda(z_i'\gamma),\qquad\lambda(\cdot)=\frac{\phi(\cdot)}{\Phi(\cdot)}\]</div>
<p>(1) Probit de participación y cálculo del <b>inverso de la razón de Mills</b> \(\hat\lambda_i\). (2) MCO de \(y\) sobre \(x\) y \(\hat\lambda\) con los seleccionados. Si el coeficiente de \(\hat\lambda\) es significativo, hay sesgo de selección. Para una identificación creíble, \(z\) debe incluir al menos una variable que afecte la participación pero no el resultado (restricción de exclusión), por ejemplo el número de hijos pequeños.</p></section>
${LAB}`},

{id:"tratamiento", parte:P5, u:5, t:"Efectos de tratamiento", sim:"trat", html:String.raw`
<section><h3>Resultados potenciales</h3><p class="lead">Cada individuo tiene dos resultados potenciales: \(Y_1\) con tratamiento y \(Y_0\) sin él, pero solo se observa uno (Rubin). Parámetros: efecto promedio \(ATE=E[Y_1-Y_0]\) y efecto sobre los tratados \(ATT=E[Y_1-Y_0|D=1]\).</p>
<div class="mj">\[E[Y|D=1]-E[Y|D=0]=ATT+\underbrace{E[Y_0|D=1]-E[Y_0|D=0]}_{\text{sesgo de selección}}\]</div></section>
<section><h3>Estrategias de identificación</h3><ul><li><b>Asignación aleatoria</b>: elimina el sesgo de selección.</li><li><b>Selección en observables</b>: si condicional a \(X\) el tratamiento es como aleatorio, se ajusta por regresión o por emparejamiento con el puntaje de propensión.</li><li><b>Selección en no observables</b>: variables instrumentales (efecto local, LATE), modelos de Heckman, diferencias en diferencias, regresión discontinua.</li></ul></section>
${LAB}`},

{id:"duracion", parte:P5, u:5, t:"Modelos de duración", sim:"km", html:String.raw`
<section><h3>Conceptos</h3><p class="lead">La variable es el tiempo hasta un evento: duración del desempleo, de una empresa, de un crédito hasta el impago. Las observaciones suelen estar <b>censuradas a la derecha</b> (el evento no ha ocurrido al terminar el estudio).</p><ul><li><b>Función de supervivencia</b> \(S(t)=P(T>t)\).</li><li><b>Tasa de riesgo</b> \(h(t)=f(t)/S(t)\): probabilidad instantánea del evento dado que no ha ocurrido.</li></ul></section>
<section><h3>Estimación</h3><ul><li><b>Kaplan-Meier</b> (no paramétrico): \(\hat S(t)=\prod_{t_j\le t}(1-d_j/n_j)\), con \(d_j\) eventos y \(n_j\) en riesgo.</li><li><b>Exponencial</b>: riesgo constante \(\lambda\); con censura, \(\hat\lambda=\) eventos / tiempo total observado.</li><li><b>Weibull</b>: \(h(t)=\lambda p t^{p-1}\); dependencia de la duración positiva si \(p>1\), negativa si \(p<1\).</li><li><b>Riesgos proporcionales de Cox</b>: \(h(t|x)=h_0(t)e^{x'\beta}\), sin especificar \(h_0\).</li></ul></section>
${LAB}`}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"conceptos",t:"Tarjetas de conceptos",anchor:"mco",links:["mco","iv","panel","binaria"],sim:"tarjetas",html:WSBOX,d:"Los conceptos del curso en tarjetas."},
 {id:"simulacro",t:"Simulacro de examen",anchor:"duracion",links:["iv","gmm","panel","binaria","heckman"],sim:"quiz",html:WSBOX,d:"Diez preguntas al azar con explicación."},
 {id:"abiertas",t:"Preguntas abiertas",anchor:"duracion",links:["iv","panel","heckman","tratamiento"],sim:"abiertas",html:WSBOX,d:"Preguntas de desarrollo con esquema de respuesta."},
 {id:"formulas",t:"Hoja de fórmulas y código en R",anchor:"duracion",links:["mco","gmm","panel","binaria","tobit"],sim:"hoja",html:WSBOX,d:"Estimadores, pruebas y las funciones de R para cada uno."}];
const ALIAS={};
const GL=[
{u:1,t:"Exogeneidad estricta",d:"E[ε|X] = 0: el error no está relacionado con ningún regresor."},
{u:1,t:"Teorema de Gauss-Markov",d:"Con errores esféricos, MCO es el mejor estimador lineal insesgado."},
{u:1,t:"Consistencia",d:"El estimador converge en probabilidad al parámetro cuando n crece."},
{u:1,t:"Errores robustos de White",d:"Matriz sándwich válida con heterocedasticidad."},
{u:2,t:"Principio de analogía",d:"Reemplazar momentos poblacionales por sus análogos muestrales."},
{u:2,t:"Instrumento",d:"Variable correlacionada con el regresor endógeno y no con el error."},
{u:2,t:"MC2E",d:"Mínimos cuadrados en dos etapas: β = (X'P_Z X)⁻¹X'P_Z y."},
{u:2,t:"Instrumento débil",d:"Instrumento poco correlacionado con el regresor; F de primera etapa menor que 10."},
{u:2,t:"Matriz de ponderación óptima",d:"W = S⁻¹, con S la varianza de los momentos."},
{u:2,t:"Prueba J de Hansen",d:"Prueba de sobreidentificación; χ² con L − K grados de libertad."},
{u:3,t:"Efectos fijos",d:"Estimador within que elimina el efecto individual restando medias."},
{u:3,t:"Efectos aleatorios",d:"MCG que supone efecto individual no correlacionado con los regresores."},
{u:3,t:"Prueba de Hausman",d:"Compara efectos fijos y aleatorios; si difieren, los aleatorios son inconsistentes."},
{u:3,t:"Sesgo de Nickell",d:"Sesgo de efectos fijos en paneles dinámicos con T pequeño."},
{u:3,t:"Arellano-Bond",d:"GMM en primeras diferencias con niveles rezagados como instrumentos."},
{u:3,t:"Hausman-Taylor",d:"Estimador de VI para panel que permite variables invariantes correlacionadas con el efecto individual."},
{u:4,t:"Modelo lineal de probabilidad",d:"MCO con variable dependiente binaria."},
{u:4,t:"Probit",d:"P(y = 1) = Φ(x'β)."},
{u:4,t:"Logit",d:"P(y = 1) = e^(x'β)/(1 + e^(x'β))."},
{u:4,t:"Efecto marginal promedio",d:"Promedio de f(x'β)β_j sobre la muestra."},
{u:4,t:"Razón de odds",d:"En el logit, e^β: cambio multiplicativo de P/(1 − P)."},
{u:4,t:"Pseudo R² de McFadden",d:"1 − ln L/ln L₀."},
{u:5,t:"Truncamiento",d:"Solo se observan los individuos con y por encima de un umbral."},
{u:5,t:"Censura",d:"Se observan todos, pero y se registra en el umbral cuando lo cruza."},
{u:5,t:"Tobit",d:"Modelo para variable censurada con una latente normal."},
{u:5,t:"Inverso de la razón de Mills",d:"λ(z) = φ(z)/Φ(z); corrige el sesgo de selección."},
{u:5,t:"Restricción de exclusión",d:"Variable que afecta la selección pero no el resultado."},
{u:5,t:"ATE",d:"Efecto promedio del tratamiento en la población."},
{u:5,t:"Sesgo de selección",d:"E[Y₀|D = 1] − E[Y₀|D = 0]."},
{u:5,t:"Kaplan-Meier",d:"Estimador no paramétrico de la supervivencia con censura."},
{u:5,t:"Tasa de riesgo",d:"h(t) = f(t)/S(t)."}];
const MCQ=[
{u:1,q:"Con heterocedasticidad, MCO:",o:["Es inconsistente","Es consistente pero sus errores estándar clásicos son incorrectos","Es eficiente","Deja de ser lineal"],ok:1,e:"Usar errores robustos."},
{u:1,q:"Para la consistencia de MCO basta:",o:["Normalidad","E[xε] = 0 y condiciones de regularidad","Homocedasticidad","Muestras pequeñas"],ok:1,e:"Ley de grandes números."},
{u:2,q:"Un instrumento válido debe ser:",o:["Correlacionado con el error","Relevante y exógeno","Igual al regresor","Binario"],ok:1,e:"Cov(z, x) ≠ 0 y Cov(z, ε) = 0."},
{u:2,q:"Con un instrumento débil, MC2E tiende a:",o:["Ser insesgado","Estar sesgado hacia MCO","Ser más eficiente que MCO","Dar F muy alto"],ok:1,e:"Staiger y Stock."},
{u:2,q:"La prueba J de Hansen tiene grados de libertad:",o:["K","L","L − K","n − K"],ok:2,e:"Número de restricciones sobreidentificadas."},
{u:2,q:"GMM con W = (Z'Z)⁻¹ equivale a:",o:["MCO","MC2E","MCG","Máxima verosimilitud"],ok:1,e:"Caso particular."},
{u:3,q:"Si la prueba de Hausman rechaza, se prefieren:",o:["Efectos aleatorios","Efectos fijos","MCO agrupado","Primeras diferencias siempre"],ok:1,e:"Los aleatorios son inconsistentes."},
{u:3,q:"Efectos fijos no puede estimar el efecto de:",o:["Variables que cambian en el tiempo","Variables constantes en el tiempo","La constante del modelo","El error"],ok:1,e:"La transformación within las elimina."},
{u:3,q:"En un panel dinámico con T pequeño, efectos fijos:",o:["Es consistente","Subestima ρ (sesgo de Nickell)","Sobreestima ρ","No se puede calcular"],ok:1,e:"Sesgo ≈ −(1 + ρ)/(T − 1)."},
{u:3,q:"Arellano-Bond usa como instrumentos de Δy_(t−1):",o:["Δy_t","y_(t−2), y_(t−3), …","x_t","El efecto fijo"],ok:1,e:"Niveles rezagados."},
{u:4,q:"En un probit, el efecto marginal de x_j es:",o:["β_j","φ(x'β)β_j","Φ(x'β)","e^(β_j)"],ok:1,e:"Depende de x."},
{u:4,q:"Los coeficientes de un logit, frente a los de un probit, suelen ser:",o:["Iguales","Unas 1,6 veces mayores","La mitad","Negativos"],ok:1,e:"Por la escala de la distribución logística."},
{u:4,q:"En un logit, e^β = 1,5 significa que:",o:["La probabilidad sube 1,5 puntos","Las odds se multiplican por 1,5","La probabilidad es 1,5","El efecto marginal es 1,5"],ok:1,e:"Razón de odds."},
{u:4,q:"Un problema del modelo lineal de probabilidad es:",o:["No se puede estimar","Puede predecir probabilidades fuera de [0, 1]","No tiene constante","Es no lineal"],ok:1,e:"Además es heterocedástico."},
{u:5,q:"Con datos censurados en cero, MCO:",o:["Es insesgado","Tiende a subestimar la pendiente","La sobreestima siempre","Es el mejor"],ok:1,e:"Atenuación hacia cero."},
{u:5,q:"En el tobit, el efecto marginal sobre E[y|x] es:",o:["β_j","Φ(x'β/σ)β_j","φ(x'β)","σβ_j"],ok:1,e:"Escalado por la probabilidad de ser positivo."},
{u:5,q:"En Heckman, si el coeficiente de λ es cero:",o:["Hay sesgo de selección","No hay evidencia de sesgo de selección","El probit está mal","Hay que usar tobit"],ok:1,e:"ρ = 0."},
{u:5,q:"La diferencia simple de medias entre tratados y no tratados es igual al ATT más:",o:["El ATE","El sesgo de selección","El error estándar","Cero siempre"],ok:1,e:"E[Y₀|D=1] − E[Y₀|D=0]."},
{u:5,q:"Con riesgo constante λ y censura, su estimador de máxima verosimilitud es:",o:["Media de las duraciones","Eventos / tiempo total observado","1/n","Mediana"],ok:1,e:"Modelo exponencial."}];
const ABIERTAS=[
{u:2,q:"Proponga un instrumento para estimar el retorno de la educación en Colombia y discuta su validez.",a:["Endogeneidad por habilidad omitida.","Candidatos: distancia a universidades, reformas, trimestre de nacimiento.","Relevancia (primera etapa) y exclusión.","LATE y su interpretación."]},
{u:3,q:"Explique cuándo usar efectos fijos o aleatorios en un panel de municipios colombianos.",a:["Naturaleza del efecto individual.","Correlación con los regresores.","Prueba de Hausman.","Variables invariantes y Hausman-Taylor."]},
{u:4,q:"Estime e interprete un modelo de participación laboral femenina con probit y logit.",a:["Variable latente y especificación.","Máxima verosimilitud.","Efectos marginales promedio.","Ajuste y pruebas LR."]},
{u:5,q:"¿Por qué un modelo de salarios estimado solo con quienes trabajan puede estar sesgado? Explique la corrección de Heckman.",a:["Selección no aleatoria.","Probit y razón inversa de Mills.","Restricción de exclusión.","Interpretación del coeficiente de λ."]},
{u:5,q:"Evalúe un programa social con efectos de tratamiento: ¿qué estrategia usaría y por qué?",a:["Resultados potenciales y sesgo de selección.","Aleatorización si es posible.","Selección en observables: emparejamiento.","No observables: VI, diferencias en diferencias, discontinuidad."]}];
const TL=[];
