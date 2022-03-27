import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { displacement2D as displacement } from 'Math/points/displacement';
import { magnitude2D as magnitude } from 'Math/points/magnitude';

export function dotify(bond: StraightBond) {

  // in case the bond was hidden
  bond.line.attr('opacity', 1);

  // the distance between the two base centers
  let d = magnitude(displacement(bond.base1.center(), bond.base2.center()));

  // make total base padding slightly less than
  // the distance between the two base centers
  // to prevent the bond from becoming hidden
  let basePadding = d - 0.5;

  bond.basePadding1 = basePadding / 2;
  bond.basePadding2 = basePadding / 2;

  bond.line.attr('stroke-linecap', 'round');
}

export function isDot(bond: StraightBond): boolean {

  // the distance between the two base centers
  let d = magnitude(displacement(bond.base1.center(), bond.base2.center()));

  let basePadding = bond.basePadding1 + bond.basePadding2;

  return (
    bond.line.attr('stroke-linecap') == 'round'
    && Math.abs(d - basePadding) < 1
  );
}
