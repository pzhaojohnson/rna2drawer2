export type Point2D = { x: number, y: number };

export function isPoint2D(v: any): v is Point2D {
  return (
    typeof v == 'object'
    && v !== null
    && typeof v.x == 'number'
    && typeof v.y == 'number'
  );
}

export function deepCopyPoint2D(point: Point2D): Point2D {
  return { ...point };
}
