import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import charactersInRange from './charactersInRange';
import areComplementary from './areComplementary';
import { selectedRange } from './selected';
import IntegerRange from './IntegerRange';

/**
 * Returns null if nothing is selected or no complement is hovered.
 */
export function hoveredComplement(mode: FoldingMode): (IntegerRange | null) {
  if (!mode.hovered) {
    return null;
  }
  let rSelected = selectedRange(mode);
  if (!rSelected) {
    return null;
  }
  let csSelected = charactersInRange(mode, rSelected);
  for (let i = 0; i < rSelected.size; i++) {
    let p5 = mode.hovered - i;
    let p3 = p5 + rSelected.size - 1;
    let r = new IntegerRange(p5, p3);
    let cs = charactersInRange(mode, r);
    let complementary = areComplementary(cs, csSelected);
    let overlapsSelected = r.overlapsWith(rSelected);
    if (complementary && !overlapsSelected) {
      return r;
    }
  }
  return null;
}

export default hoveredComplement;
