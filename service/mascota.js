/* Modelo de la mascota: cómo se normaliza, cómo se identifica y cómo se ordenan sus listas. */
import { estado } from './estado.js';
import { formatearFecha, sinAcentos } from './formato.js';

/**
 * Deja cada mascota con la forma actual. Las mascotas guardadas con versiones anteriores
 * (que tenían un solo "estado de exámenes" sin fecha) se convierten en un registro de exámenes
 * con la fecha de ingreso, así no se pierde nada.
 */
export function normalizarMascota(m) {
  if (!Array.isArray(m.examenes)) {
    const estado = m.estadoExamenes;
    const detalle = (m.examenesPorTomar || '').trim();
    m.examenes = estado && estado !== 'No' && detalle
      ? [{ fecha: m.fechaIngreso, estado, detalle }] : [];
  }
  delete m.estadoExamenes;
  delete m.examenesPorTomar;
  if (!Array.isArray(m.clinicos)) m.clinicos = [];
  if (!Array.isArray(m.hematocritos)) m.hematocritos = [];
  if (!Array.isArray(m.hospitalizaciones)) m.hospitalizaciones = [];
  m.clinicos.forEach((c) => { if (c.creado == null) c.creado = c.fecha; });
  if (m.peso === undefined) m.peso = null;
  // Última vez que se editó la FICHA (no cuenta agregar clínicos ni exámenes). Sirve para saber qué datos son más nuevos al importar.
  if (m.fichaModificada === undefined) m.fichaModificada = m.fechaModificacion ?? m.fechaIngreso;
  return m;
}

/** Identifica a una mascota: mismo nombre + misma especie + mismo día de ingreso. */
export const claveMascota = (m) => `${sinAcentos(m.nombre)}|${sinAcentos(m.especie)}|${formatearFecha(m.fechaIngreso)}`;
export const claveExamen = (e) => `${e.estado}|${formatearFecha(e.fecha)}|${sinAcentos(e.detalle)}`;

export const clinicosOrdenados = (m) => [...m.clinicos].sort((a, b) => a.fecha - b.fecha);
export const examenesOrdenados = (m) => [...m.examenes].sort((a, b) => a.fecha - b.fecha);

/**
 * Historial de hospitalizaciones, de la más antigua a la actual.
 * `m.hospitalizaciones` guarda solo las estancias YA terminadas (ingreso, alta, situación); la actual sale de la ficha:
 * empieza en `fechaReingreso` (o en `fechaIngreso` si nunca reingresó) y termina en `fechaAlta` si el paciente está de alta.
 */
export const estanciasDe = (m) => [
  ...[...(m.hospitalizaciones ?? [])].sort((a, b) => a.ingreso - b.ingreso).map((h) => ({ ...h, actual: false })),
  { ingreso: m.fechaReingreso ?? m.fechaIngreso, alta: m.fechaAlta ?? null, situacion: m.situacion ?? null, actual: true }
];

export const mascotasActivas = () => estado.mascotas.filter((m) => m.estado !== 'alta');
export const buscarMascota = (id) => estado.mascotas.find((m) => m.id === id);
