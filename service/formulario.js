/* Datos del formulario de mascota: estado inicial, validación y conversión a la mascota que se guarda. */
import { aISO, deISO, resultadosATexto, textoAResultados } from './formato.js';

export function estadoVacio() {
  return {
    fecha: aISO(Date.now()), nombre: '', especie: '', raza: '', anios: '', meses: '', peso: '',
    motivoIngreso: '', diagnostico: '', infeccioso: false,
    retrovirales: '', resultados: [],
    estadoExamenes: 'No', fechaExamenes: aISO(Date.now()), examenesPorTomar: '',
    ecografia: '', hallazgosEcografia: '',
    radiografia: '', hallazgosRadiografia: '',
    enAyuno: false, comentarios: ''
  };
}
export function estadoDesde(m) {
  return {
    fecha: aISO(m.fechaIngreso), nombre: m.nombre, especie: m.especie, raza: m.raza ?? '',
    anios: String(Math.floor(m.edad / 12)), meses: String(m.edad % 12),
    peso: m.peso == null ? '' : String(m.peso),
    motivoIngreso: m.motivoIngreso ?? '', diagnostico: m.diagnostico ?? '', infeccioso: !!m.infeccioso,
    retrovirales: m.retrovirales ?? '', resultados: textoAResultados(m.resultadosRetrovirales),
    // Al editar, los exámenes ya registrados se ven en el detalle; aquí se agrega uno nuevo.
    estadoExamenes: 'No', fechaExamenes: aISO(Date.now()), examenesPorTomar: '',
    ecografia: m.ecografia ?? '', hallazgosEcografia: m.hallazgosEcografia ?? '',
    radiografia: m.radiografia ?? '', hallazgosRadiografia: m.hallazgosRadiografia ?? '',
    enAyuno: !!m.enAyuno, comentarios: m.comentarios ?? ''
  };
}
export function validar(s) {
  const anios = s.anios.trim() === '' ? 0 : Number(s.anios);
  const meses = s.meses.trim() === '' ? 0 : Number(s.meses);
  const aniosOk = Number.isInteger(anios) && anios >= 0;
  const mesesOk = Number.isInteger(meses) && meses >= 0 && meses <= 11;
  const pesoTxt = s.peso.trim();
  const pesoOk = pesoTxt === '' || /^\d+([.,]\d+)?$/.test(pesoTxt);
  const examenesFalta = s.estadoExamenes !== 'No' && s.examenesPorTomar.trim() === '';
  const hallazgosFalta = s.ecografia === 'Sí' && s.hallazgosEcografia.trim() === '';
  const hallazgosRadioFalta = s.radiografia === 'Sí' && s.hallazgosRadiografia.trim() === '';
  const ok = s.nombre.trim() !== '' && s.especie !== '' && aniosOk && mesesOk && pesoOk && !examenesFalta && !hallazgosFalta && !hallazgosRadioFalta;
  return { ok, anios, meses, mesesOk, aniosOk, pesoOk, examenesFalta, hallazgosFalta, hallazgosRadioFalta };
}
export function aMascota(s, base) {
  const v = validar(s);
  const gato = s.especie === 'Gato';
  const examenes = [...(base.examenes || [])];
  // Fecha en que se registró o cambió el estado de la ecografía / radiografía (se ve en la lista de exámenes)
  const fechaDe = (nuevo, previo, fPrevia) => (nuevo ? (nuevo === previo && fPrevia ? fPrevia : Date.now()) : null);
  if (s.estadoExamenes !== 'No') {
    examenes.push({ fecha: deISO(s.fechaExamenes || aISO(Date.now())), estado: s.estadoExamenes, detalle: s.examenesPorTomar.trim() });
  }
  return {
    ...base,
    nombre: s.nombre.trim(),
    especie: s.especie,
    raza: s.raza.trim() || null,
    edad: v.anios * 12 + v.meses,
    peso: s.peso.trim() === '' ? null : Number(s.peso.trim().replace(',', '.')),
    motivoIngreso: s.motivoIngreso.trim(),
    diagnostico: s.diagnostico.trim(),
    infeccioso: s.infeccioso,
    retrovirales: gato ? (s.retrovirales || null) : null,
    resultadosRetrovirales: gato && s.retrovirales === 'Sí' ? resultadosATexto(s.resultados) : '',
    examenes,
    clinicos: base.clinicos || [],
    ecografia: s.ecografia || null,
    fechaEcografia: fechaDe(s.ecografia, base.ecografia, base.fechaEcografia),
    hallazgosEcografia: s.ecografia === 'Sí' ? s.hallazgosEcografia.trim() : '',
    radiografia: s.radiografia || null,
    fechaRadiografia: fechaDe(s.radiografia, base.radiografia, base.fechaRadiografia),
    hallazgosRadiografia: s.radiografia === 'Sí' ? s.hallazgosRadiografia.trim() : '',
    enAyuno: s.enAyuno,
    comentarios: s.comentarios.trim(),
    fechaIngreso: deISO(s.fecha || aISO(Date.now()))
  };
}
