// Economiapp · service worker: permite instalar la app y usarla sin internet.
// La versión y la lista de archivos las escribe build.py; no edites docs/sw.js a mano.
const VERSION = "__VERSION__";
const CACHE = "economiapp-" + VERSION;
const RUNTIME = "economiapp-externos";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./comun/ruta.css", "./comun/ruta.js", "./iconos/icon-192.png"];
const TODO = __ARCHIVOS__;   // todo el sitio, para «Descargar para usar sin internet»

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
