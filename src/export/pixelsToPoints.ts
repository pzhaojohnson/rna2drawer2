export function pixelsToPoints(pixels: number): number {
  return (72 / 96) * pixels;
}

export default pixelsToPoints;
