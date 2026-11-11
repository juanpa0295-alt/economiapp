// Matemáticas para el análisis económico · contenido de la ruta (programa 1504105)
// =====================================================================
// CONTENIDO: Matemáticas para el análisis económico (1504105, U. de Antioquia).
// Texto guía: Chiang y Wainwright, Métodos fundamentales de economía matemática.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const SINTAXIS=`<p class="hint">En los laboratorios las funciones se escriben como en una calculadora: <code>x^2*y</code>, <code>sqrt(x)</code>, <code>ln(x)</code>, <code>exp(x)</code>, <code>x^0.3*y^0.7</code>. El producto se escribe con <code>*</code>.</p>`;
const U1="Unidad 1 · Estática comparativa", U2="Unidad 2 · Optimización", U3="Unidad 3 · Dinámica económica";
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"modelos", parte:U1, t:"Modelos de equilibrio y estática comparativa", sim:"ecm", html:String.raw`
<section><h3>Modelos, variables y equilibrio</h3><p class="lead">Un modelo económico relaciona <b>variables endógenas</b> (las que el modelo determina, como \(P\) y \(Q\)) con <b>variables exógenas y parámetros</b> (dados desde fuera, como el ingreso o un impuesto). El <b>equilibrio</b> es la situación en la que no hay tendencia al cambio: los valores endógenos que cumplen todas las ecuaciones a la vez.</p>
<p>La <b>estática comparativa</b> compara dos equilibrios: pregunta cuánto cambia el valor de equilibrio de una variable endógena cuando cambia un parámetro, sin preocuparse por el camino del ajuste (eso es la dinámica, Unidad 3). La herramienta es la <b>derivada de la forma reducida</b>.</p></section>
<section><h3>Mercado lineal</h3><p>Con \(Q_d=a-bP\) y \(Q_s=-c+dP\) (\(a,b,c,d>0\)), igualando:</p>
<div class="mj">\[P^*=\frac{a+c}{b+d}\qquad Q^*=\frac{ad-bc}{b+d}\]</div>
<p>Derivando la forma reducida: \(\partial P^*/\partial a=1/(b+d)>0\) (más demanda sube el precio), \(\partial P^*/\partial b=-(a+c)/(b+d)^2<0\), \(\partial Q^*/\partial a=d/(b+d)>0\). El signo de cada derivada es la predicción cualitativa del modelo.</p></section>
<section><h3>Modelo de ingreso nacional</h3><p>\(Y=C+I_0+G_0\), \(C=\alpha+\beta(Y-T)\), \(T=\gamma+\delta Y\) con \(0<\beta<1\), \(0<\delta<1\):</p>
<div class="mj">\[Y^*=\frac{\alpha-\beta\gamma+I_0+G_0}{1-\beta+\beta\delta}\qquad \frac{\partial Y^*}{\partial G_0}=\frac{1}{1-\beta+\beta\delta}>0\qquad \frac{\partial Y^*}{\partial \gamma}=\frac{-\beta}{1-\beta+\beta\delta}<0\qquad \frac{\partial Y^*}{\partial \delta}=\frac{-\beta Y^*}{1-\beta+\beta\delta}<0\]</div></section>
<section><h3>Elasticidad</h3><p>Para comparar efectos en unidades distintas se usa la <b>elasticidad</b> de la forma reducida: \(\varepsilon=\dfrac{\partial Q^*}{\partial a}\dfrac{a}{Q^*}\), el cambio porcentual de \(Q^*\) por un 1 % de cambio en \(a\).</p></section>
${LAB}`,
qs:[{q:"En el mercado lineal, ¿qué pasa con P* si la oferta se vuelve más sensible al precio (sube d)?",a:"∂P*/∂d = −(a + c)/(b + d)² < 0: el precio de equilibrio baja."},{q:"Con β = 0,8 y δ = 0,25, ¿cuál es el multiplicador del gasto?",a:"1/(1 − 0,8 + 0,8·0,25) = 1/0,4 = 2,5."}]},

