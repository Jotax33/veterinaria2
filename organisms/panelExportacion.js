/* Organismo: el panel de la lista para exportar un turno. Explica cómo hacerlo y pide fecha + turno (Día o Noche, obligatorio). */
import { TEXTO_FIN_NOCHE } from '../service/clinicos.js';
import { controlesFechaTurno } from '../molecules/controlesFechaTurno.js';
import { notaAviso } from '../atoms/notaAviso.js';

export const panelExportacion = (filtro) => `
    ${notaAviso('Para exportar el turno:', `elige la fecha en que empezó y si fue Día o Noche, y luego pulsa «Copiar texto». No se pueden exportar todos los clínicos a la vez. La noche incluye la madrugada del día siguiente (hasta las ${TEXTO_FIN_NOCHE}).`)}
    <search class="filtro-cl opcion-export">
      ${controlesFechaTurno({ etiqueta: 'Fecha de los clínicos', fecha: filtro.fc, turno: filtro.tt, attrFecha: 'id="exp-fc"', attrTurno: 'id="exp-tt"', turnos: ['Día', 'Noche'], turnoVacio: 'Elige el turno' })}
    </search>`;
