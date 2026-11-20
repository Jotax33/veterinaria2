/* Mensaje flotante breve ("Mascota guardada", etc.). */
let avisoTimer;
export function aviso(texto) {
  const el = document.getElementById('aviso');
  el.textContent = texto;
  el.classList.add('ver');
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove('ver'), 2200);
}
