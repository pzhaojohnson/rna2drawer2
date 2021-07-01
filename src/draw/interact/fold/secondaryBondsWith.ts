import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import { SecondaryBond } from 'Draw/bonds/straight/StraightBond';
import basesInRange from './basesInRange';

export function secondaryBondsWith(mode: FoldingMode, r: IntegerRange): SecondaryBond[] {
  let bonds = [] as SecondaryBond[];
  let bases = basesInRange(mode, r);
  mode.strictDrawing.drawing.forEachSecondaryBond(sb => {
    if (bases.find(b => b.id == sb.base1.id || b.id == sb.base2.id)) {
      bonds.push(sb);
    }
  });
  return bonds;
}

export default secondaryBondsWith;
