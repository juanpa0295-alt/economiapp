// Matemáticas III · contenido de la ruta
// =====================================================================
// CONTENIDO: Matemáticas III (1504103, U. de Antioquia). Bibliografía: Larson, Edwards y Hostetler, Cálculo esencial; Larson y Edwards, Calculus.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const SINT=`<p class="hint">Escribe como en una calculadora: <code>x^2</code>, <code>3x</code>, <code>sqrt(x)</code>, <code>ln(x)</code>, <code>exp(x)</code>, <code>sin(x)</code>, <code>oo</code> para infinito. Los cálculos exactos los hace SymPy en tu navegador.</p>`;
const U1="Unidad 1 · Técnicas de integración",U2="Unidad 2 · Ecuaciones diferenciales",U3="Unidad 3 · Series infinitas",U4="Unidad 4 · Integrales de varias variables";
const TRUNK=[
{id:"partes",parte:U1,t:"Integración por partes",sim:"intind",html:String.raw`
<section><h3>Fórmula</h3><div class="mj">\[\int u\,dv=uv-\int v\,du\]</div><p class="lead">Viene de la regla del producto. Se elige \(u\) con la regla <b>LIATE</b> (logarítmica, inversa trigonométrica, algebraica, trigonométrica, exponencial): \(u\) es la primera de la lista que aparezca. En integrales como \(\int e^x\cos x\,dx\) la integral reaparece y se despeja (por partes cíclica).</p>
<p>Aplicación: valor presente de un flujo que crece linealmente, \(\int_0^T(a+bt)e^{-rt}dt\).</p></section>
${SINT}${LAB}`,qs:[{q:"∫ x eˣ dx.",a:"u = x, dv = eˣdx: x eˣ − eˣ + C."}]},
{id:"trigonometricas",parte:U1,t:"Integrales trigonométricas",sim:"intind",html:String.raw`
<section><h3>Estrategias</h3><ul><li>\(\int\sin^mx\cos^nx\,dx\): si una potencia es impar, se separa un factor y se usa \(\sin^2+\cos^2=1\); si ambas son pares, se reducen con \(\sin^2x=\frac{1-\cos2x}2\), \(\cos^2x=\frac{1+\cos2x}2\).</li><li>\(\int\tan^mx\sec^nx\,dx\): se usa \(1+\tan^2x=\sec^2x\) y la sustitución \(u=\tan x\) o \(u=\sec x\).</li></ul></section>
${SINT}${LAB}`,qs:[{q:"∫ sen²x dx.",a:"∫ (1 − cos 2x)/2 dx = x/2 − sen(2x)/4 + C."}]},
{id:"sustitucion-trig",parte:U1,t:"Sustitución trigonométrica",sim:"intind",html:String.raw`
<section><h3>Tres casos</h3><div class="tbl"><table><tr><th>Expresión</th><th>Sustitución</th><th>Identidad</th></tr><tr><td>\(\sqrt{a^2-x^2}\)</td><td>\(x=a\sin\theta\)</td><td>\(1-\sin^2\theta=\cos^2\theta\)</td></tr><tr><td>\(\sqrt{a^2+x^2}\)</td><td>\(x=a\tan\theta\)</td><td>\(1+\tan^2\theta=\sec^2\theta\)</td></tr><tr><td>\(\sqrt{x^2-a^2}\)</td><td>\(x=a\sec\theta\)</td><td>\(\sec^2\theta-1=\tan^2\theta\)</td></tr></table></div><p>Al final se vuelve a \(x\) dibujando el triángulo rectángulo correspondiente.</p></section>
${SINT}${LAB}`,qs:[{q:"¿Qué sustitución usas para ∫ dx/√(4 + x²)?",a:"x = 2 tan θ."}]},
{id:"fracciones",parte:U1,t:"Fracciones parciales",sim:"intind",html:String.raw`
<section><h3>Método</h3><p class="lead">Para \(\int\frac{P(x)}{Q(x)}dx\) con grado de \(P\) menor que el de \(Q\) (si no, primero se divide): se factoriza \(Q\) y se descompone en fracciones simples, cada una integrable con \(\ln\) o \(\arctan\).</p><div class="mj">\[\frac{3x+5}{(x-1)(x+2)}=\frac{A}{x-1}+\frac{B}{x+2}\ \Rightarrow\ A=\tfrac83,\ B=\tfrac13\]</div><p>Aplicación: la ecuación logística se integra con fracciones parciales.</p></section>
${SINT}${LAB}`,qs:[{q:"∫ dx/(x² − 1).",a:"½ ln|x − 1| − ½ ln|x + 1| + C."}]},
{id:"lhopital",parte:U1,t:"Formas indeterminadas y regla de L'Hôpital",sim:"lhop",html:String.raw`
<section><h3>La regla</h3><div class="mj">\[\lim_{x\to a}\frac{f(x)}{g(x)}=\lim_{x\to a}\frac{f'(x)}{g'(x)}\qquad\text{si la forma es }\tfrac00\ \text{o}\ \tfrac\infty\infty\]</div><p class="lead">Se derivan numerador y denominador <b>por separado</b> (no es la regla del cociente) y se repite si sigue indeterminado. Otras formas (\(0\cdot\infty\), \(\infty-\infty\), \(1^\infty\), \(0^0\), \(\infty^0\)) se reescriben como cociente o con logaritmos. Ejemplo: \(\lim(1+r/m)^m=e^r\), el interés continuo.</p></section>
${SINT}${LAB}`,qs:[{q:"lim (eˣ − 1)/x cuando x → 0.",a:"0/0: derivando, eˣ/1 → 1."}]},
{id:"impropias",parte:U1,t:"Integrales impropias",sim:"impr",html:String.raw`
<section><h3>Definición</h3><div class="mj">\[\int_a^\infty f(x)\,dx=\lim_{b\to\infty}\int_a^bf(x)\,dx\]</div><p class="lead">Converge si el límite existe y es finito. También hay impropias por discontinuidades del integrando en el intervalo. Resultado clave: \(\int_1^\infty\frac{dx}{x^p}\) converge si y solo si \(p>1\).</p><p>Aplicaciones: valor presente de una renta perpetua \(\int_0^\infty Ce^{-rt}dt=C/r\); probabilidades con la densidad normal o exponencial.</p></section>
${SINT}${LAB}`,qs:[{q:"Valor presente de un flujo continuo de 100 por año para siempre con r = 5 %.",a:"100/0,05 = 2.000."}]},
{id:"edo",parte:U2,t:"Ecuaciones diferenciales de primer orden",sim:"edo",html:String.raw`
<section><h3>Tipos</h3><ul><li><b>Separables:</b> \(y'=g(x)h(y)\Rightarrow\int\frac{dy}{h(y)}=\int g(x)\,dx\).</li><li><b>Logística:</b> \(y'=ky(1-y/M)\): crecimiento con capacidad máxima \(M\); solución \(y=\frac{M}{1+Ae^{-kt}}\). Modela difusión de productos o adopción de tecnología.</li><li><b>Lineales:</b> \(y'+P(x)y=Q(x)\), con factor integrante \(e^{\int P\,dx}\).</li></ul></section>
<section><h3>Campos de direcciones y método de Euler</h3><p>El campo de direcciones dibuja la pendiente \(y'=f(x,y)\) en cada punto; las soluciones son curvas tangentes a él. El <b>método de Euler</b> aproxima la solución con pasos \(h\): \(y_{n+1}=y_n+h\,f(x_n,y_n)\).</p></section>
${SINT}${LAB}`,qs:[{q:"Resuelve y′ = 2xy con y(0) = 1.",a:"dy/y = 2x dx ⟹ y = e^(x²)."}]},
{id:"sucesiones",parte:U3,t:"Sucesiones",sim:"suc",html:String.raw`
<section><h3>Convergencia</h3><p class="lead">Una sucesión \(\{a_n\}\) converge a \(L\) si \(a_n\to L\) cuando \(n\to\infty\). Se calcula como un límite al infinito (se puede usar L'Hôpital con la función de variable real). Una sucesión monótona y acotada converge. Ejemplo económico: \(a_n=(1+1/n)^n\to e\).</p></section>
${SINT}${LAB}`,qs:[{q:"¿Converge aₙ = n/(n + 1)?",a:"Sí, a 1."}]},
{id:"series",parte:U3,t:"Series y criterios de convergencia",sim:"serie",html:String.raw`
<section><h3>Series</h3><p class="lead">\(\sum a_n\) converge si la sucesión de sumas parciales converge. Casos clave: <b>geométrica</b> \(\sum ar^n=\frac a{1-r}\) si \(|r|<1\) (multiplicador keynesiano, valor presente de una renta); <b>telescópica</b>; <b>serie p</b> \(\sum1/n^p\) converge si \(p>1\) (la armónica diverge).</p></section>
<section><h3>Criterios</h3><ul><li><b>Del término n-ésimo:</b> si \(a_n\not\to0\), diverge.</li><li><b>De la integral</b> y <b>de comparación</b> para términos positivos.</li><li><b>Del cociente:</b> \(L=\lim|a_{n+1}/a_n|\); converge si \(L<1\), diverge si \(L>1\), no decide si \(L=1\).</li><li><b>De la raíz:</b> \(L=\lim\sqrt[n]{|a_n|}\), mismas conclusiones.</li><li><b>Series alternadas</b> (Leibniz): converge si \(|a_n|\) decrece a 0. Convergencia <b>absoluta</b> si \(\sum|a_n|\) converge; <b>condicional</b> si converge solo con los signos.</li></ul></section>
${SINT}${LAB}`,qs:[{q:"¿Converge Σ 1/n²?",a:"Sí: serie p con p = 2 > 1 (su suma es π²/6)."}]},
{id:"potencias",parte:U3,t:"Series de potencias",sim:"pot",html:String.raw`
<section><h3>Radio e intervalo de convergencia</h3><div class="mj">\[\sum_{n=0}^\infty c_n(x-a)^n\qquad R=\lim_{n\to\infty}\left|\frac{c_n}{c_{n+1}}\right|\]</div><p class="lead">Converge absolutamente si \(|x-a|&lt;R\) y diverge si \(|x-a|>R\). En los extremos \(x=a\pm R\) hay que probar cada serie por separado. Dentro del intervalo, la serie se puede derivar e integrar término a término.</p></section>
${SINT}${LAB}`,qs:[{q:"Radio de Σ xⁿ/n!.",a:"R = lim (n + 1) = ∞: converge para todo x."}]},
{id:"taylor",parte:U3,t:"Series de Taylor y Maclaurin",sim:"taylor",html:String.raw`
<section><h3>Fórmula</h3><div class="mj">\[f(x)\approx\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k\]</div><p class="lead">Maclaurin es el caso \(a=0\): \(e^x=\sum\frac{x^n}{n!}\), \(\sin x=x-\frac{x^3}{3!}+\dots\), \(\ln(1+x)=x-\frac{x^2}2+\dots\), binomial \((1+x)^k=\sum\binom kn x^n\). En economía, la aproximación de Taylor de segundo orden justifica las fórmulas de duración y convexidad de los bonos y el análisis marginal.</p></section>
${SINT}${LAB}`,qs:[{q:"Polinomio de Taylor de grado 2 de eˣ en 0.",a:"1 + x + x²/2."}]},
{id:"dobles",parte:U4,t:"Integrales dobles",sim:"doble",html:String.raw`
<section><h3>Integrales iteradas</h3><div class="mj">\[\iint_Rf(x,y)\,dA=\int_a^b\!\int_{g_1(x)}^{g_2(x)}f(x,y)\,dy\,dx\]</div><p class="lead">Se integra primero la de adentro (tratando la otra variable como constante). En regiones generales los límites interiores dependen de la variable exterior. Para regiones circulares conviene usar <b>coordenadas polares</b>: \(x=r\cos\theta,\ y=r\sin\theta,\ dA=r\,dr\,d\theta\).</p><p>Aplicaciones: volumen bajo una superficie, probabilidades con densidades conjuntas (\(\iint f=1\)), promedio de una función de producción sobre una región.</p></section>
${SINT}${LAB}`,qs:[{q:"∫₀¹∫₀ˣ² xy dy dx.",a:"Interior: x·x⁴/2 = x⁵/2; exterior: 1/12."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[{id:"formulario",t:"Formulario",anchor:"dobles",links:["partes","fracciones","edo","series","taylor","dobles"],sim:"hojaf",html:WSBOX,d:"Las fórmulas del curso con buscador."}];
const ALIAS={};
const FORMULAS=[["Integración","Por partes","∫ u dv = uv − ∫ v du (LIATE)"],["Integración","sen²x","(1 − cos 2x)/2"],["Integración","cos²x","(1 + cos 2x)/2"],["Sustitución trigonométrica","√(a² − x²)","x = a sen θ"],["Sustitución trigonométrica","√(a² + x²)","x = a tan θ"],["Sustitución trigonométrica","√(x² − a²)","x = a sec θ"],["Fracciones parciales","Lineales","A/(x − a) + B/(x − b)"],["L'Hôpital","Regla","lím f/g = lím f′/g′ (0/0, ∞/∞)"],["Impropias","Serie p","∫₁^∞ dx/xᵖ converge si p > 1"],["Impropias","Perpetuidad","∫₀^∞ Ce^(−rt) dt = C/r"],["EDO","Separable","∫ dy/h(y) = ∫ g(x) dx"],["EDO","Logística","y = M/(1 + Ae^(−kt))"],["EDO","Lineal","factor integrante e^(∫P dx)"],["EDO","Euler","yₙ₊₁ = yₙ + h f(xₙ, yₙ)"],["Series","Geométrica","Σ arⁿ = a/(1 − r), |r| < 1"],["Series","Cociente","L = lím |aₙ₊₁/aₙ| < 1 converge"],["Series","Leibniz","alternada converge si |aₙ| ↓ 0"],["Potencias","Radio","R = lím |cₙ/cₙ₊₁|"],["Taylor","Fórmula","Σ f⁽ᵏ⁾(a)(x − a)ᵏ/k!"],["Taylor","eˣ","Σ xⁿ/n!"],["Taylor","sen x","x − x³/3! + x⁵/5! − …"],["Dobles","Iterada","∫ₐᵇ ∫_g₁^g₂ f dy dx"],["Dobles","Polares","dA = r dr dθ"]];
