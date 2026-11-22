/* Organismo: la ventana para agregar un medicamento (qué medicamento, dosis, velocidad y vía de administración). */
import { esc, formatearFecha, deISO, iconoTurno } from '../service/formato.js';
import { medicamentoValido, SUGERENCIAS_VELOCIDAD, SUGERENCIAS_VIA } from '../service/tratamiento.js';
import { marcoDialogo } from '../molecules/marcoDialogo.js';
import { campoLibre } from '../atoms/campoLibre.js';

// Campo libre con sugerencias (se puede escribir otra cosa)
const campoConSugerencias = (k, titulo, valor, sugerencias) =>
  `<label class="campo"><span>${titulo}</span><input type="text" data-m="${k}" value="${esc(valor)}" list="sug-${k}" autocomplete="off"></label>
   <datalist id="sug-${k}">${sugerencias.map((o) => `<option value="${esc(o)}"></option>`).join('')}</datalist>`;

export const dialogoMedicamento = (d, vista) => marcoDialogo({
  titulo: 'Agregar medicamento',
  cuerpo: `<p class="ayuda">Para ${iconoTurno(vista.mt)} ${vista.mt} del ${formatearFecha(deISO(vista.mf))}.</p>
    ${campoLibre('data-m', 'nombre', '¿Qué medicamento se agregará?', d.nombre)}
    ${campoLibre('data-m', 'dosis', '¿Qué dosis?', d.dosis)}
    ${campoConSugerencias('velocidad', '¿Qué velocidad? (ej. cada 8 hr, cada 12 hr, DU)', d.velocidad, SUGERENCIAS_VELOCIDAD)}
    ${campoConSugerencias('via', 'Vía de administración', d.via, SUGERENCIAS_VIA)}`,
  valido: medicamentoValido(d)
});
