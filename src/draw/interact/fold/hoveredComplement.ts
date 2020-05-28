import { FoldingModeInterface as FoldingMode } from './FoldingModeInterface';
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
  let overall = mode.strictDrawing.drawing.overallCharacters;
  let selected = overall.substring(
    mode.minSelected - 1,
    mode.maxSelected,
  );
  for (let i = 0; i < mode.selectedLength; i++) {
    let p5 = mode.hovered - i;
    let p3 = p5 + selected.length - 1;
    let complementary = areComplementary(selected, overall.substring(p5 - 1, p3));
    let overlapsSelected = mode.overlapsSelected(p5, p3);
    if (complementary && !overlapsSelected) {
      return {
        position5: p5,
        position3: p3,
      };
    }
  }
  return null;
}

export default hoveredComplement;
