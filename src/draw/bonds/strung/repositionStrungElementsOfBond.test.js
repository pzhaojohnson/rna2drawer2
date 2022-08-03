import { NodeSVG } from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';

import { round } from 'Math/round';

import { repositionStrungElementsOfBond } from './repositionStrungElementsOfBond';

function roundCoordinatesOfPoint(point, places=3) {
  return {
    x: round(point.x, places),
    y: round(point.y, places),
  };
}

function roundedCenterOfStrungElement(strungElement, places=3) {
  let bbox;
  if (strungElement.type == 'StrungText') {
    bbox = strungElement.text.bbox();
  } else if (strungElement.type == 'StrungCircle') {
    bbox = strungElement.circle.bbox();
  } else {
    bbox = strungElement.path.bbox();
  }

  let center = { x: bbox.cx, y: bbox.cy };
  return roundCoordinatesOfPoint(center, places);
}

function roundedCentersOfStrungElements(strungElements, places=3) {
  return strungElements.map(ele => roundedCenterOfStrungElement(ele, places));
}

let container = null;
let svg = null;

let straightBond = null;
let quadraticBezierBond = null;

let strungText1 = null;
let strungText2 = null;
let strungCircle1 = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let text = svg.text('G');
  text.center(50, 60);
  let base1 = new Base({ text });

  text = svg.text('C');
  text.center(200, 1000);
  let base2 = new Base({ text });

  let line = svg.line(1, 2, 3, 4);
  straightBond = new StraightBond(line, base1, base2);
  straightBond.basePadding1 = 3;
  straightBond.basePadding2 = 3;
  straightBond.reposition();

  let path = svg.path('M 1 2 Q 3 4 5 6');
  quadraticBezierBond = new QuadraticBezierBond(path, base1, base2);
  // same base paddings as straight bond
  quadraticBezierBond.basePadding1 = 3;
  quadraticBezierBond.basePadding2 = 3;
  // make straight
  quadraticBezierBond.setControlPointDisplacement({ magnitude: 0, angle: 0 });
  quadraticBezierBond.reposition();

  // straight bond and quadratic bezier bond have the same curve
  let curve = curveOfBond(straightBond);
  let curveLength = curveLengthOfBond(straightBond);

  strungText1 = createStrungText({ text: 'W', curve, curveLength });
  strungText2 = createStrungText({ text: 'B', curve, curveLength });
  strungCircle1 = createStrungCircle({ curve, curveLength });
});

afterEach(() => {
  strungText1 = null;
  strungText2 = null;
  strungCircle1 = null;

  straightBond = null;
  quadraticBezierBond = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('repositionStrungElementsOfBond function', () => {
  test('a straight bond', () => {
    let bond = straightBond;
    addStrungElementToBond({ bond, strungElement: strungText1 });
    addStrungElementToBond({ bond, strungElement: strungText2 });
    addStrungElementToBond({ bond, strungElement: strungCircle1 });
    let strungElements = [strungText1, strungText2, strungCircle1];
    expect(bond.strungElements).toEqual(strungElements);

    let centers1 = roundedCentersOfStrungElements(strungElements, 3);

    // move strung elements out of place
    strungText1.text.dmove(2000, -200);
    strungText2.text.dmove(-58, 222);
    strungCircle1.circle.dmove(100, -300);

    repositionStrungElementsOfBond(bond);

    let centers2 = roundedCentersOfStrungElements(strungElements, 3);
    // strung elements were moved back into place
    expect(centers2).toStrictEqual(centers1);
  });

  test('a quadratic bezier bond', () => {
    let bond = quadraticBezierBond;
    addStrungElementToBond({ bond, strungElement: strungText1 });
    addStrungElementToBond({ bond, strungElement: strungText2 });
    addStrungElementToBond({ bond, strungElement: strungCircle1 });
    let strungElements = [strungText1, strungText2, strungCircle1];
    expect(bond.strungElements).toEqual(strungElements);

    let centers1 = roundedCentersOfStrungElements(strungElements, 3);

    // move strung elements out of place
    strungText1.text.dmove(765, 5467);
    strungText2.text.dmove(-543, -986);
    strungCircle1.circle.dmove(-10, 335);

    repositionStrungElementsOfBond(bond);

    let centers2 = roundedCentersOfStrungElements(strungElements, 3);
    // strung elements were moved back into place
    expect(centers2).toStrictEqual(centers1);
  });

  test('a bond with no strung elements', () => {
    let bond = straightBond;
    expect(bond.strungElements.length).toBe(0);
    expect(
      () => repositionStrungElementsOfBond(bond)
    ).not.toThrow();
  });

  test('a bond whose curve cannot be interpreted', () => {
    let bond = quadraticBezierBond;
    addStrungElementToBond({ bond, strungElement: strungText1 });

    let center1 = roundedCenterOfStrungElement(strungText1, 3);

    bond.path.plot('M 1 2'); // missing "Q" path command
    expect(curveOfBond(bond)).toBeFalsy();
    expect(
      () => repositionStrungElementsOfBond(bond)
    ).not.toThrow();

    let center2 = roundedCenterOfStrungElement(strungText1, 3);
    expect(center2).toStrictEqual(center1); // was not moved
  });
});
