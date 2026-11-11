# Generador de guías de estudio: escribe gx/<dir>/content.js y actualiza gx/meta.json
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))

def js(v):
    return json.dumps(v, ensure_ascii=False)

def guide(meta, unidades, stations, GL, MCQ, ABIERTAS, TL=None, extra_ws=None):
    """stations: (id, u, titulo, sim, [(h3, html), ...])"""
    d = os.path.join(HERE, meta["dir"]); os.makedirs(d, exist_ok=True)
    TL = TL or []
    tr = []
    for sid, u, t, sim, secs in stations:
        body = "".join(f"<section><h3>{s[0]}</h3>{''.join(s[1:])}</section>" for s in secs)
        tr.append("{id:%s, parte:%s, u:%d, t:%s, sim:%s, html:%s+LAB}" % (js(sid), js(unidades[u]), u, js(t), js(sim), js(body)))
    first, last = stations[0][0], stations[-1][0]
    ws = [
        {"id": "conceptos", "t": "Tarjetas de conceptos", "anchor": first, "links": [s[0] for s in stations[:3]], "sim": "tarjetas", "d": "Los conceptos del curso en tarjetas."},
        {"id": "simulacro", "t": "Simulacro de examen", "anchor": last, "links": [s[0] for s in stations[-3:]], "sim": "quiz", "d": "Diez preguntas al azar con explicación."},
        {"id": "abiertas", "t": "Preguntas abiertas", "anchor": last, "links": [s[0] for s in stations[1:4]], "sim": "abiertas", "d": "Preguntas de desarrollo con esquema de respuesta."},
    ]
    if TL:
        ws.append({"id": "linea", "t": "Línea de tiempo", "anchor": last, "links": [s[0] for s in stations[:3]], "sim": "tiempo", "d": "Hechos y autores en orden cronológico."})
    ws += extra_ws or []
    out = f"""// =====================================================================
// GUÍA DE ESTUDIO: {meta['h1']} ({meta['cod'] or 'sin código'}, U. de Antioquia, plan 2015-I).
// =====================================================================
const GUIA_ID={js(meta['dir'])};
const LAB=`<section><h3>Repaso</h3><div class="sim" id="sim"></div></section>`;
const UNIDADES={js({k: v for k, v in unidades.items()})};
const TRUNK=[
{(','+chr(10)).join(tr)}
];
const BRANCHES=[];
const WSBOX=`<div class="sim" id="sim"></div>`;
const WORKSHOPS={js(ws)}.map(w=>Object.assign(w,{{html:WSBOX}}));
const ALIAS={{}};
const GL={js([dict(u=a, t=b, d=c) for a, b, c in GL])};
const MCQ={js([dict(u=a, q=b, o=c, ok=d, e=e) for a, b, c, d, e in MCQ])};
const ABIERTAS={js([dict(u=a, q=b, a=c) for a, b, c in ABIERTAS])};
const TL={js([dict(u=a, a=b, t=c, d=e) for a, b, c, e in TL])};
"""
    open(os.path.join(d, "content.js"), "w", encoding="utf-8").write(out)
    mp = os.path.join(HERE, "meta.json")
    M = [m for m in json.load(open(mp, encoding="utf-8")) if m["slug"] != meta["slug"]]
    M.append(meta)
    json.dump(M, open(mp, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

def p(*xs):
    return "".join(f"<p>{x}</p>" for x in xs)

def ul(*xs):
    return "<ul>" + "".join(f"<li>{x}</li>" for x in xs) + "</ul>"

def ol(*xs):
    return "<ol>" + "".join(f"<li>{x}</li>" for x in xs) + "</ol>"
