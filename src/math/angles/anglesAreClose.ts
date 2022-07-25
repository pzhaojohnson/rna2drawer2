import { normalizeAngle } from 'Math/angles/normalizeAngle';
import { round } from 'Math/round';

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
  diff = round(diff, places);
  let pi2 = round(2 * Math.PI, places);
  return diff == 0 || diff == pi2;
}
