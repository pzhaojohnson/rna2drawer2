import { pointsToInches } from './pointsToInches';

it('pointsToInches function', () => {
  expect(pointsToInches(72)).toBeCloseTo(1, 3);
  expect(pointsToInches(0)).toBe(0);
  expect(pointsToInches(144)).toBeCloseTo(2);
});
