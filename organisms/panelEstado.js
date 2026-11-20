/* Organismo: el estado del paciente (alta médica, alta solicitada o eutanasia) con su botón Guardar estado. */
import { opcionesEstado } from '../molecules/opcionesEstado.js';
import { boton } from '../atoms/boton.js';

export const panelEstado = (m, elegido) => `
    <section class="caja caja-estado" aria-label="Estado del paciente">
      ${opcionesEstado(elegido)}
      <footer class="acciones">${boton({ id: 'btn-guardar-sit', texto: 'Guardar estado', desactivado: !(elegido && elegido !== (m.situacion ?? '')) })}</footer>
    </section>`;
