/* Importar un mensaje exportado (de esta app o de la versión Android): lee el texto, lo convierte en mascotas
   y lo mezcla con lo que ya hay. Nunca pierde datos tuyos. */
import { estado } from './estado.js';
import { aISO, deISO, formatearFecha, resultadosATexto, sinAcentos, textoAResultados } from './formato.js';
import { claveExamen, claveMascota, normalizarMascota } from './mascota.js';
import { enviar, limpiar, nubeCrear, idPara, refDe } from './firebase.js';

export const ETIQUETAS = {
  'ingreso': 'ingreso', 'turno': 'turno', 'ficha editada': 'ficha', 'especie': 'especie', 'raza': 'raza', 'edad': 'edad', 'peso': 'peso',
  'motivo de ingreso': 'motivo', 'diagnostico': 'diagnostico', 'infeccioso': 'infeccioso',
  'retrovirales': 'retro', 'resultados retrovirales': 'resretro',
  'examenes': 'examenes', 'examenes tomados': 'ex_tomados',
  'examenes por tomar': 'ex_pendientes', 'examenes a tomar': 'ex_pendientes',
  'ecografia': 'eco', 'hallazgos ecografia': 'hallazgos',
  'radiografia': 'radio', 'hallazgos radiografia': 'hallazgosradio',
  'en ayuno': 'ayuno', 'comentarios': 'comentarios'
};
export const ETIQUETAS_CLINICO = {
  'temp': 'temp', 'glicemia': 'glicemia', 'pas': 'pas', 'pam': 'pam', 'pad': 'pad',
  'alimentacion': 'alimentacion', 'orina/deposiciones': 'orina', 'comentarios del turno': 'coment',
  'enfermero/a': 'enfermero', 'bebe agua': 'bebeagua'
};

