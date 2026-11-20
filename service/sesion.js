/* Inicio y cierre de sesión. */
import { estado } from './estado.js';

/** Devuelve null si entró bien, o el mensaje de error para mostrar. */
export async function iniciarSesion(mail, pass) {
  try {
    await estado.FB.signInWithEmailAndPassword(estado.fbAuth, mail, pass);
    return null;
  } catch (e) {
    const c = (e && e.code) || '';
    return /network/.test(c) ? 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
      : /too-many/.test(c) ? 'Demasiados intentos. Espera unos minutos.'
      : 'Correo o contraseña incorrectos.';
  }
}

export const cerrarSesion = () => estado.FB.signOut(estado.fbAuth);

/** Avisa cada vez que alguien entra (user) o sale (null). Corta la suscripción a los datos anterior. */
export function vigilarSesion(alCambiar) {
  estado.FB.onAuthStateChanged(estado.fbAuth, (user) => {
    if (estado.desuscribir) { estado.desuscribir(); estado.desuscribir = null; }
    estado.usuario = user; estado.mascotas = []; estado.listo = false;
    alCambiar(user);
  });
}
