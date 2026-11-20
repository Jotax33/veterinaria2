/* Átomo: un cuadro de texto largo con su título (se puede ocultar a la vista pero se mantiene para lectores de pantalla). */
import { esc } from '../service/formato.js';

export const campoArea = (attr, k, titulo, valor, filas = 3, ocultarTitulo = false) =>
  `<label class="campo"><span ${ocultarTitulo ? 'class="sr-only"' : ''}>${titulo}</span><textarea ${attr}="${k}" rows="${filas}">${esc(valor)}</textarea></label>`;
