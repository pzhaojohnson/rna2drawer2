export function pixelsToPoints(pixels: number): number {
  return (72 / 96) * pixels;
}

export function pointsToPixels(points: number): number {
  return (96 / 72) * points;
}

export function pixelsToInches(pixels: number): number {
  return pixels / 96;
}

export function pointsToInches(points: number): number {
  return points / 72;
}
