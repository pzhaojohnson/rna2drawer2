import { charactersMatch } from './charactersMatch';

export type Options = {

  // whether to match Us with Ts
  UT?: boolean;

  // whether to match based on IUPAC single letter codes
  IUPAC?: boolean;

  // the number of mismatched characters allowed before two motifs no longer match
  // (is interpreted as zero if left unspecified)
  mismatchesAllowed?: number;
};

/**
 * Matching is not case-sensitive.
 *
 * The motifs must be the same length to match.
 *
 * It is vacuously true that two motifs of length zero match.
 */
export function motifsMatch(motif1: string, motif2: string, options?: Options): boolean {
  let UT = options?.UT;
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
    let c2 = motif2.charAt(i);
    if (!charactersMatch(c1, c2, { UT, IUPAC })) {
      mismatches++;
    }
  }
  return mismatches <= mismatchesAllowed;
}
