import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { removePrimaryBondById } from 'Draw/bonds/straight/remove';

/**
 * Removes the primary bonds from the strict drawing.
 */
export function removePrimaryBonds(strictDrawing: StrictDrawing, primaryBonds: PrimaryBond[]) {
  let ids = primaryBonds.map(primaryBond => primaryBond.id);
  ids.forEach(id => {
    removePrimaryBondById(strictDrawing.drawing, id);
  });
}
