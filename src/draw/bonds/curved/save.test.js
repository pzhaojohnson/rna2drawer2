import { savableState } from './save';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { Base } from 'Draw/bases/Base';
import { QuadraticBezierBond } from './QuadraticBezierBond';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';
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

  let path = svg.path('M 10 20 Q 30 40 50 60');
  let base1 = Base.create(svg, 'G', 10, 30);
  let base2 = Base.create(svg, 'C', 30, 300);
  bond = new QuadraticBezierBond(path, base1, base2);
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
  let curve = curveOfBond(bond);
  let curveLength = curveLengthOfBond(bond);
  let strungText = createStrungText({ text: 'B', curve, curveLength });
  let strungRectangle = createStrungRectangle({ curve, curveLength });
  addStrungElementToBond({ bond, strungElement: strungText });
  addStrungElementToBond({ bond, strungElement: strungRectangle });

  let saved1 = savableState(bond);
  expect(saved1).toEqual({
    className: 'QuadraticBezierBond',
    pathId: bond.path.id(),
    baseId1: bond.base1.id,
    baseId2: bond.base2.id,
    strungElements: [
      strungElementToSpecification(strungText),
      strungElementToSpecification(strungRectangle),
    ],
  });

  // check that all IDs are defined
  expect(saved1.pathId).toBeTruthy();
  expect(saved1.baseId1).toBeTruthy();
  expect(saved1.baseId2).toBeTruthy();

  let saved2 = JSON.parse(JSON.stringify(saved1));
  expect(saved2).toEqual(saved1);
});
