// Macroeconomía 1 · contenido de la ruta (módulos de Economiapp + ramas)
// =====================================================================
// CONTENIDO: Macroeconomía 1. El tronco son los seis módulos de Economiapp, en el mismo orden.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"consumo", t:"Teoría del consumo", sim:"consumo", html:String.raw`
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

{id:"intertemporal", t:"Consumo intertemporal", sim:"inter", html:String.raw`
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

{id:"inversion", t:"Inversión", sim:"inv", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La empresa acumula capital mientras una máquina adicional le rinda más de lo que le cuesta tenerla. El costo de tenerla no es su precio sino el <b>costo de uso</b>: el interés que deja de ganar más el desgaste.</p>
<div class="mj">\[uc=r+\delta\qquad\text{(con precio del capital }P_K=1)\]</div></section>
<section><h3>Capital óptimo</h3>
<p>Con la función Cobb-Douglas \(Y=AK^{\alpha}N^{1-\alpha}\), el producto marginal del capital es \(PMgK=\alpha\frac{Y}{K}\). La empresa invierte hasta que:</p>
<div class="mj">\[PMgK=uc\;\Longrightarrow\;\alpha\frac{Y}{K}=r+\delta\;\Longrightarrow\;K^*=\alpha\,\frac{Y}{r+\delta}\]</div></section>
<section><h3>Inversión bruta y neta</h3>
<div class="mj">\[I_t^{bruta}=K^*-(1-\delta)K_{t-1}\qquad\qquad I_t^{neta}=K^*-K_{t-1}\]</div>
<p>La inversión bruta incluye la reposición del capital que se depreció; la neta es el crecimiento real del stock.</p></section>
${LAB}
<p class="link"><b>Regla rápida:</b> si \(PMgK>r+\delta\), conviene invertir; si es menor, conviene desinvertir. Con los datos del JSON de Economiapp, \(PMgK=0{,}15\) y \(uc=0{,}05+0{,}10=0{,}15\): la empresa ya está en su capital óptimo.</p>`,
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

{id:"gobierno", t:"Gobierno y política fiscal", sim:"gob", html:String.raw`
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

{id:"micro", t:"Microfundamentos: la firma y el hogar", sim:"micro", html:String.raw`
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

{id:"dinamico", t:"Equilibrio general dinámico", sim:"din", html:String.raw`
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
qs:[{q:"Si la productividad futura z₂ sube, ¿qué pasa con la inversión de hoy?",a:String.raw`Sube: \(K_2^*\) depende de \(z_2\) y \(I_1=K_2^*-(1-\delta)K_1\). Las expectativas sobre el futuro mueven la demanda de hoy.`}]}
];

const BRANCHES=[
{g:"Más allá de dos períodos", from:"intertemporal", items:[
 {id:"nperiodos", t:"Riqueza en N períodos", sim:"nper", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con más períodos la riqueza es la suma de los ingresos traídos a valor presente: cada período adicional se descuenta una vez más.</p>
<div class="mj">\[W=\sum_{t=1}^{N}\frac{Y_t}{(1+r)^{t-1}}\qquad\frac{\partial W}{\partial r}=-\sum_{t=2}^{N}\frac{(t-1)\,Y_t}{(1+r)^{t}}\qquad\frac{\partial W}{\partial Y_t}=\frac{1}{(1+r)^{t-1}}\]</div></section>
${LAB}`,
 qs:[{q:"¿Por qué ∂W/∂r es más negativa cuando los ingresos llegan más tarde?",a:"Porque cada ingreso se multiplica por (t − 1): los ingresos lejanos se descuentan más veces y son más sensibles a la tasa."}]}]},
{g:"Valoración de la empresa", from:"inversion", items:[
 {id:"tobin", t:"La q de Tobin", sim:"tobin", html:String.raw`
<section><h3>La idea</h3><p class="lead">James Tobin propuso comparar cuánto valora la bolsa a una empresa con cuánto costaría reconstruirla desde cero.</p>
<div class="mj">\[q=\frac{\text{Valor de mercado }(VM)}{\text{Costo de reposición }(CR)}\]</div>
<p>Si \(q>1\), el mercado valora el capital por más de lo que cuesta instalarlo: conviene invertir. Si \(q<1\), es más barato comprar empresas existentes que máquinas nuevas.</p></section>
<section><h3>La q marginal y los costos de ajuste</h3>
<p>Si instalar capital tiene un costo de ajuste \(C(I_t)\), la condición de primer orden respecto a \(K_{t+1}\) da:</p>
<div class="mj">\[1+C'(I_t)=\frac{f'(K_{t+1})+(1-\delta)-C'(I_{t+1})}{1+r}\]</div>
<p>El término \(1+C'(I_t)\) es la <b>q marginal</b>: lo que realmente cuesta instalar una unidad más de capital, incluidas las interrupciones en la fábrica.</p></section>
${LAB}`}]},
{g:"Política fiscal", from:"gobierno", items:[
 {id:"estructural", t:"Balance estructural y cíclico", sim:"estr", html:String.raw`
<section><h3>La idea</h3><p class="lead">El balance observado puede engañar: en un auge parece bueno solo porque el PIB está alto. El balance estructural mide lo que el gobierno recaudaría con la economía en su nivel potencial \(Y^*\).</p>
<div class="mj">\[BS^*=(T_0+tY^*)-G\qquad\qquad\text{Componente cíclico}=BS-BS^*=t\,(Y-Y^*)\]</div></section>
${LAB}`}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"gobierno",links:["consumo","intertemporal","inversion","gobierno","micro","dinamico"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola página para repasar antes del examen, con un buscador."}
];
