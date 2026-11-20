/* Plantilla: pantalla de mascotas hospitalizadas. Recibe todo ya calculado (no consulta nada por su cuenta). */
import { esc } from '../service/formato.js';
import { listaMascotas } from '../organisms/listaMascotas.js';
import { panelExportacion } from '../organisms/panelExportacion.js';
import { boton } from '../atoms/boton.js';
import { bannerLocal } from '../molecules/bannerLocal.js';
import { panelRespaldo } from '../molecules/panelRespaldo.js';

export const plantillaLista = ({ activas, email, localPendientes, filtro, filtroListo, infoExport, hayMascotas }) => `
    <h1>Mascotas hospitalizadas (${activas.length})</h1>
    <p class="ayuda sesion">Sesión: ${esc(email)} · <button class="txt" id="btn-salir">Salir</button></p>
    ${bannerLocal(localPendientes)}
    ${panelExportacion(filtro)}
    <p class="vacio" id="info-export">${esc(infoExport)}</p>
    <section class="barra">${boton({ id: 'btn-copiar', texto: 'Copiar texto', desactivado: !(activas.length && filtroListo) })}</section>
    ${activas.length ? listaMascotas(activas) : '<p class="vacio">No hay mascotas hospitalizadas. Agrega una en la pestaña Ingreso.</p>'}
    ${panelRespaldo(hayMascotas)}`;