{id:"implicita", parte:U1, t:"Diferenciales, funciones implícitas y jacobiano", sim:"jac", html:String.raw`
<section><h3>Diferencial total</h3><p>Si \(y=f(x_1,\dots,x_n)\), el <b>diferencial total</b> aproxima el cambio de \(y\) ante cambios pequeños en todas las variables:</p>
<div class="mj">\[dy=f_1\,dx_1+f_2\,dx_2+\dots+f_n\,dx_n\]</div>
<p>La <b>derivada total</b> respecto a \(t\) cuando \(y=f(x,w)\) y \(x=g(w)\): \(\dfrac{dy}{dw}=f_x\dfrac{dx}{dw}+f_w\).</p></section>
<section><h3>Teorema de la función implícita</h3><p>Si \(F(y,x_1,\dots,x_n)=0\) tiene derivadas parciales continuas y \(F_y\ne0\) en el punto, la ecuación define <b>implícitamente</b> \(y=f(x_1,\dots,x_n)\) en un entorno, y</p>
<div class="mj">\[\frac{\partial y}{\partial x_i}=-\frac{F_{x_i}}{F_y}\]</div>
<p>Ejemplo: en una curva de indiferencia \(U(x,y)=\bar U\), la pendiente es \(dy/dx=-U_x/U_y\) (menos la relación marginal de sustitución).</p></section>
<section><h3>Sistemas de ecuaciones y jacobiano</h3><p>Para un sistema \(F^j(y_1,\dots,y_n;x_1,\dots,x_m)=0\), \(j=1,\dots,n\), las derivadas de las endógenas existen si el <b>jacobiano</b> respecto a las endógenas no es cero:</p>
<div class="mj">\[|J|=\begin{vmatrix}\partial F^1/\partial y_1&\cdots&\partial F^1/\partial y_n\\\vdots&&\vdots\\\partial F^n/\partial y_1&\cdots&\partial F^n/\partial y_n\end{vmatrix}\ne0\]</div>
<p>Entonces se diferencia el sistema, se escribe en forma matricial \(J\,dy=-F_x\,dx\) y se resuelve por Cramer. Además, un conjunto de funciones es <b>funcionalmente dependiente</b> si y solo si su jacobiano es idénticamente cero.</p></section>
${SINTAXIS}${LAB}`,
qs:[{q:"Si F(x, y) = x² + xy + y² − 7 = 0, ¿cuánto vale dy/dx en (1, 2)?",a:"F_x = 2x + y = 4, F_y = x + 2y = 5 ⟹ dy/dx = −4/5."},{q:"¿Son dependientes y₁ = 2x₁ + 3x₂ y y₂ = 4x₁² + 12x₁x₂ + 9x₂²?",a:"Sí: y₂ = y₁². |J| = 2(12x₁ + 18x₂) − 3(8x₁ + 12x₂) = 0 en todo punto."}]},

{id:"islm", parte:U1, t:"Estática comparativa general: IS-LM y economía abierta", sim:"islm", html:String.raw`
<section><h3>Modelo IS-LM con funciones generales</h3><p>Equilibrio del mercado de bienes (IS) y del mercado de dinero (LM):</p>
<div class="mj">\[Y-C(Y-T)-I(r)-G=0\qquad L(Y,r)-M_s/P=0\]</div>
<p>con \(0&lt;C'<1\), \(I'<0\), \(L_Y>0\), \(L_r<0\). Diferenciando totalmente:</p>
<div class="mj">\[\begin{pmatrix}1-C'&-I'\\L_Y&L_r\end{pmatrix}\begin{pmatrix}dY\\dr\end{pmatrix}=\begin{pmatrix}dG-C'dT\\dM_s/P\end{pmatrix}\qquad |J|=(1-C')L_r+I'L_Y<0\]</div>
<p>Por Cramer: \(\dfrac{\partial Y^*}{\partial G}=\dfrac{L_r}{|J|}>0\), \(\dfrac{\partial r^*}{\partial G}=\dfrac{-L_Y}{|J|}>0\), \(\dfrac{\partial Y^*}{\partial M_s}=\dfrac{I'}{P|J|}>0\), \(\dfrac{\partial r^*}{\partial M_s}=\dfrac{1-C'}{P|J|}<0\). Solo con signos (sin formas funcionales) el modelo ya predice la dirección de cada efecto.</p></section>
<section><h3>Economía abierta</h3><p>Se añaden exportaciones \(X\) y una propensión a importar \(m\): la IS queda \(Y=C(Y-T)+I(r)+G+X-M(Y)\). El primer elemento del jacobiano pasa a ser \(1-C'+M'\): las importaciones son una «filtración» más y el multiplicador fiscal es menor.</p></section>
<section><h3>Versión lineal del laboratorio</h3><p>\(C=c_0+c_1(Y-T)\), \(I=i_0-i_1r\), \(L=kY-hr\). Con estas formas, \(C'=c_1\), \(I'=-i_1\), \(L_Y=k\), \(L_r=-h\), y \(|J|=-(1-c_1+m)h-i_1k\).</p></section>
${LAB}`,
qs:[{q:"¿Por qué |J| es negativo en el IS-LM?",a:"|J| = (1 − C′)L_r + I′L_Y: el primer término es positivo por negativo y el segundo negativo por positivo, así que ambos son negativos."},{q:"En economía abierta, ¿el multiplicador del gasto es mayor o menor?",a:"Menor: aparece M′ > 0 en el denominador; parte del gasto adicional se va en importaciones."}]},

