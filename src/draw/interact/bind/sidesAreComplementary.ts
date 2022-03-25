import { Side } from './Side';
import { sidesOverlap } from './Side';
import { charactersAreComplementary } from './charactersAreComplementary';
import { charactersAreGUTPair } from './charactersAreGUTPair';
import { round } from 'Math/round';

export type Options = {

  // the proportion of GU and GT pairs allowed in complementary sides
  // (interpreted as zero if left unspecified)
  allowedGUT?: number;

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
  let allowedGUT = options?.allowedGUT ?? 0;
  let GUT = true;
  let IUPAC = options?.IUPAC;
  let allowedMismatch = options?.allowedMismatch ?? 0;

  if (side1.length == 0 && side2.length == 0) {
    return true;
  } else if (side1.length != side2.length) {
    return false;
  } else if (sidesOverlap(side1, side2)) {
    return false;
  }

  let gutsAllowed = allowedGUT * side1.length;
  let mismatchesAllowed = allowedMismatch * side1.length;
  // account for possible floating point imprecision
  gutsAllowed = round(gutsAllowed, 6);
  mismatchesAllowed = round(mismatchesAllowed, 6);

  let guts = 0;
  let mismatches = 0;
  let i = 0;
  while (i < side1.length && mismatches <= mismatchesAllowed) {
    let c1 = side1[i].text.text().toUpperCase();
    let c2 = side2[side2.length - i - 1].text.text().toUpperCase();
    if (c1.length != 1 || c2.length != 1) {
      mismatches++;
    } else if (charactersAreGUTPair(c1, c2, { IUPAC })) {
      guts++;
    } else if (!charactersAreComplementary(c1, c2, { GUT, IUPAC })) {
      mismatches++;
    }
    i++;
  }
  return (
    guts <= gutsAllowed
    && mismatches <= mismatchesAllowed
  );
}
