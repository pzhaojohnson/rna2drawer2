import { direction2D } from './direction';
import { normalizeAngle } from 'Math/angles/normalize';

test('direction2D function', () => {
  [
    { v: { x: 1, y: 3**0.5 }, d: Math.PI / 3 },
    { v: { x: 0, y: 2 }, d: Math.PI / 2 },
    { v: { x: -0.5, y: -0.5 }, d: -3 * Math.PI / 4 },
    { v: { x: 3**0.5, y: -1 }, d: -Math.PI / 6 },
    { v: { x: -1, y: 3**0.5 }, d: 2 * Math.PI / 3 },
  ].forEach(({ v, d }) => {
    expect(
      normalizeAngle(direction2D(v))
    ).toBeCloseTo(
      normalizeAngle(d)
    );
  });
});