// ===================== UNIDAD 2 =====================
{id:"libre", parte:U2, t:"Optimización sin restricciones: varias variables", sim:"hes", html:String.raw`
<section><h3>Condiciones de primer orden</h3><p class="lead">En un extremo interior de \(z=f(x,y)\) todas las derivadas parciales se anulan: \(f_x=f_y=0\). Los puntos que lo cumplen son los <b>puntos críticos</b> (o estacionarios).</p></section>
<section><h3>Condiciones de segundo orden: el hessiano</h3>
<div class="mj">\[H=\begin{pmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\end{pmatrix}\qquad |H_1|=f_{xx}\qquad |H_2|=f_{xx}f_{yy}-f_{xy}^2\]</div>
<div class="tbl"><table><tr><th>Menores principales</th><th>Conclusión</th></tr><tr><td>\(|H_1|>0,\ |H_2|>0\) (definida positiva)</td><td>Mínimo</td></tr><tr><td>\(|H_1|<0,\ |H_2|>0\) (definida negativa)</td><td>Máximo</td></tr><tr><td>\(|H_2|<0\)</td><td>Punto de silla</td></tr><tr><td>\(|H_2|=0\)</td><td>La prueba no decide</td></tr></table></div>
<p>Con \(n\) variables: mínimo si todos los \(|H_k|>0\); máximo si alternan \(|H_1|<0,\ |H_2|>0,\ |H_3|<0\dots\)</p></section>
<section><h3>Concavidad y convexidad</h3><p>Si \(f\) es <b>cóncava</b> (hessiano semidefinido negativo en todo el dominio), todo punto crítico es un <b>máximo global</b>; si es <b>convexa</b>, un mínimo global. Por eso en economía se piden funciones de beneficio cóncavas y de costo convexas.</p></section>
${SINTAXIS}${LAB}`,
qs:[{q:"Clasifica los puntos críticos de z = x³ − 3x + y² − 4y.",a:"f_x = 3x² − 3 = 0 ⟹ x = ±1; f_y = 2y − 4 = 0 ⟹ y = 2. En (1, 2): |H₁| = 6, |H₂| = 12 ⟹ mínimo. En (−1, 2): |H₂| = −12 ⟹ silla."}]},

