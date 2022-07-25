import { normalizeAngle } from 'Math/angles/normalizeAngle';

export type Options = { places: number };

/**
 * Returns true if the two angles are equal when normalized and rounded
 * to the specified number of decimal places and false otherwise.
 */
export function anglesAreClose(a1: number, a2: number, options?: Options): boolean {
  let places = options?.places ?? 3;

  a1 = normalizeAngle(a1);
  a2 = normalizeAngle(a2);
  let diff = Math.abs(a1 - a2);
  diff = Number.parseFloat(diff.toFixed(places));
  let pi2 = Number.parseFloat((2 * Math.PI).toFixed(places));
  return diff == 0 || diff == pi2;
}
