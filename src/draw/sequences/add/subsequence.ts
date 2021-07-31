import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { Base } from 'Draw/bases/Base';

export type SubsequenceProps = {

  // the sequence to insert the subsequence into
  parent: Sequence;

  // a base will be created for each character
  characters: string;

  // the start position for the subsequence
  // (the position to insert the subsequence at)
  start: number;
}

export function insertSubsequence(drawing: Drawing, props: SubsequenceProps) {
  let bs: Base[] = [];
  for (let i = 0; i < props.characters.length; i++) {
    let c = props.characters.charAt(i);

    // creates text without a tspan
    // (makes the SVG document a bit neater)
    let t = drawing.svg.text(() => {});
    t.plain(c);

    bs.push(new Base(t));
  }
  props.parent.bases.splice(props.start, 0, ...bs);
}
