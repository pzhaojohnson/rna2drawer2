import { StraightBondInterface as StraightBond } from './StraightBondInterface';

export function bringToFront(sb: StraightBond) {
  sb.line.front();
}

export function sendToBack(sb: StraightBond) {
  sb.line.back();
}
