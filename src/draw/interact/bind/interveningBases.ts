import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';

// returns the bases between the two given bases in the layout sequence
// of the strict drawing
export function interveningBases(strictDrawing: StrictDrawing, base1: Base, base2: Base): Base[] {
  let sequence = strictDrawing.layoutSequence();
  let p1 = sequence.positionOf(base1);
  let p2 = sequence.positionOf(base2);
  return sequence.bases.slice(
    Math.min(p1, p2),
    Math.max(p1, p2) - 1,
  );
}
