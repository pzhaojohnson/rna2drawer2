import QuadraticBezierBond from './QuadraticBezierBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';
import distanceBetween from './distanceBetween';

function tertiaryBondDefaults() {
  return {
    bracketTopPadding: 6,
    bracketOverhangPadding: 6,
    bracketOverhangLength: 6,
  };
}

function createExampleBond() {
  let svg = createNodeSVG();
  
  return QuadraticBezierBond.createTertiary(
    svg,
    [Base.create(svg, 'A', 1, 2)],
    [Base.create(svg, 'U', 10, 11)],
    tertiaryBondDefaults(),
    b => Math.PI / 4,
  );
}

function dBracketCheck(d, expectedSegments) {
  let svg = createNodeSVG();
  let bracket = svg.path(d);
  let segments = bracket.array();
  expect(segments.length).toBe(expectedSegments.length);

  let m = segments[0];
  expect(m.length).toBe(3);
  let em = expectedSegments[0];
  expect(m[0]).toBe('M');
  expect(m[1]).toBeCloseTo(em[1], 6);
  expect(m[2]).toBeCloseTo(em[2], 6);

  for (let i = 1; i < expectedSegments.length; i++) {
    let l = segments[i];
    expect(l.length).toBe(3);
    let el = expectedSegments[i];
    expect(l[0]).toBe('L');
    expect(l[1]).toBeCloseTo(el[1], 6);
    expect(l[2]).toBeCloseTo(el[2], 6);
  }
}

it('_dBracket', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);

  // positive positional properties
  let positivePositionalProps = {
    topPadding: 5.5,
    overhangPadding: 3.2,
    overhangLength: 1,
  };

  // side of length one
  dBracketCheck(
    QuadraticBezierBond._dBracket([b1], positivePositionalProps, base => Math.PI / 4),
    [
      ['M', 1.919238815542512, 7.444722215136416],
      ['L', 2.6263455967290597, 8.151828996322964],
      ['L', 4.889087296526012, 5.889087296526011],
      ['L', 7.151828996322964, 3.6263455967290583],
      ['L', 6.444722215136416, 2.919238815542511],
    ],
  );

  // side of length greater than one
  dBracketCheck(
    QuadraticBezierBond._dBracket([b1, b2], positivePositionalProps, base => Math.PI / 4),
    [
      ['M', 1.919238815542512, 7.444722215136416],
      ['L', 2.6263455967290597, 8.151828996322964],
      ['L', 4.889087296526012, 5.889087296526011],
      ['L', 5.889087296526012, 6.889087296526011],
      ['L', 8.151828996322964, 4.626345596729058],
      ['L', 7.444722215136416, 3.9192388155425104],
    ],
  );

  // positional properties of zero
  let positionalPropsOfZero = {
    topPadding: 0,
    overhangPadding: 0,
    overhangLength: 0,
  };

  // and baseClockwiseNormalAngleCallback that returns zero
  dBracketCheck(
    QuadraticBezierBond._dBracket([b1, b2], positionalPropsOfZero, base => 0),
    [
      ['M', 1, 2],
      ['L', 1, 2],
      ['L', 1, 2],
      ['L', 2, 3],
      ['L', 2, 3],
      ['L', 2, 3],
    ],
  );

  // negative bracket top padding
  let negativePositionalProps = {
    topPadding: -8.1,
    overhangPadding: 1.111,
    overhangLength: 2.45,
  };

  dBracketCheck(
    QuadraticBezierBond._dBracket([b1, b2], negativePositionalProps, base => Math.PI / 4),
    [
      ['M', -3.7807489476022482, -1.2095576798057384],
      ['L', -5.51316056150929, -2.9419692937127797],
      ['L', -4.727564927611035, -3.7275649276110343],
      ['L', -3.727564927611035, -2.7275649276110343],
      ['L', -2.941969293712781, -3.513160561509289],
      ['L', -1.2095576798057395, -1.7807489476022476],
    ],
  );
});

