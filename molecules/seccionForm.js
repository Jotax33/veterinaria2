/* Molécula: una sección del formulario, con su título y su contenido. */
export const seccionForm = (titulo, contenido) => `
    <section class="seccion-form">
      <h2 class="sec-t">${titulo}</h2>
      ${contenido}
    </section>`;
