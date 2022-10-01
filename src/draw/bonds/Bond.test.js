import * as SVG from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';
import { QuadraticBezierBond } from 'Draw/bonds/curved/QuadraticBezierBond';

import { isBond } from './Bond';

let svg = null;

beforeEach(() => {
  svg = SVG.SVG();
  svg.addTo(document.body);
});

afterEach(() => {
  svg.remove();
  svg = null;
});

test('isBond function', () => {
  let base1 = new Base({ text: svg.text('A') });
  let base2 = new Base({ text: svg.text('U') });
  base1.recenter({ x: 30, y: 50 });
  base2.recenter({ x: 100, y: 500 });

  let line = svg.line(30, 50, 100, 500);
  let straightBond = new StraightBond(line, base1, base2);

  let path = svg.path('M 30 50 Q 350 400 100 500');
  let quadraticBezierBond = new QuadraticBezierBond(path, base1, base2);

  expect(isBond(straightBond)).toBe(true);
  expect(isBond(quadraticBezierBond)).toBe(true);

  expect(isBond(base1)).toBe(false);
  expect(isBond(base2)).toBe(false);

  // primitive values
  expect(isBond(undefined)).toBe(false);
  expect(isBond(null)).toBe(false);
  expect(isBond(1)).toBe(false);
  expect(isBond('Bond')).toBe(false);
  expect(isBond(true)).toBe(false);

  // an empty object
  expect(isBond({})).toBe(false);
});
