import * as SVG from 'Draw/svg/NodeSVG';

import { Base } from 'Draw/bases/Base';

import { StraightBond } from 'Draw/bonds/straight/StraightBond';

import { basePaddingsOverlap } from './basePaddingsOverlap';

let svg = null;

let straightBond = null;

beforeEach(() => {
  svg = SVG.SVG();
  svg.addTo(document.body);

  let base1 = new Base({ text: svg.text('A') });
  let base2 = new Base({ text: svg.text('U') });

  base1.recenter({ x: 33, y: 54 });
  base2.recenter({ x: 808, y: 1012 });

  let line = svg.line(33, 54, 808, 1012);

  straightBond = new StraightBond(line, base1, base2);
});

afterEach(() => {
  straightBond = null;

  svg.remove();
  svg = null;
});

describe('basePaddingsOverlap function', () => {
  test('when base paddings do overlap', () => {
    straightBond.base1.recenter({ x: 33, y: 40 });
    straightBond.base2.recenter({ x: 50, y: 2 });

    straightBond.basePadding1 = 50;
    straightBond.basePadding2 = 60;
    straightBond.reposition();

    expect(basePaddingsOverlap(straightBond)).toBe(true);
  });

  test('when base paddings do not overlap', () => {
    straightBond.base1.recenter({ x: 33, y: 40 });
    straightBond.base2.recenter({ x: 50, y: 2 });

    straightBond.basePadding1 = 5;
    straightBond.basePadding2 = 6;
    straightBond.reposition();

    expect(basePaddingsOverlap(straightBond)).toBe(false);
  });

  test('when base paddings just barely touch', () => {
    // the distance between the base centers is 2
    straightBond.base1.recenter({ x: 0, y: 0 });
    straightBond.base2.recenter({ x: 2, y: 0 });

    // base paddings add up to 2
    straightBond.basePadding1 = 1;
    straightBond.basePadding2 = 1;
    straightBond.reposition();

    expect(basePaddingsOverlap(straightBond)).toBe(true);
  });
});
