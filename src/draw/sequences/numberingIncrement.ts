import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

// derives the numbering increment of the sequence from the existing numberings
// its bases have and returns undefined if the numbering increment cannot be derived
export function numberingIncrement(seq: Sequence): number | undefined {
  let no = numberingOffset(seq);

  // the numbering offset must be defined for the numbering increment
  // to be defined
  if (typeof no != 'number') {
    return undefined;
  }

  let numberedPositions: number[] = [];
  seq.bases.forEach((b, i) => {
    let p = i + 1;
    if (b.numbering) {
      numberedPositions.push(p);
    }
  });

  if (numberedPositions.length < 2) {
    return undefined;
  }

  let increments = new Set<number>();
  for (let i = 0; i < numberedPositions.length - 1; i++) {
    increments.add(numberedPositions[i + 1] - numberedPositions[i]);
  }

  if (increments.size != 1) {
    return undefined;
  }

  let ni: number = increments.values().next().value;

  if (numberedPositions[0] - ni >= 1) {
    // leading bases are missing numberings
    return undefined;
  } else if (numberedPositions[numberedPositions.length - 1] + ni <= seq.length) {
    // trailing bases are missing numberings
    return undefined;
  }

  return ni;
}
