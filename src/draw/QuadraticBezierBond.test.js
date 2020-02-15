import QuadraticBezierBond from './QuadraticBezierBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

it('validating curve', () => {
  let svg = createNodeSVG();
  let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8');
  let bracket2 = svg.path('M 9 10 L 11 12 L 13 14 L 15 16');
  let side1 = [Base.create(svg, 'A', 1, 2)];
  let side2 = [Base.create(svg, 'U', 3, 4)];

  function createBondWithCurve(curve) {
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }

  // a valid curve
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6')
  )).not.toThrow();
  
  // too few segments
  expect(() => createBondWithCurve(
    svg.path('M 1 2')
  )).toThrow();

  // too many segments
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6 Q 7 8 9 10')
  )).toThrow();

  // Z command at the end
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6 Z')
  )).toThrow();

  // z command at the end
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6 z')
  )).toThrow();

  // first segment is not an M segment
  expect(() => createBondWithCurve(
    svg.path('L 1 2 Q 3 4 5 6')
  )).toThrow();

  // M segment has too few elements
  expect(() => createBondWithCurve(
    svg.path('M 1 Q 3 4 5 6')
  )).toThrow();

  // M segment has too many elements
  expect(() => createBondWithCurve(
    svg.path('M 1 2 3 Q 3 4 5 6')
  )).toThrow();

  // second element of M segment is not a number
  expect(() => createBondWithCurve(
    svg.path('M a 2 Q 3 4 5 6')
  )).toThrow();

  // third element of M segment is not a number
  expect(() => createBondWithCurve(
    svg.path('M 1 a Q 3 4 5 6')
  )).toThrow();

  // second segment is not a Q segment
  expect(() => createBondWithCurve(
    svg.path('M 1 2 L 3 4')
  )).toThrow();

  // Q segment has too few element
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5')
  )).toThrow();

  // Q segment has too many elements
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6 7')
  )).toThrow();

  // second element of Q segment is not a number
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q a 4 5 6')
  )).toThrow();

  // third element of Q segment is not a number
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 a 4 5 6')
  )).toThrow();

  // fourth element of Q segment is not a number
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 a 6')
  )).toThrow();

  // fifth element of Q segment is not a number
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 a')
  )).toThrow();
});
