// Métodos Lineales · contenido de la ruta (programa 1504104)
// =====================================================================
// CONTENIDO: Métodos Lineales (1504104, U. de Antioquia): álgebra lineal con aplicaciones económicas.
// Bibliografía del curso: Grossman, Lay, Strang. Los laboratorios trabajan con fracciones exactas.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const ENTRADA=`<p class="hint">En los laboratorios, cada fila de la matriz va en una línea y las entradas se separan con espacios. Sirven enteros, decimales (0.5) y fracciones (3/4); los resultados salen en fracciones exactas.</p>`;
const TRUNK=[
// ===================== UNIDAD 1 =====================
{id:"matrices", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"Matrices y operaciones", sim:"ops", html:String.raw`
<section><h3>Definición</h3><p class="lead">Una matriz \(A\) de tamaño \(m\times n\) es un arreglo de números con \(m\) filas y \(n\) columnas; \(a_{ij}\) es la entrada de la fila \(i\) y la columna \(j\). Dos matrices son iguales si tienen el mismo tamaño y las mismas entradas.</p></section>
<section><h3>Matrices especiales</h3>
<div class="tbl"><table><tr><th>Nombre</th><th>Condición</th></tr><tr><td>Nula \(0\)</td><td>Todas las entradas son 0</td></tr><tr><td>Identidad \(I\)</td><td>Cuadrada, unos en la diagonal y ceros fuera</td></tr><tr><td>Diagonal</td><td>Ceros fuera de la diagonal</td></tr><tr><td>Escalar</td><td>Diagonal con todas las entradas de la diagonal iguales: \(kI\)</td></tr><tr><td>Triangular superior / inferior</td><td>Ceros debajo / encima de la diagonal</td></tr><tr><td>Simétrica</td><td>\(A^T=A\)</td></tr><tr><td>Antisimétrica</td><td>\(A^T=-A\) (diagonal de ceros)</td></tr><tr><td>Idempotente</td><td>\(A^2=A\) (por ejemplo, la matriz de proyección de mínimos cuadrados)</td></tr></table></div>
<p>La <b>traspuesta</b> \(A^T\) cambia filas por columnas: \((A^T)^T=A\), \((A+B)^T=A^T+B^T\), \((kA)^T=kA^T\), \((AB)^T=B^TA^T\). Toda matriz cuadrada es la suma de una simétrica y una antisimétrica: \(A=\frac{A+A^T}2+\frac{A-A^T}2\).</p></section>
<section><h3>Operaciones</h3>
<p><b>Suma</b> (mismo tamaño) entrada por entrada: conmutativa y asociativa. <b>Producto por escalar:</b> cada entrada por \(k\). <b>Producto</b> \(AB\) (columnas de \(A\) = filas de \(B\)):</p>
<div class="mj">\[(AB)_{ij}=\sum_{k}a_{ik}b_{kj}=\text{(fila }i\text{ de }A)\cdot\text{(columna }j\text{ de }B)\]</div>
<p>El producto es asociativo y distributivo, pero <b>no conmutativo</b>: en general \(AB\ne BA\). Además, \(AB=0\) no implica que \(A=0\) o \(B=0\). El producto \(A\mathbf x\) es una <b>combinación lineal de las columnas</b> de \(A\) con los coeficientes de \(\mathbf x\): \(A\mathbf x=x_1\mathbf a_1+\dots+x_n\mathbf a_n\).</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"Si A es 2×3 y B es 3×4, ¿de qué tamaño es AB? ¿Existe BA?",a:"AB es 2×4. BA no existe: B tiene 4 columnas y A tiene 2 filas."},{q:"¿Es idempotente la matriz [[1, 0], [0, 0]]?",a:"Sí: al multiplicarla por sí misma se obtiene la misma matriz."}]},

{id:"sistemas", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"Sistemas de ecuaciones: Gauss, Gauss-Jordan y rango", sim:"gauss", html:String.raw`
<section><h3>Forma matricial</h3><p>Un sistema de \(m\) ecuaciones con \(n\) incógnitas se escribe \(A\mathbf x=\mathbf b\), y se trabaja con la <b>matriz aumentada</b> \([A\mid\mathbf b]\). Si \(\mathbf b=\mathbf 0\), el sistema es <b>homogéneo</b> y siempre tiene la solución trivial.</p></section>
<section><h3>Operaciones elementales por filas</h3><ol><li>Intercambiar dos filas: \(F_i\leftrightarrow F_j\).</li><li>Multiplicar una fila por un número distinto de cero: \(F_i\to kF_i\).</li><li>Sumar a una fila un múltiplo de otra: \(F_i\to F_i+kF_j\).</li></ol>
<p>No cambian las soluciones. <b>Gauss</b> lleva la matriz a forma escalonada (ceros debajo de cada pivote) y despeja hacia atrás; <b>Gauss-Jordan</b> sigue hasta la forma escalonada <b>reducida</b>: pivotes iguales a 1 y ceros encima y debajo.</p></section>
<section><h3>Rango y tipos de solución (Rouché-Frobenius)</h3>
<p>El <b>rango</b> es el número de pivotes (filas no nulas de la forma escalonada).</p>
<div class="tbl"><table><tr><th>Caso</th><th>Soluciones</th></tr><tr><td>\(r(A)&lt;r([A\mid b])\)</td><td>Ninguna (inconsistente): aparece una fila \(0=c\ne0\)</td></tr><tr><td>\(r(A)=r([A\mid b])=n\)</td><td>Única</td></tr><tr><td>\(r(A)=r([A\mid b])&lt;n\)</td><td>Infinitas, con \(n-r\) variables libres</td></tr></table></div></section>
<section><h3>Ejemplo</h3><p>\(2x+y-z=8\), \(-3x-y+2z=-11\), \(-2x+y+2z=-3\). Gauss-Jordan lleva a \(x=2\), \(y=3\), \(z=-1\). El laboratorio muestra cada operación por filas.</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"Un sistema homogéneo tiene 3 ecuaciones y 5 incógnitas. ¿Puede tener solución única?",a:"No: el rango es como mucho 3 < 5, así que hay al menos 2 variables libres e infinitas soluciones."}]},

