// =====================================================================
// CONTENIDO: Macroeconomía I (1503711, U. de Antioquia): introducción, microfundamentos de la demanda
// agregada, gobierno y política fiscal, economía cerrada y crecimiento de largo plazo.
// Bibliografía: De Gregorio (2007), Williamson (2008) y Sala-i-Martin (1999).
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"intro", parte:"Unidad 1 · Introducción", t:"Agentes, mercados, crecimiento y ciclos", sim:"ciclo", html:String.raw`
<section><h3>Elementos de un modelo macroeconómico</h3><p class="lead">La macroeconomía moderna construye modelos con <b>agentes</b> (hogares, empresas, gobierno), que toman decisiones óptimas dadas sus restricciones, y <b>mercados</b> (bienes, trabajo, crédito) donde esas decisiones se vuelven consistentes. El curso sigue a Williamson y De Gregorio: primero un período, luego dos, y al final el largo plazo.</p>
<ul><li><b>Variables exógenas:</b> las determina algo fuera del modelo (productividad z, gasto público G, población).</li><li><b>Variables endógenas:</b> las determina el modelo (producto, consumo, empleo, salario real, tasa de interés).</li><li><b>Equilibrio competitivo:</b> cada agente optimiza tomando los precios como dados y los precios vacían todos los mercados.</li></ul></section>
<section><h3>Crecimiento y ciclos: un poco de estadística</h3>
<p>El PIB real se descompone en una <b>tendencia</b> (crecimiento de largo plazo) y un <b>componente cíclico</b> (desviaciones de la tendencia). Con el logaritmo, la desviación se lee como porcentaje. El filtro de Hodrick-Prescott elige la tendencia \(\tau_t\) que minimiza</p>
<div class="mj">\[\sum_{t=1}^T(\ln Y_t-\tau_t)^2+\lambda\sum_{t=2}^{T-1}\big[(\tau_{t+1}-\tau_t)-(\tau_t-\tau_{t-1})\big]^2\]</div>
<p>con \(\lambda=100\) para datos anuales y \(1.600\) para trimestrales. Para describir el ciclo se usan la <b>volatilidad</b> (desviación estándar del componente cíclico), la <b>correlación</b> con el PIB (procíclica si es positiva, contracíclica si es negativa, acíclica si es cercana a cero) y el <b>desfase</b> (si una variable adelanta o rezaga al PIB).</p></section>
<section><h3>Consumo e inversión: definición e importancia</h3>
<div class="tbl"><table><tr><th></th><th>Peso en el PIB de Colombia</th><th>Comportamiento cíclico</th></tr>
<tr><td>Consumo de los hogares</td><td>Alrededor de dos tercios</td><td>Procíclico y menos volátil que el PIB (bienes durables, más volátiles)</td></tr>
<tr><td>Inversión (formación bruta de capital)</td><td>Alrededor de una quinta parte</td><td>Procíclica y de 3 a 5 veces más volátil que el PIB</td></tr></table></div>
<p>El consumo determina el bienestar y la demanda; la inversión determina el capital futuro y explica buena parte de las fluctuaciones. Por eso la unidad 2 estudia sus fundamentos microeconómicos. Verifica los pesos con las cuentas nacionales del DANE.</p></section>
${LAB}`,
qs:[{q:"Si la σ relativa del consumo es 0,7 y su correlación con el PIB es 0,8, ¿cómo se describe?",a:"Procíclico y menos volátil que el PIB."},{q:"¿Por qué se toman logaritmos antes del filtro?",a:"Para que el componente cíclico se lea como desviación porcentual respecto a la tendencia."}]},

