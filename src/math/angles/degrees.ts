export function radiansToDegrees(radians: number): number {
  return 360 * radians / (2 * Math.PI);
}

export function degreesToRadians(degrees: number): number {
  return (2 * Math.PI) * degrees / 360;
}
