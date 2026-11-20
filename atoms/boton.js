/* Átomo: un botón. clase: 'sec', 'txt', 'peligro', 'ok', 'x'...; attrs: atributos extra ya escritos (data-..., aria-label). */
export const boton = ({ id = '', texto, clase = '', attrs = '', desactivado = false }) =>
  `<button ${id ? `id="${id}"` : ''} ${clase ? `class="${clase}"` : ''} ${attrs} ${desactivado ? 'disabled' : ''}>${texto}</button>`;
