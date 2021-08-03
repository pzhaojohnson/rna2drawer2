import { SequenceInterface as Sequence } from './SequenceInterface';
import {
  SavableState as SavableBaseState,
  savableState as savableBaseState,
} from 'Draw/bases/save';

export type SavableState = {
  className: 'Sequence';
  id: string;
  bases: SavableBaseState[];
  numberingOffset: number;
  numberingAnchor: number;
  numberingIncrement: number;
}

export function savableState(seq: Sequence): SavableState {
  let saved: SavableState = {
    className: 'Sequence',
    id: seq.id,
    bases: [],
    numberingOffset: seq.numberingOffset,
    numberingAnchor: seq.numberingAnchor,
    numberingIncrement: seq.numberingIncrement,
  };
  seq.bases.forEach(b => {
    saved.bases.push(savableBaseState(b));
  });
  return saved;
}
