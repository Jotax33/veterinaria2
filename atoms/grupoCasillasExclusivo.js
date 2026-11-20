/* Átomo: casillas de verificación donde solo se puede marcar una (y se puede desmarcar). */
import { esc } from '../service/formato.js';

export function grupoCasillasExclusivo(k, titulo, opciones, valor) {
  return `<fieldset><legend>${titulo}</legend>${opciones.map((o) =>
    `<label class="opt"><input type="checkbox" data-excl="${k}" value="${esc(o)}" ${valor === o ? 'checked' : ''}><span>${esc(o)}</span></label>`
  ).join('')}</fieldset>`;
}