{id:"micro", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"Un modelo de un período: la firma y el hogar", sim:"micro", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Detrás de la oferta y la demanda agregada de trabajo hay decisiones individuales: la firma contrata hasta que el último trabajador produce lo que cuesta, y el hogar reparte su tiempo entre trabajo y ocio.</p></section>
<section><h3>La firma: demanda de trabajo</h3>
<div class="mj">\[\max_N\;\pi=zK^{\alpha}N^{1-\alpha}-wN\;\Longrightarrow\;(1-\alpha)zK^{\alpha}N^{-\alpha}=w\;\Longrightarrow\;N^d=\left(\frac{(1-\alpha)zK^{\alpha}}{w}\right)^{1/\alpha}\]</div></section>
<section><h3>El hogar: oferta de trabajo</h3>
<div class="mj">\[\max_l\;U=\ln\!\big(w(h-l)\big)+\gamma\ln l\;\Longrightarrow\;l^*=\frac{\gamma}{1+\gamma}\,h,\qquad N^s=h-l^*=\frac{h}{1+\gamma}\]</div>
<p>Con utilidad logarítmica y sin otros ingresos, la oferta de trabajo no depende del salario: el efecto ingreso y el efecto sustitución se cancelan.</p></section>
<section><h3>Equilibrio</h3>
<div class="mj">\[N^d=N^s\;\Longrightarrow\;w^*=(1-\alpha)zK^{\alpha}\left(\frac{1+\gamma}{h}\right)^{\alpha}\]</div>
<p>Si el salario está por encima de \(w^*\) hay desempleo (exceso de oferta); si está por debajo, vacantes.</p></section>
${LAB}`,
deep:[
{k:"Paso a paso",t:"Demanda de trabajo",html:String.raw`<ol class="steps"><li>Beneficio: \(\pi=zK^{\alpha}N^{1-\alpha}-wN\).</li><li>CPO: \(\frac{\partial\pi}{\partial N}=(1-\alpha)zK^{\alpha}N^{-\alpha}-w=0\).</li><li>Producto marginal = costo marginal: \((1-\alpha)zK^{\alpha}N^{-\alpha}=w\).</li><li>\(N^{\alpha}=\frac{(1-\alpha)zK^{\alpha}}{w}\), y elevando a \(1/\alpha\) se obtiene \(N^d\).</li></ol>`},
{k:"Paso a paso",t:"Oferta de trabajo",html:String.raw`<ol class="steps"><li>Se reemplaza \(C=w(h-l)\) en la utilidad: \(U=\ln(w(h-l))+\gamma\ln l\).</li><li>CPO: \(\frac{-w}{w(h-l)}+\frac{\gamma}{l}=0\Rightarrow\frac{\gamma}{l}=\frac{1}{h-l}\).</li><li>\(\gamma(h-l)=l\Rightarrow\gamma h=l(1+\gamma)\Rightarrow l^*=\frac{\gamma}{1+\gamma}h\).</li><li>\(N^s=h-l^*=\frac{h}{1+\gamma}\).</li></ol>`},
{k:"Paso a paso",t:"Salario de equilibrio",html:String.raw`<div class="mj">\[\left(\frac{(1-\alpha)zK^{\alpha}}{w^*}\right)^{1/\alpha}=\frac{h}{1+\gamma}\;\Rightarrow\;\frac{(1-\alpha)zK^{\alpha}}{w^*}=\left(\frac{h}{1+\gamma}\right)^{\alpha}\;\Rightarrow\;w^*=(1-\alpha)zK^{\alpha}\left(\frac{1+\gamma}{h}\right)^{\alpha}\]</div>`},
{k:"Revisión",n:true,t:"El diagnóstico de equilibrio de la app",html:String.raw`<p>La app decía que el mercado estaba en equilibrio si \(|w-w^*|<100\). Con los valores del JSON los salarios están alrededor de 1 a 3, así que siempre aparecía «equilibrio» aunque hubiera desempleo. Aquí la tolerancia es del 1 % de \(w^*\).</p>`}],
py:`def microfundamentos(alpha, z, K, w, gamma, h):
    """Módulo «Microfundamentos» de Economiapp."""
    A = (1 - alpha) * z * K ** alpha
    Nd = (A / w) ** (1 / alpha)                 # demanda de trabajo
    l = gamma / (1 + gamma) * h                 # ocio óptimo
    Ns = h - l                                  # oferta de trabajo
    w_eq = A * ((1 + gamma) / h) ** alpha       # salario de equilibrio
    return {"Nd": Nd, "Y": z * K ** alpha * Nd ** (1 - alpha),
            "ocio": l, "Ns": Ns, "w_eq": w_eq}`,
qs:[{q:"Si sube la productividad z, ¿qué pasa con w* y con el empleo de equilibrio?",a:String.raw`\(w^*\) sube en la misma proporción que \(z\). El empleo de equilibrio no cambia, porque \(N^s=h/(1+\gamma)\) no depende del salario.`}]},

{id:"consumo", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"La función de consumo", sim:"consumo", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La función de consumo keynesiana dice que los hogares gastan una parte fija, el <b>consumo autónomo</b> \(C_0\), más una fracción \(c_1\) de su ingreso disponible \(Y-T\).</p>
<div class="mj">\[C=C_0+c_1\,(Y-T),\qquad 0<c_1<1\]</div></section>
<section><h3>Conceptos clave</h3>
<div class="tbl"><table><tr><th>Concepto</th><th>Fórmula</th><th>Lectura</th></tr>
<tr><td>Ingreso disponible</td><td>\(Y_d=Y-T\)</td><td>Lo que queda después de impuestos</td></tr>
<tr><td>Propensión marginal a consumir</td><td>\(PMgC=\dfrac{\partial C}{\partial Y}=c_1\)</td><td>De cada peso adicional, cuánto se consume</td></tr>
<tr><td>Propensión media a consumir</td><td>\(PMeC=\dfrac{C}{Y}\)</td><td>Qué fracción del ingreso total se consume</td></tr>
<tr><td>Ahorro</td><td>\(S=Y_d-C=-C_0+(1-c_1)Y_d\)</td><td>Puede ser negativo con ingresos bajos</td></tr></table></div>
<p>Como \(C_0>0\), la \(PMeC\) es mayor que la \(PMgC\) y va cayendo hacia \(c_1\) a medida que el ingreso crece: \(PMeC=\frac{C_0}{Y}+c_1\frac{Y-T}{Y}\).</p></section>
${LAB}
<p class="warn"><b>Error común:</b> multiplicar \(c_1\) por \(Y\) en vez de por \(Y-T\). Los impuestos se restan antes de aplicar la propensión marginal.</p>`,
deep:[
{k:"Derivada",t:"∂C/∂Y = c₁",html:String.raw`<div class="mj">\[\frac{\partial C}{\partial Y}=\frac{\partial}{\partial Y}(C_0)+\frac{\partial}{\partial Y}\left[c_1(Y-T)\right]=0+c_1-0=c_1\]</div><p>\(C_0\) es constante, y al distribuir \(c_1Y-c_1T\) solo el primer término depende de \(Y\).</p>`},
{k:"Derivada",t:"∂C/∂T = −c₁",html:String.raw`<div class="mj">\[\frac{\partial C}{\partial T}=\frac{\partial}{\partial T}\left(C_0+c_1Y-c_1T\right)=0+0-c_1=-c_1\]</div><p>Por eso un aumento de impuestos reduce el consumo en una proporción igual a la propensión marginal a consumir.</p>`},
{k:"Ampliación",n:true,t:"Del consumo al multiplicador",html:String.raw`<p>Si la economía produce lo que se demanda, \(Y=C+I+G\) con \(C=C_0+c_1(Y-T)\). Despejando:</p><div class="mj">\[Y=\frac{1}{1-c_1}\left(C_0-c_1T+I+G\right)\]</div><p>El término \(\frac{1}{1-c_1}\) es el multiplicador del gasto: con \(c_1=0{,}8\), cada peso de gasto público genera 5 pesos de producción. En la estación de gobierno se ve cómo el impuesto proporcional lo reduce.</p>`}],
py:`def consumo(C0, c1, Y, T):
    """Módulo «Teoría del consumo» de Economiapp."""
    Yd = Y - T                      # ingreso disponible
    C = C0 + c1 * Yd                # consumo total
    return {"Yd": Yd, "C": C,
            "PMeC": C / Y if Y > 0 else 0,
            "PMgC": c1,
            "ahorro": Yd - C}`,
qs:[{q:"Con C₀ = 500, c₁ = 0,8, Y = 2.000 y T = 400, ¿cuánto vale el ahorro?",a:String.raw`\(Y_d=1.600\), \(C=500+0{,}8\cdot1.600=1.780\) y \(S=1.600-1.780=-180\). El hogar desahorra: consume más que su ingreso disponible.`},
 {q:"Si los impuestos suben en 100, ¿cuánto cae el consumo?",a:String.raw`\(\Delta C=-c_1\Delta T=-0{,}8\cdot100=-80\). Cae menos que el impuesto porque una parte del ajuste la absorbe el ahorro.`}]},

