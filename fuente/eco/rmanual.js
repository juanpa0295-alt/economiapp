
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
