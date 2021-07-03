import {
  StraightBondInterface,
  StraightBondSavableState as SavableState,
} from './StraightBondInterface';

export function savableState(sb: StraightBondInterface): SavableState {
  return {
    className: 'StraightBond',
    lineId: String(sb.line.id()),
    baseId1: sb.base1.id,
    baseId2: sb.base2.id,
  };
}
