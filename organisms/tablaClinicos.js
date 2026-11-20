/* Organismo: los clínicos guardados de una mascota. Filtro de fecha + turno, tabla con un clínico por columna
   y comentarios del turno. `p` trae: m (la mascota), vista (el filtro), editFecha / datosFecha (editor de fecha),
   editCom / textoCom (comentario que se está editando). */
import { esc, formatearFecha, deISO } from '../service/formato.js';
import { clinicosOrdenados } from '../service/mascota.js';
import { coincideFechaTurno, glicemiaTexto, TEXTO_FIN_NOCHE } from '../service/clinicos.js';
import { controlesFechaTurno } from '../molecules/controlesFechaTurno.js';
import { editorFechaClinico } from '../molecules/editorFechaClinico.js';
import { comentarioTurno } from '../molecules/comentarioTurno.js';
import { encabezadoClinico } from '../molecules/encabezadoClinico.js';

export function tablaClinicos({ m, vista, editFecha, datosFecha, editCom, textoCom }) {
  const todos = clinicosOrdenados(m);
  if (todos.length === 0) return '<div class="caja"><p class="vacio">Todavía no hay clínicos registrados.</p></div>';
  const editando = editFecha != null ? todos.find((c) => c.fecha === editFecha) : null;
  const filtro = `
    <search class="filtro-cl">
      ${controlesFechaTurno({ fecha: vista.fc, turno: vista.tt, attrFecha: 'data-f="fc"', attrTurno: 'data-f="tt"' })}
      ${vista.fc && vista.tt === 'Noche' ? `<p class="ayuda">Noche que empieza el ${formatearFecha(deISO(vista.fc))}: incluye la madrugada del día siguiente (hasta las ${TEXTO_FIN_NOCHE}).</p>` : ''}
      ${vista.fc ? '<button class="txt" id="f-todas">Ver todas las fechas</button>' : '<p class="ayuda">Mostrando todas las fechas.</p>'}
    </search>`;
  const lista = todos.filter((c) => coincideFechaTurno(c, vista.fc, vista.tt));
  if (lista.length === 0 && !editando) return filtro + '<div class="caja"><p class="vacio">No hay clínicos guardados para esa fecha y turno.</p></div>';
  const celda = (v) => (v ? esc(v) : '—');
  const filas = [
    ['Temp °C', (c) => c.temp], ['Glicemia', glicemiaTexto],
    ['PAS', (c) => c.pas], ['PAM', (c) => c.pam], ['PAD', (c) => c.pad],
    ['Alimentación', (c) => c.alimentacion.map((a) => (a === 'No' ? 'No' : 'Por ' + a.toLowerCase())).join(', ')],
    ['Bebe agua', (c) => c.bebeAgua], ['Orina', (c) => c.orina], ['Vómito', (c) => c.vomito], ['Feca', (c) => c.feca]
  ];
  // Clínicos guardados antes, cuando orina y deposiciones eran un solo texto
  if (lista.some((c) => c.orinaDeposiciones)) filas.push(['Orina / deposiciones', (c) => c.orinaDeposiciones]);
  return `${filtro}${editando ? editorFechaClinico(editando, datosFecha) : ''}
    <div class="tabla-scroll"><table class="tabla-cl">
      <thead><tr><th></th>${lista.map(encabezadoClinico).join('')}</tr></thead>
      <tbody>${filas.map(([t, f]) => `<tr><th scope="row">${t}</th>${lista.map((c) => `<td>${celda(f(c))}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <section class="coment-turno"><h2>Comentarios del turno</h2>${lista.map((c) => comentarioTurno(c, editCom, textoCom)).join('')}</section>`;
}
