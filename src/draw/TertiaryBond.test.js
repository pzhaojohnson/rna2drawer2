import TertiaryBond from './TertiaryBond';
import createNodeSVG from './createNodeSVG';
import Base from './Base';
import distanceBetween from './distanceBetween';

function exampleBond() {
  let svg = createNodeSVG();
  
  return TertiaryBond.create(
    svg,
    [Base.create(svg, 'A', 1, 2)],
    [Base.create(svg, 'U', 10, 11)],
    b => Math.PI / 3,
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
  let b3 = Base.create(svg, 'l', -1, -3.3);

  // positive positional properties
  let positivePositionalProps = {
    topPadding: 5.5,
    overhangPadding: 3.2,
    overhangLength: 1,
  };

  // side of length one
  dBracketCheck(
    TertiaryBond._dBracket([b1], positivePositionalProps, base => Math.PI / 3),
    [
      ['M', 0.47871870788979676, 7.4971143170299746],
      ['L', 0.9787187078897972, 8.363139720814413],
      ['L', 3.7500000000000004, 6.763139720814412],
      ['L', 6.521281292110205, 5.163139720814412],
      ['L', 6.021281292110205, 4.2971143170299735],
    ],
  );

  let getClockwiseNormalAngleOfBase = (b) => {
    let dict = {};
    dict[b1.id] = Math.PI / 3;
    dict[b2.id] = 2 * Math.PI / 3;
    dict[b3.id] = Math.PI;
    return dict[b.id];
  };

  // side of length greater than one and different angles for each base
  dBracketCheck(
    TertiaryBond._dBracket([b1, b2, b3], positivePositionalProps, getClockwiseNormalAngleOfBase),
    [
      ['M', 0.47871870788979676, 7.4971143170299746],
      ['L', 0.9787187078897972, 8.363139720814413],
      ['L', 3.7500000000000004, 6.763139720814412],
      ['L', -0.7499999999999987, 7.763139720814413],
      ['L', -6.5, -3.3],
      ['L', -6.5, -0.1],
      ['L', -5.5, -0.1],
    ],
  );

  // positional properties of zero
  let positionalPropsOfZero = {
    topPadding: 0,
    overhangPadding: 0,
    overhangLength: 0,
  };

  // clockwise normal angle of zero
  dBracketCheck(
    TertiaryBond._dBracket([b1, b2], positionalPropsOfZero, base => 0),
    [
      ['M', 1, 2],
      ['L', 1, 2],
      ['L', 1, 2],
      ['L', 2, 3],
      ['L', 2, 3],
      ['L', 2, 3],
    ],
  );

  // negative top padding
  let negativePositionalProps = {
    topPadding: -8.1,
    overhangPadding: 1.111,
    overhangLength: 2.45,
  };

  dBracketCheck(
    TertiaryBond._dBracket([b1, b2], negativePositionalProps, base => Math.PI / 4),
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
  let mp = TertiaryBond._bracketMidpoint(bracket);
  expect(mp.x).toBeCloseTo(0.999, 6);
  expect(mp.y).toBeCloseTo(42, 6);
  
  // bracket midpoint for side with even number of bases
  bracket = svg.path('M 1 2 L 0.9 2.0 L -3.4 5.555 L 6.8 7 L -7 -7 L 0 0');
  mp = TertiaryBond._bracketMidpoint(bracket);
  expect(mp.x).toBeCloseTo((-3.4 + 6.8) / 2, 6);
  expect(mp.y).toBeCloseTo((5.555 + 7) / 2, 6);
  
  // bracket midpoint for side with odd number of bases (greater than one)
  bracket = svg.path('M 1 2 L 3 4 L 5 6 L 7.996 -0.889 L 0 0 L 3 4 L 2 1');
  mp = TertiaryBond._bracketMidpoint(bracket);
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
    TertiaryBond._dCurve(bracket1, bracket2, positionalProps),
    [
      ['M', 5, 6],
      ['Q', 6.464466094067262, 14.535533905932738, 15, 16],
    ],
  );

  // curve ends zero distance apart
  bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  bracket2 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
  positionalProps = { height: 5, angle: Math.PI / 2 };
  let d = TertiaryBond._dCurve(bracket1, bracket2, positionalProps);
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
    TertiaryBond._dCurve(bracket1, bracket2, positionalProps),
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
    TertiaryBond._dCurve(bracket1, bracket2, positionalProps),
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
    TertiaryBond._dCurve(bracket1, bracket2, positionalProps),
    [
      ['M', 5, 6],
      ['Q', 9.222182540694797, 11.777817459305203, 15, 16],
    ],
  );
});

