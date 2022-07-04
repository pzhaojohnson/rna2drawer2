import type { Sequence } from './Sequence';
import {
  SavableState as SavableBaseState,
  savableState as savableBaseState,
} from 'Draw/bases/save';

export type SavableState = {
  className: 'Sequence';
  id: string;
  bases: SavableBaseState[];
}

export function savableState(seq: Sequence): SavableState {
  let saved: SavableState = {
    className: 'Sequence',
    id: seq.id,
    bases: [],
  };
  seq.bases.forEach(b => {
    saved.bases.push(savableBaseState(b));
  });
  return saved;
}
