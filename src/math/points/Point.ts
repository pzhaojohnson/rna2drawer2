export type Point2D = { x: number, y: number };

export function isPoint2D(o: { x?: unknown, y?: unknown }): o is Point2D {
  return typeof o.x == 'number' && typeof o.y == 'number';
}

export function deepCopyPoint2D(point: Point2D): Point2D {
  return { ...point };
}
