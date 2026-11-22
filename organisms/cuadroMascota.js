/* Organismo: el cuadro azul con todos los datos de la mascota y el botón Editar. */
import { esc, formatearEdad, formatearFecha, textoPeso } from '../service/formato.js';
import { dato } from '../atoms/dato.js';
import { estanciasDe } from '../service/mascota.js';

// "Hospitalización 2 (actual): 19/11/2026 – en curso"
const textoEstancia = (h) => `${formatearFecha(h.ingreso)} – ${h.alta ? formatearFecha(h.alta) + (h.situacion ? ' (' + h.situacion + ')' : '') : 'en curso'}`;

// Pendiente: se muestra el día en que se hará, ej. "Pendiente (para el 22/11/2026)"
const textoImagen = (valor, fecha) => (valor === 'Pendiente' && fecha ? `Pendiente (para el ${formatearFecha(fecha)})` : valor ?? 'Sin registrar');

export const cuadroMascota = (m) => `
    <section class="cuadro">
      <header class="cuadro-cab"><h1>${esc(m.nombre)}</h1><button id="btn-editar">Editar</button></header>
      <dl class="datos">
        ${dato('Estado', m.estado === 'alta' ? 'Alta' + (m.fechaAlta ? ' (' + formatearFecha(m.fechaAlta) + ')' : '') : 'Hospitalizado')}
        ${m.situacion ? dato('Estado del paciente', m.situacion) : ''}
        ${dato('Fecha de ingreso', formatearFecha(m.fechaIngreso))}
        ${m.fechaReingreso ? dato('Último reingreso', formatearFecha(m.fechaReingreso)) : ''}
        ${m.hospitalizaciones?.length ? estanciasDe(m).map((h, i) => dato(`Hospitalización ${i + 1}${h.actual ? ' (actual)' : ''}`, textoEstancia(h))).join('') : ''}
        ${dato('Especie', m.especie)}
        ${dato('Sexo', m.sexo ?? 'Sin registrar')}
        ${dato('Raza', m.raza ?? 'Sin raza')}
        ${dato('Edad', formatearEdad(m.edad))}
        ${dato('Peso', m.peso != null ? textoPeso(m.peso) : 'Sin registrar')}
        ${m.motivoIngreso ? dato('Motivo de ingreso', m.motivoIngreso) : ''}
        ${dato('Diagnóstico', m.diagnostico || 'Sin diagnóstico')}
        ${dato('Infeccioso', m.infeccioso ? 'Sí' : 'No')}
        ${m.especie === 'Gato' ? dato('Retrovirales', m.retrovirales ?? 'Sin registrar') : ''}
        ${m.especie === 'Gato' && m.retrovirales === 'Sí' && m.resultadosRetrovirales ? dato('Resultados retrovirales', m.resultadosRetrovirales) : ''}
        ${dato('Ecografía', textoImagen(m.ecografia, m.fechaEcografia))}
        ${m.ecografia === 'Sí' && m.hallazgosEcografia ? dato('Hallazgos de la ecografía', m.hallazgosEcografia) : ''}
        ${dato('Radiografía', textoImagen(m.radiografia, m.fechaRadiografia))}
        ${m.radiografia === 'Sí' && m.hallazgosRadiografia ? dato('Hallazgos de la radiografía', m.hallazgosRadiografia) : ''}
        ${dato('En ayuno', m.enAyuno ? 'Sí' : 'No')}
        ${m.comentarios ? dato('Comentarios', m.comentarios) : ''}
      </dl>
    </section>`;