it('mostRecentProps static method', () => {
  TertiaryBond._mostRecentProps.topPaddingBracket1 = 0.887;
  TertiaryBond._mostRecentProps.topPaddingBracket2 = 9.009;
  TertiaryBond._mostRecentProps.overhangPaddingBracket1 = 1.463;
  TertiaryBond._mostRecentProps.overhangPaddingBracket2 = 55.4;
  TertiaryBond._mostRecentProps.overhangLengthBracket1 = 1478;
  TertiaryBond._mostRecentProps.overhangLengthBracket2 = 9.6;
  TertiaryBond._mostRecentProps.stroke = '#243546';
  TertiaryBond._mostRecentProps.strokeWidth = 1.334;
  TertiaryBond._mostRecentProps.curveStrokeDasharray = '1 2 3';

  let mrps = TertiaryBond.mostRecentProps();
  expect(mrps).not.toBe(TertiaryBond._mostRecentProps);
  expect(mrps.topPaddingBracket1).toBe(0.887);
  expect(mrps.topPaddingBracket2).toBe(9.009);
  expect(mrps.overhangPaddingBracket1).toBe(1.463);
  expect(mrps.overhangPaddingBracket2).toBe(55.4);
  expect(mrps.overhangLengthBracket1).toBe(1478);
  expect(mrps.overhangLengthBracket2).toBe(9.6);
  expect(mrps.stroke).toBe('#243546');
  expect(mrps.strokeWidth).toBe(1.334);
  expect(mrps.curveStrokeDasharray).toBe('1 2 3');
});

it('_applyMostRecentProps static method', () => {
  TertiaryBond._mostRecentProps.topPaddingBracket1 = 0.887;
  TertiaryBond._mostRecentProps.topPaddingBracket2 = 9.009;
  TertiaryBond._mostRecentProps.overhangPaddingBracket1 = 1.463;
  TertiaryBond._mostRecentProps.overhangPaddingBracket2 = 55.4;
  TertiaryBond._mostRecentProps.overhangLengthBracket1 = 1478;
  TertiaryBond._mostRecentProps.overhangLengthBracket2 = 9.6;
  TertiaryBond._mostRecentProps.stroke = '#243546';
  TertiaryBond._mostRecentProps.strokeWidth = 1.334;
  TertiaryBond._mostRecentProps.curveStrokeDasharray = '1 2 3';

  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'q', 1, 3);
  let b2 = Base.create(svg, 'w', 5, 6);
  let tb = TertiaryBond.create(svg, [b1], [b2], b => 0);
  TertiaryBond._applyMostRecentProps(tb, b => 0);
  expect(tb.topPaddingBracket1).toBeCloseTo(0.887, 6);
  expect(tb.topPaddingBracket2).toBeCloseTo(9.009, 6);
  expect(tb.overhangPaddingBracket1).toBeCloseTo(1.463, 6);
  expect(tb.overhangPaddingBracket2).toBeCloseTo(55.4, 6);
  expect(tb.overhangLengthBracket1).toBeCloseTo(1478, 6);
  expect(tb.overhangLengthBracket2).toBeCloseTo(9.6, 6);
  expect(tb.stroke).toBe('#243546');
  expect(tb.strokeWidth).toBeCloseTo(1.334, 6);
  expect(tb.curveStrokeDasharray).toBe('1 2 3');
});

it('_copyPropsToMostRecent static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'j', 5, 6);
  let b2 = Base.create(svg, 'a', 4, 5);
  let b3 = Base.create(svg, 'A', 5.55, 6.66);
  let tb = TertiaryBond.create(svg, [b1, b2], [b3], b => 0);
  
  tb.setTopPaddingBracket1(0.8855, b => 0);
  tb.setTopPaddingBracket2(12345, b => 0);
  tb.setOverhangPaddingBracket1(5.43, b => 0);
  tb.setOverhangPaddingBracket2(3.567, b => 0);
  tb.setOverhangLengthBracket1(9.999, b => 0);
  tb.setOverhangLengthBracket2(7.543, b => 0);
  tb.stroke = '#645342';
  tb.strokeWidth = 1.445;
  tb.curveStrokeDasharray = '3 3 2';

  TertiaryBond._copyPropsToMostRecent(tb);
  let mrps = TertiaryBond.mostRecentProps();
  expect(mrps.topPaddingBracket1).toBeCloseTo(0.8855, 6);
  expect(mrps.topPaddingBracket2).toBeCloseTo(12345, 6);
  expect(mrps.overhangPaddingBracket1).toBeCloseTo(5.43, 6);
  expect(mrps.overhangPaddingBracket2).toBeCloseTo(3.567, 6);
  expect(mrps.overhangLengthBracket1).toBeCloseTo(9.999, 6);
  expect(mrps.overhangLengthBracket2).toBeCloseTo(7.543, 6);
  expect(mrps.stroke).toBe('#645342');
  expect(mrps.strokeWidth).toBeCloseTo(1.445, 6);
  expect(mrps.curveStrokeDasharray).toBe('3 3 2');
});

