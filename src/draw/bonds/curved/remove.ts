import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { atIndex } from 'Array/at';

export function removeTertiaryBondById(drawing: Drawing, id: string) {
  let i = drawing.tertiaryBonds.findIndex(tb => tb.id == id);
  if (i < 0) {
    console.error('No tertiary bond has the given ID: ' + id + '.');
  } else {
    let tb = atIndex(drawing.tertiaryBonds, i);
    if (tb) {
      tb.path.remove();
      drawing.tertiaryBonds.splice(i, 1);
    }
  }
}
