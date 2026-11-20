/* Molécula: los dos controles de un filtro (fecha + turno). Se usa al exportar y en la ficha.
   attrFecha / attrTurno son los atributos que identifican cada control (por ejemplo 'id="exp-fc"'). */
import { esc } from '../service/formato.js';
import { opcionesTurno } from '../atoms/opcionesTurno.js';

export const controlesFechaTurno = ({ etiqueta = 'Fecha', fecha, turno, attrFecha, attrTurno, turnos, turnoVacio = '' }) => `
      <div class="fila2">
        <label class="campo"><span>${etiqueta}</span><input type="date" ${attrFecha} value="${esc(fecha)}"></label>
        <label class="campo"><span>Turno</span>
          <select ${attrTurno}>
            ${opcionesTurno(turno, turnos, turnoVacio)}
          </select></label>
      </div>`;
