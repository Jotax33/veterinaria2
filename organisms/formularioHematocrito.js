/* Organismo: el formulario para agregar un hematocrito (campos, aviso de error y botón Guardar). */
import { borradorHtValido, hayErrorHt } from '../service/hematocrito.js';
import { camposHematocrito } from '../molecules/camposHematocrito.js';
import { boton } from '../atoms/boton.js';

export const formularioHematocrito = (b) => `
      <fieldset class="caja form-ht"><legend>Nuevo hematocrito</legend>
        ${camposHematocrito(b)}
        <p class="err" id="err-ht" ${hayErrorHt(b) ? '' : 'hidden'}>El % y la proteína deben ser números.</p>
        <footer class="acciones">${boton({ id: 'btn-guardar-ht', texto: 'Guardar', desactivado: !borradorHtValido(b) })}</footer>
      </fieldset>`;
