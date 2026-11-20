/* Molécula: el comentario de un turno, con sus botones para editarlo (o el cuadro de edición abierto). */
import { esc, formatearFecha, formatearHora, iconoTurno } from '../service/formato.js';

export function comentarioTurno(c, editCom, textoCom) {
  const cab = `<b>${formatearFecha(c.fecha)} ${formatearHora(c.fecha)} ${iconoTurno(c.turno)}:</b>`;
  if (editCom === c.fecha) {
    return `<p>${cab}</p><textarea data-ecom rows="3">${esc(textoCom)}</textarea>
        <div class="acc"><button id="guardar-com">Guardar</button><button class="sec" id="cancelar-com">Cancelar</button></div>`;
  }
  return c.comentarios
    ? `<p>${cab} ${esc(c.comentarios)} <button class="txt" data-edit-com="${c.fecha}">Editar</button></p>`
    : `<p>${cab} <span class="vacio">Sin comentario</span> <button class="txt" data-edit-com="${c.fecha}">Agregar</button></p>`;
}
