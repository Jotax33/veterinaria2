/* Molécula: las tres opciones del estado del paciente (solo una a la vez). */
import { opcionRadio } from '../atoms/opcionRadio.js';

export const OPCIONES_SITUACION = ['Alta médica', 'Alta solicitada', 'Eutanasia'];

export const opcionesEstado = (elegido) => `
      <fieldset class="fila-opciones"><legend>Estado del paciente</legend>
        ${OPCIONES_SITUACION.map((o) => opcionRadio('situacion', 'data-sit', o, o, elegido === o)).join('')}
      </fieldset>`;
