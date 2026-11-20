/* Átomo: un campo de texto corto y libre con su título (nombre del enfermero, plasma...). `attr` dice a qué grupo pertenece. */
import { esc } from '../service/formato.js';

export const campoLibre = (attr, k, titulo, valor) =>
  `<label class="campo"><span>${titulo}</span><input type="text" ${attr}="${k}" value="${esc(valor)}" autocomplete="off"></label>`;