{id:"inversa", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"La inversa de una matriz", sim:"inv", html:String.raw`
<section><h3>Definición y propiedades</h3><p>\(A\) cuadrada es <b>invertible</b> si existe \(A^{-1}\) con \(AA^{-1}=A^{-1}A=I\). Es única. Propiedades: \((A^{-1})^{-1}=A\), \((AB)^{-1}=B^{-1}A^{-1}\), \((A^T)^{-1}=(A^{-1})^T\), \((kA)^{-1}=\frac1kA^{-1}\).</p>
<p>Son equivalentes: \(A\) es invertible; \(\det A\ne0\); el rango es \(n\); \(A\mathbf x=\mathbf 0\) solo tiene la solución trivial; \(A\mathbf x=\mathbf b\) tiene solución única \(\mathbf x=A^{-1}\mathbf b\).</p></section>
<section><h3>Algoritmo de Gauss-Jordan</h3><p>Se forma \([A\mid I]\) y se aplican operaciones por filas hasta obtener \([I\mid A^{-1}]\). Si aparece una fila de ceros a la izquierda, \(A\) no es invertible (es singular).</p>
<p>Para \(2\times2\): \(\begin{pmatrix}a&b\\c&d\end{pmatrix}^{-1}=\frac1{ad-bc}\begin{pmatrix}d&-b\\-c&a\end{pmatrix}\).</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"¿Cuál es la inversa de [[2, 1], [5, 3]]?",a:"det = 6 − 5 = 1, así que la inversa es [[3, −1], [−5, 2]]."}]},

{id:"lu", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"Factorización LU", sim:"lu", html:String.raw`
<section><h3>La idea</h3><p class="lead">Escribir \(A=LU\), con \(L\) triangular inferior (unos en la diagonal) y \(U\) triangular superior. \(U\) es la forma escalonada de Gauss y \(L\) guarda los multiplicadores \(l_{ij}\) usados para hacer ceros.</p>
<p>Para resolver \(A\mathbf x=\mathbf b\): primero \(L\mathbf y=\mathbf b\) por sustitución hacia adelante y luego \(U\mathbf x=\mathbf y\) por sustitución hacia atrás. Conviene cuando hay que resolver muchos sistemas con la misma \(A\) y distintos \(\mathbf b\) (por ejemplo, varios escenarios de demanda final en un modelo de Leontief).</p>
<p>Si en algún paso el pivote es cero, hay que intercambiar filas: se obtiene \(PA=LU\) con una matriz de permutación \(P\).</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"¿Qué guarda la matriz L?",a:"Los multiplicadores de la eliminación: l_ij es el número que se multiplicó por la fila j para hacer cero la entrada (i, j)."}]},

