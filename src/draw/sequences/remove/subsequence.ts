import type { Drawing } from 'Draw/Drawing';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import type { Base } from 'Draw/bases/Base';
import { atPosition } from 'Array/at';
import { removeBases } from './bases';

export type SubsequenceProps = {

  // the sequence to remove the subsequence from
  parent: Sequence;

  // the start and end positions of the subsequence
  start: number;
  end: number;
}

export function removeSubsequence(drawing: Drawing, props: SubsequenceProps) {
  let bs: Base[] = [];
  for (let p = props.start; p <= props.end; p++) {
    let b = atPosition(props.parent.bases, p);
    if (b) {
      bs.push(b);
    }
  }
  removeBases(drawing, bs);
}
