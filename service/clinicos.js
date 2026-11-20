/* Clínicos: turnos, borrador del clínico que se está escribiendo y qué clínicos entran en un filtro de fecha + turno. */
import { aISO, minutoActual } from './formato.js';

export const turnoActual = () => { const h = new Date().getHours(); return h >= 7 && h < 20 ? 'Día' : 'Noche'; };
export const borradorVacio = () => ({ turno: turnoActual(), enfermero: '', temp: '', glicemia: '', come: false, pas: '', pam: '', pad: '', alim: '', via: '', agua: '', orina: '', vomito: '', feca: '', comentarios: '' });
/* La glicemia es un número entero; se puede anotar también "Come". Si hay número y "Come", en la tabla se ve el número. */
export const glicemiaOk = (b) => b.glicemia.trim() === '' || /^\d+$/.test(b.glicemia.trim());
export const glicemiaTexto = (c) => c.glicemia || (c.come ? 'Come' : '');
export const borradorValido = (b) => glicemiaOk(b) && !(b.alim === 'Sí' && !b.via) && !!(b.temp.trim() || b.glicemia.trim() || b.come || b.pas.trim() || b.pam.trim() || b.pad.trim()
  || b.alim || b.agua || b.orina || b.vomito || b.feca.trim() || b.comentarios.trim());

/* La NOCHE empieza un día y termina al siguiente (1 clínico en la tarde/noche y 2 en la madrugada).
   Un clínico de turno Noche anotado antes de las 7:55 pertenece a la noche que empezó el día anterior.
   Así, al elegir "Noche" y una fecha, salen el clínico de ese día y los de la madrugada siguiente. */
export const MINUTO_FIN_NOCHE = 7 * 60 + 55; // 7:55
export const TEXTO_FIN_NOCHE = `${Math.floor(MINUTO_FIN_NOCHE / 60)}:${String(MINUTO_FIN_NOCHE % 60).padStart(2, '0')}`;
export function diaDeNoche(c) {
  const d = new Date(c.fecha);
  if (d.getHours() * 60 + d.getMinutes() < MINUTO_FIN_NOCHE) d.setDate(d.getDate() - 1);
  return aISO(d.getTime());
}
export function coincideFechaTurno(c, fc, tt) {
  if (tt !== 'Todos' && c.turno !== tt) return false;
  if (!fc) return true;
  return (tt === 'Noche' ? diaDeNoche(c) : aISO(c.fecha)) === fc;
}
export const diaSiguienteISO = (iso) => { const [a, m, d] = iso.split('-').map(Number); return aISO(new Date(a, m - 1, d + 1, 12).getTime()); };

/** Arma el clínico a guardar con lo escrito en el borrador. Dos clínicos en el mismo minuto: el segundo queda 1 min después. */
export function construirClinico(borrador, m) {
  let fecha = minutoActual();
  while (m.clinicos.some((c) => c.fecha === fecha)) fecha += 60000;
  return {
    fecha, creado: Date.now(), turno: borrador.turno, enfermero: borrador.enfermero.trim(),
    temp: borrador.temp.trim(), glicemia: borrador.glicemia.trim(), come: !!borrador.come,
    pas: borrador.pas.trim(), pam: borrador.pam.trim(), pad: borrador.pad.trim(),
    alimentacion: borrador.alim === 'Sí' ? [borrador.via] : borrador.alim === 'No' ? ['No'] : [],
    bebeAgua: borrador.agua, orina: borrador.orina, vomito: borrador.vomito, feca: borrador.feca.trim(), comentarios: borrador.comentarios.trim()
  };
}

/** Convierte lo escrito en el editor de fecha ("2026-11-15" + "08:30") en milisegundos; NaN si no es válido. */
export function fechaDesdeDatos(f, h) {
  const [a, mes, d] = f.split('-').map(Number);
  const [hh, mi] = h.split(':').map(Number);
  return new Date(a, mes - 1, d, hh, mi).getTime();
}
