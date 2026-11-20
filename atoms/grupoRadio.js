/* Átomo: un grupo de opciones donde se elige una (botones de radio). */
import { esc } from '../service/formato.js';

export function grupoRadio(k, titulo, opciones, valor) {
  return `<fieldset><legend>${titulo}</legend>${opciones.map((o) =>
    `<label class="opt"><input type="radio" name="${k}" data-radio="${k}" value="${esc(o)}" ${valor === o ? 'checked' : ''}><span>${esc(o)}</span></label>`
  ).join('')}</fieldset>`;
}
