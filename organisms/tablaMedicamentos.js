/* Organismo: el tratamiento actual. Se elige fecha y turno (Día o Noche, obligatorios) y se ven SOLO los medicamentos de ese turno.
   Los medicamentos se agregan de a uno con el botón (ventana) y quedan en la lista. */
import { esc, formatearFecha, deISO, iconoTurno } from '../service/formato.js';
import { filtroListo, medicamentosDe } from '../service/tratamiento.js';
import { controlesFechaTurno } from '../molecules/controlesFechaTurno.js';
import { boton } from '../atoms/boton.js';

const fila = (x) => `
          <tr><th scope="row">${esc(x.nombre)}</th><td>${esc(x.dosis)}</td><td>${esc(x.velocidad)}</td><td>${esc(x.via)}</td>
            <td>${boton({ clase: 'x', texto: '🗑', attrs: `data-quitar-med="${x.creado}" aria-label="Quitar ${esc(x.nombre)}"` })}</td></tr>`;

export function tablaMedicamentos(m, vista) {
  const listo = filtroListo(vista.mf, vista.mt);
  const filtro = `
    <search class="filtro-cl">
      ${controlesFechaTurno({ fecha: vista.mf, turno: vista.mt, attrFecha: 'data-f="mf"', attrTurno: 'data-f="mt"', turnos: ['Día', 'Noche'] })}
    </search>`;
  if (!listo) return `<div class="caja panel-tr">${filtro}<p class="ayuda">Elige la fecha y el turno (Día o Noche) para ver y agregar medicamentos.</p></div>`;
  const lista = medicamentosDe(m, vista.mf, vista.mt);
  const cuerpo = lista.length === 0
    ? '<p class="vacio">No hay medicamentos para esa fecha y turno.</p>'
    : `<section class="tabla-scroll"><table class="tabla-ht">
        <caption class="sr-only">Medicamentos del ${formatearFecha(deISO(vista.mf))}, turno ${vista.mt}</caption>
        <thead><tr><th scope="col">Medicamento</th><th scope="col">Dosis</th><th scope="col">Velocidad</th><th scope="col">Vía de administración</th><th scope="col"><span class="sr-only">Quitar</span></th></tr></thead>
        <tbody>${lista.map(fila).join('')}</tbody>
      </table></section>`;
  return `<div class="caja panel-tr">${filtro}
    <p class="ayuda">Mostrando solo ${iconoTurno(vista.mt)} ${vista.mt} del ${formatearFecha(deISO(vista.mf))}.</p>
    ${cuerpo}
    <footer class="acciones">${boton({ id: 'btn-agregar-med', texto: 'Agregar medicamento' })}</footer>
  </div>`;
}
