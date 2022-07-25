import { normalizeAngle } from './normalizeAngle';

describe('normalizeAngle function', () => {
  test('an angle below the minimum angle', () => {
    expect(normalizeAngle(-Math.PI, 0)).toBeCloseTo(Math.PI, 6);
  });

  test('an angle equal to the minimum angle', () => {
    expect(normalizeAngle(0, 0)).toBeCloseTo(0, 6);
  });

  test('an angle above the minimum angle', () => {
    expect(normalizeAngle(4 * Math.PI, 0)).toBeCloseTo(0, 6);
  });

  test('an already normalized angle', () => {
    expect(normalizeAngle(Math.PI, 0)).toBeCloseTo(Math.PI, 6);
  });

  test('an angle 2 * Math.PI above the minimum angle', () => {
    expect(normalizeAngle(2 * Math.PI, 0)).toBeCloseTo(0, 6);
  });
});