it('fromSavedState static method valid saved state', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'u', 1.1, 2.2);
  let b3 = Base.create(svg, 'k', -1, -0.55);
  let b4 = Base.create(svg, 'm', 0, 0);
  
  function getBaseById(id) {
    let dict = {};
    dict[b1.id] = b1;
    dict[b2.id] = b2;
    dict[b3.id] = b3;
    dict[b4.id] = b4;
    return dict[id];
  }

  function getClockwiseNormalAngleOfBase(b) {
    return Math.PI / 3;
  }

  let tb1 = TertiaryBond.create(svg, [b1, b2], [b3, b4], getClockwiseNormalAngleOfBase);

  let savedState = tb1.savableState();
  let tb2 = TertiaryBond.fromSavedState(savedState, svg, getBaseById, getClockwiseNormalAngleOfBase);

  expect(tb2._curve.id()).toBe(tb1._curve.id());
  expect(tb2._bracket1.id()).toBe(tb1._bracket1.id());
  expect(tb2._bracket2.id()).toBe(tb1._bracket2.id());
  expect(tb2._side1.length).toBe(2);
  expect(tb2._side1[0].id).toBe(b1.id);
  expect(tb2._side1[1].id).toBe(b2.id);
  expect(tb2._side2.length).toBe(2);
  expect(tb2._side2[0].id).toBe(b3.id);
  expect(tb2._side2[1].id).toBe(b4.id);
});

it('fromSavedState static method invalid class name', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'q', 1, 2);
  let b2 = Base.create(svg, 'o', 3, 4);

  function getBaseById(id) {
    let dict = {};
    dict[b1.id] = b1;
    dict[b2.id] = b2;
    return dict[id];
  }

  function getClockwiseNormalAngleOfBase(b) {
    return Math.PI / 5;
  }

  let tb = TertiaryBond.create(svg, [b1], [b2], getClockwiseNormalAngleOfBase);
  let savableState = tb.savableState();

  expect(() => TertiaryBond.fromSavedState(
    savableState, svg, getBaseById, getClockwiseNormalAngleOfBase)
  ).not.toThrow();

  // no class name defined
  delete savableState.className;

  expect(() => TertiaryBond.fromSavedState(
    savableState, svg, getBaseById, getClockwiseNormalAngleOfBase
  )).toThrow();

  // class name is not a string
  savableState.className = 0.1234;
  
  expect(() => TertiaryBond.fromSavedState(
    savableState, svg, getBaseById, getClockwiseNormalAngleOfBase
  )).toThrow();

  // class name is an empty string
  savableState.className = '';

  expect(() => TertiaryBond.fromSavedState(
    savableState, svg, getBaseById, getClockwiseNormalAngleOfBase
  )).toThrow();

  // class name is not TertiaryBond
  savableState.className = 'TertiaryBnd';

  expect(() => TertiaryBond.fromSavedState(
    savableState, svg, getBaseById, getClockwiseNormalAngleOfBase
  )).toThrow();
});