{id:"equilibrio", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"Análisis de equilibrio: mercados, ingreso nacional, Leontief y comercio", sim:"econ", html:String.raw`
<section><h3>Equilibrio de mercado parcial</h3><p>Con varios bienes relacionados, \(Q_{di}=Q_{si}\) en cada mercado da un sistema lineal en los precios. Con dos bienes: \(Q_{d1}=a_0+a_1P_1+a_2P_2\), \(Q_{s1}=b_0+b_1P_1+b_2P_2\) y lo mismo para el bien 2. Igualando: \((a_1-b_1)P_1+(a_2-b_2)P_2=b_0-a_0\).</p></section>
<section><h3>Ingreso nacional</h3>
<p>\(Y=C+I_0+G_0\), \(C=a+b(Y-T)\), \(T=d+tY\). En forma matricial, con \(Y\), \(C\) y \(T\) como incógnitas:</p>
<div class="mj">\[\begin{pmatrix}1&-1&0\\-b&1&b\\-t&0&1\end{pmatrix}\begin{pmatrix}Y\\C\\T\end{pmatrix}=\begin{pmatrix}I_0+G_0\\a\\d\end{pmatrix}\qquad Y^*=\frac{a-bd+I_0+G_0}{1-b+bt}\]</div></section>
<section><h3>Modelo insumo-producto de Leontief</h3>
<p>Cada sector usa productos de los otros como insumos. Si \(a_{ij}\) es el valor del insumo \(i\) necesario para producir una unidad del sector \(j\) (matriz de coeficientes técnicos \(A\)) y \(\mathbf d\) es la demanda final:</p>
<div class="mj">\[\mathbf x=A\mathbf x+\mathbf d\qquad\Longrightarrow\qquad\mathbf x=(I-A)^{-1}\mathbf d\]</div>
<p>\((I-A)\) es la matriz de Leontief y \((I-A)^{-1}\) la matriz de multiplicadores: su columna \(j\) dice cuánto debe producir cada sector para entregar una unidad más de demanda final del sector \(j\). Condición de viabilidad (Hawkins-Simon): los menores principales de \(I-A\) son positivos. El valor agregado de cada sector es \(1-\sum_ia_{ij}\) por peso producido.</p></section>
<section><h3>Comercio internacional</h3><p>Con dos países, las importaciones de uno son exportaciones del otro: \(Y_1=C_1+I_1+X_1-M_1\) con \(M_1=m_1Y_1\) y \(X_1=M_2=m_2Y_2\). El sistema conjunto muestra cómo un aumento de la inversión en un país se transmite al otro.</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"En Leontief, ¿qué significa la entrada (1, 2) de (I − A)⁻¹?",a:"Cuánto debe producir el sector 1 (directa e indirectamente) para que el sector 2 entregue una unidad más a la demanda final."}]},

{id:"determinantes", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"Determinantes", sim:"det", html:String.raw`
<section><h3>Cálculo</h3>
<div class="mj">\[\det\begin{pmatrix}a&b\\c&d\end{pmatrix}=ad-bc\]</div>
<p><b>Regla de Sarrus</b> (\(3\times3\)): suma de los productos de las tres diagonales hacia la derecha menos los de las tres hacia la izquierda. <b>Cofactores</b> (\(n\times n\)): \(\det A=\sum_ja_{ij}C_{ij}\) desarrollando por cualquier fila o columna, con \(C_{ij}=(-1)^{i+j}M_{ij}\) y \(M_{ij}\) el menor (determinante sin la fila \(i\) ni la columna \(j\)). Conviene desarrollar por la fila con más ceros.</p>
<p><b>Por triangulación:</b> el determinante de una matriz triangular es el producto de la diagonal. Se lleva \(A\) a forma triangular cuidando cómo afecta cada operación.</p></section>
<section><h3>Propiedades</h3><ul><li>Intercambiar dos filas cambia el signo; multiplicar una fila por \(k\) multiplica el determinante por \(k\); sumar a una fila un múltiplo de otra no lo cambia.</li><li>Una fila de ceros o dos filas proporcionales ⟹ \(\det=0\).</li><li>\(\det A^T=\det A\), \(\det(AB)=\det A\det B\), \(\det(kA)=k^n\det A\), \(\det A^{-1}=1/\det A\).</li><li>\(A\) es invertible si y solo si \(\det A\ne0\).</li></ul></section>
${ENTRADA}${LAB}`,
qs:[{q:"Si A es 3×3 con det A = 4, ¿cuánto vale det(2A)?",a:"2³·4 = 32."}]},

{id:"cramer", parte:"Unidad 1 · Matrices y sistemas de ecuaciones", t:"Regla de Cramer y la inversa por la adjunta", sim:"cram", html:String.raw`
<section><h3>Regla de Cramer</h3><p>Si \(\det A\ne0\), el sistema \(A\mathbf x=\mathbf b\) tiene solución única:</p>
<div class="mj">\[x_j=\frac{\det A_j}{\det A}\]</div><p>donde \(A_j\) es \(A\) con la columna \(j\) reemplazada por \(\mathbf b\). Es muy útil en economía para obtener una sola variable endógena (por ejemplo \(Y^*\)) sin resolver todo el sistema, y para la estática comparativa.</p></section>
<section><h3>Inversa por la adjunta</h3>
<div class="mj">\[A^{-1}=\frac1{\det A}\,\text{adj}(A),\qquad\text{adj}(A)=C^T\]</div><p>La <b>matriz de cofactores</b> \(C\) tiene en cada posición el cofactor \(C_{ij}\); la <b>adjunta</b> es su traspuesta. Luego \(\mathbf x=A^{-1}\mathbf b\).</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"Con Cramer, ¿qué pasa si det A = 0?",a:"No se puede aplicar: el sistema no tiene solución única (no tiene ninguna o tiene infinitas)."}]},

