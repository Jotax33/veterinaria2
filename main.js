/* Arranque de la app: registra el service worker, conecta con Firebase y espera a que alguien inicie sesión. */
import { app } from './service/dom.js';
import { estado } from './service/estado.js';
import { esc } from './service/formato.js';
import { cargarFirebase, iniciarFirebase, suscribir } from './service/firebase.js';
import { vigilarSesion } from './service/sesion.js';
import { leerLocalAntiguo } from './service/localAntiguo.js';
import { iniciarNavegacion, mostrarLogin, refrescar } from './router.js';

const aviso_red = document.getElementById('red');
window.addEventListener('online', () => (aviso_red.hidden = true));
window.addEventListener('offline', () => (aviso_red.hidden = false));
if (!navigator.onLine) aviso_red.hidden = false;

iniciarNavegacion();

(async function iniciar() {
  app.innerHTML = '<p class="vacio">Cargando…</p>';
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  let FB;
  try {
    FB = await cargarFirebase();
  } catch (e) {
    app.innerHTML = '<h1>No se pudo conectar</h1><p>La primera vez la app necesita internet para cargar. Revisa tu conexión e inténtalo de nuevo.</p><p><button id="reint">Reintentar</button></p>';
    document.getElementById('reint').onclick = () => location.reload();
    return;
  }
  iniciarFirebase(FB);
  // Datos que se hayan guardado en este teléfono con la versión anterior (solo se leen para ofrecer subirlos)
  estado.localAntiguo = await leerLocalAntiguo();

  vigilarSesion((user) => {
    if (!user) { mostrarLogin(); return; }
    document.body.classList.remove('sin-sesion');
    app.innerHTML = '<p class="vacio">Cargando pacientes…</p>';
    suscribir(refrescar, (e) => {
      console.error(e);
      app.innerHTML = '<h1>No se pudieron leer los datos</h1><p>' + esc((e && e.code) || 'error') + '. Si dice "permission-denied", revisa las reglas de Firestore.</p>';
    });
  });
})();
