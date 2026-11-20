/* Organismo: las mascotas dadas de alta que coinciden con la búsqueda (o un mensaje si no hay ninguna). */
import { tarjetaArchivo } from '../molecules/tarjetaArchivo.js';

export const listaArchivo = (altas, hayAltas) => altas.length
  ? altas.map(tarjetaArchivo).join('')
  : `<p class="vacio">${hayAltas ? 'Ninguna coincide con la búsqueda.' : 'Todavía no hay pacientes dados de alta.'}</p>`;
