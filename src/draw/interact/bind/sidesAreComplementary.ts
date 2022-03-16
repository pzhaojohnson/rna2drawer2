import { Side } from './Side';
import { sidesOverlap } from './Side';
import { sideToMotif } from './sideToMotif';
import { motifsAreComplementary } from './motifsAreComplementary';
import { Options } from './motifsAreComplementary';

export { Options };

export function sidesAreComplementary(side1: Side, side2: Side, options?: Options): boolean {
  if (sidesOverlap(side1, side2)) {
    return false;
  }

  let motif1 = sideToMotif(side1);
  let motif2 = sideToMotif(side2);
  if (motif1 == undefined || motif2 == undefined) {
    return false;
  }

  return motifsAreComplementary(motif1, motif2, options);
}
