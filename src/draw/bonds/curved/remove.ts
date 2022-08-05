import type { Drawing } from 'Draw/Drawing';
import { atIndex } from 'Array/at';
import { removeStrungElement as removeStrungElementFromSvg } from 'Draw/bonds/strung/add';

export function removeTertiaryBondById(drawing: Drawing, id: string) {
  let i = drawing.tertiaryBonds.findIndex(tb => tb.id == id);
  if (i >= 0) {
    let tb = atIndex(drawing.tertiaryBonds, i);
    if (tb) {
      tb.path.remove();
      tb.strungElements.forEach(ele => removeStrungElementFromSvg(ele));
      drawing.tertiaryBonds.splice(i, 1);
    }
  }
}
