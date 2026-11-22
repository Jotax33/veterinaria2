/* Estado compartido de la app. Todo lo que cambia mientras se usa vive aquí,
   para que cualquier módulo lo lea y lo modifique (los módulos no pueden reasignar variables de otros). */
import { estadoVacio } from './formulario.js';
import { aISO } from './formato.js';

export const estado = {
  // Nube
  FB: null, fbAuth: null, fdb: null, desuscribir: null,
  usuario: null,
  listo: false,            // ya llegaron los datos (de la nube o de la copia guardada en el teléfono)
  mascotas: [],            // copia en memoria de lo que hay en la nube
  localAntiguo: [],        // mascotas que quedaron solo en este teléfono (versión anterior)
  ocultarLocal: false,

  // Lista y exportación
  filtroExp: { fc: aISO(Date.now()), tt: '' },   // fecha + turno (Día o Noche, obligatorio) del turno a exportar
  busquedaArchivo: '',

  // Formulario de ingreso (se conserva si cambias de pestaña y vuelves)
  formIngreso: estadoVacio(),

  // Ficha de la mascota: qué secciones están abiertas y qué se está escribiendo
  vista: { id: null, ex: false, cl: false, tc: false, ht: false, fc: '', tt: 'Todos' },   // + med, cm, mf, mt, cf, ct (ver service/tratamiento.js)
  borrador: null,
  borradorCm: null,                                              // comentario del médico que se está escribiendo
  borradorHt: null,                                              // hematocrito que se está escribiendo
  sit: '',                                                       // estado del paciente elegido (sin guardar todavía)
  dialogo: null,                                                 // ventana abierta (examen, ecografía o radiografía)
  editCom: null, textoCom: '',                                   // comentario de turno que se está editando
  editFecha: null, datosFecha: { f: '', h: '', t: 'Día' }        // clínico cuya fecha/hora se está corrigiendo
};
