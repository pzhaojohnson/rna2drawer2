import { add2D } from './add';

test('add2D function', () => {
  // integer coordinates
  let p = add2D({ x: 1, y: -2 }, { x: 3, y: 4 });
  expect(p).toStrictEqual({ x: 4, y: 2 });

  // non-integer coordinates
  p = add2D({ x: 0.12, y: 102.9 }, { x: -3.783, y: 54.02 });
  expect(p.x).toBeCloseTo(-3.663, 3);
  expect(p.y).toBeCloseTo(156.92, 2);
});
