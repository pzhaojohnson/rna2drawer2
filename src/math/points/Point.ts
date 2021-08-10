export type Point2D = { x: number, y: number };

export function isPoint2D(o: { x?: unknown, y?: unknown }): o is Point2D {
  return typeof o.x == 'number' && typeof o.y == 'number';
}
