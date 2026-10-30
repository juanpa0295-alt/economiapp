// Matemáticas · contenido de la ruta (módulos de Economiapp ordenados por tema + optimización con restricciones)
// =====================================================================
// CONTENIDO: Matemáticas. Los módulos de Economiapp, ordenados por tema.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const SINTAXIS=`<p class="hint">Escribe las funciones con <span class="mono">x</span> como variable: <span class="mono">3x^2 + 2x</span>, <span class="mono">sqrt(x)</span>, <span class="mono">ln(x)</span>, <span class="mono">e^x</span>, <span class="mono">abs(x)</span>. Para infinito usa <span class="mono">oo</span> o <span class="mono">∞</span>.</p>`;
const TRUNK=[
{id:"algebra", t:"Álgebra para economistas", html:String.raw`
<section><h3>La idea</h3><p class="lead">Antes del cálculo hay que dominar la manipulación algebraica. Estas propiedades aparecen todo el tiempo al despejar variables en funciones de producción, modelos de crecimiento y elasticidades.</p></section>
<section><h3>Potenciación</h3><div class="tbl"><table><tr><th>Regla</th><th>Fórmula</th><th>Ejemplo</th></tr>
<tr><td>Producto de bases iguales</td><td>\(x^a\cdot x^b=x^{a+b}\)</td><td>\(x^2\cdot x^3=x^5\)</td></tr>
<tr><td>Cociente de bases iguales</td><td>\(\dfrac{x^a}{x^b}=x^{a-b}\)</td><td>\(\dfrac{x^5}{x^2}=x^3\)</td></tr>
<tr><td>Potencia de una potencia</td><td>\((x^a)^b=x^{ab}\)</td><td>\((x^2)^3=x^6\)</td></tr>
<tr><td>Exponente negativo</td><td>\(x^{-a}=\dfrac{1}{x^a}\)</td><td>\(x^{-2}=\dfrac{1}{x^2}\)</td></tr>
<tr><td>Exponente cero</td><td>\(x^0=1\quad(x\neq0)\)</td><td>\(5^0=1\)</td></tr></table></div></section>
<section><h3>Radicación</h3><div class="tbl"><table><tr><th>Regla</th><th>Fórmula</th><th>Ejemplo</th></tr>
<tr><td>Raíz como exponente</td><td>\(\sqrt[b]{x^a}=x^{a/b}\)</td><td>\(\sqrt{x}=x^{1/2}\)</td></tr>
<tr><td>Producto de raíces</td><td>\(\sqrt[n]{xy}=\sqrt[n]{x}\sqrt[n]{y}\)</td><td>\(\sqrt{4x}=2\sqrt{x}\)</td></tr>
<tr><td>Cociente de raíces</td><td>\(\sqrt[n]{\tfrac{x}{y}}=\dfrac{\sqrt[n]{x}}{\sqrt[n]{y}}\)</td><td>\(\sqrt{\tfrac{x}{4}}=\dfrac{\sqrt{x}}{2}\)</td></tr>
<tr><td>Raíz de una raíz</td><td>\(\sqrt[m]{\sqrt[n]{x}}=\sqrt[mn]{x}\)</td><td>\(\sqrt{\sqrt[3]{x}}=\sqrt[6]{x}\)</td></tr></table></div></section>
<section><h3>Logaritmo natural</h3><div class="tbl"><table><tr><th>Regla</th><th>Fórmula</th><th>Uso en economía</th></tr>
<tr><td>Producto</td><td>\(\ln(xy)=\ln x+\ln y\)</td><td>Separar capital y trabajo en una Cobb-Douglas</td></tr>
<tr><td>Cociente</td><td>\(\ln\tfrac{x}{y}=\ln x-\ln y\)</td><td>Tasas de crecimiento relativas</td></tr>
<tr><td>Potencia</td><td>\(\ln(x^a)=a\ln x\)</td><td>Bajar exponentes para volverlos coeficientes</td></tr>
<tr><td>Logaritmo de 1</td><td>\(\ln 1=0\)</td><td>Punto de referencia</td></tr>
<tr><td>Inversa de la exponencial</td><td>\(\ln(e^x)=x\)</td><td>Interés compuesto continuo</td></tr></table></div>
<p>Ejemplo: \(Y=AK^{\alpha}L^{1-\alpha}\Rightarrow\ln Y=\ln A+\alpha\ln K+(1-\alpha)\ln L\). La función queda lineal en los logaritmos.</p></section>
<section><h3>Desigualdades</h3><div class="tbl"><table><tr><th>Acción</th><th>Si \(a>b\)</th><th>Consecuencia</th></tr>
<tr><td>Sumar o restar</td><td>\(a\pm c>b\pm c\)</td><td>Se mantiene</td></tr>
<tr><td>Multiplicar por \(c>0\)</td><td>\(ac>bc\)</td><td>Se mantiene</td></tr>
<tr><td>Multiplicar por \(-c\)</td><td>\(-ac<-bc\)</td><td class="bad">El signo se invierte</td></tr>
<tr><td>Inversos (\(a,b>0\))</td><td>\(\tfrac1a<\tfrac1b\)</td><td class="bad">El signo se invierte</td></tr></table></div></section>`,
qs:[{q:"Simplifica (x³·x⁻¹)/x⁴.",a:String.raw`\(x^{3-1-4}=x^{-2}=\dfrac{1}{x^2}\).`},
 {q:"Si −2x > 6, ¿cuánto vale x?",a:String.raw`Al dividir por −2 el signo se invierte: \(x<-3\).`},
 {q:"Escribe ln(K^0,3 · L^0,7) como suma.",a:String.raw`\(0{,}3\ln K+0{,}7\ln L\).`}]},

{id:"limites", t:"Límites y continuidad", sim:"lim", html:String.raw`
<section><h3>La idea</h3><p class="lead">El límite dice a qué valor se acerca una función cuando \(x\) se acerca a un punto, aunque la función no esté definida en ese punto. Es la base de la derivada.</p>
<div class="mj">\[\lim_{x\to a}f(x)=L\iff\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)=L\]</div></section>
<section><h3>Cómo resolverlo a mano</h3><ol class="steps">
<li><b>Evaluación directa.</b> Reemplaza \(x=a\). Si da un número, ese es el límite.</li>
<li><b>Si da \(\tfrac{0}{0}\)</b> es una indeterminación: factoriza, racionaliza o simplifica y vuelve a evaluar.</li>
<li><b>Si da \(\tfrac{k}{0}\) con \(k\neq0\)</b> hay una asíntota vertical: revisa los límites laterales, que serán \(\pm\infty\).</li>
<li><b>Si los límites laterales son distintos</b>, el límite no existe (discontinuidad de salto).</li></ol>
<p>Una función es <b>continua</b> en \(a\) si \(f(a)\) existe, el límite existe y los dos coinciden.</p></section>
${LAB}${SINTAXIS}`,
deep:[{k:"Revisión",n:true,t:"El 0/0 que la app no mostraba",html:String.raw`<p>La app evaluaba el numerador y el denominador después de aplicar <span class="mono">cancel()</span>, que ya simplifica la fracción. Con su propio ejemplo, \(\frac{x^2-1}{x-1}\), el denominador quedaba en 1 y nunca aparecía la indeterminación. Aquí la evaluación directa se hace sobre la fracción original, como se hace a mano.</p>`},
 {k:"Truco",t:"Límites al infinito de cocientes de polinomios",html:String.raw`<p>Divide por la mayor potencia del denominador. Si los grados son iguales, el límite es el cociente de los coeficientes principales: \(\lim_{x\to\infty}\frac{2x^2+3}{x^2-1}=2\). Si el numerador tiene mayor grado, diverge; si tiene menor grado, tiende a 0.</p>`}],
py:`import sympy as sp

x = sp.Symbol('x')

def limite(f_texto, a_texto):
    """Lo mismo que la calculadora de límites de Economiapp."""
    f = sp.sympify(f_texto.replace('^', '**'))
    a = sp.sympify(a_texto)
    general = sp.limit(f, x, a)
    izquierda = sp.limit(f, x, a, dir='-')
    derecha = sp.limit(f, x, a, dir='+')
    num, den = sp.fraction(sp.together(f))   # sin cancelar factores
    return {"L": general, "izq": izquierda, "der": derecha,
            "existe": izquierda == derecha,
            "evaluacion": (num.subs(x, a), den.subs(x, a))}`,
qs:[{q:"Calcula el límite de (x² − 9)/(x − 3) cuando x → 3.",a:String.raw`Da \(\frac00\). Factorizando: \(\frac{(x-3)(x+3)}{x-3}=x+3\to6\).`},
 {q:"¿Existe el límite de |x|/x cuando x → 0?",a:"No: por la izquierda vale −1 y por la derecha 1."}]},

{id:"derivadas", t:"Derivadas y optimización", sim:"opt", html:String.raw`
<section><h3>La idea</h3><p class="lead">La derivada mide el cambio marginal: cuánto cambia el beneficio si produzco una unidad más. Donde la derivada vale cero la función deja de subir o de bajar: ahí están los máximos y mínimos.</p>
<div class="mj">\[f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}{h}\]</div></section>
<section><h3>Reglas de derivación</h3><div class="tbl"><table><tr><th>Regla</th><th>Fórmula</th></tr>
<tr><td>Constante</td><td>\(\frac{d}{dx}[c]=0\)</td></tr><tr><td>Potencia</td><td>\(\frac{d}{dx}[x^n]=nx^{n-1}\)</td></tr>
<tr><td>Exponencial</td><td>\(\frac{d}{dx}[e^x]=e^x\)</td></tr><tr><td>Logaritmo</td><td>\(\frac{d}{dx}[\ln x]=\frac1x\)</td></tr>
<tr><td>Producto</td><td>\((fg)'=f'g+fg'\)</td></tr><tr><td>Cociente</td><td>\(\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}\)</td></tr>
<tr><td>Cadena</td><td>\(\frac{d}{dx}f(g(x))=f'(g(x))\,g'(x)\)</td></tr></table></div></section>
<section><h3>Optimización de una variable</h3><ol class="steps">
<li><b>Condición de primer orden (CPO):</b> resuelve \(f'(x)=0\). Las soluciones son los puntos críticos \(x^*\).</li>
<li><b>Condición de segundo orden (CSO):</b> evalúa \(f''(x^*)\). Si es negativa, es un máximo (función cóncava, ∩); si es positiva, un mínimo (convexa, ∪).</li>
<li>Si \(f''(x^*)=0\), la prueba no decide: revisa el signo de \(f'\) a cada lado.</li></ol></section>
${LAB}${SINTAXIS}
<p class="link"><b>Ejemplo económico:</b> con \(\pi(Q)=-Q^2+40Q-100\), la CPO da \(40-2Q=0\Rightarrow Q^*=20\), la CSO \(\pi''=-2<0\) confirma un máximo, y el beneficio máximo es \(\pi(20)=300\).</p>`,
deep:[{k:"Revisión",n:true,t:"Qué cambió frente a la app",html:String.raw`<p>En Economiapp este optimizador estaba dentro del módulo «Matemáticas 2: Cálculo integral». Aquí está junto a las derivadas, que es su tema. Además ahora se avisa cuando la prueba de segundo orden no decide (\(f''=0\)), caso que la app no mostraba.</p>`}],
py:`import sympy as sp

x = sp.Symbol('x')

def optimizar(f_texto):
    """El optimizador de una variable de Economiapp."""
    f = sp.sympify(f_texto.replace('^', '**'))
    d1, d2 = sp.diff(f, x), sp.diff(f, x, 2)
    puntos = [p for p in sp.solve(d1, x) if sp.im(p) == 0]
    resultado = []
    for p in puntos:
        cso = d2.subs(x, p)
        tipo = "máximo" if cso < 0 else "mínimo" if cso > 0 else "no decide"
        resultado.append((p, tipo, f.subs(x, p)))
    return d1, d2, resultado`,
qs:[{q:"Deriva f(x) = x·eˣ.",a:String.raw`Regla del producto: \(f'(x)=e^x+xe^x=e^x(1+x)\).`},
 {q:"¿Qué tipo de punto crítico tiene f(x) = x³ en x = 0?",a:String.raw`\(f'(0)=0\) y \(f''(0)=0\): la CSO no decide. Como \(f'\ge0\) a ambos lados, no es máximo ni mínimo: es un punto de inflexión.`}]},

{id:"integrales", t:"Integrales y área bajo la curva", sim:"int", html:String.raw`
<section><h3>La idea</h3><p class="lead">Mientras la derivada encuentra el cambio marginal, la integral acumula. Sirve para pasar del costo marginal al costo total, calcular el excedente del consumidor o el valor presente de un flujo continuo.</p>
<div class="mj">\[\int_a^b f(x)\,dx=F(b)-F(a),\qquad F'(x)=f(x)\]</div></section>
<section><h3>Integrales inmediatas y linealidad</h3><div class="tbl"><table><tr><th>Regla</th><th>Fórmula</th></tr>
<tr><td>Constante</td><td>\(\int k\,dx=kx+C\)</td></tr><tr><td>Potencia (\(n\neq-1\))</td><td>\(\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\)</td></tr>
<tr><td>Logarítmica</td><td>\(\int\frac1x\,dx=\ln|x|+C\)</td></tr><tr><td>Exponencial</td><td>\(\int e^x\,dx=e^x+C\)</td></tr>
<tr><td>Suma</td><td>\(\int[f\pm g]\,dx=\int f\,dx\pm\int g\,dx\)</td></tr><tr><td>Múltiplo constante</td><td>\(\int k f\,dx=k\int f\,dx\)</td></tr></table></div></section>
<section><h3>Técnicas</h3>
<p><b>Sustitución</b> (regla de la cadena al revés): si aparece una función y su derivada, haz \(u=g(x)\), \(du=g'(x)dx\): \(\int f(g(x))g'(x)\,dx=\int f(u)\,du\).</p>
<p><b>Por partes</b>, para productos como \(xe^x\): \(\int u\,dv=uv-\int v\,du\). Para elegir \(u\) se usa ILATE: inversas, logarítmicas, algebraicas, trigonométricas, exponenciales.</p></section>
${LAB}${SINTAXIS}`,
deep:[{k:"Revisión",n:true,t:"Qué cambió frente a la app",html:String.raw`<p>En Economiapp la calculadora de áreas estaba dentro del módulo «Matemáticas 3: Álgebra lineal y multivariable». Aquí está con las integrales. El álgebra lineal y la optimización con restricciones, que en la app solo tenían el título, ahora tienen su propia estación.</p>`}],
py:`import sympy as sp

x = sp.Symbol('x')

def area(f_texto, a, b):
    """La calculadora de áreas de Economiapp (regla de Barrow)."""
    f = sp.sympify(f_texto.replace('^', '**'))
    F = sp.integrate(f, x)                    # antiderivada
    return {"F": F, "F(b)": F.subs(x, b), "F(a)": F.subs(x, a),
            "area": sp.integrate(f, (x, a, b))}`,
qs:[{q:"Si el costo marginal es CMg(Q) = 3Q² y no hay costos fijos, ¿cuánto cuesta producir 5 unidades?",a:String.raw`\(CT(5)=\int_0^5 3Q^2\,dQ=Q^3\big|_0^5=125\).`}]},

{id:"lagrange", t:"Optimización con restricciones (Lagrange)", nuevo:true, sim:"lag", html:String.raw`
<section><h3>La idea</h3><p class="lead">En economía casi siempre se optimiza con una restricción: maximizar utilidad con un presupuesto, minimizar costos para producir una cantidad. El método de Lagrange convierte el problema en uno sin restricciones.</p>
<div class="mj">\[\mathcal{L}(x,y,\lambda)=f(x,y)-\lambda\,\big(g(x,y)-c\big)\]</div></section>
<section><h3>Procedimiento</h3><ol class="steps">
<li>Escribe el lagrangiano.</li>
<li>Condiciones de primer orden: \(\mathcal L_x=0\), \(\mathcal L_y=0\), \(\mathcal L_\lambda=0\).</li>
<li>Divide las dos primeras para eliminar \(\lambda\): en consumo queda \(\frac{UMg_x}{UMg_y}=\frac{p_x}{p_y}\) (tasa marginal de sustitución = precio relativo).</li>
<li>Reemplaza en la restricción y despeja.</li>
<li>Verifica con la <b>hessiana orlada</b>: con dos variables y una restricción, si \(|\bar H|>0\) es un máximo.</li></ol></section>
<section><h3>Cobb-Douglas</h3>
<div class="mj">\[\max\;U=x^{a}y^{b}\quad\text{s.a.}\quad p_xx+p_yy=m\;\Longrightarrow\;x^*=\frac{a}{a+b}\frac{m}{p_x},\qquad y^*=\frac{b}{a+b}\frac{m}{p_y}\]</div>
<p>El multiplicador \(\lambda^*\) es el <b>precio sombra</b> del presupuesto: cuánta utilidad adicional da un peso más de ingreso.</p></section>
${LAB}`,
deep:[{k:"Hessiana orlada",t:"Cómo se arma",html:String.raw`<div class="mj">\[\bar H=\begin{pmatrix}0&g_x&g_y\\g_x&\mathcal L_{xx}&\mathcal L_{xy}\\g_y&\mathcal L_{yx}&\mathcal L_{yy}\end{pmatrix}\]</div><p>Con dos variables y una restricción basta el signo del determinante: \(|\bar H|>0\) indica máximo y \(|\bar H|<0\), mínimo.</p>`},
 {k:"Hessiana",t:"Sin restricciones: concavidad",html:String.raw`<p>Para \(f(x,y)\) sin restricciones, la hessiana es \(H=\begin{pmatrix}f_{xx}&f_{xy}\\f_{yx}&f_{yy}\end{pmatrix}\). Si \(f_{xx}<0\) y \(|H|>0\), el punto crítico es un máximo; si \(f_{xx}>0\) y \(|H|>0\), un mínimo; si \(|H|<0\), un punto de silla.</p>`}],
qs:[{q:"Con U = x^0,5 y^0,5, pₓ = 2, p_y = 4 y m = 100, ¿cuánto se consume de cada bien?",a:String.raw`\(x^*=\frac12\cdot\frac{100}{2}=25\) y \(y^*=\frac12\cdot\frac{100}{4}=12{,}5\). Cada bien recibe la mitad del ingreso.`}]}
];

