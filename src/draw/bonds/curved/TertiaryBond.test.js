import * as SVG from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { TertiaryBond } from './TertiaryBond';
import { isTertiaryBond } from './TertiaryBond';

let svg = null;

let base1 = null;
let base2 = null;

let tertiaryBond = null;

beforeEach(() => {
  svg = SVG.SVG();
  svg.addTo(document.body);

  base1 = new Base({ text: svg.text('G') });
  base2 = new Base({ text: svg.text('C') });
  base1.recenter({ x: 1090, y: 19 });
  base2.recenter({ x: 111, y: 712 });

  let path = svg.path('M 1090 19 Q 500 560 111 712');
  tertiaryBond = new TertiaryBond(path, base1, base2);
});

afterEach(() => {
  tertiaryBond = null;

  base1 = null;
  base2 = null;

  svg.remove();
  svg = null;
});

test('isTertiaryBond function', () => {
  expect(isTertiaryBond(tertiaryBond)).toBe(true);

  expect(isTertiaryBond(base1)).toBe(false);
  expect(isTertiaryBond(base2)).toBe(false);

  expect(isTertiaryBond(undefined)).toBe(false);
  expect(isTertiaryBond(null)).toBe(false);
  expect(isTertiaryBond(1)).toBe(false);
  expect(isTertiaryBond('TertiaryBond')).toBe(false);
  expect(isTertiaryBond(true)).toBe(false);
  expect(isTertiaryBond({})).toBe(false);
});
