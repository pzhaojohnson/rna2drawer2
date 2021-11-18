import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { atIndex } from 'Array/at';

export function removePrimaryBondById(drawing: Drawing, id: string) {
  let i = drawing.primaryBonds.findIndex(pb => pb.id == id);
  if (i >= 0) {
    let pb = atIndex(drawing.primaryBonds, i);
    if (pb) {
      pb.line.remove();
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
      drawing.secondaryBonds.splice(i, 1);
    }
  }
}