it('_bracketMidpoint', () => {
  let svg = createNodeSVG();
  
  // bracket midpoint for side with one base
  let bracket = svg.path('M 0.5 1 L 3.5 -0.9 L 0.999 42 L 1 3 L 0.8 0.88');
  let mp = QuadraticBezierBond._bracketMidpoint(bracket);
  expect(mp.x).toBeCloseTo(0.999, 6);
  expect(mp.y).toBeCloseTo(42, 6);
  
  // bracket midpoint for side with even number of bases
  bracket = svg.path('M 1 2 L 0.9 2.0 L -3.4 5.555 L 6.8 7 L -7 -7 L 0 0');
  mp = QuadraticBezierBond._bracketMidpoint(bracket);
  expect(mp.x).toBeCloseTo((-3.4 + 6.8) / 2, 6);
  expect(mp.y).toBeCloseTo((5.555 + 7) / 2, 6);
  
  // bracket midpoint for side with odd number of bases (greater than one)
  bracket = svg.path('M 1 2 L 3 4 L 5 6 L 7.996 -0.889 L 0 0 L 3 4 L 2 1');
  mp = QuadraticBezierBond._bracketMidpoint(bracket);
  expect(mp.x).toBeCloseTo(7.996, 6);
  expect(mp.y).toBeCloseTo(-0.889, 6);
});

function dCurveCheck(d, expectedSegments) {
  let svg = createNodeSVG();
  let curve = svg.path(d);
  let segments = curve.array();
  expect(segments.length).toBe(2);

  let m = segments[0];
  expect(m.length).toBe(3);
  let em = expectedSegments[0];
  expect(m[1]).toBeCloseTo(em[1], 6);
  expect(m[2]).toBeCloseTo(em[2], 6);

  let q = segments[1];
  expect(q.length).toBe(5);
  let eq = expectedSegments[1];
  expect(q[1]).toBeCloseTo(eq[1], 6);
  expect(q[2]).toBeCloseTo(eq[2], 6);
  expect(q[3]).toBeCloseTo(eq[3], 6);
  expect(q[4]).toBeCloseTo(eq[4], 6);
}

