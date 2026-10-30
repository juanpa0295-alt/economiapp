// Principios de Macroeconomía · contenido de la ruta (módulos de Economiapp + ramas)
// =====================================================================
// CONTENIDO: Principios de Macroeconomía. El tronco son los tres módulos de Economiapp.
// =====================================================================
const LAB=`<section><h3>Laboratorio</h3><div class="sim" id="sim"></div></section>`;
const TRUNK=[
{id:"pib", t:"PIB y multiplicador keynesiano", sim:"pib", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">Por el enfoque del gasto, el PIB es la suma de lo que se gasta en bienes y servicios finales. En el modelo keynesiano simple, la producción se ajusta a ese gasto, y como el consumo depende del ingreso, cada peso de gasto autónomo se multiplica.</p>
<div class="mj">\[Y=C+I+G,\qquad C=C_0+c_1(Y-T)\]</div></section>
<section><h3>Equilibrio</h3>
<p>Reemplazando el consumo y despejando \(Y\):</p>
<div class="mj">\[Y=C_0+c_1(Y-T)+I+G\;\Longrightarrow\;Y^*=\underbrace{\frac{1}{1-c_1}}_{\text{multiplicador}}\big[\underbrace{C_0-c_1T+I+G}_{\text{gasto autónomo}}\big]\]</div>
<p>Con \(c_1=0{,}8\) el multiplicador es 5: un aumento de 1 en el gasto público eleva el PIB en 5, porque genera ingreso que se vuelve a gastar en rondas sucesivas \(1+0{,}8+0{,}8^2+\dots=\frac{1}{1-0{,}8}\).</p></section>
<section><h3>Multiplicadores</h3>
<div class="tbl"><table><tr><th>Cambio</th><th>Efecto sobre Y</th><th>Con c₁ = 0,8</th></tr>
<tr><td>Gasto público \(G\) o inversión \(I\)</td><td>\(\frac{\partial Y}{\partial G}=\frac{1}{1-c_1}\)</td><td class="num">5</td></tr>
<tr><td>Impuestos \(T\)</td><td>\(\frac{\partial Y}{\partial T}=-\frac{c_1}{1-c_1}\)</td><td class="num">−4</td></tr>
<tr><td>Propensión a consumir \(c_1\)</td><td>\(\frac{\partial Y}{\partial c_1}=\frac{C_0-T+I+G}{(1-c_1)^2}\)</td><td>Depende del nivel de gasto</td></tr></table></div>
<p>El multiplicador de los impuestos es menor en valor absoluto porque una parte de la rebaja de impuestos se ahorra.</p></section>
${LAB}`,
deep:[
{k:"Derivada",t:"∂Y/∂G",html:String.raw`<div class="mj">\[\frac{\partial Y}{\partial G}=\frac{1}{1-c_1}\cdot\frac{\partial}{\partial G}\big[C_0-c_1T+I+G\big]=\frac{1}{1-c_1}(0-0+0+1)=\frac{1}{1-c_1}\]</div>`},
{k:"Derivada",t:"∂Y/∂T",html:String.raw`<div class="mj">\[\frac{\partial Y}{\partial T}=\frac{1}{1-c_1}\cdot(-c_1)=-\frac{c_1}{1-c_1}\]</div>`},
{k:"Derivada",t:"∂Y/∂c₁ (regla del cociente)",html:String.raw`<p>Con \(u=C_0-c_1T+I+G\) y \(v=1-c_1\): \(u'=-T\), \(v'=-1\).</p><div class="mj">\[\frac{\partial Y}{\partial c_1}=\frac{u'v-uv'}{v^2}=\frac{-T(1-c_1)+(C_0-c_1T+I+G)}{(1-c_1)^2}=\frac{C_0-T+I+G}{(1-c_1)^2}\]</div><p>La app solo mostraba el resultado que daba SymPy; aquí está el desarrollo completo.</p>`}],
py:`def pib_equilibrio(C0, c1, T, I, G):
    """Módulo «PIB (enfoque gasto)» de Economiapp."""
    multiplicador = 1 / (1 - c1)
    gasto_autonomo = C0 - c1 * T + I + G
    Y = multiplicador * gasto_autonomo
    C = C0 + c1 * (Y - T)
    return {"multiplicador": multiplicador, "Y": Y, "C": C,
            "dY_dG": multiplicador, "dY_dT": -c1 * multiplicador}`,
qs:[{q:"Con c₁ = 0,75, ¿cuánto sube el PIB si el gobierno gasta 100 más?",a:String.raw`El multiplicador es \(1/(1-0{,}75)=4\): el PIB sube 400.`},
 {q:"¿Por qué el multiplicador de los impuestos es menor que el del gasto?",a:"Porque el gasto público entra completo a la demanda, mientras que una baja de impuestos aumenta el ingreso disponible y de eso solo se consume la fracción c₁."}]},

{id:"dinero", t:"Mercado de dinero", sim:"din", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">La tasa de interés es el precio que equilibra la oferta de dinero, que controla el banco central, con la demanda de dinero de la gente.</p>
<div class="mj">\[\underbrace{\frac{M}{P}}_{\text{oferta real}}=\underbrace{kY-hr}_{\text{demanda }L(r,Y)}\;\Longrightarrow\;r^*=\frac{kY-M/P}{h}\]</div></section>
<section><h3>Los dos motivos de la demanda de dinero</h3>
<div class="tbl"><table><tr><th>Parámetro</th><th>Motivo</th><th>Lectura</th></tr>
<tr><td>\(k\)</td><td>Transacción</td><td>Con más ingreso se hacen más compras y se necesita más dinero</td></tr>
<tr><td>\(h\)</td><td>Especulación</td><td>Con tasas altas conviene tener bonos en vez de dinero</td></tr></table></div></section>
<section><h3>La curva LM</h3>
<p>Las combinaciones de \(Y\) y \(r\) que equilibran el mercado de dinero forman la curva LM. Su pendiente es</p>
<div class="mj">\[\frac{\partial r}{\partial Y}=\frac{k}{h}>0\]</div>
<p>Si el ingreso sube, la gente demanda más dinero; con la oferta fija, la tasa debe subir para reducir la demanda especulativa.</p></section>
${LAB}
<p class="link"><b>Política monetaria:</b> si el banco central aumenta \(M\), la tasa baja: \(\frac{\partial r}{\partial M}=-\frac{1}{Ph}\).</p>`,
deep:[{k:"Revisión",n:true,t:"Las unidades de la tasa de interés",html:String.raw`<p>Con los valores del JSON de Economiapp (\(k=0{,}5\), \(Y=3.000.000\), \(M=500.000\), \(h=20.000\)) la tasa de equilibrio da \(r^*=50\). La app la mostraba como «5.000 %», que no tiene sentido económico. El problema está en la escala de \(h\): para que \(r\) quede como una fracción razonable (por ejemplo 0,05), \(h\) tendría que ser del orden de veinte millones. Aquí \(r\) se muestra tal como sale de la fórmula, sin convertirla a porcentaje.</p>`}],
py:`def mercado_dinero(M, P, Y, k, h):
    """Módulo «Mercado de dinero» de Economiapp."""
    oferta_real = M / P
    r = (k * Y - oferta_real) / h
    return {"oferta_real": oferta_real, "r": r,
            "pendiente_LM": k / h, "dr_dM": -1 / (P * h)}`,
qs:[{q:"Si los precios suben y el banco central no cambia M, ¿qué pasa con la tasa de interés?",a:String.raw`La oferta real \(M/P\) cae, así que \(r^*\) sube: es como una contracción monetaria.`}]},

{id:"islm", t:"Modelo IS-LM", sim:"islm", html:String.raw`
<section><h3>La idea</h3>
<p class="lead">El modelo IS-LM junta el mercado de bienes y el de dinero. La curva IS reúne las combinaciones de \(Y\) y \(r\) que equilibran el mercado de bienes; la LM, las que equilibran el de dinero. Donde se cruzan, los dos mercados están en equilibrio a la vez.</p></section>
<section><h3>Las dos curvas</h3>
<div class="mj">\[\text{IS:}\;Y=C_0+c_1(Y-T)+I_0-br+G\qquad\qquad\text{LM:}\;\frac{M}{P}=kY-hr\]</div>
<p>La inversión cae con la tasa de interés (\(I=I_0-br\)), por eso la IS tiene pendiente negativa.</p></section>
<section><h3>Equilibrio</h3>
<p>Resolviendo el sistema de dos ecuaciones:</p>
<div class="mj">\[Y^*=\frac{h\,(C_0-c_1T+I_0+G)+b\,\frac{M}{P}}{h(1-c_1)+bk},\qquad r^*=\frac{kY^*-M/P}{h}\]</div></section>
<section><h3>Multiplicadores de política</h3>
<div class="mj">\[\frac{\partial Y}{\partial G}=\frac{h}{h(1-c_1)+bk}\qquad\frac{\partial Y}{\partial M}=\frac{b/P}{h(1-c_1)+bk}\qquad\frac{\partial Y}{\partial T}=-\frac{c_1h}{h(1-c_1)+bk}\]</div>
<p>El multiplicador fiscal es menor que el keynesiano \(\frac{1}{1-c_1}\): al subir el gasto sube la demanda de dinero, la tasa de interés aumenta y la inversión privada cae. Eso es el <b>efecto expulsión</b> (crowding out).</p></section>
${LAB}`,
deep:[{k:"Revisión",n:true,t:"Mismo problema de unidades",html:String.raw`<p>Con los valores del JSON, \(r^*\approx135{,}6\): igual que en el mercado de dinero, la escala de \(h\) y \(b\) no corresponde a una tasa en porcentaje. Los multiplicadores sí son razonables (\(\partial Y/\partial G\approx2{,}22\) frente a 5 del modelo keynesiano simple).</p>`}],
py:`def is_lm(C0, c1, T, I0, b, G, M, P, k, h):
    """Módulo «Modelo IS-LM» de Economiapp (solución cerrada del sistema)."""
    gasto_autonomo = C0 - c1 * T + I0 + G
    den = h * (1 - c1) + b * k
    Y = (h * gasto_autonomo + b * M / P) / den
    r = (k * Y - M / P) / h
    return {"Y": Y, "r": r,
            "mult_G": h / den, "mult_M": (b / P) / den, "mult_T": -c1 * h / den}`,
qs:[{q:"Si la demanda de dinero no depende de la tasa (h → 0), ¿qué efecto tiene la política fiscal?",a:String.raw`\(\partial Y/\partial G=h/(h(1-c_1)+bk)\to0\): la LM es vertical y el gasto público expulsa completamente a la inversión privada.`}]}
];

