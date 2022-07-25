import { midpoint2D } from './midpoint';
import { round } from 'Math/round';

function round2D(p, places=3) {
  return {
    x: round(p.x, places),
    y: round(p.y, places),
  };
}

test('midpoint2D function', () => {
  [
    {
      p1: { x: 10, y: 5 },
      p2: { x: 20, y: 10 },
      mp: { x: 15, y: 7.5 },
    },
    {
      p1: { x: -120, y: 250},
      p2: { x: 90, y: -1000 },
      mp: { x: -15, y: -375 },
    },
    {
      p1: { x: 2000, y: 1000 },
      p2: { x: 1998, y: 1002 },
      mp: { x: 1999, y: 1001 },
    },
  ].forEach(ps => {
    let p = midpoint2D(ps.p1, ps.p2);
    p = round2D(p, 3);
    expect(p).toEqual(ps.mp);
  });
});
