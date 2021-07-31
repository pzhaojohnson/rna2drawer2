import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { removeCircleOutline, removeCircleHighlighting } from 'Draw/bases/annotate/circle/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { updateBaseNumberings } from 'Draw/sequences/number';
import { orientBaseNumberings } from 'Draw/bases/number/orient';

export function removeBases(drawing: Drawing, bs: Base[]) {
  bs.forEach(b => {
    let seq = drawing.sequences.find(seq => seq.bases.includes(b));
    if (!seq) {
      console.error(`No sequence contains the base with ID: ${b.id}.`);
    } else {
      let i = seq.bases.indexOf(b);
      // should be at least zero if the sequence was found above,
      // but check just to be safe
      if (i < 0) {
        console.error(`Unable to find the base with ID: ${b.id}.`);
      } else {
        seq.bases.splice(i, 1);
        b.text.remove();
        removeCircleOutline(b);
        removeCircleHighlighting(b);
        removeNumbering(b);
      }
    }
  });
  drawing.sequences.forEach(seq => updateBaseNumberings(seq));
  orientBaseNumberings(drawing);
}
