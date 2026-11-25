# Árboles de fórmulas

Laboratorios de pantalla completa para estudiar una hoja de fórmulas: árbol del algoritmo (carpetas que se abren y cierran), hoja seleccionable con glosario, panel de detalle con micropasos y una escena 3D que cambia con cada micropaso.

| Archivo | Qué es |
|---|---|
| `motor.js` | El motor común (árbol, hoja, selección de texto, detalle, motor 3D en canvas y distribuciones F y χ²). Se publica en `docs/comun/arbol.js`. |
| `plantilla.html` | La página (estilos y estructura). `build.py` rellena título, enlaces y analítica. |
| `econometria-parcial2.js` | Econometría I, fórmulas del parcial 2. |

## Agregar un árbol a otra materia

1. Copia `econometria-parcial2.js` como `<materia>-<tema>.js` y cambia su contenido:
   - `NODES`: cada fórmula `{t, f, que, uso, ctx, st}`; `st` son los micropasos `S(texto, fórmula, escena, paso, explicación 3D)`.
   - `TREE`: carpetas `{id, t, c:[ids o subcarpetas]}` en el orden del algoritmo.
   - `GL`: glosario `[clave, nombre, alias, definición, ids donde aparece]`; `CS`: símbolos de una letra.
   - `DOC`: la hoja (`h` título, `s` subtítulo, `p` párrafo con el id al que pertenece, `n` bloque de fórmula).
   - `SC`: escenas 3D, funciones `(paso, avance 0–1, parámetro)` que dibujan con `L, PL, Q, Pt, T, Ar, box` y devuelven `{chips, bars}` para la lectura. La escena `fd` (distribución F o χ²) ya viene en el motor.
   - `inicio` (nodo inicial) y `clave` (prefijo del progreso en el navegador: `ruta-af-<clave>-`).
2. Agrega la entrada en `ARBOLES` dentro de `fuente/sitio/build.py` y, si quieres, una estación que la enlace (como `formulas-p2` en `eco/extra.js`).
3. `python3 fuente/sitio/build.py`.
