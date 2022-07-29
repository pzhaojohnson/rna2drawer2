import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import type { BezierCurve } from 'Draw/bonds/strung/BezierCurve';
import { pointOnBezierCurve } from 'Math/curves/pointOnBezierCurve';
import { directionOfBezierCurve } from 'Math/curves/directionOfBezierCurve';
import { displacePointFromCurve } from 'Draw/bonds/strung/displacePointFromCurve';

import { createTrianglePathString } from 'Draw/bonds/strung/createTrianglePathString';
import { createRectanglePathString } from 'Draw/bonds/strung/createRectanglePathString';

export type Positioning = {
  /**
   * The curve that the element is strung on.
   */
  curve: BezierCurve;

  /**
   * It is rather difficult to calculate the lengths of bezier curves,
   * so it is preferrable that curve length be retrieved using built-in
   * browser methods (such as the getTotalLength method of path elements)
   * and provided as input here.
   */
  curveLength: number;
};

export function repositionStrungElement(ele: StrungElement, p: Positioning) {
  let t = 0.5 + (ele.displacementFromCenter / p.curveLength);

  if (!Number.isFinite(t)) {
    // in case divided by a curve length of zero
    t = 0;
  } else if (t < 0) {
    t = 0;
  } else if (t > 1) {
    t = 1;
  }

  let a = directionOfBezierCurve(p.curve, t);

  let center = displacePointFromCurve({
    pointOnCurve: pointOnBezierCurve(p.curve, t),
    directionOfCurve: a,
    displacement: ele.displacementFromCurve,
  });

  if (ele.type == 'StrungText') {
    ele.text.center(center.x, center.y);
  }

  if (ele.type == 'StrungCircle') {
    ele.circle.attr({ 'cx': center.x, 'cy': center.y });
  }

  if (ele.type == 'StrungTriangle') {
    let d = createTrianglePathString({
      width: ele.width,
      height: ele.height,
      tailsHeight: ele.tailsHeight,
      rotation: (a + (Math.PI / 2)) + ele.rotation,
      center,
    });
    ele.path.plot(d);
  }

  if (ele.type == 'StrungRectangle') {
    let d = createRectanglePathString({
      width: ele.width,
      height: ele.height,
      borderRadius: ele.borderRadius,
      rotation: (a + (Math.PI / 2)) + ele.rotation,
      center,
    });
    ele.path.plot(d);
  }
}
