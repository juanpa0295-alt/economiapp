# Fuente del sitio de Economiapp

Esta carpeta tiene todo lo necesario para **reconstruir el sitio publicado en `docs/`**. No edites `docs/` a mano: los cambios se hacen aquí y luego se vuelve a generar el sitio.

## Reconstruir el sitio

Desde la raíz del repositorio:

```bash
python3 fuente/sitio/build.py
```

Esto reescribe `docs/` completo (portada, páginas de cada materia, `comun/` y `materias/`). Solo usa la biblioteca estándar de Python 3. Después, revisa los cambios con `git status`, haz commit y push. GitHub Pages publica `docs/` desde la rama `main`.

Para generar en otra carpeta (por ejemplo, para probar sin tocar `docs/`):

```bash
ECONOMIAPP_OUT=/tmp/prueba python3 fuente/sitio/build.py
```

## Qué hay en cada carpeta

| Carpeta | Contenido |
|---|---|
| `sitio/` | `build.py` (el generador: lista de materias, plan de estudios por semestre, plantillas), `portada.html` y `LEEME.md` del sitio publicado |
| `gu/` | Motor de las «guías de estudio» (tarjetas, simulacro, preguntas abiertas, línea de tiempo) |
| `gx/` | Generadores de las 21 guías: `gen.py` y los lotes `b1.py` a `b4.py`. Al ejecutar un lote se reescriben `gx/<materia>/content.js` y `gx/meta.json` |
| `tj/` | Teoría de Juegos y estilos compartidos (`base.css`) |
| `pmic/` | Principios de Micro, Micro I y II, y las ayudas comunes de los laboratorios (`helpers.js`) |
| `est1/`, `est2/` | Estadística I y II |
| `eco/` | Econometría I (`original.html` es la página base de la que se extraen contenido y laboratorios) |
| `e2/` | Econometría II (y la librería `ts.js` de series y panel) |
| `macro1/`, `m2/`, `m3/`, `pmac/` | Macroeconomía I, II, III y Principios de Macro |
| `mat/`, `me/`, `ml/` | Matemáticas I a III, Matemáticas para el análisis económico y Métodos Lineales |
| `gf/`, `fc/`, `cy/`, `ep/` | Gerencia Financiera, Finanzas Corporativas, Contabilidad y Evaluación de Proyectos |
| `lab/` | Derecho Laboral y Comercial. **`lab/laboral.js` tiene la tabla `LEY` (salario mínimo, auxilio, jornada, recargos) que hay que actualizar cada enero** |
| `he/`, `hpe/`, `de/`, `ea/`, `ei/`, `mi/` | Historia Económica, Historia del Pensamiento, Desarrollo, Ambiental, Internacional y Microeconometría |
| `vis/` | Motor de los «visuales de cambios» |
| `programas/` | Microcurrículos del plan 2015-I (referencia) y `rd.py` para leerlos |
| `pruebas/` | Pruebas automáticas (ver abajo) |

En cada materia, `content.js` tiene las estaciones (tronco, ramas, talleres) y `labs.js` los laboratorios. Los archivos `extra.js` y `labs_extra.js` agregan las estaciones que alinean un módulo con su programa.

## App instalable y uso sin internet

`build.py` genera `manifest.webmanifest`, copia los íconos de `sitio/iconos/` y escribe `docs/sw.js` a partir de `sitio/sw.js`, con la lista de todos los archivos y una versión calculada del contenido. Cada vez que el contenido cambia, la versión cambia y la app instalada se actualiza sola; si la persona había descargado todo, la nueva versión se vuelve a descargar en segundo plano. La portada tiene los botones «Instalar», «Descargar para usar sin internet» y «Exportar/Importar progreso» (respalda las claves `ruta-`, `eco-`, `guia-` y `hpe-` del almacenamiento del navegador).

## Estadísticas de visitas

El sitio puede enviar visitas a Google Analytics 4. Para activarlas, pega el ID de medición (empieza por `G-`) en `ANALYTICS_ID` dentro de `sitio/build.py`, o pásalo al generar:

```bash
ECONOMIAPP_GA=G-XXXXXXXXXX python3 fuente/sitio/build.py
```

Se registra una vista por página y otra por cada estación que se abre (por ejemplo `/materias/estadistica-2.html#tlc`), así que en Analytics se ve qué temas se estudian más. Con el ID vacío no se carga nada.

## Pruebas

Requieren Node.js y Playwright (`npm install playwright` dentro de `fuente/pruebas/`).

```bash
python3 fuente/pruebas/srv.py docs          # servidor local en el puerto 8767
node fuente/pruebas/mt_g.js                 # recorre todas las estaciones de una materia y busca errores
node fuente/pruebas/mt_me2.js               # mueve cada control a su mínimo y su máximo
node fuente/pruebas/site3.js                # todas las páginas y enlaces rotos (usa jsdom)
```

Para probar otra materia, cambia en el script el nombre de la página (por ejemplo `economia-politica.html` → `estadistica-2.html`). Algunas pruebas cargan `mathjs` desde `mat/node_modules`: instálalo con `npm install mathjs@12.4.3` en `fuente/mat/` si lo necesitas.

## Mantenimiento anual

- `lab/laboral.js`: salario mínimo y auxilio de transporte del año, jornada máxima y recargo dominical según la Ley 2466 de 2025.
- Cifras de Economía Colombiana y Finanzas Públicas Territoriales (en `gx/b4.py`): revisar con el DANE, el Banco de la República y la norma vigente, y volver a ejecutar `python3 b4.py` dentro de `gx/`.
