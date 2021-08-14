import {
  pixelsToPoints,
  pointsToPixels,
  pixelsToInches,
  pointsToInches,
} from './units';

test('pixelsToPoints function', () => {
  expect(pixelsToPoints(1)).toBeCloseTo(0.75);
  expect(pixelsToPoints(0)).toBe(0);
  expect(pixelsToPoints(8)).toBeCloseTo(6);
});

test('pointsToPixels function', () => {
  expect(pointsToPixels(1)).toBeCloseTo(1.33333333, 3);
  expect(pointsToPixels(0)).toBe(0);
  expect(pointsToPixels(24)).toBeCloseTo(32);
});

test('pixelsToInches function', () => {
  expect(pixelsToInches(96)).toBeCloseTo(1);
  expect(pixelsToInches(0)).toBe(0);
  expect(pixelsToInches(288)).toBeCloseTo(3);
});

test('pointsToInches function', () => {
  expect(pointsToInches(72)).toBeCloseTo(1, 3);
  expect(pointsToInches(0)).toBe(0);
  expect(pointsToInches(144)).toBeCloseTo(2);
});
