/* Organismo: el formulario de inicio de sesión (correo y contraseña). */
import { esc } from '../service/formato.js';

export const formularioLogin = (mensaje) => `
      <form id="f-login" novalidate>
        <label class="campo"><span>Correo</span><input type="email" id="lg-mail" autocomplete="username" autocapitalize="none" inputmode="email"></label>
        <label class="campo"><span>Contraseña</span><input type="password" id="lg-pass" autocomplete="current-password"></label>
        <p class="err" id="lg-err" ${mensaje ? '' : 'hidden'}>${esc(mensaje)}</p>
        <div class="acciones"><button type="submit" id="lg-ok">Entrar</button></div>
      </form>`;
