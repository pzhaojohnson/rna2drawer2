import { NodeSVG } from 'Draw/svg/NodeSVG';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { appendStrungElement } from 'Draw/bonds/strung/add';
import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { toSpecification } from './toSpecification';
import { toSpecifications } from './toSpecification';

let container = null;
let svg = null;

let curve = null;
let curveLength = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  curve = { startPoint: { x: 2, y: -8 }, endPoint: { x: 6, y: -11 } };
  curveLength = 5;
});

afterEach(() => {
  curve = null;
  curveLength = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('toSpecification function', () => {
  test('a strung text', () => {
    let text = createStrungText({ text: 'B', curve, curveLength });
    appendStrungElement(svg, text);
    text.text.id('id1782364');
    text.displacementFromCenter = -9;
    text.displacementFromCurve = { x: 3, y: -8 };
    repositionStrungElement(text, { curve, curveLength });

    let spec1 = toSpecification(text);
    expect(spec1).toStrictEqual({
      type: 'StrungText',
      textId: 'id1782364',
      displacementFromCenter: -9,
      displacementFromCurve: { x: 3, y: -8 },
    });

    // can be converted to and from a JSON string
    let spec2 = JSON.parse(JSON.stringify(spec1));
    expect(spec2).toStrictEqual(spec1);
  });

  test('a strung circle', () => {
    let circle = createStrungCircle({ curve, curveLength });
    appendStrungElement(svg, circle);
    circle.circle.id('id98273519');
    circle.displacementFromCenter = 10;
    circle.displacementFromCurve = { x: 1.1, y: 3.4 };
    repositionStrungElement(circle, { curve, curveLength });

    let spec1 = toSpecification(circle);
    expect(spec1).toStrictEqual({
      type: 'StrungCircle',
      circleId: 'id98273519',
      displacementFromCenter: 10,
      displacementFromCurve: { x: 1.1, y: 3.4 },
    });

    // can be converted to and from a JSON string
    let spec2 = JSON.parse(JSON.stringify(spec1));
    expect(spec2).toStrictEqual(spec1);
  });

  test('a strung triangle', () => {
    let triangle = createStrungTriangle({ curve, curveLength });
    appendStrungElement(svg, triangle);
    triangle.path.id('id109284015');
    triangle.width = 12.8;
    triangle.height = 52;
    triangle.tailsHeight = 0.9;
    triangle.rotation = 0.16;
    triangle.displacementFromCenter = -0.67;
    triangle.displacementFromCurve = { x: -9.1, y: 3.3 };
    repositionStrungElement(triangle, { curve, curveLength });

    let spec1 = toSpecification(triangle);
    expect(spec1).toStrictEqual({
      type: 'StrungTriangle',
      pathId: 'id109284015',
      width: 12.8,
      height: 52,
      tailsHeight: 0.9,
      rotation: 0.16,
      displacementFromCenter: -0.67,
      displacementFromCurve: { x: -9.1, y: 3.3 },
    });

    // can be converted to and from a JSON string
    let spec2 = JSON.parse(JSON.stringify(spec1));
    expect(spec2).toStrictEqual(spec1);
  });

  test('a strung rectangle', () => {
    let rectangle = createStrungRectangle({ curve, curveLength });
    appendStrungElement(svg, rectangle);
    rectangle.path.id('id923875012');
    rectangle.width = 18.2;
    rectangle.height = 19.1;
    rectangle.borderRadius = 0.23;
    rectangle.rotation = -0.34;
    rectangle.displacementFromCenter = 7.8;
    rectangle.displacementFromCurve = { x: 0.9, y: 1.87 };
    repositionStrungElement(rectangle, { curve, curveLength });

    let spec1 = toSpecification(rectangle);
    expect(spec1).toStrictEqual({
      type: 'StrungRectangle',
      pathId: 'id923875012',
      width: 18.2,
      height: 19.1,
      borderRadius: 0.23,
      rotation: -0.34,
      displacementFromCenter: 7.8,
      displacementFromCurve: { x: 0.9, y: 1.87 },
    });

    // can be converted to and from a JSON string
    let spec2 = JSON.parse(JSON.stringify(spec1));
    expect(spec2).toStrictEqual(spec1);
  });
});

test('toSpecifications function', () => {
  let eles = [
    createStrungText({ text: 'W', curve, curveLength }),
    createStrungCircle({ curve, curveLength }),
    createStrungTriangle({ curve, curveLength }),
    createStrungRectangle({ curve, curveLength }),
  ];

  let specs = toSpecifications(eles);
  expect(specs).toStrictEqual([
    toSpecification(eles[0]),
    toSpecification(eles[1]),
    toSpecification(eles[2]),
    toSpecification(eles[3]),
  ]);
});
