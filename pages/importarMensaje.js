/* Página (panel): importar un mensaje de WhatsApp pegado a mano.
   Hoy la lista no tiene el botón "Importar mensaje"; este panel queda listo por si se vuelve a poner
   (abrirPanelImportar necesita un <div id="panel-imp"> en la pantalla). */
import { estado } from '../service/estado.js';
import { aviso } from '../service/avisos.js';
import { claveMascota } from '../service/mascota.js';
import { importarMascotas, parsearMensaje } from '../service/importacion.js';
import { panelImportar, resultadoImportacion } from '../organisms/panelImportar.js';

export function abrirPanelImportar(alTerminar) {
  const panel = document.getElementById('panel-imp');
  panel.innerHTML = panelImportar();
  const txt = document.getElementById('txt-imp');
  txt.focus();
  txt.oninput = () => (document.getElementById('btn-rev').disabled = txt.value.trim() === '');
  document.getElementById('btn-imp-cerrar').onclick = () => (panel.innerHTML = '');
  document.getElementById('btn-rev').onclick = () => revisarImportacion(txt.value, alTerminar);
}

function revisarImportacion(texto, alTerminar) {
  const res = document.getElementById('res-imp');
  const { mascotas: halladas, ignoradas } = parsearMensaje(texto);
  if (halladas.length === 0) {
    res.innerHTML = '<p class="alerta">No encontré mascotas en ese texto. Revisa que sea el mensaje completo exportado por la app.</p>';
    return;
  }
  res.innerHTML = resultadoImportacion(halladas, ignoradas, new Set(estado.mascotas.map(claveMascota)));
  const ok = document.getElementById('btn-imp-ok');
  res.onchange = () => (ok.disabled = !res.querySelector('[data-imp]:checked'));
  ok.onclick = async () => {
    const elegidas = [...res.querySelectorAll('[data-imp]:checked')].map((c) => halladas[+c.dataset.imp]);
    const r = await importarMascotas(elegidas);
    aviso(`Importadas: ${r.nuevas} nueva${r.nuevas === 1 ? '' : 's'}, ${r.actualizadas} actualizada${r.actualizadas === 1 ? '' : 's'}, ${r.clinicosNuevos} clínico${r.clinicosNuevos === 1 ? '' : 's'} agregado${r.clinicosNuevos === 1 ? '' : 's'}`);
    alTerminar();
  };
}
