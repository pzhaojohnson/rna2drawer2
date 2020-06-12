import { pointsToPixels } from './pointsToPixels';

it('pointsToPixels function', () => {
  expect(pointsToPixels(1)).toBeCloseTo(1.33333333, 3);
  expect(pointsToPixels(0)).toBe(0);
  expect(pointsToPixels(24)).toBeCloseTo(32);
});
