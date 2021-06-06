import {
  atIndex,
  atPosition,
} from './at';

it('atIndex function', () => {
  let arr = [2, 'z', null, undefined, 1];
  arr.length = 10; // has empty items
  expect(atIndex(arr, 0)).toBe(2);
  expect(atIndex(arr, 1)).toBe('z');
  expect(atIndex(arr, 2)).toBe(null);
  expect(atIndex(arr, 3)).toBe(undefined);
  expect(atIndex(arr, 4)).toBe(1);
  expect(atIndex(arr, 5)).toBe(undefined); // empty item
  expect(atIndex(arr, -1)).toBe(undefined); // negative index
  expect(atIndex(arr, arr.length + 10)).toBe(undefined); // above bounds
});

it('atPosition function', () => {
  let arr = ['asdf', 2, undefined, null, 8];
  arr.length = 20; // has empty items
  expect(atPosition(arr, 1)).toBe('asdf');
  expect(atPosition(arr, 2)).toBe(2);
  expect(atPosition(arr, 3)).toBe(undefined);
  expect(atPosition(arr, 4)).toBe(null);
  expect(atPosition(arr, 5)).toBe(8);
  expect(atPosition(arr, 6)).toBe(undefined); // empty item
  expect(atPosition(arr, 0)).toBe(undefined); // position zero
  expect(atPosition(arr, -1)).toBe(undefined); // negative position
  expect(atPosition(arr, arr.length + 20)).toBe(undefined); // above bounds
});
