import { distance2D } from './distance';

test('distance2D function', () => {
  expect(distance2D(0, 0, 3, 4)).toBeCloseTo(5);
  expect(distance2D(-2, -8, -2 - 9, -8 - 40)).toBeCloseTo(41);
  expect(distance2D(5.8, 22.3, 5.8 + 28, 22.3 - 45)).toBeCloseTo(53);
  expect(distance2D(100, 145, 100 + 31, 145 + 480)).toBeCloseTo(481);
  expect(distance2D(-0.5, 0.4, -0.5 + 20, 0.4 - 99)).toBeCloseTo(101);
});
