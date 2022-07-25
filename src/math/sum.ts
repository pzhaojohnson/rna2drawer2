/**
 * Calculates the sum of the numbers.
 *
 * It is not firmly defined what is returned
 * for an empty array of numbers.
 */
export function sum(nums: number[]): number {
  let s = 0;
  nums.forEach(n => s += n);
  return s;
}
