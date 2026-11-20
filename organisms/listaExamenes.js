/* Organismo: la lista de exámenes de una mascota, más las cajas de la ecografía y la radiografía. */
import { examenesOrdenados } from '../service/mascota.js';
import { filaExamen } from '../molecules/filaExamen.js';
import { cajaEcografia } from '../molecules/cajaEcografia.js';
import { cajaRadiografia } from '../molecules/cajaRadiografia.js';

export function listaExamenes(m) {
  const lista = examenesOrdenados(m);
  const cajaEx = lista.length === 0
    ? '<section class="caja"><h2 class="caja-t">Exámenes</h2><p class="vacio">Sin exámenes registrados.</p></section>'
    : `<section class="caja"><h2 class="caja-t">Exámenes</h2><ul class="lista-ex">${lista.map((e, i) => filaExamen(e, i)).join('')}</ul></section>`;
  return cajaEx + cajaEcografia(m) + cajaRadiografia(m);
}
