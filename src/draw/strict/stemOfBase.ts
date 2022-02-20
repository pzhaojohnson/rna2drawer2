import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { Stem } from 'Partners/Stem';
import { containingStem } from 'Partners/containing';

// returns the stem that the base is in or undefined if the base
// is not in a stem
export function stemOfBase(strictDrawing: StrictDrawing, base: Base): Stem | undefined {
  let seq = strictDrawing.layoutSequence();
  let p = seq.positionOf(base);

  let partners = strictDrawing.layoutPartners();
  return containingStem(partners, p);
}