// ===================== UNIDAD 2 =====================
{id:"vectores", parte:"Unidad 2 · Vectores, espacios y subespacios", t:"Vectores en el plano y en el espacio", sim:"vec", html:String.raw`
<section><h3>Operaciones</h3><p>Suma y resta (ley del paralelogramo), producto por escalar y magnitud \(\|\mathbf u\|=\sqrt{u_1^2+u_2^2+u_3^2}\). Un vector unitario tiene magnitud 1: \(\mathbf u/\|\mathbf u\|\).</p></section>
<section><h3>Producto punto</h3>
<div class="mj">\[\mathbf u\cdot\mathbf v=\sum u_iv_i=\|\mathbf u\|\|\mathbf v\|\cos\theta\]</div>
<p>Si \(\mathbf u\cdot\mathbf v=0\), son <b>perpendiculares</b> (ortogonales). Si uno es múltiplo del otro, son <b>paralelos</b>. <b>Cauchy-Schwarz:</b> \(|\mathbf u\cdot\mathbf v|\le\|\mathbf u\|\|\mathbf v\|\). <b>Desigualdad triangular:</b> \(\|\mathbf u+\mathbf v\|\le\|\mathbf u\|+\|\mathbf v\|\). Proyección de \(\mathbf u\) sobre \(\mathbf v\): \(\frac{\mathbf u\cdot\mathbf v}{\mathbf v\cdot\mathbf v}\mathbf v\).</p></section>
<section><h3>Producto cruz (solo en \(\mathbb R^3\))</h3>
<div class="mj">\[\mathbf u\times\mathbf v=\begin{vmatrix}\mathbf i&\mathbf j&\mathbf k\\u_1&u_2&u_3\\v_1&v_2&v_3\end{vmatrix}\]</div>
<p>Es perpendicular a ambos. Su magnitud es el <b>área del paralelogramo</b> que forman; el triple producto \(|\mathbf u\cdot(\mathbf v\times\mathbf w)|\) es el <b>volumen del paralelepípedo</b>.</p></section>
<section><h3>Rectas y planos</h3><p>Recta por \(P_0\) con dirección \(\mathbf v\): \(P=P_0+t\mathbf v\). Plano por \(P_0\) con normal \(\mathbf n\): \(\mathbf n\cdot(P-P_0)=0\), es decir \(ax+by+cz=d\). El plano por tres puntos tiene normal \((P_2-P_1)\times(P_3-P_1)\).</p></section>
${LAB}`,
qs:[{q:"¿Son perpendiculares u = (1, 2, −1) y v = (3, −1, 1)?",a:"u·v = 3 − 2 − 1 = 0: sí."}]},

