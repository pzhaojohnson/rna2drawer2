export type Nullish = null | undefined;

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
}
