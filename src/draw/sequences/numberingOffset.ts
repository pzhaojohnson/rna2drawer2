import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';

// derives the numbering offset of the sequence from the existing numberings
// its bases have and returns undefined if the numbering offset cannot be derived
export function numberingOffset(seq: Sequence): number | undefined {
  let offsets = new Set<number>();

  seq.bases.forEach((b, i) => {
    let p = i + 1;
    if (b.numbering) {
      let n = Number.parseFloat(b.numbering.text.text());
      offsets.add(n - p);
    }
  });

  if (offsets.size == 0 || offsets.size > 1) {
    return undefined;
  }

  let o: number = offsets.values().next().value;

  if (!Number.isFinite(o) || !Number.isInteger(o)) {
    return undefined;
  }

  return o;
}
