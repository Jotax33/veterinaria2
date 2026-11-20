/* Molécula: la caja de la ecografía en la lista de exámenes. */
import { cajaExamenImagen } from './cajaExamenImagen.js';

export const cajaEcografia = (m) => cajaExamenImagen({
  nombre: 'Ecografía', clase: 'caja-eco', valor: m.ecografia, fecha: m.fechaEcografia ?? m.fechaIngreso, attrBoton: 'data-tomar-eco="1"'
});
