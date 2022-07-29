import * as SVG from '@svgdotjs/svg.js';
import { Point2D as Vector } from 'Math/points/Point';

/**
 * Properties shared among elements that are strung.
 */
export type Strung = {
  /**
   * Displacement along the curve away from the center point
   * of the curve. A positive value corresponds with going towards
   * the end point of the curve. A negative value corresponds with
   * going towards the start point of the curve.
   */
  displacementFromCenter: number;

  /**
   * Displacement away from the point on the curve specified by
   * the displacementFromCenter property. The point on the curve
   * is used as the origin of the coordinate system for this vector
   * and the direction of the curve at the point defines the X and Y
   * axes of the coordinate system. (The direction of the curve at
   * the point defines the positive Y axis direction and 90 degrees
   * clockwise defines the positive X axis direction.)
   */
  displacementFromCurve: Vector;
};

/**
 * A text element strung on a curve.
 */
export type StrungText = Strung & {
  type: 'StrungText';

  /**
   * The underlying SVG text element.
   */
  text: SVG.Text;
};

/**
 * A circle strung on a curve.
 */
export type StrungCircle = Strung & {
  type: 'StrungCircle';

  /**
   * The underlying SVG circle element.
   */
  circle: SVG.Circle;
};

/**
 * A triangle strung on a curve.
 */
export type StrungTriangle = Strung & {
  type: 'StrungTriangle';

  /**
   * The underlying SVG path element.
   */
  path: SVG.Path;

  width: number;
  height: number;

  /**
   * Used to turn the triangle into an arrowhead.
   * (Specifies the height of the tails of the arrowhead
   * or specifies a flat base when set to zero.)
   */
  tailsHeight: number;

  /**
   * The rotation of the triangle relative to the direction
   * of the curve.
   */
  rotation: number;
};

/**
 * A rectangle strung on a curve.
 */
export type StrungRectangle = Strung & {
  type: 'StrungRectangle';

  /**
   * The underlying SVG path element.
   */
  path: SVG.Path;

  width: number;
  height: number;

  /**
   * Specifies corner radii.
   */
  borderRadius: number;

  /**
   * The rotation of the rectangle relative to the direction
   * of the curve.
   */
  rotation: number;
};

export type StrungElement = (
  StrungText
  | StrungCircle
  | StrungTriangle
  | StrungRectangle
);