it('_dCurve', () => {
  let svg = createNodeSVG();
  
  // ordinary case
  let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  let bracket2 = svg.path('M 11 12 L 13 14 L 15 16 L 17 18 L 19 20');
  let positionalProps = { height: 5, angle: Math.PI / 2 };

  dCurveCheck(
    QuadraticBezierBond._dCurve(bracket1, bracket2, positionalProps),
    [
      ['M', 5, 6],
      ['Q', 6.464466094067262, 14.535533905932738, 15, 16],
    ],
  );

  // curve ends zero distance apart
  bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  bracket2 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  positionalProps = { height: 5, angle: Math.PI / 2 };
  let d = QuadraticBezierBond._dCurve(bracket1, bracket2, positionalProps);
  let curve = svg.path(d);
  let segments = curve.array();
  expect(segments.length).toBe(2);
  let m = segments[0];
  expect(m.length).toBe(3);
  expect(m[0]).toBe('M');
  expect(m[1]).toBeCloseTo(5, 6);
  expect(m[2]).toBeCloseTo(6, 6);
  let q = segments[1];
  expect(q.length).toBe(5);
  expect(q[0]).toBe('Q');
  expect(q[3]).toBeCloseTo(5, 6);
  expect(q[4]).toBeCloseTo(6, 6);
  expect(distanceBetween(q[1], q[2], q[3], q[4])).toBeCloseTo(5, 6);
  
  // zero curve height and curve angle
  bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  bracket2 = svg.path('M 11 12 L 13 14 L 15 16 L 17 18 L 19 20');
  positionalProps = { height: 0, angle: 0 };

  dCurveCheck(
    QuadraticBezierBond._dCurve(bracket1, bracket2, positionalProps),
    [
      ['M', 5, 6],
      ['Q', 10, 11, 15, 16],
    ],
  );

  // curve ends zero distance apart and zero curve height and curve angle
  bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  bracket2 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  positionalProps = { height: 0, angle: 0 };

  dCurveCheck(
    QuadraticBezierBond._dCurve(bracket1, bracket2, positionalProps),
    [
      ['M', 5, 6],
      ['Q', 5, 6, 5, 6],
    ],
  );

  // negative curve height and curve angle
  bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  bracket2 = svg.path('M 11 12 L 13 14 L 15 16 L 17 18 L 19 20');
  positionalProps = { height: -1.1, angle: -Math.PI / 2 };

  dCurveCheck(
    QuadraticBezierBond._dCurve(bracket1, bracket2, positionalProps),
    [
      ['M', 5, 6],
      ['Q', 9.222182540694797, 11.777817459305203, 15, 16],
    ],
  );
});

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

    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
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
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
  }

  // a valid curve
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6')
  )).not.toThrow();

  // curve with an ID that is not a string
  let curve = svg.path('M 1 2 Q 3 4 5 6');
  curve.id(2);
  expect(() => createBondWithCurve(curve)).toThrow();

  /* It does not seem to be possible to set the ID of an element to an empty string
  using the SVG.js framework. */

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
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
  }

  function createBondWithBracket2AndSide2(bracket2, side2) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
    let side1 = [Base.create(svg, 'A', 1, 2)];
    return new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
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

  // bracket 1 with an ID that is not a string
  let bracket = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  bracket.id(3);
  let side = [b1];
  expect(() => createBondWithBracket1AndSide1(bracket, side)).toThrow();

  // bracket 2 with an ID that is not a string
  expect(() => createBondWithBracket2AndSide2(bracket, side)).toThrow();

  /* It does not seem to be possible to set the ID of an element to an empty string
  using the SVG.js framework. */

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
  let qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);

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
  qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
  expect(qbb.curveHeight).toBeCloseTo(0, 6);
  expect(typeof(qbb.curveAngle)).toBe('number');
  expect(isFinite(qbb.curveAngle)).toBeTruthy();
  
  // zero distance between ends
  curve = svg.path('M 0 0 Q 0 1 0 0');
  qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
  expect(qbb.curveHeight).toBeCloseTo(1, 6);
  expect(typeof(qbb.curveAngle)).toBe('number');
  expect(isFinite(qbb.curveAngle)).toBeTruthy();
  
  // curve height of zero and zero distance between ends
  curve = svg.path('M 1.1 1.1 Q 1.1 1.1 1.1 1.1');
  qbb = new QuadraticBezierBond(curve, bracket1, bracket2, side1, side2, () => 0);
  expect(qbb.curveHeight).toBe(0);
  expect(typeof(qbb.curveAngle)).toBe('number');
  expect(isFinite(qbb.curveAngle)).toBeTruthy();
});

it('shiftCurveControlPoint', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b1, b2],
    [b3, b4],
    { bracketTopPadding: 5, bracketOverhangPadding: 6, bracketOverhangLength: 4 },
    base => Math.PI / 3,
  );

  let segments = qbb._curve.array();
  qbb.shiftCurveControlPoint(10, -10, base => Math.PI / 3);
  let q = segments[1];
  q[1] += 10;
  q[2] -= 10;

  dCurveCheck(qbb._curve.attr('d'), segments);
  expect(qbb.xCurveControlPoint).toBeCloseTo(q[1], 6);
  expect(qbb.yCurveControlPoint).toBeCloseTo(q[2], 6);
});

