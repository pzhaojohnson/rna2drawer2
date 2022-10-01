import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

export type Bond = StraightBond | QuadraticBezierBond;

export function isBond(value: unknown): value is Bond {
  return (
    value instanceof StraightBond
    || value instanceof QuadraticBezierBond
  );
}
