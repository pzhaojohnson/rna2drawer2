import { normalizeAngle } from 'Math/angles/normalize';

// returns true if the angles 1 and 2 are within the specified angular distance
export function anglesAreWithin(angle1: number, angle2: number, angularDistance: number): boolean {
  angle2 = normalizeAngle(angle2, angle1);
  return (
    angle2 - angle1 <= angularDistance
    || angle2 - angle1 >= (2 * Math.PI) - angularDistance
  );
}
