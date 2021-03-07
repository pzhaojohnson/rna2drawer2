import { mean } from './mean';

it('empty list', () => {
  expect(mean([])).toBe(NaN);
});

it('nonempty lists', () => {
  expect(mean([5])).toBeCloseTo(5);
  expect(mean([-1, 0.5, 11.2, 23])).toBeCloseTo(33.7 / 4);
  expect(mean([2, 2, -1, -1, -1, 5, 5.6])).toBeCloseTo(11.6 / 7);
});
