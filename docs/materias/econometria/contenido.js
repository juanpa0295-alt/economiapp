// Econometría · contenido de la ruta
const TRUNK = [
{id:"variables", t:"Variables y escalas", html:`
<section><h3>La idea</h3>
<p class="lead">Una variable es una característica que cambia de una observación a otra: el salario de una persona, el precio de un producto, el PIB de un año. En un modelo siempre hay una <b>variable dependiente</b> <span class="m">y</span> (la que queremos explicar) y una o varias <b>independientes</b> o regresoras <span class="m">x</span> (las que la explican).</p></section>
<section><h3>Tipos y escalas de medición</h3>
<div class="tbl"><table><tr><th>Escala</th><th>Qué permite</th><th>Ejemplo</th><th>En el modelo</th></tr>
<tr><td>Nominal</td><td>Solo clasificar</td><td>Departamento, sexo</td><td>Variables dicotómicas</td></tr>
<tr><td>Ordinal</td><td>Clasificar y ordenar</td><td>Estrato 1–6, nivel educativo</td><td>Dicotómicas por categoría</td></tr>
<tr><td>Intervalo</td><td>Restar; el cero es arbitrario</td><td>Temperatura °C, año</td><td>Numérica</td></tr>
<tr><td>Razón</td><td>Restar y dividir; cero real</td><td>Ingreso, horas trabajadas</td><td>Numérica, admite logaritmos</td></tr></table></div>
<p>Las cuantitativas pueden ser <b>continuas</b> (ingreso) o <b>discretas</b> (número de hijos).</p></section>
<section><h3>Formas funcionales y cómo se leen</h3>
<div class="tbl"><table><tr><th>Modelo</th><th>Lectura de <span class="m">β₁</span></th></tr>
<tr><td><span class="m">y = β₀ + β₁x</span></td><td>Si x sube 1 unidad, y cambia β₁ unidades</td></tr>
<tr><td><span class="m">ln y = β₀ + β₁x</span></td><td>Si x sube 1 unidad, y cambia aprox. 100·β₁ %</td></tr>
<tr><td><span class="m">y = β₀ + β₁ ln x</span></td><td>Si x sube 1 %, y cambia β₁/100 unidades</td></tr>
<tr><td><span class="m">ln y = β₀ + β₁ ln x</span></td><td>Elasticidad: si x sube 1 %, y cambia β₁ %</td></tr></table></div></section>
<p class="warn"><b>Error común:</b> codificar una variable nominal como 1, 2, 3 y meterla como número. El modelo asumiría que la distancia entre la categoría 1 y la 2 es igual a la de la 2 y la 3, lo cual no tiene sentido.</p>`,
deep:[
{k:"Intuición", t:"Por qué el logaritmo se lee como porcentaje", html:`<p>Para cambios pequeños, <span class="m">Δln y ≈ Δy / y</span>, que es el cambio relativo. Por eso en <span class="m">ln y = β₀ + β₁x</span>, un aumento de una unidad en x cambia y en aproximadamente <span class="m">100·β₁ %</span>.</p><p>La aproximación se degrada cuando β₁ es grande. El cambio exacto es:</p><div class="eq">%Δy = 100·(e<sup>β₁</sup> − 1)<span class="note">Con β₁ = 0,05 la aproximación da 5 % y el exacto 5,13 %. Con β₁ = 0,40 da 40 % contra 49,2 %.</span></div>`},
{k:"Práctica", t:"Variables de control y variables proxy", html:`<p>Una <b>variable de control</b> se incluye para que el efecto de la variable de interés se mida ceteris paribus, aunque su coeficiente no nos interese. Una <b>proxy</b> reemplaza algo que no se puede medir: el puntaje de una prueba como proxy de habilidad, el consumo de energía como proxy de actividad económica.</p><p>Una buena proxy debe estar muy correlacionada con la variable inobservable. Si no lo está, el sesgo por variable omitida se reduce poco.</p>`}],
code:{r:String.raw`df$ln_y   <- log(df$y)
df$estrato <- factor(df$estrato)   # R crea las dicotómicas solo
m <- lm(ln_y ~ log(x) + estrato, data = df)
summary(m)`, stata:String.raw`gen ln_y = ln(y)
gen ln_x = ln(x)
reg ln_y ln_x i.estrato   // i. crea dicotómicas y omite la base`, py:String.raw`import numpy as np
import statsmodels.formula.api as smf

df["ln_y"] = np.log(df["y"])
m = smf.ols("ln_y ~ np.log(x) + C(estrato)", data=df).fit()
print(m.summary())`},
q:"El estrato socioeconómico va de 1 a 6. ¿Qué escala es y cómo lo incluirías en una regresión de gasto en servicios?",
a:"Es ordinal: hay orden, pero la distancia entre estratos no es constante. Lo más seguro es crear dicotómicas para cada estrato y omitir una como categoría base (por ejemplo, estrato 1). Cada coeficiente se lee como la diferencia promedio frente a ese estrato base."},

{id:"datos", t:"Estructura y formato de los datos", html:`
<section><h3>Los cuatro tipos de base de datos</h3>
<div class="tbl"><table><tr><th>Estructura</th><th>Índice</th><th>Ejemplo</th></tr>
<tr><td>Corte transversal</td><td><span class="m">i</span></td><td>500 hogares encuestados en marzo de 2026</td></tr>
<tr><td>Serie de tiempo</td><td><span class="m">t</span></td><td>Inflación mensual de Colombia 2000–2026</td></tr>
<tr><td>Cortes transversales agrupados (pooled)</td><td><span class="m">i, t</span> con individuos distintos</td><td>Encuesta de hogares 2024 y 2025, con hogares diferentes cada año</td></tr>
<tr><td>Panel (datos longitudinales)</td><td><span class="m">i, t</span> con los mismos individuos</td><td>Las mismas 100 empresas seguidas durante 8 años</td></tr></table></div>
<p>En series de tiempo <b>el orden importa</b>: cada fila es un momento y no se puede barajar. En corte transversal el orden es irrelevante.</p></section>
<section><h3>Formato largo y formato ancho</h3>
<p>En formato <b>largo</b> cada fila es una combinación individuo-periodo (empresa 1 año 2020, empresa 1 año 2021…). En formato <b>ancho</b> cada fila es un individuo y cada periodo es una columna (ventas_2020, ventas_2021…). Para estimar modelos casi siempre se necesita el formato largo, porque así cada fila se convierte en una fila de la matriz <span class="m">X</span>.</p></section>
<p class="link"><b>Conexión con el parcial:</b> la prueba de Chow nace justamente de los datos agrupados y de las series de tiempo: ¿la relación entre las variables es la misma antes y después de un evento, o en dos grupos distintos?</p>`,
deep:[
{k:"Práctica", t:"Del formato ancho al largo, con un ejemplo", html:`<div class="tbl"><table><tr><th>empresa</th><th>ventas_2024</th><th>ventas_2025</th></tr><tr><td>A</td><td class="num">120</td><td class="num">135</td></tr><tr><td>B</td><td class="num">80</td><td class="num">78</td></tr></table></div><p>se convierte en</p><div class="tbl"><table><tr><th>empresa</th><th>año</th><th>ventas</th></tr><tr><td>A</td><td class="num">2024</td><td class="num">120</td></tr><tr><td>A</td><td class="num">2025</td><td class="num">135</td></tr><tr><td>B</td><td class="num">2024</td><td class="num">80</td></tr><tr><td>B</td><td class="num">2025</td><td class="num">78</td></tr></table></div><p>El código de la pestaña «En el software» hace exactamente este cambio.</p>`},
{k:"Conceptos", t:"Panel balanceado y no balanceado", html:`<p>Un panel es <b>balanceado</b> si todos los individuos aparecen en todos los periodos (n individuos × T periodos = nT filas). Es <b>no balanceado</b> si faltan algunas combinaciones, por ejemplo empresas que cierran o entran a la muestra. Los métodos de panel funcionan con ambos, pero si la salida de la muestra depende de la variable dependiente (las empresas que quiebran son las de peores ventas) aparece sesgo de selección por desgaste.</p>`}],
code:{r:String.raw`library(tidyr)
largo <- pivot_longer(ancho, cols = starts_with("ventas_"),
                      names_to = "anio", names_prefix = "ventas_",
                      values_to = "ventas")`, stata:String.raw`reshape long ventas_, i(empresa) j(anio)
rename ventas_ ventas
xtset empresa anio   // declara el panel
* para una sola serie de tiempo: tsset anio`, py:String.raw`largo = ancho.melt(id_vars="empresa", var_name="anio", value_name="ventas")
largo["anio"] = largo["anio"].str.replace("ventas_", "").astype(int)
largo = largo.sort_values(["empresa", "anio"])`},
q:"Tienes la Gran Encuesta Integrada de Hogares de 2023 y de 2024, con personas distintas en cada año. ¿Qué estructura es?",
a:"Cortes transversales agrupados (pooled), no panel, porque no se sigue a las mismas personas. Con esta base sí puedes preguntar si los coeficientes cambiaron entre 2023 y 2024, que es exactamente lo que evalúa la prueba de Chow."},

{id:"matrices", t:"Notación matricial", html:`
<section><h3>Del renglón a la matriz</h3>
<p class="lead">Cada observación cumple <span class="m">yᵢ = β₀ + β₁xᵢ₁ + … + βₖ₋₁xᵢ,ₖ₋₁ + uᵢ</span>. Si apilamos las <span class="m">n</span> observaciones obtenemos un solo sistema:</p>
<div class="eq">y = Xβ + u<span class="note">y: n×1 · X: n×k (primera columna de unos para el intercepto) · β: k×1 · u: n×1</span></div></section>
<section><h3>Ejemplo con 4 observaciones y una regresora</h3>
<div class="tbl"><table><tr><th>Obs.</th><th>y (ventas)</th><th>1</th><th>x (publicidad)</th></tr>
<tr><td>1</td><td class="num">12</td><td class="num">1</td><td class="num">2</td></tr>
<tr><td>2</td><td class="num">15</td><td class="num">1</td><td class="num">3</td></tr>
<tr><td>3</td><td class="num">20</td><td class="num">1</td><td class="num">5</td></tr>
<tr><td>4</td><td class="num">22</td><td class="num">1</td><td class="num">6</td></tr></table></div>
<p>Las dos columnas de la derecha forman <span class="m">X</span> (4×2). Entonces <span class="m">X′X</span> es 2×2 y contiene <span class="m">n</span>, <span class="m">Σx</span> y <span class="m">Σx²</span>.</p></section>
<section><h3>Operaciones que vas a usar</h3>
<ul><li><b>Transpuesta</b> <span class="m">X′</span>: filas pasan a columnas.</li>
<li><b>Producto</b>: (n×k)·(k×1) da n×1. Las dimensiones internas deben coincidir.</li>
<li><b>Inversa</b> <span class="m">(X′X)⁻¹</span>: existe solo si ninguna columna de <span class="m">X</span> es combinación lineal exacta de otras (rango completo).</li></ul></section>
<p class="warn"><b>Error común:</b> olvidar la columna de unos. Sin ella el modelo se fuerza a pasar por el origen.</p>`,
deep:[
{k:"Cálculo", t:"Resolver el ejemplo a mano con matrices", html:`<div class="eq">X′X = [ 4 &nbsp; 16 ; 16 &nbsp; 74 ] &nbsp;&nbsp; X′y = [ 69 ; 301 ]<span class="note">n = 4, Σx = 16, Σx² = 74, Σy = 69, Σxy = 301</span></div><div class="eq">det(X′X) = 4·74 − 16² = 40 &nbsp;&nbsp; (X′X)⁻¹ = <span class="frac"><span>1</span><span>40</span></span>[ 74 &nbsp; −16 ; −16 &nbsp; 4 ]</div><div class="eq">β̂ = (X′X)⁻¹X′y = <span class="frac"><span>1</span><span>40</span></span>[ 74·69 − 16·301 ; −16·69 + 4·301 ] = [ 7,25 ; 2,5 ]</div><p>Es el mismo resultado que obtendrás con las fórmulas de la regresión simple en la estación siguiente.</p>`},
{k:"Conceptos", t:"Rango, inversa y multicolinealidad perfecta", html:`<p>El <b>rango</b> de X es el número de columnas linealmente independientes. Si rango(X) = k, entonces X′X es invertible y β̂ es único. Si una columna se puede escribir exactamente como combinación de otras (por ejemplo, incluir ingreso en pesos y en miles de pesos), el rango cae, det(X′X) = 0 y no existe la inversa. Eso es la multicolinealidad perfecta, y por eso aparece como supuesto de MCO.</p>`}],
code:{r:String.raw`X <- cbind(1, c(2, 3, 5, 6))
y <- c(12, 15, 20, 22)
t(X) %*% X
solve(t(X) %*% X) %*% t(X) %*% y   # 7.25 y 2.5`, stata:String.raw`mata:
X = (1,2 \ 1,3 \ 1,5 \ 1,6)
y = (12 \ 15 \ 20 \ 22)
X'X
invsym(X'X) * X'y
end`, py:String.raw`import numpy as np
X = np.column_stack([np.ones(4), [2, 3, 5, 6]])
y = np.array([12, 15, 20, 22])
X.T @ X
np.linalg.inv(X.T @ X) @ X.T @ y   # array([7.25, 2.5])`},
q:"Con n = 50 observaciones, 3 regresoras e intercepto, ¿qué dimensiones tienen X y X′X?",
a:"k = 4 (tres regresoras más el intercepto). X es 50×4 y X′X es 4×4."},

{id:"mco-simple", t:"Regresión simple por MCO", sim:"mco", html:`
<section><h3>Qué hace MCO</h3>
<p class="lead">Mínimos cuadrados ordinarios elige la recta que hace más pequeña la suma de los residuos al cuadrado, <span class="m">Σûᵢ²</span>. El residuo es la distancia vertical entre el dato y la recta estimada.</p>
<div class="eq">β̂₁ = <span class="frac"><span>Σ(xᵢ − x̄)(yᵢ − ȳ)</span><span>Σ(xᵢ − x̄)²</span></span>&nbsp;&nbsp;&nbsp; β̂₀ = ȳ − β̂₁x̄</div></section>
<section><h3>Laboratorio: intenta ganarle a MCO</h3><div class="sim" id="sim"></div></section>
<section><h3>Descomposición de la variación</h3>
<div class="eq">SCT = SCE + SCR &nbsp;&nbsp;&nbsp; R² = <span class="frac"><span>SCE</span><span>SCT</span></span> = 1 − <span class="frac"><span>SCR</span><span>SCT</span></span><span class="note">SCT: suma de cuadrados total · SCE: explicada · SCR: de los residuos</span></div>
<p>Guarda bien la <b>SCR</b>: es la pieza central de la prueba F y de la prueba de Chow.</p></section>
<p class="warn"><b>Error común:</b> leer un R² alto como prueba de causalidad. El R² solo dice qué tanto de la variación de y acompaña a la de x dentro de la muestra.</p>`,
deep:[
{k:"Demostración", t:"De dónde salen las fórmulas", html:`<p>Minimizamos <span class="m">S = Σ(yᵢ − β₀ − β₁xᵢ)²</span>. Derivando e igualando a cero:</p><div class="eq">∂S/∂β₀ = −2Σûᵢ = 0 &nbsp;&nbsp;&nbsp; ∂S/∂β₁ = −2Σxᵢûᵢ = 0</div><p>La primera condición da <span class="m">ȳ = β̂₀ + β̂₁x̄</span>. Sustituyendo en la segunda y despejando se obtiene β̂₁. Estas dos condiciones implican propiedades que siempre se cumplen con intercepto: los residuos suman cero, no están correlacionados con x, y la recta pasa por el punto (x̄, ȳ).</p>`},
{k:"Conceptos", t:"El R² ajustado", html:`<div class="eq">R̄² = 1 − <span class="frac"><span>SCR / (n − k)</span><span>SCT / (n − 1)</span></span></div><p>El R² nunca baja al agregar una variable, aunque sea irrelevante. El R² ajustado penaliza cada parámetro adicional y puede bajar. Sirve para comparar modelos con la misma variable dependiente y distinto número de regresoras, no para decidir si una variable es significativa (para eso está la prueba t).</p>`}],
code:{r:String.raw`m <- lm(ventas ~ publicidad, data = df)
summary(m)          # coeficientes, R², prueba F
sum(resid(m)^2)     # SCR`, stata:String.raw`reg ventas publicidad
display e(rss)      // SCR
display e(r2)       // R²`, py:String.raw`m = smf.ols("ventas ~ publicidad", data=df).fit()
m.params, m.ssr, m.rsquared`},
q:"Con los datos de la estación anterior (x̄ = 4, ȳ = 17,25), Σ(x−x̄)(y−ȳ) = 25 y Σ(x−x̄)² = 10. Calcula β̂₁ y β̂₀.",
a:"β̂₁ = 25/10 = 2,5. β̂₀ = 17,25 − 2,5·4 = 7,25. Cada unidad adicional de publicidad se asocia con 2,5 unidades más de ventas."},

{id:"mco-matricial", t:"Regresión múltiple en forma matricial", html:`
<section><h3>El estimador</h3>
<div class="eq">β̂ = (X′X)⁻¹X′y<span class="note">Sale de minimizar u′u = (y − Xβ)′(y − Xβ) y despejar β</span></div>
<p class="lead">Cada <span class="m">β̂ⱼ</span> se lee <b>ceteris paribus</b>: el efecto de <span class="m">xⱼ</span> sobre <span class="m">y</span> manteniendo constantes las demás regresoras.</p></section>
<section><h3>Varianza y error estándar</h3>
<div class="eq">Var(β̂) = σ²(X′X)⁻¹ &nbsp;&nbsp;&nbsp; σ̂² = <span class="frac"><span>SCR</span><span>n − k</span></span><span class="note">La raíz de cada elemento de la diagonal de σ̂²(X′X)⁻¹ es el error estándar de ese coeficiente</span></div></section>
<section><h3>Grados de libertad</h3>
<p>Se pierde un grado de libertad por cada parámetro estimado. Por eso se divide entre <span class="m">n − k</span> y no entre <span class="m">n</span>. Este mismo conteo aparece en el denominador de la prueba de Chow como <span class="m">n − 2k</span>, porque ahí se estiman dos modelos.</p></section>`,
deep:[
{k:"Demostración", t:"Derivación de β̂ en una línea", html:`<div class="eq">u′u = y′y − 2β′X′y + β′X′Xβ</div><div class="eq">∂(u′u)/∂β = −2X′y + 2X′Xβ = 0 &nbsp;⇒&nbsp; X′Xβ̂ = X′y &nbsp;⇒&nbsp; β̂ = (X′X)⁻¹X′y</div><p>Las ecuaciones <span class="m">X′Xβ̂ = X′y</span> se llaman <b>ecuaciones normales</b>. Equivalen a <span class="m">X′û = 0</span>: los residuos son ortogonales a cada columna de X.</p>`},
{k:"Intuición", t:"Teorema de Frisch-Waugh-Lovell", html:`<p>¿Qué significa exactamente "manteniendo constantes las demás"? El teorema lo responde: el β̂₁ de la regresión múltiple es igual al que obtienes en dos pasos:</p><ol><li>Regresa x₁ sobre las demás regresoras y guarda el residuo r̂₁ (la parte de x₁ que las otras no explican).</li><li>Regresa y sobre r̂₁.</li></ol><p>Así, β̂₁ usa solo la variación de x₁ que no comparte con las demás. Por eso, si x₁ casi no tiene variación propia (multicolinealidad), su estimación es imprecisa.</p>`}],
code:{r:String.raw`m <- lm(y ~ x1 + x2 + x3, data = df)
vcov(m)       # σ̂²(X'X)⁻¹
sigma(m)^2    # σ̂² = SCR/(n−k)`, stata:String.raw`reg y x1 x2 x3
matrix list e(V)     // matriz de varianzas
display e(rmse)^2    // σ̂²`, py:String.raw`m = smf.ols("y ~ x1 + x2 + x3", data=df).fit()
m.cov_params()   # σ̂²(X'X)⁻¹
m.mse_resid      # σ̂²`},
q:"¿Por qué en la prueba de Chow el denominador tiene n − 2k grados de libertad?",
a:"Porque el modelo no restringido se estima por separado en las dos submuestras, y cada una gasta k parámetros. En total se estiman 2k parámetros con n observaciones."},

{id:"supuestos", t:"Supuestos de Gauss-Markov", html:`
<section><h3>Lo que necesita MCO para funcionar bien</h3>
<div class="tbl"><table><tr><th>Supuesto</th><th>Si falla…</th><th>Rama</th></tr>
<tr><td>1. Lineal en los parámetros</td><td>Hay que cambiar de método</td><td>Elección discreta</td></tr>
<tr><td>2. Muestreo aleatorio</td><td>Sesgo de selección</td><td>—</td></tr>
<tr><td>3. Sin multicolinealidad perfecta</td><td>(X′X) no se puede invertir</td><td>Multicolinealidad</td></tr>
<tr><td>4. Media condicional cero: E(u|X) = 0</td><td>β̂ sesgado e inconsistente</td><td>Especificación, VI</td></tr>
<tr><td>5. Homocedasticidad: Var(u|X) = σ²</td><td>Errores estándar incorrectos</td><td>Heterocedasticidad</td></tr>
<tr><td>6. Sin autocorrelación (series)</td><td>Errores estándar incorrectos</td><td>Autocorrelación</td></tr>
<tr><td>7. Normalidad de u</td><td>t y F solo valen en muestras grandes</td><td>—</td></tr></table></div>
<p>Con los supuestos 1 a 6, MCO es <b>MELI</b>: el mejor estimador lineal insesgado.</p></section>
<p class="link"><b>Conexión con Chow:</b> la prueba de Chow también asume que la varianza del error es la misma en las dos submuestras. Si no lo es, el estadístico F no sigue la distribución que creemos.</p>`,
deep:[
{k:"Demostración", t:"Insesgadez en dos líneas", html:`<div class="eq">β̂ = (X′X)⁻¹X′(Xβ + u) = β + (X′X)⁻¹X′u</div><div class="eq">E(β̂|X) = β + (X′X)⁻¹X′E(u|X) = β &nbsp;&nbsp; si E(u|X) = 0</div><p>Solo se usaron los supuestos 1, 3 y 4. La homocedasticidad no hace falta para la insesgadez; hace falta para que <span class="m">Var(β̂) = σ²(X′X)⁻¹</span> sea la fórmula correcta y para la eficiencia.</p>`},
{k:"Conceptos", t:"Insesgadez frente a consistencia", html:`<p><b>Insesgado</b>: en promedio, sobre muchas muestras del mismo tamaño, acierta. <b>Consistente</b>: a medida que n crece, el estimador se concentra en el valor verdadero. Un estimador puede ser sesgado en muestras pequeñas y aun así consistente (VI y logit son ejemplos). Si E(u|X) ≠ 0 por variable omitida, MCO no es ni lo uno ni lo otro: más datos no arreglan el problema.</p>`}],
code:{r:String.raw`par(mfrow = c(2, 2)); plot(m)   # residuos vs ajustados, QQ, etc.
shapiro.test(resid(m))           # normalidad`, stata:String.raw`reg y x1 x2
rvfplot, yline(0)     // residuos vs ajustados
predict uhat, resid
swilk uhat            // normalidad`, py:String.raw`import matplotlib.pyplot as plt
from scipy import stats
plt.scatter(m.fittedvalues, m.resid); plt.axhline(0)
stats.shapiro(m.resid)`},
q:"Si hay heterocedasticidad, ¿los coeficientes MCO quedan sesgados?",
a:"No. Siguen siendo insesgados. Lo que se daña es la varianza estimada: los errores estándar y, por tanto, las pruebas t y F dejan de ser confiables. Ya no son MELI."},

{id:"inferencia", t:"Inferencia: pruebas t y F", exam:true, html:`
<section><h3>Prueba t: un solo coeficiente</h3>
<div class="eq">t = <span class="frac"><span>β̂ⱼ − βⱼ⁰</span><span>ee(β̂ⱼ)</span></span> ~ t(n − k)</div></section>
<section><h3>Prueba F: varias restricciones a la vez</h3>
<p class="lead">Comparas un modelo <b>restringido</b> (imponiendo la hipótesis nula) con uno <b>no restringido</b>. Si al imponer la restricción la SCR crece mucho, la restricción no es creíble.</p>
<div class="eq">F = <span class="frac"><span>(SCR<sub>R</sub> − SCR<sub>NR</sub>) / q</span><span>SCR<sub>NR</sub> / (n − k)</span></span> ~ F(q, n − k)<span class="note">q: número de restricciones · k: parámetros del modelo no restringido</span></div>
<p>Regla: si <span class="m">F &gt; F<sub>crítico</sub></span> (o p-valor &lt; α), se rechaza H₀.</p></section>
<p class="link"><b>Clave para el parcial:</b> la prueba de Chow <b>es</b> esta prueba F. El modelo restringido es "los mismos coeficientes para todos" y el no restringido es "coeficientes distintos en cada submuestra".</p>`,
deep:[
{k:"Fórmula", t:"La prueba F en términos de R²", html:`<div class="eq">F = <span class="frac"><span>(R²<sub>NR</sub> − R²<sub>R</sub>) / q</span><span>(1 − R²<sub>NR</sub>) / (n − k)</span></span></div><p>Sale de dividir numerador y denominador entre SCT. Solo vale si los dos modelos tienen <b>la misma variable dependiente</b>. Para la significancia global (todas las pendientes iguales a cero), R²<sub>R</sub> = 0 y queda <span class="m">F = [R²/(k−1)] / [(1−R²)/(n−k)]</span>.</p>`},
{k:"Conceptos", t:"p-valor, errores tipo I y II", html:`<p>El <b>p-valor</b> es la probabilidad de observar un estadístico tan extremo como el obtenido si H₀ fuera cierta. No es la probabilidad de que H₀ sea cierta.</p><div class="tbl"><table><tr><th></th><th>H₀ cierta</th><th>H₀ falsa</th></tr><tr><td>Rechazo H₀</td><td>Error tipo I (prob. α)</td><td>Correcto (potencia)</td></tr><tr><td>No rechazo</td><td>Correcto</td><td>Error tipo II</td></tr></table></div><p>"No rechazar" no es lo mismo que "aceptar": puede que simplemente no haya suficiente información para detectar el efecto.</p>`}],
code:{r:String.raw`library(car)
linearHypothesis(m, c("x1 = 0", "x2 = 0"))
anova(m_restringido, m)   # F con las SCR`, stata:String.raw`reg y x1 x2 x3
test x1 x2          // H0: b1 = b2 = 0
test x1 = x2        // H0: b1 = b2`, py:String.raw`m.f_test("x1 = 0, x2 = 0")
m.compare_f_test(m_restringido)   # (F, p, q)`},
q:"En y = β₀ + β₁x₁ + β₂x₂ + u, ¿cuántas restricciones tiene H₀: β₁ = β₂ = 0?",
a:"q = 2. Se estima el modelo restringido solo con intercepto y se compara su SCR con la del modelo completo."},

{id:"dicotomicas", t:"Variables dicotómicas e interacciones", exam:true, html:`
<section><h3>Cambio en el intercepto</h3>
<p class="lead">Una dicotómica <span class="m">D</span> vale 1 si la observación pertenece a un grupo o periodo y 0 si no.</p>
<div class="eq">y = β₀ + δ₀D + β₁x + u<span class="note">Grupo D = 0: intercepto β₀ · Grupo D = 1: intercepto β₀ + δ₀ · misma pendiente</span></div></section>
<section><h3>Cambio en la pendiente: interacción</h3>
<div class="eq">y = β₀ + δ₀D + β₁x + δ₁(D·x) + u<span class="note">Grupo D = 1: intercepto β₀ + δ₀ y pendiente β₁ + δ₁</span></div>
<p>Con este único modelo puedes probar si cambió el intercepto (δ₀), la pendiente (δ₁) o ambos.</p></section>
<p class="warn"><b>Trampa de las dicotómicas:</b> con m categorías e intercepto, se incluyen m − 1 dicotómicas. Si metes las m, la suma de ellas es igual a la columna de unos y X′X no se puede invertir.</p>`,
deep:[
{k:"Fórmula", t:"Dicotómicas en modelos con logaritmo", html:`<p>En <span class="m">ln y = β₀ + δ₀D + β₁x + u</span>, el efecto de pertenecer al grupo D = 1 es aproximadamente <span class="m">100·δ₀ %</span>. El exacto:</p><div class="eq">%Δy = 100·(e<sup>δ₀</sup> − 1)</div><p>Ejemplo: δ₀ = −0,15 en una ecuación de salarios para mujeres. Aproximado: −15 %. Exacto: 100·(e<sup>−0,15</sup> − 1) = −13,9 %.</p>`},
{k:"Aplicación", t:"Diferencias en diferencias", html:`<p>Con dos grupos (tratado T y control) y dos periodos (antes y después P):</p><div class="eq">y = β₀ + δ₀T + δ₁P + δ₂(T·P) + u</div><p><span class="m">δ₂</span> es el efecto del tratamiento: cuánto más cambió el grupo tratado que el de control. Funciona si, sin tratamiento, ambos grupos habrían seguido tendencias paralelas. Es una de las herramientas más usadas en evaluación de políticas públicas.</p>`}],
code:{r:String.raw`df$D <- as.numeric(df$anio >= 2020)
m <- lm(y ~ x * D, data = df)   # incluye x, D y x:D
summary(m)`, stata:String.raw`gen D = (anio >= 2020)
reg y c.x##i.D      // x, D y la interacción`, py:String.raw`df["D"] = (df["anio"] >= 2020).astype(int)
m = smf.ols("y ~ x * D", data=df).fit()`},
q:"Quieres controlar por trimestre en un modelo con intercepto. ¿Cuántas dicotómicas incluyes?",
a:"Tres. El trimestre omitido queda como base, y cada coeficiente mide la diferencia frente a ese trimestre."},

{id:"chow", t:"Cambio estructural y prueba de Chow", exam:true, sim:"chow", html:`
<section><h3>La pregunta</h3>
<p class="lead">¿Los coeficientes del modelo son los mismos en dos submuestras? Por ejemplo, antes y después de una reforma tributaria, de la pandemia, o entre hombres y mujeres. Si no lo son, hay <b>cambio estructural</b> y un solo modelo para toda la muestra sería engañoso.</p>
<div class="eq">H₀: β<sup>(1)</sup> = β<sup>(2)</sup> &nbsp;(no hay cambio) &nbsp;&nbsp;&nbsp; H₁: β<sup>(1)</sup> ≠ β<sup>(2)</sup></div></section>
<section><h3>El estadístico</h3>
<div class="eq">F = <span class="frac"><span>[SCR<sub>R</sub> − (SCR₁ + SCR₂)] / k</span><span>(SCR₁ + SCR₂) / (n − 2k)</span></span> ~ F(k, n − 2k)<span class="note">SCR<sub>R</sub>: modelo con toda la muestra · SCR₁, SCR₂: cada submuestra por separado · k: parámetros incluido el intercepto</span></div></section>
<section><h3>Paso a paso para el examen</h3>
<ol class="steps">
<li>Estima el modelo con <b>toda</b> la muestra y anota SCR<sub>R</sub> (n observaciones).</li>
<li>Estima el mismo modelo en la submuestra 1 (n₁ obs.) y en la 2 (n₂ obs.). Anota SCR₁ y SCR₂.</li>
<li>Suma: SCR<sub>NR</sub> = SCR₁ + SCR₂.</li>
<li>Calcula F con k restricciones y n − 2k grados de libertad en el denominador.</li>
<li>Busca F crítico en la tabla F(k, n − 2k) al nivel α (o usa el p-valor).</li>
<li>Concluye: si F &gt; F crítico, rechazas H₀ y hay evidencia de cambio estructural.</li></ol></section>
<section><h3>Ejemplo resuelto</h3>
<p>n = 30 (15 + 15), modelo simple (k = 2). SCR<sub>R</sub> = 420, SCR₁ = 120, SCR₂ = 150.</p>
<div class="eq">F = <span class="frac"><span>(420 − 270) / 2</span><span>270 / 26</span></span> = <span class="frac"><span>75</span><span>10,385</span></span> ≈ 7,22<span class="note">F crítico al 5 % con (2, 26) ≈ 3,37 → 7,22 &gt; 3,37: se rechaza H₀</span></div></section>
<section><h3>Laboratorio: mueve el quiebre y mira qué pasa</h3>
<div class="sim" id="sim"></div></section>
<section><h3>Versión con dicotómicas (equivalente)</h3>
<div class="eq">y = β₀ + δ₀D + β₁x + δ₁(D·x) + u &nbsp;&nbsp;&nbsp; H₀: δ₀ = δ₁ = 0</div>
<p>La prueba F conjunta sobre δ₀ y δ₁ da exactamente el mismo F que la de Chow. Su ventaja es que además te dice <b>dónde</b> está el cambio: en el intercepto, en la pendiente o en ambos.</p></section>
<section><h3>Supuestos y variantes</h3>
<ul><li><b>El punto de quiebre se conoce de antemano</b> (una fecha o un grupo definido por teoría). Si se elige mirando los datos, el F sale inflado.</li>
<li><b>Misma varianza del error</b> en ambas submuestras. Se puede revisar con F = σ̂₁² / σ̂₂².</li>
<li><b>Chow predictiva</b>: si una submuestra tiene menos observaciones que parámetros (n₂ &lt; k), no se puede estimar por separado y se usa F = [(SCR<sub>R</sub> − SCR₁)/n₂] / [SCR₁/(n₁ − k)] ~ F(n₂, n₁ − k).</li></ul></section>
<p class="warn"><b>Error común:</b> usar k = número de regresoras. En Chow, k cuenta también el intercepto: con 3 regresoras, k = 4 y los grados de libertad son (4, n − 8).</p>`,
deep:[
{k:"Demostración", t:"Por qué Chow es una prueba F restringida", html:`<p>El modelo no restringido permite coeficientes distintos en cada submuestra; con dicotómicas se escribe con 2k parámetros. Su SCR es exactamente SCR₁ + SCR₂, porque estimar el modelo con todas las interacciones equivale a estimar cada submuestra por separado.</p><p>El restringido impone k igualdades (cada coeficiente igual en ambas submuestras), así que q = k. Sustituyendo en la fórmula general de la F, con 2k parámetros en el no restringido, se obtiene exactamente la fórmula de Chow con n − 2k grados de libertad.</p>`},
{k:"Variante", t:"Comprobar varianzas iguales antes de Chow", html:`<div class="eq">F = <span class="frac"><span>σ̂₁²</span><span>σ̂₂²</span></span> = <span class="frac"><span>SCR₁/(n₁ − k)</span><span>SCR₂/(n₂ − k)</span></span> ~ F(n₁ − k, n₂ − k)<span class="note">Pon la varianza mayor en el numerador y compara con el F crítico</span></div><p>En el ejemplo resuelto: σ̂₁² = 120/13 = 9,23 y σ̂₂² = 150/13 = 11,54. F = 11,54/9,23 = 1,25, menor que F crítico (13, 13) ≈ 2,58. Las varianzas son compatibles y la prueba de Chow es válida.</p>`},
{k:"Avanzado", t:"Cuando no sabes dónde está el quiebre", html:`<p><b>Quandt-Andrews (sup-F):</b> calcula el F de Chow para cada posible punto de quiebre (dejando fuera, por ejemplo, el 15 % inicial y final) y toma el máximo. Ese máximo no sigue una distribución F; tiene sus propios valores críticos (Andrews, 1993).</p><p><b>CUSUM:</b> suma acumulada de residuos recursivos. Si la línea se sale de las bandas de confianza, hay inestabilidad en los parámetros. Es visual y no requiere fijar un punto.</p><p><b>Bai-Perron:</b> permite estimar varios quiebres a la vez.</p>`}],
code:{r:String.raw`library(strucchange)
sctest(y ~ x, data = df, type = "Chow", point = 30)

# quiebre desconocido
fs <- Fstats(y ~ x, data = df)
sctest(fs)         # sup-F
breakpoints(y ~ x, data = df)`, stata:String.raw`gen D = (_n > 30)
reg y c.x##i.D
test 1.D 1.D#c.x     // = F de Chow

* quiebre desconocido (requiere tsset)
reg y x
estat sbsingle`, py:String.raw`from scipy.stats import f
r = smf.ols("y ~ x", data=df).fit()
a = smf.ols("y ~ x", data=df.iloc[:30]).fit()
b = smf.ols("y ~ x", data=df.iloc[30:]).fit()
k, n = 2, len(df)
F = ((r.ssr - (a.ssr + b.ssr)) / k) / ((a.ssr + b.ssr) / (n - 2*k))
p = f.sf(F, k, n - 2*k)`},
q:"Modelo con 3 regresoras e intercepto, n = 60 dividido 35/25. SCR_R = 900, SCR₁ = 320, SCR₂ = 280. ¿Hay cambio estructural al 5 %?",
a:"k = 4, gl = (4, 52). SCR_NR = 600. F = [(900 − 600)/4] / [600/52] = 75 / 11,54 ≈ 6,50. F crítico (4, 52) al 5 % ≈ 2,55. Como 6,50 > 2,55 se rechaza H₀: hay evidencia de cambio estructural."}
];

