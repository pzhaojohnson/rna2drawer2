import { Side } from './Side';
import { sidesOverlap } from './Side';
import { charactersAreComplementary } from './charactersAreComplementary';
import { round } from 'Math/round';

export type Options = {

  // whether to consider Gs complementary with Us and Ts
  GUT?: boolean;

  // whether to allow complements based on IUPAC single letter codes
  IUPAC?: boolean;

  // the proportion of mismatched pairs allowed before two sides are not
  // considered complementary
  // (interpreted as zero if left unspecified)
  allowedMismatch?: number;
};

/**
 * It is vacuously true that two sides both of length zero are complementary.
 */
export function sidesAreComplementary(side1: Side, side2: Side, options?: Options): boolean {
  let GUT = options?.GUT;
  let IUPAC = options?.IUPAC;
  let allowedMismatch = options?.allowedMismatch ?? 0;

  if (side1.length == 0 && side2.length == 0) {
    return true;
  } else if (side1.length != side2.length) {
    return false;
  } else if (sidesOverlap(side1, side2)) {
    return false;
  }

  let mismatchesAllowed = allowedMismatch * side1.length;
  // account for possible floating point imprecision
  mismatchesAllowed = round(mismatchesAllowed, 6);

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