{id:"aplicaciones", parte:U2, t:"Aplicaciones: multiproducto, discriminación e insumos", sim:"apl", html:String.raw`
<section><h3>Empresa multiproducto</h3><p>Una empresa competitiva vende dos bienes a precios \(P_1,P_2\) con costo conjunto \(C=2Q_1^2+Q_1Q_2+2Q_2^2\):</p>
<div class="mj">\[\pi=P_1Q_1+P_2Q_2-2Q_1^2-Q_1Q_2-2Q_2^2\qquad \pi_1=P_1-4Q_1-Q_2=0,\quad \pi_2=P_2-Q_1-4Q_2=0\]</div>
<p>Solución: \(Q_1^*=(4P_1-P_2)/15\), \(Q_2^*=(4P_2-P_1)/15\). El hessiano \(\begin{pmatrix}-4&-1\\-1&-4\end{pmatrix}\) es definido negativo: es un máximo. Con \(P_1=12\), \(P_2=18\): \(Q_1^*=2\), \(Q_2^*=4\), \(\pi^*=48\).</p></section>
<section><h3>Discriminación de precios de tercer grado</h3><p>Un monopolista vende en dos mercados separados: \(\pi=R_1(Q_1)+R_2(Q_2)-C(Q_1+Q_2)\). Las condiciones de primer orden dan \(IMg_1=IMg_2=CMg\), y como \(IMg_i=P_i(1-1/|\varepsilon_i|)\), <b>el precio es mayor en el mercado con demanda menos elástica</b>.</p></section>
<section><h3>Elección de insumos</h3><p>Con \(Q=AL^\alpha K^\beta\) (\(\alpha+\beta<1\)), la empresa competitiva maximiza \(\pi=PQ-wL-rK\): \(P\,PMg_L=w\), \(P\,PMg_K=r\). Las demandas de factores tienen forma cerrada y el hessiano es definido negativo gracias a los rendimientos decrecientes a escala.</p></section>
${LAB}`,
qs:[{q:"Si |ε₁| = 2 y |ε₂| = 4 y el costo marginal es 30, ¿cuál es el precio en cada mercado?",a:"P(1 − 1/|ε|) = 30 ⟹ P₁ = 30/0,5 = 60 y P₂ = 30/0,75 = 40: más caro donde la demanda es menos elástica."}]},

{id:"lagrange", parte:U2, t:"Optimización con restricciones de igualdad: Lagrange", sim:"lag", html:String.raw`
<section><h3>El lagrangiano</h3><p class="lead">Para optimizar \(z=f(x,y)\) sujeto a \(g(x,y)=c\), se forma</p>
<div class="mj">\[\mathcal L=f(x,y)+\lambda\,[c-g(x,y)]\]</div>
<p>Condiciones de primer orden: \(\mathcal L_\lambda=c-g=0\), \(\mathcal L_x=f_x-\lambda g_x=0\), \(\mathcal L_y=f_y-\lambda g_y=0\). De las dos últimas: \(f_x/f_y=g_x/g_y\) (tangencia entre la curva de nivel y la restricción).</p></section>
<section><h3>Interpretación del multiplicador</h3><p>\(\lambda^*=\dfrac{dz^*}{dc}\): cuánto cambia el valor óptimo si la restricción se relaja en una unidad. En el problema del consumidor es la <b>utilidad marginal del ingreso</b>; en el de costos, el <b>costo marginal</b>.</p></section>
<section><h3>Condición de segundo orden: hessiano orlado</h3>
<div class="mj">\[|\bar H|=\begin{vmatrix}0&g_x&g_y\\g_x&\mathcal L_{xx}&\mathcal L_{xy}\\g_y&\mathcal L_{yx}&\mathcal L_{yy}\end{vmatrix}\qquad |\bar H|>0\Rightarrow\text{máximo},\qquad |\bar H|<0\Rightarrow\text{mínimo}\]</div>
<p>Con \(n\) variables y una restricción se revisan \(|\bar H_2|,|\bar H_3|,\dots\): para máximo alternan empezando en positivo; para mínimo son todos negativos.</p></section>
<section><h3>Ejemplo (Chiang)</h3><p>\(z=xy+2x\) sujeto a \(4x+2y=60\): \(y+2=4\lambda\), \(x=2\lambda\), \(4x+2y=60\) ⟹ \(\lambda^*=4\), \(x^*=8\), \(y^*=14\), \(z^*=128\). \(|\bar H|=16>0\): máximo.</p></section>
${SINTAXIS}${LAB}`,
qs:[{q:"Si λ* = 4, ¿cuánto sube z* si la restricción pasa de 60 a 61?",a:"Aproximadamente 4 unidades: λ* = dz*/dc."},{q:"Max U = xy sujeto a 2x + 4y = 40.",a:"y = 2λ, x = 4λ, 2x + 4y = 40 ⟹ 16λ = 40, λ = 2,5, x = 10, y = 5, U = 50."}]},

