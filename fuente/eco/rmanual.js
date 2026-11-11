
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
