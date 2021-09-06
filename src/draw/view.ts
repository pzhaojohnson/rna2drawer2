import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { Point2D as Point } from 'Math/points/Point';

export function centerOfView(drawing: Drawing): Point {
  return {
    x: drawing.scrollLeft + (window.innerWidth / 2),
    y: drawing.scrollTop + (window.innerHeight / 2),
  };
}

export function centerViewOn(drawing: Drawing, p: Point) {
  drawing.scrollLeft = p.x - (window.innerWidth / 2);
  drawing.scrollTop = p.y - (window.innerHeight / 2);
}

// centers view on the center coordinates of the drawing
export function centerView(drawing: Drawing) {
  centerViewOn(drawing, {
    x: drawing.scrollWidth / 2,
    y: drawing.scrollHeight / 2,
  });
}
