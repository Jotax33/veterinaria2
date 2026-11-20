/* Molécula: la caja de la radiografía en la lista de exámenes. */
import { cajaExamenImagen } from './cajaExamenImagen.js';

export const cajaRadiografia = (m) => cajaExamenImagen({
  nombre: 'Radiografía', clase: 'caja-radio', valor: m.radiografia, fecha: m.fechaRadiografia ?? m.fechaIngreso, attrBoton: 'data-tomar-radio="1"'
});
