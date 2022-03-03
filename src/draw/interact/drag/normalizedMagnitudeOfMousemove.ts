import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { magnitude2D as magnitudeOfVector } from 'Math/points/magnitude';
import { zoom } from 'Draw/zoom';

// returns the normalized magnitude of a mouse movement accounting for
// the width and height of bases in the strict drawing and the level of zoom
export function normalizedMagnitudeOfMousemove(strictDrawing: StrictDrawing, event: MouseEvent): number {
  let magnitude = magnitudeOfVector({ x: event.movementX, y: event.movementY });

  magnitude /= (strictDrawing.baseWidth + strictDrawing.baseHeight) / 2;

  let z = zoom(strictDrawing.drawing);
  if (z != undefined && Number.isFinite(z)) {
    magnitude /= z;
  }

  return magnitude;
}
