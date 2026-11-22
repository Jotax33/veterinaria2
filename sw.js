// Service worker: deja la app disponible sin internet.
// Si cambias index.html, sube el número de VERSION para que los teléfonos descarguen la versión nueva.
const VERSION = 'veterinaria-v28';
const ARCHIVOS = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './atoms/boton.js',
  './atoms/notaAviso.js',
  './atoms/campoArea.js',
  './atoms/campoEntero.js',
  './atoms/campoFecha.js',
  './atoms/campoLibre.js',
  './atoms/campoSigno.js',
  './atoms/casilla.js',
  './atoms/opcionRadio.js',
  './atoms/campoTexto.js',
  './atoms/dato.js',
  './atoms/etiqueta.js',
  './atoms/grupoCasillasExclusivo.js',
  './atoms/grupoRadio.js',
  './atoms/grupoSiNo.js',
  './atoms/opcionesTurno.js',
  './main.js',
  './molecules/bannerLocal.js',
  './molecules/cajaEcografia.js',
  './molecules/cajaRadiografia.js',
  './molecules/camposHematocrito.js',
  './molecules/camposPendiente.js',
  './molecules/campoGlicemia.js',
  './molecules/cajaExamenImagen.js',
  './molecules/encabezadoClinico.js',
  './molecules/filaHematocrito.js',
  './molecules/marcoDialogo.js',
  './molecules/opcionesEstado.js',
  './molecules/preguntaTodos.js',
  './molecules/comentarioTurno.js',
  './molecules/controlesFechaTurno.js',
  './molecules/editorFechaClinico.js',
  './molecules/filaExamen.js',
  './molecules/grupoAlimentacion.js',
  './molecules/panelRespaldo.js',
  './molecules/seccionForm.js',
  './molecules/tarjetaArchivo.js',
  './molecules/tarjetaMascota.js',
  './organisms/cuadroMascota.js',
  './organisms/formularioClinico.js',
  './organisms/formularioLogin.js',
  './organisms/formularioMascota.js',
  './organisms/listaArchivo.js',
  './organisms/listaExamenes.js',
  './organisms/listaMascotas.js',
  './organisms/panelExportacion.js',
  './organisms/panelImportar.js',
  './organisms/dialogoExamen.js',
  './organisms/dialogoHallazgos.js',
  './organisms/formularioHematocrito.js',
  './organisms/panelEstado.js',
  './organisms/comentariosMedico.js',
  './organisms/dialogoMedicamento.js',
  './organisms/tablaClinicos.js',
  './organisms/tablaMedicamentos.js',
  './organisms/tablaHematocrito.js',
  './pages/importarMensaje.js',
  './pages/paginaArchivo.js',
  './pages/paginaDetalle.js',
  './pages/paginaEditar.js',
  './pages/paginaIngreso.js',
  './pages/paginaLista.js',
  './pages/paginaLogin.js',
  './router.js',
  './service/avisos.js',
  './service/clinicos.js',
  './service/dialogos.js',
  './service/hematocrito.js',
  './service/situacion.js',
  './service/tratamiento.js',
  './service/dom.js',
  './service/estado.js',
  './service/exportacion.js',
  './service/firebase.js',
  './service/formato.js',
  './service/formulario.js',
  './service/importacion.js',
  './service/localAntiguo.js',
  './service/mascota.js',
  './service/respaldo.js',
  './service/sesion.js',
  './templates/plantillaArchivo.js',
  './templates/plantillaDetalle.js',
  './templates/plantillaEditar.js',
  './templates/plantillaIngreso.js',
  './templates/plantillaLista.js',
  './templates/plantillaLogin.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Solo se encarga de los archivos de la app y del código de Firebase (versionado). Lo demás (datos, inicio de sesión) pasa directo.
  const u = new URL(e.request.url);
  const propio = u.origin === location.origin;
  const sdk = u.origin === 'https://www.gstatic.com' && u.pathname.startsWith('/firebasejs/');
  if (!propio && !sdk) return;
  e.respondWith(
    caches.match(e.request).then((guardado) => {
      if (guardado) return guardado;
      return fetch(e.request)
        .then((resp) => {
          if (resp && resp.ok) {
            const copia = resp.clone();
            caches.open(VERSION).then((c) => c.put(e.request, copia));
          }
          return resp;
        })
        .catch(() => (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    })
  );
});
