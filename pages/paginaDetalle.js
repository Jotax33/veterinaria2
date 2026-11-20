/* Página: la ficha de una mascota. Dibuja la plantilla y conecta los botones con los servicios. */
import { app } from '../service/dom.js';
import { estado } from '../service/estado.js';
import { aviso } from '../service/avisos.js';
import { aISO, deISO, formatearHora } from '../service/formato.js';
import { buscarMascota, examenesOrdenados } from '../service/mascota.js';
import { borradorValido, borradorVacio, construirClinico, diaDeNoche, fechaDesdeDatos } from '../service/clinicos.js';
import { borradorHtVacio, borradorHtValido, construirHematocrito, hayErrorHt } from '../service/hematocrito.js';
import { dialogoVacio, dialogoValido } from '../service/dialogos.js';
import { SITUACIONES_QUE_ARCHIVAN } from '../service/situacion.js';
import {
  nubeActualizar, nubeReingresar, nubeAgregarClinico, nubeAgregarExamen, nubeAgregarHematocrito, nubeEditarClinico, nubeEditarExamen, nubeQuitar
} from '../service/firebase.js';
import { plantillaDetalle } from '../templates/plantillaDetalle.js';

export function paginaDetalle(id) {
  const m = buscarMascota(id);
  if (!m) {
    app.innerHTML = '<p><button class="txt" id="volver">← Volver</button></p><p>Mascota no encontrada</p>';
    document.getElementById('volver').onclick = () => (location.hash = '#/mascotas');
    return;
  }
  if (estado.vista.id !== id) {
    // Al abrir la ficha se muestra la fecha del último clínico guardado (o hoy si todavía no hay)
    const ult = m.clinicos.length ? Math.max(...m.clinicos.map((c) => c.fecha)) : Date.now();
    estado.vista = { id, ex: false, cl: false, tc: false, ht: false, fc: aISO(ult), tt: 'Todos' };
    estado.borrador = borradorVacio(); estado.editCom = null; estado.editFecha = null;
    estado.borradorHt = borradorHtVacio(); estado.sit = m.situacion ?? ''; estado.dialogo = null;
  }
  if (!estado.borrador) estado.borrador = borradorVacio();
  if (!estado.borradorHt) estado.borradorHt = borradorHtVacio();

  app.innerHTML = plantillaDetalle({
    m, vista: estado.vista, borrador: estado.borrador, borradorHt: estado.borradorHt, sit: estado.sit, dialogo: estado.dialogo,
    editFecha: estado.editFecha, datosFecha: estado.datosFecha, editCom: estado.editCom, textoCom: estado.textoCom
  });

  // Ventana abierta (examen, ecografía o radiografía): se muestra encima de la ficha; Esc la cierra
  const dlg = document.getElementById('dlg');
  if (dlg) { dlg.addEventListener('cancel', () => { estado.dialogo = null; }); dlg.showModal(); }

  const redibujar = () => { const y = window.scrollY; paginaDetalle(id); window.scrollTo(0, y); };
  const actualizarBotonDlg = () => { const b = document.getElementById('dlg-guardar'); if (b) b.disabled = !dialogoValido(estado.dialogo); };
  const actualizarBotonHt = () => {
    const b = document.getElementById('btn-guardar-ht'); if (b) b.disabled = !borradorHtValido(estado.borradorHt);
    const er = document.getElementById('err-ht'); if (er) er.hidden = !hayErrorHt(estado.borradorHt);
  };
  const actualizarBoton = () => { const b = document.getElementById('btn-guardar-cl'); if (b) b.disabled = !borradorValido(estado.borrador); };

  app.oninput = (e) => {
    if (e.target.dataset.ecom !== undefined) { estado.textoCom = e.target.value; return; }
    if (e.target.dataset.efc !== undefined) { estado.datosFecha[e.target.dataset.efc] = e.target.value; return; }
    if (e.target.dataset.m !== undefined && estado.dialogo) { estado.dialogo[e.target.dataset.m] = e.target.value; actualizarBotonDlg(); return; }
    if (e.target.dataset.ht !== undefined) { estado.borradorHt[e.target.dataset.ht] = e.target.value; actualizarBotonHt(); return; }
    const k = e.target.dataset.c;
    if (!k) return;
    if (k === 'glicemia') { // solo números enteros
      const limpio = e.target.value.replace(/\D/g, '');
      if (limpio !== e.target.value) e.target.value = limpio;
    }
    estado.borrador[k] = e.target.value;
    actualizarBoton();
  };
  app.onchange = (e) => {
    const t = e.target;
    const borrador = estado.borrador;
    if (t.dataset.mtodos !== undefined && estado.dialogo) {
      estado.dialogo.todos = t.dataset.mtodos;
      redibujar();
    } else if (t.dataset.sit !== undefined) {
      estado.sit = t.dataset.sit;
      const bs = document.getElementById('btn-guardar-sit'); if (bs) bs.disabled = estado.sit === (m.situacion ?? '');
    } else if (t.id === 'sel-turno') {
      borrador.turno = t.value;
      const f = document.getElementById('form-cl');
      f.classList.toggle('noche', t.value === 'Noche');
      f.classList.toggle('dia', t.value !== 'Noche');
    } else if (t.dataset.sn) {
      borrador[t.dataset.sn] = t.checked ? t.dataset.v : '';
      redibujar();
    } else if (t.dataset.efc !== undefined) {
      estado.datosFecha[t.dataset.efc] = t.value;
    } else if (t.dataset.f) {
      estado.vista[t.dataset.f] = t.value;
      estado.editCom = null;
      redibujar();
    } else if (t.dataset.alim) {
      borrador.alim = t.checked ? t.dataset.alim : '';
      if (borrador.alim !== 'Sí') borrador.via = '';
      redibujar();
    } else if (t.dataset.via) {
      borrador.via = t.checked ? t.dataset.via : '';
      redibujar();
    } else if (t.dataset.cb) {
      borrador[t.dataset.cb] = t.checked;
      actualizarBoton();
    }
  };
  app.onclick = async (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const { vista } = estado;
    if (b.id === 'volver') { history.length > 1 ? history.back() : (location.hash = '#/mascotas'); return; }
    if (b.id === 'btn-editar') { location.hash = '#/editar/' + id; return; }
    if (b.id === 'btn-reingresar') {
      if (m.estado !== 'alta') return;
      nubeReingresar(m);
      aviso('Paciente reingresado');
      return;
    }
    if (b.id === 'tg-ex') { vista.ex = !vista.ex; redibujar(); return; }
    if (b.id === 'tg-cl') { vista.cl = !vista.cl; redibujar(); return; }
    if (b.id === 'tg-tc') { vista.tc = !vista.tc; redibujar(); return; }
    if (b.id === 'tg-ht') { vista.ht = !vista.ht; redibujar(); return; }

    // Hematocrito
    if (b.id === 'btn-guardar-ht' && borradorHtValido(estado.borradorHt)) {
      nubeAgregarHematocrito(id, construirHematocrito(estado.borradorHt));
      estado.borradorHt = borradorHtVacio();
      aviso('Hematocrito guardado');
      redibujar();
      return;
    }
    if (b.dataset.quitarHt !== undefined) {
      const h1 = m.hematocritos.find((h) => h.fecha === Number(b.dataset.quitarHt));
      if (h1 && confirm('¿Borrar este hematocrito? Esta acción no se puede deshacer.')) nubeQuitar(id, 'hematocritos', h1);
      return;
    }

    // Estado del paciente (alta médica, alta solicitada, eutanasia)
    if (b.id === 'btn-guardar-sit') {
      if (!estado.sit || estado.sit === (m.situacion ?? '')) return;
      if (SITUACIONES_QUE_ARCHIVAN.includes(estado.sit) && m.estado !== 'alta') {
        // Alta médica o eutanasia: el paciente se guarda en el Archivo y sale de la lista
        if (!confirm(`¿Guardar «${estado.sit}» para ${m.nombre}? Pasará al Archivo y dejará de salir en la lista y en el mensaje.`)) return;
        nubeActualizar(id, { situacion: estado.sit, estado: 'alta', fechaAlta: Date.now(), fechaModificacion: Date.now() });
        aviso(`${estado.sit}: paciente guardado en el Archivo`);
        location.hash = '#/mascotas';
        return;
      }
      nubeActualizar(id, { situacion: estado.sit, fechaModificacion: Date.now() });
      aviso('Estado guardado');
      return;
    }

    // Ventanas de exámenes, ecografía y radiografía
    if (b.id === 'dlg-cancelar') { estado.dialogo = null; redibujar(); return; }
    if (b.id === 'dlg-guardar') {
      const d = estado.dialogo;
      if (!d || !dialogoValido(d)) return;
      if (d.tipo === 'examen') {
        const e1 = examenesOrdenados(m)[d.idx];
        if (e1 && e1.estado !== 'Tomados') {
          nubeEditarExamen(id, e1, { ...e1, estado: 'Tomados', fecha: deISO(aISO(Date.now())) });
          if (d.todos === 'No') nubeAgregarExamen(id, { fecha: deISO(d.fecha), estado: 'Pendientes', detalle: d.pendiente.trim() });
          aviso(d.todos === 'No' ? 'Examen tomado; el resto quedó pendiente' : 'Examen marcado como tomado');
        }
      } else if (d.tipo === 'eco' && m.ecografia === 'Pendiente') {
        nubeActualizar(id, { ecografia: 'Sí', hallazgosEcografia: d.texto.trim(), fechaEcografia: Date.now(), fechaModificacion: Date.now(), fichaModificada: Date.now() });
        aviso('Ecografía marcada como tomada');
      } else if (d.tipo === 'radio' && m.radiografia === 'Pendiente') {
        nubeActualizar(id, { radiografia: 'Sí', hallazgosRadiografia: d.texto.trim(), fechaRadiografia: Date.now(), fechaModificacion: Date.now(), fichaModificada: Date.now() });
        aviso('Radiografía marcada como tomada');
      }
      estado.dialogo = null; redibujar();
      return;
    }

    // Comentario de un turno
    if (b.dataset.editCom !== undefined) {
      const c1 = m.clinicos.find((c) => c.fecha === Number(b.dataset.editCom));
      if (c1) { estado.editCom = c1.fecha; estado.textoCom = c1.comentarios || ''; redibujar(); }
      return;
    }
    if (b.id === 'cancelar-com') { estado.editCom = null; redibujar(); return; }
    if (b.id === 'guardar-com') {
      const c1 = m.clinicos.find((c) => c.fecha === estado.editCom);
      const txt = estado.textoCom.trim();
      if (c1 && txt !== (c1.comentarios || '')) {
        if (txt === '' && !confirm('¿Borrar el comentario de este turno?')) return;
        nubeEditarClinico(id, c1, { ...c1, comentarios: txt });
        aviso('Comentario actualizado');
      }
      estado.editCom = null; redibujar();
      return;
    }

    // Fecha, hora y turno de un clínico ya guardado
    if (b.dataset.editFecha !== undefined) {
      const c1 = m.clinicos.find((c) => c.fecha === Number(b.dataset.editFecha));
      if (c1) {
        estado.editFecha = c1.fecha; estado.editCom = null;
        estado.datosFecha = { f: aISO(c1.fecha), h: formatearHora(c1.fecha), t: c1.turno };
        redibujar();
      }
      return;
    }
    if (b.id === 'cancelar-fecha') { estado.editFecha = null; redibujar(); return; }
    if (b.id === 'guardar-fecha') {
      const c1 = m.clinicos.find((c) => c.fecha === estado.editFecha);
      if (!c1) { estado.editFecha = null; redibujar(); return; }
      const datos = estado.datosFecha;
      if (!datos.f || !datos.h) { alert('Elige la fecha y la hora.'); return; }
      const nueva = fechaDesdeDatos(datos.f, datos.h);
      if (Number.isNaN(nueva)) { alert('La fecha u hora no es válida.'); return; }
      if (nueva !== c1.fecha && m.clinicos.some((c) => c.fecha === nueva)) {
        alert('Ya hay otro clínico guardado a esa misma hora. Cambia la hora al menos un minuto.');
        return;
      }
      if (nueva !== c1.fecha || datos.t !== c1.turno) {
        nubeEditarClinico(id, c1, { ...c1, fecha: nueva, turno: datos.t });
        vista.fc = aISO(nueva); vista.tt = 'Todos'; // para que lo veas donde quedó
        aviso('Clínico actualizado');
      }
      estado.editFecha = null; redibujar();
      return;
    }
    if (b.id === 'f-todas') { vista.fc = ''; estado.editCom = null; redibujar(); return; }

    // Clínico nuevo
    if (b.id === 'btn-guardar-cl' && borradorValido(estado.borrador)) {
      const nuevo = construirClinico(estado.borrador, m);
      nubeAgregarClinico(id, nuevo);
      estado.borrador = borradorVacio();
      vista.tc = true; vista.fc = nuevo.turno === 'Noche' ? diaDeNoche(nuevo) : aISO(nuevo.fecha); vista.tt = nuevo.turno;
      aviso('Clínico guardado');
      redibujar();
      return;
    }

    // Exámenes, ecografía y radiografía
    if (b.dataset.tomarEx !== undefined) {
      const e1 = examenesOrdenados(m)[Number(b.dataset.tomarEx)];
      if (e1 && e1.estado !== 'Tomados') { estado.dialogo = dialogoVacio('examen', Number(b.dataset.tomarEx)); redibujar(); }
      return;
    }
    if (b.dataset.tomarEco !== undefined) {
      if (m.ecografia === 'Pendiente') { estado.dialogo = dialogoVacio('eco'); redibujar(); }
      return;
    }
    if (b.dataset.tomarRadio !== undefined) {
      if (m.radiografia === 'Pendiente') { estado.dialogo = dialogoVacio('radio'); redibujar(); }
      return;
    }
    if (b.dataset.quitarEx !== undefined) {
      const e1 = examenesOrdenados(m)[Number(b.dataset.quitarEx)];
      if (e1 && confirm('¿Quitar este examen de la lista?')) nubeQuitar(id, 'examenes', e1);
      return;
    }
    if (b.dataset.quitarCl !== undefined) {
      const f = Number(b.dataset.quitarCl);
      if (confirm('¿Borrar este clínico? Esta acción no se puede deshacer.')) {
        const c1 = m.clinicos.find((c) => c.fecha === f);
        if (c1) nubeQuitar(id, 'clinicos', c1);
      }
    }
  };
}
