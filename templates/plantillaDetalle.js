/* Plantilla: la ficha de una mascota (cuadro de datos y tres secciones que se abren y cierran). */
import { cuadroMascota } from '../organisms/cuadroMascota.js';
import { listaExamenes } from '../organisms/listaExamenes.js';
import { formularioClinico } from '../organisms/formularioClinico.js';
import { tablaClinicos } from '../organisms/tablaClinicos.js';
import { formularioHematocrito } from '../organisms/formularioHematocrito.js';
import { tablaHematocrito } from '../organisms/tablaHematocrito.js';
import { panelEstado } from '../organisms/panelEstado.js';
import { dialogoExamen } from '../organisms/dialogoExamen.js';
import { dialogoHallazgos } from '../organisms/dialogoHallazgos.js';
import { boton } from '../atoms/boton.js';

/** `p` trae: m, vista, borrador, borradorHt, sit (estado elegido), dialogo (ventana abierta) y lo que necesita la tabla de clínicos (editFecha, datosFecha, editCom, textoCom). */
export const plantillaDetalle = (p) => {
  const { m, vista, borrador, borradorHt, sit, dialogo } = p;
  return `
    <p class="volver"><button class="txt" id="volver">← Volver</button></p>
    ${cuadroMascota(m)}
    <section class="bloque" aria-label="Hematocrito">
      ${boton({ id: 'tg-ht', clase: 'sec', attrs: `aria-expanded="${vista.ht}"`, texto: vista.ht ? 'Ocultar formulario' : 'Agregar hematocrito' })}
      <section class="contenido">${vista.ht ? formularioHematocrito(borradorHt) : ''}${tablaHematocrito(m)}</section>
    </section>
    ${panelEstado(m, sit)}
    ${m.estado === 'alta' ? `<footer class="acciones">${boton({ id: 'btn-reingresar', clase: 'sec', texto: 'Reingresar paciente' })}</footer>` : ''}

    <section class="bloque" aria-label="Exámenes">
      <button class="sec" id="tg-ex" aria-expanded="${vista.ex}">${vista.ex ? 'Ocultar exámenes' : 'Mostrar exámenes'}</button>
      <div class="contenido">${vista.ex ? listaExamenes(m) : ''}</div>
    </section>

    <section class="bloque" aria-label="Ingreso de clínicos">
      <button class="sec" id="tg-cl" aria-expanded="${vista.cl}">${vista.cl ? 'Ocultar ingreso de clínico' : 'Agregar clínico'}</button>
      <div class="contenido">${vista.cl ? formularioClinico(borrador) : ''}</div>
    </section>

    <section class="bloque" aria-label="Clínicos guardados">
      <button class="sec" id="tg-tc" aria-expanded="${vista.tc}">${vista.tc ? 'Ocultar clínicos' : 'Mostrar clínicos'}</button>
      <div class="contenido">${vista.tc ? tablaClinicos(p) : ''}</div>
    </section>
    ${dialogo ? (dialogo.tipo === 'examen' ? dialogoExamen(dialogo) : dialogoHallazgos(dialogo)) : ''}`;
};
