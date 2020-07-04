import normalizeAngle from './normalizeAngle';

export function anglesAreClose(a1: number, a2: number, places=3): boolean {
  a1 = normalizeAngle(a1);
  a2 = normalizeAngle(a2);
  let diff = Math.abs(a1 - a2);
  a1 = Number.parseFloat(a1.toFixed(places));
  a2 = Number.parseFloat(a2.toFixed(places));
  diff = Number.parseFloat(diff.toFixed(places));
  let pi2 = Number.parseFloat((2 * Math.PI).toFixed(places));
  return diff == 0 || diff == pi2;
}

export default anglesAreClose;
