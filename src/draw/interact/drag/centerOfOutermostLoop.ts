import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { Point2D as Point } from 'Math/points/Point';
import { centroid2D as centroid } from './centroid';
import { traverseOutermostLoopDownstream } from 'Partners/traverseLoopDownstream';

// it is undefined what point is returned if the drawing is empty
export function centerOfOutermostLoop(strictDrawing: StrictDrawing): Point {
  let partners = strictDrawing.layoutPartners();
  let traversed = traverseOutermostLoopDownstream(partners);

  let baseCenters: Point[] = [];
  let seq = strictDrawing.layoutSequence();
  traversed.positions.forEach(p => {
    let b = seq.atPosition(p);
    if (b) {
      baseCenters.push({ x: b.xCenter, y: b.yCenter });
    }
  });
  return centroid(baseCenters);
}
