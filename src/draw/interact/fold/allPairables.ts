import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import { selectedRange } from './selected';
import isPairable from './isPairable';

export function allPairables(mode: FoldingMode): IntegerRange[] {
  let rSelected = selectedRange(mode);
  if (!rSelected) {
    return [];
  }
  let pairables = [] as IntegerRange[];
  let drawing = mode.strictDrawing.drawing;
  for (let p5 = 1; p5 <= drawing.numBases; p5++) {
    let p3 = p5 + rSelected.size - 1;
    let r = new IntegerRange(p5, p3);
    if (isPairable(mode, r)) {
      pairables.push(r);
    }
  }
  return pairables;
}

export default allPairables;
