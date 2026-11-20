/* Plantilla: pantalla de inicio de sesión. */
import { formularioLogin } from '../organisms/formularioLogin.js';

export const plantillaLogin = (mensaje = '') => `
    <section class="login">
      <h1>Veterinaria</h1>
      <p class="vacio">Inicia sesión para ver a los pacientes.</p>
      ${formularioLogin(mensaje)}
    </section>`;
