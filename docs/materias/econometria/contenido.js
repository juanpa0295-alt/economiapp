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

// =====================================================================
// MANUAL EN R: cada explicación con su par «fórmula | código R», pensado para quien empieza de cero.
// Se agrega al final de cada lección (después del contenido y antes de «Para profundizar»).
// Datos: paquete wooldridge (los ejemplos del libro de Wooldridge), así no hace falta descargar archivos.
// =====================================================================
const RM={};
RM["r-cero"]=[
{t:"Instala R y RStudio",x:"R es el programa que hace los cálculos; RStudio es la ventana cómoda donde lo usas. Instala primero R (cran.r-project.org) y después RStudio Desktop (posit.co). Abre RStudio: a la izquierda arriba escribes el <b>script</b> (archivo .R), abajo está la <b>consola</b>, a la derecha el <b>entorno</b> (tus objetos) y los gráficos.",r:String.raw`# Crea un script nuevo: File > New File > R Script
# Escribe una línea y ejecútala con Ctrl + Enter (Cmd + Enter en Mac)
R.version.string        # qué versión de R tienes`,o:"Algo como «R version 4.x.x». Todo lo que va después de # es un comentario: R no lo ejecuta."},
{t:"R como calculadora y los objetos",x:"Un <b>objeto</b> guarda un valor con un nombre. Se crea con la flecha <code>&lt;-</code> (se lee «recibe»). Los nombres no llevan espacios ni tildes y distinguen mayúsculas.",f:"x = 5, y = 3 → x + y = 8, x·y = 15, x² = 25",r:String.raw`x <- 5
y <- 3
x + y
x * y
x^2
sqrt(16)       # raíz cuadrada
log(100)       # logaritmo natural (ln)
exp(1)         # número e`,o:"8, 15, 25, 4, 4.605 y 2.718. Los objetos x y y aparecen en el panel Environment."},
{t:"Vectores: una variable con varias observaciones",x:"Una variable con n observaciones es un <b>vector</b>. Se crea con <code>c()</code> (combinar). Casi todas las funciones estadísticas reciben vectores.",f:"x̄ = Σxᵢ / n  ·  s² = Σ(xᵢ − x̄)² / (n − 1)",r:String.raw`ingreso <- c(1200, 1500, 900, 2000, 1400)
length(ingreso)                 # n
sum(ingreso) / length(ingreso)  # media con la fórmula
mean(ingreso)                   # media con la función
var(ingreso)                    # varianza muestral (divide por n − 1)
sd(ingreso)                     # desviación estándar
ingreso[2]                      # la segunda observación`,o:"n = 5, media 1.400 (las dos formas dan lo mismo), varianza 165.000, desviación 406,2 y 1500."},
{t:"Tipos de datos",x:"R distingue números (<code>numeric</code>), texto (<code>character</code>), verdadero o falso (<code>logical</code>) y categorías (<code>factor</code>). Una variable categórica debe ser factor para que R cree las dicotómicas por ti.",r:String.raw`edad   <- c(25, 31, 40)
ciudad <- c("Medellín", "Bogotá", "Medellín")
casado <- c(TRUE, FALSE, TRUE)
class(edad); class(ciudad); class(casado)
ciudad_f <- factor(ciudad)
levels(ciudad_f)                # categorías
table(ciudad_f)                 # frecuencias`,o:"numeric, character, logical; los niveles «Bogotá» y «Medellín», con 1 y 2 observaciones."},
{t:"La base de datos: data.frame",x:"Una base de datos es una tabla: cada <b>fila</b> es una observación y cada <b>columna</b> una variable. En R se llama <code>data.frame</code>. Con <code>$</code> sacas una columna.",r:String.raw`df <- data.frame(
  salario = c(1.2, 1.5, 0.9, 2.0, 1.4),   # millones de pesos
  educ    = c(11, 14, 9, 16, 12),         # años de educación
  mujer   = c(1, 0, 1, 0, 1)
)
df                  # mira la tabla
nrow(df); ncol(df)  # observaciones y variables
df$salario          # una columna
df[2, ]             # la fila 2
df[df$mujer == 1, ] # solo las mujeres
df$ln_sal <- log(df$salario)   # crear una variable nueva`,o:"Una tabla de 5 filas y 3 columnas; al final aparece la columna ln_sal."},
{t:"Paquetes: instalar una vez, cargar cada vez",x:"Los paquetes agregan funciones. Se instalan <b>una sola vez</b> con <code>install.packages()</code> y se cargan <b>en cada sesión</b> con <code>library()</code>. Estos son los que usa este manual.",r:String.raw`install.packages(c("wooldridge", "lmtest", "sandwich", "car", "AER",
                   "plm", "strucchange", "tseries", "tidyr", "forecast"))
library(wooldridge)   # datos del libro de Wooldridge
library(lmtest)       # pruebas sobre modelos (Breusch-Pagan, Durbin-Watson...)`,no:1,o:"La instalación tarda unos minutos la primera vez. Si R pregunta por un «mirror», elige cualquiera."},
{t:"Cargar datos de ejemplo y explorarlos",x:"El paquete <code>wooldridge</code> trae las bases del libro. <code>wage1</code> tiene 526 trabajadores de EE. UU. (1976) con salario, educación, experiencia y más. Antes de estimar, <b>siempre</b> mira los datos.",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
head(wage1[, c("wage", "educ", "exper", "female")])   # primeras filas
str(wage1[, 1:5])        # tipo de cada variable
summary(wage1$wage)      # mínimo, cuartiles, media, máximo
sum(is.na(wage1$wage))   # cuántos datos faltan`,o:"El salario por hora va de 0,53 a 24,98 dólares, con media 5,90 y sin datos faltantes."},
{t:"Leer tus propios datos (Excel o CSV)",x:"Para tus talleres: guarda el archivo en una carpeta, dile a R que trabaje ahí y léelo. En Colombia los CSV suelen usar punto y coma y coma decimal: por eso <code>read.csv2</code>.",r:String.raw`setwd("C:/Users/tu_usuario/Documents/econometria")  # carpeta de trabajo
getwd()                                  # comprueba dónde estás
datos <- read.csv("datos.csv")           # separador coma, punto decimal
datos <- read.csv2("datos.csv")          # separador ; y coma decimal
# install.packages("readxl")
library(readxl)
datos <- read_excel("datos.xlsx", sheet = 1)`,no:1,o:"Si sale «cannot open file», revisa el nombre del archivo y la carpeta. En RStudio también sirve Session > Set Working Directory."},
{t:"Gráficos básicos",x:"Un histograma muestra la distribución de una variable; un diagrama de dispersión muestra la relación entre dos.",r:String.raw`data("wage1", package = "wooldridge")
hist(wage1$wage, main = "Salario por hora", xlab = "US$ por hora", col = "grey")
plot(wage1$educ, wage1$wage, xlab = "Años de educación", ylab = "Salario")
abline(lm(wage ~ educ, data = wage1), col = "red")   # recta de MCO`,o:"Un histograma sesgado a la derecha (pocos salarios muy altos) y una nube de puntos con pendiente positiva."},
{t:"Ayuda y errores frecuentes",x:"Con <code>?función</code> abres la ayuda. Los errores más comunes al empezar: olvidar cargar el paquete, escribir mal el nombre de una variable (R distingue mayúsculas) y usar coma decimal en el código (en R el decimal es el punto).",r:String.raw`?lm                     # ayuda de la función lm
names(wage1)[1:6]       # nombres exactos de las variables
3.5 + 1                 # bien: el decimal es punto
# 3,5 + 1               # mal: da error`,o:"La ayuda se abre en el panel derecho; los nombres son wage, educ, exper, tenure, nonwhite, female."}];

RM["variables"]=[
{t:"Carga los datos de la lección",x:"Usamos <code>wage1</code>: salario por hora (<code>wage</code>), su logaritmo (<code>lwage</code>), años de educación (<code>educ</code>), experiencia (<code>exper</code>) y si es mujer (<code>female</code>).",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")`},
{t:"Variable dependiente e independiente",x:"La dependiente <span class=\"m\">y</span> es la que queremos explicar (el salario); la independiente <span class=\"m\">x</span> la explica (la educación). En la fórmula de R se escribe <code>y ~ x</code>, que se lee «y en función de x».",f:"y = β₀ + β₁x + u",r:String.raw`y <- wage1$wage    # dependiente
x <- wage1$educ    # independiente
m <- lm(wage ~ educ, data = wage1)
coef(m)`,o:"β̂₀ = −0,905 y β̂₁ = 0,541: cada año de educación se asocia con 0,54 dólares más por hora."},
{t:"Escalas: nominal, ordinal, intervalo y razón",x:"Una variable <b>nominal</b> solo clasifica (sexo, región): en R va como <code>factor</code>. Una <b>ordinal</b> además ordena (estrato): <code>factor(..., ordered = TRUE)</code>. Las de <b>intervalo</b> y <b>razón</b> son numéricas; solo las de razón (cero real, como el salario) admiten logaritmo.",r:String.raw`wage1$sexo <- factor(wage1$female, levels = c(0, 1), labels = c("hombre", "mujer"))
table(wage1$sexo)
wage1$region <- factor(ifelse(wage1$south == 1, "sur",
                        ifelse(wage1$west == 1, "oeste",
                        ifelse(wage1$northcen == 1, "centro norte", "noreste"))))
table(wage1$region)
summary(wage1$wage)   # razón: tiene cero real`,o:"274 hombres y 252 mujeres; cuatro regiones."},
{t:"Continuas y discretas",x:"Una variable <b>continua</b> puede tomar cualquier valor en un rango (salario); una <b>discreta</b> toma valores contables (número de dependientes).",r:String.raw`head(unique(wage1$wage))      # muchos valores distintos: continua
table(wage1$numdep)           # pocos valores enteros: discreta`,o:"numdep va de 0 a 6 dependientes."},
{t:"Modelo nivel-nivel",x:"Si x sube una unidad, y cambia β₁ unidades.",f:"wage = β₀ + β₁·educ",r:String.raw`coef(lm(wage ~ educ, data = wage1))`,o:"β̂₁ = 0,541 dólares por hora por año de educación."},
{t:"Modelo log-nivel (semielasticidad)",x:"Con el logaritmo en la dependiente, si x sube una unidad, y cambia aproximadamente 100·β₁ %. El cambio exacto es 100·(e^β₁ − 1).",f:"ln(wage) = β₀ + β₁·educ  ⇒  %Δwage ≈ 100·β₁",r:String.raw`m_ln <- lm(log(wage) ~ educ, data = wage1)
b1 <- coef(m_ln)["educ"]
100 * b1                # aproximación (%)
100 * (exp(b1) - 1)     # cambio exacto (%)`,o:"8,27 % aproximado y 8,63 % exacto por cada año de educación."},
{t:"Modelo nivel-log",x:"Si x sube 1 %, y cambia β₁/100 unidades.",f:"y = β₀ + β₁·ln(x)  ⇒  Δy ≈ (β₁/100)·%Δx",r:String.raw`data("ceosal1", package = "wooldridge")   # salarios de gerentes y ventas
m_nl <- lm(salary ~ log(sales), data = ceosal1)
coef(m_nl)["log(sales)"] / 100   # miles de US$ por cada 1 % más de ventas`,o:"Cerca de 2,6: si las ventas suben 1 %, el salario sube unos 2.600 dólares al año (salary está en miles)."},
{t:"Modelo log-log (elasticidad)",x:"Con logaritmo en ambos lados, β₁ es una elasticidad: si x sube 1 %, y cambia β₁ %.",f:"ln(y) = β₀ + β₁·ln(x)  ⇒  β₁ = %Δy / %Δx",r:String.raw`m_ll <- lm(log(salary) ~ log(sales), data = ceosal1)
coef(m_ll)["log(sales)"]`,o:"0,257: si las ventas suben 1 %, el salario del gerente sube 0,257 %."}];

RM["datos"]=[
{t:"Corte transversal",x:"Muchas unidades (personas, empresas) observadas en un mismo momento. El orden de las filas no importa.",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
dim(wage1)           # 526 personas, 24 variables, un solo año`,o:"526 filas y 24 columnas."},
{t:"Serie de tiempo",x:"Una unidad (un país) observada en muchos períodos. El orden sí importa, y en R conviene convertirla en objeto <code>ts</code> indicando el año inicial y la frecuencia.",r:String.raw`data("phillips", package = "wooldridge")   # EE. UU., 1948-2003
head(phillips[, c("year", "unem", "inf")])
unem <- ts(phillips$unem, start = 1948, frequency = 1)   # anual
plot(unem, ylab = "Desempleo (%)")`,o:"Una serie anual de desempleo e inflación desde 1948."},
{t:"Datos de panel",x:"Las mismas unidades seguidas en varios períodos: se identifica cada fila con el <b>individuo</b> y el <b>período</b>.",r:String.raw`data("wagepan", package = "wooldridge")   # 545 hombres, 1980-1987
head(wagepan[, c("nr", "year", "lwage", "union")])
length(unique(wagepan$nr)); table(wagepan$year)[1:3]`,o:"545 individuos, cada uno con 8 años: 4.360 filas."},
{t:"Cortes transversales agrupados",x:"Muestras distintas de varios años juntas (no son las mismas personas). Se agrega una dicotómica por año.",r:String.raw`data("cps78_85", package = "wooldridge")`,no:1,o:"Se trabaja como un corte transversal con dicotómicas de año (y78, y85…)."},
{t:"Formato largo y formato ancho",x:"En formato <b>largo</b> hay una fila por individuo y período (el que piden los paquetes de panel). En formato <b>ancho</b> hay una fila por individuo y una columna por período. <code>tidyr</code> pasa de uno a otro.",r:String.raw`library(tidyr)
largo <- wagepan[wagepan$nr %in% c(13, 17), c("nr", "year", "lwage")]
ancho <- pivot_wider(largo, names_from = year, values_from = lwage, names_prefix = "lwage_")
ancho                         # una fila por persona
de_vuelta <- pivot_longer(ancho, cols = starts_with("lwage_"),
                          names_to = "year", names_prefix = "lwage_", values_to = "lwage")
head(de_vuelta)`,o:"Dos filas (una por persona) con 8 columnas de salario, y de vuelta 16 filas."}];

RM["matrices"]=[
{t:"Escribe X y y",x:"Cada fila de X es una observación; la primera columna son unos (el intercepto) y la segunda la regresora. Con 4 observaciones del ejemplo de la lección:",f:"y = Xβ + u,  X = [1 x]",r:String.raw`X <- cbind(1, c(2, 3, 5, 6))   # cbind pega columnas
y <- c(12, 15, 20, 22)
X
dim(X)                          # n × k`,o:"Una matriz de 4 × 2."},
{t:"Transpuesta y producto",x:"<code>t()</code> transpone y <code>%*%</code> multiplica matrices (el <code>*</code> solo multiplica elemento por elemento).",f:"X′X = [n Σx; Σx Σx²],  X′y = [Σy; Σxy]",r:String.raw`t(X)
XtX <- t(X) %*% X
Xty <- t(X) %*% y
XtX; Xty`,o:"X′X = [4 16; 16 74] y X′y = [69; 301]."},
{t:"Inversa",x:"<code>solve(A)</code> da la inversa A⁻¹. Comprueba que A·A⁻¹ es la identidad.",f:"(X′X)⁻¹ = (1/det)·[Σx² −Σx; −Σx n]",r:String.raw`det(XtX)                 # 4·74 − 16² = 40
XtX_inv <- solve(XtX)
XtX_inv
round(XtX %*% XtX_inv, 10)   # identidad`,o:"El determinante es 40 y la inversa [1,85 −0,4; −0,4 0,1]."},
{t:"El estimador β̂ = (X′X)⁻¹X′y",x:"Es toda la regresión por MCO en una línea.",f:"β̂ = (X′X)⁻¹ X′y",r:String.raw`b <- XtX_inv %*% Xty
b
coef(lm(y ~ X[, 2]))    # comprobación con lm`,o:"β̂₀ = 7,25 y β̂₁ = 2,5 por los dos caminos."}];

RM["mco-simple"]=[
{t:"Carga los datos",x:"Salario por hora contra años de educación (Wooldridge, ejemplo 2.4).",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
y <- wage1$wage; x <- wage1$educ; n <- length(y)`},
{t:"La pendiente con la fórmula",x:"MCO escoge la recta que hace mínima la suma de los residuos al cuadrado. La pendiente es la covarianza entre x y y dividida por la varianza de x.",f:"β̂₁ = Σ(xᵢ − x̄)(yᵢ − ȳ) / Σ(xᵢ − x̄)²",r:String.raw`b1 <- sum((x - mean(x)) * (y - mean(y))) / sum((x - mean(x))^2)
b1
cov(x, y) / var(x)      # lo mismo`,o:"0,5414."},
{t:"El intercepto",x:"La recta de MCO pasa por el punto de medias.",f:"β̂₀ = ȳ − β̂₁ x̄",r:String.raw`b0 <- mean(y) - b1 * mean(x)
b0`,o:"−0,9049."},
{t:"Lo mismo con lm()",x:"<code>lm()</code> hace todo el cálculo; <code>summary()</code> muestra coeficientes, errores estándar, t, p-valores, R² y la prueba F.",r:String.raw`m <- lm(wage ~ educ, data = wage1)
summary(m)`,o:"Los mismos −0,905 y 0,541, con R² = 0,165."},
{t:"Valores ajustados y residuos",x:"El valor ajustado es el punto sobre la recta; el residuo, la distancia vertical hasta el dato. Por construcción, los residuos suman cero y no están correlacionados con x.",f:"ŷᵢ = β̂₀ + β̂₁xᵢ,  ûᵢ = yᵢ − ŷᵢ",r:String.raw`yhat <- fitted(m); u <- resid(m)
head(cbind(y, yhat, u), 3)
sum(u)            # ≈ 0
sum(x * u)        # ≈ 0`,o:"Las dos sumas dan prácticamente cero (del orden de 10⁻¹²)."},
{t:"Descomposición de la variación y R²",x:"La variación total de y se reparte en la que explica el modelo y la que queda en los residuos.",f:"SCT = Σ(yᵢ − ȳ)² = SCE + SCR,  R² = SCE/SCT = 1 − SCR/SCT",r:String.raw`SCT <- sum((y - mean(y))^2)
SCE <- sum((yhat - mean(y))^2)
SCR <- sum(u^2)
c(SCT = SCT, SCE_mas_SCR = SCE + SCR)
SCE / SCT
summary(m)$r.squared   # comprobación`,o:"SCT = 7.160,4 = SCE + SCR y R² = 0,1648: la educación explica el 16,5 % de la variación del salario."},
{t:"Gráfico de la regresión",x:"Dibuja los datos y la recta estimada.",r:String.raw`plot(x, y, xlab = "educ", ylab = "wage", pch = 16, col = "grey")
abline(m, col = "red", lwd = 2)`}];

RM["mco-matricial"]=[
{t:"El modelo con varias regresoras",x:"Salario (en logaritmo) contra educación, experiencia y antigüedad (Wooldridge, ejemplo 3.2).",f:"ln(wage) = β₀ + β₁educ + β₂exper + β₃tenure + u",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
m <- lm(lwage ~ educ + exper + tenure, data = wage1)
coef(m)`,o:"0,284 + 0,092·educ + 0,0041·exper + 0,022·tenure."},
{t:"Arma X y y",x:"<code>model.matrix()</code> arma la matriz X con la columna de unos.",r:String.raw`X <- model.matrix(m)
y <- wage1$lwage
n <- nrow(X); k <- ncol(X)
c(n = n, k = k)
head(X, 3)`,o:"n = 526 y k = 4 (el intercepto cuenta)."},
{t:"β̂ con matrices",x:"La misma fórmula de la estación anterior, ahora con cuatro columnas.",f:"β̂ = (X′X)⁻¹X′y",r:String.raw`b <- solve(t(X) %*% X) %*% t(X) %*% y
cbind(b, coef(m))`,o:"Las dos columnas son iguales."},
{t:"Varianza del error y grados de libertad",x:"Se divide por n − k porque se estimaron k parámetros.",f:"σ̂² = SCR / (n − k)",r:String.raw`u <- y - X %*% b
s2 <- sum(u^2) / (n - k)
s2
sigma(m)^2        # comprobación
n - k             # grados de libertad`,o:"σ̂² = 0,1944 con 522 grados de libertad."},
{t:"Matriz de varianzas y errores estándar",x:"Los errores estándar son la raíz de la diagonal de σ̂²(X′X)⁻¹.",f:"Var(β̂) = σ̂²(X′X)⁻¹,  ee(β̂ⱼ) = √[Var(β̂)]ⱼⱼ",r:String.raw`V <- s2 * solve(t(X) %*% X)
ee <- sqrt(diag(V))
cbind(ee, summary(m)$coefficients[, "Std. Error"])`,o:"ee(educ) = 0,0073, igual a lo que reporta summary."}];

RM["supuestos"]=[
{t:"Estima el modelo de trabajo",x:"Revisamos los supuestos sobre el modelo de la estación anterior.",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
m <- lm(lwage ~ educ + exper + tenure, data = wage1)`},
{t:"Sin colinealidad perfecta",x:"Ninguna regresora puede ser combinación lineal exacta de otras. Si lo es, R no puede invertir X′X y muestra NA en el coeficiente.",f:"rango(X) = k",r:String.raw`wage1$educ2 <- 2 * wage1$educ           # copia exacta de educ
coef(lm(lwage ~ educ + educ2, data = wage1))
qr(model.matrix(m))$rank                # debe ser k = 4`,o:"El coeficiente de educ2 sale NA; el rango del modelo bueno es 4."},
{t:"Media condicional cero (lo que sí se puede revisar)",x:"E(u|x) = 0 no se puede probar con los residuos, porque MCO los fuerza a tener media cero y a no correlacionarse con las x. Lo que sí sirve es graficar los residuos contra cada x y buscar patrones (por ejemplo, curvatura).",f:"E(u | x₁, …, x_k) = 0",r:String.raw`u <- resid(m)
mean(u); cor(u, wage1$educ)      # ≈ 0 siempre, por construcción
plot(wage1$exper, u, xlab = "exper", ylab = "residuo")
abline(h = 0, col = "red")`,o:"Media y correlación prácticamente cero (del orden de 10⁻¹⁶). En el gráfico, si los residuos dibujan una curva en vez de una nube plana, falta un término como exper²."},
{t:"Homocedasticidad: mira el abanico",x:"La varianza del error debe ser constante. Si los residuos se abren como un abanico al subir los valores ajustados, hay heterocedasticidad (estación de heterocedasticidad).",f:"Var(u | x) = σ²",r:String.raw`plot(fitted(m), resid(m), xlab = "ajustados", ylab = "residuos")
abline(h = 0, col = "red")`},
{t:"Normalidad de los errores",x:"Hace falta para que t y F sean exactas en muestras pequeñas. Se mira con un histograma, un gráfico QQ y la prueba de Shapiro-Wilk (H₀: normalidad). Con muestras grandes importa poco.",r:String.raw`hist(resid(m), breaks = 30)
qqnorm(resid(m)); qqline(resid(m), col = "red")
shapiro.test(resid(m))`,o:"W = 0,989 con p-valor 0,0008: se rechaza la normalidad, pero con n = 526 la inferencia sigue siendo válida en forma aproximada."},
{t:"Los cuatro gráficos de diagnóstico",x:"R tiene un atajo con los cuatro gráficos clásicos.",r:String.raw`par(mfrow = c(2, 2)); plot(m); par(mfrow = c(1, 1))`}];

RM["inferencia"]=[
{t:"Estima el modelo",x:"Mismo modelo de salarios.",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
m <- lm(lwage ~ educ + exper + tenure, data = wage1)
n <- nobs(m); k <- length(coef(m))`},
{t:"Estadístico t a mano",x:"Para H₀: βⱼ = 0, se divide el coeficiente por su error estándar.",f:"t = (β̂ⱼ − 0) / ee(β̂ⱼ)  ~  t(n − k)",r:String.raw`b  <- coef(m)["exper"]
ee <- sqrt(diag(vcov(m)))["exper"]
t  <- b / ee
t`,o:"t = 2,39 para exper."},
{t:"Valor crítico y decisión",x:"Con α = 5 % a dos colas, se rechaza H₀ si |t| supera el valor crítico.",f:"Rechazo si |t| > t(α/2; n − k)",r:String.raw`tc <- qt(0.975, df = n - k)
tc
abs(t) > tc`,o:"Valor crítico 1,965: como 2,39 > 1,965, se rechaza H₀; la experiencia es significativa al 5 %."},
{t:"p-valor",x:"Es la probabilidad de un t tan extremo si H₀ fuera cierta.",f:"p = 2·P(T > |t|)",r:String.raw`2 * pt(-abs(t), df = n - k)
summary(m)$coefficients["exper", ]`,o:"p = 0,017, igual al de summary."},
{t:"Intervalo de confianza",x:"El intervalo al 95 % contiene los valores de β que no se rechazarían.",f:"β̂ⱼ ± t(0,025; n − k)·ee(β̂ⱼ)",r:String.raw`c(b - tc * ee, b + tc * ee)
confint(m, "exper", level = 0.95)`,o:"[0,0007; 0,0075] por los dos caminos."},
{t:"Prueba F de varias restricciones",x:"Para H₀: β_exper = β_tenure = 0 se compara el modelo restringido (sin esas variables) con el no restringido.",f:"F = [(SCRᵣ − SCRₙᵣ)/q] / [SCRₙᵣ/(n − k)]  ~  F(q, n − k)",r:String.raw`mr  <- lm(lwage ~ educ, data = wage1)          # restringido
SCRr <- sum(resid(mr)^2); SCRnr <- sum(resid(m)^2); q <- 2
F <- ((SCRr - SCRnr) / q) / (SCRnr / (n - k))
F
qf(0.95, q, n - k)              # valor crítico
1 - pf(F, q, n - k)             # p-valor`,o:"F = 49,7, mucho mayor que el crítico 3,01 (p-valor prácticamente cero): se rechaza que exper y tenure sean conjuntamente cero."},
{t:"La misma F con funciones",x:"<code>anova()</code> compara dos modelos anidados y <code>linearHypothesis()</code> (paquete car) prueba restricciones escritas como texto, incluso de igualdad.",r:String.raw`anova(mr, m)
library(car)
linearHypothesis(m, c("exper = 0", "tenure = 0"))
linearHypothesis(m, "exper = tenure")    # H0: los dos efectos son iguales`,o:"La misma F = 49,7. La última prueba (exper = tenure) da F = 17,95: los dos efectos no son iguales."}];

RM["dicotomicas"]=[
{t:"Carga los datos",x:"<code>female</code> vale 1 si la persona es mujer y 0 si es hombre.",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
table(wage1$female)`},
{t:"Cambio en el intercepto",x:"La dicotómica desplaza la recta en paralelo: δ₀ es la diferencia promedio entre los grupos con la misma educación y experiencia.",f:"wage = β₀ + δ₀·female + β₁·educ + … + u",r:String.raw`m1 <- lm(wage ~ female + educ + exper + tenure, data = wage1)
coef(m1)["female"]`,o:"δ̂₀ = −1,81: con la misma educación, experiencia y antigüedad, las mujeres ganan 1,81 dólares menos por hora."},
{t:"En logaritmos, la diferencia es porcentual",x:"Con ln(wage), la diferencia exacta entre grupos es 100·(e^δ₀ − 1).",f:"%Δ = 100·(e^δ̂₀ − 1)",r:String.raw`m2 <- lm(lwage ~ female + educ + exper + tenure, data = wage1)
d <- coef(m2)["female"]
100 * (exp(d) - 1)`,o:"−26,0 %: a igualdad de lo demás, las mujeres ganan 26 % menos por hora."},
{t:"Cambio en la pendiente: interacción",x:"Si el efecto de la educación es distinto para hombres y mujeres, se agrega el producto female·educ. En R, <code>female * educ</code> incluye female, educ y su interacción.",f:"ln(wage) = β₀ + δ₀female + β₁educ + δ₁(female·educ) + …",r:String.raw`m3 <- lm(lwage ~ female * educ + exper + tenure, data = wage1)
coef(summary(m3))[c("female", "educ", "female:educ"), ]`,o:"δ̂₁ es pequeño y no significativo: el retorno de la educación no difiere entre hombres y mujeres en esta muestra."},
{t:"Varias categorías y la trampa de las dicotómicas",x:"Con g categorías se incluyen g − 1 dicotómicas: la que se omite es la <b>base</b>. Si se incluyen todas con intercepto, hay colinealidad perfecta. Con un factor, R omite la base solo; <code>relevel()</code> cambia cuál es.",r:String.raw`wage1$region <- factor(ifelse(wage1$south == 1, "sur", ifelse(wage1$west == 1, "oeste",
                       ifelse(wage1$northcen == 1, "centro norte", "noreste"))))
wage1$region <- relevel(wage1$region, ref = "noreste")
coef(lm(lwage ~ educ + region, data = wage1))`,o:"Tres coeficientes de región, cada uno comparado con el noreste."}];

RM["chow"]=[
{t:"La pregunta y los datos",x:"¿La ecuación de salarios es la misma para hombres y para mujeres? Se estima la ecuación con todos (agrupada) y por separado.",r:String.raw`library(wooldridge)
data("wage1", package = "wooldridge")
f  <- lwage ~ educ + exper + tenure
mp <- lm(f, data = wage1)                      # agrupada
m1 <- lm(f, data = subset(wage1, female == 0)) # hombres
m2 <- lm(f, data = subset(wage1, female == 1)) # mujeres`},
{t:"Las tres SCR",x:"La SCR agrupada nunca es menor que la suma de las dos SCR separadas.",r:String.raw`SCRp <- sum(resid(mp)^2); SCR1 <- sum(resid(m1)^2); SCR2 <- sum(resid(m2)^2)
c(SCRp = SCRp, SCR1 = SCR1, SCR2 = SCR2)
n <- nrow(wage1); k <- length(coef(mp))`,o:"SCRp = 101,46; SCR₁ = 49,55; SCR₂ = 39,04."},
{t:"El estadístico de Chow",x:"Compara cuánto empeora el ajuste al obligar a los dos grupos a tener los mismos coeficientes.",f:"F = [(SCRp − SCR₁ − SCR₂)/k] / [(SCR₁ + SCR₂)/(n − 2k)]  ~  F(k, n − 2k)",r:String.raw`F <- ((SCRp - SCR1 - SCR2) / k) / ((SCR1 + SCR2) / (n - 2 * k))
F
qf(0.95, k, n - 2 * k)
1 - pf(F, k, n - 2 * k)`,o:"F = 18,8, muy por encima del crítico 2,39: los coeficientes difieren entre hombres y mujeres."},
{t:"Versión con dicotómicas (equivalente)",x:"Interactuar todas las variables con la dicotómica y probar que todas las interacciones y la dicotómica son cero da exactamente la misma F.",r:String.raw`mi <- lm(lwage ~ female * (educ + exper + tenure), data = wage1)
anova(mp, mi)`,o:"La misma F = 18,8, con 4 y 518 grados de libertad."},
{t:"Chow en una serie de tiempo",x:"Con datos en el tiempo, la pregunta es si hubo un quiebre en una fecha conocida. <code>strucchange</code> lo calcula indicando la observación del quiebre; con fecha desconocida, <code>Fstats</code> prueba todas.",r:String.raw`library(strucchange)
data("phillips", package = "wooldridge")
corte <- which(phillips$year == 1974)          # observación del quiebre
sctest(inf ~ unem, data = phillips, type = "Chow", point = corte)
fs <- Fstats(inf ~ unem, data = phillips)       # quiebre desconocido
sctest(fs)
phillips$year[fs$breakpoint]`,o:"Con el quiebre en 1974, F = 2,88 (p = 0,065): no se rechaza al 5 %. Buscando el quiebre, sup-F = 14,9 (p = 0,012) señala 1967."}];

RM["hetero"]=[
{t:"Modelo de precios de vivienda",x:"Precio de 88 casas contra tamaño del lote, área construida y alcobas (Wooldridge, ejemplo 8.4).",r:String.raw`library(wooldridge); library(lmtest); library(sandwich)
data("hprice1", package = "wooldridge")
m <- lm(price ~ lotsize + sqrft + bdrms, data = hprice1)
n <- nobs(m)`},
{t:"Mira el abanico",x:"Si la dispersión de los residuos crece con los valores ajustados, la varianza no es constante.",r:String.raw`plot(fitted(m), resid(m)); abline(h = 0, col = "red")`},
{t:"Breusch-Pagan a mano",x:"Se regresa û² contra las x. Si las x explican û², la varianza depende de ellas.",f:"û² = δ₀ + δ₁x₁ + … + δ_kx_k + v  ⇒  LM = n·R²_aux  ~  χ²(k)",r:String.raw`aux <- lm(resid(m)^2 ~ lotsize + sqrft + bdrms, data = hprice1)
LM <- n * summary(aux)$r.squared
LM
qchisq(0.95, df = 3)
1 - pchisq(LM, df = 3)`,o:"LM = 14,09 > 7,81 (p = 0,003): hay heterocedasticidad."},
{t:"Breusch-Pagan y White con funciones",x:"<code>bptest()</code> hace la prueba anterior. Para White se agregan cuadrados y productos cruzados en la regresión auxiliar.",r:String.raw`bptest(m)
bptest(m, ~ lotsize * sqrft + lotsize * bdrms + sqrft * bdrms +
           I(lotsize^2) + I(sqrft^2) + I(bdrms^2), data = hprice1)   # White`,o:"BP = 14,09 (p = 0,003); White también rechaza la homocedasticidad."},
{t:"Corrección 1: errores estándar robustos",x:"Los coeficientes no cambian; se recalculan los errores estándar con la fórmula de White (HC1, la misma de Stata).",f:"Var̂(β̂) = (X′X)⁻¹ X′diag(ûᵢ²)X (X′X)⁻¹ · n/(n − k)",r:String.raw`coeftest(m)                                         # errores usuales
coeftest(m, vcov = vcovHC(m, type = "HC1"))         # robustos`,o:"El error estándar de lotsize sube de 0,00064 a 0,0012 y deja de ser tan significativo."},
{t:"Corrección 2: transformar o ponderar",x:"Tomar logaritmos suele reducir la heterocedasticidad. Si se conoce la forma de la varianza, MCP pondera cada observación por 1/varianza.",f:"Si Var(u|x) = σ²·h(x): pondera por 1/h(x)",r:String.raw`ml <- lm(log(price) ~ log(lotsize) + log(sqrft) + bdrms, data = hprice1)
bptest(ml)                                  # ya no rechaza
mcp <- lm(price ~ lotsize + sqrft + bdrms, data = hprice1, weights = 1 / lotsize)
coef(mcp)`,o:"En logaritmos, BP = 4,22 (p = 0,24): ya no hay evidencia de heterocedasticidad."}];

RM["autocorr"]=[
{t:"Curva de Phillips estática",x:"Inflación contra desempleo en EE. UU., datos anuales de 1948 a 1996 (Wooldridge, capítulo 12).",r:String.raw`library(wooldridge); library(lmtest); library(sandwich)
data("phillips", package = "wooldridge")
ph <- subset(phillips, year <= 1996)
m <- lm(inf ~ unem, data = ph)
u <- resid(m); n <- length(u)`},
{t:"Mira los residuos en el tiempo",x:"Si un residuo positivo tiende a seguir a otro positivo, hay autocorrelación positiva.",r:String.raw`plot(ph$year, u, type = "b"); abline(h = 0, col = "red")
cor(u[-1], u[-n])      # correlación entre u_t y u_(t-1)`,o:"Rachas largas del mismo signo; correlación de 0,59."},
{t:"Durbin-Watson a mano",x:"DW cerca de 2 indica que no hay autocorrelación; cerca de 0, autocorrelación positiva.",f:"DW = Σ(ûₜ − ûₜ₋₁)² / Σûₜ²  ≈ 2(1 − ρ̂)",r:String.raw`DW <- sum(diff(u)^2) / sum(u^2)
DW
dwtest(m)`,o:"DW = 0,80 con p-valor muy pequeño: autocorrelación positiva."},
{t:"Breusch-Godfrey",x:"Sirve también con rezagos de y y para órdenes mayores: se regresa ûₜ contra las x y los residuos rezagados.",f:"ûₜ = α₀ + α₁xₜ + ρ₁ûₜ₋₁ + … + ρ_pûₜ₋ₚ  ⇒  LM = (n − p)·R²  ~  χ²(p)",r:String.raw`bgtest(m, order = 1)
bgtest(m, order = 2)`,o:"LM = 18,5 con p-valor menor que 0,0001 en los dos órdenes."},
{t:"Corrección 1: errores de Newey-West",x:"Mantienen los coeficientes de MCO y corrigen los errores estándar por autocorrelación y heterocedasticidad.",r:String.raw`coeftest(m, vcov = NeweyWest(m, lag = 2, prewhite = FALSE))`,o:"El coeficiente de unem (0,468) no cambia; su error estándar sube a 0,280 y deja de ser significativo."},
{t:"Corrección 2: Cochrane-Orcutt paso a paso",x:"Se estima ρ con los residuos, se cuasi-diferencian los datos y se vuelve a estimar por MCO (MCG factibles).",f:"yₜ − ρ̂yₜ₋₁ = β₀(1 − ρ̂) + β₁(xₜ − ρ̂xₜ₋₁) + eₜ",r:String.raw`rho <- coef(lm(u[-1] ~ u[-n] - 1))
rho
ys <- ph$inf[-1]  - rho * ph$inf[-n]
xs <- ph$unem[-1] - rho * ph$unem[-n]
co <- lm(ys ~ xs)
c(b0 = coef(co)[1] / (1 - rho), b1 = coef(co)[2])`,o:"ρ̂ ≈ 0,57; la pendiente cambia de signo frente a MCO, como en el libro (la versión iterada con prais o orcutt da valores parecidos)."},
{t:"La misma corrección con un paquete base",x:"<code>nlme::gls</code> (viene con R) estima el modelo con errores AR(1) por máxima verosimilitud.",r:String.raw`library(nlme)
g <- gls(inf ~ unem, data = ph, correlation = corAR1(form = ~ year))
summary(g)$tTable`,o:"Pendiente de −0,75 (ee 0,31): con la corrección, la relación entre inflación y desempleo es negativa, como predice la curva de Phillips."}];

RM["multicol"]=[
{t:"Datos y modelo",x:"Precios de vivienda con regresoras que se mueven juntas (área y alcobas).",r:String.raw`library(wooldridge); library(car)
data("hprice1", package = "wooldridge")
m <- lm(price ~ lotsize + sqrft + bdrms, data = hprice1)`},
{t:"Correlaciones entre regresoras",x:"Una correlación alta entre dos regresoras es una primera señal (no la única).",r:String.raw`round(cor(hprice1[, c("lotsize", "sqrft", "bdrms")]), 3)`,o:"sqrft y bdrms tienen correlación de 0,53."},
{t:"VIF a mano",x:"Se regresa cada xⱼ contra las demás. Si las otras la explican casi toda (R²ⱼ cerca de 1), su varianza se infla.",f:"VIFⱼ = 1 / (1 − R²ⱼ),  Var(β̂ⱼ) = σ² / [SCTⱼ(1 − R²ⱼ)]",r:String.raw`R2j <- summary(lm(sqrft ~ lotsize + bdrms, data = hprice1))$r.squared
1 / (1 - R2j)
vif(m)`,o:"VIF(sqrft) = 1,42: no hay multicolinealidad preocupante (la regla usual alerta desde 10)."},
{t:"Colinealidad perfecta",x:"Si una variable es combinación exacta de otras, R deja el coeficiente en NA.",r:String.raw`hprice1$area_total <- hprice1$sqrft + 2 * hprice1$bdrms
coef(lm(price ~ sqrft + bdrms + area_total, data = hprice1))`,o:"area_total sale NA."}];

RM["especificacion"]=[
{t:"Datos",x:"Ecuación de salarios.",r:String.raw`library(wooldridge); library(lmtest)
data("wage1", package = "wooldridge")`},
{t:"Sesgo por variable omitida",x:"Si se omite x₂ y está correlacionada con x₁, el coeficiente de x₁ absorbe parte de su efecto. En la muestra se cumple exactamente la descomposición de abajo, con δ̃₁ de regresar x₂ contra x₁.",f:"β̃₁ = β̂₁ + β̂₂·δ̃₁",r:String.raw`largo <- lm(lwage ~ educ + exper, data = wage1)
corto <- lm(lwage ~ educ, data = wage1)
d1 <- coef(lm(exper ~ educ, data = wage1))["educ"]
c(corto = coef(corto)["educ"],
  formula = coef(largo)["educ"] + coef(largo)["exper"] * d1)`,o:"Los dos valores son idénticos: 0,0827. Como la experiencia se correlaciona negativamente con la educación, omitirla subestima el retorno de la educación (0,098 en el modelo largo)."},
{t:"Variables irrelevantes",x:"Incluir una variable que no importa no sesga, pero puede aumentar los errores estándar.",r:String.raw`set.seed(1); wage1$ruido <- rnorm(nrow(wage1))
coef(summary(lm(lwage ~ educ + exper + ruido, data = wage1)))[c("educ", "ruido"), ]`,o:"El coeficiente de educ casi no cambia (0,098) y el de ruido no es significativo (p = 0,48)."},
{t:"Prueba RESET de Ramsey a mano",x:"Si potencias de los valores ajustados ayudan a explicar y, falta algo de forma funcional.",f:"y = Xβ + γ₁ŷ² + γ₂ŷ³ + e,  H₀: γ₁ = γ₂ = 0 (prueba F)",r:String.raw`m <- lm(wage ~ educ + exper + tenure, data = wage1)
wage1$yh2 <- fitted(m)^2; wage1$yh3 <- fitted(m)^3
mr <- lm(wage ~ educ + exper + tenure + yh2 + yh3, data = wage1)
anova(m, mr)
resettest(m, power = 2:3, type = "fitted")`,o:"Las dos dan F = 11,57 (p ≈ 0,00001): se rechaza la forma lineal en niveles."},
{t:"Comparar modelos no anidados: AIC y BIC",x:"Con la misma variable dependiente, se prefiere el de menor AIC o BIC.",r:String.raw`m1 <- lm(lwage ~ educ + exper + tenure, data = wage1)
m2 <- lm(lwage ~ educ + exper + I(exper^2) + tenure, data = wage1)
AIC(m1, m2); BIC(m1, m2)`,o:"AIC 604,6 contra 637,1 y BIC 630,2 contra 658,4: gana el modelo con exper²."},
{t:"Error de medición en x: atenuación",x:"Si x se mide con error aleatorio, su coeficiente se acerca a cero.",r:String.raw`set.seed(2)
wage1$educ_mal <- wage1$educ + rnorm(nrow(wage1), sd = 2)
c(bien = coef(lm(lwage ~ educ, data = wage1))["educ"],
  con_error = coef(lm(lwage ~ educ_mal, data = wage1))["educ_mal"])`,o:"El coeficiente cae de 0,083 a 0,054: el error de medición lo atenúa hacia cero."}];

RM["vi"]=[
{t:"Datos: mujeres que trabajan",x:"Retorno de la educación con la educación del padre como instrumento (Wooldridge, ejemplo 15.1). La educación es endógena porque se correlaciona con la habilidad, que no se observa.",r:String.raw`library(wooldridge); library(AER)
data("mroz", package = "wooldridge")
d <- subset(mroz, inlf == 1)      # solo las que trabajan (tienen salario)
coef(lm(lwage ~ educ, data = d))  # MCO, probablemente sesgado`,o:"MCO da un retorno de 0,109 (10,9 % por año)."},
{t:"El estimador de VI a mano",x:"Con un instrumento z relevante (correlacionado con x) y exógeno (no correlacionado con u):",f:"β̂_VI = Cov(z, y) / Cov(z, x)",r:String.raw`cov(d$fatheduc, d$lwage) / cov(d$fatheduc, d$educ)`,o:"0,059: el retorno cae casi a la mitad."},
{t:"Primera etapa: ¿el instrumento es relevante?",x:"Se regresa x contra z (y las exógenas). Regla práctica: F mayor que 10.",r:String.raw`e1 <- lm(educ ~ fatheduc, data = d)
summary(e1)$fstatistic`,o:"F ≈ 88: el instrumento es fuerte."},
{t:"MC2E a mano (para entender)",x:"Segunda etapa: se reemplaza x por su valor ajustado de la primera etapa. Los coeficientes salen bien, pero los errores estándar de este lm no son los correctos.",r:String.raw`d$educ_hat <- fitted(e1)
coef(lm(lwage ~ educ_hat, data = d))`,o:"El mismo 0,059."},
{t:"MC2E con ivreg y sus pruebas",x:"En <code>ivreg</code> la fórmula es <code>y ~ regresoras | instrumentos</code> (las exógenas van en los dos lados). <code>diagnostics = TRUE</code> da la F de la primera etapa (instrumentos débiles), Wu-Hausman (¿hay endogeneidad?) y Sargan (sobreidentificación, con más de un instrumento).",r:String.raw`iv <- ivreg(lwage ~ educ + exper + I(exper^2) |
            fatheduc + motheduc + exper + I(exper^2), data = d)
summary(iv, diagnostics = TRUE)`,o:"Retorno de 0,061 (p = 0,051); F de instrumentos débiles 55,4 (fuertes); Wu-Hausman p = 0,095 (evidencia débil de endogeneidad); Sargan p = 0,54 (no rechaza la validez de los instrumentos)."}];

RM["simultaneas"]=[
{t:"Oferta de trabajo de las mujeres",x:"Horas y salario se determinan juntos (Wooldridge, ejemplo 16.5). En la ecuación de horas el salario es endógeno; la experiencia sirve de instrumento porque afecta el salario pero no está en la ecuación de horas.",r:String.raw`library(wooldridge); library(AER)
data("mroz", package = "wooldridge")
d <- subset(mroz, inlf == 1)`},
{t:"Sesgo de simultaneidad",x:"MCO en una ecuación con una variable endógena da coeficientes sesgados.",r:String.raw`coef(lm(hours ~ lwage + educ + age + kidslt6 + nwifeinc, data = d))["lwage"]`,o:"MCO da −2,05: un salario más alto casi no cambiaría las horas, un resultado contaminado por la simultaneidad."},
{t:"Forma reducida",x:"Cada endógena se escribe en función de todas las exógenas del sistema.",r:String.raw`fr <- lm(lwage ~ educ + age + kidslt6 + nwifeinc + exper + I(exper^2), data = d)
coef(summary(fr))[c("exper", "I(exper^2)"), ]`,o:"exper y exper² son significativas en la forma reducida: identifican la ecuación de horas."},
{t:"Condición de orden",x:"Una ecuación está identificada si las exógenas excluidas de ella son al menos tantas como las endógenas incluidas en el lado derecho.",f:"exógenas excluidas ≥ endógenas incluidas − 1",r:String.raw`excluidas <- c("exper", "I(exper^2)")   # no aparecen en la ecuación de horas
endogenas <- c("lwage")
length(excluidas) >= length(endogenas)`,o:"TRUE: la ecuación de horas está (sobre)identificada."},
{t:"Estimación por MC2E",x:"Igual que en variables instrumentales.",r:String.raw`horas <- ivreg(hours ~ lwage + educ + age + kidslt6 + nwifeinc |
               educ + age + kidslt6 + nwifeinc + exper + I(exper^2), data = d)
coef(summary(horas))["lwage", ]`,o:"El coeficiente de lwage pasa a ser positivo y grande (≈ 1.640 horas por unidad de log): la oferta de trabajo responde al salario."}];

RM["discreta"]=[
{t:"Participación laboral de las mujeres",x:"<code>inlf</code> = 1 si la mujer trabaja (Wooldridge, ejemplo 17.1).",r:String.raw`library(wooldridge)
data("mroz", package = "wooldridge")
f <- inlf ~ nwifeinc + educ + exper + I(exper^2) + age + kidslt6 + kidsge6`},
{t:"Modelo de probabilidad lineal (MPL)",x:"Es MCO con y dicotómica: cada coeficiente es un cambio en la probabilidad. Problemas: puede predecir fuera de [0, 1] y es heterocedástico por construcción (usa errores robustos).",f:"P(y = 1 | x) = β₀ + β₁x₁ + …",r:String.raw`mpl <- lm(f, data = mroz)
coef(mpl)["kidslt6"]
sum(fitted(mpl) < 0 | fitted(mpl) > 1)    # predicciones imposibles`,o:"Un hijo menor de 6 años reduce la probabilidad de trabajar en 26 puntos; 33 predicciones caen fuera de [0, 1]."},
{t:"Logit y probit",x:"Pasan el índice Xβ por una función que siempre está entre 0 y 1: la logística o la normal acumulada.",f:"Logit: P = e^(Xβ)/(1 + e^(Xβ))  ·  Probit: P = Φ(Xβ)",r:String.raw`lg <- glm(f, family = binomial(link = "logit"),  data = mroz)
pb <- glm(f, family = binomial(link = "probit"), data = mroz)
cbind(logit = coef(lg), probit = coef(pb))`,o:"Los coeficientes no son efectos marginales: solo su signo se interpreta directamente."},
{t:"Efectos marginales promedio a mano",x:"El efecto de xⱼ en la probabilidad depende de cada observación. Se promedia la densidad evaluada en Xβ y se multiplica por el coeficiente.",f:"EMPⱼ = β̂ⱼ · (1/n)Σ g(xᵢβ̂),  g = densidad logística o normal",r:String.raw`xb_lg <- predict(lg, type = "link"); xb_pb <- predict(pb, type = "link")
c(logit  = mean(dlogis(xb_lg)) * coef(lg)["kidslt6"],
  probit = mean(dnorm(xb_pb))  * coef(pb)["kidslt6"],
  mpl    = coef(mpl)["kidslt6"])
# install.packages("margins"); library(margins); summary(margins(lg))  # lo mismo con paquete`,o:"Los tres dan alrededor de −0,26: logit, probit y MPL coinciden en el efecto promedio."},
{t:"Razones de odds (logit)",x:"En logit, e^β es cuánto se multiplican los odds P/(1 − P) cuando x sube una unidad.",f:"odds = P/(1 − P),  OR = e^β",r:String.raw`exp(coef(lg))["kidslt6"]`,o:"0,24: cada hijo pequeño multiplica los odds de trabajar por 0,24."},
{t:"Bondad de ajuste y prueba de razón de verosimilitud",x:"El pseudo R² de McFadden compara la log-verosimilitud del modelo con la de un modelo solo con intercepto; la prueba LR prueba que todas las pendientes son cero.",f:"R²_McF = 1 − lnL/lnL₀,  LR = 2(lnL − lnL₀) ~ χ²(q)",r:String.raw`l0 <- glm(inlf ~ 1, family = binomial, data = mroz)
1 - as.numeric(logLik(lg)) / as.numeric(logLik(l0))       # pseudo R²
LR <- 2 * (logLik(lg) - logLik(l0)); LR
mean((fitted(lg) > 0.5) == mroz$inlf)                      # % bien clasificado`,o:"Pseudo R² = 0,22, LR = 226,2 con 7 grados de libertad y 73,6 % de observaciones bien clasificadas."}];

RM["panel"]=[
{t:"Datos de panel y paquetes",x:"545 hombres seguidos de 1980 a 1987. <code>plm</code> necesita saber cuál es el individuo y cuál el período (<code>index</code>).",r:String.raw`library(wooldridge); library(plm); library(lmtest)
data("wagepan", package = "wooldridge")
pd <- pdata.frame(wagepan, index = c("nr", "year"))
pdim(pd)`,o:"Panel balanceado: n = 545, T = 8, N = 4.360."},
{t:"MCO agrupado",x:"Ignora que son las mismas personas: si la habilidad (inobservable) se correlaciona con las x, está sesgado.",f:"yᵢₜ = β₀ + xᵢₜβ + (aᵢ + uᵢₜ)",r:String.raw`f <- lwage ~ expersq + married + union
po <- plm(f, data = pd, model = "pooling")
coef(po)`},
{t:"Efectos fijos: la transformación within a mano",x:"Restando a cada variable su promedio por individuo desaparece aᵢ (todo lo que no cambia en el tiempo, como la habilidad o la educación).",f:"(yᵢₜ − ȳᵢ) = (xᵢₜ − x̄ᵢ)β + (uᵢₜ − ūᵢ)",r:String.raw`dm <- function(v) v - ave(v, wagepan$nr)        # resta el promedio de cada persona
w <- data.frame(y = dm(wagepan$lwage), x1 = dm(wagepan$expersq),
                x2 = dm(wagepan$married), x3 = dm(wagepan$union))
coef(lm(y ~ x1 + x2 + x3 - 1, data = w))
fe <- plm(f, data = pd, model = "within")
coef(fe)`,o:"Los mismos coeficientes por los dos caminos. Las variables fijas en el tiempo (educ) no se pueden estimar con efectos fijos."},
{t:"Efectos aleatorios",x:"Supone que aᵢ no está correlacionado con las x; usa variación entre y dentro de los individuos.",r:String.raw`re <- plm(f, data = pd, model = "random")
coef(re)`},
{t:"Prueba de Hausman: ¿fijos o aleatorios?",x:"Si los coeficientes de efectos fijos y aleatorios difieren mucho, aᵢ se correlaciona con las x y se prefieren efectos fijos.",f:"H = (β̂_EF − β̂_EA)′[Var(β̂_EF) − Var(β̂_EA)]⁻¹(β̂_EF − β̂_EA)  ~  χ²(k)",r:String.raw`phtest(fe, re)`,o:"Se rechaza H₀: se prefieren los efectos fijos."},
{t:"Errores estándar agrupados por individuo",x:"Corrigen la correlación de los errores de una misma persona en el tiempo.",r:String.raw`coeftest(fe, vcov = vcovHC(fe, cluster = "group", type = "HC1"))`}];

RM["series"]=[
{t:"Una serie como objeto ts",x:"Desempleo anual de EE. UU.",r:String.raw`library(wooldridge); library(tseries)
data("phillips", package = "wooldridge")
y <- ts(phillips$unem, start = 1948)
plot(y)`},
{t:"Autocorrelación de la serie",x:"La función de autocorrelación muestra cuánto se parece la serie a sí misma rezagada. Si decae muy lento, la serie puede no ser estacionaria.",f:"ρₖ = Corr(yₜ, yₜ₋ₖ)",r:String.raw`acf(y); pacf(y)`},
{t:"Regresión espuria (simulación)",x:"Dos caminatas aleatorias independientes suelen dar un R² alto y un t «significativo» sin ninguna relación real.",f:"yₜ = yₜ₋₁ + eₜ,  xₜ = xₜ₋₁ + vₜ",r:String.raw`set.seed(8)
a <- cumsum(rnorm(200)); b <- cumsum(rnorm(200))
summary(lm(a ~ b))$r.squared        # alto aunque no hay relación
summary(lm(diff(a) ~ diff(b)))$r.squared   # en diferencias desaparece`,o:"R² = 0,71 en niveles y prácticamente 0 en diferencias."},
{t:"Dickey-Fuller a mano",x:"Se regresa Δyₜ contra yₜ₋₁. H₀: raíz unitaria (θ = 0). El t se compara con valores críticos de Dickey-Fuller (con constante, −2,86 al 5 %), no con los de la t normal.",f:"Δyₜ = α + θyₜ₋₁ + eₜ,  H₀: θ = 0",r:String.raw`dy <- diff(y); ylag <- y[-length(y)]
df <- lm(dy ~ ylag)
coef(summary(df))["ylag", "t value"]`,o:"t = −2,89, apenas por debajo de −2,86: con esta versión simple se rechaza la raíz unitaria por muy poco."},
{t:"Dickey-Fuller aumentada con función",x:"<code>adf.test</code> incluye rezagos de Δy y una tendencia.",r:String.raw`adf.test(y)
adf.test(diff(y))`,o:"Con rezagos y tendencia, el desempleo en niveles no rechaza la raíz unitaria (p = 0,49); en diferencias sí (p < 0,01). El resultado depende de la especificación: repórtala siempre."},
{t:"Modelos ARIMA y pronóstico",x:"Un AR(1) para el desempleo y su pronóstico a 3 años.",f:"yₜ = c + φyₜ₋₁ + eₜ",r:String.raw`fit <- arima(y, order = c(1, 0, 0))
fit
predict(fit, n.ahead = 3)$pred
# library(forecast); auto.arima(y)   # elige el orden automáticamente`,o:"φ̂ = 0,75 y pronósticos de 5,89, 5,81 y 5,75 % para 2004-2006: la serie vuelve poco a poco a su media (5,56)."},
{t:"Cointegración (Engle-Granger)",x:"Dos series con raíz unitaria están cointegradas si una combinación lineal de ellas es estacionaria: se prueba si los residuos de la regresión en niveles tienen raíz unitaria.",r:String.raw`data("intdef", package = "wooldridge")
r <- lm(i3 ~ inf, data = intdef)
adf.test(resid(r))      # ojo: los críticos correctos son los de Engle-Granger`,o:"p-valor 0,38: no hay evidencia de cointegración entre la tasa de los bonos y la inflación con esta prueba."}];

// ---------- inserción en las lecciones
(function(){
  const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// ---------- diccionario de las bases del paquete wooldridge que usa el manual
const BASES={
 wage1:{t:"Salarios de trabajadores de EE. UU. (1976)",d:"Encuesta de Población Actual (CPS) de 1976: 526 trabajadores. Cada fila es una persona. Es la base clásica del libro de Wooldridge para estudiar de qué depende el salario (la «ecuación de Mincer»). <b>wage</b> es «salario» en inglés: por eso aparece en todas partes.",
  v:{wage:"Salario promedio por hora, en dólares de 1976",lwage:"Logaritmo natural de wage, log(wage). Con lwage como Y, 100·β es el cambio % del salario",educ:"Años de educación",exper:"Años de experiencia laboral potencial",tenure:"Años con el empleador actual (antigüedad)",nonwhite:"1 si la persona no es blanca, 0 si es blanca",female:"1 si es mujer, 0 si es hombre",married:"1 si está casado(a)",numdep:"Número de dependientes (personas a cargo)",smsa:"1 si vive en un área metropolitana",northcen:"1 si vive en la región centro-norte",south:"1 si vive en el sur",west:"1 si vive en el oeste (la región base, con todas en 0, es el noreste)",construc:"1 si trabaja en construcción",ndurman:"1 si trabaja en manufactura de bienes no durables",trcommpu:"1 si trabaja en transporte, comunicaciones o servicios públicos",trade:"1 si trabaja en comercio",services:"1 si trabaja en servicios",profserv:"1 si trabaja en servicios profesionales",profocc:"1 si tiene ocupación profesional",clerocc:"1 si tiene ocupación administrativa (oficina)",servocc:"1 si tiene ocupación de servicios",expersq:"exper al cuadrado: permite que el efecto de la experiencia se agote",tenursq:"tenure al cuadrado"}},
 ceosal1:{t:"Salarios de gerentes generales (CEO) de EE. UU. (1990)",d:"209 gerentes generales de empresas grandes. Cada fila es un gerente y su empresa.",
  v:{salary:"Salario anual del gerente, en miles de dólares",pcsalary:"Cambio porcentual del salario entre 1989 y 1990",sales:"Ventas de la empresa en 1990, en millones de dólares",roe:"Rentabilidad sobre el patrimonio (ROE) promedio 1988-1990, en %",pcroe:"Cambio porcentual del ROE",ros:"Rentabilidad de la acción de la empresa 1988-1990, en %",indus:"1 si es una empresa industrial",finance:"1 si es una empresa financiera",consprod:"1 si es una empresa de productos de consumo",utility:"1 si es una empresa de servicios públicos",lsalary:"log(salary)",lsales:"log(sales)"}},
 hprice1:{t:"Precios de vivienda en Boston (1990)",d:"88 casas vendidas. Cada fila es una casa.",
  v:{price:"Precio de venta, en miles de dólares",assess:"Avalúo de la casa, en miles de dólares",bdrms:"Número de habitaciones",lotsize:"Tamaño del lote, en pies cuadrados",sqrft:"Área construida, en pies cuadrados",colonial:"1 si la casa es de estilo colonial",lprice:"log(price)",lassess:"log(assess)",llotsize:"log(lotsize)",lsqrft:"log(sqrft)"}},
 intdef:{t:"Tasas de interés, inflación y déficit de EE. UU. (1948-2003)",d:"Serie de tiempo anual: cada fila es un año.",
  v:{year:"Año",i3:"Tasa de interés de las letras del Tesoro a 3 meses, en %",inf:"Inflación anual (IPC), en %",rec:"Ingresos del gobierno federal, en % del PIB",out:"Gastos del gobierno federal, en % del PIB",def:"Déficit fiscal: out − rec, en % del PIB",i3_1:"i3 del año anterior (rezago)",inf_1:"inf del año anterior",def_1:"def del año anterior",ci3:"Cambio de i3 frente al año anterior",cinf:"Cambio de inf",cdef:"Cambio de def",y77:"1 desde 1977 (año en que cambió la definición del año fiscal)"}},
 mroz:{t:"Mujeres casadas y mercado laboral de EE. UU. (1975)",d:"753 mujeres casadas (estudio de Mroz, 1987). Cada fila es una mujer; solo las que trabajan (inlf = 1) tienen salario.",
  v:{inlf:"1 si trabajó en 1975 (participa en la fuerza laboral)",hours:"Horas trabajadas en 1975",kidslt6:"Número de hijos menores de 6 años",kidsge6:"Número de hijos de 6 a 18 años",age:"Edad",educ:"Años de educación",wage:"Salario por hora (dólares de 1975)",repwage:"Salario por hora reportado en la entrevista de 1976",hushrs:"Horas trabajadas por el esposo",husage:"Edad del esposo",huseduc:"Años de educación del esposo",huswage:"Salario por hora del esposo",faminc:"Ingreso familiar en 1975, en dólares",mtr:"Tasa marginal de impuesto federal",motheduc:"Años de educación de la madre",fatheduc:"Años de educación del padre",unem:"Tasa de desempleo del condado, en %",city:"1 si vive en una ciudad grande",exper:"Años de experiencia laboral",nwifeinc:"Ingreso familiar que no viene de ella, en miles de dólares",lwage:"log(wage)",expersq:"exper al cuadrado"}},
 phillips:{t:"Desempleo e inflación de EE. UU. (1948-2003)",d:"Serie de tiempo anual para estimar curvas de Phillips: cada fila es un año.",
  v:{year:"Año",unem:"Tasa de desempleo civil, en %",inf:"Inflación anual (IPC), en %",inf_1:"inf del año anterior",unem_1:"unem del año anterior",cinf:"Cambio de la inflación: inf − inf_1",cunem:"Cambio del desempleo: unem − unem_1"}},
 wagepan:{t:"Panel de salarios de hombres jóvenes de EE. UU. (1980-1987)",d:"545 hombres observados durante 8 años (4.360 filas): cada fila es una persona en un año. Es datos de panel.",
  v:{nr:"Identificador de la persona",year:"Año (1980 a 1987)",lwage:"log del salario por hora",union:"1 si pertenece a un sindicato",married:"1 si está casado",educ:"Años de educación",exper:"Años de experiencia",expersq:"exper al cuadrado",black:"1 si es negro",hisp:"1 si es hispano",hours:"Horas trabajadas en el año",poorhlth:"1 si tiene mala salud",rur:"1 si vive en zona rural",south:"1 si vive en el sur",nrthcen:"1 si vive en el centro-norte",nrtheast:"1 si vive en el noreste",d81:"1 si el año es 1981 (lo mismo d82 a d87; 1980 es la base)"}}};
const basesBox=steps=>{const code=steps.map(s=>s.r).join("\n"),ds=[...new Set([...code.matchAll(/data\("(\w+)"/g)].map(m=>m[1]))].filter(d=>BASES[d]);if(!ds.length)return"";
  return ds.map(d=>{const B=BASES[d],used=Object.keys(B.v).filter(v=>new RegExp("\\b"+v+"\\b").test(code)),rest=Object.keys(B.v).filter(v=>!used.includes(v));
    const row=v=>`<tr><td><code>${v}</code></td><td>${B.v[v]}</td></tr>`;
    return `<div class="basebox"><p class="lbl" style="margin:0 0 4px">Base de datos de esta lección</p><p style="margin:0"><code>${d}</code> · <b>${B.t}</b>. ${B.d}</p>
    ${used.length?`<div class="tbl"><table><tr><th>Variable</th><th>Qué es</th></tr>${used.map(row).join("")}</table></div>`:""}
    ${rest.length?`<details class="dp-lite"><summary>Las demás variables de ${d}</summary><div class="tbl"><table>${rest.map(row).join("")}</table></div></details>`:""}
    <p class="hint" style="margin:6px 0 0">Los nombres están en inglés porque así vienen en el libro de Wooldridge. En R puedes verlos con <code>names(${d})</code> y la documentación completa con <code>?${d}</code>.</p></div>`}).join("")};
  const block=(id,steps)=>{const all=steps.filter(s=>!s.no).map(s=>"# "+s.t+"\n"+s.r).join("\n\n");
    return `<section class="rman"><h3>Manual en R: fórmula | código</h3><p class="hint">Cada paso tiene a la izquierda la idea y la fórmula, y a la derecha el mismo cálculo en R. Copia los bloques en orden en un script de RStudio${id==="r-cero"?"":" (si es tu primera vez, empieza por la estación «R desde cero»)"}.</p>
    ${basesBox(steps)}
    <ol class="rm">${steps.map(s=>`<li><div class="rm-x"><b>${s.t}</b><p>${s.x}</p>${s.f?`<div class="eq">${s.f}</div>`:""}</div><div class="rm-r"><span class="lbl">Código R</span><div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(s.r)}</pre></div>${s.o?`<p class="rm-o"><b>Verás:</b> ${s.o}</p>`:""}</div></li>`).join("")}</ol>
    <div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">Script</span><span>Todo el código de esta lección en un solo bloque</span><span class="chev">›</span></button><div class="dpb"><div><div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(all)}</pre></div></div></div></div></section>`};
  TRUNK.unshift({id:"r-cero",t:"R desde cero: instalar, objetos y datos",nuevo:true,html:`<section><h3>La idea</h3><p class="lead">Esta estación es el paso 0 del manual. Aquí instalas R, aprendes a crear objetos y variables, a cargar una base de datos y a mirarla. Después, en cada lección, cada explicación viene con su fórmula y su equivalente en código R.</p>
  <ul><li>Trabaja siempre en un <b>script</b> (.R), no directo en la consola: así guardas lo que hiciste.</li><li>Ejecuta línea por línea con Ctrl + Enter y lee lo que sale antes de seguir.</li><li>Los ejemplos usan las bases del libro de Wooldridge (paquete <code>wooldridge</code>), así los resultados que ves aquí te deben salir iguales.</li></ul></section>`,
    qs:[{q:"¿Cuál es la diferencia entre install.packages() y library()?",a:"install.packages() descarga e instala el paquete en tu computador, una sola vez. library() lo carga en la sesión actual, cada vez que abres R."},
      {q:"¿Por qué falla 3,5 + 1 en R?",a:"Porque en R el separador decimal es el punto. La coma separa argumentos de una función. Se escribe 3.5 + 1."}]});
  BRANCHES.unshift({g:"Bases de datos del manual",from:"r-cero",items:[{id:"bases-wooldridge",t:"¿Qué es wage1? Las bases del manual y sus variables",nuevo:true,html:`<section><h3>De dónde salen los datos</h3><p class="lead">Los ejemplos del manual usan las bases del libro <i>Introducción a la econometría</i> de Jeffrey Wooldridge, que vienen en el paquete <code>wooldridge</code> de R. Así no hay que descargar nada y tus resultados salen iguales a los de la página.</p>
  <p>Se cargan con <code>data("wage1", package = "wooldridge")</code>. Después, <code>wage1</code> es una tabla (data frame) y cada columna se llama con <code>$</code>: <code>wage1$wage</code> es la columna wage de la tabla wage1.</p>
  <p class="warn"><b>wage = salario.</b> La base que más se usa es <code>wage1</code> («salarios 1»): 526 trabajadores de EE. UU. en 1976. Su variable <code>wage</code> es el salario por hora y <code>lwage</code> su logaritmo. Con ella se responde, por ejemplo, cuánto sube el salario por cada año más de educación.</p></section>
  ${Object.entries(BASES).map(([d,B])=>`<section><h3><code>${d}</code> · ${B.t}</h3><p>${B.d}</p><div class="tbl"><table><tr><th>Variable</th><th>Qué es</th></tr>${Object.entries(B.v).map(([v,t])=>`<tr><td><code>${v}</code></td><td>${t}</td></tr>`).join("")}</table></div></section>`).join("")}
  <section><h3>Cómo leer un modelo con lwage</h3><p>En <code>lm(lwage ~ educ, data = wage1)</code> la Y es el logaritmo del salario. Si el coeficiente de educ es 0,083, un año más de educación se asocia con un salario por hora <b>8,3 % mayor</b> (100·β). Si la Y fuera wage, el mismo coeficiente se leería en dólares por hora.</p></section>`}]});
  const all=[...TRUNK,...BRANCHES.flatMap(g=>g.items)];
  for(const s of all)if(RM[s.id])s.html+=block(s.id,RM[s.id]);
})();


// =====================================================================
// EJERCICIOS DE CAMBIO ESTRUCTURAL Y VARIABLES DICÓTOMAS (Econometría I, prof. Sergio Iván Restrepo)
// Taller «Ejercicios propuestos 3», Dinardo cap. 4 y la guía del Trabajo 1, punto 5.
// =====================================================================
const CEBOX=`<section><h3>Resolvedor</h3><div class="sim" id="sim"></div></section>`;
BRANCHES.push({g:"Ejercicios de cambio estructural", from:"chow", items:[
{id:"ce-metodo", t:"Cómo resolver cualquier ejercicio de cambio estructural", sim:"cambio", html:String.raw`
<section><h3>Primero: ¿qué te dan?</h3>
<p class="lead">Todos los ejercicios del taller se resuelven con la misma prueba F; lo que cambia es cómo se obtienen las SCR. Identifica qué datos trae el enunciado y escoge el modo del resolvedor.</p>
<div class="tbl"><table><tr><th>El ejercicio da…</th><th>Ejemplos</th><th>Qué haces</th><th>Modo</th></tr>
<tr><td>La tabla de datos</td><td>Ej. 3, 5, 7c, 8 · Dinardo 4.7 · Trabajo 1</td><td>Estimas el restringido, las submuestras y el modelo con dummies</td><td>Datos (tabla)</td></tr>
<tr><td>X′X, X′y y y′y</td><td>Dinardo 4.1 y 4.9</td><td>b = (X′X)⁻¹X′y y SCR = y′y − b′X′y en cada muestra; el restringido suma las matrices</td><td>X′X, X′y, y′y</td></tr>
<tr><td>Las SCR, o s, o R² con TSS</td><td>Ej. 6 · Dinardo 4.2, 4.8, 4.10</td><td>SCR = s²(n − k) o (1 − R²)·TSS, y la F con m submuestras</td><td>Solo SCR o R²</td></tr>
<tr><td>Un modelo con dummies ya estimado</td><td>Ej. 2, 15</td><td>Escribes una ecuación por grupo e interpretas δ; pruebas t</td><td>Modelo ya estimado</td></tr>
<tr><td>Un modelo restringido y uno no restringido</td><td>Ej. 12 (Nerlove)</td><td>W, LR y LM con las dos SCR</td><td>Wald, LR y LM</td></tr></table></div></section>
<section><h3>Las fórmulas que usa el curso</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Distribución</th></tr>
<tr><td>Chow (dos submuestras)</td><td>\(F=\dfrac{(SCR_R-SCR_1-SCR_2)/k}{(SCR_1+SCR_2)/(n-2k)}\)</td><td>\(F(k,\,n-2k)\)</td></tr>
<tr><td>Chow con m submuestras</td><td>\(F=\dfrac{(SCR_R-\sum SCR_j)/[(m-1)k]}{\sum SCR_j/(n-mk)}\)</td><td>\(F((m-1)k,\,n-mk)\)</td></tr>
<tr><td>Pronósticos de Chow</td><td>\(F=\dfrac{(SCR_R-SCR_1)/n_2}{SCR_1/(n_1-k)}\)</td><td>\(F(n_2,\,n_1-k)\)</td></tr>
<tr><td>Con R² (misma Y)</td><td>\(F=\dfrac{(R^2_{NR}-R^2_R)/q}{(1-R^2_{NR})/(n-k_{NR})}\)</td><td>\(F(q,\,n-k_{NR})\)</td></tr>
<tr><td>Forma matricial</td><td>\(F=\dfrac{(R\mathbf b-\mathbf r)'[R(X'X)^{-1}R']^{-1}(R\mathbf b-\mathbf r)}{q\,s^2}\)</td><td>\(F(q,\,n-k_{NR})\)</td></tr></table></div>
<p class="warn"><b>k cuenta el intercepto.</b> En un modelo simple k = 2, así que con dos submuestras los grados de libertad son (2, n − 4).</p></section>
<section><h3>La redacción que piden</h3>
<ol class="steps"><li><b>Modelo no restringido</b> (con dummies o una ecuación por submuestra) y <b>restringido</b> (una sola ecuación).</li><li><b>Hipótesis:</b> H₀: δ₁ = δ₂ = 0 (no hay cambio estructural) frente a H₁: algún δ ≠ 0.</li><li><b>Estadístico</b> con los números sustituidos y su distribución.</li><li><b>Valor crítico</b> o p-valor al nivel pedido.</li><li><b>Decisión y lectura económica:</b> qué significa que la función cambie (o no) entre los periodos o grupos.</li></ol></section>
${CEBOX}`},
{id:"ce-pronosticos", t:"Prueba de pronósticos de Chow (ejercicio 1 y Dinardo 4.1)", sim:"cambio", html:String.raw`
<section><h3>Cuándo se usa</h3>
<p class="lead">Cuando la segunda submuestra es muy pequeña para estimarla por separado (n₂ ≤ k), o cuando la pregunta es si el modelo estimado con los datos anteriores <b>predice bien</b> los posteriores.</p></section>
<section><h3>Ejercicio 1: la demostración</h3>
<p>Con \(\mathbf b_1=(X_1'X_1)^{-1}X_1'\mathbf y_1\) y \(\mathbf y_2=X_2\boldsymbol\beta+\boldsymbol\mu_2\), el error de pronóstico es</p>
<div class="mj">\[\mathbf d=\mathbf y_2-X_2\mathbf b_1=X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta),\qquad \mathbf b_1-\boldsymbol\beta=(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\]</div>
<p><b>a)</b> \(E(\mathbf d)=E(\boldsymbol\mu_2)-X_2(X_1'X_1)^{-1}X_1'E(\boldsymbol\mu_1)=\mathbf 0\), porque los errores tienen media cero.</p>
<p><b>b)</b> Como \(E(\mathbf d)=\mathbf 0\), \(\operatorname{var}(\mathbf d)=E(\mathbf d\mathbf d')\):</p>
<div class="mj">\[E(\mathbf d\mathbf d')=E(\boldsymbol\mu_2\boldsymbol\mu_2')-E(\boldsymbol\mu_2\boldsymbol\mu_1')X_1(X_1'X_1)^{-1}X_2'-X_2(X_1'X_1)^{-1}X_1'E(\boldsymbol\mu_1\boldsymbol\mu_2')+X_2(X_1'X_1)^{-1}X_1'E(\boldsymbol\mu_1\boldsymbol\mu_1')X_1(X_1'X_1)^{-1}X_2'\]</div>
<p>Los términos cruzados son cero porque \(E(\boldsymbol\mu_1\boldsymbol\mu_2')=0\) (errores no correlacionados entre muestras). Con \(E(\boldsymbol\mu_j\boldsymbol\mu_j')=\sigma^2 I\):</p>
<div class="mj">\[\operatorname{var}(\mathbf d)=\sigma^2I_{n_2}+\sigma^2X_2(X_1'X_1)^{-1}X_1'X_1(X_1'X_1)^{-1}X_2'=\sigma^2\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]\]</div>
<p>De ahí sale el estadístico: \(F=\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/(n_2s_1^2)\sim F(n_2,n_1-k)\), que es numéricamente igual a \([(SCR_R-SCR_1)/n_2]/[SCR_1/(n_1-k)]\).</p></section>
<section><h3>Dinardo 4.1 resuelto</h3>
<p>Con \(X'X=\begin{bmatrix}20&10\\10&30\end{bmatrix}\), \(X'y=\begin{bmatrix}30\\40\end{bmatrix}\), \(y'y=75\) y n = 20:</p>
<div class="mj">\[(X'X)^{-1}=\frac{1}{500}\begin{bmatrix}30&-10\\-10&20\end{bmatrix},\quad \mathbf b=\begin{bmatrix}1\\1\end{bmatrix},\quad SCR=75-(30+40)=5,\quad s^2=\frac{5}{18}=0{,}2778\]</div>
<p>La observación nueva X = 2 se pronostica en Ŷ = 1 + 1·2 = 3, y Y = 4, así que d = 1. El factor es \(1+[1\;2](X'X)^{-1}[1\;2]'=1+70/500=1{,}14\).</p>
<div class="mj">\[F=\frac{1^2}{0{,}2778\times1{,}14}=3{,}158\;\sim F(1,18),\qquad F_{0{,}05}=4{,}41\]</div>
<p>No se rechaza H₀: la observación nueva es compatible con la relación estimada.</p></section>
<section><h3>Trabajo 1, literal a</h3>
<p>Estima con los trimestres anteriores a la crisis (n₁) y predice los posteriores (n₂). La ecuación (8) del curso es la forma con SCR y la (9) la forma con el vector d y su varianza: el resolvedor calcula las dos y deben dar el mismo número. Pega los datos del Excel en el modo «Datos (tabla)» con «las primeras n₁ observaciones son el grupo 1». Justifica en el informe dónde pones el quiebre (2008:1, o 2008:3 con la quiebra de Lehman Brothers).</p></section>
${CEBOX}`},
{id:"ce-recursivos", t:"Coeficientes recursivos y errores de predicción un paso adelante", sim:"cambio", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En vez de escoger un punto de quiebre, se estima el modelo una y otra vez agregando una observación cada vez: con las primeras k, luego k + 1, y así hasta n. Si los coeficientes cambian, se nota en la trayectoria.</p></section>
<section><h3>Los tres gráficos</h3>
<ol class="steps"><li><b>Coeficientes recursivos:</b> \(\mathbf b_t=(X_t'X_t)^{-1}X_t'\mathbf y_t\) con las primeras t observaciones, con bandas de ±2 errores estándar. Un salto fuera de la banda indica cambio.</li>
<li><b>Errores de predicción un paso adelante:</b> \(e_{t+1}=y_{t+1}-\mathbf x_{t+1}'\mathbf b_t\), con varianza \(\sigma^2[1+\mathbf x_{t+1}'(X_t'X_t)^{-1}\mathbf x_{t+1}]\). Si un error queda fuera de ±2 desviaciones, el modelo no anticipó esa observación.</li>
<li><b>Residuos recursivos y CUSUM:</b> \(w_t=e_t/\sqrt{1+\mathbf x_t'(X_{t-1}'X_{t-1})^{-1}\mathbf x_t}\). La suma acumulada \(W_t=\sum w_j/\hat\sigma\) debe quedar dentro de las bandas \(\pm0{,}948\sqrt{T}\,(1+2t/T)\) al 5 %.</li></ol></section>
<section><h3>En R (Trabajo 1, literal b)</h3>
<pre class="ce-code">library(readxl); library(strucchange)
datos &lt;- read_excel("Datos_E5_T1_Consumo_Ingreso_Q_2005_2010_2026_2.xls")
names(datos)          # revisa cómo se llaman las columnas
m &lt;- lm(Y ~ X, data = datos)
n &lt;- nrow(datos); k &lt;- 2
# coeficientes recursivos
b &lt;- t(sapply((k + 1):n, function(t) coef(lm(Y ~ X, data = datos[1:t, ]))))
se &lt;- t(sapply((k + 1):n, function(t) coef(summary(lm(Y ~ X, data = datos[1:t, ])))[, 2]))
plot((k + 1):n, b[, 2], type = "b", ylim = range(b[, 2] - 2 * se[, 2], b[, 2] + 2 * se[, 2]))
lines((k + 1):n, b[, 2] + 2 * se[, 2], lty = 2); lines((k + 1):n, b[, 2] - 2 * se[, 2], lty = 2)
# errores de predicción un paso adelante
rr &lt;- recresid(m)                       # residuos recursivos
plot(efp(Y ~ X, data = datos, type = "Rec-CUSUM"))
sctest(efp(Y ~ X, data = datos, type = "Rec-CUSUM"))</pre>
<p>El resolvedor hace lo mismo con los datos pegados y dibuja los tres gráficos (paso 7).</p></section>
${CEBOX}`},
{id:"ce-dummies", t:"Cambio estructural con dummies: forma matricial (ejercicios 8 a 11)", sim:"cambio", html:String.raw`
<section><h3>Ejercicio 9: el modelo en forma matricial</h3>
<p>Con \(D_t=0\) en las primeras \(n_1\) observaciones y 1 en las demás:</p>
<div class="mj">\[\mathbf y=X_{NR\_D}\boldsymbol\beta_{NR\_D}+\boldsymbol\mu,\qquad X_{NR\_D}=\begin{bmatrix}\mathbf 1_{n_1}&\mathbf 0&X_{1}&\mathbf 0\\ \mathbf 1_{n_2}&\mathbf 1_{n_2}&X_{2}&X_{2}\end{bmatrix},\qquad \boldsymbol\beta_{NR\_D}=(\beta_1,\delta_1,\beta_2,\delta_2,\dots,\beta_k,\delta_k)'\]</div>
<p>Cada fila tiene \(1, D_t, X_{2t}, D_tX_{2t},\dots\). La prueba de cambio estructural es \(H_0:\delta_1=\dots=\delta_k=0\), es decir \(R\boldsymbol\beta_{NR\_D}=\mathbf r\) con \(\mathbf r=\mathbf 0_{k}\) y R de orden \(k\times2k\) que tiene un 1 en la posición de cada δ:</p>
<div class="mj">\[R=\begin{bmatrix}0&1&0&0&\cdots&0&0\\0&0&0&1&\cdots&0&0\\ \vdots&&&&\ddots&&\vdots\\0&0&0&0&\cdots&0&1\end{bmatrix}\]</div>
<p><b>Ejercicio 10 (solo cambia el intercepto):</b> R = [0 1 0 0 … 0] de orden 1 × 2k y r = 0: una restricción, \(H_0:\delta_1=0\).</p>
<p><b>Ejercicio 11 (solo cambian las pendientes):</b> R tiene k − 1 filas con un 1 en las posiciones de \(\delta_2,\dots,\delta_k\) y r = 0.</p>
<p class="link">Si ordenas los parámetros como \((\beta_1,\dots,\beta_k,\delta_1,\dots,\delta_k)\), entonces \(R=[\,0_{k\times k}\;|\;I_k\,]\). Es la forma que usa el resolvedor en la alternativa d.</p></section>
<section><h3>Por qué SCR_NR = SCR₁ + SCR₂ (ecuaciones 27 y 28)</h3>
<p>El modelo con todas las interacciones permite intercepto y pendientes distintas en cada grupo. Para las observaciones con D = 0 la ecuación es \(\beta_1+\beta_2X\); para D = 1 es \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\). Minimizar la SCR total equivale a minimizar por separado la de cada grupo, porque ningún parámetro se comparte. Por eso los β son los de la regresión del grupo 1, los β + δ los del grupo 2 y la SCR es la suma.</p></section>
<section><h3>Ejercicio 8 resuelto (guerra y paz)</h3>
<p>Restringido: \(Y_t=\beta_1+\beta_2X_t+\mu_t\) con las 15 observaciones. No restringido: \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\), D = 1 en la paz.</p>
<div class="tbl"><table><tr><th>Modelo</th><th>Estimación</th><th>SCR</th></tr>
<tr><td>Guerra (n₁ = 5)</td><td>Ŷ = −0,0625 + 0,4375X</td><td class="num">0,6875</td></tr>
<tr><td>Paz (n₂ = 10)</td><td>Ŷ = 0,4000 + 0,5091X</td><td class="num">2,4727</td></tr>
<tr><td>Con dummies</td><td>Ŷ = −0,0625 + 0,4625D + 0,4375X + 0,0716DX</td><td class="num">3,1602 = 0,6875 + 2,4727</td></tr>
<tr><td>Restringido</td><td>una sola recta</td><td class="num">6,5561</td></tr></table></div>
<div class="mj">\[F=\frac{(6{,}5561-3{,}1602)/2}{3{,}1602/11}=5{,}910\;\sim F(2,11),\qquad F_{0{,}05}=3{,}98,\quad p=0{,}018\]</div>
<p>Se rechaza H₀: la función de consumo es distinta en la guerra y en la paz. En la paz la propensión marginal a consumir es mayor (0,509 frente a 0,438).</p></section>
${CEBOX}`},
{id:"ce-interpretar", t:"Interpretar dummies (ejercicios 2, 4, 7, 13 a 16 y Dinardo 4.3 y 4.4)", sim:"cambio", html:String.raw`
<section><h3>La regla general</h3>
<p class="lead">Con \(Y=\beta_1+\delta_1D+\beta_2X+\delta_2DX+\mu\): β₁ y β₂ son el intercepto y la pendiente del grupo base (D = 0); δ₁ es cuánto cambia el intercepto y δ₂ cuánto cambia la pendiente para el grupo D = 1.</p></section>
<section><h3>Ejercicio 2 (cerveza por género)</h3>
<p><b>a)</b> Hombres: Ŷ = 186,47 + 0,23X. Mujeres: Ŷ = (186,47 − 126) + (0,23 − 0,13)X = 60,47 + 0,10X. El consumo autónomo de las mujeres es 126 menor y su propensión marginal a consumir cerveza 0,13 menor.</p>
<p><b>b)</b> Con la misma renta, la diferencia es \(\delta_1+\delta_2X=-126-0{,}13X\): las mujeres consumen menos, y la brecha crece con la renta.</p>
<p><b>c)</b> Con gl = 34 − 4 = 30 y \(t_{0{,}025}=2{,}042\): para δ₂, t = −0,13/0,10 = −1,30 → no se rechaza que la propensión marginal sea igual. Para δ₁, t = −126/57,01 = −2,21 → se rechaza que el consumo autónomo sea igual.</p></section>
<section><h3>Ejercicio 4 (salarios por titulación)</h3>
<p><b>a)</b> MCO con una dummy y n₁ = 300 licenciados: \(\hat\beta_1=\bar W_A\) (media de los D = 0) y \(\hat\beta_1+\hat\beta_2=\bar W_L\), porque las ecuaciones normales igualan los residuos a cero dentro de cada grupo. <b>b)</b> \(\hat\beta_1=150\), \(\hat\beta_2=100\).</p>
<p><b>c)</b> Con \(SCR=299\cdot50^2+199\cdot30^2=926.600\) y \(s^2=926.600/498=1.860{,}6\): \(se(\hat\beta_1)=\sqrt{s^2/200}=3{,}05\) y \(se(\hat\beta_2)=\sqrt{s^2(1/300+1/200)}=3{,}94\). <b>d)</b> \(SCE=\frac{300\cdot200}{500}(250-150)^2=1.200.000\), \(TSS=2.126.600\), \(R^2=0{,}564\). <b>e)</b> t = 100/3,94 = 25,4: hay diferencia salarial.</p>
<p class="hint">Se usó la desviación típica con n − 1; si tu profesor la define con n, cambia ligeramente la SCR.</p></section>
<section><h3>Ejercicio 7 (horas de lectura)</h3>
<p><b>a)</b> Sin intercepto y con las tres dummies, X′X es diagonal con \(n_1,n_2,n_3\) y X′y tiene las sumas de cada clase: \(\hat\delta_j=\sum_{j}Y/n_j=\bar Y_j\). <b>b)</b> Con intercepto y clase 1 como base: \(\hat\beta_1=\bar Y_1\), \(\hat\beta_2=\bar Y_2-\bar Y_1\), \(\hat\beta_3=\bar Y_3-\bar Y_1\).</p>
<p><b>c)</b> Con los 10 datos: \(\hat Y=6{,}324+3{,}592E_2+12{,}113E_3+3{,}127S_1\).</p>
<div class="tbl"><table><tr><th></th><th>Superiores</th><th>Media</th><th>Media incompleta</th></tr><tr><td>Hombre</td><td class="num">6,32</td><td class="num">9,92</td><td class="num">18,44</td></tr><tr><td>Mujer</td><td class="num">9,45</td><td class="num">13,04</td><td class="num">21,56</td></tr></table></div></section>
<section><h3>Ejercicios 13 a 15</h3>
<p><b>13.</b> \(D_t=1\) si t ≥ 2020 y 0 antes. \(Y_t=\beta_1+\delta D_t+\beta_2X_t+\mu_t\): δ es el cambio del salario medio, para la misma experiencia, después de la reforma.</p>
<p><b>14.</b> \(D_t=1\) si t ≥ t*. \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\): δ₁ cambia el intercepto y δ₂ la pendiente después del evento.</p>
<p><b>15.</b> Antes: Ŷ = 2 + 0,5X. Después: Ŷ = 4,5 + 0,25X. El consumo autónomo sube 2,5 y la propensión marginal a consumir cae a la mitad (de 0,5 a 0,25). Para rentas mayores que 10 (donde las rectas se cortan, 2,5 = 0,25X) el consumo es menor después de la reforma.</p></section>
<section><h3>Ejercicio 16 y Dinardo 4.3 (dummies estacionales)</h3>
<p><b>Modelo (1)</b> sin intercepto: \(\delta_j\) es la demanda media del trimestre j. No lleva intercepto porque \(S_1+S_2+S_3+S_4=1\) (trampa de las dummies). <b>Modelo (2):</b> \(\beta_1=\delta_1\) y \(\theta_j=\delta_j-\delta_1\). <b>Modelo (3):</b> intercepto común y una pendiente de X por trimestre; no se puede incluir X porque \(S_1X+S_2X+S_3X+S_4X=X\).</p>
<p><b>Dinardo 4.3:</b> con P y Y del año siguiente, Q̂ = 87,40; 92,84; 94,28 y 89,46 en los trimestres 1 a 4. Si otra investigadora usa \(S_2,S_3,S_4\): Q̂ = 68,5 − 0,01P + 0,2Y + 5,1S₂ + 6,2S₃ + 1,5S₄. Sin intercepto y con las cuatro: interceptos 68,5; 73,6; 74,7 y 70 para cada trimestre. Las predicciones son las mismas en las tres versiones.</p>
<p><b>Dinardo 4.4:</b> es el ejercicio 7b con tres clases: el intercepto es la media de la clase base y cada γ la diferencia de medias.</p></section>
${CEBOX}`},
{id:"ce-resueltos", t:"Ejercicios con números resueltos (3, 5, 6, 12 y Dinardo)", sim:"cambio", html:String.raw`
<section><h3>Ejercicio 3 (educación urbana y rural)</h3>
<p><b>a)</b> β₁ y β₃ son los años de educación de un joven urbano y uno rural con renta 0; β₂ y β₄ cuánto aumentan los años de educación por unidad de renta en cada zona (signo esperado positivo).</p>
<p><b>b)</b> Urbana: Ŷ = 9,706 + 0,647X. Rural: Ŷ = 7,980 + 0,580X. SCR = 4,222 y R² = 0,935 (como D₁ + D₂ = 1, el modelo tiene intercepto implícito y el R² centrado es el que se interpreta): el 93,5 % de la variación de los años de educación se explica por la renta y la zona.</p>
<p><b>c)</b> H₀: β₁ = β₃ y β₂ = β₄. SCR_R = 10,385, F = [(10,385 − 4,222)/2]/[4,222/4] = 2,919 ~ F(2, 4), crítico 6,94: no se rechaza. Con 8 datos la prueba tiene poco poder.</p>
<p><b>d)</b> Urbano con renta 10,5: Ŷ = 16,5 años; IC del 95 % para la media [15,07; 17,93] y para un joven individual [13,31; 19,69].</p></section>
<section><h3>Ejercicio 5 (salarios por género)</h3>
<p><b>a)</b> Hombres: Ŵ = 1,809 + 0,0665X. Mujeres: Ŵ = 1,731 + 0,0778X. β₁ y β′₁ son los salarios de entrada; β₂ y β′₂ lo que aumenta el salario por año de experiencia.</p>
<p><b>b)</b> H₀: β₁ = β′₁ y β₂ = β′₂. SCR_R = 1,2087, SCR_NR = 1,1324, F = [(1,2087 − 1,1324)/2]/[1,1324/13] = 0,438 ~ F(2, 13), crítico 3,81, p = 0,65: el género no es un factor significativo.</p></section>
<section><h3>Ejercicio 6 (tres periodos)</h3>
<p><b>a)</b> Hay cambio estructural cuando los parámetros de la relación no son los mismos en todo el periodo: un evento (crisis, cambio de política) modifica la propensión a consumir o el consumo autónomo.</p>
<p><b>b)</b> n = 8 + 12 + 7 = 27, k = 2, m = 3. SCR_R = (1 − 0,9974)·6.403.270 = 16.648,50 y SCR_NR = 2.379,315 + 3.679,020 + 1.295,861 = 7.354,196.</p>
<div class="mj">\[F=\frac{(16.648{,}50-7.354{,}20)/4}{7.354{,}20/21}=6{,}635\;\sim F(4,21),\quad F_{0{,}05}=2{,}84\]</div>
<p>Se rechaza la consistencia de los parámetros: la función de consumo cambió entre los tres periodos (la propensión marginal pasa de 0,37 a 0,88 y a 1,61).</p></section>
<section><h3>Ejercicio 12 (Nerlove)</h3>
<p><b>a)</b> Modelo 1: elasticidad del costo al producto 0,94 (economías de escala leves) y elasticidades precio 0,31, −0,26 (signo no esperado) y 0,44; suman 0,49. Modelo 2: con la restricción, 0,91 respecto al producto y 0,51, 0,09 y 1 − 0,51 − 0,09 = 0,40 para el combustible.</p>
<p><b>b)</b> Con n = 29, SCR_R = 0,364, SCR_NR = 0,336 y q = 1: W = 2,417, LR = 2,321, LM = 2,231, todos menores que χ²(1) = 3,84; F = 2,00 &lt; F(1, 24) = 4,26. No se rechaza que las elasticidades precio sumen 1 (homogeneidad de grado uno en precios).</p></section>
<section><h3>Dinardo</h3>
<p><b>4.2:</b> n = 76, k = 4. Estacionalidad: la SCE sube de 109,6 a 114,8 con la misma TSS = 128,08, así que la SCR baja de 18,48 a 13,28: F = (5,2/3)/(13,28/69) = 9,01 &gt; F(3, 69) = 2,74 → hay estacionalidad. Estabilidad: F = [(18,48 − 16,78)/4]/(16,78/68) = 1,72 &lt; F(4, 68) = 2,51 → relación estable.</p>
<p><b>4.5 y 4.6</b> usan los datos de la tabla 4.4 del libro: pégalos en el modo «Datos (tabla)».</p>
<p><b>4.7:</b> F de Chow = 0,077 ~ F(2, 8), p = 0,93: las familias con aumento de ingreso no se comportan distinto. Solo intercepto: F = 0,009.</p>
<p><b>4.8:</b> SCR = s²(n − k): 0,050760 (completo), 0,035551 (1929-1948) y 0,007639 (1949-1967). F = [(0,050760 − 0,043190)/3]/(0,043190/33) = 1,93 &lt; F(3, 33) = 2,89 → función estable.</p>
<p><b>4.9:</b> urbano b = (−1,5; 2), SCR₁ = 5; rural b = (−0,4; 1,2), SCR₂ = 3,2; sumando matrices, SCR_R = 10,933. F = [(10,933 − 8,2)/2]/(8,2/16) = 2,67 &lt; F(2, 16) = 3,63 → la misma relación.</p>
<p><b>4.10:</b> SCR = s²(n − 2): 26, 42, 15 y 96,52. F = [(96,52 − 83)/4]/(83/250) = 10,18 &gt; F(4, 250) = 2,41 → la función no es la misma. Para la elasticidad común hace falta la varianza de log ingreso en cada grupo; con la de la muestra completa (24), se(b) = √(0,38/(256·24)) = 0,0079 y t = (0,07 − 0,10)/0,0079 = −3,81 → se rechaza que la elasticidad sea 0,10.</p></section>
${CEBOX}`}]});
WORKSHOPS.push({id:"t-cambio",t:"Resolvedor de cambio estructural y dummies",anchor:"chow",links:["dicotomicas","chow","ce-metodo","ce-pronosticos"],sim:"cambio",html:`<div class="sim" id="sim"></div>`,
 d:"Pega los datos del ejercicio, las matrices X′X, X′y y y′y, o solo las SCR, y obtén todas las versiones de la prueba de Chow con los números sustituidos: con SCR, con R², con dummies y en forma matricial, más la prueba de pronósticos, los coeficientes recursivos, el CUSUM, el pronóstico con intervalos y el código R."});
WORKSHOPS.push({id:"t-datos",t:"Laboratorio de datos: sube tu base",anchor:"mco-matricial",links:["datos","mco-matricial","inferencia","chow","hetero","autocorr"],sim:"datos",html:`<div class="sim" id="sim"></div>`,
 d:"Sube un archivo CSV o Excel (o pega la tabla) y trabaja con tus propios datos: estadísticas descriptivas y correlaciones, variables nuevas (logaritmos, rezagos, dummies, interacciones), regresión por MCO con errores robustos, pruebas F, Chow, heterocedasticidad, autocorrelación, normalidad, RESET y VIF, las propiedades de MCO demostradas con tus números y el código R que lo reproduce todo. Los datos no salen de tu navegador."});
