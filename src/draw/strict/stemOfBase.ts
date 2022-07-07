import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { Base } from 'Draw/bases/Base';
import { Stem } from 'Partners/stems/Stem';
import { containingStem } from 'Partners/containing';

// returns the stem that the base is in or undefined if the base
// is not in a stem
export function stemOfBase(strictDrawing: StrictDrawing, base: Base): Stem | undefined {
  let seq = strictDrawing.layoutSequence();
  let p = seq.positionOf(base);

  let partners = strictDrawing.layoutPartners();
  return containingStem(partners, p);
}
