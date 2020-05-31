export function distanceBetween(x0: number, y0: number, x1: number, y1: number): number {
  return ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5;
}

export default distanceBetween;
