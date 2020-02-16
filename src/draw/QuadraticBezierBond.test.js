import QuadraticBezierBond from './QuadraticBezierBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';

it('validating sides', () => {
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
  let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  let bracket2 = svg.path('M 9 10 L 11 12 L 13 14 L 15 16 L 17 18');
  let side1 = [Base.create(svg, 'A', 1, 2)];
  let side2 = [Base.create(svg, 'U', 3, 4)];

  function createBondWithCurve(curve) {
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }

  // a valid curve
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6')
  )).not.toThrow();

  // handles floating point and negative numbers
  expect(() => createBondWithCurve(
    svg.path('M 1.001765 -2 Q 3 -0.237654 5 6')
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
  
  function createBondWithBracket1AndSide1(bracket1, side1) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let bracket2 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
    let side2 = [Base.create(svg, 'A', 1, 2)];
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }

  function createBondWithBracket2AndSide2(bracket2, side2) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
    let side1 = [Base.create(svg, 'A', 1, 2)];
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }

  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  let b3 = Base.create(svg, 'G', 3, 5);
  let b4 = Base.create(svg, 'C', 2, 8);

  // valid bracket 1
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12'), [b1, b2]
  )).not.toThrow();

  // valid bracket 2
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10'), [b1]
  )).not.toThrow();

  // bracket 1 handles floating point and negative numbers
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1.1 2 L 3 4 L -5.99 6 L 7 8.7 L 9 10 L -0.7511 12'), [b1, b2]
  )).not.toThrow();

  // bracket 2 handles floating point and negative numbers
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 -0.86154 L 5 6.009 L 7 8 L 9 -10'), [b1]
  )).not.toThrow();

  // too few segments in bracket 1
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8'), [b2]
  )).toThrow();

  // too few segments in bracket 2
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10'), [b1, b2]
  )).toThrow();

  // too many segments in bracket 1
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12 L 13 14'), [b1]
  )).toThrow();

  // too many segments in bracket 2
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12'), [b2]
  )).toThrow();

  // the first segment of bracket 1 is not an M segment
  expect(() => createBondWithBracket1AndSide1(
    svg.path('L 1 2 L 3 4 L 5 6 L 7 8 L 9 10'), [b1]
  )).toThrow();

  // the first segment of bracket 2 is not an M segment
  expect(() => createBondWithBracket2AndSide2(
    svg.path('L 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12'), [b2, b3]
  )).toThrow();

  // too few elements in M segment of bracket 1
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 L 3 4 L 5 6 L 7 8 L 9 10'), [b4]
  )).toThrow();

  // too few elements in M segment of bracket 2
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M L 3 4 L 5 6 L 7 8 L 9 10'), [b4]
  )).toThrow();

  // the second element of the M segment of bracket 1 is not a number
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M a 2 L 3 4 L 5 6 L 7 8 L 9 10'), [b2]
  )).toThrow();

  // the second element of the M segment of bracket 2 is not a number
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M b 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12'), [b2, b3]
  )).toThrow();

  // the third element of the M segment of bracket 1 is not a number
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 2 a L 3 4 L 5 6 L 7 8 L 9 10 L 11 12'), [b2, b3]
  )).toThrow();

  // the third element of the M segment of bracket 2 is not a number
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 c L 3 4 L 5 6 L 7 8 L 9 10'), [b2]
  )).toThrow();

  // the second segment of bracket 1 is not an L segment
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 1 M 3 4 L 5 6 L 7 8 L 9 10'), [b2]
  )).toThrow();

  // the second segment of bracket 2 is not an L segment
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 1 m 3 4 L 5 6 L 7 8 L 9 10 L 11 12'), [b2, b1]
  )).toThrow();

  // a trailing segment of bracket 1 is not an L segment
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L 5 6 M 7 8 L 9 10 L 11 12'), [b1, b2]
  )).toThrow();

  // a trailing segment of bracket 2 is not an L segment
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 m 9 10'), [b1]
  )).toThrow();

  // Z command at the end of bracket 1
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12 Z'), [b1, b2]
  )).toThrow();

  // Z command at the end of bracket 2
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 Z'), [b1]
  )).toThrow();

  // z command at the end of bracket 1
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 z'), [b1]
  )).toThrow();

  // z command at the end of bracket 2
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L 11 12 z'), [b1, b2]
  )).toThrow();

  // the second element of an L segment in bracket 1 is not a number
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 4 L b 6 L 7 8 L 9 10 L 11 12'), [b1, b2]
  )).toThrow();

  // the second element of an L segment in bracket 2 is not a number
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10 L h 12'), [b1, b2]
  )).toThrow();

  // the third element of an L segment in bracket 1 is not a number
  expect(() => createBondWithBracket1AndSide1(
    svg.path('M 1 2 L 3 g L 5 6 L 7 8 L 9 10'), [b1]
  )).toThrow();

  // the third element of an L segment in bracket 2 is not a number
  expect(() => createBondWithBracket2AndSide2(
    svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 k'), [b1]
  )).toThrow();
});

