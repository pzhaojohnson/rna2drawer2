import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { removeTertiaryBondById } from 'Draw/bonds/curved/remove';

/**
 * Removes the tertiary bonds from the strict drawing.
 */
export function removeTertiaryBonds(strictDrawing: StrictDrawing, tertiaryBonds: TertiaryBond[]) {
  let ids = tertiaryBonds.map(tertiaryBond => tertiaryBond.id);
  ids.forEach(id => {
    removeTertiaryBondById(strictDrawing.drawing, id);
  });
}
