/**
 * Returns true if the absolute difference between the two numbers
 * is less than or equal to the maximum allowed difference.
 */
function closeToEachOther(x: number, y: number, maxDiff: number): boolean {
  return Math.abs(x - y) <= maxDiff;
}

export default closeToEachOther;
