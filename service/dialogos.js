/* Ventanas del detalle (marcar examen, ecografía o radiografía como tomada): estado y validación. */
import { aISO } from './formato.js';

export const dialogoVacio = (tipo, idx = null) => ({ tipo, idx, todos: '', pendiente: '', fecha: aISO(Date.now()), texto: '' });

/** Exámenes: "Sí" basta; "No" pide qué quedó pendiente y para qué día. Ecografía y radiografía: hallazgos obligatorios. */
export const dialogoValido = (d) => (d.tipo === 'examen'
  ? d.todos === 'Sí' || (d.todos === 'No' && d.pendiente.trim() !== '' && d.fecha !== '')
  : d.texto.trim() !== '');
