import { NodeSVG } from 'Draw/svg/NodeSVG';
import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { bboxOfStrungElement } from './bboxOfStrungElement';
import { bboxOfStrungElements } from './bboxOfStrungElement';

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('bboxOfStrungElement function', () => {
  test('a strung text', () => {
    let text = {
      type: 'StrungText',
      text: svg.text('B'),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    text.text.attr({ 'font-family': 'Arial', 'font-size': 12, 'font-weight': 400 });
    text.text.center(80, 120);

    let bbox = bboxOfStrungElement(text);
    expect(bbox.x).toBeCloseTo(76.1123046875);
    expect(bbox.y).toBeCloseTo(111.8291015625);
    expect(bbox.width).toBeCloseTo(7.775390625);
    expect(bbox.height).toBeCloseTo(16.341796875);
  });

  test('a strung circle', () => {
    let circle = {
      type: 'StrungCircle',
      circle: svg.circle(20),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    circle.circle.attr({ 'cx': 1000, 'cy': 1050 });

    let bbox = bboxOfStrungElement(circle);
    expect(bbox.x).toBeCloseTo(990);
    expect(bbox.y).toBeCloseTo(1040);
    expect(bbox.width).toBeCloseTo(20);
    expect(bbox.height).toBeCloseTo(20);
  });

  test('a strung triangle', () => {
    let triangle = {
      type: 'StrungTriangle',
      path: svg.path('M 0 0 L 1 1'),
      width: 34,
      height: 22,
      tailsHeight: 0,
      rotation: 0,
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    repositionStrungElement(triangle, {
      curve: { startPoint: { x: 20, y: 30 }, endPoint: { x: 25, y: 30 } },
      curveLength: 5,
    });

    let bbox = bboxOfStrungElement(triangle);
    expect(bbox.x).toBeCloseTo(11.5);
    expect(bbox.y).toBeCloseTo(13);
    expect(bbox.width).toBeCloseTo(22);
    expect(bbox.height).toBeCloseTo(34);
  });

  test('a strung rectangle', () => {
    let rectangle = {
      type: 'StrungRectangle',
      path: svg.path('M 0 0 L 1 1'),
      width: 18,
      height: 22,
      borderRadius: 0,
      rotation: 0,
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    repositionStrungElement(rectangle, {
      curve: { startPoint: { x: 52, y: -3 }, endPoint: { x: 52, y: -11 } },
      curveLength: 8,
    });

    let bbox = bboxOfStrungElement(rectangle);
    expect(bbox.x).toBeCloseTo(43);
    expect(bbox.y).toBeCloseTo(-18);
    expect(bbox.width).toBeCloseTo(18);
    expect(bbox.height).toBeCloseTo(22);
  });
});

describe('bboxOfStrungElements function', () => {
  test('an empty array of strung elements', () => {
    expect(bboxOfStrungElements([])).toBeUndefined();
  });

  test('an array containing one strung element', () => {
    let circle = {
      type: 'StrungCircle',
      circle: svg.circle(50),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    circle.circle.attr({ 'cx': 30, 'cy': 80 });

    let bbox = bboxOfStrungElements([circle]);
    expect(bbox.x).toBeCloseTo(5);
    expect(bbox.y).toBeCloseTo(55);
    expect(bbox.width).toBeCloseTo(50);
    expect(bbox.height).toBeCloseTo(50);
  });

  test('an array containing multiple strung elements', () => {
    let circle1 = {
      type: 'StrungCircle',
      circle: svg.circle(10),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    circle1.circle.attr({ 'cx': 100, 'cy': -20 });

    let circle2 = {
      type: 'StrungCircle',
      circle: svg.circle(30),
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    circle2.circle.attr({ 'cx': 75, 'cy': 55 });

    let triangle = {
      type: 'StrungTriangle',
      path: svg.path('M 1 2 L 3 4'),
      width: 12,
      height: 28,
      tailsHeight: 0,
      rotation: 0,
      displacementFromCenter: 0,
      displacementFromCurve: { x: 0, y: 0 },
    };
    repositionStrungElement(triangle, {
      curve: { startPoint: { x: 5, y: 14 }, endPoint: { x: 11, y: 14 } },
      curveLength: 6,
    });

    let eles = [circle1, circle2, triangle];
    let bbox = bboxOfStrungElements(eles);
    expect(bbox.x).toBeCloseTo(-6);
    expect(bbox.y).toBeCloseTo(-25);
    expect(bbox.x2).toBeCloseTo(105);
    expect(bbox.y2).toBeCloseTo(70);
  });
});