{id:"espacios", parte:"Unidad 2 · Vectores, espacios y subespacios", t:"Espacios vectoriales, independencia lineal, bases y dimensión", sim:"indep", html:String.raw`
<section><h3>Espacios y subespacios</h3><p>Un <b>espacio vectorial</b> es un conjunto con suma y producto por escalar que cumple diez axiomas (cerradura, conmutatividad, asociatividad, neutro, inverso, distributividad…). Ejemplos: \(\mathbb R^n\), las matrices \(m\times n\), los polinomios de grado \(\le n\). Un <b>subespacio</b> es un subconjunto no vacío cerrado bajo la suma y el producto por escalar (contiene al vector 0). El <b>subespacio generado</b> por \(\{\mathbf v_1,\dots,\mathbf v_k\}\) es el conjunto de todas sus combinaciones lineales.</p></section>
<section><h3>Independencia lineal</h3><p>\(\{\mathbf v_1,\dots,\mathbf v_k\}\) es <b>linealmente independiente</b> si \(c_1\mathbf v_1+\dots+c_k\mathbf v_k=\mathbf 0\) solo se cumple con todos los \(c_i=0\). Prueba: se ponen los vectores como columnas de una matriz; son independientes si el rango es \(k\). Más de \(n\) vectores de \(\mathbb R^n\) siempre son dependientes.</p></section>
<section><h3>Bases y dimensión</h3><p>Una <b>base</b> es un conjunto independiente que genera el espacio. Todas las bases tienen el mismo número de vectores: la <b>dimensión</b>. En \(\mathbb R^n\), \(n\) vectores forman una base si y solo si la matriz que forman tiene determinante distinto de cero. Las coordenadas de un vector en una base se obtienen resolviendo un sistema.</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"¿Son base de ℝ³ los vectores (1, 0, 1), (0, 1, 1) y (1, 1, 2)?",a:"No: el tercero es la suma de los dos primeros, así que son dependientes (el determinante es 0)."}]},

{id:"subespacios", parte:"Unidad 2 · Vectores, espacios y subespacios", t:"Los cuatro subespacios fundamentales", sim:"cuatro", html:String.raw`
<section><h3>La idea</h3><p class="lead">Toda matriz \(A\) de \(m\times n\) y rango \(r\) define cuatro subespacios (Strang):</p>
<div class="tbl"><table><tr><th>Subespacio</th><th>Vive en</th><th>Dimensión</th><th>Base</th></tr>
<tr><td>Espacio columna \(C(A)\)</td><td>\(\mathbb R^m\)</td><td>\(r\)</td><td>Las columnas de \(A\) donde hay pivote</td></tr>
<tr><td>Espacio fila \(C(A^T)\)</td><td>\(\mathbb R^n\)</td><td>\(r\)</td><td>Las filas no nulas de la forma escalonada reducida</td></tr>
<tr><td>Espacio nulo \(N(A)\)</td><td>\(\mathbb R^n\)</td><td>\(n-r\)</td><td>Un vector por cada variable libre de \(A\mathbf x=\mathbf 0\)</td></tr>
<tr><td>Espacio nulo izquierdo \(N(A^T)\)</td><td>\(\mathbb R^m\)</td><td>\(m-r\)</td><td>El espacio nulo de \(A^T\)</td></tr></table></div>
<p><b>Teorema fundamental:</b> el espacio fila es ortogonal al nulo, y el espacio columna es ortogonal al nulo izquierdo. Además \(r+(n-r)=n\) (teorema del rango). \(A\mathbf x=\mathbf b\) tiene solución si y solo si \(\mathbf b\) está en el espacio columna.</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"A es 3×5 con rango 2. ¿Dimensiones de los cuatro subespacios?",a:"Columna 2, fila 2, nulo 5 − 2 = 3, nulo izquierdo 3 − 2 = 1."}]},

