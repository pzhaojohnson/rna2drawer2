import { areAllSameNumber } from './areAllSameNumber';

it('are all same number', () => {
  expect(areAllSameNumber([5])).toBeTruthy(); // a single number
  expect(areAllSameNumber([5, 5])).toBeTruthy();
  expect(areAllSameNumber([2, 2, 2, 2])).toBeTruthy();
});

it('are not all same number', () => {
  expect(areAllSameNumber([1, 2])).toBeFalsy();
  expect(areAllSameNumber([1, 1, 5])).toBeFalsy(); // some are same number
});
