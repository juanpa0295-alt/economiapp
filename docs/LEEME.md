# Economiapp · sitio web

Rutas de estudio interactivas para las materias de Economía. Es un sitio estático: solo usa HTML, CSS y JavaScript, sin servidor, así que se puede publicar gratis con GitHub Pages.

## Estructura

```
docs/
├── index.html                    Portada: materias, progreso y buscador de temas
├── comun/
│   ├── ruta.css                  Diseño compartido por todas las rutas
│   ├── ruta.js                   Motor: mapa de metro, lecciones, progreso, gráficos
│   ├── estadistica.js            Distribuciones (reemplazan a scipy.stats)
│   ├── juegos.js                 Teoría de juegos con fracciones exactas (incluye EN, EPS y EBP en árboles)
│   ├── extensiva.js              Árboles de juego: editor, subjuegos y EPS con azar
│   ├── laboral.js                Derecho Laboral: tabla LEY (actualizar cada año) y cálculos
│   ├── macro.js                  Cálculos de Macroeconomía 1
│   ├── principios.js             Cálculos de Principios de Macroeconomía
│   └── simbolico.js              SymPy en el navegador (Pyodide) y respaldo numérico
└── materias/
    ├── econometria.html          Cada materia: una página corta…
    ├── econometria/
    │   ├── contenido.js          …su contenido (estaciones, ramas, preguntas)…
    │   └── laboratorios.js       …y sus laboratorios
    ├── matematicas.html     + matematicas/
    ├── principios-macro.html + principios-macro/
    ├── estadistica-2.html  + estadistica-2/
    ├── macroeconomia-1.html + macroeconomia-1/
    ├── teoria-juegos.html  + teoria-juegos/
    └── derecho-laboral.html + derecho-laboral/
```

## Publicar con GitHub Pages

1. En el repositorio `economiapp`, entra a **Add file → Upload files** y arrastra la carpeta `docs` completa (con sus subcarpetas). Confirma con **Commit changes**.
2. Ve a **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**, la rama **main** y la carpeta **/docs**. Guarda.
4. Espera uno o dos minutos. El sitio queda en `https://juanpa0295-alt.github.io/economiapp/`.

Para actualizarlo después, sube de nuevo los archivos que cambiaron dentro de `docs`. Los archivos de Streamlit (`Inicio.py`, `pages/`, `datos/`) siguen funcionando igual; GitHub Pages solo publica lo que está en `docs`.

## Agregar una materia

1. Copia `materias/macroeconomia-1.html` con el nombre de la materia nueva y cambia el título, los textos del encabezado, los colores de `--line` y la clave `RUTA_KEY` (debe ser única, por ejemplo `ruta-micro1-done`).
2. Crea la carpeta de la materia con `contenido.js` (las listas `TRUNK`, `BRANCHES` y `WORKSHOPS`) y `laboratorios.js` (el objeto `SIMS`).
3. Agrega la materia a la constante `MATERIAS` al final de `index.html` (nombre, color, clave de progreso y lista de temas).

Cada lección del contenido acepta estos campos: `id`, `t` (título), `html`, `qs` (preguntas con respuesta), `deep` (apartados para profundizar), `py` (código Python), `sim` (nombre del laboratorio) y `nuevo`.

## Calculadoras de Matemáticas

Las calculadoras de límites, derivadas e integrales usan SymPy, igual que la app de Streamlit, corriendo en el navegador con Pyodide. La primera vez que un estudiante abre una calculadora se descargan unos 15 MB y tarda unos segundos; después queda en la caché del navegador. Mientras carga, se muestran resultados numéricos aproximados.

## Derecho Laboral: actualización anual

En `comun/laboral.js`, la tabla `LEY` guarda el salario mínimo, el auxilio de transporte, la jornada máxima, el recargo dominical y la hora de inicio de la jornada nocturna, cada uno con la fecha desde la que rige. Cada enero hay que agregar la fila del nuevo salario mínimo y auxilio de transporte. El 1 de julio de 2027 el recargo dominical pasa al 100 % (ya está cargado).

## Progreso de los estudiantes

El botón «Ya lo domino» guarda el avance en el navegador de cada persona (`localStorage`). No requiere cuenta, pero no se sincroniza entre dispositivos y se pierde si se borran los datos del navegador.

## Para cobrar el acceso más adelante

GitHub Pages publica todo de forma abierta, así que no sirve para restringir el acceso. Cuando llegue el momento, el mismo sitio se puede mover a un servicio con inicio de sesión y pagos. Como el contenido ya está separado del motor, se puede dejar una parte gratis (por ejemplo, las primeras estaciones de cada materia) y proteger el resto.
