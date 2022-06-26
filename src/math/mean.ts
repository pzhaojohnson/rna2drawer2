import { sum } from './sum';

/**
 * It is not firmly defined what is returned
 * for an empty array of numbers.
 */
export function mean(nums: number[]): number {
  if (nums.length == 0) {
    return NaN;
  } else {
    return sum(nums) / nums.length;
  }
}