// ===================== UNIDAD 3 =====================
{id:"ortogonal", parte:"Unidad 3 · Bases ortogonales, valores y vectores propios", t:"Bases ortonormales, Gram-Schmidt, proyecciones y distancias", sim:"gs", html:String.raw`
<section><h3>Bases ortogonales y ortonormales</h3><p>Una base es <b>ortogonal</b> si sus vectores son perpendiculares dos a dos, y <b>ortonormal</b> si además son unitarios. En una base ortonormal, las coordenadas son productos punto: \(\mathbf x=\sum(\mathbf x\cdot\mathbf q_i)\mathbf q_i\). Una matriz con columnas ortonormales cumple \(Q^TQ=I\).</p></section>
<section><h3>Proceso de Gram-Schmidt</h3>
<div class="mj">\[\mathbf w_1=\mathbf v_1,\qquad\mathbf w_k=\mathbf v_k-\sum_{j&lt;k}\frac{\mathbf v_k\cdot\mathbf w_j}{\mathbf w_j\cdot\mathbf w_j}\,\mathbf w_j,\qquad\mathbf q_k=\frac{\mathbf w_k}{\|\mathbf w_k\|}\]</div>
<p>A cada vector se le quitan sus proyecciones sobre los anteriores. Si algún \(\mathbf w_k\) sale 0, el vector \(\mathbf v_k\) dependía de los anteriores.</p></section>
<section><h3>Complementos ortogonales y proyecciones</h3><p>El complemento ortogonal \(W^\perp\) reúne los vectores perpendiculares a todo \(W\). Todo \(\mathbf x\) se descompone en \(\mathbf x=\text{proy}_W\mathbf x+(\mathbf x-\text{proy}_W\mathbf x)\). Con \(W=C(A)\): \(\text{proy}=A(A^TA)^{-1}A^T\mathbf x\), la base de mínimos cuadrados de la econometría.</p></section>
<section><h3>Distancias</h3>
<div class="mj">\[d(P,\ ax+by+cz=d)=\frac{|ax_0+by_0+cz_0-d|}{\sqrt{a^2+b^2+c^2}}\qquad d(P,\text{recta})=\frac{\|(P-P_0)\times\mathbf v\|}{\|\mathbf v\|}\]</div><p>En el plano, la distancia de \((x_0,y_0)\) a \(ax+by=c\) es \(\frac{|ax_0+by_0-c|}{\sqrt{a^2+b^2}}\).</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"Distancia del punto (1, 2, 3) al plano x + y + z = 0.",a:"|1 + 2 + 3|/√3 = 6/√3 = 2√3 ≈ 3,46."}]},

{id:"propios", parte:"Unidad 3 · Bases ortogonales, valores y vectores propios", t:"Valores y vectores propios y diagonalización", sim:"eig", html:String.raw`
<section><h3>Definición</h3><p>\(\lambda\) es un <b>valor propio</b> de \(A\) si existe \(\mathbf v\ne\mathbf 0\) con \(A\mathbf v=\lambda\mathbf v\); \(\mathbf v\) es un <b>vector propio</b>. La matriz solo estira (o invierte) esa dirección.</p>
<div class="mj">\[\det(A-\lambda I)=0\quad\text{(ecuación característica)}\qquad(A-\lambda I)\mathbf v=\mathbf 0\]</div>
<p>Propiedades: \(\sum\lambda_i=\text{tr}A\) y \(\prod\lambda_i=\det A\). Los de una triangular son su diagonal. \(A\) es invertible si y solo si 0 no es valor propio.</p></section>
<section><h3>Diagonalización</h3><p>\(A\) es <b>diagonalizable</b> si tiene \(n\) vectores propios independientes; entonces \(A=PDP^{-1}\), con los vectores propios como columnas de \(P\) y los valores propios en la diagonal de \(D\). Basta que los \(n\) valores propios sean distintos. Con valores repetidos, hace falta que la multiplicidad geométrica (vectores propios independientes) iguale a la algebraica. Utilidad: \(A^k=PD^kP^{-1}\), clave en sistemas dinámicos.</p></section>
<section><h3>Matrices simétricas</h3><p>Si \(A=A^T\): todos los valores propios son reales, los vectores propios de valores distintos son ortogonales, y \(A\) siempre se diagonaliza con una matriz ortogonal: \(A=QDQ^T\) (teorema espectral).</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"Valores propios de [[2, 1], [1, 2]].",a:"λ² − 4λ + 3 = 0 ⟹ λ = 3 (vector (1, 1)) y λ = 1 (vector (−1, 1))."}]},

