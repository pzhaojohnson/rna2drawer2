import { NodeSVG } from 'Draw/svg/NodeSVG';
import { repositionStrungElement } from 'Draw/bonds/strung/repositionStrungElement';

import { strungElementContainsNode } from './strungElementContainsNode';
import { strungElementsContainNode } from './strungElementContainsNode';

let container = null;
let svg = null;

let text = null;
let circle = null;
let triangle = null;
let rectangle = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);

  text = {
    type: 'StrungText',
    text: svg.text('W'),
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };

  circle = {
    type: 'StrungCircle',
    circle: svg.circle(20),
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };

  triangle = {
    type: 'StrungTriangle',
    path: svg.path('M 20 30 L 50 60'),
    width: 20,
    height: 30,
    tailsHeight: 0,
    rotation: 0,
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  repositionStrungElement(triangle, {
    curve: { startPoint: { x: 1, y: 2 }, endPoint: { x: 4, y: 6 } },
    curveLength: 5,
  });

  rectangle = {
    type: 'StrungRectangle',
    path: svg.path('M 10 15 L 25 30'),
    width: 40,
    height: 25,
    borderRadius: 0,
    rotation: 0,
    displacementFromCenter: 0,
    displacementFromCurve: { x: 0, y: 0 },
  };
  repositionStrungElement(rectangle, {
    curve: { startPoint: { x: 5, y: 6 }, endPoint: { x: 10, y: 18 } },
    curveLength: 13,
  });
});

afterEach(() => {
  text = null;
  circle = null;
  triangle = null;
  rectangle = null;

  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

test('strungElementContainsNode function', () => {
  // strung elements
  expect(strungElementContainsNode(text, text)).toBeTruthy();
  expect(strungElementContainsNode(text, circle)).toBeFalsy();
  expect(strungElementContainsNode(circle, circle)).toBeTruthy();
  expect(strungElementContainsNode(circle, triangle)).toBeFalsy();
  expect(strungElementContainsNode(triangle, triangle)).toBeTruthy();
  expect(strungElementContainsNode(triangle, rectangle)).toBeFalsy();
  expect(strungElementContainsNode(rectangle, rectangle)).toBeTruthy();
  expect(strungElementContainsNode(rectangle, text)).toBeFalsy();

  // SVG elements
  expect(strungElementContainsNode(text, text.text)).toBeTruthy();
  expect(strungElementContainsNode(text, circle.circle)).toBeFalsy();
  expect(strungElementContainsNode(circle, circle.circle)).toBeTruthy();
  expect(strungElementContainsNode(circle, triangle.path)).toBeFalsy();
  expect(strungElementContainsNode(triangle, triangle.path)).toBeTruthy();
  expect(strungElementContainsNode(triangle, rectangle.path)).toBeFalsy();
  expect(strungElementContainsNode(rectangle, rectangle.path)).toBeTruthy();
  expect(strungElementContainsNode(rectangle, text.text)).toBeFalsy();

  // DOM nodes (doesn't seem to work on Node.js for some reason)
  expect(strungElementContainsNode(text, text.text.node))//.toBeTruthy();
  expect(strungElementContainsNode(text, circle.circle.node)).toBeFalsy();
  expect(strungElementContainsNode(circle, circle.circle.node))//.toBeTruthy();
  expect(strungElementContainsNode(circle, triangle.path.node)).toBeFalsy();
  expect(strungElementContainsNode(triangle, triangle.path.node))//.toBeTruthy();
  expect(strungElementContainsNode(triangle, rectangle.path.node)).toBeFalsy();
  expect(strungElementContainsNode(rectangle, rectangle.path.node))//.toBeTruthy();
  expect(strungElementContainsNode(rectangle, text.text.node)).toBeFalsy();
});

test('strungElementsContainNode function', () => {
  // strung elements
  let eles = [text, triangle];
  expect(strungElementsContainNode(eles, text)).toBeTruthy();
  expect(strungElementsContainNode(eles, circle)).toBeFalsy();
  expect(strungElementsContainNode(eles, triangle)).toBeTruthy();
  expect(strungElementsContainNode(eles, rectangle)).toBeFalsy();

  // SVG elements
  eles = [text, circle, triangle, rectangle];
  expect(strungElementsContainNode(eles, text.text)).toBeTruthy();
  expect(strungElementsContainNode(eles, circle.circle)).toBeTruthy();
  expect(strungElementsContainNode(eles, triangle.path)).toBeTruthy();
  expect(strungElementsContainNode(eles, rectangle.path)).toBeTruthy();
  expect(strungElementsContainNode(eles, svg.circle(20))).toBeFalsy();
  expect(strungElementsContainNode(eles, svg)).toBeFalsy();

  // DOM nodes (doesn't seem to work on Node.js for some reason)
  eles = [text, circle, triangle, rectangle];
  expect(strungElementsContainNode(eles, text.text.node))//.toBeTruthy();
  expect(strungElementsContainNode(eles, circle.circle.node))//.toBeTruthy();
  expect(strungElementsContainNode(eles, triangle.path.node))//.toBeTruthy();
  expect(strungElementsContainNode(eles, rectangle.path.node))//.toBeTruthy();
  expect(strungElementsContainNode(eles, svg.circle(30).node)).toBeFalsy();
  expect(strungElementsContainNode(eles, svg.node)).toBeFalsy();
  expect(strungElementsContainNode(eles, container)).toBeFalsy();
});
