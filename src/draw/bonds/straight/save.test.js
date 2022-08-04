import { savableState } from './save';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { StraightBond } from './StraightBond';

import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

import { toSpecification as strungElementToSpecification } from 'Draw/bonds/strung/save/toSpecification';

let container = null;
let svg = null;
let bond = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  let line = svg.line(100, 500, 550, 500);
  let base1 = Base.create(svg, 'A', 50, 500);
  let base2 = Base.create(svg, 'T', 600, 500);
  bond = new StraightBond(line, base1, base2);
});

afterEach(() => {
  bond = null;

  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

test('savableState function', () => {
  let lineId = bond.line.id();
  let baseId1 = bond.base1.id;
  let baseId2 = bond.base2.id;
  expect(lineId).toBeTruthy();
  expect(baseId1).toBeTruthy();
  expect(baseId2).toBeTruthy();

  let curve = curveOfBond(bond);
  let curveLength = curveLengthOfBond(bond);
  let strungCircle = createStrungCircle({ curve, curveLength });
  let strungTriangle = createStrungTriangle({ curve, curveLength });
  addStrungElementToBond({ bond, strungElement: strungCircle });
  addStrungElementToBond({ bond, strungElement: strungTriangle });

  let saved1 = savableState(bond);
  expect(saved1).toEqual({
    className: 'StraightBond',
    lineId: lineId,
    baseId1: baseId1,
    baseId2: baseId2,
    strungElements: [
      strungElementToSpecification(strungCircle),
      strungElementToSpecification(strungTriangle),
    ],
  });

  let saved2 = JSON.parse(JSON.stringify(saved1));
  expect(saved2).toEqual(saved1);
});
