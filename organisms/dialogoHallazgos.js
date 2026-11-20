/* Organismo: la ventana que se abre al marcar la ecografía o la radiografía como tomada (hallazgos obligatorios). */
import { dialogoValido } from '../service/dialogos.js';
import { marcoDialogo } from '../molecules/marcoDialogo.js';
import { campoArea } from '../atoms/campoArea.js';

export const dialogoHallazgos = (d) => {
  const nombre = d.tipo === 'eco' ? 'la ecografía' : 'la radiografía';
  return marcoDialogo({
    titulo: `¿Qué se encontró en ${nombre}?`,
    cuerpo: campoArea('data-m', 'texto', `Hallazgos de ${nombre}`, d.texto, 4, true),
    valido: dialogoValido(d)
  });
};
