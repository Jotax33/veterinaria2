/* Molécula: una fila de la tabla de hematocritos (fecha, valores y botón de borrar). */
import { esc, formatearFecha, formatearHora } from '../service/formato.js';
import { boton } from '../atoms/boton.js';

const celda = (v) => (v ? esc(v) : '—');

export const filaHematocrito = (h) => `
          <tr><th scope="row">${formatearFecha(h.fecha)}<span class="hora">${formatearHora(h.fecha)}</span></th>
            <td>${celda(h.hct)}</td><td>${celda(h.prot)}</td><td>${celda(h.plasma)}</td>
            <td>${boton({ clase: 'x', texto: '🗑', attrs: `data-quitar-ht="${h.fecha}" aria-label="Borrar este hematocrito"` })}</td></tr>`;
