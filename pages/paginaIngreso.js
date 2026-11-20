/* Página: "Nueva mascota". */
import { app } from '../service/dom.js';
import { estado } from '../service/estado.js';
import { aviso } from '../service/avisos.js';
import { aMascota, estadoVacio } from '../service/formulario.js';
import { idPara, nubeCrear } from '../service/firebase.js';
import { plantillaIngreso } from '../templates/plantillaIngreso.js';
import { montarFormulario } from '../organisms/formularioMascota.js';

export function paginaIngreso() {
  app.innerHTML = plantillaIngreso();
  montarFormulario(document.getElementById('form'), estado.formIngreso, 'nuevo', async (s) => {
    const nueva = { ...aMascota(s, {}), fichaModificada: Date.now(), estado: 'hospitalizado' };
    if (estado.mascotas.some((x) => x.id === idPara(nueva))) {
      alert('Ya existe una mascota con ese nombre, especie y fecha de ingreso (puede estar en el Archivo). Revisa el nombre o la fecha.');
      return;
    }
    nubeCrear(nueva);
    aviso('Mascota guardada');
    Object.assign(estado.formIngreso, estadoVacio()); // se conserva el mismo objeto, solo se vacía
    window.scrollTo(0, 0);
    paginaIngreso();
  });
}
