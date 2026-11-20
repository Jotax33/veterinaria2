/* Página: mascotas hospitalizadas (lista, exportación y copia de seguridad). */
import { app } from '../service/dom.js';
import { estado } from '../service/estado.js';
import { aviso } from '../service/avisos.js';
import { mascotasActivas } from '../service/mascota.js';
import { copiarExportacion, filtroExpListo, textoInfoExport } from '../service/exportacion.js';
import { descargarRespaldo, restaurarRespaldo } from '../service/respaldo.js';
import { importarMascotas } from '../service/importacion.js';
import { marcarLocalSubido } from '../service/localAntiguo.js';
import { nubeBorrar } from '../service/firebase.js';
import { cerrarSesion } from '../service/sesion.js';
import { plantillaLista } from '../templates/plantillaLista.js';

export function paginaLista() {
  const activas = mascotasActivas();
  app.innerHTML = plantillaLista({
    activas,
    email: estado.usuario ? estado.usuario.email : '',
    localPendientes: estado.ocultarLocal ? 0 : estado.localAntiguo.length,
    filtro: estado.filtroExp,
    filtroListo: filtroExpListo(),
    infoExport: textoInfoExport(),
    hayMascotas: estado.mascotas.length > 0
  });

  document.getElementById('btn-copiar').onclick = async () => {
    const ok = await copiarExportacion();
    if (!ok) { aviso('No se pudo copiar'); return; }
    aviso('Texto copiado');
    paginaLista();
  };
  document.getElementById('btn-salir').onclick = () => { if (confirm('¿Cerrar sesión?')) cerrarSesion(); };

  const alCambiarFiltro = () => {
    estado.filtroExp = { fc: document.getElementById('exp-fc').value, tt: document.getElementById('exp-tt').value };
    paginaLista();
  };
  document.getElementById('exp-fc').onchange = alCambiarFiltro;
  document.getElementById('exp-tt').onchange = alCambiarFiltro;

  document.getElementById('btn-resp-bajar').onclick = descargarRespaldo;
  const inp = document.getElementById('archivo-resp');
  document.getElementById('btn-resp-subir').onclick = () => inp.click();
  inp.onchange = () => { if (inp.files[0]) restaurarRespaldo(inp.files[0]); inp.value = ''; };

  // Mascotas que quedaron guardadas solo en este teléfono (versión anterior)
  const bs = document.getElementById('btn-subir-local');
  if (bs) {
    bs.onclick = async () => {
      bs.disabled = true;
      const r = await importarMascotas(estado.localAntiguo);
      marcarLocalSubido();
      estado.localAntiguo = [];
      aviso(`Subidas: ${r.nuevas} nueva${r.nuevas === 1 ? '' : 's'}, ${r.actualizadas} ya existía${r.actualizadas === 1 ? '' : 'n'}`);
      paginaLista();
    };
    document.getElementById('btn-local-no').onclick = () => { estado.ocultarLocal = true; paginaLista(); };
  }

  app.onclick = (e) => {
    const borrar = e.target.closest('[data-borrar]');
    if (borrar) {
      e.stopPropagation();
      const m = estado.mascotas.find((x) => x.id === borrar.dataset.borrar);
      if (m && confirm(`¿Borrar a ${m.nombre}? Se borra para todo el equipo y no se puede deshacer. (Si solo se fue de alta, usa "Dar de alta" en su ficha.)`)) nubeBorrar(m.id);
      return;
    }
    const t = e.target.closest('.tarjeta');
    if (t) location.hash = '#/detalle/' + t.dataset.id;
  };
}
