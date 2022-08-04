import type { StraightBond } from './StraightBond';
import { toSpecifications as strungElementsToSpecifications } from 'Draw/bonds/strung/save/toSpecification';

export type SavableState = {
  className: 'StraightBond';
  lineId: string;
  baseId1: string;
  baseId2: string;
  strungElements: ReturnType<typeof strungElementsToSpecifications>;
}

export function savableState(sb: StraightBond): SavableState {
  return {
    className: 'StraightBond',
    lineId: String(sb.line.id()),
    baseId1: sb.base1.id,
    baseId2: sb.base2.id,
    strungElements: strungElementsToSpecifications(sb.strungElements),
  };
}
