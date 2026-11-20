/* Hematocrito: borrador del que se está escribiendo, validación y armado del registro a guardar. */
export const borradorHtVacio = () => ({ hct: '', prot: '', plasma: '' });

const NUMERO = /^\d+([.,]\d+)?$/;
const numeroOk = (t) => t.trim() === '' || NUMERO.test(t.trim());

/** % y proteína deben ser números; el plasma es texto libre. Hace falta al menos un dato. */
export const hayErrorHt = (b) => !numeroOk(b.hct) || !numeroOk(b.prot);
export const borradorHtValido = (b) => !hayErrorHt(b) && !!(b.hct.trim() || b.prot.trim() || b.plasma.trim());

export const construirHematocrito = (b) => ({
  fecha: Date.now(), hct: b.hct.trim(), prot: b.prot.trim(), plasma: b.plasma.trim()
});
