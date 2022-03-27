import { Drawing } from 'Draw/Drawing';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { distance2D as distance } from 'Math/distance';

import { dotify } from './dotify';
import { squarify } from './dotify';
import { isDot } from './dotify';
import { isSquare } from './dotify';

let container = null;
let drawing = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG });
  drawing.appendTo(container);

  let sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfQWER' });
  bond = addSecondaryBond(drawing, sequence.atPosition(2), sequence.atPosition(5));
});

afterEach(() => {
  bond = null;
  drawing = null;

  container.remove();
  container = null;
});

describe('dotify function', () => {
  it('changes line stroke-linecap to round', () => {
    bond.line.attr('stroke-linecap', 'butt');
    dotify(bond);
    expect(bond.line.attr('stroke-linecap')).toBe('round');
  });

  it('makes line length close to zero', () => {
    bond.base1.recenter({ x: 100, y: 200 });
    bond.base2.recenter({ x: 109, y: 240 });
    bond.reposition();
    bond.basePadding1 = 5;
    bond.basePadding2 = 3;
    expect(bond.basePadding1).toBeCloseTo(5);
    expect(bond.basePadding2).toBeCloseTo(3);
    dotify(bond);
    expect(bond.basePadding1).toBeCloseTo(20.25);
    expect(bond.basePadding2).toBeCloseTo(20.25);
    // total base padding should be slightly less than
    // the distance between the two base centers
    // to prevent the bond from becoming hidden
    expect(2 * 20.5).toBeCloseTo(distance(100, 200, 109, 240));
  });

  test('when the distance between the two base centers is zero', () => {
    bond.base1.recenter({ x: 105, y: 56 });
    bond.base2.recenter({ x: 105, y: 56 });
    bond.reposition();
    dotify(bond);
    expect(bond.basePadding1).toBeCloseTo(-0.25);
    expect(bond.basePadding2).toBeCloseTo(-0.25);
  });

  it('unhides hidden bonds', () => {
    bond.line.attr('opacity', 0); // hide
    dotify(bond);
    expect(bond.line.attr('opacity')).toBe(1); // was unhidden
  });
});

describe('squarify function', () => {
  it('changes line stroke-linecap to square', () => {
    bond.line.attr('stroke-linecap', 'butt');
    squarify(bond);
    expect(bond.line.attr('stroke-linecap')).toBe('square');
  });

  it('makes line length close to zero', () => {
    bond.base1.recenter({ x: 550, y: 250 });
    bond.base2.recenter({ x: 517, y: 306 });
    bond.reposition();
    bond.basePadding1 = 7;
    bond.basePadding2 = 6;
    expect(bond.basePadding1).toBeCloseTo(7);
    expect(bond.basePadding2).toBeCloseTo(6);
    squarify(bond);
    expect(bond.basePadding1).toBeCloseTo(32.25);
    expect(bond.basePadding2).toBeCloseTo(32.25);
    // total base padding should be slightly less than
    // the distance between the two base centers
    // to prevent the bond from becoming hidden
    expect(2 * 32.5).toBeCloseTo(distance(550, 250, 517, 306));
  });

  test('when the distance between the two base centers is zero', () => {
    bond.base1.recenter({ x: 111.2, y: 8 });
    bond.base2.recenter({ x: 111.2, y: 8 });
    bond.reposition();
    squarify(bond);
    expect(bond.basePadding1).toBeCloseTo(-0.25);
    expect(bond.basePadding2).toBeCloseTo(-0.25);
  });

  it('unhides hidden bonds', () => {
    bond.line.attr('opacity', 0); // hide
    squarify(bond);
    expect(bond.line.attr('opacity')).toBe(1); // was unhidden
  });
});

