import type { Drawing } from 'Draw/Drawing';
import { atIndex } from 'Array/at';
import { removeStrungElement as removeStrungElementFromSvg } from 'Draw/bonds/strung/add';

export function removePrimaryBondById(drawing: Drawing, id: string) {
  let i = drawing.primaryBonds.findIndex(pb => pb.id == id);
  if (i >= 0) {
    let pb = atIndex(drawing.primaryBonds, i);
    if (pb) {
      pb.line.remove();
      pb.strungElements.forEach(ele => removeStrungElementFromSvg(ele));
      drawing.primaryBonds.splice(i, 1);
    }
  }
}

export function removeSecondaryBondById(drawing: Drawing, id: string) {
  let i = drawing.secondaryBonds.findIndex(sb => sb.id == id);
  if (i >= 0) {
    let sb = atIndex(drawing.secondaryBonds, i);
    if (sb) {
      sb.line.remove();
      sb.strungElements.forEach(ele => removeStrungElementFromSvg(ele));
      drawing.secondaryBonds.splice(i, 1);
    }
  }
}
