# Veterinaria

App de registro de mascotas hospitalizadas (PWA con Firebase). Sin herramientas de compilación: son módulos ES que el navegador carga directamente.

## Estructura (atomic design)

| Carpeta | Qué contiene |
|---|---|
| `atoms/` | Piezas mínimas de HTML: un campo, un grupo de opciones, una etiqueta. |
| `molecules/` | Combinan átomos: tarjeta de mascota, fila de examen, editor de fecha de un clínico, etc. |
| `organisms/` | Bloques completos: formulario de mascota, formulario de clínico, tabla de clínicos, lista de exámenes, panel de exportación. |
| `templates/` | La estructura de cada pantalla. Reciben los datos ya calculados y devuelven HTML. |
| `pages/` | Cada pantalla: dibuja su plantilla y conecta los botones con los servicios. |
| `service/` | **Toda la lógica**: Firebase, sesión, modelo de la mascota, clínicos y turnos, exportación a WhatsApp, importación, respaldo, formato de fechas y estado compartido. No dibuja pantallas. |

Archivos de la raíz: `index.html` (estructura), `main.js` (arranque), `router.js` (navegación), `styles.css`, `sw.js` (funciona sin internet) y `manifest.webmanifest`.

Regla de dependencias: `pages` → `templates` → `organisms` → `molecules` → `atoms`, y todos pueden usar `service`; `service` no depende de las carpetas de pantalla.

## Al cambiar archivos

Sube el número de `VERSION` en `sw.js` para que los teléfonos descarguen la versión nueva. Si agregas un archivo `.js`, agrégalo también a la lista `ARCHIVOS` de `sw.js`.
