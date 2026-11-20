/* Organismo: las mascotas hospitalizadas agrupadas en Perros, Gatos e Infecciosos. */
import { tarjetaMascota } from '../molecules/tarjetaMascota.js';

export function listaMascotas(activas) {
  const infec = activas.filter((m) => m.infeccioso).sort((a, b) => a.especie.localeCompare(b.especie, 'es'));
  const noInf = activas.filter((m) => !m.infeccioso);
  const grupos = [
    ['🐶 Perros', noInf.filter((m) => m.especie === 'Perro')],
    ['🐱 Gatos', noInf.filter((m) => m.especie === 'Gato')],
    ['⚠ Infecciosos', infec]
  ];
  return grupos.filter(([, l]) => l.length > 0)
    .map(([t, l]) => `<section class="grupo"><h2 class="grupo-t"><span>${t}</span><span>${l.length}</span></h2>${l.map(tarjetaMascota).join('')}</section>`).join('');
}