const BRANCHES = [
{g:"Cuando fallan los supuestos", from:"supuestos", items:[

{id:"hetero", t:"Heterocedasticidad", sim:"hetero", html:`
<section><h3>La idea</h3>
<p class="lead">Hay heterocedasticidad cuando la varianza del error cambia entre observaciones: <span class="m">Var(uᵢ|X) = σᵢ²</span>. Es típica en corte transversal. Por ejemplo, el gasto en ocio varía mucho más entre hogares de ingreso alto que entre hogares de ingreso bajo.</p></section>
<section><h3>Consecuencias</h3>
<ul><li>β̂ sigue siendo <b>insesgado y consistente</b>.</li>
<li>La fórmula σ²(X′X)⁻¹ ya no es correcta, así que los errores estándar, las t y las F están mal.</li>
<li>MCO deja de ser el más eficiente (ya no es MELI).</li></ul></section>
<section><h3>Laboratorio: abre el abanico</h3><div class="sim" id="sim"></div></section>
<section><h3>Cómo detectarla</h3>
<p><b>Breusch-Pagan.</b> Estima el modelo, guarda û², y regresa û² sobre las regresoras:</p>
<div class="eq">ûᵢ² = α₀ + α₁xᵢ₁ + … + αₖ₋₁xᵢ,ₖ₋₁ + vᵢ &nbsp;&nbsp;&nbsp; LM = n·R²<sub>aux</sub> ~ χ²(k − 1)<span class="note">H₀: homocedasticidad (todas las α de pendiente iguales a cero)</span></div>
<p><b>White.</b> Igual, pero la regresión auxiliar incluye además los cuadrados y los productos cruzados de las regresoras. Detecta formas más generales, a costa de muchos grados de libertad.</p></section>
<section><h3>Cómo corregirla</h3>
<ol class="steps"><li><b>Errores estándar robustos</b> (de White o HC): mantienes β̂ y corriges solo la inferencia. Es lo más usado.</li>
<li><b>Mínimos cuadrados ponderados (MCP)</b>: si sabes que Var(uᵢ) = σ²·h(xᵢ), divides toda la ecuación por √h(xᵢ) y estimas por MCO. Recuperas la eficiencia.</li>
<li><b>MCG factible</b>: estimas h(xᵢ) a partir de los residuos y luego aplicas MCP.</li></ol></section>`,
deep:[
{k:"Intuición", t:"Por qué MCP es más eficiente", html:`<p>MCO le da el mismo peso a todas las observaciones. Pero las que tienen varianza alta son menos informativas: su dato está más contaminado por ruido. MCP les da menos peso (1/σᵢ²), y así el estimador aprovecha mejor la información. Si Var(uᵢ) = σ²xᵢ, la ecuación transformada es:</p><div class="eq">yᵢ/√xᵢ = β₀(1/√xᵢ) + β₁√xᵢ + uᵢ/√xᵢ<span class="note">El nuevo error tiene varianza constante σ²</span></div>`},
{k:"Variante", t:"Goldfeld-Quandt", html:`<p>Ordena las observaciones según la variable que sospechas causa la heterocedasticidad, quita un bloque central (por ejemplo, el 20 %) y estima por separado el tercio inferior y el superior. Luego <span class="m">F = SCR₂/SCR₁</span> (con sus grados de libertad). Fíjate que es la misma prueba de varianzas iguales que se usa antes de Chow.</p>`}],
code:{r:String.raw`library(lmtest); library(sandwich)
bptest(m)                                            # Breusch-Pagan
bptest(m, ~ x1 * x2 + I(x1^2) + I(x2^2), data = df)  # White
coeftest(m, vcov = vcovHC(m, type = "HC1"))          # robustos
lm(y ~ x1 + x2, data = df, weights = 1/x1)           # MCP`, stata:String.raw`reg y x1 x2
estat hettest          // Breusch-Pagan
estat imtest, white    // White
reg y x1 x2, vce(robust)
reg y x1 x2 [aweight = 1/x1]   // MCP`, py:String.raw`from statsmodels.stats.diagnostic import het_breuschpagan, het_white
het_breuschpagan(m.resid, m.model.exog)   # (LM, p, F, p)
het_white(m.resid, m.model.exog)
m_rob = smf.ols("y ~ x1 + x2", data=df).fit(cov_type="HC1")
m_mcp = smf.wls("y ~ x1 + x2", data=df, weights=1/df["x1"]).fit()`},
q:"Con n = 100 y 3 regresoras, la regresión auxiliar de Breusch-Pagan tiene R² = 0,08. ¿Hay heterocedasticidad al 5 %?",
a:"LM = 100·0,08 = 8. Valor crítico χ²(3) al 5 % = 7,81. Como 8 > 7,81 se rechaza la homocedasticidad. Conviene usar errores estándar robustos."},

{id:"autocorr", t:"Autocorrelación", html:`
<section><h3>La idea</h3>
<p class="lead">Hay autocorrelación cuando los errores de distintos periodos están relacionados: <span class="m">Corr(uₜ, uₛ) ≠ 0</span>. Es típica en series de tiempo, porque los choques tienden a persistir. El caso más estudiado es el proceso AR(1):</p>
<div class="eq">uₜ = ρuₜ₋₁ + εₜ &nbsp;&nbsp;&nbsp; |ρ| &lt; 1<span class="note">ρ &gt; 0: autocorrelación positiva (la más común) · ρ &lt; 0: negativa</span></div></section>
<section><h3>Consecuencias</h3>
<p>Como con la heterocedasticidad: β̂ insesgado si las regresoras son exógenas, pero errores estándar incorrectos. Con ρ &gt; 0 suelen salir <b>demasiado pequeños</b>, y entonces encuentras variables "significativas" que no lo son. Si el modelo incluye <span class="m">yₜ₋₁</span> como regresora, la autocorrelación además produce sesgo.</p></section>
<section><h3>Prueba de Durbin-Watson</h3>
<div class="eq">d = <span class="frac"><span>Σₜ₌₂(ûₜ − ûₜ₋₁)²</span><span>Σₜ₌₁ûₜ²</span></span> ≈ 2(1 − ρ̂)</div>
<div class="tbl"><table><tr><th>Valor de d</th><th>Conclusión</th></tr><tr><td>Cerca de 2</td><td>Sin autocorrelación</td></tr><tr><td>Menor que d<sub>L</sub></td><td>Autocorrelación positiva</td></tr><tr><td>Entre d<sub>L</sub> y d<sub>U</sub></td><td>Zona inconclusa</td></tr><tr><td>Cerca de 4</td><td>Autocorrelación negativa</td></tr></table></div>
<p>Limitaciones: solo detecta AR(1), exige intercepto y no sirve si hay <span class="m">yₜ₋₁</span> entre las regresoras.</p></section>
<section><h3>Prueba de Breusch-Godfrey</h3>
<p>Más general. Regresa ûₜ sobre las regresoras originales y sobre ûₜ₋₁, …, ûₜ₋ₚ:</p>
<div class="eq">LM = (n − p)·R²<sub>aux</sub> ~ χ²(p)</div></section>
<section><h3>Corrección</h3>
<ul><li><b>Errores de Newey-West</b> (HAC): corrigen heterocedasticidad y autocorrelación a la vez sin tocar β̂.</li>
<li><b>Cochrane-Orcutt / Prais-Winsten</b>: estiman ρ y transforman el modelo con cuasi-diferencias <span class="m">yₜ − ρ̂yₜ₋₁</span>.</li></ul></section>`,
deep:[
{k:"Demostración", t:"Por qué d ≈ 2(1 − ρ̂)", html:`<p>Desarrollando el numerador: <span class="m">Σ(ûₜ − ûₜ₋₁)² = Σûₜ² + Σûₜ₋₁² − 2Σûₜûₜ₋₁</span>. En muestras grandes, Σûₜ² ≈ Σûₜ₋₁², y Σûₜûₜ₋₁ / Σûₜ² ≈ ρ̂. Entonces:</p><div class="eq">d ≈ <span class="frac"><span>2Σûₜ² − 2ρ̂Σûₜ²</span><span>Σûₜ²</span></span> = 2(1 − ρ̂)</div><p>Por eso d va de 0 (ρ = 1) a 4 (ρ = −1).</p>`},
{k:"Conceptos", t:"Autocorrelación que en realidad es mala especificación", html:`<p>Muchas veces los residuos parecen autocorrelacionados porque falta una variable con tendencia, la forma funcional es incorrecta o hay un cambio estructural no modelado. Antes de corregir con Cochrane-Orcutt, revisa la especificación: un quiebre no detectado con Chow deja residuos con "rachas" que DW confunde con autocorrelación.</p>`}],
code:{r:String.raw`library(lmtest); library(sandwich)
dwtest(m)
bgtest(m, order = 2)
coeftest(m, vcov = NeweyWest(m, lag = 2))
library(orcutt); cochrane.orcutt(m)`, stata:String.raw`tsset t
reg y x
estat dwatson
estat bgodfrey, lags(2)
newey y x, lag(2)
prais y x, corc      // Cochrane-Orcutt`, py:String.raw`from statsmodels.stats.stattools import durbin_watson
from statsmodels.stats.diagnostic import acorr_breusch_godfrey
durbin_watson(m.resid)
acorr_breusch_godfrey(m, nlags=2)
m_nw = smf.ols("y ~ x", data=df).fit(cov_type="HAC", cov_kwds={"maxlags": 2})`},
q:"Un modelo de series de tiempo da DW = 0,6. ¿Qué valor aproximado tiene ρ̂ y qué concluyes?",
a:"ρ̂ ≈ 1 − d/2 = 1 − 0,3 = 0,7. Hay autocorrelación positiva fuerte. Los errores estándar de MCO están subestimados; hay que revisar la especificación y usar Newey-West o Cochrane-Orcutt."},

{id:"multicol", t:"Multicolinealidad", html:`
<section><h3>La idea</h3>
<p class="lead">Multicolinealidad es una correlación alta (no perfecta) entre regresoras. No viola ningún supuesto de Gauss-Markov: MCO sigue siendo MELI. El problema es de información: los datos no permiten separar bien el efecto de cada variable.</p></section>
<section><h3>Dónde se ve en la fórmula</h3>
<div class="eq">Var(β̂ⱼ) = <span class="frac"><span>σ²</span><span>STCⱼ·(1 − Rⱼ²)</span></span> &nbsp;&nbsp;&nbsp; VIFⱼ = <span class="frac"><span>1</span><span>1 − Rⱼ²</span></span><span class="note">STCⱼ: variación total de xⱼ · Rⱼ²: R² de regresar xⱼ sobre las demás regresoras</span></div>
<p>Si Rⱼ² se acerca a 1, la varianza de β̂ⱼ explota. Regla práctica: VIF &gt; 10 es señal de alarma.</p></section>
<section><h3>Síntomas</h3>
<ul><li>R² alto y prueba F global significativa, pero pocas t individuales significativas.</li>
<li>Coeficientes que cambian mucho de valor o de signo al quitar o agregar una variable o unas pocas observaciones.</li>
<li>Correlaciones altas entre pares de regresoras (aunque la multicolinealidad puede involucrar a tres o más sin que ningún par sea alto).</li></ul></section>
<section><h3>Qué hacer</h3>
<ul><li>Si la variable afectada es solo de control, puede que no haga falta hacer nada.</li>
<li>Conseguir más datos o más variación en las regresoras.</li>
<li>Combinar variables en un índice (por ejemplo, componentes principales).</li>
<li>Quitar una variable solo si la teoría lo justifica: quitarla por colinealidad puede generar sesgo por variable omitida.</li></ul></section>`,
deep:[
{k:"Intuición", t:"Por qué la prueba F detecta lo que las t no", html:`<p>Si x₁ y x₂ se mueven casi juntas, los datos dicen con claridad que "x₁ y x₂, en conjunto, afectan a y", pero no pueden decir cuánto es de cada una. La F prueba el efecto conjunto y sale significativa; cada t pregunta por el efecto de una variable manteniendo la otra constante, algo que casi nunca ocurre en la muestra, y por eso sale con errores estándar grandes.</p>`},
{k:"Ejemplo", t:"La trampa clásica: variables que suman un total", html:`<p>Gasto en alimentos, en vivienda, en transporte y en otros, junto con el gasto total como regresoras. Las cuatro primeras suman exactamente el total: multicolinealidad perfecta y el modelo no se puede estimar. Si en lugar del total usas el ingreso (que está muy cerca del gasto total, pero no es idéntico), el modelo se estima, pero con VIF enormes.</p>`}],
code:{r:String.raw`library(car)
vif(m)
cor(df[, c("x1", "x2", "x3")])`, stata:String.raw`reg y x1 x2 x3
estat vif
correlate x1 x2 x3`, py:String.raw`from statsmodels.stats.outliers_influence import variance_inflation_factor as vif
X = m.model.exog
[vif(X, j) for j in range(1, X.shape[1])]   # se omite el intercepto`},
q:"Al regresar x₂ sobre las demás regresoras se obtiene R² = 0,95. ¿Cuál es su VIF y qué significa?",
a:"VIF = 1/(1 − 0,95) = 20. La varianza de β̂₂ es 20 veces la que tendría si x₂ no estuviera correlacionada con las demás. Su error estándar es √20 ≈ 4,5 veces mayor."},

{id:"especificacion", t:"Especificación del modelo", html:`
<section><h3>La idea</h3>
<p class="lead">Un modelo está mal especificado si omite variables relevantes, incluye irrelevantes, usa una forma funcional equivocada o mide mal alguna variable. El caso más grave es la omisión, porque viola E(u|X) = 0.</p></section>
<section><h3>Sesgo por variable omitida</h3>
<p>Modelo verdadero: <span class="m">y = β₀ + β₁x₁ + β₂x₂ + u</span>. Si estimas sin x₂:</p>
<div class="eq">E(β̃₁) = β₁ + β₂·δ̃₁<span class="note">δ̃₁: pendiente de regresar x₂ sobre x₁</span></div>
<div class="tbl"><table><tr><th></th><th>Corr(x₁, x₂) &gt; 0</th><th>Corr(x₁, x₂) &lt; 0</th></tr><tr><td>β₂ &gt; 0</td><td>Sesgo hacia arriba</td><td>Sesgo hacia abajo</td></tr><tr><td>β₂ &lt; 0</td><td>Sesgo hacia abajo</td><td>Sesgo hacia arriba</td></tr></table></div>
<p>Hay sesgo solo si la variable omitida importa (β₂ ≠ 0) <b>y</b> está correlacionada con la incluida.</p></section>
<section><h3>Variables irrelevantes</h3>
<p>Incluir una variable con β = 0 no sesga a los demás coeficientes, pero aumenta su varianza si está correlacionada con ellos. Es un error menos grave que omitir.</p></section>
<section><h3>Prueba RESET de Ramsey</h3>
<p>Detecta forma funcional incorrecta. Agrega potencias de los valores ajustados y prueba si son significativas:</p>
<div class="eq">y = Xβ + γ₁ŷ² + γ₂ŷ³ + error &nbsp;&nbsp;&nbsp; H₀: γ₁ = γ₂ = 0 &nbsp;(prueba F)</div></section>
<section><h3>Error de medición</h3>
<ul><li>En <b>y</b>: aumenta la varianza del error, pero no sesga si el error es aleatorio.</li>
<li>En <b>x</b>: produce <b>sesgo de atenuación</b>; β̂ se acerca a cero. Se corrige con variables instrumentales.</li></ul></section>`,
deep:[
{k:"Demostración", t:"De dónde sale la fórmula del sesgo", html:`<p>El estimador del modelo corto es β̃₁ = Σ(x₁ᵢ − x̄₁)yᵢ / Σ(x₁ᵢ − x̄₁)². Sustituyendo el modelo verdadero de yᵢ:</p><div class="eq">β̃₁ = β₁ + β₂·<span class="frac"><span>Σ(x₁ᵢ − x̄₁)x₂ᵢ</span><span>Σ(x₁ᵢ − x̄₁)²</span></span> + <span class="frac"><span>Σ(x₁ᵢ − x̄₁)uᵢ</span><span>Σ(x₁ᵢ − x̄₁)²</span></span></div><p>La fracción del medio es δ̃₁ y el último término tiene esperanza cero. Tomando esperanzas queda la fórmula.</p>`},
{k:"Conceptos", t:"Criterios de información AIC y BIC", html:`<p>Para elegir entre modelos no anidados (que no son versiones restringidas uno del otro), se usan:</p><div class="eq">AIC = ln(SCR/n) + 2k/n &nbsp;&nbsp;&nbsp; BIC = ln(SCR/n) + k·ln(n)/n</div><p>Se prefiere el de menor valor. El BIC penaliza más los parámetros adicionales y tiende a elegir modelos más pequeños.</p>`}],
code:{r:String.raw`library(lmtest)
resettest(m, power = 2:3, type = "fitted")
AIC(m1, m2); BIC(m1, m2)`, stata:String.raw`reg y x1 x2
estat ovtest      // RESET
estat ic          // AIC y BIC`, py:String.raw`from statsmodels.stats.diagnostic import linear_reset
linear_reset(m, power=3, use_f=True)
m1.aic, m2.aic, m1.bic, m2.bic`},
q:"En una ecuación de salarios omites la habilidad, que aumenta el salario y está positivamente correlacionada con la educación. ¿En qué dirección queda sesgado el retorno a la educación?",
a:"β₂ > 0 (la habilidad aumenta el salario) y Corr(educación, habilidad) > 0, así que el sesgo es positivo: el retorno estimado a la educación queda sobreestimado, porque recoge parte del efecto de la habilidad."}
]},

{g:"Más allá de MCO", from:"supuestos", items:[

{id:"vi", t:"Variables instrumentales", html:`
<section><h3>El problema: endogeneidad</h3>
<p class="lead">Una regresora es endógena si está correlacionada con el error: <span class="m">Cov(x, u) ≠ 0</span>. Entonces MCO es sesgado e inconsistente. Las tres fuentes clásicas son variable omitida, error de medición en x y simultaneidad.</p></section>
<section><h3>La solución: un instrumento</h3>
<p>Una variable <span class="m">z</span> que cumpla dos condiciones:</p>
<ol class="steps"><li><b>Relevancia:</b> Cov(z, x) ≠ 0. Se puede probar con los datos.</li>
<li><b>Exogeneidad:</b> Cov(z, u) = 0. z solo afecta a y a través de x. No se puede probar con los datos; se argumenta con teoría.</li></ol>
<div class="eq">β̂₁<sup>VI</sup> = <span class="frac"><span>Cov(z, y)</span><span>Cov(z, x)</span></span></div></section>
<section><h3>Mínimos cuadrados en dos etapas (MC2E)</h3>
<ol class="steps"><li><b>Primera etapa:</b> regresa x sobre z y las regresoras exógenas. Guarda x̂.</li>
<li><b>Segunda etapa:</b> regresa y sobre x̂ y las regresoras exógenas. El coeficiente de x̂ es β̂<sup>MC2E</sup>.</li></ol>
<p>Hacer las dos etapas a mano da bien los coeficientes, pero mal los errores estándar. Usa el comando del software.</p></section>
<section><h3>Pruebas asociadas</h3>
<ul><li><b>Instrumentos débiles:</b> F de la primera etapa sobre los instrumentos excluidos. Regla práctica: F &gt; 10.</li>
<li><b>Hausman (endogeneidad):</b> compara MCO y VI. Si no difieren significativamente, x es exógena y MCO es preferible por ser más eficiente.</li>
<li><b>Sargan (sobreidentificación):</b> si tienes más instrumentos que variables endógenas, prueba si son consistentes entre sí.</li></ul></section>
<p class="warn"><b>Error común:</b> creer que un instrumento muy correlacionado con x es automáticamente bueno. Si también está correlacionado con u, el estimador VI puede quedar peor que MCO.</p>`,
deep:[
{k:"Intuición", t:"Qué hace realmente el instrumento", html:`<p>x tiene una parte "buena" (no relacionada con u) y una "contaminada". El instrumento aísla la parte buena: en la primera etapa, x̂ es solo la variación de x que proviene de z, y como z no está relacionada con u, esa variación tampoco. La segunda etapa usa solo esa variación limpia. El precio es que se usa menos información, por eso VI tiene más varianza que MCO.</p>`},
{k:"Ejemplo", t:"Instrumentos famosos en economía", html:`<div class="tbl"><table><tr><th>Endógena</th><th>Instrumento</th><th>Estudio</th></tr><tr><td>Años de educación</td><td>Trimestre de nacimiento</td><td>Angrist y Krueger (1991)</td></tr><tr><td>Años de educación</td><td>Distancia a una universidad</td><td>Card (1995)</td></tr><tr><td>Calidad de las instituciones</td><td>Mortalidad de los colonos</td><td>Acemoglu, Johnson y Robinson (2001)</td></tr><tr><td>Precio (en demanda)</td><td>Choques de oferta, como el clima</td><td>Clásico de oferta y demanda</td></tr></table></div>`}],
code:{r:String.raw`library(AER)
iv <- ivreg(salario ~ educ + exper | distancia + exper, data = df)
summary(iv, diagnostics = TRUE)   # F 1a etapa, Wu-Hausman, Sargan`, stata:String.raw`ivregress 2sls salario exper (educ = distancia)
estat firststage     // instrumentos débiles
estat endogenous     // Hausman`, py:String.raw`from linearmodels.iv import IV2SLS
iv = IV2SLS.from_formula("salario ~ 1 + exper + [educ ~ distancia]", df).fit()
print(iv.first_stage)
iv.wu_hausman()`},
q:"Se propone la distancia a la universidad más cercana como instrumento de la educación en una ecuación de salarios. ¿Qué debes argumentar y qué puedes probar?",
a:"Puedes probar la relevancia: en la primera etapa, la distancia debe explicar significativamente la educación (F > 10). Debes argumentar la exogeneidad: que la distancia no afecta el salario por otra vía. Un riesgo es que las universidades están en ciudades con salarios más altos; por eso suele controlarse por zona urbana o región."},

{id:"simultaneas", t:"Ecuaciones simultáneas", html:`
<section><h3>La idea</h3>
<p class="lead">Algunas variables se determinan conjuntamente. En un mercado, precio y cantidad salen del cruce de oferta y demanda; ninguna es "causa" de la otra en una sola ecuación.</p>
<div class="eq">Demanda: Q = α₀ + α₁P + α₂I + u₁ &nbsp;&nbsp;&nbsp; Oferta: Q = β₀ + β₁P + β₂W + u₂<span class="note">Q y P: endógenas · I (ingreso) y W (clima): exógenas</span></div></section>
<section><h3>Sesgo de simultaneidad</h3>
<p>Un choque u₁ en la demanda mueve P. Entonces P está correlacionado con u₁ y estimar la demanda por MCO da un α̂₁ sesgado. Es un caso de endogeneidad.</p></section>
<section><h3>Forma estructural y forma reducida</h3>
<p>La <b>estructural</b> son las ecuaciones de comportamiento (las de arriba). La <b>reducida</b> expresa cada endógena solo en función de las exógenas, resolviendo el sistema:</p>
<div class="eq">P = π₁₀ + π₁₁I + π₁₂W + v₁ &nbsp;&nbsp;&nbsp; Q = π₂₀ + π₂₁I + π₂₂W + v₂</div>
<p>La forma reducida sí se puede estimar por MCO. El problema es recuperar los parámetros estructurales a partir de las π: eso es la <b>identificación</b>.</p></section>
<section><h3>Condición de orden</h3>
<p>Para que una ecuación esté identificada, el número de exógenas <b>excluidas</b> de ella debe ser al menos igual al número de endógenas <b>incluidas</b> a la derecha.</p>
<div class="tbl"><table><tr><th>Caso</th><th>Situación</th><th>Estimación</th></tr><tr><td>Menos excluidas</td><td>Subidentificada</td><td>No se puede</td></tr><tr><td>Igual número</td><td>Exactamente identificada</td><td>MCI o MC2E</td></tr><tr><td>Más excluidas</td><td>Sobreidentificada</td><td>MC2E</td></tr></table></div>
<p>En el ejemplo, la demanda excluye a W y la oferta excluye a I; cada una tiene una endógena a la derecha (P). Ambas están exactamente identificadas.</p></section>`,
deep:[
{k:"Intuición", t:"Por qué el clima identifica la demanda", html:`<p>Un cambio en el clima desplaza la oferta pero no la demanda. Al moverse la oferta, el punto de equilibrio recorre la curva de demanda, que se queda quieta. Así los datos "dibujan" la demanda. Por eso la variable excluida de una ecuación sirve como instrumento de P en esa ecuación: el clima es el instrumento del precio en la demanda.</p>`},
{k:"Conceptos", t:"Condición de rango", html:`<p>La condición de orden es necesaria pero no suficiente. La de rango exige además que la variable excluida tenga efecto real en la otra ecuación: si β₂ = 0 (el clima no afecta la oferta), W no mueve nada y la demanda queda sin identificar aunque cumpla el conteo. En la práctica se verifica revisando que el instrumento sea relevante en la primera etapa.</p>`}],
code:{r:String.raw`library(AER)
demanda <- ivreg(q ~ p + ingreso | ingreso + lluvia, data = df)
oferta  <- ivreg(q ~ p + lluvia  | ingreso + lluvia, data = df)`, stata:String.raw`ivregress 2sls q ingreso (p = lluvia)   // demanda
ivregress 2sls q lluvia (p = ingreso)   // oferta`, py:String.raw`from linearmodels.iv import IV2SLS
dem = IV2SLS.from_formula("q ~ 1 + ingreso + [p ~ lluvia]", df).fit()
ofe = IV2SLS.from_formula("q ~ 1 + lluvia + [p ~ ingreso]", df).fit()`},
q:"Si la oferta no incluyera ninguna variable exógena (no hay W), ¿qué ecuación queda identificada?",
a:"La oferta sí, porque excluye a I y tiene una sola endógena a la derecha: los cambios en el ingreso desplazan la demanda y dibujan la curva de oferta. La demanda no, porque no excluye ninguna exógena."},

{id:"discreta", t:"Elección discreta: logit y probit", sim:"logit", html:`
<section><h3>La idea</h3>
<p class="lead">Cuando la variable dependiente es binaria (y = 1 si la persona trabaja, compra, migra; 0 si no), lo que modelamos es la probabilidad <span class="m">P(y = 1 | x)</span>.</p></section>
<section><h3>Modelo de probabilidad lineal (MPL)</h3>
<div class="eq">P(y = 1 | x) = β₀ + β₁x₁ + … + βₖ₋₁xₖ₋₁</div>
<p>Se estima por MCO y β₁ es directamente el cambio en la probabilidad. Problemas: puede predecir probabilidades menores que 0 o mayores que 1, supone efectos constantes y es heterocedástico por construcción (siempre usa errores robustos).</p></section>
<section><h3>Logit y probit</h3>
<div class="eq">Logit: P = Λ(xβ) = <span class="frac"><span>e<sup>xβ</sup></span><span>1 + e<sup>xβ</sup></span></span> &nbsp;&nbsp;&nbsp; Probit: P = Φ(xβ)<span class="note">Λ: función logística · Φ: función de distribución normal estándar · ambas entre 0 y 1</span></div>
<p>Se estiman por <b>máxima verosimilitud</b>. El signo de β es interpretable, su magnitud directamente no.</p></section>
<section><h3>Laboratorio: MPL contra logit</h3><div class="sim" id="sim"></div></section>
<section><h3>Efectos marginales</h3>
<div class="eq">∂P/∂xⱼ = g(xβ)·βⱼ<span class="note">Logit: g = Λ(1 − Λ), máximo 0,25 · Probit: g = φ (densidad normal), máximo 0,40</span></div>
<p>El efecto depende del punto donde se evalúe. Se reporta el efecto marginal en la media (EMM) o el promedio de los efectos marginales (EMP).</p></section>
<section><h3>Bondad de ajuste y pruebas</h3>
<ul><li><b>Pseudo R² de McFadden:</b> 1 − ln L<sub>modelo</sub> / ln L<sub>solo intercepto</sub>.</li>
<li><b>Razón de verosimilitud:</b> LR = 2(ln L<sub>NR</sub> − ln L<sub>R</sub>) ~ χ²(q). Hace el papel de la F.</li>
<li><b>Porcentaje correctamente predicho:</b> se predice 1 si P̂ &gt; 0,5.</li></ul></section>`,
deep:[
{k:"Interpretación", t:"Razones de odds en el logit", html:`<p>Los odds son P/(1 − P). En el logit, <span class="m">ln[P/(1−P)] = xβ</span>, así que:</p><div class="eq">e<sup>βⱼ</sup> = razón de odds al aumentar xⱼ en una unidad</div><p>Si β = 0,4, entonces e<sup>0,4</sup> = 1,49: una unidad más de x multiplica los odds por 1,49 (los aumenta 49 %). No es lo mismo que aumentar la probabilidad en 49 %.</p>`},
{k:"Comparación", t:"Logit y probit dan casi lo mismo", html:`<p>Las dos curvas son muy parecidas; el logit tiene colas un poco más gruesas. Por eso los coeficientes difieren en escala (β<sub>logit</sub> ≈ 1,6·β<sub>probit</sub>), pero los efectos marginales y las probabilidades predichas suelen ser casi idénticos. La elección rara vez cambia las conclusiones.</p>`}],
code:{r:String.raw`lg <- glm(y ~ x1 + x2, family = binomial(link = "logit"), data = df)
pb <- glm(y ~ x1 + x2, family = binomial(link = "probit"), data = df)
library(margins); summary(margins(lg))   # efectos marginales promedio
exp(coef(lg))                            # razones de odds`, stata:String.raw`logit y x1 x2
margins, dydx(*)        // efectos marginales promedio
logit y x1 x2, or       // razones de odds
probit y x1 x2
estat classification`, py:String.raw`lg = smf.logit("y ~ x1 + x2", data=df).fit()
lg.get_margeff().summary()
np.exp(lg.params)        # razones de odds
pb = smf.probit("y ~ x1 + x2", data=df).fit()`},
q:"En un logit, β₁ = 0,4. Para una persona con probabilidad predicha de 0,5, ¿cuál es el efecto marginal de x₁?",
a:"g = Λ(1 − Λ) = 0,5·0,5 = 0,25. Efecto marginal = 0,25·0,4 = 0,10: una unidad más de x₁ aumenta la probabilidad en unos 10 puntos porcentuales. Con P = 0,9 sería 0,09·0,4 = 0,036."}
]},

{g:"Según la estructura de datos", from:"datos", items:[

{id:"panel", t:"Datos de panel", html:`
<section><h3>La idea</h3>
<p class="lead">Con datos de panel seguimos a los mismos individuos en el tiempo. Eso permite controlar características que no observamos y que no cambian, como la habilidad de una persona o la cultura de una empresa.</p>
<div class="eq">yᵢₜ = β₀ + β₁xᵢₜ + aᵢ + uᵢₜ<span class="note">aᵢ: efecto inobservado fijo en el tiempo · uᵢₜ: error idiosincrático</span></div></section>
<section><h3>El problema del MCO agrupado</h3>
<p>Si estimas por MCO juntando todo, aᵢ queda en el error. Si aᵢ está correlacionado con xᵢₜ, hay sesgo por variable omitida.</p></section>
<section><h3>Los tres estimadores</h3>
<div class="tbl"><table><tr><th>Estimador</th><th>Cómo elimina aᵢ</th><th>Supuesto clave</th></tr>
<tr><td>Primeras diferencias</td><td>Resta el periodo anterior: Δyᵢₜ = β₁Δxᵢₜ + Δuᵢₜ</td><td>aᵢ puede correlacionarse con x</td></tr>
<tr><td>Efectos fijos (EF)</td><td>Resta la media de cada individuo: yᵢₜ − ȳᵢ</td><td>aᵢ puede correlacionarse con x</td></tr>
<tr><td>Efectos aleatorios (EA)</td><td>No lo elimina; lo trata como parte de un error compuesto y usa MCG</td><td>Cov(aᵢ, x) = 0</td></tr></table></div>
<p>EF pierde las variables constantes en el tiempo (sexo, región de nacimiento): se eliminan junto con aᵢ. EA las conserva y es más eficiente, pero solo si su supuesto se cumple.</p></section>
<section><h3>Prueba de Hausman</h3>
<p>H₀: aᵢ no está correlacionado con las regresoras (EA es consistente y eficiente). Bajo H₀, EF y EA deberían dar coeficientes parecidos.</p>
<ul><li>Se rechaza H₀ → usar <b>efectos fijos</b>.</li><li>No se rechaza → <b>efectos aleatorios</b> es aceptable.</li></ul></section>
<p class="warn"><b>Error común:</b> olvidar agrupar los errores estándar por individuo. Las observaciones de un mismo individuo están correlacionadas en el tiempo; sin agrupar, los errores salen demasiado pequeños.</p>`,
deep:[
{k:"Equivalencia", t:"Efectos fijos con dicotómicas", html:`<p>Estimar por EF es numéricamente igual a meter una dicotómica por cada individuo (MCVD: mínimos cuadrados con variables dicotómicas). Con 1.000 empresas serían 999 dicotómicas, por eso se usa la transformación de las medias. Fíjate en la conexión con Chow: es como permitir un intercepto distinto para cada individuo y una pendiente común.</p>`},
{k:"Conceptos", t:"Qué hace efectos aleatorios por dentro", html:`<p>EA aplica una cuasi-transformación: <span class="m">yᵢₜ − θȳᵢ</span>, con θ entre 0 y 1 calculado a partir de las varianzas de aᵢ y uᵢₜ. Si θ = 0 es MCO agrupado; si θ = 1 es efectos fijos. EA es un punto intermedio que aprovecha también la variación entre individuos.</p>`}],
code:{r:String.raw`library(plm)
fe <- plm(y ~ x, data = df, index = c("id", "anio"), model = "within")
re <- plm(y ~ x, data = df, index = c("id", "anio"), model = "random")
phtest(fe, re)   # Hausman
library(lmtest); coeftest(fe, vcov = vcovHC(fe, cluster = "group"))`, stata:String.raw`xtset id anio
xtreg y x, fe vce(cluster id)
xtreg y x, fe
estimates store fe
xtreg y x, re
hausman fe .`, py:String.raw`from linearmodels.panel import PanelOLS, RandomEffects
d = df.set_index(["id", "anio"])
fe = PanelOLS.from_formula("y ~ x + EntityEffects", d).fit(cov_type="clustered", cluster_entity=True)
re = RandomEffects.from_formula("y ~ 1 + x", d).fit()`},
q:"Estimas un panel de 200 municipios y la prueba de Hausman da p-valor = 0,01. ¿Qué estimador usas?",
a:"Se rechaza H₀ al 5 %: el efecto inobservado de cada municipio está correlacionado con las regresoras, así que efectos aleatorios es inconsistente. Usas efectos fijos, con errores agrupados por municipio."},

{id:"series", t:"Series de tiempo", html:`
<section><h3>Estacionariedad</h3>
<p class="lead">Una serie es (débilmente) estacionaria si su media y su varianza son constantes en el tiempo y la covarianza entre yₜ y yₜ₋ₛ depende solo de la distancia s. La mayoría de las herramientas de MCO necesitan series estacionarias.</p>
<div class="eq">Caminata aleatoria: yₜ = yₜ₋₁ + εₜ<span class="note">No estacionaria: su varianza crece con t. Tiene raíz unitaria.</span></div></section>
<section><h3>Regresión espuria</h3>
<p>Si regresas una serie con raíz unitaria sobre otra independiente que también la tiene, es muy común obtener un R² alto y t significativas aunque no haya relación alguna (Granger y Newbold, 1974). Señal típica: R² mayor que el Durbin-Watson.</p></section>
<section><h3>Prueba de Dickey-Fuller</h3>
<div class="eq">Δyₜ = α + γyₜ₋₁ + εₜ &nbsp;&nbsp;&nbsp; H₀: γ = 0 (raíz unitaria)<span class="note">El estadístico t de γ̂ no sigue la t usual. Valor crítico al 5 % con constante ≈ −2,86</span></div>
<p>La versión <b>aumentada (ADF)</b> agrega rezagos de Δyₜ para limpiar la autocorrelación. Si no se rechaza H₀, se diferencia la serie: si Δyₜ es estacionaria, yₜ es integrada de orden 1, I(1).</p></section>
<section><h3>Modelos ARIMA</h3>
<p><b>ARIMA(p, d, q)</b>: p rezagos de la variable (AR), d diferencias, q rezagos del error (MA). La metodología de Box-Jenkins tiene tres pasos:</p>
<ol class="steps"><li><b>Identificación:</b> diferenciar hasta lograr estacionariedad y mirar la FAC y la FACP.</li>
<li><b>Estimación</b> de los parámetros.</li>
<li><b>Diagnóstico:</b> los residuos deben ser ruido blanco (prueba de Ljung-Box).</li></ol>
<div class="tbl"><table><tr><th>Proceso</th><th>FAC</th><th>FACP</th></tr><tr><td>AR(p)</td><td>Decae gradualmente</td><td>Se corta después de p</td></tr><tr><td>MA(q)</td><td>Se corta después de q</td><td>Decae gradualmente</td></tr></table></div></section>
<section><h3>Cointegración</h3>
<p>Dos series I(1) están <b>cointegradas</b> si alguna combinación lineal de ellas es estacionaria: comparten una tendencia de largo plazo (consumo e ingreso, por ejemplo). Prueba de Engle-Granger: regresa una sobre otra y aplica Dickey-Fuller a los residuos. Si están cointegradas, la regresión no es espuria y se puede estimar un modelo de corrección de errores.</p></section>`,
deep:[
{k:"Conexión", t:"Series de tiempo y cambio estructural", html:`<p>Un quiebre estructural en la media o la tendencia (por ejemplo, la crisis de 2008 o la pandemia) hace que Dickey-Fuller tienda a no rechazar la raíz unitaria aunque la serie sea estacionaria alrededor de una tendencia con quiebre. La prueba de Perron (1989) incorpora el quiebre. Por eso Chow y las pruebas de raíz unitaria se usan juntas.</p>`},
{k:"Avanzado", t:"Modelos VAR", html:`<p>Un vector autorregresivo modela varias series a la vez, cada una en función de sus propios rezagos y de los de las demás. Es la herramienta estándar en macroeconomía para analizar cómo responde, por ejemplo, la inflación a un choque en la tasa de política monetaria (funciones impulso-respuesta). También permite la prueba de causalidad de Granger.</p>`}],
code:{r:String.raw`library(tseries); library(forecast)
adf.test(y)
dy <- diff(y)
acf(dy); pacf(dy)
fit <- auto.arima(y); checkresiduals(fit)`, stata:String.raw`tsset t
dfuller y, lags(2)
ac D.y
pac D.y
arima y, arima(1,1,1)`, py:String.raw`from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
adfuller(y)            # (estadístico, p-valor, ...)
ARIMA(y, order=(1, 1, 1)).fit().summary()`},
q:"La prueba de Dickey-Fuller con constante da un estadístico de −1,9. ¿Qué concluyes y qué haces?",
a:"El valor crítico al 5 % es aproximadamente −2,86. Como −1,9 > −2,86, no se rechaza la raíz unitaria: la serie no es estacionaria. Se diferencia y se repite la prueba sobre Δyₜ."}
]}
];

