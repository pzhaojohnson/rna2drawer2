import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { Base } from 'Draw/bases/Base';

/**
 * Returns an array of bases containing the given two bases and the bases
 * in between the given two bases in the layout sequence of the strict drawing.
 *
 * Bases are returned in ascending order by position in the layout sequence
 * of the strict drawing. (The given two bases do not need to be input in
 * ascending order to this function.)
 *
 * If the given two bases are actually the same base, an array containing
 * just the single base is returned.
 *
 * If either of the given two bases is not present in the strict drawing,
 * then an empty array is returned.
 */
export function spannedBases(strictDrawing: StrictDrawing, base1: Base, base2: Base): Base[] {
  if (base1 == base2) {
    return [base1];
  }

  let sequence = strictDrawing.layoutSequence();
  let p1 = sequence.positionOf(base1);
  let p2 = sequence.positionOf(base2);

  if (p1 == 0 || p2 == 0) {
    return []; // at least one of the bases is missing
  }

  return sequence.bases.slice(
    Math.min(p1, p2) - 1,
    Math.max(p1, p2),
  );
}
