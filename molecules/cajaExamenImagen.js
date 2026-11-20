/* Molécula: la caja de un examen de imagen (ecografía o radiografía) con fecha, estado y botón "Marcar como tomada".
   Solo se dibuja si el examen está pendiente o realizado. */
import { aISO, formatearFecha } from '../service/formato.js';
import { etiqueta } from '../atoms/etiqueta.js';
import { boton } from '../atoms/boton.js';

export function cajaExamenImagen({ nombre, clase, valor, fecha, attrBoton }) {
  const pendiente = valor === 'Pendiente';
  if (!pendiente && valor !== 'Sí') return '';
  const minus = nombre.toLowerCase();
  return `<section class="caja ${clase}"><h2 class="caja-t">${nombre}</h2>
    <ul class="lista-ex"><li class="fila-ex">
      <time datetime="${aISO(fecha)}">${formatearFecha(fecha)}</time>
      <span class="det">${etiqueta(pendiente ? 'pendiente' : 'tomado', pendiente ? 'Pendiente' : 'Tomada')}${nombre} ${pendiente ? 'por realizar' : 'realizada'}</span>
      <span class="acc-ex">${pendiente ? boton({ clase: 'ok', texto: 'Marcar como tomada', attrs: `${attrBoton} aria-label="Marcar ${minus} como tomada"` }) : ''}</span>
    </li></ul></section>`;
}
