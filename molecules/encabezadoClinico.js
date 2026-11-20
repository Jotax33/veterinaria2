/* Molécula: el encabezado de una columna de la tabla de clínicos (enfermero/a sobre la fecha, hora, turno y botones). */
import { esc, formatearFecha, formatearHora, iconoTurno } from '../service/formato.js';
import { boton } from '../atoms/boton.js';

export const encabezadoClinico = (c) => `
        <th class="${c.turno === 'Noche' ? 'noche' : 'dia'}">${c.enfermero ? `<span class="enf"><span class="sr-only">Enfermero/a: </span>${esc(c.enfermero)}</span>` : ''}${iconoTurno(c.turno)} ${formatearFecha(c.fecha)}<span class="hora">${formatearHora(c.fecha)} · ${c.turno}
          ${boton({ clase: 'x ed', texto: '✎', attrs: `data-edit-fecha="${c.fecha}" aria-label="Cambiar fecha y hora de este clínico"` })}${boton({ clase: 'x', texto: '✕', attrs: `data-quitar-cl="${c.fecha}" aria-label="Borrar este clínico"` })}</span></th>`;
