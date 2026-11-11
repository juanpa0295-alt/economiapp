// Economiapp · service worker: permite instalar la app y usarla sin internet.
// La versión y la lista de archivos las escribe build.py; no edites docs/sw.js a mano.
const VERSION = "21ee5d267952";
const CACHE = "economiapp-" + VERSION;
const RUNTIME = "economiapp-externos";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./comun/ruta.css", "./comun/ruta.js", "./iconos/icon-192.png"];
const TODO = ["./.nojekyll", "./", "./manifest.webmanifest", "./comun/app.js", "./comun/est1.js", "./comun/estadistica.js", "./comun/extensiva.js", "./comun/finanzas.js", "./comun/historia.js", "./comun/juegos.js", "./comun/la.js", "./comun/laboral.js", "./comun/macro.js", "./comun/macro2.js", "./comun/mateco.js", "./comun/micro.js", "./comun/micro1.js", "./comun/micro2.js", "./comun/principios.js", "./comun/ruta.css", "./comun/ruta.js", "./comun/simbolico.js", "./comun/ts.js", "./comun/visual.js", "./iconos/apple-touch-icon.png", "./iconos/favicon-48.png", "./iconos/icon-192.png", "./iconos/icon-512.png", "./iconos/maskable-192.png", "./iconos/maskable-512.png", "./materias/contabilidad.html", "./materias/derecho-laboral.html", "./materias/desarrollo-economico.html", "./materias/desarrollo-humano.html", "./materias/econometria-2.html", "./materias/econometria.html", "./materias/economia-ambiental.html", "./materias/economia-clasica.html", "./materias/economia-colombiana.html", "./materias/economia-institucional.html", "./materias/economia-internacional.html", "./materias/economia-politica.html", "./materias/epistemologia.html", "./materias/estadistica-1.html", "./materias/estadistica-2.html", "./materias/etica-profesional.html", "./materias/evaluacion-proyectos.html", "./materias/finanzas-corporativas.html", "./materias/finanzas-territoriales.html", "./materias/formacion-ciudadana.html", "./materias/fuentes-investigacion.html", "./materias/fundamentos-administracion.html", "./materias/gerencia-financiera.html", "./materias/historia-economica-colombia.html", "./materias/historia-economica.html", "./materias/historia-pensamiento.html", "./materias/ingles-1.html", "./materias/ingles-2.html", "./materias/ingles-3.html", "./materias/ingles-4.html", "./materias/introduccion-economia.html", "./materias/lectoescritura.html", "./materias/macroeconomia-1.html", "./materias/macroeconomia-2.html", "./materias/macroeconomia-3.html", "./materias/matematicas-1.html", "./materias/matematicas-2.html", "./materias/matematicas-3.html", "./materias/matematicas-economicas.html", "./materias/matematicas.html", "./materias/metodos-lineales.html", "./materias/microeconometria.html", "./materias/microeconomia-1.html", "./materias/microeconomia-2.html", "./materias/monografia.html", "./materias/negocios-emprendimiento.html", "./materias/politicas-publicas-salud.html", "./materias/principios-macro.html", "./materias/principios-micro.html", "./materias/teoria-juegos.html", "./materias/contabilidad/contenido.js", "./materias/contabilidad/laboratorios.js", "./materias/derecho-laboral/contenido.js", "./materias/derecho-laboral/laboratorios.js", "./materias/desarrollo-economico/contenido.js", "./materias/desarrollo-economico/laboratorios.js", "./materias/desarrollo-humano/contenido.js", "./materias/desarrollo-humano/laboratorios.js", "./materias/econometria/contenido.js", "./materias/econometria/laboratorios.js", "./materias/econometria-2/contenido.js", "./materias/econometria-2/laboratorios.js", "./materias/economia-ambiental/contenido.js", "./materias/economia-ambiental/laboratorios.js", "./materias/economia-clasica/contenido.js", "./materias/economia-clasica/laboratorios.js", "./materias/economia-colombiana/contenido.js", "./materias/economia-colombiana/laboratorios.js", "./materias/economia-institucional/contenido.js", "./materias/economia-institucional/laboratorios.js", "./materias/economia-internacional/contenido.js", "./materias/economia-internacional/laboratorios.js", "./materias/economia-politica/contenido.js", "./materias/economia-politica/laboratorios.js", "./materias/epistemologia/contenido.js", "./materias/epistemologia/laboratorios.js", "./materias/estadistica-1/contenido.js", "./materias/estadistica-1/laboratorios.js", "./materias/estadistica-2/contenido.js", "./materias/estadistica-2/laboratorios.js", "./materias/etica-profesional/contenido.js", "./materias/etica-profesional/laboratorios.js", "./materias/evaluacion-proyectos/contenido.js", "./materias/evaluacion-proyectos/laboratorios.js", "./materias/finanzas-corporativas/contenido.js", "./materias/finanzas-corporativas/laboratorios.js", "./materias/finanzas-territoriales/contenido.js", "./materias/finanzas-territoriales/laboratorios.js", "./materias/formacion-ciudadana/contenido.js", "./materias/formacion-ciudadana/laboratorios.js", "./materias/fuentes-investigacion/contenido.js", "./materias/fuentes-investigacion/laboratorios.js", "./materias/fundamentos-administracion/contenido.js", "./materias/fundamentos-administracion/laboratorios.js", "./materias/gerencia-financiera/contenido.js", "./materias/gerencia-financiera/laboratorios.js", "./materias/historia-economica/contenido.js", "./materias/historia-economica/laboratorios.js", "./materias/historia-economica-colombia/contenido.js", "./materias/historia-economica-colombia/laboratorios.js", "./materias/historia-pensamiento/contenido.js", "./materias/historia-pensamiento/laboratorios.js", "./materias/ingles-1/contenido.js", "./materias/ingles-1/laboratorios.js", "./materias/ingles-2/contenido.js", "./materias/ingles-2/laboratorios.js", "./materias/ingles-3/contenido.js", "./materias/ingles-3/laboratorios.js", "./materias/ingles-4/contenido.js", "./materias/ingles-4/laboratorios.js", "./materias/introduccion-economia/contenido.js", "./materias/introduccion-economia/laboratorios.js", "./materias/lectoescritura/contenido.js", "./materias/lectoescritura/laboratorios.js", "./materias/macroeconomia-1/contenido.js", "./materias/macroeconomia-1/laboratorios.js", "./materias/macroeconomia-2/contenido.js", "./materias/macroeconomia-2/laboratorios.js", "./materias/macroeconomia-3/contenido.js", "./materias/macroeconomia-3/laboratorios.js", "./materias/matematicas/contenido.js", "./materias/matematicas/laboratorios.js", "./materias/matematicas-1/contenido.js", "./materias/matematicas-1/laboratorios.js", "./materias/matematicas-2/contenido.js", "./materias/matematicas-2/laboratorios.js", "./materias/matematicas-3/contenido.js", "./materias/matematicas-3/laboratorios.js", "./materias/matematicas-economicas/contenido.js", "./materias/matematicas-economicas/laboratorios.js", "./materias/metodos-lineales/contenido.js", "./materias/metodos-lineales/laboratorios.js", "./materias/microeconometria/contenido.js", "./materias/microeconometria/laboratorios.js", "./materias/microeconomia-1/contenido.js", "./materias/microeconomia-1/laboratorios.js", "./materias/microeconomia-2/contenido.js", "./materias/microeconomia-2/laboratorios.js", "./materias/monografia/contenido.js", "./materias/monografia/laboratorios.js", "./materias/negocios-emprendimiento/contenido.js", "./materias/negocios-emprendimiento/laboratorios.js", "./materias/politicas-publicas-salud/contenido.js", "./materias/politicas-publicas-salud/laboratorios.js", "./materias/principios-macro/contenido.js", "./materias/principios-macro/laboratorios.js", "./materias/principios-micro/contenido.js", "./materias/principios-micro/laboratorios.js", "./materias/teoria-juegos/contenido.js", "./materias/teoria-juegos/laboratorios.js", "https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js", "https://cdn.jsdelivr.net/npm/mathjs@12.4.3/lib/browser/math.js"];   // todo el sitio, para «Descargar para usar sin internet»

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

