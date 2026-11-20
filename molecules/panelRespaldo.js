/* Molécula: el desplegable "Copia de seguridad" al final de la lista. */
export const panelRespaldo = (hayMascotas) => `
    <details class="respaldo">
      <summary>Copia de seguridad</summary>
      <p>Los datos están en la nube y todo el equipo los ve al instante. Puedes descargar una copia propia de vez en cuando (incluye también el Archivo).</p>
      <div class="acciones">
        <button class="sec" id="btn-resp-bajar" ${hayMascotas ? '' : 'disabled'}>Descargar respaldo</button>
        <button class="sec" id="btn-resp-subir">Restaurar respaldo</button>
        <input type="file" id="archivo-resp" accept="application/json,.json" hidden>
      </div>
    </details>`;