it('fromSavedState static method updates most recent properties', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 1, 2);
  let b2 = Base.create(svg, 'j', 3, 4);

  function getBaseById(id) {
    let dict = {};
    dict[b1.id] = b1;
    dict[b2.id] = b2;
    return dict[id];
  }

  function getClockwiseNormalAngleOfBase(b) {
    return 0;
  }

  let tb = TertiaryBond.create(svg, [b1], [b2], getClockwiseNormalAngleOfBase);
  tb.setTopPaddingBracket1(2.222, getClockwiseNormalAngleOfBase);
  tb.setTopPaddingBracket2(3.333, getClockwiseNormalAngleOfBase);
  tb.setOverhangPaddingBracket1(1.45, getClockwiseNormalAngleOfBase);
  tb.setOverhangPaddingBracket2(4.44, getClockwiseNormalAngleOfBase);
  tb.setOverhangLengthBracket1(3.24, getClockwiseNormalAngleOfBase);
  tb.setOverhangLengthBracket2(5.446, getClockwiseNormalAngleOfBase);
  tb.stroke = '#abbccd';
  tb.strokeWidth = 5.66;
  tb.curveStrokeDasharray = '1 5 4';

  let savedState = tb.savableState();
  TertiaryBond.fromSavedState(savedState, svg, getBaseById, getClockwiseNormalAngleOfBase);
  let mrps = TertiaryBond.mostRecentProps();
  expect(mrps.topPaddingBracket1).toBeCloseTo(2.222, 6);
  expect(mrps.topPaddingBracket2).toBeCloseTo(3.333, 6);
  expect(mrps.overhangPaddingBracket1).toBeCloseTo(1.45, 6);
  expect(mrps.overhangPaddingBracket2).toBeCloseTo(4.44, 6);
  expect(mrps.overhangLengthBracket1).toBeCloseTo(3.24, 6);
  expect(mrps.overhangLengthBracket2).toBeCloseTo(5.446, 6);
  expect(mrps.stroke).toBe('#abbccd');
  expect(mrps.strokeWidth).toBeCloseTo(5.66, 6);
  expect(mrps.curveStrokeDasharray).toBe('1 5 4');
});

it('basic test of create static method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'g', 0, 1);
  let b2 = Base.create(svg, 'c', 5, 32);
  let tb = TertiaryBond.create(svg, [b1], [b2], b => 0);
  expect(typeof(tb) === 'object' && tb !== null).toBeTruthy();
});

it('create static method applies most recent properties', () => {
  TertiaryBond._mostRecentProps.topPaddingBracket1 = 5.664;
  TertiaryBond._mostRecentProps.topPaddingBracket2 = -1.5767;
  TertiaryBond._mostRecentProps.overhangPaddingBracket1 = 1.434;
  TertiaryBond._mostRecentProps.overhangPaddingBracket2 = 12.243;
  TertiaryBond._mostRecentProps.overhangLengthBracket1 = 12.325;
  TertiaryBond._mostRecentProps.overhangLengthBracket2 = 13.3476;
  TertiaryBond._mostRecentProps.stroke = '#113355';
  TertiaryBond._mostRecentProps.strokeWidth = 1.558;
  TertiaryBond._mostRecentProps.curveStrokeDasharray = '4 5 5 3';

  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'g', 1, 3);
  let b2 = Base.create(svg, 'a', 2, 2);
  let tb = TertiaryBond.create(svg, [b1], [b2], b => 0);
  expect(tb.topPaddingBracket1).toBeCloseTo(5.664, 6);
  expect(tb.topPaddingBracket2).toBeCloseTo(-1.5767, 6);
  expect(tb.overhangPaddingBracket1).toBeCloseTo(1.434, 6);
  expect(tb.overhangPaddingBracket2).toBeCloseTo(12.243, 6);
  expect(tb.overhangLengthBracket1).toBeCloseTo(12.325, 6);
  expect(tb.overhangLengthBracket2).toBeCloseTo(13.3476, 6);
  expect(tb.stroke).toBe('#113355');
  expect(tb.strokeWidth).toBeCloseTo(1.558, 6);
  expect(tb.curveStrokeDasharray).toBe('4 5 5 3');
});

