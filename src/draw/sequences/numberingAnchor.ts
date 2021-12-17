import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';

// derives the numbering anchor of the sequence from the existing numberings
// its bases have and returns undefined if the numbering anchor cannot be derived
export function numberingAnchor(seq: Sequence): number | undefined {
  if (numberingOffset(seq) == undefined) {
    return undefined;
  }

  let numberedPositions: number[] = [];
  seq.bases.forEach((b, i) => {
    let p = i + 1;
    if (b.numbering) {
      numberedPositions.push(p);
    }
  });

  if (numberedPositions.length == 0) {
    // should always have a length of at least one if the numbering offset
    // is defined but check just in case
    return undefined;
  } else if (numberedPositions.length == 1) {
    return numberedPositions[0];
  } else if (numberingIncrement(seq) == undefined) {
    return undefined;
  } else {
    return numberedPositions[0];
  }
}
