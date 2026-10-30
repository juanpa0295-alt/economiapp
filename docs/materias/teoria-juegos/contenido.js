// Teoría de Juegos · contenido de la ruta (notación del curso, ejercicios de los talleres 1 a 3)
// =====================================================================
// CONTENIDO: Teoría de Juegos con la notación del curso (Taller 1, prof. Barrientos)
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const M2=(p1,p2,R,C,cells)=>`<div class="tbl gm"><table><tr><th class="pl" rowspan="2">${p1}</th><th></th><th class="pl" colspan="${C.length}">${p2}</th></tr><tr><th></th>${C.map(c=>`<th>${c}</th>`).join("")}</tr>${R.map((r,i)=>`<tr><th></th><th>${r}</th>${cells[i].map(c=>`<td class="${c[1]?"ne":""}">${c[0]}</td>`).join("")}</tr>`).join("")}</table></div>`;
const TRUNK=[
{id:"representacion", t:"Representación de juegos", nuevo:true, sim:"ext", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Un juego se puede escribir de dos formas. La <b>forma estratégica</b> (o normal) lista jugadores, estrategias y pagos. La <b>forma extensiva</b> dibuja el árbol: quién mueve, en qué orden y qué sabe cuando mueve.</p></section>
<section><h3>Forma estratégica</h3>
<div class="mj">\[G(\Gamma)=\{N,\;S_i,\;\pi_i\}\]</div>
<ul><li>\(N=\{1,2,\dots,n\}\): los jugadores.</li><li>\(S_i\): el conjunto de estrategias del jugador \(i\). Un perfil es \(s=(s_1,\dots,s_n)\in S=S_1\times\dots\times S_n\).</li><li>\(\pi_i(s_i,s_{-i})\): el pago de \(i\) cuando él juega \(s_i\) y los demás \(s_{-i}\).</li></ul>
<p>Con dos jugadores se escribe como tabla: el jugador 1 en las filas, el 2 en las columnas, y en cada celda \((\pi_1,\pi_2)\).</p></section>
<section><h3>Forma extensiva</h3>
<div class="tbl"><table><tr><th>Elemento</th><th>Qué representa</th></tr>
<tr><td>Nodo de decisión</td><td>Un momento en que un jugador elige; se marca con su número</td></tr>
<tr><td>Rama</td><td>Una acción disponible en ese nodo</td></tr>
<tr><td>Nodo terminal</td><td>Final del juego, con el vector de pagos \((\pi_1,\pi_2,\dots)\)</td></tr>
<tr><td>Conjunto de información</td><td>Nodos que el jugador no puede distinguir; se unen con línea punteada y tienen las mismas acciones</td></tr></table></div></section>
<section><h3>Estrategia = plan completo</h3>
<p>Una estrategia dice qué hacer en <b>cada</b> conjunto de información del jugador, incluso en los que no se alcanzan. Por eso el número de estrategias es un producto:</p>
<div class="mj">\[|S_i|=\prod_{\text{conjuntos de información de } i}\big(\text{acciones disponibles en ese conjunto}\big)\]</div></section>
<section><h3>Simultáneo frente a secuencial: la batalla de los sexos (Ej. 3)</h3>
<p><b>Simultáneo.</b> B no sabe qué eligió G: sus dos nodos están en el mismo conjunto de información. Entonces \(S_B=\{B,S\}\) y la tabla es de 2×2.</p>
${M2("G","B",["B","S"],["B","S"],[["3, 2"],["1, 1"]].map((x,i)=>i?[["0, 0"],["2, 3"]]:[["3, 2"],["1, 1"]]))}
<p><b>Secuencial.</b> B observa a G: tiene dos conjuntos de información, uno por cada jugada de G. Entonces</p>
<div class="mj">\[S_B=\{B,S\}\times\{B,S\}=\{BB,\;BS,\;SB,\;SS\}\]</div>
<p>donde \(BS\) se lee: «si G juega B, juego B; si G juega S, juego S».</p>
${M2("G","B",["B","S"],["BB","BS","SB","SS"],[[["3, 2"],["3, 2"],["1, 1"],["1, 1"]],[["0, 0"],["2, 3"],["0, 0"],["2, 3"]]])}</section>
<section><h3>Del árbol a la tabla</h3><p>Escribe el árbol en el laboratorio: lo dibuja, cuenta los conjuntos de información, arma las estrategias de cada jugador y construye la forma estratégica. Abajo encuentra los subjuegos y el equilibrio perfecto en subjuegos. Viene cargada la Figura 1.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> en la Figura 1 olvidar que el jugador 1 vuelve a mover después de X. Su estrategia debe decir qué haría allí aunque elija Z o Y, así que \(S_1=\{Z,X,Y\}\times\{B,A\}\) tiene 6 estrategias, no 3.</p>`,
deep:[
{k:"Ej. 1",t:"Entrada al mercado",html:String.raw`<p>La firma 1 decide entrar (E) o no (NE). Si entra, la 2 pelea (P) o concede (C). Monopolio: 2 millones. Si concede, se reparten (1, 1); si pelea, ambas pierden 1 millón.</p><div class="mj">\[G(\Gamma)=\{N=\{1,2\},\;S_1=\{E,NE\},\;S_2=\{P,C\},\;\pi_i\}\]</div>${M2("1","2",["E","NE"],["P","C"],[[["−1, −1"],["1, 1",1]],[["0, 2",1],["0, 2"]]])}<p>\(EN=\{(E,C),\,(NE,P)\}\). La rama «Juegos secuenciales» muestra por qué solo \((E,C)\) sobrevive a la inducción hacia atrás.</p>`},
{k:"Ej. 2",t:"Figura 1 en forma estratégica",html:String.raw`<p>El jugador 2 tiene dos conjuntos de información: uno con los nodos que siguen a Z y a X (línea punteada) y otro después de Y. El jugador 1 decide al inicio y otra vez tras X y L.</p><div class="mj">\[S_1=\{Z,X,Y\}\times\{B,A\}=\{ZB,ZA,XB,XA,YB,YA\}\qquad S_2=\{R,L\}\times\{R,L\}=\{RR,RL,LR,LL\}\]</div><p>La primera letra de la estrategia del 2 es lo que hace en el conjunto {Z, X}; la segunda, lo que hace después de Y.</p>${M2("1","2",["ZB","ZA","XB","XA","YB","YA"],["RR","RL","LR","LL"],[[["1, 1"],["1, 1"],["0, 0"],["0, 0"]],[["1, 1"],["1, 1"],["0, 0"],["0, 0"]],[["0, 0"],["0, 0"],["3, 2",1],["3, 2",1]],[["0, 0"],["0, 0"],["1, 2"],["1, 2"]],[["2, 2"],["2, 3",1],["2, 2"],["2, 3"]],[["2, 2"],["2, 3",1],["2, 2"],["2, 3"]]])}<p>\(EN=\{(XB,LR),\,(XB,LL),\,(YB,RL),\,(YA,RL)\}\). Puedes cargarla en el resolvedor.</p>`},
{k:"Ej. 10",t:"Figura 2 en forma estratégica",html:String.raw`<p>El 2 no sabe si el 1 jugó A o B (un solo conjunto de información), así que \(S_2=\{X,Y\}\). El 1 mueve al inicio y otra vez tras A y X: \(S_1=\{A,B\}\times\{C,D\}=\{AC,AD,BC,BD\}\).</p>${M2("1","2",["AC","AD","BC","BD"],["X","Y"],[[["1, 0"],["5, 5",1]],[["2, 10"],["5, 5"]],[["8, 3"],["3, 8"]],[["8, 3"],["3, 8"]]])}<p>Subrayando mejores respuestas: \(r_1(X)=\{BC,BD\}\), \(r_1(Y)=\{AC,AD\}\), \(r_2(AC)=Y\), \(r_2(AD)=X\), \(r_2(BC)=r_2(BD)=Y\). La única coincidencia es \(EN=\{(AC,Y)\}\).</p>`},
{k:"Ej. 7",t:"Simultáneo frente a secuencial con la Tabla 5",html:String.raw`<p>En simultáneo hay dos equilibrios: \((A,I)\) y \((B,D)\). Si el 1 mueve primero y el 2 observa, tras B el 2 elige D (1 &gt; 0) y el 1 obtiene 2 en vez de 1, así que juega B: el resultado secuencial es \((B,D)\). Mover primero le sirve al 1 para fijar el equilibrio que prefiere.</p>`}],
qs:[{q:"El jugador 1 tiene 3 acciones y el 2 observa la jugada antes de elegir entre 2 acciones. ¿Cuántas estrategias tiene el 2?",a:String.raw`Tiene 3 conjuntos de información con 2 acciones cada uno: \(2\times2\times2=8\) estrategias.`},
 {q:"¿Qué cambia en el árbol entre la versión simultánea y la secuencial de un juego?",a:"Solo los conjuntos de información del segundo jugador. En la simultánea sus nodos van unidos con línea punteada (no sabe qué pasó); en la secuencial cada nodo es su propio conjunto."}]},

{id:"dominancia", t:"Dominancia y eliminación iterativa", nuevo:true, sim:"dom", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un jugador racional nunca juega una estrategia que le da menos que otra pase lo que pase. Si además todos saben que todos son racionales, se pueden borrar esas estrategias una tras otra.</p></section>
<section><h3>Definiciones</h3>
<p>\(s_i'\) domina <b>estrictamente</b> a \(s_i\) si</p><div class="mj">\[\pi_i(s_i',s_{-i})>\pi_i(s_i,s_{-i})\qquad\forall\, s_{-i}\in S_{-i}\]</div>
<p>La dominancia es <b>débil</b> si se cumple con \(\ge\) para todos y con \(>\) en al menos un caso. Una estrategia también puede estar dominada por una <b>mezcla</b> \(\lambda s_i'+(1-\lambda)s_i''\).</p></section>
<section><h3>Procedimiento por rondas</h3><ol class="steps">
<li>En la ronda \(q=1\) busca una estrategia de algún jugador estrictamente dominada y elimínala.</li>
<li>Con la tabla reducida, en \(q=2\) busca de nuevo, ahora para cualquiera de los jugadores.</li>
<li>Sigue hasta que nada esté dominado. Lo que queda son las estrategias que sobreviven.</li></ol>
<p><b>Ejemplo, Tabla 2 (Ej. 4a):</b></p>
<div class="eq al" style="text-align:left">q = 1 · ∀s<sub>2</sub> ∈ S<sub>2</sub>: π<sub>1</sub>(A, s<sub>2</sub>) &gt; π<sub>1</sub>(C, s<sub>2</sub>) &nbsp;(3 &gt; 1, 2 &gt; 1, 1 &gt; 0) ⇒ S<sub>1</sub> = {A, B}<br>q = 2 · ∀s<sub>1</sub> ∈ S<sub>1</sub>: π<sub>2</sub>(s<sub>1</sub>, S) &gt; π<sub>2</sub>(s<sub>1</sub>, T) &nbsp;(2 &gt; 1, 3 &gt; 2) ⇒ S<sub>2</sub> = {R, S}</div>
<p>T no estaba dominada al comienzo: contra C, T paga 2 y S paga 0. Solo cae después de que se elimina C, por eso importa el orden de las rondas.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> eliminar estrategias débilmente dominadas como si fueran estrictas. Con dominancia débil el resultado depende del orden y se pueden perder equilibrios de Nash.</p>`,
deep:[
{k:"Ej. 9",t:"«Si un juego es soluble por dominancia, tiene un único EN»",html:String.raw`<p>Es cierto si se habla de dominancia <b>estricta</b>: la eliminación estricta nunca borra un equilibrio de Nash, así que si sobrevive un solo perfil, ese es el único EN.</p><p>Es falso con dominancia <b>débil</b>. En la Tabla 5 (Ej. 7), D domina débilmente a I para el jugador 2 (9 = 9 y 1 &gt; 0). Si se elimina I, el jugador 1 prefiere B y queda \((B,D)\). Pero \((A,I)\) también es equilibrio de Nash.</p>`},
{k:"Ej. 5",t:"Tabla 3 resuelta",html:String.raw`<div class="eq al" style="text-align:left">q = 1 · π<sub>1</sub>(A, s<sub>2</sub>) &gt; π<sub>1</sub>(B, s<sub>2</sub>) ∀s<sub>2</sub> &nbsp;(2 &gt; 1, 1 &gt; 0, 4 &gt; 3) ⇒ S<sub>1</sub> = {A, M}<br>q = 2 · π<sub>2</sub>(s<sub>1</sub>, D) &gt; π<sub>2</sub>(s<sub>1</sub>, C) ∀s<sub>1</sub> &nbsp;(2 &gt; 1, 3 &gt; 2) ⇒ S<sub>2</sub> = {I, D}</div><p>Ya no hay más dominancia: sobreviven {A, M} × {I, D}. En esa tabla, \(EN=\{(A,D),\,(M,I)\}\).</p>`}],
qs:[{q:"En la Tabla 2, ¿por qué no se puede eliminar T en la primera ronda?",a:"Porque contra C, T le da 2 al jugador 2 y S le da 0. La dominancia tiene que cumplirse contra todas las estrategias del rival que siguen vivas."}]},

{id:"nash", t:"Equilibrio de Nash en estrategias puras", sim:"nash", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un perfil es equilibrio de Nash cuando la estrategia de cada jugador es una mejor respuesta a la de los demás: nadie gana cambiando solo su propia estrategia.</p></section>
<section><h3>Definición</h3>
<div class="mj">\[s^*=(s_1^*,\dots,s_n^*)\text{ es EN si }\;\forall i\in N,\;\forall s_i\in S_i:\quad \pi_i(s_i^*,s_{-i}^*)\ \ge\ \pi_i(s_i,s_{-i}^*)\]</div>
<p>El enunciado del Ej. 8 usa \(&gt;\): eso define un equilibrio <b>estricto</b>. En los ejercicios se usa \(\ge\), porque un jugador indiferente no tiene incentivo a desviarse.</p></section>
<section><h3>Mejor respuesta</h3>
<div class="mj">\[r_i(s_{-i})=\arg\max_{s_i\in S_i}\;\pi_i(s_i,s_{-i})\qquad\qquad EN=r_1\cap r_2\]</div>
<ol class="steps"><li>Para cada columna, subraya el mayor \(\pi_1\): esas son \(r_1(\cdot)\).</li><li>Para cada fila, subraya el mayor \(\pi_2\): esas son \(r_2(\cdot)\).</li><li>Las celdas con los dos pagos subrayados forman \(r_1\cap r_2\).</li></ol>
<p><b>Ejemplo, batalla de los sexos:</b></p>
<div class="eq al" style="text-align:left">s<sub>G</sub> ∈ r<sub>G</sub> = { B = r<sub>G</sub>(B); S = r<sub>G</sub>(S) } &nbsp;&nbsp; s<sub>B</sub> ∈ r<sub>B</sub> = { B = r<sub>B</sub>(B); S = r<sub>B</sub>(S) }<br><b>EN = r<sub>G</sub> ∩ r<sub>B</sub> = {(B, B), (S, S)}</b></div></section>
${LAB}
<p class="warn"><b>Error común:</b> buscar el mejor pago del jugador 1 dentro de su fila. El jugador 1 compara <b>filas</b> dejando fija la columna del rival; el 2 compara columnas dejando fija la fila.</p>`,
deep:[
{k:"Ej. 8",t:"Qué implica que s′ no sea un equilibrio de Nash",html:String.raw`<p>Que al menos un jugador tiene una desviación unilateral rentable:</p><div class="mj">\[\exists\, i\in N,\;\exists\, s_i\in S_i:\quad \pi_i(s_i,s'_{-i})>\pi_i(s'_i,s'_{-i})\]</div><ul><li><b>Inestabilidad:</b> \(s'\) no es una predicción estable, porque alguien prefiere cambiar.</li><li><b>No es autocumplida:</b> aunque todos esperen \(s'\), el jugador \(i\) racionalmente se desvía.</li><li><b>Dinámica:</b> en un proceso de ajuste por mejores respuestas, el juego no se queda en \(s'\).</li></ul>`},
{k:"Ej. 6",t:"Juegos o Macro",html:String.raw`${M2("1","2",["J","M"],["J","M"],[[["2, 1",1],["0, 0"]],[["0, 0"],["1, 2",1]]])}<p>\(EN=\{(J,J),\,(M,M)\}\) en puras, y en mixtas \(\sigma^*=[(2/3,\,1/3);\,(1/3,\,2/3)]\). Es una batalla de los sexos: los dos quieren coordinar, pero cada uno prefiere un curso distinto.</p>`},
{k:"Ej. 14",t:"Tragedia de los comunes",html:String.raw`<p>\(G(\Gamma)=\{N=\{1,\dots,n\},\;S_i=[0,\infty),\;\pi_i(g_i,g_{-i})=g_i\,v(G)-c\,g_i\}\) con \(G=\sum_j g_j\). Un EN es un vector \((g_1^*,\dots,g_n^*)\) donde cada \(g_i^*\) maximiza \(\pi_i\) dado \(g_{-i}^*\). La condición de primer orden:</p><div class="mj">\[v(G^*)+g_i^*\,v'(G^*)-c=0\]</div><p>Cada campesino solo cuenta el daño \(v'\) sobre sus propias cabras, así que en equilibrio hay más cabras que en el óptimo social, donde se cumple \(v(G)+G\,v'(G)-c=0\).</p>`}],
py:`import numpy as np

def nash_puras(matriz_j1, matriz_j2):
    """Lo mismo que el módulo de Economiapp: busca celdas que sean
    mejor respuesta para los dos jugadores a la vez."""
    filas, columnas = matriz_j1.shape
    equilibrios = []
    for i in range(filas):
        for j in range(columnas):
            es_br1 = matriz_j1[i, j] == np.max(matriz_j1[:, j])  # r1(columna j)
            es_br2 = matriz_j2[i, j] == np.max(matriz_j2[i, :])  # r2(fila i)
            if es_br1 and es_br2:
                equilibrios.append((i, j))
    return equilibrios`,
qs:[{q:"En la Tabla 2, ¿es (A, S) equilibrio de Nash?",a:String.raw`Sí. Dado S, al jugador 1 le conviene A (2 &gt; 0 y 2 &gt; 1). Dado A, al jugador 2 le conviene S (2 &gt; 0 y 2 &gt; 1). El otro es (B, R).`},
 {q:"¿Puede un juego no tener equilibrio de Nash en estrategias puras?",a:"Sí, por ejemplo el penal del Ej. 18 o el juego de pares y nones. Pero todo juego finito tiene al menos uno en estrategias mixtas (teorema de Nash)."}]},

{id:"mixtas", t:"Estrategias mixtas", sim:"mix", html:String.raw`
<section><h3>La idea</h3><p class="lead">Una estrategia mixta \(\sigma_i\) es una distribución de probabilidad sobre \(S_i\). En equilibrio, cada jugador mezcla de forma que el <b>otro</b> quede indiferente entre las estrategias que usa.</p>
<div class="mj">\[\sigma=(\sigma_1,\sigma_2)=\big[(\sigma_A,\,1-\sigma_A);\;(\sigma_R,\,1-\sigma_R)\big]\]</div></section>
<section><h3>Procedimiento en un 2×2</h3><ol class="steps">
<li>Elimina primero las estrategias estrictamente dominadas.</li>
<li>Escribe el pago esperado del jugador 1 con cada estrategia pura contra la mezcla del 2: \(\pi_1[A,(\sigma_R,1-\sigma_R)]\) y \(\pi_1[B,(\sigma_R,1-\sigma_R)]\).</li>
<li>Resuelve \(\pi_1(A,\sigma_2)\ge\pi_1(B,\sigma_2)\) para encontrar el umbral de \(\sigma_R\).</li>
<li>Escribe la correspondencia de mejor respuesta \(\rho_1(\sigma_R)\): 1, [0, 1] o 0 según el lado del umbral.</li>
<li>Haz lo mismo para el jugador 2 y obtén \(\rho_2(\sigma_A)\).</li>
<li>Dibuja las dos correspondencias en el cuadrado [0, 1]²: los cruces son los equilibrios, incluidos los de puras.</li></ol></section>
<section><h3>Ejemplo resuelto: batalla de los sexos (Ej. 3c)</h3>
<div class="eq al" style="text-align:left">π<sub>G</sub>[B, (σ<sub>BB</sub>, 1 − σ<sub>BB</sub>)] = 3σ<sub>BB</sub> + 1(1 − σ<sub>BB</sub>) = 1 + 2σ<sub>BB</sub><br>π<sub>G</sub>[S, (σ<sub>BB</sub>, 1 − σ<sub>BB</sub>)] = 0σ<sub>BB</sub> + 2(1 − σ<sub>BB</sub>) = 2 − 2σ<sub>BB</sub><br>1 + 2σ<sub>BB</sub> ≥ 2 − 2σ<sub>BB</sub> ⇔ σ<sub>BB</sub> ≥ 1/4<br>π<sub>B</sub>[(σ<sub>GB</sub>, 1 − σ<sub>GB</sub>), B] = 2σ<sub>GB</sub> &nbsp;&nbsp; π<sub>B</sub>[(σ<sub>GB</sub>, 1 − σ<sub>GB</sub>), S] = 3 − 2σ<sub>GB</sub> &nbsp;⇒&nbsp; σ<sub>GB</sub> ≥ 3/4</div>
<div class="mj">\[\sigma^*=\big[(\sigma_{GB}^*,1-\sigma_{GB}^*);(\sigma_{BB}^*,1-\sigma_{BB}^*)\big]=\big[(3/4,\,1/4);\;(1/4,\,3/4)\big]\]</div>
<p>Además están los dos equilibrios en puras, \((B,B)\) y \((S,S)\): el juego tiene tres equilibrios en total.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> calcular \(\sigma_A\) con los pagos del jugador 1. La probabilidad con la que mezcla el 1 sale de la indiferencia del <b>jugador 2</b>, y viceversa.</p>`,
deep:[
{k:"Fórmula",n:true,t:"Atajo para 2×2 y corrección a la app",html:String.raw`<p>Con pagos \(u_{ij}\) del jugador 1 y \(v_{ij}\) del jugador 2 (fila \(i\), columna \(j\)):</p><div class="mj">\[p^*=\frac{v_{22}-v_{21}}{v_{11}-v_{21}-v_{12}+v_{22}}\qquad\qquad q^*=\frac{u_{22}-u_{12}}{u_{11}-u_{12}-u_{21}+u_{22}}\]</div><p>\(p^*\) es la probabilidad de la fila 1 y \(q^*\) la de la columna 1.</p><p class="warn"><b>Ojo con Economiapp:</b> la app tiene \(v_{22}-v_{12}\) en el numerador de \(p\), y eso es un error. Con su propio ejemplo da \(p = 0{,}5\) cuando lo correcto es \(p = 3/4\). La fórmula de \(q\) está bien.</p><p>El atajo solo vale si las dos probabilidades quedan entre 0 y 1. Si no, hay dominancia y el equilibrio está en puras.</p>`},
{k:"Ej. 4c",t:"Tabla 2: mixtas después de eliminar",html:String.raw`<p>Tras eliminar C y T queda el 2×2 {A, B} × {R, S}.</p><div class="eq al" style="text-align:left">π<sub>1</sub>[A, (σ<sub>R</sub>, 1 − σ<sub>R</sub>)] = 3σ<sub>R</sub> + 2(1 − σ<sub>R</sub>) = 2 + σ<sub>R</sub><br>π<sub>1</sub>[B, (σ<sub>R</sub>, 1 − σ<sub>R</sub>)] = 4σ<sub>R</sub> + 0(1 − σ<sub>R</sub>) = 4σ<sub>R</sub> &nbsp;⇒&nbsp; A ≥ B ⇔ σ<sub>R</sub> ≤ 2/3<br>π<sub>2</sub>[(σ<sub>A</sub>, 1 − σ<sub>A</sub>), R] = 0σ<sub>A</sub> + 4(1 − σ<sub>A</sub>) = 4 − 4σ<sub>A</sub><br>π<sub>2</sub>[(σ<sub>A</sub>, 1 − σ<sub>A</sub>), S] = 2σ<sub>A</sub> + 3(1 − σ<sub>A</sub>) = 3 − σ<sub>A</sub> &nbsp;⇒&nbsp; R ≥ S ⇔ σ<sub>A</sub> ≤ 1/3</div><div class="mj">\[\sigma^*\in\big\{[(1,0);(0,1)],\;[(0,1);(1,0)],\;[(1/3,\,2/3);(2/3,\,1/3)]\big\}\]</div><p>Los dos primeros son \((A,S)\) y \((B,R)\). En el tercero, C y T se juegan con probabilidad 0.</p>`},
{k:"Ej. 7",t:"Cuando hay infinitos equilibrios",html:String.raw`<p>En la Tabla 5, si el jugador 1 juega A el jugador 2 queda indiferente (9 y 9). Entonces cualquier mezcla del 2 que mantenga a A como mejor respuesta del 1 es equilibrio: \(\pi_1(A)=1\ge\pi_1(B)=2(1-\sigma_I)\) exige \(\sigma_I\ge 1/2\).</p><div class="mj">\[\sigma^*\in\big\{[(0,1);(0,1)]\big\}\cup\big\{[(1,0);(\sigma_I,1-\sigma_I)]:\ \sigma_I\in[1/2,\,1]\big\}\]</div>`}],
py:`def mixtas_2x2(u11, u12, u21, u22, v11, v12, v21, v22):
    """Versión corregida del módulo de Economiapp.
    p = prob. de la fila 1 (sale de la indiferencia del jugador 2)
    q = prob. de la columna 1 (sale de la indiferencia del jugador 1)"""
    den_p = v11 - v21 - v12 + v22
    den_q = u11 - u12 - u21 + u22
    if den_p == 0 or den_q == 0:
        return None                      # indiferencia total o dominancia
    p = (v22 - v21) / den_p              # la app tenía v22 - v12
    q = (u22 - u12) / den_q
    if 0 <= p <= 1 and 0 <= q <= 1:
        return p, q
    return None                          # hay dominancia: equilibrio en puras`,
qs:[{q:"En la batalla de los sexos, ¿por qué G juega B con 3/4 si a G le gusta más B?",a:"Porque 3/4 no sale de los gustos de G sino de los de B: es la mezcla que deja a B indiferente entre ir a B y a S. Si G mezclara de otra forma, B tendría una mejor respuesta pura y G dejaría de estar indiferente."},
 {q:"¿Cuántos equilibrios tiene un 2×2 con dos equilibrios en puras y sin dominancia?",a:"Tres: los dos de puras y uno en mixtas. En el gráfico, las dos correspondencias en forma de Z se cruzan en tres puntos."}]},

{id:"maximin", t:"Maximin y juegos de suma cero", nuevo:true, sim:"mm", html:String.raw`
<section><h3>La idea</h3><p class="lead">La estrategia maximin es la más prudente: maximiza el peor pago posible. En un juego de suma cero, lo que gana uno lo pierde el otro, y la prudencia de los dos lleva al mismo resultado: el valor del juego.</p></section>
<section><h3>Definiciones</h3>
<div class="mj">\[\underline{v}_1=\max_{s_1}\,\min_{s_2}\,\pi_1(s_1,s_2)\qquad\qquad \overline{v}_1=\min_{s_2}\,\max_{s_1}\,\pi_1(s_1,s_2)\]</div>
<ul><li><b>Maximin</b> \(\underline v_1\): para cada fila toma el peor pago y elige la fila con el mejor de esos peores.</li><li><b>Minimax</b> \(\overline v_1\): para cada columna toma el mayor pago del 1 (lo más que el 2 puede tener que ceder) y el 2 elige la columna con el menor.</li><li>Siempre \(\underline v_1\le\overline v_1\). Si son iguales hay <b>punto de silla</b> y ese número es el <b>valor del juego</b>.</li></ul></section>
<section><h3>Teorema minimax (von Neumann)</h3><p>En estrategias mixtas los dos valores siempre coinciden:</p>
<div class="mj">\[v=\max_{\sigma_1}\min_{\sigma_2}\pi_1(\sigma_1,\sigma_2)=\min_{\sigma_2}\max_{\sigma_1}\pi_1(\sigma_1,\sigma_2)\]</div>
<p>En un 2×2 sin punto de silla, con matriz \(\begin{pmatrix}a&b\\c&d\end{pmatrix}\) para el jugador 1:</p>
<div class="mj">\[p^*=\frac{d-c}{a-b-c+d}\qquad q^*=\frac{d-b}{a-b-c+d}\qquad v=\frac{ad-bc}{a-b-c+d}\]</div></section>
${LAB}
<p class="link"><b>Ej. 18, el penal:</b> el maximin del portero es −1 y el minimax es 1, así que no hay punto de silla. En mixtas, los dos se tiran y patean a cada lado con probabilidad 1/2 y el valor es 0.</p>`,
deep:[
{k:"Ej. 16",t:"Tabla 6: reparto de 10 dólares",html:String.raw`<p>Los pagos suman siempre 10, así que es un juego de <b>suma constante</b> y se trata como uno de suma cero.</p><div class="eq al" style="text-align:left">Jugador 1: mín. por fila A → 1, B → 4, C → 3 ⇒ maximin = 4 con B<br>Jugador 2: mín. por columna A → 1, B → 2, C → 6 ⇒ maximin = 6 con C</div><p>El equilibrio en puras es \((B,C)\) con pagos (4, 6): coincide con las estrategias maximin. Eso pasa siempre en juegos de suma constante con punto de silla.</p>`},
{k:"Ej. 17",t:"Las dos matrices",html:String.raw`<p><b>Primera,</b> \(\begin{pmatrix}1&0\\0&1\end{pmatrix}\): maximin 0, minimax 1, sin punto de silla. Con la fórmula: \(p^*=q^*=1/2\) y \(v=1/2\).</p><p><b>Segunda,</b> \(\begin{pmatrix}2&3\\1&0\\2&3\end{pmatrix}\): la fila 2 está dominada. Peor pago por fila: 2, 0, 2, así que el maximin es 2. Mayor pago por columna: 2 y 3, así que el minimax es 2. Hay punto de silla en la columna 1 (filas 1 o 3) y \(v=2\).</p>`}],
qs:[{q:"Si el maximin del jugador 1 es 3 y el minimax es 3, ¿hace falta mezclar?",a:"No. Hay punto de silla: las estrategias puras que lo alcanzan son óptimas y el valor del juego es 3."}]},

{id:"continuas", t:"Juegos con estrategias continuas: Cournot y Bertrand", nuevo:true, sim:"cour", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando la estrategia es una cantidad o un precio, \(S_i\) es un intervalo y no se puede hacer una tabla. Se hace lo mismo que con la tabla, pero con cálculo: la mejor respuesta sale de la condición de primer orden, y el equilibrio de Nash es donde se cruzan las mejores respuestas.</p></section>
<section><h3>Existencia</h3><p><b>Teorema (Debreu, Fan y Glicksberg, 1952).</b> Sea \(G(\Gamma)\) un juego en forma estratégica tal que, para todo \(i\in N\), \(S_i\subseteq\mathbb{R}^m\) es compacto y convexo, y \(\pi_i:S_1\times\dots\times S_n\to\mathbb{R}\) es continua en \(s\) y cuasicóncava en \(s_i\). Entonces \(G(\Gamma)\) tiene un equilibrio de Nash en estrategias puras.</p></section>
<section><h3>Receta para el parcial</h3><ol class="steps"><li>Escribe la forma estratégica: \(N\), \(S_i\) y \(\pi_i(s_i,s_j)\).</li><li>Condición de primer orden \(\partial\pi_i/\partial s_i=0\) y despeja \(s_i=r_i(s_j)\).</li><li>Resuelve el sistema \(s_i^*=r_i(s_j^*)\), \(s_j^*=r_j(s_i^*)\). Si el juego es simétrico, usa \(s_i^*=s_j^*\).</li><li>Reemplaza para obtener precio, cantidades y pagos de equilibrio.</li></ol></section>
<section><h3>Cournot (1838)</h3><p>Dos firmas, \(P(Q)=a-Q\), \(Q=q_i+q_j\), costos \(c\,q_i\). Forma estratégica: \(N=\{i,j\}\), \(S_i=S_j=\mathbb{R}_+\) y</p>
<div class="mj">\[\pi_i(q_i,q_j)=P(Q)\,q_i-c\,q_i=(a-q_i-q_j)\,q_i-c\,q_i\]</div>
<p>\((q_i^*,q_j^*)\) es EN si \(q_i^*\) resuelve \(\max_{q_i\in[0,\infty)}\pi_i(q_i,q_j^*)\) y lo mismo para \(j\). Con \(q&lt;a-c\), las condiciones de primer orden son</p>
<div class="mj">\[a-2q_i^*-q_j^*-c=0,\qquad a-2q_j^*-q_i^*-c=0\]</div>
<div class="mj">\[q_i^*=\tfrac12\left(a-q_j^*-c\right),\quad q_j^*=\tfrac12\left(a-q_i^*-c\right)\;\Rightarrow\;q_i^*=q_j^*=\frac{a-c}{3}\]</div></section>
<section><h3>Bertrand (1883)</h3><p>Ahora la variable es el precio y el bien es homogéneo: toda la demanda se la lleva quien cobra menos. Con \(n\ge2\) firmas, costo marginal \(c\), demanda \(F\) con \(F(c)&gt;0\) y \(\theta(p)=\min\{p_1,\dots,p_n\}\):</p>
<div class="mj">\[\pi_i(p)=\begin{cases}0 & \text{si } p_i&gt;\theta(p)\\[4pt] (p_i-c)\,\dfrac{F(\theta(p))}{\#\{j\in N:\ p_j=\theta(p)\}} & \text{si } p_i=\theta(p)\end{cases}\]</div>
<p><b>Proposición.</b> Todo vector de precios de equilibrio \(p^*\) cumple \(\theta(p^*)=c\) y \(\#\{j: p_j^*=\theta(p^*)\}\ge2\). Por qué: si el precio mínimo fuera mayor que \(c\), cualquier firma bajaría un centavo y se quedaría con todo el mercado; si una sola firma cobrara \(c\), le convendría subir hasta justo debajo del segundo precio. Así, con apenas dos firmas el beneficio es cero: la <b>paradoja de Bertrand</b>.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> derivar respecto a \(Q\) en lugar de \(q_i\). Cada firma solo controla su cantidad: al derivar \((a-q_i-q_j)q_i\), el término \(q_j\) es una constante y la derivada es \(a-2q_i-q_j\).</p>`,
deep:[
{k:"Taller 2 · Ej. 3",t:"Cournot con N firmas",html:String.raw`<p>Con \(P(Q)=a-bQ\) y costo \(cq_i\): \(\pi_i=(a-bQ)q_i-cq_i\). La condición de primer orden es \(a-bQ_{-i}-2bq_i-c=0\). En el equilibrio simétrico \(Q_{-i}=(N-1)q^*\):</p><div class="mj">\[q^*=\frac{a-c}{(N+1)b},\qquad Q^*=\frac{N(a-c)}{(N+1)b},\qquad P^*=\frac{a+Nc}{N+1},\qquad \pi^*=\frac{(a-c)^2}{(N+1)^2b}\]</div><p>Si \(N\to\infty\): \(P^*\to c\), \(Q^*\to(a-c)/b\) y \(\pi^*\to0\). Es el resultado de competencia perfecta.</p>`},
{k:"Taller 2 · Ej. 4",t:"Bertrand de Gibbons (sección 1.2.B)",html:String.raw`<p>Productos diferenciados: \(q_i(p_i,p_j)=a-p_i+b\,p_j\), con \(0&lt;b&lt;2\) y costo marginal \(c&lt;a\). Forma estratégica: \(S_i=[0,\infty)\) y \(\pi_i=(p_i-c)(a-p_i+bp_j)\). La condición de primer orden da \(p_i^*=\frac12(a+bp_j^*+c)\) y, resolviendo,</p><div class="mj">\[p_1^*=p_2^*=\frac{a+c}{2-b}\]</div><p>Lo desarrolla la rama «Bertrand: paradoja y productos diferenciados».</p>`}],
qs:[{q:"Con P = 100 − Q y c = 10, ¿cuánto produce cada firma de Cournot?",a:String.raw`q* = (a − c)/3 = 90/3 = 30. Q* = 60, P* = 40 y cada una gana (40 − 10)·30 = 900.`},
 {q:"¿Por qué la paradoja de Bertrand necesita al menos dos firmas cobrando c?",a:"Si solo una cobrara c, ganaría cero y podría subir su precio hasta casi el segundo más bajo y ganar algo positivo: no estaría en su mejor respuesta. Con dos o más en c, ninguna gana subiendo (pierde todos los clientes) ni bajando (vendería con pérdida)."}]},

{id:"eps", t:"Equilibrio perfecto en subjuegos", nuevo:true, sim:"eps", html:String.raw`
<section><h3>La idea</h3><p class="lead">En juegos dinámicos, algunos equilibrios de Nash se sostienen con <b>amenazas no creíbles</b>: un jugador promete hacer algo que no le convendría hacer si de verdad le llegara el turno. El equilibrio perfecto en subjuegos (EPS, o SPE en inglés) de Selten (1965, 1975) descarta esos equilibrios.</p></section>
<section><h3>Ejemplo 1</h3><p>El jugador 1 elige A o B. Con B el juego termina en (0, 2). Con A, el jugador 2 elige a, que da (−1, −1), o b, que da (1, 1). Hay dos equilibrios de Nash: \((B,a)\) y \((A,b)\).</p>
<p>En \((B,a)\), el jugador 2 «amenaza» con a. Pero si el 1 juega A, al 2 le conviene b (1 &gt; −1): la amenaza no es creíble y \((B,a)\) es una predicción frágil. En cambio \((A,b)\) sale de la <b>inducción hacia atrás</b>: cuando una decisión se toma en un punto del juego, la evaluación de las opciones internaliza las decisiones óptimas futuras.</p></section>
<section><h3>Subjuegos</h3><p>Un subjuego de un juego en forma extensiva es una parte del árbol que:</p>
<ol class="steps"><li>(s.1) empieza en un nodo de decisión \(x\) que forma por sí solo un conjunto de información, e incluye todos los sucesores de \(x\);</li><li>(s.2) no corta ningún conjunto de información: si un nodo está en el subjuego, todos los nodos de su conjunto de información también.</li></ol>
<p>El juego completo es un subjuego de sí mismo. Los demás son <b>subjuegos propios</b>. En el árbol, un subjuego no puede «partir» una línea punteada.</p>
<p><b>Definición (Selten).</b> Un perfil de estrategias es un EPS si induce un equilibrio de Nash en <b>cada</b> subjuego. Todo EPS es EN, pero no al revés.</p>
<p><b>Teorema (Zermelo, Kuhn).</b> Todo juego finito con información perfecta tiene un EPS en estrategias puras, y se encuentra por inducción hacia atrás.</p></section>
<section><h3>Cómo se resuelve a mano</h3><ol class="steps"><li>Escribe las estrategias como <b>planes completos</b>: una acción en cada conjunto de información del jugador, aunque no se llegue a él. En el Ej. 2, \(S_1=\{(A,C),(A,F),(D,C),(D,F)\}\).</li><li>Para los EN, arma la forma estratégica y busca \(r_1\cap r_2\).</li><li>Para los EPS, empieza por los subjuegos del final. Si el subjuego es de un solo jugador, elige el mayor pago; si tiene movidas simultáneas (línea punteada adentro), resuélvelo como una tabla.</li><li>Reemplaza cada subjuego resuelto por sus pagos y sube. Si un subjuego tiene varios equilibrios, abre una rama por cada uno.</li></ol>
<p><b>Ejemplo 2:</b> EN \(=\{((D,C),E),\,((D,F),E)\}\), pero en el último nodo el 1 prefiere F (3 &gt; 0), así que solo \(((D,F),E)\) es creíble. <b>Ejemplo 3</b> (van Damme, 1987): EN \(=\{((A,D),b),((B,C),a),((B,D),a)\}\) y el único EPS es \(((B,C),a)\).</p></section>
${LAB}
<p class="warn"><b>Error común:</b> dar como respuesta solo la trayectoria («el 1 juega B y se acaba»). El EPS es un perfil de estrategias: dice qué haría cada jugador en todos sus nodos, también en los que no se alcanzan.</p>`,
deep:[
{k:"Taller 3 · Ej. 1",t:"Entrada al mercado",html:String.raw`<p>La firma 1 elige entrar (E) o no (NE); si entra, la 2 pelea (P) o concede (C). Pagos en millones de US$: NE → (0, 2); E, C → (1, 1); E, P → (−1, −1).</p>${M2("1","2",["E","NE"],["P","C"],[[["−1, −1"],["1, 1",1]],[["0, 2",1],["0, 2"]]])}<p>EN \(=\{(E,C),(NE,P)\}\). El único EPS es \((E,C)\): si la 1 entra, pelear le da −1 a la 2 y conceder 1, así que la amenaza de pelear no es creíble.</p>`},
{k:"Taller 3 · Ej. 2",t:"Norte o Sur en secuencia",html:String.raw`<p>La empresa 2 observa a la 1, así que su estrategia dice qué hace tras Norte y qué hace tras Sur: \(S_2=\{(N,N),(N,S),(S,N),(S,S)\}\).</p><p>EN \(=\{(N,(N,N)),\,(N,(N,S)),\,(S,(S,S))\}\). Inducción hacia atrás: tras N, la 2 elige N (3 &gt; 2); tras S, elige S (4 &gt; 1). La 1 compara 4 con 3 y elige N. <b>EPS \(=(N,(N,S))\)</b>, con resultado (4, 3). Mover primero le da ventaja a la empresa 1.</p>`},
{k:"Taller 3 · Ej. 3",t:"Figura 1: un EPS que solo existe en mixtas",html:String.raw`<p>EN en puras \(=\{((A,C),Y)\}\). No es razonable: se sostiene porque el 1 «promete» C en su último nodo, pero ahí D le da 2 &gt; 1.</p><p>El subjuego propio empieza en ese último nodo: el 1 elige D. Reemplazándolo por (2, 10), lo que queda es un juego simultáneo entre A/B y X/Y sin equilibrio en puras. En mixtas, el 1 juega A con probabilidad 1/2 y el 2 juega X con probabilidad 1/4:</p><div class="mj">\[10p+3(1-p)=5p+8(1-p)\Rightarrow p=\tfrac12\qquad 2x+5(1-x)=8x+3(1-x)\Rightarrow x=\tfrac14\]</div><p>No hay EPS en puras. El EPS es \(\big((\tfrac12A+\tfrac12B,\ D),\ \tfrac14X+\tfrac34Y\big)\), con pagos esperados \((17/4,\,13/2)\).</p>`},
{k:"Taller 3 · Ej. 6",t:"Figuras 4 y 5",html:String.raw`<p><b>Figura 4.</b> El conjunto de información del jugador 3 une el nodo tras B con el nodo tras B′, así que el nodo del jugador 2 no inicia un subjuego. El único subjuego es el juego completo y EPS = EN \(=\{(C,C',D),\,(B,C',I)\}\).</p><p><b>Figura 5.</b> El nodo del jugador 2 sí inicia un subjuego (el conjunto del jugador 1 queda completo adentro). Ese subjuego es simultáneo, con equilibrios \((a,C)\), pagos (3, −1), y \((b,D)\), pagos (0, 0). Con \((a,C)\) el 1 prefiere A (3 &gt; 1); con \((b,D)\), prefiere B (1 &gt; 0).</p><div class="mj">\[EPS=\{((A,C),a),\;((B,D),b)\}\]</div><p>El EN \(((B,C),b)\) no es perfecto: en el subjuego, C no es mejor respuesta a b.</p>`},
{k:"Taller 3 · Ej. 9",t:"Figura 6",html:String.raw`<p>\(S_1=\{Z,X,Y\}\times\{B,A\}\) y \(S_2=\{R,L\}\times\{R,L\}\) (primero el conjunto con dos nodos y luego el nodo tras Y).</p><p>EN \(=\{((X,B),(L,R)),\,((X,B),(L,L)),\,((Y,B),(R,L)),\,((Y,A),(R,L))\}\).</p><p>Subjuegos propios: el último nodo del 1 (elige B, 3 &gt; 1) y el nodo del 2 tras Y (elige L, 3 &gt; 2). Lo que queda es simultáneo, con equilibrios \((X,L)\) y \((Y,R)\):</p><div class="mj">\[EPS=\{((X,B),(L,L)),\;((Y,B),(R,L))\}\]</div>`}],
qs:[{q:"¿Puede un EN que no es EPS darle a todos los jugadores el mismo resultado que el EPS?",a:"Sí. Pueden diferir solo en lo que pasa fuera de la trayectoria. Por ejemplo, en Norte/Sur, (N,(N,N)) y (N,(N,S)) llevan ambos a (4, 3); solo el segundo es EPS, porque el primero dice que tras S la empresa 2 elegiría N, y no le conviene."},
 {q:"¿Por qué en un juego sin subjuegos propios todo EN es EPS?",a:"Porque el único subjuego es el juego completo, y un EN ya es equilibrio en él. Por eso con información imperfecta hace falta un refinamiento más fuerte: el equilibrio bayesiano perfecto."}]},

{id:"ebp", t:"Equilibrio bayesiano perfecto", nuevo:true, sim:"ebp", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con conjuntos de información de varios nodos puede no haber subjuegos propios, y el EPS no descarta nada. El equilibrio bayesiano perfecto (EBP, o PBE) exige que, en cada conjunto de información, el jugador tenga una <b>creencia</b> sobre en qué nodo está y que actúe de forma óptima dada esa creencia.</p></section>
<section><h3>Ejemplo 1</h3><p>El 1 elige A, que termina en (0, 2), o B o C. El 2 no sabe si el 1 jugó B o C y elige a o b. Tras B: a da (2, 1) y b da (−1, −1). Tras C: a da (1, 1) y b da (−2, 0). Hay dos EN en puras, \((A,b)\) y \((B,a)\), y como no hay subjuegos propios los dos son EPS. Pero \((A,b)\) no es razonable: b nunca le conviene al 2, esté donde esté.</p>
<p>Con creencia \(\mu\) en el nodo tras B y \(1-\mu\) en el nodo tras C:</p>
<div class="mj">\[\pi_2(a)=\mu\cdot1+(1-\mu)\cdot1=1,\qquad \pi_2(b)=\mu\cdot(-1)+(1-\mu)\cdot0=-\mu\]</div>
<p>Como \(1&gt;-\mu\) para todo \(\mu\), el 2 juega a. El único EBP es \((B,a)\) con \(\mu=1\).</p></section>
<section><h3>Los requisitos</h3><ol class="steps"><li><b>Requisito 1.</b> En cada conjunto de información, el jugador que mueve tiene una creencia: una distribución de probabilidad sobre los nodos del conjunto.</li><li><b>Requisito 2.</b> Dadas las creencias, las estrategias son secuencialmente racionales: en cada conjunto de información, la acción maximiza el pago esperado dada la creencia y las estrategias posteriores de los demás.</li><li><b>Requisito 3.</b> En los conjuntos de información de la trayectoria de equilibrio, las creencias se forman con la regla de Bayes y las estrategias de equilibrio.</li><li><b>Requisito 4.</b> Fuera de la trayectoria de equilibrio, las creencias también se forman con la regla de Bayes y las estrategias de equilibrio, donde sea posible.</li></ol>
<p>Un EBP es un perfil de estrategias más un sistema de creencias que cumple los requisitos 1 a 4. Si el 1 mezcla, por Bayes:</p>
<div class="mj">\[\mu=\frac{\sigma_1(B)}{\sigma_1(B)+\sigma_1(C)}\]</div></section>
<section><h3>Ejemplo 2 y observaciones</h3><p>El 1 elige D, que termina en (1, 3), o C o I; el 2 no distingue entre C e I. EPS: \((D,a)\) y \((I,b)\). EBP: \((I,b)\) con \(\mu=0\). \((D,a)\) no hace parte de ningún EBP: ninguna creencia hace que el 2 juegue a, porque b le da más en los dos nodos.</p>
<ul><li>En juegos de información perfecta, EBP y EPS coinciden.</li><li>En general no son idénticos: en el Ej. 1, \((A,b)\) y \((B,a)\) son EPS, pero solo uno es EBP.</li><li>Uno esperaría que todo EBP fuera EPS, pero los requisitos 1 a 3 solos no lo garantizan. Ejemplo con tres jugadores: EN \(=\{(A,X,C),(B,Y,C),(B,X,D)\}\) y el único EPS es \((A,X,C)\). El perfil \((B,X,D)\) con creencia 1 en el nodo tras Y cumple los requisitos 1 a 3, pero no el 4: si el 2 juega X, en el subjuego que empieza en su nodo el 3 debería creer que está tras X. Esa versión sin el requisito 4 se llama EBP <b>débil</b>.</li></ul></section>
<section><h3>Requisito 5 (refinamiento)</h3><p>Si es posible, las creencias fuera de la trayectoria deben asignar probabilidad cero a los nodos a los que solo se llega si el otro jugador usa una estrategia estrictamente dominada. En el ejemplo de la diapositiva, con μ en el nodo tras I, los EBP son \(\{(D,a),\ \mu\le\tfrac12\}\) y \(\{(I,b),\ \mu=1\}\). Como C está estrictamente dominada por D para el jugador 1, el requisito 5 obliga a \(\mu=1\), y con esa creencia a deja de ser óptima: solo queda \((I,b)\).</p></section>
${LAB}
<p class="warn"><b>Error común:</b> usar Bayes fuera de la trayectoria cuando la probabilidad de llegar al conjunto es cero. Ahí \(\mu\) es libre (0/0): se busca para qué valores de \(\mu\) la acción es óptima, y la respuesta es un intervalo, como \(\mu\le\tfrac12\).</p>`,
deep:[
{k:"Taller 3 · Ej. 4",t:"Figura 2",html:String.raw`<p>El 1 elige C, que termina en (3, 2), o B o A; el 2 no distingue entre B y A. Sea \(\mu\) la creencia del 2 en el nodo tras B.</p><p>EN = EPS \(=\{(C,b),\,(C,a),\,(A,a)\}\) (no hay subjuegos propios).</p><p>Para el 2: \(\pi_2(a)=2\mu+1\cdot(1-\mu)=1+\mu\) y \(\pi_2(b)=1\cdot\mu+0=\mu\). Como \(1+\mu&gt;\mu\), a es siempre óptima y \((C,b)\) no es EBP.</p><div class="mj">\[EBP=\{(C,a)\text{ con cualquier }\mu\in[0,1],\;\;(A,a)\text{ con }\mu=0\}\]</div><p>En \((A,a)\) el conjunto está en la trayectoria y Bayes da \(\mu=0\). En \((C,a)\) está fuera y cualquier creencia sirve.</p>`},
{k:"Taller 3 · Ej. 5",t:"Figura 3",html:String.raw`<p>El 1 elige A, que termina en (1, 3), o B o C; \(\mu\) es la creencia del 2 en el nodo tras B. Tras B: a (0, 1), b (0, 2). Tras C: a (0, 0), b (2, 1).</p><p>EN = EPS \(=\{(A,a),\,(C,b)\}\). Para el 2: \(\pi_2(a)=\mu\) y \(\pi_2(b)=2\mu+(1-\mu)=1+\mu\), así que b es siempre mejor. \((A,a)\) no es EBP.</p><div class="mj">\[EBP=\{(C,b),\ \mu=0\}\]</div>`}],
qs:[{q:"Si el 1 juega B con probabilidad 1/3, C con 1/6 y A con 1/2, ¿qué creencia debe tener el 2 en el nodo tras B?",a:String.raw`Por Bayes: μ = σ₁(B)/(σ₁(B) + σ₁(C)) = (1/3)/(1/3 + 1/6) = 2/3.`},
 {q:"¿Por qué en un EBP puede haber un intervalo de creencias y no un número?",a:"Porque fuera de la trayectoria la regla de Bayes no se puede aplicar (0/0). El equilibrio se sostiene con cualquier creencia que haga óptima la acción, y eso suele ser un intervalo."}]}

];

const BRANCHES=[
{g:"Juegos secuenciales", from:"representacion", items:[
 {id:"secuencial", t:"Inducción hacia atrás", sim:"seq", html:String.raw`
<section><h3>La idea</h3><p class="lead">En un juego secuencial con información perfecta se resuelve desde el final: el último en mover elige lo mejor para él, y los anteriores anticipan esa respuesta. El resultado es el <b>equilibrio perfecto en subjuegos</b> (EPS).</p></section>
<section><h3>Amenazas no creíbles</h3><p>En el juego de entrada (Ej. 1), \((NE,P)\) es equilibrio de Nash: si la firma 2 amenaza con pelear, a la 1 no le conviene entrar. Pero si la 1 entra, pelear le da −1 a la 2 y conceder le da 1. La amenaza no es creíble y la inducción hacia atrás la descarta: el EPS es \((E,C)\).</p>
<p>Todo EPS es equilibrio de Nash, pero no todo equilibrio de Nash es EPS.</p></section>
<section><h3>Procedimiento</h3><ol class="steps"><li>Ve a los nodos de decisión más cercanos a los pagos. En cada uno, el jugador que mueve elige la rama con el mayor pago <b>para él</b>.</li><li>Reemplaza ese nodo por los pagos que resultan de esa elección.</li><li>Repite subiendo hasta la raíz.</li><li>Escribe el EPS como perfil de estrategias completas: lo que cada jugador hace en <b>todos</b> sus nodos, también en los que no se alcanzan.</li></ol>
<p>Si hay un empate, cada opción da un EPS distinto. En el laboratorio puedes probar más etapas, más acciones, tres jugadores o jugadas del azar.</p></section>
${LAB}`,
 qs:[{q:"En la batalla de los sexos secuencial (Ej. 3b), ¿cuál es el EPS?",a:"B responde B si G juega B (2 &gt; 1) y S si G juega S (3 &gt; 0): su estrategia es BS. G anticipa y compara 3 con 2: juega B. El EPS es (B, BS) y el resultado es que ambos van a B."}]},
 {id:"subjuegos", t:"Subjuegos e información imperfecta", nuevo:true, sim:"sub", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando un jugador no ve lo que hizo otro, ya no se puede ir nodo por nodo hacia atrás. Se va <b>subjuego por subjuego</b>: se resuelve con Nash cada pedazo del árbol que se puede jugar por sí solo y se reemplaza por sus pagos.</p></section>
<section><h3>Subjuego</h3><p>Un subjuego empieza en un nodo \(x\) que cumple dos condiciones:</p><ul><li>\(x\) es por sí solo un conjunto de información (quien mueve sabe que está ahí);</li><li>todo conjunto de información que contiene algún nodo que sigue a \(x\) queda completo después de \(x\): la línea punteada nunca «se sale» del subárbol.</li></ul>
<p>El juego completo siempre es un subjuego. Los demás se llaman <b>subjuegos propios</b>.</p>
<div class="mj">\[s^*\text{ es EPS}\iff s^*\text{ induce un equilibrio de Nash en cada subjuego}\]</div></section>
<section><h3>Inducción hacia atrás por subjuegos</h3><ol class="steps"><li>Marca los subjuegos propios.</li><li>Empieza por los más pequeños. Si solo decide un jugador, elige su mejor acción. Si deciden varios sin verse, escribe la tabla de ese pedazo y busca sus equilibrios de Nash, en puras o en mixtas.</li><li>Reemplaza el subjuego por los pagos del equilibrio y sigue subiendo.</li><li>Si un subjuego tiene varios equilibrios, cada uno da un EPS distinto.</li></ol></section>
<section><h3>Figura 2 (Ej. 10)</h3><p>El único subjuego propio empieza en el segundo nodo del jugador 1, después de A y X. Allí elige D, porque \(2&gt;1\). Reemplazando, queda un juego simultáneo:</p>
${M2("1","2",["A","B"],["X","Y"],[[["2, 10"],["5, 5"]],[["8, 3"],["3, 8"]]])}
<p>No tiene equilibrio en puras. En mixtas, el 2 queda indiferente si \(10\sigma_A+3(1-\sigma_A)=5\sigma_A+8(1-\sigma_A)\), o sea \(\sigma_A=1/2\); el 1 queda indiferente si \(2\sigma_X+5(1-\sigma_X)=8\sigma_X+3(1-\sigma_X)\), o sea \(\sigma_X=1/4\).</p>
<div class="mj">\[EPS:\ \sigma_1=\big(\tfrac12 A+\tfrac12 B,\ D\big),\qquad \sigma_2=\tfrac14 X+\tfrac34 Y,\qquad \pi=\big(\tfrac{17}{4},\ \tfrac{13}{2}\big)\]</div>
<p>El equilibrio de Nash en puras \((AC,Y)\) <b>no</b> es perfecto: pide jugar C en un subjuego donde D es mejor. Como el 2 juega Y, ese nodo no se alcanza y por eso C no le cuesta nada al 1 en la tabla.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> tratar como subjuego un nodo que está dentro de un conjunto de información con otros nodos. En la Figura 1 los nodos del jugador 2 después de Z y de X no inician subjuegos: el 2 no sabe en cuál está.</p>`,
 qs:[{q:"En la Figura 4 (Ej. 13), ¿cuántos subjuegos propios hay y cuál es el EPS?",a:"Uno: el que empieza en el nodo del jugador 2 (el conjunto del 3 queda completo dentro de él). Allí X domina a Y para el 2 y, dado X, el 3 elige C. El 1 compara 2 con 1 y juega A. El EPS es (A, X, C); los equilibrios de Nash (B, X, D) y (B, Y, C) no son perfectos."},
  {q:"Si un juego no tiene subjuegos propios, ¿qué relación hay entre EN y EPS?",a:"Son lo mismo: el único subjuego es el juego completo, así que pedir Nash en cada subjuego es pedir Nash en el juego."}]},
 {id:"tres", t:"Juegos con tres jugadores", sim:"tres", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con tres jugadores la forma estratégica son varias tablas: una por cada estrategia del jugador 3. Un perfil \((s_1,s_2,s_3)\) es equilibrio si ninguno de los tres gana desviándose solo.</p>
<div class="mj">\[EN=r_1\cap r_2\cap r_3,\qquad r_1(s_2,s_3),\;r_2(s_1,s_3),\;r_3(s_1,s_2)\]</div></section>
<section><h3>Figura 4 (Ej. 13)</h3><p>El jugador 3 no sabe si el 2 jugó X o Y, y si el 1 juega B el juego termina en (1, 0, 3). Entonces \(S_1=\{A,B\}\), \(S_2=\{X,Y\}\), \(S_3=\{C,D\}\), y</p>
<div class="mj">\[EN=\{(A,X,C),\;(B,X,D),\;(B,Y,C)\}\]</div>
<p>Los dos últimos se sostienen porque, si el 1 juega B, el 2 y el 3 quedan indiferentes y el 1 prefiere B ante la combinación que eligen.</p><p>Solo \((A,X,C)\) es perfecto en subjuegos: en el subjuego que empieza en el nodo del 2, X domina a Y y el 3 responde C. Los otros dos se apoyan en jugadas que el 2 o el 3 no harían si les tocara mover. Puedes verlo en el laboratorio de la lección «Subjuegos e información imperfecta».</p></section>
${LAB}`,
 qs:[{q:"En la Figura 3 (Ej. 12), ¿por qué (C, C′, D) es equilibrio si el jugador 3 nunca mueve?",a:"Porque con C y C′ el juego termina en (1, 1, 1) sin pasar por el 3, que queda indiferente. Y D sostiene el equilibrio: si el 1 se desvía a B o el 2 a B′, D los castiga con 0."}]}]},
{g:"Racionalidad", from:"dominancia", items:[
 {id:"racionalizables", t:"Estrategias racionalizables", sim:"rac", html:String.raw`
<section><h3>La idea</h3><p class="lead">Una estrategia es racionalizable si es mejor respuesta a alguna creencia razonable sobre los rivales. Con dos jugadores coinciden con las que sobreviven a la eliminación iterativa cuando también se permite eliminar por <b>estrategias mixtas</b>.</p></section>
<section><h3>Tabla 4 (Ej. 15)</h3>
<div class="eq al" style="text-align:left">q = 1 · C está dominada por ½A + ½B: (½ &gt; 0, ½ &gt; 0, 3/2 &gt; 1) ⇒ S<sub>1</sub> = {A, B}<br>q = 2 · D está dominada por C: (2 &gt; 1, 1 &gt; 0) ⇒ S<sub>2</sub> = {I, C}<br>q = 3 · A domina a B: (1 &gt; 0, 1 &gt; 0) ⇒ S<sub>1</sub> = {A}<br>q = 4 · C domina a I: (2 &gt; 0) ⇒ S<sub>2</sub> = {C}</div>
<p>Las únicas estrategias racionalizables son A para el jugador 1 y C para el 2. Ninguna estrategia pura domina a C del jugador 1: hace falta la mezcla.</p></section>
${LAB}`,
 qs:[{q:"¿Toda estrategia que forma parte de un equilibrio de Nash es racionalizable?",a:"Sí: si es mejor respuesta a la estrategia de equilibrio del rival, nunca se elimina. Lo contrario no se cumple: puede haber estrategias racionalizables que no estén en ningún equilibrio."}]}]},
{g:"Aplicaciones del equilibrio de Nash", from:"continuas", items:[
 {id:"bertrand", t:"Bertrand: paradoja y productos diferenciados", sim:"bertr", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con bienes homogéneos, competir en precios lleva el precio al costo marginal aunque haya solo dos firmas. Con productos diferenciados, quien cobra un poco más no pierde a todos sus clientes, y el precio queda por encima del costo.</p></section>
<section><h3>Productos diferenciados (Taller 2, Ej. 4 y 12)</h3><p>Forma estratégica: \(N=\{1,2\}\), \(S_i=[0,\infty)\) y, con demanda \(q_i=a-p_i+b\,p_j\) y costo marginal \(c\),</p>
<div class="mj">\[\pi_i(p_i,p_j)=(p_i-c)\,(a-p_i+b\,p_j)\]</div>
<p>Condición de primer orden: \(a-2p_i+b\,p_j+c=0\), así que</p>
<div class="mj">\[R_i(p_j)=\frac{a+c+b\,p_j}{2}\qquad\qquad p_1^*=p_2^*=\frac{a+c}{2-b}\]</div>
<p>Las mejores respuestas tienen pendiente positiva: si el rival sube su precio, a mí también me conviene subirlo. En el Ej. 12, \(b=1\): \(p^*=a+c\), \(q^*=a\) y \(\pi^*=a^2\).</p></section>
<section><h3>Taller 2, Ej. 5</h3><p>\(F_i(p_i,p_j)=-p_i+p_j\) y costo \(c\): \(\pi_i=(p_i-c)(p_j-p_i)\). La condición de primer orden da \(p_i=\frac{p_j+c}{2}\), y en el equilibrio simétrico \(p^*=c\). El beneficio es cero: la paradoja de Bertrand se mantiene. Es el caso \(a=0\), \(b=1\) de la fórmula anterior.</p></section>
${LAB}`,
 qs:[{q:"Con q₁ = 10 − p₁ + p₂, q₂ = 10 − p₂ + p₁ y c = 4, ¿cuál es el equilibrio?",a:"p* = a + c = 14, q* = a = 10 y cada firma gana (14 − 4)·10 = 100."}]},
 {id:"comunes", t:"Recursos comunes y bienes públicos", sim:"comunes", html:String.raw`
<section><h3>La idea</h3><p class="lead">Cuando lo que hago afecta a los demás y no lo tengo en cuenta, el equilibrio de Nash es ineficiente: se sobreexplota lo que es de todos y se aporta muy poco a lo que beneficia a todos.</p></section>
<section><h3>Pescadores (Taller 2, Ej. 1)</h3><p>\(U_i(h_1,\dots,h_n)=\rho(H)\,h_i-c(h_i)\), con \(H=\sum_i h_i\), \(\rho\) cóncava y \(c\) convexa y creciente.</p>
<p><b>a) Planificador:</b> \(\max_{h_1,\dots,h_n}\;\sum_{i=1}^n\left[\rho(H)\,h_i-c(h_i)\right]\). Condición de primer orden: \(\rho(H)+\rho'(H)\,H=c'(h_i)\).</p>
<p><b>b) Juego:</b> \(G(\Gamma)=\{N=\{1,\dots,n\},\;S_i=[0,T],\;U_i\}\). Cada pescador resuelve \(\max_{h_i}U_i(h_i,h_{-i}^*)\): \(\rho(H^*)+\rho'(H^*)\,h_i^*=c'(h_i^*)\).</p>
<p>Como \(\rho'&lt;0\) y \(h_i&lt;H\), el costo marginal social es mayor que el privado: en el EN cada uno trabaja más horas que en el óptimo y el retorno por hora cae para todos.</p></section>
<section><h3>Bienes públicos (Taller 2, Ej. 7 a 9)</h3><p>La condición de eficiencia de <b>Lindahl-Bowen-Samuelson</b> pide que la suma de las tasas marginales de sustitución entre el bien público y el privado sea igual a la tasa marginal de transformación:</p>
<div class="mj">\[\sum_{i=1}^n\frac{\partial u_i/\partial G}{\partial u_i/\partial x_i}=\frac{1}{f'(G)}\]</div>
<p>Con aportes voluntarios, cada agente toma \(g_j\) como dado y maximiza \(u_i\big(f(g_i+g_j),\,w_i-g_i\big)\). Su condición es \(f'(G)\,\frac{\partial u_i/\partial G}{\partial u_i/\partial x_i}=1\): iguala su <b>propia</b> tasa, no la suma. Por eso el EN subprovee el bien público (problema del polizón). El mecanismo de implementación del Ej. 8 corrige esto con precios personalizados \(p_i^*\) que suman 1: así cada agente, al optimizar, cumple la condición de Lindahl.</p></section>
${LAB}`,
 qs:[{q:"¿En qué término difieren la condición del planificador y la de Nash en el problema de los pescadores?",a:"En ρ′(H)·H contra ρ′(H)·hᵢ. El planificador cuenta el efecto de una hora más sobre el retorno de todas las horas; cada pescador solo sobre las suyas."}]},
 {id:"esfuerzo", t:"Esfuerzo en una relación", sim:"esf", html:String.raw`
<section><h3>Taller 2, Ej. 11</h3><p class="lead">\(u_1(e_1,e_2)=e_1(c+e_2-e_1)\) y \(u_2(e_1,e_2)=e_2(c+e_1-e_2)\). El esfuerzo propio sube el bienestar hasta un punto y luego lo baja; el esfuerzo del otro siempre lo sube.</p>
<p><b>a) Mejores respuestas.</b> \(\partial u_1/\partial e_1=c+e_2-2e_1=0\):</p>
<div class="mj">\[r_1(e_2)=\frac{c+e_2}{2},\qquad r_2(e_1)=\frac{c+e_1}{2}\]</div>
<p>Son rectas de pendiente 1/2: si el otro se esfuerza más, a mí también me conviene.</p>
<p><b>b) Equilibrio.</b> Resolviendo \(e_1=\frac{c+e_2}{2}\), \(e_2=\frac{c+e_1}{2}\): \(e_1^*=e_2^*=c\).</p>
<p><b>c) Bienestar.</b> \(u_1^*=c\,(c+c-c)=c^2=u_2^*\). Si ambos pusieran \(c+k\), cada uno tendría \((c+k)c&gt;c^2\): el equilibrio tiene menos esfuerzo del que les convendría a los dos.</p></section>
${LAB}`},
 {id:"finitos", t:"Cournot finito y guerras comerciales", sim:"apl", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si las cantidades posibles son pocas, el juego de Cournot vuelve a ser una tabla y se resuelve con dominancia y mejores respuestas, como en el primer parcial.</p></section>
<section><h3>Taller 2, Ej. 2</h3><p>\(q_i\in\{1,2,3\}\), \(P=\max\{7-(q_i+q_j),0\}\) y \(c=1\), así que \(\pi_i=(6-q_i-q_j)\,q_i\).</p>
${M2("1","2",["1","2","3"],["1","2","3"],[[["4, 4"],["3, 6"],["2, 6",1]],[["6, 3"],["4, 4",1],["2, 3"]],[["6, 2",1],["3, 2"],["0, 0"]]])}
<p>EN \(=\{(1,3),\,(2,2),\,(3,1)\}\). El simétrico, \((2,2)\), coincide con el Cournot continuo: \(q^*=(7-1)/3=2\). En forma extensiva, la firma 2 mueve sin observar a la 1: sus tres nodos están unidos por un conjunto de información.</p></section>
<section><h3>Taller 2, Ej. 6</h3><p>Cada firma elige la mitad del monopolio, \(q_m^h=\frac{a-c}{4}\), o Cournot, \(q_c=\frac{a-c}{3}\), con \(P=a-Q\):</p>
${M2("1","2",["q<sub>m</sub><sup>h</sup>","q<sub>c</sub>"],["q<sub>m</sub><sup>h</sup>","q<sub>c</sub>"],[[["(a−c)²/8, (a−c)²/8"],["5(a−c)²/48, 5(a−c)²/36"]],[["5(a−c)²/36, 5(a−c)²/48"],["(a−c)²/9, (a−c)²/9",1]]])}
<p>Como \(5/36&gt;1/8\) y \(1/9&gt;5/48\), \(q_c\) domina estrictamente a \(q_m^h\) para las dos. El equilibrio \((q_c,q_c)\) da \((a-c)^2/9\), menos que \((a-c)^2/8\) si cooperaran: es un dilema del prisionero.</p></section>
<section><h3>Taller 2, Ej. 13: Harrison y Rutström (1991)</h3><p><b>Contexto:</b> guerras y negociaciones comerciales. <b>Jugadores:</b> Estados Unidos y la Comunidad Europea. <b>Estrategias:</b> mantener (K) la estructura de protección o abolir (A) las barreras a las importaciones del otro. <b>Pagos:</b> impacto anual en bienestar frente al statu quo, medido con la variación equivalente en miles de millones de dólares de 1973 (simulaciones de Brown y Whalley, 1980).</p>
${M2("EE. UU.","CE",["K","A"],["K","A"],[[["0, 0",1],["0,85, −3,85"]],[["−3,31, 1,06"],["1,46, 0,62"]]])}
<p>K es estrategia dominante para la CE (0 &gt; −3,85 y 1,06 &gt; 0,62). Estados Unidos responde K ante K. EN \(=(K,K)\), aunque \((A,A)\) le da más a los dos. Los autores proponen medir el costo de la protección frente al equilibrio de Nash, que también mide el poder de negociación de cada país. En forma extensiva: Estados Unidos mueve primero y los dos nodos de la CE quedan unidos por una línea punteada, porque las decisiones son simultáneas.</p></section>
${LAB}`},
 {id:"arbitraje", t:"Arbitraje de oferta final", sim:"arb", html:String.raw`
<section><h3>La idea</h3><p class="lead">Modelo de Farber (1980): la empresa \(f\) y los trabajadores \(g\) hacen ofertas salariales simultáneas, \(w_f\) y \(w_g\). El árbitro tiene un acuerdo ideal \(x\), que las partes no observan pero que sigue una distribución \(F(x)\), y elige la oferta más cercana.</p></section>
<section><h3>Planteamiento</h3><p>Con \(w_f&lt;w_g\), el árbitro elige \(w_f\) si \(x&lt;\frac{w_f+w_g}{2}\) y \(w_g\) si \(x&gt;\frac{w_f+w_g}{2}\). Entonces</p>
<div class="mj">\[P(w_f\text{ elegido})=F\!\left(\tfrac{w_f+w_g}{2}\right),\qquad P(w_g\text{ elegido})=1-F\!\left(\tfrac{w_f+w_g}{2}\right)\]</div>
<p>Forma estratégica: \(N=\{f,g\}\), \(S_f=S_g=[0,\infty)\) y el pago es el salario esperado, que la empresa minimiza y los trabajadores maximizan:</p>
<div class="mj">\[\pi(w_f,w_g)=w_f\,F\!\left(\tfrac{w_f+w_g}{2}\right)+w_g\left[1-F\!\left(\tfrac{w_f+w_g}{2}\right)\right]\]</div></section>
<section><h3>Condiciones de primer orden</h3>
<div class="mj">\[(w_g^*-w_f^*)\,\tfrac12 f\!\left(\tfrac{w_f^*+w_g^*}{2}\right)=F\!\left(\tfrac{w_f^*+w_g^*}{2}\right)\quad(1)\]</div>
<div class="mj">\[(w_g^*-w_f^*)\,\tfrac12 f\!\left(\tfrac{w_f^*+w_g^*}{2}\right)=1-F\!\left(\tfrac{w_f^*+w_g^*}{2}\right)\quad(2)\]</div>
<p>Los lados izquierdos son iguales, así que \(F\big(\frac{w_f^*+w_g^*}{2}\big)=\frac12\) (3): el promedio de las ofertas es la mediana del acuerdo ideal. Reemplazando (3) en (1):</p>
<div class="mj">\[w_g^*-w_f^*=\frac{1}{f\!\left(\frac{w_f^*+w_g^*}{2}\right)}\]</div></section>
<section><h3>Caso normal (Taller 2, Ej. 10)</h3><p>Si \(x\sim N(m,\sigma^2)\), la mediana es \(m\) y \(f(m)=1/\sqrt{2\pi\sigma^2}\). Entonces \(\frac{w_f^*+w_g^*}{2}=m\), \(w_g^*-w_f^*=\sqrt{2\pi\sigma^2}\) y</p>
<div class="mj">\[w_g^*=m+\sqrt{\frac{\pi\sigma^2}{2}}\qquad\qquad w_f^*=m-\sqrt{\frac{\pi\sigma^2}{2}}\]</div>
<p>Las ofertas se centran en lo que se espera del árbitro y se separan más cuanto mayor es la incertidumbre \(\sigma^2\): ser agresivo cuesta menos probabilidad de ganar cuando el árbitro es impredecible.</p></section>
${LAB}`,
 qs:[{q:"Si m = 100 y σ² = 50, ¿cuáles son las ofertas de equilibrio?",a:"√(πσ²/2) = √(25π) ≈ 8,86. Entonces w*g ≈ 108,86 y w*f ≈ 91,14. Cada una gana con probabilidad 1/2."}]}]},
{g:"Aplicaciones del EPS", from:"eps", items:[
 {id:"stackelberg", t:"Stackelberg: líder y seguidora", sim:"stack", nuevo:true, html:String.raw`
<section><h3>La idea</h3><p class="lead">Stackelberg (1934): una firma, la líder, escoge su cantidad primero; la seguidora la observa y responde. Se resuelve por inducción hacia atrás en dos escenarios.</p></section>
<section><h3>Planteamiento (Taller 3, Ej. 8)</h3><p>\(C_i(q_i)=c\,q_i\) y \(P(Q)=\max[M-dQ,\,0]\). La firma 1 es la líder: \(S_1=\mathbb{R}_+\). La seguidora elige después de ver \(q_1\), así que su estrategia es una <b>función</b>:</p>
<div class="mj">\[S_2=\{s_2:\mathbb{R}_+\to\mathbb{R}_+\},\qquad q_2=s_2(q_1)\]</div>
<div class="mj">\[\pi_1(s_1,s_2)=\big[M-d\,(s_1+s_2(s_1))\big]s_1-c\,s_1,\qquad \pi_2(s_1,s_2)=\big[M-d\,(s_1+s_2(s_1))\big]s_2(s_1)-c\,s_2(s_1)\]</div></section>
<section><h3>Segundo escenario: la seguidora</h3><p>Para cada \(q_1\), \(\max_{q_2}\;[M-d(q_1+q_2)]q_2-c\,q_2\). Condición de primer orden: \(M-dq_1-2d\tilde q_2-c=0\):</p>
<div class="mj">\[\tilde q_2=\tilde s_2(q_1)=\frac{M-c-d\,q_1}{2d}\]</div>
<p>Es la misma función de reacción de Cournot, y es la única estrategia creíble de la seguidora.</p></section>
<section><h3>Primer escenario: la líder</h3><p>La líder anticipa \(\tilde s_2\): \(\max_{q_1}\big[M-d\big(q_1+\frac{M-c-dq_1}{2d}\big)\big]q_1-c\,q_1\). La condición de primer orden da</p>
<div class="mj">\[\tilde q_1=\frac{M-c}{2d},\qquad \tilde q_2=\tilde s_2(\tilde q_1)=\frac{M-c}{4d}\]</div>
<p>Comparado con Cournot, \(q^{C}=\frac{M-c}{3d}\): \(\tilde q_1&gt;q_1^{C}\) y \(\tilde q_2&lt;q_2^{C}\). Mover primero es una ventaja, porque la líder se compromete con una cantidad grande y la seguidora se acomoda.</p>
<p>El EPS es \(\big(\tilde q_1,\ \tilde s_2(\cdot)\big)\): la cantidad de la líder y la <b>función</b> completa de la seguidora, no solo el número \(\tilde q_2\).</p></section>
${LAB}`,
 qs:[{q:"Con M = 100, d = 1 y c = 10, ¿cuánto produce cada firma?",a:"q̃₁ = 90/2 = 45 y q̃₂ = 90/4 = 22,5. El precio es 100 − 67,5 = 32,5. En Cournot cada una produciría 30."}]},
 {id:"sindicato", t:"Sindicato y empresa", html:String.raw`
<section><h3>Taller 3, Ej. 7</h3><p class="lead">Modelo de Leontief (1946): el sindicato fija el salario \(w\) y la empresa, después de observarlo, elige el empleo \(L\). \(U(w,L)\) es creciente en ambos argumentos y \(\pi(w,L)=I(L)-wL\), con \(I\) creciente y cóncava.</p></section>
<section><h3>a) Forma extensiva</h3><p>Primero mueve el sindicato y elige un \(w\in[0,\infty)\): de la raíz sale un abanico continuo de ramas. Al final de cada \(w\) hay un nodo de la empresa, que elige \(L\in[0,\infty)\), y en cada nodo terminal los pagos son \((U(w,L),\,\pi(w,L))\). Cada nodo de la empresa es un conjunto de información unitario, porque observa \(w\).</p></section>
<section><h3>b) Mejor respuesta de la empresa</h3><p>Para cada \(w\), \(\max_{L\ge0}\;I(L)-wL\). Condición de primer orden:</p>
<div class="mj">\[I'(L^*(w))=w\]</div>
<p>La empresa contrata hasta que el ingreso marginal del trabajo iguala el salario. Como \(I''&lt;0\), derivando: \(L^{*\prime}(w)=1/I''(L^*)&lt;0\). La mejor respuesta es la demanda de trabajo, decreciente en \(w\).</p>
<p>Por inducción hacia atrás, el sindicato resuelve \(\max_w U\big(w,L^*(w)\big)\): elige el punto de la demanda de trabajo donde su curva de indiferencia es tangente a ella. Ese resultado es ineficiente: los dos podrían mejorar con más empleo y un salario un poco menor, pero la empresa no puede comprometerse a contratar más de \(L^*(w)\).</p></section>`},
 {id:"negociacion", t:"Negociación de Stahl y Rubinstein", sim:"neg", nuevo:true, html:String.raw`
<section><h3>La idea</h3><p class="lead">Dos jugadores se reparten 1 peso. En el período 1 propone el jugador 1 y el 2 acepta o rechaza; si rechaza, en el período 2 propone el 2, y así se alternan. Esperar cuesta: el jugador \(i\) descuenta cada período con \(\delta_i\in(0,1)\).</p></section>
<section><h3>T = 3 con descuentos distintos (Taller 3, Ej. 10)</h3><p>Como en Gibbons: si no hay acuerdo en los dos primeros períodos, en el tercero se impone el reparto \((s,\,1-s)\). Se resuelve hacia atrás, con \(x_t\) la parte del jugador 1 en el período \(t\):</p>
<ol class="steps"><li><b>Período 3:</b> \(x_3=s\).</li><li><b>Período 2 (propone el 2):</b> el 1 acepta si recibe al menos lo que vale esperar, \(\delta_1 s\). El 2 ofrece justo eso: \(x_2=\delta_1 s\) y se queda con \(1-\delta_1 s\).</li><li><b>Período 1 (propone el 1):</b> el 2 acepta si recibe al menos \(\delta_2(1-\delta_1 s)\). El 1 ofrece justo eso:</li></ol>
<div class="mj">\[x_1^*=1-\delta_2\,(1-\delta_1 s),\qquad 1-x_1^*=\delta_2\,(1-\delta_1 s)\]</div>
<p>El 2 acepta en el período 1 y no hay demora. Con \(\delta_1=\delta_2=\delta\): \(x_1^*=1-\delta(1-\delta s)\).</p></section>
<section><h3>T rondas y T → ∞ (Ej. 11)</h3><p>Con más rondas se repite el mismo paso: quien propone en \(t\) ofrece al otro el valor descontado de lo que este obtendría en \(t+1\):</p>
<div class="mj">\[x_t=1-\delta_2(1-x_{t+1})\ \text{si propone el 1},\qquad x_t=\delta_1\,x_{t+1}\ \text{si propone el 2}\]</div>
<p>Cuando \(T\to\infty\), la regla del último período deja de importar y se llega al resultado de Rubinstein (1982):</p>
<div class="mj">\[x^*=\frac{1-\delta_2}{1-\delta_1\delta_2}\qquad\text{y con }\delta_1=\delta_2=\delta:\qquad x^*=\frac{1}{1+\delta}\]</div>
<p>Es más paciente quien tiene \(\delta\) más alto, y eso le da más poder de negociación. Proponer primero también da ventaja, que desaparece cuando \(\delta\to1\).</p></section>
${LAB}`,
 qs:[{q:"Con T = 3, δ₁ = 0,9, δ₂ = 0,8 y s = 1/2, ¿cuánto se lleva cada jugador?",a:"x₂ = 0,9·0,5 = 0,45. x₁ = 1 − 0,8·(1 − 0,45) = 1 − 0,44 = 0,56. El jugador 1 se lleva 0,56 y el 2, 0,44, en el primer período."}]}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"creencias",t:"Resolvedor de árboles con creencias",anchor:"ebp",links:["eps","ebp","subjuegos","arboles"],sim:"extfull",html:WSBOX,
  d:"Para juegos con información imperfecta: además de los equilibrios de Nash y los perfectos en subjuegos, encuentra los equilibrios bayesianos perfectos con las creencias μ que los sostienen, y revisa el requisito 5. Trae cargadas las figuras del Taller 3 y los ejemplos de clase de EPS y EBP."},
 {id:"arboles",t:"Resolvedor de árboles",anchor:"representacion",links:["representacion","secuencial","subjuegos","tres"],sim:"ext",nuevo:true,html:WSBOX,
  d:"Escribe cualquier juego en forma extensiva: varias etapas, conjuntos de información, tres jugadores o azar. Dibuja el árbol, arma las estrategias y la forma estratégica, marca los subjuegos y encuentra el equilibrio perfecto en subjuegos paso a paso."},
 {id:"resolvedor",t:"Resolvedor paso a paso",anchor:"mixtas",links:["dominancia","nash","mixtas","maximin"],sim:"full",html:WSBOX,
  d:"Escribe cualquier tabla de pagos o carga un ejercicio del taller. Muestra la forma estratégica, la eliminación iterativa, los equilibrios en puras y en mixtas, y el maximin, con la notación del curso. El modo práctica oculta cada paso hasta que lo resuelvas a mano."}
];
