import { atIndex } from './at';

it('index is in bounds', () => {
  let arr = [1, 2, 3, 4, 5, 6];
  expect(atIndex(arr, 0)).toBe(1);
  expect(atIndex(arr, 3)).toBe(4);
  expect(atIndex(arr, 5)).toBe(6);
});

it('index is out of bounds', () => {
  let arr = [1, 2, 3, 4, 5];
  expect(atIndex(arr, 5)).toBe(undefined);
  expect(atIndex(arr, 12)).toBe(undefined);
});
