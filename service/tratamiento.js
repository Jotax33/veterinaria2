/* Tratamiento: medicamentos y comentarios del médico.
   Cada medicamento y cada comentario pertenece a UN día y UN turno (Día o Noche). Solo se muestran los del día y turno
   elegidos: nunca se muestran todos a la vez. */
import { aISO } from './formato.js';
import { turnoActual } from './clinicos.js';

export const SUGERENCIAS_VELOCIDAD = ['Cada 4 hr', 'Cada 6 hr', 'Cada 8 hr', 'Cada 12 hr', 'Cada 24 hr', 'DU'];
export const SUGERENCIAS_VIA = ['IV', 'VO', 'SC', 'IM', 'Tópica'];

/** Qué día y turno se están viendo (medicamentos: mf/mt; comentarios del médico: cf/ct) y si cada sección está abierta. */
export const vistaTratamientoInicial = () => ({
  med: false, cm: false,
  mf: aISO(Date.now()), mt: turnoActual(),
  cf: aISO(Date.now()), ct: turnoActual()
});

/** Hay que elegir fecha Y turno (Día o Noche) para ver o agregar algo. */
export const filtroListo = (dia, turno) => !!dia && (turno === 'Día' || turno === 'Noche');

export const medicamentosDe = (m, dia, turno) => (m.medicamentos ?? [])
  .filter((x) => x.dia === dia && x.turno === turno)
  .sort((a, b) => a.creado - b.creado);

export const comentarioMedicoDe = (m, dia, turno) => (m.comentariosMedico ?? []).find((x) => x.dia === dia && x.turno === turno) ?? null;

export const medicamentoValido = (d) => ['nombre', 'dosis', 'velocidad', 'via'].every((k) => String(d[k] ?? '').trim() !== '');

export function construirMedicamento(d, dia, turno, m) {
  let creado = Date.now();
  while ((m.medicamentos ?? []).some((x) => x.creado === creado)) creado++;
  return { dia, turno, nombre: d.nombre.trim(), dosis: d.dosis.trim(), velocidad: d.velocidad.trim(), via: d.via.trim(), creado };
}

/** Lo que se está escribiendo en "Comentarios del médico": parte de lo ya guardado para ese día y turno (si existe). */
export function borradorComentarioMedico(m, dia, turno) {
  const ex = comentarioMedicoDe(m, dia, turno);
  return { clave: `${dia}|${turno}`, medico: ex?.medico ?? '', texto: ex?.texto ?? '' };
}
export const comentarioMedicoValido = (b) => b.texto.trim() !== '';

export const construirComentarioMedico = (b, dia, turno) => ({ dia, turno, medico: b.medico.trim(), texto: b.texto.trim(), creado: Date.now() });
