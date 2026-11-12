
// ===================== POSTULADOS EXPLÍCITOS =====================
// Cada estación de una escuela abre con sus postulados numerados (los supuestos de los que parte la teoría),
// en el mismo formato, para responder «explique la teoría…» y armar las tablas de diferencias.
const POSTULADOS = {
 mercantilismo: {esc: "Mercantilismo", obra: "Mun, Colbert, Petty (siglos XVI a XVIII)", p: [
  ["La riqueza es el dinero", "En el mercantilismo monetario la riqueza de una nación son los metales preciosos (oro y plata) que acumula."],
  ["Balanza comercial favorable", "Un país se enriquece exportando más de lo que importa, para que entre metal y no salga."],
  ["El comercio es un juego de suma cero", "Lo que gana una nación lo pierde otra: la riqueza mundial es fija."],
  ["El Estado debe intervenir", "Proteccionismo, aranceles, monopolios comerciales y colonias para asegurar el superávit."],
  ["Población numerosa y salarios bajos", "Más trabajadores baratos significan más producción para exportar."],
  ["Del metal a la producción (mercantilismo del valor)", "Petty y otros desplazan la riqueza hacia la producción y ven el trabajo y la tierra como sus fuentes."]]},
 fisiocracia: {esc: "Fisiocracia", obra: "Quesnay, Tableau économique (1758); Turgot", p: [
  ["Existe un orden natural", "La economía se rige por leyes naturales, como la física; el gobierno no debe contrariarlas."],
  ["Solo la tierra genera producto neto", "La agricultura es la única actividad que produce un excedente sobre lo que consume; la industria y el comercio solo transforman o trasladan."],
  ["Tres clases sociales", "Clase productiva (agricultores), clase propietaria (terratenientes) y clase estéril (artesanos y comerciantes)."],
  ["La riqueza circula entre las clases", "El Tableau économique muestra cómo el producto neto se reparte y reproduce la economía cada año."],
  ["Laissez faire, laissez passer", "Libertad de comercio y de producción: el Estado debe garantizar la propiedad y no estorbar."],
  ["Impuesto único", "Como solo la tierra produce excedente, el único impuesto justo recae sobre la renta de los propietarios."]]},
 smith: {esc: "Economía política clásica (Smith)", obra: "La riqueza de las naciones (1776)", p: [
  ["La riqueza es el producto del trabajo", "La riqueza de una nación es el producto anual de su trabajo, no el oro acumulado."],
  ["División del trabajo", "Es la causa principal del aumento de la productividad, y está limitada por la extensión del mercado."],
  ["Interés propio y mano invisible", "Cada individuo busca su propio beneficio y, con competencia, termina promoviendo el bienestar general sin proponérselo."],
  ["Valor y precio natural", "El valor se mide en trabajo (comandado); el precio de mercado gravita alrededor del precio natural, que paga salarios, beneficios y rentas a sus tasas naturales."],
  ["Acumulación de capital", "El crecimiento depende del ahorro que se invierte en trabajo productivo."],
  ["Estado limitado", "Funciones del Estado: defensa, justicia y obras e instituciones públicas que los particulares no proveerían."]]},
 sraffa: {esc: "Teoría clásica de los precios de producción (Sraffa)", obra: "Producción de mercancías por medio de mercancías (1960)", p: [
  ["Mercancías producidas por medio de mercancías", "La técnica (insumos de cada sector) está dada y la economía produce un excedente; no se parte de preferencias ni de dotaciones."],
  ["A · Salario único", "La competencia entre trabajadores iguala el salario en todos los sectores."],
  ["B · Salario en bienes", "El salario es una canasta de subsistencia dada, que se integra a los insumos."],
  ["C · Tasa de beneficio uniforme", "La competencia entre capitalistas iguala la tasa de beneficio entre sectores."],
  ["D · Numerario", "Se fija un precio igual a 1: solo importan los precios relativos, no hay dinero."],
  ["Distribución exógena", "La distribución entre salarios y beneficios se determina fuera del sistema de precios (conflicto social), no por la oferta y la demanda."]]},
 marx: {esc: "Marx", obra: "El capital (1867)", p: [
  ["El trabajo es la sustancia del valor", "El valor de una mercancía es el tiempo de trabajo socialmente necesario para producirla."],
  ["La fuerza de trabajo es una mercancía", "El trabajador vende su capacidad de trabajar; su valor es el de los bienes que necesita para reproducirse."],
  ["Plusvalía", "El trabajador produce más valor que el de su fuerza de trabajo; el excedente (trabajo no pagado) lo apropia el capitalista: explotación."],
  ["Capital constante y variable", "Solo el capital variable (salarios) crea valor nuevo; el constante (medios de producción) solo transfiere su valor."],
  ["Tasa de ganancia uniforme y transformación", "La competencia iguala la tasa de ganancia, por lo que los precios de producción se apartan de los valores (problema de la transformación)."],
  ["Leyes de movimiento del capitalismo", "Acumulación, tendencia decreciente de la tasa de ganancia y crisis periódicas."]]},
 walras: {esc: "Equilibrio general neoclásico (Walras)", obra: "Elementos de economía política pura (1874); Arrow-Debreu", p: [
  ["La empresa maximiza el beneficio", "Elige capital y trabajo para maximizar p·f(K, N) − rK − wN, tomando los precios como dados: contrata hasta que PMg_K = r/p y PMg_N = w/p."],
  ["El consumidor maximiza la utilidad", "Elige su canasta para maximizar la utilidad sujeta a su restricción presupuestaria: compra hasta que la TMS entre dos bienes iguala la relación de sus precios, UMg_i/UMg_m = p_i/p_m."]],
  h: [["Datos", "Preferencias, técnicas y dotaciones están dadas."],
   ["Diez hipótesis del modelo", "Propiedad privada sin Estado, competencia perfecta, precios semipositivos, sin intercambios en desequilibrio, precios flexibles, sin costos de transacción (trueque), sin externalidades, un solo período, mercados completos e información perfecta."],
   ["Resultado: ley de Walras", "De las restricciones presupuestarias se sigue que la suma de las demandas excedentes en valor es cero: si n − 1 mercados se equilibran, el último también."]]},
 fallos: {esc: "Economía normativa: fallos de mercado", obra: "Pigou, Arrow, Coase, Akerlof", p: [
  ["Referencia: los teoremas del bienestar", "El equilibrio competitivo es eficiente (Pareto) solo si se cumplen las hipótesis de Walras."],
  ["Un fallo es una hipótesis que no se cumple", "Poder de mercado, externalidades, bienes públicos, información asimétrica, mercados incompletos."],
  ["El fallo produce ineficiencia", "Sin la hipótesis, el equilibrio deja de ser un óptimo de Pareto (pérdida de bienestar)."],
  ["Justificación de la intervención", "El Estado puede corregir con impuestos y subsidios (Pigou), regulación o provisión pública, si la corrección cuesta menos que el fallo."],
  ["Soluciones privadas", "Con derechos de propiedad claros y bajos costos de transacción, la negociación puede resolver externalidades (Coase)."]]},
 pigou: {esc: "Teoría «Clásica» del empleo (Pigou)", obra: "La teoría Clásica según Keynes (1936)", p: [
  ["Primer postulado", "El salario real es igual a la productividad marginal del trabajo: es la demanda de trabajo de las empresas."],
  ["Segundo postulado", "La utilidad del salario es igual a la desutilidad marginal del trabajo: es la oferta de trabajo de los hogares."],
  ["Ley de Say", "La oferta crea su propia demanda: no puede haber exceso general de producción."],
  ["Salarios y precios flexibles", "El mercado de trabajo se vacía: el desempleo es voluntario o friccional."],
  ["El dinero es neutral", "La cantidad de dinero solo determina el nivel de precios (teoría cuantitativa)."],
  ["Desempleo por rigideces", "El desempleo involuntario solo existe si el salario real queda rígido por encima del equilibrio (sindicatos, salario mínimo); el remedio es bajar salarios."]]},
 keynes: {esc: "Keynes: la demanda efectiva", obra: "Teoría general de la ocupación, el interés y el dinero (1936)", p: [
  ["Siete hipótesis", "Economía monetaria, competencia perfecta, salario monetario exógeno, corto plazo, precios flexibles, información imperfecta (anticipaciones) y un bien global."],
  ["Acepta el primer postulado y rechaza el segundo", "Los trabajadores negocian salarios monetarios, no reales: no hay un mercado de trabajo que se equilibre."],
  ["Principio de la demanda efectiva", "La demanda agregada esperada determina la producción y el empleo («antiley de Say»)."],
  ["Propensión marginal a consumir menor que 1", "El consumo crece menos que el ingreso, así que la demanda puede quedarse corta."],
  ["La inversión depende de expectativas", "Se invierte si la eficiencia marginal del capital supera la tasa de interés; las expectativas son inestables (espíritus animales)."],
  ["Desempleo involuntario de equilibrio", "La economía puede estabilizarse con desempleo; bajar salarios no lo corrige y el Estado debe sostener la inversión y el gasto."]]},
 hicks: {esc: "Síntesis neoclásica y nuevos keynesianos", obra: "Hicks (1937), Samuelson, Modigliani; Mankiw, Romer", p: [
  ["Keynes en el corto plazo, clásicos en el largo", "Las rigideces explican el desempleo transitorio; en el largo plazo rige el equilibrio con pleno empleo."],
  ["El modelo IS-LM", "El equilibrio conjunto de bienes (IS) y dinero (LM) determina el ingreso y la tasa de interés."],
  ["Rigidez de salarios o precios", "El desempleo keynesiano se explica por salarios o precios que no se ajustan (casos de Hicks: trampa de liquidez, inversión inelástica)."],
  ["Curva de Phillips", "Hay una relación inversa entre inflación y desempleo, que la política puede aprovechar."],
  ["Microfundamentos de la rigidez (nuevos keynesianos)", "Costos de menú, salarios de eficiencia y contratos escalonados justifican la rigidez con agentes racionales."]]},
 lucas: {esc: "Monetarismo y nuevos clásicos", obra: "Friedman (1968), Lucas (1972, 1976), Sargent y Wallace", p: [
  ["Tasa natural de desempleo (Friedman)", "En el largo plazo el desempleo vuelve a su tasa natural; la curva de Phillips de largo plazo es vertical."],
  ["Expectativas adaptativas y luego racionales", "Friedman usa expectativas que se corrigen con los errores; Lucas, expectativas racionales: los agentes usan toda la información y no se equivocan sistemáticamente."],
  ["Vaciado continuo de los mercados", "Los precios y salarios son flexibles; las fluctuaciones son respuestas óptimas a choques."],
  ["Neutralidad del dinero e inefectividad de la política anticipada", "Solo la política monetaria sorpresiva afecta al producto, y de forma transitoria."],
  ["Crítica de Lucas", "Los parámetros de los modelos cambian cuando cambia la política: hay que modelar decisiones a partir de preferencias y tecnología."],
  ["Reglas, no discreción", "Regla monetaria (k %) y credibilidad del banco central."]]}
};
(function(){
  const css = `.post{border:1.5px solid var(--cc,var(--line));border-left-width:6px;border-radius:12px;padding:14px 16px;background:var(--card)}
.post h3{margin-top:0}.post .obra{color:var(--muted);font-size:.92em;margin:-4px 0 10px}
.post ol{margin:0;padding-left:1.4em}.post li{margin:0 0 8px}.post li b{display:block}
.post .uso{font-size:.92em;color:var(--muted);margin:10px 0 0}
#po-c button{font-family:inherit;text-align:left}`;
  if (typeof document !== "undefined") { const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); }
  Object.entries(POSTULADOS).forEach(([id, P]) => {
    const t = TRUNK.find(x => x.id === id); if (!t) return;
    const box = `<section class="post"><h3>Postulados: ${P.esc}</h3><p class="obra">${P.obra}</p><ol>${P.p.map(([n, d]) => `<li><b>${n}</b>${d}</li>`).join("")}</ol>${P.h ? `<p style="margin:12px 0 6px"><b>Sobre esos postulados se construye el modelo con:</b></p><ul>${P.h.map(([n, d]) => `<li><b>${n}</b>${d}</li>`).join("")}</ul>` : ""}
<p class="uso">En el parcial: los postulados son las «hipótesis» del esquema hipótesis → mecanismo → resultado → crítica, y la base de la tabla de diferencias. Repásalos en el taller «Postulados de todas las escuelas».</p></section>`;
    const i = t.html.indexOf("</section>");
    t.html = i >= 0 ? t.html.slice(0, i + 10) + box + t.html.slice(i + 10) : box + t.html;
  });
  WORKSHOPS.push({id: "postulados", t: "Postulados de todas las escuelas", anchor: "lucas", links: Object.keys(POSTULADOS).slice(0, 6), sim: "postulados",
    html: `<div class="sim" id="sim"></div>`, d: "Los postulados de cada escuela en una tabla, en tarjetas y en un juego de adivinar a qué escuela pertenecen."});
})();