export function fechaDeTexto(t) {
  const m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(t || '');
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1], 12, 0);
  return d.getMonth() === +m[2] - 1 && d.getDate() === +m[1] ? d.getTime() : null;
}
/** "13/11/2026 01:15" -> {ms, conHora:true}; "13/11/2026" (mensajes antiguos) -> {ms al mediodía, conHora:false} */
export function fechaHoraDeTexto(t) {
  const m = /(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(t || '');
  if (!m) return null;
  const conHora = m[4] !== undefined;
  const d = new Date(+m[3], +m[2] - 1, +m[1], conHora ? +m[4] : 12, conHora ? +m[5] : 0);
  if (d.getMonth() !== +m[2] - 1 || d.getDate() !== +m[1]) return null;
  return { ms: d.getTime(), conHora };
}
export function edadDeTexto(t) {
  const n = sinAcentos(t);
  if (n.startsWith('menos de')) return 0;
  const a = /(\d+)\s*ano/.exec(n), m = /(\d+)\s*mes/.exec(n);
  return (a ? +a[1] : 0) * 12 + (m ? +m[1] : 0);
}
export function pesoDeTexto(t) {
  const m = /(\d+(?:[.,]\d+)?)/.exec(t || '');
  return m ? Number(m[1].replace(',', '.')) : null;
}
export function opcionSiNoPendiente(t) {
  const n = sinAcentos(t);
  return n === 'si' ? 'Sí' : n === 'no' ? 'No' : n === 'pendiente' ? 'Pendiente' : null;
}
export const esSi = (t) => sinAcentos(t) === 'si';

export function parsearMensaje(texto) {
  const lineas = String(texto).replace(/\r/g, '').split('\n')
    .map((l) => l.replace(/[‎‏‪-‮]/g, '').trim());

  // Una mascota empieza con "1. Nombre" y su siguiente línea no vacía es "Ingreso: ..."
  const inicios = [];
  lineas.forEach((l, i) => {
    if (!/^\d+\.\s+\S/.test(l)) return;
    let j = i + 1;
    while (j < lineas.length && lineas[j] === '') j++;
    if (j < lineas.length && sinAcentos(lineas[j]).startsWith('ingreso:')) inicios.push(i);
  });

  const esEncabezado = (l) => /^[^\p{L}\d]*(GATOS|PERROS|INFECCIOSOS)\s*\(\d+\)\s*$/u.test(l);
  const resultado = [];
  let ignoradas = 0;

  inicios.forEach((ini, k) => {
    const fin = k + 1 < inicios.length ? inicios[k + 1] : lineas.length;
    const nombre = lineas[ini].replace(/^\d+\.\s+/, '').trim();
    const c = {};
    const exams = [];
    const clins = [];
    let ref = null;   // campo de texto al que se pegan las líneas siguientes (texto de varias líneas)
    let cur = null;   // clínico que se está leyendo
    let blancos = 0;
    const pegar = (l) => {
      if (ref) ref.o[ref.k] += '\n'.repeat(blancos + 1) + l;
      blancos = 0;
    };

    for (let i = ini + 1; i < fin; i++) {
      const l = lineas[i];
      if (l === '') { if (ref) blancos++; continue; }
      if (esEncabezado(l)) { ref = null; cur = null; blancos = 0; continue; }
      const n = sinAcentos(l);

      // "Clínico 09/11/2026 14:05 (Día)"
      const mh = /^clinico\s+(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s*\((dia|noche)\)\s*$/.exec(n);
      if (mh) {
        const f = new Date(+mh[3], +mh[2] - 1, +mh[1], +mh[4], +mh[5], 0, 0).getTime();
        cur = { fecha: f, creado: Date.now(), turno: mh[6] === 'noche' ? 'Noche' : 'Día', temp: '', glicemia: '',
                pas: '', pam: '', pad: '', alimentacion: [], orinaDeposiciones: '', comentarios: '' };
        clins.push(cur); ref = null; blancos = 0;
        continue;
      }
      if (cur) { // dentro de un clínico
        let reconocido = false;
        for (const seg of l.includes('|') ? l.split('|') : [l]) {
          const p = seg.indexOf(':');
          const clave = p > 0 ? ETIQUETAS_CLINICO[sinAcentos(seg.slice(0, p))] : undefined;
          if (!clave) continue;
          reconocido = true;
          const v = seg.slice(p + 1).trim();
          if (['temp', 'glicemia', 'pas', 'pam', 'pad'].includes(clave)) { cur[clave] = v.replace(/\s*°\s*c\s*$/i, '').trim(); ref = null; }
          else if (clave === 'alimentacion') { const nv = sinAcentos(v); cur.alimentacion = nv === 'no' ? ['No'] : ['Boca', 'Sonda'].filter((x) => nv.includes(sinAcentos(x))); ref = null; }
          else if (clave === 'orina') { cur.orinaDeposiciones = v; ref = { o: cur, k: 'orinaDeposiciones' }; }
          else if (clave === 'enfermero') { cur.enfermero = v; ref = null; }
          else if (clave === 'bebeagua') { cur.bebeAgua = v; ref = null; }
          else if (clave === 'coment') { cur.comentarios = v; ref = { o: cur, k: 'comentarios' }; }
        }
        if (reconocido) blancos = 0; else pegar(l);
        continue;
      }

      // "Exámenes tomados (09/11/2026): Hemograma"
      const mx = /^(examenes tomados|examenes por tomar)\s*\((\d{1,2}\/\d{1,2}\/\d{4})\)\s*:/.exec(n);
      if (mx) {
        const e = { estado: mx[1] === 'examenes tomados' ? 'Tomados' : 'Pendientes', fecha: fechaDeTexto(mx[2]),
                    detalle: l.slice(l.indexOf(':', l.indexOf(')')) + 1).trim() };
        exams.push(e); ref = { o: e, k: 'detalle' }; blancos = 0;
        continue;
      }
      const p = l.indexOf(':');
      const clave = p > 0 ? ETIQUETAS[sinAcentos(l.slice(0, p))] : undefined;
      if (clave) { c[clave] = l.slice(p + 1).trim(); ref = { o: c, k: clave }; blancos = 0; }
      else pegar(l);
    }

    const especie = (c.especie || '').trim();
    if (!nombre || !especie) { ignoradas++; return; }
    const gato = especie === 'Gato';
    const fechaIngreso = fechaDeTexto(c.ingreso) ?? deISO(aISO(Date.now()));

    // Exámenes: formato con fechas (nuevo) o el formato antiguo ("Exámenes: Tomados" + "Exámenes a tomar: ...")
    let examenes = exams.filter((e) => e.detalle).map((e) => ({ ...e, fecha: e.fecha ?? fechaIngreso }));
    if (exams.length === 0) {
      const exLinea = sinAcentos(c.examenes);
      let estado = 'No';
      if (exLinea === 'tomados') estado = 'Tomados';
      else if (exLinea === 'pendientes') estado = 'Pendientes';
      else if (exLinea === '' && c.ex_tomados !== undefined) estado = 'Tomados';
      else if (exLinea === '' && c.ex_pendientes !== undefined) estado = 'Pendientes';
      const detalle = (c.ex_tomados ?? c.ex_pendientes ?? '').trim();
      if (estado !== 'No' && detalle) examenes = [{ fecha: fechaIngreso, estado, detalle }];
    }

    const retro = gato ? opcionSiNoPendiente(c.retro) : null;
    const eco = opcionSiNoPendiente(c.eco);
    const radio = opcionSiNoPendiente(c.radio);
    const turno = fechaHoraDeTexto(c.turno);
    const ficha = fechaHoraDeTexto(c.ficha);

    resultado.push({
      nombre, especie,
      raza: c.raza && sinAcentos(c.raza) !== 'sin raza' ? c.raza : null,
      edad: edadDeTexto(c.edad),
      peso: pesoDeTexto(c.peso),
      motivoIngreso: c.motivo || '',
      diagnostico: c.diagnostico || '',
      infeccioso: esSi(c.infeccioso),
      retrovirales: retro,
      resultadosRetrovirales: retro === 'Sí' ? resultadosATexto(textoAResultados(c.resretro)) : '',
      examenes,
      clinicos: clins.sort((a, b) => a.fecha - b.fecha),
      ecografia: eco,
      hallazgosEcografia: eco === 'Sí' ? (c.hallazgos || '') : '',
      radiografia: radio,
      hallazgosRadiografia: radio === 'Sí' ? (c.hallazgosradio || '') : '',
      enAyuno: esSi(c.ayuno),
      comentarios: c.comentarios || '',
      fechaIngreso,
      fechaModificacion: turno ? turno.ms : null,
      modificacionPrecisa: !!(turno && turno.conHora), // solo se usa al importar; no se guarda
      fichaModificada: ficha && ficha.conHora ? ficha.ms : null // null = mensaje antiguo, no se sabe cuándo se editó la ficha
    });
  });
  return { mascotas: resultado, ignoradas };
}

/** Identifica a una mascota: mismo nombre + misma especie + mismo día de ingreso. */

/**
 * Mezcla los datos de la ficha de una mascota que ya existe con los del mensaje importado.
 * - Si la ficha del mensaje se editó DESPUÉS que la tuya: gana el mensaje, salvo en los campos que vengan vacíos
 *   (un campo vacío nunca borra un dato tuyo).
 * - Si es más vieja o no se puede saber: se conserva lo tuyo y solo se rellenan los campos que tenías vacíos.
 * Agregar clínicos o exámenes no cuenta como editar la ficha, así que no hace que unos datos viejos pasen por nuevos.
 */
export function mezclarFicha(ya, m) {
  const fichaLocal = ya.fichaModificada ?? ya.fechaModificacion ?? ya.fechaIngreso;
  const masNuevo = m.fichaModificada != null && m.fichaModificada > fichaLocal;
  const vacio = (v) => v == null || v === '';
  const campo = (k) => (masNuevo ? (vacio(m[k]) ? ya[k] : m[k]) : (vacio(ya[k]) ? m[k] : ya[k]));
  const par = (k1, k2) => { // dos datos que van juntos (ej.: ecografía y lo que se vio)
    const f = masNuevo ? (vacio(m[k1]) ? ya : m) : (vacio(ya[k1]) ? m : ya);
    return { [k1]: f[k1], [k2]: f[k2] };
  };
  const mods = [ya.fechaModificacion, m.modificacionPrecisa ? m.fechaModificacion : null].filter((x) => x != null);
  return {
    raza: campo('raza'), peso: campo('peso'),
    motivoIngreso: campo('motivoIngreso'), diagnostico: campo('diagnostico'), comentarios: campo('comentarios'),
    edad: Math.max(ya.edad, m.edad),                                        // la edad no baja
    infeccioso: masNuevo ? m.infeccioso : (ya.infeccioso || m.infeccioso),  // ante la duda se mantiene la alerta
    enAyuno: masNuevo ? m.enAyuno : ya.enAyuno,
    ...par('retrovirales', 'resultadosRetrovirales'),
    ...par('ecografia', 'hallazgosEcografia'),
    ...par('radiografia', 'hallazgosRadiografia'),
    fichaModificada: Math.max(fichaLocal, m.fichaModificada ?? 0),
    fechaModificacion: mods.length ? Math.max(...mods) : (ya.fechaModificacion ?? m.fechaModificacion ?? null)
  };
}

/** Si la mascota ya existe, se UNEN clínicos y exámenes y se mezcla la ficha (no se pierde nada tuyo); si no, se crea. */
export async function importarMascotas(lista) {
  const existentes = new Map(estado.mascotas.map((m) => [claveMascota(m), m]));
  let nuevas = 0, actualizadas = 0, clinicosNuevos = 0;
  for (const { modificacionPrecisa, id: _id, ...m } of lista) {
    const ya = existentes.get(claveMascota(m));
    if (ya) {
      const fechas = new Set(ya.clinicos.map((c) => c.fecha));
      const nuevosCl = [];
      for (const c of m.clinicos) if (!fechas.has(c.fecha)) { fechas.add(c.fecha); nuevosCl.push(c); clinicosNuevos++; } // un clínico que ya tienes no se toca
      const claves = new Set(ya.examenes.map(claveExamen));
      const nuevosEx = [];
      for (const e of m.examenes) if (!claves.has(claveExamen(e))) { claves.add(claveExamen(e)); nuevosEx.push(e); }
      const upd = limpiar(mezclarFicha(ya, { ...m, modificacionPrecisa }));
      if (nuevosCl.length) upd.clinicos = estado.FB.arrayUnion(...nuevosCl.map(limpiar));
      if (nuevosEx.length) upd.examenes = estado.FB.arrayUnion(...nuevosEx.map(limpiar));
      enviar(estado.FB.updateDoc(refDe(ya.id), upd));
      actualizadas++;
    } else {
      const nueva = { ...normalizarMascota(m), estado: 'hospitalizado' };
      nubeCrear(nueva);
      existentes.set(claveMascota(nueva), { ...nueva, id: idPara(nueva) });
      nuevas++; clinicosNuevos += m.clinicos.length;
    }
  }
  return { nuevas, actualizadas, clinicosNuevos };
}
