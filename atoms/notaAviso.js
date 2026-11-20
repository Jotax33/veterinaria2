/* Átomo: una nota que explica algo importante, con un tono rojizo suave para que se note sin gritar. */
export const notaAviso = (titulo, texto) =>
  `<aside class="nota-aviso" role="note"><p><strong>${titulo}</strong> ${texto}</p></aside>`;
