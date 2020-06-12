import { pixelsToPoints } from './pixelsToPoints';

it('pixelsToPoints function', () => {
  expect(pixelsToPoints(1)).toBeCloseTo(0.75);
  expect(pixelsToPoints(0)).toBe(0);
  expect(pixelsToPoints(8)).toBeCloseTo(6);
});
