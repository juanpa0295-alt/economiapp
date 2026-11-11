#!/usr/bin/env python3
"""Arma el sitio de Economiapp en ./docs a partir de los prototipos de cada materia."""
import json, os, re, shutil, subprocess

S = os.path.dirname(os.path.abspath(__file__))
SCR = os.path.dirname(S)
OUT = os.environ.get("ECONOMIAPP_OUT") or os.path.join(os.path.dirname(SCR), "docs")  # por defecto, la carpeta docs/ del repositorio
ECO = os.path.join(SCR, "eco/original.html")
rd = lambda p: open(os.path.join(SCR, p), encoding="utf-8").read()

# ---------------------------------------------------------------------
# App instalable (PWA): manifiesto, íconos y service worker para usarla sin internet.
# Formulario de opiniones (Google Forms). «action» termina en /formResponse; «campos» son los entry.NNN de cada pregunta.
# Vacío = el botón «Opinar» no aparece.
FORM = json.loads(os.environ["ECONOMIAPP_FORM"]) if os.environ.get("ECONOMIAPP_FORM") else {
    "action": "https://docs.google.com/forms/d/e/1FAIpQLSf_Muwartu_Od-3A5lhfVu5djis4J4CmnA9RR5VClaW0YpHIg/formResponse",
    "campos": {"materia": "entry.332894674", "utilidad": "entry.467103254", "falta": "entry.1719251696",
               "pago": "entry.1755850544", "contacto": "entry.1508511471"}}

def pwa_tags(base):
    return (f'\n<link rel="manifest" href="{base}manifest.webmanifest">'
            f'\n<meta name="theme-color" content="#1b2430">'
            f'\n<link rel="icon" type="image/png" href="{base}iconos/favicon-48.png">'
            f'\n<link rel="apple-touch-icon" href="{base}iconos/apple-touch-icon.png">'
            f'\n<meta name="apple-mobile-web-app-title" content="Economiapp">'
            f'\n<script>if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("{base}sw.js").catch(()=>{{}}))</script>'
            f'\n<script>window.ECO={json.dumps({"form": FORM}, ensure_ascii=False)}</script><script defer src="{base}comun/app.js"></script>')

# ---------------------------------------------------------------------
# Estadísticas de visitas (Google Analytics 4). Pega aquí el «ID de medición»
# de tu propiedad (empieza por G-). Vacío = el sitio no carga ninguna analítica.
ANALYTICS_ID = os.environ.get("ECONOMIAPP_GA", "G-7BHLT18DZR")
def analytics_tag():
    if not ANALYTICS_ID:
        return ""
    g = ANALYTICS_ID
    return f'''
<script async src="https://www.googletagmanager.com/gtag/js?id={g}"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}
gtag("js",new Date());gtag("config","{g}",{{send_page_view:false,anonymize_ip:true}});
/* una «vista» por página y por estación: /materias/estadistica-2.html#tlc se registra como /materias/estadistica-2/tlc,
   para que el informe «Páginas y pantallas» muestre qué temas se estudian más */
(function(){{let last="";const v=()=>{{const h=location.hash.replace(/^#/,"").split(/[?&]/)[0],p=h?location.pathname.replace(/\\.html$/,"")+"/"+encodeURIComponent(h):location.pathname;if(p===last)return;last=p;
const t=document.querySelector("h2")&&h?document.title.split(" · ")[0]+" · "+(document.querySelector("h2").textContent||h):document.title;
gtag("event","page_view",{{page_location:location.origin+p+location.search,page_title:t}})}};
setTimeout(v,400);addEventListener("hashchange",()=>setTimeout(v,60))}})();
</script>'''

def wr(rel, txt):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(txt)

shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)

# ---------- comun/ruta.css: tokens + componentes (el color de la línea lo define cada materia)
css = rd("tj/base.css")
css = css.replace("/* Layout: mapa tipo línea de metro (la línea de Teoría de Juegos en índigo) a la izquierda, lección a la derecha; en celular se apilan */",
                  "/* Economiapp · estilos compartidos por todas las rutas.\n   Layout: mapa tipo línea de metro a la izquierda, lección a la derecha; en celular se apilan.\n   Cada materia redefine --line y --line-soft en su propia página. */")
css += """
.calcf select{font-family:var(--f-body);font-size:14px;padding:6px 8px;border:1px solid var(--rule);border-radius:6px;background:var(--card);color:var(--ink);width:100%}
.calcf input[type=date],.calcf input[type=time]{font-family:var(--f-mono)}
.calcf>span{display:contents}
/* --- calculadoras simbólicas --- */
.cas{font-size:13px;font-weight:600;padding:8px 12px;border-radius:8px;border:1.5px solid;line-height:1.45}
.cas.ok{color:var(--good);border-color:var(--good)}
.cas.wait{color:var(--branch);border-color:var(--branch)}
.cas.off{color:var(--muted);border-color:var(--rule)}
.chips.pre{display:flex;flex-wrap:wrap;gap:6px}
.calcf input[spellcheck]{font-family:var(--f-mono)}
/* --- navegación entre materias --- */
.home{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--muted);text-decoration:none;margin-bottom:10px}
.home:hover{color:var(--line)}
.home:focus-visible{outline:2px solid var(--line);outline-offset:3px;border-radius:4px}
"""
wr("comun/ruta.css", css)

# ---------- comun/ruta.js: motor de la ruta (mapa, lecciones, progreso, utilidades y gráficos)
core = rd("tj/engine.js")
core = core.replace('const KEY="ruta-tj-done";', 'const KEY=window.RUTA_KEY||"ruta-done";')
core = core.replace("let cur=null;", "let cur=null;\nfunction remember(id){try{localStorage.setItem(KEY+\"-last\",id)}catch(e){}}")
core = core.replace("const s=byId(id)||TRUNK[0]; const prevIdx=ALL.findIndex(x=>x.id===cur); cur=s.id;",
                    "const s=byId(id)||TRUNK[0]; const prevIdx=ALL.findIndex(x=>x.id===cur); cur=s.id; remember(s.id);")
# extensiones: preguntas sueltas (q/a), etiqueta de examen, nota del tronco y pestañas de código R/Stata/Python
EXT = [
 ('const LESSONS=ALL.filter(s=>s.kind==="t"||s.kind==="b");',
  'ALL.forEach(s=>{if(s.q&&!s.qs)s.qs=[{q:s.q,a:s.a}]});\nconst LESSONS=ALL.filter(s=>s.kind==="t"||s.kind==="b");\n'
  'const EXAM=window.RUTA_EXAM||"",TNOTE=window.RUTA_TRUNK_NOTE===undefined?"<span>· módulo de Economiapp</span>":window.RUTA_TRUNK_NOTE;'),
 ('<span class="nm">${s.t}</span></button></li>`',
  '<span class="nm">${s.t}</span>${s.exam&&EXAM?`<span class="tag">${EXAM}</span>`:""}</button></li>`'),
 ('${s.nuevo?NW:"<span>· módulo de Economiapp</span>"}',
  '${s.exam&&EXAM?`<span class="tag">${EXAM}</span>`:""}${s.parte?`<span>· ${s.parte}</span>`:""}${s.nuevo?NW:s.parte?"":TNOTE}'),
 ('  if(s.py) h+=', r"""  if(s.code) h+=`<div class="dp"><button type="button" aria-expanded="false" data-dp><span class="k">Código</span><span>En el software: R, Stata y Python</span><span class="chev">›</span></button><div class="dpb"><div><div>
    <div class="tabs" role="tablist">${["r","stata","py"].map((l,j)=>`<button type="button" role="tab" aria-selected="${j===0}" data-tab="${l}">${{r:"R",stata:"Stata",py:"Python"}[l]}</button>`).join("")}</div>
    ${["r","stata","py"].map((l,j)=>`<div data-pane="${l}" ${j?"hidden":""}><button class="cp" type="button" data-copy>Copiar</button><pre>${esc(s.code[l])}</pre></div>`).join("")}
  </div></div></div></div>`;
  if(s.py) h+="""),
 ('  const d=e.target.closest("[data-dp]");', r"""  const tb=e.target.closest("[data-tab]");
  if(tb){const box=tb.closest("div:not(.tabs)");box.querySelectorAll("[data-tab]").forEach(b=>b.setAttribute("aria-selected",b===tb));
    box.querySelectorAll("[data-pane]").forEach(p=>p.hidden=p.dataset.pane!==tb.dataset.tab);return;}
  const d=e.target.closest("[data-dp]");"""),
]
for old, new in EXT:
    assert core.count(old) == 1, old
    core = core.replace(old, new)
core = core.rstrip()
assert core.endswith("show(location.hash.slice(1)||TRUNK[0].id,false);")
core = core[:core.rfind("show(location.hash.slice(1)||TRUNK[0].id,false);")].rstrip()
assert "window.RUTA_KEY" in core and "remember(s.id)" in core
core = "// Economiapp · motor común de las rutas. Requiere que antes se carguen TRUNK, BRANCHES y WORKSHOPS,\n// y que el archivo de laboratorios de la materia defina SIMS. Se arranca con RUTA_START().\n" + core + \
       "\nfunction RUTA_START(){show(location.hash.slice(1)||TRUNK[0].id,false)}\n"
wr("comun/ruta.js", core)

# ---------- librerías numéricas
num = rd("est2/num.js").replace('if(typeof module!=="undefined")module.exports={DIST,CALC,Phi,PhiInv,tcdf,chi2cdf,fcdf,rng,normals};', "").rstrip()
wr("comun/estadistica.js", "// Economiapp · distribuciones (reemplazan a scipy.stats) y cálculos de Estadística 2, como funciones puras.\n" + num + "\n")
gt = rd("tj/gt.js").replace('if(typeof module!=="undefined")module.exports={Q,q,parseQ,bestResponses,iterElim,mixed2x2,supportEnum,security,nash3,sequential,sub};', "").rstrip()
wr("comun/juegos.js", "// Economiapp · motor de Teoría de Juegos con fracciones exactas.\n" + gt +
   "\nconst GT={Q,q,parseQ,bestResponses,iterElim,mixed2x2,supportEnum,security,nash3,sequential,sub};\n" +
   rd("tj/ext.js").replace('if(typeof module!=="undefined")module.exports={EXT};', "").rstrip() + "\n" +
   rd("tj/bayes.js").replace('if(typeof module!=="undefined")module.exports={BN};', "").rstrip() + "\n")

