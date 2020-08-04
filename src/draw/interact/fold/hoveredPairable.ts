import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import IntegerRange from './IntegerRange';
import { selectedRange } from './selected';
import isPairable from './isPairable';

/**
 * Returns null if no pairable is hovered.
 */
export function hoveredPairable(mode: FoldingMode): (IntegerRange | null) {
  if (!mode.hovered) {
    return null;
  }
  let rSelected = selectedRange(mode);
  if (!rSelected) {
    return null;
  }
  for (let i = 0; i < rSelected.size; i++) {
    let p5 = mode.hovered - i;
    let p3 = p5 + rSelected.size - 1;
    let r = new IntegerRange(p5, p3);
    if (isPairable(mode, r)) {
      return r;
    }
  }
  return null;
}

export default hoveredPairable;
