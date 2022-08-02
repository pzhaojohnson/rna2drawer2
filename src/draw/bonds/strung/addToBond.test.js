import { NodeSVG } from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle} from 'Draw/bonds/strung/create';
import { createStrungTriangle} from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { appendStrungElement as appendStrungElementToSvg } from 'Draw/bonds/strung/add';

import { addStrungElementToBond } from './addToBond';
import { removeStrungElementFromBond } from './addToBond';

let container = null;
let svg = null;

let straightBond = null;
let quadraticBezierBond = null;

let text1 = null;
let text2 = null;
let circle1 = null;
let circle2 = null;
let triangle1 = null;
let triangle2 = null;
let rectangle1 = null;
let rectangle2 = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let text = svg.text('A');
  text.center(200, 300);
  let base1 = new Base({ text });

  text = svg.text('U');
  text.center(1000, 1010);
  let base2 = new Base({ text });

  let line = svg.line(1, 2, 3, 4);
  straightBond = new StraightBond(line, base1, base2);
  straightBond.basePadding1 = 6;
  straightBond.basePadding2 = 6;
  straightBond.reposition();

  let path = svg.path('M 1 2 Q 3 4 5 6');
  quadraticBezierBond = new QuadraticBezierBond(path, base1, base2);
  // same base paddings as straight bond
  quadraticBezierBond.basePadding1 = 6;
  quadraticBezierBond.basePadding2 = 6;
  // make straight
  quadraticBezierBond.setControlPointDisplacement = { magnitude: 0, angle: 0 };
  quadraticBezierBond.reposition();

  // straight bond and quadratic bezier bond have the same curve
  let curve = curveOfBond(straightBond);
  let curveLength = curveLengthOfBond(straightBond);

  text1 = createStrungText({ text: 'W', curve, curveLength });
  text2 = createStrungText({ text: 'B', curve, curveLength });
  circle1 = createStrungCircle({ curve, curveLength });
  circle2 = createStrungCircle({ curve, curveLength });
  triangle1 = createStrungTriangle({ curve, curveLength });
  triangle2 = createStrungTriangle({ curve, curveLength });
  rectangle1 = createStrungRectangle({ curve, curveLength });
  rectangle2 = createStrungRectangle({ curve, curveLength });
});