describe('isDot function', () => {
  test('when the distance between the two base centers is positive', () => {
    bond.base1.recenter({ x: 50, y: 60 });
    bond.base2.recenter({ x: 71, y: 80 });
    bond.reposition();
    bond.basePadding1 = 14.25;
    bond.basePadding2 = 14.25;
    bond.line.attr('stroke-linecap', 'round');
    expect(isDot(bond)).toBeTruthy();

    // line stroke-linecap is not round
    expect(isDot(bond)).toBeTruthy();
    bond.line.attr('stroke-linecap', 'square');
    expect(isDot(bond)).toBeFalsy();
    bond.line.attr('stroke-linecap', 'round'); // change back
    expect(isDot(bond)).toBeTruthy();

    // line is too long
    expect(isDot(bond)).toBeTruthy();
    bond.basePadding1 = 13.75;
    bond.basePadding2 = 13.75;
    expect(isDot(bond)).toBeFalsy();
    bond.basePadding1 = 14.25; // change back
    bond.basePadding2 = 14.25;
    expect(isDot(bond)).toBeTruthy();
  });

  test('when the distance between the two base centers is zero', () => {
    bond.base1.recenter({ x: 55, y: 68 });
    bond.base2.recenter({ x: 55, y: 68 });
    bond.reposition();
    bond.basePadding1 = 0;
    bond.basePadding2 = 0;
    bond.line.attr('stroke-linecap', 'round');
    expect(isDot(bond)).toBeTruthy();

    // base paddings are slightly negative
    bond.basePadding1 = -0.25;
    bond.basePadding2 = -0.25;
    expect(isDot(bond)).toBeTruthy();

    // base paddings are too negative
    expect(isDot(bond)).toBeTruthy();
    bond.basePadding1 = -0.75;
    bond.basePadding2 = -0.75;
    expect(isDot(bond)).toBeFalsy();
    bond.basePadding1 = -0.25; // change back
    bond.basePadding2 = -0.25;
    expect(isDot(bond)).toBeTruthy();
  });
});

describe('isSquare function', () => {
  test('when the distance between the two base centers is positive', () => {
    bond.base1.recenter({ x: 91, y: 61 });
    bond.base2.recenter({ x: 67, y: 68 });
    bond.reposition();
    bond.basePadding1 = 12.25;
    bond.basePadding2 = 12.25;
    bond.line.attr('stroke-linecap', 'square');
    expect(isSquare(bond)).toBeTruthy();

    // line stroke-linecap is not square
    expect(isSquare(bond)).toBeTruthy();
    bond.line.attr('stroke-linecap', 'round');
    expect(isSquare(bond)).toBeFalsy();
    bond.line.attr('stroke-linecap', 'square'); // change back
    expect(isSquare(bond)).toBeTruthy();

    // line is too long
    expect(isSquare(bond)).toBeTruthy();
    bond.basePadding1 = 11.75;
    bond.basePadding2 = 11.75;
    expect(isSquare(bond)).toBeFalsy();
    bond.basePadding1 = 12.25; // change back
    bond.basePadding2 = 12.25;
    expect(isSquare(bond)).toBeTruthy();
  });

  test('when the distance between the two base centers is zero', () => {
    bond.base1.recenter({ x: 41, y: 37.6 });
    bond.base2.recenter({ x: 41, y: 37.6 });
    bond.reposition();
    bond.basePadding1 = 0;
    bond.basePadding2 = 0;
    bond.line.attr('stroke-linecap', 'square');
    expect(isSquare(bond)).toBeTruthy();

    // base paddings are slightly negative
    bond.basePadding1 = -0.25;
    bond.basePadding2 = -0.25;
    expect(isSquare(bond)).toBeTruthy();

    // base paddings are too negative
    expect(isSquare(bond)).toBeTruthy();
    bond.basePadding1 = -0.75;
    bond.basePadding2 = -0.75;
    expect(isSquare(bond)).toBeFalsy();
    bond.basePadding1 = -0.25; // change back
    bond.basePadding2 = -0.25;
    expect(isSquare(bond)).toBeTruthy();
  });
});
