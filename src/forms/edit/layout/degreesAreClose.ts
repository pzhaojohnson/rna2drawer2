import { areClose } from 'Math/close';

export function degreesAreClose(d1: number, d2: number, places=3): boolean {
  while (d2 > d1) {
    d2 -= 360;
  }
  while (d2 < d1) {
    d2 += 360;
  }
  if (d2 - d1 > 180) {
    d2 -= 360;
  }
  return areClose(d1, d2, places);
}

export default degreesAreClose;
