/**
 * The places argument specifies the number of decimal places
 * to trim the number to.
 */
export function trimNum(n: number, places: number): number {
  let trimmed = n.toFixed(places);
  return Number(trimmed);
}

export default trimNum;
