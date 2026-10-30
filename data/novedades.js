/* Novedades (vlog semanal).
   Para publicar algo nuevo: copiá un bloque { ... }, pegalo ARRIBA de la lista y cambiá los datos.
   El orden en el archivo no importa: el sitio las ordena por fecha, de la más nueva a la más vieja.

   Campos:
     fecha     -> "AAAA-MM-DD" (obligatorio)
     titulo    -> obligatorio
     texto     -> un párrafo entre comillas, o varios dentro de [ ] separados por coma (obligatorio)
     etiqueta  -> opcional. Ej: "Cursos", "Talleres", "Avisos", "Reflexiones". Se generan los filtros solos.
     imagen    -> opcional. Ruta dentro de img/novedades/ (recomendado: horizontal, 1600 x 700 px)
     imagenAlt -> opcional. Descripción breve de la imagen
     enlace    -> opcional. { texto: "Inscribirme", url: "https://..." }

   Los textos de abajo son de EJEMPLO: borralos o reemplazalos. */
window.NOVEDADES = [
  {
    fecha: "2026-10-30",
    titulo: "Nuevo ciclo de talleres para el cierre del año",
    etiqueta: "Talleres",
    texto: [
      "Estamos preparando un ciclo de encuentros breves para frenar, ordenar ideas y cerrar el año con más calma.",
      "En los próximos días vamos a compartir fechas, modalidad y cupos."
    ],
    enlace: { texto: "Quiero que me avisen", url: "https://www.instagram.com/cuidar.consciente/" }
  },
  {
    fecha: "2026-10-23",
    titulo: "Una pausa de tres minutos",
    etiqueta: "Reflexiones",
    texto: "Una práctica simple para cuando el día se acelera: apoyá los pies en el piso, inhalá contando hasta cuatro y exhalá contando hasta cuatro. Repetí cinco veces."
  },
  {
    fecha: "2026-10-16",
    titulo: "Abrimos la lista de espera de cursos",
    etiqueta: "Cursos",
    texto: "Si querés enterarte primero de los próximos cursos, escribinos y te sumamos a la lista de espera."
  }
];