it('basic test of constructor', () => {
  let svg = createNodeSVG();
  let curve = svg.path('M 3 3 Q 1 2 3 4');
  let bracket1 = svg.path('M 2 2 L 3 4 L 3 3 L 1 2 L 5 6');
  let bracket2 = svg.path('M 5 6 L 7 7 L 8 9 L 10 9 L 5 6');
  let b1 = Base.create(svg, 'a', 3, 4);
  let b2 = Base.create(svg, 'g', 7, 7);

  expect(
    () => new TertiaryBond(curve, bracket1, bracket2, [b1], [b2], b => 0)
  ).not.toThrow();
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

    return new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
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
    return new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
  }

  // a valid curve
  expect(() => createBondWithCurve(
    svg.path('M 1 2 Q 3 4 5 6')
  )).not.toThrow();

  // curve with an ID that is not a string
  let curve = svg.path('M 1 2 Q 3 4 5 6');
  curve.id(2);
  expect(() => createBondWithCurve(curve)).toThrow();

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
    return new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
  }

  function createBondWithBracket2AndSide2(bracket2, side2) {
    let curve = svg.path('M 1 2 Q 3 4 5 6');
    let bracket1 = svg.path('M 1 2 L 3 4 L 5 6 L 7 8 L 9 10');
    let side1 = [Base.create(svg, 'A', 1, 2)];
    return new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
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
  let tb = new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);

  expect(tb.xCurveEnd1).toBe(1.1);
  expect(tb.yCurveEnd1).toBe(-2);
  expect(tb.xCurveEnd2).toBe(5);
  expect(tb.yCurveEnd2).toBe(-0.86);
  expect(tb.xCurveControlPoint).toBe(3);
  expect(tb.yCurveControlPoint).toBe(0.4);

  expect(tb.curveHeight).toBeCloseTo(1.8306829326784035, 6);
  expect(tb.curveAngle).toBeCloseTo(1.3137271587657995, 6);

  // curve height of zero
  curve = svg.path('M 0 0 Q 1 1 2 2');
  tb = new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
  expect(tb.curveHeight).toBeCloseTo(0, 6);
  expect(typeof(tb.curveAngle)).toBe('number');
  expect(isFinite(tb.curveAngle)).toBeTruthy();
  
  // zero distance between ends
  curve = svg.path('M 0 0 Q 0 1 0 0');
  tb = new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
  expect(tb.curveHeight).toBeCloseTo(1, 6);
  expect(typeof(tb.curveAngle)).toBe('number');
  expect(isFinite(tb.curveAngle)).toBeTruthy();
  
  // curve height of zero and zero distance between ends
  curve = svg.path('M 1.1 1.1 Q 1.1 1.1 1.1 1.1');
  tb = new TertiaryBond(curve, bracket1, bracket2, side1, side2, () => 0);
  expect(tb.curveHeight).toBe(0);
  expect(typeof(tb.curveAngle)).toBe('number');
  expect(isFinite(tb.curveAngle)).toBeTruthy();
});

it('shiftCurveControlPoint', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b1, b2],
    [b3, b4],
    base => Math.PI / 3,
  );

  let segments = tb._curve.array();
  tb.shiftCurveControlPoint(10, -10, base => Math.PI / 3);
  let q = segments[1];
  q[1] += 10;
  q[2] -= 10;

  dCurveCheck(tb._curve.attr('d'), segments);
  expect(tb.xCurveControlPoint).toBeCloseTo(q[1], 6);
  expect(tb.yCurveControlPoint).toBeCloseTo(q[2], 6);
});

it('bracket 1 top padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b1, b2],
    [b3, b4],
    base => Math.PI / 4,
  );

  tb.setOverhangPaddingBracket1(6, base => Math.PI / 4);
  tb.setOverhangLengthBracket1(4, base => Math.PI / 4);

  tb.setTopPaddingBracket1(2, base => Math.PI / 4);
  expect(tb.topPaddingBracket1).toBeCloseTo(2, 6);

  dBracketCheck(
    tb._bracket1.attr('d'),
    [
      ['M', -4.656854249492381, 4.828427124746191],
      ['L', -1.8284271247461898, 7.656854249492381],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 8.65685424949238, 1.1715728752538093],
      ['L', 5.828427124746189, -1.6568542494923806],
    ],
  );

  // updates most recent property
  tb.setTopPaddingBracket1(8.887, base => Math.PI / 4);
  expect(TertiaryBond.mostRecentProps().topPaddingBracket1).toBeCloseTo(8.887, 6);
});

it('bracket 2 top padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b3, b4],
    [b1, b2],
    base => Math.PI / 4,
  );

  tb.setOverhangPaddingBracket2(6, base => Math.PI / 4);
  tb.setOverhangLengthBracket2(4, base => Math.PI / 4);

  tb.setTopPaddingBracket2(2, base => Math.PI / 4);
  expect(tb.topPaddingBracket2).toBeCloseTo(2, 6);

  dBracketCheck(
    tb._bracket2.attr('d'),
    [
      ['M', -4.656854249492381, 4.828427124746191],
      ['L', -1.8284271247461898, 7.656854249492381],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 8.65685424949238, 1.1715728752538093],
      ['L', 5.828427124746189, -1.6568542494923806],
    ],
  );

  // updates most recent property
  tb.setTopPaddingBracket2(4.332, base => Math.PI / 4);
  expect(TertiaryBond.mostRecentProps().topPaddingBracket2).toBeCloseTo(4.332, 6);
});

it('bracket 1 overhang padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b1, b2],
    [b3, b4],
    base => Math.PI / 4,
  );

  tb.setTopPaddingBracket1(2, base => Math.PI / 4);
  tb.setOverhangLengthBracket1(4, base => Math.PI / 4);

  tb.setOverhangPaddingBracket1(3.5, base => Math.PI / 4);
  expect(tb.overhangPaddingBracket1).toBeCloseTo(3.5, 6);

  dBracketCheck(
    tb._bracket1.attr('d'),
    [
      ['M', -2.8890872965260117, 3.060660171779821],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 4.06066017177982, 0.1109127034739883],
    ],
  );

  // updates most recent property
  tb.setOverhangPaddingBracket1(5.667, base => Math.PI / 4);
  expect(TertiaryBond.mostRecentProps().overhangPaddingBracket1).toBeCloseTo(5.667, 6);
});