it('bracket 1 top padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b1, b2],
    [b3, b4],
    { bracketTopPadding: 5, bracketOverhangPadding: 6, bracketOverhangLength: 4 },
    base => Math.PI / 4,
  );

  expect(qbb.topPaddingBracket1).toBeCloseTo(5, 6);
  
  qbb.setTopPaddingBracket1(2, base => Math.PI / 4);
  expect(qbb.topPaddingBracket1).toBeCloseTo(2, 6);

  dBracketCheck(
    qbb._bracket1.attr('d'),
    [
      ['M', -4.656854249492381, 4.828427124746191],
      ['L', -1.8284271247461898, 7.656854249492381],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 8.65685424949238, 1.1715728752538093],
      ['L', 5.828427124746189, -1.6568542494923806],
    ],
  );
});

it('bracket 2 top padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b3, b4],
    [b1, b2],
    { bracketTopPadding: 5, bracketOverhangPadding: 6, bracketOverhangLength: 4 },
    base => Math.PI / 4,
  );

  expect(qbb.topPaddingBracket2).toBeCloseTo(5, 6);
  
  qbb.setTopPaddingBracket2(2, base => Math.PI / 4);
  expect(qbb.topPaddingBracket2).toBeCloseTo(2, 6);

  dBracketCheck(
    qbb._bracket2.attr('d'),
    [
      ['M', -4.656854249492381, 4.828427124746191],
      ['L', -1.8284271247461898, 7.656854249492381],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 8.65685424949238, 1.1715728752538093],
      ['L', 5.828427124746189, -1.6568542494923806],
    ],
  );
});

it('bracket 1 overhang padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b1, b2],
    [b3, b4],
    { bracketTopPadding: 2, bracketOverhangPadding: 6, bracketOverhangLength: 4 },
    base => Math.PI / 4,
  );

  expect(qbb.overhangPaddingBracket1).toBeCloseTo(6, 6);
  
  qbb.setOverhangPaddingBracket1(3.5, base => Math.PI / 4);
  expect(qbb.overhangPaddingBracket1).toBeCloseTo(3.5, 6);

  dBracketCheck(
    qbb._bracket1.attr('d'),
    [
      ['M', -2.8890872965260117, 3.060660171779821],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 4.06066017177982, 0.1109127034739883],
    ],
  );
});

it('bracket 2 overhang padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b3, b4],
    [b1, b2],
    { bracketTopPadding: 2, bracketOverhangPadding: 6, bracketOverhangLength: 4 },
    base => Math.PI / 4,
  );

  expect(qbb.overhangPaddingBracket2).toBeCloseTo(6, 6);
  
  qbb.setOverhangPaddingBracket2(3.5, base => Math.PI / 4);
  expect(qbb.overhangPaddingBracket2).toBeCloseTo(3.5, 6);

  dBracketCheck(
    qbb._bracket2.attr('d'),
    [
      ['M', -2.8890872965260117, 3.060660171779821],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 4.06066017177982, 0.1109127034739883],
    ],
  );
});

it('bracket 1 overhang length getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b1, b2],
    [b3, b4],
    { bracketTopPadding: 2, bracketOverhangPadding: 3.5, bracketOverhangLength: 4 },
    base => Math.PI / 4,
  );

  expect(qbb.overhangLengthBracket1).toBeCloseTo(4, 6);
  
  qbb.setOverhangLengthBracket1(1, base => Math.PI / 4);
  expect(qbb.overhangLengthBracket1).toBeCloseTo(1, 6);

  dBracketCheck(
    qbb._bracket1.attr('d'),
    [
      ['M', -0.7677669529663687, 5.181980515339463],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 6.181980515339463, 2.2322330470336307],
    ],
  );
});

it('bracket 2 overhang length getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b3, b4],
    [b1, b2],
    { bracketTopPadding: 2, bracketOverhangPadding: 3.5, bracketOverhangLength: 4 },
    base => Math.PI / 4,
  );

  expect(qbb.overhangLengthBracket2).toBeCloseTo(4, 6);
  
  qbb.setOverhangLengthBracket2(1, base => Math.PI / 4);
  expect(qbb.overhangLengthBracket2).toBeCloseTo(1, 6);

  dBracketCheck(
    qbb._bracket2.attr('d'),
    [
      ['M', -0.7677669529663687, 5.181980515339463],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 6.181980515339463, 2.2322330470336307],
    ],
  );
});

