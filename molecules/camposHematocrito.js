/* Molécula: los tres campos del hematocrito (%, proteína y plasma). */
import { campoSigno } from '../atoms/campoSigno.js';
import { campoLibre } from '../atoms/campoLibre.js';

export const camposHematocrito = (b) => `
        <section class="fila3">
          ${campoSigno('hct', '%', b.hct, 'data-ht')}
          ${campoSigno('prot', 'Proteína', b.prot, 'data-ht')}
          ${campoLibre('data-ht', 'plasma', 'Plasma', b.plasma)}
        </section>`;
