/* Organismo: la tabla de hematocritos guardados de una mascota (el más nuevo arriba). */
import { filaHematocrito } from '../molecules/filaHematocrito.js';

export function tablaHematocrito(m) {
  const lista = [...(m.hematocritos || [])].sort((a, b) => b.fecha - a.fecha);
  if (lista.length === 0) return '<p class="vacio">Todavía no hay hematocritos guardados.</p>';
  return `<section class="tabla-scroll"><table class="tabla-ht">
        <caption class="sr-only">Hematocritos guardados</caption>
        <thead><tr><th scope="col">Fecha</th><th scope="col">%</th><th scope="col">Proteína</th><th scope="col">Plasma</th><th scope="col"><span class="sr-only">Borrar</span></th></tr></thead>
        <tbody>${lista.map(filaHematocrito).join('')}</tbody>
      </table></section>`;
}
