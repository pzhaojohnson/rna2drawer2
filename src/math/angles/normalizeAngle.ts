/**
 * Returns the given angle normalized to be within
 * the range [minAngle, minAngle + (2 * Math.PI)).
 */
export function normalizeAngle(angle: number, minAngle=0): number {
  while (angle < minAngle) {
    angle += 2 * Math.PI;
  }
  while (angle >= minAngle + (2 * Math.PI)) {
    angle -= 2 * Math.PI;
  }
  return angle;
}
