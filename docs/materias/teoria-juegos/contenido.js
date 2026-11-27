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
{k:"Ej. 1",t:"Entrada al mercado",html:String.raw`<p>La firma 1 decide entrar (E) o no (NE). Si entra, la 2 pelea (P) o concede (C). Monopolio: 2 millones. Si concede, se reparten (1, 1); si pelea, ambas pierden 1 millón.</p><div class="mj">\[G(\Gamma)=\{N=\{1,2\},\;S_1=\{E,NE\},\;S_2=\{P,C\},\;\pi_i\}\]</div>${M2("1","2",["E","NE"],["P","C"],[[["−1, −1"],["1, 1",1]],[["0, 2",1],["0, 2"]]])}<p>\(EN=\{(E,C),\,(NE,P)\}\). La subestación «Juegos secuenciales» muestra por qué solo \((E,C)\) sobrevive a la inducción hacia atrás.</p>`},
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
{k:"Taller 2 · Ej. 4",t:"Bertrand de Gibbons (sección 1.2.B)",html:String.raw`<p>Productos diferenciados: \(q_i(p_i,p_j)=a-p_i+b\,p_j\), con \(0&lt;b&lt;2\) y costo marginal \(c&lt;a\). Forma estratégica: \(S_i=[0,\infty)\) y \(\pi_i=(p_i-c)(a-p_i+bp_j)\). La condición de primer orden da \(p_i^*=\frac12(a+bp_j^*+c)\) y, resolviendo,</p><div class="mj">\[p_1^*=p_2^*=\frac{a+c}{2-b}\]</div><p>Lo desarrolla la subestación «Bertrand: paradoja y productos diferenciados».</p>`}],
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
qs:[{q:"¿Puede un EN que no es EPS darle a todos los jugadores el mismo resultado que el EPS?",a:"Sí. Pueden diferir solo en lo que pasa fuera de la trayectoria. Por ejemplo, en Norte/Sur, (N,(N,N)) y (N,(N,S)) llevan ambos a (4, 3); solo el segundo es EPS, porque el primero dice que tras S la empresa 2 elegiría N, y no le conviene."},
 {q:"¿Por qué en un juego sin subjuegos propios todo EN es EPS?",a:"Porque el único subjuego es el juego completo, y un EN ya es equilibrio en él. Por eso con información imperfecta hace falta un refinamiento más fuerte: el equilibrio bayesiano perfecto."}]},

{id:"bayesnash", t:"Juegos bayesianos: equilibrio Bayes-Nash", nuevo:true, sim:"bayes", html:String.raw`
<section><h3>La idea</h3><p class="lead">Hasta ahora todos conocían los pagos de todos. En un juego con <b>información incompleta</b>, cada jugador sabe algo que los demás no: su costo, su valoración, sus preferencias. Eso se modela con <b>tipos</b>. El equilibrio Bayes-Nash es el equilibrio de Nash de ese juego: cada tipo de cada jugador hace lo mejor para él, dado lo que espera que hagan los tipos del otro.</p></section>
<section><h3>Forma normal de un juego bayesiano</h3><p>Siguiendo a Harsanyi (1967-68), un juego bayesiano estático es</p>
<div class="mj">\[G=\{A_1,\dots,A_n;\;T_1,\dots,T_n;\;p_1,\dots,p_n;\;u_1,\dots,u_n\}\]</div>
<ul><li>\(A_i\): acciones del jugador \(i\).</li><li>\(T_i\): sus tipos posibles. Solo \(i\) conoce su tipo \(t_i\).</li><li>\(p_i(t_{-i}\mid t_i)\): lo que el tipo \(t_i\) cree sobre los tipos de los demás. Con tipos independientes y una distribución previa común, \(p_i(t_{-i}\mid t_i)=p(t_{-i})\).</li><li>\(u_i(a_1,\dots,a_n;\,t_i)\): el pago, que depende del tipo.</li></ul>
<p><b>Transformación de Harsanyi:</b> el juego empieza con una jugada de la naturaleza que elige los tipos; cada jugador observa el suyo y luego todos mueven a la vez. Así, la información incompleta se convierte en información imperfecta sobre una jugada del azar.</p></section>
<section><h3>Estrategias y equilibrio</h3><p>Una estrategia es una función \(s_i:T_i\to A_i\): un plan que dice qué hace <b>cada</b> tipo, aunque en la realidad solo exista uno. Si el jugador tiene dos tipos y dos acciones, tiene \(2\times2=4\) estrategias.</p>
<p><b>Definición.</b> \(s^*=(s_1^*,\dots,s_n^*)\) es un equilibrio Bayes-Nash si para cada jugador \(i\) y <b>cada</b> tipo \(t_i\in T_i\):</p>
<div class="mj">\[s_i^*(t_i)\in\arg\max_{a_i\in A_i}\;\sum_{t_{-i}\in T_{-i}}u_i\big(s_1^*(t_1),\dots,a_i,\dots,s_n^*(t_n);\,t\big)\;p_i(t_{-i}\mid t_i)\]</div>
<p>Es equivalente a buscar los equilibrios de Nash de la tabla de pagos esperados <i>ex ante</i>, siempre que todos los tipos tengan probabilidad positiva. Todo juego bayesiano finito tiene al menos un equilibrio Bayes-Nash, quizá en mixtas.</p></section>
<section><h3>Receta para el parcial</h3><ol class="steps"><li>Identifica quién tiene información privada, sus tipos y las probabilidades.</li><li>Escribe una tabla de pagos por cada combinación de tipos.</li><li>Lista las estrategias como planes por tipo: \((\text{acción del tipo 1},\ \text{acción del tipo 2})\).</li><li>Para cada tipo, calcula el pago esperado de cada acción ponderando las tablas por la probabilidad del tipo del otro, y busca su mejor respuesta.</li><li>Un perfil es equilibrio si todos los tipos están en su mejor respuesta a la vez.</li></ol></section>
<section><h3>Ejemplo: batalla de los sexos con información incompleta</h3><p>El jugador 2 quiere encontrarse con el 1 (probabilidad ½) o evitarlo (½), y solo él lo sabe. Prueba con \(s_1=B\) y \(s_2=(B,S)\) (B si quiere encontrarse, S si quiere evitar):</p>
<ul><li>Tipo «encontrarse» ante B: B le da 1 y S le da 0 → B ✓.</li><li>Tipo «evitar» ante B: B le da 0 y S le da 2 → S ✓.</li><li>Jugador 1: \(B\to\tfrac12\cdot2+\tfrac12\cdot0=1\), \(S\to\tfrac12\cdot0+\tfrac12\cdot1=\tfrac12\) → B ✓.</li></ul>
<p>El único equilibrio Bayes-Nash en puras es \(\big(B,(B,S)\big)\). Si la probabilidad de «encontrarse» baja a ¼, al jugador 1 ya no le conviene B y no queda ninguno en puras: compruébalo en el laboratorio.</p></section>
${LAB}
<p class="warn"><b>Error común:</b> dar como respuesta la acción del tipo que «realmente» salió. El equilibrio exige especificar qué haría cada tipo, porque el rival decide con base en lo que harían todos los tipos posibles.</p>`,
qs:[{q:"Un jugador tiene 3 tipos y 2 acciones. ¿Cuántas estrategias puras tiene?",a:"2³ = 8: una acción para cada uno de sus 3 tipos."},
 {q:"¿En qué se diferencian el equilibrio Bayes-Nash y el equilibrio bayesiano perfecto?",a:"El Bayes-Nash es para juegos estáticos con información incompleta: las creencias son las probabilidades de los tipos. El bayesiano perfecto es para juegos dinámicos: además, las creencias se actualizan con la regla de Bayes a medida que se observan jugadas, y se exige racionalidad secuencial."}]},

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
 qs:[{q:"Con T = 3, δ₁ = 0,9, δ₂ = 0,8 y s = 1/2, ¿cuánto se lleva cada jugador?",a:"x₂ = 0,9·0,5 = 0,45. x₁ = 1 − 0,8·(1 − 0,45) = 1 − 0,44 = 0,56. El jugador 1 se lleva 0,56 y el 2, 0,44, en el primer período."}]}]},
{g:"Aplicaciones de los juegos bayesianos", from:"bayesnash", items:[
 {id:"cournot-asim", t:"Cournot con información asimétrica", sim:"bcour", nuevo:true, html:String.raw`
<section><h3>Planteamiento (Gibbons, 3.1.A)</h3><p class="lead">\(P(Q)=a-q_1-q_2\). El costo de la firma 1 es \(c\) y todos lo saben. La firma 2 conoce su propio costo: \(c_H\) con probabilidad \(\theta\) o \(c_L\) con probabilidad \(1-\theta\). La firma 1 no lo conoce.</p>
<p>\(T_1=\{c\}\), \(T_2=\{c_H,c_L\}\). La estrategia de la firma 2 es un par \((q_2(c_H),q_2(c_L))\).</p></section>
<section><h3>Mejores respuestas</h3><p>Cada tipo de la firma 2 maximiza conociendo su costo:</p>
<div class="mj">\[\max_{q_2}\;[a-q_1^*-q_2-c_H]\,q_2\;\Rightarrow\;q_2^*(c_H)=\frac{a-q_1^*-c_H}{2}\qquad q_2^*(c_L)=\frac{a-q_1^*-c_L}{2}\]</div>
<p>La firma 1 maximiza su beneficio <b>esperado</b>:</p>
<div class="mj">\[\max_{q_1}\;\theta\,[a-q_1-q_2^*(c_H)-c]\,q_1+(1-\theta)\,[a-q_1-q_2^*(c_L)-c]\,q_1\;\Rightarrow\;q_1^*=\frac{\theta[a-q_2^*(c_H)-c]+(1-\theta)[a-q_2^*(c_L)-c]}{2}\]</div></section>
<section><h3>Equilibrio Bayes-Nash</h3>
<div class="mj">\[q_2^*(c_H)=\frac{a-2c_H+c}{3}+\frac{1-\theta}{6}(c_H-c_L)\qquad q_2^*(c_L)=\frac{a-2c_L+c}{3}-\frac{\theta}{6}(c_H-c_L)\]</div>
<div class="mj">\[q_1^*=\frac{a-2c+\theta c_H+(1-\theta)c_L}{3}\]</div>
<p>Con información completa, la firma 2 de costo alto produciría \((a-2c_H+c)/3\). Con información asimétrica produce más, porque la firma 1 no puede ajustar su cantidad al costo real de la 2: produce pensando en un rival promedio, que es más agresivo que una firma de costo alto.</p></section>
${LAB}`,
 qs:[{q:"Con a = 100, c = 20, c_H = 30, c_L = 10 y θ = 1/2, ¿cuánto produce la firma 1?",a:"q₁* = (100 − 40 + 15 + 5)/3 = 80/3 ≈ 26,67."}]},
 {id:"subastas", t:"Subasta de primer precio", sim:"subasta", nuevo:true, html:String.raw`
<section><h3>Planteamiento (Gibbons, 3.2.B)</h3><p class="lead">Dos postores con valoraciones privadas \(v_i\sim U[0,1]\), independientes. Pujan en sobre cerrado; gana la puja más alta y paga lo que pujó. El pago es \(v_i-b_i\) si gana y 0 si pierde.</p>
<p>\(A_i=[0,\infty)\), \(T_i=[0,1]\) y la estrategia es una función \(b_i(v_i)\).</p></section>
<section><h3>Equilibrio lineal</h3><p>Se busca un equilibrio simétrico de la forma \(b_j(v_j)=a_j+c_j v_j\). El postor \(i\) con valoración \(v_i\) resuelve</p>
<div class="mj">\[\max_{b_i}\;(v_i-b_i)\,P\big(b_i&gt;a_j+c_jv_j\big)=(v_i-b_i)\,\frac{b_i-a_j}{c_j}\;\Rightarrow\;b_i=\frac{v_i+a_j}{2}\]</div>
<p>Para que esto tenga la forma lineal supuesta hace falta \(a_i=a_j/2\) y \(c_i=1/2\). En el equilibrio simétrico, \(a=0\):</p>
<div class="mj">\[b(v)=\frac{v}{2}\qquad\text{y con } n \text{ postores:}\qquad b(v)=\frac{n-1}{n}\,v\]</div>
<p>Cada uno puja por debajo de su valoración. Esa reducción baja a medida que aumenta la competencia: con \(n\to\infty\), \(b(v)\to v\). El ingreso esperado del vendedor es \(\frac{n-1}{n+1}\bar v\).</p></section>
${LAB}`,
 qs:[{q:"Con tres postores y valoraciones uniformes en [0, 100], ¿cuánto puja quien valora el objeto en 60?",a:"b = (3 − 1)/3 · 60 = 40."}]}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"guiada",t:"Práctica guiada: hazlo tú",anchor:"nash",links:["nash","dominancia","mixtas","secuencial","eps","subjuegos","ebp"],sim:"guiada",nuevo:true,html:WSBOX,
  d:"Aquí no ves la solución hecha: la construyes tú, paso a paso, y la app te corrige al momento con una pista que explica el porqué. Cuatro procedimientos: subrayar mejores respuestas y encontrar el equilibrio de Nash en una tabla, despejar las probabilidades de las mixtas, resolver un árbol hacia atrás hasta escribir el EPS, y usar creencias μ para el EBP."},
 {id:"creencias",t:"Resolvedor de árboles con creencias",anchor:"ebp",links:["eps","ebp","subjuegos","arboles"],sim:"extfull",html:WSBOX,
  d:"Para juegos con información imperfecta: además de los equilibrios de Nash y los perfectos en subjuegos, encuentra los equilibrios bayesianos perfectos con las creencias μ que los sostienen, y revisa el requisito 5. Trae cargadas las figuras del Taller 3 y los ejemplos de clase de EPS y EBP."},
 {id:"senal",t:"Resolvedor de juegos de señalización",anchor:"senalizacion",links:["senalizacion","ebp","bayesnash"],sim:"senal",nuevo:true,html:WSBOX,
  d:"Para juegos de señalización con dos tipos, dos mensajes y dos respuestas: muestra qué responde el receptor según sus creencias, revisa las estrategias agrupadoras y separadoras con la regla de Bayes y encuentra todos los equilibrios bayesianos perfectos en puras. Trae cargadas las figuras del Taller 4."},
 {id:"arboles",t:"Resolvedor de árboles",anchor:"representacion",links:["representacion","secuencial","subjuegos","tres"],sim:"ext",nuevo:true,html:WSBOX,
  d:"Escribe cualquier juego en forma extensiva: varias etapas, conjuntos de información, tres jugadores o azar. Dibuja el árbol, arma las estrategias y la forma estratégica, marca los subjuegos y encuentra el equilibrio perfecto en subjuegos paso a paso."},
 {id:"resolvedor",t:"Resolvedor paso a paso",anchor:"mixtas",links:["dominancia","nash","mixtas","maximin"],sim:"full",html:WSBOX,
  d:"Escribe cualquier tabla de pagos o carga un ejercicio del taller. Muestra la forma estratégica, la eliminación iterativa, los equilibrios en puras y en mixtas, y el maximin, con la notación del curso. El modo práctica oculta cada paso hasta que lo resuelvas a mano."}
];


