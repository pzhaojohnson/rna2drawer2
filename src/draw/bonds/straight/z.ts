import type { StraightBond } from './StraightBond';

export function bringToFront(sb: StraightBond) {
  sb.line.front();
}

export function sendToBack(sb: StraightBond) {
  sb.line.back();
}
