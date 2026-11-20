/* Exportación a WhatsApp.
   Solo se exporta UN turno: hay que elegir fecha y turno (Día o Noche). No se puede exportar todos los clínicos a la vez. */
import { estado } from './estado.js';
import { formatearEdad, formatearFecha, formatearFechaHora, deISO, textoPeso, tituloExamenes } from './formato.js';
import { clinicosOrdenados, examenesOrdenados, mascotasActivas } from './mascota.js';
import { coincideFechaTurno, diaSiguienteISO, glicemiaTexto } from './clinicos.js';

// El filtro está completo cuando hay fecha y el turno es Día o Noche
export const filtroExpListo = () => !!estado.filtroExp.fc && (estado.filtroExp.tt === 'Día' || estado.filtroExp.tt === 'Noche');
export const coincideFiltroExp = (c) => coincideFechaTurno(c, estado.filtroExp.fc, estado.filtroExp.tt);
export const clinicosAExportar = (m) => clinicosOrdenados(m).filter(coincideFiltroExp);

export function generarTextoExportacion() {
  const activas = mascotasActivas();
  if (activas.length === 0) return 'No hay mascotas registradas.';
  const hoy = formatearFecha(Date.now());

  const infecciosos = activas.filter((m) => m.infeccioso)
    .sort((a, b) => a.especie.localeCompare(b.especie, 'es'));
  const resto = activas.filter((m) => !m.infeccioso);
  const grupos = [
    ['🐱 GATOS', resto.filter((m) => m.especie === 'Gato')],
    ['🐶 PERROS', resto.filter((m) => m.especie === 'Perro')],
    ['⚠ INFECCIOSOS', infecciosos]
  ];

  const L = [];
  L.push(`🐾 MASCOTAS REGISTRADAS (${activas.length})`);
  L.push(`Compartido: ${hoy}`);
  L.push('');
  let n = 1;
  for (const [titulo, lista] of grupos) {
    if (lista.length === 0) continue;
    L.push(`${titulo} (${lista.length})`);
    L.push('');
    for (const m of lista) {
      L.push(`${n}. ${m.nombre}`); n++;
      L.push(`   Ingreso: ${formatearFecha(m.fechaIngreso)}`);
      // Fecha y hora de la última modificación de la ficha: al importar sirve para saber qué datos son más recientes
      if (m.fechaModificacion != null) L.push(`   Turno: ${formatearFechaHora(m.fechaModificacion)}`);
      if (m.fichaModificada != null) L.push(`   Ficha editada: ${formatearFechaHora(m.fichaModificada)}`);
      L.push(`   Especie: ${m.especie}`);
      L.push(`   Raza: ${m.raza ?? 'Sin raza'}`);
      L.push(`   Edad: ${formatearEdad(m.edad)}`);
      if (m.peso != null) L.push(`   Peso: ${textoPeso(m.peso)}`);
      if (m.motivoIngreso) L.push(`   Motivo de ingreso: ${m.motivoIngreso}`);
      if (m.diagnostico) L.push(`   Diagnóstico: ${m.diagnostico}`);
      L.push(`   Infeccioso: ${m.infeccioso ? 'Sí' : 'No'}`);
      if (m.especie === 'Gato') {
        L.push(`   Retrovirales: ${m.retrovirales ?? 'Sin registrar'}`);
        if (m.retrovirales === 'Sí' && m.resultadosRetrovirales) L.push(`   Resultados retrovirales: ${m.resultadosRetrovirales}`);
      }
      if (m.examenes.length === 0) L.push('   Exámenes: No');
      for (const e of examenesOrdenados(m)) {
        L.push(`   ${tituloExamenes(e.estado)} (${formatearFecha(e.fecha)}): ${e.detalle}`);
      }
      L.push(`   Ecografía: ${m.ecografia ?? 'Sin registrar'}`);
      if (m.ecografia === 'Sí' && m.hallazgosEcografia) L.push(`   Hallazgos ecografía: ${m.hallazgosEcografia}`);
      L.push(`   Radiografía: ${m.radiografia ?? 'Sin registrar'}`);
      if (m.radiografia === 'Sí' && m.hallazgosRadiografia) L.push(`   Hallazgos radiografía: ${m.hallazgosRadiografia}`);
      L.push(`   En ayuno: ${m.enAyuno ? 'Sí' : 'No'}`);
      if (m.comentarios) L.push(`   Comentarios: ${m.comentarios}`);
      for (const c of clinicosAExportar(m)) {
        L.push(`   Clínico ${formatearFechaHora(c.fecha)} (${c.turno})`);
        if (c.enfermero) L.push(`      Enfermero/a: ${c.enfermero}`);
        const signos = [];
        if (c.temp) signos.push(`Temp: ${c.temp} °C`);
        if (glicemiaTexto(c)) signos.push(`Glicemia: ${glicemiaTexto(c)}`);
        if (c.pas) signos.push(`PAS: ${c.pas}`);
        if (c.pam) signos.push(`PAM: ${c.pam}`);
        if (c.pad) signos.push(`PAD: ${c.pad}`);
        if (signos.length) L.push(`      ${signos.join(' | ')}`);
        if (c.alimentacion.length) L.push(`      Alimentación: ${c.alimentacion.join(', ')}`);
        if (c.bebeAgua) L.push(`      Bebe agua: ${c.bebeAgua}`);
        if (c.orina) L.push(`      Orina: ${c.orina}`);
        if (c.vomito) L.push(`      Vómito: ${c.vomito}`);
        if (c.feca) L.push(`      Feca: ${c.feca}`);
        if (c.orinaDeposiciones) L.push(`      Orina/deposiciones: ${c.orinaDeposiciones}`);
        if (c.comentarios) L.push(`      Comentarios del turno: ${c.comentarios}`);
      }
      L.push('');
    }
  }
  return L.join('\n');
}

/** Copia el texto al portapapeles. Devuelve true si se pudo. */
export async function copiarAlPortapapeles(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = texto; document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* nada */ }
    ta.remove();
    return ok;
  }
}

/** Genera el mensaje y lo copia. Devuelve true si se pudo copiar (false también si todavía no se eligió el turno). */
export async function copiarExportacion() {
  if (!filtroExpListo()) return false;
  return copiarAlPortapapeles(generarTextoExportacion());
}

export function textoInfoExport() {
  if (!filtroExpListo()) return 'Elige la fecha y el turno (Día o Noche) para poder copiar el texto.';
  const n = mascotasActivas().reduce((acc, m) => acc + m.clinicos.filter(coincideFiltroExp).length, 0);
  const { fc, tt } = estado.filtroExp;
  if (tt === 'Noche') {
    return `Se exportarán los clínicos de la noche que empieza el ${formatearFecha(deISO(fc))} (con la madrugada del ${formatearFecha(deISO(diaSiguienteISO(fc)))}): ${n}.`;
  }
  return `Se exportarán los clínicos del ${formatearFecha(deISO(fc))}, turno Día: ${n}.`;
}
