import * as SVG from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { translateStrungElement } from './translateStrungElement';

let svg = null;

let straightBond = null;
let quadraticBezierBond = null;

beforeEach(() => {
  svg = SVG.SVG();
  svg.addTo(document.body);

  let text1 = svg.text('A');
  let text2 = svg.text('G');
  let base1 = new Base({ text: text1 });
  let base2 = new Base({ text: text2 });
  base1.recenter({ x: 20, y: 50 });
  base2.recenter({ x: 125, y: 578 });

  let line = svg.line(20, 50, 125, 578);
  straightBond = new StraightBond(line, base1, base2);
  straightBond.basePadding1 = 3;
  straightBond.basePadding2 = 5.5;

  let path = svg.path('M 20 50 Q 79 611 125 578');
  quadraticBezierBond = new QuadraticBezierBond(path, base1, base2);
  quadraticBezierBond.basePadding1 = 1.26;
  quadraticBezierBond.basePadding2 = 8.8;
});

afterEach(() => {
  straightBond = null;
  quadraticBezierBond = null;

  svg.remove();
  svg = null;
});

describe('translateStrungElement function', () => {
  test('translating a strung element towards the lower left', () => {
    let parentBond = straightBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungText({ text: 'W', curve, curveLength });
    let prevTextX = strungElement.text.x();
    translateStrungElement({ strungElement, parentBond, x: -35, y: 20 });
    expect(strungElement.displacementFromCurve.x).toBeCloseTo(38.228691);
    expect(strungElement.displacementFromCurve.y).toBeCloseTo(12.789336);
    // check that reposition function was called on the strung element
    expect(strungElement.text.x()).not.toBeCloseTo(prevTextX);
  });

  test('translating a strung element towards the upper right', () => {
    let parentBond = straightBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungRectangle({ curve, curveLength });
    let prevPathY = strungElement.path.y();
    translateStrungElement({ strungElement, parentBond, x: 18, y: -71 });
    expect(strungElement.displacementFromCurve.x).toBeCloseTo(-31.502448);
    expect(strungElement.displacementFromCurve.y).toBeCloseTo(-66.125605);
    // check that reposition function was called on the strung element
    expect(strungElement.path.y()).not.toBeCloseTo(prevPathY);
  });

  test('large positive displacement from center', () => {
    let parentBond = quadraticBezierBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungText({ curve, curveLength });
    strungElement.displacementFromCenter = 1e5;
    expect(curveLength).toBeLessThan(1e5); // goes beyond curve length
    repositionStrungElement(strungElement, { curve, curveLength });
    translateStrungElement({ strungElement, parentBond, x: 1, y: 1 });
    expect(strungElement.displacementFromCurve.x).toBeCloseTo(1.395446);
    expect(strungElement.displacementFromCurve.y).toBeCloseTo(0.229630);
  });

  test('large negative displacement from center', () => {
    let parentBond = quadraticBezierBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungText({ curve, curveLength });
    strungElement.displacementFromCenter = -1e5;
    expect(curveLength).toBeLessThan(1e5); // goes beyond curve length
    repositionStrungElement(strungElement, { curve, curveLength });
    translateStrungElement({ strungElement, parentBond, x: 1, y: 1 });
    expect(strungElement.displacementFromCurve.x).toBeCloseTo(-0.889922);
    expect(strungElement.displacementFromCurve.y).toBeCloseTo(1.099107);
  });

  test('when the curve length of the parent bond is zero', () => {
    // may result in division by zero
    let parentBond = straightBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungRectangle({ curve, curveLength });
    // make the curve length of the parent bond zero
    parentBond.basePadding1 = 0;
    parentBond.basePadding2 = 0;
    parentBond.base1.recenter({ x: 50, y: 60 });
    parentBond.base2.recenter({ x: 50, y: 60 });
    parentBond.reposition();
    expect(curveLengthOfBond(parentBond)).toBe(0);
    translateStrungElement({ strungElement, parentBond, x: 10, y: -20 });
    // check that displacement from curve is still reasonable
    expect(strungElement.displacementFromCurve.x).toBeCloseTo(-20);
    expect(strungElement.displacementFromCurve.y).toBeCloseTo(10);
  });

  test('when the curve length of the parent bond is close to zero', () => {
    // division by the curve length may result in a value of Infinity
    let parentBond = straightBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungRectangle({ curve, curveLength });
    // make the curve length of the parent bond close to zero
    parentBond.basePadding1 = 0;
    parentBond.basePadding2 = 0;
    parentBond.base1.recenter({ x: 50, y: 60 });
    parentBond.base2.recenter({ x: 50, y: 60 + 1e-12 });
    parentBond.reposition();
    curveLength = curveLengthOfBond(parentBond);
    expect(curveLength).toBeLessThan(1e-11);
    expect(curveLength).toBeGreaterThan(0);
    translateStrungElement({ strungElement, parentBond, x: -88, y: 2.9 });
    // check that displacement from curve is still reasonable
    expect(strungElement.displacementFromCurve.x).toBeCloseTo(88);
    expect(strungElement.displacementFromCurve.y).toBeCloseTo(2.9);
  });

  test('when the curve of the parent bond cannot be determined', () => {
    let parentBond = quadraticBezierBond;
    let curve = curveOfBond(parentBond);
    let curveLength = curveLengthOfBond(parentBond);
    let strungElement = createStrungText({ text: 'W', curve, curveLength });
    parentBond.path.plot('M 2 5'); // missing Q path command
    expect(curveOfBond(parentBond)).toBeUndefined();
    expect(strungElement.displacementFromCurve).toEqual({ x: 0, y: 0 });
    translateStrungElement({ strungElement, parentBond, x: 30, y: 55 });
    // should not have moved the strung element
    expect(strungElement.displacementFromCurve).toEqual({ x: 0, y: 0 });
  });
});
