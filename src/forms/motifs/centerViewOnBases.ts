import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { Point2D as Point } from 'Math/points/Point';
import { centroid2D as centroid } from 'Math/points/centroid';
import { displacement2D as displacement } from 'Math/points/displacement';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function centerOfRect(rect: Rect): Point {
  return {
    x: rect.x + (rect.width / 2),
    y: rect.y + (rect.height / 2),
  };
}

/**
 * Does nothing for an empty array of bases.
 */
export function centerViewOnBases(strictDrawing: StrictDrawing, bases: Base[]) {
  if (bases.length == 0) {
    return;
  }

  let textClientRects = bases.map(base => base.text.node.getBoundingClientRect());
  let textClientCenters = textClientRects.map(rect => centerOfRect(rect));
  let textClientCentroid = centroid(textClientCenters);

  let drawingClientRect = strictDrawing.drawing.svgContainer.getBoundingClientRect();
  let drawingClientCenter = centerOfRect(drawingClientRect);

  let shift = displacement(drawingClientCenter, textClientCentroid);
  strictDrawing.drawing.svgContainer.scrollLeft += shift.x;
  strictDrawing.drawing.svgContainer.scrollTop += shift.y;
}
