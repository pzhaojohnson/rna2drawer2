import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
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
