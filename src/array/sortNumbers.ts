// sorts the numbers array in place and also returns it
export function sortNumbers(numbers: number[]): number[] {
  numbers.sort((a, b) => a - b);
  return numbers;
}
