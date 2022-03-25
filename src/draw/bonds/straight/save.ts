import type { StraightBond } from './StraightBond';

export type SavableState = {
  className: 'StraightBond';
  lineId: string;
  baseId1: string;
  baseId2: string;
}

export function savableState(sb: StraightBond): SavableState {
  return {
    className: 'StraightBond',
    lineId: String(sb.line.id()),
    baseId1: sb.base1.id,
    baseId2: sb.base2.id,
  };
}
