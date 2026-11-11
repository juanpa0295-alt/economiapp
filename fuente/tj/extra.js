
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
<p>Los trabajadores de tipo alto (\(\theta_H\)) y bajo (\(\theta_L\)) eligen educación \(e\), que no aumenta la productividad pero cuesta \(c_H e\) o \(c_L e\), con \(c_H<c_L\). Las empresas pagan la productividad esperada. En un equilibrio separador con umbral \(e^*\) (salario \(\theta_H\) si \(e\ge e^*\)):</p>
<div class="mj">\[\theta_H-c_He^*\ge\theta_L\quad\text{y}\quad\theta_L\ge\theta_H-c_Le^*\;\Longrightarrow\;\frac{\theta_H-\theta_L}{c_L}\le e^*\le\frac{\theta_H-\theta_L}{c_H}\]</div>
<p>La señal funciona porque es más costosa para el tipo bajo. El separador menos costoso (Riley) usa el menor \(e^*\) posible.</p></section>
${LAB}`,
qs:[{q:"Con θH = 10, θL = 4, cH = 1 y cL = 3, ¿qué niveles de educación sostienen un equilibrio separador?",a:"Entre (10 − 4)/3 = 2 y (10 − 4)/1 = 6."}]}]);
const P={representacion:"Unidad 1 · Estructura teórica",dominancia:"Unidad 2 · Análisis de la forma estratégica",eps:"Unidad 3 · Refinamientos del equilibrio de Nash",bayesnash:"Unidad 4 · Información incompleta"};
let cur="";TRUNK.forEach(t=>{if(P[t.id])cur=P[t.id];t.parte=cur});
})();
