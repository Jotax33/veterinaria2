/* Átomo: las opciones de un desplegable de turno (Todos / Día / Noche). */
export const opcionesTurno = (actual, lista = ['Todos', 'Día', 'Noche'], textoVacio = '') =>
  (textoVacio ? `<option value="" ${actual ? '' : 'selected'}>${textoVacio}</option>` : '') + lista.map((o) => `<option value="${o}" ${actual === o ? 'selected' : ''}>${o === 'Día' ? '☀ Día' : o === 'Noche' ? '🌙 Noche' : 'Todos'}</option>`).join('');