// =====================================================================
// TALLERES DE TEORÍA DE JUEGOS (prof. Jorge Barrientos): cada punto se escribe una vez aquí.
// La página del taller lo muestra completo y cada lección lista los puntos de su tema.
// Los botones abren el resolvedor con ese punto cargado (TOOL_PRE).
// =====================================================================
const TALLERES=[];
const RT=(pre,l)=>({id:"resolvedor",pre,lbl:l||"Abrir en el Resolvedor paso a paso"}),AR=(pre,l)=>({id:"arboles",pre,lbl:l||"Abrir en el Resolvedor de árboles"});
TALLERES.push({id:"tl-t1",t:"Primer taller",sub:"Representación, dominancia, Nash en puras y mixtas, maximin",anchor:"nash",
intro:`Los 19 puntos del primer taller en orden. Cada uno trae lo que necesitas saber, el procedimiento y la respuesta; los que tienen tabla o árbol abren el resolvedor con ese punto cargado, para ver cada paso. Los equilibrios se verificaron con el motor de la app, en fracciones exactas.`,
puntos:[
{id:"t1-1",n:"1",t:"Entrada al mercado: forma extensiva y estratégica",tipo:"Representación",temas:["representacion","secuencial"],tool:AR("ent"),
enun:String.raw`<p>La firma 1 decide si entra (E) o no (NE) a un mercado ocupado por la firma 2. Si entra, la 2 pelea (P) o concede (C). El monopolio da 2 millones de dólares; si la 2 concede, se reparten; si pelea, ambas pierden 1 millón. Represente el juego en forma extensiva y estratégica.</p>`,
saber:[String.raw`<b>Forma extensiva:</b> árbol con quién mueve en cada nodo, qué sabe y los pagos al final.`,String.raw`<b>Forma estratégica:</b> \(G(\Gamma)=\{N,(S_i)_{i\in N},(\pi_i)_{i\in N}\}\). Una estrategia dice qué hacer en <i>cada</i> conjunto de información del jugador, aunque no se llegue a él.`],
sol:String.raw`<ol class="steps"><li><b>Árbol:</b> la firma 1 mueve primero: NE termina con \((0,2)\); E lleva al nodo de la firma 2, que elige P \((-1,-1)\) o C \((1,1)\).</li>
<li><b>Estrategias:</b> \(S_1=\{E,NE\}\) y \(S_2=\{P,C\}\). La firma 2 tiene un solo conjunto de información, así que tiene dos estrategias.</li>
<li><b>Tabla:</b><div class="tbl"><table><tr><th></th><th>P</th><th>C</th></tr><tr><th>E</th><td>−1, −1</td><td>1, 1</td></tr><tr><th>NE</th><td>0, 2</td><td>0, 2</td></tr></table></div> Si la 1 no entra, la elección de la 2 no cambia nada: por eso la fila NE repite \((0,2)\).</li></ol>`,
res:String.raw`<p>\(N=\{1,2\}\), \(S_1=\{E,NE\}\), \(S_2=\{P,C\}\) con la tabla de arriba. Aunque no se pide, sus equilibrios de Nash son \((E,C)\) y \((NE,P)\); en el tercer taller se ve que solo \((E,C)\) es perfecto en subjuegos, porque pelear es una amenaza no creíble.</p>`},

{id:"t1-2",n:"2",t:"Figura 1 en forma estratégica",tipo:"Representación",temas:["representacion","subjuegos"],tool:RT("ej2","Ver la forma estratégica en el Resolvedor"),
enun:String.raw`<p>Considere el juego de la figura 1 y represéntelo en forma estratégica.</p>`,
saber:[String.raw`Hay que contar los <b>conjuntos de información</b>: el jugador 2 no distingue si el 1 jugó Z o X (conjunto h), pero sí observa Y; el 1 vuelve a mover después de X y L.`,String.raw`El número de estrategias es el producto de las acciones en cada conjunto de información del jugador.`],
sol:String.raw`<ol class="steps"><li><b>Jugador 1:</b> dos conjuntos de información: el inicio (Z, X, Y) y el nodo tras X y L (A, B). Estrategias: \(3\times2=6\): ZA, ZB, XA, XB, YA, YB.</li>
<li><b>Jugador 2:</b> dos conjuntos: h (tras Z o X) y el nodo tras Y. Estrategias \(2\times2=4\): RR, RL, LR, LL (la primera letra es en h, la segunda tras Y).</li>
<li><b>Pagos:</b> sigue cada combinación por el árbol. Por ejemplo, \((XB,LR)\): el 1 juega X, el 2 juega L en h, el 1 juega B: \((3,2)\).<div class="tbl"><table><tr><th></th><th>RR</th><th>RL</th><th>LR</th><th>LL</th></tr><tr><th>ZB, ZA</th><td>1, 1</td><td>1, 1</td><td>0, 0</td><td>0, 0</td></tr><tr><th>XB</th><td>0, 0</td><td>0, 0</td><td>3, 2</td><td>3, 2</td></tr><tr><th>XA</th><td>0, 0</td><td>0, 0</td><td>1, 2</td><td>1, 2</td></tr><tr><th>YB, YA</th><td>2, 2</td><td>2, 3</td><td>2, 2</td><td>2, 3</td></tr></table></div></li></ol>`,
res:String.raw`<p>Una tabla de 6 × 4. Las filas ZA y ZB son iguales, y también YA y YB, porque la segunda decisión del 1 no se alcanza. Equilibrios en puras: \((XB,LR)\), \((XB,LL)\), \((YB,RL)\) y \((YA,RL)\).</p>`},

{id:"t1-3",n:"3",t:"Batalla de los sexos: simultánea, secuencial y equilibrios",tipo:"Representación, puras y mixtas",temas:["representacion","nash","mixtas","secuencial"],tool:RT("tabla1"),
enun:String.raw`<p>Con la Tabla 1 (G elige filas, B columnas): \((B,B)=(3,2)\), \((B,S)=(1,1)\), \((S,B)=(0,0)\), \((S,S)=(2,3)\). <b>a)</b> Represéntelo en forma estratégica y extensiva si las decisiones son simultáneas. <b>b)</b> Igual, si son secuenciales. <b>c)</b> Halle las correspondencias de mejor respuesta y los equilibrios de Nash en puras y mixtas del juego simultáneo.</p>`,
saber:[String.raw`<b>Simultáneo:</b> en el árbol, los dos nodos de B van unidos por un conjunto de información: B no sabe qué hizo G.`,String.raw`<b>Secuencial:</b> B observa a G, así que tiene \(2\times2=4\) estrategias: qué hacer si G jugó B y qué hacer si jugó S.`,String.raw`<b>Mixtas 2 × 2:</b> cada jugador mezcla para dejar <i>indiferente al otro</i>.`],
sol:String.raw`<h5>a) Simultáneo</h5><p>La forma estratégica es la Tabla 1. En el árbol, G mueve y B elige en un conjunto de información con dos nodos. <button class="btn" type="button" data-tool="arboles" data-pre="bosSim">Ver el árbol simultáneo</button></p>
<h5>b) Secuencial</h5><p>\(S_G=\{B,S\}\) y \(S_B=\{BB,BS,SB,SS\}\) (la primera letra responde a B, la segunda a S):</p><div class="tbl"><table><tr><th></th><th>BB</th><th>BS</th><th>SB</th><th>SS</th></tr><tr><th>B</th><td>3, 2</td><td>3, 2</td><td>1, 1</td><td>1, 1</td></tr><tr><th>S</th><td>0, 0</td><td>2, 3</td><td>0, 0</td><td>2, 3</td></tr></table></div><p><button class="btn" type="button" data-tool="arboles" data-pre="bosSeq">Ver el árbol secuencial</button></p>
<h5>c) Mejores respuestas y equilibrios</h5><ol class="steps"><li>Sea \(p=\sigma_G(B)\) y \(q=\sigma_B(B)\). Para G: \(\pi_G(B)=3q+1(1-q)=1+2q\) y \(\pi_G(S)=2(1-q)\). B es mejor si \(1+2q>2-2q\iff q>1/4\).
\[r_G(q)=\begin{cases}S&q<1/4\\ [0,1]&q=1/4\\ B&q>1/4\end{cases}\]</li>
<li>Para B: \(\pi_B(B)=2p\) y \(\pi_B(S)=p+3(1-p)=3-2p\). B es mejor si \(p>3/4\): \(r_B(p)=S\) si \(p<3/4\), cualquiera si \(p=3/4\), B si \(p>3/4\).</li>
<li>Los cruces de las dos correspondencias son los equilibrios: \((B,B)\) con pagos \((3,2)\), \((S,S)\) con \((2,3)\), y el mixto \(\sigma_G=(3/4,1/4)\), \(\sigma_B=(1/4,3/4)\), con pagos esperados \((3/2,3/2)\).</li></ol>`,
res:String.raw`<p>EN en puras: \((B,B)\) y \((S,S)\). EN mixto: G juega B con probabilidad 3/4 y B juega B con probabilidad 1/4; cada uno espera 3/2, menos que en cualquiera de los equilibrios puros.</p>`},

{id:"t1-4",n:"4",t:"Tabla 2: eliminación iterativa, puras y mixtas",tipo:"Dominancia y Nash",temas:["dominancia","nash","mixtas"],tool:RT("tabla2"),
enun:String.raw`<p>Tabla 2 (1 elige A, B, C; 2 elige R, S, T): A: \((3,0),(2,2),(1,1)\); B: \((4,4),(0,3),(2,2)\); C: \((1,3),(1,0),(0,2)\). <b>a)</b> ¿Qué estrategias sobreviven a la eliminación iterativa de estrategias estrictamente dominadas? <b>b)</b> Equilibrios de Nash en puras. <b>c)</b> En mixtas.</p>`,
saber:[String.raw`\(s_i\) está estrictamente dominada por \(s_i'\) si \(\pi_i(s_i',s_{-i})>\pi_i(s_i,s_{-i})\) para toda \(s_{-i}\). Se elimina y se repite con la tabla reducida.`,String.raw`Para Nash en puras: subraya la mejor respuesta de cada jugador; las celdas con los dos pagos subrayados son equilibrios.`,String.raw`Las estrategias eliminadas nunca se juegan con probabilidad positiva en un equilibrio mixto.`],
sol:String.raw`<ol class="steps"><li><b>a)</b> Para el jugador 1, A domina a C: \(3>1\), \(2>1\), \(1>0\). Se elimina C.</li>
<li>En la tabla reducida (A, B), para el 2, S domina a T: \(2>1\) y \(3>2\). Se elimina T.</li>
<li>Con A, B frente a R, S ya no hay dominadas: sobreviven \(\{A,B\}\times\{R,S\}\).</li>
<li><b>b)</b> Mejores respuestas en la tabla 2 × 2: ante R el 1 prefiere B (4); ante S, A (2). Ante A el 2 prefiere S (2); ante B, R (4). Equilibrios: \((A,S)\) con \((2,2)\) y \((B,R)\) con \((4,4)\).</li>
<li><b>c)</b> Sea \(p=\sigma_1(A)\), \(q=\sigma_2(R)\). El 2 queda indiferente si \(0p+4(1-p)=2p+3(1-p)\iff p=1/3\). El 1 queda indiferente si \(3q+2(1-q)=4q\iff q=2/3\).</li></ol>`,
res:String.raw`<p>Sobreviven A, B y R, S. EN en puras: \((A,S)\) y \((B,R)\). EN mixto: \(\sigma_1=(1/3,2/3,0)\), \(\sigma_2=(2/3,1/3,0)\), con pagos \((8/3,8/3)\).</p>`},

{id:"t1-5",n:"5",t:"Tabla 3: eliminación iterativa y puras",tipo:"Dominancia y Nash",temas:["dominancia","nash"],tool:RT("tabla3"),
enun:String.raw`<p>Tabla 3 (1 elige A, M, B; 2 elige I, C, D): A: \((2,0),(1,1),(4,2)\); M: \((3,4),(1,2),(2,3)\); B: \((1,3),(0,2),(3,0)\). ¿Sobreviven estrategias a la eliminación iterativa? Calcule los equilibrios en estrategias puras.</p>`,
saber:[String.raw`Igual que el punto 4: elimina dominadas estrictamente, una a la vez, alternando jugadores, y después subraya mejores respuestas.`],
sol:String.raw`<ol class="steps"><li>Para el 1, A domina a B: \(2>1\), \(1>0\), \(4>3\). Se elimina B.</li>
<li>Con A y M, para el 2, D domina a C: \(2>1\) y \(3>2\). Se elimina C.</li>
<li>Queda \(\{A,M\}\times\{I,D\}\), sin más dominadas.</li>
<li>Mejores respuestas: ante I el 1 prefiere M (3); ante D, A (4). Ante A el 2 prefiere D (2); ante M, I (4). Equilibrios: \((A,D)\) y \((M,I)\).</li></ol>`,
res:String.raw`<p>Sobreviven A, M e I, D. EN en puras: \((A,D)\) con \((4,2)\) y \((M,I)\) con \((3,4)\). También hay uno mixto: \(\sigma_1=(1/3,2/3,0)\), \(\sigma_2=(2/3,0,1/3)\).</p>`},

{id:"t1-6",n:"6",t:"Juegos o Macro: todos los equilibrios",tipo:"Nash en puras y mixtas",temas:["nash","mixtas"],tool:RT("ej6"),
enun:String.raw`<p>Dos estudiantes eligen el curso de Juegos (J) o el de Macro (M). Si ambos eligen J, obtienen \((2,1)\); si ambos eligen M, \((1,2)\); si eligen distinto, \((0,0)\). Represente el juego en forma estratégica y calcule todos los equilibrios.</p>`,
saber:[String.raw`Es una batalla de los sexos: dos equilibrios puros de coordinación y uno mixto.`],
sol:String.raw`<ol class="steps"><li>\(N=\{1,2\}\), \(S_i=\{J,M\}\):<div class="tbl"><table><tr><th></th><th>J</th><th>M</th></tr><tr><th>J</th><td>2, 1</td><td>0, 0</td></tr><tr><th>M</th><td>0, 0</td><td>1, 2</td></tr></table></div></li>
<li>Puras: \((J,J)\) y \((M,M)\): ninguno gana desviándose a un curso distinto (0).</li>
<li>Mixtas: con \(p=\sigma_1(J)\), el 2 está indiferente si \(1\cdot p=2(1-p)\iff p=2/3\). Con \(q=\sigma_2(J)\), el 1 está indiferente si \(2q=1-q\iff q=1/3\).</li></ol>`,
res:String.raw`<p>EN: \((J,J)\), \((M,M)\) y el mixto \(\sigma_1=(2/3,1/3)\), \(\sigma_2=(1/3,2/3)\), con pagos esperados \((2/3,2/3)\).</p>`},

{id:"t1-7",n:"7",t:"Tabla 5: simultáneo frente a secuencial",tipo:"Representación y Nash",temas:["nash","secuencial","representacion"],tool:AR("t5"),
enun:String.raw`<p>Tabla 5: A: \((1,9),(1,9)\); B: \((0,0),(2,1)\) (2 elige I o D). Represente el juego en forma extensiva y discuta los resultados cuando la decisión es simultánea y cuando es secuencial.</p>`,
saber:[String.raw`En secuencia (1 mueve primero y 2 observa) se resuelve por <b>inducción hacia atrás</b>: primero la decisión del 2 en cada nodo.`],
sol:String.raw`<ol class="steps"><li><b>Simultáneo:</b> mejores respuestas: ante I el 1 juega A; ante D, B. Ante A el 2 está indiferente (9 y 9); ante B, D. EN: \((A,I)\) con \((1,9)\) y \((B,D)\) con \((2,1)\). Además, \((A,\sigma_2)\) es equilibrio para cualquier \(\sigma_2(I)\ge1/2\).</li>
<li><b>Secuencial:</b> tras A, el 2 obtiene 9 con I o con D; tras B, elige D (\(1>0\)). Anticipando esto, el 1 compara A (1) con B (2) y elige B.</li>
<li>El resultado secuencial es \((B,D)\) con pagos \((2,1)\). El equilibrio \((A,I)\) depende de que el 2 amenace con jugar I tras B, y eso no es creíble: tras B, I le da 0 y D le da 1.</li></ol>`,
res:String.raw`<p>Simultáneo: dos equilibrios, \((A,I)\) y \((B,D)\). Secuencial: solo sobrevive el resultado \((B,D)\), porque mover primero permite al 1 forzar la coordinación que le conviene.</p>`},

{id:"t1-8",n:"8",t:"Qué implica que una solución no sea equilibrio de Nash",tipo:"Conceptual",temas:["nash"],
enun:String.raw`<p>El perfil \(s^*\) es equilibrio de Nash si \(\pi_i(s_i^*,s_{-i}^*)>\pi_i(s_i,s_{-i}^*)\) para todo \(i\) y toda \(s_i\). Si la teoría propone \(s'=(s_1',\dots,s_n')\) como solución de \(G(\Gamma)\), ¿qué implica decir que \(s'\) no es un equilibrio de Nash?</p>`,
saber:[String.raw`Ojo: el taller escribe la desigualdad estricta (\(>\)), que define el equilibrio de Nash <b>estricto</b>. La definición usual usa \(\ge\).`],
sol:String.raw`<ol class="steps"><li>Negar la definición: existe al menos un jugador \(i\) y una estrategia \(s_i\) tales que \(\pi_i(s_i,s_{-i}')>\pi_i(s_i',s_{-i}')\) (con la definición usual), es decir, una desviación unilateral rentable.</li>
<li>Entonces \(s'\) no es <b>autoexigible</b>: si todos creen que los demás jugarán \(s'\), al menos uno prefiere no jugar su parte. La predicción se destruye a sí misma.</li>
<li>Una teoría que recomiende \(s'\) no sería creída por jugadores racionales que la conocen: por eso se pide que toda solución razonable sea equilibrio de Nash.</li>
<li>Con la desigualdad estricta del enunciado, «no ser equilibrio estricto» incluye además el caso en que algún jugador está solo indiferente frente a otra estrategia; eso no implica que quiera desviarse.</li></ol>`,
res:String.raw`<p>Que algún jugador tiene incentivos a desviarse unilateralmente: la solución no es estable ni consistente con la racionalidad de todos, y no se cumpliría aunque se anunciara.</p>`},

{id:"t1-9",n:"9",t:"Soluble por dominancia implica un único equilibrio de Nash",tipo:"Conceptual",temas:["dominancia","nash"],
enun:String.raw`<p>Discuta informalmente la afirmación: «Si un juego es soluble por dominancia, entonces tiene un único equilibrio de Nash».</p>`,
saber:[String.raw`Soluble por dominancia: la eliminación iterativa deja un solo perfil.`,String.raw`Ninguna estrategia que forme parte de un equilibrio de Nash se elimina por dominancia <b>estricta</b>.`],
sol:String.raw`<ol class="steps"><li><b>Con dominancia estricta es verdad.</b> Una estrategia de un equilibrio de Nash es mejor respuesta a algo, así que nunca está estrictamente dominada: los equilibrios sobreviven a todas las rondas. Si sobrevive un solo perfil, ese es el único candidato.</li>
<li>Además, ese perfil sí es equilibrio: si un jugador pudiera mejorar desviándose a una estrategia eliminada, la estrategia que la eliminó también lo mejoraría, y así sucesivamente hasta una que sobrevivió, lo que es imposible.</li>
<li><b>Con dominancia débil puede fallar.</b> Eliminar estrategias débilmente dominadas puede borrar equilibrios, y el resultado depende del orden. Ejemplo: en la Tabla 5, D domina débilmente a I para el 2 (9 = 9 y 1 &gt; 0); al eliminar I queda \((B,D)\), pero \((A,I)\) también es equilibrio.</li></ol>`,
res:String.raw`<p>Cierta si la dominancia es estricta: el perfil que sobrevive es el único equilibrio de Nash. Falsa en general con dominancia débil.</p>`},

{id:"t1-10",n:"10",t:"Figura 2 en forma estratégica y equilibrios en puras",tipo:"Representación y Nash",temas:["representacion","nash","subjuegos"],tool:RT("ej10"),
enun:String.raw`<p>Represente el juego de la figura 2 en forma estratégica y calcule los equilibrios de Nash en estrategias puras.</p>`,
saber:[String.raw`En la figura 2 el jugador 2 no sabe si el 1 jugó A o B (un solo conjunto de información), y el 1 vuelve a mover tras A y X (C o D).`],
sol:String.raw`<ol class="steps"><li>\(S_1=\{AC,AD,BC,BD\}\) y \(S_2=\{X,Y\}\).<div class="tbl"><table><tr><th></th><th>X</th><th>Y</th></tr><tr><th>AC</th><td>1, 0</td><td>5, 5</td></tr><tr><th>AD</th><td>2, 10</td><td>5, 5</td></tr><tr><th>BC, BD</th><td>8, 3</td><td>3, 8</td></tr></table></div></li>
<li>Mejores respuestas: ante X el 1 juega BC o BD (8); ante Y, AC o AD (5). Ante AC el 2 juega Y; ante AD, X; ante BC o BD, Y.</li>
<li>Única celda con los dos subrayados: \((AC,Y)\).</li></ol>`,
res:String.raw`<p>EN en puras: \((AC,Y)\), con pagos \((5,5)\). <button class="btn" type="button" data-tool="arboles" data-pre="fig2">Ver el árbol</button></p>`},

{id:"t1-11",n:"11",t:"Repartir un pastel: demandas simultáneas",tipo:"Estrategias continuas",temas:["nash","continuas"],
enun:String.raw`<p>Dos jugadores demandan simultáneamente \(x\) y \(y\). El par es factible si \(x\ge x_0\), \(y\ge y_0\) y \(g(x,y)\le1\), con \(g\) diferenciable y creciente en cada argumento y conjunto factible convexo. Si el par es factible, cada uno recibe lo que pidió; si no, reciben el statu quo \((x_0,y_0)\). ¿Cuáles son los equilibrios de Nash en puras?</p>`,
saber:[String.raw`Es el juego de demanda de Nash. Para cada \(y\), la mejor respuesta del 1 es pedir lo máximo que sigue siendo factible: el \(x\) con \(g(x,y)=1\).`],
sol:String.raw`<ol class="steps"><li><b>Frontera:</b> todo par con \(g(x,y)=1\), \(x\ge x_0\), \(y\ge y_0\) es equilibrio. Si el 1 pide más, el par deja de ser factible y recibe \(x_0\le x\); si pide menos, recibe menos. Lo mismo para el 2.</li>
<li><b>Interiores no:</b> si \(g(x,y)<1\), el 1 puede pedir un poco más y seguir siendo factible.</li>
<li><b>Desacuerdo:</b> también son equilibrio los pares no factibles en los que ninguno puede lograr un acuerdo solo: si \(y\ge\bar y\), donde \(\bar y\) es la demanda máxima del 2 compatible con \(x_0\), ninguna demanda del 1 es factible y le da igual pedir cualquier cosa. Por ejemplo, ambos piden todo el pastel.</li></ol>`,
res:String.raw`<p>Hay infinitos equilibrios: todos los repartos eficientes de la frontera \(g(x,y)=1\), más los desacuerdos en que cada uno pide tanto que el otro no puede lograr nada mejor que el statu quo. El concepto de Nash no elige un reparto.</p>`},

{id:"t1-12",n:"12",t:"Figura 3 (tres jugadores)",tipo:"Representación y Nash",temas:["tres","nash"],tool:AR("fig3"),
enun:String.raw`<p>Represente el juego de la figura 3 en forma estratégica y calcule los equilibrios de Nash en puras.</p>`,
saber:[String.raw`Con tres jugadores la forma estratégica son dos tablas: una por cada estrategia del jugador 3.`,String.raw`El 3 no sabe si llegó por B o por (C, B′): sus dos nodos forman un conjunto de información.`],
sol:String.raw`<ol class="steps"><li>\(S_1=\{C,B\}\), \(S_2=\{C',B'\}\), \(S_3=\{I,D\}\).</li>
<li>Pagos: si el 1 juega C y el 2 juega C′, \((1,1,1)\). Con C y B′, \((4,4,0)\) si el 3 juega I y \((0,0,1)\) si juega D. Si el 1 juega B, \((3,2,2)\) con I y \((0,0,0)\) con D, sin importar el 2.</li>
<li>Revisa los 8 perfiles. Por ejemplo, \((C,C',D)\): el 1 con B obtiene 0 &lt; 1, el 2 con B′ obtiene 0 &lt; 1 y el 3 está indiferente: es equilibrio. \((B,B',I)\) no lo es: el 1 se desvía a C y obtiene 4.</li></ol>`,
res:String.raw`<p>EN en puras: \((C,C',D)\) con \((1,1,1)\) y \((B,C',I)\) con \((3,2,2)\).</p>`},

{id:"t1-13",n:"13",t:"Figura 4 (tres jugadores)",tipo:"Representación y Nash",temas:["tres","nash"],tool:AR("fig4"),
enun:String.raw`<p>Represente el juego de la figura 4 en forma estratégica y calcule los equilibrios de Nash en puras.</p>`,
saber:[String.raw`El 1 elige A o B (B termina con \((1,0,3)\)); tras A, el 2 elige X o Y, y el 3 elige C o D sin saber qué hizo el 2.`],
sol:String.raw`<ol class="steps"><li>\(S_1=\{A,B\}\), \(S_2=\{X,Y\}\), \(S_3=\{C,D\}\). Con A: \((X,C)=(2,2,2)\), \((X,D)=(0,2,0)\), \((Y,C)=(0,1,0)\), \((Y,D)=(2,1,2)\). Con B, siempre \((1,0,3)\).</li>
<li>\((A,X,C)\): nadie gana desviándose (el 1 con B obtiene 1 &lt; 2; el 2 con Y, 1 &lt; 2; el 3 con D, 0 &lt; 2).</li>
<li>\((B,X,D)\) y \((B,Y,C)\): el 1 obtiene 1 y, con A, obtendría 0 frente a esas jugadas; el 2 y el 3 no cambian nada porque no se llega a sus nodos.</li></ol>`,
res:String.raw`<p>EN en puras: \((A,X,C)\), \((B,X,D)\) y \((B,Y,C)\).</p>`},

{id:"t1-14",n:"14",t:"Las cabras en el campo común",tipo:"Estrategias continuas",temas:["continuas","comunes"],tool:{id:"comunes",lbl:"Ir a Recursos comunes"},
enun:String.raw`<p>\(n\) campesinos eligen simultáneamente cuántas cabras \(g_i\) tener. Con \(G=\sum g_i\), cada cabra vale \(v(G)\), con \(v'<0\) y \(v(G)=0\) si \(G\ge G_{max}\); cada una cuesta \(c\). <b>a)</b> Represente el juego en forma estratégica. <b>b)</b> ¿Qué es un equilibrio de Nash?</p>`,
saber:[String.raw`Con estrategias continuas, la mejor respuesta sale de la condición de primer orden.`],
sol:String.raw`<ol class="steps"><li><b>a)</b> \(N=\{1,\dots,n\}\), \(S_i=[0,G_{max})\) y \(\pi_i(g_i,g_{-i})=g_i\,v(g_1+\dots+g_n)-c\,g_i\).</li>
<li><b>b)</b> \((g_1^*,\dots,g_n^*)\) es EN si cada \(g_i^*\) maximiza \(\pi_i(g_i,g_{-i}^*)\). Condición de primer orden: \(v(G^*)+g_i^*\,v'(G^*)-c=0\).</li>
<li>Sumando las \(n\) condiciones: \(v(G^*)+\frac{G^*}{n}v'(G^*)=c\). El óptimo social maximiza \(G\,v(G)-cG\): \(v(G^{**})+G^{**}v'(G^{**})=c\).</li>
<li>Como \(v'<0\), cada campesino solo cuenta el daño que su cabra hace a sus propias cabras, no a las de los demás: \(G^*>G^{**}\).</li></ol>`,
res:String.raw`<p>En el equilibrio el campo se sobreexplota: hay más cabras que en el óptimo social. Es la tragedia de los comunes (Gibbons, 1.2.D).</p>`},

{id:"t1-15",n:"15",t:"Tabla 4: estrategias racionalizables",tipo:"Racionalizabilidad",temas:["racionalizables","dominancia"],tool:RT("tabla4"),
enun:String.raw`<p>Tabla 4 (1 elige A, B, C; 2 elige I, C, D): A: \((1,0),(1,2),(0,1)\); B: \((0,3),(0,1),(3,0)\); C: \((0,1),(0,1),(1,1)\). Verifique si existen estrategias racionalizables.</p>`,
saber:[String.raw`Racionalizable: sobrevive a la eliminación iterativa de estrategias que nunca son mejor respuesta. Con dos jugadores, equivale a eliminar las estrictamente dominadas, <b>también por estrategias mixtas</b>.`],
sol:String.raw`<ol class="steps"><li>Ninguna estrategia pura domina a otra al principio, pero C del jugador 1 está dominada por la mezcla \(\tfrac12A+\tfrac12B\): da \((\tfrac12,\tfrac12,\tfrac32)\) frente a \((0,0,1)\). Se elimina C.</li>
<li>Sin C, para el 2, C domina a D: \(2>1\) frente a A y \(1>0\) frente a B. Se elimina D.</li>
<li>Sin D, para el 1, A domina a B: \(1>0\) y \(1>0\). Se elimina B.</li>
<li>Con solo A, para el 2, C domina a I (\(2>0\)). Queda \((A,C)\).</li></ol>`,
res:String.raw`<p>Sí existen: la única racionalizable de cada jugador es A para el 1 y C para el 2, y \((A,C)\) es el único equilibrio de Nash.</p>`},

{id:"t1-16",n:"16",t:"Tabla 6: reparto de 10 dólares y maximin",tipo:"Nash y maximin",temas:["nash","maximin","dominancia"],tool:RT("tabla6"),
enun:String.raw`<p>Tabla 6 (cada jugador elige A, B o C; los pagos reparten 10 US$): A: \((9,1),(1,9),(2,8)\); B: \((6,4),(5,5),(4,6)\); C: \((7,3),(8,2),(3,7)\). <b>a)</b> Halle el equilibrio en estrategias puras. <b>b)</b> Halle la estrategia maximin de cada jugador y comente.</p>`,
saber:[String.raw`Los pagos siempre suman 10: es un juego de suma constante, así que equivale a uno de suma cero.`,String.raw`Maximin: el mínimo de cada fila (o columna) y luego el máximo de esos mínimos.`],
sol:String.raw`<ol class="steps"><li><b>a)</b> Eliminación: para el 2, C domina a A (\(8>1\), \(6>4\), \(7>3\)). Luego, para el 1, B domina a A (\(5>1\), \(4>2\)). Luego, para el 2, C domina a B (\(6>5\), \(7>2\)). Luego, para el 1, B domina a C (\(4>3\)). Queda \((B,C)\) con \((4,6)\).</li>
<li><b>b)</b> Jugador 1: mínimos por fila 1, 4 y 3, así que su maximin es B con 4. Jugador 2: mínimos por columna 1, 2 y 6, así que su maximin es C con 6.</li>
<li>El perfil maximin coincide con el equilibrio de Nash, y 4 + 6 = 10: hay punto de silla.</li></ol>`,
res:String.raw`<p>EN: \((B,C)\), con 4 y 6 dólares. Las estrategias maximin son B y C: en un juego de suma constante, jugar a la defensiva y jugar Nash es lo mismo.</p>`},

{id:"t1-17",n:"17",t:"Valor de dos juegos de suma cero",tipo:"Maximin y suma cero",temas:["maximin","mixtas"],tool:RT("ej17a"),
enun:String.raw`<p>Calcule el valor y las estrategias de equilibrio de los juegos de suma cero con matrices \(\begin{bmatrix}1&0\\0&1\end{bmatrix}\) y \(\begin{bmatrix}2&3\\1&0\\2&3\end{bmatrix}\) (pagos del jugador fila).</p>`,
saber:[String.raw`Si maximin = minimax en puras, hay punto de silla y ese es el valor. Si no, se busca el maximin en mixtas (teorema minimax de von Neumann).`],
sol:String.raw`<h5>Primera matriz</h5><ol class="steps"><li>Maximin en puras: mínimos por fila 0 y 0, así que 0. Minimax: máximos por columna 1 y 1, así que 1. No hay punto de silla.</li>
<li>Con \(p=\sigma_1(\text{fila }1)\): contra la columna 1 gana \(p\), contra la 2 gana \(1-p\). Igualando, \(p=1/2\). Por simetría, el jugador columna también mezcla \((1/2,1/2)\).</li></ol>
<h5>Segunda matriz</h5><ol class="steps"><li>Mínimos por fila: 2, 0 y 2, así que maximin = 2. Máximos por columna: 2 y 3, así que minimax = 2.</li>
<li>Maximin = minimax = 2: hay punto de silla en (fila 1, columna 1) y en (fila 3, columna 1). <button class="btn" type="button" data-tool="resolvedor" data-pre="ej17b">Abrir la segunda matriz</button></li></ol>`,
res:String.raw`<p>Primera: valor 1/2, ambos mezclan \((1/2,1/2)\). Segunda: valor 2, en puras; el fila juega la fila 1 o la 3 y el columna, la columna 1.</p>`},

{id:"t1-18",n:"18",t:"El penal: maximin, minimax y equilibrio",tipo:"Maximin y suma cero",temas:["maximin","mixtas"],tool:RT("ej18"),
enun:String.raw`<p>El portero (1) se lanza a la izquierda o a la derecha; el pateador (2) patea a la izquierda o a la derecha. Si coinciden, el pateador paga 1 US$ al portero; si no, el portero paga 1 al pateador. Calcule los valores maximin y minimax y halle los equilibrios.</p>`,
saber:[String.raw`Matriz del portero: \(\begin{bmatrix}1&-1\\-1&1\end{bmatrix}\). Es como pares y nones.`],
sol:String.raw`<ol class="steps"><li>Maximin en puras del portero: mínimos −1 y −1, así que −1. Minimax: máximos 1 y 1, así que 1. Como \(-1<1\), no hay equilibrio en puras: el que se mueve de forma predecible pierde.</li>
<li>Mixtas: con \(p=\sigma_1(I)\), el portero gana \(p-(1-p)=2p-1\) si el pateador va a la izquierda y \(1-2p\) si va a la derecha. Igualando, \(p=1/2\). Lo mismo para el pateador.</li></ol>`,
res:String.raw`<p>Maximin −1 y minimax 1 en puras. El único equilibrio es mixto: los dos eligen izquierda o derecha con probabilidad 1/2, y el valor del juego es 0.</p>`},

{id:"t1-19",n:"19",t:"Resúmenes de Myerson (1999) y Rubinstein (1999)",tipo:"Lectura",temas:["nash"],
enun:String.raw`<p>Lea «Nash equilibrium and the history of economic theory» (R. B. Myerson, 1999) y «Experience from a course in game theory: pre- and postclass problem sets as a didactic device» (A. Rubinstein, 1999) y elabore sendos resúmenes breves.</p>`,
saber:[String.raw`Este punto no tiene cálculos: se resuelve leyendo los artículos. Abajo hay una guía de qué buscar, para que el resumen sea tuyo.`],
sol:String.raw`<h5>Myerson (1999), Journal of Economic Literature</h5><ul><li>Tesis: la formulación del equilibrio de Nash fue un cambio fundamental en la economía, porque dio un método general para analizar cualquier situación de interacción estratégica.</li><li>Busca: los antecedentes (Cournot, von Neumann y Morgenstern), qué aportó Nash al separar los juegos no cooperativos de los cooperativos, y por qué el equilibrio se volvió la herramienta común de toda la teoría económica.</li></ul>
<h5>Rubinstein (1999), Games and Economic Behavior</h5><ul><li>Tesis: hacer que los estudiantes respondan problemas antes de ver la teoría y comparar sus respuestas con las predicciones es una buena forma de enseñar teoría de juegos.</li><li>Busca: qué problemas usa, en qué casos las respuestas de los estudiantes se alejan de lo que predice la teoría y qué concluye sobre el papel de la teoría de juegos (si predice conductas o más bien ayuda a razonar sobre situaciones estratégicas).</li></ul>`,
res:String.raw`<p>Para cada artículo: la pregunta que responde, la tesis, dos o tres argumentos o ejemplos, y una conclusión personal sobre lo que implica para el curso. Media página cada uno.</p>`}]});

