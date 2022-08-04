import type { QuadraticBezierBond } from './QuadraticBezierBond';
import { toSpecifications as strungElementsToSpecifications } from 'Draw/bonds/strung/save/toSpecification';

export type SavableState = {
  className: 'QuadraticBezierBond';
  pathId: string;
  baseId1: string;
  baseId2: string;
  strungElements: ReturnType<typeof strungElementsToSpecifications>;
}

export function savableState(bond: QuadraticBezierBond): SavableState {
  return {
    className: 'QuadraticBezierBond',
    pathId: String(bond.path.id()),
    baseId1: bond.base1.id,
    baseId2: bond.base2.id,
    strungElements: strungElementsToSpecifications(bond.strungElements),
  };
}
