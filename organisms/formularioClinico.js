/* Organismo: el formulario para ingresar un clínico nuevo (con el fondo claro de día o de noche). */
import { esc } from '../service/formato.js';
import { borradorValido } from '../service/clinicos.js';
import { campoSigno } from '../atoms/campoSigno.js';
import { grupoSiNo } from '../atoms/grupoSiNo.js';
import { grupoAlimentacion } from '../molecules/grupoAlimentacion.js';
import { campoGlicemia } from '../molecules/campoGlicemia.js';
import { campoLibre } from '../atoms/campoLibre.js';
import { boton } from '../atoms/boton.js';

export function formularioClinico(b) {
  const noche = b.turno === 'Noche';
  return `
    <section class="form-cl ${noche ? 'noche' : 'dia'}" id="form-cl" aria-label="Nuevo clínico">
      <section class="fila2 fila-turno">
        <select class="pildora" id="sel-turno" aria-label="Turno: día o noche">
          <option value="Día" ${noche ? '' : 'selected'}>☀ Día</option>
          <option value="Noche" ${noche ? 'selected' : ''}>🌙 Noche</option>
        </select>
        ${campoLibre('data-c', 'enfermero', 'Enfermero/a', b.enfermero)}
      </section>
      <section class="fila2">${campoSigno('temp', 'Temp °C', b.temp)}${campoGlicemia(b)}</section>
      <fieldset><legend>Presiones</legend>
        <section class="fila3">${campoSigno('pas', 'PAS', b.pas)}${campoSigno('pad', 'PAD', b.pad)}${campoSigno('pam', 'PAM', b.pam)}</section>
      </fieldset>
      ${grupoAlimentacion(b)}
      ${grupoSiNo('agua', 'Bebe agua', b.agua)}
      ${grupoSiNo('orina', 'Orina', b.orina, ['Sí', 'Sonda', 'No'])}
      ${grupoSiNo('vomito', 'Vómito', b.vomito)}
      <label class="campo"><span>Feca</span><input type="text" data-c="feca" value="${esc(b.feca)}" autocomplete="off"></label>
      <label class="campo"><span>Comentarios del turno</span><textarea data-c="comentarios" rows="3">${esc(b.comentarios)}</textarea></label>
      <footer class="acciones">${boton({ id: 'btn-guardar-cl', texto: 'Guardar clínico', desactivado: !borradorValido(b) })}</footer>
    </section>`;
}
