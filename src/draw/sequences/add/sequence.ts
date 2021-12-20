import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { Sequence } from 'Draw/sequences/Sequence';
import { insertSubsequence } from './subsequence';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';

export type SequenceProps = {
  id: string;

  // a base will be created for each character
  characters: string;
}

export function appendSequence(drawing: Drawing, props: SequenceProps): Sequence {
  let seq = new Sequence(props.id);
  drawing.sequences.push(seq);
  insertSubsequence(drawing, {
    parent: seq,
    characters: props.characters,
    start: 1,
  });
  let defaultNumbering = { offset: 0, increment: 20, anchor: 0 };
  updateBaseNumberings(seq, defaultNumbering);
  return seq;
}