{id:"homogeneas", parte:U2, t:"Cuasiconcavidad, funciones homogéneas y CES", sim:"ces", html:String.raw`
<section><h3>Cuasiconcavidad</h3><p>\(f\) es <b>cuasicóncava</b> si sus conjuntos de nivel superior \(\{x: f(x)\ge k\}\) son convexos: las curvas de indiferencia o isocuantas son convexas al origen. Es lo que se necesita para que la tangencia de Lagrange sea un máximo. Para dos variables, con \(f_x,f_y>0\), una prueba suficiente es</p>
<div class="mj">\[|B_2|=\begin{vmatrix}0&f_x&f_y\\f_x&f_{xx}&f_{xy}\\f_y&f_{yx}&f_{yy}\end{vmatrix}>0\]</div></section>
<section><h3>Funciones homogéneas</h3><p>\(f\) es homogénea de grado \(r\) si \(f(tK,tL)=t^r f(K,L)\). En producción: \(r=1\) rendimientos constantes, \(r>1\) crecientes, \(r<1\) decrecientes. Propiedades:</p><ul><li><b>Teorema de Euler:</b> \(K f_K+L f_L=r\,f(K,L)\). Con \(r=1\), pagar a cada factor su producto marginal agota el producto.</li><li>Las derivadas parciales son homogéneas de grado \(r-1\): con \(r=1\), los productos marginales dependen solo de \(K/L\).</li></ul></section>
<section><h3>Cobb-Douglas y CES</h3>
<div class="mj">\[Q=AK^\alpha L^\beta\qquad\qquad Q=A\left[\delta K^{-\rho}+(1-\delta)L^{-\rho}\right]^{-r/\rho}\]</div>
<p>La <b>elasticidad de sustitución</b> \(\sigma=\dfrac{d\ln(K/L)}{d\ln(\text{RMST})}\) mide la curvatura de la isocuanta. En la CES \(\sigma=1/(1+\rho)\): \(\rho\to0\) da Cobb-Douglas (\(\sigma=1\)), \(\rho\to-1\) sustitutos perfectos (\(\sigma\to\infty\)), \(\rho\to\infty\) Leontief (\(\sigma\to0\)).</p></section>
${LAB}`,
qs:[{q:"¿De qué grado es homogénea Q = 4K^0,3 L^0,5?",a:"De grado 0,3 + 0,5 = 0,8: rendimientos decrecientes a escala."},{q:"En una CES con ρ = 1, ¿cuánto vale σ?",a:"σ = 1/(1 + 1) = 0,5: los factores son más complementarios que en la Cobb-Douglas."}]},

{id:"kuhn", parte:U2, t:"Restricciones de desigualdad: Kuhn-Tucker", sim:"kt", html:String.raw`
<section><h3>Condiciones de Kuhn-Tucker</h3><p class="lead">Para maximizar \(f(x,y)\) sujeto a \(g^j(x,y)\le c_j\) y \(x,y\ge0\), con \(\mathcal L=f+\sum_j\lambda_j[c_j-g^j]\):</p>
<div class="mj">\[\mathcal L_x\le0,\quad x\ge0,\quad x\,\mathcal L_x=0\qquad\qquad \mathcal L_{\lambda_j}=c_j-g^j\ge0,\quad \lambda_j\ge0,\quad \lambda_j(c_j-g^j)=0\]</div>
<p>La condición clave es la <b>holgura complementaria</b>: si una restricción no se cumple con igualdad (tiene holgura), su multiplicador es cero; si su multiplicador es positivo, la restricción está activa.</p></section>
<section><h3>Cómo se resuelve</h3><p>Se prueban los casos: cada restricción activa o inactiva. En cada caso se resuelve el sistema y se verifica que todas las desigualdades se cumplan (multiplicadores no negativos, restricciones respetadas). El caso que pasa todas las pruebas es la solución.</p></section>
<section><h3>Racionamiento (Chiang)</h3><p>Max \(U=xy\) sujeto a \(x+y\le100\) (presupuesto) y \(x\le40\) (racionamiento). Sin racionamiento se elegiría \(x=y=50\), que viola \(x\le40\). Con ambas activas: \(x=40\), \(y=60\), \(\lambda_1=40\), \(\lambda_2=20>0\). El multiplicador del racionamiento dice cuánto subiría la utilidad si se permitiera una unidad más de \(x\).</p></section>
${LAB}`,
qs:[{q:"Si una restricción tiene holgura en el óptimo, ¿cuánto vale su multiplicador?",a:"Cero, por la holgura complementaria λ(c − g) = 0."}]},

