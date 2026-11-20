/* Molécula: la pregunta Sí / No "¿Se tomaron todos los exámenes?" de la ventana de exámenes. */
import { opcionRadio } from '../atoms/opcionRadio.js';

export const preguntaTodos = (valor) => `
      <fieldset class="fila-opciones"><legend class="sr-only">Respuesta</legend>
        ${['Sí', 'No'].map((o) => opcionRadio('todos', 'data-mtodos', o, o, valor === o)).join('')}
      </fieldset>`;
