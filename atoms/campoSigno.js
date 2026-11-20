/* Átomo: un campo corto para un número del clínico (temperatura, presiones) o del hematocrito. `attr` dice a qué grupo pertenece (data-c, data-ht). */
import { esc } from '../service/formato.js';

export const campoSigno = (k, titulo, valor, attr = 'data-c') =>
  `<label class="campo"><span>${titulo}</span><input type="text" inputmode="decimal" ${attr}="${k}" value="${esc(valor)}" autocomplete="off"></label>`;