{id:"envolvente", parte:U2, t:"Teorema de la envolvente y dualidad", sim:"env", html:String.raw`
<section><h3>Función de valor</h3><p>Si \(x^*(\alpha)\) maximiza \(f(x,\alpha)\), la <b>función de valor</b> es \(V(\alpha)=f(x^*(\alpha),\alpha)\). El teorema de la envolvente dice que, para derivarla, basta derivar \(f\) respecto al parámetro <b>manteniendo fija</b> la elección óptima:</p>
<div class="mj">\[\frac{dV}{d\alpha}=\frac{\partial f}{\partial\alpha}\Big|_{x=x^*(\alpha)}\]</div>
<p>El efecto indirecto (a través de \(x^*\)) desaparece porque \(f_x=0\) en el óptimo. Con restricciones: \(dV/d\alpha=\partial\mathcal L/\partial\alpha\) en el óptimo; de ahí \(\lambda^*=dV/dc\).</p></section>
<section><h3>Aplicaciones</h3><ul><li><b>Lema de Hotelling:</b> \(\partial\pi^*/\partial w=-L^*\) y \(\partial\pi^*/\partial P=Q^*\).</li><li><b>Lema de Shephard:</b> \(\partial C^*/\partial w=L^c\) (demanda condicionada).</li><li><b>Identidad de Roy:</b> \(x^*=-\dfrac{\partial V/\partial p_x}{\partial V/\partial M}\).</li></ul>
<p>Gráficamente, \(V(\alpha)\) es la <b>envolvente</b> superior de las curvas \(f(x,\alpha)\) con \(x\) fijo: cada una la toca en el \(\alpha\) para el que ese \(x\) es óptimo.</p></section>
${LAB}`,
qs:[{q:"Si π*(w) es la función de beneficio, ¿qué es −∂π*/∂w?",a:"La demanda de trabajo óptima L*(w) (lema de Hotelling)."}]},

// ===================== UNIDAD 3 =====================
{id:"edo1", parte:U3, t:"Ecuaciones diferenciales de primer orden", sim:"edo1", html:String.raw`
<section><h3>Coeficiente y término constantes</h3><p class="lead">\(\dfrac{dy}{dt}+ay=b\). La solución general es la suma de la <b>función complementaria</b> (desviación respecto al equilibrio) y la <b>integral particular</b> (el equilibrio intertemporal):</p>
<div class="mj">\[y(t)=\left[y(0)-\frac ba\right]e^{-at}+\frac ba\qquad(a\ne0)\qquad\qquad y(t)=y(0)+bt\qquad(a=0)\]</div>
<p>El equilibrio \(b/a\) es <b>dinámicamente estable</b> si \(a>0\): la desviación se extingue.</p></section>
<section><h3>Ajuste de precios en un mercado</h3><p>Con \(Q_d=\alpha-\beta P\), \(Q_s=-\gamma+\delta P\) y \(dP/dt=j(Q_d-Q_s)\), \(j>0\):</p>
<div class="mj">\[\frac{dP}{dt}+j(\beta+\delta)P=j(\alpha+\gamma)\quad\Rightarrow\quad P(t)=[P(0)-\bar P]e^{-j(\beta+\delta)t}+\bar P,\qquad \bar P=\frac{\alpha+\gamma}{\beta+\delta}\]</div>
<p>Con pendientes normales (\(\beta+\delta>0\)), el precio converge siempre al de equilibrio.</p></section>
<section><h3>Otros casos</h3><p>Coeficiente variable: \(dy/dt+u(t)y=w(t)\) se resuelve con el factor integrante \(e^{\int u\,dt}\). Ecuaciones exactas y separables, y el modelo de crecimiento de Domar (\(I(t)=I(0)e^{\rho s t}\)), siguen la misma lógica.</p></section>
${LAB}`,
qs:[{q:"Resuelve dy/dt + 2y = 6 con y(0) = 10.",a:"y(t) = (10 − 3)e^(−2t) + 3 = 7e^(−2t) + 3, converge a 3."}]},

