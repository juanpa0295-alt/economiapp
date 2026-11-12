
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
<li>Comparación: como \(\rho'<0\) y \(h_i<H\), el término \(\rho'(H)h_i\) es menos negativo que \(\rho'(H)H\). A cada pescador le parece más barato trabajar una hora más de lo que realmente le cuesta al grupo: \(H^*>H^{**}\).</li></ol>`,
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
enun:String.raw`<p>\(N\) empresas, \(P(Q)=a-bQ\), costo \(c\,q_i\), \(c<a\), deciden simultáneamente sus cantidades. ¿Cuál es el equilibrio de Nash? ¿Qué ocurre si \(N\to\infty\)?</p>`,
saber:[String.raw`Juego simétrico: se resuelve la condición de primer orden de una firma y se impone \(q_i^*=q^*\) para todas.`],
sol:String.raw`<ol class="steps"><li>\(\pi_i=(a-bQ)\,q_i-c\,q_i\). Condición de primer orden: \(a-bQ_{-i}-2bq_i-c=0\), así que \(r_i(Q_{-i})=\frac{a-c-bQ_{-i}}{2b}\).</li>
<li>Con simetría \(Q_{-i}=(N-1)q^*\): \(a-c-b(N-1)q^*-2bq^*=0\Rightarrow q^*=\dfrac{a-c}{(N+1)b}\).</li>
<li>\(Q^*=\dfrac{N(a-c)}{(N+1)b}\), \(P^*=\dfrac{a+Nc}{N+1}\) y \(\pi_i^*=\dfrac{(a-c)^2}{(N+1)^2b}\).</li>
<li>Si \(N\to\infty\): \(P^*\to c\), \(Q^*\to(a-c)/b\) (la cantidad competitiva) y el beneficio de cada firma tiende a 0.</li></ol>`,
res:String.raw`<p>\(q^*=\frac{a-c}{(N+1)b}\) y \(P^*=\frac{a+Nc}{N+1}\). Con muchas firmas, Cournot converge a la competencia perfecta.</p>`},

{id:"t2-4",n:"4",t:"Bertrand en Gibbons (sección 1.2.B)",tipo:"Estrategias continuas",temas:["bertrand","continuas"],tool:{id:"bertrand",lbl:"Ir a Bertrand"},
enun:String.raw`<p>Estudie el modelo de duopolio de Bertrand (Gibbons, cap. 1, sección 1.2.B): su forma estratégica y el equilibrio de Nash en puras.</p>`,
saber:[String.raw`En Gibbons los productos son diferenciados: \(q_i(p_i,p_j)=a-p_i+b\,p_j\), con \(0<b<2\) y costo marginal \(c<a\).`],
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
res:String.raw`<p>EN: \(e_1^*=e_2^*=c\), con bienestar \(c^2\) cada uno. Si ambos pusieran \(c+k\) con \(0<k<c\), tendrían \((c+k)c>c^2\): en equilibrio se esfuerzan menos de lo que les convendría a los dos.</p>`},

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
