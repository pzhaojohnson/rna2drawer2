import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import Base from '../../Base';

export interface Range {
  position5: number;
  position3: number;
}

export function basesInRange(mode: FoldingMode, r: Range): Base[] {
  let bases = [];
  let drawing = mode.strictDrawing.drawing;
  for (let p = r.position5; p <= r.position3; p++) {
    let b = drawing.getBaseAtOverallPosition(p);
    if (b) {
      bases.push(b);
    }
  }
  return bases;
}

export default basesInRange;
