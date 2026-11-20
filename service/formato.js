/* Utilidades de texto, fechas y formato. Funciones puras: no tocan la pantalla ni la nube. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function formatearEdad(totalMeses) {
  const anios = Math.floor(totalMeses / 12), meses = totalMeses % 12;
  const tA = anios === 1 ? '1 año' : `${anios} años`;
  const tM = meses === 1 ? '1 mes' : `${meses} meses`;
  if (anios === 0 && meses === 0) return 'Menos de 1 mes';
  if (anios === 0) return tM;
  if (meses === 0) return tA;
  return `${tA} y ${tM}`;
}
export const dos = (n) => String(n).padStart(2, '0');
export function formatearFecha(ms) {
  const d = new Date(ms);
  return `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
}
export function formatearHora(ms) {
  const d = new Date(ms);
  return `${dos(d.getHours())}:${dos(d.getMinutes())}`;
}
export const formatearFechaHora = (ms) => `${formatearFecha(ms)} ${formatearHora(ms)}`;
export function aISO(ms) { // millis -> "aaaa-mm-dd" (hora local)
  const d = new Date(ms);
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}
export function deISO(iso) { // "aaaa-mm-dd" -> millis (mediodía local, para que no se corra de día)
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d, 12, 0).getTime();
}
export const minutoActual = () => Math.floor(Date.now() / 60000) * 60000;

export function tituloExamenes(estado) {
  if (estado === 'Tomados') return 'Exámenes tomados';
  if (estado === 'Pendientes') return 'Exámenes por tomar';
  return null;
}
export const OPCIONES_RESULTADOS = ['Negativo', 'SIDA', 'Leucemia'];
export const resultadosATexto = (sel) => OPCIONES_RESULTADOS.filter((o) => sel.includes(o)).join(', ');
export const textoAResultados = (t) => (t || '').split(',').map((x) => x.trim()).filter(Boolean);
export const textoPeso = (kg) => String(kg).replace('.', ',') + ' kg';

export const sinAcentos = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
export const iconoTurno = (t) => (t === 'Noche' ? '🌙' : '☀');