it('bracket 2 overhang padding getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b3, b4],
    [b1, b2],
    base => Math.PI / 4,
  );

  tb.setTopPaddingBracket2(2, base => Math.PI / 4);
  tb.setOverhangLengthBracket2(4, base => Math.PI / 4);

  tb.setOverhangPaddingBracket2(3.5, base => Math.PI / 4);
  expect(tb.overhangPaddingBracket2).toBeCloseTo(3.5, 6);

  dBracketCheck(
    tb._bracket2.attr('d'),
    [
      ['M', -2.8890872965260117, 3.060660171779821],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 4.06066017177982, 0.1109127034739883],
    ],
  );

  // updates most recent property
  tb.setOverhangPaddingBracket2(1.335, base => Math.PI / 4);
  expect(TertiaryBond.mostRecentProps().overhangPaddingBracket2).toBeCloseTo(1.335, 6);
});

it('bracket 1 overhang length getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b1, b2],
    [b3, b4],
    base => Math.PI / 4,
  );

  tb.setTopPaddingBracket1(2, base => Math.PI / 4);
  tb.setOverhangPaddingBracket1(3.5, base => Math.PI / 4);

  tb.setOverhangLengthBracket1(1, base => Math.PI / 4);
  expect(tb.overhangLengthBracket1).toBeCloseTo(1, 6);

  dBracketCheck(
    tb._bracket1.attr('d'),
    [
      ['M', -0.7677669529663687, 5.181980515339463],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 6.181980515339463, 2.2322330470336307],
    ],
  );

  // updates most recent property
  tb.setOverhangLengthBracket1(3.445, base => Math.PI / 4);
  expect(TertiaryBond.mostRecentProps().overhangLengthBracket1).toBeCloseTo(3.445, 6);
});

it('bracket 2 overhang length getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 3, 4);
  let b3 = Base.create(svg, 'G', 5, 6);
  let b4 = Base.create(svg, 'C', 7, 8);

  let tb = TertiaryBond.create(
    svg,
    [b3, b4],
    [b1, b2],
    base => Math.PI / 4,
  );

  tb.setTopPaddingBracket2(2, base => Math.PI / 4);
  tb.setOverhangPaddingBracket2(3.5, base => Math.PI / 4);

  tb.setOverhangLengthBracket2(1, base => Math.PI / 4);
  expect(tb.overhangLengthBracket2).toBeCloseTo(1, 6);

  dBracketCheck(
    tb._bracket2.attr('d'),
    [
      ['M', -0.7677669529663687, 5.181980515339463],
      ['L', -0.06066017177982097, 5.889087296526011],
      ['L', 2.414213562373095, 3.414213562373095],
      ['L', 4.414213562373095, 5.414213562373095],
      ['L', 6.889087296526011, 2.939339828220178],
      ['L', 6.181980515339463, 2.2322330470336307],
    ],
  );

  // updates most recent property
  tb.setOverhangLengthBracket2(1.345, base => Math.PI / 4);
  expect(TertiaryBond.mostRecentProps().overhangLengthBracket2).toBeCloseTo(1.345, 6);
});

