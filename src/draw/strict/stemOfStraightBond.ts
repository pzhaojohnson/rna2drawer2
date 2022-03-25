import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { Stem } from 'Partners/Stem';
import { containingStem } from 'Partners/containing';
import { stemsAreEqual } from 'Partners/stemsAreEqual';

// Returns the stem that a straight bond is in or undefined if the straight bond
// is not in a stem.
//
// For a straight bond to be in a stem, both bases 1 and 2 of the straight bond
// must be in the same stem.
export function stemOfStraightBond(strictDrawing: StrictDrawing, bond: StraightBond): Stem | undefined {
  let seq = strictDrawing.layoutSequence();
  let p1 = seq.positionOf(bond.base1);
  let p2 = seq.positionOf(bond.base2);

  let partners = strictDrawing.layoutPartners();
  let stem1 = containingStem(partners, p1);
  let stem2 = containingStem(partners, p2);

  if (!stem1 || !stem2) {
    return undefined;
  } else if (stemsAreEqual(stem1, stem2)) {
    return stem1;
  } else {
    return undefined;
  }
}