const BRANCHES=[
{g:"Política fiscal", from:"pib", items:[
 {id:"equilibrado", t:"Multiplicador del presupuesto equilibrado", nuevo:true, sim:"equi", html:String.raw`
<section><h3>La idea</h3><p class="lead">Si el gobierno sube el gasto y lo financia subiendo los impuestos en la misma cantidad, el déficit no cambia, pero el PIB sí: sube exactamente lo mismo que el gasto.</p>
<div class="mj">\[\Delta Y=\frac{1}{1-c_1}\Delta G-\frac{c_1}{1-c_1}\Delta T\;\overset{\Delta G=\Delta T}{=}\;\frac{1-c_1}{1-c_1}\Delta G=\Delta G\]</div></section>${LAB}`,
 qs:[{q:"¿Depende el multiplicador del presupuesto equilibrado de c₁?",a:"No, siempre vale 1 en el modelo keynesiano simple, sea cual sea la propensión a consumir."}]}]},
{g:"Política en IS-LM", from:"islm", items:[
 {id:"expulsion", t:"Política fiscal y monetaria: efecto expulsión", nuevo:true, sim:"expu", html:String.raw`
<section><h3>La idea</h3><p class="lead">Un aumento del gasto desplaza la IS a la derecha: sube el PIB, pero también la tasa de interés, y eso reduce la inversión. Un aumento de la oferta monetaria desplaza la LM a la derecha: baja la tasa, sube la inversión y sube el PIB.</p>
<div class="mj">\[\text{Expulsión}=\Delta I=-b\,\Delta r\]</div></section>${LAB}`}]}
];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS=[
 {id:"formulas",t:"Hoja de fórmulas",anchor:"islm",links:["pib","dinero","islm"],sim:"hoja",html:WSBOX,
  d:"Todas las fórmulas de la materia en una sola tabla con buscador, para repasar antes del examen."}
];
