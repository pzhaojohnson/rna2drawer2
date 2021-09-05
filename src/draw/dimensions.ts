import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { zoom } from 'Draw/zoom';

export function width(drawing: Drawing): number {
  return drawing.svg.viewbox().width;
}

export function height(drawing: Drawing): number {
  return drawing.svg.viewbox().height;
}

export type Dimensions = {
  width: number;
  height: number;
}

// resizes the drawing while trying to maintain its zoom
export function resize(drawing: Drawing, dims: Dimensions) {
  if (!Number.isFinite(dims.width) || dims.width < 0) {
    console.error(`Cannot set width to ${dims.width}. Width must be a finite nonnegative number.`);
    return;
  }
  if (!Number.isFinite(dims.height) || dims.height < 0) {
    console.error(`Cannot set height to ${dims.height}. Height must be a finite nonnegative number.`);
    return;
  }

  // remember zoom
  let z = zoom(drawing);

  // change dimensions
  drawing.svg.viewbox(0, 0, dims.width, dims.height);

  // maintain zoom if able to
  if (typeof z == 'number') {
    drawing.svg.attr({
      'width': z * dims.width,
      'height': z * dims.height,
    });
  } else {
    console.error(`Unable to retrieve the zoom of the drawing. Unable to maintain zoom.`);
  }
}
