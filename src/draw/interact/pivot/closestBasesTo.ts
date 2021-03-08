import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { distance2D as distance } from 'Math/distance';

interface Point {
  x: number;
  y: number;
}

/**
 * @param drawing
 * @param pt
 * @param n The maximum number of bases to return.
 * @returns
 */
export function closestBasesTo(drawing: Drawing, pt: Point, n=600): Base[] {
  if (n <= 0) {
    return [];
  }
  let basesAndDistances: [Base, number][] = [];
  drawing.forEachBase(b => {
    basesAndDistances.push([b, distance(b.xCenter, b.yCenter, pt.x, pt.y)]);
  });
  basesAndDistances.sort((a, b) => a[1] - b[1]);
  let closest: Base[] = [];
  basesAndDistances.slice(0, n).forEach(bd => closest.push(bd[0]));
  return closest;
}
