/* Molécula: una fila de la lista de exámenes (fecha, estado, detalle y botones). */
import { esc, formatearFecha } from '../service/formato.js';
import { etiqueta } from '../atoms/etiqueta.js';

export function filaExamen(e, i) {
  const tomado = e.estado === 'Tomados';
  return `
    <li class="fila-ex">
      <span>${tomado ? '' : 'Se tomará el '}${formatearFecha(e.fecha)}</span>
      <span class="det">${etiqueta(tomado ? 'tomado' : 'pendiente', tomado ? 'Tomado' : 'Pendiente')}${esc(e.detalle)}</span>
      <span class="acc-ex">
        ${tomado ? '' : `<button class="ok" data-tomar-ex="${i}" aria-label="Marcar examen como tomado">Marcar como tomado</button>`}
        <button class="peligro" data-quitar-ex="${i}" aria-label="Quitar examen">Quitar</button>
      </span>
    </li>`;
}
