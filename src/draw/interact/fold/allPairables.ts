import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import { selectedRange } from './selected';
import charactersInRange from './charactersInRange';
import areComplementary from './areComplementary';

export function allPairables(mode: FoldingMode): IntegerRange[] {
  let rSelected = selectedRange(mode);
  if (!rSelected) {
    return [];
  }
  let csSelected = charactersInRange(mode, rSelected);
  let pairables = [] as IntegerRange[];
  let drawing = mode.strictDrawing.drawing;
  for (let p5 = 1; p5 <= drawing.numBases; p5++) {
    let p3 = p5 + rSelected.size - 1;
    let r = new IntegerRange(p5, p3);
    let cs = charactersInRange(mode, r);
    let complementary = areComplementary(cs, csSelected);
    let overlapsSelected = r.overlapsWith(rSelected);
    if (complementary && !overlapsSelected) {
      pairables.push(r);
    }
  }
  return pairables;
}

export default allPairables;
