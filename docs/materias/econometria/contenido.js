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
<div class="eq">TSS = ESS + RSS &nbsp;&nbsp;&nbsp; R² = <span class="frac"><span>ESS</span><span>TSS</span></span> = 1 − <span class="frac"><span>RSS</span><span>TSS</span></span><span class="note">TSS: suma de cuadrados total · ESS: explicada · RSS: de los errores (la notación del curso; en otros textos SCT, SCE y SCR)</span></div>
<p>Guarda bien la <b>RSS</b>: es la pieza central de la prueba F y de la prueba de Chow.</p></section>
<p class="warn"><b>Error común:</b> leer un R² alto como prueba de causalidad. El R² solo dice qué tanto de la variación de y acompaña a la de x dentro de la muestra.</p>`,
deep:[
{k:"Demostración", t:"De dónde salen las fórmulas", html:`<p>Minimizamos <span class="m">S = Σ(yᵢ − β₀ − β₁xᵢ)²</span>. Derivando e igualando a cero:</p><div class="eq">∂S/∂β₀ = −2Σûᵢ = 0 &nbsp;&nbsp;&nbsp; ∂S/∂β₁ = −2Σxᵢûᵢ = 0</div><p>La primera condición da <span class="m">ȳ = β̂₀ + β̂₁x̄</span>. Sustituyendo en la segunda y despejando se obtiene β̂₁. Estas dos condiciones implican propiedades que siempre se cumplen con intercepto: los residuos suman cero, no están correlacionados con x, y la recta pasa por el punto (x̄, ȳ).</p>`},
{k:"Conceptos", t:"El R² ajustado", html:`<div class="eq">R̄² = 1 − <span class="frac"><span>RSS / (n − k)</span><span>TSS / (n − 1)</span></span></div><p>El R² nunca baja al agregar una variable, aunque sea irrelevante. El R² ajustado penaliza cada parámetro adicional y puede bajar. Sirve para comparar modelos con la misma variable dependiente y distinto número de regresoras, no para decidir si una variable es significativa (para eso está la prueba t).</p>`}],
code:{r:String.raw`m <- lm(ventas ~ publicidad, data = df)
summary(m)          # coeficientes, R², prueba F
sum(resid(m)^2)     # RSS`, stata:String.raw`reg ventas publicidad
display e(rss)      // RSS
display e(r2)       // R²`, py:String.raw`m = smf.ols("ventas ~ publicidad", data=df).fit()
m.params, m.ssr, m.rsquared`},
q:"Con los datos de la estación anterior (x̄ = 4, ȳ = 17,25), Σ(x−x̄)(y−ȳ) = 25 y Σ(x−x̄)² = 10. Calcula β̂₁ y β̂₀.",
a:"β̂₁ = 25/10 = 2,5. β̂₀ = 17,25 − 2,5·4 = 7,25. Cada unidad adicional de publicidad se asocia con 2,5 unidades más de ventas."},

{id:"mco-matricial", t:"Regresión múltiple en forma matricial", html:`
<section><h3>El estimador</h3>
<div class="eq">β̂ = (X′X)⁻¹X′y<span class="note">Sale de minimizar u′u = (y − Xβ)′(y − Xβ) y despejar β</span></div>
<p class="lead">Cada <span class="m">β̂ⱼ</span> se lee <b>ceteris paribus</b>: el efecto de <span class="m">xⱼ</span> sobre <span class="m">y</span> manteniendo constantes las demás regresoras.</p></section>
<section><h3>Varianza y error estándar</h3>
<div class="eq">Var(β̂) = σ²(X′X)⁻¹ &nbsp;&nbsp;&nbsp; σ̂² = <span class="frac"><span>RSS</span><span>n − k</span></span><span class="note">La raíz de cada elemento de la diagonal de σ̂²(X′X)⁻¹ es el error estándar de ese coeficiente</span></div></section>
<section><h3>Grados de libertad</h3>
<p>Se pierde un grado de libertad por cada parámetro estimado. Por eso se divide entre <span class="m">n − k</span> y no entre <span class="m">n</span>. Este mismo conteo aparece en el denominador de la prueba de Chow como <span class="m">n − 2k</span>, porque ahí se estiman dos modelos.</p></section>`,
deep:[
{k:"Demostración", t:"Derivación de β̂ en una línea", html:`<div class="eq">u′u = y′y − 2β′X′y + β′X′Xβ</div><div class="eq">∂(u′u)/∂β = −2X′y + 2X′Xβ = 0 &nbsp;⇒&nbsp; X′Xβ̂ = X′y &nbsp;⇒&nbsp; β̂ = (X′X)⁻¹X′y</div><p>Las ecuaciones <span class="m">X′Xβ̂ = X′y</span> se llaman <b>ecuaciones normales</b>. Equivalen a <span class="m">X′û = 0</span>: los residuos son ortogonales a cada columna de X.</p>`},
{k:"Intuición", t:"Teorema de Frisch-Waugh-Lovell", html:`<p>¿Qué significa exactamente "manteniendo constantes las demás"? El teorema lo responde: el β̂₁ de la regresión múltiple es igual al que obtienes en dos pasos:</p><ol><li>Regresa x₁ sobre las demás regresoras y guarda el residuo r̂₁ (la parte de x₁ que las otras no explican).</li><li>Regresa y sobre r̂₁.</li></ol><p>Así, β̂₁ usa solo la variación de x₁ que no comparte con las demás. Por eso, si x₁ casi no tiene variación propia (multicolinealidad), su estimación es imprecisa.</p>`}],
code:{r:String.raw`m <- lm(y ~ x1 + x2 + x3, data = df)
vcov(m)       # σ̂²(X'X)⁻¹
sigma(m)^2    # σ̂² = RSS/(n−k)`, stata:String.raw`reg y x1 x2 x3
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
<p class="lead">Comparas un modelo <b>restringido</b> (imponiendo la hipótesis nula) con uno <b>no restringido</b>. Si al imponer la restricción la RSS crece mucho, la restricción no es creíble.</p>
<div class="eq">F = <span class="frac"><span>(RSS<sub>R</sub> − RSS<sub>NR</sub>) / q</span><span>RSS<sub>NR</sub> / (n − k)</span></span> ~ F(q, n − k)<span class="note">q: número de restricciones · k: parámetros del modelo no restringido</span></div>
<p>Regla: si <span class="m">F &gt; F<sub>crítico</sub></span> (o p-valor &lt; α), se rechaza H₀.</p></section>
<p class="link"><b>Clave para el parcial:</b> la prueba de Chow <b>es</b> esta prueba F. El modelo restringido es "los mismos coeficientes para todos" y el no restringido es "coeficientes distintos en cada submuestra".</p>`,
deep:[
{k:"Fórmula", t:"La prueba F en términos de R²", html:`<div class="eq">F = <span class="frac"><span>(R²<sub>NR</sub> − R²<sub>R</sub>) / q</span><span>(1 − R²<sub>NR</sub>) / (n − k)</span></span></div><p>Sale de dividir numerador y denominador entre TSS. Solo vale si los dos modelos tienen <b>la misma variable dependiente</b>. Para la significancia global (todas las pendientes iguales a cero), R²<sub>R</sub> = 0 y queda <span class="m">F = [R²/(k−1)] / [(1−R²)/(n−k)]</span>.</p>`},
{k:"Conceptos", t:"p-valor, errores tipo I y II", html:`<p>El <b>p-valor</b> es la probabilidad de observar un estadístico tan extremo como el obtenido si H₀ fuera cierta. No es la probabilidad de que H₀ sea cierta.</p><div class="tbl"><table><tr><th></th><th>H₀ cierta</th><th>H₀ falsa</th></tr><tr><td>Rechazo H₀</td><td>Error tipo I (prob. α)</td><td>Correcto (potencia)</td></tr><tr><td>No rechazo</td><td>Correcto</td><td>Error tipo II</td></tr></table></div><p>"No rechazar" no es lo mismo que "aceptar": puede que simplemente no haya suficiente información para detectar el efecto.</p>`}],
code:{r:String.raw`library(car)
linearHypothesis(m, c("x1 = 0", "x2 = 0"))
anova(m_restringido, m)   # F con las RSS`, stata:String.raw`reg y x1 x2 x3
test x1 x2          // H0: b1 = b2 = 0
test x1 = x2        // H0: b1 = b2`, py:String.raw`m.f_test("x1 = 0, x2 = 0")
m.compare_f_test(m_restringido)   # (F, p, q)`},
q:"En y = β₀ + β₁x₁ + β₂x₂ + u, ¿cuántas restricciones tiene H₀: β₁ = β₂ = 0?",
a:"q = 2. Se estima el modelo restringido solo con intercepto y se compara su RSS con la del modelo completo."},

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
<div class="eq">F = <span class="frac"><span>[RSS<sub>R</sub> − (RSS₁ + RSS₂)] / k</span><span>(RSS₁ + RSS₂) / (n − 2k)</span></span> ~ F(k, n − 2k)<span class="note">RSS<sub>R</sub>: modelo con toda la muestra · RSS₁, RSS₂: cada submuestra por separado · k: parámetros incluido el intercepto</span></div></section>
<section><h3>Paso a paso para el examen</h3>
<ol class="steps">
<li>Estima el modelo con <b>toda</b> la muestra y anota RSS<sub>R</sub> (n observaciones).</li>
<li>Estima el mismo modelo en la submuestra 1 (n₁ obs.) y en la 2 (n₂ obs.). Anota RSS₁ y RSS₂.</li>
<li>Suma: RSS<sub>NR</sub> = RSS₁ + RSS₂.</li>
<li>Calcula F con k restricciones y n − 2k grados de libertad en el denominador.</li>
<li>Busca F crítico en la tabla F(k, n − 2k) al nivel α (o usa el p-valor).</li>
<li>Concluye: si F &gt; F crítico, rechazas H₀ y hay evidencia de cambio estructural.</li></ol></section>
<section><h3>Ejemplo resuelto</h3>
<p>n = 30 (15 + 15), modelo simple (k = 2). RSS<sub>R</sub> = 420, RSS₁ = 120, RSS₂ = 150.</p>
<div class="eq">F = <span class="frac"><span>(420 − 270) / 2</span><span>270 / 26</span></span> = <span class="frac"><span>75</span><span>10,385</span></span> ≈ 7,22<span class="note">F crítico al 5 % con (2, 26) ≈ 3,37 → 7,22 &gt; 3,37: se rechaza H₀</span></div></section>
<section><h3>Laboratorio: mueve el quiebre y mira qué pasa</h3>
<div class="sim" id="sim"></div></section>
<section><h3>Versión con dicotómicas (equivalente)</h3>
<div class="eq">y = β₀ + δ₀D + β₁x + δ₁(D·x) + u &nbsp;&nbsp;&nbsp; H₀: δ₀ = δ₁ = 0</div>
<p>La prueba F conjunta sobre δ₀ y δ₁ da exactamente el mismo F que la de Chow. Su ventaja es que además te dice <b>dónde</b> está el cambio: en el intercepto, en la pendiente o en ambos.</p></section>
<section><h3>Supuestos y variantes</h3>
<ul><li><b>El punto de quiebre se conoce de antemano</b> (una fecha o un grupo definido por teoría). Si se elige mirando los datos, el F sale inflado.</li>
<li><b>Misma varianza del error</b> en ambas submuestras. Se puede revisar con F = σ̂₁² / σ̂₂².</li>
<li><b>Chow predictiva</b>: si una submuestra tiene menos observaciones que parámetros (n₂ &lt; k), no se puede estimar por separado y se usa F = [(RSS<sub>R</sub> − RSS₁)/n₂] / [RSS₁/(n₁ − k)] ~ F(n₂, n₁ − k).</li></ul></section>
<p class="warn"><b>Error común:</b> usar k = número de regresoras. En Chow, k cuenta también el intercepto: con 3 regresoras, k = 4 y los grados de libertad son (4, n − 8).</p>`,
deep:[
{k:"Demostración", t:"Por qué Chow es una prueba F restringida", html:`<p>El modelo no restringido permite coeficientes distintos en cada submuestra; con dicotómicas se escribe con 2k parámetros. Su RSS es exactamente RSS₁ + RSS₂, porque estimar el modelo con todas las interacciones equivale a estimar cada submuestra por separado.</p><p>El restringido impone k igualdades (cada coeficiente igual en ambas submuestras), así que q = k. Sustituyendo en la fórmula general de la F, con 2k parámetros en el no restringido, se obtiene exactamente la fórmula de Chow con n − 2k grados de libertad.</p>`},
{k:"Variante", t:"Comprobar varianzas iguales antes de Chow", html:`<div class="eq">F = <span class="frac"><span>σ̂₁²</span><span>σ̂₂²</span></span> = <span class="frac"><span>RSS₁/(n₁ − k)</span><span>RSS₂/(n₂ − k)</span></span> ~ F(n₁ − k, n₂ − k)<span class="note">Pon la varianza mayor en el numerador y compara con el F crítico</span></div><p>En el ejemplo resuelto: σ̂₁² = 120/13 = 9,23 y σ̂₂² = 150/13 = 11,54. F = 11,54/9,23 = 1,25, menor que F crítico (13, 13) ≈ 2,58. Las varianzas son compatibles y la prueba de Chow es válida.</p>`},
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
q:"Modelo con 3 regresoras e intercepto, n = 60 dividido 35/25. RSS_R = 900, RSS₁ = 320, RSS₂ = 280. ¿Hay cambio estructural al 5 %?",
a:"k = 4, gl = (4, 52). RSS_NR = 600. F = [(900 − 600)/4] / [600/52] = 75 / 11,54 ≈ 6,50. F crítico (4, 52) al 5 % ≈ 2,55. Como 6,50 > 2,55 se rechaza H₀: hay evidencia de cambio estructural."}
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
{k:"Variante", t:"Goldfeld-Quandt", html:`<p>Ordena las observaciones según la variable que sospechas causa la heterocedasticidad, quita un bloque central (por ejemplo, el 20 %) y estima por separado el tercio inferior y el superior. Luego <span class="m">F = RSS₂/RSS₁</span> (con sus grados de libertad). Fíjate que es la misma prueba de varianzas iguales que se usa antes de Chow.</p>`}],
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
{k:"Conceptos", t:"Criterios de información AIC y BIC", html:`<p>Para elegir entre modelos no anidados (que no son versiones restringidas uno del otro), se usan:</p><div class="eq">AIC = ln(RSS/n) + 2k/n &nbsp;&nbsp;&nbsp; BIC = ln(RSS/n) + k·ln(n)/n</div><p>Se prefiere el de menor valor. El BIC penaliza más los parámetros adicionales y tiende a elegir modelos más pequeños.</p>`}],
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
{id:"t-plano",t:"Plano de regresión y superficie de la RSS",anchor:"mco-matricial",links:["mco-simple","mco-matricial","multicol"],sim:"wsPlane",html:WSBOX,
 d:"Con dos regresoras, la recta de regresión se vuelve un plano. Gíralo, cambia la correlación entre x₁ y x₂ y mira cómo la superficie de la RSS pasa de un tazón a un valle alargado cuando hay multicolinealidad."},
{id:"t-calc",t:"Calculadora de pruebas",anchor:"chow",links:["inferencia","chow","hetero","autocorr"],sim:"wsCalc",html:WSBOX,
 d:"Escribe los datos del ejercicio y obtén el procedimiento completo: la sustitución numérica, el valor crítico, el p-valor y la gráfica de la distribución. Sirve para Chow, F general, varianzas iguales, Breusch-Pagan y Durbin-Watson."}
];

// =====================================================================
// MANUAL EN R: cada explicación con su par «fórmula | código R», pensado para quien empieza de cero.
// Se agrega al final de cada lección (después del contenido y antes de «Para profundizar»).
// Datos: las bases del profesor (Econometría I, U. de A.) en las estaciones del curso; el paquete wooldridge en las estaciones avanzadas.
// =====================================================================
// ---------- bases del curso (prof. Sergio Restrepo, Econometría I, U. de A.)
const TV_DF=String.raw`Datos <- data.frame(
  Mes = 1:50,
  Yt  = c(5.12, 5.05, 4.91, 5.03, 4.61, 4.53, 3.27, 4.23, 4.61, 4.49, 4.39, 4.21, 4.04, 3.88, 3.12, 2.89, 2.76, 2.22, 2.78, 2.36, 2.53, 2.63, 2.26, 2.94, 2.41, 2.12, 2.19, 2.47, 2.62, 2.46, 2.29, 2.12, 2.09, 1.91, 2.01, 1.95, 1.87, 2.1, 1.89, 1.98, 1.9, 2.17, 2.18, 2.22, 1.95, 2.18, 2.09, 2.07, NA, NA),
  X2t = c(904, 964, 979, 949, 994, 1055, 1205, 1145, 1055, 1115, 1130, 1145, 1175, 1235, 1251, 1266, 1296, 1326, 1356, 1371, 1386, 1341, 1401, 1311, 1371, 1416, 1401, 1356, 1326, 1296, 1371, 1401, 1431, 1446, 1446, 1454, 1439, 1471, 1460, 1436, 1431, 1449, 1442, 1431, 1421, 1416, 1440, 1446, 1425, 1436),
  X3t = c(129.518, 100, 72.289, 53.614, 48.193, 57.831, 79.518, 108.434, 137.349, 159.036, 168.675, 163.253, 144.578, 116.867, 87.349, 62.651, 49.398, 48.193, 65.663, 51.205, 60.241, 61.446, 59.639, 90.361, 54.217, 48.193, 45.181, 48.193, 43.373, 39.759, 63.253, 65.06, 67.47, 78.916, 87.349, 84.337, 66.265, 88.554, 81.325, 73.494, 69.277, 83.132, 68.072, 70.482, 75.301, 66.265, 70.482, 78.313, 64.458, 75.301))`;
const TVLOAD=String.raw`library(readxl)
setwd("D:/Eco1")     # la carpeta donde guardaste el Excel del profesor
Datos = read_excel("Datos_Ejemplo_1_Demanda_TV_Precio_Pub.xls")
Datos = data.frame(Datos)
head(Datos)
n = 48; k = 3          # los meses 49 y 50 no tienen Yt: se dejan para pronosticar
Yt  = Datos$Yt[1:n]
X2t = Datos$X2t[1:n]
X3t = Datos$X3t[1:n]`;

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
{t:"Paquetes: instalar una vez, cargar cada vez",x:"Los paquetes agregan funciones. Se instalan <b>una sola vez</b> con <code>install.packages()</code> y se cargan <b>en cada sesión</b> con <code>library()</code>. Los primeros son los que usa el profesor en sus notebooks; los demás sirven para las estaciones avanzadas.",r:String.raw`install.packages(c("readxl", "car", "tseries", "nortest", "lmtest", "moments", "strucchange"))
install.packages(c("wooldridge", "sandwich", "AER", "plm", "tidyr", "forecast"))   # estaciones avanzadas
library(readxl)       # leer Excel (read_excel)
library(car)          # qqPlot y linearHypothesis
library(tseries)      # jarque.bera.test
library(strucchange)  # CUSUM y cambio estructural`,no:1,o:"La instalación tarda unos minutos la primera vez. Si R pregunta por un «mirror», elige cualquiera. Como dice el profesor: una vez instalados, pon # delante de install.packages para no reinstalar."},
{t:"Cargar la base del curso y explorarla",x:"Los ejemplos del manual usan las bases del profesor. La primera es la del <b>Ejemplo 1</b>: demanda mensual de televisores (<code>Yt</code>), precio (<code>X2t</code>) e inversión en publicidad (<code>X3t</code>). Guarda el Excel en una carpeta, dile a R que trabaje ahí con <code>setwd()</code> y léelo con <code>read_excel()</code>. Si no tienes el Excel, en la estación «Las bases del curso» está el código para crear la misma tabla. Antes de estimar, <b>siempre</b> mira los datos.",r:String.raw`rm(list = ls())        # limpia la memoria
library(readxl)
setwd("D:/Eco1")       # cambia la ruta por la de tu carpeta
Datos = read_excel("Datos_Ejemplo_1_Demanda_TV_Precio_Pub.xls")
Datos = data.frame(Datos)
attach(Datos)          # permite llamar las columnas por su nombre: Yt, X2t, X3t
head(Datos)            # primeras filas
str(Datos)             # tipo de cada variable
summary(Datos)         # mínimo, cuartiles, media, máximo
sum(is.na(Yt))         # cuántos datos faltan`,o:"50 meses; la demanda va de 1,87 a 5,12 con media 2,92, y faltan 2 datos de Yt (los meses 49 y 50, que se dejan para pronosticar)."},
{t:"Leer tus propios datos (Excel o CSV)",x:"Para tus talleres: guarda el archivo en una carpeta, dile a R que trabaje ahí y léelo. En Colombia los CSV suelen usar punto y coma y coma decimal: por eso <code>read.csv2</code>.",r:String.raw`setwd("C:/Users/tu_usuario/Documents/econometria")  # carpeta de trabajo
getwd()                                  # comprueba dónde estás
datos <- read.csv("datos.csv")           # separador coma, punto decimal
datos <- read.csv2("datos.csv")          # separador ; y coma decimal
library(readxl)
datos <- read_excel("datos.xlsx", sheet = 1)`,no:1,o:"Si sale «cannot open file», revisa el nombre del archivo y la carpeta. En RStudio también sirve Session > Set Working Directory."},
{t:"Gráficos básicos",x:"Un histograma muestra la distribución de una variable; un diagrama de dispersión muestra la relación entre dos.",r:String.raw`hist(Yt, main = "Demanda mensual de TV", xlab = "Yt", col = "grey")
plot(X2t, Yt, xlab = "Precio", ylab = "Demanda", pch = 8, col = "red")
abline(lm(Yt ~ X2t), lty = 2)   # recta de MCO`,o:"Un histograma con muchos meses de demanda baja (cerca de 2) y una nube de puntos con pendiente negativa: a mayor precio, menor demanda."},
{t:"Ayuda y errores frecuentes",x:"Con <code>?función</code> abres la ayuda. Los errores más comunes al empezar: olvidar cargar el paquete, escribir mal el nombre de una variable (R distingue mayúsculas: <code>yt</code> no es <code>Yt</code>) y usar coma decimal en el código (en R el decimal es el punto).",r:String.raw`?lm                     # ayuda de la función lm
names(Datos)            # nombres exactos de las variables
3.5 + 1                 # bien: el decimal es punto
# 3,5 + 1               # mal: da error`,o:"La ayuda se abre en el panel derecho; los nombres son Mes, Yt, X2t y X3t."}];

RM["variables"]=[
{t:"Carga la base del curso",x:"Usamos la base del <b>Ejemplo 1</b> del profesor: 48 meses de demanda de televisores. <code>Yt</code> es la demanda, <code>X2t</code> el precio y <code>X3t</code> la inversión en publicidad. Los meses 49 y 50 traen precio y publicidad pero no demanda: son para pronosticar.",r:TVLOAD,o:"Una tabla con las columnas Mes, Yt, X2t y X3t."},
{t:"Variable dependiente e independientes",x:"La dependiente <span class=\"m\">Yt</span> es la que queremos explicar (la demanda); las independientes la explican (precio y publicidad). En R se escribe <code>Yt ~ X2t + X3t</code>, que se lee «Yt en función de X2t y X3t». El profesor numera los coeficientes desde β₁, que es el intercepto.",f:"Yt = β₁ + β₂X2t + β₃X3t + μt",r:String.raw`eq1 = lm(Yt ~ X2t + X3t)
coef(eq1)`,o:"b₁ = 10,3017, b₂ = −0,005994 y b₃ = 0,005107: si el precio sube una unidad, la demanda baja 0,006; si la publicidad sube una unidad, la demanda sube 0,0051."},
{t:"Escalas: nominal, ordinal, intervalo y razón",x:"Una variable <b>nominal</b> solo clasifica (por ejemplo, el trimestre o si la persona es mujer): en R va como <code>factor</code>. Una <b>ordinal</b> además ordena (estrato). Las de <b>intervalo</b> y <b>razón</b> son numéricas; solo las de razón (cero real, como el precio o la demanda) admiten logaritmo.",r:String.raw`trimestre = factor(rep(1:4, length.out = 12), labels = c("T1", "T2", "T3", "T4"))
table(trimestre)                                       # nominal
estrato = factor(c(2, 3, 1, 3, 2), levels = 1:3, ordered = TRUE)
estrato                                                # ordinal
summary(X2t)                                           # razón: tiene cero real`,o:"Tres meses en cada trimestre; los estratos salen ordenados 1 < 2 < 3; el precio va de 904 a 1.471."},
{t:"Continuas y discretas",x:"Una variable <b>continua</b> puede tomar cualquier valor en un rango (la publicidad X3t tiene decimales); una <b>discreta</b> toma valores contables (el mes).",r:String.raw`head(unique(X3t))     # valores con decimales: continua
range(Datos$Mes)      # 1, 2, ..., 50: discreta`,o:"X3t toma valores como 129,518 y 72,289; el mes va de 1 a 50."},
{t:"Modelo nivel-nivel (Ejemplo 1)",x:"Cada β mide el cambio de Yt, en sus unidades, cuando la regresora sube una unidad.",f:"Yt = β₁ + β₂X2t + β₃X3t + μt",r:String.raw`summary(eq1)$coefficients`,o:"β̂₂ = −0,005994 (precio) y β̂₃ = 0,005107 (publicidad), los dos con p-valor prácticamente cero."},
{t:"Modelo multiplicativo, log-log (Ejemplo 2)",x:"El profesor estima la demanda en logaritmos. Con logaritmo a los dos lados, cada β es una <b>elasticidad</b>: si la regresora sube 1 %, Yt cambia β %.",f:"ln Yt = β₁ + β₂ ln X2t + β₃ ln X3t + μt  ⇒  β₂ = %ΔYt / %ΔX2t",r:String.raw`library(tseries)
lny = log(Yt); lnX2t = log(X2t); lnX3t = log(X3t)
eq1_ln = lm(lny ~ lnX2t + lnX3t)
summary(eq1_ln)
jarque.bera.test(resid(eq1_ln))     # normalidad de los errores`,o:"ln Yt = 16,522 − 2,2467 ln X2t + 0,1345 ln X3t, con R² = 0,939. Si el precio sube 1 %, la demanda cae 2,25 % (demanda elástica); si la publicidad sube 1 %, la demanda sube 0,13 %. Jarque-Bera = 2,03 (p = 0,363): los errores son normales."},
{t:"Modelo log-nivel (semielasticidad)",x:"Con el logaritmo solo en Yt, si la regresora sube una unidad, Yt cambia aproximadamente 100·β %. El cambio exacto es 100·(e^β − 1).",f:"ln Yt = β₁ + β₂X2t  ⇒  %ΔYt ≈ 100·β₂",r:String.raw`m_ln = lm(log(Yt) ~ X2t)
b2 = coef(m_ln)["X2t"]
100 * b2                # aproximación (%)
100 * (exp(b2) - 1)     # cambio exacto (%)`,o:"−0,199 %: cada unidad más de precio reduce la demanda cerca de 0,2 %."},
{t:"Modelo nivel-log",x:"Con el logaritmo solo en la regresora, si X sube 1 %, Yt cambia β/100 unidades.",f:"Yt = β₁ + β₂ ln X2t  ⇒  ΔYt ≈ (β₂/100)·%ΔX2t",r:String.raw`m_nl = lm(Yt ~ log(X2t))
coef(m_nl)["log(X2t)"] / 100`,o:"−0,0767: si el precio sube 1 %, la demanda baja 0,077 unidades."}];

RM["datos"]=[
{t:"Serie de tiempo: la demanda mensual",x:"Una unidad observada en muchos períodos. El orden sí importa, y en R conviene convertirla en objeto <code>ts</code> indicando el inicio y la frecuencia (12 si es mensual, 4 si es trimestral, 1 si es anual).",r:String.raw`${TVLOAD}
Yts = ts(Yt, frequency = 12)      # 48 meses = 4 años
Yts
plot(Yts, main = "Demanda mensual de TV", xlab = "Año", ylab = "Yt")`,o:"La demanda baja de cerca de 5 a cerca de 2 en los primeros dos años y luego se estabiliza."},
{t:"Serie anual: el ahorro (Capítulo 2)",x:"Así arma el profesor la serie de ahorro de 1970 a 1995 en el Ejemplo 2 del capítulo 2, y marca con una línea el año del posible quiebre.",r:String.raw`Datos2 = data.frame(read_excel("Datos_Ejem2_Ingreso_Ahorro_2026_2.xls"))
Yts2 = ts(Datos2$Yt, start = 1970, end = 1995, frequency = 1)
plot(Yts2, type = "l", main = "Diagrama de dispersión", xlab = "Tiempo", ylab = "Ahorro")
abline(v = 1984, col = "red", lty = 2)`,no:1,o:"La serie de ahorro con una línea roja punteada en 1984. Necesitas el Excel del capítulo 2 del profesor."},
{t:"Serie trimestral: ventas (Ejemplo 9)",x:"Con datos trimestrales la frecuencia es 4 y el inicio se da como año y trimestre.",r:String.raw`Datos9 = data.frame(read_excel("Datos_Ejemplo_9_Estac.xls"))
yt = ts(Datos9$y, frequency = 4, start = c(1978, 1), end = c(1985, 4))
plot(yt, main = "Ventas trimestrales", xlab = "Tiempo", ylab = "Ventas")`,no:1,o:"32 trimestres de ventas con un patrón que se repite cada año. Necesitas el Excel del Ejemplo 9."},
{t:"Corte transversal",x:"Muchas unidades observadas en un mismo momento; el orden de las filas no importa. Ejemplo: los 17 trabajadores del punto 5 de los Ejercicios propuestos 3 (sueldo, años de experiencia y si es mujer).",r:String.raw`sal = data.frame(
  sueldo = c(3.14, 3.32, 3.61, 1.65, 2.64, 3.64, 2.46, 1.69, 1.91, 3.10, 1.98, 2.14, 2.61, 3.60, 3.38, 3.50, 3.65),
  exper  = c(13, 16, 30, 2, 8, 31, 10, 1, 6, 15, 4, 7, 13, 27, 19, 25, 20),
  mujer  = c(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1))
dim(sal)
table(sal$mujer)`,o:"17 filas y 3 columnas: 9 hombres y 8 mujeres."},
{t:"Datos de panel y formato largo o ancho",x:"Las mismas unidades seguidas en varios períodos: cada fila se identifica con la <b>unidad</b> y el <b>período</b>. En formato <b>largo</b> hay una fila por unidad y período; en formato <b>ancho</b>, una fila por unidad y una columna por período. <code>tidyr</code> pasa de uno a otro. (Ejemplo inventado: ventas de tres tiendas en tres años.)",r:String.raw`library(tidyr)
largo = data.frame(tienda = rep(c("A", "B", "C"), each = 3),
                   anio   = rep(2023:2025, times = 3),
                   ventas = c(10, 12, 13, 8, 9, 11, 15, 14, 16))
ancho = pivot_wider(largo, names_from = anio, values_from = ventas, names_prefix = "v_")
ancho                         # una fila por tienda
pivot_longer(ancho, cols = starts_with("v_"), names_to = "anio",
             names_prefix = "v_", values_to = "ventas")`,o:"Tres filas con las columnas v_2023, v_2024 y v_2025, y de vuelta las 9 filas."}];

RM["matrices"]=[
{t:"Escribe X y y",x:"Cada fila de X es una observación; la primera columna son unos (el intercepto) y la segunda la regresora. Con 4 observaciones del ejemplo de la lección:",f:"y = Xβ + μ,  X = [1 x]",r:String.raw`X = cbind(1, c(2, 3, 5, 6))   # cbind pega columnas
y = c(12, 15, 20, 22)
X
dim(X)                          # n × k`,o:"Una matriz de 4 × 2."},
{t:"Transpuesta y producto",x:"<code>t()</code> transpone y <code>%*%</code> multiplica matrices (el <code>*</code> solo multiplica elemento por elemento).",f:"X′X = [n Σx; Σx Σx²],  X′y = [Σy; Σxy]",r:String.raw`t(X)
XtX = t(X) %*% X
Xty = t(X) %*% y
XtX; Xty`,o:"X′X = [4 16; 16 74] y X′y = [69; 301]."},
{t:"Inversa",x:"<code>solve(A)</code> da la inversa A⁻¹. Comprueba que A·A⁻¹ es la identidad.",f:"(X′X)⁻¹ = (1/det)·[Σx² −Σx; −Σx n]",r:String.raw`det(XtX)                 # 4·74 − 16² = 40
XtX_inv = solve(XtX)
XtX_inv
round(XtX %*% XtX_inv, 10)   # identidad`,o:"El determinante es 40 y la inversa [1,85 −0,4; −0,4 0,1]."},
{t:"El estimador b = (X′X)⁻¹X′y",x:"Es toda la regresión por MCO en una línea.",f:"b = (X′X)⁻¹ X′y",r:String.raw`b = XtX_inv %*% Xty
b
coef(lm(y ~ X[, 2]))    # comprobación con lm`,o:"b₁ = 7,25 y b₂ = 2,5 por los dos caminos."},
{t:"Cuando te dan X′X y X′y (Dinardo 3.10, asesoría del parcial)",x:"En los ejercicios del parcial no hay datos: te dan las matrices. Así las escribe el profesor en R, columna por columna o con <code>matrix()</code>.",r:String.raw`c1 = cbind(c(10, 30, 40)); c2 = cbind(c(30, 92, 119)); c3 = cbind(c(40, 119, 163))
XtX = cbind(c1, c2, c3)
XtX1 = matrix(nrow = 3, ncol = 3, c(10, 30, 40, 30, 92, 119, 40, 119, 163))   # otra forma
Xty = cbind(c(20, 59, 88))
b = solve(XtX) %*% Xty
b`,o:"b = (−13; 1; 3)."}];

