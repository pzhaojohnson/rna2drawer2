import { normalizeAngle } from 'Math/angles/normalizeAngle';

import { isNullish } from 'Utilities/isNullish';

export type Nullish = null | undefined;

export type NormalizeOptions = {
  /**
   * The minimum angle to normalize angles above.
   *
   * (Angles will be normalized such that they are greater than or equal
   * to the angle floor and less than 2 * Math.PI above the angle
   * floor.)
   *
   * Defaults to zero if left unspecified.
   */
  angleFloor?: number;
};

/**
 * Works with angles in radians.
 */
export class AnglesWrapper {
  /**
   * The wrapped angles.
   */
  angles: (number | Nullish)[];

  constructor(angles: (number | Nullish)[]) {
    this.angles = angles;
  }

  /**
   * Returns a new angles wrapper of the normalized angles.
   */
  normalize(options?: NormalizeOptions): AnglesWrapper {
    let angleFloor = options?.angleFloor ?? 0;

    return new AnglesWrapper(
      this.angles.map(angle => {
        if (isNullish(angle)) {
          return angle;
        } else {
          return normalizeAngle(angle, angleFloor);
        }
      })
    );
  }
}
