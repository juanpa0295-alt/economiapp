# Economiapp · sitio web

Rutas de estudio interactivas para las materias de Economía. Es un sitio estático: solo usa HTML, CSS y JavaScript, sin servidor, así que se puede publicar gratis con GitHub Pages.

> **Esta carpeta se genera sola.** No edites `docs/` a mano: los cambios se hacen en `fuente/` y el sitio se vuelve a armar con `python3 fuente/sitio/build.py` (ver `fuente/LEEME.md`). Cualquier cambio hecho aquí se pierde en la siguiente generación.

## Estructura

```
docs/
├── index.html                    Portada: plan de estudios por semestre, progreso y buscador de temas
├── sw.js, manifest.webmanifest   App instalable y uso sin internet
├── comun/
│   ├── ruta.css                  Diseño compartido por todas las rutas
│   ├── ruta.js                   Motor: mapa de metro, lecciones, progreso, gráficos
│   ├── app.js                    Botones «Compartir» y «Opinar»
│   └── *.js                      Librerías de cálculo de cada área (estadística, juegos, laboral, macro, micro, finanzas…)
├── materias/
│   ├── <materia>.html            Cada materia: una página corta…
│   └── <materia>/
│       ├── contenido.js          …su contenido (estaciones, ramas, talleres)…
│       └── laboratorios.js       …y sus laboratorios
├── og/                           Imágenes de vista previa al compartir
└── iconos/
```

El sitio cubre las 49 materias del plan 2015-I; la lista completa está en `MATERIAS` y `PLAN` dentro de `fuente/sitio/build.py`.

## Publicar con GitHub Pages

1. Genera el sitio: `python3 fuente/sitio/build.py`.
2. Revisa los cambios con `git status`, haz commit y push a la rama `main`.
3. GitHub Pages publica la carpeta `/docs` de `main` (Settings → Pages → Deploy from a branch). En uno o dos minutos queda en `https://economiapp.app/`.

Los archivos de Streamlit (`Inicio.py`, `pages/`, `datos/`) son la versión anterior de la app y no se publican aquí.

## Agregar una materia

1. Crea su carpeta en `fuente/` con `content.js` (las listas `TRUNK`, `BRANCHES` y `WORKSHOPS`) y `labs.js` (el objeto `SIMS`).
2. En `fuente/sitio/build.py`, agrega las líneas que escriben su `contenido.js` y `laboratorios.js`, su entrada en `MATERIAS` (título, textos, colores y una clave de progreso única, por ejemplo `ruta-micro1-done`; el generador se detiene si la clave se repite) y su fila en `PLAN`.
3. Ejecuta `build.py`, luego `og.py` para su imagen de vista previa, y otra vez `build.py`.

Cada lección del contenido acepta estos campos: `id`, `t` (título), `html`, `qs` (preguntas con respuesta), `deep` (apartados para profundizar), `py` (código Python), `sim` (nombre del laboratorio) y `nuevo`.

En las fórmulas puedes escribir `<` con normalidad (por ejemplo `\(r<g\)`): el generador lo convierte para que el navegador no lo confunda con una etiqueta.

## Calculadoras de Matemáticas

Las calculadoras de límites, derivadas e integrales usan SymPy, igual que la app de Streamlit, corriendo en el navegador con Pyodide. La primera vez que un estudiante abre una calculadora se descargan unos 15 MB y tarda unos segundos; después queda en la caché del navegador. Mientras carga, se muestran resultados numéricos aproximados.

## Derecho Laboral: actualización anual

En `fuente/lab/laboral.js` (publicado como `comun/laboral.js`), la tabla `LEY` guarda el salario mínimo, el auxilio de transporte, la jornada máxima, el recargo dominical y la hora de inicio de la jornada nocturna, cada uno con la fecha desde la que rige. Cada enero hay que agregar la fila del nuevo salario mínimo y auxilio de transporte. El 1 de julio de 2027 el recargo dominical pasa al 100 % (ya está cargado).

## Progreso de los estudiantes

El botón «Ya lo domino» guarda el avance en el navegador de cada persona (`localStorage`). No requiere cuenta, pero no se sincroniza entre dispositivos y se pierde si se borran los datos del navegador.

## Para cobrar el acceso más adelante

GitHub Pages publica todo de forma abierta, así que no sirve para restringir el acceso. Cuando llegue el momento, el mismo sitio se puede mover a un servicio con inicio de sesión y pagos. Como el contenido ya está separado del motor, se puede dejar una parte gratis (por ejemplo, las primeras estaciones de cada materia) y proteger el resto.
