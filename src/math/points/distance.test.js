import { distance2D } from './distance';

test('distance2D function', () => {
  [
    { p1: { x: 30, y: 24 }, p2: { x: 33, y: 28 }, d: 5 },
    { p1: { x: -21, y: 3 }, p2: { x: -26, y: 15 }, d: 13 },
    { p1: { x: 0, y: 8 }, p2: { x: 20, y: -91 }, d: 101 },
  ].forEach(({ p1, p2, d }) => {
    expect(distance2D(p1, p2)).toBeCloseTo(d);
  });
});