it('reposition method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'U', 2, 3);
  let b3 = Base.create(svg, 'G', 3, 4);
  let b4 = Base.create(svg, 'C', 4, 5);

  let tb = TertiaryBond.create(
    svg,
    [b1, b2],
    [b3, b4],
    base => Math.PI / 3,
  );

  tb.setTopPaddingBracket1(2, base => Math.PI / 3);
  tb.setTopPaddingBracket2(2, base => Math.PI / 3);
  tb.setOverhangPaddingBracket1(3.5, base => Math.PI / 3);
  tb.setOverhangPaddingBracket2(3.5, base => Math.PI / 3);
  tb.setOverhangLengthBracket1(4, base => Math.PI / 3);
  tb.setOverhangLengthBracket2(4, base => Math.PI / 3);

  let xCurveControlPointPrev = tb.xCurveControlPoint;
  let yCurveControlPointPrev = tb.yCurveControlPoint;
  let curveHeightPrev = tb.curveHeight;
  let curveAnglePrev = tb.curveAngle;

  b1.move(1.5, 2.5);
  b2.move(2.5, 3.5);
  b3.move(3.5, 4.5);
  b4.move(4.5, 5.5);
  tb.reposition(base => Math.PI / 3);

  dCurveCheck(
    tb._curve.attr('d'),
    [
      ['M', 3, 4.732050807568877],
      ['Q', xCurveControlPointPrev + 0.5, yCurveControlPointPrev + 0.5, 5, 6.732050807568877],
    ],
  );

  expect(tb.xCurveEnd1).toBeCloseTo(3, 6);
  expect(tb.yCurveEnd1).toBeCloseTo(4.732050807568877, 6);
  expect(tb.xCurveEnd2).toBeCloseTo(5, 6);
  expect(tb.yCurveEnd2).toBeCloseTo(6.732050807568877, 6);
  expect(tb.xCurveControlPoint).toBeCloseTo(xCurveControlPointPrev + 0.5, 6);
  expect(tb.yCurveControlPoint).toBeCloseTo(yCurveControlPointPrev + 0.5, 6);
  expect(tb.curveHeight).toBeCloseTo(curveHeightPrev, 6);
  expect(tb.curveAngle).toBeCloseTo(curveAnglePrev, 6);

  dBracketCheck(
    tb._bracket1.attr('d'),
    [
      ['M', -2.5310889132455374, 2.517949192431123],
      ['L', -0.5310889132455356, 5.982050807568877],
      ['L', 2.5, 4.232050807568877],
      ['L', 3.5, 5.232050807568877],
      ['L', 6.531088913245536, 3.4820508075688767],
      ['L', 4.531088913245534, 0.017949192431122807],
    ],
  );

  expect(tb.topPaddingBracket1).toBeCloseTo(2, 6);
  expect(tb.overhangPaddingBracket1).toBeCloseTo(3.5, 6);
  expect(tb.overhangLengthBracket1).toBeCloseTo(4, 6);

  dBracketCheck(
    tb._bracket2.attr('d'),
    [
      ['M', -0.5310889132455374, 4.517949192431123],
      ['L', 1.4689110867544644, 7.982050807568877],
      ['L', 4.5, 6.232050807568877],
      ['L', 5.5, 7.232050807568877],
      ['L', 8.531088913245536, 5.4820508075688767],
      ['L', 6.531088913245534, 2.017949192431122807],
    ],
  );

  expect(tb.topPaddingBracket2).toBeCloseTo(2, 6);
  expect(tb.overhangPaddingBracket2).toBeCloseTo(3.5, 6);
  expect(tb.overhangLengthBracket2).toBeCloseTo(4, 6);
});

it('stroke getter and setter', () => {
  let tb = exampleBond();

  tb.stroke = '#123456';

  // test getter
  expect(tb.stroke).toBe('#123456');

  // check actual values
  expect(tb._curve.attr('stroke')).toBe('#123456');
  expect(tb._bracket1.attr('stroke')).toBe('#123456');
  expect(tb._bracket2.attr('stroke')).toBe('#123456');

  tb.stroke = 'blue';

  // test getter
  expect(tb.stroke).toBe('blue');

  // check actual values
  expect(tb._curve.attr('stroke')).toBe('blue');
  expect(tb._bracket1.attr('stroke')).toBe('blue');
  expect(tb._bracket2.attr('stroke')).toBe('blue');

  // updates most recent property
  expect(TertiaryBond.mostRecentProps().stroke).toBe('blue');
});

it('strokeWidth getter and setter', () => {
  let tb = exampleBond();
  
  tb.strokeWidth = 0.5;
  
  // test getter
  expect(tb.strokeWidth).toBe(0.5);
  
  // check actual values
  expect(tb._curve.attr('stroke-width')).toBe(0.5);
  expect(tb._bracket1.attr('stroke-width')).toBe(0.5);
  expect(tb._bracket2.attr('stroke-width')).toBe(0.5);
  tb.strokeWidth = 2;

  // test getter
  expect(tb.strokeWidth).toBe(2);

  // check actual values
  expect(tb._curve.attr('stroke-width')).toBe(2);
  expect(tb._bracket1.attr('stroke-width')).toBe(2);
  expect(tb._bracket2.attr('stroke-width')).toBe(2);

  // updates most recent property
  expect(TertiaryBond.mostRecentProps().strokeWidth).toBe(2);
});

it('curveStrokeDasharray getter and setter', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'a', 1, 3);
  let b2 = Base.create(svg, 'G', 5, 6);
  let tb = TertiaryBond.create(svg, [b1], [b2], b => 0);
  tb.curveStrokeDasharray = '1 3 3 5';

  // check getter
  expect(tb.curveStrokeDasharray).toBe('1 3 3 5');

  // check actual value
  expect(tb._curve.attr('stroke-dasharray')).toBe('1 3 3 5');

  // update most recent property
  expect(TertiaryBond.mostRecentProps().curveStrokeDasharray).toBe('1 3 3 5');
});

