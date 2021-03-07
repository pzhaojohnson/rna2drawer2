import { sum } from './sum';

export function mean(nums: number[]): number {
  if (nums.length == 0) {
    return NaN;
  } else {
    return sum(nums) / nums.length;
  }
}
