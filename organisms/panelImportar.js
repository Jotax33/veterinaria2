/* Organismo: el panel para importar un mensaje de WhatsApp (pegar el texto, revisar y elegir qué importar). */
import { esc } from '../service/formato.js';
import { claveMascota } from '../service/mascota.js';

export const panelImportar = () => `
    <section class="panel">
      <h2>Importar mensaje de WhatsApp</h2>
      <p class="vacio">Copia el mensaje exportado desde WhatsApp (mantén presionado el mensaje → Copiar) y pégalo aquí.</p>
      <textarea id="txt-imp" rows="6" placeholder="Pega aquí el mensaje"></textarea>
      <div class="acciones">
        <button id="btn-rev" disabled>Revisar</button>
        <button id="btn-imp-cerrar" class="txt">Cancelar</button>
      </div>
      <div id="res-imp"></div>
    </section>`;

export const resultadoImportacion = (halladas, ignoradas, claves) => `
    <p class="resumen-imp"><strong>Encontré ${halladas.length} mascota${halladas.length === 1 ? '' : 's'}.</strong> Marca las que quieres importar:</p>
    <fieldset>${halladas.map((m, i) => `
      <label class="opt"><input type="checkbox" data-imp="${i}" checked>
        <span>${esc(m.nombre)} · ${esc(m.especie)}<br>
        <small>${claves.has(claveMascota(m)) ? 'Ya existe: se agrega lo que te falta y se conservan tus datos más recientes' : '<span class="nueva">Nueva</span>'}
        · ${m.clinicos.length} clínico${m.clinicos.length === 1 ? '' : 's'} en el mensaje</small></span></label>`).join('')}
    </fieldset>
    ${ignoradas ? `<p class="alerta">${ignoradas} entrada${ignoradas === 1 ? '' : 's'} no se pudo leer.</p>` : ''}
    <div class="acciones"><button id="btn-imp-ok">Importar seleccionadas</button></div>`;
