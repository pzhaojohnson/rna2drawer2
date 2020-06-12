export function pointsToPixels(points: number): number {
  return (96 / 72) * points;
}

export default pointsToPixels;
