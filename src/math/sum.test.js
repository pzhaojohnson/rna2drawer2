import { sum } from './sum';

describe('sum function', () => {
  it('empty list', () => {
    expect(sum([])).toBe(0);
  });

  it('nonempty lists', () => {
    expect(sum([5])).toBe(5);
    expect(sum([-1, 0.5, 11.2, 23])).toBeCloseTo(33.7);
    expect(sum([2, 2, -1, -1, -1, 5, 5.6])).toBeCloseTo(11.6);
  });
});
