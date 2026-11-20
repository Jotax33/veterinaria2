/* Molécula: aviso para subir a la nube las mascotas que quedaron guardadas solo en este teléfono. */
export function bannerLocal(n) {
  if (!n) return '';
  return `<section class="panel banner-local"><h2>Datos de este teléfono</h2>
    <p class="vacio">Hay ${n} mascota${n === 1 ? '' : 's'} guardada${n === 1 ? '' : 's'} solo en este teléfono (de la versión anterior). ¿Subirlas a la nube para que las vea todo el equipo?</p>
    <div class="acciones"><button id="btn-subir-local">Subir a la nube</button><button class="txt" id="btn-local-no">Ahora no</button></div></section>`;
}
