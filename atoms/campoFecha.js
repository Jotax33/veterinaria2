/* Átomo: un campo de fecha con su título. */
import { esc } from '../service/formato.js';

export const campoFecha = (attr, k, titulo, valor) =>
  `<label class="campo"><span>${titulo}</span><input type="date" ${attr}="${k}" value="${esc(valor)}"></label>`;
