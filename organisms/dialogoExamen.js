/* Organismo: la ventana que se abre al marcar un examen como tomado. */
import { dialogoValido } from '../service/dialogos.js';
import { marcoDialogo } from '../molecules/marcoDialogo.js';
import { preguntaTodos } from '../molecules/preguntaTodos.js';
import { camposPendiente } from '../molecules/camposPendiente.js';

export const dialogoExamen = (d) => marcoDialogo({
  titulo: '¿Se tomaron todos los exámenes?',
  cuerpo: preguntaTodos(d.todos) + (d.todos === 'No' ? camposPendiente(d) : ''),
  valido: dialogoValido(d)
});