// ===== TALLERES: herramientas interactivas (código más abajo, en SIMS.ws*) =====
const WSBOX=`<div id="ws" style="display:flex;flex-direction:column;gap:16px"></div>`;
const WORKSHOPS=[
{id:"t-matrices",t:"Matrices paso a paso y partición",anchor:"matrices",links:["matrices","mco-matricial","chow"],sim:"wsMat",html:WSBOX,
 d:"Escribe tus propios datos y mira cada operación de β̂ = (X′X)⁻¹X′y. Después parte la matriz por columnas, para ver el teorema de Frisch-Waugh-Lovell, o por filas, que es la base de la prueba de Chow."},
{id:"t-geometria",t:"Geometría de MCO en 3D",anchor:"mco-matricial",links:["matrices","mco-matricial","supuestos"],sim:"wsGeo",html:WSBOX,
 d:"MCO es una proyección. Con tres observaciones se puede ver: y se proyecta sobre el plano que generan las columnas de X, y el residuo queda perpendicular a ese plano."},
{id:"t-plano",t:"Plano de regresión y superficie de la SCR",anchor:"mco-matricial",links:["mco-simple","mco-matricial","multicol"],sim:"wsPlane",html:WSBOX,
 d:"Con dos regresoras, la recta de regresión se vuelve un plano. Gíralo, cambia la correlación entre x₁ y x₂ y mira cómo la superficie de la SCR pasa de un tazón a un valle alargado cuando hay multicolinealidad."},
{id:"t-calc",t:"Calculadora de pruebas",anchor:"chow",links:["inferencia","chow","hetero","autocorr"],sim:"wsCalc",html:WSBOX,
 d:"Escribe los datos del ejercicio y obtén el procedimiento completo: la sustitución numérica, el valor crítico, el p-valor y la gráfica de la distribución. Sirve para Chow, F general, varianzas iguales, Breusch-Pagan y Durbin-Watson."}
];