RM["mco-simple"]=[
{t:"Carga los datos",x:"Para el modelo simple tomamos solo el precio: demanda de TV contra precio, con la base del Ejemplo 1.",r:TVLOAD},
{t:"La pendiente con la fórmula",x:"MCO escoge la recta que hace mínima la suma de los errores al cuadrado. La pendiente es la covarianza entre X y Y dividida por la varianza de X.",f:"b₂ = Σ(X2t − X̄₂)(Yt − Ȳ) / Σ(X2t − X̄₂)²",r:String.raw`b2 = sum((X2t - mean(X2t)) * (Yt - mean(Yt))) / sum((X2t - mean(X2t))^2)
b2
cov(X2t, Yt) / var(X2t)      # lo mismo`,o:"−0,0064096."},
{t:"El intercepto",x:"La recta de MCO pasa por el punto de medias.",f:"b₁ = Ȳ − b₂X̄₂",r:String.raw`b1 = mean(Yt) - b2 * mean(X2t)
b1`,o:"11,2449."},
{t:"Lo mismo con lm()",x:"<code>lm()</code> hace todo el cálculo; <code>summary()</code> muestra coeficientes, errores estándar, t, p-valores, R² y la prueba F.",r:String.raw`eq_s = lm(Yt ~ X2t)
summary(eq_s)`,o:"Los mismos 11,2449 y −0,0064096, con R² = 0,9577."},
{t:"Yt estimado y errores de estimación",x:"Ŷt es el punto sobre la recta; et es la distancia vertical hasta el dato. Por construcción, los errores suman cero y no están correlacionados con X.",f:"Ŷt = b₁ + b₂X2t,  et = Yt − Ŷt",r:String.raw`Yte = fitted(eq_s); et = resid(eq_s)
head(cbind(Yt, Yte, et), 3)
sum(et)            # ≈ 0
sum(X2t * et)      # ≈ 0`,o:"Las dos sumas dan prácticamente cero (del orden de 10⁻¹²)."},
{t:"Sumas de cuadrados y R²",x:"La variación total de Yt se reparte en la que explica el modelo y la que queda en los errores. El profesor las llama TSS, ESS y RSS.",f:"TSS = Σ(Yt − Ȳ)² = ESS + RSS,  R² = ESS/TSS = 1 − RSS/TSS",r:String.raw`TSS = sum((Yt - mean(Yt))^2)
ESS = sum((Yte - mean(Yt))^2)
RSS = sum(et^2)
c(TSS = TSS, ESS_mas_RSS = ESS + RSS)
ESS / TSS
summary(eq_s)$r.squared   # comprobación`,o:"TSS = 53,6715 = 51,3997 + 2,2718 y R² = 0,9577: el precio explica el 95,8 % de la variación de la demanda."},
{t:"Gráfico de la regresión",x:"Dibuja los datos y la recta estimada.",r:String.raw`plot(X2t, Yt, xlab = "Precio", ylab = "Demanda", pch = 8, col = "red")
abline(eq_s, lty = 2)`}];

RM["mco-matricial"]=[
{t:"Matrices de datos (Ejemplo 1)",x:"Como en el notebook del profesor: X0 tiene las 50 filas (con la columna de unos), X las primeras 48 y y la demanda de esos 48 meses.",f:"y = Xβ + μ,  X = [1 X2t X3t]",r:String.raw`library(readxl)
Datos = data.frame(read_excel("Datos_Ejemplo_1_Demanda_TV_Precio_Pub.xls"))
n = 48; k = 3; alpha = 0.05
X0 = as.matrix(cbind(1, Datos[, 3:4]))   # 50 filas: 1, X2t, X3t
X  = X0[1:n, ]
y  = cbind(Datos[1:n, 2])
X2t = cbind(X[, 2]); X3t = cbind(X[, 3])
dim(X)`,o:"X es de 48 × 3."},
{t:"X′X, su determinante y su inversa",x:"<code>t(X)</code> es la transpuesta, <code>det()</code> el determinante y <code>solve()</code> la inversa.",f:"X′X = [n ΣX2 ΣX3; ΣX2 ΣX2² ΣX2X3; ΣX3 ΣX2X3 ΣX3²]",r:String.raw`(XtX = t(X) %*% X)
(det_XtX = det(XtX))
(XtX_inv = solve(XtX))`,o:"X′X = [48 62.352 3.791,564; 62.352 82.246.350 4.823.454; 3.791,564 4.823.454 348.387,5], con determinante 2,4386·10¹²."},
{t:"El estimador b",x:"La misma fórmula del modelo simple, ahora con tres columnas.",f:"b = (X′X)⁻¹X′y",r:String.raw`(Xty = t(X) %*% y)
(b = XtX_inv %*% Xty)`,o:"X′y = (140,10; 173.970,78; 11.926,43) y b = (10,3017; −0,005994; 0,005107)."},
{t:"Yt contra Yt estimado",x:"Si el modelo ajusta bien, los puntos (Yt, Ŷt) quedan cerca de la recta de 45°.",f:"ŷ = Xb",r:String.raw`ye = cbind(X %*% b)
plot(y, ye, pch = 8, col = "red", main = "Yt vs Yte", xlab = "Demanda observada", ylab = "Demanda estimada")
abline(a = 0, b = 1, lty = 2)
plot(y, type = "l", ylim = c(1, 6), ylab = "Yt - Yte", xlab = "Indice")
lines(ye, col = "red", lty = 2)
legend(x = 25, y = 6, legend = c("Observado", "Estimado"), lty = c(1, 2), col = c("black", "red"))`,o:"Los puntos casi sobre la recta de 45° y las dos líneas casi encima una de otra."},
{t:"Pronósticos para los meses 49 y 50",x:"Con los precios y la publicidad de los meses 49 y 50 se pronostica la demanda.",f:"ŷf = Xf·b",r:String.raw`(Xf = X0[49:50, ])
(yf = cbind(Xf %*% b))`,o:"2,0893 para el mes 49 y 2,0787 para el mes 50."},
{t:"Propiedades de los errores: media cero y X′e = 0",x:"Con intercepto, la media de los errores es cero y X′e = 0 (las ecuaciones normales). Por eso la media de Ŷt es igual a la media de Yt.",f:"ē = 0,  X′e = 0,  Ȳ = mean(Ŷ)",r:String.raw`e = y - ye
round(mean(e), 4)
round(t(X) %*% e, 4)
c(mean(y), mean(ye))`,o:"Media 0, X′e = (0; 0; 0) y las dos medias valen 2,91875."},
{t:"Sumas de cuadrados de varias formas",x:"El profesor calcula el TSS de tres formas, el ESS y el RSS de dos, y verifica la ecuación (16): TSS = ESS + RSS.",f:"TSS = y′y − nȲ² = (n − 1)s²y,  ESS = b′X′Xb − nȲ²,  RSS = e′e",r:String.raw`TSS  = sum((y - mean(y))^2)
TSS1 = (t(y) %*% y - n * mean(y)^2)[1]
TSS2 = (n - 1) * sd(y)^2
ESS  = (t(b) %*% XtX %*% b - n * mean(y)^2)[1]
ESS1 = sum((ye - mean(ye))^2)
RSS  = sum(e^2)
RSS1 = (t(e) %*% e)[1]
c(TSS, TSS1, TSS2, ESS, ESS1, RSS, RSS1, ESS + RSS)
(R2 = ESS / TSS)`,o:"TSS = 53,6715 (por las tres formas), ESS = 52,4588, RSS = 1,2127 y R² = 0,9774."},
{t:"Lo mismo con lm() y lo que se puede sacar",x:"Del modelo y de su resumen salen los residuos, el RSS (<code>deviance</code>), los coeficientes, R², R² ajustado, AIC, SC y (X′X)⁻¹.",r:String.raw`eq1 = lm(y ~ X2t + X3t)
seq1 = summary(eq1)
seq1
deviance(eq1)            # RSS
seq1$r.squared; seq1$adj.r.squared
AIC(eq1); BIC(eq1)       # AIC y SC
seq1$cov.unscaled        # (X'X)^-1`,o:"RSS = 1,2127, R² = 0,9774, R² ajustado = 0,9764, AIC = −32,34 y SC = −24,86."},
{t:"Modelo en desviaciones a la media (Ejemplo 3)",x:"La matriz A = Iₙ − (1/n)ii′ resta la media a cada columna. Con las variables en desviaciones se estiman b₂ y b₃ sin intercepto, y el intercepto se recupera con las medias.",f:"X* = A·X₂,  y* = A·y,  b₂ = (X*′X*)⁻¹X*′y*,  b₁ = Ȳ − b₂X̄₂ − b₃X̄₃",r:String.raw`I = cbind(rep(1, n))
A = diag(n) - (1/n) * I %*% t(I)
X2 = as.matrix(X[, 2:3])
Xa = A %*% X2; ya = A %*% y
(XatXa = t(Xa) %*% Xa)
(Xatya = t(Xa) %*% ya)
(b2 = solve(XatXa) %*% Xatya)
(b1a = mean(y) - b2[1] * mean(X2t) - b2[2] * mean(X3t))`,o:"X*′X* = [1.251.102 −101.787,2; −101.787,2 48.888,34], X*′y* = (−8.019,12; 859,804), y los mismos b₂ = −0,005994, b₃ = 0,005107 y b₁ = 10,3017."},
{t:"Sumas de cuadrados en desviaciones y lm() sin intercepto",x:"En desviaciones, TSS = y*′y* y ESS = b₂′X*′X*b₂: dan lo mismo que en niveles. En <code>lm()</code> el <code>− 1</code> quita el intercepto.",f:"TSS = y*′y*,  ESS = b₂′X*′X*b₂,  RSS = e*′e*",r:String.raw`ea = ya - Xa %*% b2
c(TSSa = (t(ya) %*% ya)[1], ESSa = (t(b2) %*% XatXa %*% b2)[1], RSSa = (t(ea) %*% ea)[1])
x2a = Xa[, 1]; x3a = Xa[, 2]
summary(lm(ya ~ x2a + x3a - 1))`,o:"TSS = 53,6715, ESS = 52,4588 y RSS = 1,2127, igual que en niveles."}];

RM["supuestos"]=[
{t:"Estima el modelo de trabajo",x:"Revisamos los supuestos sobre el Ejemplo 1 (demanda de TV contra precio y publicidad).",r:String.raw`${TVLOAD}
eq1 = lm(Yt ~ X2t + X3t)
e = resid(eq1)
alpha = 0.05`},
{t:"Sin colinealidad perfecta",x:"Ninguna regresora puede ser combinación lineal exacta de otras. Si lo es, det(X′X) = 0, R no puede invertir X′X y muestra NA en el coeficiente.",f:"rango(X) = k",r:String.raw`X4t = 2 * X2t                          # copia exacta del precio
coef(lm(Yt ~ X2t + X4t))
qr(model.matrix(eq1))$rank             # debe ser k = 3`,o:"El coeficiente de X4t sale NA; el rango del modelo bueno es 3."},
{t:"Media cero y X′e = 0 (lo que sí se puede revisar)",x:"E(μ|X) = 0 no se puede probar con los errores de estimación, porque MCO los fuerza a tener media cero y a cumplir X′e = 0. Lo que sí sirve es graficarlos contra cada regresora y buscar patrones (por ejemplo, curvatura).",f:"E(μt) = 0",r:String.raw`round(mean(e), 4); round(t(model.matrix(eq1)) %*% e, 4)
plot(X2t, e, xlab = "Precio", ylab = "et"); abline(h = 0, col = "red")`,o:"Media y X′e iguales a cero. En el gráfico se busca una nube plana alrededor de cero."},
{t:"Varianza constante: mira el abanico",x:"La varianza del error debe ser constante. Si los errores se abren como un abanico al subir Ŷt, hay heterocedasticidad (estación de heterocedasticidad).",f:"Var(μt) = σ²",r:String.raw`plot(fitted(eq1), e, xlab = "Yt estimado", ylab = "et")
abline(h = 0, col = "red")`},
{t:"Normalidad 1: histograma con la curva normal",x:"El profesor superpone la normal con media 0 y desviación sd(e) sobre el histograma de frecuencias relativas.",r:String.raw`me = round(mean(e), 4)
hist(e, seq(-0.44, 0.40, by = 0.12), prob = TRUE, main = "Histograma de residuales",
     xlab = "Errores de estimación", ylab = "Freq. Relativa", xlim = c(-0.5, 0.5))
curve(dnorm(x, mean = me, sd = sd(e)), col = "red", lty = 2, lwd = 2, add = TRUE)`,o:"Un histograma con forma de campana, centrado en cero."},
{t:"Normalidad 2: cajas y bigotes",x:"Si la caja es simétrica y la media (el asterisco) queda cerca de la mediana, no hay asimetría marcada.",r:String.raw`boxplot(e, main = "Gráfico de cajas y bigotes", horizontal = TRUE)
points(mean(e), pch = 8, col = "blue", y = 1)`},
{t:"Normalidad 3: gráfico de probabilidad normal",x:"<code>qqPlot()</code> del paquete car pone bandas de confianza: si los puntos quedan dentro, la normalidad es razonable.",r:String.raw`library(car)
qqPlot(e, pch = 8, main = "Gráfico de probabilidad normal", xlab = "Percentiles teóricos",
       ylab = "Percentiles muestrales", col = "red", col.lines = "black")`,o:"Los puntos siguen la línea y quedan dentro de las bandas."},
{t:"Normalidad 4: prueba de Jarque-Bera",x:"H₀: los errores son normales. JB combina la asimetría S y la curtosis K de los errores y se compara con una ji cuadrado con 2 grados de libertad.",f:"JB = n·[S²/6 + (K − 3)²/24]  ~  χ²(2)",r:String.raw`library(tseries)
p_jb = jarque.bera.test(e)
p_jb
(jb_c = p_jb$statistic)
(pv_jb = pchisq(jb_c, df = 2, lower.tail = FALSE))
if (pv_jb >= alpha) "El supuesto de normalidad es válido" else "No se acepta la hipótesis de normalidad"`,o:"JB = 1,1217 con p-valor 0,5707 > 0,05: el supuesto de normalidad es válido."}];

RM["inferencia"]=[
{t:"Estima el modelo (Ejemplo 4)",x:"Mismo modelo de demanda. Se guardan X′X, su inversa, b y las sumas de cuadrados, porque las pruebas las usan.",r:String.raw`${TVLOAD}
X = cbind(1, X2t, X3t); y = cbind(Yt); a = 0.05
XtX = t(X) %*% X; XtX_inv = solve(XtX)
b = XtX_inv %*% t(X) %*% y
e = y - X %*% b
TSS = sum((y - mean(y))^2); RSS = sum(e^2); ESS = TSS - RSS
eq1 = lm(Yt ~ X2t + X3t)`},
{t:"Varianza estimada y errores estándar",x:"σ² se estima dividiendo el RSS por n − k. La varianza estimada de b es S²(X′X)⁻¹ y los errores estándar son la raíz de su diagonal.",f:"S² = RSS/(n − k),  var(b) = S²(X′X)⁻¹,  S_bi = √var(b)ᵢᵢ",r:String.raw`(S2 = RSS / (n - k))
(var_b = S2 * XtX_inv)
(Sb = sqrt(diag(var_b)))
vcov(eq1)          # comprobación con R`,o:"S² = 0,026948 y errores estándar 0,24401, 0,00016104 y 0,00081464."},
{t:"La F general, ecuación (56)",x:"Toda hipótesis lineal se escribe Rβ = r, con q restricciones. Para H₀: β₁ = 0, R = [1 0 0], r = 0 y q = 1.",f:"F = [(Rb − r)′ [R(X′X)⁻¹R′]⁻¹ (Rb − r) / q] / S²  ~  F(q, n − k)",r:String.raw`qb1 = 1; Rb1 = rbind(c(1, 0, 0)); rb1 = cbind(0)
Fc_56_b1 = ((t(Rb1 %*% b - rb1) %*% solve(Rb1 %*% XtX_inv %*% t(Rb1)) %*% (Rb1 %*% b - rb1))[1] / qb1) / S2
Fc_56_b1
pf(Fc_56_b1, df1 = qb1, df2 = n - k, lower.tail = FALSE)`,o:"F = 1.782,4 con p-valor prácticamente cero: β₁ es distinto de cero."},
{t:"Un solo coeficiente: F (58) y t (59)",x:"Para H₀: βᵢ = 0, la F (58) es b²/S²bᵢ y la t (59) es b/S_bᵢ; se cumple F = t². <b>Ojo:</b> el p-valor de t lleva <code>abs()</code>; sin él, un coeficiente negativo como el del precio da un p-valor cercano a 2.",f:"F = bᵢ²/S²bᵢ  ~  F(1, n − k),  t = bᵢ/S_bᵢ  ~  t(n − k)",r:String.raw`(Fc_58_b1 = b[1]^2 / var_b[1, 1])
(tc = b / Sb)                                  # las tres t
(pv = 2 * pt(abs(tc), df = n - k, lower.tail = FALSE))
ifelse(pv < a, "significativo", "no significativo")`,o:"F = 1.782,4 = 42,218². Las t son 42,22, −37,22 y 6,27, todas con p-valor menor que 0,05: precio y publicidad son significativos."},
{t:"Significancia de la regresión: F (56) y F (61)",x:"H₀: β₂ = β₃ = 0. Con la (56), R = [0 I₂] y q = k − 1. La (61) usa las sumas de cuadrados y da lo mismo.",f:"F = [ESS/(k − 1)] / [RSS/(n − k)]  ~  F(k − 1, n − k)",r:String.raw`q = k - 1; R = cbind(0, diag(2)); r = cbind(c(0, 0))
(Fc_56_SR = ((t(R %*% b - r) %*% solve(R %*% XtX_inv %*% t(R)) %*% (R %*% b - r))[1] / q) / S2)
(Fc_61 = (ESS / (k - 1)) / (RSS / (n - k)))
pf(Fc_61, df1 = k - 1, df2 = n - k, lower.tail = FALSE)`,o:"F = 973,32 por las dos fórmulas, con p-valor prácticamente cero: la regresión es significativa."},
{t:"Intervalos de confianza del 95 %",x:"b ± t(α/2; n − k)·S_b. Con <code>confint()</code> salen todos; con <code>parm</code> y <code>level</code> uno solo con otra confianza.",f:"bᵢ ± t(α/2; n − k)·S_bᵢ",r:String.raw`(ta2 = qt(a/2, df = n - k, lower.tail = FALSE))
c(LI_b1 = b[1] - ta2 * Sb[1], LS_b1 = b[1] + ta2 * Sb[1])
confint(eq1)
confint(eq1, parm = 3, level = 0.80)`,o:"t = 2,0141. β₁ ∈ [9,8103; 10,7932], β₂ ∈ [−0,006318; −0,005670], β₃ ∈ [0,003466; 0,006748]; al 80 %, β₃ ∈ [0,004048; 0,006167]."},
{t:"H₀: β₂ + β₃ = 0 con F (56) y F (60)",x:"Una sola restricción con dos coeficientes. La (60) usa la varianza de la suma, que incluye la covarianza.",f:"F = (b₂ + b₃)² / [S²b₂ + S²b₃ + 2·cov(b₂, b₃)]",r:String.raw`qd = 1; Rd = rbind(c(0, 1, 1)); rd = cbind(0)
(Fc_56_d = ((t(Rd %*% b - rd) %*% solve(Rd %*% XtX_inv %*% t(Rd)) %*% (Rd %*% b - rd))[1] / qd) / S2)
S2b2b3 = var_b[2, 2] + var_b[3, 3] + 2 * var_b[2, 3]
(Fc_60_d = (b[2] + b[3])^2 / S2b2b3)
pf(Fc_60_d, 1, n - k, lower.tail = FALSE)`,o:"F = 0,9866 por las dos fórmulas, con p-valor 0,326: no se rechaza que β₂ + β₃ = 0."},
{t:"Con linearHypothesis() del paquete car",x:"La restricción se escribe como texto con los nombres de las variables. También acepta varias a la vez, o la matriz R con el vector r en <code>rhs</code>.",r:String.raw`library(car)
linearHypothesis(eq1, "X2t + X3t = 0", test = "F")
linearHypothesis(eq1, c("X2t + X3t = 0", "(Intercept) = 10"), test = "F")
Rd1 = rbind(c(0, 1, 1), c(1, 0, 0)); rd1 = cbind(c(0, 10))
linearHypothesis(eq1, Rd1, rhs = rd1, test = "F")`,o:"F = 0,9866 (p = 0,326) para la primera; para las dos juntas, F = 0,7719 (p = 0,468): tampoco se rechazan."},
{t:"Estimador restringido y F (64)",x:"El modelo estimado sujeto a Rβ = r tiene un RSS mayor. La (64) compara el RSS restringido con el no restringido y da la misma F.",f:"b_R = b + (X′X)⁻¹R′[R(X′X)⁻¹R′]⁻¹(r − Rb),  F = [(RSS_R − RSS_NR)/q] / [RSS_NR/(n − k)]",r:String.raw`(br = b + XtX_inv %*% t(Rd) %*% solve(Rd %*% XtX_inv %*% t(Rd)) %*% (rd - Rd %*% b))
er = y - X %*% br
(RSSr = sum(er^2))
(Fc_64 = ((RSSr - RSS) / qd) / (RSS / (n - k)))`,o:"b_R = (10,1232; −0,005905; 0,005905), RSS_R = 1,2393 y F = 0,9866, la misma de antes."},
{t:"El modelo restringido con restriktor",x:"El paquete <code>restriktor</code> estima el modelo con la restricción escrita como texto. Su S² usa n − k + q grados de libertad.",f:"RSS_R = (n − k + q)·S²_R",r:String.raw`# install.packages("restriktor")
library(restriktor)
eq1_r = restriktor(eq1, constraints = "X2t + X3t == 0;")
seq1_r = summary(eq1_r)
seq1_r
(RSS_R = (n - k + 1) * seq1_r$s2)`,no:1,o:"Los mismos coeficientes restringidos y RSS_R = 1,2393."}];

RM["dicotomicas"]=[
{t:"Los datos: sueldo, experiencia y sexo",x:"Punto 5 de los Ejercicios propuestos 3: 17 trabajadores. <code>mujer</code> vale 1 si es mujer y 0 si es hombre.",r:String.raw`sal = data.frame(
  sueldo = c(3.14, 3.32, 3.61, 1.65, 2.64, 3.64, 2.46, 1.69, 1.91, 3.10, 1.98, 2.14, 2.61, 3.60, 3.38, 3.50, 3.65),
  exper  = c(13, 16, 30, 2, 8, 31, 10, 1, 6, 15, 4, 7, 13, 27, 19, 25, 20),
  mujer  = c(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1))
table(sal$mujer)`,o:"9 hombres y 8 mujeres."},
{t:"Cambio en el intercepto",x:"La dicotómica desplaza la recta en paralelo: su coeficiente es la diferencia promedio de sueldo entre mujeres y hombres con la misma experiencia.",f:"sueldo = β₁ + β₂·exper + δ·mujer + μ",r:String.raw`m1 = lm(sueldo ~ exper + mujer, data = sal)
summary(m1)$coefficients`,o:"δ̂ = 0,094 con p-valor 0,52: a igual experiencia, no hay diferencia significativa de sueldo entre mujeres y hombres."},
{t:"Cambio en la pendiente: interacción",x:"Si el efecto de la experiencia es distinto para mujeres y hombres, se agrega el producto mujer·exper. En R, <code>exper * mujer</code> incluye exper, mujer y su interacción.",f:"sueldo = β₁ + β₂exper + δ₁mujer + δ₂(mujer·exper) + μ",r:String.raw`m2 = lm(sueldo ~ exper * mujer, data = sal)
summary(m2)$coefficients`,o:"δ̂₂ = 0,0113 con p-valor 0,51: el efecto de la experiencia no difiere entre mujeres y hombres."},
{t:"Dicotómicas estacionales (Ejemplo 9)",x:"Así crea el profesor las dicotómicas trimestrales con <code>ifelse()</code>. <b>Ojo:</b> en el notebook usa <code>n = 8</code> y <code>ts()</code> repite el patrón hasta 32 trimestres; es más claro generar las 32 de una vez con <code>length.out = 32</code>.",f:"Qⱼt = 1 si t está en el trimestre j, 0 si no",r:String.raw`library(readxl)
Datos9 = data.frame(read_excel("Datos_Ejemplo_9_Estac.xls"))
yt = ts(Datos9$y, frequency = 4, start = c(1978, 1), end = c(1985, 4))
trimestre = rep(1:4, length.out = 32)
Q1 = ts(ifelse(trimestre == 1, 1, 0), frequency = 4, start = c(1978, 1))
Q2 = ts(ifelse(trimestre == 2, 1, 0), frequency = 4, start = c(1978, 1))
Q3 = ts(ifelse(trimestre == 3, 1, 0), frequency = 4, start = c(1978, 1))
Q4 = ts(ifelse(trimestre == 4, 1, 0), frequency = 4, start = c(1978, 1))
data.frame(trimestre, Q1, Q2, Q3, Q4)[1:8, ]`,no:1,o:"Cada fila tiene un solo 1, en la columna de su trimestre. Necesitas el Excel del Ejemplo 9."},
{t:"Efecto estacional y la trampa de las dicotómicas",x:"Con las cuatro dicotómicas el modelo va <b>sin intercepto</b> (el <code>− 1</code>), porque Q1 + Q2 + Q3 + Q4 = 1 sería colinealidad perfecta con la columna de unos. Cada coeficiente es la venta media de su trimestre.",f:"yt = δ₁Q1t + δ₂Q2t + δ₃Q3t + δ₄Q4t + μt",r:String.raw`eq1 = lm(yt ~ Q1 + Q2 + Q3 + Q4 - 1)
summary(eq1)`,no:1,o:"Cuatro coeficientes, uno por trimestre: son las ventas medias de cada trimestre."},
{t:"Serie desestacionalizada",x:"Los errores de estimación de ese modelo son las ventas sin el componente estacional.",r:String.raw`et = ts(resid(eq1), frequency = 4, start = c(1978, 1), end = c(1985, 4))
plot(et, type = "l", main = "Ventas desestacionalizadas", xlab = "Tiempo", ylab = "Ventas")`,no:1,o:"Una serie que fluctúa alrededor de cero sin el patrón trimestral."}];

RM["chow"]=[
{t:"Datos y modelo (Capítulo 2, Ejemplo 2)",x:"Ahorro (Yt) contra ingreso (Xt), 1970-1995 (n = 26). La pregunta: ¿cambió la relación después de 1984? Se parte la muestra en n₁ = 15 (1970-1984) y n₂ = 11 (1985-1995).",f:"Yt = β₁ + β₂Xt + μt",r:String.raw`library(readxl); library(car); library(tseries); library(strucchange)
setwd("D:/eco1_26_2/Capitulo2/")
Datos = data.frame(read_excel("Datos_Ejem2_Ingreso_Ahorro_2026_2.xls"))
Xt = cbind(Datos$Xt); Yt = cbind(Datos$Yt)
n = 26; n1 = 15; n2 = 11; k = 2; alpha = 0.05
X1t = cbind(Xt[1:15]);  Y1t = cbind(Yt[1:15])    # 1970-1984
X2t = cbind(Xt[16:26]); Y2t = cbind(Yt[16:26])   # 1985-1995`},
{t:"Diagramas de dispersión por período",x:"Antes de las pruebas, el profesor compara la recta de toda la muestra con las de cada subperíodo.",r:String.raw`plot(Xt, Yt, main = "Periodo 1970 - 1995", xlab = "Ingreso", ylab = "Ahorro", pch = 8, col = "red")
abline(lm(Yt ~ Xt), lty = 2)
par(mfrow = c(1, 2))
plot(X1t, Y1t, main = "1970 - 1984", xlab = "Ingreso", ylab = "Ahorro", pch = 8, col = "red"); abline(lm(Y1t ~ X1t), lty = 2)
plot(X2t, Y2t, main = "1985 - 1995", xlab = "Ingreso", ylab = "Ahorro", pch = 8, col = "red"); abline(lm(Y2t ~ X2t), lty = 2)
par(mfrow = c(1, 1))`,o:"Si las pendientes de los dos subperíodos se ven muy distintas, hay indicio de cambio estructural."},
{t:"Modelo completo y por subperíodos",x:"Se valida el modelo con toda la muestra (incluida la normalidad) y se guardan los RSS: el de toda la muestra y el de la muestra 1.",r:String.raw`eq1 = lm(Yt ~ Xt); summary(eq1)
jarque.bera.test(resid(eq1))
(RSS = deviance(eq1))                            # muestra completa
eq1_m1 = lm(Y1t ~ X1t); (RSS1 = deviance(eq1_m1))  # muestra 1
eq1_m2 = lm(Y2t ~ X2t); (RSS2 = deviance(eq1_m2))  # muestra 2`},
{t:"Pasos 1 a 4: estimar con la muestra 1 y pronosticar la 2",x:"Se estima b₁ solo con 1970-1984, se pronostica el ahorro de 1985-1995 y se calcula el vector d de errores de pronóstico.",f:"b₁ = (X₁′X₁)⁻¹X₁′y₁,  S₁² = RSS₁/(n₁ − k),  d = y₂ − X₂b₁",r:String.raw`X1 = cbind(1, X1t); y1 = Y1t
X2 = cbind(1, X2t); y2 = Y2t
X1tX1_inv = solve(t(X1) %*% X1)
(b1 = X1tX1_inv %*% t(X1) %*% y1)
e1t = y1 - X1 %*% b1
(S12 = sum(e1t^2) / (n1 - k))
y2p = X2 %*% b1                 # pronóstico de y2
(d = y2 - y2p)`,o:"Si los errores de pronóstico d son grandes y casi todos del mismo signo, el modelo de 1970-1984 no sirve para 1985-1995."},
{t:"Paso 5: la F de la ecuación (8)",x:"H₀: hay estabilidad de parámetros. La F compara el tamaño de los errores de pronóstico con la varianza de la muestra 1.",f:"F = [d′ (I + X₂(X₁′X₁)⁻¹X₂′)⁻¹ d / n₂] / S₁²  ~  F(n₂, n₁ − k)",r:String.raw`IN2 = diag(n2)
(FC_8 = ((t(d) %*% solve(IN2 + X2 %*% X1tX1_inv %*% t(X2)) %*% d)[1] / n2) / S12)
(PV_8 = pf(FC_8, n2, n1 - k, lower.tail = FALSE))
if (PV_8 >= alpha) "Hay estabilidad de parámetros" else "Hay inestabilidad de parámetros"`},
{t:"La F de la ecuación (9)",x:"La misma prueba con los RSS: la de toda la muestra contra la de la muestra 1. Da el mismo valor que la (8).",f:"F = [(RSS − RSS₁)/n₂] / S₁²  ~  F(n₂, n₁ − k)",r:String.raw`(FC_9 = ((RSS - RSS1) / n2) / S12)
FC_8`,o:"FC_9 y FC_8 coinciden."},
{t:"Coeficientes recursivos (Ejemplo 3)",x:"Se estima el modelo con las primeras s observaciones, s = 4, …, 26, y se grafica cada b con su intervalo del 95 %. Si a partir de cierto s los coeficientes se estabilizan, no hay cambio estructural.",f:"b_s = (X_s′X_s)⁻¹X_s′y_s",r:String.raw`v_b2 = Li_b2 = Ls_b2 = numeric(n)
for (s in 4:n) {
  eq_s  = lm(Yt[1:s] ~ Xt[1:s])
  b2s   = coef(eq_s)[2]
  se_b2 = sqrt(vcov(eq_s)[2, 2])
  ta2s  = qt(0.025, df = s - k, lower.tail = FALSE)
  v_b2[s] = b2s; Li_b2[s] = b2s - ta2s * se_b2; Ls_b2[s] = b2s + ta2s * se_b2
}
plot(Li_b2[5:26], type = "l", lty = 2, col = "red3", main = "Coeficientes recursivos para Beta 2",
     ylab = "Li - b2 - Ls", xlab = "Indice", ylim = c(-0.05, 0.2))
lines(Ls_b2[5:26], lty = 2, col = "blue3"); lines(v_b2[5:26])
legend("topright", legend = c("Li", "Ls", "b2"), col = c("red3", "blue3", 1), lty = c(2, 2, 1))`,o:"La trayectoria de b₂ con sus bandas. En el notebook se hace lo mismo para b₁."},
{t:"Residuales recursivos (Ejemplo 4)",x:"Con los datos hasta t − 1 se predice Yt y se guarda el error de predicción un paso adelante vt, con bandas de ±2 errores estándar. Puntos fuera de las bandas sugieren inestabilidad. <b>Ojo:</b> en el notebook dice <code>Yt[1:t-1]</code>, que R lee como (1:t) − 1; lo claro es <code>Yt[1:(t-1)]</code>.",f:"vt = Yt − xt′b_(t−1),  SER_Vt = SER_(t−1)·√(1 + xt′(X′X)⁻¹xt)",r:String.raw`X = cbind(1, Xt)
vt = Li = Ls = numeric(n)
for (t in (k + 2):n) {
  eq_t = lm(Yt[1:(t - 1)] ~ Xt[1:(t - 1)]); s_t = summary(eq_t)
  xt = rbind(X[t, ])
  vt[t] = Yt[t] - xt %*% coef(eq_t)
  ser_vt = s_t$sigma * sqrt(1 + (xt %*% s_t$cov.unscaled %*% t(xt))[1])
  Li[t] = -2 * ser_vt; Ls[t] = 2 * ser_vt
}
plot(Li[4:n], type = "l", lty = 2, col = 2, main = "Residuales recursivos", ylab = "Li - vt - Ls", ylim = c(-80, 80))
lines(Ls[4:n], lty = 2, col = 4); lines(vt[4:n])`},
{t:"Prueba CUSUM (Ejemplo 5)",x:"Suma acumulada de los residuales recursivos escalados. Si la línea se sale de las bandas, se rechaza la estabilidad de parámetros.",f:"Wt = Σ wⱼ / σ̂,  bandas ±a√(n − k) y ±3a√(n − k), a = 0,948 al 5 %",r:String.raw`library(strucchange)
P_CUSUM = efp(Datos$Yt ~ Datos$Xt, type = "Rec-CUSUM")
sctest(P_CUSUM)
plot(P_CUSUM, main = "Prueba CUSUM")`,o:"El gráfico de la CUSUM con sus bandas al 5 % y el p-valor de la prueba."},
{t:"Chow clásico con dos grupos",x:"Cuando el quiebre separa dos grupos (o dos períodos con suficientes datos), se compara el RSS agrupado con la suma de los RSS separados. Ejemplo con los 17 trabajadores de los Ejercicios propuestos 3: ¿la ecuación de sueldo es la misma para mujeres y hombres?",f:"F = [(RSS_p − RSS₁ − RSS₂)/k] / [(RSS₁ + RSS₂)/(n − 2k)]  ~  F(k, n − 2k)",r:String.raw`sal = data.frame(
  sueldo = c(3.14, 3.32, 3.61, 1.65, 2.64, 3.64, 2.46, 1.69, 1.91, 3.10, 1.98, 2.14, 2.61, 3.60, 3.38, 3.50, 3.65),
  exper  = c(13, 16, 30, 2, 8, 31, 10, 1, 6, 15, 4, 7, 13, 27, 19, 25, 20),
  mujer  = c(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1))
mp = lm(sueldo ~ exper, data = sal)
m1 = lm(sueldo ~ exper, data = subset(sal, mujer == 0))
m2 = lm(sueldo ~ exper, data = subset(sal, mujer == 1))
RSSp = deviance(mp); RSS1 = deviance(m1); RSS2 = deviance(m2); n = 17; k = 2
(F = ((RSSp - RSS1 - RSS2) / k) / ((RSS1 + RSS2) / (n - 2 * k)))
pf(F, k, n - 2 * k, lower.tail = FALSE)
anova(mp, lm(sueldo ~ mujer * exper, data = sal))    # la misma F con dicotómicas`,o:"RSS_p = 1,2087, RSS₁ = 0,8063, RSS₂ = 0,3261; F = 0,438 con p-valor 0,655: no hay cambio estructural entre mujeres y hombres."}];

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
{t:"VIF a mano",x:"Se regresa cada xⱼ contra las demás. Si las otras la explican casi toda (R²ⱼ cerca de 1), su varianza se infla.",f:"VIFⱼ = 1 / (1 − R²ⱼ),  Var(β̂ⱼ) = σ² / [TSSⱼ(1 − R²ⱼ)]",r:String.raw`R2j <- summary(lm(sqrft ~ lotsize + bdrms, data = hprice1))$r.squared
1 / (1 - R2j)
vif(m)`,o:"VIF(sqrft) = 1,42: no hay multicolinealidad preocupante (la regla usual alerta desde 10)."},
{t:"Colinealidad perfecta",x:"Si una variable es combinación exacta de otras, R deja el coeficiente en NA.",r:String.raw`hprice1$area_total <- hprice1$sqrft + 2 * hprice1$bdrms
coef(lm(price ~ sqrft + bdrms + area_total, data = hprice1))`,o:"area_total sale NA."}];

