// ===================== LABORATORIOS: CASOS REALES =====================
// Cada caso parte de una base del curso, estima con la herramienta de la estación y termina en una decisión con su beneficio medido.
// Formato fijo: situación, pregunta, datos y modelo, de la estimación a la decisión, herramienta interactiva, decisión y beneficio, cuándo no funciona, código R.
const LABORATORIOS=[
{id:"lab-precio",t:"Fijar el precio que más deja con la elasticidad",sector:"Comercio minorista · precios",links:["especificacion","inferencia"],sim:"labPrecio",
 caso:{
 sit:String.raw`<p>Una cadena vende televisores. El gerente quiere saber si le conviene bajar o subir el precio. Tiene 48 meses de ventas, precio y publicidad: es la base del <b>Ejemplo 1 del profesor</b> (demanda de TV).</p>`,
 preg:String.raw`<p>¿Qué precio maximiza la utilidad, si cada televisor le cuesta \(c\) al almacén?</p>`,
 datos:String.raw`<p>El modelo log-log de la estación de especificación: \(\ln Y_t=\beta_1+\beta_2\ln X_{2t}+\beta_3\ln X_{3t}+u_t\), con \(Y\) la demanda, \(X_2\) el precio y \(X_3\) la publicidad. Estimado por MCO con \(n=48\):</p>
<table class="tbl"><tr><th></th><th>Coeficiente</th><th>Error estándar</th><th>t</th></tr>
<tr><td>Intercepto</td><td>16,5223</td><td>0,7616</td><td>21,69</td></tr>
<tr><td>ln(precio)</td><td>−2,2467</td><td>0,0968</td><td>−23,20</td></tr>
<tr><td>ln(publicidad)</td><td>0,1345</td><td>0,0364</td><td>3,70</td></tr></table>
<p>\(R^2=0{,}939\) y \(S=0{,}0846\). En un modelo log-log cada pendiente es una <b>elasticidad</b>: si el precio sube 1 %, la demanda cae 2,25 %.</p>`,
 paso:String.raw`<ol><li><b>¿La demanda es elástica?</b> Se prueba \(H_0:\beta_2=-1\). \(t=(-2{,}2467+1)/0{,}0968=-12{,}88\), mucho más allá de \(-2{,}01\). La elasticidad es mayor que 1 en valor absoluto: un precio más bajo <i>sube</i> el ingreso.</li>
<li><b>Regla del precio óptimo.</b> La utilidad es \((P-c)\,Q(P)\). Al derivar e igualar a cero sale la regla de Lerner: \(\dfrac{P-c}{P}=\dfrac{1}{|\varepsilon|}\), o sea \(P^*=c\cdot\dfrac{|\varepsilon|}{|\varepsilon|-1}\).</li>
<li><b>Con la estimación:</b> \(P^*=c\cdot 2{,}2467/1{,}2467=1{,}80\,c\). El precio óptimo es 80 % sobre el costo.</li>
<li><b>La incertidumbre también se traslada.</b> El intervalo del 95 % de \(\beta_2\) es \(-2{,}2467\pm2{,}014(0{,}0968)=[-2{,}44;\,-2{,}05]\). Con esos extremos el margen óptimo va de \(1{,}69\,c\) a \(1{,}95\,c\).</li></ol>`,
 simh:"Mueve el costo unitario y el precio. La curva es la utilidad que predice el modelo; el punto azul es tu precio y la franja, el rango del precio óptimo con el intervalo de la elasticidad.",
 benef:String.raw`<p>Con un costo de 700 por televisor, el último precio de la base (1.436 en el mes 50) está por encima del óptimo (≈ 1.261). Bajarlo aumenta las unidades vendidas en cerca de 34 % y la utilidad mensual en alrededor de 2 %. El simulador recalcula esas cifras con tu costo.</p>
<p>La lección práctica es que la utilidad es plana cerca del óptimo. Equivocarse 5 % en el precio cuesta poco; equivocarse en el <i>signo</i> de la decisión (subir cuando había que bajar) cuesta mucho. Por eso la prueba de \(H_0:\beta_2=-1\) es la que manda.</p>`,
 limite:String.raw`<ul><li>La elasticidad es la del rango de precios observado (904 a 1.471). Fuera de ese rango el modelo extrapola.</li>
<li>Supone que la competencia no reacciona. Si los rivales igualan la rebaja, la elasticidad efectiva es menor.</li>
<li>Si hay autocorrelación (es una serie mensual), los errores estándar de MCO están subestimados y el intervalo real es más ancho. Revísalo en la estación de autocorrelación antes de decidir.</li>
<li>Al volver de logaritmos a unidades, \(e^{\widehat{\ln Y}}\) subestima un poco la media. La corrección es multiplicar por \(e^{S^2/2}=1{,}0036\): aquí es despreciable.</li></ul>`,
 r:String.raw`n = 48
m = lm(log(Yt) ~ log(X2t) + log(X3t), data = Datos[1:n, ])
summary(m)
b2 = coef(m)[2]; se2 = sqrt(vcov(m)[2, 2])
(b2 + 1) / se2                         # t de H0: elasticidad = -1
c0 = 700                               # costo unitario (supuesto)
c0 * abs(b2) / (abs(b2) - 1)           # precio óptimo de Lerner
ic = b2 + c(-1, 1) * qt(0.975, n - 3) * se2
c0 * abs(ic) / (abs(ic) - 1)           # rango del precio óptimo`}},
{id:"lab-inventario",t:"Cuánto inventario pedir con el intervalo de predicción",sector:"Logística · inventarios",links:["inferencia","mco-matricial"],sim:"labInventario",
 caso:{
 sit:String.raw`<p>El mismo almacén debe hacer el pedido del mes 49 antes de conocer la demanda. Ya sabe el precio (1.425) y la publicidad (64,458) que va a usar. Si pide de más, liquida los sobrantes con pérdida; si pide de menos, pierde ventas.</p>`,
 preg:String.raw`<p>¿Cuántas unidades pedir para maximizar la utilidad esperada?</p>`,
 datos:String.raw`<p>El modelo lineal del Ejemplo 1: \(\hat Y_0=10{,}3017-0{,}005994\,X_{2,0}+0{,}005107\,X_{3,0}\). Con los valores del mes 49:</p>
<ul><li>Pronóstico puntual: \(\hat Y_0=2{,}0893\).</li>
<li>Error estándar de la media: \(\sqrt{S^2\,x_0'(X'X)^{-1}x_0}=0{,}0303\).</li>
<li>Error estándar de la <b>predicción individual</b>: \(\sqrt{S^2\,(1+x_0'(X'X)^{-1}x_0)}=\sqrt{0{,}1642^2+0{,}0303^2}=0{,}1669\).</li></ul>
<p>Para un pedido se usa la segunda: lo que se vende un mes concreto varía alrededor de la media.</p>`,
 paso:String.raw`<ol><li><b>Costo de quedarse corto</b> por unidad: \(c_u=P-c\) (el margen que se pierde).</li>
<li><b>Costo de pasarse</b> por unidad: \(c_o=c-s\), donde \(s\) es lo que se recupera al liquidar.</li>
<li><b>Razón crítica:</b> \(RC=\dfrac{c_u}{c_u+c_o}\). Es la probabilidad de no quedarse corto que conviene comprar.</li>
<li><b>Pedido óptimo:</b> \(Q^*=\hat Y_0+z_{RC}\cdot ee(\text{pred})\), con \(z_{RC}\) el cuantil de la normal estándar.</li>
<li>Con \(c=700\) y \(s=500\): \(RC=725/925=0{,}784\), \(z=0{,}785\) y \(Q^*=2{,}0893+0{,}785(0{,}1669)=2{,}220\).</li></ol>`,
 simh:"Cambia el costo y el valor de liquidación. Verás cómo se mueve la razón crítica, el pedido óptimo y cuánto se ahorra frente a pedir solo el pronóstico puntual.",
 benef:String.raw`<p>Pedir exactamente el pronóstico puntual (2,089) parece lo natural, pero ignora que perder una venta cuesta más que liquidar un sobrante. Con los valores de ejemplo, pedir \(Q^*\) baja el costo esperado de equivocarse en cerca de una cuarta parte (de 61,6 a 45,3 por mes). El simulador lo calcula con la fórmula de la pérdida normal.</p>
<p>Lo que aporta la econometría es el <b>ancho</b> del intervalo: sin \(ee(\text{pred})\) no hay forma de saber cuánto colchón poner.</p>`,
 limite:String.raw`<ul><li>Supone errores normales. Revisa Jarque-Bera en la estación de diagnóstico; con colas pesadas el colchón se queda corto.</li>
<li>Con \(n-k=45\) grados de libertad, la t y la normal casi coinciden. Con muestras pequeñas usa el cuantil de la t.</li>
<li>Si la demanda tiene tendencia o estacionalidad que el modelo no recoge, el pronóstico puntual está sesgado y ningún colchón lo arregla.</li></ul>`,
 r:String.raw`n = 48
m = lm(Yt ~ X2t + X3t, data = Datos[1:n, ])
nuevo = data.frame(X2t = 1425, X3t = 64.458)
p = predict(m, nuevo, se.fit = TRUE)
ee_pred = sqrt(p$residual.scale^2 + p$se.fit^2)
P = 1425; c0 = 700; s = 500
RC = (P - c0) / ((P - c0) + (c0 - s))
Q = p$fit + qnorm(RC) * ee_pred
c(pronostico = p$fit, ee_pred = ee_pred, RC = RC, pedido = Q)`}},
{id:"lab-escala",t:"¿Conviene crecer? Economías de escala con la función de costos",sector:"Energía e industria · expansión",links:["especificacion","inferencia"],sim:"labEscala",
 caso:{
 sit:String.raw`<p>Una empresa generadora de electricidad evalúa duplicar su producción, por ejemplo comprando la planta de un competidor. La base es la de Nerlove (145 empresas de EE. UU.) del <b>Trabajo 1, punto 2</b>.</p>`,
 preg:String.raw`<p>Si la producción se multiplica por \(k\), ¿por cuánto se multiplica el costo total? ¿Y cuánto sube el presupuesto si se encarece el combustible?</p>`,
 datos:String.raw`<p>Función de costos Cobb-Douglas en logaritmos: \(\ln TC=\beta_1+\beta_2\ln Q+\beta_3\ln P_L+\beta_4\ln P_F+\beta_5\ln P_K+u\).</p>
<table class="tbl"><tr><th></th><th>Coeficiente</th><th>Error estándar</th></tr>
<tr><td>ln Q (producción)</td><td>0,8015</td><td>0,0111</td></tr>
<tr><td>ln P<sub>L</sub> (salario)</td><td>0,1294</td><td>0,1811</td></tr>
<tr><td>ln P<sub>F</sub> (combustible)</td><td>0,4585</td><td>0,0639</td></tr>
<tr><td>ln P<sub>K</sub> (capital)</td><td>−0,4173</td><td>0,2154</td></tr></table>
<p>\(R^2=0{,}975\), \(n=145\).</p>`,
 paso:String.raw`<ol><li><b>Elasticidad costo-producción:</b> \(\beta_2=0{,}8015\). Si \(Q\) sube 1 %, el costo sube 0,80 %.</li>
<li><b>¿Hay economías de escala?</b> Se prueba \(H_0:\beta_2=1\) (rendimientos constantes). \(t=(0{,}8015-1)/0{,}0111=-17{,}9\): se rechaza.</li>
<li><b>Rendimientos a escala:</b> \(r=1/\beta_2=1{,}248\). Si todos los insumos se duplican, la producción se multiplica por \(2^{1{,}248}=2{,}37\), en el promedio de la muestra.</li>
<li><b>Multiplicar la producción por \(k\):</b> \(TC_1/TC_0=k^{\beta_2}\). Con \(k=2\): \(2^{0{,}8015}=1{,}743\). Dos plantas separadas costarían 2; una sola que produce lo mismo cuesta 1,743. El ahorro es \(1-1{,}743/2=12{,}9\,\%\).</li>
<li><b>Choque de combustible:</b> si \(P_F\) sube \(g\,\%\), el costo sube \(\beta_4\cdot g\approx0{,}46\,g\,\%\).</li></ol>`,
 simh:"Elige cuánto crece la producción y cuánto cambia el precio del combustible. La franja usa el intervalo del 95 % de β₂.",
 benef:String.raw`<p>Para una empresa que hoy gasta 10 millones de dólares al año, duplicar la producción en una sola operación costaría unos 17,4 millones en lugar de 20: un ahorro anual cercano a 2,6 millones. Con el intervalo de \(\beta_2\), el ahorro va de 11,5 % a 14 %. Esa cifra es la que se compara con el precio de compra de la planta.</p>`,
 limite:String.raw`<ul><li>Nerlove mostró que las economías de escala <b>se agotan</b> en las empresas grandes. Un \(\beta_2\) único promedia empresas pequeñas (con mucho ahorro) y grandes (con poco). Agrega \((\ln Q)^2\) y verás que la elasticidad crece con \(Q\).</li>
<li>La teoría exige \(\beta_3+\beta_4+\beta_5=1\) (homogeneidad en precios). Aquí suman 0,17, y \(\beta_5\) tiene signo negativo. El modelo sin restringir no es del todo coherente: estima el restringido con la prueba F de la estación de inferencia.</li>
<li>Con corte transversal de empresas de tamaños muy distintos, sospecha heterocedasticidad: usa errores robustos (estación de heterocedasticidad).</li></ul>`,
 r:String.raw`m = lm(log(TC) ~ log(Q) + log(PL) + log(PF) + log(PK), data = nerlove)
b2 = coef(m)[2]; se2 = sqrt(vcov(m)[2, 2])
(b2 - 1) / se2                         # t de H0: rendimientos constantes
1 / b2                                 # rendimientos a escala
k = 2
k^b2                                   # multiplicador del costo
1 - k^b2 / k                           # ahorro frente a k plantas
ic = b2 + c(-1, 1) * qt(0.975, df.residual(m)) * se2
1 - k^ic / k                           # rango del ahorro`}},
{id:"lab-cambio",t:"Detectar a tiempo que el consumidor cambió (Chow)",sector:"Consumo masivo · pronóstico de ventas",links:["chow"],sim:"labCambio",
 caso:{
 sit:String.raw`<p>Una empresa de consumo masivo pronostica sus ventas con la relación entre consumo e ingreso. Usa la base trimestral 2005-2010 del <b>Trabajo 1, punto 5</b>. En 2008 llega la crisis financiera y nadie ajusta el modelo.</p>`,
 preg:String.raw`<p>¿Cambió la relación consumo-ingreso? ¿Cuánto se equivoca el pronóstico si se sigue usando el modelo de antes?</p>`,
 datos:String.raw`<p>Modelo \(Y_t=\beta_1+\beta_2X_t+u_t\) (consumo e ingreso), estimado en tres muestras:</p>
<table class="tbl"><tr><th>Muestra</th><th>\(\hat\beta_1\)</th><th>\(\hat\beta_2\)</th><th>RSS</th></tr>
<tr><td>Completa (T = 1 a 24)</td><td>1,2106</td><td>0,7188</td><td>0,15577</td></tr>
<tr><td>Antes (T = 1 a 12)</td><td>0,2256</td><td>0,8157</td><td rowspan="2">0,03228 (suma)</td></tr>
<tr><td>Después (T = 13 a 24)</td><td>−0,4814</td><td>0,8632</td></tr></table>`,
 paso:String.raw`<ol><li><b>Estadístico de Chow:</b> \(F=\dfrac{(RSS_R-RSS_{NR})/k}{RSS_{NR}/(n-2k)}=\dfrac{(0{,}15577-0{,}03228)/2}{0{,}03228/20}=38{,}25\).</li>
<li><b>Valor crítico:</b> \(F_{0{,}05}(2,20)=3{,}49\). Se rechaza la estabilidad: el valor p es \(1{,}5\times10^{-7}\).</li>
<li><b>Lo que cambió:</b> a igual ingreso, el nivel de consumo bajó (el intercepto pasa de 0,23 a −0,48), aunque la pendiente casi no se movió.</li>
<li><b>El costo de no darse cuenta:</b> con el modelo de antes, el pronóstico de 2008-2010 sobrestima el consumo en 0,169 por trimestre en promedio. Eso es 1,8 % de las ventas. El error cuadrático medio pasa de 0,051 (modelo nuevo) a 0,177 (modelo viejo).</li></ol>`,
 simh:"Mueve el trimestre de corte: la prueba de Chow se calcula en vivo con los datos del trabajo. El pico de F señala el quiebre más probable. Abajo, traduce el sesgo del pronóstico a plata con tus compras anuales.",
 benef:String.raw`<p>Si la empresa compra inventario por 50.000 millones de pesos al año guiada por ese pronóstico, un sesgo de 1,8 % son cerca de 900 millones en mercancía de más por año. Correr la prueba de Chow cada trimestre (o la de pronósticos de Chow, que sirve con pocos datos nuevos) avisa del cambio y permite reestimar.</p>`,
 limite:String.raw`<ul><li>Chow exige saber dónde está el corte. Si lo eliges mirando los datos (el pico del simulador), el valor crítico de la F se queda corto: hay que usar la prueba sup-F de Andrews (estación de cambio estructural a fondo).</li>
<li>Con pocos trimestres después del corte, usa la prueba de pronósticos de Chow en vez de la de dos regresiones.</li>
<li>Supone varianzas iguales en ambos periodos. Si la crisis también hizo más volátil el consumo, compara primero las varianzas (Goldfeld-Quandt).</li></ul>`,
 r:String.raw`d = consumoq                              # columnas T, Y, X
r  = lm(Y ~ X, data = d)
a  = lm(Y ~ X, data = d[1:12, ])
b  = lm(Y ~ X, data = d[13:24, ])
RSSr = sum(resid(r)^2); RSSnr = sum(resid(a)^2) + sum(resid(b)^2)
k = 2; n = nrow(d)
F = ((RSSr - RSSnr) / k) / (RSSnr / (n - 2 * k))
c(F = F, critico = qf(0.95, k, n - 2 * k), p = 1 - pf(F, k, n - 2 * k))
e = d$Y[13:24] - predict(a, d[13:24, ])  # error del modelo viejo
mean(e); sqrt(mean(e^2))`}}
];
