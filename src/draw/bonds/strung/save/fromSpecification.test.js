import { NodeSVG } from 'Draw/svg/NodeSVG';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';

import { appendStrungElement } from 'Draw/bonds/strung/add';
import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { toSpecification } from 'Draw/bonds/strung/save/toSpecification';

import { fromSpecification } from './fromSpecification';

let container = null;
let svg = null;

let curve = null;
let curveLength = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  curve = { startPoint: { x: 3, y: 8 }, endPoint: { x: 3, y: 22 } };
  curveLength = 14;
});

afterEach(() => {
  curve = null;
  curveLength = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('fromSpecification function', () => {
  test('a strung text specification', () => {
    let text1 = createStrungText({ text: 'B', curve, curveLength });
    appendStrungElement(svg, text1);
    text1.displacementFromCenter = -8.8;
    text1.displacementFromCurve = { x: 0.81, y: -5 };
    repositionStrungElement(text1, { curve, curveLength });

    let specification = toSpecification(text1);
    let text2 = fromSpecification({ svg, specification });
    expect(text2.type).toBe('StrungText');
    expect(text2.text).toBe(text1.text);
    expect(text2.displacementFromCenter).toBe(-8.8);
    expect(text2.displacementFromCurve).toStrictEqual({ x: 0.81, y: -5 });
  });

  test('a strung circle specification', () => {
    let circle1 = createStrungCircle({ curve, curveLength });
    appendStrungElement(svg, circle1);
    circle1.displacementFromCenter = 6.9;
    circle1.displacementFromCurve = { x: 0.1, y: 11 };
    repositionStrungElement(circle1, { curve, curveLength });

    let specification = toSpecification(circle1);
    let circle2 = fromSpecification({ svg, specification });
    expect(circle2.type).toBe('StrungCircle');
    expect(circle2.circle).toBe(circle1.circle);
    expect(circle2.displacementFromCenter).toBe(6.9);
    expect(circle2.displacementFromCurve).toStrictEqual({ x: 0.1, y: 11 });
  });

  test('a strung triangle specification', () => {
    let triangle1 = createStrungTriangle({ curve, curveLength });
    appendStrungElement(svg, triangle1);
    triangle1.width = 4;
    triangle1.height = 7.2;
    triangle1.tailsHeight = 2;
    triangle1.rotation = -0.9;
    triangle1.displacementFromCenter = 2.5;
    triangle1.displacementFromCurve = { x: -0.8, y: -9 };
    repositionStrungElement(triangle1, { curve, curveLength });

    let specification = toSpecification(triangle1);
    let triangle2 = fromSpecification({ svg, specification });
    expect(triangle2.type).toBe('StrungTriangle');
    expect(triangle2.path).toBe(triangle1.path);
    expect(triangle2.width).toBe(4);
    expect(triangle2.height).toBe(7.2);
    expect(triangle2.tailsHeight).toBe(2);
    expect(triangle2.rotation).toBe(-0.9);
    expect(triangle2.displacementFromCenter).toBe(2.5);
    expect(triangle2.displacementFromCurve).toStrictEqual({ x: -0.8, y: -9 });
  });

  test('a strung rectangle specification', () => {
    let rectangle1 = createStrungRectangle({ curve, curveLength });
    appendStrungElement(svg, rectangle1);
    rectangle1.width = 28;
    rectangle1.height = 17.4;
    rectangle1.borderRadius = 2.3;
    rectangle1.rotation = 1.2;
    rectangle1.displacementFromCenter = 10.2;
    rectangle1.displacementFromCurve = { x: 6, y: 11 };
    repositionStrungElement(rectangle1, { curve, curveLength });

    let specification = toSpecification(rectangle1);
    let rectangle2 = fromSpecification({ svg, specification });
    expect(rectangle2.type).toBe('StrungRectangle');
    expect(rectangle2.path).toBe(rectangle1.path);
    expect(rectangle2.width).toBe(28);
    expect(rectangle2.height).toBe(17.4);
    expect(rectangle2.borderRadius).toBe(2.3);
    expect(rectangle2.rotation).toBe(1.2);
    expect(rectangle2.displacementFromCenter).toBe(10.2);
    expect(rectangle2.displacementFromCurve).toStrictEqual({ x: 6, y: 11 });
  });

  test('when SVG elements cannot be found', () => {
    let text = createStrungText({ text: 'W', curve, curveLength });
    appendStrungElement(svg, text);
    let specification = toSpecification(text);
    expect(() => fromSpecification({ svg, specification })).not.toThrow();
    specification.textId = 'asdf'; // a wrong ID
    expect(() => fromSpecification({ svg, specification })).toThrow();
    specification.textId = undefined; // a missing ID
    expect(() => fromSpecification({ svg, specification })).toThrow();

    let circle = createStrungCircle({ curve, curveLength });
    appendStrungElement(svg, circle);
    specification = toSpecification(circle);
    expect(() => fromSpecification({ svg, specification })).not.toThrow();
    specification.circleId = 'qwer'; // a wrong ID
    expect(() => fromSpecification({ svg, specification })).toThrow();
    specification.circleId = undefined; // a missing ID
    expect(() => fromSpecification({ svg, specification })).toThrow();

    let triangle = createStrungTriangle({ curve, curveLength });
    appendStrungElement(svg, triangle);
    specification = toSpecification(triangle);
    expect(() => fromSpecification({ svg, specification })).not.toThrow();
    specification.pathId = 'zxcv'; // a wrong ID
    expect(() => fromSpecification({ svg, specification })).toThrow();
    specification.pathId = undefined; // a missing ID
    expect(() => fromSpecification({ svg, specification })).toThrow();

    let rectangle = createStrungRectangle({ curve, curveLength });
    appendStrungElement(svg, rectangle);
    specification = toSpecification(rectangle);
    expect(() => fromSpecification({ svg, specification })).not.toThrow();
    specification.pathId = 'ASDF'; // a wrong ID
    expect(() => fromSpecification({ svg, specification })).toThrow();
    specification.pathId = undefined; // a missing ID
    expect(() => fromSpecification({ svg, specification })).toThrow();
  });

  test('missing properties that can be assigned default values', () => {
    let triangle1 = createStrungTriangle({ curve, curveLength });
    appendStrungElement(svg, triangle1);
    let specification = toSpecification(triangle1);
    specification.width = undefined;
    specification.height = undefined;
    specification.tailsHeight = undefined;
    specification.rotation = undefined;
    specification.displacementFromCenter = undefined;
    specification.displacementFromCurve = undefined;

    let triangle2 = fromSpecification({ svg, specification });
    // assigned default values
    expect(triangle2.width).toBe(9);
    expect(triangle2.height).toBe(9);
    expect(triangle2.tailsHeight).toBe(0);
    expect(triangle2.rotation).toBe(0);
    expect(triangle2.displacementFromCenter).toBe(0);
    expect(triangle2.displacementFromCurve).toStrictEqual({ x: 0, y: 0 });

    let rectangle1 = createStrungRectangle({ curve, curveLength });
    appendStrungElement(svg, rectangle1);
    specification = toSpecification(rectangle1);
    specification.borderRadius = undefined;

    let rectangle2 = fromSpecification({ svg, specification });
    // assigned a default border radius value
    expect(rectangle2.borderRadius).toBe(0);
  });
});
