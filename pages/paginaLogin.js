/* Página: inicio de sesión. */
import { app } from '../service/dom.js';
import { iniciarSesion } from '../service/sesion.js';
import { plantillaLogin } from '../templates/plantillaLogin.js';

export function paginaLogin(mensaje = '') {
  document.body.classList.add('sin-sesion');
  app.onclick = null; app.oninput = null; app.onchange = null;
  app.innerHTML = plantillaLogin(mensaje);
  document.getElementById('f-login').onsubmit = async (ev) => {
    ev.preventDefault();
    const mail = document.getElementById('lg-mail').value.trim();
    const pass = document.getElementById('lg-pass').value;
    const err = document.getElementById('lg-err');
    if (!mail || !pass) { err.textContent = 'Escribe tu correo y tu contraseña.'; err.hidden = false; return; }
    const ok = document.getElementById('lg-ok');
    ok.disabled = true;
    const error = await iniciarSesion(mail, pass);
    if (error) {
      err.textContent = error;
      err.hidden = false;
      ok.disabled = false;
    }
  };
}
