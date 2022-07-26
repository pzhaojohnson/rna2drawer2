import { rotatePoint2D } from './rotatePoint';

test('rotatePoint2D function', () => {
  let p = rotatePoint2D({
    point: { x: 3, y: 3 },
    origin: { x: 2, y: 2 },
    angle: -Math.PI / 4,
  });
  expect(p.x).toBeCloseTo(2 + 2**0.5);
  expect(p.y).toBeCloseTo(2);

  p = rotatePoint2D({
    point: { x: 3, y: 3 },
    origin: { x: 2, y: 2 },
    angle: Math.PI / 4,
  });
  expect(p.x).toBeCloseTo(2);
  expect(p.y).toBeCloseTo(2 + 2**0.5);

  p = rotatePoint2D({
    point: { x: 3, y: 3 },
    origin: { x: 2, y: 2 },
    angle: Math.PI / 2,
  });
  expect(p.x).toBeCloseTo(1);
  expect(p.y).toBeCloseTo(3);

  // origin and the point to rotate are the same
  p = rotatePoint2D({
    point: { x: 43, y: 28 },
    origin: { x: 43, y: 28 },
    angle: Math.PI / 2,
  });
  expect(p.x).toBeCloseTo(43);
  expect(p.y).toBeCloseTo(28);

  // zero angle of rotation
  p = rotatePoint2D({
    point: { x: 55, y: 60 },
    origin: { x: 21, y: 3 },
    angle: 0,
  });
  expect(p.x).toBeCloseTo(55);
  expect(p.y).toBeCloseTo(60);
});
