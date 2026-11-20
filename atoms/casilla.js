/* Átomo: una casilla suelta con su texto (por ejemplo "Come"). */
export const casilla = (attr, valor, texto, marcada) =>
  `<label class="opt"><input type="checkbox" ${attr}="${valor}" ${marcada ? 'checked' : ''}><span>${texto}</span></label>`;
