import { getAtIndex } from './getAtIndex';

it('index is in bounds', () => {
  let arr = [1, 2, 3, 4, 5, 6];
  expect(getAtIndex(arr, 0)).toBe(1);
  expect(getAtIndex(arr, 3)).toBe(4);
  expect(getAtIndex(arr, 5)).toBe(6);
});

it('index is out of bounds', () => {
  let arr = [1, 2, 3, 4, 5];
  expect(getAtIndex(arr, 5)).toBe(undefined);
  expect(getAtIndex(arr, 12)).toBe(undefined);
});
