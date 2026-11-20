/* Átomo: una opción de un grupo de botones redondos (solo se elige una por grupo `nombre`). */
export const opcionRadio = (nombre, attr, valor, texto, marcada) =>
  `<label class="opt"><input type="radio" name="${nombre}" ${attr}="${valor}" ${marcada ? 'checked' : ''}><span>${texto}</span></label>`;
