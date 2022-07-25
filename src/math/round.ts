/**
 * Rounds the number to the specified number of decimal places
 * or to zero decimal places if the number of decimal places
 * to round to is not specified.
 */
export function round(n: number, places=0): number {
  return Number.parseFloat(n.toFixed(places));
}