TALLERES.push({id:"tl-t2",t:"Segundo taller",sub:"Aplicaciones del equilibrio de Nash: Cournot, Bertrand, comunes, bienes públicos, arbitraje",anchor:"continuas",
intro:`Los 13 puntos del segundo taller en orden. Casi todos tienen estrategias continuas: se resuelven con la condición de primer orden y el cruce de las mejores respuestas. Los puntos con tabla (2, 6 y 13) abren el resolvedor.`,
puntos:[
{id:"t2-1",n:"1",t:"Pescadores: planificador frente a equilibrio de Nash",tipo:"Recursos comunes",temas:["comunes","continuas"],tool:{id:"comunes",lbl:"Ir a Recursos comunes"},
enun:String.raw`<p>Cada pescador \(i\) trabaja \(h_i\) horas; \(H=\sum h_i\). El retorno horario \(\rho(H)\) es cóncavo y el costo \(c(h_i)\) es convexo y creciente, idéntico entre pescadores. \(U_i=\rho(H)\,h_i-c(h_i)\). <b>a)</b> Escriba el problema del planificador que maximiza la suma de utilidades y caracterice la solución. <b>b)</b> Formule el juego en forma estratégica, caracterice el equilibrio de Nash y compárelo con el planificador.</p>`,
saber:[String.raw`El planificador internaliza que mis horas bajan el retorno de <i>todos</i>; cada pescador solo el de sus propias horas.`],
sol:String.raw`<ol class="steps"><li><b>a)</b> \(\max_{h_1,\dots,h_n}\sum_{i=1}^n\left[\rho(H)\,h_i-c(h_i)\right]\). Derivando respecto a \(h_i\): \(\rho(H)+\rho'(H)\sum_jh_j-c'(h_i)=0\), es decir \(\rho(H)+\rho'(H)\,H=c'(h_i)\). Por simetría, \(h_i^{**}=H^{**}/n\).</li>
<li><b>b)</b> \(G(\Gamma)=\{N=\{1,\dots,n\},\;S_i=[0,T],\;U_i\}\). Cada uno resuelve \(\max_{h_i}\rho(h_i+H_{-i})h_i-c(h_i)\): \(\rho(H^*)+\rho'(H^*)\,h_i^*=c'(h_i^*)\).</li>
<li>Comparación: como \(\rho'<0\) y \(h_i&lt;H\), el término \(\rho'(H)h_i\) es menos negativo que \(\rho'(H)H\). A cada pescador le parece más barato trabajar una hora más de lo que realmente le cuesta al grupo: \(H^*>H^{**}\).</li></ol>`,
res:String.raw`<p>En el equilibrio se pesca de más: más horas totales y menor retorno por hora que en el óptimo. Es la tragedia de los comunes.</p>`},

{id:"t2-2",n:"2",t:"Cournot con tres niveles de producción",tipo:"Cournot finito",temas:["finitos","nash"],tool:RT("c3"),
enun:String.raw`<p>Cada firma elige \(q_i\in\{1,2,3\}\), con \(P=\max\{7-(q_i+q_j),0\}\) y costo marginal 1. Represente el juego en forma extensiva y estratégica y encuentre el equilibrio de Nash en puras.</p>`,
saber:[String.raw`\(\pi_i=(P-c)\,q_i=(6-q_i-q_j)\,q_i\) mientras el precio sea positivo.`],
sol:String.raw`<ol class="steps"><li>Pagos \((\pi_1,\pi_2)\):<div class="tbl"><table><tr><th></th><th>1</th><th>2</th><th>3</th></tr><tr><th>1</th><td>4, 4</td><td>3, 6</td><td>2, 6</td></tr><tr><th>2</th><td>6, 3</td><td>4, 4</td><td>2, 3</td></tr><tr><th>3</th><td>6, 2</td><td>3, 2</td><td>0, 0</td></tr></table></div></li>
<li>Mejores respuestas del 1: ante 1, 2 o 3 (6); ante 2, 2 (4); ante 3, 1 o 2 (2). Simétrico para el 2.</li>
<li>Celdas con los dos subrayados: \((1,3)\), \((2,2)\) y \((3,1)\).</li>
<li>En forma extensiva, la firma 2 elige sin observar a la 1: sus tres nodos van en un conjunto de información. <button class="btn" type="button" data-tool="arboles" data-pre="c3t">Ver el árbol</button></li></ol>`,
res:String.raw`<p>EN: \((1,3)\), \((2,2)\) y \((3,1)\). El simétrico \((2,2)\) es el Cournot continuo: \(q^*=(7-1)/3=2\).</p>`},

{id:"t2-3",n:"3",t:"Cournot con N empresas",tipo:"Estrategias continuas",temas:["continuas"],tool:{id:"continuas",lbl:"Ir a Cournot y Bertrand"},
enun:String.raw`<p>\(N\) empresas, \(P(Q)=a-bQ\), costo \(c\,q_i\), \(c&lt;a\), deciden simultáneamente sus cantidades. ¿Cuál es el equilibrio de Nash? ¿Qué ocurre si \(N\to\infty\)?</p>`,
saber:[String.raw`Juego simétrico: se resuelve la condición de primer orden de una firma y se impone \(q_i^*=q^*\) para todas.`],
sol:String.raw`<ol class="steps"><li>\(\pi_i=(a-bQ)\,q_i-c\,q_i\). Condición de primer orden: \(a-bQ_{-i}-2bq_i-c=0\), así que \(r_i(Q_{-i})=\frac{a-c-bQ_{-i}}{2b}\).</li>
<li>Con simetría \(Q_{-i}=(N-1)q^*\): \(a-c-b(N-1)q^*-2bq^*=0\Rightarrow q^*=\dfrac{a-c}{(N+1)b}\).</li>
<li>\(Q^*=\dfrac{N(a-c)}{(N+1)b}\), \(P^*=\dfrac{a+Nc}{N+1}\) y \(\pi_i^*=\dfrac{(a-c)^2}{(N+1)^2b}\).</li>
<li>Si \(N\to\infty\): \(P^*\to c\), \(Q^*\to(a-c)/b\) (la cantidad competitiva) y el beneficio de cada firma tiende a 0.</li></ol>`,
res:String.raw`<p>\(q^*=\frac{a-c}{(N+1)b}\) y \(P^*=\frac{a+Nc}{N+1}\). Con muchas firmas, Cournot converge a la competencia perfecta.</p>`},

{id:"t2-4",n:"4",t:"Bertrand en Gibbons (sección 1.2.B)",tipo:"Estrategias continuas",temas:["bertrand","continuas"],tool:{id:"bertrand",lbl:"Ir a Bertrand"},
enun:String.raw`<p>Estudie el modelo de duopolio de Bertrand (Gibbons, cap. 1, sección 1.2.B): su forma estratégica y el equilibrio de Nash en puras.</p>`,
saber:[String.raw`En Gibbons los productos son diferenciados: \(q_i(p_i,p_j)=a-p_i+b\,p_j\), con \(0&lt;b<2\) y costo marginal \(c&lt;a\).`],
sol:String.raw`<ol class="steps"><li>Forma estratégica: \(N=\{1,2\}\), \(S_i=[0,\infty)\) y \(\pi_i(p_i,p_j)=(p_i-c)(a-p_i+b\,p_j)\).</li>
<li>Condición de primer orden: \(a-2p_i+b\,p_j+c=0\), así que \(r_i(p_j)=\frac{a+b\,p_j+c}{2}\): pendiente positiva, los precios son complementos estratégicos.</li>
<li>Equilibrio simétrico: \(p^*=\frac{a+bp^*+c}{2}\Rightarrow p^*=\dfrac{a+c}{2-b}\).</li></ol>`,
res:String.raw`<p>\(p_1^*=p_2^*=\frac{a+c}{2-b}\), por encima del costo: con productos diferenciados no se da la paradoja de Bertrand.</p>`},

{id:"t2-5",n:"5",t:"Bertrand con demanda −pᵢ + pⱼ",tipo:"Estrategias continuas",temas:["bertrand"],tool:{id:"bertrand",lbl:"Ir a Bertrand"},
enun:String.raw`<p>La demanda de la firma \(i\) es \(F_i(p_i,p_j)=-p_i+p_j\) y el costo marginal \(c>0\). <b>a)</b> Represente el juego en forma estratégica y halle el equilibrio de Nash en puras. <b>b)</b> ¿Se mantiene la paradoja de Bertrand?</p>`,
saber:[String.raw`Es el caso \(a=0\), \(b=1\) de la demanda de Gibbons.`],
sol:String.raw`<ol class="steps"><li><b>a)</b> \(N=\{i,j\}\), \(S_i=[0,\infty)\), \(\pi_i=(p_i-c)(p_j-p_i)\). Condición de primer orden: \(p_j-2p_i+c=0\), así que \(r_i(p_j)=\frac{p_j+c}{2}\).</li>
<li>Simetría: \(p^*=\frac{p^*+c}{2}\Rightarrow p^*=c\).</li>
<li><b>b)</b> En equilibrio \(p^*=c\) y el beneficio es 0.</li></ol>`,
res:String.raw`<p>\(p_i^*=p_j^*=c\), con beneficio cero: la paradoja de Bertrand se mantiene, como con bienes homogéneos.</p>`},

{id:"t2-6",n:"6",t:"Cournot finito: mitad del monopolio o Cournot",tipo:"Cournot finito",temas:["finitos","dominancia"],tool:RT("c6"),
enun:String.raw`<p>Cada empresa elige \(q_m^h=\frac{a-c}{4}\) (la mitad del monopolio) o \(q_c=\frac{a-c}{3}\) (Cournot), con \(P=a-Q\) y costo \(c\,q_i\). Muestre que cada empresa tiene una estrategia estrictamente dominada y que ambas están peor en equilibrio que si cooperaran.</p>`,
saber:[String.raw`\(\pi_i=(a-c-q_i-q_j)\,q_i\). Conviene escribir todo en múltiplos de \((a-c)^2\).`],
sol:String.raw`<ol class="steps"><li>Pagos, en múltiplos de \((a-c)^2\):<div class="tbl"><table><tr><th></th><th>\(q_m^h\)</th><th>\(q_c\)</th></tr><tr><th>\(q_m^h\)</th><td>1/8, 1/8</td><td>5/48, 5/36</td></tr><tr><th>\(q_c\)</th><td>5/36, 5/48</td><td>1/9, 1/9</td></tr></table></div> Por ejemplo, \((q_m^h,q_c)\): \(P-c=(a-c)(1-\tfrac14-\tfrac13)=\tfrac{5}{12}(a-c)\), así que \(\pi_1=\tfrac{5}{12}\cdot\tfrac14=\tfrac{5}{48}\).</li>
<li>\(q_c\) domina estrictamente a \(q_m^h\): \(5/36>1/8\) (0,139 frente a 0,125) y \(1/9>5/48\) (0,111 frente a 0,104).</li>
<li>El equilibrio es \((q_c,q_c)\) con \((a-c)^2/9\) cada una, menos que \((a-c)^2/8\) si ambas eligieran \(q_m^h\).</li></ol>`,
res:String.raw`<p>Es un dilema del prisionero: producir la cantidad de Cournot es dominante, pero si cooperaran (mitad del monopolio cada una) ganarían más. Con \(a-c=12\): 16 frente a 18.</p>`},

{id:"t2-7",n:"7",t:"Bien público con u = x · cᵢ⁻¹ y Lindahl-Bowen-Samuelson",tipo:"Bienes públicos",temas:["comunes"],tool:{id:"comunes",lbl:"Ir a Bienes públicos"},
enun:String.raw`<p>Sea \(u_i(x,c_i)=x\cdot c_i^{-1}\), \(i=1,2\), con ponderaciones \(\alpha=(1,1)'\). Suponiendo soluciones interiores (\(c_i^*>0\), \(x^*>0\)), calcule el nivel óptimo de bien público y de contribuciones, \(\big(x^*,(c_i^*)_{i=1,2}\big)\). Verifique la condición de Lindahl-Bowen-Samuelson e interprete.</p>`,
saber:[String.raw`Tecnología del curso: el bien público se financia con las contribuciones, \(x=c_1+c_2\).`,String.raw`<b>Condición LBS:</b> la suma de las tasas marginales de sustitución entre el bien público y la contribución es igual al costo marginal del bien (1): \(\sum_i\frac{\partial u_i/\partial x}{-\partial u_i/\partial c_i}=1\).`],
sol:String.raw`<div class="warn"><b>Así como está escrita, la función no tiene óptimo interior.</b> \(u_i=x/c_i\) <i>sube</i> cuando la contribución baja, así que contribuir es un bien y no un costo. Con \(x=c_1+c_2\), la suma ponderada es \(\frac{c_1+c_2}{c_1}+\frac{c_1+c_2}{c_2}=2+\frac{c_2}{c_1}+\frac{c_1}{c_2}\), que crece sin límite si una contribución tiende a 0. El punto \(c_1=c_2\) es un <i>mínimo</i>, no un máximo. Lo más probable es que haya un error de digitación: conviene confirmar la función con el profesor.</div>
<h5>El procedimiento, con cualquier función bien comportada</h5><ol class="steps"><li>Planificador: \(\max\;\alpha_1u_1(x,c_1)+\alpha_2u_2(x,c_2)\) sujeto a \(x=c_1+c_2\). Sustituye \(x\) y deriva respecto a \(c_1\) y \(c_2\).</li>
<li>Condiciones de primer orden: \(\alpha_1\frac{\partial u_1}{\partial x}+\alpha_2\frac{\partial u_2}{\partial x}=-\alpha_i\frac{\partial u_i}{\partial c_i}\) para cada \(i\).</li>
<li>Dividiendo, sale LBS: \(\sum_i\frac{\partial u_i/\partial x}{-\partial u_i/\partial c_i}=1\): lo que todos juntos valoran una unidad más del bien público debe igualar lo que cuesta.</li>
<li>Por ejemplo, con \(u_i=\ln x-c_i\): \(\frac{1}{x}+\frac1x=1\Rightarrow x^*=2\); cualquier reparto \(c_1+c_2=2\) es eficiente, y con aportes voluntarios cada uno iguala solo su propia tasa, \(1/x=1\), así que \(x^N=1<2\).</li></ol>`,
res:String.raw`<p>Con \(u_i=x\cdot c_i^{-1}\) no existe la solución interior que pide el enunciado. El método es maximizar la suma ponderada con \(x=c_1+c_2\) y verificar que la suma de las tasas marginales de sustitución sea igual a 1.</p>`},

{id:"t2-8",n:"8",t:"Mecanismo de implementación y equilibrio de Lindahl",tipo:"Bienes públicos",temas:["comunes"],
enun:String.raw`<p>Sea \(m^*\) un equilibrio de Nash en puras del mecanismo de implementación del bien público. Muestre que \(\big[(p_i^*),(c_i^*),x^*\big]\) es un equilibrio de Lindahl-Bowen-Samuelson si: <b>a.</b> \(\sum_ip_i^*=\sum_i\left[\frac1N+m_{i+1}^*-m_{i+2}^*\right]=1\); <b>b.</b> \(\sum_ic_i^*=x^*\); <b>c.</b> para cada \(i\), \((x^*,c_i^*)\) resuelve \(\max U_i(x,c_i)\) sujeto a \(p_i^*x=c_i\).</p>`,
saber:[String.raw`Un equilibrio de Lindahl tiene precios personalizados \(p_i\) que suman 1: cada agente paga una fracción del costo y, a esos precios, todos demandan la misma cantidad del bien público.`],
sol:String.raw`<ol class="steps"><li><b>a.</b> Los mensajes se cancelan al sumar sobre todos los agentes (los índices son circulares): \(\sum_i(m_{i+1}^*-m_{i+2}^*)=\sum_im_i^*-\sum_im_i^*=0\), así que \(\sum_ip_i^*=N\cdot\frac1N=1\).</li>
<li><b>b.</b> Con \(c_i^*=p_i^*x^*\), sumando: \(\sum_ic_i^*=x^*\sum_ip_i^*=x^*\). El bien público queda financiado.</li>
<li><b>c.</b> En el equilibrio de Nash del mecanismo, a cada agente le conviene el nivel \(x^*\) dado su precio \(p_i^*\): su condición es \(\frac{\partial U_i/\partial x}{-\partial U_i/\partial c_i}=p_i^*\).</li>
<li>Sumando las condiciones de c y usando a: \(\sum_i\frac{\partial U_i/\partial x}{-\partial U_i/\partial c_i}=\sum_ip_i^*=1\), que es la condición LBS. La asignación es eficiente.</li></ol>`,
res:String.raw`<p>Los precios personalizados suman 1, el bien queda financiado y cada agente optimiza a su precio: el equilibrio de Nash del mecanismo implementa la asignación eficiente de Lindahl.</p>`},

{id:"t2-9",n:"9",t:"Aportes voluntarios a un bien público",tipo:"Bienes públicos",temas:["comunes"],tool:{id:"comunes",lbl:"Ir a Bienes públicos"},
enun:String.raw`<p>Dos agentes con dotación \(w_i\) aportan \(g_i\) a un bien público; consumen \(x_i=w_i-g_i\). La utilidad \(u_i(G,x_i)\) crece en ambos. <b>a.</b> Si \(G=f(g_1+g_2)\), halle las condiciones de primer orden para la eficiencia. <b>b.</b> Si cada uno elige \(g_i\) tomando \(g_j\) como dado, calcule el equilibrio de Nash en puras.</p>`,
saber:[String.raw`Eficiencia: maximizar una suma ponderada de utilidades (o una utilidad sujeta a que la otra no baje).`],
sol:String.raw`<ol class="steps"><li><b>a.</b> Eficiencia: \(\max\;u_1(f(g_1+g_2),w_1-g_1)\) sujeto a \(u_2(f(g_1+g_2),w_2-g_2)\ge\bar u_2\). Las condiciones dan
\[\frac{\partial u_1/\partial G}{\partial u_1/\partial x_1}+\frac{\partial u_2/\partial G}{\partial u_2/\partial x_2}=\frac{1}{f'(g_1+g_2)}\]
La suma de las tasas marginales de sustitución iguala la tasa marginal de transformación (Samuelson).</li>
<li><b>b.</b> Nash: el agente \(i\) resuelve \(\max_{g_i}u_i\big(f(g_i+g_j),w_i-g_i\big)\). Condición: \(f'(G)\,\frac{\partial u_i}{\partial G}=\frac{\partial u_i}{\partial x_i}\), es decir \(\frac{\partial u_i/\partial G}{\partial u_i/\partial x_i}=\frac{1}{f'(G)}\).</li>
<li>El equilibrio es el cruce de las dos mejores respuestas \(g_i=r_i(g_j)\). Cada agente iguala <i>su propia</i> tasa a la de transformación, no la suma: en equilibrio se aporta menos que en el óptimo.</li></ol>`,
res:String.raw`<p>Eficiencia: \(\sum_i\mathrm{TMS}_i=1/f'(G)\). Nash: \(\mathrm{TMS}_i=1/f'(G)\) para cada uno. El equilibrio subprovee el bien público (problema del polizón).</p>`},

{id:"t2-10",n:"10",t:"Arbitraje de oferta final con distribución normal",tipo:"Estrategias continuas",temas:["arbitraje"],tool:{id:"arbitraje",lbl:"Ir a Arbitraje de oferta final"},
enun:String.raw`<p>En el juego de arbitraje de oferta final, el acuerdo ideal del árbitro \(x\) sigue una distribución normal con media \(\mu\) y varianza \(\sigma^2\). Encuentre el equilibrio de Nash en puras y explique los resultados.</p>`,
saber:[String.raw`El árbitro elige la oferta más cercana a \(x\): \(w_f\) si \(x<\frac{w_f+w_g}{2}\). El pago esperado es \(w_fF(\bar w)+w_g[1-F(\bar w)]\), con \(\bar w=\frac{w_f+w_g}{2}\).`],
sol:String.raw`<ol class="steps"><li>La empresa minimiza y el sindicato maximiza el salario esperado. Las condiciones de primer orden son \((w_g-w_f)\tfrac12f(\bar w)=F(\bar w)\) y \((w_g-w_f)\tfrac12f(\bar w)=1-F(\bar w)\).</li>
<li>Igualando: \(F(\bar w)=1/2\), así que el promedio de las ofertas es la mediana de \(x\). Además, \(w_g-w_f=1/f(\bar w)\).</li>
<li>Con la normal, la mediana es \(\mu\) y \(f(\mu)=\frac{1}{\sqrt{2\pi\sigma^2}}\). Entonces \(\bar w=\mu\) y \(w_g-w_f=\sqrt{2\pi\sigma^2}\).</li></ol>`,
res:String.raw`<p>\(w_g^*=\mu+\sqrt{\pi\sigma^2/2}\) y \(w_f^*=\mu-\sqrt{\pi\sigma^2/2}\). Las ofertas se centran en lo que se espera del árbitro y se separan más cuanto mayor es la incertidumbre: ser agresivo cuesta menos probabilidad de ganar cuando el árbitro es impredecible.</p>`},

{id:"t2-11",n:"11",t:"Esfuerzo en una relación",tipo:"Estrategias continuas",temas:["esfuerzo","continuas"],tool:{id:"esfuerzo",lbl:"Ir al laboratorio de esfuerzo"},
enun:String.raw`<p>\(u_1(e_1,e_2)=e_1(c+e_2-e_1)\) y \(u_2(e_1,e_2)=e_2(c+e_1-e_2)\), con \(e_i>0\). <b>a.</b> Halle y grafique las mejores respuestas. <b>b.</b> Calcule y grafique el equilibrio de Nash. <b>c.</b> Halle el bienestar de cada uno en equilibrio.</p>`,
saber:[String.raw`Mejor respuesta: \(\partial u_i/\partial e_i=0\) y se despeja \(e_i\) en función de \(e_j\).`],
sol:String.raw`<ol class="steps"><li><b>a.</b> \(\partial u_1/\partial e_1=c+e_2-2e_1=0\Rightarrow r_1(e_2)=\frac{c+e_2}{2}\); igual, \(r_2(e_1)=\frac{c+e_1}{2}\). Son rectas de pendiente 1/2 que parten de \(c/2\).</li>
<li><b>b.</b> \(e_1=\frac{c+e_2}{2}\) y \(e_2=\frac{c+e_1}{2}\Rightarrow e_1^*=e_2^*=c\): el cruce de las dos rectas.</li>
<li><b>c.</b> \(u_1^*=c(c+c-c)=c^2=u_2^*\).</li></ol>`,
res:String.raw`<p>EN: \(e_1^*=e_2^*=c\), con bienestar \(c^2\) cada uno. Si ambos pusieran \(c+k\) con \(0&lt;k&lt;c\), tendrían \((c+k)c>c^2\): en equilibrio se esfuerzan menos de lo que les convendría a los dos.</p>`},

{id:"t2-12",n:"12",t:"Bertrand con productos diferenciados",tipo:"Estrategias continuas",temas:["bertrand","continuas"],tool:{id:"bertrand",lbl:"Ir a Bertrand"},
enun:String.raw`<p>\(q_1=a-p_1+p_2\) y \(q_2=a-p_2+p_1\), costo marginal \(c\), sin costos fijos. <b>(a)</b> Represente el juego en forma estratégica. <b>(b)</b> Halle y grafique las mejores respuestas. <b>(c)</b> Calcule el equilibrio de Nash.</p>`,
saber:[String.raw`Es el modelo de Gibbons con \(b=1\).`],
sol:String.raw`<ol class="steps"><li><b>(a)</b> \(N=\{1,2\}\), \(S_i=[c,\infty)\) y \(\pi_i(p_i,p_j)=(p_i-c)(a-p_i+p_j)\).</li>
<li><b>(b)</b> Condición de primer orden: \(a-2p_i+p_j+c=0\Rightarrow r_i(p_j)=\frac{a+c+p_j}{2}\): rectas de pendiente 1/2 que parten de \(\frac{a+c}{2}\).</li>
<li><b>(c)</b> Simetría: \(p^*=\frac{a+c+p^*}{2}\Rightarrow p^*=a+c\). Cantidad: \(q^*=a-(a+c)+(a+c)=a\). Beneficio: \(\pi^*=(a+c-c)\,a=a^2\).</li></ol>`,
res:String.raw`<p>\(p_1^*=p_2^*=a+c\), \(q^*=a\) y \(\pi^*=a^2\): el precio queda por encima del costo porque cada firma conserva clientes aunque cobre un poco más.</p>`},

{id:"t2-13",n:"13",t:"Harrison y Rutström (1991): guerras comerciales",tipo:"Lectura y forma extensiva",temas:["finitos","representacion"],tool:RT("hr"),
enun:String.raw`<p>Según «Trade Wars, Trade Negotiations and Applied Game Theory» (Harrison y Rutström, 1991): <b>a.</b> Explique el juego de la Tabla I (p. 421): contexto, jugadores, espacio de estrategias y pagos. <b>b.</b> Represéntelo en forma extensiva.</p>`,
saber:[String.raw`Los pagos son cambios en el bienestar anual frente al statu quo, en miles de millones de dólares.`],
sol:String.raw`<ol class="steps"><li><b>a. Contexto:</b> negociaciones comerciales entre Estados Unidos y la Comunidad Europea. <b>Jugadores:</b> EE. UU. y la CE. <b>Estrategias:</b> mantener (K) la protección actual o abolir (A) las barreras a las importaciones del otro. <b>Pagos:</b> variación equivalente frente al statu quo, de simulaciones de equilibrio general:<div class="tbl"><table><tr><th></th><th>K</th><th>A</th></tr><tr><th>K</th><td>0, 0</td><td>0,85, −3,85</td></tr><tr><th>A</th><td>−3,31, 1,06</td><td>1,46, 0,62</td></tr></table></div></li>
<li>K es dominante para la CE (\(0>-3{,}85\) y \(1{,}06>0{,}62\)); dado K, EE. UU. también prefiere K. El equilibrio de Nash es \((K,K)\), aunque \((A,A)\) les da más a los dos: es un dilema del prisionero.</li>
<li><b>b.</b> En forma extensiva, EE. UU. mueve primero y la CE elige sin observarlo: sus dos nodos van en un conjunto de información. <button class="btn" type="button" data-tool="arboles" data-pre="hrt">Ver el árbol</button></li></ol>`,
res:String.raw`<p>Juego simultáneo 2 × 2 entre EE. UU. y la CE con equilibrio \((K,K)\): ambos mantienen la protección aunque liberalizar juntos los beneficiaría. Los autores usan ese equilibrio como punto de referencia para medir el costo de la protección y el poder de negociación.</p>`}]});

