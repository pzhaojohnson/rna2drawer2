export function sum(nums: number[]): number {
  let s = 0;
  nums.forEach(n => s += n);
  return s;
}
