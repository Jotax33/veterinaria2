/* Navegación entre pantallas (con #, así el botón "atrás" del teléfono funciona) y redibujado cuando llegan cambios de otra persona. */
import { app } from './service/dom.js';
import { estado } from './service/estado.js';
import { paginaLogin } from './pages/paginaLogin.js';
import { paginaIngreso } from './pages/paginaIngreso.js';
import { paginaLista } from './pages/paginaLista.js';
import { paginaArchivo } from './pages/paginaArchivo.js';
import { paginaDetalle } from './pages/paginaDetalle.js';
import { paginaEditar } from './pages/paginaEditar.js';

export function render() {
  const ruta = location.hash || '#/ingreso';
  const partes = ruta.split('/'); // ["#", "detalle", "3"]
  const seccion = partes[1];
  app.onclick = null; app.oninput = null; app.onchange = null;

  document.getElementById('nav-ingreso').classList.toggle('activa', seccion === 'ingreso');
  document.getElementById('nav-archivo').classList.toggle('activa', seccion === 'archivo');
  document.getElementById('nav-mascotas').classList.toggle('activa', seccion !== 'ingreso' && seccion !== 'archivo');

  if (!estado.usuario) { paginaLogin(); return; }
  if (!estado.listo) { app.innerHTML = '<p class="vacio">Cargando pacientes…</p>'; return; }
  if (seccion === 'mascotas') paginaLista();
  else if (seccion === 'archivo') paginaArchivo();
  else if (seccion === 'detalle') paginaDetalle(partes[2]);
  else if (seccion === 'editar') paginaEditar(partes[2]);
  else paginaIngreso();
}

/** Vuelve a dibujar la pantalla cuando llegan cambios de otra persona, salvo que estés escribiendo. */
export function refrescar(forzar = false) {
  if (!estado.usuario || !estado.listo) return;
  if (forzar) { render(); return; }
  const seccion = (location.hash || '#/ingreso').split('/')[1];
  if (seccion === 'ingreso' || seccion === 'editar') return;
  const a = document.activeElement;
  if (a && app.contains(a) && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)) return;
  const imp = document.getElementById('panel-imp');
  if (imp && imp.innerHTML.trim()) return;
  render();
}

export function iniciarNavegacion() {
  window.addEventListener('hashchange', () => { window.scrollTo(0, 0); render(); });
}

/** Pantalla de login (se usa cuando nadie ha iniciado sesión). */
export const mostrarLogin = () => paginaLogin();