RM["especificacion"]=[
{t:"Datos",x:"Demanda de TV del Ejemplo 1: el modelo completo tiene precio y publicidad.",r:String.raw`${TVLOAD}
library(lmtest)
largo = lm(Yt ~ X2t + X3t)`},
{t:"Sesgo por variable omitida",x:"Si se omite X3t y está correlacionada con X2t, el coeficiente de X2t absorbe parte de su efecto. En la muestra se cumple exactamente la descomposición de abajo, con d̃ de regresar X3t contra X2t.",f:"b̃₂ = b₂ + b₃·d̃",r:String.raw`corto = lm(Yt ~ X2t)
d = coef(lm(X3t ~ X2t))["X2t"]
c(corto = coef(corto)["X2t"],
  formula = coef(largo)["X2t"] + coef(largo)["X3t"] * d)`,o:"Los dos valores son idénticos: −0,006410. Como la publicidad se correlaciona negativamente con el precio (d̃ = −0,081), omitirla exagera el efecto del precio (−0,005994 en el modelo completo)."},
{t:"Variables irrelevantes",x:"Incluir una variable que no importa no sesga, pero puede aumentar los errores estándar.",r:String.raw`set.seed(1); ruido = rnorm(n)
coef(summary(lm(Yt ~ X2t + X3t + ruido)))[c("X2t", "ruido"), ]`,o:"El coeficiente del precio casi no cambia (−0,005999) y el de ruido no es significativo (p = 0,47)."},
{t:"Prueba RESET de Ramsey a mano",x:"Si potencias de Yt estimado ayudan a explicar Yt, falta algo de forma funcional.",f:"Yt = Xβ + γ₁Ŷt² + γ₂Ŷt³ + e,  H₀: γ₁ = γ₂ = 0 (prueba F)",r:String.raw`yh2 = fitted(largo)^2; yh3 = fitted(largo)^3
mr = lm(Yt ~ X2t + X3t + yh2 + yh3)
anova(largo, mr)
resettest(largo, power = 2:3, type = "fitted")`,o:"Las dos dan F = 5,61 (p = 0,0068): se rechaza la forma lineal; vale la pena probar el modelo en logaritmos del Ejemplo 2."},
{t:"Comparar modelos: AIC y SC",x:"Con la misma variable dependiente, se prefiere el de menor AIC o SC (BIC en R).",r:String.raw`m2 = lm(Yt ~ X2t + I(X2t^2) + X3t)
AIC(largo, m2); BIC(largo, m2)`,o:"AIC −32,34 contra −30,77 y SC −24,86 contra −21,41: gana el modelo sin el precio al cuadrado."},
{t:"Error de medición en X: atenuación",x:"Si la regresora se mide con error aleatorio, su coeficiente se acerca a cero.",r:String.raw`set.seed(2)
X2_mal = X2t + rnorm(n, sd = 100)
c(bien = coef(lm(Yt ~ X2t))["X2t"],
  con_error = coef(lm(Yt ~ X2_mal))["X2_mal"])`,o:"El coeficiente pasa de −0,0064 a −0,0044: el error de medición lo atenúa hacia cero."}];

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

// ---------- bases del curso (las del profesor), detectadas por el nombre del archivo o el código
const PBASES={
 tv:{re:/Datos_Ejemplo_1_Demanda_TV/,arch:"Datos_Ejemplo_1_Demanda_TV_Precio_Pub.xls",t:"Ejemplo 1 · Demanda mensual de televisores",d:"Base de los Ejemplos 1 a 5 del capítulo 1. Son 50 meses: los 48 primeros tienen demanda y se usan para estimar; los meses 49 y 50 solo traen precio y publicidad y se usan para pronosticar.",
  v:{Mes:"Número del mes (1 a 50)",Yt:"Demanda mensual de televisores: la variable dependiente",X2t:"Precio de los televisores",X3t:"Inversión en publicidad"},code:TV_DF},
 sal:{re:/sueldo = c\(/,t:"Ejercicios propuestos 3, punto 5 · Sueldos por sexo",d:"17 trabajadores (corte transversal). Los datos van escritos en el mismo código.",v:{sueldo:"Sueldo del trabajador",exper:"Años de experiencia",mujer:"1 si es mujer, 0 si es hombre"}},
 ahorro:{re:/Ingreso_Ahorro/,arch:"Datos_Ejem2_Ingreso_Ahorro_2026_2.xls",t:"Capítulo 2, Ejemplo 2 · Ahorro e ingreso, 1970-1995",d:"Serie anual de 26 años. Es la base de los Ejemplos 2 a 5 del capítulo 2 (Chow, coeficientes y residuales recursivos, CUSUM). El Excel está en el Classroom del curso.",v:{date:"Año (1970 a 1995)",Yt:"Ahorro personal: la variable dependiente",Xt:"Ingreso personal disponible"}},
 estac:{re:/Datos_Ejemplo_9_Estac/,arch:"Datos_Ejemplo_9_Estac.xls",t:"Ejemplo 9 · Ventas trimestrales, 1978-1985",d:"32 trimestres de ventas para estudiar la estacionalidad con dicotómicas. El Excel está en el Classroom del curso.",v:{y:"Ventas del trimestre"}}};
// ---------- diccionario de las bases del paquete wooldridge que usa el manual
const BASES={
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
const pBox=code=>Object.values(PBASES).filter(B=>B.re.test(code)).map(B=>{const row=v=>`<tr><td><code>${v}</code></td><td>${B.v[v]}</td></tr>`;
    return `<div class="basebox"><p class="lbl" style="margin:0 0 4px">Base de datos de esta lección</p><p style="margin:0"><b>${B.t}</b>${B.arch?` · archivo <code style="word-break:break-all">${B.arch}</code>`:""}. ${B.d}</p>
    <div class="tbl"><table><tr><th>Variable</th><th>Qué es</th></tr>${Object.keys(B.v).map(row).join("")}</table></div>
    ${B.code?`<details class="dp-lite"><summary>¿No tienes el Excel? Crea la misma tabla en R</summary><p class="hint" style="margin:4px 0">Pega este bloque en lugar de las líneas <code>setwd()</code> y <code>read_excel()</code>; lo demás queda igual.</p><div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(B.code)}</pre></div></details>`:""}</div>`}).join("");
  const basesBox=steps=>{const code=steps.map(s=>s.r).join("\n"),pb=pBox(code),ds=[...new Set([...code.matchAll(/data\("(\w+)"/g)].map(m=>m[1]))].filter(d=>BASES[d]);if(!ds.length)return pb;
  return ds.map(d=>{const B=BASES[d],used=Object.keys(B.v).filter(v=>new RegExp("\\b"+v+"\\b").test(code)),rest=Object.keys(B.v).filter(v=>!used.includes(v));
    const row=v=>`<tr><td><code>${v}</code></td><td>${B.v[v]}</td></tr>`;
    return `<div class="basebox"><p class="lbl" style="margin:0 0 4px">Base de datos de esta lección</p><p style="margin:0"><code>${d}</code> · <b>${B.t}</b>. ${B.d}</p>
    ${used.length?`<div class="tbl"><table><tr><th>Variable</th><th>Qué es</th></tr>${used.map(row).join("")}</table></div>`:""}
    ${rest.length?`<details class="dp-lite"><summary>Las demás variables de ${d}</summary><div class="tbl"><table>${rest.map(row).join("")}</table></div></details>`:""}
    <p class="hint" style="margin:6px 0 0">Los nombres están en inglés porque así vienen en el libro de Wooldridge. En R puedes verlos con <code>names(${d})</code> y la documentación completa con <code>?${d}</code>.</p></div>`}).join("")+pb};
  const block=(id,steps)=>{const all=steps.filter(s=>!s.no).map(s=>"# "+s.t+"\n"+s.r).join("\n\n");
    return `<section class="rman"><h3>Manual en R: fórmula | código</h3><p class="hint">Cada paso tiene a la izquierda la idea y la fórmula, y a la derecha el mismo cálculo en R. Copia los bloques en orden en un script de RStudio${id==="r-cero"?"":" (si es tu primera vez, empieza por la estación «R desde cero»)"}.</p>
    ${basesBox(steps)}
    <ol class="rm">${steps.map(s=>`<li><div class="rm-x"><b>${s.t}</b><p>${s.x}</p>${s.f?`<div class="eq">${s.f}</div>`:""}</div><div class="rm-r"><span class="lbl">Código R</span><div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(s.r)}</pre></div>${s.o?`<p class="rm-o"><b>Verás:</b> ${s.o}</p>`:""}</div></li>`).join("")}</ol>
    <div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">Script</span><span>Todo el código de esta lección en un solo bloque</span><span class="chev">›</span></button><div class="dpb"><div><div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(all)}</pre></div></div></div></div></section>`};
  TRUNK.unshift({id:"r-cero",t:"R desde cero: instalar, objetos y datos",nuevo:true,html:`<section><h3>La idea</h3><p class="lead">Esta estación es el paso 0 del manual. Aquí instalas R, aprendes a crear objetos y variables, a cargar una base de datos y a mirarla. Después, en cada lección, cada explicación viene con su fórmula y su equivalente en código R.</p>
  <ul><li>Trabaja siempre en un <b>script</b> (.R), no directo en la consola: así guardas lo que hiciste.</li><li>Ejecuta línea por línea con Ctrl + Enter y lee lo que sale antes de seguir.</li><li>Los ejemplos de las estaciones del curso usan las bases y el código R del profesor (demanda de TV, ahorro e ingreso, ventas trimestrales), con su misma notación: b, TSS, ESS, RSS, S² y las ecuaciones numeradas. Si usas el mismo Excel, tus resultados salen iguales a los de la página. Las estaciones avanzadas usan las bases del libro de Wooldridge.</li></ul></section>`,
    qs:[{q:"¿Cuál es la diferencia entre install.packages() y library()?",a:"install.packages() descarga e instala el paquete en tu computador, una sola vez. library() lo carga en la sesión actual, cada vez que abres R."},
      {q:"¿Por qué falla 3,5 + 1 en R?",a:"Porque en R el separador decimal es el punto. La coma separa argumentos de una función. Se escribe 3.5 + 1."}]});
  BRANCHES.unshift({g:"Bases de datos del manual",from:"r-cero",items:[{id:"bases-wooldridge",t:"Las bases del curso y sus variables",nuevo:true,html:`<section><h3>De dónde salen los datos</h3><p class="lead">Las estaciones del curso (de «Variables» a «Cambio estructural») usan las bases del profesor y el mismo código de sus notebooks de R: así lo que ves aquí es lo que piden la clase y el parcial.</p>
  <p>Cada base es un Excel que se lee con <code>read_excel()</code> del paquete <code>readxl</code>, después de fijar la carpeta de trabajo con <code>setwd()</code>. Luego <code>Datos</code> es una tabla (data frame) y cada columna se llama con <code>$</code>: <code>Datos$Yt</code> es la columna Yt.</p>
  <p class="warn"><b>Notación del profesor:</b> el intercepto es β₁ y las pendientes β₂, β₃…; X2t y X3t son la segunda y tercera columna de X (la primera son los unos). Las sumas de cuadrados se llaman TSS, ESS y RSS, la varianza estimada S² = RSS/(n − k) y las pruebas se citan por su número de ecuación: F (56), F (58), t (59), F (60), F (61), F (64) en el capítulo 1 y F (8), F (9) en el capítulo 2.</p></section>
  ${Object.values(PBASES).map(B=>`<section><h3>${B.t}</h3><p>${B.arch?`Archivo <code style="word-break:break-all">${B.arch}</code>. `:""}${B.d}</p><div class="tbl"><table><tr><th>Variable</th><th>Qué es</th></tr>${Object.entries(B.v).map(([v,t])=>`<tr><td><code>${v}</code></td><td>${t}</td></tr>`).join("")}</table></div>${B.code?`<details class="dp-lite"><summary>Los 50 meses en código R (por si no tienes el Excel)</summary><div><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(B.code)}</pre></div></details>`:""}</section>`).join("")}
  <section><h3>Las bases de las estaciones avanzadas (Wooldridge)</h3><p>Heterocedasticidad, autocorrelación, multicolinealidad, variables instrumentales, ecuaciones simultáneas, elección discreta, panel y series usan las bases del libro <i>Introducción a la econometría</i> de Jeffrey Wooldridge, que vienen en el paquete <code>wooldridge</code>: se cargan con <code>data("hprice1", package = "wooldridge")</code> y no hay que descargar nada. Sus nombres están en inglés porque así vienen en el libro (<code>wage</code> es salario, <code>price</code> precio).</p></section>
  ${Object.entries(BASES).map(([d,B])=>`<section><h3><code>${d}</code> · ${B.t}</h3><p>${B.d}</p><div class="tbl"><table><tr><th>Variable</th><th>Qué es</th></tr>${Object.entries(B.v).map(([v,t])=>`<tr><td><code>${v}</code></td><td>${t}</td></tr>`).join("")}</table></div></section>`).join("")}`}]});
  BRANCHES.unshift({g:"Fórmulas del curso",from:"inferencia",items:[{id:"formulas-p1",t:"Fórmulas del parcial 1 (notación del profesor)",nuevo:true,html:`<section><h3>Para qué sirve</h3><p class="lead">Es la hoja «Fórmulas para el parcial 1» del profesor, ordenada por tema y con el número de ecuación que él usa en clase y en sus notebooks de R. Úsala como mapa: cada bloque dice en qué estación está el desarrollo.</p></section>
  <section><h3>1. El modelo de k variables</h3>
  <div class="eq">Yt = β₁ + β₂X2t + β₃X3t + … + βkXkt + μt &nbsp;&nbsp;⇔&nbsp;&nbsp; y = Xβ + μ<span class="note">Regresión poblacional. β₁ es el intercepto y k cuenta el intercepto</span></div>
  <div class="eq">y = Xb + e = ŷ + e, &nbsp; ŷ = Xb<span class="note">Regresión muestral</span></div>
  <div class="eq">(X′X)b = X′y &nbsp;&nbsp;⇒&nbsp;&nbsp; b = (X′X)⁻¹X′y<span class="note">Ecuaciones normales y estimador OLS (MCO)</span></div>
  <p>Estación: <a href="#mco-matricial">Regresión múltiple en forma matricial</a>.</p></section>
  <section><h3>2. Modelo en desviaciones a la media</h3>
  <div class="eq">y* = X*b₂ + e, &nbsp; y* = Ay, &nbsp; X* = AX₂, &nbsp; A = Iₙ − (1/n)ii′</div>
  <div class="eq">b₂ = (X*′X*)⁻¹X*′y* &nbsp;&nbsp;&nbsp; b₁ = Ȳ − b₂X̄₂ − b₃X̄₃ − … − bkX̄k</div></section>
  <section><h3>3. Sumas de cuadrados y R²</h3>
  <div class="eq">TSS = Σ(Yt − Ȳ)² = y′y − nȲ²</div>
  <div class="eq">ESS = b′X′Xb − nȲ² = b₂′X*′X*b₂ &nbsp;&nbsp;&nbsp; RSS = e′e = Σet²</div>
  <div class="eq">TSS = ESS + RSS &nbsp;&nbsp;&nbsp; R² = ESS/TSS<span class="note">Ecuación (16) en los notebooks</span></div></section>
  <section><h3>4. Supuestos, media y varianza de b</h3>
  <ul><li>X es no estocástica y de rango completo; β es constante.</li><li>μ ~ N(0, σ²Iₙ): E(μ) = 0 y var(μ) = σ²Iₙ.</li></ul>
  <div class="eq">E(b) = β &nbsp;&nbsp;&nbsp; var(b) = σ²(X′X)⁻¹ = σ²(cᵢⱼ) &nbsp;&nbsp;&nbsp; b ~ N(β; σ²(X′X)⁻¹)</div>
  <div class="eq">S² = RSS/(n − k) &nbsp;&nbsp;&nbsp; S²bⱼ = S²·cⱼⱼ &nbsp;&nbsp;&nbsp; cov(bᵢ, bⱼ) = S²·cᵢⱼ<span class="note">cᵢⱼ es el elemento (i, j) de (X′X)⁻¹</span></div>
  <p>Estaciones: <a href="#supuestos">Supuestos</a> e <a href="#inferencia">Inferencia</a>.</p></section>
  <section><h3>5. Pruebas de hipótesis: H₀: Rβ = r</h3>
  <div class="tbl"><table><tr><th>Ecuación</th><th>Para qué</th><th>Estadístico</th><th>Distribución</th></tr>
  <tr><td><b>F (56)</b></td><td>General: q restricciones lineales</td><td>[(Rb − r)′[R(X′X)⁻¹R′]⁻¹(Rb − r)/q] / [e′e/(n − k)]</td><td>F(q, n − k)</td></tr>
  <tr><td><b>F (58)</b></td><td>Significancia individual, H₀: βⱼ = 0</td><td>bⱼ² / (S²cⱼⱼ)</td><td>F(1, n − k)</td></tr>
  <tr><td><b>t (59)</b></td><td>Lo mismo con t; p-valor = 2·P(t &gt; |tc|)</td><td>bⱼ / se(bⱼ)</td><td>t(n − k)</td></tr>
  <tr><td><b>F (60)</b></td><td>Una restricción lineal: a₁β₁ + … + akβk = a</td><td>(a₁b₁ + … + akbk − a)² / var(a₁b₁ + … + akbk)</td><td>F(1, n − k)</td></tr>
  <tr><td><b>F (61)</b></td><td>Significancia de la regresión: β₂ = … = βk = 0</td><td>[ESS/(k − 1)] / [RSS/(n − k)] = [R²/(k − 1)] / [(1 − R²)/(n − k)]</td><td>F(k − 1, n − k)</td></tr>
  <tr><td><b>F (64)</b></td><td>Restringido contra no restringido</td><td>[(RSS_R − RSS_NR)/q] / [RSS_NR/(n − k)]</td><td>F(q, n − k)</td></tr></table></div>
  <div class="eq">bⱼ − se(bⱼ)·t(α/2; n − k) ≤ βⱼ ≤ bⱼ + se(bⱼ)·t(α/2; n − k)<span class="note">Intervalo de confianza del 100(1 − α) %</span></div>
  <p class="warn"><b>Decisión con el p-valor:</b> p-valor = P(F &gt; Fc). Se rechaza H₀ si el p-valor es menor que α. En R: <code>pf(Fc, df1 = q, df2 = n - k, lower.tail = F)</code> y, para la t, <code>2*pt(abs(tc), df = n - k, lower.tail = F)</code>.</p>
  <p>Estación: <a href="#inferencia">Inferencia: pruebas t y F</a>, con cada prueba calculada en R sobre la demanda de TV. Ejercicios resueltos: <a href="#tl-p1">Asesoría del parcial 1 y Taller 2</a>.</p></section>
  <section><h3>6. Mínimos cuadrados restringidos</h3>
  <div class="eq">b_R = b + (X′X)⁻¹R′[R(X′X)⁻¹R′]⁻¹(r − Rb)</div>
  <div class="eq">ŷ_R = Xb_R &nbsp;&nbsp;&nbsp; e_R = y − Xb_R &nbsp;&nbsp;&nbsp; RSS_R = e_R′e_R</div>
  <div class="eq">ESS_R = b_R′X′Xb_R − nȲ² + 2ŷ_R′e_R &nbsp;&nbsp;&nbsp; TSS = y′y − nȲ²</div></section>
  <section><h3>7. Regresión lineal simple</h3>
  <div class="eq">Yt = β₁ + β₂Xt + μt, &nbsp; μt ~ N(0, σ²)</div>
  <div class="eq">b₂ = S_XY / S_XX = Σ(Xt − X̄)(Yt − Ȳ) / Σ(Xt − X̄)² &nbsp;&nbsp;&nbsp; b₁ = Ȳ − b₂X̄</div>
  <div class="eq">S_XX = Σ(Xt − X̄)² = ΣXt² − nX̄² = (n − 1)S²_X</div>
  <div class="eq">var(b₂) = σ²/S_XX &nbsp;&nbsp;&nbsp; var(b₁) = σ²ΣXt² / (n·S_XX)</div>
  <div class="eq">ESS = b₂²·S_XX &nbsp;&nbsp;&nbsp; R² = b₂²·S_XX / S_YY &nbsp;&nbsp;&nbsp; S² = RSS/(n − 2)</div>
  <div class="eq">S²b₂ = S²/S_XX &nbsp;&nbsp;&nbsp; S²b₁ = S²ΣXt² / (n·S_XX)</div>
  <p>Estación: <a href="#mco-simple">Regresión simple por MCO</a>.</p></section>
  <section><h3>8. Capítulo 2: cambio estructural</h3>
  <div class="tbl"><table><tr><th>Ecuación</th><th>Para qué</th><th>Estadístico</th></tr>
  <tr><td><b>F (8)</b></td><td>Pronósticos de Chow</td><td>[d′(I + X₂(X₁′X₁)⁻¹X₂′)⁻¹d / n₂] / S₁² ~ F(n₂, n₁ − k), con d = y₂ − X₂b₁</td></tr>
  <tr><td><b>F (9)</b></td><td>La misma con las RSS</td><td>[(RSS − RSS₁)/n₂] / S₁²</td></tr>
  <tr><td><b>(11)-(12)</b></td><td>Coeficientes recursivos</td><td>b_s = (X_s′X_s)⁻¹X_s′y_s y var(b_s) = S_s²(X_s′X_s)⁻¹, s = k + 1, …, n</td></tr>
  <tr><td><b>(14)-(17)</b></td><td>Errores de predicción un paso adelante</td><td>vt = Yt − xt′b_(t−1); bandas 0 ± 2·SER_(t−1)·√(1 + xt′(X′X)⁻¹xt)</td></tr>
  <tr><td><b>(21)-(22)</b></td><td>CUSUM</td><td>Wt = Σwⱼ/σ̂; bandas por (k, ±a√(n − k)) y (n, ±3a√(n − k)), con a = 0,948 al 5 %, 1,143 al 1 % y 0,85 al 10 %</td></tr></table></div>
  <p>Estaciones: <a href="#chow">Cambio estructural y prueba de Chow</a>, <a href="#ce-pronosticos">Prueba de pronósticos de Chow</a> y <a href="#ce-recursivos">Coeficientes recursivos, errores un paso adelante y CUSUM</a>.</p></section>`}]});
  const all=[...TRUNK,...BRANCHES.flatMap(g=>g.items)];
  for(const s of all)if(RM[s.id])s.html+=block(s.id,RM[s.id]);
})();


