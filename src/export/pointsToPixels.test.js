import { pointsToPixels } from './pointsToPixels';

it('pointsToPixels function', () => {
  expect(pointsToPixels(1)).toBeCloseTo(1.33333333, 3);
});