async function descargarTodo(avisar) {
  const c = await caches.open(CACHE);
  let hechos = 0, fallos = 0;
  for (const u of TODO) {
    try { if (!(await c.match(u))) { const r = await fetch(u, { cache: "no-cache" }); if (r.ok) await c.put(u, r); else fallos++; } }
    catch (err) { fallos++; }
    hechos++;
    if (avisar && (hechos % 10 === 0 || hechos === TODO.length)) avisar({ hechos, total: TODO.length, fallos });
  }
}

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const viejas = (await caches.keys()).filter(k => k.startsWith("economiapp-") && k !== CACHE && k !== RUNTIME);
    // Si la persona ya había descargado todo, la nueva versión también queda disponible sin internet.
    let teniaTodo = false;
    for (const k of viejas) { if ((await (await caches.open(k)).keys()).length > 50) teniaTodo = true; await caches.delete(k); }
    await self.clients.claim();
    if (teniaTodo) descargarTodo();
  })());
});

// Descarga completa a pedido de la portada; responde con el avance.
self.addEventListener("message", e => {
  if (!e.data || e.data.tipo !== "descargar-todo") return;
  const port = e.ports && e.ports[0];
  e.waitUntil(descargarTodo(port ? m => port.postMessage(m) : null));
});

const NO_CACHE = /google-analytics|googletagmanager|pyodide/;

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || NO_CACHE.test(req.url)) return;
  const url = new URL(req.url);
  const propio = url.origin === location.origin && url.pathname.startsWith(new URL(self.registration.scope).pathname);
  if (propio && (req.mode === "navigate" || req.destination === "document")) {
    // Páginas: primero la red (para ver siempre lo último); si no hay internet, la copia guardada.
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match("./index.html"))));
    return;
  }
  if (propio || /cdn\.jsdelivr\.net|fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(url.host)) {
    // Archivos: la copia guardada al instante y, por detrás, se actualiza.
    const cacheName = propio ? CACHE : RUNTIME;
    e.respondWith(caches.match(req, { ignoreSearch: propio }).then(hit => {
      const red = fetch(req).then(r => { if (r.ok || r.type === "opaque") { const cp = r.clone(); caches.open(cacheName).then(c => c.put(req, cp)); } return r; }).catch(() => hit);
      return hit || red;
    }));
  }
});
