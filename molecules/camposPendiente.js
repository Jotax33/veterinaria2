/* Molécula: lo que queda pendiente de los exámenes y para qué día (aparece al responder "No"). */
import { campoArea } from '../atoms/campoArea.js';
import { campoFecha } from '../atoms/campoFecha.js';

export const camposPendiente = (d) => `
      ${campoArea('data-m', 'pendiente', 'Quedó pendiente', d.pendiente)}
      ${campoFecha('data-m', 'fecha', 'Para el día', d.fecha)}`;
