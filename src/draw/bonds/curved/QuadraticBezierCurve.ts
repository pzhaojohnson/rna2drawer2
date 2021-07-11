import * as SVG from '@svgdotjs/svg.js';

export type QuadraticBezierCurve = [
  ['M', number, number],
  ['Q', number, number, number, number],
]

function isFiniteNumber(v: unknown): v is number {
  return typeof v == 'number' && Number.isFinite(v);
}

// not sure if this function can be turned into a true type predicate
export function isQuadraticBezierCurve(pa: SVG.PathArray): boolean {
  try {
    let m = pa[0];
    let q = pa[1];
    return (
      m
      && m[0] == 'M'
      && isFiniteNumber(m[1])
      && isFiniteNumber(m[2])
      && m.length == 3
      && q
      && q[0] == 'Q'
      && isFiniteNumber(q[1])
      && isFiniteNumber(q[2])
      && isFiniteNumber(q[3])
      && isFiniteNumber(q[4])
      && q.length == 5
      && pa.length == 2
    );
  } catch (error) {
    console.error(error);
    return false;
  }
}
