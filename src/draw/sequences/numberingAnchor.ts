import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { numberingIncrement } from 'Draw/sequences/numberingIncrement';

// derives the numbering anchor of the sequence from the existing numberings
// its bases have and returns undefined if the numbering anchor cannot be derived
export function numberingAnchor(seq: Sequence): number | undefined {
  if (numberingIncrement(seq) == undefined) {
    return undefined;
  }

  // the index of the first numbered base
  let i = seq.bases.findIndex(b => b.numbering);

  // should always be at least zero
  // if the numbering increment is defined
  if (i < 0) {
    return undefined;
  } else {
    return i + 1;
  }
}
