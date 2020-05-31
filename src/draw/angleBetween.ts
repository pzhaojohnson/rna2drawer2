export function angleBetween(x0: number, y0: number, x1: number, y1: number): number {
  let a = x1 - x0;
  let o = y1 - y0;
  return Math.atan2(o, a);
}

export default angleBetween;
