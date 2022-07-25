import { sum } from 'Math/sum';

/**
 * Returns the mean of the numbers.
 *
 * Returns NaN for an empty array of numbers.
 */
export function mean(nums: number[]): number {
  if (nums.length == 0) {
    return NaN;
  } else {
    return sum(nums) / nums.length;
  }
}
