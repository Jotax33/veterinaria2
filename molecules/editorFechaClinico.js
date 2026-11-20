/* Molécula: el cuadro para cambiar la fecha, la hora o el turno de un clínico ya guardado. */
import { esc, formatearFecha, formatearHora } from '../service/formato.js';
import { opcionesTurno } from '../atoms/opcionesTurno.js';

export const editorFechaClinico = (c, datos) => `
    <section class="caja editor-fecha"><h2 class="caja-t">Cambiar fecha, hora o turno del clínico</h2>
      <p class="ayuda">Ahora: ${formatearFecha(c.fecha)} ${formatearHora(c.fecha)} · ${c.turno}</p>
      <div class="fila3">
        <label class="campo"><span>Fecha</span><input type="date" data-efc="f" value="${esc(datos.f)}"></label>
        <label class="campo"><span>Hora</span><input type="time" data-efc="h" value="${esc(datos.h)}"></label>
        <label class="campo"><span>Turno</span><select data-efc="t">
          ${opcionesTurno(datos.t, ['Día', 'Noche'])}
        </select></label>
      </div>
      <div class="acciones"><button id="guardar-fecha">Guardar cambios</button><button class="sec" id="cancelar-fecha">Cancelar</button></div>
    </section>`;
