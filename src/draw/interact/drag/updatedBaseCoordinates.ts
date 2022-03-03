import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { StrictLayoutSpecification } from './StrictLayoutSpecification';
import { createStrictLayout } from './createStrictLayout';
import { Point2D as Point } from 'Math/points/Point';
import { centerOfOutermostLoop } from './centerOfOutermostLoop';
import { traverseOutermostLoopDownstream } from 'Partners/traverseLoopDownstream';
import { centroid2D as centroid } from './centroid';

// the underlying function
import { updatedBaseCoordinates as _updatedBaseCoordinates } from 'Draw/edit/updateLayout';

export type Options = {

  // the strict drawing to return updated base coordinates for
  strictDrawing: StrictDrawing;

  // specifies the updated base coordinates
  strictLayoutSpecification: StrictLayoutSpecification;

  // whether the updated base coordinates should account for the padding
  // of the drawing being updated as well
  updatePadding: boolean;
};

export type BaseCoordinates = {
  center: Point;
};

// returns undefined if unable to calculate updated base coordinates
export function updatedBaseCoordinates(options: Options): BaseCoordinates[] | undefined {
  let strictLayout = createStrictLayout(options.strictLayoutSpecification);
  if (!strictLayout) {
    console.error('Unable to create strict layout from specification.');
    return undefined;
  }

  let baseCoordinates = _updatedBaseCoordinates(
    options.strictDrawing,
    strictLayout,
    { updatePadding: options.updatePadding },
  );

  // maintain the center of the outermost loop in the updated base coordinates
  let center = centerOfOutermostLoop(options.strictDrawing);
  let traversed = traverseOutermostLoopDownstream(options.strictLayoutSpecification.partners);
  let updatedCenter = centroid(traversed.positions.map(p => baseCoordinates[p - 1].center));
  let shift = {
    x: updatedCenter.x - center.x,
    y: updatedCenter.y - center.y,
  };
  // check for finiteness just to be safe
  if (Number.isFinite(shift.x) && Number.isFinite(shift.y)) {
    baseCoordinates.forEach(bcs => {
      bcs.center.x -= shift.x;
      bcs.center.y -= shift.y;
    });
  }

  return baseCoordinates;
}
