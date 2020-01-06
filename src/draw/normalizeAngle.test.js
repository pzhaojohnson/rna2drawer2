import normalizeAngle from './normalizeAngle';

it('below minimum angle', () => {
  expect(normalizeAngle(-Math.PI, 0)).toBeCloseTo(Math.PI, 6);
});

it('equals minimum angle', () => {
  expect(normalizeAngle(0, 0)).toBeCloseTo(0, 6);
});

it('above minimum angle', () => {
  expect(normalizeAngle(4 * Math.PI, 0)).toBeCloseTo(0, 6);
});

it('already normalized', () => {
  expect(normalizeAngle(Math.PI, 0)).toBeCloseTo(Math.PI, 6);
});

it('2 * Math.PI above minimum angle', () => {
  expect(normalizeAngle(2 * Math.PI, 0)).toBeCloseTo(0, 6);
});
