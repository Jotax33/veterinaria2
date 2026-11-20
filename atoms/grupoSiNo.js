/* Átomo: dos casillas "Sí" y "No" (solo una a la vez) para un dato del clínico, como Orina o Vómito. */
export const grupoSiNo = (k, titulo, valor, opciones = ['Sí', 'No']) => `<fieldset><legend>${titulo}</legend>
        ${opciones.map((o) => `<label class="opt"><input type="checkbox" data-sn="${k}" data-v="${o}" ${valor === o ? 'checked' : ''}><span>${o}</span></label>`).join('')}
      </fieldset>`;
