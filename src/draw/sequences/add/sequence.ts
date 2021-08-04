import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { Sequence } from 'Draw/sequences/Sequence';
import { insertSubsequence } from './subsequence';

export type SequenceProps = {
  id: string;

  // a base will be created for each character
  characters: string;
}

export function appendSequence(drawing: Drawing, props: SequenceProps): Sequence {
  let seq = new Sequence(props.id);
  drawing.sequences.push(seq);
  seq.numberingAnchor = Sequence.recommendedDefaults.numberingAnchor;
  seq.numberingIncrement = Sequence.recommendedDefaults.numberingIncrement;
  insertSubsequence(drawing, {
    parent: seq,
    characters: props.characters,
    start: 1,
  });
  return seq;
}
