/* Página: Archivo de altas, con buscador por nombre. */
import { app } from '../service/dom.js';
import { estado } from '../service/estado.js';
import { aviso } from '../service/avisos.js';
import { sinAcentos } from '../service/formato.js';
import { nubeReingresar, nubeBorrar } from '../service/firebase.js';
import { plantillaArchivo } from '../templates/plantillaArchivo.js';
import { listaArchivo } from '../organisms/listaArchivo.js';

export function paginaArchivo() {
  app.innerHTML = plantillaArchivo(estado.busquedaArchivo);
  const pintar = () => {
    const q = sinAcentos(estado.busquedaArchivo);
    const altas = estado.mascotas.filter((m) => m.estado === 'alta' && sinAcentos(m.nombre).includes(q))
      .sort((a, b) => (b.fechaAlta || 0) - (a.fechaAlta || 0));
    document.getElementById('lista-arch').innerHTML = listaArchivo(altas, estado.mascotas.some((m) => m.estado === 'alta'));
  };
  pintar();
  document.getElementById('busq').oninput = (e) => { estado.busquedaArchivo = e.target.value; pintar(); };
  app.onclick = (e) => {
    const re = e.target.closest('[data-reingresar]');
    if (re) {
      e.stopPropagation();
      const mr = estado.mascotas.find((x) => x.id === re.dataset.reingresar);
      if (mr && mr.estado === 'alta') nubeReingresar(mr);
      aviso('Paciente reingresado');
      return;
    }
    const borrar = e.target.closest('[data-borrar]');
    if (borrar) {
      e.stopPropagation();
      const m = estado.mascotas.find((x) => x.id === borrar.dataset.borrar);
      if (m && confirm(`¿Borrar a ${m.nombre} del archivo? Se borra para todo el equipo y no se puede deshacer.`)) nubeBorrar(m.id);
      return;
    }
    const t = e.target.closest('.tarjeta');
    if (t) location.hash = '#/detalle/' + t.dataset.id;
  };
}
