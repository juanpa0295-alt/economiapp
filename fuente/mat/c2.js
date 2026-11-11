// =====================================================================
// CONTENIDO: Matemáticas II (1504102, U. de Antioquia). Bibliografía: Larson, Edwards y Hostetler, Cálculo esencial; Haeussler y Paul.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const SINT=`<p class="hint">Escribe como en una calculadora: <code>x^2</code>, <code>3x</code>, <code>sqrt(x)</code>, <code>ln(x)</code>, <code>exp(x)</code>, <code>sin(x)</code>. Los cálculos exactos los hace SymPy en tu navegador.</p>`;
const U1="Unidad 1 · Aplicaciones de la derivada",U2="Unidad 2 · La integral definida",U3="Unidad 3 · Funciones trascendentes",U4="Unidad 4 · Funciones de varias variables";
const TRUNK=[
{id:"newton",parte:U1,t:"Solución numérica de ecuaciones: método de Newton",sim:"newton",html:String.raw`
<section><h3>La idea</h3><p class="lead">Para resolver \(f(x)=0\) cuando no hay fórmula, se parte de una aproximación \(x_0\) y se reemplaza la curva por su recta tangente; donde la tangente corta el eje está la siguiente aproximación:</p><div class="mj">\[x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}\]</div>
<p>Converge muy rápido (cuadráticamente) cerca de una raíz simple, pero puede fallar si \(f'(x_n)\approx0\) o si \(x_0\) está lejos. Aplicación: hallar la TIR de un flujo de caja, que es la raíz del VPN.</p></section>
${SINT}${LAB}`,qs:[{q:"Una iteración de Newton para x² − 2 = 0 desde x₀ = 1.",a:"x₁ = 1 − (1 − 2)/2 = 1,5."}]},
{id:"extremos",parte:U1,t:"Extremos, crecimiento y concavidad",sim:"curva",html:String.raw`
<section><h3>Criterios</h3><ul><li><b>Extremos absolutos en [a, b]</b> (teorema del valor extremo): se evalúa \(f\) en los puntos críticos dentro del intervalo y en los extremos \(a\) y \(b\); el mayor valor es el máximo y el menor, el mínimo.</li><li><b>Primera derivada:</b> \(f'>0\) crece, \(f'<0\) decrece. Si \(f'\) cambia de + a −, hay máximo relativo; de − a +, mínimo.</li><li><b>Segunda derivada:</b> \(f''>0\) cóncava hacia arriba (∪), \(f''<0\) hacia abajo (∩). Puntos de inflexión donde cambia la concavidad. Si \(f'(c)=0\) y \(f''(c)<0\), máximo; \(f''(c)>0\), mínimo.</li></ul>
<p>En economía, la concavidad del beneficio garantiza que la condición de primer orden da un máximo; los rendimientos marginales decrecientes son una función de producción cóncava.</p></section>
${SINT}${LAB}`,qs:[{q:"¿Dónde decrece f(x) = x³ − 3x?",a:"f′ = 3x² − 3 < 0 ⟹ −1 < x < 1."}]},
{id:"rolle",parte:U1,t:"Teoremas de Rolle y del valor medio",sim:"tvm",html:String.raw`
<section><h3>Enunciados</h3><p class="lead"><b>Rolle:</b> si \(f\) es continua en \([a,b]\), derivable en \((a,b)\) y \(f(a)=f(b)\), existe \(c\in(a,b)\) con \(f'(c)=0\).</p><p><b>Valor medio:</b> con las mismas hipótesis (sin pedir \(f(a)=f(b)\)), existe \(c\) con</p><div class="mj">\[f'(c)=\frac{f(b)-f(a)}{b-a}\]</div><p>Hay un punto donde la razón de cambio instantánea iguala a la promedio: si una empresa aumentó su costo en 100 al pasar de 10 a 20 unidades, en algún nivel el costo marginal fue exactamente 10.</p></section>
${SINT}${LAB}`,qs:[{q:"Para f(x) = x² en [0, 2], ¿qué c da el valor medio?",a:"(4 − 0)/2 = 2 = 2c ⟹ c = 1."}]},
{id:"optimizacion",parte:U1,t:"Optimización aplicada a la economía",sim:"opt",html:String.raw`
<section><h3>Método</h3><ol><li>Escribir la función objetivo en una sola variable (usar las restricciones para eliminar las demás).</li><li>Condición de primer orden: \(f'(x)=0\).</li><li>Condición de segundo orden o comparación con los extremos del dominio.</li><li>Interpretar.</li></ol>
<p>Problemas típicos: maximizar el beneficio \(\pi=I-C\) (se cumple \(IMg=CMg\)), minimizar el costo medio (\(CMe=CMg\) en el mínimo), maximizar el ingreso (elasticidad unitaria), cantidad económica de pedido, impuesto que maximiza el recaudo.</p></section>
${SINT}${LAB}`,qs:[{q:"Si I(q) = 100q − q² y C(q) = 20q + 300, ¿qué q maximiza el beneficio?",a:"π′ = 100 − 2q − 20 = 0 ⟹ q = 40."}]},
{id:"antiderivadas",parte:U1,t:"Antiderivadas e integración indefinida",sim:"intind",html:String.raw`
<section><h3>Antiderivada</h3><p class="lead">\(F\) es antiderivada de \(f\) si \(F'=f\); todas difieren en una constante: \(\int f(x)\,dx=F(x)+C\).</p><div class="tbl"><table><tr><td>\(\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\ (n\ne-1)\)</td><td>\(\int\frac1x\,dx=\ln|x|+C\)</td></tr><tr><td>\(\int e^x\,dx=e^x+C\)</td><td>\(\int a^x\,dx=\frac{a^x}{\ln a}+C\)</td></tr><tr><td>\(\int\sin x\,dx=-\cos x+C\)</td><td>\(\int\cos x\,dx=\sin x+C\)</td></tr></table></div>
<p>Aplicación: del costo marginal se recupera el costo total, \(C(q)=\int CMg\,dq\), y la constante es el costo fijo.</p></section>
${SINT}${LAB}`,qs:[{q:"Si CMg = 2q + 5 y el costo fijo es 100, ¿cuál es C(q)?",a:"C(q) = q² + 5q + 100."}]},
{id:"riemann",parte:U2,t:"Área y sumas de Riemann",sim:"riemann",html:String.raw`
<section><h3>De la suma al límite</h3><p class="lead">El área bajo \(f\) en \([a,b]\) se aproxima con rectángulos de ancho \(\Delta x=(b-a)/n\):</p><div class="mj">\[\int_a^bf(x)\,dx=\lim_{n\to\infty}\sum_{i=1}^{n}f(x_i^*)\,\Delta x\]</div><p>Con extremos izquierdos, derechos o puntos medios. Si \(f\) es creciente, la suma izquierda subestima y la derecha sobreestima. La integral definida es el límite común.</p></section>
${SINT}${LAB}`,qs:[{q:"¿Qué ancho tienen los rectángulos para [0, 2] con n = 8?",a:"Δx = 2/8 = 0,25."}]},
{id:"fundamental",parte:U2,t:"Teorema fundamental del cálculo y sustitución",sim:"int",html:String.raw`
<section><h3>Teorema fundamental</h3><p class="lead"><b>Primera parte:</b> si \(F'=f\), \(\int_a^bf(x)\,dx=F(b)-F(a)\) (regla de Barrow). <b>Segunda parte:</b> \(\frac{d}{dx}\int_a^xf(t)\,dt=f(x)\).</p>
<p><b>Valor medio para integrales:</b> existe \(c\) con \(f(c)=\frac1{b-a}\int_a^bf\): el valor promedio de la función. <b>Sustitución:</b> si \(u=g(x)\), \(\int f(g(x))g'(x)\,dx=\int f(u)\,du\); en la definida se cambian también los límites.</p></section>
${SINT}${LAB}`,qs:[{q:"∫₀¹ 2x(x² + 1)³ dx.",a:"u = x² + 1: ∫₁² u³ du = (16 − 1)/4 = 15/4."}]},
{id:"numerica",parte:U2,t:"Integración numérica",sim:"numint",html:String.raw`
<section><h3>Trapecios y Simpson</h3><div class="mj">\[T_n=\frac{\Delta x}{2}\left[f(x_0)+2f(x_1)+\dots+2f(x_{n-1})+f(x_n)\right]\qquad S_n=\frac{\Delta x}{3}\left[f(x_0)+4f(x_1)+2f(x_2)+\dots+4f(x_{n-1})+f(x_n)\right]\]</div>
<p class="lead">Se usan cuando no hay antiderivada elemental (por ejemplo \(e^{-x^2}\), clave en estadística) o cuando la función viene en una tabla de datos. El error de los trapecios cae como \(1/n^2\); el de Simpson (n par) como \(1/n^4\).</p></section>
${SINT}${LAB}`,qs:[{q:"¿Qué condición exige Simpson sobre n?",a:"n debe ser par."}]},
{id:"area",parte:U2,t:"Área entre curvas y excedentes",sim:"exc",html:String.raw`
<section><h3>Área entre curvas</h3><div class="mj">\[A=\int_a^b\big[f(x)-g(x)\big]\,dx\qquad (f\ge g)\]</div><p class="lead">Se hallan los puntos de corte y se integra la diferencia «de arriba menos de abajo». En economía, el <b>excedente del consumidor</b> es el área entre la demanda y el precio de equilibrio, y el del <b>productor</b>, entre el precio y la oferta.</p></section>
${LAB}`,qs:[{q:"Área entre y = x y y = x² en [0, 1].",a:"∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6."}]},
{id:"trascendentes",parte:U3,t:"Integrales de funciones trascendentes",sim:"intind",html:String.raw`
<section><h3>Logaritmos, exponenciales e inversas trigonométricas</h3><div class="tbl"><table><tr><td>\(\int\frac{u'}{u}\,dx=\ln|u|+C\)</td><td>\(\int e^{u}u'\,dx=e^u+C\)</td></tr><tr><td>\(\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac xa+C\)</td><td>\(\int\frac{dx}{a^2+x^2}=\frac1a\arctan\frac xa+C\)</td></tr></table></div>
<p>Derivadas de las inversas: \((\arcsin x)'=1/\sqrt{1-x^2}\), \((\arctan x)'=1/(1+x^2)\).</p></section>
${SINT}${LAB}`,qs:[{q:"∫ 2x/(x² + 1) dx.",a:"ln(x² + 1) + C."}]},
{id:"crecimiento",parte:U3,t:"Ecuaciones diferenciales: crecimiento y decaimiento",sim:"crec",html:String.raw`
<section><h3>El modelo exponencial</h3><div class="mj">\[\frac{dy}{dt}=ky\quad\Rightarrow\quad y(t)=y_0e^{kt}\]</div><p class="lead">La tasa de cambio es proporcional al tamaño: población, capital con interés continuo (\(k=r\)), depreciación o decaimiento (\(k<0\)). Tiempo de duplicación \(\ln2/k\); vida media \(\ln2/|k|\). Se resuelve separando variables: \(dy/y=k\,dt\Rightarrow\ln|y|=kt+C\).</p></section>
${LAB}`,qs:[{q:"Si un capital crece con k = 0,07 continuo, ¿en cuánto se duplica?",a:"ln 2 / 0,07 ≈ 9,9 años."}]},
{id:"varias",parte:U4,t:"Funciones de varias variables y curvas de nivel",sim:"nivel",html:String.raw`
<section><h3>Funciones \(z=f(x,y)\)</h3><p class="lead">Asignan un número a cada par \((x,y)\) del dominio. Su gráfica es una superficie; las <b>curvas de nivel</b> \(f(x,y)=c\) la representan en el plano. En economía: <b>curvas de indiferencia</b> (utilidad constante) e <b>isocuantas</b> (producción constante).</p><p>Límite y continuidad: \(\lim_{(x,y)\to(a,b)}f=L\) si se acerca a \(L\) por <b>todos</b> los caminos; si dos caminos dan valores distintos, el límite no existe.</p></section>
${SINT}${LAB}`,qs:[{q:"¿Qué forma tienen las curvas de nivel de U = xy?",a:"Hipérbolas y = c/x: curvas de indiferencia convexas."}]},
{id:"parciales",parte:U4,t:"Derivadas parciales, gradiente y regla de la cadena",sim:"parc",html:String.raw`
<section><h3>Definiciones</h3><p class="lead">\(f_x\) deriva respecto a \(x\) manteniendo \(y\) constante. En economía: productos marginales \(\partial Q/\partial L\), utilidades marginales. Teorema de Schwarz: \(f_{xy}=f_{yx}\).</p>
<ul><li><b>Gradiente:</b> \(\nabla f=(f_x,f_y)\) apunta hacia el mayor crecimiento.</li><li><b>Derivada direccional:</b> \(D_{\mathbf u}f=\nabla f\cdot\mathbf u\) con \(\mathbf u\) unitario.</li><li><b>Regla de la cadena:</b> si \(x=x(t),y=y(t)\): \(\frac{dz}{dt}=f_x\frac{dx}{dt}+f_y\frac{dy}{dt}\).</li><li><b>Derivación implícita:</b> \(dy/dx=-F_x/F_y\): la relación marginal de sustitución \(-dy/dx=U_x/U_y\).</li></ul></section>
${SINT}${LAB}`,qs:[{q:"Si Q = 10K^0,5 L^0,5, ¿cuánto vale ∂Q/∂L?",a:"5K^0,5 L^(−0,5)."}]},
{id:"extremos2",parte:U4,t:"Extremos de funciones de dos variables",sim:"ext2",html:String.raw`
<section><h3>Criterio de las segundas derivadas</h3><p class="lead">Puntos críticos: \(f_x=f_y=0\). Con \(D=f_{xx}f_{yy}-f_{xy}^2\):</p><ul><li>\(D>0\) y \(f_{xx}>0\): mínimo relativo.</li><li>\(D>0\) y \(f_{xx}<0\): máximo relativo.</li><li>\(D<0\): punto de silla.</li><li>\(D=0\): el criterio no decide.</li></ul><p>Aplicaciones: empresa que produce dos bienes, discriminación de precios, elección de insumos.</p></section>
${SINT}${LAB}`,qs:[{q:"Clasifica (0, 0) en f = x² − y².",a:"D = (2)(−2) − 0 = −4 < 0: punto de silla."}]},
{id:"lagrange",parte:U4,t:"Multiplicadores de Lagrange",sim:"lag",html:String.raw`
<section><h3>Optimizar con una restricción</h3><div class="mj">\[\mathcal L=f(x,y)-\lambda\,[g(x,y)-c],\qquad \nabla f=\lambda\nabla g,\quad g=c\]</div><p class="lead">En el óptimo, la curva de nivel de \(f\) es tangente a la restricción. En el problema del consumidor: la relación marginal de sustitución iguala el cociente de precios. \(\lambda\) es el cambio del valor óptimo por unidad adicional de \(c\) (utilidad marginal del ingreso).</p></section>
${LAB}`,qs:[{q:"Max U = xy s.a. x + y = 10.",a:"y = λ, x = λ ⟹ x = y = 5, U = 25."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[{id:"formulario",t:"Formulario",anchor:"lagrange",links:["extremos","antiderivadas","fundamental","parciales","lagrange"],sim:"hojaf",html:WSBOX,d:"Las fórmulas del curso con buscador."}];
const ALIAS={};
const FORMULAS=[["Newton","Iteración","xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)"],["Valor medio","Teorema","f′(c) = [f(b) − f(a)]/(b − a)"],["Extremos","Segunda derivada","f′(c) = 0, f″(c) < 0 máximo; > 0 mínimo"],["Economía","Beneficio máximo","IMg = CMg"],["Economía","Costo medio mínimo","CMe = CMg"],["Integrales","Potencia","∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C"],["Integrales","Logaritmo","∫ u′/u dx = ln|u| + C"],["Integrales","Exponencial","∫ eᵘ u′ dx = eᵘ + C"],["Integrales","Arcotangente","∫ dx/(a² + x²) = (1/a) arctan(x/a) + C"],["Integrales","Arcoseno","∫ dx/√(a² − x²) = arcsen(x/a) + C"],["Integral definida","Barrow","∫ₐᵇ f dx = F(b) − F(a)"],["Integral definida","Valor promedio","(1/(b − a)) ∫ₐᵇ f dx"],["Numérica","Trapecios","(Δx/2)[f₀ + 2f₁ + … + 2fₙ₋₁ + fₙ]"],["Numérica","Simpson","(Δx/3)[f₀ + 4f₁ + 2f₂ + … + 4fₙ₋₁ + fₙ]"],["Área","Entre curvas","∫ₐᵇ [f − g] dx"],["Economía","Excedente del consumidor","∫₀^Q* D(q) dq − P*Q*"],["Crecimiento","Exponencial","y = y₀e^(kt); duplicación ln 2 / k"],["Varias variables","Gradiente","∇f = (f_x, f_y)"],["Varias variables","Direccional","D_u f = ∇f · u"],["Varias variables","Cadena","dz/dt = f_x x′ + f_y y′"],["Varias variables","Hessiano","D = f_xx f_yy − f_xy²"],["Lagrange","Condición","∇f = λ∇g, g = c"]];
