import { charactersMatch } from './charactersMatch';
import { round } from 'Math/round';

export type Options = {

  // whether to match Us with Ts
  UT?: boolean;

  // whether to match based on IUPAC single letter codes
  IUPAC?: boolean;

  // the proportion of mismatched pairs allowed before two motifs no longer match
  // (precise up to at least two decimal places and interpreted as zero if left unspecified)
  allowedMismatch?: number;
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
  let allowedMismatch = options?.allowedMismatch ?? 0;

  if (motif1.length == 0 && motif2.length == 0) {
    return true;
  } else if (motif1.length != motif2.length) {
    return false;
  }

  motif1 = motif1.toUpperCase();
  motif2 = motif2.toUpperCase();

  let mismatchesAllowed = allowedMismatch * motif1.length;
  // account for possible floating point imprecision
  mismatchesAllowed = round(mismatchesAllowed, 6);

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
