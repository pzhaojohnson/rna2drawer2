import { QuadraticBezierBondInterface as QuadraticBezierBond } from './QuadraticBezierBondInterface';

export function bringToFront(bond: QuadraticBezierBond) {
  bond.path.front();
}

export function sendToBack(bond: QuadraticBezierBond) {
  bond.path.back();
}
