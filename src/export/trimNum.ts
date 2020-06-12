/**
 * Trims the number to the specified number of decimal places.
 */
export function trimNum(n: number, places: number): number {
  let trimmed = n.toFixed(places);
  return Number(trimmed);
}

export default trimNum;
