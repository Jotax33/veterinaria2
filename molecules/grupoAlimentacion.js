/* Molécula: alimentación del clínico. Sí / No; si es Sí, se elige una vía (Boca o Sonda, solo una). */
export const grupoAlimentacion = (b) => `
      <fieldset><legend>Alimentación</legend>
        <label class="opt"><input type="checkbox" data-alim="Sí" ${b.alim === 'Sí' ? 'checked' : ''}><span>Sí</span></label>
        <label class="opt"><input type="checkbox" data-alim="No" ${b.alim === 'No' ? 'checked' : ''}><span>No</span></label>
        ${b.alim === 'Sí' ? `<div class="sub">
          <label class="opt"><input type="checkbox" data-via="Boca" ${b.via === 'Boca' ? 'checked' : ''}><span>Boca</span></label>
          <label class="opt"><input type="checkbox" data-via="Sonda" ${b.via === 'Sonda' ? 'checked' : ''}><span>Sonda</span></label>
          ${b.via ? '' : '<p class="ayuda">Elige boca o sonda (solo una).</p>'}
        </div>` : ''}
      </fieldset>`;