{id:"intertemporal", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"Consumo y ahorro en dos períodos", sim:"inter", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El hogar decide cuánto consumir hoy y mañana sabiendo que puede ahorrar o endeudarse a la tasa \(r\). Lo que importa no es el ingreso de cada período sino la <b>riqueza</b>: el valor presente de todos sus ingresos.</p></section>
<section><h3>Restricción presupuestaria</h3>
<div class="mj">\[C_1+\frac{C_2}{1+r}=Y_1+\frac{Y_2}{1+r}=W\]</div>
<p>Si \(C_1<Y_1\) el hogar ahorra \(S_1=Y_1-C_1\) y mañana recibe \((1+r)S_1\).</p></section>
<section><h3>Ecuación de Euler</h3>
<p>En el óptimo, sacrificar una unidad de consumo hoy debe dar exactamente la misma utilidad que consumir \(1+r\) unidades mañana, descontadas a la tasa de impaciencia \(\rho\):</p>
<div class="mj">\[u'(C_1)=\frac{1+r}{1+\rho}\,u'(C_2)\quad\Longrightarrow\quad C_2=C_1\left(\frac{1+r}{1+\rho}\right)^{1/\theta}\]</div>
<p>La segunda forma sale con utilidad CRRA, \(u(C)=\frac{C^{1-\theta}}{1-\theta}\), donde \(1/\theta\) es la elasticidad de sustitución intertemporal. Si \(r>\rho\), el consumo crece en el tiempo.</p></section>
<section><h3>Canasta óptima</h3>
<p>Reemplazando Euler en la restricción:</p>
<div class="mj">\[C_1^*=\frac{W}{1+\dfrac{1}{1+r}\left(\dfrac{1+r}{1+\rho}\right)^{1/\theta}},\qquad C_2^*=C_1^*\left(\frac{1+r}{1+\rho}\right)^{1/\theta}\]</div></section>
<section><h3>Visual de cambios</h3><div data-vis="inter"></div></section>
${LAB}
<p class="warn"><b>Error común:</b> sumar \(Y_1+Y_2\) para obtener la riqueza. El ingreso de mañana vale menos hoy: hay que dividirlo por \(1+r\).</p>`,
deep:[
{k:"Derivada",t:"Sensibilidad de la riqueza a la tasa",html:String.raw`<div class="mj">\[W=Y_1+Y_2(1+r)^{-1}\;\Longrightarrow\;\frac{\partial W}{\partial r}=0+(-1)\,Y_2(1+r)^{-2}\cdot 1=-\frac{Y_2}{(1+r)^2}\]</div><p>Una tasa más alta descuenta más el ingreso futuro y reduce la riqueza.</p>`},
{k:"Derivada",t:"Sensibilidad de la riqueza al ingreso futuro",html:String.raw`<div class="mj">\[\frac{\partial W}{\partial Y_2}=\frac{1}{1+r}\]</div><p>Un peso adicional mañana aumenta la riqueza de hoy en \(1/(1+r)\) pesos.</p>`},
{k:"Revisión",n:true,t:"Una inconsistencia en la app original",html:String.raw`<p>La página de Streamlit calcula la canasta con la ecuación de Euler CRRA, pero dibuja la curva de indiferencia con una Cobb-Douglas \(C_1^{\alpha}C_2^{\beta}\) que usa como \(\beta\) el factor de descuento 0,95. Esa curva no es tangente a la restricción en el óptimo calculado.</p><p>Aquí la curva de indiferencia usa la misma utilidad que genera la ecuación de Euler, \(U=u(C_1)+\frac{u(C_2)}{1+\rho}\), así que sí es tangente. La canasta óptima no cambia. Además, \(\rho\) y \(\theta\) (que en la app estaban fijos en 0,08 y 1,5) ahora se pueden mover.</p>`}],
py:`def consumo_intertemporal(Y1, Y2, r, rho=0.08, theta=1.5):
    """Módulo «Consumo intertemporal» de Economiapp (2 períodos)."""
    W = Y1 + Y2 / (1 + r)                           # riqueza
    factor = ((1 + r) / (1 + rho)) ** (1 / theta)   # C2 / C1 por Euler
    C1 = W / (1 + factor / (1 + r))
    C2 = C1 * factor
    return {"W": W, "C1": C1, "C2": C2, "ahorro_1": Y1 - C1}`,
qs:[{q:"Si r = ρ, ¿cómo se comparan C₁ y C₂?",a:String.raw`El factor de Euler es 1, así que \(C_1=C_2\): el hogar suaviza completamente su consumo sin importar cuándo recibe el ingreso.`},
 {q:"Un hogar recibe todo su ingreso mañana (Y₁ = 0). ¿Puede consumir hoy?",a:"Sí, si puede endeudarse: su riqueza es Y₂/(1+r) y consume una parte de ella hoy. Si tuviera restricciones de liquidez, no podría."}]},

{id:"nperiodos", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"Riqueza en N períodos", sim:"nper", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con más períodos la riqueza es la suma de los ingresos traídos a valor presente: cada período adicional se descuenta una vez más.</p>
<div class="mj">\[W=\sum_{t=1}^{N}\frac{Y_t}{(1+r)^{t-1}}\qquad\frac{\partial W}{\partial r}=-\sum_{t=2}^{N}\frac{(t-1)\,Y_t}{(1+r)^{t}}\qquad\frac{\partial W}{\partial Y_t}=\frac{1}{(1+r)^{t-1}}\]</div></section>
${LAB}`,
 qs:[{q:"¿Por qué ∂W/∂r es más negativa cuando los ingresos llegan más tarde?",a:"Porque cada ingreso se multiplica por (t − 1): los ingresos lejanos se descuentan más veces y son más sensibles a la tasa."}]},

{id:"ciclovida", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"Ciclo de vida, renta permanente y el paseo aleatorio de Hall", sim:"rp", html:String.raw`
<section><h3>Del consumo keynesiano al consumo intertemporal</h3><p class="lead">La función keynesiana \(C=C_0+c_1Y_d\) predice que la propensión media a consumir cae con el ingreso. Kuznets encontró que en el largo plazo es estable. Las teorías del ciclo de vida y del ingreso permanente resuelven el acertijo: el consumo depende de la riqueza de toda la vida, no del ingreso corriente.</p></section>
<section><h3>Teoría del ciclo de vida (Modigliani)</h3>
<p>Los hogares suavizan el consumo a lo largo de la vida: ahorran durante la etapa laboral y desahorran en la jubilación. Con \(r=0\), sin herencias y vida conocida:</p>
<div class="mj">\[C=\frac{W_0+\sum_{t}Y_t}{T}\qquad\Longrightarrow\qquad C=\alpha W+\beta Y\]</div>
<p>El perfil de ingresos tiene forma de joroba (crece con la experiencia y cae a cero al jubilarse), la riqueza crece en la madurez y se agota al final. Con crecimiento poblacional o del ingreso, los jóvenes que ahorran son más que los viejos que desahorran: el ahorro agregado es positivo.</p></section>
<section><h3>Hipótesis del ingreso permanente (Friedman)</h3>
<div class="mj">\[C_t=Y^P_t\qquad Y_t=Y^P_t+Y^T_t\qquad Y^P=\frac{r}{1+r}\,W\]</div>
<p>Un <b>choque transitorio</b> de tamaño \(\Delta\) eleva la riqueza solo en \(\Delta\) y el consumo en su anualidad (pequeña); un <b>choque permanente</b> eleva el consumo uno a uno. Por eso la PMgC de corto plazo es menor que la de largo plazo.</p></section>
<section><h3>El paseo aleatorio de Hall</h3>
<p>Con expectativas racionales y \(\beta(1+r)=1\), la ecuación de Euler \(u'(C_t)=\beta(1+r)E_t[u'(C_{t+1})]\) con utilidad cuadrática implica</p>
<div class="mj">\[E_t[C_{t+1}]=C_t\qquad\Longleftrightarrow\qquad C_{t+1}=C_t+\varepsilon_{t+1}\]</div>
<p>Ninguna información disponible hoy predice el cambio del consumo. La evidencia muestra <b>exceso de sensibilidad</b> al ingreso esperado, que se explica por restricciones de liquidez, ahorro precautorio y consumidores que gastan su ingreso corriente.</p></section>
${LAB}`,
qs:[{q:"Un trabajador recibe una prima única de 10 millones, con r = 5 % y 40 años de horizonte. ¿Cuánto sube su consumo anual según la renta permanente?",a:"Aproximadamente 10 × 0,05/[1,05(1 − 1,05⁻⁴⁰)] ≈ 0,56 millones por año."}]},

{id:"ccapm", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"Precios de activos y el modelo CCAPM", sim:"ccapm", html:String.raw`
<section><h3>La ecuación de Euler como modelo de precios</h3><p class="lead">El mismo razonamiento que decide cuánto consumir decide cuánto pagar por un activo. Comprar una unidad de un activo a precio \(p_t\) cuesta \(u'(C_t)p_t\) en utilidad hoy y rinde \(\beta u'(C_{t+1})x_{t+1}\) mañana.</p>
<div class="mj">\[p_t=E_t\left[\beta\frac{u'(C_{t+1})}{u'(C_t)}x_{t+1}\right]=E_t[m_{t+1}x_{t+1}]\qquad m_{t+1}=\beta\left(\frac{C_{t+1}}{C_t}\right)^{-\theta}\]</div>
<p>\(m\) es el <b>factor de descuento estocástico</b>: vale más en los estados malos (consumo bajo, utilidad marginal alta).</p></section>
<section><h3>Tasa libre de riesgo y prima de riesgo</h3>
<div class="mj">\[1+r_f=\frac{1}{E[m]}\qquad E[R]-R_f=-R_f\,\mathrm{Cov}(m,R)\approx\theta\,\mathrm{Cov}\!\left(\frac{\Delta C}{C},R\right)\]</div>
<p>Un activo que rinde más cuando el consumo crece (procíclico) tiene covarianza negativa con \(m\) y exige prima. Un seguro, que paga en los estados malos, tiene rendimiento esperado menor que la tasa libre de riesgo.</p></section>
<section><h3>Los acertijos</h3><ul><li><b>Prima de riesgo accionaria</b> (Mehra y Prescott, 1985): con la baja volatilidad del consumo agregado, explicar primas de alrededor de 6 % exige aversiones al riesgo implausibles.</li><li><b>Tasa libre de riesgo:</b> con θ alto y crecimiento positivo del consumo, el modelo predice tasas reales muy altas.</li></ul></section>
${LAB}`,
qs:[{q:"¿Por qué un activo que paga mucho en las recesiones tiene un rendimiento esperado bajo?",a:"Porque paga cuando la utilidad marginal del consumo es alta: es un seguro, y los inversionistas aceptan menos rendimiento a cambio de esa protección."}]},

