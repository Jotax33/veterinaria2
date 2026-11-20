/* Nube (Firebase): carga del SDK, inicio de sesión y base de datos Firestore que se sincroniza entre todos. */
import { estado } from './estado.js';
import { claveMascota, normalizarMascota } from './mascota.js';

export const firebaseConfig = {
  apiKey: "AIzaSyBOv64h66BwFNUUHkILWyk5PPuOvRLZ4kA",
  authDomain: "entregaturnosvet.firebaseapp.com",
  projectId: "entregaturnosvet",
  storageBucket: "entregaturnosvet.firebasestorage.app",
  messagingSenderId: "506234993703",
  appId: "1:506234993703:web:a1ee1df17a41bfb27b6202"
};
const FB_VERSION = '10.14.1';
const urlFB = (n) => `https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-${n}.js`;

export async function cargarFirebase() {
  if (window.__FB_MOCK) return window.__FB_MOCK; // solo para pruebas
  const [a, b, c] = await Promise.all([import(urlFB('app')), import(urlFB('auth')), import(urlFB('firestore'))]);
  return { ...a, ...b, ...c };
}

/** Conecta con Firebase y deja listo el inicio de sesión y la base de datos. */
export function iniciarFirebase(FB) {
  estado.FB = FB;
  const fbApp = FB.initializeApp(firebaseConfig);
  estado.fbAuth = FB.getAuth(fbApp);
  try {
    // Guarda una copia en el teléfono: la app abre y se puede trabajar aunque no haya internet; al volver se sincroniza.
    estado.fdb = FB.initializeFirestore(fbApp, { localCache: FB.persistentLocalCache({ tabManager: FB.persistentMultipleTabManager() }) });
  } catch (e) {
    estado.fdb = FB.getFirestore(fbApp);
  }
}

export function hashTexto(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
/** Identificador de la ficha: sale del nombre + especie + día de ingreso. Así, si dos personas crean al mismo paciente, es UNA sola ficha. */
export const idPara = (m) => 'm' + hashTexto(claveMascota(m));
export const limpiar = (o) => JSON.parse(JSON.stringify(o)); // Firestore no acepta "undefined"
export const refDe = (id) => estado.FB.doc(estado.fdb, 'mascotas', id);
export function enviar(promesa) {
  Promise.resolve(promesa).catch((e) => {
    console.error(e);
    alert('No se pudo guardar en la nube (' + ((e && e.code) || 'error') + '). Revisa tu conexión o tus permisos.');
  });
}

/* ---- Escrituras. Las listas (clínicos, exámenes) nunca se reescriben completas: solo se agrega o quita un elemento,
        así no se pisan los cambios de otra persona. ---- */
export const nubeCrear = (m) => { const { id, ...resto } = m; enviar(estado.FB.setDoc(refDe(idPara(m)), limpiar(resto))); };
export const nubeActualizar = (id, campos) => enviar(estado.FB.updateDoc(refDe(id), limpiar(campos)));
/** Reingreso: la estancia que terminó se guarda en el historial (sin reescribir la lista) y empieza una nueva con fecha de hoy. */
export const nubeReingresar = (m) => {
  const ahora = Date.now();
  const anterior = limpiar({ ingreso: m.fechaReingreso ?? m.fechaIngreso, alta: m.fechaAlta ?? null, situacion: m.situacion ?? null });
  enviar(estado.FB.updateDoc(refDe(m.id), {
    ...limpiar({ estado: 'hospitalizado', fechaAlta: null, situacion: null, fechaReingreso: ahora, fechaModificacion: ahora }),
    hospitalizaciones: estado.FB.arrayUnion(anterior)
  }));
};
export const nubeAgregarClinico = (id, c) => enviar(estado.FB.updateDoc(refDe(id), { clinicos: estado.FB.arrayUnion(limpiar(c)), fechaModificacion: Date.now() }));
// Un elemento de una lista de Firestore no se puede cambiar "en su lugar": se agrega el nuevo y se quita el viejo (sin reescribir toda la lista).
export const nubeEditarClinico = (id, viejo, nuevo) => {
  enviar(estado.FB.updateDoc(refDe(id), { clinicos: estado.FB.arrayUnion(limpiar(nuevo)), fechaModificacion: Date.now() }));
  enviar(estado.FB.updateDoc(refDe(id), { clinicos: estado.FB.arrayRemove(limpiar(viejo)) }));
};
// Marcar un examen pendiente como tomado (misma técnica: se agrega el nuevo y se quita el viejo)
export const nubeEditarExamen = (id, viejo, nuevo) => {
  enviar(estado.FB.updateDoc(refDe(id), { examenes: estado.FB.arrayUnion(limpiar(nuevo)), fechaModificacion: Date.now() }));
  enviar(estado.FB.updateDoc(refDe(id), { examenes: estado.FB.arrayRemove(limpiar(viejo)) }));
};
export const nubeAgregarHematocrito = (id, h) => enviar(estado.FB.updateDoc(refDe(id), { hematocritos: estado.FB.arrayUnion(limpiar(h)), fechaModificacion: Date.now() }));
export const nubeAgregarExamen = (id, e) => enviar(estado.FB.updateDoc(refDe(id), { examenes: estado.FB.arrayUnion(limpiar(e)), fechaModificacion: Date.now() }));
export const nubeQuitar = (id, campo, item) => enviar(estado.FB.updateDoc(refDe(id), { [campo]: estado.FB.arrayRemove(limpiar(item)) }));
export const nubeBorrar = (id) => enviar(estado.FB.deleteDoc(refDe(id)));
/** Edita los datos de la ficha; si se agregó un examen nuevo, se suma a la lista sin reescribirla. */
export const nubeEditarFicha = (id, campos, examenNuevo) => {
  const upd = limpiar(campos);
  if (examenNuevo) upd.examenes = estado.FB.arrayUnion(limpiar(examenNuevo));
  enviar(estado.FB.updateDoc(refDe(id), upd));
};

/** Se suscribe a la colección: cada vez que alguien cambia algo, se actualiza la copia en memoria y se avisa. */
export function suscribir(alRecibir, alFallar) {
  estado.listo = false;
  estado.desuscribir = estado.FB.onSnapshot(estado.FB.collection(estado.fdb, 'mascotas'), (snap) => {
    estado.mascotas = snap.docs.map((d) => normalizarMascota({ ...d.data(), id: d.id }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    const primera = !estado.listo;
    estado.listo = true;
    alRecibir(primera);
  }, alFallar);
}
