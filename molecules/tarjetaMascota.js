/* Molécula: la tarjeta de una mascota hospitalizada en la lista. */
import { esc, formatearEdad, formatearFecha, textoPeso } from '../service/formato.js';

export const tarjetaMascota = (m) => `
    <article class="tarjeta" data-id="${esc(m.id)}">
      <div class="info">
        <h3 class="nombre">${esc(m.nombre)}</h3>
        <p>${esc(m.especie)}${m.sexo ? ' · ' + esc(m.sexo) : ''} · ${esc(m.raza ?? 'Sin raza')} · ${esc(formatearEdad(m.edad))}${m.peso != null ? ' · ' + esc(textoPeso(m.peso)) : ''}</p>
        <p>Ingreso: ${formatearFecha(m.fechaIngreso)}${m.fechaReingreso ? ` · Reingreso: ${formatearFecha(m.fechaReingreso)}` : ''}</p>
        ${m.infeccioso ? '<p class="alerta">⚠ Infeccioso</p>' : ''}
        ${m.enAyuno ? '<p class="alerta">⚠ En ayuno</p>' : ''}
        ${m.diagnostico ? `<p>Diagnóstico: ${esc(m.diagnostico)}</p>` : ''}
      </div>
      <button class="peligro" data-borrar="${esc(m.id)}">Borrar</button>
    </article>`;
