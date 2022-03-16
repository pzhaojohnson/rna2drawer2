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
 * This function is not case-sensitive.
 *
 * The two motifs must have the same length to be complementary.
 *
 * It is vacuously true that two motifs of length zero are complementary.
 */
export function motifsAreComplementary(motif1: string, motif2: string, options?: Options): boolean {
  let GUT = options?.GUT;
  let IUPAC = options?.IUPAC;
  let mismatchesAllowed = options?.mismatchesAllowed ?? 0;

  if (motif1.length == 0 && motif2.length == 0) {
    return true;
  } else if (motif1.length != motif2.length) {
    return false;
  }

  motif1 = motif1.toUpperCase();
  motif2 = motif2.toUpperCase();

  let mismatches = 0;
  for (let i = 0; i < motif1.length; i++) {
    let c1 = motif1.charAt(i);
    let c2 = motif2.charAt(motif2.length - i - 1);
    if (!charactersAreComplementary(c1, c2, { GUT, IUPAC })) {
      mismatches++;
    }
  }
  return mismatches <= mismatchesAllowed;
}
