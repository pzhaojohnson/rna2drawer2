import { radiansToDegrees, degreesToRadians } from './degrees';

test('radiansToDegrees function', () => {
  expect(radiansToDegrees(0)).toBeCloseTo(0);
  expect(radiansToDegrees(Math.PI / 3)).toBeCloseTo(60);
  expect(radiansToDegrees(Math.PI / 4)).toBeCloseTo(45);
  expect(radiansToDegrees(-Math.PI / 2)).toBeCloseTo(-90);
  expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
  expect(radiansToDegrees(8 * Math.PI / 3)).toBeCloseTo(480);
  expect(radiansToDegrees(-17 * Math.PI / 4)).toBeCloseTo(-765);
});

test('degreesToRadians function', () => {
  expect(degreesToRadians(0)).toBeCloseTo(0);
  expect(degreesToRadians(60)).toBeCloseTo(Math.PI / 3);
  expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4);
  expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2);
  expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
  expect(degreesToRadians(480)).toBeCloseTo(8 * Math.PI / 3);
  expect(degreesToRadians(-765)).toBeCloseTo(-17 * Math.PI / 4);
});
