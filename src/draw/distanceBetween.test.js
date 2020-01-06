import distanceBetween from './distanceBetween';

it('distanceBetween', () => {

  // all positive
  expect(distanceBetween(1, 1, 4, 5)).toEqual(5);

  // X coordinate the same
  expect(distanceBetween(1, 1, 1, 5)).toEqual(4);

  // Y coordinate the same
  expect(distanceBetween(1, 1, 2, 1)).toEqual(1);

  // zeros
  expect(distanceBetween(0, 0, 0, 0)).toEqual(0);

  // some negative
  expect(distanceBetween(-1, -1, 3, 2)).toEqual(5);

  // all negative
  expect(distanceBetween(-1, -1, -4, -5)).toEqual(5);
});
