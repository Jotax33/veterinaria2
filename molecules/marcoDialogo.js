/* Molécula: el marco de una ventana (título, contenido y botones Guardar / Cancelar). */
import { boton } from '../atoms/boton.js';

export const marcoDialogo = ({ titulo, cuerpo, valido }) => `
    <dialog class="dlg" id="dlg" aria-labelledby="dlg-t">
      <h2 class="caja-t" id="dlg-t">${titulo}</h2>
      ${cuerpo}
      <footer class="acciones">${boton({ id: 'dlg-guardar', texto: 'Guardar', desactivado: !valido })}${boton({ id: 'dlg-cancelar', texto: 'Cancelar', clase: 'sec' })}</footer>
    </dialog>`;