{id:"edo2", parte:U3, t:"Ecuaciones diferenciales de segundo orden", sim:"edo2", html:String.raw`
<section><h3>Forma y solución</h3><p class="lead">\(y''+a_1y'+a_2y=b\). Integral particular: \(y_p=b/a_2\) (si \(a_2\ne0\)). Función complementaria según las raíces de la <b>ecuación característica</b> \(r^2+a_1r+a_2=0\):</p>
<div class="tbl"><table><tr><th>Caso</th><th>Función complementaria</th></tr><tr><td>\(a_1^2>4a_2\): raíces reales distintas</td><td>\(A_1e^{r_1t}+A_2e^{r_2t}\)</td></tr><tr><td>\(a_1^2=4a_2\): raíz repetida</td><td>\(A_3e^{rt}+A_4te^{rt}\)</td></tr><tr><td>\(a_1^2<4a_2\): raíces complejas \(h\pm vi\)</td><td>\(e^{ht}(A_5\cos vt+A_6\sin vt)\)</td></tr></table></div>
<p>Las constantes salen de \(y(0)\) y \(y'(0)\). El equilibrio es estable si <b>todas las raíces tienen parte real negativa</b> (en el caso complejo, \(h=-a_1/2<0\)); las raíces complejas producen <b>fluctuaciones</b>.</p></section>
<section><h3>Ejemplo (Chiang)</h3><p>\(y''+y'-2y=-10\), \(y(0)=12\), \(y'(0)=-2\): \(y_p=5\), raíces \(1\) y \(-2\), \(y(t)=4e^t+3e^{-2t}+5\). Diverge por la raíz positiva.</p></section>
<section><h3>Aplicación: mercado con expectativas de precio</h3><p>Si la demanda y la oferta dependen de \(P'\) y \(P''\) (expectativas sobre la tendencia del precio), igualarlas da una ecuación de segundo orden en \(P\); también aparece en la curva de Phillips con expectativas adaptativas.</p></section>
${LAB}`,
qs:[{q:"¿Qué tipo de trayectoria da y'' + 2y' + 5y = 10?",a:"a₁² − 4a₂ = 4 − 20 < 0: raíces complejas −1 ± 2i. Oscila amortiguada hacia y_p = 2."}]},

{id:"fase", parte:U3, t:"Sistemas de ecuaciones diferenciales y diagrama de fases", sim:"fase", html:String.raw`
<section><h3>Sistema lineal 2×2</h3><p class="lead">\(\dot x=a_{11}x+a_{12}y+b_1\), \(\dot y=a_{21}x+a_{22}y+b_2\). El equilibrio cumple \(\dot x=\dot y=0\). La estabilidad depende de los valores propios de \(A\), y estos de la <b>traza</b> y el <b>determinante</b>:</p>
<div class="mj">\[r_{1,2}=\frac{\operatorname{tr}A\pm\sqrt{(\operatorname{tr}A)^2-4|A|}}{2}\]</div>
<div class="tbl"><table><tr><th>Condición</th><th>Equilibrio</th></tr><tr><td>\(|A|<0\)</td><td>Punto de silla (inestable, salvo en la senda de silla)</td></tr><tr><td>\(|A|>0\), \(\text{tr}^2\ge4|A|\)</td><td>Nodo: estable si \(\text{tr}<0\)</td></tr><tr><td>\(|A|>0\), \(\text{tr}^2<4|A|\)</td><td>Foco (espiral): estable si \(\text{tr}<0\); centro si \(\text{tr}=0\)</td></tr></table></div></section>
<section><h3>Diagrama de fases</h3><p>Se dibujan las <b>isoclinas</b> \(\dot x=0\) y \(\dot y=0\); se cruzan en el equilibrio y dividen el plano en regiones. En cada región, el signo de \(\dot x\) y \(\dot y\) da la dirección del movimiento (flechas). Así se analiza la estabilidad incluso en sistemas no lineales, linealizando con el jacobiano en el equilibrio.</p></section>
${LAB}`,
qs:[{q:"Si tr A = −3 y |A| = 2, ¿qué equilibrio hay?",a:"tr² − 4|A| = 9 − 8 = 1 > 0 y |A| > 0, tr < 0: nodo estable (raíces −1 y −2)."}]},

