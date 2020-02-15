import QuadraticBezierBond from './QuadraticBezierBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

it('validate sides', () => {
  let svg = createNodeSVG();
  
  function createBondWithSides(side1, side2) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let dBracket1 = 'M 1 2 L 3 4 ';
    let dBracket2 = 'M 1 2 L 3 4 ';

    side1.forEach(base => { dBracket1 += 'L 5 6 ' });
    side2.forEach(base => { dBracket2 += 'L 5 6 ' });

    dBracket1 += 'L 7 8 L 9 10';
    dBracket2 += 'L 7 8 L 9 10';

    let bracket1 = svg.path(dBracket1);
    let bracket2 = svg.path(dBracket2);

    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }
  
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  let b3 = Base.create(svg, 'G', 3, 5);
  let b4 = Base.create(svg, 'C', 2, 8);

  // same side lengths
  expect(() => createBondWithSides(
    [b1, b2], [b3, b4]
  )).not.toThrow();

  // more bases on side 1
  expect(() => createBondWithSides(
    [b1, b2], [b3]
  )).not.toThrow();

  // more bases on side 2
  expect(() => createBondWithSides(
    [b1], [b2, b3]
  )).not.toThrow();

  // empty side 1
  expect(() => createBondWithSides(
    [], [b2]
  )).toThrow();

  // empty side 2
  expect(() => createBondWithSides(
    [b1], []
  )).toThrow();

  // both sides are empty
  expect(() => createBondWithSides(
    [], []
  )).toThrow();
});

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

it('validating brackets', () => {
  let svg = createNodeSVG();
  let curve = svg.path('M 1 2 Q 3 4 5 6');
  let side1 = [Base.create(svg, 'A', 1, 2)];
  let side2 = [Base.create(svg, 'U', 3, 4)];
});
