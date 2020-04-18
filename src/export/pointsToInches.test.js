import { pointsToInches } from './pointsToInches';

it('pointsToInches function', () => {
  expect(pointsToInches(72)).toBeCloseTo(1, 3);
});
