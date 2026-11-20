/* Página: "Editar mascota". */
import { app } from '../service/dom.js';
import { aviso } from '../service/avisos.js';
import { aMascota, estadoDesde } from '../service/formulario.js';
import { buscarMascota } from '../service/mascota.js';
import { nubeEditarFicha } from '../service/firebase.js';
import { plantillaEditar } from '../templates/plantillaEditar.js';
import { montarFormulario } from '../organisms/formularioMascota.js';

export function paginaEditar(id) {
  const m = buscarMascota(id);
  if (!m) { location.hash = '#/mascotas'; return; }
  app.innerHTML = plantillaEditar();
  const s = estadoDesde(m);
  montarFormulario(document.getElementById('form'), s, 'editar', async (est) => {
    const { id: _i, clinicos: _c, examenes, ...campos } = aMascota(est, m);
    campos.fechaModificacion = Date.now();
    campos.fichaModificada = Date.now();
    // Los exámenes y clínicos nunca se reescriben completos: solo se agrega lo nuevo (así no se pisan los cambios de otra persona)
    const examenNuevo = examenes.length > m.examenes.length ? examenes[examenes.length - 1] : null;
    nubeEditarFicha(m.id, campos, examenNuevo);
    aviso('Cambios guardados');
    location.replace('#/detalle/' + id);
  }, () => history.back());
}