{id:"inversion", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"La inversión y el stock de capital óptimo", sim:"inv", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La empresa acumula capital mientras una máquina adicional le rinda más de lo que le cuesta tenerla. El costo de tenerla no es su precio sino el <b>costo de uso</b>: el interés que deja de ganar más el desgaste.</p>
<div class="mj">\[uc=r+\delta\qquad\text{(con precio del capital }P_K=1)\]</div></section>
<section><h3>Capital óptimo</h3>
<p>Con la función Cobb-Douglas \(Y=AK^{\alpha}N^{1-\alpha}\), el producto marginal del capital es \(PMgK=\alpha\frac{Y}{K}\). La empresa invierte hasta que:</p>
<div class="mj">\[PMgK=uc\;\Longrightarrow\;\alpha\frac{Y}{K}=r+\delta\;\Longrightarrow\;K^*=\alpha\,\frac{Y}{r+\delta}\]</div></section>
<section><h3>Inversión bruta y neta</h3>
<div class="mj">\[I_t^{bruta}=K^*-(1-\delta)K_{t-1}\qquad\qquad I_t^{neta}=K^*-K_{t-1}\]</div>
<p>La inversión bruta incluye la reposición del capital que se depreció; la neta es el crecimiento real del stock.</p></section>
<section><h3>Visual de cambios</h3><div data-vis="capital"></div></section>
${LAB}
<p class="link"><b>Regla rápida:</b> si \(PMgK>r+\delta\), conviene invertir; si es menor, conviene desinvertir. Con un ejemplo, \(PMgK=0{,}15\) y \(uc=0{,}05+0{,}10=0{,}15\): la empresa ya está en su capital óptimo.</p>`,
deep:[
{k:"Derivada",t:"∂K*/∂r y ∂K*/∂δ",html:String.raw`<div class="mj">\[K^*=\alpha Y(r+\delta)^{-1}\;\Longrightarrow\;\frac{\partial K^*}{\partial r}=\frac{\partial K^*}{\partial \delta}=-\frac{\alpha Y}{(r+\delta)^2}\]</div><p>Encarecer el financiamiento o el desgaste reduce el capital deseado.</p>`},
{k:"Derivada",t:"∂K*/∂Y",html:String.raw`<div class="mj">\[\frac{\partial K^*}{\partial Y}=\frac{\alpha}{r+\delta}\]</div><p>Si se espera vender más, se demanda más capital en proporción.</p>`},
{k:"Revisión",n:true,t:"Variables que la app no dejaba cambiar",html:String.raw`<p>En la página de Streamlit, \(Y\), \(\alpha\), \(K_{t-1}\), el valor de mercado y el costo de reposición tenían valores fijos dentro del código (500 millones, 0,33, 1.000 millones…), porque el JSON solo traía \(PMK\), \(r\) y \(\delta\). Aquí todos se pueden mover y los valores iniciales son los mismos.</p>`}],
py:`def inversion(Y, alpha, r, delta, K_prev):
    """Módulo «Inversión» de Economiapp (modelo neoclásico)."""
    uc = r + delta                     # costo de uso del capital
    K_optimo = alpha * Y / uc
    return {"uc": uc, "K_optimo": K_optimo,
            "inversion_bruta": K_optimo - (1 - delta) * K_prev,
            "inversion_neta": K_optimo - K_prev}`,
qs:[{q:"Si r sube de 5 % a 10 % con δ = 10 %, ¿qué pasa con K*?",a:String.raw`El costo de uso pasa de 0,15 a 0,20, así que \(K^*\) cae a \(0{,}15/0{,}20=75\,\%\) de su valor: baja una cuarta parte.`}]},

{id:"tobin", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"La q de Tobin", sim:"tobin", html:String.raw`
<section><h3>La idea</h3><p class="lead">James Tobin propuso comparar cuánto valora la bolsa a una empresa con cuánto costaría reconstruirla desde cero.</p>
<div class="mj">\[q=\frac{\text{Valor de mercado }(VM)}{\text{Costo de reposición }(CR)}\]</div>
<p>Si \(q>1\), el mercado valora el capital por más de lo que cuesta instalarlo: conviene invertir. Si \(q<1\), es más barato comprar empresas existentes que máquinas nuevas.</p></section>
<section><h3>La q marginal y los costos de ajuste</h3>
<p>Si instalar capital tiene un costo de ajuste \(C(I_t)\), la condición de primer orden respecto a \(K_{t+1}\) da:</p>
<div class="mj">\[1+C'(I_t)=\frac{f'(K_{t+1})+(1-\delta)-C'(I_{t+1})}{1+r}\]</div>
<p>El término \(1+C'(I_t)\) es la <b>q marginal</b>: lo que realmente cuesta instalar una unidad más de capital, incluidas las interrupciones en la fábrica.</p></section>
${LAB}`},

{id:"acelerador", parte:"Unidad 2 · Microfundamentos de la demanda agregada", t:"Restricciones de liquidez y la teoría del acelerador", sim:"acel", html:String.raw`
<section><h3>El acelerador</h3><p class="lead">Si las empresas quieren mantener una relación fija \(v\) entre el capital y el producto, la inversión depende del <b>cambio</b> de la demanda:</p>
<div class="mj">\[K^*_t=vY_t\qquad I_t=K^*_t-(1-\delta)K_{t-1}=v\,\Delta Y_t+\delta K_{t-1}\]</div>
<p>Explica por qué la inversión es mucho más volátil que el PIB y por qué cae cuando el crecimiento se desacelera, aunque el PIB siga creciendo. Su crítica: ignora el costo de uso y la q de Tobin, y supone ajuste instantáneo; el <b>acelerador flexible</b> ajusta solo una fracción de la brecha \(K^*-K\) cada período.</p></section>
<section><h3>Restricciones de liquidez</h3>
<p>Con mercados de crédito imperfectos (información asimétrica, garantías), el costo del financiamiento externo supera al interno. Las empresas restringidas invierten según su flujo de caja: \(I=\min\{I^*,\ \text{flujo de caja}+B\}\). En los hogares, las restricciones de liquidez hacen que el consumo dependa del ingreso corriente y no solo del permanente.</p>
<p class="link">El <b>acelerador financiero</b> (Bernanke, Gertler y Gilchrist) une las dos ideas: en un auge sube el valor de las garantías, se relaja la restricción y la inversión crece más; en una recesión ocurre lo contrario.</p></section>
${LAB}`,
qs:[{q:"Si v = 3 y el PIB pasa de crecer 4 % a crecer 2 %, ¿qué pasa con la inversión neta?",a:"La inversión neta es v·ΔY: si ΔY se reduce a la mitad, la inversión neta también cae a la mitad aunque el PIB siga creciendo."}]},

{id:"gobierno", parte:"Unidad 3 · El gobierno y la política fiscal", t:"Gobierno y política fiscal", sim:"gob", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El gobierno recauda impuestos que dependen en parte del ingreso y gasta \(G\). La diferencia es el balance fiscal, que mejora sola cuando la economía crece.</p>
<div class="mj">\[T=T_0+tY\qquad\qquad BS=T-G=(T_0+tY)-G\]</div></section>
<section><h3>Estabilizadores automáticos</h3>
<div class="mj">\[\frac{\partial BS}{\partial Y}=t\]</div>
<p>Por cada unidad que sube el PIB, el balance mejora en \(t\) unidades sin cambiar ninguna ley. En una recesión pasa lo contrario: el déficit crece y amortigua la caída de la demanda.</p></section>
<section><h3>Multiplicador con impuesto proporcional</h3>
<div class="mj">\[m=\frac{1}{1-c(1-t)}\]</div>
<p>Una tasa \(t\) más alta reduce el multiplicador: la economía es más estable ante choques, pero el gasto público tiene menos efecto.</p></section>
<section><h3>Restricción presupuestaria intertemporal</h3>
<div class="mj">\[G_t+(1+r)B_{t-1}=T_t+B_t\]</div>
<p>Lo que el gobierno no financia con impuestos lo financia emitiendo deuda, y la deuda vieja se paga con intereses.</p></section>
${LAB}`,
deep:[
{k:"Derivada",t:"El balance respecto al ciclo",html:String.raw`<div class="mj">\[BS=(T_0+tY)-G\;\Longrightarrow\;\frac{\partial BS}{\partial Y}=0+t-0=t\]</div><p>\(T_0\) y \(G\) no dependen de \(Y\).</p>`},
{k:"Revisión",n:true,t:"Qué cambió frente a la app",html:String.raw`<p>La app fijaba la propensión a consumir del multiplicador en \(c=0{,}8\); aquí se puede mover, con el mismo valor inicial. También se agregó la evolución de la deuda con las variables \(B\) y \(r\) del JSON, que la app no usaba.</p>`}],
py:`def gobierno(G, T0, t, Y, Y_pot, c=0.8):
    """Módulo «Gobierno y política fiscal» de Economiapp."""
    T = T0 + t * Y
    balance = T - G
    balance_estructural = (T0 + t * Y_pot) - G
    return {"recaudo": T, "balance": balance,
            "multiplicador": 1 / (1 - c * (1 - t)),
            "balance_estructural": balance_estructural,
            "componente_ciclico": balance - balance_estructural}`,
qs:[{q:"Con t = 0,2 y c = 0,8, ¿cuánto vale el multiplicador? ¿Y sin impuesto proporcional?",a:String.raw`Con \(t=0{,}2\): \(1/(1-0{,}8\cdot0{,}8)=2{,}78\). Sin él (\(t=0\)): \(1/(1-0{,}8)=5\). El impuesto proporcional casi reduce el multiplicador a la mitad.`}]},

{id:"ricardiana", parte:"Unidad 3 · El gobierno y la política fiscal", t:"La equivalencia ricardiana", sim:"ric", html:String.raw`
<section><h3>La restricción intertemporal del gobierno</h3><p class="lead">El gobierno también enfrenta una restricción presupuestaria entre períodos: lo que gasta hoy y mañana, en valor presente, se paga con impuestos presentes y futuros.</p>
<div class="mj">\[G_1+\frac{G_2}{1+r}=T_1+\frac{T_2}{1+r}\qquad\text{(con deuda inicial: }+\,(1+r)B_0)\]</div></section>
<section><h3>El teorema</h3>
<p>Si los hogares viven los mismos períodos que el gobierno (o se preocupan por sus descendientes, Barro 1974), pueden prestar y pedir prestado a la misma tasa \(r\) y los impuestos son de suma fija, entonces un cambio en la <b>composición</b> de los impuestos entre hoy y mañana, dado el gasto, no altera la riqueza de los hogares:</p>
<div class="mj">\[W=Y_1-T_1+\frac{Y_2-T_2}{1+r}=Y_1+\frac{Y_2}{1+r}-\left(G_1+\frac{G_2}{1+r}\right)\]</div>
<p>El consumo no cambia: el recorte se ahorra para pagar el impuesto futuro. Lo que importa para la demanda es el <b>gasto</b>, no cómo se financia.</p></section>
<section><h3>Por qué puede fallar</h3><ul><li>Restricciones de liquidez: hay hogares que quieren pedir prestado y no pueden.</li><li>Horizontes finitos sin altruismo: parte del impuesto lo pagan generaciones futuras.</li><li>Impuestos distorsionantes (sobre la renta o el consumo), no de suma fija.</li><li>Miopía o incertidumbre sobre quién pagará.</li></ul></section>
${LAB}`,
qs:[{q:"Bajo equivalencia ricardiana, ¿qué pasa con el ahorro nacional si el gobierno baja impuestos hoy financiándose con deuda?",a:"No cambia: el ahorro público cae y el privado sube en la misma cuantía."}]},

{id:"deuda", parte:"Unidad 3 · El gobierno y la política fiscal", t:"La dinámica de la deuda pública y el crecimiento", sim:"deuda", html:String.raw`
<section><h3>La ecuación de acumulación de deuda</h3><p class="lead">La deuda crece por los intereses y por los déficits primarios (gasto sin intereses menos ingresos). Dividiendo por el PIB nominal se obtiene la dinámica de la razón deuda/PIB.</p>
<div class="mj">\[B_{t+1}=(1+i)B_t-SP_t\quad\Longrightarrow\quad b_{t+1}=\frac{1+r}{1+g}\,b_t-s_t\]</div>
<p>\(r\) es la tasa de interés real, \(g\) el crecimiento real del PIB y \(s\) el superávit primario en porcentaje del PIB.</p></section>
<section><h3>Sostenibilidad</h3>
<div class="mj">\[b_{t+1}=b_t\iff s^*=\frac{r-g}{1+g}\,b\]</div>
<ul><li>Si \(r>g\), la deuda crece sola: se necesita un superávit primario para estabilizarla, mayor cuanto más alta sea la deuda.</li><li>Si \(r<g\), el crecimiento licúa la deuda; pero el diferencial puede revertirse rápido en una crisis (prima de riesgo, devaluación de la deuda en dólares).</li><li>La <b>condición de no Ponzi</b>: el valor presente de la deuda en el infinito debe ser cero, es decir, la deuda de hoy se paga con superávits primarios futuros.</li></ul>
<p>En Colombia la regla fiscal (Ley 1473 de 2011, reformada por la Ley 2155 de 2021) fija un ancla de deuda neta y una meta de balance primario neto estructural, y la vigila el Comité Autónomo de la Regla Fiscal.</p></section>
${LAB}`,
qs:[{q:"Con deuda de 60 % del PIB, r = 5 % y g = 2 %, ¿qué superávit primario estabiliza la deuda?",a:"s* = (0,05 − 0,02)/1,02 × 60 % ≈ 1,76 % del PIB."}]},

{id:"estructural", parte:"Unidad 3 · El gobierno y la política fiscal", t:"Balance estructural y cíclico", sim:"estr", html:String.raw`
<section><h3>La idea</h3><p class="lead">El balance observado puede engañar: en un auge parece bueno solo porque el PIB está alto. El balance estructural mide lo que el gobierno recaudaría con la economía en su nivel potencial \(Y^*\).</p>
<div class="mj">\[BS^*=(T_0+tY^*)-G\qquad\qquad\text{Componente cíclico}=BS-BS^*=t\,(Y-Y^*)\]</div></section>
${LAB}`},

{id:"eq1", parte:"Unidad 4 · La economía cerrada", t:"Equilibrio de un período y estática comparativa", sim:"eq1", html:String.raw`
<section><h3>El modelo</h3><p class="lead">Se juntan el hogar y la firma de la unidad 2 con un gobierno que gasta \(G\) y lo financia con un impuesto de suma fija \(T=G\). El equilibrio competitivo exige que el hogar y la firma optimicen y que los mercados de trabajo y de bienes se vacíen.</p>
<div class="mj">\[Y=zF(K,N)=C+G\qquad\frac{U_l}{U_C}=w=zF_N(K,N)\]</div>
<p>Con la frontera de posibilidades de producción \(C=zF(K,h-l)-G\), el equilibrio está donde la curva de indiferencia es tangente a la frontera: la TMS ocio-consumo iguala la tasa marginal de transformación (el producto marginal del trabajo). Por el primer teorema del bienestar, es <b>Pareto óptimo</b>.</p></section>
<section><h3>Estática comparativa</h3>
<div class="tbl"><table><tr><th>Choque</th><th>Y</th><th>C</th><th>N</th><th>w</th><th>Mecanismo</th></tr>
<tr><td>Aumento de G</td><td>↑</td><td>↓</td><td>↑</td><td>↓</td><td>Efecto ingreso negativo: el hogar es más pobre, consume menos ocio y trabaja más (expulsión del consumo)</td></tr>
<tr><td>Aumento de z</td><td>↑</td><td>↑</td><td>?</td><td>↑</td><td>Efecto sustitución (el ocio es más caro) frente a efecto ingreso (más rico)</td></tr></table></div>
<p>Esta es la base de la teoría de los ciclos reales: choques de productividad generan comovimientos procíclicos de producto, consumo y salario real. La pregunta empírica es si explican los ciclos observados.</p></section>
${LAB}`,
qs:[{q:"¿Por qué un aumento de G sube el empleo en este modelo?",a:"Porque los impuestos de suma fija hacen más pobre al hogar; con el ocio como bien normal, consume menos ocio, es decir, trabaja más."}]},

{id:"dosperiodos", parte:"Unidad 4 · La economía cerrada", t:"Modelo de dos períodos: sin y con producción", sim:"dosp", html:String.raw`
<section><h3>Una economía sin producción (dotaciones)</h3><p class="lead">Si cada período hay una dotación fija \(Y_1,Y_2\) y no hay inversión, en una economía cerrada el ahorro agregado debe ser cero: la tasa de interés se ajusta para que el hogar representativo quiera consumir exactamente lo que hay.</p>
<div class="mj">\[C_1=Y_1-G_1,\quad C_2=Y_2-G_2\qquad\text{Euler: }\frac{u'(C_1)}{\beta u'(C_2)}=1+r\;\overset{\text{log}}{\Longrightarrow}\;1+r=\frac{Y_2-G_2}{\beta(Y_1-G_1)}\]</div>
<p>La tasa de interés refleja la escasez relativa de bienes hoy frente a mañana.</p></section>
<section><h3>Política fiscal: cambios transitorios y permanentes</h3><ul>
<li><b>Aumento transitorio de \(G_1\):</b> los recursos de hoy caen más que los de mañana; los hogares quieren pedir prestado, y la tasa de interés sube.</li>
<li><b>Aumento permanente:</b> afecta igual ambos períodos; el consumo cae en los dos y la tasa casi no se mueve.</li>
<li><b>Noticias de un mejor futuro (\(Y_2\) sube):</b> más deseo de consumir hoy, la tasa sube.</li></ul></section>
<section><h3>Con producción</h3>
<p>Con capital e inversión (la estación «Equilibrio general dinámico»), la oferta de producto depende de \(r\) por la oferta de trabajo (efecto sustitución intertemporal) y la demanda, por el consumo y la inversión. Un aumento transitorio de \(G\) sube \(r\), desplaza inversión y consumo, y aumenta el producto por la mayor oferta de trabajo. Un choque de productividad esperada (\(z_2\) sube) aumenta la inversión hoy.</p></section>
${LAB}`,
qs:[{q:"¿Por qué una guerra (gasto transitorio alto) suele coincidir con tasas de interés reales altas?",a:"Porque reduce los recursos disponibles hoy respecto a los de mañana; para que los hogares acepten consumir menos hoy, la tasa de interés real debe subir."}]},

{id:"dinamico", parte:"Unidad 4 · La economía cerrada", t:"Equilibrio general dinámico", sim:"din", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En un modelo de dos períodos, la tasa de interés conecta las decisiones de hoy con las de mañana: la firma decide cuánto capital tener mañana y el hogar cuánto ahorrar.</p></section>
<section><h3>La firma: inversión óptima</h3>
<div class="mj">\[V=\pi_1+\frac{\pi_2}{1+r},\quad I_1=K_2-(1-\delta)K_1\;\Longrightarrow\;\frac{\partial V}{\partial K_2}=-1+\frac{PMgK_2+(1-\delta)}{1+r}=0\;\Longrightarrow\;PMgK_2=r+\delta\]</div>
<p>Con \(N_2=1\): \(\alpha z_2K_2^{\alpha-1}=r+\delta\Rightarrow K_2^*=\left(\frac{\alpha z_2}{r+\delta}\right)^{1/(1-\alpha)}\).</p></section>
<section><h3>El hogar: ecuación de Euler</h3>
<div class="mj">\[\max\;\ln C_1+\beta\ln C_2\quad\text{s.a.}\quad C_1+\frac{C_2}{1+r}=W\;\Longrightarrow\;\frac{C_2}{C_1}=\beta(1+r)\]</div>
<p>Si \(\beta(1+r)>1\), el hogar ahorra hoy para consumir más mañana.</p></section>
<section><h3>Mercado laboral hoy</h3>
<div class="mj">\[w_1^*=(1-\alpha)z_1K_1^{\alpha}\left(\frac{1+\gamma}{h}\right)^{\alpha},\qquad N^s=\frac{h}{1+\gamma}\]</div></section>
${LAB}`,
deep:[
{k:"Ampliación",n:true,t:"La cuña fiscal, bien calculada",html:String.raw`<p>Con un impuesto \(\tau\) al salario, la condición ocio-consumo pasa a ser \(\frac{\gamma C}{l}=w(1-\tau)\).</p><p>Si el gobierno se queda con lo recaudado, la oferta de trabajo <b>no cambia</b>: con utilidad logarítmica el efecto ingreso compensa exactamente el efecto sustitución. La app afirmaba que el impuesto reduce la oferta laboral; eso solo es cierto si lo recaudado vuelve a los hogares como transferencia \(\tau wN\). En ese caso:</p><div class="mj">\[\gamma\,\frac{w(h-l)}{l}=w(1-\tau)\;\Longrightarrow\;l=\frac{\gamma h}{1+\gamma-\tau},\qquad N^s=\frac{h(1-\tau)}{1+\gamma-\tau}\]</div><p>El laboratorio muestra esta oferta con impuesto devuelto.</p>`},
{k:"Revisión",n:true,t:"El α fijo de la app",html:String.raw`<p>La página de Streamlit mostraba \(\alpha=0{,}33\) como variable, pero calculaba con \(\alpha=0{,}35\) fijo en el código. Aquí \(\alpha\) arranca en 0,35 para que los resultados coincidan con la app, y lo puedes mover.</p>`}],
py:`def equilibrio_dinamico(z1, z2, r, delta, K1, gamma, h, beta, alpha=0.35):
    """Módulo «Equilibrio general dinámico» de Economiapp (N2 = 1)."""
    K2 = ((alpha * z2) / (r + delta)) ** (1 / (1 - alpha))
    return {"K2": K2,
            "inversion": K2 - (1 - delta) * K1,
            "w1": (1 - alpha) * z1 * K1 ** alpha * ((1 + gamma) / h) ** alpha,
            "Ns": h / (1 + gamma),
            "C2_sobre_C1": beta * (1 + r)}`,
qs:[{q:"Si la productividad futura z₂ sube, ¿qué pasa con la inversión de hoy?",a:String.raw`Sube: \(K_2^*\) depende de \(z_2\) y \(I_1=K_2^*-(1-\delta)K_1\). Las expectativas sobre el futuro mueven la demanda de hoy.`}]},

{id:"visuales", parte:"Unidad 4 · La economía cerrada", t:"Visuales de cambios: todos los gráficos", html:String.raw`
<section><h3>Para qué sirve</h3><p class="lead">Los gráficos del curso en los que se estudian desplazamientos, juntos. Mueve una curva y el texto de abajo te dice qué cambió, qué pudo haberlo causado, el mecanismo y el resultado.</p>
<ul><li><b>Línea punteada:</b> posición inicial; <b>sólida:</b> posición actual.</li><li><b>Círculos:</b> arrástralos (o usa las flechas del teclado) para mover la curva.</li><li><b>Choques de ejemplo:</b> cargan casos típicos; después puedes seguir moviendo a mano.</li></ul>
<p class="hint">Los números son ilustrativos: sirven para ver direcciones y magnitudes relativas.</p></section>
<section><h3>Gráficos</h3><div data-vis="*"></div></section>`},

{id:"hechos", parte:"Unidad 5 · El crecimiento de largo plazo", t:"La importancia del crecimiento y los hechos estilizados", sim:"reg70", html:String.raw`
<section><h3>Por qué importa</h3><p class="lead">Las diferencias de ingreso entre países se explican por diferencias de crecimiento sostenidas durante décadas. Con un crecimiento de 2 % el ingreso se duplica en 35 años; con 7 %, en 10.</p>
<div class="mj">\[Y_t=Y_0(1+g)^t\qquad t_{\text{duplicación}}=\frac{\ln 2}{\ln(1+g)}\approx\frac{70}{g\,(\%)}\]</div></section>
<section><h3>Hechos estilizados (Kaldor, 1961, y Sala-i-Martin)</h3><ol>
<li>El producto por trabajador crece a una tasa aproximadamente constante.</li><li>El capital por trabajador también crece.</li><li>La tasa de rendimiento del capital es aproximadamente constante.</li><li>La razón capital-producto es estable.</li><li>Las participaciones del capital y del trabajo en el ingreso son estables.</li><li>Las tasas de crecimiento difieren mucho entre países.</li></ol>
<p>A ellos se suman: no hay convergencia absoluta entre todos los países, pero sí <b>convergencia condicional</b> (entre economías similares, las más pobres crecen más rápido), y el crecimiento está asociado con educación, inversión e instituciones.</p></section>
<section><h3>Colombia en el último siglo</h3><p>Según Ocampo, Kalmanovitz y el GRECO del Banco de la República, el PIB colombiano creció a tasas relativamente estables (cerca de 4 % a 5 % anual entre 1925 y 1980, más lento después), con PIB per cápita de ingreso medio y sin acercarse a los países desarrollados. Para el informe de la unidad, toma las series del DANE y del Banco de la República y aplica las herramientas de esta unidad: la regla del 70, la contabilidad del crecimiento y la comparación con el modelo de Solow.</p></section>
${LAB}`,
qs:[{q:"Si un país crece 3,5 % per cápita, ¿en cuánto tiempo duplica su ingreso?",a:"70/3,5 = 20 años."}]},

{id:"solow", parte:"Unidad 5 · El crecimiento de largo plazo", t:"El modelo de Solow-Swan con progreso técnico y población", sim:"solow", html:String.raw`
<section><h3>El modelo simple</h3><p class="lead">Producción con rendimientos constantes a escala y decrecientes en cada factor, ahorro como fracción fija del ingreso y depreciación constante.</p>
<div class="mj">\[Y=K^\alpha(AL)^{1-\alpha}\qquad \dot K=sY-\delta K\qquad \frac{\dot L}{L}=n\qquad\frac{\dot A}{A}=g\]</div>
<p>En unidades de trabajo efectivo, \(k=K/(AL)\) y \(y=k^\alpha\):</p>
<div class="mj">\[\dot k=s\,k^\alpha-(n+g+\delta)k\qquad k^*=\left(\frac{s}{n+g+\delta}\right)^{\frac{1}{1-\alpha}}\qquad y^*=\left(\frac{s}{n+g+\delta}\right)^{\frac{\alpha}{1-\alpha}}\]</div></section>
<section><h3>Resultados</h3><ul>
<li>En el estado estacionario, el producto por trabajador crece a \(g\): sin progreso técnico, el crecimiento per cápita se detiene.</li>
<li>Más ahorro o menos crecimiento poblacional elevan el <b>nivel</b> de ingreso, no su crecimiento de largo plazo.</li>
<li><b>Regla de oro:</b> el consumo de estado estacionario es máximo cuando \(f'(k)=n+g+\delta\), es decir, \(s=\alpha\).</li>
<li><b>Convergencia condicional:</b> cerca del estado estacionario, la brecha se cierra a la tasa \(\lambda=(1-\alpha)(n+g+\delta)\).</li></ul></section>
<section><h3>Reconsideración de los hechos</h3><p>Solow reproduce los hechos de Kaldor con \(g\) exógeno, pero no explica de dónde viene \(g\) ni las enormes diferencias de ingreso entre países con \(\alpha\approx 1/3\): las diferencias de ahorro observadas generan brechas de ingreso mucho menores que las observadas. Eso motiva las extensiones de las estaciones siguientes.</p></section>
${LAB}`,
qs:[{q:"Con s = 0,2, n + g + δ = 0,08 y α = 0,5, ¿cuánto vale k*?",a:"k* = (0,2/0,08)² = 6,25 y y* = √6,25 = 2,5."}]},

{id:"mrw", parte:"Unidad 5 · El crecimiento de largo plazo", t:"Mankiw, Romer y Weil, y las trampas de pobreza", sim:"mrw", html:String.raw`
<section><h3>Solow aumentado con capital humano</h3><p class="lead">Mankiw, Romer y Weil (1992) agregan el capital humano \(H\), acumulado con una fracción \(s_h\) del ingreso:</p>
<div class="mj">\[Y=K^\alpha H^\beta(AL)^{1-\alpha-\beta}\qquad\ln y^*=\frac{\alpha}{1-\alpha-\beta}\ln s_k+\frac{\beta}{1-\alpha-\beta}\ln s_h-\frac{\alpha+\beta}{1-\alpha-\beta}\ln(n+g+\delta)\]</div>
<p>Con \(\alpha=\beta=1/3\), las elasticidades del ingreso respecto al ahorro se duplican: el modelo explica cerca del 80 % de las diferencias de ingreso entre países y predice convergencia condicional lenta (alrededor de 2 % anual), como en los datos.</p></section>
<section><h3>Trampas de pobreza</h3>
<p>Si el ahorro, la fertilidad o la productividad dependen del nivel de desarrollo (los pobres no pueden ahorrar, hay costos fijos o externalidades), la curva \(s(k)f(k)\) puede cortar varias veces a \((n+\delta)k\): aparecen un equilibrio pobre estable, uno rico estable y un umbral inestable entre ellos. La historia importa: dos países idénticos pueden terminar en equilibrios distintos según dónde empezaron.</p></section>
${LAB}`,
qs:[{q:"¿Por qué en MRW el ahorro tiene un efecto mayor sobre el ingreso que en Solow?",a:"Porque más ingreso genera más capital humano, que a su vez eleva el ingreso: el exponente pasa de α/(1 − α) = 0,5 a α/(1 − α − β) = 1."}]},

{id:"ak", parte:"Unidad 5 · El crecimiento de largo plazo", t:"Crecimiento endógeno: el modelo AK, capital humano y externalidades", sim:"ak", html:String.raw`
<section><h3>El modelo AK</h3><p class="lead">Si el capital, entendido en sentido amplio, no tiene rendimientos decrecientes, el crecimiento puede sostenerse sin progreso técnico exógeno.</p>
<div class="mj">\[Y=AK\quad\Longrightarrow\quad\gamma=\frac{\dot k}{k}=sA-(n+\delta)\]</div>
<p>El crecimiento es <b>endógeno</b>: depende de la tasa de ahorro, de la productividad y de las políticas. No hay convergencia: los países con más ahorro crecen más para siempre.</p></section>
<section><h3>Fundamentos</h3><ul>
<li><b>Externalidades del conocimiento</b> (Romer, 1986): cada empresa tiene \(y_i=Ak_i^\alpha\bar k^{1-\alpha}\); al agregar, \(y=Ak\). El equilibrio competitivo crece menos que el óptimo social porque las empresas no internalizan la externalidad: hay espacio para subsidiar la inversión.</li>
<li><b>Capital humano</b> (Lucas, 1988): la educación tiene rendimientos constantes en la acumulación de conocimiento.</li>
<li><b>Gasto público productivo</b> (Barro, 1990): infraestructura que mantiene constante el producto marginal del capital privado.</li>
<li><b>Innovación</b> (Romer, 1990; Aghion y Howitt): investigación y desarrollo con nuevas variedades o calidad, motivadas por rentas monopólicas.</li></ul></section>
<section><h3>Evidencia y determinantes</h3><p>Las regresiones de crecimiento entre países (Barro; Sala-i-Martin, «Corrí dos millones de regresiones») encuentran como robustos el nivel inicial de ingreso (convergencia condicional), la inversión, la educación, la estabilidad macroeconómica, la apertura y la calidad de las instituciones. La literatura reciente (Acemoglu, Johnson y Robinson) pone a las instituciones como causa fundamental.</p></section>
${LAB}`,
qs:[{q:"En el modelo AK con s = 0,25, A = 0,4 y n + δ = 0,06, ¿a qué tasa crece la economía?",a:"γ = 0,25 × 0,4 − 0,06 = 4 % anual, para siempre."}]},

{id:"contabilidad", parte:"Unidad 5 · El crecimiento de largo plazo", t:"La contabilidad del crecimiento", sim:"contab", html:String.raw`
<section><h3>El residuo de Solow</h3><p class="lead">Diferenciando \(Y=AK^\alpha L^{1-\alpha}\) en logaritmos se separa el crecimiento en la contribución de cada factor y un residuo, la productividad total de los factores (PTF).</p>
<div class="mj">\[\frac{\dot Y}{Y}=\frac{\dot A}{A}+\alpha\frac{\dot K}{K}+(1-\alpha)\frac{\dot L}{L}\qquad\Longrightarrow\qquad g_A=g_Y-\alpha g_K-(1-\alpha)g_L\]</div>
<p>\(\alpha\) se mide como la participación del capital en el ingreso (en competencia perfecta, \(\alpha=rK/Y\)).</p></section>
<section><h3>Enfoques y extensiones</h3><ul><li><b>Primal:</b> con cantidades, como arriba.</li><li><b>Dual:</b> con precios de los factores, \(g_A=s_K g_r+s_L g_w\).</li><li><b>Capital humano:</b> \(Y=AK^\alpha(hL)^{1-\alpha}\), separa la calidad del trabajo y reduce el residuo.</li><li><b>Problemas:</b> medir el capital (inventario perpetuo), la utilización de factores y la calidad.</li></ul>
<p>Evidencia: Young (1995) mostró que el milagro de Asia del Este se explicó sobre todo por acumulación de factores. Para América Latina y Colombia, la PTF ha contribuido poco o negativamente desde 1980.</p></section>
${LAB}`,
qs:[{q:"Si gY = 4 %, gK = 5 %, gL = 2 % y α = 0,4, ¿cuánto creció la PTF?",a:"gA = 4 − 0,4·5 − 0,6·2 = 0,8 puntos porcentuales."}]},

{id:"ramsey", parte:"Unidad 5 · El crecimiento de largo plazo", t:"Ahorro óptimo: el modelo de Ramsey-Cass-Koopmans", sim:"ramsey", html:String.raw`
<section><h3>El problema</h3><p class="lead">En lugar de una tasa de ahorro fija, los hogares eligen cuánto consumir y ahorrar en cada momento para maximizar su utilidad de toda la vida.</p>
<div class="mj">\[\max\int_0^\infty e^{-(\rho-n)t}\frac{c^{1-\theta}-1}{1-\theta}dt\quad\text{s.a.}\quad\dot k=f(k)-c-(n+\delta)k\]</div></section>
<section><h3>Condiciones de optimalidad</h3>
<div class="mj">\[\frac{\dot c}{c}=\frac{f'(k)-\delta-\rho}{\theta}\qquad\lim_{t\to\infty}e^{-(\rho-n)t}\,u'(c)\,k=0\]</div>
<p>La primera es la ecuación de Euler (o regla de Keynes-Ramsey): el consumo crece si el rendimiento del capital supera la tasa de descuento; \(1/\theta\) mide cuánto se está dispuesto a sustituir consumo entre períodos. La segunda es la condición de transversalidad.</p></section>
<section><h3>El diagrama de fases</h3>
<p>\(\dot c=0\) es una recta vertical en \(f'(k^*)=\delta+\rho\); \(\dot k=0\) es la curva \(c=f(k)-(n+\delta)k\), con máximo en la regla de oro. El estado estacionario es un <b>punto de silla</b>: hay una única senda estable. Con \(\rho>n\), \(k^*<k_{oro}\) (regla de oro modificada): la impaciencia hace que nunca convenga acumular hasta la regla de oro, y no hay ineficiencia dinámica.</p></section>
${LAB}`,
qs:[{q:"Si los hogares se vuelven más pacientes (ρ baja), ¿qué pasa al momento del cambio?",a:"El capital no puede saltar, así que el consumo cae de golpe hasta la nueva senda de silla; luego consumo y capital crecen hacia un estado estacionario más alto."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"ramsey",links:["intertemporal","ciclovida","inversion","deuda","eq1","solow","ramsey"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola página para repasar antes del examen, con un buscador."}
];
const ALIAS={};
