/* Base de datos antigua del teléfono (IndexedDB, versión anterior de la app).
   Ya no se usa para guardar: solo se lee para poder subir a la nube lo que quedó guardado allí. */
import { normalizarMascota } from './mascota.js';

const DB_NOMBRE = 'veterinaria';
const STORE = 'mascotas';
let db;

function abrirDB() {
  return new Promise((ok, fallo) => {
    const req = indexedDB.open(DB_NOMBRE, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => ok(req.result);
    req.onerror = () => fallo(req.error);
  });
}
function tx(modo, fn) {
  return new Promise((ok, fallo) => {
    const t = db.transaction(STORE, modo);
    const res = fn(t.objectStore(STORE));
    t.oncomplete = () => ok(res && 'result' in res ? res.result : undefined);
    t.onerror = () => fallo(t.error);
    t.onabort = () => fallo(t.error);
  });
}
const dbTodas = () => tx('readonly', (s) => s.getAll());

const CLAVE_SUBIDO = 'vet_local_subido';

/** Mascotas que quedaron guardadas solo en este teléfono ([] si ya se subieron o no hay). */
export async function leerLocalAntiguo() {
  try {
    if (localStorage.getItem(CLAVE_SUBIDO) === '1') return [];
    db = await abrirDB();
    return (await dbTodas()).map(normalizarMascota).map((m) => ({ ...m, modificacionPrecisa: true }));
  } catch (e) {
    return [];
  }
}

export function marcarLocalSubido() {
  try { localStorage.setItem(CLAVE_SUBIDO, '1'); } catch { /* nada */ }
}
