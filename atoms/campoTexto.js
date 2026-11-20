/* Átomo: un campo de texto (o número, o área de texto) con su título y su mensaje de error opcional. */
import { esc } from '../service/formato.js';

export function campoTexto(k, titulo, valor, extra = {}) {
  const { tipo = 'text', area = false, inputmode = '', errId = '', errTexto = '', error = false } = extra;
  const comun = `data-k="${k}" ${error ? 'aria-invalid="true"' : ''}`;
  const control = area
    ? `<textarea ${comun} rows="3">${esc(valor)}</textarea>`
    : `<input type="${tipo}" ${comun} value="${esc(valor)}" ${inputmode ? `inputmode="${inputmode}"` : ''} ${tipo === 'number' ? 'min="0"' : ''} autocomplete="off">`;
  return `<label class="campo"><span>${titulo}</span>${control}${errId ? `<small class="err" id="${errId}" ${error ? '' : 'hidden'}>${errTexto}</small>` : ''}</label>`;
}