const BRANCHES=[
{g:"Aplicaciones de la derivada", from:"derivadas", items:[
 {id:"elasticidad", t:"Elasticidad", nuevo:true, sim:"elas", html:String.raw`
<section><h3>La idea</h3><p class="lead">La elasticidad mide la respuesta en porcentaje: si el precio sube 1 %, ¿en qué porcentaje cambia la cantidad demandada? Se calcula con la derivada.</p>
<div class="mj">\[\varepsilon=\frac{dQ}{dP}\cdot\frac{P}{Q}\]</div>
<p>Si \(|\varepsilon|>1\) la demanda es elástica (subir el precio reduce el ingreso); si \(|\varepsilon|<1\), inelástica.</p></section>${LAB}`,
 qs:[{q:"Con Q = 100 − 2P, ¿cuál es la elasticidad en P = 20?",a:String.raw`\(Q=60\), \(dQ/dP=-2\): \(\varepsilon=-2\cdot\frac{20}{60}=-0{,}67\). Demanda inelástica.`}]}]},
{g:"Aplicaciones de la integral", from:"integrales", items:[
 {id:"excedentes", t:"Excedente del consumidor y del productor", nuevo:true, sim:"exc", html:String.raw`
<section><h3>La idea</h3><p class="lead">El excedente del consumidor es lo que los compradores estaban dispuestos a pagar por encima del precio de mercado; el del productor, lo que reciben por encima de su costo. Ambos son áreas entre curvas.</p>
<div class="mj">\[EC=\int_0^{Q^*}\big(D(Q)-P^*\big)\,dQ\qquad EP=\int_0^{Q^*}\big(P^*-S(Q)\big)\,dQ\]</div></section>${LAB}`,
 qs:[{q:"Con demanda P = 100 − 2Q y precio 40, ¿cuánto vale el excedente del consumidor?",a:String.raw`\(Q=30\) y \(EC=\int_0^{30}(60-2Q)\,dQ=60\cdot30-30^2=900\).`}]}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulario",t:"Formulario",anchor:"derivadas",links:["algebra","limites","derivadas","integrales","lagrange"],sim:"form",html:WSBOX,
  d:"Las propiedades, derivadas e integrales de la materia en una sola tabla con buscador, para repasar antes del examen."}
];