it('reposition', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  let b3 = Base.create(svg, 'G', 3, 4);
  let b4 = Base.create(svg, 'C', 4, 5);

  let qbb = QuadraticBezierBond.createTertiary(
    svg,
    [b1, b2],
    [b3, b4],
    { bracketTopPadding: 2, bracketOverhangPadding: 3.5, bracketOverhangLength: 4 },
    base => Math.PI / 3,
  );

  let xCurveControlPointPrev = qbb.xCurveControlPoint;
  let yCurveControlPointPrev = qbb.yCurveControlPoint;
  let curveHeightPrev = qbb.curveHeight;
  let curveAnglePrev = qbb.curveAngle;

  b1.move(1.5, 2.5);
  b2.move(2.5, 3.5);
  b3.move(3.5, 4.5);
  b4.move(4.5, 5.5);
  qbb.reposition(base => Math.PI / 3);

  dCurveCheck(
    qbb._curve.attr('d'),
    [
      ['M', 3, 4.732050807568877],
      ['Q', xCurveControlPointPrev + 0.5, yCurveControlPointPrev + 0.5, 5, 6.732050807568877],
    ],
  );

  expect(qbb.xCurveEnd1).toBeCloseTo(3, 6);
  expect(qbb.yCurveEnd1).toBeCloseTo(4.732050807568877, 6);
  expect(qbb.xCurveEnd2).toBeCloseTo(5, 6);
  expect(qbb.yCurveEnd2).toBeCloseTo(6.732050807568877, 6);
  expect(qbb.xCurveControlPoint).toBeCloseTo(xCurveControlPointPrev + 0.5, 6);
  expect(qbb.yCurveControlPoint).toBeCloseTo(yCurveControlPointPrev + 0.5, 6);
  expect(qbb.curveHeight).toBeCloseTo(curveHeightPrev, 6);
  expect(qbb.curveAngle).toBeCloseTo(curveAnglePrev, 6);

  dBracketCheck(
    qbb._bracket1.attr('d'),
    [
      ['M', -2.5310889132455374, 2.517949192431123],
      ['L', -0.5310889132455356, 5.982050807568877],
      ['L', 2.5, 4.232050807568877],
      ['L', 3.5, 5.232050807568877],
      ['L', 6.531088913245536, 3.4820508075688767],
      ['L', 4.531088913245534, 0.017949192431122807],
    ],
  );

  expect(qbb.topPaddingBracket1).toBeCloseTo(2, 6);
  expect(qbb.overhangPaddingBracket1).toBeCloseTo(3.5, 6);
  expect(qbb.overhangLengthBracket1).toBeCloseTo(4, 6);

  dBracketCheck(
    qbb._bracket2.attr('d'),
    [
      ['M', -0.5310889132455374, 4.517949192431123],
      ['L', 1.4689110867544644, 7.982050807568877],
      ['L', 4.5, 6.232050807568877],
      ['L', 5.5, 7.232050807568877],
      ['L', 8.531088913245536, 5.4820508075688767],
      ['L', 6.531088913245534, 2.017949192431122807],
    ],
  );

  expect(qbb.topPaddingBracket2).toBeCloseTo(2, 6);
  expect(qbb.overhangPaddingBracket2).toBeCloseTo(3.5, 6);
  expect(qbb.overhangLengthBracket2).toBeCloseTo(4, 6);
});

