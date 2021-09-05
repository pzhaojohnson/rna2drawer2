import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { parseNumber } from 'Parse/svg/number';

function isFiniteNumber(v: unknown): v is number {
  return typeof v == 'number' && Number.isFinite(v);
}

// Calculates the current zoom of the drawing where 1 corresponds to 100%.
// Returns undefined if unable to calculate the current zoom.
export function zoom(drawing: Drawing): number | undefined {
  let width = parseNumber(drawing.svg.attr('width'));
  if (!width) {
    console.error(`Unable to parse the width of the drawing: ${drawing.svg.attr('width')}.`);
  } else {
    let viewbox = drawing.svg.viewbox();
    let z = width.convert('px').valueOf() / viewbox.width;
    if (isFiniteNumber(z)) {
      return z;
    } else {
      console.error(`Calculated value is not a finite number: ${z}.`);
    }
  }
}

export function setZoom(drawing: Drawing, z: number) {
  if (!Number.isFinite(z) || z <= 0) {
    console.error(`Cannot set zoom to ${z}. Zoom must be a finite positive number.`);
  } else {
    let viewbox = drawing.svg.viewbox();
    if (!isFiniteNumber(viewbox.width)) {
      console.error(`Viewbox width is not a finite number: ${viewbox.width}.`);
    } else if (!isFiniteNumber(viewbox.height)) {
      console.error(`Viewbox height is not a finite number: ${viewbox.height}.`);
    } else {
      drawing.svg.attr({
        'width': z * viewbox.width,
        'height': z * viewbox.height,
      });
    }
  }
}
