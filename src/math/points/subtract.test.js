import { subtract2D } from './subtract';

test('subtract2D function', () => {
  [
    { p1: { x: 8, y: 12 }, p2: { x: 3, y: 1 }, d: { x: 5, y: 11 } },
    { p1: { x: -11, y: 2 }, p2: { x: 30, y: -5 }, d: { x: -41, y: 7 } },
    { p1: { x: 10, y: 100 }, p2: { x: -30, y: -1 }, d: { x: 40, y: 101 } },
  ].forEach(({ p1, p2, d }) => {
    let v = subtract2D(p1, p2);
    expect(v.x).toBeCloseTo(d.x);
    expect(v.y).toBeCloseTo(d.y);
  });
});
