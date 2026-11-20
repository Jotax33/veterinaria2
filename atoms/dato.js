/* Átomo: un dato de la ficha (título pequeño arriba y valor abajo). Va dentro de un <dl>. */
import { esc } from '../service/formato.js';

export const dato = (titulo, valor) => `<div class="dato"><dt>${esc(titulo)}</dt><dd>${esc(valor)}</dd></div>`;
