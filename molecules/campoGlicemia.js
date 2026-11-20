/* Molécula: la glicemia del clínico. Un número entero y/o la casilla "Come" (si hay número, el número manda en la tabla). */
import { campoEntero } from '../atoms/campoEntero.js';
import { casilla } from '../atoms/casilla.js';

export const campoGlicemia = (b) => `
        <fieldset class="glicemia"><legend>Glicemia</legend>
          ${campoEntero('data-c', 'glicemia', 'Glicemia (número entero)', b.glicemia, true)}
          ${casilla('data-cb', 'come', 'Come', b.come)}
        </fieldset>`;
