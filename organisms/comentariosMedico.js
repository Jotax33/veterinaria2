/* Organismo: comentarios del médico sobre el turno. Se elige fecha y turno (Día o Noche, obligatorios); hay UN comentario por turno:
   si ya existe se puede editar, si no se agrega. `b` es lo que se está escribiendo. */
import { formatearFecha, deISO, iconoTurno } from '../service/formato.js';
import { comentarioMedicoDe, comentarioMedicoValido, filtroListo } from '../service/tratamiento.js';
import { controlesFechaTurno } from '../molecules/controlesFechaTurno.js';
import { campoLibre } from '../atoms/campoLibre.js';
import { campoArea } from '../atoms/campoArea.js';
import { boton } from '../atoms/boton.js';

export function comentariosMedico(m, vista, b) {
  const listo = filtroListo(vista.cf, vista.ct);
  const filtro = `
    <search class="filtro-cl">
      ${controlesFechaTurno({ fecha: vista.cf, turno: vista.ct, attrFecha: 'data-f="cf"', attrTurno: 'data-f="ct"', turnos: ['Día', 'Noche'] })}
    </search>`;
  if (!listo) return `<div class="caja panel-tr">${filtro}<p class="ayuda">Elige la fecha y el turno (Día o Noche) para ver y escribir el comentario del médico.</p></div>`;
  const existe = !!comentarioMedicoDe(m, vista.cf, vista.ct);
  return `<div class="caja panel-tr">${filtro}
    <p class="ayuda">${existe ? 'Comentario guardado de' : 'Todavía no hay comentario para'} ${iconoTurno(vista.ct)} ${vista.ct} del ${formatearFecha(deISO(vista.cf))}.</p>
    ${campoLibre('data-cm', 'medico', 'Médico a cargo', b.medico)}
    ${campoArea('data-cm', 'texto', 'Comentarios del médico sobre el turno', b.texto, 5)}
    <footer class="acciones">
      ${boton({ id: 'btn-guardar-cm', texto: existe ? 'Guardar cambios' : 'Agregar comentario', desactivado: !comentarioMedicoValido(b) })}
      ${existe ? boton({ id: 'btn-borrar-cm', clase: 'sec', texto: 'Borrar comentario' }) : ''}
    </footer>
  </div>`;
}