{id:"telarana", parte:U3, t:"Ecuaciones en diferencias de primer orden: la telaraña", sim:"tela", html:String.raw`
<section><h3>Tiempo discreto</h3><p class="lead">\(y_{t+1}+ay_t=c\). Solución:</p>
<div class="mj">\[y_t=\left[y_0-\frac{c}{1+a}\right](-a)^t+\frac{c}{1+a}\qquad(a\ne-1)\]</div>
<p>La base \(b=-a\) gobierna la trayectoria: converge si \(|b|<1\), oscila (signo alternado) si \(b<0\).</p></section>
<section><h3>Modelo de la telaraña</h3><p>Los productores deciden con el precio del periodo anterior: \(Q_{dt}=\alpha-\beta P_t\), \(Q_{st}=-\gamma+\delta P_{t-1}\). Igualando:</p>
<div class="mj">\[P_t=\left[P_0-\bar P\right]\left(-\frac\delta\beta\right)^t+\bar P\qquad \bar P=\frac{\alpha+\gamma}{\beta+\delta}\]</div>
<p>El precio siempre oscila. Converge si \(\delta<\beta\) (la cantidad ofrecida responde al precio menos que la demandada), explota si \(\delta>\beta\) y oscila uniformemente si \(\delta=\beta\).</p></section>
<section><h3>Mercado con inventarios</h3><p>Si el precio se ajusta según el exceso de oferta, \(P_{t+1}=P_t-\sigma(Q_{st}-Q_{dt})\), la condición de estabilidad pasa a ser \(0<\sigma(\beta+\delta)<2\).</p></section>
${LAB}`,
qs:[{q:"Con Q_d = 18 − 3P_t y Q_s = −3 + 4P_(t−1), ¿converge?",a:"δ/β = 4/3 > 1: la telaraña es explosiva."}]},

{id:"samuelson", parte:U3, t:"Diferencias de segundo orden: multiplicador-acelerador", sim:"sam", html:String.raw`
<section><h3>Ecuación de segundo orden</h3><p class="lead">\(y_{t+2}+a_1y_{t+1}+a_2y_t=c\). Integral particular \(c/(1+a_1+a_2)\); función complementaria según las raíces de \(b^2+a_1b+a_2=0\). Si son complejas, \(b=R(\cos\theta\pm i\sin\theta)\) con \(R=\sqrt{a_2}\), y la trayectoria es \(R^t(A_5\cos\theta t+A_6\sin\theta t)\). Converge si todas las raíces tienen módulo menor que 1.</p></section>
<section><h3>Modelo de Samuelson</h3><p>\(Y_t=C_t+I_t+G_0\), \(C_t=\gamma Y_{t-1}\), \(I_t=\alpha(C_t-C_{t-1})\) (acelerador). Sustituyendo:</p>
<div class="mj">\[Y_t-\gamma(1+\alpha)Y_{t-1}+\alpha\gamma Y_{t-2}=G_0\qquad \bar Y=\frac{G_0}{1-\gamma}\]</div>
<div class="tbl"><table><tr><th>Caso</th><th>Condición</th><th>Trayectoria</th></tr><tr><td>Raíces reales</td><td>\(\gamma(1+\alpha)^2\ge4\alpha\)</td><td>Sin ciclos: converge si \(\alpha\gamma<1\), diverge si \(\alpha\gamma>1\)</td></tr><tr><td>Raíces complejas</td><td>\(\gamma(1+\alpha)^2<4\alpha\)</td><td>Ciclos: amortiguados si \(\alpha\gamma<1\), explosivos si \(\alpha\gamma>1\), uniformes si \(\alpha\gamma=1\)</td></tr></table></div>
<p>La interacción entre el multiplicador y el acelerador basta para generar <b>ciclos económicos endógenos</b>.</p></section>
${LAB}`,
qs:[{q:"Con γ = 0,8 y α = 1, ¿hay ciclos? ¿Convergen?",a:"γ(1 + α)² = 3,2 < 4α = 4: raíces complejas, hay ciclos. αγ = 0,8 < 1: se amortiguan."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[{id:"formulas",t:"Hoja de fórmulas",anchor:"samuelson",links:["modelos","implicita","libre","lagrange","kuhn","edo2","samuelson"],sim:"hoja",html:WSBOX,d:"Las fórmulas de las tres unidades en una sola tabla con buscador."}];
const ALIAS={};
