import NormalizedBaseCoordinates from './NormalizedBaseCoordinates';
import { normalizeAngle } from 'Math/angles/normalize';

it('given coordinates', () => {
  let xLeft = 1;
  let yTop = 2;
  let vbc = new NormalizedBaseCoordinates(xLeft, yTop);
  expect(vbc.xLeft).toEqual(xLeft);
  expect(vbc.yTop).toEqual(yTop);
});

it('derived coordinates', () => {
  let xLeft = 1;
  let yTop = 2;
  let vbc = new NormalizedBaseCoordinates(xLeft, yTop);
  expect(vbc.xRight).toEqual(xLeft + 1);
  expect(vbc.xCenter).toEqual(xLeft + 0.5);
  expect(vbc.yBottom).toEqual(yTop + 1);
  expect(vbc.yCenter).toEqual(yTop + 0.5);
});

it('distanceBetweenCenters', () => {
  let vbc0 = new NormalizedBaseCoordinates(1, 2);
  let vbc1 = new NormalizedBaseCoordinates(4, 6);
  expect(vbc0.distanceBetweenCenters(vbc1)).toEqual(5);

  // zeros...
  let vbc2 = new NormalizedBaseCoordinates(0, 0);
  let vbc3 = new NormalizedBaseCoordinates(0, 0);
  expect(vbc2.distanceBetweenCenters(vbc3)).toEqual(0);

  // called on itself
  expect(vbc2.distanceBetweenCenters(vbc2)).toEqual(0);
});

it('angleBetweenCenters', () => {
  let vbc0 = new NormalizedBaseCoordinates(1, 2);
  let vbc1 = new NormalizedBaseCoordinates(4, 6);
  let angle = normalizeAngle(vbc0.angleBetweenCenters(vbc1), 0);
  expect(angle).toBeCloseTo(Math.asin(4 / 5), 6);
});