it('curve property getters', () => {
  let svg = createNodeSVG();
  let curve = svg.path('M 1.1 -2 Q 3 0.4 5 -0.86');
  let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  let bracket2 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  let side1 = [Base.create(svg, 'A', 1, 2)];
  let side2 = [Base.create(svg, 'U', 3, 4)];
  let qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);

  expect(qbb.xCurveEnd1).toBe(1.1);
  expect(qbb.yCurveEnd1).toBe(-2);
  expect(qbb.xCurveEnd2).toBe(5);
  expect(qbb.yCurveEnd2).toBe(-0.86);
  expect(qbb.xCurveControlPoint).toBe(3);
  expect(qbb.yCurveControlPoint).toBe(0.4);

  expect(qbb.curveHeight).toBeCloseTo(1.8306829326784035, 6);
  expect(qbb.curveAngle).toBeCloseTo(1.3137271587657995, 6);

  // curve height of zero
  curve = svg.path('M 0 0 Q 1 1 2 2');
  qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  expect(qbb.curveHeight).toBeCloseTo(0, 6);
  expect(typeof(qbb.curveAngle)).toBe('number');
  expect(isFinite(qbb.curveAngle)).toBeTruthy();
  
  // zero distance between ends
  curve = svg.path('M 0 0 Q 0 1 0 0');
  qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  expect(qbb.curveHeight).toBeCloseTo(1, 6);
  expect(typeof(qbb.curveAngle)).toBe('number');
  expect(isFinite(qbb.curveAngle)).toBeTruthy();
  
  // curve height of zero and zero distance between ends
  curve = svg.path('M 1.1 1.1 Q 1.1 1.1 1.1 1.1');
  qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  expect(qbb.curveHeight).toBe(0);
  expect(typeof(qbb.curveAngle)).toBe('number');
  expect(isFinite(qbb.curveAngle)).toBeTruthy();
});

it('bracket property getters', () => {
  let svg = createNodeSVG();
  
  function createBondWithBracket1AndSide1(bracket1, side1) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let bracket2 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
    let side2 = [Base.create(svg, 'U', 3, 4)];
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }

  function createBondWithBracket2AndSide2(bracket2, side2) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
    let side1 = [Base.create(svg, 'A', 1, 2)];
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2);
  }

  let b1 = Base.create(svg, 'A', -0.1, 2);
  let b2 = Base.create(svg, 'U', 2, -3.2);
  let b3 = Base.create(svg, 'G', 3.5, 5);
  
  let qbb1 = createBondWithBracket1AndSide1(
    svg.path('M -1.1 2 L -1.1 3 L -0.1 3 L 0.9 3 L 0.9 2'), [b1]
  );

  // for bracket 1
  expect(qbb1.topPaddingBracket1).toBeCloseTo(1, 6);
  expect(qbb1.overhangPaddingBracket1).toBeCloseTo(1, 6);
  expect(qbb1.overhangLengthBracket1).toBeCloseTo(1, 6);

  let qbb2 = createBondWithBracket2AndSide2(
    svg.path('M 1.7 -3.9 L 2.5 -4.7 L 3 -4.2 L 4.5 6 L 4 6.5 L 3.2 5.7'), [b2, b3]
  );

  // for bracket 2
  expect(qbb2.topPaddingBracket2).toBeCloseTo(2 ** 0.5, 6);
  expect(qbb2.overhangPaddingBracket2).toBeCloseTo(0.5 ** 0.5, 6);
  expect(qbb2.overhangLengthBracket2).toBeCloseTo(1.28 ** 0.5, 6);

  // bracket midpoint for side with one base
  let bracket = svg.path('M 0.5 1 L 3.5 -0.9 L 0.999 42 L 1 3 L 0.8 0.88');
  let side = [b1];
  qbb1 = createBondWithBracket1AndSide1(bracket, side);
  expect(qbb1.xMiddleBracket1).toBeCloseTo(0.999, 6);
  expect(qbb1.yMiddleBracket1).toBeCloseTo(42, 6);
  qbb2 = createBondWithBracket2AndSide2(bracket, side);
  expect(qbb2.xMiddleBracket2).toBeCloseTo(0.999, 6);
  expect(qbb2.yMiddleBracket2).toBeCloseTo(42, 6);

  // bracket midpoint for side with even number of bases
  bracket = svg.path('M 1 2 L 0.9 2.0 L -3.4 5.555 L 6.8 7 L -7 -7 L 0 0');
  side = [b2, b3];
  qbb1 = createBondWithBracket1AndSide1(bracket, side);
  expect(qbb1.xMiddleBracket1).toBeCloseTo((-3.4 + 6.8) / 2, 6);
  expect(qbb1.yMiddleBracket1).toBeCloseTo((5.555 + 7) / 2, 6);
  qbb2 = createBondWithBracket2AndSide2(bracket, side);
  expect(qbb2.xMiddleBracket2).toBeCloseTo((-3.4 + 6.8) / 2, 6);
  expect(qbb2.yMiddleBracket2).toBeCloseTo((5.555 + 7) / 2, 6);

  // bracket midpoint for side with odd number of bases (greater than one)
  bracket = svg.path('M 1 2 L 3 4 L 5 6 L 7.996 -0.889 L 0 0 L 3 4 L 2 1');
  side = [b1, b2, b3];
  qbb1 = createBondWithBracket1AndSide1(bracket, side);
  expect(qbb1.xMiddleBracket1).toBeCloseTo(7.996, 6);
  expect(qbb1.yMiddleBracket1).toBeCloseTo(-0.889, 6);
  qbb2 = createBondWithBracket2AndSide2(bracket, side);
  expect(qbb2.xMiddleBracket2).toBeCloseTo(7.996, 6);
  expect(qbb2.yMiddleBracket2).toBeCloseTo(-0.889, 6);
});
