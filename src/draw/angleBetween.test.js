import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

it('angleBetween', () => {
  let a = angleBetween(0, 0, 1, 0);
  expect(normalizeAngle(a, 0)).toBeCloseTo(0);

  a = angleBetween(0, 0, 1, 1);
  expect(normalizeAngle(a, 0)).toBeCloseTo(Math.PI / 4);

  a = angleBetween(0, 0, 0, 1);
  expect(normalizeAngle(a, 0)).toBeCloseTo(Math.PI / 2);

  a = angleBetween(0, 0, -1, -1);
  expect(normalizeAngle(a, 0)).toBeCloseTo(5 * Math.PI / 4);

  a = angleBetween(-1, -1, 1, 1);
  expect(normalizeAngle(a, 0)).toBeCloseTo(Math.PI / 4);
});
