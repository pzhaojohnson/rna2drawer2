import { SequenceInterface as Sequence } from './SequenceInterface';
import { addNumbering, removeNumbering } from 'Draw/bases/number/add';

// does not orient base numbering line angles
export function updateBaseNumberings(seq: Sequence) {
  seq.bases.forEach((b, i) => {
    let p = i + 1;
    
    // remove any previous numbering
    removeNumbering(b);
    
    if ((p - seq.numberingAnchor) % seq.numberingIncrement == 0) {
      addNumbering(b, p + seq.numberingOffset);
    }
  });
}