afterEach(() => {
  text1 = null;
  text2 = null;
  circle1 = null;
  circle2 = null;
  triangle1 = null;
  triangle2 = null;
  rectangle1 = null;
  rectangle2 = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('addStrungElementToBond function', () => {
  test('a straight bond', () => {
    let bond = straightBond;
    addStrungElementToBond({ bond, strungElement: text1 });
    // was added to the strung elements array
    expect(bond.strungElements[0]).toBe(text1);
    // was added to the SVG document
    expect(text1.text.root()).toBe(svg);
  });

  test('a quadratic bezier bond', () => {
    let bond = quadraticBezierBond;
    addStrungElementToBond({ bond, strungElement: circle1 });
    // was added to the strung elements array
    expect(bond.strungElements[0]).toBe(circle1);
    // was added to the SVG document
    expect(circle1.circle.root()).toBe(svg);
  });

  test('various indices', () => {
    let bond = straightBond;

    // zero and the strung elements array is empty
    addStrungElementToBond({ bond, strungElement: text1, index: 0 });
    expect(bond.strungElements[0]).toBe(text1);

    // too high
    addStrungElementToBond({ bond, strungElement: circle1, index: 10 });
    expect(bond.strungElements[1]).toBe(circle1); // appended to end

    // negative
    addStrungElementToBond({ bond, strungElement: triangle1, index: -1 });
    // inserted at beginning
    expect(bond.strungElements[0]).toBe(triangle1);

    // the length of the strung elements array
    addStrungElementToBond({ bond, strungElement: rectangle1, index: 3 });
    expect(bond.strungElements[3]).toBe(rectangle1); // appended to end

    // in the middle
    addStrungElementToBond({ bond, strungElement: text2, index: 2 });
    expect(bond.strungElements[2]).toBe(text2);

    // unspecified
    addStrungElementToBond({ bond, strungElement: circle2 });
    expect(bond.strungElements[5]).toBe(circle2); // appended to end

    // finally check entire contents of the strung elements array
    expect(bond.strungElements).toEqual(
      [triangle1, text1, text2, circle1, rectangle1, circle2]
    );
  });

  test('when the bond is not part of an SVG document', () => {
    let bond = quadraticBezierBond;
    bond.path.remove(); // remove from the SVG document
    expect(bond.path.root()).toBeFalsy();

    expect(
      () => addStrungElementToBond({ bond, strungElement: text1 })
    ).not.toThrow();

    // at least was added to the strung elements array
    expect(bond.strungElements[0]).toBe(text1);
  });
});

describe('removeStrungElementFromBond function', () => {
  test('a straight bond', () => {
    let bond = straightBond;
    addStrungElementToBond({ bond, strungElement: text1 });
    expect(bond.strungElements.includes(text1)).toBeTruthy();
    expect(text1.text.root()).toBe(svg);

    removeStrungElementFromBond({ bond, strungElement: text1 });
    // was removed from the strung elements array
    expect(bond.strungElements.includes(text1)).toBeFalsy();
    // was removed from the SVG document
    expect(text1.text.root()).toBeFalsy();
  });

  test('a quadratic bezier bond', () => {
    let bond = quadraticBezierBond;
    addStrungElementToBond({ bond, strungElement: triangle1 });
    expect(bond.strungElements.includes(triangle1)).toBeTruthy();
    expect(triangle1.path.root()).toBe(svg);

    removeStrungElementFromBond({ bond, strungElement: triangle1 });
    // was removed from the strung elements array
    expect(bond.strungElements.includes(triangle1)).toBeFalsy();
    // was removed from the SVG document
    expect(triangle1.path.root()).toBeFalsy();
  });

  test('removing strung elements at various indices', () => {
    let bond = quadraticBezierBond;
    addStrungElementToBond({ bond, strungElement: text1 });
    addStrungElementToBond({ bond, strungElement: text2 });
    addStrungElementToBond({ bond, strungElement: circle1 });
    addStrungElementToBond({ bond, strungElement: circle2 });
    addStrungElementToBond({ bond, strungElement: triangle1 });
    addStrungElementToBond({ bond, strungElement: triangle2 });
    expect(bond.strungElements).toEqual(
      [text1, text2, circle1, circle2, triangle1, triangle2]
    );

    // at the end
    removeStrungElementFromBond({ bond, strungElement: triangle2 });
    expect(bond.strungElements).toEqual(
      [text1, text2, circle1, circle2, triangle1]
    );

    // at the beginning
    removeStrungElementFromBond({ bond, strungElement: text1 });
    expect(bond.strungElements).toEqual(
      [text2, circle1, circle2, triangle1]
    );

    // in the middle
    removeStrungElementFromBond({ bond, strungElement: circle1 });
    expect(bond.strungElements).toEqual(
      [text2, circle2, triangle1]
    );
  });

  test('when the strung element is not part of the bond', () => {
    let bond = straightBond;
    addStrungElementToBond({ bond, strungElement: text1 });
    addStrungElementToBond({ bond, strungElement: circle1 });
    addStrungElementToBond({ bond, strungElement: triangle1 });

    appendStrungElementToSvg(svg, rectangle1);

    expect(
      () => removeStrungElementFromBond({ bond, strungElement: rectangle1 })
    ).not.toThrow();

    // strung elements array is unchanged
    expect(bond.strungElements).toEqual([text1, circle1, triangle1]);

    // strung rectangle was also not removed from the SVG document
    expect(rectangle1.path.root()).toBe(svg);
  });
});
