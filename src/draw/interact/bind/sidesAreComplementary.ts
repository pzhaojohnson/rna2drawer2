import { Side } from './Side';
import { sidesOverlap } from './Side';
import { charactersAreComplementary } from './charactersAreComplementary';

export type Options = {

  // whether to consider Gs complementary with Us and Ts
  GUT?: boolean;

  // whether to allow complements based on IUPAC single letter codes
  IUPAC?: boolean;

  // the number of mismatched characters allowed before two motifs are no longer
  // considered complementary
  // (interpreted as zero if left unspecified)
  mismatchesAllowed?: number;
};

/**
 * It is vacuously true that two sides both of length zero are complementary.
 */
export function sidesAreComplementary(side1: Side, side2: Side, options?: Options): boolean {
  let GUT = options?.GUT;
  let IUPAC = options?.IUPAC;
  let mismatchesAllowed = options?.mismatchesAllowed ?? 0;

  if (side1.length == 0 && side2.length == 0) {
    return true;
  } else if (side1.length != side2.length) {
    return false;
  } else if (sidesOverlap(side1, side2)) {
    return false;
  }

  let mismatches = 0;
  let i = 0;
  while (i < side1.length && mismatches <= mismatchesAllowed) {
    let c1 = side1[i].text.text().toUpperCase();
    let c2 = side2[side2.length - i - 1].text.text().toUpperCase();
    if (c1.length != 1 || c2.length != 1) {
      mismatches++;
    } else if (!charactersAreComplementary(c1, c2, { GUT, IUPAC })) {
      mismatches++;
    }
    i++;
  }
  return mismatches <= mismatchesAllowed;
}
