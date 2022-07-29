import { displacePointFromCurve } from './displacePointFromCurve';

test('displacePointFromCurve function', () => {
  // displace towards the top-right
  let p = displacePointFromCurve({
    pointOnCurve: { x: 9, y: -5 },
    directionOfCurve: 0.6,
    displacement: { x: -8, y: 3 },
  });
  expect(p.x).toBeCloseTo(15.993146631889317);
  expect(p.y).toBeCloseTo(-9.90875749909232);

  // displace towards the bottom-left
  p = displacePointFromCurve({
    pointOnCurve: { x: 2, y: 6 },
    directionOfCurve: -1.4,
    displacement: { x: -1, y: -10 },
  });
  expect(p.x).toBeCloseTo(-0.6851211589908706);
  expect(p.y).toBeCloseTo(15.68453015698436);
});
