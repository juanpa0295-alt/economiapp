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
