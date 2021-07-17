import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import { Base } from 'Draw/bases/Base';

export function basesInRange(mode: FoldingMode, r: IntegerRange): Base[] {
  let bases = [] as Base[];
  let drawing = mode.strictDrawing.drawing;
  r.fromStartToEnd(p => {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      bases.push(b);
    }
  });
  return bases;
}

export default basesInRange;