// ---------------------------------------------------------------------
// TERCER TALLER (mayo de 2026): juegos dinámicos, EPS, EBP, Stackelberg y negociación
// ---------------------------------------------------------------------
const CR=(pre,l)=>({id:"creencias",pre,lbl:l||"Abrir en el Resolvedor de árboles con creencias"});
const T3TAB=(cols,rows)=>`<div class="tbl"><table><tr><th></th>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>${rows.map(([r,...cs])=>`<tr><th>${r}</th>${cs.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
TALLERES.push({id:"tl-t3",t:"Tercer taller",sub:"Juegos dinámicos: EN, EPS y EBP en árboles, Stackelberg, sindicato y negociación",anchor:"eps",
intro:`Los 11 puntos del tercer taller en orden, con la notación del curso: N, Sᵢ, πᵢ, EN, EPS, EBP y μ para las creencias. En los juegos con árbol el método es siempre el mismo: <b>1)</b> escribir las estrategias (una acción por cada conjunto de información del jugador), <b>2)</b> armar la forma estratégica y sacar los EN, <b>3)</b> buscar los subjuegos propios y resolver hacia atrás para los EPS, <b>4)</b> si hay conjuntos con varios nodos, poner creencias μ y revisar racionalidad secuencial para los EBP. Los equilibrios se verificaron revisando todos los perfiles en puras; los botones abren el árbol en el resolvedor.`,
puntos:[
{id:"t3-1",n:"1",t:"Entrada al mercado: EN y EPS",tipo:"EPS y amenazas no creíbles",temas:["representacion","secuencial","eps"],tool:CR("ent"),
enun:String.raw`<p>La firma 1 decide si entra al mercado ocupado por la firma 2. Si entra, la 2 pelea o concede. El monopolio da 2 millones de US$: la 2 los conserva si la 1 no entra y los reparte si concede; si pelea, ambas pierden 1 millón. <b>a.</b> Represente el juego en forma extensiva y estratégica. <b>b.</b> Halle todos los equilibrios. <b>c.</b> Halle todos los EPS.</p>`,
saber:[String.raw`<b>EN:</b> perfil en el que ningún jugador gana desviándose solo. Se buscan en la forma estratégica.`,String.raw`<b>EPS:</b> perfil que induce un EN en <i>cada</i> subjuego. En juegos con información perfecta se halla por inducción hacia atrás.`,String.raw`<b>Amenaza no creíble:</b> una acción que el jugador no tomaría si de verdad le tocara mover. Sostiene EN, pero no EPS.`],
sol:String.raw`<ol class="steps"><li><b>a. Forma extensiva:</b> la firma 1 elige E (entrar) o NE. NE termina en \((0,2)\). E lleva al nodo de la firma 2, que elige P (pelear), con \((-1,-1)\), o C (conceder), con \((1,1)\).</li>
<li><b>Forma estratégica:</b> \(N=\{1,2\}\), \(S_1=\{E,NE\}\), \(S_2=\{P,C\}\).${T3TAB(["P","C"],[["E","−1, −1","<b>1, 1</b>"],["NE","<b>0, 2</b>","0, 2"]])}</li>
<li><b>b. EN:</b> \((E,C)\): la 1 gana 1 &gt; 0 y la 2 gana 1 &gt; −1. \((NE,P)\): la 1 gana 0 &gt; −1; la 2 gana 2 con P o con C, porque no le toca mover. \(EN=\{(E,C),(NE,P)\}\).</li>
<li><b>c. EPS:</b> el único subjuego propio empieza en el nodo de la firma 2. Ahí C da 1 y P da −1: elige C. La 1 anticipa \((1,1)\) frente a \((0,2)\) y entra.</li></ol>`,
res:String.raw`<p>\(EN=\{(E,C),(NE,P)\}\) y \(EPS=\{(E,C)\}\). \((NE,P)\) es EN porque la amenaza de pelear disuade la entrada, pero no es creíble: si la 1 entra, pelear le cuesta a la 2.</p>`},

{id:"t3-2",n:"2",t:"Norte o Sur: la empresa 2 observa a la 1",tipo:"EN y EPS",temas:["secuencial","eps"],tool:CR("ns"),
enun:String.raw`<p>Dos firmas eligen dónde poner su centro de I+D, Norte o Sur. Les conviene la misma zona, pero la 1 prefiere el Norte y la 2 el Sur. En simultáneo: (N, N) = (4, 3), (N, S) = (2, 2), (S, N) = (1, 1), (S, S) = (3, 4). Ahora la empresa 1 decide primero y la 2 observa. <b>a.</b> Halle todos los EN. <b>b.</b> Halle todos los EPS.</p>`,
saber:[String.raw`Si la 2 observa a la 1, tiene dos nodos y su estrategia dice qué hace en <b>cada</b> uno: \((\text{tras }N,\ \text{tras }S)\). Pasa de 2 a 4 estrategias.`],
sol:String.raw`<ol class="steps"><li><b>Estrategias:</b> \(S_1=\{N,S\}\), \(S_2=\{(N,N),(N,S),(S,N),(S,S)\}\), donde la primera letra es lo que hace la 2 tras N y la segunda, tras S.</li>
<li><b>Forma estratégica:</b>${T3TAB(["(N,N)","(N,S)","(S,N)","(S,S)"],[["N","<b>4, 3</b>","<b>4, 3</b>","2, 2","2, 2"],["S","1, 1","3, 4","1, 1","<b>3, 4</b>"]])}</li>
<li><b>a. EN:</b> \((N,(N,N))\), \((N,(N,S))\) y \((S,(S,S))\). En \((S,(S,S))\) la 2 «amenaza» con ir al Sur aunque la 1 vaya al Norte, y así la 1 se resigna al Sur.</li>
<li><b>b. EPS por inducción hacia atrás:</b> tras N, la 2 elige N (3 &gt; 2); tras S, elige S (4 &gt; 1). Su estrategia es \((N,S)\). La 1 compara N, que le da 4, con S, que le da 3, y elige N.</li></ol>`,
res:String.raw`<p>\(EN=\{(N,(N,N)),(N,(N,S)),(S,(S,S))\}\) y \(EPS=\{(N,(N,S))\}\), con pagos \((4,3)\). Mover primero le da ventaja a la empresa 1; la amenaza de \((S,S)\) no es creíble porque tras N la 2 prefiere N.</p>`},

{id:"t3-3",n:"3",t:"Figura 1: EN poco razonable y EPS",tipo:"EN y EPS",temas:["subjuegos","eps","mixtas"],tool:CR("f1"),
enun:String.raw`<p>En la Figura 1, el jugador 1 elige A o B; el 2 elige X o Y sin saber qué hizo el 1 (sus dos nodos están unidos). Tras A y X, el 1 vuelve a mover: C da (1, 0) y D da (2, 10). Tras A e Y: (5, 5). Tras B: X da (8, 3) e Y da (3, 8). Halle todos los perfiles en estrategias puras que son <b>(a)</b> EN, discutiendo su razonabilidad, y <b>(b)</b> EPS.</p>`,
saber:[String.raw`El jugador 1 mueve en dos conjuntos de información (la raíz y el nodo tras A, X), así que sus estrategias son pares: \(S_1=\{(A,C),(A,D),(B,C),(B,D)\}\).`,String.raw`Un subjuego propio empieza en un nodo que es un conjunto de información por sí solo y no corta ningún conjunto de información.`],
sol:String.raw`<ol class="steps"><li><b>Forma estratégica</b> (\(S_2=\{X,Y\}\)):${T3TAB(["X","Y"],[["(A, C)","1, 0","<b>5, 5</b>"],["(A, D)","2, 10","5, 5"],["(B, C)","8, 3","3, 8"],["(B, D)","8, 3","3, 8"]])}</li>
<li><b>a. EN:</b> contra X, el 1 prefiere B (8); contra Y, prefiere jugar A (5). Contra \((A,C)\) el 2 prefiere Y; contra \((A,D)\), X; contra B, Y. El único cruce es \(((A,C),Y)\).</li>
<li><b>Razonabilidad:</b> no es razonable. El 2 juega Y porque cree que, si juega X, el 1 elegiría C y él recibiría 0. Pero si se llegara a ese nodo, el 1 elegiría D (2 &gt; 1): C es una amenaza no creíble.</li>
<li><b>b. EPS:</b> el subjuego propio es el último nodo del 1, donde elige D. Se reemplaza ese nodo por \((2,10)\) y queda un juego simultáneo: A con X da (2, 10), A con Y (5, 5), B con X (8, 3) y B con Y (3, 8). No tiene equilibrio en puras: el 1 quiere B contra X y A contra Y; el 2 quiere X contra A e Y contra B.</li></ol>`,
res:String.raw`<p>\(EN=\{((A,C),Y)\}\), que se sostiene en una amenaza no creíble. <b>No hay EPS en estrategias puras.</b> En mixtas, el 1 juega A con probabilidad 1/2 (deja al 2 indiferente: \(10p+3(1-p)=5p+8(1-p)\)) y el 2 juega X con probabilidad 1/4 (deja al 1 indiferente: \(2x+5(1-x)=8x+3(1-x)\)). El EPS es \(\big((\tfrac12A+\tfrac12B,\ D),\ \tfrac14X+\tfrac34Y\big)\), con pagos esperados \((17/4,\ 13/2)\).</p>`},

{id:"t3-4",n:"4",t:"Figura 2: EN, EPS y EBP",tipo:"EBP",temas:["subjuegos","eps","ebp"],tool:CR("f2"),
enun:String.raw`<p>En la Figura 2, el 1 elige C, que termina en (3, 2), o B o A. El 2 no distingue si el 1 jugó B o A. Tras B: b da (3, 1) y a da (0, 2). Tras A: b da (0, 0) y a da (3, 1). Halle todos los perfiles en estrategias puras que son <b>a.</b> EN, <b>b.</b> EPS y <b>c.</b> EBP.</p>`,
saber:[String.raw`<b>EBP:</b> estrategias más creencias \(\mu\) tales que (1) cada jugador elige lo mejor dado lo que cree en cada conjunto de información (racionalidad secuencial) y (2) en la trayectoria, las creencias salen de la regla de Bayes. Fuera de la trayectoria, \(\mu\) puede ser cualquiera.`],
sol:String.raw`<ol class="steps"><li><b>Forma estratégica:</b> \(S_1=\{C,B,A\}\), \(S_2=\{a,b\}\).${T3TAB(["a","b"],[["C","<b>3, 2</b>","<b>3, 2</b>"],["B","0, 2","3, 1"],["A","<b>3, 1</b>","0, 0"]])}</li>
<li><b>a. EN:</b> \((C,a)\), \((C,b)\) y \((A,a)\). En las dos con C el 2 no mueve y le da igual a o b.</li>
<li><b>b. EPS:</b> el conjunto de información del 2 tiene dos nodos, así que no hay subjuegos propios: el único subjuego es el juego completo y \(EPS=EN\).</li>
<li><b>c. EBP:</b> sea \(\mu\) la creencia del 2 de estar en el nodo tras B. Pagos esperados del 2: \(\pi_2(a)=2\mu+1\cdot(1-\mu)=1+\mu\) y \(\pi_2(b)=1\cdot\mu+0\cdot(1-\mu)=\mu\). Como \(1+\mu&gt;\mu\) para todo \(\mu\), el 2 siempre juega a: \((C,b)\) no es secuencialmente racional.</li>
<li>\((C,a)\): el conjunto del 2 queda fuera de la trayectoria, así que cualquier \(\mu\) sirve. \((A,a)\): el conjunto está en la trayectoria y Bayes da \(\mu=0\) (el 1 jugó A con certeza).</li></ol>`,
res:String.raw`<p>\(EN=EPS=\{(C,a),(C,b),(A,a)\}\). \(EBP=\{(C,a)\) con \(\mu\in[0,1]\); \((A,a)\) con \(\mu=0\}\).</p>`},

{id:"t3-5",n:"5",t:"Figura 3: EN, EPS y EBP",tipo:"EBP",temas:["subjuegos","eps","ebp"],tool:CR("f3"),
enun:String.raw`<p>En la Figura 3, el 1 elige A, que termina en (1, 3), o B o C. El 2 no distingue si el 1 jugó B o C. Tras B: a da (0, 1) y b da (0, 2). Tras C: a da (0, 0) y b da (2, 1). Halle todos los perfiles en estrategias puras que son <b>a.</b> EN, <b>b.</b> EPS y <b>c.</b> EBP.</p>`,
saber:[String.raw`Si una acción es estrictamente mejor para el jugador sin importar la creencia, el EBP la exige aunque el conjunto esté fuera de la trayectoria.`],
sol:String.raw`<ol class="steps"><li><b>Forma estratégica:</b>${T3TAB(["a","b"],[["A","<b>1, 3</b>","1, 3"],["B","0, 1","0, 2"],["C","0, 0","<b>2, 1</b>"]])}</li>
<li><b>a. EN:</b> \((A,a)\): contra a, A da 1 y lo demás 0; contra A, al 2 le da igual. \((C,b)\): contra b, C da 2; contra C, b da 1 &gt; 0.</li>
<li><b>b. EPS:</b> no hay subjuegos propios (el conjunto del 2 une los nodos tras B y C), así que \(EPS=EN\).</li>
<li><b>c. EBP:</b> con \(\mu\) la creencia en el nodo tras B: \(\pi_2(a)=1\cdot\mu+0=\mu\) y \(\pi_2(b)=2\mu+1\cdot(1-\mu)=1+\mu\). b es mejor para cualquier \(\mu\), así que \((A,a)\) no es EBP. En \((C,b)\) el conjunto está en la trayectoria y Bayes da \(\mu=0\).</li></ol>`,
res:String.raw`<p>\(EN=EPS=\{(A,a),(C,b)\}\) y \(EBP=\{(C,b)\) con \(\mu=0\}\). \((A,a)\) se apoya en que el 2 jugaría a, que nunca es óptimo.</p>`},

{id:"t3-6",n:"6",t:"Figuras 4 y 5: EPS",tipo:"EPS",temas:["subjuegos","eps","tres"],tool:CR("f4","Abrir la Figura 4 en el resolvedor"),
enun:String.raw`<p><b>Figura 4</b> (tres jugadores): el 1 elige C o B. Tras C, el 2 elige C′, que da (1, 1, 1), o B′. El 3 mueve tras B o tras B′ sin saber cuál ocurrió y elige I o D: tras B, I da (3, 2, 2) y D da (0, 0, 0); tras B′, I da (4, 4, 0) y D da (0, 0, 1). <b>Figura 5:</b> el 1 elige B, que da (1, 0), o A. Tras A, el 2 elige a o b y el 1, sin observarlo, elige C o D: (a, C) = (3, −1), (a, D) = (1, −2), (b, C) = (0, −3), (b, D) = (0, 0). Halle todos los perfiles estratégicos que son EPS.</p>`,
saber:[String.raw`Un nodo inicia un subjuego solo si todo lo que viene después queda adentro sin cortar ningún conjunto de información. Si no hay subjuegos propios, \(EPS=EN\).`],
sol:String.raw`<ol class="steps"><li><b>Figura 4. Subjuegos:</b> el nodo del 2 no inicia subjuego, porque el conjunto del 3 une su nodo con el nodo tras B, que queda afuera. El único subjuego es el juego completo: \(EPS=EN\).</li>
<li><b>EN de la Figura 4</b> (tablas del 1 contra el 2, una por cada acción del 3):${T3TAB(["C′","B′"],[["C (3 juega I)","1, 1, 1","4, 4, 0"],["B (3 juega I)","<b>3, 2, 2</b>","3, 2, 2"]])}${T3TAB(["C′","B′"],[["C (3 juega D)","<b>1, 1, 1</b>","0, 0, 1"],["B (3 juega D)","0, 0, 0","0, 0, 0"]])}\((B,C',I)\): el 1 pierde si cambia a C (1 &lt; 3), al 2 no le toca y el 3 pierde con D (0 &lt; 2). \((C,C',D)\): el 1 pierde con B (0 &lt; 1), el 2 pierde con B′ (0 &lt; 1) y al 3 no le toca. Los demás perfiles fallan.</li>
<li><b>Figura 5. Subjuegos:</b> el nodo del 2 tras A sí inicia un subjuego, porque el conjunto del 1 que viene después queda completo adentro. Ese subjuego es simultáneo:${T3TAB(["a","b"],[["C","<b>3, −1</b>","0, −3"],["D","1, −2","<b>0, 0</b>"]])}Tiene dos EN en puras: \((C,a)\), con pagos (3, −1), y \((D,b)\), con pagos (0, 0).</li>
<li><b>Hacia atrás:</b> si en el subjuego se juega \((C,a)\), el 1 compara A (3) con B (1) y elige A. Si se juega \((D,b)\), compara A (0) con B (1) y elige B.</li></ol>`,
res:String.raw`<p><b>Figura 4:</b> \(EPS=\{(C,C',D),(B,C',I)\}\). <b>Figura 5:</b> \(EPS=\{((A,C),a),\ ((B,D),b)\}\). El EN \(((B,C),b)\) de la Figura 5 no es EPS: en el subjuego, C no es mejor respuesta a b. Si se admiten mixtas en la Figura 5, también son EPS los perfiles en que el 1 juega B y, en el subjuego, C con probabilidad \(p\le1/2\) mientras el 2 juega b.</p>
<p><button class="btn" type="button" data-tool="creencias" data-pre="f5">Abrir la Figura 5 en el resolvedor →</button></p>`},

{id:"t3-7",n:"7",t:"Sindicato y empresa",tipo:"Inducción hacia atrás con estrategias continuas",temas:["sindicato","secuencial","continuas"],tool:{id:"sindicato",lbl:"Ir a Sindicato y empresa"},
enun:String.raw`<p>El sindicato fija el salario \(w\) y la empresa, después de observarlo, elige el empleo \(L\). \(U(w,L)\) es la utilidad del sindicato, creciente en ambos argumentos; \(\pi(w,L)\) es el beneficio de la empresa y \(I(L)\), su ingreso, es creciente y cóncavo. <b>a.</b> Represente el juego en forma extensiva. <b>b.</b> Caracterice la mejor respuesta de la empresa en la etapa 2 ante una demanda salarial arbitraria.</p>`,
saber:[String.raw`Con estrategias continuas, la forma extensiva tiene un «abanico» de ramas: una por cada valor posible.`,String.raw`La mejor respuesta de quien mueve segundo es una <b>función</b> de lo que observó.`],
sol:String.raw`<ol class="steps"><li><b>a.</b> \(N=\{\text{sindicato},\ \text{empresa}\}\). En la raíz el sindicato elige \(w\in[0,\infty)\): sale un abanico continuo de ramas. Al final de cada \(w\) hay un nodo de la empresa (conjunto de información unitario, porque observa \(w\)), que elige \(L\in[0,\infty)\). Cada nodo terminal tiene pagos \((U(w,L),\ \pi(w,L))\), con \(\pi(w,L)=I(L)-wL\).</li>
<li><b>b.</b> Para cada \(w\): \(\max_{L\ge0}\ \pi(w,L)=I(L)-wL\). Condición de primer orden: \(I'(L)-w=0\). La mejor respuesta \(L^*(w)\) cumple</li></ol>
<div class="mj">\[I'\big(L^*(w)\big)=w\]</div>
<p>Como \(I''&lt;0\), la condición de segundo orden se cumple y, derivando, \(\frac{dL^*}{dw}=\frac1{I''(L^*)}&lt;0\): la mejor respuesta es la demanda de trabajo, decreciente en \(w\). Si \(I'(0)\le w\), la empresa no contrata: \(L^*(w)=0\).</p>`,
res:String.raw`<p>La empresa contrata hasta que el ingreso marginal del trabajo iguala el salario: \(I'(L^*(w))=w\), con \(L^*\) decreciente en \(w\). Hacia atrás, el sindicato resuelve \(\max_w U(w,L^*(w))\): elige el punto de la demanda de trabajo tangente a su curva de indiferencia.</p>`},

{id:"t3-8",n:"8",t:"Stackelberg con P(Q) = max[M − dQ, 0]",tipo:"EPS con estrategias continuas",temas:["stackelberg","continuas","secuencial"],tool:{id:"stackelberg",lbl:"Ir a Stackelberg"},
enun:String.raw`<p>Duopolio con \(C_i(q_i)=cq_i\), \(c&gt;0\), y \(P(Q)=\max[M-dQ,0]\), \(M,d&gt;0\). La firma 1 elige su producto en el primer escenario; la firma 2 lo observa y elige el suyo en el segundo. Calcule el EPS.</p>`,
saber:[String.raw`La estrategia de la seguidora es una función \(s_2:\mathbb{R}_+\to\mathbb{R}_+\). El EPS es \((\tilde q_1,\ \tilde s_2(\cdot))\), no solo dos números.`],
sol:String.raw`<ol class="steps"><li><b>Segundo escenario:</b> dado \(q_1\), la firma 2 resuelve \(\max_{q_2}\ [M-d(q_1+q_2)]q_2-cq_2\). CPO: \(M-dq_1-2dq_2-c=0\):</li></ol>
<div class="mj">\[\tilde s_2(q_1)=\frac{M-c-dq_1}{2d}\]</div>
<ol class="steps" start="2"><li><b>Primer escenario:</b> la firma 1 anticipa \(\tilde s_2\) y resuelve \(\max_{q_1}\ \big[M-d\big(q_1+\tfrac{M-c-dq_1}{2d}\big)\big]q_1-cq_1=\tfrac{M-c-dq_1}{2}\,q_1\). CPO: \(\tfrac{M-c}{2}-dq_1=0\).</li></ol>
<div class="mj">\[\tilde q_1=\frac{M-c}{2d},\qquad \tilde q_2=\tilde s_2(\tilde q_1)=\frac{M-c}{4d},\qquad P=\frac{M+3c}{4}\]</div>
<div class="mj">\[\pi_1=\frac{(M-c)^2}{8d},\qquad \pi_2=\frac{(M-c)^2}{16d}\]</div>`,
res:String.raw`<p>\(EPS=\Big(\tilde q_1=\frac{M-c}{2d},\ \ \tilde s_2(q_1)=\frac{M-c-dq_1}{2d}\Big)\), suponiendo \(M&gt;c\). Frente a Cournot (\(q_i=\frac{M-c}{3d}\)), la líder produce más y gana más, y la seguidora produce menos.</p>`},

{id:"t3-9",n:"9",t:"Figura 6: EN y EPS",tipo:"EN y EPS",temas:["subjuegos","eps"],tool:CR("f6"),
enun:String.raw`<p>En la Figura 6, el 1 elige Z, X o Y. Tras Z o X, el 2 elige R o L sin saber cuál fue (nodos unidos). Z: R da (1, 1) y L da (0, 0). X: R da (0, 0); L lleva a un nodo del 1, donde B da (3, 2) y A da (1, 2). Y: el 2 lo observa y elige R, con (2, 2), o L, con (2, 3). Halle todos los perfiles en estrategias puras que son <b>a.</b> EN y <b>b.</b> EPS.</p>`,
saber:[String.raw`Cada jugador tiene una acción por cada conjunto de información: el 1 tiene dos (la raíz y el nodo tras X, L) y el 2 también (el conjunto unido y el nodo tras Y).`],
sol:String.raw`<ol class="steps"><li><b>Estrategias:</b> \(S_1=\{Z,X,Y\}\times\{B,A\}\) y \(S_2=\{R,L\}\times\{R,L\}\), donde la primera letra del 2 es lo que hace en el conjunto unido y la segunda, tras Y.</li>
<li><b>Forma estratégica:</b>${T3TAB(["(R,R)","(R,L)","(L,R)","(L,L)"],[["(Z, B)","1, 1","1, 1","0, 0","0, 0"],["(Z, A)","1, 1","1, 1","0, 0","0, 0"],["(X, B)","0, 0","0, 0","<b>3, 2</b>","<b>3, 2</b>"],["(X, A)","0, 0","0, 0","1, 2","1, 2"],["(Y, B)","2, 2","<b>2, 3</b>","2, 2","2, 3"],["(Y, A)","2, 2","<b>2, 3</b>","2, 2","2, 3"]])}</li>
<li><b>a. EN:</b> revisando cada celda, se sostienen \(((X,B),(L,R))\), \(((X,B),(L,L))\), \(((Y,B),(R,L))\) y \(((Y,A),(R,L))\).</li>
<li><b>b. EPS:</b> hay dos subjuegos propios. En el nodo del 1 tras X, L, elige B (3 &gt; 1). En el nodo del 2 tras Y, elige L (3 &gt; 2). Se reemplazan por (3, 2) y (2, 3), y queda un juego simultáneo entre el 1 (Z, X, Y) y el 2 en su conjunto (R, L):${T3TAB(["R","L"],[["Z","1, 1","0, 0"],["X","0, 0","<b>3, 2</b>"],["Y","<b>2, 3</b>","2, 3"]])}Sus EN son \((X,L)\) e \((Y,R)\).</li></ol>`,
res:String.raw`<p>\(EN=\{((X,B),(L,R)),\ ((X,B),(L,L)),\ ((Y,B),(R,L)),\ ((Y,A),(R,L))\}\). \(EPS=\{((X,B),(L,L)),\ ((Y,B),(R,L))\}\). Los otros dos EN fallan en un subjuego: \((L,R)\) tiene al 2 eligiendo R tras Y, y \((Y,A)\) tiene al 1 eligiendo A en su último nodo.</p>`},

{id:"t3-10",n:"10",t:"Negociación con T = 3 y descuentos δ₁, δ₂",tipo:"Negociación",temas:["negociacion","secuencial"],tool:{id:"negociacion",lbl:"Ir a Negociación"},
enun:String.raw`<p>Considere el juego de negociación de Stahl (1972) y Rubinstein (1982) analizado en clase. Explique detalladamente el EPS con \(T=3\) rondas si cada jugador tiene un factor de descuento distinto, \(\delta_1\) y \(\delta_2\).</p>`,
saber:[String.raw`Se reparte 1 peso. En los períodos impares propone el 1 y en los pares el 2; el otro acepta o rechaza. Si en los dos primeros no hay acuerdo, en el tercero el reparto es \((s,1-s)\). \(x_t\) es la parte del 1 en el período \(t\).`,String.raw`Quien responde acepta si lo que le ofrecen es al menos lo que vale, hoy, esperar al siguiente período. Quien propone le ofrece justo eso.`],
sol:String.raw`<ol class="steps"><li><b>Período 3:</b> el reparto es \((s,\ 1-s)\).</li>
<li><b>Período 2 (propone el 2):</b> si el 1 rechaza, recibe \(s\) en el período 3, que hoy vale \(\delta_1 s\). Acepta cualquier \(x_2\ge\delta_1 s\). Al 2 le conviene ofrecer lo mínimo: \(x_2=\delta_1 s\), y se queda con \(1-\delta_1 s\), que es más de lo que lograría esperando (\(\delta_2(1-s)\)).</li>
<li><b>Período 1 (propone el 1):</b> si el 2 rechaza, se lleva \(1-\delta_1 s\) en el período 2, que hoy vale \(\delta_2(1-\delta_1 s)\). El 1 le ofrece justo eso:</li></ol>
<div class="mj">\[1-x_1^*=\delta_2\,(1-\delta_1 s)\qquad\Rightarrow\qquad x_1^*=1-\delta_2+\delta_1\delta_2\,s\]</div>
<p>El EPS completo dice qué hace cada uno en cada nodo: en el período 1 el 1 ofrece \((x_1^*,1-x_1^*)\) y el 2 acepta cualquier oferta que le dé al menos \(\delta_2(1-\delta_1s)\); en el período 2 el 2 ofrece \((\delta_1 s,\,1-\delta_1s)\) y el 1 acepta si recibe al menos \(\delta_1 s\).</p>`,
res:String.raw`<p>Hay acuerdo inmediato en el período 1: el 1 se lleva \(x_1^*=1-\delta_2+\delta_1\delta_2 s\) y el 2, \(\delta_2(1-\delta_1 s)\). Si el 2 es más impaciente (\(\delta_2\) bajo), el 1 se lleva más; si el 1 es más impaciente (\(\delta_1\) bajo), el 2 le ofrece menos en el período 2 y eso le resta al 1 en el período 1.</p>`},

{id:"t3-11",n:"11",t:"Negociación con T = 3, con T rondas y con T → ∞",tipo:"Negociación",temas:["negociacion","secuencial"],tool:{id:"negociacion",lbl:"Ir a Negociación"},
enun:String.raw`<p>Considere el juego de negociación de Stahl (1972) y Rubinstein (1982) analizado en clase. Halle el EPS con \(t=3\) rondas de negociación y después de \(t=T\) rondas. ¿Qué pasa cuando \(T\to\infty\)?</p>`,
saber:[String.raw`Con un descuento común \(\delta\), dos pasos hacia atrás (uno en que propone el 2 y otro en que propone el 1) dan la regla \(x_t=1-\delta+\delta^2x_{t+2}\).`],
sol:String.raw`<ol class="steps"><li><b>T = 3:</b> es el punto 10 con \(\delta_1=\delta_2=\delta\):</li></ol>
<div class="mj">\[x_1^*=1-\delta+\delta^2 s\]</div>
<ol class="steps" start="2"><li><b>T rondas:</b> si en la última ronda quien propone se queda con todo, \(x_T=1\) si \(T\) es impar (propone el 1) y \(x_T=0\) si es par. Aplicando \(x_t=1-\delta+\delta^2x_{t+2}\) hasta llegar a \(x_T\):</li></ol>
<div class="mj">\[x_1^*(T)=\frac{1-(-\delta)^T}{1+\delta}\]</div>
<p>Comprobación: con \(T=3\), \(\frac{1+\delta^3}{1+\delta}=1-\delta+\delta^2\), que es el resultado anterior con \(s=1\).</p>
<ol class="steps" start="3"><li><b>T → ∞:</b> como \(0&lt;\delta&lt;1\), \((-\delta)^T\to0\) y el último período deja de importar:</li></ol>
<div class="mj">\[x_1^*=\frac1{1+\delta},\qquad 1-x_1^*=\frac{\delta}{1+\delta}\]</div>
<p>Es el argumento de Shaked y Sutton que usa Gibbons: el juego que empieza en el período 3 es idéntico al que empieza en el 1. Si el 1 obtiene \(s\) desde el período 3, obtiene \(1-\delta+\delta^2s\) desde el 1; como los dos juegos son iguales, \(s=1-\delta+\delta^2 s\), y por lo tanto \(s=\frac{1}{1+\delta}\). Con descuentos distintos, el mismo razonamiento da \(x_1^*=\frac{1-\delta_2}{1-\delta_1\delta_2}\).</p>`,
res:String.raw`<p>\(T=3\): \(x_1^*=1-\delta+\delta^2s\). \(T\) rondas: \(x_1^*=\frac{1-(-\delta)^T}{1+\delta}\). \(T\to\infty\): \(x_1^*=\frac1{1+\delta}&gt;\frac12\), con acuerdo inmediato. Proponer primero da ventaja, que desaparece cuando \(\delta\to1\) (reparto 50/50).</p>`}]});

// ---------- CUARTO TALLER: juegos bayesianos estáticos y de señalización
const BNT=(pre,l)=>({id:"bayesnash",pre,lbl:l||"Abrir en el resolvedor de juegos bayesianos"}),SGT=(pre,l)=>({id:"senal",pre,lbl:l||"Abrir en el Resolvedor de juegos de señalización"});
TALLERES.push({id:"tl-t4",t:"Cuarto taller",sub:"Juegos bayesianos: equilibrio Bayes-Nash, Cournot y Bertrand con información asimétrica, señalización y EBP",anchor:"bayesnash",
intro:`Los 9 puntos del cuarto taller en orden, con la notación del curso: \\(T_i\\) los tipos, \\(p\\) las creencias, \\(s_i(t_i)\\) las estrategias y EBN (equilibrio Bayes-Nash) y EBP. El método en los estáticos es siempre el mismo: <b>1)</b> transformación de Harsanyi (la naturaleza elige los tipos), <b>2)</b> estrategias = un plan por tipo, <b>3)</b> pagos esperados y mejores respuestas tipo por tipo. En los de señalización: <b>1)</b> qué responde el receptor según su creencia μ, <b>2)</b> revisar las estrategias agrupadoras y separadoras con la regla de Bayes, <b>3)</b> comprobar que ningún tipo quiera cambiar de mensaje. Los resultados se verificaron con los resolvedores, que traen cargado cada punto.`,
puntos:[
{id:"t4-1",n:"1",t:"Juego bayesiano estático, estrategia pura y EBN",tipo:"Conceptual",temas:["bayesnash"],
enun:String.raw`<p>¿Qué es un juego bayesiano (BG) estático? ¿Qué es una estrategia pura de un BG? ¿Qué es un equilibrio bayesiano de Nash en estrategias puras del BG?</p>`,
saber:[String.raw`Información <b>incompleta</b>: algún jugador no conoce los pagos de otro. Harsanyi la convierte en información <b>imperfecta</b> agregando a la naturaleza, que elige los tipos.`],
sol:String.raw`<ol class="steps"><li><b>Juego bayesiano estático</b> (forma normal de Gibbons): \(G=\{A_1,\dots,A_n;\ T_1,\dots,T_n;\ p_1,\dots,p_n;\ u_1,\dots,u_n\}\). \(A_i\) son las acciones; \(T_i\) los tipos posibles del jugador \(i\) (su información privada); \(p_i(t_{-i}\mid t_i)\) lo que el tipo \(t_i\) cree sobre los tipos de los demás; y \(u_i(a_1,\dots,a_n;t_i)\) sus pagos, que dependen de su tipo. El orden es: la naturaleza elige \(t=(t_1,\dots,t_n)\) con una probabilidad previa \(p(t)\) conocida por todos; cada jugador ve solo su \(t_i\); todos eligen sus acciones a la vez.</li>
<li><b>Estrategia pura:</b> una función \(s_i:T_i\to A_i\). Dice qué acción toma <b>cada</b> tipo, aunque en la realidad solo exista uno. Con 2 tipos y 2 acciones hay \(2^2=4\) estrategias.</li>
<li><b>Equilibrio Bayes-Nash en puras:</b> un perfil \(s^*=(s_1^*,\dots,s_n^*)\) tal que, para cada jugador \(i\) y cada uno de sus tipos \(t_i\), la acción \(s_i^*(t_i)\) maximiza su pago esperado dadas sus creencias y las estrategias de los demás:</li></ol>
<div class="mj">\[s_i^*(t_i)\in\arg\max_{a_i\in A_i}\ \sum_{t_{-i}\in T_{-i}}u_i\big(s_1^*(t_1),\dots,a_i,\dots,s_n^*(t_n);\,t_i\big)\,p_i(t_{-i}\mid t_i)\]</div>`,
res:String.raw`<p>Un BG estático es \(\{A_i;T_i;p_i;u_i\}\); una estrategia pura es un plan \(s_i:T_i\to A_i\); un EBN es un perfil en el que ningún <b>tipo</b> de ningún jugador mejora su pago esperado cambiando de acción. Equivale a un equilibrio de Nash del juego en que los «jugadores» son los tipos.</p>`,
micro:""},
{id:"t4-2",n:"2",t:"Dilema del prisionero con un jugador que puede disfrutar cooperando",tipo:"Equilibrio Bayes-Nash",temas:["bayesnash"],tool:BNT("t4p2"),
enun:String.raw`<p>Cada jugador elige cooperar (C) o no cooperar (N). El jugador 1 no conoce los pagos del 2; el 2 conoce los suyos y los del 1. El 2 puede ser normal (Tabla 1) o disfrutar cooperando (Tabla 2). Filas: jugador 1; columnas: jugador 2.</p>${T3TAB(["C","N"],[["C","4, 2","0, 3"],["N","3, 0","1, 1"]])}<p class="hint">Tabla 1 (normal)</p>${T3TAB(["C","N"],[["C","4, 4","0, 3"],["N","3, 2","1, 1"]])}<p class="hint">Tabla 2 (cooperativo)</p><p>Formule el juego como un juego bayesiano y encuentre los EBN en estrategias puras.</p>`,
saber:[String.raw`El enunciado no da la probabilidad de cada tipo: se trabaja con un parámetro. Aquí \(p\) = probabilidad de que el 2 sea normal y \(1-p\) de que sea cooperativo.`,String.raw`Si un tipo tiene una acción estrictamente dominante, la juega en cualquier EBN.`],
sol:String.raw`<ol class="steps"><li><b>Juego bayesiano:</b> \(N=\{1,2\}\); \(A_1=A_2=\{C,N\}\); \(T_1=\{\text{único}\}\), \(T_2=\{\text{normal},\text{cooperativo}\}\); el 1 cree \(p(\text{normal})=p\), \(p(\text{coop.})=1-p\); los pagos son los de las tablas.</li>
<li><b>Estrategias:</b> \(S_1=\{C,N\}\) y \(S_2=\{(C,C),(C,N),(N,C),(N,N)\}\), donde la primera letra es lo que hace el 2 normal y la segunda, el cooperativo.</li>
<li><b>El 2 normal:</b> contra C, N da 3 &gt; 2; contra N, N da 1 &gt; 0. N es dominante.</li>
<li><b>El 2 cooperativo:</b> contra C, C da 4 &gt; 3; contra N, C da 2 &gt; 1. C es dominante. Entonces \(s_2^*=(N,C)\).</li>
<li><b>El 1</b> (sus pagos son iguales en las dos tablas) enfrenta N con probabilidad \(p\) y C con \(1-p\): \(\pi_1(C)=4(1-p)+0\cdot p=4-4p\) y \(\pi_1(N)=3(1-p)+1\cdot p=3-2p\). C conviene si \(4-4p\ge3-2p\), es decir, si \(p\le\tfrac12\).</li></ol>`,
res:String.raw`<p>\(EBN=\{(C,(N,C))\}\) si \(p&lt;\tfrac12\); \(EBN=\{(N,(N,C))\}\) si \(p&gt;\tfrac12\); con \(p=\tfrac12\) los dos. El 2 siempre «revela» su tipo con su acción; el 1 coopera solo si es más probable que el 2 sea cooperativo.</p>
<p><button class="btn" type="button" data-tool="bayesnash" data-pre="t4p2b">Ver el caso p = 2/3 en el resolvedor →</button></p>`},
{id:"t4-3",n:"3",t:"El jugador 1 sabe qué tabla aplica",tipo:"Equilibrio Bayes-Nash",temas:["bayesnash"],tool:BNT("t4p3"),
enun:String.raw`<p>El jugador 1 sabe qué tabla aplica; el 2 solo conoce su pago y asigna probabilidad \(p\) a la Tabla 1 y \(1-p\) a la Tabla 2. Filas: jugador 1 (R, NR); columnas: jugador 2 (NE, E).</p>${T3TAB(["NE","E"],[["R","0, −1","2, 0"],["NR","3, 2","5, 0"]])}<p class="hint">Tabla 1</p>${T3TAB(["NE","E"],[["R","2, −1","4, 0"],["NR","3, 2","2, 0"]])}<p class="hint">Tabla 2</p><p>Con \(0&lt;p&lt;1\), formule el juego como un juego bayesiano y encuentre los EBN en puras. Represente el juego en forma extensiva y luego en forma estratégica con pagos esperados.</p>`,
saber:[String.raw`Ahora quien tiene tipos es el jugador 1: \(T_1=\{t_1,t_2\}\) (tabla 1 o tabla 2). Su estrategia es un par (acción del tipo 1, acción del tipo 2).`,String.raw`Pago esperado de una celda: \(p\cdot\)(pago en la Tabla 1) \(+\,(1-p)\cdot\)(pago en la Tabla 2).`],
sol:String.raw`<ol class="steps"><li><b>Forma extensiva:</b> la naturaleza elige Tabla 1 (prob. \(p\)) o Tabla 2 (\(1-p\)). El 1 observa la tabla y elige R o NR: tiene dos nodos, cada uno su propio conjunto de información. El 2 elige NE o E sin ver ni la tabla ni lo que hizo el 1: sus cuatro nodos forman un solo conjunto de información.</li>
<li><b>Estrategias:</b> \(S_1=\{(R,R),(R,NR),(NR,R),(NR,NR)\}\) (primero el tipo 1, luego el 2) y \(S_2=\{NE,E\}\).</li>
<li><b>Forma estratégica con pagos esperados:</b>${T3TAB(["NE","E"],[["(R, R)","2−2p, −1","4−2p, 0"],["(R, NR)","3−3p, 2−3p","2, 0"],["(NR, R)","2+p, 3p−1","<b>4+p, 0</b>"],["(NR, NR)","<b>3, 2</b>","2+3p, 0"]])}Ejemplo de una celda: \((NR,R)\) contra NE da al 1 \(3p+2(1-p)=2+p\) y al 2 \(2p+(-1)(1-p)=3p-1\).</li>
<li><b>Tipo por tipo:</b> el tipo 1 tiene NR dominante (3 &gt; 0 y 5 &gt; 2). El tipo 2 juega NR contra NE (3 &gt; 2) y R contra E (4 &gt; 2). El 2 juega NE si ve NR y E si ve R.</li>
<li><b>Candidato \((NR,NR)\):</b> el 2 enfrenta NR seguro y juega NE; el tipo 2, contra NE, prefiere NR ✓. Es EBN para todo \(p\).</li>
<li><b>Candidato \((NR,R)\):</b> el 2 enfrenta NR con prob. \(p\) y R con \(1-p\): \(\pi_2(NE)=3p-1\), \(\pi_2(E)=0\). Juega E si \(p\le\tfrac13\). Con E, el tipo 2 prefiere R (4 &gt; 2) ✓ y el tipo 1, NR ✓.</li></ol>`,
res:String.raw`<p>\(EBN=\{((NR,NR),NE)\}\) para todo \(p\), y además \(((NR,R),E)\) si \(p\le\tfrac13\). Cuando es poco probable la Tabla 1, el 2 espera R y juega E, lo que a su vez hace que al tipo 2 le convenga R.</p>
<p><button class="btn" type="button" data-tool="bayesnash" data-pre="t4p3b">Ver el caso p = 1/2 (un solo equilibrio) →</button></p>`},
{id:"t4-4",n:"4",t:"Cournot con costos comunes inciertos",tipo:"EBN con estrategias continuas",temas:["bayesnash","cournot-asim"],tool:{id:"cournot-asim",lbl:"Ir a Cournot con información asimétrica"},
enun:String.raw`<p>Dos firmas enfrentan \(P(Q)=M-dQ\), \(Q=q_1+q_2\), con \(M,d&gt;0\) de conocimiento común. Ambas tienen el mismo costo unitario \(c\in\{1,2\}\), pero solo la firma 1 sabe su valor. La firma 2 cree que \(c=1\) con probabilidad \(p\) y \(c=2\) con \(1-p\). Formule el juego como un juego bayesiano y encuentre el EBN en puras.</p>`,
saber:[String.raw`La firma informada elige una cantidad por tipo: \(q_1^L\) (si \(c=1\)) y \(q_1^H\) (si \(c=2\)). La no informada elige una sola \(q_2\).`,String.raw`Ojo: el costo de la firma 2 también es \(c\), así que ella tampoco conoce su propio costo; usa el esperado \(E[c]=p\cdot1+(1-p)\cdot2=2-p\).`],
sol:String.raw`<ol class="steps"><li><b>Juego bayesiano:</b> \(A_i=[0,\infty)\); \(T_1=\{L,H\}\) (costo 1 o 2), \(T_2=\{\text{único}\}\); creencias de la 2: \(p(L)=p\); pagos \(\pi_i=(M-dq_1-dq_2-c)\,q_i\).</li>
<li><b>Firma 1, tipo L:</b> \(\max_{q}(M-dq-dq_2-1)q\). CPO: \(M-1-dq_2-2dq=0\Rightarrow q_1^L=\dfrac{M-1-dq_2}{2d}\).</li>
<li><b>Firma 1, tipo H:</b> igual con \(c=2\): \(q_1^H=\dfrac{M-2-dq_2}{2d}\).</li>
<li><b>Firma 2:</b> \(\max_{q_2}\ p(M-dq_1^L-dq_2-1)q_2+(1-p)(M-dq_1^H-dq_2-2)q_2\). CPO: \(q_2=\dfrac{M-(2-p)-d\,\bar q_1}{2d}\), con \(\bar q_1=pq_1^L+(1-p)q_1^H\).</li>
<li><b>Resolver:</b> promediando las dos primeras, \(\bar q_1=\dfrac{M-(2-p)-dq_2}{2d}\). Las ecuaciones de \(\bar q_1\) y \(q_2\) son simétricas, así que \(d\bar q_1=dq_2=\dfrac{M-2+p}{3}\).</li></ol>
<div class="mj">\[q_2^*=\frac{M-2+p}{3d},\qquad q_1^{L*}=\frac{2M-1-p}{6d},\qquad q_1^{H*}=\frac{2M-4-p}{6d}\]</div>`,
res:String.raw`<p>EBN: \(\big(q_1^{L*},q_1^{H*};\ q_2^*\big)\) como arriba, con \(2M&gt;4+p\) para que todo sea positivo. Comparado con información completa (\(q_i=\frac{M-c}{3d}\)): si el costo es bajo, la firma 1 produce <b>más</b> (\(\frac{2M-1-p}{6d}&gt;\frac{2M-2}{6d}\)) porque la 2, que no lo sabe, produce menos de lo que produciría; si es alto, la 1 produce <b>menos</b>.</p>`},
{id:"t4-5",n:"5",t:"Batalla de los sexos como juego de señalización",tipo:"Señalización y EBP",temas:["senalizacion","ebp"],tool:SGT("bos"),
enun:String.raw`<p>La Batalla de los sexos bayesiana de clase, con la chica (jugadora 1, informada) y el chico (jugador 2). Filas: chica (F, C); columnas: chico (F, C).</p>${T3TAB(["F","C"],[["F","3, 2","2, 1"],["C","0, 0","1, 3"]])}<p class="hint">Tabla 1</p>${T3TAB(["F","C"],[["F","1, 2","0, 1"],["C","2, 0","3, 3"]])}<p class="hint">Tabla 2</p><p>Suponga que la chica mueve primero y después el chico. Represente la situación como un juego de señalización y encuentre el equilibrio.</p>`,
saber:[String.raw`En un juego de señalización el emisor (la chica) conoce su tipo y elige un mensaje; el receptor (el chico) lo ve y responde con una creencia \(\mu\) sobre el tipo. Aquí el «mensaje» es la propia acción de la chica.`,String.raw`EBP: la respuesta es óptima dada \(\mu\), \(\mu\) sale de Bayes en la trayectoria y ningún tipo quiere cambiar de mensaje.`],
sol:String.raw`<ol class="steps"><li><b>Juego de señalización:</b> la naturaleza elige Tabla 1 (prob. \(p\)) o Tabla 2. La chica la observa y elige F o C. El chico ve F o C, no la tabla, y responde F o C. Creencias: \(\mu=P(\text{Tabla 1}\mid F)\) y \(\mu'=P(\text{Tabla 1}\mid C)\).</li>
<li><b>El chico tras F:</b> F le da 2 en las dos tablas y C le da 1. Elige F para cualquier \(\mu\).</li>
<li><b>El chico tras C:</b> F le da 0 y C le da 3 en las dos tablas. Elige C para cualquier \(\mu'\). Su estrategia es (F tras F, C tras C): ir adonde vaya ella.</li>
<li><b>La chica sabe que él la sigue.</b> Tipo Tabla 1: F da (F, F) = 3 y C da (C, C) = 1: elige F. Tipo Tabla 2: F da 1 y C da 3: elige C.</li>
<li><b>Bayes:</b> F solo lo manda el tipo Tabla 1, así que \(\mu=1\); C solo el tipo Tabla 2, así que \(\mu'=0\).</li>
<li><b>Los agrupadores fallan:</b> si las dos mandaran F, el tipo Tabla 2 ganaría 3 en vez de 1 cambiando a C; si las dos mandaran C, el tipo Tabla 1 ganaría 3 en vez de 1 cambiando a F.</li></ol>`,
res:String.raw`<p>Único EBP (separador): chica (F si Tabla 1, C si Tabla 2), chico (F tras F, C tras C), con \(\mu=1\) y \(\mu'=0\). Vale para cualquier \(p\). Mover primero le da a la chica su resultado preferido en cada tabla: su acción revela su tipo.</p>`},
{id:"t4-6",n:"6",t:"Bertrand con productos diferenciados e información asimétrica",tipo:"EBN con estrategias continuas",temas:["bayesnash","bertrand"],tool:{id:"bertrand",lbl:"Ir a Bertrand"},
enun:String.raw`<p>La demanda de la empresa \(i\) es \(q_i(p_i,p_j)=a-p_i-b_ip_j\), con costos cero. \(b_i\) es alto (\(b_A\)) con probabilidad \(\theta\) o bajo (\(b_B\)) con \(1-\theta\), con \(b_A&gt;b_B&gt;0\), independiente de \(b_j\). La empresa 1 conoce su \(b_1\) y el \(b_2\) de su competidora; la empresa 2 solo conoce su propio tipo. Encuentre el EBN en puras.</p>`,
saber:[String.raw`La empresa 1 está perfectamente informada: su precio depende de los dos tipos, \(p_1(b_1,b_2)\) (cuatro precios). La empresa 2 elige \(p_2(b_2)\) (dos precios) y promedia sobre \(b_1\).`,String.raw`Notación: \(\bar b=\theta b_A+(1-\theta)b_B\), el valor esperado de \(b_1\).`],
sol:String.raw`<ol class="steps"><li><b>Juego bayesiano:</b> \(A_i=[0,\infty)\); \(T_1=\{b_A,b_B\}^2\) (conoce los dos), \(T_2=\{b_A,b_B\}\); la 2 cree \(P(b_1=b_A)=\theta\); pagos \(\pi_i=p_i(a-p_i-b_ip_j)\).</li>
<li><b>Empresa 1</b>, sabiendo \((b_1,b_2)\) y el precio \(p_2(b_2)\): \(\max_{p_1}p_1\big(a-p_1-b_1p_2(b_2)\big)\). CPO: \(p_1(b_1,b_2)=\dfrac{a-b_1p_2(b_2)}{2}\).</li>
<li><b>Empresa 2</b> de tipo \(b_2\): \(\max_{p_2}\ p_2\big(a-p_2-b_2\,E[p_1(b_1,b_2)]\big)\). CPO: \(p_2(b_2)=\dfrac{a-b_2\,E[p_1]}{2}\).</li>
<li><b>Valor esperado del precio de la 1</b> que ve la 2: \(E[p_1]=\theta\frac{a-b_Ap_2}{2}+(1-\theta)\frac{a-b_Bp_2}{2}=\dfrac{a-\bar b\,p_2(b_2)}{2}\).</li>
<li><b>Reemplazar:</b> \(p_2=\dfrac{a-b_2\frac{a-\bar bp_2}{2}}{2}\Rightarrow4p_2=2a-ab_2+b_2\bar b\,p_2\).</li></ol>
<div class="mj">\[p_2^*(b_2)=\frac{a(2-b_2)}{4-b_2\bar b},\qquad p_1^*(b_1,b_2)=\frac{a-b_1\,p_2^*(b_2)}{2}=\frac{a\,(4-b_2\bar b-2b_1+b_1b_2)}{2\,(4-b_2\bar b)}\]</div>`,
res:String.raw`<p>EBN: la empresa 2 cobra \(p_2^*(b_A)\) o \(p_2^*(b_B)\) según su tipo y la 1 cobra uno de cuatro precios \(p_1^*(b_1,b_2)\). Si la 2 conociera \(b_1\), \(\bar b\) se reemplazaría por \(b_1\) y saldría el Bertrand de información completa, \(p_i=\frac{a(2-b_i)}{4-b_1b_2}\). Se supone \(b_A&lt;2\) para que los precios sean positivos.</p>`},
{id:"t4-7",n:"7",t:"Regla de Bayes para las creencias sobre los tipos",tipo:"Conceptual",temas:["bayesnash"],
enun:String.raw`<p>Dada una partición finita \(\{A_j\}_{j=1}^N\) de un espacio de eventos, se cumple \(p(A_j\mid B)=\dfrac{p(A_j)\,p(B\mid A_j)}{\sum_{i=1}^n p(A_i)\,p(B\mid A_i)}\). Muestre que en un juego bayesiano, una vez que la naturaleza le informa a \(i\) su tipo \(t_i\), \(i\) puede calcular sus creencias sobre los tipos de los demás por la regla de Bayes: \(p(t_{-i}\mid t_i)=\dfrac{p(t_{-i},t_i)}{\sum_{t_{-i}\in T_{-i}}p(t_{-i},t_i)}\).</p>`,
saber:[String.raw`En el denominador de la fórmula de la partición el subíndice que suma debe ser el mismo de adentro: \(\sum_i p(A_i)p(B\mid A_i)\) (en el enunciado aparece \(A_j\) por error tipográfico).`],
sol:String.raw`<ol class="steps"><li><b>La partición:</b> los eventos \(A_j=\{t_{-i}=t_{-i}^j\}\), uno por cada combinación posible de tipos de los demás, son disjuntos y cubren todo: forman una partición finita, porque \(T_{-i}\) es finito.</li>
<li><b>El evento observado:</b> \(B=\{t_i\}\), el tipo que la naturaleza le reveló a \(i\). Se supone \(p(t_i)&gt;0\).</li>
<li><b>Numerador:</b> por la definición de probabilidad condicional, \(p(A_j)\,p(B\mid A_j)=p(A_j\cap B)=p(t_{-i}^j,t_i)\), la probabilidad previa conjunta.</li>
<li><b>Denominador:</b> \(\sum_k p(A_k)p(B\mid A_k)=\sum_k p(t_{-i}^k,t_i)=p(t_i)\), por la ley de probabilidad total.</li>
<li><b>Juntar:</b> \(p(t_{-i}\mid t_i)=\dfrac{p(t_{-i},t_i)}{\sum_{t_{-i}'\in T_{-i}}p(t_{-i}',t_i)}\). Como la previa \(p(t)\) es de conocimiento común, cada tipo puede hacer esta cuenta.</li></ol>`,
res:String.raw`<p>Es la regla de Bayes aplicada a la partición de \(T_{-i}\) con el evento \(B=\{t_i\}\). Caso especial: si los tipos son independientes, \(p(t_{-i},t_i)=p(t_{-i})p(t_i)\) y la creencia es la previa, \(p(t_{-i}\mid t_i)=p(t_{-i})\), como en los puntos 4 y 6.</p>`},
{id:"t4-8",n:"8",t:"Figura 1: EBP de un juego de señalización",tipo:"Señalización y EBP",temas:["senalizacion","ebp"],tool:SGT("f1"),
enun:String.raw`<p>En la Figura 1, la naturaleza elige \(t_1\) o \(t_2\) con probabilidad 0,5 cada uno. El jugador 1 observa su tipo y elige I o D. El 2 ve el mensaje, no el tipo (creencias \(\mu\) tras I y \(\mu'\) tras D), y elige a o b. Pagos \((\pi_1,\pi_2)\): \(t_1\), I: a (1, 3), b (1, 0). \(t_2\), I: a (2, 4), b (2, 1). \(t_1\), D: a (2, 1), b (0, 0). \(t_2\), D: a (1, 2), b (0, 1). Encuentre los perfiles en puras que son EBP.</p>`,
saber:[String.raw`Estrategia del emisor: (mensaje de \(t_1\), mensaje de \(t_2\)). Hay dos agrupadoras, (I, I) y (D, D), y dos separadoras, (I, D) y (D, I).`,String.raw`Si una respuesta es mejor para el receptor con cualquier \(\mu\), las creencias fuera de la trayectoria no importan.`],
sol:String.raw`<ol class="steps"><li><b>El 2 tras I:</b> \(\pi_2(a)=3\mu+4(1-\mu)=4-\mu\) y \(\pi_2(b)=0\cdot\mu+1(1-\mu)=1-\mu\). Como \(4-\mu&gt;1-\mu\), juega a para cualquier \(\mu\).</li>
<li><b>El 2 tras D:</b> \(\pi_2(a)=1\mu'+2(1-\mu')=2-\mu'\) y \(\pi_2(b)=0+1(1-\mu')=1-\mu'\). Juega a para cualquier \(\mu'\). Su estrategia es \((a,a)\).</li>
<li><b>El emisor contra \((a,a)\):</b> \(t_1\) gana 1 con I y 2 con D, así que elige D; \(t_2\) gana 2 con I y 1 con D, así que elige I.</li>
<li><b>Bayes en la separadora (D, I):</b> I solo lo manda \(t_2\), así que \(\mu=0\); D solo \(t_1\), así que \(\mu'=1\). Con esas creencias el 2 sigue jugando a ✓.</li>
<li><b>Las otras tres fallan:</b> en (I, I) \(t_1\) se pasa a D (2 &gt; 1); en (D, D) \(t_2\) se pasa a I (2 &gt; 1); en (I, D) los dos quieren cambiar.</li></ol>`,
res:String.raw`<p>Único EBP: [emisor \((D,I)\), receptor \((a,a)\), \(\mu=0\), \(\mu'=1\)]. Es separador: el mensaje revela el tipo.</p>`},
{id:"t4-9",n:"9",t:"Figura 2: EBP agrupadores y separador",tipo:"Señalización y EBP",temas:["senalizacion","ebp"],tool:SGT("f2"),
enun:String.raw`<p>En la Figura 2, misma estructura que la Figura 1 (tipos con probabilidad 0,5; mensajes I o D; respuestas a o b). Pagos \((\pi_1,\pi_2)\): \(t_1\), I: a (2, 4), b (1, 0). \(t_2\), I: a (2, 4), b (1, 1). \(t_1\), D: a (2, 1), b (0, 0). \(t_2\), D: a (1, 0), b (1, 2). Encuentre los perfiles en puras que son EBP.</p>`,
saber:[String.raw`Cuando la respuesta óptima tras un mensaje depende de \(\mu'\), se halla el umbral igualando los pagos esperados; fuera de la trayectoria, se eligen las creencias que sostienen la respuesta.`],
sol:String.raw`<ol class="steps"><li><b>El 2 tras I:</b> \(\pi_2(a)=4\mu+4(1-\mu)=4\) y \(\pi_2(b)=0\cdot\mu+1(1-\mu)=1-\mu\). Siempre a.</li>
<li><b>El 2 tras D:</b> \(\pi_2(a)=1\cdot\mu'+0=\mu'\) y \(\pi_2(b)=0\cdot\mu'+2(1-\mu')=2-2\mu'\). a si \(\mu'\ge\tfrac23\); b si \(\mu'\le\tfrac23\).</li>
<li><b>Agrupadora (I, I):</b> Bayes da \(\mu=\tfrac12\) y el 2 juega a tras I: los dos tipos ganan 2. D está fuera de la trayectoria. \(t_1\) cambiándose a D ganaría 2 con a o 0 con b: no gana estrictamente. \(t_2\) ganaría 1 &lt; 2. Sirve cualquier respuesta tras D, con la creencia que la sostenga.</li>
<li><b>Agrupadora (D, D):</b> \(\mu'=\tfrac12&lt;\tfrac23\), así que el 2 juega b tras D y \(t_1\) gana 0. Pasándose a I recibiría a y ganaría 2. Falla.</li>
<li><b>Separadora (I, D):</b> \(\mu=1\), \(\mu'=0\): el 2 juega a tras I y b tras D. \(t_2\) gana 1 con D y ganaría 2 con I. Falla.</li>
<li><b>Separadora (D, I):</b> \(\mu=0\), \(\mu'=1\): el 2 juega a tras los dos mensajes. \(t_1\) gana 2 con D e igual con I ✓; \(t_2\) gana 2 con I y 1 con D ✓.</li></ol>`,
res:String.raw`<p>EBP en puras: [\((I,I)\), \((a,a)\), \(\mu=\tfrac12\), \(\mu'\ge\tfrac23\)]; [\((I,I)\), \((a,b)\), \(\mu=\tfrac12\), \(\mu'\le\tfrac23\)]; y [\((D,I)\), \((a,a)\), \(\mu=0\), \(\mu'=1\)]. Los agrupadores se sostienen porque, para \(t_1\), mandar D no da más que mandar I.</p>`}
]});

// ---------- MICROPASOS DE LOS TALLERES 3 Y 4: cada paso parte de lo que da el enunciado y dice qué usa
(function(){const mp=a=>`<ol class="mp">${a.map(([e,w])=>`<li><div class="mp-e">${e}</div>${w?`<div class="por">${w}</div>`:""}</li>`).join("")}</ol>`,h=t=>`<h5>${t}</h5>`,E="Lo que da el enunciado y dónde se usa";
const M={
"t3-1":h(E)+mp([[String.raw`Monopolio = 2 millones de US$: si la 1 no entra, la 2 se queda con todo → nodo terminal \((0,2)\).`,"Se usa en la rama NE."],[String.raw`«Deberá compartirlos si concede» → cada una recibe \(2/2=1\) → nodo terminal \((1,1)\).`,"Se usa en la rama E, C."],[String.raw`«Si pelea, ambas incurren en una pérdida neta de 1 millón» → \((-1,-1)\).`,"Se usa en la rama E, P."],[String.raw`Orden: la 1 decide primero; la 2 decide «más tarde sí confirma que la 1 entró» → la 2 observa a la 1.`,"Por eso el nodo de la 2 es un conjunto de información por sí solo y hay un subjuego propio."]])+h("Paso a paso")+mp([[String.raw`\(S_1=\{E,NE\}\); \(S_2=\{P,C\}\).`,"La 2 tiene un solo nodo, así que su estrategia es una sola acción."],[String.raw`Celda \((NE,P)\) y \((NE,C)\): \((0,2)\).`,"Si la 1 no entra, lo que «planea» la 2 no cambia el pago: la columna se repite."],[String.raw`Mejor respuesta de la 1 a P: NE (0 &gt; −1). A C: E (1 &gt; 0).`,"Se subraya el máximo de la columna para el jugador 1."],[String.raw`Mejor respuesta de la 2 a E: C (1 &gt; −1). A NE: P o C (2 = 2).`,"Empate: las dos son mejor respuesta."],[String.raw`Cruces: \((E,C)\) y \((NE,P)\).`,"EN = celdas donde las dos mejores respuestas coinciden."],[String.raw`Subjuego tras E: la 2 compara C (1) con P (−1) → C. La 1 compara E → (1, 1) con NE → (0, 2) → E.`,"Inducción hacia atrás: se resuelve primero el último nodo y se reemplaza por su pago."],[String.raw`\((NE,P)\) pide que la 2 pelee en un nodo donde pelear le da −1 &lt; 1.`,"Amenaza no creíble: no es EN del subjuego, así que no es EPS."]]),
"t3-2":h(E)+mp([[String.raw`Tabla simultánea: (N, N) = (4, 3), (N, S) = (2, 2), (S, N) = (1, 1), (S, S) = (3, 4).`,"Son los pagos de los cuatro nodos terminales del árbol secuencial."],[String.raw`«La empresa 1 decide establecerse primero y, observado lo que hizo, la 2 decide».`,"La 2 tiene dos nodos separados (tras N y tras S): su estrategia es un par."]])+h("Paso a paso")+mp([[String.raw`\(S_2=\{(N,N),(N,S),(S,N),(S,S)\}\): (qué hace tras N, qué hace tras S).`,String.raw`Una acción por cada conjunto de información: \(2\times2=4\) estrategias.`],[String.raw`Fila N contra \((N,S)\): tras N la 2 juega N → (4, 3).`,"Para llenar la celda se mira solo la parte de la estrategia que se activa."],[String.raw`Fila S contra \((N,S)\): tras S la 2 juega S → (3, 4).`,"Igual con las demás celdas."],[String.raw`Mejor respuesta de la 1: contra (N,N) y (N,S) → N; contra (S,S) → S; contra (S,N) → N (2 &gt; 1).`,""],[String.raw`Mejor respuesta de la 2: contra N → (N,N) o (N,S) (3); contra S → (N,S) o (S,S) (4).`,""],[String.raw`EN: \((N,(N,N))\), \((N,(N,S))\), \((S,(S,S))\).`,"Cruces de mejores respuestas."],[String.raw`Tras N: 3 &gt; 2 → N. Tras S: 4 &gt; 1 → S. Estrategia de la 2: \((N,S)\). La 1: N da 4 &gt; 3 → N.`,String.raw`Hacia atrás. \((S,S)\) pide ir al Sur tras N (2 &lt; 3): no creíble.`]]),
"t3-3":h(E)+mp([[String.raw`Línea punteada entre los nodos del 2 tras A y tras B.`,"El 2 elige X o Y sin saber qué hizo el 1: un solo conjunto de información, dos acciones."],[String.raw`Tras A, X el 1 vuelve a mover: C → (1, 0), D → (2, 10).`,"Segundo conjunto de información del 1: sus estrategias son pares (raíz, ese nodo)."],[String.raw`A, Y → (5, 5); B, X → (8, 3); B, Y → (3, 8).`,"Pagos terminales para la forma estratégica."]])+h("Paso a paso")+mp([[String.raw`\(S_1=\{(A,C),(A,D),(B,C),(B,D)\}\); \(S_2=\{X,Y\}\).`,"Con B, la segunda letra no se activa: (B, C) y (B, D) dan los mismos pagos."],[String.raw`\(((A,C),X)\): (1, 0); \(((A,D),X)\): (2, 10); \(((A,\cdot),Y)\): (5, 5); \(((B,\cdot),X)\): (8, 3); \(((B,\cdot),Y)\): (3, 8).`,"Cada celda sigue el camino del árbol."],[String.raw`Mejor respuesta del 1 a X: B (8). A Y: (A, C) o (A, D) (5).`,""],[String.raw`Mejor respuesta del 2 a (A, C): Y (5 &gt; 0). A (A, D): X (10 &gt; 5). A (B, ·): Y (8 &gt; 3).`,""],[String.raw`Único cruce: \(((A,C),Y)\).`,"EN en puras."],[String.raw`Último nodo del 1: D (2) &gt; C (1).`,"Es un subjuego propio (nodo solo, no corta conjuntos). Por eso C no es creíble."],[String.raw`Juego reducido: A, X → (2, 10); A, Y → (5, 5); B, X → (8, 3); B, Y → (3, 8). Ningún cruce.`,"Se reemplaza el subjuego por su pago y queda un 2×2 sin EN en puras."],[String.raw`Indiferencia del 2: \(10p+3(1-p)=5p+8(1-p)\Rightarrow 7p+3=8-3p\Rightarrow p=\tfrac12\).`,"p = probabilidad de A. Se iguala lo que le dan X e Y."],[String.raw`Indiferencia del 1: \(2x+5(1-x)=8x+3(1-x)\Rightarrow 5-3x=3+5x\Rightarrow x=\tfrac14\).`,"x = probabilidad de X."],[String.raw`Pagos: \(\pi_1=5-3\cdot\tfrac14=\tfrac{17}4\); \(\pi_2=7\cdot\tfrac12+3=\tfrac{13}2\).`,"Se reemplaza en cualquiera de los dos lados de cada igualdad."]]),
"t3-4":h(E)+mp([[String.raw`C termina en (3, 2): el 2 no mueve.`,"Si el 1 juega C, el conjunto de información del 2 queda fuera de la trayectoria."],[String.raw`Punteada entre los nodos del 2 tras B y tras A.`,String.raw`Un conjunto con dos nodos: hace falta la creencia \(\mu\) = P(nodo tras B).`],[String.raw`Tras B: b (3, 1), a (0, 2). Tras A: b (0, 0), a (3, 1).`,"Pagos del 2 que entran en sus pagos esperados."]])+h("Paso a paso")+mp([[String.raw`Mejor respuesta del 1 a a: C o A (3); a b: C o B (3). Del 2 a C: a o b (2 = 2); a B: a (2 &gt; 1); a A: a (1 &gt; 0).`,"Forma estratégica 3×2."],[String.raw`EN: \((C,a)\), \((C,b)\), \((A,a)\).`,"Cruces."],[String.raw`No hay subjuegos propios.`,"Cualquier nodo del 2 cortaría su conjunto de información. EPS = EN."],[String.raw`\(\pi_2(a)=2\mu+1(1-\mu)=1+\mu\); \(\pi_2(b)=1\mu+0(1-\mu)=\mu\).`,String.raw`Pago esperado con la creencia \(\mu\).`],[String.raw`\(1+\mu&gt;\mu\) siempre → el 2 juega a en cualquier EBP.`,String.raw`Racionalidad secuencial: elimina \((C,b)\).`],[String.raw`\((C,a)\): \(\mu\) libre. \((A,a)\): Bayes → \(\mu=\frac{0}{0+1}=0\).`,String.raw`En la trayectoria, \(\mu\) = prob. de llegar por B / prob. de llegar al conjunto.`]]),
"t3-5":h(E)+mp([[String.raw`A termina en (1, 3); el 2 no distingue B de C.`,String.raw`Conjunto con dos nodos: creencia \(\mu\) = P(tras B).`],[String.raw`Tras B: a (0, 1), b (0, 2). Tras C: a (0, 0), b (2, 1).`,"Entran en los pagos esperados del 2."]])+h("Paso a paso")+mp([[String.raw`Mejor respuesta del 1 a a: A (1). A b: C (2). Del 2 a A: a o b; a B: b; a C: b.`,""],[String.raw`EN: \((A,a)\), \((C,b)\). EPS = EN.`,"No hay subjuegos propios."],[String.raw`\(\pi_2(a)=1\mu+0=\mu\); \(\pi_2(b)=2\mu+1(1-\mu)=1+\mu\).`,""],[String.raw`b es mejor para todo \(\mu\) → \((A,a)\) no es EBP aunque su conjunto esté fuera de la trayectoria.`,"Ninguna creencia hace óptima a a."],[String.raw`\((C,b)\): Bayes → \(\mu=0\).`,"Solo se llega por C."]]),
"t3-6":h(E)+mp([[String.raw`Figura 4: el 3 tiene dos nodos unidos, uno tras B y otro tras C, B′.`,"Su conjunto de información corta el posible subjuego que empezaría en el nodo del 2."],[String.raw`Pagos: C, C′ → (1, 1, 1); B, I → (3, 2, 2); B, D → (0, 0, 0); C, B′, I → (4, 4, 0); C, B′, D → (0, 0, 1).`,"Para las dos tablas (una por acción del 3)."],[String.raw`Figura 5: B → (1, 0); tras A, el 2 elige a o b y el 1 elige C o D sin verlo.`,"El subjuego tras A es un juego simultáneo 2×2."]])+h("Paso a paso")+mp([[String.raw`Figura 4: el único subjuego es el juego completo → EPS = EN.`,""],[String.raw`\((B,C',I)\): el 1 con C ganaría 1 &lt; 3; el 3 con D ganaría 0 &lt; 2; el 2 no mueve.`,"Desvíos unilaterales."],[String.raw`\((C,C',D)\): el 1 con B ganaría 0 &lt; 1; el 2 con B′ ganaría 0 &lt; 1; el 3 no mueve.`,""],[String.raw`Figura 5, subjuego: el 1 a a → C (3 &gt; 1); a b → D (0 = 0, empate). El 2 a C → a (−1 &gt; −3); a D → b (0 &gt; −2).`,"Mejores respuestas en el 2×2."],[String.raw`EN del subjuego: \((C,a)\) con (3, −1) y \((D,b)\) con (0, 0).`,""],[String.raw`Con \((C,a)\): A da 3 &gt; 1 → A. Con \((D,b)\): A da 0 &lt; 1 → B.`,"Hacia atrás desde cada EN del subjuego."]]),
"t3-7":h(E)+mp([[String.raw`El sindicato elige \(w\) primero; la empresa observa \(w\) y elige \(L\).`,"Dos etapas con información perfecta: se resuelve hacia atrás."],[String.raw`\(I(L)\) creciente y cóncava: \(I'&gt;0\), \(I''&lt;0\).`,String.raw`Garantiza la condición de segundo orden y el signo de \(dL^*/dw\).`],[String.raw`\(\pi(w,L)=I(L)-wL\).`,"Beneficio = ingreso − nómina."]])+h("Paso a paso")+mp([[String.raw`\(\dfrac{\partial\pi}{\partial L}=I'(L)-w=0\).`,String.raw`Derivada de \(I(L)\) es \(I'(L)\); derivada de \(wL\) respecto a \(L\) es \(w\).`],[String.raw`\(\dfrac{\partial^2\pi}{\partial L^2}=I''(L)&lt;0\).`,"Máximo, por la concavidad."],[String.raw`Derivando \(I'(L^*(w))=w\) respecto a \(w\): \(I''(L^*)\,\dfrac{dL^*}{dw}=1\Rightarrow\dfrac{dL^*}{dw}=\dfrac1{I''}&lt;0\).`,"Regla de la cadena (diferenciación implícita)."],[String.raw`Si \(I'(0)\le w\), \(\pi\) decrece desde \(L=0\) → \(L^*=0\).`,"Solución de esquina."]]),
"t3-8":h(E)+mp([[String.raw`\(C_i=cq_i\) y \(P=\max[M-dQ,0]\).`,String.raw`En el tramo relevante \(P=M-dQ\).`],[String.raw`La 1 elige primero; la 2 observa \(q_1\).`,String.raw`La estrategia de la 2 es una función de \(q_1\).`]])+h("Paso a paso")+mp([[String.raw`\(\pi_2=(M-dq_1-dq_2)q_2-cq_2\).`,"Ingreso = precio × cantidad."],[String.raw`\(\partial\pi_2/\partial q_2=M-dq_1-2dq_2-c=0\Rightarrow q_2=\frac{M-c-dq_1}{2d}\).`,String.raw`Derivada de \(-dq_2^2\) es \(-2dq_2\).`],[String.raw`\(Q=q_1+\frac{M-c-dq_1}{2d}=\frac{M-c+dq_1}{2d}\); \(P=M-dQ=\frac{M+c-dq_1}{2}\).`,"Se reemplaza la reacción de la 2 en la demanda."],[String.raw`\(\pi_1=(P-c)q_1=\frac{M-c-dq_1}{2}\,q_1\).`,String.raw`\(\frac{M+c-dq_1}{2}-c=\frac{M-c-dq_1}{2}\).`],[String.raw`\(\frac{M-c}{2}-dq_1=0\Rightarrow q_1=\frac{M-c}{2d}\).`,"CPO de la líder."],[String.raw`\(q_2=\frac{M-c-\frac{M-c}{2}}{2d}=\frac{M-c}{4d}\); \(P=M-d\cdot\frac{3(M-c)}{4d}=\frac{M+3c}{4}\).`,""],[String.raw`\(\pi_1=\frac{M-c}{4}\cdot\frac{M-c}{2d}=\frac{(M-c)^2}{8d}\); \(\pi_2=\frac{M-c}{4}\cdot\frac{M-c}{4d}=\frac{(M-c)^2}{16d}\).`,String.raw`\(P-c=\frac{M-c}{4}\).`]]),
"t3-9":h(E)+mp([[String.raw`Punteada entre los nodos del 2 tras Z y tras X.`,"Conjunto con dos nodos (acciones R, L)."],[String.raw`Tras Y el 2 tiene un nodo propio (R → (2, 2), L → (2, 3)).`,"Segundo conjunto del 2 y un subjuego propio."],[String.raw`Tras X, L el 1 elige B (3, 2) o A (1, 2).`,"Segundo conjunto del 1 y otro subjuego propio."]])+h("Paso a paso")+mp([[String.raw`\(|S_1|=3\times2=6\); \(|S_2|=2\times2=4\).`,"Producto de acciones por conjunto."],[String.raw`Ejemplo de celda: \(((X,B),(L,R))\): X, luego L → nodo del 1 → B → (3, 2).`,""],[String.raw`EN: \(((X,B),(L,R))\), \(((X,B),(L,L))\), \(((Y,B),(R,L))\), \(((Y,A),(R,L))\).`,"Revisión de los desvíos en las 24 celdas."],[String.raw`Subjuegos: tras X, L → B (3 &gt; 1); tras Y → L (3 &gt; 2).`,""],[String.raw`Reducido: Z: R (1, 1), L (0, 0); X: R (0, 0), L (3, 2); Y: (2, 3) siempre.`,"Se reemplazan los subjuegos por sus pagos."],[String.raw`EN del reducido: \((X,L)\) e \((Y,R)\).`,String.raw`Con \((Y,R)\): el 2 no gana cambiando a L (3 = 3, con Y no llega a ese conjunto).`]]),
"t3-10":h(E)+mp([[String.raw`T = 3 rondas, descuentos \(\delta_1\) y \(\delta_2\).`,"Cada jugador descuenta con el suyo."],[String.raw`Reparto exógeno del período 3: \((s,1-s)\) (como en Gibbons).`,"Es el punto de partida hacia atrás."]])+h("Paso a paso")+mp([[String.raw`Período 3: el 1 recibe \(s\).`,""],[String.raw`Visto desde el período 2: \(s\) vale \(\delta_1 s\) para el 1.`,String.raw`Descontar un período = multiplicar por \(\delta_1\).`],[String.raw`El 2 ofrece \(x_2=\delta_1 s\) y se queda \(1-\delta_1 s\).`,"Lo mínimo que el 1 acepta."],[String.raw`Visto desde el período 1: el 2 valora \(1-\delta_1 s\) como \(\delta_2(1-\delta_1 s)\).`,String.raw`Descuento con \(\delta_2\).`],[String.raw`\(1-x_1^*=\delta_2-\delta_1\delta_2 s\Rightarrow x_1^*=1-\delta_2+\delta_1\delta_2 s\).`,"Despejando."]]),
"t3-11":h(E)+mp([[String.raw`Mismo juego con un descuento común \(\delta\).`,String.raw`\(\delta_1=\delta_2=\delta\).`]])+h("Paso a paso")+mp([[String.raw`\(x_t=1-\delta(1-\delta x_{t+2})=1-\delta+\delta^2 x_{t+2}\).`,"Dos pasos hacia atrás seguidos."],[String.raw`T = 3: \(x_1=1-\delta+\delta^2 s\).`,""],[String.raw`T rondas: suma geométrica \(x_1=(1-\delta)(1+\delta^2+\delta^4+\dots)+\dots=\frac{1-(-\delta)^T}{1+\delta}\).`,String.raw`\((1-\delta)(1+\delta^2+\dots)\) alterna signos al expandir; se cierra con la fórmula de la serie geométrica de razón \(-\delta\).`],[String.raw`T = 3: \(\frac{1+\delta^3}{1+\delta}=\frac{(1+\delta)(1-\delta+\delta^2)}{1+\delta}=1-\delta+\delta^2\) ✓.`,String.raw`Suma de cubos: \(1+\delta^3=(1+\delta)(1-\delta+\delta^2)\).`],[String.raw`\(T\to\infty\): \((-\delta)^T\to0\) → \(x_1=\frac1{1+\delta}\).`,String.raw`Porque \(|\delta|&lt;1\).`],[String.raw`Shaked-Sutton: \(s=1-\delta+\delta^2 s\Rightarrow s(1-\delta^2)=1-\delta\Rightarrow s=\frac{1}{1+\delta}\).`,String.raw`\(1-\delta^2=(1-\delta)(1+\delta)\).`]]),
"t4-1":h(E)+mp([[String.raw`Pide tres definiciones: el juego, la estrategia pura y el EBN.`,"Se responde con la notación de Gibbons que usa el curso."]])+h("Paso a paso")+mp([[String.raw`Juego: \(G=\{A_i;T_i;p_i;u_i\}_{i=1}^n\).`,"Acciones, tipos, creencias y pagos que dependen del tipo."],[String.raw`Orden: naturaleza → cada \(i\) ve su \(t_i\) → acciones simultáneas.`,"Transformación de Harsanyi."],[String.raw`Estrategia: \(s_i:T_i\to A_i\).`,"Un plan completo, una acción por tipo."],[String.raw`EBN: para todo \(i\) y todo \(t_i\), \(s_i^*(t_i)\) maximiza \(\sum_{t_{-i}}u_i(\cdot)\,p_i(t_{-i}\mid t_i)\).`,"Mejor respuesta tipo por tipo."]]),
"t4-2":h(E)+mp([[String.raw`El 1 no conoce los pagos del 2; el 2 conoce todo.`,String.raw`Solo el 2 tiene tipos: \(T_2=\{\text{normal},\text{coop.}\}\), \(T_1\) único.`],[String.raw`Tabla 1 (normal): pagos del 2: (C, C) 2, (C, N) 3, (N, C) 0, (N, N) 1.`,"Para ver si N domina para el normal."],[String.raw`Tabla 2 (coop.): pagos del 2: (C, C) 4, (C, N) 3, (N, C) 2, (N, N) 1.`,"Para ver si C domina para el cooperativo."],[String.raw`Pagos del 1 iguales en las dos tablas: (C, C) 4, (C, N) 0, (N, C) 3, (N, N) 1.`,"Su pago esperado solo depende de qué tan probable es que el 2 coopere."],[String.raw`No se da la probabilidad: \(p\) = P(normal).`,"Parámetro."]])+h("Paso a paso")+mp([[String.raw`Normal: 3 &gt; 2 y 1 &gt; 0 → N.`,"Dominancia estricta."],[String.raw`Cooperativo: 4 &gt; 3 y 2 &gt; 1 → C.`,""],[String.raw`El 1 enfrenta N con prob. \(p\) y C con \(1-p\).`,String.raw`Porque \(s_2^*=(N,C)\).`],[String.raw`\(\pi_1(C)=4(1-p)+0p=4-4p\); \(\pi_1(N)=3(1-p)+1p=3-2p\).`,"Pago esperado."],[String.raw`\(4-4p\ge3-2p\iff1\ge2p\iff p\le\frac12\).`,String.raw`Se despeja \(p\).`]]),
"t4-3":h(E)+mp([[String.raw`El 1 sabe qué tabla aplica → \(T_1=\{t_1,t_2\}\); el 2 cree \(p\) en la Tabla 1.`,"Quien tiene tipos es el 1."],[String.raw`Tabla 1, pagos del 1: (R, NE) 0, (R, E) 2, (NR, NE) 3, (NR, E) 5.`,"NR domina para el tipo 1."],[String.raw`Tabla 2, pagos del 1: (R, NE) 2, (R, E) 4, (NR, NE) 3, (NR, E) 2.`,"El tipo 2 no tiene dominante."],[String.raw`Pagos del 2 iguales en ambas: (R, NE) −1, (R, E) 0, (NR, NE) 2, (NR, E) 0.`,"Su respuesta depende solo de qué espera que haga el 1."]])+h("Paso a paso")+mp([[String.raw`Celda \((R,R)\), NE: \(0p+2(1-p)=2-2p\); 2: \(-1\).`,"Pago esperado = p·Tabla 1 + (1 − p)·Tabla 2."],[String.raw`\((R,NR)\), NE: \(0p+3(1-p)=3-3p\); 2: \(-p+2(1-p)=2-3p\).`,""],[String.raw`\((NR,R)\), NE: \(3p+2(1-p)=2+p\); 2: \(2p-(1-p)=3p-1\). E: \(5p+4(1-p)=4+p\); 2: 0.`,""],[String.raw`\((NR,NR)\), NE: 3; 2: 2. E: \(5p+2(1-p)=2+3p\); 2: 0.`,""],[String.raw`Mejor respuesta del 1 a NE: \((NR,NR)\) (3 es el mayor, pues \(2+p&lt;3\)). A E: \((NR,R)\) (\(4+p\) es el mayor).`,""],[String.raw`Mejor respuesta del 2 a \((NR,NR)\): NE (2 &gt; 0). A \((NR,R)\): E si \(0\ge3p-1\iff p\le\frac13\).`,""],[String.raw`EBN: \(((NR,NR),NE)\) siempre; \(((NR,R),E)\) si \(p\le\frac13\).`,"Cruces."]]),
"t4-4":h(E)+mp([[String.raw`\(P=M-dQ\), \(c\in\{1,2\}\) común a las dos firmas.`,"El costo entra en el beneficio de las dos."],[String.raw`Solo la 1 conoce \(c\); la 2 cree \(P(c=1)=p\).`,"La 1 tiene dos tipos; la 2 usa valores esperados."]])+h("Paso a paso")+mp([[String.raw`\(\pi_1^L=(M-dq-dq_2-1)q\Rightarrow\partial/\partial q=M-1-dq_2-2dq=0\).`,"CPO del tipo de costo bajo."],[String.raw`\(q_1^L=\frac{M-1-dq_2}{2d}\), \(q_1^H=\frac{M-2-dq_2}{2d}\).`,""],[String.raw`\(E[\pi_2]=(M-d\bar q_1-dq_2-E[c])q_2\), con \(E[c]=p+2(1-p)=2-p\).`,"Linealidad de la esperanza."],[String.raw`\(q_2=\frac{M-(2-p)-d\bar q_1}{2d}\).`,"CPO de la 2."],[String.raw`\(\bar q_1=p\,q_1^L+(1-p)\,q_1^H=\frac{M-(p+2-2p)-dq_2}{2d}=\frac{M-(2-p)-dq_2}{2d}\).`,"Se promedian las dos reacciones de la 1."],[String.raw`Sistema simétrico → \(dq_2=d\bar q_1=x\): \(x=\frac{M-2+p-x}{2}\Rightarrow x=\frac{M-2+p}{3}\).`,""],[String.raw`\(q_1^L=\frac{M-1-\frac{M-2+p}{3}}{2d}=\frac{2M-1-p}{6d}\); \(q_1^H=\frac{2M-4-p}{6d}\).`,"Común denominador 3."]]),
"t4-5":h(E)+mp([[String.raw`La chica conoce la tabla; el chico no → la chica es el emisor.`,"Mueve primero: su acción es el mensaje."],[String.raw`Pagos del chico tras F: F → 2, C → 1 (en las dos tablas).`,"No dependen de la tabla: sus creencias no importan."],[String.raw`Pagos del chico tras C: F → 0, C → 3 (en las dos tablas).`,""],[String.raw`Pagos de la chica: Tabla 1: (F, F) 3, (C, C) 1. Tabla 2: (F, F) 1, (C, C) 3.`,"Son los que compara cuando sabe que él la sigue."]])+h("Paso a paso")+mp([[String.raw`Tras F: \(2\mu+2(1-\mu)=2&gt;1\) → F.`,"Pago esperado del chico."],[String.raw`Tras C: \(3&gt;0\) → C.`,""],[String.raw`Tabla 1: F → 3, C → 1 → F. Tabla 2: F → 1, C → 3 → C.`,"Mejor mensaje de cada tipo dada la respuesta."],[String.raw`\(\mu=\frac{p\cdot1}{p\cdot1+(1-p)\cdot0}=1\); \(\mu'=\frac{p\cdot0}{p\cdot0+(1-p)\cdot1}=0\).`,"Regla de Bayes en la separadora."]]),
"t4-6":h(E)+mp([[String.raw`\(q_i=a-p_i-b_ip_j\), costos cero → \(\pi_i=p_iq_i\).`,"Beneficio = ingreso."],[String.raw`\(b_i\in\{b_A,b_B\}\), \(P(b_A)=\theta\), independientes.`,String.raw`Para el valor esperado \(\bar b\).`],[String.raw`La 1 conoce \(b_1\) y \(b_2\); la 2 solo \(b_2\).`,"La 1 condiciona en los dos; la 2 solo en el suyo."]])+h("Paso a paso")+mp([[String.raw`\(\partial\pi_1/\partial p_1=a-2p_1-b_1p_2=0\Rightarrow p_1=\frac{a-b_1p_2(b_2)}{2}\).`,String.raw`La 1 sabe qué precio cobra la 2, porque conoce \(b_2\).`],[String.raw`\(\partial E[\pi_2]/\partial p_2=a-2p_2-b_2E[p_1]=0\).`,String.raw`La 2 promedia sobre \(b_1\).`],[String.raw`\(E[p_1]=\frac{a-(\theta b_A+(1-\theta)b_B)p_2}{2}=\frac{a-\bar bp_2}{2}\).`,"Linealidad."],[String.raw`\(2p_2=a-\frac{b_2(a-\bar bp_2)}{2}\Rightarrow4p_2=2a-ab_2+b_2\bar bp_2\).`,"Multiplicando por 2."],[String.raw`\(p_2(4-b_2\bar b)=a(2-b_2)\Rightarrow p_2^*=\frac{a(2-b_2)}{4-b_2\bar b}\).`,""],[String.raw`\(p_1^*=\frac a2\Big(1-\frac{b_1(2-b_2)}{4-b_2\bar b}\Big)\).`,String.raw`Se reemplaza \(p_2^*\).`]]),
"t4-7":h(E)+mp([[String.raw`Fórmula de Bayes para una partición \(\{A_j\}\) y un evento \(B\).`,String.raw`Se aplica con \(A_j\) = tipos de los demás, \(B\) = tipo propio.`]])+h("Paso a paso")+mp([[String.raw`\(A_j=\{t_{-i}=t_{-i}^j\}\): disjuntos y su unión es todo.`,"Partición finita."],[String.raw`\(p(A_j)p(B\mid A_j)=p(A_j\cap B)=p(t_{-i}^j,t_i)\).`,"Definición de probabilidad condicional."],[String.raw`\(\sum_kp(A_k\cap B)=p(B)=p(t_i)\).`,"Probabilidad total."],[String.raw`\(p(t_{-i}\mid t_i)=\frac{p(t_{-i},t_i)}{\sum_{t'_{-i}}p(t'_{-i},t_i)}\).`,"Cociente."]]),
"t4-8":h(E)+mp([[String.raw`Naturaleza: \(t_1\) y \(t_2\) con 0,5.`,"Previa para Bayes."],[String.raw`Pagos del 2 tras I: \(t_1\): a 3, b 0; \(t_2\): a 4, b 1.`,String.raw`Para \(\pi_2\) con \(\mu\).`],[String.raw`Pagos del 2 tras D: \(t_1\): a 1, b 0; \(t_2\): a 2, b 1.`,String.raw`Para \(\pi_2\) con \(\mu'\).`],[String.raw`Pagos del 1 con a: \(t_1\): I 1, D 2; \(t_2\): I 2, D 1.`,"Lo que compara cada tipo."]])+h("Paso a paso")+mp([[String.raw`\(\pi_2(a\mid I)=3\mu+4(1-\mu)=4-\mu\); \(\pi_2(b\mid I)=1-\mu\).`,"a gana por 3."],[String.raw`\(\pi_2(a\mid D)=\mu'+2(1-\mu')=2-\mu'\); \(\pi_2(b\mid D)=1-\mu'\).`,"a gana por 1."],[String.raw`\(t_1\): D (2) &gt; I (1). \(t_2\): I (2) &gt; D (1).`,""],[String.raw`\(\mu=\frac{0{,}5\cdot0}{0{,}5\cdot0+0{,}5\cdot1}=0\); \(\mu'=\frac{0{,}5\cdot1}{0{,}5\cdot1+0{,}5\cdot0}=1\).`,"Bayes con (D, I)."]]),
"t4-9":h(E)+mp([[String.raw`Pagos del 2 tras I: \(t_1\): a 4, b 0; \(t_2\): a 4, b 1.`,""],[String.raw`Pagos del 2 tras D: \(t_1\): a 1, b 0; \(t_2\): a 0, b 2.`,"Aquí sí depende de la creencia."],[String.raw`Pagos del 1: \(t_1\): I a 2, I b 1, D a 2, D b 0. \(t_2\): I a 2, I b 1, D a 1, D b 1.`,"Para revisar desvíos."]])+h("Paso a paso")+mp([[String.raw`Tras I: \(4\) frente a \(1-\mu\) → a.`,""],[String.raw`Tras D: \(\mu'\ge2-2\mu'\iff3\mu'\ge2\iff\mu'\ge\frac23\) → a; si no, b.`,"Umbral."],[String.raw`(I, I): \(\mu=\frac{0{,}5}{0{,}5+0{,}5}=\frac12\); ambos tipos ganan 2.`,"Bayes."],[String.raw`\(t_1\) desviándose a D: 2 (si a) o 0 (si b) ≤ 2. \(t_2\): 1 &lt; 2.`,"No hay ganancia estricta: se sostiene con cualquier respuesta tras D."],[String.raw`(D, D): \(\mu'=\frac12&lt;\frac23\) → b; \(t_1\) gana 0 y con I ganaría 2.`,"Falla."],[String.raw`(I, D): \(\mu=1,\mu'=0\) → (a, b); \(t_2\) gana 1 y con I 2.`,"Falla."],[String.raw`(D, I): \(\mu=0,\mu'=1\) → (a, a); \(t_1\): 2 = 2; \(t_2\): 2 &gt; 1.`,"Es EBP."]])};
for(const tl of TALLERES)for(const p of (tl.puntos||[]))if(M[p.id])p.micro=M[p.id];})();


// ===================== AJUSTE AL PROGRAMA 1503704 =====================
(function(){
const ins=(after,items)=>{const i=TRUNK.findIndex(t=>t.id===after);TRUNK.splice(i<0?TRUNK.length:i+1,0,...items)};
ins("continuas",[
{id:"suscripcion", t:"Bienes públicos y mecanismos de suscripción", sim:"suscrip", html:String.raw`
<section><h3>Incentivos y eficiencia en la provisión de bienes públicos</h3><p class="lead">En un juego de contribuciones voluntarias, cada jugador \(i\) tiene una dotación \(w\) y aporta \(c_i\) a un fondo común. Cada peso aportado produce \(a\) unidades de beneficio para <b>cada</b> jugador (rendimiento marginal per cápita).</p>
<div class="mj">\[u_i=w-c_i+a\sum_{j=1}^n c_j\qquad\frac{\partial u_i}{\partial c_i}=-1+a\]</div>
<ul><li>Si \(a<1\), aportar nada es estrategia <b>dominante</b>: el único equilibrio de Nash es \(c_i=0\) para todos (free riding).</li><li>Si \(na>1\), lo socialmente óptimo es que todos aporten todo. Hay un dilema del prisionero de \(n\) jugadores.</li></ul></section>
<section><h3>Mecanismos de suscripción (umbral o punto de provisión)</h3>
<p>El bien se provee solo si las suscripciones suman al menos el costo \(C\); si no, se devuelve el dinero. Con valoraciones \(v_i\):</p><ul>
<li>Cualquier perfil de aportes que sume <b>exactamente</b> \(C\), con \(c_i\le v_i\), es un equilibrio de Nash: nadie quiere aportar menos (el bien no se proveería) ni más (sería un desperdicio).</li>
<li>También es equilibrio que nadie aporte (si ningún jugador solo puede cubrir \(C\)): hay un problema de coordinación.</li>
<li>Los mecanismos de Clarke-Groves (pivote) hacen que revelar la valoración verdadera sea dominante, a costa de no equilibrar el presupuesto.</li></ul>
<p class="link">Aplicaciones: vacas comunitarias, juntas de acción comunal, crowdfunding con meta («todo o nada»).</p></section>
${LAB}`,
qs:[{q:"Con n = 4 y a = 0,5, ¿cuánto aporta cada jugador en equilibrio y cuánto en el óptimo?",a:"En equilibrio nada (a < 1); en el óptimo todo, porque na = 2 > 1."}]}]);
ins("eps",[
{id:"repetidos", t:"Juegos repetidos y el teorema de Folk", sim:"folk", html:String.raw`
<section><h3>Repetición finita</h3><p class="lead">Si un juego con un único equilibrio de Nash (como el dilema del prisionero) se repite un número finito y conocido de veces, la inducción hacia atrás lleva a jugar el equilibrio en cada ronda: la cooperación no se sostiene.</p></section>
<section><h3>Repetición infinita y estrategias de gatillo</h3>
<p>Con horizonte infinito y factor de descuento \(\delta\), la estrategia <b>gatillo</b> (cooperar mientras el otro coopere; si alguien se desvía, castigar con el equilibrio de Nash para siempre) sostiene la cooperación si</p>
<div class="mj">\[\frac{R}{1-\delta}\ge T+\frac{\delta P}{1-\delta}\iff\delta\ge\delta^*=\frac{T-R}{T-P}\]</div>
<p>donde \(R\) es el pago de cooperar, \(T\) la tentación de desviarse y \(P\) el castigo. Las estrategias se verifican como equilibrio perfecto en subjuegos con el <b>principio de la desviación en una etapa</b>.</p></section>
<section><h3>Teorema de Folk</h3>
<p>Cualquier vector de pagos factible que dé a cada jugador más que su pago minimax puede sostenerse como equilibrio perfecto en subjuegos de un juego infinitamente repetido, si los jugadores son suficientemente pacientes (Friedman, 1971; Fudenberg y Maskin, 1986). Hay muchísimos equilibrios: la repetición explica la cooperación, pero no predice cuál ocurrirá.</p>
<p class="link">Aplicaciones: colusión tácita en Cournot o Bertrand repetido, reputación, contratos implícitos, el salario de eficiencia en la relación sindicato-empresa.</p></section>
${LAB}`,
qs:[{q:"En un dilema con T = 5, R = 3 y P = 1, ¿qué δ mínimo sostiene la cooperación con gatillo?",a:"δ* = (5 − 3)/(5 − 1) = 0,5."}]}]);
ins("ebp",[
{id:"senalizacion", t:"Juegos de señalización", sim:"spence", html:String.raw`
<section><h3>Estructura</h3><p class="lead">Un emisor conoce su tipo (alta o baja productividad, calidad del producto) y envía una señal; el receptor, que no ve el tipo, actualiza sus creencias con la regla de Bayes y responde. Se resuelve con el <b>equilibrio bayesiano perfecto</b>.</p></section>
<section><h3>Tipos de equilibrio</h3><ul>
<li><b>Separador:</b> cada tipo envía una señal distinta; el receptor infiere el tipo con certeza.</li>
<li><b>Agrupador (pooling):</b> todos los tipos envían la misma señal; las creencias son las probabilidades a priori.</li>
<li><b>Semiseparador:</b> algún tipo mezcla entre señales.</li></ul>
<p>Fuera de la trayectoria de equilibrio las creencias son libres; los refinamientos (criterio intuitivo de Cho y Kreps) descartan creencias poco razonables.</p></section>
<section><h3>El modelo de Spence (1973)</h3>
<p>Los trabajadores de tipo alto (\(\theta_H\)) y bajo (\(\theta_L\)) eligen educación \(e\), que no aumenta la productividad pero cuesta \(c_H e\) o \(c_L e\), con \(c_H&lt;c_L\). Las empresas pagan la productividad esperada. En un equilibrio separador con umbral \(e^*\) (salario \(\theta_H\) si \(e\ge e^*\)):</p>
<div class="mj">\[\theta_H-c_He^*\ge\theta_L\quad\text{y}\quad\theta_L\ge\theta_H-c_Le^*\;\Longrightarrow\;\frac{\theta_H-\theta_L}{c_L}\le e^*\le\frac{\theta_H-\theta_L}{c_H}\]</div>
<p>La señal funciona porque es más costosa para el tipo bajo. El separador menos costoso (Riley) usa el menor \(e^*\) posible.</p></section>
${LAB}`,
qs:[{q:"Con θH = 10, θL = 4, cH = 1 y cL = 3, ¿qué niveles de educación sostienen un equilibrio separador?",a:"Entre (10 − 4)/3 = 2 y (10 − 4)/1 = 6."}]}]);
const P={representacion:"Unidad 1 · Estructura teórica",dominancia:"Unidad 2 · Análisis de la forma estratégica",eps:"Unidad 3 · Refinamientos del equilibrio de Nash",bayesnash:"Unidad 4 · Información incompleta"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
})();

// ===================== LABORATORIOS: CASOS REALES (Teoría de Juegos) =====================
const LABORATORIOS=[
{id:"lab-guerra",t:"¿Bajar precios para quitarle clientes al competidor? La guerra de precios como juego repetido",sector:"Comercio · estrategia de precios",links:["repetidos","nash"],sim:"tjGuerra",
 caso:{hDatos:"El juego",hPaso:"Del juego a la decisión",rt:"Hazlo a mano",
 sit:String.raw`<p>Dos ferreterías del mismo barrio venden con margen normal. Una piensa bajar precios un mes para robarle clientes a la otra. Sabe que la otra puede responder bajando también, y que entonces las dos quedarían con márgenes bajos de ahí en adelante.</p>
<p class="hint">Ojo: acordar precios con un competidor está prohibido por las normas de libre competencia (la SIC lo sanciona). El caso analiza una decisión <b>que cada empresa toma por su cuenta</b>: si le conviene empezar una guerra de precios.</p>`,
 preg:String.raw`<p>¿Cuándo conviene mantener el precio normal y cuándo desviarse?</p>`,
 datos:String.raw`<p>Utilidad mensual de cada ferretería (millones), con la notación del curso:</p>
<table class="tbl"><tr><th></th><th>Otro: precio normal</th><th>Otro: rebaja</th></tr>
<tr><td>Precio normal</td><td>\(R=10\)</td><td>\(S=2\)</td></tr>
<tr><td>Rebaja</td><td>\(T=16\)</td><td>\(P=5\)</td></tr></table>
<p>Jugado una sola vez es un dilema del prisionero: rebajar es dominante y el equilibrio es (rebaja, rebaja) con 5 cada uno.</p>`,
 paso:String.raw`<ol><li><b>Juego repetido con estrategia de gatillo:</b> mantengo el precio normal mientras el otro lo mantenga; si rebaja, rebajo para siempre.</li>
<li><b>Mantener para siempre</b> vale \(\dfrac{R}{1-\delta}\). <b>Desviarse</b> vale \(T+\dfrac{\delta P}{1-\delta}\): se gana \(T\) un mes y después \(P\) todos los meses.</li>
<li><b>Condición:</b> mantener conviene si \(\delta\ge\delta^*=\dfrac{T-R}{T-P}=\dfrac{16-10}{16-5}=0{,}545\).</li>
<li><b>¿Qué es \(\delta\) en la vida real?</b> Junta la paciencia y la probabilidad de que la relación siga: \(\delta=\dfrac{p}{1+r}\), con \(r\) la tasa mensual de descuento y \(p\) la probabilidad de que ambos sigan en el barrio el próximo mes. Con \(r=1{,}5\,\%\) y \(p=0{,}9\): \(\delta=0{,}887\).</li>
<li>Como \(0{,}887\ge0{,}545\), desviarse no conviene: \(10/0{,}1133=88{,}3\) frente a \(16+0{,}887(5)/0{,}1133=55{,}1\) millones en valor presente.</li></ol>`,
 simh:"Cambia los pagos y lo que define δ (tasa de descuento y probabilidad de que la relación siga). Verás cuándo la rebaja deja de ser buena idea.",
 benef:String.raw`<p>Empezar la guerra de precios da 6 millones extra el primer mes y cuesta 5 millones cada mes siguiente. En valor presente, la ferretería pierde unos 33 millones por ganar 6. El análisis también muestra <b>cuándo sí</b> se rompe la paz: si uno de los dos está por cerrar o vender (\(p\) bajo), \(\delta\) cae por debajo de \(\delta^*\) y la rebaja se vuelve racional. Es la señal para vigilar al competidor.</p>`,
 limite:String.raw`<ul><li>Supone que la rebaja del otro se ve de inmediato. Si los precios son secretos (descuentos por fuera de la lista), castigar es difícil y la cooperación se rompe con más facilidad.</li>
<li>Con muchos competidores, \(T\) sube (se roban más clientes) y \(\delta^*\) se acerca a 1.</li>
<li>El castigo «para siempre» es extremo. Con castigos de pocos meses la condición es más exigente.</li></ul>`,
 r:String.raw`δ* = (T − R) / (T − P) = (16 − 10) / (16 − 5) = 0,545
δ  = p / (1 + r) = 0,9 / 1,015 = 0,887
Mantener: R / (1 − δ) = 10 / 0,1133 = 88,3
Desviar:  T + δP / (1 − δ) = 16 + 0,887·5 / 0,1133 = 55,1`}},
{id:"lab-costos",t:"Invertir para bajar costos frente a un rival: el efecto estratégico en Cournot",sector:"Industria · inversión en tecnología",links:["continuas","nash"],sim:"tjCournot",
 caso:{hDatos:"El modelo",hPaso:"Del modelo a la decisión",rt:"Hazlo a mano",
 sit:String.raw`<p>Dos plantas producen el mismo insumo y compiten en cantidades. La empresa 1 puede comprar una máquina que baja su costo unitario de 40 a 30. Su gerente calcula el beneficio suponiendo que el rival seguirá produciendo lo mismo.</p>`,
 preg:String.raw`<p>¿Cuánto vale de verdad bajar el costo, si el rival reacciona?</p>`,
 datos:String.raw`<p>Demanda inversa \(P=a-Q\) con \(a=100\), \(Q=q_1+q_2\), costos \(c_1\) y \(c_2=40\). La mejor respuesta de cada uno es \(q_i^*=\tfrac12(a-q_j-c_i)\) y el equilibrio de Cournot:</p>
<p>\(q_1^*=\dfrac{a-2c_1+c_2}{3}\), \(q_2^*=\dfrac{a-2c_2+c_1}{3}\), \(\pi_i=(q_i^*)^2\).</p>`,
 paso:String.raw`<ol><li><b>Antes:</b> \(c_1=c_2=40\): \(q_1^*=q_2^*=20\), \(P=60\), \(\pi_1=400\).</li>
<li><b>Cálculo ingenuo</b> (el rival sigue en 20): la mejor respuesta es \(q_1=\tfrac12(100-20-30)=25\), \(P=55\), \(\pi_1=25\cdot25=625\). Ganancia: 225.</li>
<li><b>Nuevo equilibrio:</b> con \(c_1=30\): \(q_1^*=(100-60+40)/3=26{,}67\) y \(q_2^*=(100-80+30)/3=16{,}67\). El rival produce <b>menos</b> porque la empresa 1 ahora es más agresiva.</li>
<li>\(P=56{,}67\) y \(\pi_1=26{,}67^2=711{,}1\). Ganancia: 311.</li>
<li><b>Efecto estratégico:</b> \(311-225=86\), un 38 % más de lo que veía el gerente.</li></ol>`,
 simh:"Mueve la demanda y los costos. Las líneas son las mejores respuestas; el punto donde se cruzan es el equilibrio.",
 benef:String.raw`<p>Si la máquina cuesta el equivalente a 280 en utilidad presente, el cálculo ingenuo (225) la rechaza y el de equilibrio (311) la acepta. Ignorar la reacción del rival lleva a <b>invertir de menos</b> en reducir costos. La misma lógica sirve para capacidad instalada: comprometerse a producir más empuja al rival a producir menos.</p>`,
 limite:String.raw`<ul><li>Si compiten en precios (Bertrand) con productos casi iguales, el efecto cambia: bajar costos puede llevar a una guerra de precios.</li>
<li>Supone que el rival conoce el nuevo costo. Si no lo sabe, no reacciona hasta notarlo.</li>
<li>Con demanda no lineal las fórmulas cambian, pero el método (mejores respuestas y su cruce) es el mismo.</li></ul>`,
 r:String.raw`q1* = (a − 2c1 + c2) / 3 = (100 − 60 + 40) / 3 = 26,67
q2* = (a − 2c2 + c1) / 3 = (100 − 80 + 30) / 3 = 16,67
P   = a − q1* − q2* = 56,67
π1  = (P − c1)·q1* = 26,67 · 26,67 = 711,1`}},
{id:"lab-auditoria",t:"¿A cuántos contribuyentes auditar? El juego de inspección en estrategias mixtas",sector:"Sector público · administración tributaria",links:["mixtas","nash"],sim:"tjAuditoria",
 caso:{hDatos:"El juego",hPaso:"Del juego a la decisión",rt:"Hazlo a mano",
 sit:String.raw`<p>Una administración de impuestos decide con qué probabilidad audita a un grupo de contribuyentes. Cada contribuyente decide si declara todo o esconde ingresos. Ninguno puede ser predecible: si la entidad audita siempre, gasta de más; si nunca audita, todos evaden.</p>`,
 preg:String.raw`<p>¿Con qué probabilidad hay que auditar y cuánta evasión queda en equilibrio? ¿Qué baja más la evasión: subir la sanción o abaratar las auditorías?</p>`,
 datos:String.raw`<ul><li>Impuesto que el contribuyente ahorra si evade y no lo auditan: \(g=10\) millones.</li>
<li>Si lo auditan y evadió: paga \(g\) más una sanción \(F=10\) millones (supuesto).</li>
<li>Costo de cada auditoría para la entidad: \(k=2\) millones. Si audita a un evasor, recauda \(g+F\).</li></ul>
<table class="tbl"><tr><th>Contribuyente \ Entidad</th><th>Audita (q)</th><th>No audita (1 − q)</th></tr>
<tr><td>Evade (p)</td><td>\(-F\,;\;g+F-k\)</td><td>\(g\,;\;0\)</td></tr>
<tr><td>Declara</td><td>\(0\,;\;-k\)</td><td>\(0\,;\;0\)</td></tr></table>
<p class="hint">Pagos medidos frente a declarar todo. No hay equilibrio en estrategias puras.</p>`,
 paso:String.raw`<ol><li><b>La entidad elige \(q\) para que el contribuyente quede indiferente:</b> \((1-q)g-qF=0\Rightarrow q^*=\dfrac{g}{g+F}=\dfrac{10}{20}=0{,}5\).</li>
<li><b>El contribuyente elige \(p\) para que la entidad quede indiferente:</b> auditar vale \(p(g+F-k)+(1-p)(-k)=p(g+F)-k\) y no auditar vale 0, así que \(p^*=\dfrac{k}{g+F}=\dfrac{2}{20}=0{,}1\).</li>
<li><b>Lectura cruzada (lo típico de las mixtas):</b> la evasión de equilibrio \(p^*\) no depende de lo que gana el evasor, sino del costo de auditar. Y la frecuencia de auditoría \(q^*\) depende de la sanción.</li>
<li><b>Subir la sanción a \(F=30\):</b> \(q^*=0{,}25\) y \(p^*=0{,}05\). Se audita la mitad de veces y la evasión cae a la mitad.</li>
<li><b>Abaratar auditorías a \(k=1\)</b> (cruces automáticos de información): \(p^*=0{,}05\), sin cambiar \(q^*\).</li></ol>`,
 simh:"Cambia el beneficio de evadir, la sanción y el costo de auditar. Mira cómo se mueven la probabilidad de auditoría y la evasión de equilibrio.",
 benef:String.raw`<p>Con 10.000 contribuyentes en el grupo, pasar de \(F=10\) a \(F=30\) baja las auditorías esperadas de 5.000 a 2.500 (ahorro de 5.000 millones en costo de auditar) y la evasión esperada de 1.000 a 500 contribuyentes. El modelo dice dónde poner la plata: <b>sanciones creíbles y auditorías baratas</b> rinden más que auditar a todos.</p>`,
 limite:String.raw`<ul><li>Supone que el contribuyente conoce la probabilidad de auditoría. Si la sobrestima, evade menos de lo que predice el modelo.</li>
<li>Una sanción muy alta puede no ser creíble (difícil de cobrar o impugnada) y entonces no disuade.</li>
<li>Contribuyentes distintos (grandes y pequeños) necesitan probabilidades distintas: se resuelve un juego por grupo.</li></ul>`,
 r:String.raw`Contribuyente indiferente: (1 − q)·g = q·F    →  q* = g / (g + F) = 10 / 20 = 0,5
Entidad indiferente:      p·(g + F) − k = 0  →  p* = k / (g + F) = 2 / 20 = 0,1
Con F = 30: q* = 10/40 = 0,25 ; p* = 2/40 = 0,05`}}
];
