# Cuidar Consciente — sitio web

Sitio estático en HTML5, CSS3 y JavaScript. No necesita servidor ni instalación:
funciona abriendo `index.html` con doble clic y se puede publicar en GitHub Pages, Netlify,
Cloudflare Pages o cualquier hosting común.

## Estructura

```
index.html
css/styles.css          ← colores y tipografías (variables al inicio)
js/main.js              ← lógica (no hace falta tocarlo)
data/config.js          ← redes sociales, botón de contacto, texto del pie
data/profesionales.js   ← equipo
data/novedades.js       ← novedades / vlog semanal
img/equipo/             ← fotos del equipo
img/novedades/          ← imágenes de las novedades
```

## Actualización semanal (novedades)

1. Abrí `data/novedades.js`.
2. Copiá un bloque `{ ... }`, pegalo arriba de la lista y cambiá fecha, título y texto.
3. Si hay imagen, guardala en `img/novedades/` y poné la ruta en `imagen`.
4. Guardá y subí el cambio (`git add . && git commit -m "Novedades" && git push`).

El sitio ordena por fecha, muestra las 4 más recientes y agrega el botón "Ver novedades anteriores".
Los filtros por etiqueta aparecen solos cuando hay 2 o más etiquetas distintas.

## Agregar o cambiar profesionales

Editá `data/profesionales.js` y poné las fotos en `img/equipo/`
(vertical 4:5, unos 800 × 1000 px, menos de 200 KB). Sin foto, se muestran las iniciales.

## Cambiar colores

En `css/styles.css`, bloque `:root` (primeras líneas). Todo el sitio usa esas variables.
La paleta actual es una propuesta neutra (salvia, bruma y lila suave); se ajusta a la de la marca cambiando 4 o 5 valores.

## Antes de publicar

- Reemplazar los datos de ejemplo (equipo y novedades).
- Completar el enlace de contacto (WhatsApp o mail) en `data/config.js`.
- Agregar las redes que se usen.
