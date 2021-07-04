import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { StraightBondInterface as StraightBond } from './StraightBondInterface';
import { atIndex } from 'Array/at';

function remove(sb: StraightBond) {
  sb.line.remove();
}

export function removePrimaryBondById(drawing: Drawing, id: string) {
  let i = drawing.primaryBonds.findIndex(pb => pb.id == id);
  if (i < 0) {
    console.error('No primary bond has the given ID: ' + id + '.');
  } else {
    let pb = atIndex(drawing.primaryBonds, i);
    if (pb) {
      remove(pb);
      drawing.primaryBonds.splice(i, 1);
    }
  }
}

export function removeSecondaryBondById(drawing: Drawing, id: string) {
  let i = drawing.secondaryBonds.findIndex(sb => sb.id == id);
  if (i < 0) {
    console.error('No secondary bond has the given ID: ' + id + '.');
  } else {
    let sb = atIndex(drawing.secondaryBonds, i);
    if (sb) {
      remove(sb);
      drawing.secondaryBonds.splice(i, 1);
    }
  }
}