wr("comun/extensiva.js", rd("tj/extensiva.js"))

# ---------- contenido y laboratorios de cada materia
e2 = rd("est2/engine.js"); a = e2.find("const SIMS={};"); b = e2.rfind("show(location.hash")
wr("materias/estadistica-2/contenido.js", "// Estadística II · contenido de la ruta (programa 1504109)\n" + rd("est2/content.js"))
wr("materias/estadistica-2/laboratorios.js", "// Estadística II · laboratorios interactivos\n" + e2[a:b].rstrip() + "\n" + rd("est2/labs2.js"))

tjc = (rd("tj/content.js") + "\n" + rd("tj/talleres.js")).replace('\n<p class="hint">Este módulo de Economiapp no entra en el parcial de mañana.</p></section>', "</section>")
assert "parcial de mañana" not in tjc
tjs = rd("tj/tjsims.js")
assert tjs.startswith("const GT=")
tjs = tjs.split("\n", 1)[1]
wr("materias/teoria-juegos/contenido.js", "// Teoría de Juegos · contenido de la ruta (notación del curso, ejercicios de los talleres 1 a 3)\n" + tjc + "\n" + rd("tj/extra.js"))
wr("materias/teoria-juegos/laboratorios.js", "// Teoría de Juegos · resolvedor y laboratorios\n" + tjs.rstrip() + "\n" + rd("tj/labs_extra.js"))

wr("comun/macro.js", "// Economiapp · cálculos de Macroeconomía 1 como funciones puras.\n" + rd("macro1/macro.js").replace('if(typeof module!=="undefined")module.exports=MAC;', "").rstrip() + "\n")
wr("materias/macroeconomia-1/contenido.js", "// Macroeconomía I · contenido de la ruta (programa 1503711)\n" + rd("macro1/content.js"))
wr("materias/macroeconomia-1/laboratorios.js", "// Macroeconomía I · laboratorios interactivos\n" + rd("macro1/labs.js") + "\n" + rd("macro1/vis_scenes.js") + "\n" + rd("macro1/labs2.js"))
wr("comun/visual.js", "// Economiapp · visuales de cambios: curvas que se arrastran con una lectura en texto del cambio.\n" + rd("vis/engine.js"))
wr("comun/macro2.js", "// Economiapp · cálculos de Macroeconomía 2 (economía abierta) como funciones puras.\n" + rd("m2/macro2.js").replace('if(typeof module!=="undefined")module.exports=M2;', "").rstrip() + "\n")
wr("materias/macroeconomia-2/contenido.js", "// Macroeconomía 2 · contenido de la ruta (notación del curso, prof. Ramón Javier Mesa)\n" + rd("m2/content.js") + "\n" + rd("m2/extra.js"))
wr("materias/macroeconomia-2/laboratorios.js", "// Macroeconomía 2 · laboratorios interactivos\n" + rd("m2/labs.js") + "\n" + rd("m2/vis_scenes.js") + "\n" + rd("m2/labs_extra.js"))

wr("comun/laboral.js", "// Economiapp · cálculos de Derecho Laboral (CST). Actualiza la tabla LEY cada año.\n" + rd("lab/laboral.js").replace('if(typeof module!=="undefined")module.exports={LEY,LAB};', "").rstrip() + "\n")
wr("materias/derecho-laboral/contenido.js", "// Derecho Laboral y Comercial · contenido de la ruta\n" + rd("lab/content.js") + "\n" + rd("lab/talleres.js") + "\n" + rd("lab/extra.js"))
wr("materias/derecho-laboral/laboratorios.js", "// Derecho Laboral y Comercial · calculadoras\n" + rd("lab/labs.js") + "\n" + rd("lab/caso.js") + "\n" + rd("lab/labs_extra.js"))
simb = rd("mat/simbolico.js").replace('if (typeof module !== "undefined") module.exports = { NUM };', "").rstrip()
assert "/*PY*/" in simb
wr("comun/simbolico.js", simb.replace("/*PY*/", json.dumps(rd("mat/cas.py") + rd("mat/cas2.py"), ensure_ascii=False)) + "\n")
for _sl, _c, _l, _nm in [("matematicas-1", "c1", ["l1"], "Matemáticas I"), ("matematicas-2", "c2", ["l2"], "Matemáticas II"), ("matematicas-3", "c3", ["l2", "l3"], "Matemáticas III")]:
    wr(f"materias/{_sl}/contenido.js", f"// {_nm} · contenido de la ruta\n" + rd(f"mat/{_c}.js"))
    wr(f"materias/{_sl}/laboratorios.js", f"// {_nm} · calculadoras (SymPy con Pyodide y respaldo numérico)\n" + rd("mat/labs.js") + "\n" + rd("mat/mx.js") + "\n" + "\n".join(rd(f"mat/{q}.js") for q in _l))
