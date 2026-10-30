// Teoría de Juegos · contenido de la ruta (notación del curso, ejercicios del Taller 1)
// =====================================================================
// CONTENIDO: Teoría de Juegos con la notación del curso (Taller 1, prof. Barrientos)
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const M2=(p1,p2,R,C,cells)=>`<div class="tbl gm"><table><tr><th class="pl" rowspan="2">${p1}</th><th></th><th class="pl" colspan="${C.length}">${p2}</th></tr><tr><th></th>${C.map(c=>`<th>${c}</th>`).join("")}</tr>${R.map((r,i)=>`<tr><th></th><th>${r}</th>${cells[i].map(c=>`<td class="${c[1]?"ne":""}">${c[0]}</td>`).join("")}</tr>`).join("")}</table></div>`;
const TRUNK=[
{id:"representacion", t:"Representación de juegos", nuevo:true, html:String.raw`
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
qs:[{q:"Si el maximin del jugador 1 es 3 y el minimax es 3, ¿hace falta mezclar?",a:"No. Hay punto de silla: las estrategias puras que lo alcanzan son óptimas y el valor del juego es 3."}]}
];

const BRANCHES=[
{g:"Juegos secuenciales", from:"representacion", items:[
 {id:"secuencial", t:"Inducción hacia atrás", sim:"seq", html:String.raw`
<section><h3>La idea</h3><p class="lead">En un juego secuencial con información perfecta se resuelve desde el final: el último en mover elige lo mejor para él, y los anteriores anticipan esa respuesta. El resultado es el <b>equilibrio perfecto en subjuegos</b> (EPS).</p></section>
<section><h3>Amenazas no creíbles</h3><p>En el juego de entrada (Ej. 1), \((NE,P)\) es equilibrio de Nash: si la firma 2 amenaza con pelear, a la 1 no le conviene entrar. Pero si la 1 entra, pelear le da −1 a la 2 y conceder le da 1. La amenaza no es creíble y la inducción hacia atrás la descarta: el EPS es \((E,C)\).</p>
<p>Todo EPS es equilibrio de Nash, pero no todo equilibrio de Nash es EPS.</p></section>
${LAB}`,
 qs:[{q:"En la batalla de los sexos secuencial (Ej. 3b), ¿cuál es el EPS?",a:"B responde B si G juega B (2 &gt; 1) y S si G juega S (3 &gt; 0): su estrategia es BS. G anticipa y compara 3 con 2: juega B. El EPS es (B, BS) y el resultado es que ambos van a B."}]},
 {id:"tres", t:"Juegos con tres jugadores", sim:"tres", html:String.raw`
<section><h3>La idea</h3><p class="lead">Con tres jugadores la forma estratégica son varias tablas: una por cada estrategia del jugador 3. Un perfil \((s_1,s_2,s_3)\) es equilibrio si ninguno de los tres gana desviándose solo.</p>
<div class="mj">\[EN=r_1\cap r_2\cap r_3,\qquad r_1(s_2,s_3),\;r_2(s_1,s_3),\;r_3(s_1,s_2)\]</div></section>
<section><h3>Figura 4 (Ej. 13)</h3><p>El jugador 3 no sabe si el 2 jugó X o Y, y si el 1 juega B el juego termina en (1, 0, 3). Entonces \(S_1=\{A,B\}\), \(S_2=\{X,Y\}\), \(S_3=\{C,D\}\), y</p>
<div class="mj">\[EN=\{(A,X,C),\;(B,X,D),\;(B,Y,C)\}\]</div>
<p>Los dos últimos se sostienen porque, si el 1 juega B, el 2 y el 3 quedan indiferentes y el 1 prefiere B ante la combinación que eligen.</p></section>
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
{g:"Aplicaciones", from:"mixtas", items:[
 {id:"arbitraje", t:"Arbitraje de oferta final", sim:"arb", html:String.raw`
<section><h3>La idea</h3><p class="lead">Modelo de Farber (1980): la empresa ofrece \(w_f\) y el sindicato pide \(w_g\). El árbitro tiene en mente un salario justo \(x\sim N(m,\sigma^2)\) y elige la oferta más cercana. Pedir más da mejor salario si se gana, pero baja la probabilidad de ganar.</p>
<div class="mj">\[\min_{w_f}\;w_f\,F\!\left(\tfrac{w_f+w_g}{2}\right)+w_g\left[1-F\!\left(\tfrac{w_f+w_g}{2}\right)\right]\]</div>
<p>Las condiciones de primer orden de ambos implican \(F\!\left(\frac{w_f^*+w_g^*}{2}\right)=\frac12\), es decir, el punto medio es \(m\), y</p>
<div class="mj">\[w_g^*=m+\sqrt{\frac{\pi\sigma^2}{2}}\qquad\qquad w_f^*=m-\sqrt{\frac{\pi\sigma^2}{2}}\]</div></section>
${LAB}`}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"resolvedor",t:"Resolvedor paso a paso",anchor:"mixtas",links:["dominancia","nash","mixtas","maximin"],sim:"full",html:WSBOX,
  d:"Escribe cualquier tabla de pagos o carga un ejercicio del taller. Muestra la forma estratégica, la eliminación iterativa, los equilibrios en puras y en mixtas, y el maximin, con la notación del curso. El modo práctica oculta cada paso hasta que lo resuelvas a mano."}
];
