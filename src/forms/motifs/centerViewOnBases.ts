import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { centroid2D as centroid } from 'Math/points/centroid';
import { centerViewOn } from 'Draw/view';

/**
 * Does nothing for an empty array of bases.
 */
export function centerViewOnBases(strictDrawing: StrictDrawing, bases: Base[]) {
  if (bases.length == 0) {
    return;
  }

  let p = centroid(bases.map(base => base.center()));
  centerViewOn(strictDrawing.drawing, p);
}
