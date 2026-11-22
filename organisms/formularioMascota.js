/* Organismo: el formulario de la mascota (sirve para "Nueva mascota" y para "Editar").
   plantillaFormulario dibuja el formulario; montarFormulario lo conecta con sus eventos. */
import { esc, OPCIONES_RESULTADOS, tituloExamenes } from '../service/formato.js';
import { validar } from '../service/formulario.js';
import { campoTexto } from '../atoms/campoTexto.js';
import { grupoRadio } from '../atoms/grupoRadio.js';
import { grupoCasillasExclusivo } from '../atoms/grupoCasillasExclusivo.js';
import { seccionForm } from '../molecules/seccionForm.js';

/** Fecha en que se hará una ecografía o radiografía pendiente (igual que "¿Qué día se tomarán los exámenes?"). */
const campoPendiente = (k, titulo, valor, errId, error) =>
  `<label class="campo"><span>${titulo}</span>
    <input type="date" data-k="${k}" value="${esc(valor)}" ${error ? 'aria-invalid="true"' : ''}>
    <small class="err" id="${errId}" ${error ? '' : 'hidden'}>Elige el día</small></label>`;

export function plantillaFormulario(s, modo) {
  const v = validar(s);
  const titExamenes = tituloExamenes(s.estadoExamenes);
  const gato = s.especie === 'Gato';
  return `
    ${seccionForm('Datos del paciente', `
    <label class="campo"><span>Fecha de ingreso</span>
      <input type="date" data-k="fecha" value="${esc(s.fecha)}"></label>
    ${campoTexto('nombre', 'Nombre', s.nombre)}
    ${grupoRadio('especie', 'Especie', ['Perro', 'Gato'], s.especie)}
    ${grupoRadio('sexo', 'Sexo', ['Macho', 'Hembra'], s.sexo)}
    ${campoTexto('raza', 'Raza (opcional)', s.raza)}
    <div class="fila2">
      ${campoTexto('anios', 'Años', s.anios, { tipo: 'number', inputmode: 'numeric' })}
      ${campoTexto('meses', 'Meses', s.meses, { tipo: 'number', inputmode: 'numeric', errId: 'err-meses', errTexto: 'Máximo 11', error: !v.mesesOk })}
    </div>
    ${campoTexto('peso', 'Peso (kg, opcional)', s.peso, { inputmode: 'decimal', errId: 'err-peso', errTexto: 'Escribe un número, por ejemplo 4,5', error: !v.pesoOk })}`)}

    ${seccionForm('Motivo y diagnóstico', `
      ${campoTexto('motivoIngreso', 'Motivo de ingreso', s.motivoIngreso)}
      ${campoTexto('diagnostico', 'Diagnóstico', s.diagnostico)}
      <label class="opt"><input type="checkbox" data-bool="infeccioso" ${s.infeccioso ? 'checked' : ''}><span>Es infeccioso</span></label>`)}

    ${gato ? seccionForm('Retrovirales', `
      ${grupoRadio('retrovirales', 'Retrovirales', ['Sí', 'No', 'Pendiente'], s.retrovirales)}
      ${s.retrovirales === 'Sí' ? `
        <div class="sub"><p class="sub-t">Resultados (puedes marcar más de uno)</p>
        ${OPCIONES_RESULTADOS.map((o) =>
          `<label class="opt"><input type="checkbox" data-res="${o}" ${s.resultados.includes(o) ? 'checked' : ''}><span>${o}</span></label>`).join('')}
        </div>` : ''}`) : ''}

    ${seccionForm('Exámenes', `
    ${grupoRadio('estadoExamenes', 'Exámenes', ['Tomados', 'Pendientes', 'No'], s.estadoExamenes)}
    ${modo === 'editar' ? '<p class="ayuda">Los exámenes ya registrados se ven en el detalle. Aquí puedes agregar uno nuevo.</p>' : ''}
    ${titExamenes ? `
      <label class="campo"><span>${s.estadoExamenes === 'Tomados' ? '¿Qué día se tomaron los exámenes?' : '¿Qué día se tomarán los exámenes?'}</span>
        <input type="date" data-k="fechaExamenes" value="${esc(s.fechaExamenes)}"></label>
      ${campoTexto('examenesPorTomar', titExamenes, s.examenesPorTomar, {
        errId: 'err-ex', errTexto: 'Obligatorio si los exámenes están Tomados o Pendientes', error: v.examenesFalta })}` : ''}`)}

    ${seccionForm('Ecografía', `
    ${grupoCasillasExclusivo('ecografia', 'Ecografía', ['Sí', 'No', 'Pendiente'], s.ecografia)}
    ${s.ecografia === 'Pendiente' ? campoPendiente('fechaEcografia', '¿Qué día se hará la ecografía?', s.fechaEcografia, 'err-fecha-eco', v.fechaEcoFalta) : ''}
    ${s.ecografia === 'Sí' ? campoTexto('hallazgosEcografia', '¿Qué se vio en la ecografía?', s.hallazgosEcografia, {
        area: true, errId: 'err-hall', errTexto: 'Obligatorio si la ecografía es Sí', error: v.hallazgosFalta }) : ''}`)}

    ${seccionForm('Radiografía', `
    ${grupoCasillasExclusivo('radiografia', 'Radiografía', ['Sí', 'No', 'Pendiente'], s.radiografia)}
    ${s.radiografia === 'Pendiente' ? campoPendiente('fechaRadiografia', '¿Qué día se hará la radiografía?', s.fechaRadiografia, 'err-fecha-radio', v.fechaRadioFalta) : ''}
    ${s.radiografia === 'Sí' ? campoTexto('hallazgosRadiografia', '¿Qué se vio en la radiografía?', s.hallazgosRadiografia, {
        area: true, errId: 'err-hall-radio', errTexto: 'Obligatorio si la radiografía es Sí', error: v.hallazgosRadioFalta }) : ''}`)}

    ${seccionForm('Otros datos', `
      <label class="opt"><input type="checkbox" data-bool="enAyuno" ${s.enAyuno ? 'checked' : ''}><span>En ayuno</span></label>
      ${campoTexto('comentarios', 'Comentarios extras', s.comentarios, { area: true })}`)}

    <div class="acciones">
      <button type="button" id="btn-guardar" ${v.ok ? '' : 'disabled'}>${modo === 'editar' ? 'Guardar cambios' : 'Guardar'}</button>
      ${modo === 'editar' ? '<button type="button" class="sec" id="btn-cancelar">Cancelar</button>' : ''}
    </div>`;
}

