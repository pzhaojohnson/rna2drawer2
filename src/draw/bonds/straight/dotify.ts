import type { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { displacement2D as displacement } from 'Math/points/displacement';
import { magnitude2D as magnitude } from 'Math/points/magnitude';
import { interpretNumber } from 'Draw/svg/interpretNumber';

function lineLengthIsCloseToZero(bond: StraightBond): boolean {

  // the distance between the two base centers
  let d = magnitude(displacement(bond.base1.center(), bond.base2.center()));

  let basePadding = bond.basePadding1 + bond.basePadding2;

  return Math.abs(d - basePadding) < 0.1;
}

function makeLineLengthCloseToZero(bond: StraightBond) {

  // the distance between the two base centers
  let d = magnitude(displacement(bond.base1.center(), bond.base2.center()));

  // make total base padding slightly less than
  // the distance between the two base centers
  // to prevent the bond from becoming hidden
  let basePadding = d - 0.05;

  bond.basePadding1 = basePadding / 2;
  bond.basePadding2 = basePadding / 2;
}

function unhide(bond: StraightBond) {
  let opacity: unknown = bond.line.attr('opacity');
  if (interpretNumber(opacity)?.valueOf() == 0) {
    bond.line.attr('opacity', 1);
  }
}

export function dotify(bond: StraightBond) {
  unhide(bond);
  makeLineLengthCloseToZero(bond);
  bond.line.attr('stroke-linecap', 'round');
}

export function squarify(bond: StraightBond) {
  unhide(bond);
  makeLineLengthCloseToZero(bond);
  bond.line.attr('stroke-linecap', 'square');
}

export function isDot(bond: StraightBond): boolean {
  return (
    bond.line.attr('stroke-linecap') == 'round'
    && lineLengthIsCloseToZero(bond)
  );
}

export function isSquare(bond: StraightBond): boolean {
  return (
    bond.line.attr('stroke-linecap') == 'square'
    && lineLengthIsCloseToZero(bond)
  );
}
