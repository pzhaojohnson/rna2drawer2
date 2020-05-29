import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
import charactersInRange from './charactersInRange';
import areComplementary from './areComplementary';

export interface Complement {
  position5: number;
  position3: number;
}

/**
 * Returns null if nothing is selected or no complement is hovered.
 */
export function hoveredComplement(mode: FoldingMode): (Complement | null) {
  if (!mode.hovered || !mode.selected) {
    return null;
  }
  let selected = charactersInRange(mode, {
    position5: mode.minSelected,
    position3: mode.maxSelected,
  });
  for (let i = 0; i < mode.selectedLength; i++) {
    let p5 = mode.hovered - i;
    let p3 = p5 + selected.length - 1;
    let r = {
      position5: p5,
      position3: p3,
    };
    let cs = charactersInRange(mode, r);
    let complementary = areComplementary(cs, selected);
    let overlapsSelected = mode.overlapsSelected(p5, p3);
    if (complementary && !overlapsSelected) {
      return r;
    }
  }
  return null;
}

export default hoveredComplement;
