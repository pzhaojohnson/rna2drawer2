import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { Side } from './Side';

export type Bond = (
  PrimaryBond
  | SecondaryBond
  | TertiaryBond
);

// returns true if the bond binds at least one of the bases in the side
export function bondBindsSide(bond: Bond, side: Side): boolean {
  return side.some(base => bond.binds(base));
}
