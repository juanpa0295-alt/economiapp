
// ===================== LO ESENCIAL DE CADA ESCUELA, SEGÚN TOBÓN (2023) =====================
// En el libro, «postulado» tiene un sentido preciso: los dos problemas de optimización de la teoría
// neoclásica (empresas que maximizan el beneficio y consumidores que maximizan la utilidad); la teoría
// Clásica del empleo los traslada al mercado de trabajo. Las demás escuelas se caracterizan por su
// paradigma, sus hipótesis o sus ideas centrales. Cada recuadro usa la categoría que usa el libro.
// Formato de cada elemento: [nombre, explicación]; ["§", "Subtítulo"] abre un grupo.
const POSTULADOS = {
 mercantilismo: {esc: "Mercantilismo", tipo: "Ideas centrales", obra: "Pensamiento económico aún no estructurado (cap. 2)", p: [
  ["§", "Mercantilismo monetario"],
  ["La riqueza es el metal precioso", "La riqueza de la nación es el oro y la plata que acumula."],
  ["Balanza comercial favorable", "Exportar más de lo que se importa para que entre metal; lo que gana una nación lo pierde otra."],
  ["Intervención del Estado", "Proteccionismo y monopolios comerciales al servicio del enriquecimiento del reino."],
  ["§", "Mercantilismo del valor"],
  ["La riqueza es la producción", "La riqueza deja de ser el metal y pasa a ser lo que se produce; el trabajo y la tierra aparecen como sus fuentes."]],
  nota: "El libro las presenta como ideas de un pensamiento económico todavía no estructurado: no hay postulados ni hipótesis formales."},
 fisiocracia: {esc: "Fisiocracia", tipo: "Ideas centrales", obra: "Quesnay, Tableau économique (1758); pensamiento aún no estructurado", p: [
  ["Orden natural", "La economía obedece leyes naturales que el gobierno no debe contrariar."],
  ["Solo la tierra da producto neto", "La agricultura es la única actividad que genera un excedente."],
  ["Tres clases", "Productiva (agricultores), propietaria (terratenientes) y estéril (artesanos y comerciantes)."],
  ["La riqueza circula entre las clases", "El Tableau économique describe la reproducción anual del producto neto."],
  ["Laissez faire y impuesto único", "Libertad económica y un solo impuesto sobre la renta de la tierra."]],
  nota: "Como el mercantilismo, es pensamiento económico no estructurado: ideas y doctrina, no postulados formales."},
 smith: {esc: "Smith", tipo: "El paradigma de Smith", obra: "La riqueza de las naciones (1776); cap. 2", p: [
  ["La pregunta", "¿Cómo es posible que una multitud de individuos propietarios de capital y trabajo, descentralizados, independientes, libres y anónimos, coordinen sus intereses y alcancen un estado de cohesión global?"],
  ["La respuesta", "Acceden voluntariamente al mercado porque allí prevalece un sistema de precios que les permite reproducir medios de producción y bienes de subsistencia (la «mano invisible»)."],
  ["Precisión 1: individuos descentralizados, libres y anónimos", "Estado de naturaleza sin Estado; propiedad privada por apropiación original con el trabajo; cada uno decide sin conocer las decisiones de los demás."],
  ["Precisión 2: el egoísmo, no la benevolencia", "La cohesión social nace del interés propio de cada uno («no de la benevolencia del carnicero…»)."],
  ["Precisión 3: el intercambio por medio de precios", "La cohesión la explican los intercambios voluntarios de riqueza a través de un sistema de precios; si son de equilibrio («naturales»), la sociedad es armónica."]],
  nota: "Para Tobón el paradigma es el punto de partida de toda teoría de los precios: cada escuela posterior es una respuesta distinta a esta pregunta."},
 sraffa: {esc: "Sraffa: teoría clásica de los precios de producción", tipo: "Hipótesis", obra: "Producción de mercancías por medio de mercancías (1960); cap. 3", p: [
  ["§", "Datos"],
  ["Técnica de producción conocida", "Un método invariable por sector; todos los bienes son básicos y se producen por medio de bienes. No se necesita ninguna hipótesis sobre rendimientos de escala."],
  ["§", "Hipótesis que cierran el sistema"],
  ["A · Salario único", "w₁ = w₂ = … = w: competencia entre trabajadores."],
  ["B · Salario en bienes", "El salario es una canasta de subsistencia dada; los trabajadores no ahorran ni sus preferencias cuentan."],
  ["C · Tasa de beneficio uniforme", "r₁ = r₂ = … = r: competencia entre capitalistas."],
  ["D · Numerario", "Un precio igual a 1: solo hay precios relativos."]],
  nota: "Solo las decisiones de los capitalistas tienen impacto económico: es la sociedad de los capitalistas. No hay postulados de optimización."},
 marx: {esc: "Marx: teoría del valor-trabajo", tipo: "Elementos de la teoría", obra: "El capital (1867); cap. 4", p: [
  ["Valor-trabajo socialmente necesario", "El valor de un bien es el tiempo de trabajo socialmente necesario para producirlo; valor y dinero están imbricados."],
  ["La fuerza de trabajo crea el valor", "El capitalista compra fuerza de trabajo con su capital dinero D y vende el producto por D′ > D."],
  ["Explotación y plusvalía", "La relación salarial es institucional, no de mercado; el trabajo no pagado es la plusvalía."],
  ["Valor = c + v + s", "Capital constante (se transmite), capital variable (salarios, crea valor nuevo) y plusvalía; de ahí la cuota de plusvalía y la tasa de ganancia."],
  ["Transformación", "La competencia iguala la tasa de ganancia y los valores se transforman en precios de producción (Bortkiewicz-Sweezy)."]],
  nota: "Según el libro, la versión ortodoxa del valor-trabajo hace de Marx un caso particular de Sraffa; lo original es la relación salarial como relación institucional."},
 walras: {esc: "Teoría neoclásica del equilibrio general (Walras)", tipo: "Arquitectura: datos, supuestos, hipótesis, postulados y condiciones", obra: "Elementos de economía política pura (1874); Arrow-Debreu; cap. 5", p: [
  ["§", "Los dos postulados de la economía neoclásica"],
  ["Primer postulado: el problema de las empresas", "Cada empresa maximiza su beneficio sujeto a la función de producción. De ahí salen la oferta de bienes y la demanda de factores (productividad marginal = precio relativo)."],
  ["Segundo postulado: el problema de los consumidores", "Cada consumidor maximiza su utilidad sujeto a la restricción presupuestal (compra bienes con la venta de sus dotaciones). De ahí salen la demanda de bienes y la oferta de factores."],
  ["§", "Sobre qué se apoyan"],
  ["Datos (3)", "Tecnología de las empresas, preferencias de los consumidores y dotaciones iniciales de factores."],
  ["Supuestos (3)", "Rendimientos decrecientes con costos explícitos y variables; preferencias regulares (curvas de indiferencia convexas); dotaciones que permiten sobrevivir sin intercambiar."],
  ["Hipótesis (10)", "Propiedad privada sin Estado, competencia perfecta, precios semipositivos, no hay intercambios en desequilibrio, flexibilidad de precios, sin costos de transacción, sin externalidades, un solo período, mercados completos e información perfecta."],
  ["Condiciones del equilibrio (3)", "Funciones de exceso de demanda continuas (CN), homogéneas de grado cero (HG) y ley de Walras (LW)."]],
  nota: "El equilibrio general se define cuando, a los precios p* ≥ 0, la oferta iguala la demanda en todos los mercados y, bajo esa condición, empresas y consumidores cumplen sus dos postulados (maximizan beneficio y utilidad)."},
 fallos: {esc: "Teorías neoclásicas con fallos de mercado", tipo: "Método", obra: "Friedman y Arrow: el método normativo de la economía positiva; cap. 6", p: [
  ["Punto de partida", "El equilibrio general es la referencia normativa: con sus hipótesis, el equilibrio es un óptimo de Pareto."],
  ["Un fallo es una hipótesis que no se cumple", "Externalidades, información imperfecta, poder de mercado: el equilibrio deja de ser eficiente."],
  ["Se introducen condiciones", "Se buscan las condiciones (impuestos, derechos, contratos, regulación) que rehabilitan los precios como mecanismo de asignación eficiente: economía de la salud y ambiental."],
  ["Asignación sin precios", "En la economía industrial, la teoría de juegos puede dar asignaciones ineficientes sin hacer intervenir el mecanismo de precios."],
  ["El realismo de las hipótesis no importa (Friedman)", "Una teoría se juzga por sus predicciones, no por el realismo de sus hipótesis."]],
  nota: "Los dos postulados neoclásicos se mantienen; lo que cambia son las hipótesis del modelo."},
 pigou: {esc: "Teoría Clásica de la determinación del nivel de empleo", tipo: "Postulados", obra: "La teoría «Clásica» según Keynes (Pigou); cap. 7", p: [
  ["Primer postulado de la economía Clásica", "El salario real es igual a la productividad marginal del trabajo: la demanda de trabajo de las empresas (el primer postulado neoclásico aplicado al trabajo)."],
  ["Segundo postulado de la economía Clásica", "La utilidad del salario es igual a la desutilidad marginal del trabajo: la oferta de trabajo de los hogares (el segundo postulado neoclásico aplicado al trabajo)."],
  ["§", "Con ellos"],
  ["Ley de Walras (y de Say)", "Si los demás mercados se equilibran, el de trabajo también: pleno empleo."],
  ["Desempleo solo por rigidez", "El desempleo involuntario aparece únicamente si el salario real queda rígido por encima del equilibrio."]],
  nota: "Es el único caso, junto con la teoría neoclásica, en que el libro habla de «postulados»: Keynes acepta el primero y rechaza el segundo."},
 keynes: {esc: "Keynes: el principio de la demanda efectiva", tipo: "Hipótesis", obra: "Teoría general (1936); cap. 8", p: [
  ["§", "Las siete hipótesis"],
  ["1 · Existe el dinero", "Monedas y billetes, en una unidad de cuenta establecida por ley del Estado."],
  ["2 · Competencia perfecta en doble ámbito", "Los precios monetarios de los bienes aparecen «como si» fueran dados; el salario monetario se fija en contratos laborales (no expresan oferta y demanda de trabajo), así que es exógeno: «inexistencia» del mercado de trabajo."],
  ["3 · Multitud de empresas y trabajadores", "Sin mercado de trabajo, las decisiones de los trabajadores no se modelan explícitamente."],
  ["4 · Corto plazo de Marshall", "El trabajo es el factor variable y el capital el fijo."],
  ["5 · Flexibilidad de precios y salarios monetarios", "Pueden subir y bajar; se descarta cualquier rigidez, como el salario mínimo."],
  ["6 · Información imperfecta", "La más importante: incertidumbre sobre el futuro; las empresas forman anticipaciones «convencionales». No es un fallo de mercado."],
  ["7 · Bienes y precios agregados", "Una lista de bienes de consumo e inversión con sus precios; a nivel agregado el valor es PQ."],
  ["§", "Frente a los postulados Clásicos"],
  ["Acepta el primer postulado y rechaza el segundo", "No hay un mercado de trabajo que se equilibre: el empleo lo determina la demanda efectiva."]],
  nota: "Keynes no propone postulados nuevos: su teoría se define por sus hipótesis y por el rechazo del segundo postulado."},
 hicks: {esc: "Keynesianismo neoclásico", tipo: "Los dos «caballos de batalla»", obra: "Hicks, Modigliani, Patinkin, Clower, Barro-Grossman, nuevos keynesianos; caps. 9 y 10", p: [
  ["Primer caballo de batalla", "Determinar el empleo aceptando o rechazando la hipótesis 5 de Keynes (flexibilidad de precios y salarios), es decir, restaurando el segundo postulado Clásico como oferta de trabajo."],
  ["Segundo caballo de batalla", "Discutir si la política monetaria es eficaz para reducir el desempleo: aceptar o rechazar la neutralidad del dinero."],
  ["Nuevos keynesianos", "Construyen fundamentos microeconómicos que rehabilitan plenamente los dos postulados neoclásicos y explican rigideces (contratos implícitos, salarios de eficiencia, racionamiento del crédito, rigidez de precios)."]],
  nota: "Es una síntesis: el lenguaje y los postulados son neoclásicos; lo keynesiano son las rigideces o la no neutralidad del dinero."},
 lucas: {esc: "No keynesianismo neoclásico: Friedman y los nuevos Clásicos", tipo: "Hipótesis", obra: "Friedman (1968), Lucas (1972); cap. 11", p: [
  ["Tasa natural (Friedman)", "La curva de Phillips de largo plazo es vertical; con anticipaciones adaptativas, la política solo engaña transitoriamente."],
  ["Anticipaciones racionales (Lucas)", "Los individuos conocen el «verdadero modelo» y no se equivocan sistemáticamente."],
  ["Fundamento de los dos postulados", "Las anticipaciones racionales sirven de fundamento a los dos postulados neoclásicos: maximización del beneficio de las empresas y de la utilidad de los trabajadores."],
  ["Neutralidad del dinero", "Ninguna política monetaria anticipada reduce el desempleo: pleno empleo."]],
  nota: "Restablecen plenamente los principios neoclásicos y rechazan la pertinencia de Keynes."}
};
(function(){
  const css = `.post{border:1.5px solid var(--line);border-left-width:6px;border-radius:12px;padding:14px 16px;background:var(--card)}
.post h3{margin-top:0}.post .obra{color:var(--muted);font-size:.92em;margin:-4px 0 10px}
.post ol{margin:0 0 4px;padding-left:1.4em}.post li{margin:0 0 8px}.post li b{display:block}
.post h4{margin:12px 0 6px;font-size:.98em}
.post .uso{font-size:.92em;color:var(--muted);margin:10px 0 0}
#po-c button{font-family:inherit;text-align:left}`;
  if (typeof document !== "undefined") { const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); }
  const lista = p => { let h = "", open = false;
    p.forEach(([n, d]) => { if (n === "§") { if (open) h += "</ol>"; h += `<h4>${d}</h4><ol>`; open = true; } else { if (!open) { h += "<ol>"; open = true; } h += `<li><b>${n}</b>${d}</li>`; } });
    return h + (open ? "</ol>" : ""); };
  Object.entries(POSTULADOS).forEach(([id, P]) => {
    const t = TRUNK.find(x => x.id === id); if (!t) return;
    const box = `<section class="post"><h3>${P.tipo}: ${P.esc}</h3><p class="obra">${P.obra}</p>${lista(P.p)}<p class="uso">${P.nota}</p></section>`;
    const i = t.html.indexOf("</section>");
    t.html = i >= 0 ? t.html.slice(0, i + 10) + box + t.html.slice(i + 10) : box + t.html;
  });
  const m = TRUNK.find(x => x.id === "mapa");
  if (m) { const i = m.html.indexOf("</section>"); const nota = `<section class="post"><h3>Postulados, hipótesis y paradigma: no son lo mismo</h3><p>En el libro de Tobón, <b>postulado</b> tiene un sentido preciso: son los <b>dos postulados de la economía neoclásica</b>, el problema de las empresas (maximizar el beneficio sujeto a la función de producción) y el de los consumidores (maximizar la utilidad sujeto a la restricción presupuestal). Su cumplimiento, junto con la igualdad de oferta y demanda en todos los mercados, define el equilibrio general. La teoría Clásica del empleo los traslada al mercado de trabajo (primer y segundo postulado Clásico).</p><p>Las demás escuelas no se definen por postulados: Smith por su <b>paradigma</b>, Sraffa y Keynes por sus <b>hipótesis</b>, el mercantilismo y la fisiocracia por sus <b>ideas</b>. Cada estación abre con un recuadro que usa la categoría del libro; el taller «Lo esencial de cada escuela» los reúne todos.</p></section>`;
    m.html = i >= 0 ? m.html.slice(0, i + 10) + nota + m.html.slice(i + 10) : nota + m.html; }
  WORKSHOPS.push({id: "postulados", t: "Lo esencial de cada escuela", anchor: "lucas", links: Object.keys(POSTULADOS).slice(0, 6), sim: "postulados",
    html: `<div class="sim" id="sim"></div>`, d: "Postulados, hipótesis y paradigmas de cada escuela según el libro: verlos, compararlos y adivinar a qué escuela pertenecen."});
})();
