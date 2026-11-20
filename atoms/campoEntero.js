/* Átomo: un campo que solo acepta números enteros (el teclado numérico se abre solo en el teléfono). */
import { esc } from '../service/formato.js';

export const campoEntero = (attr, k, titulo, valor, ocultarTitulo = false) =>
  `<label class="campo"><span ${ocultarTitulo ? 'class="sr-only"' : ''}>${titulo}</span><input type="text" inputmode="numeric" pattern="[0-9]*" ${attr}="${k}" value="${esc(valor)}" autocomplete="off"></label>`;