{id:"formas", parte:"Unidad 3 · Bases ortogonales, valores y vectores propios", t:"Formas cuadráticas, matrices definidas y hessianos", sim:"cuad", html:String.raw`
<section><h3>Formas cuadráticas</h3><p>\(Q(\mathbf x)=\mathbf x^TA\mathbf x\) con \(A\) simétrica. Con dos variables: \(Q=ax^2+2bxy+cy^2\) corresponde a \(A=\begin{pmatrix}a&b\\b&c\end{pmatrix}\) (el coeficiente cruzado se reparte por mitades).</p></section>
<section><h3>Clasificación</h3>
<div class="tbl"><table><tr><th>Tipo</th><th>Para todo \(\mathbf x\ne0\)</th><th>Menores principales dominantes \(D_k\)</th><th>Valores propios</th></tr>
<tr><td>Definida positiva</td><td>\(Q>0\)</td><td>Todos \(>0\)</td><td>Todos \(>0\)</td></tr><tr><td>Definida negativa</td><td>\(Q<0\)</td><td>Alternan: \(D_1<0,\ D_2>0,\ D_3<0\dots\)</td><td>Todos \(<0\)</td></tr>
<tr><td>Semidefinida positiva</td><td>\(Q\ge0\)</td><td>Todos los menores principales (no solo los dominantes) \(\ge0\)</td><td>Todos \(\ge0\)</td></tr><tr><td>Semidefinida negativa</td><td>\(Q\le0\)</td><td>Los de orden impar \(\le0\) y los de orden par \(\ge0\)</td><td>Todos \(\le0\)</td></tr><tr><td>Indefinida</td><td>Cambia de signo</td><td>Ninguno de los patrones</td><td>De signos distintos</td></tr></table></div></section>
<section><h3>Hessiano y hessiano orlado</h3><p>El <b>hessiano</b> \(H\) (matriz de segundas derivadas) definido negativo en un punto crítico indica un máximo; definido positivo, un mínimo. Con una restricción \(g=c\), se usa el <b>hessiano orlado</b>, que añade una fila y una columna con las derivadas de \(g\):</p>
<div class="mj">\[\bar H=\begin{pmatrix}0&g_x&g_y\\g_x&\mathcal L_{xx}&\mathcal L_{xy}\\g_y&\mathcal L_{yx}&\mathcal L_{yy}\end{pmatrix}\qquad|\bar H|>0\Rightarrow\text{máximo},\quad|\bar H|<0\Rightarrow\text{mínimo}\]</div><p>Estas herramientas se usan a fondo en Matemáticas para el análisis económico.</p></section>
${ENTRADA}${LAB}`,
qs:[{q:"Clasifica Q = 2x² + 2xy + 3y².",a:"A = [[2, 1], [1, 3]]: D₁ = 2 > 0 y D₂ = 6 − 1 = 5 > 0 ⟹ definida positiva."}]}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[{id:"formulas",t:"Hoja de fórmulas",anchor:"formas",links:["sistemas","inversa","determinantes","cramer","propios","formas"],sim:"hoja",html:WSBOX,d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del parcial."}];
const ALIAS={};