wr("comun/principios.js", rd("pmac/pmac.js").replace('if(typeof module!=="undefined")module.exports=PM;', "").rstrip() + "\n")
wr("materias/matematicas/contenido.js", "// Matemáticas · contenido de la ruta (módulos de Economiapp ordenados por tema + optimización con restricciones)\n" + rd("mat/content.js"))
wr("materias/matematicas/laboratorios.js", "// Matemáticas · calculadoras (SymPy con Pyodide y respaldo numérico) y laboratorios\n" + rd("mat/labs.js"))
wr("comun/micro.js", "// Economiapp · cálculos de Principios de Microeconomía como funciones puras.\n" + rd("pmic/pmic.js").replace('if(typeof module!=="undefined")module.exports=MI;', "").replace("// Economiapp · cálculos de Principios de Microeconomía como funciones puras (notación de Varian: x1, x2, p1, p2, m).\n", "").rstrip() + "\n")
wr("materias/principios-micro/contenido.js", "// Principios de Microeconomía · contenido de la ruta (programa 1503701)\n" + rd("pmic/content.js"))
wr("materias/principios-micro/laboratorios.js", "// Principios de Microeconomía · laboratorios interactivos\n" + rd("pmic/labs.js"))
wr("comun/est1.js", rd("est1/e1.js").replace('if(typeof module!=="undefined")module.exports=E1;', "").rstrip() + "\n")
wr("materias/estadistica-1/contenido.js", "// Estadística I · contenido de la ruta (programa 1504108)\n" + rd("est1/content.js"))
wr("materias/estadistica-1/laboratorios.js", "// Estadística I · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("est1/labs.js"))
wr("comun/ts.js", "// Economiapp · series de tiempo y panel\n" + rd("e2/ts.js").replace('if(typeof module!=="undefined")module.exports=TS;', "").rstrip() + "\n")
wr("materias/econometria-2/contenido.js", "// Econometría II · contenido de la ruta (programa 1504111)\n" + rd("e2/content.js"))
wr("materias/econometria-2/laboratorios.js", "// Econometría II · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("e2/labs.js"))
wr("materias/macroeconomia-3/contenido.js", "// Macroeconomía III · contenido de la ruta (programa 1503713)\n" + rd("m3/content.js"))
wr("materias/macroeconomia-3/laboratorios.js", "// Macroeconomía III · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("m3/labs.js"))
wr("materias/finanzas-corporativas/contenido.js", "// Finanzas Corporativas · contenido de la ruta (programa 1501802)\n" + rd("fc/content.js"))
wr("materias/finanzas-corporativas/laboratorios.js", "// Finanzas Corporativas · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("fc/labs.js"))
# guías de estudio: herramientas comunes + laboratorios propios
GUIAS = {"historia-economica": ("he", "Historia Económica")}
GMETA = json.loads(rd("gx/meta.json"))
for _g in GMETA:
    GUIAS[_g["slug"]] = ("gx/" + _g["dir"], _g["h1"])
for _sl, (_d, _nm) in GUIAS.items():
    wr(f"materias/{_sl}/contenido.js", f"// {_nm} · resumen y guía de estudio\n" + rd(f"{_d}/content.js"))
    _extra = rd(f"{_d}/labs.js") if os.path.exists(os.path.join(SCR, f"{_d}/labs.js")) else ""
    wr(f"materias/{_sl}/laboratorios.js", f"// {_nm} · herramientas de estudio\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + _extra)
wr("materias/desarrollo-economico/contenido.js", "// Desarrollo Económico · contenido de la ruta (programa 1503714)\n" + rd("de/content.js"))
wr("materias/desarrollo-economico/laboratorios.js", "// Desarrollo Económico · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("de/labs.js"))
wr("materias/evaluacion-proyectos/contenido.js", "// Evaluación de Proyectos · contenido de la ruta (programa 1503750)\n" + rd("ep/content.js"))
wr("materias/evaluacion-proyectos/laboratorios.js", "// Evaluación de Proyectos · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("ep/labs.js"))
wr("materias/contabilidad/contenido.js", "// Contabilidad y Análisis Financiero · contenido de la ruta (programa 1501874)\n" + rd("cy/content.js"))
wr("materias/contabilidad/laboratorios.js", "// Contabilidad y Análisis Financiero · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("cy/labs.js"))
wr("materias/economia-internacional/contenido.js", "// Economía Internacional · contenido de la ruta (programa 1503705)\n" + rd("ei/content.js"))
wr("materias/economia-internacional/laboratorios.js", "// Economía Internacional · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("ei/labs.js"))
wr("materias/economia-ambiental/contenido.js", "// Economía Ambiental · contenido de la ruta (programa 1503807)\n" + rd("ea/content.js"))
wr("materias/economia-ambiental/laboratorios.js", "// Economía Ambiental · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("ea/labs.js"))
wr("materias/microeconometria/contenido.js", "// Microeconometría · contenido de la ruta (programa 1503810)\n" + rd("mi/content.js"))
wr("materias/microeconometria/laboratorios.js", "// Microeconometría · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("gu/guia.js") + "\n" + rd("mi/labs.js"))
wr("comun/mateco.js", rd("me/me.js").replace('if(typeof module!=="undefined")module.exports=ME;', "").rstrip() + "\n")
wr("materias/matematicas-economicas/contenido.js", "// Matemáticas para el análisis económico · contenido de la ruta (programa 1504105)\n" + rd("me/content.js"))
wr("materias/matematicas-economicas/laboratorios.js", "// Matemáticas para el análisis económico · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("me/labs.js"))
wr("comun/la.js", "// Economiapp · álgebra lineal con fracciones exactas (BigInt)\n" + rd("ml/la.js").replace('if(typeof module!=="undefined")module.exports=LA;', "").rstrip() + "\n")
wr("materias/metodos-lineales/contenido.js", "// Métodos Lineales · contenido de la ruta (programa 1504104)\n" + rd("ml/content.js"))
wr("materias/metodos-lineales/laboratorios.js", "// Métodos Lineales · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd("ml/labs.js"))
for _k, _lib, _c, _l, _js, _nm in [("microeconomia-1", "micro1.js", "c1", "l1", "m1", "Microeconomía I"), ("microeconomia-2", "micro2.js", "c2", "l2", "m2", "Microeconomía II")]:
    wr("comun/" + _lib, rd(f"pmic/{_js}.js").replace('if(typeof module!=="undefined")module.exports=' + _js.upper() + ';', "").rstrip() + "\n")
    wr(f"materias/{_k}/contenido.js", f"// {_nm} · contenido de la ruta\n" + rd(f"pmic/{_c}.js"))
    wr(f"materias/{_k}/laboratorios.js", f"// {_nm} · laboratorios interactivos\n" + rd("pmic/helpers.js") + "\n" + rd(f"pmic/{_l}.js"))
wr("materias/principios-macro/contenido.js", "// Principios de Macroeconomía · contenido de la ruta (módulos de Economiapp + ramas)\n" + rd("pmac/content.js"))
wr("comun/historia.js", "// Economiapp · cálculos de Historia del Pensamiento Económico (Sraffa, Marx, Walras, Cournot, Phillips) como funciones puras.\n" + rd("hpe/hpe.js").replace('if(typeof module!=="undefined")module.exports=HPE;', "").rstrip() + "\n")
wr("materias/historia-pensamiento/contenido.js", "// Historia del Pensamiento Económico · contenido de la ruta (libro de Tobón, 2023, y programa del curso)\n" + rd("hpe/content.js"))
wr("materias/historia-pensamiento/laboratorios.js", "// Historia del Pensamiento Económico · laboratorios interactivos\n" + rd("hpe/labs.js") + "\n" + rd("hpe/vis_scenes.js"))
wr("comun/finanzas.js", "// Economiapp · matemáticas financieras de Gerencia Financiera I como funciones puras.\n" + rd("gf/gf.js").replace('if(typeof module!=="undefined")module.exports=GF;', "").rstrip() + "\n")
wr("materias/gerencia-financiera/contenido.js", "// Gerencia Financiera I · contenido de la ruta (notación y casos del prof. Luis Fernando Vásquez Villa)\n" + rd("gf/content.js") + "\n" + rd("gf/extra.js"))
wr("materias/gerencia-financiera/laboratorios.js", "// Gerencia Financiera I · laboratorios con fórmulas de Excel\n" + rd("gf/labs.js") + "\n" + rd("gf/labs_extra.js"))
wr("materias/principios-macro/laboratorios.js", "// Principios de Macroeconomía · laboratorios interactivos\n" + rd("pmac/labs.js") + "\n" + rd("pmac/vis_scenes.js"))

# Econometría: el contenido, los laboratorios y los estilos propios se separan de la página original
ECO_SRC = open(ECO, encoding="utf-8").read()
a = ECO_SRC.find("const TRUNK = ["); b = ECO_SRC.find("// ===== índice general =====")
c = ECO_SRC.find("// ===== utilidades numéricas ====="); d = ECO_SRC.rfind("show(location.hash.slice(1)||TRUNK[0].id,false);")
assert -1 not in (a, b, c, d) and a < b < c < d
wr("materias/econometria/contenido.js", "// Econometría · contenido de la ruta\n" + ECO_SRC[a:b].rstrip() + "\n" + rd("eco/rmanual.js") + "\n" + rd("eco/ejercicios.js") + "\n" + rd("eco/talleres.js") + "\n" + rd("eco/extra.js"))
labs = ECO_SRC[c:d].rstrip()
assert labs.count("const SIMS={};") == 1
labs = labs.replace("const SIMS={};", "")
for o, n in [('mem.chow={scrR:r.scr,scr1:ra.scr,scr2:rb.scr,n,k}', 'mem.chow={scrR:r.scr,scr1:ra.scr,scr2:rb.scr,n,k,n1:rs}'),
             ('CALC_PREFILL=mem.chow;location.hash="t-calc"', 'window.CALC_PRE=mem.chow;location.hash="t-calc"')]:
    assert labs.count(o) == 1, o
    labs = labs.replace(o, n)
wr("materias/econometria/laboratorios.js", "// Econometría · laboratorios y talleres. Sus utilidades numéricas y de gráficos viven dentro de esta función\n// para no chocar con las del motor común.\nconst SIMS={};\n(function(){\n" + labs + "\n})();\n" + rd("eco/ejercicios_labs.js") + rd("eco/datos_labs.js") + rd("eco/ruta_calc.js") + "\n" + rd("eco/labs_extra.js"))
cs = ECO_SRC.find("<style>\n/* Layout"); ce = ECO_SRC.find("</style>", cs)
common = open(os.path.join(OUT, "comun/ruta.css"), encoding="utf-8").read()
ECO_CSS = "\n".join(l for l in ECO_SRC[cs+len("<style>\n"):ce].split("\n")
                    if l.strip() and l not in common and not l.lstrip().startswith(("--", ":root", "@media (prefers-color-scheme", "/*", "}")))

# ---------- páginas de materia
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=Public+Sans:ital,wght@0,400;0,600;1,400&family=STIX+Two+Text:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;600&display=swap">'
MATHJAX = '''<script>
window.MathJax={tex:{inlineMath:[["\\\\(","\\\\)"]],displayMath:[["\\\\[","\\\\]"]]},svg:{fontCache:"global"},
  startup:{typeset:false,ready(){MathJax.startup.defaultReady();MathJax.startup.promise.then(()=>{const l=document.getElementById("lesson");if(!l)return;
    const crudo=()=>{const w=document.createTreeWalker(l,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(/\\\\\\(|\\\\\\[/.test(n.nodeValue)&&!n.parentElement.closest("pre,code,textarea,script,mjx-container"))return true;return false};
    const go=k=>MathJax.typesetPromise([l]).catch(()=>{}).then(()=>{if(k>0&&crudo()){try{MathJax.typesetClear([l])}catch(e){}setTimeout(()=>go(k-1),300)}});go(4)})}}};
</script>
<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>'''
HEAD = '''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="claude:viewport-fit-sides" content="cover">
<style>:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}[hidden]{{display:none!important}}img{{max-width:100%}}</style>
{fonts}
<link rel="stylesheet" href="../comun/ruta.css">
<style>
/* color de la línea de esta materia */
:root{{--line:{l};--line-soft:{ls}}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{--line:{d};--line-soft:{ds}}}}}
:root[data-theme="dark"]{{--line:{d};--line-soft:{ds}}}
</style>
{mathjax}{analytics}{pwa}
</head>
<body>
'''
def body(lbl, h1, intro, trunk_lbl):
    return f'''<div class="wrap">
  <header>
    <a class="home" href="../index.html">← Todas las materias</a>
    <div class="lbl">{lbl}</div>
    <h1>{h1}</h1>
    <p>{intro}</p>
    <div class="prog"><div class="bar"><i id="pbar"></i></div><span id="ptxt"></span><span>· Navega con <span class="kbd">←</span> <span class="kbd">→</span></span></div>
  </header>
  <div class="grid">
    <nav class="map" aria-label="Mapa de temas">
      <button type="button" class="maptg" id="maptg" aria-expanded="true" aria-label="Mostrar u ocultar el mapa de temas"><span class="ic" aria-hidden="true">☰</span><span class="t">Ocultar temas</span></button>
      <div>
        <div class="lbl" style="margin-bottom:8px">{trunk_lbl}</div>
        <div class="trunkbox"><span class="track"></span><span class="fill" id="fill"></span><span class="train" id="train"></span><ol class="trunk" id="trunk"></ol></div>
      </div>
      <div>
        <div class="lbl" style="margin-bottom:8px">Ramas</div>
        <div class="branches" id="branches"></div>
      </div>
      <div>
        <div class="lbl" style="margin-bottom:8px">Talleres</div>
        <div id="talleres"></div>
      </div>
    </nav>
    <article id="lesson" aria-live="polite"></article>
  </div>
</div>
'''
MATERIAS = [
  dict(slug="microeconometria", key="ruta-mie-done", title="Microeconometría · Economiapp", lib=["ts.js"],
       desc="Programa 1503810 (Opción III): propiedades de MCO y errores robustos, variables instrumentales y MC2E, GMM con prueba J, panel con efectos fijos, aleatorios y Hausman, paneles dinámicos (Nickell, Anderson-Hsiao, Arellano-Bond), probit y logit, tobit, Heckman, efectos de tratamiento y modelos de duración, con simulaciones de Monte Carlo y código en R.",
       colors=("#5b2a6e", "#efe0f5", "#c08fd6", "#2a1033"),
       lbl="Economiapp · Microeconometría", h1="Microeconometría", trunk="Tronco: las cinco unidades del programa",
       intro='El tronco sigue las cinco unidades del programa (1503810, opción de noveno semestre): modelo clásico, GMM, datos de panel, elección discreta, y variable dependiente limitada con duración. Cada laboratorio simula datos con parámetros conocidos para que veas cuándo un estimador acierta y cuándo se sesga (MCO con endogeneidad, efectos fijos en paneles dinámicos, MCO con censura o selección), estima los modelos por máxima verosimilitud o GMM en tu navegador, y trae el código en R equivalente. Continúa Econometría I y II.'),
  dict(slug="economia-ambiental", key="ruta-ea-done", title="Economía Ambiental · Economiapp",
       desc="Programa 1503807 (Opción I): sostenibilidad, economía circular y cambio climático, medidas de bienestar y análisis costo-beneficio de largo plazo, regla de Hotelling con competencia y monopolio, pesca (Gordon-Schaefer), rotación forestal (Faustmann y Hartman), contaminación óptima, impuestos, estándares y permisos negociables, costo de viaje y valoración contingente.",
       colors=("#3c6e1f", "#e2f0d6", "#94c973", "#1a330b"),
       lbl="Economiapp · Economía Ambiental", h1="Economía Ambiental", trunk="Tronco: los seis módulos del programa",
       intro='El tronco sigue los seis módulos del programa (1503807, opción de octavo semestre): introducción, cambios en el bienestar, recursos no renovables, recursos renovables, fallas del mercado y valoración. Los laboratorios simulan la regla de Hotelling, la pesca de libre acceso frente al rendimiento económico máximo, la rotación de Faustmann, la contaminación óptima y la costo-efectividad de impuestos y permisos, y estiman la demanda de costo de viaje y la disposición a pagar con un logit.'),
  dict(slug="economia-internacional", key="ruta-ei-done", title="Economía Internacional · Economiapp",
       desc="Programa 1503705: modelo ricardiano y Dornbusch-Fischer-Samuelson, factores específicos, Heckscher-Ohlin con Stolper-Samuelson y Rybczynski, modelo estándar, ciclo del producto, Linder y gravedad, competencia monopolística, dumping recíproco, migración, aranceles y protección efectiva, economía política, integración (Viner) y política comercial estratégica.",
       colors=("#0f6b6b", "#d6efef", "#6cc6c6", "#053030"),
       lbl="Economiapp · Economía Internacional", h1="Economía Internacional", trunk="Tronco: las ocho unidades del programa",
       intro='El tronco sigue las ocho unidades del programa (1503705), de la teoría clásica a la política comercial estratégica, con el texto de Krugman y Obstfeld. Cada modelo tiene su laboratorio: ventaja comparativa con la frontera de posibilidades, el continuo DFS, los teoremas de Stolper-Samuelson y Rybczynski con coeficientes fijos, la ecuación de gravedad estimada con tus datos, el ejemplo de los automóviles de Krugman, dumping recíproco, migración, los triángulos del arancel, la protección efectiva, creación y desviación de comercio, y el juego Boeing-Airbus. La parte monetaria internacional está en Macroeconomía 2.'),
  dict(slug="contabilidad", key="ruta-cy-done", title="Contabilidad y Análisis Financiero · Economiapp",
       desc="Programa 1501874: normas contables en Colombia (de los decretos de 1993 a las NIIF), ecuación contable y partida doble con libro diario, mayor y balance de prueba, depreciación, kárdex por promedio y PEPS, estados financieros, flujo de efectivo indirecto, análisis vertical y horizontal, e indicadores de liquidez, actividad, endeudamiento y rentabilidad con Du Pont.",
       colors=("#4f3a8c", "#e6e0f5", "#a996e0", "#211646"),
       lbl="Economiapp · Contabilidad y Análisis Financiero", h1="Contabilidad y Análisis Financiero", trunk="Tronco: las cuatro unidades del programa",
       intro='El tronco sigue las cuatro unidades del programa (1501874): normatividad, elementos introductorios del sistema contable, estados financieros, y análisis e interpretación. Los laboratorios registran asientos por partida doble y arman el diario, el mayor y el balance de prueba; calculan depreciaciones y kárdex; construyen el estado de resultados y el flujo de efectivo, y producen un borrador de informe gerencial con los indicadores. El programa cita los decretos 2649 y 2650 de 1993; la ruta explica también el marco vigente de NIIF.'),
  dict(slug="evaluacion-proyectos", key="ruta-ep-done", title="Evaluación de Proyectos · Economiapp",
       desc="Programa 1503750: ciclo del proyecto y MGA, marco lógico (árboles y matriz), estudio de mercado y proyección de la demanda, tamaño y localización, puntos de equilibrio, matriz de Conesa, matriz de riesgos, flujos de caja del proyecto y del inversionista (VPN, TIR, TIRM, B/C, PRI), riesgo del VPN (Hillier y Monte Carlo) y evaluación económica con precios de cuenta.",
       colors=("#1d4f7a", "#dbe8f4", "#7fb0dc", "#0c2236"),
       lbl="Economiapp · Evaluación de Proyectos", h1="Evaluación de Proyectos", trunk="Tronco: las cinco unidades del programa",
       intro='El tronco sigue las cinco unidades del programa (1503750): generalidades y marco lógico, estudios de mercado, técnico, administrativo-legal-ambiental, y financiero y de riesgo. Los laboratorios funcionan como plantillas de un proyecto real: árbol de problemas y matriz de marco lógico (se guardan en tu navegador), proyección de la demanda, localización por puntos, puntos de equilibrio, matriz de Conesa, mapa de riesgos, flujos de caja con financiación, riesgo del VPN y evaluación económica. Cada cálculo indica su equivalente en Excel. Continúa lo visto en Gerencia Financiera.'),
  dict(slug="desarrollo-economico", key="ruta-de-done", title="Desarrollo Económico · Economiapp",
       desc="Programa 1503714: medición del desarrollo (IDH), pobreza (FGT) y desigualdad (Gini, Theil, Atkinson), Malthus, Harrod-Domar, Solow, crecimiento endógeno, convergencia, Big Push y encadenamientos, Lewis, CEPAL y Thirlwall, trampas de pobreza, instituciones, maldición de los recursos y clústeres.",
       colors=("#7a4b14", "#f3e6d2", "#d9a65c", "#3a2208"),
       lbl="Economiapp · Desarrollo Económico", h1="Desarrollo Económico", trunk="Tronco: las cinco unidades del programa",
       intro='El tronco sigue las cinco unidades del programa (1503714): visión panorámica del desarrollo, crecimiento económico, enfoques tradicionales, debates recientes y perspectivas heterodoxas. Los laboratorios calculan los índices con tus datos (IDH, pobreza, desigualdad, encadenamientos, cocientes de localización) y simulan los modelos (Malthus, Harrod-Domar, Solow, AK, Lewis, trampas de pobreza, enfermedad holandesa). Al final hay tarjetas, simulacro, preguntas abiertas y una línea de tiempo de las ideas.'),
  dict(slug="matematicas-3", key="ruta-mat3-done", title="Matemáticas III · Economiapp", lib=["simbolico.js"], ext=["https://cdn.jsdelivr.net/npm/mathjs@12.4.3/lib/browser/math.js"],
       desc="Programa 1504103: integración por partes, trigonométrica, por sustitución trigonométrica y fracciones parciales, L'Hôpital, integrales impropias, ecuaciones diferenciales (separables, logística, lineales, Euler), sucesiones, series y criterios, series de potencias, Taylor e integrales dobles.",
       colors=("#7a3420", "#f2dbd2", "#d98f74", "#33150c"),
       lbl="Economiapp · Matemáticas III", h1="Matemáticas III", trunk="Tronco: las cuatro unidades del programa",
       intro='El tronco sigue las cuatro unidades del programa (1504103): técnicas de integración, ecuaciones diferenciales, series infinitas e integrales dobles. Las calculadoras usan SymPy en tu navegador y muestran las reglas que aplica (partes, sustitución, fracciones parciales), cada paso de L’Hôpital, los criterios de convergencia y las integrales iteradas; las gráficas muestran campos de direcciones, sumas parciales y polinomios de Taylor.'),
  dict(slug="matematicas-2", key="ruta-mat2-done", title="Matemáticas II · Economiapp", lib=["simbolico.js"], ext=["https://cdn.jsdelivr.net/npm/mathjs@12.4.3/lib/browser/math.js"],
       desc="Programa 1504102: método de Newton, extremos, crecimiento y concavidad, valor medio, optimización económica, antiderivadas, sumas de Riemann, teorema fundamental, integración numérica, excedentes, crecimiento exponencial y cálculo de varias variables con Lagrange.",
       colors=("#9a3d22", "#f5ddd3", "#e69a7d", "#3a1a10"),
       lbl="Economiapp · Matemáticas II", h1="Matemáticas II", trunk="Tronco: las cuatro unidades del programa",
       intro='El tronco sigue las cuatro unidades del programa (1504102): aplicaciones de la derivada, la integral definida, funciones trascendentes y funciones de varias variables. Las calculadoras usan SymPy en tu navegador: analizan la curva completa, integran mostrando cada regla y clasifican extremos de dos variables; otras son numéricas e interactivas, como Newton, Riemann, Simpson y las curvas de nivel.'),
  dict(slug="matematicas-1", key="ruta-mat1-done", title="Matemáticas I · Economiapp", lib=["simbolico.js"], ext=["https://cdn.jsdelivr.net/npm/mathjs@12.4.3/lib/browser/math.js"],
       desc="Programa 1504101: lógica y conjuntos, álgebra (factorización, división sintética, fracciones parciales), geometría analítica y cónicas, sistemas, desigualdades, funciones y transformaciones, trigonometría, exponenciales y logaritmos, límites, continuidad y derivadas.",
       colors=("#b5501c", "#f6e2d6", "#f0a070", "#3d2618"),
       lbl="Economiapp · Matemáticas I", h1="Matemáticas I", trunk="Tronco: las cinco unidades del programa",
       intro='El tronco sigue las cinco unidades del programa (1504101). Las calculadoras usan SymPy, el mismo motor de la app, corriendo en tu navegador: factorizan, resuelven desigualdades con su tabla de signos, analizan funciones y derivan mostrando cada regla. También hay tablas de verdad, diagramas de Venn, cónicas y la recta tangente como límite de secantes.'),
  dict(slug="finanzas-corporativas", key="ruta-fc-done", title="Finanzas Corporativas · Economiapp",
       desc="Programa 1501802: objetivo financiero y agencia, capital de trabajo (ciclo de efectivo, palanca de crecimiento, crédito comercial, lote económico), apalancamiento, CAPM y WACC, estructura de capital, EVA, valoración por flujo de caja descontado, dividendos y fusiones.",
       colors=("#1f5c4a", "#d9eee6", "#7cc7ab", "#0d2a21"),
       lbl="Economiapp · Finanzas Corporativas", h1="Finanzas Corporativas", trunk="Tronco: las seis unidades del programa",
       intro='El tronco sigue las seis unidades del programa (1501802). Cada laboratorio resuelve un caso con tus datos y muestra la fórmula y su equivalente en Excel, en continuidad con Gerencia Financiera: ciclo de efectivo y palanca de crecimiento, costo del crédito comercial, UAII-UPA, CAPM con beta apalancada, WACC, EVA, flujo de caja descontado, Lintner y fusiones. Al final hay tarjetas, simulacro y hoja de fórmulas.'),
  dict(slug="macroeconomia-3", key="ruta-mac3-done", title="Macroeconomía III · Economiapp",
       desc="Programa 1503713: el papel del Estado, reglas y discreción (Taylor), eficacia de la política, deuda y señoreaje, equivalencia ricardiana, multiplicadores, inconsistencia dinámica (Barro-Gordon), sesgo deficitario, y teoría de la tributación: IVA, incidencia, exceso de gravamen, Ramsey, renta y progresividad.",
       colors=("#7d2a4a", "#f4dde7", "#e48fb3", "#36101f"),
       lbl="Economiapp · Macroeconomía III", h1="Macroeconomía III", trunk="Tronco: política macroeconómica y finanzas públicas",
       intro='El tronco sigue las dos partes del programa (1503713): los problemas de la política macroeconómica y la teoría de la tributación. Los laboratorios resuelven los modelos del curso (Taylor, Lucas, dinámica de la deuda, Cagan, Barro-Gordon, ley de 1/n, Ramsey) y casos colombianos como el IVA en la cadena y la tabla del impuesto de renta en UVT. Al final hay tarjetas, simulacro y preguntas de ensayo.'),
  dict(slug="econometria-2", key="ruta-eco2-done", title="Econometría II · Economiapp", lib=["ts.js"],
       desc="Programa 1504111: estacionariedad, FAS y FAP, ARMA, Box-Jenkins, tendencias y regresión espuria, estacionalidad, Dickey-Fuller, Phillips-Perron y KPSS, pronósticos, ARCH-GARCH, VAR, cointegración (Engle-Granger y Johansen) y datos de panel.",
       colors=("#2f3f8f", "#dde3f6", "#8fa2e6", "#141c45"),
       lbl="Economiapp · Econometría II", h1="Econometría II", trunk="Tronco: series de tiempo y panel",
       intro='El tronco sigue las tres unidades del programa (1504111): series de tiempo univariadas, multivariadas y datos de panel. Cada laboratorio simula el proceso que se estudia o recibe tu propia serie pegada, hace las cuentas en el navegador (validadas contra R: urca, tseries y plm) y trae el código en R para repetirlo.'),
  dict(slug="historia-economica", key="ruta-he-done", title="Historia Económica · Economiapp",
       desc="Programa 1503722: resumen y guía de la formación del capitalismo y el crecimiento mundial en tres ciclos de acumulación (siglos XV a XX), con datos de Maddison, tarjetas, simulacro, preguntas abiertas y línea de tiempo.",
       colors=("#7a4b2a", "#f1e3d6", "#d9a57c", "#33200f"),
       lbl="Economiapp · Historia Económica", h1="Historia Económica", trunk="Tronco: las cuatro unidades del programa",
       intro='Resumen y guía del programa 1503722, con la bibliografía básica del curso (Cameron, Fazio, Maddison). Cada estación resume un tema, cierra con lo que debes saber para el examen y trae una práctica: tarjetas de conceptos, preguntas de opción múltiple, preguntas abiertas con esquema de respuesta, línea de tiempo o los datos de Maddison. El parcial evalúa las unidades 1 y 2, y el examen final las unidades 3 y 4.'),
  dict(slug="matematicas-economicas", key="ruta-me-done", title="Matemáticas para el análisis económico · Economiapp", lib=["mateco.js"], ext=["https://cdn.jsdelivr.net/npm/mathjs@12.4.3/lib/browser/math.js"],
       desc="Programa 1504105 (Chiang): estática comparativa con jacobianos, IS-LM, optimización libre y con restricciones (Lagrange, hessiano orlado, Kuhn-Tucker, envolvente), funciones homogéneas y CES, ecuaciones diferenciales y en diferencias, diagramas de fases, telaraña y Samuelson.",
       colors=("#2d5d2a", "#e0eedb", "#8cc47f", "#16301a"),
       lbl="Economiapp · Matemáticas para el análisis económico", h1="Matemáticas para el análisis económico", trunk="Tronco: programa del curso",
       intro='El tronco sigue las tres unidades del programa (1504105) con el texto de Chiang y Wainwright: estática comparativa, optimización y dinámica. Los laboratorios aceptan tus propias funciones (derivan de forma simbólica y resuelven numéricamente), muestran cada condición de primer y segundo orden, y grafican isocuantas, envolventes, trayectorias y diagramas de fases. Complementa a Matemáticas (cálculo básico) y a Métodos Lineales (matrices y valores propios).'),
  dict(slug="metodos-lineales", key="ruta-ml-done", title="Métodos Lineales · Economiapp", lib=["la.js"],
       desc="Programa 1504104: matrices, sistemas de ecuaciones (Gauss-Jordan, inversa, LU), determinantes y Cramer, modelos de Leontief e ingreso nacional, vectores y espacios vectoriales, Gram-Schmidt, valores propios y formas cuadráticas, con fracciones exactas paso a paso.",
       colors=("#8a3b12", "#f6e3d6", "#e8a274", "#3d1d0b"),
       lbl="Economiapp · Métodos Lineales", h1="Métodos Lineales", trunk="Tronco: programa del curso",
       intro='El tronco sigue las tres unidades del programa (1504104): matrices y sistemas de ecuaciones, espacios vectoriales, y ortogonalidad con valores propios. Cada laboratorio recibe tu propia matriz, resuelve con fracciones exactas (sin redondeos) y muestra cada operación por filas como se hace a mano. Las aplicaciones económicas (Leontief, ingreso nacional, mercados) están en la estación de modelos de equilibrio.'),
  dict(slug="estadistica-1", key="ruta-est1-done", title="Estadística I · Economiapp", lib=["est1.js"],
       desc="Programa 1504108: estadística descriptiva, conteo, probabilidad y Bayes, variables aleatorias y distribuciones conjuntas, esperanza y Chebyshev, distribuciones discretas y continuas, aproximación normal, transformaciones y funciones generadoras de momentos, con el código en R.",
       colors=("#1f5f8b", "#dcebf6", "#86b9e0", "#102f45"),
       lbl="Economiapp · Estadística I", h1="Estadística I", trunk="Tronco: programa del curso",
       intro='El tronco sigue las siete unidades del programa (1504108): estadística descriptiva, probabilidad, variables aleatorias, esperanza, distribuciones discretas, distribuciones continuas y funciones de variables aleatorias. Cada laboratorio resuelve el ejercicio paso a paso y muestra el código en R que lo reproduce, porque el curso trabaja con R. Continúa en Estadística 2 (estimación y pruebas de hipótesis).'),
  dict(slug="estadistica-2", key="ruta-est2-done", title="Estadística II · Economiapp", lib="estadistica.js",
       desc="Programa 1504109: distribuciones muestrales (ji cuadrado, t, F y estadísticas de orden), ley de los grandes números, límite central y método delta, estimadores (Cramér-Rao, suficiencia, momentos y máxima verosimilitud), intervalos, Neyman-Pearson y razón de verosimilitud, pruebas ji cuadrado y regresión lineal múltiple, con el código en R.",
       colors=("#0d6e6a", "#d4ebe8", "#5cc8bd", "#143a37"),
       lbl="Economiapp · Estadística II", h1="Estadística II", trunk="Tronco: las cinco unidades del programa",
       intro='El tronco sigue las cinco unidades del programa (1504109, con Walpole y Wasserman): distribuciones de muestreo, convergencia estocástica, estimación puntual e intervalos, pruebas de hipótesis y regresión lineal múltiple. Los laboratorios simulan miles de muestras para que veas las distribuciones teóricas aparecer, resuelven cada intervalo y prueba paso a paso y muestran el código en R que lo reproduce. Viene de Estadística I y lleva a Econometría I.'),
  dict(slug="teoria-juegos", key="ruta-tj-done", title="Teoría de Juegos · Economiapp", lib=["juegos.js", "extensiva.js"],
       desc="Programa 1503704: forma estratégica y extensiva, dominancia, equilibrio de Nash en puras y mixtas, suma cero, Cournot y Bertrand, bienes públicos y suscripción, equilibrio perfecto en subjuegos, juegos repetidos y teorema de Folk, Bayes-Nash, bayesiano perfecto y señalización, con resolvedores paso a paso.",
       colors=("#6b3fa0", "#ebe1f6", "#c3a6f0", "#2e2244"),
       lbl="Economiapp · Teoría de Juegos", h1="Teoría de Juegos", trunk="Tronco: las cuatro unidades del programa",
       intro='Del planteamiento del juego a los equilibrios en estrategias puras y mixtas, las aplicaciones con estrategias continuas, los juegos dinámicos (EPS) y los de información incompleta (Bayes-Nash y EBP), con la notación del curso: G(Γ), r<sub>i</sub>, ρ<sub>i</sub>, σ y μ. El primer y el segundo taller están resueltos punto por punto en «Talleres resueltos», y cada lección muestra qué puntos le corresponden. Los resolvedores traen todos los puntos con tabla o árbol, agrupados por taller y en orden, y muestran cada paso como se hace a mano. Lo marcado como <span class="tag nw">Nuevo</span> no estaba en la app original.'),
]
MATERIAS += [
  dict(slug="derecho-laboral", key="ruta-lab-done", title="Derecho Laboral y Comercial · Economiapp", lib="laboral.js", mathjax=True,
       extra_js='window.RUTA_TRUNK_NOTE="";',
       desc="Programa 1501875: contrato de trabajo, período de prueba, suspensión y prescripción, prórrogas e indemnizaciones, empleador y trabajador, salario y embargos, nómina, prestaciones, riesgos laborales, sanciones, y derecho comercial (comerciante, títulos valores, sociedades), con calculadoras.",
       colors=("#7a5a2e", "#efe4d3", "#d9b07a", "#352a1c"),
       lbl="Economiapp · Derecho Laboral y Comercial", h1="Derecho Laboral y Comercial", trunk="Tronco: las unidades del programa",
       intro="El tronco sigue el programa 1501875: las siete unidades de derecho laboral con el Código Sustantivo del Trabajo vigente (reformado por la Ley 2466 de 2025) y la parte de derecho comercial con el Código de Comercio: el comerciante y los actos de comercio, los bienes mercantiles y títulos valores, y las sociedades. Con el expediente puedes seguir un mismo caso por todas las herramientas. Cada estación tiene una calculadora que muestra el cálculo paso a paso. Es una herramienta de estudio, no asesoría legal."),
  dict(slug="matematicas", key="ruta-mat-done", title="Matemáticas · Economiapp", lib=["simbolico.js"], ext=["https://cdn.jsdelivr.net/npm/mathjs@12.4.3/lib/browser/math.js"],
       desc="Álgebra, límites, derivadas, integrales y optimización con restricciones, con calculadoras paso a paso.",
       colors=("#b5501c", "#f6e2d6", "#f0a070", "#3d2618"),
       lbl="Economiapp · Matemáticas", h1="Matemáticas", trunk="Tronco: módulos de la app",
       intro='<b>Esta ruta se reemplazó por <a href="matematicas-1.html">Matemáticas I</a>, <a href="matematicas-2.html">Matemáticas II</a> y <a href="matematicas-3.html">Matemáticas III</a>, cada una con su programa.</b> Se conserva como repaso rápido. Los módulos de Economiapp ordenados por tema: álgebra, límites, derivadas e integrales, más una estación nueva de optimización con restricciones. Las calculadoras usan SymPy, el mismo motor de la app, corriendo en tu navegador. Lo marcado como <span class="tag nw">Nuevo</span> no estaba en la app original.'),
  dict(slug="principios-micro", key="ruta-pmic-done", title="Principios de Microeconomía · Economiapp", lib=["micro.js"],
       desc="Programa 1503701: supuestos y herramientas matemáticas; teoría del consumidor (presupuesto, preferencias, elección, Slutsky, excedentes, demanda, dotaciones, elección intertemporal); teoría del productor (tecnología, costos, beneficio, oferta) y equilibrio competitivo con bienestar, controles de precios e impuestos.",
       colors=("#1f6f6b", "#d8efec", "#7cc7bf", "#123b39"),
       lbl="Economiapp · Principios de Microeconomía", h1="Principios de Microeconomía", trunk="Tronco: programa del curso",
       intro='El tronco sigue el programa del curso (1503701) en sus cuatro unidades: introducción y herramientas matemáticas, teoría del consumidor (con la notación de Varian), teoría del productor (con la de Nicholson) y equilibrio del mercado competitivo. Cada estación tiene un laboratorio que resuelve el modelo paso a paso con su gráfico: elección óptima con cinco tipos de preferencias, Slutsky y Hicks, variación compensatoria y equivalente, costos, oferta de la empresa y de la industria, impuestos y controles de precios.'),
  dict(slug="microeconomia-1", key="ruta-micro1-done", title="Microeconomía I · Economiapp", lib=["micro1.js"],
       desc="Programa 1503702: competencia imperfecta. Repaso de costos y eficiencia, naturaleza de la empresa, monopolio (multiplanta, natural, disuasión de entrada, discriminación, competencia monopolística), regulación, mercado de factores y oligopolio con teoría de juegos.",
       colors=("#5b3f8c", "#e8e0f3", "#b29ee0", "#2a1d42"),
       lbl="Economiapp · Microeconomía I", h1="Microeconomía I", trunk="Tronco: programa del curso",
       intro='El tronco sigue el programa del curso (1503702): mercados en los que el precio se aparta del costo marginal. Repaso de costos y eficiencia, la naturaleza de la empresa, el monopolio y sus variantes, la regulación, el mercado de factores y el oligopolio. Cada estación tiene un laboratorio con el procedimiento paso a paso; los ejemplos usan demanda lineal P = a − bQ y costos F + cq + dq².'),
  dict(slug="microeconomia-2", key="ruta-micro2-done", title="Microeconomía II · Economiapp", lib=["micro2.js"],
       desc="Programa 1503703: equilibrio general y teoremas del bienestar, elección social y bienestar, externalidades, bienes públicos, elección bajo incertidumbre e información asimétrica.",
       colors=("#8c5a1f", "#f4e7d6", "#e0b47c", "#3f2810"),
       lbl="Economiapp · Microeconomía II", h1="Microeconomía II", trunk="Tronco: programa del curso",
       intro='El tronco sigue el programa del curso (1503703), con los capítulos de Varian y Nicholson que indica: equilibrio general (caja de Edgeworth, teoremas del bienestar, producción), elección social y bienestar, externalidades, bienes públicos, incertidumbre e información asimétrica. Cada estación tiene un laboratorio que resuelve el modelo paso a paso.'),
  dict(slug="principios-macro", key="ruta-pmac-done", title="Principios de Macroeconomía · Economiapp", lib=["principios.js","visual.js"],
       desc="Programa 1503710: medición del PIB, precios, empleo y ciclos; crecimiento, modelo de producción, Solow, mercado laboral e inflación; corto plazo con IS, política monetaria, curva de Phillips y OA-DA, con laboratorios.",
       colors=("#9e2a3e", "#f5dde1", "#ec8a9c", "#3d1a21"),
       lbl="Economiapp · Principios de Macroeconomía", h1="Principios de Macroeconomía", trunk="Tronco: programa del curso",
       intro='El tronco sigue el programa del curso (1503710) y la notación de Jones, <i>Macroeconomics</i>: preliminares (medición del PIB, los precios, el empleo y los ciclos), largo plazo (crecimiento, modelo de producción, Solow, mercado laboral e inflación) y corto plazo (brecha del producto, Gran Recesión, IS, política monetaria con curva de Phillips y OA-DA). Cada estación tiene un laboratorio que resuelve el modelo paso a paso, y las de Solow, IS-MP y OA-DA tienen gráficos que se arrastran. El modelo keynesiano, el mercado de dinero y el IS-LM de la app original quedaron como ramas.'),
  dict(slug="macroeconomia-2", key="ruta-macro2-done", title="Macroeconomía II · Economiapp", lib=["macro2.js","visual.js"], mathjax=True,
       desc="Programa 1503712: balanza de pagos, paridades, mercado de divisas, creación de dinero, Krugman, Mundell-Fleming, SA-DA, esterilización, sobrerreacción de Dornbusch, tipo de cambio real y Balassa-Samuelson, política monetaria, regímenes cambiarios y crisis, con laboratorios.",
       colors=("#1f5f8b", "#dcebf5", "#7fb8e0", "#16324a"),
       lbl="Economiapp · Macroeconomía II", h1="Macroeconomía II", trunk="Tronco: las siete unidades del programa",
       intro='La economía abierta con la notación del curso: EMB, EMA, EMM, EMD, EOD/EDD y los mecanismos de transmisión con ∆+ y ∆-. La primera estación explica las siglas y el método para armar cadenas; el resto sigue las siete unidades del programa (1503712), en el orden en que se ven en clase y con la convención y los ejemplos de las notas. Los laboratorios resuelven los modelos con números, y los talleres traen resueltos los tres parciales de preparación, el supletorio 2025-2 y la práctica de la guía.'),
  dict(slug="macroeconomia-1", key="ruta-macro1-done", title="Macroeconomía I · Economiapp", lib=["macro.js","visual.js"],
       desc="Programa 1503711: hechos del ciclo con el filtro HP, modelo de un período, consumo intertemporal, ciclo de vida, renta permanente y Hall, CCAPM, inversión, q de Tobin y acelerador, equivalencia ricardiana y dinámica de la deuda, economía cerrada de dos períodos, y crecimiento con Solow, MRW, AK, contabilidad del crecimiento y Ramsey.",
       colors=("#3d6b1f", "#e3eed7", "#9fd06f", "#26341a"),
       lbl="Economiapp · Macroeconomía I", h1="Macroeconomía I", trunk="Tronco: las cinco unidades del programa",
       intro='El tronco sigue las cinco unidades del programa (1503711), con De Gregorio, Williamson y Sala-i-Martin: introducción y hechos del ciclo, microfundamentos de la demanda agregada (consumo, activos e inversión), gobierno y política fiscal, la economía cerrada y el crecimiento de largo plazo. Cada laboratorio resuelve el modelo paso a paso; en los de crecimiento puedes mover los parámetros y ver la transición, el diagrama de fases y la senda de silla.'),
  dict(slug="historia-pensamiento", key="ruta-hpe-done", title="Historia del Pensamiento Económico · Economiapp", lib=["historia.js","visual.js"], mathjax=True,
       desc="Mercantilismo, fisiocracia, Smith, Sraffa, Marx, Walras, fallos de mercado, Pigou, Keynes y de Hicks a Lucas, con laboratorios y preparación del parcial.",
       colors=("#8a5a12", "#f3e6cc", "#e0b25e", "#3a2a10"),
       lbl="Economiapp · Historia del Pensamiento Económico", h1="Historia del Pensamiento Económico", trunk="Tronco: las tres unidades del programa",
       intro='Las tres unidades del programa con el libro de Tobón, <i>La génesis de la teoría económica contemporánea</i> (2023): la riqueza y el nacimiento de la ciencia, la coordinación por los precios (Sraffa, Marx, Walras y los fallos de mercado) y la determinación del empleo (Pigou, Keynes y de Hicks a Lucas). Los laboratorios resuelven los modelos con números, los visuales muestran los gráficos de la unidad 3, y las ramas y talleres preparan cada punto del parcial: definiciones, «explique la teoría», tablas de diferencias y ensayo.'),
  dict(slug="gerencia-financiera", key="ruta-gf-done", title="Gerencia Financiera I · Economiapp", lib=["finanzas.js"], mathjax=True,
       desc="Programa 1501798: dirección financiera, agencia y gobierno corporativo; valor del dinero en el tiempo, tasas (incluida la continua), flujos de caja del proyecto y del inversionista, anualidades, gradientes, amortización en pesos y UVR, criterios de inversión, EFAF y EFE, y rentabilidad y riesgo, con la fórmula de Excel.",
       colors=("#0f6b4f", "#d6eee4", "#5fcf9f", "#163a2d"),
       lbl="Economiapp · Gerencia Financiera I", h1="Gerencia Financiera I", trunk="Tronco: las siete unidades del programa",
       intro='El tronco sigue las siete unidades del programa (1501798) con la notación y los casos del profesor Luis Fernando Vásquez Villa: dirección financiera y creación de valor, valor del dinero en el tiempo, pagos únicos, tasas nominales, efectivas, vencidas y anticipadas, tasas indexadas, anualidades, sistemas de amortización (también en UVR), gradientes, criterios de inversión, análisis financiero (EFAF y EFE) y rentabilidad y riesgo. Cada laboratorio dibuja el flujo de caja, arma la tabla de variables para copiar al Word y da la fórmula de Excel que se arrastra. El taller trae resuelto el Parcial 01 de práctica.'),
  dict(slug="econometria", key="ruta-eco-done", title="Econometría I · Economiapp", lib=["estadistica.js"], mathjax=True,
       extra_js='window.RUTA_EXAM="Parcial 2";window.RUTA_TRUNK_NOTE="";', css=ECO_CSS,
       desc="Programa 1504110: R desde cero, regresión múltiple matricial, inferencia y pruebas LR, Wald y LM, dicotómicas y Chow; diagnóstico (multicolinealidad, heterocedasticidad, autocorrelación, normalidad, influyentes); MCG, variables instrumentales, GMM y elección discreta, con talleres en 3D.",
       colors=("#2546a8", "#dbe2f5", "#7f9cf0", "#22305a"),
       lbl="Econometría I · de R desde cero al programa completo", h1="Econometría I", trunk="Tronco: las seis unidades del programa",
       intro="Pensada para empezar de cero: la primera estación instala R y enseña lo básico, y cada lección trae un manual paso a paso donde cada explicación tiene su par fórmula | código R, probado con las bases del libro de Wooldridge. El tronco sigue las seis unidades del programa (1504110): repaso del modelo lineal, pruebas de diagnóstico, MCG, variables instrumentales, GMM y variable dependiente discreta; las ramas profundizan en cambio estructural, panel y series. Los talleres del curso están resueltos punto por punto, y cada lección muestra qué puntos le corresponden y resuelve uno de ejemplo. Para tus propios números hay dos herramientas: la Calculadora (si el enunciado trae SCR, R² o matrices) y el Laboratorio de datos (si trae la tabla o un archivo)."),
]
MATERIAS += [dict(slug=g["slug"], key="ruta-" + g["dir"] + "-done", title=g["h1"] + " · Economiapp", desc=g["desc"], colors=tuple(g["colors"]), lbl="Economiapp · " + g["h1"], h1=g["h1"], trunk=g["trunk"], intro=g["intro"]) for g in GMETA]
for m in MATERIAS:
    l, ls, d, ds = m["colors"]
    mj = MATHJAX if m.get("mathjax", True) else ""
    html = HEAD.format(title=m["title"], desc=m["desc"], fonts=FONTS, mathjax=mj, analytics=analytics_tag(), pwa=pwa_tags("../"), l=l, ls=ls, d=d, ds=ds)
    if m.get("css"):
        marker = ":root[data-theme=\"dark\"]{--line:" + d + ";--line-soft:" + ds + "}\n</style>"
        assert marker in html
        html = html.replace(marker, marker[:-len("</style>")] + "/* estilos propios de esta materia */\n" + m["css"] + "\n</style>")
    html += body(m["lbl"], m["h1"], m["intro"], m["trunk"])
    libs = m.get("lib") or []
    libs = [libs] if isinstance(libs, str) else libs
    lib = "".join(f'<script src="{u}"></script>\n' for u in m.get("ext", [])) + "".join(f'<script src="../comun/{x}"></script>\n' for x in libs)
    html += f'<script>window.RUTA_KEY="{m["key"]}";{m.get("extra_js", "")}</script>\n{lib}<script src="{m["slug"]}/contenido.js"></script>\n<script src="../comun/ruta.js"></script>\n<script src="{m["slug"]}/laboratorios.js"></script>\n<script>RUTA_START();</script>\n</body>\n</html>\n'
    wr(f"materias/{m['slug']}.html", html)

# ---------- catálogo para la portada (temas, progreso y buscador)
def catalog_js(content_path):
    js = open(content_path, encoding="utf-8").read()
    kw = r"""const KW=s=>{const h=(s.html||"")+(s.deep||[]).map(d=>"<b>"+d.t+"</b>").join("")+(s.d?"<b>"+s.d+"</b>":"");
  const parts=[...h.matchAll(/<(h3|b)>([\s\S]*?)<\/\1>/g)].map(m=>m[2].replace(/<[^>]+>/g,"").replace(/\\[()\[\]]/g,"").replace(/\s+/g," ").trim()).filter(x=>x&&x.length<70);
  return [...new Set(parts)].join(" · ").slice(0,400)};"""
    prog = js + "\n" + kw + "\nconsole.log(JSON.stringify({t:TRUNK.map(s=>[s.id,s.t,KW(s)]),b:BRANCHES.flatMap(g=>g.items.map(i=>[i.id,i.t,g.g,KW(i)])),w:WORKSHOPS.map(w=>[w.id,w.t,KW(w)])}))"
    import tempfile
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as tf:
        tf.write(prog)
    try:
        return json.loads(subprocess.run(["node", tf.name], capture_output=True, text=True, check=True).stdout)
    finally:
        os.unlink(tf.name)
RES = {"microeconometria": "MCO robusto, VI, MC2E, GMM y prueba J, panel y Hausman, Arellano-Bond, probit, logit, tobit, Heckman, tratamiento y duración.",
       "economia-ambiental": "Sostenibilidad, costo-beneficio, Hotelling, pesca, Faustmann, contaminación óptima, impuestos y permisos, costo de viaje y valoración contingente.",
       "economia-internacional": "Ricardo, DFS, factores específicos, Heckscher-Ohlin, gravedad, Krugman, dumping, aranceles, protección efectiva, Viner y Brander-Spencer.",
       "contabilidad": "Normas y NIIF, partida doble, diario y mayor, depreciación, kárdex, estados financieros, flujo de efectivo, análisis vertical y horizontal e indicadores.",
       "evaluacion-proyectos": "Marco lógico, demanda, localización, equilibrio, Conesa, riesgos, flujos de caja, VPN, TIR, TIRM, Hillier, Monte Carlo y precios de cuenta.",
       "desarrollo-economico": "IDH, pobreza y desigualdad, Malthus, Harrod-Domar, Solow, crecimiento endógeno, convergencia, Big Push, Lewis, CEPAL, instituciones y clústeres.",
       "matematicas-3": "Partes, sustitución trigonométrica, fracciones parciales, L’Hôpital, impropias, EDO, series, Taylor e integrales dobles.",
       "matematicas-2": "Newton, extremos y concavidad, optimización, antiderivadas, Riemann, teorema fundamental, Simpson, excedentes, varias variables y Lagrange.",
       "matematicas-1": "Lógica, conjuntos, álgebra, cónicas, desigualdades, funciones, trigonometría, logaritmos, límites, continuidad y derivadas.",
       "finanzas-corporativas": "Agencia, capital de trabajo, apalancamiento, CAPM, WACC, estructura de capital, EVA, flujo de caja descontado, dividendos y fusiones.",
       "macroeconomia-3": "Reglas y discreción, deuda, señoreaje, Ricardo, Barro-Gordon, sesgo deficitario, IVA, incidencia, Ramsey y progresividad de la renta.",
       "econometria-2": "ARMA, Box-Jenkins, raíces unitarias, pronósticos, GARCH, VAR, cointegración y panel con efectos fijos y aleatorios.",
       "historia-economica": "Tres ciclos de acumulación del siglo XV al XX, gran divergencia, Revolución Industrial, Gran Depresión y edad de oro, con datos de Maddison.",
       "matematicas-economicas": "Estática comparativa, jacobianos, IS-LM, Lagrange, Kuhn-Tucker, envolvente, CES, EDO, diferencias, fases, telaraña y Samuelson.",
       "metodos-lineales": "Matrices, Gauss-Jordan, inversa, LU, determinantes, Cramer, Leontief, espacios vectoriales, Gram-Schmidt, valores propios y formas cuadráticas.",
       "econometria": "MCO matricial, pruebas LR, Wald y LM, diagnóstico, MCG, variables instrumentales, GMM y logit-probit, con R desde cero.",
       "estadistica-1": "Descriptiva, probabilidad, Bayes, distribuciones discretas y continuas, y funciones generadoras de momentos.",
       "estadistica-2": "Distribuciones muestrales, TLC y método delta, Cramér-Rao, intervalos, razón de verosimilitud, ji cuadrado y regresión múltiple.",
       "macroeconomia-1": "Ciclos, consumo intertemporal y renta permanente, CCAPM, inversión, deuda pública, economía cerrada y crecimiento (Solow, MRW, AK, Ramsey).",
       "macroeconomia-2": "Economía abierta: balanza de pagos, paridades, Krugman, Mundell-Fleming, SA-DA, Dornbusch, tipo de cambio real, política monetaria, regímenes y crisis.",
       "teoria-juegos": "Nash en puras y mixtas, Cournot, Bertrand, Stackelberg, EPS, Bayes-Nash y EBP, con resolvedores de tablas y de árboles.",
       "matematicas": "Álgebra, límites, derivadas e integrales con calculadoras paso a paso, y optimización con restricciones.",
       "microeconomia-1": "Monopolio, discriminación, regulación, monopsonio y oligopolio (Cournot, Stackelberg, Bertrand, cartel).",
       "microeconomia-2": "Equilibrio general, bienestar social, externalidades, bienes públicos, incertidumbre e información asimétrica.",
       "principios-micro": "Consumidor, productor y equilibrio competitivo: elección, Slutsky, excedentes, costos, oferta, impuestos y controles de precios.",
       "principios-macro": "Medición, ciclos, crecimiento y Solow, mercado laboral, inflación, IS, política monetaria, Phillips y OA-DA.",
       "historia-pensamiento": "Mercantilismo, fisiocracia, Smith, Sraffa, Marx, Walras, Pigou, Keynes y de Hicks a Lucas, con simulacros de parcial.",
       "gerencia-financiera": "Creación de valor y agencia, tasas, flujos de caja, anualidades, amortización (también UVR), gradientes, VPN/TIR, EFAF y rentabilidad y riesgo.",
       "derecho-laboral": "Contrato de trabajo, salario y embargos, nómina, prestaciones, riesgos y sanciones, más derecho comercial: comerciante, títulos valores y sociedades."}
NOMBRE = {"microeconometria": "Microeconometría", "economia-ambiental": "Economía Ambiental", "economia-internacional": "Economía Internacional", "contabilidad": "Contabilidad y Análisis Financiero", "evaluacion-proyectos": "Evaluación de Proyectos", "desarrollo-economico": "Desarrollo Económico", "matematicas-3": "Matemáticas III", "matematicas-2": "Matemáticas II", "matematicas-1": "Matemáticas I", "finanzas-corporativas": "Finanzas Corporativas", "macroeconomia-3": "Macroeconomía III", "econometria-2": "Econometría II", "historia-economica": "Historia Económica", "matematicas-economicas": "Matemáticas para el análisis económico", "metodos-lineales": "Métodos Lineales", "derecho-laboral": "Derecho Laboral y Comercial", "matematicas": "Matemáticas", "principios-micro": "Principios de Microeconomía", "microeconomia-1": "Microeconomía I", "estadistica-1": "Estadística I", "microeconomia-2": "Microeconomía II", "principios-macro": "Principios de Macroeconomía", "econometria": "Econometría I", "estadistica-2": "Estadística II", "macroeconomia-1": "Macroeconomía I", "macroeconomia-2": "Macroeconomía II", "teoria-juegos": "Teoría de Juegos", "historia-pensamiento": "Historia del Pensamiento Económico", "gerencia-financiera": "Gerencia Financiera I"}
# ---------- plan de estudios (Economía 2015-I, U. de Antioquia). tipo: modulo (laboratorios) o guia (resumen y guía)
RES.update({g["slug"]: g["res"] for g in GMETA})
NOMBRE.update({g["slug"]: g["nombre"] for g in GMETA})
PLAN = [
 (1,"1504101","Matemáticas I","modulo","matematicas-1",""),
 (1,"1503700","Introducción a la Economía","guia",None,""),
 (1,"1501749","Fundamentos de Administración","guia",None,""),
 (1,"1503730","Fuentes y Técnicas de Investigación Económica","guia",None,""),
 (1,"1501782","Desarrollo Humano","guia",None,""),
 (2,"1504102","Matemáticas II","modulo","matematicas-2",""),
 (2,"1501874","Contabilidad y Análisis Financiero","modulo","contabilidad",""),
 (2,"1503720","Economía Clásica","guia",None,"Smith, Ricardo y Marx también se estudian en Historia del Pensamiento Económico."),
 (2,"1503731","Lectoescritura Económica","guia",None,""),
 (2,"1501738","Inglés I","guia",None,""),
 (3,"1503701","Principios de Microeconomía","modulo","principios-micro",""),
 (3,"1504104","Métodos Lineales","modulo","metodos-lineales",""),
 (3,"1504103","Matemáticas III","modulo","matematicas-3",""),
 (3,"1503721","Economía Política","guia",None,""),
 (3,"1501783","Inglés II","guia",None,""),
 (4,"1503702","Microeconomía I","modulo","microeconomia-1",""),
 (4,"1503710","Principios de Macroeconomía","modulo","principios-macro",""),
 (4,"1504105","Matemáticas para el Análisis Económico","modulo","matematicas-economicas",""),
 (4,"1504108","Estadística I","modulo","estadistica-1",""),
 (4,"1501787","Inglés III","guia",None,""),
 (4,"","Formación Ciudadana y Constitucional","guia",None,""),
 (5,"1503703","Microeconomía II","modulo","microeconomia-2",""),
 (5,"1503704","Teoría de Juegos","modulo","teoria-juegos",""),
 (5,"1503711","Macroeconomía I","modulo","macroeconomia-1",""),
 (5,"1504109","Estadística II","modulo","estadistica-2",""),
 (5,"1501790","Inglés IV","guia",None,""),
 (6,"1504110","Econometría I","modulo","econometria",""),
 (6,"1503712","Macroeconomía II","modulo","macroeconomia-2",""),
 (6,"1501798","Gerencia Financiera","modulo","gerencia-financiera",""),
 (6,"1501875","Derecho Comercial y Laboral","modulo","derecho-laboral",""),
 (6,"1503722","Historia Económica","guia","historia-economica",""),
 (7,"1504111","Econometría II","modulo","econometria-2",""),
 (7,"1503713","Macroeconomía III","modulo","macroeconomia-3",""),
 (7,"1503705","Economía Internacional","modulo","economia-internacional",""),
 (7,"1501802","Finanzas Corporativas","modulo","finanzas-corporativas",""),
 (7,"1503723","Historia del Pensamiento Económico","guia","historia-pensamiento",""),
 (8,"1503714","Desarrollo Económico","modulo","desarrollo-economico",""),
 (8,"1503724","Historia Económica de Colombia","guia",None,""),
 (8,"1503740","Epistemología de las Ciencias Económicas","guia",None,""),
 (8,"1503803","Opción I: Economía y Políticas Públicas","guia",None,"Electiva"),
 (8,"1503807","Opción I: Economía Ambiental","modulo","economia-ambiental","Electiva"),
 (9,"1503750","Evaluación de Proyectos","modulo","evaluacion-proyectos",""),
 (9,"1503715","Economía Colombiana","guia",None,""),
 (9,"1503741","Ética Profesional","guia",None,""),
 (9,"1503800","Opción II: Negocios y Emprendimiento","guia",None,"Electiva"),
 (9,"1503814","Opción II: Economía Institucional","guia",None,"Electiva"),
 (9,"1503806","Opción III: Finanzas Públicas Territoriales","guia",None,"Electiva"),
 (9,"1503810","Opción III: Microeconometría","modulo","microeconometria","Electiva"),
 (10,"1503732","Monografía de Grado","guia",None,""),
]
_GC = {g["cod"]: g["slug"] for g in GMETA}
PLAN = [(a, b, c, d, e or _GC.get(b or c), f) for a, b, c, d, e, f in PLAN]
PLANJ = [dict(sem=a, cod=b, nombre=c, tipo=d, slug=e, nota=f) for a, b, c, d, e, f in PLAN]
BYS = {m["slug"]: m for m in MATERIAS}
assert all(e in BYS for (_a, _b, _c, _d, e, _f) in PLAN if e)
cat = [dict(slug=k, nombre=NOMBRE[k], key=BYS[k]["key"], color=[BYS[k]["colors"][0], BYS[k]["colors"][2]], resumen=RES[k],
            **catalog_js(os.path.join(OUT, f"materias/{k}/contenido.js"))) for k in dict.fromkeys(e for (_a, _b, _c, _d, e, _f) in PLAN if e)]
for c in cat:
    assert len(c["t"]) >= 3 and c["w"], c["slug"]
proximas = []
idx = open(os.path.join(S, "portada.html"), encoding="utf-8").read()
idx = idx.replace("/*CATALOGO*/", "const MATERIAS=" + json.dumps(cat, ensure_ascii=False) + ";\nconst PROXIMAS=" + json.dumps(proximas, ensure_ascii=False) + ";\nconst PLAN=" + json.dumps(PLANJ, ensure_ascii=False) + ";")
idx = idx.replace("</head>", analytics_tag().lstrip() + "\n</head>", 1) if ANALYTICS_ID else idx
idx = idx.replace("</head>", pwa_tags("./").lstrip() + "\n</head>", 1)
wr("index.html", idx)
wr(".nojekyll", "")
shutil.copy(os.path.join(S, "LEEME.md"), os.path.join(OUT, "LEEME.md"))
print({c["slug"]: (len(c["t"]), len(c["b"]), len(c["w"])) for c in cat})

# ---------------------------------------------------------------------
# App instalable: íconos, manifiesto y service worker (con la lista de todo el sitio)
import hashlib, re as _re
wr("comun/app.js", open(os.path.join(S, "app.js"), encoding="utf-8").read())
# Dominio propio (GitHub Pages lo lee de este archivo)
DOMINIO = "economiapp.app"
wr("CNAME", DOMINIO + "\n")
os.makedirs(os.path.join(OUT, "iconos"), exist_ok=True)
for _f in sorted(os.listdir(os.path.join(S, "iconos"))):
    shutil.copy(os.path.join(S, "iconos", _f), os.path.join(OUT, "iconos", _f))
wr("manifest.webmanifest", json.dumps({
    "name": "Economiapp · Rutas de estudio de Economía", "short_name": "Economiapp",
    "description": "Las materias de Economía como líneas de metro: lecciones, laboratorios y simulacros.",
    "lang": "es-CO", "dir": "ltr", "start_url": "./?fuente=app", "scope": "./", "id": "./",
    "display": "standalone", "orientation": "any", "background_color": "#edf0ea", "theme_color": "#1b2430",
    "categories": ["education", "productivity"],
    "icons": [{"src": "iconos/icon-192.png", "sizes": "192x192", "type": "image/png"},
              {"src": "iconos/icon-512.png", "sizes": "512x512", "type": "image/png"},
              {"src": "iconos/maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable"},
              {"src": "iconos/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]
}, ensure_ascii=False, indent=1))
_files, _ext, _h = [], set(), hashlib.sha256()
for _d, _, _fs in sorted(os.walk(OUT)):
    for _f in sorted(_fs):
        _p = os.path.join(_d, _f); _r = os.path.relpath(_p, OUT).replace(os.sep, "/")
        if _r in ("sw.js", "LEEME.md"):
            continue
        _files.append("./" + ("" if _r == "index.html" else _r)); _h.update(_r.encode()); _h.update(open(_p, "rb").read())
        if _r.endswith(".html"):
            for _u in _re.findall(r'<script[^>]+src="(https://[^"]+)"', open(_p, encoding="utf-8").read()):
                if "googletagmanager" not in _u and "pyodide" not in _u:
                    _ext.add(_u)
_sw = open(os.path.join(S, "sw.js"), encoding="utf-8").read()
_sw = _sw.replace("__VERSION__", _h.hexdigest()[:12]).replace("__ARCHIVOS__", json.dumps(_files + sorted(_ext), ensure_ascii=False))
wr("sw.js", _sw)
