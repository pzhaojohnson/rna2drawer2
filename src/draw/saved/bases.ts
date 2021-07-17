import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { atIndex } from 'Array/at';

export function getBaseByUniqueId(drawing: Drawing, id: unknown): Base | never {
  if (typeof id != 'string') {
    throw new Error('The given ID is not a string: ' + id + '.');
  } else {
    let bs = drawing.bases().filter(b => b.id == id);
    if (bs.length > 1) {
      throw new Error('The given ID is not unique: ' + id + '.');
    } else {
      let b = atIndex(bs, 0);
      if (b) {
        return b;
      } else {
        throw new Error('No base has the given ID: ' + id + '.');
      }
    }
  }
}
