import { mean } from './mean';

describe('mean function', () => {
  test('an empty array of numbers`', () => {
    expect(mean([])).toBe(NaN);
  });

  test('nonempty arrays of numbers', () => {
    expect(mean([5])).toBeCloseTo(5);
    expect(mean([-1, 0.5, 11.2, 23])).toBeCloseTo(33.7 / 4);
    expect(mean([2, 2, -1, -1, -1, 5, 5.6])).toBeCloseTo(11.6 / 7);
  });
});
