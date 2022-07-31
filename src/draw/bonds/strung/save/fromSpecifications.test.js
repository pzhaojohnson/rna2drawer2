import { NodeSVG } from 'Draw/svg/NodeSVG';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { appendStrungElement } from 'Draw/bonds/strung/add';

import { toSpecification } from 'Draw/bonds/strung/save/toSpecification';
import { fromSpecification } from 'Draw/bonds/strung/save/fromSpecification';

import { fromSpecifications } from './fromSpecifications';

let container = null;
let svg = null;

let curve = null;
let curveLength = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  curve = { startPoint: { x: -2, y: 3 }, endPoint: { x: 8, y: 3 } };
  curveLength = 10;
});

afterEach(() => {
  curve = null;
  curveLength = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

test('fromSpecifications function', () => {
  // non-array inputs
  let specifications = undefined;
  expect(fromSpecifications({ svg, specifications })).toStrictEqual([]);
  specifications = null;
  expect(fromSpecifications({ svg, specifications })).toStrictEqual([]);
  specifications = 'asdf';
  expect(fromSpecifications({ svg, specifications })).toStrictEqual([]);

  let eles1 = [
    createStrungText({ text: 'W', curve, curveLength }),
    createStrungCircle({ curve, curveLength }),
    createStrungTriangle({ curve, curveLength }),
    createStrungRectangle({ curve, curveLength }),
  ];
  eles1.forEach(ele => appendStrungElement(svg, ele));

  specifications = [
    toSpecification(eles1[0]),
    null, // should ignore
    toSpecification(eles1[1]),
    undefined, // should ignore
    toSpecification(eles1[2]),
    'asdf', // should ignore
    toSpecification(eles1[3]),
  ];

  let eles2 = fromSpecifications({ svg, specifications });
  expect(eles2).toStrictEqual([
    fromSpecification({ svg, specification: specifications[0] }),
    fromSpecification({ svg, specification: specifications[2] }),
    fromSpecification({ svg, specification: specifications[4] }),
    fromSpecification({ svg, specification: specifications[6] }),
  ]);
});
