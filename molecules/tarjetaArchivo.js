/* Molécula: la tarjeta de una mascota dada de alta, en el Archivo. */
import { esc, formatearFecha } from '../service/formato.js';

export const tarjetaArchivo = (m) => `
      <article class="tarjeta" data-id="${esc(m.id)}">
        <div class="info">
          <h2 class="nombre">${esc(m.nombre)}</h2>
          <p>${esc(m.especie)} · ${esc(m.raza ?? 'Sin raza')}</p>
          <p>Ingreso: ${formatearFecha(m.fechaIngreso)}${m.fechaReingreso ? ` · Reingreso: ${formatearFecha(m.fechaReingreso)}` : ''}${m.fechaAlta ? ` · ${esc(m.situacion ?? 'Alta')}: ${formatearFecha(m.fechaAlta)}` : ''}</p>
          ${m.diagnostico ? `<p>Diagnóstico: ${esc(m.diagnostico)}</p>` : ''}
        </div>
        <div class="botones-tarjeta">
          <button class="txt" data-reingresar="${esc(m.id)}">Reingresar</button>
          <button class="peligro" data-borrar="${esc(m.id)}">Borrar</button>
        </div>
      </article>`;