/** Dibuja el formulario dentro de `cont` y conecta todos sus eventos. */
export function montarFormulario(cont, s, modo, alGuardar, alCancelar) {
  function dibujar() {
    const y = window.scrollY;
    cont.innerHTML = plantillaFormulario(s, modo);
    window.scrollTo(0, y);
  }
  function refrescarValidacion() {
    const v = validar(s);
    const btn = cont.querySelector('#btn-guardar');
    if (btn) btn.disabled = !v.ok;
    const marca = (id, mostrar, campo) => {
      const e = cont.querySelector('#' + id);
      if (e) e.hidden = !mostrar;
      const c = cont.querySelector(`[data-k="${campo}"]`);
      if (c) mostrar ? c.setAttribute('aria-invalid', 'true') : c.removeAttribute('aria-invalid');
    };
    marca('err-meses', !v.mesesOk, 'meses');
    marca('err-peso', !v.pesoOk, 'peso');
    marca('err-ex', v.examenesFalta, 'examenesPorTomar');
    marca('err-hall', v.hallazgosFalta, 'hallazgosEcografia');
    marca('err-hall-radio', v.hallazgosRadioFalta, 'hallazgosRadiografia');
    marca('err-fecha-eco', v.fechaEcoFalta, 'fechaEcografia');
    marca('err-fecha-radio', v.fechaRadioFalta, 'fechaRadiografia');
  }

  // Texto, números y fecha: solo actualizan el estado (no redibujan, para no perder el cursor)
  cont.oninput = (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    s[k] = e.target.value;
    refrescarValidacion();
  };
  // Opciones y casillas: pueden mostrar u ocultar secciones, así que redibujan
  cont.onchange = (e) => {
    const t = e.target;
    if (t.dataset.radio) {
      s[t.dataset.radio] = t.value;
      dibujar();
    } else if (t.dataset.excl) {
      s[t.dataset.excl] = t.checked ? t.value : '';
      dibujar();
    } else if (t.dataset.bool) {
      s[t.dataset.bool] = t.checked;
    } else if (t.dataset.res) {
      const op = t.dataset.res;
      if (!t.checked) s.resultados = s.resultados.filter((x) => x !== op);
      else if (op === 'Negativo') s.resultados = ['Negativo'];
      else s.resultados = [...s.resultados.filter((x) => x !== 'Negativo'), op];
      dibujar();
    }
  };
  cont.onclick = (e) => {
    if (e.target.id === 'btn-guardar' && validar(s).ok) alGuardar(s);
    if (e.target.id === 'btn-cancelar') alCancelar();
  };
  dibujar();
  return { dibujar };
}