it('stroke getter and setter', () => {
  let qbb = createExampleBond();

  qbb.stroke = '#123456';

  // test getter
  expect(qbb.stroke).toBe('#123456');

  // check actual values
  expect(qbb._curve.attr('stroke')).toBe('#123456');
  expect(qbb._bracket1.attr('stroke')).toBe('#123456');
  expect(qbb._bracket2.attr('stroke')).toBe('#123456');

  qbb.stroke = 'blue';

  // test getter
  expect(qbb.stroke).toBe('blue');

  // check actual values
  expect(qbb._curve.attr('stroke')).toBe('blue');
  expect(qbb._bracket1.attr('stroke')).toBe('blue');
  expect(qbb._bracket2.attr('stroke')).toBe('blue');
});

it('strokeWidth getter and setter', () => {
  let qbb = createExampleBond();
  
  qbb.strokeWidth = 0.5;
  
  // test getter
  expect(qbb.strokeWidth).toBe(0.5);
  
  // check actual values
  expect(qbb._curve.attr('stroke-width')).toBe(0.5);
  expect(qbb._bracket1.attr('stroke-width')).toBe(0.5);
  expect(qbb._bracket2.attr('stroke-width')).toBe(0.5);
  qbb.strokeWidth = 2;

  // test getter
  expect(qbb.strokeWidth).toBe(2);

  // check actual values
  expect(qbb._curve.attr('stroke-width')).toBe(2);
  expect(qbb._bracket1.attr('stroke-width')).toBe(2);
  expect(qbb._bracket2.attr('stroke-width')).toBe(2);
});

it('bracket 1 opacity getter and setter', () => {
  let qbb = createExampleBond();
  qbb.opacityBracket1 = 0.5;
  expect(qbb.opacityBracket1).toBe(0.5);
  qbb.opacityBracket1 = 0;
  expect(qbb.opacityBracket1).toBe(0);
  qbb.opacityBracket1 = 1;
  expect(qbb.opacityBracket1).toBe(1);
});

it('bracket 2 opacity getter and setter', () => {
  let qbb = createExampleBond();
  qbb.opacityBracket2 = 0.5;
  expect(qbb.opacityBracket2).toBe(0.5);
  qbb.opacityBracket2 = 0;
  expect(qbb.opacityBracket2).toBe(0);
  qbb.opacityBracket2 = 1;
  expect(qbb.opacityBracket2).toBe(1);
});

it('binding mousedown', () => {
  let qbb = createExampleBond();

  let mousedownedCursor = false;
  qbb.bindMousedown(() => mousedownedCursor = true);
  qbb._curve.fire('mousedown');
  expect(mousedownedCursor).toBeTruthy();

  let mousedownedBracket1 = false;
  qbb.bindMousedown(() => mousedownedBracket1 = true);
  qbb._bracket1.fire('mousedown');
  expect(mousedownedBracket1).toBeTruthy();
  
  let mousedownedBracket2 = false;
  qbb.bindMousedown(() => mousedownedBracket2 = true);
  qbb._bracket2.fire('mousedown');
  expect(mousedownedBracket2).toBeTruthy();
});

it('binding dblclick', () => {
  let qbb = createExampleBond();

  let dblclickedCursor = false;
  qbb.bindDblclick(() => dblclickedCursor = true);
  qbb._curve.fire('dblclick');
  expect(dblclickedCursor).toBeTruthy();

  let dblclickedBracket1 = false;
  qbb.bindDblclick(() => dblclickedBracket1 = true);
  qbb._bracket1.fire('dblclick');
  expect(dblclickedBracket1).toBeTruthy();
  
  let dblclickedBracket2 = false;
  qbb.bindDblclick(() => dblclickedBracket2 = true);
  qbb._bracket2.fire('dblclick');
  expect(dblclickedBracket2).toBeTruthy();
});

it('cursor getter and setter', () => {
  let qbb = createExampleBond();

  qbb.cursor = 'pointer';
  expect(qbb.cursor).toBe('pointer');

  qbb.cursor = 'default';
  expect(qbb.cursor).toBe('default');
});
