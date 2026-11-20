/* Plantilla: pantalla del Archivo de altas (la lista se dibuja dentro de #lista-arch). */
import { esc } from '../service/formato.js';

export const plantillaArchivo = (busqueda) => `
    <h1>Archivo de altas</h1>
    <p class="ayuda">Pacientes dados de alta. No salen en la lista diaria ni en el mensaje de WhatsApp, pero se conservan para consultar.</p>
    <label class="campo"><span>Buscar por nombre</span><input type="text" id="busq" value="${esc(busqueda)}" placeholder="Nombre" autocomplete="off"></label>
    <section id="lista-arch" aria-label="Pacientes dados de alta"></section>`;
