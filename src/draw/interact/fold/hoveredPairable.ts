import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import allPairables from './allPairables';
import IntegerRange from './IntegerRange';

/**
 * Returns null if no pairable is hovered.
 */
export function hoveredPairable(mode: FoldingMode): (IntegerRange | null) {
  let pairables = allPairables(mode);
  let hovered = null as (IntegerRange | null);
  pairables.forEach(p => {
    if (typeof mode.hovered == 'number' && p.contains(mode.hovered)) {
      if (!hovered || p.start > hovered.start) {
        hovered = p;
      }
    }
  });
  return hovered;
}

export default hoveredPairable;