it('bracket 1 opacity getter and setter', () => {
  let tb = exampleBond();
  tb.opacityBracket1 = 0.5;
  expect(tb.opacityBracket1).toBe(0.5);
  tb.opacityBracket1 = 0;
  expect(tb.opacityBracket1).toBe(0);
  tb.opacityBracket1 = 1;
  expect(tb.opacityBracket1).toBe(1);
});

it('bracket 2 opacity getter and setter', () => {
  let tb = exampleBond();
  tb.opacityBracket2 = 0.5;
  expect(tb.opacityBracket2).toBe(0.5);
  tb.opacityBracket2 = 0;
  expect(tb.opacityBracket2).toBe(0);
  tb.opacityBracket2 = 1;
  expect(tb.opacityBracket2).toBe(1);
});

it('binding mousedown', () => {
  let tb = exampleBond();

  let mousedownedCursor = false;
  tb.bindMousedown(() => mousedownedCursor = true);
  tb._curve.fire('mousedown');
  expect(mousedownedCursor).toBeTruthy();

  let mousedownedBracket1 = false;
  tb.bindMousedown(() => mousedownedBracket1 = true);
  tb._bracket1.fire('mousedown');
  expect(mousedownedBracket1).toBeTruthy();
  
  let mousedownedBracket2 = false;
  tb.bindMousedown(() => mousedownedBracket2 = true);
  tb._bracket2.fire('mousedown');
  expect(mousedownedBracket2).toBeTruthy();
});

it('binding dblclick', () => {
  let tb = exampleBond();

  let dblclickedCursor = false;
  tb.bindDblclick(() => dblclickedCursor = true);
  tb._curve.fire('dblclick');
  expect(dblclickedCursor).toBeTruthy();

  let dblclickedBracket1 = false;
  tb.bindDblclick(() => dblclickedBracket1 = true);
  tb._bracket1.fire('dblclick');
  expect(dblclickedBracket1).toBeTruthy();
  
  let dblclickedBracket2 = false;
  tb.bindDblclick(() => dblclickedBracket2 = true);
  tb._bracket2.fire('dblclick');
  expect(dblclickedBracket2).toBeTruthy();
});

it('cursor getter and setter', () => {
  let tb = exampleBond();

  tb.cursor = 'pointer';
  expect(tb.cursor).toBe('pointer');

  tb.cursor = 'default';
  expect(tb.cursor).toBe('default');
});

it('remove method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'q', 1, 3);
  let b2 = Base.create(svg, 'c', 1.11, 2.3);
  let tb = TertiaryBond.create(svg, [b1], [b2], b => 0);

  let curveId = tb._curve.id();
  expect(svg.findOne('#' + curveId)).not.toBe(null);
  let bracketId1 = tb._bracket1.id();
  expect(svg.findOne('#' + bracketId1)).not.toBe(null);
  let bracketId2 = tb._bracket2.id();
  expect(svg.findOne('#' + bracketId2)).not.toBe(null);

  tb.remove();
  expect(svg.findOne('#' + curveId)).toBe(null);
  expect(svg.findOne('#' + bracketId1)).toBe(null);
  expect(svg.findOne('#' + bracketId2)).toBe(null);
});

it('savableState method', () => {
  let svg = createNodeSVG();
  let b1 = Base.create(svg, 'A', 1, 2);
  let b2 = Base.create(svg, 'u', 1.1, 2.2);
  let b3 = Base.create(svg, 'k', -1, -0.55);
  let b4 = Base.create(svg, 'm', 0, 0);
  let tb = TertiaryBond.create(svg, [b1, b2], [b3, b4], b => Math.PI / 3);

  let savableState = tb.savableState();

  expect(savableState.className).toBe('TertiaryBond');
  expect(savableState.curve).toBe(tb._curve.id());
  expect(savableState.bracket1).toBe(tb._bracket1.id());
  expect(savableState.bracket2).toBe(tb._bracket2.id());
  expect(savableState.side1.length).toBe(2);
  expect(savableState.side1[0]).toBe(b1.id);
  expect(savableState.side1[1]).toBe(b2.id);
  expect(savableState.side2.length).toBe(2);
  expect(savableState.side2[0]).toBe(b3.id);
  expect(savableState.side2[1]).toBe(b4.id);
});
