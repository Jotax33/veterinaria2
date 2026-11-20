/* Copia de seguridad: descargar todo como archivo y restaurarlo (solo agrega lo que falte, no borra nada). */
import { estado } from './estado.js';
import { aviso } from './avisos.js';
import { aISO } from './formato.js';
import { normalizarMascota } from './mascota.js';
import { importarMascotas } from './importacion.js';

export function descargarRespaldo() {
  const datos = JSON.stringify({ app: 'veterinaria', version: 2, fecha: new Date().toISOString(), mascotas: estado.mascotas }, null, 2);
  const blob = new Blob([datos], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `veterinaria-respaldo-${aISO(Date.now())}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
export async function restaurarRespaldo(archivo) {
  try {
    const json = JSON.parse(await archivo.text());
    if (json.app !== 'veterinaria' || !Array.isArray(json.mascotas)) throw new Error('formato');
    if (!confirm(`El respaldo tiene ${json.mascotas.length} mascotas. Se agregarán a la nube lo que falte; no se borra nada de lo que ya hay. ¿Continuar?`)) return;
    const r = await importarMascotas(json.mascotas.map((m) => ({ ...normalizarMascota(m), modificacionPrecisa: true })));
    aviso(`Respaldo restaurado: ${r.nuevas} nuevas, ${r.actualizadas} ya existían`);
  } catch {
    alert('El archivo no es un respaldo válido de esta app.');
  }
}