// =====================================================================
// CAMBIO ESTRUCTURAL A FONDO: solo teoría. Los ejercicios viven en eco/talleres.js y
// cada lección muestra sola los puntos de su tema (bloque «En los talleres»).
// =====================================================================
BRANCHES.push({g:"Cambio estructural a fondo", from:"chow", items:[
{id:"ce-metodo", t:"Cómo reconocer qué prueba pide un ejercicio", html:String.raw`
<section><h3>Primero: ¿qué te da el enunciado?</h3>
<p class="lead">Todos los ejercicios de cambio estructural se resuelven con la misma prueba F; lo que cambia es cómo se obtienen las RSS. Mira qué trae el enunciado y usa la herramienta que corresponde.</p>
<div class="tbl"><table><tr><th>El ejercicio da…</th><th>Qué haces</th><th>Herramienta</th></tr>
<tr><td>La tabla de datos o un archivo</td><td>Estimas el restringido, cada submuestra y el modelo con dummies</td><td><button class="btn" type="button" data-go="t-datos">Laboratorio de datos</button></td></tr>
<tr><td>X′X, X′y y y′y</td><td>b = (X′X)⁻¹X′y y RSS = y′y − b′X′y en cada muestra; para el restringido se suman las matrices</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · X′X, X′y, y′y</td></tr>
<tr><td>Las RSS, o s, o R² con la STC</td><td>RSS = s²(n − k) o (1 − R²)·STC, y la F con m submuestras</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · RSS, s o R²</td></tr>
<tr><td>Un modelo con dummies ya estimado</td><td>Escribes una ecuación por grupo, interpretas los δ y haces las pruebas t</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · Modelo estimado</td></tr>
<tr><td>Un modelo restringido y uno no restringido</td><td>W, LR y LM con las dos RSS</td><td><button class="btn" type="button" data-go="t-calc">Calculadora</button> · Wald, LR y LM</td></tr>
<tr><td>Solo hay que plantear, interpretar o demostrar</td><td>Defines la dummy, escribes la ecuación de cada grupo o desarrollas el álgebra</td><td>Lápiz y papel; mira el punto parecido del taller</td></tr></table></div></section>
<section><h3>Las fórmulas que usa el curso</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>Estadístico</th><th>Distribución</th></tr>
<tr><td>Chow (dos submuestras)</td><td>\(F=\dfrac{(RSS_R-RSS_1-RSS_2)/k}{(RSS_1+RSS_2)/(n-2k)}\)</td><td>\(F(k,\,n-2k)\)</td></tr>
<tr><td>Chow con m submuestras</td><td>\(F=\dfrac{(RSS_R-\sum RSS_j)/[(m-1)k]}{\sum RSS_j/(n-mk)}\)</td><td>\(F((m-1)k,\,n-mk)\)</td></tr>
<tr><td>Pronósticos de Chow</td><td>\(F=\dfrac{(RSS_R-RSS_1)/n_2}{RSS_1/(n_1-k)}\)</td><td>\(F(n_2,\,n_1-k)\)</td></tr>
<tr><td>Con R² (misma Y)</td><td>\(F=\dfrac{(R^2_{NR}-R^2_R)/q}{(1-R^2_{NR})/(n-k_{NR})}\)</td><td>\(F(q,\,n-k_{NR})\)</td></tr>
<tr><td>Forma matricial</td><td>\(F=\dfrac{(R\mathbf b-\mathbf r)'[R(X'X)^{-1}R']^{-1}(R\mathbf b-\mathbf r)}{q\,s^2}\)</td><td>\(F(q,\,n-k_{NR})\)</td></tr></table></div>
<p class="warn"><b>k cuenta el intercepto.</b> En un modelo simple k = 2, así que con dos submuestras los grados de libertad son (2, n − 4).</p></section>
<section><h3>La redacción que piden</h3>
<ol class="steps"><li><b>Modelo no restringido</b> (con dummies o una ecuación por submuestra) y <b>restringido</b> (una sola ecuación).</li><li><b>Hipótesis:</b> H₀: δ₁ = δ₂ = 0 (no hay cambio estructural) frente a H₁: algún δ ≠ 0.</li><li><b>Estadístico</b> con los números sustituidos y su distribución.</li><li><b>Valor crítico</b> o p-valor al nivel pedido.</li><li><b>Decisión y lectura económica:</b> qué significa que la función cambie (o no) entre periodos o grupos.</li></ol></section>`},
{id:"ce-pronosticos", t:"Prueba de pronósticos de Chow", html:String.raw`
<section><h3>Cuándo se usa</h3>
<p class="lead">Cuando la segunda submuestra es muy pequeña para estimarla por separado (n₂ ≤ k), o cuando la pregunta es si el modelo estimado con los datos anteriores <b>pronostica bien</b> los posteriores.</p></section>
<section><h3>La idea</h3>
<p>Se estima el modelo solo con la muestra 1, \(\mathbf b_1=(X_1'X_1)^{-1}X_1'\mathbf y_1\), y se pronostica la muestra 2 con esos coeficientes. El vector de errores de pronóstico es \(\mathbf d=\mathbf y_2-X_2\mathbf b_1\). Si los parámetros no cambiaron, d tiene media cero y varianza \(\sigma^2[I+X_2(X_1'X_1)^{-1}X_2']\): errores grandes indican cambio.</p></section>
<section><h3>Las dos formas del estadístico</h3>
<div class="mj">\[(8)\quad F=\frac{(RSS_R-RSS_1)/n_2}{RSS_1/(n_1-k)}\qquad\qquad(9)\quad F=\frac{\mathbf d'\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]^{-1}\mathbf d}{n_2\,s_1^2}\]</div>
<p>Las dos se distribuyen \(F(n_2,\,n_1-k)\) y dan el mismo número. La (8) solo necesita dos regresiones: toda la muestra y la muestra 1. La (9) muestra de dónde sale la prueba y con n₂ = 1 se reduce a \(d^2/\{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]\}\).</p>
<p class="link">El ejemplo resuelto de abajo es la demostración de la media y la varianza de d (punto 1 de los Ejercicios propuestos 3).</p></section>`},
{id:"ce-recursivos", t:"Coeficientes recursivos, errores un paso adelante y CUSUM", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">En vez de escoger un punto de quiebre, se estima el modelo una y otra vez agregando una observación cada vez: con las primeras k + 1, luego k + 2, y así hasta n. Si los coeficientes cambian, se nota en la trayectoria.</p></section>
<section><h3>Los tres gráficos</h3>
<ol class="steps"><li><b>Coeficientes recursivos:</b> \(\mathbf b_t=(X_t'X_t)^{-1}X_t'\mathbf y_t\) con las primeras t observaciones, con bandas de ±2 errores estándar. Un salto fuera de la banda indica cambio.</li>
<li><b>Errores de predicción un paso adelante:</b> \(e_{t+1}=y_{t+1}-\mathbf x_{t+1}'\mathbf b_t\), con varianza \(\sigma^2[1+\mathbf x_{t+1}'(X_t'X_t)^{-1}\mathbf x_{t+1}]\). Si un error queda fuera de ±2 desviaciones, el modelo no anticipó esa observación.</li>
<li><b>Residuos recursivos y CUSUM:</b> \(w_t=e_t/\sqrt{1+\mathbf x_t'(X_{t-1}'X_{t-1})^{-1}\mathbf x_t}\). La suma acumulada \(W_t=\sum w_j/\hat\sigma\) debe quedar dentro de las bandas \(\pm0{,}948\sqrt{T}\,(1+2t/T)\) al 5 %.</li></ol>
<p>El <button class="btn" type="button" data-go="t-datos">Laboratorio de datos</button> dibuja los tres gráficos con tu base (sección 4, Recursivos).</p></section>
<section><h3>En R</h3>
<pre class="ce-code">library(readxl); library(strucchange)
datos &lt;- read_excel("mis_datos.xlsx")   # o read.csv("mis_datos.csv")
m &lt;- lm(Y ~ X, data = datos)
n &lt;- nrow(datos); k &lt;- 2
# coeficientes recursivos con bandas de ±2 errores estándar
b  &lt;- t(sapply((k + 1):n, function(t) coef(lm(Y ~ X, data = datos[1:t, ]))))
se &lt;- t(sapply((k + 1):n, function(t) coef(summary(lm(Y ~ X, data = datos[1:t, ])))[, 2]))
plot((k + 1):n, b[, 2], type = "b", ylim = range(b[, 2] - 2 * se[, 2], b[, 2] + 2 * se[, 2]))
lines((k + 1):n, b[, 2] + 2 * se[, 2], lty = 2); lines((k + 1):n, b[, 2] - 2 * se[, 2], lty = 2)
rr &lt;- recresid(m)                                   # residuos recursivos
plot(efp(Y ~ X, data = datos, type = "Rec-CUSUM"))    # CUSUM con bandas
sctest(efp(Y ~ X, data = datos, type = "Rec-CUSUM"))</pre></section>`},
{id:"ce-dummies", t:"Forma matricial del cambio estructural y ecuaciones (27) y (28)", html:String.raw`
<section><h3>El modelo con dummies en matrices</h3>
<p>Con \(D_t=0\) en las primeras \(n_1\) observaciones y 1 en las demás, el modelo no restringido \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\mu_t\) en bloques es</p>
<div class="mj">\[\mathbf y=\begin{bmatrix}X_1&\mathbf 0\\X_2&X_2\end{bmatrix}\begin{bmatrix}\boldsymbol\beta\\ \boldsymbol\delta\end{bmatrix}+\boldsymbol\mu,\qquad H_0:\boldsymbol\delta=\mathbf 0\iff R=[\,0_{k\times k}\;|\;I_k\,],\;\mathbf r=\mathbf 0\]</div>
<p>Solo intercepto: R escoge δ₁ (q = 1). Solo pendientes: R escoge δ₂, …, δ_k (q = k − 1). Los puntos 9 a 11 de los Ejercicios propuestos 3 piden escribir esto con todos los elementos.</p></section>
<section><h3>Por qué RSS_NR = RSS₁ + RSS₂ (ecuaciones 27 y 28)</h3>
<p>El modelo con todas las interacciones permite un intercepto y unas pendientes distintos en cada grupo: para D = 0 la ecuación es \(\beta_1+\beta_2X\) y para D = 1 es \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\). Como ningún parámetro se comparte, minimizar la RSS total equivale a minimizar por separado la de cada grupo. Por eso los β son los de la regresión del grupo 1 (27), los β + δ los del grupo 2, y la RSS es la suma (28).</p>
<p>En matrices: \(X'X=\begin{bmatrix}X_1'X_1+X_2'X_2&X_2'X_2\\X_2'X_2&X_2'X_2\end{bmatrix}\). Al resolver las ecuaciones normales se obtiene \(\mathbf b_\beta=(X_1'X_1)^{-1}X_1'\mathbf y_1\) y \(\mathbf b_\beta+\mathbf b_\delta=(X_2'X_2)^{-1}X_2'\mathbf y_2\).</p></section>`}]});

// ---------- Herramientas: dos para resolver y tres para entender
WORKSHOPS.push({id:"t-datos",t:"Laboratorio de datos",anchor:"mco-matricial",links:["datos","mco-matricial","inferencia","chow","hetero","autocorr"],sim:"datos",html:`<div class="sim" id="sim"></div>`,d:""});
WORKSHOPS.splice(0,WORKSHOPS.length,...(function(){
  const by=id=>WORKSHOPS.find(w=>w.id===id), out=[];
  const calc=Object.assign(by("t-calc"),{t:"Calculadora de ejercicios",anchor:"chow",sim:"calc",html:`<div class="sim" id="sim"></div>`,
    links:["inferencia","chow","ce-metodo","ce-pronosticos","dicotomicas"],
    d:"Para los enunciados que no traen la tabla de datos sino resultados: matrices X′X, X′y y y′y, sumas de cuadrados, s o R², un modelo con dummies ya estimado, o un modelo restringido y otro no restringido. Da el procedimiento completo con los números sustituidos, el valor crítico, el p-valor y la decisión: Chow con dos o más submuestras, pronósticos de Chow, pruebas t de dummies, Wald, LR y LM, F general, igualdad de varianzas, Breusch-Pagan y Durbin-Watson."});
  out.push(by("t-datos"),calc);
  ["t-matrices","t-geometria","t-plano"].forEach(id=>{const w=by(id);if(w){w.grp="ver";out.push(w)}});
  return out})());
Object.assign(WORKSHOPS.find(w=>w.id==="t-datos"),{t:"Laboratorio de datos",
  d:"Para los ejercicios que traen una tabla de datos o un archivo (CSV o Excel). Estadísticas y correlaciones, variables nuevas (logaritmos, rezagos, dummies de quiebre, interacciones), MCO con errores robustos y pronóstico con intervalos, y pruebas: F, Chow por fila o por grupo con todas sus alternativas y los pronósticos de Chow, coeficientes recursivos y CUSUM, heterocedasticidad, autocorrelación, normalidad, RESET y VIF. También las demostraciones con tus números y el código R. Trae cargadas las bases de los talleres, y los datos no salen de tu navegador."});
// Enlaces viejos que apuntaban a lo que se reorganizó
const ALIAS={"t-cambio":"t-calc","ce-resueltos":"tl-ep3","ce-interpretar":"tl-ep3","tl-t1":"tl-ep3"};


// =====================================================================
// TALLERES DE ECONOMETRÍA I (prof. Sergio Iván Restrepo): cada punto se escribe una sola vez aquí.
// La página del taller lo muestra completo y cada lección de la teoría lista los puntos de su tema
// (campo temas) y muestra como ejemplo resuelto el punto cuyo campo ej es esa lección.
// Notación del curso: β₁ es el intercepto y k cuenta el intercepto.
// =====================================================================
const TALLERES=[];
TALLERES.push({id:"tl-ep3", t:"Ejercicios propuestos 3", sub:"Cambio estructural y variables dicótomas", anchor:"chow",
intro:`Los 16 puntos del taller con la solución completa. Cada uno trae <b>lo que necesitas saber</b> (propiedades y fórmulas), el <b>paso a paso</b> con los números sustituidos y una <b>respuesta</b> lista para el informe. Los números se verificaron en R.`,
puntos:[
{id:"ep3-1", n:"1", t:"Prueba de pronósticos de Chow: media y varianza del error de pronóstico", tipo:"Demostración", temas:["ce-pronosticos","supuestos"], ej:"ce-pronosticos",
enun:String.raw`<p>En la prueba de pronósticos de Chow el vector de errores de pronóstico viene dado como</p>
<div class="mj">\[\mathbf d=\mathbf y_2-\hat{\mathbf y}_2=X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\]</div>
<p>donde \(\hat{\mathbf y}_2=X_2\mathbf b_1\), con \(\mathbf b_1=(X_1'X_1)^{-1}X_1'\mathbf y_1\sim N\!\left(\boldsymbol\beta,\sigma^2(X_1'X_1)^{-1}\right)\), y \(\mathbf y_2=X_2\boldsymbol\beta+\boldsymbol\mu_2\), con \(\boldsymbol\mu_2\sim N(\mathbf 0,\sigma^2I_{n_2})\). Muestre que <b>a)</b> \(E(\mathbf d)=\mathbf 0_{n_2\times1}\) y <b>b)</b> \(\operatorname{var}(\mathbf d)=\sigma^2\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]\).</p>
<div class="warn"><b>¿Está bien planteado «d = y₂ − ŷ₂»?</b> Sí, siempre que se lea bien qué es \(\hat{\mathbf y}_2\):
<ul><li>\(\hat{\mathbf y}_2=X_2\mathbf b_1\) es el <b>pronóstico</b> de la muestra 2 hecho con los coeficientes de la <b>muestra 1</b>. No es el valor ajustado de una regresión con la muestra 2.</li>
<li>Si fuera el ajustado de la muestra 2 (\(X_2\mathbf b_2\)), d sería el vector de residuos \(\mathbf e_2\). Su media también es cero, pero su varianza es \(\sigma^2[I-X_2(X_2'X_2)^{-1}X_2']\), con signo menos y la matriz de la muestra 2. Por eso el resultado b) solo sale con \(\mathbf b_1\).</li>
<li>La igualdad \(X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\) es correcta: solo se agrupan los términos con X₂.</li>
<li>Lo que el enunciado no dice explícitamente, y hace falta para b), es que los errores de las dos muestras son independientes, \(E(\boldsymbol\mu_1\boldsymbol\mu_2')=0\). Está implícito en el modelo clásico, que supone \(\boldsymbol\mu\sim N(\mathbf 0,\sigma^2I_n)\) para toda la muestra, pero conviene escribirlo al demostrar.</li></ul>
<p style="margin:6px 0 0">Es la misma expresión de Johnston y Dinardo, cap. 4: \(\mathbf d=\mathbf y_2-X_2\mathbf b_1\).</p></div>`,
saber:[String.raw`<b>Error de muestreo de MCO:</b> como \(\mathbf y_1=X_1\boldsymbol\beta+\boldsymbol\mu_1\), se tiene \(\mathbf b_1=\boldsymbol\beta+(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\), es decir \(\mathbf b_1-\boldsymbol\beta=(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\).`,
String.raw`<b>Supuestos:</b> X no es aleatoria; \(E(\boldsymbol\mu_j)=\mathbf 0\); \(E(\boldsymbol\mu_j\boldsymbol\mu_j')=\sigma^2I\) (homocedasticidad y no autocorrelación); los errores de las dos muestras no están correlacionados: \(E(\boldsymbol\mu_1\boldsymbol\mu_2')=0\).`,
String.raw`<b>Linealidad de la esperanza:</b> \(E(A\mathbf z)=A\,E(\mathbf z)\) si A no es aleatoria.`,
String.raw`<b>Varianza de un vector de media cero:</b> \(\operatorname{var}(\mathbf d)=E(\mathbf d\mathbf d')\). <b>Transpuesta de un producto:</b> \((AB)'=B'A'\); \((X_1'X_1)^{-1}\) es simétrica.`],
sol:String.raw`<h5>a) La media</h5><ol class="steps">
<li>Sustituye \(\mathbf y_2\) en d: \(\mathbf d=X_2\boldsymbol\beta+\boldsymbol\mu_2-X_2\mathbf b_1=\boldsymbol\mu_2-X_2(\mathbf b_1-\boldsymbol\beta)\).</li>
<li>Usa el error de muestreo: \(\mathbf d=\boldsymbol\mu_2-X_2(X_1'X_1)^{-1}X_1'\boldsymbol\mu_1\). Así d queda escrito solo con los errores.</li>
<li>Toma esperanza (las X son fijas): \(E(\mathbf d)=E(\boldsymbol\mu_2)-X_2(X_1'X_1)^{-1}X_1'E(\boldsymbol\mu_1)=\mathbf 0-\mathbf 0=\mathbf 0_{n_2\times1}\).</li></ol>
<h5>b) La varianza</h5><ol class="steps">
<li>Como \(E(\mathbf d)=\mathbf 0\), \(\operatorname{var}(\mathbf d)=E(\mathbf d\mathbf d')\). Llama \(A=X_2(X_1'X_1)^{-1}X_1'\), de modo que \(\mathbf d=\boldsymbol\mu_2-A\boldsymbol\mu_1\) y \(\mathbf d'=\boldsymbol\mu_2'-\boldsymbol\mu_1'A'\), con \(A'=X_1(X_1'X_1)^{-1}X_2'\).</li>
<li>Multiplica y distribuye la esperanza:
<div class="mj">\[E(\mathbf d\mathbf d')=E(\boldsymbol\mu_2\boldsymbol\mu_2')-E(\boldsymbol\mu_2\boldsymbol\mu_1')A'-A\,E(\boldsymbol\mu_1\boldsymbol\mu_2')+A\,E(\boldsymbol\mu_1\boldsymbol\mu_1')A'\]</div></li>
<li>Los dos términos cruzados son cero porque los errores de las dos muestras no están correlacionados.</li>
<li>Con \(E(\boldsymbol\mu_j\boldsymbol\mu_j')=\sigma^2I\): \(\operatorname{var}(\mathbf d)=\sigma^2I_{n_2}+\sigma^2AA'\).</li>
<li>Simplifica \(AA'=X_2(X_1'X_1)^{-1}\underbrace{X_1'X_1(X_1'X_1)^{-1}}_{I}X_2'=X_2(X_1'X_1)^{-1}X_2'\). Por tanto
<div class="mj">\[\operatorname{var}(\mathbf d)=\sigma^2\left[I_{n_2}+X_2(X_1'X_1)^{-1}X_2'\right]\]</div></li></ol>
<h5>La comparación con los residuos</h5><p>Si alguien toma \(\hat{\mathbf y}_2=X_2\mathbf b_2\) (la regresión de la muestra 2), entonces \(\mathbf d=\mathbf e_2=M_2\boldsymbol\mu_2\), con \(M_2=I-X_2(X_2'X_2)^{-1}X_2'\). Su media es cero, pero \(\operatorname{var}(\mathbf e_2)=\sigma^2M_2\) es <i>menor</i> que \(\sigma^2I\), mientras que la de b) es <i>mayor</i>: el pronóstico fuera de la muestra acumula el error de haber estimado β con otros datos. Además, con n₂ ≤ k los residuos de la muestra 2 serían todos cero, y la prueba de pronósticos existe justamente para ese caso.</p>
<h5>Para qué sirve</h5><p>Con normalidad, \(\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/\sigma^2\sim\chi^2(n_2)\). Al reemplazar σ² por \(s_1^2=RSS_1/(n_1-k)\) sale el estadístico (9) del curso, \(F=\mathbf d'[I+X_2(X_1'X_1)^{-1}X_2']^{-1}\mathbf d/(n_2s_1^2)\sim F(n_2,n_1-k)\), que da el mismo número que la forma (8) con las RSS.</p>`,
res:String.raw`<p>\(E(\mathbf d)=\mathbf 0\): el pronóstico es insesgado si los parámetros no cambian. La varianza tiene dos partes: \(\sigma^2I\), por los errores nuevos, y \(\sigma^2X_2(X_1'X_1)^{-1}X_2'\), porque β se estimó con la muestra 1. Si \(n_2=1\), se obtiene la varianza del error de predicción individual, \(\sigma^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]\).</p>`},

{id:"ep3-2", n:"2", t:"Consumo de cerveza por género: interpretar y contrastar", tipo:"Interpretación y pruebas t", temas:["dicotomicas","inferencia"], ej:"dicotomicas", tool:{id:"t-calc",pre:"coef:e2",lbl:"Abrir en la Calculadora (modelo ya estimado)"},
enun:String.raw`<p>Con n = 34, el modelo \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\) (Y: consumo de cerveza, X: renta, D = 1 si es mujer) se estimó así, con errores estándar entre paréntesis:</p>
<div class="mj">\[\hat Y_t=\underset{(45{,}67)}{186{,}47}-\underset{(57{,}01)}{126{,}00}D_t+\underset{(0{,}09)}{0{,}23}X_t-\underset{(0{,}10)}{0{,}13}D_tX_t,\qquad R^2=0{,}5055\]</div>
<p><b>a)</b> Interprete los coeficientes. <b>b)</b> ¿Cuál es la diferencia de consumo medio entre hombres y mujeres con la misma renta? <b>c)</b> Con perturbaciones normales, contraste: a. no hay diferencia en la propensión marginal a consumir; b. no hay diferencia en el consumo autónomo.</p>`,
saber:[String.raw`<b>Grupo base:</b> el grupo con D = 0 (hombres). β₁ y β₂ son su intercepto y su pendiente.`,
String.raw`<b>Diferenciales:</b> δ₁ cambia el intercepto y δ₂ cambia la pendiente del grupo D = 1. La ecuación de las mujeres es \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\).`,
String.raw`<b>Diferencia entre grupos para la misma X:</b> \(E(Y\mid D=1,X)-E(Y\mid D=0,X)=\delta_1+\delta_2X\).`,
String.raw`<b>Prueba t:</b> \(t=\hat\beta_j/ee(\hat\beta_j)\sim t(n-k)\). Aquí k = 4, así que hay 34 − 4 = 30 gl y \(t_{0{,}025}(30)=2{,}042\) a dos colas.`],
sol:String.raw`<h5>a) Interpretación</h5><ol class="steps">
<li>Escribe una ecuación por grupo. Para los hombres (D = 0): \(\hat Y=186{,}47+0{,}23X\). Para las mujeres (D = 1): \(\hat Y=(186{,}47-126)+(0{,}23-0{,}13)X=60{,}47+0{,}10X\).</li>
<li><b>β₁ = 186,47:</b> consumo autónomo de cerveza de un hombre, es decir, el consumo esperado con renta 0.</li>
<li><b>δ₁ = −126:</b> el consumo autónomo de las mujeres es 126 unidades menor que el de los hombres.</li>
<li><b>β₂ = 0,23:</b> propensión marginal a consumir cerveza de los hombres: por cada unidad adicional de renta consumen 0,23 unidades más.</li>
<li><b>δ₂ = −0,13:</b> la propensión marginal de las mujeres es 0,13 menor, o sea 0,10.</li>
<li>R² = 0,5055: el modelo explica el 50,6 % de la variación del consumo de cerveza.</li></ol>
<h5>b) Diferencia con la misma renta</h5><p>\(\hat Y_M-\hat Y_H=\delta_1+\delta_2X=-126-0{,}13X\). Las mujeres consumen menos, y la brecha crece con la renta. Por ejemplo, con X = 100 la diferencia es −139. No hay un único número porque las pendientes son distintas.</p>
<h5>c) Contrastes</h5><ol class="steps">
<li><b>a. Propensión marginal:</b> H₀: δ₂ = 0 frente a H₁: δ₂ ≠ 0. \(t=-0{,}13/0{,}10=-1{,}30\). Como \(|{-1{,}30}|<2{,}042\) (p = 0,204), no se rechaza H₀: no hay evidencia de que la propensión marginal difiera por género.</li>
<li><b>b. Consumo autónomo:</b> H₀: δ₁ = 0 frente a H₁: δ₁ ≠ 0. \(t=-126/57{,}01=-2{,}21\). Como \(|{-2{,}21}|>2{,}042\) (p = 0,035), se rechaza H₀ al 5 %: el consumo autónomo de las mujeres es menor.</li>
<li>Para probar las dos cosas a la vez (δ₁ = δ₂ = 0, cambio estructural completo) hace falta una F conjunta o las RSS de los dos modelos. Dos pruebas t por separado no bastan, porque los estimadores están correlacionados.</li></ol>`,
res:String.raw`<p>Hombres: \(\hat Y=186{,}47+0{,}23X\); mujeres: \(\hat Y=60{,}47+0{,}10X\). La diferencia con la misma renta es \(-126-0{,}13X\). Al 5 %, la propensión marginal no difiere por género (t = −1,30) y el consumo autónomo sí (t = −2,21).</p>`},

{id:"ep3-3", n:"3", t:"Educación urbana y rural: estimar, R², cambio estructural y pronóstico", tipo:"Cálculo con datos", temas:["mco-matricial","dicotomicas","chow"], ej:"mco-matricial", tool:{id:"t-datos",pre:"educacion",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Años de educación (Y) y renta familiar (X) de 8 jóvenes: urbanos (16, 8), (18, 13), (14, 9), (18, 12) y rurales (12, 7), (10, 3), (11, 6), (14, 10). Se propone \(Y_i=\beta_1D_{1i}+\beta_2D_{1i}X_i+\beta_3D_{2i}+\beta_4D_{2i}X_i+\mu_i\), con D₁ = 1 en la zona urbana y D₂ = 1 en la rural.</p><p><b>a)</b> Interprete los coeficientes y su signo esperado. <b>b)</b> Estime el modelo y explique el R². <b>c)</b> Con normalidad, contraste el cambio estructural entre zonas. <b>d)</b> Pronostique puntualmente y por intervalos los años de educación de un joven urbano con renta 10,5.</p>`,
saber:[String.raw`<b>Sin intercepto común:</b> como \(D_1+D_2=1\), el modelo ya tiene un intercepto por zona. Agregar β₀ causaría multicolinealidad perfecta.`,
String.raw`<b>X′X por bloques:</b> las columnas de una zona valen 0 en la otra, así que X′X es diagonal por bloques y MCO equivale a estimar <b>una regresión simple por zona</b>.`,
String.raw`<b>Regresión simple:</b> \(b=\dfrac{n\sum xy-\sum x\sum y}{n\sum x^2-(\sum x)^2}\), \(a=\bar y-b\bar x\), y \(RSS=\left(\sum y^2-n\bar y^2\right)-b^2\left(\sum x^2-n\bar x^2\right)\).`,
String.raw`<b>R² centrado:</b> \(R^2=1-RSS/TSS\), con \(TSS=\sum(y-\bar y)^2\). Se usa el centrado porque el modelo tiene intercepto implícito.`,
String.raw`<b>Chow:</b> el restringido es una sola recta para todos: \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\), con q = 2 y k = 4.`,
String.raw`<b>Pronóstico:</b> \(\hat y_0=\mathbf x_0'\mathbf b\); \(ee(\text{media})=\sqrt{s^2\mathbf x_0'(X'X)^{-1}\mathbf x_0}\) y \(ee(\text{individual})=\sqrt{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}\).`],
sol:String.raw`<h5>a) Significado y signos</h5><p>Y son los años de educación y X la renta familiar. β₁ y β₃ son los interceptos: los años de educación esperados de un joven urbano y de uno rural cuando la renta es 0. β₂ y β₄ son las pendientes, los coeficientes que acompañan a la renta X: cuántos años <b>de educación</b> más se esperan cuando la renta familiar sube una unidad, β₂ en la zona urbana y β₄ en la rural. Signos esperados: positivos, porque más renta permite estudiar más. Se espera además β₁ &gt; β₃, por el mejor acceso a la educación en la ciudad.</p>
<h5>b) Estimación</h5><ol class="steps">
<li><b>Urbana</b> (n = 4): Σx = 42, Σy = 66, Σx² = 458, Σxy = 704. Promedios: \(\bar x_U=42/4=10{,}5\) (renta media urbana) y \(\bar y_U=66/4=16{,}5\) (educación media urbana).<br>Pendiente: \(\hat\beta_2=\dfrac{4(704)-42(66)}{4(458)-42^2}=\dfrac{44}{68}=0{,}6471\).<br>Intercepto: \(\hat\beta_1=\bar y_U-\hat\beta_2\bar x_U=16{,}5-0{,}6471(10{,}5)=9{,}7059\).</li>
<li><b>Rural</b> (n = 4): Σx = 26, Σy = 47, Σx² = 194, Σxy = 320. Promedios: \(\bar x_R=26/4=6{,}5\) y \(\bar y_R=47/4=11{,}75\).<br>Pendiente: \(\hat\beta_4=\dfrac{4(320)-26(47)}{4(194)-26^2}=\dfrac{58}{100}=0{,}58\).<br>Intercepto: \(\hat\beta_3=\bar y_R-\hat\beta_4\bar x_R=11{,}75-0{,}58(6{,}5)=7{,}98\).</li>
<li>Modelo estimado: \(\hat Y=9{,}706D_1+0{,}647D_1X+7{,}980D_2+0{,}580D_2X\).</li>
<li><b>RSS de cada zona</b> con \(RSS=\left(\sum y^2-n\bar y^2\right)-b^2\left(\sum x^2-n\bar x^2\right)\): la variación total de Y menos la parte que explica la recta.<br>
<b>Urbana:</b> \(\sum y^2=16^2+18^2+14^2+18^2=1100\), así que \(\sum y^2-n\bar y^2=1100-4(16{,}5)^2=11\); \(\sum x^2-n\bar x^2=458-4(10{,}5)^2=17\). \(RSS_U=11-0{,}6471^2(17)=11-7{,}1176=3{,}8824\).<br>
<b>Rural:</b> \(\sum y^2=12^2+10^2+11^2+14^2=561\), así que \(561-4(11{,}75)^2=8{,}75\); \(194-4(6{,}5)^2=25\). \(RSS_R=8{,}75-0{,}58^2(25)=8{,}75-8{,}41=0{,}34\).</li>
<li><b>Comprobación con los errores</b> \(e=Y-\hat Y\), que es la definición \(RSS=\sum e^2\):
<div class="tbl"><table><tr><th>Zona</th><th>X</th><th>Y</th><th>Ŷ</th><th>e</th><th>e²</th></tr>
<tr><td>Urbana</td><td>8</td><td>16</td><td>14,882</td><td>1,118</td><td>1,2491</td></tr>
<tr><td>Urbana</td><td>13</td><td>18</td><td>18,118</td><td>−0,118</td><td>0,0138</td></tr>
<tr><td>Urbana</td><td>9</td><td>14</td><td>15,529</td><td>−1,529</td><td>2,3391</td></tr>
<tr><td>Urbana</td><td>12</td><td>18</td><td>17,471</td><td>0,529</td><td>0,2803</td></tr>
<tr><th colspan="5">Suma urbana</th><th>3,8824</th></tr>
<tr><td>Rural</td><td>7</td><td>12</td><td>12,04</td><td>−0,04</td><td>0,0016</td></tr>
<tr><td>Rural</td><td>3</td><td>10</td><td>9,72</td><td>0,28</td><td>0,0784</td></tr>
<tr><td>Rural</td><td>6</td><td>11</td><td>11,46</td><td>−0,46</td><td>0,2116</td></tr>
<tr><td>Rural</td><td>10</td><td>14</td><td>13,78</td><td>0,22</td><td>0,0484</td></tr>
<tr><th colspan="5">Suma rural</th><th>0,3400</th></tr></table></div></li>
<li>El RSS del modelo completo (no restringido) es la suma de los dos: \(RSS_{NR}=3{,}8824+0{,}34=4{,}2222\), y \(s^2=4{,}2222/(8-4)=1{,}0556\).</li>
<li>Con los 8 jóvenes, \(\sum y^2=1661\) y el promedio general es \(\bar y=113/8=14{,}125\). \(TSS=\sum y^2-n\bar y^2=1661-8(14{,}125)^2=64{,}875\), y \(R^2=1-4{,}2222/64{,}875=0{,}935\).</li>
<li><b>Errores estándar.</b> Miden qué tan preciso es cada coeficiente: \(S_{b_j}=\sqrt{s^2\,c_{jj}}\), donde \(c_{jj}\) es el elemento j de la diagonal de \((X'X)^{-1}\). Se usa la misma \(s^2=1{,}0556\) para las dos zonas, porque es un solo modelo con una sola varianza del error.<br>
Como X′X es diagonal por bloques, se invierte cada bloque 2 × 2 por separado:<br>
<b>Urbana:</b> \(\begin{bmatrix}n&\sum x\\\sum x&\sum x^2\end{bmatrix}^{-1}=\begin{bmatrix}4&42\\42&458\end{bmatrix}^{-1}=\dfrac1{68}\begin{bmatrix}458&-42\\-42&4\end{bmatrix}\), con diagonal \(458/68=6{,}7353\) y \(4/68=0{,}0588\).<br>
<b>Rural:</b> \(\begin{bmatrix}4&26\\26&194\end{bmatrix}^{-1}=\dfrac1{100}\begin{bmatrix}194&-26\\-26&4\end{bmatrix}\), con diagonal \(1{,}94\) y \(0{,}04\).
<div class="tbl"><table><tr><th>Coeficiente</th><th>c<sub>jj</sub></th><th>Varianza = s²·c<sub>jj</sub></th><th>Error estándar</th></tr>
<tr><td>β₁ (intercepto urbano)</td><td>6,7353</td><td>1,0556 × 6,7353 = 7,1095</td><td>√7,1095 = 2,666</td></tr>
<tr><td>β₂ (pendiente urbana)</td><td>0,0588</td><td>1,0556 × 0,0588 = 0,0621</td><td>√0,0621 = 0,249</td></tr>
<tr><td>β₃ (intercepto rural)</td><td>1,94</td><td>1,0556 × 1,94 = 2,0478</td><td>√2,0478 = 1,431</td></tr>
<tr><td>β₄ (pendiente rural)</td><td>0,04</td><td>1,0556 × 0,04 = 0,0422</td><td>√0,0422 = 0,205</td></tr></table></div>
Es lo mismo que las fórmulas de la regresión simple: para la pendiente, \(S_b=\sqrt{s^2/S_{XX}}\) (urbana: \(\sqrt{1{,}0556/17}=0{,}249\)), y para el intercepto, \(S_a=\sqrt{s^2\sum x^2/(n\,S_{XX})}\) (urbana: \(\sqrt{1{,}0556(458)/(4\cdot17)}=2{,}666\)), con \(S_{XX}=\sum x^2-n\bar x^2\).<br>
<b>Para qué sirven:</b> con ellos se arma la prueba t, \(t=b_j/S_{b_j}\). Por ejemplo, para la pendiente urbana \(t=0{,}6471/0{,}249=2{,}60\) y para la rural \(t=0{,}58/0{,}205=2{,}82\); el crítico es \(t_{0{,}025}(4)=2{,}776\).</li></ol>
<p><b>Lectura del R²:</b> la renta y la zona explican el 93,5 % de la variación de los años de educación.</p>
<h5>c) Cambio estructural</h5><ol class="steps">
<li>H₀: β₁ = β₃ y β₂ = β₄ (una sola recta) frente a H₁: al menos una diferencia. Son q = 2 restricciones.</li>
<li>Restringido \(Y=\alpha+\beta X\) con los 8 datos: Σx = 68, Σy = 113, Σx² = 652, Σxy = 1024. \(\hat\beta=\dfrac{8(1024)-68(113)}{8(652)-68^2}=\dfrac{508}{592}=0{,}8581\) y, con los promedios generales \(\bar x=68/8=8{,}5\) y \(\bar y=113/8=14{,}125\), \(\hat\alpha=14{,}125-0{,}8581(8{,}5)=6{,}831\). Con la misma fórmula: \(\sum y^2-n\bar y^2=1661-8(14{,}125)^2=64{,}875\) y \(\sum x^2-n\bar x^2=652-8(8{,}5)^2=74\), así que \(RSS_R=64{,}875-0{,}8581^2(74)=64{,}875-54{,}490=10{,}3851\).</li>
<li>\(F=\dfrac{(10{,}3851-4{,}2222)/2}{4{,}2222/4}=\dfrac{3{,}0815}{1{,}0556}=2{,}919\sim F(2,4)\).</li>
<li>\(F_{0{,}05}(2,4)=6{,}944\) y p = 0,165, así que no se rechaza H₀.</li></ol>
<p><b>Lectura:</b> con estos datos no hay evidencia de que la relación educación-renta difiera entre zonas. Con solo 8 observaciones la prueba tiene poco poder.</p>
<h5>d) Pronóstico para un joven urbano con renta 10,5</h5><ol class="steps">
<li>\(\mathbf x_0=(1;\,10{,}5;\,0;\,0)\), así que \(\hat y_0=9{,}7059+0{,}6471(10{,}5)=16{,}5\) años.</li>
<li>10,5 es justo la renta media urbana, y en la media \(\mathbf x_0'(X'X)^{-1}\mathbf x_0=1/n_U=1/4\). Por tanto \(ee(\text{media})=\sqrt{1{,}0556/4}=0{,}5137\) y \(ee(\text{individual})=\sqrt{1{,}0556(1+1/4)}=1{,}1487\).</li>
<li>Con \(t_{0{,}025}(4)=2{,}776\):<br>IC del 95 % para la media: \(16{,}5\pm2{,}776(0{,}5137)=[15{,}07;\;17{,}93]\).<br>IC para un joven individual: \(16{,}5\pm2{,}776(1{,}1487)=[13{,}31;\;19{,}69]\).</li></ol>`,
res:String.raw`<p>\(\hat Y=9{,}706D_1+0{,}647D_1X+7{,}980D_2+0{,}580D_2X\), con R² = 0,935. Chow: F = 2,919 &lt; 6,944, así que no hay cambio estructural entre zonas. Pronóstico urbano con X = 10,5: 16,5 años; IC del 95 % para la media [15,07; 17,93] y para un individuo [13,31; 19,69].</p>`},

{id:"ep3-4", n:"4", t:"Salarios por titulación: la dummy y la diferencia de medias", tipo:"Demostración y cálculo", temas:["mco-simple","dicotomicas","inferencia"], ej:"mco-simple",
enun:String.raw`<p>Hay 500 empleados: 300 licenciados en empresariales (D = 1) con salario medio 250 y 200 administrativos (D = 0) con salario medio 150. El modelo es \(W_i=\beta_1+\beta_2D_i+\mu_i\).</p><p><b>a)</b> Muestre que \(\hat\beta_1=\bar W_A\) y \(\hat\beta_1+\hat\beta_2=\bar W_L\). <b>b)</b> Estime el modelo. <b>c)</b> Si las desviaciones típicas muestrales son 50 (licenciados) y 30 (administrativos), obtenga los errores estándar de \(\hat\beta_1\) y \(\hat\beta_2\). <b>d)</b> Halle el R². <b>e)</b> ¿Cómo contrastaría que hay diferencia salarial?</p>`,
saber:[String.raw`<b>Ecuaciones normales:</b> \(X'X\mathbf b=X'\mathbf y\). Con una dummy, \(\sum D=n_L\) y \(\sum D^2=n_L\).`,
String.raw`<b>Con una sola dummy, MCO da medias de grupo:</b> los residuos suman cero dentro de cada grupo, así que el ajuste de cada grupo es su media.`,
String.raw`<b>Varianza de los estimadores:</b> \(\widehat{\operatorname{var}}(\mathbf b)=s^2(X'X)^{-1}\) con \(s^2=RSS/(n-k)\).`,
String.raw`<b>Descomposición:</b> \(TSS=ESS+RSS\) y \(R^2=ESS/TSS\).`],
sol:String.raw`<h5>a) La demostración</h5><ol class="steps">
<li>\(X'X=\begin{bmatrix}n&n_L\\n_L&n_L\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}\sum W\\ \sum_L W\end{bmatrix}=\begin{bmatrix}n_L\bar W_L+n_A\bar W_A\\ n_L\bar W_L\end{bmatrix}\).</li>
<li>Segunda ecuación normal: \(n_L\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L\), así que \(\hat\beta_1+\hat\beta_2=\bar W_L\).</li>
<li>Primera: \(n\hat\beta_1+n_L\hat\beta_2=n_L\bar W_L+n_A\bar W_A\). Escribe \(n=n_A+n_L\): \(n_A\hat\beta_1+n_L(\hat\beta_1+\hat\beta_2)=n_L\bar W_L+n_A\bar W_A\). Con el paso anterior queda \(n_A\hat\beta_1=n_A\bar W_A\), es decir \(\hat\beta_1=\bar W_A\).</li></ol>
<h5>b) Estimación</h5><p>\(\hat\beta_1=150\) y \(\hat\beta_2=250-150=100\), así que \(\hat W=150+100D\). El salario medio general es \(\bar W=(300\cdot250+200\cdot150)/500=210\).</p>
<h5>c) Errores estándar</h5><ol class="steps">
<li>Los residuos son las desviaciones de cada salario respecto a la media de su grupo. Con la desviación típica muestral (divisor n − 1): \(RSS=(n_L-1)s_L^2+(n_A-1)s_A^2=299(50^2)+199(30^2)=926.600\).</li>
<li>\(s^2=RSS/(n-k)=926.600/498=1.860{,}64\).</li>
<li>\((X'X)^{-1}=\dfrac{1}{n\,n_L-n_L^2}\begin{bmatrix}n_L&-n_L\\-n_L&n\end{bmatrix}=\dfrac{1}{n_Ln_A}\begin{bmatrix}n_L&-n_L\\-n_L&n\end{bmatrix}\).</li>
<li>\(ee(\hat\beta_1)=\sqrt{s^2/n_A}=\sqrt{1.860{,}64/200}=3{,}050\).<br>\(ee(\hat\beta_2)=\sqrt{s^2\left(\tfrac1{n_L}+\tfrac1{n_A}\right)}=\sqrt{1.860{,}64\left(\tfrac1{300}+\tfrac1{200}\right)}=3{,}938\).</li></ol>
<p class="hint">Si la desviación típica se define con divisor n, entonces RSS = 300(2.500) + 200(900) = 930.000 y los errores estándar cambian un poco (3,056 y 3,945).</p>
<h5>d) R²</h5><p>\(ESS=\sum(\hat W-\bar W)^2=300(250-210)^2+200(150-210)^2=480.000+720.000=1.200.000\), y \(TSS=ESS+RSS=2.126.600\). Por tanto \(R^2=1.200.000/2.126.600=0{,}564\).</p>
<h5>e) Contraste</h5><p>H₀: β₂ = 0 (sin diferencia salarial) frente a H₁: β₂ ≠ 0 (o β₂ &gt; 0 si se quiere probar que los licenciados ganan más). \(t=100/3{,}938=25{,}40\sim t(498)\), y \(t_{0{,}025}\approx1{,}965\). Se rechaza H₀ con mucha holgura (p ≈ 0): hay diferencia salarial. Esta prueba t es la misma que la de diferencia de medias con varianza combinada.</p>`,
res:String.raw`<p>\(\hat W=150+100D\), con ee de 3,050 y 3,938, y R² = 0,564. Contraste t = 25,4: los licenciados ganan en promedio 100 mil pesetas más al mes.</p>`},

{id:"ep3-5", n:"5", t:"Salarios y experiencia por género: ¿es distinta la ecuación?", tipo:"Prueba de Chow con datos", temas:["dicotomicas","chow"], tool:{id:"t-datos",pre:"salarios",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Hay 17 personas: 9 hombres y 8 mujeres, con su sueldo W y sus años de experiencia X (los datos están en el taller). El modelo es \(W_i=\beta_1D_{1i}+\beta_2X_{1i}+\beta_1'D_{2i}+\beta_2'X_{2i}+\mu_i\), con D₁ = 1 para los hombres, D₂ = 1 para las mujeres y \(X_{ji}=D_{ji}X_i\).</p><p><b>a)</b> Interprete y estime los coeficientes. <b>b)</b> ¿Es el género significativo? Plantee la hipótesis y haga la prueba.</p>`,
saber:[String.raw`Es el mismo diseño del punto 3: un intercepto y una pendiente por grupo sin intercepto común. MCO equivale a una regresión simple por grupo, y \(RSS_{NR}=RSS_H+RSS_M\).`,
String.raw`<b>Chow:</b> H₀: \(\beta_1=\beta_1'\) y \(\beta_2=\beta_2'\), con q = 2, k = 4 y \(F\sim F(2,\,n-4)\).`],
sol:String.raw`<h5>a) Estimación e interpretación</h5><ol class="steps">
<li><b>Hombres</b> (n = 9): Σx = 117, Σw = 24,06, Σx² = 2491, Σxw = 377,25. \(\hat\beta_2=\dfrac{9(377{,}25)-117(24{,}06)}{9(2491)-117^2}=\dfrac{580{,}23}{8730}=0{,}06646\) y \(\hat\beta_1=2{,}6733-0{,}06646(13)=1{,}8093\).</li>
<li><b>Mujeres</b> (n = 8): Σx = 130, Σw = 23,96, Σx² = 2574, Σxw = 425,25. \(\hat\beta_2'=\dfrac{8(425{,}25)-130(23{,}96)}{8(2574)-130^2}=\dfrac{287{,}2}{3692}=0{,}07779\) y \(\hat\beta_1'=2{,}995-0{,}07779(16{,}25)=1{,}7309\).</li>
<li>β₁ = 1,809 y β′₁ = 1,731 son el sueldo de entrada (sin experiencia) de hombres y mujeres. β₂ = 0,0665 y β′₂ = 0,0778 son lo que aumenta el sueldo por cada año de experiencia.</li></ol>
<h5>b) ¿Es significativo el género?</h5><ol class="steps">
<li>H₀: β₁ = β′₁ y β₂ = β′₂ (la misma ecuación para los dos) frente a H₁: al menos uno distinto.</li>
<li>\(RSS_{NR}=RSS_H+RSS_M=0{,}80627+0{,}32615=1{,}13242\), con n − k = 17 − 4 = 13.</li>
<li>Restringido, una sola recta: Σx = 247, Σw = 48,02, Σx² = 5065, Σxw = 802,5. Da \(\hat W=1{,}7933+0{,}0710X\) y \(RSS_R=1{,}20866\).</li>
<li>\(F=\dfrac{(1{,}20866-1{,}13242)/2}{1{,}13242/13}=\dfrac{0{,}03812}{0{,}08711}=0{,}438\sim F(2,13)\).</li>
<li>\(F_{0{,}05}(2,13)=3{,}806\) y p = 0,655, así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>Hombres: \(\hat W=1{,}809+0{,}0665X\); mujeres: \(\hat W=1{,}731+0{,}0778X\). F = 0,438 &lt; 3,806 (p = 0,65): el género no es significativo, y una sola ecuación de salario sirve para los dos.</p>`},

{id:"ep3-6", n:"6", t:"Función de consumo en tres periodos", tipo:"Chow con m submuestras", temas:["chow"], tool:{id:"t-calc",pre:"rss:e6",lbl:"Abrir en la Calculadora (RSS o R²)"},
enun:String.raw`<p>Una función keynesiana \(C=\beta_1+\beta_2R\) se estimó en 1964-1971 (\(\hat\beta_2=0{,}3663\)), 1972-1983 (0,8846), 1984-1990 (1,6069) y en todo 1964-1990 (\(\hat C=202{,}23+0{,}895R\), R² = 0,9974). Además, TSS = 6.403.270, RSS₁ = 2.379,315, RSS₂ = 3.679,020 y RSS₃ = 1.295,861.</p><p><b>a)</b> Explique el concepto de cambio estructural. <b>b)</b> Contraste la consistencia de los parámetros en los tres periodos.</p>`,
saber:[String.raw`<b>Chow con m submuestras:</b> \(F=\dfrac{(RSS_R-\sum_jSCR_j)/[(m-1)k]}{\sum_jSCR_j/(n-mk)}\sim F((m-1)k,\,n-mk)\).`,
String.raw`<b>RSS a partir de R²:</b> \(R^2=1-RSS/TSS\), así que \(RSS=(1-R^2)\,TSS\).`,
String.raw`Años de cada periodo: 1964-1971 son 8, 1972-1983 son 12 y 1984-1990 son 7, en total n = 27.`],
sol:String.raw`<h5>a) Concepto</h5><p>Hay cambio estructural cuando los parámetros de la relación no son los mismos en todo el periodo de la muestra. Un evento, como una crisis, un cambio de política o una reforma, modifica el consumo autónomo, la propensión marginal a consumir o ambos. Si existe y se estima una sola ecuación, los coeficientes son un promedio engañoso de relaciones distintas.</p>
<h5>b) La prueba</h5><ol class="steps">
<li>H₀: \(\boldsymbol\beta^{(1)}=\boldsymbol\beta^{(2)}=\boldsymbol\beta^{(3)}\) (parámetros constantes) frente a H₁: al menos uno cambia. Son q = (m − 1)k = 2·2 = 4 restricciones.</li>
<li>\(RSS_R=(1-0{,}9974)(6.403.270)=16.648{,}50\).</li>
<li>\(RSS_{NR}=2.379{,}315+3.679{,}020+1.295{,}861=7.354{,}196\).</li>
<li>Grados de libertad del denominador: n − mk = 27 − 6 = 21.</li>
<li>\(F=\dfrac{(16.648{,}50-7.354{,}20)/4}{7.354{,}20/21}=\dfrac{2.323{,}58}{350{,}20}=6{,}635\sim F(4,21)\).</li>
<li>\(F_{0{,}05}(4,21)=2{,}840\) y p = 0,0013, así que se rechaza H₀.</li></ol>
<p class="hint">El R² viene redondeado a cuatro decimales, y RSS_R es sensible a eso: con R² entre 0,99735 y 0,99745 la F va de 6,41 a 6,86. La conclusión no cambia.</p>`,
res:String.raw`<p>F = 6,635 &gt; F(4, 21) = 2,84: se rechaza la consistencia de los parámetros. La función de consumo cambió entre los tres periodos. La propensión marginal pasa de 0,37 a 0,88 y a 1,61; una propensión mayor que 1 en el último periodo es económicamente rara y merece comentarse.</p>`},

{id:"ep3-7", n:"7", t:"Horas de lectura: dummies de clase y la trampa de las dicótomas", tipo:"Demostración y cálculo", temas:["matrices","dicotomicas"], ej:"matrices", tool:{id:"t-datos",pre:"lectura",lbl:"Cargar el literal c en el Laboratorio"},
enun:String.raw`<p>Las horas de lectura Y se relacionan con tres clases de educación: superior (E₁), media (E₂) y media incompleta (E₃). <b>a)</b> En \(Y_i=\delta_1E_{1i}+\delta_2E_{2i}+\delta_3E_{3i}+\mu_i\), pruebe que \(\hat\delta_j=\bar Y_j\). <b>b)</b> En \(Y_i=\beta_1+\beta_2E_{2i}+\beta_3E_{3i}+v_i\), pruebe que \(\hat\beta_1=\bar Y_1\), \(\hat\beta_2=\bar Y_2-\bar Y_1\) y \(\hat\beta_3=\bar Y_3-\bar Y_1\). <b>c)</b> Con \(S_1\) = 1 si es mujer y los datos (mujer: superiores 8, 10, 12; media 12, 14; incompleta 20; hombre: superiores 5, 6; media 10; incompleta 20), estime \(Y_i=\beta_1+\beta_2E_{2i}+\beta_3E_{3i}+\beta_4S_{1i}+v_i\) y calcule las horas estimadas por clase y género.</p>`,
saber:[String.raw`<b>Productos de dummies excluyentes:</b> \(E_jE_l=0\) si j ≠ l y \(E_j^2=E_j\). Por eso \(\sum E_j=n_j\), \(\sum E_jE_l=0\) y \(\sum E_jY=\) suma de Y en la clase j.`,
String.raw`<b>Trampa de las dicótomas:</b> \(E_1+E_2+E_3=1\). Con intercepto, se incluyen m − 1 dummies; sin intercepto, las m.`,
String.raw`<b>Reparametrización:</b> dos modelos cuyas X generan el mismo espacio de columnas dan los mismos valores ajustados. Por eso sus coeficientes se relacionan como los parámetros.`],
sol:String.raw`<h5>a) Sin intercepto</h5><ol class="steps">
<li>\(X=[E_1\;E_2\;E_3]\), así que \(X'X=\operatorname{diag}(n_1,n_2,n_3)\), porque las dummies no se superponen.</li>
<li>\(X'\mathbf y=\left(\sum_{1}Y,\;\sum_{2}Y,\;\sum_{3}Y\right)'\).</li>
<li>\(\mathbf b=(X'X)^{-1}X'\mathbf y\) divide cada suma por su tamaño: \(\hat\delta_j=\sum_jY/n_j=\bar Y_j\).</li></ol>
<h5>b) Con intercepto y la clase 1 como base</h5><ol class="steps">
<li>Para una persona de la clase 1, \(E(Y)=\beta_1\); de la clase 2, \(\beta_1+\beta_2\); de la clase 3, \(\beta_1+\beta_3\). Es el modelo de a) reparametrizado: \(\delta_1=\beta_1\), \(\delta_2=\beta_1+\beta_2\) y \(\delta_3=\beta_1+\beta_3\).</li>
<li>Las columnas \([1,E_2,E_3]\) generan el mismo espacio que \([E_1,E_2,E_3]\), porque \(1=E_1+E_2+E_3\). Así que los valores ajustados son los mismos: \(\bar Y_1\), \(\bar Y_2\) y \(\bar Y_3\).</li>
<li>Despeja: \(\hat\beta_1=\bar Y_1\), \(\hat\beta_2=\bar Y_2-\bar Y_1\) y \(\hat\beta_3=\bar Y_3-\bar Y_1\). También se puede resolver directamente \(X'X\mathbf b=X'\mathbf y\) con \(X'X=\begin{bmatrix}n&n_2&n_3\\n_2&n_2&0\\n_3&0&n_3\end{bmatrix}\).</li></ol>
<h5>c) Con género</h5><ol class="steps">
<li>Con los 10 datos: \(X'X=\begin{bmatrix}10&3&2&6\\3&3&0&2\\2&0&2&1\\6&2&1&6\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}117\\36\\40\\76\end{bmatrix}\).</li>
<li>\(\mathbf b=(X'X)^{-1}X'\mathbf y\), así que \(\hat Y=6{,}324+3{,}592E_2+12{,}113E_3+3{,}127S_1\).</li>
<li>Horas estimadas (intercepto + clase + género):
<div class="tbl"><table><tr><th></th><th class="num">Superiores</th><th class="num">Media</th><th class="num">Media incompleta</th></tr><tr><td>Hombre</td><td class="num">6,32</td><td class="num">9,92</td><td class="num">18,44</td></tr><tr><td>Mujer</td><td class="num">9,45</td><td class="num">13,04</td><td class="num">21,56</td></tr></table></div></li>
<li>Sin interacciones el modelo impone la misma brecha de género (3,13 horas) en todas las clases. Por eso los ajustes no coinciden con las medias de cada celda; las mujeres con estudios superiores, por ejemplo, promedian 10.</li></ol>`,
res:String.raw`<p>a) \(\hat\delta_j=\bar Y_j\). b) El intercepto es la media de la clase base y cada coeficiente la diferencia de medias. c) \(\hat Y=6{,}324+3{,}592E_2+12{,}113E_3+3{,}127S_1\): las mujeres leen 3,13 horas más en cada clase, y la media incompleta es la clase que más lee.</p>`},

{id:"ep3-8", n:"8", t:"Guerra y paz: ¿cambió la función de consumo?", tipo:"Prueba de Chow con datos", temas:["chow","ce-dummies"], ej:"chow", tool:{id:"t-datos",pre:"consumo",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Se tienen 15 años de consumo (Y) y renta disponible (X): los 5 primeros de guerra y los 10 últimos de paz (los datos están en el taller). Con \(Y_t=\beta_1+\beta_2X_t+\mu_t\), determine si hay cambio estructural en la función de consumo entre la guerra y la paz. Especifique el modelo restringido y el no restringido y las hipótesis nula y alternativa.</p>`,
saber:[String.raw`<b>No restringido:</b> \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\), con D = 1 en la paz. Estimarlo equivale a estimar cada periodo por separado (ecuación 27), y \(RSS_{NR}=RSS_1+RSS_2\) (ecuación 28).`,
String.raw`<b>Restringido:</b> \(Y_t=\beta_1+\beta_2X_t+\mu_t\) con todas las observaciones.`,
String.raw`<b>Estadístico de Chow:</b> \(F=\dfrac{(RSS_R-RSS_1-RSS_2)/k}{(RSS_1+RSS_2)/(n-2k)}\sim F(k,\,n-2k)\), con k = 2.`,
String.raw`<b>RSS de una regresión simple sin calcular residuos:</b> \(RSS=S_{yy}-\hat\beta_2^2S_{xx}\), con \(S_{yy}=\sum y^2-n\bar y^2\) y \(S_{xx}=\sum x^2-n\bar x^2\).`],
sol:String.raw`<ol class="steps">
<li><b>Hipótesis.</b> H₀: δ₁ = δ₂ = 0 (la misma función en la guerra y en la paz) frente a H₁: δ₁ ≠ 0 o δ₂ ≠ 0.</li>
<li><b>Guerra</b> (n₁ = 5): Σx = 35, Σy = 15, Σx² = 325, Σxy = 140, Σy² = 61. \(\hat\beta_2=\dfrac{5(140)-35(15)}{5(325)-35^2}=\dfrac{175}{400}=0{,}4375\) y \(\hat\beta_1=3-0{,}4375(7)=-0{,}0625\). Con \(S_{yy}=61-45=16\) y \(S_{xx}=325-245=80\): \(RSS_1=16-0{,}4375^2(80)=0{,}6875\).</li>
<li><b>Paz</b> (n₂ = 10): Σx = 110, Σy = 60, Σx² = 1540, Σxy = 828, Σy² = 448. \(\hat\beta_2=\dfrac{10(828)-110(60)}{10(1540)-110^2}=\dfrac{1680}{3300}=0{,}5091\) y \(\hat\beta_1=6-0{,}5091(11)=0{,}4000\). \(RSS_2=88-0{,}5091^2(330)=2{,}4727\).</li>
<li><b>Restringido</b> (n = 15): Σx = 145, Σy = 75, Σx² = 1865, Σxy = 968, Σy² = 509. \(\hat\beta_2=\dfrac{15(968)-145(75)}{15(1865)-145^2}=\dfrac{3645}{6950}=0{,}5245\) y \(\hat\beta_1=-0{,}0698\). \(RSS_R=134-0{,}5245^2(463{,}33)=6{,}5561\).</li>
<li><b>Verificación con dummies:</b> \(\hat Y=-0{,}0625+0{,}4625D+0{,}4375X+0{,}0716DX\). Los β son los de la guerra, y β + δ dan los de la paz: −0,0625 + 0,4625 = 0,4 y 0,4375 + 0,0716 = 0,5091. Además \(RSS_{NR}=3{,}1602=0{,}6875+2{,}4727\).</li>
<li>\(F=\dfrac{(6{,}5561-3{,}1602)/2}{3{,}1602/11}=\dfrac{1{,}6980}{0{,}2873}=5{,}910\sim F(2,11)\).</li>
<li>\(F_{0{,}05}(2,11)=3{,}982\) y p = 0,018, así que se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 5,910 &gt; 3,982 (p = 0,018): hay cambio estructural, y la función de consumo es distinta en la guerra y en la paz. En la paz la propensión marginal a consumir es mayor (0,509 frente a 0,438), lo que es coherente con el racionamiento y el ahorro forzoso de la guerra.</p>`},
]});
TALLERES[0].puntos.push(
{id:"ep3-9", n:"9", t:"El modelo con dummies en forma matricial: X, β, R y r", tipo:"Forma matricial", temas:["ce-dummies","inferencia"], ej:"ce-dummies",
enun:String.raw`<p>El modelo no restringido es \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\beta_kX_{kt}+\delta_kD_tX_{kt}+\mu_t\), con \(D_t=0\) para \(t=1,\dots,n_1\) y \(D_t=1\) para \(t=n_1+1,\dots,n\). <b>a)</b> Escríbalo como \(\mathbf y=X_{NR\_D}\boldsymbol\beta_{NR\_D}+\boldsymbol\mu\), especificando la matriz y el vector. <b>b)</b> La prueba \(H_0:\delta_1=\dots=\delta_k=0\) frente a \(H_1\): algún \(\delta_j\neq0\), escríbala como \(H_0:R\boldsymbol\beta_{NR\_D}=\mathbf r\), especificando R y r.</p>`,
saber:[String.raw`<b>Forma matricial:</b> cada fila de X tiene los regresores de una observación en el mismo orden que el vector de parámetros.`,
String.raw`<b>Restricciones lineales:</b> \(R\boldsymbol\beta=\mathbf r\). R tiene una fila por restricción (q filas) y una columna por parámetro. Cada fila "escoge" con un 1 el parámetro restringido.`,
String.raw`<b>Estadístico:</b> \(F=\dfrac{(R\mathbf b-\mathbf r)'[R(X'X)^{-1}R']^{-1}(R\mathbf b-\mathbf r)}{q\,s^2}\sim F(q,\,n-2k)\). Da lo mismo que la F con las RSS.`],
sol:String.raw`<h5>a) La matriz y el vector</h5><ol class="steps">
<li>Ordena los parámetros por pares: \(\boldsymbol\beta_{NR\_D}=(\beta_1,\delta_1,\beta_2,\delta_2,\dots,\beta_k,\delta_k)'\), de orden 2k × 1.</li>
<li>Cada fila de X lleva \((1,\;D_t,\;X_{2t},\;D_tX_{2t},\dots,X_{kt},\;D_tX_{kt})\). En las primeras n₁ filas D = 0, así que las columnas con D son cero; en las últimas n₂, D = 1 y esas columnas repiten las X:
<div class="mj">\[X_{NR\_D}=\begin{bmatrix}1&0&X_{2,1}&0&\cdots&X_{k,1}&0\\ \vdots&&&&&&\vdots\\ 1&0&X_{2,n_1}&0&\cdots&X_{k,n_1}&0\\ 1&1&X_{2,n_1+1}&X_{2,n_1+1}&\cdots&X_{k,n_1+1}&X_{k,n_1+1}\\ \vdots&&&&&&\vdots\\ 1&1&X_{2,n}&X_{2,n}&\cdots&X_{k,n}&X_{k,n}\end{bmatrix}_{n\times2k}\]</div></li>
<li>En bloques: \(X_{NR\_D}=\begin{bmatrix}X_1&\mathbf 0\\X_2&X_2\end{bmatrix}\) si se ordenan los parámetros como \((\beta_1,\dots,\beta_k,\delta_1,\dots,\delta_k)\), donde X₁ y X₂ son las matrices de cada periodo (con la columna de unos).</li></ol>
<h5>b) R y r</h5><ol class="steps">
<li>Hay q = k restricciones (una por cada δ), así que R es de orden k × 2k y r = 0 de orden k × 1.</li>
<li>Con el orden por pares, los δ están en las posiciones pares 2, 4, …, 2k:
<div class="mj">\[R=\begin{bmatrix}0&1&0&0&\cdots&0&0\\0&0&0&1&\cdots&0&0\\ \vdots&&&&\ddots&&\vdots\\0&0&0&0&\cdots&0&1\end{bmatrix}_{k\times2k},\qquad \mathbf r=\begin{bmatrix}0\\0\\ \vdots\\0\end{bmatrix}_{k\times1}\]</div></li>
<li>Comprueba: \(R\boldsymbol\beta_{NR\_D}=(\delta_1,\delta_2,\dots,\delta_k)'\), así que \(R\boldsymbol\beta=\mathbf r\) dice que todos los δ son cero.</li>
<li>Con el orden por bloques, \(R=[\,0_{k\times k}\;|\;I_k\,]\).</li>
<li><b>Ejemplo con k = 2</b> (modelo simple): \(R=\begin{bmatrix}0&1&0&0\\0&0&0&1\end{bmatrix}\) y \(\mathbf r=\begin{bmatrix}0\\0\end{bmatrix}\), es decir H₀: δ₁ = δ₂ = 0.</li></ol>`,
res:String.raw`<p>\(\mathbf y=X_{NR\_D}\boldsymbol\beta_{NR\_D}+\boldsymbol\mu\), con filas \((1,D_t,X_{2t},D_tX_{2t},\dots)\) y \(\boldsymbol\beta=(\beta_1,\delta_1,\dots,\beta_k,\delta_k)'\). H₀: Rβ = r, con R de orden k × 2k que tiene un 1 en la posición de cada δ, y r = 0.</p>`},

{id:"ep3-10", n:"10", t:"Solo cambia el intercepto (pendientes comunes)", tipo:"Forma matricial", temas:["ce-dummies"],
enun:String.raw`<p>Repita el ejercicio 9 para la prueba de cambio estructural en la que solo cambia el intercepto, con pendientes comunes.</p>`,
saber:[String.raw`El modelo de la alternativa tiene una sola dummy en el intercepto: \(Y_t=\beta_1+\delta_1D_t+\beta_2X_{2t}+\dots+\beta_kX_{kt}+\mu_t\).`,
String.raw`Es una sola restricción (q = 1), así que la F es el cuadrado de la t de δ₁.`],
sol:String.raw`<ol class="steps">
<li><b>Parámetros:</b> \(\boldsymbol\beta_{NR\_D}=(\beta_1,\delta_1,\beta_2,\dots,\beta_k)'\), de orden (k + 1) × 1.</li>
<li><b>Matriz:</b> cada fila es \((1,\;D_t,\;X_{2t},\dots,X_{kt})\):
<div class="mj">\[X_{NR\_D}=\begin{bmatrix}1&0&X_{2,1}&\cdots&X_{k,1}\\ \vdots&\vdots&&&\vdots\\1&0&X_{2,n_1}&\cdots&X_{k,n_1}\\1&1&X_{2,n_1+1}&\cdots&X_{k,n_1+1}\\ \vdots&\vdots&&&\vdots\\1&1&X_{2,n}&\cdots&X_{k,n}\end{bmatrix}_{n\times(k+1)}\]</div></li>
<li><b>Hipótesis:</b> H₀: δ₁ = 0 frente a H₁: δ₁ ≠ 0. \(R=[\,0\;\;1\;\;0\;\cdots\;0\,]_{1\times(k+1)}\) y r = 0, de modo que Rβ = δ₁.</li>
<li><b>Estadístico:</b> \(F=\dfrac{\hat\delta_1^2}{s^2[(X'X)^{-1}]_{22}}=t_{\delta_1}^2\sim F(1,\,n-k-1)\).</li>
<li><b>Variante:</b> si se parte del modelo completo del ejercicio 9 y se prueba solo δ₁ = 0, entonces R = [0 1 0 0 … 0] de orden 1 × 2k y los gl son (1, n − 2k).</li></ol>`,
res:String.raw`<p>Con \(\boldsymbol\beta=(\beta_1,\delta_1,\beta_2,\dots,\beta_k)'\) y filas \((1,D_t,X_{2t},\dots,X_{kt})\): R = [0 1 0 … 0], r = 0. Las rectas son paralelas y H₀ dice que además coinciden.</p>`},

{id:"ep3-11", n:"11", t:"Solo cambian las pendientes (intercepto común)", tipo:"Forma matricial", temas:["ce-dummies"],
enun:String.raw`<p>Repita el ejercicio 9 para la prueba de cambio estructural en la que solo cambian los coeficientes de las pendientes, con intercepto común.</p>`,
saber:[String.raw`El modelo de la alternativa interactúa D solo con las X: \(Y_t=\beta_1+\beta_2X_{2t}+\delta_2D_tX_{2t}+\dots+\beta_kX_{kt}+\delta_kD_tX_{kt}+\mu_t\).`,
String.raw`Son k − 1 restricciones, una por cada pendiente.`],
sol:String.raw`<ol class="steps">
<li><b>Parámetros:</b> \(\boldsymbol\beta_{NR\_D}=(\beta_1,\beta_2,\delta_2,\dots,\beta_k,\delta_k)'\), de orden (2k − 1) × 1.</li>
<li><b>Matriz:</b> cada fila es \((1,\;X_{2t},\;D_tX_{2t},\dots,X_{kt},\;D_tX_{kt})\). En las primeras n₁ filas las columnas \(D_tX_{jt}\) valen 0 y en las últimas n₂ repiten las X.</li>
<li><b>Hipótesis:</b> H₀: δ₂ = … = δ_k = 0 frente a H₁: algún δ_j ≠ 0. R es de orden (k − 1) × (2k − 1), con un 1 en la posición de cada δ, y r = 0 de orden (k − 1) × 1.</li>
<li><b>Ejemplo con k = 2:</b> \(\boldsymbol\beta=(\beta_1,\beta_2,\delta_2)'\), R = [0 0 1] y r = 0, es decir H₀: δ₂ = 0.</li>
<li><b>Estadístico:</b> \(F\sim F(k-1,\,n-2k+1)\). Partiendo del modelo completo del ejercicio 9, son las filas de R que escogen δ₂, …, δ_k, con gl (k − 1, n − 2k).</li></ol>`,
res:String.raw`<p>Con filas \((1,X_{2t},D_tX_{2t},\dots)\): H₀: δ₂ = … = δ_k = 0, con R de orden (k − 1) × (2k − 1) y r = 0. Las rectas parten del mismo intercepto y H₀ dice que tienen la misma pendiente.</p>`},

{id:"ep3-12", n:"12", t:"Nerlove: homogeneidad en precios con las pruebas W, LR y LM", tipo:"Restricciones lineales", temas:["inferencia","especificacion"], ej:"inferencia", tool:{id:"t-calc",pre:"wlm:e12",lbl:"Abrir en la Calculadora (Wald, LR y LM)"},
enun:String.raw`<p>Nerlove estimó la función de costos \(Y=AX^{\beta_2}P_1^{\beta_3}P_2^{\beta_4}P_3^{\beta_5}\mu\) con 29 empresas. Modelo 1 (en logaritmos):</p>
<div class="mj">\[\widehat{\ln Y}=\underset{(1{,}96)}{-4{,}93}+\underset{(0{,}11)}{0{,}94}\ln X+\underset{(0{,}23)}{0{,}31}\ln P_1-\underset{(0{,}29)}{0{,}26}\ln P_2+\underset{(0{,}07)}{0{,}44}\ln P_3,\qquad RSS=0{,}336\]</div>
<p>Modelo 2, con la restricción β₃ + β₄ + β₅ = 1:</p>
<div class="mj">\[\widehat{\ln(Y/P_3)}=\underset{(0{,}16)}{-6{,}55}+\underset{(0{,}11)}{0{,}91}\ln X+\underset{(0{,}19)}{0{,}51}\ln(P_1/P_3)+\underset{(0{,}016)}{0{,}09}\ln(P_2/P_3),\qquad RSS=0{,}364\]</div>
<p><b>a)</b> Interprete los resultados. <b>b)</b> ¿Cómo averiguaría si la restricción es válida? Haga las pruebas LR, Wald y LM.</p>`,
saber:[String.raw`<b>Modelo log-log:</b> cada coeficiente es una elasticidad: β₂ = %Δcosto / %Δproducto.`,
String.raw`<b>Homogeneidad de grado 1 en precios:</b> si todos los precios suben 1 %, el costo sube 1 %. Eso exige β₃ + β₄ + β₅ = 1.`,
String.raw`<b>Pruebas asintóticas</b> con q restricciones, ~χ²(q): \(W=n\dfrac{RSS_R-RSS_{NR}}{RSS_{NR}}\), \(LR=n\ln\dfrac{RSS_R}{RSS_{NR}}\) y \(LM=n\dfrac{RSS_R-RSS_{NR}}{RSS_R}\). Siempre se cumple W ≥ LR ≥ LM.`,
String.raw`<b>F exacta:</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\), con k = 5.`],
sol:String.raw`<h5>a) Interpretación</h5><ol class="steps">
<li><b>Modelo 1.</b> Elasticidad costo-producto 0,94 (t = 8,5): si la producción sube 1 %, el costo sube 0,94 %. Como es menor que 1, hay rendimientos crecientes a escala leves (1/0,94 ≈ 1,06).</li>
<li>Elasticidades precio: trabajo 0,31 (t = 1,35, no significativa), capital −0,26 (signo contrario al esperado, pero t = −0,90, no significativa) y combustible 0,44 (t = 6,3). Suman 0,49, lejos de 1 en apariencia.</li>
<li><b>Modelo 2.</b> Al imponer la homogeneidad, la elasticidad al producto es 0,91. Las de precio son 0,51 (trabajo), 0,09 (capital, ahora con el signo correcto) y, por la restricción, 1 − 0,51 − 0,09 = 0,40 (combustible).</li></ol>
<h5>b) ¿Es válida la restricción?</h5><ol class="steps">
<li>H₀: β₃ + β₄ + β₅ = 1 frente a H₁: β₃ + β₄ + β₅ ≠ 1, con q = 1, n = 29, \(RSS_R=0{,}364\) (modelo 2) y \(RSS_{NR}=0{,}336\) (modelo 1).</li>
<li>\(W=29\,\dfrac{0{,}364-0{,}336}{0{,}336}=2{,}417\).</li>
<li>\(LR=29\ln\dfrac{0{,}364}{0{,}336}=2{,}321\).</li>
<li>\(LM=29\,\dfrac{0{,}364-0{,}336}{0{,}364}=2{,}231\).</li>
<li>\(\chi^2_{0{,}05}(1)=3{,}841\). Las tres son menores, así que no se rechaza H₀. Se cumple W ≥ LR ≥ LM.</li>
<li>F exacta: \(F=\dfrac{0{,}028/1}{0{,}336/24}=2{,}00&lt;F_{0{,}05}(1,24)=4{,}26\). La misma conclusión.</li></ol>`,
res:String.raw`<p>W = 2,417, LR = 2,321 y LM = 2,231, todos menores que χ²(1) = 3,84 (y F = 2,0 &lt; 4,26). No se rechaza la homogeneidad de grado uno en precios, así que el modelo 2 es aceptable y corrige el signo del precio del capital.</p>`},

{id:"ep3-13", n:"13", t:"Reforma laboral de 2020: dummy en el intercepto", tipo:"Planteamiento", temas:["dicotomicas"],
enun:String.raw`<p>Con datos anuales 1990-2025, el modelo es \(Y_t=\beta_1+\beta_2X_t+\mu_t\) (Y: salario, X: experiencia). En 2020 hubo una reforma laboral. <b>a)</b> Defina una dummy para este hecho. <b>b)</b> Escriba un modelo que permita un cambio en el intercepto. <b>c)</b> Explique el coeficiente de la dummy.</p>`,
saber:[String.raw`Una dummy de quiebre vale 0 antes del evento y 1 desde el evento. Si solo multiplica al intercepto, desplaza la recta en paralelo.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(D_t=\begin{cases}1 & t\ge2020\\0 & t<2020\end{cases}\)</li>
<li><b>b)</b> \(Y_t=\beta_1+\delta D_t+\beta_2X_t+\mu_t\).</li>
<li><b>c)</b> Antes de la reforma, \(E(Y_t)=\beta_1+\beta_2X_t\); después, \((\beta_1+\delta)+\beta_2X_t\). δ es el cambio en el salario esperado después de la reforma <b>para un mismo nivel de experiencia</b>. Si δ &gt; 0, la reforma subió los salarios; el efecto de la experiencia (β₂) no cambia.</li>
<li>Para saber si el efecto existe: t de δ, con H₀: δ = 0 y n − 3 gl.</li></ol>`,
res:String.raw`<p>D = 1 desde 2020. Con \(Y=\beta_1+\delta D+\beta_2X+\mu\), δ es el desplazamiento del salario medio después de la reforma, con la misma experiencia.</p>`},

{id:"ep3-14", n:"14", t:"Cambio después de un evento: intercepto y pendiente", tipo:"Planteamiento", temas:["dicotomicas","chow"],
enun:String.raw`<p>En \(Y_t=\beta_1+\beta_2X_t+\mu_t\) (Y: salario, X: ingreso) se sospecha que después de un evento ocurrido en el año t* (por ejemplo, una crisis) cambia el modelo. <b>a)</b> Defina una dummy. <b>b)</b> Escriba un modelo con la dummy que permita identificar el cambio. <b>c)</b> Explique sus coeficientes.</p>`,
saber:[String.raw`Para que cambie todo el modelo, la dummy entra sola (intercepto) y multiplicando a X (pendiente). Probar que ambos δ son cero es la prueba de Chow.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> \(D_t=1\) si \(t\ge t^*\) y 0 antes.</li>
<li><b>b)</b> \(Y_t=\beta_1+\delta_1D_t+\beta_2X_t+\delta_2D_tX_t+\mu_t\).</li>
<li><b>c)</b> Antes: \(\beta_1+\beta_2X\). Después: \((\beta_1+\delta_1)+(\beta_2+\delta_2)X\).<br>β₁ y β₂ son el intercepto y el efecto marginal del ingreso antes del evento. δ₁ es el cambio del intercepto y δ₂ el cambio del efecto marginal después del evento.</li>
<li>Pruebas: δ₁ = 0 (t), δ₂ = 0 (t) y δ₁ = δ₂ = 0 (F con q = 2, igual a la F de Chow).</li></ol>`,
res:String.raw`<p>\(Y=\beta_1+\delta_1D+\beta_2X+\delta_2DX+\mu\), con D = 1 desde t*: δ₁ cambia el intercepto y δ₂ la pendiente. H₀: δ₁ = δ₂ = 0 es la prueba de Chow.</p>`},

{id:"ep3-15", n:"15", t:"Consumo antes y después de una reforma", tipo:"Interpretación", temas:["dicotomicas"], tool:{id:"t-calc",pre:"coef:e15",lbl:"Abrir en la Calculadora (modelo ya estimado)"},
enun:String.raw`<p>\(\hat Y_t=2+0{,}5X_t+2{,}5D_t-0{,}25(D_tX_t)\), con D = 1 después de una reforma, Y el consumo y X la renta. <b>a)</b> Interprete los coeficientes. <b>b)</b> Escriba la ecuación antes y después. <b>c)</b> ¿Cómo cambia el intercepto? <b>d)</b> ¿Y la pendiente? <b>e)</b> Dé una interpretación económica.</p>`,
saber:[String.raw`La regla de siempre: D = 0 es el grupo base; el coeficiente de D cambia el intercepto y el de D·X cambia la pendiente.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> 2 es el consumo autónomo antes de la reforma; 0,5 la propensión marginal a consumir antes; 2,5 el aumento del consumo autónomo con la reforma; −0,25 la disminución de la propensión marginal con la reforma.</li>
<li><b>b)</b> Antes (D = 0): \(\hat Y=2+0{,}5X\). Después (D = 1): \(\hat Y=(2+2{,}5)+(0{,}5-0{,}25)X=4{,}5+0{,}25X\).</li>
<li><b>c)</b> El intercepto sube 2,5, de 2 a 4,5.</li>
<li><b>d)</b> La pendiente baja 0,25, de 0,5 a 0,25: la propensión marginal se reduce a la mitad.</li>
<li><b>e)</b> Las rectas se cruzan donde \(2+0{,}5X=4{,}5+0{,}25X\), es decir en X = 10. Con rentas menores que 10, el consumo es mayor después de la reforma; con rentas mayores, es menor. La reforma hace el consumo menos sensible a la renta, como lo haría, por ejemplo, un impuesto progresivo con transferencias a los hogares de menor renta.</li></ol>`,
res:String.raw`<p>Antes: \(\hat Y=2+0{,}5X\). Después: \(\hat Y=4{,}5+0{,}25X\). El consumo autónomo sube 2,5, la propensión marginal cae a la mitad y las rectas se cruzan en X = 10.</p>`},

{id:"ep3-16", n:"16", t:"Dummies estacionales trimestrales", tipo:"Interpretación", temas:["dicotomicas","series"], ej:"series",
enun:String.raw`<p>Con datos trimestrales 1998-2008 de demanda Y e ingreso X, y \(S_{jt}=1\) si t está en el trimestre j, se estiman:</p>
<div class="mj">\[(1)\;Y_t=\delta_1S_{1t}+\delta_2S_{2t}+\delta_3S_{3t}+\delta_4S_{4t}+\mu_t\qquad(2)\;Y_t=\beta_1+\theta_2S_{2t}+\theta_3S_{3t}+\theta_4S_{4t}+\mu_t\]\[(3)\;Y_t=\beta_1+\theta_1(S_{1t}X_t)+\theta_2(S_{2t}X_t)+\theta_3(S_{3t}X_t)+\theta_4(S_{4t}X_t)+\mu_t\]</div>
<p><b>a)</b> Interprete (1) y explique por qué no lleva intercepto. <b>b)</b> ¿Cómo se relacionan los coeficientes de (1) y (2)? <b>c)</b> Interprete (3) y explique por qué no se puede incluir \(X_t\).</p>`,
saber:[String.raw`\(S_1+S_2+S_3+S_4=1\) en cada trimestre: las cuatro dummies suman la columna de unos.`,
String.raw`Con solo dummies como regresores, cada coeficiente es una media de grupo (punto 7).`,
String.raw`<b>Multicolinealidad perfecta:</b> si una columna es combinación lineal exacta de otras, X′X no es invertible.`],
sol:String.raw`<ol class="steps">
<li><b>a)</b> δⱼ es la demanda media del trimestre j: \(\hat\delta_j=\bar Y_j\). No lleva intercepto porque \(S_1+S_2+S_3+S_4=1\). Con intercepto, la columna de unos sería la suma de las cuatro dummies (trampa de las dicótomas) y X′X no tendría inversa.</li>
<li><b>b)</b> En (2) el trimestre 1 es la base: \(\beta_1=\delta_1\) y \(\theta_j=\delta_j-\delta_1\) para j = 2, 3, 4. θⱼ es cuánto más (o menos) se demanda en el trimestre j que en el primero. Los dos modelos dan los mismos valores ajustados.</li>
<li><b>c)</b> En (3) el intercepto β₁ es común y θⱼ es el efecto marginal del ingreso en el trimestre j: la sensibilidad de la demanda al ingreso cambia con la estación. No se puede incluir \(X_t\) porque \(S_1X+S_2X+S_3X+S_4X=X\): la columna X sería la suma de las cuatro interacciones.</li></ol>`,
res:String.raw`<p>(1): δⱼ es la media del trimestre j, sin intercepto para evitar la trampa de las dicótomas. (2): β₁ = δ₁ y θⱼ = δⱼ − δ₁. (3): una pendiente del ingreso por trimestre; X no entra porque es la suma de las interacciones.</p>`});
TALLERES.push({id:"tl-dinardo", t:"Dinardo, capítulo 4", nl:"problema", sub:"Problemas 4.1 a 4.10 (Johnston y Dinardo)", anchor:"chow",
intro:`Los diez problemas del capítulo 4 que pide el taller. Los problemas 4.5 y 4.6 usan la tabla 4.4 del libro, que no viene en el taller: se deja el método para aplicarlo cuando tengas los datos.`,
puntos:[
{id:"d-41", n:"4.1", t:"Prueba de pronósticos con una observación nueva", tipo:"Pronósticos de Chow con matrices", temas:["ce-pronosticos","matrices"], tool:{id:"t-calc",pre:"mat:d41",lbl:"Abrir en la Calculadora (matrices)"},
enun:String.raw`<p>Una regresión simple con 20 observaciones da \(X'X=\begin{bmatrix}20&10\\10&30\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}30\\40\end{bmatrix}\) y \(\mathbf y'\mathbf y=75\). Llega una observación nueva con X = 2 y Y = 4. Haga una prueba de Chow de constancia de los parámetros.</p>`,
saber:[String.raw`\(\mathbf b=(X'X)^{-1}X'\mathbf y\), \(RSS=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y\) y \(s^2=RSS/(n-k)\).`,
String.raw`<b>Inversa 2 × 2:</b> \(\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\dfrac1{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}\).`,
String.raw`<b>Pronósticos de Chow con n₂ = 1:</b> \(F=\dfrac{d^2}{s^2[1+\mathbf x_0'(X'X)^{-1}\mathbf x_0]}\sim F(1,\,n-k)\), con \(d=y_0-\mathbf x_0'\mathbf b\) (punto 1 de los Ejercicios propuestos 3).`],
sol:String.raw`<ol class="steps">
<li>\(\det(X'X)=20(30)-10(10)=500\), así que \((X'X)^{-1}=\dfrac1{500}\begin{bmatrix}30&-10\\-10&20\end{bmatrix}\).</li>
<li>\(\mathbf b=\dfrac1{500}\begin{bmatrix}30(30)-10(40)\\-10(30)+20(40)\end{bmatrix}=\dfrac1{500}\begin{bmatrix}500\\500\end{bmatrix}=\begin{bmatrix}1\\1\end{bmatrix}\), es decir \(\hat Y=1+X\).</li>
<li>\(RSS=75-(1\cdot30+1\cdot40)=5\) y \(s^2=5/(20-2)=0{,}2778\).</li>
<li>Pronóstico: \(\hat y_0=1+1(2)=3\), así que el error es d = 4 − 3 = 1.</li>
<li>\(\mathbf x_0'(X'X)^{-1}\mathbf x_0=\dfrac{30(1)-2(10)(1)(2)+20(2^2)}{500}=\dfrac{70}{500}=0{,}14\), y el factor es 1,14.</li>
<li>\(F=\dfrac{1^2}{0{,}2778(1{,}14)}=3{,}158\sim F(1,18)\). Equivale a t = 1,777.</li>
<li>\(F_{0{,}05}(1,18)=4{,}414\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 3,158 &lt; 4,414: la observación nueva es compatible con la relación estimada \(\hat Y=1+X\). No hay evidencia de cambio en los parámetros.</p>`},

{id:"d-42", n:"4.2", t:"Estacionalidad y estabilidad con sumas de cuadrados", tipo:"Pruebas F con RSS", temas:["chow","dicotomicas","series"], tool:{id:"t-calc",pre:"rss:d42",lbl:"Abrir la parte de estabilidad en la Calculadora"},
enun:String.raw`<p>Con datos trimestrales 1958-1976 se estimó \(\hat Y=2{,}20+0{,}104X_2-3{,}48X_3+0{,}34X_4\), con ESS = 109,6 y RSS = 18,48. Al agregar tres dummies estacionales, la ESS sube a 114,8. Pruebe si hay estacionalidad. Las regresiones de los subperiodos 1958.1-1968.4 y 1969.1-1976.4 dan RSS de 9,32 y 7,46. Pruebe la constancia de la relación entre los dos subperiodos.</p>`,
saber:[String.raw`n = 19 años × 4 = 76 trimestres; subperiodos de 44 y 32. El modelo base tiene k = 4.`,
String.raw`<b>Con la misma variable dependiente, la TSS no cambia:</b> TSS = ESS + RSS = 128,08, así que si la ESS sube, la RSS baja lo mismo.`,
String.raw`<b>F de restricciones:</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k_{NR})}\). <b>Chow:</b> \(F=\dfrac{(RSS_R-RSS_1-RSS_2)/k}{(RSS_1+RSS_2)/(n-2k)}\).`],
sol:String.raw`<h5>Estacionalidad</h5><ol class="steps">
<li>H₀: los coeficientes de las tres dummies estacionales valen 0, con q = 3.</li>
<li>TSS = 109,6 + 18,48 = 128,08. Con las dummies, \(RSS_{NR}=128{,}08-114{,}8=13{,}28\) y \(k_{NR}=7\).</li>
<li>\(F=\dfrac{(18{,}48-13{,}28)/3}{13{,}28/(76-7)}=\dfrac{1{,}7333}{0{,}1925}=9{,}01\sim F(3,69)\).</li>
<li>\(F_{0{,}05}(3,69)=2{,}74\), así que se rechaza H₀: hay estacionalidad.</li></ol>
<h5>Estabilidad entre subperiodos</h5><ol class="steps">
<li>H₀: los cuatro coeficientes son iguales en los dos subperiodos, con q = k = 4.</li>
<li>\(RSS_R=18{,}48\) (modelo original) y \(RSS_1+RSS_2=9{,}32+7{,}46=16{,}78\).</li>
<li>\(F=\dfrac{(18{,}48-16{,}78)/4}{16{,}78/(76-8)}=\dfrac{0{,}425}{0{,}2468}=1{,}72\sim F(4,68)\).</li>
<li>\(F_{0{,}05}(4,68)=2{,}51\), así que no se rechaza H₀: la relación es estable.</li></ol>`,
res:String.raw`<p>Estacionalidad: F = 9,01 &gt; 2,74, así que sí hay estacionalidad. Estabilidad: F = 1,72 &lt; 2,51, así que la relación es la misma en los dos subperiodos.</p>`},

{id:"d-43", n:"4.3", t:"Ventas de gasolina con dummies estacionales", tipo:"Interpretación y predicción", temas:["dicotomicas","series"],
enun:String.raw`<p>\(\hat Q=70-0{,}01P+0{,}2Y-1{,}5S_1+3{,}6S_2+4{,}7S_3\). Para el año siguiente, P = 110, 116, 122, 114 y Y = 100, 102, 104, 103 en los trimestres 1 a 4. Calcule las ventas esperadas de cada trimestre. ¿Qué ecuación obtendría otra investigadora que use \(S_2,S_3,S_4\)? ¿Y otro que suprima el intercepto y use las cuatro dummies?</p>`,
saber:[String.raw`El trimestre omitido (aquí el 4) es la base: su intercepto es 70. El de cada trimestre j es 70 + coeficiente de Sⱼ.`,
String.raw`Cambiar la base o quitar el intercepto es una reparametrización: las predicciones no cambian.`],
sol:String.raw`<ol class="steps">
<li>Interceptos por trimestre: T1 = 70 − 1,5 = 68,5; T2 = 73,6; T3 = 74,7; T4 = 70.</li>
<li>Predicciones:<br>T1: 68,5 − 0,01(110) + 0,2(100) = 87,40<br>T2: 73,6 − 1,16 + 20,4 = 92,84<br>T3: 74,7 − 1,22 + 20,8 = 94,28<br>T4: 70 − 1,14 + 20,6 = 89,46</li>
<li>Con base en el trimestre 1, cada coeficiente es la diferencia con 68,5: \(\hat Q=68{,}5-0{,}01P+0{,}2Y+5{,}1S_2+6{,}2S_3+1{,}5S_4\).</li>
<li>Sin intercepto y con las cuatro: \(\hat Q=-0{,}01P+0{,}2Y+68{,}5S_1+73{,}6S_2+74{,}7S_3+70S_4\).</li></ol>`,
res:String.raw`<p>Ventas esperadas: 87,40; 92,84; 94,28 y 89,46. Las tres versiones dan las mismas predicciones; solo cambia cómo se lee cada coeficiente.</p>`},

{id:"d-44", n:"4.4", t:"Dummies de clase: el intercepto es la media de la base", tipo:"Demostración", temas:["dicotomicas"],
enun:String.raw`<p>El modelo \(Y=\alpha_1+\gamma_2E_2+\gamma_3E_3+u\) se estima por MCO, con E₂ y E₃ dummies de las clases educativas 2 y 3. Muestre que \(\hat\alpha_1=\bar Y_1\), \(\hat\gamma_2=\bar Y_2-\bar Y_1\) y \(\hat\gamma_3=\bar Y_3-\bar Y_1\).</p>`,
saber:[String.raw`Es el literal b del punto 7 de los Ejercicios propuestos 3. Se usan las sumas de dummies excluyentes: \(\sum E_j=n_j\), \(\sum E_2E_3=0\) y \(\sum E_jY=n_j\bar Y_j\).`],
sol:String.raw`<ol class="steps">
<li>\(X'X=\begin{bmatrix}n&n_2&n_3\\n_2&n_2&0\\n_3&0&n_3\end{bmatrix}\) y \(X'\mathbf y=\begin{bmatrix}n_1\bar Y_1+n_2\bar Y_2+n_3\bar Y_3\\n_2\bar Y_2\\n_3\bar Y_3\end{bmatrix}\).</li>
<li>Filas 2 y 3: \(\hat\alpha_1+\hat\gamma_2=\bar Y_2\) y \(\hat\alpha_1+\hat\gamma_3=\bar Y_3\).</li>
<li>Fila 1: \(n\hat\alpha_1+n_2\hat\gamma_2+n_3\hat\gamma_3=\sum Y\). Sustituye las filas 2 y 3: \(n\hat\alpha_1+n_2(\bar Y_2-\hat\alpha_1)+n_3(\bar Y_3-\hat\alpha_1)=n_1\bar Y_1+n_2\bar Y_2+n_3\bar Y_3\).</li>
<li>Simplifica con \(n-n_2-n_3=n_1\): \(n_1\hat\alpha_1=n_1\bar Y_1\), así que \(\hat\alpha_1=\bar Y_1\). Luego \(\hat\gamma_j=\bar Y_j-\bar Y_1\).</li></ol>`,
res:String.raw`<p>El intercepto es la media de la clase omitida y cada γ la diferencia de medias con ella.</p>`},

{id:"d-45", n:"4.5", t:"Tabla 4.4: medias por educación y sexo", tipo:"Necesita la tabla 4.4 del libro", temas:["dicotomicas"], tool:{id:"t-datos",lbl:"Abrir el Laboratorio para cargar la tabla 4.4"},
enun:String.raw`<p>Con los datos de la tabla 4.4, estime \(Y=\alpha_1E_1+\alpha_2E_2+\alpha_3E_3+\beta_2S_2+u\) y calcule las medias resultantes de la tabla 4.5. Compárelas con las del texto y comente. Repita con \(Y=\mu+\alpha_1E_1+\alpha_2E_2+\beta_2S_2+u\).</p>`,
saber:[String.raw`Primera especificación: sin intercepto y con las tres dummies de educación, así que cada αⱼ es el intercepto de la clase j para el sexo base (S₂ = 0), y β₂ es la diferencia por sexo, igual en todas las clases.`,
String.raw`Segunda especificación: con intercepto μ, la clase 3 es la base: μ = α₃ de la primera, y los α son diferencias frente a la clase 3.`],
sol:String.raw`<ol class="steps">
<li>Carga la tabla 4.4 en el Laboratorio: Y, una columna por clase educativa (0/1) y la de sexo.</li>
<li>Estima la primera especificación quitando el intercepto (opción «Con intercepto» desmarcada) con E₁, E₂, E₃ y S₂.</li>
<li>Media estimada de cada celda: \(\hat\alpha_j\) para S₂ = 0 y \(\hat\alpha_j+\hat\beta_2\) para S₂ = 1. Arma la tabla 2 × 3 y compárala con la del texto.</li>
<li>Las medias estimadas no coinciden exactamente con las observadas de cada celda: el modelo impone la misma brecha por sexo en todas las clases (sin interacción), como en el literal c del punto 7.</li>
<li>Segunda especificación: \(\hat\mu=\hat\alpha_3\), y los nuevos coeficientes de E₁ y E₂ son \(\hat\alpha_1-\hat\alpha_3\) y \(\hat\alpha_2-\hat\alpha_3\). Las medias estimadas son idénticas.</li></ol>`,
res:String.raw`<p>Las dos especificaciones dan las mismas medias estimadas. Difieren de las observadas porque el modelo no tiene interacción entre educación y sexo. Los números exactos requieren la tabla 4.4 del libro.</p>`},

{id:"d-46", n:"4.6", t:"Tabla 4.4 con interacciones y sin constante", tipo:"Necesita la tabla 4.4 del libro", temas:["dicotomicas"], tool:{id:"t-datos",lbl:"Abrir el Laboratorio para cargar la tabla 4.4"},
enun:String.raw`<p>Con los datos de la tabla 4.4, estime una especificación sin término constante, con dummies que permitan efectos de interacción. Calcule la versión resultante de la tabla 4.6 y compárela con la del texto.</p>`,
saber:[String.raw`Con una dummy por cada celda (clase × sexo) y sin intercepto, cada coeficiente es la media de su celda (como en el punto 7a, ahora con 6 grupos).`],
sol:String.raw`<ol class="steps">
<li>Crea en el Laboratorio las 6 interacciones \(E_j\cdot S_1\) y \(E_j\cdot S_2\), con j = 1, 2, 3 (sección «2. Crear variables», por ejemplo <code>E1*S2</code>).</li>
<li>Estima Y sobre las 6 interacciones sin intercepto. X′X es diagonal con el tamaño de cada celda, así que cada coeficiente es la media observada de la celda.</li>
<li>La tabla 4.6 resultante coincide con las medias observadas por celda. Ahora la brecha por sexo puede ser distinta en cada clase educativa.</li>
<li>Para probar si hace falta la interacción, compara este modelo (no restringido) con el del problema 4.5 (restringido) mediante una F con q = 2.</li></ol>`,
res:String.raw`<p>Con interacciones completas y sin constante, cada coeficiente es la media de su celda. Los números requieren la tabla 4.4 del libro.</p>`},

{id:"d-47", n:"4.7", t:"Familias con aumento de ingreso: ¿consumen distinto?", tipo:"Prueba de Chow con datos", temas:["chow","dicotomicas"], tool:{id:"t-datos",pre:"familias",lbl:"Cargar estos datos en el Laboratorio"},
enun:String.raw`<p>Hay 12 familias con su consumo semanal Y y su ingreso X: (70, 80), (76, 95*), (91, 105), (100, 115), (105, 125*), (113, 135*), (122, 145), (120, 155), (146, 165*), (135, 175*), (147, 185*), (155, 200*). El asterisco indica que la familia tuvo un aumento de ingreso. Con una función de consumo lineal, pruebe si el comportamiento de las familias con aumento difiere del de las demás.</p>`,
saber:[String.raw`Los grupos no están ordenados: se define D = 1 para las familias con aumento y se usa el modelo con dummies, o se estima cada grupo por separado.`,
String.raw`<b>Chow:</b> k = 2 y n − 2k = 8 gl. Para probar solo un intercepto distinto, q = 1 en el modelo con D sin interacción.`],
sol:String.raw`<ol class="steps">
<li>H₀: δ₁ = δ₂ = 0 en \(Y=\beta_1+\delta_1D+\beta_2X+\delta_2DX+u\) (el mismo comportamiento) frente a H₁: alguna diferencia.</li>
<li>Sin aumento (n = 5): \(\hat Y=16{,}762+0{,}6986X\) y RSS = 57,193. Con aumento (n = 7): \(\hat Y=10{,}306+0{,}7452X\) y RSS = 247,900. \(RSS_{NR}=305{,}094\).</li>
<li>Restringido: \(\hat Y=13{,}013+0{,}7285X\) y \(RSS_R=310{,}969\).</li>
<li>\(F=\dfrac{(310{,}969-305{,}094)/2}{305{,}094/8}=\dfrac{2{,}938}{38{,}137}=0{,}077\sim F(2,8)\), con crítico 4,459 y p = 0,93. No se rechaza H₀.</li>
<li>Solo intercepto distinto: \(\hat Y=12{,}892-0{,}374D+0{,}731X\), RSS = 310,653 y \(F=\dfrac{(310{,}969-310{,}653)/1}{310{,}653/9}=0{,}009&lt;F(1,9)=5{,}117\).</li></ol>`,
res:String.raw`<p>F = 0,077 (p = 0,93): las familias que tuvieron aumento de ingreso no se comportan distinto. Tampoco difiere el consumo autónomo (F = 0,009).</p>`},

{id:"d-48", n:"4.8", t:"Función de producción: estabilidad entre 1929-1948 y 1949-1967", tipo:"Chow con s", temas:["chow"], tool:{id:"t-calc",pre:"rss:d48",lbl:"Abrir en la Calculadora (RSS o s)"},
enun:String.raw`<p>Con datos anuales 1929-1967 (n = 39), \(\widehat{\log Q}=-3{,}8766+1{,}4106\log L+0{,}4162\log K\), con R² = 0,9937 y s = 0,03755. En 1929-1948: \(-4{,}0576+1{,}6167\log L+0{,}2197\log K\), con s = 0,04573. En 1949-1967: \(-1{,}9564+0{,}8336\log L+0{,}6631\log K\), con s = 0,02185. Pruebe la estabilidad de la función de producción entre los dos subperiodos.</p>`,
saber:[String.raw`<b>RSS a partir de s:</b> \(s^2=RSS/(n-k)\), así que \(RSS=s^2(n-k)\). Aquí k = 3.`,
String.raw`n₁ = 20 (1929-1948) y n₂ = 19 (1949-1967).`],
sol:String.raw`<ol class="steps">
<li>\(RSS_R=0{,}03755^2(39-3)=0{,}050760\).</li>
<li>\(RSS_1=0{,}04573^2(20-3)=0{,}035551\) y \(RSS_2=0{,}02185^2(19-3)=0{,}007639\). En total, \(RSS_{NR}=0{,}043190\).</li>
<li>\(F=\dfrac{(0{,}050760-0{,}043190)/3}{0{,}043190/(39-6)}=\dfrac{0{,}002523}{0{,}001309}=1{,}93\sim F(3,33)\).</li>
<li>\(F_{0{,}05}(3,33)=2{,}89\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 1,93 &lt; 2,89: la función de producción es estable entre los dos subperiodos, aunque las elasticidades puntuales parezcan distintas.</p>`},

{id:"d-49", n:"4.9", t:"Urbano y rural con información resumida", tipo:"Chow con matrices", temas:["chow","matrices"], tool:{id:"t-calc",pre:"mat:d49",lbl:"Abrir en la Calculadora (matrices)"},
enun:String.raw`<p>Hay 10 observaciones urbanas con \(X'X=\begin{bmatrix}20&20\\20&25\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}10\\20\end{bmatrix}\) y \(\mathbf y'\mathbf y=30\), y 10 rurales con \(X'X=\begin{bmatrix}10&10\\10&20\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}8\\20\end{bmatrix}\) y \(\mathbf y'\mathbf y=24\). Pruebe que la misma relación vale en las dos áreas.</p>`,
saber:[String.raw`<b>Las matrices de momentos se suman:</b> si se apilan las muestras, \(X'X=X_1'X_1+X_2'X_2\), \(X'\mathbf y=X_1'\mathbf y_1+X_2'\mathbf y_2\) y \(\mathbf y'\mathbf y=\mathbf y_1'\mathbf y_1+\mathbf y_2'\mathbf y_2\). Así se obtiene el restringido sin los datos.`,
String.raw`\(RSS=\mathbf y'\mathbf y-\mathbf b'X'\mathbf y\) en cada muestra.`],
sol:String.raw`<ol class="steps">
<li><b>Urbano:</b> \(\det=20(25)-20(20)=100\), así que \(\mathbf b_1=\dfrac1{100}\begin{bmatrix}25&-20\\-20&20\end{bmatrix}\begin{bmatrix}10\\20\end{bmatrix}=\begin{bmatrix}-1{,}5\\2\end{bmatrix}\). \(RSS_1=30-(-1{,}5\cdot10+2\cdot20)=5\).</li>
<li><b>Rural:</b> \(\det=100\), así que \(\mathbf b_2=\dfrac1{100}\begin{bmatrix}20&-10\\-10&10\end{bmatrix}\begin{bmatrix}8\\20\end{bmatrix}=\begin{bmatrix}-0{,}4\\1{,}2\end{bmatrix}\). \(RSS_2=24-(-3{,}2+24)=3{,}2\).</li>
<li><b>Restringido:</b> \(X'X=\begin{bmatrix}30&30\\30&45\end{bmatrix}\), \(X'\mathbf y=\begin{bmatrix}18\\40\end{bmatrix}\) y \(\mathbf y'\mathbf y=54\). \(\mathbf b=(-0{,}8667;\;1{,}4667)\) y \(RSS_R=54-(-15{,}6+58{,}667)=10{,}933\).</li>
<li>\(F=\dfrac{(10{,}933-8{,}2)/2}{8{,}2/16}=\dfrac{1{,}367}{0{,}5125}=2{,}667\sim F(2,16)\).</li>
<li>\(F_{0{,}05}(2,16)=3{,}63\), así que no se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 2,667 &lt; 3,63: la misma relación vale en las áreas urbana y rural.</p>`},

{id:"d-410", n:"4.10", t:"Gasto en vacaciones por grupos de ingreso y elasticidad común", tipo:"Chow con varianzas y prueba t", temas:["chow","inferencia"], tool:{id:"t-calc",pre:"rss:d410",lbl:"Abrir en la Calculadora (RSS o varianzas)"},
enun:String.raw`<p>En 256 hogares, las regresiones log-log de gasto en vacaciones sobre ingreso dan: ingreso bajo, pendiente 0,02, varianza residual 0,26 y 102 hogares; medio, 0,09, 0,42 y 102; alto, 0,14, 0,30 y 52; todos, 0,07, 0,38 y 256. Pruebe si la función de gasto es la misma en todos los grupos. ¿Qué información adicional necesitaría para probar si la elasticidad es la misma? Si la varianza del log del ingreso en la muestra completa es 24, pruebe que la elasticidad para todos los hogares es 0,10.</p>`,
saber:[String.raw`<b>RSS a partir de la varianza residual:</b> \(RSS=s^2(n-2)\) en cada regresión simple.`,
String.raw`<b>Chow con m = 3:</b> \(F\sim F((m-1)k,\,n-mk)=F(4,250)\).`,
String.raw`<b>Error estándar de la pendiente:</b> \(ee(b)=\sqrt{s^2/\sum(x-\bar x)^2}\), con \(\sum(x-\bar x)^2=n\operatorname{var}(x)\).`],
sol:String.raw`<h5>¿La misma función?</h5><ol class="steps">
<li>RSS por grupo: 0,26(100) = 26, 0,42(100) = 42 y 0,30(50) = 15, que suman \(RSS_{NR}=83\).</li>
<li>\(RSS_R=0{,}38(254)=96{,}52\).</li>
<li>\(F=\dfrac{(96{,}52-83)/4}{83/250}=\dfrac{3{,}38}{0{,}332}=10{,}18\sim F(4,250)\), con crítico 2,41. Se rechaza H₀: la función no es la misma.</li></ol>
<h5>¿La misma elasticidad?</h5><p>Hace falta el error estándar de cada pendiente, es decir, la varianza (o la suma de cuadrados) del log del ingreso dentro de cada grupo. También se podría estimar un modelo con interceptos distintos y pendiente común y compararlo por F con el no restringido.</p>
<h5>Elasticidad igual a 0,10</h5><ol class="steps">
<li>\(\sum(x-\bar x)^2=256(24)=6.144\), así que \(ee(b)=\sqrt{0{,}38/6.144}=0{,}00786\).</li>
<li>H₀: β = 0,10. \(t=\dfrac{0{,}07-0{,}10}{0{,}00786}=-3{,}81\), y \(|t|>1{,}97\), así que se rechaza H₀.</li></ol>`,
res:String.raw`<p>F = 10,18 &gt; 2,41: la función de gasto difiere entre grupos de ingreso. La elasticidad conjunta 0,07 es significativamente distinta de 0,10 (t = −3,81).</p>`}]});

// ---------- Asesoría del parcial 1 y Taller 2 (regresión múltiple): los ejercicios que el profesor resolvió en su notebook de R
TALLERES.push({id:"tl-p1", t:"Asesoría del parcial 1 y Taller 2", sub:"Regresión de k variables e inferencia: Dinardo 3.9, 3.10, 3.13, 3.20 y los puntos 1, 4, 7 y 8 del Taller 2", anchor:"inferencia",
intro:`Los ocho ejercicios que el profesor resolvió en su notebook de R de la asesoría del parcial 1, con el <b>paso a paso</b> y las ecuaciones por su número: F (56) general, F (58) y t (59) individuales, F (60) de una restricción lineal, F (61) de la regresión y F (64) con las RSS. Los números se verificaron en R. Donde el notebook tiene un descuido (un p-valor sin <code>lower.tail = F</code>, un comentario cruzado) aparece una nota «Ojo».`,
puntos:[
{id:"p1-39", n:"D 3.9", t:"Todo en desviaciones: estimar y probar cinco hipótesis", tipo:"Modelo en desviaciones", temas:["inferencia","mco-matricial"],
enun:String.raw`<p>Con n = 24 observaciones de un modelo con k = 4 (intercepto y tres regresoras) se tienen, en desviaciones a la media:</p>
<div class="mj">\[X_*'X_*=\begin{bmatrix}10&10&5\\10&30&15\\5&15&20\end{bmatrix},\qquad X_*'\mathbf y_*=\begin{bmatrix}7\\-7\\-26\end{bmatrix},\qquad TSS=\mathbf y_*'\mathbf y_*=60\]</div>
<p><b>a)</b> Pruebe por separado β₂ = 1, β₃ = 1 y β₄ = −2. <b>b)</b> Pruebe β₂ + β₃ + β₄ = 0. <b>c)</b> Pruebe conjuntamente β₂ = 1, β₃ = 1 y β₄ = −2.</p>`,
saber:[String.raw`<b>Modelo en desviaciones:</b> \(\mathbf b_2=(X_*'X_*)^{-1}X_*'\mathbf y_*\), \(ESS=\mathbf b_2'X_*'X_*\mathbf b_2\), \(RSS=TSS-ESS\) y \(S^2=RSS/(n-k)\), con k contando el intercepto.`,
String.raw`<b>Un coeficiente contra un valor:</b> \(F=\dfrac{(b_j-\beta_j^0)^2}{S^2_{b_j}}\sim F(1,n-k)\).`,
String.raw`<b>Una restricción lineal, ecuación (60):</b> \(F=\dfrac{(a_2b_2+a_3b_3+a_4b_4-a)^2}{\operatorname{var}(a_2b_2+a_3b_3+a_4b_4)}\), y la varianza de una suma incluye dos veces cada covarianza.`,
String.raw`<b>Conjunta, ecuación (56) con R = I:</b> \(F=\dfrac{(\mathbf b_2-\mathbf r)'X_*'X_*(\mathbf b_2-\mathbf r)/q}{S^2}\sim F(q,n-k)\).`],
sol:String.raw`<ol class="steps">
<li>\((X_*'X_*)^{-1}=\begin{bmatrix}0{,}15&-0{,}05&0\\-0{,}05&0{,}07&-0{,}04\\0&-0{,}04&0{,}08\end{bmatrix}\) y \(\mathbf b_2=(1{,}4;\;0{,}2;\;-1{,}8)\).</li>
<li>\(ESS=1{,}4(7)+0{,}2(-7)-1{,}8(-26)=55{,}2\), \(RSS=60-55{,}2=4{,}8\), \(S^2=4{,}8/20=0{,}24\) y R² = 0,92.</li>
<li>\(\operatorname{var}(\mathbf b_2)=0{,}24(X_*'X_*)^{-1}\): varianzas 0,036, 0,0168 y 0,0192; covarianzas −0,012, 0 y −0,0096.</li>
<li><b>a)</b> β₂ = 1: \(F=(1{,}4-1)^2/0{,}036=4{,}444\), p = 0,048. β₃ = 1: \(F=(0{,}2-1)^2/0{,}0168=38{,}10\), p ≈ 0. β₄ = −2: \(F=(-1{,}8+2)^2/0{,}0192=2{,}083\), p = 0,164. El crítico es \(F_{0{,}05}(1,20)=4{,}351\).</li>
<li><b>b)</b> \(b_2+b_3+b_4=-0{,}2\) y la varianza de la suma es la suma de todos los elementos de var(b₂): 0,0288. \(F=0{,}04/0{,}0288=1{,}389\), p = 0,252.</li>
<li><b>c)</b> \(\mathbf b_2-\mathbf r=(0{,}4;\,-0{,}8;\,0{,}2)\), \((\mathbf b_2-\mathbf r)'X_*'X_*(\mathbf b_2-\mathbf r)=11{,}2\) y \(F=(11{,}2/3)/0{,}24=15{,}56\), contra \(F_{0{,}05}(3,20)=3{,}098\).</li></ol>
<pre class="code"><code>n=24; k=4
XatXa=matrix(nrow=3, ncol=3, byrow=T, c(10,10,5, 10,30,15, 5,15,20))
Xatya=cbind(c(7,-7,-26)); XatXa_inv=solve(XatXa)
(b2v=XatXa_inv%*%Xatya)
TSS=60; (ESS=(t(b2v)%*%XatXa%*%b2v)[1]); (RSS=TSS-ESS); (S2=RSS/(n-k))
(var_b2=S2*XatXa_inv)
(Fc_b2=((b2v[1]-1)^2)/var_b2[1,1]); pf(Fc_b2, df1=1, df2=n-k, lower.tail=F)
r=cbind(c(1,1,-2))
(Fc=(((t(b2v-r)%*%XatXa%*%(b2v-r))[1])/3)/S2); pf(Fc, df1=3, df2=n-k, lower.tail=F)</code></pre>`,
res:String.raw`<p>Al 5 % se rechazan β₂ = 1 (por poco: p = 0,048) y β₃ = 1; no se rechazan β₄ = −2 ni β₂ + β₃ + β₄ = 0. La conjunta se rechaza (F = 15,56 &gt; 3,098): aunque β₄ = −2 sea compatible con los datos, las tres igualdades a la vez no lo son.</p>`},

{id:"p1-310", n:"D 3.10", t:"De X′X y X′y al estimador y a la significancia de β₂", tipo:"Estimación con matrices", temas:["mco-matricial","inferencia","matrices"],
enun:String.raw`<p>Con n = 10 observaciones y k = 3 se tiene:</p>
<div class="mj">\[X'X=\begin{bmatrix}10&30&40\\30&92&119\\40&119&163\end{bmatrix},\qquad X'\mathbf y=\begin{bmatrix}20\\59\\88\end{bmatrix},\qquad \mathbf y'\mathbf y=88{,}2\]</div>
<p>Estime el modelo, obtenga las sumas de cuadrados y pruebe la significancia de β₂.</p>`,
saber:[String.raw`La primera fila de X′X y de X′y da n, las sumas de las X y \(\sum Y\): aquí \(\bar Y=20/10=2\).`,
String.raw`\(TSS=\mathbf y'\mathbf y-n\bar Y^2\), \(ESS=\mathbf b'X'X\mathbf b-n\bar Y^2\) y \(RSS=TSS-ESS\).`,
String.raw`<b>Prueba t, ecuación (59):</b> \(t=b_j/S_{b_j}\sim t(n-k)\), con p-valor \(2P(t_{n-k}>|t_c|)\).`],
sol:String.raw`<ol class="steps">
<li>\(\det(X'X)=50\) y \((X'X)^{-1}=\begin{bmatrix}16{,}7&-2{,}6&-2{,}2\\-2{,}6&0{,}6&0{,}2\\-2{,}2&0{,}2&0{,}4\end{bmatrix}\).</li>
<li>\(\mathbf b=(X'X)^{-1}X'\mathbf y=(-13;\;1;\;3)\).</li>
<li>\(TSS=88{,}2-10(2^2)=48{,}2\); \(\mathbf b'X'X\mathbf b=\mathbf b'X'\mathbf y=-13(20)+59+3(88)=63\), así que \(ESS=63-40=23\) y \(RSS=25{,}2\). R² = 0,477.</li>
<li>\(S^2=25{,}2/7=3{,}6\), \(S^2_{b_2}=3{,}6(0{,}6)=2{,}16\) y \(S_{b_2}=1{,}470\).</li>
<li>\(t=1/1{,}470=0{,}680\), con p-valor 0,518; el crítico es \(t_{0{,}025}(7)=2{,}365\).</li></ol>
<pre class="code"><code>k=3; n=10
(XtX=matrix(nrow=3, ncol=3, c(10,30,40, 30,92,119, 40,119,163)))
(Xty=cbind(c(20,59,88)))
(XtX_inv=solve(XtX)); (b=XtX_inv%*%Xty)
yb=20/n; (TSS=88.2-n*yb^2); (ESS=(t(b)%*%XtX%*%b)[1]-n*yb^2); (RSS=TSS-ESS)
(S2=RSS/(n-k)); (var_b=S2*XtX_inv); (Sb2=sqrt(var_b[2,2]))
(tb2=b[2]/Sb2); (pb2=2*pt(abs(tb2), df=n-k, lower.tail=F))</code></pre>`,
res:String.raw`<p>Ŷ = −13 + X₂ + 3X₃, con R² = 0,477. Para β₂, t = 0,68 (p = 0,52): X₂ no es significativa. (Para β₃, t = 3/1,2 = 2,5 con p = 0,041: X₃ sí lo es.)</p>`},

{id:"p1-313", n:"D 3.13", t:"Hipótesis conjunta sobre intercepto y pendiente", tipo:"F general (56)", temas:["inferencia"],
enun:String.raw`<p>Una regresión simple con n = 30 observaciones da \(\mathbf b=(0{,}24;\;0{,}94)'\), RSS = 28,56 y \(X'X=\begin{bmatrix}30&300\\300&3052\end{bmatrix}\). Pruebe la hipótesis conjunta H₀: β₁ = 0 y β₂ = 1.</p>`,
saber:[String.raw`<b>F general (56) con R = I₂:</b> \(F=\dfrac{(\mathbf b-\mathbf r)'X'X(\mathbf b-\mathbf r)/q}{S^2}\sim F(q,\,n-k)\), con q = 2 y \(\mathbf r=(0;1)'\).`,
String.raw`\(S^2=RSS/(n-k)\). En regresión simple con intercepto, k = 2.`],
sol:String.raw`<ol class="steps">
<li>\(\mathbf b-\mathbf r=(0{,}24;\,-0{,}06)\).</li>
<li>\((\mathbf b-\mathbf r)'X'X(\mathbf b-\mathbf r)=30(0{,}24^2)+2(300)(0{,}24)(-0{,}06)+3052(0{,}06^2)=1{,}728-8{,}64+10{,}987=4{,}075\).</li>
<li>\(S^2=28{,}56/28=1{,}02\) y \(F=(4{,}075/2)/1{,}02=1{,}998\sim F(2,28)\), con p-valor 0,155; el crítico es 3,340.</li></ol>
<div class="warn"><b>Ojo con el notebook:</b> en la asesoría el código tiene <code>k=0</code>, así que divide por n = 30: S² = 0,952 y F = 2,140 (p = 0,135). La conclusión es la misma, pero con intercepto y pendiente estimados lo usual es k = 2 y 28 grados de libertad. Confirma con el profesor cuál pide.</div>
<pre class="code"><code>b=cbind(c(0.24,0.94)); r=cbind(c(0,1)); k=2; q=2; n=30
RSS=28.56; (S2=RSS/(n-k))
(XtX=matrix(nrow=2, ncol=2, c(30,300,300,3052)))
(Fc=((t(b-r)%*%XtX%*%(b-r))[1]/q)/S2)
(pv=pf(Fc, df1=q, df2=n-k, lower.tail=F))</code></pre>`,
res:String.raw`<p>F = 2,00 &lt; 3,34 (p = 0,155): no se rechaza H₀. Los datos son compatibles con intercepto 0 y pendiente 1.</p>`},

{id:"p1-320", n:"D 3.20", t:"Estimar, R², significancia de β₂ y modelo restringido", tipo:"F (58) y F (64)", temas:["inferencia","mco-matricial"],
enun:String.raw`<p>Con n = 33 observaciones y k = 3 se tiene:</p>
<div class="mj">\[X'X=\begin{bmatrix}33&0&0\\0&40&20\\0&20&60\end{bmatrix},\qquad X'\mathbf y=\begin{bmatrix}132\\24\\92\end{bmatrix},\qquad TSS=150\]</div>
<p>Estime el modelo, calcule R², pruebe la significancia de β₂ y verifique el resultado estimando el modelo restringido sin X₂.</p>`,
saber:[String.raw`Como \(\sum X_2=\sum X_3=0\), las regresoras ya están en desviaciones y X′X es diagonal por bloques: \(b_1=\bar Y=132/33=4\).`,
String.raw`<b>F (58):</b> \(F=b_j^2/S^2_{b_j}\sim F(1,n-k)\). <b>F (64):</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\). Para la misma hipótesis dan el mismo valor.`],
sol:String.raw`<ol class="steps">
<li>Bloque de las pendientes: \(\begin{bmatrix}40&20\\20&60\end{bmatrix}^{-1}=\dfrac1{2000}\begin{bmatrix}60&-20\\-20&40\end{bmatrix}=\begin{bmatrix}0{,}03&-0{,}01\\-0{,}01&0{,}02\end{bmatrix}\).</li>
<li>\(\mathbf b=(4;\;-0{,}2;\;1{,}6)\): \(b_2=0{,}03(24)-0{,}01(92)=-0{,}2\) y \(b_3=-0{,}01(24)+0{,}02(92)=1{,}6\).</li>
<li>\(ESS=\mathbf b'X'\mathbf y-n\bar Y^2=[4(132)-0{,}2(24)+1{,}6(92)]-33(16)=142{,}4\); \(RSS=7{,}6\); R² = 0,949; \(S^2=7{,}6/30=0{,}2533\).</li>
<li>\(S^2_{b_2}=0{,}2533(0{,}03)=0{,}0076\) y \(F=(-0{,}2)^2/0{,}0076=5{,}263\), con p-valor 0,029; el crítico es \(F_{0{,}05}(1,30)=4{,}171\).</li>
<li><b>Restringido</b> (sin X₂): \(X'X=\operatorname{diag}(33,60)\), \(\mathbf b_R=(4;\;92/60)=(4;\;1{,}5333)\), \(ESS_R=92^2/60=141{,}07\) y \(RSS_R=8{,}933\).</li>
<li>\(F=\dfrac{(8{,}933-7{,}6)/1}{7{,}6/30}=5{,}263\): igual que la F (58).</li></ol>
<pre class="code"><code>k=3; n=33
(XtX=matrix(nrow=k, ncol=k, c(33,0,0, 0,40,20, 0,20,60))); (Xty=cbind(c(132,24,92))); (Yb=132/n)
(XtX_inv=solve(XtX)); (b=XtX_inv%*%Xty)
TSS=150; (ESS=(t(b)%*%XtX%*%b)[1]-n*Yb^2); (RSS=TSS-ESS); (R2=ESS/TSS); (S2=RSS/(n-k))
(var_b=S2*XtX_inv); (Fc=b[2]^2/var_b[2,2]); pf(Fc, df1=1, df2=n-k, lower.tail=F)
XtX_r=diag(c(33,60)); Xty_r=cbind(c(132,92)); (br=solve(XtX_r)%*%Xty_r)
(ESSR=(t(br)%*%XtX_r%*%br)[1]-n*Yb^2); (RSSr=TSS-ESSR)
(Fc_64=(RSSr-RSS)/(RSS/(n-k)))</code></pre>`,
res:String.raw`<p>Ŷ = 4 − 0,2X₂ + 1,6X₃, con R² = 0,949. F = 5,263 &gt; 4,171 (p = 0,029): β₂ es significativo al 5 %, y el modelo restringido confirma el mismo valor de F.</p>`},

{id:"p1-t21", n:"T2-1", t:"Demanda de cerveza: elasticidades y tres restricciones", tipo:"F (58), F (60) y F (64)", temas:["inferencia","variables"],
enun:String.raw`<p>Con datos de 1960 a 2011 (n = 52) se estima \(\ln Y_t=\beta_1+\beta_2\ln X_{2t}+\beta_3\ln X_{3t}+\beta_4\ln X_{4t}+\beta_5\ln X_{5t}+\mu_t\), donde Y es la cantidad de cerveza, X₂ su precio, X₃ el precio de otros licores, X₄ el precio de otros bienes y X₅ el ingreso.</p>
<div class="tbl"><table><tr><th></th><th>b</th><th>Error estándar</th></tr><tr><td>Intercepto</td><td>−2,3232</td><td>3,0481</td></tr><tr><td>ln X₂</td><td>−0,9821</td><td>0,2454</td></tr><tr><td>ln X₃</td><td>−0,4702</td><td>0,5342</td></tr><tr><td>ln X₄</td><td>0,1663</td><td>0,0879</td></tr><tr><td>ln X₅</td><td>0,8079</td><td>0,3215</td></tr></table></div>
<p>Error estándar de la regresión S = 0,0696, R² = 0,725. De var(b): var(b₂) = 0,06021, var(b₄) = 0,00773 y cov(b₂, b₄) = 0,00405. RSS de los modelos restringidos: con β₂ + 4β₄ = 0, 0,23; con β₂ + β₃ + β₄ + β₅ = 0, 0,24; con β₃ = β₄ = 0, 0,24096.</p>
<p><b>c)</b> ¿Se acepta que la elasticidad precio es −1,6? <b>d)</b> Pruebe β₂ + 4β₄ = 0 con la F (56) y con la F (64). <b>e)</b> ¿La suma de las elasticidades es cero? <b>f)</b> Pruebe β₃ = β₄ = 0.</p>`,
saber:[String.raw`En un modelo log-log cada β es una elasticidad.`,
String.raw`<b>RSS a partir de S:</b> \(RSS_{NR}=(n-k)S^2\).`,
String.raw`<b>F (60):</b> para β₂ + 4β₄ = 0, \(\operatorname{var}(b_2+4b_4)=\operatorname{var}(b_2)+16\operatorname{var}(b_4)+8\operatorname{cov}(b_2,b_4)\).`,
String.raw`<b>F (64):</b> \(F=\dfrac{(RSS_R-RSS_{NR})/q}{RSS_{NR}/(n-k)}\sim F(q,n-k)\); el denominador es S².`],
sol:String.raw`<ol class="steps">
<li>\(S^2=0{,}0696^2=0{,}004844\) y \(RSS_{NR}=47(0{,}004844)=0{,}2277\).</li>
<li><b>c)</b> \(F=\dfrac{(-0{,}9821+1{,}6)^2}{0{,}06021}=6{,}341\sim F(1,47)\), con p-valor 0,015 &lt; 0,05: se rechaza β₂ = −1,6.</li>
<li><b>d)</b> De la (56) con R = [0 1 0 4 0]: \(F=\dfrac{(b_2+4b_4)^2}{\operatorname{var}(b_2+4b_4)}=\dfrac{(-0{,}3169)^2}{0{,}06021+16(0{,}00773)+8(0{,}00405)}=\dfrac{0{,}1004}{0{,}2163}=0{,}464\). El modelo restringido es \(\ln Y_t=\beta_1+\beta_3\ln X_{3t}+\beta_4(\ln X_{4t}-4\ln X_{2t})+\beta_5\ln X_{5t}+\mu_t\). Con la (64): \(F=(0{,}23-0{,}2277)/0{,}004844=0{,}480\), p = 0,49. La pequeña diferencia es redondeo del RSS.</li>
<li><b>e)</b> Con la (64) y el modelo 3: \(F=(0{,}24-0{,}2277)/0{,}004844=2{,}544\), p = 0,117. Con la F de una restricción: \(\sum b=-0{,}4781\), var = 0,0931 (suma de todo el bloque de var(b)) y F = 2,455, p = 0,124.</li>
<li><b>f)</b> q = 2, \(R=\begin{bmatrix}0&0&1&0&0\\0&0&0&1&0\end{bmatrix}\), r = 0: \(F=\dfrac{(0{,}24096-0{,}2277)/2}{0{,}004844}=1{,}371\), p = 0,264; el crítico es \(F_{0{,}05}(2,47)=3{,}195\).</li></ol>
<div class="warn"><b>Ojo con el notebook:</b> en d), e) y f) el p-valor está escrito <code>pf(Fc, df1, df2)</code> sin <code>lower.tail = F</code>, y eso da la probabilidad acumulada (1 − p). El p-valor correcto es <code>pf(Fc, df1, df2, lower.tail = F)</code>. En e) además usa <code>df1 = qd</code> en vez de <code>qe</code> (ambos valen 1).</div>
<pre class="code"><code>n=52; k=5; alpha=0.05
S=0.0696; S2=S^2; (RSSNR=(n-k)*S2)
RSSR_M2=0.23; RSSR_M3=0.24; RSSR_M4=0.24096
(Fc_58_c=((-0.9821-(-1.6))^2)/0.06021); pf(Fc_58_c, df1=1, df2=n-k, lower.tail=F)
(Fc_d=((RSSR_M2-RSSNR)/1)/S2); pf(Fc_d, df1=1, df2=n-k, lower.tail=F)
(Fc_e=((RSSR_M3-RSSNR)/1)/S2); pf(Fc_e, df1=1, df2=n-k, lower.tail=F)
(Fc_f=((RSSR_M4-RSSNR)/2)/S2); pf(Fc_f, df1=2, df2=n-k, lower.tail=F)</code></pre>`,
res:String.raw`<p>La elasticidad precio no es −1,6 (p = 0,015). No se rechazan β₂ + 4β₄ = 0 (F ≈ 0,47), ni que las elasticidades sumen cero (F ≈ 2,5; p ≈ 0,12), ni β₃ = β₄ = 0 (F = 1,37; p = 0,26): los precios de otros licores y de otros bienes no son conjuntamente significativos.</p>`},

{id:"p1-t24", n:"T2-4", t:"Demanda de televisores: intervalos y β₂ + β₃ = 0", tipo:"Intervalos, F (60) y F (64)", temas:["inferencia","mco-matricial"], tool:{id:"t-datos",pre:"tv",lbl:"Abrir la base de TV en el Laboratorio de datos"},
enun:String.raw`<p>Con los 48 meses de demanda de televisores Yt, precio X2t y publicidad X3t (la base del Ejemplo 1) se estiman el modelo (1) \(Y_t=\beta_1+\beta_2X_{2t}+\beta_3X_{3t}+\mu_t\) y el modelo (2), con la restricción β₃ = −β₂. Se tiene b = (10,3017274; −0,0059941; 0,0051071), con errores estándar 0,2440101, 0,0001610 y 0,0008146, cov(b₂, b₃) = 5,399229·10⁻⁸, RSS<sub>NR</sub> = 1,21268 y RSS<sub>R</sub> = 1,239267.</p>
<p><b>b)</b> Intervalos de confianza del 95 %. <b>c)</b> Pruebe β₂ + β₃ = 0 por todas las formas posibles.</p>`,
saber:[String.raw`<b>Intervalo:</b> \(b_j\pm t_{\alpha/2}(n-k)\,S_{b_j}\), con \(t_{0{,}025}(45)=2{,}0141\).`,
String.raw`<b>F (60)</b> con la varianza de b₂ + b₃ y <b>F (64)</b> con las RSS: prueban lo mismo y dan igual.`],
sol:String.raw`<ol class="steps">
<li><b>b)</b> β₁: 10,3017 ± 2,0141(0,2440) = [9,8103; 10,7932]. β₂: [−0,006318; −0,005670]. β₃: [0,003466; 0,006748]. Ninguno contiene el cero.</li>
<li><b>c)</b> R = [0 1 1], r = 0, q = 1. \(F_{60}=\dfrac{(-0{,}0059941+0{,}0051071)^2}{0{,}0001610^2+0{,}0008146^2+2(5{,}399229\cdot10^{-8})}=0{,}9866\).</li>
<li>\(F_{64}=\dfrac{1{,}239267-1{,}21268}{1{,}21268/45}=0{,}9866\sim F(1,45)\), con p-valor 0,326; el crítico es 4,057.</li></ol>
<pre class="code"><code>(ta2=qt(0.025, df=45, lower.tail=F))
b1=10.3017274; sb1=0.2440101; c(b1-sb1*ta2, b1+sb1*ta2)
b2=-0.0059941; sb2=0.0001610; b3=0.0051071; sb3=0.0008146; Sb2b3=5.399229*10^(-8)
RSSR=1.239267; RSSNR=1.21268
(F_60=((b2+b3)^2)/(sb2^2+sb3^2+2*Sb2b3))
(F_64=(RSSR-RSSNR)/(RSSNR/45))
(pv=pf(F_64, df1=1, df2=45, lower.tail=F))</code></pre>`,
res:String.raw`<p>Los tres coeficientes son significativos y con el signo esperado (precio negativo, publicidad positiva). F = 0,987 (p = 0,33): no se rechaza β₂ + β₃ = 0, es decir, un aumento de una unidad en la publicidad compensa el de una unidad en el precio.</p>`},

{id:"p1-t27", n:"T2-7", t:"Importaciones de EE. UU.: β₂ + β₃ = 1 con F, Wald, LR y LM", tipo:"Restricción lineal", temas:["inferencia","mv-pruebas"],
enun:String.raw`<p>Con datos de 1975 a 2005 (n = 31) se estima \(\ln Y_t=\beta_1+\beta_2\ln X_{2t}+\beta_3\ln X_{3t}+\mu_t\), con Y las importaciones, X₂ el PIB y X₃ el IPC: b = (1,4376; 1,8301; −0,8433), con errores estándar 0,2696, 0,1822 y 0,2838; var(b₂) = 0,03319016, var(b₃) = 0,08053829, cov(b₂, b₃) = −0,05132072; RSS<sub>NR</sub> = 0,1408056. El modelo restringido con β₂ + β₃ = 1 da RSS<sub>R</sub> = 0,1408846.</p>
<p><b>b)</b> Intervalos de confianza del 95 %. <b>c)</b> Pruebe H₀: β₂ + β₃ = 1 con la F y con las pruebas de Wald, LR y LM.</p>`,
saber:[String.raw`<b>F (60) con a = 1:</b> \(F=\dfrac{(b_2+b_3-1)^2}{\operatorname{var}(b_2)+\operatorname{var}(b_3)+2\operatorname{cov}(b_2,b_3)}\sim F(1,n-k)\).`,
String.raw`<b>Con las RSS:</b> \(W=\dfrac{n(RSS_R-RSS_{NR})}{RSS_{NR}}\), \(LR=n\ln\dfrac{RSS_R}{RSS_{NR}}\), \(LM=\dfrac{n(RSS_R-RSS_{NR})}{RSS_R}\), las tres \(\chi^2(q)\) y con W ≥ LR ≥ LM.`],
sol:String.raw`<ol class="steps">
<li><b>b)</b> \(t_{0{,}025}(28)=2{,}0484\). β₁: [0,885; 1,990]. β₂: [1,457; 2,203]. β₃: [−1,425; −0,262].</li>
<li><b>c)</b> \(b_2+b_3-1=-0{,}0132\) y la varianza de la suma es \(0{,}03319+0{,}08054-2(0{,}05132)=0{,}011087\). \(F=0{,}0132^2/0{,}011087=0{,}0157\), con p-valor 0,90.</li>
<li>\(F_{64}=\dfrac{0{,}1408846-0{,}1408056}{0{,}1408056/28}=0{,}0157\): el mismo valor.</li>
<li>\(W=31(0{,}000079)/0{,}1408056=0{,}01739\), \(LR=31\ln(0{,}1408846/0{,}1408056)=0{,}01739\) y \(LM=31(0{,}000079)/0{,}1408846=0{,}01738\), todas muy por debajo de \(\chi^2_{0{,}05}(1)=3{,}841\).</li></ol>
<div class="warn"><b>Ojo con el notebook:</b> el comentario dice «Probar Beta2+Beta3=0», pero el código calcula \((b_2+b_3-1)^2\): la hipótesis es β₂ + β₃ = 1, como en el enunciado.</div>
<pre class="code"><code>n=31; k=3; a=0.05
b2=1.8301; S2b2=0.03319016; b3=-0.8433; S2b3=0.08053829; Sb2b3=-0.05132072
RSS_NR=0.1408056; RSS_R=0.1408846
(Fc_E7=((b2+b3-1)^2)/(S2b2+S2b3+2*Sb2b3))
(pv_E7=pf(Fc_E7, df1=1, df2=n-k, lower.tail=F))
(Fc_E7_RSS=(RSS_R-RSS_NR)/(RSS_NR/(n-k)))
(W=n*(RSS_R-RSS_NR)/RSS_NR); (LR=n*log(RSS_R/RSS_NR)); (LM=n*(RSS_R-RSS_NR)/RSS_R)
qchisq(0.95, 1)</code></pre>`,
res:String.raw`<p>F = 0,016 (p = 0,90) y W ≈ LR ≈ LM ≈ 0,017 &lt; 3,841: no se rechaza β₂ + β₃ = 1. La elasticidad de las importaciones al PIB es 1,83 y al IPC −0,84, las dos significativas.</p>`},

{id:"p1-t28", n:"T2-8", t:"Demanda de un artículo: intervalos y β₂ + 3β₃ = 0", tipo:"Intervalos, F (60) y F (64)", temas:["inferencia"],
enun:String.raw`<p>Con datos de 1971 a 2005 (n = 35) se estima \(Y_t=\beta_1+\beta_2X_{2t}+\beta_3X_{3t}+\beta_4X_{4t}+\mu_t\), con Y la demanda, X₂ el precio, X₃ el ingreso y X₄ el precio de un sustituto: b = (72,2928; −5,8139; 1,6672; 1,5408), con errores estándar 6,9550, 0,4970, 0,7148 y 0,5542; S = 3,531 con 31 grados de libertad y R² = 0,9742. De var(b): var(b₂) = 0,24705304, var(b₃) = 0,51093128 y cov(b₂, b₃) = 0,09828469. El modelo restringido con β₂ + 3β₃ = 0 da \(\mathbf b_R=(72{,}195361;\,-5{,}732889;\,1{,}910963;\,1{,}396949)\), ESS<sub>R</sub> = 14.619,98 y TSS = 15.008.</p>
<p><b>b)</b> Intervalos de confianza del 95 %. <b>d)</b> Escriba H₀: β₂ + 3β₃ = 0 como Rβ = r, verifique que b<sub>R</sub> cumple la restricción y haga la prueba por todas las formas posibles.</p>`,
saber:[String.raw`<b>F (60) con pesos:</b> \(\operatorname{var}(b_2+3b_3)=\operatorname{var}(b_2)+9\operatorname{var}(b_3)+6\operatorname{cov}(b_2,b_3)\).`,
String.raw`\(RSS_R=TSS-ESS_R\) y \(RSS_{NR}=(n-k)S^2\).`],
sol:String.raw`<ol class="steps">
<li><b>b)</b> \(t_{0{,}025}(31)=2{,}0395\). β₁: [58,108; 86,478]. β₂: [−6,828; −4,800]. β₃: [0,209; 3,125]. β₄: [0,411; 2,671]. Ninguno contiene el cero y los signos son los esperados: precio negativo, ingreso y precio del sustituto positivos.</li>
<li><b>d)</b> R = [0 1 3 0], r = 0, q = 1. Verificación: \(-5{,}732889+3(1{,}910963)=0\), b<sub>R</sub> cumple la restricción.</li>
<li>\(b_2+3b_3=-5{,}8139+3(1{,}6672)=-0{,}8123\) y \(\operatorname{var}=0{,}24705+9(0{,}51093)+6(0{,}09828)=5{,}4351\). \(F_{60}=0{,}8123^2/5{,}4351=0{,}1214\).</li>
<li>\(RSS_R=15.008-14.619{,}98=388{,}02\) y \(RSS_{NR}=31(3{,}531^2)=386{,}507\). \(F_{64}=\dfrac{388{,}02-386{,}507}{386{,}507/31}=0{,}1214\sim F(1,31)\), con p-valor 0,730; el crítico es 4,160.</li></ol>
<pre class="code"><code>n=35; k=4; a=0.05
(ta2=qt(a/2, df=n-k, lower.tail=F))
b2=-5.8139; se_b2=0.4970; c(b2-se_b2*ta2, b2+se_b2*ta2)
b3=1.6672; S2_b2=0.24705304; S2_b3=0.51093128; Sb2b3=0.09828469
(FC=((b2+3*b3)^2)/(S2_b2+9*S2_b3+6*Sb2b3)); (pv=pf(FC, df1=1, df2=n-k, lower.tail=F))
TSS=15008; ESS_R=14619.98; (RSS_R=TSS-ESS_R)
S=3.531; (RSS_NR=(n-k)*(S^2))
(FC_1=((RSS_R-RSS_NR)/(RSS_NR/(n-k))))</code></pre>`,
res:String.raw`<p>F = 0,121 (p = 0,73): no se rechaza β₂ + 3β₃ = 0. Las dos formas de la prueba coinciden.</p>`}]});


// ===================== AJUSTE AL PROGRAMA 1504110 =====================
// Agrupa la ruta en las seis unidades del programa, sube al tronco las ramas que el programa evalúa
// y agrega las estaciones que faltaban: pruebas LR, Wald y LM; diagnóstico; MCG; GMM.
(function(){
const LABX=t=>`<section><h3>Laboratorio${t?": "+t:""}</h3><div class="sim" id="sim"></div></section>`;
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
const take=id=>{for(const g of BRANCHES){const k=(g.items||[]).findIndex(x=>x.id===id);if(k>=0)return g.items.splice(k,1)[0]}return null};
ins("inferencia",[
{id:"mv-pruebas", t:"Máxima verosimilitud y las pruebas LR, Wald y LM", sim:"mvtest", html:String.raw`
<section><h3>Estimación por máxima verosimilitud</h3><p class="lead">Con \(u\sim N(0,\sigma^2I)\), la log-verosimilitud del modelo lineal es</p>
<div class="mj">\[\ln L(\beta,\sigma^2)=-\frac n2\ln(2\pi)-\frac n2\ln\sigma^2-\frac{(y-X\beta)'(y-X\beta)}{2\sigma^2}\]</div>
<p>y sus estimadores son \(\hat\beta_{MV}=(X'X)^{-1}X'y\) (igual a MCO) y \(\hat\sigma^2_{MV}=e'e/n\) (sesgado pero consistente). El EMV es consistente, asintóticamente normal y eficiente: su varianza asintótica es la inversa de la matriz de información, \(I(\theta)^{-1}\).</p></section>
<section><h3>Tres formas de probar restricciones \(R\beta=r\)</h3>
<div class="tbl"><table><tr><th>Prueba</th><th>Qué estima</th><th>Idea</th><th>En el modelo lineal</th></tr>
<tr><td>Razón de verosimilitud (LR)</td><td>Los dos modelos</td><td>¿Cuánto cae \(\ln L\) al imponer la restricción?</td><td>\(LR=n\ln\frac{RSS_R}{RSS_{NR}}\)</td></tr>
<tr><td>Wald (W)</td><td>Solo el no restringido</td><td>¿Qué tan lejos está \(R\hat\beta\) de \(r\)?</td><td>\(W=n\frac{RSS_R-RSS_{NR}}{RSS_{NR}}\)</td></tr>
<tr><td>Multiplicadores de Lagrange (LM)</td><td>Solo el restringido</td><td>¿Qué tan empinada es \(\ln L\) en la restricción?</td><td>\(LM=n\frac{RSS_R-RSS_{NR}}{RSS_R}=nR^2_{aux}\)</td></tr></table></div>
<p>Las tres son asintóticamente \(\chi^2_q\) bajo \(H_0\) y en muestras finitas cumplen \(W\ge LR\ge LM\). La prueba \(F\) es la versión exacta (con normalidad) de Wald: \(W=qF\cdot\frac{n}{n-k}\).</p></section>
<section><h3>Regresión restringida</h3><p>Minimizar \(e'e\) sujeto a \(R\beta=r\) da \(\hat\beta_R=\hat\beta-(X'X)^{-1}R'[R(X'X)^{-1}R']^{-1}(R\hat\beta-r)\). Ejemplos: rendimientos constantes a escala en una Cobb-Douglas (\(\beta_K+\beta_L=1\)), igualdad de coeficientes.</p></section>
${LABX("las tres pruebas con los mismos datos")}`,
qs:[{q:"Con n = 50, RSS_R = 120 y RSS_NR = 100, calcule W, LR y LM.",a:"W = 50·20/100 = 10; LR = 50·ln(1,2) = 9,12; LM = 50·20/120 = 8,33. Se cumple W ≥ LR ≥ LM."}]}]);
const B2=["multicol","hetero","autocorr","especificacion"].map(take).filter(Boolean),B4=["vi","simultaneas"].map(take).filter(Boolean),B6=["discreta"].map(take).filter(Boolean);
ins("chow",[
{id:"diagnostico", t:"Diagnóstico: residuos, normalidad, no linealidad y observaciones influyentes", sim:"diag", html:String.raw`
<section><h3>Selección de variables y bondad de ajuste</h3><p class="lead">Antes de interpretar coeficientes hay que verificar que el modelo cumpla los supuestos. La selección de regresores combina teoría y criterios: \(\bar R^2\), Akaike (AIC) y Schwarz (BIC), pruebas F de variables omitidas o redundantes.</p></section>
<section><h3>Normalidad</h3><ul><li><b>Jarque-Bera:</b> \(JB=n\left[\frac{S^2}{6}+\frac{(K-3)^2}{24}\right]\sim\chi^2_2\), con la asimetría \(S\) y la curtosis \(K\) de los residuos.</li><li><b>Shapiro-Wilk:</b> compara los residuos ordenados con los cuantiles normales; potente en muestras pequeñas.</li><li><b>Gráfico QQ:</b> los puntos deben caer sobre la recta.</li></ul></section>
<section><h3>No linealidad y estabilidad</h3><ul><li><b>RESET de Ramsey:</b> agrega \(\hat y^2,\hat y^3\) y prueba si son significativos.</li><li><b>Rainbow (Utts):</b> compara el ajuste del centro de la muestra con el de toda la muestra.</li><li><b>Chow, Hansen, CUSUM y CUSUMQ, estimación recursiva:</b> estabilidad de los parámetros (ver «Cambio estructural a fondo»).</li></ul></section>
<section><h3>Observaciones influyentes</h3>
<div class="mj">\[h_{ii}=x_i'(X'X)^{-1}x_i\qquad r_i=\frac{e_i}{s\sqrt{1-h_{ii}}}\qquad D_i=\frac{r_i^2}{k}\cdot\frac{h_{ii}}{1-h_{ii}}\]</div>
<p>El <b>apalancamiento</b> \(h_{ii}\) mide qué tan atípicas son las \(x\) de la observación (alerta si \(h_{ii}>2k/n\)); el <b>residuo estudentizado</b> \(r_i\), qué tan mal se ajusta su \(y\) (alerta si \(|r_i|>2\)); la <b>distancia de Cook</b> \(D_i\) combina ambas y mide cuánto cambiarían todos los coeficientes si se elimina (alerta si \(D_i>4/n\) o \(>1\)). En R: <code>hatvalues(m)</code>, <code>rstandard(m)</code>, <code>cooks.distance(m)</code>, <code>jarque.bera.test(resid(m))</code> (paquete tseries), <code>resettest(m)</code> y <code>raintest(m)</code> (lmtest).</p></section>
${LABX("encuentra la observación que manda")}`,
qs:[{q:"Una observación tiene h = 0,45 con n = 20 y k = 3. ¿Es de alto apalancamiento?",a:"Sí: 2k/n = 0,30 y h = 0,45 la supera."}]},...B2]);
ins(B2.length?B2[B2.length-1].id:"diagnostico",[
{id:"mcg", t:"El modelo lineal generalizado: MCG (Aitken)", sim:"mcg", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si \(V(u)=\sigma^2\Omega\) con \(\Omega\ne I\) (heterocedasticidad o autocorrelación), MCO sigue siendo insesgado, pero <b>deja de ser eficiente</b> y su fórmula usual de varianza es incorrecta. MCG pondera cada observación según su varianza y recupera la eficiencia: por el <b>teorema de Aitken</b>, es MELI.</p>
<div class="tbl"><table><tr><th></th><th>Estimador</th><th>Varianza</th></tr>
<tr><td><b>MCG</b></td><td>\(b_{MCG}=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\)</td><td>\(\sigma^2(X'\Omega^{-1}X)^{-1}\)</td></tr>
<tr><td><b>MCO</b></td><td>\(b_{MCO}=(X'X)^{-1}X'y\)</td><td>\(\sigma^2(X'X)^{-1}X'\Omega X(X'X)^{-1}\)</td></tr></table></div>
<p>Cuando \(\Omega\) es desconocida se estima primero (<b>MCG factibles</b>), o se mantiene MCO con errores robustos (White, Newey-West). Casos particulares: mínimos cuadrados ponderados (\(\Omega\) diagonal) y Cochrane-Orcutt o Prais-Winsten (AR(1)).</p></section>

<section><h3>Ejemplo 3 de clase: ventas y publicidad</h3>
<p>\(Y_t\) = volumen de ventas, \(X_t\) = gasto en publicidad, \(Y_t=\beta_1+\beta_2X_t+u_t\), con \(E[u_t]=0\), \(\operatorname{cov}(u_t,u_s)=0\ \forall t\ne s\) y \(\operatorname{var}(u_t)=\sigma^2X_t\): sin autocorrelación, pero con heterocedasticidad.</p>
<div class="tbl"><table><tr><th>\(Y_t\)</th><td>120</td><td>130</td><td>150</td><td>160</td><td>180</td><td>200</td></tr><tr><th>\(X_t\)</th><td>4</td><td>25</td><td>30</td><td>36</td><td>40</td><td>49</td></tr></table></div>
<p class="hint">Abre cada parte para ver el desarrollo. El resultado está a la vista en el título.</p>
<div class="tl-list">

<details class="pto"><summary><span class="pn">a</span><span class="pt">Var(u) y estimación por MCO<small>\(\Omega=\operatorname{diag}(X_t)\ne I\) · \(b_{MCO}=(101{,}1656;\ 1{,}8098)\)</small></span></summary><div class="pto-b">
<p>En la diagonal van las varianzas \(\sigma^2X_t\); fuera de ella, las covarianzas, que son cero. Se saca \(\sigma^2\) como factor común:</p>
<div class="mj">\[\operatorname{Var}(u)=\sigma^2\begin{bmatrix}X_1&&0\\&\ddots&\\0&&X_6\end{bmatrix}=\sigma^2\Omega,\qquad\Omega=\operatorname{diag}(4,25,30,36,40,49)\ne I_6\]</div>
<p>Sumas para MCO: \(n=6\), \(\sum X_t=184\), \(\sum X_t^2=6.838\), \(\sum Y_t=940\), \(\sum X_tY_t=30.990\).</p>
<div class="mj">\[b_{MCO}=\begin{bmatrix}6&184\\184&6838\end{bmatrix}^{-1}\begin{bmatrix}940\\30990\end{bmatrix}=\begin{bmatrix}0{,}9534300&-0{,}0256553\\-0{,}0256553&0{,}0008366\end{bmatrix}\begin{bmatrix}940\\30990\end{bmatrix}=\begin{bmatrix}101{,}165644\\1{,}809816\end{bmatrix}\]</div>
<p class="hint">Inversa 2×2: se intercambia la diagonal, se cambia el signo de lo de afuera y se divide por el determinante, \(6\cdot6838-184^2=7172\).</p>
</div></details>

<details class="pto"><summary><span class="pn">b</span><span class="pt">Estimación por MCG<small>\(b_{MCG}=(112{,}382282;\ 1{,}444056)\)</small></span></summary><div class="pto-b">
<p><b>1.</b> \(\Omega^{-1}=\operatorname{diag}(1/X_t)\): multiplicar por \(\Omega^{-1}\) divide cada fila por \(X_t\), así que \(\Omega^{-1}X\) tiene columnas \(1/X_t\) y \(1\), y \(\Omega^{-1}y\) tiene \(Y_t/X_t\).</p>
<p><b>2.</b> Las sumas «suben un escalón» respecto a MCO:</p>
<div class="mj">\[X'\Omega^{-1}X=\begin{bmatrix}\sum 1/X_t&n\\n&\sum X_t\end{bmatrix}=\begin{bmatrix}0{,}3965193&6\\6&184\end{bmatrix}\qquad X'\Omega^{-1}y=\begin{bmatrix}\sum Y_t/X_t\\\sum Y_t\end{bmatrix}=\begin{bmatrix}53{,}22608\\940\end{bmatrix}\]</div>
<div class="tbl"><table><tr><th>\(X_t\)</th><td>4</td><td>25</td><td>30</td><td>36</td><td>40</td><td>49</td><th>Σ</th></tr>
<tr><th>\(1/X_t\)</th><td>0,25</td><td>0,04</td><td>0,033333</td><td>0,027778</td><td>0,025</td><td>0,020408</td><th>0,3965193</th></tr>
<tr><th>\(Y_t/X_t\)</th><td>30</td><td>5,2</td><td>5</td><td>4,444444</td><td>4,5</td><td>4,081633</td><th>53,22608</th></tr></table></div>
<p><b>3.</b> Determinante \(0{,}3965193\cdot184-36=36{,}959546\) e inversa:</p>
<div class="mj">\[b_{MCG}=\begin{bmatrix}4{,}9784161&-0{,}16233965\\-0{,}16233965&0{,}010728467\end{bmatrix}\begin{bmatrix}53{,}22608\\940\end{bmatrix}=\begin{bmatrix}112{,}382282\\1{,}444056\end{bmatrix}\]</div>
<p>La pendiente baja de 1,81 a 1,44 porque MCG da peso \(1/X_t\) a cada observación: la de \(X=4\) pesa 12 veces más que la de \(X=49\), cuyo error es mucho más ruidoso.</p>
<p class="hint">No redondees la inversa: con 0,010728 en vez de 0,010728467 la pendiente sale 1,4436.</p>
</div></details>

<details class="pto"><summary><span class="pn">b</span><span class="pt">Sumas de cuadrados por MCG<small>TSS = 889,7064 · ESS = 865,3494 · RSS = 24,35697</small></span></summary><div class="pto-b">
<p>Son las sumas de cuadrados del modelo transformado \(Py\), donde \(P=\operatorname{diag}(1/\sqrt{X_t})\) y \(P'P=\Omega^{-1}\). La media que se resta es la de \(Py\):</p>
<div class="mj">\[\overline{Py}=\frac1n\sum\frac{Y_t}{\sqrt{X_t}}=\frac{60+26+27{,}3861+26{,}6667+28{,}4605+28{,}5714}{6}=32{,}84745\qquad n\,\overline{Py}^{\,2}=6.473{,}7313\]</div>
<div class="tbl"><table><tr><th>Suma</th><th>Definición</th><th>Cálculo</th><th>Valor</th></tr>
<tr><td>\(TSS_{MCG}\)</td><td>\(y'\Omega^{-1}y-n\overline{Py}^{\,2}\)</td><td>7.363,4376 − 6.473,7313</td><th>889,7064</th></tr>
<tr><td>\(ESS_{MCG}\)</td><td>\(b_{MCG}'X'\Omega^{-1}X\,b_{MCG}-n\overline{Py}^{\,2}\)</td><td>7.339,0807 − 6.473,7313</td><th>865,3494</th></tr>
<tr><td>\(RSS_{MCG}\)</td><td>\(e_{MCG}'\Omega^{-1}e_{MCG}=\sum e_t^2/X_t\)</td><td>7.363,4376 − 7.339,0807</td><th>24,35697</th></tr></table></div>
<p>Se verifica \(ESS+RSS=TSS\): 865,3494 + 24,35697 = 889,7064. Aquí \(y'\Omega^{-1}y=\sum Y_t^2/X_t\), y \(b'X'\Omega^{-1}Xb=b'X'\Omega^{-1}y=112{,}382282\cdot53{,}22608+1{,}444056\cdot940\).</p>
<p><b>Dos estimadores de \(\sigma^2\):</b></p>
<div class="mj">\[\hat\sigma^2_{MCG}=\frac{RSS_{MCG}}{n}=\frac{24{,}35697}{6}=4{,}059495\qquad s^2_{MCO\text{-}T}=\frac{RSS_{MCG}}{n-k}=\frac{24{,}35697}{4}=6{,}089242\]</div>
<p>El primero es el de máxima verosimilitud (sesgado); el segundo es el insesgado: es la \(s^2\) de MCO aplicado al modelo transformado. Para errores estándar y pruebas se usa \(s^2\). Si piden \(R^2\): \(ESS/TSS=0{,}9726\).</p>
</div></details>

<details class="pto"><summary><span class="pn">c</span><span class="pt">Varianzas de b<sub>MCG</sub> y b<sub>MCO</sub><small>e.e.(β̂₂): MCG 0,2556 &lt; MCO 0,3240</small></span></summary><div class="pto-b">
<div class="mj">\[\operatorname{Var}(b_{MCG})=\sigma^2(X'\Omega^{-1}X)^{-1}=\sigma^2\begin{bmatrix}4{,}9784161&-0{,}16233965\\-0{,}16233965&0{,}010728467\end{bmatrix}\]</div>
<p>La varianza verdadera de MCO usa la fórmula «sándwich», con \(X'\Omega X=\begin{bmatrix}\sum X_t&\sum X_t^2\\\sum X_t^2&\sum X_t^3\end{bmatrix}=\begin{bmatrix}184&6838\\6838&270994\end{bmatrix}\):</p>
<div class="mj">\[\operatorname{Var}_v(b_{MCO})=\sigma^2(X'X)^{-1}X'\Omega X(X'X)^{-1}=\sigma^2\begin{bmatrix}11{,}1058087&-0{,}36214594\\-0{,}36214594&0{,}01724389\end{bmatrix}\]</div>
<p>Comparando las diagonales, <b>MCG tiene menor varianza en los dos coeficientes</b> (Aitken): 4,978 &lt; 11,106 para \(\beta_1\) y 0,01073 &lt; 0,01724 para \(\beta_2\). La varianza de \(b_2\) por MCG es el 62 % de la de MCO.</p>
<p>Con \(s^2=6{,}089242\):</p>
<div class="tbl"><table><tr><th></th><th>Var(\(b_1\))</th><th>Var(\(b_2\))</th><th>e.e.(\(b_1\))</th><th>e.e.(\(b_2\))</th></tr>
<tr><td>MCG</td><td>30,3148</td><td>0,065328</td><td>5,5059</td><td>0,2556</td></tr>
<tr><td>MCO (verdadera)</td><td>67,6260</td><td>0,105002</td><td>8,2235</td><td>0,3240</td></tr></table></div>
<p class="hint">Error común: usar \(s^2(X'X)^{-1}\) para MCO. Con heterocedasticidad esa fórmula no es válida; da 0,3595 para e.e.(\(b_2\)).</p>
</div></details>

<details class="pto"><summary><span class="pn">d</span><span class="pt">Modelo transformado y estimación por MCO<small>Dividir todo por \(\sqrt{X_t}\) y estimar sin intercepto: da el mismo \(b_{MCG}\)</small></span></summary><div class="pto-b">
<p><b>1. Encontrar \(P\).</b> Se busca \(P\) con \(P'P=\Omega^{-1}\). Como \(\Omega^{-1}=\operatorname{diag}(1/X_t)\), sirve \(P=\operatorname{diag}(1/\sqrt{X_t})\). Comprobación: \(P\Omega P'=\operatorname{diag}\!\left(\frac{X_t}{\sqrt{X_t}\sqrt{X_t}}\right)=I_6\).</p>
<p><b>2. Transformar el modelo.</b> Se premultiplica \(y=X\beta+u\) por \(P\), es decir, se divide cada fila por \(\sqrt{X_t}\):</p>
<div class="mj">\[\underbrace{\frac{Y_t}{\sqrt{X_t}}}_{Y_t^*}=\beta_1\underbrace{\frac1{\sqrt{X_t}}}_{X_{1t}^*}+\beta_2\underbrace{\sqrt{X_t}}_{X_{2t}^*}+\underbrace{\frac{u_t}{\sqrt{X_t}}}_{u_t^*},\qquad\operatorname{var}(u_t^*)=\frac{\sigma^2X_t}{X_t}=\sigma^2\]</div>
<p>El error transformado es homocedástico: el modelo cumple los supuestos clásicos y se puede estimar por MCO. Ojo: <b>no lleva intercepto</b>, porque la columna de unos se volvió \(1/\sqrt{X_t}\).</p>
<p><b>3. Datos transformados.</b></p>
<div class="tbl"><table><tr><th>\(t\)</th><th>\(Y_t^*=Y_t/\sqrt{X_t}\)</th><th>\(X_{1t}^*=1/\sqrt{X_t}\)</th><th>\(X_{2t}^*=\sqrt{X_t}\)</th></tr>
<tr><td>1</td><td>60</td><td>0,5</td><td>2</td></tr>
<tr><td>2</td><td>26</td><td>0,2</td><td>5</td></tr>
<tr><td>3</td><td>27,386128</td><td>0,182574</td><td>5,477226</td></tr>
<tr><td>4</td><td>26,666667</td><td>0,166667</td><td>6</td></tr>
<tr><td>5</td><td>28,460499</td><td>0,158114</td><td>6,324555</td></tr>
<tr><td>6</td><td>28,571429</td><td>0,142857</td><td>7</td></tr></table></div>
<p><b>4. MCO sobre el modelo transformado.</b> Las sumas son \(\sum X_{1t}^{*2}=\sum 1/X_t\), \(\sum X_{1t}^*X_{2t}^*=n\), \(\sum X_{2t}^{*2}=\sum X_t\), \(\sum X_{1t}^*Y_t^*=\sum Y_t/X_t\) y \(\sum X_{2t}^*Y_t^*=\sum Y_t\):</p>
<div class="mj">\[b=(X^{*\prime}X^*)^{-1}X^{*\prime}y^*=\begin{bmatrix}0{,}3965193&6\\6&184\end{bmatrix}^{-1}\begin{bmatrix}53{,}22608\\940\end{bmatrix}=\begin{bmatrix}112{,}382282\\1{,}444056\end{bmatrix}\]</div>
<p>Son exactamente las mismas matrices de la parte b, porque \(X^{*\prime}X^*=X'P'PX=X'\Omega^{-1}X\). <b>MCG = MCO sobre el modelo transformado.</b></p>
<p><b>5. Lo demás también sale del modelo transformado.</b> Los residuos \(e_t^*=e_t/\sqrt{X_t}\) son 0,9207; −3,6967; −1,0414; −0,7280; 1,5583; 2,4084, y su suma de cuadrados es \(RSS=24{,}35697\). La TSS de clase es la TSS usual del modelo transformado, \(\sum Y_t^{*2}-n\bar Y^{*2}=7.363{,}4376-6.473{,}7313=889{,}7064\): por eso se centra con la media de \(Py\). Y \(s^2_{MCO\text{-}T}=RSS/(n-k)=6{,}089242\) es la \(s^2\) de este MCO; de ahí su nombre.</p>
<pre class="code"><code>ys &lt;- y/sqrt(x); x1s &lt;- 1/sqrt(x); x2s &lt;- sqrt(x)
summary(lm(ys ~ 0 + x1s + x2s))   # 0 = sin intercepto: 112.382282 y 1.444056</code></pre>
<p class="hint">Sin intercepto, R reporta un \(R^2\) no centrado; no es el de clase.</p>
</div></details>
</div></section>
${LABX("calculadora del ejemplo y simulación")}`,
deep:[
{k:"Teoría",t:"Por qué funciona: la matriz de transformación P",html:String.raw`<p>Como \(\Omega\) es simétrica y definida positiva, existe \(P\) con \(P\Omega P'=I\), es decir, \(P'P=\Omega^{-1}\). Multiplicando el modelo por \(P\):</p>
<div class="mj">\[y^*=Py,\quad X^*=PX,\quad u^*=Pu,\qquad V(u^*)=\sigma^2P\Omega P'=\sigma^2I\]</div>
<p>El modelo transformado cumple los supuestos clásicos, y su MCO es MCG: \((X^{*\prime}X^*)^{-1}X^{*\prime}y^*=(X'\Omega^{-1}X)^{-1}X'\Omega^{-1}y\). Eso prueba el teorema de Aitken. Además, \(\sigma^2\) se cancela en el estimador: solo hace falta conocer \(\Omega\) salvo una constante.</p>`},
{k:"Tabla",t:"Cómo transformar según la forma de la varianza",html:String.raw`<p>Con \(\operatorname{var}(u_t)=\sigma^2X_t\), \(P=\operatorname{diag}(1/\sqrt{X_t})\): se divide todo por \(\sqrt{X_t}\) y se estima por MCO <b>sin intercepto</b>. Da los mismos 112,38 y 1,444.</p>
<div class="mj">\[\frac{Y_t}{\sqrt{X_t}}=\beta_1\frac1{\sqrt{X_t}}+\beta_2\sqrt{X_t}+\frac{u_t}{\sqrt{X_t}}\]</div>
<div class="tbl"><table><tr><th>Si \(\operatorname{var}(u_t)=\)</th><th>Se divide por</th><th>Modelo transformado</th></tr>
<tr><td>\(\sigma^2X_t\)</td><td>\(\sqrt{X_t}\)</td><td>\(Y_t/\sqrt{X_t}=\beta_1/\sqrt{X_t}+\beta_2\sqrt{X_t}+v_t\)</td></tr>
<tr><td>\(\sigma^2X_t^2\)</td><td>\(X_t\)</td><td>\(Y_t/X_t=\beta_2+\beta_1(1/X_t)+v_t\)</td></tr>
<tr><td>\(\sigma_t^2\) conocidas</td><td>\(\sigma_t\)</td><td>Peso \(1/\sigma_t^2\) en cada observación</td></tr>
<tr><td>AR(1) con \(\rho\)</td><td>Cuasi-diferencias</td><td>\(Y_t-\rho Y_{t-1}=\beta_1(1-\rho)+\beta_2(X_t-\rho X_{t-1})+\varepsilon_t\)</td></tr></table></div>`},
{k:"Parcial",t:"Errores típicos",html:String.raw`<ul><li>Dividir por \(X_t\) cuando la varianza es \(\sigma^2X_t\): se divide por la desviación estándar, \(\sqrt{X_t}\). En la fórmula matricial \(\Omega^{-1}\) sí lleva \(1/X_t\), porque \(P'P=\Omega^{-1}\).</li>
<li>Dejar intercepto en el modelo transformado: la constante se volvió el regresor \(1/\sqrt{X_t}\).</li>
<li>Calcular la RSS con los residuos sin ponderar: es \(\sum e_t^2/X_t\).</li>
<li>Confundir \(\hat\sigma^2=RSS/n\) (máxima verosimilitud) con \(s^2=RSS/(n-k)\) (insesgado).</li>
<li>Comparar el \(R^2\) de MCG con el de MCO: están en variables distintas.</li>
<li>Redondear la inversa a pocos decimales.</li></ul>
<p class="hint">Otra convención, en algunos textos, centra la TSS con la media ponderada \(\sum(Y_t/X_t)/\sum(1/X_t)=134{,}23\): da TSS = 218,73 y ESS = 194,37, con la misma RSS. En el curso se usa la de \(\overline{Py}\).</p>`},
{k:"R",t:"Verificación en R",html:String.raw`<pre class="code"><code>y &lt;- c(120, 130, 150, 160, 180, 200)
x &lt;- c(4, 25, 30, 36, 40, 49)
X &lt;- cbind(1, x);  Oi &lt;- diag(1/x);  O &lt;- diag(x)
A &lt;- solve(t(X) %*% Oi %*% X)                 # (X'Ω⁻¹X)⁻¹
b_mcg &lt;- A %*% t(X) %*% Oi %*% y              # 112.382282  1.444056
e &lt;- y - X %*% b_mcg
RSS &lt;- t(e) %*% Oi %*% e                      # 24.35697
Py &lt;- y / sqrt(x);  TSS &lt;- sum(Py^2) - 6 * mean(Py)^2   # 889.7064
B &lt;- solve(t(X) %*% X)
B %*% t(X) %*% O %*% X %*% B                  # 11.1058087 ... 0.01724389
summary(lm(y ~ x, weights = 1/x))             # MCG directo</code></pre>`}],
qs:[{q:"Con var(uₜ) = σ²Xₜ, escriba X′Ω⁻¹X y X′Ω⁻¹y para Yₜ = β₁ + β₂Xₜ + uₜ.",a:"X′Ω⁻¹X = [Σ1/Xₜ, n; n, ΣXₜ] y X′Ω⁻¹y = [ΣYₜ/Xₜ; ΣYₜ]."},
{q:"¿Cómo se define la TSS por MCG en el curso y cuánto da en el ejemplo?",a:"TSS = y′Ω⁻¹y − n·(media de Py)², con Py = Yₜ/√Xₜ: 7.363,4376 − 6.473,7313 = 889,7064."},
{q:"¿Qué diferencia hay entre σ̂² = RSS/n y s² = RSS/(n − k)?",a:"RSS/n es el estimador de máxima verosimilitud (sesgado): 4,059495. RSS/(n − k) es insesgado y es el que se usa para errores estándar: 6,089242."},
{q:"¿Por qué Var(b_MCO) no es σ²(X′X)⁻¹ en este modelo?",a:"Porque Var(u) = σ²Ω ≠ σ²I. La varianza verdadera es σ²(X′X)⁻¹X′ΩX(X′X)⁻¹."},
{q:"Si Var(uᵢ) = σ²xᵢ², ¿qué transformación aplica MCP?",a:"Dividir toda la ecuación por xᵢ: la nueva perturbación uᵢ/xᵢ tiene varianza constante σ²."}]}]);
ins("mcg",B4);
ins(B4.length?B4[B4.length-1].id:"mcg",[
{id:"gmm", t:"Método generalizado de los momentos (GMM)", sim:"gmm", html:String.raw`
<section><h3>Motivación</h3><p class="lead">Muchos modelos económicos implican condiciones de momentos \(E[g(w_i,\theta)]=0\) (ecuaciones de Euler, exogeneidad de instrumentos) sin especificar toda la distribución. GMM elige \(\theta\) para que los momentos muestrales se acerquen a cero.</p></section>
<section><h3>El estimador</h3>
<div class="mj">\[\bar g(\theta)=\frac1n\sum_{i=1}^n g(w_i,\theta)\qquad\hat\theta_{GMM}=\arg\min_\theta\ \bar g(\theta)'\,W\,\bar g(\theta)\]</div>
<p>Si hay tantos momentos como parámetros (exactamente identificado), se resuelve \(\bar g(\hat\theta)=0\) y \(W\) no importa. Con más momentos (sobreidentificado), la matriz de ponderación eficiente es \(W=S^{-1}\), la inversa de la varianza de los momentos; se estima en dos etapas.</p>
<p>En el modelo lineal con instrumentos \(Z\), \(g_i=z_i(y_i-x_i'\beta)\):</p>
<div class="mj">\[\hat\beta_{GMM}=(X'ZWZ'X)^{-1}X'ZWZ'y\qquad W=(Z'Z)^{-1}\Rightarrow\text{MC2E}\]</div></section>
<section><h3>Propiedades y pruebas</h3><ul><li>Consistente y asintóticamente normal; con \(W\) eficiente, el de menor varianza entre los GMM con esos momentos.</li><li><b>Prueba de sobreidentificación de Hansen:</b> \(J=n\,\bar g(\hat\theta)'\hat S^{-1}\bar g(\hat\theta)\sim\chi^2_{m-k}\); si se rechaza, algún instrumento no es válido.</li><li><b>Casos particulares:</b> MCO (\(z=x\)), VI y MC2E (momentos de exogeneidad), máxima verosimilitud (la condición de puntaje \(E[\partial\ln f/\partial\theta]=0\)).</li></ul>
<p>En R: <code>gmm(y ~ x, ~ z1 + z2)</code> (paquete gmm) o <code>ivreg</code> con <code>summary(..., diagnostics = TRUE)</code>.</p></section>
${LABX("MC2E frente a GMM eficiente")}`,
qs:[{q:"Con 3 instrumentos para 1 regresor endógeno (más la constante), ¿cuántos grados de libertad tiene la J de Hansen?",a:"Momentos m = 4 (constante y 3 instrumentos), parámetros k = 2: gl = m − k = 2."}]},...B6]);
const P={"r-cero":"Herramientas: R, datos y matrices","mco-simple":"Unidad 1 · El modelo de regresión lineal múltiple (repaso)",diagnostico:"Unidad 2 · Pruebas de diagnóstico",mcg:"Unidad 3 · El modelo lineal generalizado (MCG)",vi:"Unidad 4 · Variables instrumentales",gmm:"Unidad 5 · Método generalizado de los momentos",discreta:"Unidad 6 · Variable dependiente discreta"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
for(let i=BRANCHES.length-1;i>=0;i--)if(BRANCHES[i].items&&!BRANCHES[i].items.length)BRANCHES.splice(i,1);
})();
