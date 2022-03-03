import { Point2D } from 'Math/points/Point';

// it is undefined what point is returned if the given array
// of points is empty
export function centroid2D(points: Point2D[]): Point2D {
  let sum = { x: 0, y: 0 };
  points.forEach(point => {
    sum.x += point.x;
    sum.y += point.y;
  });
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
}
